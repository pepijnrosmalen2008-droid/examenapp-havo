# Slagio — Curriculum Engine & Knowledge Graph (kernarchitectuur)

**Status:** vastgesteld · **Doel:** de laag waar de komende jaren niets fundamenteels meer aan hoeft te veranderen.
De specifieke generators, AI-modellen en prompts zullen veranderen; **deze vijf lagen blijven**. Een architectuur is sterk als ze de techniek die eronder verandert kan overleven.

## De lagen (blijvende architectuur)

```
5. Experience Layer     student • docent • dashboard • AI-tutor
        ▲
4. Query / API Layer    curriculum-query.js — de ENIGE leesweg; geen engine loopt zelf door JSON
        ▲
3. Generation Engines   (stateless) summary • quiz • animation • flashcards • lesson • tutor
        ▲
2. Validation & Evolution   Validation Engine • Metrics Engine • Evolution Engine   (leest + stelt voor)
        ▲
1. Relationship Layer   Knowledge Graph • Concept Graph • Semantic Graph • Dependency Graph • Evidence Graph
        ▲
0. Knowledge Layer      Curriculum Engine • Learning Objectives • Semantic Facts • Evidence   (source of truth)
```

Alleen de Knowledge Layer wordt handmatig beheerd/gereviewd. Generation is volledig afgeleid en weggooibaar. Validation/Evolution bewaakt en **stelt voor** (schrijft nooit). De F-fases (F1, F2, …) zijn ontwikkelvolgorde; deze lagen zijn de blijvende structuur.

## De hiërarchie is atomisch — met een Semantic Layer als fundament

Twee views op dezelfde structuur. **Containment** (waar hoort iets bij):

```
Vak → Domein → Leerdoel → Knowledge Unit → Concept
```

**Fundament / afleiding** (waar komt iets vandaan) — dit is de eigenlijke bron-volgorde:

```
Evidence → Semantic Facts → Concepts → Knowledge Units → Learning Objectives → Content
```

- **Evidence** = waaróm geloven we het (syllabus/examen/correctievoorschrift/review).
- **Semantic Fact** = een gecontroleerde triple tussen concept-nodes: `enzym —reduces→ activeringsenergie`. De echte atomische waarheid.
- **Concept** = zelfstandig begrip ("enzym", "osmose").
- **Knowledge Unit (KU)** = *afgeleide* — één feit/mechanisme/valkuil in zinsvorm, **volgt uit de semantische feiten** (niet handgeschreven).
- **Leerdoel** = verzameling KU's die samen een onderwijsdoel vormen.

**Waarom de Semantic Layer vóór KU's komt** (bewezen, pilot concept "Enzym", `scripts/semantic.js`):
1. **Gratis reasoning** — de tutor loopt de graaf af i.p.v. uitleg te lezen: *"waarom daalt enzymactiviteit bij hoge temperatuur?"* → `hoge-temperatuur —causes→ denaturatie —reduces→ enzymactiviteit`. Niemand schreef dat antwoord.
2. **KU's zijn afgeleiden** — uit 20 feiten over "enzym" ontstaan automatisch de KU's (definitie/werking/voorwaarden/valkuil). Dus KU's mass-authoren zou dubbel werk zijn; je authort **feiten** en genereert KU's.

Regels voor de Semantic Layer (klassieke kennisgraaf-discipline): **gesloten predikaten-vocabulaire** (`is_a, has_part, causes, reduces, requires, affects, occurs_in, often_confused_with, …`) en **concept-ID's als subject/object** (geen free-text triples). Zo blijft de graaf queryebaar en redeneerbaar.

*Status:* Semantic Layer = **pilot** (`knowledge/semantic-havo.json`, concept Enzym). `units[]`-veld op het leerdoel blijft gereserveerd — maar KU's worden **gegenereerd uit feiten**, niet met de hand geschreven.

## Zes harde regels

