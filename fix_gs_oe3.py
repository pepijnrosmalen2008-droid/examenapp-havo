"""Replace gs HAVO oe arrays for domains A and B (updated content with full ctx)."""
path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

S = '\\n'

def q(bron, ctx, v, u):
    return "{bron:'" + bron + "',ctx:'" + ctx + "',v:'" + v + "',o:[''],c:0,u:'" + u + "'}"

def replace_oe(content, dom_id, dom_name, questions, next_id, next_name):
    gs_idx = content.find("{id:'gs',naam:'Geschiedenis'")
    ak_idx = content.find("{id:'ak',naam:'Aardrijkskunde'", gs_idx)
    marker = "{id:'" + dom_id + "',naam:'" + dom_name + "'"
    idx = content.find(marker, gs_idx)
    assert 0 < idx < ak_idx, f"Domain {dom_id} not found in gs"
    oe_start = content.find('   oe:[', idx)
    assert 0 < oe_start < ak_idx
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

# helpers
def esc(s):
    return s.replace("'", "\\'")

# ── Domain A — Historisch besef ───────────────────────────────────────────
a = [
    q("Artikel",
      esc("In 1945 eindigde de Tweede Wereldoorlog en begon een periode waarin de wereldorde ingrijpend veranderde. De Verenigde Staten en de Sovjet-Unie kwamen als twee dominante supermachten uit de oorlog, elk met een eigen ideologie en invloedssfeer. Europa lag in puin en was economisch afhankelijk van buitenlandse hulp, waardoor de VS via het Marshallplan een belangrijke rol kreeg in de wederopbouw. Tegelijkertijd groeide de spanning tussen de kapitalistische en communistische blokken, wat leidde tot de Koude Oorlog. In Azië en Afrika ontstonden sterke onafhankelijkheidsbewegingen, omdat koloniale machten verzwakt waren en hun grip op de kolonies verloren. De oprichting van de Verenigde Naties moest zorgen voor internationale samenwerking en het voorkomen van nieuwe conflicten. Door deze ontwikkelingen wordt 1945 gezien als een keerpunt dat de politieke, economische en sociale verhoudingen wereldwijd blijvend veranderde."),
      "Leg uit waarom 1945 wordt gezien als een keerpunt in de wereldgeschiedenis.",
      esc("1945 wordt gezien als een keerpunt omdat de Tweede Wereldoorlog eindigde en een nieuwe machtsverdeling ontstond. De VS en de Sovjet-Unie werden de leidende supermachten, wat de basis vormde voor de Koude Oorlog. Europa werd economisch afhankelijk van Amerikaanse steun via het Marshallplan. Tegelijkertijd leidde de verzwakking van koloniale machten tot wereldwijde dekolonisatie. De oprichting van de VN veranderde bovendien de manier waarop landen samenwerkten.")),
    q("Foto",
      esc("Foto-beschrijving: 'De Berlijnse Muur in 1961, met Oost-Duitse grenssoldaten die prikkeldraad uitrollen terwijl West-Berlijners toekijken vanaf de andere kant van de straat.'"),
      "Leg uit waarom de bouw van de Berlijnse Muur een symbool werd van de Koude Oorlog.",
      esc("De Berlijnse Muur symboliseerde de scherpe scheiding tussen het communistische Oosten en het kapitalistische Westen. De Muur maakte de politieke en ideologische tegenstelling zichtbaar in het dagelijks leven. Hij stopte de massale vlucht van Oost-Duitsers naar het Westen, wat de spanning tussen beide blokken vergrootte. De Muur werd wereldwijd gezien als het fysieke bewijs van onderdrukking en verdeeldheid. Hierdoor groeide hij uit tot hét icoon van de Koude Oorlog.")),
    q("Artikel",
      esc("De Industriële Revolutie veranderde vanaf de achttiende eeuw het dagelijks leven ingrijpend. Door de introductie van stoommachines konden fabrieken veel sneller en goedkoper produceren dan ambachtslieden. Dit leidde tot massale urbanisatie, omdat arbeiders naar steden trokken om in fabrieken te werken. De nieuwe fabrieksarbeid bracht echter zware omstandigheden met zich mee: lange werkdagen, lage lonen en gevaarlijke machines waren de norm. Kinderarbeid kwam veel voor, omdat kinderen goedkoop waren en kleine handen hadden die in machines pasten. Tegelijkertijd zorgde de groeiende productie voor meer welvaart en een grotere beschikbaarheid van goederen. De Industriële Revolutie bracht dus zowel economische vooruitgang als sociale problemen, die later leidden tot hervormingen en vakbonden."),
      "Leg uit hoe de Industri\xeble Revolutie zowel vooruitgang als problemen veroorzaakte.",
      esc("De Industriële Revolutie zorgde voor hogere productie en economische groei. Goederen werden goedkoper en toegankelijker voor een groter deel van de bevolking. Tegelijk ontstonden slechte arbeidsomstandigheden, zoals lange werkdagen en gevaarlijke machines. Kinderarbeid en vervuilde steden waren grote sociale problemen. Hierdoor gingen economische vooruitgang en sociale misstanden hand in hand.")),
    q("Kaart",
      esc("Kaart-beschrijving: 'Europa tijdens de Franse Revolutie en Napoleontische oorlogen. Frankrijk is donkerblauw, bondgenoten lichtblauw en vijanden rood gemarkeerd. Pijlen tonen de verspreiding van Franse legers tussen 1792 en 1812.'"),
      "Leg uit waarom de Franse Revolutie wordt gezien als een breukmoment in de Europese politieke geschiedenis.",
      esc("De Franse Revolutie maakte een einde aan het absolutisme en introduceerde ideeën over vrijheid en gelijkheid. Deze ideeën verspreidden zich door Europa via oorlogen en hervormingen. Veel landen namen later grondwetten en burgerrechten over. Hierdoor veranderde de politieke structuur van Europa blijvend. De Revolutie vormde de basis voor moderne democratische principes.")),
    q("Artikel",
      esc("Na 1945 ontstond in Afrika een krachtige dekolonisatiebeweging. Europese landen waren economisch verzwakt door de oorlog en konden hun kolonies niet langer effectief besturen. In veel Afrikaanse gebieden groeiden nationalistische bewegingen die streefden naar zelfbeschikking en onafhankelijkheid. Ghana werd in 1957 het eerste Afrikaanse land dat onafhankelijk werd, gevolgd door tientallen andere landen in de jaren zestig. De onafhankelijkheidsprocessen verliepen niet overal vreedzaam: in Algerije en Kenia leidde verzet tot bloedige conflicten. Internationale organisaties zoals de Verenigde Naties ondersteunden het recht op onafhankelijkheid, wat de beweging verder versterkte. De dekolonisatie veranderde de wereldkaart ingrijpend en leidde tot de vorming van nieuwe staten met eigen politieke systemen."),
      "Leg uit hoe de Tweede Wereldoorlog heeft bijgedragen aan de dekolonisatiegolf na 1945.",
      esc("Europese koloniale machten waren na de oorlog economisch en militair verzwakt. Hierdoor konden zij hun kolonies minder goed controleren. Tegelijk groeiden nationalistische bewegingen die onafhankelijkheid eisten. De VS en de VN steunden het principe van zelfbeschikking. Hierdoor konden veel Afrikaanse landen in korte tijd onafhankelijk worden.")),
]

