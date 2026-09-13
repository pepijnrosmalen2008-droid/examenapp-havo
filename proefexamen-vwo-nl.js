// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-nl.js  ORIGINEEL Slagio-proefexamen (vwo Nederlands).
// Eigen tekst, vragen en figuren. Geen reproductie van een CvTE-examen.
// VWO-CE-niveau leesvaardigheid: hoofdgedachte/schrijfdoel, argumentatie-
// structuur, argumenttypen en drogredenen, tekstopbouw en samenvatten.
// De onderstaande tekst is volledig door Slagio geschreven.
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

var _VNLAFB = {
  // Tekst als artikelkaart (kop + eerste alinea's)
  artikel:`<svg viewBox="0 0 360 200" role="img" aria-label="tekstfragment als artikel"><rect x="14" y="10" width="332" height="182" rx="6" fill="#ffffff" stroke="#d7dde6" stroke-width="1.4"/>
    <text x="30" y="34" font-family="Georgia,serif" font-size="14" font-weight="800" fill="#1b2230">De prijs van je aandacht</text>
    <text x="30" y="49" font-family="sans-serif" font-size="8" font-style="italic" fill="#8a94a3">een beschouwing over de aandachtseconomie</text>
    <line x1="30" y1="57" x2="330" y2="57" stroke="#eef1f5" stroke-width="1.4"/>
    <g font-family="Georgia,serif" font-size="8.5" fill="#3a4250">
      <text x="30" y="74">(1) Elke minuut die jij naar je scherm kijkt, wordt ergens</text>
      <text x="30" y="88">verkocht. Dat klinkt somber, maar het is de kern van wat</text>
      <text x="30" y="102">economen de "aandachtseconomie" noemen: bedrijven</text>
      <text x="30" y="116">verdienen niet aan wat je koopt, maar aan hoe lang je kijkt.</text>
      <text x="30" y="134">(2) Voorstanders zeggen dat dit gratis diensten mogelijk</text>
      <text x="30" y="148">maakt. Toch betaal je wel degelijk, alleen niet met geld.</text>
      <text x="30" y="162">Je betaalt met je tijd, je data en, zo betogen critici, met</text>
      <text x="30" y="176">je vermogen om je nog ergens lang op te concentreren.</text>
    </g></svg>`,
  // Schema argumentatiestructuur
  argstruct:`<svg viewBox="0 0 360 190" role="img" aria-label="schema van de argumentatiestructuur">
    <rect x="96" y="12" width="168" height="30" rx="6" fill="#eef4ff" stroke="#2563eb" stroke-width="1.8"/>
    <text x="180" y="27" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b4fb0" text-anchor="middle">standpunt</text>
    <text x="180" y="38" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">de aandachtseconomie is schadelijk</text>
    <g stroke="#94a0b8" stroke-width="1.4"><line x1="130" y1="42" x2="80" y2="70"/><line x1="180" y1="42" x2="180" y2="70"/><line x1="230" y1="42" x2="280" y2="70"/></g>
    <g font-family="sans-serif" font-size="8" font-weight="700" fill="#1b2230" text-anchor="middle">
      <rect x="26" y="70" width="108" height="42" rx="5" fill="#eafaf0" stroke="#2e9e5b" stroke-width="1.4"/><text x="80" y="87">argument 1</text><text x="80" y="100" font-size="7" font-weight="400" fill="#4a5568">aantasting</text><text x="80" y="108" font-size="7" font-weight="400" fill="#4a5568">concentratie</text>
      <rect x="126" y="70" width="108" height="42" rx="5" fill="#eafaf0" stroke="#2e9e5b" stroke-width="1.4"/><text x="180" y="87">argument 2</text><text x="180" y="100" font-size="7" font-weight="400" fill="#4a5568">verlies van</text><text x="180" y="108" font-size="7" font-weight="400" fill="#4a5568">privacy/data</text>
      <rect x="226" y="70" width="108" height="42" rx="5" fill="#eafaf0" stroke="#2e9e5b" stroke-width="1.4"/><text x="280" y="87">argument 3</text><text x="280" y="100" font-size="7" font-weight="400" fill="#4a5568">manipulatie</text><text x="280" y="108" font-size="7" font-weight="400" fill="#4a5568">van gedrag</text>
    </g>
    <g stroke="#c9d2e0" stroke-width="1.2"><line x1="80" y1="112" x2="80" y2="132"/><line x1="180" y1="112" x2="180" y2="132"/><line x1="280" y1="112" x2="280" y2="132"/></g>
    <g font-family="sans-serif" font-size="7" fill="#4a5568" text-anchor="middle"><text x="80" y="144">onderbouwing</text><text x="80" y="153">(onderzoek)</text><text x="180" y="144">onderbouwing</text><text x="180" y="153">(voorbeeld)</text><text x="280" y="144">onderbouwing</text><text x="280" y="153">(deskundige)</text></g>
    <text x="180" y="182" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figuur: de argumentatiestructuur van de tekst</text></svg>`,
  // Schema tekstopbouw
  opbouw:`<svg viewBox="0 0 360 176" role="img" aria-label="schema van de tekstopbouw">
    <g font-family="sans-serif">
      <rect x="40" y="18" width="280" height="30" rx="5" fill="#eef4ff" stroke="#2563eb" stroke-width="1.4"/><text x="54" y="37" font-size="9" font-weight="800" fill="#1b4fb0">inleiding</text><text x="150" y="37" font-size="7.5" fill="#4a5568">alinea 1-2: aandacht wordt verkocht</text>
      <rect x="40" y="56" width="280" height="46" rx="5" fill="#eafaf0" stroke="#2e9e5b" stroke-width="1.4"/><text x="54" y="76" font-size="9" font-weight="800" fill="#1b7a41">kern</text><text x="150" y="72" font-size="7.5" fill="#4a5568">alinea 3-5: drie argumenten tegen de</text><text x="150" y="83" font-size="7.5" fill="#4a5568">aandachtseconomie met onderbouwing</text><text x="150" y="94" font-size="7.5" fill="#4a5568">en weerlegging van een tegenwerping</text>
      <rect x="40" y="110" width="280" height="34" rx="5" fill="#fdf2e2" stroke="#e8a530" stroke-width="1.4"/><text x="54" y="131" font-size="9" font-weight="800" fill="#b3760f">slot</text><text x="150" y="127" font-size="7.5" fill="#4a5568">alinea 6: conclusie en oproep tot</text><text x="150" y="138" font-size="7.5" fill="#4a5568">bewuster schermgebruik</text>
    </g>
    <text x="180" y="162" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figuur: de opbouw van de tekst in drie delen</text></svg>`,
};

