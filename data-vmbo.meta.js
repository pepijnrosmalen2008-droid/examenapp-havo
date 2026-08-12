// data-vmbo.meta.js — GESHIPTE, VOORLOPIGE metadata voor VMBO GL/TL (gemengde/
// theoretische leerweg). Bevat de vakken + exameneenheden (domeinen) als STRUCTUUR;
// vragen (nSv/nOe/nBeg) zijn nog 0 — die komen later via de contentengine. Exacte
// examendata (exDatum/exTijd) volgt uit examenblad.nl; nu bewust leeg ("" ).
// GL en TL delen exact hetzelfde centraal examen, vandaar één gedeeld niveau.
var VAKKEN_VMBO = [
 {
  "id": "nl", "naam": "Nederlands", "code": "NE", "kleur": "#E85C0D",
  "beschrijving": "Leesvaardigheid, schrijven en fictie op VMBO GL/TL-niveau.",
  "ceInfo": "CE = leesvaardigheid. SE = schrijfvaardigheid, mondeling/kijk- en luistervaardigheid en fictie.",
  "exDatum": "", "exTijd": "", "exDuur": "2 uur", "hulpmiddelen": "Woordenboek Nederlands",
  "domeinen": [
   { "id": "A", "naam": "Leesvaardigheid", "beschrijving": "Tekstbegrip, hoofdgedachte, tekststructuur en argumentatie (CE).", "ceStatus": "CE", "onderwerpen": ["Hoofdgedachte en deelonderwerpen", "Signaalwoorden en tekststructuur", "Feit en mening", "Verwijswoorden", "Tekstdoel en publiek"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Schrijfvaardigheid", "beschrijving": "Brief, e-mail en verslag correct en doelgericht schrijven (SE).", "ceStatus": "SE", "onderwerpen": ["Formele brief en e-mail", "Verslag en samenvatting", "Spelling en interpunctie"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Fictie", "beschrijving": "Verhalen en gedichten lezen, herkennen en beoordelen (SE).", "ceStatus": "SE", "onderwerpen": ["Verhaalelementen (perspectief, spanning)", "Genres herkennen", "Eigen mening onderbouwen"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "en", "naam": "Engels", "code": "EN", "kleur": "#C0392B",
  "beschrijving": "Lees-, luister-, gespreks- en schrijfvaardigheid Engels.",
  "ceInfo": "CE = leesvaardigheid. SE = luister-, gespreks- en schrijfvaardigheid.",
  "exDatum": "", "exTijd": "", "exDuur": "2 uur", "hulpmiddelen": "Woordenboek Engels-Nederlands en Nederlands-Engels",
  "domeinen": [
   { "id": "A", "naam": "Leesvaardigheid", "beschrijving": "Teksten begrijpen: hoofd- en bijzaken, bedoeling (CE).", "ceStatus": "CE", "onderwerpen": ["Hoofdgedachte van een tekst", "Detailinformatie vinden", "Woordbetekenis uit context"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Grammatica & woordenschat", "beschrijving": "Basisgrammatica en veelvoorkomende woorden.", "ceStatus": "SE", "onderwerpen": ["Werkwoordstijden", "Onregelmatige werkwoorden", "Veelgebruikte woorden"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Luister- & gespreksvaardigheid", "beschrijving": "Gesproken Engels begrijpen en gesprekken voeren (SE).", "ceStatus": "SE", "onderwerpen": ["Kernboodschap begrijpen", "Reageren in een gesprek"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "du", "naam": "Duits", "code": "DU", "kleur": "#7F8C8D",
  "beschrijving": "Lees-, luister- en gespreksvaardigheid Duits (keuzevak).",
  "ceInfo": "CE = leesvaardigheid. SE = luister-, gespreks- en schrijfvaardigheid.",
  "exDatum": "", "exTijd": "", "exDuur": "2 uur", "hulpmiddelen": "Woordenboek Duits",
  "domeinen": [
   { "id": "A", "naam": "Leesvaardigheid", "beschrijving": "Duitse teksten begrijpen (CE).", "ceStatus": "CE", "onderwerpen": ["Hoofdgedachte", "Detailinformatie", "Woordbetekenis uit context"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Grammatica & woordenschat", "beschrijving": "Naamvallen, werkwoorden en basiswoordenschat.", "ceStatus": "SE", "onderwerpen": ["Naamvallen (basis)", "Werkwoordvervoeging", "Veelgebruikte woorden"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "fa", "naam": "Frans", "code": "FA", "kleur": "#2980B9",
  "beschrijving": "Lees-, luister- en gespreksvaardigheid Frans (keuzevak).",
  "ceInfo": "CE = leesvaardigheid. SE = luister-, gespreks- en schrijfvaardigheid.",
  "exDatum": "", "exTijd": "", "exDuur": "2 uur", "hulpmiddelen": "Woordenboek Frans",
  "domeinen": [
   { "id": "A", "naam": "Leesvaardigheid", "beschrijving": "Franse teksten begrijpen (CE).", "ceStatus": "CE", "onderwerpen": ["Hoofdgedachte", "Detailinformatie", "Woordbetekenis uit context"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Grammatica & woordenschat", "beschrijving": "Werkwoorden en basiswoordenschat.", "ceStatus": "SE", "onderwerpen": ["Werkwoordvervoeging", "Lidwoorden en geslacht", "Veelgebruikte woorden"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "wi", "naam": "Wiskunde", "code": "WI", "kleur": "#8E44AD",
  "beschrijving": "Rekenen, meetkunde, verbanden en informatieverwerking.",
  "ceInfo": "CE over de exameneenheden getallen & variabelen, meetkunde, informatieverwerking en verbanden.",
  "exDatum": "", "exTijd": "", "exDuur": "2 uur", "hulpmiddelen": "Rekenmachine, geodriehoek, passer",
  "domeinen": [
   { "id": "A", "naam": "Getallen & variabelen", "beschrijving": "Rekenen, verhoudingen, procenten en formules.", "ceStatus": "CE", "onderwerpen": ["Breuken, procenten en verhoudingen", "Machten en wortels", "Formules herleiden en invullen", "Vergelijkingen oplossen"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Meten & meetkunde", "beschrijving": "Oppervlakte, inhoud, hoeken en Pythagoras.", "ceStatus": "CE", "onderwerpen": ["Oppervlakte en omtrek", "Inhoud van ruimtefiguren", "Stelling van Pythagoras", "Hoeken en gelijkvormigheid"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Informatieverwerking & statistiek", "beschrijving": "Tabellen, diagrammen en gemiddelden.", "ceStatus": "CE", "onderwerpen": ["Tabellen en diagrammen lezen", "Gemiddelde, mediaan en modus", "Kans (basis)"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "D", "naam": "Verbanden", "beschrijving": "Grafieken, lineaire verbanden en formules.", "ceStatus": "CE", "onderwerpen": ["Grafiek en formule koppelen", "Lineaire verbanden", "Recht en omgekeerd evenredig"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "na1", "naam": "Natuur- en scheikunde 1", "code": "NA1", "kleur": "#16A085",
  "beschrijving": "Natuurkunde: elektriciteit, kracht, energie, licht en geluid.",
  "ceInfo": "CE natuurkunde-onderdelen (NaSk1): elektriciteit, kracht & beweging, energie, licht & geluid, warmte.",
  "exDatum": "", "exTijd": "", "exDuur": "2 uur", "hulpmiddelen": "Rekenmachine, BINAS/formuleblad",
  "domeinen": [
   { "id": "A", "naam": "Elektriciteit", "beschrijving": "Stroom, spanning, weerstand en schakelingen.", "ceStatus": "CE", "onderwerpen": ["Stroom, spanning en weerstand (wet van Ohm)", "Serie- en parallelschakeling", "Vermogen en energieverbruik"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Kracht & beweging", "beschrijving": "Snelheid, kracht, druk en machines.", "ceStatus": "CE", "onderwerpen": ["Snelheid en (afgelegde) afstand", "Krachten en zwaartekracht", "Druk"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Energie & warmte", "beschrijving": "Energieomzetting, rendement en warmte.", "ceStatus": "CE", "onderwerpen": ["Energiesoorten en -omzetting", "Rendement", "Warmte en isolatie"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "D", "naam": "Licht & geluid", "beschrijving": "Licht, beeldvorming, geluid en trillingen.", "ceStatus": "CE", "onderwerpen": ["Licht, spiegels en lenzen", "Geluid en geluidssnelheid", "Trillingen (basis)"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "na2", "naam": "Natuur- en scheikunde 2", "code": "NA2", "kleur": "#27AE60",
  "beschrijving": "Scheikunde: stoffen, reacties en materialen (alleen GL/TL).",
  "ceInfo": "CE scheikunde (NaSk2): stoffen & materialen, chemische reacties, industrie en milieu.",
  "exDatum": "", "exTijd": "", "exDuur": "2 uur", "hulpmiddelen": "Rekenmachine, BINAS/formuleblad",
  "domeinen": [
   { "id": "A", "naam": "Stoffen & materialen", "beschrijving": "Eigenschappen, mengsels en scheidingsmethoden.", "ceStatus": "CE", "onderwerpen": ["Zuivere stof en mengsel", "Scheidingsmethoden", "Fasen en faseovergangen"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Chemische reacties", "beschrijving": "Reacties, moleculen en reactievergelijkingen.", "ceStatus": "CE", "onderwerpen": ["Kenmerken van een reactie", "Moleculen en atomen", "Verbranding en ontleding"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Industrie & milieu", "beschrijving": "Grondstoffen, kunststoffen en duurzaamheid.", "ceStatus": "CE", "onderwerpen": ["Grondstoffen en producten", "Kunststoffen", "Milieu en recycling"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "bi", "naam": "Biologie", "code": "BI", "kleur": "#2ECC71",
  "beschrijving": "Cellen, organen, voortplanting, erfelijkheid en ecologie.",
  "ceInfo": "CE over de biologische exameneenheden: cellen & organen, voortplanting, erfelijkheid, ecologie en gezondheid.",
  "exDatum": "", "exTijd": "", "exDuur": "2 uur", "hulpmiddelen": "Rekenmachine",
  "domeinen": [
   { "id": "A", "naam": "Cellen, organen & stelsels", "beschrijving": "Bouw en werking van het menselijk lichaam.", "ceStatus": "CE", "onderwerpen": ["Cellen, weefsels en organen", "Spijsvertering", "Bloedsomloop en ademhaling"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Voortplanting & erfelijkheid", "beschrijving": "Voortplanting, DNA en overerving.", "ceStatus": "CE", "onderwerpen": ["Voortplanting bij de mens", "Erfelijke eigenschappen", "DNA en chromosomen (basis)"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Ecologie", "beschrijving": "Voedselrelaties, kringlopen en milieu.", "ceStatus": "CE", "onderwerpen": ["Voedselketens en -webben", "Kringlopen", "Mens en milieu"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "D", "naam": "Gezondheid & gedrag", "beschrijving": "Afweer, hormonen, zintuigen en gezond leven.", "ceStatus": "CE", "onderwerpen": ["Afweer en ziekteverwekkers", "Zintuigen en zenuwstelsel", "Gezonde leefstijl"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "ec", "naam": "Economie", "code": "EC", "kleur": "#F39C12",
  "beschrijving": "Consumptie, arbeid, geld, markt en overheid.",
  "ceInfo": "CE over de economische exameneenheden: consumptie, arbeid & productie, geld, markt en overheid.",
  "exDatum": "", "exTijd": "", "exDuur": "2 uur", "hulpmiddelen": "Rekenmachine",
  "domeinen": [
   { "id": "A", "naam": "Consumptie & budget", "beschrijving": "Kopen, sparen, lenen en verzekeren.", "ceStatus": "CE", "onderwerpen": ["Inkomen en budget", "Sparen en lenen", "Verzekeringen"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Arbeid & productie", "beschrijving": "Werk, loon, kosten en winst.", "ceStatus": "CE", "onderwerpen": ["Brutoloon en nettoloon", "Kosten, opbrengst en winst", "Arbeidsverdeling"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Markt & prijs", "beschrijving": "Vraag, aanbod en prijsvorming.", "ceStatus": "CE", "onderwerpen": ["Vraag en aanbod", "Prijsvorming", "Concurrentie"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "D", "naam": "Overheid & internationaal", "beschrijving": "Belastingen, overheid en handel.", "ceStatus": "CE", "onderwerpen": ["Belastingen", "Taken van de overheid", "Internationale handel"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "gs", "naam": "Geschiedenis & staatsinrichting", "code": "GS", "kleur": "#D35400",
  "beschrijving": "Historische tijdvakken en de Nederlandse staatsinrichting.",
  "ceInfo": "CE over de historische onderwerpen en de staatsinrichting van Nederland.",
  "exDatum": "", "exTijd": "", "exDuur": "2 uur", "hulpmiddelen": "Geen",
  "domeinen": [
   { "id": "A", "naam": "Staatsinrichting van Nederland", "beschrijving": "Grondwet, democratie en de rechtsstaat.", "ceStatus": "CE", "onderwerpen": ["Grondwet en grondrechten", "Regering en parlement", "Verkiezingen en politieke partijen"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Historische onderwerpen", "beschrijving": "Kernonderwerpen uit de moderne geschiedenis.", "ceStatus": "CE", "onderwerpen": ["Industriële samenleving", "Wereldoorlogen", "Koude Oorlog", "Dekolonisatie"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "ak", "naam": "Aardrijkskunde", "code": "AK", "kleur": "#3498DB",
  "beschrijving": "Weer & klimaat, water, bevolking, arm & rijk.",
  "ceInfo": "CE over de aardrijkskundige exameneenheden: weer & klimaat, water, bevolking & ruimte en arm & rijk.",
  "exDatum": "", "exTijd": "", "exDuur": "2 uur", "hulpmiddelen": "Atlas (indien toegestaan)",
  "domeinen": [
   { "id": "A", "naam": "Weer & klimaat", "beschrijving": "Weersverschijnselen en klimaatzones.", "ceStatus": "CE", "onderwerpen": ["Weer en weerkaarten", "Klimaatzones", "Klimaatverandering"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Water", "beschrijving": "Waterbeheer, overstromingen en Nederland.", "ceStatus": "CE", "onderwerpen": ["Waterkringloop", "Nederland en het water", "Overstromingsrisico"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Bevolking & ruimte", "beschrijving": "Bevolkingsspreiding, verstedelijking en migratie.", "ceStatus": "CE", "onderwerpen": ["Bevolkingsgroei", "Verstedelijking", "Migratie"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "D", "naam": "Arm & rijk", "beschrijving": "Welvaartsverschillen en ontwikkeling.", "ceStatus": "CE", "onderwerpen": ["Welvaartsverschillen", "Ontwikkelingslanden", "Wereldhandel"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "ma", "naam": "Maatschappijkunde", "code": "MA", "kleur": "#9B59B6",
  "beschrijving": "Politiek, media, criminaliteit en de pluriforme samenleving.",
  "ceInfo": "CE over de exameneenheden politiek, massamedia, criminaliteit & rechtsstaat en pluriforme samenleving.",
  "exDatum": "", "exTijd": "", "exDuur": "2 uur", "hulpmiddelen": "Geen",
  "domeinen": [
   { "id": "A", "naam": "Politiek & beleid", "beschrijving": "Democratie, politieke stromingen en besluitvorming.", "ceStatus": "CE", "onderwerpen": ["Politieke stromingen", "Besluitvorming", "Belangengroepen"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Massamedia", "beschrijving": "Media, beïnvloeding en betrouwbaarheid.", "ceStatus": "CE", "onderwerpen": ["Functies van media", "Beïnvloeding en manipulatie", "Betrouwbaarheid van bronnen"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Criminaliteit & rechtsstaat", "beschrijving": "Rechtsstaat, strafrecht en opsporing.", "ceStatus": "CE", "onderwerpen": ["Rechtsstaat en grondrechten", "Strafrecht", "Politie en rechter"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "D", "naam": "Pluriforme samenleving", "beschrijving": "Cultuur, identiteit en samenleven.", "ceStatus": "CE", "onderwerpen": ["Cultuur en identiteit", "Discriminatie", "Integratie"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 }
];
