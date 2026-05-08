#!/usr/bin/env python3
"""
Split app.js into logical modules.

Modules (load order matters — state.js first):
  state.js    — ST, APP_LEVEL, getVK, show(), routing, cookies, security
  cloud.js    — Supabase, auth, cross-device sync
  profile.js  — profiel, cijfers, animals, avatar, import/export
  vak.js      — open vak, uitleg videos, quiz draft
  quiz.js     — quiz engine, achievements, results
  tools.js    — rapport, studieplan, leerpad
  sim.js      — simulatietoets, examen modus, race mode
  lb.js       — leaderboard, progress tracking, favorites
  features.js — XP, toast, confetti, badges, streak, daily challenge
  schedule.js — rooster, grade calculators, flashcards, spaced repetition, pomodoro
  init.js     — intro modal, tutorial, level select, init, MQ, canvas, notif, PWA
"""
from pathlib import Path
import re

root = Path(r"C:\Users\pepij\examenapp-havo")
src = root / "app.js"

with open(src, encoding="utf-8") as f:
    lines = f.readlines()

total = len(lines)
print(f"Input app.js: {total} lines")

def L(n, m):
    """Lines n..m (1-indexed, both inclusive)"""
    return lines[n-1:m]

# ── Split boundaries (1-indexed line numbers in app.js) ───────────────────
# Determined from section markers:
#   STATE/UI/HASH(1) COOKIE(96) GRID(144) GRAPH(179) NIVEAU(230) SECURITY(436)
#   SUPABASE(461)..PROFIEL(946)
#   PROFIEL(946)..OPEN VAK(1790)
#   OPEN VAK(1790)..QUIZ MODE(2775)
#   QUIZ MODE(2775)..RAPPORT(4109)
#   RAPPORT(4109)..SIMULATIETOETS(4916)
#   SIMULATIETOETS(4916)..BOT SEED(5866)
#   BOT SEED(5866)..XP(6559)
#   XP(6559)..EXAM SCHEDULE(7623)
#   EXAM SCHEDULE(7623)..INTRO MODAL(8506)
#   INTRO MODAL(8506)..end

MODULES = [
    ("state.js",    1,    460),
    ("cloud.js",    461,  945),
    ("profile.js",  946,  1789),
    ("vak.js",      1790, 2774),
    ("quiz.js",     2775, 4108),
    ("tools.js",    4109, 4915),
    ("sim.js",      4916, 5865),
    ("lb.js",       5866, 6558),
    ("features.js", 6559, 7622),
    ("schedule.js", 7623, 8505),
    ("init.js",     8506, total),
]

# ── Write modules ──────────────────────────────────────────────────────────
total_written = 0
for name, start, end in MODULES:
    content = L(start, end)
    (root / name).write_text(''.join(content), encoding="utf-8")
    print(f"  {name:<14} {len(content):>5} lines")
    total_written += len(content)

print(f"  {'TOTAL':<14} {total_written:>5} lines (input: {total})")

# ── Update index.html ──────────────────────────────────────────────────────
idx_path = root / "index.html"
idx = idx_path.read_text(encoding="utf-8")

module_tags = '\n'.join(f'<script src="/{n}"></script>' for n, _, _ in MODULES)
new_idx = idx.replace('<script src="/app.js"></script>', module_tags)
assert new_idx != idx, "FAIL: app.js tag not found in index.html"

idx_path.write_text(new_idx, encoding="utf-8")
print(f"\nindex.html: app.js replaced with {len(MODULES)} module tags")

# ── Update sw.js ───────────────────────────────────────────────────────────
sw_path = root / "sw.js"
sw = sw_path.read_text(encoding="utf-8")

# Bump cache version (v112 → v113)
new_sw = re.sub(r"slagio-v\d+", lambda m: f"slagio-v{int(m.group().split('v')[1])+1}", sw, count=1)

# Replace '/app.js' with all module paths
module_paths = ", ".join(f"'/{n}'" for n, _, _ in MODULES)
new_sw = new_sw.replace("'/app.js'", module_paths)
assert new_sw != sw, "FAIL: sw.js was not changed"

sw_path.write_text(new_sw, encoding="utf-8")
print("sw.js: cache bumped + module paths added")

# ── Sanity checks ──────────────────────────────────────────────────────────
print("\nSanity checks:")
idx_final = idx_path.read_text(encoding="utf-8")
assert "'/app.js'" not in idx_final
assert all(f'/{n}"' in idx_final for n, _, _ in MODULES), "missing module tag in index.html"
print("  index.html ✓")

for name, _, _ in MODULES:
    content = (root / name).read_text(encoding="utf-8")
    assert len(content) > 10, f"{name} is empty!"
print("  all module files non-empty ✓")

assert 'function startQ' in (root / "quiz.js").read_text(encoding="utf-8"), "startQ not in quiz.js"
assert 'startSimToets' in (root / "sim.js").read_text(encoding="utf-8"), "startSimToets not in sim.js"
assert 'saveLeaderboardEntry' in (root / "lb.js").read_text(encoding="utf-8"), "saveLeaderboardEntry not in lb.js"
assert 'let APP_LEVEL' in (root / "state.js").read_text(encoding="utf-8"), "APP_LEVEL not in state.js"
print("  key functions in correct files ✓")
print("\nAll done!")
