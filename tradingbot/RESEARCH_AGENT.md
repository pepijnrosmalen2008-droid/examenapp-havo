# De research-laag — ontwerp, grenzen en eerlijke verwachtingen

Dit document beschrijft de laag die de bot van een *deterministische execution-bot*
naar een *research-gestuurde agent* kan laten groeien: een AI die nieuws, macro en
sentiment verwerkt tot handelsvoorstellen. Lees dit **voordat** je die kant op bouwt —
het legt uit wat wel en niet kan, en waarom de architectuur is zoals hij is.

## Het uitgangspunt: de veilige kern blijft ongemoeid

```
   nieuws · X/Reddit · macro-kalender · on-chain · CEO/politiek nieuws
                              │
                    ┌─────────────────┐
                    │  Research-agent │   feiten → welke coin → impact →
                    │  (voorstellen)  │   zekerheid → horizon
                    └─────────────────┘
                              │  ResearchSignal (met confidence)
                    ┌─────────────────┐
                    │  gating         │   confidence ≥ min_confidence?
                    └─────────────────┘
                              │  handels-Signal
                    ┌─────────────────┐
                    │  RISK ENGINE    │   ← ONGEWIJZIGD. De laatste beslisser.
                    │  (blokkeert/    │     position sizing, kill switches,
                    │   verkleint)    │     portfolio heat, whitelist, breakers
                    └─────────────────┘
                              │
                           Bitvavo
```

De research-agent **stelt alleen voor**. Hij plaatst nooit zelf orders, wijzigt nooit
de risk engine of de code, en kan de limieten niet omzeilen. Elke bestaande
veiligheidsgarantie blijft gelden — een AI-voorstel wordt exact zo behandeld als een
strategie-signaal: het gaat door `risk.evaluate()` en wordt geblokkeerd of verkleind.
(Bewijs: de tests `test_research_buy_passes_through_risk_engine` en
`test_research_buy_still_blocked_by_kill_switch`.)

## Wat er nu al staat (deze commit)

- **`autopilot/research.py`** — de interface (`ResearchAgent`, `ResearchSignal`), de
  gating, en een **deterministische referentie-agent** (`rulebased`) die
  gestructureerde events uit een lokaal JSON-bestand leest. Geen LLM, geen externe
  API's — dus volledig testbaar. Dit is tegelijk de manier waarop je nú al handmatig
  een onderbouwd voorstel kunt invoeren.
- **`autopilot/universe.py`** — coin-universe selectie: van de ~180 Bitvavo-EUR-markten
  automatisch de liquide, krap-gespreide, actieve markten kiezen (jouw wens "alle
  coins", maar verantwoord). Deterministisch en getest.
- Beide staan **uit** in `config.yaml` tot je ze bewust aanzet.

## De meerlaagse pijplijn (waarom niet "nieuws → LLM → BUY")

Eén LLM-call die direct een order bepaalt is niet toetsbaar, niet reproduceerbaar en
reageert op ruis. De agent moet in plaats daarvan gescheiden stappen doorlopen, elk
apart te loggen en te controleren:

1. **Feitextractie** — wat is er feitelijk gebeurd? (niet: "is dit bullish?")
2. **Asset-mapping** — welke coin(s) raakt dit, en waarom?
3. **Impact & richting** — positief/negatief, en hoe groot?
4. **Zekerheid** — hoe betrouwbaar is de bron/inschatting? (0..1)
5. **Horizon** — minuten, dagen of weken?
6. **Gating** — pas boven `min_confidence` wordt het een voorstel.
7. **Risk engine** — en pas daarna eventueel een (verkleinde) order.

Een echte LLM-agent implementeert dezelfde `ResearchAgent`-interface en levert dezelfde
`ResearchSignal`-output; alleen stap 1–5 zitten dan in het model in plaats van in een
JSON-bestand. De gating en de risk engine eromheen veranderen niet.

## De drie harde grenzen — lees dit echt

### 1. Nieuws lezen levert niet vanzelf een edge op
Tegen de tijd dat een RSS-feed of X-post bij je bot is, hebben professionele partijen
met directe feeds en co-locatie al gehandeld. Dat een model het nieuws *begrijpt*
betekent niet dat er nog rendement te halen is. De lat ligt hoog; ga er niet vanuit
dat "de Aik leest het nieuws" = winst.

### 2. Je kunt een nieuws-agent niet eerlijk backtesten (leakage)
Dit is de belangrijkste technische muur. Vraag je een LLM "wat betekent dit nieuws van
maart 2022?", dan *weet het model al wat er daarna gebeurde* — het is op die toekomst
getraind. Elke historische backtest is besmet met hindsight en oogt kunstmatig briljant.

**Gevolg voor je validatie:** de snelle route (backtest → walk-forward → Monte Carlo)
die je voor DCA/momentum/grid gebruikte, werkt **niet** voor de nieuws-agent. Je kunt
hem alleen eerlijk toetsen door hem **vooruit** te laten lopen: PAPER en daarna SHADOW,
in realtime, over weken tot maanden. Dat kost kalendertijd, geen 4 minuten.
Deterministische onderdelen (universe-filter, technische signalen) blijven wél gewoon
backtestbaar; alleen de nieuws-/sentiment-oordelen van het model niet.

### 3. Het is doorlopend werk met kosten en storingsbronnen
Nieuws-API's, LLM-calls, 24/7 infra, rate limits, veranderende modellen. Elke externe
bron is een extra faalpunt — daarom is de research-laag, net als Telegram en het
webportaal, **best-effort**: valt hij weg, dan handelt de bot gewoon door op zijn
deterministische strategieën, en breekt de trading loop nooit.

## Als je een echte LLM-agent gaat bouwen — de volgorde

1. Implementeer een `LLMResearchAgent(ResearchAgent)` die de 6 stappen doorloopt en
   `ResearchSignal`s teruggeeft. Houd feitextractie los van oordeel.
2. Voed hem alleen bronnen die je mag gebruiken (let op API-voorwaarden van X/Reddit/etc.).
3. Laat hem **alleen voorstellen**; verander niets aan de gating of risk engine.
4. Draai maanden PAPER, dan SHADOW. Vergelijk met buy-and-hold én met de bot zónder
   research-laag — voegt de AI aantoonbaar iets toe, of is het duurdere ruis?
5. Pas daarna, met dezelfde voorzichtigheid als altijd, eventueel LIVE — klein.

## Eerlijke slotsom

Deze laag maakt de bot *slimmer in het verwerken van informatie*, niet automatisch
*winstgevender*. Of gestructureerde nieuws-/sentimentanalyse een duurzaam voordeel
oplevert, moet — net als bij elke strategie — empirisch blijken, en de leakage-grens
maakt dat bewijs juist moeilijker, niet makkelijker. De winst die je hier sowieso
boekt is architectonisch: je kunt met AI experimenteren zonder ooit je veilige,
deterministische kern in gevaar te brengen.
