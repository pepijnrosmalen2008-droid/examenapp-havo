// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-na.js  ORIGINEEL Slagio-proefexamen (vwo natuurkunde).
// Eigen contexten, vragen en figuren. Geen reproductie van een CvTE-examen.
// VWO-CE-niveau: kinematica, krachten/Newton, arbeid & energie, harmonische
// trilling, kernfysica en het foto-elektrisch effect. g = 9,81 N/kg.
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

function _vnaAxA(){
  return '<line x1="52" y1="14" x2="52" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/>'+
         '<line x1="52" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M344 158 L334 154 L334 162 Z" fill="#1b2230"/>';
}

var _VNAAFB = {
  // v-t diagram: eenparig versnellen dan constant
  vt:(function(){
    var sy=function(v){return 150-v/28*120;}, sx=function(t){return 56+t/10*280;};
    var yl=[0,7,14,21,28].map(v=>'<line x1="56" y1="'+sy(v).toFixed(1)+'" x2="340" y2="'+sy(v).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(v)+3).toFixed(1)+'" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="end">'+v+'</text>').join('');
    var xl=[0,2,4,6,8,10].map(t=>'<text x="'+sx(t).toFixed(1)+'" y="166" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="middle">'+t+'</text>').join('');
    var line='<polyline points="'+sx(0)+','+sy(0)+' '+sx(6)+','+sy(24)+' '+sx(10)+','+sy(24)+'" fill="none" stroke="#2563eb" stroke-width="3"/>';
    return '<svg viewBox="0 0 360 194" role="img" aria-label="snelheid-tijd diagram">'+yl+'<line x1="56" y1="14" x2="56" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M56 14 L52 24 L60 24 Z" fill="#1b2230"/><line x1="56" y1="150" x2="342" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M342 150 L334 146 L334 154 Z" fill="#1b2230"/>'+line+xl+'<text x="0" y="0" transform="translate(18,84) rotate(-90)" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">snelheid (m/s)</text><text x="280" y="184" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">tijd (s)</text></svg>';
  })(),
  // Hellend vlak met blok en hoek
  helling:`<svg viewBox="0 0 360 178" role="img" aria-label="blok op een hellend vlak"><polygon points="40,150 320,150 320,60" fill="#eef4ff" stroke="#1b2230" stroke-width="1.6"/><path d="M320 150 A70 70 0 0 0 305 120" fill="none" stroke="#e8580c" stroke-width="1.4"/><text x="292" y="142" font-family="sans-serif" font-size="11" font-weight="700" fill="#e8580c">30&#176;</text><g transform="rotate(-17.7 200 108)"><rect x="176" y="88" width="48" height="30" rx="3" fill="#cfe0fb" stroke="#1b2230" stroke-width="1.4"/><text x="200" y="107" font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle">2,0 kg</text></g><g stroke="#e05353" stroke-width="1.8" fill="none"><line x1="200" y1="103" x2="200" y2="150"/><path d="M195 143 L200 153 L205 143" fill="#e05353" stroke="none"/></g><text x="210" y="140" font-family="sans-serif" font-size="8.5" fill="#e05353">F&#7793; (zwaartekracht)</text></svg>`,
  // F-u grafiek van een veer (arbeid = oppervlak)
  veer:(function(){
    var sy=function(F){return 150-F/40*120;}, sx=function(u){return 56+u/0.20*280;};
    var yl=[0,10,20,30,40].map(F=>'<line x1="56" y1="'+sy(F).toFixed(1)+'" x2="340" y2="'+sy(F).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(F)+3).toFixed(1)+'" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="end">'+F+'</text>').join('');
    var xl=[0,0.05,0.10,0.15,0.20].map(u=>'<text x="'+sx(u).toFixed(1)+'" y="166" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+u.toFixed(2)+'</text>').join('');
    var line='<line x1="'+sx(0)+'" y1="'+sy(0)+'" x2="'+sx(0.16)+'" y2="'+sy(32)+'" stroke="#e8580c" stroke-width="2.8"/>';
    var fill='<polygon points="'+sx(0)+','+sy(0)+' '+sx(0.16)+','+sy(0)+' '+sx(0.16)+','+sy(32)+'" fill="rgba(232,88,12,0.10)"/>';
    var mark='<line x1="'+sx(0.16)+'" y1="'+sy(32)+'" x2="'+sx(0.16)+'" y2="'+sy(0)+'" stroke="#94a0b8" stroke-width="1" stroke-dasharray="4 4"/><text x="'+sx(0.10)+'" y="'+(sy(6))+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">arbeid = oppervlak</text>';
    return '<svg viewBox="0 0 360 194" role="img" aria-label="kracht-uitrekking van een veer">'+yl+fill+'<line x1="56" y1="14" x2="56" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M56 14 L52 24 L60 24 Z" fill="#1b2230"/><line x1="56" y1="150" x2="342" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M342 150 L334 146 L334 154 Z" fill="#1b2230"/>'+line+mark+xl+'<text x="0" y="0" transform="translate(18,84) rotate(-90)" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">kracht (N)</text><text x="270" y="184" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">uitrekking (m)</text></svg>';
  })(),
  // Harmonische trilling u-t
  trilling:(function(){
    var sy=function(u){return 86-u/0.06*64;}, sx=function(t){return 56+t/0.8*280;};
    var f=function(t){return 0.05*Math.sin(2*Math.PI/0.4*t);};
    var pts=[]; for(var t=0;t<=0.8001;t+=0.02){ pts.push(sx(t).toFixed(1)+','+sy(f(t)).toFixed(1)); }
    var yl=[[-0.05,-0.05],[0,0],[0.05,0.05]].map(p=>'<line x1="56" y1="'+sy(p[1]).toFixed(1)+'" x2="340" y2="'+sy(p[1]).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(p[1])+3).toFixed(1)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="end">'+p[0].toFixed(2)+'</text>').join('');
    var xl=[0,0.2,0.4,0.6,0.8].map(t=>'<text x="'+sx(t).toFixed(1)+'" y="172" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+t.toFixed(1)+'</text>').join('');
    return '<svg viewBox="0 0 360 188" role="img" aria-label="harmonische trilling">'+yl+'<line x1="56" y1="14" x2="56" y2="158" stroke="#1b2230" stroke-width="1.8"/><path d="M56 14 L52 24 L60 24 Z" fill="#1b2230"/><line x1="56" y1="86" x2="342" y2="86" stroke="#1b2230" stroke-width="1.8"/><path d="M342 86 L334 82 L334 90 Z" fill="#1b2230"/><polyline points="'+pts.join(' ')+'" fill="none" stroke="#2563eb" stroke-width="2.8"/>'+xl+'<text x="0" y="0" transform="translate(18,86) rotate(-90)" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">uitwijking (m)</text><text x="300" y="182" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">tijd (s)</text></svg>';
  })(),
  // Radioactief verval N-t
  verval:(function(){
    var sy=function(N){return 150-N/800*120;}, sx=function(t){return 56+t/24*284;};
    var f=function(t){return 800*Math.pow(0.5,t/6);};
    var pts=[]; for(var t=0;t<=24.01;t+=0.5){ pts.push(sx(t).toFixed(1)+','+sy(f(t)).toFixed(1)); }
    var yl=[0,200,400,600,800].map(N=>'<line x1="56" y1="'+sy(N).toFixed(1)+'" x2="340" y2="'+sy(N).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(N)+3).toFixed(1)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="end">'+N+'</text>').join('');
    var xl=[0,6,12,18,24].map(t=>'<text x="'+sx(t).toFixed(1)+'" y="166" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+t+'</text>').join('');
    var half='<g stroke="#94a0b8" stroke-width="1" stroke-dasharray="4 4"><line x1="56" y1="'+sy(400).toFixed(1)+'" x2="'+sx(6).toFixed(1)+'" y2="'+sy(400).toFixed(1)+'"/><line x1="'+sx(6).toFixed(1)+'" y1="'+sy(400).toFixed(1)+'" x2="'+sx(6).toFixed(1)+'" y2="150"/></g>';
    return '<svg viewBox="0 0 360 194" role="img" aria-label="radioactief verval">'+yl+'<line x1="56" y1="14" x2="56" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M56 14 L52 24 L60 24 Z" fill="#1b2230"/><line x1="56" y1="150" x2="342" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M342 150 L334 146 L334 154 Z" fill="#1b2230"/>'+half+'<polyline points="'+pts.join(' ')+'" fill="none" stroke="#2e9e5b" stroke-width="2.8"/>'+xl+'<text x="0" y="0" transform="translate(18,84) rotate(-90)" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">aantal kernen (×10⁹)</text><text x="290" y="184" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">tijd (uur)</text></svg>';
  })(),
  // Foto-elektrisch effect: Ek,max tegen frequentie
  fotoelektrisch:(function(){
    var sy=function(E){return 150-E/6*120;}, sx=function(f){return 56+f/12*284;};
    var yl=[0,2,4,6].map(E=>'<line x1="56" y1="'+sy(E).toFixed(1)+'" x2="340" y2="'+sy(E).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(E)+3).toFixed(1)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="end">'+E+'</text>').join('');
    var xl=[0,3,6,9,12].map(f=>'<text x="'+sx(f).toFixed(1)+'" y="166" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+f+'</text>').join('');
    // lijn: Ek=0 bij f=6, stijgt tot Ek=4 bij f=12 (per 10^-19 J en 10^14 Hz)
    var line='<line x1="'+sx(6)+'" y1="'+sy(0)+'" x2="'+sx(12)+'" y2="'+sy(4)+'" stroke="#e8580c" stroke-width="2.8"/><line x1="'+sx(0)+'" y1="'+sy(0)+'" x2="'+sx(6)+'" y2="'+sy(0)+'" stroke="#e8580c" stroke-width="2.8" stroke-dasharray="5 4"/>';
    var pt='<circle cx="'+sx(6)+'" cy="'+sy(0)+'" r="3.4" fill="#1b2230"/><text x="'+(sx(6)+2)+'" y="'+(sy(0)-6)+'" font-family="sans-serif" font-size="8" fill="#4a5568">f&#8320;</text>';
    return '<svg viewBox="0 0 360 194" role="img" aria-label="foto-elektrisch effect">'+yl+'<line x1="56" y1="14" x2="56" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M56 14 L52 24 L60 24 Z" fill="#1b2230"/><line x1="56" y1="150" x2="342" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M342 150 L334 146 L334 154 Z" fill="#1b2230"/>'+line+pt+xl+'<text x="0" y="0" transform="translate(16,84) rotate(-90)" font-family="sans-serif" font-size="8" font-weight="800" fill="#1b2230" text-anchor="middle">E_kin (×10⁻¹⁹ J)</text><text x="250" y="184" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">frequentie (×10¹⁴ Hz)</text></svg>';
  })(),
};

SLAGIO_EXAMENS.vwo.na = {
  origineel: true,
  titel: 'Natuurkunde',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 150,
  max_punten: 29,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Optrekkende sprinter',
      context:'Afbeelding 1 is het (v,t)-diagram van een sprinter: hij versnelt eenparig en gaat daarna met constante snelheid verder.',
      afb:_VNAAFB.vt, afb_cap:'afbeelding 1: het (v,t)-diagram van de sprinter' },
    { nr:2, titel:'Blok op een helling',
      context:'Een blok van 2,0 kg ligt op een wrijvingsloze helling van 30° (afbeelding 2). Neem g = 9,81 N/kg.',
      afb:_VNAAFB.helling, afb_cap:'afbeelding 2: het blok op de helling' },
    { nr:3, titel:'Een speelgoedkatapult',
      context:'Een katapult schiet een balletje weg met een veer. Afbeelding 3 toont de kracht op de veer tegen de uitrekking. Het balletje heeft een massa van 20 gram.',
      afb:_VNAAFB.veer, afb_cap:'afbeelding 3: kracht op de veer tegen de uitrekking' },
    { nr:4, titel:'Een massa aan een veer',
      context:'Een blokje van 0,20 kg hangt aan een veer en voert een harmonische trilling uit. Afbeelding 4 toont de uitwijking tegen de tijd.',
      afb:_VNAAFB.trilling, afb_cap:'afbeelding 4: de uitwijking tegen de tijd' },
    { nr:5, titel:'Radioactief verval',
      context:'Afbeelding 5 toont het aantal nog niet-vervallen kernen van een radioactief preparaat tegen de tijd.',
      afb:_VNAAFB.verval, afb_cap:'afbeelding 5: aantal kernen tegen de tijd' },
    { nr:6, titel:'Licht maakt elektronen los',
      context:'Bij het foto-elektrisch effect maakt licht elektronen los uit een metaal. Afbeelding 6 toont de maximale kinetische energie van de vrijgemaakte elektronen tegen de frequentie van het licht. Gegeven: h = 6,63·10⁻³⁴ J·s.',
      afb:_VNAAFB.fotoelektrisch, afb_cap:'afbeelding 6: E_kin van de elektronen tegen de frequentie' },
  ],
  vragen: [
    // Opgave 1
    { nr:1, opgave:1, punten:2, type:'open', domein:'Beweging',
      vraag:'Bepaal met afbeelding 1 de versnelling van de sprinter tijdens het optrekken, en beschrijf hoe het bijbehorende (a,t)-diagram eruitziet.',
      antwoord:'In de eerste 6 s neemt de snelheid toe van 0 tot 24 m/s, dus a = Δv/Δt = 24 ÷ 6 = 4,0 m/s². Het (a,t)-diagram is van 0 tot 6 s een horizontale lijn op a = 4,0 m/s² (constante versnelling) en daarna, bij constante snelheid, een horizontale lijn op a = 0.',
      antwoord_rubric:'1 punt: a = 24/6 = 4,0 m/s². 1 punt: (a,t)-diagram = 4,0 m/s² tot 6 s, daarna 0.' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Beweging',
      vraag:'Bepaal de totale afgelegde afstand in de eerste 10 seconden met behulp van het oppervlak onder de grafiek.',
      antwoord:'De afstand is het oppervlak onder de (v,t)-lijn. Optrekken (0-6 s): driehoek ½ · 6 · 24 = 72 m. Constante snelheid (6-10 s): rechthoek 4 · 24 = 96 m. Totaal = 72 + 96 = 168 m.',
      antwoord_rubric:'1 punt: driehoek 72 m én rechthoek 96 m (of gelijkwaardige integratie). 1 punt: totaal 168 m.' },
    // Opgave 2
    { nr:3, opgave:2, punten:3, type:'open', domein:'Kracht',
      vraag:'Ontbind de zwaartekracht in een component langs de helling en loodrecht erop, en bereken de component die het blok langs de helling versnelt.',
      antwoord:'De zwaartekracht Fz = m·g = 2,0 · 9,81 = 19,6 N wijst recht naar beneden. Ontbonden ten opzichte van de helling: de component langs de helling is Fz·sin(30°) en de component loodrecht op de helling is Fz·cos(30°). De versnellende component langs de helling = Fz·sin(30°) = 19,6 · 0,50 = 9,8 N.',
      antwoord_rubric:'1 punt: Fz = m·g = 19,6 N. 1 punt: component langs de helling = Fz·sin(30°). 1 punt: = 9,8 N.' },
    { nr:4, opgave:2, punten:2, type:'open', domein:'Kracht',
      vraag:'Bereken met de tweede wet van Newton de versnelling van het blok langs de helling.',
      antwoord:'Op de wrijvingsloze helling is de resulterende kracht langs de helling gelijk aan de component van de zwaartekracht: Fres = 9,8 N. Met Fres = m·a volgt a = Fres/m = 9,8 ÷ 2,0 = 4,9 m/s². (Dit is g·sin30° = 9,81·0,50 = 4,9 m/s².)',
      antwoord_rubric:'1 punt: Fres = 9,8 N en a = Fres/m. 1 punt: a = 4,9 m/s².' },
    // Opgave 3
    { nr:5, opgave:3, punten:2, type:'open', domein:'Energie',
      vraag:'Bepaal met afbeelding 3 de veerconstante van de veer.',
      antwoord:'De grafiek is een rechte lijn door de oorsprong: F = C·u. Bij u = 0,16 m hoort F = 32 N (aflezen), dus C = F/u = 32 ÷ 0,16 = 2,0·10² N/m (200 N/m).',
      antwoord_rubric:'1 punt: een bijbehorend punt aflezen (32 N bij 0,16 m). 1 punt: C = F/u = 200 N/m.' },
    { nr:6, opgave:3, punten:3, type:'open', domein:'Energie',
      vraag:'De veer wordt 0,16 m uitgerekt. Bepaal de opgeslagen veerenergie (het oppervlak onder de grafiek) en bereken daarmee de snelheid waarmee het balletje van 20 g wordt weggeschoten. Verwaarloos wrijving.',
      antwoord:'Veerenergie = oppervlak onder de F-u-lijn = ½ · u · F = ½ · 0,16 · 32 = 2,56 J (of ½·C·u² = ½·200·0,16² = 2,56 J). Bij wegschieten wordt alle veerenergie omgezet in kinetische energie: Ev = ½·m·v². Dus 2,56 = ½ · 0,020 · v² → v² = 256 → v = 16 m/s.',
      antwoord_rubric:'1 punt: veerenergie = ½·u·F = 2,56 J (of ½C u²). 1 punt: energiebehoud Ev = ½m v² met m = 0,020 kg. 1 punt: v = 16 m/s.' },
    // Opgave 4
    { nr:7, opgave:4, punten:2, type:'open', domein:'Trilling',
      vraag:'Lees met afbeelding 4 de amplitude en de trillingstijd af, en bereken de frequentie.',
      antwoord:'De amplitude is de maximale uitwijking: A = 0,05 m. De trillingstijd (één volledige trilling) is T = 0,40 s (aflezen). De frequentie f = 1/T = 1 ÷ 0,40 = 2,5 Hz.',
      antwoord_rubric:'1 punt: A = 0,05 m en T = 0,40 s afgelezen. 1 punt: f = 1/T = 2,5 Hz.' },
    { nr:8, opgave:4, punten:3, type:'open', domein:'Trilling',
      vraag:'Voor een massa-veersysteem geldt T = 2π·√(m/C). Bereken met de afgelezen trillingstijd en de massa (0,20 kg) de veerconstante C.',
      antwoord:'T = 2π·√(m/C), dus √(m/C) = T/(2π) = 0,40 ÷ (2π) = 0,0637. Kwadrateren: m/C = 0,0637² = 4,05·10⁻³. Dan C = m ÷ 4,05·10⁻³ = 0,20 ÷ 4,05·10⁻³ = 49 N/m (≈ 50 N/m).',
      antwoord_rubric:'1 punt: √(m/C) = T/2π isoleren. 1 punt: m/C = (T/2π)² = 4,05·10⁻³. 1 punt: C = 0,20/4,05·10⁻³ ≈ 49 N/m.' },
    // Opgave 5
    { nr:9, opgave:5, punten:2, type:'open', domein:'Kernfysica',
      vraag:'Bepaal met afbeelding 5 de halveringstijd en bereken hoeveel kernen er na 24 uur nog over zijn.',
      antwoord:'Het aantal kernen daalt van 800 naar 400 (de helft) in 6 uur (aflezen via de stippellijnen), dus de halveringstijd is 6 uur. 24 uur is 4 halveringstijden: 800 → 400 → 200 → 100 → 50. Na 24 uur zijn er dus nog 50·10⁹ kernen over.',
      antwoord_rubric:'1 punt: halveringstijd = 6 uur (halvering van 800 naar 400). 1 punt: 24 uur = 4 halveringstijden → 50·10⁹ kernen.' },
    { nr:10, opgave:5, punten:3, type:'open', domein:'Kernfysica',
      vraag:'Bij het verval van één kern wordt een massadefect van 8,0·10⁻³⁰ kg omgezet in energie. Bereken met E = m·c² de vrijgekomen energie per kern (c = 3,0·10⁸ m/s) en leg uit waarom hierbij de wet van behoud van massa en energie samen geldt.',
      antwoord:'E = m·c² = 8,0·10⁻³⁰ · (3,0·10⁸)² = 8,0·10⁻³⁰ · 9,0·10¹⁶ = 7,2·10⁻¹³ J per kern. Bij een kernreactie verdwijnt een klein beetje massa (het massadefect) en komt er een equivalente hoeveelheid energie voor in de plaats; massa en energie zijn volgens E = mc² omzetbaar. Massa en energie zijn dus samen behouden (de "verdwenen" massa is als energie teruggekomen).',
      antwoord_rubric:'1 punt: E = m·c² met de juiste waarden. 1 punt: E = 7,2·10⁻¹³ J. 1 punt: uitleg dat massa in een equivalente hoeveelheid energie is omgezet (behoud van massa én energie samen).' },
    // Opgave 6
    { nr:11, opgave:6, punten:3, type:'open', domein:'Quantum',
      vraag:'Voor het foto-elektrisch effect geldt E_kin = h·f - W. Bepaal met twee punten van de lijn in afbeelding 6 de helling en laat zien dat die overeenkomt met de constante van Planck h.',
      antwoord:'De lijn gaat door (f = 6·10¹⁴ Hz; E_kin = 0) en door (f = 12·10¹⁴ Hz; E_kin = 4·10⁻¹⁹ J). Helling = ΔE_kin/Δf = (4·10⁻¹⁹ - 0) ÷ ((12 - 6)·10¹⁴) = 4·10⁻¹⁹ ÷ 6·10¹⁴ = 6,7·10⁻³⁴ J·s. Dat komt overeen met de constante van Planck h ≈ 6,63·10⁻³⁴ J·s: in E_kin = h·f - W is h namelijk de richtingscoëfficiënt.',
      antwoord_rubric:'1 punt: twee punten aflezen (bv. (6·10¹⁴, 0) en (12·10¹⁴, 4·10⁻¹⁹)). 1 punt: helling = ΔE/Δf ≈ 6,7·10⁻³⁴. 1 punt: dit is h (de richtingscoëfficiënt in E_kin = h·f - W).' },
    { nr:12, opgave:6, punten:2, type:'open', domein:'Quantum',
      vraag:'Bepaal de uittree-energie (uittree-arbeid W) van dit metaal, en leg uit waarom er onder de grensfrequentie f₀ helemaal geen elektronen vrijkomen.',
      antwoord:'Bij de grensfrequentie f₀ = 6·10¹⁴ Hz is E_kin = 0, dus alle fotonenergie gaat op aan het losmaken: W = h·f₀ = 6,63·10⁻³⁴ · 6·10¹⁴ = 4,0·10⁻¹⁹ J. Onder f₀ heeft één foton minder energie dan W; het kan een elektron dan niet losmaken. Omdat een elektron de energie van maar één foton opneemt (niet van meerdere tegelijk), komen er onder f₀ helemaal geen elektronen vrij, hoe fel het licht ook is.',
      antwoord_rubric:'1 punt: W = h·f₀ = 6,63·10⁻³⁴ · 6·10¹⁴ = 4,0·10⁻¹⁹ J. 1 punt: onder f₀ heeft een foton te weinig energie (< W) en één elektron neemt maar één foton op → geen elektronen.' },
  ],
};
