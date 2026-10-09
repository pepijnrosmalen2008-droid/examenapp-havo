# Gouden standaard v2: één leerdoel = één volle module

> **Kort:** de content-eenheid is het **leerdoel**, niet het domein. Elk leerdoel krijgt
> wat vroeger een heel domein kreeg: een samenvatting met beeld per hoofdstuk, 25+ eigen
> vragen met uitleg per fout antwoord, 10+ begrippen en 5 examenvragen met modelantwoord.
> Referentiemodule: **havo bi.M3 Enzymwerking** (`content-pending/havo-bi-M3.json` + `.html`).
> Afgedwongen door `scripts/check-leerdoel.mjs`, `scripts/render-leerdoel.mjs` en
> `scripts/validate-goldstandard.mjs` (in smoke/CI voor elke module met `gs: 2`).

## Waarom v2

Gemeten op 6 okt 2026:

| | havo bi (per leerdoel) | routine-output nl A/B/C (per domein) |
|---|---|---|
| eenheid | 25 leerdoel-modules | 3 domeinen, 0 leerdoel-modules |
| vragen met uitleg per optie | 25 van 25 per leerdoel | 34 van 154 (domein B) |
| beelden in samenvatting | 2-4 figuren per leerdoel, 1 clip | 0 (alleen "CLIP-KANS"-notities) |
| sjabloonvragen ("Wat houdt «X» in?") | 0 | veel |

En ook bi v1 had zwakke plekken: uitleg als "De plant ademt overdag gewoon door." (zegt
niet wélke denkfout je maakte), grafieken zonder gelijke schaal, een bijschrift dat de
verkeerde kleur noemde, en een pH-figuur die een feitelijke fout bevatte (trypsine bij
pH 7 op nul). v2 maakt die dingen controleerbaar.

## 0. Strengere lat sinds 9 okt 2026: moeilijker en rijkere figuren

De eerste 24 routine-leerdoelen (havo Nederlands A-D) waren correct en de uitleg per fout
antwoord was goed, maar ze waren **makkelijker dan het examen** (contexten van één of twee
zinnen, gemiddeld 6 R3-vragen) en de **figuren waren opgemaakte lijstjes** (gemiddeld 1-2
tekenelementen per figuur, bi.M3 heeft er 4-18). Voor nieuwe leerdoelen gelden daarom deze
extra eisen, hard in `check-leerdoel.mjs` (live modules krijgen alleen een waarschuwing):

| | eis | waarom |
|---|---|---|
| R3 (examenniveau) | **min. 8 vragen**, waarvan 80% met een casus/tekst van ≥120 tekens | het examen begint bij een situatie |
| R2 / R1 | R2 min. 8, R1 max. 7 | minder herkennen, meer toepassen |
| contextvragen | min. 8, gemiddeld ≥150 tekens | een casus is meer dan één zin |
| kale definitievragen | max. 3 | |
| taalvak met CE | min. **2 leesteksten van 500-1400 tekens**, elk met min. 3 vragen (zelfde tekst in `ctx`) | het CE werkt met hele teksten |
| examenvragen (`oe`) | min. 4 met een casus/bron ≥150 tekens; open vragen met puntenverdeling ("(1p)") | zoals een echt correctievoorschrift |
| figuren | **min. 4** figuren/clips | |
| lijstfiguur | max. 1 figuur met < 3 lijnen/paden/vormen (alleen vakjes met tekst) | een lijst kan ook als tekst |
| rijke figuur | **min. 2** met ≥6 lijnen/paden/vormen en ≥5 labels (een clip telt mee) | een figuur moet iets laten zien |

**bi.M3 blijft de referentie voor uitleg per fout antwoord en voor figuren**, maar haalt de nieuwe
moeilijkheidseis zelf net niet (7 R3-vragen, 6 met context). Ga voor moeilijkheid uit van deze tabel.

### Wat is een R3-vraag op examenniveau?
- Er is een **situatie**: een proef met meetresultaten, een casus, een bron, een tekstfragment.
- De leerling moet **twee stappen** zetten: eerst iets uit de bron halen, dan een begrip toepassen
  of een conclusie trekken ("Welke conclusie is juist?", "Wat verklaart de daling na minuut 6?",
  "Welke functie heeft alinea 4 ten opzichte van alinea 3?").
- De afleiders zijn **plausibel voor wie half begrijpt**: een conclusie die te ver gaat, een
  verklaring die klopt maar niet bij deze meting hoort, het verband omgedraaid.
- Niet: een definitie herkennen met een zin ervoor geplakt.

