# Hoe de bot werkt — van begin tot eind

Een volledige, gedetailleerde uitleg van de all-in trading-bot (`config.allin.yaml`, strategie
`adaptive`). Beschrijft wat hij is, hoe hij opstart, wat elke cyclus gebeurt, hoe hij "denkt",
hoe hij leert, en waar zijn grenzen liggen.

---

## 0. Wat het in de kern is
Geen black-box die "laag koopt en hoog verkoopt", maar een **beslis- en meetmachine**: hij vormt
per munt een onderbouwde mening, handelt alleen als het de kosten dekt, en **meet forward-only of
zijn eigen signalen kloppen** — zodat hij over tijd leunt op wat heeft gewerkt. Nu afgesteld als
**live scalper op Bitvavo** (crypto, EUR-paren).

## 1. De bouwstenen (bestanden)
| Bestand | Rol |
|---|---|
| `bot.py` | Start + de lus (elke 30s een cyclus). |
| `autopilot/config.py` | Leest `config.allin.yaml`, valideert streng (fout = stoppen, niet half draaien). |
| `autopilot/engine.py` | Het brein: de cyclus, kill-switches, order-uitvoering, portefeuille-adoptie. |
| `autopilot/factors.py` | De "ogen": grafiek → factoren → overtuiging. |
| `autopilot/strategies/adaptive.py` | De beslisser: kopen / verkopen / roteren. |
| `autopilot/factor_learning.py` | De leer-lus (betrouwbaarheid, FDR, drift, regime). |
| `autopilot/risk.py` | De rem: ordergrootte, stop-loss/take-profit, kill-switches. |
| `autopilot/exchange.py` | Bitvavo (echte orders) + papier-simulatie. |
| `autopilot/research/` (`composite`, `newsfeed`, `disclosures`, `onchain`) | Externe info. |
| `autopilot/database.py` | SQLite: posities, orders, equity, leer-tabellen, logs. |
| `autopilot/datasource.py` | Databron-kwaliteitspoort. |
| `autopilot/broker.py` / `ibkr.py` | Aandelen-fundament (skelet, nog niet aangesloten). |

## 2. Opstarten (eenmalig per run)
1. **Config laden + valideren.** Elke instelling wordt gecontroleerd; een typefout = directe stop.
2. **Mode bepalen — 3-slot-guardrail.** LIVE vereist álle drie: `mode: LIVE` in de config +
   `TRADING_MODE=LIVE` in `.env` + het bestand `I_UNDERSTAND_THE_RISKS.txt` in de map. Mist er
   één → geen echt geld (PAPER).
3. **Database openen** (`autopilot_allin.db`). De mode wordt vastgelegd; PAPER- en LIVE-historie
   worden nooit vermengd.
4. **Provenance** vastleggen: hash van de code + config, zodat elk resultaat herleidbaar is.
5. **Portefeuille overnemen (adoptie — alleen LIVE/SHADOW, eerste keer).** Hij leest je échte
   Bitvavo-wallet: EUR wordt cash, elke munt met een EUR-markt boven €5 wordt een positie met
   instapprijs = de huidige koers (P&L begint op 0). Dust wordt genegeerd.
6. **Benchmark bevriezen** — "wat als je gewoon had vastgehouden": de meetlat of de bot waarde
   toevoegt.
7. **Reconcile** — openstaande orders na een crash netjes afhandelen (nooit dubbel).

## 3. De cyclus — elke 30 seconden, stap voor stap
**(a) Veiligheidschecks.** Permanent gestopt (drawdown-kill)? Circuit-breaker-cooldown door
API-storingen? → cyclus overslaan.

**(b) Universe kiezen.** Uit de ~426 Bitvavo-EUR-markten de ~40 met genoeg volume (≥ €50k) en
krappe spread (≤ 1,5%), plus altijd BTC/ETH/SOL/MOODENG. Dit is "welke munten overweeg ik nu".

