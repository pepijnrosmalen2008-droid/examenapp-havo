import sys, types, glob, os
# Stub de kapotte cryptography-module (alleen nodig voor versleutelde PDF's; syllabi zijn dat niet)
class _Any(types.ModuleType):
    def __getattr__(self, n): 
        v=_Any(n); sys.modules.setdefault(self.__name__+'.'+n, v); return v
    def __call__(self,*a,**k): return None
for m in ['cryptography','cryptography.hazmat','cryptography.hazmat.primitives',
          'cryptography.hazmat.primitives.ciphers','cryptography.hazmat.primitives.ciphers.algorithms',
          'cryptography.hazmat.primitives.ciphers.modes','cryptography.hazmat.backends',
          'cryptography.exceptions','cryptography.hazmat.primitives.padding']:
    sys.modules[m]=_Any(m)
from pdfminer.high_level import extract_text
ok=0; low=[]
for p in sorted(glob.glob('syllabi/2027/*.pdf')):
    txt=p[:-4]+'.txt'
    try:
        t=extract_text(p)
        open(txt,'w').write(t)
        wc=len(t.split())
        print(f"{os.path.basename(p):16} {wc:6} woorden")
        if wc<300: low.append((os.path.basename(p),wc))
        ok+=1
    except Exception as e:
        print(f"{os.path.basename(p):16} ERROR {e}"); low.append((p,str(e)))
print(f"\n{ok} geconverteerd; {len(low)} verdacht")
for b in low: print("  LOW:", b)
