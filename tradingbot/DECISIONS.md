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

## D23 — Zichtbare gedachtegang + multi-factor beslissingslaag (streng gescheiden)

De bot maakt zijn beslissing per cycle expliciet en leesbaar op slagio.nl/bot.html:
`factors.py` splitst per coin de afweging op (momentum, trend, rust/risico,
afstand-tot-top, relatieve sterkte), `decisions.py` vat de netto-uitkomst samen
(kopen / verkopen / herbalanceren / cash / wachten) mét de reden — óók waarom er soms
niets gebeurt (cash aanhouden, net geherbalanceerd, door risk engine geblokkeerd). Elke
cycle wordt dit in `decision_log` bewaard en via `build_payload` (`thinking`) getoond.
Dit verandert geen enkele order; het is puur uitleg, dus geen acceptatietest nodig.

Bewuste, strenge scheiding voor de gevraagde uitbreiding naar nieuws, wereld/macro en
"smart money" (bv. gemelde trades van bekende personen): die komen als **externe
factoren** uit gestructureerde events (`research_events.json`, veld `kind`) en **kleuren
alleen de gedachtegang**. Ze plaatsen nooit rechtstreeks een order — hooguit een VOORSTEL
door de risk engine (bestaande research-laag). Reden dat ze niet zomaar mogen sturen:
**leakage** — een model getoetst op oud nieuws kent de afloop al, dus zulke signalen zijn
niet backtestbaar, alleen live vooruit. Op de UI staan ze met ◇ gemarkeerd als
forward-only. Promotie tot echte order-invoer vereist het pre-registratieprotocol in
`experiments/2026_multifactor_decisions.md` (o.a. ≥100 observaties/bron, kosten-nette
out-of-sample hit-rate, geen schade aan de drawdown). Zo krijgt de gebruiker de gevraagde
brede afweging én blijft de discipline (AI stelt voor, beslist nooit) overeind.

**Vervolg (leerlus + betrouwbaarheids-gewogen afweging).** Niet elke factor verdient
hetzelfde vertrouwen. `factor_learning.py` rekent elke factor-observatie ná een horizon
(24u) af tegen de werkelijke koersbeweging en bouwt per factor een **precisie** op
(Bayesiaanse krimp naar 0,5, tabellen `factor_obs`/`factor_stats`). Die geleerde
betrouwbaarheid schaalt het **effectieve gewicht** van de factor in de gedachtegang: een
factor die het structureel mis heeft, vervaagt vanzelf. Dit is strikt forward-only (geen
leakage) en raakt bewust NIET de order-logica van de getoetste prijsstrategieën — het
maakt alleen de uitleg en de gated research-voorstellen slimmer. Bovenop de conviction
komt een **confidence** (eensgezindheid × betrouwbaarheid), een Decision-Intelligence-
telling ("N factoren bekeken: x positief / y negatief / z neutraal"), een "top redenen"-
lijst en een expliciete **"waarom geen trade?"**. Externe factoren worden bovendien
**context-gedempt**: bullish nieuws telt minder als de coin al fors is opgelopen (RSI +
afstand boven het gemiddelde). De sample-gate (max. 1 observatie-batch/uur) houdt de
leertabellen klein, ook voor de 1-minuut-bot.

## D24 — Edge = excess na kosten, met significantie-drempel (ruis ≠ signaal)

Twee correcties op de factor-leerlus die bepalen of het meetsysteem klopt vóór er
maanden data in gaan. (1) **Opportunity cost:** de edge is niet meer "ging de coin
omhoog?" maar de **excess t.o.v. de mand** (koersbeweging in factor-richting min de
gemiddelde beweging van alle waargenomen coins, zelfde venster), ná fees+spread+slippage.
Een factor die alleen beta rijdt scoort daardoor ~0; alleen relatieve voorspelkracht
telt. Gevolg: met één coin is de excess per definitie 0 (geen mand om je tegen te meten) —
correct, want cross-sectionele skill vereist ≥2 coins. (2) **Significantie:** we houden nu
ook de variantie bij (`sum_edge2`) en berekenen een standaardfout. Het **gewicht wijkt
pas van 1,0 af als de conservatieve ondergrens `mean − Z·SE − kosten` (Z=1,64, n≥30) de
juiste kant van nul ligt** — niet op basis van het gemiddelde alleen. Zo wordt een
positief-lijkende maar ruizige of dun-bemeten factor als *onbewezen* behandeld i.p.v.
opgetild. Statussen: observeren → onbewezen → actief / uitgeschakeld. De vooraf
vastgelegde drempels (ook de zwaardere lat voor échte order-invoer) staan in
`experiments/edge_criteria.md`.

