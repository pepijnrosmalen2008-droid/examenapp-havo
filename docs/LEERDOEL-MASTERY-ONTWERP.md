# Leerdoel-mastery — de gedeelde datalaag (ontwerp)

> Uitwerking van de **linchpin** uit [`SLAGIO-PRODUCT-VISION.md`](SLAGIO-PRODUCT-VISION.md):
> beheersing gemeten **per leerdoel**, als één spine die tegelijk de student-
> "vandaag", de docentenradar én de AI-context voedt. Bouw je dit eerst, dan
> vallen de drie lagen er bijna vanzelf uit; sla je het over, dan worden het
> alsnog drie losse features.

## 1. Waarom leerdoel de juiste eenheid is
Een domein (bv. "Enzymen") is te grof om iets mee te doen: "62%" zegt de docent
en de leerling niets. Een leerdoel ("pH-effect op enzymactiviteit") is klein
genoeg om er een **actie** aan te hangen: uitleg tonen, 8 vragen laten maken,
toewijzen aan 14 leerlingen. Alle vier de sleutelmomenten — student-"dit eerst",
docenten-radar, AI-"welk leerdoel + welke fout", en "de volgende beste leeractie"
— zijn views op datzelfde ene datapunt: *beheersing van dit leerdoel door deze
leerling.*

## 2. Wat er al staat (grondslag, sept 2026)
Verrassend veel — de spine hoefde niet from scratch:

- **Leerdoel is al een eersteklas eenheid.** In de datastructuur heeft elk
  domein een `leerdoelen[]`; elk leerdoel heeft een eigen `id`, `naam`,
  `beschrijving`, `sv`/`oe`/`begrippen`/`sam`. `openDomein(ld.id)` opent de
  vragen van dat leerdoel (`vak.js`), `openLeerdoelen()` toont het keuzescherm.
- **Beheersing wordt al per leerdoel bewaard.** `saveProgress(vakId, ld.id, mode,
  score, total)` schrijft `progress[`vakId_ldId_mode`] = {best,total,attempts}`
  (cloud-gesynct via `cloudSet`). `getDomeinBestPct(vakId, ld.id)` leest de beste
  score per leerdoel.
- **Recency** per leerdoel via `getDecay()` / `getDecayStatus()` (tijdstip laatste
  oefening), en **adaptief per vraag** via de aqp-data (`aqpGet`/`aqpDomainData`)
  + `logQuestion()`.

**Wat ontbrak:** een echt *mastery-model* (score → betekenis → signaal) en de
**rollups** leerdoel → domein → vak. Dat is nu toegevoegd.

## 3. Het mastery-model (`lb.js`)
Pure functies bovenop bestaande, cloud-gesyncte data — geen nieuwe opslag.

```
ldMastery(vakId, ld) → {
  hasData, raw (0-1 beste score), score (0-1 na recency-correctie),
  band ('green'|'yellow'|'orange'|'red'|'none'), color, label,
  attempts, decayDays, vakId, ldId, naam
}
```

- **raw** = `getDomeinBestPct(vakId, ld.id).pct` (beste score ooit).
- **recency-correctie** (`_recencyFactor`): <7d ×1 · <21d ×0,92 · <42d ×0,84 ·
  daarna ×0,76. Bewust mild: één oude topscore zakt niet meteen naar 'kritisch',
  maar wegzakkende kennis wordt wél zichtbaar (label "Zakt weg — herhalen").
- **banden** (`_MB_BANDS`, spiegelt de visietabel): 🟢 ≥80% · 🟡 ≥65% · 🟠 ≥45%
  · 🔴 <45% · ⚪ geen data ("Nog niet geoefend").

**Rollups:**
- `domeinMastery(vakId, domein)` → gemiddelde beheersing over de leerdoelen +
  `counts` per band + `weakest` leerdoel + `attention` (oranje+rood) / `critical`
  (rood). Domeinen zonder leerdoelen vallen terug op het domein zelf.
- `vakMasteryRollup(vakId)` → over alle domeinen: `score`, `attention`,
  `critical`, `doms[]`.
- `weakestLeerdoelen({vakIds, limit, maxScore, includeUnpracticed})` → de zwakste
  leerdoelen (zwakste eerst; tie-break: langer niet geoefend), mét routing-info
  (`vakId`, `domId`, `ldId`, `naam`). Voedt "Dit heb je nu nodig" en straks de
  docenten-toewijzing.
- `nextBestLeerdoel(vakIds)` → het ene leerdoel om nú op te pakken.

## 4. Hoe één spine drie lagen voedt

### 4a. Student — "Vandaag / Dit eerst"
`nextBestLeerdoel(favorieten || alle vakken)` → kaart op home:
> 🎯 **Dit eerst — Biologie · pH-effect** — je beheerst 44%.
> [ Start 8 vragen ] → `openVak(vakId)` dan `openDomein(ldId)`.
De dagmissie-heuristiek (`_dmWeakDomains` in `features.js`) wordt hiermee
vervangen door de echte leerdoel-rollup.

