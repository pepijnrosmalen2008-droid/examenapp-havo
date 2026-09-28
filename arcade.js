// ═══════════════════════════════════════════════════════════════════════
// arcade.js - Slagio Arcade: zes minigames die op de échte content draaien
// ───────────────────────────────────────────────────────────────────────
// Lazy geladen door openArcade() (init.js), dus niet op het boot-pad.
//   💣 bom      procedurele kennis onder tijdsdruk (gegenereerde formulesommen)
//   👹 boss     examenboss verslaan in 3 minuten, tegen een ghost uit je divisie
//   🎰 risico   risk/reward: kies je inzet, sla op of speel door
//   🎯 zwak     Vonk vindt je zwakste leerdoel en repareert het adaptief
//   🧩 sorteer  reeksen zo snel mogelijk in de goede volgorde
//   🪤 val      klopt dit antwoord, of is het een val? (swipen)
// Alles levert XP op via addXP() (dus ook week-XP voor de divisie) en elke
// beantwoorde vraag gaat via logQuestion() de mastery-laag in.
// ═══════════════════════════════════════════════════════════════════════

// ═══════ GEDEELD ═══════
const ARC = { vakId:null, game:null, raf:0, timers:[], busy:false };
function _arcEsc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function _arcKey(){return (typeof lvlCol==='function')?lvlCol('slagio_arcade'):'slagio_arcade';}
function arcStore(){try{return JSON.parse(localStorage.getItem(_arcKey())||'{}');}catch(e){return {};}}
function arcSave(s){try{localStorage.setItem(_arcKey(),JSON.stringify(s));}catch(e){}}
function arcBest(game){return arcStore()[game]||null;}
// Record bijwerken. hoger=true: hogere score is beter; anders lager (tijden).
function arcRecord(game,waarde,hoger){
  const s=arcStore();const oud=s[game]&&s[game].best;
  if(waarde==null){s[game]=Object.assign({},s[game]||{},{plays:((s[game]&&s[game].plays)||0)+1,last:Date.now()});arcSave(s);return {geen:true,oud};}
  const beter=oud==null||(hoger?waarde>oud:waarde<oud);
  s[game]=Object.assign({},s[game]||{},{plays:((s[game]&&s[game].plays)||0)+1,last:Date.now()});
  if(beter)s[game].best=waarde;
  arcSave(s);
  return {nieuw:beter&&oud!=null,eerste:oud==null,oud};
}
function arcNf(n,dec){try{return Number(n).toLocaleString('nl-NL',{maximumFractionDigits:dec==null?2:dec});}catch(e){return String(n);}}
function arcTijd(ms){const s=ms/1000;return s<60?arcNf(s,2)+' s':Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');}
function arcShuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function arcPick(a){return a[Math.floor(Math.random()*a.length)];}
function arcSnd(n){try{if(typeof playSound==='function')playSound(n);}catch(e){}}
function arcHap(p){try{if(typeof haptic==='function')haptic(p);}catch(e){}}
function arcLite(){try{return document.documentElement.getAttribute('data-perf')==='lite'||matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}
function arcLater(fn,ms){const t=setTimeout(fn,ms);ARC.timers.push(t);return t;}
function arcStopAll(){cancelAnimationFrame(ARC.raf);ARC.raf=0;ARC.timers.forEach(clearTimeout);ARC.timers=[];if(ARC._key){document.removeEventListener('keydown',ARC._key);ARC._key=null;}}

// ── Animatie-hulpjes. Alles valt weg in de lichte modus en bij minder beweging. ──
function arcMid(el){if(!el)return {x:innerWidth/2,y:innerHeight/2};const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};}
function arcRestart(el,cls){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);}
// Deeltjes-explosie op (x,y). o: n, kleuren, afstand, duur, vorm ('rond'|'ster'|'munt'), omhoog.
function arcBurst(x,y,o){
  if(arcLite()||!document.body.animate)return;o=o||{};
  const n=o.n||14,cols=o.kleuren||['#facc15','#f97316','#ef4444','#22c55e','#38bdf8','#a78bfa'];
  for(let i=0;i<n;i++){
    const p=document.createElement('i');p.className='arc-deeltje '+(o.vorm||'');
    p.style.left=x+'px';p.style.top=y+'px';p.style.background=cols[i%cols.length];
    const z=(o.maat||8)*(.6+Math.random()*.8);p.style.width=p.style.height=z+'px';
    document.body.appendChild(p);
    const a=Math.random()*Math.PI*2,d=(o.afstand||80)*(.45+Math.random()*.75);
    const dx=Math.cos(a)*d,dy=Math.sin(a)*d-(o.omhoog||24);
    p.animate([{transform:'translate(-50%,-50%) scale(.2) rotate(0deg)',opacity:1},{transform:'translate(-50%,-50%) scale(1.1)',opacity:1,offset:.15},
      {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy+(o.val||40)}px)) scale(.4) rotate(${Math.round(Math.random()*540-270)}deg)`,opacity:0}],
      {duration:(o.duur||720)*(.75+Math.random()*.5),easing:'cubic-bezier(.15,.7,.3,1)'}).onfinish=()=>p.remove();
  }
}
// Laat een element (html) in een boog van a naar b vliegen.
function arcFly(a,b,html,o){
  o=o||{};if(arcLite()||!document.body.animate){o.klaar&&o.klaar();return;}
  const e=document.createElement('div');e.className='arc-fly '+(o.cls||'');e.innerHTML=html;
  e.style.left=a.x+'px';e.style.top=a.y+'px';document.body.appendChild(e);
  const dx=b.x-a.x,dy=b.y-a.y,boog=o.boog!=null?o.boog:-70;
  e.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:o.fadeIn?0:1},
    {transform:`translate(calc(-50% + ${dx*.5}px),calc(-50% + ${dy*.5+boog}px)) scale(${o.mid||1.15})`,opacity:1},
    {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(${o.eind||.55})`,opacity:o.fade?0:1}],
    {duration:o.duur||540,delay:o.delay||0,easing:'cubic-bezier(.45,0,.25,1)',fill:'both'}).onfinish=()=>{e.remove();o.klaar&&o.klaar();};
}
// Getal laten optellen naar een eindwaarde.
function arcTel(el,naar,o){
  if(!el)return;o=o||{};const van=o.van||0,fmt=o.fmt||(v=>arcNf(Math.round(v),0));
  if(arcLite()){el.textContent=fmt(naar);return;}
  const t0=performance.now(),d=o.duur||900;
  const f=now=>{const p=Math.min(1,(now-t0)/d);el.textContent=fmt(van+(naar-van)*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f);};
  requestAnimationFrame(f);
}

// Eigen geluiden (bovenop playSound): een cartoon-knal en een draadknip.
function arcFx(type){
  try{
    if(typeof _soundOn!=='undefined'&&!_soundOn)return;
    const ac=_slAudio();if(!ac)return;const t=ac.currentTime;
    if(type==='boom'){_slNoise(ac,t,.9,{freq:180,q:.6,vol:.35});_slTone(ac,120,38,t,.8,{type:'sawtooth',vol:.18,cut:600});_slNoise(ac,t+.05,.5,{freq:900,q:.8,vol:.12});}
    else if(type==='snip'){_slNoise(ac,t,.05,{freq:5200,q:2,vol:.12});_slTone(ac,1800,900,t,.07,{type:'square',vol:.04,cut:4000});}
    else if(type==='beep'){_slTone(ac,1320,1320,t,.07,{type:'square',vol:.035,cut:3200});}
    else if(type==='hit'){_slNoise(ac,t,.12,{freq:1400,q:.9,vol:.16});_slTone(ac,220,90,t,.18,{type:'triangle',vol:.14});}
    else if(type==='hurt'){_slTone(ac,300,120,t,.3,{type:'sawtooth',vol:.08,cut:900});}
    else if(type==='vault'){_slTone(ac,660,660,t,.09,{vol:.08});_slTone(ac,880,880,t+.08,.09,{vol:.08});_slTone(ac,1320,1320,t+.16,.2,{vol:.09,harm:.3});}
  }catch(e){}
}

// XP uitkeren (telt via addXP ook mee in de weekwedstrijd).
function arcXP(n){
  n=Math.max(0,Math.round(n||0));if(!n)return 0;
  let res=null;try{res=addXP(n);}catch(e){}
  try{if(typeof renderLeagueHome==='function')renderLeagueHome();}catch(e){}
  try{if(typeof updateProfileNav==='function')updateProfileNav();}catch(e){}
  return res?res.added:n;
}
// Eén beantwoorde vraag de mastery-laag in (en bij fout: welke afleider).
function arcLog(item,goed,keuze,ms){
  if(!item||!ARC.vakId)return;
  try{if(typeof logQuestion==='function')logQuestion(ARC.vakId,item.ldId||item.domId,'arcade',0,!!goed,ms||0);}catch(e){}
  try{if(!goed&&keuze!=null&&typeof logAfleider==='function')logAfleider(ARC.vakId,item.ldId||item.domId,item.q,keuze);}catch(e){}
}