# ── Domain B — Oriëntatiekennis ───────────────────────────────────────────
b = [
    q("Artikel",
      esc("De Verenigde Oost-Indische Compagnie (VOC) groeide in de zeventiende eeuw uit tot een van de machtigste handelsorganisaties ter wereld. Vanuit Amsterdam vertrokken schepen naar Azië om specerijen, zijde, thee en porselein te verhandelen. De VOC richtte handelsposten op langs belangrijke zeeroutes en gebruikte haar militaire macht om concurrenten te weren. Batavia, het huidige Jakarta, werd het bestuurlijke centrum van het handelsnetwerk. De winsten uit de handel stroomden terug naar de Republiek en versterkten de positie van Amsterdam als financieel centrum. Tegelijkertijd maakte de VOC gebruik van dwangarbeid en geweld om haar monopolie te behouden. De organisatie speelde een grote rol in de economische bloei van de Gouden Eeuw, maar liet ook een erfenis van uitbuiting en koloniale overheersing achter."),
      "Leg uit hoe de VOC bijdroeg aan de economische positie van de Republiek in de 17e eeuw.",
      esc("De VOC verdiende enorme winsten met de handel in Aziatische producten. Deze winsten versterkten de financiële positie van Amsterdam. De VOC beschikte over een eigen vloot en leger, waardoor zij handelsroutes kon beschermen. Hierdoor werd de Republiek een belangrijke economische macht. De organisatie droeg zo direct bij aan de welvaart van de Gouden Eeuw.")),
    q("Foto",
      esc("Foto-beschrijving: 'Loopgraven aan het Westfront in 1916, met modder, prikkeldraad, ingestorte schuilplaatsen en rook van artilleriebeschietingen.'"),
      "Leg uit waarom de Eerste Wereldoorlog wordt gezien als een totale oorlog.",
      esc("Bij een totale oorlog worden hele samenlevingen ingezet voor de strijd. Industrieën produceren massaal wapens en burgers lijden onder tekorten. Nieuwe wapens zoals gifgas en tanks maakten de oorlog zeer destructief. Ook niet-militaire doelen werden geraakt. Hierdoor was de impact veel groter dan bij eerdere conflicten.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Werkloosheid in Duitsland 1929–1933. De lijn stijgt van 1,3 miljoen naar 6 miljoen werklozen, met de sterkste stijging tussen 1931 en 1932.'"),
      "Leg uit hoe de economische crisis van 1929 bijdroeg aan de opkomst van het nationaalsocialisme.",
      esc("De massawerkloosheid zorgde voor wantrouwen in de democratische regering. Veel Duitsers verloren hun spaargeld en toekomstperspectief. De NSDAP beloofde herstel, werk en nationale trots. Hierdoor zagen veel mensen de partij als een oplossing voor hun problemen. De crisis creëerde zo de voedingsbodem voor Hitlers machtsgreep.")),
    q("Kaart",
      esc("Kaart-beschrijving: 'Europa tijdens de Koude Oorlog. NAVO-landen blauw, Warschaupact-landen rood. Duitsland is verdeeld, Berlijn gemarkeerd als gesplitste stad.'"),
      "Leg uit waarom Europa tijdens de Koude Oorlog verdeeld raakte in twee invloedssferen.",
      esc("Na 1945 wilden de VS en de Sovjet-Unie hun ideologie verspreiden. De VS steunden kapitalistische democratieën, terwijl de Sovjet-Unie communistische regimes installeerde. Hierdoor ontstonden twee blokken met eigen militaire allianties. De Berlijnse Muur werd het symbool van deze scheiding. Europa werd zo het centrum van de Koude Oorlog.")),
    q("Foto",
      esc("Foto-beschrijving: 'Protestmars van de Amerikaanse burgerrechtenbeweging in 1963, met borden waarop \"End segregation\" en \"Equal rights now\" staat.'"),
      "Leg uit hoe de burgerrechtenbeweging past binnen het tijdvak van televisie en computer.",
      esc("Televisie verspreidde beelden van geweld tegen demonstranten door het hele land. Hierdoor groeide de publieke steun voor gelijke rechten. De beweging leidde tot belangrijke wetten zoals de Civil Rights Act. Massamedia speelden een cruciale rol in bewustwording en politieke druk. Dit past bij een tijdvak waarin informatie sneller en breder werd verspreid.")),
]

print("Replacing gs HAVO oe arrays (updated content)...")
c = replace_oe(c, 'A', 'Historisch besef', a, 'B', 'Oriëntatiekennis')
c = replace_oe(c, 'B', 'Oriëntatiekennis', b, 'C', "Thema\\'s")

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

with open(path, 'r', encoding='utf-8') as f:
    v = f.read()
gs_idx = v.find("{id:'gs',naam:'Geschiedenis'")
ak_idx = v.find("{id:'ak',naam:'Aardrijkskunde'", gs_idx)
gs_sec = v[gs_idx:ak_idx]
for dom, naam in [('A','Historisch besef'), ('B','Oriëntatiekennis')]:
    idx = gs_sec.find("{id:'" + dom + "',naam:'" + naam + "'")
    oe_i = gs_sec.find('   oe:[', idx)
    nxt = gs_sec.find('\n  {id:', oe_i)
    block = gs_sec[oe_i:nxt if nxt > 0 else len(gs_sec)]
    print(f"  Domain {dom}: {block.count('{bron:')} questions, double-bracket={block.count(chr(10)+'   ]'+chr(10)+'   ]')}")
