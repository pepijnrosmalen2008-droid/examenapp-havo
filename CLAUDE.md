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
| `styles.css` | **All** styles (~10k lines). **Notch**: topbalken krijgen `env(safe-area-inset-top)` via het blok `html.pwa-standalone …` (geïnstalleerde app); volledig-scherm-lagen zoals de pdf-weergave (`.pdf-modal-bar`) doen dat altijd (in de browser is env()=0). Onderaan: **terug- en themaknop** (`.bk`, `.theme-btn`) als rond glas met gedeelde tokens `--kn-glas/--kn-rand/--kn-schaduw`; de chevron komt uit CSS, dus knoplabels zonder "←". Mobile overrides live in the `@media(max-width:640px)` block - including `display:none` rules that hide long descriptive text on mobile (`.sh p`, `.di p`, `#home-bento`, …). |
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
| `lb.js` | Leaderboard, countdown (`getCountdownTarget`), progress tracking, knowledge decay, favorites. **Vandaag-blok op home** (`renderVandaagHub`): eerste item = "Je volgende stap" (ook als grote knop bovenaan via `_vhHero`; de aftelklok blijft altijd groot), weekvoortgang uit dagelijkse momentopnamen van de beheersing per leerdoel (`vgMeting`/`vgVoortgang`, `slagio_vg_<niveau>`), "morgen klaar om te herhalen" (`herhaalMorgenCount`) en een dagelijkse herinnering als agenda-bestand (`agendaKies`/`agendaDownload`, .ics, event `herinnering_agenda`). |
| `features.js` | XP/levels, toasts, daily challenge, streaks & badges, milestone/PB/comeback cards, "de vlag uit", **economie** (munten, streak-freeze, winkeltje `sc-shop`, thema's) |
| `league.js` | Weekwedstrijd/divisies (`sc-league`): weekXP via `addXP`, promotie/degradatie, realistische bot-cohort per week |
| `schedule.js` | `EXAM_SCHEDULE[]`, `renderSchedule()`, grade calculators, flashcards + SM-2 |
| `v4.js` | Misc v4 additions |
| `arcade.js` | **Arcade** (lazy geladen via `arcadeOpen()` in init.js): hub met de twee werelden (Clash, Kingdom) en zes minigames op echte content (bom, boss, risico, zwakke plek, sorteer, val). XP via `addXP()` (dus ook week-XP), antwoorden via `logQuestion()`. Reeksen voor Sorteer staan in `SORT_REEKS`, formulesommen in `BOM_REL`. |
| `arcade2d.js` | **2D-scènes voor de minigames** in Vonk-stijl (vlakke vectorkunst, twee tinten per vorm, geen verloop of gloed). Geladen vóór arcade.js (`arcadeOpen` in init.js). `arcA3(naam,hostId)` in arcade.js zet de scène neer: tijdbom (`a2Bom`), boss-monster in de vakkleur (`a2Boss`), munten + kluis (`a2Risico`), dartbord met Vonk (`a2Zwak`), blokken op een plank (`a2Sorteer`), muizenval (`a2Val`). Game-logica roept haken aan via `a3Haak('bom','knip',i)` enz. (globaal `A3S`). Hub- en intro-illustraties komen uit `a2Art(naam)`. `arcade3d.js` (de oude 3D-scènes) wordt niet meer geladen. |
| `kingdom.js` | **Slagio Kingdom** (lazy geladen via `kingdomOpen()` in init.js): isometrisch eiland met per vak een wijk van 4 gebouwen. Een gebouw komt vrij bij 15/40/70/95% beheerste leerdoelen (`kdVakStand()` in init.js, via `ldMastery`); de leerling bouwt het zelf. Gebouwrecepten in `KB`, thema per vak in `KD_THEMA`, eilandniveaus in `KD_NIVEAUS`. Stand in `lvlCol('slagio_kingdom')`. **2D in Vonk-stijl**: vlakke vlakken in twee tinten, geen randen of verlopen (`kstroke`/`kvg`/`kdefs` in kingdom.js); de wonderen (inwoners, lantaarns, stadsmuur, buiteneiland met watermolen en brug, luchtballonnen, kasteel met vuurwerk) staan in de sectie `WONDEREN (2D)`. **De oude 3D-laag `kingdom3d.js` staat uit** (`KD_3D=false` in kingdom.js); hij laadde na de SVG-kaart (`kdLaad3D`) en nam die over als WebGL werkte (overschrijft `kdRender/kdFocus/kdOverzicht/kdZoom/kdLabels/kdSluit`). Zwevend eiland met gebouwen uit `assets3d/kingdom.glb` (Kenney CC0; bouwen met `scripts/kingdom-assets.mjs`), recept → 3D in `K3R`, groene daken krijgen de vakkleur, ramen lichten 's nachts op. **Bediening**: schuifbaar blad met drie standen (`kdBlad('peek'|'half'|'vol')`, kaart schuift mee via `k3Offset`), pannen met naglijden, knijpen = zoomen rond je vingers, twee vingers draaien/kantelen, dubbeltik, draai-/kompasknoppen (`kdDraai`/`kdNoord`), toetsen. **Wonderen** (`KD_WONDEREN`, één per eilandniveau via `kdWonderAan`): inwoners (mini-characters die over de paden lopen), lantaarns, stadsmuur, buiteneiland met brug, luchtballonnen, groot kasteel met vuurwerk; `kdVier(id)` vliegt erheen. |
| `clash.js` | **Slagio Clash** (lazy geladen via `clashOpen()` in arcade.js): kaartgevecht in een **2D-arena in Vonk-stijl**, getekend op één canvas zonder bibliotheken. Tekenlaag: `clProj(x,hoogte,z)` (veld ligt schuin, `CL_SY`), figuren per kaart in `CL_TEKEN` (`clMens` voor ridder/boog/onderzoeker/wacht/koning, `clRobot`, `clReus`, `clElektron`, `clPtero`, `clRam`, `clTesla`, `clKanon`) met gezichtsuitdrukkingen via `clUitdr`/`clGezicht`; elke figuur krijgt een donkere contour via `clSticker` (los canvas, kader per kaart in `CL_KADER`) en wordt per eenheid 30× per seconde als pose gebufferd (`e._st`), plaats/helling/veer komen er pas bij het neerzetten bij; zachte gloed apart via `CL_GL`, torens in `clToren`/`clRuine`, arena per `CL_ARENAS[].decor` vooraf getekend in `clBouwBg` (gras met plukjes, keienpaden, doorlopende stenen muur, rivier met stenen oever, bruggen met touw, decor met contour via `CL_DKADER`); bewegend water in `clGolven`, vlinders en vogelschaduw in `clLeven`; testscripts zetten `CL.q.vast=true` om de fps-bewaker uit te zetten, effecten via `clFx2(dur,teken,laag)` (`clPoef`, `clVonk`, `clRing`, `clOntploffing`, `clBliksem`, `clBrokken`). Animaties lopen op de spelstaat: `e.f` (looppas), `e.swing` (tijd sinds aanval), `e.juichT`, `e.flits` (witte treffer), `CL.lijken` (omvallen). Kaartportretten tekent `clPortretten()` met dezelfde figuren. Leren = **begrippenflitsen**: korte definitie lezen (bij voorkeur ≤80 tekens, `CL.begKort`; in het gevecht geen omgekeerde vorm, meerkeuzevraag elke 6e), begrip tikken: +1 kennis, +1 als je binnen de gouden balk antwoordt (`CL_SNEL`, klok via `clFlitsKlok`), +1 bij 3+ op rij (`CL.combo`); elke ~35 s een gouden Koningsvraag (`F.goud`: 3 kennis en versterkte kaart); roep-tekst via `clRoep`, lange woorden kleiner via `clWoordMaat`; de bot krijgt navenant soms +2. Gemiste begrippen komen terug en gaan na afloop naar Herhalen (SM-2, `slagio_sr_v1`); domeinen met ≥6 antwoorden via `saveProgress`. Eerste potje: stapsgewijze uitleg (`clTut*`). Clash Royale-lus: inzettijd met klokje, emotes, tiebreaker na de verlenging, **kisten** (4 plekken, open je met goede begrippen: `clKistOpen`), **kaartlevels** (`coll`, `CL_UPGRADE`, +10% per level; bot-level = arena+1) en nieuwe kaarten per arena (`CL_ARENA_KAART`). Fps-bewaker `clBewaak` zet eerst het volume uit (`q.geenVol`), dan minder contour, dan geen contour, dan een lagere resolutie. **Gerenderde look**: `clVolume` geeft elke sticker een lichtrand linksboven, schaduwrand rechtsonder en een verloop van licht naar donker (vierde hulpcanvas `_clS[3]`); torens van grijze steen met dakpannen in teamkleur, gouden bies, licht van links; kaarten met metalen lijst per zeldzaamheid (`.cl-kaart-art.z0`–`z3`), vignet, glans op episch/legendarisch en een donkere achtergrond in `clPortretten`. **Clash Royale-opbouw van het gevecht**: het veld vult de schermbreedte (`clFit`, `CL_SY=.72`, `CL.topPad` 40 op telefoon zodat de HUD over de achtermuur ligt), compact speelpaneel (vraag 132/118 px hoog), klok rechtsboven (`.cl-tijdvak`) en kronen langs de rechterkant (`.cl-kr-zij`), kennisdruppel links van de balk die knippert als hij vol is, kennis loopt als elixer op (1 per 2,8 s, laatste minuut 1 per 1,4 s), VS-scherm voor elk gevecht (`clVsIntro`), raster op je eigen helft tijdens het plaatsen (`clTekenZone`), tegenstander ondersteunt ook kleinere eigen eenheden (tegenaanval). Kaarten in `CL_KAARTEN` (15, vier zeldzaamheden in `CL_ZELD`), bot in `clBot()`. Stand in `arcStore().clash`. **Progressie**: 8 arena's in `CL_ARENAS` (eigen decor per `decor`, eigen rivierkleuren via `water`), nieuwe kaarten per arena in `CL_ARENA_KAART`; kisten volgen de vaste `CL_KISTCYCLUS` (`c.cyclus`) en geven munten (app-munten via `addCoins`); upgraden kost kaarten plus munten (`CL_GOUD`) en geeft koningservaring (`CL_KXP_UPG` → `c.kxp`, levels in `CL_KXP`); het koningslevel maakt je torens sterker (`clKlvlF` in `clMaakToren`, tegenstander = arena+1). Dagelijkse kroonkist na 10 kronen (`clKroon`, `c.kroon`). Bekerweg `clWeg()` met beloningen uit `clWegLijst()` (opgehaald in `c.weg`, op basis van je hoogste stand `c.best`), arenaplaatjes via `clArenaBeeld(i)`. Grote momenten: `clArenaVrij`, `clKoningOmhoog`, kist openen in `clKistBuitScherm` (schudden, deksel `.kd`, stralen, buit stuk voor stuk). **Clash Royale-richting met middeleeuwse strijdsfeer**: alle Clash-schermen zitten in één vaste wereld (tokens op `#arc-stage.arc-t-clash`/`-clash-res`, ook in donkere modus): steen als ondergrond (`--steen-bg`), eikenhout voor balken en panelen (`--hout-bg`), rode banieren met zwaluwstaart voor koppen, perkament (`--perk`) voor vraagpaneel, kaartinfo en grote momenten; letters in thema (alle in `fonts/`, OFL): Cinzel voor titels (`--font-mid`), Alegreya Sans SC voor knoppen, labels en getallen (`--font-head` binnen Clash), Alegreya voor leestekst zoals definities, opties, feiten en uitleg (`--font-lees`, ook `--font`); `font-feature-settings:"lnum"` zet de oude cijfers van Alegreya recht; witte tekst met contour via `--omlijn`, knoppen met donkere rand `--cr-rand`; kennis is roze zoals elixer (`--elix`). Op het veld: oorlogsbanieren aan de achtermuren en vuurkorven bij de bruggen (`CL_VUURKORF`, vlammen in `clVuur`). Geluid: trommels bij het aftellen en een krijgshoorn bij de start en bij winst (`clFx('trom')`, `clFx('hoorn')`); uitslag heet Overwinning/Nederlaag. Beginscherm (`clLobby`) heeft een tabbalk (`CL.tab`: `kaarten` | `strijd` | `weg`, wisselen met `clTab`): Strijd = arena met bekerbalk, gele Strijd-knop en kistplekken; Kaarten = strijddeck 2×4 met gemiddelde kennis, verzameling en nog niet gevonden (`clKaartenHtml`; tik een kaart voor Info/Gebruik, bij Gebruik wiebelt het deck en kies je de kaart die eruit gaat, `CL.wissel`); Bekerweg = `clWegHtml` in hetzelfde paneel. Kisten vallen neer en open je met een tik. Slepen: de kaart volgt je vinger (`.cl-sleepkaart`), plaatsingspunt net boven de vinger, `pointercancel` afgevangen. Hub-beeld `img/arcade-clash.webp` is een samengestelde illustratie met de 2D-figuren; `img/arcade-kingdom.webp` is een opname van het eiland. |
| `vendor/` + `assets3d/` | three.js r170 (MIT) en loaders, plus 3D-modellen. Alleen nog voor de uitgeschakelde 3D-lagen (`kingdom3d.js`, `arcade3d.js`); Clash gebruikt ze niet meer. SW behandelt beide cache-first. Niet in `ASSETS`. |
| `init.js` | Intro modal, tutorial, level select, **INIT (startup)**, bottom nav, multiplayer quiz, flickering grid, push notifications, PWA install banner |
| `onb.js` | Onboarding. **Nieuwe bezoekers krijgen geen intro meer**: na de niveaukeuze roept `chooseLevel` (init.js) `onbStil()` aan, die een standaardmaatje (`MAATJE_STD`, vos) zet, de onboarding-vlaggen markeert en `slagio_maatje_kiezen` zet. Na de eerste quiz komt `maatjeKiezen()` als beloning in de finish-wachtrij (`_RC.maatje`, vóór de accountvraag `_RC.reg`). Wie niet weet welk dier, draait aan het rad (`maatjeRad`/`maatjeDraai`, taartpunten per dier, wijzer bovenaan, event `maatje_rad`). Events `onb_direct`, `maatje_shown`, `maatje_gekozen`. De oude stappen (`ONB_STEPS`, `onbStart`) staan er nog maar worden niet meer aangeroepen. |
| `zoek.js` | **Vraag het Slagio** (`openZoek`, scherm `sc-zoek`): zoekt in vragen, examens, begrippen mét definitie, leerdoel-modules en alinea's uit `SAM_RICH` (`_zkPassages`). Bovenaan een antwoordkaart (`_zkAntwoord`/`_zkAntwoordHtml`): "wat is osmose?" → definitie + uitleg uit de eigen samenvatting, knoppen Lees de uitleg / Oefen dit / Vraag door aan Vonk (`_zkVraagVonk` geeft de stof als bron mee aan `openVonkChat({bron})`). Event `vraag_slagio` met `gevonden` en de vraag: onbeantwoorde vragen tonen welke stof ontbreekt. |
| `examenbieb.js` | **Examenbibliotheek** (`openExamenBieb(vakId)`, scherm `sc-examens`, hash `#examens`, tegel op de home en in "Meer"): per vak het examen met klok (`EXAMEN_SIM`), het interactieve examen (`EXAMENS`), echte CE-vragen (`openCEExamens`) en het archief per jaar/tijdvak via `openPdfViewer` (lb.js; op telefoons via de pdf-weergave van Google, omdat mobiele browsers geen pdf in een iframe tonen). Ook het Slagio-proefexamen, heel (`startProefexamen`) en **per vraag** (`ebProefVragen`/`ebProefOpen`): elke proefexamenvraag wordt een losse oud-examenvraag met context, figuur (`q.afb`, getoond in `#qafb`) en modelantwoord met puntenverdeling, gegroepeerd per opgave in `openOEPicker`. `EB_PE_DOM` koppelt de domeinlabels van de proefexamens aan de domeinen van het vak, zodat "Oud-examen stijl" van een domein ze ook toont (`startQ` in quiz.js); ze staan ook in de zoekindex van Vraag het Slagio (knop "Maak deze vraag"). Events `examenbieb_open`, `examenbieb_start`. |
| `leren/` + `llms.txt` | **Gegenereerd** door `scripts/build-leren.mjs`: openbare leerpagina per leerdoel-module met rijke samenvatting (`/leren/<niveau>/<vak>/<leerdoel>.html`: samenvatting met figuren/clips, voorbeeldvragen met uitleg, schema.org `Quiz` + `LearningResource`), per vak een index en begrippenlijst, `/leren/` en `/llms.txt` voor AI-zoekmachines. Echte pagina's voor mens én zoekmachine (geen doorsturen). Knop "Oefen" linkt naar `/?niveau=&vak=&leerdoel=<id>&oefen=1` (init.js/vak.js openen dan meteen de quiz van dat leerdoel). Daarnaast per vak met een Slagio-proefexamen `/leren/<niveau>/<vak>/examenvragen.html`: alle vragen per opgave met context, figuur en uitklapbaar modelantwoord met puntenverdeling (schema.org `Quiz`), gelinkt vanuit `/leren/`, de vak-index en `llms.txt`. Smoke controleert met `--check` dat ze actueel zijn; `build-sitemap.mjs` neemt `leren/` mee. Niet met de hand bewerken. |
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

**Navigatie op telefoon (<900px)**: kopbalk van de home heeft één menuknop (`.hnav-menu-btn`) die het menu opent als bottom sheet (`openNavSheet`/`closeNavSheet`/`_msGa` in init.js, groepen in `_MS_GROEPEN`, klassen `.ms-*`): veer-animatie, vegen omlaag sluit, Escape sluit; op desktop (>=900px) is het een zwevende kaart en blijft de zijbalk het hoofdmenu. De home heeft onder de aftelklok en de volgende-stap-knop de zoekbalk `.hm-zoekbalk` (opent Vraag het Slagio, wisselend voorbeeld in `#hm-zoekbalk-vb`); Examens/Trainer/Arcade staan op telefoon als één rij `.hm-tegels` (de grote banners alleen op desktop), de vakkenfilter `.sb-wrap` is op telefoon weg. Vraag het Slagio vindt ook onderdelen van de app (`_ZK_APP`, "Ga naar"-rij in `#zoek-app`). Vakpagina heeft tabbladen Onderwerpen/Examens (`vdTab` in examenbieb.js; Examens = `_ebHtml` van dat vak, `_ebTerug='sc-detail'`); `.oefen-panel` is verborgen. Tabblad "Wedstrijd" heet nu "Spelen". Studieplan zonder gekozen vakken toont een vakkenkiezer (`spKiesVak`, klasse `sp-leeg`).

**Rust: weinig pop-ups** (bewuste keuze, niet terugdraaien zonder reden):
- Home: hooguit één ongevraagd ding per bezoek via `homeMoment(naam)` (features.js): weekafsluiting, streak-waarschuwing, welkom van Vonk of installeerbalk. Geen dagelijkse-uitdaging-pop-up (die staat als regel in het Vandaag-blok) en geen dagmissie-ballon. Een weekafsluiting zonder XP en zonder beloning sluit stil af.
- Na een quiz: `_runResultChain` (quiz.js) toont hooguit `RC_MAX`=2 grote momenten op volgorde van belang; een afgevallen kist geeft zijn munten stil.
- In de quiz: één zwevende badge per antwoord (`ST._badge`: comeback > combo vanaf 3 > snelheid), geen Lucky-toast, geen losse XP-toast; prestatie-meldingen wachten tot na de quiz en worden samengevoegd ("+N meer").
- Accountvraag: eerste keer na de eerste quiz, daarna hooguit eens per 3 dagen, maximaal 5 keer. Feedbackvraag: eens per 14 dagen, vanaf de 3e quiz. Installeerbalk: vanaf 3 quizzen, alleen op de home.

**Adaptieve quiz** (`aqSetupAdaptive`/`aqFill` in vak.js): trap op `d`; na een fout eerst een vraag met dezelfde `s` (onderwerp) een niveau lager (`ST.aqFout`, label "Nog een over dit onderwerp"); onderwerpen met veel fouten wegen zwaarder bij de start.

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

**Gouden standaard v2 (per leerdoel) is de lat voor alle nieuwe content:** zie `docs/GOUDEN-STANDAARD-V2.md`. Eén leerdoel = één module in `domein.leerdoelen[]` met `gs:2`, `lo`, `onderwerpen`, 25+ `sv`-vragen (`s`-tag per vraag voor de adaptieve vervolgvraag, uitleg per fout antwoord in `uo`, min. 5 met `ctx`), 10+ begrippen, 5 `oe` met modelantwoord, en een samenvatting met per hoofdstuk een figuur of clip. Werkwijze: `content-pending/<niveau>-<vak>-<id>.json` + `.html` → `node scripts/check-leerdoel.mjs <json> <html>` → `node scripts/render-leerdoel.mjs --html <html>` (screenshots + keuring van de figuren; bekijk de png's) → `node scripts/integreer-leerdoel.mjs <niveau> <vak> <domein> <json> <html>` → `node scripts/split-data.js` → poorten. `validate-goldstandard.mjs` keurt elke `gs:2`-module automatisch (regels in `scripts/lib/leerdoel-v2.mjs`). Na integreren altijd `node scripts/build-leren.mjs && node scripts/build-sitemap.mjs` (smoke faalt anders). De content-routine (`docs/ROUTINE-CONTENT-PROMPT.md`) doet minimaal 5 leerdoelen per run, liefst een heel domein, met een commit per leerdoel. Referentie: havo bi.M3. Een domein met leerdoelen opent het leerdoelenscherm; de samenvatting van het hele domein blijft daar bereikbaar.


To add questions to a subject, edit the **source** files `data-havo.js` (`VAKKEN[]`) / `data-vwo.js` (`VAKKEN_VWO[]`) - the appropriate domein's `sv` (snelle quiz) or `oe` (oud-examen) array - or (preferred) add begrippen and run `node scripts/build-questions.js`.

**Then always run `node scripts/split-data.js`** to regenerate the shipped `data-*.meta.js` + `q/*.js` from the source, and bump the SW cache. `scripts/smoke.mjs` fails if the meta counts drift out of sync with the source, so CI catches a forgotten split.

To add a new event type to the admin dashboard: add it to the `FEAT` array inside `render()` in `admin.html`. Het weekoverzicht (`scripts/social/stats.mjs`) telt functies via `FUNCTIES`/`functieVan`; Arcade en Clash meten `arcade_open`, `clash_start` en `minigame` (spel in `meta.game`).
