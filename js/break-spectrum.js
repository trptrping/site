/* TRP Site — Break: Binary-to-Spectral spectrum canvas + confidence bars */

(function() {
    // ===== SPECTRUM CANVAS =====
    function drawSpectrumCanvas() {
        const cvs = document.getElementById('spectrum-cvs');
        const ctx = cvs.getContext('2d');
        const rect = cvs.parentElement.getBoundingClientRect();
        cvs.width = rect.width * 2; cvs.height = 280 * 2;
        ctx.scale(2, 2);
        const w = rect.width, h = 280;

        const cols = [
            { color: '239,68,68',   label: 'binary',    mode: 'solid' },
            { color: '245,158,11',  label: 'uncertain',  mode: 'flicker' },
            { color: '96,165,250',  label: 'grounded',   mode: 'pinpoint' },
            { color: '52,211,153',  label: 'spectral',   mode: 'spectrum' },
        ];
        const colW = 50, gap = 24;
        const totalW = cols.length * colW + (cols.length - 1) * gap;
        const startX = (w - totalW) / 2;
        const barTop = 30, barBot = h - 35;
        const barH = barBot - barTop;

        // particles per column
        const particles = [];
        cols.forEach((c, ci) => {
            for (let i = 0; i < 6; i++) {
                const cx = startX + ci * (colW + gap) + colW / 2;
                particles.push({ ci, x: cx + (Math.random() - 0.5) * 70, y: barTop + Math.random() * barH,
                    vx: (Math.random() - 0.5) * 0.3, vy: -0.2 - Math.random() * 0.4, r: 1 + Math.random(), phase: Math.random() * Math.PI * 2 });
            }
        });

        let t = 0;
        function animate() {
            ctx.clearRect(0, 0, w, h);
            t += 0.016;
            const m = mouseInCanvas(cvs.parentElement);

            cols.forEach((c, ci) => {
                const appear = Math.min(1, Math.max(0, (t - ci * 0.35) * 1.8));
                if (appear <= 0) return;
                const x = startX + ci * (colW + gap);
                const cx = x + colW / 2;

                // cursor glow
                let glow = 0;
                if (m.inside) { const dx = m.x - cx, dy = m.y - (barTop + barH / 2); glow = Math.max(0, 1 - Math.sqrt(dx*dx + dy*dy) / 140); }
                const baseA = (0.35 + glow * 0.3) * appear;

                if (c.mode === 'solid') {
                    ctx.fillStyle = `rgba(${c.color},${baseA * 0.6})`;
                    ctx.fillRect(x, barTop, colW, barH * appear);
                } else if (c.mode === 'flicker') {
                    const fh = barH * (0.4 + Math.random() * 0.55) * appear;
                    ctx.fillStyle = `rgba(${c.color},${baseA * (0.4 + Math.random() * 0.3)})`;
                    ctx.fillRect(x, barBot - fh, colW, fh);
                } else if (c.mode === 'pinpoint') {
                    const ph = 18 * appear;
                    const py = barTop + barH * 0.35;
                    ctx.fillStyle = `rgba(${c.color},${baseA * 0.9})`;
                    ctx.fillRect(x, py, colW, ph);
                    // faint guide lines
                    ctx.strokeStyle = `rgba(${c.color},${baseA * 0.15})`;
                    ctx.lineWidth = 0.5;
                    ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(x, barTop); ctx.lineTo(x, barBot); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(x + colW, barTop); ctx.lineTo(x + colW, barBot); ctx.stroke();
                    ctx.setLineDash([]);
                } else if (c.mode === 'spectrum') {
                    const bands = [0.9, 0.55, 0.75, 0.3, 0.65, 0.85, 0.4];
                    const bandH = barH / bands.length;
                    bands.forEach((bv, bi) => {
                        const by = barTop + bi * bandH;
                        const a = baseA * bv * appear;
                        ctx.fillStyle = `rgba(${c.color},${a})`;
                        ctx.fillRect(x, by, colW, bandH - 1);
                    });
                }

                // column label
                ctx.font = 'bold 9px JetBrains Mono'; ctx.textAlign = 'center';
                ctx.fillStyle = `rgba(${c.color},${0.5 * appear + glow * 0.3})`;
                ctx.fillText(c.label, cx, barBot + 16);
            });

            // particles
            particles.forEach(p => {
                const c = cols[p.ci];
                const appear = Math.min(1, Math.max(0, (t - p.ci * 0.35) * 1.8));
                if (appear <= 0) return;
                p.x += p.vx; p.y += p.vy;
                if (p.y < barTop - 20 || p.y > barBot + 20) { p.y = barBot; p.x = startX + p.ci * (colW + gap) + colW / 2 + (Math.random() - 0.5) * 70; }
                const pulse = 0.5 + 0.5 * Math.sin(t * 3 + p.phase);
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${c.color},${0.12 + pulse * 0.18})`; ctx.fill();
            });

            // Q labels at top
            cols.forEach((c, ci) => {
                const appear = Math.min(1, Math.max(0, (t - ci * 0.35) * 1.8));
                if (appear <= 0) return;
                const cx = startX + ci * (colW + gap) + colW / 2;
                ctx.font = 'bold 10px JetBrains Mono'; ctx.textAlign = 'center';
                ctx.fillStyle = `rgba(${c.color},${0.55 * appear})`;
                ctx.fillText('Q' + (ci + 1), cx, barTop - 10);
            });

            requestAnimationFrame(animate);
        }
        animate();
    }

    let spectrumDrawn = false;
    const specObs = new IntersectionObserver(es => {
        es.forEach(e => {
            if (!e.isIntersecting || spectrumDrawn) return;
            spectrumDrawn = true;
            drawSpectrumCanvas();
        });
    }, { threshold: 0.2 });
    specObs.observe(document.getElementById('spectrum-cvs'));

    // ===== CONFIDENCE BARS =====
    let confFired = false;
    const confObs = new IntersectionObserver(es => {
        es.forEach(e => {
            if (!e.isIntersecting || confFired) return;
            confFired = true;
            document.querySelectorAll('#break-conf .conf-fill[data-w]').forEach((bar, i) => {
                setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, i * 200);
            });
        });
    }, { threshold: 0.3 });
    const confEl = document.getElementById('break-conf');
    if (confEl) confObs.observe(confEl);
})();
