# F1 — Curriculum Intelligence Layer · Ontwerpvoorstel

**Status:** ✅ akkoord · M1 + coverage-review + M2 uitgevoerd (bi-pilot) · **Datum:** 2026-07-22 · **Uitgangspunt:** *"Spec-principes ja, spec-stack nee."*
Geen rewrite. Huidige architectuur (statische vanilla-PWA + Supabase, geen build-stap) blijft. Alles hieronder is **additief en omkeerbaar**.

**Goedgekeurde beslissingen (§9):** (1) bronhiërarchie vastgesteld, (2) 4–8 leerdoelen per domein, (3) één primair leerdoel per vraag in F1, (4) pilot = HAVO Biologie. Aanvulling: naast `vaardigheid` (kennisdimensie) komt een **aparte `examenskill`-laag** (examenvaardigheidsdimensie), zodat adaptive learning later kennis- en examenvaardigheidsgaten kan onderscheiden.

---

## 1. Doel

De vraagbank weet nu *dát* een vraag bij een domein hoort, maar niet *wélk leerdoel* hij toetst. De Curriculum Intelligence Layer voegt één ontbrekende laag toe tussen **domein** en **vraag**:

```
Vak → Domein → [NIEUW] Leerdoel → Vraag
                        ↑
              gekoppeld aan officiële eindterm (examenprogramma/syllabus)
```

Dat levert drie dingen op die de kernbelofte ("precies wat je nodig hebt") mogelijk maken:

1. **Dekkingsinzicht** — per leerdoel zien hoeveel (en hoe goede) vragen er zijn → gaten worden zichtbaar.
2. **Fijnmazige diagnose** — mastery per leerdoel i.p.v. alleen per domein.
3. **Gerichte generatie** — F2 (Question Intelligence) kan straks vragen maken *voor een specifiek leerdoel* i.p.v. voor een losse term.

Dit ontwerp beschrijft **alleen laag F1** (de kennisstructuur + koppeling). Adaptiviteit-op-leerdoel en generatie zijn latere fases; F1 legt hun fundament.

---

## 2. Datastructuur

### 2.1 Waar het leeft

De leerdoelen zijn **redactionele broncontent**, geen gebruikersdata. Ze horen dus thuis in het codebase-artefactenmodel, niet in Supabase — precies zoals `SAM_RICH` (samenvattingen).

Nieuw bestand, lazy-geladen per niveau, exact volgens het bestaande `sam-havo.js`-patroon:

```
knowledge-havo.js   // Object.assign(LEERDOELEN, { ... })   — HAVO
knowledge-vwo.js    // Object.assign(LEERDOELEN, { ... })   — VWO
```

`data.js` krijgt (later, bij implementatie) een lege `const LEERDOELEN = {}` + een lazy-loader `ensureLeerdoelData(niveau)` naar analogie van `ensureSamData()`. Niet op het boot-pad → geen invloed op laadtijd.

### 2.2 Vorm

Sleutel = `"<vakId>_<domeinId>"` (zelfde conventie als `SAM_RICH`). Waarde = lijst leerdoelen.

```js
Object.assign(LEERDOELEN, {
  "bi_M": {
    syllabus: "CE Biologie HAVO — subdomein B (Molecuul- en celniveau)",
    leerdoelen: [
      {
        id: "bi.M.1",                       // stabiele, unieke id (vak.domein.volgnr)
        titel: "Bouw en functie van de cel",
        eindterm: "B1",                     // koppeling naar het examenprogramma
        beschrijving: "De kandidaat kan celorganellen en hun functie benoemen en met elkaar in verband brengen.",
        concepten: ["celmembraan", "mitochondrion", "celkern", "ribosoom"],
        vaardigheid: "verklaren",           // KENNISdimensie — vaste lijst (§2.3)
        examenskill: "bron-interpretatie",  // EXAMENVAARDIGHEIDSdimensie — vaste lijst (§2.4)
        examenrelevantie: "hoog",           // hoog | midden | laag
        veelgemaakteFouten: [               // voedt later F2 (misconceptie-afleiders)
          "verwart mitochondrion met chloroplast",
          "denkt dat plantencellen geen celmembraan hebben"
        ]
      }
      // ...
    ]
  }
});
```

