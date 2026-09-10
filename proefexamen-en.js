// ═══════════════════════════════════════════════════════════════════════
// proefexamen-en.js — ORIGINEEL Slagio-proefexamen in examenstijl (havo en).
// Eigen Engelse tekstfragmenten, vragen en figuren. Géén reproductie van een
// CvTE-examen. CE-niveau leesvaardigheid Engels: hoofdgedachte, verwijzingen,
// woordbetekenis in context, toon/doel, tekstverband en informatie koppelen.
// Elke opgave heeft een passend schema/infographic. Rubric per vraag.
//   opgaven[] = {nr,titel,context,afb,afb_cap}
//   vragen[]  = {nr,opgave,punten,type,vraag,antwoord,antwoord_rubric,domein}
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.havo = SLAGIO_EXAMENS.havo || {};

function _enAx(){
  return '<line x1="52" y1="14" x2="52" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M52 14 L48 24 L56 24 Z" fill="#1b2230"/>'+
         '<line x1="52" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><path d="M344 158 L334 154 L334 162 Z" fill="#1b2230"/>';
}

var _ENAFB = {
  // Argumentstructuur: claim vs reality vs evidence
  argument:`<svg viewBox="0 0 360 186" role="img" aria-label="argument structure of the text"><rect x="20" y="18" width="150" height="40" rx="8" fill="#eef4ff" stroke="#2563eb" stroke-width="1.3"/><text x="95" y="34" font-family="sans-serif" font-size="9.5" fill="#1b2230" text-anchor="middle">Common claim:</text><text x="95" y="47" font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle">"it brings us closer"</text><text x="185" y="42" font-family="sans-serif" font-size="16" font-weight="700" fill="#e05353" text-anchor="middle">&#8800;</text><rect x="200" y="18" width="150" height="40" rx="8" fill="#fdecec" stroke="#d1382f" stroke-width="1.3"/><text x="275" y="34" font-family="sans-serif" font-size="9.5" fill="#1b2230" text-anchor="middle">Writer’s view:</text><text x="275" y="47" font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle">"often the opposite"</text><line x1="275" y1="58" x2="275" y2="82" stroke="#94a0b8" stroke-width="1.6"/><path d="M271 76 L275 84 L279 76" fill="#94a0b8"/><rect x="150" y="84" width="200" height="40" rx="8" fill="#fff7ed" stroke="#e8580c" stroke-width="1.3"/><text x="250" y="100" font-family="sans-serif" font-size="9.5" fill="#1b2230" text-anchor="middle">Evidence:</text><text x="250" y="113" font-family="sans-serif" font-size="9" fill="#1b2230" text-anchor="middle">heavy users report feeling lonelier</text><rect x="40" y="140" width="280" height="34" rx="8" fill="#fff" stroke="#1b2230" stroke-width="1.2" stroke-dasharray="5 4"/><text x="180" y="161" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">Nuance: "that does not mean these apps are useless"</text></svg>`,
  // Infographic: screen time per age group (bar chart, English labels)
  screentime:(function(){
    var data=[['12–14',5],['15–17',7],['18–20',8]];
    var sy=function(h){return 150-h/10*120;};
    var yl=[0,2,4,6,8,10].map(v=>'<line x1="56" y1="'+sy(v).toFixed(1)+'" x2="336" y2="'+sy(v).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(sy(v)+3).toFixed(1)+'" font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="end">'+v+'</text>').join('');
    var bars=data.map(function(d,i){var x=96+i*78;var y=sy(d[1]);return '<rect x="'+x+'" y="'+y.toFixed(1)+'" width="52" height="'+(150-y).toFixed(1)+'" rx="2" fill="#2563eb"/><text x="'+(x+26)+'" y="'+(y-5).toFixed(1)+'" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1b2230" text-anchor="middle">'+d[1]+'</text><text x="'+(x+26)+'" y="166" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">'+d[0]+'</text>';}).join('');
    return '<svg viewBox="0 0 360 194" role="img" aria-label="average screen time per age group"><text x="196" y="16" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1b2230" text-anchor="middle">Average screen time (hours per day)</text>'+yl+'<line x1="56" y1="24" x2="56" y2="150" stroke="#1b2230" stroke-width="1.8"/><line x1="56" y1="150" x2="340" y2="150" stroke="#1b2230" stroke-width="1.8"/>'+bars+'<text x="196" y="186" font-family="sans-serif" font-size="9" fill="#4a5568" text-anchor="middle">age group (years)</text></svg>';
  })(),
  // Onderzoeksopzet: twee groepen -> resultaat
  study:`<svg viewBox="0 0 360 176" role="img" aria-label="research design with two groups"><rect x="18" y="30" width="150" height="42" rx="8" fill="#fdecec" stroke="#d1382f" stroke-width="1.3"/><text x="93" y="47" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1b2230" text-anchor="middle">Group A</text><text x="93" y="61" font-family="sans-serif" font-size="8.6" fill="#1b2230" text-anchor="middle">2 hours, no break</text><rect x="18" y="104" width="150" height="42" rx="8" fill="#eef4ff" stroke="#2563eb" stroke-width="1.3"/><text x="93" y="121" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1b2230" text-anchor="middle">Group B</text><text x="93" y="135" font-family="sans-serif" font-size="8.6" fill="#1b2230" text-anchor="middle">5-min break each &#189; hour</text><g stroke="#94a0b8" stroke-width="1.6" fill="none"><line x1="168" y1="51" x2="210" y2="80"/><line x1="168" y1="125" x2="210" y2="96"/><path d="M204 74 L214 82 L203 84" fill="#94a0b8" stroke="none"/></g><rect x="214" y="62" width="132" height="52" rx="8" fill="#e5f6ec" stroke="#2e9e5b" stroke-width="1.4"/><text x="280" y="82" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1b2230" text-anchor="middle">Test result:</text><text x="280" y="97" font-family="sans-serif" font-size="8.8" fill="#1b2230" text-anchor="middle">Group B scored</text><text x="280" y="108" font-family="sans-serif" font-size="8.8" fill="#1b2230" text-anchor="middle">noticeably better</text></svg>`,
  // Tekstopbouw met signaalwoord-gaten
  linking:`<svg viewBox="0 0 360 172" role="img" aria-label="paragraph with linking-word gaps"><g font-family="sans-serif" font-size="10" fill="#1b2230">${[['1','Learning a language takes time.','#eef2f7','#9aa5b5'],['gap','___  most people give up too soon.','#fff7ed','#e8580c'],['2','They expect quick results and feel let down.','#eef2f7','#9aa5b5'],['gap','___  those who keep going succeed in the end.','#fff7ed','#e8580c']].map(function(r,i){var y=20+i*36;var isgap=r[0]==='gap';return '<rect x="24" y="'+y+'" width="312" height="28" rx="6" fill="'+r[2]+'" stroke="'+r[3]+'" stroke-width="1.3"'+(isgap?' stroke-dasharray="5 4"':'')+'/><text x="40" y="'+(y+18)+'">'+r[1]+'</text>'+(i<3?'<line x1="180" y1="'+(y+28)+'" x2="180" y2="'+(y+36)+'" stroke="#c9cfda" stroke-width="1.4"/>':'');}).join('')}</g></svg>`,
};

