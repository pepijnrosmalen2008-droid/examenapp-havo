#!/usr/bin/env python3
"""
Upgrade alle vakpagina's met:
1. FAQPage JSON-LD schema (Google rich snippets / People also ask)
2. BreadcrumbList JSON-LD schema
3. Betere og:description
4. Cross-links naar gerelateerde vakken in footer
"""

import re, os, json

VAKKEN_DIR = os.path.join(os.path.dirname(__file__), '..', 'vakken')

# ── Per-vak data ──────────────────────────────────────────────────────────────
# keys: slug (bestandsnaam zonder .html)
# related: max 4 slugs van gerelateerde vakken (voor cross-links)

VAKKEN = {
  # ── HAVO ──────────────────────────────────────────────────────────────────
  'havo-nederlands': {
    'name': 'Nederlands', 'level': 'HAVO', 'q': '130+', 'domains': 6,
    'exam': '12–13 mei 2026',
    'og': 'Gratis oefenen voor het HAVO CE Nederlands 2026 — 130+ vragen over argumentatieve teksten, literaire tekst en schrijfvaardigheid. Echte eindexamens 2019–2025, flashcards en simulatietoets.',
    'related': ['havo-engels', 'havo-geschiedenis', 'havo-maatschappijwetenschappen', 'havo-duits'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Nederlands HAVO?',
       'De CE-domeinen voor Nederlands HAVO zijn: Leesvaardigheid (argumentatieve tekst), Schrijfvaardigheid en Literatuur. De mondelinge opdracht is alleen SE.'),
      ('Wanneer is het Nederlands HAVO examen 2026?',
       'Het CE Nederlands HAVO eerste tijdvak is op 12 en 13 mei 2026. Deel 1 (leesvaardigheid) en deel 2 (schrijfopdracht) worden op aparte dagen afgenomen.'),
      ('Hoeveel teksten moet ik lezen bij het CE Nederlands HAVO?',
       'Bij het CE Nederlands HAVO lees je gemiddeld 4–6 teksten met in totaal 40–50 vragen. Werk efficiënt: lees eerst de vragen, dan de tekst.'),
      ('Hoe oefen ik het beste voor het CE Nederlands HAVO?',
       'Oefen gericht op tekstbegrip en argumentatiestructuur. Maak oude CE-examens (2019–2025) na en analyseer je fouten per teksttype. Op Slagio vind je 130+ oefenvragen en alle echte eindexamens gratis.'),
    ]
  },
  'havo-wiskunde-a': {
    'name': 'Wiskunde A', 'level': 'HAVO', 'q': '90+', 'domains': 4,
    'exam': '19 mei 2026',
    'og': 'Gratis oefenen voor het HAVO CE Wiskunde A 2026 — 90+ vragen over algebra, verbanden en statistiek. Echte eindexamens 2019–2025, flashcards, spaced repetition en CE simulatietoets.',
    'related': ['havo-wiskunde-b', 'havo-biologie', 'havo-economie', 'havo-scheikunde'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Wiskunde A HAVO?',
       'De CE-domeinen zijn: B (Algebra en tellen), C (Verbanden) en E (Statistiek en kansrekening). Domein D (Verandering) is alleen SE.'),
      ('Wanneer is het Wiskunde A HAVO examen 2026?',
       'Het eerste tijdvak CE Wiskunde A HAVO is op 19 mei 2026. Deel 1 (zonder rekenmachine) duurt 45 minuten, deel 2 (met grafische rekenmachine) 105 minuten.'),
      ('Is Wiskunde A makkelijker dan Wiskunde B op het HAVO?',
       'Wiskunde A richt zich op statistiek en contextrijke vraagstukken (economie, maatschappij). Wiskunde B is abstracter met meer differentiëren. Voor leerlingen zonder bèta-profiel is A toegankelijker.'),
      ('Hoe oefen ik het beste voor het CE Wiskunde A HAVO?',
       'Oefen per domein met gerichte quizzen, maak daarna oude CE-examens (2019–2025) onder tijdsdruk en leer formules met spaced repetition flashcards. Slagio biedt 90+ oefenvragen en alle echte examens gratis.'),
    ]
  },
  'havo-wiskunde-b': {
    'name': 'Wiskunde B', 'level': 'HAVO', 'q': '85+', 'domains': 4,
    'exam': '18 mei 2026',
    'og': 'Gratis oefenen voor het HAVO CE Wiskunde B 2026 — 85+ vragen over functies, differentiëren en integreren. Echte eindexamens 2019–2025, stap-voor-stap uitleg en CE simulatietoets.',
    'related': ['havo-wiskunde-a', 'havo-scheikunde', 'havo-natuurkunde', 'havo-biologie'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Wiskunde B HAVO?',
       'De CE-domeinen zijn: B (Algebra), C (Verbanden en functies), D (Verandering / differentiëren) en F (Meetkunde). Integreren zit alleen in het VWO-programma.'),
      ('Wanneer is het Wiskunde B HAVO examen 2026?',
       'Het eerste tijdvak CE Wiskunde B HAVO is op 18 mei 2026. Het examen bestaat uit twee delen: zonder en met grafische rekenmachine.'),
      ('Hoeveel procent van de leerlingen slaagt voor Wiskunde B HAVO?',
       'Wiskunde B heeft een van de lagere slagingspercentages op het HAVO. Gerichte voorbereiding per domein en veel oefenen met oude examens maakt een groot verschil.'),
      ('Hoe oefen ik differentiëren voor het HAVO CE Wiskunde B?',
       'Beheers de basisregels (kettingregel, productregel) en oefen met contextopgaven. Maak daarna oude CE-opgaven uit 2019–2025. Slagio biedt gerichte quizzen per domein en alle echte examens gratis.'),
    ]
  },
  'havo-biologie': {
    'name': 'Biologie', 'level': 'HAVO', 'q': '120+', 'domains': 5,
    'exam': '22 mei 2026',
    'og': 'Gratis oefenen voor het HAVO CE Biologie 2026 — 120+ vragen over cellen, genetica, ecologie en evolutie. Echte eindexamens 2019–2025, domein-gerichte flashcards en CE simulatietoets.',
    'related': ['havo-scheikunde', 'havo-natuurkunde', 'havo-aardrijkskunde', 'havo-maatschappijwetenschappen'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Biologie HAVO?',
       'De CE-domeinen voor Biologie HAVO zijn: B (Zelfregulatie), C (Stofwisseling), D (Reproductie), E (Gedrag) en F (Evolutie en ecologie). Domein A is vaardigheden (SE).'),
      ('Wanneer is het Biologie HAVO examen 2026?',
       'Het eerste tijdvak CE Biologie HAVO is op 22 mei 2026. Het examen duurt 3 uur en bestaat uit open en meerkeuzevragen.'),
      ('Welke onderwerpen zijn het belangrijkst voor het CE Biologie HAVO?',
       'Genetica (DNA, erfelijkheid, mutaties), celbiologie (mitose/meiose, celademhaling) en ecologie (voedselwebben, kringlopen) komen elk jaar terug. Leer ook de processchema\'s uit je hoofd.'),
      ('Hoe oefen ik voor het CE Biologie HAVO?',
       'Oefen per domein met gerichte vragen en gebruik flashcards voor begrippen en processen. Maak oude CE-examens na en analyseer fouten. Slagio biedt 120+ oefenvragen en alle echte examens gratis.'),
    ]
  },
  'havo-scheikunde': {
    'name': 'Scheikunde', 'level': 'HAVO', 'q': '100+', 'domains': 5,
    'exam': '21 mei 2026',
    'og': 'Gratis oefenen voor het HAVO CE Scheikunde 2026 — 100+ vragen over atoombouw, reacties, organische chemie en groene chemie. Echte eindexamens 2019–2025 en CE simulatietoets.',
    'related': ['havo-biologie', 'havo-natuurkunde', 'havo-wiskunde-b', 'havo-wiskunde-a'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Scheikunde HAVO?',
       'De CE-domeinen voor Scheikunde HAVO zijn: B (Koolstofchemie), C (Reacties en energie), D (Zuur-base), E (Redox) en F (Groene chemie). Domein A is vaardigheden (SE).'),
      ('Wanneer is het Scheikunde HAVO examen 2026?',
       'Het eerste tijdvak CE Scheikunde HAVO is op 21 mei 2026. Het examen bevat open vragen en meerkeuzevragen en duurt 3 uur.'),
      ('Welke formules moet ik kennen voor het CE Scheikunde HAVO?',
       'Zorg dat je rekenvragen (pH, molberekeningen, stoichiometrie) snel kunt uitvoeren. Leer de structuurformules van veelvoorkomende organische stofklassen en oxidatiegetallen van gangbare ionen.'),
      ('Hoe oefen ik voor het CE Scheikunde HAVO?',
       'Oefen rekenvragen apart van begripsvragen. Maak oude CE-examens na en let op de formulering (wat wordt er precies gevraagd). Slagio biedt 100+ oefenvragen en alle echte eindexamens gratis.'),
    ]
  },
  'havo-natuurkunde': {
    'name': 'Natuurkunde', 'level': 'HAVO', 'q': '95+', 'domains': 5,
    'exam': '27 mei 2026',
    'og': 'Gratis oefenen voor het HAVO CE Natuurkunde 2026 — 95+ vragen over beweging, krachten, energie, elektriciteit en straling. Echte eindexamens 2019–2025 en CE simulatietoets.',
    'related': ['havo-scheikunde', 'havo-wiskunde-b', 'havo-wiskunde-a', 'havo-biologie'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Natuurkunde HAVO?',
       'De CE-domeinen zijn: B (Beweging en energie), C (Trillingen en golven), D (Elektriciteit en magnetisme), E (Straling en materie) en F (Medische beeldvorming, keuzethema).'),
      ('Wanneer is het Natuurkunde HAVO examen 2026?',
       'Het eerste tijdvak CE Natuurkunde HAVO is op 27 mei 2026. Het examen duurt 3 uur; een BINAS-tabel is toegestaan.'),
      ('Moet ik BINAS kennen voor het CE Natuurkunde HAVO?',
       'Je mag de BINAS gebruiken tijdens het examen, maar je moet weten waar je wat opzoekt. Oefen om snel de juiste tabel en formule te vinden. Zonder efficiënt gebruik van BINAS verlies je kostbare tijd.'),
      ('Hoe oefen ik voor het CE Natuurkunde HAVO?',
       'Oefen met contextvragen (begrip > formule invullen) en maak oude CE-examens na. Gebruik flashcards voor eenheden en formules. Slagio biedt 95+ oefenvragen en alle echte examens gratis.'),
    ]
  },
  'havo-economie': {
    'name': 'Economie', 'level': 'HAVO', 'q': '110+', 'domains': 5,
    'exam': '26 mei 2026',
    'og': 'Gratis oefenen voor het HAVO CE Economie 2026 — 110+ vragen over schaarste, markt, overheidsbeleid, conjunctuur en internationale economie. Echte eindexamens 2019–2025.',
    'related': ['havo-bedrijfseconomie', 'havo-maatschappijwetenschappen', 'havo-wiskunde-a', 'havo-geschiedenis'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Economie HAVO?',
       'De CE-domeinen voor Economie HAVO zijn: B (Schaarste en markt), C (Overheid en markt), D (Economische kringloop en conjunctuur) en E (Internationale economie en arbeid).'),
      ('Wanneer is het Economie HAVO examen 2026?',
       'Het eerste tijdvak CE Economie HAVO is op 26 mei 2026. Het examen bevat open vragen met grafieken en berekeningen en duurt 3 uur.'),
      ('Welke grafieken moet ik kennen voor het CE Economie HAVO?',
       'De vraag-aanbodgrafiek met evenwichtsprijs, de conjunctuurcyclus, de betalingsbalans en PIB/nationale inkomensgrafieken zijn essentieel. Oefen ze te tekenen en interpreteren.'),
      ('Hoe oefen ik voor het CE Economie HAVO?',
       'Oefen open vragen waarbij je grafieken tekent en berekeningen uitvoert. Leer economische begrippen precies te definiëren. Slagio biedt 110+ oefenvragen en alle echte eindexamens 2019–2025 gratis.'),
    ]
  },
  'havo-bedrijfseconomie': {
    'name': 'Bedrijfseconomie', 'level': 'HAVO', 'q': '85+', 'domains': 4,
    'exam': '2 juni 2026',
    'og': 'Gratis oefenen voor het HAVO CE Bedrijfseconomie 2026 — 85+ vragen over financiering, kosten, opbrengsten en de onderneming. Echte eindexamens 2019–2025 en CE simulatietoets.',
    'related': ['havo-economie', 'havo-wiskunde-a', 'havo-maatschappijwetenschappen', 'havo-geschiedenis'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Bedrijfseconomie HAVO?',
       'De CE-domeinen voor Bedrijfseconomie HAVO zijn: B (De onderneming), C (Kosten, opbrengsten en resultaten), D (Financiering en investeringen) en E (Arbeid en beloning).'),
      ('Wanneer is het Bedrijfseconomie HAVO examen 2026?',
       'Het eerste tijdvak CE Bedrijfseconomie HAVO is op 2 juni 2026. Het examen bevat open vragen en berekeningen.'),
      ('Welke berekeningen komen voor op het CE Bedrijfseconomie HAVO?',
       'Kostprijsberekening, break-even analyse, liquiditeits- en solvabiliteitsratio\'s, rente- en afschrijvingsberekeningen en winst-/verliesrekeningen komen regelmatig voor.'),
      ('Hoe oefen ik voor het CE Bedrijfseconomie HAVO?',
       'Oefen rekenvragen (kosten-opbrengstenanalyse, financieringsberekeningen) en maak oude CE-examens na. Zorg dat je de begrippen scherp hebt. Slagio biedt 85+ oefenvragen gratis.'),
    ]
  },
  'havo-engels': {
    'name': 'Engels', 'level': 'HAVO', 'q': '80+', 'domains': 3,
    'exam': '14 mei 2026',
    'og': 'Gratis oefenen voor het HAVO CE Engels 2026 — 80+ vragen over leesvaardigheid en luistervaardigheid. Echte eindexamens 2019–2025 en woordenschatoefeningen op Slagio.',
    'related': ['havo-duits', 'havo-frans', 'havo-nederlands', 'havo-maatschappijwetenschappen'],
    'faqs': [
      ('Wat zijn de onderdelen van het CE Engels HAVO?',
       'Het CE Engels HAVO bestaat uit leesvaardigheid (de grootste component) en luistervaardigheid. Schrijfvaardigheid en spreken zijn onderdelen van het SE, niet het CE.'),
      ('Wanneer is het Engels HAVO examen 2026?',
       'Het eerste tijdvak CE Engels HAVO is op 14 mei 2026. Het examen duurt 3 uur.'),
      ('Hoe verbeter ik mijn leesvaardigheid voor het CE Engels HAVO?',
       'Lees elk jaar de officiële CE-examens na en oefen met zakelijke en informatieve teksten. Let op signaalwoorden (however, therefore, although) die de structuur aangeven. Oefen op Slagio met gerichte leesvragen.'),
      ('Hoeveel teksten zijn er bij het CE Engels HAVO?',
       'Het CE Engels HAVO bevat gemiddeld 6–8 teksten met in totaal 40–50 vragen. Efficiënt skimmen en scannen is essentieel.'),
    ]
  },
  'havo-duits': {
    'name': 'Duits', 'level': 'HAVO', 'q': '70+', 'domains': 3,
    'exam': '15 mei 2026',
    'og': 'Gratis oefenen voor het HAVO CE Duits 2026 — 70+ vragen over leesvaardigheid en luistervaardigheid. Echte eindexamens 2019–2025 en woordenschatoefeningen op Slagio.',
    'related': ['havo-engels', 'havo-frans', 'havo-nederlands', 'havo-geschiedenis'],
    'faqs': [
      ('Wat zijn de onderdelen van het CE Duits HAVO?',
       'Het CE Duits HAVO bestaat uit leesvaardigheid en luistervaardigheid. Schrijfvaardigheid en spreken zijn SE-onderdelen.'),
      ('Wanneer is het Duits HAVO examen 2026?',
       'Het eerste tijdvak CE Duits HAVO is op 15 mei 2026.'),
      ('Welk niveau Duits moet ik hebben voor het HAVO CE?',
       'Het CE Duits HAVO toetst op B1-niveau (Europees referentiekader). Dat betekent dat je formele en alledaagse teksten moet kunnen begrijpen.'),
      ('Hoe oefen ik leesvaardigheid Duits voor het HAVO CE?',
       'Lees Nederlandse en Duitse teksten naast elkaar, oefen met echte CE-examens en werk aan woordenschat via flashcards. Slagio biedt 70+ oefenvragen en oude eindexamens Duits gratis.'),
    ]
  },
  'havo-frans': {
    'name': 'Frans', 'level': 'HAVO', 'q': '70+', 'domains': 3,
    'exam': '16 mei 2026',
    'og': 'Gratis oefenen voor het HAVO CE Frans 2026 — 70+ vragen over leesvaardigheid en luistervaardigheid. Echte eindexamens 2019–2025 en woordenschatoefeningen op Slagio.',
    'related': ['havo-engels', 'havo-duits', 'havo-nederlands', 'havo-geschiedenis'],
    'faqs': [
      ('Wat zijn de onderdelen van het CE Frans HAVO?',
       'Het CE Frans HAVO bestaat uit leesvaardigheid en luistervaardigheid. Schrijfvaardigheid en spreken zijn SE-onderdelen.'),
      ('Wanneer is het Frans HAVO examen 2026?',
       'Het eerste tijdvak CE Frans HAVO is op 16 mei 2026.'),
      ('Welk niveau Frans moet ik hebben voor het HAVO CE?',
       'Het CE Frans HAVO toetst op B1-niveau (Europees referentiekader). Je moet zakelijke en informatieve teksten in het Frans kunnen begrijpen.'),
      ('Hoe oefen ik leesvaardigheid Frans voor het HAVO CE?',
       'Maak oude CE-examens na, oefen met onbekende teksten en gebruik flashcards voor woordenschat. Slagio biedt 70+ oefenvragen en oude eindexamens Frans gratis.'),
    ]
  },
  'havo-geschiedenis': {
    'name': 'Geschiedenis', 'level': 'HAVO', 'q': '100+', 'domains': 10,
    'exam': '25 mei 2026',
    'og': 'Gratis oefenen voor het HAVO CE Geschiedenis 2026 — 100+ vragen over alle tijdvakken, oriëntatiekennis en historische vaardigheden. Echte eindexamens 2019–2025 op Slagio.',
    'related': ['havo-maatschappijwetenschappen', 'havo-aardrijkskunde', 'havo-economie', 'havo-nederlands'],
    'faqs': [
      ('Wat zijn de domeinen voor Geschiedenis HAVO CE?',
       'Het CE Geschiedenis HAVO is gebaseerd op de tien tijdvakken (oriëntatiekennis) en een verplicht historisch overzicht. Elk jaar wordt een nieuw tijdvak als verdiepingsthema aangewezen.'),
      ('Wanneer is het Geschiedenis HAVO examen 2026?',
       'Het eerste tijdvak CE Geschiedenis HAVO is op 25 mei 2026. Het examen bevat bronvragen en open vragen over historische contexten.'),
      ('Welke tijdvakken komen voor op het CE Geschiedenis HAVO?',
       'Alle tien tijdvakken (van jagers-verzamelaars t/m de tijd van televisie en computers) kunnen voorkomen. Het examen heeft altijd een verdiepingthema; dat is van tevoren bekend.'),
      ('Hoe oefen ik voor het CE Geschiedenis HAVO?',
       'Leer de oriëntatiekennis (kenmerkende aspecten per tijdvak) uit je hoofd en oefen bronanalyse. Slagio biedt 100+ oefenvragen en alle echte eindexamens Geschiedenis gratis.'),
    ]
  },
  'havo-aardrijkskunde': {
    'name': 'Aardrijkskunde', 'level': 'HAVO', 'q': '95+', 'domains': 4,
    'exam': '20 mei 2026',
    'og': 'Gratis oefenen voor het HAVO CE Aardrijkskunde 2026 — 95+ vragen over wereld, arm en rijk, gebieden in Nederland en de rest van de wereld. Echte eindexamens 2019–2025.',
    'related': ['havo-geschiedenis', 'havo-maatschappijwetenschappen', 'havo-biologie', 'havo-economie'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Aardrijkskunde HAVO?',
       'De CE-domeinen voor Aardrijkskunde HAVO zijn: Wereld (mondiale vraagstukken), Arm en Rijk (ontwikkeling), een gebiedsgerichte case en geografische vaardigheden.'),
      ('Wanneer is het Aardrijkskunde HAVO examen 2026?',
       'Het eerste tijdvak CE Aardrijkskunde HAVO is op 20 mei 2026.'),
      ('Welke kaarten en grafieken moet ik kennen voor Aardrijkskunde HAVO?',
       'Leer wereldkaarten (klimaatgebieden, bevolkingsdichtheid, handelsstromen) en demografische grafieken (bevolkingspiramides, transitiemodel) te lezen en interpreteren.'),
      ('Hoe oefen ik voor het CE Aardrijkskunde HAVO?',
       'Combineer begripskennis met kaartlees- en analysevaardigheden. Maak oude CE-examens na en let op de vraagstelling. Slagio biedt 95+ oefenvragen en alle echte eindexamens gratis.'),
    ]
  },
  'havo-maatschappijwetenschappen': {
    'name': 'Maatschappijwetenschappen', 'level': 'HAVO', 'q': '95+', 'domains': 4,
    'exam': '28 mei 2026',
    'og': 'Gratis oefenen voor het HAVO CE Maatschappijwetenschappen 2026 — 95+ vragen over samenleving, macht, verzorgingsstaat en socialisatie. Echte eindexamens 2019–2025.',
    'related': ['havo-geschiedenis', 'havo-economie', 'havo-aardrijkskunde', 'havo-nederlands'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Maatschappijwetenschappen HAVO?',
       'De CE-domeinen zijn: B (Samenleving en individu — socialisatie, identiteit), C (Macht en besluitvorming), D (Verzorgingsstaat en solidariteit) en E (Globalisering).'),
      ('Wanneer is het Maatschappijwetenschappen HAVO examen 2026?',
       'Het eerste tijdvak CE Maatschappijwetenschappen HAVO is op 28 mei 2026.'),
      ('Hoe maak je een goede essay-vraag bij Maatschappijwetenschappen HAVO?',
       'Gebruik wetenschappelijke begrippen precies, geef zowel argumenten als tegenargumenten en kom tot een onderbouwde conclusie. Oefen met de open vragen uit oude CE-examens.'),
      ('Hoe oefen ik voor het CE Maatschappijwetenschappen HAVO?',
       'Leer begrippen exact te definiëren en te gebruiken in context. Maak oude CE-examens na en oefen de essay-structuur. Slagio biedt 95+ oefenvragen en echte eindexamens gratis.'),
    ]
  },

  # ── VWO ───────────────────────────────────────────────────────────────────
  'vwo-nederlands': {
    'name': 'Nederlands', 'level': 'VWO', 'q': '130+', 'domains': 6,
    'exam': '12–13 mei 2026',
    'og': 'Gratis oefenen voor het VWO CE Nederlands 2026 — 130+ vragen over argumentatieve teksten, literaire tekst en schrijfvaardigheid. Echte eindexamens 2019–2025 en CE simulatietoets.',
    'related': ['vwo-engels', 'vwo-geschiedenis', 'vwo-maatschappijwetenschappen', 'vwo-duits'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Nederlands VWO?',
       'De CE-domeinen voor Nederlands VWO zijn: Leesvaardigheid (argumentatieve en beschouwende teksten), Schrijfvaardigheid en Literatuur. Het niveau ligt hoger dan bij HAVO; er worden langere, complexere teksten aangeboden.'),
      ('Wanneer is het Nederlands VWO examen 2026?',
       'Het CE Nederlands VWO eerste tijdvak is op 12 en 13 mei 2026.'),
      ('Wat is het verschil tussen het CE Nederlands HAVO en VWO?',
       'VWO-teksten zijn complexer en abstracter; er wordt meer verwacht van tekstanalyse en redeneervaardheid. De schrijfopdracht vereist een hogere argumentatiegraad.'),
      ('Hoe oefen ik voor het CE Nederlands VWO?',
       'Analyseer argumentatiestructuren in complexe teksten, oefen met academisch proza en maak oude CE-examens na. Slagio biedt 130+ oefenvragen en alle echte eindexamens gratis.'),
    ]
  },
  'vwo-wiskunde-a': {
    'name': 'Wiskunde A', 'level': 'VWO', 'q': '90+', 'domains': 5,
    'exam': '19 mei 2026',
    'og': 'Gratis oefenen voor het VWO CE Wiskunde A 2026 — 90+ vragen over algebra, verbanden, statistiek en kansrekening. Echte eindexamens 2019–2025 en CE simulatietoets.',
    'related': ['vwo-wiskunde-b', 'vwo-biologie', 'vwo-economie', 'vwo-scheikunde'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Wiskunde A VWO?',
       'De CE-domeinen voor Wiskunde A VWO zijn: B (Algebra), C (Verbanden), D (Verandering) en E (Statistiek en kansrekening). VWO heeft meer kansrekening dan HAVO.'),
      ('Wanneer is het Wiskunde A VWO examen 2026?',
       'Het eerste tijdvak CE Wiskunde A VWO is op 19 mei 2026.'),
      ('Hoe verschilt Wiskunde A VWO van HAVO?',
       'VWO Wiskunde A heeft een uitgebreider statistiekprogramma (hypothesetoetsen, betrouwbaarheidsintervallen) en meer abstracte vraagstelling.'),
      ('Hoe oefen ik voor het CE Wiskunde A VWO?',
       'Oefen per domein, besteed extra aandacht aan kansrekening en hypothesetoetsen en maak oude CE-examens na. Slagio biedt 90+ oefenvragen en alle echte eindexamens gratis.'),
    ]
  },
  'vwo-wiskunde-b': {
    'name': 'Wiskunde B', 'level': 'VWO', 'q': '90+', 'domains': 5,
    'exam': '18 mei 2026',
    'og': 'Gratis oefenen voor het VWO CE Wiskunde B 2026 — 90+ vragen over functies, differentiëren, integreren en meetkunde. Echte eindexamens 2019–2025 en CE simulatietoets.',
    'related': ['vwo-wiskunde-a', 'vwo-scheikunde', 'vwo-natuurkunde', 'vwo-informatica'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Wiskunde B VWO?',
       'De CE-domeinen zijn: B (Algebra), C (Verbanden en functies), D (Verandering / differentiëren en integreren) en F (Meetkunde). VWO heeft ook G (Differentiaalvergelijkingen).'),
      ('Wanneer is het Wiskunde B VWO examen 2026?',
       'Het eerste tijdvak CE Wiskunde B VWO is op 18 mei 2026.'),
      ('Is Wiskunde B VWO moeilijk?',
       'Wiskunde B VWO is een van de moeilijkste vakken in het VWO-pakket. Systematisch oefenen per onderwerp en vroeg beginnen met oude examens maakt een groot verschil.'),
      ('Hoe oefen ik differentiëren en integreren voor VWO CE Wiskunde B?',
       'Beheers alle differentiatieregels (ketting, product, quotiënt), oefen integraalberekeningen met grenzen en maak contextopgaven. Slagio biedt 90+ oefenvragen gratis.'),
    ]
  },
  'vwo-biologie': {
    'name': 'Biologie', 'level': 'VWO', 'q': '130+', 'domains': 6,
    'exam': '22 mei 2026',
    'og': 'Gratis oefenen voor het VWO CE Biologie 2026 — 130+ vragen over cellen, genetica, ecologie, evolutie en regulatie. Echte eindexamens 2019–2025 en CE simulatietoets.',
    'related': ['vwo-scheikunde', 'vwo-natuurkunde', 'vwo-wiskunde-a', 'vwo-aardrijkskunde'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Biologie VWO?',
       'De CE-domeinen voor Biologie VWO zijn: B (Zelfregulatie), C (Stofwisseling), D (Reproductie), E (Gedrag), F (Evolutie) en G (Ecologie). VWO heeft meer diepgang dan HAVO, met name in genetica en fysiologie.'),
      ('Wanneer is het Biologie VWO examen 2026?',
       'Het eerste tijdvak CE Biologie VWO is op 22 mei 2026.'),
      ('Wat is het verschil tussen Biologie HAVO en VWO qua stof?',
       'VWO gaat dieper in op moleculaire biologie (DNA-technieken, eiwitsynthese, regulatiemechanismen) en populatiegenetica. De vragen zijn abstracter en vereisen meer redeneren.'),
      ('Hoe oefen ik voor het CE Biologie VWO?',
       'Leer processen stap voor stap begrijpen (niet alleen memoriseren), oefen met schema\'s en maak oude CE-examens na. Slagio biedt 130+ oefenvragen en alle echte eindexamens gratis.'),
    ]
  },
  'vwo-scheikunde': {
    'name': 'Scheikunde', 'level': 'VWO', 'q': '110+', 'domains': 6,
    'exam': '21 mei 2026',
    'og': 'Gratis oefenen voor het VWO CE Scheikunde 2026 — 110+ vragen over atoombouw, organische chemie, redox, evenwichten en groene chemie. Echte eindexamens 2019–2025.',
    'related': ['vwo-biologie', 'vwo-natuurkunde', 'vwo-wiskunde-b', 'vwo-wiskunde-a'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Scheikunde VWO?',
       'De CE-domeinen zijn: B (Koolstofchemie), C (Reacties en energie), D (Zuur-base), E (Redox), F (Evenwichten) en G (Groene chemie). VWO heeft meer evenwichtschemie dan HAVO.'),
      ('Wanneer is het Scheikunde VWO examen 2026?',
       'Het eerste tijdvak CE Scheikunde VWO is op 21 mei 2026.'),
      ('Welke berekeningen zijn het moeilijkst op het CE Scheikunde VWO?',
       'Evenwichtsberekeningen (Kc, Kz, Kw), titraties en thermochemische berekeningen (enthalpie) vereisen de meeste oefening. Oefen ze los voordat je integrale examens maakt.'),
      ('Hoe oefen ik voor het CE Scheikunde VWO?',
       'Maak scheiding tussen begrips- en rekenvragen. Oefen evenwichtsberekeningen apart en gebruik oude CE-examens voor tijdmanagement. Slagio biedt 110+ oefenvragen gratis.'),
    ]
  },
  'vwo-natuurkunde': {
    'name': 'Natuurkunde', 'level': 'VWO', 'q': '105+', 'domains': 6,
    'exam': '27 mei 2026',
    'og': 'Gratis oefenen voor het VWO CE Natuurkunde 2026 — 105+ vragen over beweging, golven, elektriciteit, kwantum en relativiteit. Echte eindexamens 2019–2025 en CE simulatietoets.',
    'related': ['vwo-scheikunde', 'vwo-wiskunde-b', 'vwo-wiskunde-a', 'vwo-informatica'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Natuurkunde VWO?',
       'De CE-domeinen zijn: B (Beweging en krachten), C (Golven en straling), D (Elektriciteit), E (Materie en wisselwerking) en F (Kwantumwereld). VWO heeft ook relativiteitstheorie.'),
      ('Wanneer is het Natuurkunde VWO examen 2026?',
       'Het eerste tijdvak CE Natuurkunde VWO is op 27 mei 2026. Een BINAS-tabel is toegestaan.'),
      ('Wat is het moeilijkste deel van Natuurkunde VWO CE?',
       'Kwantummechanica (fotonen, de Broglie-golven, energieniveaus) en elektromagnetisme (inductie, wisselstroom) worden door veel leerlingen als het moeilijkst ervaren.'),
      ('Hoe oefen ik voor het CE Natuurkunde VWO?',
       'Oefen systematisch per domein, leer BINAS efficiënt gebruiken en maak integrale oude CE-examens onder tijdsdruk. Slagio biedt 105+ oefenvragen en alle echte eindexamens gratis.'),
    ]
  },
  'vwo-economie': {
    'name': 'Economie', 'level': 'VWO', 'q': '115+', 'domains': 5,
    'exam': '26 mei 2026',
    'og': 'Gratis oefenen voor het VWO CE Economie 2026 — 115+ vragen over markt, overheidsbeleid, internationale economie en monetaire economie. Echte eindexamens 2019–2025.',
    'related': ['vwo-bedrijfseconomie', 'vwo-wiskunde-a', 'vwo-maatschappijwetenschappen', 'vwo-geschiedenis'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Economie VWO?',
       'De CE-domeinen voor Economie VWO zijn: B (Schaarste en markt), C (Overheid en markt), D (Arbeid en inkomen), E (Vermogen en financiële markten) en F (Internationale economie). VWO heeft meer monetaire economie dan HAVO.'),
      ('Wanneer is het Economie VWO examen 2026?',
       'Het eerste tijdvak CE Economie VWO is op 26 mei 2026.'),
      ('Welke economische modellen zijn belangrijk voor het CE Economie VWO?',
       'De vraag-aanbodanalyse, het IS-LM-model, betalingsbalansanalyse en het Keynesiaanse model (nationale bestedingen) zijn kernstof voor VWO.'),
      ('Hoe oefen ik voor het CE Economie VWO?',
       'Oefen open vragen met grafieken en berekeningen, besteed extra aandacht aan monetaire vraagstukken en maak oude CE-examens na. Slagio biedt 115+ oefenvragen gratis.'),
    ]
  },
  'vwo-bedrijfseconomie': {
    'name': 'Bedrijfseconomie', 'level': 'VWO', 'q': '90+', 'domains': 5,
    'exam': '2 juni 2026',
    'og': 'Gratis oefenen voor het VWO CE Bedrijfseconomie 2026 — 90+ vragen over balans, jaarrekening, financiering en strategisch management. Echte eindexamens 2019–2025.',
    'related': ['vwo-economie', 'vwo-wiskunde-a', 'vwo-maatschappijwetenschappen', 'vwo-geschiedenis'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Bedrijfseconomie VWO?',
       'De CE-domeinen voor Bedrijfseconomie VWO zijn: B (Onderneming en omgeving), C (Jaarrekening en analyse), D (Financiering), E (Arbeid en organisatie) en F (Strategie).'),
      ('Wanneer is het Bedrijfseconomie VWO examen 2026?',
       'Het eerste tijdvak CE Bedrijfseconomie VWO is op 2 juni 2026.'),
      ('Wat is het verschil tussen Bedrijfseconomie HAVO en VWO?',
       'VWO Bedrijfseconomie behandelt uitgebreidere jaarrekeninganalyse, strategisch management en meer complexe financieringsberekeningen (netto contante waarde, IRR).'),
      ('Hoe oefen ik voor het CE Bedrijfseconomie VWO?',
       'Oefen jaarrekeninganalyse en investeringsberekeningen apart, begrijp de verbanden tussen balans en resultatenrekening en maak oude CE-examens na. Slagio biedt 90+ oefenvragen gratis.'),
    ]
  },
  'vwo-engels': {
    'name': 'Engels', 'level': 'VWO', 'q': '85+', 'domains': 3,
    'exam': '14 mei 2026',
    'og': 'Gratis oefenen voor het VWO CE Engels 2026 — 85+ vragen over leesvaardigheid en luistervaardigheid op B2/C1-niveau. Echte eindexamens 2019–2025 op Slagio.',
    'related': ['vwo-duits', 'vwo-frans', 'vwo-nederlands', 'vwo-maatschappijwetenschappen'],
    'faqs': [
      ('Wat zijn de onderdelen van het CE Engels VWO?',
       'Het CE Engels VWO bestaat uit leesvaardigheid (teksten op B2–C1-niveau) en luistervaardigheid. Schrijfvaardigheid en spreken zijn SE-onderdelen.'),
      ('Wanneer is het Engels VWO examen 2026?',
       'Het eerste tijdvak CE Engels VWO is op 14 mei 2026.'),
      ('Hoe hoog is het taalniveau voor het CE Engels VWO?',
       'Het CE Engels VWO toetst op B2/C1-niveau. De teksten zijn complexer en abstracter dan bij HAVO, met academisch en literair proza.'),
      ('Hoe oefen ik leesvaardigheid Engels voor het VWO CE?',
       'Lees Engelstalige kranten en academische teksten, analyseer tekststructuur en argumentatie, en maak oude CE-examens na. Slagio biedt 85+ oefenvragen gratis.'),
    ]
  },
  'vwo-duits': {
    'name': 'Duits', 'level': 'VWO', 'q': '75+', 'domains': 3,
    'exam': '15 mei 2026',
    'og': 'Gratis oefenen voor het VWO CE Duits 2026 — 75+ vragen over leesvaardigheid en luistervaardigheid op B2-niveau. Echte eindexamens 2019–2025 op Slagio.',
    'related': ['vwo-engels', 'vwo-frans', 'vwo-nederlands', 'vwo-geschiedenis'],
    'faqs': [
      ('Wat zijn de onderdelen van het CE Duits VWO?',
       'Het CE Duits VWO bestaat uit leesvaardigheid en luistervaardigheid. Schrijfvaardigheid en spreken zijn SE-onderdelen.'),
      ('Wanneer is het Duits VWO examen 2026?',
       'Het eerste tijdvak CE Duits VWO is op 15 mei 2026.'),
      ('Welk niveau Duits is vereist voor het VWO CE?',
       'Het CE Duits VWO toetst op B2-niveau. Complexe zakelijke en literaire teksten moeten worden begrepen.'),
      ('Hoe oefen ik voor het CE Duits VWO?',
       'Lees Duitstalige teksten, oefen met echte CE-examens en werk aan woordenschat via flashcards. Slagio biedt 75+ oefenvragen en oude eindexamens Duits gratis.'),
    ]
  },
  'vwo-frans': {
    'name': 'Frans', 'level': 'VWO', 'q': '75+', 'domains': 3,
    'exam': '16 mei 2026',
    'og': 'Gratis oefenen voor het VWO CE Frans 2026 — 75+ vragen over leesvaardigheid en luistervaardigheid op B2-niveau. Echte eindexamens 2019–2025 op Slagio.',
    'related': ['vwo-engels', 'vwo-duits', 'vwo-nederlands', 'vwo-geschiedenis'],
    'faqs': [
      ('Wat zijn de onderdelen van het CE Frans VWO?',
       'Het CE Frans VWO bestaat uit leesvaardigheid en luistervaardigheid. Schrijfvaardigheid en spreken zijn SE-onderdelen.'),
      ('Wanneer is het Frans VWO examen 2026?',
       'Het eerste tijdvak CE Frans VWO is op 16 mei 2026.'),
      ('Welk niveau Frans is vereist voor het VWO CE?',
       'Het CE Frans VWO toetst op B2-niveau, met complexe zakelijke en literaire teksten.'),
      ('Hoe oefen ik voor het CE Frans VWO?',
       'Maak oude CE-examens na, oefen met onbekende teksten en gebruik flashcards voor woordenschat. Slagio biedt 75+ oefenvragen en oude eindexamens Frans gratis.'),
    ]
  },
  'vwo-geschiedenis': {
    'name': 'Geschiedenis', 'level': 'VWO', 'q': '110+', 'domains': 10,
    'exam': '25 mei 2026',
    'og': 'Gratis oefenen voor het VWO CE Geschiedenis 2026 — 110+ vragen over tijdvakken, historiografie en historisch redeneren. Echte eindexamens 2019–2025 op Slagio.',
    'related': ['vwo-maatschappijwetenschappen', 'vwo-aardrijkskunde', 'vwo-economie', 'vwo-nederlands'],
    'faqs': [
      ('Wat zijn de domeinen voor Geschiedenis VWO CE?',
       'Het CE Geschiedenis VWO is gebaseerd op alle tien tijdvakken (oriëntatiekennis) plus een verdiepingsthema. VWO verwacht meer historiografische analyse en bronkritiek dan HAVO.'),
      ('Wanneer is het Geschiedenis VWO examen 2026?',
       'Het eerste tijdvak CE Geschiedenis VWO is op 25 mei 2026.'),
      ('Wat is het verschil tussen Geschiedenis HAVO en VWO?',
       'VWO verwacht diepgaandere analyse, historische redeneervaardheid en bronkritiek. De vraagstelling is abstracter en vereist meer synthese van kennis.'),
      ('Hoe oefen ik voor het CE Geschiedenis VWO?',
       'Leer de oriëntatiekennis en oefen bronanalyse en essay-structuur. Besteed aandacht aan het verdiepingsthema van 2026. Slagio biedt 110+ oefenvragen en alle echte eindexamens gratis.'),
    ]
  },
  'vwo-aardrijkskunde': {
    'name': 'Aardrijkskunde', 'level': 'VWO', 'q': '100+', 'domains': 4,
    'exam': '20 mei 2026',
    'og': 'Gratis oefenen voor het VWO CE Aardrijkskunde 2026 — 100+ vragen over mondiale vraagstukken, gebieden en geografische vaardigheden. Echte eindexamens 2019–2025.',
    'related': ['vwo-geschiedenis', 'vwo-maatschappijwetenschappen', 'vwo-biologie', 'vwo-economie'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Aardrijkskunde VWO?',
       'De CE-domeinen voor Aardrijkskunde VWO zijn: Wereld (mondiale systemen), Arm en Rijk (ontwikkelingsvraagstukken), een gebiedsgerichte module en geografische vaardigheden.'),
      ('Wanneer is het Aardrijkskunde VWO examen 2026?',
       'Het eerste tijdvak CE Aardrijkskunde VWO is op 20 mei 2026.'),
      ('Hoe verschilt Aardrijkskunde VWO van HAVO?',
       'VWO heeft een uitgebreidere analytische component: systeemdenken, complexere geografische vraagstukken en diepgaandere casuïstiek.'),
      ('Hoe oefen ik voor het CE Aardrijkskunde VWO?',
       'Combineer begripskennis met kaartanalyse en geografisch redeneren. Maak oude CE-examens na. Slagio biedt 100+ oefenvragen en alle echte eindexamens gratis.'),
    ]
  },
  'vwo-maatschappijwetenschappen': {
    'name': 'Maatschappijwetenschappen', 'level': 'VWO', 'q': '100+', 'domains': 5,
    'exam': '28 mei 2026',
    'og': 'Gratis oefenen voor het VWO CE Maatschappijwetenschappen 2026 — 100+ vragen over samenleving, macht, verzorgingsstaat en globalisering. Echte eindexamens 2019–2025.',
    'related': ['vwo-geschiedenis', 'vwo-economie', 'vwo-aardrijkskunde', 'vwo-nederlands'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Maatschappijwetenschappen VWO?',
       'De CE-domeinen zijn: B (Samenleving en individu), C (Macht en besluitvorming), D (Verzorgingsstaat), E (Globalisering) en F (Sociaal-wetenschappelijke methoden). VWO heeft meer methodologie dan HAVO.'),
      ('Wanneer is het Maatschappijwetenschappen VWO examen 2026?',
       'Het eerste tijdvak CE Maatschappijwetenschappen VWO is op 28 mei 2026.'),
      ('Hoe schrijf ik een goede essay bij Maatschappijwetenschappen VWO?',
       'Gebruik sociaalwetenschappelijke begrippen precies, beargumenteer vanuit meerdere theoretische perspectieven en kom tot een onderbouwde conclusie. Oefen met open vragen uit oude CE-examens.'),
      ('Hoe oefen ik voor het CE Maatschappijwetenschappen VWO?',
       'Leer begrippen exact, oefen essay-structuur en maak oude CE-examens na. Slagio biedt 100+ oefenvragen en echte eindexamens gratis.'),
    ]
  },
  'vwo-informatica': {
    'name': 'Informatica', 'level': 'VWO', 'q': '80+', 'domains': 5,
    'exam': '3 juni 2026',
    'og': 'Gratis oefenen voor het VWO CE Informatica 2026 — 80+ vragen over algoritmen, datastructuren, netwerken en databases. Echte eindexamens 2019–2025 op Slagio.',
    'related': ['vwo-wiskunde-b', 'vwo-wiskunde-a', 'vwo-natuurkunde', 'vwo-scheikunde'],
    'faqs': [
      ('Wat zijn de CE-domeinen voor Informatica VWO?',
       'De CE-domeinen voor Informatica VWO zijn: B (Informatie), C (Systemen — hardware/software), D (Communicatie — netwerken), E (Programmeren/algoritmen) en F (Databases).'),
      ('Wanneer is het Informatica VWO examen 2026?',
       'Het eerste tijdvak CE Informatica VWO is op 3 juni 2026.'),
      ('Moet ik kunnen programmeren voor het CE Informatica VWO?',
       'Je hoeft geen code te schrijven, maar je moet pseudocode en algoritmen kunnen lezen, analyseren en traceren. Efficiëntie van algoritmen (big-O) is ook CE-stof.'),
      ('Hoe oefen ik voor het CE Informatica VWO?',
       'Oefen algoritmevragen (flowcharts, pseudocode traceren), databaseontwerp en netwerktopologieën. Maak oude CE-examens na. Slagio biedt 80+ oefenvragen gratis.'),
    ]
  },
  'vwo-latijn': {
    'name': 'Latijn', 'level': 'VWO', 'q': '60+', 'domains': 3,
    'exam': '9 juni 2026',
    'og': 'Gratis oefenen voor het VWO CE Latijn 2026 — 60+ vragen over grammatica, vertaalvaardigheid en cultuurhistorische achtergrond. Echte eindexamens 2019–2025 op Slagio.',
    'related': ['vwo-grieks', 'vwo-geschiedenis', 'vwo-nederlands', 'vwo-duits'],
    'faqs': [
      ('Wat zijn de onderdelen van het CE Latijn VWO?',
       'Het CE Latijn VWO bestaat uit tekstvertaling (Latijnse teksten vertalen naar Nederlands) en een cultuurhistorisch deel over de klassieke Oudheid.'),
      ('Wanneer is het Latijn VWO examen 2026?',
       'Het eerste tijdvak CE Latijn VWO is op 9 juni 2026.'),
      ('Hoeveel grammatica moet ik kennen voor het CE Latijn VWO?',
       'Je moet alle naamvallen, vervoeging van werkwoorden (inclusief onregelmatige), deelwoorden en infinitief-constructies beheersen. Grammaticakennis is de basis voor correcte vertaling.'),
      ('Hoe oefen ik voor het CE Latijn VWO?',
       'Vertaal dagelijks Latijnse teksten, leer grammaticaparadigma\'s en bestudeer de cultuurhistorische context. Slagio biedt 60+ oefenvragen en oude eindexamens Latijn gratis.'),
    ]
  },
  'vwo-grieks': {
    'name': 'Grieks', 'level': 'VWO', 'q': '60+', 'domains': 3,
    'exam': '10 juni 2026',
    'og': 'Gratis oefenen voor het VWO CE Grieks 2026 — 60+ vragen over grammatica, vertaalvaardigheid en Griekse cultuur. Echte eindexamens 2019–2025 op Slagio.',
    'related': ['vwo-latijn', 'vwo-geschiedenis', 'vwo-nederlands', 'vwo-duits'],
    'faqs': [
      ('Wat zijn de onderdelen van het CE Grieks VWO?',
       'Het CE Grieks VWO bestaat uit vertaling van Griekse teksten (oud-Grieks) en een cultuurhistorisch deel over de klassieke Griekse beschaving.'),
      ('Wanneer is het Grieks VWO examen 2026?',
       'Het eerste tijdvak CE Grieks VWO is op 10 juni 2026.'),
      ('Moet ik het Griekse alfabet kennen voor het CE?',
       'Ja, je moet het Griekse alfabet foutloos kunnen lezen en schrijven. Ook het accent-systeem (acuut, gravis, circumflex) moet je beheersen voor correcte uitspraak en vertaling.'),
      ('Hoe oefen ik voor het CE Grieks VWO?',
       'Vertaal dagelijks Griekse teksten, leer paradigma\'s en bestudeer de cultuurhistorische stof. Slagio biedt 60+ oefenvragen en oude eindexamens Grieks gratis.'),
    ]
  },
}