**Ontwerpkeuzes:**

- **Id-schema `vak.domein.volgnr`** (`bi.M.1`) — leesbaar, stabiel, sorteerbaar. Wordt de koppelsleutel op vragen. Id's zijn *append-only*: een leerdoel dat vervalt wordt gemarkeerd, niet hernummerd (anders breken bestaande koppelingen).
- Alle velden behalve `id`/`titel` zijn optioneel → een leerdoel kan groeien van "alleen titel" naar volledig verrijkt zonder dat er iets breekt.
- `veelgemaakteFouten` is nu al voorzien maar wordt in F1 nog niet gebruikt — het is de haak voor F2.

### 2.3 Vaardigheid — de KENNISdimensie (vaste enum)

*Wat moet je cognitief met de kennis kunnen?* Eén korte, gedeelde enum i.p.v. vrije tekst, zodat filteren/rapporteren betrouwbaar is:

`onthouden · beschrijven · verklaren · toepassen · berekenen · analyseren · beoordelen`

(bewust compact; sluit aan op RTTI/Bloom zonder academische ballast.)

### 2.4 Examenskill — de EXAMENVAARDIGHEIDSdimensie (vaste enum) · **nieuw**

*Op welke examentechniek word je afgerekend, los van of je de stof kent?* Deze laag staat **orthogonaal** op `vaardigheid`: een leerling kan de biologie kennen (vaardigheid oké) maar punten verliezen omdat hij de bron verkeerd leest, stappen niet toont of de verkeerde eenheid gebruikt. Vak-overstijgend, klein gehouden:

| examenskill | wat het toetst |
|---|---|
| `bron-interpretatie` | informatie halen uit tekst, grafiek, tabel, afbeelding of microscoopbeeld |
| `data-verwerken` | rekenen, eenheden, significante cijfers, aflezen/omrekenen |
| `meerstaps-redeneren` | een oorzaak→gevolg-keten of afleiding in meerdere stappen opbouwen |
| `antwoord-formuleren` | antwoord geven volgens correctievoorschrift: juiste vakterm, volledige puntdekking |
| `context-transfer` | bekende stof toepassen op een nieuwe, onbekende examensituatie |

**Waarom apart bewaren:** in een latere fase houdt de Adaptive Learning Engine mastery **per dimensie** bij. Zo kan het systeem onderscheiden tussen *"je kent domein M niet"* (kennisgat → meer uitleg + kennisvragen) en *"je beheerst bron-interpretatie niet"* (examenvaardigheidsgat → gerichte examentraining, ongeacht het vak). Dat onderscheid is precies wat de brief bedoelt met diagnosticeren i.p.v. alleen goed/fout. In F1 leggen we de laag alleen vast; we sturen er nog niet op.

---

## 3. Koppeling van bestaande vragen

### 3.1 De koppeling draagt provenance: `lo` + `confidence` + `source`

Een koppeling is niet zomaar een leerdoel-id, maar een **beoordeeld feit met herkomst**. Elke koppeling bewaart daarom drie dingen:

```js
{
  lo:         "bi.M.3",          // het primaire leerdoel-id
  confidence: 0.94,              // 0–1: hoe zeker is deze koppeling?
  source:     "concept_match",   // concept_match | fallback | manual_override
  via:        "Enzym"            // (optioneel) het beslissende concept, of null
}
```

**Waarom confidence + source vanaf dag één** (ook al gebruikt de app ze nog niet):
- Een latere AI-/adaptive-laag weet dan *welke koppelingen betrouwbaar zijn*. Laag-confidence of `fallback` → **niet gebruiken voor AI-training** en **eerst menselijke review**; hoog-confidence `concept_match` of `manual_override` → bruikbaar.
- Over twee jaar is nog reconstrueerbaar *waaróm* een vraag aan een leerdoel hangt. Dat is precies de "bewaar bron/prompt/score"-eis uit de Execution Brief, hier in het klein.

**Confidence-regels** (deterministisch, uitlegbaar):

