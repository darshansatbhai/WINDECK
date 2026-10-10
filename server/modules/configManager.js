const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '../config/pages.json');

const DEFAULT_CONFIG = {
  pages: [
    {
      id: 'page-default',
      name: 'Controls',
      tiles: [
        { id: 't1',  type: 'system', label: 'Volume Up',   icon: '🔊', action: 'volume-up',        payload: {} },
        { id: 't2',  type: 'system', label: 'Volume Down', icon: '🔉', action: 'volume-down',       payload: {} },
        { id: 't3',  type: 'system', label: 'Mute',        icon: '🔇', action: 'volume-mute',       payload: {} },
        { id: 't4',  type: 'system', label: 'Play/Pause',  icon: '⏯️', action: 'media-play-pause',  payload: {} },
        { id: 't5',  type: 'system', label: 'Next Track',  icon: '⏭️', action: 'media-next',        payload: {} },
        { id: 't6',  type: 'system', label: 'Prev Track',  icon: '⏮️', action: 'media-prev',        payload: {} },
        { id: 't7',  type: 'system', label: 'Screenshot',  icon: '📸', action: 'screenshot',        payload: {} },
        { id: 't8',  type: 'system', label: 'Lock Screen', icon: '🔒', action: 'lock-screen',       payload: {} },
        { id: 't9',  type: 'empty',  label: '', icon: '', action: null, payload: {} },
        { id: 't10', type: 'empty',  label: '', icon: '', action: null, payload: {} },
        { id: 't11', type: 'empty',  label: '', icon: '', action: null, payload: {} },
        { id: 't12', type: 'empty',  label: '', icon: '', action: null, payload: {} }
      ]
    }
  ]
};

function loadConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      fs.mkdirSync(path.dirname(CONFIG_FILE), { recursive: true });
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
      return DEFAULT_CONFIG;
    }
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch { return DEFAULT_CONFIG; }
}

function saveConfig(data) {
  try {
    fs.mkdirSync(path.dirname(CONFIG_FILE), { recursive: true });
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch { return false; }
}

module.exports = { loadConfig, saveConfig };
