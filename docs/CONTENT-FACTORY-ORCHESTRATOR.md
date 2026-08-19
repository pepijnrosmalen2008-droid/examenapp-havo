# Slagio Content Factory - Audit + Orchestrator-specificatie

**Status:** ontwerp (geen nieuwe engine-architectuur) - **Bouwt op:** `ARCHITECTURE-CURRICULUM-ENGINE.md` (bevroren), `CONTENT-ENGINE-V2.md`, `F1.55-CURRICULUM-FACTORY.md`, `SLICE0-DEFINITION-OF-DONE.md`
**Aanleiding:** Master Design Brief "Slagio Content Factory" (lokaal draaiende, autonome contentfabriek vanuit PowerShell).

---

## 0. Kernconclusie (lees dit eerst)

Het brief vraagt om een **autonome contentfabriek**, geen vraaggenerator. Dat onderscheid is juist. Maar de belangrijkste vondst van deze audit is:

> **~80% van het brief bestaat al als deterministische code.** De vijf-lagen-architectuur, de query-gedreven producers, de read-only analyzers, de review-gates en het canonical knowledge model zijn gebouwd en bewust bevroren. Het brief is - net als "Content Engine 2.0" - een **vulling- en orkestratieoperatie, geen herontwerp.**

Wat echt ontbreekt is smal en scherp te benoemen:

1. **De orchestrator** - de lokale runner die de bestaande engines aan elkaar rijgt met checkpointing, caching, model-routing en een repair-loop. Dit is het hart van het brief en het grootste echte gat.
2. **De Summary Engine** - `leerdoel -> SAM_RICH` als generator (nu handmatig; ik schrijf elke samenvatting met de hand).
3. **De clip-opportunity-detector** - een node boven de bestaande `sam-clip.js` spec-engine die beslist of beweging didactisch nut heeft.
4. **De API-motor in de draft/proza-stappen** - deze cloud-omgeving heeft **geen `ANTHROPIC_API_KEY`**; jouw lokale PowerShell-omgeving wel. Precies daarom hoort de fabriek lokaal thuis.

De rest (knowledge, vragen-spec, evaluatie, uitleg-schema, begrippen, flashcards/SM-2, oude examens, overclaim-check, gouden-standaard-poort) bestaat en moet vooral *aangeroepen* worden, niet *bedacht*.

---

## 1. Brief -> bestaande code (de reuse-map)

Elke sectie van het brief, met verdict **BESTAAT / UITBREIDEN / NIEUW** en het bestand dat het levert.

