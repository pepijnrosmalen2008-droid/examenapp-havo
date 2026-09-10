// ═══════════════════════════════════════════════════════════════════════
// proefexamen-sk.js — ORIGINEEL Slagio-proefexamen in examenstijl (havo sk).
// Eigen contexten, vragen en figuren. Géén reproductie van een CvTE-examen.
// Vraagstelling op vol CE-niveau: reactievergelijkingen, meerstaps rekenen
// (mol/massa/volume/concentratie), overmaat, uitkristalliseren, massapercentage
// en pH-schaal. Meervoudige nakijkrubric per vraag. Figuren in hoge kwaliteit.
//   opgaven[] = {nr,titel,context,afb,afb_cap}
//   vragen[]  = {nr,opgave,punten,type,vraag,antwoord,antwoord_rubric,domein}
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.havo = SLAGIO_EXAMENS.havo || {};

// Herbruikbare atoom-"ballen" met 3D-schaduw (radial gradient + glans)
function _skAtom(cx, cy, r, grad){
  return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="url(#'+grad+')" stroke="rgba(0,0,0,.28)" stroke-width="1"/>'+
         '<ellipse cx="'+(cx-r*0.32)+'" cy="'+(cy-r*0.36)+'" rx="'+(r*0.42)+'" ry="'+(r*0.28)+'" fill="rgba(255,255,255,.55)"/>';
}
var _SK_DEFS = '<defs>'+
  '<radialGradient id="atC" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#565c66"/><stop offset="1" stop-color="#1d2026"/></radialGradient>'+
  '<radialGradient id="atH" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c3cbd8"/></radialGradient>'+
  '<radialGradient id="atO" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ff7a6b"/><stop offset="1" stop-color="#c3352b"/></radialGradient>'+
  '</defs>';

