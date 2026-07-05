# Pre-registratie — Experiment: multi-factor beslissingslaag (nieuws, macro, smart money)

**Vastgelegd vóór de run. Deze criteria worden niet versoepeld na het zien van het
resultaat; een wijziging wordt hieronder gelogd met datum en reden.**

## Wat er gebouwd is (en waarom dat mag zonder deze test)
Twee dingen, bewust gescheiden:

1. **Observeerbaarheid (`factors.py` + `decisions.py`).** De bot maakt zijn gedachtegang
   expliciet: per coin een opgesplitste factor-lezing (momentum, trend, rust/risico,
   afstand-tot-top, relatieve sterkte) en een netto-beslissing per cycle (kopen /
   verkopen / herbalanceren / cash / wachten), zichtbaar op slagio.nl/bot.html.
   Dit **verandert geen enkele order** — het legt alleen uit wat de strategie al deed.
   Daarom heeft dit geen acceptatietest nodig; het is puur uitleg.

2. **Externe factoren als overlay (nieuws, wereld/macro, smart money).** Komen uit
   gestructureerde events (`research_events.json`, veld `kind`). Ze **kleuren alleen de
   gedachtegang** en kunnen — als `research.enabled` — hooguit een VOORSTEL worden dat
   verplicht door de risk engine gaat. Ze plaatsen nooit rechtstreeks een order.

## De harde grens
Externe factoren mogen **nooit** als bewijs voor een edge worden gepresenteerd op basis
van een backtest. Reden: **leakage**. Een model dat op oud nieuws wordt getoetst "kent"
de afloop al; elke mooie backtest-curve op nieuws/sentiment is daarom misleidend. Deze
signalen zijn **alleen forward te toetsen** — live, in PAPER/SHADOW, met een vooraf
vastgelegd protocol. Zie ook RESEARCH_AGENT.md en RESEARCH_ROADMAP.md.

## Leerlus (gebouwd — het mechanisme, niet de conclusie)
`factor_learning.py` legt elke cycle de factor-scores vast en rekent ze ná 24u af tegen
de werkelijke koersbeweging → per factor een **precisie** (krimp naar 0,5). Die stuurt het
effectieve gewicht in de gedachtegang. Het **mechanisme** om "welke informatie bleek
nuttig?" te meten staat er dus; de **uitkomst** moet zich nog opbouwen. Zolang er te
weinig afgerekende observaties zijn, staat elke betrouwbaarheid dicht bij 0,5 (eerlijk:
"nog niet bewezen"). Dit is puur forward — het verandert nooit met terugwerkende kracht
een order, alleen de uitleg en de gated voorstellen.

## Hypothese (forward-only)
Een confidence-gewogen externe-factor-overlay, bovenop de prijsstrategie, verbetert de
beslissingen **niet vanzelf**. We geloven het pas als een vooraf geregistreerde,
live-verzamelde dataset het laat zien.

## Acceptatiecriteria (alleen langs de PAPER/SHADOW-weg, nooit via backtest)
Externe factoren worden pas een echte order-invoer (i.p.v. alleen uitleg) als **alle**
onderstaande gelden, op **live vooruit** verzamelde data:
1. **Pre-registratie per bron.** Vóór het verzamelen ligt vast: welke events tellen,
   hoe `direction`/`confidence` worden bepaald, en de horizon. Geen achteraf-tuning.
2. **Voldoende, onafhankelijke observaties** (richtlijn ≥ 100 events per bron) vóór er
   ook maar iets wordt geconcludeerd — anders is het ruis.
3. **Positieve, kosten-nette hit-rate out-of-sample:** de event-richting voorspelt de
   koersbeweging over de opgegeven horizon beter dan een muntworp, ná 0,25%+0,1% kosten.
4. **Robuust over de tijd:** het effect houdt stand in de meerderheid van de maanden,
   niet dankzij één uitschieter.
5. **Geen schade aan het risicoprofiel:** met de overlay aan is de max drawdown niet
   hoger dan zonder.

Haalt een bron dit niet → **verworpen voor order-invoer**, genoteerd in
REJECTED_HYPOTHESES.md. De bron mag dan blijven bestaan als *uitleg* in de gedachtegang,
maar stuurt geen euro's.

## Wat expliciet NIET gebeurt
- Geen LLM die uit een nieuwskop direct "KOOP/VERKOOP" bepaalt (niet reproduceerbaar).
- Geen backtest die als bewijs voor een nieuws-/sentiment-edge wordt opgevoerd (leakage).
- Geen live geld op basis van externe factoren tot bovenstaande volledig is gehaald.

## Wijzigingslog
(leeg — nog geen wijzigingen)
