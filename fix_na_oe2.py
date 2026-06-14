"""Replace na HAVO oe arrays for domains B, C, D with updated content."""
path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

S = '\\n'

def q(bron, ctx, v, u):
    return "{bron:'" + bron + "',ctx:'" + ctx + "',v:'" + v + "',o:[''],c:0,u:'" + u + "'}"

def esc(s):
    return s.replace("'", "\\'").replace('"', '\\"')

def replace_oe(content, dom_id, dom_name, questions, next_id, next_name):
    na_idx = content.find("{id:'na',naam:'Natuurkunde'")
    be_idx = content.find("{id:'be',naam:'Bedrijfseconomie'", na_idx)
    marker = "{id:'" + dom_id + "',naam:'" + dom_name + "'"
    idx = content.find(marker, na_idx)
    assert 0 < idx < be_idx, f"Domain {dom_id} not found in na"
    oe_start = content.find('   oe:[', idx)
    assert 0 < oe_start < be_idx
    if next_id:
        close_marker = '\n   ]},\n  {' + "id:'" + next_id + "',naam:'" + next_name + "'"
    else:
        for cm in ['\n   ]}\n ]},', '\n   ]}\n ]}', '\n   ]},\n ]}']:
            if content.find(cm, oe_start) >= 0:
                close_marker = cm
                break
        else:
            raise AssertionError(f"No close marker for {dom_id}")
    close_idx = content.find(close_marker, oe_start)
    assert close_idx >= 0, f"Close marker not found for {dom_id}"
    new_oe = '   oe:[\n' + ',\n'.join(questions)
    old_len = len(content[oe_start:close_idx])
    result = content[:oe_start] + new_oe + content[close_idx:]
    print(f"  {dom_id}: replaced {old_len} chars with {len(new_oe)} chars")
    return result

