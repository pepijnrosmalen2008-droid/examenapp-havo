# Kwaliteitsmodel — de leervraag

**De volgende fundamentele vraag is niet technisch maar onderwijskundig:** wat maakt een leervraag *goed*? Dit model definieert dat expliciet, per dimensie, met de **controlemethode** (regel / model / mens). Zo staat de kwaliteitslat vast — **onafhankelijk van welk AI-model** je later gebruikt. Een generator (mens of LLM) mag veranderen; deze criteria niet.

De Evaluation Engine meet de `regel`-dimensies nu; `model`/`mens` zijn pluggable. De evaluator **beslist niet** — hij levert `{score, issues, warnings, metrics}`; de pipeline past beleid toe.

## A. Structurele kwaliteit — controle: **regel** (gebouwd)

| # | Dimensie | Criterium | Metric / issue |
|---|---|---|---|
| A1 | Eén juist antwoord | precies één geldige, gemarkeerde optie | `invalid_answer` |
| A2 | Vier opties | 4 antwoordopties (HAVO-conventie) | — |
| A3 | Geen dubbele opties | alle opties uniek (anders ambigu) | `duplicate_options` |
| A4 | Uitleg aanwezig | niet-triviale `u` (didactische terugkoppeling) | `missing_explanation` |
| A5 | Moeilijkheid vastgelegd | `d ∈ {1,2,3}` | `difficulty_missing` |
| A6 | Geen lengte-bias | juist antwoord niet stelselmatig het langst (tell) | `length_bias` |
| A7 | Evenwichtige antwoordpositie | verdeling A/B/C/D niet scheef | `answer_position_bias` |
| A8 | Geen duplicaten | geen identieke stam binnen het vak | `duplicate_questions` |
| A9 | Leerdoel-koppeling | gekoppeld (matched), niet unmatched/off_level | `unmatched_couplings` |

## B. Inhoudelijke kwaliteit — controle: **model + mens** (pluggable, nog niet actief)

| # | Dimensie | Wat het toetst | Controle |
|---|---|---|---|
| B1 | Vakinhoudelijke juistheid | is de bewering feitelijk juist? | model → mens (steekproef) |
| B2 | Afstemming op leerdoel | toetst de vraag écht dít leerdoel? | model (semantic facts + leerdoel) |
| B3 | Passende examenskill | matcht de vraagvorm de `examenskill`? | model |
| B4 | Passend niveau | difficulty ↔ leerling-foutratio (mastery-data) | data + model |
| B5 | Goede afleiders | plausibel maar onjuist, liefst op een **misconceptie** gebaseerd | model (uit `veelgemaakteFouten`) |
| B6 | Heldere formulering | eenduidig, geen dubbele ontkenningen, examen-Nederlands | model |
| B7 | Toegevoegde leerwaarde | leert de leerling iets, of test het alleen een woord? | mens |
| B8 | Lijkt op een echte CE-vraag | stijl/vorm van het centraal examen | model → mens |

## Hoe de pipeline dit gebruikt

De Evaluation Engine geeft per vraag/vak de score + issues + warnings + metrics. Het **beleid** (los, in de pipeline) beslist:

```
accepteer   als score>=95 AND issues=[]            → question-store
review      als issues=[] AND warnings!=[]         → human review queue
afkeuren    als issues!=[]                         → terug naar generator / owner
```

Beleid is verwisselbaar zonder de evaluator aan te raken. De criteria (dit model) zijn de stabiele laag.

## Baseline

De huidige structurele meting is bevroren als **onafhankelijke referentie** (`knowledge/evaluation-baseline-havo.json`). De evaluator vond die problemen *voordat* er iets is aangepast — bewijs dat hij niet is ontworpen om alleen eigen output goed te keuren. Latere verbeteringen worden meetbaar: *"de score steeg van 95,1 naar X."*
