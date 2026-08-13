# Content Engine 2.0 — technisch ontwerp

**Status:** ontwerp (geen code) · **Bouwt op:** `docs/ARCHITECTURE-CURRICULUM-ENGINE.md` (bevroren architectuur), `docs/F1.55-CURRICULUM-FACTORY.md`, `docs/QUALITY-MODEL-vraag.md`
**Doel:** de drie losse generators (question-engine, evaluation-engine, generate-explanations) plus de samenvatting- en clip-laag samentrekken tot één strengere content-pipeline, met de **kennislaag als enige waarheid** en drie gelijkwaardige outputs: **samenvatting · vragen · mini-clips**.

---

## 0. Kernconclusie (lees dit eerst)

**De architectuur die het advies beschrijft bestaat al — en is bewust bevroren.** Het advies ("syllabus → canonical knowledge → samenvatting + vragen + clips → evaluatie") is vrijwel één-op-één de vijf-lagen-architectuur uit `ARCHITECTURE-CURRICULUM-ENGINE.md`. We bouwen dus **geen** nieuwe engine vanaf nul. "2.0" is een **vulling- en aanscherpingsoperatie**, geen herontwerp.

Concreet is het werk vijf dingen, in deze volgorde van hefboom:

1. **Kennislaag schalen** — nu 3 HAVO-bètavakken (bi/na/sk), 80 leerdoelen. Alles downstream kan alleen bestaan voor wat híer staat. Dit is de échte bottleneck.
2. **Door de review-gate naar `approved`** — alle 80 leerdoelen staan op `reviewed`; **niets** is `approved`, dus `klaar-voor-generatie` = 0 en er kan (terecht) nog niets live gegenereerd worden.
3. **De ontbrekende output-laag bouwen** — de **Summary Engine** (`leerdoel → SAM_RICH`) en een **clip-opportunity-detector** boven de bestaande spec-engine. Vragen + evaluatie bestaan al in v1.
4. **De leerling-data-lus sluiten** — geaggregeerde antwoordverdelingen → misconceptie-detectie → gerichte hergeneratie. Dit is het enige echt níeuwe stuk.
5. **Kwaliteitslat + dashboard hard maken** — de evaluation-engine + het bestaande curriculum-dashboard uitbreiden naar dekking *per outputtype* en *per leerhandeling*.

> De grote validatie van het advies: "drie losse generators → één pipeline" is precies de al vastgelegde vorm **Query → Selectie → Generator → Evaluation → Store** (harde regel 6). We hoeven dat niet te bedenken, we moeten het afmaken.

---

## 1. Wat er AL staat (inventaris per laag)

| Laag | Component | Bestand(en) | Status |
|---|---|---|---|
| 0 · Knowledge (bron) | Curriculum Engine / leerdoelen | `knowledge/havo/{bi,na,sk}.json` → `knowledge-havo.js` | **bestaat**, 3 vakken, 80 leerdoelen, allen `reviewed` |
| 0 · Knowledge (bron) | Semantic facts (triples) | `knowledge/semantic-havo.json`, `scripts/semantic.js` | **pilot** (1 concept: Enzym) |
| 1 · Relationship | Concept-graaf + evolution engine | `scripts/curriculum-graph.js`, `knowledge/concepts-*.json` | **bestaat** (179 concept-nodes, split/overlap/gat-signalen) |
| 1 · Relationship | Vraag ↔ leerdoel-koppeling | `scripts/tag-leerdoelen.js` → `knowledge-koppeling-havo.js` (233 KB) | **bestaat** |
| 2 · Validation/Evolution | Evaluation Engine (analyzer) | `scripts/evaluation-engine.js` | **v1** (structureel; vond o.a. 43% antwoordpositie-bias) |
| 2 · Validation/Evolution | Dekkingsrapport | `scripts/leerdoel-dekking.js` | **bestaat** (dry-run) |
| 3 · Generation | Curriculum Factory (producer van bron) | `scripts/curriculum-factory.js` | **bestaat** (ingest/assemble, provenance, content-hash) |
| 3 · Generation | Question Engine | `scripts/question-engine.js` | **v1** (query-gedreven, 2 modi, verbruikt alle metadata-assen) |
| 3 · Generation | Uitleg-generator (rijk, per afleider) | `scripts/build-foutenboek-uitleg.js` → `foutenboek-uitleg-havo.js` | **bestaat** — dit ís al het `whyCorrect/whyDistractorsWrong`-schema |
| 3 · Generation | Uitleg-generator (legacy) | `scripts/generate-explanations.js` | **legacy** (schrijft naar `index.html`; sinds de split verouderd) |
| 3 · Generation | Animatie/clip spec-engine | `sam-clip.js` (`SPECS`/`CHOREO`) | **bestaat** (declaratieve DSL, rAF, reduced-motion fallback) |
| 3 · Generation | Begrippenbank | `scripts/begrippen.js` | **bestaat** |
| 4 · Query/API | Query Engine (enige leesweg) | `scripts/curriculum-query.js` | **bestaat** (`--saved`, `--where`, `--json`) |
| 5 · Experience | Curriculum-dashboard | `curriculum.html`, `curriculum-dash.js` | **bestaat** (dekking/confidence/AI-Ready/review) |
| 5 · Experience | Samenvattingen (content) | `sam-havo.js` / `sam-vwo.js` (`SAM_RICH`, 143 domeinen) | **bestaat**, maar **handgeschreven** (niet leerdoel-afgeleid) |
| 5 · Experience | Foutenboek + spaced repetition | `foutenboek.js`, `herhalen.js`, `schedule.js` (SM-2) | **live** |

