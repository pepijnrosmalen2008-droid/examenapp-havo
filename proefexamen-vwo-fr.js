// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-fr.js  ORIGINEEL Slagio-proefexamen (vwo Frans).
// Eigen Franse tekst, vragen en figuren. Geen reproductie van een CvTE-examen.
// VWO-CE-niveau leesvaardigheid: idee principale, functie alinea, woord in
// context, verwijswoord, houding auteur en gap-fit. Vragen in het
// Nederlands (zoals op het CE); de tekst is volledig door Slagio geschreven.
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

var _VFRAFB = {
  // Franse tekst als artikelkaart
  article:`<svg viewBox="0 0 360 204" role="img" aria-label="extrait d'article francais"><rect x="14" y="10" width="332" height="186" rx="6" fill="#ffffff" stroke="#d7dde6" stroke-width="1.4"/>
    <text x="30" y="34" font-family="Georgia,serif" font-size="13" font-weight="800" fill="#1b2230">Faut-il interdire le portable?</text>
    <text x="30" y="49" font-family="sans-serif" font-size="8" font-style="italic" fill="#8a94a3">le débat sur les écrans à l'école</text>
    <line x1="30" y1="57" x2="330" y2="57" stroke="#eef1f5" stroke-width="1.4"/>
    <g font-family="Georgia,serif" font-size="8.5" fill="#3a4250">
      <text x="30" y="74">(1) Dans de nombreuses écoles, le téléphone portable est</text>
      <text x="30" y="88">désormais interdit en classe. Selon le ministre, cette</text>
      <text x="30" y="102">mesure permet aux élèves de mieux se concentrer.</text>
      <text x="30" y="120">(2) Pourtant, tout le monde n'est pas d'accord. Certains</text>
      <text x="30" y="134">enseignants estiment que le portable peut aussi être un</text>
      <text x="30" y="148">outil utile, par exemple pour chercher une information ou</text>
      <text x="30" y="162">traduire un mot. Le véritable enjeu, disent-ils, n'est pas</text>
      <text x="30" y="176">l'appareil, mais la manière dont on l'utilise.</text>
    </g></svg>`,
  // Structuur schema
  structure:`<svg viewBox="0 0 360 180" role="img" aria-label="structure de l'argumentation">
    <g font-family="sans-serif">
      <rect x="30" y="16" width="140" height="46" rx="6" fill="#eafaf0" stroke="#2e9e5b" stroke-width="1.6"/><text x="100" y="34" font-size="9" font-weight="800" fill="#1b7a41" text-anchor="middle">POUR l'interdiction</text><text x="100" y="47" font-size="7" fill="#4a5568" text-anchor="middle">concentration,</text><text x="100" y="56" font-size="7" fill="#4a5568" text-anchor="middle">moins de distraction</text>
      <rect x="190" y="16" width="140" height="46" rx="6" fill="#fbeaea" stroke="#c0392b" stroke-width="1.6"/><text x="260" y="34" font-size="9" font-weight="800" fill="#9e2b22" text-anchor="middle">CONTRE</text><text x="260" y="47" font-size="7" fill="#4a5568" text-anchor="middle">outil utile,</text><text x="260" y="56" font-size="7" fill="#4a5568" text-anchor="middle">apprendre à l'utiliser</text>
      <rect x="86" y="92" width="188" height="40" rx="6" fill="#eef4ff" stroke="#2563eb" stroke-width="1.6"/><text x="180" y="110" font-size="9" font-weight="800" fill="#1b4fb0" text-anchor="middle">le vrai enjeu</text><text x="180" y="123" font-size="7.5" fill="#4a5568" text-anchor="middle">non l'appareil, mais l'usage</text>
    </g>
    <g stroke="#94a0b8" stroke-width="1.4"><line x1="100" y1="62" x2="150" y2="92"/><line x1="260" y1="62" x2="210" y2="92"/></g>
    <text x="180" y="164" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figure: deux positions et le vrai enjeu</text></svg>`,
  // Toon schaal
  tone:`<svg viewBox="0 0 360 150" role="img" aria-label="attitude de l'auteur">
    <text x="180" y="26" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">l'attitude de l'auteur</text>
    <line x1="40" y1="80" x2="320" y2="80" stroke="#1b2230" stroke-width="2"/>
    <g stroke="#1b2230" stroke-width="1.4"><line x1="40" y1="74" x2="40" y2="86"/><line x1="180" y1="74" x2="180" y2="86"/><line x1="320" y1="74" x2="320" y2="86"/></g>
    <g font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="middle"><text x="40" y="100">enthousiaste</text><text x="180" y="100">nuancé /</text><text x="180" y="110">neutre</text><text x="320" y="100">hostile</text></g>
    <circle cx="180" cy="80" r="6" fill="#2563eb"/><text x="180" y="62" font-family="sans-serif" font-size="8" font-weight="700" fill="#2563eb" text-anchor="middle">auteur ici</text>
    <text x="180" y="138" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figure: la position de l'auteur</text></svg>`,
};

