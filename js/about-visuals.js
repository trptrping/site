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

    // Propositional side: rules that float down into a black box
    var rules = [];
    var ruleTexts = ['be transparent', 'cite sources', 'admit uncertainty', 'follow protocol', 'stay consistent', 'check facts'];

    // Architectural side: nodes that form structure
    var archNodes = [];
    var archEdges = [];

    function resize() {
        dpr = window.devicePixelRatio || 1;
        var rect = cvs.parentElement.getBoundingClientRect();
        w = rect.width; h = 300;
        cvs.width = w * dpr; cvs.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Init arch nodes in a structured layout
        var cx = w * 0.75, cy = h * 0.5;
        var nodeLabels = ['typed\nattention', 'thresholds', 'trace\nlayer', 'self-knowledge\nloss', 'TRP'];
        archNodes = [];
        var angles = [-Math.PI/2, 0, Math.PI/2, Math.PI];
        var r = Math.min(w * 0.12, 80);
        // Center node
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

        // --- LEFT SIDE: Propositional ---
        // Divider
        ctx.strokeStyle = 'rgba(' + C('dim','92,92,116') + ',0.2)';
        ctx.setLineDash([4, 4]); ctx.beginPath();
        ctx.moveTo(mid, 20); ctx.lineTo(mid, h - 20); ctx.stroke();
        ctx.setLineDash([]);

        // Labels
        ctx.font = '600 11px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',0.6)';
        ctx.fillText('PROPOSITIONAL', w * 0.25, 24);
        ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',0.6)';
        ctx.fillText('ARCHITECTURAL', w * 0.75, 24);

        // Falling rules
        ctx.font = '10px JetBrains Mono';
        ctx.textAlign = 'center';
        for (var i = 0; i < ruleTexts.length; i++) {
            var phase = (t * 0.3 + i * 0.18) % 1;
            var ry = 45 + phase * (h - 110);
            var rx = w * 0.15 + (i % 3) * w * 0.1;
            var alpha = phase < 0.1 ? phase / 0.1 : (phase > 0.8 ? (1 - phase) / 0.2 : 0.5);
            ctx.fillStyle = 'rgba(' + C('mid','160,160,184') + ',' + alpha * 0.7 + ')';
            ctx.fillText(ruleTexts[i], rx, ry);
        }

        // Black box at bottom
        var boxW = w * 0.3, boxH = 50;
        var bx = w * 0.25 - boxW / 2, by = h - 70;
        ctx.fillStyle = 'rgba(' + C('dim','92,92,116') + ',0.08)';
        ctx.fillRect(bx, by, boxW, boxH);
        ctx.strokeStyle = 'rgba(' + C('red','239,68,68') + ',0.25)';
        ctx.lineWidth = 1; ctx.strokeRect(bx, by, boxW, boxH);
        ctx.font = '700 11px JetBrains Mono';
        ctx.fillStyle = 'rgba(' + C('dim','92,92,116') + ',0.4)';
        ctx.fillText('???', w * 0.25, by + boxH / 2 + 4);

        // Arrow into box
        ctx.beginPath(); ctx.moveTo(w * 0.25, by - 8);
        ctx.lineTo(w * 0.25 - 5, by - 16); ctx.lineTo(w * 0.25 + 5, by - 16); ctx.closePath();
        ctx.fillStyle = 'rgba(' + C('dim','92,92,116') + ',0.3)'; ctx.fill();

        // Sub-label
        ctx.font = 'italic 9px JetBrains Mono';
        ctx.fillStyle = 'rgba(' + C('dim','92,92,116') + ',0.4)';
        ctx.fillText('rules go in, behavior comes out', w * 0.25, h - 10);
        ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',0.4)';
        ctx.fillText('structure IS the behavior', w * 0.75, h - 10);

        // --- RIGHT SIDE: Architectural ---
        // Draw edges
        for (var ei = 0; ei < archEdges.length; ei++) {
            var e = archEdges[ei];
            var a = archNodes[e[0]], b = archNodes[e[1]];
            var edgePulse = 0.15 + 0.1 * Math.sin(t * 1.2 + ei * 0.8);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(' + C('green','52,211,153') + ',' + edgePulse + ')';
            ctx.lineWidth = 0.8; ctx.stroke();

            // Signal dot traveling along edge
            var sp = (t * 0.4 + ei * 0.15) % 1;
            var sx = a.x + (b.x - a.x) * sp;
            var sy = a.y + (b.y - a.y) * sp;
            ctx.beginPath(); ctx.arc(sx, sy, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.3 + 0.3 * Math.sin(sp * Math.PI)) + ')';
            ctx.fill();
        }

        // Draw nodes
        for (var ni = 0; ni < archNodes.length; ni++) {
            var n = archNodes[ni];
            var col = C(n.color, '52,211,153');
            var np = 0.5 + 0.5 * Math.sin(t * 1.5 + ni);

            // Check hover
            var nd = Math.sqrt(Math.pow(m.x - n.x, 2) + Math.pow(m.y - n.y, 2));
            var hover = m.inside && nd < n.r + 15;
            var boost = hover ? 0.3 : 0;

            // Glow
            var grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 2.5);
            grd.addColorStop(0, 'rgba(' + col + ',' + (0.08 + np * 0.06 + boost) + ')');
            grd.addColorStop(1, 'transparent');
            ctx.fillStyle = grd; ctx.fillRect(n.x - n.r * 3, n.y - n.r * 3, n.r * 6, n.r * 6);

            // Node
            ctx.beginPath(); ctx.arc(n.x, n.y, n.r + (hover ? 3 : 0), 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + col + ',' + (0.2 + np * 0.15 + boost) + ')'; ctx.fill();
            ctx.strokeStyle = 'rgba(' + col + ',' + (0.4 + boost * 0.3) + ')'; ctx.lineWidth = 1; ctx.stroke();

            // Label
            ctx.font = (ni === 0 ? '700 10px' : '9px') + ' JetBrains Mono';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(' + col + ',' + (0.55 + boost * 0.3) + ')';
            var lines = n.label.split('\n');
            for (var li = 0; li < lines.length; li++) {
                ctx.fillText(lines[li], n.x, n.y + n.r + 14 + li * 12);
            }
        }

        requestAnimationFrame(animate);
    }

    lazyCanvas('approach-cvs', function() { animate(); }, 0.05);
})();


