const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  fetchChart: (opts) => ipcRenderer.invoke('fetch-chart', opts)
});
