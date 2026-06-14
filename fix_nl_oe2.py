"""Replace nl HAVO oe arrays for domains A and E using str.replace()."""
path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

def q(bron, ctx, v, u):
    return "{bron:'" + bron + "',ctx:'" + ctx + "',v:'" + v + "',o:[''],c:0,u:'" + u + "'}"

def esc(s):
    return s.replace("'", "\\'").replace('"', '\\"')

def replace_oe(content, dom_id, dom_name, questions, next_id, next_name):
    nl_idx = content.find("{id:'nl',naam:'Nederlands'")
    gs_idx = content.find("{id:'gs',naam:'Geschiedenis'", nl_idx)
    marker = "{id:'" + dom_id + "',naam:'" + dom_name + "'"
    idx = content.find(marker, nl_idx)
    assert 0 < idx < gs_idx, f"Domain {dom_id} not found in nl"
    oe_start = content.find('   oe:[', idx)
    assert 0 < oe_start < gs_idx
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

# ── Domain A — Leesvaardigheid ────────────────────────────────────────────
a = [
    q("Artikel",
      esc("In veel Nederlandse steden groeit de discussie over de toekomst van de binnenstad. Door de opkomst van online winkelen staan steeds meer winkelpanden leeg, wat leidt tot een minder aantrekkelijk straatbeeld en afnemende bezoekersaantallen. Gemeenten zoeken naar manieren om de binnenstad nieuw leven in te blazen, bijvoorbeeld door meer ruimte te geven aan horeca, cultuur en kleinschalige ambachtelijke winkels. Tegelijkertijd willen bewoners dat de binnenstad leefbaar blijft, met voldoende groen, betaalbare woningen en veilige fietsroutes. Ondernemers pleiten juist voor meer flexibiliteit in openingstijden en lagere huren, zodat zij kunnen concurreren met grote webwinkels. De uitdaging is om een balans te vinden tussen economische vitaliteit en leefbaarheid. Sommige steden experimenteren met autoluwe zones, tijdelijke pop-upwinkels en culturele evenementen om bezoekers te trekken. Hoewel deze initiatieven vaak positief worden ontvangen, blijft de vraag hoe structureel de leegstand kan worden aangepakt. De toekomst van de binnenstad hangt af van samenwerking tussen gemeente, ondernemers en bewoners, en van de bereidheid om traditionele functies van het stadscentrum opnieuw te definiëren."),
      esc("Wat is volgens het artikel de belangrijkste uitdaging voor Nederlandse binnensteden? Leg je antwoord uit met twee elementen uit de tekst."),
      esc("De belangrijkste uitdaging is het vinden van een balans tussen economische vitaliteit en leefbaarheid. Uit de tekst blijkt dat gemeenten de binnenstad aantrekkelijk willen houden door horeca en cultuur te stimuleren, terwijl bewoners juist betaalbare woningen en veilige fietsroutes willen. Daarnaast geven ondernemers aan dat zij lagere huren en meer flexibiliteit nodig hebben om te kunnen concurreren. Deze verschillende belangen maken het moeilijk om één duidelijke koers te bepalen.")),
    q("Artikel",
      esc("Steeds meer jongeren ervaren prestatiedruk, zowel op school als in hun sociale leven. Door sociale media vergelijken zij zichzelf voortdurend met anderen, wat kan leiden tot onzekerheid en stress. Scholen proberen hierop in te spelen door aandacht te besteden aan mentale gezondheid en door leerlingen te helpen realistische doelen te stellen. Toch blijkt uit onderzoek dat veel jongeren het gevoel hebben dat falen geen optie is. Ouders spelen hierin ook een rol: zij willen het beste voor hun kinderen, maar leggen soms onbedoeld hoge verwachtingen op. Daarnaast zorgt de toenemende nadruk op cijfers en toetsen ervoor dat leerlingen het idee hebben dat hun waarde wordt bepaald door hun prestaties. Psychologen pleiten daarom voor meer aandacht voor veerkracht, zelfvertrouwen en het normaliseren van fouten maken. Volgens hen is het belangrijk dat jongeren leren dat groei voortkomt uit proberen, mislukken en opnieuw beginnen."),
      esc("Welke oorzaken van prestatiedruk onder jongeren worden in het artikel genoemd? Noem er twee en licht ze toe."),
      esc("Het artikel noemt sociale media als oorzaak, omdat jongeren zichzelf voortdurend vergelijken met anderen. Dit kan leiden tot onzekerheid en het gevoel dat ze altijd moeten presteren. Daarnaast spelen ouders een rol door hoge verwachtingen te stellen, ook al is dat vaak onbedoeld. Tot slot draagt de nadruk op cijfers en toetsen bij aan het idee dat prestaties bepalend zijn voor iemands waarde.")),
    q("Foto",
      esc("Foto-beschrijving: 'Een middelbare schoolklas waarin leerlingen zelfstandig werken aan laptops, terwijl de docent rondloopt en individuele begeleiding geeft.'"),
      esc("Leg uit hoe de situatie op de foto aansluit bij moderne opvattingen over onderwijs."),
      esc("Moderne onderwijsopvattingen benadrukken zelfstandig leren en differentiatie. De foto laat zien dat leerlingen op hun eigen tempo werken, wat past bij gepersonaliseerd onderwijs. De docent fungeert als begeleider in plaats van als traditionele kennisoverdrager. Dit sluit aan bij de trend om leerlingen meer verantwoordelijkheid te geven voor hun leerproces.")),
    q("Artikel",
      esc("De Nederlandse overheid stimuleert al jaren het gebruik van de fiets als duurzaam vervoermiddel. Fietsen is niet alleen goed voor het milieu, maar ook voor de gezondheid en de bereikbaarheid van steden. Toch blijkt uit recente onderzoeken dat veel mensen de fiets laten staan vanwege onveilige verkeerssituaties. Vooral op drukke kruispunten en rond scholen ontstaan gevaarlijke situaties door de combinatie van auto's, scooters en fietsers. Gemeenten investeren daarom in bredere fietspaden, betere verlichting en verkeerseducatie. Daarnaast wordt er gewerkt aan snelfietsroutes tussen steden, zodat forenzen sneller en veiliger kunnen reizen. Hoewel deze maatregelen positief worden ontvangen, blijft het een uitdaging om alle verkeersdeelnemers rekening met elkaar te laten houden. Verkeersveiligheid vraagt niet alleen om infrastructuur, maar ook om bewust gedrag."),
      esc("Welke twee redenen worden in het artikel genoemd waarom mensen soms toch niet voor de fiets kiezen?"),
      esc("Het artikel noemt onveilige verkeerssituaties als belangrijke reden, vooral op drukke kruispunten en rond scholen. Daarnaast speelt de drukte van andere verkeersdeelnemers zoals auto's en scooters een rol. Mensen voelen zich daardoor minder veilig en kiezen sneller voor een ander vervoermiddel.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Staafdiagram met het aantal gelezen boeken per jaar onder jongeren van 12–18 jaar tussen 2010 en 2025. De balken dalen van gemiddeld 14 boeken per jaar naar 6 boeken per jaar.'"),
      esc("Leg uit hoe de trend in de grafiek past bij ontwikkelingen in het leesgedrag van jongeren."),
      esc("De dalende trend past bij de verschuiving van jongeren naar digitale media. Jongeren besteden meer tijd aan sociale media, video's en games, waardoor lezen minder prioriteit krijgt. Ook de toegenomen schermtijd speelt een rol. Hierdoor neemt het aantal gelezen boeken structureel af.")),
]

