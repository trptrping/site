/* TRP Site — Break: Nervous System Canvases
   Canvas 1: healthy — directory tree with living node dots, breathing, alive.
   Canvas 2: suffocating — same tree degrades: nodes vibrate, connections strangle, freeze.
   Hybrid: tree gives truth (real filenames, real timings). Nodes give soul (glow, breath, gravity). */

(function() {

var HOOKS = [
    { name: 'generative-capture.ps1', baseMs: 45 },
    { name: 'signal-capture.ps1',     baseMs: 12 },
    { name: 'atlas-first.ps1',        baseMs: 28 },
    { name: 'atlas-enforce.ps1',      baseMs: 15 },
    { name: 'atlas-ledger.ps1',       baseMs: 22 },
    { name: 'statusline.ps1',         baseMs: 38 },
    { name: 'trace-check.ps1',        baseMs: 19 },
    { name: 'commit-identity.ps1',    baseMs: 8  },
    { name: 'dictionary-align.ps1',   baseMs: 31 },
    { name: 'gainy-check.ps1',        baseMs: 14 }
];

var FONT = '11px JetBrains Mono';
var LINE_H = 26;

function treePrefix(i, total) {
    return i < total - 1 ? '\u251C\u2500\u2500 ' : '\u2514\u2500\u2500 ';
}

// ========== Canvas 1: HEALTHY nervous system ==========
function drawHealthy() {
    var cvs = document.getElementById('nervous-cvs');
    var ctx = cvs.getContext('2d');
    var rect = cvs.parentElement.getBoundingClientRect();
    var h = rect.height || 340;
    cvs.width = rect.width * 2; cvs.height = h * 2;
    ctx.scale(2, 2);
    var w = rect.width;

    var padLeft = Math.max(36, w * 0.06);
    var padTop = 34;
    var treeX = padLeft + 18; // leave room for node dots on the left
    var headerY = padTop;
    var nodeX = padLeft + 4; // node dot column

    // Signal particles flow along the vertical trunk
    var signals = [];
    for (var s = 0; s < 16; s++) {
        signals.push({
            progress: Math.random(),
            speed: 0.002 + Math.random() * 0.004,
            size: 1.0 + Math.random() * 1.2,
            phase: Math.random() * Math.PI * 2
        });
    }

    // Occasional peer-arc particles (between adjacent hooks)
    var peerArcs = [];
    for (var p = 0; p < 5; p++) {
        peerArcs.push({
            fromIdx: Math.floor(Math.random() * (HOOKS.length - 1)),
            progress: Math.random(),
            speed: 0.003 + Math.random() * 0.003,
            phase: Math.random() * Math.PI * 2
        });
    }

    var t = 0;

    function animate() {
        ctx.clearRect(0, 0, w, h);
        t += 0.012;
        var m = mouseInCanvas(cvs.parentElement);

        var firstEntryY = headerY + LINE_H;
        var lastEntryY = headerY + LINE_H * HOOKS.length;

        // ---- Header node (hub) ----
        var hubY = headerY;
        var hubPulse = 0.7 + 0.3 * Math.sin(t * 0.8);
        var hubR = 5 + hubPulse * 1.5;
        var hubGrd = ctx.createRadialGradient(nodeX, hubY, 0, nodeX, hubY, hubR * 4);
        hubGrd.addColorStop(0, 'rgba(' + C('blue','96,165,250') + ',' + (0.18 * hubPulse) + ')');
        hubGrd.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(nodeX, hubY, hubR * 4, 0, Math.PI * 2);
        ctx.fillStyle = hubGrd; ctx.fill();
        ctx.beginPath(); ctx.arc(nodeX, hubY, hubR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + C('blue','96,165,250') + ',' + (0.5 + hubPulse * 0.35) + ')';
        ctx.fill();

        // Header text
        ctx.font = 'bold ' + FONT;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(' + C('blue','96,165,250') + ',' + (0.7 + 0.15 * Math.sin(t * 0.8)) + ')';
        ctx.fillText('.claude/hooks/', treeX, headerY);

        // ---- Vertical trunk (connector line) ----
        var trunkX = nodeX;
        var connAlpha = 0.12 + 0.06 * Math.sin(t * 1.2);
        ctx.beginPath();
        ctx.moveTo(trunkX, hubY + hubR + 2);
        ctx.lineTo(trunkX, lastEntryY);
        ctx.strokeStyle = 'rgba(' + C('green','52,211,153') + ',' + connAlpha + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // ---- Signal particles along trunk ----
        for (var si = 0; si < signals.length; si++) {
            var sig = signals[si];
            sig.progress += sig.speed;
            if (sig.progress > 1) sig.progress -= 1;
            var sigY = (hubY + hubR + 2) + sig.progress * (lastEntryY - hubY - hubR - 2);
            var sPulse = 0.5 + 0.5 * Math.sin(t * 4 + sig.phase);
            ctx.beginPath();
            ctx.arc(trunkX, sigY, sig.size * sPulse, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.15 + sPulse * 0.2) + ')';
            ctx.fill();
        }

        // ---- Peer arcs (occasional soft connections between adjacent hooks) ----
        for (var pi = 0; pi < peerArcs.length; pi++) {
            var pa = peerArcs[pi];
            pa.progress += pa.speed;
            if (pa.progress > 1) { pa.progress -= 1; pa.fromIdx = Math.floor(Math.random() * (HOOKS.length - 1)); }
            var fromY = firstEntryY + pa.fromIdx * LINE_H;
            var toY = firstEntryY + (pa.fromIdx + 1) * LINE_H;
            var arcX = nodeX - 12 - Math.sin(pa.phase + t) * 4;
            var pp = pa.progress;
            var omt = 1 - pp;
            var px = omt * omt * nodeX + 2 * omt * pp * arcX + pp * pp * nodeX;
            var py = omt * omt * fromY + 2 * omt * pp * ((fromY + toY) / 2) + pp * pp * toY;
            var aPulse = 0.4 + 0.4 * Math.sin(t * 3 + pa.phase);
            ctx.beginPath(); ctx.arc(px, py, 1.2 * aPulse, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.12 + aPulse * 0.15) + ')';
            ctx.fill();
        }

        // ---- Hook entries (node dot + tree text + status) ----
        ctx.font = FONT;
        for (var i = 0; i < HOOKS.length; i++) {
            var hook = HOOKS[i];
            var baseY = firstEntryY + i * LINE_H;
            var prefix = treePrefix(i, HOOKS.length);

            // Breathing: gentle position drift
            var breathe = Math.sin(t * 1.5 + i * 0.6);
            var driftX = Math.sin(t * 0.5 + i * 0.8) * 1.5;
            var driftY = Math.cos(t * 0.4 + i * 0.9) * 1.0;

            var drawNodeX = nodeX + driftX;
            var drawNodeY = baseY + driftY;

            // Cursor: gravitational pull toward mouse
            var boost = 0;
            if (m.inside) {
                var mdx = m.x - drawNodeX, mdy = m.y - drawNodeY;
                var md = Math.sqrt(mdx * mdx + mdy * mdy);
                if (md < 120 && md > 1) {
                    boost = (1 - md / 120);
                    drawNodeX += mdx * boost * 0.1;
                    drawNodeY += mdy * boost * 0.1;
                }
            }

            // Node dot with radial glow halo
            var nPulse = 0.7 + 0.3 * breathe;
            var nodeR = 3.5 + nPulse * 1.0 + boost * 3;
            var glowR = nodeR * 3.5;
            var glowAlpha = (0.12 + boost * 0.15) * nPulse;
            var grd = ctx.createRadialGradient(drawNodeX, drawNodeY, 0, drawNodeX, drawNodeY, glowR);
            grd.addColorStop(0, 'rgba(' + C('green','52,211,153') + ',' + glowAlpha + ')');
            grd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(drawNodeX, drawNodeY, glowR, 0, Math.PI * 2);
            ctx.fillStyle = grd; ctx.fill();

            ctx.beginPath(); ctx.arc(drawNodeX, drawNodeY, nodeR, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.4 + nPulse * 0.35 + boost * 0.2) + ')';
            ctx.fill();

            // Highlight bar on hover
            if (boost > 0.15) {
                ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + (boost * 0.05) + ')';
                ctx.beginPath();
                ctx.roundRect(treeX - 4, baseY - LINE_H * 0.38, 360, LINE_H * 0.76, 3);
                ctx.fill();
            }

            // Tree connector from trunk to node
            ctx.beginPath();
            ctx.moveTo(trunkX, baseY);
            ctx.lineTo(drawNodeX - nodeR - 1, drawNodeY);
            ctx.strokeStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.15 + boost * 0.15) + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();

            // Tree prefix characters
            ctx.textAlign = 'left';
            ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.3 + boost * 0.25) + ')';
            ctx.fillText(prefix, treeX, baseY);

            // Filename
            var nameX = treeX + ctx.measureText(prefix).width;
            var nameAlpha = 0.65 + 0.2 * nPulse + boost * 0.15;
            ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + nameAlpha + ')';
            ctx.fillText(hook.name, nameX, baseY);

            // Checkmark with breathing glow
            var checkX = nameX + ctx.measureText(hook.name).width + 14;
            var checkAlpha = 0.45 + 0.35 * nPulse + boost * 0.15;
            ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + checkAlpha + ')';
            ctx.fillText('\u2713', checkX, baseY);

            // Small halo behind checkmark
            if (nPulse > 0.8 || boost > 0.2) {
                var chGrd = ctx.createRadialGradient(checkX + 4, baseY, 0, checkX + 4, baseY, 10);
                chGrd.addColorStop(0, 'rgba(' + C('green','52,211,153') + ',' + (0.06 * nPulse + boost * 0.05) + ')');
                chGrd.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(checkX + 4, baseY, 10, 0, Math.PI * 2);
                ctx.fillStyle = chGrd; ctx.fill();
            }

            // Timing value with fluctuation
            var timingX = checkX + 18;
            var fluctuation = Math.round(Math.sin(t * 2.5 + i * 1.3) * 5);
            var displayMs = hook.baseMs + fluctuation;
            ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.55 + 0.12 * nPulse) + ')';
            ctx.fillText(displayMs + 'ms', timingX, baseY);
        }

        requestAnimationFrame(animate);
    }
    animate();
}

