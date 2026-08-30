// VMBO GL/TL - Aardrijkskunde. Gouden-stijl contentspec.
const V = (domein, naam, intro, secties, concepten) => ({ niveau: 'vmbo', vak: 'ak', domein, naam, intro, secties, concepten });

export default [
  V('A', 'Weer en klimaat',
    `<strong>Weer</strong> is de toestand van de atmosfeer op een moment; <strong>klimaat</strong> is het gemiddelde weer over dertig jaar. Lucht stroomt van een <strong>hogedrukgebied</strong> naar een <strong>lagedrukgebied</strong>: dat is <strong>wind</strong>.`,
    [
      { h: '1. Weer en klimaat', p: [
        `<strong>Weer</strong> beschrijft de toestand van de lucht op één moment (nu regen, straks zon). <strong>Klimaat</strong> is het gemiddelde weer over een lange periode, meestal dertig jaar. Nederland heeft een <strong>zeeklimaat</strong>: milde winters en koele zomers door de invloed van de zee. Ver van zee heerst een <strong>landklimaat</strong> met koude winters en warme zomers.`] },
      { h: '2. Luchtdruk en wind', p: [
        `De <strong>luchtdruk</strong> is de druk die de lucht uitoefent. In een <strong>lagedrukgebied</strong> stijgt lucht op: vaak bewolkt en nat. In een <strong>hogedrukgebied</strong> daalt lucht: vaak droog en zonnig. Lucht stroomt van hoge naar lage druk, en die stroming is de <strong>wind</strong>. De <strong>wet van Buys Ballot</strong> beschrijft hoe de wind rond die gebieden draait.`,
        `Op een weerkaart verbindt een <strong>isobar</strong> punten met dezelfde luchtdruk, en een <strong>front</strong> is de grens tussen warme en koude lucht.`] },
      { h: '3. Een klimaatgrafiek lezen', p: [
        `Een <strong>klimaatgrafiek</strong> laat per maand de gemiddelde <strong>temperatuur</strong> (als lijn) en de <strong>neerslag</strong> (als staven) zien. Zo herken je bijvoorbeeld een natte winter en een droge zomer, of andersom.`] },
    ],
    [
      { t: 'Weer', d: 'de toestand van de atmosfeer op een bepaald moment', k: 'toestand van de lucht nu', fout: ['Klimaat'] },
      { t: 'Klimaat', d: 'het gemiddelde weer over een lange periode van dertig jaar', k: 'gemiddeld weer, lange termijn', fout: ['Weer'] },
      { t: 'Luchtdruk', d: 'de druk die de lucht op het aardoppervlak uitoefent', k: 'druk van de lucht', fout: ['Lagedrukgebied', 'Hogedrukgebied'] },
      { t: 'Lagedrukgebied', d: 'een gebied met lage luchtdruk, vaak bewolkt en nat', k: 'lage druk, nat weer', fout: ['Hogedrukgebied'] },
      { t: 'Hogedrukgebied', d: 'een gebied met hoge luchtdruk, vaak droog en zonnig', k: 'hoge druk, droog weer', fout: ['Lagedrukgebied'] },
      { t: 'Wind', d: 'bewegende lucht van een hogedruk- naar een lagedrukgebied', k: 'bewegende lucht', fout: ['Luchtdruk'] },
      { t: 'Wet van Buys Ballot', d: 'de regel die de windrichting rond hoge- en lagedrukgebieden beschrijft', k: 'regel voor windrichting', fout: ['Isobar'] },
      { t: 'Neerslag', d: 'water dat uit de lucht valt, zoals regen en sneeuw', k: 'regen en sneeuw', fout: ['Temperatuur', 'Verdamping'] },
      { t: 'Temperatuur', d: 'de mate van warmte, gemeten in graden', k: 'hoe warm het is', fout: ['Neerslag'] },
      { t: 'Klimaatgrafiek', d: 'een grafiek met de gemiddelde temperatuur en neerslag per maand', k: 'temperatuur en neerslag per maand', fout: ['Isobar'] },
      { t: 'Isobar', d: 'een lijn op een weerkaart die punten met gelijke luchtdruk verbindt', k: 'lijn van gelijke druk', fout: ['Klimaatgrafiek'] },
      { t: 'Front', d: 'de grens tussen warme en koude lucht', k: 'grens warme en koude lucht', fout: ['Isobar'] },
      { t: 'Zeeklimaat', d: 'een klimaat met milde winters en koele zomers door de zee', k: 'mild door de zee', fout: ['Landklimaat'] },
      { t: 'Landklimaat', d: 'een klimaat met koude winters en warme zomers, ver van zee', k: 'extreem, ver van zee', fout: ['Zeeklimaat'] },
    ]),

  V('B', 'Water',
    `In de <strong>waterkringloop</strong> verdampt water, valt het als <strong>neerslag</strong> en stroomt het via <strong>rivieren</strong> terug naar zee. Nederland ligt laag en beschermt zich met <strong>dijken</strong>, <strong>polders</strong> en <strong>gemalen</strong>.`,
    [
      { h: '1. De waterkringloop', p: [
        `Water is voortdurend in beweging. Door <strong>verdamping</strong> wordt zeewater waterdamp, die als <strong>neerslag</strong> weer valt. Een deel zakt weg als <strong>grondwater</strong>, een deel stroomt via een <strong>rivier</strong> naar zee, waar de rivier zich in een <strong>delta</strong> vertakt. Dit geheel heet de <strong>waterkringloop</strong>.`] },
      { h: '2. Nederland en het water', p: [
        `Grote delen van Nederland liggen onder zeeniveau. Een <strong>dijk</strong> houdt het water tegen, een <strong>polder</strong> is drooggelegd land en een <strong>gemaal</strong> pompt overtollig water weg. Het <strong>waterschap</strong> beheert de dijken en het waterpeil. Door <strong>zeespiegelstijging</strong> neemt het risico op <strong>overstroming</strong> toe.`] },
    ],
    [
      { t: 'Waterkringloop', d: 'de kringloop van verdamping, neerslag en afstroming van water', k: 'water gaat rond', fout: ['Verdamping'] },
      { t: 'Verdamping', d: 'het overgaan van water in waterdamp', k: 'water wordt damp', fout: ['Neerslag'] },
      { t: 'Neerslag', d: 'water dat uit de lucht valt, zoals regen en sneeuw', k: 'regen en sneeuw', fout: ['Verdamping'] },
      { t: 'Grondwater', d: 'water dat zich in de bodem bevindt', k: 'water in de bodem', fout: ['Rivier'] },
      { t: 'Rivier', d: 'stromend water dat richting de zee gaat', k: 'stromend water naar zee', fout: ['Delta', 'Grondwater'] },
      { t: 'Delta', d: 'het gebied waar een rivier zich vertakt en in zee uitmondt', k: 'riviermonding in zee', fout: ['Rivier'] },
      { t: 'Dijk', d: 'een verhoging die het land tegen water beschermt', k: 'waterkering', fout: ['Gemaal', 'Polder'] },
      { t: 'Polder', d: 'laaggelegen land dat door dijken en gemalen droog blijft', k: 'drooggelegd laagland', fout: ['Dijk', 'Gemaal'] },
      { t: 'Gemaal', d: 'een installatie die overtollig water wegpompt', k: 'pompt water weg', fout: ['Dijk'] },
      { t: 'Overstroming', d: 'het onderlopen van land met water', k: 'land loopt onder', fout: ['Zeespiegelstijging'] },
      { t: 'Zeespiegelstijging', d: 'het stijgen van het gemiddelde zeeniveau', k: 'zee komt hoger', fout: ['Overstroming'] },
      { t: 'Waterschap', d: 'het bestuur dat zorgt voor dijken en het waterpeil', k: 'bestuur voor water', fout: ['Gemaal'] },
    ]),

  V('C', 'Bevolking en ruimte',
    `De <strong>bevolkingsgroei</strong> hangt af van het <strong>geboortecijfer</strong>, het <strong>sterftecijfer</strong> en <strong>migratie</strong>. Door <strong>verstedelijking</strong> trekken mensen naar de stad.`,
    [
      { h: '1. Waardoor groeit een bevolking?', p: [
        `Een bevolking groeit door geboorte en immigratie, en krimpt door sterfte en emigratie. Het <strong>geboortecijfer</strong> en het <strong>sterftecijfer</strong> geven het aantal geboorten en sterfgevallen per duizend inwoners. Het verschil is de <strong>natuurlijke aanwas</strong>. Daarnaast telt <strong>migratie</strong> mee: <strong>immigratie</strong> is een land binnenkomen, <strong>emigratie</strong> is vertrekken.`] },
      { h: '2. Steden en spreiding', p: [
        `Door <strong>verstedelijking</strong> groeien steden en neemt het aandeel stadsbewoners toe; het trekken van het platteland naar de stad heet <strong>urbanisatie</strong>. De <strong>bevolkingsdichtheid</strong> zegt hoeveel mensen er per vierkante kilometer wonen. In veel landen speelt ook <strong>vergrijzing</strong>: het aandeel ouderen stijgt.`] },
    ],
    [
      { t: 'Bevolkingsgroei', d: 'de toename van het aantal inwoners van een gebied', k: 'meer inwoners', fout: ['Natuurlijke aanwas'] },
      { t: 'Geboortecijfer', d: 'het aantal geboorten per duizend inwoners per jaar', k: 'geboorten per 1000', fout: ['Sterftecijfer'] },
      { t: 'Sterftecijfer', d: 'het aantal sterfgevallen per duizend inwoners per jaar', k: 'sterfgevallen per 1000', fout: ['Geboortecijfer'] },
      { t: 'Natuurlijke aanwas', d: 'het geboortecijfer min het sterftecijfer', k: 'geboorten min sterfte', fout: ['Bevolkingsgroei'] },
      { t: 'Migratie', d: 'het verhuizen van mensen naar een ander gebied', k: 'mensen verhuizen', fout: ['Verstedelijking'] },
      { t: 'Immigratie', d: 'het zich vestigen in een nieuw land', k: 'een land binnenkomen', fout: ['Emigratie'] },
      { t: 'Emigratie', d: 'het vertrekken uit je eigen land om elders te wonen', k: 'je land verlaten', fout: ['Immigratie'] },
      { t: 'Verstedelijking', d: 'de groei van steden en van het aandeel stadsbewoners', k: 'steden groeien', fout: ['Migratie'] },
      { t: 'Bevolkingsdichtheid', d: 'het aantal inwoners per vierkante kilometer', k: 'inwoners per km²', fout: ['Bevolkingsgroei'] },
      { t: 'Vergrijzing', d: 'de toename van het aandeel ouderen in de bevolking', k: 'meer ouderen', fout: ['Bevolkingsgroei'] },
      { t: 'Urbanisatie', d: 'het trekken van mensen van het platteland naar de stad', k: 'van platteland naar stad', fout: ['Verstedelijking'] },
      { t: 'Platteland', d: 'dunbevolkt gebied buiten de stad', k: 'buiten de stad', fout: ['Urbanisatie'] },
    ]),

  V('D', 'Arm en rijk',
    `De <strong>welvaart</strong> verschilt sterk tussen landen; het <strong>bnp per inwoner</strong> is er een maat voor. Rijke <strong>centrumgebieden</strong> staan tegenover arme <strong>periferiegebieden</strong>.`,
    [
      { h: '1. Welvaart meten', p: [
        `<strong>Welvaart</strong> is de mate waarin mensen in hun behoeften kunnen voorzien. Je meet die onder meer met het <strong>bnp per inwoner</strong> (de gemiddelde productie per persoon), de <strong>levensverwachting</strong> en het <strong>analfabetisme</strong>. Landen met lage welvaart heten <strong>ontwikkelingslanden</strong>, landen met hoge welvaart <strong>ontwikkelde landen</strong>.`] },
      { h: '2. Centrum en periferie', p: [
        `Binnen en tussen landen zie je een rijk <strong>centrum</strong> met veel bedrijvigheid en een arme <strong>periferie</strong> aan de rand. Zulke <strong>welvaartsverschillen</strong> ontstaan door verschillen in <strong>grondstoffen</strong>, onderwijs, <strong>infrastructuur</strong> en handel. Met <strong>ontwikkelingssamenwerking</strong> worden armere landen geholpen.`] },
    ],
    [
      { t: 'Welvaart', d: 'de mate waarin mensen in hun behoeften kunnen voorzien', k: 'hoe goed men rondkomt', fout: ['Welvaartsverschil'] },
      { t: 'Bnp per inwoner', d: 'de gemiddelde productie per persoon in een land', k: 'productie per persoon', fout: ['Levensverwachting'] },
      { t: 'Ontwikkelingsland', d: 'een land met een lage welvaart', k: 'arm land', fout: ['Ontwikkeld land'] },
      { t: 'Ontwikkeld land', d: 'een land met een hoge welvaart', k: 'rijk land', fout: ['Ontwikkelingsland'] },
      { t: 'Centrum', d: 'een rijk en welvarend gebied met veel bedrijvigheid', k: 'rijk kerngebied', fout: ['Periferie'] },
      { t: 'Periferie', d: 'een arm en afgelegen gebied aan de rand', k: 'arm randgebied', fout: ['Centrum'] },
      { t: 'Welvaartsverschil', d: 'het verschil in rijkdom tussen gebieden of landen', k: 'verschil in rijkdom', fout: ['Welvaart'] },
      { t: 'Analfabetisme', d: 'het niet kunnen lezen en schrijven', k: 'niet kunnen lezen', fout: ['Levensverwachting'] },
      { t: 'Levensverwachting', d: 'het gemiddelde aantal jaren dat iemand naar verwachting leeft', k: 'gemiddelde levensduur', fout: ['Bnp per inwoner'] },
      { t: 'Grondstoffen', d: 'natuurlijke stoffen waarmee een land geld kan verdienen', k: 'natuurlijke rijkdommen', fout: ['Infrastructuur'] },
      { t: 'Infrastructuur', d: 'voorzieningen zoals wegen, havens en spoor', k: 'wegen en verbindingen', fout: ['Grondstoffen'] },
      { t: 'Ontwikkelingssamenwerking', d: 'hulp aan armere landen om zich te ontwikkelen', k: 'hulp aan arme landen', fout: ['Welvaartsverschil'] },
    ]),

  V('E', 'Ruimtelijke ordening',
    `<strong>Ruimtelijke ordening</strong> is het plannen van het gebruik van de ruimte. In een <strong>bestemmingsplan</strong> legt de overheid vast welke <strong>bestemming</strong> een gebied krijgt: wonen, werken of natuur.`,
    [
      { h: '1. De ruimte plannen', p: [
        `Nederland is klein en dichtbevolkt, dus de ruimte wordt zorgvuldig verdeeld: dat is <strong>ruimtelijke ordening</strong>. In een <strong>bestemmingsplan</strong> legt de gemeente vast waarvoor grond gebruikt mag worden. De <strong>bestemming</strong> is de functie die een gebied krijgt; de <strong>functie</strong> is het gebruik ervan, zoals wonen of natuur.`] },
      { h: '2. Belangen afwegen', p: [
        `Bij het inrichten van een gebied botsen vaak verschillende <strong>belangen</strong>. De overheid maakt dan een <strong>belangenafweging</strong>. Zo kies je tussen een <strong>woonfunctie</strong> en een <strong>recreatiefunctie</strong>, of tussen een <strong>industriegebied</strong> en een beschermd <strong>natuurgebied</strong>.`] },
    ],
    [
      { t: 'Ruimtelijke ordening', d: 'het indelen en plannen van het gebruik van de ruimte', k: 'de ruimte plannen', fout: ['Bestemmingsplan'] },
      { t: 'Bestemmingsplan', d: 'een plan dat vastlegt waarvoor grond gebruikt mag worden', k: 'plan voor grondgebruik', fout: ['Bestemming', 'Ruimtelijke ordening'] },
      { t: 'Bestemming', d: 'de functie die een gebied volgens het plan krijgt', k: 'toegewezen functie', fout: ['Functie'] },
      { t: 'Functie', d: 'het gebruik of doel van een gebied', k: 'gebruik van een gebied', fout: ['Bestemming'] },
      { t: 'Belang', d: 'het voordeel dat iemand bij iets heeft', k: 'wat iemand wil', fout: ['Belangenafweging'] },
      { t: 'Belangenafweging', d: 'het tegen elkaar afwegen van verschillende belangen', k: 'belangen afwegen', fout: ['Belang'] },
      { t: 'Woonfunctie', d: 'het gebruik van een gebied om te wonen', k: 'gebied om te wonen', fout: ['Recreatiefunctie'] },
      { t: 'Recreatiefunctie', d: 'het gebruik van een gebied voor ontspanning', k: 'gebied voor ontspanning', fout: ['Woonfunctie'] },
      { t: 'Industriegebied', d: 'een gebied bestemd voor bedrijven en fabrieken', k: 'gebied voor bedrijven', fout: ['Natuurgebied'] },
      { t: 'Natuurgebied', d: 'een gebied dat beschermd is voor planten en dieren', k: 'beschermde natuur', fout: ['Industriegebied'] },
      { t: 'Verstedelijking', d: 'de groei van steden en het stedelijk ruimtegebruik', k: 'steden groeien', fout: ['Woonfunctie'] },
      { t: 'Infrastructuur', d: 'voorzieningen zoals wegen en verbindingen in een gebied', k: 'wegen en verbindingen', fout: ['Industriegebied'] },
    ]),

  V('F', 'Grenzen en identiteit',
    `Een <strong>grens</strong> scheidt gebieden; soms valt hij samen met een rivier of gebergte. <strong>Migratiestromen</strong> verplaatsen mensen tussen <strong>cultuurgebieden</strong>, en gedeelde taal en gewoonten vormen een <strong>identiteit</strong>.`,
    [
      { h: '1. Grenzen en gebied', p: [
        `Een <strong>grens</strong> is de lijn die twee gebieden scheidt. Een <strong>natuurlijke grens</strong> valt samen met bijvoorbeeld een rivier of gebergte. Het gebied waarover een land zeggenschap heeft, is het <strong>territorium</strong>; over het bezit ervan ontstaat soms een <strong>territoriaal conflict</strong>.`] },
      { h: '2. Migratie, cultuur en identiteit', p: [
        `Door <strong>migratiestromen</strong> verhuizen grote groepen mensen, soms als <strong>vluchteling</strong>. Een <strong>cultuurgebied</strong> deelt taal en gewoonten (de <strong>cultuur</strong>) en soms een <strong>godsdienst</strong>. Dat gedeelde gevoel erbij te horen is de <strong>identiteit</strong>. <strong>Integratie</strong> is het meedoen van nieuwkomers in de samenleving.`] },
    ],
    [
      { t: 'Grens', d: 'de lijn die twee gebieden of landen van elkaar scheidt', k: 'scheidingslijn', fout: ['Natuurlijke grens'] },
      { t: 'Natuurlijke grens', d: 'een grens die samenvalt met een rivier of gebergte', k: 'grens langs de natuur', fout: ['Grens'] },
      { t: 'Migratiestroom', d: 'een grote verplaatsing van mensen tussen gebieden', k: 'grote verhuisstroom', fout: ['Vluchteling'] },
      { t: 'Cultuurgebied', d: 'een gebied met een gedeelde cultuur en taal', k: 'gebied met gedeelde cultuur', fout: ['Cultuur'] },
      { t: 'Identiteit', d: 'het gevoel bij een groep of gebied te horen', k: 'gevoel van erbij horen', fout: ['Cultuur'] },
      { t: 'Nationaliteit', d: 'het behoren tot een bepaald land', k: 'bij een land horen', fout: ['Identiteit'] },
      { t: 'Territorium', d: 'het gebied waarover een land zeggenschap heeft', k: 'grondgebied van een land', fout: ['Territoriaal conflict'] },
      { t: 'Territoriaal conflict', d: 'een conflict over het bezit van een gebied', k: 'ruzie over gebied', fout: ['Territorium'] },
      { t: 'Integratie', d: 'het opgaan van migranten in de samenleving', k: 'meedoen in de samenleving', fout: ['Migratiestroom'] },
      { t: 'Vluchteling', d: 'iemand die zijn land ontvlucht vanwege gevaar', k: 'ontvlucht gevaar', fout: ['Migratiestroom'] },
      { t: 'Cultuur', d: 'de gewoonten, taal en gebruiken van een groep', k: 'gewoonten en gebruiken', fout: ['Identiteit', 'Cultuurgebied'] },
      { t: 'Godsdienst', d: 'een gedeeld geloof binnen een cultuur', k: 'gedeeld geloof', fout: ['Cultuur'] },
    ]),
];
