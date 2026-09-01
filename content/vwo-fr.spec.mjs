// VWO Frans - gouden-stijl contentspec. Vervangt crude generatorvragen
// door authored strategie-/inzichtvragen met per-optie-uitleg + situaties.
const V = (domein, naam, intro, secties, concepten, vragen) => ({ niveau: 'vwo', vak: 'fr', domein, naam, intro, secties, concepten, vragen });

export default [
  V('A', 'Leesvaardigheid',
    `Bij het lezen van Franse teksten gebruik je <strong>skimmen</strong> en <strong>scannen</strong>, en herken je <strong>signaalwoorden</strong> als <em>cependant</em> (echter), <em>pourtant</em> (toch) en <em>donc</em> (dus). Structuren als <em>d'une part… d'autre part…</em> zetten twee kanten tegenover elkaar. Het CE-niveau is B2.`,
    [
      { h: '1. Leestechnieken', p: [
        `<strong>Skimmen</strong> is snel lezen voor de grote lijn; <strong>scannen</strong> is gericht zoeken naar een naam of getal. Onbekende woorden raad je uit de <strong>context</strong>. Het verwachte <strong>ERK-niveau</strong> voor VWO Frans is B2.`] },
      { h: '2. Signaalwoorden', p: [
        `<em>cependant / toutefois / pourtant</em> = echter/toch (tegenstelling), <em>donc</em> = dus/daarom (gevolg), <em>d'ailleurs</em> = trouwens (toevoeging). De structuur <em>d'une part… d'autre part…</em> (of <em>d'un côté… de l'autre…</em>) zet enerzijds tegenover anderzijds.`] },
    ],
    [
      { t: 'Skimmen', d: 'snel lezen om globaal te weten waar een tekst over gaat', k: 'globaal lezen', fout: ['Scannen'] },
      { t: 'Scannen', d: 'gericht zoeken naar een naam, datum of getal', k: 'gericht zoeken', fout: ['Skimmen'] },
      { t: 'cependant', d: 'het Franse signaalwoord voor echter of maar', k: 'echter/maar', fout: ['donc'] },
      { t: 'pourtant', d: 'het Franse signaalwoord voor toch of desondanks', k: 'toch/desondanks', fout: ['cependant'] },
      { t: 'Context', d: 'de omringende woorden die de betekenis verduidelijken', k: 'omringende woorden', fout: ['Skimmen'] },
      { t: 'd\'une part... d\'autre part', d: 'de structuur die enerzijds tegenover anderzijds zet', k: 'enerzijds... anderzijds', fout: ['donc'] },
      { t: 'donc', d: 'het Franse signaalwoord voor dus of daarom', k: 'dus/daarom', fout: ['cependant'] },
      { t: 'Hoofdgedachte', d: 'de belangrijkste boodschap van een tekst', k: 'belangrijkste boodschap', fout: ['Context'] },
      { t: 'toutefois', d: 'het Franse signaalwoord voor toch of desondanks', k: 'toch/desondanks', fout: ['donc'] },
      { t: 'ERK B2', d: 'het CE-niveau dat voor VWO Frans wordt verwacht', k: 'CE-niveau VWO Frans', fout: ['Skimmen'] },
    ],
    [
      { v: 'Wat betekent "cependant" in een Franse tekst?', o: ['echter / maar / toch', 'dus / daarom', 'bovendien', 'namelijk'], c: 0, d: 2, uo: ['Klopt: "cependant" drukt een tegenstelling uit.', 'Nee, dat is "donc".', 'Nee, dat is "de plus".', 'Nee, dat is "car".'], uh: '"cependant": echter/maar.' },
      { v: 'Je leest: "D\'un côté… de l\'autre côté…". Welke structuur is dit?', o: ['enerzijds… anderzijds…', 'oorzaak en gevolg', 'een opsomming van feiten', 'een conclusie'], c: 0, d: 3, uo: ['Klopt: deze structuur zet twee kanten tegenover elkaar.', 'Nee, er is geen oorzaak-gevolg.', 'Nee, het zijn twee tegengestelde kanten.', 'Nee, dat is geen conclusie.'], uh: '"D\'un côté… de l\'autre…": enerzijds… anderzijds.' },
      { v: 'Wat is het ERK-niveau voor VWO Frans bij het CE?', o: ['B2', 'A1', 'C2', 'A2'], c: 0, d: 2, uo: ['Klopt: VWO Frans mikt op B2.', 'Nee, dat is beginnersniveau.', 'Nee, dat is bijna moedertaalniveau.', 'Nee, dat is nog basaal.'], uh: 'VWO Frans CE: B2.' },
      { v: 'Wat betekent "toutefois" in een Franse tekst?', o: ['toch / desondanks', 'dus', 'bovendien', 'omdat'], c: 0, d: 2, uo: ['Klopt: "toutefois" is een concessie/tegenstelling.', 'Nee, dat is "donc".', 'Nee, dat is "de plus".', 'Nee, dat is "parce que".'], uh: '"toutefois": toch/desondanks.' },
      { v: 'Welke structuur gebruik je in een Frans essay voor twee tegenovergestelde standpunten?', o: ['"d\'une part… d\'autre part…"', '"parce que…"', '"il y a…"', '"c\'est-à-dire…"'], c: 0, d: 3, uo: ['Klopt: deze structuur zet standpunten tegenover elkaar.', 'Nee, dat geeft een reden.', 'Nee, dat introduceert iets.', 'Nee, dat verduidelijkt.'], uh: 'Tegenstelling: "d\'une part… d\'autre part…".' },
      { v: 'Wat betekent "pourtant" in een Franse tekst?', o: ['toch / desondanks', 'daarom', 'bovendien', 'namelijk'], c: 0, d: 2, uo: ['Klopt: "pourtant" drukt een concessie uit.', 'Nee, dat is "donc".', 'Nee, dat is "de plus".', 'Nee, dat is "car".'], uh: '"pourtant": toch/desondanks.' },
      { v: 'Welke leestechniek gebruik je om snel te weten waar een tekst globaal over gaat?', o: ['skimmen', 'scannen', 'woord voor woord lezen', 'hardop lezen'], c: 0, d: 2, uo: ['Klopt: skimmen geeft snel de grote lijn.', 'Nee, dat is gericht zoeken.', 'Nee, dat kost te veel tijd.', 'Nee, dat helpt niet.'], uh: 'Skimmen: globaal, voor de grote lijn.' },
      { v: 'Welke leestechniek gebruik je om een naam of getal in een lange tekst te zoeken?', o: ['scannen', 'skimmen', 'samenvatten', 'vertalen'], c: 0, d: 2, uo: ['Klopt: scannen zoekt gericht naar een detail.', 'Nee, dat is voor de grote lijn.', 'Nee, dat doe je achteraf.', 'Nee, dat kost te veel tijd.'], uh: 'Scannen: gericht zoeken.' },
      { v: 'Wat betekent "donc" in een Franse tekst?', o: ['dus / daarom', 'echter', 'bovendien', 'omdat'], c: 0, d: 2, uo: ['Klopt: "donc" leidt een gevolg in.', 'Nee, dat is "cependant".', 'Nee, dat is "de plus".', 'Nee, dat is "parce que".'], uh: '"donc": dus/daarom (gevolg).' },
      { v: 'Waar helpt de context je bij het lezen?', o: ['de betekenis van een onbekend woord raden', 'de spelling exact geven', 'de tekst korter maken', 'de tijd meten'], c: 0, d: 2, uo: ['Klopt: de omringende woorden hinten naar de betekenis.', 'Nee, context is geen woordenboek.', 'Nee, dat is samenvatten.', 'Nee, dat is niet de functie.'], uh: 'Context: onbekende woorden raden.' },
      { v: 'Wat betekent "d\'ailleurs" in een Franse tekst?', o: ['trouwens / bovendien', 'echter', 'omdat', 'toch'], c: 0, d: 3, uo: ['Klopt: "d\'ailleurs" voegt een punt toe.', 'Nee, dat is "cependant".', 'Nee, dat is "parce que".', 'Nee, dat is "pourtant".'], uh: '"d\'ailleurs": trouwens/bovendien.' },
    ]),

  V('B', 'Luistervaardigheid',
    `Bij luisteren kies je tussen de <strong>grote lijn</strong> en <strong>details</strong>, <strong>voorspel</strong> je de inhoud en let je op gesproken signaalwoorden als <em>en fait</em> (eigenlijk) en <em>quand même</em> (toch). In een formeel fragment hoor je de <strong>vous</strong>-vorm.`,
    [
      { h: '1. Luisterstrategie', p: [
        `Luister je op de <strong>grote lijn</strong>, dan zoek je het hoofdonderwerp; luister je op <strong>detail</strong>, dan zoek je specifieke informatie. Lees eerst de vragen en <strong>voorspel</strong> de inhoud uit titel en beeld. <strong>Kernwoorden</strong> dragen de betekenis.`] },
      { h: '2. Register en signaalwoorden', p: [
        `<em>en fait</em> = eigenlijk/in feite, <em>quand même</em> = toch/desondanks. In een formeel fragment hoor je de beleefde <strong>vous</strong>-vorm; informeel de <strong>tu</strong>-vorm. Mis je een woord, gebruik dan de <strong>context</strong> en luister door.`] },
    ],
    [
      { t: 'en fait', d: 'gesproken signaalwoord voor eigenlijk of in feite', k: 'eigenlijk/in feite', fout: ['quand même'] },
      { t: 'quand même', d: 'gesproken signaalwoord voor toch of desondanks', k: 'toch/desondanks', fout: ['en fait'] },
      { t: 'Gist', d: 'de grote lijn van wat gezegd wordt', k: 'grote lijn', fout: ['Detail'] },
      { t: 'Detail', d: 'een specifiek gegeven in een fragment', k: 'specifiek gegeven', fout: ['Gist'] },
      { t: 'Formeel register', d: 'nette taal met de vous-vorm in een officiële situatie', k: 'vous-vorm, nette taal', fout: ['Informeel register'] },
      { t: 'Kernwoorden', d: 'de belangrijkste woorden die de betekenis dragen', k: 'belangrijkste woorden', fout: ['Context'] },
      { t: 'Voorspellen', d: 'de inhoud vooraf inschatten uit titel en beeld', k: 'inhoud vooraf inschatten', fout: ['Kernwoorden'] },
      { t: 'vous-vorm', d: 'de beleefde of meervoudige aanspreekvorm in het Frans', k: 'beleefde aanspreekvorm', fout: ['tu-vorm'] },
      { t: 'tu-vorm', d: 'de informele aanspreekvorm in het Frans', k: 'informele aanspreekvorm', fout: ['vous-vorm'] },
      { t: 'Context', d: 'de situatie eromheen die helpt een woord te begrijpen', k: 'situatie eromheen', fout: ['Kernwoorden'] },
    ],
    [
      { v: 'Wat betekent "en fait" in gesproken Frans?', o: ['eigenlijk / in feite', 'toch / desondanks', 'echter', 'dus'], c: 0, d: 2, uo: ['Klopt: "en fait" betekent eigenlijk.', 'Nee, dat is "quand même".', 'Nee, dat is "cependant".', 'Nee, dat is "donc".'], uh: '"en fait": eigenlijk/in feite.' },
      { v: 'Wat betekent "quand même" in gesproken Frans?', o: ['toch / desondanks', 'eigenlijk', 'bovendien', 'omdat'], c: 0, d: 2, uo: ['Klopt: "quand même" is toch/desondanks.', 'Nee, dat is "en fait".', 'Nee, dat is "de plus".', 'Nee, dat is "parce que".'], uh: '"quand même": toch/desondanks.' },
      { v: 'Wat betekent luisteren op de grote lijn?', o: ['het hoofdonderwerp begrijpen', 'elk exact getal noteren', 'ieder woord opschrijven', 'de uitspraak beoordelen'], c: 0, d: 2, uo: ['Klopt: de grote lijn is het hoofdonderwerp.', 'Nee, dat is op detail.', 'Nee, dat lukt niet.', 'Nee, dat is een spreekdoel.'], uh: 'Grote lijn: het hoofdonderwerp.' },
      { v: 'Wat betekent luisteren op detail?', o: ['specifieke informatie zoeken', 'alleen de grote lijn pakken', 'niets noteren', 'gokken'], c: 0, d: 2, uo: ['Klopt: op detail zoek je specifieke gegevens.', 'Nee, dat is de gist.', 'Nee, je zoekt juist gericht.', 'Nee, dat is geen strategie.'], uh: 'Detail: specifieke informatie.' },
      { v: 'Welk register hoor je in een officieel Frans interview?', o: ['formeel register met de vous-vorm', 'straattaal', 'kindertaal', 'sms-taal'], c: 0, d: 2, uo: ['Klopt: officieel is formeel, met vous.', 'Nee, dat past niet.', 'Nee, dat past niet.', 'Nee, dat is geschreven en informeel.'], uh: 'Officieel: formeel, vous-vorm.' },
      { v: 'Wat is de vous-vorm?', o: ['de beleefde of meervoudige aanspreekvorm', 'de informele aanspreekvorm', 'een werkwoordstijd', 'een lidwoord'], c: 0, d: 2, uo: ['Klopt: vous is beleefd of meervoud.', 'Nee, dat is "tu".', 'Nee, dat is een tijd.', 'Nee, dat is iets anders.'], uh: 'vous: beleefde/meervoudsvorm.' },
      { v: 'Wat is de tu-vorm?', o: ['de informele aanspreekvorm', 'de beleefde aanspreekvorm', 'een naamval', 'een lidwoord'], c: 0, d: 1, uo: ['Klopt: "tu" gebruik je informeel.', 'Nee, dat is "vous".', 'Nee, Frans heeft geen naamvallen zo.', 'Nee, dat is iets anders.'], uh: 'tu: informele aanspreekvorm.' },
      { v: 'Wat helpt je de inhoud te voorspellen voor je luistert?', o: ['de titel en het beeld', 'alleen het laatste woord', 'de naam van de spreker', 'de lengte van de opname'], c: 0, d: 2, uo: ['Klopt: titel en beeld scheppen verwachtingen.', 'Nee, dat heb je nog niet gehoord.', 'Nee, een naam zegt weinig.', 'Nee, dat helpt niet.'], uh: 'Voorspellen uit titel en beeld.' },
      { v: 'Wat zijn kernwoorden bij het luisteren?', o: ['de belangrijkste woorden die de betekenis dragen', 'alle woorden', 'alleen het eerste woord', 'de achtergrondmuziek'], c: 0, d: 2, uo: ['Klopt: kernwoorden dragen de hoofdbetekenis.', 'Nee, niet alles is even belangrijk.', 'Nee, dat is te weinig.', 'Nee, dat is geen taal.'], uh: 'Kernwoorden: de belangrijkste woorden.' },
      { v: 'Wat doe je het best voordat een luisteropdracht start?', o: ['eerst de vragen lezen', 'je ogen sluiten', 'alvast antwoorden opschrijven', 'de titel negeren'], c: 0, d: 2, uo: ['Klopt: de vragen sturen je aandacht.', 'Nee, beeld kan helpen.', 'Nee, je hebt nog niets gehoord.', 'Nee, de titel helpt voorspellen.'], uh: 'Lees eerst de vragen.' },
    ]),

  V('C', 'Schrijfvaardigheid',
    `Bij het schrijven kies je de juiste <strong>tijd</strong>: de <strong>passé composé</strong> voor afgeronde handelingen, de <strong>imparfait</strong> voor achtergrond en gewoonte, en <em>imparfait + conditionnel</em> voor een hypothese. Je kiest passende <strong>connecteurs</strong> (<em>de plus</em>, <em>donc</em>, <em>cependant</em>).`,
    [
      { h: '1. Tijden', p: [
        `De <strong>passé composé</strong> (met avoir of être + voltooid deelwoord) beschrijft een afgeronde handeling in de spreektaal; de <strong>imparfait</strong> beschrijft achtergrond, gewoonte of een toestand. Voor een hypothese ("Als ik meer tijd had, zou ik lezen") gebruik je <strong>imparfait</strong> in de als-zin en <strong>conditionnel</strong> in de hoofdzin.`] },
      { h: '2. Connecteurs', p: [
        `<em>de plus</em> = bovendien, <em>donc</em> = dus, <em>cependant</em> = echter. <em>parce que</em> geeft nieuwe informatie als reden; <em>puisque</em> verwijst naar een reden die al bekend is. In een formele tekst gebruik je de <strong>vous</strong>-vorm.`] },
    ],
    [
      { t: 'Passé composé', d: 'de tijd voor een afgeronde handeling in de spreektaal', k: 'afgeronde handeling', fout: ['Imparfait'] },
      { t: 'Imparfait', d: 'de tijd voor achtergrond, gewoonte of toestand in het verleden', k: 'achtergrond/gewoonte', fout: ['Passé composé'] },
      { t: 'Conditionnel', d: 'de wijs die "zou" uitdrukt, voor een voorwaardelijke handeling', k: 'zou (voorwaardelijk)', fout: ['Imparfait'] },
      { t: 'parce que', d: 'voegwoord dat een nieuwe reden geeft', k: 'nieuwe reden', fout: ['puisque'] },
      { t: 'puisque', d: 'voegwoord dat naar een al bekende reden verwijst', k: 'bekende reden', fout: ['parce que'] },
      { t: 'de plus', d: 'de Franse connecteur voor bovendien', k: 'bovendien', fout: ['donc'] },
      { t: 'donc', d: 'de Franse connecteur voor dus of daarom', k: 'dus/daarom', fout: ['de plus'] },
      { t: 'cependant', d: 'de Franse connecteur voor echter', k: 'echter', fout: ['de plus'] },
      { t: 'Formeel register', d: 'nette taal met de vous-vorm in een formele tekst', k: 'vous-vorm, nette taal', fout: ['Informeel register'] },
      { t: 'Connecteur', d: 'een verbindingswoord dat zinnen aan elkaar koppelt', k: 'verbindingswoord', fout: ['Formeel register'] },
    ],
    [
      { v: 'Welke vorm gebruik je in het Frans voor "Als ik meer tijd had, zou ik meer lezen"?', o: ['imparfait in de als-zin en conditionnel in de hoofdzin', 'twee keer de passé composé', 'twee keer de futur', 'twee keer de présent'], c: 0, d: 3, uo: ['Klopt: si + imparfait, dan conditionnel.', 'Nee, dat is voor een afgeronde handeling.', 'Nee, dat is toekomst.', 'Nee, dat is tegenwoordige tijd.'], uh: 'Hypothese: si + imparfait, dan conditionnel.' },
      { v: 'Welke tijd gebruik je in het Frans voor een afgeronde handeling in het verleden (spreektaal)?', o: ['de passé composé', 'de imparfait', 'de futur', 'de présent'], c: 0, d: 3, uo: ['Klopt: de passé composé is voor afgeronde handelingen.', 'Nee, de imparfait is achtergrond.', 'Nee, dat is toekomst.', 'Nee, dat is nu.'], uh: 'Afgeronde handeling: passé composé.' },
      { v: 'Wat is het verschil tussen "parce que" en "puisque"?', o: ['"parce que" geeft nieuwe info, "puisque" verwijst naar een bekende reden', 'ze zijn hetzelfde', '"parce que" verwijst naar bekende info', '"puisque" geeft altijd nieuwe info'], c: 0, d: 3, uo: ['Klopt: nieuwe versus bekende reden.', 'Nee, ze verschillen.', 'Nee, dat is omgedraaid.', 'Nee, dat is omgedraaid.'], uh: '"parce que": nieuw; "puisque": bekend.' },
      { v: 'Welke connecteur gebruik je in het Frans voor "bovendien"?', o: ['de plus', 'cependant', 'donc', 'parce que'], c: 0, d: 2, uo: ['Klopt: "de plus" voegt toe.', 'Nee, dat is een tegenstelling.', 'Nee, dat is een gevolg.', 'Nee, dat is een reden.'], uh: '"bovendien": de plus.' },
      { v: 'Welke connecteur gebruik je in het Frans voor "dus / daarom"?', o: ['donc', 'de plus', 'cependant', 'car'], c: 0, d: 2, uo: ['Klopt: "donc" leidt een gevolg in.', 'Nee, dat is opsomming.', 'Nee, dat is tegenstelling.', 'Nee, dat is een reden.'], uh: '"dus": donc.' },
      { v: 'Welke connecteur gebruik je in het Frans voor "echter"?', o: ['cependant', 'de plus', 'donc', 'parce que'], c: 0, d: 2, uo: ['Klopt: "cependant" drukt een tegenstelling uit.', 'Nee, dat is opsomming.', 'Nee, dat is gevolg.', 'Nee, dat is een reden.'], uh: '"echter": cependant.' },
      { v: 'Waarvoor gebruik je de imparfait?', o: ['voor achtergrond, gewoonte of een toestand in het verleden', 'voor een eenmalige afgeronde handeling', 'voor de toekomst', 'voor een bevel'], c: 0, d: 3, uo: ['Klopt: de imparfait schetst achtergrond en gewoonte.', 'Nee, dat is de passé composé.', 'Nee, dat is de futur.', 'Nee, dat is de imperatief.'], uh: 'Imparfait: achtergrond en gewoonte.' },
      { v: 'Wat drukt de conditionnel uit?', o: ['"zou", een voorwaardelijke handeling', 'een afgeronde handeling', 'een bevel', 'het heden'], c: 0, d: 2, uo: ['Klopt: de conditionnel betekent "zou".', 'Nee, dat is de passé composé.', 'Nee, dat is de imperatief.', 'Nee, dat is de présent.'], uh: 'Conditionnel: "zou".' },
      { v: 'Wat kenmerkt formeel register in het Frans?', o: ['de vous-vorm en nette taal', 'straattaal', 'de tu-vorm', 'afkortingen'], c: 0, d: 2, uo: ['Klopt: formeel gebruikt vous en verzorgde taal.', 'Nee, dat is informeel.', 'Nee, "tu" is informeel.', 'Nee, afkortingen zijn informeel.'], uh: 'Formeel: vous-vorm.' },
      { v: 'Waarmee wordt de passé composé gevormd?', o: ['avoir of être + het voltooid deelwoord', 'alleen het hele werkwoord', 'de imparfait + conditionnel', 'twee zelfstandige naamwoorden'], c: 0, d: 3, uo: ['Klopt: hulpwerkwoord avoir/être plus het voltooid deelwoord.', 'Nee, er is een hulpwerkwoord nodig.', 'Nee, dat is de hypothesevorm.', 'Nee, dat is geen werkwoordstijd.'], uh: 'Passé composé: avoir/être + voltooid deelwoord.' },
    ]),

  V('D', 'Gespreksvaardigheid',
    `In een Frans gesprek spreek je met <strong>vlotheid</strong>, pas je je <strong>register</strong> aan en introduceer je een <strong>standpunt</strong> ("Par ailleurs…"). Je doet een <strong>concessie</strong> ("Certes, il est vrai que… mais…"), <strong>omschrijft</strong> onbekende woorden en vraagt om verduidelijking.`,
    [
      { h: '1. Vlot spreken', p: [
        `<strong>Vlotheid</strong> is vloeiend spreken zonder bij elke fout te stoppen; goede <strong>uitspraak</strong> maakt je verstaanbaar. <strong>Vulwoorden</strong> ("euh", "ben") kopen denktijd. Je past je <strong>register</strong> aan de situatie aan.`] },
      { h: '2. Interactie', p: [
        `Je introduceert een <strong>standpunt</strong> ("Par ailleurs…", "D'un autre côté…"), stemt in ("Je suis d'accord") of doet een <strong>concessie</strong> ("Certes, il est vrai que… mais…"). Weet je een woord niet, dan <strong>omschrijf</strong> je het. Bij twijfel vraag je om <strong>verduidelijking</strong> ("Qu'est-ce que vous voulez dire?").`] },
    ],
    [
      { t: 'Fluency', d: 'de vlotheid waarmee je spreekt', k: 'vlot spreken', fout: ['Uitspraak'] },
      { t: 'Register', d: 'de mate van formaliteit van je spreektaal', k: 'mate van formaliteit', fout: ['Fluency'] },
      { t: 'Standpunt introduceren', d: 'je mening inbrengen, bijvoorbeeld met "Par ailleurs…"', k: 'mening inbrengen', fout: ['Concessie'] },
      { t: 'Concessie', d: 'toegeven dat de ander deels gelijk heeft ("Certes… mais…")', k: 'een punt toegeven', fout: ['Instemmen'] },
      { t: 'Omschrijven', d: 'een onbekend woord met andere woorden uitleggen', k: 'in andere woorden zeggen', fout: ['Verduidelijking vragen'] },
      { t: 'Instemmen', d: 'aangeven dat je het eens bent ("Je suis d\'accord")', k: 'het eens zijn', fout: ['Concessie'] },
      { t: 'Vulwoorden', d: 'woordjes als "euh" of "ben" die een pauze vullen', k: 'pauze vullen', fout: ['Fluency'] },
      { t: 'Uitspraak', d: 'de manier waarop je de klanken vormt', k: 'klanken vormen', fout: ['Fluency'] },
      { t: 'Verduidelijking vragen', d: 'vragen wat iemand precies bedoelt', k: 'om uitleg vragen', fout: ['Omschrijven'] },
      { t: 'Doorvragen', d: 'extra vragen stellen om meer te weten te komen', k: 'extra vragen stellen', fout: ['Instemmen'] },
    ],
    [
      { v: 'Welke uitdrukking gebruik je in het Frans om een ander standpunt te introduceren?', o: ['"Par ailleurs…" of "D\'un autre côté…"', '"C\'est faux."', '"Je m\'arrête."', '"Je ne comprends rien."'], c: 0, d: 3, uo: ['Klopt: hiermee breng je netjes een nieuw punt in.', 'Nee, dat is een aanval.', 'Nee, dat stopt het gesprek.', 'Nee, dat ontwijkt.'], uh: 'Standpunt: "Par ailleurs…".' },
      { v: 'Hoe introduceer je in het Frans een concessie voordat je je eigen standpunt geeft?', o: ['"Certes, il est vrai que… mais cependant…"', '"Vous avez tout à fait tort."', 'door te onderbreken', 'door te zwijgen'], c: 0, d: 3, uo: ['Klopt: je erkent een punt voor je het weerlegt.', 'Nee, dat is een aanval.', 'Nee, onderbreken is onbeleefd.', 'Nee, zwijgen zegt niets.'], uh: 'Concessie: "Certes… mais…".' },
      { v: 'Wat is vlotheid (fluency) in een gesprek?', o: ['de vlotheid waarmee je spreekt', 'het aantal woorden dat je kent', 'je accent', 'je leestempo'], c: 0, d: 2, uo: ['Klopt: vlotheid is vloeiend spreken.', 'Nee, dat is woordenschat.', 'Nee, dat is uitspraak.', 'Nee, dat is lezen.'], uh: 'Fluency: vlotheid van spreken.' },
      { v: 'Wat doe je als je een Frans woord niet kent tijdens het spreken?', o: ['je omschrijft het met andere woorden', 'je zwijgt', 'je stopt het gesprek', 'je gebruikt Nederlands'], c: 0, d: 3, uo: ['Klopt: omschrijven houdt het gesprek gaande.', 'Nee, dan valt het stil.', 'Nee, dat is niet nodig.', 'Nee, blijf in het Frans.'], uh: 'Onbekend woord: omschrijven.' },
      { v: 'Wat is beurt nemen in een gesprek?', o: ['op je beurt wachten en dan spreken', 'door de ander heen praten', 'maar één keer spreken', 'hardop voorlezen'], c: 0, d: 2, uo: ['Klopt: sprekers wisselen elkaar netjes af.', 'Nee, dat is onderbreken.', 'Nee, een gesprek heeft meerdere beurten.', 'Nee, dat is geen gesprek.'], uh: 'Beurt nemen: netjes afwisselen.' },
      { v: 'Wat zijn vulwoorden?', o: ['woordjes als "euh" of "ben" die een pauze vullen', 'formele verbindingswoorden', 'scheldwoorden', 'werkwoordstijden'], c: 0, d: 2, uo: ['Klopt: vulwoorden geven je denktijd.', 'Nee, dat zijn connecteurs.', 'Nee, dat is iets anders.', 'Nee, dat is grammatica.'], uh: 'Vulwoorden: "euh", "ben".' },
      { v: 'Waarom pas je je register aan?', o: ['om formeel te zijn bij onbekenden en informeel bij vrienden', 'om sneller te praten', 'om langere zinnen te maken', 'om netjes te schrijven'], c: 0, d: 2, uo: ['Klopt: het register past bij de situatie.', 'Nee, tempo is los daarvan.', 'Nee, dat hoort er niet bij.', 'Nee, dit gaat over spreken.'], uh: 'Register: formeel of informeel naar situatie.' },
      { v: 'Hoe vraag je in het Frans om verduidelijking?', o: ['"Qu\'est-ce que vous voulez dire?"', '"Je le sais déjà."', '"Passons."', 'door niets te zeggen'], c: 0, d: 2, uo: ['Klopt: hiermee vraag je uitleg.', 'Nee, dat sluit het af.', 'Nee, dat slaat het over.', 'Nee, zwijgen verheldert niets.'], uh: 'Verduidelijking: "Qu\'est-ce que vous voulez dire?".' },
      { v: 'Hoe stem je in het Frans in met de ander?', o: ['"Je suis d\'accord"', '"C\'est faux"', 'door te zwijgen', 'door van onderwerp te wisselen'], c: 0, d: 2, uo: ['Klopt: dit toont instemming.', 'Nee, dat is oneens zijn.', 'Nee, zwijgen is onduidelijk.', 'Nee, dat ontwijkt.'], uh: 'Instemmen: "Je suis d\'accord".' },
      { v: 'Waarom is een goede uitspraak belangrijk?', o: ['om verstaan te worden', 'om sneller te praten', 'om langere woorden te gebruiken', 'om netjes te schrijven'], c: 0, d: 1, uo: ['Klopt: duidelijke klanken maken je verstaanbaar.', 'Nee, tempo is los daarvan.', 'Nee, dat is woordenschat.', 'Nee, dit gaat over spreken.'], uh: 'Uitspraak: om verstaan te worden.' },
    ]),

  V('E', 'Literatuur',
    `De Franse literatuur kent stromingen als het <strong>Classicisme</strong> (strenge regels, de drie eenheden), het <strong>Romantisme</strong> (gevoel, natuur), het <strong>Réalisme</strong> (Flaubert) en het <strong>Existentialisme</strong> (Camus). <strong>Molière</strong> bespotte misstanden met <strong>satire</strong>.`,
    [
      { h: '1. Stromingen', p: [
        `Het <strong>Classicisme</strong> (17e eeuw: Molière, Racine, Corneille) volgt strenge regels zoals de <strong>drie eenheden</strong> (tijd, plaats, handeling) en idealiseert de Oudheid. Het <strong>Romantisme</strong> (19e eeuw) viert subjectief gevoel, de natuur en het individu. Het <strong>Réalisme</strong> geeft de werkelijkheid getrouw weer; Flaubert schreef Madame Bovary (1857).`] },
      { h: '2. Existentialisme en techniek', p: [
        `Het <strong>Existentialisme</strong> stelt dat de mens in een absurde wereld zelf betekenis moet geven; <strong>Camus</strong> schreef L'Étranger (1942) over Meursault. <strong>Molière</strong> gebruikte <strong>satire</strong> om maatschappelijke ondeugden te bespotten. Een <strong>narrateur omniscient</strong> weet alles over alle personages.`] },
    ],
    [
      { t: 'Classicisme', d: 'stroming met strenge regels, de drie eenheden en idealisering van de Oudheid', k: 'strenge regels, drie eenheden', fout: ['Romantisme'] },
      { t: 'Romantisme', d: 'stroming met subjectief gevoel, natuur en het individu', k: 'gevoel en natuur', fout: ['Classicisme'] },
      { t: 'Réalisme', d: 'stroming die de werkelijkheid getrouw weergeeft', k: 'werkelijkheid getrouw', fout: ['Romantisme'] },
      { t: 'Existentialisme', d: 'stroming waarin de mens in een absurde wereld zelf betekenis geeft', k: 'zelf betekenis geven', fout: ['Réalisme'] },
      { t: 'Madame Bovary', d: 'roman van Flaubert (1857), hoogtepunt van het Réalisme', k: 'Flaubert, Réalisme', fout: ['L\'Étranger'] },
      { t: 'L\'Étranger', d: 'roman van Camus (1942) over Meursault, verbonden met het existentialisme', k: 'Camus, Meursault', fout: ['Madame Bovary'] },
      { t: 'Satire', d: 'het bespotten van misstanden via humor, zoals bij Molière', k: 'misstanden bespotten', fout: ['Narrateur omniscient'] },
      { t: 'Narrateur omniscient', d: 'een verteller die alles weet over alle personages', k: 'weet alles', fout: ['Satire'] },
      { t: 'Lumières', d: 'de Verlichting: rede, kritiek en vooruitgang (Voltaire, Rousseau)', k: 'rede en kritiek', fout: ['Romantisme'] },
      { t: 'Drie eenheden', d: 'de klassieke regel van eenheid van tijd, plaats en handeling', k: 'tijd, plaats, handeling', fout: ['Classicisme'] },
    ],
    [
      { v: 'Welke Franse auteur schreef "L\'Étranger" (1942), over Meursault?', o: ['Albert Camus', 'Gustave Flaubert', 'Molière', 'Victor Hugo'], c: 0, d: 2, uo: ['Klopt: Camus schreef L\'Étranger.', 'Nee, die schreef Madame Bovary.', 'Nee, die schreef klassiek toneel.', 'Nee, die was een romanticus.'], uh: 'L\'Étranger: Albert Camus.' },
      { v: 'Welke stroming kenmerkt zich door subjectief gevoel en verheerlijking van de natuur (19e eeuw)?', o: ['le Romantisme', 'le Classicisme', 'le Réalisme', 'les Lumières'], c: 0, d: 3, uo: ['Klopt: het Romantisme viert gevoel en natuur.', 'Nee, dat volgt strenge regels.', 'Nee, dat geeft de werkelijkheid weer.', 'Nee, dat stelt de rede centraal.'], uh: 'Romantisme: gevoel en natuur.' },
      { v: 'Welke stroming kenmerkt zich door strenge regels (de drie eenheden) en idealisering van de Oudheid?', o: ['le Classicisme', 'le Romantisme', 'le Réalisme', 'le Surréalisme'], c: 0, d: 3, uo: ['Klopt: het Classicisme volgt de drie eenheden.', 'Nee, dat breekt met regels.', 'Nee, dat draait om de werkelijkheid.', 'Nee, dat is 20e-eeuws en droomachtig.'], uh: 'Classicisme: strenge regels, drie eenheden.' },
      { v: 'Welke stijl van Molière bespot maatschappelijke ondeugden via komische personages?', o: ['satire', 'lyriek', 'epiek', 'tragedie'], c: 0, d: 3, uo: ['Klopt: Molière gebruikte satire.', 'Nee, dat is gevoelspoëzie.', 'Nee, dat is verhalende dichtkunst.', 'Nee, dat is juist ernstig.'], uh: 'Molière: satire.' },
      { v: 'Welk werk van Gustave Flaubert (1857) geldt als hoogtepunt van het Réalisme?', o: ['Madame Bovary', 'L\'Étranger', 'Les Misérables', 'Candide'], c: 0, d: 3, uo: ['Klopt: Madame Bovary van Flaubert.', 'Nee, dat is van Camus.', 'Nee, dat is van Victor Hugo.', 'Nee, dat is van Voltaire.'], uh: 'Madame Bovary: Flaubert, Réalisme.' },
      { v: 'Wat stelt het existentialisme centraal?', o: ['de mens moet in een absurde wereld zelf betekenis geven', 'strenge klassieke regels', 'de verheerlijking van de natuur', 'de idealisering van de Oudheid'], c: 0, d: 3, uo: ['Klopt: de mens schept zelf betekenis in een absurde wereld.', 'Nee, dat is het Classicisme.', 'Nee, dat is de Romantiek.', 'Nee, dat is klassiek.'], uh: 'Existentialisme: zelf betekenis geven.' },
      { v: 'Welke verteltechniek weet alles over alle personages?', o: ['le narrateur omniscient', 'le narrateur "je"', 'la satire', 'le motif'], c: 0, d: 2, uo: ['Klopt: de alwetende verteller kent alles.', 'Nee, die vertelt beperkt vanuit ik.', 'Nee, dat is een stijlvorm.', 'Nee, dat is een terugkerend element.'], uh: 'Narrateur omniscient: weet alles.' },
      { v: 'Wat kenmerkt de Lumières (de Verlichting)?', o: ['rede, kritiek en vooruitgang (Voltaire, Rousseau)', 'irrationeel gevoel', 'de drie eenheden', 'de absurde wereld'], c: 0, d: 3, uo: ['Klopt: de Lumières stellen de rede centraal.', 'Nee, dat is de Romantiek.', 'Nee, dat is het Classicisme.', 'Nee, dat is het existentialisme.'], uh: 'Lumières: rede en kritiek.' },
      { v: 'Wat houden de drie eenheden in het klassieke toneel in?', o: ['eenheid van tijd, plaats en handeling', 'begin, midden en einde', 'rijm, ritme en metrum', 'held, schurk en helper'], c: 0, d: 3, uo: ['Klopt: één tijd, één plaats, één handeling.', 'Nee, dat is de gewone opbouw.', 'Nee, dat hoort bij poëzie.', 'Nee, dat zijn personages.'], uh: 'Drie eenheden: tijd, plaats, handeling.' },
      { v: 'Wat kenmerkt het Réalisme?', o: ['de werkelijkheid getrouw en nuchter weergeven', 'irrationeel verlangen', 'strenge klassieke regels', 'droomachtige beelden'], c: 0, d: 2, uo: ['Klopt: het Réalisme toont de werkelijkheid zoals ze is.', 'Nee, dat is de Romantiek.', 'Nee, dat is het Classicisme.', 'Nee, dat is het surrealisme.'], uh: 'Réalisme: werkelijkheid getrouw weergeven.' },
    ]),
];
