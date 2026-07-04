# Verworpen hypotheses — logboek

Serieuze quant-onderzoekers houden bij wat **niet** werkte, niet alleen wat wel werkte.
Dit document voorkomt dat we over een jaar opnieuw denken "misschien toch weer EMA's
proberen…". Een idee dat hier staat, is getest en gezakt — het komt niet terug zonder
een fundamenteel andere reden.

Maatstaf: out-of-sample (walk-forward) rendement na kosten (0,25% taker + 0,1%
slippage), vergeleken met simpelweg de startportefeuille aanhouden (buy-and-hold).

| Hypothese | Getest | OOS-resultaat | Buy-and-hold | Waarom verworpen |
|---|:--:|--:|--:|---|
| DCA + stop-loss/take-profit | 2026 | **−15%** | +107% | Take-profit kapt winnaars te vroeg af, stop-loss realiseert verliezen; in een stijgende markt structureel achter op houden. |
| EMA-momentum (12/26 + RSI) | 2026 | **−62%** | +107% | Whipsaws op uurdata; koopt tops, verkoopt bodems. Zelfs de getrainde parameters presteerden slecht → geen edge, geen overfitting. |
| Grid trading | 2026 | **−96%** | +107% | Gokt op zijwaartse markt; in trends koopt hij een vallend mes en verkoopt te vroeg. Fees op alle level-trades versnellen de schade. |
| Cross-sectional momentum (relatieve sterkte) | 2026 | **−70%** | +73% (mand) | Klassiek overfitting-patroon: train +90/+100%, OOS −25%. Onstabiele optima, parameters springen per venster → geen persistent signaal. |

## Overkoepelende conclusie

Vier prijs-gebaseerde families, allemaal verslagen door vasthouden. Gemeenschappelijk:
ze gebruiken uiteindelijk dezelfde informatie — **historische prijs** — en daar zit in
deze markt/periode/kostenstructuur geen eenvoudige, retail-exploiteerbare edge.

**Gevolg voor de roadmap:** geen nieuwe varianten binnen dezelfde informatiebron. De
volgende hypotheses moeten óf een ander *type* rendement zoeken (allocatie/risico i.p.v.
timing) óf een andere *informatiebron* (on-chain). Zie RESEARCH_ROADMAP.md.

## Nog niet afgerond / lopend

| Hypothese | Status | Notitie |
|---|---|---|
| DCA / momentum / rotatie / rotatie-snel (live paper) | loopt | Vier bots meten nu tegen buy-and-hold over echte, wisselende marktomstandigheden. |
| rotatie-snel (elke minuut herwegen) | loopt | Bewust extreem; verwachting: verliest het hardst door fees/ruis. Wordt gemeten, niet aangenomen. |

*Regels worden hierheen verplaatst zodra ze door de teststraat zijn gevallen.*
