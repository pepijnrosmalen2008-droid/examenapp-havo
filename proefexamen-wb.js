// ═══════════════════════════════════════════════════════════════════════
// proefexamen-wb.js, ORIGINEEL Slagio-proefexamen in examenstijl (havo wb).
// Eigen contexten, vragen en figuren. Géén reproductie van een CvTE-examen.
// CE-niveau wiskunde B: kwadratische functies, differentiëren & raaklijnen,
// extremen, goniometrie, sinusoïden en gelijkvormigheid. Rekenwerk met
// tussenstappen; meervoudige nakijkrubric per vraag. Figuren in hoge kwaliteit.
//   opgaven[] = {nr,titel,context,afb,afb_cap}
//   vragen[]  = {nr,opgave,punten,type,vraag,antwoord,antwoord_rubric,domein}
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.havo = SLAGIO_EXAMENS.havo || {};

// Assenkruis door de oorsprong met pijlpunten en ticklabels
function _wbGrid(sx, sy, xr, yr){
  var oy=sy(0), ox=sx(0);
  var g='';
  g+='<g stroke="#eef1f5" stroke-width="1">';
  for(var x=xr[0];x<=xr[1];x++){ g+='<line x1="'+sx(x).toFixed(1)+'" y1="24" x2="'+sx(x).toFixed(1)+'" y2="180"/>'; }
  for(var y=yr[0];y<=yr[1];y++){ g+='<line x1="46" y1="'+sy(y).toFixed(1)+'" x2="344" y2="'+sy(y).toFixed(1)+'"/>'; }
  g+='</g>';
  g+='<line x1="46" y1="'+oy.toFixed(1)+'" x2="346" y2="'+oy.toFixed(1)+'" stroke="#1b2230" stroke-width="1.8"/><path d="M346 '+oy.toFixed(1)+' L338 '+(oy-4).toFixed(1)+' L338 '+(oy+4).toFixed(1)+' Z" fill="#1b2230"/>';
  g+='<line x1="'+ox.toFixed(1)+'" y1="184" x2="'+ox.toFixed(1)+'" y2="20" stroke="#1b2230" stroke-width="1.8"/><path d="M'+ox.toFixed(1)+' 20 L'+(ox-4).toFixed(1)+' 28 L'+(ox+4).toFixed(1)+' 28 Z" fill="#1b2230"/>';
  return g;
}