SLAGIO_EXAMENS.vwo.nl = {
  origineel: true,
  titel: 'Nederlands',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 180,
  max_punten: 16,
  bron: 'Slagio origineel · examenstijl (eigen tekst)',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'De tekst: "De prijs van je aandacht"',
      context:'Lees de tekst (een beschouwing). Alinea 1-2: De aandachtseconomie betekent dat bedrijven geld verdienen aan hoe lang je naar je scherm kijkt; je betaalt niet met geld, maar met je tijd, je data en je concentratievermogen. Alinea 3: Uit onderzoek blijkt dat wie voortdurend wordt onderbroken door meldingen, zich slechter kan concentreren. Alinea 4: Apps verzamelen bovendien enorme hoeveelheden persoonlijke data, zoals blijkt uit het voorbeeld van een tienermeisje dat gerichte advertenties kreeg voordat ze zelf wist dat ze zwanger was. Alinea 5: Techcritici en zelfs oud-werknemers van sociale media waarschuwen dat de apps bewust verslavend zijn ontworpen. Alinea 6: De schrijver concludeert dat we ons scherm bewuster moeten gebruiken.',
      afb:_VNLAFB.artikel, afb_cap:'de openingsalinea\'s van de tekst' },
    { nr:2, titel:'De argumentatie',
      context:'Het onderstaande schema geeft de argumentatiestructuur van de tekst weer: een hoofdstandpunt met drie ondersteunende argumenten.',
      afb:_VNLAFB.argstruct, afb_cap:'de argumentatiestructuur van de tekst' },
    { nr:3, titel:'Soorten argumenten',
      context:'In alinea 3 tot en met 5 gebruikt de schrijver verschillende soorten argumenten en verwijst hij naar bronnen om zijn standpunt te ondersteunen.',
      afb:_VNLAFB.argstruct, afb_cap:'de drie argumenten met hun onderbouwing' },
    { nr:4, titel:'De opbouw en de kern',
      context:'Het onderstaande schema toont de opbouw van de tekst in inleiding, kern en slot.',
      afb:_VNLAFB.opbouw, afb_cap:'de opbouw van de tekst in drie delen' },
  ],
  vragen: [
    // Opgave 1
    { nr:1, opgave:1, punten:2, type:'open', domein:'Tekstdoel',
      vraag:'Wat is het belangrijkste schrijfdoel van deze tekst: informeren, overtuigen, activeren of amuseren? Onderbouw je antwoord met een kenmerk uit de tekst.',
      antwoord:'Het belangrijkste schrijfdoel is overtuigen (met een activerend slot). De schrijver verdedigt een duidelijk standpunt, namelijk dat de aandachtseconomie schadelijk is, en onderbouwt dat met argumenten en bronnen. Dat wijst op overtuigen, niet op louter informeren. Kenmerkend is bijvoorbeeld dat critici worden aangehaald ("zo betogen critici") en dat de tekst eindigt met een oproep om het scherm bewuster te gebruiken. Omdat de tekst ook aanzet tot ander gedrag, is er in het slot een activerend element, maar de kern is overtuigen. (Ook goed gerekend: activeren, mits onderbouwd met de slotoproep.)',
      antwoord_rubric:'1 punt: overtuigen (of beargumenteerd activeren). 1 punt: passend kenmerk uit de tekst (standpunt met argumenten / critici aangehaald / oproep in het slot).' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Hoofdgedachte',
      vraag:'Geef in een volzin de hoofdgedachte van de tekst weer.',
      antwoord:'Een goede hoofdgedachte, bijvoorbeeld: "In de aandachtseconomie betaal je gratis diensten met je tijd, je data en je concentratievermogen, en daarom pleit de schrijver ervoor dat we ons schermgebruik bewuster maken." De kern moet bevatten: (1) het onderwerp (de aandachtseconomie / aandacht wordt verkocht), en (2) het standpunt/de strekking (het is schadelijk, dus bewuster omgaan met schermen).',
      antwoord_rubric:'1 punt: onderwerp correct (aandachtseconomie: aandacht/tijd wordt verkocht). 1 punt: standpunt/strekking correct (schadelijk -> bewuster schermgebruik), in een volzin.' },
    // Opgave 2
    { nr:3, opgave:2, punten:2, type:'open', domein:'Argumentatie',
      vraag:'Benoem het hoofdstandpunt van de tekst en leg uit wat het verband is tussen het standpunt en de drie argumenten in het schema.',
      antwoord:'Het hoofdstandpunt is dat de aandachtseconomie schadelijk is (voor het individu). De drie argumenten (aantasting van de concentratie, verlies van privacy en data, en manipulatie van gedrag) zijn nevengeschikte (onderling onafhankelijke) argumenten: elk argument ondersteunt op zichzelf het standpunt. Ze staan naast elkaar en versterken samen de aanvaardbaarheid van het standpunt; als een argument wegvalt, blijven de andere het standpunt nog steeds dragen. Er is dus sprake van een meervoudige (nevenschikkende) argumentatie.',
      antwoord_rubric:'1 punt: hoofdstandpunt correct (aandachtseconomie is schadelijk). 1 punt: uitleg nevengeschikte/meervoudige argumentatie (elk argument steunt het standpunt zelfstandig, ze staan naast elkaar).' },
    // Opgave 3
    { nr:4, opgave:3, punten:2, type:'open', domein:'Argumenttypen',
      vraag:'De schrijver onderbouwt argument 3 (manipulatie) met een uitspraak van oud-werknemers van sociale media. Welk type argument (of onderbouwing) is dit, en noem een sterk en een zwak punt van dit argumenttype.',
      antwoord:'Dit is een autoriteitsargument (beroep op een deskundige/gezaghebbende bron): de schrijver steunt zijn bewering op het gezag van oud-werknemers die de apps van binnenuit kennen. Een sterk punt is dat deze mensen deskundig en geloofwaardig zijn, juist omdat zij zelf aan de systemen hebben meegewerkt (ervaringsdeskundigen). Een zwak punt is dat een autoriteitsargument niet vanzelf waar is: ook een deskundige kan zich vergissen of een belang of wrok hebben, en een enkele mening bewijst nog niet dat het altijd en overal zo werkt. De lezer moet dus de betrouwbaarheid en representativiteit van de bron zelf blijven wegen.',
      antwoord_rubric:'1 punt: autoriteitsargument / beroep op deskundige benoemd. 1 punt: een sterk punt (deskundig/geloofwaardig, van binnenuit) EN een zwak punt (deskundige kan zich vergissen/belang hebben; geen bewijs op zich).' },
    { nr:5, opgave:3, punten:2, type:'open', domein:'Drogredenen',
      vraag:'Stel dat de schrijver zou schrijven: "Wie het gebruik van deze apps verdedigt, geeft alleen maar toe dat hij zelf verslaafd is." Leg uit welke drogreden dit is en waarom de redenering niet deugt.',
      antwoord:'Dit is een persoonlijke aanval (ad hominem), en meer specifiek een vorm waarin de tegenstander verdacht wordt gemaakt in plaats van dat zijn argument wordt weerlegd. In plaats van in te gaan op de inhoud van wat een voorstander zegt, wordt de persoon zelf aangevallen ("dan ben je zelf verslaafd"). De redenering deugt niet, omdat de geldigheid van een standpunt niet afhangt van de persoon of de motieven van degene die het uitspreekt: ook iemand die de apps gebruikt, kan een geldig argument aandragen. Bovendien is het een cirkelachtige verdachtmaking die elk tegenargument bij voorbaat onmogelijk maakt.',
      antwoord_rubric:'1 punt: persoonlijke aanval / ad hominem (verdachtmaking) benoemd. 1 punt: uitleg waarom ondeugdelijk (inhoud wordt niet weerlegd; geldigheid hangt niet af van de persoon/motieven).' },
    // Opgave 4
    { nr:6, opgave:4, punten:2, type:'open', domein:'Tekststructuur',
      vraag:'In alinea 2 staat: "Voorstanders zeggen dat dit gratis diensten mogelijk maakt." Leg uit welke functie deze zin heeft in de opbouw van een betogende tekst.',
      antwoord:'Deze zin introduceert een tegenwerping (tegenargument): het standpunt van de voorstanders. De functie ervan is dat de schrijver eerst een mogelijk bezwaar tegen zijn eigen standpunt benoemt, om dat vervolgens te weerleggen ("Toch betaal je wel degelijk, alleen niet met geld"). Door de tegenwerping op te nemen en te weerleggen, maakt de schrijver zijn betoog sterker en overtuigender: hij laat zien dat hij het andere standpunt kent en er een antwoord op heeft. Dit heet weerlegging van een tegenargument.',
      antwoord_rubric:'1 punt: het is een tegenwerping/tegenargument (standpunt van de voorstanders). 1 punt: functie = wordt weerlegd om het eigen betoog te versterken/overtuigender te maken.' },
    { nr:7, opgave:4, punten:2, type:'open', domein:'Tekststructuur',
      vraag:'Welk verband bestaat er tussen alinea 2 ("Toch betaal je wel degelijk...") en alinea 1? Benoem het tekstverband en noem het signaalwoord dat dit aangeeft.',
      antwoord:'Er is een tegenstellend verband (contrast/concessie) tussen de alinea\'s: alinea 1 stelt dat de diensten "gratis" lijken en dat voorstanders dat als voordeel zien, terwijl alinea 2 daar tegenin gaat door te stellen dat je wel degelijk betaalt (met tijd en data). Het signaalwoord dat dit tegenstellende verband aangeeft is "Toch" (aan het begin van alinea 2). Ook "wel degelijk" versterkt de tegenstelling.',
      antwoord_rubric:'1 punt: tegenstellend verband (contrast/concessie) benoemd. 1 punt: signaalwoord "Toch" (of "wel degelijk") genoemd.' },
    { nr:8, opgave:4, punten:2, type:'open', domein:'Samenvatten',
      vraag:'Vat de kern (alinea 3 tot en met 5) samen in maximaal 25 woorden, zonder voorbeelden.',
      antwoord:'Een goede samenvatting van de kern, bijvoorbeeld: "De aandachtseconomie is schadelijk, want voortdurende meldingen tasten de concentratie aan, apps verzamelen veel persoonlijke data, en ze zijn bewust verslavend ontworpen om gedrag te sturen." (23 woorden.) De samenvatting moet de drie kernargumenten bevatten (concentratie, data/privacy, manipulatie/verslaving) en de voorbeelden (het tienermeisje, de specifieke bronnen) weglaten, binnen de woordgrens.',
      antwoord_rubric:'1 punt: alle drie de kernargumenten aanwezig (concentratie, data/privacy, manipulatie/verslaving). 1 punt: zonder voorbeelden en binnen de woordgrens (maximaal 25 woorden), lopende zin.' },
  ],
};
