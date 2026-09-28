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
  {naam:'Oefenveld',min:0,gras:['#629e40','#5a943b'],pad:'#d9c38f',lucht:0xbfe3ff,acc:.45,denk:1.4},
  {naam:'Kasteelweide',min:300,gras:['#5a9a42','#53903d'],pad:'#d8bf8a',lucht:0xc8e4ff,acc:.6,denk:1.05},
  {naam:'Rivierdelta',min:700,gras:['#5b9f52','#54954b'],pad:'#cdb58a',lucht:0xbfe0f0,acc:.68,denk:.9},
  {naam:'Bergpas',min:1200,gras:['#6e9a4c','#668f46'],pad:'#c9b595',lucht:0xd6e6f5,acc:.76,denk:.78},
  {naam:'Examenhal',min:2000,gras:['#587f4a','#517644'],pad:'#b8a88e',lucht:0xe3dccf,acc:.84,denk:.66}];

// ── Kaarten ─────────────────────────────────────────────────────────────
// t: unit | bouw | spreuk. doel: 'grond' | 'alles' | 'gebouw'. snelheid in tegels/s.
const CL_KAARTEN={
  ridder:{wat:'Stevig. Slaat alles op de grond, dichtbij.',naam:'Ridder',vak:'Geschiedenis',kort:'GS',k:3,t:'unit',n:1,hp:1450,dmg:165,hit:1.2,bereik:.9,v:1,doel:'grond',r:.45,zeld:0,
    feit:'Ridders vochten te paard voor hun leenheer. In ruil kregen ze land: het leenstelsel uit tijdvak 3.'},
  boog:{wat:'Twee schutters. Raken grond en lucht op afstand.',naam:'Boogschutters',vak:'Geschiedenis',kort:'GS',k:3,t:'unit',n:2,hp:300,dmg:92,hit:1,bereik:5,v:1,doel:'alles',r:.35,zeld:0,
    feit:'Met de Engelse handboog won een klein leger bij Azincourt (1415) van zwaar bewapende Franse ridders.'},
  reus:{wat:'Heel veel levens. Loopt alleen op gebouwen af.',naam:'Rotsreus',vak:'Aardrijkskunde',kort:'AK',k:5,t:'unit',n:1,hp:3300,dmg:215,hit:1.5,bereik:1.2,v:.72,doel:'gebouw',r:.8,zeld:1,
    feit:'Stollingsgesteente ontstaat als magma afkoelt. Graniet koelt diep en langzaam af, basalt snel aan het oppervlak.'},
  thermiet:{wat:'Vuurbal op een plek. Veel schade in een cirkel.',naam:'Thermiet',vak:'Scheikunde',kort:'SK',k:4,t:'spreuk',straal:2.5,dmg:580,toren:.35,zeld:1,
    feit:'Thermiet is aluminium met ijzeroxide. Aluminium is onedeler dan ijzer en neemt de zuurstof over: een sterk exotherme redoxreactie.'},
  pijlen:{wat:'Pijlenregen. Ruimt groepjes kleine eenheden op.',naam:'Pijlenregen',vak:'Geschiedenis',kort:'GS',k:3,t:'spreuk',straal:3.4,dmg:250,toren:.3,zeld:0,
    feit:'Een salvo pijlen is een baan onder invloed van de zwaartekracht: horizontaal gelijkmatig, verticaal versneld.'},
  elektron:{wat:'Vier snelle, zwakke eenheden. Goedkoop.',naam:'Elektronen',vak:'Natuurkunde',kort:'NA',k:1,t:'unit',n:4,hp:78,dmg:70,hit:1,bereik:.6,v:1.5,doel:'grond',r:.28,zeld:0,
    feit:'Een elektron heeft een lading van −1,6 · 10⁻¹⁹ C. Stroom is het aantal coulomb dat per seconde langskomt.'},
  robot:{wat:'Snel en slaat heel hard, maar valt maar één doel tegelijk aan.',naam:'Robot',vak:'Informatica',kort:'IN',k:4,t:'unit',n:1,hp:1250,dmg:610,hit:1.8,bereik:.9,v:1.5,doel:'grond',r:.5,zeld:1,
    feit:'Een algoritme is een eindig stappenplan. Deze robot kent er één: dichtstbijzijnde doel, slaan, herhalen.'},
  tesla:{wat:'Gebouw. Schiet bliksem op grond en lucht.',naam:'Teslaspoel',vak:'Natuurkunde',kort:'NA',k:4,t:'bouw',hp:1000,dmg:190,hit:1.1,bereik:5.5,leeft:35,doel:'alles',r:.9,zeld:1,
    feit:'Een teslaspoel is een transformator zonder ijzerkern die heel hoge spanning maakt. De vonk is lucht die geleidt.'},
  ptero:{wat:'Vliegt. Spuwt vuur op een groepje.',naam:'Pterosaurus',vak:'Biologie',kort:'BI',k:4,t:'unit',n:1,hp:1050,dmg:140,hit:1.5,bereik:3.5,v:1.5,doel:'alles',vlieg:true,splash:1.1,r:.6,zeld:2,
    feit:'Pterosauriërs waren vliegende reptielen, geen dinosauriërs. Hun vleugel was een huid gespannen aan één lange vinger.'},
  onderzoeker:{wat:'Gooit flesjes op grond en lucht, van ver.',naam:'Onderzoeker',vak:'Biologie',kort:'BI',k:4,t:'unit',n:1,hp:720,dmg:225,hit:1.1,bereik:6,v:1,doel:'alles',r:.42,zeld:1,
    feit:'Een goed experiment verandert één variabele tegelijk. De rest houd je constant, anders weet je niet wat het effect veroorzaakt.'},
  ram:{wat:'Snel. Rijdt alleen op gebouwen af.',naam:'Stormram',vak:'Geschiedenis',kort:'GS',k:4,t:'unit',n:1,hp:1500,dmg:280,hit:1.6,bereik:.9,v:1.5,doel:'gebouw',r:.7,zeld:1,
    feit:'Stormrammen waren er al bij de Assyriërs. Tegen de middeleeuwse stenen burcht hielp pas het buskruitkanon echt.'},
  kanon:{wat:'Gebouw. Werpt stenen in een parabool, alleen op de grond.',naam:'Paraboolkanon',vak:'Wiskunde',kort:'WI',k:3,t:'bouw',hp:820,dmg:185,hit:.9,bereik:5.5,leeft:30,doel:'grond',r:.8,zeld:0,
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

// ── 3D-modellen ─────────────────────────────────────────────────────────
// Mensen, torens, belegeringswapens en natuur komen uit assets3d/clash.glb
// (Kenney, CC0; robot: Tomás Laulhé, CC0). Elke bron is een scene met een naam.
// Rotsreus, pterosaurus en elektronen zijn met de hand gebouwd (gloed via bloom).
let SU=null;const CL_GLB={gltf:null,laden:null};
function clAsset(naam){return CL_GLB.gltf&&CL_GLB.gltf.scenes.find(x=>x.name===naam);}
function clClip(naam){return CL_GLB.gltf.animations.find(a=>a.name===naam);}
// Rood team: blauwe en paarse tinten in de kleurkaart draaien naar rood.
const _clRood=new Map();
function clRodeTex(t){
  if(_clRood.has(t.uuid))return _clRood.get(t.uuid);
  const img=t.image;const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d');g.drawImage(img,0,0);
  const d=g.getImageData(0,0,c.width,c.height),p=d.data;
  for(let i=0;i<p.length;i+=4){const r=p[i]/255,gg=p[i+1]/255,b=p[i+2]/255;const mx=Math.max(r,gg,b),mn=Math.min(r,gg,b),l=(mx+mn)/2,dd=mx-mn;if(dd<.08)continue;
    const sat=dd/(1-Math.abs(2*l-1));let h=mx===r?((gg-b)/dd)%6:mx===gg?(b-r)/dd+2:(r-gg)/dd+4;h*=60;if(h<0)h+=360;
    if(h<195||h>295||sat<.2)continue;const nh=((350+(h-235)*.25)+360)%360;
    const C=(1-Math.abs(2*l-1))*sat,X=C*(1-Math.abs((nh/60)%2-1)),m=l-C/2;let [R,G,B]=nh<60?[C,X,0]:nh<120?[X,C,0]:nh<180?[0,C,X]:nh<240?[0,X,C]:nh<300?[X,0,C]:[C,0,X];
    p[i]=(R+m)*255;p[i+1]=(G+m)*255;p[i+2]=(B+m)*255;}
  g.putImageData(d,0,0);const n=t.clone();n.source=new T.Source(c);n.needsUpdate=true;_clRood.set(t.uuid,n);return n;
}
function clTeamMat(m,team){if(team!==1||!m.map)return m;const k='rood'+m.uuid;return clMat(k,()=>{const n=m.clone();n.map=clRodeTex(m.map);return n;});}
function clKloon(naam,team,eigenMat){
  const src=clAsset(naam);if(!src)return new T.Group();const c=SU.clone(src);
  if(naam.startsWith('mens-'))c.traverse(o=>{o.name=o.name.replace(/_\d+$/,'');});
  const mats=[];
  c.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;o.frustumCulled=!o.isSkinnedMesh;
    let m=clTeamMat(o.material,team);if(/leafsGreen/.test(m.name))m=clStd('bladG',{color:0x5aa845,roughness:.85,flatShading:true});else if(/leafsDark/.test(m.name))m=clStd('bladD',{color:0x3a7a3c,roughness:.85,flatShading:true});
    if(eigenMat){m=m.clone();mats.push(m);}o.material=m;});
  c.userData.mats=mats;return c;
}
function clBone(root,n){let r=null;root.traverse(o=>{if(!r&&o.name===n)r=o;});return r;}
// Mensen: één rig, animaties uit 'mens-ridder'. Uitrusting hangt aan de botten.
const CL_MENS={ridder:{bron:'mens-ridder',s:3.4,uit:'ridder'},boog:{bron:'mens-boog',s:2.9,uit:'boog'},onderzoeker:{bron:'mens-onderzoeker',s:3.1,uit:'fles'},
  wacht:{bron:'mens-wacht',s:2.6,uit:'boog'},koning:{bron:'mens-koning',s:3.2,uit:'kroon'}};