var _WBAFB = {
  // Parabool f(x)=x^2-4x+3 met nulpunten en top
  parabool:(function(){
    var sx=function(x){return 106+x*40;}, sy=function(y){return 150-y*15;};
    var f=function(x){return x*x-4*x+3;};
    var pts=[]; for(var x=-1;x<=5.01;x+=0.25){ pts.push(sx(x).toFixed(1)+','+sy(f(x)).toFixed(1)); }
    var curve='<polyline points="'+pts.join(' ')+'" fill="none" stroke="#2563eb" stroke-width="3"/>';
    var marks='<circle cx="'+sx(1)+'" cy="'+sy(0)+'" r="3.4" fill="#e8580c"/><circle cx="'+sx(3)+'" cy="'+sy(0)+'" r="3.4" fill="#e8580c"/><circle cx="'+sx(2)+'" cy="'+sy(-1)+'" r="3.4" fill="#2e9e5b"/>';
    var lbl='<g font-family="sans-serif" font-size="9" fill="#4a5568"><text x="'+sx(1)+'" y="'+(sy(0)+14)+'" text-anchor="middle">1</text><text x="'+sx(3)+'" y="'+(sy(0)+14)+'" text-anchor="middle">3</text><text x="'+(sx(2)+8)+'" y="'+(sy(-1)+4)+'">top</text></g>';
    return '<svg viewBox="0 0 360 196" role="img" aria-label="parabool f(x)=x^2-4x+3">'+_wbGrid(sx,sy,[-1,5],[-1,5])+curve+marks+lbl+'<text x="330" y="'+(sy(0)-6)+'" font-family="sans-serif" font-size="10" font-weight="700" fill="#1b2230">x</text><text x="'+(sx(0)+8)+'" y="30" font-family="sans-serif" font-size="10" font-weight="700" fill="#1b2230">y</text></svg>';
  })(),
  // Derdegraadskromme met raaklijn in x=2
  raaklijn:(function(){
    var sx=function(x){return 70+x*64;}, sy=function(y){return 150-y*24;};
    var f=function(x){return x*x*x-6*x*x+9*x;};
    var pts=[]; for(var x=0;x<=4.01;x+=0.15){ pts.push(sx(x).toFixed(1)+','+sy(f(x)).toFixed(1)); }
    var curve='<polyline points="'+pts.join(' ')+'" fill="none" stroke="#2563eb" stroke-width="3"/>';
    // raaklijn y = -3x + 8, teken van x=0.7 tot 3.3
    var t='<line x1="'+sx(0.7)+'" y1="'+sy(-3*0.7+8)+'" x2="'+sx(3.3)+'" y2="'+sy(-3*3.3+8)+'" stroke="#e8580c" stroke-width="2.2" stroke-dasharray="6 4"/>';
    var pt='<circle cx="'+sx(2)+'" cy="'+sy(2)+'" r="3.6" fill="#1b2230"/><text x="'+(sx(2)+6)+'" y="'+(sy(2)-6)+'" font-family="sans-serif" font-size="9" fill="#4a5568">(2, 2)</text>';
    var xt='<g font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">'+[1,2,3].map(x=>'<text x="'+sx(x)+'" y="'+(sy(0)+13)+'">'+x+'</text>').join('')+'</g>';
    return '<svg viewBox="0 0 360 196" role="img" aria-label="kromme met raaklijn in x=2">'+_wbGrid(sx,sy,[0,4],[0,4])+curve+t+pt+xt+'<text x="332" y="'+(sy(0)-6)+'" font-family="sans-serif" font-size="10" font-weight="700" fill="#1b2230">x</text></svg>';
  })(),
  // Rechthoekige driehoek met hoek 35°
  driehoek:`<svg viewBox="0 0 360 180" role="img" aria-label="rechthoekige driehoek"><polygon points="60,150 300,150 60,40" fill="#eef4ff" stroke="#1b2230" stroke-width="1.8"/><rect x="60" y="132" width="18" height="18" fill="none" stroke="#1b2230" stroke-width="1.3"/><path d="M270 150 A30 30 0 0 0 264 132" fill="none" stroke="#e8580c" stroke-width="1.6"/><text x="252" y="143" font-family="sans-serif" font-size="11" font-weight="700" fill="#e8580c">35&#176;</text><text x="180" y="168" font-family="sans-serif" font-size="11" fill="#1b2230" text-anchor="middle">12 cm</text><text x="40" y="98" font-family="sans-serif" font-size="11" fill="#1b2230" text-anchor="middle">?</text><g font-family="sans-serif" font-size="10" fill="#4a5568"><text x="54" y="36">A</text><text x="304" y="154">B</text><text x="54" y="164">C</text></g></svg>`,
  // Sinusoïde f(x)=3+2sin(...) met evenwichtslijn en amplitude
  sinus:(function(){
    var sx=function(x){return 56+x*68;}, sy=function(y){return 150-y*22;}; // x in perioden, y 0..6
    var f=function(x){return 3+2*Math.sin(2*Math.PI/4*x);};
    var pts=[]; for(var x=0;x<=4.01;x+=0.1){ pts.push(sx(x).toFixed(1)+','+sy(f(x)).toFixed(1)); }
    var curve='<polyline points="'+pts.join(' ')+'" fill="none" stroke="#2563eb" stroke-width="3"/>';
    var mid='<line x1="56" y1="'+sy(3)+'" x2="340" y2="'+sy(3)+'" stroke="#8a94a8" stroke-width="1.2" stroke-dasharray="5 4"/><text x="344" y="'+(sy(3)+3)+'" font-family="sans-serif" font-size="9" fill="#8a94a8">3</text>';
    var yl=[0,1,2,3,4,5,6].map(v=>'<line x1="52" y1="'+sy(v)+'" x2="56" y2="'+sy(v)+'" stroke="#1b2230" stroke-width="1"/><text x="48" y="'+(sy(v)+3)+'" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="end">'+v+'</text>').join('');
    var amp='<g stroke="#2e9e5b" stroke-width="1.4"><line x1="'+sx(1)+'" y1="'+sy(3)+'" x2="'+sx(1)+'" y2="'+sy(5)+'"/><path d="M'+(sx(1)-4)+' '+(sy(5)+7)+' L'+sx(1)+' '+sy(5)+' L'+(sx(1)+4)+' '+(sy(5)+7)+'"/></g><text x="'+(sx(1)+6)+'" y="'+(sy(4)+3)+'" font-family="sans-serif" font-size="9" font-weight="700" fill="#2e9e5b">amplitude</text>';
    return '<svg viewBox="0 0 360 196" role="img" aria-label="sinusoide met evenwichtslijn en amplitude"><line x1="56" y1="14" x2="56" y2="182" stroke="#1b2230" stroke-width="1.8"/><path d="M56 14 L52 24 L60 24 Z" fill="#1b2230"/><line x1="52" y1="'+sy(0)+'" x2="346" y2="'+sy(0)+'" stroke="#1b2230" stroke-width="1.8"/><path d="M346 '+sy(0)+' L338 '+(sy(0)-4)+' L338 '+(sy(0)+4)+' Z" fill="#1b2230"/>'+yl+mid+curve+amp+'<g font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="middle">'+[1,2,3,4].map(x=>'<text x="'+sx(x)+'" y="'+(sy(0)+13)+'">'+x+'</text>').join('')+'</g><text x="338" y="'+(sy(0)-6)+'" font-family="sans-serif" font-size="10" font-weight="700" fill="#1b2230">x</text></svg>';
  })(),
  // Gelijkvormige driehoeken (lijn evenwijdig aan de basis)
  gelijkvormig:`<svg viewBox="0 0 360 184" role="img" aria-label="gelijkvormige driehoeken"><polygon points="60,160 300,160 180,30" fill="#eef4ff" stroke="#1b2230" stroke-width="1.8"/><line x1="120" y1="95" x2="240" y2="95" stroke="#e8580c" stroke-width="2" stroke-dasharray="6 4"/><g font-family="sans-serif" font-size="10.5" fill="#1b2230"><text x="180" y="24" text-anchor="middle">T</text><text x="50" y="164">A</text><text x="306" y="164">B</text><text x="108" y="98" text-anchor="end" fill="#e8580c">D</text><text x="248" y="98" fill="#e8580c">E</text></g><g font-family="sans-serif" font-size="10" fill="#4a5568"><text x="150" y="65" text-anchor="middle">TD = 6</text><text x="120" y="135" text-anchor="middle">DA = 4</text><text x="180" y="112" text-anchor="middle" fill="#e8580c">DE = 6</text><text x="180" y="176" text-anchor="middle">AB = ?</text></g></svg>`,
  // Exponentiële afname (halveringstijd via log)
  expafname:(function(){
    var sx=function(t){return 56+t/20*284;}, sy=function(N){return 158-N/500*128;};
    var f=function(t){return 500*Math.pow(0.5,t/5);};
    var pts=[]; for(var t=0;t<=20.01;t+=0.5){ pts.push(sx(t).toFixed(1)+','+sy(f(t)).toFixed(1)); }
    var curve='<polyline points="'+pts.join(' ')+'" fill="none" stroke="#2563eb" stroke-width="3"/>';
    var yl=[0,100,200,300,400,500].map(v=>'<line x1="56" y1="'+sy(v).toFixed(1)+'" x2="340" y2="'+sy(v).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(v)+3).toFixed(1)+'" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="end">'+v+'</text>').join('');
    var xl=[0,5,10,15,20].map(t=>'<text x="'+sx(t).toFixed(1)+'" y="172" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="middle">'+t+'</text>').join('');
    return '<svg viewBox="0 0 360 196" role="img" aria-label="exponentiele afname">'+yl+'<line x1="56" y1="14" x2="56" y2="158" stroke="#1b2230" stroke-width="1.8"/><path d="M56 14 L52 24 L60 24 Z" fill="#1b2230"/><line x1="56" y1="158" x2="346" y2="158" stroke="#1b2230" stroke-width="1.8"/><path d="M346 158 L338 154 L338 162 Z" fill="#1b2230"/>'+curve+xl+'<text x="0" y="0" transform="translate(18,86) rotate(-90)" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">hoeveelheid (mg)</text><text x="300" y="188" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">tijd (uur)</text></svg>';
  })(),
};

