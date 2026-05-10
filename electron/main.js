const { app, BrowserWindow, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    icon: path.join(__dirname, '../public/pwa-192x192.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startURL = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // IMPLEMENTASI FITUR UNIK DESKTOP: System Tray
  createTray();

  // IMPLEMENTASI FITUR UNIK DESKTOP: Global Keyboard Shortcut
  // Tekan Ctrl+Alt+M untuk memunculkan Monetra ke depan
  globalShortcut.register('CommandOrControl+Alt+M', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function createTray() {
  const iconPath = path.join(__dirname, '../public/pwa-192x192.png');
  tray = new Tray(iconPath);
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Buka Monetra', click: () => mainWindow.show() },
    { label: 'Sembunyikan', click: () => mainWindow.hide() },
    { type: 'separator' },
    { label: 'Keluar', click: () => app.quit() }
  ]);

  tray.setToolTip('Monetra Financial Management');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});