# ── Domain E — Argumentatieve vaardigheden ────────────────────────────────
e = [
    q("Artikel",
      esc("In het debat over klimaatmaatregelen botsen verschillende belangen en overtuigingen. Voorstanders benadrukken dat snelle actie nodig is om de opwarming van de aarde te beperken en toekomstige generaties te beschermen. Zij wijzen op wetenschappelijke rapporten die aantonen dat uitstel leidt tot grotere schade en hogere kosten. Tegenstanders vrezen dat strenge maatregelen de economie schaden en dat burgers te veel moeten inleveren op comfort en vrijheid. Sommige critici vinden dat Nederland als klein land weinig invloed heeft op het wereldwijde klimaatprobleem. Voorstanders reageren dat juist gezamenlijke inspanning nodig is en dat Nederland een voorbeeldfunctie kan vervullen. Het debat draait daarom niet alleen om feiten, maar ook om waarden: verantwoordelijkheid, rechtvaardigheid en solidariteit. De uitdaging is om maatregelen te vinden die zowel effectief als maatschappelijk draagvlak hebben."),
      esc("Welke twee standpunten staan tegenover elkaar in het artikel? Leg beide standpunten kort uit."),
      esc("Voorstanders vinden dat snelle klimaatmaatregelen noodzakelijk zijn om schade te beperken en toekomstige generaties te beschermen. Zij baseren zich op wetenschappelijke rapporten en benadrukken urgentie. Tegenstanders vrezen economische schade en verlies van comfort voor burgers. Zij vinden dat Nederland weinig invloed heeft op het wereldwijde probleem. Deze twee perspectieven botsen in het debat.")),
    q("Foto",
      esc("Foto-beschrijving: 'Een politicus die tijdens een debat in de Tweede Kamer spreekt, terwijl andere Kamerleden aantekeningen maken en luisteren.'"),
      esc("Leg uit welke argumentatiestructuur vaak voorkomt in politieke debatten en hoe deze op de foto past."),
      esc("In politieke debatten wordt vaak gebruikgemaakt van voor- en nadelenargumentatie. Politici wegen verschillende belangen af om hun standpunt te onderbouwen. De foto toont een spreker die zijn argumenten presenteert, terwijl anderen luisteren en beoordelen. Dit past bij de manier waarop politieke besluitvorming plaatsvindt.")),
    q("Artikel",
      esc("Steeds meer scholen voeren een smartphoneverbod in om de concentratie van leerlingen te verbeteren. Voorstanders stellen dat telefoons afleiden en zorgen voor slechtere schoolprestaties. Zij verwijzen naar onderzoeken die aantonen dat multitasken leidt tot minder effectieve verwerking van informatie. Tegenstanders vinden dat een verbod te ver gaat en dat scholen leerlingen juist moeten leren omgaan met digitale middelen. Bovendien gebruiken sommige docenten smartphones voor educatieve apps en interactieve opdrachten. De discussie draait daarom om de vraag of een verbod de beste oplossing is, of dat begeleiding en duidelijke afspraken effectiever zijn. Uiteindelijk moeten scholen een balans vinden tussen rust in de klas en het benutten van technologische mogelijkheden."),
      esc("Welke twee argumenten gebruiken voorstanders van een smartphoneverbod volgens het artikel?"),
      esc("Voorstanders vinden dat smartphones afleiden en leiden tot slechtere concentratie. Ze verwijzen naar onderzoeken die aantonen dat multitasken de informatieverwerking vermindert. Hierdoor zouden leerlingen beter presteren zonder telefoon in de klas.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Lijngrafiek met het aantal verkeersslachtoffers onder fietsers tussen 2000 en 2025. De lijn daalt tot 2012 en stijgt daarna weer licht.'"),
      esc("Leg uit hoe deze grafiek gebruikt kan worden in een betoog over verkeersveiligheid."),
      esc("De grafiek laat zien dat de verkeersveiligheid voor fietsers eerst verbeterde maar daarna weer verslechterde. Dit kan worden gebruikt om te betogen dat extra maatregelen nodig zijn. De stijging na 2012 ondersteunt het argument dat huidige maatregelen onvoldoende zijn. De grafiek fungeert zo als feitelijk bewijs in een betoog.")),
    q("Artikel",
      esc("In discussies over studiefinanciering komen vaak tegengestelde belangen naar voren. Studenten vinden dat de kosten van studeren te hoog zijn en dat schulden hen beperken in hun toekomst. Zij pleiten voor een basisbeurs die studeren toegankelijker maakt. De overheid wijst erop dat onderwijs veel geld kost en dat studenten later profiteren van hogere inkomens. Daarom vinden beleidsmakers dat een eigen bijdrage redelijk is. Tegelijkertijd erkennen zij dat de huidige schuldenlast problematisch kan zijn. De kern van het debat draait om de vraag wie verantwoordelijk is voor de kosten van onderwijs: de student, de samenleving of een combinatie van beide. Het vinden van een rechtvaardige verdeling blijft een uitdaging."),
      esc("Welke twee perspectieven op studiefinanciering worden in het artikel genoemd? Leg beide uit."),
      esc("Studenten vinden dat studeren te duur is en dat schulden hun toekomst beperken. Zij pleiten daarom voor een basisbeurs. De overheid benadrukt dat onderwijs kostbaar is en dat studenten later profiteren van hogere inkomens. Daarom vinden zij een eigen bijdrage logisch. Deze twee perspectieven staan tegenover elkaar.")),
]

print("Replacing nl HAVO oe arrays...")
c = replace_oe(c, 'A', 'Leesvaardigheid', a, 'B', 'Mondelinge taalvaardigheid')
c = replace_oe(c, 'E', 'Argumentatieve vaardigheden', e, 'F', 'Literatuur')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

with open(path, 'r', encoding='utf-8') as f:
    v = f.read()
nl_idx = v.find("{id:'nl',naam:'Nederlands'")
gs_idx = v.find("{id:'gs',naam:'Geschiedenis'", nl_idx)
nl_sec = v[nl_idx:gs_idx]
for dom, naam in [('A','Leesvaardigheid'), ('E','Argumentatieve vaardigheden')]:
    idx = nl_sec.find("{id:'" + dom + "',naam:'" + naam + "'")
    oe_i = nl_sec.find('   oe:[', idx)
    nxt = nl_sec.find('\n  {id:', oe_i)
    block = nl_sec[oe_i:nxt if nxt > 0 else len(nl_sec)]
    print(f"  Domain {dom}: {block.count('{bron:')} questions, double-bracket={block.count(chr(10)+'   ]'+chr(10)+'   ]')}")
