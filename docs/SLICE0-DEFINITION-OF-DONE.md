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
| Transfer (≥2 concepten, nieuwe context) | ✅ produceren waar zinvol | vragen, leerhandeling *transfer* (C10) |
| Examencontext (grafiek/bron/experiment/tabel/casus) | ✅ produceren waar zinvol | vraag-context-type (D5) |
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
| B2 | Inhoudelijke dekking + detailorde ≥ golden reference (zie §6.3 — **niet** "evenveel verbanden" tellen) | golden-reference-check **[auto+ / mens]** | alle essentiële verbanden gedekt · 100% verplichte kernbegrippen · geen syllabuskennis verloren · geen kunstmatige verlenging |
| B3 | Geen onnodige opvulling | signaal-op-ruis / herhaalzin-detectie **[auto+]** | pass |
| B4 | Elke bewering herleidbaar naar een semantic-fact of leerdoel | claim → fact-match **[mens/LLM]** | geen niet-gedekte bewering |
| B5 | Vaste structuur: kernbegrippen · uitleg · verbanden · voorbeelden · uitzonderingen · examengerichte aandachtspunten | sectie-check **[auto]** | alle secties aanwezig |
| B6 | Provenance: gebonden aan leerdoel-versie | node-metadata **[auto]** | aanwezig |

### C. Vragen

| # | Eis | Meetmethode | Drempel |
|---|---|---|---|
| C1 | Meerdere leerhandelingen; niet 3× dezelfde definitievraag | leerhandeling-tag + semantische duplicaatdetectie **[auto+]** | ≥3 leerhandelingen aanwezig; 0 bijna-duplicaten |
| C2 | Voldoende spreiding leerhandeling + moeilijkheid | verdeling vs. quota-mix **[auto]** | binnen de quota van §6.2 — **tenzij curriculumwaarheid dat verhindert (§6.4)** |
| C3 | Goede afleiders; ≥1 afleider = bekende misconceptie waar mogelijk | afleider-oordeel **[mens/LLM]** | pass |
| C4 | Antwoordopties gelijkwaardig qua lengte/vorm | lengte-bias-check **[auto]** (bestaat) | binnen tolerantie |
| C5 | Geen hints door formulering | grammaticale/lengte-tells **[auto+]** | pass |
| C6 | Correcte uitleg bij het antwoord (verplicht schema) | `explanation{whyCorrect,keyTakeaway,whyDistractorsWrong?}` niet-leeg **[auto]** + inhoud **[mens/LLM]** | nooit "B is correct."; inhoud juist |
| C7 | Ieder item gekoppeld aan concept + leerdoel + syllabusreferentie | koppeling-sidecar **[auto]** | 100% |
| C8 | 4 opties · precies 1 juist · geen dubbele/lege opties | `evaluation-engine.js` **[auto]** (bestaat) | 100% |
| C9 | Juist antwoord niet systematisch op één positie | antwoordpositie-bias-check **[auto]** (bestaat; vond 43%) | binnen tolerantie |
| C10 | **Transfer-vraag** — waar het leerdoel het ondersteunt ≥1 item dat **≥2 canonieke concepten in een nieuwe context** combineert (niet los reproduceren) | leerhandeling-tag `transfer` + concept-koppeling telt ≥2 **[auto+]** | ≥1 per leerdoel/domein waar zinvol (§6.4: gerapporteerd gat = pass) |
| C11 | **Afleider-taxonomie** — niet elke vraag leunt uitsluitend op een bekende misconceptie; per afleider een type: `misconceptie` / `contextueel` (waar-maar-niet-hier) / `redeneerfout` | afleider-`type`-veld verplicht; verdeling gemeten **[auto+]** | ≥2 afleidertypen over de vragenset; niet 100% misconceptie |

### D. Dekking

| # | Eis | Meetmethode | Drempel |
|---|---|---|---|
| D1 | Per leerdoel/concept traceerbaar welke vraag welke kennis oefent | koppeling-sidecar volledig **[auto]** | 100% gekoppeld |
| D2 | Belangrijke concepten meer dan één keer getest, met verschillende leerhandelingen | per-concept vraagtelling × leerhandeling **[auto+]** | kernconcept ≥2 vragen, ≥2 leerhandelingen |
| D3 | Zwakke/missende leerhandelingen zichtbaar in het dashboard | dashboard-matrix (outputtype × leerhandeling) **[auto+]** | matrix aanwezig |
| D4 | De compleetheidsmatrix (§0) voor dit domein ingevuld | dashboard **[auto+]** | alle in-scope rijen ✅ |
| D5 | **Examencontext-dekking** — waar het curriculum het ondersteunt komen bron/grafiek/experiment/tabel/casus als vraagcontext voor, niet alleen kale begripsvragen | context-`type`-veld per vraag; ≥2 contexttypen per domein **[auto+]** | ≥2 contexttypen aanwezig waar zinvol (§6.4) |
| D6 | **Contextdiversiteit** — niet alle vragen van een leerdoel gebruiken dezelfde situatie/casus | context-hash-telling **[auto+]** | geen enkele context >50% van de items van een leerdoel |

