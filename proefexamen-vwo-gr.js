// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-gr.js  ORIGINEEL Slagio-proefexamen (vwo Grieks).
// Eigen Griekse tekst (door Slagio geschreven in eenvoudig Attisch proza),
// vragen en figuren. Geen reproductie van een CvTE-pensum of moderne editie.
// VWO-CE-niveau: vertalen, grammatica (naamval/functie, werkwoordsvormen),
// stijl/interpretatie en cultuur (KCV: de mythe en haar thema).
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

var _VGRAFB = {
  // Griekse tekst met regelnummers
  tekst:`<svg viewBox="0 0 360 206" role="img" aria-label="grieks tekstfragment"><rect x="14" y="10" width="332" height="188" rx="6" fill="#f4f8fb" stroke="#a9c4d8" stroke-width="1.4"/>
    <text x="180" y="30" font-family="Georgia,serif" font-size="12" font-weight="800" fill="#1b4a63" text-anchor="middle" font-style="italic">Prometheus kai to pyr</text>
    <line x1="30" y1="38" x2="330" y2="38" stroke="#d5e6ef" stroke-width="1.4"/>
    <g font-family="Georgia,serif" font-size="10" fill="#22303a">
      <text x="30" y="58">1  ὁ Προμηθεὺς φίλος τῶν ἀνθρώπων ἦν.</text>
      <text x="30" y="76">   οἱ γὰρ ἄνθρωποι πῦρ οὐκ εἶχον.</text>
      <text x="30" y="94">3  ὁ οὖν Προμηθεὺς τὸ πῦρ ἔκλεψεν</text>
      <text x="30" y="112">   καὶ τοῖς ἀνθρώποις ἔδωκεν.</text>
      <text x="30" y="130">5  ὁ δὲ Ζεὺς ὠργίζετο</text>
      <text x="30" y="148">   καὶ τὸν Προμηθέα ἐκόλασεν.</text>
    </g>
    <g font-family="Georgia,serif" font-size="8" font-style="italic" fill="#5a7480"><text x="30" y="172">πῦρ, πυρός (n.) = vuur; κλέπτω, ἔκλεψα = stelen;</text><text x="30" y="186">κολάζω, ἐκόλασα = straffen; ὀργίζομαι = boos worden</text></g></svg>`,
  // Grammaticaschema: o-declinatie anthropos
  naamval:`<svg viewBox="0 0 360 176" role="img" aria-label="naamvalschema">
    <text x="180" y="20" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">o-declinatie: ἄνθρωπος (de mens)</text>
    <g font-family="sans-serif" font-size="8.5">
      <rect x="24" y="30" width="312" height="20" fill="#eef4ff"/>
      <text x="34" y="44" font-weight="700" fill="#1b4fb0">naamval</text><text x="140" y="44" font-weight="700" fill="#1b4fb0">enkelvoud</text><text x="235" y="44" font-weight="700" fill="#1b4fb0">functie (o.a.)</text>
      <g fill="#1b2230">
        <text x="34" y="62">nominativus</text><text x="140" y="62" font-family="Georgia,serif">ἄνθρωπος</text><text x="235" y="62">onderwerp</text>
        <text x="34" y="78">genitivus</text><text x="140" y="78" font-family="Georgia,serif">ἀνθρώπου</text><text x="235" y="78">bezit ("van")</text>
        <text x="34" y="94">dativus</text><text x="140" y="94" font-family="Georgia,serif">ἀνθρώπῳ</text><text x="235" y="94">mww. vw. / "aan"</text>
        <text x="34" y="110">accusativus</text><text x="140" y="110" font-family="Georgia,serif">ἄνθρωπον</text><text x="235" y="110">lijdend voorwerp</text>
        <text x="34" y="126">nom. pluralis</text><text x="140" y="126" font-family="Georgia,serif">ἄνθρωποι</text><text x="235" y="126">onderwerp (mv.)</text>
        <text x="34" y="142">dat. pluralis</text><text x="140" y="142" font-family="Georgia,serif">ἀνθρώποις</text><text x="235" y="142">mww. vw. (mv.)</text>
      </g>
    </g>
    <line x1="24" y1="50" x2="336" y2="50" stroke="#c9d2e0" stroke-width="1"/>
    <line x1="130" y1="30" x2="130" y2="150" stroke="#eef1f5" stroke-width="1"/><line x1="228" y1="30" x2="228" y2="150" stroke="#eef1f5" stroke-width="1"/>
    <text x="180" y="168" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figuur: naamvallen van ἄνθρωπος en hun functies</text></svg>`,
  // Mythe-illustratie: Prometheus geeft vuur, Zeus boos
  mythe:`<svg viewBox="0 0 360 182" role="img" aria-label="prometheus geeft het vuur aan de mensen">
    <rect x="0" y="0" width="360" height="182" fill="#fbfaf6"/>
    <line x1="180" y1="20" x2="180" y2="150" stroke="#dfe4ec" stroke-width="1.2" stroke-dasharray="4 4"/>
    <text x="92" y="30" font-family="sans-serif" font-size="9" font-weight="800" fill="#2e7d32" text-anchor="middle">Prometheus</text>
    <text x="268" y="30" font-family="sans-serif" font-size="9" font-weight="800" fill="#c0392b" text-anchor="middle">Zeus (org&#237;zetai)</text>
    <g transform="translate(70,90)"><circle cx="0" cy="-24" r="9" fill="none" stroke="#2e7d32" stroke-width="1.8"/><line x1="0" y1="-15" x2="0" y2="16" stroke="#2e7d32" stroke-width="1.8"/><line x1="0" y1="-6" x2="20" y2="-14" stroke="#2e7d32" stroke-width="1.8"/><line x1="0" y1="-6" x2="-16" y2="2" stroke="#2e7d32" stroke-width="1.8"/><line x1="0" y1="16" x2="-10" y2="40" stroke="#2e7d32" stroke-width="1.8"/><line x1="0" y1="16" x2="12" y2="40" stroke="#2e7d32" stroke-width="1.8"/></g>
    <g transform="translate(96,74)"><path d="M0 6 q -5 -8 0 -14 q 5 6 0 14" fill="#e8580c"/><path d="M0 2 q -3 -5 0 -9 q 3 4 0 9" fill="#ffd166"/></g>
    <text x="92" y="150" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">geeft τὸ πῦρ (het vuur)</text>
    <g stroke="#e8a020" stroke-width="2" fill="none"><line x1="112" y1="72" x2="150" y2="66"/><path d="M150 66 L142 63 L143 70 Z" fill="#e8a020" stroke="none"/></g>
    <g transform="translate(150,90)" font-family="sans-serif" font-size="8" fill="#4a5568"><text x="0" y="0" text-anchor="middle">οἱ ἄνθρωποι</text><text x="0" y="12" text-anchor="middle">(de mensen)</text><circle cx="-14" cy="34" r="6" fill="none" stroke="#1b2230" stroke-width="1.4"/><circle cx="0" cy="34" r="6" fill="none" stroke="#1b2230" stroke-width="1.4"/><circle cx="14" cy="34" r="6" fill="none" stroke="#1b2230" stroke-width="1.4"/></g>
    <g transform="translate(280,92)"><circle cx="0" cy="-24" r="10" fill="none" stroke="#c0392b" stroke-width="1.8"/><line x1="0" y1="-14" x2="0" y2="18" stroke="#c0392b" stroke-width="1.8"/><line x1="0" y1="-4" x2="-20" y2="-14" stroke="#c0392b" stroke-width="1.8"/><line x1="0" y1="-4" x2="18" y2="-16" stroke="#c0392b" stroke-width="1.8"/><line x1="0" y1="18" x2="-12" y2="44" stroke="#c0392b" stroke-width="1.8"/><line x1="0" y1="18" x2="12" y2="44" stroke="#c0392b" stroke-width="1.8"/><path d="M14 -20 L34 -30 L24 -18 L38 -22" fill="none" stroke="#e8a020" stroke-width="1.6"/></g>
    <text x="280" y="150" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">straft Prometheus (ἐκόλασεν)</text>
    <text x="180" y="176" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figuur: Prometheus als weldoener en het conflict met Zeus</text></svg>`,
};

