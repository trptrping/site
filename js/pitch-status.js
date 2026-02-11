/* TRP Site — Pitch: Status Stack Canvas + Timeline Animation */

(function() {

// ===== TIMELINE FILL ANIMATION =====
let tlFired = false;
const tlObs = new IntersectionObserver(es => {
    es.forEach(e => {
        if (!e.isIntersecting || tlFired) return;
        tlFired = true;
        document.getElementById('tl-fill').style.width = '100%';
        document.querySelectorAll('.tl-day').forEach((day, i) => {
            setTimeout(() => { day.classList.add('done'); }, i * 250);
        });
    });
}, { threshold: 0.2 });
tlObs.observe(document.getElementById('build-timeline'));

// ===== STATUS STACK CANVAS =====
function drawStackCanvas() {
    const cvs = document.getElementById('stack-cvs');
    const ctx = cvs.getContext('2d');
    const rect = cvs.parentElement.getBoundingClientRect();
    cvs.width = rect.width * 2; cvs.height = 320 * 2;
    ctx.scale(2, 2);
    const w = rect.width, h = 320;

    const layers = [
        { label: 'Layer 0: Fine-tuned 7B', desc: 'Voice learned from 4,490 conversation examples', status: 'built', color: C('green','52,211,153') },
        { label: 'Layer 1: ATLAS Retrieval', desc: 'Keyword search over 147 chunks from 14 source files', status: 'built', color: C('green','52,211,153') },
        { label: 'Layer 2: Typed Routing', desc: 'Edges carry REQUIRES / USES / CONTRADICTS labels', status: 'designed', color: C('amber','245,158,11') },
        { label: 'Layer 3: Persistent Trace', desc: 'Model writes what it did, reads its own history', status: 'designed', color: C('amber','245,158,11') },
        { label: 'Layer 4: Attribution Output', desc: 'Every generation carries its own proof', status: 'designed', color: C('purple','167,139,250') },
    ];

    const flowParticles = [];
    for (let i = 0; i < 30; i++) {
        flowParticles.push({
            layer: Math.floor(Math.random() * 4),
            progress: Math.random(),
            speed: 0.003 + Math.random() * 0.005,
            x: w * (0.15 + Math.random() * 0.7),
            size: 1 + Math.random() * 1.5,
            phase: Math.random() * Math.PI * 2,
        });
    }

    let t = 0;
    function animate() {
        ctx.clearRect(0, 0, w, h);
        t += 0.015;
        const m = mouseInCanvas(cvs.parentElement);

        const layerH = 42;
        const gap = 14;
        const totalH = layers.length * (layerH + gap) - gap;
        const startY = (h - totalH) / 2;

        flowParticles.forEach(fp => {
            fp.progress += fp.speed;
            if (fp.progress > 1) { fp.progress -= 1; fp.layer = (fp.layer + 1) % 4; fp.x = w * (0.15 + Math.random() * 0.7); }
            const y1 = startY + fp.layer * (layerH + gap) + layerH;
            const y2 = startY + (fp.layer + 1) * (layerH + gap);
            const py = y1 + (y2 - y1) * fp.progress;
            const pulse = 0.5 + 0.5 * Math.sin(t * 3 + fp.phase);
            const col = layers[fp.layer].color;
            ctx.beginPath(); ctx.arc(fp.x, py, fp.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${col},${0.15 + pulse * 0.15})`;
            ctx.fill();
        });

        layers.forEach((l, i) => {
            const y = startY + i * (layerH + gap);
            const built = l.status === 'built';
            const pulse = 0.6 + 0.4 * Math.sin(t * 1.5 + i * 0.5);
            let hover = 0;
            if (m.inside && m.y >= y && m.y <= y + layerH) hover = 1;

            const barX = w * 0.05, barW = w * 0.9;
            ctx.fillStyle = `rgba(${l.color},${built ? 0.12 + pulse * 0.08 + hover * 0.06 : 0.06 + hover * 0.04})`;
            ctx.beginPath(); ctx.roundRect(barX, y, barW, layerH, 8); ctx.fill();
            ctx.strokeStyle = `rgba(${l.color},${built ? 0.35 + pulse * 0.2 + hover * 0.15 : 0.12 + hover * 0.08})`;
            ctx.lineWidth = built ? 1.5 : 0.8;
            ctx.beginPath(); ctx.roundRect(barX, y, barW, layerH, 8); ctx.stroke();

            if (built) {
                const grd = ctx.createLinearGradient(barX, 0, barX + barW, 0);
                grd.addColorStop(0, `rgba(${l.color},${0.18 + pulse * 0.12})`);
                grd.addColorStop(1, `rgba(${l.color},${0.08})`);
                ctx.fillStyle = grd;
                ctx.beginPath(); ctx.roundRect(barX + 1, y + 1, barW - 2, layerH - 2, 7); ctx.fill();
            } else {
                const scanX = barX + ((t * 40 + i * 60) % barW);
                const grd = ctx.createRadialGradient(scanX, y + layerH/2, 0, scanX, y + layerH/2, 80);
                grd.addColorStop(0, `rgba(${l.color},0.16)`);
                grd.addColorStop(1, 'transparent');
                ctx.fillStyle = grd;
                ctx.beginPath(); ctx.roundRect(barX + 1, y + 1, barW - 2, layerH - 2, 7); ctx.fill();
            }

            ctx.font = 'bold 12px JetBrains Mono';
            ctx.fillStyle = `rgba(${l.color},${built ? 0.85 + pulse * 0.15 : 0.5})`;
            ctx.textAlign = 'left';
            ctx.fillText(l.label, barX + 14, y + 18);
            ctx.font = '9px JetBrains Mono';
            ctx.fillStyle = `rgba(${l.color},${built ? 0.45 + pulse * 0.1 : 0.25})`;
            ctx.fillText(l.desc, barX + 14, y + 33);
            ctx.textAlign = 'right';
            ctx.font = 'bold 10px JetBrains Mono';
            ctx.fillStyle = `rgba(${l.color},${built ? 0.75 : 0.4})`;
            ctx.fillText(built ? '\u25CF LIVE' : '\u25CB DESIGNED', barX + barW - 14, y + layerH / 2 + 4);
        });

        const lineX = w * 0.05 - 10;
        layers.forEach((l, i) => {
            if (i === 0) return;
            const y1 = startY + (i - 1) * (layerH + gap) + layerH;
            const y2 = startY + i * (layerH + gap);
            const built = l.status === 'built' && layers[i-1].status === 'built';
            ctx.beginPath(); ctx.moveTo(lineX, y1); ctx.lineTo(lineX, y2);
            ctx.strokeStyle = built ? `rgba(${C('green','52,211,153')},0.35)` : `rgba(${C('dim','92,92,116')},0.18)`;
            ctx.lineWidth = 1.5; ctx.stroke();
            const my = (y1 + y2) / 2;
            ctx.beginPath(); ctx.moveTo(lineX - 3, my - 3); ctx.lineTo(lineX, my); ctx.lineTo(lineX - 3, my + 3);
            ctx.strokeStyle = built ? `rgba(${C('green','52,211,153')},0.4)` : `rgba(${C('dim','92,92,116')},0.2)`;
            ctx.lineWidth = 1; ctx.stroke();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

let stackDrawn = false;
const stackObs = new IntersectionObserver(es => {
    es.forEach(e => {
        if (!e.isIntersecting || stackDrawn) return;
        stackDrawn = true;
        drawStackCanvas();
    });
}, { threshold: 0.1 });
stackObs.observe(document.getElementById('status'));

})();
