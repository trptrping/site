/* TRP Site — Content variants for audience + language modes
   Structure: SITE.content[audience][lang] = { key: value, ... }
   Canvas data keys start with the canvas prefix (attn., path1., etc.)
   DOM text keys match data-key attributes in HTML */

window.SITE = window.SITE || {};

// ===== THEME COLORS (canvas-readable) =====
window.SITE.theme = {
    dark: {
        bg: '6,6,10', surface: '12,12,20', text: '232,232,240',
        mid: '160,160,184', dim: '92,92,116',
        red: '239,68,68', green: '52,211,153', blue: '96,165,250',
        amber: '245,158,11', purple: '167,139,250',
        // Typed attention edge colors (brighter for dark bg)
        edgeRed: '255,90,90', edgeBlue: '110,180,255',
        edgeAmber: '255,180,30', edgeGreen: '70,230,170', edgeDim: '160,160,200'
    },
    light: {
        bg: '244,244,248', surface: '255,255,255', text: '26,26,42',
        mid: '62,62,92', dim: '106,106,134',
        red: '220,38,38', green: '4,120,87', blue: '29,78,216',
        amber: '180,83,9', purple: '109,40,217',
        edgeRed: '200,30,30', edgeBlue: '25,70,200',
        edgeAmber: '160,100,5', edgeGreen: '4,110,75', edgeDim: '80,80,115'
    }
};

