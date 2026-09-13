// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-ak.js  ORIGINEEL Slagio-proefexamen (vwo aardrijkskunde).
// Eigen contexten, vragen en figuren. Geen reproductie van een CvTE-examen.
// VWO-CE-niveau: Systeem Aarde (platentektoniek), Wereld (demografie,
// mondiale spreiding), klimaat en Leefomgeving (Nederland, water).
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

var _VAKAFB = {
  // Subductiezone: oceanische plaat duikt onder continentale, met vulkanisme + trog
  subductie:`<svg viewBox="0 0 360 200" role="img" aria-label="subductiezone in dwarsdoorsnede">
    <defs><linearGradient id="vak_oce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6aa9e6"/><stop offset="1" stop-color="#3f78b5"/></linearGradient>
    <linearGradient id="vak_con" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8a36a"/><stop offset="1" stop-color="#9c7b46"/></linearGradient>
    <linearGradient id="vak_man" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9b782"/><stop offset="1" stop-color="#d98c4a"/></linearGradient></defs>
    <rect x="0" y="0" width="360" height="200" fill="#fdf6ec"/>
    <rect x="0" y="70" width="360" height="130" fill="url(#vak_man)"/>
    <rect x="0" y="52" width="184" height="22" fill="url(#vak_oce)"/>
    <text x="70" y="46" font-family="sans-serif" font-size="8.5" fill="#2b5a8a" text-anchor="middle">oceaan</text>
    <path d="M0 52 H150 L150 74 H0 Z" fill="none"/>
    <polygon points="184,52 360,52 360,120 250,120 210,86 184,74" fill="url(#vak_con)"/>
    <text x="300" y="44" font-family="sans-serif" font-size="9" font-weight="700" fill="#6b4f24" text-anchor="middle">continentale plaat</text>
    <polygon points="150,74 184,74 250,150 210,150" fill="#6b7a8c"/>
    <text x="80" y="66" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#1b2230">oceanische plaat</text>
    <path d="M150 74 C 170 100, 200 130, 230 150" fill="none" stroke="#1b2230" stroke-width="1.4" stroke-dasharray="4 3"/>
    <g><polygon points="176,52 188,52 182,34" fill="#c0392b"/><path d="M182 34 q -4 -8 2 -14 q 5 6 0 12" fill="#e67e22"/><text x="182" y="26" font-family="sans-serif" font-size="8" font-weight="700" fill="#c0392b" text-anchor="middle">vulkaan</text></g>
    <g stroke="#1b2230" stroke-width="1.6" fill="none"><line x1="60" y1="90" x2="98" y2="90"/><path d="M92 85 L102 90 L92 95" fill="#1b2230" stroke="none"/><line x1="300" y1="128" x2="262" y2="128"/><path d="M268 123 L258 128 L268 133" fill="#1b2230" stroke="none"/></g>
    <text x="150" y="188" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">de platen bewegen naar elkaar toe (convergent); pijl = diepzeetrog</text>
    <text x="150" y="112" font-family="sans-serif" font-size="8" fill="#333" text-anchor="middle">trog</text></svg>`,
  // Demografisch transitiemodel: geboorte- en sterftecijfer over 5 fasen
  dtm:(function(){
    var sx=function(x){return 52+x/5*284;}, sy=function(r){return 150-r/50*128;};
    var yl=[0,10,20,30,40,50].map(r=>'<line x1="52" y1="'+sy(r).toFixed(1)+'" x2="336" y2="'+sy(r).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="47" y="'+(sy(r)+3).toFixed(1)+'" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="end">'+r+'</text>').join('');
    var fases=[1,2,3,4,5].map(i=>'<line x1="'+sx(i).toFixed(1)+'" y1="22" x2="'+sx(i).toFixed(1)+'" y2="150" stroke="#dfe4ec" stroke-width="1"/>').join('')+
      [1,2,3,4,5].map(i=>'<text x="'+sx(i-0.5).toFixed(1)+'" y="18" font-family="sans-serif" font-size="8" font-weight="700" fill="#7a8699" text-anchor="middle">fase '+i+'</text>').join('');
    // geboortecijfer: hoog 40, blijft ~40 in fase2, daalt fase3, laag ~12 fase4-5
    var geb=[[0,40],[1,40],[2,38],[3,18],[4,12],[5,11]];
    var ster=[[0,38],[1,22],[2,14],[3,10],[4,10],[5,12]];
    var gp='<polyline points="'+geb.map(p=>sx(p[0]).toFixed(1)+','+sy(p[1]).toFixed(1)).join(' ')+'" fill="none" stroke="#2563eb" stroke-width="2.6"/><text x="'+sx(0.55)+'" y="'+(sy(41))+'" font-family="sans-serif" font-size="8" font-weight="700" fill="#2563eb">geboortecijfer</text>';
    var sp='<polyline points="'+ster.map(p=>sx(p[0]).toFixed(1)+','+sy(p[1]).toFixed(1)).join(' ')+'" fill="none" stroke="#c0392b" stroke-width="2.6"/><text x="'+sx(2.7)+'" y="'+(sy(6))+'" font-family="sans-serif" font-size="8" font-weight="700" fill="#c0392b">sterftecijfer</text>';
    return '<svg viewBox="0 0 360 190" role="img" aria-label="demografisch transitiemodel">'+yl+fases+'<line x1="52" y1="22" x2="52" y2="150" stroke="#1b2230" stroke-width="1.6"/><line x1="52" y1="150" x2="338" y2="150" stroke="#1b2230" stroke-width="1.6"/><path d="M338 150 L330 146 L330 154 Z" fill="#1b2230"/>'+gp+sp+'<text x="0" y="0" transform="translate(15,86) rotate(-90)" font-family="sans-serif" font-size="7.5" font-weight="800" fill="#1b2230" text-anchor="middle">per 1000 inwoners</text><text x="200" y="184" font-family="sans-serif" font-size="8" font-weight="800" fill="#1b2230" text-anchor="middle">tijd (fasen van ontwikkeling)</text></svg>';
  })(),
  // Klimaatdiagram: temp (lijn) + neerslag (staven), tropisch moesson
  klimaat:(function(){
    var mnd=['J','F','M','A','M','J','J','A','S','O','N','D'];
    var neer=[10,15,25,60,140,260,300,280,180,90,30,15];
    var temp=[27,28,29,29,28,27,26,26,27,27,27,27];
    var sx=function(i){return 52+(i+0.5)/12*280;};
    var syN=function(n){return 150-n/320*120;}, syT=function(t){return 150-t/40*120;};
    var yl=[0,100,200,300].map(n=>'<line x1="52" y1="'+syN(n).toFixed(1)+'" x2="332" y2="'+syN(n).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="47" y="'+(syN(n)+3).toFixed(1)+'" font-family="sans-serif" font-size="7.5" fill="#2b6cb0" text-anchor="end">'+n+'</text>').join('');
    var tr=[0,10,20,30,40].map(t=>'<text x="337" y="'+(syT(t)+3).toFixed(1)+'" font-family="sans-serif" font-size="7.5" fill="#c0392b" text-anchor="start">'+t+'</text>').join('');
    var bars=neer.map((n,i)=>{var h=150-syN(n); return '<rect x="'+(sx(i)-9).toFixed(1)+'" y="'+syN(n).toFixed(1)+'" width="18" height="'+h.toFixed(1)+'" fill="#5b9bd5" opacity="0.85"/>';}).join('');
    var tl='<polyline points="'+temp.map((t,i)=>sx(i).toFixed(1)+','+syT(t).toFixed(1)).join(' ')+'" fill="none" stroke="#c0392b" stroke-width="2.4"/>';
    var xl=mnd.map((m,i)=>'<text x="'+sx(i).toFixed(1)+'" y="163" font-family="sans-serif" font-size="7" fill="#4a5568" text-anchor="middle">'+m+'</text>').join('');
    return '<svg viewBox="0 0 360 188" role="img" aria-label="klimaatdiagram">'+yl+'<line x1="52" y1="24" x2="52" y2="150" stroke="#2b6cb0" stroke-width="1.6"/><line x1="332" y1="24" x2="332" y2="150" stroke="#c0392b" stroke-width="1.6"/><line x1="52" y1="150" x2="332" y2="150" stroke="#1b2230" stroke-width="1.6"/>'+bars+tl+xl+tr+'<text x="0" y="0" transform="translate(14,86) rotate(-90)" font-family="sans-serif" font-size="7.5" font-weight="800" fill="#2b6cb0" text-anchor="middle">neerslag (mm)</text><text x="0" y="0" transform="translate(354,86) rotate(90)" font-family="sans-serif" font-size="7.5" font-weight="800" fill="#c0392b" text-anchor="middle">temperatuur (C)</text></svg>';
  })(),
  // Mondiale spreiding welvaart: BBP per hoofd, gestileerde staafjes noord vs zuid
  welvaart:(function(){
    var data=[['Noord-Amerika',62],['West-Europa',48],['Oost-Azie',22],['Latijns-Amerika',15],['Zuid-Azie',7],['Afrika bezuiden Sahara',4]];
    var sy=function(i){return 30+i*22;}, sx=function(v){return 150+v/62*180;};
    var rows=data.map((d,i)=>{
      var w=sx(d[1])-150; var col=i<2?'#2e9e5b':(i<4?'#e8a530':'#c0392b');
      return '<text x="145" y="'+(sy(i)+4)+'" font-family="sans-serif" font-size="8" fill="#1b2230" text-anchor="end">'+d[0]+'</text>'+
        '<rect x="150" y="'+(sy(i)-7)+'" width="'+w.toFixed(1)+'" height="14" fill="'+col+'" opacity="0.9"/>'+
        '<text x="'+(sx(d[1])+4)+'" y="'+(sy(i)+4)+'" font-family="sans-serif" font-size="8" font-weight="700" fill="#1b2230">'+d[1]+'</text>';
    }).join('');
    return '<svg viewBox="0 0 360 176" role="img" aria-label="bbp per hoofd per wereldregio">'+
      '<text x="180" y="16" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">BBP per hoofd (x1000 dollar, koopkracht)</text>'+
      '<line x1="150" y1="22" x2="150" y2="158" stroke="#1b2230" stroke-width="1.4"/>'+rows+'</svg>';
  })(),
  // Nederland: dwarsprofiel rivier met dijken, uiterwaarden, zeespiegel
  rivier:`<svg viewBox="0 0 360 176" role="img" aria-label="dwarsprofiel van een rivier met dijken">
    <rect x="0" y="0" width="360" height="176" fill="#eaf3fb"/>
    <polygon points="0,120 40,120 70,80 90,80 120,110 240,110 270,80 290,80 320,120 360,120 360,176 0,176" fill="#cdb892"/>
    <polygon points="120,110 240,110 240,132 120,132" fill="#5b9bd5"/>
    <rect x="120" y="110" width="120" height="4" fill="#3f78b5"/>
    <text x="180" y="126" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#fff" text-anchor="middle">zomerbed</text>
    <polygon points="90,80 120,110 90,110" fill="#8fae6a"/><polygon points="240,110 270,80 270,110" fill="#8fae6a"/>
    <text x="105" y="103" font-family="sans-serif" font-size="7" fill="#33502a">uiterwaard</text><text x="255" y="103" font-family="sans-serif" font-size="7" fill="#33502a">uiterwaard</text>
    <g font-family="sans-serif" font-size="8" font-weight="700" fill="#1b2230" text-anchor="middle"><text x="80" y="74">winterdijk</text><text x="280" y="74">winterdijk</text></g>
    <line x1="40" y1="120" x2="20" y2="120" stroke="#c0392b" stroke-width="1.6" stroke-dasharray="4 3"/>
    <line x1="320" y1="120" x2="340" y2="120" stroke="#c0392b" stroke-width="1.6" stroke-dasharray="4 3"/>
    <text x="30" y="115" font-family="sans-serif" font-size="7" fill="#c0392b">maaiveld (laag)</text>
    <text x="180" y="170" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">bij hoogwater stroomt het water ook door de uiterwaarden tussen de dijken</text></svg>`,
};

SLAGIO_EXAMENS.vwo.ak = {
  origineel: true,
  titel: 'Aardrijkskunde',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 150,
  max_punten: 20,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Systeem Aarde: een actieve plaatgrens',
      context:'Afbeelding 1 is een dwarsdoorsnede van een convergente plaatgrens, waar een oceanische plaat onder een continentale plaat wegduikt.',
      afb:_VAKAFB.subductie, afb_cap:'afbeelding 1: dwarsdoorsnede van een subductiezone' },
    { nr:2, titel:'Bevolking in transitie',
      context:'Afbeelding 2 toont het demografisch transitiemodel: het geboorte- en sterftecijfer (per 1000 inwoners) tijdens de fasen van sociaaleconomische ontwikkeling.',
      afb:_VAKAFB.dtm, afb_cap:'afbeelding 2: het demografisch transitiemodel' },
    { nr:3, titel:'Een tropisch klimaat',
      context:'Afbeelding 3 is het klimaatdiagram van een plaats in Zuidoost-Azie: staven zijn de maandelijkse neerslag (linkeras), de lijn is de gemiddelde temperatuur (rechteras).',
      afb:_VAKAFB.klimaat, afb_cap:'afbeelding 3: klimaatdiagram van een plaats in Zuidoost-Azie' },
    { nr:4, titel:'Een verdeelde wereld',
      context:'Afbeelding 4 toont het bruto binnenlands product (BBP) per hoofd van de bevolking (in koopkracht) voor zes wereldregio\'s.',
      afb:_VAKAFB.welvaart, afb_cap:'afbeelding 4: BBP per hoofd per wereldregio' },
    { nr:5, titel:'Nederland en het water',
      context:'Afbeelding 5 is een dwarsprofiel van een Nederlandse rivier met winterdijken en uiterwaarden. Grote delen van het achterland liggen onder de rivierwaterstand bij hoogwater.',
      afb:_VAKAFB.rivier, afb_cap:'afbeelding 5: dwarsprofiel van een rivier met dijken en uiterwaarden' },
  ],
  vragen: [
    // Opgave 1
    { nr:1, opgave:1, punten:3, type:'open', domein:'Systeem Aarde',
      vraag:'Leg met afbeelding 1 uit waarom bij deze plaatgrens zowel een diepzeetrog als een keten van vulkanen ontstaat. Betrek in je uitleg wat er met de oceanische plaat gebeurt.',
      antwoord:'De oceanische plaat is zwaarder (dichter) dan de continentale plaat en duikt daaronder weg (subductie). Op de plek waar de plaat naar beneden buigt, ontstaat aan het oppervlak een diepe geul in de oceaanbodem: de diepzeetrog. Naarmate de plaat dieper wegzakt, warmt hij op en komt er water vrij; daardoor smelt gesteente in de mantel gedeeltelijk tot magma. Dit magma is lichter, stijgt op door de continentale plaat en vormt aan het oppervlak een keten van vulkanen evenwijdig aan de plaatgrens.',
      antwoord_rubric:'1 punt: zwaardere oceanische plaat duikt onder de continentale (subductie) -> diepzeetrog. 1 punt: wegduikende plaat veroorzaakt (deels) smelten in de mantel -> magma. 1 punt: opstijgend magma vormt de vulkaanketen.' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Systeem Aarde',
      vraag:'Verklaar waarom in dit type gebied juist zware aardbevingen voorkomen.',
      antwoord:'Bij subductie schuift de oceanische plaat schoksgewijs langs de continentale plaat naar beneden. De platen blijven door de enorme wrijving aan elkaar haken en er bouwt zich spanning op. Als die spanning te groot wordt, schiet de plaat plotseling los en komt in een keer veel energie vrij: een zware aardbeving. Omdat de plaat tot grote diepte doorloopt, komen bevingen hier ook op grote diepte en met hoge magnitude voor.',
      antwoord_rubric:'1 punt: platen haken vast door wrijving -> spanning bouwt op. 1 punt: plotseling losschieten geeft veel energie ineens -> zware (diepe) aardbeving.' },
    // Opgave 2
    { nr:3, opgave:2, punten:3, type:'open', domein:'Wereld',
      vraag:'Beschrijf met afbeelding 2 wat er in fase 2 met het geboorte- en sterftecijfer gebeurt, en leg uit waarom de bevolking in deze fase het snelst groeit.',
      antwoord:'In fase 2 blijft het geboortecijfer nog hoog (rond 40 per 1000), terwijl het sterftecijfer sterk daalt (van rond 38 naar rond 14 per 1000). Die daling komt door betere voeding, hygiene, schoon drinkwater en gezondheidszorg. Omdat het geboortecijfer hoog blijft maar het sterftecijfer snel daalt, wordt het verschil (het geboorteoverschot) in fase 2 het grootst. De natuurlijke bevolkingsgroei is dan het hoogst, want groei = geboortecijfer min sterftecijfer.',
      antwoord_rubric:'1 punt: geboortecijfer blijft hoog, sterftecijfer daalt sterk (met oorzaak: hygiene/zorg/voeding). 1 punt: verschil geboorte- en sterftecijfer is hier het grootst. 1 punt: daardoor grootste natuurlijke groei.' },
    { nr:4, opgave:2, punten:2, type:'open', domein:'Wereld',
      vraag:'In fase 4 daalt het geboortecijfer tot ongeveer het niveau van het sterftecijfer. Noem twee redenen waarom mensen in een ontwikkeld land minder kinderen krijgen.',
      antwoord:'Twee redenen (elk voldoende): (1) kinderen zijn economisch minder nodig, omdat er geen kinderarbeid meer is en er sociale voorzieningen/pensioenen zijn voor de oude dag, terwijl kinderen juist duur zijn (onderwijs). (2) Vrouwen krijgen meer opleiding en gaan werken (emancipatie), en er zijn goede voorbehoedsmiddelen beschikbaar, waardoor mensen bewust voor minder kinderen kiezen. (Ook goed: verstedelijking, hoge kosten van levensonderhoud.)',
      antwoord_rubric:'1 punt: eerste geldige reden (economisch/sociale voorzieningen/kosten). 1 punt: tweede geldige reden (emancipatie/opleiding vrouwen, voorbehoedsmiddelen).' },
    // Opgave 3
    { nr:5, opgave:3, punten:3, type:'open', domein:'Klimaat',
      vraag:'Bepaal met afbeelding 3 welk klimaattype (volgens Koppen) hier het best past, en onderbouw dit met minstens twee kenmerken uit het diagram.',
      antwoord:'Het is een tropisch moessonklimaat (Koppen: Am). Onderbouwing met het diagram: (1) de temperatuur is het hele jaar hoog, boven de 26 C, met vrijwel geen jaarschommeling (kenmerkend tropisch, A-klimaat). (2) Er is een duidelijk nat en droog seizoen: van juni tot september valt zeer veel neerslag (200 tot 300 mm per maand, de moesson), terwijl de wintermaanden droog zijn (onder 30 mm). De totale jaarneerslag is hoog. Het uitgesproken droge seizoen (met toch veel neerslag in het natte seizoen) hoort bij het moessontype Am, niet bij het altijd natte Af.',
      antwoord_rubric:'1 punt: tropisch (moesson)klimaat, Koppen Am (A-klimaat). 1 punt: temperatuur altijd hoog (>18 of >26 C) met kleine jaarschommeling. 1 punt: duidelijk nat/droog seizoen (moesson) genoemd met cijfers uit diagram.' },
    // Opgave 4
    { nr:6, opgave:4, punten:3, type:'open', domein:'Wereld',
      vraag:'Beschrijf met afbeelding 4 het patroon van de mondiale welvaartsverdeling, en leg met een centrum-periferiemodel uit hoe dit patroon in stand kan blijven.',
      antwoord:'Het patroon laat een groot verschil zien tussen een rijk "Noorden" (Noord-Amerika en West-Europa, met 48 tot 62 duizend dollar per hoofd) en een veel armer "Zuiden" (Afrika bezuiden de Sahara en Zuid-Azie, met 4 tot 7 duizend dollar per hoofd); Oost-Azie en Latijns-Amerika zitten daartussenin (semiperiferie). Volgens het centrum-periferiemodel blijft dit in stand doordat het centrum de hoogwaardige, winstgevende activiteiten (kennis, hoofdkantoren, technologie) beheerst, terwijl de periferie vooral grondstoffen en goedkope arbeid levert tegen lage prijzen. De winst en de kennis stromen naar het centrum, waardoor het verschil zichzelf versterkt en de periferie afhankelijk blijft.',
      antwoord_rubric:'1 punt: patroon rijk Noorden tegenover arm Zuiden met cijfers uit diagram. 1 punt: centrum beheerst hoogwaardige activiteiten, periferie levert grondstoffen/goedkope arbeid. 1 punt: winst/kennis stroomt naar centrum -> verschil blijft/versterkt (afhankelijkheid).' },
    // Opgave 5
    { nr:7, opgave:5, punten:3, type:'open', domein:'Leefomgeving',
      vraag:'Leg met afbeelding 5 uit waarom de uiterwaarden tussen de dijken belangrijk zijn bij hoogwater, en beredeneer waarom "ruimte voor de rivier" (uiterwaarden verbreden) veiliger kan zijn dan alleen de dijken verhogen.',
      antwoord:'Bij hoogwater kan de rivier niet meer in het smalle zomerbed. Het water stroomt dan de uiterwaarden in: de brede ruimte tussen de winterdijken. Doordat het water zich over een veel grotere breedte verdeelt, kan er meer water worden afgevoerd zonder dat de waterstand extreem stijgt. "Ruimte voor de rivier" verbreedt die uiterwaarden of verlaagt ze, zodat er nog meer water bij past en de piek lager blijft. Dat is veiliger dan alleen dijken verhogen, want hogere dijken houden meer water tegen op een steeds hoger niveau: als zo\'n dijk dan toch doorbreekt, is de overstroming veel dieper en catastrofaler. Door de rivier ruimte te geven verlaag je de waterstand zelf, in plaats van steeds meer water op te stuwen.',
      antwoord_rubric:'1 punt: uiterwaarden geven bij hoogwater extra doorstroombreedte -> meer afvoer, lagere waterstand. 1 punt: ruimte voor de rivier verlaagt de piekwaterstand (verbreden/verlagen). 1 punt: veiliger dan dijken verhogen (steeds hoger opstuwen geeft bij doorbraak diepere/catastrofalere overstroming).' },
    { nr:8, opgave:5, punten:1, type:'open', domein:'Leefomgeving',
      vraag:'Noem een nadeel van de maatregel "ruimte voor de rivier" voor de bewoners van het gebied.',
      antwoord:'Een nadeel is dat bewoners of boeren in de uiterwaarden soms moeten verhuizen of hun grond verliezen, omdat die grond nodig is om de rivier te verbreden (onteigening, verlies van landbouwgrond of woningen). Ook kan het gebied vaker onder water komen te staan.',
      antwoord_rubric:'1 punt: een geldig nadeel (verlies van grond/woningen, onteigening, verhuizen, vaker onderlopen van uiterwaarden).' },
  ],
};
