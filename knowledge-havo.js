// ═══════════════════════════════════════════════════════════════════════
// knowledge-havo.js — Curriculum Intelligence Layer (F1) · PILOT: Biologie
// ───────────────────────────────────────────────────────────────────────
// Leerdoelen tussen domein en vraag. Broncontent, lazy te laden zoals sam-*.js.
// Sleutel = "<vakId>_<domeinId>"; koppelsleutel op vragen wordt straks `lo` = id.
//
// Velden per leerdoel:
//   id             stabiel, append-only: "<vak>.<domein>.<volgnr>"
//   titel          korte naam
//   eindterm       verwijzing naar examenprogramma/syllabus (bronhiërarchie §9)
//   teVerifiëren   true = exacte CvTE-code nog checken tegen definitieve syllabus
//   beschrijving   wat de kandidaat moet kunnen
//   concepten      begrippen die dit leerdoel dekt (voor concept-match bij tagging)
//   vaardigheid    KENNISdimensie   — onthouden|beschrijven|verklaren|toepassen|berekenen|analyseren|beoordelen
//   examenskill    EXAMENVAARDIGHEIDSdimensie — bron-interpretatie|data-verwerken|meerstaps-redeneren|antwoord-formuleren|context-transfer
//   examenrelevantie hoog|midden|laag
//   veelgemaakteFouten  haak voor F2 (misconceptie-afleiders); in F1 nog niet gebruikt
//
// M1-scope: ALLEEN pilot (bi). Geen vraag aangeraakt, geen runtime-wiring.
// ═══════════════════════════════════════════════════════════════════════
var LEERDOELEN = (typeof LEERDOELEN !== 'undefined' && LEERDOELEN) || {};

