"""Replace ak HAVO oe arrays for domains B, C, D with updated content."""
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

# ── Domain B — Wereld ─────────────────────────────────────────────────────
b = [
    q("Artikel",
      esc("In veel snelgroeiende wereldsteden neemt de ruimtelijke ongelijkheid sterk toe. Terwijl moderne zakencentra worden gevuld met internationale bedrijven, luxe appartementen en hoogwaardige infrastructuur, leven miljoenen mensen in uitgestrekte sloppenwijken zonder toegang tot basisvoorzieningen. Deze ongelijkheid wordt versterkt door globalisering: bedrijven vestigen zich vooral in goed bereikbare en economisch aantrekkelijke delen van de stad, waardoor investeringen zich concentreren in een beperkt gebied. Tegelijkertijd groeit de bevolking sneller dan de overheid voorzieningen kan uitbreiden, wat leidt tot informele nederzettingen aan de stadsrand. De kloof tussen arm en rijk is niet alleen zichtbaar in woonomstandigheden, maar ook in toegang tot onderwijs, gezondheidszorg en werkgelegenheid. Veel steden proberen deze ongelijkheid te verminderen door infrastructuurprojecten, sociale woningbouw en betere openbaarvervoersverbindingen. Toch blijft het een uitdaging om alle inwoners te laten profiteren van economische groei, vooral in steden waar migratie en bevolkingsgroei blijven toenemen."),
      esc("Leg uit hoe globalisering kan leiden tot ruimtelijke ongelijkheid in wereldsteden."),
      esc("Globalisering trekt internationale bedrijven aan die zich vooral vestigen in economisch aantrekkelijke delen van de stad. Hierdoor ontstaan moderne zakencentra met veel investeringen. Tegelijkertijd profiteren arme wijken nauwelijks van deze groei. Door snelle bevolkingsgroei ontstaan informele nederzettingen zonder voorzieningen. Zo ontstaat een sterke ruimtelijke scheiding tussen rijke en arme gebieden.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Lijngrafiek met de groei van megasteden wereldwijd tussen 1980 en 2025. De lijn stijgt van 5 megasteden naar 34 megasteden.'"),
      esc("Leg uit hoe de groei van megasteden samenhangt met urbanisatie in ontwikkelingslanden."),
      esc("Urbanisatie zorgt ervoor dat steeds meer mensen naar steden trekken op zoek naar werk en voorzieningen. In ontwikkelingslanden groeit de bevolking snel, waardoor steden explosief uitbreiden. Hierdoor ontstaan steeds meer megasteden. De grafiek laat deze trend duidelijk zien.")),
    q("Foto",
      esc("Foto-beschrijving: 'Luchtfoto van een stad met een luxe zakencentrum naast een uitgestrekte sloppenwijk.'"),
      esc("Leg uit hoe deze foto ruimtelijke segregatie laat zien."),
      esc("De foto toont een duidelijk contrast tussen rijke en arme wijken. Het zakencentrum heeft moderne gebouwen en goede infrastructuur. De sloppenwijk bestaat uit dicht op elkaar gebouwde huizen zonder voorzieningen. Dit laat zien dat bevolkingsgroepen met verschillende inkomens gescheiden leven.")),
    q("Artikel",
      esc("Migratie speelt een grote rol in de groei van steden in zowel ontwikkelde als ontwikkelingslanden. Veel mensen trekken van het platteland naar de stad vanwege betere kansen op werk, onderwijs en gezondheidszorg. Deze trek wordt versterkt door mechanisatie in de landbouw, waardoor minder arbeidskrachten nodig zijn. Tegelijkertijd ontstaan in steden informele sectoren waar migranten laagbetaalde banen vinden. Hoewel migratie economische groei kan stimuleren, leidt het ook tot druk op huisvesting, infrastructuur en voorzieningen. Overheden proberen dit op te vangen met stadsuitbreidingsprojecten en investeringen in openbaar vervoer, maar de groei gaat vaak sneller dan de planning. Hierdoor ontstaan nieuwe vormen van ruimtelijke ongelijkheid."),
      esc("Leg uit waarom migratie zowel voordelen als problemen veroorzaakt voor snelgroeiende steden."),
      esc("Migratie zorgt voor meer arbeidskrachten en economische groei. Migranten vullen vaak banen in de informele sector. Tegelijkertijd ontstaat druk op huisvesting en infrastructuur. De overheid kan deze groei vaak niet bijbenen. Hierdoor ontstaan nieuwe ongelijkheden in de stad.")),
    q("Kaart",
      esc("Kaart-beschrijving: 'Kaart van Afrika met pijlen die migratiestromen naar Europa tonen via Libië, Marokko en Turkije.'"),
      esc("Leg uit hoe economische verschillen migratiestromen tussen Afrika en Europa beïnvloeden."),
      esc("Grote inkomensverschillen vormen een belangrijke push-pullfactor. Gebrek aan werk en armoede duwen mensen weg uit Afrika. Hogere lonen en betere voorzieningen trekken hen naar Europa. Hierdoor ontstaan sterke migratiestromen langs de routes op de kaart.")),
]

