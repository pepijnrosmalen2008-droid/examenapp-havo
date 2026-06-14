import re

path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Helper: escape single quotes for JS string literals
def js(s):
    return s.replace("'", "\\'")

# ── Domain B ──────────────────────────────────────────────────────────────
b_oe = (
    "{bron:'Artikel – fictief (2026)',ctx:'Artikel (±350 woorden): \\'De groeiende kloof tussen arm en rijk in wereldsteden\\'. Het artikel bespreekt hoe globalisering leidt tot snelle economische groei in steden als Mumbai, Lagos en São Paulo, maar dat deze groei ongelijk verdeeld is. Een foto-beschrijving: \\'Luchtfoto van Mumbai met luxe hoogbouw naast uitgestrekte sloppenwijken\\'.',v:'(a) Leg uit hoe globalisering kan leiden tot zowel economische groei als toenemende ongelijkheid in wereldsteden.\\n(b) Noem één ruimtelijk gevolg van deze ongelijkheid.',o:[''],c:0,u:'(a) Globalisering trekt internationale bedrijven aan, wat banen en investeringen oplevert. Tegelijk profiteren vooral hogeropgeleiden en multinationals, terwijl lage inkomensgroepen achterblijven. Hierdoor groeit de kloof tussen formele en informele sectoren. (b) Een ruimtelijk gevolg is de groei van sloppenwijken naast moderne zakencentra, wat leidt tot sterke ruimtelijke segregatie.'},\n"
    "{bron:'Grafiekbeschrijving – fictief',ctx:'Lijngrafiek: \\'Inkomensongelijkheid (Gini-coëfficiënt) in Brazilië, India en Nigeria, 1990–2025\\'. Alle drie de lijnen tonen een lichte daling tot 2005, gevolgd door een stijging tot 2025.',v:'Leg uit hoe de trend in de grafiek past bij mondiale economische ontwikkelingen sinds 1990.',o:[''],c:0,u:'De daling tot 2005 past bij de groei van de middenklasse door industrialisatie en betere toegang tot onderwijs. De stijging na 2005 hangt samen met globalisering waarbij vooral hoogopgeleiden profiteren van internationale markten. Hierdoor neemt de inkomensongelijkheid opnieuw toe, vooral in snelgroeiende economieën.'},\n"
    "{bron:'Artikel – fictief (2026)',ctx:'Artikel (±300 woorden): \\'De rol van multinationals in Zuidoost-Azië\\'. Het artikel beschrijft hoe bedrijven productie verplaatsen naar landen met lage lonen. Foto-beschrijving: \\'Productiehal in Vietnam met honderden werknemers aan lopende banden\\'.',v:'Leg uit waarom multinationals vaak kiezen voor productie in Zuidoost-Azië en noem één gevolg voor de lokale bevolking.',o:[''],c:0,u:'Multinationals kiezen voor Zuidoost-Azië vanwege lage lonen, gunstige handelsverdragen en een jonge beroepsbevolking. Voor de lokale bevolking kan dit leiden tot meer werkgelegenheid, maar ook tot slechte arbeidsomstandigheden en afhankelijkheid van buitenlandse bedrijven.'},\n"
    "{bron:'Kaartbeschrijving – fictief',ctx:'Kaart: \\'Migratiestromen van Sub-Sahara Afrika naar Europa, 2000–2025\\'. Pijlen tonen routes via Libië, Marokko en Turkije. Dikte van pijlen geeft intensiteit aan.',v:'Leg uit hoe economische verschillen tussen regio\\'s deze migratiestromen verklaren.',o:[''],c:0,u:'Grote inkomensverschillen tussen Sub-Sahara Afrika en Europa vormen een belangrijke push-pullfactor. Gebrek aan werk en politieke instabiliteit duwen mensen weg, terwijl hogere lonen en betere voorzieningen in Europa aantrekken. Hierdoor ontstaan sterke migratiestromen langs de routes op de kaart.'},\n"
    "{bron:'Artikel – fictief (2026)',ctx:'Artikel (±320 woorden): \\'De invloed van toerisme op arm-rijkverhoudingen in Zuidoost-Azië\\'. Foto-beschrijving: \\'Luxe resort naast een traditioneel vissersdorp op Bali\\'.',v:'Leg uit hoe toerisme zowel positieve als negatieve effecten heeft op arm-rijkverhoudingen in toeristische regio\\'s.',o:[''],c:0,u:'Toerisme creëert banen en inkomsten, vooral in de dienstensector. Tegelijk profiteren vooral buitenlandse investeerders en hogere inkomensgroepen van luxe resorts. Lokale bewoners krijgen vaak laagbetaalde banen en worden soms verdrongen door stijgende grondprijzen. Hierdoor kan de ongelijkheid toenemen.'}"
)

