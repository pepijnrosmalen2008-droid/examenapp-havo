// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-du.js  ORIGINEEL Slagio-proefexamen (vwo Duits).
// Eigen Duitse tekst, vragen en figuren. Geen reproductie van een CvTE-examen.
// VWO-CE-niveau leesvaardigheid: Hauptgedanke, functie alinea, woord in
// context, verwijswoord, houding auteur en gap-fit. Vragen in het
// Nederlands (zoals op het CE); de tekst is volledig door Slagio geschreven.
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

var _VDUAFB = {
  // Duitse tekst als artikelkaart
  artikel:`<svg viewBox="0 0 360 204" role="img" aria-label="deutscher artikelausschnitt"><rect x="14" y="10" width="332" height="186" rx="6" fill="#ffffff" stroke="#d7dde6" stroke-width="1.4"/>
    <text x="30" y="34" font-family="Georgia,serif" font-size="13.5" font-weight="800" fill="#1b2230">Der Wolf ist zurück</text>
    <text x="30" y="49" font-family="sans-serif" font-size="8" font-style="italic" fill="#8a94a3">Segen oder Gefahr für das Land?</text>
    <line x1="30" y1="57" x2="330" y2="57" stroke="#eef1f5" stroke-width="1.4"/>
    <g font-family="Georgia,serif" font-size="8.5" fill="#3a4250">
      <text x="30" y="74">(1) Mehr als hundert Jahre lang galt der Wolf in</text>
      <text x="30" y="88">Deutschland als ausgestorben. Seit einigen Jahren aber</text>
      <text x="30" y="102">kehrt er zurück: Heute leben wieder mehr als tausend</text>
      <text x="30" y="116">Wölfe in den Wäldern des Landes.</text>
      <text x="30" y="134">(2) Naturschützer freuen sich darüber. Viele Bauern</text>
      <text x="30" y="148">jedoch sind besorgt, denn die Wölfe reißen manchmal</text>
      <text x="30" y="162">ihre Schafe. Der Streit darüber, wie man mit dem</text>
      <text x="30" y="176">Rückkehrer umgehen soll, wird immer lauter.</text>
    </g></svg>`,
  // Structuur schema
  structuur:`<svg viewBox="0 0 360 180" role="img" aria-label="struktur der argumentation">
    <g font-family="sans-serif">
      <rect x="30" y="16" width="140" height="46" rx="6" fill="#eafaf0" stroke="#2e9e5b" stroke-width="1.6"/><text x="100" y="34" font-size="9" font-weight="800" fill="#1b7a41" text-anchor="middle">Naturschützer</text><text x="100" y="47" font-size="7" fill="#4a5568" text-anchor="middle">Artenvielfalt,</text><text x="100" y="56" font-size="7" fill="#4a5568" text-anchor="middle">Rückkehr = Erfolg</text>
      <rect x="190" y="16" width="140" height="46" rx="6" fill="#fbeaea" stroke="#c0392b" stroke-width="1.6"/><text x="260" y="34" font-size="9" font-weight="800" fill="#9e2b22" text-anchor="middle">Bauern</text><text x="260" y="47" font-size="7" fill="#4a5568" text-anchor="middle">gerissene Schafe,</text><text x="260" y="56" font-size="7" fill="#4a5568" text-anchor="middle">Angst, Kosten</text>
      <rect x="96" y="92" width="168" height="40" rx="6" fill="#eef4ff" stroke="#2563eb" stroke-width="1.6"/><text x="180" y="110" font-size="9" font-weight="800" fill="#1b4fb0" text-anchor="middle">Kompromiss?</text><text x="180" y="123" font-size="7.5" fill="#4a5568" text-anchor="middle">Herdenschutz + Entschädigung</text>
    </g>
    <g stroke="#94a0b8" stroke-width="1.4"><line x1="100" y1="62" x2="150" y2="92"/><line x1="260" y1="62" x2="210" y2="92"/></g>
    <text x="180" y="164" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">Abbildung: zwei Seiten und ein möglicher Kompromiss</text></svg>`,
  // Toon schaal
  toon:`<svg viewBox="0 0 360 150" role="img" aria-label="haltung des autors">
    <text x="180" y="26" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">die Haltung des Autors</text>
    <line x1="40" y1="80" x2="320" y2="80" stroke="#1b2230" stroke-width="2"/>
    <g stroke="#1b2230" stroke-width="1.4"><line x1="40" y1="74" x2="40" y2="86"/><line x1="180" y1="74" x2="180" y2="86"/><line x1="320" y1="74" x2="320" y2="86"/></g>
    <g font-family="sans-serif" font-size="8.5" fill="#4a5568" text-anchor="middle"><text x="40" y="100">begeistert</text><text x="180" y="100">abwägend /</text><text x="180" y="110">neutral</text><text x="320" y="100">ablehnend</text></g>
    <circle cx="180" cy="80" r="6" fill="#2563eb"/><text x="180" y="62" font-family="sans-serif" font-size="8" font-weight="700" fill="#2563eb" text-anchor="middle">Autor hier</text>
    <text x="180" y="138" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">Abbildung: die Position des Autors</text></svg>`,
};

