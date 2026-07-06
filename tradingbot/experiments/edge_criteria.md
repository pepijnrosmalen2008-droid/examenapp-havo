# Wanneer is een "edge" statistisch echt? — vooraf vastgelegde drempels

Antwoord op twee vragen die bepalen of dit een *research system* of een *profit system*
wordt: (1) wanneer noem je een edge écht bestaand in deze setup, en (2) wat is de
minimale drempel om ruis niet als signaal te lezen. Vastgelegd vóór de dataverzameling,
zodat de lat niet achteraf naar de data toe buigt.

## 0. Het onderscheid dat hieronder alles stuurt
Een goed meet- en leersysteem maakt slechte edges niet goed — het maakt ze **zichtbaar**.
Deze drempels zijn er om te voorkomen dat we een zelfbevestigende lus voor inzicht
aanzien. Ze geven een factor géén invloed; ze bepalen alleen wanneer een factor *als
bewezen* mag gelden.

## 1. Wat er gemeten wordt (en waarom zo)
- **Excess t.o.v. de mand (opportunity cost).** Edge = koersbeweging in de factor-richting
  **min** de gemiddelde beweging van alle waargenomen coins over hetzelfde venster. Een
  factor die alleen beta rijdt (in een stijgende markt lijkt alles goed) scoort hierdoor
  ~0. Alleen relatieve voorspelkracht telt.
- **Na kosten.** Round-trip fees + spread + slippage worden van de edge afgetrokken. Een
  richting die vaker klopt dan niet, maar de kosten niet terugverdient, is geen edge.
- **Observationeel, universe-breed — niet policy-afhankelijk.** Observaties worden
  vastgelegd voor **alle** gevolgde coins, los van wat de bot koopt. De factor-statistiek
  is dus een marktbrede meting, niet een verslag van de eigen trades. Dat breekt de
  zelfbevestigende lus: een hoger gewicht verandert wél de beslissingen, maar niet de
  meting waarop de betrouwbaarheid rust. (Restbeperking, eerlijk benoemd: de *keuze van
  het universe* en de *sample-momenten* zijn nog steeds beleid; de meting is markt-neutraal
  binnen dat universe, niet daarbuiten.)

## 2. Wanneer heet een edge "echt"? (pre-registratie)
Een factor krijgt status **actief** — en pas dán een gewicht > 1,0 — als **alle** gelden:
1. **n ≥ 30** afgerekende observaties (`MIN_N_SIGNIF`); daaronder: status *observeren*,
   gewicht neutraal.
2. **Ondergrens boven nul na kosten:** `mean_excess − Z·SE − kosten > 0`, met **Z = 1,64**
   (eenzijdig 95%). Dit is de kern: niet het gemiddelde, maar de conservatieve ondergrens
   van het betrouwbaarheidsinterval stuurt het gewicht. Grote variantie of weinig data →
   ondergrens ≤ 0 → status *onbewezen*, gewicht blijft 1,0.
3. Spiegelbeeldig: `mean_excess + Z·SE − kosten < 0` → **uitgeschakeld** (bewezen
   verlieslatend), gewicht omlaag.

Dit is exact wat in de code zit (`factor_learning.py`: `Z_SIGNIF`, `MIN_N_SIGNIF`,
`_conservative_edge`, `weight_multiplier`, `factor_status`). Een positieve gemiddelde
edge is dus **niet** genoeg — hij moet de ruis overleven.

## 3. Drempels om noise niet als signaal te lezen (promotie naar order-invoer)
Bovenstaande maakt een factor "bewezen" in de *uitleglaag*. Om ooit **echte orders** te
mogen sturen ligt de lat hoger, en langs de forward-weg (PAPER/SHADOW), nooit via een
backtest van externe/nieuws-factoren (leakage):
- **n ≥ 200** onafhankelijke, afgerekende observaties voor die factor.
- **Netto excess-edge per observatie ≥ +0,10%** met **t-statistiek ≥ 2** over de volledige
  periode.
- **Stabiliteit:** positieve netto-edge in de **meerderheid van de maanden**, niet dankzij
  één regime of één uitschieter (geen enkele maand > 50% van de cumulatieve edge).
- **Portefeuille-effect:** met de factor aan géén hogere max drawdown dan zonder, en een
  hogere Sharpe/Sortino op dag-rendementen.
- **Sunk-cost-clausule:** haalt hij dit niet → REJECTED_HYPOTHESES.md, geen tweede poging
  zonder fundamenteel andere reden.

## 3b. Niet-stationariteit: waarom "significant over de hele periode" misleidt
De CI-toets in §2 gaat impliciet uit van onafhankelijke, identiek verdeelde observaties.
Crypto voldoet daar niet aan (regimes, autocorrelatie, volatility clustering). Zonder
correctie zou een "significant"-stempel eigenlijk zeggen: *robuust in déze historische
mix van regimes* — niet *voorspellend in het volgende regime*. Twee ingebouwde correcties:

- **Overlap → effectieve steekproef.** We meten elk uur maar rekenen over 24u af, dus
  opeenvolgende vensters overlappen ~23/24. De standaardfout gebruikt daarom een
  **effectieve n** ≈ n × (sample-interval / horizon), niet de ruwe n. Gevolg: je hebt
  grofweg een maand niet-overlappend bewijs nodig voor n_eff ≥ 30 — eerlijk, en het
  voorkomt dat honderden overlappende metingen als los bewijs tellen. (De
  cross-sectionele correlatie is al grotendeels verwijderd door de excess-t.o.v.-mand-meting.)
- **Regime-conditionering.** Elke observatie krijgt bij vastlegging het marktregime
  (bull / bear / chop) mee — *dit moet vooraf, want achteraf is het niet te reconstrueren.*
  Een factor is pas **actief** als zijn netto-edge in **meerdere regimes** standhoudt.
  Leunt de edge op één regime, dan is de status **eenzijdig** en krijgt hij géén hoger
  gewicht — precies omdat "werkte in de bull van 2023" niets zegt over de volgende bear.

Wat dit expliciet nog **niet** is (geparkeerd op de roadmap, L2-vol/L3):
rolling-window-consistentie, gedrag rond regime-*transities*, en de allocatie-impact
(verbetert de factor de Sharpe van de hele portefeuille, of alleen geïsoleerde
trefkans?). Ook mét deze correcties blijft gelden: historische regime-stabiliteit is
een noodzakelijke, geen voldoende voorwaarde voor toekomstige voorspelkracht — de markt
is een adaptief systeem, geen vaste dataset.

## 4. Eerlijke verwachting
Dit systeem zal waarschijnlijk vooral **slechte signalen zichtbaar maken en laten
sterven** — ruis reduceren, overfitting temmen, gedrag stabiliseren. Dat is waardevol,
maar het is nadrukkelijk **geen** garantie dat er in prijs + nieuws + macro binnen een
retail-Bitvavo-universe een exploiteerbare, kosten-na-positieve structuur zit. De eigen
nulmeting (vier prijsstrategieën, alle vier onder buy-and-hold) wijst eerder de andere
kant op. Deze drempels bestaan juist om dat eerlijk te kúnnen concluderen in plaats van
een zelfbevestigende lus voor edge aan te zien.

## Wijzigingslog
(leeg — nog geen wijzigingen)