b_pat = re.compile(
    r"(\{id:'B',naam:'Wereld'.*?   oe:\[).*?(\n   \]\},\n  \{id:'C',naam:'Aarde')",
    re.DOTALL)
c, n = b_pat.subn(r"\g<1>\n" + b_oe + r"\g<2>", c)
print(f"B: {n}")

# ── Domain C ──────────────────────────────────────────────────────────────
c_oe = (
    "{bron:'Artikel – fictief (2026)',ctx:'Artikel (±400 woorden): \\'De gevolgen van klimaatverandering voor het Middellandse Zeegebied\\'. Kaartbeschrijving: \\'Kaart met toenemende droogte in Spanje, Italië en Griekenland tussen 1990 en 2025\\'.',v:'Leg uit waarom het Middellandse Zeegebied extra kwetsbaar is voor klimaatverandering.',o:[''],c:0,u:'Het gebied heeft al een warm en droog klimaat, waardoor extra opwarming snel leidt tot watertekorten. De landbouw is sterk afhankelijk van irrigatie, wat de kwetsbaarheid vergroot. Daarnaast neemt het risico op bosbranden toe en wordt de biodiversiteit bedreigd.'},\n"
    "{bron:'Grafiekbeschrijving – fictief',ctx:'Staafdiagram: \\'Aantal extreme neerslagdagen in West-Europa, 1980–2025\\'. De balken stijgen van 5 dagen per jaar naar 18 dagen per jaar.',v:'Leg uit hoe de trend in de grafiek past bij mondiale klimaatverandering.',o:[''],c:0,u:'Door opwarming van de aarde kan warme lucht meer waterdamp vasthouden. Hierdoor ontstaan vaker zware regenbuien. De stijgende trend in extreme neerslagdagen past bij de voorspellingen van klimaatmodellen voor West-Europa.'},\n"
    "{bron:'Artikel – fictief (2026)',ctx:'Artikel (±350 woorden): \\'Aardbevingen in Turkije: risico\\'s en preventie\\'. Foto-beschrijving: \\'Ingestorte gebouwen na een aardbeving, reddingswerkers zoeken naar overlevenden\\'.',v:'Leg uit waarom Turkije een hoog aardbevingsrisico heeft en noem één maatregel om schade te beperken.',o:[''],c:0,u:'Turkije ligt op de grens van de Euraziatische en Anatolische plaat, waardoor veel spanningen ontstaan. Deze spanningen leiden tot regelmatige aardbevingen. Een belangrijke maatregel is het bouwen van aardbevingsbestendige constructies om instortingsgevaar te verminderen.'},\n"
    "{bron:'Kaartbeschrijving – fictief',ctx:'Kaart: \\'Vulkanische gebieden langs de Pacifische Ring van Vuur\\'. Rood gemarkeerde zones tonen actieve vulkanen in Japan, Indonesië, Chili en de VS.',v:'Leg uit waarom juist langs de Pacifische Ring van Vuur zoveel vulkanen voorkomen.',o:[''],c:0,u:'Langs de Ring van Vuur botsen en schuiven tektonische platen onder elkaar. Bij subductie smelt gesteente, waardoor magma opstijgt en vulkanen ontstaan. De intensieve plaatbewegingen zorgen voor een hoge concentratie vulkanische activiteit.'},\n"
    "{bron:'Artikel – fictief (2026)',ctx:'Artikel (±300 woorden): \\'Overstromingen in Bangladesh: een jaarlijks terugkerend probleem\\'. Grafiekbeschrijving: \\'Lijngrafiek met stijgende rivierafvoer van de Ganges en Brahmaputra sinds 1980\\'.',v:'Leg uit waarom Bangladesh zo kwetsbaar is voor overstromingen.',o:[''],c:0,u:'Bangladesh ligt in een laaggelegen delta waar grote rivieren samenkomen. Tijdens de moesson valt veel neerslag, waardoor de rivieren snel overstromen. Door klimaatverandering stijgt de zeespiegel, wat het risico verder vergroot.'}"
)

