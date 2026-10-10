const os = require('os');

function getCpuPercent() {
  return new Promise((resolve) => {
    const cpus1 = os.cpus();
    setTimeout(() => {
      const cpus2 = os.cpus();
      let totalIdle = 0, totalTick = 0;
      cpus1.forEach((cpu, i) => {
        const cpu2 = cpus2[i];
        for (const type in cpu2.times) {
          totalTick += cpu2.times[type] - cpu.times[type];
        }
        totalIdle += cpu2.times.idle - cpu.times.idle;
      });
      resolve(Math.round(100 - (100 * totalIdle / totalTick)));
    }, 100);
  });
}

function getRamPercent() {
  const total = os.totalmem();
  const free = os.freemem();
  return Math.round(((total - free) / total) * 100);
}

function startStatsMonitor(io, intervalMs = 3000) {
  setInterval(async () => {
    const cpu = await getCpuPercent();
    const ram = getRamPercent();
    io.emit('stats', { cpu, ram });
  }, intervalMs);
}

module.exports = { startStatsMonitor };
