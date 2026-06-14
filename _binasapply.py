# -*- coding: utf-8 -*-
import re
src = open('data.js', encoding='utf-8').read()
SUP = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'}
def to_sup(d): return ''.join(SUP.get(c, c) for c in d)
def binas(t):
    t = re.sub(r'10 tot de (?:macht )?(\d+)(?:ste|de)?\b', lambda m: '10' + to_sup(m.group(1)), t)
    t = re.sub(r'\bhalf maal\s+', '½·', t)
    t = re.sub(r'\s+maal\s+(?!(?:de|het|een|afg|van|met)\b)', '·', t)
    t = re.sub(r'([0-9A-Za-z)²]) kwadraat\b(?!\s+aanvul)(?!\s+van)', r'\1²', t)
    for w, g in [('lambda', 'λ'), ('sigma', 'σ'), ('theta', 'θ'), ('mu', 'μ')]:
        t = re.sub(r'\b' + w + r'\b', g, t)
    t = re.sub(r'\bdelta\s+([A-Za-z])(?![A-Za-z])', r'Δ\1', t)
    return t
STR = re.compile(r"'(?:[^'\\]|\\.)*'")
n_before = len(STR.findall(src))
changed = [0]
def repl(m):
    raw = m.group(0)
    inner = raw[1:-1]
    nw = binas(inner)
    if nw != inner:
        changed[0] += 1
        return "'" + nw + "'"
    return raw
out = STR.sub(repl, src)
n_after = len(STR.findall(out))
open('data.js', 'w', encoding='utf-8').write(out)
print("string-literals voor/na: %d / %d  (gelijk=veilig: %s) · gewijzigd: %d"
      % (n_before, n_after, n_before == n_after, changed[0]))