| Brief-sectie | Verdict | Bestaand component |
|---|---|---|
| 4 · Canonical knowledge (concepten, definities, causale relaties, misconcepties, often_confused_with) | **BESTAAT** | `knowledge/havo/<vak>.json` + `scripts/semantic.js` (triples, gratis reasoning) + `scripts/curriculum-graph.js` (179 concept-nodes) |
| 4 · "UNCERTAIN -> review, geen feiten verzinnen" | **BESTAAT (principe)** | Review-gates: `reviewStatus` draft/reviewed/approved; harde regel "generation is afgeleid, knowledge is de enige waarheid" |
| 5 · Leerdoel-samenvatting (SAM_RICH) | **NIEUW (generator)** | Data-vorm bestaat (`SAM_RICH` in `sam-*.js`); de **Summary Engine** die hem uit het leerdoel afleidt bestaat nog niet |
| 5E · Visuele kansen (detector) | **NIEUW (detector)** | Spec-engine `sam-clip.js` (`SPECS`/`CHOREO`) bestaat; de opportunity-detector erboven niet |
| 6 · Begrippen -> flashcards (begrippen = single source) | **BESTAAT** | `scripts/begrippen.js`; flashcards + SM-2 in `herhalen.js`/`schedule.js`; begrippen zijn al de bron |
| 7 · 25 vragen, R1-R5 mix, quota configureerbaar | **BESTAAT (spec) + UITBREIDEN (quota-beleid)** | `scripts/question-engine.js` (query-gedreven spec); R-niveau `d` bestaat; quota-mix hoort in de pipeline, niet de engine |
| 8 · Vraagvariatie / duplicaatdetectie (concept, redenering, context) | **UITBREIDEN** | `evaluation-engine.js` doet tekstuele dubbel-detectie; semantische dedup (zelfde redenering/misconceptie) toevoegen |
| 9 · Afleider-taxonomie (MISCONCEPTION/CONTEXTUALLY_TRUE/...) | **BESTAAT (blueprint)** | `SLICE0-DEFINITION-OF-DONE.md` afleider-taxonomie; per-optie-uitleg `uo` draagt de "waarom kiest een leerling dit" |
| 10 · Antwoord-integriteit (1 juist, geen bias, lengte, positie) | **BESTAAT** | `validate-goldstandard.mjs` + `check-leerdoel.mjs` (positie <=40%, lengte-bias <=40%, 4 unieke opties, geldige c) |
| 11 · Adaptieve uitleg (why_correct/why_wrong/misconception/memory_tip) | **BESTAAT** | Vraag-schema `u`/`uo[4]`/`uh`; `build-foutenboek-uitleg.js`; frontend toont per-optie-uitleg |
| 12 · Examencontext in vragen | **UITBREIDEN** | `oe`-array bestaat; contextdiversiteit (grafiek/tabel/casus) als quota in de pipeline |
| 13 · Oude examens koppelen (niet genereren) | **BESTAAT** | `ce_data.js` (290 echte CE-vragen, jaar/tijdvak) + `ce-oud.js` (self-contained filter) |
| 14 · Visual engine (NO VISUAL als statisch beter is) | **NIEUW (detector)** | zie 5E |
| 15 · Multi-layer evaluation (Gate A-H) | **BESTAAT (grotendeels)** | `evaluation-engine.js` + `overclaim-check.js` + `validate-goldstandard.mjs` + `smoke.mjs`; mapping in sectie 3 |
| 16 · Hard fail (nooit auto-publiceren bij feitfout/dubbel/gat) | **BESTAAT** | Gouden-standaard-poort blokkeert (`exit 1`); `smoke.mjs` bewaakt in CI |
| 17 · Autonome repair-loop (regenereer alleen Q17) | **NIEUW** | Kern van de orchestrator; bestaat nog niet |
| 18 · Model-routing (goedkoop/sterk/deterministisch) | **NIEUW** | Orchestrator-beleid; bestaat nog niet |
| 19 · Caching (per stap lokaal opslaan) | **NIEUW** | Orchestrator; `content-pending/*.json` is een primitieve voorloper |
| 20 · Checkpointing (NOT_STARTED..APPROVED, resume) | **NIEUW** | Orchestrator |
| 21 · Batch-modus (`generate --level vmbo --all`) | **NIEUW (runner) + BESTAAT (selectie)** | `curriculum-query.js` levert al "welke leerdoelen, welke status"; de runner eromheen is nieuw |
| 22 · Quality report per leerdoel + per vak | **UITBREIDEN** | `evaluation-engine.js` levert score/metrics; het rapport-format samenstellen is nieuw |
| 23 · Orchestrator + workers | **NIEUW** | Dit document specificeert het |
| 24 · De pipeline (curriculum -> ... -> export -> Slagio) | **BESTAAT (als losse stappen)** | Alle stappen bestaan; de **keten** is wat ontbreekt |

**Samengevat:** 3 echte generatieve gaten (Summary Engine, clip-detector, semantische dedup) + 1 orkestratielaag (checkpoint/cache/route/repair/batch/report) + het lokaal inpluggen van de API-motor. Al het overige is aanroepen wat er is.

---

## 2. Waarom dit lokaal moet (en niet in deze sessie)

Twee harde omgevingsfeiten, geen ontwerpkeuze:

- **Geen `ANTHROPIC_API_KEY` in deze cloud-sessie** -> een script kan hier de API niet autonoom aanroepen. De creatieve stappen (canonical knowledge draften, vraagproza, uitleg) draaien nu daarom *interactief via mij*. Dat is precies de dure route die het brief wil vermijden.
- **Jouw PowerShell-omgeving heeft die sleutel wel.** Daar hoort de fabriek: `node`/PowerShell roept de bestaande deterministische engines aan en doet de LLM-calls zelf, batch, 's nachts, hervatbaar.

