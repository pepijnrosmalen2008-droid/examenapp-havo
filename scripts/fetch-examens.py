import subprocess,re,json,sys
def get(u):
    try:return subprocess.run(['curl','-sSL','--compressed','--max-time','40',u],capture_output=True,timeout=50).stdout.decode('utf-8','ignore')
    except Exception as e:return ''
def ctype(u):
    try:r=subprocess.run(['curl','-sSI','--max-time','25',u],capture_output=True,timeout=30).stdout.decode('utf-8','ignore');
    except Exception:return ''
    m=re.search(r'content-type:\s*([^\r\n;]+)',r,re.I);return (m.group(1).strip() if m else '')
# slagio vakId -> alleexamens naam
MAP={'havo':{'nl':'Nederlands','en':'Engels','wa':'Wiskunde-A','wb':'Wiskunde-B','be':'Bedrijfseconomie','ec':'Economie','bi':'Biologie','gs':'Geschiedenis','sk':'Scheikunde','na':'Natuurkunde','ak':'Aardrijkskunde','mw':'Maatschappijwetenschappen'},
     'vwo':{'nl':'Nederlands','en':'Engels','wa':'Wiskunde-A','wb':'Wiskunde-B','be':'Bedrijfseconomie','ec':'Economie','bi':'Biologie','gs':'Geschiedenis','sk':'Scheikunde','na':'Natuurkunde','ak':'Aardrijkskunde','mw':'Maatschappijwetenschappen','du':'Duits','fr':'Frans','gr':'Grieks','la':'Latijn'}}
NIV={'havo':'HAVO','vwo':'VWO'}
BAD=re.compile(r'oude.?stijl|pilot|compex|bb|kb|gl-tl',re.I)
out={}
for niv,vakmap in MAP.items():
    out[niv]={}
    for vid,vname in vakmap.items():
        html=get(f'https://www.alleexamens.nl/examens/{NIV[niv]}/{vname}/')
        urls=re.findall(r'https://static\.alleexamens\.nl/[^"\'<> ]+\.pdf',html)
        urls=[u.replace('&amp;','&') for u in urls if not BAD.search(u)]
        # kies nieuwste jaar met een opgaven-pdf, tijdvak I voorkeur
        def parse(u):
            m=re.search(r'/(20\d\d)/([IV]+)/',u); 
            return (int(m.group(1)),m.group(2)) if m else (0,'')
        years=sorted({parse(u)[0] for u in urls if parse(u)[0]},reverse=True)
        chosen=None
        for y in years:
            for tv in ['I','II']:
                grp={t:None for t in ['opgaven','correctievoorschrift','bijlage','uitwerkbijlage']}
                for u in urls:
                    yy,t=parse(u)
                    if yy!=y or t!=tv: continue
                    for typ in grp:
                        if re.search(r'_'+typ+r'\.pdf$',u,re.I) and not grp[typ]: grp[typ]=u
                if grp['opgaven'] and grp['correctievoorschrift']:
                    chosen={'jaar':y,'tijdvak':1 if tv=='I' else 2,**grp};break
            if chosen:break
        if not chosen:
            out[niv][vid]={'error':'geen opgaven+cv gevonden','n_urls':len(urls)};print(f'MISS {niv} {vid}',file=sys.stderr);continue
        out[niv][vid]=chosen
        print(f'OK {niv} {vid} {chosen["jaar"]} T{chosen["tijdvak"]}',file=sys.stderr)
json.dump(out,open(sys.argv[1],'w'),indent=1,ensure_ascii=False)
print('written',sys.argv[1],file=sys.stderr)