SLAGIO_EXAMENS.vwo.fr = {
  origineel: true,
  titel: 'Frans',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 150,
  max_punten: 16,
  bron: 'Slagio origineel · examenstijl (eigen Franse tekst)',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Lecture: "Faut-il interdire le portable?"',
      context:'Lees de tekst. Paragraphe 1: In veel scholen is de mobiele telefoon nu verboden in de klas; volgens de minister helpt die maatregel leerlingen zich beter te concentreren. Paragraphe 2: Toch is niet iedereen het ermee eens; sommige docenten vinden dat de telefoon ook een nuttig hulpmiddel kan zijn (informatie opzoeken, een woord vertalen). Volgens hen is het echte probleem niet het apparaat, maar de manier waarop je het gebruikt. Paragraphe 3: Voorstanders van het verbod wijzen op onderzoek dat aantoont dat leerlingen zonder telefoon betere resultaten halen. Paragraphe 4: Tegenstanders vrezen dat een totaalverbod leerlingen juist niet leert om verstandig met technologie om te gaan. Paragraphe 5: De auteur besluit dat scholen leerlingen vooral moeten leren hun telefoon bewust te gebruiken.',
      afb:_VFRAFB.article, afb_cap:'de openingsalinea\'s van de tekst' },
    { nr:2, titel:'La structure',
      context:'Het onderstaande schema toont de twee standpunten in het debat en het "echte probleem" volgens de docenten.',
      afb:_VFRAFB.structure, afb_cap:'twee standpunten en het echte probleem' },
    { nr:3, titel:'L\'attitude de l\'auteur',
      context:'De schaal hieronder toont mogelijke houdingen die een auteur tegenover een onderwerp kan innemen.',
      afb:_VFRAFB.tone, afb_cap:'de positie van de auteur' },
    { nr:4, titel:'Le vocabulaire en contexte',
      context:'De volgende vragen gaan over de betekenis van specifieke woorden en zinnen in de tekst.',
      afb:_VFRAFB.article, afb_cap:'de tekst, voor de woordvragen' },
  ],
  vragen: [
    // Opgave 1
    { nr:1, opgave:1, punten:2, type:'open', domein:'Idee principale',
      vraag:'Wat is de hoofdgedachte (idee principale) van de tekst? Formuleer je antwoord in het Nederlands in een volzin.',
      antwoord:'De hoofdgedachte is dat er een debat is over het verbieden van de mobiele telefoon op school: voorstanders vinden dat het de concentratie verbetert, terwijl tegenstanders de telefoon een nuttig hulpmiddel vinden, en dat het volgens de auteur uiteindelijk niet om het apparaat gaat maar om leerlingen te leren hun telefoon bewust te gebruiken. De kern moet bevatten: (1) het onderwerp (telefoonverbod op school), en (2) de twee kanten plus de nuance dat het om het gebruik gaat.',
      antwoord_rubric:'1 punt: onderwerp correct (telefoon(verbod) op school). 1 punt: de tegenstelling voor/tegen en/of de nuance dat het om het gebruik gaat, in een volzin.' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Fonction paragraphe',
      vraag:'Wat is de functie van paragraphe 2 ("Pourtant, tout le monde n\'est pas d\'accord...") ten opzichte van paragraphe 1?',
      antwoord:'Paragraphe 1 geeft het standpunt van de minister weer: het verbod helpt leerlingen zich te concentreren. Paragraphe 2 zet daar een tegengeluid tegenover: sommige docenten vinden de telefoon juist een nuttig hulpmiddel en stellen dat het niet om het apparaat gaat maar om het gebruik. De functie van paragraphe 2 is dus het introduceren van de tegenstelling / het tegenargument. Het signaalwoord "Pourtant" (toch/echter) markeert deze tegenstelling.',
      antwoord_rubric:'1 punt: paragraphe 1 = standpunt minister (voor verbod), paragraphe 2 introduceert het tegengeluid/tegenargument. 1 punt: herkenning contrastfunctie (bv. via "Pourtant").' },
    // Opgave 2
    { nr:3, opgave:2, punten:2, type:'open', domein:'Argument',
      vraag:'Noem met behulp van het schema een argument voor en een argument tegen het telefoonverbod, zoals genoemd in de tekst.',
      antwoord:'Een argument voor het verbod (POUR): leerlingen kunnen zich zonder telefoon beter concentreren en worden minder afgeleid (en halen betere resultaten, blijkt uit onderzoek). Een argument tegen het verbod (CONTRE): de telefoon is ook een nuttig hulpmiddel (informatie opzoeken, een woord vertalen), en een totaalverbod leert leerlingen juist niet om verstandig met technologie om te gaan; het gaat om het gebruik, niet om het apparaat.',
      antwoord_rubric:'1 punt: een correct argument voor (concentratie/minder afleiding/betere resultaten). 1 punt: een correct argument tegen (nuttig hulpmiddel of leren omgaan met technologie / het gaat om het gebruik).' },
    // Opgave 3
    { nr:4, opgave:3, punten:2, type:'open', domein:'Attitude',
      vraag:'Welke houding neemt de auteur aan: enthousiast, vijandig of genuanceerd/neutraal? Onderbouw je antwoord met wat in de tekst gebeurt.',
      antwoord:'De auteur neemt een genuanceerde, neutrale (nuance/neutre) houding aan. Hij kiest geen partij voor of tegen het verbod, maar presenteert beide standpunten en concludeert dat scholen leerlingen vooral moeten leren hun telefoon bewust te gebruiken. Hij verschuift de nadruk van "verbieden of niet" naar "leren gebruiken", wat wijst op een afgewogen, bemiddelende houding in plaats van een uitgesproken voor- of tegenstander te zijn.',
      antwoord_rubric:'1 punt: genuanceerd/neutraal (niet enthousiast of vijandig). 1 punt: onderbouwing (beide kanten gepresenteerd; nadruk op bewust leren gebruiken in plaats van simpelweg voor/tegen).' },
    // Opgave 4
    { nr:5, opgave:4, punten:2, type:'open', domein:'Vocabulaire',
      vraag:'In paragraphe 2 staat het woord "enjeu" ("Le véritable enjeu, disent-ils, n\'est pas l\'appareil..."). Leg in het Nederlands uit wat dit woord hier betekent.',
      antwoord:'"Enjeu" betekent hier "de kern van de zaak" / "waar het werkelijk om gaat" / "het echte vraagstuk (dat op het spel staat)". De docenten zeggen dat het echte vraagstuk niet het apparaat (de telefoon) zelf is, maar de manier waarop je het gebruikt. "Le véritable enjeu" is dus "het eigenlijke, belangrijkste punt" van de discussie.',
      antwoord_rubric:'1 punt: correcte betekenis van "enjeu" (de kern/inzet/waar het echt om gaat). 1 punt: passend in de context (het echte punt is niet het apparaat maar het gebruik).' },
    { nr:6, opgave:4, punten:2, type:'open', domein:'Mot de reference',
      vraag:'In paragraphe 2 staat: "la manière dont on l\'utilise". Naar welk woord verwijst het voornaamwoord "l\'" (le/la) in "l\'utilise"?',
      antwoord:'"L\'" (l\' voor utilise) verwijst naar "le portable" / "l\'appareil": de mobiele telefoon. De zin betekent "de manier waarop men hem (de telefoon) gebruikt". Het verwijst dus terug naar het apparaat waar de hele tekst over gaat, niet naar iets anders.',
      antwoord_rubric:'1 punt: "l\'" = le portable / l\'appareil (de telefoon). 1 punt: onderbouwing dat het naar de telefoon/het apparaat verwijst ("de manier waarop men hem gebruikt").' },
    { nr:7, opgave:4, punten:2, type:'open', domein:'Gap fit',
      vraag:'Stel dat aan het einde van paragraphe 4 een zin is weggelaten. Welke van deze twee zinnen past daar het best, en waarom? A: "Interdire ne suffit donc pas: il faut aussi éduquer." B: "Il vaut donc mieux interdire totalement les portables."',
      antwoord:'Zin A past het best: "Interdire ne suffit donc pas: il faut aussi éduquer" (verbieden is dus niet genoeg: je moet ook opvoeden/leren). Paragraphe 4 gaat over de tegenstanders, die vrezen dat een totaalverbod leerlingen juist niet leert verstandig met technologie om te gaan. Zin A sluit daar logisch op aan: verbieden alleen is niet voldoende, er moet ook geleerd worden om te gaan met de telefoon. Zin B ("il vaut mieux interdire totalement" = beter helemaal verbieden) is juist het tegenovergestelde van het standpunt in de alinea; die zin past dus niet.',
      antwoord_rubric:'1 punt: keuze A. 1 punt: onderbouwing dat A aansluit bij het standpunt van de tegenstanders (verbieden alleen is niet genoeg, ook leren omgaan), terwijl B daarmee in tegenspraak is.' },
    { nr:8, opgave:4, punten:2, type:'open', domein:'Conclusion',
      vraag:'Leg uit wat de auteur bedoelt met zijn conclusie dat scholen leerlingen vooral moeten leren hun telefoon bewust te gebruiken. Hoe verhoudt deze conclusie zich tot het debat over het verbod?',
      antwoord:'De auteur bedoelt dat de oplossing niet ligt in simpelweg verbieden of toestaan, maar in het aanleren van bewust, verstandig gebruik van de telefoon. In plaats van de vraag "verbieden of niet" centraal te stellen, verlegt hij de aandacht naar mediawijsheid: leerlingen moeten leren wanneer en hoe ze hun telefoon zinvol inzetten. Zo overstijgt de conclusie het debat over het verbod: de auteur stelt dat beide kampen (voor en tegen) zich op de verkeerde vraag richten, en dat de echte taak van de school het opvoeden tot bewust gebruik is.',
      antwoord_rubric:'1 punt: uitleg dat de oplossing bewust/verstandig leren gebruiken is, niet enkel verbieden of toestaan. 1 punt: koppeling aan het debat (de conclusie overstijgt het "verbieden of niet" door de nadruk op mediawijsheid/bewust gebruik te leggen).' },
  ],
};