# ── Domain B — Golven ─────────────────────────────────────────────────────
b = [
    q("Artikel",
      esc("In moderne concertzalen wordt veel aandacht besteed aan akoestiek, omdat de manier waarop geluidsgolven zich door de ruimte bewegen sterk bepaalt hoe bezoekers muziek ervaren. Geluidsgolven weerkaatsen tegen wanden, plafonds en stoelen, en deze reflecties kunnen zowel gewenst als storend zijn. Ontwerpers gebruiken daarom materialen die geluid deels absorberen, zoals stoffen panelen, en materialen die geluid juist reflecteren, zoals hout of metaal. Door een zorgvuldige combinatie ontstaat een evenwicht tussen helderheid en warmte in het geluid. Een te kale zaal zorgt voor harde echo's, terwijl een te zachte zaal het geluid dof maakt. Daarnaast spelen interferentie en nagalm een belangrijke rol: wanneer geluidsgolven elkaar versterken of uitdoven, kan dit de klankkleur beïnvloeden. Moderne zalen worden daarom ontworpen met computermodellen die voorspellen hoe geluid zich zal gedragen. Hierdoor kunnen ontwerpers al vóór de bouw bepalen waar reflectoren, panelen en diffusers moeten komen om de optimale luisterervaring te creëren."),
      esc("Leg uit waarom zowel absorptie als reflectie nodig zijn voor goede akoestiek in een concertzaal."),
      esc("Absorptie voorkomt dat geluid te lang blijft hangen, waardoor nagalm wordt beperkt. Reflectie zorgt ervoor dat geluid gelijkmatig door de zaal wordt verspreid. Zonder reflectie klinkt muziek dof en zonder absorptie ontstaat juist echo. De combinatie zorgt voor een helder en gebalanceerd geluidsbeeld. Daarom zijn beide processen essentieel voor goede akoestiek.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Frequentiespectrum van een viooltoon met een sterke piek op 440 Hz en meerdere kleinere pieken op 880 Hz, 1320 Hz en 1760 Hz.'"),
      esc("Leg uit waarom een viooltoon meerdere pieken in het frequentiespectrum heeft."),
      esc("Een vioolsnaar trilt niet alleen in de grondfrequentie, maar ook in hogere harmonischen. Deze boventonen ontstaan door verschillende trillingsmodi van de snaar. De combinatie van grondtoon en boventonen bepaalt de klankkleur van het instrument. Daarom verschijnen meerdere pieken in het frequentiespectrum.")),
    q("Foto",
      esc("Foto-beschrijving: 'Watergolven in een golfbak die door een smalle opening gaan en zich daarna waaiervormig verspreiden.'"),
      esc("Leg uit waarom de golven zich waaiervormig verspreiden na de opening."),
      esc("Wanneer golven door een opening gaan die kleiner is dan enkele golflengtes, treedt diffractie op. Hierdoor buigen de golven af en verspreiden ze zich in meerdere richtingen. Dit effect is sterker bij grotere golflengtes. Daarom ontstaat een waaiervormig patroon achter de opening.")),
    q("Artikel",
      esc("Röntgenstraling wordt al meer dan een eeuw gebruikt om botten en weefsels zichtbaar te maken, maar de manier waarop deze straling door het lichaam gaat verschilt sterk per materiaal. Botten bevatten veel calcium, een element met een hoge dichtheid dat röntgenstraling sterk absorbeert. Zacht weefsel daarentegen laat een groot deel van de straling door, waardoor het op een röntgenfoto donkerder verschijnt. De werking van röntgenfoto's berust op dit contrast: hoe meer straling wordt tegengehouden, hoe lichter het gebied op de foto. Moderne röntgenapparatuur gebruikt nauwkeurige bundels en digitale detectoren om de stralingsdosis zo laag mogelijk te houden. Daarnaast worden filters gebruikt om schadelijke lage-energiestraling te verwijderen. Door deze technologische verbeteringen zijn röntgenfoto's veiliger en gedetailleerder geworden, terwijl het basisprincipe hetzelfde is gebleven."),
      esc("Leg uit waarom botten duidelijk zichtbaar zijn op een röntgenfoto."),
      esc("Botten bevatten veel calcium, dat röntgenstraling sterk absorbeert. Hierdoor bereikt minder straling de detector achter het lichaam. Op de foto verschijnen botten daarom licht. Zacht weefsel laat meer straling door en wordt donkerder. Het contrast tussen absorptie en doorgelaten straling maakt botten goed zichtbaar.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Intensiteit van licht achter een dubbele spleet met afwisselende maxima en minima.'"),
      esc("Leg uit hoe het interferentiepatroon ontstaat."),
      esc("Lichtgolven uit beide spleten overlappen elkaar. Waar de golven in fase zijn, versterken ze elkaar en ontstaat een maximum. Waar ze tegenfase hebben, doven ze elkaar uit en ontstaat een minimum. Dit leidt tot het karakteristieke interferentiepatroon.")),
]