// ── Vraagpool van een vak: alle snelle-quizvragen, met domein + leerdoel ──
const _ARC_NIET_LOS=/afbeelding|figuur|tabel|grafiek|diagram|bijlage|\bbron\b|hierboven|hieronder|onderstaande|bovenstaande|zie vraag|vorige vraag|datzelfde|dit onderzoek|deze proef/i;
function arcVak(id){try{return getVK().find(v=>v.id===id)||null;}catch(e){return null;}}
function arcPool(vakId,cb){
  const lvl=(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo';
  const bouw=()=>{
    const vak=arcVak(vakId);const out=[];const gezien=new Set();
    if(vak)(vak.domeinen||[]).forEach(d=>{
      const add=(arr,ld)=>(arr||[]).forEach(q=>{
        if(!q||!Array.isArray(q.o)||q.o.length<3||typeof q.c!=='number'||!q.v)return;
        if(q.v.length>240||q.o.some(o=>!o||String(o).length>110))return;
        if(_ARC_NIET_LOS.test(q.v))return;
        const k=q.v.slice(0,90);if(gezien.has(k))return;gezien.add(k);
        out.push({q,domId:d.id,domNaam:d.naam,ldId:ld?ld.id:d.id,ldNaam:ld?ld.naam:d.naam,d:q.d||2});
      });
      add(d.sv,null);(d.leerdoelen||[]).forEach(ld=>add(ld.sv,ld));
    });
    cb(out);
  };
  try{if(typeof ensureVakData==='function')ensureVakData(lvl,vakId,bouw);else bouw();}catch(e){bouw();}
}
// Volgende vraag uit de pool: voorkeur voor moeilijkheid d, nooit dubbel.
function arcNext(pool,gebruikt,d){
  const vrij=pool.filter(x=>!gebruikt.has(x.q.v));
  if(!vrij.length){gebruikt.clear();return pool.length?arcPick(pool):null;}
  const exact=d?vrij.filter(x=>x.d===d):[];
  const dichtbij=d?vrij.filter(x=>Math.abs(x.d-d)<=1):[];
  const it=arcPick(exact.length?exact:dichtbij.length?dichtbij:vrij);
  gebruikt.add(it.q.v);return it;
}
// Opties in willekeurige volgorde, met de index van het goede antwoord.
function arcOpties(q){const idx=arcShuffle(q.o.map((_,i)=>i));return {idx,juist:idx.indexOf(q.c)};}

// ═══════ 3D-SCÈNES (arcade3d.js) ═══════
// Laadt de 3D-laag pas als een game hem nodig heeft. Lukt WebGL niet, dan blijft
// de gewone illustratie staan (de host verdwijnt gewoon).
function arcA3(naam,hostId,...args){
  const host=document.getElementById(hostId);if(!host)return;
  const maak={bom:'a3Bom',boss:'a3Boss',risico:'a3Risico',zwak:'a3Zwak',val:'a3Val',sorteer:'a3Sorteer'}[naam];
  const start=()=>a3Laad(naam==='boss').then(()=>{if(!host.isConnected)return;
    try{const S=window[maak](host,...args);A3S[naam]=S;host.classList.add('klaar');const w=host.closest('.a3-wrap');if(w)w.classList.add('met3d');}catch(e){console.warn('[3D]',e);host.remove();}}).catch(()=>host.remove());
  if(typeof a3Laad==='function'){start();return;}
  if(!ARC._a3s)ARC._a3s=new Promise((ok,nee)=>{const s=document.createElement('script');s.src='/arcade3d.js';s.onload=ok;s.onerror=nee;document.head.appendChild(s);});
  ARC._a3s.then(start).catch(()=>host.remove());
}
function a3Haak(naam,fn,...a){try{const S=typeof A3S!=='undefined'&&A3S[naam];if(S&&!S.P.dood&&S[fn])S[fn](...a);}catch(e){}}

// ═══════ PODIUM (volledig scherm, boven de app) ═══════
function arcStage(theme,html){
  let st=document.getElementById('arc-stage');
  if(!st){st=document.createElement('div');st.id='arc-stage';document.body.appendChild(st);}
  st.className='arc-stage arc-t-'+theme;st.innerHTML=html;st.hidden=false;
  document.documentElement.classList.add('arc-open');
  requestAnimationFrame(()=>st.classList.add('on'));
  return st;
}
function arcClose(){
  arcStopAll();ARC.busy=false;
  if(ARC.onClose){const f=ARC.onClose;ARC.onClose=null;try{f();}catch(e){}}
  const st=document.getElementById('arc-stage');
  if(st){st.classList.remove('on');setTimeout(()=>{if(!st.classList.contains('on')){st.hidden=true;st.innerHTML='';}},220);}
  document.documentElement.classList.remove('arc-open');
  try{renderArcade();}catch(e){}
}
function arcTop(titel,rechts){
  return `<div class="arc-top"><button class="arc-x" onclick="arcClose()" aria-label="Stoppen">✕</button><div class="arc-top-t">${titel}</div><div class="arc-top-r">${rechts||''}</div></div>`;
}
// Intro-kaart per game: wat je doet, je record, en starten.
function arcIntro(g,extra){
  if(!extra&&g.introExtra)extra=g.introExtra();
  const b=arcBest(g.id);
  const rec=b&&b.best!=null?`<div class="arc-rec">Record <b>${g.recFmt?g.recFmt(b.best):arcNf(b.best,0)}</b></div>`:'<div class="arc-rec">Nog geen record</div>';
  const vak=arcVak(ARC.vakId);
  arcStage(g.theme,`${arcTop('')}
    <div class="arc-intro">
      <div class="arc-intro-art">${g.art()}</div>
      <div class="arc-intro-k">${_arcEsc(vak?vak.naam:'')}</div>
      <h2 class="arc-intro-h">${g.naam}</h2>
      <p class="arc-intro-p">${g.uitleg}</p>
      ${extra||''}${rec}
      <button class="arc-go" id="arc-go">Start</button>
    </div>`);
  const go=document.getElementById('arc-go');
  go.onclick=()=>{arcSnd('start');g.run();};
  if(g.id==='zwak'&&!ZWAK.doel){go.textContent='Naar de oefenvragen';go.onclick=()=>{arcClose();try{openVak(ARC.vakId);}catch(e){}};}
  setTimeout(()=>{try{go.focus({preventScroll:true});}catch(e){}},260);
  if(g.id==='zwak'){const b=document.querySelector('.zwak-bubble');if(b)arcTyp(b,b.textContent);}
}
// 3-2-1 voor de games met een klok.
function arcCountdown(done){
  const st=document.getElementById('arc-stage');if(!st)return done();
  const el=document.createElement('div');el.className='arc-cd';
  el.innerHTML='<div class="arc-cd-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" pathLength="100"/></svg><b></b></div>';
  st.appendChild(el);const b=el.querySelector('b'),ring=el.querySelector('.arc-cd-ring');
  let n=3;const tick=()=>{
    if(n===0){b.textContent='GO!';ring.classList.add('go');arcRestart(ring,'pop');arcSnd('start');arcHap(20);
      const m=arcMid(ring);arcBurst(m.x,m.y,{n:18,afstand:130,val:10});
      arcLater(()=>{el.classList.add('weg');arcLater(()=>el.remove(),260);done();},420);return;}
    b.textContent=n;arcRestart(ring,'pop');arcSnd('tick');arcHap(8);n--;arcLater(tick,620);};
  tick();
}
// Uitslag: grote score, record, XP en wat je leerde.
function arcResult(o){
  const g=ARC_GAMES[o.game];
  const r=arcRecord(o.game,o.recWaarde,o.hoger!==false);
  const xp=arcXP(o.xp);
  try{if(typeof trackEvent==='function')trackEvent('minigame',{game:o.game,score:o.recWaarde,xp,vak_id:ARC.vakId});}catch(e){}
  const bestNu=arcBest(o.game);
  const recTxt=o.geenRecPill?'':r.geen?(bestNu&&bestNu.best!=null?`<div class="arc-res-rec">Record ${g.recFmt?g.recFmt(bestNu.best):arcNf(bestNu.best,0)}</div>`:''):r.nieuw?`<div class="arc-res-rec new">Nieuw record${o.recDelta?' · '+o.recDelta(r.oud):''}</div>`
    :(r.eerste?'<div class="arc-res-rec">Je eerste record staat</div>'
    :`<div class="arc-res-rec">Record ${g.recFmt?g.recFmt(arcBest(o.game).best):arcNf(arcBest(o.game).best,0)}</div>`);
  const mood=o.gewonnen?'trots':'goed';
  const vonk=(typeof mascotSVG==='function')?mascotSVG(mood,86):'';
  arcStage(g.theme,`${arcTop('')}
    <div class="arc-res ${o.gewonnen?'win':'lose'}">
      <div class="arc-res-vonk" aria-hidden="true">${vonk}</div>
      <div class="arc-res-k">${o.kicker||''}</div>
      <div class="arc-res-big">${o.tel?`<span class="arc-tel">${(o.tel.fmt||(v=>arcNf(Math.round(v),0)))(0)}</span>${o.tel.na||''}`:o.groot}</div>
      <div class="arc-res-sub">${o.sub||''}</div>
      ${recTxt}
      ${o.stats?`<div class="arc-res-stats">${o.stats.map(s=>`<div><b>${s[1]}</b><small>${s[0]}</small></div>`).join('')}</div>`:''}
      ${xp?`<div class="arc-res-xp"><span class="arc-xp-chip">+<b class="arc-xp-n">0</b> XP</span><small>telt mee voor je divisie</small></div>`:''}
      ${o.leer?`<div class="arc-res-leer">${o.leer}</div>`:''}
      <div class="arc-res-btns"><button class="arc-go" onclick="arcStart('${o.game}',true)">Nog een keer</button><button class="arc-ghost" onclick="arcClose()">Andere game</button></div>
    </div>`);
  if(o.tel)arcTel(document.querySelector('.arc-tel'),o.tel.naar,{fmt:o.tel.fmt,duur:1100});
  if(xp)arcLater(()=>{arcTel(document.querySelector('.arc-xp-n'),xp,{duur:900});arcSnd('xp');},650);
  if(o.gewonnen){arcSnd(r.nieuw?'fanfare':'complete');arcHap([30,20,60]);
    arcLater(()=>{const m=arcMid(document.querySelector('.arc-res-big'));arcBurst(m.x,m.y,{n:r.nieuw?40:24,afstand:r.nieuw?200:140,maat:9});},380);
    try{if(r.nieuw&&!arcLite()&&typeof launchConfetti==='function')launchConfetti('gold');}catch(e){}}
  else arcSnd('complete');
}

// ═══════ HUB ═══════
function openArcade(){
  show('sc-arcade');
  const lvl=(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo';
  const klaar=()=>{
    if(!ARC.vakId||!arcVak(ARC.vakId)){
      let mijn=[];try{mijn=JSON.parse(localStorage.getItem('examenapp_'+lvlCol('mijnvakken'))||'[]');}catch(e){}
      ARC.vakId=(typeof ST!=='undefined'&&ST.vak&&arcVak(ST.vak.id)?ST.vak.id:null)||arcStore()._vak||mijn.find(id=>arcVak(id))||((getVK()[0]||{}).id);
    }
    renderArcade();
  };
  try{if(typeof ensureLevelData==='function')ensureLevelData(lvl,klaar);else klaar();}catch(e){klaar();}
}
function arcKiesVak(id){ARC.vakId=id;const s=arcStore();s._vak=id;arcSave(s);arcSnd('tap');renderArcade();}
function renderArcade(){
  const box=document.getElementById('arcade-body');if(!box)return;
  const V=(typeof getVK==='function')?getVK():[];
  const vak=arcVak(ARC.vakId);
  const chips=V.map(v=>`<button class="arc-chip${v.id===ARC.vakId?' on':''}" onclick="arcKiesVak('${v.id}')" style="--vk:${v.kleur||'var(--or)'}">${_arcEsc(v.naam)}</button>`).join('');
  const tile=g=>{
    const b=arcBest(g.id);const beschikbaar=g.kan?g.kan(ARC.vakId):true;
    return `<button class="arc-tile arc-tile-${g.id}${g.groot?' groot':''}" onclick="arcStart('${g.id}')" style="--gk:${g.kleur};--i:${ARC_VOLGORDE.indexOf(g.id)}">
      <span class="arc-tile-art" aria-hidden="true">${g.art()}</span>
      <span class="arc-tile-t"><b>${g.naam}</b><small>${beschikbaar===true?g.pitch:beschikbaar}</small></span>
      ${b&&b.best!=null?`<span class="arc-tile-rec">${g.recLabel||'Record'} ${g.recFmt?g.recFmt(b.best):arcNf(b.best,0)}</span>`:'<span class="arc-tile-rec nieuw">Nieuw</span>'}
    </button>`;
  };
  box.innerHTML=`
    <header class="arc-hub-head"><div class="arc-hub-deco" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><div class="arc-hub-eyebrow">${(typeof APP_LEVEL!=='undefined'?APP_LEVEL:'').toUpperCase()} · Arcade</div>
      <h1 class="arc-hub-title">Leren dat voelt als spelen</h1>
      <p class="arc-hub-sub">Alles draait op echte examenstof en telt mee voor je XP, je divisie en je beheersing.</p></header>
    <div class="arc-chips" role="group" aria-label="Vak">${chips}</div>
    ${arcWerelden()}
    <h2 class="arc-sectie">Minigames</h2>
    <div class="arc-grid">${ARC_VOLGORDE.map(id=>tile(ARC_GAMES[id])).join('')}</div>
    <p class="arc-hub-foot">${vak?`Vragen uit <b>${_arcEsc(vak.naam)}</b>. `:''}Stoppen kan altijd met ✕; wat je verdiende, houd je.</p>`;
  // Illustraties bewegen alleen als ze in beeld zijn (zuinig op batterij).
  try{ARC._io&&ARC._io.disconnect();ARC._io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('live',e.isIntersecting)),{threshold:.3});
    box.querySelectorAll('.arc-tile').forEach(t=>ARC._io.observe(t));}catch(e){}
}
// Twee grote werelden bovenaan: Clash en Kingdom.
function arcWerelden(){
  let bekers=0,kd=0,gebouwd=0;try{bekers=(arcStore().clash||{}).bekers||0;}catch(e){}
  try{kd=typeof kdBouwklaar==='function'?kdBouwklaar():0;Object.values((kdStaat().gebouwd)||{}).forEach(x=>gebouwd+=x);}catch(e){}
  return `<div class="arc-werelden">
    <button class="arc-wereld arc-w-clash" onclick="clashOpen()">
      <span class="arc-w-img" aria-hidden="true"></span>
      <span class="arc-w-t"><small>Kaartgevecht in 3D</small><b>Slagio Clash</b><span>Goede antwoorden geven kennis. Met kennis zet je kaarten in.</span></span>
      <span class="arc-w-meta">${bekers?`<i class="arc-w-beker"></i>${arcNf(bekers,0)} bekers`:'Nieuw'}</span>
    </button>
    <button class="arc-wereld arc-w-kd" onclick="kingdomOpen()">
      <span class="arc-w-img" aria-hidden="true"></span>
      <span class="arc-w-t"><small>Bouwen met beheersing</small><b>Kingdom</b><span>Je eiland groeit met elk leerdoel dat je beheerst.</span></span>
      <span class="arc-w-meta${kd?' klaar':''}">${kd?`${kd} klaar om te bouwen`:gebouwd?`${gebouwd} gebouwd`:'Begin je eiland'}</span>
    </button>
  </div>`;
}
// Clash laadt pas als je hem opent (en three.js daarna pas binnen clash.js).
function clashOpen(){
  if(typeof openClash==='function'){openClash();return;}
  if(ARC._clLaadt)return;ARC._clLaadt=true;
  arcStage('clash',`<div class="arc-laden" style="margin:auto"><span></span>Arena laden…</div>`);
  const s=document.createElement('script');s.src='/clash.js';
  s.onload=()=>{ARC._clLaadt=false;try{openClash();}catch(e){arcClose();}};
  s.onerror=()=>{ARC._clLaadt=false;arcClose();try{showToast('Clash kon niet laden. Controleer je verbinding.');}catch(e){}};
  document.head.appendChild(s);
}
function arcStart(id,direct){
  const g=ARC_GAMES[id];if(!g||ARC.busy)return;
  arcStopAll();ARC.game=id;
  if(direct&&id!=='zwak'){if(g.voorbereid)g.voorbereid(()=>g.run());else g.run();return;}
  if(g.voorbereid){arcStage(g.theme,`${arcTop('')}<div class="arc-laden"><span></span>Vragen laden…</div>`);g.voorbereid(()=>arcIntro(g));return;}
  arcIntro(g);
}
// Algemene vraagkaart met vier knoppen (gebruikt door boss, risico, zwak).
function arcVraagHtml(item,o,cls){
  const L=['A','B','C','D'];
  return `<div class="arc-q ${cls||''}"><div class="arc-q-meta">${_arcEsc(item.ldNaam||item.domNaam||'')}</div>
    <div class="arc-q-v">${_arcEsc(item.q.v)}</div>
    <div class="arc-q-o">${o.idx.map((oi,k)=>`<button class="arc-opt" data-k="${k}"><i>${L[k]}</i><span>${_arcEsc(item.q.o[oi])}</span></button>`).join('')}</div></div>`;
}
function arcBindOpts(root,cb){
  const knoppen=[...root.querySelectorAll('.arc-opt')];
  knoppen.forEach(b=>b.addEventListener('click',()=>{if(root.dataset.klaar)return;root.dataset.klaar='1';cb(+b.dataset.k,knoppen);}));
  const key=e=>{const k={a:0,b:1,c:2,d:3,'1':0,'2':1,'3':2,'4':3}[String(e.key).toLowerCase()];if(k!=null&&knoppen[k]&&!root.dataset.klaar){e.preventDefault();knoppen[k].click();}};
  document.addEventListener('keydown',key);ARC._key&&document.removeEventListener('keydown',ARC._key);ARC._key=key;
}