# ── Domain C — Aarde ──────────────────────────────────────────────────────
C = [
    q("Artikel",
      esc("Het Middellandse Zeegebied behoort tot de regio's die het sterkst worden getroffen door klimaatverandering. Door de stijgende temperaturen neemt de kans op langdurige droogte toe, wat grote gevolgen heeft voor landbouw, drinkwatervoorziening en natuur. Veel gebieden zijn afhankelijk van irrigatie, maar door afnemende neerslag en hogere verdamping komt de watervoorraad onder druk te staan. Tegelijkertijd neemt het risico op bosbranden toe, vooral in de zomermaanden. Klimaatmodellen voorspellen dat extreme hittegolven vaker zullen voorkomen en langer zullen duren. Dit heeft niet alleen ecologische gevolgen, maar ook economische: toerisme, een belangrijke inkomstenbron, wordt kwetsbaarder door hitte en natuurbranden. Overheden proberen zich aan te passen door waterbesparing, herbebossing en het verbeteren van irrigatiesystemen, maar de uitdagingen blijven groot."),
      esc("Leg uit waarom het Middellandse Zeegebied extra kwetsbaar is voor klimaatverandering."),
      esc("Het gebied heeft al een warm en droog klimaat. Extra opwarming leidt snel tot watertekorten. Landbouw is sterk afhankelijk van irrigatie, waardoor droogte grote gevolgen heeft. Ook neemt het risico op bosbranden toe. Hierdoor is de regio extra kwetsbaar.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Staafdiagram met het aantal extreme neerslagdagen in West-Europa tussen 1980 en 2025. De balken stijgen van 5 naar 18 dagen per jaar.'"),
      esc("Leg uit hoe de trend in de grafiek past bij mondiale klimaatverandering."),
      esc("Warme lucht kan meer waterdamp vasthouden. Hierdoor ontstaan vaker zware regenbuien. De stijgende trend in extreme neerslagdagen past bij voorspellingen van klimaatmodellen. Dit is een duidelijk gevolg van opwarming.")),
    q("Artikel",
      esc("Turkije ligt op een van de meest actieve breuklijnen ter wereld. De Anatolische plaat schuift langzaam naar het westen en botst daarbij met de Euraziatische plaat. Deze beweging veroorzaakt spanningen in de aardkorst die zich opbouwen totdat ze plotseling vrijkomen in de vorm van aardbevingen. Vooral in het oosten van Turkije komen zware bevingen regelmatig voor. De schade is vaak groot omdat veel gebouwen niet aardbevingsbestendig zijn. De overheid investeert daarom in nieuwe bouwvoorschriften en versterking van bestaande constructies. Toch blijft het risico hoog, omdat de geologische processen voortdurend doorgaan."),
      esc("Leg uit waarom Turkije een hoog aardbevingsrisico heeft."),
      esc("Turkije ligt op de grens van twee tektonische platen. De platen bewegen langs elkaar en veroorzaken spanningen. Wanneer deze spanningen vrijkomen, ontstaan aardbevingen. Veel gebouwen zijn bovendien niet sterk genoeg. Daarom is het risico groot.")),
    q("Kaart",
      esc("Kaart-beschrijving: 'Kaart van de Pacifische Ring van Vuur met actieve vulkanen in Japan, Indonesië, Chili en de westkust van de VS.'"),
      esc("Leg uit waarom langs de Pacifische Ring van Vuur zoveel vulkanen voorkomen."),
      esc("Langs de Ring van Vuur botsen en schuiven tektonische platen onder elkaar. Bij subductie smelt gesteente en stijgt magma op. Hierdoor ontstaan veel vulkanen. De intensieve plaatbewegingen zorgen voor een hoge concentratie vulkanische activiteit.")),
    q("Artikel",
      esc("Bangladesh is een van de meest kwetsbare landen ter wereld als het gaat om overstromingen. Het land ligt in een uitgestrekte delta waar grote rivieren zoals de Ganges en de Brahmaputra samenkomen. Tijdens de moesson valt enorme hoeveelheden regen, waardoor de rivieren snel buiten hun oevers treden. Door klimaatverandering stijgt bovendien de zeespiegel, wat het risico op overstromingen verder vergroot. Grote delen van het land liggen laag en zijn dichtbevolkt, waardoor de gevolgen van overstromingen vaak ernstig zijn. De overheid investeert in dijken, waarschuwingssystemen en drijvende landbouw, maar de uitdagingen blijven groot."),
      esc("Leg uit waarom Bangladesh zo kwetsbaar is voor overstromingen."),
      esc("Bangladesh ligt in een laaggelegen delta waar grote rivieren samenkomen. Tijdens de moesson valt veel neerslag. Door zeespiegelstijging neemt het risico verder toe. Veel mensen wonen in risicogebieden. Daarom is het land extreem kwetsbaar.")),
]

