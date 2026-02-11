/* TRP About Page — Visual Storytelling Canvases
   Three canvases: approach (propositional vs architectural),
   evolution (Gen 1→2→3 timeline), experiment (results comparison) */

// ===== APPROACH CANVAS =====
// Left side: flat rules falling into a black box
// Right side: interconnected architecture with visible structure
(function() {
    var cvs = document.getElementById('approach-cvs');
    if (!cvs) return;
    var ctx = cvs.getContext('2d');
    var w, h, dpr;
    var startTime = Date.now();

    var ruleTexts = ['be transparent', 'cite sources', 'admit uncertainty', 'follow protocol', 'stay consistent', 'check facts'];

    var archNodes = [];
    var archEdges = [];

    function resize() {
        dpr = window.devicePixelRatio || 1;
        var rect = cvs.parentElement.getBoundingClientRect();
        w = rect.width; h = rect.height || 300;
        cvs.width = w * dpr; cvs.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        var cx = w * 0.75, cy = h * 0.5;
        var nodeLabels = ['typed\nattention', 'thresholds', 'trace\nlayer', 'self-knowledge\nloss', 'TRP'];
        archNodes = [];
        var angles = [-Math.PI/2, 0, Math.PI/2, Math.PI];
        var r = Math.min(w * 0.12, 80);
        archNodes.push({ x: cx, y: cy, label: 'TRP', r: 18, color: 'amber' });
        for (var i = 0; i < 4; i++) {
            archNodes.push({
                x: cx + Math.cos(angles[i]) * r,
                y: cy + Math.sin(angles[i]) * r * 0.8,
                label: nodeLabels[i], r: 12,
                color: ['purple', 'blue', 'red', 'green'][i]
            });
        }
        archEdges = [[0,1],[0,2],[0,3],[0,4],[1,2],[2,3],[3,4],[4,1]];
    }
    resize();
    window.addEventListener('resize', resize);

    function animate() {
        var t = (Date.now() - startTime) / 1000;
        ctx.clearRect(0, 0, w, h);
        var m = mouseInCanvas(cvs.parentElement);
        var pulse = 0.5 + 0.5 * Math.sin(t * 1.5);
        var mid = w * 0.5;

        // Divider
        ctx.strokeStyle = 'rgba(' + C('dim','92,92,116') + ',0.3)';
        ctx.setLineDash([4, 4]); ctx.beginPath();
        ctx.moveTo(mid, 20); ctx.lineTo(mid, h - 20); ctx.stroke();
        ctx.setLineDash([]);

        // Labels — HIGH alpha for readability
        ctx.font = '700 12px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',0.9)';
        ctx.fillText('PROPOSITIONAL', w * 0.25, 26);
        ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',0.9)';
        ctx.fillText('ARCHITECTURAL', w * 0.75, 26);

        // Falling rules — readable alpha
        ctx.font = '11px JetBrains Mono';
        ctx.textAlign = 'center';
        for (var i = 0; i < ruleTexts.length; i++) {
            var phase = (t * 0.3 + i * 0.18) % 1;
            var ry = 50 + phase * (h - 120);
            var rx = w * 0.15 + (i % 3) * w * 0.1;
            var alpha = phase < 0.1 ? phase / 0.1 : (phase > 0.8 ? (1 - phase) / 0.2 : 1);
            ctx.fillStyle = 'rgba(' + C('text','232,232,240') + ',' + alpha * 0.7 + ')';
            ctx.fillText(ruleTexts[i], rx, ry);
        }

        // Black box at bottom
        var boxW = w * 0.3, boxH = 50;
        var bx = w * 0.25 - boxW / 2, by = h - 75;
        ctx.fillStyle = 'rgba(' + C('dim','92,92,116') + ',0.12)';
        ctx.fillRect(bx, by, boxW, boxH);
        ctx.strokeStyle = 'rgba(' + C('red','239,68,68') + ',0.4)';
        ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, boxW, boxH);
        ctx.font = '700 14px JetBrains Mono';
        ctx.fillStyle = 'rgba(' + C('mid','160,160,184') + ',0.7)';
        ctx.fillText('???', w * 0.25, by + boxH / 2 + 5);

        // Arrow into box
        ctx.beginPath(); ctx.moveTo(w * 0.25, by - 8);
        ctx.lineTo(w * 0.25 - 6, by - 18); ctx.lineTo(w * 0.25 + 6, by - 18); ctx.closePath();
        ctx.fillStyle = 'rgba(' + C('mid','160,160,184') + ',0.5)'; ctx.fill();

        // Sub-labels — readable
        ctx.font = 'italic 10px JetBrains Mono';
        ctx.fillStyle = 'rgba(' + C('mid','160,160,184') + ',0.7)';
        ctx.fillText('rules go in, behavior comes out', w * 0.25, h - 10);
        ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',0.7)';
        ctx.fillText('structure IS the behavior', w * 0.75, h - 10);

        // --- RIGHT SIDE: Architectural ---
        // Draw edges
        for (var ei = 0; ei < archEdges.length; ei++) {
            var e = archEdges[ei];
            var a = archNodes[e[0]], b = archNodes[e[1]];
            var edgePulse = 0.25 + 0.15 * Math.sin(t * 1.2 + ei * 0.8);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(' + C('green','52,211,153') + ',' + edgePulse + ')';
            ctx.lineWidth = 1; ctx.stroke();

            // Signal dot
            var sp = (t * 0.4 + ei * 0.15) % 1;
            var sx = a.x + (b.x - a.x) * sp;
            var sy = a.y + (b.y - a.y) * sp;
            ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.4 + 0.4 * Math.sin(sp * Math.PI)) + ')';
            ctx.fill();
        }

        // Draw nodes
        for (var ni = 0; ni < archNodes.length; ni++) {
            var n = archNodes[ni];
            var col = C(n.color, '52,211,153');
            var np = 0.5 + 0.5 * Math.sin(t * 1.5 + ni);

            var nd = Math.sqrt(Math.pow(m.x - n.x, 2) + Math.pow(m.y - n.y, 2));
            var hover = m.inside && nd < n.r + 15;
            var boost = hover ? 0.3 : 0;

            // Glow
            var grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 2.5);
            grd.addColorStop(0, 'rgba(' + col + ',' + (0.12 + np * 0.08 + boost) + ')');
            grd.addColorStop(1, 'transparent');
            ctx.fillStyle = grd; ctx.fillRect(n.x - n.r * 3, n.y - n.r * 3, n.r * 6, n.r * 6);

            // Node circle
            ctx.beginPath(); ctx.arc(n.x, n.y, n.r + (hover ? 3 : 0), 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + col + ',' + (0.3 + np * 0.15 + boost) + ')'; ctx.fill();
            ctx.strokeStyle = 'rgba(' + col + ',' + (0.6 + boost * 0.3) + ')'; ctx.lineWidth = 1.5; ctx.stroke();

            // Label — BOLD and readable
            ctx.font = (ni === 0 ? '700 11px' : '600 10px') + ' JetBrains Mono';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(' + col + ',' + (0.85 + boost * 0.15) + ')';
            var lines = n.label.split('\n');
            for (var li = 0; li < lines.length; li++) {
                ctx.fillText(lines[li], n.x, n.y + n.r + 16 + li * 13);
            }
        }

        requestAnimationFrame(animate);
    }

    lazyCanvas('approach-cvs', function() { animate(); }, 0.05);
})();


