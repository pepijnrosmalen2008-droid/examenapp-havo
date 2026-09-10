// ═══════════════════════════════════════════════════════════════════════
// proefexamen-mw.js, ORIGINEEL Slagio-proefexamen in examenstijl (havo mw).
// Eigen contexten, vragen en figuren. Géén reproductie van een CvTE-examen.
// CE-niveau maatschappijwetenschappen: kernconcepten (socialisatie, macht,
// sociale ongelijkheid, sociale cohesie, verandering) toepassen op een
// context. Meervoudige nakijkrubric per vraag. Figuren in hoge kwaliteit.
//   opgaven[] = {nr,titel,context,afb,afb_cap}
//   vragen[]  = {nr,opgave,punten,type,vraag,antwoord,antwoord_rubric,domein}
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.havo = SLAGIO_EXAMENS.havo || {};

// Hub-and-spoke schema: centrum + omringende blokken
function _mwHub(centreLbl, nodes){
  var cx=180, cy=100, r=118;
  var spokes='', boxes='';
  nodes.forEach(function(n,i){
    var ang=(-90 + i*(360/nodes.length))*Math.PI/180;
    var nx=cx+Math.cos(ang)*r, ny=cy+Math.sin(ang)*r*0.72;
    spokes+='<line x1="'+cx+'" y1="'+cy+'" x2="'+nx.toFixed(0)+'" y2="'+ny.toFixed(0)+'" stroke="#c2c9d4" stroke-width="1.6"/>';
    boxes+='<rect x="'+(nx-46).toFixed(0)+'" y="'+(ny-13).toFixed(0)+'" width="92" height="26" rx="7" fill="#eef4ff" stroke="#2563eb" stroke-width="1.2"/><text x="'+nx.toFixed(0)+'" y="'+(ny+4).toFixed(0)+'" font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle">'+n+'</text>';
  });
  return '<svg viewBox="0 0 360 200" role="img" aria-label="schema">'+spokes+boxes+'<circle cx="'+cx+'" cy="'+cy+'" r="34" fill="#e8580c"/><text x="'+cx+'" y="'+(cy-2)+'" font-family="sans-serif" font-size="10" font-weight="800" fill="#fff" text-anchor="middle">'+centreLbl[0]+'</text><text x="'+cx+'" y="'+(cy+11)+'" font-family="sans-serif" font-size="10" font-weight="800" fill="#fff" text-anchor="middle">'+(centreLbl[1]||'')+'</text></svg>';
}

