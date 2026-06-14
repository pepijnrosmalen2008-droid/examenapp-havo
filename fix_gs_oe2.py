"""Replace gs HAVO oe arrays for domains A and B using str.replace()."""
path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

S = '\\n'

def q(bron, ctx, v, o, u):
    return "{bron:'" + bron + "',ctx:'" + ctx + "',v:'" + v + "',o:[''],c:0,u:'" + u + "'}"

def replace_oe(content, dom_id, dom_name, questions, next_id, next_name):
    gs_idx = content.find("{id:'gs',naam:'Geschiedenis'")
    ak_idx = content.find("{id:'ak',naam:'Aardrijkskunde'", gs_idx)
    assert gs_idx >= 0 and ak_idx >= 0

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
            raise AssertionError(f"No close marker found for last domain {dom_id}")

    close_idx = content.find(close_marker, oe_start)
    assert close_idx >= 0, f"Close marker not found for {dom_id}: {repr(close_marker[:50])}"

    new_oe = '   oe:[\n' + ',\n'.join(questions)
    old = content[oe_start:close_idx]
    result = content[:oe_start] + new_oe + content[close_idx:]
    print(f"  {dom_id}: replaced {len(old)} chars with {len(new_oe)} chars")
    return result

# ── Domain A — Historisch besef ───────────────────────────────────────────
a = [
    q("Artikel – fictief (2026)",
      "Artikel (\xb1380 woorden): \\'De wereld na 1945: een nieuwe orde\\'. Het artikel beschrijft hoe de VS en de Sovjet-Unie als supermachten uit de Tweede Wereldoorlog kwamen. Foto-beschrijving: \\'Zwart-witfoto van de conferentie van Potsdam met Churchill, Truman en Stalin aan een tafel\\'.",
      "Leg uit waarom 1945 wordt gezien als een keerpunt in de wereldgeschiedenis.",
      "",
      "1945 markeert het einde van de Tweede Wereldoorlog en het begin van een nieuwe machtsverdeling. De VS en de Sovjet-Unie werden de dominante supermachten, wat leidde tot de Koude Oorlog. Kolonies begonnen onafhankelijk te worden, waardoor het wereldsysteem veranderde. Daarnaast werd de VN opgericht om internationale samenwerking te bevorderen. Hierdoor begon een nieuwe periode van geopolitieke spanningen \xe9n internationale instituties."),
    q("Foto-beschrijving – fictief",
      "Foto: \\'De Berlijnse Muur in 1961, met Oost-Duitse grenssoldaten die prikkeldraad uitrollen terwijl West-Berlijners toekijken\\'.",
      "Leg uit waarom de bouw van de Berlijnse Muur een symbool werd van de Koude Oorlog.",
      "",
      "De Muur maakte de scheiding tussen Oost en West zichtbaar en fysiek. Hij stopte de massale vlucht van Oost-Duitsers naar het Westen, wat de politieke spanning vergrootte. De Muur symboliseerde de strijd tussen communisme en kapitalisme. Daarnaast liet hij zien dat de Sovjet-Unie bereid was harde maatregelen te nemen om haar invloedssfeer te behouden."),
    q("Artikel – fictief (2026)",
      "Artikel (\xb1320 woorden): \\'De Industri\xeble Revolutie en het dagelijks leven\\'. Het artikel beschrijft hoe fabrieken, stoommachines en urbanisatie het leven van arbeiders veranderden. Foto-beschrijving: \\'Fabriekshal uit 1880 met stoommachines en arbeiders in lange rijen\\'.",
      "Leg uit hoe de Industri\xeble Revolutie zowel vooruitgang als problemen veroorzaakte.",
      "",
      "De Industri\xeble Revolutie zorgde voor hogere productie en economische groei. Nieuwe machines maakten goederen goedkoper en toegankelijker. Tegelijk ontstonden slechte arbeidsomstandigheden, lange werkdagen en kinderarbeid. Door snelle urbanisatie ontstonden vervuilde en overvolle steden. Hierdoor gingen vooruitgang en sociale problemen hand in hand."),
    q("Kaartbeschrijving – fictief",
      "Kaart: \\'Europa tijdens de Franse Revolutie en Napoleontische oorlogen\\'. Frankrijk is donkerblauw, bondgenoten lichtblauw, vijanden rood.",
      "Leg uit waarom de Franse Revolutie wordt gezien als een breukmoment in de Europese politieke geschiedenis.",
      "",
      "De Franse Revolutie maakte een einde aan het absolutisme en introduceerde idee\xebn over vrijheid, gelijkheid en volkssoevereiniteit. Deze idee\xebn verspreidden zich door Europa via oorlogen en hervormingen. Veel landen namen later grondwetten en burgerrechten over. Hierdoor veranderde de politieke structuur van Europa blijvend."),
    q("Artikel – fictief (2026)",
      "Artikel (\xb1360 woorden): \\'Dekolonisatie in Afrika: van kolonie naar natiestaat\\'. Het artikel beschrijft de onafhankelijkheid van Ghana, Kenia en Algerije. Foto-beschrijving: \\'Onafhankelijkheidsviering in Accra, 1957, met vlaggen en dansende mensen\\'.",
      "Leg uit hoe de Tweede Wereldoorlog heeft bijgedragen aan de dekolonisatiegolf na 1945.",
      "",
      "Koloniale machten waren economisch en militair verzwakt na de oorlog. Tegelijk groeiden nationalistische bewegingen in kolonies, die zelfbeschikking eisten. De VS en de VN steunden het principe van onafhankelijkheid. Hierdoor konden veel Afrikaanse landen in korte tijd onafhankelijk worden."),
]

