# Slagio content-audit

Automatische meting over `data.js` — **geen wijzigingen aangebracht**.

**Bronketen:** `sv` → snelle quiz · botsrace · multiplayer · daily challenge | `oe` → oud-examen · simulatietoets | `sam` → samenvatting · flashcards (begrippen uit `<strong>`-tags, fallback `onderwerpen`).

## Per vak

| Niveau | Vak | dom. | snelle-quiz | oud-ex. | onderw. | samenvatting (tekens) | juist=langste | opties >60t | alle-haakjes | struct.fout |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| HAVO | Aardrijkskunde | 5 | 50 | 23 | 12 | 7216 | 58% | 1 | 0 | 0 |
| HAVO | Bedrijfseconomie | 5 | 71 | 15 | 32 | 10557 | 63% | 35 | 34 | 0 |
| HAVO | Biologie | 4 | 60 | 14 | 24 | 14956 | 62% | 27 | 12 | 0 |
| HAVO | Economie | 4 | 81 | 20 | 28 | 7413 | 86% | 62 | 9 | 0 |
| HAVO | Engels | 6 | 84 | 26 | 50 | 9806 | 71% | 41 | 0 | 0 |
| HAVO | Geschiedenis | 5 | 42 | 19 | 21 | 8426 | 67% | 22 | 7 | 0 |
| HAVO | Maatschappijwetenschappen | 4 | 77 | 12 | 29 | 7677 | 82% | 60 | 3 | 0 |
| HAVO | Natuurkunde | 5 | 66 | 23 | 28 | 9494 | 62% | 32 | 18 | 0 |
| HAVO | Nederlands | 6 | 93 | 23 | 36 | 11589 | 66% | 49 | 13 | 0 |
| HAVO | Scheikunde | 5 | 75 | 15 | 36 | 12284 | 64% | 39 | 21 | 0 |
| HAVO | Wiskunde A | 5 | 50 | 15 | 21 | 12426 | 48% | 13 | 13 | 0 |
| HAVO | Wiskunde B | 5 | 72 | 15 | 23 | 10011 | 58% | 27 | 11 | 0 |
| VWO | Aardrijkskunde | 2 | 22 | 12 | 12 | 4104 | 36% | 4 | 12 | 0 |
| VWO | Biologie | 4 | 41 | 24 | 23 | 4421 | 41% | 11 | 16 | 0 |
| VWO | Duits | 5 | 51 | 10 | 27 | 3343 | 88% | 25 | 13 | 0 |
| VWO | Economie | 2 | 22 | 12 | 12 | 5108 | 41% | 9 | 12 | 0 |
| VWO | Engels | 5 | 60 | 14 | 30 | 3628 | 95% | 54 | 2 | 0 |
| VWO | Frans | 5 | 57 | 10 | 27 | 3496 | 89% | 27 | 15 | 0 |
| VWO | Geschiedenis | 2 | 26 | 12 | 12 | 4355 | 42% | 12 | 11 | 0 |
| VWO | Grieks | 2 | 24 | 7 | 12 | 3946 | 50% | 6 | 9 | 0 |
| VWO | Informatica | 2 | 24 | 12 | 12 | 3813 | 88% | 18 | 2 | 0 |
| VWO | Latijn | 2 | 30 | 7 | 12 | 3978 | 53% | 13 | 11 | 0 |
| VWO | Maatschappijwetenschappen | 2 | 27 | 12 | 12 | 4843 | 30% | 16 | 14 | 0 |
| VWO | Natuurkunde | 5 | 51 | 24 | 30 | 9661 | 47% | 25 | 10 | 0 |
| VWO | Nederlands | 5 | 65 | 21 | 31 | 3976 | 85% | 47 | 7 | 0 |
| VWO | Scheikunde | 4 | 40 | 18 | 24 | 7437 | 57% | 24 | 15 | 0 |
| VWO | Wiskunde A | 3 | 35 | 18 | 16 | 4483 | 34% | 2 | 6 | 0 |
| VWO | Wiskunde B | 3 | 32 | 18 | 16 | 5611 | 25% | 3 | 8 | 0 |

**Totaal:** 1428 snelle-quizvragen · 451 oud-examenvragen.

## Structurele risico's (échte fouten)

- **Geen** structurele fouten: geen c-index buiten bereik, geen lege of dubbele opties, alle meerkeuzevragen hebben 4 opties.

## Belangrijkste bevindingen

1. **Antwoord-lengte verklapt het juiste antwoord.** Zie kolom *juist=langste*: in de meeste vakken is het correcte antwoord de langste optie (Economie 86%, Maatschappijwetenschappen 82%, Engels 71%, Geschiedenis 67%, Nederlands 66%). Een leerling kan scoren op 'kies de langste' i.p.v. kennis. Werkt door in 4 modi via de gedeelde `sv`-pool.
2. **Te lange opties.** Kolom *opties >60t* telt vragen met minstens één optie ≥60 tekens — te veel leestijd voor een snelle quiz. De uitleg staat al in `u:`, dus inkorten kan zonder informatieverlies.
3. **Uitleg-tussen-haakjes.** Kolom *alle-haakjes*: vragen waar álle opties een verklarende '(...)' bevatten — veilig te strippen tot korte, vergelijkbare antwoorden.
4. **Structuur is gezond.** Geen kapotte vragen gevonden; de inhoud zelf is in steekproeven feitelijk correct.
5. **Oud-examenvragen zijn oefenvragen in examenstijl**, geen letterlijke CE-vragen (die zitten als PDF-archief apart). Inhoudelijk plausibel; uitbreiden en variëren is de winst.