Bewust benoemd (policy-dependence): de factor-statistiek is **observationeel en
universe-breed** — observaties worden voor alle gevolgde coins vastgelegd, los van wat de
bot koopt. Een hoger gewicht verandert dus de beslissingen maar niet de meting eronder;
dat breekt de zelfbevestigende lus. Restbeperking: de keuze van het universe en de
sample-momenten blijven beleid.

## D25 — Niet-stationariteit: overlap-correctie + regime-conditionering

De significantie-toets uit D24 nam impliciet iid/stationaire data aan; crypto is dat niet.
Twee correcties, opnieuw omdat het meetsysteem moet kloppen vóórdat er maanden data in
gaan. (1) **Overlap → effectieve steekproef:** we meten elk uur maar rekenen over 24u af,
dus vensters overlappen sterk en zijn niet onafhankelijk. De standaardfout gebruikt nu een
effectieve n ≈ n × (sample/horizon); zonder dit 'bewijs' je een edge veel te makkelijk.
(2) **Regime-conditionering:** elke observatie krijgt bij vastlegging het marktregime
(bull/bear/chop) mee — dit moet vooraf, want achteraf niet te reconstrueren — en een factor
is pas *actief* als zijn netto-edge in meerdere regimes standhoudt. Leunt hij op één regime
→ status *eenzijdig*, geen hoger gewicht. Nieuwe tabel `factor_stats_regime` + `regime`-kolom
op `factor_obs`. Drempels en de eerlijke grens (regime-stabiel = noodzakelijk, niet
voldoende; markt is adaptief) staan in `experiments/edge_criteria.md`; rolling-window,
regime-transities en allocatie-impact zijn expliciet geparkeerd (roadmap S1–S3).

## D26 — S++ laag: drift-detectie, FDR, counterfactuals, reproduceerbaarheid

Vier gerichte stappen richting een zelfcorrigerend onderzoeksplatform, elk bewust
deterministisch en zichtbaar op het dashboard (zie SPP_ROADMAP.md). (1) **Concept-drift**
(Page-Hinkley, tabel `factor_drift`): bewaakt online of een edge kantelt; een drift-down
haalt het opwaartse gewicht er direct af — herkennen binnen dagen i.p.v. maanden.
(2) **Multiple-hypothesis-correctie** (Benjamini-Hochberg, `apply_fdr`): bij veel factoren
zijn er altijd toevallig-significante; alleen wie de FDR overleeft blijft *actief*.
(3) **Counterfactual reasoning** (`factors.counterfactuals`): per beslissing welke factor
doorslaggevend was ("zonder macro was de overtuiging +12 i.p.v. −3"). (4) **Reproduceer­-
baarheid** (`provenance.py`): code-hash (over de eigen .py-bestanden, werkt óók vanuit een
ZIP) + config-hash, gestempeld bij startup en getoond in de dashboard-header.

Bewust NIET gebouwd (blijft van tafel, past niet bij de discipline of nog niet zinvol):
LLM die handelt, sentiment-scraping, extra indicatoren, black-box-net. Portfolio 2.0 is de
lopende vol_target-allocatie; execution-quality-analytics wacht op SHADOW (in PAPER zou het
enkel de modelslippage echoën); multi-source datalake, meta-learning-volledig,
research-automation en full observability staan met prioriteit op SPP_ROADMAP.md.

## D27 — Zelfdiagnose + categorie-1/2-gate (precisie ≠ edge)

Twee dingen uit de tweede gap-review. (1) **Zelfdiagnose** (`health.py`): de bot bewaakt
zijn eigen gezondheid — hartslag, kill-switch, API/circuit-breaker, leerlus-voeding,
concept-drift-alarmen, beslis-zekerheid-trend en database-groei — en meldt problemen zelf
op het dashboard (paneel "Zelfdiagnose", ernstigste check bepaalt de kleur). Puur afgeleid
van bestaande state; reliability/self-checks, geen extra proces of databron. Dit adresseert
een terugkerende zorg ("zijn de bots vastgelopen?") en is de eerste laag van reliability
engineering. (2) **Governance-gate:** elk nieuw onderdeel wordt gelabeld **categorie 1**
(vergroot de kans op een échte informatievoorsprong) of **categorie 2** (maakt bestaand
onderzoek nauwkeuriger). Vrijwel alles — inclusief drift/FDR/counterfactual/provenance/
zelfdiagnose — is categorie 2. Dat is waardevol (voorkomt zelfmisleiding) maar creëert geen
edge; categorie-2-werk wordt begrensd zolang er geen kandidaat-edge is. De enige echte
categorie-1-hefbomen (nieuwe databronnen, research-automation) staan bewust laag: duur,
foutgevoelig, en pas zinvol als het bestaande onderzoek is uitgemolken. SPP_ROADMAP.md is
herrangschikt naar dit doel (retail-Bitvavo, klein kapitaal): portfolio → execution →
reliability → lineage → meta-learning → calibration → Bayesian → research-automation →
datalake. Multi-source datalake bewust verlaagd: meer bronnen ≠ betere research.

