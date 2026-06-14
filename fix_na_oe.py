"""Replace na HAVO oe arrays for domains B, C, D, E using str.replace()."""
path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

S = '\\n'  # JS escape sequence \n (2 chars)

def q(bron, ctx, v, o, u):
    return "{bron:'" + bron + "',ctx:'" + ctx + "',v:'" + v + "',o:[''],c:0,u:'" + u + "'}"

def replace_oe(content, dom_id, dom_name, questions, next_id, next_name):
    marker = "{id:'" + dom_id + "',naam:'" + dom_name + "'"
    # Find HAVO na section first
    na_idx = content.find("{id:'na',naam:'Natuurkunde'")
    assert na_idx >= 0, "HAVO na not found"
    na_end = content.find("{id:'be',naam:'Bedrijfseconomie'", na_idx)
    assert na_end >= 0, "End of na not found"
    na_section_start = na_idx

    idx = content.find(marker, na_section_start)
    assert idx >= 0 and idx < na_end, f"Domain {dom_id} not found in na"

    oe_start = content.find('   oe:[', idx)
    assert oe_start >= 0 and oe_start < na_end

    if next_id:
        close_marker = '\n   ]},\n  {' + "id:'" + next_id + "',naam:'" + next_name + "'"
    else:
        # Last domain — find the end of the vak object
        # Pattern: \n   ]}\n ]}, OR \n   ]}\n ]}
        for cm in ['\n   ]}\n ]},', '\n   ]}\n ]}', '\n   ]},\n ]}']:
            idx_test = content.find(cm, oe_start)
            if idx_test >= 0:
                close_marker = cm
                break
        else:
            raise AssertionError(f"No close marker found for last domain {dom_id}")

    close_idx = content.find(close_marker, oe_start)
    assert close_idx >= 0, f"Close marker not found for {dom_id}: {repr(close_marker[:40])}"

    new_oe = '   oe:[\n' + ',\n'.join(questions)
    old = content[oe_start:close_idx]
    result = content[:oe_start] + new_oe + content[close_idx:]
    print(f"  {dom_id}: replaced {len(old)} chars with {len(new_oe)} chars")
    return result

# ── Domain B ──────────────────────────────────────────────────────────────
b = [
    q("Artikel – fictief (2026)",
      "Artikel (\xb1350 woorden): \\'Hoe geluidsgolven zich gedragen in moderne concertzalen\\'. Het artikel bespreekt reflectie, absorptie en interferentie. Foto-beschrijving: \\'Binnenkant van een moderne concertzaal met geluidsabsorberende panelen en reflecterende houten wanden\\'.",
      "(a) Leg uit waarom zowel absorptie als reflectie nodig zijn voor goede akoestiek." + S + "(b) Noem \xe9\xe9n natuurkundig gevolg van te veel reflectie.",
      "",
      "(a) Absorptie voorkomt dat geluid te lang blijft hangen, waardoor nagalm wordt beperkt. Reflectie zorgt ervoor dat geluid gelijkmatig door de zaal wordt verspreid. De combinatie zorgt voor helder geluid zonder echo\\'s. (b) Te veel reflectie kan leiden tot echo\\'s of een onduidelijk geluidsbeeld doordat geluidsgolven elkaar overlappen."),
    q("Grafiekbeschrijving – fictief",
      "Grafiek: \\'Frequentiespectrum van een viooltoon\\'. De grafiek toont een sterke grondtoon op 440 Hz en meerdere boventonen op 880 Hz, 1320 Hz en 1760 Hz.",
      "Leg uit waarom een viooltoon meerdere pieken in het frequentiespectrum heeft.",
      "",
      "Een vioolsnaar trilt niet alleen in zijn grondfrequentie, maar ook in hogere harmonischen. Deze boventonen ontstaan door trillingsmodi van de snaar. De combinatie van grondtoon en boventonen bepaalt de klankkleur van het instrument."),
    q("Foto-beschrijving – fictief",
      "Foto: \\'Watergolven in een golfbak die door een smalle opening gaan en zich daarna waaiervormig verspreiden\\'.",
      "Leg uit waarom de golven zich waaiervormig verspreiden na de opening.",
      "",
      "Wanneer golven door een opening gaan die kleiner is dan enkele golflengtes, treedt diffractie op. Hierdoor buigen de golven af en verspreiden ze zich in alle richtingen. Dit effect is sterker bij grotere golflengtes."),
    q("Artikel – fictief (2026)",
      "Artikel (\xb1300 woorden): \\'Waarom r\xf6ntgenstraling door weefsel gaat maar niet door bot\\'.",
      "Leg uit waarom r\xf6ntgenstraling botten duidelijk zichtbaar maakt op een r\xf6ntgenfoto.",
      "",
      "Botten bevatten veel calcium, dat een hogere dichtheid heeft dan zacht weefsel. Hierdoor absorberen botten meer r\xf6ntgenstraling. Op de foto verschijnen botten daarom licht, terwijl weefsel donker blijft."),
    q("Grafiekbeschrijving – fictief",
      "Grafiek: \\'Intensiteit van licht achter een dubbele spleet\\'. De grafiek toont een interferentiepatroon met meerdere maxima en minima.",
      "Leg uit hoe het interferentiepatroon ontstaat.",
      "",
      "Lichtgolven uit beide spleten overlappen elkaar. Waar de golven in fase zijn, versterken ze elkaar en ontstaat een maximum. Waar ze tegenfase hebben, doven ze elkaar uit en ontstaat een minimum. Dit leidt tot het karakteristieke patroon."),
]

