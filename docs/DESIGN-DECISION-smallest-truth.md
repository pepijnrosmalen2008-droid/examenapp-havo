# Ontwerpbeslissing — "Wat is de kleinste waarheid in Slagio?"

**Vraag (bewust vóór verder bouwen):** is een *semantic fact* de atomische bron waaruit concept, KU, leerdoel én content vanzelf volgen? Of is "concept" toch de betere primaire bouwsteen?
**Methode:** het voorgestelde falsifieerbare experiment — modelleer één onderwerp (enzymen) volledig met alléén atomic facts en probeer daaruit alles af te leiden. Apparatuur: `scripts/semantic.js experiment havo enzym` (labelt elke afleiding `[✓ uit feiten]` of `[⚠ kunstgreep]`).

## Uitkomst (25 feiten over "enzym")

| Afleiding | Resultaat |
|---|---|
| **Concept** | Emergeert als hub-cluster (enzym, graad 14). **Grens is een modelkeuze**, geen waarheid: op HAVO 1 concept, op VWO evt. 4 (actief-centrum, substraat, …) — zelfde feiten, andere clustering. |
| **Knowledge Units** | ✓ definitie/werking/voorwaarde/valkuil komen automatisch uit de feiten. |
| **Leerdoel — inhoud** | ✓ "Enzymwerking" = de verzameling KU's. |
| **Leerdoel — examenskill/gewicht** | ⚠ **niet uit feiten** — dat is een andere as. |
| **Samenvatting (30 sec / 1 A4)** | ✓ compositie van KU's. |
| **Uitleg (reasoning)** | ✓ `hoge-temperatuur —causes→ denaturatie —reduces→ enzymactiviteit`. |
| **Begripsvraag / misconceptie-vraag** | ✓ uit `is_a` + `often_confused_with` + `has_property(herbruikbaar)`. |
| **Examen-stijl vraag (bereken/grafiek/meerstaps)** | ⚠ **niet uit feiten** — vergt procedure, context, volgorde. |

## Verdict

**Er is niet één kleinste waarheid — er zijn er twee, orthogonaal.**

1. **Kennis-as → de semantic fact is het atoom.** Concept, KU, leerdoel-*inhoud*, samenvatting, uitleg en begripsvragen volgen overtuigend uit atomic facts. Je bevestigde vermoeden klopt: `ATP is_produced_by celademhaling` is niet verder op te splitsen, en concept/KU/leerdoel zijn **projecties** (clusterings) over de feiten. Dit is echte winst: één syllabuswijziging raakt de feiten, alle projecties volgen.

2. **Examen-as → een fact dekt dit NIET.** Twee dingen laten zich niet zonder kunstgrepen tot triples reduceren:
   - **Pedagogische metadata** (examenskill, examengewicht, vaardigheid) — *hoe* en *hoe zwaar* iets wordt getoetst. Dat is een eigenschap van het examen, niet van de kennis.
   - **Procedurele/meerstaps-examenvaardigheden** ("ontwerp een experiment", "verklaar in stappen", "bereken via een grafiek") — die bevatten volgorde en context die geen enkele triple draagt.

   Dit is precies de zorg die vooraf werd benoemd, en het experiment bevestigt hem. Deze as heeft z'n eigen atomische bron.

> Interessant: de **examenskill-laag die we bij F1 al bewust apart hielden** ís deze tweede as. Het experiment valideert die vroege keuze achteraf.

## Beslissing (disciplinair — géén rewrite nu)

Het gevaar van maandenlang verdwalen in kennisrepresentatie is reëel. Daarom:

- **Adopteer de semantic-fact-laag als de bron voor de kennis-as**, maar laat 'm **onder** het bestaande leerdoelmodel *groeien* — niet vervangen. Leerdoelen blijven de werkende, materialiseerde projectie (met de examen-as-metadata erop). Facts zijn de diepere bron die leerdoel-inhoud kan genereren/controleren.
- **Concept en leerdoel = projecties met een clustering-parameter** (HAVO- vs VWO-granulariteit uit dezelfde feiten). Vastleggen als principe, nog niet forceren.
- **Examen-as blijft een tweede, hand/expert-geauteurde bron** (examenskill, gewicht, procedurele vaardigheden). Niet proberen tot facts te reduceren.
- **Naam volgt de lading:** de Curriculum Engine is voor de kennis-as een *Knowledge Modeling Engine*; de examen-as blijft de *Curriculum/Exam Engine*. Twee bronnen, één gekoppeld model.

## Bewijskracht & grens

Het experiment lukte **overtuigend voor declaratieve kennis** en **faalde eerlijk voor de examen-as** — dat is sterk bewijs dat de extra abstractielaag de moeite waard is *voor de kennis-as*, en tegelijk een duidelijke grens: niet elk onderwijsdoel reduceert tot triples. Volgende bewijsstap (klein, niet groot): breid uit naar **één verbonden concept** (osmose deelt celmembraan/concentratieverschil) om te toetsen of de graaf vak-overstijgend samenhangt — vóór enige opschaling.
