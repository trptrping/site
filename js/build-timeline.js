/* TRP Site — Build Log: Timeline Canvas
   Animated vertical flow with pulsing event nodes, connection arcs between
   causally related events, particle streams showing momentum, and ripple
   milestones. Lives behind/alongside the .tl section in build.html.

   Key events and their causal edges are hardcoded from the build history.
   Each node maps to a .tl-date in the HTML — the canvas is a visual overlay
   that brings the connections alive. */

(function() {

var cvs = document.getElementById('timeline-cvs');
if (!cvs) return;
var ctx = cvs.getContext('2d');
var parent = cvs.parentElement;

// ===== COLORS =====
var green, red, blue, amber, dim, purple;
function refreshColors() {
    green  = C('green','52,211,153');
    red    = C('red','239,68,68');
    blue   = C('blue','96,165,250');
    amber  = C('amber','245,158,11');
    dim    = C('dim','92,92,116');
    purple = C('purple','196,181,253');
}

// ===== EVENT DATA =====
// Each event corresponds to a date block in the timeline.
// y positions are calculated proportionally — 7 date markers across the height.
var EVENTS = [
    { id: 'feb4',  label: 'Feb 4',  sub: 'Origin',           color: 'green',  milestone: false, yFrac: 0.04 },
    { id: 'feb5',  label: 'Feb 5',  sub: 'ATLAS created',    color: 'green',  milestone: false, yFrac: 0.16 },
    { id: 'feb6',  label: 'Feb 6',  sub: 'LoRA training',    color: 'red',    milestone: false, yFrac: 0.28 },
    { id: 'feb7',  label: 'Feb 7',  sub: 'The experiment',   color: 'green',  milestone: true,  yFrac: 0.40 },
    { id: 'feb8',  label: 'Feb 8',  sub: 'Thesis + hooks',   color: 'amber',  milestone: false, yFrac: 0.54 },
    { id: 'feb9',  label: 'Feb 9',  sub: 'ATLAS split',      color: 'blue',   milestone: false, yFrac: 0.68 },
    { id: 'feb10', label: 'Feb 10', sub: 'Death + rebirth',  color: 'red',    milestone: true,  yFrac: 0.82 }
];

// Causal connections: [fromIndex, toIndex, type, color]
// type: 'enabled' (green), 'caused' (red/amber), 'fixed' (blue)
var EDGES = [
    // Feb 4 origin -> enabled map loop & ATLAS
    [0, 1, 'enabled',  'green'],
    // Feb 5 ATLAS -> caused monolith growth (silent break)
    [1, 2, 'caused',   'amber'],
    // Feb 6 attempts 1-4 broke, attempt 5 worked -> enabled thesis foundation
    [2, 3, 'enabled',  'green'],
    // Feb 7 experiment -> enabled thesis
    [3, 4, 'enabled',  'green'],
    // Feb 8 hooks without timeouts -> caused system death Feb 10
    [4, 6, 'caused',   'red'],
    // Feb 8 artist-architect -> expression (parallel to hooks)
    // Feb 9 ATLAS split fixes monolith
    [5, 1, 'fixed',    'blue'],
    // Feb 10 circuit breakers fix death
    [6, 4, 'fixed',    'blue']
];

// ===== PARTICLES (momentum stream flowing down the spine) =====
var PARTICLE_COUNT = 40;
var particles = [];
function initParticle(p) {
    p = p || {};
    p.progress = Math.random();
    p.speed = 0.001 + Math.random() * 0.003;
    p.xOff = (Math.random() - 0.5) * 16;
    p.size = 0.8 + Math.random() * 1.8;
    p.phase = Math.random() * Math.PI * 2;
    // Color category: mostly green, some amber, rare blue
    var r = Math.random();
    p.colorKey = r < 0.55 ? 'green' : r < 0.85 ? 'amber' : 'blue';
    return p;
}
for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(initParticle({}));
}

// ===== RIPPLE EFFECTS for milestones =====
var ripples = [];
function spawnRipple(x, y, colorKey) {
    ripples.push({ x: x, y: y, radius: 0, maxRadius: 60 + Math.random() * 40, speed: 0.4 + Math.random() * 0.3, colorKey: colorKey, alpha: 0.35 });
}

// ===== LAYOUT HELPERS =====
var w, h, spineX, padTop, padBottom, spineTop, spineBottom;

function recalcLayout() {
    var rect = parent.getBoundingClientRect();
    w = rect.width;
    h = rect.height || 800;
    cvs.width = w * 2;
    cvs.height = h * 2;
    ctx.scale(2, 2);
    spineX = 28;
    padTop = 20;
    padBottom = 20;
    spineTop = padTop;
    spineBottom = h - padBottom;
}

function eventY(evt) {
    return spineTop + evt.yFrac * (spineBottom - spineTop);
}

function colorStr(key) {
    switch(key) {
        case 'green':  return green;
        case 'red':    return red;
        case 'blue':   return blue;
        case 'amber':  return amber;
        case 'purple': return purple;
        default:       return dim;
    }
}

// ===== DRAW =====
var t = 0;
var lastRippleTick = 0;

function animate() {
    refreshColors();
    ctx.clearRect(0, 0, w, h);
    t += 0.014;

    var m = mouseInCanvas(parent);

    // --- Spine (vertical line) ---
    var spinePulse = 0.12 + 0.04 * Math.sin(t * 0.8);
    ctx.beginPath();
    ctx.moveTo(spineX, spineTop);
    ctx.lineTo(spineX, spineBottom);
    ctx.strokeStyle = 'rgba(' + dim + ',' + spinePulse + ')';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // --- Connection arcs (bezier curves between causally related events) ---
    for (var ei = 0; ei < EDGES.length; ei++) {
        var edge = EDGES[ei];
        var fromEvt = EVENTS[edge[0]];
        var toEvt   = EVENTS[edge[1]];
        var eType   = edge[2];
        var eColor  = colorStr(edge[3]);

        var y1 = eventY(fromEvt);
        var y2 = eventY(toEvt);
        var midY = (y1 + y2) / 2;

        // Arc bows to the right of the spine
        var arcDist = 30 + Math.abs(edge[1] - edge[0]) * 18;
        // Fixed arcs bow left for 'fixed' type (different visual channel)
        var arcX = eType === 'fixed' ? spineX - arcDist * 0.4 : spineX + arcDist;

        var edgePulse = 0.5 + 0.3 * Math.sin(t * 1.2 + ei * 1.1);
        var baseAlpha;
        if (eType === 'caused') baseAlpha = 0.18 + edgePulse * 0.12;
        else if (eType === 'fixed') baseAlpha = 0.14 + edgePulse * 0.10;
        else baseAlpha = 0.12 + edgePulse * 0.08;

        // Hover boost: if mouse is near the arc midpoint
        var arcMidX = arcX;
        var arcMidY = midY;
        var hoverBoost = 0;
        if (m.inside) {
            var hdx = m.x - arcMidX, hdy = m.y - arcMidY;
            var hd = Math.sqrt(hdx * hdx + hdy * hdy);
            if (hd < 80) hoverBoost = (1 - hd / 80) * 0.2;
        }

        ctx.beginPath();
        ctx.moveTo(spineX, y1);
        ctx.quadraticCurveTo(arcX, midY, spineX, y2);
        ctx.strokeStyle = 'rgba(' + eColor + ',' + (baseAlpha + hoverBoost) + ')';
        ctx.lineWidth = eType === 'caused' ? 1.8 : 1.2;
        ctx.stroke();

        // Traveling dot along the arc
        var dotProg = (t * 0.3 + ei * 0.4) % 1;
        var omt = 1 - dotProg;
        var dotX = omt * omt * spineX + 2 * omt * dotProg * arcX + dotProg * dotProg * spineX;
        var dotY = omt * omt * y1 + 2 * omt * dotProg * midY + dotProg * dotProg * y2;
        var dotAlpha = 0.3 + 0.4 * Math.sin(dotProg * Math.PI); // fade at endpoints
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2.0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + eColor + ',' + (dotAlpha + hoverBoost) + ')';
        ctx.fill();

        // Arrow head at destination
        var arrowAlpha = 0.25 + hoverBoost;
        var arrowSize = 4;
        // Direction: pointing into the toEvt node
        var arrAngle = eType === 'fixed' ? Math.PI * 0.5 : -Math.PI * 0.5;
        // Simple downward or upward arrow depending on direction
        if (y2 > y1) {
            // downward: arrow points down
            ctx.beginPath();
            ctx.moveTo(spineX, y2 - 2);
            ctx.lineTo(spineX - arrowSize, y2 - arrowSize - 2);
            ctx.moveTo(spineX, y2 - 2);
            ctx.lineTo(spineX + arrowSize, y2 - arrowSize - 2);
            ctx.strokeStyle = 'rgba(' + eColor + ',' + arrowAlpha + ')';
            ctx.lineWidth = 1.2;
            ctx.stroke();
        } else {
            // upward: arrow points up
            ctx.beginPath();
            ctx.moveTo(spineX, y2 + 2);
            ctx.lineTo(spineX - arrowSize, y2 + arrowSize + 2);
            ctx.moveTo(spineX, y2 + 2);
            ctx.lineTo(spineX + arrowSize, y2 + arrowSize + 2);
            ctx.strokeStyle = 'rgba(' + eColor + ',' + arrowAlpha + ')';
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }
    }

    // --- Momentum particles flowing down the spine ---
    for (var pi = 0; pi < particles.length; pi++) {
        var p = particles[pi];
        p.progress += p.speed;
        if (p.progress > 1) initParticle(p);

        var py = spineTop + p.progress * (spineBottom - spineTop);
        var drift = Math.sin(t * 2 + p.phase) * 3;
        var px = spineX + p.xOff + drift;
        var pPulse = 0.4 + 0.4 * Math.sin(t * 3 + p.phase);
        // Fade at top and bottom edges
        var fadeAlpha = 1;
        if (p.progress < 0.08) fadeAlpha = p.progress / 0.08;
        else if (p.progress > 0.92) fadeAlpha = (1 - p.progress) / 0.08;

        var pColor = colorStr(p.colorKey);
        ctx.beginPath();
        ctx.arc(px, py, p.size * (0.6 + pPulse * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + pColor + ',' + (0.08 + pPulse * 0.14) * fadeAlpha + ')';
        ctx.fill();
    }

    // --- Event nodes ---
    for (var ni = 0; ni < EVENTS.length; ni++) {
        var evt = EVENTS[ni];
        var ey = eventY(evt);
        var eCol = colorStr(evt.color);

        var nPulse = 0.6 + 0.4 * Math.sin(t * 1.2 + ni * 0.9);

        // Mouse proximity
        var nBoost = 0;
        if (m.inside) {
            var ndx = m.x - spineX, ndy = m.y - ey;
            var nd = Math.sqrt(ndx * ndx + ndy * ndy);
            if (nd < 100) nBoost = (1 - nd / 100) * 0.35;
        }

        var nodeR = evt.milestone ? 7 + nPulse * 2 : 5 + nPulse * 1;
        nodeR += nBoost * 4;

        // Outer glow halo
        var glowR = nodeR * 3.5;
        var glowAlpha = (evt.milestone ? 0.15 : 0.08) + nPulse * 0.06 + nBoost * 0.12;
        var grd = ctx.createRadialGradient(spineX, ey, 0, spineX, ey, glowR);
        grd.addColorStop(0, 'rgba(' + eCol + ',' + glowAlpha + ')');
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(spineX, ey, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Solid node
        ctx.beginPath();
        ctx.arc(spineX, ey, nodeR, 0, Math.PI * 2);
        var nodeAlpha = evt.milestone ? (0.55 + nPulse * 0.35 + nBoost * 0.1) : (0.4 + nPulse * 0.3 + nBoost * 0.15);
        ctx.fillStyle = 'rgba(' + eCol + ',' + nodeAlpha + ')';
        ctx.fill();

        // Inner bright core for milestones
        if (evt.milestone) {
            ctx.beginPath();
            ctx.arc(spineX, ey, nodeR * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + eCol + ',' + (0.7 + nPulse * 0.3) + ')';
            ctx.fill();
        }

        // Date label to the right of the spine
        var labelX = spineX + nodeR + 12;
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        var labelAlpha = 0.7 + nPulse * 0.15 + nBoost * 0.15;
        ctx.fillStyle = 'rgba(' + eCol + ',' + labelAlpha + ')';
        ctx.fillText(evt.label, labelX, ey - 7);

        // Sub-label
        ctx.font = '8px JetBrains Mono';
        var subAlpha = 0.4 + nPulse * 0.1 + nBoost * 0.15;
        ctx.fillStyle = 'rgba(' + eCol + ',' + subAlpha + ')';
        ctx.fillText(evt.sub, labelX, ey + 7);
    }

    // --- Milestone ripple effects ---
    // Spawn ripples periodically for milestone events
    if (t - lastRippleTick > 3.0) {
        lastRippleTick = t;
        for (var ri = 0; ri < EVENTS.length; ri++) {
            if (EVENTS[ri].milestone) {
                spawnRipple(spineX, eventY(EVENTS[ri]), EVENTS[ri].color);
            }
        }
    }

    // Draw and update ripples
    for (var rr = ripples.length - 1; rr >= 0; rr--) {
        var rip = ripples[rr];
        rip.radius += rip.speed;
        rip.alpha *= 0.985;
        if (rip.radius > rip.maxRadius || rip.alpha < 0.01) {
            ripples.splice(rr, 1);
            continue;
        }
        var rCol = colorStr(rip.colorKey);
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(' + rCol + ',' + rip.alpha + ')';
        ctx.lineWidth = 1.0;
        ctx.stroke();
    }

    if (!window.SITE.reduceMotion) {
        requestAnimationFrame(animate);
    }
}

// ===== STATIC RENDER (reduced motion) =====
function drawStatic() {
    refreshColors();
    ctx.clearRect(0, 0, w, h);

    // Spine
    ctx.beginPath();
    ctx.moveTo(spineX, spineTop);
    ctx.lineTo(spineX, spineBottom);
    ctx.strokeStyle = 'rgba(' + dim + ',0.15)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Edges
    for (var ei = 0; ei < EDGES.length; ei++) {
        var edge = EDGES[ei];
        var fromEvt = EVENTS[edge[0]];
        var toEvt   = EVENTS[edge[1]];
        var eType   = edge[2];
        var eColor  = colorStr(edge[3]);
        var y1 = eventY(fromEvt);
        var y2 = eventY(toEvt);
        var midY = (y1 + y2) / 2;
        var arcDist = 30 + Math.abs(edge[1] - edge[0]) * 18;
        var arcX = eType === 'fixed' ? spineX - arcDist * 0.4 : spineX + arcDist;

        ctx.beginPath();
        ctx.moveTo(spineX, y1);
        ctx.quadraticCurveTo(arcX, midY, spineX, y2);
        ctx.strokeStyle = 'rgba(' + eColor + ',0.18)';
        ctx.lineWidth = eType === 'caused' ? 1.8 : 1.2;
        ctx.stroke();
    }

    // Nodes
    for (var ni = 0; ni < EVENTS.length; ni++) {
        var evt = EVENTS[ni];
        var ey = eventY(evt);
        var eCol = colorStr(evt.color);
        var nodeR = evt.milestone ? 8 : 5;

        // Glow
        var grd = ctx.createRadialGradient(spineX, ey, 0, spineX, ey, nodeR * 3);
        grd.addColorStop(0, 'rgba(' + eCol + ',' + (evt.milestone ? 0.15 : 0.08) + ')');
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(spineX, ey, nodeR * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Solid
        ctx.beginPath();
        ctx.arc(spineX, ey, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + eCol + ',' + (evt.milestone ? 0.75 : 0.55) + ')';
        ctx.fill();

        // Labels
        var labelX = spineX + nodeR + 12;
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(' + eCol + ',0.75)';
        ctx.fillText(evt.label, labelX, ey - 7);
        ctx.font = '8px JetBrains Mono';
        ctx.fillStyle = 'rgba(' + eCol + ',0.45)';
        ctx.fillText(evt.sub, labelX, ey + 7);
    }
}

// ===== INIT =====
function init() {
    recalcLayout();
    if (window.SITE.reduceMotion) {
        drawStatic();
    } else {
        animate();
    }
}

// Lazy initialize when visible
var drawn = false;
var obs = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
        if (!e.isIntersecting || drawn) return;
        drawn = true;
        init();
    });
}, { threshold: 0.05 });
obs.observe(parent);

})();
