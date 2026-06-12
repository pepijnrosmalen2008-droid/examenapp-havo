# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Slagio (slagio.nl) is a free Dutch HAVO/VWO exam preparation PWA. It is a **static site with no build step** — all code is vanilla HTML/CSS/JS, deployed via GitHub Pages.

- **Live URL**: https://slagio.nl (`/havo` and `/vwo` are SPA routes)
- **Deployment**: `git push origin main` → auto-deploys via GitHub Pages
- **Always push directly to `main`** — no feature branches, no PRs

## Files that matter

| File | Purpose |
|---|---|
| `index.html` | Entire app (~18 000 lines). All CSS, HTML, and JS inline. |
| `admin.html` | Admin analytics dashboard |
| `sw.js` | Service worker. Bump `CACHE = 'slagio-vXX'` on every deploy |
| `manifest.json` | PWA manifest |
| `vakken/*.html` | SEO landing pages per subject (do not contain app logic) |
| `ce_data.js` / `examens.js` | Exam question data (referenced externally) |

## Deployment rule

After every change to `index.html`, `admin.html`, or any cached asset: **bump the SW cache version** in `sw.js` line 1:
```js
const CACHE = 'slagio-vXX'; // increment XX by 1
```
Then commit all changed files together and push to `main`.

## index.html architecture

The file is one long document. JS sections are delimited by `// ═══════ SECTION NAME ═══════` comments. Key sections by approximate line number:

| Line | Section |
|---|---|
| 1–5953 | HTML screens + all CSS (inline `<style>`) |
| 5954 | **DATA**: `VAKKEN[]`, `VAKKEN_VWO[]`, `SAM_RICH{}`, `LESMETHODES{}` |
| 8238 | **STATE**: global `ST` object (current quiz session) |
| 8243 | UI helpers, hash routing (`show()`, `_pushHash()`, `_routeFromHash()`) |
| 9576 | Niveau beheer: `APP_LEVEL`, `getVK()` |
| 9807 | Supabase init, `trackEvent()`, `_DID` (persistent device ID), feedback popup |
| 10268 | Profiel, cijfers, cloud sync (`cloudSet/cloudGet`), auth |
| 12068 | Quiz mode picker (`openQmode`, `startQ`) |
| 12211 | Quiz logic (`toonV`, answer handling, timer) |
| 12978 | Results (`toonRes`) |
| 13476 | Studieplan |
| 14209 | Simulatietoets |
| 14625 | Bot Race |
| 15203 | Leaderboard (`loadLeaderboardFromSupabase`, `saveLeaderboardEntry`) |
| 15615 | Countdown + `EXAM_SCHEDULE[]` |
| 15676 | Progress tracking (`saveProgress`, `getProgress`) |
| 15850 | XP/levels |
| 16431 | Daily challenge |
| 16501 | Streak & badges |
| 16870 | Exam schedule (`renderSchedule`, `getCountdownTarget`) |
| 16966 | Grade calculators (SE/CE cijfercalculator) |
| 17247 | Flashcards + SM-2 spaced repetition (`_fcSummary`) |
| 17470 | Pomodoro |
| 18057 | INIT (app startup sequence) |
| 18093 | Bottom nav |

## Key patterns

**Navigation**: `show('sc-X')` switches the visible screen. Screens are `<div id="sc-X" class="sc">`.

**Quiz state**: The global `ST` object holds everything for the current session:
```js
ST = { vak, domein, mode, vragen[], idx, score, antwrd[], timer, tijd:20, ... }
```
`ST.antwrd` entries: `{pts: 0|0.5|1, tijdOver: number}`.

**Score formula** (snelle quiz, max 1000 for 10 questions):
```js
pts*50 + Math.round((tijdOver||0)/20*50)  // tijdOver = seconds remaining when answered
```

**Niveau**: `APP_LEVEL` is `'havo'` or `'vwo'`. `getVK()` returns the correct `VAKKEN` array. All localStorage keys are suffixed via `lvlCol('key')` → `'key_havo'` or `'key_vwo'`.

**VAKKEN structure**:
```js
{ id:'nl', naam:'Nederlands', exDatum:'2026-05-08', exTijd:'13:30–16:30',
  domeinen: [{ id:'A', naam:'Leesvaardigheid',
    sv: [{v:'vraag', a:['opt0','opt1','opt2','opt3'], c:0}],  // snelle quiz (c = index of correct)
    oe: [...]  // oud-examen vragen
  }]
}
```

**Tracking**: `trackEvent(type, meta)` auto-includes `vak_naam` (from `ST.vak`), `niveau`, `naam`, `device`, `did`. Pass only extra data in `meta`.

**Cloud sync**: `cloudSet(col, data)` / `cloudGet(col, def)` — column names correspond to Supabase `profiel` table columns. Progress uses `lvlCol('progress')` → `progress_havo` / `progress_vwo`.

**EXAM_SCHEDULE**: Each entry has `{datum, tijd, vak, duur, niveau:'havo'|'vwo', vakId?}`. Both `getCountdownTarget()` and `renderSchedule()` filter on `niveau === APP_LEVEL`.

## Supabase

- URL: `https://sxrjdssmgwwygtskovyc.supabase.co`
- Key: anon key in both `index.html` (line ~9809) and `admin.html`
- **Tables**:
  - `leaderboard`: `user_id, naam, score, vak_naam, domein_naam, niveau, correct, total, avg_tijd, created_at`
  - `events`: `user_id, naam, event_type, vak_naam, niveau, meta (jsonb), created_at`
    - Known `event_type` values: `app_open`, `flashcard`, `simulatietoets`, `oud_examen_pdf`, `oud_examen_quiz`, `bot_race`, `multiplayer`, `feedback`
    - `meta.device`: `'mobile'|'mobile-pwa'|'desktop'`
    - `meta.did`: persistent device ID (from `localStorage.slagio_did`)
    - `meta.feature` + `meta.rating`: for `feedback` events
    - `meta.domein`: domain name for `feedback` events

## admin.html architecture

```js
loadAll()           // fetches lb, ev, ao (app_open), fb (feedback) in parallel
render(lb, ev, evMissing, ao, fb)  // single render function, rebuilds entire #content
```

**Filter state** (persists across re-renders):
- `window._filter`: `'all'|'7d'|'24h'` — time filter, applied at top of `render()`
- `window._fbVak`, `window._fbDomein`: feedback section vak/domein filters
- Raw data stored as `window._lb`, `window._ev`, `window._ao`, `window._fb`

Filter buttons must call `render(window._lb, window._ev, window._evMissing, window._ao||[], window._fb||[])`.

**Leaderboard filter** (in `loadAll`): `.filter(e => (e.score||0) <= 1000 && (e.total||0) > 5)` — excludes corrupted scores and old 5-question quizzes.

## Adding content

To add questions to a subject, find the vak in `VAKKEN` (HAVO, line ~6623) or `VAKKEN_VWO` (line ~8412) and add to the appropriate domein's `sv` (snelle quiz) or `oe` (oud-examen) array.

To add a new event type to the admin dashboard: add it to the `FEAT` array inside `render()` in `admin.html`.
