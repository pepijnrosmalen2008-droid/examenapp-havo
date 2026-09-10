// ═══════════════════════════════════════════════════════════════════════
// proefexamen-na.js, ORIGINEEL Slagio-proefexamen in examenstijl (havo na).
// Eigen contexten, vragen en figuren. Géén reproductie van een CvTE-examen.
// CE-niveau: aflezen uit grafieken, rekenen met formules (BINAS-stijl) en
// natuurkundig redeneren. Elke opgave heeft een grafiek/schema. Meervoudige
// nakijkrubric per vraag. g = 9,81 N/kg.
//   opgaven[] = {nr,titel,context,afb,afb_cap}
//   vragen[]  = {nr,opgave,punten,type,vraag,antwoord,antwoord_rubric,domein}
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.havo = SLAGIO_EXAMENS.havo || {};

var _NAAFB = {
  // v-t grafiek: eerst eenparig versnellen, dan constante snelheid
  vt:`<svg viewBox="0 0 360 200" role="img" aria-label="snelheid-tijd grafiek"><g stroke="#e6e9ef" stroke-width="1">${Array.from({length:5},(_,i)=>{var y=150-i*30;return '<line x1="52" y1="'+y+'" x2="336" y2="'+y+'"/>';}).join('')}${Array.from({length:6},(_,i)=>{var x=52+i*48;return '<line x1="'+x+'" y1="14" x2="'+x+'" y2="150"/>';}).join('')}</g><line x1="52" y1="14" x2="52" y2="150" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/><line x1="52" y1="150" x2="340" y2="150" stroke="#1b2230" stroke-width="2"/><path d="M340 150 L330 146 L330 154 Z" fill="#1b2230"/><polyline points="52,150 196,60 336,60" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/><g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="end">${[0,5,10,15,20].map((v,i)=>'<text x="46" y="'+(154-i*30)+'">'+v+'</text>').join('')}</g><g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="middle">${[0,2,4,6,8,10].map((t,i)=>'<text x="'+(52+i*48)+'" y="166">'+t+'</text>').join('')}</g><text x="0" y="0" transform="translate(18,120) rotate(-90)" font-family="sans-serif" font-size="10" font-weight="700" fill="#1b2230" text-anchor="middle">snelheid (m/s)</text><text x="300" y="184" font-family="sans-serif" font-size="10" font-weight="700" fill="#1b2230" text-anchor="middle">tijd (s)</text></svg>`,
  // F-u grafiek van een veer (rechte lijn door de oorsprong)
  veer:`<svg viewBox="0 0 360 200" role="img" aria-label="kracht-uitrekking grafiek van een veer"><g stroke="#e6e9ef" stroke-width="1">${Array.from({length:5},(_,i)=>{var y=150-i*30;return '<line x1="52" y1="'+y+'" x2="336" y2="'+y+'"/>';}).join('')}${Array.from({length:6},(_,i)=>{var x=52+i*48;return '<line x1="'+x+'" y1="14" x2="'+x+'" y2="150"/>';}).join('')}</g><line x1="52" y1="14" x2="52" y2="150" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/><line x1="52" y1="150" x2="340" y2="150" stroke="#1b2230" stroke-width="2"/><path d="M340 150 L330 146 L330 154 Z" fill="#1b2230"/><line x1="52" y1="150" x2="300" y2="30" stroke="#e8580c" stroke-width="3"/><line x1="196" y1="90" x2="52" y2="90" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><line x1="196" y1="90" x2="196" y2="150" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="end">${[0,1,2,3,4].map((v,i)=>'<text x="46" y="'+(154-i*30)+'">'+v+'</text>').join('')}</g><g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="middle">${[0,2,4,6,8,10].map((t,i)=>'<text x="'+(52+i*48)+'" y="166">'+t+'</text>').join('')}</g><text x="0" y="0" transform="translate(18,110) rotate(-90)" font-family="sans-serif" font-size="10" font-weight="700" fill="#1b2230" text-anchor="middle">kracht (N)</text><text x="300" y="184" font-family="sans-serif" font-size="10" font-weight="700" fill="#1b2230" text-anchor="middle">uitrekking (cm)</text></svg>`,
  // Baan met hoogteverschil (skateboard): A hoog, B laag
  baan:`<svg viewBox="0 0 360 190" role="img" aria-label="baan met hoogteverschil van punt A naar punt B"><path d="M40 40 C90 40 120 150 200 150 L330 150" fill="none" stroke="#1b2230" stroke-width="3" stroke-linecap="round"/><line x1="40" y1="150" x2="40" y2="40" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><g stroke="#2563eb" stroke-width="1.3"><line x1="26" y1="150" x2="26" y2="40"/><path d="M22 46 L26 38 L30 46"/><path d="M22 144 L26 152 L30 144"/></g><text x="10" y="98" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#2563eb" transform="rotate(-90 10 98)" text-anchor="middle">h = 1,8 m</text><circle cx="46" cy="34" r="8" fill="#e8580c"/><text x="60" y="34" font-family="sans-serif" font-size="12" font-weight="700" fill="#1b2230">A</text><circle cx="250" cy="144" r="8" fill="#e8580c" opacity="0.35"/><text x="250" y="172" font-family="sans-serif" font-size="12" font-weight="700" fill="#1b2230" text-anchor="middle">B</text><line x1="40" y1="150" x2="330" y2="150" stroke="#8a94a8" stroke-width="1" stroke-dasharray="2 3"/></svg>`,
  // Schakelschema: batterij + 2 weerstanden in serie + ampèremeter
  schakeling:`<svg viewBox="0 0 360 190" role="img" aria-label="schakelschema met twee weerstanden in serie"><g stroke="#1b2230" stroke-width="2" fill="none"><line x1="70" y1="46" x2="290" y2="46"/><line x1="290" y1="46" x2="290" y2="150"/><line x1="290" y1="150" x2="70" y2="150"/><line x1="70" y1="150" x2="70" y2="46"/></g><rect x="128" y="36" width="46" height="20" fill="#fff" stroke="#1b2230" stroke-width="2"/><text x="151" y="30" font-family="sans-serif" font-size="11" font-weight="700" fill="#1b2230" text-anchor="middle">R&#8321;</text><rect x="280" y="78" width="20" height="46" fill="#fff" stroke="#1b2230" stroke-width="2"/><text x="318" y="105" font-family="sans-serif" font-size="11" font-weight="700" fill="#1b2230" text-anchor="middle">R&#8322;</text><rect x="60" y="86" width="20" height="30" fill="#fff"/><g stroke="#1b2230" stroke-width="2"><line x1="56" y1="92" x2="84" y2="92"/><line x1="64" y1="102" x2="76" y2="102"/><line x1="56" y1="112" x2="84" y2="112"/></g><text x="40" y="105" font-family="sans-serif" font-size="11" font-weight="700" fill="#1b2230" text-anchor="middle">12 V</text><circle cx="180" cy="150" r="13" fill="#fff" stroke="#1b2230" stroke-width="2"/><text x="180" y="155" font-family="sans-serif" font-size="12" font-weight="700" fill="#1b2230" text-anchor="middle">A</text></svg>`,
  // Oscilloscoopbeeld: twee tonen (verschillende toonhoogte)
  oscilloscoop:`<svg viewBox="0 0 360 190" role="img" aria-label="oscilloscoopbeeld met twee geluidstrillingen"><rect x="40" y="20" width="296" height="150" fill="#0e1524" stroke="#1b2230" stroke-width="1.5"/><g stroke="#243049" stroke-width="1">${Array.from({length:9},(_,i)=>'<line x1="'+(40+i*37)+'" y1="20" x2="'+(40+i*37)+'" y2="170"/>').join('')}${Array.from({length:4},(_,i)=>'<line x1="40" y1="'+(20+i*50)+'" x2="336" y2="'+(20+i*50)+'"/>').join('')}</g><path d="M40 95 ${Array.from({length:60},(_,i)=>{var x=40+i*5;var y=95-38*Math.sin(i*5/296*2*Math.PI*2);return 'L'+x.toFixed(0)+' '+y.toFixed(1);}).join(' ')}" fill="none" stroke="#e8580c" stroke-width="2.4"/><path d="M40 95 ${Array.from({length:60},(_,i)=>{var x=40+i*5;var y=95-38*Math.sin(i*5/296*2*Math.PI*4);return 'L'+x.toFixed(0)+' '+y.toFixed(1);}).join(' ')}" fill="none" stroke="#38bdf8" stroke-width="2.4"/><g font-family="sans-serif" font-size="10" font-weight="700"><text x="46" y="184" fill="#e8580c">toon 1</text><text x="110" y="184" fill="#38bdf8">toon 2</text><text x="336" y="184" fill="#4a5568" text-anchor="end">1 hokje = 1 ms</text></g></svg>`,
  // Verval: activiteit tegen tijd met halveringstijd
  verval:`<svg viewBox="0 0 360 196" role="img" aria-label="activiteit tegen tijd met halveringstijd"><line x1="52" y1="14" x2="52" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/><line x1="52" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M344 158 L334 154 L334 162 Z" fill="#1b2230"/><path d="M52 30 Q92 96 132 116 Q172 132 212 142 Q252 150 332 154" fill="none" stroke="#2e9e5b" stroke-width="3" stroke-linecap="round"/><g stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"><line x1="52" y1="30" x2="92" y2="30"/><line x1="52" y1="73" x2="132" y2="73"/><line x1="92" y1="30" x2="92" y2="158"/><line x1="132" y1="73" x2="132" y2="158"/></g><g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="end"><text x="46" y="34">800</text><text x="46" y="77">400</text></g><g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="middle"><text x="92" y="172">5</text><text x="132" y="172">10</text></g><text x="0" y="0" transform="translate(18,120) rotate(-90)" font-family="sans-serif" font-size="10" font-weight="700" fill="#1b2230" text-anchor="middle">activiteit (Bq)</text><text x="300" y="188" font-family="sans-serif" font-size="10" font-weight="700" fill="#1b2230" text-anchor="middle">tijd (uur)</text></svg>`,
};

