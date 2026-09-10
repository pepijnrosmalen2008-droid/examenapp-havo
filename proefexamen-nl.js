// ═══════════════════════════════════════════════════════════════════════
// proefexamen-nl.js — ORIGINEEL Slagio-proefexamen in examenstijl (havo nl).
// Eigen tekstfragmenten, vragen en figuren. Géén reproductie van een CvTE-
// examen. CE-niveau leesvaardigheid & argumentatie: hoofdgedachte,
// tekstverband, argumentatiestructuur, drogredenen, stijl en samenvatten.
// Elke opgave heeft een passend schema/diagram/grafiek. Rubric per vraag.
//   opgaven[] = {nr,titel,context,afb,afb_cap}
//   vragen[]  = {nr,opgave,punten,type,vraag,antwoord,antwoord_rubric,domein}
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.havo = SLAGIO_EXAMENS.havo || {};

var _NLAFB = {
  // Argumentatiestructuur: standpunt met twee nevengeschikte argumenten
  argstructuur:`<svg viewBox="0 0 360 200" role="img" aria-label="schema van de argumentatiestructuur"><rect x="96" y="16" width="168" height="34" rx="8" fill="#e8f0ff" stroke="#2563eb" stroke-width="1.6"/><text x="180" y="37" font-family="sans-serif" font-size="11.5" font-weight="700" fill="#1b2230" text-anchor="middle">Standpunt</text><g stroke="#94a0b8" stroke-width="1.6" fill="none"><path d="M180 50 L180 66"/><path d="M110 78 L110 66 L250 66 L250 78"/><path d="M180 66 L180 78"/></g><rect x="24" y="80" width="132" height="40" rx="8" fill="#fff" stroke="#1b2230" stroke-width="1.4"/><text x="90" y="104" font-family="sans-serif" font-size="11" fill="#1b2230" text-anchor="middle">Argument 1</text><rect x="204" y="80" width="132" height="40" rx="8" fill="#fff" stroke="#1b2230" stroke-width="1.4"/><text x="270" y="104" font-family="sans-serif" font-size="11" fill="#1b2230" text-anchor="middle">Argument 2</text><line x1="270" y1="120" x2="270" y2="140" stroke="#94a0b8" stroke-width="1.6"/><rect x="204" y="142" width="132" height="42" rx="8" fill="#fff7ed" stroke="#e8580c" stroke-width="1.4" stroke-dasharray="5 4"/><text x="270" y="160" font-family="sans-serif" font-size="10.5" fill="#1b2230" text-anchor="middle">Onderbouwing<tspan x="270" dy="13">bij argument 2</tspan></text></svg>`,
  // Infographic: staafdiagram leestijd jongeren daalt
  leesgrafiek:`<svg viewBox="0 0 360 196" role="img" aria-label="staafdiagram gemiddelde leestijd per week"><line x1="52" y1="14" x2="52" y2="158" stroke="#1b2230" stroke-width="2"/><line x1="52" y1="158" x2="344" y2="158" stroke="#1b2230" stroke-width="2"/><g fill="#2563eb"><rect x="78" y="54" width="42" height="104"/><rect x="150" y="86" width="42" height="72"/><rect x="222" y="112" width="42" height="46"/><rect x="294" y="128" width="42" height="30"/></g><g font-family="sans-serif" font-size="10" fill="#fff" text-anchor="middle" font-weight="700"><text x="99" y="72">115</text><text x="171" y="104">82</text><text x="243" y="130">55</text><text x="315" y="146">38</text></g><g font-family="sans-serif" font-size="10" fill="#4a5568" text-anchor="middle"><text x="99" y="172">2010</text><text x="171" y="172">2015</text><text x="243" y="172">2020</text><text x="315" y="172">2024</text></g><text x="0" y="0" transform="translate(18,116) rotate(-90)" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#1b2230" text-anchor="middle">leestijd (min/week)</text></svg>`,
  // Tekstopbouw: alinea-blokken met functies (probleem → oorzaken → oplossing)
  opbouw:`<svg viewBox="0 0 360 196" role="img" aria-label="schema van de tekstopbouw per alineablok"><g font-family="sans-serif" font-size="10.5" fill="#1b2230">${['Inleiding — aanleiding','Probleem','Oorzaken','Mogelijke oplossing','Slot — mening schrijver'].map((t,i)=>{var y=18+i*35;var col=['#eef2f7','#fde7e7','#fff2dd','#e5f6ec','#e8f0ff'][i];var bc=['#9aa5b5','#e05353','#e8a400','#2e9e5b','#2563eb'][i];return '<rect x="70" y="'+y+'" width="220" height="26" rx="6" fill="'+col+'" stroke="'+bc+'" stroke-width="1.4"/><text x="180" y="'+(y+17)+'" text-anchor="middle">'+t+'</text>'+(i<4?'<line x1="180" y1="'+(y+26)+'" x2="180" y2="'+(y+35)+'" stroke="#94a0b8" stroke-width="1.6"/>':'');}).join('')}</g><text x="46" y="30" font-family="sans-serif" font-size="10" fill="#4a5568" text-anchor="end">1</text><text x="46" y="170" font-family="sans-serif" font-size="10" fill="#4a5568" text-anchor="end">7</text><text x="30" y="100" font-family="sans-serif" font-size="9.5" fill="#8a94a8" transform="rotate(-90 30 100)" text-anchor="middle">alinea</text></svg>`,
  // Drogreden: cirkel-schema autoriteit / verkeerde oorzaak
  drogreden:`<svg viewBox="0 0 360 176" role="img" aria-label="schema van een onjuiste redenering"><rect x="20" y="60" width="118" height="48" rx="8" fill="#fff" stroke="#1b2230" stroke-width="1.4"/><text x="79" y="80" font-family="sans-serif" font-size="10" fill="#1b2230" text-anchor="middle">Bewering:<tspan x="79" dy="13">"een bekende zegt X"</tspan></text><g stroke="#e05353" stroke-width="1.8" fill="none"><line x1="138" y1="84" x2="212" y2="84"/><path d="M204 79 L214 84 L204 89"/></g><text x="176" y="76" font-family="sans-serif" font-size="15" font-weight="700" fill="#e05353" text-anchor="middle">?</text><rect x="216" y="60" width="124" height="48" rx="8" fill="#fff7ed" stroke="#e8580c" stroke-width="1.4"/><text x="278" y="80" font-family="sans-serif" font-size="10" fill="#1b2230" text-anchor="middle">Conclusie:<tspan x="278" dy="13">"dus X is waar"</tspan></text><text x="176" y="140" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#e05353" text-anchor="middle">de stap klopt niet — welke drogreden?</text></svg>`,
};

