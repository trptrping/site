/* TRP Site — Pitch: CTA Canvas — field of possibility reaching toward you */

(function() {
function drawCtaCanvas() {
    const cvs = document.getElementById('cta-cvs');
    const rect = cvs.parentElement.getBoundingClientRect();
    cvs.width = rect.width * 2; cvs.height = 400 * 2;
    const ctx = cvs.getContext('2d');
    ctx.scale(2, 2);
    const w = rect.width, h = 400;
    const cx = w / 2, cy = h * 0.5;

    const deep = [], mid = [], near = [];
    const allColors = [C('amber','245,158,11'), C('purple','167,139,250'), C('blue','96,165,250'), C('green','52,211,153'), C('red','239,68,68')];

    for (let i = 0; i < 80; i++) {
        deep.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15, size: 0.5 + Math.random() * 1, color: allColors[i % 5], phase: Math.random() * Math.PI * 2 });
    }
    for (let i = 0; i < 30; i++) {
        mid.push({ x: Math.random() * w, y: Math.random() * h, vx: 0, vy: 0, size: 1.5 + Math.random() * 2, color: allColors[i % 5], phase: Math.random() * Math.PI * 2, homeX: Math.random() * w, homeY: Math.random() * h });
    }
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        near.push({ x: cx + Math.cos(angle) * 80, y: cy + Math.sin(angle) * 60, vx: 0, vy: 0, size: 3 + Math.random() * 2, color: allColors[i % 5], phase: angle, trail: [] });
    }

    let t = 0;
    function animate() {
        ctx.clearRect(0, 0, w, h);
        t += 0.012;
        const m = mouseInCanvas(cvs.parentElement);

        deep.forEach(d => {
            d.x += d.vx + Math.sin(t * 0.5 + d.phase) * 0.05;
            d.y += d.vy + Math.cos(t * 0.3 + d.phase) * 0.05;
            if (d.x < 0) d.x = w; if (d.x > w) d.x = 0;
            if (d.y < 0) d.y = h; if (d.y > h) d.y = 0;
            if (m.inside) {
                const dx = d.x - m.x, dy = d.y - m.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100 && dist > 1) { d.x += (dx / dist) * (1 - dist/100) * 0.5; d.y += (dy / dist) * (1 - dist/100) * 0.5; }
            }
            const pulse = 0.5 + 0.5 * Math.sin(t + d.phase);
            ctx.beginPath(); ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${d.color},${0.12 + pulse * 0.06})`; ctx.fill();
        });

        for (let i = 0; i < deep.length; i++) {
            for (let j = i + 1; j < deep.length; j++) {
                const dx = deep[j].x - deep[i].x, dy = deep[j].y - deep[i].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 50) {
                    ctx.beginPath(); ctx.moveTo(deep[i].x, deep[i].y); ctx.lineTo(deep[j].x, deep[j].y);
                    ctx.strokeStyle = `rgba(${deep[i].color},${(1 - dist/50) * 0.1})`; ctx.lineWidth = 0.3; ctx.stroke();
                }
            }
        }

        mid.forEach(p => {
            const wobX = Math.sin(t * 0.8 + p.phase) * 40, wobY = Math.cos(t * 0.6 + p.phase) * 30;
            let targetX = p.homeX + wobX, targetY = p.homeY + wobY;
            if (m.inside) {
                const dx = m.x - p.x, dy = m.y - p.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 150 && dist > 1) { const pull = Math.pow(1 - dist/150, 2) * 0.3; targetX = p.x + dx * pull; targetY = p.y + dy * pull; }
            }
            p.x += (targetX - p.x) * 0.03; p.y += (targetY - p.y) * 0.03;
            const pulse = 0.6 + 0.4 * Math.sin(t * 2 + p.phase);
            const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
            grd.addColorStop(0, `rgba(${p.color},${0.12 * pulse})`); grd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},${0.25 + pulse * 0.2})`; ctx.fill();
        });

        near.forEach(n => {
            const orbitX = cx + Math.cos(t * 0.5 + n.phase) * (100 + Math.sin(t * 0.3) * 30);
            const orbitY = cy + Math.sin(t * 0.5 + n.phase) * (70 + Math.cos(t * 0.3) * 20);
            let targetX = orbitX, targetY = orbitY;
            if (m.inside) {
                const dx = m.x - n.x, dy = m.y - n.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 200) { const pull = Math.pow(1 - dist/200, 1.5) * 0.5; targetX = n.x + dx * pull; targetY = n.y + dy * pull; }
            }
            n.x += (targetX - n.x) * 0.06; n.y += (targetY - n.y) * 0.06;
            n.trail.push({ x: n.x, y: n.y }); if (n.trail.length > 20) n.trail.shift();
            n.trail.forEach((pt, ti) => {
                const alpha = (ti / n.trail.length) * 0.15;
                const r = n.size * (ti / n.trail.length) * 0.5;
                ctx.beginPath(); ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${n.color},${alpha})`; ctx.fill();
            });
            const pulse = 0.7 + 0.3 * Math.sin(t * 2 + n.phase);
            const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.size * 6);
            grd.addColorStop(0, `rgba(${n.color},${0.2 * pulse})`); grd.addColorStop(0.4, `rgba(${n.color},${0.08 * pulse})`); grd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(n.x, n.y, n.size * 6, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
            ctx.beginPath(); ctx.arc(n.x, n.y, n.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${n.color},${0.4 + pulse * 0.4})`; ctx.fill();
        });

        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5);
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120 + pulse * 30);
        grd.addColorStop(0, `rgba(${C('amber','245,158,11')},${0.1 + pulse * 0.06})`);
        grd.addColorStop(0.3, `rgba(${C('purple','167,139,250')},${0.06 + pulse * 0.04})`);
        grd.addColorStop(0.6, `rgba(${C('green','52,211,153')},${0.04 + pulse * 0.03})`);
        grd.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(cx, cy, 120 + pulse * 30, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();

        requestAnimationFrame(animate);
    }
    animate();
}

let ctaDrawn = false;
const ctaObs = new IntersectionObserver(es => {
    es.forEach(e => {
        if (!e.isIntersecting || ctaDrawn) return;
        ctaDrawn = true;
        drawCtaCanvas();
    });
}, { threshold: 0.08 });
ctaObs.observe(document.getElementById('cta-cvs'));

})();