### E. Evaluatie (de poort naar `live`)

| # | Eis | Meetmethode | Drempel |
|---|---|---|---|
| E1 | Automatische kwaliteitscheck geslaagd (minimumgate, geen gemiddelde) | `evaluation-engine.js` **[auto]** | score ≥ 90 **ÉN** 0 kritieke inhoudelijke issues **ÉN** 0 syllabus-/coveragegaten (zie §6.1) |
| E2 | Golden-reference-vergelijking samenvatting | B2 **[auto+]** | pass |
| E3 | Dubbele / semantisch (bijna-)identieke vragen gedetecteerd en weg | duplicaatdetectie **[auto+]** | 0 duplicaten |
| E4 | Inhoudelijke fouten gedetecteerd | feitcheck **[mens/LLM]** | 0 fouten |
| E5 | **Gate:** pas `live`/`production` als A–E allemaal groen | pipeline-beleid **[auto]** | alle gates pass |
| E6 | **Canonical overclaim-check** — geen absolute vereenvoudiging ("alleen", "altijd", "nooit", "precies één", "wordt altijd veroorzaakt door") als canonieke waarheid | `overclaim-check.js` **[auto]** (bestaat) | 0 niet-gerechtvaardigde overclaims |

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

## 5. Akkoord-checklist — VASTGESTELD

- [x] Domeinkeuze `bi_M` — akkoord.
- [x] Compleetheidsmatrix §0 (in-scope kolom) — akkoord.
- [x] Drempels vastgesteld — zie §6.
- [x] Leerling-data-lus = fase 2; geen architectuurwijzigingen.

Generatie mag beginnen. Daarna beoordelen we het resultaat van dit ene domein kritisch vóór er wordt opgeschaald.

---

## 6. Vastgestelde drempels (definitief — bindend voor de generatie)

### 6.1 Evaluatie-gate (minimumgate, geen gemiddelde)
Een domein haalt `approved`/`live` alleen als **alle drie** waar zijn:
1. **score ≥ 90**, én
2. **0 kritieke inhoudelijke issues** (een foutief antwoord, foute uitleg of onjuiste bewering is *kritiek* en kan **nooit** worden gecompenseerd door andere goede items), én
3. **0 onbeantwoorde syllabus-/coveragegaten**.

De 90 is dus een ondergrens bovenop twee harde nul-eisen — geen gemiddelde dat kritieke fouten verbergt.

### 6.2 Quota-mix biologie (Slice 0) — generatiedoelen, geen natuurwet
| Leerhandeling | Doel |
|---|---|
| Herkennen/definiëren | 15% |
| Begrijpen | 25% |
| Toepassen | 25% |
| Onderscheiden (X vs. Y) | 15% |
| Misconceptie | 10% |
| Examenredeneren | 10% |

**Configureerbaar per vak/niveau** — dit is *geen* universele verdeling. Geschiedenis, talen en wiskunde krijgen elk een eigen mix.

### 6.3 Golden-reference (samenvatting) — inhoud, geen getal-target
De nieuwe samenvatting moet **inhoudelijk** minstens zo goed zijn als de bestaande `SAM_RICH`, aangetoond via:
- lengteorde ≥ de golden-reference-**ondergrens** (niet exact matchen);
- **100% van de verplichte kernbegrippen** gedekt;
- **100% van de essentiële verbanden** gedekt (essentieel = pedagogisch/examenrelevant, niet elk mogelijk verband);
- geen belangrijke syllabuskennis verloren;
- **geen kunstmatige uitbreiding** puur om langer/dichter te lijken;
- inhoudelijke kwaliteit ≥ golden reference.

> Expliciet **niet**: "minstens evenveel expliciete verbanden als de golden reference". Dat zou Claude verleiden verbanden toe te voegen om een getal te halen, ook waar dat pedagogisch niets toevoegt.

### 6.4 Kernregel — curriculumwaarheid staat boven de quota
De quota (§6.2) zijn **doelen**, geen wet. **Als een leerdoel/de syllabus aantoonbaar geen kwalitatief goede vraag van een bepaald type ondersteunt, mag de engine die quota breken en dít rapporteren — nooit een kunstmatige vraag produceren om een percentage te halen.** Een gerapporteerd, onderbouwd gat is een *pass*; een opgevulde nepvraag is een *fail*. Dit geldt boven elke andere gate in dit document.

### 6.5 Cognitief moeilijkheidsmodel (R1–R5) — tijdens de eerste domeinen
Vervangt "makkelijk/gemiddeld/moeilijk" door een niveauschaal die later een leerpad voedt. Elk item krijgt een `R`-tag naast zijn leerhandeling:

| Niveau | Betekenis | Voorbeeld (enzymen) |
|---|---|---|
| **R1** | Herkennen / reproduceren | "Wat is een enzym?" |
| **R2** | Begrijpen (oorzaak–gevolg) | "Hoe versnelt een enzym een reactie?" |
| **R3** | Toepassen in een standaardsituatie | "Amylase & zetmeel — waarom geen effect op eiwit?" |
| **R4** | Combineren (≥2 concepten) | optimum **én** denaturatie in één redenering |
| **R5** | Transfer / examenredeneren in nieuwe context | onbekend enzym, meetreeks, onomkeerbaarheid afleiden |

