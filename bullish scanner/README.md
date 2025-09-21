# Bullish Screener Desktop (Electron)

## How to Run (Dev)
1. Install Node.js 18+ and npm.
2. Install deps: `npm install`
3. Build UI: `npm run build`
4. Run app: `npm start`

## How to Build Windows EXE
1. On Windows, install Node.js.
2. Run:
   ```
   npm install
   npm run dist
   ```
3. The installer `.exe` will appear in the `dist/` folder.

## GitHub Actions Build
- Push this repo to GitHub.
- Enable Actions.
- Workflow in `.github/workflows/build.yml` will produce a Windows `.exe` as artifact.
