/* TRP Site — Pitch: Close Canvas — question becoming a universe */

(function() {
function drawCloseCanvas() {
    const cvs = document.getElementById('close-cvs');
    const ctx = cvs.getContext('2d');
    const rect = cvs.parentElement.getBoundingClientRect();
    cvs.width = rect.width * 2; cvs.height = 420 * 2;
    ctx.scale(2, 2);
    const w = rect.width, h = 420;
    const cx = w / 2, cy = h / 2;

    const rings = [];
    for (let i = 0; i < 6; i++) {
        rings.push({ radius: 0, maxRadius: 35 + i * 32, delay: i * 0.12, color: [C('amber','245,158,11'),C('purple','167,139,250'),C('blue','96,165,250'),C('green','52,211,153'),C('amber','245,158,11'),C('purple','167,139,250')][i], alpha: 0 });
    }

    const ringNodes = [];
    const nodeColors = [C('amber','245,158,11'),C('purple','167,139,250'),C('blue','96,165,250'),C('red','239,68,68'),C('green','52,211,153')];
    for (let ring = 0; ring < 6; ring++) {
        const nodesInRing = 3 + ring * 2;
        const baseRadius = 35 + ring * 32;
        for (let n = 0; n < nodesInRing; n++) {
            const angle = (Math.PI * 2 / nodesInRing) * n + ring * 0.3;
            ringNodes.push({ angle, baseRadius, ring, nodeIndex: n, size: 2 + (5 - ring) * 0.6, color: nodeColors[(ring + n) % 5], phase: Math.random() * Math.PI * 2, delay: ring * 0.12 + n * 0.015 });
        }
    }

    const sparks = [];
    for (let i = 0; i < 30; i++) {
        const fromNode = Math.floor(Math.random() * ringNodes.length);
        let toNode = Math.floor(Math.random() * ringNodes.length);
        if (toNode === fromNode) toNode = (toNode + 1) % ringNodes.length;
        sparks.push({ from: fromNode, to: toNode, progress: Math.random(), speed: 0.005 + Math.random() * 0.01, color: nodeColors[i % 5], size: 1 + Math.random() * 1.5 });
    }

    let t = 0;
    let cursorCenter = { x: cx, y: cy };

    function animate() {
        ctx.clearRect(0, 0, w, h);
        t += 0.008;
        const m = mouseInCanvas(cvs.parentElement);
        const progress = Math.min(1, t * 0.1);

        if (m.inside) {
            cursorCenter.x += (m.x - cursorCenter.x) * 0.04;
            cursorCenter.y += (m.y - cursorCenter.y) * 0.04;
        } else {
            cursorCenter.x += (cx - cursorCenter.x) * 0.02;
            cursorCenter.y += (cy - cursorCenter.y) * 0.02;
        }

        const cPulse = 0.5 + 0.5 * Math.sin(t * 1.5);
        const centralR = 5 + cPulse * 3 + (m.inside ? 3 : 0);

        const outerGrd = ctx.createRadialGradient(cursorCenter.x, cursorCenter.y, 0, cursorCenter.x, cursorCenter.y, centralR * 15);
        outerGrd.addColorStop(0, `rgba(${C('amber','245,158,11')},${0.12 * cPulse})`);
        outerGrd.addColorStop(0.3, `rgba(${C('purple','167,139,250')},${0.06 * cPulse})`);
        outerGrd.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(cursorCenter.x, cursorCenter.y, centralR * 15, 0, Math.PI * 2);
        ctx.fillStyle = outerGrd; ctx.fill();

        rings.forEach((ring, ri) => {
            if (progress < ring.delay) return;
            const rp = Math.min(1, (progress - ring.delay) * 2);
            ring.radius = ring.maxRadius * rp;
            ring.alpha = 0.15 + 0.08 * Math.sin(t * 2 + ri);
            ctx.beginPath(); ctx.arc(cursorCenter.x, cursorCenter.y, ring.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${ring.color},${ring.alpha * rp})`; ctx.lineWidth = 0.7; ctx.stroke();
        });

        const nodePositions = ringNodes.map(n => {
            if (progress < n.delay) return null;
            const np = Math.min(1, (progress - n.delay) * 3);
            const wobble = Math.sin(t * 0.8 + n.phase) * 4;
            const r = n.baseRadius + wobble;
            const angle = n.angle + t * (0.05 + n.ring * 0.01);
            return { x: cursorCenter.x + Math.cos(angle) * r, y: cursorCenter.y + Math.sin(angle) * r, np, angle };
        });

        ringNodes.forEach((n, ni) => {
            const pos = nodePositions[ni];
            if (!pos) return;
            ctx.beginPath(); ctx.moveTo(cursorCenter.x, cursorCenter.y); ctx.lineTo(pos.x, pos.y);
            const pulse = 0.5 + 0.5 * Math.sin(t * 2 + n.phase);
            ctx.strokeStyle = `rgba(${n.color},${(0.12 + pulse * 0.08) * pos.np})`; ctx.lineWidth = 0.5; ctx.stroke();
            ringNodes.forEach((other, oi) => {
                if (oi <= ni) return;
                const oPos = nodePositions[oi];
                if (!oPos) return;
                if (Math.abs(n.ring - other.ring) > 1) return;
                const dx = oPos.x - pos.x, dy = oPos.y - pos.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist > 80) return;
                ctx.beginPath(); ctx.moveTo(pos.x, pos.y); ctx.lineTo(oPos.x, oPos.y);
                ctx.strokeStyle = `rgba(${n.color},${(1 - dist/80) * 0.18 * pulse * pos.np})`; ctx.lineWidth = 0.3; ctx.stroke();
            });
        });

        sparks.forEach(s => {
            s.progress += s.speed;
            if (s.progress > 1) { s.progress -= 1; s.from = s.to; s.to = Math.floor(Math.random() * ringNodes.length); }
            const fromPos = nodePositions[s.from], toPos = nodePositions[s.to];
            if (!fromPos || !toPos) return;
            const px = fromPos.x + (toPos.x - fromPos.x) * s.progress;
            const py = fromPos.y + (toPos.y - fromPos.y) * s.progress;
            const pulse = 0.6 + 0.4 * Math.sin(t * 4 + s.progress * Math.PI);
            if (pulse > 0.7) {
                const sGrd = ctx.createRadialGradient(px, py, 0, px, py, s.size * pulse * 4);
                sGrd.addColorStop(0, `rgba(${s.color},${0.12 * pulse})`); sGrd.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(px, py, s.size * pulse * 4, 0, Math.PI * 2); ctx.fillStyle = sGrd; ctx.fill();
            }
            ctx.beginPath(); ctx.arc(px, py, s.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.color},${0.25 + pulse * 0.15})`; ctx.fill();
        });

        ringNodes.forEach((n, ni) => {
            const pos = nodePositions[ni];
            if (!pos) return;
            const pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + n.phase);
            let drawX = pos.x, drawY = pos.y, cursorBoost = 0;
            if (m.inside) {
                const dx = m.x - drawX, dy = m.y - drawY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 80 && dist > 1) { cursorBoost = 1 - dist/80; drawX += dx * cursorBoost * 0.14; drawY += dy * cursorBoost * 0.14; }
            }
            const r = (n.size + cursorBoost * 4) * pulse * pos.np;
            if (r > 1) {
                const grd = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, r * 4);
                grd.addColorStop(0, `rgba(${n.color},${(0.18 + cursorBoost * 0.18) * pulse * pos.np})`); grd.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(drawX, drawY, r * 4, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
            }
            ctx.beginPath(); ctx.arc(drawX, drawY, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${n.color},${(0.4 + pulse * 0.35 + cursorBoost * 0.2) * pos.np})`; ctx.fill();
        });

        const cGrd = ctx.createRadialGradient(cursorCenter.x, cursorCenter.y, 0, cursorCenter.x, cursorCenter.y, centralR);
        cGrd.addColorStop(0, `rgba(${C('text','232,232,240')},${0.4 + cPulse * 0.3})`);
        cGrd.addColorStop(0.4, `rgba(${C('amber','245,158,11')},${0.3 + cPulse * 0.2})`);
        cGrd.addColorStop(1, `rgba(${C('amber','245,158,11')},0)`);
        ctx.beginPath(); ctx.arc(cursorCenter.x, cursorCenter.y, centralR, 0, Math.PI * 2);
        ctx.fillStyle = cGrd; ctx.fill();

        ctx.font = `bold ${10 + cPulse * 3}px JetBrains Mono`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(${C('text','232,232,240')},${0.7 + cPulse * 0.25})`;
        ctx.fillText('?', cursorCenter.x, cursorCenter.y);
        ctx.textBaseline = 'alphabetic';

        requestAnimationFrame(animate);
    }
    animate();
}

let closeDrawn = false;
const closeObs = new IntersectionObserver(es => {
    es.forEach(e => {
        if (!e.isIntersecting || closeDrawn) return;
        closeDrawn = true;
        drawCloseCanvas();
    });
}, { threshold: 0.25 });
closeObs.observe(document.getElementById('close-cvs'));
})();
