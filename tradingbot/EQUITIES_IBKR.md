# Aandelen via Interactive Brokers (IBKR) — plan, frictie, architectuur

## Beslissing
Voor "één broker, wereldwijde aandelen, écht programmatisch orders plaatsen" is **IBKR** de keuze
(boven DEGIRO/Trading212/eToro: die zijn niet bot-first; boven Alpaca: dat is vooral US). IBKR biedt
170+ markten in ~40 landen en API's (Client Portal Web API, TWS API, FIX) die zowel marktdata als
order-invoer ondersteunen — expliciet gepositioneerd voor algorithmic trading.

**IBKR Pro, niet Lite.** Kostenprofiel dat past bij "commissie per trade is prima, verder €0":
$0 account-minimum, $0 inactiviteit, $0 API, gratis IB Gateway. IBKR meldt dat API-koppeling voor
sommige toepassingen een *funded Pro*-account vereist; voor een eigen bot kiezen we daarom Pro. De
enige structurele kosten zijn commissie/fees per trade (aanvaard) en — per beurs — optionele
marktdata-abonnementen.

## De informatie-architectuur: eigen gratis data-engine, IBKR alleen voor brokerage
De interessante vraag is niet "welke dure data-API kopen we?" maar "hoe verzamelt de bot zelf zoveel
mogelijk relevante wereldwijde info gratis, en gebruikt hij IBKR alleen voor verificatie + uitvoering?"
Dat is precies de crypto-filosofie (nieuws/on-chain/politici-probes zijn al gratis-bron-gedreven):

    gratis bronnen (nieuws, fundamentals, jaarverslagen, earnings/events, prijzen, macro, sector,
    sentiment) → eigen analyse → ~10.000 aandelen → 500 kandidaten → 50 kansen → IBKR (realtime
    verificatie + account + orders + fills)

**Harde grens (gebouwd): gratis data ≠ betrouwbare data.** Elke bron wordt eerst gemeten op latency,
dekking, versheid en betrouwbaarheid vóór hij een trade mag aandrijven — anders bouwen we een bot op
rotzooi. Zie `autopilot/datasource.py`: `measure()` (latency/succes/#records per ophaal-poging),
`db.datasource_stats()` (ok-ratio, latency, versheid per bron) en `is_trustworthy()` — een conservatieve
poort die bepaalt of een bron mag *handelen* of alleen mag *informeren*. Zichtbaar via `status.py`.
Volgende stap: deze poort in het fetch-pad van de research-agents inbouwen zodat een onbetrouwbare
bron automatisch teruggezet wordt naar louter-informeren.

## Architectuur: gedeelde kern, twee brokers
De execution-engine wordt broker-agnostisch gemaakt via een dun contract (`autopilot/broker.py`,
`Broker`-Protocol) dat de bestaande Bitvavo-exchanges al vervullen:

    Strategy → Execution Engine → Broker → (BitvavoBroker | IBKRBroker | …)

                       GEDEELDE KERN (risk, measurement, kill-criteria, learning)
                                        │
                      ┌─────────────────┴─────────────────┐
                   CRYPTO                               EQUITIES
                   Bitvavo                                IBKR
                   24/7                              markturen/sessies
                      └─────────────────┬─────────────────┘
                              measurement → shadow → live

De crypto-bot heeft al een execution-cost-laag, execution-log, shadow-mode, kill-criteria en een
forward-only leerlus. De aandelenbot hergebruikt die kern; alleen de broker-adapter is nieuw.

## Frictie — eerlijk, want dit is NIET "Bitvavo maar dan aandelen"
Het `Broker`-contract maakt de *koppeling* herbruikbaar, niet de domeinlogica. Reële verschillen die
de IBKR-adapter (en deels de engine/config) moeten afhandelen:

1. **Orders in aandelen, niet in notional.** Bitvavo koopt op quote-bedrag (`amount_eur`); IBKR koopt
   een aantal shares. De adapter vertaalt notional → shares via de actuele prijs en rondt af op
   toegestane stukken (soms geen fractionals per beurs).
2. **Markturen/sessies.** Aandelenbeurzen zijn niet 24/7. Buiten sessie: geen fills. De engine (nu
   24/7-aannemend) moet weten of een markt open is, en pre/after-hours apart behandelen.
3. **Meerdere valuta's.** US=USD, UK=GBP, JP=JPY. De 'eur'-velden worden dan een abstractie die FX
   vereist (waardering, P&L, risicolimieten per valuta).
4. **Settlement & regels.** T+1/T+2-settlement, PDT-regels (VS), short-borrow/shortability — bestaan
   niet in crypto-spot en raken de risk-engine en positieboekhouding.
5. **Marktdata-abonnementen.** 170+ markten ≠ 170+ gratis realtime feeds. Per beurs permissions/kosten;
   zonder abonnement krijg je vertraagde/incomplete quotes — waardeloos voor een live-signaal.
6. **Verbinding.** Geen simpele REST-key: IB Gateway/TWS moet draaien (login + 2FA), met `ib_insync`/
   `ibapi` of de Client Portal Web API-sessie. Operationeel zwaarder dan Bitvavo.

## Config-uitbreiding die nodig wordt (nu NIET gedaan)
De `pairs`-validator dwingt vandaag `-EUR` af. Aandelen vragen een instrument-notatie met
beurs + valuta (bv. `AAPL@NASDAQ:USD`, `ASML@AEB:EUR`), een `broker: bitvavo|ibkr`-veld, markturen,
en een universe-selector op volume/marktkap/spread/shortability/land. Dat is een aparte, zorgvuldige
stap na de adapter.

## Gefaseerd plan (elke fase = pre-registratie + kill-criteria, net als crypto)
1. **Broker-contract** (`broker.Broker`) — gebouwd; Bitvavo-exchanges voldoen eraan. ✅
2. **IBKRBroker-skelet** (`autopilot/ibkr.py`) — gebouwd; nog geen verbinding, weigert luid. ✅
3. **IBKR paper-account-adapter** — `connect()` + marktdata + notional→shares + markturen, getest
   tegen een IBKR **paper trading**-account (aparte poort). Geen euro live.
4. **Data-kwaliteitspoort** — meet of realtime quotes compleet/tijdig zijn per beurs; strategie mag
   niet live op een markt zonder deugdelijke feed.
5. **SHADOW** — volledige live-pad, echt saldo als limiet, order niet verstuurd; execution-log vult
   de echte fills/kosten.
6. **LIVE** — pas na fase 5, achter dezelfde drie-slot-guardrail als crypto, met kill-criteria.

## Wat vandaag gebouwd is
- `autopilot/broker.py`: `Broker`-Protocol (contract dat de engine gebruikt) + `REQUIRED_METHODS`.
- `autopilot/ibkr.py`: `IBKRBroker`-skelet (conform het contract; weigert tot de Gateway gewired is).
- `autopilot/datasource.py`: databron-kwaliteit-poort (meten + `is_trustworthy` + report), zodat de
  gratis-data-engine niet op onbetrouwbare bronnen bouwt. Werkt nu al voor de crypto-probes.
- Conformance- en poort-tests: `PaperExchange` voldoet aan `Broker`; `IBKRBroker` weigert netjes;
  de databron-poort keurt trage/onbetrouwbare/oude bronnen af.

Bewust niet gebouwd: de echte IBKR-verbinding (vereist account + gateway + data-permissions, hier niet
testbaar), config-ondersteuning voor niet-EUR-instrumenten, markturen en FX. Dat zijn fase 3+.
