/* TRP Site — Pitch: Engage Canvas — three paths diverging */

(function() {
function drawEngageCanvas() {
    const cvs = document.getElementById('engage-cvs');
    const ctx = cvs.getContext('2d');
    const rect = cvs.parentElement.getBoundingClientRect();
    cvs.width = rect.width * 2; cvs.height = 360 * 2;
    ctx.scale(2, 2);
    const w = rect.width, h = 360;

    const origin = { x: w * 0.08, y: h * 0.5 };
    const paths = [
        { label: 'BUILD', sub: 'Pick a path. Build a prototype.', color: C('green','52,211,153'), endX: w * 0.92, endY: h * 0.15, particles: [] },
        { label: 'BREAK', sub: "Tell us what's wrong.", color: C('amber','245,158,11'), endX: w * 0.92, endY: h * 0.5, particles: [] },
        { label: 'EXTEND', sub: "See something we didn't?", color: C('purple','167,139,250'), endX: w * 0.92, endY: h * 0.85, particles: [] },
    ];
    paths.forEach(p => {
        for (let i = 0; i < 25; i++) {
            p.particles.push({ progress: Math.random(), speed: 0.002 + Math.random() * 0.003, offset: (Math.random() - 0.5) * 40, size: 1.2 + Math.random() * 2, phase: Math.random() * Math.PI * 2 });
        }
    });
    const field = [];
    for (let i = 0; i < 40; i++) {
        field.push({ x: Math.random() * w, y: Math.random() * h, size: 0.5 + Math.random() * 0.8, color: [C('green','52,211,153'),C('amber','245,158,11'),C('purple','167,139,250')][i % 3], phase: Math.random() * Math.PI * 2 });
    }

    let t = 0;
    function animate() {
        ctx.clearRect(0, 0, w, h);
        t += 0.01;
        const m = mouseInCanvas(cvs.parentElement);

        field.forEach(f => {
            const pulse = 0.5 + 0.5 * Math.sin(t * 2 + f.phase);
            ctx.beginPath(); ctx.arc(f.x, f.y, f.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${f.color},0.12)`; ctx.fill();
        });

        paths.forEach((p, pi) => {
            const cpX = w * 0.5, cpY = p.endY + (p.endY - origin.y) * 0.12;
            ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.quadraticCurveTo(cpX, cpY, p.endX, p.endY);
            ctx.strokeStyle = `rgba(${p.color},0.2)`; ctx.lineWidth = 1.2; ctx.stroke();

            p.particles.forEach(part => {
                part.progress += part.speed;
                if (part.progress > 1) part.progress -= 1;
                const prog = part.progress, omt = 1 - prog;
                let px = omt*omt*origin.x + 2*omt*prog*cpX + prog*prog*p.endX;
                let py = omt*omt*origin.y + 2*omt*prog*cpY + prog*prog*p.endY;
                const tx = 2*omt*(cpX - origin.x) + 2*prog*(p.endX - cpX);
                const ty = 2*omt*(cpY - origin.y) + 2*prog*(p.endY - cpY);
                const tLen = Math.sqrt(tx*tx + ty*ty) || 1;
                const nx = -ty / tLen, ny = tx / tLen;
                const wobble = Math.sin(t * 3 + part.phase) * 7;
                px += nx * (part.offset + wobble); py += ny * (part.offset + wobble);
                let cursorBoost = 0;
                if (m.inside) {
                    const dx = m.x - px, dy = m.y - py;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 80 && dist > 1) { cursorBoost = 1 - dist/80; px += dx * cursorBoost * 0.15; py += dy * cursorBoost * 0.15; }
                }
                const pulse = 0.6 + 0.4 * Math.sin(t * 2 + part.phase);
                const r = part.size * pulse + cursorBoost * 4;
                const alpha = (0.18 + prog * 0.3 + cursorBoost * 0.3) * pulse;
                if (alpha > 0.2) {
                    const grd = ctx.createRadialGradient(px, py, 0, px, py, r * 3.5);
                    grd.addColorStop(0, `rgba(${p.color},${alpha * 0.35})`); grd.addColorStop(1, 'transparent');
                    ctx.beginPath(); ctx.arc(px, py, r * 3.5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
                }
                ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color},${alpha})`; ctx.fill();
            });

            const pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + pi);
            const endR = 5 + pulse * 2;
            const eGrd = ctx.createRadialGradient(p.endX, p.endY, 0, p.endX, p.endY, endR * 5);
            eGrd.addColorStop(0, `rgba(${p.color},${0.15 * pulse})`); eGrd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(p.endX, p.endY, endR * 5, 0, Math.PI * 2); ctx.fillStyle = eGrd; ctx.fill();
            ctx.beginPath(); ctx.arc(p.endX, p.endY, endR, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},${0.4 + pulse * 0.25})`; ctx.fill();
            ctx.font = 'bold 12px JetBrains Mono'; ctx.textAlign = 'right';
            ctx.fillStyle = `rgba(${p.color},${0.75 + pulse * 0.15})`; ctx.fillText(p.label, p.endX - 14, p.endY - 8);
            ctx.font = '9px JetBrains Mono';
            ctx.fillStyle = `rgba(${p.color},${0.5 + pulse * 0.15})`; ctx.fillText(p.sub, p.endX - 14, p.endY + 8);
        });

        const oPulse = 0.6 + 0.4 * Math.sin(t * 1.2);
        const oR = 7 + oPulse * 2;
        const oGrd = ctx.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, 30);
        oGrd.addColorStop(0, `rgba(${C('amber','245,158,11')},${0.16 * oPulse})`); oGrd.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(origin.x, origin.y, 30, 0, Math.PI * 2); ctx.fillStyle = oGrd; ctx.fill();
        ctx.beginPath(); ctx.arc(origin.x, origin.y, oR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${C('amber','245,158,11')},${0.45 + oPulse * 0.35})`; ctx.fill();
        ctx.font = 'bold 10px JetBrains Mono'; ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(${C('amber','245,158,11')},${0.7 + oPulse * 0.2})`; ctx.fillText('you', origin.x, origin.y + oR + 14);

        requestAnimationFrame(animate);
    }
    animate();
}

let engageDrawn = false;
const engageObs = new IntersectionObserver(es => {
    es.forEach(e => {
        if (!e.isIntersecting || engageDrawn) return;
        engageDrawn = true;
        drawEngageCanvas();
    });
}, { threshold: 0.3 });
engageObs.observe(document.getElementById('engage-cvs'));
})();