# ── Domain C — Beweging en wisselwerking ──────────────────────────────────
C = [
    q("Artikel",
      esc("Moderne auto's maken gebruik van een groot aantal sensoren om de veiligheid en het rijcomfort te verbeteren. Een van de meest gebruikte sensoren is de ultrasone afstandssensor, die werkt met geluidsgolven met een frequentie boven het menselijk gehoor. De sensor zendt een korte puls uit die terugkaatst tegen een object, waarna de auto meet hoe lang het duurt voordat de echo terugkomt. Omdat de snelheid van geluid bekend is, kan de afstand eenvoudig worden berekend. Deze techniek wordt gebruikt voor parkeersystemen, automatische remhulpen en dodehoekdetectie. De nauwkeurigheid hangt af van factoren zoals temperatuur, luchtvochtigheid en de vorm van het object. Ondanks deze beperkingen zijn ultrasone sensoren betrouwbaar en goedkoop, waardoor ze in vrijwel elke moderne auto te vinden zijn."),
      esc("Leg uit hoe een ultrasone sensor de afstand tot een object bepaalt."),
      esc("De sensor zendt een ultrasone puls uit die terugkaatst tegen een object. De tijd tussen uitzenden en ontvangen wordt gemeten. Met de formule s = v·t/2 wordt de afstand berekend. De deling door twee is nodig omdat het signaal heen en terug reist. Zo bepaalt de sensor nauwkeurig de afstand.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Snelheid-tijd grafiek: versnellen van 0 naar 20 m/s in 5 s, constant rijden 10 s, afremmen naar 0 in 4 s.'"),
      "(a) Bereken de versnelling tijdens de eerste 5 seconden." + S + "(b) Bereken de totale afgelegde afstand.",
      esc("(a) De versnelling is Δv/Δt = 20/5 = 4 m/s². (b) Tijdens versnellen: 0,5·5·20 = 50 m. Tijdens constante snelheid: 20·10 = 200 m. Tijdens remmen: 0,5·4·20 = 40 m. Totaal: 290 m.")),
    q("Foto",
      esc("Foto-beschrijving: 'Een skater die een helling afgaat met een meetlat op de achtergrond.'"),
      esc("Leg uit waarom de snelheid van de skater toeneemt tijdens het afdalen."),
      esc("Tijdens het afdalen wordt zwaarte-energie omgezet in bewegingsenergie. De component van de zwaartekracht langs de helling zorgt voor een versnelling. Wrijving is kleiner dan deze kracht, waardoor de skater versnelt. Daarom neemt de snelheid toe.")),
    q("Artikel",
      esc("Bij botsproeven onderzoeken fabrikanten hoe auto's reageren op frontale en zijdelingse botsingen. Een belangrijk onderdeel van moderne auto's is de kreukelzone: een deel van de carrosserie dat speciaal is ontworpen om gecontroleerd in te deuken. Door deze vervorming wordt de tijd waarin de auto tot stilstand komt verlengd, waardoor de kracht op de inzittenden kleiner wordt. Dit principe is gebaseerd op de impulswet: hoe langer de remtijd, hoe kleiner de kracht. Kreukelzones absorberen bovendien een groot deel van de energie die vrijkomt bij een botsing. Hierdoor blijft de passagiersruimte zoveel mogelijk intact. Dankzij deze techniek zijn auto's de afgelopen decennia veel veiliger geworden."),
      esc("Leg uit waarom kreukelzones de veiligheid van inzittenden vergroten."),
      esc("Kreukelzones vergroten de tijd waarin de auto tot stilstand komt. Hierdoor wordt de kracht op inzittenden kleiner volgens F = Δp/Δt. De energie wordt geabsorbeerd door vervorming van de carrosserie. Daardoor blijft de passagiersruimte beter intact. Dit vermindert de kans op ernstig letsel.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Kracht als functie van uitrekking van een veer: rechte lijn door de oorsprong.'"),
      esc("Leg uit wat deze grafiek zegt over de veer en noem de bijbehorende natuurkundige wet."),
      esc("De rechte lijn toont dat kracht en uitrekking recht evenredig zijn. De veer gedraagt zich elastisch. De bijbehorende wet is de wet van Hooke: F = C·u. Dit betekent dat de veerconstante C bepaalt hoe stug de veer is.")),
]