SLAGIO_EXAMENS.havo.en = {
  origineel: true,
  titel: 'Engels',
  niveau: 'havo',
  jaar: new Date().getFullYear(),
  duur_minuten: 90,
  max_punten: 20,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Text 1 — "Connected, but alone?"',
      context:'Lees de volgende alinea.\n\n"Some people claim that social media brings us closer together. In reality, the opposite is often true. When friends sit at the same table, each staring at their own screen, they may be ‘connected’ online while ignoring the person right next to them. Studies suggest that heavy users of social media report feeling lonelier, not less lonely. That does not mean these apps are useless — but we should be honest about the price we pay for all those likes."\n\nAfbeelding 1 vat de opbouw van het betoog samen.',
      afb:_ENAFB.argument, afb_cap:'afbeelding 1 — the structure of the argument' },
    { nr:2, titel:'Text 2 — Screens everywhere',
      context:'Bij een artikel staat: "Teenagers today spend more time looking at screens than ever before. The figures speak for themselves." Afbeelding 2 is de bijbehorende infographic.',
      afb:_ENAFB.screentime, afb_cap:'afbeelding 2 — average screen time per age group' },
    { nr:3, titel:'Text 3 — Do breaks help?',
      context:'Lees de volgende tekst.\n\n"Researchers wanted to find out whether short breaks help students concentrate. They asked one group to study for two hours without a pause, and another group to take a five-minute break every half hour. The second group performed noticeably better on the test that followed. According to the researchers, the brain simply needs rest to stay sharp."\n\nAfbeelding 3 geeft de opzet van het onderzoek weer.',
      afb:_ENAFB.study, afb_cap:'afbeelding 3 — the research design' },
    { nr:4, titel:'Text 4 — Keep going',
      context:'In de volgende alinea zijn twee verbindingswoorden weggelaten (afbeelding 4).',
      afb:_ENAFB.linking, afb_cap:'afbeelding 4 — a paragraph with two gaps' },
  ],
  vragen: [
    // ── Opgave 1 ──
    { nr:1, opgave:1, punten:2, type:'open', domein:'Leesvaardigheid',
      vraag:'Wat is het hoofdstandpunt (main point) van de schrijver in deze alinea? Formuleer het in je eigen woorden in het Nederlands.',
      antwoord:'De schrijver vindt dat sociale media mensen vaak juist verder uit elkaar drijft in plaats van dichter bij elkaar te brengen: online "verbonden" zijn gaat ten koste van echt contact met de mensen om je heen.',
      antwoord_rubric:'1 punt: kernidee = sociale media brengt mensen niet dichterbij / drijft juist uit elkaar. 1 punt: nuance dat online verbondenheid ten koste gaat van echt/persoonlijk contact.' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Leesvaardigheid',
      vraag:'"In reality, the opposite is often true." Waar verwijst "the opposite" naar? Leg uit.',
      antwoord:'"The opposite" verwijst naar het tegenovergestelde van de bewering ervoor, namelijk dat sociale media mensen dichter bij elkaar brengt. Het tegenovergestelde is dus dat sociale media mensen juist verder uit elkaar drijft / eenzamer maakt.',
      antwoord_rubric:'1 punt: het verwijst naar de bewering "social media brings us closer together". 1 punt: "the opposite" = sociale media drijft juist uit elkaar / maakt eenzamer.' },
    { nr:3, opgave:1, punten:2, type:'open', domein:'Leesvaardigheid',
      vraag:'Is de houding (tone) van de schrijver tegenover sociale media (a) enthousiast, (b) genuanceerd-kritisch, of (c) volledig afwijzend? Kies en onderbouw met de tekst en afbeelding 1.',
      antwoord:'(b) Genuanceerd-kritisch. De schrijver is kritisch (sociale media maakt vaak eenzamer), maar zegt óók: "That does not mean these apps are useless" — hij verwerpt ze dus niet helemaal. In afbeelding 1 staat die nuance apart onderaan. De houding is dus kritisch maar genuanceerd, niet volledig afwijzend.',
      antwoord_rubric:'1 punt: keuze (b) genuanceerd-kritisch. 1 punt: onderbouwing met de nuancezin "does not mean these apps are useless" (kritisch maar niet volledig afwijzend).' },
    // ── Opgave 2 ──
    { nr:4, opgave:2, punten:2, type:'open', domein:'Leesvaardigheid',
      vraag:'Lees met afbeelding 2 af hoeveel uur per dag de groep van 18–20 jaar gemiddeld naar een scherm kijkt, en hoeveel meer dat is dan de groep van 12–14 jaar.',
      antwoord:'De groep 18–20 jaar kijkt gemiddeld 8 uur per dag naar een scherm; de groep 12–14 jaar 5 uur. Dat is 8 − 5 = 3 uur per dag meer.',
      antwoord_rubric:'1 punt: 18–20 jaar = 8 uur (en 12–14 jaar = 5 uur) afgelezen. 1 punt: verschil = 3 uur per dag.' },
    { nr:5, opgave:2, punten:2, type:'open', domein:'Leesvaardigheid',
      vraag:'De tekst zegt: "The figures speak for themselves." Leg uit hoe afbeelding 2 die zin ondersteunt.',
      antwoord:'De infographic laat zien dat de gemiddelde schermtijd oploopt met de leeftijd (5 → 7 → 8 uur), en dat tieners dus veel uren per dag naar een scherm kijken. De cijfers maken de bewering dat tieners "meer dan ooit" naar schermen kijken concreet en zichtbaar; ze "spreken voor zich".',
      antwoord_rubric:'1 punt: de grafiek toont hoge/oplopende schermtijd per leeftijdsgroep. 1 punt: de cijfers ondersteunen/illustreren de bewering concreet.' },
    // ── Opgave 3 ──
    { nr:6, opgave:3, punten:2, type:'open', domein:'Leesvaardigheid',
      vraag:'Wat wilden de onderzoekers met dit onderzoek te weten komen (het doel)? Antwoord in het Nederlands.',
      antwoord:'De onderzoekers wilden weten of korte pauzes studenten helpen zich beter te concentreren (of pauzes de concentratie/prestatie verbeteren).',
      antwoord_rubric:'1 punt: het doel = onderzoeken of korte pauzes de concentratie helpen/verbeteren.' },
    { nr:7, opgave:3, punten:2, type:'open', domein:'Leesvaardigheid',
      vraag:'"The second group performed noticeably better." Naar welke groep verwijst "the second group", en wat betekent "noticeably" hier?',
      antwoord:'"The second group" is de groep die elke half uur een pauze van vijf minuten nam (Groep B in afbeelding 3). "Noticeably" betekent hier "merkbaar/duidelijk": die groep presteerde duidelijk/aanzienlijk beter, niet slechts een klein beetje.',
      antwoord_rubric:'1 punt: de tweede groep = de groep met de pauzes (Groep B). 1 punt: "noticeably" ≈ merkbaar/duidelijk/aanzienlijk.' },
    { nr:8, opgave:3, punten:2, type:'open', domein:'Leesvaardigheid',
      vraag:'Welke conclusie trekken de onderzoekers uit hun resultaat? Onderbouw met de laatste zin van de tekst.',
      antwoord:'Ze concluderen dat pauzes de concentratie en prestatie verbeteren, omdat de hersenen rust nodig hebben om scherp te blijven ("the brain simply needs rest to stay sharp"). Korte pauzes helpen dus, zoals blijkt uit de betere score van de pauzegroep.',
      antwoord_rubric:'1 punt: conclusie = pauzes helpen (verbeteren concentratie/prestatie). 1 punt: onderbouwd met "the brain needs rest to stay sharp".' },
    // ── Opgave 4 ──
    { nr:9, opgave:4, punten:2, type:'open', domein:'Leesvaardigheid',
      vraag:'Welk verbindingswoord past het best in het eerste gat: "However", "Therefore" of "For example"? Leg je keuze uit.',
      antwoord:'"However" past het best. De eerste zin zegt dat een taal leren tijd kost; de volgende zin vormt daarmee een tegenstelling (toch geven veel mensen te snel op). "However" (echter/toch) geeft die tegenstelling aan. "Therefore" (dus/daarom) en "For example" passen niet, want er is geen gevolg of voorbeeld.',
      antwoord_rubric:'1 punt: "However". 1 punt: uitleg dat er een tegenstelling is tussen "kost tijd" en "geven te snel op".' },
    { nr:10, opgave:4, punten:2, type:'open', domein:'Leesvaardigheid',
      vraag:'Welk verbindingswoord past het best in het tweede gat: "In contrast", "Because" of "Similarly"? Leg je keuze uit.',
      antwoord:'"In contrast" past het best. Ervoor staat dat mensen te snel opgeven en teleurgesteld raken; daarna komt het tegenovergestelde geval: wie juist doorgaat, slaagt uiteindelijk. "In contrast" (daarentegen) zet die twee tegenover elkaar. "Because" (omdat) geeft een reden en "Similarly" (evenzo) een overeenkomst, en die passen hier niet.',
      antwoord_rubric:'1 punt: "In contrast". 1 punt: uitleg dat het de opgevers (falen) tegenover de doorzetters (slagen) plaatst.' },
  ],
};
