// VMBO GL/TL - Maatschappijkunde. Gouden-stijl contentspec.
const V = (domein, naam, intro, secties, concepten) => ({ niveau: 'vmbo', vak: 'ma', domein, naam, intro, secties, concepten });

export default [
  V('A', 'Politiek en beleid',
    `In de <strong>politiek</strong> worden beslissingen over de samenleving genomen. <strong>Politieke stromingen</strong> lopen van <strong>links</strong> (gelijkheid) tot <strong>rechts</strong> (vrijheid). De regerende partijen vormen een <strong>coalitie</strong>, de rest de <strong>oppositie</strong>.`,
    [
      { h: '1. Politieke stromingen', p: [
        `<strong>Politiek</strong> gaat over het nemen van beslissingen voor de samenleving. Partijen horen bij een <strong>politieke stroming</strong>. Grofweg legt <strong>links</strong> de nadruk op gelijkheid en een sturende overheid, en <strong>rechts</strong> op vrijheid en de markt. Belangrijke stromingen zijn het <strong>liberalisme</strong> (vrijheid van het individu), het <strong>socialisme</strong> (gelijkheid) en het <strong>confessioneel</strong>e denken (op basis van een geloof).`] },
      { h: '2. Van wetsvoorstel tot beleid', p: [
        `Een nieuwe wet begint als <strong>wetsvoorstel</strong> en wordt door het parlement behandeld. De partijen die samen regeren vormen een <strong>coalitie</strong> en leggen hun plannen vast in een <strong>regeerakkoord</strong>; de <strong>oppositie</strong> controleert hen. Bij <strong>verkiezingen</strong> kiezen burgers hun vertegenwoordigers.`] },
      { h: '3. Invloed uitoefenen', p: [
        `Burgers en organisaties kunnen invloed uitoefenen. Een <strong>belangengroep</strong> komt op voor een bepaald belang, bijvoorbeeld het milieu. Door te <strong>lobbyen</strong> proberen zij politici te overtuigen.`] },
    ],
    [
      { t: 'Politiek', d: 'het nemen van beslissingen over de samenleving', k: 'beslissen over de samenleving', fout: ['Politieke stroming'] },
      { t: 'Politieke stroming', d: 'een groep met gedeelde ideeën over de samenleving', k: 'groep met gedeelde ideeën', fout: ['Politiek'] },
      { t: 'Links', d: 'de politieke richting met nadruk op gelijkheid en de overheid', k: 'nadruk op gelijkheid', fout: ['Rechts'] },
      { t: 'Rechts', d: 'de politieke richting met nadruk op vrijheid en de markt', k: 'nadruk op vrijheid', fout: ['Links'] },
      { t: 'Liberalisme', d: 'een stroming die de vrijheid van het individu vooropstelt', k: 'vrijheid van het individu', fout: ['Socialisme', 'Confessioneel'] },
      { t: 'Socialisme', d: 'een stroming die opkomt voor gelijkheid en de arbeiders', k: 'gelijkheid voor arbeiders', fout: ['Liberalisme', 'Confessioneel'] },
      { t: 'Confessioneel', d: 'politiek die uitgaat van een geloof', k: 'politiek op basis van geloof', fout: ['Liberalisme', 'Socialisme'] },
      { t: 'Wetsvoorstel', d: 'een voorstel voor een nieuwe wet', k: 'voorstel voor een wet', fout: ['Regeerakkoord'] },
      { t: 'Coalitie', d: 'een samenwerking van partijen die samen regeren', k: 'samen regerende partijen', fout: ['Oppositie'] },
      { t: 'Oppositie', d: 'de partijen die niet meeregeren en de regering controleren', k: 'controleert de regering', fout: ['Coalitie'] },
      { t: 'Belangengroep', d: 'een groep die opkomt voor een bepaald belang', k: 'komt op voor een belang', fout: ['Lobbyen'] },
      { t: 'Lobbyen', d: 'het proberen te beïnvloeden van politici', k: 'politici beïnvloeden', fout: ['Belangengroep'] },
      { t: 'Verkiezingen', d: 'de manier waarop kiezers hun vertegenwoordigers kiezen', k: 'kiezen van vertegenwoordigers', fout: ['Coalitie'] },
      { t: 'Regeerakkoord', d: 'de afspraken van de partijen die samen gaan regeren', k: 'afspraken van de coalitie', fout: ['Wetsvoorstel'] },
    ]),

  V('B', 'Mens en werk',
    `Op de <strong>arbeidsmarkt</strong> ontmoeten vraag en aanbod van werk elkaar. <strong>Werkgevers</strong> en <strong>werknemers</strong> maken via <strong>vakbonden</strong> een <strong>cao</strong>. Wie geen werk heeft, kent <strong>werkloosheid</strong>.`,
    [
      { h: '1. De arbeidsmarkt', p: [
        `De <strong>arbeidsmarkt</strong> is het geheel van vraag naar en aanbod van werk. De hoeveelheid beschikbaar werk heet de <strong>werkgelegenheid</strong>; is er te weinig, dan ontstaat <strong>werkloosheid</strong>. Een <strong>werkgever</strong> neemt mensen aan, een <strong>werknemer</strong> werkt in loondienst.`] },
      { h: '2. Afspraken en zekerheid', p: [
        `Over het werk worden afspraken gemaakt. Een <strong>vakbond</strong> komt op voor werknemers en onderhandelt over een <strong>cao</strong>; het <strong>minimumloon</strong> is het wettelijk laagste loon. Soms leggen werknemers het werk neer: een <strong>staking</strong>. Wie zijn baan verliest, valt terug op de <strong>sociale zekerheid</strong> met een <strong>uitkering</strong> in plaats van <strong>inkomen</strong> uit werk.`] },
    ],
    [
      { t: 'Werkgelegenheid', d: 'de hoeveelheid beschikbaar werk', k: 'hoeveelheid werk', fout: ['Werkloosheid'] },
      { t: 'Werkloosheid', d: 'de situatie waarin mensen geen werk hebben', k: 'geen werk hebben', fout: ['Werkgelegenheid'] },
      { t: 'Werkgever', d: 'iemand of een bedrijf dat mensen in dienst neemt', k: 'neemt mensen aan', fout: ['Werknemer'] },
      { t: 'Werknemer', d: 'iemand die in loondienst werkt', k: 'werkt in loondienst', fout: ['Werkgever'] },
      { t: 'Vakbond', d: 'een organisatie die opkomt voor werknemers', k: 'komt op voor werknemers', fout: ['Cao'] },
      { t: 'Cao', d: 'afspraken over arbeidsvoorwaarden voor een hele bedrijfstak', k: 'afspraken over het werk', fout: ['Vakbond'] },
      { t: 'Inkomen', d: 'het geld dat je ontvangt, zoals loon', k: 'geld dat je ontvangt', fout: ['Uitkering'] },
      { t: 'Sociale zekerheid', d: 'het stelsel dat inkomen geeft bij tegenslag', k: 'inkomen bij tegenslag', fout: ['Uitkering'] },
      { t: 'Uitkering', d: 'geld van de overheid voor wie niet genoeg inkomen heeft', k: 'geld bij te weinig inkomen', fout: ['Inkomen'] },
      { t: 'Minimumloon', d: 'het wettelijk laagste loon dat betaald mag worden', k: 'laagste toegestane loon', fout: ['Inkomen'] },
      { t: 'Arbeidsmarkt', d: 'het geheel van vraag naar en aanbod van werk', k: 'vraag en aanbod van werk', fout: ['Werkgelegenheid'] },
      { t: 'Staking', d: 'het neerleggen van het werk om eisen kracht bij te zetten', k: 'het werk neerleggen', fout: ['Vakbond'] },
    ]),

  V('C', 'De multiculturele samenleving',
    `In een <strong>multiculturele samenleving</strong> leven mensen van veel <strong>culturen</strong> samen. <strong>Integratie</strong> is het meedoen van migranten; het tegenovergestelde is <strong>segregatie</strong>. <strong>Discriminatie</strong> en <strong>vooroordelen</strong> staan gelijke behandeling in de weg.`,
    [
      { h: '1. Cultuur en identiteit', p: [
        `In een <strong>multiculturele samenleving</strong> wonen mensen met verschillende achtergronden samen. Hun <strong>cultuur</strong> (taal, gewoonten, gebruiken) en hun <strong>identiteit</strong> (het gevoel ergens bij te horen) verschillen. De <strong>godsdienstvrijheid</strong> geeft iedereen het recht op een eigen geloof. Een <strong>migrant</strong> is iemand die naar een ander land verhuist.`] },
      { h: '2. Samenleven: kansen en spanningen', p: [
        `<strong>Integratie</strong> is het meedoen van nieuwkomers; blijven groepen juist gescheiden, dan is er <strong>segregatie</strong>. <strong>Discriminatie</strong> is het ongelijk behandelen van mensen om wie ze zijn, vaak gevoed door een <strong>vooroordeel</strong> of een <strong>stereotype</strong> (een vast beeld van een groep). <strong>Tolerantie</strong> en <strong>emancipatie</strong> helpen om gelijke kansen te bereiken.`] },
    ],
    [
      { t: 'Multiculturele samenleving', d: 'een samenleving met mensen van veel culturen', k: 'veel culturen samen', fout: ['Cultuur'] },
      { t: 'Cultuur', d: 'de gewoonten, taal en gebruiken van een groep', k: 'gewoonten en gebruiken', fout: ['Identiteit'] },
      { t: 'Identiteit', d: 'het gevoel bij een groep te horen', k: 'gevoel van erbij horen', fout: ['Cultuur'] },
      { t: 'Integratie', d: 'het opgaan van migranten in de samenleving', k: 'meedoen in de samenleving', fout: ['Segregatie'] },
      { t: 'Discriminatie', d: 'het ongelijk behandelen van mensen om wie ze zijn', k: 'ongelijk behandelen', fout: ['Vooroordeel'] },
      { t: 'Vooroordeel', d: 'een mening vooraf, zonder de feiten te kennen', k: 'oordeel zonder feiten', fout: ['Stereotype'] },
      { t: 'Stereotype', d: 'een vast, vaak overdreven beeld van een groep', k: 'vast beeld van een groep', fout: ['Vooroordeel'] },
      { t: 'Tolerantie', d: 'het verdragen van andere culturen en meningen', k: 'anderen verdragen', fout: ['Discriminatie'] },
      { t: 'Migrant', d: 'iemand die naar een ander land verhuist', k: 'verhuist naar ander land', fout: ['Integratie'] },
      { t: 'Segregatie', d: 'het gescheiden leven van bevolkingsgroepen', k: 'gescheiden leven', fout: ['Integratie'] },
      { t: 'Emancipatie', d: 'het streven naar gelijke rechten en kansen', k: 'streven naar gelijkheid', fout: ['Integratie'] },
      { t: 'Godsdienstvrijheid', d: 'het recht om je eigen geloof te kiezen', k: 'vrij je geloof kiezen', fout: ['Tolerantie'] },
    ]),

  V('D', 'Criminaliteit en rechtsstaat',
    `In een <strong>rechtsstaat</strong> gelden voor iedereen dezelfde regels en rechten. <strong>Criminaliteit</strong> bestaat uit <strong>misdrijven</strong> en <strong>overtredingen</strong>. In een <strong>strafproces</strong> beslist de <strong>rechter</strong> over schuld en straf.`,
    [
      { h: '1. Criminaliteit in de rechtsstaat', p: [
        `Een <strong>rechtsstaat</strong> is een staat waarin iedereen zich aan de wet houdt en rechten heeft. <strong>Criminaliteit</strong> is gedrag dat verboden is. Een <strong>misdrijf</strong> is ernstig (diefstal, geweld), een <strong>overtreding</strong> licht (te hard rijden). De overheid probeert criminaliteit te voorkomen met <strong>preventie</strong> en wil <strong>recidive</strong> (opnieuw de fout in gaan) tegengaan.`] },
      { h: '2. Het strafproces', p: [
        `Wordt iemand verdacht, dan volgt een <strong>strafproces</strong>. De <strong>officier van justitie</strong> klaagt aan namens de staat, de <strong>advocaat</strong> verdedigt de <strong>verdachte</strong> en de <strong>rechter</strong> velt het oordeel op basis van <strong>bewijs</strong>. Daarbij geldt de <strong>onschuldpresumptie</strong>: je bent onschuldig tot het tegendeel bewezen is. Een mogelijke straf is een <strong>taakstraf</strong>.`] },
    ],
    [
      { t: 'Criminaliteit', d: 'gedrag dat bij de wet verboden is', k: 'verboden gedrag', fout: ['Misdrijf'] },
      { t: 'Rechtsstaat', d: 'een staat waarin iedereen zich aan de wet houdt en rechten heeft', k: 'wet geldt voor iedereen', fout: ['Democratie'] },
      { t: 'Misdrijf', d: 'een ernstig strafbaar feit, zoals diefstal of geweld', k: 'ernstig strafbaar feit', fout: ['Overtreding'] },
      { t: 'Overtreding', d: 'een licht strafbaar feit, zoals te hard rijden', k: 'licht strafbaar feit', fout: ['Misdrijf'] },
      { t: 'Verdachte', d: 'iemand die van een strafbaar feit wordt beschuldigd', k: 'wordt beschuldigd', fout: ['Advocaat'] },
      { t: 'Officier van justitie', d: 'de aanklager namens de staat', k: 'de aanklager', fout: ['Rechter', 'Advocaat'] },
      { t: 'Rechter', d: 'degene die een oordeel velt en de straf bepaalt', k: 'velt het oordeel', fout: ['Officier van justitie', 'Advocaat'] },
      { t: 'Advocaat', d: 'iemand die een verdachte verdedigt', k: 'verdedigt de verdachte', fout: ['Officier van justitie', 'Rechter'] },
      { t: 'Strafproces', d: 'de rechtszaak waarin over schuld en straf wordt beslist', k: 'rechtszaak over schuld', fout: ['Bewijs'] },
      { t: 'Bewijs', d: 'gegevens die aantonen of iemand iets heeft gedaan', k: 'gegevens die iets aantonen', fout: ['Strafproces'] },
      { t: 'Preventie', d: 'het voorkomen van criminaliteit', k: 'criminaliteit voorkomen', fout: ['Recidive'] },
      { t: 'Recidive', d: 'het opnieuw plegen van een strafbaar feit', k: 'opnieuw de fout in', fout: ['Preventie'] },
      { t: 'Taakstraf', d: 'een straf waarbij je onbetaald werk moet doen', k: 'straf met onbetaald werk', fout: ['Preventie'] },
      { t: 'Onschuldpresumptie', d: 'je bent onschuldig tot het tegendeel bewezen is', k: 'onschuldig tot bewezen', fout: ['Bewijs'] },
    ]),

  V('E', 'Massamedia',
    `<strong>Massamedia</strong> bereiken veel mensen tegelijk en hebben een <strong>informerende</strong>, <strong>amuserende</strong> en <strong>opiniërende</strong> functie. Media bepalen mede de <strong>beeldvorming</strong>; <strong>persvrijheid</strong> beschermt het vrij publiceren.`,
    [
      { h: '1. Functies van de media', p: [
        `<strong>Massamedia</strong> zoals tv, kranten en nieuwssites bereiken veel mensen tegelijk. Ze hebben drie functies: de <strong>informerende functie</strong> (nieuws geven), de <strong>amuserende functie</strong> (vermaken) en de <strong>opiniërende functie</strong> (meningen geven). Op <strong>sociale media</strong> maken mensen bovendien zelf berichten.`] },
      { h: '2. Beeldvorming en vrijheid', p: [
        `Media bepalen mede de <strong>beeldvorming</strong>: het beeld dat je van iets krijgt. Door <strong>manipulatie</strong> of <strong>nepnieuws</strong> kan dat beeld bewust worden gestuurd, terwijl <strong>objectiviteit</strong> juist onbevooroordeeld weergeven betekent. <strong>Persvrijheid</strong> geeft media het recht vrij te publiceren; het tegenovergestelde is <strong>censuur</strong>. <strong>Reclame</strong> wil je tot kopen aanzetten.`] },
    ],
    [
      { t: 'Massamedia', d: 'media die veel mensen tegelijk bereiken', k: 'bereiken velen tegelijk', fout: ['Sociale media'] },
      { t: 'Informerende functie', d: 'het geven van nieuws en informatie', k: 'nieuws geven', fout: ['Amuserende functie', 'Opiniërende functie'] },
      { t: 'Amuserende functie', d: 'het vermaken van het publiek', k: 'het publiek vermaken', fout: ['Informerende functie', 'Opiniërende functie'] },
      { t: 'Opiniërende functie', d: 'het geven van meningen', k: 'meningen geven', fout: ['Informerende functie', 'Amuserende functie'] },
      { t: 'Beeldvorming', d: 'het beeld dat media van iets of iemand oproepen', k: 'het opgeroepen beeld', fout: ['Manipulatie'] },
      { t: 'Manipulatie', d: 'het bewust sturen van iemands mening', k: 'mening bewust sturen', fout: ['Beeldvorming'] },
      { t: 'Censuur', d: 'het tegenhouden of aanpassen van informatie', k: 'informatie tegenhouden', fout: ['Persvrijheid'] },
      { t: 'Persvrijheid', d: 'het recht van media om vrij te publiceren', k: 'vrij mogen publiceren', fout: ['Censuur'] },
      { t: 'Objectiviteit', d: 'het onbevooroordeeld weergeven van feiten', k: 'onbevooroordeeld weergeven', fout: ['Manipulatie'] },
      { t: 'Reclame', d: 'een boodschap om mensen tot kopen aan te zetten', k: 'zet aan tot kopen', fout: ['Nepnieuws'] },
      { t: 'Sociale media', d: 'online netwerken waarop mensen zelf berichten delen', k: 'netwerken om te delen', fout: ['Massamedia'] },
      { t: 'Nepnieuws', d: 'onjuiste berichten die als echt nieuws worden verspreid', k: 'nep als echt nieuws', fout: ['Manipulatie'] },
    ]),

  V('F', 'Technologie en samenleving',
    `<strong>Digitalisering</strong> verandert de samenleving. <strong>Sociale media</strong> en <strong>algoritmes</strong> bepalen wat je ziet. <strong>Privacy</strong> en <strong>persoonsgegevens</strong> komen onder druk, bijvoorbeeld door een <strong>datalek</strong> of <strong>cybercriminaliteit</strong>.`,
    [
      { h: '1. Digitalisering en privacy', p: [
        `<strong>Digitalisering</strong> betekent dat steeds meer via computers en internet gaat. Daarbij is <strong>privacy</strong> belangrijk: het recht om zelf te bepalen wat anderen over je weten. Bedrijven verwerken <strong>persoonsgegevens</strong>, maar mogen dat vaak alleen met jouw <strong>toestemming</strong>. Het <strong>auteursrecht</strong> beschermt het werk van makers.`] },
      { h: '2. Risico\'s online', p: [
        `Online zijn er ook risico's. Bij een <strong>datalek</strong> komen persoonsgegevens per ongeluk vrij; <strong>cybercriminaliteit</strong> is misdaad via internet. Een <strong>algoritme</strong> bepaalt wat je te zien krijgt, waardoor je in een <strong>filterbubbel</strong> terecht kunt komen: je ziet vooral wat bij je past. <strong>Anonimiteit</strong> maakt mensen soms brutaler, en niet iedereen kan even goed met techniek overweg: de <strong>digitale kloof</strong>.`] },
    ],
    [
      { t: 'Digitalisering', d: 'het steeds meer gebruiken van computers en internet', k: 'meer computers en internet', fout: ['Digitale kloof'] },
      { t: 'Privacy', d: 'het recht om zelf te bepalen wat anderen over je weten', k: 'controle over je gegevens', fout: ['Persoonsgegevens'] },
      { t: 'Sociale media', d: 'online netwerken om berichten te delen', k: 'netwerken om te delen', fout: ['Filterbubbel'] },
      { t: 'Persoonsgegevens', d: 'informatie die over een persoon gaat', k: 'informatie over een persoon', fout: ['Privacy'] },
      { t: 'Datalek', d: 'het per ongeluk vrijkomen van persoonsgegevens', k: 'gegevens komen vrij', fout: ['Cybercriminaliteit'] },
      { t: 'Algoritme', d: 'een set regels waarmee een computer keuzes maakt', k: 'rekenregels van een computer', fout: ['Filterbubbel'] },
      { t: 'Digitale kloof', d: 'het verschil tussen wie wel en niet met techniek overweg kan', k: 'kloof in digitale kennis', fout: ['Digitalisering'] },
      { t: 'Cybercriminaliteit', d: 'criminaliteit via computers en internet', k: 'misdaad via internet', fout: ['Datalek'] },
      { t: 'Anonimiteit', d: 'het onbekend blijven van je identiteit', k: 'onbekend blijven', fout: ['Privacy'] },
      { t: 'Filterbubbel', d: 'het alleen zien van informatie die bij je past', k: 'alleen wat bij je past', fout: ['Algoritme'] },
      { t: 'Auteursrecht', d: 'het recht van een maker op zijn eigen werk', k: 'recht van de maker', fout: ['Privacy'] },
      { t: 'Toestemming', d: 'het akkoord geven voor het gebruik van je gegevens', k: 'akkoord voor gebruik', fout: ['Privacy'] },
    ]),
];
