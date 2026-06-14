"""Replace ec HAVO oe arrays for domains B, C, D, E."""
path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

def q(bron, ctx, v, u):
    return "{bron:'" + bron + "',ctx:'" + ctx + "',v:'" + v + "',o:[''],c:0,u:'" + u + "'}"

def esc(s):
    return s.replace("'", "\\'").replace('"', '\\"')

def replace_oe(content, dom_id, dom_name, questions, next_id, next_name):
    ec_idx = content.find("{id:'ec',naam:'Economie'")
    end_idx = content.find(']};', ec_idx)  # ec is last vak
    marker = "{id:'" + dom_id + "',naam:'" + dom_name + "'"
    idx = content.find(marker, ec_idx)
    assert 0 < idx < end_idx, f"Domain {dom_id} ({dom_name}) not found in ec"
    oe_start = content.find('   oe:[', idx)
    assert 0 < oe_start < end_idx
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

# ── Domain B — Concept Schaarste ─────────────────────────────────────────────
b = [
    q("Artikel",
      esc("De prijzen van dagelijkse boodschappen zijn de afgelopen jaren sterk gestegen, wat consumenten dwingt bewuster keuzes te maken. Supermarkten reageren hierop door meer aanbiedingen te gebruiken en huismerken prominenter in de schappen te plaatsen. Veel consumenten stappen over op goedkopere alternatieven, waardoor de vraag naar A-merken daalt. Producenten van deze merken proberen hun positie te behouden door te investeren in marketing, kwaliteitsverbetering en loyaliteitsprogramma's. Tegelijkertijd spelen grondstofprijzen een grote rol: wanneer de kosten van energie, transport of landbouwproducten stijgen, worden deze kosten vaak doorberekend aan de consument. Hierdoor ontstaat een ketenreactie waarbij producenten, supermarkten en consumenten voortdurend op elkaar reageren. De markt voor dagelijkse boodschappen laat zien hoe prijselasticiteit, concurrentie en consumentengedrag elkaar beïnvloeden."),
      esc("Leg uit hoe stijgende kosten bij producenten kunnen leiden tot veranderingen in het koopgedrag van consumenten."),
      esc("Wanneer producenten hogere kosten hebben, stijgen de verkoopprijzen. Consumenten reageren hierop door goedkopere alternatieven te zoeken. Hierdoor neemt de vraag naar A-merken af en stijgt de vraag naar huismerken. Dit laat zien dat consumenten prijsgevoelig zijn. De keten van kostenstijgingen beïnvloedt dus direct het koopgedrag.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Lijngrafiek met de vraag naar A-merken en huismerken tussen 2015 en 2025. A-merken dalen licht, huismerken stijgen sterk.'"),
      esc("Leg uit hoe de trend in de grafiek past bij prijselasticiteit van de vraag."),
      esc("De daling van A-merken laat zien dat consumenten reageren op hogere prijzen. De stijging van huismerken toont dat zij overstappen naar goedkopere alternatieven. Dit past bij een elastische vraag: consumenten veranderen hun gedrag wanneer prijzen stijgen. De grafiek ondersteunt dit duidelijk.")),
    q("Artikel",
      esc("Veel bedrijven gebruiken prijsdiscriminatie om hun omzet te vergroten. Dit betekent dat dezelfde dienst of hetzelfde product tegen verschillende prijzen wordt aangeboden aan verschillende groepen consumenten. Denk aan bioscopen die lagere prijzen rekenen voor studenten of ouderen, of luchtvaartmaatschappijen die hogere prijzen vragen tijdens vakantieperiodes. Het doel is om consumenten met een hogere betalingsbereidheid meer te laten betalen, terwijl prijsgevoelige groepen toch worden bediend. Digitale platforms maken prijsdiscriminatie nog eenvoudiger, omdat bedrijven steeds meer gegevens verzamelen over koopgedrag en voorkeuren. Hierdoor kunnen prijzen dynamisch worden aangepast op basis van vraag, tijdstip of klantprofiel."),
      esc("Leg uit waarom bedrijven prijsdiscriminatie toepassen."),
      esc("Bedrijven passen prijsdiscriminatie toe om hun omzet te verhogen. Ze laten consumenten met een hogere betalingsbereidheid meer betalen. Tegelijk bedienen ze prijsgevoelige groepen met lagere prijzen. Hierdoor vergroten ze hun totale afzet. Digitale data maakt dit proces nog efficiënter.")),
    q("Foto",
      esc("Foto-beschrijving: 'Schap in een supermarkt met A-merken bovenaan en huismerken op ooghoogte prominent gepresenteerd.'"),
      esc("Leg uit hoe schapindeling invloed heeft op consumentengedrag."),
      esc("Producten op ooghoogte worden sneller gekozen. Supermarkten plaatsen daarom huismerken op strategische plekken. Hierdoor stijgt de verkoop van deze producten. De indeling beïnvloedt dus direct het koopgedrag van consumenten.")),
    q("Artikel",
      esc("Door de groei van online winkelen is de concurrentie tussen webshops enorm toegenomen. Consumenten vergelijken prijzen eenvoudig via vergelijkingssites, waardoor bedrijven gedwongen worden scherp te prijzen. Tegelijkertijd spelen bezorgkosten en levertijd een steeds grotere rol in de keuze van consumenten. Bedrijven investeren daarom in efficiënte logistiek en snelle levering. De markt wordt gekenmerkt door lage marges en hoge volumes, waardoor schaalvoordelen belangrijk zijn. Grote spelers kunnen hierdoor goedkoper werken dan kleine webshops, wat leidt tot verdere concentratie in de markt."),
      esc("Leg uit waarom schaalvoordelen belangrijk zijn voor webshops."),
      esc("Schaalvoordelen zorgen voor lagere kosten per product. Grote webshops kunnen goedkoper inkopen en efficiënter bezorgen. Hierdoor kunnen zij lagere prijzen aanbieden. Dit maakt het moeilijk voor kleine webshops om te concurreren. Schaalvoordelen bepalen dus de marktpositie.")),
]

