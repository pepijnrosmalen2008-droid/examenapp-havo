// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-wb.js  ORIGINEEL Slagio-proefexamen (vwo wiskunde B).
// Eigen contexten, vragen en figuren. Geen reproductie van een CvTE-examen.
// VWO-CE-niveau: differentiaalrekening (raaklijn, extremen), integreren
// (oppervlakte tussen krommen), goniometrie en analytische meetkunde.
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

var _VWBAFB = {
  // Derdegraadsfunctie met raaklijn in x=0 en toppen
  kromme:(function(){
    var f=function(x){return x*x*x-6*x*x+9*x+2;};
    var sx=function(x){return 52+x/5*284;}, sy=function(y){return 156-y/8*140;};
    var yl=[0,2,4,6,8].map(y=>'<line x1="52" y1="'+sy(y).toFixed(1)+'" x2="336" y2="'+sy(y).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="47" y="'+(sy(y)+3).toFixed(1)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="end">'+y+'</text>').join('');
    var xl=[0,1,2,3,4,5].map(x=>'<text x="'+sx(x).toFixed(1)+'" y="170" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+x+'</text>').join('');
    var pts=[]; for(var x=0;x<=5.001;x+=0.1){ pts.push(sx(x).toFixed(1)+','+sy(f(x)).toFixed(1)); }
    // raaklijn in x=0: y=9x+2, teken tot x=0.6
    var tan='<line x1="'+sx(0)+'" y1="'+sy(2)+'" x2="'+sx(0.62)+'" y2="'+sy(9*0.62+2)+'" stroke="#e8580c" stroke-width="2.2"/><text x="'+sx(0.72)+'" y="'+(sy(7.2))+'" font-family="sans-serif" font-size="8" font-weight="700" fill="#e8580c">raaklijn</text>';
    var tops='<circle cx="'+sx(1)+'" cy="'+sy(6)+'" r="3" fill="#1b2230"/><text x="'+sx(1)+'" y="'+(sy(6)-6)+'" font-family="sans-serif" font-size="7.5" fill="#1b2230" text-anchor="middle">(1,6)</text>'+
      '<circle cx="'+sx(3)+'" cy="'+sy(2)+'" r="3" fill="#1b2230"/><text x="'+(sx(3)+4)+'" y="'+(sy(2)+11)+'" font-family="sans-serif" font-size="7.5" fill="#1b2230">(3,2)</text>';
    return '<svg viewBox="0 0 360 192" role="img" aria-label="grafiek van een derdegraadsfunctie met raaklijn">'+yl+'<line x1="52" y1="14" x2="52" y2="156" stroke="#1b2230" stroke-width="1.8"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/><line x1="52" y1="156" x2="338" y2="156" stroke="#1b2230" stroke-width="1.8"/><path d="M338 156 L330 152 L330 160 Z" fill="#1b2230"/><polyline points="'+pts.join(' ')+'" fill="none" stroke="#2563eb" stroke-width="2.8"/>'+tan+tops+'<text x="0" y="0" transform="translate(16,88) rotate(-90)" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">y</text><text x="330" y="186" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">x</text></svg>';
  })(),
  // Oppervlakte tussen y=2x en y=x^2
  opp:(function(){
    var f=function(x){return x*x;}, g=function(x){return 2*x;};
    var sx=function(x){return 60+x/3*260;}, sy=function(y){return 150-y/9*130;};
    var yl=[0,3,6,9].map(y=>'<line x1="60" y1="'+sy(y).toFixed(1)+'" x2="330" y2="'+sy(y).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="55" y="'+(sy(y)+3).toFixed(1)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="end">'+y+'</text>').join('');
    var xl=[0,1,2,3].map(x=>'<text x="'+sx(x).toFixed(1)+'" y="164" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+x+'</text>').join('');
    // shade between 0..2
    var sh=['<path d="M'+sx(0)+' '+sy(0)];
    for(var x=0;x<=2.001;x+=0.1){ sh.push('L'+sx(x).toFixed(1)+' '+sy(g(x)).toFixed(1)); }
    for(var x2=2;x2>=0;x2-=0.1){ sh.push('L'+sx(x2).toFixed(1)+' '+sy(f(x2)).toFixed(1)); }
    sh.push('Z" fill="rgba(46,158,91,0.20)" stroke="none"/>');
    var par=[],lin=[]; for(var x=0;x<=3.001;x+=0.1){ par.push(sx(x).toFixed(1)+','+sy(f(x)).toFixed(1)); }
    var lp='<line x1="'+sx(0)+'" y1="'+sy(0)+'" x2="'+sx(3)+'" y2="'+sy(6)+'" stroke="#e8580c" stroke-width="2.6"/><text x="'+sx(2.6)+'" y="'+(sy(4.4))+'" font-family="sans-serif" font-size="8" font-weight="700" fill="#e8580c">y=2x</text>';
    var pp='<polyline points="'+par.join(' ')+'" fill="none" stroke="#2563eb" stroke-width="2.6"/><text x="'+sx(2.55)+'" y="'+(sy(8.3))+'" font-family="sans-serif" font-size="8" font-weight="700" fill="#2563eb">y=x²</text>';
    var isc='<circle cx="'+sx(2)+'" cy="'+sy(4)+'" r="3" fill="#1b2230"/><text x="'+(sx(2)+4)+'" y="'+(sy(4)+12)+'" font-family="sans-serif" font-size="7.5" fill="#1b2230">(2,4)</text>';
    return '<svg viewBox="0 0 360 186" role="img" aria-label="oppervlakte tussen een lijn en een parabool">'+yl+sh.join('')+'<line x1="60" y1="14" x2="60" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M60 14 L56 24 L64 24 Z" fill="#1b2230"/><line x1="60" y1="150" x2="332" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M332 150 L324 146 L324 154 Z" fill="#1b2230"/>'+pp+lp+isc+xl+'<text x="0" y="0" transform="translate(18,84) rotate(-90)" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">y</text><text x="326" y="180" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">x</text></svg>';
  })(),
  // Goniometrische functie y=3+2sin(pi/6 x)
  gonio:(function(){
    var f=function(x){return 3+2*Math.sin(Math.PI/6*x);};
    var sx=function(x){return 52+x/12*284;}, sy=function(y){return 150-y/6*128;};
    var yl=[0,1,2,3,4,5].map(y=>'<line x1="52" y1="'+sy(y).toFixed(1)+'" x2="336" y2="'+sy(y).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="47" y="'+(sy(y)+3).toFixed(1)+'" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="end">'+y+'</text>').join('');
    var xl=[0,2,4,6,8,10,12].map(x=>'<text x="'+sx(x).toFixed(1)+'" y="164" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">'+x+'</text>').join('');
    var pts=[]; for(var x=0;x<=12.001;x+=0.2){ pts.push(sx(x).toFixed(1)+','+sy(f(x)).toFixed(1)); }
    var mid='<line x1="52" y1="'+sy(3)+'" x2="336" y2="'+sy(3)+'" stroke="#94a0b8" stroke-width="1.2" stroke-dasharray="5 4"/><text x="334" y="'+(sy(3)-4)+'" font-family="sans-serif" font-size="7.5" fill="#7a8699" text-anchor="end">evenwicht y=3</text>';
    var amp='<line x1="'+sx(3)+'" y1="'+sy(3)+'" x2="'+sx(3)+'" y2="'+sy(5)+'" stroke="#e8580c" stroke-width="1.6"/><text x="'+(sx(3)+3)+'" y="'+(sy(4))+'" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#e8580c">amplitude 2</text>';
    return '<svg viewBox="0 0 360 186" role="img" aria-label="goniometrische functie">'+yl+mid+'<line x1="52" y1="14" x2="52" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/><line x1="52" y1="150" x2="338" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M338 150 L330 146 L330 154 Z" fill="#1b2230"/><polyline points="'+pts.join(' ')+'" fill="none" stroke="#2563eb" stroke-width="2.8"/>'+amp+xl+'<text x="0" y="0" transform="translate(16,84) rotate(-90)" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">y</text><text x="326" y="180" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">x</text></svg>';
  })(),
  // Cirkel met raaklijn in (3,4)
  cirkel:(function(){
    var cx=180, cy=100, R=68; // straal 5 op schaal
    var sc=R/5; // 1 eenheid = sc px
    var P=[cx+3*sc, cy-4*sc]; // (3,4)
    // raaklijn 3x+4y=25 -> richting loodrecht op OP; OP richting (3,-4) op scherm; raaklijn richting (4,3)
    var dx=4, dy=3, L=60;
    var A=[P[0]-dx/5*L, P[1]+dy/5*L], B=[P[0]+dx/5*L, P[1]-dy/5*L];
    var axes='<line x1="'+(cx-90)+'" y1="'+cy+'" x2="'+(cx+92)+'" y2="'+cy+'" stroke="#c9d2e0" stroke-width="1.2"/><path d="M'+(cx+92)+' '+cy+' L'+(cx+84)+' '+(cy-3)+' L'+(cx+84)+' '+(cy+3)+' Z" fill="#c9d2e0"/>'+
      '<line x1="'+cx+'" y1="'+(cy+90)+'" x2="'+cx+'" y2="'+(cy-92)+'" stroke="#c9d2e0" stroke-width="1.2"/><path d="M'+cx+' '+(cy-92)+' L'+(cx-3)+' '+(cy-84)+' L'+(cx+3)+' '+(cy-84)+' Z" fill="#c9d2e0"/>'+
      '<text x="'+(cx+88)+'" y="'+(cy+13)+'" font-family="sans-serif" font-size="8" fill="#7a8699">x</text><text x="'+(cx+6)+'" y="'+(cy-84)+'" font-family="sans-serif" font-size="8" fill="#7a8699">y</text>';
    var circle='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="rgba(37,99,235,0.06)" stroke="#2563eb" stroke-width="2.4"/>';
    var rad='<line x1="'+cx+'" y1="'+cy+'" x2="'+P[0].toFixed(1)+'" y2="'+P[1].toFixed(1)+'" stroke="#2e9e5b" stroke-width="1.8"/><text x="'+((cx+P[0])/2-8)+'" y="'+((cy+P[1])/2-3)+'" font-family="sans-serif" font-size="8" font-weight="700" fill="#1b7a41">r=5</text>';
    var tan='<line x1="'+A[0].toFixed(1)+'" y1="'+A[1].toFixed(1)+'" x2="'+B[0].toFixed(1)+'" y2="'+B[1].toFixed(1)+'" stroke="#e8580c" stroke-width="2.4"/>';
    var pt='<circle cx="'+P[0].toFixed(1)+'" cy="'+P[1].toFixed(1)+'" r="3.2" fill="#1b2230"/><text x="'+(P[0]+5).toFixed(1)+'" y="'+(P[1]-5).toFixed(1)+'" font-family="sans-serif" font-size="8" font-weight="700" fill="#1b2230">P(3,4)</text>';
    var oc='<text x="'+(cx-5)+'" y="'+(cy+12)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="end">O</text>';
    var rightangle='<rect x="'+(P[0]-5).toFixed(1)+'" y="'+(P[1]-1).toFixed(1)+'" width="6" height="6" fill="none" stroke="#7a8699" stroke-width="0.8" transform="rotate(37 '+P[0].toFixed(1)+' '+P[1].toFixed(1)+')"/>';
    return '<svg viewBox="0 0 360 200" role="img" aria-label="cirkel met raaklijn in punt P">'+axes+circle+rad+tan+rightangle+pt+oc+'<text x="180" y="192" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">cirkel x² + y² = 25 met de raaklijn in P(3,4)</text></svg>';
  })(),
};

SLAGIO_EXAMENS.vwo.wb = {
  origineel: true,
  titel: 'Wiskunde B',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 180,
  max_punten: 21,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Een derdegraadsfunctie',
      context:'Gegeven is de functie f(x) = x^3 - 6x^2 + 9x + 2. Afbeelding 1 toont de grafiek met de raaklijn in het punt waar x = 0.',
      afb:_VWBAFB.kromme, afb_cap:'afbeelding 1: de grafiek van f met de raaklijn in x = 0' },
    { nr:2, titel:'Oppervlakte tussen twee krommen',
      context:'De lijn y = 2x en de parabool y = x^2 snijden elkaar. Afbeelding 2 toont het ingesloten gebied (gearceerd).',
      afb:_VWBAFB.opp, afb_cap:'afbeelding 2: het gebied tussen y = 2x en y = x^2' },
    { nr:3, titel:'Een getijdenmodel',
      context:'De waterhoogte (in meter) bij een steiger wordt benaderd door g(x) = 3 + 2·sin((pi/6)·x), met x de tijd in uren. Afbeelding 3 toont de grafiek.',
      afb:_VWBAFB.gonio, afb_cap:'afbeelding 3: de waterhoogte g(x)' },
    { nr:4, titel:'Raaklijn aan een cirkel',
      context:'Gegeven is de cirkel met vergelijking x^2 + y^2 = 25 en het punt P(3, 4) op die cirkel. Afbeelding 4 toont de cirkel met de raaklijn in P.',
      afb:_VWBAFB.cirkel, afb_cap:'afbeelding 4: de cirkel x^2 + y^2 = 25 met de raaklijn in P(3,4)' },
  ],
  vragen: [
    // Opgave 1
    { nr:1, opgave:1, punten:3, type:'open', domein:'Differentiaalrekening',
      vraag:'Bepaal met de afgeleide de x-coordinaten van de toppen van f, en bepaal welke top een maximum en welke een minimum is.',
      antwoord:'f(x) = x^3 - 6x^2 + 9x + 2, dus f\'(x) = 3x^2 - 12x + 9 = 3(x^2 - 4x + 3) = 3(x - 1)(x - 3). De toppen liggen waar f\'(x) = 0: x = 1 en x = 3. Tekenverloop van f\'(x) = 3(x-1)(x-3): voor x < 1 positief, tussen 1 en 3 negatief, voor x > 3 positief. Bij x = 1 gaat f\' van + naar -, dus daar is een maximum (f(1) = 1 - 6 + 9 + 2 = 6). Bij x = 3 gaat f\' van - naar +, dus daar is een minimum (f(3) = 27 - 54 + 27 + 2 = 2).',
      antwoord_rubric:'1 punt: f\'(x) = 3x^2 - 12x + 9. 1 punt: f\'(x) = 0 geeft x = 1 en x = 3 (ontbinden). 1 punt: x=1 maximum, x=3 minimum (met tekenverloop of f-waarden).' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Differentiaalrekening',
      vraag:'Stel een vergelijking op van de raaklijn aan de grafiek van f in het punt waar x = 0 (de oranje lijn in afbeelding 1).',
      antwoord:'De raaklijn heeft de vorm y = f\'(0)·x + f(0). Bereken f(0) = 2 (het snijpunt met de y-as) en f\'(0) = 3·0 - 12·0 + 9 = 9 (de helling). De raaklijn is dus y = 9x + 2.',
      antwoord_rubric:'1 punt: f(0) = 2 en f\'(0) = 9. 1 punt: raaklijn y = 9x + 2.' },
    // Opgave 2
    { nr:3, opgave:2, punten:2, type:'open', domein:'Integraalrekening',
      vraag:'Bereken algebraisch de x-coordinaten van de snijpunten van y = 2x en y = x^2.',
      antwoord:'Gelijkstellen: x^2 = 2x, dus x^2 - 2x = 0, oftewel x(x - 2) = 0. Hieruit volgt x = 0 en x = 2. De snijpunten zijn (0, 0) en (2, 4).',
      antwoord_rubric:'1 punt: x^2 = 2x -> x(x-2) = 0. 1 punt: x = 0 en x = 2 (snijpunten (0,0) en (2,4)).' },
    { nr:4, opgave:2, punten:3, type:'open', domein:'Integraalrekening',
      vraag:'Bereken met een integraal de oppervlakte van het gearceerde gebied tussen de twee krommen.',
      antwoord:'Op het interval [0, 2] ligt de lijn y = 2x boven de parabool y = x^2. De oppervlakte is de integraal van het verschil: A = integraal van 0 tot 2 van (2x - x^2) dx. Een primitieve is x^2 - (1/3)x^3. Invullen: [x^2 - (1/3)x^3] van 0 tot 2 = (4 - 8/3) - 0 = 12/3 - 8/3 = 4/3. De oppervlakte is dus 4/3 (ongeveer 1,33).',
      antwoord_rubric:'1 punt: A = integraal 0..2 van (2x - x^2) dx (bovenste min onderste). 1 punt: primitieve x^2 - (1/3)x^3. 1 punt: A = 4/3.' },
    // Opgave 3
    { nr:5, opgave:3, punten:2, type:'open', domein:'Goniometrie',
      vraag:'Bepaal met de formule g(x) = 3 + 2·sin((pi/6)·x) de periode, de maximale en de minimale waterhoogte.',
      antwoord:'De periode van sin(b·x) is 2pi/b. Hier is b = pi/6, dus de periode = 2pi / (pi/6) = 12 uur. De evenwichtsstand is 3 en de amplitude is 2, dus de maximale hoogte is 3 + 2 = 5 meter en de minimale hoogte is 3 - 2 = 1 meter.',
      antwoord_rubric:'1 punt: periode = 2pi/(pi/6) = 12 uur. 1 punt: maximum 5 m en minimum 1 m (evenwicht 3, amplitude 2).' },
    { nr:6, opgave:3, punten:3, type:'open', domein:'Goniometrie',
      vraag:'Los algebraisch op voor welke x in het interval [0, 12] de waterhoogte gelijk is aan 4 meter.',
      antwoord:'Stel g(x) = 4: 3 + 2·sin((pi/6)x) = 4, dus 2·sin((pi/6)x) = 1 en sin((pi/6)x) = 1/2. De basisoplossingen van sin(t) = 1/2 zijn t = pi/6 en t = 5pi/6 (plus veelvouden van 2pi). Hier is t = (pi/6)x, dus: (pi/6)x = pi/6 geeft x = 1, en (pi/6)x = 5pi/6 geeft x = 5. Binnen [0, 12] zijn de oplossingen x = 1 en x = 5 (uur).',
      antwoord_rubric:'1 punt: sin((pi/6)x) = 1/2 herleiden. 1 punt: basishoeken t = pi/6 en t = 5pi/6. 1 punt: x = 1 en x = 5 binnen [0,12].' },
    // Opgave 4
    { nr:7, opgave:4, punten:3, type:'open', domein:'Meetkunde',
      vraag:'Stel een vergelijking op van de raaklijn aan de cirkel x^2 + y^2 = 25 in het punt P(3, 4). Gebruik dat de raaklijn loodrecht staat op de straal OP.',
      antwoord:'De straal loopt van O(0,0) naar P(3,4) en heeft richtingscoefficient 4/3. De raaklijn staat loodrecht op OP, dus heeft richtingscoefficient -1/(4/3) = -3/4. De raaklijn gaat door P(3,4): y - 4 = -3/4·(x - 3). Uitwerken: y = -3/4·x + 9/4 + 4 = -3/4·x + 25/4. (Of in de vorm 3x + 4y = 25.)',
      antwoord_rubric:'1 punt: rc van OP = 4/3. 1 punt: rc raaklijn = -3/4 (loodrecht). 1 punt: y = -3/4·x + 25/4 (of 3x + 4y = 25).' },
    { nr:8, opgave:4, punten:3, type:'open', domein:'Meetkunde',
      vraag:'Bepaal de coordinaten van de snijpunten van deze raaklijn met de x-as en de y-as, en bereken de oppervlakte van de driehoek die de raaklijn met de assen insluit.',
      antwoord:'Gebruik 3x + 4y = 25. Snijpunt met de x-as (y = 0): 3x = 25, dus x = 25/3, het punt (25/3, 0). Snijpunt met de y-as (x = 0): 4y = 25, dus y = 25/4, het punt (0, 25/4). De driehoek met de assen heeft rechthoekszijden 25/3 en 25/4. Oppervlakte = 1/2 · (25/3) · (25/4) = 625/24 = ongeveer 26,04.',
      antwoord_rubric:'1 punt: snijpunt x-as (25/3, 0). 1 punt: snijpunt y-as (0, 25/4). 1 punt: oppervlakte = 1/2·(25/3)·(25/4) = 625/24 (ongeveer 26,0).' },
  ],
};
