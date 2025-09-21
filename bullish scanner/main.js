const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.handle('fetch-chart', async (event, { symbol, range='6mo', interval='1d' }) => {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;
    const r = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    return { ok: true, data: r.data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
