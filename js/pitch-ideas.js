/* TRP Site — Pitch: Four Idea Canvases
   Hybrid: tree structure (truth) + node dots with halos (soul).
   Typed sides breathe. Untyped sides stay flat. The contrast IS the message. */

(function() {

var FONT = '11px JetBrains Mono';

// ===== ATTENTION CANVAS (idea 1) =====
function drawAttnCanvas(canvasId, typed) {
    var cvs = document.getElementById(canvasId);
    var ctx = cvs.getContext('2d');
    var rect = cvs.parentElement.getBoundingClientRect();
    cvs.width = rect.width * 2; cvs.height = 300 * 2;
    ctx.scale(2, 2);
    var w = rect.width, h = 300;

    var LINE_H = 28;

    // Read content from SITE.active (set by mode.js)
    var A = (window.SITE && window.SITE.active) || {};
    var files = A['attn.files'] || ['auth.py', 'stripe.py', 'profile.py', 'token.py', 'config.py'];
    var dirLabel = A['attn.dir'] || 'src/';
    var edges = A['attn.edges'] || [
        { from: 0, to: 1, type: 'REQUIRES' },
        { from: 0, to: 3, type: 'USES' },
        { from: 1, to: 4, type: 'USES' },
        { from: 2, to: 0, type: 'MENTIONS' },
        { from: 3, to: 1, type: 'CONTRADICTS' }
    ];
    var edgeTypes = A['attn.edgeTypes'] || ['REQUIRES', 'USES', 'CONTRADICTS', 'CREATES', 'MENTIONS'];

    // Color palette for edge types — maps by position (0-4) so any mode's types get distinct visuals
    function makePalette() {
        return [
            { col: C('edgeRed','255,90,90'),     width: 2.2, dash: [],       dotR: 3.0 },
            { col: C('edgeBlue','110,180,255'),   width: 1.6, dash: [6, 4],   dotR: 2.2 },
            { col: C('edgeAmber','255,180,30'),   width: 2.0, dash: [3, 3],   dotR: 2.8 },
            { col: C('edgeGreen','70,230,170'),   width: 1.4, dash: [10, 3],  dotR: 2.0 },
            { col: C('edgeDim','160,160,200'),    width: 0.9, dash: [2, 5],   dotR: 1.4 }
        ];
    }
    var palette = makePalette();
    var typeColors = {}, typeStyles = {};
    function rebuildPalette() {
        palette = makePalette();
        typeColors = {}; typeStyles = {};
        for (var ti = 0; ti < edgeTypes.length; ti++) {
            var p = palette[ti % palette.length];
            typeColors[edgeTypes[ti]] = p.col;
            typeStyles[edgeTypes[ti]] = { width: p.width, dash: p.dash, dotR: p.dotR };
        }
    }
    rebuildPalette();

    // Listen for mode changes and re-read content
    window.addEventListener('site-mode-change', function() {
        var B = (window.SITE && window.SITE.active) || {};
        files = B['attn.files'] || files;
        dirLabel = B['attn.dir'] || dirLabel;
        edges = B['attn.edges'] || edges;
        edgeTypes = B['attn.edgeTypes'] || edgeTypes;
        rebuildPalette();
        recomputeLayout();
    });

    var padLeft = Math.max(36, w * 0.06);
    var headerY = 36;
    var nodeX = padLeft + 4;
    var treeX = padLeft + 18;
    var firstY = headerY + LINE_H;
    var fileY = [], lastY = 0;
    function recomputeLayout() {
        fileY = [];
        for (var i = 0; i < files.length; i++) fileY[i] = firstY + i * LINE_H;
        lastY = fileY[files.length - 1] || firstY;
    }
    recomputeLayout();

    var edgeOriginX = treeX + 130;
    var edgeCurveW = Math.min(w * 0.3, 140);

    function pfx(i) { return i < files.length - 1 ? '\u251C\u2500\u2500 ' : '\u2514\u2500\u2500 '; }

    // Signal particles (typed side only)
    var signals = [];
    if (typed) {
        for (var s = 0; s < 10; s++) {
            signals.push({ progress: Math.random(), speed: 0.003 + Math.random() * 0.004, size: 1 + Math.random(), phase: Math.random() * Math.PI * 2 });
        }
    }

    // Hover state: which file index is hovered (-1 = none)
    var hoveredFile = -1;

    function animate() {
        ctx.clearRect(0, 0, w, h);
        var m = mouseInCanvas(cvs.parentElement);
        var t = performance.now() / 1000;

        // ---- Determine hovered file (check both node dots AND text row) ----
        hoveredFile = -1;
        if (m.inside) {
            var bestDist = 60;
            for (var hi = 0; hi < files.length; hi++) {
                // Check distance to node dot position
                var ndx = m.x - nodeX, ndy = m.y - fileY[hi];
                var ndist = Math.sqrt(ndx * ndx + ndy * ndy);
                if (ndist < bestDist) { bestDist = ndist; hoveredFile = hi; }
                // Check distance to text row center
                var tdx = m.x - (treeX + 60), tdy = m.y - fileY[hi];
                var tdist = Math.sqrt(tdx * tdx + tdy * tdy);
                if (tdist < bestDist) { bestDist = tdist; hoveredFile = hi; }
            }
        }

        // Which files are connected to hovered file?
        var connectedFiles = {};
        var connectedEdges = {};
        if (hoveredFile >= 0) {
            connectedFiles[hoveredFile] = true;
            for (var ci = 0; ci < edges.length; ci++) {
                if (edges[ci].from === hoveredFile || edges[ci].to === hoveredFile) {
                    connectedEdges[ci] = true;
                    connectedFiles[edges[ci].from] = true;
                    connectedFiles[edges[ci].to] = true;
                }
            }
        }
        var hasHover = hoveredFile >= 0;

        // ---- Hub node ----
        if (typed) {
            var hp = 0.7 + 0.3 * Math.sin(t * 1.2);
            var hr = 5 + hp * 1.5;
            var hg = ctx.createRadialGradient(nodeX, headerY, 0, nodeX, headerY, hr * 4);
            hg.addColorStop(0, 'rgba(' + C('edgeBlue','110,180,255') + ',' + (0.25 * hp) + ')');
            hg.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(nodeX, headerY, hr * 4, 0, Math.PI * 2);
            ctx.fillStyle = hg; ctx.fill();
            ctx.beginPath(); ctx.arc(nodeX, headerY, hr, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + C('edgeBlue','110,180,255') + ',' + (0.6 + hp * 0.35) + ')'; ctx.fill();
        } else {
            // Untyped hub — dim but visible
            ctx.beginPath(); ctx.arc(nodeX, headerY, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + C('edgeDim','160,160,200') + ',0.25)'; ctx.fill();
        }

        // Header
        ctx.font = 'bold ' + FONT; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
        ctx.fillStyle = typed ? 'rgba(' + C('edgeBlue','110,180,255') + ',' + (0.8 + 0.15 * Math.sin(t * 1.5)) + ')' : 'rgba(' + C('mid','160,160,184') + ',0.55)';
        ctx.fillText(dirLabel, treeX, headerY);

        // ---- Trunk ----
        ctx.beginPath(); ctx.moveTo(nodeX, headerY + 8); ctx.lineTo(nodeX, lastY);
        if (typed) {
            ctx.strokeStyle = 'rgba(' + C('edgeGreen','70,230,170') + ',' + (0.18 + 0.08 * Math.sin(t * 1.2)) + ')';
            ctx.lineWidth = 1.0;
        } else {
            ctx.strokeStyle = 'rgba(' + C('edgeDim','160,160,200') + ',0.18)'; ctx.lineWidth = 0.7;
        }
        ctx.setLineDash([]); ctx.stroke();

        // ---- Signal particles (typed) ----
        if (typed) {
            for (var si = 0; si < signals.length; si++) {
                var sig = signals[si];
                sig.progress += sig.speed;
                if (sig.progress > 1) sig.progress -= 1;
                var sigY = (headerY + 8) + sig.progress * (lastY - headerY - 8);
                var sp = 0.5 + 0.5 * Math.sin(t * 5 + sig.phase);
                ctx.beginPath(); ctx.arc(nodeX, sigY, sig.size * sp, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + C('edgeGreen','70,230,170') + ',' + (0.2 + sp * 0.25) + ')'; ctx.fill();
            }
        }

        // ---- File entries ----
        ctx.font = FONT;
        for (var i = 0; i < files.length; i++) {
            var baseY = fileY[i];
            var prefix = pfx(i);
            var breathe = Math.sin(t * 1.5 + i * 0.6);

            // Is this file part of hovered cluster?
            var inCluster = !hasHover || connectedFiles[i];
            var dimFactor = hasHover && !inCluster ? 0.25 : 1.0;

            var dX = typed ? Math.sin(t * 0.5 + i * 0.8) * 1.2 : 0;
            var dY = typed ? Math.cos(t * 0.4 + i * 0.9) * 0.8 : 0;
            var nX = nodeX + dX, nY = baseY + dY;

            // Cursor pull (typed only)
            var boost = 0;
            if (m.inside && typed) {
                var mdx = m.x - nX, mdy = m.y - nY;
                var md = Math.sqrt(mdx * mdx + mdy * mdy);
                if (md < 100 && md > 1) {
                    boost = (1 - md / 100) * dimFactor;
                    nX += mdx * boost * 0.1; nY += mdy * boost * 0.1;
                }
            }

            if (typed) {
                // Node dot with halo — brighter when in cluster
                var np = 0.7 + 0.3 * breathe;
                var clusterBoost = (hoveredFile === i) ? 0.4 : (connectedFiles[i] && hasHover) ? 0.2 : 0;
                var nr = 3.5 + np + boost * 3 + clusterBoost * 3;
                var gr = nr * 3.5;
                var grd = ctx.createRadialGradient(nX, nY, 0, nX, nY, gr);
                grd.addColorStop(0, 'rgba(' + C('edgeGreen','70,230,170') + ',' + ((0.15 + boost * 0.15 + clusterBoost * 0.2) * np * dimFactor) + ')');
                grd.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(nX, nY, gr, 0, Math.PI * 2);
                ctx.fillStyle = grd; ctx.fill();
                ctx.beginPath(); ctx.arc(nX, nY, nr, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + C('edgeGreen','70,230,170') + ',' + (0.5 + np * 0.35 + boost * 0.2 + clusterBoost * 0.3) * dimFactor + ')'; ctx.fill();

                // Hover bar — only on hovered file itself
                if (hoveredFile === i) {
                    ctx.fillStyle = 'rgba(' + C('edgeGreen','70,230,170') + ',0.06)';
                    ctx.beginPath(); ctx.roundRect(treeX - 4, baseY - LINE_H * 0.38, w - padLeft - 20, LINE_H * 0.76, 3); ctx.fill();
                }

                // Connector trunk -> node
                ctx.beginPath(); ctx.moveTo(nodeX, baseY); ctx.lineTo(nX - nr - 1, nY);
                ctx.strokeStyle = 'rgba(' + C('edgeGreen','70,230,170') + ',' + (0.2 + boost * 0.15) * dimFactor + ')';
                ctx.lineWidth = 0.7; ctx.setLineDash([]); ctx.stroke();
            } else {
                // Untyped: visible dot, not invisible
                ctx.beginPath(); ctx.arc(nodeX, baseY, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + C('edgeDim','160,160,200') + ',0.3)'; ctx.fill();

                // Untyped: connector line
                ctx.beginPath(); ctx.moveTo(nodeX, baseY); ctx.lineTo(nodeX + 8, baseY);
                ctx.strokeStyle = 'rgba(' + C('edgeDim','160,160,200') + ',0.12)'; ctx.lineWidth = 0.5; ctx.setLineDash([]); ctx.stroke();
            }

            // Prefix — brighter on untyped side
            ctx.textAlign = 'left';
            if (typed) {
                ctx.fillStyle = 'rgba(' + C('edgeGreen','70,230,170') + ',' + (0.35 + boost * 0.25) * dimFactor + ')';
            } else {
                ctx.fillStyle = 'rgba(' + C('mid','160,160,184') + ',0.4)';
            }
            ctx.fillText(prefix, treeX, baseY);

            // Filename — brighter on untyped side
            var nameX = treeX + ctx.measureText(prefix).width;
            if (typed) {
                ctx.fillStyle = 'rgba(' + C('text','232,232,240') + ',' + (0.7 + boost * 0.2) * dimFactor + ')';
            } else {
                ctx.fillStyle = 'rgba(' + C('mid','160,160,184') + ',0.55)';
            }
            ctx.fillText(files[i], nameX, baseY);
        }

        // ---- Edges ----
        for (var ei = 0; ei < edges.length; ei++) {
            var e = edges[ei];
            var y1 = fileY[e.from] + (typed ? Math.cos(t * 0.4 + e.from * 0.9) * 0.8 : 0);
            var y2 = fileY[e.to] + (typed ? Math.cos(t * 0.4 + e.to * 0.9) * 0.8 : 0);

            var pulse = 0.5 + 0.5 * Math.sin(t * 2 + ei * 1.3);

            // Edge highlight: only when hovered file is connected to this edge
            var isHl = hasHover && connectedEdges[ei];
            var edgeDim = hasHover && !connectedEdges[ei] ? 0.2 : 1.0;

            var x1 = edgeOriginX, x2 = edgeOriginX;
            var cpX = edgeOriginX + edgeCurveW * (0.3 + ei * 0.14);

            var style = typed ? typeStyles[e.type] : null;

            // Draw edge curve
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.bezierCurveTo(cpX, y1, cpX, y2, x2, y2);
            if (typed) {
                var col = typeColors[e.type];
                ctx.setLineDash(style.dash);
                ctx.strokeStyle = 'rgba(' + col + ',' + (isHl ? 0.85 + pulse * 0.15 : (0.4 + pulse * 0.15) * edgeDim) + ')';
                ctx.lineWidth = isHl ? style.width * 1.8 + pulse * 0.5 : style.width * edgeDim;
            } else {
                var g = 140 + ei * 12;
                ctx.setLineDash([]);
                ctx.strokeStyle = 'rgba(' + g + ',' + g + ',' + (g + 15) + ',' + (0.15 + pulse * 0.05) + ')';
                ctx.lineWidth = 0.6;
            }
            ctx.stroke();
            ctx.setLineDash([]);

            // Bidirectional travelling dots (typed) — one going each way
            if (typed) {
                var col = typeColors[e.type];
                var dr = style.dotR;

                // Forward dot
                var pt1 = ((t * 0.7 + ei * 0.7) % 1);
                var u = pt1, u1 = 1 - u;
                var px1 = u1*u1*u1*x1 + 3*u1*u1*u*cpX + 3*u1*u*u*cpX + u*u*u*x2;
                var py1 = u1*u1*u1*y1 + 3*u1*u1*u*y1 + 3*u1*u*u*y2 + u*u*u*y2;
                var dAlpha = isHl ? 0.35 : 0.18 * edgeDim;
                var dg1 = ctx.createRadialGradient(px1, py1, 0, px1, py1, dr * 4);
                dg1.addColorStop(0, 'rgba(' + col + ',' + (dAlpha * pulse) + ')');
                dg1.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(px1, py1, dr * 4, 0, Math.PI * 2); ctx.fillStyle = dg1; ctx.fill();
                ctx.beginPath(); ctx.arc(px1, py1, dr, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + col + ',' + (0.6 + pulse * 0.4) * edgeDim + ')'; ctx.fill();

                // Reverse dot — offset by half cycle
                var pt2 = ((t * 0.7 + ei * 0.7 + 0.5) % 1);
                var v = 1 - pt2, v1 = 1 - v; // reverse direction
                var px2 = v1*v1*v1*x1 + 3*v1*v1*v*cpX + 3*v1*v*v*cpX + v*v*v*x2;
                var py2 = v1*v1*v1*y1 + 3*v1*v1*v*y1 + 3*v1*v*v*y2 + v*v*v*y2;
                var dg2 = ctx.createRadialGradient(px2, py2, 0, px2, py2, dr * 3);
                dg2.addColorStop(0, 'rgba(' + col + ',' + (dAlpha * 0.7 * pulse) + ')');
                dg2.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(px2, py2, dr * 3, 0, Math.PI * 2); ctx.fillStyle = dg2; ctx.fill();
                ctx.beginPath(); ctx.arc(px2, py2, dr * 0.75, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + col + ',' + (0.5 + pulse * 0.3) * edgeDim + ')'; ctx.fill();
            }

        }

        // ---- "try hovering" hint (typed side, fades on interaction) ----
        if (typed && !hasHover) {
            var hintAlpha = 0.45 + 0.15 * Math.sin(t * 2);
            ctx.font = 'italic 10px JetBrains Mono';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(' + C('mid','160,160,184') + ',' + hintAlpha + ')';
            ctx.fillText('try hovering \u2191', edgeOriginX - 10, lastY + LINE_H * 0.9);
            ctx.font = FONT;
        }

        // ---- Legend (typed side only) ----
        if (typed) {
            // Collect which types are active (connected to hovered file)
            var activeTypes = {};
            if (hasHover) {
                for (var li = 0; li < edges.length; li++) {
                    if (connectedEdges[li]) activeTypes[edges[li].type] = true;
                }
            }

            var legendTypes = edgeTypes;
            var legendStartY = lastY + LINE_H * 1.5;
            var legendRowH = 20;
            var legendPad = padLeft;
            var itemGap = 12;
            ctx.font = '9px JetBrains Mono';

            // Measure items and flow into rows
            var curX = legendPad;
            var curY = legendStartY;
            var maxW = w - legendPad;

            for (var li = 0; li < legendTypes.length; li++) {
                var lt = legendTypes[li];
                var lCol = typeColors[lt];
                var lStyle = typeStyles[lt];
                var isActive = !hasHover || activeTypes[lt];
                var lAlpha = isActive ? 0.85 : 0.15;

                var labelW = ctx.measureText(lt).width;
                var itemW = 26 + labelW; // 22px line + 4px gap + text

                // Wrap to next row if this item would overflow
                if (curX + itemW > maxW && li > 0) {
                    curX = legendPad;
                    curY += legendRowH;
                }

                // Line sample
                ctx.beginPath();
                ctx.moveTo(curX, curY);
                ctx.lineTo(curX + 22, curY);
                ctx.setLineDash(lStyle.dash);
                ctx.strokeStyle = 'rgba(' + lCol + ',' + lAlpha + ')';
                ctx.lineWidth = lStyle.width * (isActive ? 1 : 0.6);
                ctx.stroke();
                ctx.setLineDash([]);

                // Dot sample on the line
                ctx.beginPath(); ctx.arc(curX + 11, curY, lStyle.dotR * 0.7, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + lCol + ',' + lAlpha + ')'; ctx.fill();

                // Label
                ctx.textAlign = 'left';
                ctx.fillStyle = 'rgba(' + lCol + ',' + lAlpha + ')';
                ctx.fillText(lt, curX + 26, curY + 3);

                curX += itemW + itemGap;
            }
            ctx.font = FONT;
        }

        requestAnimationFrame(animate);
    }
    animate();
}

var attnDrawn = false;
var attnObs = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
        if (!e.isIntersecting || attnDrawn) return;
        attnDrawn = true;
        drawAttnCanvas('attn-old', false);
        drawAttnCanvas('attn-new', true);
    });
}, { threshold: 0.1 });
attnObs.observe(document.getElementById('idea1'));

// ===== THRESHOLD CANVAS (idea 2) =====
function drawThreshCanvas(canvasId, selective) {
    var cvs = document.getElementById(canvasId);
    var ctx = cvs.getContext('2d');
    var rect = cvs.parentElement.getBoundingClientRect();
    cvs.width = rect.width * 2; cvs.height = 280 * 2;
    ctx.scale(2, 2);
    var w = rect.width, h = 280;

    var grid = [];
    var cols = 6, rows = 4;
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            grid.push({ x: w * (0.12 + c * 0.15), y: h * (0.15 + r * 0.22), active: selective ? (Math.random() < 0.3) : true, phase: Math.random() * Math.PI * 2 });
        }
    }
    if (selective) { grid[2].active = true; grid[7].active = true; grid[14].active = true; grid[19].active = true; grid[10].active = true; }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        var t = performance.now() / 1000;
        var m = mouseInCanvas(cvs.parentElement);

        // Connections
        for (var i = 0; i < grid.length; i++) {
            for (var j = i + 1; j < grid.length; j++) {
                var a = grid[i], b = grid[j];
                if (selective && (!a.active || !b.active)) continue;
                var dx = b.x - a.x, dy = b.y - a.y, dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > w * 0.4) continue;
                var pulse = 0.5 + 0.5 * Math.sin(t + i * 0.3 + j * 0.2);
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = selective ? 'rgba(' + C('green','52,211,153') + ',' + (0.15 + pulse * 0.2) + ')' : 'rgba(' + C('red','239,68,68') + ',' + (0.12 + pulse * 0.1) + ')';
                ctx.lineWidth = 0.7; ctx.stroke();
            }
        }

        // Nodes with halos + breathing
        for (var i = 0; i < grid.length; i++) {
            var n = grid[i];
            var pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + n.phase);
            var isActive = selective ? n.active : true;
            var breatheX = Math.sin(t * 0.4 + i * 0.7) * (selective ? 1.5 : 0.5);
            var breatheY = Math.cos(t * 0.3 + i * 0.9) * (selective ? 1.0 : 0.3);
            var drawX = n.x + breatheX, drawY = n.y + breatheY;
            var boost = 0;
            if (m.inside) {
                var dx = m.x - drawX, dy = m.y - drawY, dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 80 && dist > 1) { boost = 1 - dist / 80; drawX += dx * boost * 0.1; drawY += dy * boost * 0.1; }
            }
            var r = (isActive ? 3 + pulse * 2 : 2) + boost * 3;
            var alpha = (isActive ? 0.7 + pulse * 0.3 : 0.15) + boost * 0.3;

            // Halo for active nodes
            if (isActive || boost > 0.3) {
                var grd = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, r * 4);
                grd.addColorStop(0, selective ? 'rgba(' + C('green','52,211,153') + ',' + ((0.2 + boost * 0.2) * pulse) + ')' : 'rgba(' + C('red','239,68,68') + ',' + ((0.15 + boost * 0.15) * pulse) + ')');
                grd.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(drawX, drawY, r * 4, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
            }
            ctx.beginPath(); ctx.arc(drawX, drawY, r, 0, Math.PI * 2);
            ctx.fillStyle = selective ? (isActive ? 'rgba(' + C('green','52,211,153') + ',' + alpha + ')' : 'rgba(' + C('dim','92,92,116') + ',' + (0.2 + boost * 0.3) + ')') : 'rgba(' + C('red','239,68,68') + ',' + (alpha * 0.6) + ')';
            ctx.fill();
        }
        requestAnimationFrame(animate);
    }
    animate();
}

