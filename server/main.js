const { app, BrowserWindow, ipcMain, Tray, Menu, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const QRCode = require('qrcode');

let mainWindow;
let serverInstance;
let tray = null;

function initializeServer() {
    const instance = require('./server.js');
    instance.onOtp((otpData) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            const otp = typeof otpData === 'string' ? otpData : otpData.otp;
            const payload = typeof otpData === 'string' ? otpData : JSON.stringify(otpData);
            QRCode.toDataURL(payload, { color: { dark: '#0078d4', light: '#00000000' }, width: 200 }, (err, url) => {
                if (!err && mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('otp-update', { otp, qr: url });
            });
        }
    });
    instance.onClientConnection((connected, deviceName) => {
        if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('connection-status', { connected, deviceName });
    });
    instance.onTelemetry((data) => {
        if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('telemetry-update', data);
    });
    instance.onLayoutChanged((layout) => {
        if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('layout-data', layout);
    });
    return instance;
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#0c0c0e',
            symbolColor: '#ffffff',
            height: 40
        },
        resizable: true,
        backgroundColor: '#0c0c0e',
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('desktop_ui.html');
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        console.log(`[Renderer] ${message} (line ${line})`);
    });

    mainWindow.on('close', function (event) {
        // Kill the app entirely for now (until we build proper System Tray logic in Task 6)
        app.isQuitting = true;
        app.quit();
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // Start the WinDeck Server once the window is ready
    mainWindow.webContents.once('did-finish-load', () => {
        // Auto Updater Events
        autoUpdater.on('update-available', (info) => {
            if (mainWindow) mainWindow.webContents.send('update-available', info);
        });
        autoUpdater.on('update-downloaded', (info) => {
            if (mainWindow) mainWindow.webContents.send('update-downloaded', info);
        });
        autoUpdater.on('error', (err) => {
            if (mainWindow) mainWindow.webContents.send('update-error', err.message);
        });
        
        // Check for updates
        try {
            autoUpdater.checkForUpdates().catch(err => {
                console.error('Update check failed:', err);
                if (mainWindow) mainWindow.webContents.send('update-error', err.message);
            });
        } catch (e) {
            console.error('Update check sync error:', e);
        }
    });
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
    });

    app.on('ready', () => {
        app.setAppUserModelId("com.windeck.server");
        createWindow();
    
    tray = new Tray(path.join(__dirname, 'icon.ico'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show', click: () => { if (mainWindow) mainWindow.show(); } },
        { label: 'Quit', click: () => { app.isQuitting = true; app.quit(); } }
    ]);
    tray.setToolTip('WinDeck Server');
    tray.setContextMenu(contextMenu);
    
    tray.on('double-click', () => {
        if (mainWindow) mainWindow.show();
    });
});

app.on('before-quit', () => {
    if (serverInstance && serverInstance.stopServer) {
        serverInstance.stopServer();
    }
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

// IPC handlers

ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});

ipcMain.on('regenerate-otp', () => {
    if (serverInstance) {
        serverInstance.regenerateOTP();
    }
});

ipcMain.handle('start-server', async (event, roomName) => {
    if (serverInstance) return { id: serverInstance.getEncodedRoomId() };
    const instance = initializeServer();
    serverInstance = instance;
    try {
        await instance.startServer();
        instance.createRoom(roomName);
        return { id: instance.getEncodedRoomId() };
    } catch (error) {
        await instance.stopServer();
        serverInstance = null;
        delete require.cache[require.resolve('./server.js')];
        throw error;
    }
});

ipcMain.handle('stop-server', async () => {
    if (!serverInstance) return;
    await serverInstance.stopServer();
    serverInstance = null;
    delete require.cache[require.resolve('./server.js')];
});

ipcMain.on('disconnect-client', () => {
    if (serverInstance) {
        serverInstance.disconnectClient();
    }
});

const fs = require('fs');
const layoutPath = path.join(app.getPath('userData'), 'layout.json');

ipcMain.on('get-layout', (event) => {
    if (fs.existsSync(layoutPath)) {
        try {
            const data = fs.readFileSync(layoutPath, 'utf8');
            event.reply('layout-data', JSON.parse(data));
        } catch (err) {
            console.error('Failed to read layout:', err);
            event.reply('layout-data', []);
        }
    } else {
        event.reply('layout-data', []);
    }
});

ipcMain.on('save-layout', (event, layout) => {
    try {
        fs.writeFileSync(layoutPath, JSON.stringify(layout));
        if (serverInstance) {
            serverInstance.broadcastLayout(layout);
        }
    } catch (err) {
        console.error('Failed to save layout:', err);
    }
});

ipcMain.handle('select-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Select Application',
        filters: [{ name: 'Applications', extensions: ['exe', 'lnk'] }],
        properties: ['openFile']
    });
    
    if (result.canceled || result.filePaths.length === 0) {
        return null;
    }
    
    const filePath = result.filePaths[0];
    const name = path.basename(filePath, path.extname(filePath));
    return { name, path: filePath };
});

ipcMain.on('request-apps', async (event) => {
    try {
        const apps = await require('./modules/appDiscovery').getStartMenuApps();
        event.reply('system-apps-data', apps || []);
    } catch (err) {
        console.error('Error fetching apps for Electron UI:', err);
        event.reply('system-apps-data', []);
    }
});

ipcMain.on('send-file-to-phone', (event, filePath) => {
    if (serverInstance) {
        serverInstance.sendFileToPhone(filePath);
    }
});
ipcMain.on('trigger-update', () => {
    autoUpdater.quitAndInstall();
});

const systemControlsMod = require('./modules/systemControls');
ipcMain.on('execute-system-action', (event, action) => {
    systemControlsMod.executeAction(action);
});
}