// ═══════ 💣 BOM ONTMANTELEN ═══════
// Gegenereerde sommen: altijd kloppend, eindeloos gevarieerd. Een som is een
// relatie P = A · B (of een variant); de onbekende kan elk van de drie zijn.
// Modules: A welke grootheid zoek je, B welke formule, C welke uitkomst.
const BOM_REL=[
  // P = A · B   {P,A,B: [symbool, naam, eenheid]}, bereik A en B, context
  {vak:['na','na1'],P:['U','spanning','V'],A:['I','stroomsterkte','A'],B:['R','weerstand','Ω'],a:[0.5,1,1.5,2,2.5,3,4,5],b:[2,3,4,5,6,8,10,12,20,24],ctx:'Een lampje in een stroomkring.'},
  {vak:['na','na1'],P:['P','vermogen','W'],A:['U','spanning','V'],B:['I','stroomsterkte','A'],a:[6,9,12,24,230],b:[0.5,1,2,2.5,4,5],ctx:'Een apparaat op het lichtnet of een accu.'},
  {vak:['na','na1'],P:['E','energie','J'],A:['P','vermogen','W'],B:['t','tijd','s'],a:[20,40,60,100,500,1000,1500],b:[5,10,30,60,120,300],ctx:'Een apparaat staat een tijdje aan.'},
  {vak:['na','na1'],P:['s','afstand','m'],A:['v','snelheid','m/s'],B:['t','tijd','s'],a:[2,3,4,5,8,10,12,15,20,25],b:[4,5,6,8,10,12,20,30,60],ctx:'Een fietser rijdt met constante snelheid.'},
  {vak:['na','na1'],P:['F','kracht','N'],A:['m','massa','kg'],B:['a','versnelling','m/s²'],a:[2,5,10,50,60,80,1200],b:[0.5,1,1.5,2,3,4],ctx:'Een voorwerp versnelt.',niv:['havo','vwo']},
  {vak:['na','na1'],P:['m','massa','g'],A:['ρ','dichtheid','g/cm³'],B:['V','volume','cm³'],a:[0.8,1,2.7,7.9,8.9,11.3],b:[2,5,10,20,50,100],ctx:'Een blokje van één materiaal.'},
  {vak:['na','na1'],P:['W','arbeid','J'],A:['F','kracht','N'],B:['s','afstand','m'],a:[10,20,50,100,250,500],b:[0.5,1,2,3,4,10],ctx:'Je duwt een kar over de vloer.'},
  {vak:['na','na1'],P:['F','kracht','N'],A:['p','druk','Pa'],B:['A','oppervlakte','m²'],a:[100,200,500,1000,2000],b:[0.5,1,2,3,5],ctx:'Een kist drukt op de grond.',niv:['havo','vwo']},
  {vak:['sk','na2'],P:['m','massa','g'],A:['n','stoffeelhoeveelheid','mol'],B:['M','molaire massa','g/mol'],a:[0.1,0.2,0.25,0.5,1,2,3],b:[2.0,18.0,32.0,44.0,58.4,100.1],ctx:'Je weegt een hoeveelheid stof af.',niv:['havo','vwo']},
  {vak:['sk','na2'],P:['n','stoffeelhoeveelheid','mol'],A:['c','molariteit','mol/L'],B:['V','volume','L'],a:[0.1,0.2,0.5,1,2],b:[0.25,0.5,1,2,5],ctx:'Een oplossing in een maatkolf.',niv:['havo','vwo']},
  {vak:['sk','na2','na1'],P:['m','massa','g'],A:['ρ','dichtheid','g/mL'],B:['V','volume','mL'],a:[0.79,1,1.2,1.84],b:[10,25,50,100,250],ctx:'Een vloeistof in een maatcilinder.'},
  {vak:['ec','be'],P:['TO','omzet','€'],A:['p','prijs','€'],B:['q','afzet','stuks'],a:[2,5,8,12,15,20,25,40],b:[100,250,400,500,1000,2000],ctx:'Een bedrijf verkoopt één product.'},
  {vak:['ec','be'],P:['TK','totale variabele kosten','€'],A:['GVK','variabele kosten per stuk','€'],B:['q','productie','stuks'],a:[1.5,2,3,4,6,8],b:[200,500,1000,1500,4000],ctx:'Een fabriek draait een week.'},
  {vak:['wa','wb','wi'],P:['s','afstand','km'],A:['v','snelheid','km/u'],B:['t','tijd','u'],a:[4,12,15,20,50,60,80,100,120],b:[0.25,0.5,1.5,2,2.5,3],ctx:'Een reis met constante snelheid.'},
  {vak:['wa','wb','wi'],P:['A','oppervlakte','m²'],A:['l','lengte','m'],B:['b','breedte','m'],a:[3,4,5,6,7.5,8,12],b:[2,3,4,5,6,10],ctx:'Een rechthoekige tuin.'},
];
// Procentsommen (economie + wiskunde): deel = p% · geheel, en procentuele verandering.
const BOM_PROC_VAK=['ec','be','wa','wb','wi'];
function _bomRond(x){return Math.round(x*1000)/1000;}
function _bomFmt(x,u){return arcNf(_bomRond(x),3)+(u?(u==='€'?'':' ')+u:'');}
function _bomGeld(x,u){return u==='€'?'€ '+arcNf(_bomRond(x),2):_bomFmt(x,u);}
function _bomSom(vakId){
  const lvl=(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo';
  let rels=BOM_REL.filter(r=>r.vak.includes(vakId)&&(!r.niv||r.niv.includes(lvl)));
  const proc=BOM_PROC_VAK.includes(vakId);
  if(!rels.length&&!proc)rels=BOM_REL.filter(r=>!r.niv||r.niv.includes(lvl));   // gemengd
  if(proc&&(!rels.length||Math.random()<0.4))return _bomProc();
  const r=arcPick(rels);
  const a=arcPick(r.a),b=arcPick(r.b);const p=_bomRond(a*b);
  const w={P:p,A:a,B:b};
  const onb=arcPick(['P','A','B']);
  const kend=['P','A','B'].filter(k=>k!==onb);
  const sym=k=>r[k][0],naam=k=>r[k][1],eh=k=>r[k][2];
  const formule={P:`${sym('P')} = ${sym('A')} · ${sym('B')}`,A:`${sym('A')} = ${sym('P')} / ${sym('B')}`,B:`${sym('B')} = ${sym('P')} / ${sym('A')}`}[onb];
  const fout=[`${sym(onb)} = ${sym(kend[0])} · ${sym(kend[1])}`,`${sym(onb)} = ${sym(kend[0])} / ${sym(kend[1])}`,`${sym(onb)} = ${sym(kend[1])} / ${sym(kend[0])}`,`${sym(onb)} = ${sym(kend[0])} + ${sym(kend[1])}`]
    .filter(f=>f.replace(/\s/g,'')!==formule.replace(/\s/g,''));
  // Waarde-afleiders: de klassieke fouten (vermenigvuldigen i.p.v. delen, omgekeerd delen, factor 1000).
  const x1=w[kend[0]],x2=w[kend[1]];const juist=w[onb];
  const kand=[x1*x2,x1/x2,x2/x1,juist*1000,juist/1000,x1+x2,Math.abs(x1-x2)].map(_bomRond).filter(v=>v>0&&Math.abs(v-juist)>1e-9);
  const uniek=[...new Set(kand.map(v=>_bomGeld(v,eh(onb))))].filter(s=>s!==_bomGeld(juist,eh(onb)));
  const namen=new Set([r.P,r.A,r.B].map(y=>y[1]));
  const andere=[...new Map(BOM_REL.flatMap(x=>[x.P,x.A,x.B]).filter(q=>!namen.has(q[1])).map(q=>[q[1],q])).values()];
  const g=v=>_bomGeld(v,'');
  const som={P:`${g(w.A)} · ${g(w.B)}`,A:`${g(w.P)} / ${g(w.B)}`,B:`${g(w.P)} / ${g(w.A)}`}[onb];
  return {
    ctx:r.ctx,
    gegeven:kend.map(k=>`${naam(k)}: <b>${_bomGeld(w[k],eh(k))}</b>`),
    vraag:`Bereken ${/^(vermogen|volume|bruto binnenlands product)$/.test(naam(onb))?'het':'de'} ${naam(onb)}.`,
    A:{vraag:'Welke grootheid zoek je?',opts:arcShuffle([`${sym(onb)} · ${naam(onb)}`,...arcShuffle([...kend.map(k=>`${sym(k)} · ${naam(k)}`),...arcShuffle(andere).slice(0,3).map(q=>`${q[0]} · ${q[1]}`)]).slice(0,3)]),juist:`${sym(onb)} · ${naam(onb)}`},
    B:{vraag:'Welke formule gebruik je?',opts:arcShuffle([formule,...arcShuffle(fout).slice(0,3)]),juist:formule},
    C:{vraag:'Wat is de uitkomst?',opts:arcShuffle([_bomGeld(juist,eh(onb)),...arcShuffle(uniek).slice(0,3)]),juist:_bomGeld(juist,eh(onb))},
    uitleg:`${formule} = ${som} = ${_bomGeld(juist,eh(onb))}`,
  };
}
function _bomProc(){
  if(Math.random()<0.5){
    const oud=arcPick([40,50,80,120,200,250,400,800]),pct=arcPick([5,10,15,20,25,40,50,-10,-20,-25]);
    const nieuw=_bomRond(oud*(1+pct/100));
    const f='% verandering = (nieuw − oud) / oud × 100%';
    return {ctx:'Een prijs verandert.',gegeven:[`oude prijs: <b>€ ${arcNf(oud,2)}</b>`,`nieuwe prijs: <b>€ ${arcNf(nieuw,2)}</b>`],vraag:'Bereken de procentuele verandering.',
      A:{vraag:'Welke grootheid zoek je?',opts:arcShuffle(['procentuele verandering','absolute verandering','nieuwe prijs','indexcijfer']),juist:'procentuele verandering'},
      B:{vraag:'Welke formule gebruik je?',opts:arcShuffle([f,'% verandering = (nieuw − oud) / nieuw × 100%','% verandering = nieuw / oud × 100%','% verandering = (oud − nieuw) × 100%']),juist:f},
      C:{vraag:'Wat is de uitkomst?',opts:arcShuffle([arcNf(pct,1)+'%',arcNf(_bomRond((nieuw-oud)/nieuw*100),1)+'%',arcNf(_bomRond(nieuw/oud*100),1)+'%',arcNf(-pct,1)+'%']),juist:arcNf(pct,1)+'%'},
      uitleg:`(${arcNf(nieuw,2)} − ${arcNf(oud,2)}) / ${arcNf(oud,2)} × 100% = ${arcNf(pct,1)}%`};
  }
  const geheel=arcPick([40,80,120,250,400,600,1200]),p=arcPick([5,10,12,15,20,25,30,60,75]);
  const deel=_bomRond(geheel*p/100);const f='deel = p / 100 × geheel';
  return {ctx:'Een korting of een aandeel.',gegeven:[`geheel: <b>${arcNf(geheel,0)}</b>`,`percentage: <b>${p}%</b>`],vraag:`Hoeveel is ${p}% van ${arcNf(geheel,0)}?`,
    A:{vraag:'Welke grootheid zoek je?',opts:arcShuffle(['het deel','het percentage','het geheel','de groeifactor']),juist:'het deel'},
    B:{vraag:'Welke formule gebruik je?',opts:arcShuffle([f,'deel = geheel / p','deel = p × geheel','deel = geheel − p']),juist:f},
    C:{vraag:'Wat is de uitkomst?',opts:arcShuffle([arcNf(deel,2),arcNf(_bomRond(geheel/p),2),arcNf(p*geheel,0),arcNf(geheel-p,0)].filter((v,i,a)=>a.indexOf(v)===i)),juist:arcNf(deel,2)},
    uitleg:`${p} / 100 × ${arcNf(geheel,0)} = ${arcNf(deel,2)}`};
}
const BOM={};
function bomRun(){
  Object.assign(BOM,{nr:0,strikes:0,defused:0,tijdBonus:0,fouten:0,module:0,som:null,einde:0,start:performance.now()});
  bomVolgende(true);
}
function bomTijd(){return Math.max(14,32-BOM.nr*2)*1000;}
function bomVolgende(eerste){
  BOM.som=_bomSom(ARC.vakId);BOM.module=0;BOM.nr++;BOM.strikes=0;BOM.dood=false;
  BOM.einde=performance.now()+bomTijd();
  const s=BOM.som;
  arcStage('bom',`${arcTop('Bom '+BOM.nr,`<span class="bom-defused">${BOM.defused} ontmanteld</span>`)}
    <div class="bom-wrap">
      <div class="bom-case a3-wrap" id="bom-case"><div class="a3-host a3-bom" id="a3-bom" aria-hidden="true"></div>
        <div class="bom-bolts" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <div class="bom-lont" aria-hidden="true"><svg viewBox="0 0 60 50"><path d="M4 48C8 26 30 30 34 16S52 4 56 6" fill="none" stroke="#a16207" stroke-width="4" stroke-linecap="round" stroke-dasharray="3 3"/></svg><i class="bom-vonk"></i></div>
        <div class="bom-head">
          <div class="bom-clock" id="bom-clock" aria-live="off">00:${String(Math.round(bomTijd()/1000)).padStart(2,'0')}</div>
          <div class="bom-strikes" aria-label="Fouten">${[0,1,2].map(i=>`<i class="${i<BOM.strikes?'on':''}"></i>`).join('')}</div>
        </div>
        <div class="bom-dossier"><div class="bom-ctx">${_arcEsc(s.ctx)}</div>
          <ul>${s.gegeven.map(x=>`<li>${x}</li>`).join('')}</ul><div class="bom-vraag">${_arcEsc(s.vraag)}</div></div>
        <div class="bom-mods">${['A','B','C'].map((m,i)=>`
          <section class="bom-mod${i===0?' actief':''}" id="bom-m${i}" aria-label="Module ${m}">
            <header><span class="bom-led"></span>MODULE ${m}<small>${_arcEsc(s[m].vraag)}</small></header>
            <div class="bom-opts">${s[m].opts.map(o=>`<button class="bom-opt" ${i?'disabled':''}>${_arcEsc(o)}</button>`).join('')}</div>
          </section>`).join('')}</div>
        <svg class="bom-wires" viewBox="0 0 300 64" preserveAspectRatio="none" aria-hidden="true">${[['#ef4444',12],['#3b82f6',32],['#facc15',52]].map(([c,y],i)=>`<path class="bom-w" data-i="${i}" d="M6 ${y}C80 ${y-18} 150 ${y+20} 294 ${y}" stroke="${c}" pathLength="100"/>`).join('')}</svg>
      </div>
    </div>`);
  ['A','B','C'].forEach((m,i)=>{
    document.querySelectorAll(`#bom-m${i} .bom-opt`).forEach(b=>b.addEventListener('click',()=>bomKies(i,b)));
  });
  arcA3('bom','a3-bom');
  const loop=()=>{
    const rest=BOM.einde-performance.now();
    const el=document.getElementById('bom-clock');
    if(el){const s=Math.max(0,Math.ceil(rest/1000));if(s!==BOM._sec){BOM._sec=s;el.textContent='00:'+String(s).padStart(2,'0');arcRestart(el,'tik');}el.classList.toggle('kritiek',rest<5000);}
    a3Haak('bom','tijd',Math.max(0,Math.ceil(rest/1000)),rest/bomTijd(),rest<5000);
    if(rest<=0){bomBoem('De tijd was op.');return;}
    if(rest<5000&&Math.floor(rest/250)!==BOM._piep){BOM._piep=Math.floor(rest/250);if(BOM._piep%2===0)arcFx('beep');}
    ARC.raf=requestAnimationFrame(loop);
  };
  if(eerste)arcCountdown(()=>{BOM.einde=performance.now()+bomTijd();loop();});else loop();
}
function bomKies(i,btn){
  if(i!==BOM.module||BOM.dood)return;
  const m=['A','B','C'][i];const goed=btn.textContent===BOM.som[m].juist;
  if(goed){
    btn.classList.add('goed');arcFx('snip');arcHap(18);a3Haak('bom','knip',i);
    {const w=document.querySelector(`.bom-w[data-i="${i}"]`);if(w){w.classList.add('knip');const r=w.getBoundingClientRect();arcBurst(r.left+r.width/2,r.top+r.height/2,{n:10,kleuren:['#fde047','#fb923c','#fff'],afstand:50,maat:5,val:20});}
     const led=document.querySelector(`#bom-m${i} .bom-led`);if(led){const m=arcMid(led);arcBurst(m.x,m.y,{n:8,kleuren:['#22c55e','#86efac'],afstand:36,maat:5,val:0});}}
    const sec=document.getElementById('bom-m'+i);sec.classList.remove('actief');sec.classList.add('klaar');
    sec.querySelectorAll('.bom-opt').forEach(b=>b.disabled=true);
    BOM.module++;
    if(BOM.module>=3){bomDefused();return;}
    const nx=document.getElementById('bom-m'+BOM.module);nx.classList.add('actief');nx.querySelectorAll('.bom-opt').forEach(b=>b.disabled=false);
  }else{
    btn.classList.add('fout');btn.disabled=true;BOM.strikes++;BOM.fouten++;BOM.einde-=4000;a3Haak('bom','fout');
    arcSnd('wrong');arcHap([40,30,40]);
    const c=document.getElementById('bom-case');c.classList.remove('schud');void c.offsetWidth;c.classList.add('schud');
    document.querySelectorAll('.bom-strikes i').forEach((x,k)=>x.classList.toggle('on',k<BOM.strikes));
    if(BOM.strikes>=3)bomBoem('Drie fouten: de bom ging af.');
  }
}
function bomDefused(){
  cancelAnimationFrame(ARC.raf);
  const rest=Math.max(0,BOM.einde-performance.now());BOM.defused++;BOM.tijdBonus+=rest;a3Haak('bom','ok');
  arcSnd('correct');arcHap([20,20,60]);
  const st=document.getElementById('arc-stage');
  const ov=document.createElement('div');ov.className='bom-ok';
  ov.innerHTML=`<div class="bom-ok-scan" aria-hidden="true"></div><div class="bom-ok-k">Ontmanteld</div><div class="bom-ok-t">${_arcEsc(BOM.som.uitleg)}</div><div class="bom-ok-s">${arcNf(rest/1000,1)} s over</div><button class="arc-go" id="bom-nx">Volgende bom</button>`;
  if(typeof A3S!=='undefined'&&A3S.bom){ov.style.animationDelay='.7s';}
  st.appendChild(ov);
  arcLater(()=>{const m=arcMid(ov.querySelector('.bom-ok-k'));arcBurst(m.x,m.y,{n:26,kleuren:['#22c55e','#86efac','#fde047','#fff'],afstand:160});},200);
  document.getElementById('bom-nx').onclick=()=>bomVolgende(false);
  arcLater(()=>{try{document.getElementById('bom-nx').focus({preventScroll:true});}catch(e){}},200);
}
function bomBoem(reden){
  if(BOM.dood)return;BOM.dood=true;
  cancelAnimationFrame(ARC.raf);
  document.querySelectorAll('.bom-opt').forEach(b=>b.disabled=true);
  arcFx('boom');arcHap([80,40,120,40,200]);a3Haak('bom','boem');
  const st=document.getElementById('arc-stage');
  st.classList.add('bom-flash');
  const met3d=typeof A3S!=='undefined'&&A3S.bom&&!A3S.bom.P.dood;
  const ov=document.createElement('div');ov.className='bom-boem';
  ov.innerHTML=`<div class="bom-schok" aria-hidden="true"><i></i><i></i><i></i></div><svg viewBox="0 0 200 160" class="bom-boem-svg" aria-hidden="true"><path d="M100 8l14 34 34-20-8 38 40 4-32 26 28 30-40-6-4 40-26-30-26 30-6-40-40 6 28-30-32-26 40-4-8-38 34 20z" fill="#facc15" stroke="#1f1300" stroke-width="5" stroke-linejoin="round"/><path d="M100 36l9 22 22-12-5 25 26 3-21 17 18 19-26-4-3 26-17-19-17 19-4-26-26 4 18-19-21-17 26-3-5-25 22 12z" fill="#f97316"/><text x="100" y="92" text-anchor="middle" font-family="Bricolage Grotesque,Inter,sans-serif" font-weight="900" font-size="30" fill="#fff" stroke="#1f1300" stroke-width="2.5" paint-order="stroke">BOEM!</text></svg>
    <div class="bom-boem-t">${_arcEsc(reden)}</div><div class="bom-boem-u">Zo was hij te ontmantelen: <b>${_arcEsc(BOM.som.uitleg)}</b></div>`;
  if(met3d)ov.classList.add('na3d');
  st.appendChild(ov);
  if(!met3d)arcBurst(innerWidth/2,innerHeight/2-40,{n:44,kleuren:['#1c1917','#44403c','#f97316','#facc15','#ef4444'],afstand:260,maat:11,duur:1000,val:120});
  arcLater(()=>arcResult({game:'bom',gewonnen:BOM.defused>0,kicker:BOM.defused?'Explosie na':'Direct de lucht in',groot:'',tel:{naar:BOM.defused,na:` <small>${BOM.defused===1?'bom':'bommen'}</small>`},
    sub:BOM.defused?'ontmanteld voordat het misging':'Volgende keer: eerst de grootheid, dan de formule, dan rekenen.',
    recWaarde:BOM.defused||null,stats:[['Tijd over',arcNf(BOM.tijdBonus/1000,1)+' s'],['Fouten',BOM.fouten],['Moeilijkste klok',Math.round(bomTijd()/1000)+' s']],
    xp:BOM.defused*30+Math.min(40,Math.round(BOM.tijdBonus/1000)),
    leer:'Procedurele kennis: welke grootheid, welke formule, dan pas de rekenmachine. Precies de volgorde van een examensom.'}),2300);
}

// ═══════ 👹 EXAMENBOSS ═══════
const BOSS={};
function bossVoorbereid(klaar){arcPool(ARC.vakId,p=>{BOSS.pool=p;klaar();});}
function bossRun(){
  if(!BOSS.pool||BOSS.pool.length<6){arcGeenVragen('boss');return;}
  // Ghost: een speler uit je divisie (dezelfde namen/dieren als de weekwedstrijd).
  let ghost={naam:'Sanne de Vries',animalId:'vos',stage:2};
  try{const L=ensureLeague();const c=(L.cohort||[]).slice(6,18);if(c.length){const b=arcPick(c);ghost={naam:b.naam,animalId:b.animalId,stage:b.stage};}}catch(e){}
  const div=(()=>{try{return ensureLeague().division||0;}catch(e){return 0;}})();
  Object.assign(BOSS,{hp:1000,max:1000,jij:100,combo:0,hits:0,fout:0,dmg:0,start:0,duur:180000,gebruikt:new Set(),
    ghost,ghostTijd:(150-div*8+Math.random()*30)*1000,item:null,qStart:0,klaar:false,diff:1});
  const vak=arcVak(ARC.vakId);
  arcStage('boss',`${arcTop('Examenboss',`<span class="boss-klok" id="boss-klok">3:00</span>`)}
    <div class="boss-arena">
      <div class="boss-ghost"><span class="boss-ghost-av">${bossAv(ghost)}</span><div><small>Ghost uit je divisie</small><b>${_arcEsc(ghost.naam)}</b><div class="boss-bar mini"><i id="boss-ghost-bar"></i></div></div></div>
      <div class="boss-mon a3-wrap" id="boss-mon" style="--vk:${vak&&vak.kleur||'#7c3aed'}">${bossSVG(vak)}<div class="a3-host a3-boss" id="a3-boss" aria-hidden="true"></div></div>
      <div class="boss-hp"><div class="boss-hp-l"><b>Examenboss</b><span id="boss-hp-t">1.000 / 1.000</span></div><div class="boss-bar"><i class="spoor" id="boss-hp-spoor"></i><i id="boss-hp-bar"></i></div></div>
      <div class="boss-me"><span>Jij</span><div class="boss-bar me"><i id="boss-me-bar"></i></div><span class="boss-combo" id="boss-combo"></span></div>
      <div id="boss-q"></div>
    </div>`);
  arcA3('boss','a3-boss',vak&&vak.kleur);
  arcCountdown(()=>{BOSS.start=performance.now();bossVraag();bossLoop();});
}
function bossAv(g){try{if(typeof getAnimalDisplay==='function'){const h=getAnimalDisplay(g.animalId,g.stage||0,28,'');if(h)return h;}}catch(e){}return '🦊';}
function bossSVG(vak){
  const code=_arcEsc(((vak&&vak.naam)||'CE').slice(0,2).toUpperCase());
  return `<svg viewBox="0 0 200 170" aria-hidden="true"><defs><linearGradient id="bsg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="color-mix(in srgb,var(--vk) 70%,#fff)"/><stop offset="1" stop-color="var(--vk)"/></linearGradient></defs>
    <ellipse cx="100" cy="160" rx="62" ry="8" fill="rgba(0,0,0,.35)"/>
    <path class="boss-body" d="M44 150V58c0-26 24-44 56-44s56 18 56 44v92l-14-12-14 12-14-12-14 12-14-12-14 12-14-12-14 12z" fill="url(#bsg)" stroke="#12051f" stroke-width="5" stroke-linejoin="round"/>
    <path d="M60 40l-14-22 26 12M140 40l14-22-26 12" fill="var(--vk)" stroke="#12051f" stroke-width="5" stroke-linejoin="round"/>
    <g class="boss-eyes"><ellipse cx="78" cy="72" rx="13" ry="15" fill="#fff" stroke="#12051f" stroke-width="4"/><ellipse cx="122" cy="72" rx="13" ry="15" fill="#fff" stroke="#12051f" stroke-width="4"/><circle cx="81" cy="76" r="6" fill="#12051f"/><circle cx="119" cy="76" r="6" fill="#12051f"/>
    <path d="M62 52l30 10M138 52l-30 10" stroke="#12051f" stroke-width="6" stroke-linecap="round"/></g>
    <path d="M70 108q30 22 60 0" fill="#12051f"/><path d="M76 110l6 8 6-7 6 8 6-8 6 8 6-8 6 7 6-8" fill="none" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/>
    <rect x="80" y="124" width="40" height="18" rx="5" fill="#fff" stroke="#12051f" stroke-width="3"/><text x="100" y="138" text-anchor="middle" font-family="Bricolage Grotesque,Inter,sans-serif" font-weight="900" font-size="13" fill="#12051f">${code}</text></svg>`;
}
function bossLoop(){
  const t=performance.now()-BOSS.start;const rest=Math.max(0,BOSS.duur-t);
  const k=document.getElementById('boss-klok');if(k){k.textContent=Math.floor(rest/60000)+':'+String(Math.floor(rest%60000/1000)).padStart(2,'0');k.classList.toggle('kritiek',rest<20000);}
  const gb=document.getElementById('boss-ghost-bar');if(gb)gb.style.width=Math.max(0,100-Math.min(100,t/BOSS.ghostTijd*100))+'%';
  if(rest<=0&&!BOSS.klaar){bossEinde('tijd');return;}
  ARC.raf=requestAnimationFrame(bossLoop);
}
function bossVraag(){
  if(BOSS.klaar)return;
  const it=arcNext(BOSS.pool,BOSS.gebruikt,BOSS.diff);BOSS.item=it;BOSS.qStart=performance.now();
  const o=arcOpties(it.q);BOSS.opts=o;
  const host=document.getElementById('boss-q');if(!host)return;
  host.innerHTML=arcVraagHtml(it,o,'boss-card');
  const card=host.firstElementChild;card.classList.add('in');
  arcBindOpts(card,(k,knoppen)=>bossAntwoord(k,knoppen,card));
}
function bossAntwoord(k,knoppen,card){
  const it=BOSS.item,ms=performance.now()-BOSS.qStart;const goed=k===BOSS.opts.juist;
  arcLog(it,goed,BOSS.opts.idx[k],ms);
  knoppen[BOSS.opts.juist].classList.add('goed');
  const mon=document.getElementById('boss-mon');
  if(goed){
    BOSS.combo++;BOSS.hits++;
    const basis={1:22,2:36,3:52}[it.d]||36;const snel=ms<6000?Math.round((6000-ms)/400):0;
    const mult=BOSS.combo>=5?1.5:BOSS.combo>=3?1.25:1;
    const dmg=Math.round((basis+snel)*mult);BOSS.hp=Math.max(0,BOSS.hp-dmg);BOSS.dmg+=dmg;
    BOSS.diff=Math.min(3,BOSS.diff+(BOSS.combo%2===0?1:0));
    const van=arcMid(knoppen[k]),naar=arcMid(mon);const met3d=typeof A3S!=='undefined'&&A3S.boss&&!A3S.boss.P.dood;
    if(met3d){a3Haak('boss','raak',dmg,mult>1);arcLater(()=>{arcFx('hit');arcHap(20);bossPop(`−${dmg}`,mult>1?'crit':'');bossBalken();},340);}
    else arcFly(van,naar,'<span class="boss-orb"></span>',{duur:380,boog:-40,eind:1.4,klaar:()=>{
      arcFx('hit');arcHap(20);arcBurst(naar.x,naar.y-10,{n:mult>1?20:12,kleuren:mult>1?['#fde047','#fff','#f97316']:['#fb923c','#fde047','#fff'],afstand:mult>1?110:80,maat:7});
      bossPop(`−${dmg}`,mult>1?'crit':'');arcRestart(mon,'au');bossBalken();}});
  }else{
    knoppen[k].classList.add('fout');BOSS.combo=0;BOSS.fout++;BOSS.jij=Math.max(0,BOSS.jij-25);BOSS.diff=Math.max(1,BOSS.diff-1);
    arcFx('hurt');arcHap([50,30,50]);
    const st=document.getElementById('arc-stage');a3Haak('boss','aanval');arcLater(()=>arcRestart(st,'boss-hit'),typeof A3S!=='undefined'&&A3S.boss?330:0);arcRestart(mon,'valt-aan');
    if(!arcLite()){const kl=document.createElement('div');kl.className='boss-klauw';kl.innerHTML='<i></i><i></i><i></i>';st.appendChild(kl);arcLater(()=>kl.remove(),700);}
    const uo=it.q.uo&&it.q.uo[BOSS.opts.idx[k]];
    card.insertAdjacentHTML('beforeend',`<div class="arc-uitleg"><b>Boss-aanval.</b> ${_arcEsc(uo||it.q.u||'')}</div>`);
  }
  if(!goed)bossBalken();
  if(BOSS.hp<=0){a3Haak('boss','dood');arcLater(()=>{const m=document.getElementById('boss-mon');if(m&&!(typeof A3S!=='undefined'&&A3S.boss)){m.classList.add('poef');const c=arcMid(m);arcBurst(c.x,c.y,{n:40,kleuren:['#a78bfa','#c4b5fd','#fde047','#fff'],afstand:220,maat:10,duur:1000});}arcSnd('fanfare');},450);arcLater(()=>bossEinde('win'),2300);return;}
  if(BOSS.jij<=0){a3Haak('boss','juich');arcLater(()=>bossEinde('ko'),1400);return;}
  arcLater(bossVraag,goed?520:1900);
}
function bossPop(t,cls){const m=document.getElementById('boss-mon');if(!m)return;const e=document.createElement('span');e.className='boss-pop '+cls;e.textContent=t;m.appendChild(e);arcLater(()=>e.remove(),900);}
function bossBalken(){
  const a=document.getElementById('boss-hp-bar');if(a)a.style.width=(BOSS.hp/BOSS.max*100)+'%';
  const sp=document.getElementById('boss-hp-spoor');if(sp)sp.style.width=(BOSS.hp/BOSS.max*100)+'%';
  const b=document.getElementById('boss-me-bar');if(b)b.style.width=BOSS.jij+'%';
  const t=document.getElementById('boss-hp-t');if(t)t.textContent=arcNf(BOSS.hp,0)+' / '+arcNf(BOSS.max,0);
  const c=document.getElementById('boss-combo');if(c)c.textContent=BOSS.combo>=3?`Combo ×${BOSS.combo>=5?'1,5':'1,25'}`:'';
}
function bossEinde(hoe){
  if(BOSS.klaar)return;BOSS.klaar=true;cancelAnimationFrame(ARC.raf);
  const tijd=performance.now()-BOSS.start;const win=hoe==='win';
  const sneller=win&&tijd<BOSS.ghostTijd;
  arcResult({game:'boss',gewonnen:win,kicker:win?'Examenboss verslagen':hoe==='ko'?'Knock-out':'De tijd is op',
    groot:win?arcTijd(tijd):'',tel:win?null:{naar:BOSS.dmg,na:' <small>schade</small>'},
    sub:win?(sneller?`Sneller dan ${_arcEsc(BOSS.ghost.naam)} (${arcTijd(BOSS.ghostTijd)})`:`${_arcEsc(BOSS.ghost.naam)} was sneller (${arcTijd(BOSS.ghostTijd)})`):`Nog ${arcNf(BOSS.hp,0)} HP te gaan.`,
    recWaarde:win?Math.round(tijd):null,hoger:false,
    recDelta:oud=>oud?arcNf((oud-tijd)/1000,2)+' s sneller':'',
    stats:[['Raak',BOSS.hits],['Mis',BOSS.fout],['Schade',arcNf(BOSS.dmg,0)]],
    xp:BOSS.hits*10+(win?100:0)+(sneller?40:0)});
}

// ═══════ 🎰 RISICO RUN ═══════
const RISK={};
function riskVoorbereid(klaar){arcPool(ARC.vakId,p=>{RISK.pool=p;klaar();});}
const RISK_INZET=[{id:'veilig',naam:'Veilig',d:1,pt:10,st:'★'},{id:'normaal',naam:'Normaal',d:2,pt:20,st:'★★'},{id:'risico',naam:'Risico',d:3,pt:50,st:'★★★'}];
function riskRun(){
  if(!RISK.pool||RISK.pool.length<6){arcGeenVragen('risico');return;}
  Object.assign(RISK,{bank:0,pot:0,mult:1,harten:3,nr:0,max:15,goed:0,fout:0,gebruikt:new Set(),inzet:null});
  riskScherm();riskA3();riskKeuze();
}
function riskScherm(){
  arcStage('risico',`${arcTop('Risico Run',`<span class="risk-hart" id="risk-hart">${riskHarten()}</span>`)}
    <div class="risk-wrap a3-wrap"><div class="a3-host a3-risico" id="a3-risico" aria-hidden="true"></div>
      <div class="risk-meters">
        <div class="risk-bank"><small>Op de bank</small><b id="risk-bank">${arcNf(RISK.bank,0)}</b></div>
        <div class="risk-pot"><small>In de pot</small><b id="risk-pot">${arcNf(RISK.pot,0)}</b><span id="risk-mult">×${arcNf(RISK.mult,1)}</span></div>
      </div>
      <div class="risk-teller" id="risk-teller">Vraag ${RISK.nr+1} van ${RISK.max}</div>
      <div id="risk-main"></div>
    </div>`);
}
function riskA3(){arcA3('risico','a3-risico');}
function riskHarten(){return Array.from({length:3},(_,i)=>`<span class="h${i<RISK.harten?'':' leeg'}">♥</span>`).join('');}
function riskUpd(alleen){
  const set=(id,v)=>{if(alleen&&!alleen.includes(id))return;const e=document.getElementById(id);if(e){if(!alleen)e.textContent=v;arcRestart(e,'tel');}};
  set('risk-bank',arcNf(RISK.bank,0));set('risk-pot',arcNf(RISK.pot,0));if(alleen)return;
  const m=document.getElementById('risk-mult');if(m)m.textContent='×'+arcNf(RISK.mult,1);
  const h=document.getElementById('risk-hart');if(h)h.innerHTML=riskHarten();
  const t=document.getElementById('risk-teller');if(t)t.textContent=`Vraag ${Math.min(RISK.nr+1,RISK.max)} van ${RISK.max}`;
}
function riskKeuze(){
  if(RISK.harten<=0||RISK.nr>=RISK.max){riskEinde();return;}
  const m=document.getElementById('risk-main');
  m.innerHTML=`<div class="risk-kies"><div class="risk-kies-h">Kies je inzet</div>
    <div class="risk-chips">${RISK_INZET.map(z=>`<button class="risk-chip risk-${z.id}" data-z="${z.id}"><span class="risk-st">${z.st}</span><b>${z.naam}</b><span class="risk-pt">+${Math.round(z.pt*RISK.mult)}</span></button>`).join('')}</div>
    <p class="risk-uitleg">Moeilijker = meer punten. Een fout kost je de pot en een hartje.</p></div>`;
  m.querySelectorAll('.risk-chip').forEach(b=>b.onclick=()=>{arcSnd('tap');RISK.inzet=RISK_INZET.find(z=>z.id===b.dataset.z);riskVraag();});
}
function riskVraag(){
  const it=arcNext(RISK.pool,RISK.gebruikt,RISK.inzet.d);RISK.item=it;RISK.t0=performance.now();
  const o=arcOpties(it.q);RISK.opts=o;
  const m=document.getElementById('risk-main');
  m.innerHTML=`<div class="risk-inzet risk-${RISK.inzet.id}">${RISK.inzet.st} ${RISK.inzet.naam} · +${Math.round(RISK.inzet.pt*RISK.mult)}</div>`+arcVraagHtml(it,o,'risk-card');
  const card=m.querySelector('.arc-q');
  arcBindOpts(card,(k,knoppen)=>{
    const goed=k===o.juist;RISK.nr++;
    arcLog(it,goed,o.idx[k],performance.now()-RISK.t0);
    knoppen[o.juist].classList.add('goed');
    if(goed){
      RISK.goed++;const w=Math.round(RISK.inzet.pt*RISK.mult);const oudPot=RISK.pot;RISK.pot+=w;RISK.mult=Math.min(4,_bomRond(RISK.mult+0.5));
      arcSnd('coin');arcHap(16);
      const van=arcMid(knoppen[k]),naar=arcMid(document.getElementById('risk-pot'));
      for(let c=0;c<Math.min(7,2+Math.round(w/15));c++)arcFly(van,naar,'<span class="risk-munt"></span>',{delay:c*70,duur:520,boog:-90-c*6,eind:.7});
      a3Haak('risico','pot',RISK.pot);
      arcLater(()=>{arcTel(document.getElementById('risk-pot'),RISK.pot,{van:oudPot,duur:500});riskUpd(['risk-pot']);},560);
      arcLater(()=>riskBeslis(w),1000);
    }else{
      knoppen[k].classList.add('fout');RISK.fout++;const verlies=RISK.pot;RISK.pot=0;RISK.mult=1;RISK.harten--;a3Haak('risico','verlies');
      arcSnd('wrong');arcHap([50,30,50]);
      const hartjes=document.querySelectorAll('#risk-hart .h');const weg=hartjes[RISK.harten];
      if(weg){const m=arcMid(weg);arcBurst(m.x,m.y,{n:10,kleuren:['#f87171','#ef4444','#fecaca'],afstand:40,maat:6,val:30});}
      arcRestart(document.querySelector('.risk-pot'),'leeg');
      arcLater(()=>riskUpd(),220);
      const uo=it.q.uo&&it.q.uo[o.idx[k]];
      card.insertAdjacentHTML('beforeend',`<div class="arc-uitleg"><b>${verlies?`Pot van ${arcNf(verlies,0)} kwijt.`:'Mis.'}</b> ${_arcEsc(uo||it.q.u||'')}</div><button class="arc-go risk-verder">Verder</button>`);
      card.querySelector('.risk-verder').onclick=riskKeuze;
    }
  });
}
function riskBeslis(w){
  if(RISK.nr>=RISK.max){riskOpslaan(true);return;}
  const m=document.getElementById('risk-main');
  m.innerHTML=`<div class="risk-beslis"><div class="risk-plus">+${arcNf(w,0)}</div>
    <div class="risk-beslis-h">Pot: <b>${arcNf(RISK.pot,0)}</b></div>
    <div class="risk-beslis-b"><button class="risk-bankknop" id="risk-op"><span>🏦</span>Opslaan<small>zet ${arcNf(RISK.pot,0)} veilig</small></button>
    <button class="risk-doorknop" id="risk-door"><span>🔥</span>Doorgaan<small>volgende ×${arcNf(RISK.mult,1)}</small></button></div></div>`;
  document.getElementById('risk-op').onclick=()=>riskOpslaan(false);
  document.getElementById('risk-door').onclick=()=>{arcSnd('tap');riskKeuze();};
}
function riskOpslaan(einde){
  const pot=RISK.pot,oudBank=RISK.bank;RISK.bank+=pot;RISK.pot=0;RISK.mult=1;arcFx('vault');arcHap([20,20,40]);a3Haak('risico','bank');
  const van=arcMid(document.getElementById('risk-pot')),naar=arcMid(document.getElementById('risk-bank'));
  for(let c=0;c<Math.min(8,2+Math.round(pot/25));c++)arcFly(van,naar,'<span class="risk-munt"></span>',{delay:c*60,duur:480,boog:-50,eind:.7});
  arcLater(()=>{riskUpd();arcTel(document.getElementById('risk-bank'),RISK.bank,{van:oudBank,duur:600});arcRestart(document.querySelector('.risk-bank'),'kluis');
    const m=arcMid(document.getElementById('risk-bank'));arcBurst(m.x,m.y,{n:14,kleuren:['#fde047','#facc15','#fff'],afstand:70,maat:6,val:10});},520);
  if(einde||RISK.nr>=RISK.max){arcLater(riskEinde,1300);return;}
  arcLater(riskKeuze,700);
}
function riskEinde(){
  const verloren=RISK.pot;
  arcResult({game:'risico',gewonnen:RISK.bank>0,kicker:RISK.harten<=0?'Geen hartjes meer':'Run voltooid',groot:'',tel:{naar:RISK.bank,na:' <small>punten</small>'},
    sub:verloren?`${arcNf(verloren,0)} punten stonden nog in de pot en zijn niet opgeslagen.`:'Alles wat op de bank staat, telt.',
    recWaarde:RISK.bank,stats:[['Goed',RISK.goed],['Fout',RISK.fout],['Vragen',RISK.nr]],
    xp:Math.min(220,Math.round(RISK.bank/8)+RISK.goed*4),
    leer:'Je beheersing telt je echte antwoorden, los van hoeveel je waagde.'});
}

// ═══════ 🎯 ZWAKKE PLEK ═══════
const ZWAK={};
function zwakVoorbereid(klaar){
  // Vakken waarin je al oefende + het gekozen vak: die laden we, daarna kiest
  // de mastery-laag (weakestLeerdoelen) het zwakste leerdoel.
  const lvl=(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo';
  let ids=[ARC.vakId];
  try{const p=getProgress();Object.keys(p).forEach(k=>{const v=k.split('_')[0];if(arcVak(v)&&!ids.includes(v))ids.push(v);});}catch(e){}
  ids=ids.slice(0,6);
  let open=ids.length;
  const na=()=>{if(--open>0)return;
    let doel=null;
    // Vanuit Clash: meteen het leerdoel waar het in het potje misging.
    if(ZWAK.forceLd){const id=ZWAK.forceLd;ZWAK.forceLd=null;try{const m=ldMastery(ARC.vakId,id);if(zwakVragen(ARC.vakId,id).length>=5){const f=zwakLd(ARC.vakId,id);doel=Object.assign({},m,{vakId:ARC.vakId,ldId:id,naam:f.ld.naam,vakNaam:(arcVak(ARC.vakId)||{}).naam});}}catch(e){}}
    if(doel){ZWAK.doel=doel;klaar();return;}
    try{doel=weakestLeerdoelen({vakIds:ids,limit:12,maxScore:0.8}).find(m=>zwakVragen(m.vakId,m.ldId).length>=5);}catch(e){}
    if(!doel){try{doel=weakestLeerdoelen({vakIds:[ARC.vakId],limit:30,includeUnpracticed:true,maxScore:0.8}).find(m=>zwakVragen(m.vakId,m.ldId).length>=5);}catch(e){}}
    ZWAK.doel=doel;klaar();};
  ids.forEach(id=>{try{ensureVakData(lvl,id,na);}catch(e){na();}});
}
function zwakLd(vakId,ldId){
  const vak=arcVak(vakId);if(!vak)return null;
  for(const d of vak.domeinen||[]){if(d.id===ldId)return {ld:d,dom:d};const l=(d.leerdoelen||[]).find(x=>x.id===ldId);if(l)return {ld:l,dom:d};}
  return null;
}
function zwakVragen(vakId,ldId){
  const f=zwakLd(vakId,ldId);if(!f)return [];
  return (f.ld.sv||[]).filter(q=>q&&Array.isArray(q.o)&&q.o.length>=3&&typeof q.c==='number'&&!_ARC_NIET_LOS.test(q.v))
    .map(q=>({q,domId:f.dom.id,domNaam:f.dom.naam,ldId,ldNaam:f.ld.naam,d:q.d||2}));
}
function zwakIntroExtra(){
  const d=ZWAK.doel;
  if(!d)return '<div class="zwak-geen">Oefen eerst een paar quizzen in dit vak. Daarna vindt Vonk je zwakste leerdoel.</div>';
  const pct=Math.round((d.score||0)*100);
  return `<div class="zwak-found"><div class="zwak-vonk">${typeof mascotSVG==='function'?mascotSVG('kijk',64):''}</div>
    <div><div class="zwak-bubble">${d.unpracticed?'Hier heb je nog niet mee geoefend.':'Ik heb je zwakke plek gevonden.'}</div>
    <div class="zwak-ld"><b>${_arcEsc(d.naam||d.ldId)}</b><span>${_arcEsc(d.vakNaam||'')} · ${d.unpracticed?'nog niet geoefend':'beheersing '+pct+'%'}</span></div></div></div>`;
}
// Tekst laten 'typen' (Vonk praat).
function arcTyp(el,tekst,ms){if(!el)return;if(arcLite()){el.textContent=tekst;return;}el.textContent='';let i=0;const t=setInterval(()=>{el.textContent=tekst.slice(0,++i);if(i>=tekst.length)clearInterval(t);},ms||28);ARC.timers.push(t);}
function zwakRun(){
  const d=ZWAK.doel;if(!d){arcClose();return;}
  ARC.vakId=d.vakId;
  const voor=ldMastery(d.vakId,zwakLd(d.vakId,d.ldId).ld);
  ZWAK.a3host=null;Object.assign(ZWAK,{pool:zwakVragen(d.vakId,d.ldId),gebruikt:new Set(),stap:0,max:5,goed:0,herkans:0,diff:1,voor,log:[],misser:null});
  zwakVraag();
}
function zwakKop(){
  const d=ZWAK.doel;
  return `${arcTop('Zwakke plek',`<span class="zwak-teller">${Math.min(ZWAK.stap+1,ZWAK.max)}/${ZWAK.max}</span>`)}
    <div class="zwak-band"><b>${_arcEsc(d.naam||d.ldId)}</b><span>${['Basis','Toepassing','Valkuil'][Math.min(2,ZWAK.diff-1)]}</span></div>
    <div class="zwak-steps">${Array.from({length:ZWAK.max},(_,i)=>`<i class="${i<ZWAK.log.length?(ZWAK.log[i]?'ok':'mis'):''}"></i>`).join('')}</div>`;
}
function zwakVraag(herkans){
  const it=arcNext(ZWAK.pool,ZWAK.gebruikt,ZWAK.diff);ZWAK.item=it;ZWAK.t0=performance.now();
  const o=arcOpties(it.q);ZWAK.opts=o;
  const oud=document.getElementById('a3-zwak');
  arcStage('zwak',`${zwakKop()}<div class="zwak-wrap"><div class="a3-host a3-zwak" id="a3-zwak-plek" aria-hidden="true"></div>${herkans?`<div class="zwak-herkans">${typeof mascotSVG==='function'?mascotSVG('knipoog',40):''}<span>Een vergelijkbare. Nu jij.</span></div>`:''}${arcVraagHtml(it,o,'zwak-card')}</div>`);
  const card=document.querySelector('#arc-stage .arc-q');
  // Het dartbord blijft tussen de vragen staan: we verhuizen de bestaande host.
  const plek=document.getElementById('a3-zwak-plek');
  if(ZWAK.a3host&&typeof A3S!=='undefined'&&A3S.zwak&&!A3S.zwak.P.dood){plek.replaceWith(ZWAK.a3host);}
  else{plek.id='a3-zwak';ZWAK.a3host=plek;arcA3('zwak','a3-zwak');}
  arcBindOpts(card,(k,knoppen)=>zwakAntwoord(k,knoppen,card,!!herkans));
}
function zwakAntwoord(k,knoppen,card,herkans){
  const it=ZWAK.item,o=ZWAK.opts;const goed=k===o.juist;
  arcLog(it,goed,o.idx[k],performance.now()-ZWAK.t0);
  knoppen[o.juist].classList.add('goed');
  if(!herkans){ZWAK.log.push(goed);ZWAK.stap++;if(goed)ZWAK.goed++;}
  else if(goed)ZWAK.herkans++;
  a3Haak('zwak','gooi',goed,Math.min(1,(ZWAK.goed+ZWAK.herkans)/ZWAK.max));
  if(goed){
    arcSnd('correct');arcHap(16);ZWAK.diff=Math.min(3,ZWAK.diff+1);
    card.insertAdjacentHTML('beforeend',`<div class="arc-uitleg goed">${herkans?'<b>Gerepareerd.</b> ':''}${_arcEsc(it.q.u||'')}</div><button class="arc-go zwak-door">Verder</button>`);
    card.querySelector('.zwak-door').onclick=zwakVerder;
  }else{
    knoppen[k].classList.add('fout');arcSnd('wrong');arcHap([40,30,40]);
    const uo=it.q.uo&&it.q.uo[o.idx[k]];ZWAK.misser=uo||it.q.u;
    card.insertAdjacentHTML('beforeend',`<div class="zwak-aha"><span>${typeof mascotSVG==='function'?mascotSVG('denk',44):''}</span><div><b>Aha. Dáár gaat het mis.</b><p>${_arcEsc(uo||it.q.u||'')}</p>${it.q.uh?`<p class="zwak-uh">Onthoud: ${_arcEsc(it.q.uh)}</p>`:''}</div></div>
      <button class="arc-go zwak-door">${herkans?'Verder':'Probeer een vergelijkbare'}</button>`);
    card.querySelector('.zwak-door').onclick=()=>herkans?zwakVerder():zwakVraag(true);
  }
}
function zwakVerder(){if(ZWAK.stap>=ZWAK.max){zwakEinde();return;}zwakVraag(false);}
function zwakEinde(){
  const d=ZWAK.doel;const f=zwakLd(d.vakId,d.ldId);
  try{saveProgress(d.vakId,d.ldId,'snel',ZWAK.goed,ZWAK.max);}catch(e){}
  try{if(typeof _flushQBatch==='function')_flushQBatch();}catch(e){}
  const na=ldMastery(d.vakId,f.ld);
  const v=Math.round((ZWAK.voor.hasData?ZWAK.voor.score:0)*100),n=Math.round((na.hasData?na.score:0)*100);
  const beter=n>v;const gerepareerd=beter&&(n>=65||n-v>=15);
  const ring=(p,c)=>`<svg viewBox="0 0 120 120" class="zwak-ring"><circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" stroke-opacity=".14" stroke-width="12"/><circle class="zwak-ring-v" cx="60" cy="60" r="50" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round" pathLength="100" stroke-dasharray="${p} 100" style="--p:${p}" transform="rotate(-90 60 60)"/></svg>`;
  arcResult({game:'zwak',gewonnen:gerepareerd||ZWAK.goed>=3,kicker:gerepareerd?'🎯 Zwakke plek gerepareerd':beter?'Vooruitgang':'Nog even doorzetten',
    groot:`<span class="zwak-van">${v}%</span><span class="zwak-pijl">→</span><span class="zwak-naar">${n}%</span>`,
    sub:`${_arcEsc(d.naam||d.ldId)} · ${ZWAK.goed} van ${ZWAK.max} goed${ZWAK.herkans?` · ${ZWAK.herkans}× hersteld na een fout`:''}`,
    recWaarde:null,geenRecPill:true,stats:null,
    xp:ZWAK.goed*15+ZWAK.herkans*10+(gerepareerd?50:0),
    leer:ZWAK.misser&&!gerepareerd?`Waar het misging: ${_arcEsc(ZWAK.misser)}`:`Beheersing komt uit je beste score op dit leerdoel. ${gerepareerd?'Vonk zoekt de volgende keer een nieuwe zwakke plek.':''}`});
  if(gerepareerd){const s=arcStore();s.zwak=Object.assign({},s.zwak||{},{best:((s.zwak&&s.zwak.best)||0)+1});arcSave(s);}
  const big=document.querySelector('.arc-res-big');if(big)big.insertAdjacentHTML('beforebegin',`<div class="zwak-rings${gerepareerd?' fix':''}">${ring(v,'#f97316')}${ring(n,gerepareerd?'#22c55e':'#facc15')}${gerepareerd?'<div class="zwak-stempel">Gerepareerd</div>':''}</div>`);
  if(gerepareerd)arcLater(()=>{const m=arcMid(document.querySelector('.zwak-rings'));arcBurst(m.x,m.y,{n:34,afstand:180,kleuren:['#22c55e','#86efac','#f97316','#fde047']});arcSnd('levelup');},1500);
}

// ═══════ 🧩 SORTEER ═══════
// Met de hand geschreven reeksen (volgorde = waarheid), plus een generator
// voor wiskunde. Een reeks heeft een soort (tijd, proces, oorzaak → gevolg,
// klein → groot) en hooguit 6 kaarten per ronde.
const SORT_REEKS=[
  {vak:['bi'],soort:'Proces',t:'Van DNA naar eigenschap',k:['DNA','gen','mRNA','eiwit','eigenschap']},
  {vak:['bi'],soort:'Klein → groot',t:'Organisatieniveaus',k:['cel','weefsel','orgaan','orgaanstelsel','organisme']},
  {vak:['bi'],soort:'Route',t:'De weg van je voedsel',k:['mond','slokdarm','maag','dunne darm','dikke darm','endeldarm']},
  {vak:['bi'],soort:'Route',t:'Kleine bloedsomloop',k:['rechterkamer','longslagader','longen','longader','linkerboezem']},
  {vak:['bi'],soort:'Route',t:'Grote bloedsomloop',k:['linkerkamer','aorta','slagaders','haarvaten in organen','holle ader','rechterboezem']},
  {vak:['bi'],soort:'Proces',t:'Fasen van de mitose',k:['profase','metafase','anafase','telofase']},
  {vak:['bi'],soort:'Proces',t:'Een reflexboog',k:['receptor','sensorische zenuwcel','schakelcel in het ruggenmerg','motorische zenuwcel','spier (effector)']},
  {vak:['bi'],soort:'Route',t:'De luchtweg naar binnen',k:['neusholte','keelholte','strottenhoofd','luchtpijp','bronchiën','longblaasjes']},
  {vak:['bi'],soort:'Proces',t:'Van bevruchting tot geboorte',k:['bevruchting','klievingsdelingen','innesteling','embryo','foetus','geboorte']},
  {vak:['bi'],soort:'Voedselketen',t:'Wie eet wie?',k:['zonlicht','plant (producent)','rups','koolmees','sperwer']},
  {vak:['gs'],soort:'Tijd',t:'Kantelpunten',k:['Begin Opstand tegen Spanje (1568)','Vrede van Münster (1648)','Franse Revolutie (1789)','Grondwet van Thorbecke (1848)','Begin Eerste Wereldoorlog (1914)','Begin Tweede Wereldoorlog (1939)']},
  {vak:['gs'],soort:'Tijd',t:'De tien tijdvakken',k:['jagers en boeren','Grieken en Romeinen','monniken en ridders','steden en staten','ontdekkers en hervormers','regenten en vorsten','pruiken en revoluties','burgers en stoommachines','wereldoorlogen','televisie en computer'],max:6},
  {vak:['gs'],soort:'Oorzaak → gevolg',t:'Industrialisatie',k:['stoommachine','fabrieken','trek naar de stad','slechte woon- en werkomstandigheden','vakbonden en sociale wetten']},
  {vak:['gs'],soort:'Tijd',t:'Aanloop naar de Grote Oorlog',k:['moord op Frans Ferdinand','Oostenrijk-Hongarije verklaart Servië de oorlog','Duitsland valt België binnen','loopgravenoorlog aan het westfront','wapenstilstand (november 1918)']},
  {vak:['gs'],soort:'Tijd',t:'De Koude Oorlog',k:['Marshallplan (1947)','Berlijnse blokkade (1948)','oprichting NAVO (1949)','bouw van de Berlijnse Muur (1961)','Cubacrisis (1962)','val van de Muur (1989)']},
  {vak:['gs'],soort:'Tijd',t:'Nederland in oorlog',k:['Duitse inval (mei 1940)','Februaristaking (1941)','Hongerwinter (1944-1945)','bevrijding (mei 1945)']},
  {vak:['gs'],soort:'Tijd',t:'Van Verlichting tot koninkrijk',k:['ideeën van de Verlichting','Amerikaanse onafhankelijkheidsverklaring (1776)','Franse Revolutie (1789)','Bataafse Republiek (1795)','Koninkrijk der Nederlanden (1815)']},
  {vak:['ec'],soort:'Cyclus',t:'Conjunctuur (begin bij de top)',k:['hoogconjunctuur','recessie','laagconjunctuur','herstel']},
  {vak:['ec'],soort:'Oorzaak → gevolg',t:'De rente stijgt',k:['ECB verhoogt de rente','lenen wordt duurder','bestedingen en investeringen dalen','vraag naar goederen daalt','inflatie daalt']},
  {vak:['ec'],soort:'Oorzaak → gevolg',t:'Loon-prijsspiraal',k:['lonen stijgen','productiekosten stijgen','bedrijven verhogen prijzen','koopkracht daalt','vakbonden eisen hogere lonen']},
  {vak:['ec'],soort:'Oorzaak → gevolg',t:'De vraag stijgt',k:['vraag stijgt','tekort bij de oude prijs','prijs stijgt','aanbod neemt toe','nieuw evenwicht']},
  {vak:['ec','be'],soort:'Van boven naar beneden',t:'Van brutoloon naar besteding',k:['brutoloon','belasting en premies eraf','nettoloon','besteden of sparen']},
  {vak:['be'],soort:'Resultatenrekening',t:'Van omzet naar nettowinst',k:['omzet','brutowinst','bedrijfsresultaat','winst vóór belasting','nettowinst']},
  {vak:['na','na1'],soort:'Energieketen',t:'Kolencentrale',k:['chemische energie in kolen','warmte in stoom','bewegingsenergie van de turbine','elektrische energie uit de generator','transport over het hoogspanningsnet']},
  {vak:['na','na1'],soort:'Route',t:'Van centrale naar stopcontact',k:['elektriciteitscentrale','transformator omhoog','hoogspanningskabels','transformator omlaag','stopcontact thuis']},
  {vak:['na','na1','wa','wb','wi'],soort:'Klein → groot',t:'Lengtematen',k:['nanometer','micrometer','millimeter','meter','kilometer']},
  {vak:['na','na1'],soort:'Laag → hoog',t:'Frequentie van straling',k:['radiogolven','microgolven','infrarood','zichtbaar licht','ultraviolet','röntgenstraling','gammastraling'],max:6},
  {vak:['na','na1'],soort:'Proces',t:'Vallen met luchtweerstand',k:['loslaten','snelheid neemt toe','luchtweerstand neemt toe','resulterende kracht wordt nul','constante eindsnelheid']},
  {vak:['sk','na2'],soort:'Klein → groot',t:'Van deeltje tot molecuul',k:['proton','atoomkern','atoom','molecuul']},
  {vak:['sk','na2'],soort:'Proces',t:'Destillatie',k:['mengsel verwarmen','stof met het laagste kookpunt verdampt','damp koelt af in de koeler','destillaat wordt opgevangen']},
  {vak:['sk','na2'],soort:'Proces',t:'Een reactie op deeltjesniveau',k:['beginstoffen','deeltjes botsen','activeringsenergie bereikt','reactieproducten']},
  {vak:['sk','na2'],soort:'Zuur → basisch',t:'pH, ongeveer',k:['zoutzuur (pH 1)','azijn (pH 3)','zuiver water (pH 7)','zeepsop (pH 10)','gootsteenontstopper (pH 13)']},
  {vak:['ak'],soort:'Cyclus',t:'De waterkringloop (begin bij verdamping)',k:['verdamping','condensatie tot wolken','neerslag','afstroming naar rivieren','zee']},
  {vak:['ak'],soort:'Van de grond omhoog',t:'Lagen van de atmosfeer',k:['troposfeer','stratosfeer','mesosfeer','thermosfeer']},
  {vak:['ak'],soort:'Proces',t:'Van magma tot sedimentgesteente',k:['magma','stolling','verwering en erosie','afzetting','sedimentgesteente']},
  {vak:['ak'],soort:'Fasen',t:'Demografische transitie',k:['hoge geboorte en hoge sterfte','sterfte daalt','geboorte daalt','lage geboorte en lage sterfte']},
  {vak:['ak'],soort:'Route',t:'Een rivier, van bron tot zee',k:['bron','bovenloop','middenloop','benedenloop','monding']},
  {vak:['mw','ma'],soort:'Proces',t:'Hoe een wet ontstaat',k:['wetsvoorstel van de regering','advies van de Raad van State','behandeling in de Tweede Kamer','behandeling in de Eerste Kamer','ondertekening door koning en minister','publicatie in het Staatsblad']},
  {vak:['mw','ma'],soort:'Proces',t:'Van aangifte tot vonnis',k:['aangifte','opsporing door de politie','OM besluit te vervolgen','rechtszaak','vonnis']},
  {vak:['mw','ma'],soort:'Proces',t:'Een nieuw kabinet',k:['Tweede Kamerverkiezingen','verkenner','informateur','coalitieakkoord','formateur zoekt ministers','beëdiging van het kabinet']},
  {vak:['nl'],soort:'Opbouw',t:'Een betoog',k:['inleiding met standpunt','argumenten','weerlegging van een tegenargument','conclusie']},
  {vak:['nl'],soort:'Opbouw',t:'Probleem-oplossingstructuur',k:['probleem','oorzaken','mogelijke oplossingen','beste oplossing']},
];
function _sortGen(){
  // Wiskunde: breuken, decimalen en procenten door elkaar, van klein naar groot.
  const bron=[[1,8],[1,5],[1,4],[3,10],[1,3],[2,5],[1,2],[3,5],[2,3],[3,4],[4,5],[9,10]];
  const k=arcShuffle(bron).slice(0,5).sort((a,b)=>a[0]/a[1]-b[0]/b[1]);
  const vorm=([t,n],i)=>{const w=t/n;const r=i%3;if(r===0)return `${t}/${n}`;if(r===1&&Number.isInteger(Math.round(w*1000)/10))return arcNf(w*100,1)+'%';return arcNf(Math.round(w*1000)/1000,3);};
  return {soort:'Klein → groot',t:'Breuken, decimalen en procenten',k:k.map(vorm),gen:true};
}
function sortReeksen(vakId){
  let r=SORT_REEKS.filter(x=>x.vak.includes(vakId));
  if(['wa','wb','wi'].includes(vakId))r=r.concat([_sortGen(),_sortGen(),_sortGen()]);
  return r;
}
const SORT={};
function sortRun(){
  let r=sortReeksen(ARC.vakId);const gemengd=r.length<3;
  if(gemengd)r=SORT_REEKS.slice();
  SORT.rondes=arcShuffle(r).slice(0,5).map(x=>{let k=x.k;if(x.max&&k.length>x.max){const idx=arcShuffle(k.map((_,i)=>i)).slice(0,x.max).sort((a,b)=>a-b);k=idx.map(i=>x.k[i]);}return Object.assign({},x,{k});});
  Object.assign(SORT,{i:0,totaal:0,fouten:0,recs:0,gemengd});
  sortRonde(true);
}
function _sortId(x){return x.gen?null:'s_'+x.t;}
function sortRonde(eerste){
  const x=SORT.rondes[SORT.i];SORT.x=x;SORT.pos=0;SORT.straf=0;SORT.t0=0;
  const kaarten=arcShuffle(x.k.map((t,i)=>({t,i})));
  arcStage('sorteer',`${arcTop('Sorteer',`<span class="sort-klok" id="sort-klok">0,00 s</span>`)}
    <div class="sort-wrap">
      <div class="sort-k">${_arcEsc(x.soort)} · ronde ${SORT.i+1} van ${SORT.rondes.length}${SORT.gemengd&&SORT.i===0?' · gemengde reeksen':''}</div>
      <h2 class="sort-t">${_arcEsc(x.t)}</h2>
      <div class="a3-host a3-sorteer" id="a3-sorteer" aria-hidden="true"></div>
      <ol class="sort-slots">${x.k.map((_,i)=>`<li data-i="${i}"><span>${i+1}</span></li>`).join('')}</ol>
      <div class="sort-deck">${kaarten.map(c=>`<button class="sort-card" data-i="${c.i}">${_arcEsc(c.t)}</button>`).join('')}</div>
      <p class="sort-hint">Tik de kaarten in de goede volgorde. Een fout kost 1 seconde.</p>
    </div>`);
  document.querySelectorAll('.sort-card').forEach(b=>b.addEventListener('click',()=>sortTik(b)));
  arcA3('sorteer','a3-sorteer',x.k.length);
  const go=()=>{SORT.t0=performance.now();const loop=()=>{const e=document.getElementById('sort-klok');if(e)e.textContent=arcNf((performance.now()-SORT.t0+SORT.straf)/1000,2)+' s';ARC.raf=requestAnimationFrame(loop);};loop();};
  if(eerste)arcCountdown(go);else go();
}
function sortTik(b){
  if(b.disabled||!SORT.t0)return;
  const i=+b.dataset.i;
  if(i===SORT.pos){
    const slot=document.querySelector(`.sort-slots li[data-i="${SORT.pos}"]`);
    const van=arcMid(b),naar=slot?arcMid(slot):van;const tekst=b.textContent;
    b.disabled=true;b.classList.add('weg');arcSnd('pop');arcHap(10);arcLater(()=>{b.style.display='none';},170);
    const vul=()=>{if(slot&&!slot.classList.contains('vol')){slot.classList.add('vol');slot.insertAdjacentHTML('beforeend',`<b>${_arcEsc(tekst)}</b>`);}};
    if(slot&&!arcLite())arcFly(van,{x:naar.x,y:naar.y},`<span class="sort-vlieg">${_arcEsc(tekst)}</span>`,{duur:300,boog:-30,eind:.9,klaar:vul});else vul();
    a3Haak('sorteer','zet',SORT.pos);
    SORT.pos++;
    if(SORT.pos>=SORT.x.k.length)sortKlaar();
  }else{
    SORT.straf+=1000;SORT.fouten++;arcSnd('wrong');arcHap([30,20,30]);a3Haak('sorteer','fout');
    b.classList.remove('schud');void b.offsetWidth;b.classList.add('schud');
  }
}
function sortKlaar(){
  cancelAnimationFrame(ARC.raf);arcLater(()=>a3Haak('sorteer','klaar'),450);
  arcLater(()=>document.querySelectorAll('.sort-slots li').forEach((li,i)=>{li.style.setProperty('--d',(i*70)+'ms');li.classList.add('glans');}),320);
  const ms=performance.now()-SORT.t0+SORT.straf;SORT.totaal+=ms;
  const id=_sortId(SORT.x);let regel='';
  if(id){const s=arcStore();s._sort=s._sort||{};const oud=s._sort[id];
    if(oud==null||ms<oud){s._sort[id]=Math.round(ms);if(oud!=null){SORT.recs++;regel=`<b>${arcNf((oud-ms)/1000,2)} s sneller</b> dan je record`;}else regel='Eerste tijd op deze reeks';}
    else regel=`Record ${arcNf(oud/1000,2)} s`;
    arcSave(s);}
  arcSnd(regel.includes('sneller')?'combo':'correct');
  const st=document.getElementById('arc-stage');
  const ov=document.createElement('div');ov.className='sort-ok';
  ov.innerHTML=`<div class="sort-ok-t">${arcNf(ms/1000,2)} s</div><div class="sort-ok-r">${regel}</div><button class="arc-go" id="sort-nx">${SORT.i+1<SORT.rondes.length?'Volgende reeks':'Uitslag'}</button>`;
  st.querySelector('.sort-wrap').appendChild(ov);
  if(regel.includes('sneller'))arcLater(()=>{const m=arcMid(ov.querySelector('.sort-ok-t'));arcBurst(m.x,m.y,{n:22,afstand:120,kleuren:['#22c55e','#86efac','#fde047']});},200);
  arcTel(ov.querySelector('.sort-ok-t'),ms/1000,{fmt:v=>arcNf(v,2)+' s',duur:600});
  document.getElementById('sort-nx').onclick=()=>{SORT.i++;if(SORT.i<SORT.rondes.length)sortRonde(false);else sortEinde();};
}
function sortEinde(){
  arcResult({game:'sorteer',gewonnen:true,kicker:'Vijf reeksen gesorteerd',groot:arcNf(SORT.totaal/1000,2)+' <small>s</small>',
    sub:SORT.recs?`${SORT.recs} ${SORT.recs===1?'reeks':'reeksen'} sneller dan ooit`:'Speel opnieuw en jaag op je eigen tijden.',
    recWaarde:Math.round(SORT.totaal),hoger:false,recDelta:oud=>oud?arcNf((oud-SORT.totaal)/1000,2)+' s sneller':'',
    stats:[['Fouten',SORT.fouten],['Records',SORT.recs],['Per reeks',arcNf(SORT.totaal/SORT.rondes.length/1000,1)+' s']],
    xp:SORT.rondes.length*20+SORT.recs*10});
}

// ═══════ 🪤 VAL OF WAAR ═══════
const VAL={};
function valVoorbereid(klaar){arcPool(ARC.vakId,p=>{VAL.pool=p;klaar();});}
function valRun(){
  // Sjabloonvragen ('Wat betekent «X»?') werken niet als stelling: die slaan we hier over.
  if(VAL.pool)VAL.pool=VAL.pool.filter(x=>!/^wat betekent «|welk begrip|hoort bij deze omschrijving|welke term|herken je hier|wat is de juiste term/i.test(x.q.v));
  if(!VAL.pool||VAL.pool.length<8){arcGeenVragen('val');return;}
  Object.assign(VAL,{score:0,streak:0,beste:0,goed:0,fout:0,vallen:0,duur:60000,gebruikt:new Set(),klaar:false,pauze:0});
  arcStage('val',`${arcTop('Val of waar',`<span class="val-klok" id="val-klok">60</span>`)}
    <div class="val-wrap a3-wrap"><div class="a3-host a3-val" id="a3-val" aria-hidden="true"></div><div class="val-score"><b id="val-score">0</b><span id="val-streak"></span></div>
      <div class="val-meter" aria-hidden="true"><i id="val-meter"></i></div>
      <div class="val-stapel"><div class="val-achter a2"></div><div class="val-achter a1"></div><div id="val-stapel"></div></div>
      <div class="val-feed" id="val-feed" aria-live="polite"></div>
      <div class="val-knoppen"><button class="val-no" id="val-no" aria-label="Val">✕<small>Val</small></button><button class="val-yes" id="val-yes" aria-label="Klopt">✓<small>Klopt</small></button></div>
    </div>`);
  document.getElementById('val-no').onclick=()=>valOordeel(false);
  document.getElementById('val-yes').onclick=()=>valOordeel(true);
  const key=e=>{if(e.key==='ArrowLeft'){e.preventDefault();valOordeel(false);}if(e.key==='ArrowRight'){e.preventDefault();valOordeel(true);}};
  ARC._key&&document.removeEventListener('keydown',ARC._key);document.addEventListener('keydown',key);ARC._key=key;
  arcA3('val','a3-val');
  arcCountdown(()=>{VAL.eind=performance.now()+VAL.duur;valKaart();valLoop();});
}
function valLoop(){
  const rest=VAL.eind-performance.now();const k=document.getElementById('val-klok');
  if(k){k.textContent=Math.max(0,Math.ceil(rest/1000));k.classList.toggle('kritiek',rest<10000);}
  if(rest<=0){valEinde();return;}
  ARC.raf=requestAnimationFrame(valLoop);
}
function valKaart(){
  const it=arcNext(VAL.pool,VAL.gebruikt,null);
  // 45% het echte antwoord, anders een afleider (liefst één met uitleg: een echte val).
  const fout=it.q.o.map((_,i)=>i).filter(i=>i!==it.q.c);
  const metUitleg=fout.filter(i=>it.q.uo&&it.q.uo[i]&&it.q.uo[i].length>12);
  const waar=Math.random()<0.45;const oi=waar?it.q.c:arcPick(metUitleg.length?metUitleg:fout);
  VAL.cur={it,oi,waar,t0:performance.now()};
  const st=document.getElementById('val-stapel');if(!st)return;
  st.innerHTML=`<div class="val-card" id="val-card"><div class="val-meta">${_arcEsc(it.ldNaam||it.domNaam||'')}</div><div class="val-v">${_arcEsc(it.q.v)}</div>
    <div class="val-a"><small>Antwoord</small>${_arcEsc(it.q.o[oi])}</div><div class="val-stamp ja">KLOPT</div><div class="val-stamp nee">VAL</div></div>`;
  valSwipe(document.getElementById('val-card'));
}
function valSwipe(card){
  let x0=null,dx=0;
  const mv=e=>{if(x0==null)return;dx=(e.clientX||0)-x0;card.style.transform=`translateX(${dx}px) rotate(${dx/16}deg)`;card.style.setProperty('--ja',Math.max(0,Math.min(1,dx/110)));card.style.setProperty('--nee',Math.max(0,Math.min(1,-dx/110)));};
  const up=()=>{if(x0==null)return;x0=null;card.classList.remove('sleep');if(Math.abs(dx)>90)valOordeel(dx>0);else{card.style.transform='';card.style.setProperty('--ja',0);card.style.setProperty('--nee',0);}dx=0;};
  card.addEventListener('pointerdown',e=>{if(VAL.pauze>performance.now())return;x0=e.clientX;card.classList.add('sleep');try{card.setPointerCapture(e.pointerId);}catch(_){}});
  card.addEventListener('pointermove',mv);card.addEventListener('pointerup',up);card.addEventListener('pointercancel',up);
}
function valOordeel(zegtKlopt){
  if(VAL.klaar||!VAL.cur||VAL.pauze>performance.now())return;
  const c=VAL.cur;VAL.cur=null;const goed=zegtKlopt===c.waar;
  arcLog(c.it,goed,goed?null:(c.waar?null:c.oi),performance.now()-c.t0);
  const card=document.getElementById('val-card');
  if(card){const m=arcMid(card);card.style.transform='';card.style.setProperty(zegtKlopt?'--ja':'--nee',1);card.classList.add(zegtKlopt?'vlieg-ja':'vlieg-nee');
    if(goed)arcBurst(m.x+(zegtKlopt?90:-90),m.y,{n:c.waar?10:16,kleuren:c.waar?['#22c55e','#86efac','#fff']:['#38bdf8','#7dd3fc','#fde047'],afstand:c.waar?60:90,maat:6});}
  const feed=document.getElementById('val-feed');
  if(goed){
    VAL.goed++;VAL.streak++;VAL.beste=Math.max(VAL.beste,VAL.streak);
    const mult=VAL.streak>=10?3:VAL.streak>=5?2:1;VAL.score+=10*mult;
    if(!c.waar){VAL.vallen++;arcSnd('combo');a3Haak('val','ontdekt');const uo=c.it.q.uo&&c.it.q.uo[c.oi];
      if(feed)feed.innerHTML=`<div class="val-gevangen"><b>🪤 Val ontdekt</b>${uo?' · '+_arcEsc(uo):''}</div>`;}
    else{arcSnd('correct');if(feed)feed.innerHTML='';}
    arcHap(12);
  }else{
    VAL.fout++;VAL.streak=0;arcSnd('wrong');arcHap([40,30,40]);VAL.pauze=performance.now()+1900;VAL.eind+=1900;if(!c.waar||zegtKlopt)a3Haak('val','snap');
    const uo=!c.waar&&c.it.q.uo?c.it.q.uo[c.oi]:'';
    if(feed)feed.innerHTML=`<div class="val-erin"><b>${c.waar?'Dit klopte wél.':'Erin getrapt.'}</b> Goed antwoord: ${_arcEsc(c.it.q.o[c.it.q.c])}.${uo?' '+_arcEsc(uo):''}</div>`;
  }
  const s=document.getElementById('val-score');if(s)s.textContent=arcNf(VAL.score,0);
  const vm=document.getElementById('val-meter');if(vm){vm.style.width=Math.min(100,VAL.streak*10)+'%';vm.classList.toggle('vuur',VAL.streak>=5);}
  const sk=document.getElementById('val-streak');if(sk)sk.textContent=VAL.streak>=5?`🔥 ×${VAL.streak>=10?3:2}`:VAL.streak>=2?`${VAL.streak} op rij`:'';
  arcLater(valKaart,goed?260:1900);
}
function valEinde(){
  if(VAL.klaar)return;VAL.klaar=true;cancelAnimationFrame(ARC.raf);
  arcResult({game:'val',gewonnen:VAL.goed>VAL.fout,kicker:'Tijd!',groot:'',tel:{naar:VAL.score,na:' <small>punten</small>'},
    sub:`${VAL.vallen} ${VAL.vallen===1?'val':'vallen'} ontdekt · langste reeks ${VAL.beste}`,recWaarde:VAL.score,
    stats:[['Goed',VAL.goed],['Fout',VAL.fout],['Vallen',VAL.vallen]],xp:Math.min(160,VAL.goed*4+VAL.vallen*2),
    leer:'Een val herkennen is sterker dan het goede antwoord weten: je snapt dan ook waarom de rest niet klopt.'});
}

function arcGeenVragen(game){
  const vak=arcVak(ARC.vakId);
  arcStage(ARC_GAMES[game].theme,`${arcTop('')}<div class="arc-intro"><h2 class="arc-intro-h">Te weinig vragen</h2><p class="arc-intro-p">${_arcEsc(vak?vak.naam:'Dit vak')} heeft nog niet genoeg losse oefenvragen voor deze game. Kies een ander vak.</p><button class="arc-go" onclick="arcClose()">Terug</button></div>`);
}

// ═══════ ILLUSTRATIES (hub + intro) ═══════
// Illustraties: gerenderd uit dezelfde 3D-scènes als in de games (arcade3d.js).
const ARC_ART=Object.fromEntries(['bom','boss','risico','zwak','sorteer','val'].map(n=>[n,()=>`<img class="arc-art3d" src="/img/arc-${n}.webp" alt="" draggable="false" decoding="async">`]));

// ═══════ REGISTER ═══════
const ARC_GAMES={
  zwak:{id:'zwak',naam:'Zwakke plek',theme:'zwak',kleur:'#f97316',groot:true,pitch:'Vonk vindt je zwakste leerdoel en repareert het met jou.',
    uitleg:'Vijf scherpe vragen op één leerdoel. Het spel past zich aan: gaat het mis, dan krijg je meteen een vergelijkbare vraag. Je ziet je beheersing stijgen.',
    art:ARC_ART.zwak,recLabel:'Gerepareerd',recFmt:v=>v+'×',voorbereid:zwakVoorbereid,introExtra:()=>zwakIntroExtra(),
    run:()=>zwakRun(),kan:()=>true},
  bom:{id:'bom',naam:'Bom ontmantelen',theme:'bom',kleur:'#ef4444',pitch:'Grootheid, formule, uitkomst. Voordat de klok op nul staat.',
    uitleg:'Los de drie modules op in de goede volgorde: welke grootheid zoek je, welke formule gebruik je, wat komt eruit. Elke bom heeft minder tijd. Drie fouten en het is BOEM.',
    art:ARC_ART.bom,recLabel:'Record',recFmt:v=>v+' '+(v===1?'bom':'bommen'),run:bomRun,
    kan:v=>BOM_REL.some(r=>r.vak.includes(v))||BOM_PROC_VAK.includes(v)?true:'Speelt met gemengde natuurkunde-sommen'},
  boss:{id:'boss',naam:'Examenboss',theme:'boss',kleur:'#8b5cf6',pitch:'Versla de boss in 3 minuten, sneller dan een ghost uit je divisie.',
    uitleg:'Elk goed antwoord doet schade. Snel en moeilijk doet meer, en een combo telt op. Een fout? Dan slaat de boss terug. Een speler uit je divisie speelt als ghost mee.',
    art:ARC_ART.boss,recLabel:'Snelste',recFmt:v=>v?arcTijd(v):'-',voorbereid:bossVoorbereid,run:bossRun},
  risico:{id:'risico',naam:'Risico Run',theme:'risico',kleur:'#eab308',pitch:'Veilig, normaal of risico. Opslaan of doorgaan?',
    uitleg:'Kies per vraag je inzet: moeilijker levert meer op. Na elk goed antwoord beslis je: pot op de bank zetten, of doorspelen voor een hogere vermenigvuldiger. Een fout kost je de pot en een hartje.',
    art:ARC_ART.risico,recLabel:'Record',recFmt:v=>arcNf(v,0),voorbereid:riskVoorbereid,run:riskRun},
  sorteer:{id:'sorteer',naam:'Sorteer',theme:'sorteer',kleur:'#22c55e',pitch:'Tijd, proces, oorzaak en gevolg. Zo snel als je kan.',
    uitleg:'Vijf reeksen. Tik de kaarten in de goede volgorde: van oorzaak naar gevolg, van oud naar nieuw, van klein naar groot. Elke reeks heeft een eigen record.',
    art:ARC_ART.sorteer,recLabel:'Snelste',recFmt:v=>arcNf(v/1000,1)+' s',run:sortRun,
    kan:v=>sortReeksen(v).length>=3?true:'Gemengde reeksen uit alle vakken'},
  val:{id:'val',naam:'Val of waar',theme:'val',kleur:'#0ea5e9',pitch:'Klopt dit antwoord, of is het een val? 60 seconden.',
    uitleg:'Je ziet een vraag met één antwoord. Swipe naar rechts als het klopt en naar links als het een val is. Wie vallen herkent, snapt de stof echt. Pijltjestoetsen werken ook.',
    art:ARC_ART.val,recLabel:'Record',recFmt:v=>arcNf(v,0),voorbereid:valVoorbereid,run:valRun},
};
const ARC_VOLGORDE=['zwak','bom','boss','risico','sorteer','val'];
// Terug-knop van de browser/telefoon sluit eerst de game, niet de app.
window.addEventListener('popstate',()=>{const st=document.getElementById('arc-stage');if(st&&!st.hidden)arcClose();});