Doel per domein: de set dekt **R1 t/m R5** af (niet elk leerdoel hoeft R5 te hebben; het **domein** wel, waar zinvol). R4/R5 zijn precies de "niet te netjes"-vragen: één concept · één misconceptie · één leerhandeling mag niet het hele beeld zijn.

### 6.6 Canonieke precisie — geen overclaim als bron-van-waarheid
De canonical knowledge layer legt **precieze** formuleringen vast; de didactische HAVO-vereenvoudiging is een **afgeleide**, nooit de canonieke regel. Vastgelegd in `knowledge/semantic-havo.json → _meta.canoniekeFormuleringen`, bewaakt door `overclaim-check.js` (gate E6). Twee correcties uit de bi.M.3-review, bindend:

- **Substraatspecificiteit** — canoniek: *"een actief centrum met een vorm en chemische eigenschappen waardoor alleen bepaalde substraten passend kunnen binden"*. **Verboden overclaim:** "één enzym = precies één substraat".
- **Denaturatie** — canoniek: *"een verandering van de ruimtelijke structuur waardoor de functie verloren kan gaan; zowel een te hoge temperatuur als een extreme pH kan dit veroorzaken"*. **Verboden overclaim:** "denaturatie wordt altijd door hoge temperatuur veroorzaakt".

### 6.7 Kernprincipe — elke fout heeft diagnostische waarde
Nooit "Fout, het juiste antwoord is B." Elke afleider draagt: **gekozen fout → vermoedelijke denkfout → het relevante onderscheid → juiste mentale representatie** (de "Koos je X? …"-vorm). Dit is een productdifferentiator van Slagio en een harde eis op elke uitleg (C6), niet alleen een stijlkeuze.

---

## 7. De GOUDEN STANDAARD — blueprint voor contentpublicatie

bi.M.3 is de referentie. Elk nieuw leerdoel dat live gaat, moet identiek van vorm zijn en dezelfde poorten halen. Deze sectie is bindend.

### 7.1 Vraag-blueprint (schema per meerkeuzevraag)
```
{ v, o[4], c, d, u, uo[4], uh }
```
| Veld | Betekenis | Eis |
|---|---|---|
| `v` | vraagstam | ≤ 110 tekens, één heldere vraag |
| `o` | 4 opties | niet-leeg, uniek; afleiders = echte fouten (misconceptie/contextueel/redeneerfout) |
| `c` | index juist antwoord | 0..3; juist ≠ systematisch langst |
| `d` | R-niveau | 1 (herkennen/begrijpen) · 2 (toepassen/onderscheiden) · 3 (transfer/examenredeneren) |
| `u` | takeaway | "Onthoud: …"-kernregel |
| `uo` | **4 per-optie-uitleg** | elk niet-leeg; de door de leerling gekozen optie wordt besproken t.o.v. het juiste antwoord (de slimme uitleg) |
| `uh` | onthoud-tip | hoe herken je deze valkuil de volgende keer |

De samenvatting volgt de **hoofdstuk-structuur** (§ begrippenlijst + genummerde onderwerpen met beeld/clip per onderwerp), met precieze canonieke formuleringen (§6.6) en diagrammen/clip alleen waar ze leerwaarde toevoegen.

### 7.2 Automatisch afgedwongen (blokkerend in `smoke.mjs` → CI)
`scripts/validate-goldstandard.mjs` valt de build als één van deze faalt voor een gemarkeerde module:
- vraag-blueprint compleet (o[4]/c/d/u/uo[4]/uh, geen dubbele opties, stam ≤ 110);
- **antwoordpositie-balans** (≤ 40% op één positie) en **geen lengte-bias** (juist = langst in ≤ 40%);
- **geen overclaim** in de canonieke velden (juist antwoord + uo + u) — afleiders mógen fout zijn;
- **leerdoel-koppeling** aanwezig en `matched`;
- R-dekking (1–3) en bankdiepte gerapporteerd (soft).

### 7.3 Nog handmatig vereist (vóór het "gouden" stempel)
Deze kan een script niet garanderen; ze horen expliciet bij de standaard:
- **Vakinhoudelijke sign-off** door een docent/expert op elke canonieke bewering, elk juist antwoord en elke afleider. Zonder dit: hoogstens "kandidaat-standaard".
- **Bronherleidbaarheid**: elke canonieke bewering wijst naar CvTE-syllabus/Binas (niet los `bron:"syllabus"`).
- **Bankdiepte** ≥ 25 vragen per leerdoel (meerdere per R-niveau/subconcept) — anders memoriseerbaar.
- **Authentieke examencontext**: ≥ 1 echt oud-examen-afgeleid item per domein.

### 7.4 Live-criterium
Een leerdoel is **gouden standaard** wanneer 7.2 groen is (auto), 7.3 is afgetekend (mens), en de leerling-lus (§ resultaat/foutenboek/leerpad per subconcept) het beheersingssignaal teruggeeft. Pas dan schaalt de engine het vak-breed uit.
