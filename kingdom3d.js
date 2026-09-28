// ═══════════════════════════════════════════════════════════════════════
// kingdom3d.js - Slagio Kingdom als 3D-eiland
// ───────────────────────────────────────────────────────────────────────
// Lazy geladen door kingdom.js (kdProbeer3D) nadat de SVG-kaart al staat.
// Lukt WebGL, dan neemt deze laag de kaart over: een zwevend eiland met een
// wijk per vak, echte gebouwen (Kenney CC0, assets3d/kingdom.glb), bomen,
// een waterval en licht dat met het tijdstip meegaat. De regels, het blad
// onderin en het bouwen zelf blijven in kingdom.js; hier vervangen we alleen
// de tekenlaag en de camera (kdRender, kdFocus, kdOverzicht, kdZoom, ...).
// ═══════════════════════════════════════════════════════════════════════

let K3T=null;
const K3={on:false,glb:null,sc:null,r:null,cam:null,wijken:{},fx:[],ticks:[],t:0,raf:0,
  doel:null,az:-.72,pol:.9,dist:30,doelA:null,naar:null,hits:[]};
const K3_HMAX=[1.55,2.3,3.3,4.6];

function kdProbeer3D(){
  if(K3.on||K3.laden)return;
  try{const c=document.createElement('canvas');if(!(c.getContext('webgl2')||c.getContext('webgl')))return;}catch(e){return;}
  K3.laden=Promise.all([import('/vendor/three.module.min.js'),import('/vendor/jsm/loaders/GLTFLoader.js'),import('/vendor/jsm/utils/SkeletonUtils.js')])
    .then(([t,gl,su])=>{K3T=t;K3.SU=su;return K3.glb||new gl.GLTFLoader().loadAsync('/assets3d/kingdom.glb');})
    .then(g=>{K3.glb=g;K3.laden=null;const st=document.getElementById('kd-stage');if(!st||st.hidden||!KD.wereld)return;k3Start();})
    .catch(e=>{K3.laden=null;console.warn('[Kingdom 3D]',e);});
}

// ── Hulp: modellen, materialen, textuur ─────────────────────────────────
const _k3M={};
function k3Mat(k,f){return _k3M[k]||(_k3M[k]=f());}
function k3Std(k,o){return k3Mat(k,()=>new K3T.MeshStandardMaterial(o));}
function k3Canvas(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return c;}
function k3Tex(c,rep,kleur){const t=new K3T.CanvasTexture(c);if(kleur!==false)t.colorSpace=K3T.SRGBColorSpace;t.anisotropy=4;if(rep){t.wrapS=t.wrapT=K3T.RepeatWrapping;t.repeat.set(rep[0],rep[1]);}return t;}
function k3Rnd(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function k3Hsl(r,g,b){const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn;if(!d)return [0,0,l];const s=d/(1-Math.abs(2*l-1));let h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;if(h<0)h+=360;return [h,s,l];}
function k3Rgb(h,s,l){const C=(1-Math.abs(2*l-1))*s,X=C*(1-Math.abs((h/60)%2-1)),m=l-C/2;const [r,g,b]=h<60?[C,X,0]:h<120?[X,C,0]:h<180?[0,C,X]:h<240?[0,X,C]:h<300?[X,0,C]:[C,0,X];return [(r+m)*255,(g+m)*255,(b+m)*255];}
// Kleurkaart aanpassen: groene daken krijgen de vakkleur, en lichtblauwe ramen
// krijgen een aparte 'nachtkaart' zodat ze 's avonds warm oplichten.
const _k3Tex=new Map();
function k3Kleurkaart(tex,hex){
  const k=tex.uuid+'|'+hex;if(_k3Tex.has(k))return _k3Tex.get(k);
  const img=tex.image;const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d');g.drawImage(img,0,0);
  const d=g.getImageData(0,0,c.width,c.height),p=d.data;let doel=null;if(hex){const o={};new K3T.Color(hex).getHSL(o,K3T.SRGBColorSpace);doel=[o.h*360,o.s,o.l];}
  const n=g.createImageData(c.width,c.height),q=n.data;
  for(let i=0;i<p.length;i+=4){const [h,s,l]=k3Hsl(p[i]/255,p[i+1]/255,p[i+2]/255);
    if(doel&&h>95&&h<175&&s>.25){const [r,gg,b]=k3Rgb(doel[0],Math.min(1,doel[1]*.9),Math.max(.22,Math.min(.62,l*.95)));p[i]=r;p[i+1]=gg;p[i+2]=b;}
    const raam=h>185&&h<235&&s>.2&&l>.45&&l<.85;q[i]=raam?255:0;q[i+1]=raam?196:0;q[i+2]=raam?110:0;q[i+3]=255;}
  g.putImageData(d,0,0);const e=document.createElement('canvas');e.width=c.width;e.height=c.height;e.getContext('2d').putImageData(n,0,0);
  const t1=tex.clone();t1.source=new K3T.Source(c);t1.needsUpdate=true;const t2=tex.clone();t2.source=new K3T.Source(e);t2.needsUpdate=true;
  const r={map:t1,em:t2};_k3Tex.set(k,r);return r;
}
function k3Model(naam,kleur){
  const src=K3.glb.scenes.find(s=>s.name===naam);if(!src)return new K3T.Group();const c=K3.SU.clone(src);
  c.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;
    const m=o.material;const key='m|'+m.uuid+'|'+(kleur||'');
    o.material=k3Mat(key,()=>{const n=m.clone();if(m.map){const k=k3Kleurkaart(m.map,kleur);n.map=k.map;n.emissiveMap=k.em;n.emissive=new K3T.Color(0xffffff);n.emissiveIntensity=K3.nacht?1.1:0;K3.ramen.push(n);}
      if(/leafsGreen|leaf/i.test(m.name)){n.color=new K3T.Color(0x4f9e3f);n.flatShading=true;}else if(/leafsDark/i.test(m.name)){n.color=new K3T.Color(0x3a7a36);n.flatShading=true;}else if(/^grass/i.test(m.name)){n.color=new K3T.Color(0x5fa843);}n.roughness=Math.max(.5,n.roughness||.8);return n;});});
  return c;
}
function k3Zet(g,obj,o){o=o||{};if(o.s!=null)obj.scale.multiplyScalar(o.s);obj.position.set(o.x||0,o.y||0,o.z||0);if(o.ry)obj.rotation.y=o.ry;g.add(obj);return obj;}
function k3Mesh(geo,mat,schaduw){const m=new K3T.Mesh(geo,mat);if(schaduw!==false){m.castShadow=true;m.receiveShadow=true;}return m;}
const K3C={wit:0xeef0f3,glas:0x9fc6e4,staal:0xb8c0c9,donker:0x2b313a,steen:0xd9d0bf,rood:0xd4413a,hout:0x9a6a3f,groen:0x4f9a45};
function k3S(k){return {wit:k3Std('wit',{color:K3C.wit,roughness:.7}),glas:k3Std('glas',{color:K3C.glas,roughness:.08,metalness:.3}),staal:k3Std('staal',{color:K3C.staal,metalness:.75,roughness:.35}),
  donker:k3Std('donker',{color:K3C.donker,roughness:.55,metalness:.3}),steen:k3Std('steen',{color:K3C.steen,roughness:.85}),rood:k3Std('rood',{color:K3C.rood,roughness:.6}),
  hout:k3Std('hout',{color:K3C.hout,roughness:.8}),led:k3Std('led',{color:0x22d3ee,emissive:0x22d3ee,emissiveIntensity:2})}[k];}
const Bx=(w,h,d)=>new K3T.BoxGeometry(w,h,d),Cy=(a,b,h,s)=>new K3T.CylinderGeometry(a,b,h,s||20);

// ── Gebouwen per recept ─────────────────────────────────────────────────
// Elk recept levert een groep met de voet op y=0; k3Gebouw schaalt hem daarna
// naar de kavel (2×2 tegels) en de hoogte die bij het niveau hoort.
function k3Tanks(g,n,x0){for(let i=0;i<n;i++){const t=k3Mesh(Cy(.34,.34,.9,24),k3S('wit'));t.position.set(x0+(i%2)*.75,.45,(i>>1)*.75-.2);g.add(t);const d=k3Mesh(new K3T.SphereGeometry(.34,20,10,0,Math.PI*2,0,Math.PI/2),k3S('wit'));d.position.set(t.position.x,.9,t.position.z);g.add(d);
  const band=k3Mesh(Cy(.345,.345,.06,24),k3S('rood'),false);band.position.set(t.position.x,.62,t.position.z);g.add(band);}}
