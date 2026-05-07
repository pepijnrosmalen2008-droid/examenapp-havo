#!/usr/bin/env python3
"""
Split index.html into separate files for maintainability.

Output files:
  styles.css   — all CSS from the inline <style> block
  data.js      — LESMETHODES, VAKKEN (HAVO), VAKKEN_VWO question data
  app.js       — all JS app logic (state, UI, quiz, sim, lb, etc.)

Rewrites index.html to load these external files.
"""
from pathlib import Path

root = Path(r"C:\Users\pepij\examenapp-havo")
src = root / "index.html"

with open(src, encoding="utf-8") as f:
    lines = f.readlines()

total = len(lines)
print(f"Input: {total} lines")

# Helper: lines n..m (1-indexed, both inclusive) → list
def L(n, m):
    return lines[n-1:m]

# ── Boundaries (1-indexed) ─────────────────────────────────────────────────
# CSS block:     <style> line 393,  content 394..4702,  </style> line 4703
# Big <script>:  opens line 6257,  closes line 18687
#   Data section 1 (LESMETHODES+VAKKEN):  6258..8596
#   State/hash:                           8597..8823
#   Data section 2 (VAKKEN_VWO):          8824..9989
#   Main app logic:                       9990..18686
# MQ script:     opens 18688, content 18689..18898, closes 18899
# HTML gap 1:    18900..19058
# Flicker script: opens 19059, content 19060..19131, closes 19132
# Notif script:  opens 19133, content 19134..19308, closes 19309
# HTML gap 2:    19310..19576
# PWA script:    opens 19577, content 19578..19642, closes 19643
# HTML tail:     19644..end

# ── 1. styles.css ─────────────────────────────────────────────────────────
css = L(394, 4702)

# ── 2. data.js ────────────────────────────────────────────────────────────
data = (
    L(6258, 8596) +   # LESMETHODES + VAKKEN
    ['\n'] +
    L(8824, 9989)     # VAKKEN_VWO
)

# ── 3. app.js ─────────────────────────────────────────────────────────────
app = (
    L(8597, 8823) +           # state declarations + hash routing
    ['\n'] +
    L(9990, 18686) +          # main app logic
    ['\n\n/* ═══════ MULTIPLAYER QUIZ ═══════ */\n'] +
    L(18689, 18898) +         # MQ inner content
    ['\n\n/* ═══════ FLICKERING GRID ═══════ */\n'] +
    L(19060, 19131) +         # flicker canvas inner
    ['\n\n/* ═══════ PUSH NOTIFICATIONS ═══════ */\n'] +
    L(19134, 19308) +         # notifications inner
    ['\n\n/* ═══════ PWA INSTALL BANNER ═══════ */\n'] +
    L(19578, 19642)           # PWA install inner
)

# ── 4. New index.html ─────────────────────────────────────────────────────
# Head (1..392) → link tag → </head><body>+HTML (4704..6256) →
# data + app script tags → HTML gap1 (18900..19058) →
# HTML gap2 (19310..19576) → HTML tail (19644..end)
new_html = (
    L(1, 392) +
    ['<link rel="stylesheet" href="/styles.css">\n'] +
    L(4704, 6256) +
    ['<script src="/data.js"></script>\n',
     '<script src="/app.js"></script>\n'] +
    L(18900, 19058) +
    L(19310, 19576) +
    L(19644, total)
)

# ── Write ──────────────────────────────────────────────────────────────────
(root / "styles.css").write_text(''.join(css), encoding="utf-8")
(root / "data.js").write_text(''.join(data), encoding="utf-8")
(root / "app.js").write_text(''.join(app), encoding="utf-8")
(root / "index.html").write_text(''.join(new_html), encoding="utf-8")

print(f"styles.css:  {len(css)} lines")
print(f"data.js:     {len(data)} lines")
print(f"app.js:      {len(app)} lines")
print(f"index.html:  {len(new_html)} lines  (was {total})")

# ── Sanity checks ─────────────────────────────────────────────────────────
idx = (root / "index.html").read_text(encoding="utf-8")
assert 'styles.css' in idx,   "FAIL: <link> to styles.css missing"
assert 'data.js' in idx,      "FAIL: <script src data.js> missing"
assert 'app.js' in idx,       "FAIL: <script src app.js> missing"
assert idx.count('<style>') <= 2, "FAIL: main inline <style> block still present (too many <style> tags)"
assert 'const VAKKEN' not in idx, "FAIL: VAKKEN data still in index.html"
assert 'const VAKKEN' in (root / "data.js").read_text(encoding="utf-8"), \
    "FAIL: VAKKEN not in data.js"
assert 'const VAKKEN_VWO' in (root / "data.js").read_text(encoding="utf-8"), \
    "FAIL: VAKKEN_VWO not in data.js"
assert 'function startQ' in (root / "app.js").read_text(encoding="utf-8"), \
    "FAIL: startQ() not in app.js"
print("\nAll sanity checks passed ✓")