1. **Geen afgeleiden in de bron** — samenvatting/quiz/animatie/lesplan horen nooit in een leerdoel (ingest weigert ze).
2. **Alles regenereerbaar** — elke afgeleide is volledig opnieuw te maken vanuit de Knowledge Layer.
3. **Generators zijn stateless & immutable** — een engine krijgt alléén `leerdoel v7` en produceert `summary v7`. Geen cache, geen historie, geen mutaties. Rebuilds zijn daardoor triviaal. (Geldt nu al voor tagger/assembler/graph/query — allemaal puur, deterministisch.)
4. **Alleen `approved` genereert downstream.**
5. **Query-first** — *iedere nieuwe feature moet eerst als query worden geformuleerd; pas als die query bestaat, mag er een generator of UI bovenop.* Kan een feature niet als query worden uitgedrukt, dan is dat een signaal dat de data of relaties nog niet goed gemodelleerd zijn. Nieuwe functionaliteit wordt zo vaak een **nieuwe query** i.p.v. een nieuwe engine. (Sluit direct aan op: *de kwaliteit van een kennismodel blijkt uit de vragen die je eraan kunt stellen.*)
6. **Engines kiezen nooit zelf hun input** — een engine verwerkt uitsluitend de output van een query: `engine.run(saved_query="READY_FOR_QUESTION_GENERATION")`. Nooit `for leerdoel in db: if review=='approved'` verspreid over zes engines. De **selectie van werk is gecentraliseerd** in de Query Engine; de Query Engine wordt daarmee een **orchestrator**: `Query → Selectie → Pipeline → Generator → Store`. Elke workflow is hetzelfde patroon (`READY_FOR_GENERATION→Question Engine`, `OUTDATED_SUMMARIES→Summary Engine`, `LOW_CONFIDENCE→Human review`, `OFF_LEVEL→Owner review`).

## Uniforme engine-interface

Elke engine in de Generation/Validation-laag heeft **dezelfde vorm**, waardoor engines uitwisselbaar zijn:

```
Input:  node-ID  (bv. bi.M.3)  →  [Engine, leest via de Query Layer]  →  Output: nieuwe node(s) + provenance + confidence
```

`bi.M.3 → Summary Engine → summary.183` · `bi.M.3 → Animation Engine → anim.82`. Verwissel de engine (of het model erachter) en de rest verandert niet.

## Uniforme engine-interface

Elke engine in laag 3/4 heeft **dezelfde vorm**, waardoor engines uitwisselbaar zijn:

```
Input:  node-ID  (bv. bi.M.3)
   ↓    [Engine]  (leest alleen)
Output: nieuwe node(s) + provenance + confidence
```

`bi.M.3 → Summary Engine → summary.183` · `bi.M.3 → Animation Engine → anim.82`. Verwissel de engine (of het model erachter) en de rest verandert niet.

---

## 1. Curriculum Engine — Source of Truth

De **enige** laag die handmatig wordt beheerd en gereviewd. Een leerdoel bevat **uitsluitend** informatie die inhoudelijk waar is over dat leerdoel — **nooit** afgeleide content.

Een leerdoel-node:

| veld | betekenis |
|---|---|
| `id` | **stabiele** sleutel `<vak>.<domein>.<n>` — tekst mag evolueren, ID nooit |
| `titel`, `beschrijving` | mensleesbaar |
| `concepten` | **edges** → concept-nodes (nu als label; concept is een eersteklas node, §2) |
| `veelgemaakteFouten` | misconcepties (voedt diagnostische vragen) |
| `examenskill` | examenvaardigheidsdimensie (bron-interpretatie, data-verwerken, …) |
| `examenrelevantie` | examengewicht (hoog/midden/laag) |
| `voorkennis` | **edges** → leerdoel-ID's die eerst nodig zijn |
| `vervolg` | **edges** → leerdoel-ID's die hierop voortbouwen |
| `voorbeelden` | canonieke voorbeelden |
| `bronnen` | `{type, ref}` — CvTE/syllabus/examenvraag-verwijzingen |
| `units` | *(gereserveerd)* knowledge units — atomische kenniseenheden (§Hiërarchie) |
| `evidence` | *(gereserveerd)* evidence-node-ID's — **waarom** geloven we dat dit klopt (§Evidence) |
| `relaties` | *(gereserveerd)* typed edges `{often_confused_with:[…], used_by:[…], contrasts:[…]}` |
| `_meta` | provenance: `version, reviewStatus, lastReviewed, source, created, updated, contentHash` |

**Opslag:** `knowledge/<niveau>/<vak>.json` (bron) → `curriculum-factory.js assemble` genereert `knowledge-<niveau>.js`. Deterministisch, idempotent, met versiebeheer (content-hash) en diff-rapport. Zie `docs/F1.55-CURRICULUM-FACTORY.md`.