# ── Domain C ──────────────────────────────────────────────────────────────
C = [
    q("Artikel – fictief (2026)",
      "Artikel (\xb1350 woorden): \\'De rol van sensoren in moderne auto\\'s\\'. Foto-beschrijving: \\'Auto met radarsensoren aan de voorzijde en een lidar-sensor op het dak\\'.",
      "Leg uit hoe een afstandssensor op basis van ultrasoon geluid de afstand tot een object bepaalt.",
      "",
      "De sensor zendt een ultrasone puls uit die terugkaatst tegen een object. De tijd tussen uitzenden en ontvangen wordt gemeten. Met de formule s = v\xb7t/2 wordt de afstand berekend. De deling door twee is nodig omdat het signaal heen en terug reist."),
    q("Grafiekbeschrijving – fictief",
      "Snelheid-tijd grafiek: Een auto versnelt van 0 naar 20 m/s in 5 s, rijdt constant 10 s en remt daarna in 4 s tot stilstand.",
      "(a) Bereken de versnelling tijdens de eerste 5 seconden." + S + "(b) Bereken de totale afgelegde afstand.",
      "",
      "(a) De versnelling is Δv/Δt = 20/5 = 4 m/s\xb2. (b) De afstand tijdens versnellen is 0,5\xb75\xb720 = 50 m. Tijdens constante snelheid: 20\xb710 = 200 m. Tijdens remmen: 0,5\xb74\xb720 = 40 m. Totaal: 290 m."),
    q("Foto-beschrijving – fictief",
      "Foto: \\'Skater die een helling afgaat met een meetlat op de achtergrond\\'.",
      "Leg uit waarom de snelheid van de skater toeneemt tijdens het afdalen.",
      "",
      "Tijdens het afdalen wordt zwaarte-energie omgezet in bewegingsenergie. De component van de zwaartekracht langs de helling zorgt voor een versnelling. Wrijvingskrachten zijn kleiner dan de zwaartekrachtcomponent, waardoor de skater versnelt."),
    q("Artikel – fictief (2026)",
      "Artikel (\xb1300 woorden): \\'Botsproeven in de auto-industrie\\'.",
      "Leg uit waarom kreukelzones de veiligheid van inzittenden vergroten.",
      "",
      "Kreukelzones vergroten de tijd waarin de auto tot stilstand komt tijdens een botsing. Hierdoor wordt de kracht op inzittenden kleiner volgens F = Δp/Δt. De energie wordt geabsorbeerd door vervorming van de carrosserie."),
    q("Grafiekbeschrijving – fictief",
      "Grafiek: \\'Kracht als functie van uitrekking van een veer\\'. De grafiek is een rechte lijn door de oorsprong.",
      "Leg uit wat deze grafiek zegt over de veer en noem de bijbehorende natuurkundige wet.",
      "",
      "De rechte lijn door de oorsprong toont dat kracht en uitrekking recht evenredig zijn. Dit betekent dat de veer zich elastisch gedraagt. De bijbehorende wet is de wet van Hooke: F = C\xb7u."),
]

# ── Domain D ──────────────────────────────────────────────────────────────
d = [
    q("Artikel – fictief (2026)",
      "Artikel (\xb1350 woorden): \\'Hoe bliksem ontstaat\\'. Foto-beschrijving: \\'Onweerswolk met zichtbare bliksemschicht\\'.",
      "Leg uit hoe ladingverdeling in een onweerswolk leidt tot bliksem.",
      "",
      "In een onweerswolk scheiden positieve en negatieve ladingen door wrijving tussen ijskristallen. Hierdoor ontstaat een groot potentiaalverschil tussen wolk en aarde. Wanneer dit verschil te groot wordt, springt er een vonk over: bliksem."),
    q("Tabelbeschrijving – fictief",
      "Tabel: \\'Spanning en stroomsterkte van vier verschillende weerstanden\\'.",
      "Leg uit hoe je met de tabel kunt bepalen welke weerstand de grootste waarde heeft.",
      "",
      "Volgens de wet van Ohm geldt R = U/I. De weerstand met de grootste verhouding tussen spanning en stroomsterkte heeft de grootste waarde. Door de waarden per weerstand te vergelijken, bepaal je welke het grootst is."),
    q("Foto-beschrijving – fictief",
      "Foto: \\'Elektrisch circuit met batterij, lampje en schakelaar\\'.",
      "Leg uit waarom het lampje uitgaat wanneer de schakelaar wordt geopend.",
      "",
      "Bij een open schakelaar wordt de stroomkring onderbroken. Hierdoor kan er geen elektrische stroom meer lopen. Zonder stroom krijgt het lampje geen energie en gaat het uit."),
    q("Artikel – fictief (2026)",
      "Artikel (\xb1300 woorden): \\'Waarom hoogspanningskabels zo hoog hangen\\'.",
      "Leg uit waarom elektriciteit over grote afstanden met hoge spanning wordt getransporteerd.",
      "",
      "Bij hoge spanning is de stroomsterkte kleiner voor hetzelfde vermogen. Hierdoor zijn de verliezen door warmteontwikkeling in kabels kleiner, omdat Pverlies = I\xb2\xb7R. Dit maakt transport effici\xebnter."),
    q("Grafiekbeschrijving – fictief",
      "Grafiek: \\'Elektrisch vermogen als functie van stroomsterkte bij constante spanning\\'.",
      "Leg uit waarom het vermogen toeneemt bij grotere stroomsterkte.",
      "",
      "Het vermogen wordt gegeven door P = U\xb7I. Bij constante spanning is het vermogen recht evenredig met de stroomsterkte. Daarom stijgt het vermogen wanneer de stroomsterkte toeneemt."),
]

