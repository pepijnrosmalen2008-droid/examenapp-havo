# Content-uitbreiding: dagelijkse wachtrij (per leerdoel, gouden standaard v2)

> **De lat:** `docs/GOUDEN-STANDAARD-V2.md`. Eén leerdoel krijgt wat vroeger een heel domein
> kreeg: samenvatting met beeld per hoofdstuk, 25+ vragen met uitleg per fout antwoord en
> onderwerp-tags voor adaptief oefenen, 10+ begrippen, 5 examenvragen.
> **Referentie:** havo bi.M3 Enzymwerking (`content-pending/havo-bi-M3.json` + `.html`).

## Hoe de dagelijkse taak werkt (minimaal 5 leerdoelen per run, liefst een heel domein)
1. Pak het **bovenste open domein** (`- [ ]`) hieronder.
   - Heeft het nog geen leerdoel-regels eronder? Zet ze er eerst onder (4-8 leerdoelen, uit
     `knowledge/<niveau>/<vak>.json` of `syllabi/2027/<niveau>-<vak>.txt`), in de vorm
     `  - [ ] A1 · nl.A.1 Naam`.
   - Werk de open leerdoelen van boven naar beneden af; minimaal 5 per run, liefst het hele
     domein (max. 8). Domein af en nog geen 5? Door naar het volgende domein.
   - Per leerdoel: maken, keuren, integreren, poorten, commit en push.
2. Maak de module volgens `docs/GOUDEN-STANDAARD-V2.md` §6 (check → render + zelf bekijken →
   integreer → split → poorten).
3. Vink het leerdoel af met een korte notitie (vragen/begrippen/figuren/clip). Zijn alle
   leerdoelen van het domein af, vink dan ook het domein af.
4. Bij een rode poort: niets pushen, wél melden.

> Voortgang: **25 leerdoelen op v2** (havo bi.M3, nl.A1 t/m nl.A7, nl.B1 t/m nl.B5, nl.C1 t/m nl.C6, nl.D1 t/m nl.D6). Werk dit getal bij bij elke afronding.
> Oude stand (v1, domeinniveau): 7/220 domeinen; die tellen niet meer als af.
>
> **Omvang (okt 2026):** 220 domeinen (havo 59, vwo 84, vmbo 77) × gemiddeld ~6 leerdoelen
> = **~1.300 leerdoelen**. Bij 25-30 vragen per leerdoel is dat **~33.000-39.000 v2-vragen**,
> elk met 4 uitleggen (~140.000 uitleggen), plus ~6.500 examenvragen met modelantwoord en
> ~13.000 begrippen. Nu: 21.481 snelle-quizvragen, grotendeels gegenereerd en zonder uitleg
> per optie. Tempo bij 5-8 leerdoelen per dag: ~6,5 maand voor alles.

---

