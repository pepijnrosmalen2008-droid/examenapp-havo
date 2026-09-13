// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-in.js  ORIGINEEL Slagio-proefexamen (vwo informatica).
// Eigen contexten, vragen en figuren. Geen reproductie van een CvTE-examen.
// VWO-niveau: algoritmiek (pseudocode/flowchart, complexiteit), getal-
// systemen en logica, relationele databases (ER + SQL) en zoekalgoritmen.
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

var _VINAFB = {
  // Flowchart: som van even getallen 1..N
  flow:`<svg viewBox="0 0 360 208" role="img" aria-label="stroomschema van een algoritme">
    <defs><marker id="in_arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#1b2230"/></marker></defs>
    <g font-family="sans-serif" font-size="8.5" fill="#1b2230" text-anchor="middle">
      <ellipse cx="120" cy="18" rx="40" ry="13" fill="#eef4ff" stroke="#2563eb" stroke-width="1.4"/><text x="120" y="21">start</text>
      <rect x="80" y="40" width="80" height="22" rx="3" fill="#fff" stroke="#1b2230" stroke-width="1.3"/><text x="120" y="54">som=0; i=1</text>
      <polygon points="120,72 172,94 120,116 68,94" fill="#fdf2e2" stroke="#e8a530" stroke-width="1.4"/><text x="120" y="90">i &lt;= N?</text><text x="120" y="101" font-size="7">(nee: naar eind)</text>
      <rect x="60" y="126" width="120" height="22" rx="3" fill="#fff" stroke="#1b2230" stroke-width="1.3"/><text x="120" y="140">als i even: som=som+i</text>
      <rect x="80" y="158" width="80" height="20" rx="3" fill="#fff" stroke="#1b2230" stroke-width="1.3"/><text x="120" y="171">i = i + 1</text>
      <ellipse cx="284" cy="94" rx="46" ry="13" fill="#eafaf0" stroke="#2e9e5b" stroke-width="1.4"/><text x="284" y="97">toon som</text>
    </g>
    <g stroke="#1b2230" stroke-width="1.3" fill="none">
      <line x1="120" y1="31" x2="120" y2="40" marker-end="url(#in_arr)"/>
      <line x1="120" y1="62" x2="120" y2="72" marker-end="url(#in_arr)"/>
      <line x1="120" y1="116" x2="120" y2="126" marker-end="url(#in_arr)"/><text x="130" y="124" font-family="sans-serif" font-size="7.5" fill="#2e9e5b">ja</text>
      <line x1="120" y1="148" x2="120" y2="158" marker-end="url(#in_arr)"/>
      <path d="M80 168 H40 V94 H68" marker-end="url(#in_arr)"/><text x="34" y="130" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">terug</text>
      <line x1="172" y1="94" x2="238" y2="94" marker-end="url(#in_arr)"/><text x="205" y="88" font-family="sans-serif" font-size="7.5" fill="#c0392b" text-anchor="middle">nee</text>
    </g>
    <text x="180" y="202" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figuur 1: stroomschema (som van de even getallen 1 t/m N)</text></svg>`,
  // Waarheidstabel + logische poort
  logica:`<svg viewBox="0 0 360 180" role="img" aria-label="waarheidstabel en logische poort">
    <text x="96" y="18" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">waarheidstabel: X = (A EN B) OF C</text>
    <g font-family="monospace" font-size="9" fill="#1b2230" text-anchor="middle">
      <rect x="16" y="26" width="160" height="18" fill="#eef4ff"/>
      <text x="34" y="39">A</text><text x="70" y="39">B</text><text x="106" y="39">C</text><text x="150" y="39">X</text>
      <g>
        <text x="34" y="57">0</text><text x="70" y="57">0</text><text x="106" y="57">0</text><text x="150" y="57" fill="#c0392b">0</text>
        <text x="34" y="73">1</text><text x="70" y="73">1</text><text x="106" y="73">0</text><text x="150" y="73" fill="#2e9e5b">1</text>
        <text x="34" y="89">0</text><text x="70" y="89">1</text><text x="106" y="89">1</text><text x="150" y="89" fill="#2e9e5b">1</text>
        <text x="34" y="105">1</text><text x="70" y="105">0</text><text x="106" y="105">0</text><text x="150" y="105" fill="#c0392b">0</text>
      </g>
    </g>
    <line x1="16" y1="44" x2="176" y2="44" stroke="#c9d2e0" stroke-width="1"/><line x1="128" y1="26" x2="128" y2="112" stroke="#c9d2e0" stroke-width="1"/>
    <g transform="translate(214,54)">
      <text x="60" y="-18" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">schema</text>
      <path d="M10 0 h22 a16 16 0 0 1 0 32 h-22 z" fill="#eafaf0" stroke="#2e9e5b" stroke-width="1.4"/><text x="26" y="20" font-family="sans-serif" font-size="8" fill="#1b7a41" text-anchor="middle">EN</text>
      <line x1="0" y1="8" x2="10" y2="8" stroke="#1b2230" stroke-width="1.2"/><text x="-6" y="11" font-family="monospace" font-size="8" text-anchor="end">A</text>
      <line x1="0" y1="24" x2="10" y2="24" stroke="#1b2230" stroke-width="1.2"/><text x="-6" y="27" font-family="monospace" font-size="8" text-anchor="end">B</text>
      <path d="M64 4 q 14 12 0 24 q 6 -12 0 -24" fill="#eef4ff" stroke="#2563eb" stroke-width="1.4"/><path d="M66 4 q 12 12 0 24" fill="#eef4ff" stroke="#2563eb" stroke-width="1.4"/><text x="74" y="19" font-family="sans-serif" font-size="7.5" fill="#1b4fb0" text-anchor="middle">OF</text>
      <line x1="48" y1="16" x2="64" y2="10" stroke="#1b2230" stroke-width="1.2"/>
      <line x1="40" y1="48" x2="66" y2="26" stroke="#1b2230" stroke-width="1.2"/><text x="34" y="51" font-family="monospace" font-size="8" text-anchor="end">C</text>
      <line x1="80" y1="16" x2="96" y2="16" stroke="#1b2230" stroke-width="1.2"/><text x="102" y="19" font-family="monospace" font-size="8">X</text>
    </g>
    <text x="180" y="174" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figuur 2: waarheidstabel (deels) en logisch schema van X</text></svg>`,
  // ER-diagram
  er:`<svg viewBox="0 0 360 178" role="img" aria-label="er-diagram van een database">
    <g font-family="sans-serif" font-size="8.5" text-anchor="middle">
      <rect x="20" y="40" width="90" height="58" rx="4" fill="#eef4ff" stroke="#2563eb" stroke-width="1.5"/><text x="65" y="55" font-weight="800" fill="#1b4fb0">LEERLING</text><line x1="20" y1="60" x2="110" y2="60" stroke="#2563eb" stroke-width="1"/><text x="65" y="74" font-size="7.5" fill="#1b2230">leerlingnr (PK)</text><text x="65" y="86" font-size="7.5" fill="#1b2230">naam, klas</text>
      <rect x="135" y="40" width="90" height="58" rx="4" fill="#eafaf0" stroke="#2e9e5b" stroke-width="1.5"/><text x="180" y="55" font-weight="800" fill="#1b7a41">CIJFER</text><line x1="135" y1="60" x2="225" y2="60" stroke="#2e9e5b" stroke-width="1"/><text x="180" y="72" font-size="7.5" fill="#1b2230">leerlingnr (FK)</text><text x="180" y="83" font-size="7.5" fill="#1b2230">vakcode (FK)</text><text x="180" y="94" font-size="7.5" fill="#1b2230">waarde</text>
      <rect x="250" y="40" width="90" height="58" rx="4" fill="#fdf2e2" stroke="#e8a530" stroke-width="1.5"/><text x="295" y="55" font-weight="800" fill="#b3760f">VAK</text><line x1="250" y1="60" x2="340" y2="60" stroke="#e8a530" stroke-width="1"/><text x="295" y="74" font-size="7.5" fill="#1b2230">vakcode (PK)</text><text x="295" y="86" font-size="7.5" fill="#1b2230">vaknaam</text>
    </g>
    <g stroke="#1b2230" stroke-width="1.3"><line x1="110" y1="69" x2="135" y2="69"/><line x1="225" y1="69" x2="250" y2="69"/></g>
    <text x="122" y="64" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">1</text><text x="128" y="80" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">N</text>
    <text x="238" y="64" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">N</text><text x="244" y="80" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">1</text>
    <text x="180" y="124" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">PK = primaire sleutel, FK = verwijzende (foreign) sleutel</text>
    <text x="180" y="146" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">een leerling heeft veel cijfers; elk cijfer hoort bij een vak</text>
    <text x="180" y="170" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figuur 3: relationeel model (ER-diagram)</text></svg>`,
  // Binair zoeken
  zoeken:(function(){
    var arr=[3,8,12,19,25,31,40,55]; // gesorteerd, zoek 40
    var sx=function(i){return 44+i*38;};
    var cells=arr.map((v,i)=>{
      var found=(v===40);
      return '<rect x="'+(sx(i)-16)+'" y="60" width="32" height="26" rx="3" fill="'+(found?'#eafaf0':'#fff')+'" stroke="'+(found?'#2e9e5b':'#1b2230')+'" stroke-width="'+(found?'1.8':'1.2')+'"/>'+
        '<text x="'+sx(i)+'" y="77" font-family="monospace" font-size="9" fill="#1b2230" text-anchor="middle">'+v+'</text>'+
        '<text x="'+sx(i)+'" y="100" font-family="sans-serif" font-size="7" fill="#94a0b8" text-anchor="middle">'+i+'</text>';
    }).join('');
    // pointers: lo=0, hi=7, mid=3 (19) stap1; dan lo=4,hi=7,mid=5(31) stap2; dan lo=6,hi=7,mid=6(40) stap3
    var p1='<text x="'+sx(3)+'" y="52" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#2563eb" text-anchor="middle">mid (stap 1)</text><line x1="'+sx(3)+'" y1="54" x2="'+sx(3)+'" y2="60" stroke="#2563eb" stroke-width="1.4"/>';
    var p2='<text x="'+sx(5)+'" y="118" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#e8580c" text-anchor="middle">mid (stap 2)</text><line x1="'+sx(5)+'" y1="86" x2="'+sx(5)+'" y2="112" stroke="#e8580c" stroke-width="1.4"/>';
    var p3='<text x="'+sx(6)+'" y="40" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#2e9e5b" text-anchor="middle">stap 3: gevonden!</text><line x1="'+sx(6)+'" y1="42" x2="'+sx(6)+'" y2="60" stroke="#2e9e5b" stroke-width="1.4"/>';
    return '<svg viewBox="0 0 360 150" role="img" aria-label="binair zoeken naar de waarde 40">'+
      '<text x="180" y="20" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">binair zoeken naar 40 in een gesorteerde rij</text>'+
      cells+p1+p2+p3+
      '<text x="180" y="140" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figuur 4: elke stap halveert het zoekgebied (index onder de cel)</text></svg>';
  })(),
};

