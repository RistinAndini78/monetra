const { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: 'Monetra WealthFlow',
  });

  const url = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(url);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Create System Tray (Desktop Specific Feature)
  try {
    const trayIcon = nativeImage.createEmpty();
    tray = new Tray(trayIcon);
    
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Open Monetra', click: () => mainWindow.show() },
      { label: 'Check Balance', click: () => {
          mainWindow.show();
          mainWindow.webContents.send('tray-action', 'check-balance');
      }},
      { type: 'separator' },
      { label: 'Exit', click: () => {
          app.isQuiting = true;
          app.quit();
      }}
    ]);

    tray.setToolTip('Monetra WealthFlow');
    tray.setContextMenu(contextMenu);
  } catch (e) {
    console.error('Tray creation failed', e);
  }

  // Global Keyboard Shortcut (Desktop Specific Feature)
  globalShortcut.register('CommandOrControl+Shift+M', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // Multi-window support (Desktop Specific Feature)
  ipcMain.on('open-mini-window', () => {
    const miniWindow = new BrowserWindow({
      width: 400,
      height: 300,
      alwaysOnTop: true,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    });
    miniWindow.loadURL(url + '#/mini');
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

app.whenReady().then(createWindow);

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
