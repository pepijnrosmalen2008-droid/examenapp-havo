import re

path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ── GS domain A ─────────────────────────────────────────────────────────
gs_a_new = (
    "{bron:'CE 2026 – fictief',ctx:'Een grote foto toont de Berlijnse Muur in 1961. Oost-Duitse grenssoldaten rollen prikkeldraad uit terwijl West-Berlijners verbaasd toekijken. Op de achtergrond staat een half afgebouwde wachttoren.',v:'Leg uit waarom de bouw van de Berlijnse Muur in 1961 een keerpunt vormt in de Koude Oorlog.',o:[''],c:0,u:'De Muur maakte de scheiding tussen Oost en West definitief zichtbaar. Het stopte de vlucht van Oost-Duitsers en symboliseerde de blijvende confrontatie tussen de VS en de Sovjet-Unie. Hierdoor werd duidelijk dat hereniging voorlopig onmogelijk was.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een krantenartikel bespreekt de herdenking van de Watersnoodramp van 1953. Een luchtfoto toont overstroomde polders en ingestorte dijken. Daarnaast staat een schema van de Deltawerken.',v:'Leg uit hoe de Watersnoodramp van 1953 heeft geleid tot langdurige veranderingen in het Nederlandse waterbeheer.',o:[''],c:0,u:'De ramp liet zien dat de dijken onvoldoende bescherming boden. Dit leidde tot de Deltawet en de bouw van de Deltawerken, waardoor Nederland structureel beter werd beschermd. Het waterbeheer werd preventief in plaats van reactief.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een tijdlijn toont de Industriële Revolutie. Afbeeldingen tonen stoommachines, fabrieksarbeiders, vervuilde straten en overvolle woonwijken.',v:'Leg uit hoe de Industriële Revolutie leidde tot zowel economische groei als sociale problemen.',o:[''],c:0,u:'Machines verhoogden de productie en zorgden voor economische groei. Tegelijk ontstonden slechte arbeidsomstandigheden, lange werktijden en vervuilde steden. Urbanisatie leidde tot overbevolking en gezondheidsproblemen.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een schilderij toont de bestorming van de Bastille in 1789. Burgers zwaaien met wapens terwijl rook opstijgt uit het fort.',v:'Leg uit waarom de Franse Revolutie wordt gezien als een breukmoment in de Europese politieke geschiedenis.',o:[''],c:0,u:'De revolutie maakte een einde aan het absolutisme en introduceerde ideeën over volkssoevereiniteit en burgerrechten. Deze principes verspreidden zich door Europa en vormden de basis voor moderne democratische staten.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een documentaire toont onafhankelijkheidsvieringen in Ghana (1957). Mensen dansen op straat terwijl de nieuwe vlag wordt gehesen.',v:'Leg uit hoe de Tweede Wereldoorlog heeft bijgedragen aan de dekolonisatiegolf na 1945.',o:[''],c:0,u:'Koloniale machten waren verzwakt en konden hun gezag minder handhaven. Nationalistische bewegingen groeiden en zelfbeschikking werd internationaal belangrijker. Hierdoor konden veel kolonies onafhankelijk worden.'}"
)

gs_a_pattern = re.compile(
    r"(\{id:'A',naam:'Historisch besef'.*?   oe:\[).*?(\n   \]\},\n  \{id:'B',naam:'Oriëntatiekennis')",
    re.DOTALL
)
content, n = gs_a_pattern.subn(r"\g<1>\n" + gs_a_new + r"\g<2>", content)
print(f"gs A: {n} replacement(s)")