function clMensModel(id,team){
  const cfg=CL_MENS[id];const g=new T.Group();const m=clKloon(cfg.bron,team,true);m.scale.setScalar(cfg.s);g.add(m);
  const armR=clBone(m,'arm-right'),armL=clBone(m,'arm-left'),hoofd=clBone(m,'head'),romp=clBone(m,'torso');
  const doek=clMat('doek'+team);
  if(romp){const cape=new T.Mesh(clGeo('cape',()=>{const q=new T.PlaneGeometry(.26,.26,2,3);q.translate(0,-.13,0);return q;}),doek);cape.position.set(0,.16,-.075);cape.rotation.x=.18;cape.castShadow=true;romp.add(cape);}
  if(cfg.uit==='ridder'&&armR&&armL){
    const zw=new T.Group();const blad=clMesh(clBox(.028,.34,.012),clMat('staal'));blad.position.y=.19;zw.add(blad);const gd=clMesh(clBox(.1,.018,.03),clMat('goud'));zw.add(gd);
    zw.position.set(0,-.14,.02);zw.rotation.x=Math.PI/2;armR.add(zw);
    const sch=clMesh(clCyl(.12,.12,.022,18),clMat('team'+team));sch.rotation.z=Math.PI/2;sch.position.set(.05,-.08,.02);armL.add(sch);
    const bs=clMesh(clCyl(.035,.035,.03,10),clMat('goud'));bs.rotation.z=Math.PI/2;bs.position.set(.065,-.08,.02);armL.add(bs);
    if(hoofd){const h=clMesh(clGeo('helm2',()=>new T.SphereGeometry(.17,16,8,0,Math.PI*2,0,Math.PI*.5)),clMat('staal'));h.position.set(0,.16,.01);h.scale.set(1.05,.9,1.05);hoofd.add(h);
      const pl=clMesh(clKegel(.035,.16,8),clMat('team'+team));pl.position.set(0,.33,-.02);pl.rotation.x=-.4;hoofd.add(pl);}
  }
  if(cfg.uit==='boog'&&armL){const b=clMesh(clGeo('boog2',()=>new T.TorusGeometry(.16,.012,6,18,Math.PI)),clMat('houtD'));b.position.set(0,-.15,.06);b.rotation.set(0,Math.PI/2,Math.PI/2);armL.add(b);
    if(romp){const k=clMesh(clCyl(.035,.03,.2,8),clMat('leer'));k.position.set(.06,.12,-.09);k.rotation.z=.4;romp.add(k);}}
  if(cfg.uit==='fles'&&armR){const f=clMesh(clBol(.055,12),clMat('glas'),false);f.position.set(0,-.17,.03);armR.add(f);const v=clMesh(clBol(.042,10),clMat('vloeistof'),false);v.position.set(0,-.175,.03);armR.add(v);}
  if(cfg.uit==='kroon'&&hoofd){const k=clMesh(clCyl(.1,.09,.06,10),clMat('goud'));k.position.set(0,.33,0);hoofd.add(k);
    for(let i=0;i<6;i++){const p=clMesh(clKegel(.022,.06,5),clMat('goud'));const a=i/6*Math.PI*2;p.position.set(Math.sin(a)*.09,.38,Math.cos(a)*.09);hoofd.add(p);}}
  const mixer=new T.AnimationMixer(m);const a=n=>mixer.clipAction(clClip('mens-ridder|'+n));
  const ranged=id==='boog'||id==='wacht'||id==='onderzoeker';
  const acties={idle:a('idle'),loop:a(CL_KAARTEN[id]&&CL_KAARTEN[id].v>=1.4?'sprint':'walk'),aanval:a(id==='onderzoeker'?'holding-right-shoot':ranged?'holding-both-shoot':'attack-melee-right'),dood:a('die'),juich:a('emote-yes')};
  return clRig({g,inner:m,mixer,acties,mats:m.userData.mats});
}
function clRobotModel(team){
  const g=new T.Group();const m=clKloon('robot',team,true);m.scale.setScalar(.64);g.add(m);
  for(const mat of m.userData.mats)if(mat.name==='Main'){mat.color.set(team?0xe0483e:0x3f86e8);}
  const mixer=new T.AnimationMixer(m);const a=n=>mixer.clipAction(clClip('robot|'+n));
  return clRig({g,inner:m,mixer,acties:{idle:a('Idle'),loop:a('Running'),aanval:a('Punch'),dood:a('Death')},mats:m.userData.mats});
}
function clRig(o){
  o.soort='rig';o.nu=null;
  for(const k of ['aanval','dood','juich']){const x=o.acties[k];if(x){x.setLoop(T.LoopOnce,1);x.clampWhenFinished=true;}}
  o.speel=(naam,kracht)=>{const x=o.acties[naam];if(!x)return;const oud=o.acties[o.nu];
    if(o.nu===naam&&!kracht)return;x.reset();x.enabled=true;x.setEffectiveWeight(1);x.play();if(oud&&oud!==x)x.crossFadeFrom(oud,.15,false);o.nu=naam;};
  o.speel('idle');o.mixer.update(Math.random()*.8);
  return o;
}
function clModel(id,team){
  const t=team;
  if(CL_MENS[id])return clMensModel(id,t);
  if(id==='robot')return clRobotModel(t);
  if(id==='ram'){const g=new T.Group();const m=clKloon('ram',t);m.scale.setScalar(1.55);m.rotation.y=-Math.PI/2;g.add(m);
    const wielen=[];m.traverse(o=>{if(o.name==='wheel')wielen.push(o);});
    const w=clKloon('wimpel',t);w.scale.setScalar(1.3);w.position.set(0,1.2,-.4);g.add(w);return {g,wielen,soort:'ram'};}
  if(id==='kanon'){const g=new T.Group();const draai=new T.Group();g.add(draai);const m=clKloon('katapult',t);m.scale.setScalar(1.55);m.rotation.y=-Math.PI/2;draai.add(m);
    let arm=null;m.traverse(o=>{if(o.name==='catapult')arm=o;});return {g,draai,arm,soort:'bouw'};}
  if(id==='tesla'){const g=new T.Group();const m=clKloon('kristaltoren',t);m.scale.setScalar(2.2);g.add(m);
    const kl=CL_TEAM[t].l;m.traverse(o=>{if(o.isMesh&&/crystal/.test(o.name||o.parent&&o.parent.name||'')){o.material=clStd('kristal'+t,{color:t?0xff7a6e:0x5aa9ff,emissive:t?0xff5a4e:0x3d8bff,emissiveIntensity:2.2,roughness:.25,metalness:.1});}});
    const gl=new T.Sprite(new T.SpriteMaterial({map:clGlow(),color:kl,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.5}));gl.scale.set(1.8,1.8,1);gl.position.y=1.9;g.add(gl);
    return {g,gl,soort:'bouw'};}
  if(id==='reus'){
    const g=new T.Group();const rots=clMat('rots');const ico=r=>clGeo('ico'+r,()=>new T.IcosahedronGeometry(r,0));
    const romp=clMesh(ico(.78),rots);romp.position.y=1.55;romp.scale.set(1.1,1.15,.9);g.add(romp);
    for(let i=0;i<7;i++){const s=clMesh(clBol(.06,6),clMat('magma'),false);const a=i*1.3;s.position.set(Math.sin(a)*.5,1.15+i*.14,.62+Math.cos(a)*.1);g.add(s);}
    const sjerp=clMesh(clGeo('sjerp',()=>new T.TorusGeometry(.72,.09,6,18)),clMat('team'+t));sjerp.position.y=1.5;sjerp.rotation.set(1.2,0,.5);g.add(sjerp);
    const hoofd=new T.Group();hoofd.position.y=2.45;g.add(hoofd);hoofd.add(clMesh(ico(.36),clMat('rotsD')));
    for(const x of [-.12,.12]){const e=clMesh(clBol(.055,6),clMat('magma'),false);e.position.set(x,.02,.3);hoofd.add(e);}
    const arm=x=>{const p=new T.Group();p.position.set(x,2.05,0);const a=clMesh(ico(.3),rots);a.position.y=-.35;p.add(a);const f=clMesh(ico(.34),clMat('rotsD'));f.position.y=-.95;p.add(f);g.add(p);return p;};
    const al=arm(-.95),ar=arm(.95);
    const been=x=>{const p=new T.Group();p.position.set(x,.8,0);const b=clMesh(ico(.34),clMat('rotsD'));b.position.y=-.4;b.scale.y=1.3;p.add(b);g.add(p);return p;};
    return {g,bl:been(-.38),br:been(.38),al,ar,hoofd,romp,soort:'mens',zwaar:true};
  }
  if(id==='elektron'){
    const g=new T.Group();const kern=new T.Group();kern.position.y=.6;g.add(kern);
    kern.add(clMesh(clBol(.19,16),clStd('elekKern'+t,{color:CL_TEAM[t].l,emissive:CL_TEAM[t].l,emissiveIntensity:3.2,roughness:.2}),false));
    const ring=(rx,ry)=>{const r=clMesh(clGeo('eRing',()=>new T.TorusGeometry(.34,.016,6,32)),clStd('elekRing'+t,{color:0xffffff,emissive:CL_TEAM[t].l,emissiveIntensity:1.4}),false);r.rotation.set(rx,ry,0);kern.add(r);return r;};
    const r1=ring(1.2,0),r2=ring(-.4,.9);
    const s=new T.Sprite(new T.SpriteMaterial({map:clGlow(),color:CL_TEAM[t].l,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.85}));s.scale.set(1.2,1.2,1);kern.add(s);
    return {g,kern,r1,r2,soort:'elektron'};
  }
  if(id==='ptero'){
    const g=new T.Group();const lijf=new T.Group();lijf.position.y=2.4;g.add(lijf);
    const romp=clMesh(clCap(.2,.55),clMat('huidPtero'));romp.rotation.x=Math.PI/2;lijf.add(romp);
    const buik=clMesh(clCap(.16,.4),clStd('buikPtero',{color:0xd9c3a0,roughness:.8}));buik.rotation.x=Math.PI/2;buik.position.y=-.06;lijf.add(buik);
    const kop=clMesh(clKegel(.13,.75,8),clMat('huidPtero'));kop.rotation.x=Math.PI/2;kop.position.set(0,.12,.64);lijf.add(kop);
    const kam=clMesh(clKegel(.08,.5,4),clMat('team'+t));kam.rotation.x=-2.3;kam.position.set(0,.3,.32);lijf.add(kam);
    for(const x of [-.07,.07]){const e=clMesh(clBol(.035,6),clStd('ptOog',{color:0xfff1a8,emissive:0xffc400,emissiveIntensity:2.2}),false);e.position.set(x,.2,.46);lijf.add(e);}
    const vleugel=z=>{const p=new T.Group();const geo=clGeo('vleugel2',()=>{const b=new T.BufferGeometry();b.setAttribute('position',new T.Float32BufferAttribute([0,0,.35, 0,0,-.35, 1.7,0,-.2, 1.7,0,-.2, 0,0,.35, 1.2,0,.28, 1.2,0,.28, 1.7,0,-.2, 1.95,-.05,.1],3));b.computeVertexNormals();return b;});
      const m=clMesh(geo,clMat('vlies'+t));m.scale.x=z;p.add(m);lijf.add(p);return p;};
    const staart=clMesh(clKegel(.06,.8,6),clMat('huidPtero'));staart.rotation.x=-Math.PI/2;staart.position.z=-.65;lijf.add(staart);
    return {g,lijf,vl:vleugel(-1),vr:vleugel(1),soort:'vlieg'};
  }
  return clMensModel('ridder',t);
}

