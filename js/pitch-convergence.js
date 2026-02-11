/* TRP Site — Pitch: Convergence Canvas + Box Traits + Confidence Bars */

(function() {
    // ===== CONVERGENCE CANVAS =====
    function drawConvergeCanvas() {
        const cvs = document.getElementById('converge-bg');
        const box = document.getElementById('thebox');
        const rect = box.getBoundingClientRect();
        cvs.width = rect.width * 2; cvs.height = rect.height * 2;
        cvs.style.width = rect.width + 'px';
        cvs.style.height = rect.height + 'px';
        const ctx = cvs.getContext('2d');
        ctx.scale(2, 2);
        const w = rect.width, h = rect.height;

        const streams = [
            { color: '167,139,250', startX: 0, startY: 0, label: 'typed' },
            { color: '96,165,250', startX: w, startY: 0, label: 'thresholds' },
            { color: '239,68,68', startX: 0, startY: h, label: 'trace' },
            { color: '52,211,153', startX: w, startY: h, label: 'self-knowledge' },
        ];

        const particles = [];
        streams.forEach((s, si) => {
            for (let i = 0; i < 8; i++) {
                particles.push({
                    stream: si,
                    t: Math.random(),
                    speed: 0.002 + Math.random() * 0.003,
                    offset: (Math.random() - 0.5) * 30,
                });
            }
        });

        let t = 0;
        function animate() {
            const newRect = box.getBoundingClientRect();
            if (Math.abs(newRect.width - w) > 2) {
                drawConvergeCanvas();
                return;
            }

            ctx.clearRect(0, 0, w, h);
            t += 0.01;
            const cx = w / 2, cy = h / 2;

            const pulse = 0.5 + 0.5 * Math.sin(t * 1.5);
            const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.35);
            grd.addColorStop(0, `rgba(245,158,11,${0.08 + pulse * 0.06})`);
            grd.addColorStop(0.5, `rgba(167,139,250,${0.04 + pulse * 0.04})`);
            grd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(cx, cy, Math.min(w, h) * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = grd; ctx.fill();

            particles.forEach(p => {
                p.t += p.speed;
                if (p.t > 1) p.t -= 1;
                const s = streams[p.stream];
                const ease = p.t * p.t;
                const px = s.startX + (cx - s.startX) * ease + Math.sin(t + p.offset) * (1 - ease) * p.offset * 0.3;
                const py = s.startY + (cy - s.startY) * ease + Math.cos(t + p.offset) * (1 - ease) * p.offset * 0.3;
                const alpha = p.t < 0.1 ? p.t * 10 : (p.t > 0.85 ? (1 - p.t) * 6.67 : 1);
                const r = 1 + ease * 1.5;
                ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${s.color},${0.15 + alpha * 0.35})`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }
        animate();
    }

    let convergeDrawn = false;
    const convergeObs = new IntersectionObserver(es => {
        es.forEach(e => {
            if (!e.isIntersecting || convergeDrawn) return;
            convergeDrawn = true;
            drawConvergeCanvas();
        });
    }, { threshold: 0.1 });
    convergeObs.observe(document.getElementById('thebox'));

    // ===== BOX TRAITS =====
    const boxObs = new IntersectionObserver(es => {
        es.forEach(e => {
            if (!e.isIntersecting) return;
            const box = document.getElementById('thebox');
            box.classList.add('glow-on');
            box.querySelectorAll('.trait').forEach((t, i) => {
                setTimeout(() => t.classList.add('show'), i * 300);
            });
            boxObs.unobserve(e.target);
        });
    }, { threshold: 0.2 });
    boxObs.observe(document.getElementById('thebox'));

    // ===== CONFIDENCE BARS ANIMATION =====
    let confFired = false;
    const confObs = new IntersectionObserver(es => {
        es.forEach(e => {
            if (!e.isIntersecting || confFired) return;
            confFired = true;
            document.querySelectorAll('#conf-section .conf-fill[data-w]').forEach((bar, i) => {
                setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, i * 200);
            });
        });
    }, { threshold: 0.3 });
    confObs.observe(document.getElementById('conf-section'));
})();