SLAGIO_EXAMENS.havo.nl = {
  origineel: true,
  titel: 'Nederlands',
  niveau: 'havo',
  jaar: new Date().getFullYear(),
  duur_minuten: 70,
  max_punten: 16,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Tekst 1 — "Zet die telefoon eens weg"',
      context:'Lees de volgende alinea uit een betoog.\n\n"Scholen zouden smartphones tijdens lessen helemaal moeten verbieden. In de eerste plaats leiden telefoons leerlingen voortdurend af: een trillend berichtje onderbreekt de concentratie, ook al kijk je er niet naar. Daarnaast gaat een verbod pesten tegen. Uit onderzoek van een lerarenvakbond blijkt namelijk dat online pesten vaak juist tijdens schooltijd begint. Wie de telefoon uit de klas weert, haalt dus een belangrijke bron van afleiding én van conflict weg."\n\nAfbeelding 1 geeft de argumentatiestructuur van deze alinea schematisch weer.',
      afb:_NLAFB.argstructuur, afb_cap:'afbeelding 1 — de argumentatiestructuur van de alinea' },
    { nr:2, titel:'Tekst 2 — "Lezen loopt terug"',
      context:'Bij een artikel over leesgedrag staat afbeelding 2. De journalist schrijft: "De cijfers liegen er niet om: jongeren lezen in hun vrije tijd steeds minder, en de daling lijkt eerder te versnellen dan af te vlakken."',
      afb:_NLAFB.leesgrafiek, afb_cap:'afbeelding 2 — gemiddelde leestijd van jongeren per week' },
    { nr:3, titel:'Tekst 3 — opbouw van een betoog',
      context:'Afbeelding 3 toont schematisch de opbouw van een betoog over lerarentekort, verdeeld over zeven alinea\'s met de functie van elk tekstblok.',
      afb:_NLAFB.opbouw, afb_cap:'afbeelding 3 — de opbouw van het betoog per alineablok' },
    { nr:4, titel:'Tekst 4 — een wankele redenering',
      context:'In een online discussie schrijft iemand: "Een beroemde topsporter gebruikt deze vitaminepillen en zweert erbij. Die pillen werken dus echt." Afbeelding 4 zet deze redenering schematisch neer.',
      afb:_NLAFB.drogreden, afb_cap:'afbeelding 4 — de stap van bewering naar conclusie' },
  ],
  vragen: [
    // ── Opgave 1 · Argumentatie ──
    { nr:1, opgave:1, punten:1, type:'open', domein:'Argumentatie',
      vraag:'Wat is het standpunt (de hoofdstelling) van de schrijver in deze alinea? Noteer het in je eigen woorden.',
      antwoord:'Het standpunt is dat scholen smartphones tijdens de les helemaal zouden moeten verbieden.',
      antwoord_rubric:'1 punt: het standpunt is dat smartphones in de les (op school) verboden zouden moeten worden.' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Argumentatie',
      vraag:'In afbeelding 1 staan twee argumenten. Noem beide argumenten die de schrijver voor het standpunt geeft.',
      antwoord:'Argument 1: telefoons leiden leerlingen voortdurend af (verstoren de concentratie). Argument 2: een verbod gaat (online) pesten tegen, omdat online pesten vaak tijdens schooltijd begint.',
      antwoord_rubric:'1 punt: argument 1 = telefoons leiden af / verstoren de concentratie. 1 punt: argument 2 = een verbod gaat pesten tegen.' },
    { nr:3, opgave:1, punten:2, type:'open', domein:'Argumentatie',
      vraag:'Bij argument 2 hoort in afbeelding 1 een apart blok "onderbouwing". Welke zin uit de tekst vormt die onderbouwing, en leg uit waarom het een onderbouwing en geen zelfstandig argument is.',
      antwoord:'De onderbouwing is: "Uit onderzoek van een lerarenvakbond blijkt namelijk dat online pesten vaak juist tijdens schooltijd begint." Het is geen zelfstandig argument omdat het niet rechtstreeks het standpunt steunt, maar alleen argument 2 (dat een verbod pesten tegengaat) geloofwaardiger maakt met een onderzoeksgegeven.',
      antwoord_rubric:'1 punt: de juiste zin (het onderzoek dat online pesten tijdens schooltijd begint). 1 punt: uitleg dat het argument 2 ondersteunt en niet los het standpunt steunt.' },
    // ── Opgave 2 · Grafiek & tekstverband ──
    { nr:4, opgave:2, punten:2, type:'open', domein:'Leesvaardigheid',
      vraag:'De journalist schrijft dat de daling "eerder lijkt te versnellen dan af te vlakken". Beoordeel met de getallen in afbeelding 2 of die uitspraak klopt. Onderbouw met een berekening of vergelijking.',
      antwoord:'De uitspraak klopt niet goed. De daling per periode van vijf jaar wordt juist kleiner: 2010→2015 daalt het van 115 naar 82 (−33 min), 2015→2020 van 82 naar 55 (−27 min) en 2020→2024 van 55 naar 38 (−17 min in vier jaar). De afname wordt dus per periode steeds kleiner: de daling vlakt eerder af dan dat hij versnelt.',
      antwoord_rubric:'1 punt: de afnames per periode benoemen/vergelijken (−33, −27, −17 of gelijkwaardig). 1 punt: conclusie dat de daling afvlakt, dus de uitspraak klopt niet.' },
    { nr:5, opgave:2, punten:2, type:'open', domein:'Leesvaardigheid',
      vraag:'Leg uit welke functie afbeelding 2 heeft ten opzichte van de tekst van de journalist. Gebruik in je antwoord het begrip "ondersteunen" of "illustreren".',
      antwoord:'De grafiek ondersteunt/illustreert de bewering van de journalist dat jongeren steeds minder lezen: hij maakt de dalende leestijd met concrete cijfers zichtbaar en dus geloofwaardiger. De afbeelding levert het bewijsmateriaal bij de tekst.',
      antwoord_rubric:'1 punt: de grafiek ondersteunt/illustreert de bewering (dat de leestijd daalt). 1 punt: uitleg dat cijfers de tekst concreter/geloofwaardiger maken.' },
    // ── Opgave 3 · Tekstopbouw ──
    { nr:6, opgave:3, punten:2, type:'open', domein:'Leesvaardigheid',
      vraag:'Volgens afbeelding 3 volgt op het blok "Probleem" het blok "Oorzaken". Welk tekstverband bestaat er tussen deze twee blokken? Noem een signaalwoord dat bij dit verband past.',
      antwoord:'Tussen "Probleem" en "Oorzaken" bestaat een oorzaak-gevolg-verband (een verklarend/oorzakelijk verband): het tweede blok legt uit waardoor het probleem ontstaat. Passende signaalwoorden zijn bijvoorbeeld "doordat", "omdat", "hierdoor" of "de oorzaak hiervan is".',
      antwoord_rubric:'1 punt: oorzaak-gevolg- / verklarend verband. 1 punt: een passend signaalwoord (doordat/omdat/hierdoor/de oorzaak is).' },
    { nr:7, opgave:3, punten:2, type:'open', domein:'Leesvaardigheid',
      vraag:'Het laatste blok heet "Slot — mening schrijver". Leg uit waarom je aan deze opbouw kunt zien dat de hele tekst een betoog is en geen zakelijke uiteenzetting.',
      antwoord:'In het slot geeft de schrijver zijn eigen mening en probeert hij de lezer te overtuigen; de tekst werkt via een probleem en oplossing naar een standpunt toe. Een uiteenzetting zou alleen neutraal informatie geven zonder de lezer van een mening te willen overtuigen. Omdat hier duidelijk een mening wordt verdedigd, is het een betoog.',
      antwoord_rubric:'1 punt: in het slot staat een mening / de schrijver wil overtuigen. 1 punt: verschil met een uiteenzetting = die informeert neutraal zonder te overtuigen.' },
    // ── Opgave 4 · Drogreden ──
    { nr:8, opgave:4, punten:2, type:'open', domein:'Argumentatie',
      vraag:'De redenering in afbeelding 4 bevat een drogreden. Benoem de drogreden en leg uit waarom de stap van bewering naar conclusie niet deugt.',
      antwoord:'Het is een beroep op autoriteit (autoriteitsargument als drogreden): dat een beroemde topsporter de pillen gebruikt en aanprijst, bewijst niet dat de pillen werken. Een sporter is geen deskundige op het gebied van vitaminewerking, en persoonlijke ervaring is geen wetenschappelijk bewijs. De conclusie "dus ze werken echt" volgt daarom niet uit de bewering.',
      antwoord_rubric:'1 punt: (onjuist) beroep op autoriteit / autoriteitsargument. 1 punt: uitleg dat bekendheid/populariteit geen bewijs is dat de pillen werken.' },
    { nr:9, opgave:4, punten:1, type:'open', domein:'Argumentatie',
      vraag:'Bedenk één zin waarmee de schrijver de bewering wél overtuigend zou kunnen onderbouwen in plaats van met de beroemde sporter.',
      antwoord:'Bijvoorbeeld: "Uit een gecontroleerd onderzoek onder 500 deelnemers bleek dat wie deze pillen slikte significant minder vaak verkouden werd dan de controlegroep." (Elke zin met deugdelijk, controleerbaar bewijs — onderzoek, cijfers, deskundigen — is goed.)',
      antwoord_rubric:'1 punt: een onderbouwing met deugdelijk/controleerbaar bewijs (onderzoek, cijfers, deskundige) in plaats van een beroep op een bekende persoon.' },
  ],
};
