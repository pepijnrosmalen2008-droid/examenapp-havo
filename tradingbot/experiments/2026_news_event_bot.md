# Pre-registratie — Experiment: nieuws-/event-bot (niet-prijs informatiebron)

**Vastgelegd vóór de run. Deze criteria worden niet versoepeld na het zien van het
resultaat; een wijziging wordt hieronder gelogd met datum en reden.**

## Waarom dit het moratorium mag passeren
Conditie **B**: dit voegt een **nieuwe informatiebron** toe die niet-prijs is (nieuws,
macro, smart money). Het is bewust géén nieuwe prijs-indicator. Het is de enige
categorie-1-achtige stap die nu op tafel ligt, en de gebruiker vroeg er expliciet om:
"waarom nieuws niet met één bot uittesten".

## Wat de bot is (en niet is)
- **Wel:** een event-gedreven bot. Basisstrategie `hold` (geeft zelf geen enkel signaal);
  álle trades komen uit gestructureerde events via de bestaande research-laag
  (`research_events.json` → RuleBasedResearchAgent → `to_trade_signals` → risk engine).
  Zijn gedachtegang staat al op het dashboard (externe factoren, beslissingspaneel, wat-als).
- **Niet:** een sentiment-scraper, geen LLM die koopt, geen X/Reddit-feed. Events worden
  gestructureerd ingevoerd (pair, kind, direction, confidence, magnitude, n_sources,
  published). De bot beslist zelf te handelen wanneer een event door de confidence-poort
  én de risk engine komt.

## De harde grens: forward-only
Nieuws is **niet backtestbaar** — een model getoetst op oud nieuws kent de afloop al
(leakage). Er komt dus **geen backtest** als bewijs. Beoordeling gebeurt uitsluitend
**live, vooruit**, in PAPER, via de bestaande forward-only leerlus (excess t.o.v. de mand,
na kosten, overlap-gecorrigeerd, per regime, FDR- en drift-bewaakt).

## Hypothese
Gestructureerde niet-prijs-events hebben, ná kosten en los van de markt-beta, geen
vanzelfsprekende voorspellende waarde. We geloven het pas als de forward-data het toont.

## Acceptatiecriteria (forward, om van "uittesten" naar "serieus nemen" te gaan)
Per event-bron/entiteit (`kind:entity`, bv. `macro:fed`, `smart_money:trump`):
1. **n ≥ 100** afgerekende observaties (overlap-gecorrigeerde effectieve n telt);
2. **Netto excess-edge > 0** met de FDR-correctie overleefd (status *actief*, niet *onbewezen*);
3. **Regime-stabiel** (niet gedragen door één regime), en géén actieve drift-down;
4. **Bot-niveau:** over de looptijd geen grotere max drawdown dan de buy-and-hold van
   dezelfde mand, en een positieve netto-P&L na kosten.

Haalt een bron dit niet → **verworpen voor order-invoer**, genoteerd in
REJECTED_HYPOTHESES.md. De bron mag blijven bestaan als *uitleg* in de gedachtegang.

## Verwachting (eerlijk)
Klein, regime-afhankelijk of afwezig. Het waarschijnlijke effect is minder handelen en
meer "no trade" — en het zichtbaar maken van hoeveel vermeende nieuws-edge verdampt na
kosten. Ook dat is een geldige uitkomst: het platform toont dan reproduceerbaar dat deze
bron onder deze randvoorwaarden geen overtuigende edge gaf.

## Wat NIET gebouwd is (en waarom)
- **Regime-bot (Bot "5"):** het marktregime (bull/bear/chop) wordt al bepaald en per
  observatie vastgelegd (`factor_learning.market_regime`); een aparte regime-bot is
  categorie 2 (measurement) → valt onder het moratorium.
- **Execution-auditor (Bot "6"):** in PAPER is de fill gesimuleerd → zou alleen de
  modelslippage echoën. Pas betekenisvol in SHADOW/LIVE (roadmap).
- **Conflict-engine:** decision-infrastructuur, geen nieuwe informatie → categorie 2.
  De bestaande risk engine + research-gating vervullen de veto-rol al.

## Wijzigingslog
(leeg — nog geen wijzigingen)
