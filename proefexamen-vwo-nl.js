// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-nl.js  ORIGINEEL Slagio-proefexamen (vwo Nederlands).
// Eigen tekst, vragen en figuren. Geen reproductie van een CvTE-examen.
// CE-stijl leesvaardigheid + argumentatie op EEN langere tekst, met een
// mix van meerkeuze- en open vragen en een essentie/samenvattingsopdracht,
// zoals op het echte centraal examen. De tekst is door Slagio geschreven.
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

// De volledige tekst (wordt bij elke opgave als context getoond).
var _VNLTEKST =
`(1) In verschillende landen klinkt de laatste jaren dezelfde roep: verbied sociale media voor jongeren onder de zestien. Australië nam al een wet aan, en ook in Europa denken politici er hardop over na. De vraag is niet langer of we de macht van deze platforms moeten inperken, maar hoe ver we daarin mogen gaan.

(2) De zorg die achter dit voorstel schuilt, is niet ongegrond. Onderzoek wijst op een verband tussen intensief gebruik van sociale media en klachten als slaapgebrek, somberheid en een negatief zelfbeeld bij tieners. De apps zijn bovendien met opzet zo ontworpen dat je blijft scrollen: elke melding, elke like is een kleine beloning die om herhaling vraagt.

(3) Voorstanders van een leeftijdsgrens wijzen daarom op de kwetsbaarheid van het jonge brein. Wie op zijn twaalfde nog volop in ontwikkeling is, kan de verslavende trucs van de platforms moeilijker weerstaan dan een volwassene. Een wettelijke grens, zeggen zij, beschermt niet alleen de jongere zelf, maar geeft ook ouders eindelijk iets om op terug te vallen: niet langer "iedereen in de klas zit erop", maar een duidelijke regel voor iedereen.

(4) Tegenstanders vinden dit echter veel te kort door de bocht. Sociale media, zo stellen zij, zijn niet alleen maar schadelijk: ze verbinden mensen, geven toegang tot informatie en bieden juist eenzame of buitengesloten jongeren een plek waar zij wel gehoord worden. Een verbod is in hun ogen betuttelend en bovendien onuitvoerbaar, want welke tiener weet niet hoe je een geboortedatum vervalst?

(5) Toch overtuigt dat tegenargument niet helemaal. Verbondenheid en informatie zijn immers ook zonder de eindeloze, verslavende tijdlijn mogelijk; het zijn niet die functies die de schade veroorzaken. En dat een regel niet waterdicht te handhaven is, betekent nog niet dat hij zinloos is: ook een snelheidslimiet wordt overtreden, en toch redt hij levens door een norm te stellen.

(6) De kern van het probleem ligt volgens veel deskundigen dan ook niet bij de leeftijd, maar bij het ontwerp. In de zogenoemde aandachtseconomie verdienen platforms geld aan de tijd die je op het scherm doorbrengt, en dus zijn ze geoptimaliseerd om die tijd zo lang mogelijk te maken. Zolang dat verdienmodel intact blijft, verplaatst een leeftijdsgrens het probleem hooguit naar het zestiende jaar.

(7) Een leeftijdsgrens is daarmee een bot instrument, maar wel een verdedigbare eerste stap. Wie werkelijk iets aan de schade wil doen, zal echter verder moeten kijken dan de leeftijd van de gebruiker, en de manier waarop deze apps zijn gebouwd zelf aan banden moeten leggen. Niet de jongere, maar het ontwerp verdient de strengste regel.`;

