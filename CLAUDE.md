# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Slagio (slagio.nl) is a free Dutch HAVO/VWO/VMBO exam preparation PWA. It is a **static site with no build step** - all code is vanilla HTML/CSS/JS, deployed via GitHub Pages.

> **Product north-star / canon:** [`docs/SLAGIO-PRODUCT-VISION.md`](docs/SLAGIO-PRODUCT-VISION.md) — three layers of one product (Student, Slagio School, Slagio AI), all serving one question: *"what does this learner need now to get better?"* Read it before larger product decisions. The linchpin it names is **leerdoel-level mastery** as the shared data spine.

- **Live URL**: https://slagio.nl (`/havo` and `/vwo` are SPA routes)
- **Deployment**: `git push origin main` → auto-deploys via GitHub Pages
- **Default workflow**: push directly to `main` - no build, no feature branches, no PRs. (Automated/agent sessions may be pinned to a feature branch; follow whatever branch the task specifies.)

## Architecture (IMPORTANT - read this)

The app is **no longer a single inline file**. `index.html` is now a thin shell (~2400 lines) that contains only the HTML screens plus SEO metadata (`<script type="application/ld+json">` blocks and a `<noscript>` SEO body). **All CSS lives in `styles.css`** and **all JS lives in separate module files**, loaded in order at the bottom of `index.html` (~line 1961+):

```
examens.js → (supabase CDN) → data.js → state.js → cloud.js → profile.js →
vak.js → quiz.js → tools.js → sim.js → lb.js → features.js → league.js →
schedule.js → v4.js → init.js
```

Load order matters: `data.js`/`state.js` define globals the later modules use. `init.js` runs the startup sequence last. These files share one global scope (no modules/bundler), so a function defined in one file is callable from any later file.

## Files that matter