# ── Domain D — Ontwikkelingsland ──────────────────────────────────────────
d = [
    q("Artikel",
      esc("Ethiopië heeft de afgelopen jaren een sterke economische groei doorgemaakt, maar deze groei bereikt niet alle bevolkingsgroepen. In steden ontstaan nieuwe banen in industrie en dienstverlening, maar op het platteland blijft armoede wijdverspreid. Veel mensen zijn afhankelijk van landbouw, die kwetsbaar is voor droogte en misoogsten. De infrastructuur is in veel gebieden beperkt, waardoor markten slecht bereikbaar zijn. Hoewel buitenlandse investeringen bijdragen aan economische ontwikkeling, profiteren vooral stedelijke elites. De ongelijkheid tussen stad en platteland blijft daardoor groot. De overheid probeert dit te verminderen door te investeren in wegen, onderwijs en irrigatieprojecten, maar de uitdagingen zijn enorm."),
      esc("Leg uit waarom economische groei in ontwikkelingslanden niet altijd leidt tot minder armoede."),
      esc("Economische groei bereikt vaak vooral stedelijke gebieden. Plattelandsbewoners blijven afhankelijk van kwetsbare landbouw. Infrastructuur en onderwijs zijn vaak beperkt. Hierdoor profiteren niet alle groepen van de groei. Armoede blijft daardoor bestaan.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Staafdiagram met kindersterfte in Sub-Sahara Afrika tussen 1990 en 2025. De balken dalen van 160 per 1000 naar 70 per 1000.'"),
      esc("Leg uit welke factoren hebben bijgedragen aan de daling van kindersterfte."),
      esc("Betere toegang tot vaccinaties speelt een grote rol. Ook schoon drinkwater en gezondheidszorg zijn verbeterd. Daarnaast draagt betere voeding bij aan hogere overlevingskansen. Internationale hulp heeft deze ontwikkelingen ondersteund.")),
    q("Artikel",
      esc("In veel ontwikkelingslanden vormt infrastructuur een belangrijke belemmering voor economische groei. Slechte wegen maken het moeilijk om producten naar markten te vervoeren, waardoor boeren lage prijzen krijgen voor hun oogst. Ook toegang tot onderwijs en gezondheidszorg wordt beperkt door lange reistijden. Investeringen in infrastructuur kunnen deze problemen verminderen. Nieuwe wegen, bruggen en elektriciteitsnetwerken zorgen voor betere verbindingen en meer economische kansen. Toch zijn deze projecten vaak duur en complex, waardoor vooruitgang langzaam gaat."),
      esc("Leg uit hoe infrastructuurontwikkeling kan bijdragen aan economische groei."),
      esc("Goede wegen maken handel efficiënter. Boeren kunnen hun producten sneller en tegen betere prijzen verkopen. Ook onderwijs en zorg worden beter bereikbaar. Hierdoor ontstaan meer economische kansen. Infrastructuur stimuleert zo de ontwikkeling.")),
    q("Kaart",
      esc("Kaart-beschrijving: 'Kaart van Afrika met regio's met hoge bevolkingsgroei donker gekleurd, vooral in West- en Oost-Afrika.'"),
      esc("Leg uit waarom bevolkingsgroei een uitdaging vormt voor ontwikkelingslanden."),
      esc("Snelle bevolkingsgroei verhoogt de druk op onderwijs en zorg. Overheden kunnen deze vraag vaak niet bijbenen. Ook voedselvoorziening komt onder druk te staan. Hierdoor ontstaan tekorten en blijft armoede bestaan.")),
    q("Artikel",
      esc("Nigeria is een van de snelst verstedelijkende landen ter wereld. Vooral Lagos groeit explosief door migratie en natuurlijke bevolkingsgroei. De stad biedt veel economische kansen, maar de infrastructuur kan de groei nauwelijks aan. Hierdoor ontstaan grote sloppenwijken zonder toegang tot schoon water, elektriciteit en sanitaire voorzieningen. Tegelijkertijd trekt de stad buitenlandse investeringen aan, waardoor moderne zakencentra ontstaan. Deze tegenstelling maakt Lagos een voorbeeld van de kansen én problemen van urbanisatie in ontwikkelingslanden."),
      esc("Leg uit waarom urbanisatie zowel kansen als problemen oplevert voor ontwikkelingslanden."),
      esc("Urbanisatie creëert banen en trekt investeringen aan. Tegelijk groeit de bevolking sneller dan de infrastructuur. Hierdoor ontstaan sloppenwijken en vervuiling. De verschillen tussen arm en rijk worden groter. Urbanisatie biedt dus kansen, maar ook grote uitdagingen.")),
]

print("Replacing ak HAVO oe arrays (B, C, D)...")
c = replace_oe(c, 'B', 'Wereld', b, 'C', 'Aarde')
c = replace_oe(c, 'C', 'Aarde', C, 'D', 'Ontwikkelingsland')
c = replace_oe(c, 'D', 'Ontwikkelingsland', d, 'E', 'Leefomgeving')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

with open(path, 'r', encoding='utf-8') as f:
    v = f.read()
ak_idx = v.find("{id:'ak',naam:'Aardrijkskunde'")
ec_idx = v.find("{id:'ec',naam:'Economie'", ak_idx)
ak_sec = v[ak_idx:ec_idx]
for dom, naam in [('B','Wereld'), ('C','Aarde'), ('D','Ontwikkelingsland')]:
    idx = ak_sec.find("{id:'" + dom + "',naam:'" + naam + "'")
    oe_i = ak_sec.find('   oe:[', idx)
    nxt = ak_sec.find('\n  {id:', oe_i)
    block = ak_sec[oe_i:nxt if nxt > 0 else len(ak_sec)]
    print(f"  Domain {dom}: {block.count('{bron:')} questions, double-bracket={block.count(chr(10)+'   ]'+chr(10)+'   ]')}")