function k3Schoorsteen(g,x,z,h){const s=k3Mesh(Cy(.09,.13,h,14),k3S('steen'));s.position.set(x,h/2,z);g.add(s);const r=k3Mesh(Cy(.1,.1,.08,14),k3S('rood'),false);r.position.set(x,h-.12,z);g.add(r);g.userData.rook=(g.userData.rook||[]).concat([[x,h,z]]);}
function k3Tempel(g,koepel){
  const trap=k3Mesh(Bx(1.9,.18,1.4),k3S('steen'));trap.position.y=.09;g.add(trap);const trap2=k3Mesh(Bx(1.75,.14,1.25),k3S('steen'));trap2.position.y=.25;g.add(trap2);
  for(let i=0;i<6;i++)for(const z of [-.5,.5]){const c=k3Mesh(Cy(.06,.07,.9,12),k3S('wit'));c.position.set(-.75+i*.3,.77,z);g.add(c);}
  const bl=k3Mesh(Bx(1.8,.14,1.25),k3S('wit'));bl.position.y=1.28;g.add(bl);
  const f=new K3T.Shape([new K3T.Vector2(-.92,0),new K3T.Vector2(.92,0),new K3T.Vector2(0,.36)]);const fr=k3Mesh(new K3T.ExtrudeGeometry(f,{depth:1.3,bevelEnabled:false}),k3S('wit'));fr.position.set(0,1.35,-.65);g.add(fr);
  if(koepel){const d=k3Mesh(new K3T.SphereGeometry(.45,28,14,0,Math.PI*2,0,Math.PI/2),k3Std('koper',{color:0x5fae9a,metalness:.6,roughness:.4}));d.position.y=1.7;g.add(d);const tr=k3Mesh(Cy(.46,.46,.25,28),k3S('wit'));tr.position.y=1.6;g.add(tr);}
}
const K3R={
  hut:k=>{const g=new K3T.Group();k3Zet(g,k3Model('huis-a',k));return g;},
  schuur:k=>{const g=new K3T.Group();k3Zet(g,k3Model('huis-p',k));return g;},
  werkplaats:k=>{const g=new K3T.Group();k3Zet(g,k3Model('huis-q',k));return g;},
  tekenkamer:k=>{const g=new K3T.Group();k3Zet(g,k3Model('huis-k',k));return g;},
  kas:k=>{const g=new K3T.Group();const glas=k3Std('kasglas',{color:0xd8f3ff,roughness:.05,metalness:.1,transparent:true,opacity:.42});
    const romp=k3Mesh(Bx(1.6,.7,1),glas,false);romp.position.y=.35;g.add(romp);
    const d=new K3T.Shape([new K3T.Vector2(-.8,0),new K3T.Vector2(.8,0),new K3T.Vector2(0,.42)]);const dak=k3Mesh(new K3T.ExtrudeGeometry(d,{depth:1,bevelEnabled:false}),glas,false);dak.rotation.y=0;dak.position.set(0,.7,-.5);g.add(dak);
    for(let i=0;i<=4;i++){const p=k3Mesh(Bx(.03,.72,1.02),k3S('wit'));p.position.set(-.8+i*.4,.36,0);g.add(p);}
    for(let i=0;i<6;i++){const pl=k3Mesh(new K3T.IcosahedronGeometry(.12,0),k3Std('plant',{color:0x3f9a3a,roughness:.8,flatShading:true}));pl.position.set(-.6+(i%3)*.6,.15,i<3?-.22:.22);g.add(pl);}
    return g;},
  lab:k=>{const g=new K3T.Group();k3Zet(g,k3Model('pand-c',k),{x:-.3});k3Tanks(g,1,.55);return g;},
  ziekenhuis:k=>{const g=new K3T.Group();k3Zet(g,k3Model('pand-k',k));const kr=new K3T.Group();kr.add(k3Mesh(Bx(.34,.1,.04),k3S('rood'),false),k3Mesh(Bx(.1,.34,.04),k3S('rood'),false));
    const bord=k3Mesh(Bx(.46,.46,.03),k3S('wit'));kr.position.set(0,1.62,.49);bord.position.set(0,1.62,.475);g.add(bord,kr);return g;},
  campus:k=>{const g=new K3T.Group();k3Zet(g,k3Model('toren-a',k),{x:-.25,z:-.2});k3Zet(g,k3Model('pand-e',k),{x:.45,z:.75,s:.7,ry:Math.PI});return g;},
  raffinaderij:k=>{const g=new K3T.Group();k3Zet(g,k3Model('pand-d',k),{x:-.55});k3Tanks(g,4,.1);k3Schoorsteen(g,-.55,-.6,1.9);return g;},
  chemiepark:k=>{const g=new K3T.Group();k3Zet(g,k3Model('pand-l',k),{x:-.35,s:.85});k3Tanks(g,2,.55);k3Schoorsteen(g,.8,-.7,2.6);k3Schoorsteen(g,.5,-.85,2.2);return g;},
  molen:k=>{const g=new K3T.Group();const v=k3Model('hx-voet',k);v.scale.set(1.05,1.25,1.05);g.add(v);const m=k3Model('hx-midden',k);m.scale.setScalar(1);m.position.y=1.63;g.add(m);
    const d=k3Model('hx-dak',k);d.position.y=2.07;g.add(d);const w=k3Model('molen',k);w.scale.setScalar(.75);w.position.set(0,2.05,.48);w.rotation.y=Math.PI/2;g.add(w);g.userData.wieken=w;return g;},
  centrale:k=>{const g=new K3T.Group();const pts=[];for(let i=0;i<=16;i++){const y=i/16*1.8;const r=.5-.22*Math.sin(Math.PI*Math.pow(i/16,.9))+.02;pts.push(new K3T.Vector2(r,y));}
    for(const [x,z] of [[-.45,-.2],[.45,.2]]){const t=k3Mesh(new K3T.LatheGeometry(pts,32),k3Std('beton',{color:0xcfd2d6,roughness:.9,side:K3T.DoubleSide}));t.position.set(x,0,z);g.add(t);g.userData.stoom=(g.userData.stoom||[]).concat([[x,1.8,z]]);}
    const hal=k3Mesh(Bx(.8,.5,.5),k3S('wit'));hal.position.set(.5,.25,-.6);g.add(hal);return g;},
  observatorium:k=>{const g=new K3T.Group();const v=k3Model('hx-voet',k);v.scale.set(1.2,1.2,1.2);g.add(v);const m=k3Model('hx-midden',k);m.scale.setScalar(1.2);m.position.y=1.57;g.add(m);
    const d=k3Mesh(new K3T.SphereGeometry(.55,32,16,0,Math.PI*2,0,Math.PI/2),k3Std('dome',{color:0xe8ecf0,metalness:.6,roughness:.25}));d.position.y=2.1;g.add(d);
    const kier=k3Mesh(Bx(.14,.58,.9),k3S('donker'),false);kier.position.set(0,2.35,0);kier.rotation.x=-.4;g.add(kier);const kijker=k3Mesh(Cy(.07,.09,.8,12),k3S('staal'));kijker.rotation.x=-.9;kijker.position.set(0,2.55,.2);g.add(kijker);g.userData.koepel=d;return g;},
  meetpost:k=>{const g=new K3T.Group();const z=k3Model('zuil-steen',k);z.scale.set(2.2,1.1,2.2);g.add(z);const l=k3Model('lantaarn',k);l.position.set(.45,0,.3);g.add(l);
    const v=k3Model('wimpel',k);v.position.set(-.1,1.1,0);g.add(v);const t=k3Mesh(Cy(.06,.1,.5,5),k3S('staal'));t.position.set(-.45,.25,.35);g.add(t);return g;},
  rekentoren:k=>{const g=new K3T.Group();k3Zet(g,k3Model('toren-b',k));return g;},
  ziggurat:k=>{const g=new K3T.Group();for(let i=0;i<5;i++){const s=1.8-i*.36;const b=k3Mesh(Bx(s,.36,s),k3Std('zandsteen',{color:0xe0c38f,roughness:.95,flatShading:true}));b.position.y=.18+i*.36;g.add(b);}
    const top=k3Mesh(new K3T.ConeGeometry(.2,.35,4),k3Std('goud',{color:0xf2c14e,metalness:1,roughness:.25}));top.position.y=1.98;top.rotation.y=Math.PI/4;g.add(top);
    const trap=k3Mesh(Bx(.3,1.8,.9),k3Std('zandsteen',{color:0xe0c38f,roughness:.95}));trap.position.set(0,.5,.72);trap.rotation.x=-.9;g.add(trap);return g;},
  markt:k=>{const g=new K3T.Group();k3Zet(g,k3Model('kraam-rood',k),{x:-.45,z:.1,ry:.2});k3Zet(g,k3Model('kraam-groen',k),{x:.5,z:-.2,ry:-.3});k3Zet(g,k3Model('kar',k),{x:.3,z:.75,s:.8,ry:1.2});return g;},
  winkels:k=>{const g=new K3T.Group();k3Zet(g,k3Model('pand-e',k));return g;},
  bank:k=>{const g=new K3T.Group();k3Zet(g,k3Model('pand-h',k),{z:-.15});for(let i=0;i<4;i++){const c=k3Mesh(Cy(.05,.05,.7,12),k3S('wit'));c.position.set(-.3+i*.2,.35,.42);g.add(c);}const f=k3Mesh(Bx(.9,.08,.3),k3S('wit'));f.position.set(0,.74,.4);g.add(f);return g;},
  beurs:k=>{const g=new K3T.Group();k3Zet(g,k3Model('toren-c',k));return g;},
  kantoor:k=>{const g=new K3T.Group();k3Zet(g,k3Model('pand-g',k));return g;},
  fabriek:k=>{const g=new K3T.Group();const hal=k3Mesh(Bx(1.5,.55,1),k3Std('baksteen',{color:0xa65a3c,roughness:.9}));hal.position.y=.275;g.add(hal);
    for(let i=0;i<4;i++){const d=new K3T.Shape([new K3T.Vector2(0,0),new K3T.Vector2(.375,0),new K3T.Vector2(0,.3)]);const t=k3Mesh(new K3T.ExtrudeGeometry(d,{depth:1,bevelEnabled:false}),k3S('donker'));t.position.set(-.75+i*.375,.55,-.5);g.add(t);
      const gl=k3Mesh(Bx(.02,.28,.98),k3S('glas'),false);gl.position.set(-.75+i*.375+.01,.69,0);gl.rotation.z=.0;g.add(gl);}
    k3Schoorsteen(g,.55,-.3,1.9);return g;},
  hoofdkantoor:k=>{const g=new K3T.Group();k3Zet(g,k3Model('toren-e',k));return g;},
  hunebed:k=>{const g=new K3T.Group();const st=k3Std('graniet',{color:0x8f8a84,roughness:.95,flatShading:true});
    for(const [x,z,s] of [[-.55,-.3,.42],[-.55,.3,.4],[.55,-.3,.44],[.55,.3,.4],[0,-.35,.38],[0,.35,.36]]){const r=k3Mesh(new K3T.DodecahedronGeometry(s,0),st);r.scale.set(.7,1.1,.8);r.position.set(x,s*.9,z);r.rotation.set(Math.random(),Math.random(),Math.random()*.3);g.add(r);}
    const dek=k3Mesh(new K3T.DodecahedronGeometry(.6,0),st);dek.scale.set(1.9,.45,1.05);dek.position.y=1.02;g.add(dek);return g;},
  burcht:k=>{const g=new K3T.Group();const v=k3Model('kt-voet',k);v.scale.setScalar(1.1);g.add(v);const m=k3Model('kt-midden',k);m.scale.setScalar(1.1);m.position.y=1.11;g.add(m);const d=k3Model('kt-dak',k);d.scale.setScalar(1.1);d.position.y=2.22;g.add(d);
    for(const [x,z,ry] of [[-.9,.55,0],[.9,.55,0]]){const w=k3Model('muur',k);w.scale.set(.8,.55,.5);w.position.set(x,0,z);w.rotation.y=ry;g.add(w);}const vl=k3Model('vlag',k);vl.scale.setScalar(.7);vl.position.set(0,3.4,0);g.add(vl);return g;},
  stadhuis:k=>{const g=new K3T.Group();k3Zet(g,k3Model('pand-n',k));return g;},
  tempel:k=>{const g=new K3T.Group();k3Tempel(g,false);return g;},
  parlement:k=>{const g=new K3T.Group();k3Tempel(g,true);return g;},
  weerstation:k=>{const g=new K3T.Group();k3Zet(g,k3Model('huis-g',k),{x:-.25,s:.75});const mast=k3Mesh(Cy(.025,.035,1.6,8),k3S('staal'));mast.position.set(.65,.8,-.3);g.add(mast);
    const kop=new K3T.Group();kop.position.set(.65,1.6,-.3);for(let i=0;i<3;i++){const a=i/3*Math.PI*2;const arm=k3Mesh(Bx(.3,.02,.02),k3S('staal'),false);arm.position.set(Math.cos(a)*.15,0,Math.sin(a)*.15);arm.rotation.y=-a;kop.add(arm);
      const cup=k3Mesh(new K3T.SphereGeometry(.05,10,6,0,Math.PI*2,0,Math.PI/2),k3S('rood'),false);cup.position.set(Math.cos(a)*.3,0,Math.sin(a)*.3);cup.rotation.z=Math.PI/2;kop.add(cup);}g.add(kop);g.userData.draai=kop;return g;},
  vuurtoren:k=>{const g=new K3T.Group();const pts=[];for(let i=0;i<=8;i++)pts.push(new K3T.Vector2(.42-.14*i/8,i/8*2.4));
    const strepen=k3Tex(k3Canvas(64,256,(x,w,h)=>{for(let i=0;i<8;i++){x.fillStyle=i%2?'#f4f4f4':'#d23a31';x.fillRect(0,i*h/8,w,h/8);}}));
    const t=k3Mesh(new K3T.LatheGeometry(pts,32),new K3T.MeshStandardMaterial({map:strepen,roughness:.6}));g.add(t);
    const gal=k3Mesh(Cy(.38,.38,.06,24),k3S('donker'));gal.position.y=2.43;g.add(gal);const lamp=k3Mesh(Cy(.2,.2,.3,16),k3Std('lamp',{color:0xfff1b0,emissive:0xffd060,emissiveIntensity:2.5,transparent:true,opacity:.9}),false);lamp.position.y=2.62;g.add(lamp);
    const dak=k3Mesh(new K3T.ConeGeometry(.26,.3,16),k3S('rood'));dak.position.y=2.92;g.add(dak);
    const straal=new K3T.Mesh(new K3T.ConeGeometry(.35,3.2,16,1,true),new K3T.MeshBasicMaterial({color:0xfff1b0,transparent:true,opacity:.18,depthWrite:false,blending:K3T.AdditiveBlending,side:K3T.DoubleSide}));
    straal.rotation.z=Math.PI/2;straal.position.x=1.6;const as=new K3T.Group();as.position.y=2.62;as.add(straal);g.add(as);g.userData.draai=as;g.userData.straal=straal;return g;},
  haven:k=>{const g=new K3T.Group();const water=k3Mesh(Bx(1.8,.04,.9),k3Std('havenwater',{color:0x2b86c5,roughness:.1,metalness:.2}),false);water.position.set(0,.02,.45);water.receiveShadow=true;g.add(water);
    const st=k3Mesh(Bx(1.8,.18,.7),k3S('hout'));st.position.set(0,.09,-.45);g.add(st);for(let i=0;i<5;i++){const p=k3Mesh(Cy(.04,.04,.3,8),k3S('hout'));p.position.set(-.8+i*.4,.1,-.08);g.add(p);}
    k3Zet(g,k3Model('kano',k),{x:-.2,z:.45,y:.03,ry:Math.PI/2,s:1.3});for(let i=0;i<3;i++){const kr=k3Mesh(Bx(.22,.22,.22),k3Std('krat',{color:0xb07a45,roughness:.85}));kr.position.set(.4+i*.24,.29,-.55);g.add(kr);}return g;},
  wereldhaven:k=>{const g=new K3T.Group();const kade=k3Mesh(Bx(1.9,.14,1.9),k3S('steen'));kade.position.y=.07;g.add(kade);
    const kl=[0xd23a31,0x2563eb,0x16a34a,0xf59e0b,0x0f766e];for(let i=0;i<9;i++){const c=k3Mesh(Bx(.5,.22,.22),k3Std('cont'+i%5,{color:kl[i%5],roughness:.6,metalness:.3}));c.position.set(-.55+(i%3)*.55,.25+Math.floor(i/6)*.22,-.5+(Math.floor(i/3)%2)*.25);g.add(c);}
    const kr=new K3T.Group();kr.position.set(.55,0,.4);const poot=(x,z)=>{const p=k3Mesh(Bx(.06,1.8,.06),k3Std('kraan',{color:0xf2b705,roughness:.5,metalness:.4}));p.position.set(x,.9,z);kr.add(p);};poot(-.2,-.2);poot(.2,-.2);poot(-.2,.2);poot(.2,.2);
    const arm=k3Mesh(Bx(.08,.08,2),k3Std('kraan',{color:0xf2b705}));arm.position.set(0,1.8,-.2);kr.add(arm);g.add(kr);g.userData.kraan=kr;return g;},
  bibliotheek:k=>{const g=new K3T.Group();k3Zet(g,k3Model('pand-i',k));return g;},
  schouwburg:k=>{const g=new K3T.Group();k3Zet(g,k3Model('pand-m',k),{x:-.1});const b=k3Model('banier-rood',k);b.position.set(.62,.4,.2);b.scale.setScalar(1.3);g.add(b);return g;},
  station:k=>{const g=new K3T.Group();k3Zet(g,k3Model('pand-e',k),{z:-.3});const kap=k3Mesh(Bx(1.7,.05,.6),k3S('glas'),false);kap.position.set(0,.55,.55);g.add(kap);
    for(const x of [-.75,0,.75]){const p=k3Mesh(Cy(.03,.03,.55,8),k3S('staal'));p.position.set(x,.275,.8);g.add(p);}const kl=k3Mesh(Cy(.12,.12,.03,20),k3S('wit'),false);kl.rotation.x=Math.PI/2;kl.position.set(0,.8,.2);g.add(kl);return g;},
  luchthaven:k=>{const g=new K3T.Group();const hangar=k3Mesh(new K3T.CylinderGeometry(.5,.5,1.3,24,1,false,0,Math.PI),k3S('staal'));hangar.rotation.z=Math.PI/2;hangar.rotation.y=Math.PI/2;hangar.position.set(-.3,0,.1);g.add(hangar);
    const toren=k3Mesh(Cy(.12,.16,1.9,12),k3S('wit'));toren.position.set(.65,.95,-.5);g.add(toren);const kop=k3Mesh(Cy(.3,.22,.3,8),k3S('glas'));kop.position.set(.65,2,-.5);g.add(kop);const dak=k3Mesh(Cy(.32,.32,.05,8),k3S('donker'));dak.position.set(.65,2.18,-.5);g.add(dak);
    const baan=k3Mesh(Bx(.4,.02,1.9),k3S('donker'),false);baan.position.set(.65,.01,.2);baan.receiveShadow=true;g.add(baan);g.userData.radar=kop;return g;},
  zuil:k=>{const g=new K3T.Group();const v=k3Mesh(Bx(.8,.3,.8),k3S('steen'));v.position.y=.15;g.add(v);const z=k3Mesh(Cy(.18,.2,1.5,16),k3S('wit'));z.position.y=1.05;g.add(z);const c=k3Mesh(Bx(.5,.12,.5),k3S('wit'));c.position.y=1.86;g.add(c);
    const b=k3Mesh(new K3T.SphereGeometry(.14,16,10),k3Std('goud',{color:0xf2c14e,metalness:1,roughness:.25}));b.position.y=2.06;g.add(b);return g;},
  amfitheater:k=>{const g=new K3T.Group();const pts=[];for(let i=0;i<=6;i++){pts.push(new K3T.Vector2(.45+i*.14,i*.1));pts.push(new K3T.Vector2(.45+(i+1)*.14,i*.1));}pts.push(new K3T.Vector2(1.43,0));
    const a=k3Mesh(new K3T.LatheGeometry(pts.map(p=>new K3T.Vector2(p.x,p.y)),40,0,Math.PI*1.3),k3Std('zandsteen2',{color:0xe8d3a8,roughness:.9,side:K3T.DoubleSide}));a.rotation.y=Math.PI*.85;g.add(a);
    const podium=k3Mesh(Cy(.45,.45,.06,32),k3S('hout'));podium.position.y=.03;g.add(podium);return g;},
  serverkast:k=>{const g=new K3T.Group();for(let i=0;i<3;i++){const s=k3Mesh(Bx(.4,.9,.5),k3S('donker'));s.position.set(-.45+i*.45,.45,0);g.add(s);for(let j=0;j<5;j++){const l=k3Mesh(Bx(.3,.02,.01),k3S('led'),false);l.position.set(-.45+i*.45,.2+j*.14,.26);g.add(l);}}g.userData.leds=true;return g;},
  codehub:k=>{const g=new K3T.Group();k3Zet(g,k3Model('pand-f',k));return g;},
  datacenter:k=>{const g=new K3T.Group();const b=k3Mesh(Bx(1.7,.8,1.2),k3S('donker'));b.position.y=.4;g.add(b);for(let i=0;i<6;i++){const l=k3Mesh(Bx(.02,.5,.02),k3S('led'),false);l.position.set(-.7+i*.28,.4,.61);g.add(l);}
    for(let i=0;i<4;i++){const f=k3Mesh(Cy(.13,.13,.08,16),k3S('staal'));f.position.set(-.55+i*.37,.84,0);g.add(f);}return g;},
  ailab:k=>{const g=new K3T.Group();k3Zet(g,k3Model('toren-d',k));const ring=k3Mesh(new K3T.TorusGeometry(.95,.03,8,48),k3S('led'),false);ring.rotation.x=Math.PI/2;ring.position.y=3;g.add(ring);g.userData.ring=ring;return g;},
};
function k3Gebouw(recept,kleur,tier){
  const f=K3R[recept]||K3R.hut;const g=f(kleur);const bb=new K3T.Box3().setFromObject(g);const sz=bb.getSize(new K3T.Vector3());
  const s=Math.min(1.9/Math.max(sz.x,sz.z,.01),K3_HMAX[tier]/Math.max(sz.y,.01),1.9);
  const w=new K3T.Group();g.scale.multiplyScalar(s);const c=bb.getCenter(new K3T.Vector3()).multiplyScalar(s);g.position.set(-c.x,-bb.min.y*s,-c.z);w.add(g);w.userData=g.userData;w.userData.h=sz.y*s;return w;
}

