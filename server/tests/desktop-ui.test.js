const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('desktop keeps one white-backed pairing QR and uses the WinDeck icon', () => {
    const root = path.join(__dirname, '..');
    const html = fs.readFileSync(path.join(root, 'desktop_ui.html'), 'utf8');
    const config = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    const icon = fs.readFileSync(path.join(root, 'icon.ico'));
    assert.match(html, /id="qr-container"[^>]*bg-white/);
    assert.equal((html.match(/id="qr-display"/g) || []).length, 1);
    assert.doesNotMatch(html, /qr-code-img/);
    assert.match(html, /<img src="icon\.png"[^>]*alt="WinDeck"/);
    assert.equal(config.build.win.icon, 'icon.ico');
    const sizes = Array.from({ length: icon.readUInt16LE(4) }, (_, index) => icon[6 + index * 16] || 256);
    for (const size of [16, 32, 48, 256]) assert.ok(sizes.includes(size), `Missing ${size}px icon`);
});