# ── Domain B — Oriëntatiekennis ───────────────────────────────────────────
b = [
    q("Artikel – fictief (2026)",
      "Artikel (\xb1350 woorden): \\'De VOC als wereldspeler\\'. Het artikel beschrijft handelsposten, specerijenhandel en de rol van Batavia. Kaartbeschrijving: \\'Kaart met VOC-routes tussen Amsterdam, Kaapstad, Batavia en Japan\\'.",
      "Leg uit hoe de VOC bijdroeg aan de economische positie van de Republiek in de 17e eeuw.",
      "",
      "De VOC had een monopolie op handel in Aziatische producten, wat enorme winsten opleverde. Deze winsten versterkten Amsterdam als financi\xebl centrum. De VOC beschikte over een eigen vloot en leger, waardoor zij handelsroutes kon beschermen. Hierdoor werd de Republiek een belangrijke economische macht."),
    q("Foto-beschrijving – fictief",
      "Foto: \\'Loopgraven aan het Westfront in 1916, met modder, prikkeldraad en artillerierook\\'.",
      "Leg uit waarom de Eerste Wereldoorlog wordt gezien als een totale oorlog.",
      "",
      "Bij een totale oorlog worden hele samenlevingen ingezet voor de strijd. Industrie\xebn produceren massaal wapens en burgers lijden onder tekorten. Nieuwe wapens zoals gifgas en tanks maakten de oorlog zeer destructief. Hierdoor werd de impact veel groter dan bij eerdere conflicten."),
    q("Grafiekbeschrijving – fictief",
      "Grafiek: \\'Werkloosheid in Duitsland 1929–1933\\'. De lijn stijgt van 1,3 miljoen naar 6 miljoen werklozen.",
      "Leg uit hoe de economische crisis van 1929 bijdroeg aan de opkomst van het nationaalsocialisme.",
      "",
      "De massawerkloosheid zorgde voor wantrouwen in de democratische regering. De NSDAP beloofde herstel, werk en nationale trots. Veel Duitsers zagen de partij als een oplossing voor hun problemen. Hierdoor kreeg Hitler brede steun en kon hij in 1933 de macht grijpen."),
    q("Kaartbeschrijving – fictief",
      "Kaart: \\'Europa tijdens de Koude Oorlog\\'. NAVO-landen blauw, Warschaupact-landen rood.",
      "Leg uit waarom Europa tijdens de Koude Oorlog verdeeld raakte in twee invloedssferen.",
      "",
      "Na 1945 wilden de VS en de Sovjet-Unie hun ideologie verspreiden. De VS steunden kapitalistische democratie\xebn, terwijl de Sovjet-Unie communistische regimes installeerde. Hierdoor ontstonden twee blokken met eigen militaire allianties. De Muur in Berlijn werd het symbool van deze scheiding."),
    q("Foto-beschrijving – fictief",
      "Foto: \\'Protestmars van de Amerikaanse burgerrechtenbeweging in 1963 met borden \\'End segregation\\'.\\'",
      "Leg uit hoe de burgerrechtenbeweging past binnen het tijdvak van televisie en computer.",
      "",
      "Televisie verspreidde beelden van geweld tegen demonstranten door het hele land. Hierdoor groeide de publieke steun voor gelijke rechten. De beweging leidde tot belangrijke wetten zoals de Civil Rights Act. Massamedia speelden een cruciale rol in bewustwording en politieke druk."),
]

print("Replacing gs HAVO oe arrays...")
c = replace_oe(c, 'A', 'Historisch besef', a, 'B', 'Oriëntatiekennis')
c = replace_oe(c, 'B', 'Oriëntatiekennis', b, 'C', "Thema\\'s")

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

# Verify
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
    bron_count = block.count('{bron:')
    double = block.count('   ]\n   ]')
    print(f"  Domain {dom}: {bron_count} questions, double-bracket={double}")
