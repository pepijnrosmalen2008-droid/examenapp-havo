"""
Replace ak HAVO oe arrays for domains B, C, D, E.
Uses str.replace() — NOT re.sub — to avoid \n interpretation in replacements.
All \n in question v/u fields are written as the 2-char sequence backslash+n.
"""
path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

N = '\n'  # actual newline for structure
S = '\\n'  # JS escape sequence \n (2 chars) for inside strings

def oe_block(questions):
    """Wrap list of JS object strings in oe:[ ... ] markers."""
    return 'oe:[' + N + ','.join(questions) + N + '   ]}'

def q(bron, ctx, v, o, u):
    """Build a single JS oe question object string. \n in v/u must be pre-escaped."""
    return "{bron:'" + bron + "',ctx:'" + ctx + "',v:'" + v + "',o:[''],c:0,u:'" + u + "'}"

# ── DOMAIN B — Wereld ────────────────────────────────────────────────────
b_questions = [
    q("Artikel – fictief (2026)",
      "Artikel (±350 woorden): \\'De groeiende kloof tussen arm en rijk in wereldsteden\\'. Het artikel bespreekt hoe globalisering leidt tot snelle economische groei in steden als Mumbai, Lagos en São Paulo, maar dat deze groei ongelijk verdeeld is. Een foto-beschrijving: \\'Luchtfoto van Mumbai met luxe hoogbouw naast uitgestrekte sloppenwijken\\'.",
      "(a) Leg uit hoe globalisering kan leiden tot zowel economische groei als toenemende ongelijkheid in wereldsteden." + S + "(b) Noem één ruimtelijk gevolg van deze ongelijkheid.",
      "",
      "(a) Globalisering trekt internationale bedrijven aan, wat banen en investeringen oplevert. Tegelijk profiteren vooral hogeropgeleiden en multinationals, terwijl lage inkomensgroepen achterblijven. Hierdoor groeit de kloof tussen formele en informele sectoren. (b) Een ruimtelijk gevolg is de groei van sloppenwijken naast moderne zakencentra, wat leidt tot sterke ruimtelijke segregatie."),
    q("Grafiekbeschrijving – fictief",
      "Lijngrafiek: \\'Inkomensongelijkheid (Gini-coëfficiënt) in Brazilië, India en Nigeria, 1990–2025\\'. Alle drie de lijnen tonen een lichte daling tot 2005, gevolgd door een stijging tot 2025.",
      "Leg uit hoe de trend in de grafiek past bij mondiale economische ontwikkelingen sinds 1990.",
      "",
      "De daling tot 2005 past bij de groei van de middenklasse door industrialisatie en betere toegang tot onderwijs. De stijging na 2005 hangt samen met globalisering waarbij vooral hoogopgeleiden profiteren van internationale markten. Hierdoor neemt de inkomensongelijkheid opnieuw toe, vooral in snelgroeiende economieën."),
    q("Artikel – fictief (2026)",
      "Artikel (±300 woorden): \\'De rol van multinationals in Zuidoost-Azië\\'. Het artikel beschrijft hoe bedrijven productie verplaatsen naar landen met lage lonen. Foto-beschrijving: \\'Productiehal in Vietnam met honderden werknemers aan lopende banden\\'.",
      "Leg uit waarom multinationals vaak kiezen voor productie in Zuidoost-Azië en noem één gevolg voor de lokale bevolking.",
      "",
      "Multinationals kiezen voor Zuidoost-Azië vanwege lage lonen, gunstige handelsverdragen en een jonge beroepsbevolking. Voor de lokale bevolking kan dit leiden tot meer werkgelegenheid, maar ook tot slechte arbeidsomstandigheden en afhankelijkheid van buitenlandse bedrijven."),
    q("Kaartbeschrijving – fictief",
      "Kaart: \\'Migratiestromen van Sub-Sahara Afrika naar Europa, 2000–2025\\'. Pijlen tonen routes via Libië, Marokko en Turkije. Dikte van pijlen geeft intensiteit aan.",
      "Leg uit hoe economische verschillen tussen regio\\'s deze migratiestromen verklaren.",
      "",
      "Grote inkomensverschillen tussen Sub-Sahara Afrika en Europa vormen een belangrijke push-pullfactor. Gebrek aan werk en politieke instabiliteit duwen mensen weg, terwijl hogere lonen en betere voorzieningen in Europa aantrekken. Hierdoor ontstaan sterke migratiestromen langs de routes op de kaart."),
    q("Artikel – fictief (2026)",
      "Artikel (±320 woorden): \\'De invloed van toerisme op arm-rijkverhoudingen in Zuidoost-Azië\\'. Foto-beschrijving: \\'Luxe resort naast een traditioneel vissersdorp op Bali\\'.",
      "Leg uit hoe toerisme zowel positieve als negatieve effecten heeft op arm-rijkverhoudingen in toeristische regio\\'s.",
      "",
      "Toerisme creëert banen en inkomsten, vooral in de dienstensector. Tegelijk profiteren vooral buitenlandse investeerders en hogere inkomensgroepen van luxe resorts. Lokale bewoners krijgen vaak laagbetaalde banen en worden soms verdrongen door stijgende grondprijzen. Hierdoor kan de ongelijkheid toenemen."),
]