var _MWAFB = {
  // Socialisatie: kind in het midden, socialiserende instituties eromheen
  socialisatie:_mwHub(['het','individu'],['gezin','school','media','vrienden','werk','sport-\nclub']),
  // Politiek 2D-spectrum
  spectrum:(function(){
    var cx=180, cy=100, sx=function(x){return cx+x*120;}, sy=function(y){return cy-y*66;};
    var pts=[['socialisme',-0.72,0.28,'#d1382f','start'],['liberalisme',0.62,0.5,'#e8580c','middle'],['christendemocratie',-0.02,-0.34,'#2e9e5b','middle'],['conservatisme /\nnationalisme',0.6,-0.62,'#6d28d9','middle']];
    var dots=pts.map(function(p){var x=sx(p[1]),y=sy(p[2]);var lines=p[0].split('\n');var lbl=lines.map(function(ln,k){return '<text x="'+x.toFixed(0)+'" y="'+(y-10-(lines.length-1-k)*10).toFixed(0)+'" font-family="sans-serif" font-size="8.5" font-weight="700" fill="'+p[3]+'" text-anchor="'+p[4]+'">'+ln+'</text>';}).join('');return '<circle cx="'+x.toFixed(0)+'" cy="'+y.toFixed(0)+'" r="4" fill="'+p[3]+'"/>'+lbl;}).join('');
    return '<svg viewBox="0 0 360 200" role="img" aria-label="politiek 2D-spectrum"><line x1="30" y1="'+cy+'" x2="330" y2="'+cy+'" stroke="#1b2230" stroke-width="1.5"/><line x1="'+cx+'" y1="20" x2="'+cx+'" y2="184" stroke="#1b2230" stroke-width="1.5"/><g font-family="sans-serif" font-size="9" font-weight="700" fill="#4a5568"><text x="24" y="'+(cy+4)+'" text-anchor="start">links</text><text x="336" y="'+(cy+4)+'" text-anchor="end">rechts</text><text x="'+cx+'" y="16" text-anchor="middle">progressief</text><text x="'+cx+'" y="196" text-anchor="middle">conservatief</text></g>'+dots+'</svg>';
  })(),
  // Sociale stratificatie: piramide met drie lagen + percentages
  stratificatie:`<svg viewBox="0 0 360 190" role="img" aria-label="sociale stratificatie piramide"><polygon points="180,24 232,80 128,80" fill="#3aa06e" stroke="#1b2230" stroke-width="1.4"/><polygon points="128,84 232,84 276,140 84,140" fill="#72c295" stroke="#1b2230" stroke-width="1.4"/><polygon points="84,144 276,144 316,172 44,172" fill="#d3ecda" stroke="#1b2230" stroke-width="1.4"/><g font-family="sans-serif" font-size="10" fill="#1b2230" text-anchor="middle"><text x="180" y="60" fill="#fff" font-weight="700">hoge laag</text><text x="180" y="116" font-weight="700">middenlaag</text><text x="180" y="162" font-weight="700">lage laag</text></g><g font-family="sans-serif" font-size="9.5" fill="#4a5568"><text x="300" y="56" text-anchor="start">10%</text><text x="330" y="116" text-anchor="end">55%</text><text x="330" y="164" text-anchor="end">35%</text></g><g stroke="#2563eb" stroke-width="1.6" fill="none"><line x1="28" y1="168" x2="28" y2="40"/><path d="M24 50 L28 38 L32 50"/></g><text x="16" y="104" font-family="sans-serif" font-size="8.5" fill="#2563eb" transform="rotate(-90 16 104)" text-anchor="middle">meer inkomen, macht en status</text></svg>`,
  // Machtsbronnen om 'macht' heen
  macht:_mwHub(['macht'],['bezit / geld','kennis','geweld','aantal','positie /\nfunctie']),
  // Sociale verandering: kerklidmaatschap daalt (individualisering)
  verandering:(function(){
    var data=[[1960,90],[1975,70],[1990,52],[2005,38],[2020,26]];
    var sx=function(j){return 56+(j-1960)/60*284;}, sy=function(p){return 150-p/100*120;};
    var yl=[0,25,50,75,100].map(v=>'<line x1="56" y1="'+sy(v).toFixed(1)+'" x2="340" y2="'+sy(v).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(v)+3).toFixed(1)+'" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="end">'+v+'</text>').join('');
    var line='<polyline points="'+data.map(d=>sx(d[0]).toFixed(1)+','+sy(d[1]).toFixed(1)).join(' ')+'" fill="none" stroke="#2563eb" stroke-width="3"/>'+data.map(d=>'<circle cx="'+sx(d[0]).toFixed(1)+'" cy="'+sy(d[1]).toFixed(1)+'" r="3" fill="#1b2230"/>').join('');
    var xl=data.map(d=>'<text x="'+sx(d[0]).toFixed(1)+'" y="166" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="middle">'+d[0]+'</text>').join('');
    return '<svg viewBox="0 0 360 190" role="img" aria-label="daling kerklidmaatschap over de tijd">'+yl+'<line x1="56" y1="14" x2="56" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M56 14 L52 24 L60 24 Z" fill="#1b2230"/><line x1="56" y1="150" x2="346" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M346 150 L338 146 L338 154 Z" fill="#1b2230"/>'+line+xl+'<text x="0" y="0" transform="translate(18,84) rotate(-90)" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">% lid van een kerk</text></svg>';
  })(),
};

