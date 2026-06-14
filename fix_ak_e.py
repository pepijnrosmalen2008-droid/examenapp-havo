"""Replace ak HAVO oe array for domain E (Leefomgeving) with full ctx content."""
path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

def q(bron, ctx, v, u):
    return "{bron:'" + bron + "',ctx:'" + ctx + "',v:'" + v + "',o:[''],c:0,u:'" + u + "'}"

def esc(s):
    return s.replace("'", "\\'").replace('"', '\\"')

def replace_oe(content, dom_id, dom_name, questions, next_id, next_name):
    ak_idx = content.find("{id:'ak',naam:'Aardrijkskunde'")
    ec_idx = content.find("{id:'ec',naam:'Economie'", ak_idx)
    marker = "{id:'" + dom_id + "',naam:'" + dom_name + "'"
    idx = content.find(marker, ak_idx)
    assert 0 < idx < ec_idx, f"Domain {dom_id} not found in ak"
    oe_start = content.find('   oe:[', idx)
    assert 0 < oe_start < ec_idx
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

e = [
    q("Artikel",
      esc("De Randstad vormt het belangrijkste economische kerngebied van Nederland en speelt een centrale rol in zowel nationale als internationale netwerken. De regio omvat de vier grote steden Amsterdam, Rotterdam, Den Haag en Utrecht, die samen een dichtbevolkt gebied vormen met een sterke concentratie van bedrijven, kennisinstellingen en logistieke knooppunten. Schiphol behoort tot de grootste luchthavens van Europa en fungeert als toegangspoort voor internationale handel en toerisme. De Rotterdamse haven is een van de grootste zeehavens ter wereld en vormt een cruciale schakel in de doorvoer van goederen naar het Europese achterland. Door deze combinatie van infrastructuur, ligging en economische diversiteit trekt de Randstad veel buitenlandse bedrijven aan. Tegelijkertijd staat de regio onder druk door woningtekorten, verkeerscongestie en milieuproblemen. Overheden proberen deze uitdagingen aan te pakken met investeringen in openbaar vervoer, duurzame energie en woningbouw, maar de vraag naar ruimte blijft groot. De Randstad blijft daardoor een gebied waar economische kansen en ruimtelijke problemen nauw met elkaar verbonden zijn."),
      esc("Leg uit waarom de Randstad een belangrijk economisch kerngebied is."),
      esc("De Randstad heeft een gunstige ligging met sterke internationale verbindingen. Schiphol en de Rotterdamse haven spelen een grote rol in handel en transport. Veel bedrijven vestigen zich in de regio vanwege de goede infrastructuur. Hierdoor ontstaat een concentratie van economische activiteiten. Dit maakt de Randstad het belangrijkste kerngebied van Nederland.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Lijngrafiek met het aantal verkeersbewegingen op de A12 tussen 1990 en 2025. De lijn stijgt van 60.000 naar 140.000 voertuigen per dag.'"),
      esc("Leg uit waarom verkeersdrukte een groeiend probleem is in Nederlandse stedelijke regio's."),
      esc("Door bevolkingsgroei neemt het aantal reizigers toe. Veel mensen zijn afhankelijk van de auto, waardoor snelwegen overbelast raken. De grafiek laat zien dat het verkeer blijft toenemen. Dit leidt tot files, luchtvervuiling en langere reistijden. Daarom is verkeersdrukte een groeiend probleem.")),
    q("Artikel",
      esc("Natuurgebieden in Nederland staan onder druk door de grote vraag naar ruimte voor wonen, werken en infrastructuur. Door de beperkte oppervlakte van het land komen natuur en menselijke activiteiten steeds dichter bij elkaar te liggen. Vooral stikstofuitstoot vormt een groot probleem: veel natuurgebieden zijn gevoelig voor verzuring en vermesting, waardoor planten en dieren verdwijnen. Tegelijkertijd is er een grote behoefte aan nieuwe woningen, vooral in stedelijke regio's. Overheden proberen een balans te vinden tussen economische groei en natuurbehoud, maar dit leidt vaak tot politieke discussies en juridische procedures. Herstelprojecten, zoals het aanleggen van nieuwe natuur en het verminderen van stikstofuitstoot, moeten de biodiversiteit beschermen. Toch blijft de ruimte schaars en de druk op natuurgebieden groot."),
      esc("Leg uit waarom natuurgebieden in Nederland onder druk staan."),
      esc("Door woningbouw, landbouw en infrastructuur is er weinig ruimte voor natuur. Stikstofuitstoot tast kwetsbare ecosystemen aan. Hierdoor neemt de biodiversiteit af. De vraag naar ruimte blijft groeien. Daarom staan natuurgebieden onder druk.")),
    q("Kaart",
      esc("Kaart-beschrijving: 'Kaart van Nederland met overstromingsrisico\\'s. Lage gebieden in West-Nederland zijn donkerblauw gemarkeerd als hoog risico, hogere zandgronden in het oosten lichtgekleurd als laag risico.'"),
      esc("Leg uit waarom vooral West-Nederland kwetsbaar is voor overstromingen."),
      esc("Veel gebieden in West-Nederland liggen onder zeeniveau. Ze zijn afhankelijk van dijken en gemalen. Door zeespiegelstijging neemt het risico toe. Daarnaast wonen er veel mensen, waardoor de schade groot kan zijn. Daarom is West-Nederland extra kwetsbaar.")),
    q("Artikel",
      esc("De woningcrisis in Nederland is de afgelopen jaren sterk toegenomen door een combinatie van bevolkingsgroei, beperkte bouwlocaties en stijgende grondprijzen. Vooral in stedelijke regio's zoals de Randstad is de vraag naar woningen veel groter dan het aanbod. Dit leidt tot hoge prijzen, lange wachttijden voor huurwoningen en een groeiende groep mensen die geen betaalbare woning kan vinden. De beperkte ruimte maakt het moeilijk om snel nieuwe woonwijken te bouwen, omdat natuur, landbouw en infrastructuur ook ruimte nodig hebben. Overheden proberen dit op te lossen door binnenstedelijk te verdichten, nieuwe bouwlocaties aan te wijzen en regels te versoepelen. Toch blijft het een uitdaging om voldoende woningen te bouwen zonder de leefbaarheid en natuur verder onder druk te zetten."),
      esc("Leg uit waarom de woningcrisis in Nederland een ruimtelijk probleem is."),
      esc("Er is weinig ruimte voor nieuwbouw, vooral in stedelijke regio's. Tegelijk groeit de bevolking en neemt de vraag naar woningen toe. Hierdoor stijgen prijzen en ontstaan tekorten. De beperkte ruimte zorgt voor spanningen tussen wonen, natuur en infrastructuur. Daarom is de woningcrisis een ruimtelijk probleem.")),
]

print("Replacing ak HAVO domain E...")
c = replace_oe(c, 'E', 'Leefomgeving', e, None, None)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

with open(path, 'r', encoding='utf-8') as f:
    v = f.read()
ak_idx = v.find("{id:'ak',naam:'Aardrijkskunde'")
ec_idx = v.find("{id:'ec',naam:'Economie'", ak_idx)
ak_sec = v[ak_idx:ec_idx]
idx = ak_sec.find("{id:'E',naam:'Leefomgeving'")
oe_i = ak_sec.find('   oe:[', idx)
block = ak_sec[oe_i:]
print(f"  Domain E: {block.count('{bron:')} questions, double-bracket={block.count(chr(10)+'   ]'+chr(10)+'   ]')}")
