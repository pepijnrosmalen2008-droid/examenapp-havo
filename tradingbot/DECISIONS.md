# DECISIONS.md — verdedigbare keuzes

Beslissingen die ik zelf heb genomen waar de opdracht ruimte liet, met motivatie.

## D1 — ccxt in plaats van python-bitvavo-api

**Keuze: ccxt (>=4.5).**

- `python-bitvavo-api` (officiële SDK) is een dunne wrapper met bekende zwaktes:
  fouten komen terug als gewone dicts in plaats van exceptions, er is geen
  ingebouwde rate-limit-afhandeling voor REST-retries, en het onderhoudstempo is laag.
- `ccxt` wordt dagelijks onderhouden, heeft ingebouwde rate-limiting
  (`enableRateLimit`), een nette exception-hiërarchie (`NetworkError` vs
  `ExchangeError` vs `InsufficientFunds`) — essentieel voor crash-safe gedrag —
  en ondersteunt Bitvavo volledig, inclusief `clientOrderId` (onze idempotentiesleutel).
- Alle ccxt-aanroepen zitten achter onze eigen wrapper (`autopilot/exchange.py`),
  dus tests mocken onze interface en een eventuele SDK-wissel raakt één bestand.

## D2 — Simpele sleep-loop in plaats van APScheduler

Eén proces, één taak, één interval. APScheduler voegt threads en een
jobstore toe die we niet nodig hebben en die crash-recovery juist complexer maken.
De hoofdloop is `while True: cycle(); sleep(tot volgende interval)`. De dagelijkse
Telegram-samenvatting (20:00 Europe/Amsterdam) wordt in dezelfde loop gecheckt.

## D3 — Idempotentie via order-journal + clientOrderId

Elke order doorloopt: (1) intent in SQLite (`status=PENDING`, eigen
`client_order_id`) → (2) plaatsing bij de exchange mét dat `clientOrderId` →
(3) update naar `FILLED`/`REJECTED`. Bij een herstart worden `PENDING`/`PLACED`
records gereconcilieerd: bestaat de order op de exchange (opzoekbaar via
`clientOrderId`), dan wordt de fill verwerkt; zo niet, dan wordt de intent als
`ABANDONED` gemarkeerd en **niet blind opnieuw geplaatst**. Zo zijn dubbele
orders na een crash uitgesloten.

## D4 — Stop-loss/take-profit bot-side, niet als exchange-order

Bitvavo ondersteunt stop-limit orders, maar geen OCO (stop-loss én take-profit
tegelijk op dezelfde coins). De bot bewaakt SL/TP daarom zelf elke cycle tegen de
actuele ticker. Nadeel: bij een crash van de bot is er tijdelijk geen SL —
gedocumenteerd in de README; systemd `Restart=always` beperkt dat venster tot seconden.

## D5 — "Dag" en dagelijkse samenvatting in Europe/Amsterdam

Dagverlies-anker en de 20:00-samenvatting gebruiken de lokale beurs-/gebruikerstijdzone
(`zoneinfo`, dus DST-proof). Alle opgeslagen timestamps zijn UTC (ISO-8601).

## D6 — Posities = spot-holdings met gemiddelde instapprijs

Spot-handel kent geen "posities" zoals futures. Een positie is hier: de holdings
van één asset, met volume-gewogen gemiddelde instapprijs. Bijkopen middelt de
instapprijs; deels verkopen realiseert P&L tegen die gemiddelde prijs.
Restwaarde < €0,01 sluit de positie (stof).

## D7 — Dag-kill-switch pauzeert ALLES, ook verkopen

"Alle posities sluiten, 24 uur pauze" wordt letterlijk genomen: eerst geforceerde
liquidatie naar EUR, daarna accepteert de risk engine 24 uur lang geen enkel signaal.
Omdat er dan niets meer open staat, is het blokkeren van verkopen geen risico.

## D8 — Drawdown-stop is persistent en vereist expliciete handmatige actie

De vlag `halted=1` staat in SQLite en overleeft herstarts (ook systemd-restarts —
dat is essentieel, anders zou `Restart=always` de kill-switch omzeilen).
Opheffen kan alleen bewust: `python status.py --clear-halt`.

## D9 — float in plaats van Decimal

ccxt werkt met floats; Bitvavo rondt zelf af op de markt-precisie. We ronden
bedragen expliciet af vóór orderplaatsing en gebruiken kleine epsilon-marges bij
saldo-vergelijkingen. Decimal zou schijnprecisie toevoegen tegen reële frictie.

