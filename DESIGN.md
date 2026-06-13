# Slagio Design System — "Examenpapier & De Vlag Uit"

> Tokensysteem v1. Eerst goedkeuren, dan uitrollen naar alle schermen.

## Concept

Slagio's wereld is de Nederlandse examenwereld: ruitjespapier, de stopwatch,
de nakijkpen, de cesuur — en als beloning het enige échte Nederlandse
slagingssymbool: **de vlag met de schooltas eraan**. Het designsysteem beweegt
van *studeernacht* (donker, gefocust, geconcentreerd) naar *de vlag gaat uit*
(warm, feestelijk, opgelucht). Elke beloning in de app is een kleine vlag-uit.

Geen van de drie AI-defaultlooks. De identiteit komt uit drie eigen materialen:
1. **Ruitjespapier** — het grid waarop elke Nederlandse scholier werkt. Subtiele
   25–28px ruitlijnen als textuur op hero-/focusvlakken (CSS, bijna gratis).
2. **De levende mascotte** — het signature-element. Geen decoratie maar een
   metgezel die écht reageert op je voortgang (zie Avatar-states).
3. **De examenklok** — tijd als materiaal: tabulaire cijfers, de timer-ring,
   de countdown. Alle data in mono/tabular zodat cijfers nooit verspringen.

## Kleurtokens

| Token | Hex | Naam | Gebruik |
|---|---|---|---|
| `--ink` | `#0B0F1A` | Studeernacht | Donker canvas, hero, quiz |
| `--papier` | `#F6F5F0` | Examenpapier | Licht canvas (warm, geen koud wit) |
| `--vlam` | `#E8580C` | Slagio-vlam | HAVO-accent, energie, CTA (bestaand merk) |
| `--toga` | `#8B5CF6` | Toga-paars | VWO-accent (bestaand merk) |
| `--geslaagd` | `#16A34A` | Vlag-uit groen | Succes, voldoende, goed antwoord |
| `--nakijk` | `#E11D48` | Nakijkpen | Alleen functioneel (fout), nooit decoratief |

HAVO/VWO-theming blijft bestaan (functioneel); deze tokens mappen op de
bestaande CSS-variabelen (`--or`, `--bg`, …) bij de uitrol.

## Typografie

- **Display**: Bricolage Grotesque 800–900, krap gespatieerd. Spaarzaam — koppen
  en getallen die ertoe doen.
- **Body**: Inter, 15px basis, lijnhoogte 1.7.
- **Data/utility**: `ui-monospace`-stack met `font-variant-numeric: tabular-nums`
  voor timer, countdown, scores, XP. Nul extra kilobytes, cijfers staan stil.

## Avatar-states (signature, événement-gekoppeld)

| State | Trigger (echt app-event) | Beweging | Reduced-motion |
|---|---|---|---|
| idle | altijd | ademen + knipperen + spontane hop | statisch, knipperen uit |
| correct | `_kiesReveal(ok=true)` | vreugdesprong + spin | groene gloed |
| wrong | `_kiesReveal(ok=false)` | milde headshake, "geeft niks" | amber gloed |
| streak | `showCombo(combo>=3)` | dubbele bounce | oranje gloed |
| levelup | `addXP().leveled/evolved`, `showEvoReveal` | salto + flits | gouden gloed |
| celebrate | perfecte score / slagen | feest-bounce ×3 | gouden gloed + 🎉 |

De mascotte zit als **companion** in de quiz (vast, klein, pointer-events:none)
zodat de reacties zichtbaar zijn op het moment dat ze gebeuren.
Demo-route: `/index.html?avatardemo=1` — alle states handmatig triggerbaar.

## Per-vak werelden (uitrolfase — nog niet gebouwd)

Mechanisme: `data-vak="<id>"` op de schermwrapper + per vak een tokenset:
`--vak-c1/-c2` (palet), `--vak-motief` (CSS-achtergrond: blueprint-grid voor
wiskunde, molecuulrooster scheikunde, hoogtelijnen aardrijkskunde, archiefpapier
geschiedenis, celpatroon biologie, …), optioneel `--vak-motion` (bewegingskarakter).
De botten (type, spacing, componenten, navigatie, avatar) blijven identiek;
de huid verschilt per vak. AA-contrast verplicht per combinatie.

## Motion-principes

- Eén georkestreerd moment per scherm; de rest gedisciplineerd.
- Alleen `transform`/`opacity` (GPU); geen layout-thrash.
- `prefers-reduced-motion`: volwaardige statische ervaring (gloed i.p.v. beweging).
- Zwaar werk lazy; niets blokkeert first paint of de eerste oefenvraag.

## Budgetten (poortwachters)

- Mobiel-eerst (360–390px), duimbedienbaar.
- LCP < 2,5s, CLS < 0,1, 60fps op mid-range Android.
- SEO-/calculatorpagina's blijven licht; geen zware visuals daar.
- PWA/offline intact; alles statisch hostbaar.
