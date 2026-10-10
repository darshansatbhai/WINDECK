const http = require('http');
const { Server } = require('socket.io');
const { exec } = require('child_process');
const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
const { startBroadcasting } = require('./modules/udpBroadcast');
const controls = require('./modules/systemControls');
const { getInstalledApps } = require('./modules/appDiscovery');
const { loadConfig, saveConfig } = require('./modules/configManager');
const { startStatsMonitor } = require('./modules/statsMonitor');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/icon', (req, res) => {
  const exePath = req.query.path;
  if (!exePath) return res.status(400).send('Missing path');
  
  // Create a unique temp file for the icon to avoid race conditions
  const iconId = Math.random().toString(36).substring(7);
  const outPath = path.join(os.tmpdir(), `icon_${iconId}.png`);

  const psCommand = `
    Add-Type -AssemblyName System.Drawing;
    try {
      $icon = [System.Drawing.Icon]::ExtractAssociatedIcon('${exePath.replace(/'/g, "''")}');
      if ($icon) {
        $bitmap = $icon.ToBitmap()
        $ms = New-Object System.IO.MemoryStream
        $bitmap.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
        $bytes = $ms.ToArray()
        [Convert]::ToBase64String($bytes)
        $icon.Dispose()
        $bitmap.Dispose()
        $ms.Dispose()
      }
    } catch {}
  `;
  const b64 = Buffer.from(psCommand, 'utf16le').toString('base64');
  exec(`powershell -EncodedCommand ${b64}`, (err, stdout) => {
    if (err || !stdout.trim()) {
      return res.status(500).send('Failed to extract icon');
    }
    try {
      const imgBuffer = Buffer.from(stdout.trim(), 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400' // Cache for 1 day
      });
      res.end(imgBuffer);
    } catch {
      res.status(500).send('Corrupt icon data');
    }
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const PORT = 8765;

// Serve the dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Authentication Middleware
io.use((socket, next) => {
  // Just accept any connection (Same WiFi is the only requirement)
  return next();
});

io.on('connection', (socket) => {
  console.log(`📱 Phone connected: ${socket.id}`);
  
  // Inform dashboard
  io.emit('device-connected', socket.id);

  // Send PC info on connect, including a new Auth Token
  socket.emit('connected', {
    pcName: os.hostname(),
    version: '2.0.0',
    platform: 'windows',
    token: 'VALID_TOKEN'
  });

  // Config
  socket.on('get-config', () => socket.emit('config', loadConfig()));
  socket.on('save-config', (data) => {
    saveConfig(data);
    socket.emit('action-result', { success: true, message: 'Config saved' });
  });

  // Apps
  socket.on('get-apps', async () => {
    const apps = await getInstalledApps();
    socket.emit('app-list', apps);
  });

  // Status
  socket.on('get-status', async () => {
    const volume = await controls.getVolume();
    const muted = await controls.getMuted();
    const brightness = await controls.getBrightness();
    socket.emit('status', { volume, muted, brightness });
  });

  socket.on('set-volume', (level) => { controls.setVolume(level); });
  socket.on('set-brightness', (level) => { controls.setBrightness(level); });

  // App Launcher
  socket.on('launch-app', (data) => {
    controls.launchApp(data.path);
    socket.emit('action-result', { success: true, message: `Launched ${data.name}` });
  });

  // Custom Macro
  socket.on('custom-macro', (data) => {
    controls.customMacro(data.command, (err) => {
      socket.emit('action-result', {
        success: !err,
        message: err ? `Error: ${err.message}` : 'Macro executed'
      });
    });
  });

  // System Controls
  socket.on('volume-up',        () => controls.volumeUp());
  socket.on('volume-down',      () => controls.volumeDown());
  socket.on('volume-mute',      () => controls.volumeMute());
  socket.on('media-play-pause', () => controls.mediaPlayPause());
  socket.on('media-next',       () => controls.mediaNext());
  socket.on('media-prev',       () => controls.mediaPrev());
  socket.on('brightness-up',    () => controls.brightnessUp());
  socket.on('brightness-down',  () => controls.brightnessDown());
  socket.on('screenshot',       () => controls.screenshot());
  socket.on('lock-screen',      () => controls.lockScreen());

  socket.on('disconnect', () => {
    console.log('📱 Phone disconnected');
  });
});

// Start CPU/RAM stats broadcast every 3 seconds
startStatsMonitor(io);

server.listen(PORT, () => {
  console.log(`✅ WinDeck Server running on port ${PORT}`);
  console.log(`💻 PC Name: ${os.hostname()}`);
  console.log(`📡 Starting UDP auto-discovery broadcast...`);
  startBroadcasting(PORT);
  
  // Launch Chrome in App Mode
  const { exec } = require('child_process');
  exec(`start chrome --app=http://localhost:${PORT}/`);
});