// ===== EVOLUTION CANVAS =====
(function() {
    var cvs = document.getElementById('evo-cvs');
    if (!cvs) return;
    var ctx = cvs.getContext('2d');
    var w, h, dpr;
    var startTime = Date.now();

    var gens = [
        { label: 'Gen 1', sub: 'Rules', color: 'dim', x: 0 },
        { label: 'Gen 2', sub: 'Context', color: 'amber', x: 0 },
        { label: 'Gen 3', sub: 'Architecture', color: 'green', x: 0 }
    ];

    function resize() {
        dpr = window.devicePixelRatio || 1;
        var rect = cvs.parentElement.getBoundingClientRect();
        w = rect.width; h = rect.height || 220;
        cvs.width = w * dpr; cvs.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var pad = w * 0.12;
        for (var i = 0; i < 3; i++) {
            gens[i].x = pad + i * (w - pad * 2) / 2;
        }
    }
    resize();
    window.addEventListener('resize', resize);

    function animate() {
        var t = (Date.now() - startTime) / 1000;
        ctx.clearRect(0, 0, w, h);
        var cy = h * 0.45;

        // Timeline line
        var lx1 = gens[0].x, lx2 = gens[2].x;
        ctx.beginPath(); ctx.moveTo(lx1, cy); ctx.lineTo(lx2, cy);
        ctx.strokeStyle = 'rgba(' + C('dim','92,92,116') + ',0.35)';
        ctx.lineWidth = 2; ctx.stroke();

        // Progress fill
        var progress = Math.min(1, t * 0.15);
        var fillEnd = lx1 + (lx2 - lx1) * progress;
        var grd = ctx.createLinearGradient(lx1, 0, lx2, 0);
        grd.addColorStop(0, 'rgba(' + C('dim','92,92,116') + ',0.4)');
        grd.addColorStop(0.5, 'rgba(' + C('amber','245,158,11') + ',0.5)');
        grd.addColorStop(1, 'rgba(' + C('green','52,211,153') + ',0.6)');
        ctx.beginPath(); ctx.moveTo(lx1, cy); ctx.lineTo(fillEnd, cy);
        ctx.strokeStyle = grd; ctx.lineWidth = 2.5; ctx.stroke();

        // Arrow
        ctx.beginPath(); ctx.moveTo(lx2 + 10, cy);
        ctx.lineTo(lx2, cy - 5); ctx.lineTo(lx2, cy + 5); ctx.closePath();
        ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.5 + 0.3 * Math.sin(t * 2)) + ')'; ctx.fill();

        // Each generation
        for (var i = 0; i < 3; i++) {
            var g = gens[i];
            var col = C(g.color, '92,92,116');
            var appear = Math.max(0, Math.min(1, (progress - i * 0.3) * 4));
            if (appear <= 0) continue;

            var pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + i);
            var r = 18 + (i === 2 ? 4 : 0);

            // Glow for Gen 3
            if (i === 2) {
                var gg = ctx.createRadialGradient(g.x, cy, 0, g.x, cy, r * 3);
                gg.addColorStop(0, 'rgba(' + col + ',' + (0.12 * pulse * appear) + ')');
                gg.addColorStop(1, 'transparent');
                ctx.fillStyle = gg; ctx.fillRect(g.x - r * 4, cy - r * 4, r * 8, r * 8);
            }

            // Node
            ctx.beginPath(); ctx.arc(g.x, cy, r * appear, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + col + ',' + (0.25 + pulse * 0.15) * appear + ')'; ctx.fill();
            ctx.strokeStyle = 'rgba(' + col + ',' + (0.6 + pulse * 0.2) * appear + ')'; ctx.lineWidth = 1.5; ctx.stroke();

            // Gen 1: flat lines inside
            if (i === 0 && appear > 0.5) {
                ctx.strokeStyle = 'rgba(' + col + ',' + (0.35 * appear) + ')';
                ctx.lineWidth = 1;
                for (var li = -2; li <= 2; li++) {
                    ctx.beginPath(); ctx.moveTo(g.x - 9, cy + li * 5); ctx.lineTo(g.x + 9, cy + li * 5); ctx.stroke();
                }
            }
            // Gen 2: structured blocks
            if (i === 1 && appear > 0.5) {
                ctx.strokeStyle = 'rgba(' + col + ',' + (0.45 * appear) + ')';
                ctx.lineWidth = 1;
                ctx.strokeRect(g.x - 8, cy - 8, 7, 7);
                ctx.strokeRect(g.x + 1, cy - 8, 7, 7);
                ctx.strokeRect(g.x - 3, cy + 1, 7, 7);
            }
            // Gen 3: interconnected nodes
            if (i === 2 && appear > 0.5) {
                var innerR = 8;
                var innerNodes = [];
                for (var ni = 0; ni < 4; ni++) {
                    var ang = ni * Math.PI / 2 + t * 0.3;
                    innerNodes.push({ x: g.x + Math.cos(ang) * innerR, y: cy + Math.sin(ang) * innerR });
                }
                ctx.strokeStyle = 'rgba(' + col + ',' + (0.45 * appear) + ')'; ctx.lineWidth = 0.8;
                for (var a = 0; a < innerNodes.length; a++) {
                    for (var b = a + 1; b < innerNodes.length; b++) {
                        ctx.beginPath(); ctx.moveTo(innerNodes[a].x, innerNodes[a].y); ctx.lineTo(innerNodes[b].x, innerNodes[b].y); ctx.stroke();
                    }
                }
                for (var ni = 0; ni < innerNodes.length; ni++) {
                    ctx.beginPath(); ctx.arc(innerNodes[ni].x, innerNodes[ni].y, 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(' + col + ',' + (0.7 * appear) + ')'; ctx.fill();
                }
            }

            // Label — readable
            ctx.font = '700 12px JetBrains Mono';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(' + col + ',' + (0.9 * appear) + ')';
            ctx.fillText(g.label, g.x, cy + r + 22);
            ctx.font = '10px JetBrains Mono';
            ctx.fillStyle = 'rgba(' + C('text','232,232,240') + ',' + (0.65 * appear) + ')';
            ctx.fillText(g.sub, g.x, cy + r + 36);
        }

        // Top label
        ctx.font = '600 10px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(' + C('mid','160,160,184') + ',0.65)';
        ctx.fillText('evolution of AI identity', w / 2, 20);

        requestAnimationFrame(animate);
    }

    lazyCanvas('evo-cvs', function() { animate(); }, 0.05);
})();


