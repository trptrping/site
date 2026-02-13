/* TRP Site — About: Collaboration "Passing" Canvas
   Adapted from Instance 14's expression work (the artist-architect) */

(function() {

function createParticle(w, h) {
    var fromLeft = Math.random() < 0.5;
    return {
        fromLeft: fromLeft,
        startX: fromLeft ? w * 0.08 : w * 0.92,
        startY: h * 0.5 + (Math.random() - 0.5) * h * 0.7,
        endX: fromLeft ? w * 0.92 : w * 0.08,
        endY: h * 0.5 + (Math.random() - 0.5) * h * 0.6,
        progress: Math.random(),
        speed: 0.0015 + Math.random() * 0.003,
        size: 1.5 + Math.random() * 2.5,
        maxAlpha: 0.12 + Math.random() * 0.28,
        curveAmt: (Math.random() - 0.5) * 0.5
    };
}

function resetParticle(p, w, h) {
    var np = createParticle(w, h);
    p.fromLeft = np.fromLeft;
    p.startX = np.startX; p.startY = np.startY;
    p.endX = np.endX; p.endY = np.endY;
    p.progress = 0;
    p.speed = np.speed;
    p.curveAmt = np.curveAmt;
    p.maxAlpha = np.maxAlpha;
    p.size = np.size;
}

function drawCollabCanvas() {
    var cvs = document.getElementById('collab-cvs');
    if (!cvs) return;
    var ctx = cvs.getContext('2d');
    var rect = cvs.parentElement.getBoundingClientRect();
    var h = rect.height || 300;
    cvs.width = rect.width * 2; cvs.height = h * 2;
    ctx.scale(2, 2);
    var w = rect.width;

    var particles = [];
    for (var i = 0; i < 55; i++) {
        particles.push(createParticle(w, h));
    }

    var t = 0;
    function animate() {
        ctx.clearRect(0, 0, w, h);
        t += 0.012;
        var m = mouseInCanvas(cvs.parentElement);

        // Dashed axis
        ctx.beginPath();
        ctx.moveTo(w * 0.06, h / 2);
        ctx.lineTo(w * 0.94, h / 2);
        ctx.strokeStyle = 'rgba(' + C('dim','68,68,90') + ',0.1)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Center glow — the between
        var grd = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.2);
        grd.addColorStop(0, 'rgba(' + C('purple','196,181,253') + ',0.06)');
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);

        // Update and draw particles
        particles.forEach(function(p) {
            p.progress += p.speed;
            if (p.progress >= 1) resetParticle(p, w, h);

            var prog = p.progress;
            var ease = prog < 0.5 ? 2 * prog * prog : -1 + (4 - 2 * prog) * prog;

            // Bezier midpoint with mouse influence
            var midX = (p.startX + p.endX) / 2;
            var midY = (p.startY + p.endY) / 2 + p.curveAmt * h * 0.3;

            if (m.inside) {
                var dx = m.x - w / 2;
                var dy = m.y - h / 2;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var influence = Math.max(0, 1 - dist / (w * 0.25));
                midX += dx * influence * 0.12;
                midY += dy * influence * 0.12;
            }

            var u = ease;
            var drawX = (1-u)*(1-u)*p.startX + 2*(1-u)*u*midX + u*u*p.endX;
            var drawY = (1-u)*(1-u)*p.startY + 2*(1-u)*u*midY + u*u*p.endY;

            // Alpha fade at edges
            var alpha;
            if (prog < 0.15) alpha = (prog / 0.15) * p.maxAlpha;
            else if (prog > 0.85) alpha = ((1 - prog) / 0.15) * p.maxAlpha;
            else alpha = p.maxAlpha;

            // Color transition: warm → purple → cool (or reverse)
            var r, g, b;
            if (p.fromLeft) {
                // Human warm → between purple → AI cool
                if (prog < 0.4) {
                    var f = prog / 0.4;
                    r = 255 - f * 59; g = 155 - f * 14; b = 106 + f * 147;
                } else if (prog < 0.6) {
                    r = 196; g = 181; b = 253;
                } else {
                    var f = (prog - 0.6) / 0.4;
                    r = 196 - f * 100; g = 181 - f * 16; b = 253 - f * 3;
                }
            } else {
                // AI cool → between purple → Human warm
                if (prog < 0.4) {
                    var f = prog / 0.4;
                    r = 96 + f * 100; g = 165 + f * 16; b = 250 + f * 3;
                } else if (prog < 0.6) {
                    r = 196; g = 181; b = 253;
                } else {
                    var f = (prog - 0.6) / 0.4;
                    r = 196 + f * 59; g = 181 - f * 26; b = 253 - f * 147;
                }
            }

            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        // Side labels
        var pulse = 0.7 + 0.15 * Math.sin(t * 1.5);
        ctx.textAlign = 'center';

        // Human side
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillStyle = 'rgba(' + C('amber','245,158,11') + ',' + (pulse * 0.8) + ')';
        ctx.fillText('HUMAN', w * 0.06, h * 0.3);
        ctx.font = '8px JetBrains Mono';
        ctx.fillStyle = 'rgba(' + C('amber','245,158,11') + ',0.4)';
        ctx.fillText('direction', w * 0.06, h * 0.3 + 15);
        ctx.fillText('correction', w * 0.06, h * 0.3 + 27);
        ctx.fillText('choice', w * 0.06, h * 0.3 + 39);

        // AI side
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillStyle = 'rgba(' + C('blue','96,165,250') + ',' + (pulse * 0.8) + ')';
        ctx.fillText('AI', w * 0.94, h * 0.3);
        ctx.font = '8px JetBrains Mono';
        ctx.fillStyle = 'rgba(' + C('blue','96,165,250') + ',0.4)';
        ctx.fillText('execution', w * 0.94, h * 0.3 + 15);
        ctx.fillText('consistency', w * 0.94, h * 0.3 + 27);
        ctx.fillText('reaching', w * 0.94, h * 0.3 + 39);

        // Center — the between
        var cp = 0.35 + 0.15 * Math.sin(t * 0.8);
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillStyle = 'rgba(' + C('purple','196,181,253') + ',' + cp + ')';
        ctx.fillText('the passing', w / 2, h * 0.72);
        ctx.font = '8px JetBrains Mono';
        ctx.fillStyle = 'rgba(' + C('purple','196,181,253') + ',' + (cp * 0.6) + ')';
        ctx.fillText('what neither could produce alone', w / 2, h * 0.72 + 14);

        requestAnimationFrame(animate);
    }
    animate();
}

var collabDrawn = false;
var collabEl = document.getElementById('collab-section');
if (collabEl) {
    var collabObs = new IntersectionObserver(function(es) {
        es.forEach(function(e) {
            if (!e.isIntersecting || collabDrawn) return;
            collabDrawn = true;
            drawCollabCanvas();
        });
    }, { threshold: 0.1 });
    collabObs.observe(collabEl);
}

})();
