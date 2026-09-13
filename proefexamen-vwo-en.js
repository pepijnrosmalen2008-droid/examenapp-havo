// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-en.js  ORIGINEEL Slagio-proefexamen (vwo Engels).
// Eigen Engelse tekst, vragen en figuren. Geen reproductie van een CvTE-examen.
// VWO-CE-niveau leesvaardigheid: main idea, functie alinea, woordbetekenis
// in context, verwijswoord, attitude/toon en gap-fit. Vragen in het
// Nederlands (zoals op het CE); de tekst is volledig door Slagio geschreven.
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

var _VENAFB = {
  // Engelse tekst als artikelkaart
  article:`<svg viewBox="0 0 360 204" role="img" aria-label="english article excerpt"><rect x="14" y="10" width="332" height="186" rx="6" fill="#ffffff" stroke="#d7dde6" stroke-width="1.4"/>
    <text x="30" y="34" font-family="Georgia,serif" font-size="13.5" font-weight="800" fill="#1b2230">Should we bring the mammoth back?</text>
    <text x="30" y="49" font-family="sans-serif" font-size="8" font-style="italic" fill="#8a94a3">the promise and peril of de-extinction</text>
    <line x1="30" y1="57" x2="330" y2="57" stroke="#eef1f5" stroke-width="1.4"/>
    <g font-family="Georgia,serif" font-size="8.5" fill="#3a4250">
      <text x="30" y="74">(1) For the first time in history, scientists claim they could</text>
      <text x="30" y="88">revive a species that vanished thousands of years ago. By</text>
      <text x="30" y="102">editing elephant DNA, they hope to create a creature much</text>
      <text x="30" y="116">like the woolly mammoth and release it onto the tundra.</text>
      <text x="30" y="134">(2) Supporters call it a triumph. Critics, however, are far</text>
      <text x="30" y="148">less enthusiastic. They argue that the money would be</text>
      <text x="30" y="162">better spent protecting the species we still have, rather</text>
      <text x="30" y="176">than resurrecting one we lost. The debate is only beginning.</text>
    </g></svg>`,
  // Structuur / betooglijn schema
  structure:`<svg viewBox="0 0 360 180" role="img" aria-label="structure of the argument">
    <g font-family="sans-serif">
      <rect x="30" y="16" width="140" height="46" rx="6" fill="#eafaf0" stroke="#2e9e5b" stroke-width="1.6"/><text x="100" y="34" font-size="9" font-weight="800" fill="#1b7a41" text-anchor="middle">the case FOR</text><text x="100" y="47" font-size="7" fill="#4a5568" text-anchor="middle">restore ecosystems,</text><text x="100" y="56" font-size="7" fill="#4a5568" text-anchor="middle">undo human damage</text>
      <rect x="190" y="16" width="140" height="46" rx="6" fill="#fbeaea" stroke="#c0392b" stroke-width="1.6"/><text x="260" y="34" font-size="9" font-weight="800" fill="#9e2b22" text-anchor="middle">the case AGAINST</text><text x="260" y="47" font-size="7" fill="#4a5568" text-anchor="middle">cost, animal welfare,</text><text x="260" y="56" font-size="7" fill="#4a5568" text-anchor="middle">unknown risks</text>
      <rect x="96" y="92" width="168" height="40" rx="6" fill="#eef4ff" stroke="#2563eb" stroke-width="1.6"/><text x="180" y="110" font-size="9" font-weight="800" fill="#1b4fb0" text-anchor="middle">author: cautious</text><text x="180" y="123" font-size="7.5" fill="#4a5568" text-anchor="middle">"the debate is only beginning"</text>
    </g>
    <g stroke="#94a0b8" stroke-width="1.4"><line x1="100" y1="62" x2="150" y2="92"/><line x1="260" y1="62" x2="210" y2="92"/></g>
    <text x="180" y="164" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figure: two sides and the author's stance</text></svg>`,
  // Toon / register schaal
  tone:`<svg viewBox="0 0 360 150" role="img" aria-label="tone and attitude scale">
    <text x="180" y="26" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">the author's attitude</text>
    <line x1="40" y1="80" x2="320" y2="80" stroke="#1b2230" stroke-width="2"/>
    <g stroke="#1b2230" stroke-width="1.4"><line x1="40" y1="74" x2="40" y2="86"/><line x1="180" y1="74" x2="180" y2="86"/><line x1="320" y1="74" x2="320" y2="86"/></g>
    <g font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="middle"><text x="40" y="100">enthusiastic</text><text x="180" y="100">balanced /</text><text x="180" y="110">cautious</text><text x="320" y="100">dismissive</text></g>
    <circle cx="180" cy="80" r="6" fill="#2563eb"/><text x="180" y="62" font-family="sans-serif" font-size="8" font-weight="700" fill="#2563eb" text-anchor="middle">author here</text>
    <text x="180" y="138" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figure: where the author stands on the issue</text></svg>`,
};

