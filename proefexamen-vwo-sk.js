// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-sk.js  ORIGINEEL Slagio-proefexamen (vwo scheikunde).
// Eigen contexten, vragen en figuren. Geen reproductie van een CvTE-examen.
// VWO-CE-niveau: chemisch evenwicht (Kc, Le Chatelier), reactiesnelheid,
// zuur-base-titratie, redox, organische chemie en rekenen (rendement).
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

function _vskAx(){
  return '<line x1="52" y1="14" x2="52" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/>'+
         '<line x1="52" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M344 158 L334 154 L334 162 Z" fill="#1b2230"/>';
}

var _VSKAFB = {
  // Concentratie-tijd naar evenwicht
  evenwicht:`<svg viewBox="0 0 360 194" role="img" aria-label="concentratie tegen tijd naar evenwicht"><g stroke="#eef1f5" stroke-width="1">${[126,94,62,30].map(y=>'<line x1="52" y1="'+y+'" x2="340" y2="'+y+'"/>').join('')}</g>${_vskAx()}<path d="M56 34 Q120 70 180 92 Q230 108 300 108 L332 108" fill="none" stroke="#2563eb" stroke-width="2.8"/><path d="M56 150 Q120 118 180 70 Q230 50 300 50 L332 50" fill="none" stroke="#2e9e5b" stroke-width="2.8"/><line x1="210" y1="14" x2="210" y2="158" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><text x="214" y="26" font-family="sans-serif" font-size="8.5" fill="#8a94a8">evenwicht</text><g font-family="sans-serif" font-size="9" font-weight="700"><text x="150" y="118" fill="#2563eb">SO&#8322; + O&#8322;</text><text x="150" y="44" fill="#2e9e5b">SO&#8323;</text></g><text x="0" y="0" transform="translate(16,90) rotate(-90)" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">concentratie</text><text x="300" y="184" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">tijd</text></svg>`,
  // Energiediagram met en zonder katalysator
  energie:`<svg viewBox="0 0 360 196" role="img" aria-label="energiediagram met en zonder katalysator"><g stroke="#eef1f5" stroke-width="1">${[44,80,116,152].map(y=>'<line x1="54" y1="'+y+'" x2="340" y2="'+y+'"/>').join('')}</g><line x1="54" y1="16" x2="54" y2="170" stroke="#1b2230" stroke-width="2"/><path d="M54 16 L50 26 L58 26 Z" fill="#1b2230"/><line x1="54" y1="170" x2="346" y2="170" stroke="#1b2230" stroke-width="2"/><path d="M346 170 L336 166 L336 174 Z" fill="#1b2230"/><path d="M66 96 L118 96 C150 96 158 30 186 30 C216 30 220 132 256 132 L330 132" fill="none" stroke="#e8580c" stroke-width="2.8"/><path d="M118 96 C150 96 160 62 186 62 C214 62 220 132 256 132" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="5 4"/><g stroke="#8a94a8" stroke-width="1" stroke-dasharray="3 3"><line x1="118" y1="96" x2="196" y2="96"/><line x1="216" y1="132" x2="320" y2="132"/></g><g font-family="sans-serif" font-size="8.5" font-weight="700"><text x="150" y="24" fill="#e8580c">E&#7488; zonder kat.</text><text x="196" y="58" fill="#2563eb">E&#7488; met kat.</text><text x="300" y="116" fill="#2e9e5b">&#916;H (exotherm)</text></g><g stroke="#2e9e5b" stroke-width="1.4"><line x1="300" y1="96" x2="300" y2="132"/><path d="M296 126 L300 134 L304 126" fill="#2e9e5b" stroke="none"/></g><g font-family="sans-serif" font-size="8.5" fill="#4a5568"><text x="70" y="90">beginstoffen</text><text x="262" y="146">producten</text></g><text x="0" y="0" transform="translate(18,96) rotate(-90)" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">energie</text><text x="250" y="190" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">reactieverloop</text></svg>`,
  // Titratiecurve zwak zuur met sterke base
  titratie:(function(){
    var sx=function(v){return 56+v/40*280;}, sy=function(pH){return 152-pH/14*128;};
    var yl=[0,2,4,6,8,10,12,14].map(v=>'<line x1="56" y1="'+sy(v).toFixed(1)+'" x2="340" y2="'+sy(v).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(v)+3).toFixed(1)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="end">'+v+'</text>').join('');
    var pts=[[0,2.9],[5,4.0],[10,4.5],[15,4.9],[20,5.4],[24,6.0],[26,7.0],[28,9.5],[30,11.0],[35,11.8],[40,12.2]];
    var path='<path d="M'+pts.map((p,i)=>(i?'L':'')+sx(p[0]).toFixed(1)+' '+sy(p[1]).toFixed(1)).join(' ')+'" fill="none" stroke="#e8580c" stroke-width="2.8"/>';
    var eq='<line x1="'+sx(27).toFixed(1)+'" y1="14" x2="'+sx(27).toFixed(1)+'" y2="152" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><circle cx="'+sx(27).toFixed(1)+'" cy="'+sy(8.3).toFixed(1)+'" r="3.4" fill="#1b2230"/><text x="'+(sx(27)+4).toFixed(1)+'" y="30" font-family="sans-serif" font-size="8" fill="#8a94a8">equivalentiepunt</text>';
    var buf='<text x="'+sx(12).toFixed(1)+'" y="'+(sy(3.2)).toFixed(1)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">buffergebied</text>';
    var xl=[0,10,20,30,40].map(v=>'<text x="'+sx(v).toFixed(1)+'" y="166" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+v+'</text>').join('');
    return '<svg viewBox="0 0 360 194" role="img" aria-label="titratiecurve">'+yl+'<line x1="56" y1="14" x2="56" y2="152" stroke="#1b2230" stroke-width="1.8"/><line x1="56" y1="152" x2="342" y2="152" stroke="#1b2230" stroke-width="1.8"/><path d="M342 152 L334 148 L334 156 Z" fill="#1b2230"/>'+path+eq+buf+xl+'<text x="0" y="0" transform="translate(18,86) rotate(-90)" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">pH</text><text x="250" y="184" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">toegevoegd NaOH (mL)</text></svg>';
  })(),
  // Galvanische cel (Zn/Cu)
  cel:`<svg viewBox="0 0 360 196" role="img" aria-label="galvanische cel"><path d="M40 130 L40 70 Q40 66 44 66 L96 66 Q100 66 100 70 L100 130 Z" fill="#eaf3ff" stroke="#1b2230" stroke-width="1.4"/><path d="M260 130 L260 70 Q260 66 264 66 L316 66 Q320 66 320 70 L320 130 Z" fill="#fdeee7" stroke="#1b2230" stroke-width="1.4"/><rect x="62" y="40" width="12" height="80" fill="#9aa5b5" stroke="#1b2230" stroke-width="1.2"/><rect x="286" y="40" width="12" height="80" fill="#e0894a" stroke="#1b2230" stroke-width="1.2"/><path d="M68 40 L68 24 L292 24 L292 40" fill="none" stroke="#1b2230" stroke-width="1.6"/><circle cx="180" cy="24" r="12" fill="#fff" stroke="#1b2230" stroke-width="1.4"/><text x="180" y="28" font-family="sans-serif" font-size="10" font-weight="700" fill="#1b2230" text-anchor="middle">V</text><path d="M120 60 Q180 44 240 60" fill="none" stroke="#5a6472" stroke-width="7" stroke-linecap="round"/><text x="180" y="78" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">zoutbrug</text><g stroke="#e05353" stroke-width="1.6" fill="none"><line x1="110" y1="18" x2="150" y2="18"/><path d="M144 14 L152 18 L144 22" fill="#e05353" stroke="none"/></g><text x="130" y="12" font-family="sans-serif" font-size="8.5" fill="#e05353" font-weight="700" text-anchor="middle">e&#8315;</text><g font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle"><text x="68" y="150">Zn</text><text x="68" y="162" font-size="8" fill="#4a5568">(negatief)</text><text x="292" y="150">Cu</text><text x="292" y="162" font-size="8" fill="#4a5568">(positief)</text><text x="70" y="112" font-size="8" fill="#2563eb">Zn&#178;&#8314;</text><text x="290" y="112" font-size="8" fill="#2563eb">Cu&#178;&#8314;</text></g></svg>`,
  // Verestering: structuurformules
  verestering:`<svg viewBox="0 0 360 168" role="img" aria-label="veresteringsreactie"><g font-family="Georgia,serif" font-size="12" fill="#1b2230"><text x="60" y="60" text-anchor="middle">CH&#8323;-C</text><text x="92" y="48">O</text><text x="92" y="74">OH</text></g><line x1="78" y1="52" x2="88" y2="44" stroke="#1b2230" stroke-width="1.2"/><line x1="80" y1="52" x2="90" y2="44" stroke="#1b2230" stroke-width="1.2"/><line x1="78" y1="58" x2="88" y2="68" stroke="#1b2230" stroke-width="1.2"/><text x="118" y="60" font-family="sans-serif" font-size="12" fill="#1b2230">+</text><text x="150" y="60" font-family="Georgia,serif" font-size="12" fill="#1b2230">HO-C&#8322;H&#8325;</text><g font-family="sans-serif" font-size="9" fill="#e8580c" font-weight="700"><text x="60" y="90" text-anchor="middle">azijnzuur</text><text x="165" y="90" text-anchor="middle">ethanol</text></g><g stroke="#1b2230" stroke-width="1.6" fill="none"><line x1="205" y1="56" x2="238" y2="56"/><path d="M231 51 L240 56 L231 61" fill="#1b2230" stroke="none"/></g><text x="222" y="48" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">H&#8322;SO&#8324;</text><g font-family="Georgia,serif" font-size="12" fill="#1b2230"><text x="270" y="60">CH&#8323;-C</text><text x="303" y="48">O</text><text x="300" y="74">O-C&#8322;H&#8325;</text></g><text x="300" y="98" font-family="sans-serif" font-size="9" fill="#e8580c" font-weight="700" text-anchor="middle">ester</text><text x="270" y="128" font-family="sans-serif" font-size="12" fill="#1b2230">+  H&#8322;O</text><text x="300" y="146" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">(water)</text></svg>`,
  // Rekenschema rendement
  rendement:`<svg viewBox="0 0 360 150" role="img" aria-label="rekenschema rendement"><rect x="20" y="52" width="96" height="46" rx="8" fill="#eef4ff" stroke="#2563eb" stroke-width="1.3"/><text x="68" y="72" font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle">grondstof</text><text x="68" y="86" font-family="sans-serif" font-size="10" font-weight="700" fill="#1b2230" text-anchor="middle">0,50 mol</text><g stroke="#1b2230" stroke-width="1.6" fill="none"><line x1="116" y1="75" x2="150" y2="75"/><path d="M144 70 L152 75 L144 80" fill="#1b2230" stroke="none"/></g><rect x="152" y="52" width="90" height="46" rx="8" fill="#f7f9fc" stroke="#c9cfda" stroke-width="1.1"/><text x="197" y="70" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="middle">reactie</text><text x="197" y="84" font-family="sans-serif" font-size="8" fill="#8a94a8" text-anchor="middle">1 : 1</text><g stroke="#1b2230" stroke-width="1.6" fill="none"><line x1="242" y1="75" x2="276" y2="75"/><path d="M270 70 L278 75 L270 80" fill="#1b2230" stroke="none"/></g><rect x="278" y="52" width="72" height="46" rx="8" fill="#e5f6ec" stroke="#2e9e5b" stroke-width="1.3"/><text x="314" y="70" font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle">product</text><text x="314" y="84" font-family="sans-serif" font-size="10" font-weight="700" fill="#1b2230" text-anchor="middle">?</text><text x="180" y="24" font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle">M(product) = 88 g/mol · werkelijk verkregen: 33 g</text><text x="180" y="120" font-family="sans-serif" font-size="8.5" fill="#8a94a8" text-anchor="middle">rendement = (werkelijke opbrengst / theoretische opbrengst) × 100%</text></svg>`,
};

SLAGIO_EXAMENS.vwo.sk = {
  origineel: true,
  titel: 'Scheikunde',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 150,
  max_punten: 34,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Zwavelzuurfabriek',
      context:'Bij de productie van zwavelzuur reageert zwaveldioxide met zuurstof tot zwaveltrioxide:\n2 SO2 (g) + O2 (g) ⇌ 2 SO3 (g)     (exotherm)\nDe reactie stelt zich in op een evenwicht. Afbeelding 1 toont de concentraties tegen de tijd.',
      afb:_VSKAFB.evenwicht, afb_cap:'afbeelding 1: concentraties tegen de tijd tot het evenwicht' },
    { nr:2, titel:'Sneller met een katalysator',
      context:'Afbeelding 2 is het energiediagram van een exotherme reactie, met de activeringsenergie zonder en met een katalysator.',
      afb:_VSKAFB.energie, afb_cap:'afbeelding 2: energiediagram met en zonder katalysator' },
    { nr:3, titel:'Een zuur titreren',
      context:'Een oplossing van 25,0 mL azijnzuur (een zwak zuur) wordt getitreerd met natronloog (NaOH) van 0,10 mol/L. Afbeelding 3 is de titratiecurve.',
      afb:_VSKAFB.titratie, afb_cap:'afbeelding 3: pH tegen toegevoegd volume natronloog' },
    { nr:4, titel:'Stroom uit een reactie',
      context:'Afbeelding 4 is een galvanische cel met een zink- en een koperelektrode in oplossingen van hun eigen ionen, verbonden door een zoutbrug en een draad met een voltmeter.',
      afb:_VSKAFB.cel, afb_cap:'afbeelding 4: een galvanische cel (Zn/Cu)' },
    { nr:5, titel:'Een geurstof maken',
      context:'Azijnzuur en ethanol reageren met elkaar tot een ester (een geurstof) en water. Afbeelding 5 toont de reactie. De reactie verloopt onvolledig en stelt zich in op een evenwicht.',
      afb:_VSKAFB.verestering, afb_cap:'afbeelding 5: de verestering van azijnzuur en ethanol' },
    { nr:6, titel:'Hoeveel product?',
      context:'Bij een synthese reageert 0,50 mol grondstof volgens een 1:1-verhouding tot een product met molaire massa 88 g/mol. In werkelijkheid wordt 33 g product verkregen. Afbeelding 6 vat de gegevens samen.',
      afb:_VSKAFB.rendement, afb_cap:'afbeelding 6: gegevens van de synthese' },
  ],
  vragen: [
    // Opgave 1
    { nr:1, opgave:1, punten:2, type:'open', domein:'Evenwicht',
      vraag:'Geef de evenwichtsvoorwaarde (de uitdrukking voor de evenwichtsconstante Kc) van deze reactie.',
      antwoord:'Kc = [SO3]² / ([SO2]² · [O2]). De concentraties van de producten komen in de teller, die van de beginstoffen in de noemer, elk tot de macht van hun coëfficiënt.',
      antwoord_rubric:'1 punt: producten in de teller, beginstoffen in de noemer. 1 punt: juiste machten: [SO3]²/([SO2]²[O2]).' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Evenwicht',
      vraag:'Leg met afbeelding 1 uit waarop je ziet dat er een evenwicht is ontstaan, en wat er op dat moment geldt voor de snelheden van de heen- en teruggaande reactie.',
      antwoord:'Vanaf een bepaald moment veranderen de concentraties van SO2/O2 en SO3 niet meer; de lijnen lopen horizontaal (het plateau). Dat betekent dat er per tijdseenheid evenveel SO3 wordt gevormd als wordt afgebroken: de snelheid van de heengaande reactie is gelijk aan die van de teruggaande reactie (dynamisch evenwicht).',
      antwoord_rubric:'1 punt: de concentraties blijven constant (horizontale lijnen). 1 punt: snelheid heen = snelheid terug (dynamisch evenwicht).' },
    { nr:3, opgave:1, punten:3, type:'open', domein:'Evenwicht',
      vraag:'De fabriek wil de opbrengst aan SO3 vergroten. Beredeneer met het principe van Le Chatelier wat het effect is van (a) het verhogen van de druk en (b) het verlagen van de temperatuur.',
      antwoord:'(a) Hogere druk: het evenwicht verschuift naar de kant met minder gasdeeltjes. Links staan 3 gasmoleculen (2 SO2 + O2), rechts 2 (2 SO3), dus het evenwicht verschuift naar rechts en er ontstaat meer SO3. (b) Lagere temperatuur: de reactie is exotherm (heengaande reactie geeft warmte). Bij afkoelen werkt het evenwicht de daling tegen door de warmteproducerende (heengaande) reactie te bevorderen, dus verschuift het naar rechts en ontstaat er meer SO3.',
      antwoord_rubric:'1 punt: hogere druk → naar de kant met minder gasdeeltjes (rechts, 2 < 3) → meer SO3. 1 punt: reactie is exotherm. 1 punt: lagere temperatuur → naar rechts (warmte-producerende kant) → meer SO3.' },
    // Opgave 2
    { nr:4, opgave:2, punten:2, type:'open', domein:'Reactiesnelheid',
      vraag:'Leg met afbeelding 2 uit hoe een katalysator de reactie versnelt. Betrek de activeringsenergie en de botsende deeltjes.',
      antwoord:'De katalysator verlaagt de activeringsenergie (de blauwe, lagere piek): er is minder energie nodig om de reactie te laten verlopen. Daardoor heeft bij dezelfde temperatuur een groter deel van de botsende deeltjes genoeg energie om de drempel te halen, zodat er per seconde meer effectieve (geslaagde) botsingen zijn en de reactie sneller verloopt.',
      antwoord_rubric:'1 punt: katalysator verlaagt de activeringsenergie. 1 punt: daardoor haalt een groter deel van de deeltjes de drempel → meer effectieve botsingen → sneller.' },
    { nr:5, opgave:2, punten:2, type:'open', domein:'Reactiesnelheid',
      vraag:'Verandert de katalysator ook de energie die de reactie oplevert (ΔH) en de ligging van een eventueel evenwicht? Leg je antwoord uit.',
      antwoord:'Nee. De katalysator verlaagt alleen de activeringsenergie (de piek), maar verandert het energieniveau van de beginstoffen en de producten niet; daardoor blijft ΔH (het hoogteverschil) gelijk. Een katalysator versnelt de heen- én de teruggaande reactie evenveel, dus de ligging van het evenwicht verandert niet; het evenwicht wordt alleen sneller bereikt.',
      antwoord_rubric:'1 punt: ΔH blijft gelijk (begin- en eindniveau onveranderd). 1 punt: de evenwichtsligging verandert niet (heen en terug even sterk versneld), alleen sneller ingesteld.' },
    // Opgave 3
    { nr:6, opgave:3, punten:3, type:'open', domein:'Zuren',
      vraag:'Bepaal met afbeelding 3 het equivalentievolume en bereken daarmee de concentratie van het azijnzuur in de oorspronkelijke 25,0 mL.',
      antwoord:'Bij het equivalentiepunt springt de pH steil omhoog; dat gebeurt bij ongeveer 27 mL NaOH (aflezen via de stippellijn). n(NaOH) = c·V = 0,10 mol/L × 0,027 L = 2,7·10⁻³ mol. Azijnzuur en NaOH reageren in verhouding 1:1, dus n(azijnzuur) = 2,7·10⁻³ mol. Concentratie = n/V = 2,7·10⁻³ mol ÷ 0,025 L = 0,11 mol/L.',
      antwoord_rubric:'1 punt: equivalentievolume ≈ 27 mL afgelezen. 1 punt: n(NaOH) = n(azijnzuur) = 0,10 × 0,027 = 2,7·10⁻³ mol. 1 punt: c = 2,7·10⁻³ / 0,025 ≈ 0,11 mol/L.' },
    { nr:7, opgave:3, punten:3, type:'open', domein:'Zuren',
      vraag:'Leg uit waarom er in het begin van de titratie een "buffergebied" is waar de pH nauwelijks stijgt, en waarom het equivalentiepunt bij deze titratie boven pH 7 ligt.',
      antwoord:'In het buffergebied zijn er zowel azijnzuurmoleculen als de gevormde acetaationen aanwezig; deze mengsel-oplossing werkt als een buffer: toegevoegd OH⁻ wordt weggevangen door het zwakke zuur, zodat de pH maar weinig verandert. Bij het equivalentiepunt is al het azijnzuur omgezet in acetaat (de geconjugeerde base). Dit acetaat is een (zwakke) base die met water reageert en OH⁻ vormt, waardoor de oplossing basisch is: het equivalentiepunt ligt daardoor boven pH 7.',
      antwoord_rubric:'1 punt: buffer = mengsel van zwak zuur en zijn geconjugeerde base vangt toegevoegd OH⁻ weg → pH stabiel. 1 punt: bij equivalentie is alles omgezet tot acetaat (geconjugeerde base). 1 punt: acetaat reageert basisch met water (OH⁻) → pH > 7.' },
    // Opgave 4
    { nr:8, opgave:4, punten:3, type:'open', domein:'Redox',
      vraag:'Geef de halfreactie die aan de zinkelektrode plaatsvindt en die aan de koperelektrode, en geef bij elke elektrode aan of het oxidatie of reductie is.',
      antwoord:'Aan de zinkelektrode: Zn → Zn²⁺ + 2 e⁻. Zink staat elektronen af, dus dit is oxidatie (de negatieve pool). Aan de koperelektrode: Cu²⁺ + 2 e⁻ → Cu. Koperionen nemen elektronen op, dus dit is reductie (de positieve pool).',
      antwoord_rubric:'1 punt: Zn → Zn²⁺ + 2 e⁻ = oxidatie. 1 punt: Cu²⁺ + 2 e⁻ → Cu = reductie. 1 punt: koppeling oxidatie/reductie aan de juiste elektrode.' },
    { nr:9, opgave:4, punten:2, type:'open', domein:'Redox',
      vraag:'Leg uit in welke richting de elektronen door de draad stromen, en welke functie de zoutbrug in de cel heeft.',
      antwoord:'De elektronen stromen door de draad van de zinkelektrode (waar ze vrijkomen bij de oxidatie) naar de koperelektrode (waar ze worden opgenomen bij de reductie), dus van Zn naar Cu. De zoutbrug sluit de stroomkring in de oplossingen: hij laat ionen door om de ladingsopbouw te compenseren (positieve ionen naar de koperkant, negatieve naar de zinkkant), zodat beide oplossingen neutraal blijven en de cel blijft werken.',
      antwoord_rubric:'1 punt: elektronen stromen van Zn naar Cu (van oxidatie naar reductie). 1 punt: de zoutbrug transporteert ionen om de lading te compenseren / de kring te sluiten.' },
    // Opgave 5
    { nr:10, opgave:5, punten:2, type:'open', domein:'Koolstof',
      vraag:'Benoem het type reactie waarmee de ester ontstaat, en leg uit welke twee groepen van azijnzuur en ethanol met elkaar reageren en welk klein molecuul daarbij vrijkomt.',
      antwoord:'Het is een verestering, een condensatiereactie. De carboxylgroep (-COOH) van het azijnzuur reageert met de hydroxylgroep (-OH) van het ethanol. Daarbij wordt een watermolecuul (H2O) afgesplitst en ontstaat een esterbinding (-COO-).',
      antwoord_rubric:'1 punt: verestering / condensatiereactie. 1 punt: -COOH (azijnzuur) reageert met -OH (ethanol) onder afsplitsing van H2O.' },
    { nr:11, opgave:5, punten:2, type:'open', domein:'Koolstof',
      vraag:'De reactie is een evenwicht. Leg uit hoe je de opbrengst aan ester kunt vergroten door tijdens de reactie voortdurend het gevormde water te verwijderen.',
      antwoord:'Volgens Le Chatelier verschuift een evenwicht bij het wegnemen van een product naar de kant van dat product om het verlies te compenseren. Water is een product; door het steeds af te voeren, verschuift het evenwicht naar rechts en wordt er steeds meer ester gevormd, waardoor de opbrengst stijgt.',
      antwoord_rubric:'1 punt: water is een product; wegnemen verschuift het evenwicht naar rechts (Le Chatelier). 1 punt: daardoor wordt er meer ester gevormd (hogere opbrengst).' },
    // Opgave 6
    { nr:12, opgave:6, punten:3, type:'open', domein:'Rekenen',
      vraag:'Bereken de theoretische opbrengst (in gram) en bereken daarmee het rendement van deze synthese.',
      antwoord:'Molverhouding grondstof : product = 1 : 1, dus theoretisch ontstaat 0,50 mol product. Theoretische opbrengst = n·M = 0,50 × 88 = 44 g. Rendement = (werkelijke opbrengst ÷ theoretische opbrengst) × 100% = (33 ÷ 44) × 100% = 75%.',
      antwoord_rubric:'1 punt: theoretisch 0,50 mol product (1:1). 1 punt: theoretische opbrengst = 0,50 × 88 = 44 g. 1 punt: rendement = 33/44 × 100% = 75%.' },
  ],
};
