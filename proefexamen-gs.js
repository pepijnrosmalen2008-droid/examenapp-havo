// ═══════════════════════════════════════════════════════════════════════
// proefexamen-gs.js — ORIGINEEL Slagio-proefexamen in examenstijl (havo gs).
// Eigen contexten, vragen en (schematische) bronnen. Géén reproductie van een
// CvTE-examen of van bestaande bronnen. CE-niveau geschiedenis: chronologie,
// oorzaak/aanleiding, oorzaak-gevolgketens, bronnenkritiek en perspectief.
// Elke opgave heeft een tijdbalk/schema/grafiek. Meervoudige rubric per vraag.
//   opgaven[] = {nr,titel,context,afb,afb_cap}
//   vragen[]  = {nr,opgave,punten,type,vraag,antwoord,antwoord_rubric,domein}
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.havo = SLAGIO_EXAMENS.havo || {};

// Tijdbalk-helper: events = [[jaar,'label','boven'|'onder'], ...]
function _gsTijdbalk(minJ, maxJ, ticks, events){
  var sx=function(j){return 44+(j-minJ)/(maxJ-minJ)*286;};
  var line='<line x1="40" y1="86" x2="342" y2="86" stroke="#1b2230" stroke-width="2.4"/><path d="M342 86 L332 81 L332 91 Z" fill="#1b2230"/>';
  var tk=ticks.map(function(j){return '<line x1="'+sx(j).toFixed(0)+'" y1="82" x2="'+sx(j).toFixed(0)+'" y2="90" stroke="#1b2230" stroke-width="1.2"/><text x="'+sx(j).toFixed(0)+'" y="104" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">'+j+'</text>';}).join('');
  var ev=events.map(function(e){var x=sx(e[0]);var boven=e[2]!=='onder';
    // Bij 'boven' stopt de verbindingslijn onder het label; bij 'onder' erboven.
    var y2=boven?62:110; var ty=boven?42:150;
    return '<line x1="'+x.toFixed(0)+'" y1="86" x2="'+x.toFixed(0)+'" y2="'+y2+'" stroke="#2563eb" stroke-width="1.4"/><circle cx="'+x.toFixed(0)+'" cy="86" r="3.4" fill="#e8580c"/>'+
           '<text x="'+x.toFixed(0)+'" y="'+ty+'" font-family="sans-serif" font-size="8.6" font-weight="700" fill="#1b2230" text-anchor="middle">'+e[0]+'</text>'+
           '<text x="'+x.toFixed(0)+'" y="'+(ty+11)+'" font-family="sans-serif" font-size="8.2" fill="#4a5568" text-anchor="middle">'+e[1]+'</text>';}).join('');
  return '<svg viewBox="0 0 360 168" role="img" aria-label="tijdbalk">'+line+tk+ev+'</svg>';
}

