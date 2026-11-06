# Figuren in samenvattingen

Een figuur moet eruitzien alsof iemand hem voor dit ene stuk stof heeft gemaakt, zoals in
een goed leerboek. Leerlingen haken af op plaatjes die er "gegenereerd" uitzien, ook als ze
kloppen. Daarom maak je figuren niet meer met de hand als losse rondjes en lijntjes, maar met
`scripts/figuur.mjs`: je schrijft een korte spec, het script tekent hem netjes op schaal.

## Wat niet meer mag (de keuring houdt dit tegen)

- Begrippen in een rondje ("statisch" in een bol, "dynamisch" in een bol).
- Genummerde rijtjes: cijfers in rondjes met een woord ernaast. Dat is een lijst.
- Stippen met lijntjes ertussen: een boompje of tijdlijn zonder schaal.
- Rijen korte streepjes onder woorden.

`node scripts/figuur.mjs --keur <bestand.html>` zegt per figuur wat er mis is.
`node scripts/figuur.mjs --overzicht` toont welke leerdoelen nog sjabloonfiguren hebben.

## De vijf soorten

Alle figuren gebruiken de niveaukleur (`var(--or)`) in twee tinten en werken in licht en donker.

| soort | wanneer | voorbeeld |
|---|---|---|
| `fragment` | taalvakken, bronnen, citaten: de echte tekst met markeerstift en genummerde aantekeningen | karakterisering aanwijzen in een alinea |
| `grafiek` | alles wat verandert of samenhangt: assen met schaal, lijnen met label aan de lijn, punten met stippellijn naar de as | vraag en aanbod, enzymactiviteit, ontwikkeling van een personage |
| `tijdlijn` | jaartallen en periodes op schaal | literatuurperiodes, Koude Oorlog |
| `boom` | opbouw met echte zinnen: standpunt en argumenten, thema en bewijs | betoog, argumentatiestructuur |
| `kring` | processen die rondgaan, 3 tot 6 stappen | koolstofkringloop, conjunctuur, schrijfproces |

Heb je iets anders nodig (een doorsnede, een schakeling, een kaart), teken het dan met de hand,
maar wel als echte tekening: vormen die op het ding lijken, aanwijslijnen naar labels.

### fragment
```json
{"soort":"fragment","bron":"Fragment (eigen voorbeeld)",
 "alineas":["[[Anna was the best student.::direct: de eigenschap staat er letterlijk]] She [[folded the paper twice::indirect via een handeling]]."],
 "cap":"Bij directe karakterisering staat de eigenschap er letterlijk; bij indirecte trek jij de conclusie."}
```
`[[stuk tekst::aantekening]]` markeert en nummert. Minimaal 2 markeringen; met 3 of meer telt het als rijke figuur.

### grafiek
```json
{"soort":"grafiek","aria":"…≥30 tekens…","cap":"…",
 "x":{"label":"prijs (euro)","min":0,"max":10,"stap":2},
 "y":{"label":"hoeveelheid","min":0,"max":100,"stap":20},
 "lijnen":[{"punten":[[0,90],[10,10]],"label":"vraag"},{"punten":[[0,10],[10,90]],"label":"aanbod"}],
 "punten":[{"x":5,"y":50,"label":"evenwicht"}],
 "zones":[{"van":6,"tot":10,"label":"overschot"}]}
```
Woorden in plaats van getallen op een as: `"labels":[[0,"begin"],[10,"eind"]]`. `"glad":true` maakt een vloeiende lijn,
`"labelOnder":true` zet het label onder het eind van de lijn, `"links":true` het label van een punt links.

### tijdlijn
```json
{"soort":"tijdlijn","aria":"…","cap":"…","van":1880,"tot":1960,"stap":20,
 "periodes":[{"van":1880,"tot":1900,"label":"Tachtigers"}],
 "gebeurtenissen":[{"jaar":1885,"label":"De Nieuwe Gids","sub":"tijdschrift"}]}
```

### boom
```json
{"soort":"boom","aria":"…","cap":"…","kop":"standpunt","top":"Scholen moeten om 9 uur beginnen.",
 "takken":[{"kop":"argument 1","tekst":"Tieners slapen later in.","sub":["onderzoek naar het bioritme"]}]}
```

### kring
```json
{"soort":"kring","aria":"…","cap":"…","midden":"koolstofkringloop",
 "stappen":[{"kop":"fotosynthese","sub":"CO₂ → glucose"},{"kop":"ademhaling"},{"kop":"verbranding","sub":"fossiele brandstof"}]}
```

## Werkwijze

- Nieuw leerdoel: zet de markup die `node scripts/figuur.mjs spec.json` geeft in de samenvatting-HTML.
- Bestaand leerdoel opknappen: `node scripts/vervang-figuren.mjs <niveau> <vak> <id> spec.json`, met per spec
  `"nr"` (welke figuur hij vervangt). Dat werkt content-pending én `sam-<niveau>.js` bij.
- Altijd daarna `node scripts/render-leerdoel.mjs …` en de png's zelf bekijken. Een figuur die op de telefoon
  krap oogt of iets fout laat zien, gaat niet live.
- Schrijf het bijschrift als een docent: zeg wat je moet zien ("Gaat de lijn omhoog, dan…"), niet wat het plaatje is.