SLAGIO_EXAMENS.vwo.gr = {
  origineel: true,
  titel: 'Grieks',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 180,
  max_punten: 12,
  bron: 'Slagio origineel · examenstijl (eigen Griekse tekst)',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'De tekst: Prometheus kai to pyr',
      context:'Lees het Griekse tekstfragment (regel 1 tot en met 6). Het is een door Slagio geschreven, vereenvoudigde weergave van de mythe van Prometheus. Woordhulp staat onderaan de tekst.',
      afb:_VGRAFB.tekst, afb_cap:'het Griekse tekstfragment met regelnummers' },
    { nr:2, titel:'Grammatica: naamvallen en vormen',
      context:'Het schema toont de naamvallen van de o-declinatie (ἄνθρωπος) en hun functies. Gebruik het bij de grammaticavragen.',
      afb:_VGRAFB.naamval, afb_cap:'de naamvallen van ἄνθρωπος en hun functies' },
    { nr:3, titel:'Interpretatie en stijl',
      context:'De figuur laat het contrast zien: Prometheus als weldoener van de mensen tegenover Zeus, die boos wordt en straft.',
      afb:_VGRAFB.mythe, afb_cap:'Prometheus, het vuur en de toorn van Zeus' },
    { nr:4, titel:'Cultuur (KCV)',
      context:'Prometheus is in de Griekse cultuur een beroemde figuur geworden. De vraag hieronder gaat over de betekenis van de mythe.',
      afb:_VGRAFB.mythe, afb_cap:'Prometheus als cultuurheld' },
  ],
  vragen: [
    // Opgave 1 (vertalen)
    { nr:1, opgave:1, punten:4, type:'open', domein:'Vertalen',
      vraag:'Vertaal regel 3 tot en met 4 in het Nederlands: "ὁ οὖν Προμηθεὺς τὸ πῦρ ἔκλεψεν καὶ τοῖς ἀνθρώποις ἔδωκεν."',
      antwoord:'Een correcte vertaling: "Dus (οὖν) stal (ἔκλεψεν) Prometheus (ὁ Προμηθεὺς) het vuur (τὸ πῦρ) en gaf het (ἔδωκεν) aan de mensen (τοῖς ἀνθρώποις)." Let op: "οὖν" is een partikel dat een gevolg aangeeft (dus/daarom); "τὸ πῦρ" is accusativus (lijdend voorwerp); "ἔκλεψεν" en "ἔδωκεν" zijn aoristusvormen (verleden tijd, 3e persoon enkelvoud); "τοῖς ἀνθρώποις" is dativus (meewerkend voorwerp: aan de mensen).',
      antwoord_rubric:'1 punt: "ὁ οὖν Προμηθεὺς" correct (dus/daarom Prometheus). 1 punt: "τὸ πῦρ ἔκλεψεν" correct (stal het vuur, acc + aoristus). 1 punt: "τοῖς ἀνθρώποις" correct als datief (aan de mensen). 1 punt: "ἔδωκεν" correct (gaf, aoristus 3e ev.).' },
    // Opgave 2 (grammatica)
    { nr:2, opgave:2, punten:2, type:'open', domein:'Grammatica',
      vraag:'Benoem van "τοῖς ἀνθρώποις" (regel 4) de naamval, het getal en de functie in de zin.',
      antwoord:'"Τοῖς ἀνθρώποις" is dativus pluralis (derde naamval, meervoud) van ὁ ἄνθρωπος. De functie in de zin "τοῖς ἀνθρώποις ἔδωκεν" is meewerkend voorwerp (indirect object): het geeft aan aan wie Prometheus het vuur gaf, namelijk aan de mensen. Het lidwoord "τοῖς" en de uitgang "-οις" markeren de datief meervoud van de o-declinatie.',
      antwoord_rubric:'1 punt: dativus pluralis (van ἄνθρωπος). 1 punt: functie = meewerkend voorwerp (bij ἔδωκεν: aan de mensen).' },
    { nr:3, opgave:2, punten:2, type:'open', domein:'Grammatica',
      vraag:'Benoem de werkwoordsvorm "ἔκλεψεν" (regel 3) zo volledig mogelijk: persoon, getal, tijd en wijs, en leg uit waaraan je de tijd herkent.',
      antwoord:'"Ἔκλεψεν" is de 3e persoon enkelvoud aoristus (verleden tijd), indicativus (aantonende wijs), actief, van κλέπτω (stelen). Je herkent de aoristus aan (1) het augment ἐ- aan het begin (ἔ-κλεψεν), dat een verleden tijd markeert, en (2) de sigma-aoristusstam (κλεψ-, met de kenletter σ) plus de uitgang -εν. Het betekent "hij stal / heeft gestolen" en drukt een eenmalige, afgeronde handeling in het verleden uit.',
      antwoord_rubric:'1 punt: 3e persoon enkelvoud, indicativus, actief. 1 punt: aoristus, herkend aan augment ἐ- en/of sigma-stam (eenmalige handeling in het verleden).' },
    // Opgave 3 (stijl/interpretatie)
    { nr:4, opgave:3, punten:2, type:'open', domein:'Stijl',
      vraag:'De tekst zet Prometheus en Zeus tegenover elkaar. Leg uit welke tegenstelling de schrijver opbouwt, en welk Grieks partikel (regel 5) deze tegenstelling markeert.',
      antwoord:'De schrijver bouwt een tegenstelling (antithese) op tussen Prometheus, de weldoener/vriend van de mensen (φίλος τῶν ἀνθρώπων), die hun het vuur geeft, en Zeus, de oppergod, die daar juist boos om wordt en Prometheus straft. Prometheus staat aan de kant van de mensen, Zeus aan de kant van de goden die de mensen dat vuur niet gunden. Deze tegenstelling wordt gemarkeerd door het partikel "δέ" in regel 5 ("ὁ δὲ Ζεὺς ὠργίζετο"): "δέ" zet Zeus (en zijn toorn) af tegen het voorafgaande handelen van Prometheus. Vaak staat hier het paar μέν... δέ, maar ook een los "δέ" drukt de tegenstelling uit.',
      antwoord_rubric:'1 punt: antithese Prometheus (weldoener van de mensen) tegenover Zeus (boze god die straft). 1 punt: het partikel "δέ" (regel 5) benoemd als markering van de tegenstelling.' },
    // Opgave 4 (KCV)
    { nr:5, opgave:4, punten:2, type:'open', domein:'Cultuur',
      vraag:'Prometheus wordt vaak een "cultuurheld" of "weldoener van de mensheid" genoemd. Leg met de tekst en de figuur uit waarom, en welk thema (bijvoorbeeld vooruitgang of verzet tegen de goden) de mythe illustreert.',
      antwoord:'Prometheus wordt een cultuurheld genoemd omdat hij de mensheid iets fundamenteels schenkt dat de beschaving mogelijk maakt: het vuur. Met vuur konden mensen zich warmen, koken, gereedschap en wapens smeden; het vuur staat symbool voor kennis, techniek en vooruitgang. In de tekst en de figuur is te zien dat Prometheus het vuur van de goden steelt en aan de machteloze mensen geeft (τοῖς ἀνθρώποις ἔδωκεν), terwijl Zeus dit juist wil verhinderen en hem straft. Het thema is dus dubbel: enerzijds vooruitgang en de beschaving die de mens aan Prometheus dankt, anderzijds het verzet tegen de goddelijke orde en de prijs die daarvoor betaald wordt (Prometheus wordt gestraft). Prometheus staat zo symbool voor de mens die kennis en vrijheid najaagt, ook tegen de wil van hogere machten in.',
      antwoord_rubric:'1 punt: waarom weldoener/cultuurheld: hij geeft het vuur = symbool voor kennis/techniek/beschaving/vooruitgang. 1 punt: het thema uitgewerkt (vooruitgang en/of verzet tegen de goden, met de straf als keerzijde), met tekst/figuur erbij.' },
  ],
};
