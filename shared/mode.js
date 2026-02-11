/* TRP Site — Mode switcher
   Three toggles: theme (light/dark), audience (tech/biz/people), language (en/zh)
   Reads/writes localStorage. Swaps DOM text via data-key. Fires event for canvas redraw. */

(function() {

var DEFAULTS = { theme: 'dark', audience: 'tech', lang: 'en' };

function load() {
    try {
        var saved = JSON.parse(localStorage.getItem('trp-mode'));
        return {
            theme: (saved && saved.theme) || DEFAULTS.theme,
            audience: (saved && saved.audience) || DEFAULTS.audience,
            lang: (saved && saved.lang) || DEFAULTS.lang
        };
    } catch(e) { return { theme: DEFAULTS.theme, audience: DEFAULTS.audience, lang: DEFAULTS.lang }; }
}

function save(mode) {
    try { localStorage.setItem('trp-mode', JSON.stringify(mode)); } catch(e) {}
}

var mode = load();

// Apply theme class immediately (before paint)
if (mode.theme === 'light') document.documentElement.classList.add('light');

// Set SITE.active to current audience+lang content
function activate() {
    if (window.SITE && window.SITE.content) {
        var aud = window.SITE.content[mode.audience];
        window.SITE.active = (aud && aud[mode.lang]) || (aud && aud.en) || {};
        window.SITE.colors = (window.SITE.theme && window.SITE.theme[mode.theme]) || {};
    }
}

// Swap all DOM elements with data-key attributes
function swapDOM() {
    if (!window.SITE || !window.SITE.active) return;
    var els = document.querySelectorAll('[data-key]');
    for (var i = 0; i < els.length; i++) {
        var key = els[i].getAttribute('data-key');
        var val = window.SITE.active[key];
        if (val !== undefined) els[i].innerHTML = val;
    }
}

// Apply theme CSS
function applyTheme() {
    if (mode.theme === 'light') {
        document.documentElement.classList.add('light');
    } else {
        document.documentElement.classList.remove('light');
    }
}

// Full refresh: activate content, swap DOM, notify canvases
function refresh() {
    activate();
    swapDOM();
    applyTheme();
    updateToggles();
    window.dispatchEvent(new Event('site-mode-change'));
}

// Build toggle UI in nav
function buildToggles() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    var wrap = document.createElement('div');
    wrap.className = 'mode-toggles';

    // Theme toggle
    var themeBtn = document.createElement('button');
    themeBtn.className = 'mode-btn mode-theme';
    themeBtn.title = 'Toggle light/dark';
    themeBtn.onclick = function() {
        mode.theme = mode.theme === 'dark' ? 'light' : 'dark';
        save(mode); refresh();
    };
    wrap.appendChild(themeBtn);

    // Audience toggle (3-state)
    var audiences = ['tech', 'biz', 'people'];
    var audLabels = { tech: 'TECH', biz: 'BIZ', people: 'ALL' };
    for (var a = 0; a < audiences.length; a++) {
        (function(aud) {
            var btn = document.createElement('button');
            btn.className = 'mode-btn mode-aud';
            btn.setAttribute('data-aud', aud);
            btn.textContent = audLabels[aud];
            btn.onclick = function() {
                mode.audience = aud;
                save(mode); refresh();
            };
            wrap.appendChild(btn);
        })(audiences[a]);
    }

    // Language toggle
    var langs = ['en', 'zh'];
    var langLabels = { en: 'EN', zh: '\u4E2D' };
    for (var l = 0; l < langs.length; l++) {
        (function(lng) {
            var btn = document.createElement('button');
            btn.className = 'mode-btn mode-lang';
            btn.setAttribute('data-lang', lng);
            btn.textContent = langLabels[lng];
            btn.onclick = function() {
                mode.lang = lng;
                save(mode); refresh();
            };
            wrap.appendChild(btn);
        })(langs[l]);
    }

    nav.appendChild(wrap);
}

function updateToggles() {
    // Theme
    var themeBtn = document.querySelector('.mode-theme');
    if (themeBtn) themeBtn.textContent = mode.theme === 'dark' ? '\u263E' : '\u2600';

    // Audience
    var audBtns = document.querySelectorAll('.mode-aud');
    for (var i = 0; i < audBtns.length; i++) {
        audBtns[i].classList.toggle('active', audBtns[i].getAttribute('data-aud') === mode.audience);
    }

    // Language
    var langBtns = document.querySelectorAll('.mode-lang');
    for (var i = 0; i < langBtns.length; i++) {
        langBtns[i].classList.toggle('active', langBtns[i].getAttribute('data-lang') === mode.lang);
    }
}

// Expose for canvas files to read
window.SITE_MODE = mode;

// Init on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        buildToggles(); activate(); swapDOM(); updateToggles();
    });
} else {
    buildToggles(); activate(); swapDOM(); updateToggles();
}

})();
