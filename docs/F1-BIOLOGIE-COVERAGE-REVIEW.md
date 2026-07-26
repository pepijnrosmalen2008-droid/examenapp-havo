# Curriculum Coverage Review — HAVO Biologie (F1 pilot)

**Doel:** validatielaag vóór M2. Beoordeelt of de 25 pilot-leerdoelen de stof dekken én of de automatische concept-match inhoudelijk klopt.
**Datum:** 2026-07-22 · **Scope:** alleen analyse — geen codewijziging, geen deploy.
**Uitkomst in één zin:** de leerdoelstructuur is inhoudelijk gezond en klaar voor M2, **mits** de tagging-matcher eerst wordt bijgesteld (nu matcht hij mee op afleiders, wat ~1 op de 5 vragen verkeerd koppelt) **en** een handvol gedeelde/ontbrekende concepten wordt opgelost.

---

## Deel 1 — Structurele review

### 1. Dekken de 25 leerdoelen alle syllabusonderdelen?

**Binnen de aanwezige vraagbank: ja, volledig.** Elk van de 4 domeinen (A/M/O/P) is gedekt, elk leerdoel heeft ≥3 vragen, geen enkel leerdoel staat leeg. De inhoudelijke content-gebieden van de vraagbank zijn afgedekt:

| domein | gedekte kerngebieden |
|---|---|
| A | onderzoek opzetten · betrouwbaarheid/validiteit · data & grafieken · correlatie/causaliteit · practicum |
| M | cel & organellen · membraantransport · enzymen · stofwisseling · DNA/eiwitsynthese · celdeling · genetica |
| O | zenuwstelsel · hormonen · homeostase · afweer · transport/gasuitwisseling · vertering/uitscheiding · beweging |
| P | ecosysteem · voedselrelaties · populaties · soortrelaties · successie/biodiversiteit · evolutie |

**Belangrijke nuance — "dekt de content de syllabus?" is een andere vraag dan "dekken de leerdoelen de content?".** De leerdoelen zijn trouw aan wat er in de vraagbank zit, maar de vraagbank zelf lijkt een paar officiële HAVO-biologie CE-onderwerpen te missen (te verifiëren tegen de definitieve syllabus):

- **Voortplanting / reproductie** (seksuele voortplanting, cyclus, bevruchting, embryonale ontwikkeling) — geen begrippen/vragen gevonden.
- **Gedrag / ethologie** (aangeboren vs. aangeleerd gedrag) — niet aanwezig.
- **Plantfysiologie** (transport in planten: xyleem/floëem) — alleen fotosynthese, geen planttransport.
- **Biotechnologie / DNA-technologie** (PCR, genetische modificatie) — niet expliciet.
- **Stofkringlopen** (koolstof-/stikstofkringloop) — alleen indirect via "Nutriënt".

> **Aanbeveling:** dit zijn geen leerdoel-fouten maar **content-gaten**. Ze zijn de eerste, best gemotiveerde werklijst voor F2 (Question Intelligence). Zodra de syllabus-check bevestigt dat ze examenrelevant zijn, komen er leerdoelen + gegenereerde vragen bij. Nu niets forceren.

### 2. Zijn leerdoelen te breed of te smal?

Grotendeels goed uitgebalanceerd (4–8 per domein). Twee aandachtspunten, geen blockers:

- **Aan de brede kant:** `bi.A.1 Onderzoek opzetten`, `bi.M.1 Bouw en functie van de cel`, `bi.P.2 Voedselrelaties en energiedoorgifte` trekken de meeste vragen. Ze zijn coherent (één samenhangend thema), dus opsplitsen is optioneel — pas overwegen als de vraagaantallen ná de matcher-fix (§Deel 2) nog steeds scheef staan.
- **Aan de dunne kant:** `bi.M.2 Membraantransport` (4), `bi.M.3 Enzymwerking` (3), `bi.A.4 Correlatie/causaliteit` (5), `bi.P.4 Soortrelaties` (5). Dit zijn **legitiem afgebakende** leerdoelen met wéinig vragen — geen "te smal", maar wél de duidelijkste F2-generatiedoelen (deze onderwerpen zijn examenrelevant en verdienen meer items).

> De vraagaantallen hierboven zijn **voorlopig**: ze komen uit de huidige (nog te corrigeren) matcher. Na de fix in Deel 2 verschuiven ze.

### 3. Ontbrekende conceptgebieden

Naast de content-gaten uit §1, twee kleinere omissies *binnen* bestaande leerdoelen:

- **`Niche`** komt in vragen voor (P.1) maar staat niet als concept — toevoegen aan `bi.P.1`.
- **`Negatieve terugkoppeling`** is dé kernterm van homeostase en duikt op in de juiste antwoorden, maar staat niet als concept bij `bi.O.3` — toevoegen.
- Overweeg **`Enzym-optimum` / `denaturatie`** expliciet bij `bi.M.3` (nu impliciet).

### 4. Zijn de examenskill-categorieën logisch verdeeld?

Verdeling over de 25 leerdoelen:

| examenskill | # leerdoelen |
|---|---|
| meerstaps-redeneren | 9 |
| bron-interpretatie | 9 |
| data-verwerken | 3 |
| context-transfer | 3 |
| antwoord-formuleren | **1** |

**Grotendeels logisch**, met één scheefheid en één structurele observatie:

