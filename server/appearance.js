(() => {
    const storageKey = 'windeck_desktop_appearance_v1';
    const presets = {
        default: { accent: '#0078d4', background: '#0c0c14' },
        violet: { accent: '#a78bfa', background: '#120d1d' },
        ocean: { accent: '#38bdf8', background: '#07151d' },
        forest: { accent: '#4ade80', background: '#081710' },
        sunset: { accent: '#fb923c', background: '#1a100d' },
    };

    function luminance(hex) {
        const values = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
            .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
        return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
    }

    function validColors(accent, background) {
        return /^#[0-9a-f]{6}$/i.test(accent) && /^#[0-9a-f]{6}$/i.test(background) &&
            luminance(background) <= 0.12 && luminance(accent) >= 0.08;
    }

    function init() {
        const select = document.getElementById('appearance-preset');
        const accentInput = document.getElementById('appearance-accent');
        const backgroundInput = document.getElementById('appearance-background');
        const error = document.getElementById('appearance-error');
        if (!select || !accentInput || !backgroundInput || !error) return;
        let appearance = { preset: 'default', ...presets.default };

        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
            if (saved && (saved.preset === 'custom' || Object.hasOwn(presets, saved.preset)) && validColors(saved.accent, saved.background)) {
                appearance = saved;
            }
        } catch (_) { /* Invalid preferences fall back to the original theme. */ }

        function render() {
            select.value = appearance.preset;
            accentInput.value = appearance.accent;
            backgroundInput.value = appearance.background;
            error.hidden = true;
            if (appearance.preset === 'default') {
                delete document.body.dataset.windeckTheme;
            } else {
                document.body.dataset.windeckTheme = appearance.preset;
                document.body.style.setProperty('--wd-bg', appearance.background);
                document.body.style.setProperty('--wd-accent', appearance.accent);
                document.body.style.setProperty('--wd-on-accent', luminance(appearance.accent) > 0.32 ? '#080808' : '#ffffff');
            }
        }

        function save() {
            try { localStorage.setItem(storageKey, JSON.stringify(appearance)); } catch (_) { /* Keep current session usable. */ }
            render();
        }

        select.addEventListener('change', () => {
            if (select.value === 'custom') return;
            appearance = { preset: select.value, ...presets[select.value] };
            save();
        });
        document.getElementById('appearance-apply').addEventListener('click', () => {
            if (!validColors(accentInput.value, backgroundInput.value)) {
                error.textContent = 'Choose a dark background and a visible accent for readable text.';
                error.hidden = false;
                return;
            }
            appearance = { preset: 'custom', accent: accentInput.value, background: backgroundInput.value };
            save();
        });
        document.getElementById('appearance-reset').addEventListener('click', () => {
            appearance = { preset: 'default', ...presets.default };
            save();
        });
        render();
    }

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
        else init();
    }
    if (typeof module !== 'undefined') module.exports = { presets, luminance, validColors };
})();