// Vlaggetje dat wappert (eigen geometrie, zodat we de hoekpunten kunnen buigen).
function clVlag(team,w,h){
  const geo=new T.PlaneGeometry(w,h,8,3);geo.translate(w/2,0,0);
  const m=new T.Mesh(geo,clMat('doek'+team));m.castShadow=true;m.userData.basis=geo.attributes.position.array.slice();
  CL.vlaggen.push(m);return m;
}
function clTorenModel(soort,team){
  const g=new T.Group();
  if(soort==='prinses'){
    const S=2.75;const voet=clKloon('prinses-voet',team);voet.scale.setScalar(S);g.add(voet);
    const top=clKloon('prinses-top',team);top.scale.setScalar(S);top.position.y=1.31*S;g.add(top);
    const ring=clMesh(clCyl(1.25,1.25,.08,6),clMat('hout'));ring.position.y=1.31*S+.04;ring.rotation.y=Math.PI/6;g.add(ring);
    const wacht=clModel('wacht',team);wacht.g.position.y=1.31*S+.08;g.add(wacht.g);
    const vlag=clKloon('vlag',team);vlag.scale.setScalar(1.25);vlag.position.set(-1.05,1.31*S,-.5);g.add(vlag);
    const bol=clMesh(clBol(.12,10),clMat('goud'));bol.position.set(-1.05,1.31*S+2.75,-.5);g.add(bol);
    return {g,schutter:wacht,top:1.31*S+.2,ruinH:1.31*S};
  }
  const S=3.7;const voet=clKloon('koning-voet',team);voet.scale.setScalar(S);g.add(voet);
  const top=clKloon('koning-top',team);top.scale.setScalar(S);top.position.y=1.01*S;g.add(top);
  const vloer=clMesh(clBox(3.1,.1,3.1),clMat('hout'));vloer.position.y=1.01*S+.05;g.add(vloer);
  const kon=clModel('koning',team);kon.g.position.set(0,1.01*S+.1,.3);g.add(kon.g);
  const kanon=clKloon('kanon',team);kanon.scale.setScalar(1.6);kanon.position.set(1,1.01*S+.1,.5);g.add(kanon);
  for(const x of [-1.5,1.5]){const v=clKloon('vlag',team);v.scale.setScalar(1.4);v.position.set(x,1.01*S+.2,-1.5);g.add(v);}
  return {g,schutter:kon,top:1.01*S+.3,kanon,ruinH:1.01*S};
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
  // Omgeving via instancing: per model één draw call, hoe vaak het ook voorkomt.
  const plaats={},Y=new T.Vector3(0,1,0);
  const zetM=(naam,x,z,sx,sy,sz,ry)=>{(plaats[naam]=plaats[naam]||[]).push(new T.Matrix4().compose(new T.Vector3(x,0,z),new T.Quaternion().setFromAxisAngle(Y,ry),new T.Vector3(sx,sy,sz)));};
  const R=clRnd(arenaIdx*13+5);
  const zet=(naam,x,z,sch,ry)=>zetM(naam,x,z,sch,sch,sch,ry==null?R()*6.28:ry);
  // Kasteelmuur rondom (Kenney castle kit), laag gehouden zodat hij niets afdekt.
  for(const sx of [-9.45,9.45])for(let z=-15.9;z<=15.9;z+=1){if(Math.abs(z)<1.3)continue;zetM('muur',sx,z,1.02,.42,.5,Math.PI/2);}
  for(const sz of [-16.45,16.45])for(let x=-8.9;x<=8.9;x+=1)zetM('muur',x,sz,1.02,.42,.5,0);
  const BOMEN=['boom-eik','boom-rond','boom-dik','den-rond','den-hoog','boom-eik'];
  for(let i=0;i<64;i++){const kant=R()<.5?-1:1;const x=kant*(10.8+R()*10),z=-26+R()*52;if(Math.abs(z)<1.8)continue;zet(BOMEN[i%BOMEN.length],x,z,2.1+R()*1.3);}
  for(let i=0;i<22;i++){const z=R()<.5?-17.8-R()*6:17.8+R()*3;zet(BOMEN[(i+2)%BOMEN.length],-13+R()*26,z,2+R()*1.2);}
  for(let i=0;i<40;i++){const kant=R()<.5?-1:1;zet(['struik','struikje','gras','steen','paddenstoel','bloem-rood','bloem-geel','bloem-paars','boomstam'][i%9],kant*(10+R()*8),-22+R()*44,1.6+R()*1.2);}
  for(const [x,z,n] of [[-11,2.6,'rotsen'],[11.5,-2.8,'rotsjes'],[-12.5,-2.4,'steen-hoog'],[12.4,2.3,'rotsen'],[-10.2,-2.2,'rotsjes']])zet(n,x,z,1.5+R()*.6);
  // Binnen de muur: graspollen en bloemen langs de randen, weg van paden en torens.
  for(let i=0;i<46;i++){const x=R()<.5?.35+R()*1.1:16.55+R()*1.1,z=.6+R()*30.8;if(Math.abs(z-16)<1.6)continue;if(Math.abs(z-6.5)<2||Math.abs(z-25.5)<2)continue;
    zet(['grasje','gras','bloem-geel','bloem-rood','bloem-paars','grasje'][i%6],x-9,16-z,1.3+R()*.8);}
  const KLEIN=new Set(['gras','grasje','bloem-rood','bloem-geel','bloem-paars','struikje','paddenstoel','steen','boomstam']);
  const tmp=new T.Matrix4();
  for(const [naam,lijst] of Object.entries(plaats)){const src=clAsset(naam);if(!src)continue;src.updateMatrixWorld(true);
    src.traverse(o=>{if(!o.isMesh)return;let m=o.material;if(/leafsGreen/.test(m.name))m=clStd('bladG',{color:0x5aa845,roughness:.85,flatShading:true});else if(/leafsDark/.test(m.name))m=clStd('bladD',{color:0x3a7a3c,roughness:.85,flatShading:true});
      const im=new T.InstancedMesh(o.geometry,m,lijst.length);lijst.forEach((M,i)=>im.setMatrixAt(i,tmp.multiplyMatrices(M,o.matrixWorld)));
      im.instanceMatrix.needsUpdate=true;im.computeBoundingSphere();im.castShadow=!KLEIN.has(naam);im.receiveShadow=true;sc.add(im);});}
  // Alles hierboven staat stil: matrices één keer berekenen, kleine dingen geen schaduw.
  sc.updateMatrixWorld(true);sc.traverse(o=>{if(o!==sc&&!o.isLight){o.matrixAutoUpdate=false;}});
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
  if(e.soort!=='toren'){ // teamring onder de voeten: blauw of rood, zodat je altijd ziet van wie iets is
    const r=Math.max(.42,(e.r||.4)*1.05);const ring=new T.Mesh(clGeo('tring'+r.toFixed(2),()=>new T.RingGeometry(r*.78,r,36)),clMat('ringmat'+e.team,()=>new T.MeshBasicMaterial({color:CL_TEAM[e.team].c,transparent:true,opacity:.75,depthWrite:false,side:T.DoubleSide})));
    ring.rotation.x=-Math.PI/2;ring.position.y=.04;e.m.g.add(ring);e.m.ring=ring;}
  CL.ents.push(e);CL.scene.add(e.m.g);clHpBar(e);clPlaats(e);return e;}
