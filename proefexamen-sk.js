// ═══════════════════════════════════════════════════════════════════════
// proefexamen-sk.js — ORIGINEEL Slagio-proefexamen in examenstijl (havo sk).
// Eigen contexten, vragen en figuren. Géén reproductie van een CvTE-examen.
// Vraagstelling op CE-niveau: reactievergelijkingen, rekenen (mol/massa/
// volume) en redeneren, met een meervoudige nakijkrubric per vraag.
// Elke opgave heeft een grafiek/diagram/structuurformule.
//   opgaven[] = {nr,titel,context,afb,afb_cap}
//   vragen[]  = {nr,opgave,punten,type,vraag,antwoord,antwoord_rubric,domein}
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.havo = SLAGIO_EXAMENS.havo || {};

var _SKAFB = {
  // Molecuulmodel van de verbranding van methaan (C zwart, H wit, O rood)
  verbranding:`<svg viewBox="0 0 360 214" role="img" aria-label="molecuulmodel van de verbranding van methaan"><g stroke="#1b2230" stroke-width="1.4"><line x1="54" y1="66" x2="54" y2="44"/><line x1="54" y1="66" x2="54" y2="88"/><line x1="54" y1="66" x2="34" y2="66"/><line x1="54" y1="66" x2="74" y2="66"/></g><circle cx="54" cy="66" r="9" fill="#2b2f36"/><circle cx="54" cy="42" r="6" fill="#eef2f7" stroke="#9aa5b5"/><circle cx="54" cy="90" r="6" fill="#eef2f7" stroke="#9aa5b5"/><circle cx="32" cy="66" r="6" fill="#eef2f7" stroke="#9aa5b5"/><circle cx="76" cy="66" r="6" fill="#eef2f7" stroke="#9aa5b5"/><text x="96" y="72" font-family="sans-serif" font-size="16" fill="#1b2230">+</text><text x="112" y="48" font-family="sans-serif" font-size="12" font-weight="700" fill="#1b2230">2</text><g stroke="#1b2230" stroke-width="1.4"><line x1="126" y1="44" x2="144" y2="44"/><line x1="126" y1="86" x2="144" y2="86"/></g><circle cx="126" cy="44" r="7.5" fill="#e05353"/><circle cx="144" cy="44" r="7.5" fill="#e05353"/><circle cx="126" cy="86" r="7.5" fill="#e05353"/><circle cx="144" cy="86" r="7.5" fill="#e05353"/><g stroke="#1b2230" stroke-width="2" fill="none"><line x1="168" y1="66" x2="204" y2="66"/><path d="M197 61 L206 66 L197 71"/></g><g stroke="#1b2230" stroke-width="1.4"><line x1="240" y1="66" x2="222" y2="66"/><line x1="240" y1="66" x2="258" y2="66"/></g><circle cx="222" cy="66" r="7.5" fill="#e05353"/><circle cx="240" cy="66" r="9" fill="#2b2f36"/><circle cx="258" cy="66" r="7.5" fill="#e05353"/><text x="278" y="72" font-family="sans-serif" font-size="16" fill="#1b2230">+</text><text x="294" y="48" font-family="sans-serif" font-size="12" font-weight="700" fill="#1b2230">2</text><g stroke="#1b2230" stroke-width="1.4"><line x1="314" y1="52" x2="302" y2="42"/><line x1="314" y1="52" x2="326" y2="42"/></g><circle cx="314" cy="52" r="7.5" fill="#e05353"/><circle cx="300" cy="40" r="5.5" fill="#eef2f7" stroke="#9aa5b5"/><circle cx="328" cy="40" r="5.5" fill="#eef2f7" stroke="#9aa5b5"/><g stroke="#1b2230" stroke-width="1.4"><line x1="314" y1="96" x2="302" y2="86"/><line x1="314" y1="96" x2="326" y2="86"/></g><circle cx="314" cy="96" r="7.5" fill="#e05353"/><circle cx="300" cy="84" r="5.5" fill="#eef2f7" stroke="#9aa5b5"/><circle cx="328" cy="84" r="5.5" fill="#eef2f7" stroke="#9aa5b5"/><g font-family="sans-serif" font-size="10" fill="#4a5568"><circle cx="60" cy="150" r="6" fill="#2b2f36"/><text x="72" y="154">C</text><circle cx="150" cy="150" r="6" fill="#eef2f7" stroke="#9aa5b5"/><text x="162" y="154">H</text><circle cx="238" cy="150" r="6" fill="#e05353"/><text x="250" y="154">O</text></g></svg>`,
  // Energiediagram van een exotherme reactie (Ea en energiewinst)
  energie:`<svg viewBox="0 0 360 200" role="img" aria-label="energiediagram van een exotherme reactie"><line x1="52" y1="14" x2="52" y2="168" stroke="#1b2230" stroke-width="2"/><line x1="52" y1="168" x2="344" y2="168" stroke="#1b2230" stroke-width="2"/><path d="M70 92 L118 92 C150 92 156 44 182 44 C210 44 214 128 250 128 L322 128" fill="none" stroke="#e8580c" stroke-width="2.8" stroke-linecap="round"/><g stroke="#1b2230" stroke-width="1.2" stroke-dasharray="4 3"><line x1="118" y1="92" x2="182" y2="92"/></g><g stroke="#2563eb" stroke-width="1.4"><line x1="150" y1="92" x2="150" y2="44"/><path d="M146 50 L150 42 L154 50"/><path d="M146 86 L150 94 L154 86"/></g><text x="158" y="72" font-family="sans-serif" font-size="11" font-weight="700" fill="#2563eb">Ea</text><g stroke="#2e9e5b" stroke-width="1.4"><line x1="300" y1="92" x2="300" y2="128"/><path d="M296 122 L300 130 L304 122"/></g><text x="308" y="114" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#2e9e5b">energie<tspan x="308" dy="12">komt vrij</tspan></text><g font-family="sans-serif" font-size="10" fill="#4a5568"><text x="72" y="86">beginstoffen</text><text x="256" y="146">producten</text></g><text x="0" y="0" transform="translate(18,150) rotate(-90)" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1b2230" text-anchor="middle">energie</text><text x="250" y="188" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1b2230" text-anchor="middle">reactieverloop &#8594;</text></svg>`,
  // Gasvolume tegen tijd: reactie die tot stilstand komt (plateau)
  gasvolume:`<svg viewBox="0 0 360 192" role="img" aria-label="volume waterstofgas tegen de tijd"><line x1="52" y1="14" x2="52" y2="158" stroke="#1b2230" stroke-width="2"/><line x1="52" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M60 150 Q120 150 150 96 Q185 56 250 52 L332 52" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/><line x1="52" y1="52" x2="250" y2="52" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><text x="40" y="56" font-family="sans-serif" font-size="10" fill="#4a5568" text-anchor="end">120</text><text x="0" y="0" transform="translate(18,150) rotate(-90)" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1b2230" text-anchor="middle">volume H&#8322; (mL)</text><text x="270" y="180" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1b2230" text-anchor="middle">tijd (s) &#8594;</text></svg>`,
  // Oplosbaarheidscurve (g per 100 g water tegen temperatuur)
  oplosbaarheid:`<svg viewBox="0 0 360 192" role="img" aria-label="oplosbaarheid tegen temperatuur"><line x1="52" y1="14" x2="52" y2="158" stroke="#1b2230" stroke-width="2"/><line x1="52" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M60 146 Q150 138 210 96 Q280 48 332 32" fill="none" stroke="#e8580c" stroke-width="3" stroke-linecap="round"/><line x1="210" y1="96" x2="52" y2="96" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><line x1="210" y1="96" x2="210" y2="158" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><circle cx="210" cy="96" r="3.4" fill="#1b2230"/><g font-family="sans-serif" font-size="10" fill="#4a5568"><text x="46" y="100" text-anchor="end">40</text><text x="210" y="172" text-anchor="middle">30</text></g><text x="0" y="0" transform="translate(18,150) rotate(-90)" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1b2230" text-anchor="middle">oplosbaarheid (g/100 g)</text><text x="250" y="188" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1b2230" text-anchor="middle">temperatuur (&#176;C)</text></svg>`,
  // pH-schaal met voorbeelden
  ph:`<svg viewBox="0 0 360 170" role="img" aria-label="pH-schaal van 0 tot 14"><defs><linearGradient id="phg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d1382f"/><stop offset="0.35" stop-color="#e88b2e"/><stop offset="0.5" stop-color="#5fbf4f"/><stop offset="0.62" stop-color="#3aa0a6"/><stop offset="1" stop-color="#5b57c4"/></linearGradient></defs><rect x="34" y="86" width="300" height="26" rx="5" fill="url(#phg)" stroke="#1b2230" stroke-width="1.2"/><g font-family="sans-serif" font-size="9.5" fill="#1b2230" text-anchor="middle">${Array.from({length:8},(_,i)=>{var p=i*2;var x=34+(p/14)*300;return '<line x1="'+x+'" y1="112" x2="'+x+'" y2="118" stroke="#1b2230" stroke-width="1"/><text x="'+x+'" y="130">'+p+'</text>';}).join('')}</g><g font-family="sans-serif" font-size="9.5" fill="#4a5568" text-anchor="middle"><line x1="76" y1="86" x2="76" y2="72" stroke="#4a5568" stroke-width="1"/><text x="76" y="66">citroensap<tspan x="76" dy="11">pH 2</tspan></text><line x1="184" y1="86" x2="184" y2="72" stroke="#4a5568" stroke-width="1"/><text x="184" y="66">water<tspan x="184" dy="11">pH 7</tspan></text><line x1="313" y1="86" x2="313" y2="72" stroke="#4a5568" stroke-width="1"/><text x="313" y="66">ontstopper<tspan x="313" dy="11">pH 13</tspan></text></g><g font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1b2230"><text x="34" y="152">zuur</text><text x="184" y="152" text-anchor="middle">neutraal</text><text x="334" y="152" text-anchor="end">basisch</text></g></svg>`,
  // Structuurformule van ethanol
  ethanol:`<svg viewBox="0 0 340 190" role="img" aria-label="structuurformule van ethanol"><g stroke="#1b2230" stroke-width="1.6"><line x1="118" y1="96" x2="176" y2="96"/><line x1="176" y1="96" x2="234" y2="96"/><line x1="234" y1="96" x2="272" y2="70"/><line x1="118" y1="96" x2="118" y2="60"/><line x1="118" y1="96" x2="118" y2="132"/><line x1="118" y1="96" x2="86" y2="96"/><line x1="176" y1="96" x2="176" y2="60"/><line x1="176" y1="96" x2="176" y2="132"/></g><g font-family="sans-serif" font-size="16" font-weight="700" fill="#1b2230" text-anchor="middle"><text x="118" y="102">C</text><text x="176" y="102">C</text><text x="234" y="102" fill="#e05353">O</text></g><g font-family="sans-serif" font-size="13" fill="#4a5568" text-anchor="middle"><text x="118" y="54">H</text><text x="118" y="146">H</text><text x="80" y="100">H</text><text x="176" y="54">H</text><text x="176" y="146">H</text><text x="280" y="66">H</text></g><rect x="214" y="52" width="74" height="52" rx="8" fill="none" stroke="#e8580c" stroke-width="1.6" stroke-dasharray="5 4"/><text x="251" y="128" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#e8580c" text-anchor="middle">hydroxylgroep</text></svg>`,
};

