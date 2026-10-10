const dgram = require('dgram');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return '127.0.0.1';
}

function startBroadcasting(port = 8765) {
  const udpServer = dgram.createSocket('udp4');
  udpServer.bind(() => {
    udpServer.setBroadcast(true);
    const ip = getLocalIP();
    const msg = Buffer.from(JSON.stringify({
      service: 'windeck',
      version: '1.0.0',
      pcName: os.hostname(),
      ip,
      port
    }));
    setInterval(() => {
      udpServer.send(msg, 0, msg.length, 55799, '255.255.255.255');
    }, 2000);
    console.log(`📡 Broadcasting as ${os.hostname()} at ${ip}:${port}`);
  });
}

module.exports = { startBroadcasting };
