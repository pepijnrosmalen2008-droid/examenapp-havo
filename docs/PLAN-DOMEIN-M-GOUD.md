# Plan: domein bi.M naar gouden standaard

Referentiemodule: **bi.M.3 Enzymwerking** (gouden standaard op 3 van 4 pijlers).
Doel: het hele domein **bi.M (Molecuul- en celniveau, 7 leerdoelen)** naar diezelfde lat, zonder de leerling te overweldigen met een platte lijst leerdoelen.

Visueel plan (artifact): zie de gepubliceerde plan-pagina "Domein M naar Goud".

## Probleem
Gouden content wordt **per leerdoel** gemaakt (rijke samenvatting, 25 gescreende vragen, curated begrippen, oud-examen). Een domein heeft er 5-10. Nu is een domein zelf de content-eenheid (bijv. bi.M heeft 111 losse vragen) en zijn er maar 5-6 domeinen per vak (behapbaar). Zodra we per domein meerdere gouden leerdoelen maken, wordt een platte leerdoellijst per vak te lang.

## Oplossing: navigatie in 3 lagen (progressive disclosure)
1. **Vak -> domeinen** (bestaat al, `sc-detail`, 5-6 kaarten).
2. **Domein -> leerdoelen** (NIEUW scherm): leerdoelkaarten met gouden-status + progressie, plus "hele domein gemengd oefenen" (de bestaande bulk-bank).
3. **Leerdoel -> studeren** (leerstof/quiz/flashcards/oud-examen): huidig per-domein-gedrag verhuist één laag lager naar per-leerdoel.

Nooit meer dan ~7 keuzes per scherm.

## Datamodel (achterwaarts compatibel)
- Nu: `domein = { id, naam, sam, sv[], oe[], begrippen[] }`.
- Straks: `domein = { id, naam, leerdoelen:[ { id, naam, sam, sv[], oe[], begrippen[] } ], sam?, sv?, oe?, begrippen? }`.
- Renderregel: heeft een domein `leerdoelen` -> toon scherm 2; zo niet -> gedraag je als vandaag. Bestaande vakken breken niet; we migreren domein voor domein.
- Opruimactie: **M3 hangt er nu als nep-broertje van M in** -> verhuizen naar `M.leerdoelen[]` als leerdoel `M.3`.

## Nulmeting bi.M.3 (4 pijlers)
| Pijler | Status |
|---|---|
| Samenvatting | Goud (14 KB, hoofdstukken, 4 clips, figuren, begrippenlijst) |
| Snelle quiz | Goud (25 vragen R1 11 / R2 10 / R3 4, per-optie uitleg, poort groen) |
| Begrippen | Goud (10 curated term->definitie, flashcard-bron SM-2, gegate) |
| Oud-examen | Deels (6 examen-stijl + 1 echte CE; figuren geblokkeerd door PDF-muur, DoD §8) |

De poort `scripts/validate-goldstandard.mjs` dwingt 3 van de 4 pijlers af.

## Roadmap domein bi.M (7 leerdoelen)
- **M.3 Enzymwerking** - GOUD (referentie)
- **M.2 Fotosynthese & celademhaling** - volgende (clip-rijk, hoog examenrendement; tweede bewijs)
- **M.1 Celorganellen & hun functies** - nog
- **M.4 Cel- & kerndeling (mitose & meiose)** - nog
- **M.5 DNA: structuur, replicatie, transcriptie & translatie** - nog (zwaarste)
- **M.6 Mutaties & genexpressie** - nog
- **M.7 Genetica: Mendelse overerving & stambomen** - nog

Elk leerdoel = de bi.M.3-blauwdruk en moet door de poort; toevoegen aan `GOLDEN[]`.

## Volgorde
0. **Fundament (één build):** datamodel `leerdoelen[]` + scherm 2 + statusbadges + M.3 verhuizen. Niets breekt.
1. **Tweede bewijs:** M.2 Fotosynthese volledig naar goud, live getest.
2. **Cadans:** M.1, M.4, M.5, M.6, M.7 - één per keer, elk gegate. Domein M compleet = eerste gouden domein.
3. **Sjabloon:** zelfde aanpak op O en P, daarna andere vakken.

Kwaliteit boven tempo blijft de regel (DoD §6.4). Eén gouden leerdoel is echt werk; eerst fundament + één tweede bewijs, dan cadans bepalen.