# ── DOMAIN C — Aarde ─────────────────────────────────────────────────────
c_questions = [
    q("Artikel – fictief (2026)",
      "Artikel (±400 woorden): \\'De gevolgen van klimaatverandering voor het Middellandse Zeegebied\\'. Kaartbeschrijving: \\'Kaart met toenemende droogte in Spanje, Italië en Griekenland tussen 1990 en 2025\\'.",
      "Leg uit waarom het Middellandse Zeegebied extra kwetsbaar is voor klimaatverandering.",
      "",
      "Het gebied heeft al een warm en droog klimaat, waardoor extra opwarming snel leidt tot watertekorten. De landbouw is sterk afhankelijk van irrigatie, wat de kwetsbaarheid vergroot. Daarnaast neemt het risico op bosbranden toe en wordt de biodiversiteit bedreigd."),
    q("Grafiekbeschrijving – fictief",
      "Staafdiagram: \\'Aantal extreme neerslagdagen in West-Europa, 1980–2025\\'. De balken stijgen van 5 dagen per jaar naar 18 dagen per jaar.",
      "Leg uit hoe de trend in de grafiek past bij mondiale klimaatverandering.",
      "",
      "Door opwarming van de aarde kan warme lucht meer waterdamp vasthouden. Hierdoor ontstaan vaker zware regenbuien. De stijgende trend in extreme neerslagdagen past bij de voorspellingen van klimaatmodellen voor West-Europa."),
    q("Artikel – fictief (2026)",
      "Artikel (±350 woorden): \\'Aardbevingen in Turkije: risico\\'s en preventie\\'. Foto-beschrijving: \\'Ingestorte gebouwen na een aardbeving, reddingswerkers zoeken naar overlevenden\\'.",
      "Leg uit waarom Turkije een hoog aardbevingsrisico heeft en noem één maatregel om schade te beperken.",
      "",
      "Turkije ligt op de grens van de Euraziatische en Anatolische plaat, waardoor veel spanningen ontstaan. Deze spanningen leiden tot regelmatige aardbevingen. Een belangrijke maatregel is het bouwen van aardbevingsbestendige constructies om instortingsgevaar te verminderen."),
    q("Kaartbeschrijving – fictief",
      "Kaart: \\'Vulkanische gebieden langs de Pacifische Ring van Vuur\\'. Rood gemarkeerde zones tonen actieve vulkanen in Japan, Indonesië, Chili en de VS.",
      "Leg uit waarom juist langs de Pacifische Ring van Vuur zoveel vulkanen voorkomen.",
      "",
      "Langs de Ring van Vuur botsen en schuiven tektonische platen onder elkaar. Bij subductie smelt gesteente, waardoor magma opstijgt en vulkanen ontstaan. De intensieve plaatbewegingen zorgen voor een hoge concentratie vulkanische activiteit."),
    q("Artikel – fictief (2026)",
      "Artikel (±300 woorden): \\'Overstromingen in Bangladesh: een jaarlijks terugkerend probleem\\'. Grafiekbeschrijving: \\'Lijngrafiek met stijgende rivierafvoer van de Ganges en Brahmaputra sinds 1980\\'.",
      "Leg uit waarom Bangladesh zo kwetsbaar is voor overstromingen.",
      "",
      "Bangladesh ligt in een laaggelegen delta waar grote rivieren samenkomen. Tijdens de moesson valt veel neerslag, waardoor de rivieren snel overstromen. Door klimaatverandering stijgt de zeespiegel, wat het risico verder vergroot."),
]

