# Slice 0 — Definition of Done (één HAVO-biologiedomein)

**Status:** vast te stellen (contract vóór generatie) · **Hoort bij:** `docs/CONTENT-ENGINE-V2.md` · **Scope:** één domein, hele pijplijn, **geen architectuurwijzigingen, geen extra features**.
**Aanbevolen domein:** `bi_M` — Molecuul- en celniveau (7 leerdoelen). Reden: de semantic-pilot bestaat hier al (concept *Enzym*, `bi.M.3`), de architectuur gebruikt `bi.M.3` als kanoniek voorbeeld, en het domein zit vol clip-waardige processen (enzymwerking, osmose, fotosynthese, eiwitsynthese, mitose).

> **De lat is niet "veel vragen".** De lat is: *een leerling kan van nul naar examenbeheersing binnen dit domein, zonder Slagio te verlaten.* Slice 0 is pas klaar als dat voor één domein aantoonbaar waar is.

---

## 0. De domein-compleetheidsmatrix (de eigenlijke DoD)

Een domein is "klaar" als deze matrix voor het domein groen is. De rechterkolom zegt of het onderdeel in **Slice 0** wordt *geproduceerd*, alleen *gekoppeld* (bestaat al), of *later* komt.

| Onderdeel | In Slice 0 | Herkomst |
|---|---|---|
| Begrippen | ✅ produceren | concept-nodes + `begrippen.js` |
| Basiskennis (herkennen/definiëren) | ✅ produceren | vragen, leerhandeling *identify/define* |
| Begrijpen | ✅ produceren | vragen, leerhandeling *explain/understand* |
| Toepassen | ✅ produceren | vragen, leerhandeling *apply* |
| Verbanden | ✅ produceren | semantic-facts + samenvatting-sectie "verbanden" |
| Misconcepties | ✅ produceren | `veelgemaakteFouten` → misconceptie-vragen |
| Examenvragen (examenredeneren) | ✅ produceren | vragen, leerhandeling *exam_reasoning* |
| Oude examens | ➖ koppelen | bestaande `oe`-bank / PDF's — niet genereren |
| Herhaling | ➖ koppelen | SM-2 / foutenboek bestaan al |
| Uitleg | ✅ produceren | verplicht uitleg-schema per vraag |
| Samenvatting | ✅ produceren | **Summary Engine (nieuw, minimaal)** |
| Visuele uitleg | ✅ waar nuttig | clip-opportunity-detector → SPEC (`sam-clip.js`) |
| Adaptieve vervolgvragen | ⏭ later (fase 2) | AQP bestaat; leerling-data-lus is fase 2 |

---

## 1. De vijf gate-groepen (elk gate: eis · meetmethode · drempel)

Legenda meetmethode: **[auto]** = bestaande/uit te breiden engine rekent het uit · **[auto+]** = engine bestaat, kleine uitbreiding nodig · **[mens/LLM]** = inhoudelijk oordeel.

### A. Kennis (canonical knowledge — de bron)

| # | Eis | Meetmethode | Drempel |
|---|---|---|---|
| A1 | Elk CE-syllabusonderdeel van het domein → ≥1 leerdoel | `curriculum-query.js` (missing-coverage) **[auto]** | 100% |
| A2 | Elk leerdoel heeft ≥1 concept-node; alle kernbegrippen bestaan als node | `curriculum-graph.js concepts` **[auto]** | 100% |
| A3 | Relaties tussen begrippen vastgelegd als semantic-triples | `semantic.js validate` **[auto+]** (nu 1 concept → alle kernconcepten) | elk kernconcept ≥3 feiten; verwar-paren `often_confused_with` |
| A4 | CE/SE per leerdoel correct t.o.v. syllabus | handmatige syllabus-check **[mens]** | 100% |
| A5 | Elk leerdoel met bekende valkuil heeft ≥1 `veelgemaakteFouten` | `curriculum-query.js --where "misconcepties>=1"` **[auto]** | ≥1 waar van toepassing |
| A6 | Alle leerdoelen van het domein op `approved` (syllabus-check gedaan) | review-gate `_meta.reviewStatus` **[mens]** | `approved` |
| A7 | Elk leerdoel heeft `bronnen{}` + `_meta.contentHash` | factory-validatie **[auto]** | 100% |

