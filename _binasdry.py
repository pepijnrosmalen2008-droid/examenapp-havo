# -*- coding: utf-8 -*-
# DRY-RUN: woord-formules -> BINAS-notatie. Veilig gescoped met woordgrenzen.
import re
src = open('data.js', encoding='utf-8').read()
SUP = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'}

def to_sup(d): return ''.join(SUP.get(c, c) for c in d)

def binas(t):
    # wetenschappelijke notatie: "10 tot de (macht) 8(ste/de)" -> 10⁸
    t = re.sub(r'10 tot de (?:macht )?(\d+)(?:ste|de)?\b', lambda m: '10' + to_sup(m.group(1)), t)
    # "half maal " -> "½·"
    t = re.sub(r'\bhalf maal\s+', '½·', t)
    # " maal " -> "·", maar NIET vóór een Nederlands functiewoord (de/het/een/afg/van/met)
    t = re.sub(r'\s+maal\s+(?!(?:de|het|een|afg|van|met)\b)', '·', t)
    # kwadraat (machtsverheffing) -> ², behalve zelfst. nw. "kwadraat aanvullen/van"
    t = re.sub(r'([0-9A-Za-z)²]) kwadraat\b(?!\s+aanvul)(?!\s+van)', r'\1²', t)
    # Griekse letters die altijd wiskunde zijn (heel woord)
    for w, g in [('lambda','λ'),('sigma','σ'),('theta','θ'),('mu','μ')]:
        t = re.sub(r'\b' + w + r'\b', g, t)
    # delta -> Δ ALLEEN vóór een losse variabele-letter (Δv/Δt/Δx), niet "delta(-systemen)"
    t = re.sub(r'\bdelta\s+([A-Za-z])(?![A-Za-z])', r'Δ\1', t)
    return t

# verzamel veranderde sub-strings (per gequote string) voor review
STR = re.compile(r"'(?:[^'\\]|\\.)*'")
seen = set()
OUT = []
for m in STR.finditer(src):
    raw = m.group(0)
    txt = raw[1:-1].replace("\\'", "'")
    nw = binas(txt)
    if nw != txt and txt not in seen:
        seen.add(txt)
        OUT.append("%s\n   -> %s\n" % (txt[:160], nw[:160]))
open('_binasdry.txt', 'w', encoding='utf-8').write("Gewijzigde strings: %d\n\n" % len(OUT) + "\n".join(OUT))
print("dry-run: %d unieke strings veranderen -> _binasdry.txt" % len(OUT))
