# Pre-registratie — Experiment: politici-transactie-bot (openbaar gemelde trades)

**Vastgelegd vóór de run. Deze criteria worden niet versoepeld na het zien van het
resultaat; een wijziging wordt hieronder gelogd met datum en reden.**

## Waarom dit het moratorium mag passeren
Conditie **B**: dit voegt een **nieuwe, niet-prijs informatiebron** toe (wat politici
verhandelen), naast de nieuws-bron. Het is geen nieuwe prijs-indicator (dat zou categorie 2
zijn). De gebruiker vroeg er expliciet om, met een scherpe en juiste correctie: volg wat ze
**verhandelen** (openbaar gemeld), niet wat ze **aankondigen**.

## De legaliteit, expliciet
- **Wel:** handelen op **openbaar gemelde** transacties. De STOCK Act verplicht leden van het
  Amerikaanse Congres hun beurstransacties publiek te melden (Periodic Transaction Reports).
  Die meldingen zijn openbaar; gratis datasets (House/Senate Stock Watcher) ontsluiten ze.
  Handelen op publieke informatie is legaal en is géén front-running/voorkennis.
- **Niet:** anticiperen op wat iemand *gaat* aankondigen, of op niet-openbare informatie. Zo'n
  feed bestaat niet legaal en wordt niet gebouwd. Het "patroon tussen wat ze zeggen en wat ze
  doen" dat de gebruiker zoekt, ontstaat vanzelf in de meting: als hun gemelde trades vóór
  koersbewegingen uitlopen, toont het per-politicus track record dat — ná de meld-vertraging.

## De harde beperking: dit platform is crypto-only
Bitvavo verhandelt alleen crypto (EUR-paren). Een gemeld aandeel zonder crypto-link (NVDA, TSLA)
kunnen we hier niet naspelen en wordt **overgeslagen**. Alleen crypto-verhandelbare posities
worden vertaald naar een BTC/ETH-signaal, via een transparante tabel (`autopilot/disclosures.py`):
- spot-BTC-ETF's (IBIT, FBTC, GBTC, …) en BTC-proxy-aandelen (MSTR, MARA, RIOT, COIN, …) → **BTC**;
- spot-ETH-ETF's (ETHA, ETHE, FETH, …) → **ETH**.
Purchase → +1 (bullish), Sale → −1 (bearish), Exchange/onbekend → genegeerd (dubbelzinnig).
Dit is een smalle brug: pure aandelenkeuze valt weg. Dat is een eerlijke grens, geen bug.

## Wat de bot is (en niet is)
- **Wel:** een proactieve, meldings-gedreven bot. Basisstrategie `hold` (geeft zelf geen
  signaal); hij haalt zelf de publieke datasets op, mapt crypto-relevante meldingen naar events
  → `to_trade_signals` → risk engine. Elke melding vuurt één keer als voorstel en blijft daarna
  als factor meetellen (TTL 7 dagen). Elke politicus krijgt een **eigen factor-sleutel**
  (`smart_money:<naam>`), zodat per persoon gemeten wordt.
- **Niet:** geen LLM, geen scraping van niet-openbare bronnen, geen aandelenorders (kan niet op
  Bitvavo). Alleen de wettelijk verplichte, openbare meldingen.

## De harde grens: forward-only
Deze meldingen zijn **niet zinvol backtestbaar** met dit platform: de meld-vertraging en het
overnemen van historische datasets introduceren leakage en survivorship-effecten. Beoordeling
gebeurt uitsluitend **live, vooruit**, in PAPER, via de bestaande forward-only leerlus (excess
t.o.v. de mand, na kosten, overlap-gecorrigeerd, per regime, FDR- en drift-bewaakt).

## Hypothese
Openbaar gemelde politici-transacties hebben, ná de meld-vertraging én ná kosten en los van de
markt-beta, geen vanzelfsprekende voorspellende waarde voor crypto. We geloven het pas als de
forward-data het per politicus toont.

## Acceptatiecriteria (forward, om van "uittesten" naar "serieus nemen" te gaan)
Per politicus/entiteit (`smart_money:<naam>`):
1. **n ≥ 100** afgerekende observaties (overlap-gecorrigeerde effectieve n telt);
2. **Netto excess-edge > 0** met de FDR-correctie overleefd (status *actief*, niet *onbewezen*) —
   FDR corrigeert hier zwaar, want er zijn veel politici (veel gelijktijdige hypotheses);
3. **Regime-stabiel** (niet gedragen door één regime), en géén actieve drift-down;
4. **Bot-niveau:** over de looptijd geen grotere max drawdown dan de buy-and-hold van dezelfde
   mand, en een positieve netto-P&L na kosten.

Haalt een politicus dit niet → **verworpen voor order-invoer**, genoteerd in
REJECTED_HYPOTHESES.md. De bron mag blijven bestaan als *uitleg* in de gedachtegang.

## Verwachting (eerlijk)
Waarschijnlijk zwak of afwezig, om drie redenen: (a) de meld-vertraging (tot ~45 dagen) betekent
dat het "nieuws" al in de koers zit tegen de tijd dat wij het zien; (b) het signaal is breed
bekend en al gearbitreerd (er bestaan zelfs ETF's die het naspelen); (c) de crypto-brug is smal —
weinig politici melden crypto-ETF's, dus n groeit traag. Het meest waarschijnlijke resultaat is
weinig trades en het reproduceerbaar zichtbaar maken dat deze bron onder deze randvoorwaarden
geen overtuigende edge gaf. Ook dat is een geldige, waardevolle uitkomst.

## Wat NIET gebouwd is (en waarom)
- **Aandelen-uitvoering.** Vereist een compleet andere broker/API buiten Bitvavo, een aparte
  rekening en kapitaal, en een eigen risk/kosten-model. Buiten scope van dit crypto-platform.
- **Kapitaalgewicht (allocation).** De bron komt binnen als PROBE (observeren), zonder edge-
  gewogen allocatie, precies zoals het moratorium eist. Evidence Allocation v2 blijft gated tot
  ≥1 factor de status *actief* haalt.
- **Individuele-politicus-clustering / copy-trade-ranking.** Decision-infrastructuur (categorie 2)
  bovenop een bron die zich nog niet bewezen heeft. Eerst bewijs, dan pas verfijning.

## Bekende beperkingen (bewust benoemd, niet als opgelost gepresenteerd)
- **Meld-vertraging = ingebouwde leakage tegen ons.** We zien de trade weken later; de edge (als
  die er ooit was) kan al weg zijn. De meting rekent dit eerlijk af — het maakt bewijs móéilijker,
  wat correct is.
- **Datasetafhankelijkheid.** De publieke datasets kunnen van vorm veranderen of stilvallen; de
  fetcher degradeert dan stil (geen events) en breekt de cycle niet. Veldnamen worden tolerant
  gelezen, maar een structurele wijziging vergt onderhoud.
- **Smalle crypto-brug.** Zie boven: pure aandelenkeuze valt weg; alleen ETF/proxy-meldingen
  tellen. n groeit daardoor traag — criterium 1 (n ≥ 100) kan lang duren.