# ── Domain D — Lading en veld ─────────────────────────────────────────────
d = [
    q("Artikel",
      esc("Bliksem ontstaat door elektrische ladingen die zich ophopen in onweerswolken. Door wrijving tussen ijskristallen en waterdruppels scheiden positieve en negatieve ladingen zich van elkaar. De onderkant van de wolk wordt meestal negatief geladen, terwijl de bovenkant positief wordt. Hierdoor ontstaat een groot potentiaalverschil tussen wolk en aarde. Wanneer dit verschil te groot wordt, ioniseert de lucht en ontstaat een geleidende baan. De elektrische ontlading die volgt noemen we bliksem. De temperatuur in het bliksemkanaal kan oplopen tot 30.000 graden Celsius, waardoor de lucht explosief uitzet en donder ontstaat. Bliksem is dus een gevolg van ladingverdeling en elektrische velden in de atmosfeer."),
      esc("Leg uit hoe ladingverdeling in een onweerswolk leidt tot bliksem."),
      esc("Door wrijving scheiden positieve en negatieve ladingen zich in de wolk. Hierdoor ontstaat een groot potentiaalverschil tussen wolk en aarde. Wanneer dit verschil te groot wordt, ioniseert de lucht. Er ontstaat een geleidende baan waardoor een ontlading kan plaatsvinden. Dit noemen we bliksem.")),
    q("Tabel",
      esc("Tabel-beschrijving: 'Spanning en stroomsterkte van vier weerstanden, met verschillende U- en I-waarden.'"),
      esc("Leg uit hoe je met de tabel kunt bepalen welke weerstand de grootste waarde heeft."),
      esc("Volgens de wet van Ohm geldt R = U/I. De weerstand met de grootste verhouding tussen spanning en stroomsterkte heeft de grootste waarde. Door de waarden per weerstand te vergelijken, bepaal je welke het grootst is.")),
    q("Foto",
      esc("Foto-beschrijving: 'Elektrisch circuit met batterij, lampje en schakelaar. De schakelaar staat open.'"),
      esc("Leg uit waarom het lampje uitgaat wanneer de schakelaar wordt geopend."),
      esc("Bij een open schakelaar wordt de stroomkring onderbroken. Hierdoor kan er geen elektrische stroom meer lopen. Zonder stroom krijgt het lampje geen energie. Daarom gaat het uit.")),
    q("Artikel",
      esc("Elektriciteit wordt over grote afstanden getransporteerd via hoogspanningslijnen. Door de spanning te verhogen, kan hetzelfde vermogen worden geleverd met een lagere stroomsterkte. Dit is belangrijk omdat warmteverlies in kabels wordt veroorzaakt door de stroomsterkte: hoe hoger de stroom, hoe meer energie verloren gaat als warmte. Door op hoge spanning te transporteren, blijven deze verliezen beperkt. Transformatoren spelen hierbij een cruciale rol: zij verhogen de spanning bij het transport en verlagen deze weer bij de gebruiker. Dankzij dit systeem kan elektriciteit efficiënt over honderden kilometers worden vervoerd."),
      esc("Leg uit waarom elektriciteit over grote afstanden met hoge spanning wordt getransporteerd."),
      esc("Bij hoge spanning is de stroomsterkte kleiner voor hetzelfde vermogen. Hierdoor zijn de verliezen door warmteontwikkeling kleiner, omdat Pverlies = I²·R. Het transport wordt daardoor efficiënter. Transformatoren maken het mogelijk om de spanning te verhogen en later weer te verlagen.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Elektrisch vermogen als functie van stroomsterkte bij constante spanning: rechte lijn door de oorsprong.'"),
      esc("Leg uit waarom het vermogen toeneemt bij grotere stroomsterkte."),
      esc("Het vermogen wordt gegeven door P = U·I. Bij constante spanning is het vermogen recht evenredig met de stroomsterkte. Daarom stijgt het vermogen wanneer de stroomsterkte toeneemt.")),
]

print("Replacing na HAVO oe arrays (B, C, D only — E was incomplete)...")
c = replace_oe(c, 'B', 'Golven', b, 'C', 'Beweging en wisselwerking')
c = replace_oe(c, 'C', 'Beweging en wisselwerking', C, 'D', 'Lading en veld')
c = replace_oe(c, 'D', 'Lading en veld', d, 'E', 'Straling en materie')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

with open(path, 'r', encoding='utf-8') as f:
    v = f.read()
na_idx = v.find("{id:'na',naam:'Natuurkunde'")
be_idx = v.find("{id:'be',naam:'Bedrijfseconomie'", na_idx)
na_sec = v[na_idx:be_idx]
for dom, naam in [('B','Golven'), ('C','Beweging en wisselwerking'), ('D','Lading en veld')]:
    idx = na_sec.find("{id:'" + dom + "',naam:'" + naam + "'")
    oe_i = na_sec.find('   oe:[', idx)
    nxt = na_sec.find('\n  {id:', oe_i)
    block = na_sec[oe_i:nxt if nxt > 0 else len(na_sec)]
    print(f"  Domain {dom}: {block.count('{bron:')} questions, double-bracket={block.count(chr(10)+'   ]'+chr(10)+'   ]')}")