SLAGIO_EXAMENS.havo.mw = {
  origineel: true,
  titel: 'Maatschappijwetenschappen',
  niveau: 'havo',
  jaar: new Date().getFullYear(),
  duur_minuten: 100,
  max_punten: 26,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Zo word je wie je bent',
      context:'Vanaf hun geboorte leren kinderen de normen, waarden en gewoonten van hun omgeving. Afbeelding 1 toont het individu met de belangrijkste socialiserende instituties eromheen.',
      afb:_MWAFB.socialisatie, afb_cap:'afbeelding 1: het individu en zijn socialiserende instituties' },
    { nr:2, titel:'Politieke stromingen',
      context:'Afbeelding 2 plaatst enkele politieke stromingen in een assenstelsel: horizontaal de economische links-rechtsdimensie (mate van herverdeling), verticaal de sociaal-culturele dimensie (progressief tegenover conservatief).',
      afb:_MWAFB.spectrum, afb_cap:'afbeelding 2: politieke stromingen in twee dimensies' },
    { nr:3, titel:'Niet iedereen gelijk',
      context:'In elke samenleving zijn schaarse en gewaardeerde zaken (inkomen, macht, status) ongelijk verdeeld. Afbeelding 3 toont de sociale gelaagdheid (stratificatie) van een samenleving.',
      afb:_MWAFB.stratificatie, afb_cap:'afbeelding 3: sociale stratificatie' },
    { nr:4, titel:'Wie heeft de macht?',
      context:'Macht is het vermogen om je wil aan anderen op te leggen, ook als zij zich verzetten. Afbeelding 4 toont de belangrijkste machtsbronnen.',
      afb:_MWAFB.macht, afb_cap:'afbeelding 4: bronnen van macht' },
    { nr:5, titel:'Een veranderende samenleving',
      context:'Afbeelding 5 toont het percentage Nederlanders dat lid is van een kerk, van 1960 tot 2020.',
      afb:_MWAFB.verandering, afb_cap:'afbeelding 5: kerklidmaatschap door de tijd' },
  ],
  vragen: [
    // ── Opgave 1 · Socialisatie ──
    { nr:1, opgave:1, punten:2, type:'open', domein:'Vorming',
      vraag:'Leg uit wat socialisatie is en noem met afbeelding 1 twee socialiserende instituties.',
      antwoord:'Socialisatie is het proces waarbij iemand de normen, waarden en gedragsregels van zijn groep/samenleving aanleert en zich eigen maakt. Twee socialiserende instituties uit de figuur zijn bijvoorbeeld het gezin en de school (ook media, vrienden, werk of sportclub zijn goed).',
      antwoord_rubric:'1 punt: socialisatie = het (aan)leren van normen, waarden en gedrag van een groep/samenleving. 1 punt: twee juiste instituties uit de figuur.' },
    { nr:2, opgave:1, punten:3, type:'open', domein:'Vorming',
      vraag:'Het gezin wordt de "primaire" socialiserende institutie genoemd en de school en media "secundair". Leg dit onderscheid uit en geef aan waarom het gezin extra invloedrijk is.',
      antwoord:'Het gezin is primair omdat het als eerste en in de vroegste jaren socialiseert, in een hechte, persoonlijke relatie; daar leert een kind de basale normen en waarden. School, media en vrienden zijn secundair: ze komen later en socialiseren in een minder persoonlijke, meer formele of bredere context. Het gezin is extra invloedrijk omdat het als eerste komt (basisvorming) en de band intensief en emotioneel is, waardoor waarden diep worden geïnternaliseerd.',
      antwoord_rubric:'1 punt: primair = als eerste/vroegst en in een hechte persoonlijke relatie. 1 punt: secundair = later en in een minder persoonlijke/bredere context. 1 punt: gezin extra invloedrijk door de vroege, intensieve band → sterke internalisering.' },
    { nr:3, opgave:1, punten:2, type:'open', domein:'Vorming',
      vraag:'Een leerling zegt: "Hoe ik ben, ligt volledig vast in mijn genen." Leg met het begrip socialisatie uit waarom deze uitspraak te eenzijdig is (nature én nurture).',
      antwoord:'Aanleg (nature, genen) speelt een rol, maar wie je wordt, hangt óók sterk af van je omgeving en opvoeding (nurture): via socialisatie leer je taal, normen, waarden en gedrag die niet in je genen vastliggen. Iemand met dezelfde aanleg zou in een andere omgeving andere waarden en gewoonten ontwikkelen. Gedrag en identiteit ontstaan dus uit een samenspel van aanleg én socialisatie, niet uit genen alleen.',
      antwoord_rubric:'1 punt: naast aanleg (nature) bepaalt de omgeving/socialisatie (nurture) mede wie je wordt. 1 punt: onderbouwing dat via socialisatie aangeleerd gedrag/waarden niet in genen vastliggen → uitspraak te eenzijdig.' },
    // ── Opgave 2 · Politieke stromingen ──
    { nr:4, opgave:2, punten:2, type:'open', domein:'Verhouding',
      vraag:'Wat betekent het volgens afbeelding 2 als een stroming "links" op de economische dimensie staat? Leg dit uit met het begrip herverdeling.',
      antwoord:'Links op de economische dimensie betekent dat de stroming een actieve overheid wil die inkomen en welvaart herverdeelt (bijvoorbeeld via belastingen en sociale voorzieningen) om de verschillen tussen arm en rijk te verkleinen. Rechts wil juist minder herverdeling en meer aan de vrije markt overlaten.',
      antwoord_rubric:'1 punt: links = actieve overheid die herverdeelt om ongelijkheid te verkleinen. 1 punt: contrast met rechts = minder herverdeling / meer markt.' },
    { nr:5, opgave:2, punten:3, type:'open', domein:'Verhouding',
      vraag:'Vergelijk met afbeelding 2 het socialisme en het liberalisme op beide dimensies. Noem één overeenkomst en één duidelijk verschil.',
      antwoord:'Overeenkomst: beide staan op de figuur aan de progressieve (bovenste) kant van de sociaal-culturele dimensie; ze staan relatief open voor verandering en individuele vrijheid op sociaal-cultureel gebied. Verschil: op de economische dimensie staat het socialisme links (veel herverdeling, sterke overheid) en het liberalisme rechts (weinig herverdeling, vrije markt, kleine overheid). Ze verschillen dus vooral over de rol van de overheid in de economie.',
      antwoord_rubric:'1 punt: overeenkomst = beide (relatief) progressief op de sociaal-culturele dimensie. 1 punt: verschil op de economische dimensie: socialisme links, liberalisme rechts. 1 punt: uitleg = verschil over herverdeling/rol van de overheid.' },
    // ── Opgave 3 · Sociale ongelijkheid ──
    { nr:6, opgave:3, punten:2, type:'open', domein:'Verhouding',
      vraag:'Leg met afbeelding 3 uit wat sociale stratificatie is en waarom de hoge laag boven in de piramide staat en het smalst is.',
      antwoord:'Sociale stratificatie is de indeling van een samenleving in lagen (klassen) die verschillen in inkomen, macht en status. De hoge laag staat bovenaan omdat die het meeste inkomen, de meeste macht en de hoogste status heeft; hij is het smalst omdat maar een klein deel van de bevolking (in de figuur 10%) tot die bevoorrechte laag behoort.',
      antwoord_rubric:'1 punt: stratificatie = indeling in lagen die verschillen in inkomen/macht/status. 1 punt: hoge laag = meest bevoorrecht én het kleinst (weinig mensen, bv. 10%).' },
    { nr:7, opgave:3, punten:2, type:'open', domein:'Verandering',
      vraag:'Iemand uit de lage laag werkt zich op naar de middenlaag. Hoe noem je dit in de maatschappijwetenschappen, en welke rol speelt onderwijs daarbij in een meritocratie?',
      antwoord:'Dit heet (verticale, stijgende) sociale mobiliteit: iemand beweegt omhoog tussen de sociale lagen. In een meritocratie bepalen prestatie en talent (verdienste) iemands positie; onderwijs is dan een belangrijk middel om op te klimmen, omdat je met diploma\'s en kennis een hogere positie en een hoger inkomen kunt bereiken.',
      antwoord_rubric:'1 punt: (verticale/stijgende) sociale mobiliteit. 1 punt: in een meritocratie is onderwijs een middel om via prestatie/diploma\'s op te klimmen.' },
    // ── Opgave 4 · Macht ──
    { nr:8, opgave:4, punten:2, type:'open', domein:'Verhouding',
      vraag:'Noem met afbeelding 4 twee verschillende machtsbronnen en geef bij elk een voorbeeld van iemand die daar macht aan ontleent.',
      antwoord:'Bijvoorbeeld: bezit/geld, een rijke ondernemer heeft macht doordat hij mensen kan betalen of investeringen kan doen. Kennis, een arts of expert heeft macht doordat anderen afhankelijk zijn van zijn kennis. (Ook geweld, aantal of positie/functie met een passend voorbeeld is goed.)',
      antwoord_rubric:'1 punt: twee verschillende machtsbronnen uit de figuur. 1 punt: bij elk een passend voorbeeld van iemand die er macht aan ontleent.' },
    { nr:9, opgave:4, punten:3, type:'open', domein:'Verhouding',
      vraag:'Leg het verschil uit tussen macht en gezag, en leg uit waarom een democratisch gekozen regering gezag heeft en niet alleen macht.',
      antwoord:'Macht is het vermogen om je wil aan anderen op te leggen, desnoods met dwang. Gezag is macht die door anderen wordt geaccepteerd als rechtmatig (gelegitimeerd): mensen gehoorzamen omdat ze vinden dat het hoort, niet alleen uit angst. Een democratisch gekozen regering heeft gezag omdat burgers haar via verkiezingen zelf hebben aangewezen; haar macht is daardoor gelegitimeerd en wordt als rechtmatig aanvaard, niet alleen afgedwongen.',
      antwoord_rubric:'1 punt: macht = wil opleggen (desnoods met dwang). 1 punt: gezag = geaccepteerde/gelegitimeerde macht. 1 punt: gekozen regering is gelegitimeerd via verkiezingen → gezag, niet alleen macht.' },
    // ── Opgave 5 · Sociale verandering ──
    { nr:10, opgave:5, punten:2, type:'open', domein:'Verandering',
      vraag:'Beschrijf met afbeelding 5 de ontwikkeling van het kerklidmaatschap tussen 1960 en 2020 en noem het maatschappelijke verschijnsel dat hierbij hoort.',
      antwoord:'Het percentage kerkleden daalt sterk en gestaag: van ongeveer 90% in 1960 naar ongeveer 26% in 2020 (aflezen uit de grafiek), dus meer dan gehalveerd. Dit verschijnsel heet ontkerkelijking / secularisering: godsdienst speelt een steeds kleinere rol in de samenleving.',
      antwoord_rubric:'1 punt: sterke daling van ± 90% (1960) naar ± 26% (2020) afgelezen. 1 punt: verschijnsel = ontkerkelijking / secularisering.' },
    { nr:11, opgave:5, punten:3, type:'open', domein:'Verandering',
      vraag:'Leg uit hoe deze ontwikkeling samenhangt met individualisering, en noem één gevolg voor de sociale cohesie in de samenleving.',
      antwoord:'Individualisering betekent dat mensen minder vanzelfsprekend bij vaste groepen horen en zelf hun keuzes en identiteit bepalen. Doordat mensen zich minder aan de kerk (en haar vaste normen en gemeenschap) binden, maken ze eigen keuzes over geloof en leefstijl: de ontkerkelijking is daar een uiting van. Een gevolg voor de sociale cohesie is dat een gedeelde bron van gemeenschappelijke waarden en onderling contact (de kerk als bindmiddel) wegvalt, waardoor de binding tussen mensen langs die weg afneemt (al kunnen er nieuwe vormen van binding voor in de plaats komen).',
      antwoord_rubric:'1 punt: individualisering = mensen binden zich minder aan vaste groepen en bepalen zelf hun keuzes/identiteit. 1 punt: koppeling ontkerkelijking = minder binding aan de kerk = uiting van individualisering. 1 punt: gevolg voor cohesie = wegvallen van een gedeeld bindmiddel/gemeenschappelijke waarden.' },
  ],
};
