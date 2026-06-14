"""Replace na HAVO oe array for domain E."""
path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

def q(bron, ctx, v, u):
    return "{bron:'" + bron + "',ctx:'" + ctx + "',v:'" + v + "',o:[''],c:0,u:'" + u + "'}"

def esc(s):
    return s.replace("'", "\\'").replace('"', '\\"')

def replace_oe(content, dom_id, dom_name, questions, next_id, next_name):
    na_idx = content.find("{id:'na',naam:'Natuurkunde'")
    be_idx = content.find("{id:'be',naam:'Bedrijfseconomie'", na_idx)
    marker = "{id:'" + dom_id + "',naam:'" + dom_name + "'"
    idx = content.find(marker, na_idx)
    assert 0 < idx < be_idx
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
    assert close_idx >= 0
    new_oe = '   oe:[\n' + ',\n'.join(questions)
    old_len = len(content[oe_start:close_idx])
    result = content[:oe_start] + new_oe + content[close_idx:]
    print(f"  {dom_id}: replaced {old_len} chars with {len(new_oe)} chars")
    return result

e = [
    q("Artikel",
      esc("MRI-scanners worden in ziekenhuizen gebruikt om gedetailleerde beelden van het lichaam te maken zonder gebruik te maken van schadelijke straling. De techniek werkt met sterke magnetische velden die de waterstofkernen in het lichaam in een bepaalde richting dwingen. Wanneer een radiogolf wordt uitgezonden, raken deze kernen kortstondig uit balans. Zodra de radiogolf wordt uitgeschakeld, keren de kernen terug naar hun oorspronkelijke stand en zenden ze een zwak signaal uit. Dit signaal verschilt per weefseltype, waardoor een computer het kan omzetten in een gedetailleerd beeld. Omdat MRI gebruikmaakt van radiogolven en magnetische velden, is er geen sprake van ioniserende straling zoals bij röntgenfoto's of CT-scans. Hierdoor is de methode veiliger voor patiënten, vooral bij herhaald onderzoek. MRI is bijzonder geschikt voor het zichtbaar maken van zachte weefsels zoals hersenen, spieren en organen, waardoor het een onmisbaar instrument is in de moderne geneeskunde."),
      esc("Leg uit waarom MRI geen schadelijke straling gebruikt en toch beelden kan maken."),
      esc("MRI gebruikt radiogolven en magnetische velden, geen ioniserende straling. Waterstofkernen reageren op deze velden en zenden signalen uit wanneer ze terugkeren naar hun oorspronkelijke stand. Deze signalen worden opgevangen en omgezet in beelden. Omdat er geen ioniserende straling wordt gebruikt, is MRI veiliger dan röntgenstraling. Toch levert de techniek zeer gedetailleerde beelden op van zachte weefsels.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Doordringend vermogen van alfa-, bèta- en gammastraling: alfa wordt tegengehouden door papier, bèta door aluminium, gamma pas door een dikke laag lood.'"),
      esc("Leg uit waarom gammastraling gevaarlijker is dan alfastraling."),
      esc("Gammastraling heeft een veel groter doordringend vermogen dan alfastraling. Hierdoor kan het diep in het lichaam doordringen en cellen beschadigen. Alfastraling wordt al door de huid tegengehouden en vormt vooral een risico bij inademing of inslikken. Gammastraling kan organen bereiken en daar schade veroorzaken. Daarom wordt gammastraling als gevaarlijker beschouwd.")),
    q("Foto",
      esc("Foto-beschrijving: 'Rookmelder met een kleine radioactieve bron in de meetkamer, zichtbaar als een metalen schijfje in een opengewerkt model.'"),
      esc("Leg uit waarom een rookmelder een kleine hoeveelheid radioactieve stof bevat."),
      esc("De radioactieve bron ioniseert de lucht in de meetkamer van de rookmelder. Hierdoor ontstaat een kleine elektrische stroom. Wanneer rook de kamer binnendringt, wordt de ionisatie verstoord en verandert de stroomsterkte. De rookmelder detecteert deze verandering en activeert het alarm. De radioactieve bron maakt deze meetmethode mogelijk.")),
    q("Artikel",
      esc("In ziekenhuizen wordt veel aandacht besteed aan bescherming tegen röntgenstraling, omdat deze vorm van straling cellen kan beschadigen en op lange termijn gezondheidsrisico's kan veroorzaken. Röntgenstraling heeft een hoog doordringend vermogen en kan diep in het lichaam doordringen, waardoor organen en weefsels worden blootgesteld. Om personeel en patiënten te beschermen, worden loodschorten, loden wanden en speciale afschermingsschermen gebruikt. Lood is hiervoor geschikt omdat het een hoge dichtheid heeft en röntgenstraling effectief absorbeert. Moderne röntgenapparatuur maakt gebruik van lagere doses en nauwkeurige bundels, waardoor de blootstelling verder wordt beperkt. Toch blijft bescherming noodzakelijk, vooral voor medewerkers die dagelijks met röntgenapparatuur werken. Door strikte veiligheidsprotocollen te volgen, kan de stralingsdosis tot een minimum worden beperkt."),
      esc("Leg uit waarom lood vaak wordt gebruikt als bescherming tegen röntgenstraling."),
      esc("Lood heeft een hoge dichtheid en absorbeert röntgenstraling zeer effectief. Hierdoor bereikt minder straling het lichaam. Dit maakt lood geschikt voor schorten en wanden in ziekenhuizen. Omdat röntgenstraling cellen kan beschadigen, is goede bescherming noodzakelijk. Lood helpt de stralingsdosis sterk te verminderen.")),
    q("Grafiek",
      esc("Grafiek-beschrijving: 'Activiteit van een radioactieve bron als functie van tijd: een vloeiende exponentiële daling die begint bij hoge activiteit en langzaam afneemt.'"),
      esc("Leg uit waarom de activiteit van een radioactieve bron exponentieel afneemt."),
      esc("Bij radioactief verval heeft elke kern per tijdseenheid dezelfde kans om te vervallen. Hierdoor neemt het aantal overgebleven kernen steeds sneller af. Dit leidt tot een exponentiële daling van de activiteit. De snelheid van deze daling wordt bepaald door de halveringstijd. Daarom vertonen alle radioactieve stoffen een exponentieel vervalpatroon.")),
]

print("Replacing na HAVO domain E...")
c = replace_oe(c, 'E', 'Straling en materie', e, None, None)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

with open(path, 'r', encoding='utf-8') as f:
    v = f.read()
na_idx = v.find("{id:'na',naam:'Natuurkunde'")
be_idx = v.find("{id:'be',naam:'Bedrijfseconomie'", na_idx)
na_sec = v[na_idx:be_idx]
idx = na_sec.find("{id:'E',naam:'Straling en materie'")
oe_i = na_sec.find('   oe:[', idx)
block = na_sec[oe_i:]
print(f"  Domain E: {block.count('{bron:')} questions, double-bracket={block.count(chr(10)+'   ]'+chr(10)+'   ]')}")
