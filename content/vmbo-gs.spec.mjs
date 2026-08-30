// VMBO GL/TL - Geschiedenis & staatsinrichting. Gouden-stijl contentspec.
const V = (domein, naam, intro, secties, concepten) => ({ niveau: 'vmbo', vak: 'gs', domein, naam, intro, secties, concepten });

export default [
  V('A', 'Cultuur en mentaliteit',
    `<strong>Cultuur</strong> is het geheel van gewoonten, waarden en gebruiken van een groep; de <strong>mentaliteit</strong> is de manier van denken in een tijd. Door <strong>secularisatie</strong> werd religie in Nederland minder bepalend.`,
    [
      { h: '1. Cultuur, waarden en normen', p: [
        `<strong>Cultuur</strong> omvat de gewoonten, gebruiken en waarden van een groep, terwijl de <strong>mentaliteit</strong> gaat over de manier van denken in een bepaalde tijd. <strong>Waarden</strong> zijn wat mensen belangrijk vinden (bijvoorbeeld vrijheid); <strong>normen</strong> zijn de gedragsregels die daaruit volgen. Een <strong>traditie</strong> is een gewoonte die van generatie op generatie overgaat.`] },
      { h: '2. Religie en verandering', p: [
        `Lange tijd bepaalde <strong>religie</strong> het dagelijks leven. Door <strong>secularisatie</strong> werd het geloof minder belangrijk. In een vroegere <strong>standensamenleving</strong> lag je plaats vast; door <strong>emancipatie</strong> streden groepen voor gelijke rechten. <strong>Tolerantie</strong> betekent andere meningen verdragen, terwijl een <strong>vooroordeel</strong> juist een oordeel vooraf is.`] },
    ],
    [
      { t: 'Cultuur', d: 'de gewoonten, gebruiken en waarden van een groep', k: 'gewoonten en waarden', fout: ['Mentaliteit'] },
      { t: 'Mentaliteit', d: 'de manier van denken van mensen in een bepaalde tijd', k: 'manier van denken', fout: ['Cultuur'] },
      { t: 'Waarden', d: 'wat mensen belangrijk en nastrevenswaardig vinden', k: 'wat men belangrijk vindt', fout: ['Normen'] },
      { t: 'Normen', d: 'regels over hoe je je hoort te gedragen', k: 'gedragsregels', fout: ['Waarden'] },
      { t: 'Religie', d: 'een geloof met eigen regels en rituelen', k: 'een geloof', fout: ['Traditie'] },
      { t: 'Traditie', d: 'een gewoonte die van generatie op generatie overgaat', k: 'overgeleverde gewoonte', fout: ['Religie'] },
      { t: 'Secularisatie', d: 'het minder belangrijk worden van religie', k: 'religie wordt minder', fout: ['Emancipatie'] },
      { t: 'Tolerantie', d: 'het verdragen van andere meningen en geloven', k: 'anderen verdragen', fout: ['Vooroordeel'] },
      { t: 'Standensamenleving', d: 'een samenleving met vaste maatschappelijke lagen', k: 'vaste standen', fout: ['Emancipatie'] },
      { t: 'Emancipatie', d: 'het streven naar gelijke rechten en kansen', k: 'streven naar gelijkheid', fout: ['Secularisatie'] },
      { t: 'Vooroordeel', d: 'een mening vooraf, zonder de feiten te kennen', k: 'oordeel zonder feiten', fout: ['Tolerantie'] },
      { t: 'Identiteit', d: 'het gevoel bij een groep of gebied te horen', k: 'gevoel van erbij horen', fout: ['Cultuur'] },
    ]),

  V('B', 'Staatsinrichting van Nederland',
    `De <strong>Grondwet</strong> bevat de belangrijkste regels en de <strong>grondrechten</strong>. De <strong>Trias Politica</strong> verdeelt de macht in drieën. Het <strong>parlement</strong> controleert de <strong>regering</strong>.`,
    [
      { h: '1. De Grondwet en grondrechten', p: [
        `De <strong>Grondwet</strong> is de belangrijkste wet: alle andere wetten moeten eraan voldoen. Erin staan de <strong>grondrechten</strong>, zoals vrijheid van meningsuiting en het recht op gelijke behandeling. Nederland is een <strong>democratie</strong>: het volk kiest zijn vertegenwoordigers.`] },
      { h: '2. De Trias Politica', p: [
        `Om machtsmisbruik te voorkomen is de macht verdeeld (de <strong>Trias Politica</strong>): de <strong>wetgevende macht</strong> maakt wetten, de <strong>uitvoerende macht</strong> voert ze uit en de <strong>rechterlijke macht</strong> spreekt recht. Zo controleren de machten elkaar.`] },
      { h: '3. Regering en parlement', p: [
        `De <strong>regering</strong> (de koning en de ministers) bestuurt het land. Het <strong>parlement</strong>, bestaande uit de <strong>Tweede Kamer</strong> (gekozen, maakt en controleert wetten) en de <strong>Eerste Kamer</strong> (keurt wetten goed of af), controleert de regering. Samen zorgen ze onder meer voor de <strong>verzorgingsstaat</strong>.`] },
    ],
    [
      { t: 'Grondwet', d: 'de belangrijkste wet met de regels van de staat', k: 'de hoogste wet', fout: ['Grondrecht'] },
      { t: 'Grondrecht', d: 'een recht dat iedereen heeft, zoals vrijheid van meningsuiting', k: 'recht voor iedereen', fout: ['Grondwet'] },
      { t: 'Trias Politica', d: 'de scheiding in wetgevende, uitvoerende en rechterlijke macht', k: 'scheiding van machten', fout: ['Democratie'] },
      { t: 'Wetgevende macht', d: 'de macht die wetten maakt', k: 'maakt wetten', fout: ['Uitvoerende macht', 'Rechterlijke macht'] },
      { t: 'Uitvoerende macht', d: 'de macht die de wetten uitvoert, de regering', k: 'voert wetten uit', fout: ['Wetgevende macht', 'Rechterlijke macht'] },
      { t: 'Rechterlijke macht', d: 'de macht die recht spreekt, de rechters', k: 'spreekt recht', fout: ['Wetgevende macht', 'Uitvoerende macht'] },
      { t: 'Regering', d: 'de koning en de ministers samen', k: 'koning en ministers', fout: ['Parlement'] },
      { t: 'Parlement', d: 'de volksvertegenwoordiging: de Eerste en Tweede Kamer', k: 'de volksvertegenwoordiging', fout: ['Regering'] },
      { t: 'Tweede Kamer', d: 'de gekozen Kamer die wetten maakt en de regering controleert', k: 'gekozen, controleert regering', fout: ['Eerste Kamer'] },
      { t: 'Eerste Kamer', d: 'de Kamer die wetsvoorstellen goed- of afkeurt', k: 'keurt wetten goed of af', fout: ['Tweede Kamer'] },
      { t: 'Democratie', d: 'een bestuur waarin het volk zijn vertegenwoordigers kiest', k: 'het volk kiest', fout: ['Dictatuur'] },
      { t: 'Verzorgingsstaat', d: 'een staat die zorgt voor het welzijn van de burgers', k: 'staat zorgt voor burgers', fout: ['Democratie'] },
    ]),

  V('C', 'De industriële samenleving',
    `Tijdens de <strong>industriële revolutie</strong> ging productie van handwerk naar <strong>fabrieken</strong> met machines. Steden groeiden en er ontstond een <strong>sociale kwestie</strong>, waartegen <strong>vakbonden</strong> en <strong>stakingen</strong> opkwamen.`,
    [
      { h: '1. De industriële revolutie', p: [
        `Vanaf de negentiende eeuw veranderde de productie ingrijpend: de <strong>industriële revolutie</strong>. In plaats van thuis met de hand werd er in <strong>fabrieken</strong> met machines geproduceerd, aangedreven door de <strong>stoommachine</strong>. Dit maakte <strong>massaproductie</strong> mogelijk en zorgde voor <strong>verstedelijking</strong>: mensen trokken voor werk naar de stad.`] },
      { h: '2. De sociale kwestie', p: [
        `De arbeiders leefden en werkten onder slechte omstandigheden: de <strong>sociale kwestie</strong>. Er was veel <strong>kinderarbeid</strong>. <strong>Arbeiders</strong> verenigden zich in <strong>vakbonden</strong> en gebruikten de <strong>staking</strong> als middel. Tegenover het <strong>kapitalisme</strong> (bezit en winst) ontstond het <strong>socialisme</strong>, dat opkwam voor gelijkheid.`] },
    ],
    [
      { t: 'Industriële revolutie', d: 'de overgang naar productie met machines in fabrieken', k: 'productie met machines', fout: ['Massaproductie'] },
      { t: 'Fabriek', d: 'een gebouw waar met machines massaal wordt geproduceerd', k: 'gebouw met machines', fout: ['Stoommachine'] },
      { t: 'Stoommachine', d: 'een machine die met stoom fabrieken en treinen aandreef', k: 'machine op stoom', fout: ['Fabriek'] },
      { t: 'Verstedelijking', d: 'de groei van steden door de industrie', k: 'steden groeien', fout: ['Massaproductie'] },
      { t: 'Sociale kwestie', d: 'de slechte leef- en werkomstandigheden van arbeiders', k: 'ellende van arbeiders', fout: ['Kinderarbeid'] },
      { t: 'Kinderarbeid', d: 'het laten werken van kinderen in fabrieken', k: 'kinderen in de fabriek', fout: ['Sociale kwestie'] },
      { t: 'Arbeider', d: 'iemand die tegen loon in een fabriek werkt', k: 'fabriekswerker', fout: ['Vakbond'] },
      { t: 'Vakbond', d: 'een organisatie die opkomt voor arbeiders', k: 'komt op voor arbeiders', fout: ['Staking'] },
      { t: 'Staking', d: 'het neerleggen van het werk om eisen kracht bij te zetten', k: 'het werk neerleggen', fout: ['Vakbond'] },
      { t: 'Kapitalisme', d: 'een economie gebaseerd op particulier bezit en winst', k: 'bezit en winst', fout: ['Socialisme'] },
      { t: 'Socialisme', d: 'een stroming die opkomt voor gelijkheid en de arbeiders', k: 'gelijkheid voor arbeiders', fout: ['Kapitalisme'] },
      { t: 'Massaproductie', d: 'het in grote hoeveelheden maken van producten', k: 'veel tegelijk maken', fout: ['Industriële revolutie'] },
    ]),

  V('D', 'Sociale zekerheid en verzorgingsstaat',
    `Na 1945 bouwde Nederland een <strong>verzorgingsstaat</strong>: met <strong>sociale wetten</strong> en <strong>uitkeringen</strong> beschermt de <strong>sociale zekerheid</strong> mensen tegen tegenslag. Dat berust op <strong>solidariteit</strong>.`,
    [
      { h: '1. De verzorgingsstaat', p: [
        `In een <strong>verzorgingsstaat</strong> zorgt de overheid voor het welzijn van de burgers. Via <strong>sociale wetten</strong> en de <strong>sociale zekerheid</strong> krijgen mensen inkomen bij ziekte, werkloosheid of ouderdom. Dit werkt door <strong>solidariteit</strong>: gezonde en werkende mensen betalen mee voor wie het (even) niet redt.`] },
      { h: '2. Uitkeringen en pensioen', p: [
        `Wie geen werk heeft (<strong>werkloosheid</strong>) kan een <strong>uitkering</strong> krijgen; wie helemaal geen inkomen heeft, valt terug op de <strong>bijstand</strong>. Ouderen ontvangen de <strong>AOW</strong> en vaak een aanvullend <strong>pensioen</strong>. Voor verzekeringen betaal je <strong>premie</strong>. Voorzieningen die er voor iedereen zijn, heten <strong>collectieve voorzieningen</strong>.`] },
    ],
    [
      { t: 'Sociale zekerheid', d: 'het stelsel dat mensen bij tegenslag inkomen geeft', k: 'inkomen bij tegenslag', fout: ['Verzorgingsstaat'] },
      { t: 'Verzorgingsstaat', d: 'een staat die voor het welzijn van de burgers zorgt', k: 'staat zorgt voor burgers', fout: ['Sociale zekerheid'] },
      { t: 'Sociale wet', d: 'een wet die burgers beschermt tegen armoede of ziekte', k: 'beschermende wet', fout: ['Sociale zekerheid'] },
      { t: 'Uitkering', d: 'geld van de overheid voor wie niet genoeg inkomen heeft', k: 'geld bij te weinig inkomen', fout: ['Bijstand', 'Pensioen'] },
      { t: 'Werkloosheid', d: 'de situatie waarin mensen geen werk hebben', k: 'geen werk hebben', fout: ['Bijstand'] },
      { t: 'AOW', d: 'het staatspensioen voor ouderen', k: 'staatspensioen', fout: ['Pensioen'] },
      { t: 'Solidariteit', d: 'het samen dragen van risico\'s en lasten', k: 'samen risico\'s dragen', fout: ['Verzekering'] },
      { t: 'Verzekering', d: 'een afspraak die je beschermt tegen financiële risico\'s', k: 'bescherming tegen risico', fout: ['Solidariteit'] },
      { t: 'Pensioen', d: 'inkomen na je werkzame leven', k: 'inkomen na je werk', fout: ['AOW'] },
      { t: 'Bijstand', d: 'een uitkering voor wie geen ander inkomen heeft', k: 'laatste vangnet', fout: ['Uitkering'] },
      { t: 'Premie', d: 'het bedrag dat je periodiek voor een verzekering betaalt', k: 'bedrag voor verzekering', fout: ['Uitkering'] },
      { t: 'Collectieve voorziening', d: 'iets dat de overheid voor iedereen regelt', k: 'voor iedereen geregeld', fout: ['Sociale wet'] },
    ]),

  V('E', 'Ontwikkelingen na 1945',
    `Na de oorlog verdween de <strong>verzuiling</strong> en kwam de <strong>emancipatie</strong> op gang. Er ontstond een eigen <strong>jongerencultuur</strong>, en door groeiende <strong>welvaart</strong> een <strong>consumptiemaatschappij</strong>.`,
    [
      { h: '1. Ontzuiling en emancipatie', p: [
        `Vóór 1960 was de samenleving verdeeld in aparte groepen naar geloof en politiek: de <strong>verzuiling</strong>. Daarna verdwenen die scheidslijnen: de <strong>ontzuiling</strong>. Tegelijk vond <strong>emancipatie</strong> plaats (bijvoorbeeld van vrouwen) en <strong>democratisering</strong>: mensen kregen meer inspraak. Ook de <strong>secularisatie</strong> zette door.`] },
      { h: '2. Jongeren, welvaart en protest', p: [
        `Jongeren ontwikkelden een eigen <strong>jongerencultuur</strong> met eigen muziek en ideeën, en vormden <strong>protestbewegingen</strong>. Door de stijgende <strong>welvaart</strong> ontstond een <strong>consumptiemaatschappij</strong> en nam de <strong>individualisering</strong> toe. De opkomst van de <strong>massamedia</strong> vergrootte soms de <strong>generatiekloof</strong> tussen jong en oud.`] },
    ],
    [
      { t: 'Verzuiling', d: 'de indeling van de samenleving in aparte groepen naar geloof of politiek', k: 'samenleving in zuilen', fout: ['Ontzuiling'] },
      { t: 'Ontzuiling', d: 'het verdwijnen van de scheiding tussen die groepen', k: 'zuilen verdwijnen', fout: ['Verzuiling'] },
      { t: 'Emancipatie', d: 'het streven naar gelijke rechten, bijvoorbeeld van vrouwen', k: 'streven naar gelijkheid', fout: ['Democratisering'] },
      { t: 'Jongerencultuur', d: 'de eigen stijl, muziek en ideeën van jongeren', k: 'eigen stijl van jongeren', fout: ['Protestbeweging'] },
      { t: 'Protestbeweging', d: 'een groep die zich verzet tegen bestaande regels', k: 'groep die zich verzet', fout: ['Jongerencultuur'] },
      { t: 'Welvaart', d: 'de mate waarin mensen in hun behoeften kunnen voorzien', k: 'hoe goed men rondkomt', fout: ['Consumptiemaatschappij'] },
      { t: 'Consumptiemaatschappij', d: 'een samenleving waarin veel wordt gekocht en gebruikt', k: 'veel kopen', fout: ['Welvaart'] },
      { t: 'Individualisering', d: 'het belangrijker worden van het individu', k: 'het individu voorop', fout: ['Democratisering'] },
      { t: 'Secularisatie', d: 'het minder belangrijk worden van religie', k: 'religie wordt minder', fout: ['Ontzuiling'] },
      { t: 'Democratisering', d: 'het krijgen van meer inspraak en zeggenschap', k: 'meer inspraak', fout: ['Emancipatie'] },
      { t: 'Massamedia', d: 'media die veel mensen tegelijk bereiken, zoals tv en radio', k: 'bereiken velen tegelijk', fout: ['Jongerencultuur'] },
      { t: 'Generatiekloof', d: 'het verschil in opvattingen tussen jong en oud', k: 'kloof jong en oud', fout: ['Jongerencultuur'] },
    ]),

  V('F', 'Kolonisatie en dekolonisatie',
    `Nederland bestuurde <strong>koloniën</strong> zoals <strong>Nederlands-Indië</strong> en <strong>Suriname</strong>. Na 1945 leidde het <strong>nationalisme</strong> tot <strong>dekolonisatie</strong>: koloniën werden <strong>onafhankelijk</strong>.`,
    [
      { h: '1. Koloniën', p: [
        `Een <strong>kolonie</strong> is een gebied dat door een ander land wordt bestuurd; het in bezit nemen ervan heet <strong>kolonisatie</strong>. Nederland verdiende in zijn koloniën aan grondstoffen en <strong>plantages</strong>, vaak door <strong>uitbuiting</strong> van de bevolking. In het verleden hoorde daar ook <strong>slavernij</strong> bij.`] },
      { h: '2. Onafhankelijkheid', p: [
        `Na de Tweede Wereldoorlog groeide het <strong>nationalisme</strong>: het streven naar een eigen natie. Dat leidde tot <strong>dekolonisatie</strong>. <strong>Nederlands-Indië</strong> werd na de <strong>politionele acties</strong> onafhankelijk als Indonesië; <strong>Suriname</strong> werd zelfstandig in 1975. Veel mensen kwamen daarna via <strong>migratie</strong> naar Nederland.`] },
    ],
    [
      { t: 'Kolonie', d: 'een gebied dat door een ander land wordt bestuurd', k: 'bestuurd gebied', fout: ['Plantage'] },
      { t: 'Kolonisatie', d: 'het in bezit nemen en besturen van een ander gebied', k: 'gebied in bezit nemen', fout: ['Dekolonisatie'] },
      { t: 'Dekolonisatie', d: 'het onafhankelijk worden van koloniën', k: 'koloniën worden vrij', fout: ['Kolonisatie'] },
      { t: 'Nederlands-Indië', d: 'de vroegere Nederlandse kolonie, nu Indonesië', k: 'kolonie, nu Indonesië', fout: ['Suriname'] },
      { t: 'Onafhankelijkheid', d: 'het zelfstandig worden van een land', k: 'zelfstandig worden', fout: ['Nationalisme'] },
      { t: 'Nationalisme', d: 'het streven naar een eigen zelfstandige natie', k: 'streven naar eigen natie', fout: ['Onafhankelijkheid'] },
      { t: 'Uitbuiting', d: 'het misbruiken van mensen of gebieden voor winst', k: 'misbruik voor winst', fout: ['Plantage'] },
      { t: 'Plantage', d: 'een groot landbouwbedrijf in een kolonie', k: 'landbouwbedrijf in kolonie', fout: ['Kolonie'] },
      { t: 'Politionele acties', d: 'de militaire acties van Nederland in Indië na 1945', k: 'militaire acties in Indië', fout: ['Dekolonisatie'] },
      { t: 'Suriname', d: 'een vroegere Nederlandse kolonie, sinds 1975 onafhankelijk', k: 'kolonie, vrij in 1975', fout: ['Nederlands-Indië'] },
      { t: 'Migratie', d: 'het verhuizen van mensen, zoals van Suriname naar Nederland', k: 'mensen verhuizen', fout: ['Uitbuiting'] },
      { t: 'Slavernij', d: 'het bezit en dwingen van mensen tot onbetaalde arbeid', k: 'mensen als bezit', fout: ['Uitbuiting'] },
    ]),

  V('G', 'Historisch overzicht vanaf 1900',
    `De twintigste eeuw kende twee wereldoorlogen. Na de <strong>beurskrach van 1929</strong> kwamen <strong>fascisme</strong> en <strong>nazisme</strong> op. Daarna verdeelde de <strong>Koude Oorlog</strong> de wereld tot de <strong>Val van de Muur</strong> in 1989.`,
    [
      { h: '1. De wereldoorlogen', p: [
        `De <strong>Eerste Wereldoorlog</strong> (1914-1918) werd gevolgd door het <strong>interbellum</strong>, de tijd tussen de oorlogen. In de <strong>Tweede Wereldoorlog</strong> (1939-1945) kende Nederland een <strong>bezetting</strong> door Duitsland. In die oorlog vond de <strong>Holocaust</strong> plaats: de systematische moord op zes miljoen Joden.`] },
      { h: '2. Crisis en dictaturen', p: [
        `De <strong>beurskrach van 1929</strong> stortte de wereld in een economische <strong>crisis</strong> met massale werkloosheid. In die onrust kwamen extreem-rechtse stromingen op: het <strong>fascisme</strong> en, in Duitsland, het <strong>nazisme</strong> met racisme en Jodenhaat. Beide vestigden een <strong>dictatuur</strong>: alle macht bij één partij.`] },
      { h: '3. De Koude Oorlog', p: [
        `Na 1945 stonden de VS en de Sovjet-Unie tegenover elkaar in de <strong>Koude Oorlog</strong>. Het Westen vormde de <strong>NAVO</strong>, het communistische blok het <strong>Warschaupact</strong>. De spanning eindigde met de <strong>Val van de Muur</strong> in Berlijn in 1989.`] },
    ],
    [
      { t: 'Eerste Wereldoorlog', d: 'de oorlog van 1914 tot 1918 in vooral Europa', k: 'oorlog 1914-1918', fout: ['Tweede Wereldoorlog'] },
      { t: 'Interbellum', d: 'de periode tussen de twee wereldoorlogen', k: 'tussen de wereldoorlogen', fout: ['Koude Oorlog'] },
      { t: 'Beurskrach van 1929', d: 'de ineenstorting van de aandelenmarkt die tot een crisis leidde', k: 'instorting van de beurs', fout: ['Crisis'] },
      { t: 'Crisis', d: 'een tijd van massale werkloosheid en armoede', k: 'werkloosheid en armoede', fout: ['Beurskrach van 1929'] },
      { t: 'Fascisme', d: 'een extreem-rechtse stroming met een sterke leider en één partij', k: 'sterke leider, één partij', fout: ['Nazisme'] },
      { t: 'Nazisme', d: 'de Duitse vorm van fascisme met racisme en Jodenhaat', k: 'Duits fascisme met racisme', fout: ['Fascisme'] },
      { t: 'Dictatuur', d: 'een bestuur waarin één persoon of partij alle macht heeft', k: 'alle macht bij één', fout: ['Democratie'] },
      { t: 'Tweede Wereldoorlog', d: 'de oorlog van 1939 tot 1945', k: 'oorlog 1939-1945', fout: ['Eerste Wereldoorlog'] },
      { t: 'Bezetting', d: 'de periode waarin een vreemd leger een land beheerst', k: 'vreemd leger beheerst', fout: ['Dictatuur'] },
      { t: 'Holocaust', d: 'de systematische moord op zes miljoen Joden door de nazi\'s', k: 'moord op de Joden', fout: ['Bezetting'] },
      { t: 'Koude Oorlog', d: 'de spanning tussen de VS en de Sovjet-Unie na 1945', k: 'VS tegen Sovjet-Unie', fout: ['Interbellum'] },
      { t: 'NAVO', d: 'het militaire bondgenootschap van westerse landen', k: 'westers bondgenootschap', fout: ['Warschaupact'] },
      { t: 'Warschaupact', d: 'het militaire bondgenootschap van de communistische landen', k: 'communistisch bondgenootschap', fout: ['NAVO'] },
      { t: 'Val van de Muur', d: 'de val van de Berlijnse Muur in 1989', k: 'Berlijnse Muur valt, 1989', fout: ['Koude Oorlog'] },
    ]),

  V('H', 'Europa en de wereld',
    `Na 1945 kozen Europese landen voor <strong>samenwerking</strong> om <strong>vrede</strong> en welvaart te bevorderen, wat uitgroeide tot de <strong>Europese Unie</strong>. Door <strong>globalisering</strong> raken landen wereldwijd verweven.`,
    [
      { h: '1. Europese samenwerking', p: [
        `Om herhaling van oorlog te voorkomen, begonnen Europese landen na 1945 samen te werken. Die <strong>Europese samenwerking</strong> groeide uit tot de <strong>Europese Unie</strong>, met een gezamenlijke munt, de <strong>euro</strong>, en <strong>vrij verkeer</strong> van mensen en goederen. Afspraken tussen landen worden vastgelegd in een <strong>verdrag</strong>; het hoofddoel was en is <strong>vrede</strong>.`] },
      { h: '2. Globalisering', p: [
        `Door <strong>globalisering</strong> raken landen steeds meer met elkaar verweven via <strong>handel</strong> en <strong>multinationals</strong>. Mensen verplaatsen zich door <strong>migratie</strong>, soms als <strong>vluchteling</strong>. Rijke landen geven <strong>ontwikkelingshulp</strong> aan armere landen.`] },
    ],
    [
      { t: 'Europese Unie', d: 'een samenwerkingsverband van Europese landen', k: 'samenwerkende EU-landen', fout: ['Europese samenwerking'] },
      { t: 'Europese samenwerking', d: 'het samenwerken van landen in Europa na 1945', k: 'landen werken samen', fout: ['Europese Unie'] },
      { t: 'Euro', d: 'de gezamenlijke munt van veel EU-landen', k: 'munt van de eurozone', fout: ['Vrij verkeer'] },
      { t: 'Vrij verkeer', d: 'het vrij kunnen reizen, werken en handelen binnen de EU', k: 'vrij binnen de EU', fout: ['Europese Unie'] },
      { t: 'Globalisering', d: 'het steeds meer verweven raken van landen wereldwijd', k: 'landen raken verweven', fout: ['Handel'] },
      { t: 'Vluchteling', d: 'iemand die zijn land ontvlucht vanwege gevaar', k: 'ontvlucht gevaar', fout: ['Migratie'] },
      { t: 'Migratie', d: 'het verhuizen van mensen tussen landen', k: 'mensen verhuizen', fout: ['Vluchteling'] },
      { t: 'Verdrag', d: 'een officiële afspraak tussen landen', k: 'afspraak tussen landen', fout: ['Europese samenwerking'] },
      { t: 'Vrede', d: 'het ontbreken van oorlog, een doel van Europese samenwerking', k: 'geen oorlog', fout: ['Verdrag'] },
      { t: 'Handel', d: 'het kopen en verkopen tussen landen', k: 'kopen en verkopen', fout: ['Globalisering'] },
      { t: 'Multinational', d: 'een bedrijf dat in meerdere landen actief is', k: 'bedrijf in veel landen', fout: ['Globalisering'] },
      { t: 'Ontwikkelingshulp', d: 'steun aan armere landen om zich te ontwikkelen', k: 'steun aan arme landen', fout: ['Handel'] },
    ]),
];