function _nlHdr(){
  return '<svg viewBox="0 0 360 96" role="img" aria-label="artikelkop"><rect x="10" y="8" width="340" height="80" rx="6" fill="#ffffff" stroke="#d7dde6" stroke-width="1.4"/>'+
    '<rect x="10" y="8" width="6" height="80" rx="3" fill="#e8580c"/>'+
    '<text x="28" y="38" font-family="Georgia,serif" font-size="15" font-weight="800" fill="#1b2230">Een leeftijdsgrens voor sociale media?</text>'+
    '<text x="28" y="58" font-family="sans-serif" font-size="9.5" font-style="italic" fill="#8a94a3">een betoog over jongeren en de aandachtseconomie</text>'+
    '<text x="28" y="80" font-family="sans-serif" font-size="8" fill="#b3bcc9">Lees de tekst (alinea 1 t/m 7) en beantwoord de vragen.</text></svg>';
}
var _VNLAFB = {
  argstruct:`<svg viewBox="0 0 360 190" role="img" aria-label="schema van de argumentatie">
    <rect x="90" y="12" width="180" height="30" rx="6" fill="#eef4ff" stroke="#2563eb" stroke-width="1.8"/>
    <text x="180" y="26" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b4fb0" text-anchor="middle">standpunt schrijver</text>
    <text x="180" y="38" font-family="sans-serif" font-size="7" fill="#4a5568" text-anchor="middle">leeftijdsgrens = verdedigbare eerste stap</text>
    <g stroke="#94a0b8" stroke-width="1.4"><line x1="140" y1="42" x2="86" y2="70"/><line x1="220" y1="42" x2="274" y2="70"/></g>
    <rect x="20" y="70" width="132" height="44" rx="5" fill="#eafaf0" stroke="#2e9e5b" stroke-width="1.4"/><text x="86" y="87" font-family="sans-serif" font-size="8" font-weight="700" fill="#1b7a41" text-anchor="middle">argument voor</text><text x="86" y="100" font-family="sans-serif" font-size="7" fill="#4a5568" text-anchor="middle">kwetsbaar brein,</text><text x="86" y="109" font-family="sans-serif" font-size="7" fill="#4a5568" text-anchor="middle">steun voor ouders</text>
    <rect x="208" y="70" width="132" height="44" rx="5" fill="#fbeaea" stroke="#c0392b" stroke-width="1.4"/><text x="274" y="84" font-family="sans-serif" font-size="8" font-weight="700" fill="#9e2b22" text-anchor="middle">tegenwerping</text><text x="274" y="97" font-family="sans-serif" font-size="7" fill="#4a5568" text-anchor="middle">verbindt ook,</text><text x="274" y="106" font-family="sans-serif" font-size="7" fill="#4a5568" text-anchor="middle">verbod onuitvoerbaar</text>
    <line x1="274" y1="114" x2="274" y2="134" stroke="#c9d2e0" stroke-width="1.2"/>
    <rect x="196" y="134" width="156" height="34" rx="5" fill="#fdf2e2" stroke="#e8a530" stroke-width="1.4"/><text x="274" y="149" font-family="sans-serif" font-size="8" font-weight="700" fill="#b3760f" text-anchor="middle">weerlegging (al. 5)</text><text x="274" y="161" font-family="sans-serif" font-size="7" fill="#4a5568" text-anchor="middle">norm stellen werkt, zie snelheidslimiet</text>
    <text x="120" y="150" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figuur: de opbouw van het betoog</text></svg>`,
  opbouw:`<svg viewBox="0 0 360 172" role="img" aria-label="schema tekstopbouw">
    <g font-family="sans-serif">
      <rect x="30" y="14" width="300" height="26" rx="5" fill="#eef4ff" stroke="#2563eb" stroke-width="1.4"/><text x="44" y="31" font-size="9" font-weight="800" fill="#1b4fb0">inleiding</text><text x="150" y="31" font-size="7.5" fill="#4a5568">alinea 1: het debat wordt ingeleid</text>
      <rect x="30" y="46" width="300" height="60" rx="5" fill="#eafaf0" stroke="#2e9e5b" stroke-width="1.4"/><text x="44" y="64" font-size="9" font-weight="800" fill="#1b7a41">kern</text><text x="150" y="61" font-size="7.5" fill="#4a5568">alinea 2-3: de zorg en het argument voor</text><text x="150" y="74" font-size="7.5" fill="#4a5568">alinea 4: de tegenwerping</text><text x="150" y="87" font-size="7.5" fill="#4a5568">alinea 5-6: weerlegging en de echte oorzaak</text>
      <rect x="30" y="112" width="300" height="30" rx="5" fill="#fdf2e2" stroke="#e8a530" stroke-width="1.4"/><text x="44" y="131" font-size="9" font-weight="800" fill="#b3760f">slot</text><text x="150" y="131" font-size="7.5" fill="#4a5568">alinea 7: conclusie en oproep (regel het ontwerp)</text>
    </g>
    <text x="180" y="160" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figuur: de opbouw van de tekst in drie delen</text></svg>`,
};