SLAGIO_EXAMENS.havo.na = {
  origineel: true,
  titel: 'Natuurkunde',
  niveau: 'havo',
  jaar: new Date().getFullYear(),
  duur_minuten: 100,
  max_punten: 34,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Optrekkende tram',
      context:'Een tram vertrekt bij een halte. Afbeelding 1 is het (v,t)-diagram van de tram: hij trekt eerst eenparig op en rijdt daarna met constante snelheid verder.',
      afb:_NAAFB.vt, afb_cap:'afbeelding 1: het (v,t)-diagram van de tram' },
    { nr:2, titel:'Een veer testen',
      context:'Een leerling hangt steeds zwaardere gewichtjes aan een veer en meet de uitrekking. Afbeelding 2 toont de kracht op de veer tegen de uitrekking.',
      afb:_NAAFB.veer, afb_cap:'afbeelding 2: kracht op de veer tegen de uitrekking' },
    { nr:3, titel:'De skatebaan',
      context:'Een skater met massa 60 kg start in rust boven in een baan (punt A) en rolt naar het laagste punt (B). Het hoogteverschil is 1,8 m (afbeelding 3). De wrijving verwaarlozen we. Neem g = 9,81 N/kg.',
      afb:_NAAFB.baan, afb_cap:'afbeelding 3: de baan van A naar B' },
    { nr:4, titel:'Twee lampjes',
      context:'In de schakeling van afbeelding 4 staan twee weerstanden R₁ = 6 Ω en R₂ = 4 Ω in serie op een bron van 12 V. De ampèremeter meet de stroomsterkte.',
      afb:_NAAFB.schakeling, afb_cap:'afbeelding 4: het schakelschema (R₁ en R₂ in serie)' },
    { nr:5, titel:'Geluid op de oscilloscoop',
      context:'Twee zuivere tonen worden op een oscilloscoop bekeken. Afbeelding 5 toont beide trillingen; één hokje op de horizontale as komt overeen met 1 ms (1 milliseconde).',
      afb:_NAAFB.oscilloscoop, afb_cap:'afbeelding 5: twee tonen op de oscilloscoop' },
    { nr:6, titel:'Radioactief verval',
      context:'Een ziekenhuis gebruikt een radioactieve stof. Afbeelding 6 toont de activiteit (in becquerel) van een monster tegen de tijd.',
      afb:_NAAFB.verval, afb_cap:'afbeelding 6: activiteit van het monster tegen de tijd' },
  ],
  vragen: [
    // ── Opgave 1 · Beweging ──
    { nr:1, opgave:1, punten:2, type:'open', domein:'Beweging',
      vraag:'Bepaal met afbeelding 1 de versnelling van de tram tijdens het optrekken. Laat je berekening zien.',
      antwoord:'In de eerste 6 s neemt de snelheid toe van 0 tot 15 m/s. a = Δv/Δt = 15 m/s ÷ 6 s = 2,5 m/s².',
      antwoord_rubric:'1 punt: aflezen Δv = 15 m/s in Δt = 6 s (of gelijkwaardig). 1 punt: a = Δv/Δt = 2,5 m/s².' },
    { nr:2, opgave:1, punten:3, type:'open', domein:'Beweging',
      vraag:'Bepaal de totale afstand die de tram in de eerste 10 seconden aflegt. Gebruik het oppervlak onder de grafiek.',
      antwoord:'De afstand is het oppervlak onder de (v,t)-lijn. Optrekken (0-6 s): driehoek ½ · 6 · 15 = 45 m. Constante snelheid (6-10 s): rechthoek 4 · 15 = 60 m. Totaal = 45 + 60 = 105 m.',
      antwoord_rubric:'1 punt: afstand = oppervlak onder de grafiek. 1 punt: driehoek 45 m én rechthoek 60 m (of gelijkwaardig). 1 punt: totaal 105 m.' },
    { nr:3, opgave:1, punten:2, type:'open', domein:'Beweging',
      vraag:'Na 6 s rijdt de tram met constante snelheid. Leg met de eerste wet van Newton uit wat je hieruit kunt afleiden over de resulterende kracht op de tram in dat deel.',
      antwoord:'Bij constante snelheid (eenparige beweging) is er geen versnelling. Volgens de eerste wet van Newton is de resulterende (netto) kracht op de tram dan nul: de voorwaartse kracht van de motor en de tegenwerkende krachten (wrijving/luchtweerstand) zijn in evenwicht.',
      antwoord_rubric:'1 punt: constante snelheid → geen versnelling → resulterende kracht = 0. 1 punt: koppeling aan de eerste wet van Newton / krachtenevenwicht.' },
    // ── Opgave 2 · Kracht ──
    { nr:4, opgave:2, punten:3, type:'open', domein:'Kracht',
      vraag:'Bepaal met afbeelding 2 de veerconstante van deze veer in N/m. Laat je berekening zien.',
      antwoord:'De lijn gaat recht door de oorsprong: F = C·u. Bij u = 4 cm = 0,04 m hoort F = 2 N (aflezen via de stippellijnen). C = F/u = 2 N ÷ 0,04 m = 50 N/m.',
      antwoord_rubric:'1 punt: een bijbehorend punt aflezen (bv. 2 N bij 4 cm). 1 punt: u omrekenen naar meter (0,04 m). 1 punt: C = F/u = 50 N/m.' },
    { nr:5, opgave:2, punten:2, type:'open', domein:'Kracht',
      vraag:'De lijn in afbeelding 2 is recht en gaat door de oorsprong. Leg uit welk natuurkundig verband hieruit blijkt en wat er met de grafiek zou gebeuren als de veer te ver wordt uitgerekt (voorbij de veergrens).',
      antwoord:'De rechte lijn door de oorsprong laat zien dat de kracht recht evenredig is met de uitrekking (de wet van Hooke: F = C·u). Voorbij de veergrens geldt dit niet meer: de lijn zou afbuigen (geen rechte lijn meer) en de veer vervormt blijvend, waardoor hij niet meer in de oude vorm terugkeert.',
      antwoord_rubric:'1 punt: recht evenredig verband / wet van Hooke (F = C·u). 1 punt: voorbij de veergrens buigt de grafiek af / de veer rekt blijvend uit.' },
    // ── Opgave 3 · Energie ──
    { nr:6, opgave:3, punten:2, type:'open', domein:'Energie',
      vraag:'Bereken de zwaarte-energie van de skater in punt A ten opzichte van punt B.',
      antwoord:'Ez = m·g·h = 60 kg · 9,81 N/kg · 1,8 m = 1,06 × 10³ J ≈ 1,1 kJ.',
      antwoord_rubric:'1 punt: formule Ez = m·g·h met de juiste waarden. 1 punt: Ez ≈ 1,06 × 10³ J (≈ 1,1 kJ).' },
    { nr:7, opgave:3, punten:3, type:'open', domein:'Energie',
      vraag:'Bereken de snelheid van de skater in punt B. Ga uit van behoud van energie en licht toe waarom je de zwaarte-energie gelijk mag stellen aan de kinetische energie.',
      antwoord:'Zonder wrijving geldt behoud van energie: alle zwaarte-energie in A is in B omgezet in kinetische energie (in A staat hij stil, dus Ek = 0; in B is h = 0, dus Ez = 0). Dus Ez,A = Ek,B: m·g·h = ½·m·v². De massa valt weg: v = √(2·g·h) = √(2 · 9,81 · 1,8) = √35,3 = 5,9 m/s.',
      antwoord_rubric:'1 punt: behoud van energie → Ez wordt volledig Ek (Ek,A = 0 en Ez,B = 0). 1 punt: opstellen m·g·h = ½·m·v² (massa valt weg). 1 punt: v = √(2gh) ≈ 5,9 m/s.' },
    // ── Opgave 4 · Elektriciteit ──
    { nr:8, opgave:4, punten:3, type:'open', domein:'Elektriciteit',
      vraag:'Bereken de stroomsterkte die de ampèremeter aanwijst.',
      antwoord:'Bij serieschakeling tel je de weerstanden op: Rv = R₁ + R₂ = 6 + 4 = 10 Ω. Met de wet van Ohm: I = U/R = 12 V ÷ 10 Ω = 1,2 A.',
      antwoord_rubric:'1 punt: vervangingsweerstand serie Rv = 6 + 4 = 10 Ω. 1 punt: I = U/R. 1 punt: I = 1,2 A.' },
    { nr:9, opgave:4, punten:2, type:'open', domein:'Elektriciteit',
      vraag:'Bereken de spanning over R₁.',
      antwoord:'In een serieschakeling loopt door elke weerstand dezelfde stroom (1,2 A). U₁ = I · R₁ = 1,2 A · 6 Ω = 7,2 V.',
      antwoord_rubric:'1 punt: dezelfde stroom door R₁ (1,2 A) en U₁ = I·R₁. 1 punt: U₁ = 7,2 V.' },
    { nr:10, opgave:4, punten:2, type:'open', domein:'Elektriciteit',
      vraag:'Leg uit wat er met de stroomsterkte gebeurt als je R₂ vervangt door een grotere weerstand, en waarom.',
      antwoord:'Een grotere R₂ maakt de vervangingsweerstand Rv groter. Bij dezelfde bronspanning van 12 V geldt I = U/Rv, dus als Rv groter wordt, wordt de stroomsterkte I kleiner.',
      antwoord_rubric:'1 punt: grotere R₂ → grotere vervangingsweerstand. 1 punt: bij gelijke spanning wordt I = U/R kleiner.' },
    // ── Opgave 5 · Geluid ──
    { nr:11, opgave:5, punten:3, type:'open', domein:'Geluid',
      vraag:'Toon 1 (oranje) doorloopt één volledige trilling in 4 hokjes. Bepaal de trillingstijd én de frequentie van toon 1. Laat je berekening zien.',
      antwoord:'Eén hokje = 1 ms, dus 4 hokjes = 4 ms. De trillingstijd T = 4 ms = 4 × 10⁻³ s. De frequentie f = 1/T = 1 ÷ (4 × 10⁻³) = 250 Hz.',
      antwoord_rubric:'1 punt: T = 4 ms = 4 × 10⁻³ s aflezen. 1 punt: f = 1/T. 1 punt: f = 250 Hz.' },
    { nr:12, opgave:5, punten:2, type:'open', domein:'Geluid',
      vraag:'Vergelijk toon 2 (blauw) met toon 1. Leg uit welke van de twee tonen je als de hoogste toon hoort en waaraan je dat in afbeelding 5 ziet.',
      antwoord:'Toon 2 heeft in dezelfde tijd meer trillingen (kortere trillingstijd), dus een hogere frequentie dan toon 1. Een hogere frequentie hoor je als een hogere toon. Je ziet dit doordat de blauwe golf dichter op elkaar staat (meer golven per hokje) dan de oranje.',
      antwoord_rubric:'1 punt: toon 2 heeft een hogere frequentie (kortere trillingstijd / meer golven). 1 punt: hogere frequentie = hogere toon, afgelezen uit de dichtere golf.' },
    // ── Opgave 6 · Straling ──
    { nr:13, opgave:6, punten:2, type:'open', domein:'Straling',
      vraag:'Bepaal met afbeelding 6 de halveringstijd van deze stof.',
      antwoord:'De activiteit daalt van 800 Bq naar 400 Bq (de helft) in 5 uur (aflezen via de stippellijnen). De halveringstijd is dus 5 uur.',
      antwoord_rubric:'1 punt: aflezen dat de activiteit halveert van 800 naar 400 Bq. 1 punt: dit gebeurt in 5 uur → halveringstijd = 5 uur.' },
    { nr:14, opgave:6, punten:3, type:'open', domein:'Straling',
      vraag:'Bereken hoeveel becquerel het monster nog heeft na 15 uur, en leg uit waarom de activiteit steeds langzamer daalt.',
      antwoord:'15 uur is 3 × de halveringstijd (3 × 5 uur). Na elke halveringstijd halveert de activiteit: 800 → 400 → 200 → 100 Bq. Na 15 uur is de activiteit dus 100 Bq. De activiteit daalt steeds langzamer omdat er per halveringstijd steeds minder kernen over zijn die kunnen vervallen; een vast percentage van een steeds kleiner aantal levert een steeds kleinere afname op (exponentieel verval).',
      antwoord_rubric:'1 punt: 15 uur = 3 halveringstijden. 1 punt: 800 → 400 → 200 → 100 Bq. 1 punt: uitleg dat er per keer minder kernen over zijn → steeds kleinere afname (exponentieel).' },
  ],
};