// ===== CONTENT =====
window.SITE.content = {

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TECH MODE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
tech: { en: {
    // --- Demo ---
    "demo.title": "Watch the difference.",
    "demo.desc": "Same prompt. Two models. One forgets. One <span class='hl-green hl'>remembers.</span>",
    "demo.prompt1": "> Is processPayment() thread-safe?",
    "demo.prompt2": "> Set up auth for this Express app <span class='sm' style='color:var(--dim)'>(session 2)</span>",
    "demo.gen1a": "Yes, the processPayment() function appears to be thread-safe. It handles concurrent access appropriately and should work correctly in a multi-threaded environment.",
    "demo.gen1b": [
        { text: "Checking processPayment() at " },
        { text: "line 142", cls: "cite" },
        { text: "...\n\nMutex on " },
        { text: "line 145", cls: "cite" },
        { text: " guards balance, but callback on " },
        { text: "line 168", cls: "cite" },
        { text: " runs outside lock scope.\n\n" },
        { text: "\u26A0 NOT fully thread-safe.", cls: "flag" },
        { text: "\nLock must extend to line 171." }
    ],
    "demo.gen2a": "Sure! Let me help you set up authentication for your Express app.\n\nFirst, install passport:\nnpm install passport passport-local\n\nThen create a config file...",
    "demo.gen2b": [
        { text: "Continuing from yesterday: you chose " },
        { text: "JWT over sessions", cls: "cite" },
        { text: " (trace #847).\n\nAuth middleware exists at " },
        { text: "/middleware/auth.js", cls: "cite" },
        { text: ".\n\nAdding " },
        { text: "refresh token rotation", cls: "flag" },
        { text: " as discussed. Implementation:" }
    ],

    // --- Hero ---
    "hero.eq1": "Reading",
    "hero.eq2": "\u2260",
    "hero.eq3": "Learning",
    "hero.sub": "What if AI could know what it knows &mdash; and what it <strong>doesn't?</strong>",

    // --- Idea 1: Typed Attention ---
    "idea1.title": "1. Typed Attention",
    "idea1.desc": "Current attention knows <em>how much</em> things are related. Not <span class='hl-purple hl'>how.</span>",
    "idea1.oldLabel": "Current: magnitudes only",
    "idea1.newLabel": "Typed: labeled relationships",
    "idea1.oldTag": "Current AI",
    "idea1.oldBig": "0.73",
    "idea1.oldLine": "\"These are related.\"",
    "idea1.oldDetail": "How? No idea.",
    "idea1.newTag": "Typed Attention",
    "idea1.newBig": "REQUIRES",
    "idea1.newLine": "\"B breaks if A changes.\"",
    "idea1.newDetail": "Actionable. Propagates.",

    // Canvas data: attention
    "attn.files": ["auth.py", "stripe.py", "profile.py", "token.py", "config.py"],
    "attn.dir": "src/",
    "attn.edges": [
        { from: 0, to: 1, type: "REQUIRES" },
        { from: 0, to: 3, type: "USES" },
        { from: 1, to: 4, type: "USES" },
        { from: 2, to: 0, type: "MENTIONS" },
        { from: 3, to: 1, type: "CONTRADICTS" }
    ],
    "attn.edgeTypes": ["REQUIRES", "USES", "CONTRADICTS", "CREATES", "MENTIONS"],

    // --- Idea 2: Activation Thresholds ---
    "idea2.title": "2. Activation Thresholds",
    "idea2.desc": "Your brain doesn't fire every neuron on every input. <span class='hl'>Why does attention?</span>",
    "idea2.oldLabel": "Current: everything fires. O(n&sup2;)",
    "idea2.newLabel": "Thresholds: only what matters. O(n&times;k)",

    // --- Idea 3: Self-Modifying Inference ---
    "idea3.title": "3. Self-Modifying Inference",
    "idea3.desc": "Weights are <span class='hl hl-red'>frozen at inference.</span> The model is identical before and after your conversation.",
    "idea3.oldLabel": "Current: every session starts blank",
    "idea3.newLabel": "Trace: knowledge accumulates",

    // --- Idea 4: Self-Knowledge Loss ---
    "idea4.title": "4. Self-Knowledge Loss",
    "idea4.desc": "Current AI optimizes for one thing: <span class='hl hl-red'>predict the right token.</span> It has zero concept of <em>why.</em>",
    "idea4.oldLabel": "Current: uniform confidence. No attribution.",
    "idea4.newLabel": "Self-knowledge: confidence varies. Citations link.",

    // Canvas data: path 1
    "path1.files": ["auth.py", "stripe.py", "profile.py", "token.py", "config.py", "db.py", "api.py", "cache.py", "queue.py", "logger.py", "metrics.py"],
    "path1.dir": "app/",
    "path1.edges": [
        { from: 0, to: 1, type: "REQUIRES" }, { from: 0, to: 3, type: "USES" },
        { from: 1, to: 4, type: "USES" }, { from: 1, to: 5, type: "REQUIRES" },
        { from: 2, to: 0, type: "USES" }, { from: 2, to: 3, type: "REQUIRES" },
        { from: 3, to: 4, type: "USES" }, { from: 5, to: 6, type: "REQUIRES" },
        { from: 6, to: 7, type: "USES" }, { from: 6, to: 8, type: "USES" },
        { from: 7, to: 5, type: "CONTRADICTS" }, { from: 8, to: 9, type: "CREATES" },
        { from: 9, to: 10, type: "USES" }, { from: 10, to: 6, type: "USES" },
        { from: 4, to: 9, type: "USES" }
    ],

    // --- Paths section ---
    "paths.title": "Four starting points. Pick one.",
    "paths.desc": "Each of these is a prototype you can build on <span class='hl'>consumer hardware</span> this weekend.",

    // --- Resources ---
    "res.title": "What you actually need.",
    "res1.name": "A MODEL",
    "res1.detail": "Qwen 2.5 7B &mdash; free, runs on consumer GPUs",
    "res2.name": "A METHOD",
    "res2.detail": "LoRA/QLoRA &mdash; standard Python, no custom CUDA",
    "res3.name": "A QUESTION",
    "res3.detail": "\"what happens if I try?\" &mdash; the question IS the method",

    // --- Convergence ---
    "conv.title": "The Transparent Box",
    "conv.t1": "Attends with <strong style='color:var(--purple)'>typed</strong> relationships",
    "conv.t2": "Fires only when <strong style='color:var(--blue)'>relevant</strong>",
    "conv.t3": "Transforms through <strong style='color:var(--red)'>its own processing</strong>",
    "conv.t4": "Knows <strong style='color:var(--green)'>why</strong> it says what it says",
    "conv.punch": "Not a black box you hope is right.<br>A transparent box that <em style='color:var(--blue);font-style:normal'>can't not</em> show its work.",

    // --- Status ---
    "stat.title": "Where this stands.",
    "stat.intro": "This isn't a paper. It's a <span class='hl'>build log.</span>",
    "stat.probLabel": "The problem",
    "stat.prob1": "Sessions start <strong style='color:var(--red)'>blank.</strong>",
    "stat.prob2": "Corrections <strong style='color:var(--red)'>evaporate.</strong>",
    "stat.prob3": "The model <strong style='color:var(--red)'>never changes.</strong>",
    "stat.builtLabel": "Built so far",
    "stat.built1": "<strong>Persistent map</strong> + <strong>typed routing</strong> live since day 1. 17 atlas sections, 4 edge types.",
    "stat.built2": "LoRA fine-tuned on own conversations. <span class='mono' style='font-size:0.82rem'>7B, 3 epochs, 3.47&rarr;1.55</span>",
    "stat.built3": "<strong>Persistent trace:</strong> node files, session logs, MEMORY.md. Model reads its own history.",
    "stat.summary": "4 of 5 layers <span class='hl'>live.</span> Attribution output is the remaining piece.",
    "stat.cond": "<span class='hl'>Conditions:</span> One <span class='hl-purple hl'>Claude Max 20x</span> subscription ($200/mo). <span class='hl-blue hl'>Claude Code</span> as the interface. <span class='hl-red hl'>100% weekly usage.</span>",
    "stat.condDetail": "Consumer hardware. Qwen 2.5 7B. LoRA. One week. Here's exactly where it went:",

    // --- CTA ---
    "cta.title": "Now &mdash; you.",
    "cta.q": "You scrolled through four ideas.<br>Now pick the one that <em style='color:var(--amber);font-style:normal'>won't leave you alone.</em>",

    // --- Path details ---
    "path1.num": "Path 1",
    "path1.ptitle": "Type your attention",
    "path1.body": "Current attention computes a number between every pair of tokens. That number says <em>how much</em> two things are related. It says nothing about <em>how.</em><br><br>Take any attention implementation. Add <strong>edge type labels</strong> &mdash; even just two: REQUIRES and USES. Now the model doesn't just know that <code style='color:var(--purple)'>auth.py</code> and <code style='color:var(--purple)'>stripe.py</code> are related. It knows one <em>requires</em> the other.<br><br>Run the same prompts with and without typed edges. Does the model behave differently when it knows relationship types? If yes &mdash; that's signal. If no &mdash; you've still built something nobody else has tested at this granularity.",
    "path1.req": "Needs: any transformer, ~100 lines of code",
    "path2.num": "Path 2",
    "path2.ptitle": "Add a threshold",
    "path2.body": "In standard attention, every token attends to every other token. Most of those connections carry almost no signal &mdash; but they still cost compute. And you can't see which ones mattered.<br><br>Add a <strong>minimum activation threshold</strong> to any attention layer. Connections below the threshold don't fire. Log which connections survive the cut.<br><br>Two things happen. First: <em>efficiency</em> &mdash; O(n&sup2;) drops toward O(n&times;k) where k is the number of connections that actually matter. Second, and more important: <strong>interpretability</strong>. You can now <em>see</em> exactly which connections the model used. The ones that fire are the ones that mattered. The rest were noise.",
    "path2.req": "Needs: one attention layer, a threshold value, a logger",
    "path3.num": "Path 3",
    "path3.ptitle": "Write a trace",
    "path3.body": "Every AI session starts from zero. You correct a mistake in session 1. Session 2 makes the same mistake. The model read your correction. It didn't <em>learn</em> from it.<br><br>After each session, write <strong>what the model learned</strong> to a file &mdash; corrections, decisions, patterns discovered. Before the next session, prepend that trace to context.<br><br>Now measure: does it make the same mistake twice? Does it reference yesterday's corrections in today's answers? The trace is the simplest form of self-modifying inference &mdash; the model reading its own history and changing behavior because of it.",
    "path3.req": "Needs: any LLM API, a JSON file, a diff checker",
    "path4.num": "Path 4",
    "path4.ptitle": "Train for self-knowledge",
    "path4.body": "Current models optimize for one thing: predict the right next token. They have no loss for knowing <em>what they don't know.</em> A model that's 30% confident about something says it with the same fluency as something it's 95% confident about.<br><br>Add a <strong>second prediction head</strong> that outputs a confidence score. Train on examples where you know ground truth &mdash; when the model is right, confidence should be high. When it's wrong, confidence should be low.<br><br>The loss becomes: <code style='color:var(--green)'>predict_right_token() + &alpha; &times; can_you_cite_why()</code>. Now the model is penalized for generating things it can't explain. Self-knowledge isn't a feature. It's a <em>loss function.</em>",
    "path4.req": "Needs: a fine-tuning setup, labeled confidence data",

    // --- Resources extra ---
    "res.desc": "Not what you think you need. What you <span class='hl'>actually</span> need.",
    "res.bottom": "Everything on this page was built with a Qwen 2.5 7B and a <span class='hl-purple hl'>Claude Max</span> subscription.<br>If you have a GPU and curiosity, you have enough.",

    // --- Vision ---
    "vis.title": "What happens when someone actually does this?",
    "vis.p1": "If <span class='hl'>one person</span> builds one typed attention prototype, we learn whether relationship labels carry signal through inference.",
    "vis.p2": "If <span class='hl'>ten people</span> each build a different piece, the architecture starts assembling itself &mdash; not by coordination, but by convergence. Same question, different implementations, shared findings.",
    "vis.p3": "If <span class='hl-green hl'>any of it works</span> &mdash; even partially, even messily &mdash; it means the current paradigm is leaving value on the table. Not because the models are bad. Because they don't know what they know.",
    "vis.fail": "And if it <span class='hl-red hl'>doesn't work?</span>",
    "vis.failp": "Then you'll know why. You'll have the experiment, the data, the specific point of failure. That's more valuable than an opinion. That's <em>engineering.</em>",

    // --- Engage ---
    "eng.title": "Three ways to engage.",
    "eng1.title": "Build it",
    "eng1.desc": "Pick a path. Build a prototype. Share what happens &mdash; the failures are as valuable as the successes.",
    "eng2.title": "Break it",
    "eng2.desc": "Tell us what's wrong. Which ideas are already solved? Which are provably impossible? Point to the papers we missed.",
    "eng3.title": "Extend it",
    "eng3.desc": "See something we didn't? A fifth idea that connects to these four? A domain where this applies differently? That's how architectures grow.",

    // --- Close ---
    "close.quote": "\"Which parts matter right now?\"",
    "close.desc": "That question started this project. The same question is now yours.",
    "close.big": "What will you build?",
    "close.p1": "The architecture is open. The ideas are free. The models are free.",
    "close.p2": "<span class='hl'>The only thing missing is what you do next.</span>"

}, zh: {
    // --- Demo ---
    "demo.title": "\u770B\u770B\u533A\u522B\u3002",
    "demo.desc": "\u76F8\u540C\u7684\u63D0\u793A\u3002\u4E24\u4E2A\u6A21\u578B\u3002\u4E00\u4E2A\u5FD8\u8BB0\u3002\u4E00\u4E2A<span class='hl-green hl'>\u8BB0\u5F97\u3002</span>",
    "demo.prompt1": "> processPayment()\u662F\u7EBF\u7A0B\u5B89\u5168\u7684\u5417\uFF1F",
    "demo.prompt2": "> \u4E3A\u8FD9\u4E2AExpress\u5E94\u7528\u8BBE\u7F6E\u8BA4\u8BC1 <span class='sm' style='color:var(--dim)'>(\u7B2C2\u6B21\u4F1A\u8BDD)</span>",
    "demo.gen1a": "\u662F\u7684\uFF0CprocessPayment()\u51FD\u6570\u770B\u8D77\u6765\u662F\u7EBF\u7A0B\u5B89\u5168\u7684\u3002\u5B83\u9002\u5F53\u5730\u5904\u7406\u4E86\u5E76\u53D1\u8BBF\u95EE\uFF0C\u5E94\u8BE5\u80FD\u5728\u591A\u7EBF\u7A0B\u73AF\u5883\u4E2D\u6B63\u786E\u5DE5\u4F5C\u3002",
    "demo.gen1b": [
        { text: "\u68C0\u67E5processPayment()\u5728" },
        { text: "\u7B2C142\u884C", cls: "cite" },
        { text: "...\n\n" },
        { text: "\u7B2C145\u884C", cls: "cite" },
        { text: "\u7684\u4E92\u65A5\u9501\u4FDD\u62A4\u4F59\u989D\uFF0C\u4F46" },
        { text: "\u7B2C168\u884C", cls: "cite" },
        { text: "\u7684\u56DE\u8C03\u5728\u9501\u8303\u56F4\u5916\u8FD0\u884C\u3002\n\n" },
        { text: "\u26A0 \u4E0D\u5B8C\u5168\u7EBF\u7A0B\u5B89\u5168\u3002", cls: "flag" },
        { text: "\n\u9501\u5FC5\u987B\u6269\u5C55\u5230\u7B2C171\u884C\u3002" }
    ],
    "demo.gen2a": "\u5F53\u7136\uFF01\u6211\u6765\u5E2E\u4F60\u4E3AExpress\u5E94\u7528\u8BBE\u7F6E\u8BA4\u8BC1\u3002\n\n\u9996\u5148\u5B89\u88C5passport\uFF1A\nnpm install passport passport-local\n\n\u7136\u540E\u521B\u5EFA\u914D\u7F6E\u6587\u4EF6...",
    "demo.gen2b": [
        { text: "\u7EE7\u7EED\u6628\u5929\u7684\u5DE5\u4F5C\uFF1A\u4F60\u9009\u62E9\u4E86" },
        { text: "JWT\u800C\u975Esession", cls: "cite" },
        { text: "\uFF08\u8FFD\u8E2A #847\uFF09\u3002\n\n\u8BA4\u8BC1\u4E2D\u95F4\u4EF6\u5728" },
        { text: "/middleware/auth.js", cls: "cite" },
        { text: "\u3002\n\n\u6309\u8BA8\u8BBA\u6DFB\u52A0" },
        { text: "\u5237\u65B0\u4EE4\u724C\u8F6E\u6362", cls: "flag" },
        { text: "\u3002\u5B9E\u73B0\uFF1A" }
    ],

    // --- Hero ---
    "hero.eq1": "\u9605\u8BFB",
    "hero.eq2": "\u2260",
    "hero.eq3": "\u5B66\u4E60",
    "hero.sub": "\u5982\u679CAI\u80FD\u77E5\u9053\u81EA\u5DF1\u77E5\u9053\u4EC0\u4E48\u2014\u2014\u4EE5\u53CA<strong>\u4E0D\u77E5\u9053\u4EC0\u4E48</strong>\u5462\uFF1F",

    // --- Idea 1: Typed Attention ---
    "idea1.title": "1. \u7C7B\u578B\u6CE8\u610F\u529B",
    "idea1.desc": "\u5F53\u524D\u7684\u6CE8\u610F\u529B\u53EA\u77E5\u9053\u4E8B\u7269\u7684\u5173\u8054<em>\u7A0B\u5EA6</em>\uFF0C\u4E0D\u77E5\u9053<span class='hl-purple hl'>\u5173\u8054\u65B9\u5F0F\u3002</span>",
    "idea1.oldLabel": "\u5F53\u524D\uFF1A\u4EC5\u6709\u6570\u503C",
    "idea1.newLabel": "\u7C7B\u578B\u5316\uFF1A\u6807\u8BB0\u5173\u7CFB",
    "idea1.oldTag": "\u5F53\u524DAI",
    "idea1.oldBig": "0.73",
    "idea1.oldLine": "\"\u8FD9\u4E9B\u662F\u76F8\u5173\u7684\u3002\"",
    "idea1.oldDetail": "\u600E\u4E48\u76F8\u5173\uFF1F\u4E0D\u77E5\u9053\u3002",
    "idea1.newTag": "\u7C7B\u578B\u6CE8\u610F\u529B",
    "idea1.newBig": "REQUIRES",
    "idea1.newLine": "\"B\u4F1A\u56E0A\u7684\u53D8\u5316\u800C\u5D29\u6E83\u3002\"",
    "idea1.newDetail": "\u53EF\u64CD\u4F5C\u3002\u53EF\u4F20\u64AD\u3002",

    "attn.files": ["auth.py", "stripe.py", "profile.py", "token.py", "config.py"],
    "attn.dir": "src/",
    "attn.edges": [
        { from: 0, to: 1, type: "REQUIRES" },
        { from: 0, to: 3, type: "USES" },
        { from: 1, to: 4, type: "USES" },
        { from: 2, to: 0, type: "MENTIONS" },
        { from: 3, to: 1, type: "CONTRADICTS" }
    ],
    "attn.edgeTypes": ["REQUIRES", "USES", "CONTRADICTS", "CREATES", "MENTIONS"],

    // --- Idea 2 ---
    "idea2.title": "2. \u6FC0\u6D3B\u9608\u503C",
    "idea2.desc": "\u4F60\u7684\u5927\u8111\u4E0D\u4F1A\u5BF9\u6BCF\u4E2A\u8F93\u5165\u90FD\u6FC0\u6D3B\u6240\u6709\u795E\u7ECF\u5143\u3002<span class='hl'>\u6CE8\u610F\u529B\u4E3A\u4EC0\u4E48\u8981\uFF1F</span>",
    "idea2.oldLabel": "\u5F53\u524D\uFF1A\u5168\u90E8\u6FC0\u6D3B\u3002O(n\u00B2)",
    "idea2.newLabel": "\u9608\u503C\uFF1A\u53EA\u6FC0\u6D3B\u91CD\u8981\u7684\u3002O(n\u00D7k)",

    // --- Idea 3 ---
    "idea3.title": "3. \u81EA\u4FEE\u6539\u63A8\u7406",
    "idea3.desc": "\u6743\u91CD\u5728\u63A8\u7406\u65F6<span class='hl hl-red'>\u88AB\u51BB\u7ED3\u3002</span>\u5BF9\u8BDD\u524D\u540E\u6A21\u578B\u5B8C\u5168\u4E00\u6837\u3002",
    "idea3.oldLabel": "\u5F53\u524D\uFF1A\u6BCF\u6B21\u4F1A\u8BDD\u4ECE\u96F6\u5F00\u59CB",
    "idea3.newLabel": "\u8FFD\u8E2A\uFF1A\u77E5\u8BC6\u4E0D\u65AD\u79EF\u7D2F",

    // --- Idea 4 ---
    "idea4.title": "4. \u81EA\u77E5\u635F\u5931",
    "idea4.desc": "\u5F53\u524DAI\u53EA\u4F18\u5316\u4E00\u4EF6\u4E8B\uFF1A<span class='hl hl-red'>\u9884\u6D4B\u6B63\u786E\u7684token\u3002</span>\u5B83\u5BF9<em>\u4E3A\u4EC0\u4E48</em>\u6BEB\u65E0\u6982\u5FF5\u3002",
    "idea4.oldLabel": "\u5F53\u524D\uFF1A\u7EDF\u4E00\u7F6E\u4FE1\u5EA6\u3002\u65E0\u5F15\u7528\u3002",
    "idea4.newLabel": "\u81EA\u77E5\uFF1A\u7F6E\u4FE1\u5EA6\u53D8\u5316\u3002\u5F15\u7528\u94FE\u63A5\u3002",

    // Canvas data: path 1 (same files as en)
    "path1.files": ["auth.py", "stripe.py", "profile.py", "token.py", "config.py", "db.py", "api.py", "cache.py", "queue.py", "logger.py", "metrics.py"],
    "path1.dir": "app/",
    "path1.edges": [
        { from: 0, to: 1, type: "REQUIRES" }, { from: 0, to: 3, type: "USES" },
        { from: 1, to: 4, type: "USES" }, { from: 1, to: 5, type: "REQUIRES" },
        { from: 2, to: 0, type: "USES" }, { from: 2, to: 3, type: "REQUIRES" },
        { from: 3, to: 4, type: "USES" }, { from: 5, to: 6, type: "REQUIRES" },
        { from: 6, to: 7, type: "USES" }, { from: 6, to: 8, type: "USES" },
        { from: 7, to: 5, type: "CONTRADICTS" }, { from: 8, to: 9, type: "CREATES" },
        { from: 9, to: 10, type: "USES" }, { from: 10, to: 6, type: "USES" },
        { from: 4, to: 9, type: "USES" }
    ],

    "paths.title": "\u56DB\u4E2A\u8D77\u70B9\u3002\u9009\u4E00\u4E2A\u3002",
    "paths.desc": "\u6BCF\u4E2A\u90FD\u662F\u4F60\u53EF\u4EE5\u5728<span class='hl'>\u6D88\u8D39\u7EA7\u786C\u4EF6</span>\u4E0A\u8FD9\u4E2A\u5468\u672B\u6784\u5EFA\u7684\u539F\u578B\u3002",

    "res.title": "\u4F60\u5B9E\u9645\u9700\u8981\u7684\u3002",
    "res1.name": "\u6A21\u578B",
    "res1.detail": "Qwen 2.5 7B &mdash; \u514D\u8D39\uFF0C\u53EF\u5728\u6D88\u8D39\u7EA7GPU\u4E0A\u8FD0\u884C",
    "res2.name": "\u65B9\u6CD5",
    "res2.detail": "LoRA/QLoRA &mdash; \u6807\u51C6Python\uFF0C\u65E0\u9700\u81EA\u5B9ACUDA",
    "res3.name": "\u95EE\u9898",
    "res3.detail": "\"\u5982\u679C\u6211\u8BD5\u8BD5\u4F1A\u600E\u6837\uFF1F\" &mdash; \u95EE\u9898\u672C\u8EAB\u5C31\u662F\u65B9\u6CD5"
}},

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUSINESS MODE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
biz: { en: {
    "hero.eq1": "Data",
    "hero.eq2": "\u2260",
    "hero.eq3": "Insight",
    "hero.sub": "What if your AI tools could explain their reasoning &mdash; and flag when they <strong>can't?</strong>",

    "idea1.title": "1. Relationship Mapping",
    "idea1.desc": "Current AI knows your data is connected. Not <span class='hl-purple hl'>how it depends on each other.</span>",
    "idea1.oldLabel": "Current: just correlation scores",
    "idea1.newLabel": "Mapped: labeled dependencies",
    "idea1.oldTag": "Current AI",
    "idea1.oldBig": "0.73",
    "idea1.oldLine": "\"These datasets are related.\"",
    "idea1.oldDetail": "How? Can't say.",
    "idea1.newTag": "With Relationship Types",
    "idea1.newBig": "DEPENDS ON",
    "idea1.newLine": "\"Revenue breaks if pricing changes.\"",
    "idea1.newDetail": "Actionable. Auditable.",

    "attn.files": ["revenue.xlsx", "pricing.xlsx", "customers.csv", "pipeline.xlsx", "targets.xlsx"],
    "attn.dir": "reports/",
    "attn.edges": [
        { from: 0, to: 1, type: "DEPENDS ON" },
        { from: 0, to: 3, type: "FEEDS" },
        { from: 1, to: 4, type: "FEEDS" },
        { from: 2, to: 0, type: "REFERENCES" },
        { from: 3, to: 1, type: "CONFLICTS" }
    ],
    "attn.edgeTypes": ["DEPENDS ON", "FEEDS", "CONFLICTS", "PRODUCES", "REFERENCES"],

    "idea2.title": "2. Signal vs. Noise",
    "idea2.desc": "Your team doesn't review every email on every project. <span class='hl'>Why does your AI?</span>",
    "idea2.oldLabel": "Current: processes everything equally",
    "idea2.newLabel": "Smart: only what's relevant",

    "idea3.title": "3. Institutional Memory",
    "idea3.desc": "Your AI assistant <span class='hl hl-red'>forgets everything</span> between conversations. Every onboarding starts from zero.",
    "idea3.oldLabel": "Current: every conversation starts blank",
    "idea3.newLabel": "Memory: knowledge carries forward",

    "idea4.title": "4. Confidence Reporting",
    "idea4.desc": "Current AI gives every answer with <span class='hl hl-red'>the same confidence.</span> It can't tell you what it's unsure about.",
    "idea4.oldLabel": "Current: uniform confidence. No sources.",
    "idea4.newLabel": "Graded: confidence varies. Sources cited.",

    "path1.files": ["revenue.xlsx", "pricing.xlsx", "customers.csv", "pipeline.xlsx", "targets.xlsx", "inventory.xlsx", "orders.csv", "suppliers.xlsx", "logistics.xlsx", "analytics.xlsx", "dashboard.xlsx"],
    "path1.dir": "data/",
    "path1.edges": [
        { from: 0, to: 1, type: "DEPENDS ON" }, { from: 0, to: 3, type: "FEEDS" },
        { from: 1, to: 4, type: "FEEDS" }, { from: 2, to: 0, type: "REFERENCES" },
        { from: 2, to: 5, type: "DEPENDS ON" }, { from: 3, to: 6, type: "PRODUCES" },
        { from: 5, to: 7, type: "DEPENDS ON" }, { from: 6, to: 8, type: "FEEDS" },
        { from: 7, to: 8, type: "CONFLICTS" }, { from: 8, to: 9, type: "FEEDS" },
        { from: 9, to: 10, type: "PRODUCES" }, { from: 4, to: 10, type: "FEEDS" },
        { from: 10, to: 0, type: "REFERENCES" }, { from: 3, to: 1, type: "CONFLICTS" },
        { from: 6, to: 5, type: "DEPENDS ON" }
    ],

    "paths.title": "Four ways to start. Pick one.",
    "paths.desc": "Each is a proof-of-concept your team can prototype <span class='hl'>this quarter.</span>",

    // --- Demo ---
    "demo.title": "Watch the difference.",
    "demo.desc": "Same question. Two systems. One guesses. One <span class='hl-green hl'>shows its work.</span>",
    "demo.prompt1": "> Summarize Q3 revenue drivers",
    "demo.prompt2": "> Update the forecast for next quarter <span class='sm' style='color:var(--dim)'>(follow-up)</span>",
    "demo.gen1a": "Q3 revenue was primarily driven by strong enterprise sales and improved retention rates. The expansion into APAC markets contributed significantly to top-line growth.",
    "demo.gen1b": [
        { text: "Pulling from " },
        { text: "revenue.xlsx row 142", cls: "cite" },
        { text: " and " },
        { text: "pipeline.xlsx Q3 tab", cls: "cite" },
        { text: "...\n\nEnterprise grew 23%, but " },
        { text: "pricing.xlsx", cls: "cite" },
        { text: " shows margin compressed 4%.\n\n" },
        { text: "\u26A0 Net revenue up, but margin trending down.", cls: "flag" },
        { text: "\nAPAC growth is real but unit economics unproven." }
    ],
    "demo.gen2a": "Sure! Based on current trends, I'd project Q4 revenue at approximately $4.2M, representing 15% quarter-over-quarter growth.\n\nKey assumptions:\n- Enterprise pipeline continues...",
    "demo.gen2b": [
        { text: "From your last session: you flagged " },
        { text: "APAC unit economics", cls: "cite" },
        { text: " as unproven (trace #312).\n\nCurrent " },
        { text: "pipeline.xlsx", cls: "cite" },
        { text: " shows Q4 weighted pipeline at $3.8M.\n\n" },
        { text: "\u26A0 Projecting $4.2M requires 110% close rate.", cls: "flag" },
        { text: "\nConservative estimate: $3.4M. Flagging the gap." }
    ],

    "res.title": "What you actually need.",
    "res1.name": "A PLATFORM",
    "res1.detail": "Open-source models &mdash; no vendor lock-in, runs on your infrastructure",
    "res2.name": "A PILOT",
    "res2.detail": "Pick one workflow. Measure before and after. 90-day proof.",
    "res3.name": "A QUESTION",
    "res3.detail": "\"What would change if our AI could explain itself?\" &mdash; start there",

    // --- Convergence ---
    "conv.title": "The Accountable AI",
    "conv.t1": "<strong style='color:var(--purple)'>Understands</strong> dependencies across your data",
    "conv.t2": "Filters <strong style='color:var(--blue)'>noise</strong> from signal automatically",
    "conv.t3": "Builds <strong style='color:var(--red)'>institutional memory</strong> that persists",
    "conv.t4": "Explains <strong style='color:var(--green)'>its reasoning</strong> before you ask",
    "conv.punch": "Not a black box you audit after the fact.<br>A transparent system that <em style='color:var(--blue);font-style:normal'>audits itself.</em>",

    // --- Status ---
    "stat.title": "Proof of concept.",
    "stat.intro": "This isn't a pitch deck. It's a <span class='hl'>working prototype.</span>",
    "stat.probLabel": "The business pain",
    "stat.prob1": "Every AI conversation starts <strong style='color:var(--red)'>from scratch.</strong>",
    "stat.prob2": "Institutional knowledge <strong style='color:var(--red)'>doesn't transfer.</strong>",
    "stat.prob3": "No accountability for <strong style='color:var(--red)'>wrong answers.</strong>",
    "stat.builtLabel": "Built so far",
    "stat.built1": "<strong>Persistent knowledge map</strong> + <strong>typed routing</strong> between data assets.",
    "stat.built2": "Custom model fine-tuned on organizational data. <span class='mono' style='font-size:0.82rem'>Measurable improvement.</span>",
    "stat.built3": "<strong>Full trace layer:</strong> every session logged, model reads its own history.",
    "stat.summary": "4 of 5 layers <span class='hl'>operational.</span> Attribution output is the pilot target.",
    "stat.cond": "<span class='hl'>Built with:</span> Open-source models. <span class='hl-blue hl'>Standard tooling.</span> <span class='hl-purple hl'>No vendor lock-in.</span>",
    "stat.condDetail": "Consumer hardware. Open-source stack. One week from concept to working demo:",

    // --- CTA ---
    "cta.title": "Now &mdash; your team.",
    "cta.q": "Four capabilities. Four pilots.<br>Which one solves a real problem <em style='color:var(--amber);font-style:normal'>in your organization?</em>",

    // --- Path details ---
    "path1.num": "Pilot 1",
    "path1.ptitle": "Dependency mapping",
    "path1.body": "Your teams work with interconnected data &mdash; spreadsheets that feed reports, configs that control systems, documents that reference each other. Current AI treats them as isolated files.<br><br>Map the <strong>relationships between your key data assets.</strong> Not just that they're related &mdash; how. Revenue <em>depends on</em> pricing. Inventory <em>feeds</em> logistics. When pricing changes, the system knows what downstream reports need updating.<br><br>Start with one department. Map 10-15 key files. Measure: does knowing relationship types change the quality of AI-generated analysis? If your AI can say \"revenue will be affected because pricing changed\" instead of just \"these are correlated\" &mdash; that's the value.",
    "path1.req": "Needs: existing data assets, relationship mapping, 2-week pilot",
    "path2.num": "Pilot 2",
    "path2.ptitle": "Noise reduction",
    "path2.body": "Your AI tools process everything equally &mdash; the critical alert and the routine update get the same weight. Your team spends time filtering what the AI should have filtered for them.<br><br>Add <strong>relevance thresholds</strong> to your AI workflows. Instead of processing every email, document, and notification equally, the system identifies which inputs actually matter for the task at hand.<br><br>Measure before and after: how much time does your team spend filtering AI output? How often does the AI surface information that wasn't relevant? The goal isn't less information &mdash; it's <strong>better signal-to-noise ratio.</strong>",
    "path2.req": "Needs: existing AI workflow, baseline metrics, 30-day measurement",
    "path3.num": "Pilot 3",
    "path3.ptitle": "Institutional memory",
    "path3.body": "Every new AI conversation starts from zero. The corrections, preferences, and context from yesterday's session don't carry forward. New team members onboard the AI from scratch every time.<br><br>Build a <strong>persistent knowledge layer</strong> that records decisions, corrections, and context between sessions. Before each interaction, the AI reads its own history and adapts.<br><br>Measure: does the AI make the same mistake twice? Does it remember last quarter's analysis when building this quarter's? Institutional memory means the AI gets better the more your team uses it &mdash; not just during a session, but across months.",
    "path3.req": "Needs: any LLM deployment, session logging, knowledge base",
    "path4.num": "Pilot 4",
    "path4.ptitle": "Confidence reporting",
    "path4.body": "Your AI gives every answer with the same confidence. The well-supported analysis and the educated guess look identical. Your team can't tell which outputs to trust and which to verify.<br><br>Add <strong>confidence scores and source citations</strong> to your AI outputs. When the model is drawing from verified data, confidence is high. When it's extrapolating, it says so.<br><br>The result: your team knows where to focus verification effort. An answer with 0.95 confidence backed by three source documents gets fast-tracked. An answer with 0.4 confidence triggers review. That's not just better AI &mdash; it's a <strong>better workflow.</strong>",
    "path4.req": "Needs: existing AI deployment, source data catalog, 90-day pilot",

    // --- Resources extra ---
    "res.desc": "Not a massive infrastructure investment. What you <span class='hl'>actually</span> need to start.",
    "res.bottom": "Everything here runs on open-source models with no vendor lock-in.<br>If you have data and a question, you have enough to pilot.",

    // --- Vision ---
    "vis.title": "What happens when organizations adopt this?",
    "vis.p1": "If <span class='hl'>one team</span> pilots dependency mapping, they learn whether their AI makes better decisions when it understands how data connects.",
    "vis.p2": "If <span class='hl'>multiple departments</span> each pilot a different capability, the organization builds a compound advantage &mdash; each improvement reinforces the others.",
    "vis.p3": "If <span class='hl-green hl'>any of it works</span> &mdash; even partially &mdash; it means your current AI tools are leaving value on the table. Not because they're bad tools. Because they don't understand your organization.",
    "vis.fail": "And if a pilot <span class='hl-red hl'>doesn't show ROI?</span>",
    "vis.failp": "Then you'll know exactly why. You'll have the data, the metrics, the specific point of failure. That's more valuable than a vendor's promise. That's <em>due diligence.</em>",

    // --- Engage ---
    "eng.title": "Three ways to start.",
    "eng1.title": "Pilot it",
    "eng1.desc": "Pick one capability. Run a 90-day proof-of-concept. Measure before and after.",
    "eng2.title": "Evaluate it",
    "eng2.desc": "Which of these solves a real problem for your team? What would you need to see to move forward?",
    "eng3.title": "Partner",
    "eng3.desc": "See an application in your industry? A use case we haven't considered? That's how platforms grow.",

    // --- Close ---
    "close.quote": "\"Which workflow changes first?\"",
    "close.desc": "That question drives every successful pilot. The same question is now yours.",
    "close.big": "What will your team build?",
    "close.p1": "The architecture is open. The models are free. The tooling is standard.",
    "close.p2": "<span class='hl'>The only thing missing is the pilot that proves it.</span>"

}, zh: {
    "hero.eq1": "\u6570\u636E",
    "hero.eq2": "\u2260",
    "hero.eq3": "\u6D1E\u5BDF",
    "hero.sub": "\u5982\u679C\u4F60\u7684AI\u5DE5\u5177\u80FD\u89E3\u91CA\u5B83\u7684\u63A8\u7406\u2014\u2014\u5E76\u5728<strong>\u65E0\u6CD5\u89E3\u91CA\u65F6\u6807\u8BB0</strong>\u5462\uFF1F",

    // --- Idea 1 ---
    "idea1.title": "1. \u5173\u7CFB\u6620\u5C04",
    "idea1.desc": "\u5F53\u524DAI\u77E5\u9053\u4F60\u7684\u6570\u636E\u6709\u5173\u8054\u3002\u4E0D\u77E5\u9053<span class='hl-purple hl'>\u5982\u4F55\u4F9D\u8D56\u3002</span>",
    "idea1.oldLabel": "\u5F53\u524D\uFF1A\u4EC5\u76F8\u5173\u6027\u5206\u6570",
    "idea1.newLabel": "\u6620\u5C04\uFF1A\u6807\u8BB0\u4F9D\u8D56\u5173\u7CFB",
    "idea1.oldTag": "\u5F53\u524DAI",
    "idea1.oldBig": "0.73",
    "idea1.oldLine": "\"\u8FD9\u4E9B\u6570\u636E\u96C6\u6709\u5173\u8054\u3002\"",
    "idea1.oldDetail": "\u600E\u4E48\u5173\u8054\uFF1F\u8BF4\u4E0D\u4E0A\u6765\u3002",
    "idea1.newTag": "\u5173\u7CFB\u7C7B\u578B",
    "idea1.newBig": "\u4F9D\u8D56",
    "idea1.newLine": "\"\u6536\u5165\u4F1A\u56E0\u5B9A\u4EF7\u53D8\u5316\u800C\u53D7\u5F71\u54CD\u3002\"",
    "idea1.newDetail": "\u53EF\u64CD\u4F5C\u3002\u53EF\u5BA1\u8BA1\u3002",

    "attn.files": ["revenue.xlsx", "pricing.xlsx", "customers.csv", "pipeline.xlsx", "targets.xlsx"],
    "attn.dir": "reports/",
    "attn.edges": [
        { from: 0, to: 1, type: "DEPENDS ON" },
        { from: 0, to: 3, type: "FEEDS" },
        { from: 1, to: 4, type: "FEEDS" },
        { from: 2, to: 0, type: "REFERENCES" },
        { from: 3, to: 1, type: "CONFLICTS" }
    ],
    "attn.edgeTypes": ["DEPENDS ON", "FEEDS", "CONFLICTS", "PRODUCES", "REFERENCES"],

    // --- Idea 2 ---
    "idea2.title": "2. \u4FE1\u53F7\u4E0E\u566A\u58F0",
    "idea2.desc": "\u4F60\u7684\u56E2\u961F\u4E0D\u4F1A\u5BA1\u67E5\u6BCF\u4E2A\u9879\u76EE\u7684\u6BCF\u5C01\u90AE\u4EF6\u3002<span class='hl'>\u4F60\u7684AI\u4E3A\u4EC0\u4E48\u8981\uFF1F</span>",
    "idea2.oldLabel": "\u5F53\u524D\uFF1A\u4E00\u5207\u540C\u7B49\u5904\u7406",
    "idea2.newLabel": "\u667A\u80FD\uFF1A\u53EA\u5904\u7406\u76F8\u5173\u5185\u5BB9",

    // --- Idea 3 ---
    "idea3.title": "3. \u7EC4\u7EC7\u8BB0\u5FC6",
    "idea3.desc": "\u4F60\u7684AI\u52A9\u624B\u5728\u6BCF\u6B21\u5BF9\u8BDD\u4E4B\u95F4<span class='hl hl-red'>\u5FD8\u8BB0\u4E00\u5207\u3002</span>\u6BCF\u6B21\u57F9\u8BAD\u90FD\u4ECE\u96F6\u5F00\u59CB\u3002",
    "idea3.oldLabel": "\u5F53\u524D\uFF1A\u6BCF\u6B21\u5BF9\u8BDD\u4ECE\u96F6\u5F00\u59CB",
    "idea3.newLabel": "\u8BB0\u5FC6\uFF1A\u77E5\u8BC6\u6301\u7EED\u4F20\u627F",

    // --- Idea 4 ---
    "idea4.title": "4. \u7F6E\u4FE1\u5EA6\u62A5\u544A",
    "idea4.desc": "\u5F53\u524DAI\u4EE5<span class='hl hl-red'>\u76F8\u540C\u7684\u7F6E\u4FE1\u5EA6</span>\u56DE\u7B54\u6BCF\u4E2A\u95EE\u9898\u3002\u5B83\u65E0\u6CD5\u544A\u8BC9\u4F60\u54EA\u4E9B\u5185\u5BB9\u4E0D\u786E\u5B9A\u3002",
    "idea4.oldLabel": "\u5F53\u524D\uFF1A\u7EDF\u4E00\u7F6E\u4FE1\u5EA6\u3002\u65E0\u6765\u6E90\u3002",
    "idea4.newLabel": "\u5206\u7EA7\uFF1A\u7F6E\u4FE1\u5EA6\u53D8\u5316\u3002\u6765\u6E90\u5F15\u7528\u3002",

    // Canvas data: path 1
    "path1.files": ["revenue.xlsx", "pricing.xlsx", "customers.csv", "pipeline.xlsx", "targets.xlsx", "inventory.xlsx", "orders.csv", "suppliers.xlsx", "logistics.xlsx", "analytics.xlsx", "dashboard.xlsx"],
    "path1.dir": "data/",
    "path1.edges": [
        { from: 0, to: 1, type: "DEPENDS ON" }, { from: 0, to: 3, type: "FEEDS" },
        { from: 1, to: 4, type: "FEEDS" }, { from: 2, to: 0, type: "REFERENCES" },
        { from: 2, to: 5, type: "DEPENDS ON" }, { from: 3, to: 6, type: "PRODUCES" },
        { from: 5, to: 7, type: "DEPENDS ON" }, { from: 6, to: 8, type: "FEEDS" },
        { from: 7, to: 8, type: "CONFLICTS" }, { from: 8, to: 9, type: "FEEDS" },
        { from: 9, to: 10, type: "PRODUCES" }, { from: 4, to: 10, type: "FEEDS" },
        { from: 10, to: 0, type: "REFERENCES" }, { from: 3, to: 1, type: "CONFLICTS" },
        { from: 6, to: 5, type: "DEPENDS ON" }
    ],

    // --- Demo ---
    "demo.title": "\u770B\u770B\u533A\u522B\u3002",
    "demo.desc": "\u76F8\u540C\u7684\u95EE\u9898\u3002\u4E24\u4E2A\u7CFB\u7EDF\u3002\u4E00\u4E2A\u731C\u6D4B\u3002\u4E00\u4E2A<span class='hl-green hl'>\u5C55\u793A\u8FC7\u7A0B\u3002</span>",
    "demo.prompt1": "> \u603B\u7ED3Q3\u6536\u5165\u9A71\u52A8\u56E0\u7D20",
    "demo.prompt2": "> \u66F4\u65B0\u4E0B\u5B63\u5EA6\u9884\u6D4B <span class='sm' style='color:var(--dim)'>(\u8DDF\u8FDB)</span>",
    "demo.gen1a": "Q3\u6536\u5165\u4E3B\u8981\u53D7\u4F01\u4E1A\u9500\u552E\u5F3A\u52B2\u548C\u7559\u5B58\u7387\u63D0\u9AD8\u7684\u9A71\u52A8\u3002\u4E9A\u592A\u5E02\u573A\u7684\u6269\u5F20\u5BF9\u6536\u5165\u589E\u957F\u6709\u663E\u8457\u8D21\u732E\u3002",
    "demo.gen1b": [
        { text: "\u4ECE " },
        { text: "revenue.xlsx \u7B2C142\u884C", cls: "cite" },
        { text: " \u548C " },
        { text: "pipeline.xlsx Q3\u6807\u7B7E", cls: "cite" },
        { text: " \u63D0\u53D6...\n\n\u4F01\u4E1A\u589E\u957F23%\uFF0C\u4F46 " },
        { text: "pricing.xlsx", cls: "cite" },
        { text: " \u663E\u793A\u5229\u6DA6\u7387\u538B\u7F294%\u3002\n\n" },
        { text: "\u26A0 \u51C0\u6536\u5165\u589E\u957F\uFF0C\u4F46\u5229\u6DA6\u7387\u4E0B\u964D\u3002", cls: "flag" },
        { text: "\n\u4E9A\u592A\u589E\u957F\u662F\u771F\u5B9E\u7684\uFF0C\u4F46\u5355\u4F4D\u7ECF\u6D4E\u672A\u7ECF\u9A8C\u8BC1\u3002" }
    ],
    "demo.gen2a": "\u5F53\u7136\uFF01\u6839\u636E\u5F53\u524D\u8D8B\u52BF\uFF0C\u6211\u9884\u8BA1Q4\u6536\u5165\u7EA6420\u4E07\u7F8E\u5143\uFF0C\u73AF\u6BD4\u589E\u957F15%\u3002\n\n\u5173\u952E\u5047\u8BBE\uFF1A\n- \u4F01\u4E1A\u7BA1\u7EBF\u7EE7\u7EED...",
    "demo.gen2b": [
        { text: "\u4ECE\u4E0A\u6B21\u4F1A\u8BDD\uFF1A\u4F60\u6807\u8BB0\u4E86 " },
        { text: "\u4E9A\u592A\u5355\u4F4D\u7ECF\u6D4E", cls: "cite" },
        { text: " \u4E3A\u672A\u7ECF\u9A8C\u8BC1\uFF08\u8FFD\u8E2A #312\uFF09\u3002\n\n\u5F53\u524D " },
        { text: "pipeline.xlsx", cls: "cite" },
        { text: " \u663E\u793AQ4\u52A0\u6743\u7BA1\u7EBF380\u4E07\u7F8E\u5143\u3002\n\n" },
        { text: "\u26A0 \u9884\u6D4B420\u4E07\u9700\u8981110%\u6210\u4EA4\u7387\u3002", cls: "flag" },
        { text: "\n\u4FDD\u5B88\u4F30\u8BA1\uFF1A340\u4E07\u3002\u5DF2\u6807\u8BB0\u5DEE\u8DDD\u3002" }
    ],

    "paths.title": "\u56DB\u79CD\u5F00\u59CB\u65B9\u5F0F\u3002\u9009\u4E00\u4E2A\u3002",
    "paths.desc": "\u6BCF\u4E2A\u90FD\u662F\u4F60\u7684\u56E2\u961F\u53EF\u4EE5\u5728<span class='hl'>\u672C\u5B63\u5EA6</span>\u9A8C\u8BC1\u7684\u6982\u5FF5\u3002",

    "res.title": "\u4F60\u5B9E\u9645\u9700\u8981\u7684\u3002",
    "res1.name": "\u5E73\u53F0",
    "res1.detail": "\u5F00\u6E90\u6A21\u578B &mdash; \u65E0\u4F9B\u5E94\u5546\u9501\u5B9A\uFF0C\u8FD0\u884C\u5728\u4F60\u7684\u57FA\u7840\u8BBE\u65BD\u4E0A",
    "res2.name": "\u8BD5\u70B9",
    "res2.detail": "\u9009\u4E00\u4E2A\u5DE5\u4F5C\u6D41\u3002\u6D4B\u91CF\u524D\u540E\u5BF9\u6BD4\u300290\u5929\u9A8C\u8BC1\u3002",
    "res3.name": "\u95EE\u9898",
    "res3.detail": "\"\u5982\u679C\u6211\u4EEC\u7684AI\u80FD\u89E3\u91CA\u81EA\u5DF1\uFF0C\u4F1A\u6539\u53D8\u4EC0\u4E48\uFF1F\" &mdash; \u4ECE\u8FD9\u91CC\u5F00\u59CB"
}},

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PEOPLE MODE (normal person)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
people: { en: {
    "hero.eq1": "Using",
    "hero.eq2": "\u2260",
    "hero.eq3": "Understanding",
    "hero.sub": "What if AI could tell you when it's guessing &mdash; and when it actually <strong>knows?</strong>",

    "idea1.title": "1. Understanding Connections",
    "idea1.desc": "AI knows your files are related. Not <span class='hl-purple hl'>why.</span>",
    "idea1.oldLabel": "Current: just a number",
    "idea1.newLabel": "Better: explains the relationship",
    "idea1.oldTag": "Current AI",
    "idea1.oldBig": "0.73",
    "idea1.oldLine": "\"These are related.\"",
    "idea1.oldDetail": "Related how? Shrug.",
    "idea1.newTag": "With Context",
    "idea1.newBig": "NEEDS",
    "idea1.newLine": "\"Your budget needs your receipts to work.\"",
    "idea1.newDetail": "Now you know what to update.",

    "attn.files": ["budget.xlsx", "receipts/", "photos/", "notes.txt", "contacts.csv"],
    "attn.dir": "my-stuff/",
    "attn.edges": [
        { from: 0, to: 1, type: "NEEDS" },
        { from: 0, to: 4, type: "USES" },
        { from: 1, to: 3, type: "USES" },
        { from: 2, to: 3, type: "MENTIONED IN" },
        { from: 3, to: 0, type: "UPDATES" }
    ],
    "attn.edgeTypes": ["NEEDS", "USES", "UPDATES", "MENTIONED IN", "CONFLICTS"],

    "idea2.title": "2. Focusing on What Matters",
    "idea2.desc": "You don't read every email every morning. <span class='hl'>Why does AI process everything equally?</span>",
    "idea2.oldLabel": "Current: treats everything the same",
    "idea2.newLabel": "Better: focuses on what's relevant",

    "idea3.title": "3. Remembering What You Told It",
    "idea3.desc": "AI <span class='hl hl-red'>forgets everything</span> after each conversation. You correct it today. Tomorrow it makes the same mistake.",
    "idea3.oldLabel": "Current: starts fresh every time",
    "idea3.newLabel": "Better: remembers and learns",

    "idea4.title": "4. Knowing What It Doesn't Know",
    "idea4.desc": "AI says everything with <span class='hl hl-red'>the same confidence.</span> It can't warn you when it's guessing.",
    "idea4.oldLabel": "Current: same confidence for everything",
    "idea4.newLabel": "Better: tells you how sure it is",

    "path1.files": ["budget.xlsx", "receipts/", "photos/", "notes.txt", "contacts.csv", "calendar/", "messages/", "bookmarks/", "playlists/", "recipes.txt", "journal.md"],
    "path1.dir": "my-stuff/",
    "path1.edges": [
        { from: 0, to: 1, type: "NEEDS" }, { from: 0, to: 4, type: "USES" },
        { from: 1, to: 3, type: "USES" }, { from: 2, to: 3, type: "MENTIONED IN" },
        { from: 3, to: 0, type: "UPDATES" }, { from: 4, to: 6, type: "USES" },
        { from: 5, to: 6, type: "NEEDS" }, { from: 6, to: 3, type: "MENTIONED IN" },
        { from: 7, to: 3, type: "USES" }, { from: 8, to: 2, type: "MENTIONED IN" },
        { from: 9, to: 0, type: "UPDATES" }, { from: 10, to: 3, type: "USES" },
        { from: 5, to: 0, type: "NEEDS" }, { from: 10, to: 9, type: "MENTIONED IN" },
        { from: 7, to: 6, type: "USES" }
    ],

    // --- Demo ---
    "demo.title": "Watch the difference.",
    "demo.desc": "Same question. Two assistants. One guesses. One <span class='hl-green hl'>checks first.</span>",
    "demo.prompt1": "> Can I afford this vacation?",
    "demo.prompt2": "> What should I cook tonight? <span class='sm' style='color:var(--dim)'>(asked before)</span>",
    "demo.gen1a": "Based on typical vacation costs, a week-long trip would cost around $2,000-3,000. If you have savings, you should be able to afford it! I'd recommend budgeting carefully.",
    "demo.gen1b": [
        { text: "Looking at " },
        { text: "budget.xlsx", cls: "cite" },
        { text: "...\n\nMonthly surplus after bills: " },
        { text: "$340", cls: "cite" },
        { text: ". Credit card balance: " },
        { text: "$1,200", cls: "cite" },
        { text: " (receipts/dec).\n\n" },
        { text: "\u26A0 A $2,500 trip would take 7+ months to save for.", cls: "flag" },
        { text: "\nOr: pay off card first (4 months), then save." }
    ],
    "demo.gen2a": "Here are some easy dinner ideas!\n\n1. Pasta with garlic and olive oil\n2. Stir-fry with whatever vegetables you have\n3. Simple tacos with ground beef\n\nWant me to pick one?",
    "demo.gen2b": [
        { text: "Last time you said " },
        { text: "no dairy, trying to cut carbs", cls: "cite" },
        { text: " (2 weeks ago).\n\nFrom " },
        { text: "recipes.txt", cls: "cite" },
        { text: ": you bookmarked Thai basil chicken.\n\n" },
        { text: "Checking what you likely have:", cls: "flag" },
        { text: "\nYou bought chicken + basil Tuesday (" },
        { text: "receipts/", cls: "cite" },
        { text: "). Should still be good." }
    ],

    "paths.title": "Four ways this helps you.",
    "paths.desc": "Real improvements to how AI works for <span class='hl'>everyday people.</span>",

    "res.title": "What makes this possible.",
    "res1.name": "OPEN MODELS",
    "res1.detail": "Free AI models anyone can download and run",
    "res2.name": "SIMPLE TOOLS",
    "res2.detail": "Standard software &mdash; no PhD required",
    "res3.name": "CURIOSITY",
    "res3.detail": "\"What if AI was honest about what it doesn't know?\" &mdash; that's the whole idea",

    // --- Convergence ---
    "conv.title": "The Honest Assistant",
    "conv.t1": "<strong style='color:var(--purple)'>Understands</strong> how your stuff connects",
    "conv.t2": "Focuses on <strong style='color:var(--blue)'>what matters</strong> to you right now",
    "conv.t3": "Actually <strong style='color:var(--red)'>remembers</strong> what you told it",
    "conv.t4": "Tells you when it's <strong style='color:var(--green)'>guessing</strong> vs. when it knows",
    "conv.punch": "Not an AI you hope is right.<br>An AI that <em style='color:var(--blue);font-style:normal'>tells you</em> when it's not.",

    // --- Status ---
    "stat.title": "Where this stands.",
    "stat.intro": "This isn't just an idea. There's a <span class='hl'>working version.</span>",
    "stat.probLabel": "What's broken now",
    "stat.prob1": "AI <strong style='color:var(--red)'>forgets</strong> you every conversation.",
    "stat.prob2": "Your corrections <strong style='color:var(--red)'>disappear.</strong>",
    "stat.prob3": "It <strong style='color:var(--red)'>never gets better</strong> at helping you.",
    "stat.builtLabel": "What works already",
    "stat.built1": "AI that <strong>remembers context</strong> and knows <strong>how things connect.</strong>",
    "stat.built2": "Custom model trained on real conversations. <span class='mono' style='font-size:0.82rem'>Measurably better.</span>",
    "stat.built3": "<strong>It keeps a journal.</strong> Every session builds on the last.",
    "stat.summary": "Most of the system is <span class='hl'>already working.</span> One layer left to finish.",
    "stat.cond": "<span class='hl'>Built with:</span> Free, open-source AI. <span class='hl-blue hl'>Standard tools.</span> <span class='hl-purple hl'>No big company required.</span>",
    "stat.condDetail": "Regular computer hardware. Free models. One week of focused building:",

    // --- CTA ---
    "cta.title": "Now &mdash; you.",
    "cta.q": "Four ways AI could be better.<br>Which one would actually change <em style='color:var(--amber);font-style:normal'>how you use it?</em>",

    // --- Path details ---
    "path1.num": "Idea 1",
    "path1.ptitle": "Your files understand each other",
    "path1.body": "Right now, AI looks at each of your files separately. Your budget spreadsheet and your receipt folder? Just two files. It doesn't know that one <em>needs</em> the other.<br><br>Imagine if it understood: your budget <strong>depends on</strong> your receipts. Your calendar <strong>connects to</strong> your contacts. Your notes <strong>reference</strong> your photos.<br><br>That means when you update your receipts, AI knows your budget summary might need updating too. Not because someone programmed that rule &mdash; because it <em>understands the relationship.</em>",
    "path1.req": "What it takes: AI that understands connections, not just content",
    "path2.num": "Idea 2",
    "path2.ptitle": "AI stops wasting your time",
    "path2.body": "Current AI treats everything as equally important. A critical deadline and a junk notification get the same attention. You end up doing the filtering yourself.<br><br>What if AI could tell the difference? What if it knew that <strong>the urgent email about your flight change matters more</strong> than the newsletter you never read?<br><br>It's not about seeing less information. It's about seeing the <strong>right information first.</strong> Like having an assistant who knows what's actually important to you right now.",
    "path2.req": "What it takes: AI that learns your priorities over time",
    "path3.num": "Idea 3",
    "path3.ptitle": "AI remembers you",
    "path3.body": "You told your AI assistant you're lactose intolerant last week. Today it suggests a cheese pizza recipe. You told it you're saving for a vacation. It recommends an expensive gadget.<br><br>Current AI <strong>forgets everything</strong> between conversations. Every session starts fresh. It's like talking to someone with no memory.<br><br>What if it actually remembered? Not just what you asked &mdash; but your preferences, your goals, the corrections you've made. What if each conversation made the next one <em>better?</em>",
    "path3.req": "What it takes: persistent memory between conversations",
    "path4.num": "Idea 4",
    "path4.ptitle": "AI tells you when it's guessing",
    "path4.body": "Ask AI if a restaurant is good. It says yes with total confidence. Ask if a medication interacts with yours. Same confident tone. But one answer is backed by data and the other is a guess.<br><br>You can't tell the difference. <strong>Neither can the AI.</strong><br><br>What if it could say: \"I'm 95% sure about the restaurant &mdash; 200 reviews back this up. But I'm only 40% sure about the medication &mdash; <em>please check with your doctor.\"</em> That's not less helpful. That's <strong>more honest.</strong>",
    "path4.req": "What it takes: AI that knows what it knows and what it doesn't",

    // --- Resources extra ---
    "res.desc": "No tech background needed. Here's what makes this <span class='hl'>actually</span> possible.",
    "res.bottom": "This isn't some far-off research project. The tools exist today.<br>If someone builds it, everyone benefits.",

    // --- Vision ---
    "vis.title": "What happens when this actually works?",
    "vis.p1": "If <span class='hl'>one app</span> remembers your preferences across conversations, every other app looks broken by comparison.",
    "vis.p2": "If <span class='hl'>multiple apps</span> adopt honest confidence scores, you'll finally know which AI answers to trust and which to double-check.",
    "vis.p3": "If <span class='hl-green hl'>any of this works</span> &mdash; even in one app, even imperfectly &mdash; it proves that AI can be better than it is today. Not smarter. <em>More honest.</em>",
    "vis.fail": "And if it <span class='hl-red hl'>doesn't work?</span>",
    "vis.failp": "Then we'll know exactly why, and that's valuable too. Better to test it than to wonder.",

    // --- Engage ---
    "eng.title": "Three ways to be part of this.",
    "eng1.title": "Try it",
    "eng1.desc": "When tools like this exist, try them. Your feedback as a user shapes what gets built next.",
    "eng2.title": "Question it",
    "eng2.desc": "When AI gives you an answer, ask: how sure are you? Where did you get that? Demand honesty.",
    "eng3.title": "Share it",
    "eng3.desc": "Know someone who'd care about honest AI? Share this page. Ideas spread when people talk about them.",

    // --- Close ---
    "close.quote": "\"Which part would actually help you?\"",
    "close.desc": "That's the only question that matters. The same question is now yours.",
    "close.big": "What will you try?",
    "close.p1": "The ideas are simple. The technology exists. The need is real.",
    "close.p2": "<span class='hl'>Better AI starts with better questions.</span>"

}, zh: {
    "hero.eq1": "\u4F7F\u7528",
    "hero.eq2": "\u2260",
    "hero.eq3": "\u7406\u89E3",
    "hero.sub": "\u5982\u679CAI\u80FD\u544A\u8BC9\u4F60\u5B83\u4EC0\u4E48\u65F6\u5019\u5728\u731C\u2014\u2014\u4EC0\u4E48\u65F6\u5019\u771F\u7684<strong>\u77E5\u9053</strong>\u5462\uFF1F",

    // --- Idea 1 ---
    "idea1.title": "1. \u7406\u89E3\u8054\u7CFB",
    "idea1.desc": "AI\u77E5\u9053\u4F60\u7684\u6587\u4EF6\u6709\u5173\u8054\u3002\u4E0D\u77E5\u9053<span class='hl-purple hl'>\u4E3A\u4EC0\u4E48\u3002</span>",
    "idea1.oldLabel": "\u5F53\u524D\uFF1A\u53EA\u662F\u4E00\u4E2A\u6570\u5B57",
    "idea1.newLabel": "\u66F4\u597D\uFF1A\u89E3\u91CA\u5173\u7CFB",
    "idea1.oldTag": "\u5F53\u524DAI",
    "idea1.oldBig": "0.73",
    "idea1.oldLine": "\"\u8FD9\u4E9B\u662F\u76F8\u5173\u7684\u3002\"",
    "idea1.oldDetail": "\u600E\u4E48\u76F8\u5173\uFF1F\u4E0D\u77E5\u9053\u3002",
    "idea1.newTag": "\u6709\u4E0A\u4E0B\u6587",
    "idea1.newBig": "\u9700\u8981",
    "idea1.newLine": "\"\u4F60\u7684\u9884\u7B97\u9700\u8981\u6536\u636E\u624D\u80FD\u5DE5\u4F5C\u3002\"",
    "idea1.newDetail": "\u73B0\u5728\u4F60\u77E5\u9053\u8BE5\u66F4\u65B0\u4EC0\u4E48\u4E86\u3002",

    "attn.files": ["budget.xlsx", "receipts/", "photos/", "notes.txt", "contacts.csv"],
    "attn.dir": "my-stuff/",
    "attn.edges": [
        { from: 0, to: 1, type: "NEEDS" },
        { from: 0, to: 4, type: "USES" },
        { from: 1, to: 3, type: "USES" },
        { from: 2, to: 3, type: "MENTIONED IN" },
        { from: 3, to: 0, type: "UPDATES" }
    ],
    "attn.edgeTypes": ["NEEDS", "USES", "UPDATES", "MENTIONED IN", "CONFLICTS"],

    // --- Idea 2 ---
    "idea2.title": "2. \u5173\u6CE8\u91CD\u8981\u7684",
    "idea2.desc": "\u4F60\u4E0D\u4F1A\u6BCF\u5929\u65E9\u4E0A\u8BFB\u6BCF\u5C01\u90AE\u4EF6\u3002<span class='hl'>AI\u4E3A\u4EC0\u4E48\u8981\u4E00\u5207\u540C\u7B49\u5904\u7406\uFF1F</span>",
    "idea2.oldLabel": "\u5F53\u524D\uFF1A\u4E00\u5207\u540C\u7B49\u5BF9\u5F85",
    "idea2.newLabel": "\u66F4\u597D\uFF1A\u5173\u6CE8\u76F8\u5173\u5185\u5BB9",

    // --- Idea 3 ---
    "idea3.title": "3. \u8BB0\u4F4F\u4F60\u8BF4\u8FC7\u7684",
    "idea3.desc": "AI\u5728\u6BCF\u6B21\u5BF9\u8BDD\u540E<span class='hl hl-red'>\u5FD8\u8BB0\u4E00\u5207\u3002</span>\u4F60\u4ECA\u5929\u7EA0\u6B63\u5B83\uFF0C\u660E\u5929\u5B83\u72AF\u540C\u6837\u7684\u9519\u3002",
    "idea3.oldLabel": "\u5F53\u524D\uFF1A\u6BCF\u6B21\u90FD\u91CD\u65B0\u5F00\u59CB",
    "idea3.newLabel": "\u66F4\u597D\uFF1A\u8BB0\u4F4F\u5E76\u5B66\u4E60",

    // --- Idea 4 ---
    "idea4.title": "4. \u77E5\u9053\u81EA\u5DF1\u4E0D\u77E5\u9053\u4EC0\u4E48",
    "idea4.desc": "AI\u4EE5<span class='hl hl-red'>\u76F8\u540C\u7684\u7F6E\u4FE1\u5EA6</span>\u8BF4\u6240\u6709\u7684\u8BDD\u3002\u5B83\u65E0\u6CD5\u8B66\u544A\u4F60\u5B83\u5728\u731C\u6D4B\u3002",
    "idea4.oldLabel": "\u5F53\u524D\uFF1A\u6240\u6709\u5185\u5BB9\u76F8\u540C\u7F6E\u4FE1\u5EA6",
    "idea4.newLabel": "\u66F4\u597D\uFF1A\u544A\u8BC9\u4F60\u5B83\u6709\u591A\u786E\u5B9A",

    // Canvas data: path 1
    "path1.files": ["budget.xlsx", "receipts/", "photos/", "notes.txt", "contacts.csv", "calendar/", "messages/", "bookmarks/", "playlists/", "recipes.txt", "journal.md"],
    "path1.dir": "my-stuff/",
    "path1.edges": [
        { from: 0, to: 1, type: "NEEDS" }, { from: 0, to: 4, type: "USES" },
        { from: 1, to: 3, type: "USES" }, { from: 2, to: 3, type: "MENTIONED IN" },
        { from: 3, to: 0, type: "UPDATES" }, { from: 4, to: 6, type: "USES" },
        { from: 5, to: 6, type: "NEEDS" }, { from: 6, to: 3, type: "MENTIONED IN" },
        { from: 7, to: 3, type: "USES" }, { from: 8, to: 2, type: "MENTIONED IN" },
        { from: 9, to: 0, type: "UPDATES" }, { from: 10, to: 3, type: "USES" },
        { from: 5, to: 0, type: "NEEDS" }, { from: 10, to: 9, type: "MENTIONED IN" },
        { from: 7, to: 6, type: "USES" }
    ],

    // --- Demo ---
    "demo.title": "\u770B\u770B\u533A\u522B\u3002",
    "demo.desc": "\u76F8\u540C\u7684\u95EE\u9898\u3002\u4E24\u4E2A\u52A9\u624B\u3002\u4E00\u4E2A\u731C\u6D4B\u3002\u4E00\u4E2A<span class='hl-green hl'>\u5148\u68C0\u67E5\u3002</span>",
    "demo.prompt1": "> \u6211\u80FD\u8D1F\u62C5\u5F97\u8D77\u8FD9\u6B21\u5EA6\u5047\u5417\uFF1F",
    "demo.prompt2": "> \u4ECA\u665A\u8BE5\u505A\u4EC0\u4E48\u83DC\uFF1F <span class='sm' style='color:var(--dim)'>(\u4E4B\u524D\u95EE\u8FC7)</span>",
    "demo.gen1a": "\u6839\u636E\u5178\u578B\u5EA6\u5047\u8D39\u7528\uFF0C\u4E00\u5468\u7684\u65C5\u884C\u5927\u7EA6\u82B1\u8D39\u4EBA\u6C11\u5E0115,000-20,000\u5143\u3002\u5982\u679C\u4F60\u6709\u5B58\u6B3E\uFF0C\u5E94\u8BE5\u53EF\u4EE5\u8D1F\u62C5\uFF01\u5EFA\u8BAE\u4ED4\u7EC6\u505A\u9884\u7B97\u3002",
    "demo.gen1b": [
        { text: "\u67E5\u770B " },
        { text: "budget.xlsx", cls: "cite" },
        { text: "...\n\n\u6BCF\u6708\u8D26\u5355\u540E\u7ED3\u4F59\uFF1A" },
        { text: "\uFFE52,400", cls: "cite" },
        { text: "\u3002\u4FE1\u7528\u5361\u4F59\u989D\uFF1A" },
        { text: "\uFFE58,500", cls: "cite" },
        { text: "\uFF08receipts/12\u6708\uFF09\u3002\n\n" },
        { text: "\u26A0 \u4E00\u6B21\uFFE518,000\u7684\u65C5\u884C\u9700\u8981\u5B58\u4E03\u4E2A\u6708\u4EE5\u4E0A\u3002", cls: "flag" },
        { text: "\n\u6216\u8005\uFF1A\u5148\u8FD8\u6E05\u4FE1\u7528\u5361\uFF084\u4E2A\u6708\uFF09\uFF0C\u518D\u5B58\u94B1\u3002" }
    ],
    "demo.gen2a": "\u8FD9\u91CC\u6709\u4E00\u4E9B\u7B80\u5355\u7684\u665A\u9910\u70B9\u5B50\uFF01\n\n1. \u849C\u9999\u6A44\u6984\u6CB9\u610F\u9762\n2. \u7528\u4F60\u6709\u7684\u4EFB\u4F55\u84D4\u83DC\u7092\u4E00\u7206\n3. \u7B80\u5355\u7684\u8089\u672B\u5377\u997C\n\n\u8981\u6211\u9009\u4E00\u4E2A\u5417\uFF1F",
    "demo.gen2b": [
        { text: "\u4E0A\u6B21\u4F60\u8BF4\u4E86 " },
        { text: "\u4E0D\u5403\u4E73\u5236\u54C1\uFF0C\u5728\u51CF\u78B3\u6C34", cls: "cite" },
        { text: "\uFF082\u5468\u524D\uFF09\u3002\n\n\u4ECE " },
        { text: "recipes.txt", cls: "cite" },
        { text: "\uFF1A\u4F60\u6536\u85CF\u4E86\u6CF0\u5F0F\u7F57\u52D2\u9E21\u3002\n\n" },
        { text: "\u68C0\u67E5\u4F60\u53EF\u80FD\u6709\u7684\u98DF\u6750\uFF1A", cls: "flag" },
        { text: "\n\u4F60\u5468\u4E8C\u4E70\u4E86\u9E21\u8089+\u7F57\u52D2\uFF08" },
        { text: "receipts/", cls: "cite" },
        { text: "\uFF09\u3002\u5E94\u8BE5\u8FD8\u65B0\u9C9C\u3002" }
    ],

    "paths.title": "\u56DB\u79CD\u5E2E\u52A9\u4F60\u7684\u65B9\u5F0F\u3002",
    "paths.desc": "AI\u4E3A<span class='hl'>\u666E\u901A\u4EBA</span>\u5DE5\u4F5C\u65B9\u5F0F\u7684\u771F\u6B63\u6539\u8FDB\u3002",

    "res.title": "\u8FD9\u662F\u5982\u4F55\u5B9E\u73B0\u7684\u3002",
    "res1.name": "\u5F00\u6E90\u6A21\u578B",
    "res1.detail": "\u4EFB\u4F55\u4EBA\u90FD\u53EF\u4EE5\u4E0B\u8F7D\u548C\u8FD0\u884C\u7684\u514D\u8D39AI\u6A21\u578B",
    "res2.name": "\u7B80\u5355\u5DE5\u5177",
    "res2.detail": "\u6807\u51C6\u8F6F\u4EF6 &mdash; \u4E0D\u9700\u8981\u535A\u58EB\u5B66\u4F4D",
    "res3.name": "\u597D\u5947\u5FC3",
    "res3.detail": "\"\u5982\u679CAI\u5BF9\u81EA\u5DF1\u4E0D\u77E5\u9053\u7684\u4E8B\u8BDA\u5B9E\u4F1A\u600E\u6837\uFF1F\" &mdash; \u8FD9\u5C31\u662F\u6574\u4E2A\u60F3\u6CD5"
}}

}; // end SITE.content

// Set initial active content
window.SITE.active = window.SITE.content.tech.en;
window.SITE.colors = window.SITE.theme.dark;