Slecht (R3 in nl.D3): ctx "Het regende hard. Daarom bleef de wedstrijd uit.": vraag "Welke zin is de
oorzaak?" Dat is R1 met een fragment.
Goed: een alinea van 6-8 zinnen met twee verbanden door elkaar, en de vraag "Welk verband bestaat er
tussen zin 3 en zin 5?" met als afleiders het verband tussen twee andere zinnen en het omgekeerde verband.

## 1. De module (bestand `content-pending/<niveau>-<vak>-<id>.json`)

```js
{
  "id": "A3",                    // domeinletter + nummer, uniek binnen het vak
  "lo": "nl.A.3",                // leerdoel-id uit knowledge/<niveau>/<vak>.json of de syllabus
  "gs": 2,                       // markeert v2: vanaf nu bewaakt door smoke/CI
  "naam": "Relaties tussen tekstdelen benoemen",
  "beschrijving": "1-2 zinnen: wat kan de leerling na dit leerdoel?",
  "ceStatus": "CE" | "SE" | "CE+SE",
  "onderwerpen": ["...", "..."], // 4-7 deelonderwerpen; vragen verwijzen hiernaar met s
  "sam": "korte platte samenvatting (>150 tekens), fallback als SAM_RICH niet laadt",
  "begrippen": [{ "t": "term", "d": "definitie" }],   // min. 10
  "sv": [ /* min. 25 vragen, zie §2 */ ],
  "oe": [ /* min. 5 examenvragen, zie §4 */ ]
}
```

## 2. Vragen (`sv`): adaptief én leerzaam

Vorm per vraag: `{ v, o[4], c, d, s, u, uo[4], uh, ctx? }`.

| veld | eis |
|---|---|
| `v` | ≤ 110 tekens, één echte vraag. Nooit `«»`-sjablonen. Max. 5 kale definitievragen ("Wat is ...?") per module. |
| `o` | 4 opties, uniek, ongeveer even lang. Juist antwoord in max. 40% de langste en max. 40% op één positie. |
| `d` | R-niveau: 1 herkennen/begrijpen · 2 toepassen/onderscheiden · 3 casus/transfer/examenredeneren. **Min. 4 per niveau.** |
| `s` | index in `onderwerpen`. **Elk onderwerp min. 2 vragen.** Hierop draait de adaptieve vervolgvraag. |
| `ctx` | casus, meetreeks, tabel in tekst, bronfragment of tekstfragment (40-600 tekens, bij taalvakken tot 1400 voor een leestekst). **Min. 8 per module, gemiddeld ≥150 tekens** (zie §0). |
| `uo` | uitleg per optie, zie hieronder. |
| `u` | de kernregel in één zin. |
| `uh` | ezelsbruggetje: hoe herken je deze valkuil de volgende keer. |

### Zo werkt het adaptief oefenen (vak.js / quiz.js)
- De quiz is een trap: goed → moeilijker (`d`), fout → makkelijker.
- **Na een fout komt meteen een andere vraag over hetzelfde onderwerp (`s`)**, een niveau lager
  ("Nog een over dit onderwerp"). Daarom: elk onderwerp min. 2 vragen, op verschillende niveaus.
- Onderwerpen waar een leerling vaker fout gaat, komen bij de start vaker terug.

### Uitleg per optie (`uo`): de kern van "er wijzer van worden"
Elke **foute** optie krijgt 70-360 tekens met drie dingen:
1. **de denkfout** die bij deze keuze hoort ("Koos je X? Dan denk je dat ...");
2. **waarom dat hier niet klopt**, met het feit uit de vraag;
3. **het juiste onderscheid** in één zin.

De **juiste** optie krijgt min. 45 tekens: begint met "Klopt:" en zegt waarom.
Drie foute opties = drie verschillende denkfouten (de poort weigert bijna-gelijke uitleg).

**Ondergrens en streefwaarde (okt 2026, na de eerste routine-output; `check-leerdoel.mjs`):**

| | ondergrens (hard) | streefwaarde (waarschuwing) | bi.M3 |
|---|---|---|---|
| gemiddelde lengte foute-antwoord-uitleg | 105 tekens | 120 tekens | 158 |
| uitleg korter dan 100 tekens | max. 40% | max. 20% | 0% |
| begint met een kaal "Koos je dit?" | max. 60% | max. 30% | 11% |
| opvulafleiders (los woord uit het fragment naast een volzin) | 0 | 0 | 0 |

**Schrijf het in één keer goed.** Noem in elke foute-antwoord-uitleg wat de leerling koos en welke
denkfout daarachter zit, en vervang afleiders die niemand zou kiezen door een echte fout van leerlingen.
Haal je de streefwaarde net niet maar wel de ondergrens, dan is het goed genoeg: ga door.
**Herschrijf geen leerdoelen die al live staan**, tenzij er iets inhoudelijk fout in zit.