// ===== EVOLUTION CANVAS =====
// Timeline showing Gen 1 → Gen 2 → Gen 3 with visual transformation
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
        w = rect.width; h = 220;
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
        ctx.strokeStyle = 'rgba(' + C('dim','92,92,116') + ',0.25)';
        ctx.lineWidth = 2; ctx.stroke();

        // Progress fill
        var progress = Math.min(1, t * 0.15);
        var fillEnd = lx1 + (lx2 - lx1) * progress;
        var grd = ctx.createLinearGradient(lx1, 0, lx2, 0);
        grd.addColorStop(0, 'rgba(' + C('dim','92,92,116') + ',0.3)');
        grd.addColorStop(0.5, 'rgba(' + C('amber','245,158,11') + ',0.3)');
        grd.addColorStop(1, 'rgba(' + C('green','52,211,153') + ',0.4)');
        ctx.beginPath(); ctx.moveTo(lx1, cy); ctx.lineTo(fillEnd, cy);
        ctx.strokeStyle = grd; ctx.lineWidth = 2; ctx.stroke();

        // Arrow
        ctx.beginPath(); ctx.moveTo(lx2 + 8, cy);
        ctx.lineTo(lx2, cy - 4); ctx.lineTo(lx2, cy + 4); ctx.closePath();
        ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.3 + 0.2 * Math.sin(t * 2)) + ')'; ctx.fill();

        // Each generation
        for (var i = 0; i < 3; i++) {
            var g = gens[i];
            var col = C(g.color, '92,92,116');
            var appear = Math.max(0, Math.min(1, (progress - i * 0.3) * 4));
            if (appear <= 0) continue;

            var pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + i);
            var r = 16 + (i === 2 ? 4 : 0);

            // Glow
            if (i === 2) {
                var gg = ctx.createRadialGradient(g.x, cy, 0, g.x, cy, r * 3);
                gg.addColorStop(0, 'rgba(' + col + ',' + (0.08 * pulse * appear) + ')');
                gg.addColorStop(1, 'transparent');
                ctx.fillStyle = gg; ctx.fillRect(g.x - r * 4, cy - r * 4, r * 8, r * 8);
            }

            // Node
            ctx.beginPath(); ctx.arc(g.x, cy, r * appear, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + col + ',' + (0.15 + pulse * 0.1) * appear + ')'; ctx.fill();
            ctx.strokeStyle = 'rgba(' + col + ',' + (0.4 + pulse * 0.2) * appear + ')'; ctx.lineWidth = 1.5; ctx.stroke();

            // Gen 1: show flat lines inside (rules)
            if (i === 0 && appear > 0.5) {
                ctx.strokeStyle = 'rgba(' + col + ',' + (0.2 * appear) + ')';
                ctx.lineWidth = 0.8;
                for (var li = -2; li <= 2; li++) {
                    ctx.beginPath(); ctx.moveTo(g.x - 8, cy + li * 4); ctx.lineTo(g.x + 8, cy + li * 4); ctx.stroke();
                }
            }
            // Gen 2: show structured blocks (context windows)
            if (i === 1 && appear > 0.5) {
                ctx.strokeStyle = 'rgba(' + col + ',' + (0.25 * appear) + ')';
                ctx.lineWidth = 0.8;
                ctx.strokeRect(g.x - 7, cy - 7, 6, 6);
                ctx.strokeRect(g.x + 1, cy - 7, 6, 6);
                ctx.strokeRect(g.x - 3, cy + 1, 6, 6);
            }
            // Gen 3: show interconnected nodes
            if (i === 2 && appear > 0.5) {
                var innerR = 7;
                var innerNodes = [];
                for (var ni = 0; ni < 4; ni++) {
                    var ang = ni * Math.PI / 2 + t * 0.3;
                    innerNodes.push({ x: g.x + Math.cos(ang) * innerR, y: cy + Math.sin(ang) * innerR });
                }
                ctx.strokeStyle = 'rgba(' + col + ',' + (0.3 * appear) + ')'; ctx.lineWidth = 0.6;
                for (var a = 0; a < innerNodes.length; a++) {
                    for (var b = a + 1; b < innerNodes.length; b++) {
                        ctx.beginPath(); ctx.moveTo(innerNodes[a].x, innerNodes[a].y); ctx.lineTo(innerNodes[b].x, innerNodes[b].y); ctx.stroke();
                    }
                }
                for (var ni = 0; ni < innerNodes.length; ni++) {
                    ctx.beginPath(); ctx.arc(innerNodes[ni].x, innerNodes[ni].y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(' + col + ',' + (0.5 * appear) + ')'; ctx.fill();
                }
            }

            // Label
            ctx.font = '700 11px JetBrains Mono';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(' + col + ',' + (0.7 * appear) + ')';
            ctx.fillText(g.label, g.x, cy + r + 20);
            ctx.font = '9px JetBrains Mono';
            ctx.fillStyle = 'rgba(' + C('mid','160,160,184') + ',' + (0.5 * appear) + ')';
            ctx.fillText(g.sub, g.x, cy + r + 33);
        }

        // Top label
        ctx.font = 'italic 9px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(' + C('mid','160,160,184') + ',0.4)';
        ctx.fillText('evolution of AI identity', w / 2, 20);

        requestAnimationFrame(animate);
    }

    lazyCanvas('evo-cvs', function() { animate(); }, 0.05);
})();


