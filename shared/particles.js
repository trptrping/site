/* TRP Site — Particle Background System
   Extracted from output/index.html. Runs on every page. */

(function() {
    const bg = document.getElementById('bg');
    if (!bg) return;
    const bctx = bg.getContext('2d');

    function resizeBg() {
        bg.width = window.innerWidth;
        bg.height = window.innerHeight;
    }
    resizeBg();
    window.addEventListener('resize', resizeBg);

    // Ambient dust
    const dust = [];
    for (let i = 0; i < 50; i++) {
        dust.push({
            x: Math.random() * 2000, y: Math.random() * 2000,
            vx: (Math.random() - 0.5) * 0.1, vy: -0.03 - Math.random() * 0.12,
            size: 0.4 + Math.random() * 1.2, alpha: 0.06 + Math.random() * 0.06,
            hue: 220 + Math.random() * 80,
        });
    }

    // Brightness particles — colored, reactive, drawn to cursor
    const bright = [];
    const brightColors = [
        { r: '245,158,11', h: 40 },   // amber
        { r: '167,139,250', h: 260 },  // purple
        { r: '52,211,153', h: 160 },   // green
        { r: '96,165,250', h: 220 },   // blue
        { r: '239,68,68', h: 0 },      // red
    ];
    for (let i = 0; i < 35; i++) {
        const c = brightColors[i % brightColors.length];
        bright.push({
            x: Math.random() * 2000, y: Math.random() * 3000,
            vx: 0, vy: 0,
            homeX: Math.random() * 2000, homeY: Math.random() * 3000,
            size: 1 + Math.random() * 2,
            baseAlpha: 0.1 + Math.random() * 0.1,
            color: c.r, hue: c.h,
            phase: Math.random() * Math.PI * 2,
        });
    }

    function drawBg() {
        bctx.clearRect(0, 0, bg.width, bg.height);
        const scrollY = window.scrollY;
        const gravity = 150;

        // Ambient dust — gentle cursor repulsion
        dust.forEach(d => {
            d.x += d.vx; d.y += d.vy;
            if (d.y < -10) { d.y = bg.height + 10; d.x = Math.random() * bg.width; }
            if (d.x < -10) d.x = bg.width + 10; if (d.x > bg.width + 10) d.x = -10;

            if (mouse.active) {
                const dx = d.x - mouse.x, dy = d.y - mouse.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < gravity && dist > 1) {
                    const force = (1 - dist / gravity) * 0.3;
                    d.vx += (dx / dist) * force;
                    d.vy += (dy / dist) * force;
                }
            }
            d.vx *= 0.97; d.vy *= 0.97;
            d.vy -= 0.02;

            bctx.beginPath(); bctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
            bctx.fillStyle = `hsla(${d.hue},50%,60%,${d.alpha})`; bctx.fill();
        });

        // Brightness particles — cursor ATTRACTION
        const t = performance.now() * 0.001;
        bright.forEach(b => {
            const homeScreenY = b.homeY - scrollY;
            const wobX = Math.sin(t * 0.5 + b.phase) * 30;
            const wobY = Math.cos(t * 0.3 + b.phase) * 20;
            let targetX = b.homeX + wobX;
            let targetY = homeScreenY + wobY;

            let cursorInfluence = 0;
            if (mouse.active) {
                const dx = mouse.x - b.x, dy = mouse.y - b.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < gravity * 1.5 && dist > 1) {
                    cursorInfluence = Math.pow(1 - dist / (gravity * 1.5), 2);
                    targetX = b.x + dx * cursorInfluence * 0.15;
                    targetY = b.y + dy * cursorInfluence * 0.15;
                }
            }

            b.x += (targetX - b.x) * 0.04;
            b.y += (targetY - b.y) * 0.04;

            if (b.y < -50 || b.y > bg.height + 50) return;

            const pulse = 0.6 + 0.4 * Math.sin(t * 2 + b.phase);
            const alpha = b.baseAlpha + cursorInfluence * 0.25 + pulse * 0.05;
            const size = b.size + cursorInfluence * 3;

            if (alpha > 0.08) {
                const grd = bctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, size * 4);
                grd.addColorStop(0, `rgba(${b.color},${alpha * 0.4})`);
                grd.addColorStop(1, 'transparent');
                bctx.beginPath(); bctx.arc(b.x, b.y, size * 4, 0, Math.PI * 2);
                bctx.fillStyle = grd; bctx.fill();
            }

            bctx.beginPath(); bctx.arc(b.x, b.y, size, 0, Math.PI * 2);
            bctx.fillStyle = `rgba(${b.color},${alpha})`;
            bctx.fill();

            bright.forEach(other => {
                if (other === b) return;
                const dx = other.x - b.x, dy = other.y - b.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 80 && dist > 1) {
                    bctx.beginPath(); bctx.moveTo(b.x, b.y); bctx.lineTo(other.x, other.y);
                    bctx.strokeStyle = `rgba(${b.color},${(1 - dist/80) * 0.12})`;
                    bctx.lineWidth = 0.5;
                    bctx.stroke();
                }
            });
        });

        requestAnimationFrame(drawBg);
    }
    drawBg();

    // Position brightness particles near important elements
    function redistributeBright() {
        const anchors = document.querySelectorAll('h2, .hl, .box, canvas:not(#bg), .eq, .cta, .big-q, .hub-card');
        const anchorRects = [];
        anchors.forEach(el => {
            const r = el.getBoundingClientRect();
            anchorRects.push({ x: r.left + r.width/2, y: r.top + r.height/2 + window.scrollY });
        });
        if (anchorRects.length === 0) return;

        bright.forEach((b, i) => {
            const anchor = anchorRects[i % anchorRects.length];
            b.homeX = anchor.x + (Math.random() - 0.5) * 200;
            b.homeY = anchor.y + (Math.random() - 0.5) * 100;
        });
    }

    let redistTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(redistTimer);
        redistTimer = setTimeout(redistributeBright, 200);
    });
    setTimeout(redistributeBright, 500);
})();
