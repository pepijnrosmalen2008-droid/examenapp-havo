// VWO Duits - gouden-stijl contentspec. Vervangt crude generatorvragen
// door authored strategie-/inzichtvragen met per-optie-uitleg + situaties.
const V = (domein, naam, intro, secties, concepten, vragen) => ({ niveau: 'vwo', vak: 'du', domein, naam, intro, secties, concepten, vragen });

export default [
  V('A', 'Leesvaardigheid',
    `Bij het lezen van Duitse teksten gebruik je <strong>skimmen</strong> (globaal) en <strong>scannen</strong> (gericht zoeken), leid je onbekende woorden af uit de <strong>context</strong> en herken je Duitse <strong>samenstellingen</strong>. <strong>Signaalwoorden</strong> als <em>jedoch</em> (maar) en <em>deshalb</em> (daarom) geven het verband aan. Het CE-niveau is B2.`,
    [
      { h: '1. Leestechnieken', p: [
        `<strong>Skimmen</strong> is snel lezen voor de grote lijn (titel, inleiding, eerste zinnen); <strong>scannen</strong> is gericht zoeken naar een naam of getal. Een onbekend woord ontleed je als <strong>samenstelling</strong> (Handschuh = Hand + Schuh) en raad je uit de <strong>context</strong>.`] },
      { h: '2. Signaalwoorden', p: [
        `<em>jedoch</em> = echter/maar (tegenstelling), <em>deshalb/daher</em> = daarom/dus (gevolg), <em>außerdem</em> = bovendien (opsomming), <em>nämlich</em> = namelijk/want (reden), <em>trotzdem</em> = toch/desondanks (concessie). Het verwachte <strong>ERK-niveau</strong> voor VWO Duits is B2.`] },
    ],
    [
      { t: 'Skimmen', d: 'snel lezen om globaal te weten waar een tekst over gaat', k: 'globaal lezen', fout: ['Scannen'] },
      { t: 'Scannen', d: 'gericht zoeken naar een naam, datum of getal', k: 'gericht zoeken', fout: ['Skimmen'] },
      { t: 'jedoch', d: 'het Duitse signaalwoord voor echter of maar', k: 'echter/maar', fout: ['deshalb'] },
      { t: 'deshalb', d: 'het Duitse signaalwoord voor daarom of dus', k: 'daarom/dus', fout: ['jedoch'] },
      { t: 'Context', d: 'de omringende woorden die de betekenis verduidelijken', k: 'omringende woorden', fout: ['Samenstelling'] },
      { t: 'Samenstelling', d: 'een Duits woord dat uit meerdere woorden is opgebouwd', k: 'woord uit delen', fout: ['Context'] },
      { t: 'außerdem', d: 'het Duitse signaalwoord voor bovendien', k: 'bovendien', fout: ['nämlich'] },
      { t: 'nämlich', d: 'het Duitse signaalwoord voor namelijk of want', k: 'namelijk/want', fout: ['außerdem'] },
      { t: 'trotzdem', d: 'het Duitse signaalwoord voor toch of desondanks', k: 'toch/desondanks', fout: ['jedoch'] },
      { t: 'ERK B2', d: 'het CE-niveau dat voor VWO Duits wordt verwacht', k: 'CE-niveau VWO Duits', fout: ['Skimmen'] },
    ],
    [
      { v: 'Wat betekent het signaalwoord "jedoch" in een Duitse tekst?', o: ['echter / maar', 'daarom / dus', 'bovendien', 'namelijk'], c: 0, d: 2, uo: ['Klopt: "jedoch" drukt een tegenstelling uit.', 'Nee, dat is "deshalb".', 'Nee, dat is "außerdem".', 'Nee, dat is "nämlich".'], uh: '"jedoch": echter/maar (tegenstelling).' },
      { v: 'Hoe kun je de betekenis van een onbekend Duits woord bepalen?', o: ['ontleed het als samenstelling en gebruik de context', 'sla het altijd over', 'vertaal alleen de eerste letter', 'raad willekeurig'], c: 0, d: 2, uo: ['Klopt: Duitse woorden zijn vaak samenstellingen die je uit context begrijpt.', 'Nee, dan mis je de betekenis.', 'Nee, één letter zegt niets.', 'Nee, gebruik de aanwijzingen.'], uh: 'Onbekend woord: ontleed + context.' },
      { v: 'Welk ERK-niveau wordt voor VWO Duits bij het CE verwacht?', o: ['B2', 'A1', 'C2', 'A2'], c: 0, d: 2, uo: ['Klopt: VWO Duits mikt op B2.', 'Nee, dat is beginnersniveau.', 'Nee, dat is bijna moedertaalniveau.', 'Nee, dat is nog basaal.'], uh: 'VWO Duits CE: B2.' },
      { v: 'Welke leestechniek gebruik je om snel te weten waar een tekst globaal over gaat?', o: ['skimmen', 'scannen', 'woord voor woord lezen', 'hardop lezen'], c: 0, d: 2, uo: ['Klopt: skimmen geeft snel de grote lijn.', 'Nee, dat is gericht zoeken.', 'Nee, dat kost te veel tijd.', 'Nee, dat helpt niet voor de globale inhoud.'], uh: 'Skimmen: globaal, voor de grote lijn.' },
      { v: 'Wat betekent "deshalb" in een Duitse tekst?', o: ['daarom / dus (gevolg)', 'echter / maar', 'bovendien', 'toch'], c: 0, d: 2, uo: ['Klopt: "deshalb" leidt een gevolg in.', 'Nee, dat is "jedoch".', 'Nee, dat is "außerdem".', 'Nee, dat is "trotzdem".'], uh: '"deshalb": daarom/dus (gevolg).' },
      { v: 'Welke leestechniek gebruik je om in een lange tekst een naam of getal te zoeken?', o: ['scannen', 'skimmen', 'samenvatten', 'vertalen'], c: 0, d: 2, uo: ['Klopt: scannen zoekt gericht naar een detail.', 'Nee, dat is voor de grote lijn.', 'Nee, dat doe je achteraf.', 'Nee, dat kost te veel tijd.'], uh: 'Scannen: gericht zoeken naar een detail.' },
      { v: 'Wat betekent "außerdem"?', o: ['bovendien', 'echter', 'daarom', 'toch'], c: 0, d: 2, uo: ['Klopt: "außerdem" voegt iets toe.', 'Nee, dat is "jedoch".', 'Nee, dat is "deshalb".', 'Nee, dat is "trotzdem".'], uh: '"außerdem": bovendien (opsomming).' },
      { v: 'Wat betekent "trotzdem"?', o: ['toch / desondanks', 'daarom', 'bovendien', 'namelijk'], c: 0, d: 2, uo: ['Klopt: "trotzdem" drukt een concessie uit.', 'Nee, dat is "deshalb".', 'Nee, dat is "außerdem".', 'Nee, dat is "nämlich".'], uh: '"trotzdem": toch/desondanks.' },
      { v: 'Hoe lees je het Duitse woord "Handschuh" het best?', o: ['deel het in Hand + Schuh en leid de betekenis af', 'sla het over', 'lees alleen "Hand"', 'vertaal het als "handschoen" zonder na te denken'], c: 0, d: 3, uo: ['Klopt: ontleden van de samenstelling geeft "handschoen".', 'Nee, dan mis je de betekenis.', 'Nee, het tweede deel telt ook.', 'Nee, juist door te ontleden begrijp je waarom.'], uh: 'Samenstelling ontleden: Hand + Schuh = handschoen.' },
      { v: 'Wat betekent "nämlich"?', o: ['namelijk / want', 'echter', 'bovendien', 'toch'], c: 0, d: 2, uo: ['Klopt: "nämlich" geeft een reden of toelichting.', 'Nee, dat is "jedoch".', 'Nee, dat is "außerdem".', 'Nee, dat is "trotzdem".'], uh: '"nämlich": namelijk/want (reden).' },
      { v: 'Waar helpt de context je bij het lezen?', o: ['de betekenis van een onbekend woord raden', 'de spelling exact geven', 'de tekst korter maken', 'de tijd meten'], c: 0, d: 2, uo: ['Klopt: de omringende woorden hinten naar de betekenis.', 'Nee, context is geen woordenboek.', 'Nee, dat is samenvatten.', 'Nee, dat is niet de functie.'], uh: 'Context: onbekende woorden raden.' },
    ]),

  V('B', 'Luistervaardigheid',
    `Bij luisteren kies je tussen de <strong>grote lijn</strong> (gist) en <strong>details</strong>. Je <strong>voorspelt</strong> de inhoud uit titel en beeld, noteert <strong>kernwoorden</strong> en gebruikt de <strong>context</strong>. Gesproken signaalwoorden als <em>nämlich</em> en <em>also</em> sturen je begrip. In een formele opname hoor je de <strong>Sie</strong>-vorm.`,
    [
      { h: '1. Luisterstrategie', p: [
        `Luister je op de <strong>grote lijn</strong>, dan zoek je het hoofdonderwerp; luister je op <strong>detail</strong>, dan zoek je specifieke informatie. Lees eerst de vragen en <strong>voorspel</strong> de inhoud. <strong>Kernwoorden</strong> dragen de betekenis.`] },
      { h: '2. Register en signaalwoorden', p: [
        `<em>nämlich</em> = namelijk/want, <em>also</em> = dus/kortom. In een formeel fragment (interview) hoor je de beleefde <strong>Sie</strong>-vorm; onder vrienden de <strong>du</strong>-vorm. Mis je een woord, gebruik dan de <strong>context</strong> en luister door voor de grote lijn.`] },
    ],
    [
      { t: 'nämlich', d: 'gesproken signaalwoord voor namelijk of want', k: 'namelijk/want', fout: ['also'] },
      { t: 'also', d: 'gesproken signaalwoord voor dus of kortom', k: 'dus/kortom', fout: ['nämlich'] },
      { t: 'Formeel register', d: 'nette taal met de Sie-vorm in een officiële situatie', k: 'Sie-vorm, nette taal', fout: ['Informeel register'] },
      { t: 'Gist', d: 'de grote lijn van wat gezegd wordt', k: 'grote lijn', fout: ['Detail'] },
      { t: 'Detail', d: 'een specifiek gegeven in een fragment', k: 'specifiek gegeven', fout: ['Gist'] },
      { t: 'Kernwoorden', d: 'de belangrijkste woorden die de betekenis dragen', k: 'belangrijkste woorden', fout: ['Context'] },
      { t: 'Voorspellen', d: 'de inhoud vooraf inschatten uit titel en beeld', k: 'inhoud vooraf inschatten', fout: ['Kernwoorden'] },
      { t: 'Sie-vorm', d: 'de beleefde aanspreekvorm in het Duits', k: 'beleefde aanspreekvorm', fout: ['du-vorm'] },
      { t: 'du-vorm', d: 'de informele aanspreekvorm in het Duits', k: 'informele aanspreekvorm', fout: ['Sie-vorm'] },
      { t: 'Context', d: 'de situatie eromheen die helpt een woord te begrijpen', k: 'situatie eromheen', fout: ['Kernwoorden'] },
    ],
    [
      { v: 'Wat betekent "nämlich" in gesproken Duits?', o: ['namelijk / want', 'dus / kortom', 'echter', 'toch'], c: 0, d: 2, uo: ['Klopt: "nämlich" geeft een reden.', 'Nee, dat is "also".', 'Nee, dat is "jedoch".', 'Nee, dat is "trotzdem".'], uh: '"nämlich": namelijk/want.' },
      { v: 'Wat is de functie van "also" in gesproken Duits?', o: ['dus / kortom / zeg maar', 'echter', 'bovendien', 'namelijk'], c: 0, d: 2, uo: ['Klopt: "also" vat samen of leidt een gevolg in.', 'Nee, dat is "jedoch".', 'Nee, dat is "außerdem".', 'Nee, dat is "nämlich".'], uh: '"also": dus/kortom.' },
      { v: 'Welk register hoor je in een officieel Duits interview?', o: ['formeel register met de Sie-vorm', 'straattaal', 'dialect', 'kindertaal'], c: 0, d: 2, uo: ['Klopt: een officieel interview is formeel, met Sie.', 'Nee, dat past niet bij een interview.', 'Nee, dat is te informeel.', 'Nee, dat past niet.'], uh: 'Officieel: formeel register, Sie-vorm.' },
      { v: 'Wat betekent luisteren op de grote lijn?', o: ['het hoofdonderwerp begrijpen', 'elk exact getal noteren', 'ieder woord opschrijven', 'de uitspraak beoordelen'], c: 0, d: 2, uo: ['Klopt: de grote lijn is het hoofdonderwerp.', 'Nee, dat is op detail.', 'Nee, dat lukt niet.', 'Nee, dat is een spreekdoel.'], uh: 'Grote lijn: het hoofdonderwerp.' },
      { v: 'Wat betekent luisteren op detail?', o: ['specifieke informatie zoeken', 'alleen de grote lijn pakken', 'niets noteren', 'gokken'], c: 0, d: 2, uo: ['Klopt: op detail zoek je specifieke gegevens.', 'Nee, dat is de gist.', 'Nee, je zoekt juist gericht.', 'Nee, dat is geen strategie.'], uh: 'Detail: specifieke informatie.' },
      { v: 'Wat helpt je de inhoud te voorspellen voor je luistert?', o: ['de titel en het beeld', 'alleen het laatste woord', 'de naam van de spreker', 'de lengte van de opname'], c: 0, d: 2, uo: ['Klopt: titel en beeld scheppen verwachtingen.', 'Nee, dat heb je nog niet gehoord.', 'Nee, een naam zegt weinig.', 'Nee, dat helpt niet.'], uh: 'Voorspellen uit titel en beeld.' },
      { v: 'Wat is de Sie-vorm?', o: ['de beleefde aanspreekvorm', 'de informele aanspreekvorm', 'de verleden tijd', 'een naamval'], c: 0, d: 2, uo: ['Klopt: Sie is beleefd.', 'Nee, dat is "du".', 'Nee, dat is een werkwoordstijd.', 'Nee, dat is iets anders.'], uh: 'Sie: beleefde aanspreekvorm.' },
      { v: 'Wat is de du-vorm?', o: ['de informele aanspreekvorm', 'de beleefde aanspreekvorm', 'een lidwoord', 'een naamval'], c: 0, d: 1, uo: ['Klopt: "du" gebruik je informeel.', 'Nee, dat is "Sie".', 'Nee, dat is iets anders.', 'Nee, dat is iets anders.'], uh: 'du: informele aanspreekvorm.' },
      { v: 'Wat zijn kernwoorden bij het luisteren?', o: ['de belangrijkste woorden die de betekenis dragen', 'alle woorden', 'alleen het eerste woord', 'de achtergrondmuziek'], c: 0, d: 2, uo: ['Klopt: kernwoorden dragen de hoofdbetekenis.', 'Nee, niet alles is even belangrijk.', 'Nee, dat is te weinig.', 'Nee, dat is geen taal.'], uh: 'Kernwoorden: de belangrijkste woorden.' },
      { v: 'Wat doe je het best voordat een luisteropdracht start?', o: ['eerst de vragen lezen', 'je ogen sluiten', 'alvast antwoorden opschrijven', 'de titel negeren'], c: 0, d: 2, uo: ['Klopt: de vragen sturen je aandacht.', 'Nee, beeld kan helpen.', 'Nee, je hebt nog niets gehoord.', 'Nee, de titel helpt voorspellen.'], uh: 'Lees eerst de vragen.' },
    ]),

  V('C', 'Schrijfvaardigheid',
    `Bij het schrijven kies je passende <strong>Konnektoren</strong> (<em>außerdem</em>, <em>deshalb</em>, <em>jedoch</em>) en de juiste <strong>naamval</strong>. Na <em>mit, aus, bei, von</em> volgt de <strong>Dativ</strong>; na <em>durch, für, ohne, gegen</em> de <strong>Akkusativ</strong>. In een formele tekst gebruik je de <strong>Sie</strong>-vorm.`,
    [
      { h: '1. Konnektoren', p: [
        `<em>außerdem</em> = bovendien (opsomming), <em>deshalb/daher/folglich</em> = daarom/bijgevolg (gevolg), <em>jedoch</em> = echter (tegenstelling). In een Duitse hoofdzin staat de <strong>persoonsvorm</strong> op de tweede plaats.`] },
      { h: '2. Naamvallen', p: [
        `De vier naamvallen: <strong>Nominativ</strong> (Wer-Fall, onderwerp), <strong>Akkusativ</strong> (Wen/Was, lijdend voorwerp), <strong>Dativ</strong> (Wem, meewerkend voorwerp), <strong>Genitiv</strong> (Wessen, bezit). Na <em>mit, aus, bei, von</em> komt de Dativ; na <em>durch, für, ohne, gegen</em> de Akkusativ.`] },
    ],
    [
      { t: 'außerdem', d: 'Duitse Konnektor voor bovendien', k: 'bovendien', fout: ['deshalb'] },
      { t: 'deshalb', d: 'Duitse Konnektor voor daarom of bijgevolg', k: 'daarom/bijgevolg', fout: ['außerdem'] },
      { t: 'Dativ', d: 'de naamval die naar Wem vraagt, na mit/aus/bei/von', k: 'Wem-Fall', fout: ['Akkusativ'] },
      { t: 'Akkusativ', d: 'de naamval die naar Wen/Was vraagt, na durch/für/ohne/gegen', k: 'Wen-Fall', fout: ['Dativ'] },
      { t: 'Formeel register', d: 'nette taal met de Sie-vorm in een formele tekst', k: 'Sie-vorm, nette taal', fout: ['Informeel register'] },
      { t: 'jedoch', d: 'Duitse Konnektor voor echter of maar', k: 'echter/maar', fout: ['deshalb'] },
      { t: 'Nominativ', d: 'de naamval van het onderwerp, Wer-Fall', k: 'onderwerpsnaamval', fout: ['Akkusativ'] },
      { t: 'Genitiv', d: 'de naamval die bezit uitdrukt, Wessen-Fall', k: 'bezitsnaamval', fout: ['Dativ'] },
      { t: 'Wortstellung', d: 'de woordvolgorde, met de persoonsvorm op plaats twee in de hoofdzin', k: 'persoonsvorm op plaats twee', fout: ['Konnektor'] },
      { t: 'Konnektor', d: 'een verbindingswoord dat zinnen aan elkaar koppelt', k: 'verbindingswoord', fout: ['Wortstellung'] },
    ],
    [
      { v: 'Welk signaalwoord gebruik je in het Duits voor "bovendien"?', o: ['außerdem / darüber hinaus', 'jedoch', 'deshalb', 'trotzdem'], c: 0, d: 2, uo: ['Klopt: "außerdem" voegt toe.', 'Nee, dat is een tegenstelling.', 'Nee, dat is een gevolg.', 'Nee, dat is een concessie.'], uh: '"bovendien": außerdem.' },
      { v: 'Welke naamval gebruik je na de preposities "mit", "aus", "bei", "von"?', o: ['Dativ', 'Akkusativ', 'Nominativ', 'Genitiv'], c: 0, d: 3, uo: ['Klopt: deze preposities vragen de Dativ.', 'Nee, dat is na durch/für/ohne.', 'Nee, dat is de onderwerpsnaamval.', 'Nee, die drukt bezit uit.'], uh: 'mit/aus/bei/von + Dativ.' },
      { v: 'Welk signaalwoord gebruik je in het Duits voor "daarom / bijgevolg"?', o: ['deshalb / daher / folglich', 'außerdem', 'jedoch', 'nämlich'], c: 0, d: 2, uo: ['Klopt: deze woorden leiden een gevolg in.', 'Nee, dat is opsomming.', 'Nee, dat is tegenstelling.', 'Nee, dat is een reden.'], uh: '"daarom": deshalb/daher.' },
      { v: 'Welke naamval gebruik je na "durch", "für", "ohne", "gegen"?', o: ['Akkusativ', 'Dativ', 'Genitiv', 'Nominativ'], c: 0, d: 3, uo: ['Klopt: deze preposities vragen de Akkusativ.', 'Nee, dat is na mit/aus/bei/von.', 'Nee, die drukt bezit uit.', 'Nee, dat is het onderwerp.'], uh: 'durch/für/ohne/gegen + Akkusativ.' },
      { v: 'Wat is de Nominativ?', o: ['de naamval van het onderwerp (Wer-Fall)', 'de naamval van het bezit', 'de naamval na "mit"', 'een werkwoordstijd'], c: 0, d: 2, uo: ['Klopt: de Nominativ is het onderwerp.', 'Nee, dat is de Genitiv.', 'Nee, dat is de Dativ.', 'Nee, dat is geen naamval.'], uh: 'Nominativ: het onderwerp (Wer).' },
      { v: 'Welk signaalwoord gebruik je in het Duits voor "echter / maar"?', o: ['jedoch', 'außerdem', 'deshalb', 'nämlich'], c: 0, d: 2, uo: ['Klopt: "jedoch" drukt een tegenstelling uit.', 'Nee, dat is opsomming.', 'Nee, dat is gevolg.', 'Nee, dat is een reden.'], uh: '"echter": jedoch.' },
      { v: 'Wat drukt de Genitiv uit?', o: ['bezit (Wessen), zoals "das Auto des Vaters"', 'het onderwerp', 'de tijd', 'een tegenstelling'], c: 0, d: 3, uo: ['Klopt: de Genitiv toont bezit.', 'Nee, dat is de Nominativ.', 'Nee, dat is geen naamval.', 'Nee, dat is een Konnektor.'], uh: 'Genitiv: bezit (Wessen).' },
      { v: 'Wat kenmerkt formeel register in het Duits?', o: ['de Sie-vorm en nette taal', 'straattaal', 'de du-vorm', 'afkortingen'], c: 0, d: 2, uo: ['Klopt: formeel gebruikt Sie en verzorgde taal.', 'Nee, dat is informeel.', 'Nee, "du" is informeel.', 'Nee, afkortingen zijn informeel.'], uh: 'Formeel: Sie-vorm.' },
      { v: 'Waar staat de persoonsvorm in een Duitse hoofdzin?', o: ['op de tweede plaats', 'altijd achteraan', 'altijd vooraan', 'het maakt niet uit'], c: 0, d: 3, uo: ['Klopt: in de hoofdzin staat de persoonsvorm op plaats twee.', 'Nee, dat geldt in de bijzin.', 'Nee, dat is niet de regel.', 'Nee, de woordvolgorde is vast.'], uh: 'Hoofdzin: persoonsvorm op plaats twee.' },
      { v: 'Naar welk vraagwoord verwijst de Dativ?', o: ['Wem', 'Wen', 'Wer', 'Wessen'], c: 0, d: 3, uo: ['Klopt: de Dativ is de Wem-Fall.', 'Nee, dat is de Akkusativ.', 'Nee, dat is de Nominativ.', 'Nee, dat is de Genitiv.'], uh: 'Dativ: Wem-Fall.' },
    ]),

  V('D', 'Gespreksvaardigheid',
    `In een Duits gesprek spreek je met <strong>Flüssigkeit</strong> (vlotheid), pas je je <strong>register</strong> aan en introduceer je een <strong>standpunt</strong> ("Meiner Meinung nach…"). Je doet een <strong>concessie</strong> ("Das stimmt, aber…"), <strong>omschrijft</strong> onbekende woorden en vraagt door.`,
    [
      { h: '1. Vlot spreken', p: [
        `<strong>Flüssigkeit</strong> is vloeiend spreken zonder bij elke fout te stoppen; goede <strong>uitspraak</strong> maakt je verstaanbaar. <strong>Vulwoorden</strong> ("äh", "naja") kopen denktijd. Je past je <strong>register</strong> aan de situatie aan.`] },
      { h: '2. Interactie', p: [
        `Je introduceert een <strong>standpunt</strong> ("Meiner Meinung nach…"), stemt in ("Da stimme ich zu") of doet een <strong>concessie</strong> ("Das stimmt, aber…"). Weet je een woord niet, dan <strong>omschrijf</strong> je het. Bij twijfel vraag je om <strong>verduidelijking</strong> ("Wie meinen Sie das?").`] },
    ],
    [
      { t: 'Flüssigkeit', d: 'de vlotheid waarmee je spreekt', k: 'vlot spreken', fout: ['Uitspraak'] },
      { t: 'Register', d: 'de mate van formaliteit van je spreektaal', k: 'mate van formaliteit', fout: ['Flüssigkeit'] },
      { t: 'Standpunt introduceren', d: 'je mening inbrengen, bijvoorbeeld met "Meiner Meinung nach…"', k: 'mening inbrengen', fout: ['Concessie'] },
      { t: 'Concessie', d: 'toegeven dat de ander deels gelijk heeft ("Das stimmt, aber…")', k: 'een punt toegeven', fout: ['Instemmen'] },
      { t: 'Omschrijven', d: 'een onbekend woord met andere woorden uitleggen', k: 'in andere woorden zeggen', fout: ['Verduidelijking vragen'] },
      { t: 'Instemmen', d: 'aangeven dat je het eens bent ("Da stimme ich zu")', k: 'het eens zijn', fout: ['Concessie'] },
      { t: 'Vulwoorden', d: 'woordjes als "äh" of "naja" die een pauze vullen', k: 'pauze vullen', fout: ['Flüssigkeit'] },
      { t: 'Uitspraak', d: 'de manier waarop je de klanken vormt', k: 'klanken vormen', fout: ['Flüssigkeit'] },
      { t: 'Verduidelijking vragen', d: 'vragen wat iemand precies bedoelt', k: 'om uitleg vragen', fout: ['Omschrijven'] },
      { t: 'Doorvragen', d: 'extra vragen stellen om meer te weten te komen', k: 'extra vragen stellen', fout: ['Instemmen'] },
    ],
    [
      { v: 'Hoe introduceer je in het Duits je eigen standpunt?', o: ['"Meiner Meinung nach…"', '"Das ist Unsinn."', '"Ich höre auf."', '"Ich verstehe nichts."'], c: 0, d: 3, uo: ['Klopt: dit brengt je mening netjes in.', 'Nee, dat is onbeleefd.', 'Nee, dat stopt het gesprek.', 'Nee, dat ontwijkt.'], uh: 'Standpunt: "Meiner Meinung nach…".' },
      { v: 'Wat is Flüssigkeit in een gesprek?', o: ['de vlotheid waarmee je spreekt', 'het aantal woorden dat je kent', 'je accent', 'je leestempo'], c: 0, d: 2, uo: ['Klopt: Flüssigkeit is vloeiend spreken.', 'Nee, dat is woordenschat.', 'Nee, dat is uitspraak.', 'Nee, dat is lezen.'], uh: 'Flüssigkeit: vlotheid van spreken.' },
      { v: 'Wat doe je als je een Duits woord niet kent tijdens het spreken?', o: ['je omschrijft het met andere woorden', 'je zwijgt', 'je stopt het gesprek', 'je gebruikt Nederlands'], c: 0, d: 3, uo: ['Klopt: omschrijven houdt het gesprek gaande.', 'Nee, dan valt het stil.', 'Nee, dat is niet nodig.', 'Nee, blijf in het Duits.'], uh: 'Onbekend woord: omschrijven.' },
      { v: 'Hoe doe je in een gesprek een concessie?', o: ['"Das stimmt, aber…"', '"Du hast völlig unrecht."', 'door te onderbreken', 'door te zwijgen'], c: 0, d: 3, uo: ['Klopt: je erkent een punt voor je het weerlegt.', 'Nee, dat is een aanval.', 'Nee, onderbreken is onbeleefd.', 'Nee, zwijgen zegt niets.'], uh: 'Concessie: "Das stimmt, aber…".' },
      { v: 'Wat is beurt nemen (turn-taking) in een gesprek?', o: ['op je beurt wachten en dan spreken', 'door de ander heen praten', 'maar één keer spreken', 'hardop voorlezen'], c: 0, d: 2, uo: ['Klopt: sprekers wisselen elkaar netjes af.', 'Nee, dat is onderbreken.', 'Nee, een gesprek heeft meerdere beurten.', 'Nee, dat is geen gesprek.'], uh: 'Beurt nemen: netjes afwisselen.' },
      { v: 'Wat zijn vulwoorden?', o: ['woordjes als "äh" of "naja" die een pauze vullen', 'formele verbindingswoorden', 'scheldwoorden', 'naamvallen'], c: 0, d: 2, uo: ['Klopt: vulwoorden geven je denktijd.', 'Nee, dat zijn Konnektoren.', 'Nee, dat is iets anders.', 'Nee, dat is grammatica.'], uh: 'Vulwoorden: "äh", "naja".' },
      { v: 'Waarom pas je je register aan?', o: ['om formeel te zijn bij onbekenden en informeel bij vrienden', 'om sneller te praten', 'om langere zinnen te maken', 'om netjes te schrijven'], c: 0, d: 2, uo: ['Klopt: het register past bij de situatie.', 'Nee, tempo is los daarvan.', 'Nee, dat hoort er niet bij.', 'Nee, dit gaat over spreken.'], uh: 'Register: formeel of informeel naar situatie.' },
      { v: 'Hoe vraag je in het Duits om verduidelijking?', o: ['"Wie meinen Sie das?"', '"Das weiß ich schon."', '"Weiter, bitte."', 'door niets te zeggen'], c: 0, d: 2, uo: ['Klopt: hiermee vraag je uitleg.', 'Nee, dat sluit het af.', 'Nee, dat slaat het over.', 'Nee, zwijgen verheldert niets.'], uh: 'Verduidelijking: "Wie meinen Sie das?".' },
      { v: 'Hoe stem je in het Duits in met de ander?', o: ['"Da stimme ich zu"', '"Das ist falsch"', 'door te zwijgen', 'door van onderwerp te wisselen'], c: 0, d: 2, uo: ['Klopt: dit toont instemming.', 'Nee, dat is oneens zijn.', 'Nee, zwijgen is onduidelijk.', 'Nee, dat ontwijkt.'], uh: 'Instemmen: "Da stimme ich zu".' },
      { v: 'Waarom is een goede uitspraak belangrijk?', o: ['om verstaan te worden', 'om sneller te praten', 'om langere woorden te gebruiken', 'om netjes te schrijven'], c: 0, d: 1, uo: ['Klopt: duidelijke klanken maken je verstaanbaar.', 'Nee, tempo is los daarvan.', 'Nee, dat is woordenschat.', 'Nee, dit gaat over spreken.'], uh: 'Uitspraak: om verstaan te worden.' },
    ]),

  V('E', 'Literatuur',
    `De Duitse literatuur kent stromingen als de <strong>Aufklärung</strong> (rede), de <strong>Sturm und Drang</strong> (jeugdig gevoel) en de <strong>Romantik</strong> (Sehnsucht, natuur). <strong>Goethe</strong> schreef Faust; <strong>Brecht</strong> ontwikkelde het episch theater met het <strong>Verfremdungseffekt</strong>. Je herkent verteltechnieken zoals de <strong>allwissender Erzähler</strong>.`,
    [
      { h: '1. Stromingen', p: [
        `De <strong>Aufklärung</strong> stelt rede en verstand centraal; de <strong>Sturm und Drang</strong> viert jeugdig gevoel en opstand tegen regels; de <strong>Romantik</strong> kenmerkt zich door Sehnsucht, irrationeel verlangen en natuurverheerlijking. <strong>Goethe</strong> hoort bij de Weimarer Klassik en schreef Faust.`] },
      { h: '2. Verteltechniek en theater', p: [
        `Een <strong>allwissender Erzähler</strong> weet alles over alle personages; een <strong>Ich-Erzähler</strong> vertelt in de ik-vorm. Bertolt <strong>Brecht</strong> ontwikkelde het episch theater met het <strong>Verfremdungseffekt</strong>: de toeschouwer wordt bewust uit de illusie gehaald om kritisch na te denken. Een <strong>Motiv</strong> is een terugkerend element.`] },
    ],
    [
      { t: 'Verfremdungseffekt', d: 'techniek van Brecht die de toeschouwer uit de illusie haalt', k: 'uit de illusie halen', fout: ['Allwissender Erzähler'] },
      { t: 'Romantik', d: 'stroming met Sehnsucht, verlangen en natuurverheerlijking', k: 'Sehnsucht en natuur', fout: ['Aufklärung'] },
      { t: 'Faust', d: 'werk van Goethe over een geleerde die zijn ziel aan de duivel verkoopt', k: 'Goethe, ziel aan de duivel', fout: ['Verfremdungseffekt'] },
      { t: 'Allwissender Erzähler', d: 'een verteller die alles weet over alle personages', k: 'weet alles', fout: ['Ich-Erzähler'] },
      { t: 'Sturm und Drang', d: 'stroming met jeugdig gevoel en opstand tegen regels', k: 'gevoel en opstand', fout: ['Aufklärung'] },
      { t: 'Aufklärung', d: 'stroming die rede en verstand centraal stelt', k: 'rede en verstand', fout: ['Romantik'] },
      { t: 'Novelle', d: 'een kort episch prozawerk rond één opmerkelijke gebeurtenis', k: 'kort verhaal met keerpunt', fout: ['Faust'] },
      { t: 'Ich-Erzähler', d: 'een verteller die in de ik-vorm vertelt', k: 'vertelt in de ik-vorm', fout: ['Allwissender Erzähler'] },
      { t: 'Motiv', d: 'een terugkerend element in een literair werk', k: 'terugkerend element', fout: ['Novelle'] },
      { t: 'Satire', d: 'het bespotten van misstanden via humor', k: 'misstanden bespotten', fout: ['Motiv'] },
    ],
    [
      { v: 'Wat is het Verfremdungseffekt in het episch theater van Brecht?', o: ['de toeschouwer bewust uit de illusie halen om kritisch na te denken', 'de illusie zo echt mogelijk maken', 'de tekst laten rijmen', 'het decor weglaten'], c: 0, d: 3, uo: ['Klopt: Brecht doorbreekt de illusie voor kritisch nadenken.', 'Nee, dat is juist het tegenovergestelde.', 'Nee, dat gaat over poëzie.', 'Nee, dat is geen effect.'], uh: 'Verfremdungseffekt: uit de illusie halen.' },
      { v: 'Welke stroming kenmerkt zich door Sehnsucht, verlangen en natuurverheerlijking?', o: ['Romantik', 'Aufklärung', 'Sturm und Drang', 'Realismus'], c: 0, d: 3, uo: ['Klopt: dat is de Romantik.', 'Nee, die stelt de rede centraal.', 'Nee, die draait om jeugdig protest.', 'Nee, dat is nuchtere werkelijkheid.'], uh: 'Romantik: Sehnsucht en natuur.' },
      { v: 'Welk werk van Goethe beschrijft een geleerde die zijn ziel aan de duivel verkoopt?', o: ['Faust', 'Die Räuber', 'Der Prozess', 'Buddenbrooks'], c: 0, d: 2, uo: ['Klopt: Faust van Goethe.', 'Nee, dat is van Schiller.', 'Nee, dat is van Kafka.', 'Nee, dat is van Thomas Mann.'], uh: 'Faust: Goethe.' },
      { v: 'Welke verteltechniek weet alles over alle personages?', o: ['der allwissende Erzähler', 'der Ich-Erzähler', 'die Novelle', 'das Motiv'], c: 0, d: 2, uo: ['Klopt: de alwetende verteller kent alles.', 'Nee, die vertelt beperkt vanuit ik.', 'Nee, dat is een tekstsoort.', 'Nee, dat is een terugkerend element.'], uh: 'Allwissender Erzähler: weet alles.' },
      { v: 'Wat kenmerkt de Sturm und Drang?', o: ['jeugdig gevoel en opstand tegen regels', 'strenge rede en verstand', 'nuchter realisme', 'religieuze mystiek'], c: 0, d: 3, uo: ['Klopt: de Sturm und Drang viert gevoel en rebellie.', 'Nee, dat is de Aufklärung.', 'Nee, dat is het Realismus.', 'Nee, dat past niet.'], uh: 'Sturm und Drang: gevoel en opstand.' },
      { v: 'Wat kenmerkt de Aufklärung?', o: ['rede en verstand staan centraal', 'irrationeel verlangen', 'natuurverheerlijking', 'opstand tegen regels'], c: 0, d: 3, uo: ['Klopt: de Aufklärung stelt de rede centraal.', 'Nee, dat is de Romantik.', 'Nee, ook Romantik.', 'Nee, dat is Sturm und Drang.'], uh: 'Aufklärung: rede en verstand.' },
      { v: 'Wat is een Novelle?', o: ['een kort episch prozawerk rond één opmerkelijke gebeurtenis', 'een lang heldendicht', 'een toneelstuk in verzen', 'een liefdesgedicht'], c: 0, d: 3, uo: ['Klopt: de Novelle draait om één keerpunt.', 'Nee, dat is een epos.', 'Nee, dat is drama.', 'Nee, dat is lyriek.'], uh: 'Novelle: kort verhaal met een keerpunt.' },
      { v: 'Wat is een Ich-Erzähler?', o: ['een verteller die in de ik-vorm vertelt', 'een alwetende verteller', 'de hoofdpersoon altijd', 'de schrijver zelf'], c: 0, d: 2, uo: ['Klopt: de Ich-Erzähler vertelt vanuit "ik".', 'Nee, dat is de allwissende.', 'Nee, dat hoeft niet.', 'Nee, verteller en schrijver verschillen.'], uh: 'Ich-Erzähler: vertelt in de ik-vorm.' },
      { v: 'Wat is een Motiv in de literatuur?', o: ['een terugkerend element in een werk', 'de hoofdpersoon', 'de laatste scène', 'het rijmschema'], c: 0, d: 2, uo: ['Klopt: een Motiv keert terug in het werk.', 'Nee, dat is een personage.', 'Nee, dat is structuur.', 'Nee, dat is vorm.'], uh: 'Motiv: terugkerend element.' },
      { v: 'Welk theater ontwikkelde Bertolt Brecht?', o: ['het episch theater', 'het klassieke treurspel', 'de opera', 'het absurdisme'], c: 0, d: 3, uo: ['Klopt: Brecht staat voor het episch theater.', 'Nee, dat is ouder en anders.', 'Nee, dat is muziektheater.', 'Nee, dat is een andere stroming.'], uh: 'Brecht: episch theater.' },
    ]),
];