function clPlaats(e){e.m.g.position.set(e.x-9,e.y||0,16-e.z);}
function clMaakToren(sub,team,x,z){
  const d=CL_TOREN[sub];const m=clTorenModel(sub,team);
  m.g.rotation.y=team?0:Math.PI;
  return clNieuw({soort:'toren',sub,team,x,z,hp:d.hp,max:d.hp,r:d.r,bereik:d.bereik,dmg:d.dmg,hit:d.hit,doel:'alles',m,actief:sub==='prinses',hoogte:sub==='koning'?6.6:5.6,cd:1});
}
const CL_FORM={1:[[0,0]],2:[[-.45,0],[.45,0]],3:[[0,.4],[-.45,-.3],[.45,-.3]],4:[[-.4,.4],[.4,.4],[-.4,-.4],[.4,-.4]]};
function clInzet(id,team,x,z,sterk){
  const d=CL_KAARTEN[id];const f=sterk?1.25:1;
  if(d.t==='spreuk'){clSpreuk(id,team,x,z,f);return;}
  const n=d.n||1;const F=CL_FORM[n]||CL_FORM[1];
  F.forEach(([ox,oz],i)=>{
    const m=clModel(id,team);if(sterk)clGoudRand(m);if(m.soort!=='rig'&&d.t==='unit')m.g.scale.multiplyScalar(1.3);m.schaal0=m.g.scale.x;
    const e=clNieuw({soort:d.t==='bouw'?'bouw':'unit',kaart:id,team,x:x+ox,z:z+(team?-oz:oz),y:0,hp:d.hp*f,max:d.hp*f,r:d.r,lucht:!!d.vlieg,bereik:d.bereik,dmg:d.dmg*f,hit:d.hit,
      v:d.v,doel:d.doel,splash:d.splash,leeft:d.leeft,m,drop:.45+i*.06,cd:d.t==='bouw'?.8:.6,sterk:!!sterk,hoogte:{reus:3.4,ptero:3.4,tesla:2.9,ram:2.3,elektron:1.3,kanon:2.4,robot:3.3,ridder:2.8,boog:2.4,onderzoeker:2.6}[id]||2.4});
    e.m.g.scale.multiplyScalar(.01);
  });
  clStof(x,z,d.t==='bouw'?1.6:1.1);clLichtzuil(x,z,team);arcSnd('pop');
}
// Bij inzetten: een korte lichtzuil in de teamkleur.
function clLichtzuil(x,z,team){
  const m=new T.Mesh(clGeo('zuil',()=>new T.CylinderGeometry(.9,.9,6,24,1,true)),new T.MeshBasicMaterial({color:CL_TEAM[team].l,transparent:true,opacity:.5,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide}));
  m.position.set(x-9,3,16-z);CL.scene.add(m);
  CL.fx.push({t:0,dur:.55,upd:p=>{m.scale.set(1-p*.6,1,1-p*.6);m.material.opacity=.5*(1-p);if(p>=1){CL.scene.remove(m);m.material.dispose();}}});
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
  // Treffer zichtbaar maken: witte flits op het model en het schadegetal.
  const mats=o.m.mats||(o.m.inner&&o.m.inner.userData.mats);if(mats&&mats.length){for(const m of mats)if(m.emissive){m.emissive.setRGB(.9,.9,.9);}o.flits=.09;}
  if(dmg>=40&&(!o.laatstGetal||CL.t-o.laatstGetal>.22)){o.laatstGetal=CL.t;const pt=clScherm(o.x,(o.hoogte||2)+.2,o.z);clGetal(pt,Math.round(dmg),o.team);}
  if(o.soort==='toren'&&o.sub==='koning'&&!o.actief){o.actief=true;clKoningWakker(o);}
  if(o.hp<=0)clDood(o,bron);
}
function clGetal(pt,n,team){if(!CL.pops||CL.lite)return;const e=document.createElement('div');e.className='cl-getal t'+team;e.textContent=n;e.style.left=(pt[0]+(Math.random()-.5)*18)+'px';e.style.top=pt[1]+'px';CL.pops.appendChild(e);setTimeout(()=>e.remove(),800);}
function clKoningWakker(o){const m=clScherm(o.x,7,o.z);clPop(m,'De koning doet mee','kw');arcSnd('flip');try{o.m.schutter.speel&&o.m.schutter.speel('juich',true);}catch(e){}}
function clDood(o){
  o.dood=true;o.hp=0;
  if(o.soort==='toren'&&CL.klaar){clInstort(o);return;}
  if(o.soort==='toren'){
    const tegen=1-o.team;CL.kronen[tegen]+=o.sub==='koning'?3-CL.kronen[tegen]:1;CL.kronen[tegen]=Math.min(3,CL.kronen[tegen]);
    clInstort(o);clKroonVlieg(o,tegen);
    if(o.sub==='prinses'){const k=CL.ents.find(x=>x.team===o.team&&x.sub==='koning'&&!x.dood);if(k&&!k.actief){k.actief=true;clKoningWakker(k);}}
    if(o.sub==='koning'||CL.overtime)CL.eindeNa=1.4;
    CL.hudUpd=true;
  }else if(o.m.soort==='rig'&&o.m.acties.dood){
    // Sterfanimatie, daarna zakt het lichaam weg in de grond.
    for(const x of o.m.mats||[])if(x.emissive)x.emissive.setRGB(0,0,0);
    o.m.speel('dood',true);if(o.m.ring)o.m.ring.visible=false;CL.lijken.push({m:o.m,t:0});
  }else{clPoef(o.x,o.z,o.lucht?2.2:.6,o.soort==='bouw'?9:5);clVonk(o.x,o.lucht?2.2:.8,o.z,0xfff1c4,6);o.m.g.visible=false;CL.scene.remove(o.m.g);}
  if(o.bar){o.bar.remove();o.bar=null;}
  if(o.soort!=='toren')CL.ents=CL.ents.filter(x=>x!==o);
}
function clLijkenStap(dt){
  for(const l of CL.lijken.slice()){l.t+=dt;l.m.mixer.update(dt);if(l.t>1.1)l.m.g.position.y-=dt*1.1;
    if(l.t>2.1){CL.scene.remove(l.m.g);CL.lijken=CL.lijken.filter(x=>x!==l);clPoef((l.m.g.position.x+9),16-l.m.g.position.z,0,2,0xe8e2d4,.6);}}
}
// Toren stort in: brokstukken vliegen weg, de toren zakt in en laat een ruïne achter.
function clInstort(o){
  const g=o.m.g;arcFx('boom');arcHap([40,30,80]);clSchud(.6);
  for(let i=0;i<16;i++)setTimeout(()=>{if(CL.on)clPoef(o.x+(Math.random()-.5)*2.8,o.z+(Math.random()-.5)*2.8,Math.random()*3,3,0xd8cbb0,1.2);},i*50);
  // Brokstukken met zwaartekracht.
  const brokken=[];for(let i=0;i<(CL.lite?6:14);i++){const b=clKloon(i%3?'steen':'rotsjes',0);b.scale.setScalar(.8+Math.random()*1.2);b.position.set(o.x-9,2+Math.random()*2.5,16-o.z);CL.scene.add(b);
    const a=Math.random()*6.28,v=3+Math.random()*4;brokken.push({b,v:new T.Vector3(Math.cos(a)*v,5+Math.random()*5,Math.sin(a)*v),rv:new T.Vector3(Math.random()*8,Math.random()*8,Math.random()*8)});}
  CL.fx.push({t:0,dur:1.6,upd:p=>{const dt=1/60;for(const k of brokken){k.v.y-=22*dt;k.b.position.addScaledVector(k.v,dt);k.b.rotation.x+=k.rv.x*dt;k.b.rotation.z+=k.rv.z*dt;
      if(k.b.position.y<.1){k.b.position.y=.1;k.v.multiplyScalar(.4);k.v.y=Math.abs(k.v.y)*.3;}}
    if(p>=1)for(const k of brokken)CL.scene.remove(k.b);}});
  const H=o.m.ruinH||3;
  CL.fx.push({t:0,dur:1.1,upd:p=>{g.position.y=-p*p*H*.62;g.rotation.z=Math.sin(p*22)*.035*(1-p);
    if(p>=1){g.position.y=-H*.62;if(o.m.schutter)o.m.schutter.g.visible=false;if(o.m.kanon)o.m.kanon.visible=false;}}});
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
  if(e.m.soort==='rig')e.m.speel('aanval',true);
  if(e.soort==='toren'&&e.m.schutter&&e.m.schutter.speel)e.m.schutter.speel('aanval',true);
  if(e.m.arm){const a=e.m.arm;CL.fx.push({t:0,dur:.5,upd:p=>{a.rotation.x=Math.sin(p*Math.PI)*-.9;}});}
  if(e.soort==='toren'&&e.sub==='koning'&&e.m.kanon){const k=e.m.kanon;k.rotation.y=Math.atan2(o.x-e.x,-(o.z-e.z))-e.m.g.rotation.y;clPoef(e.x,e.z,e.m.top+.6,2,0xd6d3cf,.7);}
  const kind=e.soort==='toren'?(e.sub==='koning'?'kogel':'pijl'):({boog:'pijl',onderzoeker:'fles',ptero:'spuug',kanon:'parabool',tesla:'bliksem'})[e.kaart];
  if(kind==='bliksem'){clBliksem(e,o);clSchade(o,e.dmg,e);arcSnd('tick');return;}
  if(!kind){clSchade(o,e.dmg,e);if(Math.random()<.5)arcFx('hit');clVonk(o.x,(o.lucht?2.2:.9),o.z,0xffffff,5);if(e.kaart==='reus'||e.kaart==='ram'){clSchud(.12);}return;}
  const hoog=e.soort==='toren'?e.m.top+.9:e.lucht?2.3:1.2;
  const vuur=()=>{if(!CL.on||e.dood&&e.soort!=='toren')return;clProjectiel({kind,team:e.team,x:e.x,y:hoog,z:e.z,tgt:o,dmg:e.dmg,splash:e.splash,bron:e});};
  if(e.m.soort==='rig'||e.soort==='toren')setTimeout(vuur,160);else vuur();
}
function clProjMesh(kind,team){
  if(kind==='pijl'){const g=new T.Group();const m=clKloon('pijl',team);m.scale.setScalar(1.3);g.add(m);return g;}
  if(kind==='kogel'){const g=new T.Group();const m=clKloon('kogel',team);m.scale.setScalar(1.4);g.add(m);return g;}
  if(kind==='parabool'){const g=new T.Group();const m=clKloon('kei',team);m.scale.setScalar(1.6);g.add(m);return g;}
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
    else if(p.kind!=='fles')p.m.rotation.x+=dt*8;
    if((p.kind==='kogel'||p.kind==='parabool'||p.kind==='spuug')&&!CL.lite&&Math.random()<.5)clPoef(x,z,y,1,p.kind==='spuug'?0xffa050:0xe9e4da,.35);
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
  const t=CL.t,sdt=CL.klaar?dt*.25:dt;
  for(const e of CL.ents){const m=e.m,g=m.g;
    if(e.soort!=='toren'){
      let y=0,sc=1;
      if(e.drop>0){const p=Math.min(1,1-e.drop/.45);y=(1-p)*(1-p)*2.2;const c=1.70158;sc=Math.max(.05,1+(c+1)*Math.pow(p-1,3)+c*Math.pow(p-1,2));}
      g.position.set(e.x-9,y,16-e.z);
      const s0=m.schaal0||1;
      const squash=e.hitT>0?.92:1;g.scale.set(s0*sc*(2-squash),s0*sc*squash,s0*sc*(2-squash));
      if(e.kijk!=null&&e.soort==='unit')e.hoek=clHoekNaar(e.hoek,e.kijk,Math.min(1,dt*10));
      if(e.soort==='unit')g.rotation.y=e.hoek;
      if(m.goud){m.goud.material.opacity=.5+Math.sin(t*6)*.3;}
    }
    if(e.flits!=null){e.flits-=dt;if(e.flits<=0){const mats=m.mats||[];for(const x of mats)if(x.emissive)x.emissive.setRGB(0,0,0);e.flits=null;}}
    if(m.soort==='rig'){
      // Animatie volgt de toestand: lopen, aanvallen (eenmalig per slag) of stilstaan.
      const bezig=m.nu==='aanval'&&m.acties.aanval.isRunning();
      if(!bezig){const w=e.loopt?'loop':'idle';if(m.nu!==w)m.speel(w);}
      if(m.acties.loop)m.acties.loop.timeScale=Math.max(.8,(e.v||1)*1.1);
      m.mixer.update(sdt);
    }
    if(m.soort==='mens'){
      if(e.loopt){e.fase+=dt*(e.v||1)*8*CL.tempo;const a=Math.sin(e.fase)*.65;m.bl.rotation.x=a;m.br.rotation.x=-a;m.al.rotation.x=-a*.7;m.romp.position.y=(m.zwaar?1.55:.92)+Math.abs(Math.cos(e.fase))*.04;}
      else{m.bl.rotation.x*=.8;m.br.rotation.x*=.8;if(!e.aanval)m.al.rotation.x*=.85;}
      if(e.swing<.45){const s=e.swing;m.ar.rotation.x=s<.1?-2.5*s/.1:-2.5+Math.min(1,(s-.1)/.2)*3.1;if(m.zwaar)m.al.rotation.x=m.ar.rotation.x;}
      else{m.ar.rotation.x*=.85;if(!e.loopt)m.al.rotation.x*=.85;}
    }
    if(e.soort==='toren'&&m.schutter&&!e.dood){const sm=m.schutter;const doel=e.aanval&&clLevend(e.tgt)?Math.atan2(e.tgt.x-e.x,-(e.tgt.z-e.z))-g.rotation.y:0;
      sm.g.rotation.y=clHoekNaar(sm.g.rotation.y,doel,Math.min(1,dt*8));
      if(sm.mixer){const bezig=(sm.nu==='aanval'||sm.nu==='juich')&&sm.acties[sm.nu].isRunning();if(!bezig&&sm.nu!=='idle')sm.speel('idle');sm.mixer.update(sdt);}}
    if(m.soort==='elektron'){m.kern.position.y=.6+Math.sin(t*6+e.fase)*.1;m.r1.rotation.z+=dt*5;m.r2.rotation.y+=dt*4;}
    if(m.soort==='vlieg'){const f=Math.sin(t*9+e.fase)*.55;m.vl.rotation.z=-f;m.vr.rotation.z=f;m.lijf.position.y=2.4+Math.sin(t*9+e.fase+1)*.1;}
    if(m.soort==='ram'&&e.loopt){for(const w of m.wielen)w.rotation.x-=dt*e.v*3.5;}
    if(m.gl){m.gl.material.opacity+=(.45+Math.sin(t*3)*.08-m.gl.material.opacity)*Math.min(1,dt*6);}
    if(m.draai&&clLevend(e.tgt)&&e.aanval){m.draai.rotation.y=clHoekNaar(m.draai.rotation.y,Math.atan2(e.tgt.x-e.x,-(e.tgt.z-e.z)),Math.min(1,dt*8));}
    if(e.soort==='bouw'&&!m.draai&&e.kaart!=='tesla')g.rotation.y=e.hoek;
  }
  clLijkenStap(sdt);
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
  b.antw-=dt;if(b.antw<=0){b.antw=(2.6+Math.random()*1.8)*ar.denk;if(Math.random()<ar.acc){CL.kennis[1]=Math.min(10,CL.kennis[1]+1);b.goed++;}b.vragen++;}
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
    else{const m=clModel(id,0);g=m.g;if(m.soort==='rig'){m.speel('idle');m.mixer.setTime(.4);}if(m.soort==='vlieg'){m.vl.rotation.z=-.35;m.vr.rotation.z=.35;}}
    g.rotation.y=id==='ram'?-.9:id==='kanon'?-.7:-.45;sc.add(g);
    g.updateMatrixWorld(true);const box=new T.Box3();g.traverse(o=>{if(o.isMesh&&!o.isSkinnedMesh){o.geometry.computeBoundingBox&&!o.geometry.boundingBox&&o.geometry.computeBoundingBox();box.union(new T.Box3().copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld));}});
    if(CL_MENS[id]||id==='robot'){const h=id==='robot'?3.1:.72*CL_MENS[id].s;box.set(new T.Vector3(-h*.42,0,-h*.3),new T.Vector3(h*.42,h,h*.3));}
    const c=box.getCenter(new T.Vector3()),sz=box.getSize(new T.Vector3());
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
// Gloed (bloom) op alles wat licht geeft: elektronen, magma, kristallen, vuur, bliksem.
function clComposer(){
  CL.comp=null;if(CL.lite||!CL.pp)return;
  try{const {EffectComposer,RenderPass,UnrealBloomPass,OutputPass}=CL.pp;
    const c=new EffectComposer(CL.r);c.addPass(new RenderPass(CL.scene,CL.cam));
    const b=new UnrealBloomPass(new T.Vector2(Math.max(1,CL.vw/2),Math.max(1,CL.vh/2)),.5,.4,1.6);c.addPass(b);c.addPass(new OutputPass());
    c.setPixelRatio(CL.r.getPixelRatio());c.setSize(CL.vw,CL.vh);CL.comp=c;CL.compScene=CL.scene;}catch(e){CL.comp=null;}
}
function clResize(){const h=CL.host;if(!h||!CL.r)return;CL.vw=Math.max(1,h.clientWidth);CL.vh=Math.max(1,h.clientHeight);CL.r.setSize(CL.vw,CL.vh,false);CL.r.domElement.style.width=CL.vw+'px';CL.r.domElement.style.height=CL.vh+'px';CL.cam.aspect=CL.vw/CL.vh;CL.cam.updateProjectionMatrix();if(CL.comp)CL.comp.setSize(CL.vw,CL.vh);if(CL.mode!=='lobby')clFit();}
function clLus(nu){
  if(!CL.on)return;CL.raf=requestAnimationFrame(clLus);
  if(document.hidden){CL.vorige=nu;return;}
  const dt=Math.min(.05,Math.max(0,(nu-(CL.vorige||nu))/1000));CL.vorige=nu;
  if(CL.mode==='strijd'&&!CL.pauze){
    if(!CL.klaar&&!CL.tut){
      CL.tijd-=dt;const dubbel=CL.tijd<=60||CL.overtime;
      if(dubbel&&!CL.dubbelGemeld){CL.dubbelGemeld=true;clBanner(CL.overtime?'Verlenging':'Dubbele kennis',CL.overtime?'De eerste toren die valt, beslist':'Je kennis loopt twee keer zo snel op');}
      const regen=dt/(dubbel?1.6:3.2);for(const t of [0,1])CL.kennis[t]=Math.min(10,CL.kennis[t]+regen);
      clBot(dt);
    }
    const sdt=CL.klaar?dt*.25:dt;CL.t+=sdt;
    for(const e of CL.ents.slice())clEntStap(e,sdt);clScheid();clProjStap(sdt);
    if(!CL.klaar){
      if(CL.tijd<=0&&!CL.tut)clTijdOp();
      if(CL.eindeNa!=null){CL.eindeNa-=dt;if(CL.eindeNa<=0){CL.eindeNa=null;clEinde();}}
      clDockTik();
    }
  }else CL.t+=dt;
  clFxStap(dt);clAnim(dt);
  if(CL.mode==='lobby'){const a=CL.t*.05+.5;CL.cam.position.set(Math.sin(a)*36,22,Math.cos(a)*36);CL.cam.lookAt(0,-3,0);if(CL.scene.fog){CL.scene.fog.near=40;CL.scene.fog.far=95;}}
  else if(CL.camBasis){const s=CL.schud||0;CL.schud=Math.max(0,s-dt*1.6);CL.cam.position.copy(CL.camBasis);if(s>0)CL.cam.position.add(new T.Vector3((Math.random()-.5)*s,(Math.random()-.5)*s*.6,(Math.random()-.5)*s));}
  if(CL.comp){if(CL.compScene!==CL.scene){CL.comp.passes[0].scene=CL.scene;CL.compScene=CL.scene;}CL.comp.render();}else CL.r.render(CL.scene,CL.cam);
  if(CL.mode!=='lobby')clBalken();
}
function clStop(){
  CL.on=false;cancelAnimationFrame(CL.raf);clCoachWeg();CL.tut=null;
  try{CL.ro&&CL.ro.disconnect();}catch(e){}
  if(CL._key){document.removeEventListener('keydown',CL._key);CL._key=null;}
  if(CL._mv){document.removeEventListener('pointermove',CL._mv);document.removeEventListener('pointerup',CL._up);CL._mv=CL._up=null;}
  try{CL.comp&&CL.comp.dispose();}catch(e){}CL.comp=null;
  try{CL.r&&CL.r.dispose();CL.r&&CL.r.forceContextLoss();}catch(e){}
  CL.r=null;CL.scene=null;CL.lijken=[];CL.route=null;CL.routeDoel=null;CL.scenes={};CL.ghost=null;CL.zone=null;CL.bars=null;CL.pops=null;CL.ents=[];CL.fx=[];CL.proj=[];CL.mode='lobby';
  for(const k in _clM){const m=_clM[k];try{m.dispose&&m.dispose();}catch(e){}delete _clM[k];}
  for(const k in _clG){try{_clG[k].dispose();}catch(e){}delete _clG[k];}
}