SLAGIO_EXAMENS.vwo.du = {
  origineel: true,
  titel: 'Duits',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 150,
  max_punten: 16,
  bron: 'Slagio origineel · examenstijl (eigen Duitse tekst)',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Lesen: "Der Wolf ist zurück"',
      context:'Lees de tekst. Absatz 1: Meer dan honderd jaar gold de wolf in Duitsland als uitgestorven, maar sinds enkele jaren keert hij terug; nu leven er weer meer dan duizend wolven in de bossen. Absatz 2: Natuurbeschermers zijn blij, maar veel boeren zijn bezorgd omdat de wolven soms hun schapen doden; de ruzie over hoe je met de terugkeerder moet omgaan wordt steeds luider. Absatz 3: Voorstanders wijzen erop dat de wolf bovenaan de voedselketen staat en zo het ecosysteem gezond houdt. Absatz 4: Boeren eisen dat de overheid hen schadeloosstelt en dat "probleemwolven" mogen worden afgeschoten. Absatz 5: De auteur besluit dat er alleen een oplossing komt als beide partijen samenwerken.',
      afb:_VDUAFB.artikel, afb_cap:'de openingsalinea\'s van de tekst' },
    { nr:2, titel:'Die Struktur',
      context:'Het onderstaande schema geeft de twee kampen in het debat weer en een mogelijk compromis.',
      afb:_VDUAFB.structuur, afb_cap:'twee kanten en een mogelijk compromis' },
    { nr:3, titel:'Die Haltung des Autors',
      context:'De schaal hieronder toont mogelijke houdingen die een auteur tegenover een onderwerp kan innemen.',
      afb:_VDUAFB.toon, afb_cap:'de positie van de auteur' },
    { nr:4, titel:'Wortschatz im Kontext',
      context:'De volgende vragen gaan over de betekenis van specifieke woorden en zinnen in de tekst.',
      afb:_VDUAFB.artikel, afb_cap:'de tekst, voor de woordvragen' },
  ],
  vragen: [
    // Opgave 1
    { nr:1, opgave:1, punten:2, type:'open', domein:'Hauptgedanke',
      vraag:'Wat is de hoofdgedachte (Hauptgedanke) van de tekst? Formuleer je antwoord in het Nederlands in een volzin.',
      antwoord:'De hoofdgedachte is dat de wolf na meer dan honderd jaar terugkeert in Duitsland, wat door natuurbeschermers wordt toegejuicht maar door veel boeren als een bedreiging wordt gezien, zodat er een fel en groeiend debat is over hoe je met de teruggekeerde wolf moet omgaan. De kern moet bevatten: (1) het onderwerp (terugkeer van de wolf in Duitsland), en (2) het conflict (natuurbeschermers blij, boeren bezorgd; groeiend debat).',
      antwoord_rubric:'1 punt: onderwerp correct (terugkeer van de wolf in Duitsland). 1 punt: het conflict/debat (natuurbeschermers tegenover bezorgde boeren), in een volzin.' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Absatzfunktion',
      vraag:'Wat is de functie van Absatz 2 ("Naturschützer freuen sich... Viele Bauern jedoch sind besorgt...") ten opzichte van Absatz 1?',
      antwoord:'Absatz 1 beschrijft het feit: de wolf is na lange tijd terug in Duitsland. Absatz 2 introduceert vervolgens de tegenstelling / het conflict: natuurbeschermers zijn blij, maar boeren zijn bezorgd omdat de wolven schapen doden. De functie van Absatz 2 is dus het introduceren van de controverse tussen de twee partijen. Het woord "jedoch" (echter) markeert deze tegenstelling.',
      antwoord_rubric:'1 punt: Absatz 1 presenteert het feit, Absatz 2 introduceert de tegenstelling/controverse (natuurbeschermers tegenover boeren). 1 punt: herkenning van de contrastfunctie (bv. via "jedoch").' },
    // Opgave 2
    { nr:3, opgave:2, punten:2, type:'open', domein:'Argument',
      vraag:'Noem met behulp van het schema een argument van de Naturschützer en een zorg van de Bauern.',
      antwoord:'Een argument van de Naturschützer (natuurbeschermers): de terugkeer van de wolf is een succes voor de biodiversiteit / Artenvielfalt; de wolf staat bovenaan de voedselketen en houdt het ecosysteem gezond. Een zorg van de Bauern (boeren): de wolven doden ("reißen") hun schapen, wat leidt tot financiele schade (Kosten) en angst; daarom willen zij schadeloosstelling en het mogen afschieten van probleemwolven.',
      antwoord_rubric:'1 punt: een correct argument van de natuurbeschermers (biodiversiteit/gezond ecosysteem/succes). 1 punt: een correcte zorg van de boeren (gedode schapen, kosten/angst).' },
    // Opgave 3
    { nr:4, opgave:3, punten:2, type:'open', domein:'Haltung',
      vraag:'Welke houding neemt de auteur aan: begeistert, ablehnend of abwägend/neutraal? Onderbouw je antwoord met wat in de tekst gebeurt.',
      antwoord:'De auteur neemt een afwegende, neutrale (abwägend/neutral) houding aan. Hij kiest geen partij, maar zet beide kampen even serieus naast elkaar (natuurbeschermers en boeren) en besluit dat er alleen een oplossing komt als beide partijen samenwerken. Hij pleit dus voor een compromis (Herdenschutz en schadeloosstelling) in plaats van eenzijdig voor of tegen de wolf te zijn. Dat wijst op een neutrale, bemiddelende houding.',
      antwoord_rubric:'1 punt: abwägend/neutraal (niet begeistert of ablehnend). 1 punt: onderbouwing (beide kampen serieus naast elkaar, pleit voor samenwerking/compromis).' },
    // Opgave 4
    { nr:5, opgave:4, punten:2, type:'open', domein:'Wortschatz',
      vraag:'In Absatz 2 staat het werkwoord "reißen" ("die Wölfe reißen manchmal ihre Schafe"). Leg in het Nederlands uit wat dit woord hier betekent.',
      antwoord:'"Reissen" betekent hier "doodbijten" / "verscheuren": de wolven vallen de schapen aan en doden ze. In deze context gaat het erom dat de wolven soms de schapen van de boeren doodbijten, wat de reden is voor de zorgen en het verzet van de boeren. (Het is dus geen "scheuren" in de zin van papier, maar het aanvallen en doden van een prooidier.)',
      antwoord_rubric:'1 punt: correcte betekenis (doodbijten/verscheuren/doden van de schapen). 1 punt: passend in de context (wolven vallen schapen aan -> reden voor de zorgen van de boeren).' },
    { nr:6, opgave:4, punten:2, type:'open', domein:'Verweiswort',
      vraag:'In Absatz 2 staat: "Der Streit darüber, wie man mit dem Rückkehrer umgehen soll...". Naar wie of wat verwijst "dem Rückkehrer" (de terugkeerder)?',
      antwoord:'"Dem Rückkehrer" (de terugkeerder) verwijst naar de wolf: het dier dat na meer dan honderd jaar naar Duitsland is teruggekeerd (Absatz 1: "Seit einigen Jahren aber kehrt er zurück"). De "terugkeerder" is dus een omschrijving van de wolf, over wie de hele ruzie gaat.',
      antwoord_rubric:'1 punt: "der Rückkehrer" = de wolf. 1 punt: onderbouwing dat het de teruggekeerde wolf is (koppeling aan "kehrt er zurück" uit Absatz 1).' },
    { nr:7, opgave:4, punten:2, type:'open', domein:'Gap fit',
      vraag:'Stel dat aan het einde van Absatz 4 een zin is weggelaten. Welke van deze twee zinnen past daar het best, en waarom? A: "Deshalb fordern sie mehr Unterstützung vom Staat." B: "Deshalb wollen sie den Wolf noch strenger schützen."',
      antwoord:'Zin A past het best: "Deshalb fordern sie mehr Unterstützung vom Staat" (daarom eisen zij meer steun van de staat). Absatz 4 gaat over de boeren, die schadeloosstelling eisen en willen dat probleemwolven mogen worden afgeschoten. Zin A sluit daar logisch op aan: de boeren vragen meer steun/hulp van de overheid. Zin B ("den Wolf noch strenger schützen" = de wolf nog strenger beschermen) is juist het tegenovergestelde van wat de boeren willen; die zin past dus niet bij hun standpunt.',
      antwoord_rubric:'1 punt: keuze A. 1 punt: onderbouwing dat A aansluit bij de eisen van de boeren (steun van de staat), terwijl B (wolf strenger beschermen) daarmee in tegenspraak is.' },
    { nr:8, opgave:4, punten:2, type:'open', domein:'Schlussfolgerung',
      vraag:'Leg uit wat de auteur bedoelt met zijn conclusie dat er alleen een oplossing komt als beide partijen samenwerken. Wat zegt dit over zijn kijk op het conflict?',
      antwoord:'De auteur bedoelt dat het probleem van de teruggekeerde wolf niet wordt opgelost door alleen de kant van de natuurbeschermers of alleen de kant van de boeren te kiezen. Alleen als beide partijen samen naar een oplossing zoeken (bijvoorbeeld kuddebescherming en schadeloosstelling), kan de wolf terugkeren zonder dat de boeren de dupe worden. Dit laat zien dat de auteur het conflict als oplosbaar ziet, maar alleen via een compromis en wederzijds begrip; hij kiest zelf geen partij, maar roept op tot samenwerking.',
      antwoord_rubric:'1 punt: uitleg dat geen van beide kanten alleen de oplossing biedt; alleen samen (compromis) werkt. 1 punt: dit toont dat de auteur bemiddelend/genuanceerd is en het conflict oplosbaar acht via samenwerking.' },
  ],
};