De juiste rolverdeling:

| | Deze Claude-sessie (duur, interactief) | Lokale factory (goedkoop, autonoom) |
|---|---|---|
| Doet | de engine *ontwerpen*, gates schrijven, 1 vertical slice bewijzen | duizenden leerdoelen *draaien* via die engine |
| Model | Opus, per stap | routing: cheap/strong/deterministisch (sectie 4) |
| Frequentie | eenmalig goed | herhaald, schaalbaar |

Dit is exact jouw slotadvies: eerst ontwerpen/auditen, dan een slice, dan de lokale batchrunner.

---

## 3. Multi-layer evaluation: brief Gate A-H -> bestaande checks

De poort bestaat grotendeels al; dit is de mapping en wat resteert.

| Brief-gate | Bestaat als | Rest |
|---|---|---|
| A · Curriculum ("staat dit in het leerdoel?") | `tag-leerdoelen.js` koppeling-status `matched`; gouden-poort eist koppeling | - |
| B · Feitelijkheid | **LLM-review (pluggable)** - deterministisch niet te vangen | de sterke-model-stap in de factory |
| C · Vraagkwaliteit (1 juist, plausibel, geen bias) | `validate-goldstandard.mjs` + `check-leerdoel.mjs` (positie/lengte/opties/c) | - |
| D · Coverage (alle onderdelen behandeld?) | `leerdoel-dekking.js` + `onderwerpen[]` per leerdoel | onderwerp-dekking hard maken |
| E · Examenkwaliteit (niveau passend) | `d` R-niveau + `gewicht` in knowledge | R-mix als quota-check |
| F · Uitlegkwaliteit | `uo`/`uh` verplicht in `check-leerdoel.mjs` | inhoudelijke uitleg-review = LLM |
| G · Duplicatie | `evaluation-engine.js` (tekstueel) | **semantische dedup toevoegen** |
| H · Canonical precision (geen overclaim) | `overclaim-check.js` + gouden-poort OVER-patronen | - |

De twee resterende inhoudelijke gates (B feitelijkheid, F uitleg-diepte) zijn *per definitie* LLM-werk; de deterministische code kan ze niet vervangen, alleen omlijsten. Alle structurele gates (C/G/H + positie/lengte/schema) draaien al zonder LLM.

---

## 4. De orchestrator-specificatie (het ontbrekende hart)

Een lokale node-CLI (aanroepbaar vanuit PowerShell), geen nieuwe architectuurlaag - in termen van de bevroren architectuur is dit een **Orchestrator** (bestaand engine-type), die uitsluitend via de Query Engine leest en de bestaande Producers/Analyzers aanroept.

### 4.1 CLI-oppervlak

```
slagio-factory generate --level havo --subject bi --domain O        # heel domein
slagio-factory generate --level havo --subject bi --lo bi.O.4        # één leerdoel
slagio-factory generate --level vmbo --all                          # alles wat ontbreekt
slagio-factory resume                                               # hervat laatste run
slagio-factory report --level havo --subject bi                     # quality report
```

De runner bepaalt zelf *wat ontbreekt* via `curriculum-query.js --json` (leerdoelen zonder approved content) - hij kiest nooit blind.

### 4.2 Per-leerdoel state machine (checkpointing, sectie 20)

```
NOT_STARTED -> KNOWLEDGE -> SUMMARY -> TERMS -> QUESTIONS -> EXPLANATIONS
            -> VISUAL -> EVALUATE -> (REPAIR loop) -> APPROVED | REJECTED
```

Elke stap schrijft zijn output + status naar de cache voordat de volgende begint. `resume` leest de laatste status en gaat verder. Een crash op stap QUESTIONS verliest KNOWLEDGE/SUMMARY/TERMS niet.

### 4.3 Cache-layout (sectie 19)

```
factory-cache/<niveau>/<vak>/<leerdoel-id>/
  knowledge.json      # canonical knowledge (LLM strong)
  summary.json        # SAM_RICH-blok (LLM strong + clip-detector)
  terms.json          # begrippen (afgeleid uit knowledge)
  questions.json      # 25 vragen-specs -> proza (LLM)
  explanations.json   # per-optie uo/uh (kan in questions.json)
  visual.json         # clip-SPEC of {novisual, reason}
  evaluation.json     # alle gate-uitslagen + score
  status.json         # {stap, status, hashes, model-per-stap, timestamps}
```