- [x] **HAVO · Nederlands** (`nl`) · domein A — Leesvaardigheid (7 van 7 leerdoelen op v2)
  - [x] A1 · nl.A.1 Tekstsoort en schrijfdoel bepalen · 28 vragen (R1-R3), 12 begrippen, 3 schema's (tekstsoorten, beslisboom, mengvorm), geen clip
  - [x] A2 · nl.A.2 Onderwerp en hoofdgedachte aangeven · 25 vragen (R1-R3), 11 begrippen, 3 schema's (onderwerp vs hoofdgedachte, tekstopbouw, 3 stappen), geen clip
  - [x] A3 · nl.A.3 Relaties tussen tekstdelen benoemen · 26 vragen (R1-R3), 12 begrippen, 4 schema's (verwijzing, oorzaak-gevolg/doel-middel, argumentatieboom, signaalwoorden), geen clip
  - [x] A4 · nl.A.4 Conclusies over de auteur trekken · 25 vragen (R1-R3), 11 begrippen, 3 schema's (intentie/opvatting/gevoel, neutraal vs beladen, tekstbewijs-stappen), geen clip
  - [x] A5 · nl.A.5 Standpunten, argumenten en schema's herkennen · 27 vragen (R1-R3), 16 begrippen, 4 schema's (feitelijk vs waarderend, structuren, zes schema's, tegenwerping), geen clip
  - [x] A6 · nl.A.6 Betoog beoordelen en drogredenen herkennen · 28 vragen (R1-R3), 18 begrippen, 4 schema's (zes beoordelingsvragen, drogredenen schema, drogredenen discussieregel, drie stappen), geen clip
  - [x] A7 · nl.A.7 Een tekst samenvatten · 25 vragen (R1-R3), 12 begrippen, 3 schema's (wat blijft/valt weg, vier stappen, controlelijst), geen clip
- [x] **HAVO · Nederlands** (`nl`) · domein B — Mondelinge taalvaardigheid (v1 op domeinniveau gedaan, nu per leerdoel naar v2) (5 van 5 leerdoelen op v2)
  - [x] B1 · nl.B.1 Informatie verzamelen en verwerken · 26 vragen (R1-R3), 12 begrippen, 3 schema's (bronbeoordeling, vier stappen, citaat/parafrase/plagiaat), geen clip
  - [x] B2 · nl.B.2 Doel, publiek en gespreksvorm bepalen · 25 vragen (R1-R3), 12 begrippen, 3 schema's (drie gespreksvormen, informeren vs overtuigen, afstemmen), geen clip
  - [x] B3 · nl.B.3 Een voordracht opbouwen en presenteren · 26 vragen (R1-R3), 12 begrippen, 4 schema's (opbouw, overgangen, houding, stem), geen clip
  - [x] B4 · nl.B.4 Deelnemen aan een discussie of debat · 26 vragen (R1-R3), 12 begrippen, 3 schema's (argument in lagen, weerleggen, slotpleidooi), geen clip
  - [x] B5 · nl.B.5 Adequaat reageren op luisteraars en deelnemers
- [x] **HAVO · Nederlands** (`nl`) · domein C — Schrijfvaardigheid (v1 op domeinniveau gedaan, nu per leerdoel naar v2) (6 van 6 leerdoelen op v2)
  - [x] C1 · nl.C.1 Informatie verzamelen, verwerken en verantwoorden · 26 vragen (R1-R3), 12 begrippen, 3 schema's (bronbeoordeling, citaat tegenover parafrase, bronvermelding), geen clip
  - [x] C2 · nl.C.2 Tekstsoort, doel en lezersgroep afstemmen · 26 vragen (R1-R3), 12 begrippen, 3 schema's (drie tekstsoorten, lezersgroepen, register), geen clip
  - [x] C3 · nl.C.3 Een betoog schrijven · 26 vragen (R1-R3), 12 begrippen, 3 schema's (stelling tegenover feit en vraag, weerlegging in stappen, opbouw), geen clip
  - [x] C4 · nl.C.4 Tekst en alinea opbouwen · 27 vragen (R1-R3), 12 begrippen, 3 schema's (alinea, tekstopbouw, signaalwoorden), geen clip
  - [x] C5 · nl.C.5 Schrijftaal, stijl en correctheid · 26 vragen (R1-R3), 12 begrippen, 3 schema's (spreek- tegenover schrijftaal, formele brief, werkwoordspelling), geen clip
  - [x] C6 · nl.C.6 Een tekst reviseren op commentaar · 26 vragen (R1-R3), 12 begrippen, 3 schema's (soorten commentaar, volgorde van revisie, afwegen), geen clip
- [x] **HAVO · Nederlands** (`nl`) · domein D — Samenvatten (6 van 6 leerdoelen op v2)
  - [x] D1 · nl.D.1 Een tekst globaal verkennen · 25 vragen (R1-R3), 12 begrippen, 3 schema's (wegwijzers, onderwerp en hoofdgedachte, aanpak), geen clip
  - [x] D2 · nl.D.2 Kernzinnen en hoofdpunten per alinea vinden · 25 vragen (R1-R3), 12 begrippen, 3 schema's (kernzin met uitwerking, wat blijft en wat weg mag, van alinea naar kern), geen clip
  - [x] D3 · nl.D.3 Verbanden en signaalwoorden gebruiken bij samenvatten · 25 vragen (R1-R3), 12 begrippen, 3 schema's (verbanden met signaalwoorden, oorzaak en gevolg, losse zinnen naar samenhang), geen clip
  - [x] D4 · nl.D.4 Beknopt schrijven in eigen woorden · 25 vragen (R1-R3), 12 begrippen, 3 schema's (generaliseren, inkorten tot de limiet, wel en niet), geen clip
  - [x] D5 · nl.D.5 Een samenvatting controleren op volledigheid en samenhang · 25 vragen (R1-R3), 12 begrippen, 3 schema's (hoofdpunten tegenover samenvatting, controlelijst, beoordelen in stappen), geen clip
  - [x] D6 · nl.D.6 Een betogende en een informatieve tekst samenvatten · 25 vragen (R1-R3), 12 begrippen, 3 schema's (samenvatting van een betoog, structuren van een uitleg, tekstsoort eerst), geen clip
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

## Opwaarderen naar v2 (bestaande v1-leerdoelmodules)
Deze modules hebben al 25 vragen en een samenvatting, maar nog niet de v2-uitleg per fout
antwoord, onderwerp-tags, casusvragen en gekeurde figuren. Zelfde werkwijze; bestaande
vragen zijn grondstof, niet heilig.

- [ ] **HAVO · Biologie** (`bi`) · domein A (opwaarderen)
  - [ ] A1 · bi.A.1 Onderzoek opzetten
  - [ ] A2 · bi.A.2 Betrouwbaarheid en validiteit beoordelen
  - [ ] A3 · bi.A.3 Data verwerken en grafieken lezen
  - [ ] A4 · bi.A.4 Correlatie versus causaliteit
  - [ ] A5 · bi.A.5 Biologisch onderzoeksgereedschap
- [ ] **HAVO · Biologie** (`bi`) · domein M (opwaarderen)
  - [ ] M1 · bi.M.1 Bouw en functie van de cel
  - [ ] M2 · bi.M.2 Transport door het celmembraan
  - [ ] M4 · bi.M.4 Fotosynthese & celademhaling
  - [ ] M5 · bi.M.5 DNA en eiwitsynthese
  - [ ] M6 · bi.M.6 Celdeling: mitose en meiose
  - [ ] M7 · bi.M.7 Erfelijkheid: allelen en overerving
- [ ] **HAVO · Biologie** (`bi`) · domein O (opwaarderen)
  - [ ] O1 · bi.O.1 Zenuwstelsel en prikkelgeleiding
  - [ ] O2 · bi.O.2 Hormonale regulatie
  - [ ] O3 · bi.O.3 Homeostase en antagonisme
  - [ ] O4 · bi.O.4 Afweer en immuniteit
  - [ ] O5 · bi.O.5 Transport en gasuitwisseling
  - [ ] O6 · bi.O.6 Spijsvertering en uitscheiding
  - [ ] O7 · bi.O.7 Beweging: gewrichten en spieren
- [ ] **HAVO · Biologie** (`bi`) · domein P (opwaarderen)
  - [ ] P1 · bi.P.1 Ecosystemen: biotische en abiotische factoren
  - [ ] P2 · bi.P.2 Voedselrelaties en energiedoorgifte
  - [ ] P3 · bi.P.3 Populatiedynamiek en draagkracht
  - [ ] P4 · bi.P.4 Relaties tussen soorten
  - [ ] P5 · bi.P.5 Successie en biodiversiteit
  - [ ] P6 · bi.P.6 Evolutie en natuurlijke selectie
- [ ] **HAVO · Natuurkunde** (`na`) · domein C (opwaarderen)
  - [ ] C1 · na.C.1 Snelheid en versnelling
  - [ ] C2 · na.C.2 Krachten herkennen
  - [ ] C3 · na.C.3 Krachten samenstellen en ontbinden
  - [ ] C4 · na.C.4 De wetten van Newton
  - [ ] C5 · na.C.5 Arbeid, energie en vermogen
  - [ ] C6 · na.C.6 Warmtetransport
- [ ] **HAVO · Natuurkunde** (`na`) · domein D (opwaarderen)
  - [ ] D1 · na.D.1 Stroom, spanning en lading
  - [ ] D2 · na.D.2 Weerstand en de wet van Ohm
  - [ ] D3 · na.D.3 Serie- en parallelschakeling
  - [ ] D4 · na.D.4 Vermogen en energie
  - [ ] D5 · na.D.5 Geleiders, isolatoren en sensoren
  - [ ] D6 · na.D.6 Elektrische veiligheid
