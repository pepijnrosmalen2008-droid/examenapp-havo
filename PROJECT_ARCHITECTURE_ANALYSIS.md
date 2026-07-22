# PROJECT_ARCHITECTURE_ANALYSIS.md

**Slagio — Technisch analyserapport t.b.v. transformatie naar AI Education Operating System**
Versie 1.0 · 18 juli 2026 · Gebaseerd op: volledige codebase-scan (v391) + SLAGIO_CLAUDE_CODE_EXECUTION_BRIEF v1.0 + SLAGIO_MASTER_SPECIFICATION v1.0 (documenten 1–21)

> Status: analyse-only. Er zijn in het kader van dit rapport géén codewijzigingen uitgevoerd.
> NB: de werkboom bevat drie niet-gecommitte bestanden (`cloud.js`, `lb.js`, `styles.css`) uit een eerder onderbroken bugfix-taak (mobiel leaderboard / registratie / bot-profielen). Die staan los van dit rapport.

---

## 1. Huidige architectuur

### 1.1 Vorm

Slagio is een **statische Progressive Web App zonder build-stap**: vanilla HTML/CSS/JS, gedeployed via GitHub Pages (push naar `main` = live). Er is geen framework, geen bundler, geen package.json op het kritieke pad. Alle JS-modules delen één globale scope en worden in vaste volgorde geladen:

```
examens.js → (supabase CDN) → data.js → state.js → cloud.js → profile.js →
vak.js → quiz.js → tools.js → sim.js → lb.js → features.js → schedule.js →
v4.js → zoek.js → klas.js → init.js → sam-anim.js → sam-clip.js → ico-swap.js
```

### 1.2 Lagen zoals ze nu bestaan

| Laag | Implementatie | Status |
|---|---|---|
| **Presentatie** | `index.html` (schermen als `<div class="sc">`, `show()`-routing + history API), `styles.css` (~480 KB) | Volwassen |
| **App-logica** | 19 JS-modules, sectie-banners als navigatie | Volwassen, maar globale scope |
| **Content/data** | `data-havo.js` / `data-vwo.js` (bron, 2,4 + 1,65 MB) → gesplitst naar `data-*.meta.js` + 28 `q/<niveau>-<vak>.js` (lazy per vak) + `sam-havo/vwo.js` (rijke samenvattingen) + `ce_data.js`/`examens.js` (CE-archief) | Recent gemoderniseerd (per-vak lazy-load) |
| **Backend** | Geen eigen backend. Supabase (anon key, client-side) voor leaderboard, events, cloud-sync, klassen | Minimaal |
| **Offline pipeline** | `scripts/` — een embryonale content factory (zie §5) | Embryonaal maar reëel |
| **Servicelaag client** | `sw.js` service worker: precache (`slagio-v391`), network-first code, cache-first data, push/periodic-sync | Volwassen |

### 1.3 Sterke punten

1. **Extreem lage kosten en hoge betrouwbaarheid** — statisch + GitHub Pages + Supabase gratis laag; geen servers om te onderhouden.
2. **Recent gesaneerde data-architectuur** — bron (`data-*.js`) is al gescheiden van shipped artifacts (`meta` + `q/`), met een QA-gate (`build-questions.js --check`), sync-controle in `smoke.mjs` (37 checks) en CI (`.github/workflows/ci.yml`). Dit is exact het "generated knowledge is reproduceerbaar"-principe uit de spec, in miniatuur.
3. **Payload-discipline** — niveau-keuze laadt ~15 KB gz metadata; vragen laden per vak (~15–40 KB gz).
4. **Volledige domeindekking** — 143/143 domeinen met rijke samenvatting; 28 vakken over HAVO+VWO.
5. **Werkende feedback-instrumenten** — errata-knop per vraag (`vraag_fout`-events), retentiecurve + admin-dashboard, event-tracking.

### 1.4 Technische schuld

