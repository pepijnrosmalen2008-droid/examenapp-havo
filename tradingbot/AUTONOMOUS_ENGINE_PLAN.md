# Autonomous Trading Intelligence — inventaris & implementatieplan

Doel: geen stapel losse strategieën, maar één **autonome, zelflerende trading-intelligence** die
live opereert, zichzelf onderzoekt, strategieën ontdekt/test/selecteert/afschrijft, met een
**onafhankelijke risk governor** en een scherp onderscheid tussen *echt beter handelen* en
*zichzelf wijsmaken dat het beter is*.

Uitgangspunt: ~€130 live, volledig mag worden verloren; live vanaf het begin, maar met eigen
risicobeheersing en eerlijke bewijsvoering.

Dit document is de eerste concrete stap: **wat bestaat echt, wat is half, wat ontbreekt** — en
daaruit een plan dat werkende onderdelen hergebruikt.

---

## 1. Conclusie vooraf (de echte gap)
De **fundering staat grotendeels al**: onafhankelijke risk-engine, execution met kostenmeting,
forward-only leerlus (met FDR, drift, regime, bewijs-status), backtester, Monte-Carlo, adversariële
toetsen, provenance, experiment- en afgewezen-hypotheses-registers, en een databron-kwaliteitspoort.

Wat **ontbreekt** is de autonome *regisseur* erboven: een systeem dat **zélf** hypotheses bedenkt,
die automatisch backtest + adversarieel toetst, een **strategie-register met automatische
levenscyclus** bijhoudt, kapitaal toewijst **op bewijs** (niet op onderbuik), en een **meta-leerlaag**
die bijhoudt welke onderzoeksmethoden structureel werken. Plus losse-patroon-/feature-ontdekking
(de moeilijkste en riskantste eis).

Kort: we hebben ~60–70% van de *onderdelen*, maar nog niet de *autonomie* die ze aan elkaar knoopt.

## 2. Inventaris — architectuurcomponenten
| Component | Status | Waar / wat ontbreekt |
|---|---|---|
| **Onafhankelijke Risk Governor** | ✅ bestaat | `risk.py` — aparte laag; strategie kan limieten niet omzeilen. Precies jouw eis. |
| **Execution Engine** | ✅ bestaat | `exchange.py` + `execution.py` (kostenpoort, maker/taker) + order-journaling, crash-recovery. |
| **Market Intelligence** (prijs/vol/liquiditeit/regime) | ✅ grotendeels | `factors.py`, `regime.py`, `universe.py`, `indicators.py`. |
| **Information Intelligence** (nieuws/events) | 🟡 deels | `newsfeed/disclosures/onchain` + `datasource.py` (bronkwaliteit). **Funding/derivaten ontbreekt** (Bitvavo = spot). |
| **Learning & Memory** | 🟡 deels | `factor_learning.py` (forward-only, net-na-kosten, FDR, Page-Hinkley-drift, regime) + `database.py` (factor_obs/stats/decision_log/execution_log). **Kalibratie, gemiste-kansen, langetermijngeheugen-index ontbreken.** |
| **Evidence & Strategy Selection** | 🟡 deels | Bewijs-status bestaat **op factor-niveau** (`factor_status`: observeren/onbewezen/actief/eenzijdig/uitgeschakeld) + `PROMOTION_CRITERIA.md`. **Op strategie-niveau + kapitaal-allocatie-op-bewijs ontbreekt.** |
| **Autonomous Research** (hypotheses→backtest) | 🟡 gereedschap wel, regie niet | `backtesting.py`, `montecarlo.py`, `adversarial.py` bestaan als *tools*. **Hypotheses worden nu door mensen bedacht; auto-genereren + auto-draaien ontbreekt.** |
| **Centrale coördinator / onderzoeksplanner** | ❌ ontbreekt | Dit is de echte nieuwe kern. |
| **Live Feedback Loop** (elke beslissing = data) | 🟡 deels | `decision_log`, `execution_log`, `factor_obs` leggen alles vast — maar worden alleen op factor-niveau geconsumeerd, niet door een autonome onderzoeker. |

## 3. Inventaris — jouw 6 geëiste capaciteiten
| # | Capaciteit | Status | Toelichting |
|---|---|---|---|
| 1 | Zelf marktpatronen ontdekken | ❌ | Factoren zijn hand-gecodeerd. Geen feature-/patroon-ontdekking. (Hardste + riskantste eis.) |
| 2 | Zelf de markt onderzoeken | 🟡 | Publieke bronnen + kwaliteitspoort + forward-only afrekening van nieuws bestaan; autonome event→waarde-studie als zelfsturend proces ontbreekt. |
| 3 | Zelf strategieën ontwikkelen | ❌/🟡 | Backtester bestaat; hypothese→strategie-generatie + varianten + vergelijk-met-benchmark als autonoom proces ontbreekt. |
| 4 | Zelf kiezen hóé ze handelt | 🟡 | Eén `adaptive` strategie + `regime.py`; autonoom wisselen tussen scalp/momentum/mean-reversion/rotatie/cash op bewijs ontbreekt. |
| 5 | Leren van elke uitkomst (na fees/slippage) | 🟡→goed | `factor_learning` doet forward-only, net-na-kosten; `execution_log` heeft echte fees. Mist: confidence-kalibratie, gemiste-kansen, "te zeker"-correctie. |
| 6 | Eigen onderzoeksproces verbeteren (meta) | ❌ | `REJECTED_HYPOTHESES.md` is handmatig. Geen automatisch register van beproefde hypotheses + betrouwbaarheid van methoden. |