**De enige echte generatieve gaten in laag 3:** de **Summary Engine** (leerdoel → SAM_RICH) en de **clip-opportunity-detector**. Al het andere bestaat en moet vooral *gevuld* en *aangescherpt* worden.

---

## 2. Het advies ↔ de architectuur (bestaat / uitbreiden / nieuw)

| # | Advies | Verdict | Waar |
|---|---|---|---|
| 1 | Samenvatting = bron, niet eindproduct; één waarheid | **bestaat (principe)** | Knowledge Layer = source of truth; harde regel 1 & 2 verbieden afgeleiden in de bron |
| 2 | 143 bestaande samenvattingen als golden reference | **nieuw (kleine toevoeging)** | nieuw: `SAM_RICH` als stijl/diepte-ijkpunt in de evaluation-engine |
| 3 | Engine maakt SAM + VRAGEN + CLIPS per domein | **deels** | vragen ✔ · clips (spec-engine) ✔ · **Summary Engine te bouwen** |
| 4 | Rijk uitleg-schema (whyCorrect/keyTakeaway/whyDistractors) | **bestaat, formaliseren** | `build-foutenboek-uitleg.js` doet dit al; opnemen als *verplicht veld* in de vraag-spec + evaluation-check |
| 5 | Leerhandeling-taxonomie i.p.v. term-varianten | **uitbreiden** | Question Engine kent `examenskill`; leerhandeling-as (identify/define/distinguish/apply/misconception/explain/predict) toevoegen |
| 6 | Question-quota per vak/niveau (coverage target) | **uitbreiden** | Query Engine + Metrics Engine leveren dekking; quota-mix als beleid in de **pipeline** (niet in de analyzer) |
| 7 | Leren van échte leerlingdata (self-improving) | **NIEUW** | Supabase `events`/foutenboek → geaggregeerde antwoordverdeling → misconceptie-signaal → gerichte hergeneratie |
| 8 | Clip-opportunity-detector i.p.v. alles animeren | **uitbreiden** | detector-node boven `sam-clip.js`; alleen een SPEC genereren, nooit losse HTML/CSS |
| 9 | Eén engine voor alle niveaus (vmbo/havo/vwo) | **bestaat (principe), vullen** | architectuur is niveau-agnostisch (`knowledge/<niveau>/<vak>.json`); alleen HAVO-bron bestaat |
| 10 | Havo/vwo gefaseerd vervangen (PASS/IMPROVE/REJECT) | **uitbreiden** | evaluation-engine + review-gates leveren de oordelen; de fasering als pipeline-beleid |
| 11 | Content Coverage Dashboard | **bestaat, uitbreiden** | `curriculum.html`/`curriculum-dash.js`; toevoegen: dekking *per outputtype* en *per leerhandeling* |