// ── Openen en lobby ─────────────────────────────────────────────────────
function openClash(direct){
  ARC.game='clash';
  arcStage('clash',`<div class="cl-root" id="cl-root"><div class="cl-veld" id="cl-veld"><div class="cl-laden"><div class="cl-laden-t">Arena bouwen</div><div class="cl-laden-bar"><i id="cl-laadbar"></i></div><small id="cl-laadtxt">Modellen laden…</small></div></div></div>`);
  ARC.onClose=()=>clStop();
  const bar=p=>{const b=document.getElementById('cl-laadbar');if(b)b.style.width=Math.round(p*100)+'%';};
  const lite=arcLite()||(navigator.hardwareConcurrency||8)<=3;
  const mods=[T?Promise.resolve(T):import('/vendor/three.module.min.js'),SU?Promise.resolve(SU):import('/vendor/jsm/utils/SkeletonUtils.js'),import('/vendor/jsm/loaders/GLTFLoader.js')];
  if(!lite)mods.push(Promise.all([import('/vendor/jsm/postprocessing/EffectComposer.js'),import('/vendor/jsm/postprocessing/RenderPass.js'),import('/vendor/jsm/postprocessing/UnrealBloomPass.js'),import('/vendor/jsm/postprocessing/OutputPass.js')]).catch(()=>null));
  Promise.all(mods).then(([t,su,gl,pp])=>{T=t;SU=su;
    if(pp)CL.pp={EffectComposer:pp[0].EffectComposer,RenderPass:pp[1].RenderPass,UnrealBloomPass:pp[2].UnrealBloomPass,OutputPass:pp[3].OutputPass};
    if(CL_GLB.gltf)return CL_GLB.gltf;
    return CL_GLB.laden||(CL_GLB.laden=new gl.GLTFLoader().loadAsync('/assets3d/clash.glb',ev=>{if(ev.total)bar(ev.loaded/ev.total);}).then(g=>{CL_GLB.gltf=g;return g;}).catch(e=>{CL_GLB.laden=null;throw e;}));
  }).then(()=>{
    bar(1);if(!document.getElementById('cl-veld'))return;
    try{clStartRenderer(document.getElementById('cl-veld'));}catch(e){clGeenWebGL();return;}
    clMats();CL.on=true;CL.scenes={};CL.nid=0;CL.t=0;CL.mode='lobby';CL.lijken=[];
    const c=clStore();CL.arena=clArena(c.bekers);clKiesScene(CL.arena);clZetTorens();clComposer();
    clPortretten();
    clLeerPool(()=>{clLobby();if(direct&&clGenoegLeerstof())clStartPotje();});
    CL.vorige=0;CL.raf=requestAnimationFrame(clLus);
  }).catch(e=>{console.warn('[Clash]',e);clGeenWebGL(true);});
}
function clGeenWebGL(net){arcStage('clash',`${arcTop('')}<div class="arc-intro"><h2 class="arc-intro-h">${net?'De arena kon niet laden':'Dit toestel kan de arena niet tonen'}</h2><p class="arc-intro-p">${net?'Controleer je verbinding en probeer het opnieuw.':'Slagio Clash heeft 3D nodig (WebGL). Probeer een nieuwere browser, of speel een van de andere games.'}</p><button class="arc-go" onclick="arcClose()">Terug naar de Arcade</button></div>`);}
function clKiesScene(i){CL.scene=CL.scenes[i]||(CL.scenes[i]=clBouwScene(i));}
function clLeegVeld(){
  for(const e of CL.ents){CL.scene.remove(e.m.g);if(e.bar)e.bar.remove();}for(const p of CL.proj)CL.scene.remove(p.m);
  for(const l of CL.lijken||[])CL.scene.remove(l.m.g);CL.lijken=[];
  for(const f of CL.fx){try{f.upd(1);}catch(e){}}CL.ents=[];CL.proj=[];CL.fx=[];CL.vlaggen=[];
}
function clZetTorens(){
  clLeegVeld();if(!CL.bars){CL.bars=document.createElement('div');}
  for(const t of [0,1]){const z=v=>t?CL_L-v:v;clMaakToren('prinses',t,3.5,z(6.5));clMaakToren('prinses',t,14.5,z(6.5));clMaakToren('koning',t,9,z(3));}
}
function clLobby(){
  CL.mode='lobby';CL.klaar=false;
  const c=clStore();const ar=CL_ARENAS[CL.arena];const volgende=CL_ARENAS[CL.arena+1];
  const vak=arcVak(ARC.vakId);const genoeg=clGenoegLeerstof();
  const veld=document.getElementById('cl-veld');if(!veld)return;
  veld.querySelectorAll('.cl-lobby,.cl-laden,.cl-hud,.cl-bars,.cl-pops,.cl-overlay').forEach(x=>x.remove());
  const pct=volgende?Math.min(100,(c.bekers-ar.min)/(volgende.min-ar.min)*100):100;
  const L=document.createElement('div');L.className='cl-lobby';
  L.innerHTML=`<div class="cl-lobby-top"><button class="arc-x" onclick="arcClose()" aria-label="Sluiten">✕</button>
      <div class="cl-bekers" title="Bekers">${CL_BEKER}<b>${arcNf(c.bekers,0)}</b></div></div>
    <div class="cl-lobby-mid">
      <div class="cl-lobby-k">${_arcEsc(vak?vak.naam:'')}${vak?' · ':''}${_arcEsc(ar.naam)}</div>
      <h1 class="cl-lobby-h">Slagio Clash</h1>
      <ol class="cl-regels"><li><b>Tik het juiste begrip</b><span>Elk goed antwoord geeft 1 kennis.</span></li><li><b>Zet kaarten in</b><span>Een kaart kost kennis. Sleep hem naar jouw helft.</span></li><li><b>Haal torens neer</b><span>Toren = 1 kroon. Koningstoren = 3 kronen en meteen gewonnen.</span></li></ol>
      <div class="cl-arena"><div class="cl-arena-r"><span>${_arcEsc(ar.naam)}</span><small>${volgende?`${arcNf(volgende.min-c.bekers,0)} bekers tot ${_arcEsc(volgende.naam)}`:'Hoogste arena'}</small></div><div class="cl-arena-bar"><i style="width:${pct.toFixed(0)}%"></i></div></div>
    </div>
    <div class="cl-lobby-onder">
      <div class="cl-deck-kop"><b>Jouw deck</b><small>Tik op een kaart om te wisselen</small></div>
      <div class="cl-deck" id="cl-deck">${c.deck.map((id,i)=>`<button class="cl-kaart klein" onclick="clKaartInfo(${i})" aria-label="${_arcEsc(CL_KAARTEN[id].naam)}">${clKaartHtml(id)}</button>`).join('')}</div>
      ${genoeg?`<button class="arc-go cl-strijd" id="cl-strijd">Strijd</button>`:`<p class="cl-lobby-p">${_arcEsc(vak?vak.naam:'Dit vak')} heeft nog te weinig begrippen en korte vragen. Kies in de Arcade een ander vak.</p><button class="arc-go" onclick="arcClose()">Terug</button>`}
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
    <div class="cl-tegen">${_arcEsc(naam)} <small>computer</small></div><button class="arc-x cl-help" onclick="clRegels()" aria-label="Spelregels">?</button>`;
  veld.appendChild(hud);
  // Staat van het potje.
  Object.assign(CL,{mode:'strijd',klaar:false,pauze:false,tijd:180,overtime:false,dubbelGemeld:false,eindeNa:null,t:0,tempo:1,kronen:[0,0],kennis:[5,5],
    gespeeld:0,sterk:false,reeks:0,dq:1.6,gebruikt:new Set(),gebruiktB:new Set(),herhaal:[],nr:0,log:[],botNaam:naam,gekozen:-1,schud:0,tut:null});
  const deck=arcShuffle(c.deck.slice());CL.hand=deck.slice(0,4);CL.rij=deck.slice(4);
  const pool=Object.keys(CL_KAARTEN);const bd=arcShuffle(pool).slice(0,8);if(!bd.some(k=>['reus','ram','ridder'].includes(k)))bd[0]='ridder';
  CL.bot={hand:bd.slice(0,4),rij:bd.slice(4),denk:5,antw:4,goed:0,vragen:0};
  clZetTorens();
  CL.hoek=1.05;CL.topMarge=root.clientWidth>=900?.86:.74;
  clDock();clResize();clFit();
  // Camera-zwaai van boven naar de speelpositie.
  const eind=CL.camBasis.clone();const start=eind.clone().add(new T.Vector3(0,14,8));const t0=performance.now();CL.pauze=true;
  const zwaai=nu=>{if(!CL.on)return;const p=Math.min(1,(nu-t0)/1100),e=1-Math.pow(1-p,3);CL.camBasis=start.clone().lerp(eind,e);CL.cam.position.copy(CL.camBasis);CL.cam.lookAt(CL.camDoel);if(p<1)requestAnimationFrame(zwaai);else{CL.camBasis=eind;clAftellen();}};
  requestAnimationFrame(zwaai);
  clFlitsNieuw();
}
function clAftellen(){
  const veld=document.getElementById('cl-veld');const el=document.createElement('div');el.className='cl-overlay cl-cd';veld.appendChild(el);
  // Eerste potje: eerst de uitleg in stappen, het gevecht start pas daarna.
  if(!clStore().uitlegGezien){el.remove();clTutStart();return;}
  let n=3;const tik=()=>{if(!CL.on)return;if(n===0){el.innerHTML='<b class="go">Strijd!</b>';arcSnd('start');arcHap(20);CL.pauze=false;setTimeout(()=>el.remove(),650);return;}
    el.innerHTML=`<b>${n}</b>`;arcSnd('tick');n--;setTimeout(tik,650);};tik();
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
  const goed=CL.log.filter(x=>x.goed).length,tot=CL.log.length;const gepland=clLeerOpslaan();
  const xp=arcXP(goed*5+(u==='win'?25:u==='gelijk'?10:5)+a*8);
  try{if(typeof trackEvent==='function')trackEvent('minigame',{game:'clash',uitslag:u,kronen:a,tegen:b,goed,vragen:tot,bekers:c.bekers,xp,vak_id:ARC.vakId});}catch(e){}
  // Leerkaarten: wat je miste, als begrip met betekenis (niet als lange vraag).
  const gemist=[],gezien=new Set();for(const x of CL.log){if(x.goed)continue;const k=x.soort==='vraag'?x.item.q.v:x.item.t;if(gezien.has(k))continue;gezien.add(k);gemist.push(x);}
  const leer=gemist.slice(0,6).map(x=>x.soort==='vraag'
    ?`<li><div class="cl-leer-v">${_arcEsc(x.item.q.v)}</div><div class="cl-leer-a">${_arcEsc(x.item.q.o[x.item.q.c])}</div>${x.item.q.uh?`<div class="cl-leer-u">${_arcEsc(x.item.q.uh)}</div>`:''}</li>`
    :`<li><div class="cl-leer-v">${_arcEsc(x.item.t)}</div><div class="cl-leer-u">${_arcEsc(x.item.d)}</div></li>`).join('');
  const nBeg=new Set(CL.log.filter(x=>x.soort!=='vraag').map(x=>x.item.t)).size,nGoedBeg=new Set(CL.log.filter(x=>x.soort!=='vraag'&&x.goed).map(x=>x.item.t)).size;
  const zwakX=gemist.find(x=>x.soort==='vraag');const zwakLd=zwakX?zwakX.item:null;
  clStop();
  arcStage('clash-res',`${arcTop('')}
    <div class="arc-res cl-res ${u==='win'?'win':'lose'}">
      <div class="cl-res-kr">${[0,1,2].map(i=>`<span class="${i<a?'aan':''}" style="--i:${i}">${CL_KROON}</span>`).join('')}</div>
      <div class="arc-res-k">${u==='win'?'Gewonnen':u==='verlies'?'Verloren':'Gelijkspel'} · ${a} tegen ${b}</div>
      <div class="arc-res-big"><span class="cl-beker-ic">${CL_BEKER}</span><span class="arc-tel">${arcNf(c.bekers-delta,0)}</span></div>
      <div class="arc-res-sub">${delta>0?`+${delta} bekers`:delta<0?`${delta} bekers`:'Bekers blijven gelijk'}${nieuwArena>oudArena?` · Nieuwe arena: <b>${_arcEsc(CL_ARENAS[nieuwArena].naam)}</b>`:''}</div>
      <div class="arc-res-stats"><div><b>${goed}/${tot}</b><small>goed beantwoord</small></div><div><b>${nGoedBeg}/${nBeg}</b><small>begrippen gekend</small></div><div><b>${CL.gespeeld}</b><small>kaarten gespeeld</small></div></div>
      ${xp?`<div class="arc-res-xp"><span class="arc-xp-chip">+<b class="arc-xp-n">0</b> XP</span><small>telt mee voor je divisie</small></div>`:''}
      ${leer?`<div class="cl-leer"><div class="cl-leer-k">Deze moet je nog even leren</div><ul>${leer}</ul>${gepland?`<div class="cl-leer-sr">${gepland===1?'Dit begrip komt':'Deze begrippen komen'} morgen terug in Herhalen.</div>`:''}</div>`:tot?`<div class="arc-res-leer">Alles goed beantwoord. Dat scheelt kennis, en kennis wint potjes.</div>`:''}
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

// ── Leerstof: begrippenflitsen ──────────────────────────────────────────
// Korte flitsen in plaats van lange vragen: je leest één definitie en tikt het
// begrip (of andersom). Af en toe een korte meerkeuzevraag. Gemiste begrippen
// komen in hetzelfde potje terug (herhalen werkt beter dan één keer lezen) en
// gaan na afloop naar je herhaalkaarten.
const CL_REEKS=4;
function clLeerPool(klaar){
  const lvl=(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo';
  const bouw=()=>{
    const vak=arcVak(ARC.vakId);const beg=[],gezien=new Set();
    ((vak&&vak.domeinen)||[]).forEach(d=>(d.begrippen||[]).forEach(b=>{if(!b||!b.t||!b.d)return;const t=String(b.t).trim(),df=String(b.d).trim().replace(/\.$/,'');
      if(t.length>30||df.length>110||df.length<8)return;const k=t.toLowerCase();if(gezien.has(k))return;gezien.add(k);beg.push({t,d:df,domId:d.id,domNaam:d.naam});}));
    CL.beg=beg;
    arcPool(ARC.vakId,p=>{CL.pool=p||[];CL.kortQ=CL.pool.filter(x=>x.q.v.length<=90&&x.q.o.every(o=>String(o).length<=34));klaar();});
  };
  try{if(typeof ensureVakData==='function')ensureVakData(lvl,ARC.vakId,bouw);else bouw();}catch(e){bouw();}
}
function clGenoegLeerstof(){return (CL.beg||[]).length>=6||(CL.kortQ||[]).length>=8;}
function clVolgendeFlits(){
  CL.nr++;
  const h=CL.herhaal.findIndex(x=>x.na<=CL.nr);
  if(h>=0){const x=CL.herhaal.splice(h,1)[0];return clMaakFlits(x.item,true);}
  const vragen=(CL.kortQ||[]).length>=6,begs=(CL.beg||[]).length>=6;
  if(vragen&&(!begs||CL.nr%4===0)){const it=arcNext(CL.kortQ,CL.gebruikt,Math.round(CL.dq));if(it){const o=arcOpties(it.q);return {soort:'vraag',item:it,o,juist:o.juist};}}
  const vrij=CL.beg.filter(b=>!CL.gebruiktB.has(b.t));if(!vrij.length)CL.gebruiktB.clear();
  const item=arcPick(vrij.length?vrij:CL.beg);CL.gebruiktB.add(item.t);return clMaakFlits(item,false);
}
function clMaakFlits(item,herh){
  const zelfde=CL.beg.filter(b=>b!==item&&b.domId===item.domId&&b.t.toLowerCase()!==item.t.toLowerCase());
  const rest=CL.beg.filter(b=>b!==item&&b.domId!==item.domId);
  const afl=arcShuffle(zelfde).slice(0,2);while(afl.length<2&&rest.length){const r=arcPick(rest);if(!afl.includes(r))afl.push(r);}
  const omgekeerd=!herh&&CL.nr>3&&Math.random()<.25&&item.d.length<=70&&afl.every(a=>a.d.length<=70);
  const opties=arcShuffle([item,...afl.slice(0,omgekeerd?1:2)]);
  return {soort:omgekeerd?'term':'def',item,opties,juist:opties.indexOf(item),herh};
}
function clFlitsNieuw(){
  const box=document.getElementById('cl-vraag');if(!box)return;
  if(!clGenoegLeerstof()){box.innerHTML='<div class="cl-v-leeg">Geen leerstof voor dit vak</div>';return;}
  const F=clVolgendeFlits();CL.flits=F;F.t0=performance.now();F.klaar=false;
  const reeks=`<span class="cl-f-reeks" aria-label="${CL.reeks} van ${CL_REEKS} op rij">${Array.from({length:CL_REEKS},(_,i)=>`<i class="${i<CL.reeks?'aan':''}"></i>`).join('')}</span>`;
  const kop=(label)=>`<div class="cl-f-kop"><span>${F.herh?'<b class="cl-f-herh">Nog een keer</b>':_arcEsc(label)}</span>${reeks}</div>`;
  if(F.soort==='vraag'){const L=['A','B','C','D'];
    box.innerHTML=`${kop(F.item.ldNaam||F.item.domNaam||'')}<div class="cl-f-v vraag">${_arcEsc(F.item.q.v)}</div>
      <div class="cl-f-o twee">${F.o.idx.map((oi,k)=>`<button class="cl-opt" data-k="${k}"><i>${L[k]}</i><span>${_arcEsc(F.item.q.o[oi])}</span></button>`).join('')}</div><div class="cl-f-fb" id="cl-vfb"></div>`;}
  else if(F.soort==='term'){
    box.innerHTML=`${kop('Wat betekent')}<div class="cl-f-v term">${_arcEsc(F.item.t)}</div>
      <div class="cl-f-o lang">${F.opties.map((o,k)=>`<button class="cl-opt" data-k="${k}"><span>${_arcEsc(o.d)}</span></button>`).join('')}</div><div class="cl-f-fb" id="cl-vfb"></div>`;}
  else{
    box.innerHTML=`${kop('Welk begrip is dit?')}<div class="cl-f-v">${_arcEsc(F.item.d)}</div>
      <div class="cl-f-o drie">${F.opties.map((o,k)=>`<button class="cl-opt chip" data-k="${k}"><span>${_arcEsc(o.t)}</span></button>`).join('')}</div><div class="cl-f-fb" id="cl-vfb"></div>`;}
  box.classList.remove('in');void box.offsetWidth;box.classList.add('in');
  box.querySelectorAll('.cl-opt').forEach(b=>b.onclick=()=>clAntwoord(+b.dataset.k));
}
function clAntwoord(k){
  const F=CL.flits;if(!F||F.klaar||CL.klaar)return;F.klaar=true;
  const goed=k===F.juist;const ms=performance.now()-F.t0;
  const knoppen=[...document.querySelectorAll('#cl-vraag .cl-opt')];knoppen.forEach(b=>b.disabled=true);knoppen[F.juist].classList.add('goed');
  // Leerlaag: meerkeuzevragen via arcLog (mastery + afleiders), begrippen per domein.
  if(F.soort==='vraag')arcLog(F.item,goed,F.o.idx[k],ms);
  else{try{if(typeof logQuestion==='function')logQuestion(ARC.vakId,F.item.domId,'arcade',0,goed,ms);}catch(e){}}
  CL.log.push({soort:F.soort,item:F.item,goed,keuze:F.soort==='vraag'?F.o.idx[k]:null,herh:F.herh,domId:F.soort==='vraag'?F.item.domId:F.item.domId});
  if(CL.tut&&CL.tut.stap===1)setTimeout(()=>clTutVerder(),goed?700:2200);
  if(goed){
    CL.dq=Math.min(3,CL.dq+.34);CL.reeks++;CL.kennis[0]=Math.min(10,CL.kennis[0]+1);
    arcSnd('correct');arcHap(10);
    try{arcFly(arcMid(knoppen[k]),arcMid(document.getElementById('cl-knum')),'<span class="cl-plus">+1</span>',{duur:480,eind:.8,boog:-26});}catch(e){}
    if(F.herh){const f=document.getElementById('cl-vfb');if(f)f.innerHTML='<span class="cl-f-ok">Onthouden!</span>';}
    if(CL.reeks>=CL_REEKS){CL.reeks=0;if(!CL.sterk){CL.sterk=true;arcSnd('streak');clDockTik();clPopMid('Je volgende kaart is versterkt');}}
    setTimeout(()=>{if(CL.mode==='strijd'&&!CL.klaar)clFlitsNieuw();},F.herh?750:430);
  }else{
    CL.dq=Math.max(1,CL.dq-.5);CL.reeks=0;knoppen[k].classList.add('fout');arcSnd('wrong');arcHap([15,25,15]);
    if(F.soort!=='vraag')CL.herhaal.push({item:F.item,na:CL.nr+3});
    const f=document.getElementById('cl-vfb');
    const uit=F.soort==='vraag'?(F.item.q.uh||clUitleg(F.item.q,F.o.idx[k])):`<b>${_arcEsc(F.item.t)}</b>: ${_arcEsc(F.item.d)}`;
    if(f)f.innerHTML=`<div class="cl-v-uit">${F.soort==='vraag'?_arcEsc(uit):uit}</div>`;
    setTimeout(()=>{if(CL.mode==='strijd'&&!CL.klaar)clFlitsNieuw();},2200);
  }
}
// Na afloop: beheersing per domein bijwerken en gemiste begrippen inplannen.
function clLeerOpslaan(){
  const perDom={};for(const x of CL.log){const k=x.domId;if(!k)continue;(perDom[k]=perDom[k]||{g:0,n:0});perDom[k].n++;if(x.goed)perDom[k].g++;}
  for(const [dom,v] of Object.entries(perDom))if(v.n>=6){try{saveProgress(ARC.vakId,dom,'snel',Math.round(v.g/v.n*10),10);}catch(e){}}
  let gepland=0;
  try{if(typeof getSR==='function'&&typeof sm2==='function'){const sr=getSR();
    for(const x of CL.log){if(x.soort==='vraag')continue;const k=srKey(ARC.vakId,x.item.domId,x.item.t);
      if(!x.goed){sr[k]=Object.assign({vakId:ARC.vakId,domId:x.item.domId,term:x.item.t},sm2(sr[k]||{},0));gepland++;}
      else if(sr[k]&&!x.herh)sr[k]=Object.assign({},sr[k],sm2(sr[k],3));}
    saveSR(sr);}}catch(e){}
  return gepland;
}

// ── Dock: flits, hand en kennisbalk ─────────────────────────────────────
function clDock(){
  const root=document.getElementById('cl-root');let d=document.getElementById('cl-dock');if(d)d.remove();
  d=document.createElement('div');d.className='cl-dock';d.id='cl-dock';
  const vak=arcVak(ARC.vakId);
  d.innerHTML=`<div class="cl-dock-kop"><b>${_arcEsc(vak?vak.naam:'Leerstof')}</b><span>Elk goed antwoord geeft 1 kennis. ${CL_REEKS} op rij versterkt je volgende kaart. Wat je mist, komt terug.</span></div>
    <div class="cl-vraag" id="cl-vraag"></div>
    <div class="cl-info" id="cl-info" hidden></div>
    <div class="cl-hand"><div class="cl-next"><small>Volgende</small><div class="cl-kaart mini" id="cl-next"></div></div>
      <div class="cl-kaarten" id="cl-kaarten"></div></div>
    <div class="cl-kennis"><div class="cl-kennis-bar" id="cl-kbar"><i></i>${'<s></s>'.repeat(9)}</div><b id="cl-knum">5</b></div>`;
  root.appendChild(d);clHand();clInput();
}
function clHand(){
  const k=document.getElementById('cl-kaarten');if(!k)return;
  k.innerHTML=CL.hand.map((id,i)=>`<button class="cl-kaart${CL.gekozen===i?' gekozen':''}" data-i="${i}" aria-label="${_arcEsc(CL_KAARTEN[id].naam)}, ${CL_KAARTEN[id].k} kennis">${clKaartHtml(id)}</button>`).join('');
  const n=document.getElementById('cl-next');if(n)n.innerHTML=clKaartHtml(CL.rij[0],{naam:false});
  const inf=document.getElementById('cl-info');
  if(inf){const id=CL.gekozen>=0?CL.hand[CL.gekozen]:null;inf.hidden=!id;
    if(id){const d=CL_KAARTEN[id];inf.innerHTML=`<b>${_arcEsc(d.naam)}</b><span>${_arcEsc(d.wat)}</span><em>${d.t==='spreuk'?'Tik waar hij moet landen':'Tik of sleep naar jouw helft'}</em>`;}}
  clDockTik(true);
}
function clDockTik(){
  const kn=CL.kennis[0];const bar=document.getElementById('cl-kbar');if(!bar)return;
  bar.firstChild.style.width=(kn*10).toFixed(1)+'%';const num=document.getElementById('cl-knum');const hele=Math.floor(kn);if(num.textContent!=hele)num.textContent=hele;
  document.querySelectorAll('#cl-kaarten .cl-kaart').forEach(b=>{const id=CL.hand[+b.dataset.i];const kan=kn>=CL_KAARTEN[id].k;b.classList.toggle('kan',kan);b.classList.toggle('sterk',CL.sterk);
    b.style.setProperty('--laad',Math.min(1,kn/CL_KAARTEN[id].k).toFixed(3));});
  const kl=document.getElementById('cl-klok');if(kl){const t=Math.max(0,Math.ceil(CL.tijd));const txt=Math.floor(t/60)+':'+String(t%60).padStart(2,'0');if(kl.textContent!==txt)kl.textContent=txt;
    kl.classList.toggle('dubbel',CL.tijd<=60||CL.overtime);kl.classList.toggle('laatst',CL.tijd<=10);}
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
  clInzet(id,0,x,z,sterk);CL.gespeeld++;CL.hand[i]=CL.rij.shift();CL.rij.push(id);arcHap(10);clHand();
  if(CL.tut&&CL.tut.stap===3)setTimeout(()=>clTutVerder(),900);
  return true;
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
  if(d.t==='unit')clRoute(pt[0],z,d);else clRouteWeg();
}
function clZone(aan){
  if(!CL.zone){const mk=()=>{const m=new T.Mesh(new T.PlaneGeometry(9,1),new T.MeshBasicMaterial({color:0xff3b30,transparent:true,opacity:.2,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=.06;CL.scene.add(m);return m;};CL.zone=[mk(),mk()];}
  const vijPr=CL.ents.filter(o=>o.team===1&&o.sub==='prinses');
  CL.zone.forEach((m,i)=>{if(m.parent!==CL.scene)CL.scene.add(m);const links=i===0;const open=vijPr.some(o=>o.dood&&(o.x<9)===links);const z0=open?21.5:CL_RIV0,z1=CL_L;
    m.scale.y=z1-z0;m.position.set(links?-4.5:4.5,.06,16-(z0+z1)/2);m.visible=aan;});
}
// Laat zien waar een eenheid heen gaat: over de dichtstbijzijnde brug naar de toren van die kant.
function clRoute(x,z,d){
  const vij=CL.ents.filter(o=>o.team===1&&o.soort==='toren'&&!o.dood);const links=x<9;
  const doel=vij.find(o=>o.sub==='prinses'&&(o.x<9)===links)||vij.find(o=>o.sub==='koning');if(!doel){clRouteWeg();return;}
  const pts=[[x,z]];if(!d.vlieg&&z<CL_RIV0){const bx=links?CL_BRUG[0]:CL_BRUG[1];pts.push([bx,CL_RIV0-.4],[bx,CL_RIV1+.4]);}
  const dx=doel.x-pts[pts.length-1][0],dz=doel.z-pts[pts.length-1][1],l=Math.hypot(dx,dz)||1;pts.push([doel.x-dx/l*(doel.r+.3),doel.z-dz/l*(doel.r+.3)]);
  const v=pts.map(([a,b])=>new T.Vector3(a-9,.14,16-b));
  if(!CL.route){CL.route=new T.Line(new T.BufferGeometry(),new T.LineDashedMaterial({color:0xffffff,dashSize:.35,gapSize:.25,transparent:true,opacity:.9,depthWrite:false}));
    CL.routeDoel=new T.Mesh(clGeo('routeRing',()=>new T.RingGeometry(1.9,2.15,40)),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.8,depthWrite:false,side:T.DoubleSide}));CL.routeDoel.rotation.x=-Math.PI/2;}
  if(CL.route.parent!==CL.scene){CL.scene.add(CL.route);CL.scene.add(CL.routeDoel);}
  CL.route.geometry.setFromPoints(v);CL.route.computeLineDistances();CL.route.visible=true;
  CL.routeDoel.position.set(doel.x-9,.12,16-doel.z);CL.routeDoel.scale.setScalar(doel.sub==='koning'?1.2:.95);CL.routeDoel.visible=true;
}
function clRouteWeg(){if(CL.route)CL.route.visible=false;if(CL.routeDoel)CL.routeDoel.visible=false;}
function clGhostWeg(){clRouteWeg();
  if(CL.ghost){CL.scene&&CL.scene.remove(CL.ghost);for(const m of CL.ghost.userData.eigen||[]){try{m.material.dispose();if(m.geometry.type==='CircleGeometry'||m.geometry.type==='RingGeometry')m.geometry.dispose();}catch(e){}}CL.ghost=null;}
  if(CL.zone)CL.zone.forEach(m=>m.visible=false);
}


// ── Uitleg bij het eerste potje ─────────────────────────────────────────
// Vier korte stappen met een spotlight. Het gevecht (klok en tegenstander)
// begint pas als de leerling de uitleg heeft gedaan.
function clTutStart(){CL.pauze=false;CL.tut={stap:0};CL.kennis[0]=Math.max(CL.kennis[0],5);clTutVerder();}
function clTutVerder(){
  const T0=CL.tut;if(!T0||!CL.on)return;T0.stap++;clCoachWeg();
  if(T0.stap===1)clCoach('#cl-vraag','Tik het juiste begrip','Lees de uitleg en kies het begrip dat erbij hoort. Elk goed antwoord geeft 1 kennis.',null,'boven');
  else if(T0.stap===2){CL.kennis[0]=Math.max(CL.kennis[0],6);clDockTik();clCoach('.cl-hand','Kennis betaalt je kaarten','Het gele getal op een kaart is de prijs. Kaarten die je kunt betalen, lichten op. Je balk hieronder vult zich ook vanzelf.','Verder','boven');}
  else if(T0.stap===3)clCoach('.cl-hand','Zet een kaart in','Sleep een kaart naar jouw helft van het veld. Of tik eerst een kaart en dan een plek. De lijn laat zien waar hij heen loopt.',null,'boven');
  else if(T0.stap===4)clCoach('#cl-veld','Haal torens neer','Je troepen lopen zelf over de brug naar de dichtstbijzijnde toren. Toren neer is 1 kroon. De koningstoren is 3 kronen en meteen gewonnen. Na 3 minuten wint wie de meeste kronen heeft.','Start het gevecht','midden');
  else{const c=clStore();c.uitlegGezien=true;clSave(c);CL.tut=null;clCoachWeg();arcSnd('start');clBanner('Strijd!','Je hebt 3 minuten');}
}
function clCoach(sel,titel,tekst,knop,plek){
  const doel=document.querySelector(sel);const r=doel?doel.getBoundingClientRect():{left:innerWidth/2-100,top:innerHeight/2-50,width:200,height:100,right:innerWidth/2+100,bottom:innerHeight/2+50};
  const spot=document.createElement('div');spot.className='cl-spot';
  Object.assign(spot.style,{left:(r.left-6)+'px',top:(r.top-6)+'px',width:(r.width+12)+'px',height:(r.height+12)+'px'});
  const b=document.createElement('div');b.className='cl-coach '+(plek||'boven');b.setAttribute('role','dialog');
  b.innerHTML=`<b>${_arcEsc(titel)}</b><p>${_arcEsc(tekst)}</p>${knop?`<button class="cl-coach-k">${_arcEsc(knop)}</button>`:'<small>Probeer het maar</small>'}`;
  document.body.append(spot,b);
  const bw=Math.min(340,innerWidth-24);b.style.width=bw+'px';
  const bh=b.offsetHeight;let top=plek==='midden'?r.top+r.height/2-bh/2:r.top-bh-16;if(top<10)top=r.bottom+14;
  b.style.left=Math.max(12,Math.min(innerWidth-bw-12,r.left+r.width/2-bw/2))+'px';b.style.top=top+'px';
  if(plek==='midden')spot.classList.add('zacht');
  const k=b.querySelector('.cl-coach-k');if(k)k.onclick=()=>{arcSnd('tap');clTutVerder();};
  CL._coach=[spot,b];
}
function clCoachWeg(){(CL._coach||[]).forEach(x=>x.remove());CL._coach=null;}
// De regels, altijd op te vragen met de ?-knop (het spel staat dan stil).
function clRegels(){
  if(!CL.on||CL.klaar)return;const was=CL.pauze;CL.pauze=true;
  const o=document.createElement('div');o.className='cl-sheet';
  o.innerHTML=`<div class="cl-sheet-in" role="dialog" aria-label="Spelregels"><h3 class="cl-regels-h">Zo werkt Slagio Clash</h3>
    <ol class="cl-regels"><li><b>Kennis verdien je met leren</b><span>Tik het juiste begrip: +1 kennis. Je kennis loopt ook langzaam vanzelf op. In de laatste minuut gaat alles twee keer zo snel.</span></li>
    <li><b>${CL_REEKS} goed op rij</b><span>Je volgende kaart is 25% sterker (gouden ring). Wat je fout had, komt later terug.</span></li>
    <li><b>Kaarten kosten kennis</b><span>Sleep een kaart naar jouw helft. Spreuken mag je overal neerzetten. Is een vijandelijke toren gevallen, dan mag je aan die kant verder naar voren.</span></li>
    <li><b>Troepen lopen zelf</b><span>Ze gaan over de dichtstbijzijnde brug naar de dichtstbijzijnde toren, en vechten onderweg met wat ze tegenkomen.</span></li>
    <li><b>Kronen</b><span>Toren neer: 1 kroon. Koningstoren: 3 kronen en meteen gewonnen. Na 3 minuten wint wie de meeste kronen heeft; bij gelijkspel volgt een minuut verlenging.</span></li></ol>
    <button class="arc-go" data-sluit>Verder spelen</button></div>`;
  document.getElementById('cl-veld').appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
  o.addEventListener('click',e=>{if(e.target===o||e.target.closest('[data-sluit]')){o.classList.remove('on');setTimeout(()=>o.remove(),200);CL.pauze=was;}});
}
