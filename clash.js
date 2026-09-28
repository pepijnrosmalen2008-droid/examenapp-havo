// ═══════════════════════════════════════════════════════════════════════
// clash.js - Slagio Clash: kaartgevecht in een 3D-arena op echte examenstof
// ───────────────────────────────────────────────────────────────────────
// Lazy geladen door clashOpen() (arcade.js); three.js komt pas daarna binnen
// (vendor/three.module.min.js, dynamic import). Speluitleg in het kort:
//   · Kennis is je energie. Hij loopt vanzelf op, maar een goed antwoord in
//     het vragenpaneel geeft er meteen 2 bij. Wie de stof kent, speelt meer.
//   · Drie goed op rij: je volgende kaart is versterkt (+25%).
//   · Vragen komen uit het gekozen vak, met voorrang voor je zwakke leerdoelen.
//     Alles gaat via arcLog() de mastery-laag in (en dus ook naar Kingdom).
//   · Arena 18 × 32 tegels. Team 0 = jij (onder), team 1 = tegenstander.
//     Wereldcoördinaten: wx = x − 9, wz = 16 − z.
// ═══════════════════════════════════════════════════════════════════════

let T=null; // three.js-module
const CL={on:false,raf:0,scene:null,r:null,cam:null,klok:0,ents:[],fx:[],proj:[],hud:null,mode:'lobby'};
const CL_W=18,CL_L=32,CL_RIV0=15,CL_RIV1=17,CL_BRUG=[3.5,14.5];
const CL_TEAM=[
  {c:0x2f78e0,d:0x173f86,l:0x9cc8ff,css:'#2f78e0',naam:'blauw'},
  {c:0xd8392f,d:0x7f1b14,l:0xffa092,css:'#d8392f',naam:'rood'}];
const CL_ARENAS=[
  {naam:'Oefenveld',min:0,gras:['#629e40','#5a943b'],pad:'#d9c38f',lucht:0xbfe3ff,acc:.52,denk:1.25},
  {naam:'Kasteelweide',min:300,gras:['#5a9a42','#53903d'],pad:'#d8bf8a',lucht:0xc8e4ff,acc:.6,denk:1.05},
  {naam:'Rivierdelta',min:700,gras:['#5b9f52','#54954b'],pad:'#cdb58a',lucht:0xbfe0f0,acc:.68,denk:.9},
  {naam:'Bergpas',min:1200,gras:['#6e9a4c','#668f46'],pad:'#c9b595',lucht:0xd6e6f5,acc:.76,denk:.78},
  {naam:'Examenhal',min:2000,gras:['#587f4a','#517644'],pad:'#b8a88e',lucht:0xe3dccf,acc:.84,denk:.66}];

// ── Kaarten ─────────────────────────────────────────────────────────────
// t: unit | bouw | spreuk. doel: 'grond' | 'alles' | 'gebouw'. snelheid in tegels/s.
const CL_KAARTEN={
  ridder:{naam:'Ridder',vak:'Geschiedenis',kort:'GS',k:3,t:'unit',n:1,hp:1450,dmg:165,hit:1.2,bereik:.9,v:1,doel:'grond',r:.45,zeld:0,
    feit:'Ridders vochten te paard voor hun leenheer. In ruil kregen ze land: het leenstelsel uit tijdvak 3.'},
  boog:{naam:'Boogschutters',vak:'Geschiedenis',kort:'GS',k:3,t:'unit',n:2,hp:300,dmg:92,hit:1,bereik:5,v:1,doel:'alles',r:.35,zeld:0,
    feit:'Met de Engelse handboog won een klein leger bij Azincourt (1415) van zwaar bewapende Franse ridders.'},
  reus:{naam:'Rotsreus',vak:'Aardrijkskunde',kort:'AK',k:5,t:'unit',n:1,hp:3300,dmg:215,hit:1.5,bereik:1.2,v:.72,doel:'gebouw',r:.8,zeld:1,
    feit:'Stollingsgesteente ontstaat als magma afkoelt. Graniet koelt diep en langzaam af, basalt snel aan het oppervlak.'},
  thermiet:{naam:'Thermiet',vak:'Scheikunde',kort:'SK',k:4,t:'spreuk',straal:2.5,dmg:580,toren:.35,zeld:1,
    feit:'Thermiet is aluminium met ijzeroxide. Aluminium is onedeler dan ijzer en neemt de zuurstof over: een sterk exotherme redoxreactie.'},
  pijlen:{naam:'Pijlenregen',vak:'Geschiedenis',kort:'GS',k:3,t:'spreuk',straal:3.4,dmg:250,toren:.3,zeld:0,
    feit:'Een salvo pijlen is een baan onder invloed van de zwaartekracht: horizontaal gelijkmatig, verticaal versneld.'},
  elektron:{naam:'Elektronen',vak:'Natuurkunde',kort:'NA',k:1,t:'unit',n:4,hp:78,dmg:70,hit:1,bereik:.6,v:1.5,doel:'grond',r:.28,zeld:0,
    feit:'Een elektron heeft een lading van −1,6 · 10⁻¹⁹ C. Stroom is het aantal coulomb dat per seconde langskomt.'},
  robot:{naam:'Robot',vak:'Informatica',kort:'IN',k:4,t:'unit',n:1,hp:1250,dmg:610,hit:1.8,bereik:.9,v:1.5,doel:'grond',r:.5,zeld:1,
    feit:'Een algoritme is een eindig stappenplan. Deze robot kent er één: dichtstbijzijnde doel, slaan, herhalen.'},
  tesla:{naam:'Teslaspoel',vak:'Natuurkunde',kort:'NA',k:4,t:'bouw',hp:1000,dmg:190,hit:1.1,bereik:5.5,leeft:35,doel:'alles',r:.9,zeld:1,
    feit:'Een teslaspoel is een transformator zonder ijzerkern die heel hoge spanning maakt. De vonk is lucht die geleidt.'},
  ptero:{naam:'Pterosaurus',vak:'Biologie',kort:'BI',k:4,t:'unit',n:1,hp:1050,dmg:140,hit:1.5,bereik:3.5,v:1.5,doel:'alles',vlieg:true,splash:1.1,r:.6,zeld:2,
    feit:'Pterosauriërs waren vliegende reptielen, geen dinosauriërs. Hun vleugel was een huid gespannen aan één lange vinger.'},
  onderzoeker:{naam:'Onderzoeker',vak:'Biologie',kort:'BI',k:4,t:'unit',n:1,hp:720,dmg:225,hit:1.1,bereik:6,v:1,doel:'alles',r:.42,zeld:1,
    feit:'Een goed experiment verandert één variabele tegelijk. De rest houd je constant, anders weet je niet wat het effect veroorzaakt.'},
  ram:{naam:'Stormram',vak:'Geschiedenis',kort:'GS',k:4,t:'unit',n:1,hp:1500,dmg:280,hit:1.6,bereik:.9,v:1.5,doel:'gebouw',r:.7,zeld:1,
    feit:'Stormrammen waren er al bij de Assyriërs. Tegen de middeleeuwse stenen burcht hielp pas het buskruitkanon echt.'},
  kanon:{naam:'Paraboolkanon',vak:'Wiskunde',kort:'WI',k:3,t:'bouw',hp:820,dmg:185,hit:.9,bereik:5.5,leeft:30,doel:'grond',r:.8,zeld:0,
    feit:'Een kogel volgt een parabool: y = ax² + bx + c met a < 0. De top ligt bij x = −b / 2a.'},
};
const CL_ZELD=[{naam:'Gewoon',c:'#8aa4bf'},{naam:'Zeldzaam',c:'#f59e0b'},{naam:'Episch',c:'#a855f7'}];
const CL_DECK0=['ridder','boog','elektron','thermiet','reus','tesla','onderzoeker','pijlen'];
const CL_TOREN={prinses:{hp:1400,dmg:90,hit:.8,bereik:7.5,r:1.5},koning:{hp:2400,dmg:110,hit:1,bereik:7,r:2}};

// ── Opslag ──────────────────────────────────────────────────────────────
function clStore(){const s=arcStore();return Object.assign({bekers:0,gespeeld:0,gewonnen:0,deck:CL_DECK0.slice(),best:0},s.clash||{});}
function clSave(c){const s=arcStore();s.clash=c;arcSave(s);}
function clArena(b){let a=0;CL_ARENAS.forEach((x,i)=>{if(b>=x.min)a=i;});return a;}