var threshDrawn = false;
var threshObs = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
        if (!e.isIntersecting || threshDrawn) return;
        threshDrawn = true;
        drawThreshCanvas('thresh-old', false);
        drawThreshCanvas('thresh-new', true);
    });
}, { threshold: 0.1 });
threshObs.observe(document.getElementById('idea2'));

// ===== TRACE CANVAS (idea 3) =====
function drawTraceCanvas(canvasId, connected) {
    var cvs = document.getElementById(canvasId);
    var ctx = cvs.getContext('2d');
    var rect = cvs.parentElement.getBoundingClientRect();
    cvs.width = rect.width * 2; cvs.height = 300 * 2;
    ctx.scale(2, 2);
    var w = rect.width, h = 300;

    var count = 5;
    var sessions = [];
    for (var i = 0; i < count; i++) {
        sessions.push({ x: w * (0.12 + i * 0.19), y: h * 0.45, r: 12 + (connected ? i * 3 : 0), label: 'S' + (i + 1), knowledge: connected ? Math.min(1, 0.2 + i * 0.2) : 0.2, phase: i * 1.2 });
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        var t = performance.now() / 1000;
        var m = mouseInCanvas(cvs.parentElement);

        // Connections (connected only)
        if (connected) {
            for (var i = 0; i < sessions.length - 1; i++) {
                var a = sessions[i], b = sessions[i + 1];
                var pulse = 0.6 + 0.4 * Math.sin(t * 2 + i);
                ctx.beginPath(); ctx.moveTo(a.x + a.r, a.y);
                var cpx = (a.x + b.x) / 2, cpy = a.y - 20 - i * 5;
                ctx.quadraticCurveTo(cpx, cpy, b.x - b.r, b.y);
                ctx.strokeStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.3 + pulse * 0.4) + ')'; ctx.lineWidth = 1.5 + pulse; ctx.stroke();
                // Travelling dot
                var pt = (Math.sin(t * 1.5 + i * 0.8) + 1) / 2;
                var px = a.x + a.r + (b.x - b.r - a.x - a.r) * pt;
                var py = a.y + (cpy - a.y) * 4 * pt * (1 - pt);
                ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.5 + pulse * 0.5) + ')'; ctx.fill();
            }
            // Knowledge bars
            for (var i = 1; i < sessions.length; i++) {
                var s = sessions[i];
                var barW = s.r * 1.6, barH = 3, bx = s.x - barW / 2, by = s.y + s.r + 18;
                ctx.fillStyle = 'rgba(' + C('dim','92,92,116') + ',0.3)'; ctx.fillRect(bx, by, barW, barH);
                ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.5 + 0.3 * Math.sin(t + i)) + ')';
                ctx.fillRect(bx, by, barW * s.knowledge, barH);
            }
        }

        // Session nodes with halos + breathing
        for (var i = 0; i < sessions.length; i++) {
            var s = sessions[i];
            var pulse = 0.8 + 0.2 * Math.sin(t * 1.5 + s.phase);
            var breatheX = Math.sin(t * 0.4 + i * 1.1) * (connected ? 2 : 0.5);
            var breatheY = Math.cos(t * 0.35 + i * 0.8) * (connected ? 1.5 : 0.3);
            var drawX = s.x + breatheX, drawY = s.y + breatheY;
            var boost = 0;
            if (m.inside) {
                var dx = m.x - drawX, dy = m.y - drawY, dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100 && dist > 1) { boost = 1 - dist / 100; drawX += dx * boost * 0.1; drawY += dy * boost * 0.1; }
            }
            var drawR = s.r * pulse + boost * 5;
            var grd = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawR * 2.5);
            if (connected) {
                grd.addColorStop(0, 'rgba(' + C('green','52,211,153') + ',' + ((0.15 + s.knowledge * 0.15 + boost * 0.15) * pulse) + ')');
            } else {
                grd.addColorStop(0, 'rgba(' + C('red','239,68,68') + ',' + ((0.12 + boost * 0.1) * pulse) + ')');
            }
            grd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(drawX, drawY, drawR * 2.5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
            ctx.beginPath(); ctx.arc(drawX, drawY, drawR, 0, Math.PI * 2);
            if (connected) {
                ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.15 + s.knowledge * 0.3 + boost * 0.2) + ')';
                ctx.strokeStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.3 + s.knowledge * 0.4 + boost * 0.3) + ')';
            } else {
                ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',' + (0.15 + boost * 0.12) + ')';
                ctx.strokeStyle = 'rgba(' + C('red','239,68,68') + ',' + (0.3 + pulse * 0.1 + boost * 0.2) + ')';
            }
            ctx.fill(); ctx.lineWidth = 1 + boost; ctx.stroke();
            ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'center';
            ctx.fillStyle = connected ? 'rgba(' + C('text','232,232,240') + ',' + (0.5 + s.knowledge * 0.5) + ')' : 'rgba(' + C('dim','92,92,116') + ',0.5)';
            ctx.fillText(s.label, drawX, drawY + 4);
        }

        // Reset labels (disconnected)
        if (!connected) {
            for (var i = 1; i < sessions.length; i++) {
                var s = sessions[i];
                var fade = 0.3 + 0.2 * Math.sin(t + i);
                ctx.font = '8px JetBrains Mono'; ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',' + fade + ')';
                ctx.fillText('reset', s.x, s.y + s.r + 16);
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

var traceDrawn = false;
var traceObs = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
        if (!e.isIntersecting || traceDrawn) return;
        traceDrawn = true;
        drawTraceCanvas('trace-old', false);
        drawTraceCanvas('trace-new', true);
    });
}, { threshold: 0.1 });
traceObs.observe(document.getElementById('idea3'));

