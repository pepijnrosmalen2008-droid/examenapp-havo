// VMBO GL/TL - Duits. Gouden-stijl contentspec.
const V = (domein, naam, intro, secties, concepten, vragen) => ({ niveau: 'vmbo', vak: 'du', domein, naam, intro, secties, concepten, vragen });

export default [
  V('A', 'Leesvaardigheid',
    `Bij <strong>leesvaardigheid</strong> gebruik je <strong>skimmen</strong> en <strong>scannen</strong>. <strong>Signaalwoorden</strong> zoals <em>aber</em> (maar), <em>weil</em> (omdat) en <em>deshalb</em> (daarom) laten de samenhang zien. Duits lijkt vaak op Nederlands, dus raad slim.`,
    [
      { h: '1. Leesstrategieën en verwante woorden', p: [
        `Lees een Duitse tekst eerst globaal (<strong>skimmen</strong>) en zoek details gericht op (<strong>scannen</strong>). Veel Duitse woorden lijken op het Nederlands (<em>Wasser</em> = water, <em>Buch</em> = boek); die verwantschap helpt je raden. Let wel op <strong>valse vrienden</strong> zoals <em>bellen</em> (blaffen) en <em>See</em> (meer).`] },
      { h: '2. Signaalwoorden', p: [
        `Signaalwoorden verraden het verband. Tegenstelling: <em>aber</em> (maar), <em>obwohl</em> (hoewel). Reden: <em>weil</em> (omdat), <em>denn</em> (want). Gevolg: <em>deshalb</em> en <em>darum</em> (daarom). Opsomming: <em>und</em> (en), <em>auch</em> (ook). Voorbeeld: <em>zum Beispiel</em> (bijvoorbeeld).`] },
    ],
    [
      { t: 'Skimmen', d: 'snel en globaal lezen voor de hoofdgedachte', k: 'globaal lezen', fout: ['Scannen'] },
      { t: 'Scannen', d: 'gericht zoeken naar één stukje informatie', k: 'gericht zoeken', fout: ['Skimmen'] },
      { t: 'Aber', d: 'Duits voor "maar"; geeft een tegenstelling', k: 'maar (tegenstelling)', fout: ['Weil', 'Und'] },
      { t: 'Weil', d: 'Duits voor "omdat"; geeft een reden', k: 'omdat (reden)', fout: ['Deshalb', 'Aber'] },
      { t: 'Deshalb', d: 'Duits voor "daarom"; geeft een gevolg', k: 'daarom (gevolg)', fout: ['Weil'] },
      { t: 'Obwohl', d: 'Duits voor "hoewel"; geeft een tegenstelling', k: 'hoewel (tegenstelling)', fout: ['Weil'] },
      { t: 'Und', d: 'Duits voor "en"; een opsomming', k: 'en (opsomming)', fout: ['Aber'] },
      { t: 'Auch', d: 'Duits voor "ook"; voegt iets toe', k: 'ook (opsomming)', fout: ['Aber'] },
      { t: 'Zum Beispiel', d: 'Duits voor "bijvoorbeeld"; leidt een voorbeeld in', k: 'bijvoorbeeld', fout: ['Deshalb'] },
      { t: 'Valse vriend', d: 'een woord dat lijkt maar iets anders betekent', k: 'lijkt, betekent anders', fout: ['Aber'] },
    ],
    [
      { v: "Wat betekent 'aber'?", o: ['omdat', 'maar', 'daarom', 'ook'], c: 1, d: 1, uo: ['«omdat» is weil.', 'Klopt: «aber» betekent maar en geeft een tegenstelling.', '«daarom» is deshalb.', '«ook» is auch.'], uh: 'Tegenstelling: aber. Reden: weil. Gevolg: deshalb.' },
      { v: "Wat betekent 'weil'?", o: ['omdat', 'maar', 'en', 'hoewel'], c: 0, d: 1, uo: ['Klopt: «weil» betekent omdat en geeft een reden.', '«maar» is aber.', '«en» is und.', '«hoewel» is obwohl.'] },
      { v: "Welk woord geeft een gevolg aan?", o: ['weil', 'aber', 'deshalb', 'und'], c: 2, d: 2, uo: ['«weil» geeft een reden (omdat).', '«aber» is een tegenstelling (maar).', 'Klopt: «deshalb» betekent daarom en geeft een gevolg.', '«und» is een opsomming (en).'] },
      { v: "Wat betekent het Duitse woord 'Wasser'?", o: ['water', 'winter', 'wagen', 'weer'], c: 0, d: 1, uo: ['Klopt: «Wasser» lijkt op water en betekent dat ook.', '«winter» is Winter.', '«wagen» is Wagen (auto).', '«weer» is Wetter.'] },
      { v: 'Wat is een valse vriend?', o: ['een woord dat lijkt maar iets anders betekent', 'een synoniem', 'een signaalwoord', 'een lidwoord'], c: 0, d: 2, uo: ['Klopt: het lijkt op het Nederlands maar betekent iets anders.', 'Een synoniem heeft juist dezelfde betekenis.', 'Een signaalwoord verbindt zinnen.', 'Een lidwoord is der/die/das.'] },
      { v: "Wat betekent 'zum Beispiel'?", o: ['bijvoorbeeld', 'daarom', 'hoewel', 'omdat'], c: 0, d: 2, uo: ['Klopt: «zum Beispiel» leidt een voorbeeld in.', '«daarom» is deshalb.', '«hoewel» is obwohl.', '«omdat» is weil.'] },
      { v: 'Je zoekt gericht één jaartal in een Duitse tekst. Wat doe je?', o: ['skimmen', 'scannen', 'alles vertalen', 'hardop lezen'], c: 1, d: 2, uo: ['Skimmen is voor de hoofdlijn.', 'Klopt: scannen is gericht zoeken naar één detail.', 'Alles vertalen kost te veel tijd.', 'Hardop lezen helpt niet bij zoeken.'] },
      { v: "Wat betekent 'obwohl'?", o: ['omdat', 'daarom', 'hoewel', 'en'], c: 2, d: 2, uo: ['«omdat» is weil.', '«daarom» is deshalb.', 'Klopt: «obwohl» betekent hoewel (tegenstelling).', '«en» is und.'] },
      { v: "Wat betekent 'auch'?", o: ['maar', 'ook', 'omdat', 'daarom'], c: 1, d: 1, uo: ['«maar» is aber.', 'Klopt: «auch» betekent ook en voegt iets toe.', '«omdat» is weil.', '«daarom» is deshalb.'] },
    ]),

  V('B', 'Luister- en kijkvaardigheid',
    `Bij <strong>luisteren</strong> pak je de <strong>hoofdgedachte</strong> en gebruik je <strong>vraagwoorden</strong> als <em>wer</em> (wie), <em>wo</em> (waar) en <em>warum</em> (waarom) om te horen waar een vraag naar zoekt.`,
    [
      { h: '1. Vraagwoorden', p: [
        `De Duitse vraagwoorden: <em>wer</em> (wie), <em>was</em> (wat), <em>wo</em> (waar), <em>wann</em> (wanneer), <em>warum</em> (waarom), <em>wie</em> (hoe) en <em>wie viel</em> (hoeveel). Let op: <em>wer</em> lijkt op "waar" maar betekent "wie", en <em>wo</em> betekent "waar". Dat is een klassieke valkuil.`] },
      { h: '2. Luisteren met een doel', p: [
        `Je hoeft niet alles te verstaan. Pak de <strong>hoofdgedachte</strong> en gebruik de <strong>context</strong>. Handige zinnen: <em>Können Sie das wiederholen?</em> (Kunt u dat herhalen?) en <em>Ich verstehe nicht</em> (Ik begrijp het niet).`] },
    ],
    [
      { t: 'Wer', d: 'Duits vraagwoord voor "wie"; vraagt naar een persoon', k: 'wie (persoon)', fout: ['Wo', 'Was'] },
      { t: 'Was', d: 'Duits vraagwoord voor "wat"; vraagt naar een ding', k: 'wat (ding)', fout: ['Wer'] },
      { t: 'Wo', d: 'Duits vraagwoord voor "waar"; vraagt naar een plaats', k: 'waar (plaats)', fout: ['Wer', 'Wann'] },
      { t: 'Wann', d: 'Duits vraagwoord voor "wanneer"; vraagt naar een tijd', k: 'wanneer (tijd)', fout: ['Wo'] },
      { t: 'Warum', d: 'Duits vraagwoord voor "waarom"; vraagt naar een reden', k: 'waarom (reden)', fout: ['Wie'] },
      { t: 'Wie', d: 'Duits vraagwoord voor "hoe"; vraagt naar de manier', k: 'hoe (manier)', fout: ['Warum'] },
      { t: 'Wie viel', d: 'Duits voor "hoeveel"; vraagt vaak naar de prijs', k: 'hoeveel (prijs)', fout: ['Wie'] },
      { t: 'Hoofdgedachte', d: 'de kern van wat de spreker bedoelt', k: 'de kern', fout: ['Context'] },
      { t: 'Context', d: 'de situatie eromheen die helpt woorden te raden', k: 'situatie eromheen', fout: ['Hoofdgedachte'] },
    ],
    [
      { v: "Wat betekent 'wo'?", o: ['wie', 'waar', 'wanneer', 'waarom'], c: 1, d: 2, uo: ['«wie» als persoon is wer; let op de valkuil.', 'Klopt: «wo» betekent waar (plaats).', '«wanneer» is wann.', '«waarom» is warum.'], uh: 'Let op: wer = wie (persoon), wo = waar (plaats).' },
      { v: "Wat betekent 'wer'?", o: ['waar', 'wie', 'wat', 'hoe'], c: 1, d: 2, uo: ['«waar» is wo; dat is de klassieke valkuil.', 'Klopt: «wer» vraagt naar een persoon (wie).', '«wat» is was.', '«hoe» is wie.'] },
      { v: "Waar vraagt 'warum' naar?", o: ['een plaats', 'een reden', 'een tijd', 'een persoon'], c: 1, d: 1, uo: ['Naar een plaats vraag je met wo.', 'Klopt: «warum» vraagt naar een reden (waarom).', 'Naar een tijd vraag je met wann.', 'Naar een persoon vraag je met wer.'] },
      { v: "Wat betekent 'Ich verstehe nicht'?", o: ['Ik begrijp het niet', 'Ik weet het al', 'Waar is het?', 'Hoe laat is het?'], c: 0, d: 2, uo: ['Klopt: je zegt dat je het niet snapt.', 'Dat zou «Ich weiß es schon» zijn.', 'Dat is «Wo ist das?».', 'Dat is «Wie spät ist es?».'] },
      { v: "Waar vraagt 'wann' naar?", o: ['de plaats', 'de tijd', 'de prijs', 'de reden'], c: 1, d: 1, uo: ['De plaats vraag je met wo.', 'Klopt: «wann» vraagt naar de tijd (wanneer).', 'De prijs vraag je met wie viel.', 'De reden vraag je met warum.'] },
      { v: "Wat betekent 'wie'?", o: ['waarom', 'hoe', 'waar', 'wie'], c: 1, d: 2, uo: ['«waarom» is warum.', 'Klopt: «wie» betekent hoe (de manier).', '«waar» is wo.', 'Persoon «wie» is wer, niet wie.'] },
      { v: 'Wat doe je bij luisteren als eerste?', o: ['elk woord verstaan', 'de hoofdgedachte pakken', 'de spelling checken', 'achteraan beginnen'], c: 1, d: 2, uo: ['Elk woord verstaan lukt zelden en hoeft niet.', 'Klopt: pak eerst de hoofdgedachte.', 'Spelling speelt bij luisteren geen rol.', 'Achteraan beginnen helpt niet.'] },
      { v: "'Wie viel kostet das?' vraagt naar...", o: ['de plaats', 'de prijs', 'de tijd', 'de persoon'], c: 1, d: 2, uo: ['De plaats vraag je met wo.', 'Klopt: «wie viel» vraagt naar hoeveel iets kost.', 'De tijd vraag je met wann.', 'De persoon vraag je met wer.'] },
      { v: "Wat betekent 'was'?", o: ['wie', 'wat', 'waar', 'wanneer'], c: 1, d: 1, uo: ['Persoon «wie» is wer.', 'Klopt: «was» vraagt naar een ding (wat).', '«waar» is wo.', '«wanneer» is wann.'] },
    ]),

  V('C', 'Gespreksvaardigheid',
    `In een gesprek gebruik je vaste <strong>beleefde uitdrukkingen</strong>: begroeten, bedanken en je verontschuldigen. Je spreekt iemand beleefd aan met <em>Sie</em> en informeel met <em>du</em>.`,
    [
      { h: '1. Begroeten en beleefdheid', p: [
        `Je begroet met <em>Hallo</em> of <em>Guten Tag</em> en neemt afscheid met <em>Tschüss</em> of <em>Auf Wiedersehen</em>. Vraag je hoe het gaat: <em>Wie geht's?</em> Bij een kennismaking zeg je <em>Freut mich</em> (aangenaam). Belangrijk: <em>Sie</em> is beleefd (tegen onbekenden), <em>du</em> is informeel (tegen vrienden).`] },
      { h: '2. Bedanken en vragen', p: [
        `Bedanken doe je met <em>Danke</em>, en je antwoordt met <em>Bitte</em> (graag gedaan). Je verontschuldigt je met <em>Entschuldigung</em>. Een beleefde vraag: <em>Können Sie mir helfen?</em> (Kunt u mij helpen?).`] },
    ],
    [
      { t: 'Hallo', d: 'Duitse begroeting: hallo', k: 'begroeting', fout: ['Tschüss'] },
      { t: 'Tschüss', d: 'informeel afscheid: doei', k: 'afscheid (informeel)', fout: ['Hallo'] },
      { t: 'Auf Wiedersehen', d: 'net afscheid: tot ziens', k: 'afscheid (net)', fout: ['Hallo'] },
      { t: "Wie geht's", d: 'Duits voor "Hoe gaat het?"', k: 'hoe gaat het', fout: ['Freut mich'] },
      { t: 'Freut mich', d: 'zin bij een kennismaking: aangenaam', k: 'aangenaam', fout: ["Wie geht's"] },
      { t: 'Danke', d: 'Duits voor bedanken', k: 'bedankt', fout: ['Bitte'] },
      { t: 'Bitte', d: 'alsjeblieft; ook antwoord op danke (graag gedaan)', k: 'alsjeblieft / graag gedaan', fout: ['Danke'] },
      { t: 'Entschuldigung', d: 'zin om je te verontschuldigen: sorry', k: 'sorry', fout: ['Danke'] },
      { t: 'Sie', d: 'beleefde aanspreekvorm (u)', k: 'beleefd: u', fout: ['Du'] },
      { t: 'Du', d: 'informele aanspreekvorm (jij)', k: 'informeel: jij', fout: ['Sie'] },
    ],
    [
      { v: "Wat betekent 'Danke'?", o: ['bedankt', 'sorry', 'hallo', 'tot ziens'], c: 0, d: 1, uo: ['Klopt: «Danke» betekent bedankt.', '«sorry» is Entschuldigung.', '«hallo» is Hallo.', '«tot ziens» is Auf Wiedersehen.'] },
      { v: "Iemand zegt 'Danke'. Wat antwoord je?", o: ['Bitte', 'Hallo', 'Tschüss', 'Warum'], c: 0, d: 2, uo: ['Klopt: «Bitte» betekent hier graag gedaan.', '«Hallo» is een begroeting.', '«Tschüss» is afscheid.', '«Warum» is waarom.'] },
      { v: 'Welke aanspreekvorm is beleefd (tegen een onbekende)?', o: ['du', 'Sie', 'ihr', 'wir'], c: 1, d: 2, uo: ['«du» is informeel, tegen vrienden.', 'Klopt: «Sie» is de beleefde vorm (u).', '«ihr» is jullie (informeel meervoud).', '«wir» betekent wij.'], uh: 'Sie = beleefd (u), du = informeel (jij).' },
      { v: "Wat betekent 'Entschuldigung'?", o: ['sorry', 'bedankt', 'graag gedaan', 'aangenaam'], c: 0, d: 2, uo: ['Klopt: je verontschuldigt je (sorry).', '«bedankt» is Danke.', '«graag gedaan» is Bitte.', '«aangenaam» is Freut mich.'] },
      { v: "Wanneer zeg je 'Freut mich'?", o: ['bij afscheid', 'bij een kennismaking', 'als je bedankt', 'als je boos bent'], c: 1, d: 2, uo: ['Bij afscheid zeg je Tschüss.', 'Klopt: «Freut mich» zeg je als je iemand ontmoet.', 'Bedanken is Danke.', 'Boosheid past hier niet.'] },
      { v: "Wat betekent 'Wie geht's?'", o: ['Hoe heet je?', 'Hoe gaat het?', 'Waar woon je?', 'Hoe laat is het?'], c: 1, d: 1, uo: ['«Hoe heet je?» is «Wie heißt du?».', 'Klopt: je vraagt hoe het gaat.', '«Waar woon je?» is «Wo wohnst du?».', '«Hoe laat is het?» is «Wie spät ist es?».'] },
      { v: 'Hoe neem je informeel afscheid?', o: ['Guten Tag', 'Tschüss', 'Freut mich', 'Bitte'], c: 1, d: 1, uo: ['«Guten Tag» is een begroeting.', 'Klopt: «Tschüss» is informeel afscheid (doei).', '«Freut mich» zeg je bij kennismaking.', '«Bitte» is alsjeblieft.'] },
      { v: "Hoe vraag je beleefd om hulp?", o: ['Können Sie mir helfen?', 'Wie geht\'s?', 'Auf Wiedersehen', 'Danke schön'], c: 0, d: 2, uo: ['Klopt: «Können Sie mir helfen?» vraagt beleefd om hulp.', 'Dat vraagt hoe het gaat.', 'Dat is afscheid nemen.', 'Dat is hartelijk bedanken.'] },
      { v: "Wat betekent 'du'?", o: ['u (beleefd)', 'jij (informeel)', 'wij', 'jullie'], c: 1, d: 2, uo: ['«u (beleefd)» is Sie.', 'Klopt: «du» is de informele vorm (jij).', '«wij» is wir.', '«jullie» is ihr.'] },
    ]),

  V('D', 'Schrijfvaardigheid en grammatica',
    `Bij <strong>schrijven</strong> let je op de <strong>lidwoorden</strong> <em>der/die/das</em>, de <strong>werkwoordsvervoeging</strong> en de <strong>woordvolgorde</strong> (de persoonsvorm staat op de tweede plaats).`,
    [
      { h: '1. Werkwoorden en lidwoorden', p: [
        `Duitse werkwoorden krijgen een uitgang: <em>ich spiele, du spielst, er/sie/es spielt, wir/sie spielen</em>. De hulpwerkwoorden zijn <em>sein</em> (zijn: ich bin, du bist, er ist) en <em>haben</em> (hebben: ich habe, du hast, er hat). Elk zelfstandig naamwoord heeft een lidwoord: <em>der</em> (mannelijk), <em>die</em> (vrouwelijk), <em>das</em> (onzijdig).`] },
      { h: '2. Woordvolgorde', p: [
        `In een gewone Duitse zin staat de <strong>persoonsvorm op de tweede plaats</strong>: <em>Ich spiele heute Fußball</em>. Begin je met een ander zinsdeel, dan komt eerst de persoonsvorm, dan het onderwerp: <em>Heute spiele ich Fußball</em> (inversie).`] },
    ],
    [
      { t: 'Der', d: 'mannelijk lidwoord (de)', k: 'mannelijk: de', fout: ['Die', 'Das'] },
      { t: 'Die', d: 'vrouwelijk lidwoord (de); ook meervoud', k: 'vrouwelijk / meervoud', fout: ['Der', 'Das'] },
      { t: 'Das', d: 'onzijdig lidwoord (het)', k: 'onzijdig: het', fout: ['Der', 'Die'] },
      { t: 'Sein', d: 'werkwoord "zijn": ich bin, du bist, er ist', k: 'zijn', fout: ['Haben'] },
      { t: 'Haben', d: 'werkwoord "hebben": ich habe, du hast, er hat', k: 'hebben', fout: ['Sein'] },
      { t: 'Persoonsvorm', d: 'het vervoegde werkwoord; staat op de tweede plaats', k: 'werkwoord op plaats twee', fout: ['Inversie'] },
      { t: 'Inversie', d: 'onderwerp en persoonsvorm wisselen na een ander begin', k: 'omdraaien na ander begin', fout: ['Persoonsvorm'] },
      { t: 'Werkwoordsuitgang', d: 'de uitgang die past bij het onderwerp (spiele, spielst, spielt)', k: 'uitgang bij onderwerp', fout: ['Sein'] },
    ],
    [
      { v: "Kies de juiste vorm: 'Ich ___ Fußball.'", o: ['spielst', 'spiele', 'spielt', 'spielen'], c: 1, d: 2, uo: ['«spielst» hoort bij du.', 'Klopt: bij ich is de uitgang -e: ich spiele.', '«spielt» hoort bij er/sie/es.', '«spielen» hoort bij wir/sie.'], uh: 'ich -e, du -st, er/sie/es -t, wir/sie -en.' },
      { v: "Kies de juiste vorm: 'Du ___ ein Buch.'", o: ['hast', 'habe', 'hat', 'haben'], c: 0, d: 2, uo: ['Klopt: bij du hoort «hast».', '«habe» hoort bij ich.', '«hat» hoort bij er/sie/es.', '«haben» hoort bij wir/sie.'] },
      { v: "Welk lidwoord is onzijdig (het)?", o: ['der', 'die', 'das', 'den'], c: 2, d: 2, uo: ['«der» is mannelijk (de).', '«die» is vrouwelijk of meervoud (de).', 'Klopt: «das» is onzijdig (het).', '«den» is een naamvalsvorm, geen basis-lidwoord.'], uh: 'der (mannelijk), die (vrouwelijk/meervoud), das (onzijdig).' },
      { v: "Kies de juiste vorm: 'Er ___ nach Hause.'", o: ['gehe', 'gehst', 'geht', 'gehen'], c: 2, d: 2, uo: ['«gehe» hoort bij ich.', '«gehst» hoort bij du.', 'Klopt: bij er is de uitgang -t: er geht.', '«gehen» hoort bij wir/sie.'] },
      { v: "Waar staat de persoonsvorm in een gewone Duitse zin?", o: ['op de eerste plaats', 'op de tweede plaats', 'altijd achteraan', 'dat maakt niet uit'], c: 1, d: 3, uo: ['Op de eerste plaats staat meestal het onderwerp of een bepaling.', 'Klopt: de persoonsvorm staat op de tweede plaats.', 'Achteraan komt de persoonsvorm alleen in bijzinnen.', 'De plaats ligt juist vast.'], uh: 'In de hoofdzin staat de persoonsvorm altijd op plaats twee.' },
      { v: "Kies de juiste vorm: 'Ich ___ zwölf Jahre alt.'", o: ['bin', 'bist', 'ist', 'sind'], c: 0, d: 2, uo: ['Klopt: bij ich hoort «bin».', '«bist» hoort bij du.', '«ist» hoort bij er/sie/es.', '«sind» hoort bij wir/sie.'] },
      { v: "Vul in met inversie: 'Heute ___ ich Fußball.'", o: ['spiele', 'spielst', 'spielt', 'spielen'], c: 0, d: 3, uo: ['Klopt: na "Heute" komt de persoonsvorm bij ich: spiele.', '«spielst» hoort bij du.', '«spielt» hoort bij er/sie/es.', '«spielen» hoort bij wir/sie.'] },
      { v: "Welk lidwoord hoort bij een mannelijk woord (de)?", o: ['der', 'die', 'das', 'ein'], c: 0, d: 2, uo: ['Klopt: «der» is het mannelijke lidwoord (de).', '«die» is vrouwelijk of meervoud.', '«das» is onzijdig.', '«ein» is onbepaald (een).'] },
    ]),
];
