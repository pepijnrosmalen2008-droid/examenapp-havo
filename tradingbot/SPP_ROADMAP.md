# S++ roadmap — van goed onderzoeksplatform naar zelfcorrigerend systeem

Op basis van de gap-analyse. Leidend principe: richting S++ gaat het **niet** om meer
factoren of AI die handelt, maar om **adaptiviteit, statistische strengheid,
uitlegbaarheid en reproduceerbaarheid**. Alles wat hieronder gebouwd wordt, is
deterministisch, getoetst en **zichtbaar op het dashboard** (slagio.nl/bot.html).

## De leidende vraag bij ELK nieuw onderdeel (governance-gate)

> **Vergroot dit de kans dat ik een echte informatievoorsprong ontdek (categorie 1),
> of maakt het alleen mijn bestaande onderzoek nauwkeuriger (categorie 2)?**

Eerlijk: vrijwel alles op dit platform — inclusief bijna alles hieronder — is **categorie 2**.
Een perfecte pipeline op prijsdata blijft een perfecte pipeline op prijsdata; een perfecte
researchomgeving maakt uit zichzelf geen edge. Categorie 2 is waardevol (het voorkomt dat je
jezelf een edge aanpraat), maar alleen **categorie 1** verandert wat de bot kán weten. Daarom:
elk voorstel wordt voortaan als 1 of 2 gelabeld, en categorie-2-werk wordt begrensd zolang er
geen kandidaat-edge is om nauwkeuriger te meten. De schaarste van echte categorie-1-bronnen
voor retail-Bitvavo is zelf een bevinding: de eigen nulmeting wijst richting "waarschijnlijk
geen duurzame prijs-only-edge".

## Gebouwd — elk zichtbaar op het dashboard (categorie tussen haakjes)

| Gebied | Wat | Cat. | Waar op het dashboard |
|---|---|:--:|---|
| **Adaptiviteit** | **Concept-drift-detector** (Page-Hinkley): kantelt een edge, dan verliest de factor direct zijn hogere gewicht — binnen dagen. | 2 | Factor-track record → **Drift** |
| **Statistiek** | **FDR-correctie** (Benjamini-Hochberg): alleen wie de correctie over álle factoren overleeft blijft *actief*. | 2 | **p (FDR)** + ✓ |
| **Reliability / self-diagnostics** | **Zelfdiagnose**: hartslag, kill-switch, API/circuit-breaker, leerlus-voeding, drift-alarmen, beslis-zekerheid-trend, database-groei — de bot meldt zelf "loop ik nog / krijg ik nog data / kantelt er iets". | 2 | Paneel **Zelfdiagnose** |
| **Decision Intelligence** | **Counterfactual reasoning**: welke factor was doorslaggevend ("zonder macro +12 i.p.v. −3"). | 2 | Beslispaneel → **Wat-als** |
| **Reproduceerbaarheid** | **Code- + config-hash** (werkt vanuit ZIP): elke beslissing herleidbaar. | 2 | Header |

Statistiek-nuance: de significantie-poort is nu vier-lagig: overlap-gecorrigeerde
CI-ondergrens (D24/D25) → **FDR over alle factoren** → regime-stabiliteit → drift-bewaking.

## Geparkeerd — herrangschikt naar het doel (retail-Bitvavo, klein kapitaal)

Rangorde overgenomen uit de review; multi-source datalake bewust verlaagd (meer bronnen ≠
betere research, wél meer schijncorrelaties), execution + portfolio + reliability verhoogd.

| Rang | Onderdeel | Cat. | Waarom (nog) niet nu |
|:--:|---|:--:|---|
| 1 | **Portfolio Intelligence 2.0** (risico-gewogen allocatie: vol, correlatie, liquiditeit, confidence, regime) | 2 | grootste praktische winst; is de lopende vol_target-engine — eerst tegen zijn pre-registered criteria toetsen |
| 2 | **Execution-quality-analytics** (intended vs. fill, alpha-verlies, latency, retries) | 2 | meet of een theoretische edge écht uitvoerbaar is; in PAPER echoot de fill enkel de modelslippage → bouwen zodra SHADOW draait |
| 3 | **Reliability engineering** (MTBF/MTTR, uptime, restart-freq, geheugen, DB-groei, scheduler-jitter) | 2 | zelfdiagnose is de eerste laag; volledige DevOps-voor-trading hoort bij productie-hardening |
| 4 | **Data lineage & experiment-versioning** (dataset-hash naast code+config, seed, git-commit) | 2 | code+config-hash staat er; dataset-hash volgt zodra er externe databronnen zijn |
| 5 | **Meta-learning** (leersnelheid / decay / stabiliteit per factor) | 2 | deels gedekt door drift + regime-dispersie; volledige versie vereist maanden data |
| 6 | **Calibration** (zegt 80% confidence ook echt 80%? reliability-diagram, ECE) | 2 | de eerlijkheidscheck op confidence; heeft eerst een stroom (voorspelling → uitkomst) nodig — mechanisme volgt |
| 7 | **Bayesiaanse posterior / credible intervals** | 2 | frequentistische CI + FDR volstaan nu; posterior is verfijning bij kleine-n, maakt een slechte factor niet goed |
| 8 | **Research-automation** (AI als *scientist*: stelt hypotheses/analyses vóór, beslist nooit) | 1* | de zeldzame categorie-1-kandidaat, maar pas zinvol met rijke data; blijft "AI stelt voor, nooit handelen" |
| 9 | **Multi-source datalake** (orderboek, funding, OI, on-chain, ETF-flows) | 1 | *de* categorie-1-hefboom, maar duur/foutgevoelig; eerst één nieuwe bron volledig uitmelken vóór er tien bijkomen |

\* research-automation is meta (categorie 1 alléén als het naar nieuwe informatie zoekt).
De enige echte categorie-1-onderdelen (nieuwe informatie) zijn #8 en #9 — en juist die
staan laag omdat ze duur zijn en pas lonen als het bestaande onderzoek is uitgemolken.
Dat spanningsveld is het eerlijke hart van dit platform.

## Bewust NIET (blijft van tafel)
LLM die trades kiest · GPT die koopt/verkoopt · meer RSI-varianten of indicatoren ·
sentiment-scraping (X/Reddit/YouTube) · "AI-confidence" · black-box-net zonder uitleg.
Deze verhogen vooral complexiteit en het risico op schijnresultaten.

## De kern die S++ onderscheidt (waar de laatste procenten zitten)
1. **Adaptiviteit** — herkennen wanneer een patroon niet meer geldt (drift: gebouwd; regime-transities: geparkeerd).
2. **Portfolio-intelligentie** — niet *wat* maar *hoeveel risico* per idee (allocatie-engine: in test).
3. **Reproduceerbaarheid** — elke conclusie jaren later exact herhaalbaar (code+config-hash: gebouwd; dataset-versioning: volgt).

Geen van deze levert winst-garantie — niets doet dat. Ze vergroten de kans dat een échte
edge betrouwbaar wordt herkend en dat schijnsignalen zo vroeg mogelijk sneuvelen.