# ── Domain C — Markt ──────────────────────────────────────────────────────────
c_qs = [
    q("Artikel",
      esc("De arbeidsmarkt verandert snel door technologische ontwikkelingen zoals automatisering en digitalisering. Veel routinematige banen verdwijnen of veranderen, terwijl nieuwe functies ontstaan in de IT-sector, zorg en techniek. Werkgevers hebben moeite om personeel te vinden met de juiste vaardigheden, waardoor tekorten ontstaan in cruciale sectoren. Tegelijkertijd groeit de groep flexwerkers, die minder zekerheden hebben maar meer vrijheid ervaren. Overheden proberen werknemers te stimuleren zich om te scholen, zodat zij beter kunnen inspelen op veranderingen. De dynamiek op de arbeidsmarkt laat zien hoe vraag en aanbod voortdurend verschuiven door economische en technologische ontwikkelingen."),
      esc("Leg uit hoe technologische ontwikkelingen kunnen leiden tot zowel werkloosheid als nieuwe werkgelegenheid."),
      esc("Automatisering vervangt routinematige banen, waardoor werkloosheid kan ontstaan. Tegelijk ontstaan nieuwe banen in sectoren zoals IT en techniek. Werknemers moeten zich aanpassen aan nieuwe vaardigheden. Hierdoor verdwijnen sommige banen, maar komen er ook nieuwe bij.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Staafdiagram met personeelstekorten in zorg, techniek en onderwijs tussen 2010 en 2025. Alle drie de sectoren laten een sterke stijging zien.'"),
      esc("Leg uit waarom personeelstekorten vooral ontstaan in sectoren zoals zorg en techniek."),
      esc("Deze sectoren vragen om specifieke vaardigheden. De opleidingstrajecten zijn lang en complex. Tegelijk groeit de vraag door vergrijzing en technologische ontwikkelingen. Hierdoor ontstaan structurele tekorten.")),
    q("Artikel",
      esc("Productiviteit is een belangrijke factor voor economische groei. Wanneer werknemers meer produceren in dezelfde tijd, stijgt de totale output van een bedrijf. Innovatie, scholing en efficiënte werkprocessen dragen bij aan hogere productiviteit. Bedrijven investeren daarom in technologie en training om hun concurrentiepositie te versterken. Tegelijkertijd kan hoge werkdruk negatieve effecten hebben op motivatie en gezondheid, wat de productiviteit juist verlaagt. Een balans tussen efficiëntie en welzijn is daarom essentieel."),
      esc("Leg uit hoe scholing kan bijdragen aan hogere arbeidsproductiviteit."),
      esc("Scholing zorgt ervoor dat werknemers nieuwe vaardigheden leren. Hierdoor kunnen zij efficiënter werken. Ook kunnen zij beter omgaan met nieuwe technologie. Dit verhoogt de productiviteit van het bedrijf. Scholing versterkt dus de concurrentiepositie.")),
    q("Foto",
      esc("Foto-beschrijving: 'Productielijn in een fabriek waar robots en mensen samen werken aan assemblage.'"),
      esc("Leg uit hoe automatisering de arbeidsproductiviteit beïnvloedt."),
      esc("Automatisering neemt repetitieve taken over. Hierdoor kunnen werknemers zich richten op complexere taken. Robots werken snel en nauwkeurig, wat de productie verhoogt. De combinatie van mens en machine verhoogt de totale productiviteit.")),
    q("Artikel",
      esc("De loonkosten spelen een grote rol in de concurrentiepositie van bedrijven. Wanneer lonen stijgen, worden producten duurder om te produceren. Bedrijven kunnen dit compenseren door efficiënter te werken of door prijzen te verhogen. In internationale markten kan een te hoge loonstijging leiden tot verlies van concurrentiekracht. Tegelijkertijd zijn hogere lonen belangrijk voor koopkracht en economische groei. De uitdaging is om een balans te vinden tussen betaalbare arbeid voor bedrijven en voldoende inkomen voor werknemers."),
      esc("Leg uit waarom te hoge loonkosten de concurrentiepositie van bedrijven kunnen verzwakken."),
      esc("Hoge loonkosten maken productie duurder. Hierdoor moeten bedrijven hogere prijzen vragen. Dit maakt hen minder aantrekkelijk op internationale markten. Concurrenten met lagere kosten kunnen goedkoper produceren. Daarom verzwakken hoge loonkosten de concurrentiepositie.")),
]