// ===== KNOWLEDGE CANVAS (idea 4) =====
function drawKnowCanvas(canvasId, attributed) {
    var cvs = document.getElementById(canvasId);
    var ctx = cvs.getContext('2d');
    var rect = cvs.parentElement.getBoundingClientRect();
    cvs.width = rect.width * 2; cvs.height = 300 * 2;
    ctx.scale(2, 2);
    var w = rect.width, h = 300;

    var LINE_H = 26;

    // Output blocks
    var oCount = 7, outputBlockW = 28, outputBlockH = 14, outputRowY = 38;
    var outputTotalW = oCount * outputBlockW + (oCount - 1) * 10;
    var outputStartX = (w - outputTotalW) / 2;
    var outputs = [];
    for (var i = 0; i < oCount; i++) {
        outputs.push({ x: outputStartX + i * (outputBlockW + 10), y: outputRowY, w: outputBlockW, h: outputBlockH, confidence: attributed ? (0.3 + ((i * 37 + 13) % 17) / 17 * 0.7) : 0.5, sourceIdx: attributed ? (i % 4) : -1, phase: i * 0.9 });
    }

    // Source tree
    var sourceFiles = ['fn:142', 'doc:\u00A73', 'trace:47', 'test:12'];
    var sourceTreeX = 36;
    var sourceHeaderY = 118;
    var sourceNodeX = sourceTreeX - 14;
    var sourceTreeTextX = sourceTreeX;
    var sourceFirstY = sourceHeaderY + LINE_H;
    var sourceY = [];
    for (var i = 0; i < sourceFiles.length; i++) sourceY[i] = sourceFirstY + i * LINE_H;
    var sourceLastY = sourceY[sourceFiles.length - 1];

    function sfxPfx(i) { return i < sourceFiles.length - 1 ? '\u251C\u2500\u2500 ' : '\u2514\u2500\u2500 '; }

    // Signal particles for source tree (attributed only)
    var srcSignals = [];
    if (attributed) {
        for (var s = 0; s < 8; s++) {
            srcSignals.push({ progress: Math.random(), speed: 0.003 + Math.random() * 0.003, size: 0.8 + Math.random() * 0.8, phase: Math.random() * Math.PI * 2 });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        var t = performance.now() / 1000;
        var m = mouseInCanvas(cvs.parentElement);

        // Hover detection
        var hoverOutput = -1, hoverSource = -1;
        if (m.inside) {
            for (var i = 0; i < outputs.length; i++) {
                var o = outputs[i];
                if (m.x >= o.x - 4 && m.x <= o.x + o.w + 4 && m.y >= o.y - 4 && m.y <= o.y + o.h + 4) hoverOutput = i;
            }
            if (attributed) {
                for (var i = 0; i < sourceFiles.length; i++) {
                    var dy = Math.abs(m.y - sourceY[i]), dx = Math.abs(m.x - (sourceTreeX + 50));
                    if (dx < 60 && dy < 12) hoverSource = i;
                }
            }
        }

        if (attributed) {
            // ---- Source tree hub node ----
            var hp = 0.7 + 0.3 * Math.sin(t * 1.2);
            var hr = 4 + hp * 1.2;
            var hg = ctx.createRadialGradient(sourceNodeX, sourceHeaderY, 0, sourceNodeX, sourceHeaderY, hr * 3.5);
            hg.addColorStop(0, 'rgba(' + C('blue','96,165,250') + ',' + (0.15 * hp) + ')'); hg.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(sourceNodeX, sourceHeaderY, hr * 3.5, 0, Math.PI * 2); ctx.fillStyle = hg; ctx.fill();
            ctx.beginPath(); ctx.arc(sourceNodeX, sourceHeaderY, hr, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + C('blue','96,165,250') + ',' + (0.45 + hp * 0.3) + ')'; ctx.fill();

            // Header
            ctx.font = 'bold ' + FONT; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
            ctx.fillStyle = 'rgba(' + C('blue','96,165,250') + ',' + (0.7 + 0.1 * Math.sin(t * 1.5)) + ')';
            ctx.fillText('sources/', sourceTreeTextX, sourceHeaderY);

            // Trunk
            ctx.beginPath(); ctx.moveTo(sourceNodeX, sourceHeaderY + 8); ctx.lineTo(sourceNodeX, sourceLastY);
            ctx.strokeStyle = 'rgba(' + C('blue','96,165,250') + ',' + (0.1 + 0.05 * Math.sin(t * 1.2)) + ')'; ctx.lineWidth = 0.7; ctx.stroke();

            // Signal particles
            for (var si = 0; si < srcSignals.length; si++) {
                var sig = srcSignals[si]; sig.progress += sig.speed;
                if (sig.progress > 1) sig.progress -= 1;
                var sigYp = (sourceHeaderY + 8) + sig.progress * (sourceLastY - sourceHeaderY - 8);
                var sp = 0.5 + 0.5 * Math.sin(t * 5 + sig.phase);
                ctx.beginPath(); ctx.arc(sourceNodeX, sigYp, sig.size * sp, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + C('blue','96,165,250') + ',' + (0.12 + sp * 0.15) + ')'; ctx.fill();
            }

            // Source entries with node dots + halos
            ctx.font = FONT;
            for (var i = 0; i < sourceFiles.length; i++) {
                var baseY = sourceY[i];
                var prefix = sfxPfx(i);
                var isHovered = (hoverSource === i);
                var breathe = Math.sin(t * 1.5 + i * 0.7);
                var dX = Math.sin(t * 0.5 + i * 0.9) * 1.0;
                var dY = Math.cos(t * 0.4 + i * 1.1) * 0.7;
                var nX = sourceNodeX + dX, nY = baseY + dY;
                var boost = 0;
                if (m.inside) {
                    var mdx = m.x - nX, mdy = m.y - nY, md = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (md < 80 && md > 1) { boost = 1 - md / 80; nX += mdx * boost * 0.1; nY += mdy * boost * 0.1; }
                }

                // Node dot with halo
                var np = 0.7 + 0.3 * breathe;
                var nr = 3 + np * 0.8 + boost * 2.5;
                var gr = nr * 3.5;
                var grd = ctx.createRadialGradient(nX, nY, 0, nX, nY, gr);
                grd.addColorStop(0, 'rgba(' + C('blue','96,165,250') + ',' + ((0.1 + boost * 0.12) * np) + ')'); grd.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(nX, nY, gr, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
                ctx.beginPath(); ctx.arc(nX, nY, nr, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + C('blue','96,165,250') + ',' + (0.35 + np * 0.3 + boost * 0.2) + ')'; ctx.fill();

                // Hover bar
                if (boost > 0.15) {
                    ctx.fillStyle = 'rgba(' + C('blue','96,165,250') + ',' + (boost * 0.04) + ')';
                    ctx.beginPath(); ctx.roundRect(sourceTreeTextX - 4, baseY - LINE_H * 0.38, 140, LINE_H * 0.76, 3); ctx.fill();
                }

                // Connector
                ctx.beginPath(); ctx.moveTo(sourceNodeX, baseY); ctx.lineTo(nX - nr - 1, nY);
                ctx.strokeStyle = 'rgba(' + C('blue','96,165,250') + ',' + (0.12 + boost * 0.1) + ')'; ctx.lineWidth = 0.5; ctx.stroke();

                // Prefix + label
                ctx.textAlign = 'left';
                ctx.fillStyle = 'rgba(' + C('blue','96,165,250') + ',' + (0.3 + boost * 0.2) + ')';
                ctx.fillText(prefix, sourceTreeTextX, baseY);
                var nameX = sourceTreeTextX + ctx.measureText(prefix).width;
                ctx.fillStyle = 'rgba(' + C('blue','96,165,250') + ',' + (0.55 + boost * 0.2) + ')';
                ctx.fillText(sourceFiles[i], nameX, baseY);
            }

            // Attribution lines from output blocks to source tree
            for (var i = 0; i < outputs.length; i++) {
                var o = outputs[i];
                if (o.sourceIdx < 0) continue;
                var sy = sourceY[o.sourceIdx];
                var pulse = 0.5 + 0.5 * Math.sin(t * 2 + i * 0.9);
                var isHl = (hoverOutput === i || hoverSource === o.sourceIdx);
                var x1 = o.x + o.w / 2, y1b = o.y + o.h;
                var x2 = sourceTreeTextX + 80, y2b = sy;
                var hue = o.confidence > 0.7 ? '52,211,153' : o.confidence > 0.4 ? '245,158,11' : '239,68,68';
                ctx.beginPath(); ctx.moveTo(x1, y1b);
                ctx.bezierCurveTo(x1, y1b + (y2b - y1b) * 0.3, x2, y2b - (y2b - y1b) * 0.3, x2, y2b);
                ctx.strokeStyle = 'rgba(' + hue + ',' + (isHl ? 0.7 : 0.15 + o.confidence * 0.3 * pulse) + ')';
                ctx.lineWidth = isHl ? 1.8 + pulse : 0.7 + o.confidence * 1.2; ctx.stroke();

                // Travelling dot with halo
                var pt = ((t * 0.7 + i * 0.5) % 1), pu = pt, pu1 = 1 - pu;
                var cpx1 = x1, cpy1 = y1b + (y2b - y1b) * 0.3, cpx2 = x2, cpy2 = y2b - (y2b - y1b) * 0.3;
                var ppx = pu1*pu1*pu1*x1 + 3*pu1*pu1*pu*cpx1 + 3*pu1*pu*pu*cpx2 + pu*pu*pu*x2;
                var ppy = pu1*pu1*pu1*y1b + 3*pu1*pu1*pu*cpy1 + 3*pu1*pu*pu*cpy2 + pu*pu*pu*y2b;
                var dg = ctx.createRadialGradient(ppx, ppy, 0, ppx, ppy, 6);
                dg.addColorStop(0, 'rgba(' + hue + ',' + (0.12 * pulse) + ')'); dg.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(ppx, ppy, 6, 0, Math.PI * 2); ctx.fillStyle = dg; ctx.fill();
                ctx.beginPath(); ctx.arc(ppx, ppy, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + hue + ',' + (0.4 + pulse * 0.5) + ')'; ctx.fill();
            }
        }

        // Output blocks
        for (var i = 0; i < outputs.length; i++) {
            var o = outputs[i];
            var pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + o.phase);
            var isHovered = (hoverOutput === i);
            if (attributed) {
                var hue = o.confidence > 0.7 ? '52,211,153' : o.confidence > 0.4 ? '245,158,11' : '239,68,68';
                var alpha = isHovered ? 0.8 : 0.25 + o.confidence * 0.4 * pulse;
                // Halo
                if (isHovered || o.confidence > 0.7) {
                    var grd = ctx.createRadialGradient(o.x + o.w / 2, o.y + o.h / 2, 0, o.x + o.w / 2, o.y + o.h / 2, o.w);
                    grd.addColorStop(0, 'rgba(' + hue + ',' + ((isHovered ? 0.2 : 0.08) * pulse) + ')'); grd.addColorStop(1, 'transparent');
                    ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h / 2, o.w, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
                }
                ctx.fillStyle = 'rgba(' + hue + ',' + alpha + ')'; ctx.fillRect(o.x, o.y, o.w, o.h);
                ctx.strokeStyle = 'rgba(' + hue + ',' + (isHovered ? 0.9 : 0.3 + o.confidence * 0.3) + ')';
                ctx.lineWidth = isHovered ? 1.5 : 0.8; ctx.strokeRect(o.x, o.y, o.w, o.h);
            } else {
                var alpha = isHovered ? 0.45 : 0.18 + pulse * 0.07;
                var r = 5 + (isHovered ? 2 : 0);
                ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h / 2, r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',' + alpha + ')'; ctx.fill();
            }
        }

        // Labels
        ctx.font = '8px JetBrains Mono'; ctx.textAlign = 'left';
        ctx.fillStyle = attributed ? 'rgba(' + C('text','232,232,240') + ',0.3)' : 'rgba(' + C('dim','92,92,116') + ',0.2)';
        ctx.fillText('output', 4, outputRowY - 6);

        requestAnimationFrame(animate);
    }
    animate();
}

var knowDrawn = false;
var knowObs = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
        if (!e.isIntersecting || knowDrawn) return;
        knowDrawn = true;
        drawKnowCanvas('know-old', false);
        drawKnowCanvas('know-new', true);
    });
}, { threshold: 0.1 });
knowObs.observe(document.getElementById('idea4'));

})();
