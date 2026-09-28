// ═══════════════════════════════════════════════════════════════════════
// kingdom.js - Slagio Kingdom: je eiland groeit mee met wat je écht beheerst
// ───────────────────────────────────────────────────────────────────────
// Lazy geladen via kingdomOpen() (init.js). Elk vak is een wijk met vier
// gebouwen. Een gebouw komt vrij door BEHEERSTE leerdoelen (ldMastery ≥ 80%),
// nooit door XP: zo wordt leren letterlijk zichtbaar. Drempels, stand per vak
// en opslag (kdVakStand/kdStaat/kdBewaar) staan in init.js.
//
//   leren → beheersing → bouwen → je eiland groeit → reden om verder te leren
//
// Alles is getekend met een kleine isometrische SVG-engine (blokken, daken,
// koepels, cilinders) zodat gebouwen scherp zijn op elk formaat en niets hoeft
// te laden. Dag/nacht volgt je klok; 's nachts gaan de lichten aan.
// ═══════════════════════════════════════════════════════════════════════

// ═══════ ISO-ENGINE ═══════
const KTW=64,KTH=32;
const KD={cam:{x:0,y:0,s:.4},vw:0,vh:0,wereld:null,sel:null,raf:0,nieuw:null,timers:[]};
function kp(x,y,z){return [(x-y)*KTW/2,(x+y)*KTH/2-(z||0)];}
function kpt(a){return a[0].toFixed(1)+','+a[1].toFixed(1);}
function kpoly(pts,fill,extra){return `<polygon points="${pts.map(kpt).join(' ')}" fill="${fill}"${extra||''}/>`;}
function khex(c){c=c.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');return [0,2,4].map(i=>parseInt(c.substr(i,2),16));}
function kshade(c,f){if(!/^#/.test(c))return c;const [r,g,b]=khex(c);const m=v=>Math.round(f>=0?v+(255-v)*f:v*(1+f));return '#'+[m(r),m(g),m(b)].map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('');}
const KL=' stroke-linejoin="round"';
function kstroke(c){return ` stroke="${kshade(c,-.38)}" stroke-width=".7" stroke-opacity=".75"${KL}`;}
// Gevel met licht: boven iets lichter, onderaan donkerder (ambient occlusion bij de grond).
function kvg(c){return /^#/.test(c)?`url(#${kgrad(c,'v')})`:c;}
// Blok met drie zichtbare vlakken (links = y+d-zijde, rechts = x+w-zijde, boven).
function kbox(x,y,z,w,d,h,c,o){
  o=o||{};const op=o.op!=null?` opacity="${o.op}"`:'';const st=o.geenLijn?'':kstroke(c);
  let s=`<g${op}>`;
  s+=kpoly([kp(x,y+d,z),kp(x+w,y+d,z),kp(x+w,y+d,z+h),kp(x,y+d,z+h)],o.vlak?o.links||c:kvg(o.links||c),st);
  s+=kpoly([kp(x+w,y,z),kp(x+w,y+d,z),kp(x+w,y+d,z+h),kp(x+w,y,z+h)],o.vlak?o.rechts||kshade(c,-.2):kvg(o.rechts||kshade(c,-.22)),st);
  s+=kpoly([kp(x,y,z+h),kp(x+w,y,z+h),kp(x+w,y+d,z+h),kp(x,y+d,z+h)],o.top||kshade(c,.2),st);
  if(o.ramen)s+=kramen(x,y,z,w,d,h,o.ramen);
  return s+'</g>';
}
// Ramen op beide zichtbare gevels. r:{rij, kol, kleur, marge, deur}
function kramen(x,y,z,w,d,h,r){
  const kol=r.kol||2,rij=r.rij||1,mz=r.mz||6,hz=(h-mz*2)/rij;let kl=r.kleur||'#1e293b';let s='';
  if(/^#/.test(kl)){const [a,b,c2]=khex(kl);if(a*.3+b*.59+c2*.11<90)kl='url(#kd-glas)';}
  const raam=(pts)=>`<polygon class="kd-raam" points="${pts.map(kpt).join(' ')}" fill="${kl}"/>`;
  for(let i=0;i<rij;i++){const z0=z+mz+i*hz+hz*.2,z1=z0+hz*.55;
    for(let j=0;j<kol;j++){const u0=(j+.25)/kol*w,u1=(j+.75)/kol*w;s+=raam([kp(x+u0,y+d,z0),kp(x+u1,y+d,z0),kp(x+u1,y+d,z1),kp(x+u0,y+d,z1)]);}
    const kr=r.kolR||kol;
    for(let j=0;j<kr;j++){const v0=(j+.25)/kr*d,v1=(j+.75)/kr*d;s+=raam([kp(x+w,y+v0,z0),kp(x+w,y+v1,z0),kp(x+w,y+v1,z1),kp(x+w,y+v0,z1)]);}}
  if(r.deur){const u=w*.5,dw=Math.min(.22,w*.25),dh=Math.min(16,h*.55);
    s+=kpoly([kp(x+u-dw/2,y+d,z),kp(x+u+dw/2,y+d,z),kp(x+u+dw/2,y+d,z+dh),kp(x+u-dw/2,y+d,z+dh)],r.deur);}
  return s;
}
// Zadeldak, nok evenwijdig aan x. Achterkant eerst (schilder-volgorde).
function kgable(x,y,z,w,d,rh,c,gevel){
  const ov=.06;x-=ov;y-=ov;w+=ov*2;d+=ov*2;const st=kstroke(c);let s='';
  s+=kpoly([kp(x,y,z),kp(x+w,y,z),kp(x+w,y+d/2,z+rh),kp(x,y+d/2,z+rh)],kshade(c,-.12),st);
  s+=kpoly([kp(x,y+d,z),kp(x+w,y+d,z),kp(x+w,y+d/2,z+rh),kp(x,y+d/2,z+rh)],c,st);
  s+=kpoly([kp(x+w-ov,y+ov,z),kp(x+w-ov,y+d-ov,z),kp(x+w-ov,y+d/2,z+rh)],gevel||kshade(c,-.25),st);
  return s;
}
// Piramidedak (ook voor torens).
function kpyr(x,y,z,w,d,rh,c){
  const A=kp(x+w/2,y+d/2,z+rh),st=kstroke(c);let s='';
  s+=kpoly([kp(x,y,z),kp(x+w,y,z),A],kshade(c,-.1),st);s+=kpoly([kp(x,y,z),kp(x,y+d,z),A],kshade(c,-.05),st);
  s+=kpoly([kp(x,y+d,z),kp(x+w,y+d,z),A],c,st);s+=kpoly([kp(x+w,y,z),kp(x+w,y+d,z),A],kshade(c,-.22),st);
  return s;
}
// Verticale cilinder; r in tegels.
function kcyl(cx,cy,z,r,h,c,o){
  o=o||{};const [sx,sy]=kp(cx,cy,z);const rx=r*45.25,ry=r*22.63,t=sy-h;const id=kgrad(c);
  let s=`<path d="M${(sx-rx).toFixed(1)} ${sy.toFixed(1)}L${(sx-rx).toFixed(1)} ${t.toFixed(1)}A${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 0 ${(sx+rx).toFixed(1)} ${t.toFixed(1)}L${(sx+rx).toFixed(1)} ${sy.toFixed(1)}A${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 1 ${(sx-rx).toFixed(1)} ${sy.toFixed(1)}Z" fill="url(#${id})"${kstroke(c)}/>`;
  if(o.ringen)for(let i=1;i<=o.ringen;i++){const yy=sy-h*i/(o.ringen+1);s+=`<path d="M${(sx-rx).toFixed(1)} ${yy.toFixed(1)}A${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 0 ${(sx+rx).toFixed(1)} ${yy.toFixed(1)}" fill="none" stroke="${o.ringKleur||kshade(c,-.3)}" stroke-width="${o.ringDik||1.2}"/>`;}
  if(!o.geenTop)s+=`<ellipse cx="${sx.toFixed(1)}" cy="${t.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${o.top||kshade(c,.22)}"${kstroke(c)}/>`;
  return s;
}
// Koepel (halve bol) met glans.
function kdome(cx,cy,z,r,c,o){
  o=o||{};const [sx,sy]=kp(cx,cy,z);const rx=r*45.25,ry=r*22.63,hh=rx*(o.hoog||.95);const id=kgrad(c,true);
  return `<path class="${o.cls||''}" d="M${(sx-rx).toFixed(1)} ${sy.toFixed(1)}A${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 0 ${(sx+rx).toFixed(1)} ${sy.toFixed(1)}A${rx.toFixed(1)} ${hh.toFixed(1)} 0 0 0 ${(sx-rx).toFixed(1)} ${sy.toFixed(1)}Z" fill="url(#${id})"${kstroke(c)}/>`;
}
// Kegeldak op een cilinder.
function kcone(cx,cy,z,r,h,c){
  const [sx,sy]=kp(cx,cy,z);const rx=r*45.25*1.12,ry=r*22.63*1.12;
  return `<path d="M${(sx-rx).toFixed(1)} ${sy.toFixed(1)}L${sx.toFixed(1)} ${(sy-h).toFixed(1)}L${(sx+rx).toFixed(1)} ${sy.toFixed(1)}A${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 1 ${(sx-rx).toFixed(1)} ${sy.toFixed(1)}Z" fill="url(#${kgrad(c)})"${kstroke(c)}/>`;
}
// Gradiënten worden per kleur één keer aangemaakt.
const _KG=new Map();
function kgrad(c,rond){const k=(rond==='v'?'v':rond?'r':'l')+c;if(!_KG.has(k))_KG.set(k,'kg'+(KD.pre||'m')+_KG.size);return _KG.get(k);}
function kdefs(){let s='';_KG.forEach((id,k)=>{const rond=k[0]==='r',c=k.slice(1);
  if(k[0]==='v'){s+=`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${kshade(c,.1)}"/><stop offset=".7" stop-color="${c}"/><stop offset="1" stop-color="${kshade(c,-.2)}"/></linearGradient>`;return;}
  s+=rond?`<radialGradient id="${id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${kshade(c,.55)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${kshade(c,-.3)}"/></radialGradient>`
    :`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${kshade(c,.18)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${kshade(c,-.28)}"/></linearGradient>`;});return s;}
// Kleine 'bord'-emblemen voor op een gevel (billboard, altijd rechtop).
function kbord(x,y,z,inhoud,o){o=o||{};const [sx,sy]=kp(x,y,z);const r=o.r||9;
  return `<g transform="translate(${sx.toFixed(1)} ${sy.toFixed(1)})"><circle r="${r}" fill="${o.bg||'#fff'}" stroke="${o.rand||'#1e293b'}" stroke-width="1.4"/>${inhoud}</g>`;}
const KE={
  kruis:'<path d="M-2.2-6h4.4v3.8H6v4.4H2.2V6h-4.4V2.2H-6v-4.4h3.8z" fill="#ef4444"/>',
  kolf:'<path d="M-2-6h4v4l4 7H-6l4-7z" fill="#14b8a6"/>',
  tand:'<circle r="4.2" fill="none" stroke="#475569" stroke-width="2.6" stroke-dasharray="2.2 1.6"/><circle r="1.6" fill="#475569"/>',
  klok:'<circle r="6" fill="#fff" stroke="#1e293b" stroke-width="1"/><path d="M0-4V0l3 2" stroke="#1e293b" stroke-width="1.4" fill="none" stroke-linecap="round"/>',
  driehoek:'<path d="M0-6L6 5H-6z" fill="none" stroke="#6366f1" stroke-width="1.8" stroke-linejoin="round"/>',
  euro:'<text y="4" text-anchor="middle" font-size="11" font-weight="900" fill="#a16207" font-family="Inter,sans-serif">€</text>',
  boek:'<path d="M-6-4q3-2 6 0q3-2 6 0v9q-3-2-6 0q-3-2-6 0z" fill="#fef3c7" stroke="#92400e" stroke-width="1"/>',
  post:'<rect x="-6" y="-4" width="12" height="8" rx="1" fill="#fbbf24"/><path d="M-6-4l6 5 6-5" fill="none" stroke="#92400e" stroke-width="1.2"/>',
  code:'<text y="3.5" text-anchor="middle" font-size="9" font-weight="900" fill="#22d3ee" font-family="ui-monospace,monospace">{ }</text>',
};
function kvlag(x,y,z,paal,kleur){const [sx,sy]=kp(x,y,z);
  return `<g class="kd-vlag-g"><line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy-paal}" stroke="#475569" stroke-width="1.6"/><path class="kd-vlag" style="transform-origin:${sx}px ${sy-paal}px" d="M${sx} ${sy-paal}l14 3.5-14 4.5z" fill="${kleur}"/></g>`;}
function krook(x,y,z){const [sx,sy]=kp(x,y,z);
  return `<g class="kd-rook-g" transform="translate(${sx.toFixed(1)} ${sy.toFixed(1)})"><circle class="kd-rook" r="5"/><circle class="kd-rook r2" r="6"/><circle class="kd-rook r3" r="4.5"/></g>`;}
function kboom(x,y,s,c){const [sx,sy]=kp(x,y,0);s=s||1;c=c||'#4f9e45';const f=v=>v.toFixed(1);
  return `<g class="kd-boom"><ellipse cx="${f(sx+6*s)}" cy="${f(sy+.5)}" rx="${f(11*s)}" ry="${f(4*s)}" fill="rgba(24,40,14,.22)"/><path d="M${f(sx-1.8*s)} ${f(sy)}L${f(sx-1.1*s)} ${f(sy-12*s)}H${f(sx+1.1*s)}L${f(sx+1.8*s)} ${f(sy)}z" fill="#6b4226"/>`
    +`<circle cx="${f(sx+3.6*s)}" cy="${f(sy-13*s)}" r="${f(6.6*s)}" fill="url(#${kgrad(kshade(c,-.18),true)})"/><circle cx="${f(sx-3.8*s)}" cy="${f(sy-14*s)}" r="${f(7*s)}" fill="url(#${kgrad(c,true)})"/><circle cx="${f(sx)}" cy="${f(sy-19.5*s)}" r="${f(7.6*s)}" fill="url(#${kgrad(kshade(c,.06),true)})"/></g>`;}
function kden(x,y,s){const [sx,sy]=kp(x,y,0);s=s||1;const f=v=>v.toFixed(1);
  return `<g class="kd-boom"><ellipse cx="${f(sx+6*s)}" cy="${f(sy+.5)}" rx="${f(10*s)}" ry="${f(3.6*s)}" fill="rgba(24,40,14,.22)"/><rect x="${f(sx-1.4*s)}" y="${f(sy-8*s)}" width="${f(2.8*s)}" height="${f(8*s)}" fill="#5b3a21"/>`
    +`<path d="M${f(sx)} ${f(sy-30*s)}L${f(sx+9.5*s)} ${f(sy-7*s)}H${f(sx-9.5*s)}z" fill="url(#${kgrad('#2f6f3a')})"/><path d="M${f(sx)} ${f(sy-38*s)}L${f(sx+7*s)} ${f(sy-19*s)}H${f(sx-7*s)}z" fill="url(#${kgrad('#3a7f42')})"/></g>`;}
// Hoogte van een gebouwrecept (in px boven de grond), één keer gemeten. Voor de slagschaduw.
const _KH={};
function kdHoogte(naam){
  if(_KH[naam]!=null)return _KH[naam];let h=40;
  try{let m=document.getElementById('kd-meet');if(!m){m=document.createElementNS('http://www.w3.org/2000/svg','svg');m.id='kd-meet';m.setAttribute('aria-hidden','true');m.setAttribute('style','position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden');document.body.appendChild(m);}
    m.innerHTML=KB[naam](0,0,{a:'#888888'});const b=m.getBBox();h=Math.max(8,kp(1,1,5)[1]-b.y-6);m.innerHTML='';}catch(e){}
  return _KH[naam]=h;
}
function _kdHull(P){P=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const x=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const lo=[];for(const p of P){while(lo.length>=2&&x(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}
  const hi=[];for(const p of P.slice().reverse()){while(hi.length>=2&&x(hi[hi.length-2],hi[hi.length-1],p)<=0)hi.pop();hi.push(p);}
  return lo.slice(0,-1).concat(hi.slice(0,-1));}
// Slagschaduw op de grond: voetafdruk verschoven met de zon (links achter), dus naar rechts voor.
function kdSchaduw(x0,y0,x1,y1,h,z){
  const L=Math.min(3.4,h/28),dx=L*.95,dy=-L*.28;const vt=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
  const pts=_kdHull(vt.concat(vt.map(([a,b])=>[a+dx,b+dy])).map(([a,b])=>kp(a,b,z==null?5:z)));
  return `<polygon class="kd-schaduw" points="${pts.map(kpt).join(' ')}" fill="rgba(22,38,14,.2)"/>`;
}

// ═══════ GEBOUWEN ═══════
// Elk recept tekent binnen een vak van 2×2 tegels met oorsprong (x,y).
// p = palet van het vak: {a: accentkleur (vakkleur), d: donker accent}
const KB={
  hut:(x,y,p)=>kbox(x+.6,y+.6,0,.8,.8,22,'#fde68a',{ramen:{kol:1,rij:1,deur:'#92400e'}})+kgable(x+.6,y+.6,22,.8,.8,18,p.a),
  kas:(x,y,p)=>{let s=kbox(x+.4,y+.55,0,1.2,.9,20,'#a7f3d0',{op:.82,ramen:null});
    s+=kgable(x+.4,y+.55,20,1.2,.9,16,'#6ee7b7');
    for(let i=1;i<4;i++){const a=kp(x+.4+i*.3,y+1.45,0),b=kp(x+.4+i*.3,y+1.45,20);s+=`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#ecfdf5" stroke-width="1.3"/>`;}
    return s+kboom(x+.3,y+1.7,.5,'#22c55e');},
  lab:(x,y,p)=>kbox(x+.35,y+.35,0,1.3,1.3,34,'#f1f5f9',{ramen:{kol:3,rij:2,kleur:'#0f766e',deur:'#334155'}})+kdome(x+1,y+1,34,.42,'#5eead4')+kbord(x+.9,y+1.65,24,KE.kolf,{r:7}),
  ziekenhuis:(x,y,p)=>{let s=kbox(x+.25,y+.3,0,1.5,1.3,74,'#f8fafc',{ramen:{kol:4,rij:5,kleur:'#60a5fa',deur:'#1e3a8a'}});
    const [hx,hy]=kp(x+1,y+.95,74);s+=`<ellipse cx="${hx}" cy="${hy}" rx="18" ry="9" fill="#e2e8f0" stroke="#94a3b8"/><text x="${hx}" y="${hy+3.5}" text-anchor="middle" font-size="10" font-weight="900" fill="#64748b" font-family="Inter,sans-serif">H</text>`;
    return s+kbord(x+.9,y+1.6,52,KE.kruis,{r:10});},
  campus:(x,y,p)=>kbox(x+.2,y+.25,0,.65,.65,96,'#e2e8f0',{ramen:{kol:2,rij:7,kleur:'#38bdf8'}})+kbox(x+.85,y+.5,52,.5,.3,8,'#cbd5e1')+kbox(x+1.15,y+1.05,0,.65,.65,118,'#f1f5f9',{ramen:{kol:2,rij:8,kleur:'#38bdf8',deur:'#0f172a'}})+kdome(x+1.475,y+1.375,118,.26,p.a)+kvlag(x+1.475,y+1.375,138,16,p.a),
  schuur:(x,y,p)=>kbox(x+.5,y+.55,0,1,.8,22,'#fca5a5',{ramen:{kol:2,rij:1,deur:'#7f1d1d'}})+kgable(x+.5,y+.55,22,1,.8,16,'#7f1d1d')+kbox(x+1.25,y+.6,30,.14,.14,18,'#57534e')+krook(x+1.32,y+.67,48),
  raffinaderij:(x,y,p)=>kcyl(x+.55,y+.6,0,.3,40,'#cbd5e1',{ringen:2})+kcyl(x+1.2,y+.55,0,.22,30,'#e2e8f0',{ringen:1})+kcyl(x+1.1,y+1.3,0,.34,46,'#94a3b8',{ringen:2})+kcyl(x+.45,y+1.35,0,.1,78,'#78716c',{ringen:3,ringKleur:'#ef4444',ringDik:2.2})+krook(x+.45,y+1.35,78),
  chemiepark:(x,y,p)=>{let s=kbox(x+.25,y+.2,0,1.5,.8,40,'#e5e7eb',{ramen:{kol:4,rij:2,kleur:'#475569'}});
    for(let i=0;i<3;i++)s+=kgable(x+.25+i*.5,y+.2,40,.5,.8,12,'#9ca3af');
    return s+kcyl(x+.55,y+1.45,0,.26,34,'#fde68a',{ringen:1})+kcyl(x+1.25,y+1.4,0,.26,42,'#fdba74',{ringen:2})+kcyl(x+1.65,y+.35,40,.08,56,'#57534e',{ringen:2,ringKleur:'#ef4444',ringDik:2})+krook(x+1.65,y+.35,96);},
  molen:(x,y,p)=>{const [sx,sy]=kp(x+1,y+1,64);
    return kcyl(x+1,y+1,0,.32,56,'#fef3c7',{ringen:2,ringKleur:'#d6d3d1'})+kcone(x+1,y+1,56,.32,22,'#78350f')+
    `<g class="kd-wieken" style="transform-origin:${sx.toFixed(1)}px ${sy.toFixed(1)}px">${[0,90,180,270].map(r=>`<rect x="${sx-2.2}" y="${sy-40}" width="4.4" height="40" rx="1" fill="#fafaf9" stroke="#78716c" stroke-width=".8" transform="rotate(${r} ${sx} ${sy})"/>`).join('')}<circle cx="${sx}" cy="${sy}" r="3.4" fill="#57534e"/></g>`;},
  werkplaats:(x,y,p)=>kbox(x+.35,y+.45,0,1.3,1.1,28,'#e7e5e4',{ramen:{kol:3,rij:1,deur:'#57534e'}})+kgable(x+.35,y+.45,28,1.3,1.1,16,p.a)+kbord(x+1,y+1.55,16,KE.tand,{r:7.5}),
  centrale:(x,y,p)=>kbox(x+.2,y+.9,0,1.1,.9,36,'#cbd5e1',{ramen:{kol:3,rij:2,kleur:'#fbbf24'}})+kcyl(x+1.3,y+.65,0,.42,70,'#e5e7eb',{ringen:1,top:'#475569'})+krook(x+1.3,y+.65,78)+kcyl(x+.45,y+.45,0,.08,60,'#78716c',{ringen:3,ringKleur:'#ef4444',ringDik:2}),
  observatorium:(x,y,p)=>{let s=kcyl(x+1,y+1,0,.55,40,'#e2e8f0',{ringen:1})+kdome(x+1,y+1,40,.55,'#cbd5e1',{hoog:1});
    const [sx,sy]=kp(x+1,y+1,40);s+=`<path d="M${sx-5} ${sy-2}L${sx-3} ${sy-46}L${sx+5} ${sy-46}L${sx+5} ${sy-2}z" fill="#1e293b" opacity=".85"/><line class="kd-kijker" x1="${sx}" y1="${sy-30}" x2="${sx+22}" y2="${sy-58}" stroke="#334155" stroke-width="5" stroke-linecap="round"/>`;
    return s+kvlag(x+1.4,y+1.6,40,14,p.a);},
  meetpost:(x,y,p)=>kbox(x+.65,y+.65,0,.7,.7,20,'#e0e7ff',{ramen:{kol:1,rij:1,deur:'#312e81'}})+kpyr(x+.62,y+.62,20,.76,.76,16,p.a)+kvlag(x+1.55,y+1.55,0,34,p.a),
  tekenkamer:(x,y,p)=>kbox(x+.35,y+.4,0,1.3,1.2,34,'#eef2ff',{ramen:{kol:3,rij:2,kleur:'#4f46e5',deur:'#312e81'}})+kpyr(x+.33,y+.38,34,1.34,1.24,22,'#6366f1')+kbord(x+1,y+1.6,22,KE.driehoek,{r:8}),
  rekentoren:(x,y,p)=>kbox(x+.6,y+.6,0,.8,.8,88,'#e0e7ff',{ramen:{kol:2,rij:6,kleur:'#4338ca',deur:'#1e1b4b'}})+kpyr(x+.56,y+.56,88,.88,.88,34,p.a)+kbord(x+1,y+1.4,74,KE.klok,{r:8})+kvlag(x+1,y+1,122,14,p.a),
  ziggurat:(x,y,p)=>[0,1,2,3].map(i=>kbox(x+.2+i*.2,y+.2+i*.2,i*24,1.6-i*.4,1.6-i*.4,24,i%2?'#c7d2fe':'#a5b4fc',{ramen:{kol:Math.max(1,3-i),rij:1,kleur:'#312e81'}})).join('')+kdome(x+1,y+1,96,.14,'#facc15'),
  markt:(x,y,p)=>{let s='';[[.5,.5],[1.3,.5],[.5,1.3],[1.3,1.3]].forEach(([u,v])=>s+=kbox(x+u,y+v,0,.06,.06,18,'#78350f',{geenLijn:true}));
    s+=kgable(x+.46,y+.46,18,.96,.96,10,'#ef4444','#fecaca');
    return s+kbox(x+.55,y+1.5,0,.2,.2,8,'#b45309')+kbox(x+.85,y+1.55,0,.2,.2,8,'#a16207')+kbox(x+1.6,y+.8,0,.22,.22,9,'#65a30d');},
  winkels:(x,y,p)=>['#fca5a5','#fde68a','#bfdbfe'].map((c,i)=>kbox(x+.25+i*.52,y+.6,0,.5,.8,26+i*6,c,{ramen:{kol:1,rij:2,kolR:1,deur:'#334155'}})+kgable(x+.25+i*.52,y+.6,26+i*6,.5,.8,12,['#b91c1c','#a16207','#1d4ed8'][i])).join(''),
  bank:(x,y,p)=>{let s=kbox(x+.25,y+.35,0,1.5,1.3,10,'#e7e5e4')+kbox(x+.35,y+.45,10,1.3,1.1,34,'#fafaf9',{ramen:{kol:3,rij:1,kleur:'#57534e'}});
    for(let i=0;i<4;i++)s+=kcyl(x+.45+i*.36,y+1.62,10,.06,34,'#fafaf9',{geenTop:false});
    return s+kgable(x+.3,y+.4,44,1.4,1.3,20,'#d6d3d1','#fafaf9')+kbord(x+1.72,y+1.1,56,KE.euro,{r:8,bg:'#fef3c7'});},
  beurs:(x,y,p)=>kbox(x+.4,y+.4,0,1.2,1.2,30,'#e0f2fe',{ramen:{kol:3,rij:2,kleur:'#0369a1',deur:'#0c4a6e'}})+kbox(x+.6,y+.6,30,.8,.8,82,'#bae6fd',{ramen:{kol:2,rij:7,kleur:'#0284c7'}})+kpyr(x+.6,y+.6,112,.8,.8,26,'#0ea5e9')+kvlag(x+1,y+1,138,14,p.a),
  kantoor:(x,y,p)=>kbox(x+.3,y+.35,0,1.4,1.3,54,'#e2e8f0',{ramen:{kol:4,rij:4,kleur:'#334155',deur:'#0f172a'}})+kbox(x+.6,y+.6,54,.4,.3,8,'#94a3b8'),
  fabriek:(x,y,p)=>{let s=kbox(x+.2,y+.45,0,1.5,1.1,32,'#d6d3d1',{ramen:{kol:4,rij:1,kleur:'#44403c',deur:'#292524'}});
    for(let i=0;i<3;i++)s+=kgable(x+.2+i*.5,y+.45,32,.5,1.1,14,'#a8a29e');
    return s+kcyl(x+1.7,y+.35,0,.12,74,'#b91c1c',{ringen:3,ringKleur:'#fafaf9',ringDik:2})+krook(x+1.7,y+.35,74);},
  hoofdkantoor:(x,y,p)=>kbox(x+.35,y+.35,0,1.3,1.3,60,'#cbd5e1',{ramen:{kol:4,rij:5,kleur:'#1e40af',deur:'#0f172a'}})+kbox(x+.55,y+.55,60,.9,.9,64,'#e2e8f0',{ramen:{kol:3,rij:5,kleur:'#1d4ed8'}})+kbox(x+.9,y+.9,124,.2,.2,22,'#64748b')+(()=>{const [sx,sy]=kp(x+1,y+1,146);return `<circle class="kd-knipper" cx="${sx}" cy="${sy}" r="3" fill="#ef4444"/>`;})(),
  hunebed:(x,y,p)=>kbox(x+.5,y+.6,0,.25,.3,16,'#a8a29e')+kbox(x+1.2,y+.6,0,.25,.3,18,'#9ca3af')+kbox(x+.5,y+1.2,0,.25,.3,15,'#a8a29e')+kbox(x+1.2,y+1.2,0,.25,.3,17,'#a1a1aa')+kbox(x+.4,y+.55,16,1.15,1.05,9,'#78716c')+kboom(x+1.7,y+1.7,.6),
  burcht:(x,y,p)=>{let s=kbox(x+.3,y+.3,0,1.4,1.4,34,'#d6d3d1',{ramen:{kol:3,rij:1,kleur:'#292524',deur:'#44403c'}});
    for(let i=0;i<4;i++){s+=kbox(x+.3+i*.4,y+1.55,34,.15,.15,7,'#d6d3d1');s+=kbox(x+1.55,y+.3+i*.4,34,.15,.15,7,'#d6d3d1');}
    return s+kcyl(x+1.6,y+1.6,0,.24,58,'#e7e5e4',{ringen:1})+kcone(x+1.6,y+1.6,58,.24,26,p.a)+kvlag(x+1.6,y+1.6,84,14,p.a);},
  stadhuis:(x,y,p)=>kbox(x+.3,y+.45,0,1.4,1.1,36,'#fef3c7',{ramen:{kol:4,rij:2,kleur:'#78350f',deur:'#451a03'}})+kgable(x+.3,y+.45,36,1.4,1.1,20,'#b45309')+kbox(x+.85,y+.8,36,.35,.35,40,'#fde68a',{ramen:{kol:1,rij:1,kleur:'#78350f'}})+kpyr(x+.83,y+.78,76,.39,.39,22,'#78350f')+kbord(x+1.02,y+1.15,62,KE.klok,{r:7}),
  tempel:(x,y,p)=>{let s=kbox(x+.2,y+.3,0,1.6,1.4,8,'#e7e5e4')+kbox(x+.3,y+.4,8,1.4,1.2,6,'#f5f5f4')+kbox(x+.45,y+.45,14,1.1,.8,34,'#fafaf9',{ramen:{kol:2,rij:1,kleur:'#a8a29e'}});
    for(let i=0;i<5;i++)s+=kcyl(x+.4+i*.3,y+1.45,14,.06,34,'#fafaf9');
    for(let i=0;i<3;i++)s+=kcyl(x+1.65,y+.55+i*.35,14,.06,34,'#fafaf9');
    return s+kgable(x+.3,y+.4,48,1.4,1.2,18,'#e7e5e4','#fafaf9');},
  weerstation:(x,y,p)=>{const [sx,sy]=kp(x+1.4,y+.6,0);
    return kbox(x+.4,y+.8,0,.8,.8,20,'#f1f5f9',{ramen:{kol:1,rij:1,deur:'#334155'}})+kpyr(x+.38,y+.78,20,.84,.84,12,p.a)+
    `<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy-56}" stroke="#64748b" stroke-width="2"/><g class="kd-wieken snel" style="transform-origin:${sx}px ${sy-56}px">${[0,120,240].map(r=>`<line x1="${sx}" y1="${sy-56}" x2="${sx+10}" y2="${sy-56}" stroke="#334155" stroke-width="2" transform="rotate(${r} ${sx} ${sy-56})"/><circle cx="${sx+10}" cy="${sy-56}" r="2.4" fill="#ef4444" transform="rotate(${r} ${sx} ${sy-56})"/>`).join('')}</g>`;},
  vuurtoren:(x,y,p)=>{const [sx,sy]=kp(x+1,y+1,80);
    return kbox(x+.6,y+.6,0,.8,.8,8,'#a8a29e')+kcyl(x+1,y+1,8,.26,72,'#fafaf9',{ringen:3,ringKleur:'#ef4444',ringDik:5})+kcyl(x+1,y+1,80,.2,12,'#fde68a',{top:'#1e293b'})+kcone(x+1,y+1,92,.24,14,'#b91c1c')+
    `<g class="kd-straal" style="transform-origin:${sx}px ${sy-6}px"><path d="M${sx} ${sy-6}L${sx+90} ${sy-22}L${sx+90} ${sy+10}z" fill="url(#kd-licht)"/></g><circle class="kd-lamp" cx="${sx}" cy="${sy-6}" r="5" fill="#fde047"/>`;},
  haven:(x,y,p)=>{const [a,b]=kp(x+1.5,y+.5,0);
    return kbox(x+.25,y+.6,0,1.1,1,26,'#e5e7eb',{ramen:{kol:3,rij:1,kleur:'#475569',deur:'#334155'}})+kgable(x+.25,y+.6,26,1.1,1,12,'#64748b')+kbox(x+1.5,y+1.4,0,.3,.2,10,'#ef4444')+kbox(x+1.5,y+1.15,0,.3,.2,10,'#3b82f6')+kbox(x+1.5,y+1.4,10,.3,.2,10,'#22c55e')+
    `<g><line x1="${a}" y1="${b}" x2="${a}" y2="${b-66}" stroke="#f59e0b" stroke-width="4"/><line x1="${a-26}" y1="${b-62}" x2="${a+18}" y2="${b-66}" stroke="#f59e0b" stroke-width="4"/><line class="kd-kabel" x1="${a-22}" y1="${b-62}" x2="${a-22}" y2="${b-30}" stroke="#334155" stroke-width="1.2"/></g>`;},
  wereldhaven:(x,y,p)=>{let s='';const cs=['#ef4444','#3b82f6','#22c55e','#f59e0b','#8b5cf6','#14b8a6'];
    for(let i=0;i<3;i++)for(let j=0;j<2;j++)for(let k=0;k<(i+j)%3+1;k++)s+=kbox(x+.25+i*.4,y+.95+j*.3,k*10,.36,.26,10,cs[(i*3+j+k)%cs.length]);
    const [a,b]=kp(x+.4,y+.4,0),[c,d]=kp(x+1.5,y+.3,0);
    s+=`<line x1="${a}" y1="${b}" x2="${a}" y2="${b-84}" stroke="#f59e0b" stroke-width="5"/><line x1="${a-30}" y1="${b-80}" x2="${a+40}" y2="${b-84}" stroke="#f59e0b" stroke-width="5"/>`;
    s+=`<line x1="${c}" y1="${d}" x2="${c}" y2="${d-70}" stroke="#f59e0b" stroke-width="5"/><line x1="${c-34}" y1="${d-66}" x2="${c+24}" y2="${d-70}" stroke="#f59e0b" stroke-width="5"/><line class="kd-kabel" x1="${c-30}" y1="${d-66}" x2="${c-30}" y2="${d-28}" stroke="#334155" stroke-width="1.3"/>`;
    return s;},
  bibliotheek:(x,y,p)=>kbox(x+.3,y+.35,0,1.4,1.3,40,'#fef3c7',{ramen:{kol:3,rij:2,kleur:'#78350f',deur:'#451a03'}})+kdome(x+1,y+1,40,.5,'#b45309',{hoog:.8})+kbord(x+1,y+1.65,26,KE.boek,{r:9,bg:'#fff7ed'}),
  schouwburg:(x,y,p)=>{let s=kbox(x+.2,y+.3,0,1.6,1.4,52,'#fecdd3',{ramen:{kol:4,rij:3,kleur:'#881337',deur:'#4c0519'}})+kgable(x+.2,y+.3,52,1.6,1.4,26,'#9f1239');
    for(let i=0;i<5;i++){const [sx,sy]=kp(x+.3+i*.34,y+1.7,50);s+=`<circle class="kd-lampje" cx="${sx}" cy="${sy}" r="2.2" fill="#fde047" style="animation-delay:${i*.2}s"/>`;}
    return s+kvlag(x+.3,y+1.7,78,16,p.a)+kvlag(x+1.8,y+.35,78,16,p.a);},
  station:(x,y,p)=>kbox(x+.2,y+.6,0,1.6,.8,28,'#fde68a',{ramen:{kol:5,rij:1,kolR:2,kleur:'#78350f',deur:'#451a03'}})+kgable(x+.2,y+.6,28,1.6,.8,14,'#78350f')+kbox(x+.85,y+.8,28,.3,.3,26,'#fef3c7')+kpyr(x+.83,y+.78,54,.34,.34,16,'#78350f')+kbord(x+1,y+1.1,42,KE.klok,{r:6.5}),
  luchthaven:(x,y,p)=>kbox(x+.2,y+.9,0,1.6,.8,22,'#e0f2fe',{ramen:{kol:6,rij:1,kolR:3,kleur:'#0369a1',deur:'#0c4a6e'}})+kcyl(x+.6,y+.45,0,.14,70,'#f1f5f9')+kcyl(x+.6,y+.45,70,.26,14,'#bae6fd',{top:'#334155'})+(()=>{const [sx,sy]=kp(x+.6,y+.45,92);return `<circle class="kd-knipper" cx="${sx}" cy="${sy}" r="3" fill="#ef4444"/>`;})(),
  parlement:(x,y,p)=>{let s=kbox(x+.2,y+.3,0,1.6,1.4,40,'#f5f5f4',{ramen:{kol:5,rij:2,kleur:'#57534e',deur:'#292524'}});
    for(let i=0;i<5;i++)s+=kcyl(x+.35+i*.32,y+1.75,0,.06,40,'#fafaf9');
    return s+kcyl(x+1,y+1,40,.4,16,'#fafaf9')+kdome(x+1,y+1,56,.4,'#86efac',{hoog:1})+kvlag(x+1,y+1,92,18,p.a);},
  zuil:(x,y,p)=>kbox(x+.6,y+.6,0,.8,.8,8,'#e7e5e4')+kcyl(x+1,y+1,8,.14,54,'#fafaf9',{ringen:4,ringKleur:'#d6d3d1'})+kbox(x+.82,y+.82,62,.36,.36,6,'#f5f5f4')+kboom(x+.4,y+1.6,.55),
  amfitheater:(x,y,p)=>{const [sx,sy]=kp(x+1,y+1,0);let s='';
    for(let i=0;i<4;i++){const rx=62-i*12,ry=31-i*6,h=6;s+=`<path d="M${sx-rx} ${sy-i*h}A${rx} ${ry} 0 0 1 ${sx+rx} ${sy-i*h}L${sx+rx} ${sy-i*h-h}A${rx} ${ry} 0 0 0 ${sx-rx} ${sy-i*h-h}Z" fill="${i%2?'#e7e5e4':'#d6d3d1'}" stroke="#a8a29e" stroke-width=".8"/>`;}
    return s+`<ellipse cx="${sx}" cy="${sy-24+10}" rx="16" ry="8" fill="#fde68a" stroke="#a8a29e"/>`;},
  serverkast:(x,y,p)=>{let s=kbox(x+.7,y+.6,0,.6,.8,34,'#1e293b',{ramen:null});
    for(let i=0;i<4;i++){const [sx,sy]=kp(x+.8,y+1.4,6+i*7);s+=`<circle class="kd-led" cx="${sx}" cy="${sy}" r="1.6" fill="${i%2?'#22c55e':'#38bdf8'}" style="animation-delay:${i*.3}s"/>`;}
    return s;},
  codehub:(x,y,p)=>{const [sx,sy]=kp(x+1.5,y+.5,40);
    return kbox(x+.35,y+.45,0,1.3,1.1,40,'#312e81',{ramen:{kol:3,rij:2,kleur:'#22d3ee',deur:'#0f172a'}})+kbord(x+1,y+1.55,24,KE.code,{r:9,bg:'#0f172a',rand:'#22d3ee'})+
    `<g><line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy-16}" stroke="#94a3b8" stroke-width="2"/><ellipse cx="${sx}" cy="${sy-20}" rx="10" ry="5" fill="#e2e8f0" stroke="#64748b" transform="rotate(-25 ${sx} ${sy-20})"/></g>`;},
  datacenter:(x,y,p)=>{let s='';for(let i=0;i<3;i++)s+=kbox(x+.2+i*.55,y+.4,0,.5,1.2,30,'#334155',{ramen:{kol:1,rij:3,kolR:3,kleur:'#38bdf8'}});
    const [sx,sy]=kp(x+1,y+1,30);return s+`<g class="kd-wieken snel" style="transform-origin:${sx}px ${sy-6}px"><rect x="${sx-9}" y="${sy-7}" width="18" height="2.4" fill="#94a3b8"/><rect x="${sx-1.2}" y="${sy-15}" width="2.4" height="18" fill="#94a3b8"/></g>`;},
  ailab:(x,y,p)=>kbox(x+.3,y+.3,0,1.4,1.4,46,'#1e1b4b',{ramen:{kol:4,rij:3,kleur:'#a78bfa',deur:'#0f172a'}})+kdome(x+1,y+1,46,.5,'#8b5cf6',{cls:'kd-gloed'})+kvlag(x+1,y+1,92,14,p.a),
};
// Welke vier gebouwen een vak krijgt (van eerste naar vierde).
const KD_THEMA={
  bi:[['kas','Kas'],['lab','Laboratorium'],['ziekenhuis','Ziekenhuis'],['campus','Onderzoekscampus']],
  sk:[['schuur','Proefschuur'],['lab','Laboratorium'],['raffinaderij','Raffinaderij'],['chemiepark','Chemiepark']],
  na2:[['schuur','Proefschuur'],['lab','Laboratorium'],['raffinaderij','Raffinaderij'],['chemiepark','Chemiepark']],
  na:[['molen','Windmolen'],['werkplaats','Werkplaats'],['centrale','Energiecentrale'],['observatorium','Observatorium']],
  na1:[['molen','Windmolen'],['werkplaats','Werkplaats'],['centrale','Energiecentrale'],['observatorium','Observatorium']],
  wa:[['meetpost','Meetpost'],['tekenkamer','Tekenkamer'],['rekentoren','Rekentoren'],['ziggurat','Piramide van Pythagoras']],
  wb:[['meetpost','Meetpost'],['tekenkamer','Tekenkamer'],['rekentoren','Rekentoren'],['ziggurat','Piramide van Pythagoras']],
  wi:[['meetpost','Meetpost'],['tekenkamer','Tekenkamer'],['rekentoren','Rekentoren'],['ziggurat','Piramide van Pythagoras']],
  ec:[['markt','Marktkraam'],['winkels','Winkelstraat'],['bank','Bank'],['beurs','Beurs']],
  be:[['werkplaats','Werkplaats'],['kantoor','Kantoor'],['fabriek','Fabriek'],['hoofdkantoor','Hoofdkantoor']],
  gs:[['hunebed','Hunebed'],['burcht','Burcht'],['stadhuis','Stadhuis'],['tempel','Museum']],
  ak:[['weerstation','Weerstation'],['vuurtoren','Vuurtoren'],['haven','Haven'],['wereldhaven','Wereldhaven']],
  nl:[['hut','Leeshut'],['schuur','Drukkerij'],['bibliotheek','Bibliotheek'],['schouwburg','Schouwburg']],
  en:[['hut','Postkantoor'],['station','Station'],['tempel','Ambassade'],['luchthaven','Luchthaven']],
  du:[['hut','Postkantoor'],['station','Station'],['tempel','Ambassade'],['luchthaven','Luchthaven']],
  fr:[['hut','Postkantoor'],['station','Station'],['tempel','Ambassade'],['luchthaven','Luchthaven']],
  fa:[['hut','Postkantoor'],['station','Station'],['tempel','Ambassade'],['luchthaven','Luchthaven']],
  mw:[['hut','Dorpshuis'],['tempel','Rechtbank'],['stadhuis','Gemeentehuis'],['parlement','Parlement']],
  ma:[['hut','Dorpshuis'],['tempel','Rechtbank'],['stadhuis','Gemeentehuis'],['parlement','Parlement']],
  la:[['zuil','Zuil'],['tempel','Tempel'],['amfitheater','Amfitheater'],['parlement','Forum']],
  gr:[['zuil','Zuil'],['tempel','Tempel'],['amfitheater','Amfitheater'],['parlement','Forum']],
  in:[['serverkast','Serverkast'],['codehub','Codehub'],['datacenter','Datacenter'],['ailab','AI-lab']],
};
const KD_STANDAARD=[['hut','Huis'],['winkels','Straat'],['rekentoren','Toren'],['burcht','Burcht']];
function kdThema(id){return KD_THEMA[id]||KD_STANDAARD;}
// Plek per gebouw binnen de 4×4-wijk: klein vooraan, het grote gebouw achterin.
const KD_SLOT=[[2,2],[0,2],[2,0],[0,0]];

// ═══════ EILAND ═══════
const KD_NIVEAUS=[[0,'Kamp'],[1,'Gehucht'],[4,'Dorp'],[10,'Stadje'],[20,'Stad'],[34,'Metropool'],[48,'Kingdom']];
function kdEilandNiveau(b){let n=KD_NIVEAUS[0],v=null;for(let i=0;i<KD_NIVEAUS.length;i++){if(b>=KD_NIVEAUS[i][0]){n=KD_NIVEAUS[i];v=KD_NIVEAUS[i+1]||null;}}return {naam:n[1],min:n[0],volgende:v};}
function kdRng(seed){let h=2166136261;for(const c of String(seed)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return ()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return ((h>>>0)%1e6)/1e6;};}
// Wereldmodel: wijken op een raster, toren in het midden.
function kdBouwWereld(){
  const V=getVK();const staat=kdStaat();const g=staat.gebouwd||{};
  const wijken=V.map(v=>{const st=kdVakStand(v.id);const gebouwd=Math.min(st.vrij,g[v.id]||0);return {vak:v,st,gebouwd,klaar:Math.max(0,st.vrij-gebouwd),kleur:v.kleur||'#64748b'};});
  const lijst=wijken.slice();const mid=Math.floor(lijst.length/2);lijst.splice(mid,0,{toren:true});
  const kol=4,rijen=Math.ceil(lijst.length/kol),C=5;
  lijst.forEach((w,i)=>{w.gx=(i%kol)*C+1;w.gy=Math.floor(i/kol)*C+1;});
  const W=kol*C+1,H=rijen*C+1;
  const totaal=wijken.reduce((a,w)=>a+w.gebouwd,0);
  return {wijken,lijst,W,H,totaal,klaar:wijken.reduce((a,w)=>a+w.klaar,0),niv:kdEilandNiveau(totaal)};
}
function kdTekenWijk(w,o){
  o=o||{};const x=w.gx,y=w.gy;let s='';
  if(w.toren)return kdTekenToren(x,y,o.totaal||0);
  // Grasplaat met een rand in de vakkleur.
  s+=kbox(x-.08,y-.08,0,4.16,4.16,5,'#76b457',{top:'url(#kd-gras)',links:'#679f4a',rechts:'#557f3c'});
  s+=`<polygon class="kd-rand" points="${[kp(x+.05,y+.05,5),kp(x+3.95,y+.05,5),kp(x+3.95,y+3.95,5),kp(x+.05,y+3.95,5)].map(kpt).join(' ')}" fill="none" stroke="${w.kleur}" stroke-width="3" stroke-linejoin="round" opacity=".75" data-wijk="${w.vak.id}"/>`;
  s+=`<polygon class="kd-hit" data-wijk="${w.vak.id}" points="${[kp(x-.1,y-.1,5),kp(x+4.1,y-.1,5),kp(x+4.1,y+4.1,5),kp(x-.1,y+4.1,5)].map(kpt).join(' ')}" fill="transparent"/>`;
  const thema=kdThema(w.vak.id),p={a:w.kleur};
  // Achter naar voor tekenen: sorteer slots op x+y.
  const volgorde=[3,2,1,0].map(t=>({t,s:KD_SLOT[t]})).sort((a,b)=>(a.s[0]+a.s[1])-(b.s[0]+b.s[1]));
  // Schaduwen blijven op de eigen grasplaat (clipPath), anders zweven ze boven het plein.
  const cid='kdc'+(KD.pre||'m')+w.vak.id;let sch='';
  volgorde.forEach(({t,s:sl})=>{if(t<w.gebouwd){const sx=x+sl[0],sy=y+sl[1];sch+=kdSchaduw(sx+.3,sy+.3,sx+1.7,sy+1.7,kdHoogte(thema[t][0]));}});
  if(sch)s+=`<clipPath id="${cid}"><polygon points="${[kp(x-.08,y-.08,5),kp(x+4.08,y-.08,5),kp(x+4.08,y+4.08,5),kp(x-.08,y+4.08,5)].map(kpt).join(' ')}"/></clipPath><g clip-path="url(#${cid})">${sch}</g>`;
  volgorde.forEach(({t,s:sl})=>{
    const sx=x+sl[0],sy=y+sl[1];
    if(t<w.gebouwd){const nieuw=o.nieuw&&o.nieuw.vak===w.vak.id&&o.nieuw.t===t;
      s+=`<g class="kd-gebouw${nieuw?' kd-rijst':''}" data-t="${t}">${KB[thema[t][0]](sx,sy,p)}</g>`;}
    else if(t<w.gebouwd+w.klaar){s+=kdFundering(sx,sy,true)+kdMarker(sx+1,sy+1);}
    else if(o.spook){s+=`<g class="kd-spook">${KB[thema[t][0]](sx,sy,p)}</g>`;}
    else s+=kdFundering(sx,sy,false);
  });
  return s;
}
function kdFundering(x,y,klaar){
  return `<polygon points="${[kp(x+.35,y+.35,5),kp(x+1.65,y+.35,5),kp(x+1.65,y+1.65,5),kp(x+.35,y+1.65,5)].map(kpt).join(' ')}" fill="${klaar?'rgba(250,204,21,.28)':'rgba(0,0,0,.06)'}" stroke="${klaar?'#f59e0b':'rgba(0,0,0,.22)'}" stroke-width="1.6" stroke-dasharray="5 4"/>`;
}
function kdMarker(x,y){const [sx,sy]=kp(x,y,5);
  return `<g class="kd-marker" transform="translate(${sx.toFixed(1)} ${sy.toFixed(1)})"><g class="kd-marker-z"><path d="M0-58l12 14-12 14-12-14z" fill="#facc15" stroke="#a16207" stroke-width="2"/><path d="M0-58l12 14H-12z" fill="#fde68a"/></g><ellipse rx="10" ry="5" fill="rgba(0,0,0,.2)"/></g>`;}
function kdTekenToren(x,y,b){
  let s=kbox(x-.08,y-.08,0,4.16,4.16,5,'#e7dcc4',{top:'url(#kd-plein)',links:'#cdbf9f',rechts:'#b9aa88'});
  s+=kdSchaduw(x+1.2,y+1.2,x+2.8,y+2.8,5+22*(1+Math.min(7,Math.floor(b/3)))+30);
  s+=`<polygon class="kd-hit" data-wijk="_toren" points="${[kp(x,y,5),kp(x+4,y,5),kp(x+4,y+4,5),kp(x,y+4,5)].map(kpt).join(' ')}" fill="transparent"/>`;
  const vloeren=1+Math.min(7,Math.floor(b/3));let z=5;
  for(let i=0;i<vloeren;i++){const k=i/(vloeren+1)*.3;s+=kbox(x+1.2+k,y+1.2+k,z,1.6-2*k,1.6-2*k,22,i%2?'#fdba74':'#fb923c',{ramen:{kol:2,rij:1,kleur:'#7c2d12',deur:i?null:'#431407'}});z+=22;}
  const k=vloeren/(vloeren+1)*.3;
  s+=kpyr(x+1.15+k,y+1.15+k,z,1.7-2*k,1.7-2*k,30,'#c2410c');
  s+=kvlag(x+2,y+2,z+30,20,'#E85C0D');
  s+=kboom(x+.5,y+3.4,.8)+kboom(x+3.4,y+.5,.8,'#3f8a3c')+kden(x+.6,y+.6,.8)+kden(x+3.5,y+3.4,.9);
  return s;
}
function kdTekenEiland(wd,o){
  o=o||{};_KG.clear();KD.pre='m';
  const {W,H}=wd;let s='';
  // Zwevend eiland: grasdek, aardlagen en een rotspunt eronder.
  const diep=46;
  const bodem=kp(W/2,H/2,-diep-150);
  s+=kpoly([kp(0,H,-diep),kp(W,H,-diep),bodem],'url(#kd-onder-l)');
  s+=kpoly([kp(W,0,-diep),kp(W,H,-diep),bodem],'url(#kd-onder-r)');
  s+=kbox(0,0,-diep,W,H,diep,'#8a6446',{top:'url(#kd-plein)',links:'url(#kd-aarde-l)',rechts:'url(#kd-aarde-r)',vlak:true});
  s+=`<polygon points="${[kp(0,H,-7),kp(W,H,-7),kp(W,H,0),kp(0,H,0)].map(kpt).join(' ')}" fill="#5f9a42"/><polygon points="${[kp(W,0,-7),kp(W,H,-7),kp(W,H,0),kp(W,0,0)].map(kpt).join(' ')}" fill="#4d8236"/>`;
  // Losse rotsblokken en hangende wortels langs de rand.
  const rr=kdRng('rand'+W);for(let i=0;i<14;i++){const t=.05+rr()*.9,links=i%2===0;const zz=-12-rr()*28;
    const p0=links?kp(W*t,H,zz):kp(W,H*t,zz);const g=4+rr()*6;
    s+=`<path d="M${(p0[0]-g).toFixed(1)} ${p0[1].toFixed(1)}l${(g*.6).toFixed(1)} ${(-g*.7).toFixed(1)}l${(g*1.1).toFixed(1)} ${(g*.2).toFixed(1)}l${(g*.3).toFixed(1)} ${(g*.8).toFixed(1)}z" fill="${links?'#8d857c':'#6f6861'}" opacity=".9"/>`;}
  for(let i=0;i<9;i++){const t=.08+rr()*.84,links=i%2===0;const p0=links?kp(W*t,H,-7):kp(W,H*t,-7);const l=8+rr()*16;
    s+=`<path d="M${p0[0].toFixed(1)} ${p0[1].toFixed(1)}q${(rr()*4-2).toFixed(1)} ${(l*.5).toFixed(1)} ${(rr()*6-3).toFixed(1)} ${l.toFixed(1)}" stroke="#5a3a22" stroke-width="1.2" fill="none" opacity=".7"/>`;}
  // Waterval aan de voorkant.
  const [wx,wy]=kp(W*.62,H,-2);s+=`<path class="kd-waterval" d="M${wx-10} ${wy}v${diep+90}h20v-${diep+90}z" fill="url(#kd-water)"/>`;
  // Bomen langs de rand: meer naarmate je eiland groeit.
  const r=kdRng('eiland'+W+H);const n=8+Math.min(40,wd.totaal*2);const plekken=[];
  for(let i=0;i<W;i+=.9){plekken.push([i,.35]);plekken.push([i,H-.35]);}
  for(let j=0;j<H;j+=.9){plekken.push([.35,j]);plekken.push([W-.35,j]);}
  const kies=plekken.map(pl=>[pl,r()]).sort((a,b)=>a[1]-b[1]).slice(0,n).map(a=>a[0]).sort((a,b)=>(a[0]+a[1])-(b[0]+b[1]));
  const achter=kies.filter(pl=>pl[0]+pl[1]<(W+H)/2),voor=kies.filter(pl=>pl[0]+pl[1]>=(W+H)/2);
  const BOOMK=['#4f9e45','#3f8a3c','#6aa94e'];
  achter.forEach((pl,i)=>{s+=i%3?kboom(pl[0],pl[1],.7+r()*.3,BOOMK[i%3]):kden(pl[0],pl[1],.7+r()*.3);});
  wd.lijst.slice().sort((a,b)=>(a.gx+a.gy)-(b.gx+b.gy)).forEach(w=>{s+=`<g class="kd-wijk" data-id="${w.toren?'_toren':w.vak.id}">${kdTekenWijk(w,{nieuw:o.nieuw,totaal:wd.totaal})}</g>`;});
  voor.forEach((pl,i)=>{s+=i%3?kboom(pl[0],pl[1],.7+r()*.3,BOOMK[i%3]):kden(pl[0],pl[1],.7+r()*.3);});
  return `<defs>${kdefs()}${kdVasteDefs(W,H,diep)}<linearGradient id="kd-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#7dd3fc" stop-opacity="0"/></linearGradient>
    <linearGradient id="kd-licht" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fde047" stop-opacity=".75"/><stop offset="1" stop-color="#fde047" stop-opacity="0"/></linearGradient></defs>${s}`;
}
// Texturen en licht die voor het hele eiland gelden (gras, plein, glas, aardlagen).
function kdVasteDefs(W,H,diep){
  const r=kdRng('gras');let gras='',plein='';
  for(let i=0;i<26;i++){const x=r()*36,y=r()*18;gras+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(.7+r()*1.1).toFixed(2)}" ry="${(.4+r()*.5).toFixed(2)}" fill="${['#7fbc58','#9fd77a','#6fae4d','#b4e08f'][i%4]}" opacity=".85"/>`;}
  for(let i=0;i<5;i++){const x=i*8+(r()*2);plein+=`<path d="M${x.toFixed(1)} 4h6l3 4-3 4h-6l-3-4z" fill="${['#e3d8c0','#e9dfca','#ddd1b6'][i%3]}" stroke="#d3c5a6" stroke-width=".4"/>`;}
  const L0=kp(0,H,0),R0=kp(W,0,0);const yl=L0[1]-.5*L0[0],yr=R0[1]+.5*R0[0];
  const lagen=(id,skew,y0,d)=>`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${y0.toFixed(1)}" x2="0" y2="${(y0+diep).toFixed(1)}" gradientTransform="skewY(${skew})">
    <stop offset="0" stop-color="${kshade('#6b4a2e',d)}"/><stop offset=".22" stop-color="${kshade('#7a5233',d)}"/><stop offset=".23" stop-color="${kshade('#a07148',d)}"/><stop offset=".52" stop-color="${kshade('#936744',d)}"/>
    <stop offset=".53" stop-color="${kshade('#8f877e',d)}"/><stop offset=".78" stop-color="${kshade('#7d756d',d)}"/><stop offset=".79" stop-color="${kshade('#6c655e',d)}"/><stop offset="1" stop-color="${kshade('#5d5650',d)}"/></linearGradient>`;
  return `<pattern id="kd-gras" patternUnits="userSpaceOnUse" width="36" height="18"><rect width="36" height="18" fill="#8fca68"/>${gras}</pattern>
    <pattern id="kd-plein" patternUnits="userSpaceOnUse" width="40" height="16"><rect width="40" height="16" fill="#e6dbc3"/>${plein}</pattern>
    <linearGradient id="kd-glas" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfe0f5"/><stop offset=".38" stop-color="#5c84a6"/><stop offset="1" stop-color="#1f3347"/></linearGradient>
    ${lagen('kd-aarde-l',26.565,yl,0)}${lagen('kd-aarde-r',-26.565,yr,-.2)}
    <linearGradient id="kd-onder-l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a635c"/><stop offset=".6" stop-color="#4f4943"/><stop offset="1" stop-color="#3a3531" stop-opacity=".2"/></linearGradient>
    <linearGradient id="kd-onder-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#554f49"/><stop offset=".6" stop-color="#403b36"/><stop offset="1" stop-color="#2e2a27" stop-opacity=".2"/></linearGradient>`;
}
function kdBBox(wd){const pts=[kp(0,0,40),kp(wd.W,0,40),kp(0,wd.H,40),kp(wd.W,wd.H,0),kp(0,0,180)];
  const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);return {x0:Math.min(...xs)-40,x1:Math.max(...xs)+40,y0:Math.min(...ys)-60,y1:Math.max(...ys)+170};}

// ═══════ SCHERM ═══════
function kdDagdeel(){const h=new Date().getHours();return h>=21||h<6?'nacht':h<10?'ochtend':h<18?'dag':'avond';}
function openKingdom(){
  const lvl=(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo';
  const klaar=()=>{kdRender();};
  let st=document.getElementById('kd-stage');
  if(!st){st=document.createElement('div');st.id='kd-stage';document.body.appendChild(st);}
  st.className='kd-stage kd-'+kdDagdeel();st.hidden=false;document.documentElement.classList.add('kd-open');
  st.innerHTML=`<div class="kd-lucht" aria-hidden="true"><div class="kd-sterren"></div><div class="kd-zon"></div><i class="kd-wolk w1"></i><i class="kd-wolk w2"></i><i class="kd-wolk w3"></i><i class="kd-wolk w4"></i></div>
    <div class="kd-kaart" id="kd-kaart"><svg id="kd-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Jouw eiland"></svg><div class="kd-labels" id="kd-labels"></div></div>
    <div class="kd-top"><button class="kd-x" onclick="kdSluit()" aria-label="Sluiten">✕</button>
      <div class="kd-titel"><small id="kd-niv-k">${lvl.toUpperCase()} · Kingdom</small><b id="kd-niv">Jouw eiland</b></div>
      <div class="kd-zoom"><button onclick="kdZoom(1.35)" aria-label="Inzoomen">+</button><button onclick="kdZoom(1/1.35)" aria-label="Uitzoomen">−</button><button onclick="kdOverzicht()" aria-label="Heel eiland">⤢</button></div></div>
    <section class="kd-sheet" id="kd-sheet" aria-label="Details"><div class="kd-grip" id="kd-grip"></div><div class="kd-sheet-in" id="kd-sheet-in"></div></section>`;
  requestAnimationFrame(()=>st.classList.add('on'));
  try{if(typeof ensureLevelData==='function')ensureLevelData(lvl,klaar);else klaar();}catch(e){klaar();}
  try{if(typeof trackEvent==='function')trackEvent('kingdom_open',{});}catch(e){}
}
function kdSluit(){
  const st=document.getElementById('kd-stage');cancelAnimationFrame(KD.raf);KD.timers.forEach(clearTimeout);KD.timers=[];
  KD._init=false;KD.sel=null;removeEventListener('resize',kdResize);
  if(st){st.classList.remove('on');setTimeout(()=>{if(!st.classList.contains('on')){st.hidden=true;st.innerHTML='';}},260);}
  document.documentElement.classList.remove('kd-open');
  try{renderPlayRow();}catch(e){}
  try{const a=document.getElementById('sc-arcade');if(a&&a.classList.contains('on')&&typeof renderArcade==='function')renderArcade();}catch(e){}
}
function kdRender(nieuw){
  const wd=kdBouwWereld();KD.wereld=wd;
  const svg=document.getElementById('kd-svg');if(!svg)return;
  svg.innerHTML=kdTekenEiland(wd,{nieuw});
  const lh=document.getElementById('kd-labels');if(lh)lh.innerHTML='';
  document.getElementById('kd-stage').classList.toggle('kd-nacht',kdDagdeel()==='nacht');
  KD.bb=kdBBox(wd);
  const kaart=document.getElementById('kd-kaart');KD.vw=kaart.clientWidth;KD.vh=kaart.clientHeight;
  if(!KD._init){KD._init=true;kdOverzicht(true);kdBind();}else kdCam();
  const n=document.getElementById('kd-niv');if(n)n.textContent=wd.niv.naam;
  if(KD.bouwt)return;
  if(KD.sel)kdToonWijk(KD.sel,true);else kdToonLijst();
}
// Camera: wereldpunt in het midden + schaal. De viewBox volgt.
function kdCam(){
  const svg=document.getElementById('kd-svg');if(!svg)return;const c=KD.cam;
  const w=KD.vw/c.s,h=KD.vh/c.s;svg.setAttribute('viewBox',`${(c.x-w/2).toFixed(1)} ${(c.y-h/2).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
  kdLabels();
}
function kdMaxS(){return 1.8;}
// Op desktop staat het blad rechts als paneel, op mobiel onderaan: het vrije kaartvlak verschilt dus.
function kdBreed(){return KD.vw>=900;}
function kdMinS(){const b=KD.bb;return kdBreed()?Math.min((KD.vw-460)/(b.x1-b.x0),(KD.vh*.8)/(b.y1-b.y0))*.9:Math.min(KD.vw/(b.x1-b.x0),(KD.vh*.62)/(b.y1-b.y0))*.9;}
// Verschuiving (in schermpixels) zodat het midden van het vrije vlak het beeldmidden wordt.
function kdMarge(off){return kdBreed()?{dx:210,dy:0}:{dx:0,dy:KD.vh*off};}
function kdNaar(x,y,s,duur){
  cancelAnimationFrame(KD.raf);const a={...KD.cam},b={x,y,s:Math.max(kdMinS()*.8,Math.min(kdMaxS(),s))};
  const red=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(red||!duur){KD.cam=b;kdCam();return;}
  const t0=performance.now();const f=now=>{const p=Math.min(1,(now-t0)/duur),e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
    KD.cam={x:a.x+(b.x-a.x)*e,y:a.y+(b.y-a.y)*e,s:a.s+(b.s-a.s)*e};kdCam();if(p<1)KD.raf=requestAnimationFrame(f);};KD.raf=requestAnimationFrame(f);
}
function kdOverzicht(direct){const b=KD.bb;const s=kdMinS();
  // Eiland in het bovenste deel (boven het blad), dus iets naar beneden schuiven.
  const m=kdMarge(.19);kdNaar((b.x0+b.x1)/2+m.dx/s,(b.y0+b.y1)/2+m.dy/s,s,direct?0:600);}
function kdZoom(f){kdNaar(KD.cam.x,KD.cam.y,KD.cam.s*f,280);}
function kdFocus(w,off){const [cx,cy]=kp(w.gx+2,w.gy+2,40);const s=Math.min(kdMaxS(),Math.max(.9,kdMinS()*2.6));const m=kdMarge(off==null?.3:off);kdNaar(cx+m.dx/s,cy+m.dy/s,s,650);}
// Namen van wijken als HTML-labels (altijd leesbaar), alleen als je ver genoeg ingezoomd bent.
function kdLabels(){
  const host=document.getElementById('kd-labels');if(!host||!KD.wereld)return;
  const c=KD.cam,toon=c.s>kdMinS()*1.6;host.classList.toggle('zichtbaar',toon);
  if(!host.children.length){host.innerHTML=KD.wereld.lijst.filter(w=>!w.toren).map(w=>`<button class="kd-label" data-wijk="${w.vak.id}" style="--vk:${w.kleur}">${w.klaar?'<i></i>':''}${_kdEsc(w.vak.naam)}</button>`).join('');
    host.querySelectorAll('.kd-label').forEach(b=>b.onclick=()=>kdKies(b.dataset.wijk));}
  if(!toon)return;
  const w0=KD.vw/c.s,h0=KD.vh/c.s,vx=c.x-w0/2,vy=c.y-h0/2;
  host.querySelectorAll('.kd-label').forEach(el=>{const w=KD.wereld.lijst.find(x=>x.vak&&x.vak.id===el.dataset.wijk);if(!w)return;
    const [px,py]=kp(w.gx+4.1,w.gy+4.1,5);el.style.transform=`translate(${((px-vx)*c.s).toFixed(0)}px,${((py-vy)*c.s).toFixed(0)}px) translate(-50%,6px)`;});
}
function _kdEsc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
// Slepen, knijpen, scrollen en tikken.
function kdBind(){
  const kaart=document.getElementById('kd-kaart');const ptrs=new Map();let start=null,sleep=false,pinch=null;
  kaart.addEventListener('pointerdown',e=>{kaart.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(ptrs.size===1){start={x:e.clientX,y:e.clientY,cam:{...KD.cam}};sleep=false;}
    if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),s:KD.cam.s};}});
  kaart.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(ptrs.size===2&&pinch){const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);KD.cam.s=Math.max(kdMinS()*.8,Math.min(kdMaxS(),pinch.s*d/pinch.d));kdCam();sleep=true;return;}
    if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.hypot(dx,dy)>6)sleep=true;
    if(sleep){KD.cam.x=start.cam.x-dx/KD.cam.s;KD.cam.y=start.cam.y-dy/KD.cam.s;kdCam();}});
  const eind=e=>{if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;
    if(ptrs.size===0){if(!sleep){const el=document.elementFromPoint(e.clientX,e.clientY);const a=el&&el.closest&&(el.closest('[data-wijk]')||el.closest('.kd-wijk'));if(a)kdKies(a.getAttribute('data-wijk')||a.getAttribute('data-id'));}start=null;}};
  kaart.addEventListener('pointerup',eind);kaart.addEventListener('pointercancel',eind);
  kaart.addEventListener('wheel',e=>{e.preventDefault();const f=Math.exp(-e.deltaY*.0015);KD.cam.s=Math.max(kdMinS()*.8,Math.min(kdMaxS(),KD.cam.s*f));kdCam();},{passive:false});
  addEventListener('resize',kdResize);
  document.getElementById('kd-grip').onclick=()=>document.getElementById('kd-sheet').classList.toggle('groot');
}
function kdResize(){const k=document.getElementById('kd-kaart');if(!k)return;KD.vw=k.clientWidth;KD.vh=k.clientHeight;kdCam();}
function kdKies(id){
  if(id==='_toren'){KD.sel=null;kdToonLijst(true);kdOverzicht();return;}
  const w=KD.wereld.lijst.find(x=>x.vak&&x.vak.id===id);if(!w)return;
  KD.sel=id;try{playSound('tap');}catch(e){}kdFocus(w);kdToonWijk(id);
}

// ═══════ BLAD: overzicht + wijk ═══════
function kdPips(w){return [0,1,2,3].map(t=>`<i class="${t<w.gebouwd?'b':t<w.gebouwd+w.klaar?'k':''}"></i>`).join('');}
function kdToonLijst(scroll){
  const wd=KD.wereld;const box=document.getElementById('kd-sheet-in');if(!box)return;
  const niv=wd.niv;const tot=wd.wijken.length*4;
  const pct=niv.volgende?Math.round((wd.totaal-niv.min)/(niv.volgende[0]-niv.min)*100):100;
  const volg=wd.wijken.slice().sort((a,b)=>(b.klaar-a.klaar)||((b.st.beheerst/Math.max(1,b.st.N))-(a.st.beheerst/Math.max(1,a.st.N))));
  box.innerHTML=`
    <div class="kd-eiland">
      <div class="kd-eiland-t"><b>${niv.naam}</b><span>${wd.totaal} van ${tot} gebouwen</span></div>
      <div class="kd-balk"><i style="width:${pct}%"></i></div>
      <small>${niv.volgende?`Nog ${niv.volgende[0]-wd.totaal} ${niv.volgende[0]-wd.totaal===1?'gebouw':'gebouwen'} tot ${niv.volgende[1]}`:'Je eiland is compleet'}</small>
    </div>
    ${wd.klaar?`<button class="kd-klaar" onclick="kdKies('${volg[0].vak.id}')"><span class="kd-klaar-ic">🏗️</span><span><b>${wd.klaar===1?'1 gebouw':wd.klaar+' gebouwen'} klaar om te bouwen</b><small>Je beheersing heeft ${wd.klaar===1?'het':'ze'} vrijgespeeld</small></span><span class="kd-chev">›</span></button>`
      :`<p class="kd-uitleg">Gebouwen komen vrij als je leerdoelen <b>beheerst</b> (80% of meer). Oefen, speel Zwakke plek, en kom terug om te bouwen.</p>`}
    <div class="kd-lijst">${volg.map(w=>{const vlg=w.gebouwd+w.klaar;const eis=w.st.eisen[vlg];const thema=kdThema(w.vak.id);
      const rest=vlg<4?Math.max(0,eis-w.st.beheerst):0;
      return `<button class="kd-rij" onclick="kdKies('${w.vak.id}')" style="--vk:${w.kleur}"><span class="kd-rij-dot"></span>
        <span class="kd-rij-t"><b>${_kdEsc(w.vak.naam)}</b><small>${w.klaar?`${thema[w.gebouwd][1]} is bouwklaar`:vlg>=4?'Wijk compleet':`Nog ${rest} ${rest===1?'leerdoel':'leerdoelen'} voor ${thema[vlg][1]}`}</small></span>
        <span class="kd-pips">${kdPips(w)}</span><span class="kd-chev">›</span></button>`;}).join('')}</div>`;
  if(scroll)box.scrollTop=0;
}
function kdToonWijk(id,stil){
  const w=KD.wereld.lijst.find(x=>x.vak&&x.vak.id===id);if(!w)return;
  const box=document.getElementById('kd-sheet-in');const thema=kdThema(id);const st=w.st;
  // Close-up van de wijk: eigen kleine SVG, nog niet gebouwde gebouwen als schim.
  _KG.clear();KD.pre='c';
  const tekening=kdTekenWijk(Object.assign({},w,{gx:0,gy:0}),{spook:true});const defs=kdefs();
  const bb={x0:kp(0,4,0)[0]-20,x1:kp(4,0,0)[0]+20,y0:kp(0,0,150)[1],y1:kp(4,4,0)[1]+14};
  const bijna=st.scores.filter(x=>x.score!=null&&x.score<.8).sort((a,b)=>b.score-a.score).slice(0,3);
  const nooit=st.scores.filter(x=>x.score==null).slice(0,Math.max(0,3-bijna.length));
  const volgende=w.gebouwd+w.klaar;
  box.innerHTML=`
    <button class="kd-terug" onclick="KD.sel=null;kdToonLijst(true);kdOverzicht()">‹ Eiland</button>
    <div class="kd-wijk-kop" style="--vk:${w.kleur}"><b>${_kdEsc(w.vak.naam)}</b><span>${st.beheerst} van ${st.N} leerdoelen beheerst</span></div>
    <div class="kd-closeup"><svg viewBox="${bb.x0} ${bb.y0} ${bb.x1-bb.x0} ${bb.y1-bb.y0}" aria-hidden="true"><defs>${defs}</defs>${tekening}</svg></div>
    <ol class="kd-gebouwen">${thema.map((t,i)=>{const staat=i<w.gebouwd?'b':i<volgende?'k':'';
      return `<li class="${staat}"><span class="kd-g-st">${staat==='b'?'✓':staat==='k'?'!':i+1}</span><span class="kd-g-t"><b>${t[1]}</b><small>${staat==='b'?'Gebouwd':staat==='k'?'Klaar om te bouwen':`Beheers ${st.eisen[i]} leerdoelen (nu ${st.beheerst})`}</small></span>
        ${staat==='k'&&i===w.gebouwd?`<button class="kd-bouw" onclick="kdBouw('${id}')">Bouwen</button>`:''}</li>`;}).join('')}</ol>
    ${volgende<4?`<div class="kd-bijna"><div class="kd-bijna-h">Hier liggen je punten</div>
      ${bijna.map(x=>`<div class="kd-ld"><span>${_kdEsc(x.ld.naam||x.ld.id)}</span><i style="--p:${Math.round(x.score*100)}%"></i><b>${Math.round(x.score*100)}%</b></div>`).join('')}
      ${nooit.map(x=>`<div class="kd-ld nooit"><span>${_kdEsc(x.ld.naam||x.ld.id)}</span><i style="--p:0%"></i><b>nieuw</b></div>`).join('')}
      <div class="kd-acties"><button class="kd-knop" onclick="kdOefen('${id}')">Oefen ${_kdEsc(w.vak.naam)}</button><button class="kd-knop sec" onclick="kdZwak('${id}')">🎯 Zwakke plek</button></div></div>`
      :'<p class="kd-uitleg">Deze wijk is compleet. Knap werk.</p>'}`;
  _KG.clear();
  if(!stil)box.scrollTop=0;
  document.getElementById('kd-sheet').classList.add('groot');
}
function kdOefen(id){kdSluit();try{openVak(id);}catch(e){}}
function kdZwak(id){kdSluit();try{arcadeOpen(()=>{try{ARC.vakId=id;arcStart('zwak');}catch(e){}});}catch(e){}}

// ═══════ BOUWEN ═══════
function kdBouw(id){
  const w=KD.wereld.wijken.find(x=>x.vak.id===id);if(!w||!w.klaar)return;
  const s=kdStaat();s.gebouwd=s.gebouwd||{};const t=(s.gebouwd[id]||0);s.gebouwd[id]=t+1;s.gemeld=Math.max(0,(s.gemeld||0)-1);kdBewaar(s);
  const oudNiv=KD.wereld.niv.naam;
  try{playSound('start');}catch(e){}try{haptic([20,30,20]);}catch(e){}
  KD.bouwt=true;const sh=document.getElementById('kd-sheet');sh.classList.remove('groot');sh.classList.add('mini');
  kdFocus(w,.12);
  KD.timers.push(setTimeout(()=>{
    kdRender({vak:id,t});
    // Stofwolkjes en feest zodra het gebouw staat.
    KD.timers.push(setTimeout(()=>{
      const g=document.querySelector(`.kd-wijk[data-id="${id}"] .kd-gebouw[data-t="${t}"]`);
      if(g){const r=g.getBoundingClientRect();kdStof(r.left+r.width/2,r.bottom-6);}
      try{playSound('levelup');}catch(e){}try{haptic([40,30,80]);}catch(e){}
      try{if(typeof launchConfetti==='function')launchConfetti('gold');}catch(e){}
      const nieuwNiv=KD.wereld.niv.naam;
      if(nieuwNiv!==oudNiv){try{showToast(`Je eiland is nu een ${nieuwNiv}`,'#7c3aed',3200);}catch(e){}}
      try{if(typeof trackEvent==='function')trackEvent('kingdom_bouw',{vak_id:id,gebouw:kdThema(id)[t][0],totaal:KD.wereld.totaal});}catch(e){}
      try{renderPlayRow();}catch(e){}
      KD.timers.push(setTimeout(()=>{KD.bouwt=false;sh.classList.remove('mini');kdFocus(KD.wereld.lijst.find(x=>x.vak&&x.vak.id===id)||w);kdToonWijk(id);},1500));
    },900));
  },650));
}
function kdStof(x,y){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!document.body.animate)return;
  for(let i=0;i<16;i++){const p=document.createElement('i');p.className='kd-stof';p.style.left=x+'px';p.style.top=y+'px';document.body.appendChild(p);
    const a=Math.PI+Math.random()*Math.PI,d=30+Math.random()*60;
    p.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:.9},{transform:`translate(calc(-50% + ${Math.cos(a)*d*1.6}px),calc(-50% + ${Math.sin(a)*d*.5-10}px)) scale(1.6)`,opacity:0}],{duration:900+Math.random()*400,easing:'cubic-bezier(.2,.8,.3,1)'}).onfinish=()=>p.remove();}
}
window.addEventListener('popstate',()=>{const st=document.getElementById('kd-stage');if(st&&!st.hidden)kdSluit();});