# Labels voor cross-link sectie
LABELS = {
  'havo-wiskunde-a': 'Wiskunde A HAVO', 'havo-wiskunde-b': 'Wiskunde B HAVO',
  'havo-biologie': 'Biologie HAVO', 'havo-scheikunde': 'Scheikunde HAVO',
  'havo-natuurkunde': 'Natuurkunde HAVO', 'havo-economie': 'Economie HAVO',
  'havo-bedrijfseconomie': 'Bedrijfseconomie HAVO', 'havo-engels': 'Engels HAVO',
  'havo-duits': 'Duits HAVO', 'havo-frans': 'Frans HAVO',
  'havo-geschiedenis': 'Geschiedenis HAVO', 'havo-aardrijkskunde': 'Aardrijkskunde HAVO',
  'havo-maatschappijwetenschappen': 'Maatschappijwetenschappen HAVO', 'havo-nederlands': 'Nederlands HAVO',
  'vwo-wiskunde-a': 'Wiskunde A VWO', 'vwo-wiskunde-b': 'Wiskunde B VWO',
  'vwo-biologie': 'Biologie VWO', 'vwo-scheikunde': 'Scheikunde VWO',
  'vwo-natuurkunde': 'Natuurkunde VWO', 'vwo-economie': 'Economie VWO',
  'vwo-bedrijfseconomie': 'Bedrijfseconomie VWO', 'vwo-engels': 'Engels VWO',
  'vwo-duits': 'Duits VWO', 'vwo-frans': 'Frans VWO',
  'vwo-geschiedenis': 'Geschiedenis VWO', 'vwo-aardrijkskunde': 'Aardrijkskunde VWO',
  'vwo-maatschappijwetenschappen': 'Maatschappijwetenschappen VWO', 'vwo-nederlands': 'Nederlands VWO',
  'vwo-informatica': 'Informatica VWO', 'vwo-latijn': 'Latijn VWO', 'vwo-grieks': 'Grieks VWO',
}

