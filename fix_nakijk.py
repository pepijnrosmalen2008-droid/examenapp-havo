path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    "  document.getElementById('sim-model-blok').style.display='';\n}",
    "  document.getElementById('sim-model-blok').style.display='block';\n}",
    1
)

# Also fix the simShowQ reset line (hides it again — that one is correct with 'none')
with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

ok = "sim-model-blok').style.display='block'" in c
print("OK" if ok else "FAIL")