// ── Eiland ──────────────────────────────────────────────────────────────
function k3GrasTex(wd){
  const P=24,W=wd.W+2,H=wd.H+2;
  return k3Canvas(W*P,H*P,(g,w,h)=>{const R=k3Rnd(7);g.fillStyle='#6fae47';g.fillRect(0,0,w,h);
    for(let i=0;i<W*H*55;i++){const x=R()*w,y=R()*h;g.fillStyle=`hsla(${85+R()*35},${40+R()*25}%,${R()<.5?28+R()*10:45+R()*14}%,${.25+R()*.35})`;g.fillRect(x,y,1.3,2+R()*3);}
    // Zandpaden tussen de wijken.
    g.lineCap='round';const pad=(x0,y0,x1,y1)=>{g.strokeStyle='rgba(70,52,26,.35)';g.lineWidth=P*.95;g.beginPath();g.moveTo(x0*P,y0*P);g.lineTo(x1*P,y1*P);g.stroke();g.strokeStyle='#d8c090';g.lineWidth=P*.75;g.stroke();};
    const kol=4,rij=Math.round((wd.H-1)/5);
    for(let c=0;c<=kol;c++)pad(1+c*5+.5,1.5,1+c*5+.5,H-1.5);for(let r=0;r<=rij;r++)pad(1.5,1+r*5+.5,W-1.5,1+r*5+.5);
    for(let i=0;i<2600;i++){const x=R()*w,y=R()*h;const d=g.getImageData(x|0,y|0,1,1).data;if(d[0]>180&&d[1]>160){g.fillStyle=`rgba(${R()<.5?110:255},${R()<.5?85:240},${R()<.5?50:210},.4)`;g.beginPath();g.arc(x,y,.8+R()*1.6,0,7);g.fill();}}});
}
function k3Eiland(wd){
  const T=K3T;const g=new T.Group();const W=wd.W+2,H=wd.H+2;const r=2.2;
  const sh=new T.Shape();const x0=-W/2,z0=-H/2;sh.moveTo(x0+r,z0);sh.lineTo(x0+W-r,z0);sh.quadraticCurveTo(x0+W,z0,x0+W,z0+r);sh.lineTo(x0+W,z0+H-r);sh.quadraticCurveTo(x0+W,z0+H,x0+W-r,z0+H);sh.lineTo(x0+r,z0+H);sh.quadraticCurveTo(x0,z0+H,x0,z0+H-r);sh.lineTo(x0,z0+r);sh.quadraticCurveTo(x0,z0,x0+r,z0);
  // Grasdek.
  const topG=new T.ShapeGeometry(sh,24);topG.rotateX(Math.PI/2);const uv=topG.attributes.uv,pos=topG.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,(pos.getX(i)-x0)/W,1-(pos.getZ(i)-z0)/H);
  const top=new T.Mesh(topG,new T.MeshStandardMaterial({map:k3Tex(k3GrasTex(wd)),roughness:.95,side:T.DoubleSide}));top.receiveShadow=true;g.add(top);
  // Rand en rotsbodem: ringen van de omtrek die naar beneden toe smaller worden.
  const omtrek=sh.getSpacedPoints(120);omtrek.pop();g.add(k3Bodem(omtrek,9,3));
  // Waterval aan de voorkant.
  const wt=k3Canvas(64,256,(x,w,h)=>{const r=k3Rnd(4);x.fillStyle='rgba(180,225,255,.75)';x.fillRect(0,0,w,h);for(let i=0;i<60;i++){x.fillStyle=`rgba(255,255,255,${.3+r()*.5})`;x.fillRect(r()*w,r()*h,1+r()*2,10+r()*40);}});
  const wtx=k3Tex(wt,[1,2]);const val=new T.Mesh(new T.PlaneGeometry(1.4,7),new T.MeshBasicMaterial({map:wtx,transparent:true,opacity:.85,depthWrite:false}));
  val.position.set(W*.12,-3.55,H/2+.05);g.add(val);K3.ticks.push((dt,t)=>{wtx.offset.y=(t*.9)%1;});
  const beek=new T.Mesh(new T.PlaneGeometry(1.4,2.2),new T.MeshStandardMaterial({color:0x3a93d0,roughness:.05,metalness:.2}));beek.rotation.x=-Math.PI/2;beek.position.set(W*.12,.015,H/2-1.1);g.add(beek);
  return g;
}
function k3Wolken(){const T=K3T;const tex=k3Tex(k3Canvas(128,128,(g)=>{const R=k3Rnd(9);for(let i=0;i<22;i++){const x=30+R()*68,y=40+R()*48,r=16+R()*26;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.95)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);}}));
  const grp=new T.Group();const R=k3Rnd(12);
  for(let i=0;i<22;i++){const m=new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false,opacity:K3.nacht?.25:.9});const s=new T.Sprite(m);const a=R()*Math.PI*2,d=24+R()*16;s.position.set(Math.cos(a)*d,-9-R()*10,Math.sin(a)*d);s.scale.setScalar(9+R()*9);m.opacity=K3.nacht?.2:.7;s.userData.v=.2+R()*.4;grp.add(s);}
  K3.ticks.push((dt)=>{for(const s of grp.children){s.position.x+=s.userData.v*dt;if(s.position.x>40)s.position.x=-40;}});return grp;}

