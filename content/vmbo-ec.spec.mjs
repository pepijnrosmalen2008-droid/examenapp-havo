// VMBO GL/TL - Economie. Gouden-stijl contentspec.
const V = (domein, naam, intro, secties, concepten) => ({ niveau: 'vmbo', vak: 'ec', domein, naam, intro, secties, concepten });

export default [
  V('A', 'Consumptie',
    `<strong>Koopkracht</strong> is hoeveel je met je inkomen kunt kopen. Door <strong>inflatie</strong> daalt je koopkracht als je loon niet meestijgt. Met een <strong>indexcijfer</strong> reken je veranderingen uit, en met een <strong>verzekering</strong> bescherm je je tegen financiële risico's.`,
    [
      { h: '1. Inkomen, uitgaven en koopkracht', p: [
        `Je <strong>inkomen</strong> is het geld dat je ontvangt, je <strong>uitgaven</strong> is het geld dat je besteedt. Wat je niet uitgeeft, kun je <strong>sparen</strong>. Met een <strong>budget</strong> (een overzicht van inkomsten en uitgaven) hou je overzicht; <strong>budgetteren</strong> is je uitgaven vooraf plannen.`,
        `Je <strong>koopkracht</strong> zegt hoeveel je met dat inkomen daadwerkelijk kunt kopen.`] },
      { h: '2. Inflatie en je koopkracht', p: [
        `<strong>Inflatie</strong> is een algemene stijging van de prijzen, <strong>deflatie</strong> een daling. Een <strong>indexcijfer</strong> laat een verandering zien ten opzichte van een basisjaar (dat op 100 staat).`,
        `Je <strong>nominaal inkomen</strong> is je inkomen in euro's; je <strong>reëel inkomen</strong> is dat inkomen gecorrigeerd voor inflatie. Stijgen de prijzen harder dan je loon, dan daalt je koopkracht.`],
        worked: { q: 'De prijzen stijgen met 4% (indexcijfer 104). Je loon stijgt met 2%. Wat gebeurt er met je koopkracht?', steps: ['Vergelijk de stijging van de prijzen met die van je loon.', 'De prijzen stijgen harder (4%) dan je loon (2%).'], ans: 'Je koopkracht daalt: je kunt minder kopen dan eerst.' } },
      { h: '3. Je beschermen met een verzekering', p: [
        `Een <strong>verzekering</strong> beschermt je tegen grote, onverwachte kosten. Je betaalt daarvoor periodiek een <strong>premie</strong>. Bij schade betaal je vaak eerst zelf een deel, het <strong>eigen risico</strong>; de rest vergoedt de verzekeraar.`] },
    ],
    [
      { t: 'Koopkracht', d: 'hoeveel je met je inkomen kunt kopen', k: 'wat je inkomen kan kopen', fout: ['Reëel inkomen', 'Inkomen'] },
      { t: 'Inkomen', d: 'het geld dat je ontvangt, bijvoorbeeld loon', k: 'geld dat je ontvangt', fout: ['Uitgaven', 'Koopkracht'] },
      { t: 'Uitgaven', d: 'het geld dat je besteedt', k: 'geld dat je besteedt', fout: ['Inkomen', 'Sparen'] },
      { t: 'Sparen', d: 'geld dat je niet uitgeeft maar bewaart', k: 'geld bewaren', fout: ['Uitgaven'] },
      { t: 'Budget', d: 'een overzicht van verwachte inkomsten en uitgaven', k: 'overzicht inkomsten en uitgaven', fout: ['Budgetteren'] },
      { t: 'Budgetteren', d: 'je uitgaven plannen binnen je inkomen', k: 'uitgaven plannen', fout: ['Budget'] },
      { t: 'Inflatie', d: 'een algemene stijging van de prijzen', k: 'prijzen stijgen', fout: ['Deflatie'] },
      { t: 'Deflatie', d: 'een algemene daling van de prijzen', k: 'prijzen dalen', fout: ['Inflatie'] },
      { t: 'Indexcijfer', d: 'een getal dat een verandering ten opzichte van een basisjaar weergeeft', k: 'verandering t.o.v. basisjaar', fout: ['Inflatie'] },
      { t: 'Reëel inkomen', d: 'je inkomen gecorrigeerd voor inflatie', k: 'inkomen na inflatie', fout: ['Nominaal inkomen', 'Koopkracht'] },
      { t: 'Nominaal inkomen', d: 'je inkomen in euro\'s zonder correctie voor inflatie', k: 'inkomen in euro\'s', fout: ['Reëel inkomen'] },
      { t: 'Verzekering', d: 'een afspraak waarbij je premie betaalt tegen financiële risico\'s', k: 'bescherming tegen risico', fout: ['Premie'] },
      { t: 'Premie', d: 'het bedrag dat je periodiek voor een verzekering betaalt', k: 'bedrag voor verzekering', fout: ['Eigen risico'] },
      { t: 'Eigen risico', d: 'het deel van de schade dat je zelf betaalt', k: 'schade die je zelf betaalt', fout: ['Premie'] },
    ]),

  V('B', 'Consumentenrechten',
    `Als koper heb je <strong>consumentenrechten</strong>, zoals <strong>garantie</strong> en bij online kopen een <strong>bedenktijd</strong>. Een <strong>consumentenorganisatie</strong> test producten en helpt bij een <strong>klacht</strong>.`,
    [
      { h: '1. Je rechten als koper', p: [
        `Bij een aankoop sluit je een <strong>koopovereenkomst</strong>, waarbij <strong>algemene voorwaarden</strong> horen. <strong>Garantie</strong> geeft je recht op herstel of vervanging bij een gebrek. Koop je op afstand (online), dan heb je <strong>bedenktijd</strong> en een <strong>retourrecht</strong> om de aankoop terug te sturen.`] },
      { h: '2. Hulp en keurmerken', p: [
        `Een <strong>consumentenorganisatie</strong> zoals de <strong>Consumentenbond</strong> test producten en geeft advies. Ben je ontevreden, dan dien je een <strong>klacht</strong> in bij de verkoper. Een <strong>keurmerk</strong> laat vooraf zien dat een product aan bepaalde eisen voldoet.`] },
    ],
    [
      { t: 'Consumentenrecht', d: 'de rechten die een koper heeft', k: 'rechten van de koper', fout: ['Garantie', 'Algemene voorwaarden'] },
      { t: 'Garantie', d: 'het recht op herstel of vervanging bij een gebrek', k: 'herstel bij een gebrek', fout: ['Retourrecht', 'Bedenktijd'] },
      { t: 'Retourrecht', d: 'het recht om een aankoop terug te sturen', k: 'aankoop terugsturen', fout: ['Bedenktijd', 'Garantie'] },
      { t: 'Bedenktijd', d: 'de periode waarin je een aankoop mag annuleren', k: 'periode om te annuleren', fout: ['Retourrecht'] },
      { t: 'Consumentenorganisatie', d: 'een organisatie die opkomt voor kopers', k: 'komt op voor kopers', fout: ['Consumentenbond', 'Vakbond'] },
      { t: 'Consumentenbond', d: 'een organisatie die producten test en consumenten adviseert', k: 'test en adviseert', fout: ['Consumentenorganisatie'] },
      { t: 'Klacht', d: 'een melding dat een product of dienst niet voldoet', k: 'melding dat iets niet voldoet', fout: ['Garantie'] },
      { t: 'Keurmerk', d: 'een teken dat een product aan bepaalde eisen voldoet', k: 'teken van kwaliteit', fout: ['Garantie'] },
      { t: 'Algemene voorwaarden', d: 'de regels die bij een koopovereenkomst horen', k: 'de kleine lettertjes', fout: ['Koopovereenkomst', 'Consumentenrecht'] },
      { t: 'Koopovereenkomst', d: 'de afspraak tussen een koper en een verkoper', k: 'afspraak koper-verkoper', fout: ['Algemene voorwaarden'] },
      { t: 'Aankoop op afstand', d: 'een aankoop via internet, telefoon of post', k: 'kopen zonder winkel', fout: ['Bedenktijd'] },
      { t: 'Consument', d: 'iemand die producten of diensten koopt en gebruikt', k: 'de koper en gebruiker', fout: ['Producent'] },
    ]),

  V('C', 'Arbeid en productie',
    `Van je <strong>brutoloon</strong> gaan belasting en premies af; wat overblijft is je <strong>nettoloon</strong>. Door <strong>arbeidsverdeling</strong> en <strong>specialisatie</strong> stijgt de <strong>arbeidsproductiviteit</strong>.`,
    [
      { h: '1. Van brutoloon naar nettoloon', p: [
        `Je <strong>brutoloon</strong> is je loon vóór aftrek. Daar gaat de <strong>loonheffing</strong> (belasting en premies) vanaf. Wat je op je rekening krijgt, is je <strong>nettoloon</strong>.`],
        worked: { q: 'Je brutoloon is € 2.000 en de loonheffing is € 550. Hoeveel is je nettoloon?', steps: ['Nettoloon = brutoloon − loonheffing.', 'Nettoloon = 2.000 − 550.'], ans: 'Je nettoloon is € 1.450.' } },
      { h: '2. Productiever werken', p: [
        `Door <strong>arbeidsverdeling</strong> splits je het werk in aparte taken, en door <strong>specialisatie</strong> legt iemand zich toe op één taak. Daardoor stijgt de <strong>arbeidsproductiviteit</strong>: de productie per werknemer.`] },
      { h: '3. Werkgevers, werknemers en afspraken', p: [
        `Een <strong>werkgever</strong> neemt mensen in dienst, een <strong>werknemer</strong> werkt in loondienst. In een <strong>cao</strong> staan de arbeidsvoorwaarden voor een hele bedrijfstak, mede bepaald door <strong>vakbonden</strong>. Het <strong>minimumloon</strong> is het wettelijk laagste loon.`] },
    ],
    [
      { t: 'Brutoloon', d: 'je loon vóór aftrek van belasting en premies', k: 'loon vóór aftrek', fout: ['Nettoloon'] },
      { t: 'Nettoloon', d: 'je loon na aftrek van belasting en premies', k: 'loon na aftrek', fout: ['Brutoloon'] },
      { t: 'Loonheffing', d: 'de belasting en premies die van je loon worden ingehouden', k: 'inhoudingen op je loon', fout: ['Brutoloon'] },
      { t: 'Arbeidsverdeling', d: 'het opsplitsen van werk in aparte taken', k: 'werk in taken opdelen', fout: ['Specialisatie'] },
      { t: 'Specialisatie', d: 'je toeleggen op één taak of vak', k: 'je op één taak richten', fout: ['Arbeidsverdeling'] },
      { t: 'Arbeidsproductiviteit', d: 'de productie per werknemer per tijd', k: 'productie per werknemer', fout: ['Arbeidsverdeling'] },
      { t: 'Werknemer', d: 'iemand die in loondienst werkt', k: 'werkt in loondienst', fout: ['Werkgever'] },
      { t: 'Werkgever', d: 'iemand of een bedrijf dat mensen in dienst neemt', k: 'neemt mensen aan', fout: ['Werknemer'] },
      { t: 'Cao', d: 'afspraken over arbeidsvoorwaarden voor een hele bedrijfstak', k: 'afspraken over het werk', fout: ['Minimumloon', 'Vakbond'] },
      { t: 'Minimumloon', d: 'het wettelijk laagste loon dat betaald mag worden', k: 'laagste toegestane loon', fout: ['Cao'] },
      { t: 'Vakbond', d: 'een organisatie die opkomt voor werknemers', k: 'komt op voor werknemers', fout: ['Werkgever', 'Consumentenorganisatie'] },
      { t: 'Productiefactor', d: 'een middel om mee te produceren, zoals arbeid of kapitaal', k: 'middel om te produceren', fout: ['Arbeidsproductiviteit'] },
    ]),

  V('D', 'Arbeid en bedrijf',
    `De <strong>omzet</strong> is prijs maal aantal. Trek je de <strong>kosten</strong> ervan af, dan houd je <strong>winst</strong> over. Over de verkoopprijs betaal je <strong>btw</strong> aan de overheid.`,
    [
      { h: '1. Omzet, kosten en winst', p: [
        `De <strong>omzet</strong> is de totale verkoopopbrengst: prijs maal aantal. De <strong>kosten</strong> is alles wat je uitgeeft om te produceren. De <strong>winst</strong> is wat overblijft als je de kosten van de omzet aftrekt.`],
        worked: { q: 'Een bedrijf heeft een omzet van € 5.000 en kosten van € 3.500. Hoeveel winst maakt het?', steps: ['Winst = omzet − kosten.', 'Winst = 5.000 − 3.500.'], ans: 'De winst is € 1.500.' } },
      { h: '2. Constante en variabele kosten', p: [
        `<strong>Constante kosten</strong> (zoals huur) veranderen niet met de productie; <strong>variabele kosten</strong> (zoals grondstoffen) bewegen wél mee. Samen vormen ze de <strong>totale kosten</strong>. Bij het <strong>break-even</strong>punt is de omzet precies gelijk aan de kosten: geen winst, geen verlies.`] },
      { h: '3. Prijzen en btw', p: [
        `Het verschil tussen <strong>verkoopprijs</strong> en <strong>inkoopprijs</strong> is de <strong>winstmarge</strong>. Over de verkoopprijs reken je <strong>btw</strong>, die je afdraagt aan de overheid.`] },
    ],
    [
      { t: 'Omzet', d: 'de totale verkoopopbrengst: prijs maal aantal', k: 'prijs maal aantal', fout: ['Winst', 'Brutowinst'] },
      { t: 'Verkoopprijs', d: 'de prijs waarvoor je een product verkoopt', k: 'prijs bij verkoop', fout: ['Inkoopprijs'] },
      { t: 'Inkoopprijs', d: 'de prijs die je voor een product betaalt', k: 'prijs bij inkoop', fout: ['Verkoopprijs'] },
      { t: 'Btw', d: 'belasting die je over de verkoopprijs betaalt', k: 'belasting op de prijs', fout: ['Accijns', 'Winst'] },
      { t: 'Winst', d: 'het bedrag dat overblijft na aftrek van de kosten', k: 'opbrengst min kosten', fout: ['Omzet', 'Brutowinst'] },
      { t: 'Kosten', d: 'alles wat je uitgeeft om te produceren', k: 'uitgaven om te produceren', fout: ['Omzet'] },
      { t: 'Constante kosten', d: 'kosten die niet veranderen met de productie', k: 'blijven gelijk', fout: ['Variabele kosten'] },
      { t: 'Variabele kosten', d: 'kosten die meebewegen met de productie', k: 'bewegen mee', fout: ['Constante kosten'] },
      { t: 'Totale kosten', d: 'de constante kosten plus de variabele kosten', k: 'constant plus variabel', fout: ['Constante kosten', 'Variabele kosten'] },
      { t: 'Brutowinst', d: 'de omzet min de inkoopwaarde van de verkochte producten', k: 'omzet min inkoopwaarde', fout: ['Winst', 'Winstmarge'] },
      { t: 'Winstmarge', d: 'het verschil tussen verkoopprijs en inkoopprijs', k: 'verkoop min inkoop', fout: ['Brutowinst'] },
      { t: 'Break-even', d: 'het punt waarop de omzet precies gelijk is aan de kosten', k: 'omzet is gelijk aan kosten', fout: ['Winst'] },
    ]),

  V('E', 'Overheid en bestuur',
    `De <strong>overheid</strong> heft <strong>belasting</strong> om <strong>collectieve voorzieningen</strong> zoals wegen en onderwijs te betalen. <strong>Directe belasting</strong> gaat over inkomen, <strong>indirecte belasting</strong> zit in de prijs.`,
    [
      { h: '1. Waarom belasting?', p: [
        `De overheid betaalt <strong>collectieve voorzieningen</strong> die er voor iedereen zijn, zoals <strong>infrastructuur</strong>, onderwijs en veiligheid. Dat geld komt binnen via <strong>belasting</strong>: een verplichte betaling aan de staat. Zulke taken heten <strong>overheidstaken</strong>.`] },
      { h: '2. Directe en indirecte belasting', p: [
        `Een <strong>directe belasting</strong> gaat over je inkomen of winst, zoals de <strong>inkomstenbelasting</strong>. Een <strong>indirecte belasting</strong> zit verwerkt in de prijs van producten, zoals de <strong>btw</strong>. Op sommige producten zit extra belasting, de <strong>accijns</strong>.`] },
      { h: '3. De begroting', p: [
        `In de <strong>begroting</strong> zet de overheid de verwachte inkomsten en uitgaven op een rij. Geeft de overheid meer uit dan er binnenkomt, dan groeit de <strong>staatsschuld</strong>. Met een <strong>subsidie</strong> stimuleert de overheid iets; met een <strong>uitkering</strong> helpt ze wie te weinig inkomen heeft.`] },
    ],
    [
      { t: 'Belasting', d: 'een verplichte betaling aan de overheid', k: 'verplichte betaling aan de staat', fout: ['Accijns', 'Premie'] },
      { t: 'Directe belasting', d: 'belasting op inkomen of winst', k: 'belasting op inkomen', fout: ['Indirecte belasting'] },
      { t: 'Indirecte belasting', d: 'belasting die in de prijs van producten zit', k: 'belasting in de prijs', fout: ['Directe belasting'] },
      { t: 'Inkomstenbelasting', d: 'belasting die je over je inkomen betaalt', k: 'belasting over inkomen', fout: ['Directe belasting'] },
      { t: 'Accijns', d: 'extra belasting op producten zoals alcohol en benzine', k: 'extra belasting op producten', fout: ['Belasting', 'Btw'] },
      { t: 'Collectieve voorziening', d: 'iets dat de overheid voor iedereen regelt, zoals wegen', k: 'voor iedereen geregeld', fout: ['Subsidie'] },
      { t: 'Subsidie', d: 'een bijdrage van de overheid om iets te stimuleren', k: 'geld om te stimuleren', fout: ['Uitkering'] },
      { t: 'Uitkering', d: 'geld van de overheid voor wie niet genoeg inkomen heeft', k: 'geld bij te weinig inkomen', fout: ['Subsidie'] },
      { t: 'Begroting', d: 'het overzicht van verwachte inkomsten en uitgaven van de overheid', k: 'plan van inkomsten en uitgaven', fout: ['Staatsschuld'] },
      { t: 'Staatsschuld', d: 'het totale bedrag dat de overheid heeft geleend', k: 'wat de staat heeft geleend', fout: ['Begroting'] },
      { t: 'Infrastructuur', d: 'voorzieningen zoals wegen, bruggen en spoor', k: 'wegen en verbindingen', fout: ['Collectieve voorziening'] },
      { t: 'Overheidstaak', d: 'een taak die de overheid voor de samenleving uitvoert', k: 'taak van de overheid', fout: ['Collectieve voorziening'] },
    ]),

  V('F', 'Internationale ontwikkelingen',
    `Landen handelen met elkaar: <strong>import</strong> is invoer, <strong>export</strong> is uitvoer. Voor handel met andere munten geldt een <strong>wisselkoers</strong>. Binnen de <strong>Europese Unie</strong> is er vrije handel.`,
    [
      { h: '1. Import en export', p: [
        `<strong>Import</strong> is het invoeren van goederen uit het buitenland, <strong>export</strong> het uitvoeren ervan. Het verschil tussen export en import heet de <strong>handelsbalans</strong>.`] },
      { h: '2. Geld over de grens', p: [
        `Handel je met een land met een andere munt, dan speelt de <strong>wisselkoers</strong>: de prijs van de ene munt in de andere. Veel EU-landen gebruiken dezelfde munt, de <strong>euro</strong>, zodat wisselen niet meer nodig is. Soms heft een land <strong>invoerrechten</strong> op buitenlandse goederen.`] },
      { h: '3. Samenwerking en globalisering', p: [
        `De <strong>Europese Unie</strong> vormt één <strong>interne markt</strong> met vrije handel. Landen kiezen tussen <strong>vrijhandel</strong> (geen drempels) en <strong>protectionisme</strong> (eigen markt beschermen). Door <strong>globalisering</strong> raken landen wereldwijd verweven; met <strong>ontwikkelingssamenwerking</strong> worden armere landen geholpen.`] },
    ],
    [
      { t: 'Import', d: 'het invoeren van goederen uit het buitenland', k: 'invoer uit buitenland', fout: ['Export'] },
      { t: 'Export', d: 'het uitvoeren van goederen naar het buitenland', k: 'uitvoer naar buitenland', fout: ['Import'] },
      { t: 'Handelsbalans', d: 'het verschil tussen de export en de import', k: 'export min import', fout: ['Wisselkoers'] },
      { t: 'Wisselkoers', d: 'de prijs van de ene munt uitgedrukt in de andere', k: 'prijs van een munt', fout: ['Euro'] },
      { t: 'Euro', d: 'de gezamenlijke munt van veel EU-landen', k: 'de munt van de eurozone', fout: ['Wisselkoers'] },
      { t: 'Europese Unie', d: 'een samenwerkingsverband van Europese landen', k: 'samenwerkende EU-landen', fout: ['Interne markt'] },
      { t: 'Interne markt', d: 'de vrije handel binnen de EU zonder grenzen', k: 'vrije handel in de EU', fout: ['Vrijhandel', 'Europese Unie'] },
      { t: 'Invoerrechten', d: 'belasting op goederen die worden ingevoerd', k: 'belasting op invoer', fout: ['Protectionisme'] },
      { t: 'Ontwikkelingssamenwerking', d: 'hulp aan armere landen om zich te ontwikkelen', k: 'hulp aan arme landen', fout: ['Globalisering'] },
      { t: 'Vrijhandel', d: 'handel zonder belemmeringen tussen landen', k: 'handel zonder drempels', fout: ['Protectionisme'] },
      { t: 'Protectionisme', d: 'eigen bedrijven beschermen tegen buitenlandse concurrentie', k: 'eigen markt beschermen', fout: ['Vrijhandel'] },
      { t: 'Globalisering', d: 'het steeds meer verweven raken van landen wereldwijd', k: 'landen raken verweven', fout: ['Ontwikkelingssamenwerking'] },
    ]),

  V('G', 'Natuur en milieu',
    `Produceren kost niet alleen geld maar ook <strong>milieukosten</strong>. Bij <strong>externe kosten</strong> draait de samenleving op voor de schade. <strong>Duurzaam produceren</strong> en een <strong>circulaire economie</strong> beperken de <strong>uitputting</strong> van grondstoffen.`,
    [
      { h: '1. De kosten van vervuiling', p: [
        `Vervuiling brengt <strong>milieukosten</strong> met zich mee. Vaak zijn dat <strong>externe kosten</strong>: niet de vervuiler maar de samenleving betaalt. Met het <strong>vervuiler-betaalt-principe</strong> legt de overheid die kosten juist bij de veroorzaker.`] },
      { h: '2. Duurzaam en circulair', p: [
        `<strong>Duurzaam produceren</strong> houdt rekening met mens en milieu. In een <strong>circulaire economie</strong> worden grondstoffen steeds hergebruikt via <strong>recycling</strong>, zodat de <strong>uitputting</strong> van grondstoffen afneemt. Dat past bij <strong>duurzame ontwikkeling</strong>: groei die de toekomst niet schaadt.`] },
    ],
    [
      { t: 'Milieukosten', d: 'de kosten van schade aan het milieu', k: 'kosten van milieuschade', fout: ['Externe kosten'] },
      { t: 'Externe kosten', d: 'kosten die niet de veroorzaker maar de samenleving draagt', k: 'samenleving betaalt de schade', fout: ['Milieukosten'] },
      { t: 'Vervuiler-betaalt-principe', d: 'wie vervuilt, betaalt zelf de kosten daarvan', k: 'vervuiler betaalt', fout: ['Externe kosten'] },
      { t: 'Duurzaam produceren', d: 'produceren met zorg voor mens en milieu', k: 'produceren met zorg', fout: ['Circulaire economie'] },
      { t: 'Circulaire economie', d: 'een economie waarin grondstoffen worden hergebruikt', k: 'grondstoffen hergebruiken', fout: ['Recycling', 'Duurzaam produceren'] },
      { t: 'Recycling', d: 'afval verwerken tot nieuwe grondstoffen', k: 'afval hergebruiken', fout: ['Circulaire economie'] },
      { t: 'Grondstof', d: 'een natuurlijke stof waarvan je iets maakt', k: 'basismateriaal', fout: ['Fossiele brandstof'] },
      { t: 'Uitputting', d: 'het opraken van grondstoffen', k: 'grondstoffen raken op', fout: ['Duurzame ontwikkeling'] },
      { t: 'Duurzame ontwikkeling', d: 'ontwikkeling die de toekomst niet schaadt', k: 'toekomstbestendige groei', fout: ['Uitputting'] },
      { t: 'Fossiele brandstof', d: 'brandstof uit resten van organismen, zoals olie en gas', k: 'olie, gas en kolen', fout: ['Groene energie'] },
      { t: 'Groene energie', d: 'energie uit bronnen die niet opraken', k: 'energie die niet opraakt', fout: ['Fossiele brandstof'] },
      { t: 'Consuminderen', d: 'bewust minder kopen en gebruiken', k: 'bewust minder gebruiken', fout: ['Duurzaam produceren'] },
    ]),

  V('H', 'Geld- en bankwezen',
    `Wie geld leent of uitleent, betaalt of ontvangt <strong>rente</strong>. Bij <strong>samengestelde interest</strong> krijg je ook rente over eerder ontvangen rente. Een <strong>hypotheek</strong> is een lening voor een huis.`,
    [
      { h: '1. Sparen, lenen en rente', p: [
        `<strong>Rente</strong> is de vergoeding voor het gebruik van geld: je ontvangt rente over je <strong>sparen</strong> en betaalt rente als je gaat <strong>lenen</strong>. Een lening betaal je stapsgewijs terug via <strong>aflossing</strong>; de mogelijkheid om te lenen heet <strong>krediet</strong>.`] },
      { h: '2. Rente over rente', p: [
        `Bij <strong>enkelvoudige interest</strong> krijg je elk jaar rente over alleen het startbedrag. Bij <strong>samengestelde interest</strong> krijg je rente over het bedrag inclusief de eerder bijgeschreven rente, waardoor je spaargeld sneller groeit.`],
        worked: { q: 'Je zet € 100 weg tegen 10% rente per jaar. Hoeveel rente krijg je in het tweede jaar?', steps: ['Na jaar 1 heb je € 110 (€ 100 + € 10 rente).', 'In jaar 2 krijg je 10% over € 110, niet over € 100.'], ans: '€ 11 rente: je krijgt rente over de rente (samengestelde interest).' } },
      { h: '3. Lenen voor een huis', p: [
        `Een <strong>hypotheek</strong> is een lening voor een huis, met het huis als <strong>onderpand</strong>: betaal je niet terug, dan mag de bank het verkopen. De <strong>centrale bank</strong> bewaakt de waarde van het geld en beïnvloedt de rente.`] },
    ],
    [
      { t: 'Rente', d: 'de vergoeding voor het lenen of uitlenen van geld', k: 'vergoeding voor geld', fout: ['Aflossing'] },
      { t: 'Samengestelde interest', d: 'rente die je ook over eerder ontvangen rente krijgt', k: 'rente over rente', fout: ['Enkelvoudige interest'] },
      { t: 'Enkelvoudige interest', d: 'rente alleen over het oorspronkelijke bedrag', k: 'rente over startbedrag', fout: ['Samengestelde interest'] },
      { t: 'Sparen', d: 'geld opzijzetten, vaak bij een bank tegen rente', k: 'geld opzijzetten', fout: ['Lenen'] },
      { t: 'Lenen', d: 'geld tijdelijk van een ander gebruiken tegen rente', k: 'geld tijdelijk gebruiken', fout: ['Sparen', 'Krediet'] },
      { t: 'Hypotheek', d: 'een lening voor een huis met het huis als onderpand', k: 'lening voor een huis', fout: ['Krediet'] },
      { t: 'Centrale bank', d: 'de bank die het geldbeleid van een land of de EU bepaalt', k: 'bewaakt het geld', fout: ['Onderpand'] },
      { t: 'Rentestand', d: 'de hoogte van de rente op een bepaald moment', k: 'hoogte van de rente', fout: ['Rente'] },
      { t: 'Aflossing', d: 'het terugbetalen van een lening', k: 'lening terugbetalen', fout: ['Rente'] },
      { t: 'Onderpand', d: 'bezit dat de bank mag verkopen als je niet terugbetaalt', k: 'zekerheid voor de bank', fout: ['Hypotheek'] },
      { t: 'Krediet', d: 'de mogelijkheid om geld te lenen', k: 'mogelijkheid om te lenen', fout: ['Lenen'] },
      { t: 'Inflatie', d: 'een algemene stijging van de prijzen', k: 'prijzen stijgen', fout: ['Rente'] },
    ]),

  V('I', 'Ondernemen',
    `Een <strong>ondernemer</strong> start een bedrijf en neemt <strong>risico</strong>. In een <strong>ondernemingsplan</strong> werk je je idee uit: <strong>doelgroep</strong>, <strong>marktonderzoek</strong>, <strong>startkapitaal</strong> en de <strong>kostprijs</strong>.`,
    [
      { h: '1. Een bedrijf starten', p: [
        `Een <strong>ondernemer</strong> begint een bedrijf en neemt daarbij <strong>risico</strong>: de kans dat het misgaat. In een <strong>ondernemingsplan</strong> werk je alles uit. Je hebt <strong>startkapitaal</strong> nodig en doet <strong>investeringen</strong> in bedrijfsmiddelen. Hoe je aan geld komt, heet de <strong>financiering</strong>; de <strong>rechtsvorm</strong> bepaalt onder meer wie aansprakelijk is.`] },
      { h: '2. Klanten en prijs', p: [
        `Met <strong>marktonderzoek</strong> onderzoek je je klanten en <strong>concurrenten</strong>, zodat je je <strong>doelgroep</strong> kent. De <strong>kostprijs</strong> zijn de kosten per product; het verschil met de verkoopprijs is je <strong>winstmarge</strong>.`] },
    ],
    [
      { t: 'Ondernemer', d: 'iemand die een bedrijf start en er risico mee neemt', k: 'start een bedrijf', fout: ['Werkgever'] },
      { t: 'Ondernemingsplan', d: 'een plan waarin je je bedrijf uitwerkt', k: 'plan voor je bedrijf', fout: ['Marktonderzoek'] },
      { t: 'Startkapitaal', d: 'het geld dat je nodig hebt om te beginnen', k: 'geld om te starten', fout: ['Investering'] },
      { t: 'Investering', d: 'geld dat je uitgeeft aan bedrijfsmiddelen', k: 'geld in bedrijfsmiddelen', fout: ['Startkapitaal'] },
      { t: 'Marktonderzoek', d: 'onderzoek naar klanten en concurrenten', k: 'onderzoek naar de markt', fout: ['Doelgroep'] },
      { t: 'Doelgroep', d: 'de groep klanten die je wilt bereiken', k: 'jouw klanten', fout: ['Concurrent'] },
      { t: 'Concurrent', d: 'een ander bedrijf dat hetzelfde aanbiedt', k: 'rivaal op de markt', fout: ['Doelgroep'] },
      { t: 'Kostprijs', d: 'de kosten per product', k: 'kosten per product', fout: ['Winstmarge'] },
      { t: 'Winstmarge', d: 'het verschil tussen verkoopprijs en kostprijs', k: 'verkoopprijs min kostprijs', fout: ['Kostprijs'] },
      { t: 'Financiering', d: 'de manier waarop je aan geld voor je bedrijf komt', k: 'hoe je aan geld komt', fout: ['Investering'] },
      { t: 'Risico', d: 'de kans dat iets misgaat en je geld verliest', k: 'kans op verlies', fout: ['Financiering'] },
      { t: 'Rechtsvorm', d: 'de juridische vorm van een bedrijf, zoals een eenmanszaak', k: 'juridische vorm', fout: ['Ondernemingsplan'] },
    ]),
];
