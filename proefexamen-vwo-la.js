// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-la.js  ORIGINEEL Slagio-proefexamen (vwo Latijn).
// Eigen Latijnse tekst (door Slagio geschreven in klassiek proza), vragen
// en figuren. Geen reproductie van een CvTE-pensum of moderne editie.
// VWO-CE-niveau: vertalen, grammatica (naamval/functie, werkwoordsvormen),
// stijl/interpretatie en cultuur (KCV: de mythe en haar thema).
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

var _VLAAFB = {
  // Latijnse tekst met regelnummers als kaart
  tekst:`<svg viewBox="0 0 360 208" role="img" aria-label="latijns tekstfragment"><rect x="14" y="10" width="332" height="190" rx="6" fill="#fbf7ee" stroke="#c9b98f" stroke-width="1.4"/>
    <text x="180" y="30" font-family="Georgia,serif" font-size="12" font-weight="800" fill="#5a4a2a" text-anchor="middle" font-style="italic">Daedalus et Icarus</text>
    <line x1="30" y1="38" x2="330" y2="38" stroke="#e6dcc2" stroke-width="1.4"/>
    <g font-family="Georgia,serif" font-size="9" fill="#33302a">
      <text x="30" y="56">1  Daedalus, vir ingeniosus, in insula Creta</text>
      <text x="30" y="72">   habitabat. Rex Minos eum in labyrintho</text>
      <text x="30" y="88">   tenebat. Daedalus autem fugere cupiebat.</text>
      <text x="30" y="104">4  Itaque pennas paravit et alas fecit. Filio</text>
      <text x="30" y="120">   suo Icaro dixit: "Vola per medium caelum!</text>
      <text x="30" y="136">   Noli ad solem volare!" Sed Icarus, puer</text>
      <text x="30" y="152">7  temerarius, altius volavit. Sol ceram</text>
      <text x="30" y="168">   mollivit et puer in mare cecidit.</text>
    </g>
    <g font-family="Georgia,serif" font-size="7.5" font-style="italic" fill="#8a7a52"><text x="30" y="190">penna, -ae = veer; ala, -ae = vleugel; cera, -ae = was</text></g></svg>`,
  // Grammaticaschema: naamvallen van een woord
  naamval:`<svg viewBox="0 0 360 176" role="img" aria-label="naamvalschema">
    <text x="180" y="20" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#1b2230" text-anchor="middle">functie van de naamvallen (a-declinatie: penna)</text>
    <g font-family="sans-serif" font-size="8.5">
      <rect x="24" y="30" width="312" height="20" fill="#eef4ff"/>
      <text x="34" y="44" font-weight="700" fill="#1b4fb0">naamval</text><text x="150" y="44" font-weight="700" fill="#1b4fb0">vorm (ev.)</text><text x="250" y="44" font-weight="700" fill="#1b4fb0">functie (o.a.)</text>
      <g fill="#1b2230">
        <text x="34" y="62">nominativus</text><text x="150" y="62">penna</text><text x="250" y="62">onderwerp</text>
        <text x="34" y="78">genitivus</text><text x="150" y="78">pennae</text><text x="250" y="78">bezit ("van")</text>
        <text x="34" y="94">dativus</text><text x="150" y="94">pennae</text><text x="250" y="94">meewerkend vw.</text>
        <text x="34" y="110">accusativus</text><text x="150" y="110">pennam</text><text x="250" y="110">lijdend voorwerp</text>
        <text x="34" y="126">ablativus</text><text x="150" y="126">penna</text><text x="250" y="126">middel, plaats, tijd</text>
        <text x="34" y="142">acc. pluralis</text><text x="150" y="142">pennas</text><text x="250" y="142">lijdend voorwerp (mv.)</text>
      </g>
    </g>
    <line x1="24" y1="50" x2="336" y2="50" stroke="#c9d2e0" stroke-width="1"/>
    <line x1="140" y1="30" x2="140" y2="150" stroke="#eef1f5" stroke-width="1"/><line x1="240" y1="30" x2="240" y2="150" stroke="#eef1f5" stroke-width="1"/>
    <text x="180" y="168" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figuur: naamvallen en hun functies</text></svg>`,
  // De gulden middenweg: te laag (zee), te hoog (zon), midden (veilig)
  middenweg:`<svg viewBox="0 0 360 192" role="img" aria-label="de gulden middenweg in de mythe">
    <defs><radialGradient id="la_sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#e8a020"/></radialGradient></defs>
    <rect x="0" y="152" width="360" height="40" fill="#bcd8ef"/>
    <path d="M0 152 q 30 -7 60 0 t 60 0 t 60 0 t 60 0 t 60 0" fill="none" stroke="#5b9bd5" stroke-width="1.6"/>
    <text x="20" y="176" font-family="sans-serif" font-size="8" fill="#2b5a8a" text-anchor="start">te laag: mare (zee, vocht)</text>
    <circle cx="306" cy="36" r="24" fill="url(#la_sun)"/><text x="306" y="39" font-family="sans-serif" font-size="8" font-weight="700" fill="#7a4d00" text-anchor="middle">sol</text>
    <text x="306" y="70" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">te hoog: hitte</text>
    <line x1="26" y1="104" x2="238" y2="104" stroke="#2e9e5b" stroke-width="1.8" stroke-dasharray="6 4"/>
    <text x="26" y="96" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b7a41" text-anchor="start">medium caelum = veilige middenweg</text>
    <g transform="translate(120,104)"><circle cx="0" cy="0" r="3.4" fill="#1b2230"/><path d="M-3 -1 q -10 -5 -16 1 M3 -1 q 10 -5 16 1" fill="none" stroke="#1b2230" stroke-width="1.4"/></g>
    <g stroke="#c0392b" stroke-width="1.8" fill="none"><path d="M150 104 C 200 96, 240 80, 268 58"/></g>
    <path d="M268 58 L262 66 L272 68 Z" fill="#c0392b"/>
    <text x="200" y="128" font-family="sans-serif" font-size="8" font-weight="700" fill="#c0392b" text-anchor="middle">te hoog vliegen (Icarus)</text>
    <text x="180" y="188" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">figuur: te laag, te hoog en de gulden middenweg</text></svg>`,
};