SLAGIO_EXAMENS.vwo.nl = {
  origineel: true,
  titel: 'Nederlands',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 90,
  max_punten: 24,
  bron: 'Slagio origineel · examenstijl (eigen tekst)',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'De tekst en de hoofdlijn', context:_VNLTEKST, afb:_nlHdr() },
    { nr:2, titel:'De argumentatie', context:_VNLTEKST, afb:_VNLAFB.argstruct },
    { nr:3, titel:'Tekststructuur en taal', context:_VNLTEKST, afb:_VNLAFB.opbouw },
    { nr:4, titel:'Hoofdgedachte en samenvatten', context:_VNLTEKST, afb:_nlHdr() },
  ],
  vragen: [
    // ── Opgave 1: hoofdlijn ───────────────────────────────────────────
    { nr:1, opgave:1, punten:1, type:'mc', domein:'Schrijfdoel',
      vraag:'Wat is het belangrijkste schrijfdoel van deze tekst?',
      opties:['informeren','overtuigen','activeren','amuseren'],
      correct:1,
      uitleg:'De schrijver verdedigt met argumenten een eigen standpunt (een leeftijdsgrens is een verdedigbare eerste stap, maar het ontwerp verdient de strengste regel); dat is overtuigen/betogen.' },
    { nr:2, opgave:1, punten:1, type:'mc', domein:'Functie alinea',
      vraag:'Wat is de functie van alinea 1 in de tekst?',
      opties:[
        'Ze geeft de mening van de schrijver al volledig weer.',
        'Ze leidt het onderwerp en de vraagstelling van de tekst in.',
        'Ze weerlegt een tegenargument.',
        'Ze vat de hele tekst samen.'],
      correct:1,
      uitleg:'Alinea 1 introduceert het debat en scherpt de vraag aan ("niet of, maar hoe ver"); het is de inleiding met de vraagstelling.' },
    { nr:3, opgave:1, punten:2, type:'open', domein:'Hoofdgedachte',
      vraag:'Geef in een volzin de hoofdgedachte van de tekst weer.',
      antwoord:'Een goede hoofdgedachte, bijvoorbeeld: "Een leeftijdsgrens voor sociale media is een bot maar verdedigbaar eerste middel tegen de schade voor jongeren, terwijl de echte oplossing ligt in het aan banden leggen van het verslavende ontwerp van de platforms zelf." De kern bevat: (1) een leeftijdsgrens is een verdedigbare (maar botte / eerste) stap, en (2) de eigenlijke oplossing is het reguleren van het ontwerp/verdienmodel, niet alleen de leeftijd.',
      antwoord_rubric:'1 punt: leeftijdsgrens = verdedigbare/eerste (maar botte) stap. 1 punt: de echte oplossing is het ontwerp/verdienmodel van de platforms aanpakken, in een volzin.' },
    { nr:4, opgave:1, punten:2, type:'open', domein:'Tekstbegrip',
      vraag:'In alinea 2 staat dat de apps "met opzet zo ontworpen zijn dat je blijft scrollen". Leg met de tekst uit hoe de platforms dat volgens de schrijver voor elkaar krijgen.',
      antwoord:'Volgens de schrijver werkt elke melding en elke like als een kleine beloning die om herhaling vraagt (alinea 2). De apps maken dus gebruik van steeds terugkerende beloningen, waardoor je telkens opnieuw wilt kijken en blijft scrollen. In alinea 6 vult de schrijver aan waaróm ze zo gebouwd zijn: in de aandachtseconomie verdienen de platforms geld aan de tijd die je op het scherm doorbrengt, dus zijn ze geoptimaliseerd om die schermtijd zo lang mogelijk te maken.',
      antwoord_rubric:'1 punt: via kleine beloningen (melding/like) die om herhaling vragen -> blijven scrollen. 1 punt: koppeling aan het verdienmodel/aandachtseconomie (geld verdienen aan schermtijd, dus geoptimaliseerd op lange schermtijd).' },
    // ── Opgave 2: argumentatie ────────────────────────────────────────
    { nr:5, opgave:2, punten:1, type:'mc', domein:'Argumentatie',
      vraag:'Welk soort argument gebruikt de schrijver in alinea 3 met "de kwetsbaarheid van het jonge brein"?',
      opties:[
        'een autoriteitsargument',
        'een argument dat wijst op een oorzaak-gevolgrelatie (een jong brein weerstaat de trucs slechter)',
        'een drogreden',
        'een voorbeeld uit eigen ervaring'],
      correct:1,
      uitleg:'De schrijver beredeneert een gevolg: omdat het jonge brein nog in ontwikkeling is, kan het de verslavende trucs slechter weerstaan; dat pleit voor bescherming. Het is een inhoudelijk oorzaak-gevolg-argument.' },
    { nr:6, opgave:2, punten:1, type:'mc', domein:'Argumentatie',
      vraag:'Wat is de functie van alinea 4 ten opzichte van alinea 3?',
      opties:[
        'Alinea 4 herhaalt alinea 3 met andere woorden.',
        'Alinea 4 geeft een tegenwerping tegen het standpunt van alinea 3.',
        'Alinea 4 geeft een voorbeeld bij alinea 3.',
        'Alinea 4 trekt de conclusie van de tekst.'],
      correct:1,
      uitleg:'Alinea 4 ("Tegenstanders vinden dit echter veel te kort door de bocht") brengt het tegenargument in tegen de leeftijdsgrens van alinea 3.' },
    { nr:7, opgave:2, punten:2, type:'open', domein:'Argumentatie',
      vraag:'In alinea 5 weerlegt de schrijver het tegenargument dat een verbod "onuitvoerbaar" is. Leg uit met welke vergelijking hij dat doet en waarom die vergelijking zijn punt ondersteunt.',
      antwoord:'De schrijver vergelijkt de leeftijdsgrens met een snelheidslimiet: ook een snelheidslimiet wordt overtreden en is niet waterdicht te handhaven, en toch redt hij levens doordat hij een norm stelt. Met die vergelijking laat de schrijver zien dat een regel niet perfect handhaafbaar hoeft te zijn om zinvol te zijn: het stellen van een duidelijke norm heeft op zichzelf al een positief effect. Zo weerlegt hij dat "onuitvoerbaar" hetzelfde is als "zinloos".',
      antwoord_rubric:'1 punt: de vergelijking met de snelheidslimiet benoemd. 1 punt: uitleg dat een niet-waterdichte regel toch zin heeft omdat hij een norm stelt (dus onuitvoerbaar is niet hetzelfde als zinloos).' },
    { nr:8, opgave:2, punten:2, type:'open', domein:'Drogredenen',
      vraag:'Stel dat een tegenstander zou zeggen: "Wie een leeftijdsgrens wil, wil zeker terug naar vroeger, toen kinderen nog buitenspeelden zonder telefoon." Leg uit welke drogreden dit is en waarom de redenering niet deugt.',
      antwoord:'Dit is een vertekening van het standpunt (een stroman-drogreden, een vorm van verkeerde voorstelling van zaken): de tegenstander schrijft de voorstander een veel extremer of ander standpunt toe ("terug naar vroeger, zonder telefoon") dan wat die werkelijk beweert (alleen een leeftijdsgrens onder de zestien). Vervolgens valt hij dat verzonnen standpunt aan in plaats van het echte. De redenering deugt niet omdat er niet wordt ingegaan op het werkelijke argument; er wordt een karikatuur bestreden, en dat bewijst niets over de houdbaarheid van het echte standpunt.',
      antwoord_rubric:'1 punt: stroman / verkeerde voorstelling van zaken (het standpunt wordt overdreven/vertekend weergegeven). 1 punt: uitleg waarom ondeugdelijk (het echte argument wordt niet weerlegd, alleen een karikatuur ervan).' },
    // ── Opgave 3: structuur en taal ───────────────────────────────────
    { nr:9, opgave:3, punten:1, type:'mc', domein:'Tekststructuur',
      vraag:'Welk verband bestaat er tussen alinea 5 en alinea 4?',
      opties:['een oorzaak-gevolgverband','een tegenstellend verband','een opsommend verband','een vergelijkend verband'],
      correct:1,
      uitleg:'Alinea 5 gaat in tegen alinea 4 ("Toch overtuigt dat tegenargument niet helemaal"); dat is een tegenstellend verband.' },
    { nr:10, opgave:3, punten:1, type:'mc', domein:'Verwijzing',
      vraag:'Naar wie of wat verwijst "hij" in "en toch redt hij levens door een norm te stellen" (alinea 5)?',
      opties:['de schrijver','de tiener','de snelheidslimiet','het tegenargument'],
      correct:2,
      uitleg:'"Hij" verwijst naar de snelheidslimiet uit dezelfde zin: die wordt overtreden, en toch redt hij (de limiet) levens door een norm te stellen.' },
    { nr:11, opgave:3, punten:1, type:'mc', domein:'Betekenis',
      vraag:'Wat betekent "een bot instrument" in alinea 7 het best?',
      opties:[
        'een verboden middel',
        'een grof, weinig verfijnd middel dat het probleem niet precies raakt',
        'een volstrekt nutteloos middel',
        'een nieuw en modern middel'],
      correct:1,
      uitleg:'"Bot" staat hier tegenover fijn/precies: de leeftijdsgrens is een grof middel dat de echte oorzaak (het ontwerp) niet precies aanpakt, maar wel een verdedigbare eerste stap is.' },
    { nr:12, opgave:3, punten:1, type:'mc', domein:'Functie alinea',
      vraag:'Wat is de belangrijkste functie van alinea 6 in het betoog?',
      opties:[
        'Ze herhaalt de inleiding.',
        'Ze verlegt de aandacht van de leeftijd naar de eigenlijke oorzaak: het ontwerp/verdienmodel.',
        'Ze geeft de mening van de tegenstanders weer.',
        'Ze somt de voordelen van sociale media op.'],
      correct:1,
      uitleg:'Alinea 6 stelt dat de kern niet bij de leeftijd ligt maar bij het ontwerp (de aandachtseconomie); ze verlegt zo de aandacht naar de eigenlijke oorzaak, wat de conclusie in alinea 7 voorbereidt.' },
    { nr:13, opgave:3, punten:2, type:'open', domein:'Tekststructuur',
      vraag:'Leg uit hoe alinea 7 (het slot) logisch voortbouwt op alinea 6. Gebruik in je antwoord de begrippen "oorzaak" en "conclusie".',
      antwoord:'In alinea 6 stelt de schrijver de eigenlijke oorzaak van de schade vast: niet de leeftijd, maar het ontwerp/verdienmodel van de platforms (de aandachtseconomie). Alinea 7 trekt daaruit de conclusie: omdat de oorzaak in het ontwerp ligt, is een leeftijdsgrens wel een verdedigbare eerste stap maar geen echte oplossing, en moet je wie de schade echt wil aanpakken juist het ontwerp zelf aan banden leggen. Het slot bouwt dus voort op de in alinea 6 benoemde oorzaak en verbindt daar de eindconclusie/oproep aan.',
      antwoord_rubric:'1 punt: alinea 6 benoemt de oorzaak (het ontwerp/verdienmodel, niet de leeftijd). 1 punt: alinea 7 trekt daaruit de conclusie (leeftijdsgrens is niet genoeg; pak het ontwerp aan).' },
    // ── Opgave 4: hoofdgedachte en samenvatten ────────────────────────
    { nr:14, opgave:4, punten:1, type:'mc', domein:'Toon',
      vraag:'Hoe kun je de houding van de schrijver tegenover de leeftijdsgrens het best omschrijven?',
      opties:[
        'volledig afwijzend',
        'genuanceerd: hij ziet de grens als een gebrekkige maar verdedigbare eerste stap',
        'onvoorwaardelijk enthousiast',
        'volstrekt onverschillig'],
      correct:1,
      uitleg:'De schrijver noemt de grens een "bot instrument" maar wel een "verdedigbare eerste stap": een genuanceerde houding, geen onvoorwaardelijk voor of tegen.' },
    { nr:15, opgave:4, punten:3, type:'open', domein:'Samenvatten',
      vraag:'Geef in maximaal 45 woorden de kern van de tekst weer. Verwerk: (a) het voorstel, (b) het belangrijkste argument voor, (c) de tegenwerping, en (d) het uiteindelijke standpunt van de schrijver.',
      antwoord:'Voorbeeldsamenvatting (ongeveer 45 woorden): "Steeds meer landen willen sociale media onder de zestien verbieden. Voorstanders wijzen op het kwetsbare jonge brein en steun voor ouders; tegenstanders vinden een verbod betuttelend en onuitvoerbaar. Volgens de schrijver is een leeftijdsgrens een botte maar verdedigbare eerste stap; de echte oplossing is het verslavende ontwerp van de platforms aanpakken." De samenvatting moet alle vier de elementen bevatten (voorstel, argument voor, tegenwerping, eindstandpunt) en binnen de woordgrens blijven, in lopende zinnen.',
      antwoord_rubric:'1 punt: (a) het voorstel (verbod/leeftijdsgrens onder 16) en (b) het argument voor (kwetsbaar brein / steun ouders). 1 punt: (c) de tegenwerping (betuttelend / onuitvoerbaar / ook nuttig). 1 punt: (d) het eindstandpunt (botte maar verdedigbare eerste stap; echte oplossing = ontwerp aanpakken) en binnen 45 woorden in lopende zinnen.' },
    { nr:16, opgave:4, punten:2, type:'open', domein:'Tekstbegrip',
      vraag:'De schrijver eindigt met "Niet de jongere, maar het ontwerp verdient de strengste regel." Leg in het Nederlands uit waarom deze slotzin de boodschap van de hele tekst goed samenvat.',
      antwoord:'De slotzin vat de boodschap samen doordat hij de nadruk verschuift van waar het debat mee begon (de leeftijd van de gebruiker) naar wat volgens de schrijver de echte oorzaak is (het ontwerp/verdienmodel van de platforms). De hele tekst bouwt daar naartoe: een leeftijdsgrens pakt alleen de jongere aan, maar niet de bron van de schade. Door te zeggen dat "het ontwerp" en niet "de jongere" de strengste regel verdient, benoemt de schrijver in een zin zijn kernstandpunt: reguleer de manier waarop de apps gebouwd zijn.',
      antwoord_rubric:'1 punt: de zin verschuift de nadruk van de gebruiker/leeftijd naar het ontwerp/verdienmodel als echte oorzaak. 1 punt: dat is precies waar de hele tekst naartoe werkt (leeftijdsgrens pakt de bron niet aan; reguleer het ontwerp).' },
  ],
};
