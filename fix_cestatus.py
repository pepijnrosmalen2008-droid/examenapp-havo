path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Add ceStatus to nl HAVO domains (they currently have none)
# Domain A - Leesvaardigheid -> CE+SE
c = c.replace(
    "  {id:'A',naam:'Leesvaardigheid',beschrijving:'Tekstbegrip, tekststructuur en argumentatieve teksten',\n   onderwerpen:",
    "  {id:'A',naam:'Leesvaardigheid',beschrijving:'Tekstbegrip, tekststructuur en argumentatieve teksten',\n   ceStatus:'CE+SE',\n   onderwerpen:"
)

# Domain B - Mondeling -> SE
c = c.replace(
    "  {id:'B',naam:'Mondelinge taalvaardigheid',beschrijving:'Spreekbeurt, debat, presentatie en luistervaardigheid (schoolexamen)',\n   binas",
    "  {id:'B',naam:'Mondelinge taalvaardigheid',beschrijving:'Spreekbeurt, debat, presentatie en luistervaardigheid (schoolexamen)',\n   ceStatus:'SE',\n   binas"
)

# Domain C - Schrijfvaardigheid -> SE
c = c.replace(
    "  {id:'C',naam:'Schrijfvaardigheid',beschrijving:'Betoog, beschouwing en zakelijke teksten schrijven (schoolexamen)',\n   binas",
    "  {id:'C',naam:'Schrijfvaardigheid',beschrijving:'Betoog, beschouwing en zakelijke teksten schrijven (schoolexamen)',\n   ceStatus:'SE',\n   binas"
)

# Domain D - Samenvatten -> SE
c = c.replace(
    "  {id:'D',naam:'Samenvatten',beschrijving:'Hoofdgedachte, kernzinnen en samenvatting schrijven (schoolexamen)',\n   binas",
    "  {id:'D',naam:'Samenvatten',beschrijving:'Hoofdgedachte, kernzinnen en samenvatting schrijven (schoolexamen)',\n   ceStatus:'SE',\n   binas"
)

# Domain E - Argumentatieve vaardigheden -> CE
c = c.replace(
    "  {id:'E',naam:'Argumentatieve vaardigheden',beschrijving:'Argumentatiestructuur, drogredenen en betogende teksten beoordelen (CE)',\n   binas",
    "  {id:'E',naam:'Argumentatieve vaardigheden',beschrijving:'Argumentatiestructuur, drogredenen en betogende teksten beoordelen (CE)',\n   ceStatus:'CE',\n   binas"
)

# Domain F - Literatuur -> SE
c = c.replace(
    "  {id:'F',naam:'Literatuur',beschrijving:'Literaire begrippen, stromingen en tekstanalyse',\n   binas",
    "  {id:'F',naam:'Literatuur',beschrijving:'Literaire begrippen, stromingen en tekstanalyse',\n   ceStatus:'SE',\n   binas"
)

# Also make the sim filter robust: if ceStatus missing, include the domain
# (fallback for vakken not yet updated)
c = c.replace(
    "  const ceDomeinen=vak.domeinen.filter(d=>d.ceStatus&&d.ceStatus!=='SE');",
    "  const ceDomeinen=vak.domeinen.filter(d=>!d.ceStatus||d.ceStatus!=='SE');"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

# Verify
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

checks = [
    ("nl A ceStatus CE+SE", "naam:'Leesvaardigheid',beschrijving:'Tekstbegrip" in content and "ceStatus:'CE+SE'" in content),
    ("nl B ceStatus SE", "naam:'Mondelinge taalvaardigheid'" in content and "ceStatus:'SE'" in content),
    ("nl E ceStatus CE", "naam:'Argumentatieve vaardigheden'" in content and "ceStatus:'CE'" in content),
    ("robust filter", "!d.ceStatus||d.ceStatus!=='SE'" in content),
]
for name, ok in checks:
    print(f"{'OK' if ok else 'FAIL'}: {name}")
