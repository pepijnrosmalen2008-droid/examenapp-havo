// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-mw.js  ORIGINEEL Slagio-proefexamen (vwo maatschappijwet.).
// Eigen contexten, vragen en figuren. Geen reproductie van een CvTE-examen.
// VWO-CE-niveau: analyseren met de hoofdconcepten vorming, verhouding,
// binding en verandering (met kernconcepten als socialisatie, sociale
// cohesie, macht, sociale ongelijkheid, individualisering).
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

var _VMWAFB = {
  // Bron 1: opkomst verkiezingen naar opleidingsniveau (staafdiagram)
  participatie:(function(){
    var data=[['praktisch\ngeschoold',62],['middelbaar',74],['theoretisch\ngeschoold',88]];
    var sx=function(i){return 92+i*90;}, sy=function(p){return 150-p/100*118;};
    var yl=[0,25,50,75,100].map(p=>'<line x1="60" y1="'+sy(p).toFixed(1)+'" x2="330" y2="'+sy(p).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="55" y="'+(sy(p)+3).toFixed(1)+'" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="end">'+p+'</text>').join('');
    var bars=data.map((d,i)=>{var h=150-sy(d[1]); var col=['#c0392b','#e8a530','#2e9e5b'][i]; return '<rect x="'+(sx(i)-26).toFixed(1)+'" y="'+sy(d[1]).toFixed(1)+'" width="52" height="'+h.toFixed(1)+'" fill="'+col+'" opacity="0.88"/><text x="'+sx(i).toFixed(1)+'" y="'+(sy(d[1])-5).toFixed(1)+'" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b2230" text-anchor="middle">'+d[1]+'%</text>';}).join('');
    var lbl=data.map((d,i)=>d[0].split('\n').map((t,j)=>'<text x="'+sx(i).toFixed(1)+'" y="'+(160+j*9).toFixed(1)+'" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">'+t+'</text>').join('')).join('');
    return '<svg viewBox="0 0 360 188" role="img" aria-label="opkomst bij verkiezingen naar opleidingsniveau">'+yl+'<line x1="60" y1="20" x2="60" y2="150" stroke="#1b2230" stroke-width="1.6"/><line x1="60" y1="150" x2="332" y2="150" stroke="#1b2230" stroke-width="1.6"/>'+bars+lbl+'<text x="0" y="0" transform="translate(16,86) rotate(-90)" font-family="sans-serif" font-size="7.5" font-weight="800" fill="#1b2230" text-anchor="middle">opkomst (%)</text><text x="195" y="184" font-family="sans-serif" font-size="8" font-weight="800" fill="#1b2230" text-anchor="middle">bron 1: opkomst naar opleidingsniveau</text></svg>';
  })(),
  // Bron 2: schema socialiserende instituties rond het individu
  socialisatie:`<svg viewBox="0 0 360 186" role="img" aria-label="schema van socialiserende instituties">
    <circle cx="180" cy="96" r="34" fill="#eef4ff" stroke="#2563eb" stroke-width="2"/>
    <text x="180" y="93" font-family="sans-serif" font-size="9" font-weight="800" fill="#1b4fb0" text-anchor="middle">individu</text>
    <text x="180" y="105" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">(identiteit)</text>
    <g font-family="sans-serif" font-size="8.5" font-weight="700" fill="#1b2230" text-anchor="middle">
      <rect x="120" y="14" width="60" height="24" rx="5" fill="#eafaf0" stroke="#2e9e5b" stroke-width="1.4"/><text x="150" y="30">gezin</text>
      <rect x="248" y="52" width="70" height="24" rx="5" fill="#fdf2e2" stroke="#e8a530" stroke-width="1.4"/><text x="283" y="68">school</text>
      <rect x="252" y="118" width="80" height="24" rx="5" fill="#fbeaea" stroke="#c0392b" stroke-width="1.4"/><text x="292" y="134">media</text>
      <rect x="118" y="150" width="90" height="24" rx="5" fill="#f0eafd" stroke="#7c4dcc" stroke-width="1.4"/><text x="163" y="166">leeftijdsgenoten</text>
      <rect x="30" y="82" width="72" height="24" rx="5" fill="#e8f6fb" stroke="#2b9fc4" stroke-width="1.4"/><text x="66" y="98">werk / vrije tijd</text>
    </g>
    <g stroke="#94a0b8" stroke-width="1.4"><line x1="152" y1="40" x2="168" y2="64"/><line x1="248" y1="66" x2="212" y2="82"/><line x1="252" y1="128" x2="212" y2="110"/><line x1="163" y1="150" x2="176" y2="130"/><line x1="102" y1="96" x2="146" y2="96"/></g>
    <text x="180" y="182" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">bron 2: instituties die het individu socialiseren</text></svg>`,
  // Bron 3: individualisering - daling lidmaatschap kerk/vereniging over tijd
  individualisering:(function(){
    var sx=function(j){return 54+(j-1970)/50*280;}, sy=function(p){return 148-p/70*120;};
    var jr=[1970,1985,2000,2015,2020];
    var kerk=[62,45,30,18,14];
    var ver=[58,52,44,38,34];
    var xl=jr.map(j=>'<text x="'+sx(j).toFixed(1)+'" y="162" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">'+j+'</text>').join('');
    var yl=[0,20,40,60].map(p=>'<line x1="54" y1="'+sy(p).toFixed(1)+'" x2="336" y2="'+sy(p).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="49" y="'+(sy(p)+3).toFixed(1)+'" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="end">'+p+'</text>').join('');
    var l1='<polyline points="'+kerk.map((p,i)=>sx(jr[i]).toFixed(1)+','+sy(p).toFixed(1)).join(' ')+'" fill="none" stroke="#c0392b" stroke-width="2.6"/><text x="'+sx(1986)+'" y="'+(sy(52))+'" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#c0392b">kerklidmaatschap</text>';
    var l2='<polyline points="'+ver.map((p,i)=>sx(jr[i]).toFixed(1)+','+sy(p).toFixed(1)).join(' ')+'" fill="none" stroke="#2563eb" stroke-width="2.6"/><text x="'+sx(2001)+'" y="'+(sy(50))+'" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#2563eb">lid vereniging</text>';
    return '<svg viewBox="0 0 360 184" role="img" aria-label="daling van lidmaatschap over de tijd">'+yl+'<line x1="54" y1="18" x2="54" y2="148" stroke="#1b2230" stroke-width="1.6"/><path d="M54 18 L50 28 L58 28 Z" fill="#1b2230"/><line x1="54" y1="148" x2="338" y2="148" stroke="#1b2230" stroke-width="1.6"/><path d="M338 148 L330 144 L330 152 Z" fill="#1b2230"/>'+l1+l2+xl+'<text x="0" y="0" transform="translate(15,84) rotate(-90)" font-family="sans-serif" font-size="7" font-weight="800" fill="#1b2230" text-anchor="middle">% van bevolking</text><text x="196" y="180" font-family="sans-serif" font-size="8" font-weight="800" fill="#1b2230" text-anchor="middle">bron 3: lidmaatschap kerk en vereniging</text></svg>';
  })(),
  // Bron 4: sociale gelaagdheid / machtsbronnen piramide
  gelaagdheid:`<svg viewBox="0 0 360 180" role="img" aria-label="schema sociale gelaagdheid met machtsbronnen">
    <polygon points="180,20 250,150 110,150" fill="none" stroke="#1b2230" stroke-width="1.6"/>
    <line x1="149" y1="78" x2="211" y2="78" stroke="#1b2230" stroke-width="1.2"/>
    <line x1="130" y1="114" x2="230" y2="114" stroke="#1b2230" stroke-width="1.2"/>
    <polygon points="180,20 199,55 161,55" fill="#c0392b" opacity="0.8"/>
    <polygon points="161,55 199,55 211,78 149,78" fill="#e8a530" opacity="0.8"/>
    <polygon points="149,78 211,78 230,114 130,114" fill="#5b9bd5" opacity="0.8"/>
    <polygon points="130,114 230,114 250,150 110,150" fill="#2e9e5b" opacity="0.7"/>
    <g font-family="sans-serif" font-size="8" fill="#fff" font-weight="700" text-anchor="middle"><text x="180" y="46">elite</text><text x="180" y="70">hoge klasse</text><text x="180" y="100">middenklasse</text><text x="180" y="136">lagere klasse</text></g>
    <g font-family="sans-serif" font-size="8" fill="#1b2230" text-anchor="start"><text x="262" y="40">weinig mensen,</text><text x="262" y="52">veel macht</text><text x="10" y="140">veel mensen,</text><text x="10" y="152">weinig macht</text></g>
    <text x="180" y="174" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="middle">bron 4: sociale gelaagdheid en de verdeling van machtsbronnen</text></svg>`,
};

SLAGIO_EXAMENS.vwo.mw = {
  origineel: true,
  titel: 'Maatschappijwetenschappen',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 150,
  max_punten: 16,
  bron: 'Slagio origineel · examenstijl',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Ongelijke politieke participatie',
      context:'Bron 1 toont de opkomst bij verkiezingen naar opleidingsniveau. Praktisch geschoolden stemmen aanzienlijk minder vaak dan theoretisch geschoolden.',
      afb:_VMWAFB.participatie, afb_cap:'bron 1: opkomst bij verkiezingen naar opleidingsniveau' },
    { nr:2, titel:'Hoe je wordt wie je bent',
      context:'Bron 2 is een schema van de instituties die een individu socialiseren.',
      afb:_VMWAFB.socialisatie, afb_cap:'bron 2: socialiserende instituties rond het individu' },
    { nr:3, titel:'Losser verbonden',
      context:'Bron 3 toont het aandeel van de Nederlandse bevolking dat lid is van een kerk of van een vereniging, tussen 1970 en 2020.',
      afb:_VMWAFB.individualisering, afb_cap:'bron 3: lidmaatschap van kerk en vereniging, 1970-2020' },
    { nr:4, titel:'Boven en onder',
      context:'Bron 4 is een schema van de sociale gelaagdheid en de verdeling van machtsbronnen in een samenleving.',
      afb:_VMWAFB.gelaagdheid, afb_cap:'bron 4: sociale gelaagdheid en machtsbronnen' },
  ],
  vragen: [
    // Opgave 1 (Verhouding / sociale ongelijkheid)
    { nr:1, opgave:1, punten:3, type:'open', domein:'Verhouding',
      vraag:'Analyseer bron 1 met het kernconcept sociale ongelijkheid. Leg uit hoe het verschil in opkomst een vorm van politieke ongelijkheid is en hoe dit de machtsverhoudingen in de samenleving kan beinvloeden.',
      antwoord:'Sociale ongelijkheid is de ongelijke verdeling van schaarse en gewaardeerde zaken (zoals macht, kennis en invloed) op basis van iemands sociale positie. Bron 1 laat zien dat de opkomst sterk samenhangt met opleidingsniveau: praktisch geschoolden stemmen veel minder (62%) dan theoretisch geschoolden (88%). Dit is politieke ongelijkheid: hoger opgeleiden laten hun stem, en dus hun belangen, vaker gelden. Omdat politici zich richten op de mensen die stemmen, worden de belangen en voorkeuren van hoger opgeleiden sterker in het beleid vertegenwoordigd. Zo versterkt de ongelijke participatie de bestaande machtsverhoudingen: de groep die al meer hulpbronnen (opleiding, inkomen) heeft, krijgt ook meer politieke invloed, terwijl lager opgeleiden politiek ondervertegenwoordigd raken.',
      antwoord_rubric:'1 punt: definitie sociale/politieke ongelijkheid toegepast op de bron (opkomst hangt samen met positie/opleiding, met cijfers). 1 punt: hoger opgeleiden laten hun belangen sterker gelden. 1 punt: dit versterkt bestaande machtsverhoudingen (beleid volgt de stemmers -> ondervertegenwoordiging lager opgeleiden).' },
    // Opgave 2 (Vorming / socialisatie)
    { nr:2, opgave:2, punten:3, type:'open', domein:'Vorming',
      vraag:'Leg met bron 2 en het kernconcept socialisatie uit hoe iemand normen en waarden aanleert. Noem twee socialiserende instituties uit de bron en beschrijf per institutie een manier waarop die socialiseert.',
      antwoord:'Socialisatie is het proces waarbij iemand de waarden, normen en gedragspatronen van zijn cultuur aanleert en zo een sociaal wezen wordt. Dit gebeurt via socialiserende instituties (socialisatoren). Twee voorbeelden uit de bron: (1) het gezin: ouders brengen hun kind vanaf de geboorte basisnormen en -waarden bij (beleefdheid, wat goed en fout is) door voorbeeldgedrag, belonen en straffen. (2) De school: leerlingen leren er niet alleen kennis, maar ook waarden als samenwerken, op tijd komen en respect voor gezag, via regels en het verborgen curriculum. (Ook goed: media brengen rolmodellen en opvattingen over; leeftijdsgenoten oefenen groepsdruk uit.) Door deze instituties internaliseert het individu de cultuur en vormt het zijn identiteit.',
      antwoord_rubric:'1 punt: definitie socialisatie (aanleren waarden/normen/gedrag van de cultuur). 1 punt: eerste institutie met concrete socialiserende werking. 1 punt: tweede institutie met concrete socialiserende werking.' },
    // Opgave 3 (Verandering / individualisering + Binding / sociale cohesie)
    { nr:3, opgave:3, punten:3, type:'open', domein:'Verandering',
      vraag:'Beschrijf de ontwikkeling in bron 3 en leg uit dat deze past bij het kernconcept individualisering. Betrek beide lijnen in je antwoord.',
      antwoord:'Bron 3 laat zien dat zowel het kerklidmaatschap als het verenigingslidmaatschap tussen 1970 en 2020 daalt. Het kerklidmaatschap daalt het sterkst: van 62% naar 14%. Het verenigingslidmaatschap daalt geleidelijker: van 58% naar 34%. Deze ontwikkeling past bij individualisering: het proces waarbij mensen steeds minder afhankelijk zijn van vaste groepen en tradities en hun leven steeds meer als individu naar eigen keuze inrichten. Mensen ontlenen hun identiteit en dagbesteding minder aan traditionele collectieve verbanden zoals kerk en vereniging, en maken meer eigen, wisselende keuzes. De sterke daling van juist het kerklidmaatschap (ontkerkelijking) illustreert het loslaten van vaste, opgelegde verbanden, terwijl de mildere daling bij verenigingen laat zien dat vrijwillige binding ook afneemt maar minder hard.',
      antwoord_rubric:'1 punt: beschrijving beide dalingen met cijfers (kerk 62->14, vereniging 58->34). 1 punt: definitie individualisering (minder afhankelijk van vaste groepen, meer eigen keuze). 1 punt: koppeling: mensen ontlenen identiteit/binding minder aan traditionele collectieve verbanden.' },
    { nr:4, opgave:3, punten:2, type:'open', domein:'Binding',
      vraag:'Leg uit welk gevolg de ontwikkeling in bron 3 kan hebben voor de sociale cohesie in de samenleving, en noem een tegenargument dat nuanceert dat de cohesie niet per se afneemt.',
      antwoord:'Sociale cohesie is de mate van onderlinge verbondenheid en betrokkenheid tussen mensen in een samenleving. Doordat mensen minder lid zijn van kerken en verenigingen, verdwijnen ontmoetingsplekken waar mensen van verschillende achtergronden elkaar tegenkomen en samen dingen doen; dat kan de sociale cohesie verzwakken (minder gedeelde waarden, minder onderling contact). Een nuancerend tegenargument is dat er nieuwe vormen van binding voor in de plaats komen: mensen verbinden zich tegenwoordig via online netwerken, informele groepen, sportscholen of tijdelijke projecten. De binding wordt dus niet per se minder, maar krijgt een andere, lossere en meer individuele vorm.',
      antwoord_rubric:'1 punt: gevolg voor sociale cohesie (minder gedeelde ontmoetingsplekken/verbanden -> mogelijk zwakkere cohesie), met definitie. 1 punt: geldig nuancerend tegenargument (nieuwe/lossere vormen van binding, bv. online of informeel).' },
    // Opgave 4 (Verhouding / macht)
    { nr:5, opgave:4, punten:3, type:'open', domein:'Verhouding',
      vraag:'Analyseer bron 4 met het kernconcept macht. Leg uit wat het schema laat zien over de verdeling van machtsbronnen, en noem twee verschillende machtsbronnen die de positie in de piramide bepalen.',
      antwoord:'Macht is het vermogen om het gedrag of de keuzes van anderen te beinvloeden, ook tegen hun wil in, dankzij de beschikking over machtsbronnen. Bron 4 laat een piramide zien: bovenin bevindt zich een kleine elite met veel macht, onderin een grote lagere klasse met weinig macht. Het schema toont dus dat machtsbronnen ongelijk verdeeld zijn: een klein deel van de bevolking beschikt over veel hulpbronnen, de grote meerderheid over weinig. Twee machtsbronnen die iemands positie bepalen zijn bijvoorbeeld: (1) economische macht (bezit, geld, kapitaal), waarmee je invloed kunt kopen of afdwingen, en (2) kennis en informatie (opleiding, deskundigheid), waarmee je toegang krijgt tot invloedrijke posities. (Ook goed: sociale netwerken/relaties, aantal mensen dat je organiseert, geweld/dwangmiddelen, aanzien.) Wie meer van deze bronnen bezit, staat hoger in de piramide en heeft meer macht.',
      antwoord_rubric:'1 punt: definitie macht (gedrag van anderen kunnen beinvloeden via machtsbronnen). 1 punt: uitleg piramide (kleine elite veel macht boven, grote groep weinig macht onder -> ongelijke verdeling machtsbronnen). 1 punt: twee verschillende, correct benoemde machtsbronnen.' },
    { nr:6, opgave:4, punten:2, type:'open', domein:'Verhouding',
      vraag:'Leg uit hoe de ongelijke politieke participatie uit bron 1 samenhangt met de sociale gelaagdheid uit bron 4. Verbind de twee bronnen in je analyse.',
      antwoord:'De twee bronnen versterken elkaar. Bron 4 laat zien dat machtsbronnen (zoals opleiding, kennis en inkomen) ongelijk over de klassen verdeeld zijn. Bron 1 laat zien dat juist de mensen met meer van die bronnen (theoretisch geschoolden, doorgaans hogere klassen) vaker gaan stemmen. Zo zet de hogere positie in de sociale gelaagdheid zich om in meer politieke invloed: de bovenlaag gebruikt haar hulpbronnen ook om politiek actiever te zijn, terwijl de lagere klasse minder participeert. Hierdoor blijft de bestaande gelaagdheid in stand of wordt zij versterkt: wie boven staat, krijgt via participatie nog meer invloed op het beleid, wat de sociale ongelijkheid reproduceert.',
      antwoord_rubric:'1 punt: koppeling dat hulpbronnen uit bron 4 (opleiding/klasse) samenhangen met de participatie in bron 1. 1 punt: conclusie dat hogere gelaagdheid zich omzet in meer politieke invloed -> gelaagdheid blijft in stand/versterkt (reproductie ongelijkheid).' },
  ],
};