var _GSAFB = {
  chrono:_gsTijdbalk(1900,2000,[1900,1920,1940,1960,1980,2000],[
    [1914,'begin WO I','boven'],[1929,'Beurskrach','onder'],[1945,'einde WO II','boven'],[1949,'NAVO','onder'],[1989,'val Muur','boven']]),
  // Oorzaak-gevolgschema WO I
  oorzaken:`<svg viewBox="0 0 360 184" role="img" aria-label="oorzaak-gevolgschema van de Eerste Wereldoorlog"><g font-family="sans-serif" font-size="9.5" fill="#1b2230">${[['nationalisme',20],['bondgenootschappen',68],['wapenwedloop',116]].map(function(b){return '<rect x="14" y="'+b[1]+'" width="104" height="38" rx="7" fill="#eef4ff" stroke="#2563eb" stroke-width="1.3"/><text x="66" y="'+(b[1]+23)+'" text-anchor="middle">'+b[0]+'</text>';}).join('')}</g><g stroke="#94a0b8" stroke-width="1.5" fill="none">${[39,87,135].map(y=>'<path d="M118 '+y+' L150 92"/>').join('')}<path d="M256 92 L272 92"/><path d="M262 87 L272 92 L262 97" fill="#94a0b8"/></g><rect x="150" y="70" width="104" height="44" rx="7" fill="#fff7ed" stroke="#e8580c" stroke-width="1.4"/><text x="202" y="88" font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle">aanleiding:</text><text x="202" y="100" font-family="sans-serif" font-size="8.6" fill="#1b2230" text-anchor="middle">moord in Sarajevo</text><text x="202" y="110" font-family="sans-serif" font-size="8.6" fill="#4a5568" text-anchor="middle">(1914)</text><rect x="274" y="70" width="76" height="44" rx="7" fill="#fdecec" stroke="#d1382f" stroke-width="1.4"/><text x="312" y="89" font-family="sans-serif" font-size="9" font-weight="700" fill="#1b2230" text-anchor="middle">Eerste</text><text x="312" y="101" font-family="sans-serif" font-size="9" font-weight="700" fill="#1b2230" text-anchor="middle">Wereldoorlog</text><text x="66" y="14" font-family="sans-serif" font-size="9" font-weight="800" fill="#2563eb" text-anchor="middle">langetermijnoorzaken</text></svg>`,
  // Werkloosheidsgrafiek jaren '30
  werkloosheid:(function(){
    var data=[[1929,9],[1930,15],[1931,23],[1932,30],[1933,26],[1934,15],[1935,12],[1936,8]];
    var sx=function(j){return 56+(j-1929)/7*270;};
    var sy=function(p){return 158-p/35*128;};
    var yl=[0,10,20,30].map(v=>'<line x1="56" y1="'+sy(v).toFixed(1)+'" x2="340" y2="'+sy(v).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(v)+3).toFixed(1)+'" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="end">'+v+'</text>').join('');
    var line='<polyline points="'+data.map(d=>sx(d[0]).toFixed(1)+','+sy(d[1]).toFixed(1)).join(' ')+'" fill="none" stroke="#d1382f" stroke-width="2.8"/>';
    var xl=data.filter((d,i)=>i%2===0).map(d=>'<text x="'+sx(d[0]).toFixed(0)+'" y="172" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="middle">'+d[0]+'</text>').join('');
    return '<svg viewBox="0 0 360 196" role="img" aria-label="werkloosheid in de jaren dertig">'+yl+'<line x1="56" y1="14" x2="56" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M56 14 L52 24 L60 24 Z" fill="#1b2230"/><line x1="56" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M344 158 L334 154 L334 162 Z" fill="#1b2230"/>'+line+xl+'<text x="0" y="0" transform="translate(18,90) rotate(-90)" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">werkloosheid (%)</text></svg>';
  })(),
  // Verdeeld Europa (ijzeren gordijn)
  europa:`<svg viewBox="0 0 360 180" role="img" aria-label="de tweedeling van Europa tijdens de Koude Oorlog"><rect x="20" y="24" width="320" height="128" rx="6" fill="#f3f5f9" stroke="#1b2230" stroke-width="1.3"/><rect x="20" y="24" width="160" height="128" fill="#e6eefb"/><rect x="180" y="24" width="160" height="128" fill="#fbe7e6"/><line x1="180" y1="24" x2="180" y2="152" stroke="#1b2230" stroke-width="2.4" stroke-dasharray="7 5"/><g font-family="sans-serif" font-size="10.5" font-weight="800" text-anchor="middle"><text x="100" y="60" fill="#2563eb">West-Europa</text><text x="260" y="60" fill="#d1382f">Oost-Europa</text></g><g font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle"><text x="100" y="90">NAVO</text><text x="100" y="104">kapitalisme /</text><text x="100" y="116">democratie (VS)</text><text x="260" y="90">Warschaupact</text><text x="260" y="104">communisme</text><text x="260" y="116">(Sovjet-Unie)</text></g><text x="180" y="170" font-family="sans-serif" font-size="9" font-weight="700" fill="#4a5568" text-anchor="middle">het "IJzeren Gordijn"</text></svg>`,
  // Bronanalyse-schema (propaganda-affiche)
  bron:(function(){
    var rows=[['Soort bron','een affiche (propagandaposter)'],['Maker','de regering van een land'],['Jaartal','1951 (tijdens de Koude Oorlog)'],['Doel','het eigen systeem ophemelen en de'],['','tegenstander zwartmaken']];
    var body=rows.map(function(r,i){var y=66+i*22;return '<text x="40" y="'+y+'" font-weight="700">'+r[0]+(r[0]?':':'')+'</text><text x="150" y="'+y+'">'+r[1]+'</text>';}).join('');
    return '<svg viewBox="0 0 360 178" role="img" aria-label="kenmerken van een historische bron"><rect x="24" y="16" width="312" height="150" rx="8" fill="#fff" stroke="#1b2230" stroke-width="1.3"/><path d="M24 24 Q24 16 32 16 L328 16 Q336 16 336 24 L336 42 L24 42 Z" fill="#1b2230"/><text x="180" y="34" font-family="sans-serif" font-size="10.5" font-weight="800" fill="#fff" text-anchor="middle">Bron 1 — kenmerken</text><g font-family="sans-serif" font-size="10" fill="#1b2230">'+body+'</g></svg>';
  })(),
  dekolonisatie:_gsTijdbalk(1941,1951,[1942,1945,1948,1951],[
    [1942,'Japanse bezetting','boven'],[1945,'onafhankelijkheid uitgeroepen','onder'],[1947,'politionele acties','boven'],[1949,'soevereiniteitsoverdracht','onder']]),
};

