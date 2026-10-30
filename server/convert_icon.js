const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico').default;

async function convert() {
    const icon = await pngToIco(path.join(__dirname, 'icon.png'));
    fs.writeFileSync(path.join(__dirname, 'icon.ico'), icon);
    console.log('Generated WinDeck Windows icon from icon.png');
}

convert().catch((error) => {
    console.error('Failed to generate Windows icon:', error);
    process.exitCode = 1;
});
