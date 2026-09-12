# Kill-criteria — wanneer een strategie/probe/laag wordt afgekeurd

**Vooraf vastgelegd, zodat de bot zichzelf achteraf geen gelijk kan rekenen.** Een laag die een
kill-criterium raakt, wordt uitgezet of teruggezet naar louter *observeren* (geen order-invoer),
en de uitkomst wordt genoteerd in REJECTED_HYPOTHESES.md. Versoepelen mag alleen met datum + reden,
hieronder gelogd — nooit stilzwijgend na het zien van het resultaat.

Deze criteria zijn de tegenhanger van de acceptatiecriteria in experiments/edge_criteria.md en de
per-experiment pre-registraties. Meetbron: de forward-only leerlus (factor_stats, `validation_report`),
de execution-log (`execution_summary`) en de equity-snapshots. Zie ook BITVAVO_ALPHA_ENGINE.md.

## Meetdefinities (om discussie achteraf te vermijden)
- **netto edge** = gemiddelde excess-return t.o.v. de mand, ná round-trip-kosten (fee + slippage).
- **n_eff** = overlap-gecorrigeerde effectieve steekproef (niet de ruwe n).
- **hit-rate** = fractie observaties waarin de richting relatief klopte.
- **effectieve kosten (bps)** = slippage t.o.v. referentieprijs + fee, uit de execution-log.
- Alle drempels gelden **forward** (live/PAPER), niet op backtests.

## 1 · Execution-laag (maker_first)
`maker_first` claimt kostenbesparing. Dat geldt alleen als de order daadwerkelijk als maker vult.
- **KILL** als, gemeten in SHADOW/LIVE over n_eff ≥ 200 orders, de **maker fill-ratio < 60%**
  én de gemiddelde effectieve kosten van maker-pogingen (inclusief de gemiste fills die alsnog
  duurder taker moesten worden, plus de opportunity-cost van weglopende markt) **niet lager** zijn
  dan puur taker. Dan is passief posten geen besparing → terug naar `taker`.
- Tot die meting bestaat, staat `maker_first` **uit** op alle bots (PAPER kan de fill-kans niet
  eerlijk simuleren). Dit is de correctie op de eerdere onterechte "gegarandeerde besparing".

## 2 · Driehoeks-observer
- **KILL/aftekenen als niet-uitvoerbaar** als over ≥ 2 weken --watch de fractie metingen met
  **netto-positieve edge < 1%** is, óf de mediane **duur van een positief venster < 2 metingen**
  (verdwijnt vóór 3 sequentiële orders kunnen vullen), óf de **uitvoerbare notional op diepte**
  structureel < het minimale ordergroottes-drempelbedrag is. Verwachte uitkomst: afgekeurd.

## 3 · Informatie-probes (nieuws, politici, on-chain) — per entiteit/wallet
Een factor `kind:entity` (bv. `smart_money:<wallet>`, `smart_money:<politicus>`, `news`) wordt
**afgekeurd voor order-invoer** (blijft hooguit uitleg in de gedachtegang) als, ná n_eff ≥ 100:
- de **netto edge ≤ 0**, óf de FDR-correctie niet overleefd wordt (status blijft *onbewezen*), óf
- de edge **niet regime-stabiel** is (door één regime gedragen → *eenzijdig*), óf
- er **actieve drift-down** is (Page-Hinkley) → status *uitgeschakeld*.
Een probe-bot als geheel wordt uitgezet als na **90 dagen** geen enkele van zijn entiteiten de
status *actief* haalt én de bot-P&L slechter is dan buy-and-hold van dezelfde mand.

## 4 · Prijsstrategieën (dca, momentum, rotatie, cross_sectional, vol_target)
- **KILL** als de strategie over de meetperiode een **grotere max drawdown** heeft dan buy-and-hold
  van dezelfde mand, óf een **netto-P&L na kosten < buy-and-hold**, én de adversariële toets
  (`adversarial.py`) faalt (p_luck ≥ 0,10, of edge verdwijnt bij ×2 kosten, of leunt op één coin).
  `cross_sectional` is op deze grond al eerder gefalsificeerd (zie REJECTED_HYPOTHESES.md).

## 5 · Allocatie (Evidence Allocation Engine v2)
- **Blijft gated** (mag niet edge-gewogen alloceren) tot **≥ 1 factor** de status *actief* haalt
  onder criterium 3. Wordt teruggezet naar risk-gewogen (v1) als een eerder-actieve factor terugvalt
  naar *onbewezen*/*uitgeschakeld*.

## Wijzigingslog
- 2026-09-12 — Aangemaakt. Execution-criterium (1) toegevoegd nadat de "gegarandeerde besparing"-
  aanname van maker_first onterecht bleek: een niet-gevulde maker kan economisch slechter zijn dan
  een taker. Meetlaag (execution-log, validation_report) gebouwd om (1)-(3) forward te toetsen.