// ── Materialen en geometrie (gedeeld, dus weinig geheugen) ──────────────
const _clM={},_clG={};
function clMat(k,f){return _clM[k]||(_clM[k]=f());}
function clGeo(k,f){return _clG[k]||(_clG[k]=f());}
function clStd(k,o){return clMat(k,()=>new T.MeshStandardMaterial(o));}
function clCanvas(w,h,teken){const c=document.createElement('canvas');c.width=w;c.height=h;teken(c.getContext('2d'),w,h);return c;}
function clTex(c,herhaal,kleur){const t=new T.CanvasTexture(c);if(kleur!==false)t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;if(herhaal){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(herhaal[0],herhaal[1]);}return t;}
function clRnd(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

// Metselwerk: stenen met variatie en voegen; tegelijk bruikbaar als bumpmap.
function clSteenCanvas(basis,grijs){
  return clCanvas(256,256,(g,w,h)=>{const R=clRnd(7);g.fillStyle=grijs?'#6d6a64':'#8c867a';g.fillRect(0,0,w,h);
    const rij=32;for(let y=0;y<h;y+=rij){const off=(y/rij)%2?24:0;for(let x=-48;x<w;x+=48){
      const l=grijs?60+R()*40:basis+R()*26;g.fillStyle=grijs?`hsl(30,4%,${l}%)`:`hsl(${34+R()*10},${10+R()*8}%,${l}%)`;
      g.beginPath();g.roundRect(x+off+2,y+2,44,rij-4,4);g.fill();
      g.fillStyle='rgba(255,255,255,.08)';g.fillRect(x+off+4,y+3,40,3);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x+off+4,y+rij-6,40,3);}}
    for(let i=0;i<900;i++){g.fillStyle=`rgba(${R()<.5?0:255},${R()<.5?0:255},${R()<.5?0:255},${.04+R()*.05})`;g.fillRect(R()*w,R()*h,2,2);}});
}
function clHoutCanvas(){
  return clCanvas(256,128,(g,w,h)=>{const R=clRnd(3);for(let y=0;y<h;y+=16){g.fillStyle=`hsl(${26+R()*6},${38+R()*10}%,${30+R()*10}%)`;g.fillRect(0,y,w,15);
    g.strokeStyle='rgba(0,0,0,.18)';for(let i=0;i<5;i++){g.beginPath();g.moveTo(0,y+3+R()*10);g.bezierCurveTo(w*.3,y+R()*15,w*.6,y+R()*15,w,y+3+R()*10);g.stroke();}
    g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,y+15,w,1);}});
}
function clGlow(){return clMat('glowtex',()=>clTex(clCanvas(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.35,'rgba(255,255,255,.5)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);})));}
function clRook(){return clMat('rooktex',()=>clTex(clCanvas(64,64,(g)=>{const R=clRnd(11);for(let i=0;i<14;i++){const x=20+R()*24,y=20+R()*24,r=10+R()*14;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);}})));}

function clMats(){
  const steen=clSteenCanvas(58,false);
  clStd('steen',{map:clTex(steen,[3,1.4]),bumpMap:clTex(steen,[3,1.4],false),bumpScale:2.2,roughness:.92});
  clStd('steenD',{map:clTex(clSteenCanvas(46,false),[3,.5]),roughness:.95,color:0xbfb8aa});
  const hout=clHoutCanvas();
  clStd('hout',{map:clTex(hout,[1,1]),bumpMap:clTex(hout,[1,1],false),bumpScale:1.5,roughness:.85});
  clStd('houtD',{color:0x5b3a22,roughness:.9});
  clStd('huid',{color:0xe9b48f,roughness:.7});
  clStd('huid2',{color:0xb97a56,roughness:.7});
  clStd('oog',{color:0x1b1b22,roughness:.3});
  clStd('staal',{color:0xc9d0d8,metalness:.85,roughness:.32});
  clStd('staalD',{color:0x7c8691,metalness:.8,roughness:.4});
  clStd('goud',{color:0xf2c14e,metalness:1,roughness:.28});
  clStd('koper',{color:0xd08a4e,metalness:1,roughness:.3});
  clStd('leer',{color:0x6b4428,roughness:.8});
  clStd('broek',{color:0x3b3f4a,roughness:.85});
  clStd('wit',{color:0xf4f5f7,roughness:.65});
  clStd('rots',{color:0x8a8178,roughness:.95,flatShading:true});
  clStd('rotsD',{color:0x5f5852,roughness:.95,flatShading:true});
  clStd('magma',{color:0xff7a1a,emissive:0xff5a00,emissiveIntensity:2.2,roughness:.6});
  clStd('glas',{color:0xbfe9ff,metalness:.1,roughness:.05,transparent:true,opacity:.45});
  clStd('vloeistof',{color:0x4ade80,emissive:0x22c55e,emissiveIntensity:.8,roughness:.2});
  clStd('zwart',{color:0x22252b,roughness:.5,metalness:.4});
  clStd('scherm',{color:0x0b1220,emissive:0x38bdf8,emissiveIntensity:1.6,roughness:.3});
  clStd('huidPtero',{color:0x9c7b5a,roughness:.75});
  for(const t of [0,1]){const tc=CL_TEAM[t];
    clStd('team'+t,{color:tc.c,roughness:.6});clStd('teamD'+t,{color:tc.d,roughness:.7});
    clMat('doek'+t,()=>new T.MeshStandardMaterial({color:tc.c,roughness:.8,side:T.DoubleSide}));
    clStd('gloei'+t,{color:tc.l,emissive:tc.l,emissiveIntensity:2.4,roughness:.3});
    clMat('vlies'+t,()=>new T.MeshStandardMaterial({color:t?0xe07a5f:0x6fa8dc,roughness:.8,side:T.DoubleSide,transparent:true,opacity:.92}));}
}
function clMesh(geo,mat,schaduw){const m=new T.Mesh(geo,mat);if(schaduw!==false){m.castShadow=true;m.receiveShadow=true;}return m;}
const clCyl=(rt,rb,h,s)=>clGeo(`cyl${rt}|${rb}|${h}|${s||12}`,()=>new T.CylinderGeometry(rt,rb,h,s||12));
const clBox=(x,y,z)=>clGeo(`box${x}|${y}|${z}`,()=>new T.BoxGeometry(x,y,z));
const clBol=(r,s)=>clGeo(`bol${r}|${s||14}`,()=>new T.SphereGeometry(r,s||14,Math.max(8,(s||14)*.75|0)));
const clCap=(r,l)=>clGeo(`cap${r}|${l}`,()=>new T.CapsuleGeometry(r,l,4,10));
const clKegel=(r,h,s)=>clGeo(`keg${r}|${h}|${s||12}`,()=>new T.ConeGeometry(r,h,s||12));

// ── Figuren ─────────────────────────────────────────────────────────────
// Een mens uit primitieven, met scharnieren voor benen en armen zodat hij
// loopt en slaat. Kijkt standaard naar +z.
function clMens(o){
  const t=o.team,g=new T.Group(),S=o.schaal||1;const lijf=o.lijf||clMat('team'+t,()=>null);
  const been=(x)=>{const p=new T.Group();p.position.set(x,.56,0);const m=clMesh(clCap(.11,.3),o.broek||clMat('broek'));m.position.y=-.24;p.add(m);
    const s=clMesh(clBox(.2,.1,.28),clMat('leer'));s.position.set(0,-.5,.04);p.add(s);g.add(p);return p;};
  const bl=been(-.12),br=been(.12);
  const romp=clMesh(clCap(.25,.28),lijf);romp.position.y=.92;romp.scale.set(1,1,.82);g.add(romp);
  if(o.jas){const j=clMesh(clCyl(.27,.36,.5,14),o.jas);j.position.y=.62;g.add(j);}
  const riem=clMesh(clCyl(.255,.255,.07,14),clMat('leer'));riem.position.y=.74;riem.scale.z=.84;g.add(riem);
  const arm=(x)=>{const p=new T.Group();p.position.set(x,1.1,0);const m=clMesh(clCap(.08,.28),o.mouw||lijf);m.position.y=-.2;p.add(m);
    const h=clMesh(clBol(.085,10),clMat('huid'));h.position.y=-.42;p.add(h);g.add(p);return p;};
  const al=arm(-.34),ar=arm(.34);
  const hoofd=new T.Group();hoofd.position.y=1.43;g.add(hoofd);
  hoofd.add(clMesh(clBol(.2,16),o.huid||clMat('huid')));
  for(const x of [-.07,.07]){const e=clMesh(clBol(.028,8),clMat('oog'),false);e.position.set(x,.03,.18);hoofd.add(e);}
  if(o.helm==='staal'){const h=clMesh(clGeo('helm',()=>new T.SphereGeometry(.225,16,10,0,Math.PI*2,0,Math.PI*.55)),clMat('staal'));h.position.y=.02;hoofd.add(h);
    const v=clMesh(clBox(.3,.05,.06),clMat('staalD'));v.position.set(0,.02,.2);hoofd.add(v);
    const pl=clMesh(clKegel(.07,.34,8),clMat('team'+t));pl.position.set(0,.3,-.04);pl.rotation.x=-.5;hoofd.add(pl);}
  if(o.helm==='kap'){const h=clMesh(clKegel(.26,.42,12),clMat('teamD'+t));h.position.set(0,.14,-.03);h.rotation.x=-.25;hoofd.add(h);}
  if(o.helm==='kroon'){const k=clMesh(clCyl(.17,.15,.1,10),clMat('goud'));k.position.y=.2;hoofd.add(k);
    for(let i=0;i<5;i++){const p=clMesh(clKegel(.035,.1,5),clMat('goud'));const a=i/5*Math.PI*2;p.position.set(Math.sin(a)*.15,.29,Math.cos(a)*.15);hoofd.add(p);}}
  if(o.helm==='bril'){const b=clMesh(clBox(.3,.08,.05),clMat('glas'),false);b.position.set(0,.04,.19);hoofd.add(b);
    const h=clMesh(clGeo('haar',()=>new T.SphereGeometry(.215,14,8,0,Math.PI*2,0,Math.PI*.45)),clStd('haar',{color:0x3a2a1e,roughness:.9}));h.position.set(0,.03,-.02);hoofd.add(h);}
  if(o.wapen==='zwaard'){const w=new T.Group();const bl2=clMesh(clBox(.06,.62,.02),clMat('staal'));bl2.position.y=-.35;w.add(bl2);
    const gd=clMesh(clBox(.22,.04,.05),clMat('goud'));gd.position.y=-.03;w.add(gd);w.position.set(0,-.44,.05);w.rotation.x=Math.PI*.5;ar.add(w);}
  if(o.wapen==='boog'){const b=clMesh(clGeo('boog',()=>new T.TorusGeometry(.32,.022,6,16,Math.PI)),clMat('houtD'));b.position.set(0,-.42,.1);b.rotation.set(0,Math.PI/2,Math.PI/2);al.add(b);}
  if(o.wapen==='fles'){const f=clMesh(clBol(.1,12),clMat('glas'),false);f.position.set(0,-.52,.02);ar.add(f);
    const v=clMesh(clBol(.075,10),clMat('vloeistof'),false);v.position.set(0,-.54,.02);ar.add(v);}
  if(o.schild){const s=clMesh(clCyl(.26,.26,.05,16),clMat('team'+t));s.rotation.z=Math.PI/2;s.position.set(-.07,-.3,.08);al.add(s);
    const b=clMesh(clCyl(.08,.08,.06,10),clMat('staal'));b.rotation.z=Math.PI/2;b.position.set(-.1,-.3,.08);al.add(b);}
  g.scale.setScalar(S);
  return {g,bl,br,al,ar,hoofd,romp,soort:'mens'};
}

function clModel(id,team){
  const t=team;
  if(id==='ridder'){const m=clMens({team:t,helm:'staal',wapen:'zwaard',schild:true,lijf:clMat('staal'),mouw:clMat('staalD'),jas:clMat('team'+t),schaal:1.08});return m;}
  if(id==='boog'){return clMens({team:t,helm:'kap',wapen:'boog',lijf:clMat('team'+t),jas:clMat('teamD'+t),schaal:.9});}
  if(id==='onderzoeker'){return clMens({team:t,helm:'bril',wapen:'fles',lijf:clMat('wit'),mouw:clMat('wit'),jas:clMat('wit'),schaal:1});}
  if(id==='koning'){return clMens({team:t,helm:'kroon',lijf:clMat('team'+t),jas:clMat('teamD'+t),schaal:1.25});}
  if(id==='wacht'){return clMens({team:t,helm:'kap',wapen:'boog',lijf:clMat('team'+t),schaal:.95});}
  if(id==='reus'){
    const g=new T.Group();const rots=clMat('rots');const ico=r=>clGeo('ico'+r,()=>new T.IcosahedronGeometry(r,0));
    const romp=clMesh(ico(.78),rots);romp.position.y=1.55;romp.scale.set(1.1,1.15,.9);g.add(romp);
    for(let i=0;i<5;i++){const s=clMesh(clBol(.07,6),clMat('magma'),false);s.position.set((i%2?.3:-.3)*Math.random(),1.2+i*.18,.72);g.add(s);}
    const sjerp=clMesh(clGeo('sjerp',()=>new T.TorusGeometry(.72,.09,6,18)),clMat('team'+t));sjerp.position.y=1.5;sjerp.rotation.set(1.2,0,.5);g.add(sjerp);
    const hoofd=new T.Group();hoofd.position.y=2.45;g.add(hoofd);hoofd.add(clMesh(ico(.36),clMat('rotsD')));
    for(const x of [-.12,.12]){const e=clMesh(clBol(.05,6),clMat('magma'),false);e.position.set(x,.02,.3);hoofd.add(e);}
    const arm=x=>{const p=new T.Group();p.position.set(x,2.05,0);const a=clMesh(ico(.3),rots);a.position.y=-.35;p.add(a);const f=clMesh(ico(.34),clMat('rotsD'));f.position.y=-.95;p.add(f);g.add(p);return p;};
    const al=arm(-.95),ar=arm(.95);
    const been=x=>{const p=new T.Group();p.position.set(x,.8,0);const b=clMesh(ico(.34),clMat('rotsD'));b.position.y=-.4;b.scale.y=1.3;p.add(b);g.add(p);return p;};
    return {g,bl:been(-.38),br:been(.38),al,ar,hoofd,romp,soort:'mens',zwaar:true};
  }
  if(id==='robot'){
    const g=new T.Group();
    const romp=clMesh(clBox(.62,.62,.44),clMat('staal'));romp.position.y=1.02;g.add(romp);
    const pl=clMesh(clBox(.4,.3,.05),clMat('team'+t));pl.position.set(0,1.05,.23);g.add(pl);
    const hoofd=new T.Group();hoofd.position.y=1.52;g.add(hoofd);
    hoofd.add(clMesh(clBox(.42,.32,.36),clMat('staalD')));const viz=clMesh(clBox(.34,.1,.02),clMat('scherm'),false);viz.position.set(0,.02,.19);hoofd.add(viz);
    const ant=clMesh(clCyl(.015,.015,.3,6),clMat('zwart'));ant.position.set(.12,.3,0);hoofd.add(ant);const tip=clMesh(clBol(.04,8),clMat('gloei'+t),false);tip.position.set(.12,.46,0);hoofd.add(tip);
    const arm=x=>{const p=new T.Group();p.position.set(x,1.22,0);const a=clMesh(clBox(.14,.46,.14),clMat('staalD'));a.position.y=-.22;p.add(a);
      const b=clMesh(clBox(.05,.5,.16),clMat('staal'));b.position.set(0,-.62,.05);p.add(b);g.add(p);return p;};
    const been=x=>{const p=new T.Group();p.position.set(x,.7,0);const a=clMesh(clCyl(.09,.11,.6,10),clMat('zwart'));a.position.y=-.33;p.add(a);g.add(p);return p;};
    return {g,bl:been(-.17),br:been(.17),al:arm(-.43),ar:arm(.43),hoofd,romp,soort:'mens'};
  }
  if(id==='elektron'){
    const g=new T.Group();const kern=new T.Group();kern.position.y=.55;g.add(kern);
    kern.add(clMesh(clBol(.2,16),clMat('gloei'+t),false));
    const ring=(rx,ry)=>{const r=clMesh(clGeo('eRing',()=>new T.TorusGeometry(.34,.018,6,28)),clMat('staal'),false);r.rotation.set(rx,ry,0);kern.add(r);return r;};
    const r1=ring(1.2,0),r2=ring(-.4,.9);
    const s=new T.Sprite(new T.SpriteMaterial({map:clGlow(),color:CL_TEAM[t].l,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.9}));s.scale.set(1.1,1.1,1);kern.add(s);
    return {g,kern,r1,r2,soort:'elektron'};
  }
  if(id==='ptero'){
    const g=new T.Group();const lijf=new T.Group();lijf.position.y=2.3;g.add(lijf);
    const romp=clMesh(clCap(.2,.55),clMat('huidPtero'));romp.rotation.x=Math.PI/2;lijf.add(romp);
    const kop=clMesh(clKegel(.13,.7,8),clMat('huidPtero'));kop.rotation.x=Math.PI/2;kop.position.set(0,.12,.62);lijf.add(kop);
    const kam=clMesh(clKegel(.07,.45,4),clMat('team'+t));kam.rotation.x=-2.3;kam.position.set(0,.3,.32);lijf.add(kam);
    for(const x of [-.07,.07]){const e=clMesh(clBol(.03,6),clMat('oog'),false);e.position.set(x,.2,.46);lijf.add(e);}
    const vleugel=z=>{const p=new T.Group();const geo=clGeo('vleugel',()=>{const b=new T.BufferGeometry();b.setAttribute('position',new T.Float32BufferAttribute([0,0,.35, 0,0,-.35, 1.5,0,-.15, 1.5,0,-.15, 0,0,.35, 1.05,0,.25],3));b.computeVertexNormals();return b;});
      const m=clMesh(geo,clMat('vlies'+t));m.scale.x=z;p.add(m);lijf.add(p);return p;};
    const staart=clMesh(clKegel(.06,.7,6),clMat('huidPtero'));staart.rotation.x=-Math.PI/2;staart.position.z=-.6;lijf.add(staart);
    return {g,lijf,vl:vleugel(-1),vr:vleugel(1),soort:'vlieg'};
  }
  if(id==='ram'){
    const g=new T.Group();const hout=clMat('hout');
    const bal=clMesh(clCyl(.26,.26,2.1,14),hout);bal.rotation.x=Math.PI/2;bal.position.set(0,.62,.1);g.add(bal);
    const kop=clMesh(clKegel(.3,.4,14),clMat('staalD'));kop.rotation.x=Math.PI/2;kop.position.set(0,.62,1.35);g.add(kop);
    const dak=clMesh(clBox(1.1,.08,1.9),clMat('doek'+t));dak.position.y=1.28;dak.rotation.z=0;g.add(dak);
    for(const x of [-.5,.5])for(const z of [-.75,.75]){const p=clMesh(clBox(.08,.8,.08),clMat('houtD'));p.position.set(x,.9,z);g.add(p);}
    const wielen=[];for(const x of [-.55,.55])for(const z of [-.6,.6]){const w=clMesh(clCyl(.28,.28,.12,14),clMat('houtD'));w.rotation.z=Math.PI/2;w.position.set(x,.28,z);g.add(w);wielen.push(w);}
    return {g,wielen,soort:'ram'};
  }
  if(id==='tesla'){
    const g=new T.Group();const v=clMesh(clBox(1.3,.35,1.3),clMat('steen'));v.position.y=.17;g.add(v);
    const kol=clMesh(clCyl(.12,.16,1.8,10),clMat('zwart'));kol.position.y=1.2;g.add(kol);
    for(let i=0;i<4;i++){const r=clMesh(clGeo('tRing',()=>new T.TorusGeometry(.32,.07,8,20)),clMat('koper'));r.rotation.x=Math.PI/2;r.position.y=.6+i*.3;r.scale.setScalar(1-i*.12);g.add(r);}
    const bol=clMesh(clBol(.3,16),clMat('staal'));bol.position.y=2.2;g.add(bol);
    const gl=new T.Sprite(new T.SpriteMaterial({map:clGlow(),color:CL_TEAM[t].l,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.5}));gl.scale.set(1.4,1.4,1);gl.position.y=2.2;g.add(gl);
    return {g,top:bol,gl,soort:'bouw'};
  }
  if(id==='kanon'){
    const g=new T.Group();const v=clMesh(clBox(1.3,.3,1.3),clMat('hout'));v.position.y=.15;g.add(v);
    const draai=new T.Group();draai.position.y=.7;g.add(draai);
    for(const x of [-.42,.42]){const w=clMesh(clCyl(.36,.36,.1,16),clMat('houtD'));w.rotation.z=Math.PI/2;w.position.set(x,-.18,0);draai.add(w);}
    const loop=clMesh(clCyl(.17,.24,1.3,14),clMat('zwart'));loop.rotation.x=Math.PI/2-.45;loop.position.set(0,.12,.25);draai.add(loop);
    const band=clMesh(clCyl(.26,.26,.1,14),clMat('team'+t));band.rotation.x=Math.PI/2-.45;band.position.set(0,.02,.05);draai.add(band);
    return {g,draai,soort:'bouw'};
  }
  return clMens({team:t,schaal:1});
}

// Vlaggetje dat wappert (eigen geometrie, zodat we de hoekpunten kunnen buigen).
function clVlag(team,w,h){
  const geo=new T.PlaneGeometry(w,h,8,3);geo.translate(w/2,0,0);
  const m=new T.Mesh(geo,clMat('doek'+team));m.castShadow=true;m.userData.basis=geo.attributes.position.array.slice();
  CL.vlaggen.push(m);return m;
}
function clTorenModel(soort,team){
  const g=new T.Group();const steen=clMat('steen');
  if(soort==='prinses'){
    const voet=clMesh(clCyl(1.72,1.85,.4,20),clMat('steenD'));voet.position.y=.2;g.add(voet);
    const romp=clMesh(clCyl(1.38,1.58,2.3,20),steen);romp.position.y=1.5;g.add(romp);
    const band=clMesh(clCyl(1.47,1.5,.26,20),clMat('team'+team));band.position.y=1.95;g.add(band);
    const rand=clMesh(clCyl(1.68,1.48,.42,20),steen);rand.position.y=2.86;g.add(rand);
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const b=clMesh(clBox(.46,.46,.32),steen);b.position.set(Math.sin(a)*1.5,3.28,Math.cos(a)*1.5);b.rotation.y=a;g.add(b);}
    for(let i=0;i<4;i++){const a=i/4*Math.PI*2+.4;const s=clMesh(clBox(.12,.46,.08),clMat('zwart'),false);s.position.set(Math.sin(a)*1.5,1.35,Math.cos(a)*1.5);s.rotation.y=a;g.add(s);}
    const vloer=clMesh(clCyl(1.42,1.42,.1,20),clMat('hout'));vloer.position.y=3.06;g.add(vloer);
    const wacht=clModel('wacht',team);wacht.g.position.y=3.1;g.add(wacht.g);
    const paal=clMesh(clCyl(.035,.035,1.7,6),clMat('houtD'));paal.position.set(-1.1,3.9,-.6);g.add(paal);
    const vlag=clVlag(team,.8,.5);vlag.position.set(-1.1,4.5,-.6);g.add(vlag);
    return {g,schutter:wacht,top:3.3};
  }
  const romp=clMesh(clBox(3.4,2.6,3.4),steen);romp.position.y=1.5;g.add(romp);
  const voet=clMesh(clBox(3.9,.4,3.9),clMat('steenD'));voet.position.y=.2;g.add(voet);
  const rand=clMesh(clBox(3.8,.36,3.8),steen);rand.position.y=2.95;g.add(rand);
  for(let i=0;i<4;i++){const x=i<2?-1.72:1.72,z=i%2?-1.72:1.72;
    const t2=clMesh(clCyl(.52,.58,3.5,14),steen);t2.position.set(x,1.75,z);g.add(t2);
    const dak=clMesh(clKegel(.7,1,14),clMat('team'+team));dak.position.set(x,4,z);g.add(dak);
    const kn=clMesh(clBol(.09,8),clMat('goud'));kn.position.set(x,4.55,z);g.add(kn);}
  const poort=clMesh(clBox(1,1.3,.1),clMat('zwart'),false);poort.position.set(0,.95,1.72);g.add(poort);
  const boog=clMesh(clCyl(.5,.5,.1,14,1),clMat('zwart'),false);boog.rotation.x=Math.PI/2;boog.position.set(0,1.6,1.72);g.add(boog);
  for(const x of [-1.05,1.05]){const b=clMesh(clBox(.55,1.1,.04),clMat('doek'+team),false);b.position.set(x,2,1.73);g.add(b);
    const e=clMesh(clBox(.2,.2,.02),clMat('goud'),false);e.position.set(x,2.2,1.76);g.add(e);}
  const vloer=clMesh(clBox(3.3,.1,3.3),clMat('hout'));vloer.position.y=3.12;g.add(vloer);
  const kon=clModel('koning',team);kon.g.position.set(0,3.16,.2);g.add(kon.g);
  const kanon=clMesh(clCyl(.16,.22,1,12),clMat('zwart'));kanon.rotation.x=Math.PI/2-.2;kanon.position.set(.9,3.55,.6);g.add(kanon);
  const vlag=clVlag(team,1,.6);vlag.position.set(-1.72,5.1,1.72);g.add(vlag);
  const paal=clMesh(clCyl(.04,.04,1,6),clMat('houtD'));paal.position.set(-1.72,4.7,1.72);g.add(paal);
  return {g,schutter:kon,top:3.4,kanon};
}

// ── Arena ───────────────────────────────────────────────────────────────
// Veldhelft als één textuur: geblokt gras, graspollen, zandpaden naar de brug.
function clVeldCanvas(ar,vijand){
  const P=40;
  return clCanvas(CL_W*P,15*P,(g,w,h)=>{const R=clRnd(vijand?91:17);
    for(let x=0;x<CL_W;x++)for(let z=0;z<15;z++){g.fillStyle=ar.gras[(x+z)%2];g.fillRect(x*P,z*P,P,P);}
    for(let i=0;i<5200;i++){const x=R()*w,y=R()*h;g.fillStyle=`hsla(${88+R()*30},${40+R()*25}%,${R()<.5?24+R()*12:48+R()*14}%,${.22+R()*.3})`;g.fillRect(x,y,1.5,2+R()*4);}
    // Paden (in tegels, vanaf de eigen achterlijn: z=0 is achter, z=15 is de rivier).
    const pad=(pts,br)=>{g.lineCap='round';g.lineJoin='round';
      g.strokeStyle='rgba(60,45,20,.28)';g.lineWidth=br*P+8;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0]*P,h-p[1]*P):g.moveTo(p[0]*P,h-p[1]*P));g.stroke();
      g.strokeStyle=ar.pad;g.lineWidth=br*P;g.stroke();};
    pad([[3.5,6.5],[3.5,15.2]],1.7);pad([[14.5,6.5],[14.5,15.2]],1.7);pad([[3.5,6.5],[6,3.4],[12,3.4],[14.5,6.5]],1.35);
    const px=g.getImageData(0,0,w,h).data;
    for(let i=0;i<1600;i++){const x=R()*w,y=R()*h;const o=((y|0)*w+(x|0))*4;if(px[o]>170&&px[o+1]>150){g.fillStyle=`rgba(${R()<.5?90:250},${R()<.5?70:235},${R()<.5?40:200},.35)`;g.beginPath();g.arc(x,y,1+R()*2.2,0,7);g.fill();}}
    // Randje schaduw langs de rivieroever voor diepte.
    const gr=g.createLinearGradient(0,0,0,26);gr.addColorStop(0,'rgba(20,40,10,.45)');gr.addColorStop(1,'rgba(20,40,10,0)');g.fillStyle=gr;g.fillRect(0,0,w,26);
  });
}
function clWaterNormaal(){
  const N=128,d=new Uint8Array(N*N*4);
  const hgt=(x,y)=>Math.sin(x*.19+Math.sin(y*.07)*2)*.5+Math.sin(y*.23+x*.05)*.35+Math.sin((x+y)*.11)*.3;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const dx=hgt(x+1,y)-hgt(x-1,y),dy=hgt(x,y+1)-hgt(x,y-1);const l=Math.hypot(dx,dy,1);const i=(y*N+x)*4;
    d[i]=(-dx/l*.5+.5)*255;d[i+1]=(-dy/l*.5+.5)*255;d[i+2]=(1/l*.5+.5)*255;d[i+3]=255;}
  const t=new T.DataTexture(d,N,N);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(4,1);t.needsUpdate=true;return t;
}
function clBoom(R){
  const g=new T.Group();const s=.75+R()*.6;
  const stam=clMesh(clCyl(.08,.12,.8,7),clMat('houtD'));stam.position.y=.4;g.add(stam);
  const blad=clStd('blad'+(R()*3|0),{color:[0x3f7a34,0x356b2e,0x4b8a3a][R()*3|0],roughness:.9,flatShading:true});
  const k1=clMesh(clGeo('boomIco',()=>new T.IcosahedronGeometry(.62,1)),blad);k1.position.y=1.15;g.add(k1);
  const k2=clMesh(clGeo('boomIco2',()=>new T.IcosahedronGeometry(.42,1)),blad);k2.position.set(.28,1.55,.1);g.add(k2);
  g.scale.setScalar(s);g.rotation.y=R()*6;return g;
}
function clBouwScene(arenaIdx){
  const ar=CL_ARENAS[arenaIdx];const sc=new T.Scene();CL.scene=sc;CL.vlaggen=[];
  sc.background=new T.Color(ar.lucht);sc.fog=new T.Fog(ar.lucht,48,120);
  // Omgevingslicht voor reflecties (metaal, glas): een klein gradiënt-luchtje.
  try{const pm=new T.PMREMGenerator(CL.r);const env=new T.Scene();
    const bol=new T.Mesh(new T.SphereGeometry(10,24,12),new T.ShaderMaterial({side:T.BackSide,uniforms:{},vertexShader:'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:'varying vec3 p;void main(){float h=normalize(p).y;vec3 c=mix(vec3(.36,.42,.3),vec3(.75,.86,1.),smoothstep(-.2,.6,h));c+=vec3(1.,.95,.8)*pow(max(dot(normalize(p),normalize(vec3(-.5,.8,.4))),0.),24.)*3.;gl_FragColor=vec4(c,1.);}'}));
    env.add(bol);sc.environment=pm.fromScene(env,.02).texture;pm.dispose();}catch(e){}
  sc.add(new T.HemisphereLight(0xdcecff,0x55703a,.85));
  const zon=new T.DirectionalLight(0xfff1d6,2.6);zon.position.set(-9,22,9);zon.target.position.set(0,0,-1);sc.add(zon,zon.target);
  if(!CL.lite){zon.castShadow=true;zon.shadow.mapSize.set(2048,2048);const c=zon.shadow.camera;c.left=-15;c.right=15;c.top=21;c.bottom=-21;c.near=1;c.far=60;zon.shadow.bias=-.0006;zon.shadow.normalBias=.03;}
  // Veldhelften.
  for(const v of [0,1]){const cv=clVeldCanvas(ar,v);const tx=clTex(cv);const bm=clTex(cv,null,false);
    const m=new T.Mesh(new T.PlaneGeometry(CL_W,15),new T.MeshStandardMaterial({map:tx,bumpMap:bm,bumpScale:1.2,roughness:.95}));
    m.rotation.x=-Math.PI/2;if(v)m.rotation.z=Math.PI;m.position.set(0,0,v?-8.5:8.5);m.receiveShadow=true;sc.add(m);}
  // Rivier: bedding, oevers van steen, water met bewegende golfjes.
  const bed=new T.Mesh(new T.PlaneGeometry(120,2.4),clStd('bed',{color:0x6b5a3e,roughness:1}));bed.rotation.x=-Math.PI/2;bed.position.y=-.55;sc.add(bed);
  for(const z of [1,-1]){const oever=clMesh(clBox(CL_W+1,.62,.3),clMat('steenD'));oever.position.set(0,-.27,z*1.05);sc.add(oever);
    for(const x of [-1,1]){const w=new T.Mesh(clGeo('oeverG',()=>new T.BoxGeometry(50,.5,.5)),clStd('oeverGras',{color:0x4d7a36,roughness:1}));w.position.set(x*34.6,-.28,z*1.1);w.receiveShadow=true;sc.add(w);}}
  CL.waterN=clWaterNormaal();
  const water=new T.Mesh(new T.PlaneGeometry(120,2,1,1),new T.MeshStandardMaterial({color:0x2479b0,roughness:.06,metalness:.2,normalMap:CL.waterN,normalScale:new T.Vector2(.55,.55),transparent:true,opacity:.9}));
  water.rotation.x=-Math.PI/2;water.position.y=-.2;water.receiveShadow=true;sc.add(water);CL.water=water;
  for(const bx of CL_BRUG){const brug=new T.Group();brug.position.set(bx-9,0,0);sc.add(brug);
    const dek=clMesh(clBox(3,.22,3.4),clMat('hout'));dek.position.y=-.02;brug.add(dek);
    for(const x of [-1.45,1.45]){for(const z of [-1.5,0,1.5]){const p=clMesh(clBox(.16,.6,.16),clMat('houtD'));p.position.set(x,.25,z);brug.add(p);}
      const leuning=clMesh(clBox(.1,.1,3.3),clMat('houtD'));leuning.position.set(x,.5,0);brug.add(leuning);}}
  // Rand: een laag muurtje rond de arena, daarbuiten gras, bomen en rotsen.
  const bm=clStd('buiten',{color:new T.Color(ar.gras[1]).multiplyScalar(.78),roughness:1});
  for(const z of [1,-1]){const buiten=new T.Mesh(new T.PlaneGeometry(120,60),bm);buiten.rotation.x=-Math.PI/2;buiten.position.set(0,-.03,z*(1.05+30));buiten.receiveShadow=true;sc.add(buiten);}
  for(const s of [-1,1]){for(const [z0,z1] of [[-16.2,-1.1],[1.1,16.2]]){const len=z1-z0;const mu=clMesh(clBox(.5,.55,len),clMat('steenD'));mu.position.set(s*9.3,.27,(z0+z1)/2);sc.add(mu);}}
  for(const z of [-16.3,16.3]){const mu=clMesh(clBox(19.1,.55,.5),clMat('steenD'));mu.position.set(0,.27,z);sc.add(mu);}
  const R=clRnd(arenaIdx*13+5);
  for(let i=0;i<70;i++){const kant=R()<.5?-1:1;const x=kant*(10.6+R()*9),z=-24+R()*50;const b=clBoom(R);b.position.set(x,0,z);sc.add(b);}
  for(let i=0;i<18;i++){const z=R()<.5?-17.4-R()*5:17.4+R()*4;const b=clBoom(R);b.position.set(-12+R()*24,0,z);sc.add(b);}
  for(let i=0;i<24;i++){const r=clMesh(clGeo('steen'+(i%3),()=>new T.DodecahedronGeometry(.3+(i%3)*.15,0)),clMat('rots'));r.position.set((R()<.5?-1:1)*(9.9+R()*6),.1,-22+R()*44);r.rotation.set(R()*3,R()*3,R()*3);sc.add(r);}
  return sc;
}
// Camera zo zetten dat de hele arena precies in het vrije vlak past.
function clFit(){
  const cam=CL.cam,w=CL.vw,h=CL.vh;cam.aspect=w/h;cam.updateProjectionMatrix();
  const el=CL.hoek||1.02,richt=new T.Vector3(0,Math.sin(el),Math.cos(el)),doel=new T.Vector3(0,0,.9);
  const pts=[[-9.3,0,16.4],[9.3,0,16.4],[-9.3,0,-16.4],[9.3,0,-16.4],[-7,5,-13],[7,5,-13]].map(p=>new T.Vector3(...p));
  const topMax=CL.topMarge!=null?CL.topMarge:.82;
  let lo=8,hi=120;for(let i=0;i<30;i++){const d=(lo+hi)/2;cam.position.copy(doel).addScaledVector(richt,d);cam.lookAt(doel);cam.updateMatrixWorld();
    const ok=pts.every(p=>{const v=p.clone().project(cam);return Math.abs(v.x)<=.99&&v.y<=topMax&&v.y>=-.99;});if(ok)hi=d;else lo=d;}
  cam.position.copy(doel).addScaledVector(richt,hi);cam.lookAt(doel);CL.camBasis=cam.position.clone();CL.camDoel=doel;
  if(CL.scene&&CL.scene.fog){CL.scene.fog.near=hi*1.15;CL.scene.fog.far=hi*2.6;}
}
function clWereld(x,z){return new T.Vector3(x-9,0,16-z);}
function clScherm(x,y,z){const v=new T.Vector3(x-9,y,16-z).project(CL.cam);return [(v.x+1)/2*CL.vw,(1-v.y)/2*CL.vh,v.z];}

// ── Entiteiten ──────────────────────────────────────────────────────────
function clHpBar(e){
  const b=document.createElement('div');b.className='cl-hp t'+e.team+(e.soort==='toren'?' toren '+e.sub:'');
  b.innerHTML=e.soort==='toren'?`<i></i><b>${Math.ceil(e.hp)}</b>`:'<i></i>';
  CL.bars.appendChild(b);e.bar=b;e.barI=b.querySelector('i');e.barB=b.querySelector('b');
}
function clNieuw(e){e.id=++CL.nid;e.cd=e.cd==null?.5:e.cd;e.tgt=null;e.herzie=0;e.fase=Math.random()*6;e.hoek=e.team?0:Math.PI;e.hitT=0;e.swing=9;e.born=CL.t;
  CL.ents.push(e);CL.scene.add(e.m.g);clHpBar(e);clPlaats(e);return e;}
function clPlaats(e){e.m.g.position.set(e.x-9,e.y||0,16-e.z);}
function clMaakToren(sub,team,x,z){
  const d=CL_TOREN[sub];const m=clTorenModel(sub,team);
  m.g.rotation.y=team?0:Math.PI;
  return clNieuw({soort:'toren',sub,team,x,z,hp:d.hp,max:d.hp,r:d.r,bereik:d.bereik,dmg:d.dmg,hit:d.hit,doel:'alles',m,actief:sub==='prinses',hoogte:sub==='koning'?5.2:4.3,cd:1});
}
const CL_FORM={1:[[0,0]],2:[[-.45,0],[.45,0]],3:[[0,.4],[-.45,-.3],[.45,-.3]],4:[[-.4,.4],[.4,.4],[-.4,-.4],[.4,-.4]]};
function clInzet(id,team,x,z,sterk){
  const d=CL_KAARTEN[id];const f=sterk?1.25:1;
  if(d.t==='spreuk'){clSpreuk(id,team,x,z,f);return;}
  const n=d.n||1;const F=CL_FORM[n]||CL_FORM[1];
  F.forEach(([ox,oz],i)=>{
    const m=clModel(id,team);if(sterk)clGoudRand(m);if(d.t==='unit')m.g.scale.multiplyScalar(1.3);m.schaal0=m.g.scale.x;
    const e=clNieuw({soort:d.t==='bouw'?'bouw':'unit',kaart:id,team,x:x+ox,z:z+(team?-oz:oz),y:0,hp:d.hp*f,max:d.hp*f,r:d.r,lucht:!!d.vlieg,bereik:d.bereik,dmg:d.dmg*f,hit:d.hit,
      v:d.v,doel:d.doel,splash:d.splash,leeft:d.leeft,m,drop:.45+i*.06,cd:d.t==='bouw'?.8:.6,sterk:!!sterk,hoogte:{reus:3.2,ptero:3.1,tesla:2.8,ram:1.8,elektron:1.2,kanon:1.6}[id]||2.1});
    e.m.g.scale.multiplyScalar(.01);
  });
  clStof(x,z,d.t==='bouw'?1.6:1.1);arcSnd('pop');
}
// Versterkte kaart: gouden gloed rond de voeten.
function clGoudRand(m){const r=new T.Mesh(clGeo('goudring',()=>new T.RingGeometry(.45,.62,28)),new T.MeshBasicMaterial({color:0xfcd34d,transparent:true,opacity:.8,depthWrite:false,side:T.DoubleSide}));r.rotation.x=-Math.PI/2;r.position.y=.03;m.g.add(r);m.goud=r;}
function clLevend(e){return e&&!e.dood&&CL.ents.includes(e);}
function clAfst(a,b){return Math.hypot(a.x-b.x,a.z-b.z);}
function clKanRaken(a,b){if(a.team===b.team||b.dood)return false;if(a.doel==='gebouw')return b.soort==='toren'||b.soort==='bouw';if(a.doel==='grond'&&b.lucht)return false;
  if((a.soort==='toren'||a.soort==='bouw')&&b.soort==='toren')return false;return true;}
function clInBereik(a,b){return clAfst(a,b)-(b.r||.4)-(a.soort==='unit'?a.r*.3:0)<=a.bereik;}
function clKant(z){return z<CL_RIV0-.05?0:z>CL_RIV1+.05?1:-1;}
function clLaanDoel(e){
  const vij=CL.ents.filter(o=>o.team!==e.team&&o.soort==='toren'&&!o.dood);
  const links=e.x<9;const pr=vij.find(o=>o.sub==='prinses'&&(o.x<9)===links);
  return pr||vij.find(o=>o.sub==='koning')||vij[0]||null;
}
function clZoekDoel(e){
  let best=null,bd=1e9;const zicht=e.soort==='unit'?Math.max(e.bereik+4.5,5.5):e.bereik+(e.soort==='toren'?0:.2);
  for(const o of CL.ents){if(!clKanRaken(e,o))continue;if(e.soort!=='unit'&&o.soort==='toren')continue;
    const d=clAfst(e,o)-(o.r||.4);if(d<=zicht&&d<bd){bd=d;best=o;}}
  if(!best&&e.soort==='unit'){if(e.doel==='gebouw'){let bb=null,bdd=1e9;for(const o of CL.ents){if(o.team!==e.team&&o.soort==='bouw'&&!o.dood){const d=clAfst(e,o);if(d<bdd&&d<6){bdd=d;bb=o;}}}if(bb)return bb;}
    return clLaanDoel(e);}
  return best;
}
function clBeweeg(e,tx,tz,dt){
  let wx=tx,wz=tz;
  if(!e.lucht){const mk=clKant(e.z),dk=tz<16?0:1;
    if(mk===-1){const bx=Math.abs(e.x-CL_BRUG[0])<Math.abs(e.x-CL_BRUG[1])?CL_BRUG[0]:CL_BRUG[1];wx=bx;wz=dk?CL_RIV1+.9:CL_RIV0-.9;}
    else if(mk!==dk){const bx=(Math.abs(e.x-3.5)+Math.abs(tx-3.5))<(Math.abs(e.x-14.5)+Math.abs(tx-14.5))?3.5:14.5;
      if(Math.abs(e.x-bx)<.7){wx=bx;wz=mk===0?CL_RIV1+.9:CL_RIV0-.9;}else{wx=bx;wz=mk===0?CL_RIV0-.5:CL_RIV1+.5;}}}
  const dx=wx-e.x,dz=wz-e.z,l=Math.hypot(dx,dz)||1;const stap=Math.min(l,e.v*dt*CL.tempo);
  e.x+=dx/l*stap;e.z+=dz/l*stap;e.loopt=true;e.kijk=Math.atan2(dx,-dz);
}
function clSchade(o,dmg,bron){
  if(!o||o.dood)return;o.hp-=dmg;o.hitT=.12;
  if(o.soort==='toren'&&o.sub==='koning'&&!o.actief){o.actief=true;clKoningWakker(o);}
  if(o.hp<=0)clDood(o,bron);
}
function clKoningWakker(o){const m=clScherm(o.x,6,o.z);clPop(m,'Koning wakker','kw');arcSnd('flip');}
function clDood(o){
  o.dood=true;o.hp=0;
  if(o.soort==='toren'){
    const tegen=1-o.team;CL.kronen[tegen]+=o.sub==='koning'?3-CL.kronen[tegen]:1;CL.kronen[tegen]=Math.min(3,CL.kronen[tegen]);
    clInstort(o);clKroonVlieg(o,tegen);
    if(o.sub==='prinses'){const k=CL.ents.find(x=>x.team===o.team&&x.sub==='koning'&&!x.dood);if(k&&!k.actief){k.actief=true;clKoningWakker(k);}}
    if(o.sub==='koning'||CL.overtime)CL.eindeNa=1.4;
    CL.hudUpd=true;
  }else{clPoef(o.x,o.z,o.lucht?2.2:.6,o.soort==='bouw'?9:5);o.m.g.visible=false;}
  if(o.bar){o.bar.remove();o.bar=null;}
  if(o.soort!=='toren'){CL.scene.remove(o.m.g);CL.ents=CL.ents.filter(x=>x!==o);}
}
// Toren stort in: zakt weg in stof en laat een ruïne achter.
function clInstort(o){
  const g=o.m.g;const t0=CL.t;arcSnd('wrong');arcHap([40,30,80]);clSchud(.5);
  for(let i=0;i<14;i++)setTimeout(()=>{if(CL.on)clPoef(o.x+(Math.random()-.5)*2.6,o.z+(Math.random()-.5)*2.6,Math.random()*2.5,3);},i*55);
  CL.fx.push({t:0,dur:1.1,upd:p=>{g.position.y=-p*p*2.6;g.rotation.z=Math.sin(p*20)*.03*(1-p);if(p>=1){const kl=o.sub==='koning'?.35:.3;g.scale.y=kl;g.position.y=0;g.traverse(c=>{if(c.isMesh&&c.position.y>2.2)c.visible=false;});}}});
  if(o.bar){o.bar.remove();o.bar=null;}
}
function clKroonVlieg(o,team){
  const m=clScherm(o.x,4,o.z);const r=document.getElementById('cl-veld').getBoundingClientRect();
  const doel=document.querySelector(`#cl-kronen${team} .k:nth-child(${Math.min(3,CL.kronen[team])})`);
  const b=doel?arcMid(doel):{x:r.left+r.width/2,y:r.top+30};
  try{arcFly({x:r.left+m[0],y:r.top+m[1]},b,`<span class="cl-kroon-vl t${team}">${CL_KROON}</span>`,{duur:900,mid:1.7,eind:1,boog:-40});}catch(e){}
  setTimeout(()=>{if(CL.on){clHud();arcSnd(team?'wrong':'fanfare');}},850);
}
const CL_KROON='<svg viewBox="0 0 24 20" aria-hidden="true"><path d="M2 16 1 5l6 5 5-8 5 8 6-5-1 11z" fill="currentColor" stroke="rgba(0,0,0,.35)" stroke-width="1.2" stroke-linejoin="round"/><rect x="2" y="16" width="20" height="3" rx="1" fill="currentColor"/></svg>';

// ── Aanvallen en projectielen ───────────────────────────────────────────
function clAanval(e,o){
  e.swing=0;
  const kind=e.soort==='toren'?(e.sub==='koning'?'kogel':'pijl'):({boog:'pijl',onderzoeker:'fles',ptero:'spuug',kanon:'parabool',tesla:'bliksem'})[e.kaart];
  if(kind==='bliksem'){clBliksem(e,o);clSchade(o,e.dmg,e);arcSnd('tick');return;}
  if(!kind){clSchade(o,e.dmg,e);if(Math.random()<.5)arcFx('hit');clVonk(o.x,(o.lucht?2.2:.9),o.z,0xffffff,5);if(e.kaart==='reus'||e.kaart==='ram'){clSchud(.12);}return;}
  const hoog=e.soort==='toren'?e.m.top+.9:e.lucht?2.3:1.2;
  clProjectiel({kind,team:e.team,x:e.x,y:hoog,z:e.z,tgt:o,dmg:e.dmg,splash:e.splash,bron:e});
}
function clProjMesh(kind,team){
  if(kind==='pijl'){const g=new T.Group();const s=clMesh(clCyl(.025,.025,.9,5),clMat('houtD'),false);s.rotation.x=Math.PI/2;g.add(s);const p=clMesh(clKegel(.06,.16,5),clMat('staal'),false);p.rotation.x=Math.PI/2;p.position.z=.5;g.add(p);return g;}
  if(kind==='kogel'||kind==='parabool'){return clMesh(clBol(kind==='kogel'?.2:.17,10),clMat('zwart'),false);}
  if(kind==='fles'){const g=new T.Group();g.add(clMesh(clBol(.13,10),clMat('glas'),false));g.add(clMesh(clBol(.1,8),clMat('vloeistof'),false));return g;}
  const g=new T.Group();g.add(clMesh(clBol(.16,10),clStd('spuug',{color:0xffb347,emissive:0xff7a00,emissiveIntensity:2})));
  const s=new T.Sprite(new T.SpriteMaterial({map:clGlow(),color:0xff9a3c,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));s.scale.set(.9,.9,1);g.add(s);return g;
}
function clProjectiel(p){
  p.m=clProjMesh(p.kind,p.team);CL.scene.add(p.m);p.t=0;p.x0=p.x;p.y0=p.y;p.z0=p.z;p.tx=p.tgt.x;p.tz=p.tgt.z;p.ty=p.tgt.lucht?2.2:(p.tgt.soort==='toren'?2.2:.7);
  const d=Math.hypot(p.tgt.x-p.x,p.tgt.z-p.z);p.dur=Math.max(.18,d/(p.kind==='parabool'?7:p.kind==='kogel'?10:13));
  p.boog=p.kind==='parabool'?Math.max(1.6,d*.4):p.kind==='fles'?d*.18:p.kind==='pijl'?d*.08:d*.05;
  if(p.kind==='parabool')clParaboolSpoor(p);
  CL.proj.push(p);
}
function clProjStap(dt){
  for(const p of CL.proj.slice()){
    p.t+=dt*CL.tempo;const k=Math.min(1,p.t/p.dur);
    if(clLevend(p.tgt)){p.tx=p.tgt.x;p.tz=p.tgt.z;p.ty=p.tgt.lucht?2.2:(p.tgt.soort==='toren'?2.2:.7);}
    const x=p.x0+(p.tx-p.x0)*k,z=p.z0+(p.tz-p.z0)*k,y=p.y0+(p.ty-p.y0)*k+Math.sin(k*Math.PI)*p.boog;
    const vorig=p.m.position.clone();p.m.position.set(x-9,y,16-z);
    if(p.kind==='pijl'||p.kind==='spreukpijl')p.m.lookAt(p.m.position.clone().multiplyScalar(2).sub(vorig));
    if(k>=1){CL.scene.remove(p.m);CL.proj=CL.proj.filter(q=>q!==p);clInslag(p);}
  }
}
function clInslag(p){
  if(p.spreuk){p.klaar(p);return;}
  if(p.splash){for(const o of CL.ents.slice())if(o.team!==p.team&&!o.dood&&Math.hypot(o.x-p.tx,o.z-p.tz)<=p.splash+(o.r||.4)*.5)clSchade(o,p.dmg,p.bron);clPoef(p.tx,p.tz,p.ty,3,0xffb070);}
  else if(clLevend(p.tgt))clSchade(p.tgt,p.dmg,p.bron);
  if(p.kind==='fles'){clVonk(p.tx,p.ty,p.tz,0x4ade80,7);}
  else if(p.kind==='kogel'||p.kind==='parabool'){clPoef(p.tx,p.tz,p.ty,2);clVonk(p.tx,p.ty,p.tz,0xffd08a,5);}
  else clVonk(p.tx,p.ty,p.tz,0xffffff,3);
}
// Spreuken: vanaf de eigen koningstoren in een boog naar het doel.
function clSpreuk(id,team,x,z,f){
  const d=CL_KAARTEN[id];const k=CL.ents.find(o=>o.team===team&&o.sub==='koning')||{x:9,z:team?29:3};
  const raak=(px,pz,dmg)=>{for(const o of CL.ents.slice()){if(o.team===team||o.dood)continue;const a=Math.hypot(o.x-px,o.z-pz);if(a<=d.straal+(o.r||.4)*.5){
      clSchade(o,dmg*(o.soort==='toren'?d.toren:1),null);
      if(!o.dood&&o.soort==='unit'&&o.max<=400&&a>.01){o.x+=(o.x-px)/a*.8;o.z+=(o.z-pz)/a*.8;}}}};
  if(id==='thermiet'){
    const p={kind:'thermiet',team,x:k.x,y:6,z:k.z,tgt:{x,z,dood:true},tx:x,tz:z,ty:0,dmg:0,spreuk:true};
    p.m=new T.Group();const kern=clMesh(clBol(.42,14),clStd('thermietK',{color:0xffe08a,emissive:0xff8a00,emissiveIntensity:3}),false);p.m.add(kern);
    const gl=new T.Sprite(new T.SpriteMaterial({map:clGlow(),color:0xffa640,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));gl.scale.set(2.6,2.6,1);p.m.add(gl);
    CL.scene.add(p.m);p.t=0;p.x0=k.x;p.y0=6;p.z0=k.z;p.dur=Math.max(.7,Math.hypot(x-k.x,z-k.z)/14);p.boog=5;
    p.klaar=()=>{raak(x,z,d.dmg*f);clOntploffing(x,z,d.straal);};CL.proj.push(p);
    CL.fx.push({t:0,dur:p.dur,upd:()=>{if(Math.random()<.7)clPoef((p.m.position.x+9),16-p.m.position.z,p.m.position.y,1,0xffa060,.5);}});
    return;}
  // Pijlenregen: drie salvo's, elk een derde van de schade.
  for(let s=0;s<3;s++)setTimeout(()=>{if(!CL.on)return;
    for(let i=0;i<9;i++){const px=x+(Math.random()-.5)*d.straal*1.4,pz=z+(Math.random()-.5)*d.straal*1.4;
      const p={kind:'spreukpijl',team,x:k.x+(Math.random()-.5),y:5,z:k.z,tgt:{x:px,z:pz,dood:true},tx:px,tz:pz,ty:0,spreuk:true};
      p.m=clProjMesh('pijl',team);CL.scene.add(p.m);p.t=0;p.x0=p.x;p.y0=5;p.z0=p.z;p.dur=.75+Math.random()*.15;p.boog=4.5;
      p.klaar=i===0?()=>{raak(x,z,d.dmg*f/3);clPoef(x,z,0,4,0xd9c49a);arcSnd('tick');}:()=>clVonk(px,.1,pz,0xd9c49a,1);CL.proj.push(p);}
  },s*260);
}

// ── Effecten ────────────────────────────────────────────────────────────
function clSprite(kleur,add,tex){return new T.Sprite(new T.SpriteMaterial({map:tex||clGlow(),color:kleur,transparent:true,depthWrite:false,blending:add?T.AdditiveBlending:T.NormalBlending}));}
function clFxSprite(s,dur,upd){CL.scene.add(s);CL.fx.push({t:0,dur,upd:p=>{upd(p);if(p>=1){CL.scene.remove(s);s.material.dispose();}}});}
function clPoef(x,z,y,n,kleur,maat){
  if(CL.lite)n=Math.ceil(n/2);
  for(let i=0;i<n;i++){const s=clSprite(kleur||0xf1ede4,false,clRook());const a=Math.random()*6.28,r=Math.random()*.5;
    const p0=new T.Vector3(x-9+Math.cos(a)*r,(y||0)+.3,16-z+Math.sin(a)*r);const v=new T.Vector3(Math.cos(a)*.9,1+Math.random(),Math.sin(a)*.9);const m=(maat||1)*(.9+Math.random()*.9);
    s.position.copy(p0);clFxSprite(s,.7+Math.random()*.4,p=>{s.position.copy(p0).addScaledVector(v,p*.9);s.scale.setScalar(m*(.6+p*1.6));s.material.opacity=(1-p)*.85;});}
}
function clVonk(x,y,z,kleur,n){
  for(let i=0;i<(CL.lite?2:n);i++){const s=clSprite(kleur,true);const p0=new T.Vector3(x-9,y,16-z);const v=new T.Vector3((Math.random()-.5)*4,1.5+Math.random()*3,(Math.random()-.5)*4);
    s.position.copy(p0);clFxSprite(s,.35+Math.random()*.25,p=>{s.position.set(p0.x+v.x*p*.4,p0.y+v.y*p*.4-p*p*1.2,p0.z+v.z*p*.4);s.scale.setScalar(.35*(1-p)+.05);});}
}
function clStof(x,z,r){
  const ring=new T.Mesh(clGeo('stofring',()=>new T.RingGeometry(.6,.95,32)),new T.MeshBasicMaterial({color:0xfff6e0,transparent:true,opacity:.7,depthWrite:false,side:T.DoubleSide}));
  ring.rotation.x=-Math.PI/2;ring.position.set(x-9,.05,16-z);CL.scene.add(ring);
  CL.fx.push({t:0,dur:.5,upd:p=>{ring.scale.setScalar(r*(.5+p*1.4));ring.material.opacity=.7*(1-p);if(p>=1){CL.scene.remove(ring);ring.material.dispose();}}});
  clPoef(x,z,0,4,0xe8dcc0,.7);
}
function clOntploffing(x,z,r){
  arcFx('boom');arcHap([20,20,50]);clSchud(.4);
  const bol=new T.Mesh(clBol(1,20),new T.MeshBasicMaterial({color:0xffc15a,transparent:true,opacity:.9,depthWrite:false,blending:T.AdditiveBlending}));bol.position.set(x-9,.3,16-z);CL.scene.add(bol);
  CL.fx.push({t:0,dur:.55,upd:p=>{bol.scale.setScalar(.3+r*p);bol.material.opacity=.9*(1-p)*(1-p);if(p>=1){CL.scene.remove(bol);bol.material.dispose();}}});
  const ring=new T.Mesh(clGeo('schokgolf',()=>new T.RingGeometry(.85,1,48)),new T.MeshBasicMaterial({color:0xffe2b0,transparent:true,depthWrite:false,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(x-9,.08,16-z);CL.scene.add(ring);
  CL.fx.push({t:0,dur:.6,upd:p=>{ring.scale.setScalar(.5+r*1.3*p);ring.material.opacity=1-p;if(p>=1){CL.scene.remove(ring);ring.material.dispose();}}});
  clPoef(x,z,.2,10,0x6b5a4a,1.4);clVonk(x,.6,z,0xffb040,12);
  const s=clSprite(0xffd28a,true);s.position.set(x-9,1,16-z);clFxSprite(s,.4,p=>{s.scale.setScalar(r*3*(1-p*.5));s.material.opacity=1-p;});
}
function clBliksem(a,b){
  const ay=a.soort==='bouw'?2.2:1.5,by=b.lucht?2.2:.8;const pts=[];const n=8;
  for(let i=0;i<=n;i++){const k=i/n;const j=i&&i<n?.35:0;pts.push(new T.Vector3(a.x-9+(b.x-a.x)*k+(Math.random()-.5)*j,ay+(by-ay)*k+(Math.random()-.5)*j,16-a.z-(b.z-a.z)*k+(Math.random()-.5)*j));}
  const geo=new T.BufferGeometry().setFromPoints(pts);const l=new T.Line(geo,new T.LineBasicMaterial({color:CL_TEAM[a.team].l,transparent:true,blending:T.AdditiveBlending}));CL.scene.add(l);
  CL.fx.push({t:0,dur:.16,upd:p=>{l.material.opacity=1-p;if(p>=1){CL.scene.remove(l);geo.dispose();l.material.dispose();}}});
  clVonk(b.x,by,b.z,CL_TEAM[a.team].l,4);
  if(a.m.gl){a.m.gl.material.opacity=1;}
}
// Het paraboolkanon laat zijn baan even zien: een stippellijn in de lucht.
function clParaboolSpoor(p){
  const pts=[];for(let i=0;i<=24;i++){const k=i/24;pts.push(new T.Vector3(p.x0-9+(p.tgt.x-p.x0)*k,p.y0+(.7-p.y0)*k+Math.sin(k*Math.PI)*p.boog,16-p.z0-(p.tgt.z-p.z0)*k));}
  const geo=new T.BufferGeometry().setFromPoints(pts);const l=new T.Line(geo,new T.LineDashedMaterial({color:0xfff3c4,dashSize:.18,gapSize:.14,transparent:true,opacity:.8}));l.computeLineDistances();CL.scene.add(l);
  CL.fx.push({t:0,dur:.9,upd:q=>{l.material.opacity=.8*(1-q);if(q>=1){CL.scene.remove(l);geo.dispose();l.material.dispose();}}});
}
function clSchud(s){CL.schud=Math.max(CL.schud||0,CL.lite?s*.4:s);}
function clPop(pt,tekst,cls){if(!CL.pops)return;const e=document.createElement('div');e.className='cl-pop '+(cls||'');e.textContent=tekst;e.style.left=pt[0]+'px';e.style.top=pt[1]+'px';CL.pops.appendChild(e);setTimeout(()=>e.remove(),1300);}

// ── Simulatie ───────────────────────────────────────────────────────────
function clEntStap(e,dt){
  if(e.drop>0){e.drop-=dt;return;}
  e.hitT=Math.max(0,e.hitT-dt);e.swing+=dt;e.loopt=false;
  if(e.soort==='bouw'){e.hp-=e.max/e.leeft*dt;if(e.hp<=0){clDood(e);return;}}
  if(e.soort==='toren'&&(!e.actief||e.dood))return;
  e.herzie-=dt;
  if(!clLevend(e.tgt)||(e.herzie<=0&&!e.aanval)){e.tgt=clZoekDoel(e);e.herzie=.3;}
  const o=e.tgt;if(!o){e.aanval=false;return;}
  if(clInBereik(e,o)){
    if(!e.aanval){e.aanval=true;e.cd=Math.max(e.cd,e.hit*.35);}
    e.kijk=Math.atan2(o.x-e.x,-(o.z-e.z));e.cd-=dt*CL.tempo;
    if(e.cd<=0){clAanval(e,o);e.cd=e.hit;}
  }else{
    e.aanval=false;e.cd=Math.max(e.cd-dt,e.hit*.35);
    if(e.soort==='unit')clBeweeg(e,o.x,o.z,dt);else e.tgt=null;
  }
}
// Elkaar opzij duwen, niet door torens heen, niet door de rivier.
function clScheid(){
  const L=CL.ents.filter(e=>!e.dood||e.soort==='toren');
  for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++){
    const a=L[i],b=L[j];if(a.lucht!==b.lucht)continue;const vastA=a.soort!=='unit',vastB=b.soort!=='unit';if(vastA&&vastB)continue;
    if((a.drop>0)||(b.drop>0))continue;
    const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz),min=(vastA?a.r*.95:a.r)+(vastB?b.r*.95:b.r);
    if(d>=min||d<1e-4)continue;const over=(min-d),nx=dx/d,nz=dz/d;
    const ma=vastA?1e9:a.r*a.r,mb=vastB?1e9:b.r*b.r,sa=mb/(ma+mb),sb=ma/(ma+mb);
    if(!vastA){a.x-=nx*over*sa*.5;a.z-=nz*over*sa*.5;}if(!vastB){b.x+=nx*over*sb*.5;b.z+=nz*over*sb*.5;}
  }
  for(const e of L){if(e.soort!=='unit')continue;e.x=Math.max(.4,Math.min(17.6,e.x));e.z=Math.max(.4,Math.min(31.6,e.z));
    if(!e.lucht&&e.z>CL_RIV0-.1&&e.z<CL_RIV1+.1){const opBrug=CL_BRUG.some(b=>Math.abs(e.x-b)<1.3);
      if(!opBrug)e.z=e.z<16?CL_RIV0-.1:CL_RIV1+.1;else{const b=CL_BRUG.find(b=>Math.abs(e.x-b)<1.3);e.x=Math.max(b-1.2,Math.min(b+1.2,e.x));}}}
}
function clHoekNaar(a,b,k){let d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return a+d*k;}
function clAnim(dt){
  const t=CL.t;
  for(const e of CL.ents){const m=e.m,g=m.g;
    if(e.soort!=='toren'){
      let y=0,sc=1;
      if(e.drop>0){const p=Math.min(1,1-e.drop/.45);y=(1-p)*(1-p)*2.2;const c=1.70158;sc=Math.max(.05,1+(c+1)*Math.pow(p-1,3)+c*Math.pow(p-1,2));}
      g.position.set(e.x-9,y,16-e.z);
      const s0=m.schaal0||1;
      const squash=e.hitT>0?.9:1;g.scale.set(s0*sc*(2-squash),s0*sc*squash,s0*sc*(2-squash));
      if(e.kijk!=null&&e.soort==='unit')e.hoek=clHoekNaar(e.hoek,e.kijk,Math.min(1,dt*10));
      if(e.soort==='unit')g.rotation.y=e.hoek;
      if(m.goud){m.goud.material.opacity=.5+Math.sin(t*6)*.3;}
    }
    if(m.soort==='mens'){
      if(e.loopt){e.fase+=dt*(e.v||1)*8*CL.tempo;const a=Math.sin(e.fase)*.65;m.bl.rotation.x=a;m.br.rotation.x=-a;m.al.rotation.x=-a*.7;m.romp.position.y=(m.zwaar?1.55:.92)+Math.abs(Math.cos(e.fase))*.04;}
      else{m.bl.rotation.x*=.8;m.br.rotation.x*=.8;if(!e.aanval)m.al.rotation.x*=.85;}
      const ranged=(e.bereik||0)>2||e.soort==='toren';
      if(ranged&&e.aanval){m.al.rotation.x=-1.45;m.ar.rotation.x=-1.3+Math.max(0,.4-e.swing)*2;}
      else if(e.swing<.45){const s=e.swing;m.ar.rotation.x=s<.1?-2.5*s/.1:-2.5+Math.min(1,(s-.1)/.2)*3.1;if(m.zwaar)m.al.rotation.x=m.ar.rotation.x;}
      else{m.ar.rotation.x*=.85;if(!ranged&&!e.loopt)m.al.rotation.x*=.85;}
    }
    if(e.soort==='toren'&&e.m.schutter&&!e.dood){const sg=e.m.schutter.g;const doel=e.aanval&&clLevend(e.tgt)?Math.atan2(e.tgt.x-e.x,-(e.tgt.z-e.z))-g.rotation.y:0;sg.rotation.y=clHoekNaar(sg.rotation.y,doel,Math.min(1,dt*8));
      const sm=e.m.schutter;if(e.aanval){sm.al.rotation.x=-1.45;}else sm.al.rotation.x*=.9;
      if(e.sub==='koning'&&!e.actief)sm.g.position.y=3.16+Math.max(0,Math.sin(t*1.3))*.0;}
    if(m.soort==='elektron'){m.kern.position.y=.55+Math.sin(t*6+e.fase)*.08;m.r1.rotation.z+=dt*5;m.r2.rotation.y+=dt*4;}
    if(m.soort==='vlieg'){const f=Math.sin(t*9+e.fase)*.55;m.vl.rotation.z=-f;m.vr.rotation.z=f;m.lijf.position.y=2.3+Math.sin(t*9+e.fase+1)*.08;}
    if(m.soort==='ram'&&e.loopt){for(const w of m.wielen)w.rotation.x-=dt*e.v*3.5;}
    if(m.gl){m.gl.material.opacity+=(.45+Math.sin(t*3)*.08-m.gl.material.opacity)*Math.min(1,dt*6);}
    if(m.draai&&clLevend(e.tgt)&&e.aanval){m.draai.rotation.y=clHoekNaar(m.draai.rotation.y,Math.atan2(e.tgt.x-e.x,-(e.tgt.z-e.z)),Math.min(1,dt*8));}
    if(e.soort==='bouw'&&!m.draai&&e.kaart!=='tesla')g.rotation.y=e.hoek;
  }
  for(const v of CL.vlaggen){const a=v.geometry.attributes.position,b=v.userData.basis;for(let i=0;i<a.count;i++){const x=b[i*3];a.array[i*3+2]=Math.sin(x*6-t*6+(b[i*3+1]*2))*.09*x;}a.needsUpdate=true;}
  if(CL.waterN){CL.waterN.offset.x=(t*.03)%1;CL.waterN.offset.y=(t*.05)%1;}
}
function clFxStap(dt){for(const f of CL.fx.slice()){f.t+=dt;const p=Math.min(1,f.t/f.dur);f.upd(p);if(p>=1)CL.fx=CL.fx.filter(x=>x!==f);}}
function clBalken(){
  for(const e of CL.ents){if(!e.bar)continue;
    const [x,y,z]=clScherm(e.x,(e.hoogte||2)+(e.lucht?.4:0),e.z);
    const toon=e.soort==='toren'||e.hp<e.max-.5||CL.t-e.born<1.4;
    e.bar.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;e.bar.classList.toggle('uit',!toon||e.drop>0||z>1||(e.soort==='toren'&&e.sub==='koning'&&!e.actief&&e.hp>=e.max));
    e.barI.style.width=Math.max(0,e.hp/e.max*100).toFixed(1)+'%';if(e.barB)e.barB.textContent=Math.ceil(e.hp);}
}

// ── Tegenstander ────────────────────────────────────────────────────────
function clBot(dt){
  const b=CL.bot,ar=CL_ARENAS[CL.arena];
  b.antw-=dt;if(b.antw<=0){b.antw=(6.5+Math.random()*5)*ar.denk;if(Math.random()<ar.acc){CL.kennis[1]=Math.min(10,CL.kennis[1]+2);b.goed++;}b.vragen++;}
  b.denk-=dt;if(b.denk>0)return;b.denk=(.45+Math.random()*.5)*ar.denk;
  const kn=CL.kennis[1],hand=b.hand;
  const speel=(i,x,z)=>{const id=hand[i];const d=CL_KAARTEN[id];if(CL.kennis[1]<d.k)return false;
    if(d.t!=='spreuk'&&!clMagHier(id,1,x,z)){const alt=clVrijePlek(id,1,x,z);if(!alt)return false;x=alt[0];z=alt[1];}
    CL.kennis[1]-=d.k;clInzet(id,1,x,z,false);hand[i]=b.rij.shift();b.rij.push(id);b.denk+=.6*ar.denk;return true;};
  const dreig=CL.ents.filter(e=>e.team===0&&e.soort==='unit'&&!e.dood&&e.z>10.5);
  if(dreig.length){
    const mx=dreig.reduce((s,e)=>s+e.x,0)/dreig.length,mz=dreig.reduce((s,e)=>s+e.z,0)/dreig.length;
    const lucht=dreig.some(e=>e.lucht),grond=dreig.some(e=>!e.lucht),klein=dreig.filter(e=>e.max<=400).length,tank=dreig.some(e=>e.max>=1300);
    const waarde=dreig.reduce((s,e)=>s+(CL_KAARTEN[e.kaart]?CL_KAARTEN[e.kaart].k/(CL_KAARTEN[e.kaart].n||1):1),0);
    let best=-1,bs=0;
    hand.forEach((id,i)=>{const d=CL_KAARTEN[id];if(d.k>kn)return;let s=1;
      if(d.doel==='gebouw')s-=6;
      if(d.t==='spreuk'){const inR=dreig.filter(e=>Math.hypot(e.x-mx,e.z-mz)<d.straal).length;s+=inR>=3?4:inR>=2&&waarde>=4?2:-3;if(id==='thermiet'&&klein>=3)s-=1;}
      if(lucht&&!grond&&d.doel==='grond')s-=6;if(lucht&&(d.doel==='alles'||d.t==='spreuk'))s+=2;
      if(klein>=3&&(d.splash||id==='pijlen'||id==='tesla'))s+=3;
      if(tank&&(d.t==='bouw'||id==='robot'))s+=3;
      if(d.k>waarde+3)s-=1.5;
      if(s>bs){bs=s;best=i;}});
    if(best>=0&&bs>=1){const d=CL_KAARTEN[hand[best]];
      if(d.t==='spreuk')speel(best,mx,mz+(mz<16?0:.6));
      else if(d.t==='bouw')speel(best,mx<9?7:11,20.5);
      else speel(best,Math.max(1,Math.min(17,mx)),Math.max(17.8,Math.min(26,mz+2.5)));
      return;}
  }
  // Toren afmaken met een spreuk als dat kan.
  const zwak=CL.ents.find(e=>e.team===0&&e.soort==='toren'&&!e.dood&&e.hp<180);
  if(zwak){const i=hand.findIndex(id=>CL_KAARTEN[id].t==='spreuk'&&CL_KAARTEN[id].k<=kn&&CL_KAARTEN[id].dmg*CL_KAARTEN[id].toren>=zwak.hp);if(i>=0){speel(i,zwak.x,zwak.z);return;}}
  const mijnTank=CL.ents.find(e=>e.team===1&&e.soort==='unit'&&e.max>=1300&&e.z>12);
  if(mijnTank&&kn>=4){const i=hand.findIndex(id=>{const d=CL_KAARTEN[id];return d.t==='unit'&&d.k<=kn&&d.bereik>2;});
    if(i>=0){speel(i,mijnTank.x,Math.min(30,mijnTank.z+2));return;}}
  if(kn>=9.3||(kn>=7&&Math.random()<.2)){
    const pr=CL.ents.filter(e=>e.team===0&&e.sub==='prinses');const l=pr.find(e=>e.dood)||pr.sort((a,b)=>a.hp-b.hp)[0];const lx=l?l.x:(Math.random()<.5?3.5:14.5);
    const tanks=['reus','ram','ridder'];let i=hand.findIndex(id=>tanks.includes(id)&&CL_KAARTEN[id].k<=kn);
    if(i>=0){const id=hand[i];speel(i,lx,id==='reus'?29.5:18.4);return;}
    i=hand.findIndex(id=>CL_KAARTEN[id].t==='unit'&&CL_KAARTEN[id].k<=kn);if(i>=0)speel(i,lx,19);
  }
}
function clVrijePlek(id,team,x,z){for(let r=.5;r<4;r+=.5)for(let a=0;a<8;a++){const px=x+Math.cos(a/8*6.28)*r,pz=z+Math.sin(a/8*6.28)*r;if(clMagHier(id,team,px,pz))return [px,pz];}return null;}
function clMagHier(id,team,x,z){
  const d=CL_KAARTEN[id];if(d.t==='spreuk')return x>=0&&x<=CL_W&&z>=0&&z<=CL_L;
  if(x<.5||x>17.5)return false;
  const vijPr=CL.ents.filter(o=>o.team!==team&&o.sub==='prinses');const open=l=>vijPr.some(o=>o.dood&&(o.x<9)===l);
  if(team===0){const max=open(x<9)?21.5:CL_RIV0-.5;if(z<.5||z>max)return false;}
  else{const min=open(x<9)?10.5:CL_RIV1+.5;if(z>31.5||z<min)return false;}
  if(z>CL_RIV0-.3&&z<CL_RIV1+.3)return false;
  for(const o of CL.ents){if(o.soort==='unit'||(o.dood&&o.soort!=='toren'))continue;if(Math.hypot(o.x-x,o.z-z)<o.r+(d.t==='bouw'?d.r:.25))return false;}
  return true;
}

// ── Kaartportretten: gerenderd uit dezelfde 3D-modellen ─────────────────
const CL_PORTRET={};
function clPortretten(){
  if(Object.keys(CL_PORTRET).length)return;
  let r;try{r=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});}catch(e){return;}
  r.setSize(200,240,false);r.setPixelRatio(1);r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.1;
  const sc=new T.Scene();sc.add(new T.HemisphereLight(0xffffff,0x6a5a4a,1.3));const l=new T.DirectionalLight(0xfff0d8,2.8);l.position.set(3,5,6);sc.add(l);
  const rim=new T.DirectionalLight(0x9cc8ff,1.6);rim.position.set(-4,3,-5);sc.add(rim);
  if(CL.scene&&CL.scene.environment)sc.environment=CL.scene.environment;
  const cam=new T.PerspectiveCamera(30,200/240,.1,100);
  for(const id of Object.keys(CL_KAARTEN)){
    let g;const d=CL_KAARTEN[id];
    if(id==='thermiet'){g=new T.Group();g.add(new T.Mesh(clBol(.5,20),clMat('thermietK',()=>new T.MeshStandardMaterial({color:0xffe08a,emissive:0xff8a00,emissiveIntensity:3}))));
      const s=clSprite(0xffa640,true);s.scale.set(2.2,2.2,1);g.add(s);for(let i=0;i<6;i++){const k=new T.Mesh(clBol(.12,8),clMat('rotsD'));const a=i/6*6.28;k.position.set(Math.cos(a)*.8,Math.sin(a)*.5,.2);g.add(k);}g.position.y=.9;}
    else if(id==='pijlen'){g=new T.Group();for(let i=0;i<5;i++){const p=clProjMesh('pijl',0);p.position.set((i-2)*.28,.8+Math.abs(i-2)*.12,0);p.rotation.set(-.9,0,(i-2)*.08);p.scale.setScalar(1.4);g.add(p);}}
    else{const m=clModel(id,0);g=m.g;if(m.soort==='mens'&&!m.zwaar){m.ar.rotation.x=-.5;m.al.rotation.x=-.2;}if(m.soort==='vlieg'){m.vl.rotation.z=-.35;m.vr.rotation.z=.35;}}
    g.rotation.y=id==='ram'?-.9:-.45;sc.add(g);
    const box=new T.Box3().setFromObject(g);const c=box.getCenter(new T.Vector3()),sz=box.getSize(new T.Vector3());
    const h=Math.max(sz.y,sz.x*1.1,sz.z*.8)*1.02;const dist=h/(2*Math.tan(15*Math.PI/180));
    cam.position.set(c.x+dist*.18,c.y+dist*.22,c.z+dist);cam.lookAt(c.x,c.y-sz.y*.04,c.z);
    r.render(sc,cam);CL_PORTRET[id]=r.domElement.toDataURL('image/png');sc.remove(g);
  }
  r.dispose();try{r.forceContextLoss();}catch(e){}
}
const CL_VAKKLEUR={GS:'#b45309',AK:'#15803d',SK:'#dc2626',NA:'#2563eb',IN:'#0e7490',BI:'#16a34a',WI:'#7c3aed'};
function clKaartHtml(id,o){o=o||{};const d=CL_KAARTEN[id];const z=CL_ZELD[d.zeld];
  return `<span class="cl-kaart-art" style="--zc:${z.c};--vc:${CL_VAKKLEUR[d.kort]||'#64748b'}">${CL_PORTRET[id]?`<img src="${CL_PORTRET[id]}" alt="" draggable="false">`:''}<em>${d.k}</em>${o.naam!==false?`<span class="cl-kaart-n">${_arcEsc(d.naam)}</span>`:''}<small>${d.kort}</small></span>`;}

// ── Renderer en lus ─────────────────────────────────────────────────────
function clStartRenderer(host){
  CL.lite=arcLite()||(navigator.hardwareConcurrency||8)<=3;
  const r=new T.WebGLRenderer({antialias:!CL.lite,powerPreference:'high-performance'});
  r.setPixelRatio(Math.min(devicePixelRatio||1,CL.lite?1:1.75));r.shadowMap.enabled=!CL.lite;r.shadowMap.type=T.PCFSoftShadowMap;
  r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.08;
  CL.r=r;host.prepend(r.domElement);r.domElement.className='cl-canvas';
  CL.cam=new T.PerspectiveCamera(34,1,.5,160);
  CL.ro=new ResizeObserver(()=>clResize());CL.ro.observe(host);CL.host=host;clResize();
}
function clResize(){const h=CL.host;if(!h||!CL.r)return;CL.vw=Math.max(1,h.clientWidth);CL.vh=Math.max(1,h.clientHeight);CL.r.setSize(CL.vw,CL.vh,false);CL.r.domElement.style.width=CL.vw+'px';CL.r.domElement.style.height=CL.vh+'px';CL.cam.aspect=CL.vw/CL.vh;CL.cam.updateProjectionMatrix();if(CL.mode!=='lobby')clFit();}
function clLus(nu){
  if(!CL.on)return;CL.raf=requestAnimationFrame(clLus);
  if(document.hidden){CL.vorige=nu;return;}
  const dt=Math.min(.05,Math.max(0,(nu-(CL.vorige||nu))/1000));CL.vorige=nu;
  if(CL.mode==='strijd'&&!CL.pauze){
    if(!CL.klaar){
      CL.tijd-=dt;const dubbel=CL.tijd<=60||CL.overtime;
      if(dubbel&&!CL.dubbelGemeld){CL.dubbelGemeld=true;clBanner(CL.overtime?'Verlenging':'Dubbele kennis',CL.overtime?'De eerste toren die valt, beslist':'Je kennis loopt twee keer zo snel op');}
      const regen=dt/(dubbel?1.5:3);for(const t of [0,1])CL.kennis[t]=Math.min(10,CL.kennis[t]+regen);
      clBot(dt);
    }
    const sdt=CL.klaar?dt*.25:dt;CL.t+=sdt;
    for(const e of CL.ents.slice())clEntStap(e,sdt);clScheid();clProjStap(sdt);
    if(!CL.klaar){
      if(CL.tijd<=0)clTijdOp();
      if(CL.eindeNa!=null){CL.eindeNa-=dt;if(CL.eindeNa<=0){CL.eindeNa=null;clEinde();}}
      clDockTik();
    }
  }else CL.t+=dt;
  clFxStap(dt);clAnim(dt);
  if(CL.mode==='lobby'){const a=CL.t*.05+.5;CL.cam.position.set(Math.sin(a)*31,19,Math.cos(a)*31);CL.cam.lookAt(0,-2.5,0);if(CL.scene.fog){CL.scene.fog.near=40;CL.scene.fog.far=95;}}
  else if(CL.camBasis){const s=CL.schud||0;CL.schud=Math.max(0,s-dt*1.6);CL.cam.position.copy(CL.camBasis);if(s>0)CL.cam.position.add(new T.Vector3((Math.random()-.5)*s,(Math.random()-.5)*s*.6,(Math.random()-.5)*s));}
  CL.r.render(CL.scene,CL.cam);
  if(CL.mode!=='lobby')clBalken();
}
function clStop(){
  CL.on=false;cancelAnimationFrame(CL.raf);
  try{CL.ro&&CL.ro.disconnect();}catch(e){}
  if(CL._key){document.removeEventListener('keydown',CL._key);CL._key=null;}
  if(CL._mv){document.removeEventListener('pointermove',CL._mv);document.removeEventListener('pointerup',CL._up);CL._mv=CL._up=null;}
  try{CL.r&&CL.r.dispose();CL.r&&CL.r.forceContextLoss();}catch(e){}
  CL.r=null;CL.scene=null;CL.scenes={};CL.ghost=null;CL.zone=null;CL.bars=null;CL.pops=null;CL.ents=[];CL.fx=[];CL.proj=[];CL.mode='lobby';
  for(const k in _clM){const m=_clM[k];try{m.dispose&&m.dispose();}catch(e){}delete _clM[k];}
  for(const k in _clG){try{_clG[k].dispose();}catch(e){}delete _clG[k];}
}

// ── Openen en lobby ─────────────────────────────────────────────────────
function openClash(direct){
  ARC.game='clash';
  const st=arcStage('clash',`<div class="cl-root" id="cl-root"><div class="cl-veld" id="cl-veld"><div class="arc-laden cl-laden"><span></span>Arena bouwen…</div></div></div>`);
  ARC.onClose=()=>clStop();
  const laad=T?Promise.resolve(T):import('/vendor/three.module.min.js');
  laad.then(mod=>{T=mod;
    if(!document.getElementById('cl-veld'))return;
    try{clStartRenderer(document.getElementById('cl-veld'));}catch(e){clGeenWebGL();return;}
    clMats();CL.on=true;CL.scenes={};CL.nid=0;CL.t=0;CL.mode='lobby';
    const c=clStore();CL.arena=clArena(c.bekers);clKiesScene(CL.arena);clZetTorens();
    clPortretten();
    arcPool(ARC.vakId,p=>{CL.pool=p;clLobby();if(direct&&(p||[]).length>=8)clStartPotje();});
    CL.vorige=0;CL.raf=requestAnimationFrame(clLus);
  }).catch(()=>clGeenWebGL());
}
function clGeenWebGL(){arcStage('clash',`${arcTop('')}<div class="arc-intro"><h2 class="arc-intro-h">Dit toestel kan de arena niet tonen</h2><p class="arc-intro-p">Slagio Clash heeft 3D nodig (WebGL). Probeer een nieuwere browser, of speel een van de andere games.</p><button class="arc-go" onclick="arcClose()">Terug naar de Arcade</button></div>`);}
function clKiesScene(i){CL.scene=CL.scenes[i]||(CL.scenes[i]=clBouwScene(i));}
function clLeegVeld(){
  for(const e of CL.ents){CL.scene.remove(e.m.g);if(e.bar)e.bar.remove();}for(const p of CL.proj)CL.scene.remove(p.m);
  for(const f of CL.fx){try{f.upd(1);}catch(e){}}CL.ents=[];CL.proj=[];CL.fx=[];CL.vlaggen=[];
}
function clZetTorens(){
  clLeegVeld();if(!CL.bars){CL.bars=document.createElement('div');}
  for(const t of [0,1]){const z=v=>t?CL_L-v:v;clMaakToren('prinses',t,3.5,z(6.5));clMaakToren('prinses',t,14.5,z(6.5));clMaakToren('koning',t,9,z(3));}
}
function clLobby(){
  CL.mode='lobby';CL.klaar=false;
  const c=clStore();const ar=CL_ARENAS[CL.arena];const volgende=CL_ARENAS[CL.arena+1];
  const vak=arcVak(ARC.vakId);const genoeg=(CL.pool||[]).length>=8;
  const veld=document.getElementById('cl-veld');if(!veld)return;
  veld.querySelectorAll('.cl-lobby,.cl-laden,.cl-hud,.cl-bars,.cl-pops,.cl-overlay').forEach(x=>x.remove());
  const pct=volgende?Math.min(100,(c.bekers-ar.min)/(volgende.min-ar.min)*100):100;
  const L=document.createElement('div');L.className='cl-lobby';
  L.innerHTML=`<div class="cl-lobby-top"><button class="arc-x" onclick="arcClose()" aria-label="Sluiten">✕</button>
      <div class="cl-bekers" title="Bekers">${CL_BEKER}<b>${arcNf(c.bekers,0)}</b></div></div>
    <div class="cl-lobby-mid">
      <div class="cl-lobby-k">${_arcEsc(vak?vak.naam:'')}${vak?' · ':''}${_arcEsc(ar.naam)}</div>
      <h1 class="cl-lobby-h">Slagio Clash</h1>
      <p class="cl-lobby-p">Beantwoord vragen voor kennis. Zet met kennis je kaarten in. Haal de torens van je tegenstander neer.</p>
      <div class="cl-arena"><div class="cl-arena-r"><span>${_arcEsc(ar.naam)}</span><small>${volgende?`${arcNf(volgende.min-c.bekers,0)} bekers tot ${_arcEsc(volgende.naam)}`:'Hoogste arena'}</small></div><div class="cl-arena-bar"><i style="width:${pct.toFixed(0)}%"></i></div></div>
    </div>
    <div class="cl-lobby-onder">
      <div class="cl-deck-kop"><b>Jouw deck</b><small>Tik op een kaart om te wisselen</small></div>
      <div class="cl-deck" id="cl-deck">${c.deck.map((id,i)=>`<button class="cl-kaart klein" onclick="clKaartInfo(${i})" aria-label="${_arcEsc(CL_KAARTEN[id].naam)}">${clKaartHtml(id)}</button>`).join('')}</div>
      ${genoeg?`<button class="arc-go cl-strijd" id="cl-strijd">Strijd</button>`:`<p class="cl-lobby-p">${_arcEsc(vak?vak.naam:'Dit vak')} heeft nog te weinig losse vragen. Kies in de Arcade een ander vak.</p><button class="arc-go" onclick="arcClose()">Terug</button>`}
      <div class="cl-lobby-stat">${c.gespeeld?`${c.gewonnen} van ${c.gespeeld} gewonnen`:'Je eerste potje'}</div>
    </div>`;
  veld.appendChild(L);
  const b=document.getElementById('cl-strijd');if(b)b.onclick=()=>{arcSnd('start');clStartPotje();};
}
const CL_BEKER='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v3h3v2a5 5 0 0 1-4.3 4.95A5 5 0 0 1 13 15.9V18h3v3H8v-3h3v-2.1a5 5 0 0 1-2.7-2.95A5 5 0 0 1 4 8V6h3zm0 5V8H6a3 3 0 0 0 1 2.2zm10 0v2.2A3 3 0 0 0 18 8z" fill="currentColor"/></svg>';
function clKaartInfo(i){
  const c=clStore();const id=c.deck[i];const d=CL_KAARTEN[id];
  const rest=Object.keys(CL_KAARTEN).filter(k=>!c.deck.includes(k));
  const st=d.t==='spreuk'?[['Schade',d.dmg],['Straal',arcNf(d.straal,1)+' tegels'],['Op torens',Math.round(d.toren*100)+'%']]
    :[['Levens',d.hp*(d.n||1)+(d.n>1?` (${d.n}×)`:'')],['Schade',d.dmg],['Bereik',d.bereik>2?arcNf(d.bereik,1):'dichtbij'],d.leeft?['Staat',d.leeft+' s']:['Doel',d.doel==='gebouw'?'gebouwen':d.doel==='grond'?'grond':'grond en lucht']];
  const o=document.createElement('div');o.className='cl-sheet';o.innerHTML=`<div class="cl-sheet-in" role="dialog" aria-label="${_arcEsc(d.naam)}">
    <div class="cl-sheet-kop"><div class="cl-kaart groot">${clKaartHtml(id,{naam:false})}</div><div><div class="cl-sheet-z" style="color:${CL_ZELD[d.zeld].c}">${CL_ZELD[d.zeld].naam} · ${_arcEsc(d.vak)}</div><h3>${_arcEsc(d.naam)}</h3><div class="cl-sheet-st">${st.map(s=>`<span><small>${s[0]}</small><b>${s[1]}</b></span>`).join('')}</div></div></div>
    <p class="cl-sheet-feit">${_arcEsc(d.feit)}</p>
    <div class="cl-sheet-k">Wisselen voor</div>
    <div class="cl-deck">${rest.map(k=>`<button class="cl-kaart klein" data-k="${k}">${clKaartHtml(k)}</button>`).join('')}</div>
    <button class="arc-ghost" data-sluit>Klaar</button></div>`;
  document.getElementById('cl-veld').appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
  const sluit=()=>{o.classList.remove('on');setTimeout(()=>o.remove(),220);};
  o.addEventListener('click',e=>{if(e.target===o||e.target.closest('[data-sluit]'))sluit();const k=e.target.closest('[data-k]');
    if(k){const c2=clStore();c2.deck[i]=k.dataset.k;clSave(c2);arcSnd('flip');sluit();clLobby();}});
}

// ── Potje ───────────────────────────────────────────────────────────────
function clStartPotje(){
  const c=clStore();CL.arena=clArena(c.bekers);clKiesScene(CL.arena);
  const veld=document.getElementById('cl-veld');const root=document.getElementById('cl-root');if(!veld)return;
  veld.querySelectorAll('.cl-lobby,.cl-sheet,.cl-hud,.cl-bars,.cl-pops,.cl-overlay').forEach(x=>x.remove());
  CL.bars=document.createElement('div');CL.bars.className='cl-bars';veld.appendChild(CL.bars);
  CL.pops=document.createElement('div');CL.pops.className='cl-pops';veld.appendChild(CL.pops);
  let naam='';try{naam=_lgBotName(Math.random);}catch(e){naam='Tegenstander';}
  const hud=document.createElement('div');hud.className='cl-hud';hud.innerHTML=`<button class="arc-x cl-x" onclick="clOpgeven()" aria-label="Stoppen">✕</button>
    <div class="cl-score"><div class="cl-kr t0" id="cl-kronen0">${'<span class="k"></span>'.repeat(3)}</div><div class="cl-klok" id="cl-klok">3:00</div><div class="cl-kr t1" id="cl-kronen1">${'<span class="k"></span>'.repeat(3)}</div></div>
    <div class="cl-tegen">${_arcEsc(naam)} <small>computer</small></div>`;
  veld.appendChild(hud);
  // Staat van het potje.
  Object.assign(CL,{mode:'strijd',klaar:false,pauze:false,tijd:180,overtime:false,dubbelGemeld:false,eindeNa:null,t:0,tempo:1,kronen:[0,0],kennis:[5,5],
    gespeeld:0,sterk:false,reeks:0,dq:1.6,gebruikt:new Set(),log:[],botNaam:naam,gekozen:-1,schud:0});
  const deck=arcShuffle(c.deck.slice());CL.hand=deck.slice(0,4);CL.rij=deck.slice(4);
  const pool=Object.keys(CL_KAARTEN);const bd=arcShuffle(pool).slice(0,8);if(!bd.some(k=>['reus','ram','ridder'].includes(k)))bd[0]='ridder';
  CL.bot={hand:bd.slice(0,4),rij:bd.slice(4),denk:2.5,antw:4,goed:0,vragen:0};
  clZetTorens();
  CL.hoek=1.05;CL.topMarge=root.clientWidth>=900?.86:.74;
  clDock();clResize();clFit();
  // Camera-zwaai van boven naar de speelpositie.
  const eind=CL.camBasis.clone();const start=eind.clone().add(new T.Vector3(0,14,8));const t0=performance.now();CL.pauze=true;
  const zwaai=nu=>{if(!CL.on)return;const p=Math.min(1,(nu-t0)/1100),e=1-Math.pow(1-p,3);CL.camBasis=start.clone().lerp(eind,e);CL.cam.position.copy(CL.camBasis);CL.cam.lookAt(CL.camDoel);if(p<1)requestAnimationFrame(zwaai);else{CL.camBasis=eind;clAftellen();}};
  requestAnimationFrame(zwaai);
  clVraagNieuw();
}
function clAftellen(){
  const veld=document.getElementById('cl-veld');const el=document.createElement('div');el.className='cl-overlay cl-cd';veld.appendChild(el);
  let n=3;const tik=()=>{if(!CL.on)return;if(n===0){el.innerHTML='<b class="go">Strijd!</b>';arcSnd('start');arcHap(20);CL.pauze=false;setTimeout(()=>el.remove(),650);return;}
    el.innerHTML=`<b>${n}</b>`;arcSnd('tick');n--;setTimeout(tik,650);};tik();
  if(!clStore().gespeeld)setTimeout(()=>{if(CL.on&&!CL.klaar)clBanner('Sleep een kaart naar jouw helft','Te weinig kennis? Beantwoord de vraag hieronder');},2900);
}
function clBanner(t,s){const veld=document.getElementById('cl-veld');if(!veld)return;const b=document.createElement('div');b.className='cl-overlay cl-banner';b.innerHTML=`<b>${_arcEsc(t)}</b><small>${_arcEsc(s||'')}</small>`;veld.appendChild(b);arcSnd('levelup');setTimeout(()=>b.remove(),2400);}
function clHud(){for(const t of [0,1]){const k=document.getElementById('cl-kronen'+t);if(k)k.querySelectorAll('.k').forEach((x,i)=>{const aan=i<CL.kronen[t];if(aan&&!x.classList.contains('aan')){x.classList.add('aan');x.innerHTML=CL_KROON;}});}}
function clTijdOp(){
  if(!CL.overtime&&CL.kronen[0]===CL.kronen[1]){CL.overtime=true;CL.tijd=60;CL.dubbelGemeld=false;return;}
  CL.tijd=0;clEinde();
}
function clOpgeven(){
  if(CL.mode!=='strijd'||CL.klaar){arcClose();return;}
  if(!confirm('Stoppen? Dan telt dit potje als verloren.'))return;
  CL.kronen[1]=3;clEinde(true);
}
function clEinde(opgegeven){
  if(CL.klaar)return;CL.klaar=true;CL.gekozen=-1;clGhostWeg();
  const [a,b]=CL.kronen;const uitslag=a>b?'win':a<b?'verlies':'gelijk';CL.uitslag=uitslag;
  if(!opgegeven&&uitslag==='gelijk'){ // gelijk in kronen: laagste toren beslist niet, gewoon gelijkspel
  }
  const veld=document.getElementById('cl-veld');const o=document.createElement('div');o.className='cl-overlay cl-eind '+uitslag;
  o.innerHTML=`<b>${uitslag==='win'?'Gewonnen':uitslag==='verlies'?'Verloren':'Gelijkspel'}</b><div class="cl-eind-kr">${[0,1,2].map(i=>`<span class="${i<a?'aan':''}">${CL_KROON}</span>`).join('')}</div>`;
  veld&&veld.appendChild(o);
  arcSnd(uitslag==='win'?'fanfare':'complete');if(uitslag==='win'){try{const m=arcMid(o.querySelector('b'));arcBurst(m.x,m.y,{n:36,afstand:190,maat:9});}catch(e){}}
  setTimeout(()=>{if(CL.on)clUitslag();},2300);
}
function clUitslag(){
  const c=clStore();const [a,b]=CL.kronen;const u=CL.uitslag;
  const delta=u==='win'?30+(a-b-1)*4:u==='verlies'?-Math.min(c.bekers,20):0;
  const oudArena=clArena(c.bekers);c.bekers=Math.max(0,c.bekers+delta);c.gespeeld++;if(u==='win')c.gewonnen++;c.best=Math.max(c.best||0,c.bekers);clSave(c);
  const nieuwArena=clArena(c.bekers);
  arcRecord('clash',c.bekers,true);
  const goed=CL.log.filter(x=>x.goed).length,tot=CL.log.length;
  const xp=arcXP(goed*5+(u==='win'?25:u==='gelijk'?10:5)+a*8);
  try{if(typeof trackEvent==='function')trackEvent('minigame',{game:'clash',uitslag:u,kronen:a,tegen:b,goed,vragen:tot,bekers:c.bekers,xp,vak_id:ARC.vakId});}catch(e){}
  const fout=CL.log.filter(x=>!x.goed);
  const leer=fout.slice(0,4).map(x=>{const q=x.it.q;const uit=clUitleg(q,x.keuze);return `<li><div class="cl-leer-v">${_arcEsc(q.v)}</div><div class="cl-leer-a">Juist: <b>${_arcEsc(q.o[q.c])}</b></div>${uit?`<div class="cl-leer-u">${_arcEsc(uit)}</div>`:''}</li>`;}).join('');
  const zwakLd=fout.length?fout[0].it:null;
  clStop();
  arcStage('clash-res',`${arcTop('')}
    <div class="arc-res cl-res ${u==='win'?'win':'lose'}">
      <div class="cl-res-kr">${[0,1,2].map(i=>`<span class="${i<a?'aan':''}" style="--i:${i}">${CL_KROON}</span>`).join('')}</div>
      <div class="arc-res-k">${u==='win'?'Gewonnen':u==='verlies'?'Verloren':'Gelijkspel'} · ${a} tegen ${b}</div>
      <div class="arc-res-big"><span class="cl-beker-ic">${CL_BEKER}</span><span class="arc-tel">${arcNf(c.bekers-delta,0)}</span></div>
      <div class="arc-res-sub">${delta>0?`+${delta} bekers`:delta<0?`${delta} bekers`:'Bekers blijven gelijk'}${nieuwArena>oudArena?` · Nieuwe arena: <b>${_arcEsc(CL_ARENAS[nieuwArena].naam)}</b>`:''}</div>
      <div class="arc-res-stats"><div><b>${goed}/${tot}</b><small>goed beantwoord</small></div><div><b>${CL.gespeeld}</b><small>kaarten gespeeld</small></div><div><b>${tot?Math.round(goed/tot*100):0}%</b><small>score vragen</small></div></div>
      ${xp?`<div class="arc-res-xp"><span class="arc-xp-chip">+<b class="arc-xp-n">0</b> XP</span><small>telt mee voor je divisie</small></div>`:''}
      ${leer?`<div class="cl-leer"><div class="cl-leer-k">Dit ging mis. Lees het even na:</div><ul>${leer}</ul></div>`:tot?`<div class="arc-res-leer">Alle ${tot} vragen goed. Zo win je potjes.</div>`:''}
      <div class="arc-res-btns"><button class="arc-go" onclick="openClash(true)">Nog een potje</button>
        ${zwakLd?`<button class="arc-ghost" onclick="clOefenZwak('${_arcEsc(zwakLd.ldId)}')">Oefen ${_arcEsc(zwakLd.ldNaam||'dit leerdoel')} in Zwakke plek</button>`:''}
        <button class="arc-ghost" onclick="arcClose()">Terug naar de Arcade</button></div>
    </div>`);
  arcTel(document.querySelector('.arc-tel'),c.bekers,{van:c.bekers-delta,duur:1000});
  if(xp)setTimeout(()=>{arcTel(document.querySelector('.arc-xp-n'),xp,{duur:900});arcSnd('xp');},700);
  if(u==='win'){setTimeout(()=>{const m=arcMid(document.querySelector('.cl-res-kr'));arcBurst(m.x,m.y,{n:30,afstand:170,maat:9});},500);if(nieuwArena>oudArena){try{if(!arcLite())launchConfetti('gold');}catch(e){}}}
}
function clOefenZwak(ld){try{ZWAK.doel=null;ZWAK.forceLd=ld;}catch(e){}arcStart('zwak');}
function clUitleg(q,keuze){
  let t='';if(Array.isArray(q.uo)&&keuze!=null&&q.uo[keuze])t=q.uo[keuze];else if(q.u)t=q.u;
  if(!t)return '';try{return new DOMParser().parseFromString(String(t),'text/html').body.textContent.trim().slice(0,260);}catch(e){return '';}
}

// ── Dock: vraag, hand en kennisbalk ─────────────────────────────────────
function clDock(){
  const root=document.getElementById('cl-root');let d=document.getElementById('cl-dock');if(d)d.remove();
  d=document.createElement('div');d.className='cl-dock';d.id='cl-dock';
  const vak=arcVak(ARC.vakId);
  d.innerHTML=`<div class="cl-dock-kop"><b>${_arcEsc(vak?vak.naam:'Vragen')}</b><span>Goed antwoord: +2 kennis. Drie op rij: je volgende kaart is versterkt.</span></div>
    <div class="cl-vraag" id="cl-vraag"></div>
    <div class="cl-sterk" id="cl-sterk" hidden>Drie goed op rij: je volgende kaart is versterkt</div>
    <div class="cl-hand"><div class="cl-next"><small>Volgende</small><div class="cl-kaart mini" id="cl-next"></div></div>
      <div class="cl-kaarten" id="cl-kaarten"></div></div>
    <div class="cl-kennis"><div class="cl-kennis-bar" id="cl-kbar"><i></i>${'<s></s>'.repeat(9)}</div><b id="cl-knum">5</b></div>`;
  root.appendChild(d);clHand();clInput();
}
function clHand(){
  const k=document.getElementById('cl-kaarten');if(!k)return;
  k.innerHTML=CL.hand.map((id,i)=>`<button class="cl-kaart${CL.gekozen===i?' gekozen':''}" data-i="${i}" aria-label="${_arcEsc(CL_KAARTEN[id].naam)}, ${CL_KAARTEN[id].k} kennis">${clKaartHtml(id)}</button>`).join('');
  const n=document.getElementById('cl-next');if(n)n.innerHTML=clKaartHtml(CL.rij[0],{naam:false});
  clDockTik(true);
}
function clDockTik(){
  const kn=CL.kennis[0];const bar=document.getElementById('cl-kbar');if(!bar)return;
  bar.firstChild.style.width=(kn*10).toFixed(1)+'%';const num=document.getElementById('cl-knum');const hele=Math.floor(kn);if(num.textContent!=hele)num.textContent=hele;
  document.querySelectorAll('#cl-kaarten .cl-kaart').forEach(b=>{const id=CL.hand[+b.dataset.i];const kan=kn>=CL_KAARTEN[id].k;b.classList.toggle('kan',kan);b.classList.toggle('sterk',CL.sterk);
    b.style.setProperty('--laad',Math.min(1,kn/CL_KAARTEN[id].k).toFixed(3));});
  const s=document.getElementById('cl-sterk');if(s)s.hidden=!CL.sterk;
  const kl=document.getElementById('cl-klok');if(kl){const t=Math.max(0,Math.ceil(CL.tijd));const txt=Math.floor(t/60)+':'+String(t%60).padStart(2,'0');if(kl.textContent!==txt)kl.textContent=txt;
    kl.classList.toggle('dubbel',CL.tijd<=60||CL.overtime);kl.classList.toggle('laatst',CL.tijd<=10);}
}
// Vraag kiezen: de helft van de tijd uit je zwakke leerdoelen, moeilijkheid past zich aan.
function clKiesVraag(){
  const pool=CL.pool||[];if(!pool.length)return null;
  if(!CL.kort){CL.kort=pool.filter(x=>x.q.v.length<=170&&x.q.o.every(o=>String(o).length<=70));if(CL.kort.length<12)CL.kort=pool;
    const cache={};CL.zwakPool=CL.kort.filter(x=>{if(cache[x.ldId]==null){try{const m=ldMastery(ARC.vakId,x.ldId);cache[x.ldId]=!m.hasData||m.score<.6;}catch(e){cache[x.ldId]=false;}}return cache[x.ldId];});}
  const bron=CL.zwakPool.length>=4&&Math.random()<.5?CL.zwakPool:CL.kort;
  return arcNext(bron,CL.gebruikt,Math.round(CL.dq));
}
function clVraagNieuw(){
  const it=clKiesVraag();const box=document.getElementById('cl-vraag');if(!box)return;
  if(!it){box.innerHTML='<div class="cl-v-leeg">Geen vragen beschikbaar</div>';return;}
  const o=arcOpties(it.q);CL.vraag={it,o,t0:performance.now(),klaar:false};
  const L=['A','B','C','D'];
  box.innerHTML=`<div class="cl-v-meta"><span>${_arcEsc(it.ldNaam||it.domNaam||'')}</span><span class="cl-v-reeks">${CL.reeks?'●'.repeat(CL.reeks)+'○'.repeat(Math.max(0,3-CL.reeks)):'+2 kennis per goed antwoord'}</span></div>
    <div class="cl-v-t">${_arcEsc(it.q.v)}</div>
    <div class="cl-v-o">${o.idx.map((oi,k)=>`<button class="cl-opt" data-k="${k}"><i>${L[k]}</i><span>${_arcEsc(it.q.o[oi])}</span></button>`).join('')}</div>
    <div class="cl-v-fb" id="cl-vfb"></div>`;
  box.classList.remove('in');void box.offsetWidth;box.classList.add('in');
  box.querySelectorAll('.cl-opt').forEach(b=>b.onclick=()=>clAntwoord(+b.dataset.k));
}
function clAntwoord(k){
  const V=CL.vraag;if(!V||V.klaar||CL.klaar)return;V.klaar=true;
  const goed=k===V.o.juist;const ms=performance.now()-V.t0;const keuze=V.o.idx[k];
  arcLog(V.it,goed,keuze,ms);CL.log.push({it:V.it,goed,keuze});
  const knoppen=[...document.querySelectorAll('#cl-vraag .cl-opt')];knoppen.forEach(b=>b.disabled=true);
  knoppen[V.o.juist].classList.add('goed');
  if(goed){
    CL.dq=Math.min(3,CL.dq+.34);CL.reeks++;const oud=CL.kennis[0];CL.kennis[0]=Math.min(10,CL.kennis[0]+2);
    arcSnd('correct');arcHap(12);
    try{arcFly(arcMid(knoppen[k]),arcMid(document.getElementById('cl-knum')),'<span class="cl-plus">+2</span>',{duur:520,eind:.8,boog:-30});}catch(e){}
    if(CL.kennis[0]-oud<2){const f=document.getElementById('cl-vfb');if(f)f.textContent='Kennis zat al vol. Speel een kaart!';}
    if(CL.reeks>=3){CL.reeks=0;if(!CL.sterk){CL.sterk=true;arcSnd('streak');clDockTik();}}
    setTimeout(()=>{if(CL.mode==='strijd'&&!CL.klaar)clVraagNieuw();},650);
  }else{
    CL.dq=Math.max(1,CL.dq-.5);CL.reeks=0;knoppen[k].classList.add('fout');arcSnd('wrong');arcHap([20,30,20]);
    const f=document.getElementById('cl-vfb');const uit=clUitleg(V.it.q,keuze);
    if(f){f.innerHTML=`<div class="cl-v-uit">${uit?_arcEsc(uit):'Het goede antwoord staat nu groen.'}</div><button class="cl-verder" id="cl-verder">Volgende vraag</button>`;}
    const knop=document.getElementById('cl-verder');let klaar=false;const verder=()=>{if(klaar)return;klaar=true;if(CL.mode==='strijd'&&!CL.klaar)clVraagNieuw();};
    if(knop){knop.disabled=true;setTimeout(()=>{knop.disabled=false;},1500);knop.onclick=verder;}
    setTimeout(verder,9000);
  }
}

// ── Besturing: kaart slepen of tikken, dan op het veld tikken ───────────
function clInput(){
  const kaarten=document.getElementById('cl-kaarten'),cv=CL.r.domElement;
  const ray=new T.Raycaster(),vlak=new T.Plane(new T.Vector3(0,1,0),0),v2=new T.Vector2(),p3=new T.Vector3();
  const punt=(cx,cy)=>{const r=cv.getBoundingClientRect();if(cx<r.left||cx>r.right||cy<r.top||cy>r.bottom)return null;
    v2.set((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1);ray.setFromCamera(v2,CL.cam);if(!ray.ray.intersectPlane(vlak,p3))return null;
    return [Math.round((p3.x+9)*2)/2,Math.round((16-p3.z)*2)/2];};
  let sleep=null;
  kaarten.addEventListener('pointerdown',e=>{const b=e.target.closest('.cl-kaart');if(!b||CL.klaar||CL.mode!=='strijd')return;e.preventDefault();sleep={i:+b.dataset.i,x:e.clientX,y:e.clientY,beweeg:false};});
  if(CL._mv){document.removeEventListener('pointermove',CL._mv);document.removeEventListener('pointerup',CL._up);}
  CL._mv=e=>{
    if(!sleep){if(CL.gekozen>=0&&e.pointerType==='mouse')clGhost(CL.hand[CL.gekozen],punt(e.clientX,e.clientY));return;}
    if(!sleep.beweeg&&Math.hypot(e.clientX-sleep.x,e.clientY-sleep.y)>12){sleep.beweeg=true;CL.gekozen=sleep.i;clHand();document.documentElement.classList.add('cl-sleept');}
    if(sleep.beweeg)clGhost(CL.hand[sleep.i],punt(e.clientX,e.clientY));
  };
  CL._up=e=>{if(!sleep)return;const s=sleep;sleep=null;document.documentElement.classList.remove('cl-sleept');
    if(s.beweeg){const pt=punt(e.clientX,e.clientY);if(pt)clSpeel(s.i,pt[0],pt[1]);CL.gekozen=-1;clGhostWeg();clHand();}
    else{CL.gekozen=CL.gekozen===s.i?-1:s.i;arcSnd('tap');if(CL.gekozen<0)clGhostWeg();clHand();}};
  document.addEventListener('pointermove',CL._mv);document.addEventListener('pointerup',CL._up);
  if(!cv._clBound){cv._clBound=true;cv.addEventListener('pointerdown',e=>{if(CL.gekozen<0||CL.klaar||CL.mode!=='strijd')return;const pt=punt(e.clientX,e.clientY);if(!pt)return;
    if(clSpeel(CL.gekozen,pt[0],pt[1])){CL.gekozen=-1;clGhostWeg();clHand();}});}
  if(CL._key)document.removeEventListener('keydown',CL._key);
  CL._key=e=>{if(CL.mode!=='strijd'||CL.klaar)return;const k=String(e.key).toLowerCase();
    const a={a:0,b:1,c:2,d:3}[k];if(a!=null){e.preventDefault();const b=document.querySelectorAll('#cl-vraag .cl-opt')[a];if(b&&!b.disabled)b.click();return;}
    const kk={'1':0,'2':1,'3':2,'4':3}[k];if(kk!=null){CL.gekozen=CL.gekozen===kk?-1:kk;if(CL.gekozen<0)clGhostWeg();clHand();}
    if(k==='escape'){CL.gekozen=-1;clGhostWeg();clHand();}};
  document.addEventListener('keydown',CL._key);
}
function clSpeel(i,x,z){
  const id=CL.hand[i];const d=CL_KAARTEN[id];if(!d||CL.pauze||CL.klaar)return false;
  if(CL.kennis[0]<d.k){const b=document.querySelector(`#cl-kaarten [data-i="${i}"]`);arcRestart(b,'nee');arcSnd('wrong');
    clPopMid(`Nog ${Math.ceil(d.k-CL.kennis[0])} kennis nodig. Beantwoord een vraag!`);arcRestart(document.getElementById('cl-vraag'),'wijs');return false;}
  if(!clMagHier(id,0,x,z)){let a=null;if(d.t!=='spreuk'){const zz=Math.min(z,CL_RIV0-.5);a=clMagHier(id,0,x,zz)?[x,zz]:clVrijePlek(id,0,x,zz);}
    if(!a){clPopMid('Hier kun je niet inzetten');arcSnd('wrong');return false;}x=a[0];z=a[1];}
  CL.kennis[0]-=d.k;const sterk=CL.sterk;CL.sterk=false;
  clInzet(id,0,x,z,sterk);CL.gespeeld++;CL.hand[i]=CL.rij.shift();CL.rij.push(id);arcHap(10);clHand();return true;
}
function clPopMid(t){const v=document.getElementById('cl-veld');if(!v)return;clPop([v.clientWidth/2,v.clientHeight*.62],t,'mid');}
function clGhost(id,pt){
  if(!pt||!id){if(CL.ghost)CL.ghost.visible=false;return;}
  const d=CL_KAARTEN[id];let g=CL.ghost;
  if(!g||g.userData.id!==id){clGhostWeg();g=new T.Group();g.userData.id=id;g.userData.eigen=[];
    const r=d.t==='spreuk'?d.straal:d.t==='bouw'?d.r:.55;
    const basis=(geo,op)=>{const m=new T.Mesh(geo,new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:op,depthWrite:false,side:T.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.y=.05;m.userData.basis=true;g.add(m);g.userData.eigen.push(m);return m;};
    basis(new T.CircleGeometry(r,40),.22);basis(new T.RingGeometry(r-.07,r,48),.9);
    if(d.bereik>2)basis(new T.RingGeometry(d.bereik-.05,d.bereik,64),.35);
    if(d.t!=='spreuk'){const m=clModel(id,0);m.g.traverse(c=>{if(c.isMesh){c.material=c.material.clone();c.material.transparent=true;c.material.opacity=.55;c.castShadow=false;g.userData.eigen.push(c);}});
      if(d.n>1)m.g.scale.multiplyScalar(.9);g.add(m.g);}
    CL.scene.add(g);CL.ghost=g;clZone(d.t!=='spreuk');}
  g.visible=true;
  const ok=CL.kennis[0]>=d.k&&(d.t==='spreuk'||clMagHier(id,0,pt[0],pt[1])||clMagHier(id,0,pt[0],Math.min(pt[1],CL_RIV0-.5)));
  let z=pt[1];if(d.t!=='spreuk'&&!clMagHier(id,0,pt[0],z))z=Math.min(z,CL_RIV0-.5);
  g.position.set(pt[0]-9,0,16-z);
  for(const m of g.userData.eigen)if(m.userData.basis)m.material.color.setHex(ok?0xffffff:0xff6b6b);
}
function clZone(aan){
  if(!CL.zone){const mk=()=>{const m=new T.Mesh(new T.PlaneGeometry(9,1),new T.MeshBasicMaterial({color:0xff3b30,transparent:true,opacity:.2,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=.06;CL.scene.add(m);return m;};CL.zone=[mk(),mk()];}
  const vijPr=CL.ents.filter(o=>o.team===1&&o.sub==='prinses');
  CL.zone.forEach((m,i)=>{if(m.parent!==CL.scene)CL.scene.add(m);const links=i===0;const open=vijPr.some(o=>o.dood&&(o.x<9)===links);const z0=open?21.5:CL_RIV0,z1=CL_L;
    m.scale.y=z1-z0;m.position.set(links?-4.5:4.5,.06,16-(z0+z1)/2);m.visible=aan;});
}
function clGhostWeg(){
  if(CL.ghost){CL.scene&&CL.scene.remove(CL.ghost);for(const m of CL.ghost.userData.eigen||[]){try{m.material.dispose();if(m.geometry.type==='CircleGeometry'||m.geometry.type==='RingGeometry')m.geometry.dispose();}catch(e){}}CL.ghost=null;}
  if(CL.zone)CL.zone.forEach(m=>m.visible=false);
}
