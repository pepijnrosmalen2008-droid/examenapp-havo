# Content-uitbreiding — dagelijkse wachtrij

> **Doel:** elk domein naar de "gouden standaard" tillen die Havo Biologie heeft —
> leerdoelen, rijke samenvatting, begrippen, gegenereerde SV-vragen, misconcepties
> en (waar te koppelen) oud-examen. Eén domein per dag, automatisch.
>
> **Referentie / lat:** `docs/SLICE0-DEFINITION-OF-DONE.md` (de 5 gate-groepen) en de
> gouden module `bi_M` (`docs/SLICE0-PROEFSNEDE-bi.M.3.md`). Havo Biologie is al klaar.

## Hoe de dagelijkse taak werkt
Elke dag pakt een verse sessie **het bovenste openstaande domein** (`- [ ]`) en:
1. Schrijft/verbetert de **rijke samenvatting** (SAM_RICH) voor dat domein — vaste
   structuur, accuraat, geen opvulling (gate-groep B).
2. Cureert **begrippen** + definieert **leerdoelen** met `_meta.reviewStatus:'reviewed'`
   (niet `approved` — de syllabuscheck blijft een menselijke stap).
3. Draait de engine: `node scripts/build-questions.js` → `node scripts/split-data.js`.
4. **QA-poorten** (verplicht groen vóór push): `node scripts/build-questions.js --check`,
   `node scripts/validate-content.mjs`, `node scripts/smoke.mjs` (incl. gouden-standaard-poort).
5. Bumpt de SW-cache, vinkt het domein hieronder af (`- [x]`), commit + push naar `main`.
   **Bij een rode poort: niet pushen, wél melden.**

> Volgorde: grootste examenvakken eerst (per vak: havo → vwo → vmbo).
> Voortgang: **4 / 220** klaar (gouden referentie). Pas dit blok bij elke afronding aan.

---

