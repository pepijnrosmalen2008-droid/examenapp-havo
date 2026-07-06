# S++ roadmap — van goed onderzoeksplatform naar zelfcorrigerend systeem

Op basis van de gap-analyse. Leidend principe: richting S++ gaat het **niet** om meer
factoren of AI die handelt, maar om **adaptiviteit, statistische strengheid,
uitlegbaarheid en reproduceerbaarheid**. Alles wat hieronder gebouwd wordt, is
deterministisch, getoetst en **zichtbaar op het dashboard** (slagio.nl/bot.html).

## Gebouwd (deze ronde) — elk zichtbaar op het dashboard

| Gebied | Wat | Waar op het dashboard |
|---|---|---|
| **Adaptiviteit** | **Concept-drift-detector** (Page-Hinkley) op de edge-stroom per factor. Kantelt een edge (drift-down), dan verliest de factor direct zijn hogere gewicht — binnen dagen, niet maanden. | Factor-track record → kolom **Drift** (⚠ drift ↓/↑) |
| **Statistiek** | **Multiple-hypothesis-correctie** (Benjamini-Hochberg / FDR). Bij veel factoren zijn er altijd 'toevallig significante'; alleen wie de FDR overleeft blijft *actief*. | Kolom **p (FDR)** + het ✓-vinkje |
| **Decision Intelligence** | **Counterfactual reasoning**: "zonder Wereld/macro was de overtuiging +12 i.p.v. −3" — welke factor was doorslaggevend. | Beslissingspaneel → **Wat-als** |
| **Reproduceerbaarheid** | **Code- + config-hash** (werkt ook vanuit een ZIP, geen git nodig): elke beslissing herleidbaar naar exact deze code en instellingen. | Header → `code … · config … · py …` |

Statistiek-nuance: de bestaande betrouwbaarheid gebruikt al Bayesiaanse krimp (prior
naar 0,5). De significantie-poort is nu drie-lagig: overlap-gecorrigeerde CT-ondergrens
(D24/D25) → **FDR over alle factoren** → regime-stabiliteit → drift-bewaking.

## Geparkeerd — bewust nog niet, met reden

| Prioriteit | Onderdeel | Waarom later |
|---|---|---|
| ⭐⭐⭐⭐⭐ | **Portfolio Intelligence 2.0** (risico-gewogen allocatie: vol, correlatie, liquiditeit, confidence, regime) | dit is de vol_target-allocatie-engine (spoor C); wordt eerst tegen zijn pre-registered criteria getoetst vóór uitbreiding |
| ⭐⭐⭐⭐⭐ | **Execution-quality-analytics** (intended vs. fill, alpha-verlies, latency) | in PAPER is de fill gesimuleerd → zou alleen de modelslippage echoën; pas betekenisvol in SHADOW/LIVE. Framework bouwen wanneer SHADOW draait. |
| ⭐⭐⭐⭐☆ | **Meta-learning** (leersnelheid / decay / stabiliteit per factor) | deels gedekt door drift + regime-dispersie; volledige versie vereist maanden data |
| ⭐⭐⭐⭐☆ | **Dataset-versioning** (expliciete dataset-hash naast code/config) | code+config-hash staat er; dataset-hash volgt zodra er externe databronnen zijn |
| ⭐⭐⭐⭐☆ | **Bayesiaanse posterior / credible intervals** | frequentistische CI + FDR volstaan nu; posterior is een verfijning bij kleine-n |
| ⭐⭐⭐☆☆ | **Research-automation** (AI als *scientist*: stelt hypotheses/analyses vóór, beslist nooit) | pas zinvol met een rijke dataset; blijft binnen "AI stelt voor, nooit handelen" |
| ⭐⭐☆☆☆ | **Multi-source datalake** (orderboek, funding, OI, on-chain, ETF-flows) | zeer hoge kosten/complexiteit; eerst bewijzen dat de huidige bronnen iets opleveren |
| ⭐⭐☆☆☆ | **Volledige observability** (CPU/RAM/latency/health per component) | operationeel nuttig, geen research-edge; komt bij productie-hardening |

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