// ── Wijken ──────────────────────────────────────────────────────────────
function k3Wx(gx){return gx-KD.wereld.W/2;}function k3Wz(gy){return gy-KD.wereld.H/2;}
function k3Wijk(w,nieuw){
  const T=K3T;const g=new T.Group();const x=k3Wx(w.gx),z=k3Wz(w.gy);g.position.set(x,0,z);
  if(w.toren)return k3Toren(g,KD.wereld.totaal);
  const kleur=w.kleur;const plot=k3Mesh(Bx(4.1,.1,4.1),k3Std('plot',{color:0x7cbd52,roughness:.95}),false);plot.position.set(2,.05,2);plot.receiveShadow=true;g.add(plot);
  const randM=k3Mat('rand'+kleur,()=>new T.MeshStandardMaterial({color:kleur,roughness:.5}));
  for(const [px,pz,sx,sz] of [[2,-.02,4.14,.1],[2,4.02,4.14,.1],[-.02,2,.1,4.14],[4.02,2,.1,4.14]]){const r=k3Mesh(Bx(sx,.16,sz),randM);r.position.set(px,.08,pz);g.add(r);}
  // Vlag in de vakkleur op de hoek.
  const paal=k3Mesh(Cy(.03,.03,1.4,8),k3S('staal'));paal.position.set(3.9,.7,3.9);g.add(paal);
  const vlag=new T.Mesh(new T.PlaneGeometry(.55,.34,6,2),k3Mat('vlag'+kleur,()=>new T.MeshStandardMaterial({color:kleur,roughness:.8,side:T.DoubleSide})));vlag.geometry.translate(.275,0,0);vlag.position.set(3.9,1.22,3.9);vlag.castShadow=true;g.add(vlag);
  vlag.userData.basis=vlag.geometry.attributes.position.array.slice();K3.vlaggen.push(vlag);
  const thema=kdThema(w.vak.id);
  [3,2,1,0].forEach(t=>{const sl=KD_SLOT[t];const cx=sl[0]+1,cz=sl[1]+1;
    if(t<w.gebouwd){const b=k3Gebouw(thema[t][0],kleur,t);b.position.set(cx,.1,cz);b.rotation.y=t===0||t===1?0:0;g.add(b);k3Leven(b);
      if(nieuw&&nieuw.vak===w.vak.id&&nieuw.t===t)k3Rijs(b,g);}
    else if(t<w.gebouwd+w.klaar){const f=k3Mesh(Bx(1.6,.06,1.6),k3Std('fund',{color:0xd6c7a6,roughness:.9}));f.position.set(cx,.13,cz);g.add(f);
      const mk=k3Mesh(new T.OctahedronGeometry(.28),k3Std('marker',{color:0xfcd34d,emissive:0xf59e0b,emissiveIntensity:1.2,metalness:.3,roughness:.3}),false);mk.position.set(cx,1.1,cz);mk.scale.y=1.5;g.add(mk);
      const ring=new T.Mesh(new T.RingGeometry(.55,.72,32),new T.MeshBasicMaterial({color:0xfcd34d,transparent:true,opacity:.6,depthWrite:false,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(cx,.17,cz);g.add(ring);
      K3.ticks.push((dt,tt)=>{mk.rotation.y+=dt*1.6;mk.position.y=1.1+Math.sin(tt*2.4+cx)*.12;ring.scale.setScalar(1+Math.sin(tt*3)*.08);});}
    else{const R=k3Rnd(cx*7+cz*13+w.gx);const f=k3Mesh(Bx(1.6,.03,1.6),k3Std('leeg',{color:0x6ea74a,roughness:1}),false);f.position.set(cx,.115,cz);f.receiveShadow=true;g.add(f);
      const dec=[['struik',2],['bloem-geel',1.8],['gras',2],['bloem-rood',1.7],['bloem-paars',1.7],['dennetje',.75],['eik',.9]];for(let i=0;i<4;i++){const [nm,sc]=dec[Math.floor(R()*dec.length)];const m=k3Model(nm);m.scale.setScalar(sc);m.position.set(cx+(R()-.5)*1.2,.12,cz+(R()-.5)*1.2);m.rotation.y=R()*6;g.add(m);}}});
  // Klikvlak.
  const hit=new T.Mesh(Bx(4.2,3.5,4.2),new T.MeshBasicMaterial({visible:false}));hit.position.set(2,1.7,2);hit.userData.wijk=w.vak.id;g.add(hit);K3.hits.push(hit);
  return g;
}
function k3Toren(g,b){
  const T=K3T;const plein=k3Mesh(Bx(4.1,.1,4.1),k3Std('plein',{color:0xd9ccb0,roughness:.9}),false);plein.position.set(2,.05,2);plein.receiveShadow=true;g.add(plein);
  const muur=kdWonderAan('muur',b),groot=kdWonderAan('kasteel',b);
  const verd=1+Math.min(4,Math.floor(b/8))+(groot?2:0);const S=groot?1.3:1.15;const t=new T.Group();t.position.set(2,.1,2);g.add(t);
  const v=k3Model('kt-voet');v.scale.setScalar(S);t.add(v);for(let i=0;i<verd;i++){const m=k3Model('kt-midden');m.scale.setScalar(S);m.position.y=1.01*S*(i+1);t.add(m);}
  const d=k3Model('kt-dak');d.scale.setScalar(S);d.position.y=1.01*S*(verd+1);t.add(d);const vl=k3Model('vlag');vl.scale.setScalar(.8);vl.position.y=1.01*S*(verd+1)+1.3*S;t.add(vl);
  const f=k3Model('fontein');f.scale.setScalar(muur?.6:.8);f.position.set(2,.1,muur?3.25:3.55);g.add(f);
  if(!muur)for(const [x,z] of [[.4,.4],[3.6,.4],[.4,3.6],[3.6,3.6]]){const l=k3Model('lantaarn');l.scale.setScalar(.7);l.position.set(x,.1,z);g.add(l);K3.lantaarns.push(l);}
  if(muur){// Stadsmuur met een poortopening aan de voorkant.
    for(const i of [1,2,3])for(const [x,z,ry] of [[i,.15,0],[i,3.85,0],[.15,i,Math.PI/2],[3.85,i,Math.PI/2]]){if(z===3.85&&i===2)continue;const m=k3Model('muur');m.scale.set(1,.72,.6);m.position.set(x,.1,z);m.rotation.y=ry;g.add(m);}
    if(groot)k3Kasteeltorens(g);else for(const [x,z] of [[.15,.15],[3.85,.15],[.15,3.85],[3.85,3.85]]){const t=k3Model('muur-toren');t.scale.setScalar(.72);t.position.set(x,.1,z);g.add(t);}
    for(const x of [1.45,2.55]){const l=k3Model('lantaarn');l.scale.setScalar(.55);l.position.set(x,.1,4.2);g.add(l);K3.lantaarns.push(l);}}
  const hit=new T.Mesh(Bx(4.2,5,4.2),new T.MeshBasicMaterial({visible:false}));hit.position.set(2,2.5,2);hit.userData.wijk='_toren';g.add(hit);K3.hits.push(hit);
  return g;
}
// Leven in de gebouwen: wieken draaien, rook, knipperende leds.
function k3Leven(b){const u=b.userData;const T=K3T;
  if(u.wieken)K3.ticks.push(dt=>{u.wieken.rotation.x+=dt*1.2;});
  if(u.draai)K3.ticks.push(dt=>{u.draai.rotation.y+=dt*(u.straal?1.1:4);if(u.straal)u.straal.material.opacity=K3.nacht?.3:.1;});
  if(u.ring)K3.ticks.push((dt,t)=>{u.ring.rotation.z+=dt*.6;u.ring.position.y=u.ring.position.y;});
  if(u.kraan)K3.ticks.push((dt,t)=>{u.kraan.rotation.y=Math.sin(t*.4)*.6;});
  for(const [x,y,z] of (u.rook||[]).concat(u.stoom||[])){let tv=Math.random();const stoom=!!(u.stoom&&u.stoom.some(s=>s[0]===x&&s[2]===z));
    K3.ticks.push(dt=>{tv+=dt;if(tv<(stoom?.25:.4)||!b.parent)return;tv=0;const p=new T.Vector3(x,y,z).applyMatrix4(b.children[0].matrixWorld);k3Deeltje(p,stoom?0xffffff:0x9a9a9a,stoom?.6:.35,stoom?2.6:2.2);});}
}
const _k3Rook={};function k3RookTex(){return _k3Rook.t||(_k3Rook.t=k3Tex(k3Canvas(64,64,(g)=>{const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,.7)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);})));}
function k3Deeltje(p,kleur,maat,dur,v){const T=K3T;const m=new T.SpriteMaterial({map:k3RookTex(),color:kleur,transparent:true,depthWrite:false,opacity:.6});const s=new T.Sprite(m);s.position.copy(p);s.scale.setScalar(maat);K3.sc.add(s);
  const vv=v||new T.Vector3((Math.random()-.5)*.2,.5+Math.random()*.3,(Math.random()-.5)*.2);
  K3.fx.push({t:0,dur,upd:q=>{s.position.addScaledVector(vv,1/60);s.scale.setScalar(maat*(1+q*2.2));m.opacity=.6*(1-q);},weg:()=>{K3.sc.remove(s);m.dispose();}});}
// Het bouwmoment: het gebouw komt uit de grond met stof en vonken.
function k3Rijs(b,g){const T=K3T;const h=b.userData.h||2;const y0=b.position.y;b.position.y=y0-h;b.scale.set(.9,.9,.9);
  const p=new T.Vector3();K3.fx.push({t:0,dur:1.3,upd:q=>{const e=q<.8?1-Math.pow(1-q/.8,3):1;b.position.y=y0-h*(1-e)+Math.sin(Math.min(1,q/.8)*Math.PI)*.08;const s=.9+.1*e+(q>.8?Math.sin((q-.8)/.2*Math.PI)*.05:0);b.scale.set(s,s,s);
    if(Math.random()<.5){b.getWorldPosition(p);k3Deeltje(p.clone().add(new T.Vector3((Math.random()-.5)*1.8,.1,(Math.random()-.5)*1.8)),0xd8c8a8,.7,1.1,new T.Vector3((Math.random()-.5)*1.2,.4,(Math.random()-.5)*1.2));}},
    weg:()=>{b.position.y=y0;b.scale.set(1,1,1);b.getWorldPosition(p);for(let i=0;i<16;i++)k3Deeltje(p.clone().add(new T.Vector3(0,h*.6,0)),0xffe9a8,.25,.8,new T.Vector3((Math.random()-.5)*3,1+Math.random()*2,(Math.random()-.5)*3));K3.schud=.2;}});
}

// ── Wonderen en leven: wat het eiland grootser maakt ────────────────────
// Rotsbodem onder een omtrek (lijst Vector2): ringen die naar beneden smaller worden.
function k3Bodem(omtrek,D,seed,ringen){
  const T=K3T;const N=omtrek.length,RINGEN=ringen||9;const R=k3Rnd(seed);const v=[],kl=[],idx=[];const kol=new T.Color();
  for(let k=0;k<=RINGEN;k++){const f=k/RINGEN;const krimp=k<=1?1:Math.pow(1-(f-.1)/.9,1.25)*.97;const y=k===0?0:k===1?-.35:-.35-(f-.11)*D;
    for(let i=0;i<N;i++){const p=omtrek[i];const ruis=k<2?0:(R()-.5)*.55*(1-f*.4)*Math.min(1,D/6);v.push(p.x*krimp+ruis,y+(k>1?(R()-.5)*.35*Math.min(1,D/6):0),p.y*krimp+ruis);
      if(k<=1)kol.set(k===0?0x4f8a35:0x5d4128);else{kol.set(f<.3?0x7a5634:f<.55?0x8b7a66:0x6b6660);kol.offsetHSL(0,0,(R()-.5)*.08);}kl.push(kol.r,kol.g,kol.b);}}
  v.push(0,-.35-D*.95,0);kl.push(.35,.33,.31);const tip=(RINGEN+1)*N;
  for(let k=0;k<RINGEN;k++)for(let i=0;i<N;i++){const a=k*N+i,b=k*N+(i+1)%N,c=(k+1)*N+i,d=(k+1)*N+(i+1)%N;idx.push(a,c,b,b,c,d);}
  for(let i=0;i<N;i++)idx.push(RINGEN*N+i,tip,RINGEN*N+(i+1)%N);
  const bg=new T.BufferGeometry();bg.setAttribute('position',new T.Float32BufferAttribute(v,3));bg.setAttribute('color',new T.Float32BufferAttribute(kl,3));bg.setIndex(idx);bg.computeVertexNormals();
  const m=new T.Mesh(bg,k3Mat('bodem',()=>new T.MeshStandardMaterial({vertexColors:true,roughness:.95,flatShading:true,side:T.DoubleSide})));m.castShadow=true;return m;
}
// Klein rond eiland (buiteneiland of zwevende rots).
function k3Eilandje(r,D,seed){
  const T=K3T;const g=new T.Group();const R=k3Rnd(seed);const N=Math.max(14,Math.round(r*12));const pts=[];
  for(let i=0;i<N;i++){const a=i/N*Math.PI*2;const rr=r*(1+(R()-.5)*.16);pts.push(new T.Vector2(Math.cos(a)*rr,Math.sin(a)*rr));}
  const geo=new T.ShapeGeometry(new T.Shape(pts));geo.rotateX(Math.PI/2);
  const top=new T.Mesh(geo,k3Mat('grasje',()=>new T.MeshStandardMaterial({color:0x6aa845,roughness:.95,side:T.DoubleSide})));top.receiveShadow=true;g.add(top);
  g.add(k3Bodem(pts,D,seed+1,6));return g;
}
function k3Paden(wd){const kol=4,rij=Math.round((wd.H-1)/5);return {kol,rij,X:c=>c*5+.5-wd.W/2,Z:r=>r*5+.5-wd.H/2};}
// Inwoners wandelen van kruispunt naar kruispunt.
function k3Inwoners(wd){
  const T=K3T;const n=Math.min(18,2+Math.floor(wd.totaal/3));const P=k3Paden(wd);
  const clip=nm=>K3.glb.animations.find(a=>a.name==='burger|'+nm);const cw=clip('walk'),ci=clip('idle');if(!cw||!ci)return;
  const soorten=['burger-a','burger-b','burger-c','burger-d','burger-e'];const R=k3Rnd(21+wd.totaal);
  for(let i=0;i<n;i++){const src=K3.glb.scenes.find(s=>s.name===soorten[i%soorten.length]);if(!src)continue;
    const m=K3.SU.clone(src);m.traverse(o=>{o.name=o.name.replace(/_\d+$/,'');if(o.isMesh){o.castShadow=true;o.frustumCulled=false;}});m.scale.setScalar(.72);
    const g=new T.Group();g.add(m);K3.sc.add(g);
    const mix=new T.AnimationMixer(m);const aw=mix.clipAction(cw),ai=mix.clipAction(ci);ai.play();mix.update(R()*2);
    const st={c:Math.floor(R()*(P.kol+1)),r:Math.floor(R()*(P.rij+1)),t:0,dur:1,wacht:.3+R()*4,loopt:false};st.nc=st.c;st.nr=st.r;
    const zij=(i%2?1:-1)*.14;g.position.set(P.X(st.c)+zij,.02,P.Z(st.r)+zij);g.rotation.y=R()*6;
    const kies=()=>{const o=[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>st.c+a>=0&&st.c+a<=P.kol&&st.r+b>=0&&st.r+b<=P.rij);const [a,b]=o[Math.floor(Math.random()*o.length)];
      st.nc=st.c+a;st.nr=st.r+b;st.t=0;st.dur=5/(.42+Math.random()*.12);if(!st.loopt){st.loopt=true;ai.fadeOut(.25);aw.reset().fadeIn(.25).play();}};
    K3.ticks.push(dt=>{mix.update(dt);if(K3.stil)return;
      if(st.wacht>0){st.wacht-=dt;if(st.wacht<=0)kies();return;}
      st.t+=dt;const p=Math.min(1,st.t/st.dur);const x0=P.X(st.c),z0=P.Z(st.r),x1=P.X(st.nc),z1=P.Z(st.nr);
      g.position.set(x0+(x1-x0)*p+zij,.02,z0+(z1-z0)*p+zij);const doel=Math.atan2(x1-x0,z1-z0);let d=doel-g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));g.rotation.y+=d*Math.min(1,dt*8);
      if(p>=1){st.c=st.nc;st.r=st.nr;if(Math.random()<.3){st.wacht=1.5+Math.random()*3;st.loopt=false;aw.fadeOut(.25);ai.reset().fadeIn(.25).play();}else kies();}});
    if(i===0)K3.wonderPos.inwoners=new T.Vector3(P.X(st.c),.3,P.Z(st.r));}
}
function k3Lantaarns(wd){const P=k3Paden(wd);
  for(let c=0;c<=P.kol;c++)for(let r=0;r<=P.rij;r++){const l=k3Model('lantaarn');l.scale.setScalar(.55);l.position.set(P.X(c)+.38,.02,P.Z(r)+.38);K3.sc.add(l);K3.lantaarns.push(l);}
  K3.wonderPos.lantaarns=new K3T.Vector3(0,0,0);}