| situatie | confidence | source |
|---|---|---|
| één leerdoel scoort, geen concurrent | **0.97** | `concept_match` |
| duidelijke winnaar (grote marge t.o.v. tweede) | **0.80–0.95** | `concept_match` |
| krappe winst (tweede leerdoel dichtbij) | **0.50–0.75** | `concept_match` |
| geen concepthit → domein-hoofdleerdoel | **0.30** | `fallback` |
| handmatig vastgesteld | **1.00** | `manual_override` |

Drempel: `confidence < 0.70` = "onzeker" → gemarkeerd voor menselijke review, uitgesloten van AI-training tot bevestigd.

### 3.2 Waar de metadata leeft: een **sidecar**, niet op de vraag zelf

De koppelingsmetadata komt in een apart bestand, **niet** als veld in `data-havo.js`:

```
knowledge-koppeling-havo.js   // LO_KOPPELING["bi"] = { "<qkey>": {lo, confidence, source, via} }
```

- `qkey` = een stabiele sleutel per vraag (de eerste 80 tekens van `v` — geverifieerd **botsingsvrij** over alle 444 bi-vragen; sluit aan op de bestaande `aqpQKey`-conventie).
- **Waarom sidecar i.p.v. een veld op de vraag:** `data-havo.js` wordt *gegenereerd* door `build-questions.js`. Een `lo`-veld in de vraag zou bij de volgende contentbuild worden **overschreven**. De sidecar overleeft regeneratie, houdt de vragen én de geshipte `q/*.js` **byte-identiek** (dus **geen** payload-groei en **geen** deploy nodig zolang de app `lo` nog niet gebruikt), en is volledig omkeerbaar (bestand weg = klaar).
- **Runtime-join later:** wanneer een fase `lo` wél gaat gebruiken, joint de app op dezelfde `qkey` (in-browser triviaal te berekenen). Pas dan wordt de sidecar in `index.html`/`sw.js` opgenomen en volgt een SW-bump.

> Dit wijkt bewust af van de eerdere schets ("veld op de vraag"): de sidecar is robuuster tegen de generatiepijplijn en risicovrij voor de live site. De koppeling blijft conceptueel `Vraag → leerdoel → confidence`, alleen fysiek losgekoppeld.

### 3.3 Hoe de koppeling tot stand komt (semi-automatisch)

Nieuw hulpscript `scripts/tag-leerdoelen.js` (offline, draait naast `build-questions.js`), in drie lagen van grof naar fijn — **cruciaal na de coverage-review (§F1-BIOLOGIE-COVERAGE-REVIEW): match op vraagstam + JUIST antwoord, niet op de afleiders.** De afleiders zijn sibling-begrippen en veroorzaakten anders ~20% misassignments.

1. **Concept-match op stam + juist antwoord** — `sv`: `v` + `o[c]`; `oe`: `v` + `ctx` + `u` (de `o` is bij open vragen leeg). Het leerdoel met de sterkste conceptdekking wint; langere concepten wegen zwaarder. Levert `confidence` + `source: concept_match` + `via` (§3.1).
2. **Domein-fallback** — geen enkele concepthit → het aangewezen hoofdleerdoel van het domein, met `confidence: 0.30` + `source: fallback`. Bewust láág, zodat het als "onzeker, review nodig" opvalt.
3. **Handmatige overrides** — een klein, gecureerd `OVERRIDES`-mapje (`qkey → lo`) voor de restambiguïteiten, met `confidence: 1.00` + `source: manual_override`.

Het script is **idempotent** en **rapporteert** (net als `build-questions.js --check`): dekking, gemiddelde confidence, aantal laag-confidence (<0.70), aantal fallback en override, en leerdoelen zonder vragen. Het schrijft **uitsluitend** de sidecar `knowledge-koppeling-havo.js` — nooit `data-havo.js` of `q/*.js`.

---

## 4. Database-aanpassingen (Supabase)

**Voor de kennisstructuur zelf: géén.** Leerdoelen zijn statische content (§2.1). Er komt geen tabel voor leerdoel-definities.

De enige Supabase-raakvlakken zijn *observationeel* en passen binnen het bestaande schema **zonder migratie**:

