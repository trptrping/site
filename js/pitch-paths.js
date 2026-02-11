/* TRP Site — Pitch: Four Path Canvases
   Hybrid: tree structure (truth) + node dots with halos (soul).
   Path 1 gets full treatment. Paths 2-4 get breathing + enhanced halos. */

(function() {
var PH = 420;
var FONT = '11px JetBrains Mono';

// PATH 1: Typed Attention — directory tree with typed colored edges + hybrid nodes
function drawPath1() {
    var cvs = document.getElementById('path-cvs-1');
    if (!cvs) return;
    var wrap = cvs.parentElement;
    var ctx = cvs.getContext('2d');
    var rect = wrap.getBoundingClientRect();
    cvs.width = rect.width * 2; cvs.height = PH * 2;
    ctx.scale(2, 2);
    var w = rect.width, h = PH;

    var LINE_H = 34;
    var A = (window.SITE && window.SITE.active) || {};
    var files = A['path1.files'] || ['auth.py','stripe.py','profile.py','token.py','config.py','db.py','api.py','cache.py','queue.py','logger.py','metrics.py'];
    var dirLabel = A['path1.dir'] || 'app/';
    var treeX = 36;
    var treeTopY = 28;
    var nodeX = treeX - 14;
    var fileY = [], lastY = 0;
    function recompLayout() {
        fileY = [];
        for (var i = 0; i < files.length; i++) fileY[i] = treeTopY + (i + 1) * LINE_H;
        lastY = fileY[files.length - 1] || treeTopY + LINE_H;
    }
    recompLayout();

    function pfx(i) { return i < files.length - 1 ? '\u251C\u2500\u2500 ' : '\u2514\u2500\u2500 '; }

    // Edge type → color mapping (by position in type list)
    var edgeColorPalette = ['239,68,68', '96,165,250', '245,158,11', '52,211,153', '160,160,200'];
    var rawEdges = A['path1.edges'] || [
        { from: 0, to: 2, type: 'REQUIRES' }, { from: 0, to: 3, type: 'USES' },
        { from: 1, to: 4, type: 'USES' }, { from: 2, to: 5, type: 'REQUIRES' },
        { from: 3, to: 1, type: 'CONTRADICTS' }, { from: 5, to: 6, type: 'CREATES' },
        { from: 6, to: 7, type: 'USES' }, { from: 4, to: 7, type: 'REQUIRES' },
        { from: 1, to: 6, type: 'CREATES' }, { from: 6, to: 8, type: 'USES' },
        { from: 7, to: 8, type: 'REQUIRES' }, { from: 9, to: 4, type: 'USES' },
        { from: 9, to: 10, type: 'CREATES' }, { from: 8, to: 10, type: 'USES' },
        { from: 5, to: 9, type: 'CONTRADICTS' }
    ];
    // Build type→color map from encountered types
    var typeColorMap = {}, typeIdx = 0;
    function buildEdges() {
        typeColorMap = {}; typeIdx = 0;
        edges = [];
        for (var i = 0; i < rawEdges.length; i++) {
            var re = rawEdges[i];
            if (!(re.type in typeColorMap)) { typeColorMap[re.type] = edgeColorPalette[typeIdx % edgeColorPalette.length]; typeIdx++; }
            edges.push({ from: re.from, to: re.to, type: re.type, color: typeColorMap[re.type] });
        }
    }
    var edges = [];
    buildEdges();

    // Listen for mode changes
    window.addEventListener('site-mode-change', function() {
        var B = (window.SITE && window.SITE.active) || {};
        files = B['path1.files'] || files;
        dirLabel = B['path1.dir'] || dirLabel;
        rawEdges = B['path1.edges'] || rawEdges;
        recompLayout();
        buildEdges();
        // Recompute label widths
        ctx.font = FONT;
        labelWidths = [];
        for (var i = 0; i < files.length; i++) labelWidths[i] = ctx.measureText(pfx(0) + files[i]).width;
        maxLabelW = 0;
        for (var i = 0; i < labelWidths.length; i++) { if (labelWidths[i] > maxLabelW) maxLabelW = labelWidths[i]; }
        arcBaseX = treeX + maxLabelW + 24;
        arcSpacing = Math.min(18, (w - arcBaseX - 20) / (edges.length + 1));
    });

    // Measure label widths
    ctx.font = FONT;
    var labelWidths = [];
    for (var i = 0; i < files.length; i++) labelWidths[i] = ctx.measureText(pfx(0) + files[i]).width;
    var maxLabelW = 0;
    for (var i = 0; i < labelWidths.length; i++) { if (labelWidths[i] > maxLabelW) maxLabelW = labelWidths[i]; }
    var arcBaseX = treeX + maxLabelW + 24;
    var arcSpacing = Math.min(18, (w - arcBaseX - 20) / (edges.length + 1));

    // Signal particles along trunk
    var signals = [];
    for (var s = 0; s < 14; s++) {
        signals.push({ progress: Math.random(), speed: 0.003 + Math.random() * 0.004, size: 1 + Math.random() * 1.2, phase: Math.random() * Math.PI * 2 });
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        var t = performance.now() / 1000;
        var m = mouseInCanvas(wrap);

        // Determine hovered file
        var hoveredFile = -1;
        if (m.inside) {
            for (var i = 0; i < files.length; i++) {
                var dy = Math.abs(m.y - fileY[i]), dx = m.x - treeX;
                if (dy < LINE_H * 0.45 && dx > -20 && dx < maxLabelW + 40) { hoveredFile = i; break; }
            }
        }
        var connectedFiles = {}, connectedEdges = {};
        if (hoveredFile >= 0) {
            connectedFiles[hoveredFile] = true;
            for (var ei = 0; ei < edges.length; ei++) {
                if (edges[ei].from === hoveredFile || edges[ei].to === hoveredFile) {
                    connectedFiles[edges[ei].from] = true;
                    connectedFiles[edges[ei].to] = true;
                    connectedEdges[ei] = true;
                }
            }
        }

        // ---- Hub node ----
        var hp = 0.7 + 0.3 * Math.sin(t * 1.2);
        var hr = 5 + hp * 1.5;
        var hg = ctx.createRadialGradient(nodeX, treeTopY, 0, nodeX, treeTopY, hr * 4);
        hg.addColorStop(0, 'rgba(167,139,250,' + (0.18 * hp) + ')'); hg.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(nodeX, treeTopY, hr * 4, 0, Math.PI * 2); ctx.fillStyle = hg; ctx.fill();
        ctx.beginPath(); ctx.arc(nodeX, treeTopY, hr, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167,139,250,' + (0.5 + hp * 0.35) + ')'; ctx.fill();

        // Header
        ctx.font = 'bold ' + FONT; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(167,139,250,' + (0.75 + 0.1 * Math.sin(t * 1.5)) + ')';
        ctx.fillText(dirLabel, treeX, treeTopY);

        // ---- Trunk ----
        ctx.beginPath(); ctx.moveTo(nodeX, treeTopY + 8); ctx.lineTo(nodeX, lastY);
        ctx.strokeStyle = 'rgba(167,139,250,' + (0.1 + 0.05 * Math.sin(t * 1.2)) + ')'; ctx.lineWidth = 0.8; ctx.stroke();

        // ---- Signal particles ----
        for (var si = 0; si < signals.length; si++) {
            var sig = signals[si]; sig.progress += sig.speed;
            if (sig.progress > 1) sig.progress -= 1;
            var sigY = (treeTopY + 8) + sig.progress * (lastY - treeTopY - 8);
            var sp = 0.5 + 0.5 * Math.sin(t * 5 + sig.phase);
            ctx.beginPath(); ctx.arc(nodeX, sigY, sig.size * sp, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(167,139,250,' + (0.12 + sp * 0.15) + ')'; ctx.fill();
        }

        // ---- Edges ----
        ctx.font = FONT;
        for (var ei = 0; ei < edges.length; ei++) {
            var e = edges[ei];
            var srcY = fileY[e.from] + Math.cos(t * 0.4 + e.from * 0.9) * 0.8;
            var dstY = fileY[e.to] + Math.cos(t * 0.4 + e.to * 0.9) * 0.8;
            var startX = treeX + labelWidths[e.from] + 8;
            var endX = treeX + labelWidths[e.to] + 8;
            var arcX = arcBaseX + (ei % edges.length) * arcSpacing;

            var pulse = 0.5 + 0.5 * Math.sin(t * 2 + ei * 0.7);
            var isConn = !!connectedEdges[ei];
            var baseAlpha = isConn ? 0.6 : (hoveredFile >= 0 ? 0.12 : 0.35);
            var alpha = baseAlpha + pulse * (isConn ? 0.25 : 0.1);
            var lineW = isConn ? 2.0 + pulse * 0.8 : 1.0 + pulse * 0.4;

            ctx.beginPath(); ctx.moveTo(startX, srcY);
            ctx.bezierCurveTo(arcX, srcY, arcX, dstY, endX, dstY);
            ctx.strokeStyle = 'rgba(' + e.color + ',' + alpha + ')'; ctx.lineWidth = lineW; ctx.stroke();

            // Travelling dot with mini halo
            var ep = (t * 0.4 + ei * 0.25) % 1, omt = 1 - ep;
            var fpx = omt*omt*omt*startX + 3*omt*omt*ep*arcX + 3*omt*ep*ep*arcX + ep*ep*ep*endX;
            var fpy = omt*omt*omt*srcY + 3*omt*omt*ep*srcY + 3*omt*ep*ep*dstY + ep*ep*ep*dstY;
            var dg = ctx.createRadialGradient(fpx, fpy, 0, fpx, fpy, 8);
            dg.addColorStop(0, 'rgba(' + e.color + ',' + (0.12 * pulse) + ')'); dg.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(fpx, fpy, 8, 0, Math.PI * 2); ctx.fillStyle = dg; ctx.fill();
            ctx.beginPath(); ctx.arc(fpx, fpy, isConn ? 2.5 : 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + e.color + ',' + (0.4 + pulse * 0.4) + ')'; ctx.fill();

            // Type label at arc midpoint
            var lt = 0.5, lt1 = 0.5;
            var lx = lt1*lt1*lt1*startX + 3*lt1*lt1*lt*arcX + 3*lt1*lt*lt*arcX + lt*lt*lt*endX;
            var ly = lt1*lt1*lt1*srcY + 3*lt1*lt1*lt*srcY + 3*lt1*lt*lt*dstY + lt*lt*lt*dstY;
            ctx.font = '8px JetBrains Mono'; ctx.textAlign = 'left';
            ctx.fillStyle = 'rgba(' + e.color + ',' + ((isConn ? 0.7 : 0.35) + pulse * 0.2) + ')';
            ctx.fillText(e.type, lx + 4, ly - 4);
        }

        // ---- File entries with node dots + halos ----
        ctx.font = FONT;
        for (var i = 0; i < files.length; i++) {
            var fy = fileY[i];
            var isHovered = hoveredFile === i;
            var isConn = !!connectedFiles[i];
            var boostLevel = isHovered ? 1.0 : (isConn ? 0.5 : 0);
            var breathe = Math.sin(t * 1.5 + i * 0.6);
            var dX = Math.sin(t * 0.5 + i * 0.8) * 1.2;
            var dY = Math.cos(t * 0.4 + i * 0.9) * 0.8;
            var nX = nodeX + dX, nY = fy + dY;

            // Cursor pull
            var boost = 0;
            if (m.inside) {
                var mdx = m.x - nX, mdy = m.y - nY, md = Math.sqrt(mdx * mdx + mdy * mdy);
                if (md < 100 && md > 1) { boost = 1 - md / 100; nX += mdx * boost * 0.1; nY += mdy * boost * 0.1; }
            }

            // Node dot with halo
            var np = 0.7 + 0.3 * breathe;
            var nr = 3.5 + np + boost * 3 + boostLevel * 1.5;
            var gr = nr * 3.5;
            var grd = ctx.createRadialGradient(nX, nY, 0, nX, nY, gr);
            grd.addColorStop(0, 'rgba(167,139,250,' + ((0.1 + boost * 0.15 + boostLevel * 0.08) * np) + ')');
            grd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(nX, nY, gr, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
            ctx.beginPath(); ctx.arc(nX, nY, nr, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(167,139,250,' + (0.35 + np * 0.3 + boost * 0.2 + boostLevel * 0.1) + ')'; ctx.fill();

            // Hover bar
            if (boostLevel > 0) {
                ctx.fillStyle = 'rgba(167,139,250,' + (boostLevel * 0.06 * np) + ')';
                ctx.beginPath(); ctx.roundRect(treeX - 4, fy - LINE_H * 0.4, maxLabelW + 16, LINE_H * 0.8, 3); ctx.fill();
            }

            // Connector trunk→node
            ctx.beginPath(); ctx.moveTo(nodeX, fy); ctx.lineTo(nX - nr - 1, nY);
            ctx.strokeStyle = 'rgba(167,139,250,' + (0.12 + boost * 0.1 + boostLevel * 0.06) + ')'; ctx.lineWidth = 0.6; ctx.stroke();

            // Prefix
            ctx.textAlign = 'left';
            ctx.fillStyle = 'rgba(92,92,116,' + (0.3 + boostLevel * 0.3) + ')';
            ctx.fillText(pfx(i), treeX, fy);

            // Filename
            var nameAlpha = 0.55 + boostLevel * 0.35 + np * 0.1;
            ctx.fillStyle = 'rgba(232,232,240,' + nameAlpha + ')';
            ctx.fillText(files[i], treeX + ctx.measureText(pfx(i)).width, fy);
        }

        // "try hovering" hint — fades when you interact
        if (hoveredFile < 0) {
            var hintA = 0.25 + 0.1 * Math.sin(t * 2);
            ctx.font = 'italic 9px JetBrains Mono';
            ctx.textAlign = 'left';
            ctx.fillStyle = 'rgba(160,160,200,' + hintA + ')';
            ctx.fillText('try hovering \u2191', treeX, lastY + LINE_H * 1.2);
            ctx.font = FONT;
        }

        requestAnimationFrame(animate);
    }
    animate();
}

// PATH 2: Threshold — grid with sweeping threshold line + breathing nodes
function drawPath2() {
    var cvs = document.getElementById('path-cvs-2');
    if (!cvs) return;
    var wrap = cvs.parentElement;
    var ctx = cvs.getContext('2d');
    var rect = wrap.getBoundingClientRect();
    cvs.width = rect.width * 2; cvs.height = PH * 2;
    ctx.scale(2, 2);
    var w = rect.width, h = PH;
    var cols = 16, rows = 10, cells = [];
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            cells.push({ col: c, row: r, strength: Math.random(), phase: Math.random() * Math.PI * 2 });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        var t = performance.now() / 1000;
        var m = mouseInCanvas(wrap);
        var padX = w * 0.06, padY = h * 0.08;
        var spX = (w - padX * 2) / (cols - 1), spY = (h - padY * 2) / (rows - 1);
        var threshold = 0.35 + 0.3 * Math.sin(t * 0.3);
        var threshY = padY + (1 - threshold) * (h - padY * 2);

        // Threshold line
        ctx.beginPath(); ctx.moveTo(padX - 20, threshY); ctx.lineTo(w - padX + 20, threshY);
        ctx.strokeStyle = 'rgba(96,165,250,0.5)'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
        ctx.font = 'bold 11px JetBrains Mono'; ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(96,165,250,0.7)'; ctx.fillText('threshold = ' + threshold.toFixed(2), padX - 8, threshY - 6);
        ctx.font = '9px JetBrains Mono'; ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(52,211,153,0.4)'; ctx.fillText('fires \u2191', w - padX + 8, threshY - 12);
        ctx.fillStyle = 'rgba(92,92,116,0.3)'; ctx.fillText('silent \u2193', w - padX + 8, threshY + 16);

        var firingCount = 0;
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            var cx = padX + cell.col * spX, cy = padY + cell.row * spY;
            var pulse = 0.6 + 0.4 * Math.sin(t * 2 + cell.phase);
            var fires = cell.strength >= threshold;
            if (fires) firingCount++;
            var breatheX = Math.sin(t * 0.4 + i * 0.5) * (fires ? 1.5 : 0.3);
            var breatheY = Math.cos(t * 0.35 + i * 0.7) * (fires ? 1.0 : 0.2);
            cx += breatheX; cy += breatheY;
            var boost = 0;
            if (m.inside) {
                var dx = m.x - cx, dy = m.y - cy, dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 60) { boost = 1 - dist / 60; cx += dx * boost * 0.08; cy += dy * boost * 0.08; }
            }
            if (fires) {
                var excess = (cell.strength - threshold) / (1 - threshold + 0.01);
                var r = 3.5 + excess * 3 + pulse * 2 + boost * 4;
                var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3);
                grd.addColorStop(0, 'rgba(52,211,153,' + ((0.2 + excess * 0.15 + boost * 0.2) * pulse) + ')'); grd.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(cx, cy, r * 3, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
                ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(52,211,153,' + (0.4 + excess * 0.3 + pulse * 0.2 + boost * 0.15) + ')'; ctx.fill();
                // Connections to nearby firing cells
                for (var j = 0; j < cells.length; j++) {
                    if (j === i || cells[j].strength < threshold) continue;
                    var ox = padX + cells[j].col * spX, oy = padY + cells[j].row * spY;
                    var d = Math.sqrt((ox - cx) * (ox - cx) + (oy - cy) * (oy - cy));
                    if (d < spX * 2.5) {
                        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ox, oy);
                        ctx.strokeStyle = 'rgba(52,211,153,' + ((1 - d / (spX * 2.5)) * 0.2 * pulse) + ')'; ctx.lineWidth = 0.6; ctx.stroke();
                    }
                }
            } else {
                var r = 1.8 + boost * 1.5;
                ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(92,92,116,' + (0.15 + boost * 0.2) + ')'; ctx.fill();
            }
        }

        var pct = Math.round(firingCount / cells.length * 100);
        ctx.font = 'bold 11px JetBrains Mono'; ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(52,211,153,0.6)';
        ctx.fillText(firingCount + '/' + cells.length + ' connections active (' + pct + '%)', w / 2, h - 12);
        requestAnimationFrame(animate);
    }
    animate();
}

// PATH 3: Trace — sessions connected by golden thread + breathing
function drawPath3() {
    var cvs = document.getElementById('path-cvs-3');
    if (!cvs) return;
    var wrap = cvs.parentElement;
    var ctx = cvs.getContext('2d');
    var rect = wrap.getBoundingClientRect();
    cvs.width = rect.width * 2; cvs.height = PH * 2;
    ctx.scale(2, 2);
    var w = rect.width, h = PH;
    var sessions = [
        { x: 0.06, y: 0.5, label: 'session 1', r: 16 }, { x: 0.22, y: 0.28, label: 'session 2', r: 20 },
        { x: 0.38, y: 0.55, label: 'session 3', r: 24 }, { x: 0.54, y: 0.3, label: 'session 4', r: 28 },
        { x: 0.7, y: 0.6, label: 'session 5', r: 32 }, { x: 0.88, y: 0.38, label: 'session 6', r: 36 }
    ];
    var knowledge = [0.1, 0.25, 0.45, 0.65, 0.82, 0.95];
    var traceP = [];
    for (var i = 0; i < 40; i++) {
        traceP.push({ seg: Math.floor(Math.random() * (sessions.length - 1)), prog: Math.random(), speed: 0.002 + Math.random() * 0.004, size: 1.2 + Math.random() * 2, phase: Math.random() * Math.PI * 2 });
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        var t = performance.now() / 1000;
        var m = mouseInCanvas(wrap);

        // Connections
        for (var i = 0; i < sessions.length - 1; i++) {
            var a = sessions[i], b = sessions[i + 1];
            var ax = a.x * w, ay = a.y * h, bx = b.x * w, by = b.y * h;
            var cpx = (ax + bx) / 2, cpy = Math.min(ay, by) - 40 + Math.sin(t + i) * 12;
            var pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + i);
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo(cpx, cpy, bx, by);
            ctx.strokeStyle = 'rgba(245,158,11,' + (0.3 + pulse * 0.2) + ')'; ctx.lineWidth = 1.5 + pulse * 0.8; ctx.stroke();
        }

        // Trace particles
        for (var i = 0; i < traceP.length; i++) {
            var tp = traceP[i]; tp.prog += tp.speed;
            if (tp.prog > 1) { tp.prog -= 1; tp.seg = (tp.seg + 1) % (sessions.length - 1); }
            var a = sessions[tp.seg], b = sessions[tp.seg + 1];
            var ax = a.x * w, ay = a.y * h, bx = b.x * w, by = b.y * h;
            var cpx = (ax + bx) / 2, cpy = Math.min(ay, by) - 40 + Math.sin(t + tp.seg) * 12;
            var p = tp.prog, omt = 1 - p;
            var px = omt * omt * ax + 2 * omt * p * cpx + p * p * bx;
            var py = omt * omt * ay + 2 * omt * p * cpy + p * p * by;
            var pulse = 0.6 + 0.4 * Math.sin(t * 3 + tp.phase);
            ctx.beginPath(); ctx.arc(px, py, tp.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(245,158,11,' + (0.3 + pulse * 0.25) + ')'; ctx.fill();
        }

        // Session nodes with halos + breathing
        for (var si = 0; si < sessions.length; si++) {
            var s = sessions[si];
            var sx = s.x * w, sy = s.y * h;
            var breatheX = Math.sin(t * 0.4 + si * 1.1) * 2.5;
            var breatheY = Math.cos(t * 0.35 + si * 0.8) * 1.8;
            sx += breatheX; sy += breatheY;
            var boost = 0;
            if (m.inside) {
                var dx = m.x - sx, dy = m.y - sy, dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) { boost = 1 - dist / 100; sx += dx * boost * 0.1; sy += dy * boost * 0.1; }
            }
            var k = knowledge[si];
            var pulse = 0.85 + 0.15 * Math.sin(t * 1.5 + si);
            var r = s.r * pulse + boost * 6;
            var cr = Math.round(245 - k * 193), cg = Math.round(158 + k * 53), cb = Math.round(11 + k * 142);
            var color = cr + ',' + cg + ',' + cb;
            var grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 2.5);
            grd.addColorStop(0, 'rgba(' + color + ',' + ((0.15 + boost * 0.2) * pulse) + ')'); grd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(sx, sy, r * 2.5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
            ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + color + ',' + (0.15 + k * 0.2 + boost * 0.15) + ')';
            ctx.strokeStyle = 'rgba(' + color + ',' + (0.35 + k * 0.25 + boost * 0.2) + ')';
            ctx.lineWidth = 1.5 + boost; ctx.fill(); ctx.stroke();
            ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(232,232,240,' + (0.5 + k * 0.2 + boost * 0.25) + ')'; ctx.fillText(s.label, sx, sy + r + 16);
            var barW = r * 1.4, barH = 4, bx = sx - barW / 2, by = sy + r + 22;
            ctx.fillStyle = 'rgba(92,92,116,0.25)';
            ctx.beginPath(); ctx.roundRect(bx, by, barW, barH, 2); ctx.fill();
            ctx.fillStyle = 'rgba(52,211,153,' + (0.5 + 0.3 * Math.sin(t + si)) + ')';
            ctx.beginPath(); ctx.roundRect(bx, by, barW * k, barH, 2); ctx.fill();
            ctx.font = '8px JetBrains Mono';
            ctx.fillStyle = 'rgba(52,211,153,' + (0.4 + k * 0.3) + ')'; ctx.fillText(Math.round(k * 100) + '%', sx, by + 14);
        }

        ctx.font = '9px JetBrains Mono'; ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(245,158,11,0.4)'; ctx.fillText('knowledge accumulates \u2192', w / 2, h - 14);
        requestAnimationFrame(animate);
    }
    animate();
}

// PATH 4: Self-Knowledge — confidence sun with radiating typed rays + breathing
function drawPath4() {
    var cvs = document.getElementById('path-cvs-4');
    if (!cvs) return;
    var wrap = cvs.parentElement;
    var ctx = cvs.getContext('2d');
    var rect = wrap.getBoundingClientRect();
    cvs.width = rect.width * 2; cvs.height = PH * 2;
    ctx.scale(2, 2);
    var w = rect.width, h = PH;
    var cx = w * 0.5, cy = h * 0.48;

    var rays = [];
    for (var i = 0; i < 28; i++) {
        rays.push({ angle: (Math.PI * 2 / 28) * i, confidence: Math.random(), length: 0.25 + Math.random() * 0.2, phase: Math.random() * Math.PI * 2 });
    }
    var fragments = [];
    for (var i = 0; i < 20; i++) {
        fragments.push({ angle: Math.random() * Math.PI * 2, orbit: 0.2 + Math.random() * 0.22, speed: 0.12 + Math.random() * 0.25, size: 2 + Math.random() * 2.5, known: Math.random() > 0.35, phase: Math.random() * Math.PI * 2 });
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        var t = performance.now() / 1000;
        var m = mouseInCanvas(wrap);

        // Rays
        for (var i = 0; i < rays.length; i++) {
            var r = rays[i];
            var pulse = 0.5 + 0.5 * Math.sin(t * 2 + r.phase);
            r.confidence += (Math.random() - 0.5) * 0.003;
            r.confidence = Math.max(0.05, Math.min(1, r.confidence));
            var len = r.length * Math.min(w, h) * (0.5 + r.confidence * 0.5);
            var endX = cx + Math.cos(r.angle + t * 0.025) * len;
            var endY = cy + Math.sin(r.angle + t * 0.025) * len;
            var color = r.confidence > 0.6 ? '52,211,153' : r.confidence > 0.3 ? '245,158,11' : '239,68,68';
            var alpha = (0.2 + r.confidence * 0.3) * pulse;
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(endX, endY);
            ctx.strokeStyle = 'rgba(' + color + ',' + alpha + ')'; ctx.lineWidth = 0.8 + r.confidence * 2; ctx.stroke();
            var tipR = 2 + r.confidence * 3;
            // Tip dot with halo
            var tGrd = ctx.createRadialGradient(endX, endY, 0, endX, endY, tipR * 3);
            tGrd.addColorStop(0, 'rgba(' + color + ',' + (alpha * 0.5) + ')'); tGrd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(endX, endY, tipR * 3, 0, Math.PI * 2); ctx.fillStyle = tGrd; ctx.fill();
            ctx.beginPath(); ctx.arc(endX, endY, tipR, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + color + ',' + (alpha * 1.5) + ')'; ctx.fill();
            if (r.confidence > 0.6 && len > 60) {
                ctx.font = '9px JetBrains Mono'; ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(' + color + ',' + (0.4 + pulse * 0.25) + ')';
                ctx.fillText(Math.round(r.confidence * 100) + '%', endX, endY + tipR + 12);
            }
        }

        // Fragments with breathing
        for (var i = 0; i < fragments.length; i++) {
            var f = fragments[i];
            var angle = f.angle + t * f.speed;
            var breatheR = 1 + Math.sin(t * 0.5 + i * 0.8) * 0.1;
            var fx = cx + Math.cos(angle) * f.orbit * Math.min(w, h) * breatheR;
            var fy = cy + Math.sin(angle) * f.orbit * Math.min(w, h) * 0.7 * breatheR;
            var boost = 0;
            if (m.inside) {
                var dx = m.x - fx, dy = m.y - fy, dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 70) { boost = 1 - dist / 70; fx += dx * boost * 0.12; fy += dy * boost * 0.12; }
            }
            var pulse = 0.6 + 0.4 * Math.sin(t * 2 + f.phase);
            var color = f.known ? '52,211,153' : '239,68,68';
            var r = f.size * pulse + boost * 4;
            if (r > 2) {
                var grd = ctx.createRadialGradient(fx, fy, 0, fx, fy, r * 3);
                grd.addColorStop(0, 'rgba(' + color + ',' + ((0.15 + boost * 0.2) * pulse) + ')'); grd.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(fx, fy, r * 3, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
            }
            ctx.beginPath(); ctx.arc(fx, fy, r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + color + ',' + (0.3 + pulse * 0.3 + boost * 0.3) + ')'; ctx.fill();
        }

        // Center node with halo
        var cPulse = 0.6 + 0.4 * Math.sin(t * 1.2);
        var cBoost = 0;
        if (m.inside) {
            var dx = m.x - cx, dy = m.y - cy, dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) cBoost = 1 - dist / 80;
        }
        var cr = 14 + cPulse * 4 + cBoost * 6;
        var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr * 3.5);
        grd.addColorStop(0, 'rgba(52,211,153,' + ((0.2 + cBoost * 0.2) * cPulse) + ')'); grd.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(cx, cy, cr * 3.5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(52,211,153,' + (0.45 + cPulse * 0.3 + cBoost * 0.2) + ')'; ctx.fill();
        var cycle = (Math.sin(t * 0.35) + 1) / 2;
        var symbol = cycle > 0.5 ? '!' : '?';
        ctx.font = 'bold ' + (18 + cPulse * 5) + 'px JetBrains Mono';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255,255,255,' + (0.6 + cPulse * 0.3) + ')'; ctx.fillText(symbol, cx, cy);
        ctx.textBaseline = 'alphabetic';
        ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(52,211,153,0.4)';
        ctx.fillText('loss = predict_right + \u03B1 \u00D7 can_you_cite_why', w / 2, h - 14);
        requestAnimationFrame(animate);
    }
    animate();
}

// Trigger each path canvas as it scrolls into view
[['path-cvs-1', drawPath1], ['path-cvs-2', drawPath2], ['path-cvs-3', drawPath3], ['path-cvs-4', drawPath4]].forEach(function(pair) {
    var id = pair[0], fn = pair[1];
    var drawn = false;
    var obs = new IntersectionObserver(function(es) {
        es.forEach(function(e) { if (!e.isIntersecting || drawn) return; drawn = true; fn(); });
    }, { threshold: 0.2 });
    var el = document.getElementById(id);
    if (el) obs.observe(el);
});

})();
