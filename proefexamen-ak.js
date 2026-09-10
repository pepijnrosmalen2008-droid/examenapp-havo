// ═══════════════════════════════════════════════════════════════════════
// proefexamen-ak.js — ORIGINEEL Slagio-proefexamen in examenstijl (havo ak).
// Eigen contexten, vragen en figuren. Géén reproductie van een CvTE-examen.
// CE-niveau: kaart-/diagramanalyse en geografisch redeneren (oorzaak-gevolg,
// spreiding, samenhang). Elke opgave heeft een diagram/grafiek/doorsnede.
//   opgaven[] = {nr,titel,context,afb,afb_cap}
//   vragen[]  = {nr,opgave,punten,type,vraag,antwoord,antwoord_rubric,domein}
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.havo = SLAGIO_EXAMENS.havo || {};

var _AKAFB = {
  // Klimaatdiagram: neerslagstaven (blauw) + temperatuurlijn (rood), mediterraan
  klimaat:(function(){
    var P=[70,65,55,50,40,20,10,15,45,80,90,85];      // neerslag mm
    var T=[9,10,12,15,19,24,27,27,23,18,13,10];        // temperatuur °C
    var mnd=['J','F','M','A','M','J','J','A','S','O','N','D'];
    var x0=52, w=21, base=158;
    var bars=P.map(function(p,i){var h=p/100*130;var x=x0+i*24+2;return '<rect x="'+x+'" y="'+(base-h).toFixed(1)+'" width="'+w+'" height="'+h.toFixed(1)+'" fill="#5b9bd5"/>';}).join('');
    var pts=T.map(function(t,i){var x=x0+i*24+12;var y=base-t/30*130;return x.toFixed(0)+','+y.toFixed(1);}).join(' ');
    var lbl=mnd.map(function(m,i){return '<text x="'+(x0+i*24+12)+'" y="172">'+m+'</text>';}).join('');
    return '<svg viewBox="0 0 360 196" role="img" aria-label="klimaatdiagram met neerslag en temperatuur"><line x1="52" y1="14" x2="52" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/><line x1="52" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M344 158 L334 154 L334 162 Z" fill="#1b2230"/>'+bars+'<polyline points="'+pts+'" fill="none" stroke="#e05353" stroke-width="2.6"/><g font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">'+lbl+'</g><text x="0" y="0" transform="translate(16,96) rotate(-90)" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#5b9bd5" text-anchor="middle">neerslag (mm)</text><text x="0" y="0" transform="translate(352,96) rotate(-90)" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#e05353" text-anchor="middle">temperatuur (°C)</text></svg>';
  })(),
  // Bevolkingspiramide met brede basis (jonge bevolking)
  piramide:(function(){
    var M=[62,52,44,36,29,22,15,9,4];  // mannen % (breedte)
    var lab=['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80+'];
    var cx=180, base=150, bh=14, gap=2;
    var rows=M.map(function(w,i){var y=base-i*(bh+gap)-bh;return '<rect x="'+(cx-4-w).toFixed(0)+'" y="'+y+'" width="'+w+'" height="'+bh+'" fill="#2563eb"/><rect x="'+(cx+4)+'" y="'+y+'" width="'+(w-3).toFixed(0)+'" height="'+bh+'" fill="#e8580c"/><text x="'+cx+'" y="'+(y+11)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+lab[i]+'</text>';}).join('');
    return '<svg viewBox="0 0 360 176" role="img" aria-label="bevolkingspiramide met brede basis">'+rows+'<g font-family="sans-serif" font-size="10.5" font-weight="700"><text x="96" y="170" fill="#2563eb" text-anchor="middle">mannen</text><text x="264" y="170" fill="#e8580c" text-anchor="middle">vrouwen</text></g><text x="0" y="0" transform="translate(24,80) rotate(-90)" font-family="sans-serif" font-size="9" fill="#8a94a8" text-anchor="middle">leeftijdsgroep</text></svg>';
  })(),
  // Subductie-blokdiagram: oceanische plaat duikt onder continentale
  subductie:`<svg viewBox="0 0 360 190" role="img" aria-label="blokdiagram van subductie"><rect x="20" y="60" width="320" height="112" fill="#f3ede2"/><rect x="20" y="60" width="150" height="20" fill="#bfe0ef"/><path d="M20 80 L170 80 L250 150 L340 150 L340 172 L20 172 Z" fill="#c9a06a" opacity="0.5"/><path d="M20 84 L168 84 Q230 96 250 150" fill="none" stroke="#3a4a63" stroke-width="6" stroke-linecap="round"/><path d="M170 80 L340 80" stroke="#7a5a34" stroke-width="5"/><polygon points="238,80 258,80 248,58" fill="#8a3a2a"/><path d="M248 58 q-4 -8 2 -14" stroke="#8a94a8" stroke-width="2" fill="none"/><g stroke="#1b2230" stroke-width="1.6" fill="none"><line x1="90" y1="46" x2="120" y2="46"/><path d="M114 42 L122 46 L114 50"/><line x1="300" y1="46" x2="270" y2="46"/><path d="M276 42 L268 46 L276 50"/></g><g font-family="sans-serif" font-size="9.5" fill="#1b2230"><text x="40" y="76">oceanische plaat</text><text x="272" y="76" text-anchor="end">continentale plaat</text><text x="248" y="52" text-anchor="middle" font-weight="700" fill="#8a3a2a">vulkaan</text><text x="196" y="140" text-anchor="middle" fill="#3a4a63">trog</text></g></svg>`,
  // Verstedelijking: % stedelijke bevolking, twee groepen landen
  verstedelijking:`<svg viewBox="0 0 360 196" role="img" aria-label="percentage stedelijke bevolking over de tijd"><g stroke="#e6e9ef" stroke-width="1">${Array.from({length:5},(_,i)=>{var y=150-i*30;return '<line x1="52" y1="'+y+'" x2="336" y2="'+y+'"/>';}).join('')}</g><line x1="52" y1="14" x2="52" y2="150" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/><line x1="52" y1="150" x2="340" y2="150" stroke="#1b2230" stroke-width="2"/><path d="M340 150 L330 146 L330 154 Z" fill="#1b2230"/><path d="M56,66 Q160,50 240,44 L332,40" fill="none" stroke="#2563eb" stroke-width="2.8"/><path d="M56,138 Q170,120 250,80 L332,52" fill="none" stroke="#e8580c" stroke-width="2.8"/><g font-family="sans-serif" font-size="9.5" font-weight="700"><text x="150" y="58" fill="#2563eb">hoge-inkomenslanden</text><text x="150" y="112" fill="#e8580c">lage-inkomenslanden</text></g><g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="end">${[0,25,50,75,100].map((v,i)=>'<text x="46" y="'+(154-i*30)+'">'+v+'</text>').join('')}</g><g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="middle"><text x="56" y="166">1960</text><text x="194" y="166">1990</text><text x="332" y="166">2020</text></g><text x="0" y="0" transform="translate(18,90) rotate(-90)" font-family="sans-serif" font-size="9" font-weight="700" fill="#1b2230" text-anchor="middle">% in de stad</text></svg>`,
  // Dwarsdoorsnede rivier met uiterwaarden, zomer- en winterdijk
  rivier:`<svg viewBox="0 0 360 176" role="img" aria-label="dwarsdoorsnede van een rivier met dijken"><rect x="0" y="120" width="360" height="56" fill="#e8e2d4"/><path d="M20 120 L70 120 L84 104 L108 104 L108 120 L252 120 L252 104 L276 104 L290 120 L340 120" fill="#cdbf9e" stroke="#8a7a54" stroke-width="1.4"/><rect x="120" y="120" width="120" height="22" fill="#5b9bd5"/><rect x="108" y="120" width="12" height="14" fill="#bfe0ef"/><rect x="240" y="120" width="12" height="14" fill="#bfe0ef"/><line x1="108" y1="120" x2="252" y2="120" stroke="#7aa9cf" stroke-width="1" stroke-dasharray="3 3"/><g font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle"><text x="180" y="135" fill="#fff">zomerbed</text><text x="96" y="100">zomerdijk</text><text x="264" y="100">zomerdijk</text><text x="47" y="116">winterdijk</text><text x="313" y="116">winterdijk</text><text x="120" y="152" fill="#6a5a34">uiterwaard</text><text x="240" y="152" fill="#6a5a34">uiterwaard</text></g></svg>`,
  // Demografische transitie: geboorte- en sterftecijfer over 4 fasen
  dtm:`<svg viewBox="0 0 360 196" role="img" aria-label="demografisch transitiemodel"><line x1="52" y1="14" x2="52" y2="150" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/><line x1="52" y1="150" x2="340" y2="150" stroke="#1b2230" stroke-width="2"/><path d="M340 150 L330 146 L330 154 Z" fill="#1b2230"/><g stroke="#c9cfda" stroke-width="1" stroke-dasharray="3 4">${[123,194,265].map(x=>'<line x1="'+x+'" y1="14" x2="'+x+'" y2="150"/>').join('')}</g><path d="M60,40 L123,42 Q160,44 194,96 L265,120 L332,122" fill="none" stroke="#e05353" stroke-width="2.8"/><path d="M60,44 Q100,60 123,104 L194,116 L265,118 L332,116" fill="none" stroke="#2563eb" stroke-width="2.8"/><g font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle"><text x="88" y="164">fase 1</text><text x="158" y="164">fase 2</text><text x="230" y="164">fase 3</text><text x="300" y="164">fase 4</text></g><g font-family="sans-serif" font-size="9.5" font-weight="700"><text x="60" y="34" fill="#e05353">geboortecijfer</text><text x="60" y="188" fill="#2563eb">sterftecijfer (blauw)</text></g><text x="0" y="0" transform="translate(18,84) rotate(-90)" font-family="sans-serif" font-size="9" font-weight="700" fill="#1b2230" text-anchor="middle">per 1000 inw.</text></svg>`,
};

