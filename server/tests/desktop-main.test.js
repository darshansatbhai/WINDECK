const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const Module = require('node:module');
const os = require('node:os');
const path = require('node:path');

test('opening the desktop app does not load or start the server', async () => {
    const app = new EventEmitter();
    app.requestSingleInstanceLock = () => true;
    app.getPath = () => os.tmpdir();
    let appId;
    app.setAppUserModelId = (value) => { appId = value; };
    app.quit = () => {};
    const ipcMain = new EventEmitter();
    const handlers = new Map();
    ipcMain.handle = (name, handler) => handlers.set(name, handler);
    let windowIcon;
    let trayIcon;
    class BrowserWindow extends EventEmitter {
        constructor(options) { super(); windowIcon = options.icon; this.webContents = new EventEmitter(); this.webContents.send = () => {}; }
        loadFile() {}
        isDestroyed() { return false; }
    }
    class Tray extends EventEmitter { constructor(icon) { super(); trayIcon = icon; } setToolTip() {} setContextMenu() {} }
    const updater = new EventEmitter();
    const calls = [];
    const instance = {
        onOtp() {}, onClientConnection() {}, onTelemetry() {}, onLayoutChanged() {},
        async startServer() { calls.push('start'); },
        createRoom(name) { calls.push(`room:${name}`); },
        getEncodedRoomId() { return 'TEST-ROOM'; },
        async stopServer() { calls.push('stop'); },
    };
    const originalLoad = Module._load;
    Module._load = function (request, parent, isMain) {
        if (parent?.filename.endsWith(`${path.sep}main.js`)) {
            if (request === 'electron') return { app, BrowserWindow, ipcMain, Tray, Menu: { buildFromTemplate: () => [] }, dialog: {} };
            if (request === 'electron-updater') return { autoUpdater: updater };
            if (request === 'qrcode') return {};
            if (request === './server.js') { calls.push('load'); return instance; }
            if (request === './modules/systemControls') return {};
            if (request === './modules/appDiscovery') return { getStartMenuApps: async () => [] };
        }
        return originalLoad.call(this, request, parent, isMain);
    };
    try {
        require('../main');
        app.emit('ready');
        assert.equal(appId, 'com.windeck.server');
        assert.equal(path.basename(windowIcon), 'icon.ico');
        assert.equal(path.basename(trayIcon), 'icon.ico');
        const reply = new Promise((resolve) => ipcMain.emit('request-apps', { reply: resolve }));
        await reply;
        assert.deepEqual(calls, []);
        const room = await handlers.get('start-server')({}, 'Studio PC');
        assert.equal(room.id, 'TEST-ROOM');
        assert.deepEqual(calls, ['load', 'start', 'room:Studio PC']);
        await handlers.get('stop-server')();
        assert.deepEqual(calls, ['load', 'start', 'room:Studio PC', 'stop']);
    } finally {
        Module._load = originalLoad;
    }
});