# ── Domain D — Overheid en bestuur ───────────────────────────────────────────
d = [
    q("Artikel",
      esc("De overheid speelt een belangrijke rol in het functioneren van markten. Door belastingen, subsidies en regelgeving probeert zij marktfalen te voorkomen. Een bekend voorbeeld is milieuschade: bedrijven houden in hun prijzen geen rekening met de negatieve effecten van vervuiling. De overheid kan dit corrigeren door vervuilende activiteiten te belasten of duurzame alternatieven te subsidiëren. Ook bij monopolies grijpt de overheid in om consumenten te beschermen tegen te hoge prijzen. Daarnaast zorgt zij voor publieke goederen zoals straatverlichting en dijken, die niet door de markt worden geleverd. Overheidsingrijpen is dus essentieel om markten eerlijk en efficiënt te laten functioneren."),
      esc("Leg uit waarom de overheid ingrijpt bij negatieve externe effecten."),
      esc("Negatieve externe effecten worden niet meegenomen in de marktprijs. Hierdoor ontstaat overproductie van vervuilende activiteiten. De overheid corrigeert dit met belastingen of regels. Zo worden de maatschappelijke kosten beter verdeeld. Dit zorgt voor een efficiëntere markt.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Aanbod- en vraagcurve met een minimumprijs boven het evenwicht, waardoor een aanbodoverschot ontstaat.'"),
      esc("Leg uit waarom een minimumprijs kan leiden tot een aanbodoverschot."),
      esc("Een minimumprijs ligt boven de evenwichtsprijs. Hierdoor willen producenten meer aanbieden. Consumenten kopen echter minder door de hogere prijs. Het verschil tussen aanbod en vraag vormt een overschot. Dit is een direct gevolg van prijsregulering.")),
    q("Artikel",
      esc("Belastingen zijn een belangrijk instrument voor de overheid om inkomsten te genereren en gedrag te beïnvloeden. Accijnzen op tabak en alcohol moeten consumptie ontmoedigen, terwijl btw een brede belasting is op consumptie. De hoogte van belastingen beïnvloedt het besteedbaar inkomen van huishoudens. Wanneer belastingen stijgen, daalt de koopkracht, wat gevolgen heeft voor de totale vraag in de economie. Tegelijk gebruikt de overheid belastinginkomsten om publieke voorzieningen te financieren, zoals onderwijs, zorg en infrastructuur."),
      esc("Leg uit hoe hogere belastingen de koopkracht van huishoudens beïnvloeden."),
      esc("Hogere belastingen verlagen het besteedbaar inkomen. Huishoudens kunnen daardoor minder goederen en diensten kopen. Dit vermindert hun koopkracht. De totale vraag in de economie kan hierdoor dalen. Belastingen hebben dus directe invloed op consumptie.")),
    q("Foto",
      esc("Foto-beschrijving: 'Een marktplein met verschillende kraampjes en een bord waarop staat: \\'Subsidie op duurzame producten\\'.'"),
      esc("Leg uit hoe subsidies de marktuitkomst kunnen beïnvloeden."),
      esc("Subsidies verlagen de prijs voor consumenten. Hierdoor stijgt de vraag naar duurzame producten. Producenten worden gestimuleerd om meer te produceren. De markt verschuift richting duurzamere keuzes. Subsidies corrigeren zo marktfalen.")),
    q("Artikel",
      esc("Monopolies kunnen ontstaan wanneer één bedrijf een groot marktaandeel heeft of wanneer toetreding tot de markt moeilijk is. Dit kan leiden tot hoge prijzen en weinig innovatie. De overheid houdt toezicht via mededingingsautoriteiten die kartels opsporen en fusies beoordelen. Door concurrentie te stimuleren probeert de overheid markten efficiënt te houden. In sommige sectoren, zoals energie en spoorwegen, blijft regulering noodzakelijk omdat natuurlijke monopolies moeilijk te vermijden zijn."),
      esc("Leg uit waarom de overheid toezicht houdt op monopolies."),
      esc("Monopolies kunnen te hoge prijzen vragen. Consumenten hebben dan weinig keuze. Ook kan innovatie afnemen door gebrek aan concurrentie. De overheid beschermt consumenten door toezicht te houden. Zo blijft de markt eerlijker en efficiënter.")),
]