**Samengevat:** 2 echt nieuwe dingen (golden-reference-eval light + leerling-data-lus), 5 uitbreidingen, 4 dingen die al bestaan als principe of module. Geen enkel punt vraagt een nieuwe fundamentele laag — precies de test uit de architectuurfreeze.

---

## 3. Het canonieke contentmodel (de "één waarheid")

Bestaat al als de **leerdoel-node** (bron, handmatig beheerd) met daaronder de **semantische feiten** als atomische waarheid. Het advies-voorbeeld (`concept: BIO-CEL-MITO …`) is exact de semantic-laag die als pilot bewezen is.

```
Evidence → Semantic Facts → Concepts → Knowledge Units → Leerdoel → Content
(waarom)   (atomaire triple) (begrip)   (afgeleid)        (bron)     (afgeleid)
```

- **Leerdoel-node** (bron): `id`, `titel`, `concepten` (edges), `veelgemaakteFouten` (misconcepties), `examenskill`, `examenrelevantie`, `voorkennis`/`vervolg` (edges), `voorbeelden`, `bronnen`, `_meta{version, reviewStatus, contentHash, …}`. **Nu uitbreiden met:** `ceStatus` (CE/SE — sluit aan op de VMBO-domeincodes die we net hebben toegevoegd) en, per concept, de misconceptie-triples uit de semantic-laag.
- **Semantic fact** = gecontroleerde triple `concept -predicate→ concept` met gesloten vocabulaire (`is_a, causes, reduces, requires, often_confused_with, …`). Hieruit volgen KU's én reasoning "gratis".
- **Regel die blijft:** samenvatting/vraag/clip staan **nooit** in het leerdoel; ze zijn afgeleide nodes met versie-binding (`van: bi.M.3 @ v4`). Wijzigt het leerdoel, dan markeert de Evolution Engine alle afgeleiden als verouderd.

Dit garandeert de "één waarheid" die het advies eist: samenvatting, vraag en clip komen alle drie uit hetzelfde leerdoel + dezelfde feiten, dus ze kunnen elkaar niet tegenspreken.

---

## 4. De echte gaten (het werk van 2.0)

### 4.1 Kennislaag-dekking (grootste hefboom)
Nu: HAVO `bi/na/sk`. Nodig: alle vakken × `havo/vwo/vmbo-gt`. De **Curriculum Factory** doet dit al (briefing → schema → validatie); de creatieve draft-stap (concepten → leerdoelen) is de pluggable LLM-fase. **VMBO heeft hier een voorsprong:** de 77 domeinen met officiële codes + CE/SE-tags staan al in `data-vmbo.meta.js` als kant-en-klare briefing-input.

### 4.2 Review-gate naar `approved`
Niets is `approved` → niets genereert. Nodig: per vak `reviewed → approved` doorlopen (syllabus-check). Dit is een **mens-in-de-lus**-capaciteitsvraag, geen techniekvraag. De twee-modus-engines (`test`=reviewed / `production`=approved) laten je alvast in `test` bouwen zonder de gate te versoepelen.

### 4.3 Summary Engine (ontbrekende output)
`leerdoel(en) → SAM_RICH` (getierd: 30 sec / 1 / 3 / 5 A4). Nieuwe Producer, zelfde uniforme interface (`node-ID → engine → node + provenance + confidence`). **De 143 bestaande samenvattingen worden golden reference:** de evaluation-engine krijgt een check "is de nieuwe output niet substantieel oppervlakkiger dan de bestaande hand­geschreven SAM_RICH" (lengte, kernbegrip-dekking, verband-dichtheid). Zo bewaakt het systeem het bestaande kwaliteitsniveau automatisch.

### 4.4 Question Engine: leerhandeling-taxonomie + quota
Tegen het term-varianten-probleem: eerst per concept de **mogelijke leerhandelingen** bepalen (`identify · define · distinguish_from · apply · recognize_misconception · explain_cause · predict_consequence`), dán vragen genereren. Beleid = een **quota-mix per vak/niveau** (voorbeeld, niet definitief):