// Buiteneiland achter het hoofdeiland, met een brug over de leegte.
function k3Buiteneiland(wd){
  const T=K3T;const r=3.1,gap=3.2;const cx=wd.W*.18,cz=-wd.H/2-1-gap-r+.4;const g=k3Eilandje(r,5.5,77);g.position.set(cx,0,cz);K3.sc.add(g);
  const vijver=new T.Mesh(new T.CircleGeometry(1,28),k3Std('water',{color:0x3a93d0,roughness:.05,metalness:.2}));vijver.rotation.x=-Math.PI/2;vijver.position.set(-.9,.02,.5);g.add(vijver);
  const kano=k3Model('kano');kano.scale.setScalar(.9);kano.position.set(-.9,.03,.5);kano.rotation.y=.6;g.add(kano);K3.ticks.push((dt,t)=>{kano.position.y=.03+Math.sin(t*1.6)*.015;kano.rotation.z=Math.sin(t*1.3)*.04;});
  const wm=k3Model('watermolen');wm.scale.setScalar(1.2);wm.position.set(.9,0,-.5);wm.rotation.y=-Math.PI/2;g.add(wm);
  const zet=(nm,x,z,s,ry)=>{const m=k3Model(nm);m.scale.setScalar(s);m.position.set(x,0,z);m.rotation.y=ry||0;g.add(m);return m;};
  zet('kraam-rood',-1.6,-1,.8,.8);zet('kraam-groen',-.3,-1.9,.8,.2);zet('eik',2,1.3,1.4,1);zet('den',-2.2,1.2,1.6);zet('den',.2,2.3,1.3,2);zet('struik',1.4,-2,1.8);zet('bloem-geel',-1.8,.2,1.8);zet('lantaarn',.5,.9,.55);
  K3.lantaarns.push(g.children[g.children.length-1]);
  // Brug: planken op pijlers, van rand naar rand.
  const z0=-wd.H/2-1+.1,z1=cz+r-.25;const n=Math.ceil((z0-z1)/.93);const L=(z0-z1)/n;
  for(let i=0;i<n;i++){const b=k3Model('brug');b.scale.set(1,1,L/.93);b.position.set(cx,-.02,z0-L*(i+.5));K3.sc.add(b);}
  K3.wonderPos.haven=new T.Vector3(cx,.3,cz+1);
}
// Luchtballonnen in de vakkleuren.
function k3Ballonnen(wd){
  const T=K3T;const kl=wd.wijken.map(w=>w.kleur);const Rr=Math.hypot(wd.W,wd.H)/2;
  for(let i=0;i<3;i++){const a=kl[(i*3)%kl.length],b=kl[(i*3+1)%kl.length];
    const tex=k3Tex(k3Canvas(256,128,(g,w,h)=>{for(let s=0;s<12;s++){g.fillStyle=s%2?a:(s%4?'#fff7e6':b);g.fillRect(s*w/12,0,w/12+1,h);}g.fillStyle='rgba(0,0,0,.12)';g.fillRect(0,h*.86,w,h*.14);}));
    const bol=k3Mesh(new T.SphereGeometry(.85,24,16),new T.MeshStandardMaterial({map:tex,roughness:.6}));bol.scale.y=1.18;
    const hals=k3Mesh(new T.CylinderGeometry(.34,.16,.4,16,1,true),new T.MeshStandardMaterial({map:tex,roughness:.6,side:T.DoubleSide}));hals.position.y=-1.08;
    const mand=k3Mesh(Bx(.32,.24,.32),k3S('hout'));mand.position.y=-1.62;const g=new T.Group();g.add(bol,hals,mand);
    for(const [x,z] of [[-.13,-.13],[.13,-.13],[-.13,.13],[.13,.13]]){const t=new T.Mesh(Cy(.008,.008,.42,4),k3S('donker'));t.position.set(x*1.4,-1.36,z*1.4);g.add(t);}
    const vlam=new T.Sprite(new T.SpriteMaterial({map:k3RookTex(),color:0xffa040,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:0}));vlam.scale.setScalar(.5);vlam.position.y=-1.3;g.add(vlam);
    K3.sc.add(g);const R=Rr*(.75+i*.18),h=5.5+i*1.4,f=.035-.008*i;let hoek=i*2.1;
    K3.ticks.push((dt,t)=>{if(!K3.stil)hoek+=dt*f;g.position.set(Math.cos(hoek)*R,h+Math.sin(t*.5+i)*.35,Math.sin(hoek)*R);g.rotation.y=-hoek;
      vlam.material.opacity=(K3.nacht?.9:.5)*Math.max(0,Math.sin(t*1.7+i*2));});
    if(i===0)K3.wonderPos.ballon={clone:()=>g.position.clone().setY(2)};}
}
// Het grote kasteel: vier torens en vuurwerk als het avond is.
function k3Vuurwerk(p){const T=K3T;if(!K3.on||!K3.sc)return;const kl=[0xffd54a,0xff5a7a,0x6ad7ff,0x9dff7a,0xd08bff][Math.floor(Math.random()*5)];
  for(let i=0;i<34;i++){const m=new T.SpriteMaterial({map:k3RookTex(),color:kl,transparent:true,depthWrite:false,blending:T.AdditiveBlending});const s=new T.Sprite(m);s.position.copy(p);s.scale.setScalar(.35);K3.sc.add(s);
    const v=new T.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().multiplyScalar(2.2+Math.random()*.8);
    K3.fx.push({t:0,dur:1.5,upd:(q,dt)=>{v.y-=dt*1.6;v.multiplyScalar(Math.exp(-dt*1.4));s.position.addScaledVector(v,dt||1/60);m.opacity=1-q*q;s.scale.setScalar(.35*(1-q*.6));},weg:()=>{K3.sc.remove(s);m.dispose();}});}}