| Wat | Hoe | Migratie nodig? |
|---|---|---|
| Vastleggen wélk leerdoel een leerling fout had | `trackEvent('vraag_fout', {…, lo:'bi.M.1'})` — `events.meta` is al `jsonb` | **Nee** |
| Mastery per leerdoel | client-side in localStorage (`slagio_lo_v1`, naar analogie van `slagio_aqp_v1`), meegesynct via bestaande `cloudSet(lvlCol('progress'))` jsonb-kolom | **Nee** |

Bewust **geen** aparte `mastery_leerdoel`-tabel in F1: het bestaande patroon (client-side voortgang + jsonb-sync) draagt dit prima en houdt de blast-radius nul. Een dedicated tabel is pas nodig als we cross-device/aggregatie-analyse op leerdoelniveau willen — dat is een expliciete latere afweging, geen F1-vereiste.

**Netto: F1 vereist nul schema-migraties.** Dat is opzettelijk — het maakt F1 volledig terugdraaibaar.

---

## 5. Migratiestrategie

Strikt gefaseerd en na elke stap deploybaar (main blijft groen):

| Stap | Actie | Reversibel? |
|---|---|---|
| **M0** | Dit ontwerp → akkoord | n.v.t. |
| **M1** | `knowledge-havo.js` schrijven **voor alleen de pilot (bi)** + lege `LEERDOELEN` + `ensureLeerdoelData()` in `data.js`. Nog geen vraag aangeraakt. | Verwijder bestand |
| **M2** | `scripts/tag-leerdoelen.js` draaien → `lo`-veld toevoegen in `data-*.js` voor **alleen bi** → `split-data.js` → q-files geüpdatet. `smoke.mjs`-guard: elke `lo` verwijst naar een bestaand leerdoel-id. | Strip `lo`-veld |
| **M3** | Coverage-matrix (§6) zichtbaar maken in `admin.html` (read-only rapport). | Verwijder sectie |
| **M4** | Evaluatie op de pilot → akkoord om uit te rollen → M1–M3 herhalen per vak, in batches (zoals de content-batches eerder). | per vak |

Elke stap = één commit + SW-bump + `smoke.mjs` groen, exact het bestaande deployritme. Geen big-bang.

**Rollback:** omdat `lo` optioneel is en de kennisbestanden lazy zijn, herstelt het verwijderen van de bestanden + het strippen van `lo` de app 1:1 naar de huidige toestand. Geen datamigratie om terug te draaien.

---

## 6. Pilot: HAVO Biologie

**Waarom bi als pilot:**

- Inhoud is al "goud" (alle domeinen M/O/P volledig), dus we testen de *koppeling*, niet de content.
- Heldere, hiërarchische syllabusstructuur (molecuul → cel → orgaan → populatie) → leerdoelen laten zich natuurlijk afbakenen.
- Veel vragen + rijke begrippenlijst → concept-match (§3.2) heeft genoeg houvast.
- Representatief: als het hier werkt, schaalt het patroon naar de andere exacte én talige vakken.

**Pilot-deliverable (alles ná akkoord):**

1. `knowledge-havo.js` met leerdoelen voor alle bi-domeinen, elk met eindterm-verwijzing en concepten.
2. Alle bi-vragen gekoppeld (`lo`), met een dekkingsrapport (≥95% gekoppeld als doel; rest expliciet gemeld).
3. Coverage-matrix in admin: per leerdoel → **#vragen** en **gem. foutratio** (uit `events`). Leerdoelen met 0 vragen of hoge foutratio = de eerste werklijst voor F2.
4. Korte evaluatienotitie: klopt de indeling didactisch, en dekt hij het examenprogramma?

Pas na een geslaagde pilot bespreken we uitrol naar de overige 27 vakken.

---

## 7. Coverage-matrix (de opbrengst die F1 zichtbaar maakt)

Het rapport dat F1 verantwoordt en F2 voedt:

```
Biologie HAVO — domein M (Molecuul- en celniveau)
┌─────────┬────────────────────────────┬────────┬───────────┬─────────────┐
│ leerdoel│ titel                      │ #vragen│ foutratio │ examenrelev.│
├─────────┼────────────────────────────┼────────┼───────────┼─────────────┤
│ bi.M.1  │ Bouw en functie van de cel │   14   │   22%     │ hoog        │
│ bi.M.2  │ Transport door membranen   │    3   │   48%     │ hoog   ⚠    │  ← te weinig vragen + hoge fout
│ bi.M.3  │ Enzymwerking               │    0   │    –      │ midden ⚠    │  ← gat
└─────────┴────────────────────────────┴────────┴───────────┴─────────────┘
```

