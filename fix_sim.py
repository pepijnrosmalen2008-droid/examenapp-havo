path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Fix 1: CE-only domain filter in startSimToets
c = c.replace(
    "  // Build question pool: 2 MC (sv) + 1 open (oe) per domain\n  vak.domeinen.forEach(d=>{",
    "  // Build question pool: 2 MC (sv) + 1 open (oe) per CE domain only\n  const ceDomeinen=vak.domeinen.filter(d=>d.ceStatus&&d.ceStatus!=='SE');\n  ceDomeinen.forEach(d=>{"
)

c = c.replace(
    "  document.getElementById('sim-setup-desc').textContent='Alle '+vak.domeinen.length+' domeinen, '+total+' vragen ('+mcN+' MC + '+oeN+' open).';",
    "  document.getElementById('sim-setup-desc').textContent=ceDomeinen.length+' CE-domeinen, '+total+' vragen ('+mcN+' MC + '+oeN+' open).';"
)

c = c.replace(
    "    <div class=\"sim-info-card\"><div class=\"sim-info-num\">${vak.domeinen.length}</div><div class=\"sim-info-lbl\">Domeinen</div></div>`;",
    "    <div class=\"sim-info-card\"><div class=\"sim-info-num\">${ceDomeinen.length}</div><div class=\"sim-info-lbl\">CE-domeinen</div></div>`;"
)

# Fix 2: open area display='' → display='block' so CSS class doesn't hide it
c = c.replace(
    "    openArea.style.display='';\n    document.getElementById('sim-open-ta').value='';",
    "    openArea.style.display='block';\n    document.getElementById('sim-open-ta').value='';"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

# Verify
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

checks = [
    ("ceDomeinen filter", "const ceDomeinen=vak.domeinen.filter" in content),
    ("CE-domeinen label", "CE-domeinen" in content),
    ("openArea block", "openArea.style.display='block'" in content),
]
for name, ok in checks:
    print(f"{'OK' if ok else 'FAIL'}: {name}")