function k3Kasteeltorens(g){
  for(const [x,z] of [[.15,.15],[3.85,.15],[.15,3.85],[3.85,3.85]]){const t=new K3T.Group();t.position.set(x,.1,z);g.add(t);const S=.95;
    const v=k3Model('hx-voet');v.scale.setScalar(S);t.add(v);let y=1.31*S;for(let i=0;i<3;i++){const m=k3Model('hx-midden');m.scale.setScalar(S);m.position.y=y;t.add(m);y+=.46*S;}
    const d=k3Model('hx-dak');d.scale.setScalar(S);d.position.y=y;t.add(d);const w=k3Model('wimpel');w.scale.setScalar(.8);w.position.y=y+.8*S;t.add(w);}
}
// Zwevende rotsjes rondom en een wolkenzee diep onder het eiland.
function k3Omgeving(wd){
  const T=K3T;const R=k3Rnd(31);const Rr=Math.hypot(wd.W,wd.H)/2;const haven=kdWonderAan('haven');
  const plek=[[2.4,5.5,1.4],[3.3,4,-1.5],[.9,6.5,-3],[4.6,5,1],[5.5,7,-2.2],[-.4,8,.6]];
  plek.forEach(([a,d,y],i)=>{if(haven&&a>3.9&&a<5.3)return;const r=.6+R()*.9;const g=k3Eilandje(r,1.8+r*1.6,90+i);const x=Math.cos(a)*(Rr+d),z=Math.sin(a)*(Rr+d);g.position.set(x,y,z);K3.sc.add(g);
    const nm=['den','eik','rots-breed','dennetje','den','steen'][i];const m=k3Model(nm);m.scale.setScalar(nm==='rots-breed'?.5:.9+r*.4);g.add(m);
    const f=.4+R()*.4,ph=R()*6;K3.ticks.push((dt,t)=>{g.position.y=y+Math.sin(t*f+ph)*.25;});});
  const tex=k3Tex(k3Canvas(256,256,(g)=>{const Rn=k3Rnd(44);for(let i=0;i<70;i++){const x=Rn()*256,y=Rn()*256,r=20+Rn()*40;for(const [dx,dy] of [[0,0],[256,0],[-256,0],[0,256],[0,-256]]){const gr=g.createRadialGradient(x+dx,y+dy,0,x+dx,y+dy,r);gr.addColorStop(0,'rgba(255,255,255,.5)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(x+dx-r,y+dy-r,r*2,r*2);}}}),[5,5]);
  const zee=new T.Mesh(new T.PlaneGeometry(220,220),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,opacity:K3.nacht?.22:.75,color:K3.nacht?0x8090c0:0xffffff}));zee.rotation.x=-Math.PI/2;zee.position.y=-17;zee.renderOrder=-1;K3.sc.add(zee);
  K3.ticks.push(dt=>{tex.offset.x+=dt*.004;});
  // Vogels (niet 's nachts).
  if(!K3.nacht){const vm=k3Std('vogel',{color:0x2b2f38,roughness:.8,side:T.DoubleSide});const vg=new T.Group();K3.sc.add(vg);const vs=[];
    for(let i=0;i<7;i++){const b=new T.Group();const vleugel=s=>{const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([0,0,-.06,0,0,.08,s*.32,0,-.02],3));geo.computeVertexNormals();const m=new T.Mesh(geo,vm);b.add(m);return m;};
      const l=vleugel(-1),r=vleugel(1);const lijf=new T.Mesh(new T.ConeGeometry(.035,.2,5),vm);lijf.rotation.x=Math.PI/2;b.add(lijf);
      const k=Math.ceil(i/2)*(i%2?1:-1);b.position.set(k*.45,Math.abs(k)*.05,-Math.abs(k)*.4);vg.add(b);vs.push([l,r,Math.random()*6]);}
    let hoek=0;const RR=Rr*.9;K3.ticks.push((dt,t)=>{if(!K3.stil)hoek+=dt*.09;vg.position.set(Math.cos(hoek)*RR,7.5+Math.sin(t*.3)*.6,Math.sin(hoek)*RR);vg.rotation.y=-hoek+Math.PI;
      for(const [l,r,f] of vs){const a=Math.sin(t*9+f)*.7;l.rotation.z=a;r.rotation.z=-a;}});}
}
function k3Wonderen(wd){
  K3.wonderPos=K3.wonderPos||{};
  const tw=K3.wg&&K3.wg._toren;if(tw)K3.wonderPos.muur=K3.wonderPos.kasteel=tw.position.clone().add(new K3T.Vector3(2,.5,2));
  k3Omgeving(wd);
  if(kdWonderAan('inwoners'))k3Inwoners(wd);
  if(kdWonderAan('lantaarns'))k3Lantaarns(wd);
  if(kdWonderAan('haven'))k3Buiteneiland(wd);
  if(kdWonderAan('ballon'))k3Ballonnen(wd);
  if(kdWonderAan('kasteel')&&(K3.nacht||kdDagdeel()==='avond')&&tw){let v=2;K3.ticks.push(dt=>{v-=dt;if(v>0||K3.stil)return;v=2.2+Math.random()*2.5;k3Vuurwerk(tw.position.clone().add(new K3T.Vector3(2+(Math.random()-.5)*5,6.5+Math.random()*2.5,2+(Math.random()-.5)*5)));});}
}

// ── Scène, licht en lus ─────────────────────────────────────────────────
const K3_LICHT={ochtend:{zon:0xffd6b0,i:2.1,hemi:[0xffe8d6,0x5a6a48,.8],pos:[-14,10,10]},dag:{zon:0xfff4e0,i:2.7,hemi:[0xdfeeff,0x55703a,.85],pos:[-10,22,12]},
  avond:{zon:0xffa060,i:1.8,hemi:[0xffc9a0,0x3b3a55,.65],pos:[16,8,10]},nacht:{zon:0x9fb6ff,i:.55,hemi:[0x3b4a8a,0x111522,.45],pos:[8,20,-6]}};
function k3Start(){
  const T=K3T;const kaart=document.getElementById('kd-kaart');const st=document.getElementById('kd-stage');if(!kaart||!st)return;
  const r=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});const mob=matchMedia('(pointer:coarse)').matches||innerWidth<700;
  r.setPixelRatio(Math.min(devicePixelRatio||1,mob?1.5:2));r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.05;r.setClearColor(0,0);
  r.domElement.className='kd-canvas';kaart.appendChild(r.domElement);K3.r=r;
  K3.cam=new T.PerspectiveCamera(32,1,.3,300);K3.doel=new T.Vector3();K3.rDoel=new T.Vector3();K3.on=true;K3.stil=matchMedia('(prefers-reduced-motion: reduce)').matches;K3.invoer=0;K3.fx=[];K3.ticks=[];K3.t=0;K3.schud=0;
  st.classList.add('kd-3d');k3Bouw();k3Maat();k3Bind();
  K3.ro=new ResizeObserver(()=>k3Maat());K3.ro.observe(kaart);
  kdOverzicht(true);
  K3.vorige=0;const lus=nu=>{if(!K3.on)return;K3.raf=requestAnimationFrame(lus);if(document.hidden){K3.vorige=nu;return;}const dt=Math.min(.1,K3.vorige?(nu-K3.vorige)/1000:0);K3.vorige=nu;K3.t+=dt;k3Stap(dt);};
  K3.raf=requestAnimationFrame(lus);
  requestAnimationFrame(()=>r.domElement.classList.add('aan'));k3Hint();
}
function k3Bouw(nieuw){
  const T=K3T;const wd=KD.wereld;const dag=kdDagdeel();K3.nacht=dag==='nacht';K3.ramen=[];K3.vlaggen=[];K3.lantaarns=[];K3.hits=[];K3.ticks=[];
  if(!K3.glbGeo){K3.glbGeo=new Set();K3.glb.scenes.forEach(x=>x.traverse(o=>{if(o.geometry)K3.glbGeo.add(o.geometry);}));}
  if(K3.sc){K3.sc.traverse(o=>{if(o.geometry&&!K3.glbGeo.has(o.geometry))o.geometry.dispose();});}
  const sc=new T.Scene();K3.sc=sc;const L=K3_LICHT[dag];
  const pm=new T.PMREMGenerator(K3.r);const env=new T.Scene();env.add(new T.Mesh(new T.SphereGeometry(10,24,12),new T.MeshBasicMaterial({color:K3.nacht?0x20284a:0xbcd6ee,side:T.BackSide})));
  const zonB=new T.Mesh(new T.SphereGeometry(1.2,12,8),new T.MeshBasicMaterial({color:0xffffff}));zonB.position.set(...L.pos).normalize().multiplyScalar(8);env.add(zonB);sc.environment=pm.fromScene(env,.04).texture;pm.dispose();
  sc.add(new T.HemisphereLight(L.hemi[0],L.hemi[1],L.hemi[2]));
  const zon=new T.DirectionalLight(L.zon,L.i);zon.position.set(...L.pos);zon.castShadow=true;zon.shadow.mapSize.set(2048,2048);const c=zon.shadow.camera;const R=Math.max(wd.W,wd.H)*.75;c.left=-R;c.right=R;c.top=R;c.bottom=-R;c.near=1;c.far=80;zon.shadow.bias=-.0005;zon.shadow.normalBias=.03;sc.add(zon);
  K3.zon=zon;
  sc.add(k3Eiland(wd));sc.add(k3Wolken());
  K3.wg={};for(const w of wd.lijst){const g=k3Wijk(w,nieuw);sc.add(g);K3.wg[w.toren?'_toren':w.vak.id]=g;}
  // Natuur langs de rand: meer naarmate het eiland groeit.
  const Rn=k3Rnd(5);const n=14+Math.min(46,wd.totaal*2);const W=wd.W,H=wd.H;const soorten=['eik','den','dennetje','eik','den','struik','rots-breed','bloem-rood','bloem-geel','boomstam','eik','gras'];
  for(let i=0;i<n;i++){const kant=i%4;const t=Rn();let x,z;if(kant===0){x=-W/2-.4+Rn()*.5;z=(t-.5)*(H-1);}else if(kant===1){x=W/2+.2-Rn()*.5;z=(t-.5)*(H-1);}else if(kant===2){z=-H/2-.4+Rn()*.5;x=(t-.5)*(W-1);}else{z=H/2+.2-Rn()*.5;x=(t-.5)*(W-1);}
    if(Math.abs(x-W*.12)<1&&z>H/2-2.5)continue;const nm=soorten[i%soorten.length];const m=k3Model(nm);m.scale.setScalar(/eik|den/.test(nm)?1.3+Rn()*.9:nm==='rots-breed'?.6:1.9);m.position.set(x,0,z);m.rotation.y=Rn()*6.28;sc.add(m);}
  K3.wonderPos={};k3Wonderen(wd);
  for(const m of Object.values(_k3M))if(m.emissiveMap)m.emissiveIntensity=K3.nacht?1.1:0;
  if(K3.nacht){for(const l of K3.lantaarns){const s=new T.Sprite(new T.SpriteMaterial({map:k3RookTex(),color:0xffc060,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));s.scale.setScalar(1.2);s.position.set(0,1.45,0);l.add(s);}}
  K3.ticks.push((dt,t)=>{for(const v of K3.vlaggen){const a=v.geometry.attributes.position,b=v.userData.basis;for(let i=0;i<a.count;i++){const x=b[i*3];a.array[i*3+2]=Math.sin(x*9-t*6)*.06*x;}a.needsUpdate=true;}});
  st:{const s=document.getElementById('kd-stage');if(s)s.classList.toggle('kd-nacht',K3.nacht);}
  K3.selG=null;if(KD.sel)k3Sel(KD.sel);
}
function k3Maat(){const k=document.getElementById('kd-kaart');if(!k||!K3.r)return;const w=Math.max(1,k.clientWidth),h=Math.max(1,k.clientHeight);if(w===K3.w&&h===K3.h)return;K3.w=w;K3.h=h;KD.vw=w;KD.vh=h;
  K3.r.setSize(w,h,false);K3.r.domElement.style.width=w+'px';K3.r.domElement.style.height=h+'px';K3.cam.aspect=w/h;k3Offset(true);}
// Het blad onderin (mobiel) of rechts (desktop) bedekt een deel: het beeldmidden schuift
// mee met het vrije stuk erboven. Tijdens het slepen aan het blad volgt de kaart direct.
function k3Offset(direct){const w=K3.w,h=K3.h;const breed=w>=900;
  K3.offDoel={x:breed?200:0,y:breed?0:Math.max(0,((KD.bladH!=null?KD.bladH:h*.42)-64)/2)};
  if(direct||!K3.offNu){K3.offNu={...K3.offDoel};k3OffZet();}}
function k3OffZet(){const c=K3.cam;c.setViewOffset(K3.w,K3.h,K3.offNu.x,K3.offNu.y,K3.w,K3.h);c.updateProjectionMatrix();}
function k3Klem(){const wd=KD.wereld;if(!wd)return;const lx=wd.W/2+2,lz=wd.H/2+(kdWonderAan('haven')?7:2);
  K3.doel.x=Math.max(-lx,Math.min(lx,K3.doel.x));K3.doel.z=Math.max(-wd.H/2-(kdWonderAan('haven')?8:2),Math.min(wd.H/2+2,K3.doel.z));
  K3.dist=Math.max(K3.distMin||6,Math.min((K3.distMax||30)*1.2,K3.dist));K3.pol=Math.max(.32,Math.min(1.22,K3.pol));}
function k3Stap(dt){
  const T=K3T;
  if(K3.naar){const n=K3.naar;n.t+=dt;const p=Math.min(1,n.t/n.dur),e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
    K3.doel.lerpVectors(n.d0,n.d1,e);K3.dist=n.r0+(n.r1-n.r0)*e;K3.az=n.a0+(n.a1-n.a0)*e;K3.pol=n.p0+(n.p1-n.p0)*e;if(p>=1)K3.naar=null;}
  else if(K3.glij&&!K3.sleept){K3.doel.addScaledVector(K3.glij,dt);K3.glij.multiplyScalar(Math.exp(-dt*4.5));k3Klem();if(K3.glij.lengthSq()<.004)K3.glij=null;}
  else if(!K3.sleept&&!KD.sel&&!K3.stil&&K3.t-(K3.invoer||0)>7&&K3.dist>K3.distMax*.8)K3.az+=dt*.025;
  // Beeldmidden schuift zacht mee met het blad.
  if(K3.offDoel&&K3.offNu){const o=K3.offNu,d=K3.offDoel;if(Math.abs(o.x-d.x)+Math.abs(o.y-d.y)>.5){const k=document.getElementById('kd-stage')?.classList.contains('kd-sleept')?1:1-Math.exp(-dt*9);o.x+=(d.x-o.x)*k;o.y+=(d.y-o.y)*k;k3OffZet();}}
  const c=K3.cam;const s=K3.schud||0;K3.schud=Math.max(0,s-dt*1.5);
  c.position.set(K3.doel.x+K3.dist*Math.sin(K3.pol)*Math.sin(K3.az),K3.doel.y+K3.dist*Math.cos(K3.pol),K3.doel.z+K3.dist*Math.sin(K3.pol)*Math.cos(K3.az));
  if(s>0)c.position.add(new T.Vector3((Math.random()-.5)*s,(Math.random()-.5)*s,(Math.random()-.5)*s));
  c.lookAt(K3.doel);c.updateMatrixWorld();K3.rDoel.copy(K3.doel);
  for(const f of K3.ticks)f(dt,K3.t);if(K3.selG)K3.selG.userData.tick(dt,K3.t);
  for(const f of K3.fx.slice()){f.t+=dt;const p=Math.min(1,f.t/f.dur);f.upd(p,dt);if(p>=1){K3.fx.splice(K3.fx.indexOf(f),1);f.weg&&f.weg();}}
  K3.r.render(K3.sc,c);kdLabels();
  const kp=document.getElementById('kd-kompas');if(kp){const deg=((K3.az-K3_AZ)*180/Math.PI).toFixed(1);if(kp._d!==deg){kp._d=deg;kp.firstElementChild.style.transform=`rotate(${deg}deg)`;}}
}
const K3_AZ=-.72;
function k3Naar(d1,r1,a1,p1,dur){K3.glij=null;K3.naar={t:0,dur:dur||.8,d0:K3.doel.clone(),d1,r0:K3.dist,r1,a0:K3.az,a1:a1==null?K3.az:a1,p0:K3.pol,p1:p1==null?K3.pol:p1};if(!dur){K3.doel.copy(d1);K3.dist=r1;if(a1!=null)K3.az=a1;if(p1!=null)K3.pol=p1;K3.naar=null;}}
// Past het hele eiland in het vrije stuk boven het blad (op 'half').
function k3OverzichtDist(){const wd=KD.wereld;const a=Math.max(1,K3.w)/Math.max(1,K3.h);const breed=K3.w>=900;const vrij=breed?(K3.w-420)/K3.w:1;const Rr=Math.hypot(wd.W,wd.H)/2+1;
  const m=kdBladMaten();const vrijH=breed?K3.h*.9:Math.max(K3.h*.3,K3.h-m.half-64);
  const vf=K3.cam.fov*Math.PI/180;const dV=Rr/Math.tan(vf/2)*(breed?1.05:.75*K3.h/vrijH);const dH=Rr/(Math.tan(vf/2)*a*vrij);return Math.max(dV,dH)*.92;}
// Afstand waarop een stuk van b×h wereld-eenheden in het vrije beeld past (smal scherm = verder weg).
function k3PasDist(b,h){const vf=K3.cam.fov*Math.PI/180,t=Math.tan(vf/2);const breed=K3.w>=900;const a=K3.w/K3.h*(breed?(K3.w-420)/K3.w:1);
  const vrijH=breed?1:Math.max(.3,(K3.h-(KD.bladH||0)-64)/K3.h);return Math.max(b/2/(t*a),h/2/(t*vrijH))*1.05;}
// Zoomen rond een schermpunt: het punt onder je vingers blijft staan.
function k3ZoomOm(f,sx,sy){const oud=K3.dist;K3.dist=Math.max(K3.distMin,Math.min(K3.distMax*1.2,K3.dist/f));const k=K3.dist/oud;
  const p=sx!=null?K3.grond(sx,sy):null;if(p){K3.doel.x=p.x+(K3.doel.x-p.x)*k;K3.doel.z=p.z+(K3.doel.z-p.z)*k;}k3Klem();}

// ── Invoer ──────────────────────────────────────────────────────────────
// Eén vinger: pannen met naglijden. Twee vingers: knijpen = zoomen rond je vingers,
// draaien = eiland draaien, samen omhoog/omlaag = kantelen. Dubbeltik zoomt in.
// Muis: slepen, scrollen, rechtermuisknop of shift = draaien/kantelen. Toetsen: pijlen, +/−, Q/E.
function k3Bind(){
  const el=K3.r.domElement;const ptrs=new Map();let start=null,twee=null,sleep=false,laatsteTik=null,spoor=[];const T=K3T;const ray=new T.Raycaster(),v2=new T.Vector2();
  const grond=(cx,cy)=>{const r=el.getBoundingClientRect();v2.set((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1);ray.setFromCamera(v2,K3.cam);const p=new T.Vector3();return ray.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),0),p)?p:null;};
  K3.grond=grond;
  for(const t of ['pointerdown','pointermove','pointerup','pointercancel','wheel'])el.addEventListener(t,e=>e.stopPropagation());
  const aangeraakt=()=>{K3.invoer=K3.t;k3HintWeg();};
  el.addEventListener('pointerdown',e=>{el.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});K3.naar=null;K3.glij=null;K3.sleept=true;aangeraakt();
    if(ptrs.size===1){start={x:e.clientX,y:e.clientY,g:grond(e.clientX,e.clientY),az:K3.az,pol:K3.pol,draai:e.button===2||e.shiftKey};sleep=false;spoor=[[performance.now(),K3.doel.x,K3.doel.z]];}
    if(ptrs.size===2){const [a,b]=[...ptrs.values()];twee={d:Math.hypot(a.x-b.x,a.y-b.y),h:Math.atan2(b.y-a.y,b.x-a.x),my:(a.y+b.y)/2};sleep=true;}});
  el.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});aangeraakt();
    if(ptrs.size>=2&&twee){const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y),h=Math.atan2(b.y-a.y,b.x-a.x),my=(a.y+b.y)/2,mx=(a.x+b.x)/2;
      if(d>10&&twee.d>10)k3ZoomOm(d/twee.d,mx,my);let dh=h-twee.h;if(dh>Math.PI)dh-=2*Math.PI;if(dh<-Math.PI)dh+=2*Math.PI;K3.az-=dh;
      K3.pol=Math.max(.32,Math.min(1.22,K3.pol-(my-twee.my)*.005));twee={d,h,my};return;}
    if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.hypot(dx,dy)>6)sleep=true;if(!sleep)return;
    if(start.draai){K3.az=start.az-dx*.008;K3.pol=Math.max(.32,Math.min(1.22,start.pol-dy*.005));return;}
    // Pannen: het aangepakte punt blijft onder je vinger.
    const p=grond(e.clientX,e.clientY);if(p&&start.g){K3.doel.copy(K3.rDoel).add(start.g.clone().sub(p));K3.doel.y=K3.rDoel.y;k3Klem();}
    spoor.push([performance.now(),K3.doel.x,K3.doel.z]);if(spoor.length>8)spoor.shift();});
  const eind=e=>{if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);
    if(ptrs.size===1&&twee){twee=null;const [q]=[...ptrs.values()];start={x:q.x,y:q.y,g:grond(q.x,q.y),az:K3.az,pol:K3.pol};spoor=[];return;}
    if(ptrs.size<2)twee=null;
    if(ptrs.size===0){K3.sleept=false;
      if(sleep&&start&&!start.draai&&spoor.length>2&&e.type==='pointerup'){const nu=performance.now();const s0=spoor.find(x=>nu-x[0]<110)||spoor[0],s1=spoor[spoor.length-1];const dtv=(s1[0]-s0[0])/1000;
        if(dtv>.012&&nu-s1[0]<60){const v=new T.Vector3((s1[1]-s0[1])/dtv,0,(s1[2]-s0[2])/dtv);if(v.length()>1.2)K3.glij=v.clampLength(0,K3.dist*1.6);}}
      if(!sleep&&start){const nu=performance.now();
        if(laatsteTik&&nu-laatsteTik.t<320&&Math.hypot(e.clientX-laatsteTik.x,e.clientY-laatsteTik.y)<30){laatsteTik=null;
          const p=grond(e.clientX,e.clientY);if(p){const d=Math.max(K3.distMin,K3.dist/1.9);const k=d/K3.dist;k3Naar(new T.Vector3(p.x+(K3.doel.x-p.x)*k,K3.doel.y,p.z+(K3.doel.z-p.z)*k),d,null,null,.45);}}
        else{laatsteTik={t:nu,x:e.clientX,y:e.clientY};const r=el.getBoundingClientRect();v2.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(v2,K3.cam);
          const hit=ray.intersectObjects(K3.hits,false)[0];if(hit)kdKies(hit.object.userData.wijk);}}
      start=null;}};
  el.addEventListener('pointerup',eind);el.addEventListener('pointercancel',eind);el.addEventListener('contextmenu',e=>e.preventDefault());
  el.addEventListener('wheel',e=>{e.preventDefault();K3.naar=null;K3.glij=null;aangeraakt();if(e.ctrlKey){k3ZoomOm(Math.exp(-e.deltaY*.01),e.clientX,e.clientY);return;}k3ZoomOm(Math.exp(-e.deltaY*.0014),e.clientX,e.clientY);},{passive:false});
  K3.toets=e=>{if(!K3.on||/INPUT|TEXTAREA/.test((e.target||{}).tagName||''))return;const k=e.key;const stap=K3.dist*.12;
    const fx=Math.sin(K3.az),fz=Math.cos(K3.az);let dx=0,dz=0;
    if(k==='ArrowUp'||k==='w'){dx=-fx;dz=-fz;}else if(k==='ArrowDown'||k==='s'){dx=fx;dz=fz;}else if(k==='ArrowLeft'||k==='a'){dx=-fz;dz=fx;}else if(k==='ArrowRight'||k==='d'){dx=fz;dz=-fx;}
    else if(k==='+'||k==='='){kdZoom(1.4);}else if(k==='-'){kdZoom(1/1.4);}else if(k==='q'){kdDraai(1);}else if(k==='e'){kdDraai(-1);}else if(k==='Escape'){if(KD.sel){KD.sel=null;kdToonLijst(true);kdOverzicht();}else kdSluit();}else return;
    e.preventDefault();aangeraakt();if(dx||dz)k3Naar(K3.doel.clone().add(new T.Vector3(dx*stap,0,dz*stap)),K3.dist,null,null,.25);};
  addEventListener('keydown',K3.toets);
}
function k3Hint(){
  let gezien=false;try{gezien=!!localStorage.getItem('slagio_kd_hint_v1');}catch(e){}if(gezien)return;
  const h=document.getElementById('kd-hint');if(!h)return;const touch=matchMedia('(pointer:coarse)').matches;
  h.innerHTML=`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M20 26V11a3 3 0 0 1 6 0v12m0-3a3 3 0 0 1 6 0v4m0-2a3 3 0 0 1 6 0v8c0 7-5 12-11 12h-2c-4 0-6-2-9-5l-6-7a3 3 0 0 1 4-4l4 3"/></svg>
    <b>Zo kijk je rond</b><ul>${touch?'<li>Sleep om te bewegen</li><li>Knijp om te zoomen</li><li>Draai met twee vingers</li><li>Tik op een wijk</li>':'<li>Sleep om te bewegen, scroll om te zoomen</li><li>Rechtermuisknop of Q/E om te draaien</li><li>Klik op een wijk om hem te openen</li>'}</ul>`;
  h.hidden=false;K3.hintT=setTimeout(k3HintWeg,7000);
}
function k3HintWeg(){const h=document.getElementById('kd-hint');if(!h||h.hidden||h.classList.contains('weg'))return;clearTimeout(K3.hintT);h.classList.add('weg');setTimeout(()=>{h.hidden=true;},450);try{localStorage.setItem('slagio_kd_hint_v1','1');}catch(e){}}

