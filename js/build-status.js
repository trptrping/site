/* TRP Site — Build Log: Status Stack Canvas + Timeline
   Three states: BUILT (green), SYNTHETIC (amber), DESIGNED (dim) */

(function() {

// ===== TIMELINE FILL ANIMATION =====
var tlFired = false;
var tlEl = document.getElementById('build-timeline');
if (tlEl) {
    var tlObs = new IntersectionObserver(function(es) {
        es.forEach(function(e) {
            if (!e.isIntersecting || tlFired) return;
            tlFired = true;
            document.getElementById('tl-fill').style.width = '100%';
            document.querySelectorAll('.tl-day').forEach(function(day, i) {
                setTimeout(function() { day.classList.add('done'); }, i * 250);
            });
        });
    }, { threshold: 0.2 });
    tlObs.observe(tlEl);
}

// ===== STATUS STACK CANVAS =====
function drawStackCanvas() {
    var cvs = document.getElementById('stack-cvs');
    if (!cvs) return;
    var ctx = cvs.getContext('2d');
    var rect = cvs.parentElement.getBoundingClientRect();
    var h = rect.height || 320;
    cvs.width = rect.width * 2; cvs.height = h * 2;
    ctx.scale(2, 2);
    var w = rect.width;

    var green = C('green','52,211,153');
    var amber = C('amber','245,158,11');
    var dim = C('dim','92,92,116');

    var layers = [
        { label: 'Layer 0: Fine-tuned 7B', desc: 'Voice from 4,490 conversations', status: 'built', color: green },
        { label: 'Layer 1: ATLAS Retrieval', desc: '17 section files, keyword search', status: 'synthetic', color: amber },
        { label: 'Layer 2: Typed Routing', desc: '4 edge types, propagation rules', status: 'synthetic', color: amber },
        { label: 'Layer 3: Persistent Trace', desc: 'Node files, session logs, MEMORY.md', status: 'synthetic', color: amber },
        { label: 'Layer 4: Attribution Output', desc: 'Every generation carries its proof', status: 'designed', color: dim },
    ];

    var flowParticles = [];
    for (var i = 0; i < 25; i++) {
        flowParticles.push({
            layer: Math.floor(Math.random() * 4),
            progress: Math.random(),
            speed: 0.003 + Math.random() * 0.005,
            x: w * (0.15 + Math.random() * 0.7),
            size: 1 + Math.random() * 1.5,
            phase: Math.random() * Math.PI * 2
        });
    }

    var t = 0;
    function animate() {
        ctx.clearRect(0, 0, w, h);
        t += 0.015;
        var m = mouseInCanvas(cvs.parentElement);

        var layerH = 42;
        var gap = 14;
        var totalH = layers.length * (layerH + gap) - gap;
        var startY = (h - totalH) / 2;

        // Flow particles between layers
        flowParticles.forEach(function(fp) {
            fp.progress += fp.speed;
            if (fp.progress > 1) { fp.progress -= 1; fp.layer = (fp.layer + 1) % 4; fp.x = w * (0.15 + Math.random() * 0.7); }
            var y1 = startY + fp.layer * (layerH + gap) + layerH;
            var y2 = startY + (fp.layer + 1) * (layerH + gap);
            var py = y1 + (y2 - y1) * fp.progress;
            var pulse = 0.5 + 0.5 * Math.sin(t * 3 + fp.phase);
            var col = layers[fp.layer].color;
            ctx.beginPath(); ctx.arc(fp.x, py, fp.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + col + ',' + (0.12 + pulse * 0.12) + ')';
            ctx.fill();
        });

        // Draw each layer
        layers.forEach(function(l, i) {
            var y = startY + i * (layerH + gap);
            var isBuilt = l.status === 'built';
            var isSynthetic = l.status === 'synthetic';
            var pulse = 0.6 + 0.4 * Math.sin(t * 1.5 + i * 0.5);
            var hover = 0;
            if (m.inside && m.y >= y && m.y <= y + layerH) hover = 1;

            var barX = w * 0.05, barW = w * 0.9;

            // Background fill
            var bgA = isBuilt ? (0.12 + pulse * 0.08 + hover * 0.06)
                : isSynthetic ? (0.07 + pulse * 0.04 + hover * 0.05)
                : (0.03 + hover * 0.03);
            ctx.fillStyle = 'rgba(' + l.color + ',' + bgA + ')';
            ctx.beginPath(); ctx.roundRect(barX, y, barW, layerH, 8); ctx.fill();

            // Border
            var bA = isBuilt ? (0.35 + pulse * 0.2 + hover * 0.15)
                : isSynthetic ? (0.22 + pulse * 0.12 + hover * 0.1)
                : (0.08 + hover * 0.05);
            ctx.strokeStyle = 'rgba(' + l.color + ',' + bA + ')';
            ctx.lineWidth = isBuilt ? 1.5 : (isSynthetic ? 1.2 : 0.7);
            ctx.beginPath(); ctx.roundRect(barX, y, barW, layerH, 8); ctx.stroke();

            // Inner gradient
            if (isBuilt) {
                var grd = ctx.createLinearGradient(barX, 0, barX + barW, 0);
                grd.addColorStop(0, 'rgba(' + l.color + ',' + (0.18 + pulse * 0.12) + ')');
                grd.addColorStop(1, 'rgba(' + l.color + ',0.06)');
                ctx.fillStyle = grd;
                ctx.beginPath(); ctx.roundRect(barX + 1, y + 1, barW - 2, layerH - 2, 7); ctx.fill();
            } else if (isSynthetic) {
                // Scanning glow for synthetic — shows it's alive but not solid
                var scanX = barX + ((t * 30 + i * 80) % barW);
                var grd = ctx.createRadialGradient(scanX, y + layerH/2, 0, scanX, y + layerH/2, 100);
                grd.addColorStop(0, 'rgba(' + l.color + ',0.1)');
                grd.addColorStop(1, 'transparent');
                ctx.fillStyle = grd;
                ctx.beginPath(); ctx.roundRect(barX + 1, y + 1, barW - 2, layerH - 2, 7); ctx.fill();

                // Dashed inner border to signal "not solid"
                ctx.save();
                ctx.setLineDash([6, 4]);
                ctx.strokeStyle = 'rgba(' + l.color + ',' + (0.1 + pulse * 0.06) + ')';
                ctx.lineWidth = 0.5;
                ctx.beginPath(); ctx.roundRect(barX + 4, y + 4, barW - 8, layerH - 8, 5); ctx.stroke();
                ctx.restore();
            } else {
                var scanX = barX + ((t * 20 + i * 60) % barW);
                var grd = ctx.createRadialGradient(scanX, y + layerH/2, 0, scanX, y + layerH/2, 60);
                grd.addColorStop(0, 'rgba(' + l.color + ',0.06)');
                grd.addColorStop(1, 'transparent');
                ctx.fillStyle = grd;
                ctx.beginPath(); ctx.roundRect(barX + 1, y + 1, barW - 2, layerH - 2, 7); ctx.fill();
            }

            // Layer label
            ctx.font = 'bold 12px JetBrains Mono';
            ctx.fillStyle = 'rgba(' + l.color + ',' + (isBuilt ? (0.9 + pulse * 0.1) : isSynthetic ? (0.8 + pulse * 0.1) : 0.55) + ')';
            ctx.textAlign = 'left';
            ctx.fillText(l.label, barX + 14, y + 18);

            // Description
            ctx.font = '9px JetBrains Mono';
            ctx.fillStyle = 'rgba(' + l.color + ',' + (isBuilt ? (0.6 + pulse * 0.1) : isSynthetic ? (0.5 + pulse * 0.08) : 0.35) + ')';
            ctx.fillText(l.desc, barX + 14, y + 33);

            // Status badge
            ctx.textAlign = 'right';
            ctx.font = 'bold 10px JetBrains Mono';
            if (isBuilt) {
                ctx.fillStyle = 'rgba(' + l.color + ',0.85)';
                ctx.fillText('\u25CF BUILT', barX + barW - 14, y + layerH / 2 + 4);
            } else if (isSynthetic) {
                ctx.fillStyle = 'rgba(' + l.color + ',0.75)';
                ctx.fillText('\u25D0 SYNTHETIC', barX + barW - 14, y + layerH / 2 + 4);
            } else {
                ctx.fillStyle = 'rgba(' + l.color + ',0.45)';
                ctx.fillText('\u25CB DESIGNED', barX + barW - 14, y + layerH / 2 + 4);
            }
        });

        // Connection lines between layers
        var lineX = w * 0.05 - 10;
        layers.forEach(function(l, i) {
            if (i === 0) return;
            var y1 = startY + (i - 1) * (layerH + gap) + layerH;
            var y2 = startY + i * (layerH + gap);
            var bothActive = l.status !== 'designed' && layers[i-1].status !== 'designed';
            var bothBuilt = l.status === 'built' && layers[i-1].status === 'built';
            ctx.beginPath(); ctx.moveTo(lineX, y1); ctx.lineTo(lineX, y2);
            ctx.strokeStyle = bothBuilt ? 'rgba(' + green + ',0.35)' : bothActive ? 'rgba(' + amber + ',0.25)' : 'rgba(' + dim + ',0.12)';
            ctx.lineWidth = 1.5; ctx.stroke();
            var my = (y1 + y2) / 2;
            ctx.beginPath(); ctx.moveTo(lineX - 3, my - 3); ctx.lineTo(lineX, my); ctx.lineTo(lineX - 3, my + 3);
            ctx.strokeStyle = bothBuilt ? 'rgba(' + green + ',0.4)' : bothActive ? 'rgba(' + amber + ',0.3)' : 'rgba(' + dim + ',0.15)';
            ctx.lineWidth = 1; ctx.stroke();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

var stackDrawn = false;
var stackEl = document.getElementById('status');
if (stackEl) {
    var stackObs = new IntersectionObserver(function(es) {
        es.forEach(function(e) {
            if (!e.isIntersecting || stackDrawn) return;
            stackDrawn = true;
            drawStackCanvas();
        });
    }, { threshold: 0.1 });
    stackObs.observe(stackEl);
}

})();