**(c) Data ophalen.** Voor die munten: 5-minuten-candles (koershistorie) + actuele prijzen.

**(d) Vermogen bepalen.** In LIVE **rechtstreeks uit je echte wallet** (EUR + alle munten × prijs).
Zo kijkt de kill-switch naar je échte accountwaarde, niet naar een interne boekhouding (dit
voorkomt de fantoom-kill-switch).

**(e) Kill-switches.**
- **Drawdown (hard):** vermogen ≥ 40% onder het startpunt → **alles verkopen + permanent stop**.
  De echte catastrofe-rem.
- **Dagverlies (zacht):** > 15% op één dag → **de-risk**: alleen de **verlies-posities** sluiten,
  winnaars houden, en **blijven zoeken** (geen bevriezing). Eén keer per dag.

**(f) Per-positie exits.** Per open positie: **−3% → stop-loss**, **+1,5% → take-profit**. Dit is
het scalp-mechanisme: kleine winst snel vastklikken, verlies snel afkappen.

**(g) Circuit breaker.** Munten met een te wijde spread deze seconde worden overgeslagen.

**(h) Factor-engine → overtuiging** (zie §4).

**(i) Leer-lus voeden** (zie §5).

**(j) Strategie beslist** (zie §6).

**(k) Research-overlay.** Nieuws wordt opgehaald en gaat in de overtuiging; het vuurt géén losse
orders af (`research.trade_signals: false`).

**(l) Orders uitvoeren** (zie §7).

**(m) Gedachtegang vastleggen.** Welke factoren, welke beslissing, waarom — opgeslagen (zichtbaar
in `status.py`/bot.html) + naar het portaal gepusht.

## 4. De factor-engine — hoe hij "denkt" (`factors.py`)
Per munt losse scores (elk −1…+1) uit de candles:
- **Momentum** — koers t.o.v. 20-punts gemiddelde.
- **Trend** — 10- vs 30-punts gemiddelde.
- **Volatiliteit** — rust = +, wild = −.
- **Afstand tot top** — diep onder de 60-punts piek = −.
- **Relatieve sterkte** — beter/slechter dan de mand.
- **Herstel** — ooit veel hoger, diep gezakt én nu weer opdraaiend = + (het "vallen-en-weer-opveren").
- **Nieuws** (extern) — een bullish/bearish kop over die munt.

Dan: **conviction = gewogen gemiddelde van alle factorscores**, waarbij elke factor zijn gewicht ×
zijn **geleerde betrouwbaarheid** krijgt. `confidence` = hoe eensgezind de factoren zijn × hoe
sterk. Stance bullish/neutraal/bearish bij ±0,15.

## 5. De leer-lus — de "self-learning" (`factor_learning.py`)
Elke cyclus:
1. Hij **legt vast** wat elke factor nú per munt voorspelt.
2. Na de horizon **rekent hij af**: deed de munt het beter/slechter dan de mand (excess, dus de
   markt-beta eruit), **ná kosten**?
3. Per factor: hit-rate, gemiddelde edge, effectieve steekproef.
4. **Tegen zelfbedrog:** overlap-correctie (minder "echte" waarnemingen dan ruwe), **FDR** (met
   veel factoren mag niet elke toevalstreffer een "ontdekking" heten), **Page-Hinkley drift** (edge
   die wegdraait → gewicht eruit), en **regime** (werkt het in bull én bear?).
5. Het resultaat — **betrouwbaarheid per factor** — wordt teruggevoerd als **gewicht** in §4.
   Factoren die aantoonbaar voorspellen gaan de overtuiging domineren; de rest zakt naar nul.
   Dát is "beter worden over tijd". Is er geen edge → leert hij correct om wéinig te doen.

De lus meet door **ook als hij niet handelt**: hij leert van elke munt die hij bekijkt.

