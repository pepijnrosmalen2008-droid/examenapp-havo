# Research Roadmap

Geen featurelijst maar een **onderzoeksagenda**: welke hypotheses verdienen tijd, in
welke volgorde, en met welke verwachting. Dit platform bouwt geen strategieën omdat
ze kunnen — het promoveert een idee alleen naar de volgende fase als het de teststraat
overleeft.

## Succescriterium (herzien)

> Een strategie gaat pas LIVE als hij backtest → walk-forward → Monte Carlo → maanden
> PAPER → SHADOW overleeft met **aantoonbaar positieve verwachtingswaarde** of een
> objectief beter risicoprofiel. Succes is niet "de bot handelt", maar "de bot
> verdient het om te handelen". Bereid zijn 99 mooie verhalen weg te gooien voor
> misschien één echt idee.

## Stand van zaken (nulmeting)

Vier prijs-gebaseerde families getest, alle vier verloren van buy-and-hold over
2021–2025 (DCA −15%, momentum −62%, grid −96%, cross-sectional −70% vs +107%).
Conclusie: in **prijs → prijs** zit in deze setup geen eenvoudige edge. De vier
paper-bots draaien nu als live nulmeting tegen vasthouden.

## Hypothese-agenda

Gerangschikt op **EVR — Expected Value of Research**: niet alleen "kans op edge", maar
"hoeveel leer ik, óók als het faalt?". Zo voorkom je tijd in ideeën die zelfs bij een
negatieve uitkomst weinig opleveren.

| # | Hypothese | Nieuwe info? | Testbaar? | Kosten | Kans op edge | Leerwaarde bij falen | EVR |
|---|---|:--:|:--:|:--:|:--:|:--:|:--:|
| 1 | Vol-target: exposure afschalen bij hoge volatiliteit | nee | ✅ | €0 | laag | zeer hoog | ⭐⭐⭐⭐⭐ |
| 2 | Correlatie-de-risk: totale exposure omlaag als ρ→1 | nee | ✅ | €0 | laag | zeer hoog | ⭐⭐⭐⭐⭐ |
| 3 | Inverse-vol / risk-weighted rebalancing vs equal-weight | nee | ✅ | €0 | laag | hoog | ⭐⭐⭐⭐ |
| 4 | On-chain exchange in/outflows → richting/regime | **ja** | ✅ (mits data) | €€ | middel | hoog | ⭐⭐⭐⭐ |
| 5 | Stablecoin-supply/flows → risk-on/off filter | **ja** | ⚠️ | €€ | laag | middel | ⭐⭐⭐ |
| 6 | Macro-events (ETF, FOMC, hacks) effectstudie | **ja** | ⚠️ | € | laag | middel | ⭐⭐⭐ |
| — | AI als onderzoeksassistent (hypotheses, features, analyse) | meta | ✅ | €0 | n.v.t. | n.v.t. | ⭐⭐⭐⭐ |
| 7 | Orderboek / microstructuur | ja | ❌ (geen hist. data) | hoog | zeer laag | laag | ⭐ |

**Eerlijke priors bij de hoogste EVR:** #1/#2 verlagen vermoedelijk de drawdown maar
kosten rendement in een bullmarkt (dus: betere Sharpe, geen euro-outperformance) —
en juist daarom is de leerwaarde hoog: je meet zwart-op-wit de risk/return-ruil.
#4 is de beste "nieuwe informatie", maar het bekende deel (exchange-flows) is
grotendeels wegge-arbitreerd. #7 blijft geparkeerd: op retail-Bitvavo niet backtestbaar.

## De allocatie-engine (#1–3) — beoordelen op een vector, niet op rendement

Allocatie beantwoordt niet "wat koop ik?" maar "hoeveel?". Verwacht géén hoger
eindkapitaal dan vasthouden; beoordeel op:

```
Expected return · Sharpe · Sortino · Max drawdown · Ulcer index · Volatiliteit · Recovery time
```

Plafond om te onthouden: een portefeuille met alléén crypto heeft weinig
diversificatievoordeel — in stress lopen alle correlaties naar 1. Allocatie is
bovendien pas écht waardevol zodra er een echte alpha-bron is: alpha zegt *wat*,
allocatie zegt *hoeveel*, en veel professioneel rendement komt uit de tweede vraag.

## Drie sporen voor de komende weken

- **Spoor A — observatie (geen code):** laat de vier paper-bots draaien; realistische
  nulmeting over wisselende marktomstandigheden.
- **Spoor B — onderzoek (geen code):** dit document; hypotheses rangschikken en
  bijhouden.
- **Spoor C — één experiment:** de allocatie-engine (#1/#2) — gratis, volledig
  backtestbaar, gebruikt bestaande data, levert gegarandeerd nieuwe kennis op (of hij
  verlaagt de drawdown, of niet — allebei informatief). Zelfde teststraat, geen
  soepelere eisen.

## Aangescherpt einddoel

Het oorspronkelijke doel ("een bot die 24/7 autonoom handelt en buy-and-hold verslaat")
blijft geldig, met één beschermende voorwaarde erbij:

> De bot mag alleen live handelen als hij in **onafhankelijke, out-of-sample tests**
> overtuigend laat zien dat hij **na alle kosten** een positieve verwachtingswaarde
> heeft. Verliefd worden op een idee mag pas nadat de data het heeft verdiend.

## Fasen

- **Fase 0 — afgerond:** architectuur, veiligheid, testframework, walk-forward,
  Monte Carlo, dashboard, benchmark.
- **Fase 1 — loopt:** vier paper-bots maandenlang laten draaien, data verzamelen,
  tegen buy-and-hold meten.
- **Fase 2:** één allocatie-experiment. Niet twee, niet drie — alle aandacht op één.
- **Fase 3:** levert allocatie niets op → on-chain (#4).
- **Fase 4:** overleeft een hypothese de volledige teststraat → maanden PAPER + SHADOW.
  Pas daarna zelfs maar overwegen om echt geld in te zetten.

## Wat er NIET gebeurt

- Geen nieuwe prijs-indicator-varianten meer (uitgeput — zie REJECTED_HYPOTHESES.md).
- Geen LLM die koop/verkoop beslist (niet reproduceerbaar, niet backtestbaar).
- Geen live geld tot iets de volledige teststraat overleeft.