Slecht (routine, eerste versie nl.A6):
> "Koos je dit? Kort kan prima kloppen. Het gaat om de afzender, niet om de lengte."

Goed:
> "Koos je 'het bericht is te kort'? Dan beoordeel je de vorm in plaats van de bron. Ook een kort
> bericht kan kloppen. De vraag bij een feitelijk argument is: kun je nagaan wie het zegt en waar
> het op gebaseerd is? Bij een anonieme forumpost kan dat niet."

Slecht (v1):
> "De plant ademt overdag gewoon door."

Goed (v2, bi.M3):
> "Koos je 'substraat op'? In elke buis zit evenveel vers substraat; alleen de temperatuur
> verschilt. De daling hoort dus bij de temperatuur: het enzym denatureert."

Afleiders zijn echte fouten van leerlingen: een misconceptie, iets wat waar is maar niet hier
(contextueel), of een redeneerfout (bv. een factor kiezen die in de proef constant is).

## 3. Samenvatting (`content-pending/<niveau>-<vak>-<id>.html` → `SAM_RICH`)

Vaste opbouw (classes uit styles.css):
- `sam-intro` (wat leer je hier, 2-3 zinnen)
- begrippenlijst: `sam-head` + `sam-table`
- **min. 3 hoofdstukken** `sam-chapter` (`sam-ch-title` + `sam-ch-n`), elk met **een figuur
  (`sam-figure` + `sam-figcap`) of een clip (`sam-clip clip-<naam>`)**
- min. één `sam-tip` (examentip); waar nuttig `sam-onthoud`
- 2.500-14.000 tekens leestekst; min. 80% van de begrippen komt erin voor.

### Beelden die echt over de stof gaan (min. 4, waarvan min. 2 rijk)
Teken het **verband**, niet de lijst. Een rijtje vakjes met tekst ("oorzaak: omdat, doordat") is
geen figuur maar een tabel: zet dat in een `sam-table` of in de tekst. Per vak een paar
voorbeelden van rijke figuren:

| vak | rijke figuur |
|---|---|
| biologie, scheikunde, natuurkunde | grafiek met assen, ticks op gelijke schaal, astitels en het kernpunt gemarkeerd; doorsnede met aanwijslijnen; proces/cyclus met pijlen en tussenstappen; opstelling van een proef |
| wiskunde | grafiek met assenstelsel, roosterlijnen en de gevraagde waarde afgelezen met stippellijnen; meetkundige figuur met hoeken/lengtes |
| economie, aardrijkskunde | vraag-aanbodgrafiek met evenwicht en verschuiving; kaartschets met legenda; stroomschema met geldstromen |
| geschiedenis | tijdlijn met schaal, periodes en gebeurtenissen; oorzaak-gevolgketen met pijlen |
| Nederlands en talen | **geannoteerd tekstfragment**: de alinea zelf, met haken, onderstrepingen en pijlen naar labels (standpunt, argument, signaalwoord); argumentatieboom met verbindingslijnen; tekststructuur als blokken met pijlen voor de verbanden |

Het script telt per figuur de tekenelementen (`path`, `line`, `circle`, `ellipse`, `polygon`,
`polyline`) en labels (`text`). Een figuur met < 3 tekenelementen is een lijstfiguur (max. 1).
Een rijke figuur heeft ≥ 6 tekenelementen en ≥ 5 labels. Een viewBox van 320 × 180-320 is
normaal; gebruik de hoogte als de figuur dat nodig heeft.

Goede soorten (als aanvulling):
Een beeld moet iets laten zien wat tekst slechter kan. Goede soorten:
- **grafiek** met assen, ticks op een **gelijke schaal**, astitels en de kern gemarkeerd
  (optimum, snijpunt, verzadiging);
- **proces in stappen** (1-2-3 met pijlen) of een **cyclus**;
- **vergelijking naast elkaar** (A vs B, met het verschil benadrukt);
- **opbouw/doorsnede** met labels (organel, schakeling, zinsbouw);
- voor taalvakken: **tekstschema** (inleiding-kern-slot met signaalwoorden),
  **argumentatieschema** (standpunt ← argumenten ← subargumenten), **tijdlijn**.

Regels:
- inline `<svg viewBox="0 0 320 H" role="img" aria-label="...">`, aria-label min. 30 tekens en
  noemt een begrip of onderwerp van dit leerdoel;
- labels `font-size` ≥ 11 bij een viewBox van 320 breed (op de telefoon ≥ 9 px);
- geen tekst buiten de viewBox, geen labels over elkaar;
- `var(--or)` is per niveau een andere kleur (havo blauw, vwo paars): **noem nooit een kleur**
  in tekst of bijschrift, noem de vorm ("de stippellijn", "de linker curve");
