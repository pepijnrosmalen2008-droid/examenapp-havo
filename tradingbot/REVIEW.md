# Slagio Autopilot — review-rapport

*Stand van zaken van de trading-bot en de research-/beslislaag. Eerlijk bedoeld: het
laat net zo goed zien wat er (nog) niet is als wat er wel is.*

## 1. In één alinea
Een crash-safe, PAPER-first trading-bot met een aparte risk-engine en een empirisch
zelfcorrigerend beslissingssysteem eromheen. De bot handelt op vooraf getoetste
prijsstrategieën; een losse beslislaag meet forward-only welke informatie *historisch*
nuttig bleek, maar geeft niets invloed op orders tot de data het verdient. Het systeem is
inmiddels een sterke **detector van historische regelmatigheden** — en nadrukkelijk nog
géén bewezen **voorspeller van toekomstige winst**.

## 2. Architectuur (3 lagen, streng gescheiden)
- **Execution + risk engine.** Enige laag die orders plaatst. Drie kill-switches
  (per-positie stop-loss, dag-max-verlies → 24u pauze, totale drawdown → alles naar EUR +
  permanente halt), portfolio-heat, circuit breakers, order-journal met idempotentie
  (crash-safe via SQLite/WAL). LIVE vereist drie sloten (env + config + ack-bestand).
- **Strategie-laag.** Pluggable achter één interface: `dca`, `momentum_ma_cross`, `grid`,
  `cross_sectional` (rotatie), `vol_target` (allocatie). Backtest → walk-forward →
  Monte Carlo met realistische kosten.
- **Beslislaag (evaluatie, geen executie).** Factoren + gedachtegang + forward-only
  leerlus. Kan een order hooguit VOORSTELLEN via de risk-engine; nooit zelf plaatsen.

## 3. Wat er nieuw is (deze ronde)
- **Zichtbare gedachtegang** op slagio.nl/bot.html: per cyclus waaróm de bot koopt,
  verkoopt of cash houdt — inclusief "waarom geen trade", een zekerheids-meter en de top-redenen.
- **Multi-factor afweging:** prijs (momentum, trend, rust/risico, afstand-tot-top,
  relatieve sterkte) + optionele externe factoren (nieuws/macro/smart-money, per bron/persoon).
- **Forward-only leerlus met de juiste meetlat:**
  - edge = **excess t.o.v. de mand** (opportunity cost), **na kosten** — geen beta/toeval;
  - gewicht op **statistisch verantwoorde** edge (ondergrens `mean − 1,64·SE > 0`), niet op accuracy;
  - **overlap-correctie** (effectieve steekproef): 24u-vensters die elk uur worden gemeten
    tellen niet als losse waarnemingen;
  - **regime-conditionering** (bull/bear/chop): een factor is pas *actief* als de edge over
    meerdere regimes standhoudt; leunt hij op één regime → *eenzijdig*, geen upweight.
- **Track-record-tabel** per factor: obs (+effectief), excess/obs, 95%-ondergrens,
  per-regime-edge, status (observeren → onbewezen → actief / eenzijdig / uitgeschakeld).

## 4. Governance
Roadmap op EVR (Expected Value of Research), pre-registratie van acceptatiecriteria,
rejected-hypotheses-log, sunk-cost-clausule. Vooraf vastgelegde drempels voor "wanneer is
een edge echt" en de zwaardere lat voor échte order-invoer (`experiments/edge_criteria.md`).
Elke grote keuze staat in `DECISIONS.md` (t/m D25).

## 5. Empirische stand (eerlijk)
- **Vier prijsstrategieën verloren in walk-forward van buy-and-hold** (2021–2025):
  DCA −15%, momentum −62%, grid −96%, cross-sectional −70% vs +107%/+73% hold.
- **Allocatie-engine (vol_target)** is pre-registered en gebouwd; wacht op walk-forward +
  Monte Carlo tegen de 5 criteria. Verwachting: betere risico-maat, geen euro-outperformance.
- **Beslislaag-track-record:** vult zich nu pas; grotendeels *observeren*. Betekenisvol pas
  na honderden observaties per factor én meerdere doorgemaakte regimes (weken–maanden).

## 6. Bekende beperkingen (bewust benoemd)
- Regime-stabiele historische edge is **noodzakelijk, niet voldoende** voor toekomstige
  winst — de markt is een adaptief systeem, geen vaste dataset.
- Externe factoren (nieuws/Trump/Musk) zijn **niet backtestbaar** (leakage); alleen forward.
- Policy-dependence gemitigeerd (meting is observationeel & universe-breed), maar de
  keuze van het universe en de sample-momenten blijven beleid.
- €117 startkapitaal is klein t.o.v. fees en de €5-minimumorder.

## 7. Wat expliciet NIET gebeurt / geparkeerd
Geen LLM die koop/verkoop beslist. Geen nieuwe prijs-indicatoren (uitgeput). Geen live
geld tot iets de volledige teststraat overleeft. Geparkeerd (roadmap): horizon-per-factor,
fijnmazige bronbetrouwbaarheid, factor-interacties, rolling-window & regime-transities,
en de allocatie-impact-vraag (L3: verhoogt een factor de portefeuille-Sharpe?).

## 8. Volgende stap
Geen extra laag — **tijd.** De factoren maandenlang laten meten (per factor én per regime)
tot "welke informatie voegt echt iets toe boven prijs?" een eerlijk te beantwoorden vraag
is. Daarna, indien gewenst: L3 — de stap van *statistische edge-detectie* naar een
*regime-bewuste allocatie-engine*, eerst op papier, zonder opnieuw in overfitting te vallen.

## 9. Kwaliteit
160 tests groen; geen enkele test raakt de echte Bitvavo-API. Static site (geen build),
bot draait crash-safe met systemd/handmatig; webportaal met asymmetrische afstandsbediening
(wel noodstop, nooit starten). Bitvavo-key hoort View+Trade te zijn, nooit withdrawal.