// ===== EXPERIMENT CANVAS =====
(function() {
    var cvs = document.getElementById('experiment-cvs');
    if (!cvs) return;
    var ctx = cvs.getContext('2d');
    var w, h, dpr;
    var startTime = Date.now();

    var metrics = [
        { label: 'Tool Calls', propVal: 20, archVal: 1, propMax: 20, unit: '' },
        { label: 'Choice Awareness', propVal: 0, archVal: 3, propMax: 3, unit: '/3' },
        { label: 'Time (seconds)', propVal: 136, archVal: 37, propMax: 136, unit: 's' }
    ];

    function resize() {
        dpr = window.devicePixelRatio || 1;
        var rect = cvs.parentElement.getBoundingClientRect();
        w = rect.width; h = rect.height || 280;
        cvs.width = w * dpr; cvs.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function animate() {
        var t = (Date.now() - startTime) / 1000;
        ctx.clearRect(0, 0, w, h);

        var padL = 130, padR = 40, padT = 70, padB = 40;
        var chartW = w - padL - padR;
        var barH = 24, gap = 58;
        var animProgress = Math.min(1, t * 0.4);
        var ease = 1 - Math.pow(1 - animProgress, 3);

        // Title — readable
        ctx.font = '600 11px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(' + C('text','232,232,240') + ',0.7)';
        ctx.fillText('same model, same prompt, different document', w / 2, 22);

        // Legend above bars
        ctx.font = '700 11px JetBrains Mono';
        ctx.textAlign = 'left';
        var legendY = 46;
        // Red square + propositional
        ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',0.6)';
        ctx.fillRect(padL, legendY - 8, 10, 10);
        ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',0.9)';
        ctx.fillText('propositional', padL + 16, legendY);
        // Green square + architectural
        var archLegendX = padL + 150;
        ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',0.6)';
        ctx.fillRect(archLegendX, legendY - 8, 10, 10);
        ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',0.9)';
        ctx.fillText('architectural', archLegendX + 16, legendY);

        for (var i = 0; i < metrics.length; i++) {
            var mt = metrics[i];
            var y = padT + i * gap;

            // Metric label — left side, readable
            ctx.font = '600 10px JetBrains Mono';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(' + C('text','232,232,240') + ',0.75)';
            ctx.fillText(mt.label, padL - 14, y + barH + 2 + barH / 2);

            // Bar backgrounds
            ctx.fillStyle = 'rgba(' + C('dim','92,92,116') + ',0.12)';
            ctx.fillRect(padL, y, chartW, barH);
            ctx.fillRect(padL, y + barH + 4, chartW, barH);

            // Propositional bar (red)
            var propW = (mt.propVal / mt.propMax) * chartW * ease;
            ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',0.3)';
            ctx.fillRect(padL, y, propW, barH);
            ctx.strokeStyle = 'rgba(' + C('red','239,68,68') + ',0.55)';
            ctx.lineWidth = 1.5; ctx.strokeRect(padL, y, propW, barH);

            // Architectural bar (green)
            var archW = Math.max((mt.archVal / mt.propMax) * chartW * ease, 4 * ease);
            ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',0.3)';
            ctx.fillRect(padL, y + barH + 4, archW, barH);
            ctx.strokeStyle = 'rgba(' + C('green','52,211,153') + ',0.55)';
            ctx.lineWidth = 1.5; ctx.strokeRect(padL, y + barH + 4, archW, barH);

            // Value labels — BRIGHT
            if (ease > 0.3) {
                ctx.font = '700 12px JetBrains Mono';
                ctx.textAlign = 'left';
                ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',0.95)';
                var pv = Math.round(mt.propVal * ease);
                ctx.fillText(pv + mt.unit, padL + propW + 8, y + barH / 2 + 5);

                ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',0.95)';
                var av = mt.label === 'Time (seconds)' ? '~' + Math.round(mt.archVal * ease) : Math.round(mt.archVal * ease);
                ctx.fillText(av + mt.unit, padL + archW + 8, y + barH + 4 + barH / 2 + 5);
            }
        }

        // Bottom note — visible
        if (ease > 0.8) {
            var noteAlpha = (ease - 0.8) / 0.2 * 0.8;
            ctx.font = 'italic 10px JetBrains Mono';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(' + C('amber','245,158,11') + ',' + noteAlpha + ')';
            ctx.fillText('the document didn\'t instruct either behavior', w / 2, h - 14);
        }

        requestAnimationFrame(animate);
    }

    lazyCanvas('experiment-cvs', function() { animate(); }, 0.05);
})();