Object.assign(LEERDOELEN, {

  // ─────────────────────────────────────────────────────────────────────
  // Domein A — Vaardigheden en onderzoek
  // (dit domein toetst grotendeels examenvaardigheden zelf)
  // ─────────────────────────────────────────────────────────────────────
  "bi_A": {
    syllabus: "CE Biologie HAVO — Domein A: Vaardigheden (biologisch onderzoek)",
    leerdoelen: [
      {
        id: "bi.A.1", titel: "Onderzoek opzetten",
        eindterm: "A — onderzoeksvaardigheden", teVerifiëren: true,
        beschrijving: "De kandidaat kan een biologisch experiment opzetten: hypothese formuleren en onafhankelijke, afhankelijke en constante variabelen benoemen, inclusief een geschikte controlegroep.",
        concepten: ["Hypothese","Onafhankelijke variabele","Afhankelijke variabele","Variabelen","Constant","Controlegroep","Controle-experiment","Onafhankelijk","Afhankelijk"],
        vaardigheid: "toepassen", examenskill: "meerstaps-redeneren", examenrelevantie: "hoog",
        veelgemaakteFouten: ["verwart onafhankelijke en afhankelijke variabele","vergeet de controlegroep"]
      },
      {
        id: "bi.A.2", titel: "Betrouwbaarheid en validiteit beoordelen",
        eindterm: "A — kwaliteit van onderzoek", teVerifiëren: true,
        beschrijving: "De kandidaat kan de betrouwbaarheid en validiteit van een onderzoek beoordelen en de rol van steekproef en placebo herkennen.",
        concepten: ["Betrouwbaarheid","Validiteit","Steekproef","Placebo"],
        vaardigheid: "beoordelen", examenskill: "antwoord-formuleren", examenrelevantie: "hoog",
        veelgemaakteFouten: ["haalt betrouwbaarheid en validiteit door elkaar","noemt te kleine steekproef niet als beperking"]
      },
      {
        id: "bi.A.3", titel: "Data verwerken en grafieken lezen",
        eindterm: "A — dataverwerking", teVerifiëren: true,
        beschrijving: "De kandidaat kan gegevens uit tabellen en grafieken aflezen, spreiding (standaarddeviatie) interpreteren en bijv. fotosynthesesnelheid uit een grafiek afleiden.",
        concepten: ["Grafiek lezen","Standaarddeviatie","Fotosynthesesnelheid"],
        vaardigheid: "analyseren", examenskill: "data-verwerken", examenrelevantie: "hoog",
        veelgemaakteFouten: ["leest as-eenheden verkeerd","trekt conclusie buiten het meetbereik"]
      },
      {
        id: "bi.A.4", titel: "Correlatie versus causaliteit",
        eindterm: "A — conclusies trekken", teVerifiëren: true,
        beschrijving: "De kandidaat kan onderscheiden of gegevens een verband (correlatie) of een oorzaak-gevolgrelatie (causaliteit) aantonen.",
        concepten: ["Correlatie vs. causaliteit"],
        vaardigheid: "beoordelen", examenskill: "meerstaps-redeneren", examenrelevantie: "midden",
        veelgemaakteFouten: ["concludeert oorzaak uit een enkele correlatie"]
      },
      {
        id: "bi.A.5", titel: "Biologisch onderzoeksgereedschap",
        eindterm: "A — practicumvaardigheden", teVerifiëren: true,
        beschrijving: "De kandidaat kan een determineertabel gebruiken en de functie van een preparaat bij microscopisch onderzoek benoemen.",
        concepten: ["Determineertabel","Preparaat"],
        vaardigheid: "toepassen", examenskill: "bron-interpretatie", examenrelevantie: "laag",
        veelgemaakteFouten: ["kiest verkeerde tak in de determineertabel"]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────
  // Domein M — Molecuul- en celniveau
  // ─────────────────────────────────────────────────────────────────────
  "bi_M": {
    syllabus: "CE Biologie HAVO — Molecuul- en celniveau (eiwitsynthese, stofwisseling van de cel, erfelijkheid)",
    leerdoelen: [
      {
        id: "bi.M.1", titel: "Bouw en functie van de cel",
        eindterm: "B — cel als bouwsteen", teVerifiëren: true,
        beschrijving: "De kandidaat kan celorganellen en hun functie benoemen en het verschil tussen plantaardige en dierlijke cellen aangeven.",
        // NB: 'Ribosoom' is bewust NIET hier maar bij bi.M.5 (eiwitsynthese) als
        // primaire eigenaar — het was het enige concept dat in twee leerdoelen zat.
        concepten: ["Cel","Celmembraan","Celkern","Mitochondrion","Chloroplast","Celorganellen","Bladgroenkorrel (plant)"],
        vaardigheid: "beschrijven", examenskill: "bron-interpretatie", examenrelevantie: "hoog",
        veelgemaakteFouten: ["verwart mitochondrion met chloroplast","denkt dat dierlijke cellen een celwand hebben"]
      },
      {
        id: "bi.M.2", titel: "Transport door het celmembraan",
        eindterm: "B — membraantransport", teVerifiëren: true,
        beschrijving: "De kandidaat kan osmose verklaren en voorspellen hoe water zich via het celmembraan verplaatst bij verschillende concentraties.",
        concepten: ["Osmose"],
        vaardigheid: "verklaren", examenskill: "meerstaps-redeneren", examenrelevantie: "hoog",
        veelgemaakteFouten: ["denkt dat water van lage naar hoge waterconcentratie stroomt"]
      },
      {
        id: "bi.M.3", titel: "Enzymwerking",
        eindterm: "B — enzymen", teVerifiëren: true,
        beschrijving: "De kandidaat kan de werking van enzymen beschrijven en het effect van temperatuur en pH op de enzymactiviteit uit een grafiek afleiden.",
        concepten: ["Enzym","Energie","Denaturatie"],
        vaardigheid: "verklaren", examenskill: "bron-interpretatie", examenrelevantie: "hoog",
        veelgemaakteFouten: ["denkt dat een enzym wordt verbruikt in de reactie","verwart optimumtemperatuur met denaturatie"]
      },
      {
        id: "bi.M.4", titel: "Energiestofwisseling: fotosynthese en celademhaling",
        eindterm: "B — assimilatie/dissimilatie", teVerifiëren: true,
        beschrijving: "De kandidaat kan fotosynthese en celademhaling als tegengestelde processen beschrijven, met de rol van chloroplast en mitochondrion.",
        concepten: ["Fotosynthese","Celademhaling"],
        vaardigheid: "verklaren", examenskill: "meerstaps-redeneren", examenrelevantie: "hoog",
        veelgemaakteFouten: ["denkt dat planten geen celademhaling doen","wisselt reactanten en producten om"]
      },
      {
        id: "bi.M.5", titel: "DNA en eiwitsynthese",
        eindterm: "B — eiwitsynthese", teVerifiëren: true,
        beschrijving: "De kandidaat kan de route van DNA naar eiwit beschrijven (genexpressie) en de rol van chromosoom en ribosoom benoemen.",
        concepten: ["DNA","Genexpressie","DNA → eiwit","Ribosoom","Chromosoom"],
        vaardigheid: "verklaren", examenskill: "meerstaps-redeneren", examenrelevantie: "hoog",
        veelgemaakteFouten: ["verwart transcriptie en translatie","denkt dat eiwitten in de celkern worden gemaakt"]
      },
      {
        id: "bi.M.6", titel: "Celdeling: mitose en meiose",
        eindterm: "B — celdeling", teVerifiëren: true,
        beschrijving: "De kandidaat kan mitose en meiose onderscheiden en het verschil in aantal chromosomen van de dochtercellen aangeven.",
        concepten: ["Mitose","Meiose","Celdeling"],
        vaardigheid: "beschrijven", examenskill: "bron-interpretatie", examenrelevantie: "midden",
        veelgemaakteFouten: ["denkt dat mitose haploïde cellen oplevert","verwart het aantal delingen bij meiose"]
      },
      {
        id: "bi.M.7", titel: "Erfelijkheid: allelen en overerving",
        eindterm: "B — genetica", teVerifiëren: true,
        beschrijving: "De kandidaat kan met dominante en recessieve allelen een kruisingsschema opstellen en overervingskansen berekenen; de rol van mutatie benoemen.",
        concepten: ["Allel","Dominant allel","Recessief allel","Genetica","Mutatie"],
        vaardigheid: "toepassen", examenskill: "data-verwerken", examenrelevantie: "hoog",
        veelgemaakteFouten: ["verwart genotype en fenotype","rekent de kansverhouding uit het schema verkeerd"]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────
  // Domein O — Orgaan- en organismeniveau
  // ─────────────────────────────────────────────────────────────────────
  "bi_O": {
    syllabus: "CE Biologie HAVO — Orgaan- en organismeniveau (regeling, afweer, transport, spijsvertering)",
    leerdoelen: [
      {
        id: "bi.O.1", titel: "Zenuwstelsel en prikkelgeleiding",
        eindterm: "C — zenuwstelsel", teVerifiëren: true,
        beschrijving: "De kandidaat kan de weg van een prikkel door neuron en synaps beschrijven en het verschil tussen een reflex en een bewuste reactie verklaren.",
        concepten: ["Neuron","Synaps","Reflex","Zenuwstelsel","Regeling"],
        vaardigheid: "verklaren", examenskill: "meerstaps-redeneren", examenrelevantie: "hoog",
        veelgemaakteFouten: ["laat de prikkel de verkeerde kant op door de synaps gaan","verwart reflexboog met bewuste route"]
      },
      {
        id: "bi.O.2", titel: "Hormonale regulatie",
        eindterm: "C — hormonale regulatie", teVerifiëren: true,
        beschrijving: "De kandidaat kan de regulatie van de bloedglucose door insuline en glucagon verklaren en de werking van adrenaline benoemen.",
        concepten: ["Hormoon","Insuline","Glucagon","Adrenaline"],
        vaardigheid: "verklaren", examenskill: "meerstaps-redeneren", examenrelevantie: "hoog",
        veelgemaakteFouten: ["wisselt de functie van insuline en glucagon om","denkt dat hormonen via zenuwen worden vervoerd"]
      },
      {
        id: "bi.O.3", titel: "Homeostase en antagonisme",
        eindterm: "C — homeostase", teVerifiëren: true,
        beschrijving: "De kandidaat kan homeostase als het constant houden van het inwendig milieu verklaren en antagonistische regeling herkennen.",
        concepten: ["Homeostase","Antagonisme","Negatieve terugkoppeling"],
        vaardigheid: "verklaren", examenskill: "meerstaps-redeneren", examenrelevantie: "midden",
        veelgemaakteFouten: ["ziet terugkoppeling niet als negatieve feedback"]
      },
      {
        id: "bi.O.4", titel: "Afweer en immuniteit",
        eindterm: "C — afweer", teVerifiëren: true,
        beschrijving: "De kandidaat kan specifieke en aspecifieke afweer onderscheiden, de rol van antigeen en antilichaam beschrijven en het effect van vaccinatie verklaren.",
        concepten: ["Antigeen","Antilichaam","Specifieke afweer","Aspecifieke afweer","Vaccinatie","Afweer"],
        vaardigheid: "beschrijven", examenskill: "context-transfer", examenrelevantie: "hoog",
        veelgemaakteFouten: ["verwart antigeen en antilichaam","denkt dat aspecifieke afweer geheugen opbouwt"]
      },
      {
        id: "bi.O.5", titel: "Transport en gasuitwisseling",
        eindterm: "C — transport", teVerifiëren: true,
        beschrijving: "De kandidaat kan de bloedsomloop en de gasuitwisseling in de longen beschrijven en de rol van diffusie daarbij verklaren.",
        concepten: ["Bloedsomloop","Hart & bloedvaten","Gasuitwisseling","Longen","Diffusie"],
        vaardigheid: "verklaren", examenskill: "bron-interpretatie", examenrelevantie: "hoog",
        veelgemaakteFouten: ["wisselt long- en lichaamscircuit om","laat diffusie de verkeerde kant op gaan"]
      },
      {
        id: "bi.O.6", titel: "Spijsvertering en uitscheiding",
        eindterm: "C — vertering en uitscheiding", teVerifiëren: true,
        beschrijving: "De kandidaat kan de vertering van voedingsstoffen in het verteringsstelsel beschrijven en de rol van de nieren bij uitscheiding benoemen.",
        concepten: ["Spijsvertering","Verteringsstelsel","Nieren"],
        vaardigheid: "beschrijven", examenskill: "bron-interpretatie", examenrelevantie: "midden",
        veelgemaakteFouten: ["verwart mechanische en chemische vertering","denkt dat de nieren stoffen verteren"]
      },
      {
        id: "bi.O.7", titel: "Beweging: gewrichten en spieren",
        eindterm: "C — beweging", teVerifiëren: true,
        beschrijving: "De kandidaat kan de werking van een gewricht beschrijven en uitleggen hoe antagonistische spieren samenwerken bij beweging.",
        concepten: ["Gewricht","Antagonist"],
        vaardigheid: "beschrijven", examenskill: "bron-interpretatie", examenrelevantie: "laag",
        veelgemaakteFouten: ["denkt dat één spier zowel buigt als strekt"]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────
  // Domein P — Populatie- en ecosysteemniveau
  // ─────────────────────────────────────────────────────────────────────
  "bi_P": {
    syllabus: "CE Biologie HAVO — Populatie- en ecosysteemniveau (ecologie, evolutie, duurzaamheid)",
    leerdoelen: [
      {
        id: "bi.P.1", titel: "Ecosystemen: biotische en abiotische factoren",
        eindterm: "D — ecosysteem", teVerifiëren: true,
        beschrijving: "De kandidaat kan een ecosysteem beschrijven, biotische en abiotische factoren onderscheiden en de niche van een soort benoemen.",
        concepten: ["Ecosysteem","Biotische factor","Abiotische factor","Niche"],
        vaardigheid: "beschrijven", examenskill: "bron-interpretatie", examenrelevantie: "midden",
        veelgemaakteFouten: ["deelt een factor bij de verkeerde categorie in"]
      },
      {
        id: "bi.P.2", titel: "Voedselrelaties en energiedoorgifte",
        eindterm: "D — voedselrelaties", teVerifiëren: true,
        beschrijving: "De kandidaat kan voedselketens en -webben analyseren, de rol van producent, consument en reducent benoemen en energiedoorgifte via een piramide van biomassa verklaren.",
        concepten: ["Voedselketen","Voedselrelaties","Producent","Consument","Reducent","Piramide van biomassa","Energiedoorgifte","Nutriënt"],
        vaardigheid: "analyseren", examenskill: "bron-interpretatie", examenrelevantie: "hoog",
        veelgemaakteFouten: ["draait de richting van energiedoorgifte om","vergeet dat er energie verloren gaat per trofisch niveau"]
      },
      {
        id: "bi.P.3", titel: "Populatiedynamiek en draagkracht",
        eindterm: "D — populaties", teVerifiëren: true,
        beschrijving: "De kandidaat kan veranderingen in een populatie verklaren en de rol van draagkracht bij begrenzing van populatiegroei uit een grafiek afleiden.",
        concepten: ["Populatie","Populatiedynamiek","Draagkracht"],
        vaardigheid: "analyseren", examenskill: "data-verwerken", examenrelevantie: "hoog",
        veelgemaakteFouten: ["negeert draagkracht bij exponentiële groei","leest de grafiek van populatiegroei verkeerd"]
      },
      {
        id: "bi.P.4", titel: "Relaties tussen soorten",
        eindterm: "D — symbiose", teVerifiëren: true,
        beschrijving: "De kandidaat kan vormen van symbiose herkennen en het effect van een exoot op een ecosysteem verklaren.",
        concepten: ["Symbiose","Exoot"],
        vaardigheid: "beschrijven", examenskill: "context-transfer", examenrelevantie: "midden",
        veelgemaakteFouten: ["verwart mutualisme, commensalisme en parasitisme"]
      },
      {
        id: "bi.P.5", titel: "Successie en biodiversiteit",
        eindterm: "D — successie en duurzaamheid", teVerifiëren: true,
        beschrijving: "De kandidaat kan successie in een ecosysteem beschrijven en de betekenis van biodiversiteit en duurzaamheid verklaren.",
        concepten: ["Successie","Biodiversiteit","Duurzaamheid"],
        vaardigheid: "verklaren", examenskill: "meerstaps-redeneren", examenrelevantie: "midden",
        veelgemaakteFouten: ["ziet successie als een eenmalige gebeurtenis in plaats van een reeks"]
      },
      {
        id: "bi.P.6", titel: "Evolutie en natuurlijke selectie",
        eindterm: "D — evolutie", teVerifiëren: true,
        beschrijving: "De kandidaat kan natuurlijke selectie verklaren en het ontstaan van soorten (soortvorming) als gevolg van evolutie beschrijven.",
        concepten: ["Natuurlijke selectie","Evolutie","Soortvorming"],
        vaardigheid: "verklaren", examenskill: "context-transfer", examenrelevantie: "hoog",
        veelgemaakteFouten: ["denkt dat individuen zich aanpassen in plaats van populaties","gebruikt doelgericht ('om te') redeneren bij evolutie"]
      }
    ]
  }

});

// Export voor Node (dekkingsrapport/tests); browser negeert dit.
if (typeof module !== 'undefined' && module.exports) module.exports = { LEERDOELEN };