c_pat = re.compile(
    r"(\{id:'C',naam:'Aarde'.*?   oe:\[).*?(\n   \]\},\n  \{id:'D',naam:'Ontwikkelingsland')",
    re.DOTALL)
c, n = c_pat.subn(r"\g<1>\n" + c_oe + r"\g<2>", c)
print(f"C: {n}")

# ── Domain D ──────────────────────────────────────────────────────────────
d_oe = (
    "{bron:'Artikel – fictief (2026)',ctx:'Artikel (±350 woorden): \\'Economische groei en armoede in Ethiopië\\'. Foto-beschrijving: \\'Marktplein in Addis Abeba met kleine handelaren en moderne gebouwen op de achtergrond\\'.',v:'Leg uit waarom economische groei in ontwikkelingslanden niet altijd leidt tot minder armoede.',o:[''],c:0,u:'Economische groei kan ongelijk verdeeld zijn, waardoor vooral stedelijke elites profiteren. In rurale gebieden blijven onderwijs en infrastructuur vaak achter. Hierdoor bereikt groei niet alle bevolkingsgroepen en blijft armoede bestaan.'},\n"
    "{bron:'Grafiekbeschrijving – fictief',ctx:'Staafdiagram: \\'Kindersterfte in Sub-Sahara Afrika, 1990–2025\\'. De balken dalen van 160 per 1000 naar 70 per 1000.',v:'Leg uit welke factoren hebben bijgedragen aan de daling van kindersterfte.',o:[''],c:0,u:'Betere toegang tot vaccinaties, schoon drinkwater en gezondheidszorg spelen een grote rol. Ook verbeterde voeding en internationale hulp dragen bij. Hierdoor neemt de overlevingskans van jonge kinderen toe.'},\n"
    "{bron:'Artikel – fictief (2026)',ctx:'Artikel (±300 woorden): \\'De rol van infrastructuur in ontwikkelingslanden\\'. Foto-beschrijving: \\'Nieuwe asfaltweg door een plattelandsgebied in Kenia\\'.',v:'Leg uit hoe infrastructuurontwikkeling kan bijdragen aan economische groei.',o:[''],c:0,u:'Goede wegen en verbindingen maken handel efficiënter en vergroten de toegang tot markten. Dit stimuleert investeringen en werkgelegenheid. Ook onderwijs en zorg worden beter bereikbaar, wat de ontwikkeling versnelt.'},\n"
    "{bron:'Kaartbeschrijving – fictief',ctx:'Kaart: \\'Bevolkingsgroei in Afrika, 2000–2050\\'. Donkere kleuren tonen regio\\'s met de hoogste groei, vooral in West- en Oost-Afrika.',v:'Leg uit waarom bevolkingsgroei een uitdaging vormt voor ontwikkelingslanden.',o:[''],c:0,u:'Snelle groei verhoogt de druk op onderwijs, zorg en voedselvoorziening. Overheden kunnen deze vraag vaak niet bijbenen. Hierdoor ontstaan tekorten en blijft armoede bestaan.'},\n"
    "{bron:'Artikel – fictief (2026)',ctx:'Artikel (±350 woorden): \\'Urbanisatie in Nigeria: kansen en problemen\\'. Foto-beschrijving: \\'Skyline van Lagos met wolkenkrabbers en uitgestrekte sloppenwijken\\'.',v:'Leg uit waarom urbanisatie zowel kansen als problemen oplevert voor ontwikkelingslanden.',o:[''],c:0,u:'Urbanisatie creëert banen en trekt investeringen aan. Tegelijk groeit de bevolking sneller dan de infrastructuur, wat leidt tot sloppenwijken en vervuiling. Hierdoor ontstaan grote sociale en ruimtelijke verschillen.'}"
)