# ── Domain E — Goede tijden, slechte tijden ──────────────────────────────────
e = [
    q("Artikel",
      esc("De wereldeconomie is sterk met elkaar verbonden door handel, investeringen en internationale productieketens. Veel producten worden in verschillende landen gemaakt: grondstoffen uit Afrika, onderdelen uit Azië en assemblage in Europa. Deze globalisering biedt kansen voor economische groei, maar maakt landen ook afhankelijk van elkaar. Wanneer één schakel in de keten uitvalt, bijvoorbeeld door een pandemie of geopolitieke spanningen, kunnen productieprocessen wereldwijd stilvallen. Tegelijkertijd profiteren landen van specialisatie: ieder land produceert waar het relatief goed in is. Hierdoor stijgt de totale welvaart. De uitdaging is om de voordelen van globalisering te benutten zonder te kwetsbaar te worden."),
      esc("Leg uit hoe specialisatie bijdraagt aan internationale handel."),
      esc("Specialisatie betekent dat landen produceren waar ze relatief goed in zijn. Hierdoor kunnen ze efficiënter produceren. Landen ruilen deze producten met elkaar. Dit verhoogt de totale welvaart. Specialisatie vormt dus de basis van internationale handel.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Lijngrafiek met wisselkoers euro-dollar tussen 2010 en 2025. De koers schommelt tussen 1,05 en 1,35.'"),
      esc("Leg uit hoe een dalende euro invloed heeft op de export van Nederland."),
      esc("Een dalende euro maakt Nederlandse producten goedkoper voor het buitenland. Hierdoor stijgt de export. Buitenlandse kopers kunnen meer kopen voor dezelfde hoeveelheid dollars. Een zwakkere euro versterkt dus de concurrentiepositie van exportbedrijven.")),
    q("Artikel",
      esc("Ontwikkelingslanden proberen hun economie te versterken door te investeren in onderwijs, infrastructuur en industrie. Internationale organisaties zoals de Wereldbank en het IMF bieden leningen en advies om deze ontwikkeling te ondersteunen. Tegelijkertijd zijn veel landen afhankelijk van de export van grondstoffen, waardoor hun economie kwetsbaar is voor prijsschommelingen. Diversificatie is daarom belangrijk: door meer sectoren te ontwikkelen wordt de economie stabieler. Handelsovereenkomsten kunnen helpen om toegang te krijgen tot internationale markten, maar brengen ook verplichtingen met zich mee."),
      esc("Leg uit waarom afhankelijkheid van grondstoffen een risico vormt voor ontwikkelingslanden."),
      esc("Grondstofprijzen schommelen sterk. Wanneer prijzen dalen, dalen de inkomsten van het land. Hierdoor ontstaat economische instabiliteit. Landen die weinig andere sectoren hebben, zijn extra kwetsbaar. Diversificatie maakt de economie stabieler.")),
    q("Foto",
      esc("Foto-beschrijving: 'Containerschepen in de haven van Rotterdam met stapels containers uit verschillende landen.'"),
      esc("Leg uit waarom havens zoals Rotterdam belangrijk zijn voor de Nederlandse economie."),
      esc("Rotterdam is een toegangspoort tot Europa. Goederen worden snel doorgevoerd naar het achterland. Dit levert veel werkgelegenheid op. Ook versterkt het de positie van Nederland in internationale handel. Havens zijn dus cruciaal voor de economie.")),
    q("Artikel",
      esc("De Europese Unie speelt een belangrijke rol in de economie van Nederland. Door de interne markt kunnen goederen, diensten, kapitaal en personen vrij bewegen. Dit vergroot de handel tussen lidstaten en maakt productie efficiënter. Bedrijven profiteren van een grotere afzetmarkt en minder handelsbarrières. Tegelijkertijd brengt EU-lidmaatschap verplichtingen met zich mee, zoals bijdragen aan de begroting en naleving van regels. De voordelen van samenwerking wegen voor Nederland zwaar, omdat de economie sterk afhankelijk is van internationale handel."),
      esc("Leg uit waarom Nederland veel voordeel heeft van de interne markt van de EU."),
      esc("De interne markt maakt handel eenvoudiger en goedkoper. Bedrijven hebben toegang tot een grote afzetmarkt. Er zijn minder handelsbarrières en regels zijn gelijk. Hierdoor kan Nederland efficiënter produceren en meer exporteren. De economie profiteert sterk van EU-samenwerking.")),
]

