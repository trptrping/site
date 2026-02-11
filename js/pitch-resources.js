/* TRP Site — Pitch: Resources Canvas — model / method / question orbiting */

(function() {
function drawResCanvas() {
    const cvs = document.getElementById('res-cvs');
    const ctx = cvs.getContext('2d');
    const rect = cvs.parentElement.getBoundingClientRect();
    const h = rect.height || 360;
    cvs.width = rect.width * 2; cvs.height = h * 2;
    ctx.scale(2, 2);
    const w = rect.width;

    const center = { x: w * 0.5, y: h * 0.5 };
    const resources = [
        { label: 'A MODEL', sub: 'Qwen 2.5 7B \u2014 free, runs on consumer GPUs', color: C('purple','167,139,250'), angle: 0, orbit: 110, size: 8 },
        { label: 'A METHOD', sub: 'LoRA/QLoRA \u2014 standard Python, no custom CUDA', color: C('blue','96,165,250'), angle: Math.PI * 2/3, orbit: 110, size: 8 },
        { label: 'A QUESTION', sub: '"what happens if I try?" \u2014 the question IS the method', color: C('amber','245,158,11'), angle: Math.PI * 4/3, orbit: 110, size: 8 },
    ];

    const orbitals = [];
    resources.forEach((res) => {
        for (let i = 0; i < 20; i++) {
            const a = res.angle + (i / 20) * Math.PI * 2;
            orbitals.push({ baseAngle: a, orbit: res.orbit + (Math.random() - 0.5) * 40, size: 0.8 + Math.random() * 1.5, color: res.color, speed: 0.2 + Math.random() * 0.35, phase: Math.random() * Math.PI * 2 });
        }
    });

    const drifters = [];
    for (let i = 0; i < 30; i++) {
        drifters.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, size: 0.4 + Math.random() * 1, color: [C('purple','167,139,250'),C('blue','96,165,250'),C('amber','245,158,11')][i % 3], phase: Math.random() * Math.PI * 2 });
    }

    const triParticles = [];
    for (let i = 0; i < 12; i++) {
        triParticles.push({ segment: i % 3, progress: Math.random(), speed: 0.003 + Math.random() * 0.004, size: 1 + Math.random() * 1.5, phase: Math.random() * Math.PI * 2 });
    }

    let t = 0;
    function animate() {
        ctx.clearRect(0, 0, w, h);
        t += 0.008;
        const m = mouseInCanvas(cvs.parentElement);

        resources.forEach(res => {
            ctx.beginPath(); ctx.arc(center.x, center.y, res.orbit, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${res.color},0.12)`; ctx.lineWidth = 0.6;
            ctx.setLineDash([4, 8]); ctx.stroke(); ctx.setLineDash([]);
        });

        orbitals.forEach(o => {
            const angle = o.baseAngle + t * o.speed;
            let ox = center.x + Math.cos(angle) * o.orbit;
            let oy = center.y + Math.sin(angle) * o.orbit;
            const pulse = 0.6 + 0.4 * Math.sin(t * 3 + o.phase);
            if (m.inside) {
                const dx = m.x - ox, dy = m.y - oy;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100 && dist > 1) { const pull = (1 - dist/100) * 0.2; ox += dx * pull; oy += dy * pull; }
            }
            ctx.beginPath(); ctx.arc(ox, oy, o.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${o.color},${0.18 + pulse * 0.18})`; ctx.fill();
        });

        drifters.forEach(d => {
            d.x += d.vx; d.y += d.vy;
            if (d.x < 0 || d.x > w) d.vx *= -1;
            if (d.y < 0 || d.y > h) d.vy *= -1;
            if (m.inside) {
                const dx = m.x - d.x, dy = m.y - d.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 120 && dist > 1) { d.vx += (dx / dist) * 0.02; d.vy += (dy / dist) * 0.02; }
            }
            d.vx *= 0.99; d.vy *= 0.99;
            ctx.beginPath(); ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${d.color},0.14)`; ctx.fill();
        });

        const nodePositions = resources.map((res) => {
            const angle = res.angle + t * 0.15;
            return { x: center.x + Math.cos(angle) * res.orbit, y: center.y + Math.sin(angle) * res.orbit };
        });

        triParticles.forEach(tp => {
            tp.progress += tp.speed;
            if (tp.progress > 1) { tp.progress -= 1; tp.segment = (tp.segment + 1) % 3; }
            const fromNode = nodePositions[tp.segment];
            const toNode = nodePositions[(tp.segment + 1) % 3];
            const px = fromNode.x + (toNode.x - fromNode.x) * tp.progress;
            const py = fromNode.y + (toNode.y - fromNode.y) * tp.progress;
            const pulse = 0.5 + 0.5 * Math.sin(t * 3 + tp.phase);
            ctx.beginPath(); ctx.arc(px, py, tp.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${C('amber','245,158,11')},${0.2 + pulse * 0.15})`; ctx.fill();
        });

        resources.forEach((res, ri) => {
            const angle = res.angle + t * 0.15;
            let nx = center.x + Math.cos(angle) * res.orbit;
            let ny = center.y + Math.sin(angle) * res.orbit;
            const pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + ri * 2);
            let cursorBoost = 0;
            if (m.inside) {
                const dx = m.x - nx, dy = m.y - ny;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) { cursorBoost = 1 - dist/100; nx += dx * cursorBoost * 0.1; ny += dy * cursorBoost * 0.1; }
            }
            const r = res.size + cursorBoost * 6 + pulse * 2;
            const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 5);
            grd.addColorStop(0, `rgba(${res.color},${(0.15 + cursorBoost * 0.2) * pulse})`); grd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(nx, ny, r * 5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
            ctx.beginPath(); ctx.arc(nx, ny, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${res.color},${0.5 + cursorBoost * 0.3 + pulse * 0.2})`; ctx.fill();
            ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(center.x, center.y);
            ctx.strokeStyle = `rgba(${res.color},${0.18 + pulse * 0.1 + cursorBoost * 0.15})`; ctx.lineWidth = 0.8 + cursorBoost; ctx.stroke();
            resources.forEach((other, oi) => {
                if (oi <= ri) return;
                const oAngle = other.angle + t * 0.15;
                const ox = center.x + Math.cos(oAngle) * other.orbit;
                const oy = center.y + Math.sin(oAngle) * other.orbit;
                ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(ox, oy);
                ctx.strokeStyle = `rgba(${C('amber','245,158,11')},${0.12 + pulse * 0.08})`; ctx.lineWidth = 0.5; ctx.stroke();
            });
            ctx.font = 'bold 11px JetBrains Mono'; ctx.textAlign = 'center';
            ctx.fillStyle = `rgba(${res.color},${0.8 + cursorBoost * 0.15})`; ctx.fillText(res.label, nx, ny + r + 14);
            ctx.font = '9px JetBrains Mono';
            ctx.fillStyle = `rgba(${res.color},${0.55 + cursorBoost * 0.25})`;
            const words = res.sub.split(' \u2014 ');
            ctx.fillText(words[0], nx, ny + r + 26);
            if (words[1]) ctx.fillText(words[1], nx, ny + r + 37);
        });

        const cPulse = 0.6 + 0.4 * Math.sin(t * 1.2);
        const cR = 5 + cPulse * 2;
        const cGrd = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 30);
        cGrd.addColorStop(0, `rgba(${C('amber','245,158,11')},${0.18 * cPulse})`); cGrd.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(center.x, center.y, 30, 0, Math.PI * 2); ctx.fillStyle = cGrd; ctx.fill();
        ctx.beginPath(); ctx.arc(center.x, center.y, cR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${C('amber','245,158,11')},${0.4 + cPulse * 0.35})`; ctx.fill();
        ctx.font = 'bold 10px JetBrains Mono'; ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(${C('amber','245,158,11')},${0.65 + cPulse * 0.2})`; ctx.fillText('ENOUGH', center.x, center.y + 22);

        requestAnimationFrame(animate);
    }
    animate();
}

let resDrawn = false;
const resObs = new IntersectionObserver(es => {
    es.forEach(e => {
        if (!e.isIntersecting || resDrawn) return;
        resDrawn = true;
        drawResCanvas();
    });
}, { threshold: 0.3 });
resObs.observe(document.getElementById('res-cvs'));
})();