| Leerhandeling | bèta (wi/na/sk/bi) | zaakvak (gs/ak/ec/ma) | taal (nl/mvt) |
|---|---|---|---|
| Herkennen/definiëren | 20% | 25% | 20% |
| Begrijpen | 20% | 25% | 25% |
| Toepassen/rekenen | 35% | 10% | 15% |
| Onderscheiden (X vs Y) | 10% | 15% | 15% |
| Misconceptie | 10% | 10% | 10% |
| Examenredeneren/bron | 5% | 15% | 15% |

De mix is **beleid in de pipeline**, niet in de analyzer — zo blijft de evaluator model-onafhankelijk.

### 4.5 Verplicht uitleg-schema
Elke gegenereerde vraag draagt: `question, options, correctAnswer, explanation{whyCorrect, keyTakeaway, whyDistractorsWrong?}, learningObjective, conceptIds, questionType, difficulty, estimatedTime`. `build-foutenboek-uitleg.js` levert het rijke deel al; de evaluation-engine **weigert** voortaan een vraag waarvan de uitleg neerkomt op "B is correct." (niet elke afleider hoeft een alinea, maar leeg mag nooit).

### 4.6 Clip-opportunity-detector
Boven `sam-clip.js`: een analyzer die per leerdoel `clipWorthwhile{bool, reason, visualModel, keySteps, recommendedChoreography}` bepaalt. Alleen bij `true` genereert de Animation Engine een **SPEC** (geen losse HTML/CSS). Droge definities → geen clip. Ruimtelijke/temporele processen (geografie, celdeling, kracht-beweging) → wel.

### 4.7 Leerling-data-lus (het echt nieuwe)
```
Content → leerlingdata → contentgaten → nieuwe content → …
```
Bron bestaat al: Supabase `events` + `leaderboard` (`answer distribution`, `avg_tijd`, `correct/total`) en het Foutenboek (`repeated mistakes`). Nieuw: een **analyzer** die per `question_id` de antwoordverdeling aggregeert en, als een afleider systematisch gekozen wordt en die afleider een bekende misconceptie ís, een signaal levert: *"concept slecht beheerst → genereer N extra vragen met dezelfde misconceptie in andere context."* Dit voedt terug in de Query-selectie (`WEAK_CONCEPTS → Question Engine`). **Privacy:** alleen geaggregeerd, geen individueel spoor nodig.

### 4.8 Coverage Dashboard 2.0
`curriculum-dash.js` uitbreiden van "dekking/AI-Ready/review" naar een matrix **per leerdoel × outputtype × leerhandeling**:
```
Havo → Biologie → Domein X
  Syllabusdekking 100% · Samenvatting 100% · Kernbegrippen 100%
  Snelle quiz 94% · Toepassing 71% · Misconceptions 43% · Examengericht 82%
  Uitlegkwaliteit 97% · Mini-clips 60%
  🔴 Grootste gat: toepassingsvragen over X
```
Dit is een **opgeslagen query** (harde regel 5: eerst de query, dan de view), niet een nieuwe engine.

---

## 5. Wat blijft / uitbreiden / vervangen / nieuw (per module)

| Module | Verdict | Actie |
|---|---|---|
| `curriculum-factory.js` | **blijft, opschalen** | draaien voor alle vakken × niveaus; VMBO-meta als briefing-input |
| `curriculum-query.js` | **blijft, uitbreiden** | nieuwe saved queries: `WEAK_CONCEPTS`, `MISSING_SUMMARY`, `CLIP_CANDIDATES`, per leerhandeling |
| `curriculum-graph.js` | **blijft** | Evolution-signalen blijven leidend; geen wijziging nodig |
| `semantic.js` | **blijft, opschalen** | van pilot (1 concept) naar dekkende feiten per CE-concept |
| `question-engine.js` | **uitbreiden** | leerhandeling-as + verplicht uitleg-schema + quota-mix (beleid) |
| `evaluation-engine.js` | **uitbreiden** | checks: uitleg-inhoud, leerhandeling-diversiteit, golden-reference-diepte (summary), misconceptie-dekking |
| `build-foutenboek-uitleg.js` | **blijft, promoveren** | wordt de standaard uitleg-producer voor álle vragen, niet alleen foutenboek |
| `generate-explanations.js` | **vervangen/afvoeren** | legacy (schrijft naar `index.html`, sinds de split dood) — vervangen door bovenstaande |
| `sam-havo.js`/`sam-vwo.js` (`SAM_RICH`) | **blijft als golden reference** | niet vervangen; ijkpunt voor de Summary Engine; later leerdoel-afgeleid regenereren |
| `sam-clip.js` | **blijft** | ongewijzigd; krijgt een detector ervoor |
| `curriculum-dash.js`/`curriculum.html` | **uitbreiden** | outputtype × leerhandeling-matrix |
| **Summary Engine** | **NIEUW** | `leerdoel → SAM_RICH` (getierd), golden-reference-bewaakt |
| **Clip-opportunity-detector** | **NIEUW** | analyzer voor `clipWorthwhile` |
| **Leerling-data-analyzer** | **NIEUW** | geaggregeerde antwoordverdeling → misconceptie-signaal → hergeneratie |