SLAGIO_EXAMENS.havo.gs = {
  origineel: true,
  titel: 'Geschiedenis',
  niveau: 'havo',
  jaar: new Date().getFullYear(),
  duur_minuten: 100,
  max_punten: 28,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'De twintigste eeuw op een rij',
      context:'Afbeelding 1 is een tijdbalk met enkele belangrijke gebeurtenissen uit de twintigste eeuw.',
      afb:_GSAFB.chrono, afb_cap:'afbeelding 1 — tijdbalk van de twintigste eeuw' },
    { nr:2, titel:'Waardoor brak de Eerste Wereldoorlog uit?',
      context:'Afbeelding 2 is een schema van oorzaken en de aanleiding van de Eerste Wereldoorlog (1914–1918).',
      afb:_GSAFB.oorzaken, afb_cap:'afbeelding 2 — oorzaken en aanleiding van de Eerste Wereldoorlog' },
    { nr:3, titel:'De crisis van de jaren dertig',
      context:'Na de beurskrach op Wall Street (1929) belandde de wereld in een zware economische crisis. Afbeelding 3 toont het verloop van de werkloosheid in een Europees land in de jaren dertig.',
      afb:_GSAFB.werkloosheid, afb_cap:'afbeelding 3 — werkloosheid (%) in de jaren dertig' },
    { nr:4, titel:'Een verdeeld Europa',
      context:'Na de Tweede Wereldoorlog kwam Europa tegenover elkaar te staan in twee blokken. Afbeelding 4 geeft deze tweedeling schematisch weer.',
      afb:_GSAFB.europa, afb_cap:'afbeelding 4 — de tweedeling van Europa (Koude Oorlog)' },
    { nr:5, titel:'Kun je deze bron vertrouwen?',
      context:'Voor een onderzoek naar de Koude Oorlog vindt een leerling een affiche. Afbeelding 5 vat de kenmerken van deze bron samen.',
      afb:_GSAFB.bron, afb_cap:'afbeelding 5 — kenmerken van de bron' },
    { nr:6, titel:'Indonesië wordt onafhankelijk',
      context:'Afbeelding 6 is een tijdbalk van de weg naar de onafhankelijkheid van Indonesië.',
      afb:_GSAFB.dekolonisatie, afb_cap:'afbeelding 6 — tijdbalk dekolonisatie van Indonesië' },
  ],
  vragen: [
    // ── Opgave 1 · Chronologie ──
    { nr:1, opgave:1, punten:2, type:'open', domein:'Chronologie',
      vraag:'Zowel het begin van de Eerste Wereldoorlog als de beurskrach van 1929 valt in hetzelfde tijdvak. Noem dat tijdvak en de bijbehorende periode.',
      antwoord:'Beide gebeurtenissen vallen in de "tijd van de wereldoorlogen" (1900–1950), ook wel de twintigste eeuw / het tijdvak van de wereldoorlogen genoemd.',
      antwoord_rubric:'1 punt: tijd van de wereldoorlogen. 1 punt: de bijbehorende periode 1900–1950.' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Chronologie',
      vraag:'Een historicus zet gebeurtenissen op een tijdbalk voordat hij oorzaak-gevolgrelaties onderzoekt. Leg uit waarom de juiste volgorde in de tijd daarvoor noodzakelijk is.',
      antwoord:'Een oorzaak komt altijd vóór het gevolg. Alleen als je de gebeurtenissen in de juiste volgorde zet, kun je nagaan welke gebeurtenis eerder plaatsvond en dus een oorzaak kán zijn van een latere gebeurtenis. Zonder de juiste chronologie zou je een gevolg per ongeluk als oorzaak kunnen aanwijzen.',
      antwoord_rubric:'1 punt: een oorzaak gaat altijd vooraf aan het gevolg. 1 punt: daarom moet de volgorde kloppen om causale relaties juist vast te stellen.' },
    // ── Opgave 2 · Oorzaken WO I ──
    { nr:3, opgave:2, punten:3, type:'open', domein:'Oorzaken',
      vraag:'Leg met afbeelding 2 het verschil uit tussen een oorzaak en de aanleiding van de Eerste Wereldoorlog. Geef van elk een voorbeeld uit het schema.',
      antwoord:'Een oorzaak is een dieperliggende, langer bestaande factor die de kans op oorlog vergrootte, bijvoorbeeld het nationalisme, het bondgenootschappenstelsel of de wapenwedloop (langetermijnoorzaken). De aanleiding is de directe gebeurtenis die de oorlog liet losbarsten: de moord in Sarajevo in 1914. De oorzaken maakten de situatie explosief; de aanleiding was de vonk in het kruitvat.',
      antwoord_rubric:'1 punt: oorzaak = dieperliggende/langdurige factor (voorbeeld: nationalisme/bondgenootschappen/wapenwedloop). 1 punt: aanleiding = directe gebeurtenis die het losmaakte (moord in Sarajevo 1914). 1 punt: correct onderscheid tussen beide (achterliggend vs. directe vonk).' },
    { nr:4, opgave:2, punten:2, type:'open', domein:'Oorzaken',
      vraag:'Leg uit waarom de moord in Sarajevo alléén tot een wereldoorlog kon uitgroeien dóór de langetermijnoorzaken uit het schema.',
      antwoord:'Door het bondgenootschappenstelsel waren landen verplicht elkaar te steunen, zodat een conflict tussen twee landen snel de bondgenoten meesleepte. Gecombineerd met nationalisme (trots, willen winnen) en de wapenwedloop (grote, gereedstaande legers) breidde een lokale moord zich uit tot een oorlog tussen veel landen. Zonder die oorzaken was het waarschijnlijk een plaatselijk conflict gebleven.',
      antwoord_rubric:'1 punt: door de bondgenootschappen werden meer landen meegetrokken. 1 punt: nationalisme/wapenwedloop maakte escalatie tot een grote oorlog mogelijk (zonder die oorzaken was het lokaal gebleven).' },
    // ── Opgave 3 · Crisis ──
    { nr:5, opgave:3, punten:2, type:'open', domein:'Crisis',
      vraag:'Beschrijf met afbeelding 3 wat er met de werkloosheid gebeurde tussen 1929 en 1932, en noem de directe aanleiding van deze ontwikkeling.',
      antwoord:'Tussen 1929 en 1932 steeg de werkloosheid sterk, van ongeveer 9% naar rond de 30% (aflezen uit de grafiek): de werkloosheid meer dan verdrievoudigde. De directe aanleiding was de beurskrach op Wall Street in 1929, die een wereldwijde economische crisis veroorzaakte.',
      antwoord_rubric:'1 punt: sterke stijging van ± 9% naar ± 30% tussen 1929 en 1932 (afgelezen). 1 punt: aanleiding = beurskrach 1929 / economische crisis.' },
    { nr:6, opgave:3, punten:3, type:'open', domein:'Crisis',
      vraag:'Leg een oorzaak-gevolgketen uit die verklaart hoe de economische crisis in Duitsland de steun voor Hitler en de NSDAP kon vergroten.',
      antwoord:'Door de crisis raakten miljoenen mensen werkloos en verarmden ze (zichtbaar in de hoge werkloosheid). Veel mensen verloren het vertrouwen in de bestaande regering, die de crisis niet leek op te lossen. Hitler beloofde werk, orde en herstel van de Duitse trots en gaf anderen (zoals de Joden en het Verdrag van Versailles) de schuld. Daardoor stemden steeds meer wanhopige mensen op de NSDAP, waardoor die groot werd en Hitler in 1933 aan de macht kon komen.',
      antwoord_rubric:'1 punt: crisis → massawerkloosheid/armoede. 1 punt: verlies van vertrouwen in de zittende regering. 1 punt: Hitler beloofde werk/orde en zocht schuldigen → meer steun voor de NSDAP.' },
    // ── Opgave 4 · Koude Oorlog ──
    { nr:7, opgave:4, punten:3, type:'open', domein:'KoudeOorlog',
      vraag:'Leg met afbeelding 4 uit wat met de "tweedeling van Europa" (het IJzeren Gordijn) wordt bedoeld, en welke twee tegengestelde systemen tegenover elkaar stonden.',
      antwoord:'Na 1945 viel Europa uiteen in twee blokken, gescheiden door een denkbeeldige grens (het IJzeren Gordijn). West-Europa hoorde bij het blok van de Verenigde Staten: kapitalisme en (parlementaire) democratie, verenigd in de NAVO. Oost-Europa stond onder invloed van de Sovjet-Unie: communisme, verenigd in het Warschaupact. Deze twee tegengestelde systemen stonden vijandig tegenover elkaar.',
      antwoord_rubric:'1 punt: Europa verdeeld in een westelijk en oostelijk blok, gescheiden door het IJzeren Gordijn. 1 punt: West = VS/NAVO, kapitalisme/democratie. 1 punt: Oost = Sovjet-Unie/Warschaupact, communisme.' },
    { nr:8, opgave:4, punten:2, type:'open', domein:'KoudeOorlog',
      vraag:'De VS voerden tegenover de Sovjet-Unie een politiek van "containment" (indamming). Leg uit wat die politiek inhield.',
      antwoord:'Containment betekende dat de VS wilden voorkomen dat het communisme zich verder zou verspreiden naar nieuwe landen. De VS probeerden het communisme "in te dammen" door landen die dreigden communistisch te worden te steunen, bijvoorbeeld met geld en hulp (zoals het Marshallplan) of militair. Ze wilden het niet per se terugdraaien, maar wél tegenhouden dat het groter werd.',
      antwoord_rubric:'1 punt: voorkomen dat het communisme zich verder verspreidt (indammen). 1 punt: door landen te steunen met (economische/militaire) hulp, bv. het Marshallplan.' },
    // ── Opgave 5 · Bronnenkritiek ──
    { nr:9, opgave:5, punten:3, type:'open', domein:'Bronnen',
      vraag:'Leg uit waarom je bij deze bron (afbeelding 5) voorzichtig moet zijn met de betrouwbaarheid als je wilt weten hoe het leven in het andere blok écht was. Gebruik het begrip standplaatsgebondenheid.',
      antwoord:'De bron is een propaganda-affiche gemaakt door een regering met het doel de eigen bevolking te overtuigen en de tegenstander zwart te maken. De maker is dus standplaatsgebonden: hij kijkt vanuit zijn eigen positie en belang en geeft daardoor een gekleurd, eenzijdig beeld. De informatie is bewust overdreven of onwaar om te overtuigen, dus voor de vraag hoe het leven in het andere blok echt was, is de bron onbetrouwbaar/eenzijdig.',
      antwoord_rubric:'1 punt: het is propaganda met een overtuigingsdoel (dus gekleurd/eenzijdig). 1 punt: standplaatsgebondenheid — de maker kijkt vanuit zijn eigen positie/belang. 1 punt: daarom onbetrouwbaar voor het achterhalen van de werkelijke situatie.' },
    { nr:10, opgave:5, punten:2, type:'open', domein:'Bronnen',
      vraag:'Waarvoor is deze bron juist wél goed bruikbaar? Leg je antwoord uit.',
      antwoord:'De bron is juist heel bruikbaar om te onderzoeken hóé er in die tijd propaganda werd gemaakt en welk beeld de regering van het eigen systeem en van de vijand wilde uitdragen. Precies omdat het propaganda is, laat de bron goed zien wat de makers de bevolking wilden laten geloven en welke middelen (overdrijving, vijandbeelden) ze daarvoor gebruikten.',
      antwoord_rubric:'1 punt: bruikbaar om de propaganda/beeldvorming zelf te bestuderen. 1 punt: uitleg dat de bron laat zien wat de regering wilde laten geloven / welke propagandamiddelen werden gebruikt.' },
    // ── Opgave 6 · Dekolonisatie ──
    { nr:11, opgave:6, punten:2, type:'open', domein:'Dekolonisatie',
      vraag:'Beschrijf met afbeelding 6 kort de weg van de Japanse bezetting (1942) naar de soevereiniteitsoverdracht (1949).',
      antwoord:'Tijdens de Tweede Wereldoorlog bezette Japan Nederlands-Indië (1942), waardoor het Nederlandse gezag wegviel. Na de Japanse capitulatie riepen Indonesische leiders in 1945 de onafhankelijkheid uit. Nederland wilde de kolonie terug en voerde militaire acties ("politionele acties", 1947–1948). Onder internationale druk droeg Nederland in 1949 de soevereiniteit over: Indonesië werd onafhankelijk.',
      antwoord_rubric:'1 punt: Japanse bezetting (1942) → onafhankelijkheid uitgeroepen in 1945. 1 punt: politionele acties → soevereiniteitsoverdracht in 1949 (Indonesië onafhankelijk).' },
    { nr:12, opgave:6, punten:2, type:'open', domein:'Dekolonisatie',
      vraag:'Nederland noemde het militaire optreden "politionele acties", terwijl Indonesiërs spraken van een onafhankelijkheidsoorlog. Leg uit hoe dit verschil in benaming met het perspectief (standplaats) van beide partijen samenhangt.',
      antwoord:'Nederland zag Indonesië nog als zijn kolonie en het optreden als het herstellen van orde en gezag; het woord "politionele acties" doet dat lijken op gewoon politiewerk binnen het eigen gebied. De Indonesiërs zagen zichzelf al als een onafhankelijk land dat werd aangevallen; voor hen was het een oorlog om hun vrijheid te verdedigen. Elk kiest een benaming die past bij zijn eigen positie en belang (standplaatsgebondenheid), waardoor dezelfde gebeurtenis heel verschillend wordt genoemd.',
      antwoord_rubric:'1 punt: het Nederlandse perspectief (kolonie, orde herstellen → "politiewerk"). 1 punt: het Indonesische perspectief (onafhankelijk land dat zich verdedigt → "oorlog"), gekoppeld aan standplaatsgebondenheid.' },
  ],
};
