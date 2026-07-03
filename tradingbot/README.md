# Autopilot — autonome Bitvavo trading bot

Een crypto trading bot voor [Bitvavo](https://bitvavo.com) die na eenmalige configuratie
zelfstandig 24/7 draait. **Paper trading is de default**; live handelen vereist drie
bewuste, onafhankelijke stappen (zie hieronder).

> ⚠️ **Deze bot belooft geen rendement.** Er bestaat geen instelling voor
> "gewenste winst" — bewust niet. Wat je wél configureert zijn *risicogrenzen*
> (hoeveel je maximaal kunt verliezen per positie, per dag en in totaal) en
> strategie-instellingen. Crypto is volatiel; reken erop dat je je inleg kunt
> verliezen. Resultaten uit backtests of paper trading zeggen niets over de toekomst.

## Hoe het werkt

```
                 ┌─────────────┐   signalen   ┌─────────────┐  goedgekeurd  ┌──────────────┐
 candles/prijzen │  Strategie  │ ───────────► │ Risk engine │ ────────────► │ Order-journal│──► Bitvavo
 ──────────────► │ (pluggable) │              │ (blokkeert/ │               │ (SQLite,     │    of paper-
                 └─────────────┘              │  verkleint) │               │  idempotent) │    simulatie
                                              └─────────────┘               └──────────────┘
```

- **Strategieën** (kiesbaar in `config.yaml`): `dca`, `momentum_ma_cross`, `grid`.
  Ze *stellen alleen voor*; orders plaatsen kan alleen de engine, ná de risk engine.
  Strategieën kunnen risk-limieten dus nooit omzeilen.
- **Risk engine**: pair-whitelist, positielimiet (`max_position_pct`), nooit meer dan
  het beschikbare EUR-saldo, en drie kill switches (zie hieronder). Elke beslissing —
  ook elke blokkade — wordt met reden gelogd (logbestand + SQLite).
- **Crash-safe**: alle state (posities, orders, dagverlies, kill-switch-status) staat
  in SQLite. Elke order wordt éérst als intent gejournald met een eigen
  `clientOrderId`; na een crash wordt gereconcilieerd tegen de exchange, dus
  **geen dubbele orders**.

## De drie kill switches

| Niveau | Trigger | Gevolg |
|---|---|---|
| Per positie | prijs ≤ instap − `stop_loss_pct` (of ≥ `take_profit_pct`) | positie wordt verkocht |
| Per dag | equity vandaag ≥ `max_daily_loss_pct` gezakt | **alle** posities sluiten, 24 uur volledige pauze |
| Totaal | equity ≥ `max_drawdown_pct` onder startkapitaal | alles naar EUR, bot stopt **permanent** tot jij handmatig `python status.py --clear-halt` draait |

De drawdown-stop staat in de database en overleeft herstarts — ook systemd's
`Restart=always` omzeilt hem dus niet.

## Installatie (Raspberry Pi / Linux VPS)

Vereist: Python 3.11+ en een Raspberry Pi 3 of nieuwer (of elke Linux-VPS).

```bash
sudo useradd -r -m -d /opt/autopilot autopilot
sudo -u autopilot -i bash
cd /opt/autopilot
# kopieer de inhoud van de tradingbot/ map hierheen (git clone of scp)
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env && nano .env        # vul je keys in — zie hieronder
nano config.yaml                          # risicoprofiel instellen
.venv/bin/python -m pytest tests/        # alles hoort groen te zijn
.venv/bin/python status.py --balance     # leest je echte saldo met een view-only key
exit

sudo cp /opt/autopilot/deploy/autopilot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now autopilot
journalctl -u autopilot -f               # meekijken
```

### API-key aanmaken (belangrijk)

Maak op <https://account.bitvavo.com/user/api> een key aan met **alléén View en
Trade rechten. Zet Withdrawal NOOIT aan** — als de key ooit lekt kan een aanvaller
dan wel handelen, maar je geld niet wegsluizen. Beperk de key op het IP-adres van
je server als Bitvavo dat aanbiedt. Keys staan alleen in `.env` (in `.gitignore`,
wordt nooit gelogd). Voor paper trading heb je helemaal geen key nodig; voor
`status.py --balance` volstaat een view-only key.

## Configuratie

Zie `config.yaml` (gevalideerd met pydantic; elke onbekende sleutel of waarde buiten
bereik stopt de bot bij startup met een duidelijke fout):

```yaml
mode: PAPER                  # PAPER | LIVE
capital_eur: 500             # startkapitaal dat de bot mag beheren
pairs: [BTC-EUR, ETH-EUR]    # whitelist, bot handelt nooit buiten deze lijst
risk:
  max_position_pct: 20       # max % van kapitaal per positie
  stop_loss_pct: 5
  take_profit_pct: 10
  trailing_take_profit: false
  max_daily_loss_pct: 3
  max_drawdown_pct: 15
  max_portfolio_heat_pct: 2  # max % kapitaal op risico als álle stops afgaan (weglaten = uit)
strategy:
  name: dca                  # dca | momentum_ma_cross | grid
  params: { amount_eur: 10, every_hours: 24 }
schedule:
  interval_minutes: 15
regime:
  enabled: false             # true = geen nieuwe BUY's onder de EMA-200d (bear-regime)
  ema_days: 200
  exempt: [dca]
circuit_breaker:
  enabled: true
  max_consecutive_failures: 3  # zoveel mislukte cycles op rij → 30 min pauze
  cooldown_minutes: 30
  max_spread_pct: 1.0          # wijdere bid/ask-spread → pair die cycle overslaan
```

**Portfolio heat**: `max_portfolio_heat_pct` begrenst het totale bedrag dat je kwijt
bent als alle stop-losses tegelijk afgaan. Alle crypto-posities tellen als één
gecorreleerde bucket (in crashes gaat de BTC/ETH-correlatie naar 1).

**Regime-filter**: klassieke trendregel — geen nieuwe long-exposure zolang de prijs
onder de lange-termijn EMA staat. Exits blijven altijd actief; `dca` is standaard
uitgezonderd omdat die juist in dalingen wil bijkopen.

**Circuit breakers**: na een reeks API-storingen pauzeert de bot (teller overleeft
herstarts); bij een abnormale bid/ask-spread wordt dat pair die cycle niet door
strategieën verhandeld. Stop-loss-exits gaan áltijd door, ook bij wijde spread.

Strategie-parameters:

- **dca** — `amount_eur` (vast bedrag per koop), `every_hours` (interval).
  Verkoopt alleen via stop-loss/take-profit. Simpelst, minste risico op strategie-bugs.
- **momentum_ma_cross** — `fast` (12), `slow` (26), `rsi_period` (14), `rsi_min` (50),
  `rsi_max` (70). EMA-crossover op 1h candles, RSI-filter tegen whipsaws.
- **grid** — `levels` (6), `order_eur` (25), `band_k` (2.0). Prijsband =
  SMA(24u) ± k·σ(30 dagen), dagelijks herberekend; koopt per level omlaag,
  verkoopt per level omhoog.
- **cross_sectional** — `lookback_days` (30), `top_n` (5), `rebalance_days` (7).
  Rangschikt het hele universe op relatieve sterkte en houdt de sterkste N
  (long-only rotatie). Andere klasse dan de rest: cross-sectional i.p.v.
  single-asset. Backtesten met een mand coins — zie `config.basket.yaml`:
  `python walkforward.py --strategy cross_sectional --config config.basket.yaml --from 2021-01-01 --to 2025-12-31`

## Van PAPER via SHADOW naar LIVE

Naast `PAPER` en `LIVE` is er een derde mode: **`SHADOW`**. Die doorloopt het
volledige live-pad — authenticatie met je echte (view-only) key, je echte
EUR-saldo als harde limiet, dezelfde risk/journal-flow — maar de order zelf wordt
**nooit verstuurd**: hij wordt gelogd en intern gesimuleerd. Draai een strategie
een paar maanden in SHADOW en vergelijk het dashboard met gewoon aanhouden;
pas dan weet je of live gaan überhaupt te verdedigen is. SHADOW vereist geen
extra sloten (er kan niets verstuurd worden) en de view-only client weigert
bovendien zelf elke order (dubbele verdediging).

Aanbevolen pad: `PAPER` (weken) → `SHADOW` (maanden) → pas daarna eventueel `LIVE`.

## Van PAPER/SHADOW naar LIVE — drie sloten

De bot weigert live te starten (en logt waarom) tenzij **alle drie** kloppen:

1. `config.yaml` → `mode: LIVE`
2. `.env` → `TRADING_MODE=LIVE`
3. een bestand `I_UNDERSTAND_THE_RISKS.txt` in de projectroot (`touch I_UNDERSTAND_THE_RISKS.txt`)

Dringend advies: laat de bot eerst **minimaal 4 weken in PAPER mode** draaien en
vergelijk het resultaat met simpelweg BTC aanhouden over dezelfde periode, vóórdat
je ook maar €1 live inzet. Gebruik per mode een eigen database (de bot weigert
zelf een PAPER-database in LIVE te hergebruiken).

## Dagelijks gebruik

```bash
python status.py                 # huidige state uit SQLite (mode, equity, posities, orders)
python status.py --balance      # + je echte Bitvavo-saldo (view-only key)
python status.py --clear-halt   # drawdown-stop bewust opheffen na een halt
python bot.py --once            # één cycle draaien (handig om te testen)
python dashboard.py             # schrijft dashboard.html (zie hieronder)
```

**Dashboard**: `python dashboard.py` genereert een self-contained `dashboard.html`
met equity-curve, drawdown (incl. kill-switch-drempel), P&L, hit ratio, Sharpe,
open posities, orders en risk-blokkades — licht/donker automatisch. Het is een
statisch bestand: geen backend, kan de trading loop niet raken. Ververs het
periodiek en serveer het met elke webserver:

```
*/15 * * * *  cd /opt/autopilot && .venv/bin/python dashboard.py --out /var/www/html/index.html
```

**Telegram** (optioneel): zet `TELEGRAM_BOT_TOKEN` en `TELEGRAM_CHAT_ID` in `.env`
(bot maken via [@BotFather](https://t.me/BotFather); je chat-id via `@userinfobot`).
Je krijgt: elke trade, elke risk-blokkade van een exit, elke kill-switch-trigger en
een dagelijkse samenvatting om 20:00 (NL-tijd) met P&L, open posities en saldo.

**Logs**: `logs/autopilot.log` (JSON, met rotatie) + `journalctl -u autopilot`.

## Backtesting

```bash
python backtest.py --strategy momentum_ma_cross --from 2023-01-01 --to 2025-12-31
python backtest.py --all --from 2023-01-01 --to 2025-12-31   # alle 3 + buy-and-hold
```

Historische 1h-candles worden opgehaald via de publieke Bitvavo API (geen key nodig,
met rate-limit respect) en lokaal gecachet in `data-cache/`. De backtester replayt de
candles door **dezelfde engine** als live (incl. risk engine, kill switches, taker fee
0,25% + 0,1% slippage — beide configureerbaar onder `costs:`). Output: totaalrendement,
max drawdown, aantal trades, win rate, Sharpe en de vergelijking met buy-and-hold.

Ter illustratie het resultaat op een *synthetische* 2023–2025 dataset (echte data kon
in de bouwomgeving niet worden opgehaald — draai bovenstaand commando zelf voor echte
cijfers). Ook leerzaam: in de bear-fase van deze dataset trok de drawdown-kill-switch
alle drie de strategieën er bij −15% uit, terwijl buy-and-hold een drawdown van 60%
moest uitzitten:

```
strategie                  eind  rendement   max DD  trades   win%  Sharpe
──────────────────────────────────────────────────────────────────────────
dca                  €   424.61    -15.08%   17.96%     779     25   -1.35  ⛔ gestopt
momentum_ma_cross    €   424.49    -15.10%   16.07%     418     29   -1.68  ⛔ gestopt
grid                 €   424.82    -15.04%   15.41%    1171     46   -5.16  ⛔ gestopt
buy-and-hold         €   830.50     66.10%   60.61%       2      —    0.60
```

## Webportaal op slagio.nl/bot.html

Wil je de bot vanaf je telefoon of een andere computer volgen, dan is er een
beveiligd portaal: **https://slagio.nl/bot.html** (staat live zodra deze branch
naar `main` is gemerged; lokaal testen kan door `bot.html` in een browser te openen).

**Wat het is**: een crypto-app-achtig dashboard (portefeuillewaarde, verloop,
je bezit per coin met live prijs en winst/verlies, orders, risk-blokkades) dat
**~elke minuut** ververst, met één afstandsbediening — een **noodstop** die alle
posities naar EUR verkoopt en de bot permanent stopt. De bot doet een volwaardige
handelscyclus elke `interval_minutes`, maar stuurt tussendoor elke ~60s een verse
statusupdate naar de site (prijzen/equity), zonder te handelen.

**Coin-universe**: met `universe.enabled: true` kiest de bot dagelijks zelf welke
Bitvavo-EUR-markten liquide genoeg zijn (volume + spread + actief) en handelt die,
in plaats van alleen `pairs`. Let op: dit bepaalt alléén *welke markten
verhandelbaar* zijn, niet *welke een goede investering* zijn — dat laatste weet geen
enkele strategie. Op meer (en kleinere, volatielere) coins handelen met een
strategie zonder bewezen edge betekent sneller verlies, niet meer winst. De risk
engine (positielimiet, portfolio heat) begrenst hoeveel er totaal in gaat. Bewust NIET op afstand
mogelijk: starten, de halt opheffen of instellingen wijzigen. De veilige richting
(stoppen) kan overal vandaan; de gevaarlijke richting (weer aanzetten) alleen op
de machine zelf. De pagina kent je Bitvavo-keys niet en kan niet handelen.

**Eenmalige setup** (±5 minuten):

1. Draai `deploy/supabase_portal.sql` in de Supabase SQL Editor
   (maakt `bot_state` + `bot_commands` met Row Level Security).
2. Supabase → Authentication → Users → **Add user** (vink *Auto confirm* aan).
   Kies een sterk, uniek wachtwoord — dit is de sleutel tot je botgegevens.
3. Supabase → Authentication → Sign In / Up → zet **"Allow new users to sign up" uit**.
4. Vul in `.env` in: `SUPABASE_ANON_KEY` (de publieke key uit `cloud.js`),
   `BOT_PORTAL_EMAIL` en `BOT_PORTAL_PASSWORD` (het account uit stap 2).
5. (Her)start de bot. Hij synct nu elke cycle zijn status en checkt op commando's.

**Beveiligingsmodel, eerlijk samengevat**: de anon key is publiek (dat is bij
Supabase het ontwerp) — de bescherming komt van je wachtwoord plus Row Level
Security: elke rij is uitsluitend leesbaar/schrijfbaar voor jouw ingelogde
account. Het ergste dat iemand met je wachtwoord kan doen is meekijken en de
bot stoppen — nooit starten of handelen. De pagina staat op `noindex` en is
nergens vanuit de examen-app gelinkt.

**Let op**: de pagina toont wat een drááiende bot rapporteert. De bot zelf moet
ergens draaien (je eigen PC volstaat voor PAPER: `python bot.py`). Staat de
laatste update er te lang, dan meldt de pagina "bot lijkt offline".

## Walk-forward validatie & Monte Carlo

Eén backtest zegt weinig: hij verklaart gisteren. Twee tools geven een eerlijker beeld:

```bash
# rollend train/test-schema: parameters gekozen op alléén verleden data,
# gehandeld out-of-sample; rapporteert per venster + totaal OOS vs buy-and-hold
python walkforward.py --strategy momentum_ma_cross --from 2023-01-01 --to 2025-12-31

# N gebootstrapte marktscenario's (24u-blokken, correlatie tussen pairs blijft
# intact) + fee/slippage-jitter → verdeling i.p.v. één getal
python backtest.py --strategy grid --monte-carlo 50 --from 2023-01-01 --to 2025-12-31
```

Vuistregels bij het lezen: presteert een strategie in-sample veel beter dan
out-of-sample, dan is het grid aan het overfitten. Ligt de historische run ver
boven de Monte Carlo-mediaan, dan was dat pad waarschijnlijk geluk. Pas als een
strategie in walk-forward consistent is, in Monte Carlo geen rampscenario's
produceert én maandenlang in PAPER/SHADOW overleeft, is er reden om over live
na te denken — en zelfs dan bewijst niets dat de edge blijft bestaan.

## Tests

```bash
python -m pytest tests/ -v
```

94 tests; de risk engine is het zwaarst getest (elke limiet, elke kill switch,
portfolio heat, circuit breakers, herstart-na-crash). Geen enkele test raakt de
echte Bitvavo API.

## Belasting (NL)

Crypto-winst valt voor particulieren normaal in **box 3**; zeer actief of
bedrijfsmatig handelen kan als box 1-inkomen worden gezien. Check dit bij een
belastingadviseur als het serieus wordt.

## Projectstructuur

```
bot.py            hoofdproces (trading loop)      status.py     state-CLI
backtest.py       backtester + Monte Carlo        walkforward.py walk-forward validatie
dashboard.py      statisch HTML-dashboard          config.yaml   risicoprofiel
autopilot/
  config.py       pydantic-validatie + live-guardrails (PAPER/SHADOW/LIVE)
  engine.py       trading cycle, order-journal, kill switches, circuit breakers
  risk.py         risk engine (aparte laag, eigen tests) incl. portfolio heat
  regime.py       EMA-200d trendfilter tussen strategie en risk engine
  exchange.py     ccxt-wrapper: MarketData / BitvavoClient / Paper / Shadow
  backtesting.py  replay-machinerie (gedeeld door backtest/walk-forward/MC)
  montecarlo.py   block-bootstrap stress-testing
  database.py     SQLite state store               notify.py    Telegram
  indicators.py   EMA / RSI / volatiliteit         logsetup.py  JSON-logs met rotatie
  strategies/     dca.py, ma_cross.py, grid.py (pluggable interface)
tests/            94 tests (risk engine, kill switches, crash-recovery, strategieën,
                  heat, shadow, regime, circuit breakers, walk-forward, Monte Carlo)
deploy/           autopilot.service (systemd)
DECISIONS.md      motivatie van ontwerpkeuzes
```
