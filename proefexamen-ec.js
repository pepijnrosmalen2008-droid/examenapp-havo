// ═══════════════════════════════════════════════════════════════════════
// proefexamen-ec.js — ORIGINEEL Slagio-proefexamen in examenstijl (havo eco).
// Eigen contexten, vragen en figuren. Géén reproductie van een CvTE-examen.
// Vraagstelling op CE-niveau: rekenen, redeneren en gegevens aflezen — met
// een meervoudige nakijkrubric per vraag. Elke opgave heeft een grafiek/diagram.
//   opgaven[] = {nr,titel,context,afb,afb_cap}
//   vragen[]  = {nr,opgave,punten,type,vraag,antwoord,antwoord_rubric,domein}
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.havo = SLAGIO_EXAMENS.havo || {};

var _ECAFB = {
  // Vraag & aanbod met evenwicht (stippellijnen naar de assen)
  markt:`<svg viewBox="0 0 360 200" role="img" aria-label="vraag- en aanbodlijn met evenwicht"><line x1="48" y1="14" x2="48" y2="168" stroke="#1b2230" stroke-width="2"/><line x1="48" y1="168" x2="344" y2="168" stroke="#1b2230" stroke-width="2"/><line x1="64" y1="48" x2="320" y2="168" stroke="#2563eb" stroke-width="2.6"/><line x1="64" y1="168" x2="320" y2="48" stroke="#e8580c" stroke-width="2.6"/><line x1="192" y1="108" x2="48" y2="108" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><line x1="192" y1="108" x2="192" y2="168" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><circle cx="192" cy="108" r="3.4" fill="#1b2230"/><g font-family="sans-serif" font-size="11" font-weight="700" fill="#1b2230"><text x="300" y="44" fill="#e8580c">A</text><text x="300" y="164" fill="#2563eb">V</text><text x="30" y="112">P&#42;</text><text x="186" y="182">Q&#42;</text></g><text x="0" y="0" transform="translate(16,150) rotate(-90)" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1b2230" text-anchor="middle">prijs (&#8364;)</text><text x="250" y="192" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1b2230" text-anchor="middle">hoeveelheid</text></svg>`,
  // Samengestelde interest: spaarsaldo groeit exponentieel (staafdiagram)
  sparen:`<svg viewBox="0 0 360 196" role="img" aria-label="spaarsaldo per jaar bij samengestelde interest"><line x1="48" y1="14" x2="48" y2="162" stroke="#1b2230" stroke-width="2"/><line x1="48" y1="162" x2="344" y2="162" stroke="#1b2230" stroke-width="2"/><g fill="#2563eb"><rect x="70" y="120" width="34" height="42"/><rect x="126" y="108" width="34" height="54"/><rect x="182" y="93" width="34" height="69"/><rect x="238" y="75" width="34" height="87"/><rect x="294" y="53" width="34" height="109"/></g><g font-family="sans-serif" font-size="10" fill="#4a5568" text-anchor="middle"><text x="87" y="176">jaar 0</text><text x="143" y="176">1</text><text x="199" y="176">2</text><text x="255" y="176">3</text><text x="311" y="176">4</text></g><text x="0" y="0" transform="translate(16,150) rotate(-90)" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1b2230" text-anchor="middle">spaarsaldo (&#8364;)</text></svg>`,
  // Kosten en opbrengsten met break-evenpunt
  breakeven:`<svg viewBox="0 0 360 200" role="img" aria-label="totale kosten en totale opbrengst met break-evenpunt"><line x1="48" y1="14" x2="48" y2="168" stroke="#1b2230" stroke-width="2"/><line x1="48" y1="168" x2="344" y2="168" stroke="#1b2230" stroke-width="2"/><line x1="48" y1="110" x2="320" y2="74" stroke="#e8580c" stroke-width="2.6"/><line x1="48" y1="168" x2="320" y2="44" stroke="#2e9e5b" stroke-width="2.6"/><line x1="227" y1="86" x2="227" y2="168" stroke="#94a0b8" stroke-width="1.1" stroke-dasharray="4 4"/><circle cx="227" cy="86" r="3.4" fill="#1b2230"/><g font-family="sans-serif" font-size="11" font-weight="700" fill="#1b2230"><text x="300" y="70" fill="#e8580c">TK</text><text x="300" y="40" fill="#2e9e5b">TO</text><text x="206" y="182">afzet</text></g><text x="0" y="0" transform="translate(16,150) rotate(-90)" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1b2230" text-anchor="middle">&#8364; per periode</text><text x="252" y="192" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1b2230" text-anchor="middle">afzet (stuks)</text></svg>`,
  // Conjunctuurgolf rond de trendmatige groei
  conjunctuur:`<svg viewBox="0 0 360 196" role="img" aria-label="conjunctuurgolf rond de trendmatige groei"><line x1="48" y1="14" x2="48" y2="162" stroke="#1b2230" stroke-width="2"/><line x1="48" y1="162" x2="344" y2="162" stroke="#1b2230" stroke-width="2"/><line x1="52" y1="146" x2="332" y2="52" stroke="#94a0b8" stroke-width="1.6" stroke-dasharray="5 4"/><path d="M52 141 Q92 96 132 118 Q172 140 212 84 Q252 40 292 74 Q312 91 332 60" fill="none" stroke="#2563eb" stroke-width="2.8" stroke-linecap="round"/><g font-family="sans-serif" font-size="10" font-weight="700" fill="#4a5568"><text x="236" y="46" fill="#2563eb">conjunctuurgolf</text><text x="250" y="120" fill="#8a94a8">trend</text></g><text x="0" y="0" transform="translate(16,150) rotate(-90)" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1b2230" text-anchor="middle">bbp</text><text x="300" y="180" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1b2230" text-anchor="middle">tijd &#8594;</text></svg>`,
  // Loon- en prijsindex over drie jaren (lijngrafiek → koopkracht)
  koopkracht:`<svg viewBox="0 0 360 196" role="img" aria-label="prijsindex en loonindex over drie jaren"><line x1="52" y1="14" x2="52" y2="162" stroke="#1b2230" stroke-width="2"/><line x1="52" y1="162" x2="344" y2="162" stroke="#1b2230" stroke-width="2"/><polyline points="86,120 200,78 314,40" fill="none" stroke="#e8580c" stroke-width="2.8"/><polyline points="86,120 200,96 314,80" fill="none" stroke="#2563eb" stroke-width="2.8"/><g fill="#1b2230"><circle cx="86" cy="120" r="3"/><circle cx="200" cy="78" r="3"/><circle cx="314" cy="40" r="3"/><circle cx="200" cy="96" r="3"/><circle cx="314" cy="80" r="3"/></g><g font-family="sans-serif" font-size="10" font-weight="700"><text x="322" y="40" fill="#e8580c" text-anchor="end">prijsindex</text><text x="322" y="94" fill="#2563eb" text-anchor="end">loonindex</text></g><g font-family="sans-serif" font-size="10" fill="#4a5568" text-anchor="middle"><text x="86" y="178">2023</text><text x="200" y="178">2024</text><text x="314" y="178">2025</text></g><text x="0" y="0" transform="translate(20,150) rotate(-90)" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#1b2230" text-anchor="middle">indexcijfer</text></svg>`,
  // Speltheorie: 2×2 uitbetalingsmatrix (prijzenoorlog)
  spel:`<svg viewBox="0 0 340 210" role="img" aria-label="uitbetalingsmatrix van twee bedrijven"><text x="210" y="18" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1b2230">Bedrijf B</text><text x="0" y="0" transform="translate(20 130) rotate(-90)" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="#1b2230">Bedrijf A</text><g font-family="sans-serif" font-size="10.5" font-weight="700" fill="#4a5568" text-anchor="middle"><text x="150" y="40">hoge prijs</text><text x="270" y="40">lage prijs</text></g><g font-family="sans-serif" font-size="10.5" font-weight="700" fill="#4a5568" text-anchor="middle"><text x="0" y="0" transform="translate(42 92) rotate(-90)">hoge prijs</text><text x="0" y="0" transform="translate(42 164) rotate(-90)">lage prijs</text></g><g stroke="#1b2230" stroke-width="1.6" fill="none"><rect x="90" y="48" width="120" height="72"/><rect x="210" y="48" width="120" height="72"/><rect x="90" y="120" width="120" height="72"/><rect x="210" y="120" width="120" height="72"/></g><g font-family="sans-serif" font-size="12" fill="#1b2230" text-anchor="middle"><text x="150" y="88">8 / 8</text><text x="270" y="88">2 / 10</text><text x="150" y="160">10 / 2</text><text x="270" y="160">4 / 4</text></g><text x="210" y="206" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#8a94a8">winst in mln &#8364; (A / B)</text></svg>`,
};