SLAGIO_EXAMENS.havo.sk = {
  origineel: true,
  titel: 'Scheikunde',
  niveau: 'havo',
  jaar: new Date().getFullYear(),
  duur_minuten: 100,
  max_punten: 34,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Aardgas verbranden',
      context:'Aardgas bestaat vooral uit methaan (CH₄). Bij het branden van een gasfornuis reageert methaan met zuurstof uit de lucht. Afbeelding 1 toont deze reactie met molecuulmodellen (koolstof = zwart, waterstof = wit, zuurstof = rood).',
      afb:_SKAFB.verbranding, afb_cap:'afbeelding 1 — de verbranding van methaan in molecuulmodellen' },
    { nr:2, titel:'Energie bij een reactie',
      context:'De verbranding van methaan is een exotherme reactie. Afbeelding 2 is het energiediagram van deze reactie.',
      afb:_SKAFB.energie, afb_cap:'afbeelding 2 — energiediagram van een exotherme reactie' },
    { nr:3, titel:'Waterstof uit magnesium',
      context:'Voor een practicum laat een leerling magnesium reageren met zoutzuur (HCl). Daarbij ontstaat magnesiumchloride en waterstofgas:\nMg + 2 HCl → MgCl₂ + H₂\nHet ontstane waterstofgas wordt opgevangen. Afbeelding 3 toont het opgevangen volume H₂ tegen de tijd. Molaire massa Mg = 24 g/mol; molair volume = 24 dm³/mol (24 000 mL/mol).',
      afb:_SKAFB.gasvolume, afb_cap:'afbeelding 3 — opgevangen volume waterstofgas tegen de tijd' },
    { nr:4, titel:'Oplossen en kristalliseren',
      context:'Afbeelding 4 toont de oplosbaarheid van een zout in water: het aantal gram dat bij elke temperatuur maximaal oplost in 100 g water.',
      afb:_SKAFB.oplosbaarheid, afb_cap:'afbeelding 4 — oplosbaarheid van het zout tegen de temperatuur' },
    { nr:5, titel:'Zuur en base',
      context:'Afbeelding 5 is een pH-schaal met een aantal stoffen erop.',
      afb:_SKAFB.ph, afb_cap:'afbeelding 5 — de pH-schaal met voorbeelden' },
    { nr:6, titel:'Alcohol',
      context:'Ethanol is de alcohol in bier en wijn en wordt ook als brandstof gebruikt. Afbeelding 6 toont de structuurformule van ethanol.',
      afb:_SKAFB.ethanol, afb_cap:'afbeelding 6 — de structuurformule van ethanol' },
  ],
  vragen: [
    // ── Opgave 1 · Verbranding ──
    { nr:1, opgave:1, punten:2, type:'open', domein:'Reacties',
      vraag:'Geef de kloppende reactievergelijking van de verbranding van methaan (met toestandsaanduidingen mag, maar hoeft niet).',
      antwoord:'CH₄ + 2 O₂ → CO₂ + 2 H₂O. Controle: C 1→1, H 4→4, O 4→2+2 = 4. De vergelijking klopt.',
      antwoord_rubric:'1 punt: juiste begin- en eindstoffen (CH₄ + O₂ → CO₂ + H₂O). 1 punt: juiste coëfficiënten (2 O₂ en 2 H₂O) zodat alle atomen kloppen.' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Reacties',
      vraag:'Leg met afbeelding 1 uit dat bij deze reactie de wet van behoud van massa geldt, ook al ontstaan er heel andere stoffen.',
      antwoord:'Voor en na de reactie zijn er precies evenveel atomen van elke soort: 1 C, 4 H en 4 O. Er verdwijnen of ontstaan geen atomen; ze worden alleen anders gegroepeerd tot nieuwe moleculen. Omdat de atomen en dus de massa behouden blijven, is de totale massa vóór en na de reactie gelijk (behoud van massa).',
      antwoord_rubric:'1 punt: evenveel atomen van elke soort voor en na (met de aantallen uit de figuur, bv. 4 H en 4 O). 1 punt: atomen worden alleen hergroepeerd → geen massa verloren/gemaakt.' },
    { nr:3, opgave:1, punten:2, type:'open', domein:'Reacties',
      vraag:'Bij onvolledige verbranding (te weinig zuurstof) ontstaat naast water ook het giftige koolstofmonoöxide in plaats van koolstofdioxide. Leg uit waarom een cv-ketel daarom genoeg luchttoevoer moet hebben, en noem het verschil in formule tussen de twee koolstofoxiden.',
      antwoord:'Met genoeg zuurstof verloopt de verbranding volledig en ontstaat het ongevaarlijke CO₂. Bij te weinig zuurstof verbrandt de koolstof onvolledig en ontstaat CO (koolstofmonoöxide), dat giftig is. Genoeg luchttoevoer zorgt dus voor volledige verbranding en voorkomt de vorming van giftig CO. Verschil: CO₂ heeft twee zuurstofatomen per koolstofatoom, CO maar één.',
      antwoord_rubric:'1 punt: genoeg zuurstof → volledige verbranding → CO₂ i.p.v. giftig CO. 1 punt: CO₂ heeft 2 O per C, CO heeft 1 O per C.' },
    // ── Opgave 2 · Energie ──
    { nr:4, opgave:2, punten:2, type:'open', domein:'Energie',
      vraag:'Leg met afbeelding 2 uit dat deze reactie exotherm is.',
      antwoord:'In het diagram liggen de reactieproducten lager (minder energie) dan de beginstoffen. Het energieverschil komt tijdens de reactie vrij aan de omgeving (bv. als warmte). Omdat er netto energie vrijkomt, is de reactie exotherm.',
      antwoord_rubric:'1 punt: producten liggen lager dan de beginstoffen in het diagram. 1 punt: er komt (netto) energie vrij → exotherm.' },
    { nr:5, opgave:2, punten:2, type:'open', domein:'Energie',
      vraag:'Ondanks dat de reactie energie oplevert, begint aardgas pas te branden na een vonk of vlam. Leg dit uit met het begrip activeringsenergie (Ea in afbeelding 2).',
      antwoord:'Voordat de reactie kan verlopen, moet er eerst een drempel aan energie worden geleverd: de activeringsenergie (Ea in de figuur, de "berg" die eerst omhoog gaat). De vonk of vlam levert die startenergie. Pas als de moleculen genoeg energie hebben om de berg over te komen, begint de reactie; daarna komt er zoveel energie vrij dat hij vanzelf doorgaat.',
      antwoord_rubric:'1 punt: er is eerst activeringsenergie nodig om de reactie op gang te brengen (de "berg" in het diagram). 1 punt: de vonk/vlam levert die startenergie.' },
    { nr:6, opgave:2, punten:2, type:'open', domein:'Energie',
      vraag:'Een katalysator verlaagt de activeringsenergie. Teken in woorden wat er in het energiediagram verandert als je een katalysator toevoegt, en wat níet verandert.',
      antwoord:'De "berg" (de activeringsenergie Ea) wordt lager: de piek in het diagram zakt. Daardoor kan de reactie sneller/al bij lagere temperatuur verlopen. Het niveau van de beginstoffen en van de producten verandert níet, dus ook de vrijgekomen energie (het hoogteverschil tussen begin en eind) blijft gelijk.',
      antwoord_rubric:'1 punt: de piek/activeringsenergie wordt lager. 1 punt: begin- en eindniveau (en dus de vrijgekomen energie) blijven gelijk.' },
    // ── Opgave 3 · Rekenen ──
    { nr:7, opgave:3, punten:2, type:'open', domein:'Rekenen',
      vraag:'De leerling gebruikt 0,12 g magnesium, dat volledig reageert. Bereken hoeveel mol magnesium dat is.',
      antwoord:'n = m ÷ M = 0,12 g ÷ 24 g/mol = 0,0050 mol magnesium (5,0 × 10⁻³ mol).',
      antwoord_rubric:'1 punt: n = massa ÷ molaire massa. 1 punt: 0,12 ÷ 24 = 0,0050 mol.' },
    { nr:8, opgave:3, punten:3, type:'open', domein:'Rekenen',
      vraag:'Bereken met de reactievergelijking en het molair volume (24 000 mL/mol) welk volume waterstofgas hierbij ontstaat. Laat zien dat dit past bij het eindvolume in afbeelding 3.',
      antwoord:'Uit Mg + 2 HCl → MgCl₂ + H₂ volgt de molverhouding Mg : H₂ = 1 : 1, dus er ontstaat ook 0,0050 mol H₂. Volume = n × molair volume = 0,0050 × 24 000 = 120 mL. Dat komt overeen met het plateau in afbeelding 3 op 120 mL, waar de reactie is afgelopen.',
      antwoord_rubric:'1 punt: molverhouding Mg : H₂ = 1 : 1 → 0,0050 mol H₂. 1 punt: V = 0,0050 × 24 000 = 120 mL. 1 punt: koppeling aan het plateau van 120 mL in de grafiek.' },
    { nr:9, opgave:3, punten:2, type:'open', domein:'Rekenen',
      vraag:'De grafiek in afbeelding 3 loopt eerst steil en wordt daarna vlak. Leg uit waarom de lijn steeds vlakker wordt en uiteindelijk horizontaal loopt.',
      antwoord:'In het begin is er veel magnesium en zuur, dus verloopt de reactie snel en wordt er per seconde veel H₂ gevormd (steile lijn). Naarmate er magnesium wordt verbruikt, is er minder over om te reageren, dus gaat de gasvorming langzamer (de lijn wordt vlakker). Als het magnesium (of het zuur) helemaal op is, stopt de reactie en komt er geen gas meer bij: de lijn wordt horizontaal.',
      antwoord_rubric:'1 punt: minder beginstof over → reactie verloopt langzamer → lijn vlakker. 1 punt: beginstof op → reactie stopt → horizontaal (plateau).' },
    // ── Opgave 4 · Oplosbaarheid ──
    { nr:10, opgave:4, punten:2, type:'open', domein:'Stoffen',
      vraag:'Lees met afbeelding 4 af hoeveel gram van het zout bij 30 °C maximaal oplost in 100 g water, en leg uit wat je dan een verzadigde oplossing noemt.',
      antwoord:'Bij 30 °C is de oplosbaarheid ongeveer 40 g per 100 g water (aflezen via de stippellijnen). Een verzadigde oplossing is een oplossing waarin bij die temperatuur het maximale oplost: er kan geen zout meer bij opgelost worden, extra zout blijft als vaste stof op de bodem liggen.',
      antwoord_rubric:'1 punt: ± 40 g per 100 g water bij 30 °C (aflezen). 1 punt: verzadigd = maximale hoeveelheid opgelost, meer lost niet meer op.' },
    { nr:11, opgave:4, punten:2, type:'open', domein:'Stoffen',
      vraag:'Een verzadigde oplossing van dit zout wordt afgekoeld. Leg met de vorm van de curve uit waarom er dan vaste zoutkristallen ontstaan.',
      antwoord:'De curve daalt bij lagere temperatuur: bij een lagere temperatuur kan er minder zout in 100 g water opgelost blijven. Bij afkoelen wordt de oplossing dus "te vol" (oververzadigd); het teveel aan zout dat niet opgelost kan blijven, slaat neer als vaste kristallen (kristalliseert).',
      antwoord_rubric:'1 punt: bij lagere temperatuur is de oplosbaarheid lager (curve daalt). 1 punt: het teveel aan opgelost zout kristalliseert uit.' },
    // ── Opgave 5 · Zuur en base ──
    { nr:12, opgave:5, punten:2, type:'open', domein:'Zuren',
      vraag:'Leg met afbeelding 5 uit of citroensap zuur, neutraal of basisch is, en wat de pH-waarde over de oplossing zegt.',
      antwoord:'Citroensap staat bij pH 2, links op de schaal. Een pH lager dan 7 betekent een zure oplossing, dus citroensap is zuur. Hoe lager de pH, hoe sterker zuur; pH 7 is neutraal en boven 7 is basisch.',
      antwoord_rubric:'1 punt: citroensap is zuur (pH 2 < 7). 1 punt: uitleg pH < 7 zuur, = 7 neutraal, > 7 basisch.' },
    { nr:13, opgave:5, punten:2, type:'open', domein:'Zuren',
      vraag:'Je voegt aan een beker citroensap steeds meer water toe. Leg uit in welke richting de pH verschuift en waarom de pH nooit boven 7 uitkomt door alleen water toe te voegen.',
      antwoord:'Door water toe te voegen verdun je het zuur: de concentratie zuurdeeltjes wordt kleiner, waardoor de oplossing minder zuur wordt en de pH stijgt richting 7. Water zelf is neutraal (pH 7), dus verdunnen kan de pH hooguit naar 7 laten naderen, maar nooit erboven; daarvoor zou je een base moeten toevoegen.',
      antwoord_rubric:'1 punt: verdunnen → minder zure deeltjes per volume → pH stijgt richting 7. 1 punt: water is neutraal, dus pH nadert 7 maar komt er niet boven zonder base.' },
    { nr:14, opgave:5, punten:2, type:'open', domein:'Zuren',
      vraag:'Bij maagzuur (te veel zuur in de maag) helpt een tabletje met een base. Leg uit welke reactie dan optreedt en waarom dit de klachten vermindert. Noem het type reactie.',
      antwoord:'De base in het tabletje reageert met het zuur uit de maag; dat is een neutralisatiereactie, waarbij zuur en base elkaar opheffen en er (o.a.) water en een zout ontstaan. Doordat een deel van het zuur wordt weggenomen, stijgt de pH en wordt de maaginhoud minder zuur, waardoor de klachten afnemen.',
      antwoord_rubric:'1 punt: base + zuur reageren = neutralisatie (zuur wordt weggenomen). 1 punt: minder zuur → pH stijgt → minder klachten.' },
    // ── Opgave 6 · Alcohol ──
    { nr:15, opgave:6, punten:2, type:'open', domein:'Koolstof',
      vraag:'Geef de molecuulformule van ethanol en benoem de functionele (karakteristieke) groep die in afbeelding 6 is omcirkeld.',
      antwoord:'De molecuulformule is C₂H₆O (vaak geschreven als C₂H₅OH). De omcirkelde groep is de hydroxylgroep (–OH); die maakt ethanol tot een alcohol.',
      antwoord_rubric:'1 punt: molecuulformule C₂H₆O / C₂H₅OH. 1 punt: hydroxylgroep (–OH).' },
    { nr:16, opgave:6, punten:2, type:'open', domein:'Koolstof',
      vraag:'Ethanol wordt als biobrandstof volledig verbrand. Geef de reactievergelijking van deze volledige verbranding en maak hem kloppend.',
      antwoord:'C₂H₆O + 3 O₂ → 2 CO₂ + 3 H₂O. Controle: C 2→2, H 6→6, O (1 + 6) = 7 → (4 + 3) = 7. De vergelijking klopt.',
      antwoord_rubric:'1 punt: juiste begin- en eindstoffen (C₂H₆O + O₂ → CO₂ + H₂O). 1 punt: kloppende coëfficiënten 3 O₂ → 2 CO₂ + 3 H₂O (let op de O in ethanol).' },
    { nr:17, opgave:6, punten:1, type:'open', domein:'Koolstof',
      vraag:'Er bestaat een andere stof met dezelfde molecuulformule C₂H₆O maar met een andere structuur (dimethylether). Hoe noem je twee stoffen met dezelfde molecuulformule maar een verschillende structuurformule?',
      antwoord:'Zulke stoffen noem je isomeren: ze hebben dezelfde molecuulformule (hetzelfde aantal atomen van elke soort) maar een andere structuur, en daardoor andere eigenschappen.',
      antwoord_rubric:'1 punt: isomeren.' },
  ],
};