SLAGIO_EXAMENS.havo.ak = {
  origineel: true,
  titel: 'Aardrijkskunde',
  niveau: 'havo',
  jaar: new Date().getFullYear(),
  duur_minuten: 90,
  max_punten: 27,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Een klimaat aflezen',
      context:'Afbeelding 1 is het klimaatdiagram van een stad: de blauwe staven geven de gemiddelde neerslag per maand, de rode lijn de gemiddelde temperatuur.',
      afb:_AKAFB.klimaat, afb_cap:'afbeelding 1 — klimaatdiagram (neerslag en temperatuur per maand)' },
    { nr:2, titel:'De opbouw van een bevolking',
      context:'Afbeelding 2 is de bevolkingspiramide van een land: links de mannen, rechts de vrouwen, per leeftijdsgroep.',
      afb:_AKAFB.piramide, afb_cap:'afbeelding 2 — bevolkingspiramide van het land' },
    { nr:3, titel:'Waar platen botsen',
      context:'Afbeelding 3 is een blokdiagram van de grens tussen een oceanische en een continentale plaat, die naar elkaar toe bewegen.',
      afb:_AKAFB.subductie, afb_cap:'afbeelding 3 — blokdiagram van de plaatgrens' },
    { nr:4, titel:'Iedereen naar de stad',
      context:'Afbeelding 4 toont het percentage van de bevolking dat in steden woont, voor hoge-inkomenslanden en lage-inkomenslanden, tussen 1960 en 2020.',
      afb:_AKAFB.verstedelijking, afb_cap:'afbeelding 4 — aandeel stedelijke bevolking over de tijd' },
    { nr:5, titel:'Ruimte voor de rivier',
      context:'Afbeelding 5 is een dwarsdoorsnede van een Nederlandse rivier met een zomerbed, uiterwaarden en twee soorten dijken.',
      afb:_AKAFB.rivier, afb_cap:'afbeelding 5 — dwarsdoorsnede van de rivier' },
    { nr:6, titel:'Bevolkingsgroei in fasen',
      context:'Afbeelding 6 is het demografisch transitiemodel: het geboortecijfer (rood) en het sterftecijfer (blauw) per 1000 inwoners over vier fasen.',
      afb:_AKAFB.dtm, afb_cap:'afbeelding 6 — het demografisch transitiemodel' },
  ],
  vragen: [
    // ── Opgave 1 · Klimaat ──
    { nr:1, opgave:1, punten:3, type:'open', domein:'Klimaat',
      vraag:'Beschrijf met afbeelding 1 twee kenmerken van dit klimaat: in welke maanden valt de minste neerslag, en hoe is dan de temperatuur? Bepaal daarna welk klimaattype hierbij past.',
      antwoord:'De minste neerslag valt in de zomermaanden (juni, juli, augustus): daar zijn de staven het laagst (± 10–20 mm). Juist in die maanden is de temperatuur het hoogst (± 24–27 °C). Een warme, droge zomer en een natte, mildere winter is kenmerkend voor het mediterrane (Middellandse-Zeeklimaat, Csa) klimaat.',
      antwoord_rubric:'1 punt: droogte in de zomermaanden (jun–aug) afgelezen. 1 punt: in die maanden juist de hoogste temperatuur. 1 punt: conclusie mediterraan / Middellandse-Zeeklimaat (Cs).' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Klimaat',
      vraag:'Leg uit waarom de landbouw in dit klimaat in de zomer afhankelijk is van irrigatie (kunstmatige besproeiing).',
      antwoord:'In de zomer is het warm, waardoor er veel water verdampt, terwijl er juist dan bijna geen neerslag valt (zie de lage staven in jun–aug). De planten krijgen dan van nature te weinig water. Om gewassen toch te laten groeien, moeten boeren in de zomer kunstmatig water aanvoeren (irrigatie).',
      antwoord_rubric:'1 punt: in de zomer weinig neerslag én veel verdamping door de hitte. 1 punt: daardoor te weinig water voor de gewassen → irrigatie nodig.' },
    // ── Opgave 2 · Bevolking ──
    { nr:3, opgave:2, punten:2, type:'open', domein:'Bevolking',
      vraag:'Beschrijf de vorm van de piramide in afbeelding 2 en leg uit wat de brede basis zegt over het geboortecijfer.',
      antwoord:'De piramide heeft een brede basis en loopt snel smaller naar boven toe (een driehoeksvorm). De brede basis betekent dat er veel jonge kinderen (0–9 jaar) zijn ten opzichte van oudere groepen; dat wijst op een hoog geboortecijfer: er worden veel kinderen geboren.',
      antwoord_rubric:'1 punt: brede basis, snel smaller naar boven (driehoek). 1 punt: veel jonge kinderen → hoog geboortecijfer.' },
    { nr:4, opgave:2, punten:2, type:'open', domein:'Bevolking',
      vraag:'Deze bevolkingsopbouw hoort bij een land met een jonge bevolking. Leg uit welk gevolg deze opbouw heeft voor de behoefte aan voorzieningen in de nabije toekomst.',
      antwoord:'Omdat er veel kinderen en jongeren zijn, is er vooral behoefte aan voorzieningen voor de jeugd: scholen, onderwijzers en kinderzorg. En omdat die grote groep jongeren over enkele jaren volwassen wordt, zullen er daarna veel banen, woningen en gezondheidszorg nodig zijn. De druk op onderwijs (nu) en werk/woningen (straks) neemt dus toe.',
      antwoord_rubric:'1 punt: veel jongeren → veel behoefte aan onderwijs/scholen (nu). 1 punt: die groep wordt volwassen → straks veel vraag naar werk/woningen/zorg.' },
    // ── Opgave 3 · Endogeen ──
    { nr:5, opgave:3, punten:2, type:'open', domein:'Endogeen',
      vraag:'Leg met afbeelding 3 uit waarom juist de oceanische plaat onder de continentale plaat duikt en niet andersom.',
      antwoord:'De oceanische plaat is dunner maar bestaat uit zwaarder (dichter) gesteente dan de continentale plaat, die dikker en lichter is. Waar de twee botsen, zakt de zwaardere oceanische plaat onder de lichtere continentale plaat weg (subductie).',
      antwoord_rubric:'1 punt: oceanische plaat is zwaarder/dichter dan de continentale plaat. 1 punt: daarom duikt de zwaardere oceanische plaat onder de lichtere continentale weg.' },
    { nr:6, opgave:3, punten:3, type:'open', domein:'Endogeen',
      vraag:'Bij zo\'n plaatgrens komen vulkanen voor (zie afbeelding 3). Beschrijf de keten van gebeurtenissen die verklaart hoe de wegduikende plaat tot vulkanisme aan het oppervlak leidt.',
      antwoord:'De oceanische plaat duikt de diepte in en komt daar in een hete omgeving terecht. Op grote diepte smelt (een deel van) het gesteente tot magma. Dit magma is lichter dan het omringende gesteente en stijgt op. Waar het magma het aardoppervlak bereikt, komt het als lava naar buiten: er ontstaat een vulkaan.',
      antwoord_rubric:'1 punt: de plaat duikt de diepte in / komt in een hete zone. 1 punt: daar smelt gesteente tot magma. 1 punt: magma stijgt op en bereikt het oppervlak → vulkaan.' },
    // ── Opgave 4 · Verstedelijking ──
    { nr:7, opgave:4, punten:2, type:'open', domein:'Verstedelijking',
      vraag:'Vergelijk met afbeelding 4 de verstedelijking van de hoge- en de lage-inkomenslanden tussen 1960 en 2020. Beschrijf twee verschillen.',
      antwoord:'Verschil 1: de hoge-inkomenslanden waren in 1960 al sterk verstedelijkt (rond 60%) en groeien daarna maar langzaam verder (de lijn vlakt af rond 80%). Verschil 2: de lage-inkomenslanden begonnen laag (rond 20%) maar verstedelijken juist heel snel; het percentage stijgt steil. De achterstand wordt dus kleiner: de lage-inkomenslanden halen in.',
      antwoord_rubric:'1 punt: hoge-inkomenslanden al hoog in 1960 en vlakken af. 1 punt: lage-inkomenslanden starten laag maar stijgen snel (halen in).' },
    { nr:8, opgave:4, punten:2, type:'open', domein:'Verstedelijking',
      vraag:'Noem één pushfactor van het platteland en één pullfactor van de stad die de snelle verstedelijking in lage-inkomenslanden verklaren.',
      antwoord:'Pushfactor (platteland): bijvoorbeeld armoede, werkloosheid, misoogsten of gebrek aan voorzieningen op het platteland, waardoor mensen wegtrekken. Pullfactor (stad): bijvoorbeeld de hoop op werk/hoger inkomen, betere scholen, ziekenhuizen of voorzieningen in de stad, wat mensen aantrekt.',
      antwoord_rubric:'1 punt: een geldige pushfactor van het platteland (armoede/werkloosheid/misoogst/weinig voorzieningen). 1 punt: een geldige pullfactor van de stad (werk/inkomen/onderwijs/voorzieningen).' },
    // ── Opgave 5 · Water ──
    { nr:9, opgave:5, punten:2, type:'open', domein:'Water',
      vraag:'Leg met afbeelding 5 uit welke functie de uiterwaarden hebben bij een hoge waterstand van de rivier.',
      antwoord:'Bij een hoge waterstand kan het water niet meer alleen in het zomerbed. Het water loopt dan over de lage zomerdijken de uiterwaarden in, die tussen de zomer- en winterdijk liggen. De uiterwaarden geven de rivier zo extra ruimte om het water te bergen en af te voeren, zodat de hoge winterdijken het achterland beschermen tegen overstroming.',
      antwoord_rubric:'1 punt: bij hoogwater stroomt het water de uiterwaarden in (over de zomerdijk). 1 punt: de uiterwaarden geven extra ruimte voor waterberging/afvoer → bescherming achterland.' },
    { nr:10, opgave:5, punten:2, type:'open', domein:'Water',
      vraag:'In het programma "Ruimte voor de Rivier" worden op sommige plekken de dijken landinwaarts verlegd of de uiterwaarden verlaagd. Leg uit hoe deze maatregel het overstromingsrisico verkleint.',
      antwoord:'Door de dijken verder naar achteren te leggen of de uiterwaarden af te graven, wordt het gebied waarin de rivier zijn water kwijt kan groter. Bij hoogwater kan het water zich dan over een breder/dieper gebied verspreiden, waardoor de waterstand minder hoog oploopt. Lagere waterstanden geven minder druk op de dijken en dus een kleiner overstromingsrisico.',
      antwoord_rubric:'1 punt: de rivier krijgt meer ruimte / een grotere doorstroomruimte. 1 punt: daardoor stijgt het water minder hoog → kleiner overstromingsrisico.' },
    // ── Opgave 6 · Demografische transitie ──
    { nr:11, opgave:6, punten:3, type:'open', domein:'Bevolking',
      vraag:'In welke fase van afbeelding 6 is de natuurlijke bevolkingsgroei het grootst? Onderbouw je antwoord met het verloop van beide lijnen in die fase.',
      antwoord:'In fase 2. In fase 2 is het sterftecijfer al sterk gedaald (betere voeding, hygiëne en gezondheidszorg), terwijl het geboortecijfer nog hoog is. Het verschil tussen de rode lijn (geboorte) en de blauwe lijn (sterfte) is in fase 2 het grootst, en dat verschil is de natuurlijke bevolkingsgroei. Daarom groeit de bevolking daar het snelst.',
      antwoord_rubric:'1 punt: fase 2. 1 punt: sterftecijfer al gedaald terwijl geboortecijfer nog hoog is. 1 punt: het (grootste) verschil tussen de lijnen = natuurlijke groei.' },
    { nr:12, opgave:6, punten:2, type:'open', domein:'Bevolking',
      vraag:'Leg uit waarom in fase 4 de bevolking nauwelijks meer groeit, ook al is het sterftecijfer laag.',
      antwoord:'In fase 4 is niet alleen het sterftecijfer laag, maar is ook het geboortecijfer sterk gedaald tot ongeveer hetzelfde niveau. Omdat geboorte- en sterftecijfer weer dicht bij elkaar liggen, is het verschil (de natuurlijke groei) klein: er worden ongeveer evenveel mensen geboren als er overlijden, dus de bevolking blijft vrijwel gelijk.',
      antwoord_rubric:'1 punt: in fase 4 is óók het geboortecijfer laag (gedaald). 1 punt: geboorte- en sterftecijfer liggen dicht bij elkaar → klein verschil → nauwelijks groei.' },
  ],
};