SLAGIO_EXAMENS.havo.ec = {
  origineel: true,
  titel: 'Economie',
  niveau: 'havo',
  jaar: new Date().getFullYear(),
  duur_minuten: 90,
  max_punten: 39,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'De markt voor tweedehands fietsen',
      context:'Op de markt voor tweedehands stadsfietsen in een studentenstad geldt bij benadering:\nvraag:  Qv = 900 − 3P\naanbod: Qa = 2P − 100\nHierin is P de prijs in euro en Q het aantal fietsen per maand. Afbeelding 1 geeft de vraag- en aanbodlijn met het evenwicht.',
      afb:_ECAFB.markt, afb_cap:'afbeelding 1 — vraag (V) en aanbod (A) met het marktevenwicht' },
    { nr:2, titel:'Sparen voor een reis',
      context:'Noa zet € 2.000 op een spaarrekening met 4% rente per jaar. De rente wordt elk jaar bij het saldo geteld (samengestelde interest). Afbeelding 2 laat het saldo aan het eind van elk jaar zien.',
      afb:_ECAFB.sparen, afb_cap:'afbeelding 2 — spaarsaldo aan het eind van elk jaar' },
    { nr:3, titel:'Een eigen sapbar',
      context:'Sem begint een sapbar. Zijn constante kosten zijn € 1.800 per maand. De variabele kosten zijn € 1,50 per sap en hij verkoopt elk sap voor € 4,00. Afbeelding 3 toont de totale kosten (TK) en de totale opbrengst (TO).',
      afb:_ECAFB.breakeven, afb_cap:'afbeelding 3 — totale kosten en totale opbrengst; het snijpunt is het break-evenpunt' },
    { nr:4, titel:'Hoog- en laagconjunctuur',
      context:'Afbeelding 4 toont de ontwikkeling van het bruto binnenlands product (bbp) van een land. De stippellijn is de trendmatige (structurele) groei; de doorgetrokken lijn is de werkelijke productie.',
      afb:_ECAFB.conjunctuur, afb_cap:'afbeelding 4 — de conjunctuurgolf rond de trendmatige groei' },
    { nr:5, titel:'Lonen en prijzen',
      context:'Afbeelding 5 toont voor een land de prijsindex (inflatie) en de loonindex over drie jaren. 2023 is het basisjaar (index = 100).',
      afb:_ECAFB.koopkracht, afb_cap:'afbeelding 5 — prijsindex en loonindex, 2023 = 100' },
    { nr:6, titel:'Twee supermarkten',
      context:'In een dorp zijn twee supermarkten, A en B. Elke keten kiest tussen een hoge en een lage prijs. Afbeelding 6 toont de winst (in miljoen euro) die elke keuze oplevert: het eerste getal is de winst van A, het tweede die van B.',
      afb:_ECAFB.spel, afb_cap:'afbeelding 6 — uitbetalingsmatrix (winst A / winst B)' },
  ],
  vragen: [
    // ── Opgave 1 · Markt ──
    { nr:1, opgave:1, punten:3, type:'open', domein:'Markt',
      vraag:'Bereken de evenwichtsprijs en de evenwichtshoeveelheid op deze markt. Laat je berekening zien.',
      antwoord:'In het evenwicht geldt Qv = Qa: 900 − 3P = 2P − 100. Dat geeft 1000 = 5P, dus P = € 200. Invullen: Q = 900 − 3·200 = 300 fietsen (controle: 2·200 − 100 = 300). Evenwichtsprijs € 200, evenwichtshoeveelheid 300 fietsen per maand.',
      antwoord_rubric:'1 punt: Qv = Qa gelijkstellen. 1 punt: P = € 200. 1 punt: Q = 300 fietsen.' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Markt',
      vraag:'De gemeente stelt een maximumprijs van € 150 in om fietsen betaalbaar te houden. Leg uit welk marktverschijnsel hierdoor ontstaat en of dit de kopers als groep helpt.',
      antwoord:'Bij € 150 is de gevraagde hoeveelheid 900 − 3·150 = 450 en het aanbod 2·150 − 100 = 200. De vraag (450) is groter dan het aanbod (200): er ontstaat een tekort (vraagoverschot) van 250 fietsen. Niet alle kopers worden geholpen: wie een fiets bemachtigt betaalt minder, maar 250 mensen die tegen die prijs willen kopen kunnen géén fiets krijgen; er kan een wachtlijst of illegale doorverkoop ontstaan.',
      antwoord_rubric:'1 punt: een tekort/vraagoverschot ontstaat (met getallen onderbouwd of beredeneerd omdat de maximumprijs onder het evenwicht ligt). 1 punt: genuanceerd oordeel — sommige kopers profiteren, maar een deel valt buiten de boot / schaarste blijft.' },
    { nr:3, opgave:1, punten:2, type:'open', domein:'Markt',
      vraag:'Er komt een grote groep nieuwe studenten in de stad wonen. Leg uit wat er met de vraaglijn in afbeelding 1 gebeurt en wat het gevolg is voor de evenwichtsprijs.',
      antwoord:'Meer studenten betekent bij elke prijs meer vraag naar fietsen: de hele vraaglijn verschuift naar rechts. Bij de oude prijs ontstaat dan een tekort, waardoor de prijs oploopt naar een nieuw, hoger evenwicht. De evenwichtsprijs én de evenwichtshoeveelheid stijgen.',
      antwoord_rubric:'1 punt: de vraaglijn verschuift naar rechts (meer vraag bij elke prijs). 1 punt: de evenwichtsprijs stijgt.' },
    // ── Opgave 2 · Sparen ──
    { nr:4, opgave:2, punten:3, type:'open', domein:'Tijd',
      vraag:'Bereken het spaarsaldo van Noa na 2 jaar. Laat met een berekening zien waarom het saldo na 2 jaar hoger is dan € 2.000 + 2 × € 80.',
      antwoord:'Na 1 jaar: 2000 · 1,04 = € 2.080. Na 2 jaar: 2080 · 1,04 = € 2.163,20 (of 2000 · 1,04² = € 2.163,20). Bij enkelvoudige rente zou het 2000 + 2·80 = € 2.160 zijn. Het saldo is € 3,20 hoger omdat je in het tweede jaar óók rente krijgt over de € 80 rente van het eerste jaar (rente-op-rente / samengestelde interest).',
      antwoord_rubric:'1 punt: saldo na 1 jaar € 2.080. 1 punt: saldo na 2 jaar € 2.163,20 (of 2000·1,04²). 1 punt: uitleg rente-op-rente = het verschil met € 2.160.' },
    { nr:5, opgave:2, punten:2, type:'open', domein:'Tijd',
      vraag:'In afbeelding 2 worden de staafjes elk jaar een beetje méér hoger dan het jaar ervoor. Leg uit waarom de jaarlijkse toename steeds groter wordt, ook al blijft het rentepercentage 4%.',
      antwoord:'De 4% rente wordt elk jaar berekend over een steeds groter saldo. Omdat het bedrag waarover je rente krijgt jaar na jaar toeneemt, wordt ook het rentebedrag (de toename van het saldo) elk jaar groter. Daardoor lopen de staafjes steeds sneller op (exponentiële groei).',
      antwoord_rubric:'1 punt: de rente wordt over een steeds groter saldo berekend. 1 punt: daardoor wordt de jaarlijkse toename (het rentebedrag) elk jaar groter → exponentiële groei.' },
    // ── Opgave 3 · Break-even ──
    { nr:6, opgave:3, punten:3, type:'open', domein:'Kosten',
      vraag:'Bereken hoeveel sappen Sem per maand minstens moet verkopen om geen verlies te maken (de break-evenafzet). Laat je berekening zien.',
      antwoord:'Per sap houdt Sem 4,00 − 1,50 = € 2,50 over om de constante kosten te dekken (de dekkingsbijdrage). Break-evenafzet = constante kosten ÷ dekkingsbijdrage = 1800 ÷ 2,50 = 720 sappen per maand. Bij 720 sappen zijn TO en TK gelijk (het snijpunt in afbeelding 3).',
      antwoord_rubric:'1 punt: dekkingsbijdrage 4,00 − 1,50 = € 2,50 per sap. 1 punt: 1800 ÷ 2,50. 1 punt: 720 sappen.' },
    { nr:7, opgave:3, punten:2, type:'open', domein:'Kosten',
      vraag:'In afbeelding 3 begint de TK-lijn niet in de oorsprong, maar de TO-lijn wél. Leg dit verschil uit vanuit Sems kostenstructuur.',
      antwoord:'De TK-lijn begint boven de oorsprong omdat Sem ook bij een afzet van 0 sappen al € 1.800 constante kosten (bv. huur) heeft. De TO-lijn begint in de oorsprong omdat je bij 0 verkochte sappen ook € 0 opbrengst hebt; elke verkoop levert pas opbrengst op.',
      antwoord_rubric:'1 punt: TK start boven 0 door de constante kosten (ook bij afzet 0). 1 punt: TO start in de oorsprong omdat er zonder verkoop geen opbrengst is.' },
    { nr:8, opgave:3, punten:2, type:'open', domein:'Kosten',
      vraag:'Sem verkoopt in een maand 1.000 sappen. Bereken zijn winst in die maand.',
      antwoord:'TO = 1000 · 4,00 = € 4.000. TK = 1800 + 1000 · 1,50 = 1800 + 1500 = € 3.300. Winst = 4000 − 3300 = € 700. (Of via de dekkingsbijdrage: (1000 − 720) · 2,50 = 280 · 2,50 = € 700.)',
      antwoord_rubric:'1 punt: TO = € 4.000 én TK = € 3.300 (of dekkingsbijdrage-methode). 1 punt: winst = € 700.' },
    // ── Opgave 4 · Conjunctuur ──
    { nr:9, opgave:4, punten:2, type:'open', domein:'Conjunctuur',
      vraag:'Leg met afbeelding 4 uit wat wordt bedoeld met een periode van hoogconjunctuur, en beschrijf hoe je die in de grafiek herkent.',
      antwoord:'Hoogconjunctuur is een periode waarin de werkelijke productie sneller groeit dan de trend, zodat er een hoogconjunctuur/overbesteding is. In de grafiek herken je dit aan het deel waar de doorgetrokken lijn (werkelijk bbp) bóven de stippellijn (trend) ligt en/of steil oploopt richting een top.',
      antwoord_rubric:'1 punt: hoogconjunctuur = werkelijke productie groeit sterker dan trend / ligt boven de trend. 1 punt: herkenning in de grafiek (doorgetrokken lijn boven de trendlijn / richting een top).' },
    { nr:10, opgave:4, punten:3, type:'open', domein:'Conjunctuur',
      vraag:'In een laagconjunctuur loopt de werkloosheid vaak op. Leg de keten uit van dalende bestedingen tot meer werkloosheid.',
      antwoord:'In een laagconjunctuur geven consumenten en bedrijven minder uit (de bestedingen dalen). Bedrijven verkopen daardoor minder, dus ze produceren minder. Voor minder productie hebben ze minder werknemers nodig, waardoor ze mensen ontslaan of geen nieuwe aannemen: de werkloosheid loopt op (conjuncturele werkloosheid).',
      antwoord_rubric:'1 punt: lagere bestedingen → minder afzet/verkoop. 1 punt: minder afzet → minder productie. 1 punt: minder productie → minder arbeid nodig → meer werkloosheid.' },
    { nr:11, opgave:4, punten:2, type:'open', domein:'Conjunctuur',
      vraag:'De overheid besluit in een laagconjunctuur meer uit te geven aan wegen en scholen. Leg uit hoe dit de conjunctuur kan helpen herstellen.',
      antwoord:'Als de overheid meer besteedt, nemen de totale bestedingen in de economie toe. Bedrijven die wegen en scholen bouwen krijgen meer werk en nemen mensen aan; die mensen verdienen inkomen en gaan dat ook weer uitgeven. Zo stijgen productie en werkgelegenheid en trekt de conjunctuur aan (bestedingsimpuls / anticyclisch beleid).',
      antwoord_rubric:'1 punt: hogere overheidsbestedingen → hogere totale bestedingen. 1 punt: meer productie/werkgelegenheid → conjunctuur herstelt.' },
    // ── Opgave 5 · Koopkracht ──
    { nr:12, opgave:5, punten:3, type:'open', domein:'Geld',
      vraag:'Van 2023 op 2024 stijgt de loonindex van 100 naar 104 en de prijsindex van 100 naar 108. Bereken met deze getallen of de koopkracht van de lonen is gestegen of gedaald, en met hoeveel procent (rond af op één decimaal).',
      antwoord:'Reële-loonindex = (loonindex ÷ prijsindex) × 100 = (104 ÷ 108) × 100 = 96,3. De koopkracht is dus gedaald met ongeveer 100 − 96,3 = 3,7%. De lonen stegen wel (nominaal +4%), maar de prijzen stegen sterker (+8%... hier 8 punten), dus je kunt met je loon minder kopen.',
      antwoord_rubric:'1 punt: reëel loon = loonindex ÷ prijsindex × 100. 1 punt: (104 ÷ 108) × 100 ≈ 96,3. 1 punt: koopkracht daalt met ± 3,7%.' },
    { nr:13, opgave:5, punten:2, type:'open', domein:'Geld',
      vraag:'Leg met afbeelding 5 uit waarom de werknemers er in koopkracht op achteruitgaan, ook al stijgt hun loon elk jaar.',
      antwoord:'In de grafiek loopt de prijsindex (oranje) steiler op dan de loonindex (blauw): de prijzen stijgen elk jaar méér dan de lonen. Hun loon stijgt dus wel in euro’s (nominaal), maar omdat de prijzen sneller stijgen kunnen ze met dat loon minder goederen kopen. De koopkracht (het reële loon) daalt daardoor.',
      antwoord_rubric:'1 punt: aflezen dat de prijsindex sneller stijgt dan de loonindex. 1 punt: daardoor daalt de koopkracht ondanks de nominale loonstijging.' },
    // ── Opgave 6 · Speltheorie ──
    { nr:14, opgave:6, punten:3, type:'open', domein:'Speltheorie',
      vraag:'Stel dat beide supermarkten een hoge prijs vragen. Leg met afbeelding 6 uit waarom supermarkt A er toch belang bij heeft om als enige naar een lage prijs over te stappen.',
      antwoord:'Bij hoge prijs / hoge prijs verdient A 8 mln. Als A als enige naar een lage prijs gaat (lage prijs, hoge prijs van B) stijgt A’s winst naar 10 mln, omdat A dan klanten van B wegtrekt. Voor A alleen is overstappen dus voordeliger (10 > 8): A heeft een prikkel om de afspraak te breken.',
      antwoord_rubric:'1 punt: A gaat van 8 mln (hoog/hoog) naar 10 mln (laag terwijl B hoog blijft) — afgelezen uit de matrix. 1 punt: A trekt klanten van B weg. 1 punt: conclusie dat overstappen voor A voordeliger is → prikkel om te breken.' },
    { nr:15, opgave:6, punten:3, type:'open', domein:'Speltheorie',
      vraag:'Beide supermarkten redeneren op dezelfde manier. Beredeneer welke uitkomst uiteindelijk ontstaat en leg uit waarom die voor beide bedrijven slechter is dan samen een hoge prijs vragen.',
      antwoord:'Omdat elk bedrijf, wat de ander ook doet, met een lage prijs meer of evenveel verdient (10 > 8 als de ander hoog zit; 4 > 2 als de ander laag zit), kiezen beide de lage prijs. De uitkomst is lage prijs / lage prijs met 4 mln elk. Dat is voor beide slechter dan samen hoge prijs (8 mln elk): door tegen elkaar te concurreren komen ze in de slechtere uitkomst terecht (gevangenendilemma).',
      antwoord_rubric:'1 punt: beide kiezen lage prijs (dominante keuze, met de matrix onderbouwd). 1 punt: uitkomst = 4 / 4. 1 punt: dat is slechter dan 8 / 8 bij samen hoog → gevangenendilemma.' },
    { nr:16, opgave:6, punten:2, type:'open', domein:'Speltheorie',
      vraag:'De twee supermarkten maken samen de geheime afspraak om allebei een hoge prijs te vragen (een kartel). Leg uit waarom zo’n afspraak in de praktijk vaak instabiel is én noem een reden waarom de overheid kartels verbiedt.',
      antwoord:'De afspraak is instabiel omdat elk bedrijf de verleiding heeft om stiekem tóch de prijs te verlagen: wie als enige zakt, pakt klanten van de ander af en verdient meer (10 in plaats van 8). Zodra één de afspraak breekt, volgt de ander en belanden ze bij 4/4. De overheid verbiedt kartels omdat de hoge afgesproken prijs ten koste gaat van de consumenten, die te veel betalen; concurrentie houdt de prijzen lager.',
      antwoord_rubric:'1 punt: instabiel omdat elk bedrijf voordeel heeft bij het breken van de afspraak (10 > 8). 1 punt: overheid verbiedt kartels omdat de consument door de hoge prijs benadeeld wordt.' },
  ],
};
