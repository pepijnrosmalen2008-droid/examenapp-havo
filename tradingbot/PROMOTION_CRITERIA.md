# Promotiecriteria

De promotieladder van idee naar live. **De criteria worden vooraf vastgelegd**, niet
achteraf. Een resultaat dat "net niet" haalt, zakt — je past de lat niet aan omdat je
al veel werk hebt gestoken in een idee.

## De ladder

| Van | Naar | Poort (vereisten) |
|---|---|---|
| Idee | Prototype | Fundamenteel nieuwe informatiebron of mechanisme; **niet** vergelijkbaar met iets in REJECTED_HYPOTHESES.md. Vooraf-registratie van succescriteria geschreven. |
| Prototype | Backtest | Implementatie compleet, unit-tests groen, gaat door de bestaande risk engine. |
| Backtest | Walk-forward | Geen datalekken (checklist), realistische kosten (0,25% + 0,1%), reproduceerbaar. |
| Walk-forward | Paper | Voldoet aan de **vooraf** vastgelegde acceptatievector (hieronder). |
| Paper | Shadow | ≥ 8–12 weken stabiel, geen operationele storingen, gedrag in lijn met de backtest. |
| Shadow | Live | Shadow ≈ paper (geen onverklaarde afwijking) + expliciete handmatige goedkeuring + geschreven risicoanalyse + alleen misbaar geld. |

## Wat "succes" betekent (vooraf gedefinieerd)

Vaag ("beter dan buy-and-hold") is verboden. Per experiment leg je vóór de run een
vector vast. Standaard drempels — aan te scherpen per experiment, nooit te versoepelen
na het zien van het resultaat:

**Voor een strategie die ALPHA claimt (timing/selectie):**
- OOS-rendement na kosten > 0, én ≥ buy-and-hold van dezelfde mand/periode (netto);
- ≥ 60% van de walk-forward-vensters positief (consistentie, niet één gelukstreffer);
- geen extreme parametergevoeligheid (buur-parameters geven vergelijkbare uitkomst;
  het beste optimum springt niet wild per venster);
- Monte Carlo: p5-scenario niet catastrofaal, kill-switch valt in < ~25% van de runs;
- leakage-checklist afgevinkt.

**Voor een ALLOCATIE-/risicostrategie (claimt géén hoger eindkapitaal):**
- niet afrekenen op euro's t.o.v. hold, maar op risico-gecorrigeerd:
  **hogere Sortino én lagere max drawdown** dan buy-and-hold, bij een rendement dat
  niet meer dan ~20% onder hold ligt — out-of-sample, robuust over vensters én Monte Carlo.

**Paper → Shadow:** ≥ 8–12 weken, geen crashes/dubbele orders/operationele fouten,
gerealiseerd gedrag zonder grote onverklaarde afwijking van de verwachting.

**Shadow → Live:** shadow-P&L volgt paper binnen tolerantie; daarna klein beginnen,
met positie- en verlieslimieten, en alleen kapitaal dat volledig gemist kan worden.

## Pre-registratie (per experiment)

Vóór je een experiment draait: schrijf een kort blok met (a) de hypothese, (b) welke
informatie/mechanisme, (c) de exacte acceptatiedrempels, (d) de testperiode. Wijk je
daar later van af, dan **log je dat met datum en reden** — anders niet.

## Sunk-cost-clausule (de belangrijkste regel)

> Hoeveel werk er al in het platform zit, zegt **niets** over de kans dat de markt een
> edge geeft. De markt beloont geen mooie architectuur; alleen informatie die anderen
> nog niet volledig hebben verwerkt. "We hebben zoveel gebouwd, dus er móét een edge
> zijn" is een denkfout en geen argument.

En daarom is dit een **volledig legitieme einduitkomst**, geen mislukking:

> "Voor een retail-opstelling met Bitvavo, normale latency en publieke data is geen
> robuuste positieve verwachtingswaarde gevonden."

In dat geval heeft het platform precies zijn werk gedaan: het heeft je behoed voor het
inzetten van echt geld op strategieën die de data niet konden dragen.