---

## 6. Migratie (gefaseerd, geen big bang)

Precies het PASS/IMPROVE/REJECT-model, gedragen door de bestaande review-gates + evaluation-engine — zonder ooit dekking te verliezen:

1. **Analyse** — evaluation-engine over de bestaande bank per vak (bestaat al; vond echte tells).
2. **Oordeel per vraag** — `PASS / IMPROVE / REJECT` uit de score + structurele checks.
3. **Gaten vullen** — Question Engine genereert waar dekking (per leerhandeling) tekortschiet.
4. **Voorrang** — nieuwe (leerdoel-gekoppelde, `approved`) content wint van oude duplicaten.
5. **Opruimen** — pas als een domein voldoende goede nieuwe dekking heeft, verdwijnt oude zwakke content.

Zo blijft er tijdens de migratie altijd content live.

---

## 7. Aanbevolen volgorde (vertical slice eerst)

Niet "eerst maandenlang alle vragen" en niet "eerst alle kennislagen". Bewijs eerst de **volledige pijplijn end-to-end op één vak**, inclusief de nieuwe Summary Engine, en schaal dan pas.

- **Slice 0 (bewijs):** HAVO Biologie. Kennislaag bestaat al (`reviewed`) → doorzetten naar `approved` → **Summary + Question + Clip** genereren → evaluation-gate → één domein live vanuit de pipeline. Dit test elke schakel, inclusief golden-reference-eval tegen de bestaande SAM_RICH.
- **Slice 1 (nieuw niveau):** VMBO Biologie. Geen legacy, de 77 domeinen + CE/SE-codes staan klaar. Bewijst dat "één engine, `level=vmbo`" werkelijk werkt.
- **Daarna schalen:** kennislaag-authoring voor de overige vakken/niveaus (grootste, maar nu geritualiseerde, inspanning), met de dashboard-matrix als kompas voor "waar is het gat het grootst".
- **Parallel, zodra er live content + verkeer is:** de leerling-data-lus aanzetten (het self-improving deel dat Slagio's voorsprong wordt).

---

## 8. Definition of done per output (de lat)

- **Samenvatting:** dekt alle kernbegrippen van het leerdoel · niet oppervlakkiger dan de golden reference · verbanden + examengerichte aandachtspunten aanwezig · provenance naar leerdoel-versie.
- **Vraag:** 4 opties · precies één juist · geen dubbele/lege opties · verplicht uitleg-schema · leerhandeling-getagd · gekoppeld aan leerdoel + concept · difficulty + estimatedTime · geen antwoordpositie-bias over de set.
- **Mini-clip:** alleen als `clipWorthwhile` · een geldige SPEC (geen losse HTML) · reduced-motion fallback · bijschriften gekoppeld aan de leerstappen.

---

## 9. Wat dit voor Slagio betekent

Dit is geen vraaggenerator maar de **content-infrastructuur**: één kennislaag waaruit `SAM_RICH`, flashcards, snelle quiz, Bot Race, examengerichte vragen én mini-clips voortkomen — voor havo, vwo én vmbo uit dezelfde bron. De UX is ver genoeg; de bottleneck is nu **contentdekking × contentkwaliteit**. De architectuur om dat op te lossen ligt er al — 2.0 is die architectuur eindelijk helemaal vullen en de kwaliteitslat hard afdwingen.
