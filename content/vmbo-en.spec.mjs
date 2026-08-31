// VMBO GL/TL - Engels. Gouden-stijl contentspec.
// Talen: woordenschat, grammatica en lees-/luister-/gespreksstrategie, met
// per-optie-uitleg die vertelt wat de foute optie WEL betekent of waarom een
// vorm fout is (niet enkel "Nee.").
const V = (domein, naam, intro, secties, concepten, vragen) => ({ niveau: 'vmbo', vak: 'en', domein, naam, intro, secties, concepten, vragen });

export default [
  V('A', 'Leesvaardigheid',
    `Bij <strong>leesvaardigheid</strong> gebruik je strategieën als <strong>skimmen</strong> (globaal lezen) en <strong>scannen</strong> (gericht zoeken). <strong>Signaalwoorden</strong> (connectors) zoals <em>but</em>, <em>because</em> en <em>therefore</em> laten zien hoe zinnen samenhangen.`,
    [
      { h: '1. Leesstrategieën', p: [
        `Je leest een tekst niet altijd woord voor woord. Met <strong>skimmen</strong> lees je snel en globaal om de hoofdgedachte te pakken. Met <strong>scannen</strong> zoek je gericht naar één ding, bijvoorbeeld een naam of datum. Bij <strong>intensief lezen</strong> lees je nauwkeurig omdat elk detail telt. De <strong>kernzin</strong> geeft de hoofdgedachte van een alinea en staat vaak vooraan of achteraan.`] },
      { h: '2. Signaalwoorden (connectors)', p: [
        `<strong>Signaalwoorden</strong> verbinden zinnen en verraden het verband. Een <strong>tegenstelling</strong>: <em>but</em> (maar), <em>however</em> (echter), <em>although</em> (hoewel). Een <strong>reden</strong>: <em>because</em> (omdat). Een <strong>gevolg</strong>: <em>so</em> (dus), <em>therefore</em> (daarom). Een <strong>opsomming</strong>: <em>and</em>, <em>moreover</em> (bovendien). Een <strong>voorbeeld</strong>: <em>for example</em> (bijvoorbeeld). Herken je het signaalwoord, dan snap je vaak de zin zonder alles te vertalen.`] },
    ],
    [
      { t: 'Skimmen', d: 'snel en globaal lezen om de hoofdgedachte te pakken', k: 'globaal lezen', fout: ['Scannen', 'Intensief lezen'] },
      { t: 'Scannen', d: 'gericht zoeken naar één stukje informatie', k: 'gericht zoeken', fout: ['Skimmen'] },
      { t: 'Intensief lezen', d: 'nauwkeurig lezen omdat elk detail telt', k: 'nauwkeurig lezen', fout: ['Skimmen'] },
      { t: 'Kernzin', d: 'de zin met de hoofdgedachte van een alinea', k: 'hoofdgedachte van de alinea', fout: ['Signaalwoord'] },
      { t: 'But', d: 'Engels voor "maar"; geeft een tegenstelling aan', k: 'maar (tegenstelling)', fout: ['Because', 'So'] },
      { t: 'However', d: 'Engels voor "echter"; geeft een tegenstelling aan', k: 'echter (tegenstelling)', fout: ['Therefore', 'Because'] },
      { t: 'Although', d: 'Engels voor "hoewel"; geeft een tegenstelling aan', k: 'hoewel (tegenstelling)', fout: ['Because'] },
      { t: 'Because', d: 'Engels voor "omdat"; geeft een reden aan', k: 'omdat (reden)', fout: ['So', 'But'] },
      { t: 'Therefore', d: 'Engels voor "daarom"; geeft een gevolg aan', k: 'daarom (gevolg)', fout: ['Because', 'However'] },
      { t: 'For example', d: 'Engels voor "bijvoorbeeld"; leidt een voorbeeld in', k: 'bijvoorbeeld (voorbeeld)', fout: ['However'] },
      { t: 'Moreover', d: 'Engels voor "bovendien"; voegt iets toe', k: 'bovendien (opsomming)', fout: ['However'] },
      { t: 'While', d: 'Engels voor "terwijl"; geeft gelijktijdigheid aan', k: 'terwijl (tijd)', fout: ['Although'] },
    ],
    [
      { v: 'Welk woord geeft een tegenstelling aan?', o: ['because', 'however', 'and', 'so'], c: 1, d: 2, uo: ['«because» betekent omdat: dat is een reden, geen tegenstelling.', 'Klopt: «however» betekent echter en zet een tegenstelling neer.', '«and» is een opsomming (en), geen tegenstelling.', '«so» betekent dus: dat is een gevolg.'], uh: 'Tegenstelling: but, however, although. Reden: because. Gevolg: so, therefore.' },
      { v: "Wat betekent 'although' in 'Although it was late, she kept working'?", o: ['omdat', 'hoewel', 'daarom', 'totdat'], c: 1, d: 2, uo: ['«omdat» zou een reden zijn; «although» geeft juist een tegenstelling.', 'Klopt: «although» betekent hoewel, ondanks dat het laat was.', '«daarom» is een gevolg (therefore), niet de betekenis hier.', '«totdat» is until; dat past niet.'] },
      { v: "Wat betekent het signaalwoord 'therefore'?", o: ['een reden', 'een gevolg', 'een voorbeeld', 'een tegenstelling'], c: 1, d: 2, uo: ['Een reden wordt ingeleid met because (omdat).', 'Klopt: «therefore» (daarom) geeft een gevolg aan.', 'Een voorbeeld leid je in met for example.', 'Een tegenstelling is but of however.'] },
      { v: 'Je zoekt snel één datum in een tekst. Welke strategie gebruik je?', o: ['Skimmen', 'Scannen', 'Intensief lezen', 'Alles vertalen'], c: 1, d: 2, uo: ['Skimmen is voor de hoofdlijn, niet voor één detail.', 'Klopt: scannen is gericht zoeken naar één stukje informatie.', 'Intensief lezen kost veel tijd en is hier niet nodig.', 'Alles vertalen is traag en onnodig voor één datum.'] },
      { v: "Wat betekent 'because'?", o: ['omdat', 'maar', 'bijvoorbeeld', 'daarna'], c: 0, d: 1, uo: ['Klopt: «because» betekent omdat en geeft een reden.', '«maar» is but (tegenstelling).', '«bijvoorbeeld» is for example.', '«daarna» is after that.'] },
      { v: 'Welk woord leidt een voorbeeld in?', o: ['however', 'for example', 'because', 'but'], c: 1, d: 2, uo: ['«however» is een tegenstelling (echter).', 'Klopt: «for example» leidt een voorbeeld in.', '«because» geeft een reden (omdat).', '«but» is een tegenstelling (maar).'] },
      { v: 'Wat doet de kernzin van een alinea?', o: ['Hij geeft altijd een voorbeeld', 'Hij geeft de hoofdgedachte', 'Hij staat altijd in de titel', 'Hij noemt de schrijver'], c: 1, d: 2, uo: ['Een voorbeeld is een detail, niet de kernzin.', 'Klopt: de kernzin bevat de hoofdgedachte van de alinea.', 'De titel staat los van de alinea; de kernzin staat erin.', 'De schrijver noemen doet de kernzin niet.'] },
      { v: "Wat betekent 'moreover'?", o: ['bovendien', 'echter', 'omdat', 'hoewel'], c: 0, d: 2, uo: ['Klopt: «moreover» betekent bovendien en voegt iets toe.', '«echter» is however (tegenstelling).', '«omdat» is because (reden).', '«hoewel» is although (tegenstelling).'] },
      { v: 'Hoe pak je de hoofdgedachte van een tekst het snelst?', o: ['Elk woord opzoeken', 'Skimmen', 'De tekst vertalen', 'Achteraan beginnen'], c: 1, d: 1, uo: ['Elk woord opzoeken kost veel te veel tijd.', 'Klopt: skimmen geeft snel de hoofdlijn.', 'Vertalen is traag en vaak niet nodig.', 'Achteraan beginnen helpt niet voor het overzicht.'] },
      { v: "Wat betekent 'while' in 'She read while he cooked'?", o: ['nadat', 'terwijl', 'omdat', 'hoewel'], c: 1, d: 2, uo: ['«nadat» is after; de dingen gebeuren hier tegelijk.', 'Klopt: «while» betekent terwijl, op hetzelfde moment.', '«omdat» is because (reden).', '«hoewel» is although (tegenstelling).'] },
    ]),

  V('B', 'Luister- en kijkvaardigheid',
    `Bij <strong>luisteren</strong> pak je eerst de <strong>hoofdgedachte</strong> en laat je losse onbekende woorden los. <strong>Vraagwoorden</strong> zoals <em>who</em>, <em>where</em> en <em>why</em> vertellen waar een vraag naar zoekt.`,
    [
      { h: '1. Vraagwoorden herkennen', p: [
        `Vraagwoorden sturen het antwoord: <em>who</em> (wie), <em>what</em> (wat), <em>where</em> (waar), <em>when</em> (wanneer), <em>why</em> (waarom), <em>how</em> (hoe) en <em>how much</em> (hoeveel). Hoor je het vraagwoord, dan weet je meteen of het om een persoon, plaats, tijd, reden of prijs gaat.`] },
      { h: '2. Luisteren met een doel', p: [
        `Je hoeft niet elk woord te verstaan. Pak eerst de <strong>hoofdgedachte</strong> en gebruik de <strong>context</strong> om onbekende woorden te raden. Handige zinnen zijn <em>Could you repeat that?</em> (Kun je dat herhalen?) en <em>I don't understand</em> (Ik begrijp het niet).`] },
    ],
    [
      { t: 'Who', d: 'Engels vraagwoord voor "wie"; vraagt naar een persoon', k: 'wie (persoon)', fout: ['What', 'Where'] },
      { t: 'What', d: 'Engels vraagwoord voor "wat"; vraagt naar een ding', k: 'wat (ding)', fout: ['Who'] },
      { t: 'Where', d: 'Engels vraagwoord voor "waar"; vraagt naar een plaats', k: 'waar (plaats)', fout: ['When', 'Why'] },
      { t: 'When', d: 'Engels vraagwoord voor "wanneer"; vraagt naar een tijd', k: 'wanneer (tijd)', fout: ['Where'] },
      { t: 'Why', d: 'Engels vraagwoord voor "waarom"; vraagt naar een reden', k: 'waarom (reden)', fout: ['How'] },
      { t: 'How', d: 'Engels vraagwoord voor "hoe"; vraagt naar de manier', k: 'hoe (manier)', fout: ['Why'] },
      { t: 'How much', d: 'Engels voor "hoeveel"; vraagt vaak naar de prijs', k: 'hoeveel (prijs)', fout: ['How'] },
      { t: 'Hoofdgedachte', d: 'de kern van wat de spreker bedoelt', k: 'de kern van het verhaal', fout: ['Context'] },
      { t: 'Context', d: 'de situatie eromheen die helpt woorden te raden', k: 'situatie eromheen', fout: ['Hoofdgedachte'] },
      { t: 'Repeat', d: 'Engels voor "herhalen"', k: 'herhalen', fout: ['Understand'] },
      { t: 'Understand', d: 'Engels voor "begrijpen"', k: 'begrijpen', fout: ['Repeat'] },
    ],
    [
      { v: "Wat betekent 'where'?", o: ['wanneer', 'waar', 'waarom', 'wie'], c: 1, d: 1, uo: ['«wanneer» is when.', 'Klopt: «where» vraagt naar een plaats (waar).', '«waarom» is why.', '«wie» is who.'], uh: 'Vraagwoorden: who=wie, what=wat, where=waar, when=wanneer, why=waarom, how=hoe.' },
      { v: "Iemand vraagt 'How much is it?'. Waar gaat de vraag over?", o: ['de tijd', 'de prijs', 'de plaats', 'de reden'], c: 1, d: 2, uo: ['Naar de tijd vraag je met when.', 'Klopt: «how much» vraagt hier naar de prijs.', 'Naar de plaats vraag je met where.', 'Naar de reden vraag je met why.'] },
      { v: "Waar vraagt 'why' naar?", o: ['een plaats', 'een reden', 'een tijd', 'een persoon'], c: 1, d: 1, uo: ['Naar een plaats vraag je met where.', 'Klopt: «why» vraagt naar een reden (waarom).', 'Naar een tijd vraag je met when.', 'Naar een persoon vraag je met who.'] },
      { v: "Wat betekent 'Could you repeat that?'", o: ['Kun je dat herhalen?', 'Waar is het?', 'Hoe laat is het?', 'Wat kost het?'], c: 0, d: 2, uo: ['Klopt: je vraagt of iemand het nog eens zegt.', 'Dat zou «Where is it?» zijn.', 'Dat is «What time is it?».', 'Dat is «How much is it?».'] },
      { v: "Waar vraagt 'When does the film start?' naar?", o: ['de plaats', 'het tijdstip', 'de prijs', 'de reden'], c: 1, d: 2, uo: ['De plaats vraag je met where.', 'Klopt: «when» vraagt naar het tijdstip.', 'De prijs vraag je met how much.', 'De reden vraag je met why.'] },
      { v: "Wat betekent 'who'?", o: ['wat', 'wie', 'waar', 'hoe'], c: 1, d: 1, uo: ['«wat» is what.', 'Klopt: «who» vraagt naar een persoon (wie).', '«waar» is where.', '«hoe» is how.'] },
      { v: 'Wat doe je bij luisteren als eerste?', o: ['Elk woord verstaan', 'De hoofdgedachte pakken', 'De laatste zin onthouden', 'De spelling controleren'], c: 1, d: 2, uo: ['Elk woord verstaan lukt bijna nooit en is niet nodig.', 'Klopt: pak eerst de hoofdgedachte, raad de rest.', 'Alleen de laatste zin mist het geheel.', 'Spelling speelt bij luisteren geen rol.'] },
      { v: "Waar vraagt 'how' naar?", o: ['de manier', 'de plaats', 'de persoon', 'de prijs'], c: 0, d: 1, uo: ['Klopt: «how» vraagt naar de manier (hoe).', 'De plaats vraag je met where.', 'De persoon vraag je met who.', 'De prijs vraag je met how much.'] },
      { v: "Wat betekent 'I don't understand'?", o: ['Ik begrijp het niet', 'Ik ben het eens', 'Ik weet het al', 'Ik hoor je goed'], c: 0, d: 2, uo: ['Klopt: je zegt dat je het niet snapt.', '«Eens zijn» is «I agree».', 'Dat zou «I already know» zijn.', 'Dat zou «I can hear you» zijn.'] },
      { v: "Waar vraagt 'What time is it?' naar?", o: ['de plaats', 'de tijd', 'de prijs', 'de reden'], c: 1, d: 1, uo: ['De plaats vraag je met where.', 'Klopt: je vraagt hoe laat het is (de tijd).', 'De prijs vraag je met how much.', 'De reden vraag je met why.'] },
    ]),

  V('C', 'Gespreksvaardigheid',
    `In een gesprek gebruik je vaste <strong>beleefde uitdrukkingen</strong>: begroeten, bedanken, iets vragen en je verontschuldigen. Een beleefd verzoek begint vaak met <em>Could</em>, <em>May</em> of <em>Would</em>.`,
    [
      { h: '1. Begroeten en afscheid', p: [
        `Je begroet met <em>Hello</em> of <em>Good morning</em> en neemt afscheid met <em>Goodbye</em> of <em>See you later</em>. Bij een eerste kennismaking zeg je <em>Nice to meet you</em>. Vraag je hoe het gaat, dan zeg je <em>How are you?</em>`] },
      { h: '2. Beleefd vragen en reageren', p: [
        `Een beleefd verzoek maak je met <em>Could you...?</em>, <em>May I...?</em> of <em>Would you like...?</em>; na deze woorden komt het hele werkwoord zonder -s (<em>Could you help me?</em>). Bedanken doe je met <em>Thank you</em>, en je antwoordt met <em>You're welcome</em>. Je verontschuldigt je met <em>I'm sorry</em> en vraagt de aandacht met <em>Excuse me</em>.`] },
    ],
    [
      { t: 'Hello', d: 'Engelse begroeting: hallo', k: 'begroeting', fout: ['Goodbye'] },
      { t: 'Goodbye', d: 'Engels voor afscheid: tot ziens', k: 'afscheid', fout: ['Hello'] },
      { t: 'Nice to meet you', d: 'zin bij een eerste kennismaking', k: 'bij kennismaking', fout: ['Goodbye'] },
      { t: 'How are you', d: 'Engels voor "Hoe gaat het?"', k: 'hoe gaat het', fout: ['How old are you'] },
      { t: 'Excuse me', d: 'zin om de aandacht te vragen', k: 'aandacht vragen', fout: ["I'm sorry"] },
      { t: "I'm sorry", d: 'zin om je te verontschuldigen', k: 'sorry zeggen', fout: ['Excuse me'] },
      { t: 'Thank you', d: 'Engels voor bedanken', k: 'bedanken', fout: ["You're welcome"] },
      { t: "You're welcome", d: 'antwoord op bedankt: graag gedaan', k: 'graag gedaan', fout: ['Thank you'] },
      { t: 'Could you', d: 'beleefd begin van een verzoek; daarna het hele werkwoord', k: 'beleefd verzoek', fout: ['May I'] },
      { t: 'May I', d: 'beleefd om toestemming vragen', k: 'mag ik', fout: ['Could you'] },
    ],
    [
      { v: "Kies de juiste vorm: 'Could you ___ me, please?'", o: ['help', 'helping', 'helped', 'to help'], c: 0, d: 2, uo: ['Klopt: na «could» komt het hele werkwoord zonder -ing of -ed.', '«helping» kan niet na could.', '«helped» is verleden tijd en past niet na could.', '«to help» is fout; could pakt het kale werkwoord.'], uh: 'Na could/may/would komt het hele werkwoord zonder -s, -ing of to.' },
      { v: 'Wat zeg je als je ergens binnenkomt?', o: ['Goodbye', 'Hello', 'Sorry', 'Thanks'], c: 1, d: 1, uo: ['«Goodbye» zeg je juist bij weggaan.', 'Klopt: «Hello» is een begroeting.', '«Sorry» is een verontschuldiging.', '«Thanks» is bedanken.'] },
      { v: "Waarvoor gebruik je 'Excuse me'?", o: ['om te bedanken', 'om de aandacht te vragen', 'om afscheid te nemen', 'om te feliciteren'], c: 1, d: 2, uo: ['Bedanken is «Thank you».', 'Klopt: «Excuse me» vraagt beleefd de aandacht.', 'Afscheid is «Goodbye».', 'Feliciteren is «Congratulations».'] },
      { v: "Iemand bedankt je. Wat antwoord je?", o: ["You're welcome", 'Please', 'Sorry', 'Hello'], c: 0, d: 2, uo: ['Klopt: «You\'re welcome» betekent graag gedaan.', '«Please» is alsjeblieft bij een verzoek.', '«Sorry» is een verontschuldiging.', '«Hello» is een begroeting.'] },
      { v: "Beleefd vragen: '___ I have a coffee, please?'", o: ['May', 'Must', 'Should', 'Will'], c: 0, d: 3, uo: ['Klopt: «May I» vraagt beleefd om toestemming.', '«Must» betekent moeten; dat is geen beleefd verzoek.', '«Should» betekent zou moeten (advies).', '«Will» is toekomst, geen beleefd verzoek.'] },
      { v: "Wat betekent 'How are you?'", o: ['Hoe heet je?', 'Hoe gaat het?', 'Hoe oud ben je?', 'Waar woon je?'], c: 1, d: 1, uo: ['«Hoe heet je?» is «What is your name?».', 'Klopt: je vraagt hoe het met iemand gaat.', '«Hoe oud ben je?» is «How old are you?».', '«Waar woon je?» is «Where do you live?».'] },
      { v: 'Hoe verontschuldig je je?', o: ["I'm sorry", 'Thank you', 'Well done', 'See you'], c: 0, d: 1, uo: ['Klopt: «I\'m sorry» is sorry zeggen.', '«Thank you» is bedanken.', '«Well done» is een compliment.', '«See you» is afscheid nemen.'] },
      { v: 'Hoe neem je afscheid?', o: ['Good morning', 'See you later', 'Nice to meet you', 'Here you are'], c: 1, d: 1, uo: ['«Good morning» is een begroeting.', 'Klopt: «See you later» is afscheid nemen.', '«Nice to meet you» zeg je bij kennismaking.', '«Here you are» zeg je bij aangeven.'] },
      { v: "Wanneer zeg je 'Nice to meet you'?", o: ['bij een eerste kennismaking', 'bij afscheid', 'als je boos bent', 'als je bedankt'], c: 0, d: 2, uo: ['Klopt: je zegt het als je iemand voor het eerst ontmoet.', 'Bij afscheid zeg je goodbye.', 'Boosheid past hier niet.', 'Bedanken is thank you.'] },
    ]),

  V('D', 'Schrijfvaardigheid en grammatica',
    `Bij <strong>schrijven</strong> let je op de juiste <strong>werkwoordsvorm</strong> en <strong>woordvolgorde</strong>. In de <em>present simple</em> krijgt hij/zij/het een <strong>-s</strong>; de vaste volgorde is onderwerp + werkwoord + rest.`,
    [
      { h: '1. Werkwoordstijden', p: [
        `De <strong>present simple</strong> gebruik je voor gewoontes: <em>I play, she plays</em> (bij he/she/it een -s). De <strong>present continuous</strong> is voor nu bezig: <em>am/is/are + werkwoord-ing</em> (<em>They are playing</em>). De <strong>past simple</strong> is verleden tijd: bij regelmatige werkwoorden -ed (<em>watched</em>), maar veel werkwoorden zijn onregelmatig (<em>go - went</em>).`] },
      { h: '2. Woordvolgorde en lidwoorden', p: [
        `Engels heeft een vaste volgorde: <strong>onderwerp + werkwoord + lijdend voorwerp</strong> (<em>I like football</em>), met bepalingen daarachter (<em>I like football very much</em>). Het lidwoord is <em>a</em> voor een medeklinkerklank en <em>an</em> voor een klinkerklank (<em>an apple</em>). Bij ontkenning gebruik je <em>do/does not</em>: <em>He does not like coffee</em>.`] },
    ],
    [
      { t: 'Present simple', d: 'tijd voor gewoontes; he/she/it krijgt een -s', k: 'gewoontes, -s bij hij/zij', fout: ['Present continuous', 'Past simple'] },
      { t: 'Present continuous', d: 'tijd voor iets dat nu bezig is: am/is/are + -ing', k: 'nu bezig, -ing', fout: ['Present simple'] },
      { t: 'Past simple', d: 'verleden tijd; regelmatig -ed, vaak onregelmatig', k: 'verleden tijd', fout: ['Present simple'] },
      { t: 'A', d: 'onbepaald lidwoord voor een medeklinkerklank', k: 'voor medeklinkerklank', fout: ['An'] },
      { t: 'An', d: 'onbepaald lidwoord voor een klinkerklank', k: 'voor klinkerklank', fout: ['A'] },
      { t: 'Woordvolgorde', d: 'de vaste volgorde onderwerp + werkwoord + rest', k: 'onderwerp-werkwoord-rest', fout: ['Present simple'] },
      { t: 'Meervoud', d: 'de vorm voor meer dan één; vaak -s, soms onregelmatig', k: 'meestal -s', fout: ['Present simple'] },
      { t: 'Do not', d: 'ontkenning in de present simple: do/does not', k: 'ontkenning', fout: ['Present continuous'] },
    ],
    [
      { v: "Kies de juiste vorm: 'She ___ to school every day.'", o: ['go', 'goes', 'going', 'gone'], c: 1, d: 2, uo: ['«go» mist de -s bij she in de present simple.', 'Klopt: bij he/she/it krijgt het werkwoord -s: goes.', '«going» heeft am/is/are nodig en past niet.', '«gone» is een voltooid deelwoord, niet deze tijd.'], uh: 'Present simple: he/she/it + werkwoord + -s (she goes, he plays).' },
      { v: "Kies de juiste vorm: 'They ___ football right now.'", o: ['play', 'plays', 'are playing', 'played'], c: 2, d: 2, uo: ['«play» is een gewoonte, niet "nu bezig".', '«plays» hoort bij he/she/it, niet bij they.', 'Klopt: "right now" vraagt de present continuous: are playing.', '«played» is verleden tijd.'], uh: 'Nu bezig = present continuous: am/is/are + werkwoord-ing.' },
      { v: "Verleden tijd: 'Yesterday I ___ a film.'", o: ['watch', 'watched', 'watching', 'watches'], c: 1, d: 2, uo: ['«watch» is tegenwoordige tijd.', 'Klopt: "yesterday" vraagt de verleden tijd: watched.', '«watching» heeft een hulpwerkwoord nodig.', '«watches» is present simple bij he/she/it.'] },
      { v: "Kies het juiste lidwoord: '___ apple'", o: ['a', 'an', 'the one', 'many'], c: 1, d: 2, uo: ['«a» gebruik je voor een medeklinkerklank; apple begint met een klinker.', 'Klopt: voor een klinkerklank gebruik je «an»: an apple.', '«the one» is geen onbepaald lidwoord.', '«many» betekent veel, geen lidwoord voor één appel.'], uh: 'a voor medeklinkerklank, an voor klinkerklank (a book, an apple).' },
      { v: "Wat is het meervoud van 'child'?", o: ['childs', 'children', 'childes', 'child'], c: 1, d: 2, uo: ['«childs» bestaat niet; child is onregelmatig.', 'Klopt: het meervoud van child is children.', '«childes» bestaat niet.', '«child» is enkelvoud.'] },
      { v: 'Welke zin heeft de juiste woordvolgorde?', o: ['I like very much football', 'I like football very much', 'Football I like very much', 'Very much I like football'], c: 1, d: 3, uo: ['De bepaling "very much" hoort niet tussen werkwoord en voorwerp.', 'Klopt: onderwerp + werkwoord + voorwerp, daarna de bepaling.', 'Het voorwerp hoort niet vooraan.', 'De bepaling hoort niet vooraan.'], uh: 'Vaste volgorde: onderwerp + werkwoord + voorwerp + rest.' },
      { v: "Kies de juiste vorm: 'He ___ not like coffee.'", o: ['do', 'does', 'is', 'are'], c: 1, d: 2, uo: ['«do not» hoort bij I/you/we/they, niet bij he.', 'Klopt: bij he/she/it gebruik je "does not".', '«is» hoort bij de -ing-vorm, niet bij like.', '«are» hoort bij you/we/they.'] },
      { v: "Kies de juiste vorm: 'There ___ two books on the table.'", o: ['is', 'are', 'am', 'be'], c: 1, d: 2, uo: ['«is» hoort bij enkelvoud; twee boeken is meervoud.', 'Klopt: bij meervoud (two books) gebruik je "are".', '«am» hoort alleen bij I.', '«be» is de basisvorm en past hier niet.'] },
      { v: "Wat is de verleden tijd van 'go'?", o: ['goed', 'went', 'gone', 'goes'], c: 1, d: 2, uo: ['«goed» bestaat niet; go is onregelmatig.', 'Klopt: de verleden tijd van go is went.', '«gone» is het voltooid deelwoord (have gone).', '«goes» is present simple bij he/she/it.'] },
    ]),
];
