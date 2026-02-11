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
        mid: '74,74,104', dim: '136,136,164',
        red: '220,38,38', green: '5,150,105', blue: '37,99,235',
        amber: '217,119,6', purple: '124,58,237',
        edgeRed: '220,38,38', edgeBlue: '37,99,235',
        edgeAmber: '180,120,10', edgeGreen: '5,150,105', edgeDim: '100,100,140'
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
    "res3.detail": "\"what happens if I try?\" &mdash; the question IS the method"

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
    "res3.detail": "\"What would change if our AI could explain itself?\" &mdash; start there"

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
    "res3.detail": "\"What if AI was honest about what it doesn't know?\" &mdash; that's the whole idea"

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
