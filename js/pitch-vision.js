/* TRP Site — Pitch: Vision Canvas — one builder becomes many */

(function() {
function drawVisionCanvas() {
    const cvs = document.getElementById('vision-cvs');
    const ctx = cvs.getContext('2d');
    const rect = cvs.parentElement.getBoundingClientRect();
    cvs.width = rect.width * 2; cvs.height = 380 * 2;
    ctx.scale(2, 2);
    const w = rect.width, h = 380;

    const builders = [];
    const pathColors = ['167,139,250', '96,165,250', '245,158,11', '52,211,153'];
    const pathLabels = ['typed', 'threshold', 'trace', 'self-know'];
    builders.push({ x: w * 0.08, y: h * 0.5, r: 9, color: '245,158,11', label: 'you', phase: 0, type: 'origin' });

    const spawnData = [
        { x: w*0.28, y: h*0.18, path: 0 }, { x: w*0.28, y: h*0.82, path: 2 },
        { x: w*0.28, y: h*0.5, path: 1 },
        { x: w*0.45, y: h*0.28, path: 1 }, { x: w*0.45, y: h*0.55, path: 3 },
        { x: w*0.45, y: h*0.78, path: 0 },
        { x: w*0.6, y: h*0.15, path: 0 }, { x: w*0.6, y: h*0.38, path: 1 },
        { x: w*0.6, y: h*0.62, path: 2 }, { x: w*0.6, y: h*0.88, path: 3 },
        { x: w*0.75, y: h*0.25, path: 3 }, { x: w*0.75, y: h*0.5, path: 0 },
        { x: w*0.75, y: h*0.75, path: 1 }, { x: w*0.75, y: h*0.92, path: 2 },
    ];
    spawnData.forEach((s, i) => {
        builders.push({ x: s.x, y: s.y, r: 4 + Math.random() * 3, color: pathColors[s.path], label: pathLabels[s.path], phase: Math.random() * Math.PI * 2, type: 'builder', delay: 0.08 + i * 0.05 });
    });

    const converge = { x: w * 0.92, y: h * 0.5 };
    const pulseTrails = [];
    for (let i = 0; i < 20; i++) {
        pulseTrails.push({ target: 1 + Math.floor(Math.random() * spawnData.length), progress: Math.random(), speed: 0.004 + Math.random() * 0.006, size: 1 + Math.random() * 1.5, phase: Math.random() * Math.PI * 2 });
    }

    let t = 0;
    function animate() {
        ctx.clearRect(0, 0, w, h);
        t += 0.01;
        const m = mouseInCanvas(cvs.parentElement);
        const progress = Math.min(1, t * 0.1);

        builders.forEach((b, i) => {
            if (i === 0) return;
            if (progress < b.delay) return;
            const bp = Math.min(1, (progress - b.delay) * 3.5);
            const origin = builders[0];
            const pulse = 0.5 + 0.5 * Math.sin(t * 2 + b.phase);
            ctx.beginPath(); ctx.moveTo(origin.x, origin.y);
            const mx = (origin.x + b.x) / 2, my = (origin.y + b.y) / 2 + Math.sin(b.phase) * 20;
            ctx.quadraticCurveTo(mx, my, origin.x + (b.x - origin.x) * bp, origin.y + (b.y - origin.y) * bp);
            ctx.strokeStyle = `rgba(245,158,11,${0.22 + pulse * 0.12})`; ctx.lineWidth = 0.8; ctx.stroke();
            if (bp > 0.5) {
                const cp = (bp - 0.5) * 2;
                ctx.beginPath(); ctx.moveTo(b.x, b.y);
                ctx.lineTo(b.x + (converge.x - b.x) * cp, b.y + (converge.y - b.y) * cp);
                ctx.strokeStyle = `rgba(${b.color},${0.2 + pulse * 0.15})`; ctx.lineWidth = 0.6 + pulse * 0.4; ctx.stroke();
            }
            builders.forEach((other, j) => {
                if (j <= i || j === 0) return;
                if (other.color !== b.color) return;
                if (progress < other.delay) return;
                const dx = other.x - b.x, dy = other.y - b.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist > w * 0.35) return;
                ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = `rgba(${b.color},${(1 - dist/(w*0.35)) * 0.22 * pulse})`; ctx.lineWidth = 0.5; ctx.stroke();
            });
        });

        pulseTrails.forEach(pt => {
            pt.progress += pt.speed;
            if (pt.progress > 1) { pt.progress -= 1; pt.target = 1 + Math.floor(Math.random() * spawnData.length); }
            const target = builders[pt.target];
            if (!target || progress < target.delay) return;
            const origin = builders[0];
            const px = origin.x + (target.x - origin.x) * pt.progress;
            const py = origin.y + (target.y - origin.y) * pt.progress;
            const pulse = 0.5 + 0.5 * Math.sin(t * 4 + pt.phase);
            ctx.beginPath(); ctx.arc(px, py, pt.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245,158,11,${0.2 + pulse * 0.15})`; ctx.fill();
        });

        builders.forEach((b, i) => {
            if (i > 0 && progress < b.delay) return;
            const bp = i === 0 ? 1 : Math.min(1, (progress - b.delay) * 3.5);
            const pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + b.phase);
            let drawX = b.x + Math.sin(t * 0.5 + b.phase) * 4;
            let drawY = b.y + Math.cos(t * 0.4 + b.phase) * 3;
            let cursorBoost = 0;
            if (m.inside) {
                const dx = m.x - drawX, dy = m.y - drawY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 90) { cursorBoost = 1 - dist/90; drawX += dx * cursorBoost * 0.12; drawY += dy * cursorBoost * 0.12; }
            }
            const r = (b.r + cursorBoost * 5) * pulse * bp;
            const grd = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, r * 4);
            grd.addColorStop(0, `rgba(${b.color},${(0.18 + cursorBoost * 0.18) * pulse * bp})`); grd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(drawX, drawY, r * 4, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
            ctx.beginPath(); ctx.arc(drawX, drawY, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${b.color},${(0.45 + pulse * 0.4 + cursorBoost * 0.15) * bp})`; ctx.fill();
            if (bp > 0.6) {
                ctx.font = `bold ${i === 0 ? 12 : 9}px JetBrains Mono`; ctx.textAlign = 'center';
                ctx.fillStyle = `rgba(${b.color},${(0.45 + cursorBoost * 0.4) * bp})`;
                ctx.fillText(b.label, drawX, drawY + r + 13);
            }
        });

        if (progress > 0.4) {
            const cp = Math.min(1, (progress - 0.4) * 1.8);
            const pulse = 0.5 + 0.5 * Math.sin(t * 1.5);
            const r = 12 * cp + pulse * 4;
            const grd = ctx.createRadialGradient(converge.x, converge.y, 0, converge.x, converge.y, r * 6);
            grd.addColorStop(0, `rgba(245,158,11,${0.18 * pulse * cp})`); grd.addColorStop(0.3, `rgba(167,139,250,${0.1 * pulse * cp})`); grd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(converge.x, converge.y, r * 6, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
            ctx.beginPath(); ctx.arc(converge.x, converge.y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245,158,11,${0.35 * pulse * cp})`; ctx.fill();
            if (cp > 0.3) {
                ctx.font = 'bold 10px JetBrains Mono'; ctx.textAlign = 'center';
                ctx.fillStyle = `rgba(245,158,11,${0.55 * cp})`; ctx.fillText('convergence', converge.x, converge.y + r + 15);
            }
        }

        const tlY = h - 20;
        ctx.beginPath(); ctx.moveTo(w * 0.05, tlY); ctx.lineTo(w * 0.05 + (w * 0.9) * Math.min(1, progress * 1.2), tlY);
        ctx.strokeStyle = 'rgba(245,158,11,0.18)'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.font = '8px JetBrains Mono';
        ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(245,158,11,0.35)'; ctx.fillText('one person', w * 0.05, tlY - 6);
        ctx.textAlign = 'center'; ctx.fillText('many people', w * 0.5, tlY - 6);
        ctx.textAlign = 'right'; ctx.fillText('convergence', w * 0.95, tlY - 6);

        requestAnimationFrame(animate);
    }
    animate();
}

let visionDrawn = false;
const visionObs = new IntersectionObserver(es => {
    es.forEach(e => {
        if (!e.isIntersecting || visionDrawn) return;
        visionDrawn = true;
        drawVisionCanvas();
    });
}, { threshold: 0.3 });
visionObs.observe(document.getElementById('vision-cvs'));
})();
