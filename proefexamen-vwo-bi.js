// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-bi.js  ORIGINEEL Slagio-proefexamen (vwo biologie).
// Eigen contexten, vragen en figuren. Geen reproductie van een CvTE-examen.
// VWO-CE-niveau: moleculaire biologie, celfysiologie, homeostase, genetica
// en evolutie, met redeneren, rekenen en gegevens interpreteren.
//   opgaven[] = {nr,titel,context,afb,afb_cap}
//   vragen[]  = {nr,opgave,punten,type,vraag,antwoord,antwoord_rubric,domein}
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

function _vbiAx(){
  return '<line x1="52" y1="14" x2="52" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/>'+
         '<line x1="52" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M344 158 L334 154 L334 162 Z" fill="#1b2230"/>';
}

var _VBIAFB = {
  // Eiwitsynthese: DNA -> mRNA -> ribosoom -> polypeptide, met codontabel
  eiwitsynthese:`<svg viewBox="0 0 360 214" role="img" aria-label="schema van de eiwitsynthese"><text x="20" y="24" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#2563eb">DNA (matrijsstreng)</text><rect x="20" y="30" width="230" height="18" rx="3" fill="#eef4ff" stroke="#2563eb" stroke-width="1.1"/><text x="30" y="43" font-family="monospace" font-size="11" fill="#1b2230" letter-spacing="3">TAC CGG CTT ATT</text><g stroke="#94a0b8" stroke-width="1.4"><line x1="135" y1="50" x2="135" y2="66"/><path d="M131 60 L135 68 L139 60" fill="#94a0b8"/></g><text x="145" y="63" font-family="sans-serif" font-size="8.5" fill="#4a5568">transcriptie</text><rect x="20" y="70" width="230" height="18" rx="3" fill="#fff7ed" stroke="#e8580c" stroke-width="1.1"/><text x="30" y="83" font-family="monospace" font-size="11" fill="#1b2230" letter-spacing="3">AUG GCC GAA UAA</text><g stroke="#94a0b8" stroke-width="1.4"><line x1="135" y1="90" x2="135" y2="106"/><path d="M131 100 L135 108 L139 100" fill="#94a0b8"/></g><text x="145" y="103" font-family="sans-serif" font-size="8.5" fill="#4a5568">translatie</text><ellipse cx="120" cy="128" rx="60" ry="20" fill="#e5f6ec" stroke="#2e9e5b" stroke-width="1.3"/><text x="120" y="132" font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle">ribosoom</text><g fill="#3aa06e"><circle cx="210" cy="120" r="7"/><circle cx="226" cy="126" r="7"/><circle cx="240" cy="120" r="7"/></g><text x="300" y="124" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="middle">polypeptide</text><rect x="20" y="158" width="320" height="46" rx="5" fill="#f7f9fc" stroke="#c9cfda" stroke-width="1"/><text x="180" y="172" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">codontabel (mRNA)</text><g font-family="monospace" font-size="9.5" fill="#1b2230"><text x="34" y="188">AUG = Met (start)</text><text x="150" y="188">GCC = Ala</text><text x="250" y="188">GAA = Glu</text><text x="34" y="200">UAA = stop</text><text x="150" y="200">CUU = Leu</text><text x="250" y="200">AAU = Asn</text></g></svg>`,
  // Membraantransport: gradiënt + pomp (actief transport, ATP)
  membraan:`<svg viewBox="0 0 360 190" role="img" aria-label="actief transport door een membraan"><rect x="20" y="70" width="320" height="44" fill="#fdf2e0"/><g fill="#f2c744" stroke="#d9a520" stroke-width="0.8">${Array.from({length:26},(_,i)=>'<circle cx="'+(28+i*12)+'" cy="76" r="4"/>').join('')}${Array.from({length:26},(_,i)=>'<circle cx="'+(28+i*12)+'" cy="108" r="4"/>').join('')}</g><text x="30" y="46" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1b2230">buiten (lage concentratie)</text><text x="30" y="150" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1b2230">binnen (hoge concentratie)</text><g fill="#2563eb">${[[70,132],[110,140],[150,134],[200,142],[250,136],[300,140],[230,152],[300,152],[270,150]].map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4"/>').join('')}${[[130,54],[220,58]].map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4"/>').join('')}</g><rect x="164" y="66" width="32" height="52" rx="8" fill="#cfe0fb" stroke="#2563eb" stroke-width="1.4"/><g stroke="#e05353" stroke-width="2" fill="none"><line x1="180" y1="140" x2="180" y2="56"/><path d="M175 64 L180 52 L185 64" fill="#e05353" stroke="none"/></g><text x="212" y="92" font-family="sans-serif" font-size="8.5" fill="#e05353" font-weight="700">tegen de<tspan x="212" dy="10">gradiënt in</tspan></text><text x="230" y="150" font-family="sans-serif" font-size="8.5" fill="#4a5568">ATP -&gt; ADP + P</text></svg>`,
  // Actiepotentiaal: membraanpotentiaal (mV) tegen tijd
  actiepotentiaal:(function(){
    var sy=function(mv){return 120-(mv+80)/120*104;}; // -80..+40 mV
    var yl=[[-80,-80],[-40,-40],[0,0],[40,40]].map(p=>'<line x1="52" y1="'+sy(p[1]).toFixed(1)+'" x2="340" y2="'+sy(p[1]).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="47" y="'+(sy(p[1])+3).toFixed(1)+'" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="end">'+p[0]+'</text>').join('');
    var rest=sy(-70), peak=sy(30), thr=sy(-55), hyper=sy(-80);
    var curve='<path d="M56 '+rest+' L110 '+rest+' L128 '+thr+' Q150 '+peak+' 168 '+peak+' Q190 '+peak+' 210 '+hyper+' L240 '+hyper+' Q258 '+hyper+' 276 '+rest+' L332 '+rest+'" fill="none" stroke="#e8580c" stroke-width="2.8" stroke-linejoin="round"/>';
    var thrLine='<line x1="52" y1="'+thr+'" x2="340" y2="'+thr+'" stroke="#94a0b8" stroke-width="1" stroke-dasharray="4 4"/><text x="336" y="'+(thr-4)+'" font-family="sans-serif" font-size="8" fill="#8a94a8" text-anchor="end">drempel</text>';
    return '<svg viewBox="0 0 360 190" role="img" aria-label="actiepotentiaal">'+yl+'<line x1="52" y1="14" x2="52" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/><line x1="52" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M344 158 L334 154 L334 162 Z" fill="#1b2230"/>'+thrLine+curve+'<g font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle"><text x="150" y="150">depolarisatie</text><text x="234" y="150">repolarisatie</text></g><text x="0" y="0" transform="translate(16,86) rotate(-90)" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">membraanpotentiaal (mV)</text><text x="300" y="184" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">tijd (ms)</text></svg>';
  })(),
  // Negatieve terugkoppeling: bloedglucoseregeling (kringloop)
  terugkoppeling:`<svg viewBox="0 0 360 188" role="img" aria-label="negatieve terugkoppeling bloedglucose"><g font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle">${[['bloedglucose\nstijgt',180,26,'#fde7e7','#e05353'],['alvleesklier\nmaakt insuline',300,96,'#eef4ff','#2563eb'],['cellen nemen\nglucose op',180,162,'#e5f6ec','#2e9e5b'],['bloedglucose\ndaalt',60,96,'#fff7ed','#e8580c']].map(function(b){var lines=b[0].split('\n');return '<rect x="'+(b[1]-52)+'" y="'+(b[2]-18)+'" width="104" height="36" rx="9" fill="'+b[3]+'" stroke="'+b[4]+'" stroke-width="1.3"/>'+lines.map(function(ln,k){return '<text x="'+b[1]+'" y="'+(b[2]-3+k*12)+'">'+ln+'</text>';}).join('');}).join('')}</g><g stroke="#94a0b8" stroke-width="1.6" fill="none"><path d="M232 40 Q270 52 282 76"/><path d="M300 116 Q262 150 232 150"/><path d="M128 150 Q90 138 78 116"/><path d="M60 76 Q90 40 128 32"/></g><g fill="#94a0b8">${[[280,74],[233,150],[77,118],[129,31]].map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="2.6"/>').join('')}</g><text x="180" y="98" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#8a94a8" text-anchor="middle">negatieve<tspan x="180" dy="11">terugkoppeling</tspan></text></svg>`,
  // Stamboom: X-chromosomaal recessieve aandoening
  stamboom:`<svg viewBox="0 0 360 180" role="img" aria-label="stamboom van een aandoening"><g stroke="#1b2230" stroke-width="1.5" fill="#fff"><rect x="70" y="24" width="20" height="20"/><circle cx="150" cy="34" r="11" fill="#1b2230"/><line x1="90" y1="34" x2="139" y2="34"/></g><line x1="115" y1="34" x2="115" y2="70" stroke="#1b2230" stroke-width="1.4"/><line x1="60" y1="70" x2="200" y2="70" stroke="#1b2230" stroke-width="1.4"/><g stroke="#1b2230" stroke-width="1.5"><line x1="60" y1="70" x2="60" y2="80"/><line x1="130" y1="70" x2="130" y2="80"/><line x1="200" y1="70" x2="200" y2="80"/></g><g stroke="#1b2230" stroke-width="1.5"><circle cx="60" cy="92" r="11" fill="#fff"/><rect x="120" y="82" width="20" height="20" fill="#1b2230"/><circle cx="200" cy="92" r="11" fill="#fff"/></g><line x1="200" y1="92" x2="250" y2="92" stroke="#1b2230" stroke-width="1.4"/><rect x="250" y="82" width="20" height="20" fill="#fff" stroke="#1b2230" stroke-width="1.5"/><line x1="235" y1="92" x2="235" y2="126" stroke="#1b2230" stroke-width="1.4"/><line x1="210" y1="126" x2="260" y2="126" stroke="#1b2230" stroke-width="1.4"/><g stroke="#1b2230" stroke-width="1.5"><line x1="210" y1="126" x2="210" y2="134"/><line x1="260" y1="126" x2="260" y2="134"/><circle cx="210" cy="146" r="11" fill="#fff"/><rect x="250" y="136" width="20" height="20" fill="#1b2230"/></g><g font-family="sans-serif" font-size="8" fill="#4a5568"><text x="24" y="38">I</text><text x="24" y="96">II</text><text x="190" y="150">III</text></g><g font-family="sans-serif" font-size="8" fill="#1b2230"><rect x="284" y="24" width="11" height="11" fill="#1b2230"/><text x="300" y="33">aangedaan</text><rect x="284" y="40" width="11" height="11" fill="#fff" stroke="#1b2230"/><text x="300" y="49">gezond</text><text x="284" y="66">□ man  ○ vrouw</text></g></svg>`,
  // Hardy-Weinberg: genotypefrequenties p^2, 2pq, q^2
  hardyweinberg:(function(){
    var data=[['AA (p²)',0.64,'#2563eb'],['Aa (2pq)',0.32,'#2e9e5b'],['aa (q²)',0.04,'#e8580c']];
    var sy=function(f){return 150-f*150;};
    var yl=[0,0.25,0.5,0.75,1.0].map(v=>'<line x1="56" y1="'+sy(v).toFixed(1)+'" x2="336" y2="'+sy(v).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(v)+3).toFixed(1)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="end">'+v.toFixed(2)+'</text>').join('');
    var bars=data.map(function(d,i){var x=90+i*78;var y=sy(d[1]);return '<rect x="'+x+'" y="'+y.toFixed(1)+'" width="52" height="'+(150-y).toFixed(1)+'" rx="2" fill="'+d[2]+'"/><text x="'+(x+26)+'" y="'+(y-5).toFixed(1)+'" font-family="sans-serif" font-size="9" font-weight="700" fill="#1b2230" text-anchor="middle">'+d[1].toFixed(2)+'</text><text x="'+(x+26)+'" y="166" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="middle">'+d[0]+'</text>';}).join('');
    return '<svg viewBox="0 0 360 194" role="img" aria-label="genotypefrequenties Hardy-Weinberg">'+yl+'<line x1="56" y1="14" x2="56" y2="150" stroke="#1b2230" stroke-width="1.8"/><line x1="56" y1="150" x2="336" y2="150" stroke="#1b2230" stroke-width="1.8"/>'+bars+'<text x="0" y="0" transform="translate(18,84) rotate(-90)" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">frequentie</text></svg>';
  })(),
};

SLAGIO_EXAMENS.vwo.bi = {
  origineel: true,
  titel: 'Biologie',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 150,
  max_punten: 33,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Van gen naar eiwit',
      context:'Afbeelding 1 toont de synthese van een eiwit. Bovenaan staat de matrijsstreng (template) van een stukje DNA; daaronder het mRNA en de vertaling in het ribosoom. Gebruik de codontabel.',
      afb:_VBIAFB.eiwitsynthese, afb_cap:'afbeelding 1: transcriptie en translatie met codontabel' },
    { nr:2, titel:'Transport door het membraan',
      context:'Afbeelding 2 toont een celmembraan met een transporteiwit. De stof (blauwe deeltjes) wordt van buiten (lage concentratie) naar binnen (hoge concentratie) verplaatst; daarbij wordt ATP verbruikt.',
      afb:_VBIAFB.membraan, afb_cap:'afbeelding 2: transport van een stof door het membraan' },
    { nr:3, titel:'De zenuwimpuls',
      context:'Afbeelding 3 toont het verloop van de membraanpotentiaal van een zenuwcel tijdens een actiepotentiaal.',
      afb:_VBIAFB.actiepotentiaal, afb_cap:'afbeelding 3: de membraanpotentiaal tegen de tijd' },
    { nr:4, titel:'Bloedglucose in balans',
      context:'Afbeelding 4 is een schema van de regeling van de bloedglucoseconcentratie na een maaltijd.',
      afb:_VBIAFB.terugkoppeling, afb_cap:'afbeelding 4: regeling van de bloedglucoseconcentratie' },
    { nr:5, titel:'Overerving in een familie',
      context:'In een familie komt een erfelijke aandoening voor. Afbeelding 5 is de stamboom. De aandoening wordt veroorzaakt door een recessief allel dat op het X-chromosoom ligt.',
      afb:_VBIAFB.stamboom, afb_cap:'afbeelding 5: stamboom van de aandoening' },
    { nr:6, titel:'Allelen in een populatie',
      context:'In een grote populatie is de aandoening uit opgave 5 zeldzaam. Afbeelding 6 toont de genotypefrequenties van een autosomaal gen (dus niet X-gebonden) in een populatie die in Hardy-Weinberg-evenwicht is. A is dominant, a is recessief.',
      afb:_VBIAFB.hardyweinberg, afb_cap:'afbeelding 6: genotypefrequenties in Hardy-Weinberg-evenwicht' },
  ],
  vragen: [
    // Opgave 1
    { nr:1, opgave:1, punten:2, type:'open', domein:'Moleculair',
      vraag:'Leid uit de matrijsstreng (DNA) van afbeelding 1 af dat het mRNA de basevolgorde AUG-GCC-GAA-UAA heeft. Leg de basenparingsregels uit die je gebruikt.',
      antwoord:'Bij transcriptie wordt op de matrijsstreng een complementair mRNA gemaakt volgens de basenparing A-U (in plaats van A-T bij RNA), T-A, G-C en C-G. TAC geeft dus AUG, CGG geeft GCC, CTT geeft GAA en ATT geeft UAA. Zo ontstaat het mRNA AUG-GCC-GAA-UAA.',
      antwoord_rubric:'1 punt: complementaire basenparing benoemd, met U i.p.v. T in RNA. 1 punt: correcte afleiding TAC-CGG-CTT-ATT → AUG-GCC-GAA-UAA.' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Moleculair',
      vraag:'Bepaal met de codontabel de aminozuurvolgorde van het polypeptide dat bij dit mRNA hoort.',
      antwoord:'AUG = Met (start), GCC = Ala, GAA = Glu, UAA = stop. Het polypeptide is dus Met-Ala-Glu; bij UAA stopt de translatie (geen aminozuur).',
      antwoord_rubric:'1 punt: Met-Ala-Glu in de juiste volgorde. 1 punt: UAA is een stopcodon (codeert geen aminozuur).' },
    { nr:3, opgave:1, punten:3, type:'open', domein:'Moleculair',
      vraag:'Door een puntmutatie verandert in het DNA het derde tripletcodon van CTT in CTC. Beredeneer welk gevolg dit heeft voor het eiwit, en leg uit waarom zo\'n mutatie een "stille mutatie" kan zijn.',
      antwoord:'CTT wordt CTC; het bijbehorende mRNA-codon verandert dan van GAA in GAG. Beide codons coderen voor hetzelfde aminozuur (glutaminezuur, Glu), doordat de genetische code gedegenereerd is (meerdere codons voor één aminozuur). Het eiwit verandert dus niet: dit is een stille mutatie.',
      antwoord_rubric:'1 punt: mRNA-codon verandert van GAA naar GAG. 1 punt: beide coderen voor hetzelfde aminozuur (Glu) door de gedegenereerde code. 1 punt: conclusie: geen verandering in het eiwit = stille mutatie.' },
    // Opgave 2
    { nr:4, opgave:2, punten:3, type:'open', domein:'Cel',
      vraag:'Leg met afbeelding 2 uit dat dit transport géén diffusie of osmose kan zijn, maar actief transport is. Gebruik de begrippen concentratiegradiënt en ATP.',
      antwoord:'De stof wordt van een lage naar een hoge concentratie verplaatst, dus tegen de concentratiegradiënt in. Diffusie en osmose verlopen juist mét de gradiënt mee (van hoog naar laag) en kosten geen energie. Transport tegen de gradiënt in kan alleen met een transporteiwit dat energie gebruikt; in de figuur wordt daarvoor ATP verbruikt (ATP → ADP + P). Daarom is dit actief transport.',
      antwoord_rubric:'1 punt: de stof gaat tegen de gradiënt in (van laag naar hoog). 1 punt: diffusie/osmose gaat juist mét de gradiënt mee en kost geen energie. 1 punt: transport tegen de gradiënt vereist energie (ATP) → actief transport.' },
    { nr:5, opgave:2, punten:2, type:'open', domein:'Cel',
      vraag:'Een gif blokkeert in deze cel de vorming van ATP. Beredeneer wat er daardoor met dit transport gebeurt en met het concentratieverschil over het membraan.',
      antwoord:'Zonder ATP heeft het transporteiwit geen energie meer om de stof tegen de gradiënt in te pompen, dus het actieve transport stopt. Het opgebouwde concentratieverschil kan dan niet meer in stand worden gehouden; door lekdiffusie zal de stof geleidelijk terugstromen van hoog naar laag, waardoor het concentratieverschil kleiner wordt en uiteindelijk verdwijnt.',
      antwoord_rubric:'1 punt: zonder ATP stopt het actieve transport (geen energie). 1 punt: het concentratieverschil neemt af / verdwijnt (de stof diffundeert terug).' },
    // Opgave 3
    { nr:6, opgave:3, punten:3, type:'open', domein:'Regeling',
      vraag:'Beschrijf met afbeelding 3 de ionbewegingen tijdens de depolarisatie en de repolarisatie. Betrek de rustpotentiaal en de rol van natrium- en kaliumionen.',
      antwoord:'In rust is de membraanpotentiaal ongeveer -70 mV (binnenkant negatief). Bij depolarisatie gaan de natriumkanalen open en stromen Na⁺-ionen de cel in; daardoor wordt de binnenkant positief en schiet de potentiaal omhoog naar ongeveer +30 mV. Bij repolarisatie sluiten de natriumkanalen en gaan de kaliumkanalen open, zodat K⁺-ionen de cel uit stromen; de binnenkant wordt weer negatief en de potentiaal daalt terug (met kort een ondershoot) naar de rustwaarde.',
      antwoord_rubric:'1 punt: rustpotentiaal ± -70 mV. 1 punt: depolarisatie = Na⁺ de cel in → binnenkant positief (+30 mV). 1 punt: repolarisatie = K⁺ de cel uit → terug naar negatief.' },
    { nr:7, opgave:3, punten:2, type:'open', domein:'Regeling',
      vraag:'Na de actiepotentiaal herstelt de natrium-kaliumpomp de oorspronkelijke ionverdeling. Leg uit waarom dit herstel energie (ATP) kost en waarom het noodzakelijk is voor een volgende impuls.',
      antwoord:'Tijdens de impuls is Na⁺ naar binnen en K⁺ naar buiten gestroomd, elk mét hun gradiënt mee. De natrium-kaliumpomp pompt Na⁺ weer naar buiten en K⁺ weer naar binnen, dus tegen de concentratiegradiënten in; dat is actief transport en kost daarom ATP. Zonder dit herstel verdwijnen de gradiënten en kan er geen nieuwe depolarisatie (instroom van Na⁺) plaatsvinden, zodat een volgende impuls onmogelijk wordt.',
      antwoord_rubric:'1 punt: de pomp verplaatst Na⁺/K⁺ tegen hun gradiënt in → actief transport → kost ATP. 1 punt: zonder herstel van de gradiënten is geen nieuwe actiepotentiaal mogelijk.' },
    // Opgave 4
    { nr:8, opgave:4, punten:3, type:'open', domein:'Regeling',
      vraag:'Leg met afbeelding 4 uit waarom dit een negatieve terugkoppeling is, en waarom de bloedglucoseconcentratie hierdoor rond een vaste waarde stabiel blijft (homeostase).',
      antwoord:'Een stijging van de bloedglucose zet de alvleesklier aan tot het maken van insuline; insuline zorgt dat lichaamscellen glucose opnemen, waardoor de bloedglucose weer daalt. Het gevolg (glucose daalt) werkt dus de oorzaak (glucose was gestegen) tegen: dat is negatieve terugkoppeling. Doordat een afwijking steeds wordt tegengewerkt (zowel te hoog als te laag wordt gecorrigeerd), blijft de bloedglucose rond een vaste streefwaarde schommelen: homeostase.',
      antwoord_rubric:'1 punt: het effect (glucose daalt) werkt de oorzaak (glucose steeg) tegen = negatieve terugkoppeling. 1 punt: koppeling insuline → cellen nemen glucose op → glucose daalt. 1 punt: afwijkingen worden gecorrigeerd → stabiele streefwaarde (homeostase).' },
    { nr:9, opgave:4, punten:2, type:'open', domein:'Regeling',
      vraag:'Bij iemand met diabetes type 1 maakt de alvleesklier geen insuline meer. Beredeneer met het schema wat er na een maaltijd met de bloedglucose gebeurt en waarom.',
      antwoord:'Zonder insuline valt de stap "cellen nemen glucose op" grotendeels weg: de lichaamscellen krijgen het signaal niet om glucose uit het bloed te halen. Na een maaltijd komt er wel glucose in het bloed, maar die wordt niet opgenomen, waardoor de bloedglucoseconcentratie sterk stijgt en hoog blijft (hyperglykemie). De negatieve terugkoppeling die de glucose zou laten dalen, is onderbroken.',
      antwoord_rubric:'1 punt: zonder insuline nemen de cellen de glucose niet (goed) op. 1 punt: de bloedglucose stijgt sterk en blijft hoog (terugkoppeling onderbroken).' },
    // Opgave 5
    { nr:10, opgave:5, punten:3, type:'open', domein:'Genetica',
      vraag:'Toon met de stamboom (afbeelding 5) aan dat de overerving past bij een X-chromosomaal recessief allel, en niet bij een autosomaal dominant allel.',
      antwoord:'De aandoening komt vooral bij mannen voor en kan een generatie overslaan (niet-aangedane ouders krijgen een aangedane zoon), wat past bij recessief. Omdat mannen maar één X-chromosoom hebben, zijn zij bij één recessief allel al aangedaan, terwijl vrouwen twee recessieve allelen nodig hebben; daardoor zijn er meer aangedane mannen. Een aangedane zoon erft het allel via zijn (draagster-)moeder. Bij een autosomaal dominant allel zou de aandoening juist in elke generatie voorkomen en ongeveer even vaak bij mannen als vrouwen, en zou elke aangedane persoon een aangedane ouder hebben; dat past niet bij de stamboom.',
      antwoord_rubric:'1 punt: meer aangedane mannen dan vrouwen, passend bij X-recessief (man met één allel al aangedaan). 1 punt: de aandoening slaat een generatie over / komt via draagster-moeders → recessief. 1 punt: uitsluiten autosomaal dominant (zou elke generatie en beide geslachten gelijk treffen).' },
    { nr:11, opgave:5, punten:3, type:'open', domein:'Genetica',
      vraag:'Een niet-aangedane vrouw die draagster is (X^A X^a) krijgt kinderen met een niet-aangedane man (X^A Y). Geef het kruisingsschema en bereken de kans dat een willekeurig kind van dit paar de aandoening heeft.',
      antwoord:'Gameten moeder: X^A en X^a; gameten vader: X^A en Y. Nakomelingen: X^A X^A (gezonde dochter), X^A X^a (draagster-dochter), X^A Y (gezonde zoon), X^a Y (aangedane zoon). Elk met kans ¼. Alleen X^a Y is aangedaan, dus de kans dat een willekeurig kind de aandoening heeft is ¼ (25%). (Van de zonen is de helft aangedaan, van de dochters geen.)',
      antwoord_rubric:'1 punt: juiste gameten en kruisingsschema. 1 punt: de vier genotypen X^A X^A, X^A X^a, X^A Y, X^a Y. 1 punt: kans op een aangedaan kind = ¼ (25%).' },
    // Opgave 6
    { nr:12, opgave:6, punten:2, type:'open', domein:'Evolutie',
      vraag:'In afbeelding 6 is de frequentie van het genotype aa gelijk aan 0,04. Bereken met de Hardy-Weinberg-verhouding de allelfrequenties van a en A.',
      antwoord:'q² = frequentie aa = 0,04, dus q (frequentie van allel a) = √0,04 = 0,2. Dan is p (frequentie van allel A) = 1 − q = 1 − 0,2 = 0,8. (Controle: p² = 0,64 en 2pq = 2·0,8·0,2 = 0,32, zoals in de figuur.)',
      antwoord_rubric:'1 punt: q = √0,04 = 0,2. 1 punt: p = 1 − 0,2 = 0,8.' },
    { nr:13, opgave:6, punten:3, type:'open', domein:'Evolutie',
      vraag:'Bereken welk deel van de populatie drager is van het recessieve allel zonder zelf het recessieve genotype te hebben. Leg daarna uit waarom een recessief allel ook bij zeldzame aandoeningen lang in een populatie aanwezig kan blijven.',
      antwoord:'De heterozygote dragers hebben genotype Aa, met frequentie 2pq = 2 · 0,8 · 0,2 = 0,32, dus 32% van de populatie is drager zonder de aandoening. Een recessief allel blijft lang aanwezig omdat het bij heterozygoten (Aa) verborgen zit: die dragers hebben zelf geen aandoening, dus de natuurlijke selectie "ziet" het allel niet en verwijdert het niet. Alleen de zeldzame homozygoot recessieven (aa) worden getroffen, terwijl het merendeel van de a-allelen veilig in dragers wordt doorgegeven.',
      antwoord_rubric:'1 punt: dragers = 2pq = 0,32 (32%). 1 punt: het recessieve allel zit verborgen bij heterozygote dragers (geen aandoening). 1 punt: selectie werkt daardoor nauwelijks tegen het allel → het blijft lang aanwezig.' },
  ],
};