**Hard verboden in een leerdoel:** `samenvatting(en)`, `quizvragen`, `flashcards`, `animatie(s)`, `lesplan`, `examenvragen` — de ingest-validatie weigert deze. Ze zijn afgeleiden (§3).

---

## 2. Knowledge Graph

De curriculumlaag is **geen verzameling JSON-bestanden meer, maar een graaf**. De JSON is slechts de opslagvorm; de betekenis is een graaf.

### Concept = eersteklas node (niet een string)

Een concept is **geen tekst in een leerdoel** maar een eigen node met eigenschappen, gedeeld over vakken. Gegenereerd (afgeleid, regenereerbaar) in `knowledge/concepts-<niveau>.json` door `curriculum-graph.js concepts`:

```
concept.energie
  labels:     ["Energie"]            (synoniemen komen hier samen)
  vakken:     [bi]                    ← wordt [bi, sk] zodra beide 'energie' gebruiken
  appearsIn:  [bi.M.3]                (gebruikt-edges vanuit leerdoelen)
  nVragen:    5                       (uit de koppeling-sidecar)
```

Daardoor worden vakoverstijgende vragen beantwoordbaar: *"Laat alle leerdoelen zien waarin energie voorkomt"* → `curriculum-graph.js query havo energie`. Nu al: 179 concept-nodes, waarvan enkele vak-overstijgend (Hypothese, Variabelen → bi+sk). **Hardening later:** `leerdoel.concepten` migreren van label naar expliciete `concept.<slug>`-ID; de registry levert de map.

**Nodes:** vakken · domeinen · leerdoelen · **concepten** · examens
**Edges:**

| edge | van → naar | herkomst nu |
|---|---|---|
| `onderdeel-van` | leerdoel → domein → vak | sleutel `<vak>_<domein>` |
| `gebruikt-concept` | leerdoel → concept | `leerdoel.concepten` |
| `vereist` | leerdoel → leerdoel | `leerdoel.voorkennis` |
| `bouwt-voort-op` | leerdoel → leerdoel | `leerdoel.vervolg` |
| `toetst` | examenvraag → leerdoel | koppeling-sidecar (`knowledge-koppeling-*.js`) |
| `voorbeeld-van` | voorbeeld → leerdoel | `leerdoel.voorbeelden` |
| **typed** (`often_confused_with`, `used_by`, `contrasts`, `analogy_of`, `example_of`, `tested_with`, `requires`, `extends`) | node → node | `leerdoel.relaties` *(gereserveerd)* |

**Typed dependency-edges** maken de tutor mogelijk zónder expliciete programmering: `Genotype --contrasts--> Fenotype` laat de tutor zeggen *"je verwart genotype met fenotype"*; `Mitochondrion --used_by--> Celademhaling` stuurt de leerroute. `voorkennis`/`vervolg` zijn de eerste twee (`requires`/`extends`); `relaties{}` generaliseert dit naar alle types.

### Evidence Graph — *waarom* geloven we dit?

De belangrijkste ontbrekende vraag: waaróm klopt een leerdoel? Elke bewering wordt herleidbaar via **evidence-nodes** (eigen store, gerefereerd vanuit `leerdoel.evidence`):

```
evidence.cvte.2025.v17            (examen 2025, vraag 17)
evidence.syllabus.havo.bio.2026.4.2
evidence.docent.review.81
```

Niet `bronnen: [...]` als losse strings, maar **nodes** — zodat één examenvraag of syllabus-passage aan meerdere leerdoelen kan hangen, en AI-review kan checken of elke bewering gedekt is (`Evidence Completeness`, §Metrics).

Zodra dit een graaf is, worden vragen beantwoordbaar die niets met generatie te maken hebben:

- *Welke leerdoelen gebruiken "diffusie"?* → alle nodes met `gebruikt-concept → diffusie`
- *Welke examenonderdelen toetsen homeostase?* → volg `toetst`-edges naar `bi.O.3`
- *Welke concepten komen terug in bio én scheikunde?* → concept-nodes met edges naar leerdoelen in beide vakken
- *Wat is de leerroute naar bi.M.5?* → topologische sortering over `vereist`-edges

De **stabiele ID's** zijn wat de edges jarenlang geldig houden bij tekstwijzigingen.

