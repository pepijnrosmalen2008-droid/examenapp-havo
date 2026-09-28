// ═══════════════════════════════════════════════════════════════════════
// arcade3d.js - 3D-scènes voor de Arcade-minigames
// ───────────────────────────────────────────────────────────────────────
// Lazy geladen door arcade.js (a3Klaar). Elke minigame krijgt een echte 3D-
// scène met studiolicht, reflecties en zachte schaduwen, in plaats van een
// platte illustratie: een tijdbom met draden, een robot-boss, gouden munten
// met een kluis, een dartbord en een muizenval. De game-logica blijft in
// arcade.js; die roept alleen haken aan (bv. A3S.bom.knip(1)).
// Een scène ruimt zichzelf op zodra zijn host uit de DOM verdwijnt.
// Modellen (robot) komen uit assets3d/clash.glb, gedeeld met Clash.
// ═══════════════════════════════════════════════════════════════════════

let A3T=null,A3SU=null;
const A3={glb:null,laden:null,klaar:false,bezig:null};
const A3S={}; // actieve scène per game
function a3Lite(){try{return arcLite()||(navigator.hardwareConcurrency||8)<=3;}catch(e){return false;}}
function a3Mobiel(){return matchMedia('(pointer:coarse)').matches||innerWidth<700;}
// Laadt three.js + loaders (+ het glb als dat nodig is). Geeft een promise.
function a3Laad(metGlb){
  if(!A3.bezig)A3.bezig=Promise.all([import('/vendor/three.module.min.js'),import('/vendor/jsm/utils/SkeletonUtils.js'),import('/vendor/jsm/loaders/GLTFLoader.js')])
    .then(([t,su,gl])=>{A3T=t;A3SU=su;A3.GL=gl.GLTFLoader;A3.klaar=true;});
  return A3.bezig.then(()=>{if(!metGlb)return;
    if(typeof CL_GLB!=='undefined'&&CL_GLB.gltf){A3.glb=CL_GLB.gltf;return;}
    if(A3.glb)return;if(!A3.laden)A3.laden=new A3.GL().loadAsync('/assets3d/clash.glb').then(g=>{A3.glb=g;if(typeof CL_GLB!=='undefined'&&!CL_GLB.gltf)CL_GLB.gltf=g;});return A3.laden;});
}

// ── Textuurtjes (canvas, geen downloads) ────────────────────────────────
function a3Canvas(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return c;}
function a3Tex(c,kleur,rep){const t=new A3T.CanvasTexture(c);if(kleur!==false)t.colorSpace=A3T.SRGBColorSpace;t.anisotropy=4;if(rep){t.wrapS=t.wrapT=A3T.RepeatWrapping;t.repeat.set(rep[0],rep[1]);}return t;}
function a3Rnd(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
// Normaalkaart uit een hoogtekaart-canvas (voor papier, hout, sisal, metaal).
function a3Normaal(hc,sterk){
  const w=hc.width,h=hc.height,src=hc.getContext('2d').getImageData(0,0,w,h).data,d=new Uint8Array(w*h*4);
  const H=(x,y)=>src[(((y+h)%h)*w+((x+w)%w))*4]/255;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const dx=(H(x+1,y)-H(x-1,y))*sterk,dy=(H(x,y+1)-H(x,y-1))*sterk,l=Math.hypot(dx,dy,1),i=(y*w+x)*4;
    d[i]=(-dx/l*.5+.5)*255;d[i+1]=(dy/l*.5+.5)*255;d[i+2]=(1/l*.5+.5)*255;d[i+3]=255;}
  const t=new A3T.DataTexture(d,w,h);t.wrapS=t.wrapT=A3T.RepeatWrapping;t.needsUpdate=true;return t;
}
function a3Ruis(w,h,seed,korrel,lagen){return a3Canvas(w,h,(g)=>{const R=a3Rnd(seed||1);g.fillStyle='#808080';g.fillRect(0,0,w,h);
  for(let i=0;i<(lagen||1)*w*h/12;i++){const v=Math.floor(128+(R()-.5)*255*(korrel||.5));g.fillStyle=`rgb(${v},${v},${v})`;g.fillRect(R()*w,R()*h,1+R()*2,1+R()*2);}});}