- **`antwoord-formuleren` is ondervertegenwoordigd (1×).** Juist bij biologie sneuvelen op het CE veel punten op formulering volgens het correctievoorschrift (open vragen). Verwacht zou zijn dat dit zwaarder weegt, zeker op de `oe`-vragen.
- **Structureel:** examenskill is eigenlijk natuurlijker een eigenschap van de **vraag** dan van het **leerdoel**. Eenzelfde leerdoel kan via een meerkeuzevraag `bron-interpretatie` toetsen en via een open examenvraag `antwoord-formuleren`. Het leerdoel-niveau vangt alleen de *dominante* skill.

> **Aanbeveling:** houd examenskill op het leerdoel als "dominante skill" (nu prima), maar plan voor een latere fase een **examenskill-tag per vraag** — vooral op de `oe`-vragen. Dat is precies wat adaptive learning nodig heeft om een kennisgat van een examenvaardigheidsgat te onderscheiden (het oorspronkelijke doel van de aparte laag). Niet in M2 forceren; wel nu vastleggen als richting.

---

## Deel 2 — Steekproef-audit van de concept-match

**Opzet:** 51 vragen, gespreid over alle 4 domeinen (A:12, M:13, O:13, P:13), inclusief `sv` en `oe`. Per vraag beoordeeld of het toegewezen leerdoel inhoudelijk klopt.

### Resultaat

| | |
|---|---|
| Steekproefgrootte | 51 |
| Inhoudelijk **correct** | 38 (≈75%) |
| **Fout** toegewezen | 13 (≈25%) |
| Verdeling fouten | A:3 · M:3 · O:4 · P:3 |

### Grondoorzaak (systematisch, één oorzaak)

**De matcher scoort mee op de afleiders (foute antwoordopties), niet alleen op de vraag + het juiste antwoord.** Bij Slagio's begrip-quizvragen zíjn de afleiders andere begrippen uit hetzelfde domein. Die injecteren concurrerende concepthits en trekken de toewijzing naar het verkeerde leerdoel. Voorbeelden uit de steekproef:

| vraag (juist antwoord) | kreeg | hoort bij | afleider die het kaapte |
|---|---|---|---|
| "deel van een populatie dat je onderzoekt" (Steekproef) | A.4 | **A.2** | optie "Correlatie vs. causaliteit" |
| "proef zonder de onderzochte factor" (Controle-experiment) | A.4 | **A.1** | idem |
| "optimum, verband tussen assen" (Grafiek lezen) | A.2 | **A.3** | opties "Validiteit"/"Placebo" |
| "Wat houdt Enzym in?" (biokatalysator) | M.4 | **M.3** | optie "Celademhaling" |
| "Wat betekent DNA?" (erfelijke info) | M.3 | **M.5** | optie "Energie" |
| "snelle onwillekeurige reactie" (Reflex) | O.2 | **O.1** | optie "Glucagon" |
| "spier met tegengestelde werking" (Antagonist) | O.1 | **O.7** | optie "Zenuwstelsel" |
| "Wat betekent Glucagon?" (verhoogt bloedglucose) | O.3 | **O.2** | optie "Homeostase" |
| "Wat houdt Exoot in?" (ingevoerde soort) | P.3 | **P.4** | optie "Draagkracht" |

In **elk** foutgeval wees het juiste antwoord + de vraagstam onmiskenbaar het goede leerdoel aan; alleen een afleider stuurde het mis.

### Geverifieerde fix (getest, read-only)

Ik heb dezelfde match nagerekend op **alleen vraagstam + juist antwoord** (afleiders uitgesloten), over alle 444 bi-vragen:

- **91 van 444 toewijzingen (20,5%) veranderen** — en in de steekproef corrigeren die veranderingen vrijwel alle 13 fouten (Steekproef→A.2, Controle-experiment→A.1, Enzym→M.3, DNA→M.5, Reflex→O.1, Antagonist→O.7, Glucagon→O.2, Exoot→P.4, …).
- Kosten: fallback stijgt licht (16 → 22 vragen zonder concepthit), doordat sommige afleider-"toevalstreffers" wegvallen. Dat is juist gewenst: liever eerlijk als fallback gemarkeerd dan fout-zeker gekoppeld.

**Restpunt na de fix:** een paar concepten staan bij **twee** leerdoelen en blijven dan ambigu — met name **`Ribosoom`** (bij zowel `bi.M.1` cel als `bi.M.5` eiwitsynthese). Zulke gedeelde concepten hebben een aangewezen *primaire eigenaar* of een tie-break-regel nodig (bv. langste-concepthit + domeinvolgorde, of concept uniek toewijzen).

---

## Conclusie & advies voor M2

De **structuur is akkoord-waardig**: 25 leerdoelen, gezonde dekking, logische (zij het licht scheve) examenskill-verdeling. De pilot heeft echter drie concrete verbeteringen nodig **vóórdat** `lo` wordt weggeschreven, anders bevriezen we ~20% verkeerde koppelingen in de data:

1. **Matcher bijstellen** — match op **vraagstam + juist antwoord**, niet op de afleiders. (Grootste effect; lost het gros van de fouten op.)
2. **Gedeelde/ontbrekende concepten opschonen** — primaire eigenaar voor `Ribosoom`; `Niche` en `Negatieve terugkoppeling` toevoegen als concepten.
3. **Handmatige overrides** voor het restant dat na 1+2 nog fallback/ambigu is (geschat enkele tientallen), met een `--check`-rapport zoals de vragen-engine.

**Content-gaten** (voortplanting, gedrag, plantfysiologie, biotech, kringlopen) en de **examenskill-per-vraag** zijn géén M2-blockers — het zijn de eerste, goed gemotiveerde doelen voor F2 respectievelijk een latere fase.

> Voorstel: M2 start pas na akkoord op deze drie punten. De matcher-fix + conceptopschoning zijn klein en blijven binnen "additief en omkeerbaar".
