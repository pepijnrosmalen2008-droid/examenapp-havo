# Contentfabriek v2 — meerdere vakken per prompt

De gouden-standaard blijft ongewijzigd (`scripts/validate-goldstandard.mjs`).
Wat verandert is **hoe** een leerdoel ontstaat: niet meer 25 vragen met de hand,
maar een compacte spec die een generator uitvouwt tot een volledig, gevalideerd
leerdoel.

## Waarom dit sneller is

Een gouden leerdoel = 25 vragen × (stam + 4 opties + juist + d + `u` + 4× `uo` +
`uh`) ≈ 200 regels handwerk. Daardoor paste er ~1 leerdoel per prompt.

Met v2 schrijf je per leerdoel alleen:

- **`concepten[]`** — ~10-14 kaartjes `{ t, d, k?, fout? }` (term, definitie, korte
  kern, verwarbare termen). Dit is óók de begrippenbank (flashcards) en de bron
  van de afleiders.
- **`sam`** — de rijke samenvatting (HTML). Dit is de echte academische inhoud.
- **`toepas[]?`** — optioneel: een paar met de hand geschreven toepassings-/
  redeneervragen voor extra examendiepte (volledig `{v,o,c,d,u,uo,uh}`).

≈ 15 regels i.p.v. 200. Meerdere leerdoelen/vakken passen zo in één prompt.

## Wat de generator afleidt

`scripts/expand-leerdoelen.mjs` maakt uit de concepten een gouden-valide bank:

- **Herkennings- en contrastvragen** met per-optie-uitleg (`uo`): het juiste
  antwoord krijgt "Klopt: …", elke afleider "Dat is «X»: …" op basis van de
  definitie van díe afleider. Afleiders komen eerst uit `fout` (dichtbij →
  moeilijker, R3), daarna uit de rest van het leerdoel (R2), plus term→definitie
  (R1).
- **Automatische balans**: antwoordpositie ≤40%, lengte-bias ≤40%, R1-R3-dekking,
  ≥25 vragen, geen overclaim in de canonieke velden. Dit spiegelt exact de
  gouden-standaard-poort.
- **Begrippen** = de concepten (t/d).

De koppeling leerdoel↔vraag is **geen handwerk**: registreer het leerdoel-id in
`DOMEIN_LO` (in `scripts/tag-leerdoelen.js`) → alle vragen krijgen automatisch
`matched` ("hele module → één leerdoel", schaalt zonder per-vraag-override).

## Kwaliteit (academisch niveau)

- De diepte zit in (a) de **juistheid en examenrelevantie van de concepten** en
  (b) de **samenvatting**. Investeer je tokens dáár; de generator vermenigvuldigt
  ze naar 25 vragen + flashcards.
- Voeg voor echte examen-redeneervragen een paar `toepas`-vragen toe. Die worden
  ongewijzigd bij de gegenereerde bank gemengd.

## Werkwijze

1. Schrijf een spec-bestand, bijv. `content/havo-na.spec.mjs`:
   ```js
   export default [
     { niveau:'havo', vak:'na', domein:'C', leerdoel:'C1', naam:'Snelheid en versnelling',
       sam:`<p>…</p>`, concepten:[ {t:'Snelheid', d:'…', k:'…', fout:['Versnelling']}, … ],
       toepas:[ /* optioneel */ ] },
     { …volgende leerdoel/vak… },
   ];
   ```
2. Controleer (schrijft niets):
   `node scripts/expand-leerdoelen.mjs content/havo-na.spec.mjs`
3. Wegschrijven in de bron:
   `node scripts/expand-leerdoelen.mjs content/havo-na.spec.mjs --write`
4. Registreer (éénmalig per leerdoel): leerdoel-id in `DOMEIN_LO`
   (`tag-leerdoelen.js`) en in de `GOLDEN`-lijst (`validate-goldstandard.mjs`).
5. Bouw + valideer + ship:
   ```
   node scripts/tag-leerdoelen.js havo na
   node scripts/validate-goldstandard.mjs havo na C1
   node scripts/split-data.js && node scripts/smoke.mjs
   ```
   Daarna de SW-cache in `sw.js` bumpen en committen.

## Zelftest

`node scripts/expand-leerdoelen.mjs --selftest` vouwt `na/C1` uit een compacte
spec en toont dat alle harde poorten worden gehaald.
