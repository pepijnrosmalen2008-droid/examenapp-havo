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

| # | Hypothese | Nieuwe info? | Nu testbaar? | Kosten | Eerlijke prior | Prioriteit |
|---|---|:--:|:--:|:--:|---|:--:|
| 1 | Vol-target: schaal exposure af bij hoge volatiliteit | nee | ✅ | €0 | Verlaagt drawdown, kost rendement in bull. Mogelijk hogere Sharpe. | **hoog** |
| 2 | Correlatie-de-risk: verlaag totale crypto-exposure als ρ→1 | nee | ✅ | €0 | Helpt vooral in crashes; geen euro-outperformance. | **hoog** |
| 3 | Inverse-vol / risk-weighted rebalancing vs equal-weight | nee | ✅ | €0 | Marginaal betere Sharpe, hooguit. | midden |
| 4 | On-chain exchange in/outflows → richting/regime | **ja** | ✅ (mits data) | €€ | Grotendeels wegge-arbitreerd; klein, mogelijk instabiel signaal. Beste "nieuwe info". | **hoog** |
| 5 | Stablecoin-supply/flows → risk-on/off filter | **ja** | ⚠️ | €€ | Traag, laagfrequent; hoogstens een regime-filter. | midden |
| 6 | Macro-events (ETF, FOMC, hacks, regelgeving) effectstudie | **ja** | ⚠️ | € | Te weinig events voor statistische significantie. | midden |
| 7 | Orderboek / microstructuur | ja | ❌ (geen hist. data) | hoog | HFT-domein; niet haalbaar op retail-Bitvavo. | **geparkeerd** |
| — | AI als onderzoeksassistent (hypotheses, features, analyse) | meta | ✅ | €0 | Plaatst nooit orders; versnelt 1–6. | **continu** |

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

## Wat er NIET gebeurt

- Geen nieuwe prijs-indicator-varianten meer (uitgeput).
- Geen LLM die koop/verkoop beslist (niet reproduceerbaar, niet backtestbaar).
- Geen live geld tot iets de volledige teststraat overleeft.