// ===== EXPERIMENT CANVAS =====
// Animated bar chart comparing propositional vs architectural results
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
        w = rect.width; h = 280;
        cvs.width = w * dpr; cvs.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function animate() {
        var t = (Date.now() - startTime) / 1000;
        ctx.clearRect(0, 0, w, h);

        var padL = 120, padR = 40, padT = 50, padB = 40;
        var chartW = w - padL - padR;
        var barH = 22, gap = 55;
        var animProgress = Math.min(1, t * 0.4);
        var ease = 1 - Math.pow(1 - animProgress, 3); // ease-out cubic

        // Title
        ctx.font = '600 10px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(' + C('mid','160,160,184') + ',0.5)';
        ctx.fillText('same model, same prompt, different document', w / 2, 22);

        // Column headers
        ctx.font = '700 10px JetBrains Mono';
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',0.6)';
        ctx.fillText('propositional', padL, padT - 8);
        ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',0.6)';
        ctx.fillText('architectural', padL, padT + barH + 16);

        for (var i = 0; i < metrics.length; i++) {
            var m = metrics[i];
            var y = padT + i * gap;

            // Metric label
            ctx.font = '10px JetBrains Mono';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(' + C('mid','160,160,184') + ',0.6)';
            ctx.fillText(m.label, padL - 12, y + barH / 2 + 13);

            // Bar backgrounds
            ctx.fillStyle = 'rgba(' + C('dim','92,92,116') + ',0.08)';
            ctx.fillRect(padL, y, chartW, barH);
            ctx.fillRect(padL, y + barH + 4, chartW, barH);

            // Propositional bar (red)
            var propW = (m.propVal / m.propMax) * chartW * ease;
            ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',0.25)';
            ctx.fillRect(padL, y, propW, barH);
            ctx.strokeStyle = 'rgba(' + C('red','239,68,68') + ',0.4)';
            ctx.lineWidth = 1; ctx.strokeRect(padL, y, propW, barH);

            // Architectural bar (green)
            var archW = (m.archVal / m.propMax) * chartW * ease;
            ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',0.25)';
            ctx.fillRect(padL, y + barH + 4, archW, barH);
            ctx.strokeStyle = 'rgba(' + C('green','52,211,153') + ',0.4)';
            ctx.lineWidth = 1; ctx.strokeRect(padL, y + barH + 4, archW, barH);

            // Value labels
            if (ease > 0.3) {
                ctx.font = '700 10px JetBrains Mono';
                ctx.textAlign = 'left';
                ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',0.7)';
                var pv = Math.round(m.propVal * ease);
                ctx.fillText(pv + m.unit, padL + propW + 6, y + barH / 2 + 4);

                ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',0.7)';
                var av = (m.label === 'Choice Awareness') ? Math.round(m.archVal * ease) : (m.label === 'Time (seconds)' ? '~' + Math.round(m.archVal * ease) : Math.round(m.archVal * ease));
                ctx.fillText(av + m.unit, padL + archW + 6, y + barH + 4 + barH / 2 + 4);
            }
        }

        // Bottom note
        if (ease > 0.8) {
            var noteAlpha = (ease - 0.8) / 0.2 * 0.5;
            ctx.font = 'italic 9px JetBrains Mono';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(' + C('amber','245,158,11') + ',' + noteAlpha + ')';
            ctx.fillText('the document didn\'t instruct either behavior', w / 2, h - 14);
        }

        requestAnimationFrame(animate);
    }

    lazyCanvas('experiment-cvs', function() { animate(); }, 0.05);
})();