# ── DOMAIN D — Ontwikkelingsland ──────────────────────────────────────────
d_questions = [
    q("Artikel – fictief (2026)",
      "Artikel (±350 woorden): \\'Economische groei en armoede in Ethiopië\\'. Foto-beschrijving: \\'Marktplein in Addis Abeba met kleine handelaren en moderne gebouwen op de achtergrond\\'.",
      "Leg uit waarom economische groei in ontwikkelingslanden niet altijd leidt tot minder armoede.",
      "",
      "Economische groei kan ongelijk verdeeld zijn, waardoor vooral stedelijke elites profiteren. In rurale gebieden blijven onderwijs en infrastructuur vaak achter. Hierdoor bereikt groei niet alle bevolkingsgroepen en blijft armoede bestaan."),
    q("Grafiekbeschrijving – fictief",
      "Staafdiagram: \\'Kindersterfte in Sub-Sahara Afrika, 1990–2025\\'. De balken dalen van 160 per 1000 naar 70 per 1000.",
      "Leg uit welke factoren hebben bijgedragen aan de daling van kindersterfte.",
      "",
      "Betere toegang tot vaccinaties, schoon drinkwater en gezondheidszorg spelen een grote rol. Ook verbeterde voeding en internationale hulp dragen bij. Hierdoor neemt de overlevingskans van jonge kinderen toe."),
    q("Artikel – fictief (2026)",
      "Artikel (±300 woorden): \\'De rol van infrastructuur in ontwikkelingslanden\\'. Foto-beschrijving: \\'Nieuwe asfaltweg door een plattelandsgebied in Kenia\\'.",
      "Leg uit hoe infrastructuurontwikkeling kan bijdragen aan economische groei.",
      "",
      "Goede wegen en verbindingen maken handel efficiënter en vergroten de toegang tot markten. Dit stimuleert investeringen en werkgelegenheid. Ook onderwijs en zorg worden beter bereikbaar, wat de ontwikkeling versnelt."),
    q("Kaartbeschrijving – fictief",
      "Kaart: \\'Bevolkingsgroei in Afrika, 2000–2050\\'. Donkere kleuren tonen regio\\'s met de hoogste groei, vooral in West- en Oost-Afrika.",
      "Leg uit waarom bevolkingsgroei een uitdaging vormt voor ontwikkelingslanden.",
      "",
      "Snelle groei verhoogt de druk op onderwijs, zorg en voedselvoorziening. Overheden kunnen deze vraag vaak niet bijbenen. Hierdoor ontstaan tekorten en blijft armoede bestaan."),
    q("Artikel – fictief (2026)",
      "Artikel (±350 woorden): \\'Urbanisatie in Nigeria: kansen en problemen\\'. Foto-beschrijving: \\'Skyline van Lagos met wolkenkrabbers en uitgestrekte sloppenwijken\\'.",
      "Leg uit waarom urbanisatie zowel kansen als problemen oplevert voor ontwikkelingslanden.",
      "",
      "Urbanisatie creëert banen en trekt investeringen aan. Tegelijk groeit de bevolking sneller dan de infrastructuur, wat leidt tot sloppenwijken en vervuiling. Hierdoor ontstaan grote sociale en ruimtelijke verschillen."),
]

# ── DOMAIN E — Leefomgeving ───────────────────────────────────────────────
e_questions = [
    q("Artikel – fictief (2026)",
      "Artikel (±350 woorden): \\'Verstedelijking in de Randstad\\'. Kaartbeschrijving: \\'Kaart van de Randstad met groeiende stedelijke zones rond Amsterdam, Utrecht, Rotterdam en Den Haag\\'.",
      "Leg uit waarom de Randstad een belangrijk economisch kerngebied is in Nederland.",
      "",
      "De Randstad heeft een hoge bevolkingsdichtheid, goede infrastructuur en veel internationale bedrijven. De nabijheid van Schiphol en de Rotterdamse haven versterkt de economische positie. Hierdoor is het een belangrijk centrum voor handel en diensten."),
    q("Grafiekbeschrijving – fictief",
      "Lijngrafiek: \\'Aantal verkeersbewegingen op de A12, 1990–2025\\'. De lijn stijgt van 60.000 naar 140.000 voertuigen per dag.",
      "Leg uit waarom verkeersdrukte een groeiend probleem is in Nederlandse stedelijke regio\\'s.",
      "",
      "Door bevolkingsgroei en economische activiteiten neemt het aantal reizigers toe. Veel mensen zijn afhankelijk van de auto, waardoor snelwegen overbelast raken. Dit leidt tot files, luchtvervuiling en langere reistijden."),
    q("Artikel – fictief (2026)",
      "Artikel (±300 woorden): \\'Natuurgebieden onder druk in Noord-Brabant\\'. Foto-beschrijving: \\'Luchtfoto van een natuurgebied dat grenst aan een snelweg en nieuwbouwwijk\\'.",
      "Leg uit waarom natuurgebieden in Nederland onder druk staan.",
      "",
      "Door woningbouw, landbouw en infrastructuur is er weinig ruimte voor natuur. Stikstofuitstoot tast kwetsbare ecosystemen aan. Hierdoor neemt de biodiversiteit af en worden beschermde gebieden kleiner."),
    q("Kaartbeschrijving – fictief",
      "Kaart: \\'Overstromingsrisico\\'s in Nederland\\'. Lage gebieden in het westen zijn donkerblauw gemarkeerd als hoog risico.",
      "Leg uit waarom vooral West-Nederland kwetsbaar is voor overstromingen.",
      "",
      "Veel gebieden liggen onder zeeniveau en zijn afhankelijk van dijken en gemalen. Door zeespiegelstijging neemt het risico toe. Daarnaast wonen er veel mensen, waardoor de potentiële schade groot is."),
    q("Artikel – fictief (2026)",
      "Artikel (±350 woorden): \\'De woningcrisis in Nederland\\'. Grafiekbeschrijving: \\'Staafdiagram met stijgende huizenprijzen 2000–2025\\'.",
      "Leg uit waarom de woningcrisis in Nederland een ruimtelijk probleem is.",
      "",
      "Er is weinig ruimte voor nieuwbouw, vooral in stedelijke regio\\'s. Tegelijk groeit de bevolking en neemt de vraag naar woningen toe. Hierdoor stijgen prijzen en ontstaan tekorten, vooral in de Randstad."),
]