def make_faq_schema(faqs):
    items = []
    for q, a in faqs:
        items.append({
            '@type': 'Question',
            'name': q,
            'acceptedAnswer': {'@type': 'Answer', 'text': a}
        })
    return json.dumps({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': items
    }, ensure_ascii=False, indent=2)

def make_breadcrumb_schema(name, level, slug):
    return json.dumps({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Slagio', 'item': 'https://slagio.nl/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Vakken', 'item': 'https://slagio.nl/vakken/'},
            {'@type': 'ListItem', 'position': 3, 'name': f'{name} {level}', 'item': f'https://slagio.nl/vakken/{slug}.html'},
        ]
    }, ensure_ascii=False, indent=2)

def make_cross_links(related):
    links = []
    for slug in related:
        label = LABELS.get(slug)
        if label:
            links.append(f'<a href="/vakken/{slug}.html">{label}</a>')
    if not links:
        return ''
    return (
        '\n  <div class="card" style="margin-top:1.5rem">'
        '\n    <h2>📚 Andere vakken op Slagio</h2>'
        '\n    <p style="color:var(--text-muted);font-size:.95rem;line-height:2">'
        + ' &nbsp;·&nbsp; '.join(links) +
        '</p>\n  </div>'
    )

def upgrade_file(slug, data):
    path = os.path.join(VAKKEN_DIR, f'{slug}.html')
    if not os.path.exists(path):
        print(f'  SKIP (not found): {path}')
        return

    with open(path, encoding='utf-8') as f:
        html = f.read()

    # 1. Verbeter og:description
    html = re.sub(
        r'(<meta property="og:description" content=")[^"]*(")',
        r'\g<1>' + data['og'].replace('"', '&quot;') + r'\g<2>',
        html
    )

    # 2. Voeg FAQPage + BreadcrumbList toe na Course schema block
    faq_block = (
        '\n  <script type="application/ld+json">\n'
        + make_faq_schema(data['faqs'])
        + '\n  </script>'
    )
    breadcrumb_block = (
        '\n  <script type="application/ld+json">\n'
        + make_breadcrumb_schema(data['name'], data['level'], slug)
        + '\n  </script>'
    )
    new_schemas = faq_block + breadcrumb_block

    # Zoek het einde van het Course schema script-blok en voeg daarna toe
    # Maar alleen als het er nog niet in zit
    if 'FAQPage' not in html:
        html = re.sub(
            r'(</script>\s*\n\s*<link rel="canonical")',
            new_schemas + r'\n  \1'[3:],  # trim the leading \n
            html,
            count=1
        )

    # 3. Voeg cross-links toe vóór de sluit-footer
    cross = make_cross_links(data['related'])
    if cross and 'Andere vakken op Slagio' not in html:
        html = html.replace(
            '\n  <div class="footer">',
            cross + '\n\n  <div class="footer">'
        )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'  OK: {slug}')

print('=== Upgrading vakpagina\'s ===')
for slug, data in VAKKEN.items():
    upgrade_file(slug, data)
print('=== Klaar ===')