# ── Domain E ──────────────────────────────────────────────────────────────
e = [
    q("Artikel – fictief (2026)",
      "Artikel (\xb1350 woorden): \\'Hoe MRI-scanners werken\\'.",
      "Leg uit waarom MRI geen schadelijke straling gebruikt en toch beelden kan maken.",
      "",
      "MRI gebruikt radiogolven en sterke magnetische velden, geen ioniserende straling. De waterstofkernen in het lichaam reageren op deze velden en zenden signalen uit. Deze signalen worden omgezet in beelden."),
    q("Grafiekbeschrijving – fictief",
      "Grafiek: \\'Doordringend vermogen van verschillende soorten straling\\'.",
      "Leg uit waarom gammastraling gevaarlijker is dan alfastraling.",
      "",
      "Gammastraling heeft een veel groter doordringend vermogen en kan diep in het lichaam doordringen. Hierdoor kan het cellen beschadigen die niet direct aan de bron grenzen. Alfastraling wordt al door de huid tegengehouden."),
    q("Foto-beschrijving – fictief",
      "Foto: \\'Rookmelder met radioactieve bron (americium-241)\\'.",
      "Leg uit waarom een rookmelder een kleine hoeveelheid radioactieve stof bevat.",
      "",
      "De bron ioniseert de lucht in de meetkamer, waardoor er een kleine stroom loopt. Wanneer rook de kamer binnendringt, wordt de ionisatie verstoord en verandert de stroom. De rookmelder detecteert deze verandering."),
    q("Artikel – fictief (2026)",
      "Artikel (\xb1300 woorden): \\'Stralingsbescherming in ziekenhuizen\\'.",
      "Leg uit waarom lood vaak wordt gebruikt als bescherming tegen r\xf6ntgenstraling.",
      "",
      "Lood heeft een hoge dichtheid, waardoor het r\xf6ntgenstraling sterk absorbeert. Hierdoor wordt de dosis voor personeel en pati\xebnten beperkt. Het materiaal is daarom geschikt voor schorten en wanden."),
    q("Grafiekbeschrijving – fictief",
      "Grafiek: \\'Activiteit van een radioactieve bron als functie van tijd\\'. De grafiek toont een exponenti\xeble afname.",
      "Leg uit waarom de activiteit exponentieel afneemt.",
      "",
      "Bij radioactief verval heeft elke kern per tijdseenheid dezelfde kans om te vervallen. Hierdoor neemt het aantal kernen dat nog kan vervallen steeds sneller af. Dit leidt tot een exponenti\xeble daling van de activiteit."),
]

print("Replacing na HAVO oe arrays...")
c = replace_oe(c, 'B', 'Golven', b, 'C', 'Beweging en wisselwerking')
c = replace_oe(c, 'C', 'Beweging en wisselwerking', C, 'D', 'Lading en veld')
c = replace_oe(c, 'D', 'Lading en veld', d, 'E', 'Straling en materie')
c = replace_oe(c, 'E', 'Straling en materie', e, None, None)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

# Verify
with open(path, 'r', encoding='utf-8') as f:
    v = f.read()

na_idx = v.find("{id:'na',naam:'Natuurkunde'")
be_idx = v.find("{id:'be',naam:'Bedrijfseconomie'", na_idx)
na_sec = v[na_idx:be_idx]

for dom, naam in [('B','Golven'),('C','Beweging en wisselwerking'),('D','Lading en veld'),('E','Straling en materie')]:
    idx = na_sec.find("{id:'" + dom + "',naam:'" + naam + "'")
    oe_i = na_sec.find('   oe:[', idx)
    next_dom = na_sec.find("\n  {id:", oe_i)
    block = na_sec[oe_i:next_dom if next_dom > 0 else len(na_sec)]
    bron_count = block.count('{bron:')
    double = block.count('   ]\n   ]')
    print(f"  Domain {dom}: {bron_count} questions, double-bracket={double}")
