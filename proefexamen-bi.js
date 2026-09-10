// ═══════════════════════════════════════════════════════════════════════
// proefexamen-bi.js — ORIGINEEL Slagio-proefexamen in examenstijl (havo bio).
// Eigen contexten, vragen en figuren. Géén reproductie van een CvTE-examen.
// Vraagstelling op CE-niveau: toepassen, redeneren en gegevens aflezen —
// niet louter reproduceren. Elke opgave heeft een figuur (grafiek/diagram).
//   opgaven[] = {nr,titel,context,afb,afb_cap}
//   vragen[]  = {nr,opgave,punten,type,vraag,antwoord,antwoord_rubric,domein,
//                afb?/afb_cap? (optionele vraag-eigen extra figuur)}
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.havo = SLAGIO_EXAMENS.havo || {};

// Pijlpuntassen (herbruikbaar): y-as x=52 (14..158), x-as y=158 (52..344)
function _biAx(){
  return '<line x1="52" y1="14" x2="52" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/>'+
         '<line x1="52" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M344 158 L334 154 L334 162 Z" fill="#1b2230"/>';
}
function _biGridY(ys){ return ys.map(y=>'<line x1="52" y1="'+y+'" x2="340" y2="'+y+'" stroke="#eef1f5" stroke-width="1"/>').join(''); }