SLAGIO_EXAMENS.havo.wb = {
  origineel: true,
  titel: 'Wiskunde B',
  niveau: 'havo',
  jaar: new Date().getFullYear(),
  duur_minuten: 110,
  max_punten: 32,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Een parabool',
      context:'Gegeven is de functie f(x) = x² − 4x + 3. Afbeelding 1 toont de grafiek van f.',
      afb:_WBAFB.parabool, afb_cap:'afbeelding 1: de grafiek van f(x) = x² − 4x + 3' },
    { nr:2, titel:'Raaklijn aan een kromme',
      context:'Gegeven is de functie g(x) = x³ − 6x² + 9x. Afbeelding 2 toont de grafiek van g met een raaklijn in het punt (2, 2).',
      afb:_WBAFB.raaklijn, afb_cap:'afbeelding 2: de grafiek van g met de raaklijn in (2, 2)' },
    { nr:3, titel:'Een ladder tegen de muur',
      context:'Een ladder staat tegen een muur. Afbeelding 3 is een schematische rechthoekige driehoek: de ladder (AB) is 12 cm op schaal, de hoek bij B is 35° en de hoek bij C is recht (90°).',
      afb:_WBAFB.driehoek, afb_cap:'afbeelding 3: rechthoekige driehoek ABC' },
    { nr:4, titel:'Een draaimolen',
      context:'De hoogte van een stoeltje van een draaimolen wordt beschreven door een sinusoïde. Afbeelding 4 toont de grafiek van f(x) = 3 + 2·sin(…).',
      afb:_WBAFB.sinus, afb_cap:'afbeelding 4: een sinusoïde met evenwichtslijn en amplitude' },
    { nr:5, titel:'Gelijkvormige driehoeken',
      context:'In driehoek TAB (afbeelding 5) loopt lijnstuk DE evenwijdig aan de basis AB. Gegeven: TD = 6, DA = 4 en DE = 6. De driehoeken TDE en TAB zijn gelijkvormig.',
      afb:_WBAFB.gelijkvormig, afb_cap:'afbeelding 5: driehoek TAB met DE // AB' },
    { nr:6, titel:'Verval van een stof',
      context:'Een medicijn verdwijnt uit het bloed volgens N(t) = 500 · 0,5^(t/5), met N in mg en t in uren. Afbeelding 6 toont de grafiek.',
      afb:_WBAFB.expafname, afb_cap:'afbeelding 6: de hoeveelheid medicijn tegen de tijd' },
  ],
  vragen: [
    // ── Opgave 1 · Parabool ──
    { nr:1, opgave:1, punten:3, type:'open', domein:'Functies',
      vraag:'Bereken algebraïsch de nulpunten van f (los f(x) = 0 op). Laat je berekening zien.',
      antwoord:'f(x) = 0: x² − 4x + 3 = 0. Ontbinden: (x − 1)(x − 3) = 0, dus x = 1 of x = 3. De nulpunten zijn (1, 0) en (3, 0).',
      antwoord_rubric:'1 punt: x² − 4x + 3 = 0 opstellen. 1 punt: ontbinden (x−1)(x−3) of abc-formule. 1 punt: x = 1 en x = 3.' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Functies',
      vraag:'Bepaal de coördinaten van de top van de parabool. Leg uit hoe je aan de symmetrieas komt.',
      antwoord:'De symmetrieas ligt precies tussen de nulpunten: x = (1 + 3)/2 = 2. Invullen: f(2) = 4 − 8 + 3 = −1. De top is (2, −1).',
      antwoord_rubric:'1 punt: symmetrieas x = 2 (midden tussen de nulpunten). 1 punt: f(2) = −1, dus top (2, −1).' },
    // ── Opgave 2 · Differentiëren ──
    { nr:3, opgave:2, punten:2, type:'open', domein:'Differentiëren',
      vraag:'Bepaal de afgeleide g′(x) en bereken de helling van de grafiek in het punt (2, 2).',
      antwoord:'g′(x) = 3x² − 12x + 9. In x = 2: g′(2) = 3·4 − 12·2 + 9 = 12 − 24 + 9 = −3. De helling in (2, 2) is −3.',
      antwoord_rubric:'1 punt: g′(x) = 3x² − 12x + 9. 1 punt: g′(2) = −3.' },
    { nr:4, opgave:2, punten:2, type:'open', domein:'Differentiëren',
      vraag:'Stel de vergelijking op van de raaklijn aan g in het punt (2, 2).',
      antwoord:'De raaklijn heeft richtingscoëfficiënt −3 (de helling in dat punt): y = −3x + b. Punt (2, 2) invullen: 2 = −3·2 + b → b = 8. De raaklijn is y = −3x + 8.',
      antwoord_rubric:'1 punt: richtingscoëfficiënt −3, dus y = −3x + b. 1 punt: b = 8 → y = −3x + 8.' },
    { nr:5, opgave:2, punten:3, type:'open', domein:'Differentiëren',
      vraag:'Bereken de x-coördinaten van de toppen (extremen) van g door g′(x) = 0 op te lossen, en geef aan welke een maximum en welke een minimum is.',
      antwoord:'g′(x) = 3x² − 12x + 9 = 0. Delen door 3: x² − 4x + 3 = 0 → (x − 1)(x − 3) = 0, dus x = 1 of x = 3. Links stijgt g en bij x = 1 buigt hij om naar dalen: x = 1 is een maximum. Bij x = 3 gaat g weer stijgen: x = 3 is een minimum. (g(1) = 4, g(3) = 0.)',
      antwoord_rubric:'1 punt: g′(x) = 0 opstellen en delen door 3. 1 punt: x = 1 en x = 3. 1 punt: x = 1 maximum, x = 3 minimum (met teken-/vormargument).' },
    // ── Opgave 3 · Goniometrie ──
    { nr:6, opgave:3, punten:3, type:'open', domein:'Goniometrie',
      vraag:'Bereken de lengte van de zijde AC (de hoogte tegen de muur) met een goniometrische verhouding. Rond af op één decimaal.',
      antwoord:'AC ligt tegenover de hoek van 35° en AB (12 cm) is de schuine zijde. sin(35°) = overstaande/schuine = AC/12, dus AC = 12 · sin(35°) = 12 · 0,5736 ≈ 6,9 cm.',
      antwoord_rubric:'1 punt: juiste verhouding sin(35°) = AC/12 (overstaande/schuine). 1 punt: AC = 12·sin(35°). 1 punt: AC ≈ 6,9 cm.' },
    { nr:7, opgave:3, punten:2, type:'open', domein:'Goniometrie',
      vraag:'Bereken ook de lengte van BC (de afstand van de voet van de ladder tot de muur). Rond af op één decimaal.',
      antwoord:'BC ligt aan de hoek van 35° vast en is de aanliggende zijde: cos(35°) = BC/12, dus BC = 12 · cos(35°) = 12 · 0,8192 ≈ 9,8 cm.',
      antwoord_rubric:'1 punt: cos(35°) = BC/12 (aanliggende/schuine). 1 punt: BC ≈ 9,8 cm.' },
    // ── Opgave 4 · Sinusoïde ──
    { nr:8, opgave:4, punten:3, type:'open', domein:'Goniometrie',
      vraag:'Bepaal met afbeelding 4 de evenwichtslijn, de amplitude en de periode van deze sinusoïde.',
      antwoord:'De evenwichtslijn is y = 3 (de gestippelde middenlijn). De amplitude is 2 (de grafiek gaat 2 boven en 2 onder de evenwichtslijn, dus tussen 1 en 5). De grafiek herhaalt zich na 4 eenheden, dus de periode is 4.',
      antwoord_rubric:'1 punt: evenwichtslijn y = 3. 1 punt: amplitude 2. 1 punt: periode 4.' },
    { nr:9, opgave:4, punten:2, type:'open', domein:'Goniometrie',
      vraag:'Geef de maximale en de minimale hoogte die een stoeltje bereikt, en leg uit hoe die uit de evenwichtslijn en de amplitude volgen.',
      antwoord:'Maximale hoogte = evenwichtslijn + amplitude = 3 + 2 = 5. Minimale hoogte = evenwichtslijn − amplitude = 3 − 2 = 1. De sinus schommelt namelijk tussen +amplitude en −amplitude rond de evenwichtslijn.',
      antwoord_rubric:'1 punt: max = 3 + 2 = 5 en min = 3 − 2 = 1. 1 punt: uitleg dat de sinus ± amplitude rond de evenwichtslijn schommelt.' },
    // ── Opgave 5 · Gelijkvormigheid ──
    { nr:10, opgave:5, punten:3, type:'open', domein:'Meetkunde',
      vraag:'Bereken de lengte van AB met behulp van de gelijkvormigheid van de driehoeken TDE en TAB. Laat je berekening zien.',
      antwoord:'TA = TD + DA = 6 + 4 = 10. Omdat DE // AB zijn de driehoeken TDE en TAB gelijkvormig, met vergrotingsfactor TA/TD = 10/6. Dan geldt AB/DE = TA/TD, dus AB = DE · (TA/TD) = 6 · (10/6) = 10.',
      antwoord_rubric:'1 punt: TA = 6 + 4 = 10. 1 punt: verhouding AB/DE = TA/TD (gelijkvormigheid). 1 punt: AB = 6 · 10/6 = 10.' },
    { nr:11, opgave:5, punten:2, type:'open', domein:'Meetkunde',
      vraag:'Leg uit waarom de driehoeken TDE en TAB gelijkvormig zijn. Gebruik dat DE evenwijdig is aan AB.',
      antwoord:'Omdat DE // AB, zijn de hoeken bij D en A gelijk (F-hoeken) en de hoeken bij E en B gelijk (F-hoeken); de hoek bij T is voor beide driehoeken dezelfde. Beide driehoeken hebben dus dezelfde drie hoeken (hoek-hoek), en dan zijn ze gelijkvormig.',
      antwoord_rubric:'1 punt: DE // AB → gelijke hoeken (F-hoeken) bij D/A en E/B. 1 punt: gemeenschappelijke hoek T → drie gelijke hoeken → gelijkvormig (hh).' },
    // ── Opgave 6 · Exponentieel ──
    { nr:12, opgave:6, punten:2, type:'open', domein:'Functies',
      vraag:'Toon met de formule aan dat de halveringstijd van dit medicijn 5 uur is, en bereken hoeveel mg er na 10 uur nog in het bloed zit.',
      antwoord:'Halveringstijd: N(t) = 500 · 0,5^(t/5). Na t = 5 is de exponent 1, dus N(5) = 500 · 0,5 = 250 mg = de helft van 500: de halveringstijd is 5 uur. Na 10 uur: N(10) = 500 · 0,5^(10/5) = 500 · 0,5² = 500 · 0,25 = 125 mg.',
      antwoord_rubric:'1 punt: bij t = 5 is N = 250 = de helft → halveringstijd 5 uur. 1 punt: N(10) = 500 · 0,5² = 125 mg.' },
    { nr:13, opgave:6, punten:3, type:'open', domein:'Functies',
      vraag:'Bereken algebraïsch na hoeveel uur er nog 50 mg medicijn in het bloed zit. Gebruik logaritmen en rond af op één decimaal.',
      antwoord:'500 · 0,5^(t/5) = 50 → 0,5^(t/5) = 0,1. Neem de logaritme: (t/5)·log(0,5) = log(0,1), dus t/5 = log(0,1)/log(0,5) = (−1)/(−0,3010) = 3,32. Dan t = 5 · 3,32 ≈ 16,6 uur.',
      antwoord_rubric:'1 punt: 0,5^(t/5) = 0,1 opstellen. 1 punt: t/5 = log(0,1)/log(0,5) (logaritme gebruiken). 1 punt: t ≈ 16,6 uur.' },
  ],
};