## 6. De strategie — de beslisregels (`adaptive.py`)
Gesorteerd op overtuiging, per munt:
- **Houd ik 'm al?** Overtuiging ≤ −0,08 → verkopen (gekanteld). Anders houden (de +1,5%/−3%
  exits doen de rest).
- **Houd ik 'm niet?** Koop als: overtuiging ≥ koopdrempel **én** door de **kostenpoort**
  (`overtuiging × 0,08 > rondreis-kosten`) **én** er is cash **én** < 6 posities.
- **Rotatie (geen cash):** zit alles in munten? Verkoop de **zwakste holding** (eerst, om cash vrij
  te maken) en koop de **duidelijk sterkere kans** (verschil > 0,12). Dit is "verkoop om te kunnen
  kopen".

De **kostenpoort** is de bescherming tegen fees: pas handelen als de verwachte beweging de ~0,5%
fee + spread overtreft. Zo kan het ritme snel staan zonder dat fees je opeten.

## 7. Risk-engine + uitvoering (`risk.py`, `exchange.py`)
- **Risk-engine** bepaalt de ordergrootte (max 25% van je startkapitaal per positie), cap't altijd
  op je echte EUR-saldo, en dwingt de stops/kill-switches af. Een strategie kan die limieten
  **nooit** omzeilen.
- **Uitvoering:** intent eerst journalen (crash-veilig, idempotent) → order plaatsen. In LIVE via
  Bitvavo met de vereiste `operatorId` + een geldige UUID als `clientOrderId` → fill verwerken
  (positie + cash bijwerken) → **execution-log** (werkelijke kosten in basispunten: slippage + fee).
- **Taker vs maker:** nu taker (direct). Maker (postOnly, goedkoper) staat klaar maar is opt-in tot
  SHADOW de fill-kans bevestigt.

## 8. Externe informatie (`research/`)
- **Nieuws** (RSS, 10 bronnen): kop → coin + richting, deterministisch (geen black-box). Voedt de
  overtuiging.
- **Politici-trades** en **on-chain whale-flows**: dezelfde pijplijn; bronnen nu leeg (gratis
  politici-data dood; on-chain vereist een bron/sleutel).
- **Databron-kwaliteitspoort** (`datasource.py`): meet per bron latency/betrouwbaarheid — gratis
  data is pas te vertrouwen als het zich bewijst.

## 9. Veiligheid
Drie-slot-LIVE; API-key mag **nooit** Withdrawal; afstandsnoodstop via bot.html (`emergency_stop`);
stop-loss/take-profit per positie; dag-de-risk; harde drawdown-stop; circuit breaker op spread; en
een leeg/onleesbaar saldo bricket de bot niet meer.

## 10. Eerlijke grenzen
- Begrijpt **geen fundamenten/verhaal** achter een munt — alleen grafiek + trefwoord-nieuws.
- **Geen voorspelling uit historisch nieuws** (niet backtestbaar; zou de afloop al kennen = leakage).
- Op een thuis-pc met taker-fees **verlies je de seconden-race** van profs; vandaar 30s + kostenpoort,
  geen echte HFT.
- De grote: **nog geen bewezen edge.** De machinerie is correct; of de scalp-trefkans de fees
  verslaat, moet forward blijken. Dat is het eerlijke uitgangspunt — geen geldmachine, maar een
  systeem dat edges zoekt en ze meedogenloos uitschakelt zodra ze verdwijnen.

## 11. Hoe je het afleest
`py status.py --db autopilot_allin.db --balance` toont: equity + P&L, open posities, laatste orders,
**execution-kosten (bps)**, **databron-kwaliteit**, en onderaan de **factor-/wallet-validatie** —
daar zie je per factor of hij iets leert (hit-rate, netto edge na kosten, status *observeren/actief*).

---

*Afstellingen staan in `config.allin.yaml`; achtergrond en keuzes in `DECISIONS.md`,
`BITVAVO_ALPHA_ENGINE.md` en `KILL_CRITERIA.md`.*