var _BIAFB = {
  // Hartfrequentie vs tijd — pijlpuntassen, gridlines, afleesbare bpm-schaal, fasen
  hart:(function(){
    var sy=function(v){return 158-(v-40)/160*128;}; // 40..200 bpm
    var yl=[60,100,140,180].map(v=>'<line x1="52" y1="'+sy(v).toFixed(1)+'" x2="340" y2="'+sy(v).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="47" y="'+(sy(v)+3).toFixed(1)+'" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="end">'+v+'</text>').join('');
    var line='<polyline points="56,'+sy(72).toFixed(1)+' 110,'+sy(72).toFixed(1)+' 174,'+sy(168).toFixed(1)+' 246,'+sy(168).toFixed(1)+' 322,'+sy(96).toFixed(1)+'" fill="none" stroke="#e8580c" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
    var seps='<g stroke="#c9cfda" stroke-width="1" stroke-dasharray="3 4"><line x1="120" y1="24" x2="120" y2="158"/><line x1="232" y1="24" x2="232" y2="158"/></g>';
    return '<svg viewBox="0 0 360 196" role="img" aria-label="hartfrequentie tegen de tijd">'+yl+_biAx()+seps+line+'<g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="middle"><text x="86" y="172">rust</text><text x="176" y="172">inspanning</text><text x="288" y="172">herstel</text></g><text x="0" y="0" transform="translate(16,96) rotate(-90)" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">hartslag (per min)</text><text x="300" y="190" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">tijd</text></svg>';
  })(),
  // CO2-productie vs temperatuur (optimum 35°C) — pijlpuntassen, gridlines, x-ticks
  gisttemp:(function(){
    var sx=function(t){return 60+t/50*272;};
    var peak=sx(35);
    var yl=_biGridY([126,94,62,30]);
    var xt=[0,10,20,30,40,50].map(t=>'<text x="'+sx(t).toFixed(0)+'" y="172" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">'+t+'</text>').join('');
    var curve='<path d="M'+sx(0)+' 152 Q'+sx(18)+' 148 '+sx(28)+' 96 Q'+sx(34)+' 44 '+peak.toFixed(0)+' 44 Q'+sx(40)+' 44 '+sx(44)+' 116 L'+sx(50)+' 154" fill="none" stroke="#e8580c" stroke-width="3" stroke-linecap="round"/>';
    return '<svg viewBox="0 0 360 196" role="img" aria-label="CO2-productie tegen temperatuur">'+yl+_biAx()+curve+'<line x1="'+peak.toFixed(0)+'" y1="44" x2="'+peak.toFixed(0)+'" y2="158" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><text x="'+peak.toFixed(0)+'" y="172" font-family="sans-serif" font-size="9" font-weight="700" fill="#1b2230" text-anchor="middle">35</text>'+xt+'<text x="0" y="0" transform="translate(16,96) rotate(-90)" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">CO&#8322;-productie</text><text x="250" y="190" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">temperatuur (&#176;C)</text></svg>';
  })(),
  // Energiepiramide — met verlopen per trofisch niveau + energie-pijl
  piramide:`<svg viewBox="0 0 360 200" role="img" aria-label="energiepiramide van de sloot"><defs><linearGradient id="biPy" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#d7efdd"/><stop offset="1" stop-color="#3aa06e"/></linearGradient></defs><polygon points="44,174 316,174 282,136 78,136" fill="#d3ecda" stroke="#1b2230" stroke-width="1.4"/><polygon points="78,136 282,136 248,98 112,98" fill="#a9d8b8" stroke="#1b2230" stroke-width="1.4"/><polygon points="112,98 248,98 214,60 146,60" fill="#72c295" stroke="#1b2230" stroke-width="1.4"/><polygon points="146,60 214,60 197,26 163,26" fill="#3aa06e" stroke="#1b2230" stroke-width="1.4"/><g font-family="sans-serif" font-size="11" fill="#1b2230" text-anchor="middle" font-weight="700"><text x="180" y="159">algen</text><text x="180" y="121">watervlooien</text><text x="180" y="83">visjes</text><text x="181" y="47" fill="#fff">snoek</text></g><g stroke="#1b2230" stroke-width="1.6" fill="none"><path d="M340 170 L340 34"/><path d="M336 44 L340 32 L344 44"/></g><text x="354" y="104" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#4a5568" transform="rotate(-90 354 104)" text-anchor="middle">energie neemt af</text></svg>`,
  // Kruisingsschema (Punnett) Zz × zz — strakker, met kopcellen
  punnett:`<svg viewBox="0 0 280 210" role="img" aria-label="leeg kruisingsschema om in te vullen"><text x="150" y="18" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#1b2230">kruisingsschema  Zz &#215; zz</text><text x="150" y="40" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#4a5568">gameten van zz</text><text x="0" y="0" transform="translate(28 140) rotate(-90)" font-family="sans-serif" font-size="10" fill="#4a5568" text-anchor="middle">gameten van Zz</text><g stroke="#1b2230" stroke-width="1.6" fill="none"><rect x="78" y="50" width="160" height="150"/></g><rect x="78" y="50" width="160" height="34" fill="#eef4ff"/><rect x="78" y="50" width="52" height="150" fill="#eef4ff"/><rect x="78" y="50" width="52" height="34" fill="#dfe8fb"/><g stroke="#1b2230" stroke-width="1.4" fill="none"><line x1="78" y1="84" x2="238" y2="84"/><line x1="78" y1="142" x2="238" y2="142"/><line x1="130" y1="50" x2="130" y2="200"/><line x1="184" y1="50" x2="184" y2="200"/></g><g font-family="Georgia,serif" font-size="13" font-weight="700" fill="#3a4a63" text-anchor="middle"><text x="157" y="72">z</text><text x="211" y="72">z</text><text x="104" y="118">Z</text><text x="104" y="176">z</text></g></svg>`,
  // Antistofconcentratie na 1e/2e blootstelling — pijlpuntassen, gridlines, markers
  afweer:`<svg viewBox="0 0 360 196" role="img" aria-label="antistofconcentratie na eerste en tweede blootstelling">${_biGridY([126,94,62,30])}${_biAx()}<path d="M70 154 Q108 150 128 122 Q146 104 162 124 Q182 148 205 152" fill="none" stroke="#e8580c" stroke-width="2.8"/><path d="M205 152 Q214 52 242 36 Q266 24 286 54 Q306 88 332 116" fill="none" stroke="#2e9e5b" stroke-width="3"/><g stroke="#1b2230" stroke-width="1.3"><line x1="70" y1="158" x2="70" y2="168"/><line x1="205" y1="158" x2="205" y2="168"/></g><g font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle"><text x="70" y="180">1e blootstelling</text><text x="205" y="180">2e blootstelling</text></g><g font-family="sans-serif" font-size="9" font-weight="700"><text x="150" y="150" fill="#e8580c">1e reactie</text><text x="250" y="30" fill="#2e9e5b">2e reactie</text></g><text x="0" y="0" transform="translate(16,90) rotate(-90)" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">antistofconcentratie</text><text x="308" y="150" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230">tijd</text></svg>`,
  // Proefopstelling waterpest + lamp — nettere lamp, bekerglas, belletjes, maatlat
  opstelling:`<svg viewBox="0 0 360 176" role="img" aria-label="proefopstelling met lamp en waterpest"><defs><radialGradient id="biLamp" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff7cf"/><stop offset="1" stop-color="#f2c744"/></radialGradient></defs><g stroke="#f0b400" stroke-width="2.4" stroke-linecap="round"><line x1="30" y1="40" x2="22" y2="30"/><line x1="20" y1="60" x2="8" y2="60"/><line x1="30" y1="80" x2="22" y2="90"/></g><circle cx="52" cy="60" r="21" fill="url(#biLamp)" stroke="#1b2230" stroke-width="1.8"/><rect x="45" y="80" width="14" height="10" fill="#cbd2e0" stroke="#1b2230" stroke-width="1.4"/><g stroke="#1b2230" stroke-width="1.5" fill="none"><line x1="82" y1="128" x2="250" y2="128"/><path d="M89 123 L81 128 L89 133"/><path d="M243 123 L251 128 L243 133"/></g><text x="166" y="120" font-family="sans-serif" font-size="10" fill="#4a5568" text-anchor="middle" font-weight="700">afstand tot de lamp</text><path d="M262 34 L262 140 Q262 154 276 154 L318 154 Q332 154 332 140 L332 34" fill="#e7f4ff" stroke="#1b2230" stroke-width="2"/><line x1="262" y1="52" x2="332" y2="52" stroke="#9cc7ea" stroke-width="1.3"/><path d="M297 150 L297 74" stroke="#2e9e5b" stroke-width="3.4" stroke-linecap="round"/><g fill="#2e9e5b"><ellipse cx="289" cy="90" rx="8" ry="3.6" transform="rotate(-28 289 90)"/><ellipse cx="305" cy="104" rx="8" ry="3.6" transform="rotate(28 305 104)"/><ellipse cx="289" cy="118" rx="8" ry="3.6" transform="rotate(-28 289 118)"/></g><g fill="#eaf4ff" stroke="#6aa6e0" stroke-width="1.3"><circle cx="309" cy="82" r="3.4"/><circle cx="314" cy="66" r="2.6"/><circle cx="309" cy="52" r="2.1"/></g></svg>`,
  // Fotosynthesesnelheid vs lichtsterkte (plateau) — pijlpuntassen, gridlines
  fotosynthese:`<svg viewBox="0 0 360 196" role="img" aria-label="fotosynthesesnelheid tegen lichtsterkte">${_biGridY([126,94,62,30])}${_biAx()}<path d="M56 150 Q112 150 152 96 Q192 52 250 50 L332 50" fill="none" stroke="#2e9e5b" stroke-width="3" stroke-linecap="round"/><line x1="250" y1="50" x2="250" y2="158" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><text x="250" y="172" font-family="sans-serif" font-size="9" font-weight="700" fill="#1b2230" text-anchor="middle">plateau</text><text x="0" y="0" transform="translate(16,96) rotate(-90)" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">fotosynthesesnelheid</text><text x="250" y="190" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">lichtsterkte</text></svg>`,
};

SLAGIO_EXAMENS.havo.bi = {
  origineel: true,
  titel: 'Biologie',
  niveau: 'havo',
  jaar: new Date().getFullYear(),
  duur_minuten: 100,
  max_punten: 53,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Hardlopen',
      context:'Isa doet een looptest. In afbeelding 1 is haar hartfrequentie weergegeven vóór, tijdens en na de inspanning. Tijdens het hardlopen verbruiken haar beenspieren veel meer energie dan in rust.',
      afb:_BIAFB.hart, afb_cap:'afbeelding 1 — hartfrequentie vóór, tijdens en na de inspanning' },
    { nr:2, titel:'Deeg dat rijst',
      context:'Een bakker onderzoekt hoe snel deeg rijst bij verschillende temperaturen. De rijssnelheid hangt af van de hoeveelheid koolstofdioxide die de gistcellen per minuut vormen. In afbeelding 2 staat het resultaat. In het deeg is weinig zuurstof aanwezig.',
      afb:_BIAFB.gisttemp, afb_cap:'afbeelding 2 — CO₂-productie van gist bij verschillende temperaturen' },
    { nr:3, titel:'De sloot',
      context:'In een sloot leven algen, watervlooien, kleine visjes en snoeken. De boer bemest het naastgelegen weiland. Afbeelding 3 toont de energiepiramide van deze sloot.',
      afb:_BIAFB.piramide, afb_cap:'afbeelding 3 — energiepiramide van de sloot' },
    { nr:4, titel:'Cavia\'s',
      context:'Bij cavia\'s is een zwarte vacht (allel Z) dominant over een witte vacht (allel z). Een kweker kruist een zwarte cavia met genotype Zz met een witte cavia (zz). Gebruik het lege kruisingsschema in afbeelding 4.',
      afb:_BIAFB.punnett, afb_cap:'afbeelding 4 — vul het kruisingsschema zelf in' },
    { nr:5, titel:'Afweer en vaccinatie',
      context:'Bij een griepcampagne krijgen mensen een vaccin met onschadelijk gemaakte delen van het griepvirus (antigenen). Afbeelding 5 toont de antistofconcentratie in het bloed na een eerste en een tweede blootstelling aan hetzelfde antigeen.',
      afb:_BIAFB.afweer, afb_cap:'afbeelding 5 — antistofconcentratie na een eerste en tweede blootstelling' },
    { nr:6, titel:'Onderzoek naar fotosynthese',
      context:'Een leerling onderzoekt de invloed van lichtsterkte op de fotosynthesesnelheid van waterpest. Ze telt het aantal zuurstofbelletjes per minuut bij verschillende afstanden tussen de lamp en de plant (afbeelding 6).',
      afb:_BIAFB.opstelling, afb_cap:'afbeelding 6 — de proefopstelling' },
  ],
  vragen: [
    // ── Opgave 1 · Hardlopen ──
    { nr:1, opgave:1, punten:2, type:'open', domein:'A',
      vraag:'Bepaal met afbeelding 1 in welk deel van de test Isa per minuut de meeste zuurstof aan haar spieren levert. Onderbouw je keuze met een gegeven uit de grafiek én met de rol van het bloed.',
      antwoord:'Tijdens de inspanning. In dat deel is de hartfrequentie het hoogst (het plateau in de grafiek), dus wordt er per minuut het meeste bloed rondgepompt. Omdat het bloed de zuurstof naar de spieren transporteert, krijgen de spieren op dat moment de meeste zuurstof per minuut.',
      antwoord_rubric:'1 punt: inspanning, onderbouwd met de hoogste hartslag/plateau uit de grafiek. 1 punt: koppeling hoge hartslag → meer bloed per minuut → meer zuurstoftransport naar de spieren.' },
    { nr:2, opgave:1, punten:3, type:'open', domein:'O',
      vraag:'Leg uit hoe de toegenomen verbranding in de beenspieren ervoor zorgt dat Isa vanzelf sneller gaat ademen. Beschrijf de weg van prikkel tot reactie.',
      antwoord:'Door de toegenomen verbranding (celademhaling) produceren de spieren meer koolstofdioxide, dat in het bloed terechtkomt. De verhoogde CO₂-concentratie (lagere pH) wordt waargenomen door receptoren; deze prikkel gaat naar het ademhalingscentrum in de hersenen. Dat stuurt via zenuwen de ademhalingsspieren aan om sneller en dieper te ademen, waardoor meer CO₂ wordt afgevoerd en meer O₂ opgenomen.',
      antwoord_rubric:'1 punt: meer verbranding → meer CO₂ in het bloed. 1 punt: CO₂/pH wordt waargenomen (receptor) en doorgegeven aan het ademhalingscentrum. 1 punt: dat laat de ademhalingsspieren sneller/dieper werken (reactie).' },
    { nr:3, opgave:1, punten:3, type:'open', domein:'O',
      vraag:'Tijdens het hardlopen stroomt er meer bloed naar de beenspieren en tegelijk minder naar de darmen. Leg uit hoe het lichaam deze verdeling regelt en waarom dit nuttig is tijdens inspanning.',
      antwoord:'Het autonome (onwillekeurige) zenuwstelsel regelt de wijdte van de bloedvaten: de slagadertjes naar de beenspieren verwijden, terwijl die naar de darmen vernauwen. Zo gaat er meer bloed (met zuurstof en glucose) naar de spieren die op dat moment hard werken, en minder naar de darmen die tijdens het hardlopen even minder nodig hebben. Daardoor krijgen de spieren precies daar de brandstof en zuurstof die ze nodig hebben.',
      antwoord_rubric:'1 punt: regeling via het autonome zenuwstelsel (vaatverwijding/-vernauwing). 1 punt: meer bloed naar spieren, minder naar darmen. 1 punt: nut = spieren krijgen meer O₂/glucose waar het nodig is.' },
    { nr:4, opgave:1, punten:2, type:'open', domein:'M',
      vraag:'Bij een lange duurloop verbrandt Isa glucose vooral aeroob; bij een korte sprint deels anaeroob. Leg uit waarom de anaerobe afbraak veel minder energie per glucosemolecuul oplevert en noem de stof die zich daarbij ophoopt.',
      antwoord:'Bij de aerobe verbranding wordt glucose met zuurstof volledig afgebroken tot koolstofdioxide en water, waarbij veel energie vrijkomt. Bij de anaerobe afbraak (melkzuurgisting) is er te weinig zuurstof, waardoor glucose maar gedeeltelijk wordt afgebroken; er komt daardoor veel minder energie vrij en er hoopt melkzuur op.',
      antwoord_rubric:'1 punt: anaeroob wordt glucose maar gedeeltelijk/onvolledig afgebroken → minder energie. 1 punt: er hoopt melkzuur (lactaat) op.' },
    // ── Opgave 2 · Deeg dat rijst ──
    { nr:5, opgave:2, punten:2, type:'open', domein:'M',
      vraag:'Beschrijf met afbeelding 2 wat er met de CO₂-productie gebeurt als de temperatuur boven 35 °C stijgt, en verklaar dit op het niveau van de enzymen in de gistcel.',
      antwoord:'Boven 35 °C daalt de CO₂-productie snel (in de grafiek loopt de lijn na de top steil naar beneden). Dat komt doordat de enzymen die de gisting versnellen bij te hoge temperatuur denatureren: hun ruimtelijke structuur en actieve plaats veranderen onherstelbaar, waardoor ze het substraat niet meer omzetten.',
      antwoord_rubric:'1 punt: boven 35 °C neemt de CO₂-productie (sterk) af, afgelezen uit de grafiek. 1 punt: verklaring = enzymen denatureren bij te hoge temperatuur → geen omzetting meer.' },
    { nr:6, opgave:2, punten:2, type:'open', domein:'M',
      vraag:'In het zuurstofarme deeg zetten de gistcellen suiker om via alcoholgisting. Geef de woordvergelijking van alcoholgisting en leg met deze vergelijking uit waardoor het deeg rijst.',
      antwoord:'glucose → alcohol (ethanol) + koolstofdioxide + energie. Bij deze omzetting ontstaat koolstofdioxidegas; dat blijft als belletjes in het deeg zitten en zet uit, waardoor het volume toeneemt en het deeg rijst.',
      antwoord_rubric:'1 punt: correcte woordvergelijking (glucose → ethanol + CO₂ + energie). 1 punt: CO₂-gas blijft in het deeg → volume neemt toe → deeg rijst.' },
    { nr:7, opgave:2, punten:3, type:'open', domein:'M',
      vraag:'Deeg in de koelkast (4 °C) rijst nauwelijks, terwijl deeg in een warme kamer (28 °C) juist snel rijst. Verklaar dit verschil met behulp van afbeelding 2 en het begrip enzymwerking.',
      antwoord:'Volgens de grafiek is de CO₂-productie bij 4 °C laag en bij 28 °C veel hoger (dichter bij het optimum van 35 °C). Bij lage temperatuur bewegen de deeltjes langzaam en werken de enzymen traag, dus wordt er weinig CO₂ gevormd en rijst het deeg nauwelijks. Bij 28 °C werken de enzymen veel sneller, wordt er meer CO₂ gevormd en rijst het deeg snel.',
      antwoord_rubric:'1 punt: aflezen dat CO₂-productie bij 4 °C laag en bij 28 °C hoog is (grafiek). 1 punt: bij lage temperatuur werken de enzymen traag → weinig CO₂. 1 punt: bij 28 °C werken de enzymen sneller → meer CO₂ → sneller rijzen.' },
    { nr:8, opgave:2, punten:2, type:'open', domein:'M',
      vraag:'In de oven (220 °C) stopt het rijzen, maar krijgt het brood juist een luchtige structuur. Leg beide verschijnselen uit.',
      antwoord:'Bij 220 °C denatureren de enzymen van de gist volledig, dus stopt de CO₂-productie en daarmee het rijzen. De structuur wordt toch luchtig doordat het CO₂-gas dat al in het deeg zat door de hitte uitzet en het deeg omhoog duwt, waarna het deeg stevig wordt en de holtes behouden blijven.',
      antwoord_rubric:'1 punt: rijzen stopt doordat de enzymen bij 220 °C denatureren (geen CO₂-productie meer). 1 punt: luchtige structuur doordat het al aanwezige gas uitzet en de holtes blijven.' },
    // ── Opgave 3 · De sloot ──
    { nr:9, opgave:3, punten:3, type:'open', domein:'P',
      vraag:'Door een ziekte sterft in korte tijd bijna de hele populatie watervlooien uit de sloot. Beredeneer wat er kort daarna gebeurt met (a) de algen en (b) de kleine visjes. Betrek de voedselrelaties in je antwoord.',
      antwoord:'(a) De algen nemen toe: de watervlooien aten de algen, en nu die eter grotendeels weg is, wordt de algenpopulatie minder opgegeten en groeit. (b) De kleine visjes nemen af: zij aten de watervlooien, en doordat hun voedsel bijna weg is, is er te weinig voedsel en neemt hun aantal af.',
      antwoord_rubric:'1 punt: algen nemen toe, met reden (minder begrazing door watervlooien). 1 punt: visjes nemen af, met reden (minder voedsel/watervlooien). 1 punt: correcte koppeling aan de voedselrelaties (wie eet wie).' },
    { nr:10, opgave:3, punten:3, type:'open', domein:'P',
      vraag:'Door de bemesting spoelen extra stikstof en fosfaat in de sloot. Leg uit hoe dit uiteindelijk tot een zuurstoftekort leidt en waarom daardoor veel vissen kunnen sterven (eutrofiëring).',
      antwoord:'De extra voedingsstoffen zorgen voor een sterke algengroei (algenbloei). Wanneer die algen massaal afsterven, worden ze door bacteriën afgebroken; bij die afbraak verbruiken de bacteriën veel zuurstof. Daardoor daalt de zuurstofconcentratie in het water sterk, en omdat vissen zuurstof uit het water nodig hebben voor hun ademhaling, kunnen zij bij zo\'n tekort sterven.',
      antwoord_rubric:'1 punt: extra nutriënten → sterke algengroei. 1 punt: afbraak van dode algen door bacteriën verbruikt veel zuurstof. 1 punt: zuurstoftekort → vissen krijgen te weinig O₂ → sterfte.' },
    { nr:11, opgave:3, punten:2, type:'open', domein:'P',
      vraag:'Gebruik afbeelding 3. Leg uit waarom de biomassa van de snoeken zoveel kleiner is dan die van de algen. Gebruik in je antwoord het begrip energie.',
      antwoord:'De piramide wordt naar boven toe smaller omdat bij elke schakel energie verloren gaat, onder andere als warmte bij de dissimilatie en in niet-opgegeten of onverteerde delen. Daardoor blijft er voor elke volgende schakel steeds minder energie over, zodat de bovenste schakel (snoek) maar een kleine biomassa in stand kan houden.',
      antwoord_rubric:'1 punt: bij elke schakel gaat energie verloren (o.a. als warmte). 1 punt: daardoor minder energie/biomassa naar boven toe → kleine biomassa snoek.' },
    { nr:12, opgave:3, punten:2, type:'open', domein:'P',
      vraag:'De bacteriën die dode organismen afbreken zijn de reducenten. Leg uit waarom de kringloop van stoffen zonder reducenten zou vastlopen.',
      antwoord:'Reducenten breken dode resten en afvalstoffen af tot eenvoudige stoffen (zoals mineralen/voedingszouten). Zonder reducenten zouden die stoffen vastgelegd blijven in dode organismen en niet vrijkomen, waardoor de producenten (planten/algen) geen voedingsstoffen meer kunnen opnemen en de kringloop stopt.',
      antwoord_rubric:'1 punt: reducenten maken vastgelegde stoffen weer beschikbaar (afbraak tot mineralen). 1 punt: zonder hen komen die stoffen niet vrij → producenten krijgen geen voedingsstoffen → kringloop loopt vast.' },
    // ── Opgave 4 · Cavia's ──
    { nr:13, opgave:4, punten:2, type:'open', domein:'O',
      vraag:'Vul het kruisingsschema van afbeelding 4 (Zz × zz) in en geef de genotypen van de nakomelingen met hun verhouding.',
      antwoord:'Gameten: Z en z (van Zz), z en z (van zz). Nakomelingen: Zz en zz in de verhouding 1 : 1 (dus 50% Zz en 50% zz).',
      antwoord_rubric:'1 punt: juiste gameten in het schema. 1 punt: nakomelingen Zz en zz in verhouding 1 : 1.' },
    { nr:14, opgave:4, punten:3, type:'open', domein:'O',
      vraag:'De kweker kruist nu twee zwarte cavia\'s. Onder de nakomelingen zitten zowel zwarte als witte jongen (ongeveer 3 zwart : 1 wit). Beredeneer welke genotypen beide ouders moeten hebben.',
      antwoord:'Er worden witte (zz) jongen geboren, dus beide ouders moeten allebei een allel z kunnen doorgeven. Omdat de ouders zelf zwart zijn, hebben ze ook een allel Z. Beide ouders zijn dus Zz. Een kruising Zz × Zz geeft inderdaad een verhouding van ongeveer 3 zwart : 1 wit, wat klopt met de waarneming.',
      antwoord_rubric:'1 punt: witte jongen (zz) → beide ouders dragen een z. 1 punt: ouders zijn zwart → dragen ook een Z → beide Zz. 1 punt: Zz × Zz geeft 3 : 1, past bij de waarneming.' },
    { nr:15, opgave:4, punten:2, type:'open', domein:'O',
      vraag:'Een losse zwarte cavia kan genotype ZZ of Zz hebben. Leg uit met welke kruising je dit kunt bepalen én welke uitkomst bij welk genotype hoort.',
      antwoord:'Doe een testkruising met een witte cavia (zz). Is de zwarte cavia ZZ, dan zijn alle nakomelingen zwart (Zz). Is de zwarte cavia Zz, dan is ongeveer de helft van de nakomelingen wit (zz). Aan het al of niet voorkomen van witte jongen zie je dus welk genotype de zwarte cavia had.',
      antwoord_rubric:'1 punt: testkruising met een witte (zz) cavia. 1 punt: ZZ → alle nakomelingen zwart; Zz → ± helft wit.' },
    // ── Opgave 5 · Afweer en vaccinatie ──
    { nr:16, opgave:5, punten:3, type:'open', domein:'O',
      vraag:'Leg met afbeelding 5 uit waarom de tweede reactie sneller op gang komt én een hogere antistofconcentratie bereikt dan de eerste. Betrek de rol van geheugencellen in je antwoord.',
      antwoord:'Bij de eerste blootstelling moet het afweersysteem het antigeen nog leren herkennen; er worden langzaam en weinig antistoffen gemaakt (de lage, late piek) en er ontstaan geheugencellen. Bij de tweede blootstelling herkennen die geheugencellen het antigeen meteen, waardoor er veel sneller en veel meer antistoffen worden geproduceerd (de hoge, snelle piek in de grafiek).',
      antwoord_rubric:'1 punt: bij de eerste blootstelling ontstaan geheugencellen (trage, lage respons afgelezen). 1 punt: geheugencellen herkennen bij de tweede blootstelling het antigeen meteen. 1 punt: daardoor sneller én hoger, gekoppeld aan de grafiek.' },
    { nr:17, opgave:5, punten:2, type:'open', domein:'O',
      vraag:'Is de immuniteit die door dit vaccin ontstaat actief of passief? Leg je antwoord uit met wat er in het lichaam gebeurt.',
      antwoord:'Actieve immuniteit. Het lichaam maakt namelijk zélf antistoffen en geheugencellen als reactie op de antigenen in het vaccin; het krijgt de antistoffen niet kant-en-klaar aangeleverd.',
      antwoord_rubric:'1 punt: actief. 1 punt: uitleg dat het lichaam zelf antistoffen/geheugencellen maakt.' },
    { nr:18, opgave:5, punten:3, type:'open', domein:'O',
      vraag:'Tegen mazelen beschermt één vaccinatie vaak levenslang, terwijl je je tegen griep elk jaar opnieuw moet laten vaccineren. Geef hiervoor een biologische verklaring.',
      antwoord:'Het griepvirus verandert (muteert) sterk, waardoor de antigenen op het virus elk jaar anders zijn. De geheugencellen die na een vorige vaccinatie of infectie zijn gevormd, herkennen de nieuwe variant niet goed, zodat de opgebouwde afweer niet meer past en een nieuw vaccin nodig is. Het mazelenvirus verandert nauwelijks, dus de gevormde geheugencellen blijven het virus herkennen en de bescherming houdt lang aan.',
      antwoord_rubric:'1 punt: het griepvirus muteert / verandert van antigenen. 1 punt: geheugencellen herkennen de nieuwe variant niet meer → jaarlijks opnieuw. 1 punt: mazelenvirus verandert nauwelijks → geheugencellen blijven passen → langdurige bescherming.' },
    // ── Opgave 6 · Onderzoek naar fotosynthese ──
    { nr:19, opgave:6, punten:2, type:'open', domein:'A',
      vraag:'Geef in dit onderzoek zowel de onafhankelijke als de afhankelijke variabele.',
      antwoord:'Onafhankelijke variabele: de lichtsterkte (geregeld via de afstand tot de lamp). Afhankelijke variabele: de fotosynthesesnelheid (het aantal zuurstofbelletjes per minuut).',
      antwoord_rubric:'1 punt: onafhankelijke variabele = lichtsterkte/afstand tot de lamp. 1 punt: afhankelijke variabele = fotosynthesesnelheid/aantal belletjes per minuut.' },
    { nr:20, opgave:6, punten:2, type:'open', domein:'A',
      vraag:'Noem twee factoren die de leerling constant moet houden en leg uit waarom dat nodig is voor een geldige conclusie.',
      antwoord:'Bijvoorbeeld de watertemperatuur en de CO₂-concentratie in het water (of dezelfde hoeveelheid waterpest). Deze factoren beïnvloeden zelf ook de fotosynthesesnelheid; als ze mee zouden veranderen, weet je niet of een verschil door de lichtsterkte komt of door zo\'n andere factor. Door ze constant te houden meet je alleen het effect van de lichtsterkte.',
      antwoord_rubric:'1 punt: twee correcte constant te houden factoren. 1 punt: uitleg dat ze anders het resultaat beïnvloeden → je meet dan niet zuiver het effect van de lichtsterkte.' },
    { nr:21, opgave:6, punten:2, type:'open', domein:'A',
      vraag:'De leerling herhaalt elke meting drie keer en neemt het gemiddelde. Leg uit hoe dit de betrouwbaarheid van haar conclusie vergroot.',
      antwoord:'Door te herhalen en te middelen wordt de invloed van toevallige meetfouten en toevallige variatie tussen metingen kleiner. Het gemiddelde ligt daardoor dichter bij de werkelijke waarde en is consistenter, zodat de conclusie betrouwbaarder wordt.',
      antwoord_rubric:'1 punt: herhalen/middelen verkleint de invloed van toevallige (meet)fouten. 1 punt: gemiddelde is betrouwbaarder/consistenter → sterkere conclusie.' },
    { nr:22, opgave:6, punten:3, type:'open', domein:'A',
      afb:_BIAFB.fotosynthese, afb_cap:'afbeelding 7 — fotosynthesesnelheid bij toenemende lichtsterkte',
      vraag:'De leerling zet de resultaten uit in afbeelding 7. Vanaf een bepaalde lichtsterkte stijgt de fotosynthesesnelheid niet verder. Leg uit wat dit betekent, noem een factor die dan beperkend is, en beschrijf een proef waarmee de leerling kan aantonen dát die factor beperkend is.',
      antwoord:'Dat de lijn afvlakt betekent dat meer licht de fotosynthese niet verder versnelt: een andere factor is dan de beperkende (limiterende) factor, bijvoorbeeld de CO₂-concentratie of de temperatuur. Om aan te tonen dat bijvoorbeeld CO₂ beperkend is, herhaalt de leerling het onderzoek bij een hogere CO₂-concentratie (rest gelijk); als de fotosynthesesnelheid in het afgevlakte deel dan wél hoger wordt, was CO₂ inderdaad de beperkende factor.',
      antwoord_rubric:'1 punt: afvlakken = licht niet langer beperkend, een andere factor wel. 1 punt: noemt een plausibele beperkende factor (CO₂ of temperatuur). 1 punt: opzet van een vervolgproef (die factor verhogen, rest constant; hogere snelheid = bevestiging).' },
  ]
};
