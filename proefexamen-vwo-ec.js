// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-ec.js  ORIGINEEL Slagio-proefexamen (vwo economie).
// Eigen contexten, vragen en figuren. Geen reproductie van een CvTE-examen.
// VWO-CE-niveau: markt (vraag/aanbod, heffing, elasticiteit), marktvormen,
// speltheorie (Nash), inkomensverdeling (Lorenz) en ruilen over tijd.
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

var _VECAFB = {
  // Markt met vraag, aanbod, evenwicht en een heffing (wig)
  markt:(function(){
    // p van 0..10, q van 0..100. Vraag: p=10-0.1q. Aanbod: p=0.1q. Even: q=50,p=5.
    var sx=function(q){return 56+q/100*284;}, sy=function(p){return 150-p/10*120;};
    var yl=[0,2,4,6,8,10].map(p=>'<line x1="56" y1="'+sy(p).toFixed(1)+'" x2="340" y2="'+sy(p).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(p)+3).toFixed(1)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="end">'+p+'</text>').join('');
    var xl=[0,20,40,60,80,100].map(q=>'<text x="'+sx(q).toFixed(1)+'" y="166" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+q+'</text>').join('');
    var vraag='<line x1="'+sx(0)+'" y1="'+sy(10)+'" x2="'+sx(100)+'" y2="'+sy(0)+'" stroke="#2563eb" stroke-width="2.6"/><text x="'+sx(88)+'" y="'+(sy(0.6))+'" font-family="sans-serif" font-size="9" font-weight="700" fill="#2563eb">V</text>';
    var aanbod='<line x1="'+sx(0)+'" y1="'+sy(0)+'" x2="'+sx(100)+'" y2="'+sy(10)+'" stroke="#e8580c" stroke-width="2.6"/><text x="'+sx(90)+'" y="'+(sy(9.6))+'" font-family="sans-serif" font-size="9" font-weight="700" fill="#e8580c">A</text>';
    // evenwicht q=50,p=5
    var ev='<line x1="'+sx(50)+'" y1="'+sy(5)+'" x2="'+sx(50)+'" y2="150" stroke="#94a0b8" stroke-width="1" stroke-dasharray="4 4"/><line x1="56" y1="'+sy(5)+'" x2="'+sx(50)+'" y2="'+sy(5)+'" stroke="#94a0b8" stroke-width="1" stroke-dasharray="4 4"/><circle cx="'+sx(50)+'" cy="'+sy(5)+'" r="3.4" fill="#1b2230"/>';
    return '<svg viewBox="0 0 360 194" role="img" aria-label="vraag en aanbod op een markt">'+yl+'<line x1="56" y1="14" x2="56" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M56 14 L52 24 L60 24 Z" fill="#1b2230"/><line x1="56" y1="150" x2="342" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M342 150 L334 146 L334 154 Z" fill="#1b2230"/>'+vraag+aanbod+ev+xl+'<text x="0" y="0" transform="translate(16,84) rotate(-90)" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">prijs (euro)</text><text x="250" y="184" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">hoeveelheid (x1000)</text></svg>';
  })(),
  // Markt na kostprijsverhogende heffing: aanbod schuift omhoog met 3 euro
  heffing:(function(){
    var sx=function(q){return 56+q/100*284;}, sy=function(p){return 150-p/12*128;};
    var yl=[0,3,6,9,12].map(p=>'<line x1="56" y1="'+sy(p).toFixed(1)+'" x2="340" y2="'+sy(p).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(p)+3).toFixed(1)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="end">'+p+'</text>').join('');
    var xl=[0,20,40,60,80,100].map(q=>'<text x="'+sx(q).toFixed(1)+'" y="166" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+q+'</text>').join('');
    var vraag='<line x1="'+sx(0)+'" y1="'+sy(10)+'" x2="'+sx(100)+'" y2="'+sy(0)+'" stroke="#2563eb" stroke-width="2.6"/><text x="'+sx(90)+'" y="'+(sy(0.4))+'" font-family="sans-serif" font-size="9" font-weight="700" fill="#2563eb">V</text>';
    // A oud: p=0.1q ; A nieuw: p=0.1q+3
    var a1='<line x1="'+sx(0)+'" y1="'+sy(0)+'" x2="'+sx(90)+'" y2="'+sy(9)+'" stroke="#e8580c" stroke-width="2.2" stroke-dasharray="5 4"/><text x="'+sx(80)+'" y="'+(sy(8.6))+'" font-family="sans-serif" font-size="8.5" fill="#e8580c">A</text>';
    var a2='<line x1="'+sx(0)+'" y1="'+sy(3)+'" x2="'+sx(80)+'" y2="'+sy(11)+'" stroke="#c2410c" stroke-width="2.6"/><text x="'+sx(70)+'" y="'+(sy(11))+'" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#c2410c">A+heffing</text>';
    // nieuw evenwicht: 10-0.1q = 0.1q+3 -> 0.2q=7 -> q=35, p=6.5
    var ev='<circle cx="'+sx(35)+'" cy="'+sy(6.5)+'" r="3.4" fill="#1b2230"/><line x1="'+sx(35)+'" y1="'+sy(6.5)+'" x2="'+sx(35)+'" y2="150" stroke="#94a0b8" stroke-width="1" stroke-dasharray="4 4"/>';
    return '<svg viewBox="0 0 360 194" role="img" aria-label="markt met een kostprijsverhogende heffing">'+yl+'<line x1="56" y1="14" x2="56" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M56 14 L52 24 L60 24 Z" fill="#1b2230"/><line x1="56" y1="150" x2="342" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M342 150 L334 146 L334 154 Z" fill="#1b2230"/>'+vraag+a1+a2+ev+xl+'<text x="0" y="0" transform="translate(16,84) rotate(-90)" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">prijs (euro)</text><text x="250" y="184" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">hoeveelheid (x1000)</text></svg>';
  })(),
  // Speltheorie payoff-matrix (2x2)
  spel:`<svg viewBox="0 0 360 176" role="img" aria-label="uitkomstenmatrix van twee bedrijven">
    <text x="180" y="16" font-family="sans-serif" font-size="10" font-weight="800" fill="#1b2230" text-anchor="middle">winst (bedrijf A , bedrijf B), in mln euro</text>
    <text x="150" y="40" font-family="sans-serif" font-size="9" font-weight="700" fill="#2563eb" text-anchor="middle">B: lage prijs</text>
    <text x="272" y="40" font-family="sans-serif" font-size="9" font-weight="700" fill="#2563eb" text-anchor="middle">B: hoge prijs</text>
    <text x="66" y="78" font-family="sans-serif" font-size="9" font-weight="700" fill="#e8580c" text-anchor="middle">A: lage</text>
    <text x="66" y="90" font-family="sans-serif" font-size="9" font-weight="700" fill="#e8580c" text-anchor="middle">prijs</text>
    <text x="66" y="128" font-family="sans-serif" font-size="9" font-weight="700" fill="#e8580c" text-anchor="middle">A: hoge</text>
    <text x="66" y="140" font-family="sans-serif" font-size="9" font-weight="700" fill="#e8580c" text-anchor="middle">prijs</text>
    <g stroke="#1b2230" stroke-width="1.4" fill="none">
      <rect x="94" y="50" width="112" height="48" fill="#eef4ff"/><rect x="206" y="50" width="112" height="48" fill="#fff"/>
      <rect x="94" y="98" width="112" height="48" fill="#fff"/><rect x="206" y="98" width="112" height="48" fill="#eafaf0"/>
    </g>
    <text x="150" y="79" font-family="sans-serif" font-size="11" font-weight="800" fill="#1b2230" text-anchor="middle">4 , 4</text>
    <text x="262" y="79" font-family="sans-serif" font-size="11" font-weight="800" fill="#1b2230" text-anchor="middle">9 , 2</text>
    <text x="150" y="127" font-family="sans-serif" font-size="11" font-weight="800" fill="#1b2230" text-anchor="middle">2 , 9</text>
    <text x="262" y="127" font-family="sans-serif" font-size="11" font-weight="800" fill="#1b2230" text-anchor="middle">7 , 7</text>
  </svg>`,
  // Lorenzcurve
  lorenz:(function(){
    var sx=function(x){return 56+x/100*268;}, sy=function(y){return 150-y/100*128;};
    var gl=[0,25,50,75,100];
    var yl=gl.map(y=>'<line x1="56" y1="'+sy(y).toFixed(1)+'" x2="324" y2="'+sy(y).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(y)+3).toFixed(1)+'" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="end">'+y+'</text>').join('');
    var xl=gl.map(x=>'<text x="'+sx(x).toFixed(1)+'" y="164" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">'+x+'</text>').join('');
    var diag='<line x1="'+sx(0)+'" y1="'+sy(0)+'" x2="'+sx(100)+'" y2="'+sy(100)+'" stroke="#94a0b8" stroke-width="1.4" stroke-dasharray="5 4"/><text x="'+sx(64)+'" y="'+(sy(78))+'" font-family="sans-serif" font-size="8" fill="#7a8699" transform="rotate(-33 '+sx(64)+' '+sy(78)+')">volledige gelijkheid</text>';
    // Lorenz voor: punten 0,25,50,75,100 -> 0,8,22,45,100
    var vlst=[[0,0],[25,8],[50,22],[75,45],[100,100]];
    var v='<polyline points="'+vlst.map(p=>sx(p[0]).toFixed(1)+','+sy(p[1]).toFixed(1)).join(' ')+'" fill="none" stroke="#2563eb" stroke-width="2.6"/><text x="'+sx(58)+'" y="'+(sy(18))+'" font-family="sans-serif" font-size="8" font-weight="700" fill="#2563eb">voor</text>';
    // Lorenz na herverdeling: 0,14,33,58,100
    var nlst=[[0,0],[25,14],[50,33],[75,58],[100,100]];
    var n='<polyline points="'+nlst.map(p=>sx(p[0]).toFixed(1)+','+sy(p[1]).toFixed(1)).join(' ')+'" fill="none" stroke="#2e9e5b" stroke-width="2.6"/><text x="'+sx(30)+'" y="'+(sy(26))+'" font-family="sans-serif" font-size="8" font-weight="700" fill="#2e9e5b">na</text>';
    return '<svg viewBox="0 0 360 190" role="img" aria-label="lorenzcurve voor en na herverdeling">'+yl+'<line x1="56" y1="14" x2="56" y2="150" stroke="#1b2230" stroke-width="1.6"/><path d="M56 14 L52 24 L60 24 Z" fill="#1b2230"/><line x1="56" y1="150" x2="326" y2="150" stroke="#1b2230" stroke-width="1.6"/><path d="M326 150 L318 146 L318 154 Z" fill="#1b2230"/>'+diag+v+n+xl+'<text x="0" y="0" transform="translate(16,84) rotate(-90)" font-family="sans-serif" font-size="7.5" font-weight="800" fill="#1b2230" text-anchor="middle">% van inkomen</text><text x="230" y="182" font-family="sans-serif" font-size="7.5" font-weight="800" fill="#1b2230" text-anchor="middle">% van huishoudens (arm naar rijk)</text></svg>';
  })(),
  // Ruilen over tijd: toekomstige vs contante waarde
  rente:`<svg viewBox="0 0 360 176" role="img" aria-label="contante waarde van een bedrag over de tijd"><line x1="40" y1="120" x2="330" y2="120" stroke="#1b2230" stroke-width="1.6"/><path d="M330 120 L322 116 L322 124 Z" fill="#1b2230"/>
    <g font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="middle"><line x1="70" y1="116" x2="70" y2="124" stroke="#1b2230"/><text x="70" y="136">nu (t=0)</text><line x1="170" y1="116" x2="170" y2="124" stroke="#1b2230"/><text x="170" y="136">t=1</text><line x1="270" y1="116" x2="270" y2="124" stroke="#1b2230"/><text x="270" y="136">t=2</text></g>
    <rect x="234" y="70" width="72" height="34" rx="4" fill="#eafaf0" stroke="#2e9e5b" stroke-width="1.4"/><text x="270" y="91" font-family="sans-serif" font-size="10" font-weight="800" fill="#1b7a41" text-anchor="middle">1000 euro</text>
    <rect x="42" y="70" width="60" height="34" rx="4" fill="#eef4ff" stroke="#2563eb" stroke-width="1.4"/><text x="72" y="91" font-family="sans-serif" font-size="10" font-weight="800" fill="#1b4fb0" text-anchor="middle">CW = ?</text>
    <path d="M234 87 C 170 40, 120 40, 104 82" fill="none" stroke="#e8580c" stroke-width="1.8" stroke-dasharray="5 4"/><path d="M104 82 L108 72 L114 78 Z" fill="#e8580c"/>
    <text x="168" y="46" font-family="sans-serif" font-size="9" font-weight="700" fill="#e8580c" text-anchor="middle">verdisconteren, i = 5% per jaar</text>
    <text x="180" y="162" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="middle">tijdlijn (jaren)</text></svg>`,
};

SLAGIO_EXAMENS.vwo.ec = {
  origineel: true,
  titel: 'Economie',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 150,
  max_punten: 25,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'De markt voor kweekvlees',
      context:'Op de markt voor kweekvlees geldt voor de gevraagde hoeveelheid Qv = 100 - 10p en voor de aangeboden hoeveelheid Qa = 10p (p in euro per kilo, Q in duizenden kilo). Afbeelding 1 toont beide lijnen.',
      afb:_VECAFB.markt, afb_cap:'afbeelding 1: vraag (V) en aanbod (A) op de markt voor kweekvlees' },
    { nr:2, titel:'Een heffing op kweekvlees',
      context:'De overheid legt een kostprijsverhogende heffing van 3 euro per kilo op de producenten. Afbeelding 2 toont de oude aanbodlijn (gestippeld) en de nieuwe aanbodlijn A+heffing.',
      afb:_VECAFB.heffing, afb_cap:'afbeelding 2: de markt na de heffing van 3 euro per kilo' },
    { nr:3, titel:'Een prijzenoorlog',
      context:'Twee supermarktketens A en B kiezen onafhankelijk van elkaar tussen een lage en een hoge prijs. Afbeelding 3 toont hun jaarwinst (A, B) bij elke combinatie.',
      afb:_VECAFB.spel, afb_cap:'afbeelding 3: de uitkomstenmatrix (winst A, winst B)' },
    { nr:4, titel:'Inkomens herverdeeld',
      context:'Afbeelding 4 toont de Lorenzcurve van de inkomens in een land, voor en na belastingheffing en uitkeringen.',
      afb:_VECAFB.lorenz, afb_cap:'afbeelding 4: Lorenzcurve voor en na herverdeling' },
    { nr:5, titel:'Nu of later',
      context:'Een bedrijf mag kiezen: 1000 euro over 2 jaar ontvangen, of vandaag een bedrag. De rente is 5% per jaar (samengesteld). Afbeelding 5 illustreert het verdisconteren naar de contante waarde (CW).',
      afb:_VECAFB.rente, afb_cap:'afbeelding 5: het verdisconteren van 1000 euro naar de contante waarde' },
  ],
  vragen: [
    // Opgave 1
    { nr:1, opgave:1, punten:3, type:'open', domein:'Markt',
      vraag:'Bereken met de vergelijkingen de evenwichtsprijs en de evenwichtshoeveelheid, en bereken de totale omzet in het evenwicht.',
      antwoord:'In het evenwicht geldt Qv = Qa: 100 - 10p = 10p, dus 100 = 20p en p = 5 euro per kilo. Invullen: Q = 10 · 5 = 50 (duizend kilo). Omzet = p · Q = 5 · 50.000 = 250.000 euro (of 5 euro/kilo · 50.000 kilo).',
      antwoord_rubric:'1 punt: Qv = Qa gelijkstellen. 1 punt: p = 5 euro en Q = 50 (x1000). 1 punt: omzet = p·Q = 250.000 euro.' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Markt',
      vraag:'Bereken de prijselasticiteit van de vraag bij de evenwichtsprijs, en leg met de uitkomst uit of de vraag daar elastisch of inelastisch is.',
      antwoord:'Ev = (dQ/dp)·(p/Q). Uit Qv = 100 - 10p volgt dQ/dp = -10. Bij p = 5 en Q = 50: Ev = -10 · (5/50) = -10 · 0,1 = -1,0. De absolute waarde is precies 1, dus de vraag is hier exact eenheidselastisch (op de grens tussen elastisch en inelastisch): een prijsstijging van 1% doet de gevraagde hoeveelheid met 1% dalen.',
      antwoord_rubric:'1 punt: Ev = (dQ/dp)·(p/Q) = -10·(5/50). 1 punt: Ev = -1,0 dus (eenheids)elastisch, met correcte interpretatie.' },
    // Opgave 2
    { nr:3, opgave:2, punten:3, type:'open', domein:'Markt',
      vraag:'Bereken de nieuwe evenwichtsprijs en -hoeveelheid na de heffing, en bepaal hoeveel van de heffing van 3 euro de consument betaalt (de consumentenlast per kilo).',
      antwoord:'De nieuwe aanbodlijn is p = 0,1·Q + 3, oftewel Qa = 10p - 30. Gelijkstellen aan de vraag Qv = 100 - 10p: 100 - 10p = 10p - 30, dus 130 = 20p en p = 6,50 euro. Q = 100 - 10·6,50 = 35 (duizend kilo). De consument betaalde eerst 5 euro en nu 6,50 euro, dus de consumentenlast is 6,50 - 5 = 1,50 euro per kilo (de andere 1,50 euro draagt de producent).',
      antwoord_rubric:'1 punt: nieuwe aanbodlijn Qa = 10p - 30 (of p = 0,1Q + 3). 1 punt: p = 6,50 euro en Q = 35. 1 punt: consumentenlast = 6,50 - 5 = 1,50 euro per kilo.' },
    { nr:4, opgave:2, punten:2, type:'open', domein:'Markt',
      vraag:'Bereken de totale belastingopbrengst voor de overheid na invoering van de heffing.',
      antwoord:'De opbrengst = heffing per kilo · verkochte hoeveelheid = 3 euro · 35.000 kilo = 105.000 euro.',
      antwoord_rubric:'1 punt: opbrengst = heffing · nieuwe hoeveelheid. 1 punt: = 3 · 35.000 = 105.000 euro.' },
    // Opgave 3
    { nr:5, opgave:3, punten:3, type:'open', domein:'Marktvormen',
      vraag:'Toon met afbeelding 3 aan dat "beide een lage prijs" het Nash-evenwicht is, door voor beide bedrijven te laten zien dat afwijken niet loont.',
      antwoord:'In een Nash-evenwicht heeft geen van beide er baat bij als enige van strategie te wisselen. Stel B kiest een lage prijs. Dan krijgt A bij een lage prijs 4 en bij een hoge prijs 2; A kiest dus de lage prijs. Stel A kiest een lage prijs. Dan krijgt B bij een lage prijs 4 en bij een hoge prijs 2; B kiest ook de lage prijs. Bij (lage prijs, lage prijs) wil dus geen van beiden eenzijdig afwijken: dit is het Nash-evenwicht.',
      antwoord_rubric:'1 punt: definitie/idee dat niemand eenzijdig wil afwijken. 1 punt: A wijkt niet af (4 > 2 gegeven B laag). 1 punt: B wijkt niet af (4 > 2 gegeven A laag).' },
    { nr:6, opgave:3, punten:2, type:'open', domein:'Marktvormen',
      vraag:'De uitkomst (hoge prijs, hoge prijs) levert samen meer winst op. Leg uit waarom de bedrijven daar toch niet terechtkomen, en noem een manier waarop ze dat wel zouden kunnen bereiken.',
      antwoord:'Bij (hoog, hoog) krijgt elk bedrijf 7, samen 14, meer dan de 8 bij (laag, laag). Toch komen ze daar niet, omdat elk bedrijf individueel de prikkel heeft om af te wijken naar een lage prijs (dan stijgt de eigen winst van 7 naar 9). Omdat allebei zo redeneren, belanden ze in het slechtere (laag, laag): een gevangenendilemma. Ze zouden (hoog, hoog) kunnen bereiken door bindende afspraken te maken (een kartel/samenwerking), bijvoorbeeld via een handhaafbaar contract of herhaalde interactie met afspraken, hoewel prijsafspraken meestal verboden zijn.',
      antwoord_rubric:'1 punt: elk heeft individuele prikkel af te wijken (7 -> 9) -> gevangenendilemma. 1 punt: oplossing via bindende afspraak/kartel/samenwerking (herhaald spel).' },
    // Opgave 4
    { nr:7, opgave:4, punten:3, type:'open', domein:'Inkomen',
      vraag:'Leg met afbeelding 4 uit wat de Lorenzcurve laat zien, en beredeneer of de inkomens na herverdeling gelijker of ongelijker verdeeld zijn dan ervoor.',
      antwoord:'De Lorenzcurve zet het cumulatieve percentage huishoudens (van arm naar rijk) uit tegen het cumulatieve percentage van het totale inkomen dat zij samen verdienen. De rechte diagonaal is volledige gelijkheid; hoe verder de curve daaronder doorbuigt, hoe ongelijker. De curve "na" ligt dichter bij de diagonaal dan de curve "voor" (bijvoorbeeld: de armste 50% heeft 33% in plaats van 22% van het inkomen). De inkomens zijn na herverdeling dus gelijker verdeeld: belastingen en uitkeringen hebben de ongelijkheid verkleind.',
      antwoord_rubric:'1 punt: uitleg assen (cumulatief % huishoudens tegen cumulatief % inkomen) en diagonaal = gelijkheid. 1 punt: "na" ligt dichter bij de diagonaal (concreet cijfer genoemd). 1 punt: conclusie gelijker verdeeld door herverdeling.' },
    { nr:8, opgave:4, punten:2, type:'open', domein:'Inkomen',
      vraag:'De Ginicoefficient is de verhouding tussen het oppervlak tussen de diagonaal en de Lorenzcurve, en het hele oppervlak onder de diagonaal. Leg uit wat er met de Ginicoefficient gebeurt door de herverdeling.',
      antwoord:'Doordat de curve "na" dichter bij de diagonaal ligt, wordt het oppervlak tussen de diagonaal en de Lorenzcurve kleiner. De Ginicoefficient (dat oppervlak gedeeld door het driehoekoppervlak onder de diagonaal) daalt dus. Een lagere Ginicoefficient (dichter bij 0) betekent een gelijkere inkomensverdeling.',
      antwoord_rubric:'1 punt: oppervlak tussen diagonaal en curve wordt kleiner. 1 punt: Ginicoefficient daalt (dichter bij 0 = gelijker).' },
    // Opgave 5
    { nr:9, opgave:5, punten:3, type:'open', domein:'Ruil over tijd',
      vraag:'Bereken de contante waarde (CW) van 1000 euro die je pas over 2 jaar ontvangt, bij een rente van 5% per jaar. Rond af op hele euro.',
      antwoord:'Verdisconteren over 2 jaar: CW = toekomstige waarde / (1 + i)^n = 1000 / (1,05)^2 = 1000 / 1,1025 = 907 euro (afgerond). Dat is het bedrag dat, tegen 5% samengestelde rente, in 2 jaar aangroeit tot 1000 euro.',
      antwoord_rubric:'1 punt: CW = 1000 / (1,05)^2. 1 punt: (1,05)^2 = 1,1025. 1 punt: CW = 907 euro (afgerond).' },
    { nr:10, opgave:5, punten:2, type:'open', domein:'Ruil over tijd',
      vraag:'Het bedrijf krijgt vandaag een alternatief aanbod van 920 euro contant. Beredeneer met de contante waarde welk aanbod financieel het beste is.',
      antwoord:'Beide opties moeten op hetzelfde moment vergeleken worden, dus vandaag. De contante waarde van "1000 euro over 2 jaar" is 907 euro. Het alternatief is 920 euro vandaag, en 920 > 907. Het bedrijf kan dus beter de 920 euro vandaag nemen: die is contant meer waard dan de 1000 euro over 2 jaar.',
      antwoord_rubric:'1 punt: beide op t=0 vergelijken via CW (907 euro tegenover 920 euro). 1 punt: conclusie 920 euro vandaag is beter (920 > 907).' },
  ],
};
