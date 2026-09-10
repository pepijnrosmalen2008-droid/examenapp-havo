// ═══════════════════════════════════════════════════════════════════════
// proefexamen-wa.js, ORIGINEEL Slagio-proefexamen in examenstijl (havo wa).
// Eigen contexten, vragen en figuren. Géén reproductie van een CvTE-examen.
// CE-niveau wiskunde A: exponentiële groei, statistiek (boxplot, histogram,
// kruistabel), kansrekening en gemiddelde verandering. Rekenwerk met
// tussenstappen; meervoudige nakijkrubric per vraag. Figuren in hoge kwaliteit.
//   opgaven[] = {nr,titel,context,afb,afb_cap}
//   vragen[]  = {nr,opgave,punten,type,vraag,antwoord,antwoord_rubric,domein}
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.havo = SLAGIO_EXAMENS.havo || {};

// Assen met pijlpunten (herbruikbaar)
function _waAxes(){
  return '<line x1="52" y1="14" x2="52" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/>'+
         '<line x1="52" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M344 158 L334 154 L334 162 Z" fill="#1b2230"/>';
}

var _WAAFB = {
  // Exponentiële groei V = 200·1,25^t: eerlijke punten op de curve
  exp:(function(){
    // y-as 0..2000 (0→158, 2000→30); x: t=0→52, per t +24px
    var sy=function(v){return 158 - v/2000*128;};
    var sx=function(t){return 52 + t*24;};
    var V=function(t){return 200*Math.pow(1.25,t);};
    var dots=[0,2,4,6,8,10].map(function(t){return '<circle cx="'+sx(t)+'" cy="'+sy(V(t)).toFixed(1)+'" r="3" fill="#1b2230"/>';}).join('');
    var path='M'+sx(0)+' '+sy(V(0)).toFixed(1)+Array.from({length:11},(_,t)=>' L'+sx(t)+' '+sy(V(t)).toFixed(1)).join('');
    var yl=[[0,0],[500,500],[1000,1000],[1500,1500],[2000,2000]].map(p=>'<line x1="52" y1="'+sy(p[1]).toFixed(1)+'" x2="340" y2="'+sy(p[1]).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="47" y="'+(sy(p[1])+3).toFixed(1)+'" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="end">'+p[0]+'</text>').join('');
    var xl=[0,2,4,6,8,10].map(t=>'<text x="'+sx(t)+'" y="172" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">'+t+'</text>').join('');
    return '<svg viewBox="0 0 360 196" role="img" aria-label="exponentiële groei van het aantal volgers">'+yl+_waAxes()+'<path d="'+path+'" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+dots+xl+'<text x="0" y="0" transform="translate(16,96) rotate(-90)" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">aantal volgers</text><text x="250" y="188" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">tijd (maanden)</text></svg>';
  })(),

  // Twee boxplots (klas A en klas B) op een gemeenschappelijke schaal 1-10
  boxplot:(function(){
    // schaal: cijfer 1..10 → x 60..330
    var sx=function(c){return 60+(c-1)/9*270;};
    function box(y,mn,q1,med,q3,mx,col){
      return '<line x1="'+sx(mn)+'" y1="'+y+'" x2="'+sx(q1)+'" y2="'+y+'" stroke="#1b2230" stroke-width="1.6"/>'+
             '<line x1="'+sx(q3)+'" y1="'+y+'" x2="'+sx(mx)+'" y2="'+y+'" stroke="#1b2230" stroke-width="1.6"/>'+
             '<line x1="'+sx(mn)+'" y1="'+(y-7)+'" x2="'+sx(mn)+'" y2="'+(y+7)+'" stroke="#1b2230" stroke-width="1.6"/>'+
             '<line x1="'+sx(mx)+'" y1="'+(y-7)+'" x2="'+sx(mx)+'" y2="'+(y+7)+'" stroke="#1b2230" stroke-width="1.6"/>'+
             '<rect x="'+sx(q1)+'" y="'+(y-13)+'" width="'+(sx(q3)-sx(q1))+'" height="26" fill="'+col+'" stroke="#1b2230" stroke-width="1.6"/>'+
             '<line x1="'+sx(med)+'" y1="'+(y-13)+'" x2="'+sx(med)+'" y2="'+(y+13)+'" stroke="#1b2230" stroke-width="2.4"/>';
    }
    var ticks=Array.from({length:10},(_,i)=>{var c=i+1;return '<line x1="'+sx(c)+'" y1="150" x2="'+sx(c)+'" y2="156" stroke="#1b2230" stroke-width="1"/><text x="'+sx(c)+'" y="168">'+c+'</text>';}).join('');
    return '<svg viewBox="0 0 360 184" role="img" aria-label="twee boxplots van cijfers">'+box(46,3,5,6,7,9,'#cfe0fb')+box(104,2,4,6,8,10,'#ffe0cc')+'<line x1="52" y1="150" x2="344" y2="150" stroke="#1b2230" stroke-width="2"/><g font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">'+ticks+'</g><g font-family="sans-serif" font-size="10.5" font-weight="800"><text x="30" y="50" fill="#2563eb">A</text><text x="30" y="108" fill="#e8580c">B</text></g><text x="196" y="182" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1b2230" text-anchor="middle">cijfer</text></svg>';
  })(),

  // Histogram van reistijden (frequentie per klasse)
  histogram:(function(){
    var F=[4,10,14,8,4]; var lab=['0','10','20','30','40','50'];
    var x0=60,w=52,base=150,maxH=14;
    var bars=F.map(function(f,i){var h=f/maxH*120;var x=x0+i*w;return '<rect x="'+x+'" y="'+(base-h).toFixed(1)+'" width="'+w+'" height="'+h.toFixed(1)+'" fill="#5b9bd5" stroke="#1b2230" stroke-width="1.1"/><text x="'+(x+w/2)+'" y="'+(base-h-4).toFixed(1)+'" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1b2230" text-anchor="middle">'+f+'</text>';}).join('');
    var xl=lab.map(function(l,i){return '<text x="'+(x0+i*w)+'" y="166">'+l+'</text>';}).join('');
    var yl=[0,4,8,12].map(function(v){var y=base-v/maxH*120;return '<line x1="52" y1="'+y+'" x2="336" y2="'+y+'" stroke="#eef1f5" stroke-width="1"/><text x="46" y="'+(y+3)+'" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="end">'+v+'</text>';}).join('');
    return '<svg viewBox="0 0 360 194" role="img" aria-label="histogram van reistijden">'+yl+_waAxes()+bars+'<g font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">'+xl+'</g><text x="0" y="0" transform="translate(16,96) rotate(-90)" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">aantal leerlingen</text><text x="250" y="186" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">reistijd (minuten)</text></svg>';
  })(),

  // Kansboom: file ja/nee → te laat ja/nee
  kansboom:`<svg viewBox="0 0 360 186" role="img" aria-label="kansboom van file en te laat komen"><g stroke="#94a0b8" stroke-width="1.6" fill="none"><line x1="46" y1="93" x2="150" y2="46"/><line x1="46" y1="93" x2="150" y2="140"/><line x1="176" y1="46" x2="300" y2="26"/><line x1="176" y1="46" x2="300" y2="66"/><line x1="176" y1="140" x2="300" y2="120"/><line x1="176" y1="140" x2="300" y2="160"/></g><circle cx="42" cy="93" r="4" fill="#1b2230"/><g font-family="sans-serif" font-size="10" fill="#2563eb" font-weight="700"><text x="86" y="60">0,3</text><text x="86" y="128">0,7</text></g><g font-family="sans-serif" font-size="10" fill="#e8580c" font-weight="700"><text x="232" y="30">0,6</text><text x="232" y="62">0,4</text><text x="232" y="120">0,1</text><text x="232" y="160">0,9</text></g><g font-family="sans-serif" font-size="10" fill="#1b2230"><text x="156" y="42">file</text><text x="156" y="150">geen file</text><text x="306" y="30">te laat</text><text x="306" y="70">op tijd</text><text x="306" y="124">te laat</text><text x="306" y="164">op tijd</text></g></svg>`,

  // Lijngrafiek met koorde van maand 2 tot 6 (gemiddelde toename)
  toename:(function(){
    // y-as 0..1200 (0→158, 1200→30); x: maand 0→52, per maand +24px
    var sy=function(v){return 158 - v/1200*128;};
    var sx=function(m){return 52 + m*24;};
    // convexe (versnellende) bezoekerskromme: m2=300, m6=1000 exact
    var pts=[[0,150],[1,210],[2,300],[3,430],[4,590],[5,780],[6,1000],[7,1150]];
    var path='M'+pts.map((p,i)=>(i?'L':'')+sx(p[0])+' '+sy(p[1]).toFixed(1)).join(' ');
    var yl=[0,300,600,900,1200].map(v=>'<line x1="52" y1="'+sy(v).toFixed(1)+'" x2="340" y2="'+sy(v).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="47" y="'+(sy(v)+3).toFixed(1)+'" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="end">'+v+'</text>').join('');
    var xl=[0,2,4,6,8,10].map(m=>'<text x="'+sx(m)+'" y="172" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">'+m+'</text>').join('');
    var koorde='<line x1="'+sx(2)+'" y1="'+sy(300).toFixed(1)+'" x2="'+sx(6)+'" y2="'+sy(1000).toFixed(1)+'" stroke="#e8580c" stroke-width="2" stroke-dasharray="6 4"/><circle cx="'+sx(2)+'" cy="'+sy(300).toFixed(1)+'" r="4" fill="#e8580c"/><circle cx="'+sx(6)+'" cy="'+sy(1000).toFixed(1)+'" r="4" fill="#e8580c"/>';
    return '<svg viewBox="0 0 360 196" role="img" aria-label="aantal bezoekers met koorde van maand 2 tot 6">'+yl+_waAxes()+'<path d="'+path+'" fill="none" stroke="#2e9e5b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+koorde+xl+'<text x="0" y="0" transform="translate(16,96) rotate(-90)" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">bezoekers</text><text x="250" y="188" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">maand</text></svg>';
  })(),

  // Kruistabel: niveau × bijbaan
  kruistabel:`<svg viewBox="0 0 360 176" role="img" aria-label="kruistabel niveau en bijbaan"><g stroke="#1b2230" stroke-width="1.3" fill="none"><rect x="20" y="30" width="320" height="120"/><line x1="20" y1="62" x2="340" y2="62"/><line x1="20" y1="98" x2="340" y2="98"/><line x1="20" y1="134" x2="340" y2="134"/><line x1="140" y1="30" x2="140" y2="150"/><line x1="220" y1="30" x2="220" y2="150"/><line x1="300" y1="30" x2="300" y2="150"/></g><g font-family="sans-serif" font-size="10.5" fill="#1b2230"><text x="180" y="50" text-anchor="middle" font-weight="700">bijbaan</text><text x="260" y="50" text-anchor="middle" font-weight="700">geen</text><text x="320" y="50" text-anchor="middle" font-weight="700">totaal</text><text x="80" y="84" text-anchor="middle" font-weight="700">havo</text><text x="80" y="120" text-anchor="middle" font-weight="700">vwo</text><text x="80" y="146" text-anchor="middle" font-weight="700">totaal</text><text x="180" y="84" text-anchor="middle">72</text><text x="260" y="84" text-anchor="middle">48</text><text x="320" y="84" text-anchor="middle">120</text><text x="180" y="120" text-anchor="middle">40</text><text x="260" y="120" text-anchor="middle">40</text><text x="320" y="120" text-anchor="middle">80</text><text x="180" y="146" text-anchor="middle">112</text><text x="260" y="146" text-anchor="middle">88</text><text x="320" y="146" text-anchor="middle" font-weight="700">200</text></g><text x="180" y="22" font-family="sans-serif" font-size="9.5" fill="#8a94a8" text-anchor="middle">aantallen leerlingen (n = 200)</text></svg>`,
};

SLAGIO_EXAMENS.havo.wa = {
  origineel: true,
  titel: 'Wiskunde A',
  niveau: 'havo',
  jaar: new Date().getFullYear(),
  duur_minuten: 100,
  max_punten: 30,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Een groeiend account',
      context:'Een beginnende maker ziet het aantal volgers exponentieel groeien. Op t = 0 maanden zijn er 200 volgers; elke maand komt er hetzelfde percentage bij. Afbeelding 1 toont de groei; op t = 1 maand zijn er 250 volgers.',
      afb:_WAAFB.exp, afb_cap:'afbeelding 1: aantal volgers tegen de tijd' },
    { nr:2, titel:'Twee klassen vergelijken',
      context:'Twee klassen maken dezelfde toets. Afbeelding 2 toont de boxplots van de cijfers van klas A en klas B op dezelfde schaal.',
      afb:_WAAFB.boxplot, afb_cap:'afbeelding 2: boxplots van de cijfers van klas A en klas B' },
    { nr:3, titel:'Reistijd naar school',
      context:'Van 40 leerlingen is de reistijd naar school bijgehouden. Afbeelding 3 is het histogram van de reistijden in klassen van 10 minuten (0-10, 10-20, enzovoort).',
      afb:_WAAFB.histogram, afb_cap:'afbeelding 3: histogram van de reistijden' },
    { nr:4, titel:'File of niet',
      context:'Elke ochtend is de kans op file 0,3. Bij file komt Daan met kans 0,6 te laat; zonder file met kans 0,1. Afbeelding 4 is de bijbehorende kansboom.',
      afb:_WAAFB.kansboom, afb_cap:'afbeelding 4: kansboom van file en te laat komen' },
    { nr:5, titel:'Bezoekers van een webshop',
      context:'Afbeelding 5 toont het aantal bezoekers van een webshop per maand. De rode stippellijn (koorde) verbindt de punten bij maand 2 en maand 6.',
      afb:_WAAFB.toename, afb_cap:'afbeelding 5: aantal bezoekers per maand met koorde van maand 2 tot 6' },
    { nr:6, titel:'Bijbanen',
      context:'Onder 200 leerlingen is onderzocht of ze een bijbaan hebben, uitgesplitst naar niveau. Afbeelding 6 is de kruistabel met de aantallen.',
      afb:_WAAFB.kruistabel, afb_cap:'afbeelding 6: kruistabel niveau × bijbaan' },
  ],
  vragen: [
    // ── Opgave 1 · Exponentieel ──
    { nr:1, opgave:1, punten:2, type:'open', domein:'Exponentieel',
      vraag:'Bepaal de groeifactor per maand en de bijbehorende procentuele groei per maand.',
      antwoord:'Groeifactor g = nieuw ÷ oud = 250 ÷ 200 = 1,25 per maand. Een groeifactor van 1,25 betekent een toename van 25% per maand.',
      antwoord_rubric:'1 punt: g = 250/200 = 1,25. 1 punt: dat is +25% per maand.' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Exponentieel',
      vraag:'Stel een formule op voor het aantal volgers V na t maanden, en bereken met de formule het aantal volgers na 6 maanden.',
      antwoord:'V = 200 · 1,25^t. Na 6 maanden: V = 200 · 1,25^6 = 200 · 3,8147 ≈ 763 volgers.',
      antwoord_rubric:'1 punt: V = 200 · 1,25^t. 1 punt: V(6) = 200 · 1,25^6 ≈ 763 (afronden op heel getal).' },
    { nr:3, opgave:1, punten:3, type:'open', domein:'Exponentieel',
      vraag:'Bereken na hoeveel hele maanden het aantal volgers voor het eerst boven de 1000 komt. Laat je berekening zien.',
      antwoord:'Oplossen: 200 · 1,25^t > 1000 → 1,25^t > 5 → t > log(5)/log(1,25) = 0,699/0,0969 ≈ 7,2. Na 7 maanden is V = 200·1,25^7 ≈ 954 (nog onder 1000); na 8 maanden ≈ 1192. Dus vanaf 8 hele maanden komt het aantal boven de 1000.',
      antwoord_rubric:'1 punt: ongelijkheid 1,25^t > 5 opstellen. 1 punt: t > log5/log1,25 ≈ 7,2. 1 punt: conclusie 8 (hele) maanden (bv. gecontroleerd met V(7)≈954, V(8)≈1192).' },
    // ── Opgave 2 · Boxplot ──
    { nr:4, opgave:2, punten:2, type:'open', domein:'Statistiek',
      vraag:'Lees uit afbeelding 2 de mediaan van klas A af en bepaal de kwartielafstand (interkwartielafstand) van klas A.',
      antwoord:'De mediaan van A is 6 (de streep in de box). Q1 = 5 en Q3 = 7, dus de kwartielafstand = Q3 − Q1 = 7 − 5 = 2.',
      antwoord_rubric:'1 punt: mediaan A = 6. 1 punt: kwartielafstand = 7 − 5 = 2.' },
    { nr:5, opgave:2, punten:3, type:'open', domein:'Statistiek',
      vraag:'Beide klassen hebben dezelfde mediaan. Leg met de boxplots uit welke klas een grotere spreiding heeft, en beoordeel de uitspraak: "In klas B haalde meer dan een kwart van de leerlingen een 8 of hoger."',
      antwoord:'Beide medianen zijn 6, maar klas B heeft een grotere spreiding: de box van B (Q1 = 4 tot Q3 = 8, kwartielafstand 4) is breder dan die van A (Q1 = 5 tot Q3 = 7, kwartielafstand 2), en ook het bereik van B (2-10) is groter dan van A (3-9). De uitspraak over B klopt niet precies: Q3 van B is 8, en per definitie ligt 25% (een kwart) van de leerlingen bóven Q3. Bij een 8 of hoger zit je op/boven Q3, dus het is ongeveer een kwart, niet méér dan een kwart.',
      antwoord_rubric:'1 punt: B heeft grotere spreiding, onderbouwd met kwartielafstand of bereik. 1 punt: Q3(B) = 8 → 25% ligt boven Q3. 1 punt: conclusie dat "meer dan een kwart ≥ 8" niet klopt (het is ongeveer een kwart).' },
    // ── Opgave 3 · Histogram ──
    { nr:6, opgave:3, punten:1, type:'open', domein:'Statistiek',
      vraag:'In welke klasse ligt de modus van de reistijden? Licht kort toe.',
      antwoord:'De modus ligt in de klasse 20-30 minuten: die staaf is het hoogst (14 leerlingen), dus die reistijdklasse komt het vaakst voor.',
      antwoord_rubric:'1 punt: modale klasse 20-30 min (hoogste staaf, 14 leerlingen).' },
    { nr:7, opgave:3, punten:3, type:'open', domein:'Statistiek',
      vraag:'Schat het gemiddelde van de reistijden. Gebruik de klassenmiddens en laat je berekening zien.',
      antwoord:'Neem als klassenmidden 5, 15, 25, 35, 45 min met frequenties 4, 10, 14, 8, 4. Som = 5·4 + 15·10 + 25·14 + 35·8 + 45·4 = 20 + 150 + 350 + 280 + 180 = 980. Gemiddelde = 980 ÷ 40 = 24,5 minuten.',
      antwoord_rubric:'1 punt: klassenmiddens gebruiken (5,15,25,35,45). 1 punt: Σ(midden·frequentie) = 980. 1 punt: 980/40 = 24,5 min.' },
    // ── Opgave 4 · Kans ──
    { nr:8, opgave:4, punten:2, type:'open', domein:'Kans',
      vraag:'Bereken met de kansboom de kans dat Daan op een willekeurige ochtend te laat komt.',
      antwoord:'P(te laat) = P(file)·P(te laat|file) + P(geen file)·P(te laat|geen file) = 0,3·0,6 + 0,7·0,1 = 0,18 + 0,07 = 0,25.',
      antwoord_rubric:'1 punt: beide takken 0,3·0,6 en 0,7·0,1. 1 punt: optellen tot P = 0,25.' },
    { nr:9, opgave:4, punten:3, type:'open', domein:'Kans',
      vraag:'Op een dag komt Daan te laat. Bereken de kans dat er die ochtend file was.',
      antwoord:'Dit is een voorwaardelijke kans: P(file | te laat) = P(file én te laat) ÷ P(te laat) = (0,3·0,6) ÷ 0,25 = 0,18 ÷ 0,25 = 0,72.',
      antwoord_rubric:'1 punt: herkennen als voorwaardelijke kans P(file|te laat) = P(file én te laat)/P(te laat). 1 punt: teller 0,18 en noemer 0,25. 1 punt: uitkomst 0,72.' },
    // ── Opgave 5 · Verandering ──
    { nr:10, opgave:5, punten:3, type:'open', domein:'Verandering',
      vraag:'Bij maand 2 zijn er 300 bezoekers, bij maand 6 zijn er 1000 bezoekers. Bereken de gemiddelde toename van het aantal bezoekers per maand tussen maand 2 en maand 6, en leg uit wat de koorde in afbeelding 5 hiermee te maken heeft.',
      antwoord:'Gemiddelde toename = Δbezoekers ÷ Δmaanden = (1000 − 300) ÷ (6 − 2) = 700 ÷ 4 = 175 bezoekers per maand. De rode koorde verbindt de punten bij maand 2 en 6; de gemiddelde toename is de steilheid (helling) van die koorde.',
      antwoord_rubric:'1 punt: (1000 − 300)/(6 − 2). 1 punt: = 175 bezoekers per maand. 1 punt: koppeling aan de helling/steilheid van de koorde.' },
    { nr:11, opgave:5, punten:2, type:'open', domein:'Verandering',
      vraag:'Leg met de vorm van de grafiek uit of de toename van het aantal bezoekers per maand in maand 6 groter of kleiner is dan de gemiddelde toename die je net berekende.',
      antwoord:'De grafiek loopt bij maand 6 steiler dan de koorde: de kromme wordt naar rechts toe steeds steiler. De momentane toename in maand 6 (de helling van de raaklijn daar) is dus groter dan de gemiddelde toename van 175 per maand over het interval 2-6.',
      antwoord_rubric:'1 punt: bij maand 6 loopt de grafiek steiler dan de koorde. 1 punt: dus de toename in maand 6 is groter dan de gemiddelde 175 per maand.' },
    // ── Opgave 6 · Kruistabel ──
    { nr:12, opgave:6, punten:2, type:'open', domein:'Statistiek',
      vraag:'Je kiest willekeurig één van de 200 leerlingen. Bereken de kans dat deze leerling een bijbaan heeft, en de kans dat een leerling een bijbaan heeft gegeven dat het een havoleerling is.',
      antwoord:'P(bijbaan) = 112 ÷ 200 = 0,56. P(bijbaan | havo) = 72 ÷ 120 = 0,60.',
      antwoord_rubric:'1 punt: P(bijbaan) = 112/200 = 0,56. 1 punt: P(bijbaan | havo) = 72/120 = 0,60.' },
    { nr:13, opgave:6, punten:2, type:'open', domein:'Statistiek',
      vraag:'Onderzoek met een berekening of het hebben van een bijbaan onafhankelijk is van het niveau (havo of vwo).',
      antwoord:'P(bijbaan | havo) = 72/120 = 0,60 en P(bijbaan | vwo) = 40/80 = 0,50. Deze kansen zijn niet gelijk (0,60 ≠ 0,50), dus het hebben van een bijbaan hangt samen met het niveau: ze zijn niet onafhankelijk.',
      antwoord_rubric:'1 punt: P(bijbaan|havo) = 0,60 én P(bijbaan|vwo) = 0,50 berekenen. 1 punt: conclusie ongelijk → niet onafhankelijk (er is een verband).' },
  ],
};