# ── GS domain B ─────────────────────────────────────────────────────────
gs_b_new = (
    "{bron:'CE 2026 – fictief',ctx:'Een kaart toont de handelsroutes van de VOC in de 17e eeuw. Lijnen verbinden Amsterdam met Kaapstad, Batavia en Japan. Een afbeelding toont een VOC-schip met kanonnen.',v:'Leg uit hoe de VOC bijdroeg aan de economische positie van de Republiek in de 17e eeuw.',o:[''],c:0,u:'De VOC zorgde voor winstgevende handel in specerijen en andere producten. De opbrengsten versterkten Amsterdam als financiël centrum. De VOC had een monopoliepositie en beschikte over een eigen leger en vloot.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een foto toont modderige loopgraven aan het Westfront tijdens de Eerste Wereldoorlog. Soldaten zitten verscholen achter zandzakken terwijl artillerie inslaat.',v:'Leg uit waarom de Eerste Wereldoorlog wordt gezien als een voorbeeld van een \\'totale oorlog\\'.',o:[''],c:0,u:'Hele samenlevingen werden gemobiliseerd: soldaten, industrie en burgers. Nieuwe wapens, economische blokkades en propaganda speelden een grote rol. Ook burgers leden onder tekorten en bombardementen.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een grafiek toont de werkloosheid in Duitsland tussen 1929 en 1933, met een sterke stijging na de beurskrach. Een foto toont een rij mannen voor een gaarkeuken.',v:'Leg uit hoe de economische crisis van 1929 bijdroeg aan de opkomst van het nationaalsocialisme.',o:[''],c:0,u:'Massawerkloosheid zorgde voor onvrede en wantrouwen in de democratische regering. De NSDAP beloofde herstel en werkgelegenheid. Hierdoor kreeg de partij brede steun, wat leidde tot haar machtspositie.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een kaart toont Europa tijdens de Koude Oorlog. NAVO-landen zijn blauw, Warschaupact-landen rood. Een foto toont een NAVO-top in de jaren 60.',v:'Leg uit waarom Europa tijdens de Koude Oorlog verdeeld raakte in twee invloedssferen.',o:[''],c:0,u:'De VS steunden kapitalistische democratieën, terwijl de Sovjet-Unie communistische regimes installeerde. Beide grootmachten wilden hun invloed uitbreiden, wat leidde tot twee blokken met eigen militaire allianties.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een foto toont een protestmars van de Amerikaanse burgerrechtenbeweging. Mensen dragen borden met \\'End segregation\\' en \\'I am a man\\'.',v:'Leg uit hoe de burgerrechtenbeweging in de VS past binnen het tijdvak van televisie en computer.',o:[''],c:0,u:'Televisie verspreidde beelden van geweld tegen demonstranten, waardoor de publieke steun groeide. De beweging leidde tot belangrijke wetten zoals de Civil Rights Act. Massamedia speelden een cruciale rol in bewustwording.'}"
)

gs_b_pattern = re.compile(
    r"(\{id:'B',naam:'Oriëntatiekennis'.*?   oe:\[).*?(\n   \]\},\n  \{id:'C',naam:'Thema)",
    re.DOTALL
)
content, n = gs_b_pattern.subn(r"\g<1>\n" + gs_b_new + r"\g<2>", content)
print(f"gs B: {n} replacement(s)")

# ── NL domain A ─────────────────────────────────────────────────────────
nl_a_new = (
    "{bron:'CE 2026 – fictief',ctx:'Een krantenartikel bespreekt de toename van elektrische auto\\'s in Nederland. Een grafiek toont een stijgende lijn van 2015 tot 2025. Daarnaast staat een foto van een druk bezette laadpaal in Amsterdam.',v:'Vat de hoofdgedachte van het artikel samen in één zin.',o:[''],c:0,u:'Het artikel stelt dat de snelle groei van elektrische auto\\'s leidt tot nieuwe uitdagingen voor de Nederlandse laadinfrastructuur.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een opiniestuk gaat over de invloed van sociale media op jongeren. De auteur beschrijft zowel positieve effecten (contact, creativiteit) als negatieve effecten (druk, verslaving).',v:'Leg uit welke twee standpunten de auteur inneemt en hoe deze zich tot elkaar verhouden.',o:[''],c:0,u:'De auteur erkent dat sociale media kansen bieden voor creativiteit en contact, maar benadrukt dat de negatieve effecten zoals druk en verslaving zwaarder wegen. De standpunten zijn dus afgewogen, maar met een kritische conclusie.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een informatief artikel bespreekt de gevolgen van vergrijzing. Een tabel toont de verhouding tussen werkenden en gepensioneerden in 1990, 2020 en 2050.',v:'Leg uit hoe de auteur de tabel gebruikt om zijn betoog te ondersteunen.',o:[''],c:0,u:'De tabel laat zien dat het aantal gepensioneerden sterk stijgt ten opzichte van het aantal werkenden. Hiermee onderbouwt de auteur zijn stelling dat de vergrijzing grote druk legt op de economie en zorgsector.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een artikel beschrijft de opkomst van AI in het onderwijs. Een afbeelding toont een leerling die met een tablet werkt terwijl een AI‑assistent feedback geeft.',v:'Leg uit wat de tekst bedoelt met de zin: \\'AI is een hulpmiddel, geen vervanging.\\'',o:[''],c:0,u:'De auteur bedoelt dat AI ondersteuning kan bieden bij leren en oefenen, maar dat menselijke begeleiding en beoordeling essentieel blijven. AI kan taken verlichten, maar niet de rol van de docent overnemen.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een recensie bespreekt een nieuw Nederlandstalig boek. De recensent prijst de schrijfstijl maar bekritiseert de oppervlakkige verhaallijn.',v:'Leg uit welke twee argumenten de recensent gebruikt om zijn oordeel te onderbouwen.',o:[''],c:0,u:'De recensent noemt de sterke, beeldende schrijfstijl als positief argument. Tegelijk stelt hij dat de verhaallijn weinig diepgang heeft, wat zijn kritische oordeel ondersteunt.'}"
)