const _a3G={};
function a3Gloed(){return _a3G.g||(_a3G.g=a3Tex(a3Canvas(64,64,g=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.3,'rgba(255,255,255,.55)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);})));}
function a3Rook(){return _a3G.r||(_a3G.r=a3Tex(a3Canvas(128,128,g=>{const R=a3Rnd(9);for(let i=0;i<26;i++){const x=34+R()*60,y=34+R()*60,r=14+R()*26;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.32)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);}})));}
function a3Vonk(){return _a3G.v||(_a3G.v=a3Tex(a3Canvas(64,64,g=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,240,1)');r.addColorStop(.15,'rgba(255,220,120,.9)');r.addColorStop(.4,'rgba(255,140,40,.3)');r.addColorStop(1,'rgba(255,100,0,0)');g.fillStyle=r;g.fillRect(0,0,64,64);})));}

// ── Podium: renderer, licht, lus, deeltjes ──────────────────────────────
function a3Podium(host,o){
  o=o||{};const T=A3T;const lite=a3Lite(),mob=a3Mobiel();
  const r=new T.WebGLRenderer({antialias:!lite,alpha:true,powerPreference:'high-performance'});
  r.setPixelRatio(Math.min(devicePixelRatio||1,lite?1:mob?1.75:2));r.setClearColor(0x000000,0);
  r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=o.belichting||1.05;r.shadowMap.enabled=!lite;r.shadowMap.type=T.PCFSoftShadowMap;
  r.domElement.className='a3-canvas';host.appendChild(r.domElement);
  const sc=new T.Scene();const cam=new T.PerspectiveCamera(o.fov||32,1,.05,200);
  // Studio-omgeving voor reflecties: zachte koepel met twee lichtbakken.
  try{const pm=new T.PMREMGenerator(r);const env=new T.Scene();
    env.add(new T.Mesh(new T.SphereGeometry(10,32,16),new T.ShaderMaterial({side:T.BackSide,uniforms:{a:{value:new T.Color(o.lucht||0x9aa7b8)},b:{value:new T.Color(o.grond||0x2a2622)}},
      vertexShader:'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:'uniform vec3 a;uniform vec3 b;varying vec3 p;void main(){vec3 n=normalize(p);vec3 c=mix(b,a,smoothstep(-.3,.7,n.y));c+=vec3(1.)*smoothstep(.93,.99,dot(n,normalize(vec3(-.6,.7,.4))))*6.;c+=vec3(.9,.95,1.)*smoothstep(.95,.995,dot(n,normalize(vec3(.8,.3,-.5))))*3.;gl_FragColor=vec4(c,1.);}'})));
    sc.environment=pm.fromScene(env,.03).texture;pm.dispose();}catch(e){}
  const key=new T.DirectionalLight(o.keyKleur||0xfff2e0,o.key||2.4);key.position.set(-3,6,4);
  if(!lite){key.castShadow=true;key.shadow.mapSize.set(1024,1024);const c=key.shadow.camera;c.left=-4;c.right=4;c.top=4;c.bottom=-4;c.near=.5;c.far=20;key.shadow.bias=-.0004;key.shadow.normalBias=.02;key.shadow.radius=4;}
  const rim=new T.DirectionalLight(o.rimKleur||0x9ec5ff,o.rim||1.4);rim.position.set(3,3,-4);
  // Eén vast flitslicht (intensiteit 0): lampen toevoegen tijdens het spel zou alle shaders hercompileren.
  const flits=new T.PointLight(0xffe0a0,0,14,2);flits.position.set(0,1.5,1.5);
  sc.add(key,rim,flits,new T.HemisphereLight(0xdfe8ff,0x3a3028,o.hemi||.55));
  const P={T,r,sc,cam,key,rim,flits,host,lite,mob,ticks:[],fx:[],t:0,schud:0,dood:false,doel:new T.Vector3(...(o.doel||[0,0,0])),basis:new T.Vector3(...(o.cam||[0,2,6]))};
  cam.position.copy(P.basis);cam.lookAt(P.doel);
  if(o.vloer!==false){const v=new T.Mesh(new T.PlaneGeometry(30,30),new T.ShadowMaterial({opacity:o.schaduw||.35}));v.rotation.x=-Math.PI/2;v.position.y=o.vloerY||0;v.receiveShadow=true;sc.add(v);P.vloer=v;}
  const maat=()=>{const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);if(w===P.w&&h===P.h)return;P.w=w;P.h=h;r.setSize(w,h,false);r.domElement.style.width=w+'px';r.domElement.style.height=h+'px';cam.aspect=w/h;cam.updateProjectionMatrix();};
  maat();P.ro=new ResizeObserver(()=>maat());P.ro.observe(host);
  let vorige=0;
  const lus=nu=>{
    if(P.dood)return;if(!host.isConnected){a3Weg(P);return;}P.raf=requestAnimationFrame(lus);
    if(document.hidden){vorige=nu;return;}const dt=Math.min(.05,vorige?(nu-vorige)/1000:0);vorige=nu;P.t+=dt;
    for(const f of P.ticks)f(dt,P.t);
    for(const f of P.fx.slice()){f.t+=dt;const p=Math.min(1,f.t/f.dur);f.upd(p,dt);if(p>=1){P.fx.splice(P.fx.indexOf(f),1);f.weg&&f.weg();}}
    const s=P.schud;P.schud=Math.max(0,s-dt*2.2);cam.position.copy(P.basis);
    if(s>0&&!a3LiteBeweging())cam.position.add(new T.Vector3((Math.random()-.5)*s,(Math.random()-.5)*s,(Math.random()-.5)*s*.5));
    cam.lookAt(P.doel);r.render(sc,cam);
  };
  P.raf=requestAnimationFrame(lus);
  return P;
}
function a3LiteBeweging(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}
function a3Weg(P){if(!P||P.dood)return;P.dood=true;cancelAnimationFrame(P.raf);try{P.ro.disconnect();}catch(e){}
  P.sc.traverse(o=>{if(o.geometry&&!o.userData.gedeeld)o.geometry.dispose();const m=o.material;if(m&&!o.userData.gedeeld)(Array.isArray(m)?m:[m]).forEach(x=>{for(const k of ['map','normalMap','emissiveMap','roughnessMap','bumpMap'])if(x[k]&&!x[k].userData?.gedeeld)x[k].dispose();x.dispose();});});
  try{P.r.dispose();P.r.forceContextLoss();}catch(e){}P.r.domElement.remove();for(const k in A3S)if(A3S[k]&&A3S[k].P===P)delete A3S[k];}
function a3Mesh(g,m,schaduw){const x=new A3T.Mesh(g,m);if(schaduw!==false){x.castShadow=true;x.receiveShadow=true;}return x;}
function a3Fx(P,dur,upd,weg){P.fx.push({t:0,dur,upd,weg});}
// Deeltjes: vonken (additief, zwaartekracht), rook (groeit en vervaagt), vuur.
function a3Deeltjes(P,pos,o){
  const T=A3T;const n=P.lite?Math.ceil(o.n/2):o.n;
  for(let i=0;i<n;i++){const m=new T.SpriteMaterial({map:o.tex||a3Vonk(),color:o.kleur||0xffffff,transparent:true,depthWrite:false,blending:o.normaal?T.NormalBlending:T.AdditiveBlending,opacity:o.op||1});
    const s=new T.Sprite(m);s.position.copy(pos);const sch=(o.maat||.15)*(.6+Math.random()*.8);s.scale.setScalar(sch);P.sc.add(s);
    const a=Math.random()*Math.PI*2,e=(o.omhoog||.5)+Math.random()*(o.spreid||1);const sp=(o.snel||3)*(.4+Math.random()*.8);
    const v=new T.Vector3(Math.cos(a)*sp*(o.hor||1),e*sp,Math.sin(a)*sp*(o.hor||1));const dur=(o.dur||.7)*(.6+Math.random()*.8);
    a3Fx(P,dur,(p,dt)=>{v.y-=(o.zwaar==null?9:o.zwaar)*dt;v.multiplyScalar(1-(o.remming||0)*dt);s.position.addScaledVector(v,dt);
      s.scale.setScalar(sch*(o.groei?1+p*o.groei:1-p*.6));m.opacity=(o.op||1)*(1-p)*(o.fadeIn?Math.min(1,p*6):1);if(o.draai)m.rotation+=dt*o.draai;},()=>{P.sc.remove(s);m.dispose();});}
}
function a3Flits(P,kleur,sterk,dur,pos){const l=P.flits;l.color.set(kleur||0xffe0a0);if(pos)l.position.copy(pos);else l.position.copy(P.doel).add(new A3T.Vector3(0,1,1.5));
  a3Fx(P,dur||.4,p=>{l.intensity=(sterk||30)*(1-p)*(1-p);},()=>{l.intensity=0;});}
function a3Veer(x,v,doel,stijf,demp,dt){const a=(doel-x)*stijf-v*demp;v+=a*dt;x+=v*dt;return [x,v];}


// ═══════ 💣 TIJDBOM ═══════
// Drie staven dynamiet met tape, een timer met rode cijfers, drie draden die
// je doorknipt en een brandende lont. Bij BOEM vliegt alles uit elkaar.
function a3BomPapier(){
  return a3Canvas(512,256,(g,w,h)=>{const R=a3Rnd(5);g.fillStyle='#b3261e';g.fillRect(0,0,w,h);
    for(let i=0;i<5000;i++){g.fillStyle=`rgba(${R()<.5?90:220},${R()<.5?20:60},${R()<.5?20:40},${.05+R()*.08})`;g.fillRect(R()*w,R()*h,1+R()*3,1);}
    g.fillStyle='rgba(0,0,0,.18)';for(let y=0;y<h;y+=32)g.fillRect(0,y,w,2);
    g.save();g.translate(w/2,h/2);g.fillStyle='#1b0d0b';g.font='900 86px Impact, "Arial Black", sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('TNT',0,-6);
    g.font='700 22px Arial, sans-serif';g.fillText('SLAGIO · KLASSE 1.1',0,52);g.restore();
    g.fillStyle='rgba(255,255,255,.07)';g.fillRect(0,40,w,12);});
}
function a3LcdCanvas(){const c=document.createElement('canvas');c.width=256;c.height=96;return c;}
function a3Lcd(c,tekst,kleur,dim){
  const g=c.getContext('2d');g.fillStyle='#120606';g.fillRect(0,0,256,96);
  g.font='700 70px "DSEG7 Classic","Courier New",monospace';g.textAlign='center';g.textBaseline='middle';
  g.fillStyle='rgba(255,60,40,.08)';g.fillText('88:88',128,52);
  if(!dim){g.shadowColor=kleur;g.shadowBlur=18;g.fillStyle=kleur;g.fillText(tekst,128,52);g.shadowBlur=0;}
}
function a3Bom(host){
  const P=a3Podium(host,{cam:[0,2.05,3.9],doel:[0,.42,0],fov:30,lucht:0x7b8494,grond:0x16120f,vloer:false,key:2.6,rim:1.6});
  const T=A3T;const g=new T.Group();P.sc.add(g);const B={P,g,draden:[],leds:[],uit:false};
  // Tafelblad: geborsteld staal.
  const bc=a3Canvas(256,256,(x,w,h)=>{const R=a3Rnd(3);x.fillStyle='#808080';x.fillRect(0,0,w,h);for(let i=0;i<2600;i++){const v=110+R()*40;x.fillStyle=`rgb(${v},${v},${v})`;x.fillRect(0,R()*h,w,1);}});
  const tafel=new T.Mesh(new T.PlaneGeometry(9,6),new T.MeshStandardMaterial({color:0x3a3d42,metalness:.75,roughness:.42,normalMap:a3Normaal(bc,1.2),normalScale:new T.Vector2(.25,.25)}));
  tafel.material.normalMap.repeat.set(3,3);tafel.rotation.x=-Math.PI/2;tafel.receiveShadow=true;P.sc.add(tafel);
  // Dynamiet.
  const pap=a3BomPapier();const papT=a3Tex(pap);const papN=a3Normaal(a3Ruis(256,128,4,.6,2),2);
  const kap=new T.MeshStandardMaterial({map:a3Tex(a3Canvas(128,128,(x,w,h)=>{x.fillStyle='#caa77a';x.fillRect(0,0,w,h);x.fillStyle='#8f6b45';x.beginPath();x.arc(64,64,18,0,7);x.fill();x.strokeStyle='rgba(80,50,20,.4)';for(let r=26;r<64;r+=8){x.beginPath();x.arc(64,64,r,0,7);x.stroke();}})),roughness:.9});
  const staafM=new T.MeshStandardMaterial({map:papT,normalMap:papN,normalScale:new T.Vector2(.4,.4),roughness:.78});
  const staafG=new T.CylinderGeometry(.19,.19,1.72,40,1);const staven=[[.19,-.2],[.19,.2],[.52,0]];
  for(const [y,z] of staven){const m=a3Mesh(staafG,[staafM,kap,kap]);m.rotation.z=Math.PI/2;m.rotation.x=(Math.random()-.5)*.6;m.position.set(0,y,z);g.add(m);}
  // Tape rond de bundel (omhullende van de drie cirkels).
  const vorm=new T.Shape();const pts=[];for(let i=0;i<64;i++){const a=i/64*Math.PI*2,dx=Math.cos(a),dy=Math.sin(a);let best=null,bd=-9;
    for(const [y,z] of staven){const d=z*dx+y*dy;if(d>bd){bd=d;best=[z+dx*.205,y+dy*.205];}}pts.push(best);}
  pts.forEach((p,i)=>i?vorm.lineTo(p[0],p[1]):vorm.moveTo(p[0],p[1]));
  const tapeG=new T.ExtrudeGeometry(vorm,{depth:.13,bevelEnabled:true,bevelThickness:.01,bevelSize:.008,bevelSegments:2,curveSegments:6});
  const tapeM=new T.MeshStandardMaterial({color:0x17181b,roughness:.45,metalness:.05});
  for(const x of [-.5,.5]){const t=a3Mesh(tapeG,tapeM);t.rotation.y=Math.PI/2;t.position.set(x-.065,0,0);g.add(t);}
  // Timermodule met afgeronde behuizing.
  const rr=(w,h,r)=>{const s=new T.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s;};
  const mod=new T.Group();mod.position.set(0,.38,.43);mod.rotation.x=-.32;g.add(mod);
  const kast=a3Mesh(new T.ExtrudeGeometry(rr(1.02,.5,.07),{depth:.12,bevelEnabled:true,bevelThickness:.02,bevelSize:.02,bevelSegments:3}),new T.MeshStandardMaterial({color:0x26282c,roughness:.38,metalness:.25}));kast.position.z=-.06;mod.add(kast);
  const lcdC=a3LcdCanvas();a3Lcd(lcdC,'00:30','#ff3b2f');const lcdT=a3Tex(lcdC);
  const lcd=new T.Mesh(new T.PlaneGeometry(.66,.25),new T.MeshStandardMaterial({map:lcdT,emissive:0xffffff,emissiveMap:lcdT,emissiveIntensity:1.5,roughness:.15,metalness:0}));lcd.position.set(-.1,.04,.095);mod.add(lcd);B.lcdC=lcdC;B.lcdT=lcdT;
  const glasM=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.05,transmission:0,transparent:true,opacity:.12,clearcoat:1});const glas=new T.Mesh(new T.PlaneGeometry(.7,.29),glasM);glas.position.set(-.1,.04,.1);mod.add(glas);
  for(let i=0;i<3;i++){const m=new T.MeshStandardMaterial({color:0x2b2b2b,emissive:0xffb020,emissiveIntensity:0,roughness:.3});const l=a3Mesh(new T.SphereGeometry(.035,16,12),m,false);l.position.set(.33,.13-i*.1,.1);mod.add(l);B.leds.push(m);}
  for(const [x,y] of [[-.46,.2],[.46,.2],[-.46,-.2],[.46,-.2]]){const sc=a3Mesh(new T.CylinderGeometry(.025,.025,.02,12),new T.MeshStandardMaterial({color:0xb8bec6,metalness:1,roughness:.3}),false);sc.rotation.x=Math.PI/2;sc.position.set(x,y,.09);mod.add(sc);}
  // Draden: rood, blauw, geel. Elk in twee helften, zodat we ze kunnen doorknippen.
  const KL=[0xd62828,0x1d4ed8,0xf2c200];
  KL.forEach((kl,i)=>{const y0=.26-i*.1,x0=-.51;const start=new T.Vector3(x0,y0,0).applyMatrix4(new T.Matrix4().makeRotationX(-.32)).add(new T.Vector3(0,.38,.43));
    const eind=new T.Vector3(-.86,[.19,.19,.52][i],[-.2,.2,0][i]);
    const mid=start.clone().lerp(eind,.5).add(new T.Vector3(-.25-i*.08,.35-i*.12,.25));
    const curve=new T.CatmullRomCurve3([start,start.clone().lerp(mid,.5).add(new T.Vector3(-.05,.1,.12)),mid,mid.clone().lerp(eind,.5).add(new T.Vector3(-.08,.05,-.05)),eind]);
    const mat=new T.MeshPhysicalMaterial({color:kl,roughness:.28,clearcoat:.6,clearcoatRoughness:.3});
    const helft=(a,b)=>{const pts=[];for(let k=0;k<=12;k++)pts.push(curve.getPoint(a+(b-a)*k/12));const c=new T.CatmullRomCurve3(pts);const m=a3Mesh(new T.TubeGeometry(c,24,.028,10,false),mat);g.add(m);return m;};
    const knip=curve.getPoint(.5);const h1=helft(0,.5),h2=helft(.5,1);B.draden.push({h1,h2,knip,start,eind,mat,uit:false});});
  // Lont met vonk.
  const lontC=new T.CatmullRomCurve3([new T.Vector3(.86,.52,0),new T.Vector3(1.05,.72,.05),new T.Vector3(1.0,.95,.2),new T.Vector3(1.15,1.12,.18)]);
  const lontG=new T.TubeGeometry(lontC,48,.018,8,false);const lont=a3Mesh(lontG,new T.MeshStandardMaterial({color:0x8a6a3c,roughness:.95}));g.add(lont);B.lont=lont;B.lontC=lontC;
  const vonk=new T.Sprite(new T.SpriteMaterial({map:a3Vonk(),color:0xffd27a,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));vonk.scale.setScalar(.34);g.add(vonk);B.vonk=vonk;
  B.lontFrac=1;B.kritiek=false;
  // Lampje dat rood knippert als de tijd bijna op is (al aanwezig, alleen de intensiteit verandert).
  P.flits.position.set(0,1.2,1.2);
  let tv=0;
  P.ticks.push((dt,t)=>{
    if(B.uit)return;
    g.rotation.y=Math.sin(t*.35)*.12;g.position.y=Math.sin(t*1.3)*.008;
    const p=lontC.getPoint(Math.max(0,B.lontFrac));vonk.position.copy(p);vonk.scale.setScalar(.26+Math.random()*.16);
    const n=lontG.index.count;lont.geometry.setDrawRange(0,Math.max(0,Math.floor(n*B.lontFrac/6)*6));
    tv+=dt;if(tv>.03&&!B.gestopt){tv=0;a3Deeltjes(P,p.clone().applyMatrix4(g.matrixWorld),{n:2,kleur:0xffc25a,maat:.05,snel:1.6,omhoog:.6,zwaar:5,dur:.45});}
    if(B.kritiek&&!B.gestopt){const k=(Math.sin(t*14)+1)/2;P.flits.color.set(0xff2a1a);P.flits.intensity=k*7;}
    B.leds.forEach((m,i)=>{if(m.userData.st==='actief')m.emissiveIntensity=1.2+Math.sin(t*8)*.8;});
  });
  B.leds[0].userData.st='actief';B.leds[0].emissive.set(0xffb020);
  B.tijd=(sec,frac,krit)=>{const txt='00:'+String(Math.max(0,sec)).padStart(2,'0');if(txt!==B.txt||krit!==B.kritiek){B.txt=txt;a3Lcd(lcdC,txt,krit?'#ff5a3c':'#ff3b2f');lcdT.needsUpdate=true;}
    B.kritiek=krit;if(!krit&&!B.gestopt)P.flits.intensity=0;B.lontFrac=Math.max(.02,frac);};
  B.knip=i=>{const d=B.draden[i];if(!d||d.uit)return;d.uit=true;const wk=d.knip.clone().applyMatrix4(g.matrixWorld);
    a3Deeltjes(P,wk,{n:16,kleur:0xfff1b0,maat:.07,snel:2.6,omhoog:.3,zwaar:8,dur:.5});a3Flits(P,0xffe7a8,6,.18,wk);
    const v1={a:0,v:0},v2={a:0,v:0};
    a3Fx(P,1.4,(p,dt)=>{[v1.a,v1.v]=a3Veer(v1.a,v1.v,.55,60,4,dt);[v2.a,v2.v]=a3Veer(v2.a,v2.v,-.6,50,3.5,dt);
      d.h1.position.set(0,0,0);d.h1.rotation.set(0,0,0);d.h2.rotation.set(0,0,0);
      // Helften vallen slap weg, rond hun vaste uiteinden.
      d.h1.position.copy(d.start).sub(d.start.clone().applyAxisAngle(new T.Vector3(1,0,.4).normalize(),v1.a));d.h1.rotateOnAxis(new T.Vector3(1,0,.4).normalize(),v1.a);
      d.h2.position.copy(d.eind).sub(d.eind.clone().applyAxisAngle(new T.Vector3(0,0,1),v2.a*.5));d.h2.rotateOnAxis(new T.Vector3(0,0,1),v2.a*.5);});
    const led=B.leds[i];led.userData.st='klaar';led.emissive.set(0x22e06a);led.emissiveIntensity=2.2;
    if(B.leds[i+1]){B.leds[i+1].userData.st='actief';B.leds[i+1].emissive.set(0xffb020);}
  };
  B.fout=()=>{P.schud=Math.max(P.schud,.09);const led=B.leds.find(m=>m.userData.st==='actief');if(led){led.emissive.set(0xff2a1a);led.emissiveIntensity=3;setTimeout(()=>{if(led.userData.st==='actief'){led.emissive.set(0xffb020);}},380);}
    a3Flits(P,0xff3b2f,5,.3);};
  B.ok=()=>{B.gestopt=true;B.kritiek=false;P.flits.intensity=0;a3Lcd(lcdC,'--:--','#34d27a');lcdT.needsUpdate=true;
    a3Deeltjes(P,vonk.getWorldPosition(new T.Vector3()),{n:10,tex:a3Rook(),kleur:0x9aa0a6,normaal:true,op:.5,maat:.25,groei:3,snel:.4,omhoog:1,zwaar:-.5,dur:1.4});vonk.visible=false;
    B.leds.forEach(m=>{m.emissive.set(0x22e06a);m.emissiveIntensity=2.2;m.userData.st='klaar';});a3Flits(P,0x5cff9a,5,.6);};
  B.boem=()=>{if(B.uit)return;B.uit=true;const T0=A3T;const mid=new T0.Vector3(0,.4,0);vonk.visible=false;
    P.schud=.6;a3Flits(P,0xffc070,90,.9,new T0.Vector3(0,1.2,.8));
    // Onderdelen vliegen weg met zwaartekracht en tollen rond.
    const delen=[];g.children.slice().forEach(c=>{if(!c.isMesh)return;const wp=c.getWorldPosition(new T0.Vector3());const dir=wp.clone().sub(mid).normalize();
      delen.push({c,v:dir.multiplyScalar(4+Math.random()*4).add(new T0.Vector3(0,4+Math.random()*3,0)),rv:new T0.Vector3(Math.random()*9,Math.random()*9,Math.random()*9)});});
    a3Fx(P,2.2,(p,dt)=>{for(const d of delen){d.v.y-=12*dt;d.c.position.addScaledVector(d.v,dt);d.c.rotation.x+=d.rv.x*dt;d.c.rotation.y+=d.rv.y*dt;if(d.c.position.y<-.2){d.c.position.y=-.2;d.v.multiplyScalar(.4);d.v.y*=-.3;}}});
    a3Deeltjes(P,mid,{n:34,tex:a3Vonk(),kleur:0xffa040,maat:.9,groei:2.5,snel:3.5,omhoog:.6,zwaar:0,remming:2.5,dur:.9});
    a3Deeltjes(P,mid,{n:26,tex:a3Rook(),kleur:0x3a3634,normaal:true,op:.85,maat:1,groei:2.4,snel:2,omhoog:1.2,zwaar:-1.2,remming:1.2,dur:2.4,fadeIn:true});
    a3Deeltjes(P,mid,{n:40,kleur:0xffe7a0,maat:.08,snel:7,omhoog:.8,zwaar:9,dur:1.1});
    const ring=new T0.Mesh(new T0.RingGeometry(.9,1,48),new T0.MeshBasicMaterial({color:0xffd8a0,transparent:true,depthWrite:false,side:T0.DoubleSide,blending:T0.AdditiveBlending}));ring.rotation.x=-Math.PI/2;ring.position.y=.02;P.sc.add(ring);
    a3Fx(P,.7,p=>{ring.scale.setScalar(.3+p*5);ring.material.opacity=1-p;},()=>P.sc.remove(ring));};
  return B;
}

// ═══════ 👹 ROBOT-BOSS ═══════
// De examenboss is een robot op een stenen podium. Een goed antwoord is een
// energiebol die hem raakt (hij deinst terug), een fout: hij slaat naar jou.
function a3Boss(host,kleur){
  const P=a3Podium(host,{cam:[0,1.7,5.4],doel:[0,1.2,0],fov:32,lucht:0x6d5a9c,grond:0x140c24,schaduw:.5,key:2.2,rim:2.4,rimKleur:0xb79cff});
  const T=A3T;const B={P,uit:false};const vk=new T.Color(kleur||'#7c3aed');
  // Podium: zeshoekige steen met een gloeiende rand in de vakkleur.
  const steenN=a3Normaal(a3Ruis(256,256,8,.9,3),3);
  const podium=a3Mesh(new T.CylinderGeometry(1.9,2.1,.35,6),new T.MeshStandardMaterial({color:0x3b3548,roughness:.85,normalMap:steenN,normalScale:new T.Vector2(.6,.6)}));podium.position.y=-.17;P.sc.add(podium);
  const rand=new T.Mesh(new T.TorusGeometry(1.95,.035,8,6),new T.MeshStandardMaterial({color:vk,emissive:vk,emissiveIntensity:2.2}));rand.rotation.x=Math.PI/2;rand.rotation.z=Math.PI/6;rand.position.y=.01;P.sc.add(rand);
  const gl=new T.Sprite(new T.SpriteMaterial({map:a3Gloed(),color:vk,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.35}));gl.scale.set(6,2,1);gl.position.y=.2;P.sc.add(gl);
  // Robot.
  const src=A3.glb.scenes.find(s=>s.name==='robot');const r=A3SU.clone(src);r.scale.setScalar(.42);P.sc.add(r);B.r=r;
  const mats=[];r.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;o.material=o.material.clone();mats.push(o.material);if(o.material.name==='Main'){o.material.color.copy(vk).lerp(new T.Color(0xffffff),.08);o.material.metalness=.35;o.material.roughness=.35;}}});
  const mixer=new T.AnimationMixer(r);const clip=n=>A3.glb.animations.find(a=>a.name==='robot|'+n);
  const act={};for(const n of ['Idle','Punch','No','Death','Dance','Yes','Wave','Jump'])if(clip(n))act[n]=mixer.clipAction(clip(n));
  for(const n of ['Punch','No','Death','Yes','Wave','Jump']){if(act[n]){act[n].setLoop(T.LoopOnce,1);act[n].clampWhenFinished=true;}}
  let nu='Idle';act.Idle.play();
  const speel=(n,snel)=>{const a=act[n];if(!a)return;const oud=act[nu];a.reset();a.timeScale=snel||1;a.play();if(oud&&oud!==a)a.crossFadeFrom(oud,.12,false);nu=n;};
  mixer.addEventListener('finished',()=>{if(B.uit)return;if(nu!=='Idle'){const oud=act[nu];act.Idle.reset().play();act.Idle.crossFadeFrom(oud,.25,false);nu='Idle';}});
  let flits=0,terug=0,tv=0;
  P.ticks.push((dt,t)=>{mixer.update(dt);
    if(flits>0){flits-=dt;const k=Math.max(0,flits/.15);for(const m of mats)if(m.emissive)m.emissive.setRGB(k,k*.9,k*.7);}
    [terug,B.tv]=a3Veer(terug,B.tv||0,0,90,9,dt);r.position.z=-terug;r.position.y=0;
    rand.material.emissiveIntensity=2+Math.sin(t*2.4)*.6;
    tv+=dt;if(!B.uit&&tv>6+Math.random()*4&&nu==='Idle'){tv=0;speel(Math.random()<.5?'Wave':'Yes');}});
  const borst=()=>new T.Vector3(0,1.55,.3);
  B.raak=(dmg,crit)=>{if(B.uit)return;const T0=A3T;
    // Energiebol vanaf de camera naar zijn borst.
    const bol=new T0.Mesh(new T0.SphereGeometry(.13,16,12),new T0.MeshBasicMaterial({color:crit?0xfff1a0:0xffb24a}));const halo=new T0.Sprite(new T0.SpriteMaterial({map:a3Gloed(),color:crit?0xffe070:0xff9a30,transparent:true,depthWrite:false,blending:T0.AdditiveBlending}));halo.scale.setScalar(crit?1.1:.8);bol.add(halo);P.sc.add(bol);
    const van=new T0.Vector3((Math.random()-.5)*1.2,.6,4.2),naar=borst();let tt=0;
    a3Fx(P,.32,(p,dt)=>{bol.position.lerpVectors(van,naar,p*p);bol.position.y+=Math.sin(p*Math.PI)*.5;tt+=dt;if(tt>.02){tt=0;a3Deeltjes(P,bol.position,{n:1,kleur:0xffb04a,maat:.18,snel:.3,zwaar:0,dur:.3});}},
      ()=>{P.sc.remove(bol);
        a3Deeltjes(P,naar,{n:crit?26:16,kleur:crit?0xfff1a0:0xffb24a,maat:.1,snel:4,omhoog:.4,zwaar:6,dur:.55});
        a3Deeltjes(P,naar,{n:4,tex:a3Rook(),kleur:0xcfc6e8,normaal:true,op:.5,maat:.4,groei:2,snel:.6,omhoog:.6,zwaar:-.5,dur:.8});
        a3Flits(P,0xffd08a,crit?26:14,.3,naar.clone().add(new T0.Vector3(0,0,1)));flits=.15;B.tv=-(crit?5:3);P.schud=Math.max(P.schud,crit?.06:.03);speel('No',1.6);});};
  // Fase 2 en 3: rode gloed, vonken rond het podium, sneller ademen.
  const vonken=[];B.fase=f=>{if(B.uit)return;speel('Jump',1);P.schud=.18;const kl=f===1?0xff7a2a:0xff2a3a;
    rand.material.color.set(kl);rand.material.emissive.set(kl);gl.material.color.set(kl);
    for(const m of mats)if(m.name==='Main'){m.color.lerp(new T.Color(f===1?0xd9482f:0x9c1c2a),.55);}
    a3Flits(P,kl,30,.7,new T.Vector3(0,1.5,1.5));a3Deeltjes(P,new T.Vector3(0,.3,0),{n:30,kleur:kl,maat:.1,snel:4,omhoog:1.2,zwaar:5,dur:.9});
    const n=f===1?6:12;for(let i=0;i<n;i++){const sp=new T.Sprite(new T.SpriteMaterial({map:a3Vonk(),color:kl,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));sp.scale.setScalar(.22);P.sc.add(sp);vonken.push({sp,a:i/n*Math.PI*2,r:1.5+Math.random()*.4,h:.3+Math.random()*1.8});}
    act.Idle.timeScale=f===1?1.5:2;};
  P.ticks.push((dt,t)=>{for(const v of vonken){v.a+=dt*(.8+v.h*.2);v.sp.position.set(Math.cos(v.a)*v.r,v.h+Math.sin(t*3+v.a)*.15,Math.sin(v.a)*v.r*.6);v.sp.material.opacity=.6+Math.sin(t*9+v.a*3)*.4;}});
  // Superaanval: een dikke gouden straal vanaf de camera.
  B.laser=()=>{if(B.uit)return;const naar=borst();const van=new T.Vector3(0,.4,4.5);const dir=naar.clone().sub(van);const len=dir.length();
    const straal=new T.Mesh(new T.CylinderGeometry(.14,.22,len,16,1,true),new T.MeshBasicMaterial({color:0xfff1a0,transparent:true,opacity:.95,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide}));
    straal.position.copy(van).addScaledVector(dir,.5);straal.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir.clone().normalize());P.sc.add(straal);
    const kern=straal.clone();kern.material=new T.MeshBasicMaterial({color:0xffffff,transparent:true,depthWrite:false,blending:T.AdditiveBlending});kern.scale.set(.4,1,.4);P.sc.add(kern);
    a3Fx(P,.55,p=>{const k=p<.2?p/.2:1-(p-.2)/.8;straal.scale.set(k*1.2+.1,1,k*1.2+.1);straal.material.opacity=.95*k;kern.material.opacity=k;},()=>{P.sc.remove(straal);P.sc.remove(kern);straal.material.dispose();kern.material.dispose();straal.geometry.dispose();});
    setTimeout(()=>{if(P.dood)return;a3Deeltjes(P,naar,{n:40,kleur:0xfff1a0,maat:.12,snel:6,omhoog:.5,zwaar:6,dur:.8});a3Deeltjes(P,naar,{n:8,tex:a3Rook(),kleur:0xe8dcff,normaal:true,op:.6,maat:.6,groei:2.5,snel:1,omhoog:.6,zwaar:-.5,dur:1});
      a3Flits(P,0xfff0a0,60,.5,naar.clone().add(new T.Vector3(0,0,1)));flits=.3;B.tv=-8;P.schud=.3;speel('No',1.8);},180);};
  B.aanval=()=>{if(B.uit)return;speel('Punch',1.25);setTimeout(()=>{if(!P.dood){P.schud=.22;a3Flits(P,0xff3b2f,10,.35,new A3T.Vector3(0,1.4,3));}},330);};
  B.dood=()=>{if(B.uit)return;B.uit=true;speel('Death',1);const T0=A3T;
    setTimeout(()=>{if(P.dood)return;const p=borst();a3Deeltjes(P,p,{n:40,kleur:0xffd070,maat:.12,snel:6,omhoog:.6,zwaar:7,dur:1});
      a3Deeltjes(P,p,{n:18,tex:a3Rook(),kleur:0x5b5270,normaal:true,op:.7,maat:.8,groei:2.5,snel:1.4,omhoog:1,zwaar:-1,remming:1.5,dur:2,fadeIn:true});a3Flits(P,0xffc070,40,.8);P.schud=.35;},650);};
  B.juich=()=>{if(B.uit)return;B.uit=true;speel('Dance',1);};
  return B;
}

// ═══════ 🎰 MUNTEN EN KLUIS ═══════
// Links groeit een stapel gouden munten (de pot), rechts staat een stalen
// kluis (de bank). Opslaan: de munten vliegen de kluis in. Fout: de stapel
// spat uit elkaar.
function a3MuntTex(){return a3Canvas(256,256,(g,w,h)=>{g.fillStyle='#808080';g.fillRect(0,0,w,h);
  g.strokeStyle='#b0b0b0';g.lineWidth=10;g.beginPath();g.arc(128,128,108,0,7);g.stroke();g.strokeStyle='#606060';g.lineWidth=4;g.beginPath();g.arc(128,128,96,0,7);g.stroke();
  for(let i=0;i<48;i++){const a=i/48*Math.PI*2;g.fillStyle='#9a9a9a';g.fillRect(128+Math.cos(a)*112-2,128+Math.sin(a)*112-2,4,4);}
  g.fillStyle='#c8c8c8';g.font='900 120px Georgia, serif';g.textAlign='center';g.textBaseline='middle';g.fillText('S',128,136);g.fillStyle='#707070';g.fillText('S',124,132);});}
function a3Risico(host){
  const P=a3Podium(host,{cam:[0,2.2,5.3],doel:[0,.55,0],fov:30,lucht:0xe8e2d0,grond:0x33402f,vloer:false,key:2.6,hemi:.8});
  const T=A3T;const B={P,munten:[]};
  // Groen laken als tafel.
  const laken=new T.Mesh(new T.PlaneGeometry(10,6),new T.MeshStandardMaterial({color:0x0f5132,roughness:.95,normalMap:a3Normaal(a3Ruis(256,256,2,.9,3),1.5),normalScale:new T.Vector2(.5,.5)}));laken.material.normalMap.repeat.set(4,4);
  laken.rotation.x=-Math.PI/2;laken.receiveShadow=true;P.sc.add(laken);
  // Munt: draaiprofiel met opstaande rand, relief uit een hoogtekaart.
  const prof=[[0,-.03],[.26,-.03],[.3,-.022],[.3,.022],[.26,.03],[.24,.028],[0,.02]].map(([x,y])=>new T.Vector2(x,y));
  const muntG=new T.LatheGeometry(prof,40);muntG.rotateX(0);
  const mt=a3MuntTex();const muntM=new T.MeshStandardMaterial({color:0xf0c255,metalness:1,roughness:.24,bumpMap:a3Tex(mt,false),bumpScale:3,side:T.DoubleSide});
  muntG.computeBoundingSphere();
  const MAX=70;const inst=new T.InstancedMesh(muntG,muntM,MAX);inst.castShadow=true;inst.receiveShadow=true;inst.count=0;inst.frustumCulled=false;P.sc.add(inst);B.inst=inst;
  const potPlek=new T.Vector3(-1.05,0,0);
  const plekVoor=i=>{const laag=Math.floor(Math.sqrt(i*.9));const r=Math.max(0,.62-laag*.13);const a=i*2.399;return new T.Vector3(potPlek.x+Math.cos(a)*r*Math.sqrt((i%7+1)/7),.03+laag*.058,Math.sin(a)*r*Math.sqrt((i%7+1)/7));};
  const dummy=new T.Object3D();const zet=(i,p,rx,rz,ry)=>{dummy.position.copy(p);dummy.rotation.set(rx||0,ry||0,rz||0);dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);};
  // Kluis.
  const staal=new T.MeshStandardMaterial({color:0x7b8591,metalness:.6,roughness:.38});
  const kluis=new T.Group();kluis.position.set(1.2,0,-.1);kluis.rotation.y=-.45;P.sc.add(kluis);
  const romp=a3Mesh(new T.BoxGeometry(1.25,1.35,1.1),staal);romp.position.y=.675;kluis.add(romp);
  const scharnier=new T.Group();scharnier.position.set(-.56,.675,.56);kluis.add(scharnier);
  const deur=a3Mesh(new T.BoxGeometry(1.05,1.15,.1),new T.MeshStandardMaterial({color:0x8a95a3,metalness:.65,roughness:.3}));deur.position.set(.525,0,.02);scharnier.add(deur);
  const draai=a3Mesh(new T.CylinderGeometry(.2,.2,.07,40),new T.MeshStandardMaterial({color:0xcfd6de,metalness:1,roughness:.22}));draai.rotation.x=Math.PI/2;draai.position.set(.5,.1,.1);scharnier.add(draai);
  for(let i=0;i<3;i++){const s=a3Mesh(new T.CylinderGeometry(.025,.025,.36,10),new T.MeshStandardMaterial({color:0xd8dee6,metalness:1,roughness:.2}));s.rotation.z=i*Math.PI/3;s.position.set(.5,-.3,.12);scharnier.add(s);}
  const binnen=new T.Mesh(new T.PlaneGeometry(1.02,1.12),new T.MeshStandardMaterial({color:0x201a12,emissive:0xffb020,emissiveIntensity:0}));binnen.position.set(0,.675,.551);kluis.add(binnen);B.binnen=binnen;
  let deurA=0,deurV=0,deurDoel=0;
  P.ticks.push((dt,t)=>{[deurA,deurV]=a3Veer(deurA,deurV,deurDoel,40,7,dt);scharnier.rotation.y=-deurA;draai.rotation.y=t*.5;});
  B.n=0;
  const tel=n=>Math.min(MAX,Math.round(n/6));
  B.pot=(bedrag)=>{const doel=tel(bedrag);const van=B.n;B.n=doel;
    for(let i=van;i<doel;i++){const d=(i-van)*.07;const eind=plekVoor(i);const rx=(Math.random()-.5)*.25,rz=(Math.random()-.5)*.25;const ry=Math.random()*6;
      inst.count=Math.max(inst.count,i+1);zet(i,new T.Vector3(0,-50,0));
      setTimeout(()=>{if(P.dood)return;const start=eind.clone().add(new T.Vector3((Math.random()-.5)*.4,2.2,(Math.random()-.5)*.4));let v=0,y=start.y,spin=Math.random()*10;
        a3Fx(P,.9,(p,dt)=>{v-=14*dt;y+=v*dt;if(y<eind.y){y=eind.y;v=-v*.3;if(Math.abs(v)<.4)v=0;}spin*=.93;zet(i,new T.Vector3(eind.x,y,eind.z),rx+spin*.1,rz,ry+spin);inst.instanceMatrix.needsUpdate=true;},
          ()=>{zet(i,eind,rx,rz,ry);inst.instanceMatrix.needsUpdate=true;});
        setTimeout(()=>{if(!P.dood)a3Deeltjes(P,eind.clone().add(new T.Vector3(0,.05,0)),{n:3,kleur:0xfff1b0,maat:.05,snel:1.4,omhoog:.8,zwaar:6,dur:.35});},330);},d*1000);}
  };
  B.bank=()=>{const n=B.n;if(!n)return;deurDoel=1.75;B.n=0;const doel=new T.Vector3(1.2,.7,.3);
    for(let i=n-1;i>=0;i--){const k=n-1-i;setTimeout(()=>{if(P.dood)return;const m=new T.Matrix4();inst.getMatrixAt(i,m);const start=new T.Vector3().setFromMatrixPosition(m);zet(i,new T.Vector3(0,-50,0));inst.instanceMatrix.needsUpdate=true;
        const vl=new T.Mesh(muntG,muntM);vl.castShadow=true;P.sc.add(vl);const top=start.clone().lerp(doel,.5).add(new T.Vector3(0,1.2,0));
        a3Fx(P,.45,p=>{const a=start.clone().lerp(top,p),b=top.clone().lerp(doel,p);vl.position.lerpVectors(a,b,p);vl.rotation.x=p*9;},()=>P.sc.remove(vl));},k*45);}
    setTimeout(()=>{if(P.dood)return;inst.count=0;binnen.material.emissiveIntensity=1.2;a3Flits(P,0xffc040,10,.5,new T.Vector3(1.2,.8,1));
      a3Fx(P,.6,p=>{binnen.material.emissiveIntensity=1.2*(1-p);});setTimeout(()=>{deurDoel=0;},250);},n*45+500);};
  B.verlies=()=>{const n=B.n;B.n=0;P.schud=.12;
    const delen=[];for(let i=0;i<n;i++){const m=new T.Matrix4();inst.getMatrixAt(i,m);const p=new T.Vector3().setFromMatrixPosition(m);
      const dir=p.clone().sub(potPlek).setY(0).normalize();delen.push({i,p,v:dir.multiplyScalar(2+Math.random()*3).add(new T.Vector3(0,2+Math.random()*3,0)),r:Math.random()*6});}
    a3Fx(P,1.3,(p,dt)=>{for(const d of delen){d.v.y-=12*dt;d.p.addScaledVector(d.v,dt);if(d.p.y<.03&&Math.abs(d.p.x-potPlek.x)<3){d.p.y=.03;d.v.y*=-.35;d.v.x*=.7;d.v.z*=.7;}d.r+=dt*8;zet(d.i,d.p,d.r,d.r*.5,0);}inst.instanceMatrix.needsUpdate=true;},
      ()=>{inst.count=0;});
    a3Flits(P,0xff3b2f,8,.4);};
  return B;
}

// ═══════ 🎯 DARTBORD ═══════
function a3BordTex(){
  return a3Canvas(1024,1024,(g,w)=>{const c=w/2;const R=a3Rnd(4);
    g.fillStyle='#161412';g.fillRect(0,0,w,w);
    const nums=[20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];
    const seg=(r0,r1,kl)=>{for(let i=0;i<20;i++){const a0=(i-.5)/20*Math.PI*2-Math.PI/2,a1=(i+.5)/20*Math.PI*2-Math.PI/2;g.fillStyle=kl(i);g.beginPath();g.arc(c,c,r1,a0,a1);g.arc(c,c,r0,a1,a0,true);g.closePath();g.fill();}};
    seg(40,250,i=>i%2?'#efe3c4':'#1c1a17');seg(250,280,i=>i%2?'#1f7a3a':'#c62828');seg(280,420,i=>i%2?'#efe3c4':'#1c1a17');seg(420,452,i=>i%2?'#1f7a3a':'#c62828');
    g.fillStyle='#1f7a3a';g.beginPath();g.arc(c,c,40,0,7);g.fill();g.fillStyle='#c62828';g.beginPath();g.arc(c,c,17,0,7);g.fill();
    // Sisal-vezels.
    for(let i=0;i<22000;i++){const a=R()*Math.PI*2,r=R()*452;g.fillStyle=`rgba(${R()<.5?0:255},${R()<.5?0:255},${R()<.5?0:255},.05)`;g.fillRect(c+Math.cos(a)*r,c+Math.sin(a)*r,1.5,1.5);}
    // Draad (spider).
    g.strokeStyle='#c9ced4';g.lineWidth=3;for(const r of [17,40,250,280,420,452]){g.beginPath();g.arc(c,c,r,0,7);g.stroke();}
    for(let i=0;i<20;i++){const a=(i-.5)/20*Math.PI*2-Math.PI/2;g.beginPath();g.moveTo(c+Math.cos(a)*40,c+Math.sin(a)*40);g.lineTo(c+Math.cos(a)*452,c+Math.sin(a)*452);g.stroke();}
    g.fillStyle='#e8e8e8';g.font='700 46px Arial, sans-serif';g.textAlign='center';g.textBaseline='middle';
    nums.forEach((n,i)=>{const a=i/20*Math.PI*2-Math.PI/2;g.save();g.translate(c+Math.cos(a)*486,c+Math.sin(a)*486);g.rotate(a+Math.PI/2);g.fillText(n,0,0);g.restore();});});
}
function a3Pijl(){const T=A3T;const g=new T.Group();
  const loop=a3Mesh(new T.LatheGeometry([[0,0],[.012,.02],[.02,.08],[.024,.2],[.02,.3],[.012,.32]].map(([x,y])=>new T.Vector2(x,y)),16),new T.MeshStandardMaterial({color:0xc8ced6,metalness:1,roughness:.28}));g.add(loop);
  const punt=a3Mesh(new T.ConeGeometry(.006,.14,8),new T.MeshStandardMaterial({color:0xe5e7eb,metalness:1,roughness:.2}));punt.rotation.x=Math.PI;punt.position.y=-.07;g.add(punt);
  const schacht=a3Mesh(new T.CylinderGeometry(.008,.01,.18,8),new T.MeshStandardMaterial({color:0x1f2937,roughness:.4}));schacht.position.y=.41;g.add(schacht);
  const vm=new T.MeshStandardMaterial({color:0xf97316,roughness:.5,side:T.DoubleSide});
  for(let i=0;i<4;i++){const v=new T.Mesh(new T.ShapeGeometry(new T.Shape([new T.Vector2(0,0),new T.Vector2(.07,.04),new T.Vector2(.07,.16),new T.Vector2(0,.2)])),vm);v.castShadow=true;v.rotation.y=i*Math.PI/2;v.position.y=.38;g.add(v);}
  g.rotation.x=-Math.PI/2;const h=new T.Group();h.add(g);return h;}
function a3Zwak(host){
  const P=a3Podium(host,{cam:[0,0,4.3],doel:[0,0,0],fov:28,lucht:0x8a7a66,grond:0x1a1410,vloer:false,key:2.2});
  const T=A3T;const B={P,pijlen:[]};
  P.key.position.set(-2,3,4);P.key.shadow.camera.left=-2;P.key.shadow.camera.right=2;P.key.shadow.camera.top=2;P.key.shadow.camera.bottom=-2;
  const hout=a3Canvas(256,512,(g,w,h)=>{const R=a3Rnd(6);for(let x=0;x<w;x+=64){g.fillStyle=`hsl(26,${30+R()*10}%,${22+R()*6}%)`;g.fillRect(x,0,64,h);for(let i=0;i<40;i++){g.strokeStyle='rgba(0,0,0,.15)';g.beginPath();const y=R()*h;g.moveTo(x,y);g.bezierCurveTo(x+20,y+R()*20,x+40,y-R()*20,x+64,y+R()*10);g.stroke();}g.fillStyle='rgba(0,0,0,.4)';g.fillRect(x+62,0,2,h);}});
  const muur=new T.Mesh(new T.PlaneGeometry(8,6),new T.MeshStandardMaterial({map:a3Tex(hout,true,[3,1]),roughness:.85}));muur.position.z=-.08;muur.receiveShadow=true;P.sc.add(muur);
  const bt=a3BordTex();const bordM=new T.MeshStandardMaterial({map:a3Tex(bt),normalMap:a3Normaal(a3Ruis(512,512,3,.8,2),2.5),normalScale:new T.Vector2(.5,.5),roughness:.9});
  const bord=a3Mesh(new T.CylinderGeometry(1.05,1.05,.1,64),[new T.MeshStandardMaterial({color:0x111111,roughness:.7}),bordM,bordM]);bord.rotation.x=Math.PI/2;bord.position.z=0;P.sc.add(bord);B.bord=bord;
  const ring=a3Mesh(new T.TorusGeometry(1.06,.035,10,64),new T.MeshStandardMaterial({color:0x9aa1a9,metalness:1,roughness:.3}));ring.position.z=.05;P.sc.add(ring);
  let zweef=0;P.ticks.push((dt,t)=>{zweef+=dt;P.basis.set(Math.sin(t*.3)*.08,Math.sin(t*.4)*.05,4.3);for(const p of B.pijlen){if(p.w){[p.a,p.v]=a3Veer(p.a,p.v,0,300,6,dt);p.g.rotation.x=p.a;p.g.rotation.z=p.a*.6;}}});
  B.gooi=(goed,dicht)=>{
    const straal=goed?Math.max(0,(1-dicht)*.55)+Math.random()*.04:.75+Math.random()*.55;const a=Math.random()*Math.PI*2;
    const doel=new T.Vector3(Math.cos(a)*straal,Math.sin(a)*straal,.05);const pijl=a3Pijl();P.sc.add(pijl);
    const start=new T.Vector3((Math.random()-.5)*.6,-.9,3.6);
    a3Fx(P,.34,p=>{pijl.position.lerpVectors(start,doel,p);pijl.position.y+=Math.sin(p*Math.PI)*.25;pijl.rotation.x=(1-p)*-.35;},()=>{
      pijl.position.copy(doel);const rec={g:pijl.children[0],a:.22,v:0,w:true};B.pijlen.push(rec);
      if(straal>1.08){ // mis: stuitert van de muur
        let v=new T.Vector3((Math.random()-.5)*1,1,1.2);a3Fx(P,.9,(p,dt)=>{v.y-=9*dt;pijl.position.addScaledVector(v,dt);pijl.rotation.z+=dt*6;},()=>P.sc.remove(pijl));B.pijlen.pop();}
      a3Deeltjes(P,doel,{n:goed?10:5,kleur:goed?0xfff1b0:0xffffff,maat:.05,snel:1.6,omhoog:.2,zwaar:4,dur:.4});P.schud=Math.max(P.schud,.02);
      if(B.pijlen.length>5){const oud=B.pijlen.shift();P.sc.remove(oud.g.parent);}});
  };
  return B;
}

// ═══════ 🪤 MUIZENVAL ═══════
function a3Val(host){
  const P=a3Podium(host,{cam:[.05,1.1,1.65],doel:[.05,.09,0],fov:30,lucht:0x7aa0b8,grond:0x151a20,schaduw:.45,key:2.4});
  const T=A3T;const B={P};const g=new T.Group();g.rotation.y=-.35;P.sc.add(g);
  const hout=a3Canvas(512,256,(x,w,h)=>{const R=a3Rnd(2);x.fillStyle='#d6a867';x.fillRect(0,0,w,h);for(let i=0;i<90;i++){x.strokeStyle=`rgba(120,70,30,${.1+R()*.2})`;x.lineWidth=1+R()*2;x.beginPath();const y=R()*h;x.moveTo(0,y);x.bezierCurveTo(w*.3,y+R()*18-9,w*.6,y+R()*18-9,w,y+R()*12-6);x.stroke();}
    x.fillStyle='rgba(120,70,30,.5)';x.beginPath();x.ellipse(w*.7,h*.4,14,6,0,0,7);x.fill();});
  const plank=a3Mesh(new T.BoxGeometry(1.5,.08,.66),new T.MeshStandardMaterial({map:a3Tex(hout),roughness:.7}));plank.position.y=.04;g.add(plank);
  const metaal=new T.MeshStandardMaterial({color:0xc0c6cf,metalness:1,roughness:.3});
  // Veer (spiraal) en scharnier.
  const helix=new T.Curve();helix.getPoint=(t,o)=>(o||new T.Vector3()).set((t-.5)*.44,.14+Math.cos(t*Math.PI*14)*.055,Math.sin(t*Math.PI*14)*.055);
  g.add(a3Mesh(new T.TubeGeometry(helix,220,.011,6,false),metaal));
  // Beugel: rechthoek van draad, draait om de as.
  const as=new T.Group();as.position.set(0,.14,0);g.add(as);
  const beugelP=new T.CurvePath();const pts=[[-.26,0,0],[-.26,0,-.3],[.26,0,-.3],[.26,0,0]].map(p=>new T.Vector3(...p));for(let i=0;i<3;i++)beugelP.add(new T.LineCurve3(pts[i],pts[i+1]));
  as.add(a3Mesh(new T.TubeGeometry(beugelP,60,.016,8,false),metaal));
  // Trapplaatje met kaas.
  const plaat=a3Mesh(new T.BoxGeometry(.28,.015,.2),new T.MeshStandardMaterial({color:0xb9c0c8,metalness:.9,roughness:.35}));plaat.position.set(0,.09,.18);g.add(plaat);
  const kv=new T.Shape([new T.Vector2(0,0),new T.Vector2(.3,0),new T.Vector2(0,.13)]);
  const kaasT=a3Canvas(256,128,(x,w,h)=>{x.fillStyle='#f4c542';x.fillRect(0,0,w,h);const R=a3Rnd(7);for(let i=0;i<14;i++){const r=4+R()*10;x.fillStyle='#d9a21e';x.beginPath();x.arc(R()*w,R()*h,r,0,7);x.fill();x.fillStyle='rgba(120,80,0,.4)';x.beginPath();x.arc(R()*w,R()*h,r*.4,0,7);x.fill();}});
  const kaas=a3Mesh(new T.ExtrudeGeometry(kv,{depth:.14,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:2}),new T.MeshStandardMaterial({map:a3Tex(kaasT),color:0xffe38a,roughness:.55,bumpMap:a3Tex(kaasT,false),bumpScale:2}));
  kaas.position.set(-.12,.1,.11);kaas.rotation.y=.2;g.add(kaas);B.kaas=kaas;
  const pal=a3Mesh(new T.CylinderGeometry(.008,.008,.42,6),metaal);pal.rotation.x=Math.PI/2;pal.position.set(0,.16,.02);g.add(pal);
  let hoek=-2.75,v=0,doel=-2.75;
  P.ticks.push((dt,t)=>{if(B.klap){v+=140*dt;hoek+=v*dt;if(hoek>=0){hoek=0;v=-v*.22;if(Math.abs(v)<1.5){B.klap=false;v=0;}}}
    else{[hoek,v]=a3Veer(hoek,v,doel,30,8,dt);}as.rotation.x=hoek;kaas.rotation.z=B.wiebel?Math.sin(t*30)*.08*B.wiebel:0;if(B.wiebel)B.wiebel=Math.max(0,B.wiebel-dt*2);});
  B.klap=false;
  B.snap=()=>{B.klap=true;v=12;doel=0;P.schud=.14;a3Flits(P,0xffffff,4,.12);
    setTimeout(()=>{if(P.dood)return;a3Deeltjes(P,new T.Vector3(0,.12,.1),{n:14,tex:a3Rook(),kleur:0xc8b28a,normaal:true,op:.6,maat:.12,groei:2,snel:1,omhoog:.5,zwaar:-.3,dur:.7});},90);
    setTimeout(()=>{if(!P.dood){doel=-2.75;}},1500);};
  B.ontdekt=()=>{B.wiebel=1;a3Deeltjes(P,new T.Vector3(-.05,.25,.18),{n:10,kleur:0x7dffb0,maat:.05,snel:1.5,omhoog:.9,zwaar:3,dur:.5});};
  return B;
}


// ═══════ 🧩 HOUTEN BLOKKEN ═══════
// Elke goed getikte kaart wordt een houten blok met een ingebrand nummer dat
// op een plank valt: van klein naar groot, van oud naar nieuw.
function a3HoutTex(seed,kl){return a3Canvas(256,256,(g,w,h)=>{const R=a3Rnd(seed);g.fillStyle=kl||'#d9a566';g.fillRect(0,0,w,h);
  for(let i=0;i<70;i++){g.strokeStyle=`rgba(110,60,20,${.08+R()*.2})`;g.lineWidth=1+R()*2.5;g.beginPath();const y=R()*h;g.moveTo(0,y);g.bezierCurveTo(w*.3,y+R()*16-8,w*.7,y+R()*16-8,w,y+R()*10-5);g.stroke();}
  if(R()<.6){g.fillStyle='rgba(110,60,20,.35)';g.beginPath();g.ellipse(R()*w,R()*h,10+R()*10,4+R()*4,R(),0,7);g.fill();}});}
function a3NummerTex(n,kleur){return a3Canvas(256,256,(g,w,h)=>{g.drawImage(a3HoutTex(n*13+1),0,0);
  g.fillStyle=kleur;g.globalAlpha=.9;g.fillRect(0,0,w,26);g.globalAlpha=1;
  g.font='900 150px Georgia, "Times New Roman", serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='rgba(60,30,8,.85)';g.fillText(String(n),w/2,h/2+14);
  g.fillStyle='rgba(255,230,190,.25)';g.fillText(String(n),w/2-3,h/2+11);});}
function a3Sorteer(host,aantal){
  const P=a3Podium(host,{cam:[0,1.25,3.6],doel:[0,.35,0],fov:30,lucht:0xe9e2d2,grond:0x3b3024,schaduw:.4,key:2.4,hemi:.75});
  const T=A3T;const B={P,blokken:[]};
  const plank=a3Mesh(new T.BoxGeometry(3.6,.14,.8),new T.MeshStandardMaterial({map:a3Tex(a3HoutTex(99,'#a8703e'),true,[2,1]),roughness:.6}));plank.position.y=-.07;P.sc.add(plank);
  const KL=['#22c55e','#3b82f6','#a855f7','#f59e0b','#ef4444','#14b8a6','#ec4899','#84cc16'];
  B.n=Math.max(3,Math.min(8,aantal||5));const breed=Math.min(.42,3.2/B.n-.05);B.breed=breed;
  B.zet=(i)=>{if(B.blokken[i])return;const h=.18+(i+1)*(.7/B.n);const x=-(B.n-1)/2*(breed+.05)+i*(breed+.05);
    const tex=a3Tex(a3NummerTex(i+1,KL[i%KL.length]));const zij=new T.MeshStandardMaterial({map:a3Tex(a3HoutTex(i*7+3)),roughness:.62});const voor=new T.MeshStandardMaterial({map:tex,roughness:.6});
    const blok=a3Mesh(new T.BoxGeometry(breed,h,breed*.9),[zij,zij,zij,zij,voor,zij]);P.sc.add(blok);B.blokken[i]=blok;
    const doelY=h/2;let y=doelY+1.6,v=0;blok.position.set(x,y,0);blok.rotation.z=(Math.random()-.5)*.4;let rz=blok.rotation.z;
    a3Fx(P,1.1,(p,dt)=>{v-=14*dt;y+=v*dt;if(y<doelY){y=doelY;if(Math.abs(v)>1.2){a3Deeltjes(P,new T.Vector3(x,.02,.2),{n:4,tex:a3Rook(),kleur:0xd8c8a8,normaal:true,op:.5,maat:.1,groei:2,snel:.6,omhoog:.3,zwaar:0,dur:.5});P.schud=Math.max(P.schud,.015);}v=-v*.28;}
      rz*=.86;blok.position.y=y;blok.rotation.z=rz;},()=>{blok.position.y=doelY;blok.rotation.z=0;});};
  B.fout=()=>{P.schud=Math.max(P.schud,.04);};
  B.klaar=()=>{B.blokken.forEach((b,i)=>{if(!b)return;const y0=b.position.y;setTimeout(()=>{if(P.dood)return;a3Fx(P,.35,p=>{b.position.y=y0+Math.sin(p*Math.PI)*.12;});
      a3Deeltjes(P,b.position.clone().add(new T.Vector3(0,.2,.3)),{n:5,kleur:0xfff1b0,maat:.05,snel:1.5,omhoog:.8,zwaar:5,dur:.45});},i*70);});};
  P.ticks.push((dt,t)=>{P.basis.set(Math.sin(t*.25)*.25,1.25,3.6);});
  return B;
}
