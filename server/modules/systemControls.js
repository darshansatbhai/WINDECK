const { exec } = require('child_process');

const ps = (cmd) => exec(`powershell -Command "${cmd}"`);

// Inline script for screenshot
const screenshotScript = `
Add-Type -AssemblyName System.Windows.Forms;
Add-Type -AssemblyName System.Drawing;
$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds;
$bitmap = New-Object System.Drawing.Bitmap $screen.Width, $screen.Height;
$graphics = [System.Drawing.Graphics]::FromImage($bitmap);
$graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size);
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss";
$path = "$env:USERPROFILE\\Desktop\\Screenshot_$timestamp.png";
$bitmap.Save($path);
$graphics.Dispose();
$bitmap.Dispose();
Write-Output "Saved: $path"
`.replace(/\n/g, '');

const controls = {
  volumeUp:       () => ps(`(New-Object -ComObject WScript.Shell).SendKeys([char]175)`),
  volumeDown:     () => ps(`(New-Object -ComObject WScript.Shell).SendKeys([char]174)`),
  volumeMute:     () => ps(`(New-Object -ComObject WScript.Shell).SendKeys([char]173)`),
  mediaPlayPause: () => ps(`(New-Object -ComObject WScript.Shell).SendKeys([char]179)`),
  mediaNext:      () => ps(`(New-Object -ComObject WScript.Shell).SendKeys([char]176)`),
  mediaPrev:      () => ps(`(New-Object -ComObject WScript.Shell).SendKeys([char]177)`),
  screenshot:     () => ps(screenshotScript),
  lockScreen:     () => exec(`rundll32.exe user32.dll,LockWorkStation`),
  launchApp:      (appPath) => {
    if (!appPath || appPath.trim() === '') return;
    exec(`start "" "${appPath}"`);
  },
  customMacro:    (command, cb) => {
    if (!command || command.trim() === '') {
      if (cb) cb();
      return;
    }
    exec(command, cb || (() => {}));
  },

  brightnessUp: () => ps(
    `$b=(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightness).CurrentBrightness;` +
    `(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1,[Math]::Min(100,$b+10))`
  ),
  brightnessDown: () => ps(
    `$b=(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightness).CurrentBrightness;` +
    `(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1,[Math]::Max(0,$b-10))`
  ),
  
  getBrightness: () => new Promise((resolve) => {
    exec(`powershell -Command "(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightness).CurrentBrightness"`, (err, stdout) => {
      resolve(parseInt(stdout) || 50);
    });
  }),
  setBrightness: (level) => ps(`(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1, ${level})`),

  getVolume: async () => {
    try {
      const loudness = require('loudness');
      return await loudness.getVolume();
    } catch { return 50; }
  },
  setVolume: async (level) => {
    try {
      const loudness = require('loudness');
      await loudness.setVolume(level);
    } catch (e) { console.error('Volume set error', e); }
  },
  getMuted: async () => {
    try {
      const loudness = require('loudness');
      return await loudness.getMuted();
    } catch { return false; }
  }
};

module.exports = controls;