nl_a_pattern = re.compile(
    r"(\{id:'A',naam:'Leesvaardigheid',beschrijving:'Tekstbegrip.*?   oe:\[).*?(\n   \]\},\n  \{id:'B',naam:'Mondelinge taalvaardigheid')",
    re.DOTALL
)
content, n = nl_a_pattern.subn(r"\g<1>\n" + nl_a_new + r"\g<2>", content)
print(f"nl A: {n} replacement(s)")

# ── NL domain E ─────────────────────────────────────────────────────────
nl_e_new = (
    "{bron:'CE 2026 – fictief',ctx:'Een opiniemaker schrijft dat festivals duurzamer moeten worden. Een foto toont een festivalterrein vol plastic bekers. De auteur noemt alternatieven zoals herbruikbare bekers en strengere afvalscheiding.',v:'Noem het standpunt van de auteur en geef twee argumenten die hij gebruikt.',o:[''],c:0,u:'Het standpunt is dat festivals duurzamer moeten worden. De auteur noemt als argumenten dat plastic afval schadelijk is voor het milieu en dat herbruikbare bekers al succesvol worden toegepast op andere evenementen.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een ingezonden brief reageert op plannen om schooldagen te verlengen. De schrijver stelt dat langere dagen niet leiden tot betere prestaties.',v:'Leg uit welk tegenargument de schrijver geeft tegen het verlengen van schooldagen.',o:[''],c:0,u:'De schrijver stelt dat langere schooldagen leiden tot vermoeidheid, waardoor leerlingen juist slechter presteren. Hij benadrukt dat kwaliteit van onderwijs belangrijker is dan kwantiteit.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een debatartikel bespreekt de vraag of smartphones in de klas verboden moeten worden. Een afbeelding toont leerlingen die op hun telefoon kijken tijdens de les.',v:'Leg uit hoe de auteur een tegenargument weerlegt.',o:[''],c:0,u:'De auteur erkent dat smartphones soms educatief kunnen zijn, maar stelt dat afleiding veel vaker voorkomt. Daarom vindt hij dat een verbod effectiever is dan vertrouwen op zelfdiscipline.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een columnist schrijft dat openbaar vervoer gratis moet worden voor jongeren. Hij verwijst naar een onderzoek waaruit blijkt dat jongeren minder vaak reizen door hoge kosten.',v:'Leg uit hoe de auteur het onderzoek gebruikt als argument.',o:[''],c:0,u:'Het onderzoek laat zien dat kosten een belangrijke drempel vormen voor jongeren. De auteur gebruikt dit om te onderbouwen dat gratis OV hun mobiliteit en kansen vergroot.'},\n"
    "{bron:'CE 2026 – fictief',ctx:'Een opiniestuk stelt dat Nederland meer moet investeren in kunst en cultuur. Een foto toont een leeg theater tijdens de coronaperiode.',v:'Leg uit waarom de auteur vindt dat kunst en cultuur essentieel zijn voor de samenleving.',o:[''],c:0,u:'De auteur stelt dat kunst en cultuur bijdragen aan creativiteit, sociale verbinding en identiteit. Hij benadrukt dat deze sector kwetsbaar is en daarom extra steun nodig heeft.'}"
)

nl_e_pattern = re.compile(
    r"(\{id:'E',naam:'Argumentatieve vaardigheden'.*?   oe:\[).*?(\n   \]\},\n  \{id:'F',naam:'Literatuur')",
    re.DOTALL
)
content, n = nl_e_pattern.subn(r"\g<1>\n" + nl_e_new + r"\g<2>", content)
print(f"nl E: {n} replacement(s)")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done.")
