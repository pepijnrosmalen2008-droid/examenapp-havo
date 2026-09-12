# Bitvavo Alpha Engine — de maximale versie, en de eerlijke grenzen

Dit document legt de strategische fork vast die in september 2026 is besproken: de bot niet
langer opvatten als "voorspel de markt", maar als **kapitaalallocatie-machine die overal op
Bitvavo zoekt waar informatie, timing of executie een paar basispunten statistisch voordeel
geeft — en elke edge meedogenloos uitschakelt zodra hij verdampt.** Extractie boven voorspelling.

Het is bewust géén bouwopdracht in één keer. Het is de kaart: wat kan, wat niet, en — cruciaal —
*waar wij structureel zwak staan ook al kán het technisch.* Elke tak die het haalt, komt binnen
als vooraf-geregistreerde PROBE onder het bestaande moratorium (forward-only, netto na kosten,
FDR- en drift-bewaakt). Geen enkele tak krijgt kapitaalgewicht vóór bewijs.

## De reframe (overgenomen)
Niet "gaat ETH omhoog?" maar "waar wordt kapitaal tijdelijk verkeerd geprijsd, en kan ik daar
een stukje van afromen zonder BTC correct te hoeven voorspellen?" Casino-mentaliteit: EV > 0,
duizenden keren herhaald, en voortdurend toetsen of de edge nog bestaat.

## Wat Bitvavo technisch wél biedt (correctie op eerder "spot-only = dood")
limit / market / stop-loss / take-profit orders, IOC / FOK, **postOnly** (bewust liquidity
toevoegen), een WebSocket API en zelfs een FIX-endpoint. Dat opent op één venue: execution-
optimalisatie, driehoeks-arbitrage (BTC/EUR ↔ ETH/EUR ↔ BTC/ETH), en relative-value-rotatie.
"Spot-only" betekent dus niet "alleen kopen en vasthouden".

## De harde correctie: wáár draait deze bot fysiek?
Op een thuis-pc, via een consumenten-internetverbinding, op een poll-schema, tientallen tot
honderden milliseconden (jitterig) van de matching engine. Dat herordent de ranking aan de top.

**Microstructuur-, executie- en driehoeks-alpha leven op de milliseconde-tot-seconde-schaal en
zijn een race tegen professionele market makers die co-located naast de engine staan (FPGA/colo)
en het orderboek eerder zien dan ons pakket de router verlaat.** In die race is een thuis-pc niet
het roofdier — het is de liquiditeit die wordt afgeroomd. "Wat gebeurt er in het orderboek vlak
vóór een beweging?" — tegen de tijd dat wij het zien en handelen, is de beweging al aan een
snellere partij gebeurd.

Gevolg: de latency-gevoelige takken zijn waar wij **structureel het zwakst** staan, niet het
sterkst. De trage takken (on-chain flows, informatie-latency op minuten-tot-uren-schaal, event-
driven) zijn waar een thuis-bot kán meedoen, want daar wint discipline en interpretatie, niet
microseconden.

## Ranking — eerlijk, voor ónze opstelling (niet voor een colo-desk)
| Component | Bitvavo technisch | Voor thuis-pc + poll | Verdict |
|---|---|---|---|
| Orderbook-microstructuur als **alpha** | ✅ | ❌ we zijn de prooi | Geen alpha-bron voor ons |
| Execution-**kostenreductie** (postOnly/limit i.p.v. market) | ✅ | ✅ | Bouwen — als *laag onder* strategieën, niet als alpha |
| Driehoeks-arbitrage | ✅ | ⚠️ | Bouw de **observer**; verwacht "dood na kosten" |
| On-chain whale-flows | ✅ | ✅ | Frontier — probe (bot 7) |
| Wallet-reputatie | ✅ | ✅ | Afgeleide van on-chain, per-wallet factor-sleutel |
| Informatie-latency | ✅ | ✅ meetbaar | Meet wáár we wel/niet kunnen spelen |
| Event-driven | ✅ | ✅ | Zelfde forward-only pijplijn (nieuws/politici bestaan al) |
| Relative-value / rotatie / momentum / mean-reversion / cash | ✅ | ✅ | Hebben we / goedkoop uit te breiden |
| Tokenomics-screen | ⚠️ alleen listing-universe | ✅ beperkt | Screen, geen order zonder listing |
| Market-making | ⚠️ kapitaalintensief | ⚠️ | Bedrijf, geen bot-feature — buiten scope |
| Funding-arb / futures-basis / liquidation-hunting | ❌ geen derivaten | ❌ | Onmogelijk op Bitvavo spot |
| Cross-exchange arb | ❌ één venue/keys | ❌ | Vereist multi-venue infra + kapitaal |

## De kosten-drempel, concreet (waarom veel "arb" dood is)
Onze geconfigureerde kosten: **taker ~0,25%, maker (postOnly) ~0,15%**, plus spread en slippage.
- Een driehoek van 3 taker-legs = **~0,75%** netto drempel (of ~0,45% all-postOnly, mét fill-risk).
  Op liquide BTC/ETH/EUR overschrijdt de netto-discrepantie dat vrijwel nooit, en als het gebeurt
  is het weg vóór onze poll 3 sequentiële orders verstuurt. → observer eerst, order pas na bewijs.
