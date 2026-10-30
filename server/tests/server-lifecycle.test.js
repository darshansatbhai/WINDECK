const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const Module = require('node:module');
const { io } = require('socket.io-client');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const event = (socket, name) => new Promise((resolve) => socket.once(name, resolve));

function encrypt(data, otp) {
    const key = crypto.createHash('sha256').update(otp + 'windeck_salt').digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    return iv.toString('hex') + ':' + cipher.update(JSON.stringify(data), 'utf8', 'hex') + cipher.final('hex');
}

function decrypt(data, otp) {
    const [iv, value] = data.split(':');
    const key = crypto.createHash('sha256').update(otp + 'windeck_salt').digest();
    const cipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
    return JSON.parse(cipher.update(value, 'hex', 'utf8') + cipher.final('utf8'));
}

async function unusedPort() {
    const listener = net.createServer();
    await new Promise((resolve) => listener.listen(0, '127.0.0.1', resolve));
    const port = listener.address().port;
    await new Promise((resolve) => listener.close(resolve));
    return port;
}

test('server starts and stops explicitly; pairing and file access require authorization', async () => {
    const port = await unusedPort();
    process.env.WINDECK_PORT = String(port);
    const root = fs.mkdtempSync(path.join(process.env.TEMP || os.tmpdir(), 'windeck-test-'));
    const calls = [];
    const originalLoad = Module._load;
    Module._load = function (request, parent, isMain) {
        if (parent?.filename.endsWith(`${path.sep}server.js`)) {
            if (request === 'os') return { ...os, homedir: () => root };
            if (request === 'electron') return { app: { getPath: () => root }, clipboard: { readText: () => '', writeText: () => {} }, shell: { showItemInFolder: () => {} } };
            if (request === 'bonjour-service') return { Bonjour: class { publish() { return { stop() {} }; } destroy() {} } };
            if (request === './modules/mediaMonitor') return { startMediaMonitor: () => async () => {} };
            if (request === './modules/windowMonitor') return { startWindowMonitor: () => () => {} };
            if (request === './modules/systemControls') return { stopPersistentShell() {}, executeMacro(value) { calls.push(value); } };
            if (request === './modules/appDiscovery') return { getStartMenuApps: async () => [] };
        }
        return originalLoad.call(this, request, parent, isMain);
    };
    let server;
    let guest;
    let client;
    let viewer;
    let foreignViewer;
    try {
        server = require('../server');
        Module._load = originalLoad;
        const base = `http://127.0.0.1:${port}`;
        await assert.rejects(fetch(base));
        let otp;
        server.onOtp((data) => { otp = data.otp; });
        await server.startServer();
        server.createRoom('Test PC');
        assert.match(otp, /^\d{6}$/);
        assert.equal((await fetch(`${base}/upload`, { method: 'POST' })).status, 401);
        const file = path.join(root, 'sample.txt');
        fs.writeFileSync(file, 'private file');
        assert.equal((await fetch(`${base}/download-file?path=${encodeURIComponent(file)}`)).status, 404);

        guest = io(base, { transports: ['websocket'], reconnection: false });
        await event(guest, 'connect');
        guest.emit('custom-macro', 'not authorized');
        await wait(100);
        assert.deepEqual(calls, []);

        client = io(base, { transports: ['websocket'], reconnection: false, forceNew: true });
        await event(client, 'connect');
        const authResult = event(client, 'authenticated');
        client.emit('authenticate', { otp, deviceName: 'Test Phone', version: '2.4.0' });
        assert.equal((await authResult).success, true);
        client.emit('custom-macro', encrypt('paired macro', otp));
        await wait(100);
        assert.deepEqual(calls, ['paired macro']);

        viewer = io(base, { transports: ['websocket'], reconnection: false, forceNew: true, auth: { cameraView: true }, extraHeaders: { Origin: base } });
        foreignViewer = io(base, { transports: ['websocket'], reconnection: false, forceNew: true, auth: { cameraView: true }, extraHeaders: { Origin: 'https://example.invalid' } });
        await Promise.all([event(viewer, 'connect'), event(foreignViewer, 'connect')]);
        let leakedFrame = false;
        foreignViewer.on('broadcast-camera-frame', () => { leakedFrame = true; });
        guest.on('broadcast-camera-frame', () => { leakedFrame = true; });
        const frame = event(viewer, 'broadcast-camera-frame');
        client.emit('camera-frame', encrypt('test-frame', otp));
        assert.equal(await frame, 'test-frame');
        await wait(100);
        assert.equal(leakedFrame, false);

        const fileOffer = event(client, 'file-offer');
        server.sendFileToPhone(file);
        const offerUrl = new URL(decrypt(await fileOffer, otp));
        offerUrl.hostname = '127.0.0.1';
        assert.equal(await (await fetch(offerUrl)).text(), 'private file');
        offerUrl.searchParams.delete('token');
        assert.equal((await fetch(offerUrl)).status, 404);

        // Failed attempts are counted across fresh socket connections.
        for (let i = 0; i < 5; i++) {
            const attacker = io(base, { transports: ['websocket'], reconnection: false, forceNew: true });
            await event(attacker, 'connect');
            const response = event(attacker, 'authenticated');
            attacker.emit('authenticate', { otp: 'wrong', deviceName: 'Test', version: '2.4.0' });
            assert.equal((await response).success, false);
            attacker.disconnect();
        }
        const blocked = io(base, { transports: ['websocket'], reconnection: false, forceNew: true });
        await event(blocked, 'connect');
        const blockedResponse = event(blocked, 'authenticated');
        blocked.emit('authenticate', { otp, deviceName: 'Test', version: '2.4.0' });
        assert.match((await blockedResponse).error, /Too many failed attempts/);
        blocked.disconnect();

        await server.stopServer();
        server = null;

        // A port already occupied by another application must fail cleanly.
        const blocker = net.createServer();
        await new Promise((resolve) => blocker.listen(port, '0.0.0.0', resolve));
        delete require.cache[require.resolve('../server')];
        Module._load = function (request, parent, isMain) {
            if (parent?.filename.endsWith(`${path.sep}server.js`)) {
                if (request === 'os') return { ...os, homedir: () => root };
                if (request === 'electron') return { app: { getPath: () => root }, clipboard: { readText: () => '', writeText: () => {} }, shell: { showItemInFolder: () => {} } };
                if (request === 'bonjour-service') return { Bonjour: class { publish() { return { stop() {} }; } destroy() {} } };
                if (request === './modules/mediaMonitor') return { startMediaMonitor: () => async () => {} };
                if (request === './modules/windowMonitor') return { startWindowMonitor: () => () => {} };
                if (request === './modules/systemControls') return { stopPersistentShell() {} };
                if (request === './modules/appDiscovery') return { getStartMenuApps: async () => [] };
            }
            return originalLoad.call(this, request, parent, isMain);
        };
        server = require('../server');
        Module._load = originalLoad;
        await assert.rejects(server.startServer(), { code: 'EADDRINUSE' });
        await server.stopServer();
        server = null;
        assert.equal(blocker.listening, true);
        await new Promise((resolve) => blocker.close(resolve));
        await assert.rejects(fetch(base));

        // A stopped server can be initialized again without keeping its port open.
        delete require.cache[require.resolve('../server')];
        Module._load = function (request, parent, isMain) {
            if (parent?.filename.endsWith(`${path.sep}server.js`)) {
                if (request === 'os') return { ...os, homedir: () => root };
                if (request === 'electron') return { app: { getPath: () => root }, clipboard: { readText: () => '', writeText: () => {} }, shell: { showItemInFolder: () => {} } };
                if (request === 'bonjour-service') return { Bonjour: class { publish() { return { stop() {} }; } destroy() {} } };
                if (request === './modules/mediaMonitor') return { startMediaMonitor: () => async () => {} };
                if (request === './modules/windowMonitor') return { startWindowMonitor: () => () => {} };
                if (request === './modules/systemControls') return { stopPersistentShell() {} };
                if (request === './modules/appDiscovery') return { getStartMenuApps: async () => [] };
            }
            return originalLoad.call(this, request, parent, isMain);
        };
        server = require('../server');
        Module._load = originalLoad;
        await server.startServer();
        server.onOtp((data) => { otp = data.otp; });
        server.createRoom('Test PC');
        assert.equal((await fetch(base)).status, 200);
        for (let i = 0; i < 5; i++) {
            assert.equal((await fetch(`${base}/upload`, { method: 'POST', headers: { 'X-WinDeck-Auth': 'wrong' } })).status, 401);
        }
        assert.equal((await fetch(`${base}/upload`, { method: 'POST', headers: { 'X-WinDeck-Auth': otp } })).status, 429);
        await server.stopServer();
        server = null;
    } finally {
        Module._load = originalLoad;
        guest?.disconnect();
        client?.disconnect();
        viewer?.disconnect();
        foreignViewer?.disconnect();
        if (server) await server.stopServer();
        delete process.env.WINDECK_PORT;
        fs.rmSync(root, { recursive: true, force: true });
    }
});