`content-pending/ld-*.json` (mijn huidige handmatige drafts) is hiervan de primitieve voorloper: één bestand per leerdoel. De cache splitst dat per stap zodat repair chirurgisch kan.

### 4.4 Model-routing (sectie 18) - de grootste kostenhefboom

| Taak | Motor | Waarom |
|---|---|---|
| antwoordpositie, lengte, JSON-schema, duplicate-hash, coverage-%, bestandsnamen, gates | **deterministische code** (bestaat al) | een LLM mag nooit doen wat code betrouwbaarder doet |
| structureren, classificeren, tags, formatting, simpele dedup | **cheap/fast model** | goedkoop, hoog volume |
| canonical knowledge, moeilijke examenvragen, misconcepties, transfer, feit-/uitleg-review (Gate B/F) | **strong model** | hier zit de inhoudelijke waarheid |

De routing-tabel is data, niet code-in-de-engines: per stap staat vast welke motor hem draait. Zo betaal je Opus-prijzen alleen voor de ~30% stappen die het echt nodig hebben.

### 4.5 Repair-loop (sectie 17)

```
EVALUATE -> fail(Q17: correct = systematisch langste)
         -> DIAGNOSE (welke vraag, welke gate, welke reden)
         -> REPAIR (regenereer ALLEEN Q17, cheap/strong afhankelijk van gate)
         -> RE-EVALUATE (alleen de aangeraakte check)
         -> PASS -> APPROVE
```

Nooit het hele leerdoel opnieuw. De gate-output is al gestructureerd genoeg (`check-leerdoel.mjs` noemt de vraag + de reden) om gericht te repareren. Max N repair-rondes, daarna `REJECTED -> review` (nooit een kunstmatige vraag forceren; curriculumwaarheid > quota).

### 4.6 Quality report (sectie 22)

Deterministisch samen te stellen uit `evaluation.json` per leerdoel + aggregatie per vak. Geen LLM nodig. Format exact als in het brief (per leerdoel PASS-tabel + per vak totalen).

---

## 5. Prioriteitsvolgorde (jouw slotadvies, concreet)

1. **[deze sessie, klaar]** Audit tegen bestaande architectuur - dit document.
2. **[deze sessie]** Vertical slice voor **één** leerdoel end-to-end formaliseren: `check-leerdoel.mjs` is de gate, `content-pending/ld-*.json` het cache-formaat. bi.O.1..O.3 zijn de facto al de slice (handmatig gedraaid door de gate). Wat resteert: het *statusbestand* + de *stap-splitsing* eromheen definiëren.
3. **[lokaal, jij]** De orchestrator-CLI bouwen (sectie 4) met de bestaande engines als workers en jouw API-key voor de LLM-stappen. Begin met `generate --lo <id>` (single), dan `--domain`, dan `--all`.
4. **[lokaal, jij]** Summary Engine + clip-detector als de twee generatieve workers invullen.
5. **[later]** Semantische dedup (Gate G) + leerling-datalus (misconceptie-detectie uit `events`).

**De onveranderlijke regel (brief):** curriculumwaarheid > kwaliteit > variatie > volledigheid > quota > snelheid. De factory optimaliseert nooit snelheid ten koste van waarheid; elke gate mag `REJECT` zeggen en een leerdoel naar review sturen.

---

## 6. Wat ik NIET ga doen (en waarom)

- **Niet de hele factory nu in deze sessie programmeren.** Dat is jouw expliciete advies en het is juist: de LLM-stappen kunnen hier toch niet autonoom draaien (geen key), en het zou veel Opus-tijd verbranden aan code die lokaal hoort. De hoogste hefboom nu is dit ontwerp + de slice-formalisatie, niet de batchrunner.
- **Geen tweede, parallelle contentarchitectuur.** Alles hangt aan de bevroren vijf lagen. De factory is een Orchestrator erbovenop, niet een nieuw systeem.