---

## 3. Derived Content

**De belangrijkste ontwerpregel van het hele systeem:**

> **Alle afgeleide content moet volledig opnieuw te genereren zijn vanuit de Curriculum Engine.**

Afgeleiden (allemaal **disposable**, elk in een eigen regenereerbare store met eigen provenance, gekeyd op leerdoel-ID):

| afgeleide | store | huidige status in Slagio |
|---|---|---|
| examenvraag-index | `knowledge-koppeling-*.js` (sidecar) | **bestaat** (tagger) |
| samenvattingen (30 sec / 1 / 3 / 5 A4) | summary-store | `SAM_RICH` bestaat; tiering nieuw |
| quizvragen | question-store | `build-questions.js` bestaat; leerdoel-gedreven nieuw |
| flashcards | flashcard-store | SM-2 bestaat (`schedule.js`) |
| animatiescripts (DSL) | clip-store | **spec-engine bestaat** (`sam-clip.js`) |
| lesplannen | lesson-store | nieuw |
| adaptieve oefensets | runtime | AQP bestaat (`vak.js`) |

**Afgeleiden zijn óók nodes** (geen losse bestanden), elk met provenance die bindt aan de **versie** van het bron-leerdoel:

```
summary.183
  van:        bi.M.3 @ v4          ← gebonden aan een specifieke leerdoel-versie
  door:       Claude 5             op 2028-02-03
  reviewed:   true
  confidence: 0.9
```

Zodra `bi.M.3` naar v5 gaat, ziet de Validation/Evolution Engine meteen: *summary.183 hoort nog bij v4 → verouderd, hergenereren*. Die versie-binding (via `_meta.version` + `contentHash`) is precies waarom afgeleiden nooit in het leerdoel mogen zitten.

Gevolg: bij een syllabuswijziging pas je **alleen de Curriculum Engine** aan; alle afgeleiden worden opnieuw gegenereerd of gecontroleerd. Nooit andersom.

---

## 4. Drie soorten engines (fundamenteel verschillende verantwoordelijkheden)

| Soort | Engines | Doet | Schrijft |
|---|---|---|---|
| **Producer** | Curriculum · Question · Summary · Animation · Lesson | maakt iets | naar een store (of de bron, alleen Curriculum) |
| **Analyzer** | Evaluation · Metrics · Evolution | observeert, oordeelt, **maakt niets** | niets (levert `{score, issues, warnings, metrics}` / voorstellen) |
| **Orchestrator** | Query | beslist wat wanneer gebeurt | niets (selecteert werk) |

De scheiding is hard: een Analyzer **beslist niet** en muteert niets — hij meet. Beleid ("accepteer als score≥95 en issues=[]") leeft in de **pipeline**, niet in de Analyzer. Zo blijft de evaluator onafhankelijk van welk beleid of AI-model er later draait.

## 4b. Engines (verantwoordelijkheden, niet bestanden)

Denk in verantwoordelijkheden. **Iedere engine leest alleen; alleen de Curriculum Engine schrijft naar de bron.**

```
Curriculum Engine   →  beheert leerdoelen (schrijft bron)     [curriculum-factory.js]
Tagging Engine      →  koppelt vragen ↔ leerdoelen            [tag-leerdoelen.js]  ✔
Summary Engine      →  leerdoel → samenvattingen (tiered)      [te bouwen]
Question Engine     →  leerdoel+misconceptie+skill → vragen    [build-questions.js → upgraden]
Animation Engine    →  leerdoel → SPEC-script → render-targets [sam-clip.js spec-engine]  ✔ DSL
Lesson Engine       →  leerdoelen+voorkennis → lesplan         [te bouwen]
Adaptive Engine     →  mastery per leerdoel/skill → oefenset   [AQP → uitbreiden]
Validation Engine   →  bewaakt kwaliteit over de hele graaf    [§6, deels in smoke/dashboard]
```

---

## 5. Review Gates

Statusketen per leerdoel (`_meta.reviewStatus`):

```
draft  →  reviewed  →  approved  →  production
```

- **draft** — factory-output, nog niet menselijk gecontroleerd (bv. Scheikunde nu).
- **reviewed** — mens heeft nagelopen; structuur akkoord (bv. Biologie nu).
- **approved** — definitief gevalideerd, syllabus-check gedaan; klaar voor downstream.
- **production** — live in afgeleide content.