# ── Perform replacements using str.replace (no regex!) ───────────────────
def replace_oe(content, dom_id, dom_name, new_questions, next_id, next_name):
    """Find oe:[ ... ]} block for given domain and replace with new questions."""
    # Find the domain header
    marker_start = f"{{id:'{dom_id}',naam:'{dom_name}'"
    idx = content.find(marker_start)
    assert idx >= 0, f"Domain {dom_id} not found"

    # Find oe:[ after the domain header
    oe_start = content.find('   oe:[', idx)
    assert oe_start >= 0, f"oe:[ not found for domain {dom_id}"

    # Find closing ]} of this oe block — look for ]}, followed by next domain or ]}
    # The oe block ends with \n   ]},\n  {id:'NEXT'
    if next_id:
        close_marker = f"\n   ]}}," + "\n  {" + f"id:'{next_id}',naam:'{next_name}'"
    else:
        # Last domain — ends with ]}\n ]}
        close_marker = "\n   ]}" + "\n ]}"

    close_idx = content.find(close_marker, oe_start)
    assert close_idx >= 0, f"Close marker not found for domain {dom_id}: {repr(close_marker[:40])}"

    # Build new oe content
    new_oe = '   oe:[\n' + ',\n'.join(new_questions) + '\n   ]'

    old_oe = content[oe_start:close_idx + (3 if next_id else 3)]
    # We replace from oe:[ up to (but not including) the close_marker
    old_section = content[oe_start:close_idx]
    new_section = new_oe

    result = content[:oe_start] + new_section + content[close_idx:]
    print(f"  {dom_id}: replaced {len(old_section)} chars with {len(new_section)} chars")
    return result

print("Replacing ak HAVO oe arrays...")

# We need to find the HAVO ak, not VWO ak
# HAVO ak is at lower line number
ak_idx = c.find("{id:'ak',naam:'Aardrijkskunde'")
assert ak_idx >= 0

# Work only within the HAVO ak section
# Find end of HAVO ak (next vak after ak is 'ec')
ec_idx = c.find("{id:'ec',naam:'Economie'", ak_idx)
assert ec_idx >= 0

ak_section = c[ak_idx:ec_idx]

ak_section = replace_oe(ak_section, 'B', 'Wereld', b_questions, 'C', 'Aarde')
ak_section = replace_oe(ak_section, 'C', 'Aarde', c_questions, 'D', 'Ontwikkelingsland')
ak_section = replace_oe(ak_section, 'D', 'Ontwikkelingsland', d_questions, 'E', 'Leefomgeving')
ak_section = replace_oe(ak_section, 'E', 'Leefomgeving', e_questions, None, None)

c = c[:ak_idx] + ak_section + c[ec_idx:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

# Verify: no literal newlines inside oe strings
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

problems = 0
for i, line in enumerate(lines):
    ln = i + 1
    if 7700 < ln < 7950:
        stripped = line.rstrip('\n')
        if stripped and not stripped.startswith('{') and not stripped.startswith('   ') and not stripped.startswith('  {') and not stripped.startswith('  ]') and not stripped.startswith(' ]'):
            print(f"WARNING L{ln}: {stripped[:80]}")
            problems += 1

print(f"Done. Problems found: {problems}")