- [ ] **HAVO · Nederlands** (`nl`) · domein A — Leesvaardigheid
- [ ] **HAVO · Nederlands** (`nl`) · domein B — Mondelinge taalvaardigheid
- [ ] **HAVO · Nederlands** (`nl`) · domein C — Schrijfvaardigheid
- [ ] **HAVO · Nederlands** (`nl`) · domein D — Samenvatten
- [ ] **HAVO · Nederlands** (`nl`) · domein E — Argumentatieve vaardigheden
- [ ] **HAVO · Nederlands** (`nl`) · domein F — Literatuur
- [ ] **VWO · Nederlands** (`nl`) · domein A — Leesvaardigheid
- [ ] **VWO · Nederlands** (`nl`) · domein B — Mondeling
- [ ] **VWO · Nederlands** (`nl`) · domein C — Schrijfvaardigheid
- [ ] **VWO · Nederlands** (`nl`) · domein D — Argumentatieve vaardigheden
- [ ] **VWO · Nederlands** (`nl`) · domein E — Literatuur
- [ ] **VMBO · Nederlands** (`nl`) · domein A — Luister- en kijkvaardigheid
- [ ] **VMBO · Nederlands** (`nl`) · domein B — Spreek- en gespreksvaardigheid
- [ ] **VMBO · Nederlands** (`nl`) · domein C — Leesvaardigheid
- [ ] **VMBO · Nederlands** (`nl`) · domein D — Schrijfvaardigheid
- [ ] **VMBO · Nederlands** (`nl`) · domein E — Fictie
- [ ] **HAVO · Engels** (`en`) · domein A — Woordenschat & grammatica
- [ ] **HAVO · Engels** (`en`) · domein B — Leesvaardigheid
- [ ] **HAVO · Engels** (`en`) · domein C — Kijk- en luistervaardigheid
- [ ] **HAVO · Engels** (`en`) · domein D — Gespreksvaardigheid
- [ ] **HAVO · Engels** (`en`) · domein E — Schrijfvaardigheid
- [ ] **HAVO · Engels** (`en`) · domein F — Literatuur
- [ ] **VWO · Engels** (`en`) · domein A — Leesvaardigheid
- [ ] **VWO · Engels** (`en`) · domein B — Kijk-/Luistervaardigheid
- [ ] **VWO · Engels** (`en`) · domein C — Gespreksvaardigheid
- [ ] **VWO · Engels** (`en`) · domein D — Schrijfvaardigheid
- [ ] **VWO · Engels** (`en`) · domein E — Literatuur
- [ ] **VMBO · Engels** (`en`) · domein A — Leesvaardigheid
- [ ] **VMBO · Engels** (`en`) · domein B — Luister- en kijkvaardigheid
- [ ] **VMBO · Engels** (`en`) · domein C — Gespreksvaardigheid
- [ ] **VMBO · Engels** (`en`) · domein D — Schrijfvaardigheid
- [ ] **HAVO · Wiskunde A** (`wa`) · domein A — Vaardigheden
- [ ] **HAVO · Wiskunde A** (`wa`) · domein B — Algebra en tellen
- [ ] **HAVO · Wiskunde A** (`wa`) · domein C — Verbanden en functies
- [ ] **HAVO · Wiskunde A** (`wa`) · domein D — Verandering
- [ ] **HAVO · Wiskunde A** (`wa`) · domein E — Statistiek
- [ ] **HAVO · Wiskunde B** (`wb`) · domein A — Vaardigheden
- [ ] **HAVO · Wiskunde B** (`wb`) · domein B — Functies, grafieken en vergelijkingen
- [ ] **HAVO · Wiskunde B** (`wb`) · domein C — Meetkundige berekeningen
- [ ] **HAVO · Wiskunde B** (`wb`) · domein D — Toegepaste analyse
- [ ] **HAVO · Wiskunde B** (`wb`) · domein E — Meetkunde
- [ ] **VWO · Wiskunde A** (`wa`) · domein A — Vaardigheden
- [ ] **VWO · Wiskunde A** (`wa`) · domein B — Algebra en tellen
- [ ] **VWO · Wiskunde A** (`wa`) · domein C — Verbanden
- [ ] **VWO · Wiskunde A** (`wa`) · domein D — Verandering
- [ ] **VWO · Wiskunde A** (`wa`) · domein E — Statistiek en kansrekening
- [ ] **VWO · Wiskunde A** (`wa`) · domein F — Keuzeonderwerpen
- [ ] **VWO · Wiskunde B** (`wb`) · domein A — Vaardigheden
- [ ] **VWO · Wiskunde B** (`wb`) · domein B — Functies, grafieken en vergelijkingen
- [ ] **VWO · Wiskunde B** (`wb`) · domein C — Differentiaal- en integraalrekening
- [ ] **VWO · Wiskunde B** (`wb`) · domein D — Goniometrische functies
- [ ] **VWO · Wiskunde B** (`wb`) · domein E — Meetkunde met coördinaten
- [ ] **VWO · Wiskunde B** (`wb`) · domein F — Keuzeonderwerpen
- [ ] **VMBO · Wiskunde** (`wi`) · domein A — Algebraïsche verbanden
- [ ] **VMBO · Wiskunde** (`wi`) · domein B — Rekenen, meten en schatten
- [ ] **VMBO · Wiskunde** (`wi`) · domein C — Meetkunde
- [ ] **VMBO · Wiskunde** (`wi`) · domein D — Informatieverwerking, statistiek
- [ ] **VMBO · Wiskunde** (`wi`) · domein E — Geïntegreerde wiskundige activiteiten
- [ ] **HAVO · Bedrijfseconomie** (`be`) · domein B — Van persoon naar rechtspersoon
- [ ] **HAVO · Bedrijfseconomie** (`be`) · domein C — Interne organisatie
- [ ] **HAVO · Bedrijfseconomie** (`be`) · domein D — Marketing
- [ ] **HAVO · Bedrijfseconomie** (`be`) · domein E — Financieel beleid
- [ ] **HAVO · Bedrijfseconomie** (`be`) · domein F — Verslaggeving
- [ ] **HAVO · Economie** (`ec`) · domein B — Concept Schaarste
- [ ] **HAVO · Economie** (`ec`) · domein C — Markt
- [ ] **HAVO · Economie** (`ec`) · domein D — Overheid en bestuur
- [ ] **HAVO · Economie** (`ec`) · domein E — Goede tijden, slechte tijden
- [ ] **VWO · Economie** (`ec`) · domein A — Vaardigheden
- [ ] **VWO · Economie** (`ec`) · domein B — Schaarste
- [ ] **VWO · Economie** (`ec`) · domein C — Ruil
- [ ] **VWO · Economie** (`ec`) · domein D — Markt
- [ ] **VWO · Economie** (`ec`) · domein E — Ruilen over de tijd
- [ ] **VWO · Economie** (`ec`) · domein F — Samenwerken en onderhandelen
- [ ] **VWO · Economie** (`ec`) · domein G — Risico en informatie
- [ ] **VWO · Economie** (`ec`) · domein H — Welvaart en groei
- [ ] **VWO · Economie** (`ec`) · domein I — Goede tijden, slechte tijden
- [ ] **VMBO · Economie** (`ec`) · domein A — Consumptie
- [ ] **VMBO · Economie** (`ec`) · domein B — Consumptie en consumentenorganisaties
- [ ] **VMBO · Economie** (`ec`) · domein C — Arbeid en productie
- [ ] **VMBO · Economie** (`ec`) · domein D — Arbeid en bedrijf
- [ ] **VMBO · Economie** (`ec`) · domein E — Overheid en bestuur
- [ ] **VMBO · Economie** (`ec`) · domein F — Internationale ontwikkelingen
- [ ] **VMBO · Economie** (`ec`) · domein G — Natuur en milieu
- [ ] **VMBO · Economie** (`ec`) · domein H — Verrijkingsstof (geld- en bankwezen)
- [ ] **VMBO · Economie** (`ec`) · domein I — Ondernemen
- [x] **HAVO · Biologie** · domein A — Vaardigheden en onderzoek  `(gouden referentie — al klaar)`
- [x] **HAVO · Biologie** · domein M — Molecuul- en celniveau  `(gouden referentie — al klaar)`
- [x] **HAVO · Biologie** · domein O — Orgaan- en organismeniveau  `(gouden referentie — al klaar)`
- [x] **HAVO · Biologie** · domein P — Populatie- en ecosysteemniveau  `(gouden referentie — al klaar)`
- [ ] **VWO · Biologie** (`bi`) · domein A — Vaardigheden
- [ ] **VWO · Biologie** (`bi`) · domein B — Zelfregulatie
- [ ] **VWO · Biologie** (`bi`) · domein C — Zelforganisatie
- [ ] **VWO · Biologie** (`bi`) · domein D — Interactie
- [ ] **VWO · Biologie** (`bi`) · domein E — Reproductie
- [ ] **VWO · Biologie** (`bi`) · domein F — Evolutie
- [ ] **VMBO · Biologie** (`bi`) · domein A — Cellen aan de basis
- [ ] **VMBO · Biologie** (`bi`) · domein B — In stand houden van het organisme
- [ ] **VMBO · Biologie** (`bi`) · domein C — Planten, dieren en hun samenhang
- [ ] **VMBO · Biologie** (`bi`) · domein D — Mensen beïnvloeden hun omgeving
- [ ] **VMBO · Biologie** (`bi`) · domein E — Houding en beweging
- [ ] **VMBO · Biologie** (`bi`) · domein F — Het lichaam in werking
- [ ] **VMBO · Biologie** (`bi`) · domein G — Bio-wetenschappen en maatschappij
- [ ] **HAVO · Geschiedenis** (`gs`) · domein A — Historisch besef
- [ ] **HAVO · Geschiedenis** (`gs`) · domein B — Oriëntatiekennis
- [ ] **HAVO · Geschiedenis** (`gs`) · domein C — Thema's
- [ ] **HAVO · Geschiedenis** (`gs`) · domein D — Rechtsstaat & parlementaire democratie
- [ ] **HAVO · Geschiedenis** (`gs`) · domein E — Oriëntatie op studie en beroep
- [ ] **VWO · Geschiedenis** (`gs`) · domein A — Historisch besef
- [ ] **VWO · Geschiedenis** (`gs`) · domein B — Oriëntatiekennis (tijdvakken)
- [ ] **VWO · Geschiedenis** (`gs`) · domein C — Thema's
- [ ] **VWO · Geschiedenis** (`gs`) · domein D — Geschiedenis van de rechtsstaat en van de parlementaire democratie
- [ ] **VWO · Geschiedenis** (`gs`) · domein E — Oriëntatie op studie en beroep
- [ ] **VMBO · Geschiedenis & staatsinrichting** (`gs`) · domein A — Cultuur en mentaliteit
- [ ] **VMBO · Geschiedenis & staatsinrichting** (`gs`) · domein B — Staatsinrichting van Nederland
- [ ] **VMBO · Geschiedenis & staatsinrichting** (`gs`) · domein C — De industriële samenleving in Nederland
- [ ] **VMBO · Geschiedenis & staatsinrichting** (`gs`) · domein D — Sociale zekerheid en verzorgingsstaat
- [ ] **VMBO · Geschiedenis & staatsinrichting** (`gs`) · domein E — Cultureel-mentale ontwikkelingen na 1945
- [ ] **VMBO · Geschiedenis & staatsinrichting** (`gs`) · domein F — Kolonisatie en dekolonisatie
- [ ] **VMBO · Geschiedenis & staatsinrichting** (`gs`) · domein G — Historisch overzicht vanaf 1900
- [ ] **VMBO · Geschiedenis & staatsinrichting** (`gs`) · domein H — Europa en de wereld
- [ ] **VMBO · Geschiedenis & staatsinrichting** (`gs`) · domein I — Verrijkingsstof geschiedenis
- [ ] **HAVO · Scheikunde** (`sk`) · domein A — Vaardigheden en onderzoek
- [ ] **HAVO · Scheikunde** (`sk`) · domein B — Stoffen en materialen
- [ ] **HAVO · Scheikunde** (`sk`) · domein C — Chemische processen
- [ ] **HAVO · Scheikunde** (`sk`) · domein D — Koolstofchemie
- [ ] **HAVO · Scheikunde** (`sk`) · domein E — Chemie en samenleving
- [ ] **VWO · Scheikunde** (`sk`) · domein A — Vaardigheden
- [ ] **VWO · Scheikunde** (`sk`) · domein B — Stoffen en materialen in de chemie
- [ ] **VWO · Scheikunde** (`sk`) · domein C — Chemische processen en behoudswetten
- [ ] **VWO · Scheikunde** (`sk`) · domein D — Ontwikkelen van chemische kennis
- [ ] **VWO · Scheikunde** (`sk`) · domein E — Innovatie en chemisch onderzoek
- [ ] **VWO · Scheikunde** (`sk`) · domein F — Industriële (chemische) processen
- [ ] **VWO · Scheikunde** (`sk`) · domein G — Maatschappij, chemie en technologie
- [ ] **HAVO · Natuurkunde** (`na`) · domein A — Vaardigheden
- [ ] **HAVO · Natuurkunde** (`na`) · domein B — Golven
- [ ] **HAVO · Natuurkunde** (`na`) · domein C — Beweging en wisselwerking
- [ ] **HAVO · Natuurkunde** (`na`) · domein D — Lading en veld
- [ ] **HAVO · Natuurkunde** (`na`) · domein E — Straling en materie
- [ ] **VWO · Natuurkunde** (`na`) · domein A — Vaardigheden
- [ ] **VWO · Natuurkunde** (`na`) · domein B — Golven
- [ ] **VWO · Natuurkunde** (`na`) · domein C — Beweging en wisselwerking
- [ ] **VWO · Natuurkunde** (`na`) · domein D — Lading en veld
- [ ] **VWO · Natuurkunde** (`na`) · domein E — Straling en materie
- [ ] **VWO · Natuurkunde** (`na`) · domein F — Quantumwereld en relativiteit
- [ ] **VWO · Natuurkunde** (`na`) · domein G — Leven en Aarde
- [ ] **VWO · Natuurkunde** (`na`) · domein H — Natuurwetten en modellen
- [ ] **VWO · Natuurkunde** (`na`) · domein I — Onderzoek en ontwerp
- [ ] **VMBO · Natuur- en scheikunde 1** (`na1`) · domein A — Stoffen en materialen
- [ ] **VMBO · Natuur- en scheikunde 1** (`na1`) · domein B — Elektrische energie
- [ ] **VMBO · Natuur- en scheikunde 1** (`na1`) · domein C — Verbranden en verwarmen
- [ ] **VMBO · Natuur- en scheikunde 1** (`na1`) · domein D — Licht en beeld
- [ ] **VMBO · Natuur- en scheikunde 1** (`na1`) · domein E — Geluid
- [ ] **VMBO · Natuur- en scheikunde 1** (`na1`) · domein F — Kracht en veiligheid
- [ ] **VMBO · Natuur- en scheikunde 1** (`na1`) · domein G — Bouw van de materie
- [ ] **VMBO · Natuur- en scheikunde 1** (`na1`) · domein H — Straling en stralingsbescherming
- [ ] **VMBO · Natuur- en scheikunde 1** (`na1`) · domein I — Weer en klimaat
- [ ] **VMBO · Natuur- en scheikunde 2** (`na2`) · domein A — Stoffen en materialen in de omgeving
- [ ] **VMBO · Natuur- en scheikunde 2** (`na2`) · domein B — Bouw van de stoffen
- [ ] **VMBO · Natuur- en scheikunde 2** (`na2`) · domein C — Chemische reacties
- [ ] **VMBO · Natuur- en scheikunde 2** (`na2`) · domein D — Verbranden en milieu
- [ ] **VMBO · Natuur- en scheikunde 2** (`na2`) · domein E — Productieprocessen en toepassingen
- [ ] **VMBO · Natuur- en scheikunde 2** (`na2`) · domein F — Productonderzoek
- [ ] **VMBO · Natuur- en scheikunde 2** (`na2`) · domein G — Grondstoffen en synthese product
- [ ] **HAVO · Aardrijkskunde** (`ak`) · domein A — Vaardigheden
- [ ] **HAVO · Aardrijkskunde** (`ak`) · domein B — Wereld
- [ ] **HAVO · Aardrijkskunde** (`ak`) · domein C — Aarde
- [ ] **HAVO · Aardrijkskunde** (`ak`) · domein D — Ontwikkelingsland
- [ ] **HAVO · Aardrijkskunde** (`ak`) · domein E — Leefomgeving
- [ ] **VWO · Aardrijkskunde** (`ak`) · domein A — Vaardigheden
- [ ] **VWO · Aardrijkskunde** (`ak`) · domein B — Wereld
- [ ] **VWO · Aardrijkskunde** (`ak`) · domein C — Aarde
- [ ] **VWO · Aardrijkskunde** (`ak`) · domein D — Gebied (ontwikkelingsregio)
- [ ] **VWO · Aardrijkskunde** (`ak`) · domein E — Leefomgeving (Nederland)
- [ ] **VMBO · Aardrijkskunde** (`ak`) · domein A — Weer en klimaat
- [ ] **VMBO · Aardrijkskunde** (`ak`) · domein B — Water
- [ ] **VMBO · Aardrijkskunde** (`ak`) · domein C — Bevolking en ruimte
- [ ] **VMBO · Aardrijkskunde** (`ak`) · domein D — Arm en rijk
- [ ] **VMBO · Aardrijkskunde** (`ak`) · domein E — Ruimtelijke ordening
- [ ] **VMBO · Aardrijkskunde** (`ak`) · domein F — Grenzen en identiteit
- [ ] **VMBO · Aardrijkskunde** (`ak`) · domein G — Verrijkingsstof / regiostudies
- [ ] **HAVO · Maatschappijwetenschappen** (`mw`) · domein A — Vaardigheden en werkwijzen
- [ ] **HAVO · Maatschappijwetenschappen** (`mw`) · domein B — Twee sociaalwetenschappelijke benaderingen
- [ ] **HAVO · Maatschappijwetenschappen** (`mw`) · domein C — Politieke besluitvorming
- [ ] **HAVO · Maatschappijwetenschappen** (`mw`) · domein D — Maatschappelijke vraagstukken
- [ ] **VWO · Maatschappijwetenschappen** (`mw`) · domein A — Vaardigheden
- [ ] **VWO · Maatschappijwetenschappen** (`mw`) · domein B — Vorming
- [ ] **VWO · Maatschappijwetenschappen** (`mw`) · domein C — Verhouding
- [ ] **VWO · Maatschappijwetenschappen** (`mw`) · domein D — Binding
- [ ] **VWO · Maatschappijwetenschappen** (`mw`) · domein E — Verandering
- [ ] **VMBO · Maatschappijkunde** (`ma`) · domein A — Politiek en beleid
- [ ] **VMBO · Maatschappijkunde** (`ma`) · domein B — Mens en werk
- [ ] **VMBO · Maatschappijkunde** (`ma`) · domein C — De multiculturele samenleving
- [ ] **VMBO · Maatschappijkunde** (`ma`) · domein D — Criminaliteit en rechtsstaat
- [ ] **VMBO · Maatschappijkunde** (`ma`) · domein E — Massamedia en pluriforme samenleving
- [ ] **VMBO · Maatschappijkunde** (`ma`) · domein F — Technologie en samenleving
- [ ] **VMBO · Maatschappijkunde** (`ma`) · domein G — Analyse van een maatschappelijk vraagstuk
- [ ] **VWO · Duits** (`du`) · domein A — Leesvaardigheid
- [ ] **VWO · Duits** (`du`) · domein B — Luistervaardigheid
- [ ] **VWO · Duits** (`du`) · domein C — Schrijfvaardigheid
- [ ] **VWO · Duits** (`du`) · domein D — Gespreksvaardigheid
- [ ] **VWO · Duits** (`du`) · domein E — Literatuur
- [ ] **VMBO · Duits** (`du`) · domein A — Leesvaardigheid
- [ ] **VMBO · Duits** (`du`) · domein B — Luister- en kijkvaardigheid
- [ ] **VMBO · Duits** (`du`) · domein C — Gespreksvaardigheid
- [ ] **VMBO · Duits** (`du`) · domein D — Schrijfvaardigheid
- [ ] **VWO · Frans** (`fr`) · domein A — Leesvaardigheid
- [ ] **VWO · Frans** (`fr`) · domein B — Luistervaardigheid
- [ ] **VWO · Frans** (`fr`) · domein C — Schrijfvaardigheid
- [ ] **VWO · Frans** (`fr`) · domein D — Gespreksvaardigheid
- [ ] **VWO · Frans** (`fr`) · domein E — Literatuur
- [ ] **VMBO · Frans** (`fa`) · domein A — Leesvaardigheid
- [ ] **VMBO · Frans** (`fa`) · domein B — Luister- en kijkvaardigheid
- [ ] **VMBO · Frans** (`fa`) · domein C — Gespreksvaardigheid
- [ ] **VMBO · Frans** (`fa`) · domein D — Schrijfvaardigheid
- [ ] **VWO · Informatica** (`in`) · domein A — Algoritmisch Denken
- [ ] **VWO · Informatica** (`in`) · domein B — Systemen & Netwerken
- [ ] **VWO · Latijn** (`la`) · domein A — Taal & Vertalen
- [ ] **VWO · Latijn** (`la`) · domein B — Literatuur & Cultuur
- [ ] **VWO · Grieks** (`gr`) · domein A — Taal & Vertalen
- [ ] **VWO · Grieks** (`gr`) · domein B — Literatuur & Cultuur