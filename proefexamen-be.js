// ═══════════════════════════════════════════════════════════════════════
// proefexamen-be.js, ORIGINEEL Slagio-proefexamen in examenstijl (havo be).
// Eigen contexten, vragen en figuren. Géén reproductie van een CvTE-examen.
// CE-niveau bedrijfseconomie: prijsvorming, break-evenanalyse, resultaten-
// rekening, liquiditeit en investeringsselectie. Rekenen met tussenstappen;
// meervoudige nakijkrubric per vraag. Figuren in hoge kwaliteit.
//   opgaven[] = {nr,titel,context,afb,afb_cap}
//   vragen[]  = {nr,opgave,punten,type,vraag,antwoord,antwoord_rubric,domein}
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.havo = SLAGIO_EXAMENS.havo || {};

function _beAx(){
  return '<line x1="52" y1="14" x2="52" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/>'+
         '<line x1="52" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M344 158 L334 154 L334 162 Z" fill="#1b2230"/>';
}
function _beGridY(ys){ return ys.map(y=>'<line x1="52" y1="'+y+'" x2="340" y2="'+y+'" stroke="#eef1f5" stroke-width="1"/>').join(''); }

var _BEAFB = {
  // Opbouw verkoopprijs: gestapelde balk inkoop + brutowinst + btw
  verkoopprijs:(function(){
    var seg=[['inkoopprijs',50,'#2563eb'],['brutowinst',20,'#2e9e5b'],['btw 21%',14.70,'#e8580c']];
    var total=84.70, base=158, top=26, h=base-top; var cx=150, w=90;
    var y=base, blocks='';
    seg.forEach(function(s){var bh=s[1]/total*h;y-=bh;blocks+='<rect x="'+(cx-w/2)+'" y="'+y.toFixed(1)+'" width="'+w+'" height="'+bh.toFixed(1)+'" fill="'+s[2]+'"/><text x="'+cx+'" y="'+(y+bh/2+4).toFixed(1)+'" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#fff" text-anchor="middle">'+s[0]+'</text><text x="'+(cx+w/2+8)+'" y="'+(y+bh/2+4).toFixed(1)+'" font-family="sans-serif" font-size="9.5" fill="#1b2230">&#8364; '+s[1].toFixed(2).replace('.',',')+'</text>';});
    return '<svg viewBox="0 0 360 190" role="img" aria-label="opbouw van de verkoopprijs"><line x1="'+(cx-w/2-10)+'" y1="'+base+'" x2="330" y2="'+base+'" stroke="#1b2230" stroke-width="1.5"/>'+blocks+'<text x="'+cx+'" y="18" font-family="sans-serif" font-size="10" font-weight="800" fill="#1b2230" text-anchor="middle">consumentenprijs &#8364; 84,70</text></svg>';
  })(),
  // Break-evenanalyse: TK en TO met break-evenpunt
  breakeven:`<svg viewBox="0 0 360 196" role="img" aria-label="break-evenanalyse met TK en TO">${_beGridY([126,94,62,30])}${_beAx()}<line x1="52" y1="98" x2="322" y2="66" stroke="#e8580c" stroke-width="2.8"/><line x1="52" y1="158" x2="302" y2="30" stroke="#2e9e5b" stroke-width="2.8"/><line x1="200" y1="82" x2="200" y2="158" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><circle cx="200" cy="82" r="3.6" fill="#1b2230"/><g font-family="sans-serif" font-size="11" font-weight="800"><text x="326" y="66" fill="#e8580c">TK</text><text x="308" y="26" fill="#2e9e5b">TO</text><text x="200" y="172" fill="#1b2230" text-anchor="middle">BEP</text></g><text x="0" y="0" transform="translate(16,90) rotate(-90)" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">&#8364; per periode</text><text x="270" y="190" font-family="sans-serif" font-size="10" font-weight="800" fill="#1b2230" text-anchor="middle">afzet (stuks)</text></svg>`,
  // Resultatenrekening als nette tabel
  resultaat:`<svg viewBox="0 0 360 190" role="img" aria-label="resultatenrekening"><rect x="20" y="16" width="320" height="160" rx="6" fill="#fff" stroke="#1b2230" stroke-width="1.3"/><text x="180" y="34" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="#1b2230">Resultatenrekening (per jaar)</text><line x1="20" y1="42" x2="340" y2="42" stroke="#1b2230" stroke-width="1"/><g font-family="sans-serif" font-size="10.5" fill="#1b2230">${[['Omzet','€ 240.000'],['Af: inkoopwaarde van de omzet','€ 150.000'],['Brutowinst','?'],['Af: bedrijfskosten','€ 62.000'],['Nettowinst','?']].map(function(r,i){var y=62+i*26;var bold=(r[1]==='?'||r[0].indexOf('winst')>-1)?' font-weight="700"':'';return '<text x="34" y="'+y+'"'+bold+'>'+r[0]+'</text><text x="326" y="'+y+'" text-anchor="end"'+bold+'>'+r[1]+'</text>'+(i===1||i===3?'<line x1="200" y1="'+(y+6)+'" x2="326" y2="'+(y+6)+'" stroke="#94a0b8" stroke-width="1"/>':'');}).join('')}</g></svg>`,
  // Liquiditeit: vlottende activa vs kort vreemd vermogen (balken)
  liquiditeit:(function(){
    var sy=function(v){return 158-v/80000*120;};
    var yl=[20000,40000,60000,80000].map(v=>'<line x1="52" y1="'+sy(v).toFixed(1)+'" x2="340" y2="'+sy(v).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="47" y="'+(sy(v)+3).toFixed(1)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="end">'+(v/1000)+'k</text>').join('');
    var bars='<rect x="96" y="'+sy(72000).toFixed(1)+'" width="70" height="'+(158-sy(72000)).toFixed(1)+'" fill="#2563eb"/><text x="131" y="'+(sy(72000)-5).toFixed(1)+'" font-family="sans-serif" font-size="9" font-weight="700" fill="#1b2230" text-anchor="middle">72.000</text>'+
               '<rect x="216" y="'+sy(48000).toFixed(1)+'" width="70" height="'+(158-sy(48000)).toFixed(1)+'" fill="#e8580c"/><text x="251" y="'+(sy(48000)-5).toFixed(1)+'" font-family="sans-serif" font-size="9" font-weight="700" fill="#1b2230" text-anchor="middle">48.000</text>';
    return '<svg viewBox="0 0 360 196" role="img" aria-label="vlottende activa en kort vreemd vermogen">'+yl+_beAx()+bars+'<g font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle" font-weight="700"><text x="131" y="172">vlottende<tspan x="131" dy="11">activa</tspan></text><text x="251" y="172">kort vreemd<tspan x="251" dy="11">vermogen</tspan></text></g><text x="0" y="0" transform="translate(16,90) rotate(-90)" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">bedrag (&#8364;)</text></svg>';
  })(),
  // Terugverdientijd: cumulatieve nettokasstroom (grafiek door 0)
  terugverdien:(function(){
    // jaar 0..5, cumulatief: -40, -25, -8, 12, 34, 58 (×1000)
    var cum=[-40,-25,-8,12,34,58];
    var sy=function(v){return 92 - v/60*72;}; // 0-lijn op y=92
    var sx=function(j){return 60+j*52;};
    var yl=[[-40,-40],[-20,-20],[0,0],[20,20],[40,40]].map(p=>'<line x1="52" y1="'+sy(p[1]).toFixed(1)+'" x2="340" y2="'+sy(p[1]).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="47" y="'+(sy(p[1])+3).toFixed(1)+'" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="end">'+p[0]+'k</text>').join('');
    var zero='<line x1="52" y1="'+sy(0).toFixed(1)+'" x2="340" y2="'+sy(0).toFixed(1)+'" stroke="#1b2230" stroke-width="1.4"/>';
    var line='<polyline points="'+cum.map((v,j)=>sx(j)+','+sy(v).toFixed(1)).join(' ')+'" fill="none" stroke="#2563eb" stroke-width="2.8"/>'+cum.map((v,j)=>'<circle cx="'+sx(j)+'" cy="'+sy(v).toFixed(1)+'" r="3" fill="#1b2230"/>').join('');
    var xl=[0,1,2,3,4,5].map(j=>'<text x="'+sx(j)+'" y="172" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">'+j+'</text>').join('');
    return '<svg viewBox="0 0 360 190" role="img" aria-label="cumulatieve nettokasstroom">'+yl+'<line x1="52" y1="14" x2="52" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/><line x1="52" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M344 158 L334 154 L334 162 Z" fill="#1b2230"/>'+zero+line+xl+'<text x="0" y="0" transform="translate(16,86) rotate(-90)" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#1b2230" text-anchor="middle">cumulatieve kasstroom (&#8364;)</text><text x="280" y="186" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">jaar</text></svg>';
  })(),
  // Vraaglijn / prijs-afzettabel
  vraagtabel:`<svg viewBox="0 0 360 176" role="img" aria-label="prijs-afzettabel"><g stroke="#1b2230" stroke-width="1.3" fill="none"><rect x="30" y="28" width="300" height="120"/><line x1="30" y1="58" x2="330" y2="58"/><line x1="30" y1="88" x2="330" y2="88"/><line x1="30" y1="118" x2="330" y2="118"/><line x1="150" y1="28" x2="150" y2="148"/><line x1="240" y1="28" x2="240" y2="148"/></g><g font-family="sans-serif" font-size="10.5" fill="#1b2230"><text x="90" y="47" text-anchor="middle" font-weight="700">prijs (&#8364;)</text><text x="195" y="47" text-anchor="middle" font-weight="700">afzet</text><text x="285" y="47" text-anchor="middle" font-weight="700">omzet</text>${[['10','4.000','?'],['12','3.000','?'],['14','2.000','?']].map(function(r,i){var y=77+i*30;return '<text x="90" y="'+y+'" text-anchor="middle">'+r[0]+'</text><text x="195" y="'+y+'" text-anchor="middle">'+r[1]+'</text><text x="285" y="'+y+'" text-anchor="middle">'+r[2]+'</text>';}).join('')}</g><text x="180" y="20" font-family="sans-serif" font-size="9.5" fill="#8a94a8" text-anchor="middle">afzet in stuks per maand</text></svg>`,
};

SLAGIO_EXAMENS.havo.be = {
  origineel: true,
  titel: 'Bedrijfseconomie',
  niveau: 'havo',
  jaar: new Date().getFullYear(),
  duur_minuten: 100,
  max_punten: 29,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'De prijs van een rugzak',
      context:'Een winkel verkoopt rugzakken. De inkoopprijs is € 50 per rugzak. De winkel rekent een brutowinstopslag en daarna 21% btw. Afbeelding 1 toont de opbouw van de consumentenprijs.',
      afb:_BEAFB.verkoopprijs, afb_cap:'afbeelding 1: opbouw van de consumentenprijs' },
    { nr:2, titel:'Break-even van een foodtruck',
      context:'Iris begint een foodtruck. Haar constante kosten zijn € 6.000 per maand. De variabele kosten zijn € 8 per maaltijd en ze verkoopt elke maaltijd voor € 20. Afbeelding 2 toont de totale kosten (TK) en de totale opbrengst (TO).',
      afb:_BEAFB.breakeven, afb_cap:'afbeelding 2: break-evenanalyse (TK en TO)' },
    { nr:3, titel:'Het jaarresultaat',
      context:'Afbeelding 3 is een (vereenvoudigde) resultatenrekening van een handelsonderneming over één jaar.',
      afb:_BEAFB.resultaat, afb_cap:'afbeelding 3: resultatenrekening' },
    { nr:4, titel:'Kan het bedrijf zijn rekeningen betalen?',
      context:'Afbeelding 4 toont voor een onderneming de vlottende activa (voorraden, debiteuren, liquide middelen) en het kort vreemd vermogen (schulden die binnen een jaar betaald moeten worden).',
      afb:_BEAFB.liquiditeit, afb_cap:'afbeelding 4: vlottende activa en kort vreemd vermogen' },
    { nr:5, titel:'Een nieuwe oven',
      context:'Een bakkerij overweegt een oven van € 40.000. Afbeelding 5 toont de cumulatieve nettokasstroom: de investering min de opgetelde jaarlijkse ontvangsten. Waar de lijn de nullijn kruist, is de investering terugverdiend.',
      afb:_BEAFB.terugverdien, afb_cap:'afbeelding 5: cumulatieve nettokasstroom per jaar' },
    { nr:6, titel:'Prijs en omzet',
      context:'Voor een product geldt de prijs-afzetrelatie in afbeelding 6: bij een hogere prijs verkoopt het bedrijf minder stuks per maand.',
      afb:_BEAFB.vraagtabel, afb_cap:'afbeelding 6: prijs-afzettabel' },
  ],
  vragen: [
    // ── Opgave 1 · Prijsvorming ──
    { nr:1, opgave:1, punten:2, type:'open', domein:'Prijsvorming',
      vraag:'De brutowinst per rugzak is € 20. Bereken de brutowinstopslag als percentage van de inkoopprijs.',
      antwoord:'Brutowinstopslag = brutowinst ÷ inkoopprijs × 100% = 20 ÷ 50 × 100% = 40%.',
      antwoord_rubric:'1 punt: brutowinst ÷ inkoopprijs (20/50). 1 punt: × 100% = 40%.' },
    { nr:2, opgave:1, punten:3, type:'open', domein:'Prijsvorming',
      vraag:'Bereken de consumentenprijs (inclusief 21% btw) en toon aan dat die overeenkomt met het bedrag in afbeelding 1.',
      antwoord:'Verkoopprijs exclusief btw = inkoopprijs + brutowinst = 50 + 20 = € 70. Btw = 21% van 70 = € 14,70. Consumentenprijs = 70 + 14,70 = € 84,70, gelijk aan het bedrag in afbeelding 1.',
      antwoord_rubric:'1 punt: verkoopprijs excl. btw = 50 + 20 = € 70. 1 punt: btw = 21% × 70 = € 14,70. 1 punt: consumentenprijs = € 84,70.' },
    // ── Opgave 2 · Break-even ──
    { nr:3, opgave:2, punten:3, type:'open', domein:'Kostencalculatie',
      vraag:'Bereken de break-evenafzet van de foodtruck (het aantal maaltijden per maand waarbij Iris geen verlies en geen winst maakt). Laat je berekening zien.',
      antwoord:'Dekkingsbijdrage per maaltijd = verkoopprijs - variabele kosten = 20 - 8 = € 12. Break-evenafzet = constante kosten ÷ dekkingsbijdrage = 6.000 ÷ 12 = 500 maaltijden per maand.',
      antwoord_rubric:'1 punt: dekkingsbijdrage = 20 - 8 = € 12. 1 punt: 6.000 ÷ 12. 1 punt: 500 maaltijden (= het BEP in afbeelding 2).' },
    { nr:4, opgave:2, punten:2, type:'open', domein:'Kostencalculatie',
      vraag:'Iris verkoopt in een maand 800 maaltijden. Bereken haar winst in die maand.',
      antwoord:'Boven de break-evenafzet levert elke maaltijd de dekkingsbijdrage als winst op: (800 - 500) × € 12 = 300 × 12 = € 3.600. (Controle: TO = 800×20 = 16.000; TK = 6.000 + 800×8 = 12.400; winst = 3.600.)',
      antwoord_rubric:'1 punt: (800 - 500) × 12 of via TO - TK. 1 punt: winst = € 3.600.' },
    { nr:5, opgave:2, punten:2, type:'open', domein:'Kostencalculatie',
      vraag:'Leg uit waarom de TK-lijn in afbeelding 2 niet in de oorsprong begint, maar de TO-lijn wel.',
      antwoord:'De TK-lijn begint boven de oorsprong omdat er ook bij een afzet van 0 al € 6.000 constante kosten zijn. De TO-lijn begint in de oorsprong omdat er zonder verkochte maaltijden (afzet 0) ook € 0 opbrengst is.',
      antwoord_rubric:'1 punt: TK start boven 0 door de constante kosten (ook bij afzet 0). 1 punt: TO start in de oorsprong: geen afzet → geen opbrengst.' },
    // ── Opgave 3 · Resultatenrekening ──
    { nr:6, opgave:3, punten:2, type:'open', domein:'Verslaggeving',
      vraag:'Bereken met afbeelding 3 de brutowinst en de nettowinst over dit jaar.',
      antwoord:'Brutowinst = omzet - inkoopwaarde van de omzet = 240.000 - 150.000 = € 90.000. Nettowinst = brutowinst - bedrijfskosten = 90.000 - 62.000 = € 28.000.',
      antwoord_rubric:'1 punt: brutowinst = 240.000 - 150.000 = € 90.000. 1 punt: nettowinst = 90.000 - 62.000 = € 28.000.' },
    { nr:7, opgave:3, punten:2, type:'open', domein:'Verslaggeving',
      vraag:'De onderneming wil de nettowinst volgend jaar verhogen. Leg uit waarom het verlagen van de inkoopwaarde per product de brutowinstmarge verbetert, en noem één risico van scherp inkopen op kwaliteit.',
      antwoord:'Als de inkoopwaarde per product daalt terwijl de verkoopprijs gelijk blijft, wordt het verschil (de brutowinst per product) groter, dus stijgt de brutowinstmarge en bij gelijke omzet ook de nettowinst. Een risico van te scherp/goedkoop inkopen is dat de kwaliteit van de producten daalt, waardoor klanten wegblijven of retourneren en de omzet juist kan dalen.',
      antwoord_rubric:'1 punt: lagere inkoopwaarde bij gelijke prijs → grotere brutowinst(marge). 1 punt: risico = lagere kwaliteit → klantverlies/omzetdaling.' },
    // ── Opgave 4 · Liquiditeit ──
    { nr:8, opgave:4, punten:2, type:'open', domein:'Financiering',
      vraag:'Bereken met afbeelding 4 de current ratio (liquiditeit) van deze onderneming.',
      antwoord:'Current ratio = vlottende activa ÷ kort vreemd vermogen = 72.000 ÷ 48.000 = 1,5.',
      antwoord_rubric:'1 punt: current ratio = vlottende activa ÷ kort vreemd vermogen. 1 punt: 72.000 ÷ 48.000 = 1,5.' },
    { nr:9, opgave:4, punten:2, type:'open', domein:'Financiering',
      vraag:'Beoordeel of deze onderneming op korte termijn aan haar betalingsverplichtingen kan voldoen. Betrek de vuistregel dat een current ratio van ongeveer 1,5 of hoger als voldoende geldt.',
      antwoord:'De current ratio is 1,5. De vlottende activa (€ 72.000) zijn groter dan het kort vreemd vermogen (€ 48.000), dus de onderneming kan haar kortlopende schulden naar verwachting betalen. Met 1,5 zit ze precies op de vuistregel, dus de liquiditeit is (net) voldoende.',
      antwoord_rubric:'1 punt: vlottende activa > kort vreemd vermogen, dus schulden kunnen worden betaald. 1 punt: oordeel dat 1,5 (net) voldoende is volgens de vuistregel.' },
    // ── Opgave 5 · Investering ──
    { nr:10, opgave:5, punten:2, type:'open', domein:'Investeren',
      vraag:'Bepaal met afbeelding 5 tussen welke twee jaren de oven is terugverdiend, en leg uit waaraan je dat in de grafiek ziet.',
      antwoord:'De cumulatieve nettokasstroom is bij jaar 2 nog negatief (-8) en bij jaar 3 positief (+12). De lijn kruist de nullijn dus tussen jaar 2 en jaar 3: ergens in het derde jaar is de investering terugverdiend. Je ziet dat op het punt waar de lijn van onder de nullijn naar boven de nullijn gaat.',
      antwoord_rubric:'1 punt: tussen jaar 2 en 3 (terugverdientijd ± 2,4 jaar). 1 punt: herkenning = de lijn kruist de nullijn (van negatief naar positief).' },
    { nr:11, opgave:5, punten:2, type:'open', domein:'Investeren',
      vraag:'Een tweede oven heeft dezelfde aanschafprijs maar een kortere terugverdientijd. Leg uit waarom een kortere terugverdientijd voor de bakkerij aantrekkelijker is.',
      antwoord:'Bij een kortere terugverdientijd heeft de bakkerij het geïnvesteerde geld sneller terug. Daardoor loopt ze minder lang risico (bijvoorbeeld dat de oven kapotgaat of de vraag terugvalt voordat de investering is terugverdiend) en komt het geld eerder weer vrij om opnieuw te gebruiken of schulden af te lossen.',
      antwoord_rubric:'1 punt: het geïnvesteerde bedrag is sneller terug. 1 punt: minder risico / geld eerder weer beschikbaar.' },
    // ── Opgave 6 · Prijs en omzet ──
    { nr:12, opgave:6, punten:2, type:'open', domein:'Marketing',
      vraag:'Bereken met afbeelding 6 de omzet bij een prijs van € 10 en bij een prijs van € 14.',
      antwoord:'Omzet = prijs × afzet. Bij € 10: 10 × 4.000 = € 40.000. Bij € 14: 14 × 2.000 = € 28.000.',
      antwoord_rubric:'1 punt: omzet = prijs × afzet. 1 punt: € 40.000 (bij € 10) én € 28.000 (bij € 14).' },
    { nr:13, opgave:6, punten:3, type:'open', domein:'Marketing',
      vraag:'Het bedrijf verhoogt de prijs van € 10 naar € 12. Bereken wat er met de omzet gebeurt en leg met de begrippen prijs en afzet uit waardoor de omzet zo verandert.',
      antwoord:'Omzet bij € 10 = 10 × 4.000 = € 40.000; bij € 12 = 12 × 3.000 = € 36.000. De omzet daalt met € 4.000. Hoewel de prijs per stuk stijgt (+€ 2), daalt de afzet sterker (van 4.000 naar 3.000, -1.000 stuks); het verlies aan verkochte stuks weegt zwaarder dan de hogere prijs, waardoor de totale omzet daalt.',
      antwoord_rubric:'1 punt: omzet € 40.000 → € 36.000. 1 punt: de omzet daalt met € 4.000. 1 punt: uitleg dat de afzetdaling zwaarder weegt dan de prijsstijging.' },
  ],
};