| File | Purpose |
|---|---|
| `index.html` | HTML screens + SEO (JSON-LD + `<noscript>`). No app logic, no inline CSS/JS. |
| `styles.css` | **All** styles (~10k lines). Onderaan: **terug- en themaknop** (`.bk`, `.theme-btn`) als rond glas met gedeelde tokens `--kn-glas/--kn-rand/--kn-schaduw`; de chevron komt uit CSS, dus knoplabels zonder "←". Mobile overrides live in the `@media(max-width:640px)` block - including `display:none` rules that hide long descriptive text on mobile (`.sh p`, `.di p`, `#home-bento`, …). |
| `data.js` | `LESMETHODES{}`, an **empty** `SAM_RICH{}`, and the lazy-loaders `ensureLevelData()`/`ensureSamData()`/`samReady()` + the per-vak hydration runtime `ensureVakData()`/`__hydrateVak()`/`ensureAllVakData()`/`domCount()`. ~30 KB. |
| `sam-havo.js` / `sam-vwo.js` | The rich summaries (`SAM_RICH` entries, `Object.assign`ed in). ~440 KB each, **lazy-loaded per niveau** via `ensureSamData()` - NOT on the boot path. Add/replace a summary here, not in `data.js`. |
| `data-havo.js` / `data-vwo.js` | **Source of truth** for `VAKKEN[]` / `VAKKEN_VWO[]` (subjects, domains, questions). Written by `build-questions.js`. **Not shipped to the browser directly** - `split-data.js` derives the shipped artifacts from them. |
| `data-havo.meta.js` / `data-vwo.meta.js` | **Shipped, generated** by `scripts/split-data.js`: the full structure with per-domain counts (`nSv`/`nOe`/`nBeg`) but **no** question arrays. Loaded by `ensureLevelData()` on niveau-pick (~15/8 KB gz). Do not hand-edit. |
| `q/<niveau>-<vakId>.js` | **Shipped, generated** per subject: `__hydrateVak(...)` with that vak's `sv`/`oe`/`begrippen` + basic `sam`. Loaded on demand by `ensureVakData()` when a subject is opened. Global features (search) hydrate all via `ensureAllVakData()`. Do not hand-edit. |
| `state.js` | Global `ST` quiz state, `show()` + hash routing, `APP_LEVEL`/`getVK()`/`lvlCol()`, subject grid, security helpers |
| `cloud.js` | Supabase init, `trackEvent()`, `_DID` (persistent device id), `cloudSet()`/`cloudGet()` |
| `profile.js` | Profiel & cijfers (SE grades) |
| `vak.js` | `openVak()` subject detail, uitleg-video's, quiz-draft crash recovery |
| `quiz.js` | Quiz mode picker + quiz logic, keyboard shortcuts, particles/bonuses, achievements, **sound (`GELUID`)**, exit interstitial |
| `tools.js` | Rapport, Studieplan v2, toegankelijkheid, leerpad |
| `sim.js` | Simulatietoets, examen-modus, Race mode |
| `lb.js` | Leaderboard, countdown (`getCountdownTarget`), progress tracking, knowledge decay, favorites |
| `features.js` | XP/levels, toasts, daily challenge, streaks & badges, milestone/PB/comeback cards, "de vlag uit", **economie** (munten, streak-freeze, winkeltje `sc-shop`, thema's) |
| `league.js` | Weekwedstrijd/divisies (`sc-league`): weekXP via `addXP`, promotie/degradatie, realistische bot-cohort per week |
| `schedule.js` | `EXAM_SCHEDULE[]`, `renderSchedule()`, grade calculators, flashcards + SM-2 |
| `v4.js` | Misc v4 additions |
| `arcade.js` | **Arcade** (lazy geladen via `arcadeOpen()` in init.js): hub met de twee werelden (Clash, Kingdom) en zes minigames op echte content (bom, boss, risico, zwakke plek, sorteer, val). XP via `addXP()` (dus ook week-XP), antwoorden via `logQuestion()`. Reeksen voor Sorteer staan in `SORT_REEKS`, formulesommen in `BOM_REL`. |
| `arcade2d.js` | **2D-scènes voor de minigames** in Vonk-stijl (vlakke vectorkunst, twee tinten per vorm, geen verloop of gloed). Geladen vóór arcade.js (`arcadeOpen` in init.js). `arcA3(naam,hostId)` in arcade.js zet de scène neer: tijdbom (`a2Bom`), boss-monster in de vakkleur (`a2Boss`), munten + kluis (`a2Risico`), dartbord met Vonk (`a2Zwak`), blokken op een plank (`a2Sorteer`), muizenval (`a2Val`). Game-logica roept haken aan via `a3Haak('bom','knip',i)` enz. (globaal `A3S`). Hub- en intro-illustraties komen uit `a2Art(naam)`. `arcade3d.js` (de oude 3D-scènes) wordt niet meer geladen. |
| `kingdom.js` | **Slagio Kingdom** (lazy geladen via `kingdomOpen()` in init.js): isometrisch eiland met per vak een wijk van 4 gebouwen. Een gebouw komt vrij bij 15/40/70/95% beheerste leerdoelen (`kdVakStand()` in init.js, via `ldMastery`); de leerling bouwt het zelf. Gebouwrecepten in `KB`, thema per vak in `KD_THEMA`, eilandniveaus in `KD_NIVEAUS`. Stand in `lvlCol('slagio_kingdom')`. **2D in Vonk-stijl**: vlakke vlakken in twee tinten, geen randen of verlopen (`kstroke`/`kvg`/`kdefs` in kingdom.js); de wonderen (inwoners, lantaarns, stadsmuur, buiteneiland met watermolen en brug, luchtballonnen, kasteel met vuurwerk) staan in de sectie `WONDEREN (2D)`. **De oude 3D-laag `kingdom3d.js` staat uit** (`KD_3D=false` in kingdom.js); hij laadde na de SVG-kaart (`kdLaad3D`) en nam die over als WebGL werkte (overschrijft `kdRender/kdFocus/kdOverzicht/kdZoom/kdLabels/kdSluit`). Zwevend eiland met gebouwen uit `assets3d/kingdom.glb` (Kenney CC0; bouwen met `scripts/kingdom-assets.mjs`), recept → 3D in `K3R`, groene daken krijgen de vakkleur, ramen lichten 's nachts op. **Bediening**: schuifbaar blad met drie standen (`kdBlad('peek'|'half'|'vol')`, kaart schuift mee via `k3Offset`), pannen met naglijden, knijpen = zoomen rond je vingers, twee vingers draaien/kantelen, dubbeltik, draai-/kompasknoppen (`kdDraai`/`kdNoord`), toetsen. **Wonderen** (`KD_WONDEREN`, één per eilandniveau via `kdWonderAan`): inwoners (mini-characters die over de paden lopen), lantaarns, stadsmuur, buiteneiland met brug, luchtballonnen, groot kasteel met vuurwerk; `kdVier(id)` vliegt erheen. |
| `clash.js` | **Slagio Clash** (lazy geladen via `clashOpen()` in arcade.js): kaartgevecht in een **2D-arena in Vonk-stijl**, getekend op één canvas zonder bibliotheken. Tekenlaag: `clProj(x,hoogte,z)` (veld ligt schuin, `CL_SY`), figuren per kaart in `CL_TEKEN` (`clMens` voor ridder/boog/onderzoeker/wacht/koning, `clRobot`, `clReus`, `clElektron`, `clPtero`, `clRam`, `clTesla`, `clKanon`), torens in `clToren`/`clRuine`, arena per `CL_ARENAS[].decor` vooraf getekend in `clBouwBg`, effecten via `clFx2(dur,teken,laag)` (`clPoef`, `clVonk`, `clRing`, `clOntploffing`, `clBliksem`, `clBrokken`). Animaties lopen op de spelstaat: `e.f` (looppas), `e.swing` (tijd sinds aanval), `e.juichT`, `e.flits` (witte treffer), `CL.lijken` (omvallen). Kaartportretten tekent `clPortretten()` met dezelfde figuren. Leren = **begrippenflitsen**: definitie lezen, begrip tikken (+1 kennis), gemiste begrippen komen terug en gaan na afloop naar Herhalen (SM-2, `slagio_sr_v1`); domeinen met ≥6 antwoorden via `saveProgress`. Eerste potje: stapsgewijze uitleg (`clTut*`). Clash Royale-lus: inzettijd met klokje, emotes, tiebreaker na de verlenging, **kisten** (4 plekken, open je met goede begrippen: `clKistOpen`), **kaartlevels** (`coll`, `CL_UPGRADE`, +10% per level; bot-level = arena+1) en nieuwe kaarten per arena (`CL_ARENA_KAART`). Fps-bewaker `clBewaak` verlaagt de resolutie. Kaarten in `CL_KAARTEN`, bot in `clBot()`. Stand in `arcStore().clash`. Hub-beelden `img/arcade-clash.webp` / `img/arcade-kingdom.webp` zijn opnames van de 2D-scènes. |
| `vendor/` + `assets3d/` | three.js r170 (MIT) en loaders, plus 3D-modellen. Alleen nog voor de uitgeschakelde 3D-lagen (`kingdom3d.js`, `arcade3d.js`); Clash gebruikt ze niet meer. SW behandelt beide cache-first. Niet in `ASSETS`. |
| `init.js` | Intro modal, tutorial, level select, **INIT (startup)**, bottom nav, multiplayer quiz, flickering grid, push notifications, PWA install banner |
| `examens.js` / `ce_data.js` | Exam PDF / CE question data |
| `admin.html` | Standalone admin analytics dashboard (own Supabase client) |
| `sw.js` | Service worker. `CACHE` const on line 1 + `ASSETS[]` list of cached files. |
| `manifest.json` | PWA manifest |
| `vakken/*.html` | SEO landing pages per subject (no app logic) |

JS sections within each file are delimited by `// ═══════ SECTION NAME ═══════` banners - grep for these to navigate.

## Deployment rule

After every change to `index.html`, `styles.css`, `admin.html`, any `*.js` module, or any other cached asset: **bump the SW cache version** in `sw.js` line 1:
```js
const CACHE = 'slagio-vXX'; // increment XX by 1
```
If you add a **new** file that should be cached, also add it to the `ASSETS[]` array on line 2 of `sw.js`. Then commit all changed files together and deploy.

## Key patterns

**Mini-clips (`sam-clip.js`)**: korte geanimeerde uitleg in samenvattingen. Een clip = SVG-scène + rAF-tijdlijn. De **spec-engine** drijft de meeste clips aan: je schrijft géén `build/render/staticState`, maar een declaratieve `SPECS.<naam>` met `duration`, `cues` (bijschrift-starttijden), `audio` (`[t, geluid]`, via `playSound()`), en `tracks`. Tracktypes: `reveal` (pad tekent in), `fade`, `attr` (bv. `r`), `moveAlong` (`.ball`/`.glow` volgt een pad via f-keyframes), `tangent` (raaklijn + zone-label), `custom`. Een nieuwe clip toevoegen: (1) voeg een `SPECS`-entry toe, (2) injecteer SVG-markup met de bijbehorende klassen (`.sam-clip clip-<naam>` + `.sam-clip-cap/-caps/-bar/-dots`) in de SAM_RICH-entry. `clip-<naam>` koppelt aan `CHOREO.<naam>`; #dots = #cues = #caption-`<p>`'s. Autoplay is stil; SFX pas na een klik. `prefers-reduced-motion`/geen-support → statisch eindbeeld + stappen als tekst. `activering` is nog met de hand geschreven (twee-fase-fysica); de rest komt uit specs.

**Navigation**: `show('sc-X')` (in `state.js`) switches the visible screen. Screens are `<div id="sc-X" class="sc">`; the active one gets `.on`. `.sc{display:none}` / `.sc.on{display:block}` lives in `styles.css`.

**Quiz state**: The global `ST` object (`state.js`) holds everything for the current session:
```js
ST = { vak, domein, mode, vragen[], idx, score, antwrd[], timer, tijd:20, combo, xpThisRound, isDailyChallenge, ... }
```
`ST.antwrd` entries: `{pts: 0|0.5|1, tijdOver: number}`.

**Score formula** (snelle quiz, max 1000 for 10 questions):
```js
pts*50 + Math.round((tijdOver||0)/20*50)  // tijdOver = seconds remaining when answered
```

**Niveau**: `APP_LEVEL` is `'havo'` or `'vwo'`. `getVK()` returns the correct `VAKKEN` array. All localStorage keys are suffixed via `lvlCol('key')` → `'key_havo'` or `'key_vwo'`.

**VAKKEN structure** (`data.js`):
```js
{ id:'nl', naam:'Nederlands', exDatum:'2026-05-08', exTijd:'13:30–16:30',
  domeinen: [{ id:'A', naam:'Leesvaardigheid',
    sv: [{v:'vraag', a:['opt0','opt1','opt2','opt3'], c:0}],  // snelle quiz (c = index of correct)
    oe: [...]  // oud-examen vragen
  }]
}
```

**Tracking**: `trackEvent(type, meta)` (`cloud.js`) auto-includes `vak_naam` (from `ST.vak`), `niveau`, `naam`, `device`, `did`. Pass only extra data in `meta`.

**Cloud sync**: `cloudSet(col, data)` / `cloudGet(col, def)` (`cloud.js`) - column names correspond to Supabase `profiel` table columns. Progress uses `lvlCol('progress')` → `progress_havo` / `progress_vwo`.

**EXAM_SCHEDULE** (`schedule.js`): Each entry has `{datum, tijd, vak, duur, niveau:'havo'|'vwo', vakId?}`. Both `getCountdownTarget()` (`lb.js`) and `renderSchedule()` (`schedule.js`) filter on `niveau === APP_LEVEL`.

## Supabase

- URL: `https://wcfenegohryxhatzxvtw.supabase.co`
- Key: anon key in `cloud.js` (line ~2) and again in `admin.html`
- **Tables**:
  - `leaderboard`: `user_id, naam, score, vak_naam, domein_naam, niveau, correct, total, avg_tijd, created_at`
  - `events`: `user_id, naam, event_type, vak_naam, niveau, meta (jsonb), created_at`
    - Known `event_type` values: `app_open`, `flashcard`, `simulatietoets`, `oud_examen_pdf`, `oud_examen_quiz`, `bot_race`, `multiplayer`, `feedback`
    - `meta.device`: `'mobile'|'mobile-pwa'|'desktop'`
    - `meta.did`: persistent device ID (from `localStorage.slagio_did`)
    - `meta.feature` + `meta.rating`: for `feedback` events
    - `meta.domein`: domain name for `feedback` events

## admin.html architecture

`admin.html` is a self-contained dashboard (its own inline CSS/JS and Supabase client).

```js
loadAll()  // fetches lb, ev, ao (app_open), fb (feedback), ql, ce in parallel
render(lb, ev, evMissing, ao=[], fb=[], ql=[], ce=[])  // single render, rebuilds entire #content
```

**Filter state** (persists across re-renders):
- `window._filter`: `'all'|'7d'|'24h'` - time filter, applied at top of `render()`
- `window._fbVak`, `window._fbDomein`: feedback section vak/domein filters
- Raw data stored as `window._lb`, `window._ev`, `window._ao`, `window._fb`

Filter buttons must call `render()` with the stored raw data.

**Leaderboard filter** (in `loadAll`): `.filter(e => (e.score||0) <= 1000 && (e.total||0) > 5)` - excludes corrupted scores and old 5-question quizzes.

## Adding content

To add questions to a subject, edit the **source** files `data-havo.js` (`VAKKEN[]`) / `data-vwo.js` (`VAKKEN_VWO[]`) - the appropriate domein's `sv` (snelle quiz) or `oe` (oud-examen) array - or (preferred) add begrippen and run `node scripts/build-questions.js`.

**Then always run `node scripts/split-data.js`** to regenerate the shipped `data-*.meta.js` + `q/*.js` from the source, and bump the SW cache. `scripts/smoke.mjs` fails if the meta counts drift out of sync with the source, so CI catches a forgotten split.

To add a new event type to the admin dashboard: add it to the `FEAT` array inside `render()` in `admin.html`.