### 4b. Docent — Slagio School radar
De docentcockpit is exact dezelfde rollup, geaggregeerd over de klas:
- per leerdoel: gemiddelde `score` → dezelfde 🟢🟡🟠🔴 band ("74% van de klas
  beheerst…", "4 leerdoelen kritisch").
- **misconcept-radar** ("63% verwart tijdelijke remming met denaturatie") vergt
  één extra signaal: per fout weten wélke afleider/foutcategorie (zie §5).
- **toewijzen** = `weakestLeerdoelen` op klasniveau → "[14 leerlingen] pH en
  enzymactiviteit → Oefening toewijzen".

Server-side (Supabase): een `mastery_snapshot`-event per leerdoel bij
quizafronding (`{vakId, ldId, niveau, score, band, attempts}`), aggregeren per
`klascode`. Het client-model en het klas-model gebruiken **dezelfde banden en
formule**, zodat leerling en docent hetzelfde beeld zien.

### 4c. AI — context bij een fout / een onderwerp
De AI-laag krijgt geen losse prompt maar een **context-payload** uit de spine:
```
{ vak, domein, leerdoel, niveau,
  vraag, gekozenAntwoord, juisteAntwoord, foutcategorie,
  ldMastery: {score, band, attempts, decayDays},
  eerdereFouten: [...] }
```
Daarmee legt AI uit *waarom jouw antwoord niet klopt* op het juiste niveau, en
"[ Test me ]" trekt vervolgvragen uit precies dat leerdoel (`ld.sv`). AI zit zo
bovenop Slagio's kennisstructuur i.p.v. ernaast.

## 5. Wat er nog bij moet (telemetrie-gaten)
1. **Foutcategorie / afleider-tagging per vraag** — voor de misconcept-radar en de
   AI-"waarom fout". Het Foutenboek (`foutenboek-meta-havo.js`) heeft al
   misconcept-teksten; nodig is een gestructureerd `foutcat`-veld per afleider,
   plus per-afleider fout-tellingen (uitbreiding van `logQuestion`).
2. **Server-side klas-aggregatie** — `mastery_snapshot`-events + een view/rollup
   per klascode (bestaat nog niet; `klas.js` + Supabase `events` zijn de basis).
3. **Leerdoel-dekking uitbreiden** — niet elk domein heeft al leerdoelen; de
   rollup valt daar netjes terug op het domein, maar de volle waarde komt pas als
   alle vakken leerdoelen hebben (curriculum-engine, zie `docs/`).

## 6. Sliced roadmap
- **Slice 1 — spine + eerste zichtbare payoff (KLAAR).** `ldMastery` /
  `domeinMastery` / `vakMasteryRollup` / `weakestLeerdoelen` in `lb.js`;
  signaal-stip (🟢🟡🟠🔴) per leerdoel op het leerdoel-scherm (`vak.js`).
- **Slice 2 — Student "Vandaag"-kaart (KLAAR).** `renderFocusLeerdoel()` in
  `lb.js` → "Dit heb je nu nodig"-kaart op home (`#hm-focus-ld`), gescoped op de
  favoriete/examenvakken, met `focusStartLeerdoel()` die naar het zwakste leerdoel
  routet. Rendert via de `show()`-wrapper bij elke home-navigatie. (Dagmissie op
  leerdoel-niveau kan later meeliften op dezelfde spine.)
- **Slice 3 — afleider-telemetrie + misconcept-aggregatie (KLAAR).** Geen
  hand-tagging nodig: de uitleg per afleider staat al in de content (`q.uo[idx]`).
  `logAfleider()` (`cloud.js`) telt bij elke fout wélke afleider gekozen is per
  vraag per leerdoel (localStorage `slagio_afleiders`, begrensd). `afleiderStats()`
  / `ldTopMisconception()` / `questionMisconception()` (`lb.js`) aggregeren dit en
  leveren het AI-/uitleg-primitief. Zichtbare payoff: "Vaak fout: …"-regel op de
  leerdoelkaart (de misconcept-radar in het klein, per leerling). Server-side
  klas-aggregatie volgt in slice 4.
- **Slice 4 — Slagio School: leerdoel-radar (KLAAR, zonder nieuwe DB-infra).**
  Leerlingen sturen na een quiz een `mastery_snapshot`-event (`emitMasterySnapshot`
  in `lb.js`) met per-leerdoel beheersing + top-misconceptie, getagd met `klas_id`.
  `docent.html` leest die events direct (zoals `admin.html`) en aggregeert per
  leerdoel via `_schoolAggregate` → een "Leerdoel-radar" (beheersing, signaal,
  "X onder 55%", "Vaak fout: …"). Demo-modus toont voorbeelddata (testbaar zónder
  Supabase). Nog te doen (vergt Supabase-RPC): per-leerdoel toewijzen en een
  server-side rollup i.p.v. events client-side aggregeren bij grote klassen.
- **Slice 5 — Slagio AI.** Context-payload → uitleg-bij-fout (3/dag gratis,
  Slagio+ limiet), "leg dit onderwerp uit" → Test me, hint-eerst-pedagogiek.

Elke slice is los te releasen en versterkt dezelfde kern. De volgorde is bewust:
niets bovenop bouwen vóór de spine (slice 1) en de foutsignalen (slice 3) er zijn.
