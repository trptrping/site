/* TRP Site — Break: Circuit Breakers on a living hook directory tree
   Hybrid: tree structure (truth) + node dots with halos (soul).
   15-second cycle: stress → breakers activate → recovery → hold → restart */

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
var STRESSED = [0, 2, 4, 6, 8];

function treePrefix(i, total) {
    return i < total - 1 ? '\u251C\u2500\u2500 ' : '\u2514\u2500\u2500 ';
}

function drawCircuitCanvas() {
    var cvs = document.getElementById('circuit-cvs');
    var ctx = cvs.getContext('2d');
    var rect = cvs.parentElement.getBoundingClientRect();
    cvs.width = rect.width * 2; cvs.height = 340 * 2;
    ctx.scale(2, 2);
    var w = rect.width, h = 340;

    var padLeft = Math.max(36, w * 0.06);
    var padTop = 34;
    var treeX = padLeft + 18;
    var headerY = padTop;
    var nodeX = padLeft + 4;
    var CYCLE = 15;
    var t0 = performance.now() / 1000;

    // Signal particles along the vertical trunk
    var signals = [];
    for (var s = 0; s < 14; s++) {
        signals.push({
            progress: Math.random(),
            speed: 0.003 + Math.random() * 0.004,
            size: 1.0 + Math.random() * 1.2,
            phase: Math.random() * Math.PI * 2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        var m = mouseInCanvas(cvs.parentElement);
        var elapsed = (performance.now() / 1000 - t0) % CYCLE;

        // Cycle phases
        var stressAmt = Math.max(0, Math.min(1, elapsed / 4));
        var breakerAmt = Math.max(0, Math.min(1, (elapsed - 4) / 3));
        var recoveryAmt = Math.max(0, Math.min(1, (elapsed - 7) / 4));
        var holdFade = elapsed > 13 ? Math.max(0, 1 - (elapsed - 13) / 2) : 1;

        var effectiveStress = stressAmt * Math.max(0, 1 - recoveryAmt);
        var effectiveHealth = recoveryAmt * holdFade;

        // Color blend based on stress
        function blendColor(stress) {
            if (stress < 0.3) return { r: 52, g: 211, b: 153 };
            if (stress < 0.7) {
                var mix = (stress - 0.3) / 0.4;
                return { r: Math.round(52 + 193 * mix), g: Math.round(211 - 53 * mix), b: Math.round(153 - 142 * mix) };
            }
            var mix2 = (stress - 0.7) / 0.3;
            return { r: Math.round(245 - 6 * mix2), g: Math.round(158 - 90 * mix2), b: Math.round(11 + 57 * mix2) };
        }

        var firstEntryY = headerY + LINE_H;
        var lastEntryY = headerY + LINE_H * HOOKS.length;

        // ---- Hub node ----
        var hubColor = blendColor(effectiveStress * 0.3);
        var hubStr = hubColor.r + ',' + hubColor.g + ',' + hubColor.b;
        var hubPulse = 0.7 + 0.3 * Math.sin(elapsed * 1.2);
        var hubR = 5 + hubPulse * 1.5 + effectiveStress * 1.5;

        var hubGrd = ctx.createRadialGradient(nodeX, headerY, 0, nodeX, headerY, hubR * 4);
        hubGrd.addColorStop(0, 'rgba(' + hubStr + ',' + (0.18 * hubPulse * holdFade) + ')');
        hubGrd.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(nodeX, headerY, hubR * 4, 0, Math.PI * 2);
        ctx.fillStyle = hubGrd; ctx.fill();
        ctx.beginPath(); ctx.arc(nodeX, headerY, hubR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + hubStr + ',' + (0.5 + hubPulse * 0.35) * holdFade + ')';
        ctx.fill();

        // Header text
        ctx.font = 'bold ' + FONT;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(' + C('blue','96,165,250') + ',' + (0.7 + 0.15 * Math.sin(elapsed * 1.5)) * holdFade + ')';
        ctx.fillText('.claude/hooks/', treeX, headerY);

        // ---- Trunk ----
        var trunkX = nodeX;
        var connColor = blendColor(effectiveStress * 0.4);
        var connStr = connColor.r + ',' + connColor.g + ',' + connColor.b;
        var connLW = 0.8 + effectiveStress * 1.5;
        var connAlpha = (0.12 + 0.06 * Math.sin(elapsed * 1.2) + effectiveStress * 0.1) * holdFade;
        ctx.beginPath();
        ctx.moveTo(trunkX, headerY + hubR + 2);
        ctx.lineTo(trunkX, lastEntryY);
        ctx.strokeStyle = 'rgba(' + connStr + ',' + connAlpha + ')';
        ctx.lineWidth = connLW;
        ctx.stroke();

        // ---- Signal particles ----
        var sigSpeed = 1 + effectiveHealth * 0.8 - effectiveStress * 0.4;
        for (var si = 0; si < signals.length; si++) {
            var sig = signals[si];
            sig.progress += sig.speed * sigSpeed;
            if (sig.progress > 1) sig.progress -= 1;
            var sigY = (headerY + hubR + 2) + sig.progress * (lastEntryY - headerY - hubR - 2);
            var sPulse = 0.5 + 0.5 * Math.sin(elapsed * 5 + sig.phase);
            var sigCol = effectiveStress > 0.5 && effectiveHealth < 0.3 ? '239,68,68' : '52,211,153';
            ctx.beginPath();
            ctx.arc(trunkX, sigY, sig.size * sPulse, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + sigCol + ',' + (0.15 + sPulse * 0.2) * holdFade + ')';
            ctx.fill();
        }

        // ---- Hook entries ----
        ctx.font = FONT;
        for (var i = 0; i < HOOKS.length; i++) {
            var hook = HOOKS[i];
            var baseY = firstEntryY + i * LINE_H;
            var prefix = treePrefix(i, HOOKS.length);
            var isStressed = STRESSED.indexOf(i) !== -1;

            var hookStress = isStressed ? effectiveStress : effectiveStress * 0.15;
            var hookRecovery = isStressed ? effectiveHealth : Math.min(1, effectiveHealth + 0.5);
            var netStress = hookStress * (1 - hookRecovery);

            var hc = blendColor(netStress);
            var hcStr = hc.r + ',' + hc.g + ',' + hc.b;

            // Breathing position drift
            var breathe = Math.sin(elapsed * 1.5 + i * 0.6);
            var driftX = Math.sin(elapsed * 0.5 + i * 0.8) * 1.2;
            var driftY = Math.cos(elapsed * 0.4 + i * 0.9) * 0.8;

            // Stress vibration (subtle)
            if (isStressed && netStress > 0.3) {
                var stressVib = netStress * 2.5;
                driftX += Math.sin(elapsed * 10 + i * 3) * stressVib;
                driftY += Math.cos(elapsed * 9 + i * 4) * stressVib * 0.5;
            }

            var drawNX = nodeX + driftX;
            var drawNY = baseY + driftY;

            // Cursor: gravitational pull
            var boost = 0;
            if (m.inside) {
                var mdx = m.x - drawNX, mdy = m.y - drawNY;
                var md = Math.sqrt(mdx * mdx + mdy * mdy);
                if (md < 120 && md > 1) {
                    boost = (1 - md / 120);
                    drawNX += mdx * boost * 0.1;
                    drawNY += mdy * boost * 0.1;
                }
            }

            // Node dot with halo
            var nPulse = 0.7 + 0.3 * breathe;
            var nodeR = 3.5 + nPulse * 1.0 + boost * 3 + netStress * 1.2;
            var glowR = nodeR * 3.5;
            var glowAlpha = (0.12 + boost * 0.15 + netStress * 0.06) * nPulse * holdFade;
            var grd = ctx.createRadialGradient(drawNX, drawNY, 0, drawNX, drawNY, glowR);
            grd.addColorStop(0, 'rgba(' + hcStr + ',' + glowAlpha + ')');
            grd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(drawNX, drawNY, glowR, 0, Math.PI * 2);
            ctx.fillStyle = grd; ctx.fill();

            ctx.beginPath(); ctx.arc(drawNX, drawNY, nodeR, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + hcStr + ',' + (0.4 + nPulse * 0.35 + boost * 0.2) * holdFade + ')';
            ctx.fill();

            // Highlight bar on hover
            if (boost > 0.15) {
                ctx.fillStyle = 'rgba(' + hcStr + ',' + (boost * 0.05) * holdFade + ')';
                ctx.beginPath();
                ctx.roundRect(treeX - 4, baseY - LINE_H * 0.38, 400, LINE_H * 0.76, 3);
                ctx.fill();
            }

            // Tree connector from trunk to node
            ctx.beginPath();
            ctx.moveTo(trunkX, baseY);
            ctx.lineTo(drawNX - nodeR - 1, drawNY);
            ctx.strokeStyle = 'rgba(' + hcStr + ',' + (0.15 + boost * 0.12) * holdFade + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();

            // Tree prefix
            ctx.textAlign = 'left';
            ctx.fillStyle = 'rgba(' + hcStr + ',' + (0.3 + boost * 0.2) * holdFade + ')';
            ctx.fillText(prefix, treeX, baseY);

            // Filename
            var nameX = treeX + ctx.measureText(prefix).width;
            ctx.fillStyle = 'rgba(' + hcStr + ',' + (0.65 + boost * 0.1) * holdFade + ')';
            ctx.fillText(hook.name, nameX, baseY);

            // Status icon
            var checkX = nameX + ctx.measureText(hook.name).width + 14;
            var hasFailed = isStressed && netStress > 0.6;

            if (hasFailed) {
                ctx.fillStyle = 'rgba(' + C('red','239,68,68') + ',' + (0.6 + 0.3 * Math.sin(elapsed * 5 + i)) * holdFade + ')';
                ctx.fillText('\u2717', checkX, baseY);
                // Red flare
                var fGrd = ctx.createRadialGradient(checkX + 4, baseY, 0, checkX + 4, baseY, 12);
                fGrd.addColorStop(0, 'rgba(' + C('red','239,68,68') + ',' + (0.08 * netStress * nPulse) + ')');
                fGrd.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(checkX + 4, baseY, 12, 0, Math.PI * 2);
                ctx.fillStyle = fGrd; ctx.fill();
            } else {
                var chPulse = 0.6 + 0.25 * Math.sin(elapsed * 1.5 + i * 0.6);
                ctx.fillStyle = 'rgba(' + hcStr + ',' + (0.45 + 0.3 * chPulse) * holdFade + ')';
                ctx.fillText('\u2713', checkX, baseY);
                // Green halo behind healthy checkmark
                if (hookRecovery > 0.5) {
                    var chGrd = ctx.createRadialGradient(checkX + 4, baseY, 0, checkX + 4, baseY, 10);
                    chGrd.addColorStop(0, 'rgba(' + C('green','52,211,153') + ',' + (0.06 * chPulse * hookRecovery) + ')');
                    chGrd.addColorStop(1, 'transparent');
                    ctx.beginPath(); ctx.arc(checkX + 4, baseY, 10, 0, Math.PI * 2);
                    ctx.fillStyle = chGrd; ctx.fill();
                }
            }

            // Timing value
            var timingX = checkX + 18;
            var displayMs;
            if (hookRecovery > 0.5) {
                var recovBlend = Math.min(1, (hookRecovery - 0.5) * 2);
                displayMs = Math.round(hook.baseMs + (1 - recovBlend) * (200 - hook.baseMs));
                displayMs += Math.round(Math.sin(elapsed * 2.5 + i * 1.3) * 5);
            } else if (netStress < 0.3) {
                displayMs = hook.baseMs + Math.round(Math.sin(elapsed * 2.5 + i * 1.3) * 5);
            } else if (netStress < 0.6) {
                var climb = (netStress - 0.3) / 0.3;
                displayMs = Math.round(hook.baseMs + climb * (300 - hook.baseMs));
            } else {
                var climb2 = (netStress - 0.6) / 0.4;
                displayMs = Math.round(300 + climb2 * 700);
            }
            ctx.fillStyle = 'rgba(' + hcStr + ',' + (0.38 + 0.12 * nPulse) * holdFade + ')';
            ctx.fillText(displayMs + 'ms', timingX, baseY);

            // ---- Circuit breaker indicator ----
            if (isStressed && breakerAmt > 0 && recoveryAmt < 1) {
                var breakerX = timingX + 55;
                var bAlpha = breakerAmt * (1 - recoveryAmt * 0.5) * holdFade;
                var bPulse = 0.7 + 0.3 * Math.sin(elapsed * 4 + i);

                // "timeout: 10s" text
                ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + bAlpha * 0.65 + ')';
                ctx.fillText('timeout: 10s', breakerX, baseY);

                // Glowing breaker dot (node-style with halo)
                var dotX = breakerX - 10;
                var dotR = 3.5 * bPulse;
                var dotGlowR = dotR * 4;

                var dotGrd = ctx.createRadialGradient(dotX, baseY, 0, dotX, baseY, dotGlowR);
                dotGrd.addColorStop(0, 'rgba(' + C('green','52,211,153') + ',' + (0.2 * bAlpha * bPulse) + ')');
                dotGrd.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(dotX, baseY, dotGlowR, 0, Math.PI * 2);
                ctx.fillStyle = dotGrd; ctx.fill();

                ctx.beginPath(); ctx.arc(dotX, baseY, dotR, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + C('green','52,211,153') + ',' + (0.5 * bAlpha * bPulse) + ')';
                ctx.fill();
            }
        }

        requestAnimationFrame(animate);
    }
    animate();
}

// ========== Lazy initialization via IntersectionObserver ==========
var circuitDrawn = false;
var circuitObs = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
        if (!e.isIntersecting || circuitDrawn) return;
        circuitDrawn = true;
        drawCircuitCanvas();
    });
}, { threshold: 0.1 });
var circuitEl = document.getElementById('circuit-cvs');
if (circuitEl) circuitObs.observe(circuitEl);

})();
