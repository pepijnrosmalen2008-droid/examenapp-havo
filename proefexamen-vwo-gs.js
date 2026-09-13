// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-gs.js  ORIGINEEL Slagio-proefexamen (vwo geschiedenis).
// Eigen contexten, vragen en figuren. Geen reproductie van een CvTE-examen.
// VWO-CE-niveau: historisch redeneren (oorzaak/gevolg, continuiteit/
// verandering, bronbetrouwbaarheid, contextualiseren) over de tijdvakken.
// Bronnen zijn eigen, gestileerde constructies (geen echte historische bron).
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

var _VGSAFB = {
  // Bron 1: gestileerd Verlichtingspamflet (tekstkaart)
  pamflet:`<svg viewBox="0 0 360 180" role="img" aria-label="gestileerd verlichtingspamflet"><rect x="20" y="10" width="320" height="160" rx="4" fill="#f6f0e2" stroke="#b9a878" stroke-width="1.6"/><rect x="20" y="10" width="320" height="26" fill="#e8ddc2"/><text x="180" y="28" font-family="Georgia,serif" font-size="12" font-weight="700" fill="#5a4a2a" text-anchor="middle" font-style="italic">Aan de vrije burgers dezer natie (1775)</text>
    <text x="34" y="54" font-family="Georgia,serif" font-size="9.5" fill="#3a3020">"Geen mens wordt geboren als onderdaan van een</text>
    <text x="34" y="70" font-family="Georgia,serif" font-size="9.5" fill="#3a3020">vorst. Alle macht komt voort uit het volk, en een</text>
    <text x="34" y="86" font-family="Georgia,serif" font-size="9.5" fill="#3a3020">regering die de natuurlijke rechten van de mens</text>
    <text x="34" y="102" font-family="Georgia,serif" font-size="9.5" fill="#3a3020">op vrijheid en eigendom schendt, verliest haar</text>
    <text x="34" y="118" font-family="Georgia,serif" font-size="9.5" fill="#3a3020">recht om te heersen. Het volk mag haar dan</text>
    <text x="34" y="134" font-family="Georgia,serif" font-size="9.5" fill="#3a3020">afzetten en een nieuw bestuur instellen."</text>
    <text x="326" y="156" font-family="Georgia,serif" font-size="8.5" font-style="italic" fill="#6a5a3a" text-anchor="end">een anonieme pamfletschrijver</text></svg>`,
  // Bron 2: verstedelijking + kindersterfte tijdens industrialisatie (dubbele lijn)
  industrie:(function(){
    var sx=function(j){return 54+(j-1800)/100*280;}, syU=function(p){return 150-p/80*122;};
    var jr=[1800,1825,1850,1875,1900];
    var stad=[20,28,42,58,70];
    var xl=jr.map(j=>'<text x="'+sx(j).toFixed(1)+'" y="164" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+j+'</text>').join('');
    var yl=[0,20,40,60,80].map(p=>'<line x1="54" y1="'+syU(p).toFixed(1)+'" x2="336" y2="'+syU(p).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="49" y="'+(syU(p)+3).toFixed(1)+'" font-family="sans-serif" font-size="7.5" fill="#4a5568" text-anchor="end">'+p+'</text>').join('');
    var line='<polyline points="'+stad.map((p,i)=>sx(jr[i]).toFixed(1)+','+syU(p).toFixed(1)).join(' ')+'" fill="none" stroke="#2563eb" stroke-width="2.8"/>';
    var dots=stad.map((p,i)=>'<circle cx="'+sx(jr[i]).toFixed(1)+'" cy="'+syU(p).toFixed(1)+'" r="2.6" fill="#2563eb"/>').join('');
    return '<svg viewBox="0 0 360 186" role="img" aria-label="verstedelijking tijdens de industrialisatie">'+yl+'<line x1="54" y1="20" x2="54" y2="150" stroke="#1b2230" stroke-width="1.6"/><path d="M54 20 L50 30 L58 30 Z" fill="#1b2230"/><line x1="54" y1="150" x2="338" y2="150" stroke="#1b2230" stroke-width="1.6"/><path d="M338 150 L330 146 L330 154 Z" fill="#1b2230"/>'+line+dots+xl+'<text x="0" y="0" transform="translate(15,86) rotate(-90)" font-family="sans-serif" font-size="7.5" font-weight="800" fill="#1b2230" text-anchor="middle">% in steden</text><text x="195" y="182" font-family="sans-serif" font-size="8" font-weight="800" fill="#1b2230" text-anchor="middle">bron 2: aandeel stadsbewoners in een industrieland</text></svg>';
  })(),
  // Bron 3: werkloosheid Duitsland + NSDAP-zetels 1928-1933 (dubbele as staaf+lijn)
  weimar:(function(){
    var jr=[1928,1930,1932,1933];
    var werk=[1.4,3.0,5.6,6.0]; // mln
    var zetels=[12,107,230,288];
    var sx=function(i){return 70+i*76;};
    var syW=function(w){return 150-w/6*118;}, syZ=function(z){return 150-z/300*118;};
    var ylW=[0,2,4,6].map(w=>'<line x1="56" y1="'+syW(w).toFixed(1)+'" x2="330" y2="'+syW(w).toFixed(1)+'" stroke="#eef1f5" stroke-width="1"/><text x="51" y="'+(syW(w)+3).toFixed(1)+'" font-family="sans-serif" font-size="7.5" fill="#c0392b" text-anchor="end">'+w+'</text>').join('');
    var ylZ=[0,100,200,300].map(z=>'<text x="335" y="'+(syZ(z)+3).toFixed(1)+'" font-family="sans-serif" font-size="7.5" fill="#1b2230" text-anchor="start">'+z+'</text>').join('');
    var bars=werk.map((w,i)=>{var h=150-syW(w); return '<rect x="'+(sx(i)-16).toFixed(1)+'" y="'+syW(w).toFixed(1)+'" width="24" height="'+h.toFixed(1)+'" fill="#c0392b" opacity="0.55"/>';}).join('');
    var line='<polyline points="'+zetels.map((z,i)=>sx(i).toFixed(1)+','+syZ(z).toFixed(1)).join(' ')+'" fill="none" stroke="#1b2230" stroke-width="2.8"/>'+zetels.map((z,i)=>'<circle cx="'+sx(i).toFixed(1)+'" cy="'+syZ(z).toFixed(1)+'" r="3" fill="#1b2230"/>').join('');
    var xl=jr.map((j,i)=>'<text x="'+sx(i).toFixed(1)+'" y="164" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">'+j+'</text>').join('');
    var leg='<rect x="76" y="20" width="10" height="10" fill="#c0392b" opacity="0.55"/><text x="90" y="29" font-family="sans-serif" font-size="7.5" fill="#c0392b">werklozen (mln)</text><line x1="188" y1="25" x2="204" y2="25" stroke="#1b2230" stroke-width="2.4"/><text x="208" y="29" font-family="sans-serif" font-size="7.5" fill="#1b2230">NSDAP-zetels</text>';
    return '<svg viewBox="0 0 360 186" role="img" aria-label="werkloosheid en nsdap-zetels in duitsland">'+ylW+'<line x1="56" y1="18" x2="56" y2="150" stroke="#c0392b" stroke-width="1.6"/><line x1="330" y1="18" x2="330" y2="150" stroke="#1b2230" stroke-width="1.6"/><line x1="56" y1="150" x2="336" y2="150" stroke="#1b2230" stroke-width="1.6"/>'+bars+line+xl+ylZ+leg+'<text x="195" y="182" font-family="sans-serif" font-size="8" font-weight="800" fill="#1b2230" text-anchor="middle">bron 3: werkloosheid en zetels NSDAP in de Rijksdag</text></svg>';
  })(),
  // Bron 4: schema blokvorming Koude Oorlog
  blokken:`<svg viewBox="0 0 360 176" role="img" aria-label="schema van de blokvorming in de koude oorlog">
    <rect x="12" y="30" width="142" height="120" rx="6" fill="#eaf1fb" stroke="#2563eb" stroke-width="1.6"/>
    <rect x="206" y="30" width="142" height="120" rx="6" fill="#fbeaea" stroke="#c0392b" stroke-width="1.6"/>
    <text x="83" y="24" font-family="sans-serif" font-size="10" font-weight="800" fill="#2563eb" text-anchor="middle">Westblok</text>
    <text x="277" y="24" font-family="sans-serif" font-size="10" font-weight="800" fill="#c0392b" text-anchor="middle">Oostblok</text>
    <g font-family="sans-serif" font-size="8.5" fill="#1b2230">
      <text x="22" y="54">leider: Verenigde Staten</text>
      <text x="22" y="74">militair: NAVO</text>
      <text x="22" y="94">economie: kapitalisme,</text><text x="22" y="106">Marshallhulp</text>
      <text x="22" y="126">bestuur: parlementaire</text><text x="22" y="138">democratie</text>
      <text x="216" y="54">leider: Sovjet-Unie</text>
      <text x="216" y="74">militair: Warschaupact</text>
      <text x="216" y="94">economie: communisme,</text><text x="216" y="106">planeconomie</text>
      <text x="216" y="126">bestuur: eenpartijstaat</text><text x="216" y="138">(dictatuur)</text>
    </g>
    <g stroke="#7a8699" stroke-width="1.6" fill="none"><line x1="156" y1="90" x2="204" y2="90" stroke-dasharray="4 3"/></g>
    <text x="180" y="82" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#5a6270" text-anchor="middle">wapen-</text>
    <text x="180" y="102" font-family="sans-serif" font-size="7.5" font-weight="700" fill="#5a6270" text-anchor="middle">wedloop</text>
    <text x="180" y="168" font-family="sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">bron 4: de twee machtsblokken tegenover elkaar</text></svg>`,
  // Bron 5: tijdbalk dekolonisatie (gelijkmatig gespreid, om labeloverlap te vermijden)
  dekol:(function(){
    var ev=[[1945,'Indonesie roept','onafhankelijkheid uit'],[1947,'India','onafhankelijk'],[1949,'soevereiniteits-','overdracht Indonesie'],[1960,'"Jaar van Afrika":','17 landen vrij'],[1975,'Suriname','onafhankelijk']];
    var sx=function(i){return 46+i/4*284;}; // even spacing per gebeurtenis
    var line='<line x1="30" y1="90" x2="352" y2="90" stroke="#1b2230" stroke-width="2"/><path d="M352 90 L344 86 L344 94 Z" fill="#1b2230"/>';
    var ticks=ev.map((e,i)=>{
      var x=sx(i); var up=i%2===0;
      var ty=up?48:122;
      return '<line x1="'+x.toFixed(1)+'" y1="86" x2="'+x.toFixed(1)+'" y2="94" stroke="#1b2230" stroke-width="1.6"/>'+
        '<line x1="'+x.toFixed(1)+'" y1="90" x2="'+x.toFixed(1)+'" y2="'+(up?ty+8:ty-14)+'" stroke="#94a0b8" stroke-width="1" stroke-dasharray="3 3"/>'+
        '<text x="'+x.toFixed(1)+'" y="'+(up?106:78)+'" font-family="sans-serif" font-size="8.5" font-weight="800" fill="#2563eb" text-anchor="middle">'+e[0]+'</text>'+
        '<text x="'+x.toFixed(1)+'" y="'+ty+'" font-family="sans-serif" font-size="7.5" fill="#1b2230" text-anchor="middle">'+e[1]+'</text>'+
        '<text x="'+x.toFixed(1)+'" y="'+(ty+11)+'" font-family="sans-serif" font-size="7.5" fill="#1b2230" text-anchor="middle">'+e[2]+'</text>';
    }).join('');
    return '<svg viewBox="0 0 360 172" role="img" aria-label="tijdbalk van de dekolonisatie">'+line+ticks+'<text x="190" y="166" font-family="sans-serif" font-size="8" font-weight="800" fill="#1b2230" text-anchor="middle">bron 5: enkele mijlpalen in de dekolonisatie na 1945</text></svg>';
  })(),
};

SLAGIO_EXAMENS.vwo.gs = {
  origineel: true,
  titel: 'Geschiedenis',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 150,
  max_punten: 22,
  bron: 'Slagio origineel · examenstijl (gestileerde bronnen)',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'De tijd van pruiken en revoluties',
      context:'Bron 1 is een gestileerd pamflet uit 1775, geschreven in de geest van de Verlichting.',
      afb:_VGSAFB.pamflet, afb_cap:'bron 1: een (nagemaakt) verlichtingspamflet, 1775' },
    { nr:2, titel:'De sociale kwestie',
      context:'Bron 2 toont het aandeel van de bevolking dat in steden woonde in een industrialiserend land in de negentiende eeuw.',
      afb:_VGSAFB.industrie, afb_cap:'bron 2: verstedelijking tijdens de industrialisatie' },
    { nr:3, titel:'Weimar onder druk',
      context:'Bron 3 toont voor Duitsland de werkloosheid (staven, linkeras) en het aantal zetels van de NSDAP in de Rijksdag (lijn, rechteras) tussen 1928 en 1933.',
      afb:_VGSAFB.weimar, afb_cap:'bron 3: werkloosheid en NSDAP-zetels, 1928-1933' },
    { nr:4, titel:'Twee blokken',
      context:'Bron 4 is een schema van de twee machtsblokken tijdens de Koude Oorlog.',
      afb:_VGSAFB.blokken, afb_cap:'bron 4: schema van de blokvorming' },
    { nr:5, titel:'Het einde van de koloniale tijd',
      context:'Bron 5 is een tijdbalk met enkele mijlpalen in de dekolonisatie na 1945.',
      afb:_VGSAFB.dekol, afb_cap:'bron 5: tijdbalk van de dekolonisatie' },
  ],
  vragen: [
    // Opgave 1
    { nr:1, opgave:1, punten:3, type:'open', domein:'Verlichting',
      vraag:'Leg uit dat de ideeen in bron 1 kenmerkend zijn voor de Verlichting. Gebruik twee begrippen uit de politieke Verlichting en citeer bij elk begrip een zinsnede uit de bron.',
      antwoord:'Twee kenmerkende Verlichtingsideeen komen terug. (1) Volkssoevereiniteit: het idee dat alle macht bij het volk ligt, niet bij een van God gegeven vorst. In de bron: "Alle macht komt voort uit het volk" en "Geen mens wordt geboren als onderdaan van een vorst". (2) Natuurrechten/grondrechten: de gedachte dat ieder mens onvervreemdbare rechten heeft (op vrijheid en eigendom) die de overheid moet beschermen. In de bron: "de natuurlijke rechten van de mens op vrijheid en eigendom". Ook het recht van opstand tegen een tirannieke regering ("Het volk mag haar dan afzetten") past hierbij. Deze ideeen zijn typisch voor de Verlichting, die het goddelijk recht van vorsten verving door rede, natuurrechten en volkssoevereiniteit.',
      antwoord_rubric:'1 punt: volkssoevereiniteit benoemd met passend citaat. 1 punt: natuurrechten/grondrechten benoemd met passend citaat. 1 punt: uitleg dat dit de Verlichting kenmerkt (rede/natuurrecht in plaats van goddelijk recht van de vorst).' },
    { nr:2, opgave:1, punten:2, type:'open', domein:'Atlantische revoluties',
      vraag:'Leg met de datering (1775) uit bij welke gebeurtenis dit pamflet goed zou passen, en waarom een historicus toch voorzichtig moet zijn met de representativiteit van zo\'n anonieme bron.',
      antwoord:'De datering 1775 en de oproep om een onderdrukkende regering af te zetten passen goed bij het uitbreken van de Amerikaanse Revolutie (de Onafhankelijkheidsoorlog begon in 1775; de Onafhankelijkheidsverklaring volgde in 1776). De ideeen van volkssoevereiniteit en natuurrechten zijn daar direct in terug te vinden. Een historicus moet echter voorzichtig zijn met de representativiteit: het is een anoniem pamflet van een enkele schrijver. Het laat zien wat een voorstander van de revolutie vond, maar niet of de meerderheid van de bevolking er zo over dacht. Pamfletten waren juist bedoeld om te overtuigen (propaganda), dus ze geven een gekleurd, niet per se representatief beeld van de publieke opinie.',
      antwoord_rubric:'1 punt: koppeling aan de Amerikaanse Revolutie (1775/1776) met inhoudelijk argument. 1 punt: representativiteitsprobleem (anoniem, een schrijver, overtuigingsdoel/propaganda -> geen bewijs voor mening van de meerderheid).' },
    // Opgave 2
    { nr:3, opgave:2, punten:2, type:'open', domein:'Industrialisatie',
      vraag:'Beschrijf de ontwikkeling in bron 2 en leg uit welk verband deze verstedelijking heeft met de industriele revolutie.',
      antwoord:'Bron 2 laat zien dat het aandeel stadsbewoners tussen 1800 en 1900 sterk stijgt: van ongeveer 20% naar ongeveer 70%. De bevolking verschoof dus van het platteland naar de steden. Dit hangt samen met de industriele revolutie: fabrieken vestigden zich in of bij steden en trokken massaal arbeiders aan. Tegelijk zorgden efficientere landbouw en bevolkingsgroei voor een overschot aan arbeidskrachten op het platteland (trek van het platteland). Mensen migreerden naar de steden voor werk in de fabrieken, waardoor die steden explosief groeiden.',
      antwoord_rubric:'1 punt: beschrijving stijging (ongeveer 20% naar 70% tussen 1800 en 1900). 1 punt: verband met industrialisatie (fabrieken in steden trekken arbeiders, trek van platteland naar stad).' },
    { nr:4, opgave:2, punten:2, type:'open', domein:'Sociale kwestie',
      vraag:'De snelle verstedelijking leidde tot de "sociale kwestie". Leg uit wat daarmee bedoeld wordt en noem een reactie van de overheid hierop.',
      antwoord:'De sociale kwestie is het geheel van slechte leef- en werkomstandigheden van de arbeiders in de industriesteden: lange werkdagen, kinderarbeid, lage lonen, gevaarlijk fabriekswerk en overvolle, ongezonde arbeiderswijken zonder riolering. Dit werd als een maatschappelijk probleem gezien dat om een oplossing vroeg. Een reactie van de overheid was het invoeren van sociale wetgeving, bijvoorbeeld een verbod op kinderarbeid (zoals het Kinderwetje van Van Houten in Nederland, 1874) of arbeidswetten die de werktijden en veiligheid regelden.',
      antwoord_rubric:'1 punt: uitleg sociale kwestie (slechte werk- en leefomstandigheden arbeiders: kinderarbeid, lange dagen, slechte wijken). 1 punt: een concrete overheidsreactie (sociale/arbeidswetgeving, verbod kinderarbeid, bv. Kinderwetje 1874).' },
    // Opgave 3
    { nr:5, opgave:3, punten:3, type:'open', domein:'Interbellum',
      vraag:'Leg met bron 3 een oorzakelijk verband uit tussen de economische situatie en de opkomst van de NSDAP. Betrek de rol van de crisis van 1929 in je antwoord.',
      antwoord:'Bron 3 laat zien dat de werkloosheid en het aantal NSDAP-zetels tegelijk sterk stijgen: in 1928 waren er 1,4 miljoen werklozen en 12 NSDAP-zetels, in 1932 al 5,6 miljoen werklozen en 230 zetels. Er is een duidelijk verband. Na de beurskrach van 1929 (New York) volgde een wereldwijde economische crisis die Duitsland extra hard trof, mede doordat Amerikaanse leningen werden teruggetrokken. Massawerkloosheid en armoede leidden tot wanhoop en onvrede met de zwakke Weimarregering. Hitler bespeelde die onvrede met eenvoudige oplossingen, zondebokken (Joden, communisten, het Verdrag van Versailles) en beloftes van werk en herstel. Steeds meer wanhopige kiezers stemden daardoor NSDAP: de economische crisis is dus een belangrijke oorzaak van de electorale opkomst van de partij.',
      antwoord_rubric:'1 punt: parallelle stijging werkloosheid en zetels met cijfers uit de bron. 1 punt: rol crisis van 1929 (wereldcrisis treft Duitsland, massawerkloosheid). 1 punt: mechanisme (onvrede/wanhoop -> Hitler biedt zondebokken en oplossingen -> meer stemmen NSDAP).' },
    { nr:6, opgave:3, punten:2, type:'open', domein:'Historisch redeneren',
      vraag:'Een leerling stelt: "Bron 3 bewijst dat de werkloosheid de NSDAP aan de macht heeft geholpen." Leg uit waarom deze conclusie te stellig is, met een historisch argument over correlatie en oorzaak.',
      antwoord:'De conclusie is te stellig. Bron 3 toont een correlatie (werkloosheid en zetels stijgen samen), maar een correlatie bewijst nog geen oorzakelijk verband, en zeker geen volledige verklaring. Ten eerste kwam Hitler formeel niet door de kiezers, maar door een politieke benoeming aan de macht: hij werd in januari 1933 door president Hindenburg tot rijkskanselier benoemd (achterkamertjespolitiek van conservatieven die dachten hem te kunnen gebruiken). Ten tweede speelden er meer oorzaken mee: de zwakte van de Weimardemocratie, de wrok over het Verdrag van Versailles, de angst voor het communisme, en Hitlers propaganda en SA-geweld. De werkloosheid was een belangrijke oorzaak, maar niet de enige, en de bron alleen kan geen "bewijs" van een enkelvoudige oorzaak zijn.',
      antwoord_rubric:'1 punt: correlatie is geen oorzaak / bron toont samenhang maar bewijst geen volledige verklaring. 1 punt: minstens een aanvullende oorzaak of nuance (benoeming door Hindenburg 1933, Versailles, angst communisme, propaganda).' },
    // Opgave 4
    { nr:7, opgave:4, punten:2, type:'open', domein:'Koude Oorlog',
      vraag:'Noem met bron 4 twee tegenstellingen tussen het West- en Oostblok, en leg uit waarom de Koude Oorlog een "ideologisch conflict" wordt genoemd.',
      antwoord:'Twee tegenstellingen uit de bron (elk voldoende twee): economisch stond kapitalisme (vrije markt, Marshallhulp) tegenover communisme (planeconomie); politiek stond de parlementaire democratie tegenover de eenpartijstaat/dictatuur; militair stond de NAVO tegenover het Warschaupact. De Koude Oorlog heet een ideologisch conflict omdat de kern een botsing van wereldbeelden was: de kapitalistisch-democratische ideologie van het Westen tegenover de communistische ideologie van het Oosten. Beide blokken wilden hun maatschappijmodel wereldwijd verspreiden en zagen het andere als een bedreiging, zonder dat de VS en de Sovjet-Unie rechtstreeks oorlog voerden.',
      antwoord_rubric:'1 punt: twee juiste tegenstellingen uit de bron (economisch/politiek/militair). 1 punt: uitleg ideologisch conflict (botsing kapitalisme-democratie tegenover communisme, beide willen model verspreiden).' },
    { nr:8, opgave:4, punten:1, type:'open', domein:'Koude Oorlog',
      vraag:'Leg uit waarom er ondanks de enorme spanning tussen de blokken geen directe oorlog tussen de VS en de Sovjet-Unie uitbrak.',
      antwoord:'Beide supermachten beschikten over kernwapens. Een directe oorlog zou uitlopen op wederzijdse vernietiging (het idee van "mutual assured destruction"): wie als eerste aanviel, zou zelf ook worden vernietigd door een kernaanval van de ander. Die afschrikking zorgde ervoor dat het conflict "koud" bleef en zich uitte in wapenwedloop, propaganda en oorlogen via bondgenoten (proxy-oorlogen) in plaats van een rechtstreekse oorlog.',
      antwoord_rubric:'1 punt: nucleaire afschrikking / wederzijdse vernietiging (mutual assured destruction) houdt directe oorlog tegen.' },
    // Opgave 5
    { nr:9, opgave:5, punten:3, type:'open', domein:'Dekolonisatie',
      vraag:'Beschrijf met bron 5 het tempo van de dekolonisatie na 1945, en leg uit welke rol de Tweede Wereldoorlog en de Koude Oorlog bij dit proces speelden.',
      antwoord:'Bron 5 laat zien dat de dekolonisatie kort na 1945 op gang komt en zich in enkele decennia voltrekt: Indonesie (1945/1949), India (1947), het "Jaar van Afrika" met 17 onafhankelijke landen (1960) en Suriname (1975). In ongeveer dertig jaar verdwijnen zo de meeste koloniale rijken. De Tweede Wereldoorlog versnelde dit: de Europese koloniale mogendheden waren militair en economisch verzwakt, hun onoverwinnelijkheid was doorbroken (bijvoorbeeld door de Japanse bezetting van Aziatische kolonien), en het zelfbeschikkingsrecht kreeg wereldwijd steun. Ook de Koude Oorlog speelde een rol: zowel de VS als de Sovjet-Unie waren om ideologische redenen tegen het oude kolonialisme en probeerden de nieuwe onafhankelijke staten aan hun kant te krijgen, wat extra druk op de kolonisatoren zette.',
      antwoord_rubric:'1 punt: beschrijving tempo met voorbeelden/jaartallen uit de bron (snel, binnen ca. 30 jaar). 1 punt: rol WO II (verzwakte kolonisatoren, gebroken onoverwinnelijkheid, zelfbeschikkingsrecht). 1 punt: rol Koude Oorlog (VS en SU tegen kolonialisme, wedijver om de nieuwe staten).' },
    { nr:10, opgave:5, punten:2, type:'open', domein:'Dekolonisatie',
      vraag:'De onafhankelijkheid van Indonesie (bron 5) verliep anders dan die van veel andere kolonien. Leg uit waarom juist hier een gewapend conflict met het moederland ontstond, en noem het begrip waarmee Nederland deze strijd destijds aanduidde.',
      antwoord:'Indonesie riep in 1945 zelf eenzijdig de onafhankelijkheid uit (Soekarno en Hatta), maar Nederland erkende dit niet en wilde zijn kolonie terug, mede vanwege het economische belang (grondstoffen, "Indie verloren, rampspoed geboren"). Daardoor ontstond een gewapend conflict: Nederland stuurde troepen om het gezag te herstellen. Pas onder zware internationale druk (vooral van de VS, die met stopzetting van Marshallhulp dreigde) droeg Nederland in 1949 de soevereiniteit over. Nederland noemde de militaire acties in deze strijd eufemistisch "politionele acties" (politieacties), alsof het slechts om het herstel van orde en gezag ging in plaats van om een koloniale oorlog.',
      antwoord_rubric:'1 punt: uitleg conflict (Indonesie roept in 1945 zelf onafhankelijkheid uit, Nederland erkent dit niet en wil de kolonie/het economisch belang terug -> gewapende strijd, met rol internationale druk/VS). 1 punt: het begrip "politionele acties" genoemd.' },
  ],
};