- Execution-winst maker-vs-taker ≈ **0,10% + halve spread** per trade. Dat is echt geld, maar het
  is *de tol niet onnodig betalen* — geen alpha, geen tegenpartij verslaan.

## Runtime-consequentie (niet weg te configureren)
De huidige bots pollen elke ~15 minuten. Microstructuur/executie/driehoek vereisen een
**fundamenteel andere runtime**: een persistente WebSocket-verbinding en een sub-seconde-lus.
Dat is een aparte engineering-stap, geen config-vlag. De trage probes (on-chain/event) passen wél
in de bestaande poll-runtime.

## De grenzen die niet worden overschreden
Marktmanipulatie, wash trading, front-running van niet-openbare orders, insider trading,
pump-and-dump: niet gebouwd. Geen edge, alleen juridisch risico. Alle informatiebronnen zijn
publiek; alle "smart money"-signalen komen uit openbaar gemelde of on-chain zichtbare data.

## De reality check als productthese (niet als disclaimer)
Er is geen aangetoonde AI-architectuur die duurzaam, cross-regime, ná kosten positieve alpha
levert. Daarom is het product géén geldmachine, maar een **allocatiesysteem dat kandidaat-edges
ontdekt, ze door de teststraat jaagt, en de meeste laat bewijzen dat ze dood zijn** bij onze
kosten en latency. Dat de meeste probes "onbewezen" blijven, is de correcte uitkomst, niet een bug.

## Voorgestelde bouwvolgorde (elk = eigen pre-registratie, probe-status)
1. **Execution-kostenlaag** — postOnly/limit-keuze onder de bestaande strategieën (kostenreductie,
   geen nieuwe informatiebron; laagste risico, direct nut). ✅ gebouwd.
2. **Driehoeks-observer** — meet netto-discrepantie na kosten/latency; verwacht falsificatie. ✅ gebouwd.
3. **On-chain money-flow probe (bot 7)** — whale/exchange-flow + wallet-reputatie, per-entity
   factor-sleutel, forward-only. De echte frontier. ✅ gebouwd.
4. **Meetlaag hard maken** — vóór meer alpha. ✅ gebouwd (zie hieronder).
5. **Opportunity Auction / capital allocator** — bestaat in embryo (Evidence Allocation v1/v2);
   blijft gated tot ≥1 factor status *actief* haalt.

## Correctie: maker_first is GEEN gegarandeerde besparing
De eerste versie zette `maker_first` aan met de claim "bespaart altijd de taker−maker-fee".
Dat is fout: een maker-order die **niet vult** terwijl de markt wegloopt kan economisch slechter
zijn dan een taker. En in PAPER (punt-prijs, geen orderboek/queue) is de **fill-kans niet eerlijk
te simuleren** — het optimistische model deed alsof elke maker vulde, wat de PAPER-resultaten met
precies de "besparing" naar boven vertekende. Daarom staat `maker_first` nu **uit** op alle bots
(taker = eerlijk en conservatief in PAPER); de capability blijft opt-in. De juiste metric is
**netto gerealiseerde P&L per opportunity, inclusief fill-kans**, en die wordt pas in SHADOW/LIVE
(waar postOnly echt in het boek rust) gemeten. Kill-criterium in KILL_CRITERIA.md §1.

## Stap 4 — de meetlaag (gebouwd)
Vóór er meer alpha bij komt, is de meting hard gemaakt:
- **Execution-log** (`execution_log`-tabel; `db.log_execution/execution_summary/recent_executions`):
  per fill de werkelijke kosten — referentieprijs vs fill-prijs, slippage + fee in **basispunten**,
  stijl en fill-vlag. In SHADOW/LIVE registreert dit echte maker-fills/misses (fill-ratio).
- **Factor-/wallet-validatie** (`factor_learning.validation_report`): per signaalbron hit-rate,
  gemiddelde edge, netto edge na kosten, effectieve n, FDR-significantie, regime-stabiliteit, drift,
  status. Dit is "signaal → prijsbeweging" forward afgerekend. Zichtbaar via `status.py`.
- **Driehoeks-statistiek**: de observer meet nu ook bruto top-of-book spread, uitvoerbare notional
  op orderboek-diepte, en over een `--watch`-run: fractie positieve metingen, langste aaneengesloten
  venster (duur), en aantal kansen dat vóór uitvoering verdween (gemist).
- **Kill-criteria** (`KILL_CRITERIA.md`): vooraf vastgelegd wanneer elke laag wordt afgekeurd.
Beperkingen eerlijk benoemd: per-factor drawdown en exacte signaal-latency worden nog niet apart
bijgehouden (drawdown leeft op bot-niveau; horizon is vast per observatie); PAPER kan maker-fill-kans
niet simuleren (SHADOW/LIVE wel).