## D28 — Nieuws-/event-bot (conditie B) — en het moratorium toegepast op de rest

Voorstel: bots 5/6/7 (regime-brain, execution-auditor, nieuwsbot) + conflict-engine.
Langs de A/B/C-poort blijft er precies één over. **Gebouwd — nieuwsbot (conditie B, nieuwe
niet-prijs informatiebron):** basisstrategie `hold` (geeft zelf geen signaal) + de bestaande
research-laag, zodat álle trades uit gestructureerde events komen (`research_events.json` →
gating → risk engine). Forward-only (nieuws is niet backtestbaar door leakage), pre-registratie
in `experiments/2026_news_event_bot.md`, gedachtegang al zichtbaar op het dashboard. Config
`config.news.yaml`, strategie-literal uitgebreid met `hold`.

**Niet gebouwd (moratorium):** een aparte regime-bot (het regime wordt al bepaald én per
observatie vastgelegd — categorie 2/measurement); een execution-auditor (in PAPER echoot de
fill enkel de modelslippage → pas zinvol in SHADOW/LIVE); een conflict-engine (decision-
infrastructuur, geen nieuwe informatie — de risk engine + research-gating vervullen de
veto-rol al). Deze staan met reden op SPP_ROADMAP.md. Zo blijft de discipline overeind:
alleen de stap die écht nieuwe informatie test mag erdoor.

## D22 — Meerdere bots naast elkaar + seed-portefeuille

Om strategieën eerlijk te vergelijken kan de bot met `--config` draaien; elke config
heeft een `bot_id` en krijgt zo een eigen database (`autopilot_<bot_id>.db`) en logmap.
Meerdere processen draaien dus onafhankelijk naast elkaar. Het webportaal is
`bot_id`-bewust: `bot_state`/`bot_commands` hebben (user_id, bot_id) als sleutel, en
`bot.html` toont een schakelaar tussen bots. Een noodstop richt zich op de getoonde bot.

`seed`-config laat een PAPER-bot starten vanaf een bestaande portefeuille (EUR-cash +
holdings in EUR-waarde → omgezet naar hoeveelheden tegen de prijs bij start; instapprijs
= die prijs, dus P&L begint op 0). Alleen PAPER; in LIVE geldt het echte saldo. Zo
kunnen twee bots vanaf exact hetzelfde startpunt vergeleken worden.

## D21 — Cross-sectional momentum als eerste échte factor-hypothese

De single-asset strategieën (dca/momentum/grid) voorspellen elk hun eigen tijdreeks
en verloren allemaal op 5 jaar data. `cross_sectional` test een fundamenteel andere
klasse: rangschik het hele universe op relatieve sterkte en houd de sterkste N
(long-only rotatie; Bitvavo is spot, dus geen short). Volledig deterministisch en
backtestbaar zonder leakage — precies waarvoor het platform is gebouwd.

Bewuste keuzes: gelijk gewicht (kapitaal/top_n) per slot; exit via rotatie én de
risk-engine-stops; rebalance op vast interval. Voor de backtest een aparte
`config.basket.yaml` met een mand coins en ruimere risk-limieten, zodat de risk
engine de factor niet platdrukt (top_n posities moeten tegelijk kunnen bestaan);
de drawdown-kill-switch blijft de ultieme rem. Survivorship bias is niet te
elimineren — de mand bevat deels overlevers; daarom telt alleen de vergelijking
met buy-and-hold van diezelfde mand. `backtest.py` slaat bij een mand een
ontbrekende/delistte coin over in plaats van af te breken.

## D20 — Webportaal: asymmetrische afstandsbediening (wel stoppen, nooit starten)

Het portaal (slagio.nl/bot.html) hergebruikt de bestaande Supabase met
Auth + Row Level Security; de bot pusht state en pollt een commando-tabel — er
staat geen poort open op de bot-machine en de Bitvavo-keys komen nooit in het
portaal-pad. Het enige toegestane commando is `emergency_stop` (afgedwongen met
een CHECK-constraint in de database, niet alleen in code). Redenering: op afstand
stoppen is safety-positief, op afstand starten/halt-opheffen is safety-negatief
en blijft exclusief voor de machine zelf. Bij een gestolen wachtwoord is het
worst-case scenario dus: meekijken + de bot stoppen. Portal-fouten zijn
best-effort en kunnen de trading loop per constructie niet breken.
