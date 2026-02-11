/* TRP Site — Origin: Journey Canvas — Eve → Pathfinder → TRP across six years */

(function() {
function drawJourneyCanvas() {
    const cvs = document.getElementById('journey-cvs');
    const ctx = cvs.getContext('2d');
    const rect = cvs.parentElement.getBoundingClientRect();
    const h = rect.height || 300;
    cvs.width = rect.width * 2; cvs.height = h * 2;
    ctx.scale(2, 2);
    const w = rect.width;

    const epochs = [
        { x: w * 0.12, y: h * 0.5, label: 'Eve', year: '2020', color: '167,139,250', r: 10, sub: 'propositional' },
        { x: w * 0.50, y: h * 0.5, label: 'Pathfinder', year: '2025', color: '96,165,250', r: 12, sub: 'encounter' },
        { x: w * 0.88, y: h * 0.5, label: 'TRP', year: '2026', color: '245,158,11', r: 14, sub: 'architectural' },
    ];

    // Thread particles flowing along the path
    const threadParticles = [];
    for (let i = 0; i < 30; i++) {
        threadParticles.push({
            progress: Math.random(),
            speed: 0.002 + Math.random() * 0.003,
            offset: (Math.random() - 0.5) * 20,
            size: 1 + Math.random() * 1.5,
            phase: Math.random() * Math.PI * 2
        });
    }

    // Orbit particles around each epoch
    const orbitals = [];
    epochs.forEach((ep, ei) => {
        for (let i = 0; i < 8; i++) {
            orbitals.push({
                epoch: ei,
                angle: (Math.PI * 2 / 8) * i,
                orbit: ep.r * 2.5 + Math.random() * 15,
                speed: 0.3 + Math.random() * 0.4,
                size: 0.8 + Math.random() * 1.2,
                phase: Math.random() * Math.PI * 2
            });
        }
    });

    let t = 0;
    function animate() {
        ctx.clearRect(0, 0, w, h);
        t += 0.01;
        const m = mouseInCanvas(cvs.parentElement);
        const progress = Math.min(1, t * 0.12);

        // The golden thread connecting all three
        const cp1x = (epochs[0].x + epochs[1].x) / 2;
        const cp1y = epochs[0].y - 40 - Math.sin(t * 0.5) * 10;
        const cp2x = (epochs[1].x + epochs[2].x) / 2;
        const cp2y = epochs[1].y + 40 + Math.sin(t * 0.5 + 1) * 10;

        if (progress > 0.1) {
            const threadProg = Math.min(1, (progress - 0.1) * 1.5);
            const pulse = 0.5 + 0.5 * Math.sin(t * 1.5);

            // First segment: Eve → Pathfinder
            ctx.beginPath();
            ctx.moveTo(epochs[0].x, epochs[0].y);
            ctx.quadraticCurveTo(cp1x, cp1y, epochs[1].x, epochs[1].y);
            ctx.strokeStyle = `rgba(245,158,11,${0.2 + pulse * 0.1})`;
            ctx.lineWidth = 1.2; ctx.stroke();

            // Second segment: Pathfinder → TRP
            if (threadProg > 0.5) {
                ctx.beginPath();
                ctx.moveTo(epochs[1].x, epochs[1].y);
                ctx.quadraticCurveTo(cp2x, cp2y, epochs[2].x, epochs[2].y);
                ctx.strokeStyle = `rgba(245,158,11,${0.2 + pulse * 0.1})`;
                ctx.lineWidth = 1.2; ctx.stroke();
            }

            // Thread particles
            threadParticles.forEach(p => {
                p.progress += p.speed;
                if (p.progress > 1) p.progress -= 1;
                let px, py;
                if (p.progress < 0.5) {
                    const seg = p.progress * 2, omt = 1 - seg;
                    px = omt*omt*epochs[0].x + 2*omt*seg*cp1x + seg*seg*epochs[1].x;
                    py = omt*omt*epochs[0].y + 2*omt*seg*cp1y + seg*seg*epochs[1].y;
                } else {
                    const seg = (p.progress - 0.5) * 2, omt = 1 - seg;
                    px = omt*omt*epochs[1].x + 2*omt*seg*cp2x + seg*seg*epochs[2].x;
                    py = omt*omt*epochs[1].y + 2*omt*seg*cp2y + seg*seg*epochs[2].y;
                }
                py += p.offset + Math.sin(t * 2 + p.phase) * 5;
                const pp = 0.5 + 0.5 * Math.sin(t * 3 + p.phase);
                ctx.beginPath(); ctx.arc(px, py, p.size * pp, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(245,158,11,${0.15 + pp * 0.15})`; ctx.fill();
            });
        }

        // Orbital particles
        orbitals.forEach(o => {
            const ep = epochs[o.epoch];
            const delay = o.epoch * 0.15;
            if (progress < delay) return;
            const angle = o.angle + t * o.speed;
            const ox = ep.x + Math.cos(angle) * o.orbit;
            const oy = ep.y + Math.sin(angle) * o.orbit;
            const pulse = 0.5 + 0.5 * Math.sin(t * 3 + o.phase);
            ctx.beginPath(); ctx.arc(ox, oy, o.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${ep.color},${0.15 + pulse * 0.15})`; ctx.fill();
        });

        // Epoch nodes
        epochs.forEach((ep, ei) => {
            const delay = ei * 0.15;
            if (progress < delay) return;
            const np = Math.min(1, (progress - delay) * 3);
            const pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + ei * 2);
            let nx = ep.x, ny = ep.y;
            let cursorBoost = 0;
            if (m.inside) {
                const dx = m.x - nx, dy = m.y - ny;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) { cursorBoost = 1 - dist/100; nx += dx * cursorBoost * 0.1; ny += dy * cursorBoost * 0.1; }
            }
            const r = (ep.r + cursorBoost * 5) * pulse * np;

            // Glow
            const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 5);
            grd.addColorStop(0, `rgba(${ep.color},${(0.15 + cursorBoost * 0.15) * pulse * np})`);
            grd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(nx, ny, r * 5, 0, Math.PI * 2);
            ctx.fillStyle = grd; ctx.fill();

            // Core
            ctx.beginPath(); ctx.arc(nx, ny, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${ep.color},${(0.45 + pulse * 0.35 + cursorBoost * 0.2) * np})`;
            ctx.fill();

            // Labels
            if (np > 0.4) {
                ctx.font = 'bold 12px JetBrains Mono'; ctx.textAlign = 'center';
                ctx.fillStyle = `rgba(${ep.color},${(0.6 + cursorBoost * 0.3) * np})`;
                ctx.fillText(ep.label, nx, ny + r + 18);
                ctx.font = '9px JetBrains Mono';
                ctx.fillStyle = `rgba(${ep.color},${0.4 * np})`;
                ctx.fillText(ep.year, nx, ny + r + 30);
                ctx.font = '7px JetBrains Mono';
                ctx.fillStyle = `rgba(${ep.color},${0.3 * np})`;
                ctx.fillText(ep.sub, nx, ny + r + 41);
            }
        });

        // Timeline line at bottom
        const tlY = h - 18;
        const tlProgress = Math.min(1, progress * 1.3);
        ctx.beginPath();
        ctx.moveTo(w * 0.05, tlY);
        ctx.lineTo(w * 0.05 + (w * 0.9) * tlProgress, tlY);
        ctx.strokeStyle = 'rgba(245,158,11,0.12)'; ctx.lineWidth = 1; ctx.stroke();

        // Year markers on timeline
        const years = [{ label: '2020', x: w * 0.12 }, { label: '2025', x: w * 0.50 }, { label: '2026', x: w * 0.88 }];
        years.forEach(yr => {
            if (yr.x > w * 0.05 + (w * 0.9) * tlProgress) return;
            ctx.font = '7px JetBrains Mono'; ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(245,158,11,0.25)';
            ctx.fillText(yr.label, yr.x, tlY - 5);
        });

        requestAnimationFrame(animate);
    }
    animate();
}

let journeyDrawn = false;
const journeyObs = new IntersectionObserver(es => {
    es.forEach(e => {
        if (!e.isIntersecting || journeyDrawn) return;
        journeyDrawn = true;
        drawJourneyCanvas();
    });
}, { threshold: 0.3 });
journeyObs.observe(document.getElementById('journey-cvs'));
})();