d_pat = re.compile(
    r"(\{id:'D',naam:'Ontwikkelingsland'.*?   oe:\[).*?(\n   \]\},\n  \{id:'E',naam:'Leefomgeving')",
    re.DOTALL)
c, n = d_pat.subn(r"\g<1>\n" + d_oe + r"\g<2>", c)
print(f"D: {n}")

# ── Domain E ──────────────────────────────────────────────────────────────
e_oe = (
    "{bron:'Artikel – fictief (2026)',ctx:'Artikel (±350 woorden): \\'Verstedelijking in de Randstad\\'. Kaartbeschrijving: \\'Kaart van de Randstad met groeiende stedelijke zones rond Amsterdam, Utrecht, Rotterdam en Den Haag\\'.',v:'Leg uit waarom de Randstad een belangrijk economisch kerngebied is in Nederland.',o:[''],c:0,u:'De Randstad heeft een hoge bevolkingsdichtheid, goede infrastructuur en veel internationale bedrijven. De nabijheid van Schiphol en de Rotterdamse haven versterkt de economische positie. Hierdoor is het een belangrijk centrum voor handel en diensten.'},\n"
    "{bron:'Grafiekbeschrijving – fictief',ctx:'Lijngrafiek: \\'Aantal verkeersbewegingen op de A12, 1990–2025\\'. De lijn stijgt van 60.000 naar 140.000 voertuigen per dag.',v:'Leg uit waarom verkeersdrukte een groeiend probleem is in Nederlandse stedelijke regio\\'s.',o:[''],c:0,u:'Door bevolkingsgroei en economische activiteiten neemt het aantal reizigers toe. Veel mensen zijn afhankelijk van de auto, waardoor snelwegen overbelast raken. Dit leidt tot files, luchtvervuiling en langere reistijden.'},\n"
    "{bron:'Artikel – fictief (2026)',ctx:'Artikel (±300 woorden): \\'Natuurgebieden onder druk in Noord-Brabant\\'. Foto-beschrijving: \\'Luchtfoto van een natuurgebied dat grenst aan een snelweg en nieuwbouwwijk\\'.',v:'Leg uit waarom natuurgebieden in Nederland onder druk staan.',o:[''],c:0,u:'Door woningbouw, landbouw en infrastructuur is er weinig ruimte voor natuur. Stikstofuitstoot tast kwetsbare ecosystemen aan. Hierdoor neemt de biodiversiteit af en worden beschermde gebieden kleiner.'},\n"
    "{bron:'Kaartbeschrijving – fictief',ctx:'Kaart: \\'Overstromingsrisico\\'s in Nederland\\'. Lage gebieden in het westen zijn donkerblauw gemarkeerd als hoog risico.',v:'Leg uit waarom vooral West-Nederland kwetsbaar is voor overstromingen.',o:[''],c:0,u:'Veel gebieden liggen onder zeeniveau en zijn afhankelijk van dijken en gemalen. Door zeespiegelstijging neemt het risico toe. Daarnaast wonen er veel mensen, waardoor de potentiële schade groot is.'},\n"
    "{bron:'Artikel – fictief (2026)',ctx:'Artikel (±350 woorden): \\'De woningcrisis in Nederland\\'. Grafiekbeschrijving: \\'Staafdiagram met stijgende huizenprijzen 2000–2025\\'.',v:'Leg uit waarom de woningcrisis in Nederland een ruimtelijk probleem is.',o:[''],c:0,u:'Er is weinig ruimte voor nieuwbouw, vooral in stedelijke regio\\'s. Tegelijk groeit de bevolking en neemt de vraag naar woningen toe. Hierdoor stijgen prijzen en ontstaan tekorten, vooral in de Randstad.'}"
)

# Domain E is the last domain in ak, followed by ]} ]},
e_pat = re.compile(
    r"(\{id:'E',naam:'Leefomgeving'.*?   oe:\[).*?(\n   \]\}\n \]\},)",
    re.DOTALL)
c, n = e_pat.subn(r"\g<1>\n" + e_oe + r"\g<2>", c)
print(f"E: {n}")

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print("Done.")
