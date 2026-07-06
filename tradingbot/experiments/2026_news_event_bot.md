# Pre-registratie — Experiment: nieuws-/event-bot (niet-prijs informatiebron)

**Vastgelegd vóór de run. Deze criteria worden niet versoepeld na het zien van het
resultaat; een wijziging wordt hieronder gelogd met datum en reden.**

## Waarom dit het moratorium mag passeren
Conditie **B**: dit voegt een **nieuwe informatiebron** toe die niet-prijs is (nieuws,
macro, smart money). Het is bewust géén nieuwe prijs-indicator. Het is de enige
categorie-1-achtige stap die nu op tafel ligt, en de gebruiker vroeg er expliciet om:
"waarom nieuws niet met één bot uittesten".

## Wat de bot is (en niet is)
- **Wel:** een **proactieve** event-gedreven bot. Basisstrategie `hold` (geeft zelf geen
  signaal); hij **zoekt zelf** publieke crypto-nieuwskoppen (RSS) en zet ze deterministisch
  om naar events → `to_trade_signals` → risk engine. Niet tijdgebonden: hij handelt zodra er
  relevant nieuws is. Elke kop vuurt één keer als trade-voorstel en blijft daarna als factor
  meetellen. Kan de bestaande coins ook verkopen bij negatief nieuws. Gedachtegang (welke kop
  → welke coin → waarom) staat op het dashboard.
- **Niet:** geen LLM die koopt, geen X/Reddit/YouTube-scraping. Alleen nieuws-RSS met een
  **transparante, inspecteerbare trefwoord/entiteit-mapping** (coin-termen → pair; bullish/
  bearish-woordenlijsten → richting). Handmatige events blijven mogelijk naast de auto-feed.

## Wat er expliciet getoetst wordt
De **kwaliteit van de kop→richting-mapping** is bewust ruw. Dat is het punt: de forward-only
leerlus rekent elke nieuws-richting af tegen de werkelijke excess-beweging (na kosten, per
regime, FDR-bewaakt). Blijkt de mapping niets te voorspellen → status *onbewezen*, geen
gewicht, en de bron sneuvelt. Zo test de machine of "proactief nieuws zoeken" iets oplevert,
zonder dat de ruwheid van de mapping tot vals vertrouwen leidt.

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
- **Uitbreiding (proactieve feed):** de bot haalt nu zélf nieuws op (RSS) i.p.v. alleen
  handmatig ingevoerde events. Reden: gebruikersverzoek om proactief naar rendabel nieuws te
  zoeken. Dit versoepelt géén acceptatiecriterium — de forward-only lat (n≥100, netto-edge na
  FDR, regime-stabiel, geen drawdown-schade) blijft ongewijzigd; er komt alleen een extra,
  automatische bron van dezelfde soort events bij, die langs exact dezelfde poorten gaat.