SLAGIO_EXAMENS.vwo.in = {
  origineel: true,
  titel: 'Informatica',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 150,
  max_punten: 16,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Een algoritme lezen',
      context:'Figuur 1 is een stroomschema van een algoritme dat de som berekent van alle even getallen van 1 tot en met N.',
      afb:_VINAFB.flow, afb_cap:'figuur 1: stroomschema van het algoritme' },
    { nr:2, titel:'Getallen en logica',
      context:'In een computer worden getallen binair opgeslagen en beslissingen genomen met logische poorten. Figuur 2 toont een deel van de waarheidstabel en het schema van X = (A EN B) OF C.',
      afb:_VINAFB.logica, afb_cap:'figuur 2: waarheidstabel en logisch schema' },
    { nr:3, titel:'Een database ontwerpen',
      context:'Figuur 3 is het relationele model (ER-diagram) van een cijferadministratie met de tabellen LEERLING, CIJFER en VAK.',
      afb:_VINAFB.er, afb_cap:'figuur 3: het ER-diagram' },
    { nr:4, titel:'Zoeken in een gesorteerde rij',
      context:'Figuur 4 toont hoe het binair-zoekalgoritme de waarde 40 zoekt in een gesorteerde rij van 8 getallen.',
      afb:_VINAFB.zoeken, afb_cap:'figuur 4: binair zoeken naar 40' },
  ],
  vragen: [
    // Opgave 1
    { nr:1, opgave:1, punten:2, type:'open', domein:'Algoritmiek',
      vraag:'Voer het algoritme in figuur 1 met de hand uit voor N = 6. Geef de waarde van "som" na afloop en laat je tussenstappen zien.',
      antwoord:'We beginnen met som = 0 en i = 1. We tellen alleen even i op. i loopt van 1 tot en met 6: i=1 (oneven, som blijft 0); i=2 (even, som = 0+2 = 2); i=3 (oneven, som = 2); i=4 (even, som = 2+4 = 6); i=5 (oneven, som = 6); i=6 (even, som = 6+6 = 12). Bij i=7 is i <= N niet meer waar (7 > 6), dus het algoritme stopt. De uitkomst is som = 12 (namelijk 2 + 4 + 6).',
      antwoord_rubric:'1 punt: correct alleen de even getallen 2, 4, 6 optellen. 1 punt: eindwaarde som = 12 (met zichtbare tussenstappen).' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Complexiteit',
      vraag:'De lus wordt N keer doorlopen. Geef de tijdcomplexiteit van dit algoritme in Big-O-notatie en leg uit waarom.',
      antwoord:'De tijdcomplexiteit is O(N) (lineair). De lus wordt precies N keer doorlopen (i gaat van 1 tot en met N), en binnen de lus wordt telkens een constant aantal bewerkingen gedaan (een controle of i even is en eventueel een optelling). Het aantal bewerkingen groeit dus recht evenredig met N: verdubbel je N, dan verdubbelt ongeveer de looptijd. Daarom is de complexiteit O(N).',
      antwoord_rubric:'1 punt: O(N) / lineair. 1 punt: uitleg (lus N keer, constant werk per keer -> looptijd evenredig met N).' },
    // Opgave 2
    { nr:3, opgave:2, punten:2, type:'open', domein:'Getalsystemen',
      vraag:'Reken het binaire getal 101101 om naar een decimaal (tientallig) getal. Laat je berekening zien.',
      antwoord:'Elk bit staat voor een macht van 2 (van rechts naar links: 1, 2, 4, 8, 16, 32). Voor 101101: 1x32 + 0x16 + 1x8 + 1x4 + 0x2 + 1x1 = 32 + 0 + 8 + 4 + 0 + 1 = 45. Het binaire getal 101101 is dus decimaal 45.',
      antwoord_rubric:'1 punt: juiste plaatswaarden/machten van 2 gebruikt (32,16,8,4,2,1). 1 punt: uitkomst 45.' },
    { nr:4, opgave:2, punten:2, type:'open', domein:'Logica',
      vraag:'Vul voor de logische functie X = (A EN B) OF C de ontbrekende regel van de waarheidstabel in: wat is X als A = 0, B = 0 en C = 1? Leg je antwoord uit.',
      antwoord:'X = (A EN B) OF C. Vul in: A = 0, B = 0, C = 1. Eerst (A EN B) = (0 EN 0) = 0 (EN is alleen 1 als beide 1 zijn). Dan X = 0 OF 1 = 1 (OF is 1 als minstens een van beide 1 is). Dus X = 1. Omdat C = 1 is, is de hele OF-uitdrukking al waar, ongeacht A en B.',
      antwoord_rubric:'1 punt: (A EN B) = 0 correct berekend. 1 punt: X = 0 OF 1 = 1 (met uitleg dat C=1 de OF waar maakt).' },
    // Opgave 3
    { nr:5, opgave:3, punten:2, type:'open', domein:'Databases',
      vraag:'Leg met figuur 3 uit waarom "leerlingnr" in de tabel CIJFER een verwijzende sleutel (foreign key) is, en wat de relatie tussen LEERLING en CIJFER betekent (1 op N).',
      antwoord:'In de tabel CIJFER is "leerlingnr" een foreign key omdat het verwijst naar de primaire sleutel "leerlingnr" in de tabel LEERLING. Zo koppelt elk cijfer aan de leerling die het gehaald heeft, zonder de gegevens van die leerling (naam, klas) te herhalen. De relatie tussen LEERLING en CIJFER is 1 op N (een-op-veel): een leerling kan veel cijfers hebben (voor verschillende vakken en toetsen), maar elk cijfer in de tabel CIJFER hoort bij precies een leerling. Daarom staat de foreign key aan de "veel"-kant (in CIJFER).',
      antwoord_rubric:'1 punt: foreign key verwijst naar de primaire sleutel leerlingnr in LEERLING (koppeling zonder herhaling). 1 punt: 1 op N uitgelegd (een leerling veel cijfers, elk cijfer een leerling).' },
    { nr:6, opgave:3, punten:2, type:'open', domein:'SQL',
      vraag:'Schrijf een SQL-query die de naam van elke leerling toont samen met zijn cijfers, door de tabellen LEERLING en CIJFER te koppelen (join op leerlingnr).',
      antwoord:'Een correcte query, bijvoorbeeld: SELECT LEERLING.naam, CIJFER.waarde FROM LEERLING INNER JOIN CIJFER ON LEERLING.leerlingnr = CIJFER.leerlingnr; Hiermee worden de twee tabellen gekoppeld op het gemeenschappelijke veld leerlingnr, en toont de query per rij de naam van de leerling met de bijbehorende cijferwaarde. (Ook goed: een variant met WHERE LEERLING.leerlingnr = CIJFER.leerlingnr, of met tabelaliassen.)',
      antwoord_rubric:'1 punt: SELECT van naam en (cijfer)waarde uit de twee tabellen. 1 punt: correcte join/koppeling op leerlingnr (JOIN ... ON of WHERE-gelijkheid).' },
    // Opgave 4
    { nr:7, opgave:4, punten:2, type:'open', domein:'Zoekalgoritmen',
      vraag:'Volg in figuur 4 het binair zoeken naar 40. Beschrijf per stap welk element in het midden wordt bekeken en of het zoekgebied naar links of naar rechts gaat, tot 40 is gevonden.',
      antwoord:'De rij is gesorteerd: 3, 8, 12, 19, 25, 31, 40, 55 (index 0 t/m 7). Stap 1: lo = 0, hi = 7, midden = index 3 = 19. 40 > 19, dus we zoeken rechts: lo wordt 4. Stap 2: lo = 4, hi = 7, midden = index 5 = 31. 40 > 31, dus weer rechts: lo wordt 6. Stap 3: lo = 6, hi = 7, midden = index 6 = 40. 40 = 40: gevonden! In drie stappen is 40 gevonden, omdat elke stap het zoekgebied ongeveer halveert.',
      antwoord_rubric:'1 punt: stap 1 midden = 19 -> naar rechts, stap 2 midden = 31 -> naar rechts. 1 punt: stap 3 midden = 40 gevonden (in 3 stappen door halveren).' },
    { nr:8, opgave:4, punten:2, type:'open', domein:'Complexiteit',
      vraag:'Vergelijk de tijdcomplexiteit van binair zoeken met die van lineair zoeken (element voor element). Geef beide in Big-O-notatie en leg uit waarom binair zoeken sneller is bij grote, gesorteerde rijen.',
      antwoord:'Lineair zoeken heeft complexiteit O(N): in het slechtste geval moet je alle N elementen een voor een langslopen. Binair zoeken heeft complexiteit O(log N): omdat het bij elke stap het zoekgebied halveert, is het aantal stappen ongeveer de 2-logaritme van N. Voor grote rijen is dat enorm veel sneller: bij bijvoorbeeld 1.000.000 elementen kijkt lineair zoeken in het slechtste geval naar een miljoen elementen, terwijl binair zoeken al na ongeveer 20 stappen klaar is (want 2^20 is ongeveer een miljoen). De voorwaarde is wel dat de rij gesorteerd is, anders kan binair zoeken niet worden gebruikt.',
      antwoord_rubric:'1 punt: lineair = O(N), binair = O(log N). 1 punt: uitleg waarom binair sneller is bij grote rijen (halveren -> log N stappen, bv. miljoen in ongeveer 20 stappen), mits gesorteerd.' },
  ],
};
