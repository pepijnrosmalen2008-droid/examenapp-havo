# F1 — Curriculum Intelligence Layer · Ontwerpvoorstel

**Status:** ter goedkeuring · **Datum:** 2026-07-22 · **Uitgangspunt:** *"Spec-principes ja, spec-stack nee."*
Geen rewrite. Huidige architectuur (statische vanilla-PWA + Supabase, geen build-stap) blijft. Alles hieronder is **additief en omkeerbaar**. Er wordt **geen code geschreven** voordat dit ontwerp akkoord is.

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
        vaardigheid: "verklaren",           // uit vaste lijst (§2.3)
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

### 2.3 Vaste vaardigheden-lijst (klein en examengericht)

Eén korte, gedeelde enum i.p.v. vrije tekst, zodat filteren/rapporteren betrouwbaar is:

`onthouden · beschrijven · verklaren · toepassen · berekenen · analyseren · beoordelen`

(bewust compact; sluit aan op RTTI/Bloom zonder academische ballast.)

---

## 3. Koppeling van bestaande vragen

### 3.1 Eén nieuw veld: `lo`

Elke meerkeuzevraag (`sv`) en oud-examenvraag (`oe`) krijgt optioneel één veld:

```js
// vóór:   {v:"…", o:[…], c:0, u:"…", d:2}
// na:     {v:"…", o:[…], c:0, u:"…", d:2, lo:"bi.M.1"}
```

- **`lo` = leerdoel-id.** Eén vraag → één primair leerdoel (bewust simpel; geen many-to-many in F1).
- **Optioneel en achterwaarts compatibel.** Vragen zonder `lo` blijven werken; ze tellen als "nog niet gekoppeld". Geen enkele bestaande functie (`aqpSelectQuestions`, `qDiff`, quizrender) hoeft te veranderen — die negeren onbekende velden.
- **Bron blijft `data-havo.js` / `data-vwo.js`.** Het veld wordt daar toegevoegd; `scripts/split-data.js` neemt het automatisch mee naar de geshipte `q/<lvl>-<vak>.js` (het serialiseert het hele vraag-object). `smoke.mjs` blijft de meta/split-sync bewaken.

### 3.2 Hoe de koppeling tot stand komt (semi-automatisch)

Nieuw hulpscript `scripts/tag-leerdoelen.js` (offline, draait naast `build-questions.js`), in drie tot-stand-komingslagen van grof naar fijn:

1. **Domein-fallback** — elke vraag in domein `bi_M` krijgt voorlopig het "hoofdleerdoel" van dat domein. Direct 100% dekking, grof.
2. **Concept-match** — als de vraagtekst/afleiders een `concept` uit een leerdoel bevatten, wint dat specifiekere leerdoel. Veruit de meeste vragen komen zo op het juiste leerdoel (de vragen zijn immers uit begrippen gegenereerd, §`build-questions.js`).
3. **Handmatige overrides** — een klein `overrides`-mapje (`vraagsleutel → lo`) voor de restgevallen, net zoals de bestaande curated overrides in de vragen-engine.

Het script is **idempotent** en **rapporteert** (net als `build-questions.js --check`): per vak hoeveel vragen gekoppeld zijn, en welke leerdoelen 0 vragen hebben.

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

## 9. Open beslissingen (graag jouw sturing)

1. **Bron voor de leerdoelen zelf.** Ik stel voor de eindtermen te ontlenen aan het officiële CvTE-examenprogramma/de syllabus per vak (de brief noemt examenblad.nl / CvTE). Akkoord dat ik die als leidend neem, of wil je een eigen indeling?
2. **Granulariteit.** Richtwaarde: **4–8 leerdoelen per domein**. Fijner = preciezer maar meer redactiewerk. Akkoord met deze bandbreedte?
3. **Eén of meerdere leerdoelen per vraag.** Ik stel in F1 **één primair leerdoel** per vraag voor (simpel, genoeg voor dekking + diagnose). Many-to-many kan later. Akkoord?
4. **Pilot-vak.** Voorstel HAVO Biologie (§6). Akkoord, of liever een ander vak?

Zodra deze vier punten akkoord zijn, begin ik met **M1** (alleen de pilot, geen vraag aangeraakt) en lever ik het dekkingsrapport op voordat er iets naar `lo` wordt geschreven.