print("Replacing ec HAVO oe arrays (B, C, D, E)...")
c = replace_oe(c, 'B', 'Concept Schaarste', b, 'C', 'Markt')
c = replace_oe(c, 'C', 'Markt', c_qs, 'D', 'Overheid en bestuur')
c = replace_oe(c, 'D', 'Overheid en bestuur', d, 'E', 'Goede tijden, slechte tijden')
c = replace_oe(c, 'E', 'Goede tijden, slechte tijden', e, None, None)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

with open(path, 'r', encoding='utf-8') as f:
    v = f.read()
ec_idx = v.find("{id:'ec',naam:'Economie'")
be_idx = v.find("{id:'be',naam:'Bedrijfseconomie'", ec_idx)
ec_sec = v[ec_idx:be_idx]
for dom, naam in [('B','Concept Schaarste'), ('C','Markt'), ('D','Overheid en bestuur'), ('E','Goede tijden, slechte tijden')]:
    idx = ec_sec.find("{id:'" + dom + "',naam:'" + naam + "'")
    oe_i = ec_sec.find('   oe:[', idx)
    nxt = ec_sec.find('\n  {id:', oe_i)
    block = ec_sec[oe_i:nxt if nxt > 0 else len(ec_sec)]
    print(f"  Domain {dom}: {block.count('{bron:')} questions, double-bracket={block.count(chr(10)+'   ]'+chr(10)+'   ]')}")