## 4. De twee scores + bewijs-status
- **Onderzoeksscore** (goed in reproduceerbare patronen + geldige experimenten + voorspellen): ❌ nog
  geen expliciete score (de data om 'm te berekenen bestaat wel: factor_obs, grade-uitkomsten).
- **Handelsscore** (portefeuille na kosten vs buy-and-hold, drawdown, risico): 🟡 losse onderdelen
  (equity-snapshots, benchmark, execution-kosten) — nog niet als één cijfer samengebracht.
- **Bewijs-status met automatische overgangen**: ✅ op factor-niveau, ❌ op strategie-niveau.

## 5. De echte nieuwe kern — de Autonomous Research & Learning Engine
Wat gebouwd moet worden (hergebruikt alle bovenstaande ✅/🟡-onderdelen):
1. **Strategie-register** met levenscyclus + auto-status (observeren→onbewezen→actief→drift→
   uitgeschakeld) en **kapitaal-allocatie op bewijs** (actief = gecontroleerd kapitaal; de rest = €0).
2. **Hypothese-generator + onderzoeksplanner**: kiest zelf de volgende vraag, draait `backtesting`
   + `montecarlo` + `adversarial`, en registreert de uitkomst (ook het falen) in een
   **hypothese-register** (uitbreiding van REJECTED_HYPOTHESES).
3. **Twee gescheiden scores** (onderzoek vs handel) als eerstentrangs-metriek.
4. **Meta-leerlaag**: houdt bij welke onderzoeksmethoden/bronnen/aanpassingen structureel waarde
   gaven, zodat dezelfde doodlopende ideeën niet eindeloos herhaald worden.
5. **(Later, moeilijkst) Patroon-/feature-ontdekking**: nieuwe kenmerken en signaal-combinaties
   genereren die buiten de ontdekkingsdata standhouden.

De risk governor blijft **buiten** deze engine en kan er niet door worden uitgeschakeld — de AI mag
haar eigen veiligheidslimieten niet verzwakken om een experiment te laten "slagen".

## 6. Implementatieplan (hergebruik-eerst, jouw fasering)
- **Fase 0 — nu, veiligheid:** de bloedende aggressieve scalp **de-churnen** naar een rustige
  nulmeting (fors hogere drempels / weinig trades), zodat we niet €16/dag aan fees verbranden
  terwijl we bouwen. Dit is jouw "Fase 1 live foundation = veilig draaien + betrouwbare nulmeting".
- **Fase 1 — strategie-register + bewijs-gated allocatie** ✅ **GEBOUWD** (zie D37): `arena.py` +
  `strategies/autonomous.py` meten elke kandidaat forward-only na kosten; kapitaal volgt bewijs,
  anders cash. Draait in `config.allin.yaml`.
- **Fase 2 — autonome onderzoeker + dubbele score** ✅ **GEBOUWD** (zie D38): `researcher.py` genereert
  zelf hypotheses (parameter-grid), toetst ze offline met backtest + buy-and-hold + de adversariële
  suite en logt het oordeel in `research_log` (dedup via hkey); `research.py` is de offline CLI.
  `scorecard.py` geeft twee aparte cijfers (handelen vs. leren), getoond in `status.py`. De
  onderzoeker alloceert nooit zelf kapitaal — kandidaten gaan pas live na handmatige review.
- **Fase 3 — strategie-varianten genereren + vergelijken** (binnen een vaste, veilige ruimte van
  bouwstenen; géén vrije code-generatie live).
- **Fase 4 — adaptieve selectie** tussen handelsstijlen op regime + bewijs.
- **Fase 5 — meta-learning** (welke methoden werken).
- **Fase 6 — doorlopende herbeoordeling** (drift → vertrouwen intrekken).

Research-engine draait **parallel** aan de live bot; nieuwe strategieën nemen **nooit** automatisch
kapitaal over zonder aan de promotiecriteria te voldoen.

## 7. Wat we expliciet NIET bouwen (jouw grenzen, overgenomen)
- Geen taalmodel dat per candle vrij koopt/verkoopt.
- Geen systeem dat zijn eigen backtests kan bijstellen tot ze positief zijn.
- Geen onbeperkte zelf-programmerende loop die live code vervangt. Wél: AI ontwikkelt in een
  **afgeschermde omgeving**, tests automatisch, stelt verbeteringen voor; uitrol gecontroleerd, met
  versiebeheer en **automatische terugval** naar de vorige werkende versie.
- Geen beloning puur op korte-termijnwinst (dat jaagt risico op). Beloning = bewijs + risico-gewogen
  resultaat na kosten.

## 8. Eerlijke risico's van dit plan
- Capaciteit 1 (patroon-ontdekking) is de klassieke valkuil: met genoeg zoeken "vind" je altijd iets
  → daarom streng out-of-sample + adversarieel + FDR, en standaard wantrouwen.
- Met €130 en taker-fees blijft de fee-drempel hoog; de allocatie-engine moet traden **beperken**,
  niet aanjagen.
- "Autonoom" betekent niet "gegarandeerd winstgevend" — het betekent dat het systeem zelf zijn
  kansen zoekt én zijn eigen illusies afbreekt. Het eindoordeel blijft: edge of geen edge.

## 9. Voorstel voor de volgende stap
Akkoord op dit plan? Dan begin ik met **Fase 0 (de-churn naar veilige nulmeting)** + **Fase 1
(strategie-register met dubbele score en bewijs-gated kapitaalallocatie)** — de twee stappen met de
meeste waarde en het minste risico, bovenop wat er al staat.