- twee of meer reeksen: vaste kleuren (bv. `#e8590c`, `#2f9e44`) met een label naast elke lijn;
- bijschrift (min. 40 tekens) zegt **wat je moet zien**, niet alleen de titel;
- gebruik `var(--dk)`, `var(--mu)`, `var(--orl)` voor tekst en vlakken, zodat donker thema werkt.

### Clips (animaties)
- **Hergebruik** een bestaande clip als het concept klopt (activering, denaturatie, breakeven,
  markt, normaal, raaklijn, golf, expo, vt). Pas bijschriften en labels aan op het leerdoel
  (bi.M3 hergebruikt `activering` uit scheikunde, met "enzym" in plaats van "katalysator").
- **Nieuwe clip** mag, maar alleen via de spec-engine (`SPECS` in sam-clip.js, zie CLAUDE.md
  "Mini-clips") en alleen als je de frames van `render-leerdoel.mjs` (begin/midden/eind) hebt
  bekeken en ze kloppen. Twijfel je: maak een statische stappenfiguur. Een goede figuur is beter
  dan een verwarrende clip.
- #stappen = #bolletjes = #bijschriften (`render-leerdoel.mjs` controleert dit).

## 4. Examenvragen (`oe`)
Min. 5 open of meerkeuzevragen in examenstijl, met `u` als **modelantwoord zoals in een
correctievoorschrift** (min. 60 tekens, met de punten die je moet noemen). Gebruik een casus
in `ctx`. **Verzin nooit een echte CE**: `bron` is "Examenstijl", nooit "CE 2023" tenzij het
echt uit een examen komt (zie DoD §8).

## 5. Vaardigheidsvakken (Nederlands, talen, vaardigheden-domeinen)
- Vragen werken op **fragmenten** in `ctx`: "Wat is de functie van alinea 3?", "Welk verband
  geeft 'daardoor' aan?", "Welk argument ondersteunt het standpunt?". Geen begripsdrill als de
  vaardigheid zelf getoetst wordt.
- **CE-domeinen (leesvaardigheid, samenvatten): min. 2 eigen leesteksten van 500-1400 tekens**
  (4-7 genummerde alinea's, zoals in het examen), elk met min. 3 vragen. Zet dezelfde tekst in
  `ctx` van elke vraag die erbij hoort; de poort vergelijkt die vragen dan alleen op de vraag zelf.
  Schrijf de teksten zelf (betoog, beschouwing, uiteenzetting over een herkenbaar onderwerp);
  neem nooit een echte examentekst over.
- SE-onderdelen (mondeling, schrijven) toetsen wat toetsbaar is: kiezen tussen formuleringen,
  opbouw herkennen, fouten vinden, beoordelen met criteria.
- Moderne vreemde talen: fragmenten en opties in de doeltaal, uitleg in het Nederlands.

## 6. Werkwijze per leerdoel (de routine doet er minimaal 5 per run, liefst een heel domein)

```bash
# 1. schrijf content-pending/<niveau>-<vak>-<id>.json en .html (bronnen: syllabi/2027/,
#    knowledge/<niveau>/<vak>.json, bestaande domeinvragen als grondstof, bi.M3 als voorbeeld)
node scripts/check-leerdoel.mjs content-pending/<x>.json content-pending/<x>.html
node scripts/render-leerdoel.mjs --html content-pending/<x>.html --uit /tmp/r-<x>
#    → BEKIJK alle png's met de Read-tool; klopt elke figuur inhoudelijk? leesbaar?
node scripts/integreer-leerdoel.mjs <niveau> <vak> <domein> content-pending/<x>.json content-pending/<x>.html
node scripts/split-data.js
node scripts/build-leren.mjs && node scripts/build-sitemap.mjs   # openbare leerpagina (/leren/...) + sitemap
node scripts/build-questions.js --check && node scripts/validate-content.mjs && node scripts/smoke.mjs
```

`integreer-leerdoel.mjs` schrijft data-<niveau>.js in exact hetzelfde formaat terug en voegt
of vervangt `SAM_RICH['<niveau>_<vak>_<id>']`. Het domein toont daarna vanzelf het
leerdoelenscherm (vak.js `openLeerdoelen`).

## 7. Wat het script niet kan zien
Juistheid. Elke bewering, elk juist antwoord en elke afleider moet kloppen met de syllabus en
de gangbare methodes. Twijfel = weglaten of herschrijven. Precieze formuleringen (DoD §6.6):
geen "altijd", "alleen", "precies één" als het niet waar is.
