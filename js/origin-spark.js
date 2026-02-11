/* TRP Site — Origin: Spark Canvas (divergent thought map)
   Extracted from output/index.html. The inside of the builder's head. */

(function() {
function drawSparkCanvas() {
    const cvs = document.getElementById('spark-cvs');
    const ctx = cvs.getContext('2d');
    const rect = cvs.parentElement.getBoundingClientRect();
    const h = rect.height || 400;
    cvs.width = rect.width * 2; cvs.height = h * 2;
    ctx.scale(2, 2);
    const w = rect.width;

    const thoughts = [
        // Core ideas (bigger, brighter)
        { x: w*0.5, y: h*0.5, label: 'attention', color: '245,158,11', r: 5, type: 'core' },
        { x: w*0.2, y: h*0.3, label: 'typed edges', color: '167,139,250', r: 4, type: 'core' },
        { x: w*0.8, y: h*0.25, label: 'thresholds', color: '96,165,250', r: 4, type: 'core' },
        { x: w*0.15, y: h*0.7, label: 'self-mod', color: '239,68,68', r: 4, type: 'core' },
        { x: w*0.85, y: h*0.72, label: 'self-knowledge', color: '52,211,153', r: 4, type: 'core' },
        // Tangents (smaller, chaotic)
        { x: w*0.35, y: h*0.15, label: 'what if edges\nhad types?', color: '167,139,250', r: 2.5, type: 'tangent' },
        { x: w*0.65, y: h*0.12, label: 'wait\u2014neurons\ndon\'t all fire', color: '96,165,250', r: 2.5, type: 'tangent' },
        { x: w*0.08, y: h*0.45, label: 'REQUIRES vs\nUSES vs...', color: '167,139,250', r: 2, type: 'tangent' },
        { x: w*0.92, y: h*0.45, label: 'O(n\u00b2) is\ninsane actually', color: '96,165,250', r: 2, type: 'tangent' },
        { x: w*0.3, y: h*0.85, label: 'what if the model\nwrote to itself?', color: '239,68,68', r: 2.5, type: 'tangent' },
        { x: w*0.7, y: h*0.88, label: 'cite your\nsources or lose', color: '52,211,153', r: 2.5, type: 'tangent' },
        { x: w*0.5, y: h*0.3, label: 'transformers\nare frozen??', color: '245,158,11', r: 2, type: 'tangent' },
        { x: w*0.42, y: h*0.7, label: 'sessions\nreset??', color: '239,68,68', r: 2, type: 'tangent' },
        { x: w*0.6, y: h*0.65, label: 'loss function\nonly cares\nabout tokens', color: '52,211,153', r: 2, type: 'tangent' },
        // Distractions (tiny, fast)
        { x: w*0.25, y: h*0.52, label: 'coffee', color: '128,128,160', r: 1.5, type: 'distraction' },
        { x: w*0.72, y: h*0.4, label: 'rent', color: '128,128,160', r: 1.5, type: 'distraction' },
        { x: w*0.48, y: h*0.9, label: '3am', color: '128,128,160', r: 1.5, type: 'distraction' },
        { x: w*0.12, y: h*0.15, label: 'what if\nall of it\nconnects', color: '245,158,11', r: 1.5, type: 'distraction' },
        { x: w*0.88, y: h*0.1, label: 'wait no\ngo back', color: '128,128,160', r: 1.5, type: 'distraction' },
        { x: w*0.55, y: h*0.48, label: 'Whitehead\n1929???', color: '216,216,228', r: 1.5, type: 'distraction' },
        { x: w*0.38, y: h*0.38, label: 'if reading \u2260\nlearning then...', color: '245,158,11', r: 2, type: 'tangent' },
        // More chaos
        { x: w*0.75, y: h*0.55, label: 'graph\nattention', color: '167,139,250', r: 1.5, type: 'distraction' },
        { x: w*0.18, y: h*0.88, label: 'can a model\nknow itself?', color: '52,211,153', r: 2, type: 'tangent' },
        { x: w*0.5, y: h*0.08, label: 'sparse attention\nalready exists\nbut different', color: '96,165,250', r: 2, type: 'tangent' },
        { x: w*0.3, y: h*0.6, label: 'transparent\nnot black\nnot white', color: '245,158,11', r: 2.5, type: 'tangent' },
    ];

    const connections = [];
    for (let i = 0; i < thoughts.length; i++) {
        const numConns = 2 + Math.floor(Math.random() * 3);
        for (let c = 0; c < numConns; c++) {
            const j = Math.floor(Math.random() * thoughts.length);
            if (j !== i) connections.push({ from: i, to: j, phase: Math.random() * Math.PI * 2 });
        }
    }

    thoughts.forEach(t => { t.phase = Math.random() * Math.PI * 2; t.wobbleX = (Math.random()-0.5) * 8; t.wobbleY = (Math.random()-0.5) * 6; });

    let t = 0;
    function animate() {
        ctx.clearRect(0, 0, w, h);
        t += 0.01;
        const m = mouseInCanvas(cvs.parentElement);
        const progress = Math.min(1, t * 0.15);

        connections.forEach((c, ci) => {
            const delay = ci * 0.007;
            if (progress < delay) return;
            const connProgress = Math.min(1, (progress - delay) * 8);
            const a = thoughts[c.from], b = thoughts[c.to];
            const ax = a.x + Math.sin(t * 0.7 + a.phase) * a.wobbleX;
            const ay = a.y + Math.cos(t * 0.5 + a.phase) * a.wobbleY;
            const bx = b.x + Math.sin(t * 0.7 + b.phase) * b.wobbleX;
            const by = b.y + Math.cos(t * 0.5 + b.phase) * b.wobbleY;
            const pulse = 0.5 + 0.5 * Math.sin(t * 2 + c.phase);
            const isCore = a.type === 'core' || b.type === 'core';
            ctx.beginPath();
            const cpx = (ax + bx) / 2 + Math.sin(c.phase + t * 0.3) * 20;
            const cpy = (ay + by) / 2 + Math.cos(c.phase + t * 0.3) * 15;
            ctx.moveTo(ax, ay);
            ctx.quadraticCurveTo(cpx, cpy, ax + (bx - ax) * connProgress, ay + (by - ay) * connProgress);
            const baseColor = isCore ? a.color : '128,128,160';
            ctx.strokeStyle = `rgba(${baseColor},${(isCore ? 0.22 : 0.12) + pulse * 0.1})`;
            ctx.lineWidth = isCore ? 0.8 + pulse * 0.6 : 0.5;
            ctx.stroke();
        });

        thoughts.forEach((th, i) => {
            const delay = i * 0.02;
            if (progress < delay) return;
            const nodeProgress = Math.min(1, (progress - delay) * 5);
            const wobX = Math.sin(t * (th.type === 'distraction' ? 1.5 : 0.7) + th.phase) * th.wobbleX;
            const wobY = Math.cos(t * (th.type === 'distraction' ? 1.2 : 0.5) + th.phase) * th.wobbleY;
            let nx = th.x + wobX, ny = th.y + wobY;
            const pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + th.phase);
            let cursorBoost = 0;
            if (m.inside) {
                const dx = m.x - nx, dy = m.y - ny;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100 && dist > 1) {
                    cursorBoost = (1 - dist/100);
                    nx += dx * cursorBoost * 0.15;
                    ny += dy * cursorBoost * 0.15;
                }
            }
            const r = (th.r + (th.type === 'core' ? pulse * 2 : pulse * 0.5)) * nodeProgress + cursorBoost * 4;
            if (th.type === 'core' || cursorBoost > 0.2) {
                const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 4);
                grd.addColorStop(0, `rgba(${th.color},${(0.15 + cursorBoost * 0.2) * pulse * nodeProgress})`);
                grd.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(nx, ny, r * 4, 0, Math.PI * 2);
                ctx.fillStyle = grd; ctx.fill();
            }
            ctx.beginPath(); ctx.arc(nx, ny, r, 0, Math.PI * 2);
            const alpha = (th.type === 'core' ? 0.7 : th.type === 'tangent' ? 0.45 : 0.3) + cursorBoost * 0.4;
            ctx.fillStyle = `rgba(${th.color},${alpha * nodeProgress * pulse})`;
            ctx.fill();
            if (th.label && nodeProgress > 0.5 && (th.type !== 'distraction' || cursorBoost > 0.3)) {
                ctx.font = `${th.type === 'core' ? 9 : 7}px JetBrains Mono`;
                ctx.textAlign = 'center';
                ctx.fillStyle = `rgba(${th.color},${(th.type === 'core' ? 0.7 : 0.45 + cursorBoost * 0.4) * nodeProgress})`;
                const lines = th.label.split('\n');
                lines.forEach((line, li) => {
                    ctx.fillText(line, nx, ny + r + 8 + li * 10);
                });
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}

let sparkDrawn = false;
const sparkObs = new IntersectionObserver(es => {
    es.forEach(e => {
        if (!e.isIntersecting || sparkDrawn) return;
        sparkDrawn = true;
        drawSparkCanvas();
    });
}, { threshold: 0.4 });
sparkObs.observe(document.getElementById('spark-cvs'));
})();
