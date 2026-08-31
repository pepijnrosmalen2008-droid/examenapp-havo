// VMBO GL/TL - Frans. Gouden-stijl contentspec.
const V = (domein, naam, intro, secties, concepten, vragen) => ({ niveau: 'vmbo', vak: 'fa', domein, naam, intro, secties, concepten, vragen });

export default [
  V('A', 'Leesvaardigheid',
    `Bij <strong>leesvaardigheid</strong> gebruik je <strong>skimmen</strong> en <strong>scannen</strong>. <strong>Signaalwoorden</strong> zoals <em>mais</em> (maar), <em>parce que</em> (omdat) en <em>donc</em> (dus) laten de samenhang zien.`,
    [
      { h: '1. Leesstrategieën', p: [
        `Lees een Franse tekst eerst globaal (<strong>skimmen</strong>) voor de hoofdgedachte en zoek details gericht op (<strong>scannen</strong>). Je hoeft niet elk woord te kennen: gebruik de <strong>context</strong> en herkenbare woorden (<em>télévision</em>, <em>musique</em>) om te raden.`] },
      { h: '2. Signaalwoorden', p: [
        `Signaalwoorden verraden het verband. Tegenstelling: <em>mais</em> (maar), <em>bien que</em> (hoewel). Reden: <em>parce que</em> (omdat), <em>car</em> (want). Gevolg: <em>donc</em> (dus), <em>alors</em> (dus/toen). Opsomming: <em>et</em> (en), <em>aussi</em> (ook). Voorbeeld: <em>par exemple</em> (bijvoorbeeld).`] },
    ],
    [
      { t: 'Skimmen', d: 'snel en globaal lezen voor de hoofdgedachte', k: 'globaal lezen', fout: ['Scannen'] },
      { t: 'Scannen', d: 'gericht zoeken naar één stukje informatie', k: 'gericht zoeken', fout: ['Skimmen'] },
      { t: 'Mais', d: 'Frans voor "maar"; geeft een tegenstelling', k: 'maar (tegenstelling)', fout: ['Parce que', 'Et'] },
      { t: 'Parce que', d: 'Frans voor "omdat"; geeft een reden', k: 'omdat (reden)', fout: ['Donc', 'Mais'] },
      { t: 'Donc', d: 'Frans voor "dus"; geeft een gevolg', k: 'dus (gevolg)', fout: ['Parce que'] },
      { t: 'Bien que', d: 'Frans voor "hoewel"; geeft een tegenstelling', k: 'hoewel (tegenstelling)', fout: ['Parce que'] },
      { t: 'Et', d: 'Frans voor "en"; een opsomming', k: 'en (opsomming)', fout: ['Mais'] },
      { t: 'Aussi', d: 'Frans voor "ook"; voegt iets toe', k: 'ook (opsomming)', fout: ['Mais'] },
      { t: 'Par exemple', d: 'Frans voor "bijvoorbeeld"; leidt een voorbeeld in', k: 'bijvoorbeeld', fout: ['Donc'] },
      { t: 'Context', d: 'de situatie eromheen die helpt woorden te raden', k: 'situatie eromheen', fout: ['Skimmen'] },
    ],
    [
      { v: "Wat betekent 'mais'?", o: ['omdat', 'maar', 'dus', 'ook'], c: 1, d: 1, uo: ['«omdat» is parce que.', 'Klopt: «mais» betekent maar en geeft een tegenstelling.', '«dus» is donc.', '«ook» is aussi.'], uh: 'Tegenstelling: mais. Reden: parce que. Gevolg: donc.' },
      { v: "Wat betekent 'parce que'?", o: ['omdat', 'maar', 'en', 'hoewel'], c: 0, d: 1, uo: ['Klopt: «parce que» betekent omdat en geeft een reden.', '«maar» is mais.', '«en» is et.', '«hoewel» is bien que.'] },
      { v: 'Welk woord geeft een gevolg aan?', o: ['parce que', 'mais', 'donc', 'et'], c: 2, d: 2, uo: ['«parce que» geeft een reden (omdat).', '«mais» is een tegenstelling (maar).', 'Klopt: «donc» betekent dus en geeft een gevolg.', '«et» is een opsomming (en).'] },
      { v: "Wat betekent 'aussi'?", o: ['maar', 'ook', 'omdat', 'dus'], c: 1, d: 2, uo: ['«maar» is mais.', 'Klopt: «aussi» betekent ook en voegt iets toe.', '«omdat» is parce que.', '«dus» is donc.'] },
      { v: 'Je zoekt gericht één prijs in een Franse folder. Wat doe je?', o: ['skimmen', 'scannen', 'alles vertalen', 'hardop lezen'], c: 1, d: 2, uo: ['Skimmen is voor de hoofdlijn.', 'Klopt: scannen is gericht zoeken naar één detail.', 'Alles vertalen kost te veel tijd.', 'Hardop lezen helpt niet bij zoeken.'] },
      { v: "Wat betekent 'par exemple'?", o: ['bijvoorbeeld', 'daarom', 'hoewel', 'omdat'], c: 0, d: 2, uo: ['Klopt: «par exemple» leidt een voorbeeld in.', '«daarom/dus» is donc.', '«hoewel» is bien que.', '«omdat» is parce que.'] },
      { v: "Wat betekent 'et'?", o: ['maar', 'en', 'omdat', 'dus'], c: 1, d: 1, uo: ['«maar» is mais.', 'Klopt: «et» betekent en (opsomming).', '«omdat» is parce que.', '«dus» is donc.'] },
      { v: "Wat betekent 'bien que'?", o: ['omdat', 'dus', 'hoewel', 'en'], c: 2, d: 3, uo: ['«omdat» is parce que.', '«dus» is donc.', 'Klopt: «bien que» betekent hoewel (tegenstelling).', '«en» is et.'] },
      { v: 'Hoe pak je de hoofdgedachte van een Franse tekst het snelst?', o: ['elk woord opzoeken', 'skimmen', 'de tekst vertalen', 'achteraan beginnen'], c: 1, d: 1, uo: ['Elk woord opzoeken kost te veel tijd.', 'Klopt: skimmen geeft snel de hoofdlijn.', 'Vertalen is traag en vaak niet nodig.', 'Achteraan beginnen helpt niet.'] },
    ]),

  V('B', 'Luister- en kijkvaardigheid',
    `Bij <strong>luisteren</strong> pak je de <strong>hoofdgedachte</strong> en gebruik je <strong>vraagwoorden</strong> als <em>qui</em> (wie), <em>où</em> (waar) en <em>pourquoi</em> (waarom).`,
    [
      { h: '1. Vraagwoorden', p: [
        `De Franse vraagwoorden: <em>qui</em> (wie), <em>que/quoi</em> (wat), <em>où</em> (waar), <em>quand</em> (wanneer), <em>pourquoi</em> (waarom), <em>comment</em> (hoe) en <em>combien</em> (hoeveel). Hoor je het vraagwoord, dan weet je waar de vraag naar zoekt.`] },
      { h: '2. Luisteren met een doel', p: [
        `Pak de <strong>hoofdgedachte</strong> en gebruik de <strong>context</strong>. Handige zinnen: <em>Pouvez-vous répéter?</em> (Kunt u herhalen?) en <em>Je ne comprends pas</em> (Ik begrijp het niet).`] },
    ],
    [
      { t: 'Qui', d: 'Frans vraagwoord voor "wie"; vraagt naar een persoon', k: 'wie (persoon)', fout: ['Où', 'Que'] },
      { t: 'Que', d: 'Frans vraagwoord voor "wat"; vraagt naar een ding', k: 'wat (ding)', fout: ['Qui'] },
      { t: 'Où', d: 'Frans vraagwoord voor "waar"; vraagt naar een plaats', k: 'waar (plaats)', fout: ['Quand', 'Qui'] },
      { t: 'Quand', d: 'Frans vraagwoord voor "wanneer"; vraagt naar een tijd', k: 'wanneer (tijd)', fout: ['Où'] },
      { t: 'Pourquoi', d: 'Frans vraagwoord voor "waarom"; vraagt naar een reden', k: 'waarom (reden)', fout: ['Comment'] },
      { t: 'Comment', d: 'Frans vraagwoord voor "hoe"; vraagt naar de manier', k: 'hoe (manier)', fout: ['Pourquoi'] },
      { t: 'Combien', d: 'Frans voor "hoeveel"; vraagt vaak naar de prijs', k: 'hoeveel (prijs)', fout: ['Comment'] },
      { t: 'Hoofdgedachte', d: 'de kern van wat de spreker bedoelt', k: 'de kern', fout: ['Context'] },
      { t: 'Context', d: 'de situatie eromheen die helpt woorden te raden', k: 'situatie eromheen', fout: ['Hoofdgedachte'] },
    ],
    [
      { v: "Wat betekent 'où'?", o: ['wie', 'waar', 'wanneer', 'waarom'], c: 1, d: 1, uo: ['«wie» is qui.', 'Klopt: «où» betekent waar (plaats).', '«wanneer» is quand.', '«waarom» is pourquoi.'], uh: 'qui=wie, que=wat, où=waar, quand=wanneer, pourquoi=waarom, comment=hoe.' },
      { v: "Wat betekent 'pourquoi'?", o: ['hoe', 'waarom', 'waar', 'wanneer'], c: 1, d: 2, uo: ['«hoe» is comment.', 'Klopt: «pourquoi» vraagt naar een reden (waarom).', '«waar» is où.', '«wanneer» is quand.'] },
      { v: "Waar vraagt 'qui' naar?", o: ['een plaats', 'een persoon', 'een tijd', 'een reden'], c: 1, d: 1, uo: ['Naar een plaats vraag je met où.', 'Klopt: «qui» vraagt naar een persoon (wie).', 'Naar een tijd vraag je met quand.', 'Naar een reden vraag je met pourquoi.'] },
      { v: "Wat betekent 'Je ne comprends pas'?", o: ['Ik begrijp het niet', 'Ik weet het al', 'Waar is het?', 'Hoe laat is het?'], c: 0, d: 2, uo: ['Klopt: je zegt dat je het niet snapt.', 'Dat zou «Je sais déjà» zijn.', 'Dat is «Où est-ce?».', 'Dat is «Quelle heure est-il?».'] },
      { v: "Waar vraagt 'quand' naar?", o: ['de plaats', 'de tijd', 'de prijs', 'de reden'], c: 1, d: 1, uo: ['De plaats vraag je met où.', 'Klopt: «quand» vraagt naar de tijd (wanneer).', 'De prijs vraag je met combien.', 'De reden vraag je met pourquoi.'] },
      { v: "Wat betekent 'comment'?", o: ['waarom', 'hoe', 'waar', 'wie'], c: 1, d: 1, uo: ['«waarom» is pourquoi.', 'Klopt: «comment» betekent hoe (de manier).', '«waar» is où.', '«wie» is qui.'] },
      { v: 'Wat doe je bij luisteren als eerste?', o: ['elk woord verstaan', 'de hoofdgedachte pakken', 'de spelling checken', 'achteraan beginnen'], c: 1, d: 2, uo: ['Elk woord verstaan lukt zelden en hoeft niet.', 'Klopt: pak eerst de hoofdgedachte.', 'Spelling speelt bij luisteren geen rol.', 'Achteraan beginnen helpt niet.'] },
      { v: "'Combien ça coûte?' vraagt naar...", o: ['de plaats', 'de prijs', 'de tijd', 'de persoon'], c: 1, d: 2, uo: ['De plaats vraag je met où.', 'Klopt: «combien» vraagt hoeveel iets kost.', 'De tijd vraag je met quand.', 'De persoon vraag je met qui.'] },
      { v: "Wat betekent 'que'?", o: ['wie', 'wat', 'waar', 'wanneer'], c: 1, d: 1, uo: ['«wie» is qui.', 'Klopt: «que» vraagt naar een ding (wat).', '«waar» is où.', '«wanneer» is quand.'] },
    ]),

  V('C', 'Gespreksvaardigheid',
    `In een gesprek gebruik je vaste <strong>beleefde uitdrukkingen</strong>: begroeten, bedanken en je verontschuldigen. Je spreekt iemand beleefd aan met <em>vous</em> en informeel met <em>tu</em>.`,
    [
      { h: '1. Begroeten en beleefdheid', p: [
        `Je begroet met <em>Bonjour</em> (of informeel <em>Salut</em>) en neemt afscheid met <em>Au revoir</em>. Vraag je hoe het gaat: <em>Comment ça va?</em> Bij een kennismaking zeg je <em>Enchanté</em> (aangenaam). Belangrijk: <em>vous</em> is beleefd, <em>tu</em> is informeel.`] },
      { h: '2. Bedanken en vragen', p: [
        `Bedanken doe je met <em>Merci</em>, en je antwoordt met <em>De rien</em> (graag gedaan). Beleefd vragen doe je met <em>s'il vous plaît</em> (alstublieft). Je verontschuldigt je met <em>Excusez-moi</em> (pardon).`] },
    ],
    [
      { t: 'Bonjour', d: 'Franse begroeting: goedendag', k: 'begroeting', fout: ['Au revoir'] },
      { t: 'Au revoir', d: 'Frans voor afscheid: tot ziens', k: 'afscheid', fout: ['Bonjour'] },
      { t: 'Salut', d: 'informele begroeting/afscheid: hoi/doei', k: 'informeel: hoi', fout: ['Bonjour'] },
      { t: 'Comment ça va', d: 'Frans voor "Hoe gaat het?"', k: 'hoe gaat het', fout: ['Enchanté'] },
      { t: 'Enchanté', d: 'zin bij een kennismaking: aangenaam', k: 'aangenaam', fout: ['Comment ça va'] },
      { t: 'Merci', d: 'Frans voor bedanken', k: 'bedankt', fout: ['De rien'] },
      { t: 'De rien', d: 'antwoord op merci: graag gedaan', k: 'graag gedaan', fout: ['Merci'] },
      { t: "S'il vous plaît", d: 'Frans voor "alstublieft"', k: 'alstublieft', fout: ['Excusez-moi'] },
      { t: 'Excusez-moi', d: 'zin om je te verontschuldigen: pardon', k: 'pardon', fout: ["S'il vous plaît"] },
      { t: 'Vous', d: 'beleefde aanspreekvorm (u); tu is informeel', k: 'beleefd: u', fout: ['Tu'] },
    ],
    [
      { v: "Wat betekent 'Merci'?", o: ['bedankt', 'sorry', 'hallo', 'tot ziens'], c: 0, d: 1, uo: ['Klopt: «Merci» betekent bedankt.', '«sorry» is Excusez-moi.', '«hallo» is Bonjour.', '«tot ziens» is Au revoir.'] },
      { v: "Iemand zegt 'Merci'. Wat antwoord je?", o: ['De rien', 'Bonjour', 'Au revoir', 'Pourquoi'], c: 0, d: 2, uo: ['Klopt: «De rien» betekent graag gedaan.', '«Bonjour» is een begroeting.', '«Au revoir» is afscheid.', '«Pourquoi» is waarom.'] },
      { v: 'Welke aanspreekvorm is beleefd (tegen een onbekende)?', o: ['tu', 'vous', 'il', 'nous'], c: 1, d: 2, uo: ['«tu» is informeel, tegen vrienden.', 'Klopt: «vous» is de beleefde vorm (u).', '«il» betekent hij.', '«nous» betekent wij.'], uh: 'vous = beleefd (u), tu = informeel (jij).' },
      { v: "Wat betekent 'Excusez-moi'?", o: ['pardon', 'bedankt', 'graag gedaan', 'aangenaam'], c: 0, d: 2, uo: ['Klopt: je verontschuldigt je (pardon).', '«bedankt» is Merci.', '«graag gedaan» is De rien.', '«aangenaam» is Enchanté.'] },
      { v: "Wanneer zeg je 'Enchanté'?", o: ['bij afscheid', 'bij een kennismaking', 'als je bedankt', 'als je boos bent'], c: 1, d: 2, uo: ['Bij afscheid zeg je Au revoir.', 'Klopt: «Enchanté» zeg je bij een kennismaking.', 'Bedanken is Merci.', 'Boosheid past hier niet.'] },
      { v: "Wat betekent 'Comment ça va?'", o: ['Hoe heet je?', 'Hoe gaat het?', 'Waar woon je?', 'Hoe laat is het?'], c: 1, d: 1, uo: ['«Hoe heet je?» is «Comment tu t\'appelles?».', 'Klopt: je vraagt hoe het gaat.', '«Waar woon je?» is «Où habites-tu?».', '«Hoe laat is het?» is «Quelle heure est-il?».'] },
      { v: 'Hoe begroet je iemand overdag?', o: ['Au revoir', 'Bonjour', 'Merci', 'De rien'], c: 1, d: 1, uo: ['«Au revoir» is afscheid.', 'Klopt: «Bonjour» is de begroeting overdag.', '«Merci» is bedanken.', '«De rien» is graag gedaan.'] },
      { v: "Wat betekent \"s'il vous plaît\"?", o: ['alstublieft', 'sorry', 'bedankt', 'tot ziens'], c: 0, d: 2, uo: ['Klopt: «s\'il vous plaît» betekent alstublieft.', '«sorry» is Excusez-moi.', '«bedankt» is Merci.', '«tot ziens» is Au revoir.'] },
      { v: "Wat betekent 'tu'?", o: ['u (beleefd)', 'jij (informeel)', 'wij', 'hij'], c: 1, d: 2, uo: ['«u (beleefd)» is vous.', 'Klopt: «tu» is de informele vorm (jij).', '«wij» is nous.', '«hij» is il.'] },
    ]),

  V('D', 'Schrijfvaardigheid en grammatica',
    `Bij <strong>schrijven</strong> let je op de <strong>lidwoorden</strong> <em>le/la/les</em>, de <strong>werkwoordsvervoeging</strong> en de <strong>ontkenning</strong> met <em>ne ... pas</em>.`,
    [
      { h: '1. Werkwoorden en lidwoorden', p: [
        `Werkwoorden op <em>-er</em> vervoeg je: <em>je parle, tu parles, il/elle parle, nous parlons, ils parlent</em>. De hulpwerkwoorden zijn <em>être</em> (zijn: je suis, tu es, il est) en <em>avoir</em> (hebben: j'ai, tu as, il a). Lidwoorden: <em>le</em> (mannelijk), <em>la</em> (vrouwelijk), <em>les</em> (meervoud).`] },
      { h: '2. Ontkenning', p: [
        `Een ontkenning maak je met <strong>ne ... pas</strong> rond het werkwoord: <em>Je ne parle pas français</em> (Ik spreek geen Frans). Beide delen horen erbij: <em>ne</em> voor en <em>pas</em> na het werkwoord.`] },
    ],
    [
      { t: 'Le', d: 'mannelijk lidwoord (de/het)', k: 'mannelijk', fout: ['La', 'Les'] },
      { t: 'La', d: 'vrouwelijk lidwoord (de/het)', k: 'vrouwelijk', fout: ['Le', 'Les'] },
      { t: 'Les', d: 'meervoudslidwoord (de)', k: 'meervoud', fout: ['Le', 'La'] },
      { t: 'Être', d: 'werkwoord "zijn": je suis, tu es, il est', k: 'zijn', fout: ['Avoir'] },
      { t: 'Avoir', d: 'werkwoord "hebben": j\'ai, tu as, il a', k: 'hebben', fout: ['Être'] },
      { t: '-er werkwoord', d: 'werkwoord op -er: je parle, tu parles, il parle', k: 'regelmatig -er', fout: ['Être'] },
      { t: 'Ne ... pas', d: 'de ontkenning rond het werkwoord (niet/geen)', k: 'ontkenning', fout: ['Avoir'] },
      { t: 'Werkwoordsuitgang', d: 'de uitgang die past bij het onderwerp (parle, parles, parlons)', k: 'uitgang bij onderwerp', fout: ['Être'] },
    ],
    [
      { v: "Kies de juiste vorm: 'Je ___ français.'", o: ['parles', 'parle', 'parlons', 'parlent'], c: 1, d: 2, uo: ['«parles» hoort bij tu.', 'Klopt: bij je is de uitgang -e: je parle.', '«parlons» hoort bij nous.', '«parlent» hoort bij ils/elles.'], uh: 'je -e, tu -es, il/elle -e, nous -ons, ils/elles -ent.' },
      { v: "Kies de juiste vorm: 'Tu ___ un livre.' (avoir)", o: ['as', 'ai', 'a', 'ont'], c: 0, d: 2, uo: ['Klopt: bij tu hoort «as».', '«ai» hoort bij je (j\'ai).', '«a» hoort bij il/elle.', '«ont» hoort bij ils/elles.'] },
      { v: 'Welk lidwoord is meervoud (de)?', o: ['le', 'la', 'les', 'un'], c: 2, d: 2, uo: ['«le» is mannelijk enkelvoud.', '«la» is vrouwelijk enkelvoud.', 'Klopt: «les» is het meervoudslidwoord.', '«un» is onbepaald (een).'], uh: 'le (mannelijk), la (vrouwelijk), les (meervoud).' },
      { v: "Hoe maak je 'Je parle' ontkennend?", o: ['Je parle non', 'Je ne parle pas', 'Je pas parle', 'Non je parle'], c: 1, d: 3, uo: ['«non» los erbij is geen correcte ontkenning.', 'Klopt: ne voor en pas na het werkwoord: je ne parle pas.', '«pas» moet na het werkwoord, niet ervoor alleen.', '«non» vooraan ontkent de zin niet correct.'], uh: 'Ontkenning: ne + werkwoord + pas (je ne ... pas).' },
      { v: "Kies de juiste vorm: 'Il ___ à la maison.' (être)", o: ['suis', 'es', 'est', 'sont'], c: 2, d: 2, uo: ['«suis» hoort bij je.', '«es» hoort bij tu.', 'Klopt: bij il hoort «est».', '«sont» hoort bij ils/elles.'] },
      { v: "Kies de juiste vorm: 'Nous ___ français.'", o: ['parle', 'parles', 'parlons', 'parlent'], c: 2, d: 2, uo: ['«parle» hoort bij je/il.', '«parles» hoort bij tu.', 'Klopt: bij nous is de uitgang -ons: parlons.', '«parlent» hoort bij ils/elles.'] },
      { v: "Kies de juiste vorm: 'J\'___ un chien.' (avoir)", o: ['ai', 'as', 'a', 'avons'], c: 0, d: 2, uo: ['Klopt: bij je hoort «ai» (j\'ai).', '«as» hoort bij tu.', '«a» hoort bij il/elle.', '«avons» hoort bij nous.'] },
      { v: 'Welk lidwoord hoort bij een vrouwelijk woord?', o: ['le', 'la', 'les', 'un'], c: 1, d: 2, uo: ['«le» is mannelijk.', 'Klopt: «la» is het vrouwelijke lidwoord.', '«les» is meervoud.', '«un» is onbepaald mannelijk.'] },
    ]),
];