SLAGIO_EXAMENS.vwo.en = {
  origineel: true,
  titel: 'Engels',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 150,
  max_punten: 16,
  bron: 'Slagio origineel · examenstijl (eigen Engelse tekst)',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Reading: "Should we bring the mammoth back?"',
      context:'Read the text. Paragraph 1: Scientists claim that, for the first time, they could revive a species that went extinct thousands of years ago, by editing elephant DNA to create a mammoth-like animal for the tundra. Paragraph 2: Supporters call it a triumph, but critics are far less enthusiastic and argue the money would be better spent protecting species we still have. Paragraph 3: Bringing back a mammoth could help restore the tundra ecosystem, supporters say, because large grazers keep the soil frozen. Paragraph 4: Critics reply that the animal would be a lonely hybrid raised without a herd to teach it, and that no one can predict how it would behave in the wild. Paragraph 5: "The debate," the author concludes, "is only beginning."',
      afb:_VENAFB.article, afb_cap:'the opening paragraphs of the text' },
    { nr:2, titel:'The structure of the argument',
      context:'The schema below summarises the two sides of the debate and the position the author takes.',
      afb:_VENAFB.structure, afb_cap:'the two sides and the author\'s stance' },
    { nr:3, titel:'The author\'s attitude',
      context:'The scale below represents possible attitudes an author can take towards a topic.',
      afb:_VENAFB.tone, afb_cap:'where the author stands on the issue' },
    { nr:4, titel:'Language in context',
      context:'The following questions focus on the meaning of specific words and sentences in the text.',
      afb:_VENAFB.article, afb_cap:'the text, for the language questions' },
  ],
  vragen: [
    // Opgave 1
    { nr:1, opgave:1, punten:2, type:'open', domein:'Main idea',
      vraag:'Wat is de hoofdgedachte (main idea) van de tekst? Formuleer je antwoord in het Nederlands in een volzin.',
      antwoord:'De hoofdgedachte is dat wetenschappers voor het eerst een uitgestorven soort (de mammoet) tot leven zouden kunnen wekken, maar dat hierover een fel debat woedt tussen voorstanders, die het een doorbraak vinden, en critici, die het geld liever besteden aan het beschermen van nog bestaande soorten. De kern moet bevatten: (1) het onderwerp (de-extinction / de mammoet terugbrengen via DNA), en (2) dat het omstreden is (voor- en tegenstanders, open debat).',
      antwoord_rubric:'1 punt: onderwerp correct (uitgestorven soort/mammoet terugbrengen). 1 punt: het omstreden karakter (voorstanders tegenover critici / debat is nog gaande), in een volzin.' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Paragraph function',
      vraag:'Wat is de functie van paragraph 2 ("Supporters call it a triumph. Critics, however, are far less enthusiastic...") ten opzichte van paragraph 1?',
      antwoord:'Paragraph 1 presenteert het nieuws/verschijnsel: dat wetenschappers een uitgestorven soort tot leven zouden kunnen wekken. Paragraph 2 introduceert vervolgens de tegenstelling in het debat: het zet de voorstanders ("a triumph") tegenover de critici ("far less enthusiastic"). De functie van paragraph 2 is dus het introduceren van de controverse / de twee kampen, en daarmee de kern van het betoog (de tegenstelling) op gang brengen. Het signaalwoord "however" markeert deze tegenstelling.',
      antwoord_rubric:'1 punt: paragraph 1 introduceert het verschijnsel, paragraph 2 introduceert de tegenstelling/controverse (voor tegenover tegen). 1 punt: herkenning van de contrastfunctie (bv. via "however").' },
    // Opgave 2
    { nr:3, opgave:2, punten:2, type:'open', domein:'Argument',
      vraag:'Noem met behulp van het schema een argument voor en een argument tegen de terugkeer van de mammoet, zoals die in de tekst worden genoemd.',
      antwoord:'Een argument voor (the case FOR): het terugbrengen van de mammoet kan het toendra-ecosysteem herstellen, omdat grote grazers de bodem bevroren houden (herstel van door de mens aangerichte schade). Een argument tegen (the case AGAINST): het is een verspilling van geld dat beter besteed kan worden aan het beschermen van nog bestaande soorten, en er zijn zorgen over dierenwelzijn (een eenzame hybride zonder kudde) en onbekende risico\'s (niemand kan voorspellen hoe het dier zich gedraagt).',
      antwoord_rubric:'1 punt: een correct argument voor (ecosysteemherstel / grazers houden bodem bevroren). 1 punt: een correct argument tegen (kosten/beter bestaande soorten beschermen, dierenwelzijn of onbekende risico\'s).' },
    // Opgave 3
    { nr:4, opgave:3, punten:2, type:'open', domein:'Attitude',
      vraag:'Welke houding (attitude) neemt de auteur aan tegenover het onderwerp: enthousiast, afwijzend of afwachtend/genuanceerd? Citeer de Engelse zinsnede die je antwoord ondersteunt.',
      antwoord:'De auteur neemt een afwachtende, genuanceerde (balanced/cautious) houding aan. Hij kiest geen partij, maar presenteert beide kampen even serieus en laat de uitkomst open. De zinsnede die dit ondersteunt is: "The debate is only beginning." Daarmee geeft de auteur aan dat er nog geen conclusie is en dat hij zelf geen definitief oordeel velt. (Ook goed: het evenwichtig naast elkaar zetten van supporters en critics.)',
      antwoord_rubric:'1 punt: afwachtend/genuanceerd (balanced/cautious), niet enthousiast of afwijzend. 1 punt: passend Engels citaat ("The debate is only beginning" of gelijkwaardig).' },
    // Opgave 4
    { nr:5, opgave:4, punten:2, type:'open', domein:'Vocabulary',
      vraag:'In paragraph 2 staat het woord "resurrecting". Leg in het Nederlands uit wat dit woord in deze context betekent, en noem een woord uit paragraph 1 dat ongeveer hetzelfde betekent.',
      antwoord:'"Resurrecting" betekent hier "tot leven wekken" / "weer laten opstaan": het weer terugbrengen van een soort die is uitgestorven. In de context gaat het om het herscheppen van een verdwenen dier (de mammoet). Een woord uit paragraph 1 met ongeveer dezelfde betekenis is "revive" ("scientists claim they could revive a species"). Ook "bring back" (uit de titel) heeft dezelfde strekking.',
      antwoord_rubric:'1 punt: correcte betekenis van "resurrecting" (tot leven wekken/terugbrengen van een uitgestorven soort). 1 punt: passend synoniem uit paragraph 1 ("revive"; ook "bring back" goed).' },
    { nr:6, opgave:4, punten:2, type:'open', domein:'Reference',
      vraag:'In paragraph 2 staat: "They argue that the money would be better spent...". Naar wie of wat verwijst het woord "They"?',
      antwoord:'"They" verwijst naar "Critics" (de critici) uit de voorgaande zin ("Critics, however, are far less enthusiastic"). Het zijn de critici die aanvoeren dat het geld beter besteed zou kunnen worden aan het beschermen van bestaande soorten. Het verwijst dus niet naar de supporters.',
      antwoord_rubric:'1 punt: "They" = Critics / de critici. 1 punt: onderbouwing dat het de critici zijn (zij vinden het geld beter besteed aan bestaande soorten), niet de supporters.' },
    { nr:7, opgave:4, punten:2, type:'open', domein:'Gap fit',
      vraag:'Stel dat aan het einde van paragraph 4 een zin is weggelaten. Welke van deze twee zinnen past daar het best, en waarom? A: "In short, the science is already settled." B: "In other words, we would be creating an animal we do not fully understand."',
      antwoord:'Zin B past het best: "In other words, we would be creating an animal we do not fully understand." Paragraph 4 gaat over de bezwaren van de critici: de mammoet zou een eenzame hybride zijn, opgegroeid zonder kudde, en niemand kan voorspellen hoe het dier zich in het wild zou gedragen. Zin B vat dit samen ("an animal we do not fully understand") en sluit logisch aan met "In other words". Zin A ("the science is already settled") is juist tegenstrijdig met de inhoud van de alinea, die benadrukt dat er nog veel onzeker en onbekend is; die zin past dus niet.',
      antwoord_rubric:'1 punt: keuze B. 1 punt: onderbouwing dat B aansluit bij de onzekerheid/onvoorspelbaarheid in de alinea, terwijl A ("science is settled") daarmee in tegenspraak is.' },
    { nr:8, opgave:4, punten:2, type:'open', domein:'Inference',
      vraag:'Leg uit wat de auteur bedoelt met de laatste zin "The debate is only beginning." Wat impliceert dit over de toekomst van dit onderwerp?',
      antwoord:'Met "The debate is only beginning" bedoelt de auteur dat de discussie over de-extinction nog lang niet is afgerond: er is nog geen conclusie of consensus, en de kwestie zal in de toekomst nog veel besproken en betwist worden. Het impliceert dat er nog veel vragen open zijn (over kosten, ethiek, risico\'s) en dat de technologie en de morele afweging zich nog verder zullen ontwikkelen. De auteur suggereert dus dat dit een actueel en groeiend vraagstuk is dat de lezer in de gaten moet blijven houden, zonder er zelf al een definitief standpunt over in te nemen.',
      antwoord_rubric:'1 punt: uitleg dat de discussie nog niet is afgerond / nog volop gaande en zal groeien. 1 punt: implicatie voor de toekomst (nog veel open vragen/ontwikkeling; auteur velt geen eindoordeel).' },
  ],
};
