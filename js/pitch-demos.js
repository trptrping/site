/* TRP Site — Pitch: Split Terminal Demos
   Two side-by-side terminals showing Current AI vs Transparent Box.
   Reads content from SITE.active so demos change with audience/language toggles. */

(function() {
    var fired1 = false, fired2 = false;

    function A() { return (window.SITE && window.SITE.active) || {}; }

    // Default content (tech/en fallback)
    var defaults = {
        "demo.gen1a": "Yes, the processPayment() function appears to be thread-safe. It handles concurrent access appropriately and should work correctly in a multi-threaded environment.",
        "demo.gen1b": [
            { text: "Checking processPayment() at " },
            { text: "line 142", cls: 'cite' },
            { text: "...\n\nMutex on " },
            { text: "line 145", cls: 'cite' },
            { text: " guards balance, but callback on " },
            { text: "line 168", cls: 'cite' },
            { text: " runs outside lock scope.\n\n" },
            { text: "\u26A0 NOT fully thread-safe.", cls: 'flag' },
            { text: "\nLock must extend to line 171." }
        ],
        "demo.gen2a": "Sure! Let me help you set up authentication for your Express app.\n\nFirst, install passport:\nnpm install passport passport-local\n\nThen create a config file...",
        "demo.gen2b": [
            { text: "Continuing from yesterday: you chose " },
            { text: "JWT over sessions", cls: 'cite' },
            { text: " (trace #847).\n\nAuth middleware exists at " },
            { text: "/middleware/auth.js", cls: 'cite' },
            { text: ".\n\nAdding " },
            { text: "refresh token rotation", cls: 'flag' },
            { text: " as discussed. Implementation:" }
        ]
    };

    function get(key) { return A()[key] || defaults[key]; }

    function runDemo1() {
        var el1a = document.getElementById('gen1a');
        var el1b = document.getElementById('gen1b');
        if (!el1a || !el1b) return;
        el1a.innerHTML = ''; el1b.innerHTML = '';
        el1a.classList.remove('off'); el1b.classList.remove('off');

        var c1 = typeInto(el1a, get("demo.gen1a"), 22, function() { c1.classList.add('off'); });
        setTimeout(function() {
            var c2 = typeRich(el1b, get("demo.gen1b"), 20, function() { c2.classList.add('off'); });
        }, 300);
    }

    function runDemo2() {
        var el2a = document.getElementById('gen2a');
        var el2b = document.getElementById('gen2b');
        if (!el2a || !el2b) return;
        el2a.innerHTML = ''; el2b.innerHTML = '';
        el2a.classList.remove('off'); el2b.classList.remove('off');

        var c1 = typeInto(el2a, get("demo.gen2a"), 20, function() { c1.classList.add('off'); });
        setTimeout(function() {
            var c2 = typeRich(el2b, get("demo.gen2b"), 22, function() { c2.classList.add('off'); });
        }, 300);
    }

    // Intersection observers — fire once on first scroll
    var d1Obs = new IntersectionObserver(function(es) {
        es.forEach(function(e) {
            if (!e.isIntersecting || fired1) return;
            fired1 = true;
            runDemo1();
        });
    }, { threshold: 0.2 });
    d1Obs.observe(document.getElementById('demo1'));

    var d2Obs = new IntersectionObserver(function(es) {
        es.forEach(function(e) {
            if (!e.isIntersecting || fired2) return;
            fired2 = true;
            runDemo2();
        });
    }, { threshold: 0.2 });
    d2Obs.observe(document.getElementById('demo2'));

    // On mode change, re-run demos immediately (content already visible)
    window.addEventListener('site-mode-change', function() {
        if (fired1) runDemo1();
        if (fired2) runDemo2();
    });
})();