// Bindingsstaaf (grijze cilinder achter de atomen)
function _skBond(x1,y1,x2,y2){ return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#c2c9d4" stroke-width="6" stroke-linecap="round"/>'; }

var _SKAFB = {
  // Molecuulmodel van de verbranding van methaan — 3D-ballen, geschaduwde bindingen
  verbranding:`<svg viewBox="0 0 360 208" role="img" aria-label="molecuulmodel van de verbranding van methaan">${_SK_DEFS}<g>${_skBond(56,68,56,44)}${_skBond(56,68,56,92)}${_skBond(56,68,32,68)}${_skBond(56,68,80,68)}${_skAtom(56,44,6,'atH')}${_skAtom(56,92,6,'atH')}${_skAtom(32,68,6,'atH')}${_skAtom(80,68,6,'atH')}${_skAtom(56,68,10,'atC')}</g><text x="100" y="74" font-family="Georgia,serif" font-size="18" fill="#1b2230">+</text><text x="116" y="50" font-family="sans-serif" font-size="13" font-weight="800" fill="#1b2230">2</text><g>${_skBond(128,46,148,46)}${_skAtom(128,46,8,'atO')}${_skAtom(148,46,8,'atO')}${_skBond(128,90,148,90)}${_skAtom(128,90,8,'atO')}${_skAtom(148,90,8,'atO')}</g><g stroke="#1b2230" stroke-width="2.2" fill="none"><line x1="172" y1="68" x2="206" y2="68"/><path d="M199 62 L208 68 L199 74"/></g><g>${_skBond(244,68,224,68)}${_skBond(244,68,264,68)}${_skAtom(224,68,8,'atO')}${_skAtom(264,68,8,'atO')}${_skAtom(244,68,10,'atC')}</g><text x="284" y="74" font-family="Georgia,serif" font-size="18" fill="#1b2230">+</text><text x="300" y="50" font-family="sans-serif" font-size="13" font-weight="800" fill="#1b2230">2</text><g>${_skBond(320,54,308,44)}${_skBond(320,54,332,44)}${_skAtom(306,42,5.5,'atH')}${_skAtom(334,42,5.5,'atH')}${_skAtom(320,54,8,'atO')}</g><g>${_skBond(320,96,308,86)}${_skBond(320,96,332,86)}${_skAtom(306,84,5.5,'atH')}${_skAtom(334,84,5.5,'atH')}${_skAtom(320,96,8,'atO')}</g><line x1="40" y1="150" x2="330" y2="150" stroke="#e6e9ef" stroke-width="1"/><g font-family="sans-serif" font-size="10.5" fill="#4a5568">${_skAtom(60,172,7,'atC')}<text x="74" y="176">koolstof</text>${_skAtom(150,172,7,'atH')}<text x="164" y="176">waterstof</text>${_skAtom(258,172,7,'atO')}<text x="272" y="176">zuurstof</text></g></svg>`,

  // Energiediagram exotherm — vloeiende curve, Ea + energie-effect apart
  energie:`<svg viewBox="0 0 360 202" role="img" aria-label="energiediagram van een exotherme reactie"><g stroke="#eef1f5" stroke-width="1">${[44,72,100,128,156].map(y=>'<line x1="54" y1="'+y+'" x2="340" y2="'+y+'"/>').join('')}</g><line x1="54" y1="16" x2="54" y2="170" stroke="#1b2230" stroke-width="2"/><path d="M54 16 L50 26 L58 26 Z" fill="#1b2230"/><line x1="54" y1="170" x2="346" y2="170" stroke="#1b2230" stroke-width="2"/><path d="M346 170 L336 166 L336 174 Z" fill="#1b2230"/><path d="M68 96 L120 96 C154 96 158 40 186 40 C216 40 220 134 256 134 L330 134" fill="none" stroke="#e8580c" stroke-width="3" stroke-linecap="round"/><g stroke="#8a94a8" stroke-width="1" stroke-dasharray="4 3"><line x1="120" y1="96" x2="196" y2="96"/><line x1="216" y1="134" x2="320" y2="134"/></g><g stroke="#2563eb" stroke-width="1.6"><line x1="150" y1="96" x2="150" y2="40"/><path d="M145 47 L150 38 L155 47"/><path d="M145 89 L150 98 L155 89"/></g><text x="130" y="72" font-family="sans-serif" font-size="11" font-weight="800" fill="#2563eb" text-anchor="end">E<tspan font-size="8" dy="3">a</tspan></text><g stroke="#2e9e5b" stroke-width="1.6"><line x1="300" y1="96" x2="300" y2="134"/><path d="M295 89 L300 98 L305 89"/><path d="M295 127 L300 136 L305 127"/></g><text x="312" y="112" font-family="sans-serif" font-size="10" font-weight="700" fill="#2e9e5b">energie-<tspan x="312" dy="11">effect</tspan></text><g font-family="sans-serif" font-size="10" font-weight="600" fill="#4a5568"><text x="72" y="90">beginstoffen</text><text x="262" y="150">producten</text></g><text x="0" y="0" transform="translate(20,100) rotate(-90)" font-family="sans-serif" font-size="10.5" font-weight="800" fill="#1b2230" text-anchor="middle">energie</text><text x="250" y="192" font-family="sans-serif" font-size="10.5" font-weight="800" fill="#1b2230" text-anchor="middle">reactieverloop &#8594;</text></svg>`,

  // Gasvolume tegen tijd — gridlines + afleesbare assen
  gasvolume:`<svg viewBox="0 0 360 196" role="img" aria-label="volume waterstofgas tegen de tijd"><g stroke="#eef1f5" stroke-width="1">${[30,62,94,126].map(y=>'<line x1="54" y1="'+y+'" x2="340" y2="'+y+'"/>').join('')}${[110,168,226,284].map(x=>'<line x1="'+x+'" y1="14" x2="'+x+'" y2="158"/>').join('')}</g><line x1="54" y1="14" x2="54" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M54 14 L50 24 L58 24 Z" fill="#1b2230"/><line x1="54" y1="158" x2="346" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M346 158 L336 154 L336 162 Z" fill="#1b2230"/><path d="M56 154 Q108 152 140 108 Q176 58 236 54 L332 54" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/><line x1="54" y1="54" x2="236" y2="54" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="end">${[[0,158],[40,126],[80,94],[120,54]].map(p=>'<text x="48" y="'+(p[1]+3)+'">'+p[0]+'</text>').join('')}</g><g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="middle">${[[10,110],[20,168],[30,226],[40,284]].map(p=>'<text x="'+p[1]+'" y="172">'+p[0]+'</text>').join('')}</g><text x="0" y="0" transform="translate(18,110) rotate(-90)" font-family="sans-serif" font-size="10" font-weight="800" fill="#1b2230" text-anchor="middle">volume H&#8322; (mL)</text><text x="300" y="188" font-family="sans-serif" font-size="10" font-weight="800" fill="#1b2230" text-anchor="middle">tijd (s)</text></svg>`,

  // Oplosbaarheidscurve — gridlines + afleesbare assen, punt (30 °C; 40 g)
  oplosbaarheid:`<svg viewBox="0 0 360 196" role="img" aria-label="oplosbaarheid tegen temperatuur"><g stroke="#eef1f5" stroke-width="1">${[126,94,62,30].map(y=>'<line x1="54" y1="'+y+'" x2="340" y2="'+y+'"/>').join('')}${[110,168,226,284].map(x=>'<line x1="'+x+'" y1="14" x2="'+x+'" y2="158"/>').join('')}</g><line x1="54" y1="14" x2="54" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M54 14 L50 24 L58 24 Z" fill="#1b2230"/><line x1="54" y1="158" x2="346" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M346 158 L336 154 L336 162 Z" fill="#1b2230"/><path d="M56 150 Q120 144 168 110 Q230 66 300 34 L332 26" fill="none" stroke="#e8580c" stroke-width="3" stroke-linecap="round"/><line x1="168" y1="110" x2="54" y2="110" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><line x1="168" y1="110" x2="168" y2="158" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><circle cx="168" cy="110" r="3.6" fill="#1b2230"/><g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="end">${[[0,158],[20,126],[40,110,'#1b2230'],[60,62],[80,30]].map(p=>'<text x="48" y="'+(p[1]+3)+'" '+(p[2]?'font-weight="700" fill="#1b2230"':'')+'>'+p[0]+'</text>').join('')}</g><g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="middle">${[[10,110],[30,168,1],[50,226],[70,284]].map(p=>'<text x="'+p[1]+'" y="172" '+(p[2]?'font-weight="700" fill="#1b2230"':'')+'>'+p[0]+'</text>').join('')}</g><text x="0" y="0" transform="translate(16,96) rotate(-90)" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">oplosbaarheid (g/100 g water)</text><text x="250" y="188" font-family="sans-serif" font-size="10" font-weight="800" fill="#1b2230" text-anchor="middle">temperatuur (&#176;C)</text></svg>`,

  // pH-schaal — vloeiende gradient, ticks 0–14, voorbeelden met wijzers
  ph:`<svg viewBox="0 0 360 172" role="img" aria-label="pH-schaal van 0 tot 14"><defs><linearGradient id="phg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c8302a"/><stop offset="0.28" stop-color="#e07b2e"/><stop offset="0.44" stop-color="#e8c23a"/><stop offset="0.5" stop-color="#5fbf4f"/><stop offset="0.62" stop-color="#37a8ad"/><stop offset="0.82" stop-color="#3f6fd0"/><stop offset="1" stop-color="#5b3fb8"/></linearGradient></defs><rect x="34" y="88" width="300" height="28" rx="6" fill="url(#phg)" stroke="#1b2230" stroke-width="1.3"/><g font-family="sans-serif" font-size="9.5" fill="#1b2230" text-anchor="middle">${Array.from({length:15},(_,p)=>{var x=34+(p/14)*300;var maj=p%2===0;return '<line x1="'+x+'" y1="116" x2="'+x+'" y2="'+(maj?123:120)+'" stroke="#1b2230" stroke-width="1"/>'+(maj?'<text x="'+x+'" y="135">'+p+'</text>':'');}).join('')}</g><g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="middle"><line x1="76" y1="88" x2="76" y2="72" stroke="#4a5568" stroke-width="1"/><text x="76" y="66">citroensap<tspan x="76" dy="11">pH 2</tspan></text><line x1="184" y1="88" x2="184" y2="72" stroke="#4a5568" stroke-width="1"/><text x="184" y="66">water<tspan x="184" dy="11">pH 7</tspan></text><line x1="313" y1="88" x2="313" y2="72" stroke="#4a5568" stroke-width="1"/><text x="313" y="66">ontstopper<tspan x="313" dy="11">pH 13</tspan></text></g><g font-family="sans-serif" font-size="11" font-weight="800" fill="#1b2230"><text x="34" y="156">zuur</text><text x="184" y="156" text-anchor="middle">neutraal</text><text x="334" y="156" text-anchor="end">basisch</text></g></svg>`,

  // Structuurformule ethanol — strakkere bindingen, O in rood, hydroxyl gemarkeerd
  ethanol:`<svg viewBox="0 0 340 188" role="img" aria-label="structuurformule van ethanol"><rect x="210" y="50" width="80" height="56" rx="10" fill="#fff7ed" stroke="#e8580c" stroke-width="1.6" stroke-dasharray="6 4"/><g stroke="#1b2230" stroke-width="2" stroke-linecap="round"><line x1="118" y1="98" x2="176" y2="98"/><line x1="176" y1="98" x2="232" y2="98"/><line x1="234" y1="92" x2="266" y2="70"/><line x1="118" y1="90" x2="118" y2="62"/><line x1="118" y1="106" x2="118" y2="134"/><line x1="110" y1="98" x2="86" y2="98"/><line x1="176" y1="90" x2="176" y2="62"/><line x1="176" y1="106" x2="176" y2="134"/></g><g font-family="Georgia,serif" font-size="17" font-weight="700" fill="#1b2230" text-anchor="middle"><text x="118" y="104">C</text><text x="176" y="104">C</text><text x="232" y="104" fill="#c3352b">O</text></g><g font-family="Georgia,serif" font-size="13" fill="#5a6472" text-anchor="middle"><text x="118" y="56">H</text><text x="118" y="150">H</text><text x="78" y="102">H</text><text x="176" y="56">H</text><text x="176" y="150">H</text><text x="274" y="66">H</text></g><text x="250" y="126" font-family="sans-serif" font-size="10.5" font-weight="800" fill="#e8580c" text-anchor="middle">hydroxylgroep</text></svg>`,
};

SLAGIO_EXAMENS.havo.sk = {
  origineel: true,
  titel: 'Scheikunde',
  niveau: 'havo',
  jaar: new Date().getFullYear(),
  duur_minuten: 110,
  max_punten: 36,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Aardgas verbranden',
      context:'Aardgas bestaat vooral uit methaan (CH₄). Bij het branden van een gasfornuis reageert methaan met zuurstof uit de lucht. Afbeelding 1 toont deze reactie met molecuulmodellen. Molaire massa\'s: M(CH₄) = 16 g/mol, M(CO₂) = 44 g/mol.',
      afb:_SKAFB.verbranding, afb_cap:'afbeelding 1 — de verbranding van methaan in molecuulmodellen' },
    { nr:2, titel:'Energie bij een reactie',
      context:'De verbranding van methaan is een exotherme reactie. Afbeelding 2 is het energiediagram van deze reactie.',
      afb:_SKAFB.energie, afb_cap:'afbeelding 2 — energiediagram van een exotherme reactie' },
    { nr:3, titel:'Waterstof uit magnesium',
      context:'Een leerling laat magnesium volledig reageren met een overmaat zoutzuur (HCl):\nMg + 2 HCl → MgCl₂ + H₂\nHet waterstofgas wordt opgevangen; afbeelding 3 toont het volume tegen de tijd. Gegeven: M(Mg) = 24 g/mol; molair volume Vm = 24·10³ mL/mol (24 dm³/mol). De leerling gebruikt 0,12 g magnesium en 50 mL zoutzuur met concentratie 2,0 mol/L.',
      afb:_SKAFB.gasvolume, afb_cap:'afbeelding 3 — opgevangen volume waterstofgas tegen de tijd' },
    { nr:4, titel:'Oplossen en kristalliseren',
      context:'Afbeelding 4 toont de oplosbaarheid van een zout in water: het aantal gram dat bij elke temperatuur maximaal oplost in 100 g water.',
      afb:_SKAFB.oplosbaarheid, afb_cap:'afbeelding 4 — oplosbaarheid van het zout tegen de temperatuur' },
    { nr:5, titel:'Zuur en base',
      context:'Afbeelding 5 is een pH-schaal met een aantal stoffen erop. Op de pH-schaal betekent één eenheid verschil een factor 10 in de concentratie H⁺-ionen.',
      afb:_SKAFB.ph, afb_cap:'afbeelding 5 — de pH-schaal met voorbeelden' },
    { nr:6, titel:'Alcohol als brandstof',
      context:'Ethanol (afbeelding 6) wordt als biobrandstof gebruikt. Molaire massa M(C₂H₆O) = 46 g/mol; atoommassa\'s: C = 12, H = 1, O = 16.',
      afb:_SKAFB.ethanol, afb_cap:'afbeelding 6 — de structuurformule van ethanol' },
  ],
  vragen: [
    // ── Opgave 1 · Verbranding ──
    { nr:1, opgave:1, punten:2, type:'open', domein:'Reacties',
      vraag:'Geef de kloppende reactievergelijking van de volledige verbranding van methaan en laat met de atoomaantallen zien dat hij klopt.',
      antwoord:'CH₄ + 2 O₂ → CO₂ + 2 H₂O. Controle: C 1 → 1; H 4 → 4; O 4 (uit 2 O₂) → 2 (in CO₂) + 2 (in 2 H₂O) = 4. Links en rechts even veel atomen, dus de vergelijking klopt.',
      antwoord_rubric:'1 punt: juiste begin- en eindstoffen. 1 punt: juiste coëfficiënten (2 O₂, 2 H₂O) mét kloppende atoomcontrole.' },
    { nr:2, opgave:1, punten:3, type:'open', domein:'Rekenen',
      vraag:'Een brander verbruikt 8,0 g methaan. Bereken hoeveel gram koolstofdioxide daarbij ontstaat. Laat de mol-stappen zien.',
      antwoord:'n(CH₄) = m/M = 8,0 ÷ 16 = 0,50 mol. Uit de reactievergelijking is de molverhouding CH₄ : CO₂ = 1 : 1, dus n(CO₂) = 0,50 mol. m(CO₂) = n·M = 0,50 × 44 = 22 g CO₂.',
      antwoord_rubric:'1 punt: n(CH₄) = 8,0/16 = 0,50 mol. 1 punt: molverhouding 1 : 1 → n(CO₂) = 0,50 mol. 1 punt: m = 0,50 × 44 = 22 g.' },
    { nr:3, opgave:1, punten:2, type:'open', domein:'Reacties',
      vraag:'Bij te weinig zuurstof ontstaat het giftige koolstofmonoöxide (CO) in plaats van CO₂. Leg uit waarom een cv-ketel voldoende luchttoevoer nodig heeft en geef aan hoe je aan de formules ziet dat CO bij zuurstoftekort ontstaat.',
      antwoord:'Met genoeg zuurstof verloopt de verbranding volledig tot CO₂. Bij te weinig zuurstof is er per koolstofatoom niet genoeg zuurstof beschikbaar, waardoor er maar één zuurstofatoom per koolstof wordt gebonden: er ontstaat CO (één O) in plaats van CO₂ (twee O). Voldoende luchttoevoer voorkomt dus de vorming van giftig CO.',
      antwoord_rubric:'1 punt: genoeg zuurstof → volledige verbranding → CO₂ i.p.v. giftig CO. 1 punt: bij zuurstoftekort maar 1 O per C beschikbaar → CO (1 O) i.p.v. CO₂ (2 O).' },
    // ── Opgave 2 · Energie ──
    { nr:4, opgave:2, punten:2, type:'open', domein:'Energie',
      vraag:'Leg met afbeelding 2 uit dat deze reactie exotherm is, en benoem welk pijltje in de figuur het energie-effect van de reactie voorstelt.',
      antwoord:'De reactieproducten liggen in het diagram lager (minder energie) dan de beginstoffen. Het verschil komt tijdens de reactie vrij aan de omgeving, dus de reactie is exotherm. Het groene pijltje "energie-effect" (het hoogteverschil tussen beginstoffen en producten) stelt de vrijgekomen energie voor.',
      antwoord_rubric:'1 punt: producten liggen lager → er komt netto energie vrij → exotherm. 1 punt: het groene pijl (hoogteverschil begin–eind) = het energie-effect.' },
    { nr:5, opgave:2, punten:2, type:'open', domein:'Energie',
      vraag:'Ondanks dat de reactie energie oplevert, brandt aardgas pas na een vonk. Leg dit uit met de activeringsenergie (Eₐ), en beschrijf wat een katalysator in dit diagram zou veranderen en wat niet.',
      antwoord:'Eerst moet de drempel Eₐ (de "berg" in de figuur) worden overwonnen voordat de reactie op gang komt; de vonk levert die startenergie. Een katalysator verlaagt Eₐ: de piek in het diagram zakt, waardoor de reactie sneller/bij lagere temperatuur verloopt. Het niveau van de beginstoffen en de producten — en dus het energie-effect — verandert daarbij niet.',
      antwoord_rubric:'1 punt: Eₐ is de drempel die eerst geleverd moet worden (vonk = startenergie). 1 punt: katalysator verlaagt de piek Eₐ, maar begin-/eindniveau (energie-effect) blijft gelijk.' },
    // ── Opgave 3 · Rekenen ──
    { nr:6, opgave:3, punten:3, type:'open', domein:'Rekenen',
      vraag:'Bereken met de reactievergelijking en het molair volume welk volume waterstofgas de 0,12 g magnesium oplevert. Laat zien dat dit past bij het eindvolume in afbeelding 3.',
      antwoord:'n(Mg) = 0,12 ÷ 24 = 0,0050 mol. Molverhouding Mg : H₂ = 1 : 1, dus n(H₂) = 0,0050 mol. V(H₂) = n·Vm = 0,0050 × 24·10³ = 120 mL. Dat komt overeen met het plateau op 120 mL in afbeelding 3.',
      antwoord_rubric:'1 punt: n(Mg) = 0,0050 mol. 1 punt: molverhouding 1 : 1 → n(H₂) = 0,0050 mol. 1 punt: V = 0,0050 × 24·10³ = 120 mL, gekoppeld aan het plateau.' },
    { nr:7, opgave:3, punten:3, type:'open', domein:'Rekenen',
      vraag:'Toon met een berekening aan dat het zoutzuur (50 mL; 2,0 mol/L) inderdaad in overmaat is ten opzichte van het magnesium.',
      antwoord:'Aanwezig: n(HCl) = c·V = 2,0 mol/L × 0,050 L = 0,10 mol. Nodig volgens de verhouding Mg : HCl = 1 : 2: voor 0,0050 mol Mg is 2 × 0,0050 = 0,010 mol HCl nodig. Er is 0,10 mol aanwezig, veel meer dan de benodigde 0,010 mol (factor 10). Het zoutzuur is dus ruim in overmaat; het magnesium is de beperkende stof.',
      antwoord_rubric:'1 punt: n(HCl) aanwezig = 2,0 × 0,050 = 0,10 mol. 1 punt: benodigd = 2 × 0,0050 = 0,010 mol (verhouding 1 : 2). 1 punt: 0,10 > 0,010 → HCl in overmaat (Mg beperkend).' },
    { nr:8, opgave:3, punten:2, type:'open', domein:'Rekenen',
      vraag:'De grafiek loopt eerst steil en wordt daarna horizontaal. Leg met het begrip beperkende stof uit waarom de lijn een horizontaal plateau bereikt.',
      antwoord:'In het begin is er veel magnesium, dus wordt er per seconde veel H₂ gevormd (steile lijn). Het magnesium is de beperkende stof en raakt op; het zoutzuur is nog over (overmaat). Zodra al het magnesium is opgebruikt, kan er geen H₂ meer gevormd worden en blijft het volume constant: de lijn wordt horizontaal.',
      antwoord_rubric:'1 punt: reactie vertraagt doordat de beperkende stof (Mg) opraakt. 1 punt: als Mg volledig op is stopt de gasvorming → plateau.' },
    // ── Opgave 4 · Oplosbaarheid ──
    { nr:9, opgave:4, punten:3, type:'open', domein:'Stoffen',
      vraag:'Bij 60 °C lost een leerling 50 g van het zout volledig op in 100 g water. De oplossing wordt afgekoeld tot 30 °C. Bepaal met afbeelding 4 hoeveel gram zout dan uitkristalliseert.',
      antwoord:'Bij 30 °C is de oplosbaarheid 40 g per 100 g water (aflezen via de stippellijnen). Meer dan 40 g kan er bij 30 °C niet opgelost blijven. Van de 50 g blijft dus 40 g opgelost en kristalliseert 50 − 40 = 10 g uit.',
      antwoord_rubric:'1 punt: oplosbaarheid bij 30 °C = 40 g/100 g aflezen. 1 punt: bij 30 °C blijft maximaal 40 g opgelost. 1 punt: 50 − 40 = 10 g kristalliseert uit.' },
    { nr:10, opgave:4, punten:2, type:'open', domein:'Stoffen',
      vraag:'Leg met de vorm van de curve uit waarom je een zout beter kunt zuiveren door het warm op te lossen en daarna af te koelen, dan door het bij kamertemperatuur op te lossen.',
      antwoord:'De curve stijgt met de temperatuur: bij hoge temperatuur lost veel meer zout op dan bij lage. Door warm op te lossen krijg je een geconcentreerde oplossing; bij afkoelen daalt de oplosbaarheid sterk, waardoor het zuivere zout weer uitkristalliseert terwijl verontreinigingen (in kleine hoeveelheid) opgelost blijven. Bij kamertemperatuur is dat verschil in oplosbaarheid veel kleiner, dus kristalliseert er veel minder terug.',
      antwoord_rubric:'1 punt: oplosbaarheid is hoog bij hoge temperatuur en veel lager bij lage temperatuur (curve stijgt). 1 punt: het grote verschil zorgt bij afkoelen voor veel (zuivere) kristallen; bij kamertemperatuur is dat verschil klein.' },
    // ── Opgave 5 · Zuur en base ──
    { nr:11, opgave:5, punten:2, type:'open', domein:'Zuren',
      vraag:'Citroensap heeft pH 2, zwart koffie ongeveer pH 5. Bereken hoeveel keer zo groot de concentratie H⁺-ionen in citroensap is vergeleken met koffie, en licht je antwoord toe met de pH-schaal.',
      antwoord:'Het verschil is 5 − 2 = 3 pH-eenheden. Elke eenheid lager betekent een factor 10 meer H⁺-ionen, dus 3 eenheden geven 10 × 10 × 10 = 10³ = 1000 keer zo veel H⁺. De concentratie H⁺ in citroensap is 1000 keer zo groot als in koffie.',
      antwoord_rubric:'1 punt: verschil van 3 pH-eenheden en per eenheid een factor 10. 1 punt: 10³ = 1000 keer zo veel H⁺.' },
    { nr:12, opgave:5, punten:2, type:'open', domein:'Zuren',
      vraag:'Je voegt aan citroensap steeds meer water toe. Leg uit in welke richting de pH verschuift en waarom de pH door verdunnen nooit boven 7 kan uitkomen.',
      antwoord:'Door water toe te voegen verdun je het zuur: de concentratie H⁺-ionen daalt, de oplossing wordt minder zuur en de pH stijgt richting 7. Water zelf is neutraal (pH 7), dus verdunnen laat de pH hooguit naar 7 naderen maar er niet bovenuit komen; daarvoor zou je een base moeten toevoegen.',
      antwoord_rubric:'1 punt: verdunnen → lagere H⁺-concentratie → pH stijgt richting 7. 1 punt: water is neutraal (pH 7), dus pH nadert 7 maar komt er niet boven zonder base.' },
    { nr:13, opgave:5, punten:2, type:'open', domein:'Zuren',
      vraag:'Bij te veel maagzuur (zoutzuur, HCl) helpt een tabletje met de base natriumwaterstofcarbonaat. Benoem het type reactie dat optreedt en leg uit waarom de klachten daardoor afnemen.',
      antwoord:'Er treedt een neutralisatiereactie op: de base reageert met het zuur (HCl), waarbij ze elkaar opheffen en er onder andere water en een zout (en CO₂) ontstaan. Doordat een deel van het maagzuur wordt weggenomen, daalt de concentratie H⁺ en stijgt de pH in de maag; de maaginhoud wordt minder zuur, waardoor de klachten afnemen.',
      antwoord_rubric:'1 punt: neutralisatie(reactie) tussen zuur en base (zuur wordt weggenomen). 1 punt: minder H⁺ → pH stijgt → minder zuur → minder klachten.' },
    // ── Opgave 6 · Alcohol ──
    { nr:14, opgave:6, punten:2, type:'open', domein:'Koolstof',
      vraag:'Geef de reactievergelijking van de volledige verbranding van ethanol (C₂H₆O) en maak hem kloppend.',
      antwoord:'C₂H₆O + 3 O₂ → 2 CO₂ + 3 H₂O. Controle: C 2 → 2; H 6 → 6; O (1 uit ethanol + 6 uit 3 O₂ = 7) → (4 uit 2 CO₂ + 3 uit 3 H₂O = 7). De vergelijking klopt.',
      antwoord_rubric:'1 punt: juiste begin- en eindstoffen. 1 punt: kloppende coëfficiënten 3 O₂ → 2 CO₂ + 3 H₂O (met de O uit ethanol meegeteld).' },
    { nr:15, opgave:6, punten:3, type:'open', domein:'Rekenen',
      vraag:'Bereken het massapercentage koolstof in ethanol (C₂H₆O). Laat je berekening zien.',
      antwoord:'Massa koolstof per mol ethanol = 2 × 12 = 24 g; totale molaire massa = 46 g/mol. Massapercentage C = (24 ÷ 46) × 100% = 52% (afgerond).',
      antwoord_rubric:'1 punt: massa C = 2 × 12 = 24 g per mol. 1 punt: deling door de molaire massa 46. 1 punt: (24/46) × 100% ≈ 52%.' },
    { nr:16, opgave:6, punten:1, type:'open', domein:'Koolstof',
      vraag:'Dimethylether heeft dezelfde molecuulformule C₂H₆O als ethanol, maar een andere structuur. Hoe noem je twee zulke stoffen?',
      antwoord:'Isomeren: stoffen met dezelfde molecuulformule maar een verschillende structuurformule (en daardoor andere eigenschappen).',
      antwoord_rubric:'1 punt: isomeren.' },
  ],
};