- Eén globale scope; volgorde-afhankelijkheid tussen 19 modules; geen module-systeem.
- `styles.css` ~480 KB monoliet; `index.html` combineert app-shell én SEO-payload én privacybeleid.
- Geen unit-tests; wel rooktest + QA-gate + Playwright-scripts (ad hoc in sessies gebruikt, niet in repo verankerd).
- Duplicatie tussen in-app privacybeleid (`index.html`) en `privacy.html` (moet handmatig synchroon blijven).
- `bot.html` + `scripts/generate-explanations.js` zijn verouderde experimenten (zie §5) die niet op de huidige datastructuur aansluiten.

---

## 2. Bestaande functionaliteiten

### 2.1 Leerling (allemaal gratis, grotendeels anoniem bruikbaar)

- **Snelle quiz** — 10 vragen, 20 s/vraag, scoreformule `pts*50 + tijdbonus` (max 1000); toetsenbord-shortcuts, combo's, XP-surge, geluid (`GELUID`), exit-interstitial, crash-herstel via quiz-draft.
- **Adaptieve quiz** — twee lagen (zie §4.3): cross-sessie weging (AQP) + in-sessie moeilijkheids-staircase op expliciete `d`-velden.
- **Oud-examen-modus** — 644 CE-stijl open vragen met modelantwoord + volledig CE-archief 2019–2025 (opgaven + correctievoorschriften, inline PDF).
- **Simulatietoets** — 3 modi (oefenen/normaal/examen), cijferberekening met normering.
- **Flashcards** — afgeleid uit `begrippen` + geparsede samenvattingen, SM-2 spaced repetition.
- **Rijke samenvattingen** — 143 domeinen, met inline check-vragen, CE-spotlight, leesvoortgang, 11 geanimeerde mini-clips (spec-engine in `sam-clip.js`).
- **Studieplan v2, leerpad, rapport, cijfercalculator** (SE/CE, verbeteradvies), examenrooster, countdown.
- **Gamification** — XP/levels, streaks, 40+ badges, daily challenge, milestone/PB/comeback-kaarten, dier-mascotte met 7 evolutie-stages.
- **Sociaal** — leaderboard per niveau (met bot-opvulling), Bot Race, multiplayer quiz (codes), klassen (`klas.js`: docent maakt klas → code → klas-ranglijst).
- **Zoeken** — globale zoekindex over vragen/samenvattingen/CE-data (`zoek.js` + deep search in `state.js`).
- **Toegankelijkheid** — OpenDyslexic, hoog contrast, reduced-motion-pad voor clips.
- **PWA** — offline, installeerbaar, push/periodic-sync-notificaties.

### 2.2 Docent/school

- Gratis klas-functie (code + ranglijst).
- Scholenpropositie live (`vakken/docenten.html` + `vakken/slagio-school.html`): docentenlaag "Slagio School" (pilot, €500–1.500/jaar) — **de betaalde laag zelf (per-leerling dashboard) bestaat nog niet**.

### 2.3 Beheer

- `admin.html` — zelfstandig dashboard: leaderboard-stats, feature-gebruik, feedback, gemelde vragen (errata), retentiecurve (D1/D7/D14-cohorten), mastery-stats, CE-cijfers.

---

## 3. Database-structuur

### 3.1 Supabase (PostgreSQL, benaderd met anon key vanaf de client)

