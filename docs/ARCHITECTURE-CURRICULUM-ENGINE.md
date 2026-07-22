# Slagio — Curriculum Engine & Knowledge Graph (kernarchitectuur)

**Status:** vastgesteld · **Doel:** de laag waar de komende jaren niets fundamenteels meer aan hoeft te veranderen.
De specifieke generators, AI-modellen en prompts zullen veranderen; **deze vijf lagen blijven**. Een architectuur is sterk als ze de techniek die eronder verandert kan overleven.

## De vijf lagen (blijvende architectuur)

```
1. Knowledge Layer      curriculum: leerdoelen, concepten, misconcepties, examenskills   (source of truth)
        │
2. Relationship Layer   de graaf: nodes + edges (leerdoel↔concept↔examen↔domein↔vak)
        │
3. Generation Layer     afgeleiden: vragen, samenvattingen, animaties, flashcards, lesplannen
        │
4. Validation Layer     review, QA, coverage — én de Curriculum Evolution Engine
        │
5. Experience Layer      student, docent, AI-tutor
```

Alleen laag 1 wordt handmatig beheerd/gereviewd. Laag 3 is volledig afgeleid en weggooibaar. Laag 4 bewaakt en **stelt voor** (schrijft nooit). De F-fases (F1, F2, …) zijn ontwikkelvolgorde; deze vijf lagen zijn de blijvende structuur.

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

## 4. Engines (verantwoordelijkheden, niet bestanden)

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

---

## 7. Roadmap (herschreven)

Niet lineair `Curriculum → Content → Adaptive`, maar een stabiele kern met vervangbare randen:

```
Curriculum Engine ──► Knowledge Graph ──┬──► Content Engines ──┐
                                        └──► Validation Engine ─┴──► Student / Docent
```

- **F1.6** — curriculumlaag compleet voor alle vakken (HAVO → VWO), batchgewijs via de factory.
- **F1.7** — review-gates doorlopen: elk vak van `draft` → `reviewed` → `approved`.
- **F2** — Question Engine: `leerdoel → misconceptie → examenskill → moeilijkheid → vraagtype → vraag`.
- **F3** — overige Content Engines (Summary tiered, Animation vanuit DSL, Lesson).
- **F4** — Adaptive Engine op mastery per leerdoel/skill.
- **Doorlopend** — Validation Engine bewaakt alles.

**Kernprincipe:** de Content Engines mogen komen en gaan; de Curriculum Engine, de Knowledge Graph en de Validation Engine zijn het fundament dat blijft.
