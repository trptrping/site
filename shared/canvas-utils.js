/* TRP Site — Shared Canvas Utilities
   Extracted from output/index.html. */

// ===== THEME-AWARE COLOR HELPER =====
// Returns RGB triplet from SITE.colors (set by mode.js), with fallback
function C(name, fallback) {
    return (window.SITE && window.SITE.colors && window.SITE.colors[name]) || fallback;
}

// ===== GLOBAL CURSOR STATE =====
const mouse = { x: -1000, y: -1000, active: false };
document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
});
document.addEventListener('mouseleave', () => { mouse.active = false; });

// Helper: get mouse position relative to a canvas's parent
function mouseInCanvas(canvasParent) {
    const r = canvasParent.getBoundingClientRect();
    return { x: mouse.x - r.left, y: mouse.y - r.top, inside: mouse.active && mouse.x >= r.left && mouse.x <= r.right && mouse.y >= r.top && mouse.y <= r.bottom };
}

// ===== SCROLL PROGRESS =====
window.addEventListener('scroll', () => {
    const prog = document.getElementById('prog');
    if (!prog) return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (h > 0) prog.style.width = (window.scrollY / h * 100) + '%';
});

// ===== SECTION REVEAL =====
function initSectionReveal() {
    const sObs = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) e.target.classList.add('v'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.s').forEach(s => sObs.observe(s));
}
document.addEventListener('DOMContentLoaded', initSectionReveal);

// ===== LAZY CANVAS INITIALIZER =====
// Usage: lazyCanvas('element-id', drawFunction, threshold)
function lazyCanvas(elementId, drawFn, threshold = 0.1) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let drawn = false;
    const obs = new IntersectionObserver(es => {
        es.forEach(e => {
            if (!e.isIntersecting || drawn) return;
            drawn = true;
            drawFn();
        });
    }, { threshold });
    obs.observe(el);
}

// ===== TYPING ENGINE (for terminals) =====
function typeInto(el, text, speed, onDone) {
    el.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'cursor-t';
    el.appendChild(cursor);
    let i = 0;
    function tick() {
        if (i < text.length) {
            const ch = text[i] === '\n' ? document.createElement('br') : document.createTextNode(text[i]);
            el.insertBefore(ch, cursor);
            i++;
            setTimeout(tick, text[i-1] === ' ' ? speed * 0.4 : speed);
        } else {
            if (onDone) onDone();
        }
    }
    tick();
    return cursor;
}

function typeRich(el, segments, speed, onDone) {
    el.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'cursor-t';
    el.appendChild(cursor);
    let si = 0, ci = 0, currentSpan = null;
    function tick() {
        if (si >= segments.length) { if (onDone) onDone(); return; }
        const seg = segments[si];
        if (ci === 0) {
            currentSpan = document.createElement('span');
            if (seg.cls) currentSpan.className = seg.cls;
            el.insertBefore(currentSpan, cursor);
        }
        if (ci < seg.text.length) {
            if (seg.text[ci] === '\n') { el.insertBefore(document.createElement('br'), cursor); }
            else { currentSpan.textContent += seg.text[ci]; }
            ci++;
            setTimeout(tick, seg.text[ci-1] === ' ' ? speed * 0.4 : speed);
        } else { si++; ci = 0; tick(); }
    }
    tick();
    return cursor;
}