| Tabel | Gebruik | Kernvelden |
|---|---|---|
| `leaderboard` | Quiz-scores | `user_id, naam, score, vak_naam, domein_naam, niveau, correct, total, avg_tijd, avatar, animal_id, stage_idx, badge_ids, created_at` |
| `events` | Telemetrie | `user_id, naam, event_type, vak_naam, niveau, meta (jsonb), created_at` — event_types o.a. `app_open, flashcard, simulatietoets, oud_examen_*, bot_race, multiplayer, feedback, vraag_fout, ce_cijfer` |
| `profiel` | Cloud-sync per account | kolom-per-collectie via `cloudSet()/cloudGet()`; progress via `lvlCol()` → `progress_havo/vwo` |
| `user_data` | Accountdata | via cloud.js |
| `mastery` | Adaptieve leerlijn per device×vak | `{vak_id, data:{[domein]:{c,t}}}` |
| `klas_*` (RPC's) | Klassensysteem | `klas_create/join/leaderboard/info/score_add/mine` — SECURITY DEFINER RPC's |
| `bot_commands`, `bot_state` | Verouderd bot-portaal (`bot.html`) | ongebruikt in de app |

Auth: Supabase Auth (e-mail + wachtwoord, optionele e-mailbevestiging). **Let op: openstaande gebruikersmelding dat registreren niet lukt; foutafhandeling verhult momenteel de serverfout** (fix klaargezet, niet gecommit).

### 3.2 Client-side (localStorage — het echte "leerlingmodel")

`progress_<niveau>`, `slagio_xp`, streaks, badges, `slagio_mastery`, `slagio_sr_v1` (SM-2), `slagio_aqp_v1` (adaptieve weging per vraag), favorieten, quiz-draft, profiel, `slagio_did` (persistent device-id). Anoniem bruikbaar; sync optioneel.

### 3.3 Content-"database" (bestanden in git)

```
data-havo.js / data-vwo.js      ← bron van waarheid (VAKKEN[]/VAKKEN_VWO[])
  vak { id, naam, exDatum, domeinen[] }
    domein { id, naam, ceStatus, onderwerpen[], sam,
             sv[]  {v, o[4], c, u, d(1|2|3)}     ← snelle quiz
             oe[]  {v, u, bron, jaar, tijdvak}   ← oud-examen
             begrippen[] {t, d} }                ← term→definitie (1.996 stuks)
sam-havo.js / sam-vwo.js        ← SAM_RICH (rijke samenvattingen, HTML)
data-*.meta.js + q/*.js         ← gegenereerde shipped artifacts (split-data.js)
ce_data.js / examens.js         ← CE-vragen + PDF-archiefindex
```

**Gap t.o.v. spec:** dit is een hiërarchie (vak→domein→vraag), géén graph. Er zijn geen leerdoelen, geen concept-nodes, geen relaties, geen versiebeheer per object (alleen git), geen bronregistratie per item, geen confidence-scores.

---

## 4. Huidige vraagengine

### 4.1 Generatie (offline: `scripts/build-questions.js`)

- **Input:** `begrippen` per domein — samengevoegd uit (a) curated bank `scripts/begrippen.js`, (b) bestaande `d.begrippen`, (c) automatische extractie uit SAM_RICH (definitie-kaarten, tabelrijen, sleutelbegrip-lijsten) met stopwoord/lengte/formule-filters.
- **Output: 4 vraaghoeken per begrip** — d1 "Wat betekent «t»?" (definitie herkennen, vak-brede afleiders), d2 "Welk begrip hoort bij…" (term benoemen, vak-breed), d3 "Welke term past bij…" (term benoemen, domein-afleiders = moeilijk), d3 "Wat houdt «t» in?" (definitie herkennen, domein-afleiders). Elke vraag krijgt uitleg (`u`) incl. contrastnoten (UITLEG-map: mitose/meiose e.d.) en expliciete moeilijkheid `d`.
- **Kwaliteitsfilters:** lengte-weggevers, rekenvragen, jaartal-weggevers (badness-score, floor 10 per domein) — aantallen: 510→0 weggevers, 91→0 reken, 4→0 jaartal.
- **QA-gate:** structurele fouten (≠4 unieke opties, ongeldige `c`, lege stam) **blokkeren de write**; verdachte begrippen (aan-elkaar-artefacten) worden gewaarschuwd. `--check`-modus draait in CI.
- **Omvang:** 10.083 vragen totaal = 9.439 sv (waarvan ±6.000 gegenereerd) + 644 oe; 143 domeinen; gem. ~66 sv/domein.

### 4.2 Eerlijke beoordeling t.o.v. de brief

De brief benoemt dit expliciet als **het belangrijkste productprobleem**, en die kritiek is terecht:

- De centrale eenheid is een **term**, geen leerdoel. Vier fraseringen per begrip = breedte in vorm, niet in denkvaardigheid.
- Afleiders zijn **andere termen/definities uit het vak**, geen misconcepties. Er is geen misconceptie-database.
- Er is geen context ("Een plant staat in zout water…"), geen examenvorm-variatie (alles meerkeuze), geen koppeling aan examenpatronen.
- Moeilijkheid = afleider-nabijheid, niet cognitieve stap (herkennen→toepassen→transfer).
- **Wat wél behouden moet blijven** (ook volgens spec doc 4/7): de 3-niveaustructuur, de QA-gate, de reproduceerbaarheid (bron→artifact-pipeline), en de errata-lus.

### 4.3 Adaptieve selectie (runtime: `vak.js`)

- **AQP (cross-sessie):** per vraag (key = eerste 50 tekens van `v`) worden goed/fout bijgehouden in `slagio_aqp_v1`; weging: nieuw 2.0, vaak-fout hoger, beheerst (3+ goed, <20% fout) 0.6, recency-boost +40% na 7 dagen.
- **Staircase (in-sessie):** `aqSetupAdaptive`/`aqFill` serveren oplopend niveau op basis van prestaties, met `qDiff()` die het expliciete `d`-veld leest.
- **Mastery:** per domein `{c,t}` lokaal + gesynchroniseerd naar Supabase `mastery`; gevisualiseerd als beheersingsbalk en gebruikt in leerpad/studieplan.
- **Gap t.o.v. spec (doc 7):** geen vergeetcurve-model op conceptniveau (SM-2 bestaat alleen voor flashcards), geen skill-dimensies (recognition/application/transfer), geen confidence-vraag, geen foutclassificatie, geen priority-score over leerdoelen. Het is — in de woorden van de spec — nog dicht bij "een if-statement", zij het een degelijke.

---

## 5. Bestaande AI-functionaliteit

**Er draait geen AI in runtime.** Alles wat "AI" heet is offline tooling of gearchiveerd experiment:

| Onderdeel | Wat het is | Status |
|---|---|---|
| `scripts/build-questions.js` | Deterministische vraaggenerator + QA-gate (geen LLM) | **Actief**, kern van huidige productie |
| `scripts/split-data.js` | Artifact-generator (meta + q/) | **Actief** |
| `scripts/generate-explanations.js` | Anthropic API-script dat uitleg (`u`) genereert | **Verouderd**: target `index.html` (vragen wonen daar niet meer), model `claude-3-haiku-20240307` (deprecated) |
| `bot.html` + `bot_commands`/`bot_state` | "Bot-portaal" — eerdere aanzet tot een op afstand bestuurbare worker | **Ongebruikt/verouderd** |
| `scripts/download-examens.js`, `upload-examens-supabase.js`, `sync-examens.sh` | CE-PDF-verzameling en -sync | Semi-actief (handmatig) |
| Sessie-gedreven AI-productie | Samenvattingen, clips, vragen, begrippen zijn in Claude Code-sessies geproduceerd en handmatig gecureerd | De facto de "content factory" tot nu toe |
| Rich summaries + spec-engine (`sam-clip.js`) | Declaratieve clip-specs (SPECS/CHOREO) | Actief, geen LLM |

**Conclusie:** de "Autonomous Content Factory" bestaat vandaag als *mens-in-de-lus pipeline* (sessies + deterministische scripts + QA-gate + CI). Dat is een goed fundament — precies de "deterministische laag" die spec-document 8 voorschrijft — maar er is geen agent-framework, geen task queue, geen prompt-versiebeheer, geen evidence ledger, geen LLM-productie in de lus.

---

## 6. SEO-structuur

- **179 statische landingspagina's** in `vakken/`: per vak (28×, met per-vak vraagaantallen), per domein (112×, met echte per-domein-tellingen), plus docenten/scholen, calculators, examenrooster.
- **App-URL's = SEO-URL's:** `openVak`/`openDomein` pushState'en naar dezelfde `/vakken/...`-paden als de statische pagina's; `/havo` en `/vwo` zijn SPA-routes in de SW.
- **Structured data:** JSON-LD op index (WebApplication, FAQPage, Course-achtig), FAQ op faq.html, LearningResource-achtige blokken op vakpagina's; `<noscript>` SEO-body in index.html.
- **AI-SEO:** `llms.txt` (recent geactualiseerd naar 10.000+ vragen), `robots.txt`, `sitemap.xml` (+ domein-fragment-generator in scripts/).
- **Actualiteit:** alle teltellingen (site-breed 10.000+, per vak, per domein) zijn deze maand gesynchroniseerd met de werkelijke data.
- **Gap t.o.v. spec (doc 15):** geen zoekintentie-classificatie, geen topic-cluster-architectuur op begripsniveau (pagina's stoppen op domeinniveau; geen `/begrip/osmose`-laag), interne links handmatig i.p.v. graph-gedreven, geen SERP/coverage-monitoring, geen content-refresh-signalen.

---

## 7. Technische beperkingen

1. **Geen backend / geen server-side compute.** GitHub Pages serveert alleen bestanden. Alles wat de spec "Layer 1–2" noemt (crawlers, PDF-pipeline, schedulers, queues) kan niet in de huidige hosting draaien; het moet óf offline (lokale worker/CI) óf in nieuwe infrastructuur.
2. **Supabase met anon key client-side.** Prima voor de huidige laag-risico data, maar ongeschikt als fundament voor een Knowledge Graph, AI-jobs of docent-analytics met leerlingdata (autorisatie, RLS-complexiteit, misbruikrisico). De klas-RPC's laten zien hoe het wel kan (SECURITY DEFINER), maar dat model schaalt beperkt.
3. **Content in git als JS-bestanden.** Werkt uitstekend tot ~MB-schaal, maar: geen per-object versiegeschiedenis, geen relaties, geen queries, geen gelijktijdige schrijvers. De 2,4 MB `data-havo.js` nadert de grens van comfortabel hand-/toolmatig bewerken.
4. **Eén globale JS-scope zonder modules of types.** Elke nieuwe subsysteem-toevoeging verhoogt het risico op naamconflicten (recent nog: `.a`-classbotsing) en maakt refactoren duur.
5. **Geen geautomatiseerde browser-tests in de repo.** Playwright-verificatie gebeurt ad hoc; regressies op UI-flows worden alleen door de rooktest (structuur) en handwerk gevangen.
6. **Kritieke user-flows met openstaande bugs:** registratie faalt (oorzaak vermoedelijk server-side Supabase-instelling; betere foutweergave klaargezet), leaderboard was op telefoons onbereikbaar (fix klaargezet). Beide **niet gecommit** in afwachting van instructie.
7. **Éénpersoons-governance.** Deploy = push naar main. CI vangt datastructuur, niet gedrag.
8. **Juridische grens examens:** CE-materiaal wordt gearchiveerd/geserveerd met bronvermelding; de spec-eis (analyse-laag strikt scheiden van publicatie-laag) is nog niet geformaliseerd.

---

## 8. Verschillen: huidige situatie vs. gewenste AI OS-architectuur

| Spec-component (doc) | Gewenst | Huidig | Gap |
|---|---|---|---|
| **Knowledge Intelligence Layer** (1, 6, 12) | Knowledge Graph: leerdoelen, concepten, relaties, versies, confidence, canonical vs generated | Hiërarchie vak→domein→{sv,oe,begrippen,sam}; begrippen (1.996) zijn embryonale ConceptNodes; canonical/generated-scheiding bestaat al op bestandsniveau (bron vs artifacts) | **Groot** — geen leerdoelen, geen relaties. Wel: 143 domeinen + syllabus-gebaseerde samenvattingen als grondstof |
| **Curriculum Engine** (5, 8) | Syllabus-parser, leerdoel-database, coverage-matrix, drift-detectie | Domeinindeling volgt officiële syllabus; CE/SE-status per domein; geen leerdoelen, geen coverage per leerdoel | **Groot** |
| **Exam Intelligence** (6, 14) | PDF-mining, vraagextractie, correctievoorschrift-parsing, skill-classificatie, trends, misconception-mining | CE-archief 2019–2025 compleet + 644 getranscribeerde oe-vragen met metadata (jaar, tijdvak, bron) + download/sync-scripts | **Middel** — de dataverzameling bestaat; de anályse (skills, patronen, misconcepties) ontbreekt |
| **Question Intelligence** (4, 12) | Leerdoel+vaardigheid+context+misconceptie+examenvorm → vraag; families; levenscyclus; per-vraag statistiek | Term→4 hoeken; QA-gate; adaptieve weging per vraag (AQP) client-side; errata-lus | **Groot maar met fundament** — pipeline, gate, feedbackkanaal en 3-niveaus bestaan; didactisch model ontbreekt |
| **Content Factory** (5, 17) | Autonome agents, quality gates ≥8.5, scheduler, lokale worker | Mens-in-de-lus: sessies + deterministische scripts + smoke/CI + handmatige review; verouderde aanzet (`bot.html`, `generate-explanations.js`) | **Middel** — de werkwijze bestaat, de autonomie niet |
| **Adaptive Learning Engine** (7) | Learning State (honderden variabelen), vergeetcurve, Learning DNA, misconceptie-profiel, priority-score, foutclassificatie | AQP-weging + staircase + mastery per domein + SM-2 (flashcards) + retentiemeting | **Groot** — huidige engine is degelijk maar 1-dimensionaal |
| **AI Tutor** (7, 16) | Persoonlijke tutor met leerling-context, socratisch | Niets (bewust: uitleg per vraag is statisch) | **Volledig** |
| **SEO Intelligence** (15) | Intent-classificatie, topic clusters op begripsniveau, graph-gedreven interne links, SERP-monitoring | 179 pagina's, JSON-LD, llms.txt, sitemap, accurate tellingen | **Middel** — sterke basis, geen intelligentie-laag |
| **Technische stack** (9, 18) | Next.js + FastAPI + PostgreSQL + Neo4j + pgvector + Redis/Celery + S3 | Statisch vanilla + Supabase (PostgreSQL!) + GitHub Pages | **Fundamenteel andere vorm** — zie advies hieronder |
| **Student Experience** (16) | Dashboard "dit moet jij vandaag doen", missies, confidence, countdown-fasen | Home met daily challenge, leerpad, studieplan, countdown; geen diagnose-gedreven dagplan | **Middel** |
| **Business** (19) | Freemium leerling + scholen | Leerling 100% gratis (bewuste keuze, afwijkend van spec doc 19!), schoollicentie in pilot | **Afwijking is beleidskeuze** — eigenaar heeft expliciet gekozen: leerling betaalt nooit; monetisatie via docentenlaag |

**Belangrijkste inzicht uit de gap-analyse:** de spec beschrijft een doelarchitectuur die qua *vorm* (Next.js/FastAPI/Neo4j) ver van de huidige codebase staat, maar qua *principes* verrassend dicht bij wat er al is gegroeid: bron-vs-artifact-scheiding, deterministische pipeline vóór LLM-inzet, QA-gate vóór publicatie, reproduceerbare content, feedback-lussen. De transformatie hoeft dus geen herbouw te zijn — het is het **formaliseren en uitbouwen van een pipeline die al half bestaat**, plus het toevoegen van de ontbrekende kennislaag (leerdoelen) als nieuwe bron van waarheid.

**Kritische noot bij de spec (eerlijkheid verplicht):** de aanbevolen stack-migratie (Next.js + FastAPI + Neo4j + Redis) staat op gespannen voet met brief-principe 2 ("behoud bestaande functionaliteit, geen grote herschrijvingen zonder noodzaak") en met de realiteit van één ontwikkelaar + €0 infra. Advies: de spec-principes overnemen, de spec-stack **niet** als voorwaarde behandelen. Supabase ís al PostgreSQL (met pgvector beschikbaar); de "graph" kan als relationeel schema + edges-tabel beginnen; de "worker" kan als lokale Node/Python-service of GitHub Actions draaien. Neo4j/Redis/FastAPI pas overwegen wanneer een concrete schaalgrens dat afdwingt.

---

## 9. Gefaseerd implementatieplan

Uitgangspunten (conform brief): analyse vóór implementatie ✅ (dit rapport); bestaande functionaliteit blijft werken; modulair; kwaliteit boven volume; curriculum-first. Elke fase levert zelfstandig waarde en is te stoppen zonder half-af systeem.

### Fase 0 — Hygiëne (dagen)
1. Openstaande bugfixes afronden en committen (mobiel leaderboard, registratie-foutweergave, bot-profielen) — kritieke user-flows eerst.
2. Playwright-flows uit de sessies verankeren in `scripts/e2e/` + CI (registratie, quiz, flashcards, leaderboard, zoeken).
3. `bot.html` + `generate-explanations.js` markeren als deprecated (of verwijderen) om verwarring met de nieuwe factory te voorkomen.

### Fase 1 — Knowledge Layer v1: leerdoelen als data (1–2 weken bouwtijd)
*Spec: doc 5/6/12 · Brief: Fase 2*
1. Nieuw bronbestand `knowledge/leerdoelen-<niveau>.json`: per domein de officiële leerdoelen/eindtermen uit de syllabus (`{code, omschrijving, skills[], begrippen[], ce}`), handmatig/AI-geassisteerd gevuld vanaf syllabi — start met **1 vak (HAVO Biologie)** zoals spec doc 18 voorschrijft.
2. `begrippen.js` + `d.begrippen` koppelen aan leerdoel-codes (nieuw veld `lo`).
3. Coverage-matrix-generator (`scripts/coverage.js`): per leerdoel → samenvatting? vragen? flashcards? examenvragen? → markdown/JSON-rapport (de "Curriculum Coverage Matrix" uit doc 5). **Geen runtime-wijziging; puur data + rapportage.**
4. Smoke-checks uitbreiden: elk leerdoel bestaat, elke gekoppelde vraag verwijst naar bestaand leerdoel.

### Fase 2 — Question Intelligence v2 (2–4 weken)
*Spec: doc 4 · Brief: Fase 3 — topprioriteit van de eigenaar*
1. **Misconceptie-database** `knowledge/misconcepties.json` per leerdoel (bronnen: correctievoorschriften, errata-meldingen (`vraag_fout`-events!), vakdidactiek). De bestaande UITLEG-contrastmap is het zaadje.
2. `build-questions.js` → **v2**: generator werkt per *leerdoel* i.p.v. per term; blueprint-stap (leerdoel + vaardigheid + context + misconceptie → vraagontwerp) vóór formulering; afleiders uit misconcepties; contexten uit een contextbank per vak. LLM-stap (via API, offline) voor natuurlijke formulering, met de bestaande QA-gate + nieuwe checks (readability, eenduidigheid, geen "AI-Nederlands") — output blijft gewoon `sv[]` met extra metadata (`lo`, `skill`, `mc`), dus **runtime en dataformaat blijven compatibel**.
3. Vraag-metadata uitbreiden zonder de app te breken: `{d, lo, skill}` — `qDiff` leest al `d`; adaptieve engine kan later `skill` benutten.
4. Kwaliteitsnorm: score-rubric (correctheid/curriculum/taal/didactiek/examengerichtheid), drempel 8.5, log per vraag (`generation.jsonl`: prompt-versie, model, score) — het "evidence ledger" in minimale vorm.
5. Per vak uitrollen; oude term-vragen per domein vervangen zodra v2-set de floor haalt (kwaliteit boven volume: totaalaantal mág dalen).

### Fase 3 — Content Factory v1: mens-in-de-lus, gestandaardiseerd (2–4 weken, parallel aan 2)
*Spec: doc 5/17 · Brief: Fase 4*
1. `factory/`-map: prompt-versiebeheer (`prompts/<agent>/vN.md`), pipeline-runner (Node), task-definities als JSON.
2. Pijplijnen als losse, herdraaibare stappen: research-package (uit lokale kennisbestanden + CE-archief) → curriculum-check (leerdoel-match) → generatie → review-scores → **draft-branch** (nooit direct main). Publicatie blijft een menselijke merge.
3. Lokale worker (optioneel, doc 17): hetzelfde script headless op de eigen pc/CI-schedule voor batchtaken ('s nachts vragen reviewen, coverage-rapporten).
4. Regression-set: 100 gouden vragen; elke prompt/modelwijziging wordt daartegen gescoord (doc 11 h8).

### Fase 4 — Adaptive Learning v2 (4–8 weken)
*Spec: doc 7 · Brief: Fase 5*
1. Learning State per leerling verrijken (client-side, privacy-vriendelijk): mastery per **leerdoel** (niet alleen domein) × skill-dimensie (herkennen/toepassen), vergeetfactor (SM-2-model veralgemenen van flashcards naar vragen).
2. Vraagselectie → priority-score: leerdoel-belang (CE-status, examenfrequentie uit oe-metadata) × vergeetcurve × mastery-gat × misconceptie-focus. Vervangt AQP-weging incrementeel (feature-flag).
3. "Explain after wrong" v2: bij fout de misconceptie benoemen (metadata is er dan) + gerichte vervolgvraag uit dezelfde familie.
4. Confidence-vraag (1 tik) na antwoord, opslaan in Learning State.
5. Dashboard-kaart "Vandaag": 3 zwakste leerdoelen → directe oefenknop (doc 16 h3), bovenop bestaand leerpad.

### Fase 5 — Exam Intelligence verdieping (parallel/doorlopend)
*Spec: doc 14*
1. Bestaande 644 oe-vragen + correctievoorschriften annoteren met leerdoel + skill (LLM-geassisteerd, batch, offline).
2. Trend-rapport per leerdoel (welke jaren getoetst, welke vorm) → voedt priority-score (F4) en "kwam voor in 2024/2023/…" op samenvattingen (doc 5 h14).
3. Juridische scheiding formaliseren: analyse-metadata publiek, examentekst alleen zoals nu (archief met bronvermelding).

### Fase 6 — AI Tutor (pas na F2+F4; 2–3 maanden erna)
*Spec: doc 7/16 · Brief: Fase 6*
- Vereist een server-side component (API-key mag nooit client-side): eerste echte backend-noodzaak. Opties: Supabase Edge Functions (blijft in bestaand ecosysteem) of kleine FastAPI-service. Tutor krijgt context uit Learning State + leerdoelen + misconcepties. Begin als "uitleg-op-maat na fout", niet als open chat.

### Wat bewust NIET in dit plan zit
- Stack-herbouw (Next.js/Neo4j/Redis) — geen noodzaak aangetoond; heroverwegen bij concrete schaalgrens.
- Freemium voor leerlingen (spec doc 19) — overruled door eigenaarsbeleid: leerling blijft gratis.
- Autonome publicatie zonder mens — quality gates + draft-branches blijven verplicht (brief §10, spec doc 17 h18).
- Massale programmatic SEO op begripsniveau vóór de kennislaag bestaat (brief §13: nooit duizenden pagina's zonder kwaliteit).

### Mijlpaal-criteria (Definition of Done per fase, conform brief §14)
Elke fase: werkende code + tests/checks in CI + documentatie in `docs/` + bestaande 37 smoke-checks groen + geen regressie op de e2e-flows.

---

*Einde rapport. Wacht op goedkeuring/instructies voordat er iets wordt gebouwd of gewijzigd.*