// ========== Canvas 2: SUFFOCATING nervous system ==========
function drawSuffocate() {
    var cvs = document.getElementById('suffocate-cvs');
    var ctx = cvs.getContext('2d');
    var rect = cvs.parentElement.getBoundingClientRect();
    var h = rect.height || 340;
    cvs.width = rect.width * 2; cvs.height = h * 2;
    ctx.scale(2, 2);
    var w = rect.width;

    var padLeft = Math.max(36, w * 0.06);
    var padTop = 34;
    var treeX = padLeft + 18;
    var headerY = padTop;
    var nodeX = padLeft + 4;

    var t = 0;
    var startTime = performance.now();
    var DECAY_MS = 8000;

    // Each hook fails at a different point
    var failPoints = [];
    for (var fi = 0; fi < HOOKS.length; fi++) {
        failPoints.push(0.3 + Math.random() * 0.5);
    }

    // Cross-connection pairs (strangling bezier arcs between nodes)
    var crossPairs = [];
    for (var cp = 0; cp < 22; cp++) {
        var a = Math.floor(Math.random() * HOOKS.length);
        var b = Math.floor(Math.random() * HOOKS.length);
        if (b === a) b = (a + 1) % HOOKS.length;
        crossPairs.push({ a: a, b: b, threshold: 0.15 + Math.random() * 0.55 });
    }

    // Signal particles (slow down and die)
    var signals = [];
    for (var s = 0; s < 16; s++) {
        signals.push({
            progress: Math.random(),
            speed: 0.002 + Math.random() * 0.004,
            size: 1.0 + Math.random() * 1.2,
            phase: Math.random() * Math.PI * 2
        });
    }

    function animate() {
        var elapsed = performance.now() - startTime;
        var decay = Math.min(1, elapsed / DECAY_MS);
        var frozen = decay > 0.92;

        // Frame skipping: stutter at high decay
        if (decay > 0.7 && Math.random() < (decay - 0.7) * 1.8) {
            requestAnimationFrame(animate);
            return;
        }

        ctx.clearRect(0, 0, w, h);
        t += 0.012 * (1 - decay * 0.85);
        var m = mouseInCanvas(cvs.parentElement);
        var globalAlpha = 1 - decay * 0.35;

        // Color interpolation: green -> amber -> red
        function decayColor(d) {
            if (d < 0.35) return { r: 52, g: 211, b: 153 };
            if (d < 0.65) {
                var mix = (d - 0.35) / 0.3;
                return { r: Math.round(52 + 193 * mix), g: Math.round(211 - 53 * mix), b: Math.round(153 - 142 * mix) };
            }
            var mix2 = (d - 0.65) / 0.35;
            return { r: Math.round(245 - 6 * mix2), g: Math.round(158 - 90 * mix2), b: Math.round(11 + 57 * mix2) };
        }
        var dc = decayColor(decay);
        var colorStr = dc.r + ',' + dc.g + ',' + dc.b;

        // Global vibration
        var vibAmp = frozen ? 1.5 : decay * 5;
        var vibX = frozen ? (Math.random() - 0.5) * vibAmp : Math.sin(t * 15) * vibAmp;
        var vibY = frozen ? (Math.random() - 0.5) * vibAmp : Math.cos(t * 13) * vibAmp;

        var treeOffX = treeX + vibX;
        var nodeOffX = nodeX + vibX;
        var headerYOff = headerY + vibY;
        var firstEntryY = headerYOff + LINE_H;
        var lastEntryY = headerYOff + LINE_H * HOOKS.length;

        // ---- Hub node (distressed) ----
        var hubPulse = 0.7 + 0.3 * Math.sin(t * 0.8);
        var erratic = decay > 0.4 ? Math.sin(t * 12) * 0.4 * (decay - 0.4) : 0;
        hubPulse = Math.max(0.3, hubPulse + erratic);
        var hubR = 5 + hubPulse * 1.5 + decay * 2;
        var hubGrd = ctx.createRadialGradient(nodeOffX, headerYOff, 0, nodeOffX, headerYOff, hubR * 4);
        hubGrd.addColorStop(0, 'rgba(' + colorStr + ',' + (0.2 * hubPulse * globalAlpha) + ')');
        hubGrd.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(nodeOffX, headerYOff, hubR * 4, 0, Math.PI * 2);
        ctx.fillStyle = hubGrd; ctx.fill();
        ctx.beginPath(); ctx.arc(nodeOffX, headerYOff, hubR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + colorStr + ',' + (0.5 + hubPulse * 0.35) * globalAlpha + ')';
        ctx.fill();

        // Header text
        ctx.font = 'bold ' + FONT;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(' + colorStr + ',' + (0.7 + 0.15 * Math.sin(t * 0.8)) * globalAlpha + ')';
        ctx.fillText('.claude/hooks/', treeOffX, headerYOff);

        // ---- Trunk (thickens) ----
        var trunkX = nodeOffX;
        var connLW = 0.8 + decay * 3;
        var connAlpha = (0.12 + 0.06 * Math.sin(t * 1.2) + decay * 0.2) * globalAlpha;
        ctx.beginPath();
        ctx.moveTo(trunkX, headerYOff + hubR + 2);
        ctx.lineTo(trunkX, lastEntryY);
        ctx.strokeStyle = 'rgba(' + colorStr + ',' + connAlpha + ')';
        ctx.lineWidth = connLW;
        ctx.stroke();

        // ---- Signal particles (slow, stop) ----
        var speedMod = Math.max(0, 1 - decay * 1.4);
        for (var si = 0; si < signals.length; si++) {
            var sig = signals[si];
            sig.progress += sig.speed * speedMod;
            if (sig.progress > 1) sig.progress -= 1;
            var sigY = (headerYOff + hubR + 2) + sig.progress * (lastEntryY - headerYOff - hubR - 2);
            var sPulse = 0.5 + 0.5 * Math.sin(t * 4 + sig.phase);
            var sigAlpha = (0.15 + sPulse * 0.2) * (1 - decay * 0.7) * globalAlpha;
            ctx.beginPath();
            ctx.arc(trunkX, sigY, sig.size * sPulse, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + colorStr + ',' + sigAlpha + ')';
            ctx.fill();
        }

        // ---- Cross-connections: strangling bezier arcs between nodes ----
        for (var ci = 0; ci < crossPairs.length; ci++) {
            var cp = crossPairs[ci];
            if (decay < cp.threshold) continue;
            var crossAlpha = ((decay - cp.threshold) / (1 - cp.threshold)) * 0.3 * globalAlpha;
            var yA = firstEntryY + cp.a * LINE_H;
            var yB = firstEntryY + cp.b * LINE_H;
            // Arcs go through the node column, curving left
            var arcLeftX = nodeOffX - 16 - ci * 2.5;
            var midY = (yA + yB) / 2;
            var crossPulse = 0.5 + 0.5 * Math.sin(t * 3 + ci);
            ctx.beginPath();
            ctx.moveTo(nodeOffX, yA);
            ctx.quadraticCurveTo(arcLeftX, midY, nodeOffX, yB);
            ctx.strokeStyle = 'rgba(' + colorStr + ',' + crossAlpha * crossPulse + ')';
            ctx.lineWidth = 0.5 + decay * 2;
            ctx.stroke();
        }

        // ---- Hook entries ----
        ctx.font = FONT;
        for (var i = 0; i < HOOKS.length; i++) {
            var hook = HOOKS[i];
            var baseY = firstEntryY + i * LINE_H;
            var prefix = treePrefix(i, HOOKS.length);
            var hasFailed = decay >= failPoints[i];

            // Per-entry vibration (on top of global)
            var evibX = 0, evibY = 0;
            if (decay > 0.4 && !frozen) {
                var evibAmp = (decay - 0.4) * 7;
                evibX = Math.sin(t * 12 + i * 5) * evibAmp;
                evibY = Math.cos(t * 11 + i * 4) * evibAmp * 0.5;
            }
            if (frozen) {
                evibX = (Math.random() - 0.5) * 2;
                evibY = (Math.random() - 0.5) * 1.5;
            }

            var drawNX = nodeOffX + evibX;
            var drawNY = baseY + evibY;

            // Cursor: gravitational pull weakens with decay
            var boost = 0;
            if (m.inside && decay < 0.8) {
                var mdx = m.x - drawNX, mdy = m.y - drawNY;
                var md = Math.sqrt(mdx * mdx + mdy * mdy);
                if (md < 120 && md > 1) {
                    boost = (1 - md / 120) * (1 - decay);
                    drawNX += mdx * boost * 0.1;
                    drawNY += mdy * boost * 0.1;
                }
            }

            // Node dot: grows slightly, vibrates, color shifts
            var breathe = Math.sin(t * 1.5 + i * 0.6);
            var erraticN = decay > 0.5 ? Math.sin(t * 12 + i * 5) * 0.4 * (decay - 0.5) * 2 : 0;
            var nPulse = Math.max(0.3, 0.7 + 0.3 * breathe + erraticN);
            var nodeR = 3.5 + nPulse * 1.0 + boost * 3 + decay * 1.5;

            // Halo (shifts color with decay)
            var glowR = nodeR * 3.5;
            var glowAlpha = (0.12 + boost * 0.12 + decay * 0.08) * nPulse * globalAlpha;
            var grd = ctx.createRadialGradient(drawNX, drawNY, 0, drawNX, drawNY, glowR);
            grd.addColorStop(0, 'rgba(' + colorStr + ',' + glowAlpha + ')');
            grd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(drawNX, drawNY, glowR, 0, Math.PI * 2);
            ctx.fillStyle = grd; ctx.fill();

            // Solid node
            ctx.beginPath(); ctx.arc(drawNX, drawNY, nodeR, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + colorStr + ',' + (0.4 + nPulse * 0.35 + boost * 0.15) * globalAlpha + ')';
            ctx.fill();

            // Tree connector from trunk to node
            ctx.beginPath();
            ctx.moveTo(trunkX, baseY);
            ctx.lineTo(drawNX - nodeR - 1, drawNY);
            ctx.strokeStyle = 'rgba(' + colorStr + ',' + (0.15 + boost * 0.1) * globalAlpha + ')';
            ctx.lineWidth = 0.6 + decay * 0.8;
            ctx.stroke();

            // Tree prefix
            ctx.textAlign = 'left';
            ctx.fillStyle = 'rgba(' + colorStr + ',' + (0.3 + boost * 0.15) * globalAlpha + ')';
            ctx.fillText(prefix, treeOffX + evibX, baseY + evibY);

            // Filename
            var nameX = treeOffX + evibX + ctx.measureText(prefix).width;
            ctx.fillStyle = 'rgba(' + colorStr + ',' + (0.65 + boost * 0.1) * globalAlpha + ')';
            ctx.fillText(hook.name, nameX, baseY + evibY);

            // Status: ✓ or ✗
            var checkX = nameX + ctx.measureText(hook.name).width + 14;
            if (hasFailed) {
                var failDepth = Math.min(1, (decay - failPoints[i]) / 0.2);
                ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',' + (0.6 + 0.3 * Math.sin(t * 6 + i)) * globalAlpha + ')';
                ctx.fillText('\u2717', checkX, baseY + evibY);
                // Red flare behind failed checkmark
                var fGrd = ctx.createRadialGradient(checkX + 4, baseY + evibY, 0, checkX + 4, baseY + evibY, 12);
                fGrd.addColorStop(0, 'rgba(' + C('red','239,68,68') + ',' + (0.1 * failDepth * nPulse) + ')');
                fGrd.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(checkX + 4, baseY + evibY, 12, 0, Math.PI * 2);
                ctx.fillStyle = fGrd; ctx.fill();
            } else {
                ctx.fillStyle = 'rgba(' + colorStr + ',' + (0.45 + 0.3 * nPulse) * globalAlpha + ')';
                ctx.fillText('\u2713', checkX, baseY + evibY);
            }

            // Timing: escalate
            var timingX = checkX + 18;
            var displayMs;
            if (decay < 0.2) {
                displayMs = hook.baseMs + Math.round(Math.sin(t * 2.5 + i * 1.3) * 5);
            } else if (decay < 0.45) {
                var rise = (decay - 0.2) / 0.25;
                displayMs = Math.round(hook.baseMs + rise * (200 - hook.baseMs));
            } else if (decay < 0.65) {
                var rise2 = (decay - 0.45) / 0.2;
                displayMs = Math.round(200 + rise2 * 600);
            } else if (decay < 0.85) {
                var rise3 = (decay - 0.65) / 0.2;
                displayMs = Math.round(800 + rise3 * 1200);
            } else {
                displayMs = -1;
            }

            if (displayMs === -1) {
                ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',' + 0.7 * globalAlpha + ')';
                ctx.fillText('timeout', timingX, baseY + evibY);
            } else {
                ctx.fillStyle = 'rgba(' + colorStr + ',' + (0.38 + 0.12 * nPulse) * globalAlpha + ')';
                ctx.fillText(displayMs + 'ms', timingX, baseY + evibY);
            }
        }

        requestAnimationFrame(animate);
    }
    animate();
}

// ========== Lazy initialization via IntersectionObserver ==========
var nervousDrawn = false;
var nervousObs = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
        if (!e.isIntersecting || nervousDrawn) return;
        nervousDrawn = true;
        drawHealthy();
    });
}, { threshold: 0.3 });
var nervousEl = document.getElementById('nervous-cvs');
if (nervousEl) nervousObs.observe(nervousEl);

var suffocateDrawn = false;
var suffocateObs = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
        if (!e.isIntersecting || suffocateDrawn) return;
        suffocateDrawn = true;
        drawSuffocate();
    });
}, { threshold: 0.3 });
var suffocateEl = document.getElementById('suffocate-cvs');
if (suffocateEl) suffocateObs.observe(suffocateEl);

})();