## D10 — Backtest-kosten: taker 0,25% + 0,1% slippage

Bitvavo rekent voor het standaardtarief (categorie A, < €100k/30d volume)
0,25% taker / 0,15% maker (controleer actueel tarief op bitvavo.com/nl/fees —
kon tijdens de bouw niet live geverifieerd worden). De bot gebruikt market
orders, dus taker. Beide waardes zijn configureerbaar onder `costs:` in config.yaml.

## D11 — Bot in `tradingbot/` subdirectory

Deze repository is niet leeg (Slagio-app). De bot leeft volledig in
`tradingbot/` met eigen `.gitignore`, README en requirements, zodat hij later
zo naar een eigen repo verplaatst kan worden (`git mv` of subtree split).

## D12 — Grid-strategie met market orders op level-crossings

Klassiek grid trading zet rustende limit orders. Dat vereist continue
order-reconciliatie (fills buiten de cycle om). Voor robuustheid checkt deze
implementatie elke cycle welke grid-levels de prijs is gepasseerd en handelt
dan met market orders. Iets meer fee/slippage, veel minder state-complexiteit;
de band wordt dagelijks herberekend op 30-dagen volatiliteit.

## D13 — Portfolio heat behandelt alle crypto-posities als één risico-bucket

`risk.max_portfolio_heat_pct` begrenst het totale kapitaal dat verdampt als álle
stop-losses tegelijk afgaan (Σ positiewaarde × stop_loss_pct). Er wordt bewust
géén correlatiematrix geschat: BTC/ETH-correlatie is historisch 0,7–0,9 en juist
in crashes → 1. Rekenen met ρ=1 is conservatief, deterministisch en testbaar;
een geschatte matrix zou schijnprecisie zijn. Kelly sizing is bewust weggelaten:
dat vereist een betrouwbare edge-schatting die deze bot per definitie niet heeft.

## D14 — Shadow mode is het live-pad minus de order, niet "paper met een ander label"

SHADOW authenticeert met een echte (view-only) key, capt orders op het échte
EUR-saldo en doorloopt de volledige risk/journal-flow — alleen de order zelf wordt
gelogd + gesimuleerd. Dubbele verdediging: de echte client draait met
`allow_trading=False`, dus zelfs een bug richting `place_market_order` wordt daar
geweigerd. Geen extra sloten nodig (er kan niets verstuurd worden).

## D15 — Regime-filter als aparte laag, geen stemmen-ensemble

Een ensemble van meerdere strategieën die stemmen maakt "waarom deed de bot dit?"
onbeantwoordbaar. Het regime-filter geeft de beoogde robuustheid (geen nieuwe
long-exposure onder de EMA-200d) als dunne, uitlegbare laag tussen strategie en
risk engine. dca is standaard exempt: die strategie wil juist bijkopen in dalingen.

## D16 — Walk-forward selecteert op Sharpe, met bewust klein grid

Grote parameter-grids vinden gegarandeerd een combinatie die het verleden
perfect verklaart. De grids zijn daarom klein (3–9 combinaties) en de selectie
gebeurt per venster op train-data alleen; het aaneengeschakelde out-of-sample
resultaat is de enige maatstaf die telt. Live auto-tuning is er bewust niet
(zie ook de review-discussie: dat is een overfitting-machine).

## D17 — Monte Carlo met gedeelde blokken over pairs

Block-bootstrap (24u-blokken) op log-returns, met dezelfde blokvolgorde voor
alle pairs — anders vernietigt de resampling de BTC/ETH-correlatie en onderschat
je het portfoliorisico structureel. Fees/slippage krijgen per run ±0,05pp jitter.

## D18 — Spread-breaker blokkeert strategieën, nooit exits

Bij een abnormale spread is een market order duur — maar een stop-loss níét
uitvoeren is gevaarlijker dan een dure fill. Daarom blokkeert de spread-guard
alleen strategie-signalen; SL/TP-exits en kill-switch-liquidaties gaan altijd door.

## D19 — Dashboard is een gegenereerd statisch bestand

`dashboard.py` schrijft self-contained HTML uit SQLite. Geen webserver-proces in
de bot, geen poorten, geen dependencies in het kritieke pad: het dashboard kan
letterlijk niet de trading loop breken. Verversen via cron/systemd-timer.