// ── Geselecteerde wijk: gloeiende rand ─────────────────────────────────
function k3Sel(id){
  const T=K3T;if(K3.selG){K3.selG.parent&&K3.selG.parent.remove(K3.selG);K3.selG=null;}
  if(!id||!K3.wg||!K3.wg[id])return;const w=KD.wereld.lijst.find(x=>x.vak&&x.vak.id===id);if(!w)return;
  const g=new T.Group();g.position.copy(K3.wg[id].position);const m=new T.MeshBasicMaterial({color:w.kleur,transparent:true,opacity:.9,depthWrite:false});
  for(const [px,pz,sx,sz] of [[2,-.12,4.44,.12],[2,4.12,4.44,.12],[-.12,2,.12,4.44],[4.12,2,.12,4.44]]){const r=new T.Mesh(Bx(sx,.05,sz),m);r.position.set(px,.2,pz);g.add(r);}
  const gl=new T.Mesh(new T.PlaneGeometry(6.2,6.2),new T.MeshBasicMaterial({map:k3GloedTex(),color:w.kleur,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.55}));gl.rotation.x=-Math.PI/2;gl.position.set(2,.21,2);g.add(gl);
  K3.sc.add(g);K3.selG=g;const t0=K3.t;g.userData.tick=(dt,t)=>{const p=Math.min(1,(t-t0)/.35);g.scale.set(.9+.1*p,1,.9+.1*p);m.opacity=.55+.35*Math.sin(t*3.2)**2;gl.material.opacity=.35+.2*Math.sin(t*3.2)**2;};
}
const _k3Gl={};function k3GloedTex(){return _k3Gl.t||(_k3Gl.t=k3Tex(k3Canvas(128,128,(g)=>{const gr=g.createRadialGradient(64,64,20,64,64,64);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.55,'rgba(255,255,255,.55)');gr.addColorStop(.7,'rgba(255,255,255,.2)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);})));}

// ── Overschrijven van de 2D-tekenlaag ───────────────────────────────────
(function(){
  const svgRender=kdRender,svgFocus=kdFocus,svgOverzicht=kdOverzicht,svgZoom=kdZoom,svgLabels=kdLabels,svgStof=kdStof,svgSluit=kdSluit,svgResize=kdResize,svgBlad=kdBladVerschoven;
  kdRender=function(nieuw){
    if(!K3.on)return svgRender(nieuw);
    const wd=kdBouwWereld();KD.wereld=wd;k3Bouw(nieuw);
    const lh=document.getElementById('kd-labels');if(lh)lh.innerHTML='';
    const n=document.getElementById('kd-niv');if(n)n.textContent=wd.niv.naam;
    if(KD.bouwt)return;if(KD.sel)kdToonWijk(KD.sel,true);else kdToonLijst();
  };
  kdBladVerschoven=function(direct){if(!K3.on)return svgBlad(direct);k3Offset(direct);};
  kdOverzicht=function(direct){if(!K3.on)return svgOverzicht(direct);k3Sel(null);K3.distMax=k3OverzichtDist();K3.distMin=Math.max(4,k3PasDist(2.6,0));k3Offset();k3Naar(new K3T.Vector3(0,0,kdWonderAan('haven')?-1:0),K3.distMax,null,.92,direct?0:.9);};
  kdZoom=function(f){if(!K3.on)return svgZoom(f);K3.invoer=K3.t;k3Naar(K3.doel.clone(),Math.max(K3.distMin,Math.min(K3.distMax*1.2,K3.dist/f)),null,null,.3);};
  kdDraai=function(r){if(!K3.on)return;K3.invoer=K3.t;k3HintWeg();const a=K3.naar?K3.naar.a1:K3.az;k3Naar(K3.doel.clone(),K3.dist,Math.round((a-K3_AZ)/(Math.PI/4))*(Math.PI/4)+K3_AZ+r*Math.PI/4,null,.45);};
  kdNoord=function(){if(!K3.on)return;K3.invoer=K3.t;let a=K3.az;const d=((a-K3_AZ)%(2*Math.PI)+3*Math.PI)%(2*Math.PI)-Math.PI;k3Naar(K3.doel.clone(),K3.dist,a-d,.92,.6);};
  kdFocus=function(w,off){if(!K3.on)return svgFocus(w,off);k3Offset();const x=k3Wx(w.gx+2),z=k3Wz(w.gy+2);k3Sel(w.vak?w.vak.id:null);
    k3Naar(new K3T.Vector3(x,.6,z),k3PasDist(K3.w>=900?10:7.2,6.5),null,.86,.85);};
  kdVier=function(id){if(!K3.on)return;const p=(K3.wonderPos||{})[id];if(!p)return;K3.invoer=K3.t;
    const oud={d:K3.doel.clone(),r:K3.dist};k3Naar(p.clone(),Math.max(K3.distMin,id==='lantaarns'||id==='inwoners'?K3.distMax*.55:11),null,.95,1.1);
    try{playSound('levelup');}catch(e){}
    for(let i=0;i<4;i++)KD.timers.push(setTimeout(()=>k3Vuurwerk(p.clone().add(new K3T.Vector3((Math.random()-.5)*4,5+Math.random()*2,(Math.random()-.5)*4))),900+i*420));
    KD.timers.push(setTimeout(()=>{if(!K3.on)return;const w=KD.sel&&KD.wereld.lijst.find(x=>x.vak&&x.vak.id===KD.sel);if(w)kdFocus(w);else k3Naar(oud.d,oud.r,null,null,1);},4200));};
  kdLabels=function(){if(!K3.on)return svgLabels();
    const host=document.getElementById('kd-labels');if(!host||!KD.wereld)return;const toon=K3.dist<K3.distMax*.66&&!KD.sel&&!KD.bouwt&&KD.blad!=='vol';host.classList.toggle('zichtbaar',toon);
    if(!host.children.length){host.innerHTML=KD.wereld.lijst.filter(w=>!w.toren).map(w=>`<button class="kd-label" data-wijk="${w.vak.id}" style="--vk:${w.kleur}">${w.klaar?'<i></i>':''}${_kdEsc(w.vak.naam)}</button>`).join('');
      host.querySelectorAll('.kd-label').forEach(b=>b.onclick=()=>kdKies(b.dataset.wijk));}
    if(!toon)return;const v=new K3T.Vector3();
    host.querySelectorAll('.kd-label').forEach(el=>{const w=KD.wereld.lijst.find(x=>x.vak&&x.vak.id===el.dataset.wijk);if(!w)return;v.set(k3Wx(w.gx+2),.2,k3Wz(w.gy+4.3)).project(K3.cam);
      el.style.transform=`translate(${((v.x+1)/2*K3.w).toFixed(0)}px,${((1-v.y)/2*K3.h).toFixed(0)}px) translate(-50%,0)`;el.style.visibility=v.z<1?'':'hidden';});};
  kdStof=function(x,y){if(!K3.on)return svgStof(x,y);};
  kdResize=function(){if(!K3.on)return svgResize();kdBlad(KD.blad||'half',true);k3Maat();};
  kdSluit=function(){if(K3.on){K3.on=false;cancelAnimationFrame(K3.raf);try{K3.ro.disconnect();}catch(e){}removeEventListener('keydown',K3.toets);clearTimeout(K3.hintT);
      try{K3.sc.traverse(o=>{if(o.geometry)o.geometry.dispose();});K3.r.dispose();K3.r.forceContextLoss();K3.r.domElement.remove();}catch(e){}
      for(const k in _k3M){try{_k3M[k].dispose();}catch(e){}delete _k3M[k];}K3.sc=null;K3.r=null;K3.selG=null;K3.offNu=null;K3.w=K3.h=0;
      const st=document.getElementById('kd-stage');if(st)st.classList.remove('kd-3d');}
    svgSluit();};
})();
