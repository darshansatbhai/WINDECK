const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');
const crypto = require('crypto');
// We will start the socket server internally
const startServer = require('./server'); 

let mainWindow;
let tray = null;
let currentOTP = '';

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 700,
    backgroundColor: '#1E1E1E',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    currentOTP = generateOTP();
    mainWindow.webContents.send('update-otp', currentOTP);
    startServer(currentOTP, mainWindow);
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Setup System Tray
  tray = new Tray(path.join(__dirname, 'icon.png')); // Placeholder icon path
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open WinDeck', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Quit', click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip('WinDeck Server');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => mainWindow.show());
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('refresh-otp', () => {
  currentOTP = generateOTP();
  mainWindow.webContents.send('update-otp', currentOTP);
  // Send to server module to update the required OTP
});