SLAGIO_EXAMENS.vwo.la = {
  origineel: true,
  titel: 'Latijn',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 180,
  max_punten: 14,
  bron: 'Slagio origineel · examenstijl (eigen Latijnse tekst)',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'De tekst: Daedalus et Icarus',
      context:'Lees het Latijnse tekstfragment (regel 1 tot en met 8). Het is een door Slagio geschreven, vereenvoudigde weergave van de bekende mythe. Woordhulp staat onderaan de tekst.',
      afb:_VLAAFB.tekst, afb_cap:'het Latijnse tekstfragment met regelnummers' },
    { nr:2, titel:'Grammatica: naamvallen en vormen',
      context:'Het schema toont de naamvallen van de a-declinatie (penna) en hun functies. Gebruik het bij de grammaticavragen.',
      afb:_VLAAFB.naamval, afb_cap:'de naamvallen van penna en hun functies' },
    { nr:3, titel:'Interpretatie en stijl',
      context:'In de tekst waarschuwt Daedalus zijn zoon om "per medium caelum" (door het midden van de hemel) te vliegen: niet te laag (over de zee) en niet te hoog (bij de zon).',
      afb:_VLAAFB.middenweg, afb_cap:'de gulden middenweg tussen zee en zon' },
    { nr:4, titel:'Cultuur (KCV)',
      context:'De mythe van Daedalus en Icarus is door de eeuwen heen een symbool geworden. De vraag hieronder gaat over de betekenis ervan.',
      afb:_VLAAFB.middenweg, afb_cap:'het thema van de gulden middenweg' },
  ],
  vragen: [
    // Opgave 1 (vertalen)
    { nr:1, opgave:1, punten:4, type:'open', domein:'Vertalen',
      vraag:'Vertaal regel 4 tot en met 6 in het Nederlands: "Itaque pennas paravit et alas fecit. Filio suo Icaro dixit: Vola per medium caelum! Noli ad solem volare!"',
      antwoord:'Een correcte vertaling: "Daarom (Itaque) maakte hij veren gereed (pennas paravit) en maakte hij vleugels (et alas fecit). Tegen zijn zoon Icarus zei hij (Filio suo Icaro dixit): Vlieg door het midden van de hemel (Vola per medium caelum)! Vlieg niet naar de zon (Noli ad solem volare)!" Let op: "paravit" en "fecit" zijn perfectum (verleden tijd), "filio suo Icaro" is datief (aan/tegen zijn zoon Icarus), "vola" is een imperatief (gebiedende wijs), en "noli + infinitief" is een verbod (doe niet / vlieg niet).',
      antwoord_rubric:'1 punt: "Itaque pennas paravit et alas fecit" correct (daarom maakte hij veren gereed en maakte vleugels). 1 punt: "Filio suo Icaro dixit" correct (datief: tegen zijn zoon Icarus zei hij). 1 punt: "Vola per medium caelum" correct (imperatief + per + acc). 1 punt: "Noli ad solem volare" correct als verbod (vlieg niet naar de zon).' },
    // Opgave 2 (grammatica)
    { nr:2, opgave:2, punten:2, type:'open', domein:'Grammatica',
      vraag:'Benoem van "pennas" (regel 4) de naamval, het getal en de functie in de zin.',
      antwoord:'"Pennas" is accusativus pluralis (vierde naamval, meervoud) van penna. De functie in de zin "pennas paravit" is lijdend voorwerp (direct object): het geeft aan wat Daedalus gereedmaakte, namelijk de veren. Penna is een a-stam (eerste declinatie), waarvan de accusativus meervoud op -as eindigt.',
      antwoord_rubric:'1 punt: accusativus pluralis (van penna). 1 punt: functie = lijdend voorwerp (bij paravit).' },
    { nr:3, opgave:2, punten:2, type:'open', domein:'Grammatica',
      vraag:'Benoem de werkwoordsvorm "cupiebat" (regel 3) volledig: persoon, getal, tijd, wijs en (voor zover van toepassing) de betekenis van de tijd.',
      antwoord:'"Cupiebat" is de 3e persoon enkelvoud imperfectum (onvoltooid verleden tijd), indicativus (aantonende wijs), actief, van cupere (verlangen, wensen). Het betekent "hij verlangde / wilde (graag)". Het imperfectum drukt een duatieve of herhaalde handeling in het verleden uit: Daedalus wilde voortdurend/al die tijd ontsnappen. Vertaling: "Daedalus wilde echter ontsnappen".',
      antwoord_rubric:'1 punt: 3e persoon enkelvoud, indicativus, actief. 1 punt: imperfectum (met betekenis: duurzame/herhaalde handeling in het verleden, "hij wilde/verlangde").' },
    // Opgave 3 (interpretatie/stijl)
    { nr:4, opgave:3, punten:2, type:'open', domein:'Stijl',
      vraag:'De tekst zet Daedalus en Icarus tegenover elkaar. Leg uit welke tegenstelling (antithese) de schrijver opbouwt, en citeer het Latijnse woord dat Icarus\' karakter typeert.',
      antwoord:'De schrijver bouwt een antithese (tegenstelling) op tussen de verstandige, voorzichtige vader Daedalus en de overmoedige, roekeloze zoon Icarus. Daedalus waarschuwt zijn zoon nadrukkelijk om de veilige middenweg te houden ("Vola per medium caelum! Noli ad solem volare!"), terwijl Icarus die waarschuwing juist in de wind slaat en "altius" (hoger) vliegt. Het Latijnse woord dat Icarus\' karakter typeert is "temerarius" (roekeloos, overmoedig): "Icarus, puer temerarius". De tegenstelling voorzichtig tegenover roekeloos loopt zo door de hele passage.',
      antwoord_rubric:'1 punt: antithese voorzichtige/verstandige vader tegenover overmoedige/roekeloze zoon (met de waarschuwing tegenover altius volavit). 1 punt: het typerende woord "temerarius" geciteerd.' },
    // Opgave 4 (interpretatie)
    { nr:5, opgave:3, punten:2, type:'open', domein:'Tekstbegrip',
      vraag:'Leg met de tekst uit waarom Icarus in zee valt. Verbind oorzaak en gevolg met de juiste zinnen uit de tekst.',
      antwoord:'Icarus valt in zee doordat hij de waarschuwing van zijn vader negeert en te hoog vliegt. In de tekst: "Sed Icarus, puer temerarius, altius volavit" (maar Icarus, de roekeloze jongen, vloog hoger). Doordat hij te dicht bij de zon kwam, smolt de hitte van de zon de was van zijn vleugels: "Sol ceram mollivit" (de zon maakte de was zacht/deed de was smelten). Zonder was vielen de veren uit de vleugels en stortte de jongen in zee: "et puer in mare cecidit" (en de jongen viel in de zee). De oorzaak (te hoog vliegen, was smelt) leidt dus rechtstreeks tot het gevolg (de val in zee).',
      antwoord_rubric:'1 punt: oorzaak = te hoog vliegen ("altius volavit"), waardoor de zon de was doet smelten ("Sol ceram mollivit"). 1 punt: gevolg = de val in zee ("puer in mare cecidit"), met de juiste zinnen erbij.' },
    // Opgave 5 (KCV)
    { nr:6, opgave:4, punten:2, type:'open', domein:'Cultuur',
      vraag:'De mythe wordt vaak gelezen als een waarschuwing. Leg uit welk moreel thema (zoals overmoed of de gulden middenweg) de mythe illustreert, en betrek de figuur bij je antwoord.',
      antwoord:'De mythe illustreert het thema van de overmoed (hubris/superbia) en het klassieke ideaal van de "gulden middenweg" (het juiste midden, matigheid). Zoals de figuur laat zien, is er een gevaar aan beide kanten: te laag vliegen (over de zee, waar de veren vochtig worden) en te hoog vliegen (bij de zon, waar de hitte de was smelt). Alleen de middenweg ("per medium caelum") is veilig. Icarus overschrijdt uit overmoed de grens die zijn vader hem stelt en wordt daarvoor gestraft. De les is dus dat de mens maat moet houden en zijn grenzen niet uit hoogmoed moet overschrijden: het klassieke ideaal van matigheid en het vermijden van uitersten.',
      antwoord_rubric:'1 punt: thema benoemd (overmoed/hubris en/of de gulden middenweg/matigheid). 1 punt: uitwerking met de figuur (gevaar aan beide uitersten, alleen de middenweg is veilig; Icarus straft zijn eigen overmoed af).' },
  ],
};
