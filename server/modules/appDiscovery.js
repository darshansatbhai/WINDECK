const { exec } = require('child_process');

function getInstalledApps() {
  return new Promise((resolve) => {
    // Inline powershell command to get installed apps from start menu
    const script = `
$apps = @()
$startMenuPaths = @(
  "$env:APPDATA\\Microsoft\\Windows\\Start Menu\\Programs",
  "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs"
)
foreach ($menuPath in $startMenuPaths) {
  Get-ChildItem -Path $menuPath -Filter "*.lnk" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($_.FullName)
    if ($shortcut.TargetPath -and $shortcut.TargetPath -ne "" -and $shortcut.TargetPath -like "*.exe") {
      $nameLower = $_.BaseName.ToLower()
      $pathLower = $shortcut.TargetPath.ToLower()
      if ($nameLower -notmatch "uninstall|unins000" -and $pathLower -notmatch "uninstall|unins000") {
        $iconPath = ($shortcut.IconLocation -split ',')[0]
        if (-not $iconPath -or $iconPath -eq '') { $iconPath = $shortcut.TargetPath }
        $iconPath = [System.Environment]::ExpandEnvironmentVariables($iconPath)
        $targetPath = [System.Environment]::ExpandEnvironmentVariables($shortcut.TargetPath)
        $apps += @{ name = $_.BaseName; path = $targetPath; iconPath = $iconPath; isUWP = $false }
      }
    }
  }
}
$uniqueApps = $apps | Sort-Object { $_.name } | Group-Object { $_.name } | ForEach-Object { $_.Group[0] }
$uniqueApps | ConvertTo-Json -Depth 2
    `;

    const b64 = Buffer.from(script, 'utf16le').toString('base64');
    exec(
      `powershell -EncodedCommand ${b64}`,
      { maxBuffer: 1024 * 1024 * 10 },
      (err, stdout) => {
        if (err) { resolve([]); return; }
        try {
          const result = JSON.parse(stdout.trim());
          resolve(Array.isArray(result) ? result : [result]);
        } catch { resolve([]); }
      }
    );
  });
}

module.exports = { getInstalledApps };