**Harde regel:**

> **Alleen `approved`-content mag downstream content genereren.**

**Twee-modus-engines (nooit de gate versoepelen om te testen):** een generator heeft een `production`-modus (werkt op `review=approved`) en een `test`-modus (werkt op `review>=reviewed`). Zo test je nooit door de kwaliteitsregel te omzeilen — dat soort uitzondering wordt later ongemerkt permanent. `engine.run(mode, saved_query)` selecteert het werk; de modus bepaalt alleen de review-drempel in die query.

**Vraag-status (los van leerdoel-review):** een koppeling draagt een `status` — `matched` (concept_match/override), `unmatched` (fallback), of `off_level`. Een `off_level`-vraag hoort vermoedelijk niet op dit niveau (bv. VWO-stof in de HAVO-bank) en krijgt **`lo:null`** — géén valse leerdoel-koppeling — plus een `offReason`. Het is een eigenschap van de **vraag**, queryebaar via `curriculum-query.js havo --offlevel` → `OFF_LEVEL → Owner review`.

Een `draft`-leerdoel voedt nooit een generator. Dit voorkomt dat half-gereviewd curriculum slechte samenvattingen/vragen de lucht in duwt.

---

## 6. Validation Engine — de kwaliteitsmanager

Geen generator maar een **validator**; uiteindelijk de belangrijkste engine, want hij bewaakt de integriteit van het hele platform. Draait over de graaf en beantwoordt:

**Dekking**
- Dekt elk syllabusonderdeel minimaal één leerdoel?
- Heeft elk leerdoel voldoende vragen? (nu: dashboard-kolom "gaten")
- Heeft elk leerdoel ≥1 samenvatting / ≥1 animatie / ≥1 examenvraag? (zodra die stores bestaan)

**Graaf-integriteit**
- Bestaan alle `voorkennis`/`vervolg`-prerequisites als echte nodes?
- Zijn er **cycli** in de `vereist`-graaf? (een leerroute mag geen lus hebben)
- Welke leerdoelen zijn **geïsoleerd** (geen inkomende/uitgaande edge)?

**Kwaliteit**
- Welke leerdoelen hebben een lage AI-Ready-score? (nu: dashboard)
- Welke koppelingen zijn laag-confidence / fallback? (nu: sidecar + dashboard)
- Klopt elke `reviewStatus` met de eisen voor die status?

**Nu al deels aanwezig:** `smoke.mjs` (integriteitsguards), het Curriculum Dashboard (dekking/confidence/AI-Ready/review), en `leerdoel-dekking.js`. De Validation Engine is de bundeling hiervan tot één expliciete kwaliteitspoort — en groeit mee zodra de graph-edges en de afgeleide-stores gevuld raken.

## 6b. Curriculum Evolution Engine

Een aparte engine die **niets automatisch schrijft** — hij **stelt alleen voor**. De AI-reviewer van je curriculum (`curriculum-graph.js evolve`). Signalen:

- dit leerdoel heeft inmiddels *N* vragen → misschien splitsen (`split?`)
- deze twee leerdoelen hebben ~95% conceptoverlap → samenvoegen? (`overlap?`)
- dit concept komt in geen enkele vraag voor → gat (`gat`)
- deze prerequisite verwijst naar een niet-bestaand leerdoel (`dangling`)
- deze samenvatting/animatie is gebaseerd op een oude leerdoel-versie (zodra afgeleide-nodes bestaan)
- hier ontbreekt een leerdoel volgens de syllabus (zodra de crawler bronnen levert)

Draait nu al en levert echte signalen op (bv. *bi.A.1 heeft 44 vragen → splitsen*; *concept "Denaturatie" heeft 0 vragen*). Menselijke review beslist; de Curriculum Engine voert pas uit na akkoord.

## 6c. Query Engine — interne SQL voor onderwijs (de enige leesweg)

Geen enkele generator loopt zelf door JSON; iedereen leest hierdoorheen. Het is geen dashboard maar een **declaratieve querytaal**; dashboards zijn **opgeslagen queries** (`SAVED` in `curriculum-query.js`).

