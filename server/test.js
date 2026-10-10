const io = require('socket.io-client');
const socket = io('http://localhost:8765');

socket.on('connect', () => {
  console.log('✅ Connected to server!');
  
  socket.on('connected', (data) => {
    console.log('Server info:', data);
    
    // Trigger mute test
    console.log('Emitting volume-mute...');
    socket.emit('volume-mute');
  });

  socket.on('action-result', (data) => {
    console.log('Action result:', data);
  });

  setTimeout(() => {
    socket.disconnect();
    process.exit(0);
  }, 2000);
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message);
  process.exit(1);
});