Regels met ⚠ zijn de directe input voor de latere Question Intelligence (F2): *dít* leerdoel heeft vragen nodig. Zo wordt "kwaliteit boven volume" concreet stuurbaar i.p.v. een losse ambitie.

---

## 8. Wat verandert NIET

- Geen wijziging aan quizlogica, scoreformule, AQP-adaptiviteit of `qDiff`.
- Geen nieuwe runtime-dependency, geen build-stap, geen framework.
- Geen Supabase-schema-migratie.
- Geen gedragsverandering voor de leerling in F1 — de laag is eerst *observationeel*. Zichtbare leerdoel-features (mastery-badge per leerdoel, gerichte oefensets) zijn een bewuste latere stap, pas nadat de data klopt.

---

## 9. Beslissingen — vastgesteld ✅

1. **Bronhiërarchie voor de leerdoelen** (van leidend naar aanvullend):
   `CvTE-examenprogramma → officiële syllabus → examenblad.nl → correctievoorschriften oude examens → aanvullende betrouwbare bronnen`.
   Elk leerdoel krijgt een `eindterm`-verwijzing die op deze bronketen teruggaat. Waar een exacte CvTE-code nog geverifieerd moet worden tegen de definitieve syllabus, is dat als zodanig gemarkeerd (`teVerifiëren: true`) zodat het bij de review opvalt.
2. **Granulariteit:** 4–8 leerdoelen per domein.
3. **Koppeling:** één primair leerdoel per vraag in F1; many-to-many bewaard voor een latere fase.
4. **Pilot-vak:** HAVO Biologie (§6).
5. **Examenskill-laag:** apart van `vaardigheid` (§2.4), voor latere adaptive learning op kennis- vs. examenvaardigheidsniveau.

### M1 — status (in uitvoering)

Scope zoals afgesproken: *schrijf alleen de pilot-leerdoelen, raak nog geen vragen aan, maak eerst het dekkingsrapport, geen deploy tot de pilotstructuur is beoordeeld.*

- `knowledge-havo.js` — leerdoelen voor de 4 bi-domeinen (A/M/O/P). **Geen vraag aangeraakt** (geen `lo`-veld geschreven).
- `scripts/leerdoel-dekking.js` — **dry-run**: matcht bestaande vragen op leerdoelen (concept-match + domein-fallback) en rapporteert dekking **zonder iets te schrijven**.
- Uitkomst = het dekkingsrapport dat je beoordeelt vóórdat M2 (`lo` daadwerkelijk wegschrijven) begint. Nog geen SW-bump, nog geen push naar `main`.

### M2 — uitgevoerd (bi-pilot)

- **Coverage-review** eerst (`docs/F1-BIOLOGIE-COVERAGE-REVIEW.md`): structuur akkoord, matcher moest bijgesteld.
- **Conceptopschoning** in `knowledge-havo.js`: `Ribosoom` alleen nog bij `bi.M.5` (primaire eigenaar); `Niche` → `bi.P.1`, `Negatieve terugkoppeling` → `bi.O.3`, `Denaturatie` → `bi.M.3`.
- **`scripts/tag-leerdoelen.js`** — matcht op vraagstam + juist antwoord (+ begrip-detectie voor definitievragen), met confidence + source + via. 13 curated `OVERRIDES`.
- **`knowledge-koppeling-havo.js`** (sidecar) — 444 koppelingen: 431 `concept_match`, 13 `manual_override`, 0 `fallback`, gem. confidence **0.947**, 4 laag-confidence (alle inhoudelijk correct). `data-havo.js`/`q/*.js` **byte-identiek** → geen deploy.
- **smoke.mjs** sectie 5d: bewaakt id-schema, geen gedeelde concepten, en dat elke koppeling → bestaand leerdoel, geldige confidence/source, sidecar ⊆ bron, alle 444 vragen gedekt. 59/59 groen.
- Nog geen SW-bump / geen `main`: de sidecar wordt nog niet door de app geladen (dat is een latere fase).