### B. Samenvatting

| # | Eis | Meetmethode | Drempel |
|---|---|---|---|
| B1 | Dekt alle kernbegrippen van het domein | concept-node-dekking in de tekst **[auto+]** | 100% van de kernconcepten |
| B2 | Niet oppervlakkiger dan de bestaande `SAM_RICH` | golden-reference-check (lengte, verband-dichtheid, #kernbegrippen) **[auto+]** | ≥ referentie-domein |
| B3 | Geen onnodige opvulling | signaal-op-ruis / herhaalzin-detectie **[auto+]** | pass |
| B4 | Elke bewering herleidbaar naar een semantic-fact of leerdoel | claim → fact-match **[mens/LLM]** | geen niet-gedekte bewering |
| B5 | Vaste structuur: kernbegrippen · uitleg · verbanden · voorbeelden · uitzonderingen · examengerichte aandachtspunten | sectie-check **[auto]** | alle secties aanwezig |
| B6 | Provenance: gebonden aan leerdoel-versie | node-metadata **[auto]** | aanwezig |

### C. Vragen

| # | Eis | Meetmethode | Drempel |
|---|---|---|---|
| C1 | Meerdere leerhandelingen; niet 3× dezelfde definitievraag | leerhandeling-tag + semantische duplicaatdetectie **[auto+]** | ≥3 leerhandelingen aanwezig; 0 bijna-duplicaten |
| C2 | Voldoende moeilijkheidsspreiding | `difficulty`-verdeling vs. quota-mix **[auto]** | binnen quota (zie CONTENT-ENGINE-V2 §4.4) |
| C3 | Goede afleiders; ≥1 afleider = bekende misconceptie waar mogelijk | afleider-oordeel **[mens/LLM]** | pass |
| C4 | Antwoordopties gelijkwaardig qua lengte/vorm | lengte-bias-check **[auto]** (bestaat) | binnen tolerantie |
| C5 | Geen hints door formulering | grammaticale/lengte-tells **[auto+]** | pass |
| C6 | Correcte uitleg bij het antwoord (verplicht schema) | `explanation{whyCorrect,keyTakeaway,whyDistractorsWrong?}` niet-leeg **[auto]** + inhoud **[mens/LLM]** | nooit "B is correct."; inhoud juist |
| C7 | Ieder item gekoppeld aan concept + leerdoel + syllabusreferentie | koppeling-sidecar **[auto]** | 100% |
| C8 | 4 opties · precies 1 juist · geen dubbele/lege opties | `evaluation-engine.js` **[auto]** (bestaat) | 100% |
| C9 | Juist antwoord niet systematisch op één positie | antwoordpositie-bias-check **[auto]** (bestaat; vond 43%) | binnen tolerantie |

### D. Dekking

| # | Eis | Meetmethode | Drempel |
|---|---|---|---|
| D1 | Per leerdoel/concept traceerbaar welke vraag welke kennis oefent | koppeling-sidecar volledig **[auto]** | 100% gekoppeld |
| D2 | Belangrijke concepten meer dan één keer getest, met verschillende leerhandelingen | per-concept vraagtelling × leerhandeling **[auto+]** | kernconcept ≥2 vragen, ≥2 leerhandelingen |
| D3 | Zwakke/missende leerhandelingen zichtbaar in het dashboard | dashboard-matrix (outputtype × leerhandeling) **[auto+]** | matrix aanwezig |
| D4 | De compleetheidsmatrix (§0) voor dit domein ingevuld | dashboard **[auto+]** | alle in-scope rijen ✅ |

### E. Evaluatie (de poort naar `live`)

| # | Eis | Meetmethode | Drempel |
|---|---|---|---|
| E1 | Automatische kwaliteitscheck geslaagd | `evaluation-engine.js` **[auto]** | score ≥ drempel · issues = [] |
| E2 | Golden-reference-vergelijking samenvatting | B2 **[auto+]** | pass |
| E3 | Dubbele / semantisch (bijna-)identieke vragen gedetecteerd en weg | duplicaatdetectie **[auto+]** | 0 duplicaten |
| E4 | Inhoudelijke fouten gedetecteerd | feitcheck **[mens/LLM]** | 0 fouten |
| E5 | **Gate:** pas `live`/`production` als A–E allemaal groen | pipeline-beleid **[auto]** | alle gates pass |

---

## 2. Wat kan nu automatisch, wat moet uitgebreid, wat is mensenwerk

| Categorie | Gates | Status |
|---|---|---|
| **Nu al automatisch** | C4, C8, C9, A1, A2, A5, A7, D1 | bestaande engines (`evaluation-engine`, `curriculum-query`, `curriculum-graph`, koppeling) |
| **Kleine uitbreiding** | A3, B1, B2, B3, B5, B6, C1, C2, C5, C6(structuur), D2, D3, D4, E2, E3 | uitbreiding `evaluation-engine` + `semantic.js` + dashboard + het nieuwe Summary-schema |
| **Mens/LLM-oordeel** | A4, A6, B4, C3, C6(inhoud), E4 | syllabus-check (approve) + inhoudelijke review |

De harde regel blijft: de **evaluation-engine meet, de pipeline beslist** (score≥drempel ⇒ `approved`). Mensoordeel zit alleen op de gates die inhoudelijk zijn (juistheid, syllabus, afleiderkwaliteit).

---

## 3. Expliciet BUITEN Slice 0

- **Leerling-data-lus** (aggregatie antwoordverdeling → misconceptie-detectie → hergeneratie) → **fase 2**. Eerst één betrouwbare fabriek, dan pas feedback bovenop gevalideerde content.
- **Opschalen** naar andere domeinen/vakken/niveaus → Slice 1+ (pas na kritische beoordeling van dit resultaat).
- **Architectuurwijzigingen** → geen. Alles binnen Producer/Analyzer/Orchestrator + Query Engine.
- **Nieuwe UI-features** buiten wat nodig is om dit domein live te tonen → geen.

---

## 4. De minimale build voor deze slice (na akkoord op deze DoD)

Volgorde = de pijplijn zelf; per stap: bestaat / minimale nieuwe code.

1. **Kennis → approved** — `bi_M` van `reviewed` → `approved` (syllabus-check, A4/A6); semantic-facts uitbreiden van alleen *Enzym* naar alle kernconcepten van bi_M (A3). *Bestaat:* factory, semantic.js. *Nieuw:* niets structureels, wel content (feiten).
2. **Summary Engine (minimaal, NIEUW)** — `leerdoel(en) bi_M → SAM_RICH`-entry met vaste secties (B5) en golden-reference-bewaking (B2). Kleinste vorm; zelfde uniforme engine-interface.
3. **Vragen** — `question-engine.js` draaien voor bi_M met de leerhandeling-as + quota (C1/C2) en het verplichte uitleg-schema (C6, via `build-foutenboek-uitleg.js`). *Uitbreiding*, geen nieuwe engine.
4. **Clip (waar nuttig)** — clip-opportunity-detector over bi_M; voor 1–2 kandidaten (bv. enzymwerking/denaturatie, osmose) een SPEC in `sam-clip.js`. *Nieuw:* de detector (klein); *bestaat:* de render-engine.
5. **Evaluatie → gate** — `evaluation-engine.js` (uitgebreid met B2/E3/C1) draaien; alles groen ⇒ `approved` ⇒ live.
6. **Live + meten** — domein zichtbaar met samenvatting + vragen + (eventuele) clip; events meten voor fase 2.

---

## 5. Akkoord-checklist (vóór generatie)

- [ ] Domeinkeuze `bi_M` akkoord (of ander domein aanwijzen).
- [ ] Compleetheidsmatrix §0 (in-scope kolom) akkoord.
- [ ] Drempels concretiseren waar nu "≥ drempel" staat: **evaluation-score** (bv. ≥90), **quota-mix** per leerhandeling voor biologie, **golden-reference-marges** (lengte/verband-dichtheid).
- [ ] Bevestigen: leerling-data-lus = fase 2, geen architectuurwijzigingen.

Pas na deze checklist begint de generatie. Daarna beoordelen we het resultaat van dit ene domein kritisch vóór er wordt opgeschaald.
