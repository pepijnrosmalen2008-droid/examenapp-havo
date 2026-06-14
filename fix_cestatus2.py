path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Insert ceStatus after specific domain lines (0-indexed = line - 1)
# Each insertion shifts subsequent line numbers by 1
# Process in REVERSE order so earlier insertions don't affect later line numbers

inserts = [
    # (line_number_1based, ceStatus_value)
    (6805, 'SE'),   # F Literatuur
    (6776, 'CE'),   # E Argumentatieve vaardigheden
    (6751, 'SE'),   # D Samenvatten
    (6724, 'SE'),   # C Schrijfvaardigheid
    (6699, 'SE'),   # B Mondelinge taalvaardigheid
]

for lineno, status in inserts:
    idx = lineno - 1  # 0-indexed
    lines.insert(idx + 1, f"   ceStatus:'{status}',\n")

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

# Verify
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

checks = [
    ("nl B SE", "naam:'Mondelinge taalvaardigheid'" in content),
    ("nl C SE", "naam:'Schrijfvaardigheid'" in content),
    ("nl D SE", "naam:'Samenvatten'" in content),
    ("nl E CE", "naam:'Argumentatieve vaardigheden'" in content),
    ("nl F SE", "naam:'Literatuur',beschrijving:'Literaire begrippen" in content),
]
# Check ceStatus count in nl range
import re
nl_match = re.findall(r"ceStatus:'(CE[^']*|SE)'", content[content.find("{id:'nl'"):content.find("{id:'wa'")])
print("nl ceStatus values:", nl_match)
