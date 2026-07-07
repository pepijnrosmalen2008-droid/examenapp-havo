# S++ roadmap — een falsificatie-machine voor kwantitatieve handelshypotheses

Wat dit project inmiddels is, treffender dan "trading bot": **een falsificatie-machine voor
kwantitatieve handelshypotheses.** Het bevestigt niet, het verwerpt — reproduceerbaar.

## Volwassenheidsfasen (niet features, maar fasen)

| Fase | Doel | Klaar | Bouwbeleid |
|---|---|:--:|---|
| **1 · Infrastructure** | de machine mag nooit liegen (crash-safe, risk, governance, tests, self-diagnostics, reproduceerbaarheid) | ~98% | **alleen bij een bug** |
| **2 · Measurement** | de werkelijkheid correct meten (forward learning, overlap, opportunity cost, regime, significantie, FDR, drift) | ~90% | **alleen bij een bewezen meetfout** |
| **3 · Information** | héb ik informatie die de markt nog niet verwerkt heeft? | ~35% | **ja — hier zit de winst** |
| **4 · Allocation** | hoeveel risico verdient elk idee? | ~20% | **ja** |

Fase 1 en 2 zijn géén bottleneck meer. De afstand tot S++ zit in fase 3 (informatie) en
fase 4 (allocatie) — en die zijn moeilijk om inhoudelijke, niet om softwarematige redenen.

## Moratorium (dwingend, geldt vanaf nu)

**Geen nieuwe code tenzij ze aan minstens één van deze drie voldoet:**

- **A — bewezen bug.** Verkeerde statistiek, verkeerde edge-definitie, leakage, crash,
  verkeerde risk-berekening. Mag altijd.
- **B — nieuwe informatiebron.** Echt nieuw (funding, basis, opties, on-chain, …), geen
  extra indicator of variant op prijs.
- **C — slimmere kapitaalallocatie op basis van *bewezen* informatie** (fase 4).

Alles daarbuiten: **niet bouwen.** Concreet automatisch **nee**: nog een confidence-metric,
dashboard-paneel, risk-module, kill-switch, governance-doc, statistische maat. Niet omdat het
slecht is, maar omdat het niet meer de bottleneck is. De bottleneck ligt niet meer in de
software — bijna elk programmeer-uur levert nu minder op dan een uur nadenken over *welke
informatie ontbreekt*.

## Output-maat: Research Velocity (niet code, niet commits)

De waarde van het platform is niet code of features, maar **betrouwbare kennis**: hoeveel
hypotheses zijn deze maand definitief bevestigd of verworpen? De ledger bestaat al —
`experiments/` (pre-registraties), `REJECTED_HYPOTHESES.md` (verworpen, met OOS-cijfers),
`PROMOTION_CRITERIA.md` (gepromoveerd). Vullen gebeurt door de paper-bots te laten draaien en
te concluderen, niet door te bouwen.

## Succesdefinitie (herzien)

> Niet "een bot die winst maakt", maar **een platform dat met zo min mogelijk zelfbedrog
> vaststelt óf er onder deze randvoorwaarden een reproduceerbare handelsedge bestaat.**
> Een uiteindelijke "nee" is een legitieme, waardevolle uitkomst — het bewijs dat de machine
> streng genoeg was om een aantrekkelijke maar onbewezen hypothese niet door te laten.

## Doelarchitectuur (north-star): rollen, geen bots

Niet één alles-in-één-bot, maar één centrale beslisengine gevoed door gespecialiseerde
onderzoeksrollen. De kracht is de **scheiding van verantwoordelijkheden** — makkelijker te
begrijpen, testen en falsifiëren. De rol die daadwerkelijk "trades kiest" is uiteindelijk
het kleinst; het meeste werk zit in bewijs verzamelen en risico beheren.

| Rol | Nu | Doel |
|---|---|---|
| **Benchmark** | DCA-bot | referentie: is het platform beter dan niets doen? |
| **Prijs-research** | momentum · rotatie · grid | prijs-hypotheses toetsen (grotendeels uitgeput) |
| **Informatie-probe** | nieuws-bot | niet-prijs-informatie onderzoeken (nieuws → later funding/macro/on-chain); onderzoekt, handelt nauwelijks |
| **Allocatie-engine** | vol_target | bewezen signalen → portefeuillegewichten + risicobudget (fase 4, natuurlijke eindbestemming) |
| **Risk engine** | risk-laag | enige component die orders autoriseert |

Volgorde die telt: een probe levert pas iets aan de allocatie-engine als hij de teststraat
overleeft. Eerst onafhankelijk bewijs, dan pas invloed op allocatie. Dit is geen bouwopdracht
— het is de richting waaraan conditie-B/C-voorstellen getoetst worden.

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
