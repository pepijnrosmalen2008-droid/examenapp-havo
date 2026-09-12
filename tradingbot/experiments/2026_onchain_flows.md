# Pre-registratie — Experiment: on-chain money-flow-probe (grote wallet-/exchange-flows)

**Vastgelegd vóór de run. Deze criteria worden niet versoepeld na het zien van het
resultaat; een wijziging wordt hieronder gelogd met datum en reden.**

## Waarom dit het moratorium mag passeren
Conditie **B**: een nieuwe, niet-prijs informatiebron (on-chain zichtbare geldstromen), naast
nieuws en politici-transacties. Geen nieuwe prijs-indicator. Het is de latency-ongevoelige tak
van de Bitvavo Alpha Engine (zie BITVAVO_ALPHA_ENGINE.md) — de enige "smart money"-tak waar een
thuis-pc kán meedoen, omdat het signaal op minuten-tot-uren speelt, niet op microseconden.

## Wat de probe is (en niet is)
- **Wel:** een proactieve, flow-gedreven bot. Basisstrategie `hold`; hij haalt zelf grote
  on-chain transacties op en mapt ze deterministisch: whale → exchange (deposit) = verkoopdruk →
  bearish; exchange → cold wallet (withdrawal) = aanbod weg → bullish. Elke flow vuurt één keer
  als voorstel en blijft daarna als factor meetellen (TTL 12u). Elke wallet krijgt een **eigen
  factor-sleutel** (`smart_money:<label>`).
- **Niet:** geen prijsmanipulatie, geen scraping van niet-openbare data. Alleen on-chain
  zichtbare, publieke bewegingen. Geen order zonder dat het door de confidence-poort én de risk
  engine gaat.

## Wat er expliciet getoetst wordt
De flow→richting-vertaling is bewust ruw ("deposit = verkoop" klopt lang niet altijd —
market-maker-herbalancering, custody-migratie, OTC-settlement zien er hetzelfde uit). Dat is het
punt: de forward-only leerlus rekent élke wallet af tegen de werkelijke excess-beweging (na
kosten, per regime, FDR-bewaakt). De "wallet-reputatie" die de gebruiker wil, ontstaat zó uit de
meting — niet uit een verzonnen score. Een wallet die niets voorspelt → status *onbewezen*, geen
gewicht.

## De harde grens: forward-only
On-chain flows zijn **niet zinvol backtestbaar** met dit platform (label-drift, herziene
wallet-tags, survivorship in welke wallets een dataset achteraf "belangrijk" noemt = leakage).
Beoordeling uitsluitend **live, vooruit**, in PAPER, via de bestaande leerlus.

## Hypothese
Grote on-chain flows hebben, ná kosten en los van de markt-beta, geen vanzelfsprekende
voorspellende waarde voor de Bitvavo-koers. We geloven het pas als de forward-data het per wallet
toont.

## Acceptatiecriteria (forward)
Per wallet/entiteit (`smart_money:<label>`):
1. **n ≥ 100** afgerekende observaties (overlap-gecorrigeerde effectieve n);
2. **Netto excess-edge > 0** met FDR overleefd (status *actief*, niet *onbewezen*) — FDR corrigeert
   hier streng, want er zijn veel wallets (veel gelijktijdige hypotheses);
3. **Regime-stabiel** en géén actieve drift-down;
4. **Bot-niveau:** geen grotere max drawdown dan buy-and-hold van dezelfde mand, positieve netto-P&L.

Haalt een wallet dit niet → verworpen voor order-invoer (REJECTED_HYPOTHESES.md). Mag blijven
bestaan als *uitleg* in de gedachtegang.

## Verwachting (eerlijk)
Zwak of afwezig, en waarschijnlijk zeer wallet-afhankelijk. De meeste "whale deposits" zijn ruis;
de datakwaliteit (wallet-labeling) is wisselend; en zodra een wallet-signaal breed bekend wordt,
arbitreert het weg. Het meest waarschijnlijke resultaat is weinig *actieve* wallets en veel
*onbewezen* — reproduceerbaar zichtbaar dat de bron onder deze randvoorwaarden weinig gaf.

## Bekende beperkingen (bewust benoemd)
- **Interpretatie ≠ informatie.** "Deposit = verkoop" is een aanname; de richting zit vast aan het
  event. Een negatieve uitkomst kan slecht signaal, slechte interpretatie of slechte timing zijn.
- **Datakwaliteit & bron-afhankelijkheid.** Zonder API-sleutel is de dekking beperkt; met sleutel
  beter maar niet perfect. Wallet-labels veranderen. De fetcher degradeert stil bij een dode bron.
- **Cross-source dedup ontbreekt.** Eén onderliggende transfer die door meerdere feeds wordt
  gemeld telt (nog) als meerdere events; de hash dedupt alleen exacte duplicaten.
