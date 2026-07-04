# Pre-registratie — Experiment: vol-target allocatie-engine

**Vastgelegd vóór de run. Deze criteria worden niet versoepeld na het zien van het
resultaat; een wijziging wordt hieronder gelogd met datum en reden.**

## Hypothese
Een portefeuille die exposure stuurt op **risico** (inverse-volatiliteit-weging,
volatiliteitsdoel, BTC-floor, en de-risken bij hoge correlatie) levert een **beter
risicoprofiel** dan simpelweg de mand aanhouden — lagere drawdown, hogere Sortino —
zonder het rendement onaanvaardbaar te schaden.

## Mechanisme / informatie
Geen nieuwe informatiebron; alleen prijs → **risico-allocatie** (ander type beslissing
dan de verworpen timing-strategieën). Beantwoordt "hoeveel van elk?", niet "wat koop ik?".

## Klasse
ALLOCATIE-strategie → beoordeeld op de risico-vector, **niet** op hoger eindkapitaal.

## Acceptatiecriteria (out-of-sample, walk-forward, na kosten 0,25%+0,1%)
Promoveert naar PAPER alleen als **alle** onderstaande gelden t.o.v. buy-and-hold van
dezelfde mand over dezelfde periode:
1. **Max drawdown lager** dan buy-and-hold (materieel, niet marginaal — minstens 15% relatief lager);
2. **Sortino hoger** dan buy-and-hold;
3. **Rendement niet meer dan 20% (relatief) onder** buy-and-hold;
4. **Robuust:** in de meerderheid van de walk-forward-vensters een lagere drawdown dan hold;
5. **Monte Carlo:** p5-drawdown blijft onder de kill-switch; kill-switch valt in < 25% van de scenario's.

Haalt hij dit niet → **verworpen**, genoteerd in REJECTED_HYPOTHESES.md. Geen tweede poging
zonder fundamenteel andere reden.

## Testperiode
2021-01-01 → 2025-12-31, mand uit config.basket.yaml, walk-forward + Monte Carlo.

## Wijzigingslog
(leeg — nog geen wijzigingen)