```
curriculum-query.js havo --where "gewicht=hoog AND vragen<10 AND review=reviewed"
curriculum-query.js havo --where "concept=energie AND misconcepties>=1"
curriculum-query.js havo --saved klaar-voor-generatie      # review=approved AND airready>=90
curriculum-query.js havo --list                            # alle opgeslagen queries + velden
```

Velden: `gewicht · review · vak · vragen · airready · confidence · syllabus · misconcepties · voorbeelden · voorkennis · concept`. Ops: `= != < > <= >= · missing(...) · has(...) · AND / OR`. `--json` voor andere engines.

**Waarom dit het hele systeem test:** *"de kwaliteit van een kennismodel blijkt uit de vragen die je eraan kunt stellen."* Als deze queries nuttige antwoorden geven, kloppen de Knowledge Graph, de Curriculum Layer, de provenance en de relaties — indirect getoetst. Voorbeeld dat de poort zichtbaar maakt: `klaar-voor-generatie` = **0** zolang niets `approved` is. **Content-stores** (summary/animatie/flashcards) bestaan nog niet → `missing(summary)` is bewust altijd waar, zodat de query **de content-backlog toont**. Dashboards = opgeslagen queries; nieuwe inzichten = één regel erbij.

## 6d. Metrics Engine (KPI's van het curriculum, niet van de leerling)

Bundelt de kwaliteitsmaten van de curriculumlaag zelf: `Coverage · Difficulty · Concept Density · Question Diversity · Example Diversity · Animation/Summary Coverage · Cross-subject Connectivity · Evidence Completeness · Review Debt`. Een deel wordt nu al berekend (dashboard: dekking/AI-Ready; graph: cross-subject; evolve: split/overlap). De Metrics Engine consolideert dit tot één KPI-set die over de tijd te volgen is. *(additief; te bouwen)*

---

## 7. Roadmap (herschreven)

Niet lineair `Curriculum → Content → Adaptive`, maar een stabiele kern met vervangbare randen:

```
Curriculum Engine ──► Knowledge Graph ──┬──► Content Engines ──┐
                                        └──► Validation Engine ─┴──► Student / Docent
```

- **F1.6** — curriculumlaag compleet voor alle vakken (HAVO → VWO), batchgewijs via de factory.
- **F1.65 — Semantic Layer** — semantische feiten per concept (pilot Enzym gedaan). Levert reasoning + auto-KU's. Kleinste bewijseenheid: één concept, niet één leerdoel.
- **F1.7** — review-gates doorlopen: elk vak van `draft` → `reviewed` → `approved`.
- **F2** — Question Engine: `leerdoel → concepten → misconceptie → examenskill → examengewicht → difficulty → vraag`. **Eerste versie gebouwd** (`scripts/question-engine.js`): query-gedreven selectie (via de Query Engine, engine kiest niet zelf), twee modi (`production`=approved / `test`=reviewed), verbruikt alle metadata-assen en schrijft generatie-specs met provenance naar `knowledge/generated/`. De prozastap (`spec → vraagtekst`) is de pluggable LLM-kern. Bewijst de integratie: `production` op HAVO levert 0 (niets approved) — de gate versoepelt niet om te testen.
- **F2.5 — Evaluation Engine** (consument; **eerste versie gebouwd**, `scripts/evaluation-engine.js`). De fase verschuift van *"kan de engine genereren?"* naar *"is de content daadwerkelijk goed?"* — dé maatstaf waarop Slagio wordt afgerekend. Structureel (geen LLM) op de **bestaande** bank: 4 opties · precies één geldig antwoord · geen dubbele opties · uitleg · moeilijkheidsveld · lengte-bias · antwoordpositie-bias · dubbele vragen · leerdoel-koppeling → één kwaliteitsscore per vak. Vond echte tells (na: 43% antwoordpositie-bias, 6 dubbele vragen). LLM/mens-checks (inhoud klopt? misconceptie past? lijkt op CE-vraag?) zijn pluggable. **Kwaliteitslat zetten bij de eerste consument; latere consumenten erven ervan.**
- **F3** — overige Content Engines (Summary tiered, Animation vanuit DSL, Lesson).
- **F4** — Adaptive Engine op mastery per leerdoel/skill.
- **Doorlopend** — Validation Engine bewaakt alles.

**Kernprincipe:** de Content Engines mogen komen en gaan; de Curriculum Engine, de Knowledge Graph en de Validation Engine zijn het fundament dat blijft.
