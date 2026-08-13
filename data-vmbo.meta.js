// data-vmbo.meta.js — GESHIPTE metadata voor VMBO GL/TL (gemengde/theoretische
// leerweg). Bevat de vakken + de exameneenheden (domeinen) van de officiële
// CvTE-syllabi als STRUCTUUR, met per domein de officiële code (bv. "WI/K/4")
// voor tag-mapping. Vragen (nSv/nOe/nBeg) zijn nog 0 — die komen later via de
// content-engine. GL en TL delen exact hetzelfde centraal examen → één niveau.
var VAKKEN_VMBO = [
 {
  "id": "nl", "naam": "Nederlands", "code": "NE", "kleur": "#E85C0D",
  "beschrijving": "Leesvaardigheid (CE), schrijfvaardigheid en fictie.",
  "ceInfo": "CE = leesvaardigheid (NE/K/6). SE = schrijfvaardigheid, mondeling/kijk- en luistervaardigheid en fictie.",
  "exDatum": "2027-05-14", "exTijd": "13:30–15:30", "exDuur": "2 uur", "hulpmiddelen": "Woordenboek Nederlands",
  "domeinen": [
   { "id": "A", "naam": "Leesvaardigheid", "code": "NE/K/6", "beschrijving": "Tekstsoorten, tekststructuren en argumentatie (CE).", "ceStatus": "CE", "onderwerpen": ["Tekstsoorten: informeren, overtuigen, amuseren, activeren", "Tekststructuren en signaalwoorden", "Hoofdgedachte en deelonderwerpen bepalen", "Argumentatie: feiten vs. meningen", "Bedoeling en toon van de schrijver"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Schrijfvaardigheid", "code": "NE/K/5", "beschrijving": "Brief, e-mail en verslag correct en doelgericht schrijven (SE).", "ceStatus": "SE", "onderwerpen": ["Formele brief en e-mail", "Verslag en samenvatting", "Spelling en interpunctie"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Fictie", "code": "NE/K/8", "beschrijving": "Verhalen en gedichten lezen, herkennen en beoordelen (SE).", "ceStatus": "SE", "onderwerpen": ["Verhaalelementen (perspectief, spanning)", "Genres herkennen", "Eigen mening onderbouwen"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "en", "naam": "Engels", "code": "EN", "kleur": "#C0392B",
  "beschrijving": "Leesvaardigheid (CE) plus woordenschat en grammatica.",
  "ceInfo": "CE = leesvaardigheid (MVT/K/4, ERK A2–B1). SE = luister-, gespreks- en schrijfvaardigheid.",
  "exDatum": "2027-05-19", "exTijd": "13:30–15:30", "exDuur": "2 uur", "hulpmiddelen": "Woordenboek Engels-Nederlands en Nederlands-Engels",
  "domeinen": [
   { "id": "A", "naam": "Leesvaardigheid", "code": "MVT/K/4", "beschrijving": "Cito-teksten analyseren op ERK-niveau A2–B1 (CE).", "ceStatus": "CE", "onderwerpen": ["Hoofdlijn en hoofdgedachte filteren", "Detailinformatie vinden", "Woordbetekenis uit context", "Gatenteksten: idioom en grammatica in context"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Woordenschat & grammatica", "code": "MVT/K/3", "beschrijving": "Veelvoorkomende woorden en basisgrammatica (ondersteunend).", "ceStatus": "SE", "onderwerpen": ["Werkwoordstijden", "Onregelmatige werkwoorden", "Veelgebruikte woorden en idioom"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "du", "naam": "Duits", "code": "DU", "kleur": "#7F8C8D",
  "beschrijving": "Leesvaardigheid (CE) plus woordenschat en grammatica.",
  "ceInfo": "CE = leesvaardigheid (MVT/K/4, ERK A2–B1). SE = luister-, gespreks- en schrijfvaardigheid.",
  "exDatum": "2027-05-24", "exTijd": "09:00–11:00", "exDuur": "2 uur", "hulpmiddelen": "Woordenboek Duits",
  "domeinen": [
   { "id": "A", "naam": "Leesvaardigheid", "code": "MVT/K/4", "beschrijving": "Cito-teksten analyseren op ERK-niveau A2–B1 (CE).", "ceStatus": "CE", "onderwerpen": ["Hoofdlijn en hoofdgedachte filteren", "Detailinformatie vinden", "Woordbetekenis uit context", "Gatenteksten: idioom en grammatica in context"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Woordenschat & grammatica", "code": "MVT/K/3", "beschrijving": "Naamvallen, werkwoorden en basiswoordenschat (ondersteunend).", "ceStatus": "SE", "onderwerpen": ["Naamvallen (basis)", "Werkwoordvervoeging", "Veelgebruikte woorden"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "fa", "naam": "Frans", "code": "FA", "kleur": "#2980B9",
  "beschrijving": "Leesvaardigheid (CE) plus woordenschat en grammatica.",
  "ceInfo": "CE = leesvaardigheid (MVT/K/4, ERK A2–B1). SE = luister-, gespreks- en schrijfvaardigheid.",
  "exDatum": "2027-05-21", "exTijd": "13:30–15:30", "exDuur": "2 uur", "hulpmiddelen": "Woordenboek Frans",
  "domeinen": [
   { "id": "A", "naam": "Leesvaardigheid", "code": "MVT/K/4", "beschrijving": "Cito-teksten analyseren op ERK-niveau A2–B1 (CE).", "ceStatus": "CE", "onderwerpen": ["Hoofdlijn en hoofdgedachte filteren", "Detailinformatie vinden", "Woordbetekenis uit context", "Gatenteksten: idioom en grammatica in context"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Woordenschat & grammatica", "code": "MVT/K/3", "beschrijving": "Werkwoorden, lidwoorden en basiswoordenschat (ondersteunend).", "ceStatus": "SE", "onderwerpen": ["Werkwoordvervoeging", "Lidwoorden en geslacht", "Veelgebruikte woorden"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "wi", "naam": "Wiskunde", "code": "WI", "kleur": "#8E44AD",
  "beschrijving": "Algebra, rekenen & meten, meetkunde en statistiek.",
  "ceInfo": "CE over WI/K/4 (algebraïsche verbanden), WI/K/5 (rekenen, meten & schatten), WI/K/6 (meetkunde) en WI/K/7 (informatieverwerking, statistiek).",
  "exDatum": "2027-05-20", "exTijd": "13:30–15:30", "exDuur": "2 uur", "hulpmiddelen": "Rekenmachine, geodriehoek, passer",
  "domeinen": [
   { "id": "A", "naam": "Algebraïsche verbanden", "code": "WI/K/4", "beschrijving": "Formules, grafieken en vergelijkingen.", "ceStatus": "CE", "onderwerpen": ["Tabellen invullen en grafieken tekenen", "Lineaire en kwadratische verbanden herkennen", "Lineaire vergelijkingen oplossen", "Inklemmen bij kwadratische/exponentiële formules"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Rekenen, meten en schatten", "code": "WI/K/5", "beschrijving": "Functioneel rekenen en meten.", "ceStatus": "CE", "onderwerpen": ["Procenten en verhoudingen", "Wetenschappelijke notatie", "Samengestelde eenheden (bv. km/h ↔ m/s)", "Omtrek, oppervlakte en volume (kubus, cilinder, prisma, kegel)"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Meetkunde", "code": "WI/K/6", "beschrijving": "Pythagoras, goniometrie en symmetrie.", "ceStatus": "CE", "onderwerpen": ["Stelling van Pythagoras in 2D en 3D", "Sinus, cosinus en tangens in rechthoekige driehoeken", "Kijklijnen en zichtveld", "Symmetrieassen en draaisymmetrie"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "D", "naam": "Informatieverwerking, statistiek", "code": "WI/K/7", "beschrijving": "Diagrammen en centrummaten.", "ceStatus": "CE", "onderwerpen": ["Boxplot en steelbladdiagram", "Cirkeldiagram en histogram", "Gemiddelde, modus en mediaan"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "na1", "naam": "Natuur- en scheikunde 1", "code": "NA1", "kleur": "#16A085",
  "beschrijving": "Natuurkunde: stoffen, elektriciteit, warmte, geluid en kracht.",
  "ceInfo": "CE over NASK1/K/4 (stoffen), K/5 (elektrische energie), K/6 (verbranden & verwarmen), K/8 (geluid) en K/9 (kracht & veiligheid).",
  "exDatum": "2027-05-27", "exTijd": "13:30–15:30", "exDuur": "2 uur", "hulpmiddelen": "Rekenmachine, BINAS/formuleblad",
  "domeinen": [
   { "id": "A", "naam": "Stoffen en materialen", "code": "NASK1/K/4", "beschrijving": "Dichtheid en faseovergangen.", "ceStatus": "CE", "onderwerpen": ["Dichtheid: ρ = m / V", "Faseovergangen (smelten, koken, condenseren)", "Temperatuur-tijdgrafieken"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Elektrische energie", "code": "NASK1/K/5", "beschrijving": "Schakelingen, stroom, spanning en vermogen.", "ceStatus": "CE", "onderwerpen": ["Serie- en parallelschakeling", "Stroomsterkte (I) en spanning (U) meten", "Wet van Ohm: U = I × R", "Vermogen P = U × I en energie E = P × t"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Verbranden en verwarmen", "code": "NASK1/K/6", "beschrijving": "Warmtetransport en warmteberekeningen.", "ceStatus": "CE", "onderwerpen": ["Warmtetransport: geleiding, stroming, straling", "Isolatie", "Specifieke warmte: Q = c × m × ΔT"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "D", "naam": "Geluid", "code": "NASK1/K/8", "beschrijving": "Trillingen, frequentie en geluidssnelheid.", "ceStatus": "CE", "onderwerpen": ["Frequentie (f) en trillingstijd (T): f = 1 / T", "Amplitude", "Geluidssnelheid en echopeiling"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "E", "naam": "Kracht en veiligheid", "code": "NASK1/K/9", "beschrijving": "Krachten, hefbomen en beweging.", "ceStatus": "CE", "onderwerpen": ["Krachten tekenen (vectoren) en de wet van Newton", "Hefbomen en momentenwet: M = F × r", "Snelheid: s = v × t", "Reactietijd, remweg en stopafstand"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "na2", "naam": "Natuur- en scheikunde 2", "code": "NA2", "kleur": "#27AE60",
  "beschrijving": "Scheikunde: mengsels, atoombouw, reacties en zuren/basen.",
  "ceInfo": "CE over NASK2/K/4 (stoffen & materialen), K/5 (bouw van de stoffen), K/7 (verbranden & milieu) en K/10 (grondstoffen & synthese).",
  "exDatum": "2027-05-24", "exTijd": "13:30–15:30", "exDuur": "2 uur", "hulpmiddelen": "Rekenmachine, BINAS/formuleblad",
  "domeinen": [
   { "id": "A", "naam": "Stoffen en materialen in de omgeving", "code": "NASK2/K/4", "beschrijving": "Mengsels scheiden.", "ceStatus": "CE", "onderwerpen": ["Filtreren en indampen", "Destilleren en extraheren", "Chromatografie"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Bouw van de stoffen", "code": "NASK2/K/5", "beschrijving": "Atomen, moleculen en reactievergelijkingen.", "ceStatus": "CE", "onderwerpen": ["Periodiek systeem lezen", "Molecuulformules interpreteren", "Reactievergelijkingen kloppend maken"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Verbranden en milieu", "code": "NASK2/K/7", "beschrijving": "Chemische reacties en gassen aantonen.", "ceStatus": "CE", "onderwerpen": ["Volledige en onvolledige verbranding", "CO₂ aantonen met kalkwater", "Water aantonen met wit kopersulfaat"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "D", "naam": "Grondstoffen en synthese", "code": "NASK2/K/10", "beschrijving": "Zuren, basen en neutralisatie.", "ceStatus": "CE", "onderwerpen": ["pH-schaal", "Indicatoren (lakmoes, rodekoolsap)", "Neutralisatiereacties"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "bi", "naam": "Biologie", "code": "BI", "kleur": "#2ECC71",
  "beschrijving": "Cellen & erfelijkheid, ecologie, het menselijk lichaam en biotechnologie.",
  "ceInfo": "CE over BI/K/4 (cellen & erfelijkheid), BI/K/6 (planten, dieren & samenhang), BI/K/9 (het lichaam in werking) en BI/V/1 (biotechnologie, verdieping GL/TL).",
  "exDatum": "2027-05-26", "exTijd": "13:30–15:30", "exDuur": "2 uur", "hulpmiddelen": "Rekenmachine",
  "domeinen": [
   { "id": "A", "naam": "Cellen aan de basis", "code": "BI/K/4", "beschrijving": "Organisatie, plant- vs. diercel, erfelijkheid en evolutie.", "ceStatus": "CE", "onderwerpen": ["Cel, weefsel, orgaan en orgaanstelsel", "Verschil plantencel en dierlijke cel", "Chromosomen, DNA, genotype en fenotype", "Monohybride kruisingsschema's", "Natuurlijke selectie en evolutie"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Planten, dieren en hun samenhang", "code": "BI/K/6", "beschrijving": "Ecologie, voedselrelaties, kringlopen en fotosynthese.", "ceStatus": "CE", "onderwerpen": ["Voedselketens en voedselwebben", "Producenten, consumenten en reducenten", "Koolstof- en stikstofkringloop", "Fotosynthese (grondstoffen en producten)"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Het lichaam in werking", "code": "BI/K/9", "beschrijving": "Vertering & transport, gaswisseling & uitscheiding, regeling & waarneming.", "ceStatus": "CE", "onderwerpen": ["Vertering en het maag-darmstelsel", "Bloedsomloop en hart", "Gaswisseling in de longen", "Nieren, huid en uitscheiding", "Zenuwstelsel, hormonen en zintuigen (oog)"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "D", "naam": "Bio-wetenschappen en maatschappij", "code": "BI/V/1", "beschrijving": "Biotechnologie: gist, bacteriën, schimmels en genetische modificatie (verdieping GL/TL).", "ceStatus": "CE", "onderwerpen": ["Biotechnologie in voeding (gist, melkzuurbacteriën)", "Antibiotica uit schimmels", "Genetische modificatie (o.a. insuline)", "Voor- en nadelen van gm-gewassen"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "ec", "naam": "Economie", "code": "EC", "kleur": "#F39C12",
  "beschrijving": "Consumptie, arbeid & productie, internationale handel en geldwezen.",
  "ceInfo": "CE over EC/K/4 (consumptie), EC/K/5 (arbeid & productie), EC/K/7 (internationale ontwikkelingen) en EC/V/1 (geld- & bankwezen, verdieping GL/TL).",
  "exDatum": "2027-05-18", "exTijd": "13:30–15:30", "exDuur": "2 uur", "hulpmiddelen": "Rekenmachine",
  "domeinen": [
   { "id": "A", "naam": "Consumptie", "code": "EC/K/4", "beschrijving": "Budgetteren, koopkracht en verzekeren.", "ceStatus": "CE", "onderwerpen": ["Koopkracht en budgetteren", "Inflatie en indexcijfers berekenen", "De werking van verzekeringen"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Arbeid en productie", "code": "EC/K/5", "beschrijving": "Bedrijfseconomie en arbeidsmarkt.", "ceStatus": "CE", "onderwerpen": ["Verkoopprijs, omzet en btw", "Kosten en winst", "Werkloosheid en de gevolgen ervan"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Internationale ontwikkelingen", "code": "EC/K/7", "beschrijving": "Handel en internationale samenwerking.", "ceStatus": "CE", "onderwerpen": ["Import en export", "Wisselkoersen", "De Europese Unie", "Ontwikkelingssamenwerking"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "D", "naam": "Geld- en bankwezen", "code": "EC/V/1", "beschrijving": "Rente en de rol van de bank (verdieping GL/TL).", "ceStatus": "CE", "onderwerpen": ["Samengestelde interest (rente-op-rente)", "De rol van de centrale bank"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "gs", "naam": "Geschiedenis & staatsinrichting", "code": "GS", "kleur": "#D35400",
  "beschrijving": "De staatsinrichting van Nederland en de geschiedenis vanaf 1900.",
  "ceInfo": "CE over GS/K/5 (staatsinrichting van Nederland) en GS/K/10 (historisch overzicht vanaf 1900).",
  "exDatum": "2027-05-25", "exTijd": "13:30–15:30", "exDuur": "2 uur", "hulpmiddelen": "Geen",
  "domeinen": [
   { "id": "A", "naam": "Staatsinrichting van Nederland", "code": "GS/K/5", "beschrijving": "Grondwet, democratie en de rechtsstaat.", "ceStatus": "CE", "onderwerpen": ["De Grondwet en grondrechten", "De Trias Politica", "Taken van de Eerste en Tweede Kamer", "Het ontstaan van de verzorgingsstaat"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Historisch overzicht vanaf 1900", "code": "GS/K/10", "beschrijving": "Wereldoorlogen, crisis, Koude Oorlog en dekolonisatie.", "ceStatus": "CE", "onderwerpen": ["Oorzaken WOI en het interbellum", "De economische crisis van 1929 en fascisme/nazisme", "WOII: bezetting van Nederland en de Holocaust", "Koude Oorlog: NAVO vs. Warschaupact, val van de Muur", "Dekolonisatie van Indonesië en Suriname"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "ak", "naam": "Aardrijkskunde", "code": "AK", "kleur": "#3498DB",
  "beschrijving": "Weer & klimaat, arm & rijk, en grenzen & identiteit.",
  "ceInfo": "CE over AK/K/4 (weer & klimaat), AK/K/7 (arm & rijk) en AK/K/9 (grenzen & identiteit).",
  "exDatum": "2027-05-21", "exTijd": "09:00–11:00", "exDuur": "2 uur", "hulpmiddelen": "Atlas (indien toegestaan)",
  "domeinen": [
   { "id": "A", "naam": "Weer en klimaat", "code": "AK/K/4", "beschrijving": "Systeemaarde: druk, wind en klimaat.", "ceStatus": "CE", "onderwerpen": ["Lagedruk- en hogedrukgebieden", "Windsystemen en de wet van Buys Ballot", "Klimaatgrafieken lezen"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Arm en rijk", "code": "AK/K/7", "beschrijving": "Welvaartsverschillen wereldwijd.", "ceStatus": "CE", "onderwerpen": ["Ontwikkelingskenmerken (bnp per inwoner, VN-welzijnsindex)", "Centrum-periferierelaties", "Oorzaken van welvaartsverschillen"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Grenzen en identiteit", "code": "AK/K/9", "beschrijving": "Europa: migratie, cultuur en grenzen.", "ceStatus": "CE", "onderwerpen": ["Migratiestromen", "Cultuurgebieden", "Grenzen en territoriale conflicten"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 },
 {
  "id": "ma", "naam": "Maatschappijkunde", "code": "MA", "kleur": "#9B59B6",
  "beschrijving": "Politiek & beleid, criminaliteit & rechtsstaat en massamedia.",
  "ceInfo": "CE over ML2/K/4 (politiek & beleid), ML2/K/7 (criminaliteit & rechtsstaat) en ML2/K/8 (massamedia & pluriforme samenleving).",
  "exDatum": "2027-05-28", "exTijd": "13:30–15:30", "exDuur": "2 uur", "hulpmiddelen": "Geen",
  "domeinen": [
   { "id": "A", "naam": "Politiek en beleid", "code": "ML2/K/4", "beschrijving": "Politieke stromingen en besluitvorming.", "ceStatus": "CE", "onderwerpen": ["Politieke stromingen (links, rechts, liberaal, socialistisch, confessioneel)", "De route van een wetsvoorstel", "Besluitvorming en belangengroepen"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "B", "naam": "Criminaliteit en rechtsstaat", "code": "ML2/K/7", "beschrijving": "Recht, strafproces en straffen.", "ceStatus": "CE", "onderwerpen": ["Oorzaken van criminaliteit", "Het verloop van een strafproces", "Rechten van verdachten", "Soorten straffen"], "nSv": 0, "nOe": 0, "nBeg": 0 },
   { "id": "C", "naam": "Massamedia en pluriforme samenleving", "code": "ML2/K/8", "beschrijving": "Media en de multiculturele samenleving.", "ceStatus": "CE", "onderwerpen": ["Functies van de media", "Beeldvorming en manipulatie", "Censuur", "De multiculturele samenleving in Nederland"], "nSv": 0, "nOe": 0, "nBeg": 0 }
  ]
 }
];
