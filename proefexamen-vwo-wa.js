// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-wa.js  ORIGINEEL Slagio-proefexamen (vwo wiskunde A).
// Eigen contexten, vragen en figuren. Geen reproductie van een CvTE-examen.
// VWO-CE-niveau: differentiaalrekening (marginaal), exponentiele groei,
// normale verdeling en de binomiale verdeling / hypothesetoets.
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

var _VWAAFB = {
  // Winstfunctie W(q) = -0.5q^2 + 20q - 60, top bij q=20
  winst:(function(){
    var f=function(q){return -0.5*q*q+20*q-60;};
    var sx=function(q){return 56+q/40*284;}, sy=function(w){return 158-(w+60)/210*140;};
    var yl=[0,50,100,150].map(w=>'<line x1="56" y1="'+sy(w).toFixed(1)+'" x2="340" y2="'+sy(w).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(w)+3).toFixed(1)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="end">'+w+'</text>').join('');
    var xl=[0,10,20,30,40].map(q=>'<text x="'+sx(q).toFixed(1)+'" y="172" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+q+'</text>').join('');
    var pts=[]; for(var q=0;q<=40.01;q+=1){ pts.push(sx(q).toFixed(1)+','+sy(f(q)).toFixed(1)); }
    var top='<circle cx="'+sx(20)+'" cy="'+sy(140)+'" r="3.4" fill="#1b2230"/><line x1="'+sx(20)+'" y1="'+sy(140)+'" x2="'+sx(20)+'" y2="158" stroke="#94a0b8" stroke-width="1" stroke-dasharray="4 4"/><text x="'+sx(20)+'" y="'+(sy(140)-6)+'" font-family="sans-serif" font-size="8" fill="#1b2230" text-anchor="middle">top</text>';
    var zero='<line x1="56" y1="'+sy(0)+'" x2="342" y2="'+sy(0)+'" stroke="#c9d2e0" stroke-width="1.2"/>';
    return '<svg viewBox="0 0 360 194" role="img" aria-label="winst tegen productie">'+yl+zero+'<line x1="56" y1="14" x2="56" y2="158" stroke="#1b2230" stroke-width="1.8"/><path d="M56 14 L52 24 L60 24 Z" fill="#1b2230"/><line x1="56" y1="158" x2="342" y2="158" stroke="#1b2230" stroke-width="1.8"/><path d="M342 158 L334 154 L334 162 Z" fill="#1b2230"/><polyline points="'+pts.join(' ')+'" fill="none" stroke="#2563eb" stroke-width="2.8"/>'+top+xl+'<text x="0" y="0" transform="translate(16,90) rotate(-90)" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">winst (x1000 euro)</text><text x="250" y="188" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">productie q (x1000 stuks)</text></svg>';
  })(),
  // Exponentiele groei (bacteriecultuur), log-lineair niet nodig
  groei:(function(){
    var f=function(t){return 200*Math.pow(1.35,t);};
    var sx=function(t){return 56+t/12*284;}, sy=function(N){return 150-N/4000*128;};
    var yl=[0,1000,2000,3000,4000].map(N=>'<line x1="56" y1="'+sy(N).toFixed(1)+'" x2="340" y2="'+sy(N).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(N)+3).toFixed(1)+'" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="end">'+N+'</text>').join('');
    var xl=[0,3,6,9,12].map(t=>'<text x="'+sx(t).toFixed(1)+'" y="166" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+t+'</text>').join('');
    var pts=[]; for(var t=0;t<=12.01;t+=0.25){ pts.push(sx(t).toFixed(1)+','+sy(Math.min(f(t),4000)).toFixed(1)); }
    return '<svg viewBox="0 0 360 194" role="img" aria-label="exponentiele groei van een bacteriecultuur">'+yl+'<line x1="56" y1="14" x2="56" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M56 14 L52 24 L60 24 Z" fill="#1b2230"/><line x1="56" y1="150" x2="342" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M342 150 L334 146 L334 154 Z" fill="#1b2230"/><polyline points="'+pts.join(' ')+'" fill="none" stroke="#2e9e5b" stroke-width="2.8"/>'+xl+'<text x="0" y="0" transform="translate(16,84) rotate(-90)" font-family="sans-serif" font-size="8" font-weight="800" fill="#1b2230" text-anchor="middle">aantal (miljoen)</text><text x="270" y="184" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">tijd (uur)</text></svg>';
  })(),
  // Normale verdeling met gearceerd rechterstaartje boven grens
  normaal:(function(){
    var mu=180, headsp=170; // center x-value etc handled via mapping
    var sx=function(x){return 56+(x-150)/60*284;}, sy=function(y){return 150-y*128;};
    var f=function(x){var z=(x-180)/10; return Math.exp(-0.5*z*z);};
    var pts=[]; for(var x=150;x<=210.01;x+=1){ pts.push(sx(x).toFixed(1)+','+sy(f(x)).toFixed(1)); }
    // shade x>=195
    var sh=['<path d="M'+sx(195)+' '+sy(0)];
    for(var x=195;x<=210.01;x+=1){ sh.push('L'+sx(x).toFixed(1)+' '+sy(f(x)).toFixed(1)); }
    sh.push('L'+sx(210)+' '+sy(0)+' Z" fill="rgba(232,88,12,0.22)" stroke="none"/>');
    var xl=[150,165,180,195,210].map(x=>'<text x="'+sx(x).toFixed(1)+'" y="166" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+x+'</text>').join('');
    var muL='<line x1="'+sx(180)+'" y1="'+sy(1)+'" x2="'+sx(180)+'" y2="150" stroke="#94a0b8" stroke-width="1" stroke-dasharray="4 4"/><text x="'+sx(180)+'" y="'+(sy(1)-4)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">mu=180</text>';
    var gr='<line x1="'+sx(195)+'" y1="150" x2="'+sx(195)+'" y2="'+sy(f(195))+'" stroke="#e8580c" stroke-width="1.6"/><text x="'+sx(198)+'" y="'+(sy(0.30))+'" font-family="sans-serif" font-size="8" font-weight="700" fill="#e8580c">x=195</text>';
    return '<svg viewBox="0 0 360 188" role="img" aria-label="normale verdeling met gearceerd gebied">'+'<line x1="56" y1="150" x2="342" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M342 150 L334 146 L334 154 Z" fill="#1b2230"/>'+sh.join('')+muL+'<polyline points="'+pts.join(' ')+'" fill="none" stroke="#2563eb" stroke-width="2.8"/>'+gr+xl+'<text x="200" y="182" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">lengte (cm)</text></svg>';
  })(),
  // Binomiaal staafdiagram n=20, p=0.0668 (onder H0), waargenomen X=4 valt in staart X>=4
  binom:(function(){
    // P(X=k) = C(20,k) 0.0668^k 0.9332^(20-k)
    function comb(n,k){var r=1;for(var i=0;i<k;i++){r=r*(n-i)/(i+1);}return r;}
    var n=20,p=0.0668; var bars=[]; var maxP=0;
    for(var k=0;k<=8;k++){ var pk=comb(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k); bars.push([k,pk]); if(pk>maxP)maxP=pk; }
    var sx=function(k){return 66+k/8*266;}, sy=function(pr){return 150-pr/maxP*122;};
    var rects=bars.map(b=>{var w=20; var x=sx(b[0])-w/2; var h=150-sy(b[1]); var col=b[0]>=4?'#e8580c':'#2563eb'; return '<rect x="'+x.toFixed(1)+'" y="'+sy(b[1]).toFixed(1)+'" width="'+w+'" height="'+h.toFixed(1)+'" fill="'+col+'" opacity="0.9"/>';}).join('');
    var xl=[0,1,2,3,4,5,6,7,8].map(k=>'<text x="'+sx(k).toFixed(1)+'" y="164" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+k+'</text>').join('');
    var yl=[0,0.10,0.20,0.30].map(pr=>'<line x1="60" y1="'+sy(pr).toFixed(1)+'" x2="340" y2="'+sy(pr).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="55" y="'+(sy(pr)+3).toFixed(1)+'" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="end">'+pr.toFixed(2)+'</text>').join('');
    var leg='<rect x="212" y="18" width="10" height="10" fill="#e8580c" opacity="0.9"/><text x="226" y="27" font-family="sans-serif" font-size="8" fill="#4a5568">X >= 4 (waargenomen staart)</text>';
    return '<svg viewBox="0 0 360 186" role="img" aria-label="binomiale kansverdeling onder de nulhypothese">'+yl+'<line x1="60" y1="14" x2="60" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M60 14 L56 24 L64 24 Z" fill="#1b2230"/><line x1="60" y1="150" x2="342" y2="150" stroke="#1b2230" stroke-width="1.8"/><path d="M342 150 L334 146 L334 154 Z" fill="#1b2230"/>'+rects+leg+xl+'<text x="0" y="0" transform="translate(18,84) rotate(-90)" font-family="sans-serif" font-size="8" font-weight="800" fill="#1b2230" text-anchor="middle">P(X=k)</text><text x="230" y="180" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">aantal lange planten k</text></svg>';
  })(),
};

SLAGIO_EXAMENS.vwo.wa = {
  origineel: true,
  titel: 'Wiskunde A',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 180,
  max_punten: 22,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Winst van een fabrikant',
      context:'Een fabrikant maakt q duizend eenheden van een product. De winst (in duizenden euro) wordt gegeven door W(q) = -0,5q^2 + 20q - 60. Afbeelding 1 toont de grafiek.',
      afb:_VWAAFB.winst, afb_cap:'afbeelding 1: de winst W(q)' },
    { nr:2, titel:'Een bacteriecultuur',
      context:'Een bacteriecultuur groeit exponentieel. Op t = 0 uur zijn er 200 miljoen bacterien; het aantal wordt beschreven door N(t) = 200 · 1,35^t (N in miljoen, t in uur). Afbeelding 2 toont de groei.',
      afb:_VWAAFB.groei, afb_cap:'afbeelding 2: het aantal bacterien N(t)' },
    { nr:3, titel:'De lengte van planten',
      context:'De lengte van volgroeide planten van een soort is normaal verdeeld met gemiddelde mu = 180 cm en standaardafwijking sigma = 10 cm. Afbeelding 3 toont de verdeling; het gearceerde gebied hoort bij lengtes van 195 cm en meer.',
      afb:_VWAAFB.normaal, afb_cap:'afbeelding 3: de normale verdeling van de plantlengte' },
    { nr:4, titel:'Een nieuwe kweekmethode',
      context:'Een kweker beweert dat zijn nieuwe methode vaker planten van 195 cm of langer oplevert. Normaal is de kans daarop 0,0668 per plant. Hij onderzoekt 20 planten. Afbeelding 4 toont de binomiale verdeling van het aantal lange planten (n = 20, p = 0,0668) onder de aanname dat de methode niet werkt; oranje is de staart X >= 4 (het waargenomen aantal).',
      afb:_VWAAFB.binom, afb_cap:'afbeelding 4: binomiale verdeling onder H0 (n = 20, p = 0,0668) met de staart X >= 4' },
  ],
  vragen: [
    // Opgave 1
    { nr:1, opgave:1, punten:3, type:'open', domein:'Differentiaalrekening',
      vraag:'Bepaal met de afgeleide bij welke productie q de winst maximaal is, en bereken die maximale winst.',
      antwoord:'W(q) = -0,5q^2 + 20q - 60, dus W\'(q) = -q + 20. De top vind je waar W\'(q) = 0: -q + 20 = 0, dus q = 20. Omdat de coefficient van q^2 negatief is, is dit een maximum. Maximale winst: W(20) = -0,5·400 + 20·20 - 60 = -200 + 400 - 60 = 140. De winst is maximaal 140 duizend euro bij q = 20 (duizend eenheden).',
      antwoord_rubric:'1 punt: W\'(q) = -q + 20. 1 punt: W\'(q) = 0 geeft q = 20 (met argument dat het een maximum is). 1 punt: W(20) = 140 (duizend euro).' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Differentiaalrekening',
      vraag:'De marginale winst is de afgeleide W\'(q). Bereken de marginale winst bij q = 8 en leg uit wat die waarde betekent.',
      antwoord:'W\'(8) = -8 + 20 = 12. De marginale winst bij q = 8 is 12 (duizend euro per duizend eenheden). Het betekent dat de winst met ongeveer 12 duizend euro toeneemt als de productie bij q = 8 met een (duizend) eenheid stijgt. De marginale winst is positief, dus bij q = 8 loont het nog om meer te produceren.',
      antwoord_rubric:'1 punt: W\'(8) = 12. 1 punt: interpretatie als winsttoename per extra (duizend) eenheid; positief dus meer produceren loont.' },
    // Opgave 2
    { nr:3, opgave:2, punten:2, type:'open', domein:'Exponentiele groei',
      vraag:'Met hoeveel procent per uur groeit de cultuur, en bereken het aantal bacterien na 5 uur?',
      antwoord:'De groeifactor per uur is 1,35, dus de cultuur groeit met (1,35 - 1)·100% = 35% per uur. Na 5 uur: N(5) = 200 · 1,35^5 = 200 · 4,437 = 887 miljoen bacterien (afgerond).',
      antwoord_rubric:'1 punt: groei 35% per uur (uit groeifactor 1,35). 1 punt: N(5) = 200·1,35^5 = ongeveer 887 miljoen.' },
    { nr:4, opgave:2, punten:3, type:'open', domein:'Exponentiele groei',
      vraag:'Bereken met een logaritme de verdubbelingstijd van de cultuur (los N(t) = 400 op).',
      antwoord:'De verdubbelingstijd is de tijd waarin het aantal van 200 naar 400 miljoen gaat: 200 · 1,35^t = 400, dus 1,35^t = 2. Neem de logaritme: t = log(2) / log(1,35) = 0,3010 / 0,1303 = 2,31 uur. De cultuur verdubbelt dus ongeveer elke 2,3 uur.',
      antwoord_rubric:'1 punt: 1,35^t = 2 opstellen. 1 punt: t = log(2)/log(1,35). 1 punt: t = 2,3 uur (afgerond).' },
    // Opgave 3
    { nr:5, opgave:3, punten:3, type:'open', domein:'Normale verdeling',
      vraag:'Bereken de kans dat een willekeurige plant 195 cm of langer is (het gearceerde gebied). Gebruik de standaardnormale verdeling.',
      antwoord:'Standaardiseren: z = (x - mu)/sigma = (195 - 180)/10 = 1,5. Gevraagd is P(X >= 195) = P(Z >= 1,5). Uit de tabel/rekenmachine: P(Z < 1,5) = 0,9332, dus P(Z >= 1,5) = 1 - 0,9332 = 0,0668. De kans is ongeveer 0,067 (6,7%).',
      antwoord_rubric:'1 punt: z = (195-180)/10 = 1,5. 1 punt: P(Z < 1,5) = 0,9332 (of normalcdf). 1 punt: P(X >= 195) = 0,0668.' },
    { nr:6, opgave:3, punten:2, type:'open', domein:'Normale verdeling',
      vraag:'De 10% langste planten worden als "extra lang" bestempeld. Bepaal vanaf welke lengte een plant extra lang is.',
      antwoord:'Gezocht is de grens g met P(X >= g) = 0,10, dus P(X < g) = 0,90. De bijbehorende z-waarde is z = 1,28 (het 90e percentiel). Dan g = mu + z·sigma = 180 + 1,28·10 = 192,8 cm. Planten van ongeveer 193 cm en langer zijn dus extra lang.',
      antwoord_rubric:'1 punt: z = 1,28 bij P = 0,90 (invnorm). 1 punt: g = 180 + 1,28·10 = 192,8 cm (ongeveer 193 cm).' },
    // Opgave 4
    { nr:7, opgave:4, punten:3, type:'open', domein:'Toetsen',
      vraag:'De kweker toetst met significantieniveau 5% of zijn methode werkt. Onder de nulhypothese is het aantal lange planten X binomiaal verdeeld met n = 20 en p = 0,0668. Formuleer H0 en H1, en leg uit waarom dit een rechtseenzijdige toets is.',
      antwoord:'H0: p = 0,0668 (de methode werkt niet, de kans op een lange plant is onveranderd). H1: p > 0,0668 (de methode werkt, de kans op een lange plant is groter). Het is een rechtseenzijdige toets omdat de bewering van de kweker gaat over "vaker" lange planten: alleen een ongewoon groot aantal lange planten (rechterstaart) is bewijs voor zijn claim. We verwerpen H0 dus alleen bij een hoog aantal successen.',
      antwoord_rubric:'1 punt: H0: p = 0,0668. 1 punt: H1: p > 0,0668. 1 punt: uitleg rechtseenzijdig (claim "vaker" -> alleen grote X telt als bewijs).' },
    { nr:8, opgave:4, punten:4, type:'open', domein:'Toetsen',
      vraag:'In de steekproef van 20 planten zijn er 4 van 195 cm of langer. Bereken P(X >= 4) onder H0 (p = 0,0668) en trek met het significantieniveau van 5% een conclusie.',
      antwoord:'Onder H0 is X binomiaal met n = 20 en p = 0,0668. P(X >= 4) = 1 - P(X <= 3). Bereken P(X <= 3) met de binomiale verdeling: P(X=0) = 0,9332^20 = 0,2509; P(X=1) = 20·0,0668·0,9332^19 = 0,3592; P(X=2) = 190·0,0668^2·0,9332^18 = 0,2443; P(X=3) = 1140·0,0668^3·0,9332^17 = 0,1049. Som = 0,9593, dus P(X >= 4) = 1 - 0,9593 = 0,0407. Omdat 0,0407 < 0,05 (kleiner dan het significantieniveau), verwerpen we H0. De uitkomst is significant: er is voldoende bewijs dat de nieuwe methode vaker lange planten oplevert.',
      antwoord_rubric:'1 punt: P(X >= 4) = 1 - P(X <= 3) onder n=20, p=0,0668. 1 punt: P(X <= 3) = 0,959 (via binomcdf). 1 punt: P(X >= 4) = 0,041. 1 punt: 0,041 < 0,05 dus H0 verwerpen (significant, methode werkt).' },
  ],
};
