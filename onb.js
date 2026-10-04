// ═══════════════════════════════════════════════════════════════
//  ONBOARDING v2 - Vonk leidt een gesprek (Duolingo-stijl)
//  Vervangt de oude intro. Stap voor stap; haptics + geluid + een
//  "profielkaart" (het boekje) die Vonk stap voor stap invult.
// ═══════════════════════════════════════════════════════════════
const ONB = { i:0, data:{ niveau:null, klas:null, profiel:null, vakken:[], animalId:null, cijfers:false, studieplan:false } };

function _onbHaptic(p){ try{ if(typeof haptic==='function') haptic(p); }catch(e){} }
function _onbSound(t){ try{ if(typeof playSound==='function') playSound(t); }catch(e){} }
function _onbConfetti(kind){ try{ if(typeof launchConfetti==='function') launchConfetti(kind); }catch(e){} }

// Klas-opties hangen af van niveau
function _onbKlassen(){
  if(ONB.data.niveau==='vwo') return [['4V','4 VWO'],['5V','5 VWO'],['6V','6 VWO']];
  if(ONB.data.niveau==='vmbo') return [['3M','3 VMBO'],['4M','4 VMBO']];
  return [['4H','4 HAVO'],['5H','5 HAVO']];
}
function _onbKlasLabel(v){ const f=_onbKlassen().find(k=>k[0]===v); return f?f[1]:v; }

// ── Stappen ─────────────────────────────────────────────────────
// type: 'single' (auto-door na keuze) | 'multi' | 'info'
// Bewust minimaal: de niveaukeuze gebeurt op de startpagina, dus de onboarding
// vraagt alleen nog wat functioneel nodig is — je maatje en (optioneel) een
// account. Geen lange intro meer; de leerling is met twee tikken binnen.
const ONB_STEPS = [
  { key:'dier', mood:'blij', type:'single',
    text:'Kies je <b>maatje</b>. Hij groeit mee met jouw XP en staat naast je bij elke oefening.',
    body:()=>{
      const A=(typeof ANIMAL_EVOLUTIONS!=='undefined')?ANIMAL_EVOLUTIONS:[];
      return `<div class="onb-diergrid">${A.map(a=>`<button class="onb-dier${ONB.data.animalId===a.id?' sel':''}" onclick="onbPick('animalId','${a.id}')"><span class="onb-dier-av">${(typeof getAnimalDisplay==='function')?getAnimalDisplay(a.id,0,44):''}</span><span class="onb-dier-nm">${a.n}</span></button>`).join('')}</div>`;
    } },

  { key:'account', mood:'blij', type:'info', optional:true,
    text:'Wil je een <b>gratis account</b>? Dan bewaar ik je voortgang op al je apparaten en doe je mee met het leaderboard en de divisies.',
    body:()=>`<div class="onb-optbtns"><button class="onb-cta" onclick="onbOpt('account',true)">Account maken</button><button class="onb-later" onclick="onbOpt('account',false)">Nu even niet</button></div>` },

  { key:'klaar', mood:'feest', type:'info',
    text:'Klaar! Succes met oefenen, ik sta naast je. 🔥',
    body:()=>`<button class="onb-cta onb-cta-big" onclick="onbComplete()">Start met oefenen!</button>` },
];

// Bestaande gegevens voorinvullen (voor gebruikers die de app al gebruikten):
// zo raken ze niets kwijt en zijn hun keuzes al aangevinkt.
function onbPrefillFromExisting(){
  try{
    const lvl=localStorage.getItem('examenapp_level');
    if(lvl){
      ONB.data.niveau=lvl;
      if(typeof APP_LEVEL!=='undefined') APP_LEVEL=lvl;
      if(typeof applyLevelTheme==='function') applyLevelTheme(lvl);
      if(typeof ensureLevelData==='function') ensureLevelData(lvl,()=>{ try{ if(document.getElementById('onb')&&ONB_STEPS[ONB.i]&&ONB_STEPS[ONB.i].key==='vakken') onbRender(); }catch(e){} });
      const mvRaw=localStorage.getItem('examenapp_mijnvakken_'+lvl);
      if(mvRaw){ try{ const mv=JSON.parse(mvRaw); const arr=Array.isArray(mv)?mv:(mv.list||[]); if(arr.length) ONB.data.vakken=arr.slice(); }catch(e){} }
    }
    const p=JSON.parse(localStorage.getItem('examenapp_profiel')||'{}');
    if(p.klas) ONB.data.klas=p.klas;
    if(p.profiel) ONB.data.profiel=p.profiel;
    if(p.animalId) ONB.data.animalId=p.animalId;
  }catch(e){}
}

function onbStart(){
  ONB.i=0; ONB.data={ niveau:null, klas:null, profiel:null, vakken:[], animalId:null, cijfers:false, studieplan:false };
  onbPrefillFromExisting();
  const ov=document.getElementById('onb'); if(!ov)return;
  ov.style.display='flex';
  requestAnimationFrame(()=>ov.classList.add('on'));
  onbRender(true);
}

function onbRender(first){
  const step=ONB_STEPS[ONB.i]; if(!step){ onbFinish(); return; }
  const pf=document.getElementById('onb-progress-fill');
  if(pf) pf.style.width=Math.round((ONB.i/(ONB_STEPS.length-1))*100)+'%';
  const vk=document.getElementById('onb-vonk');
  if(vk){ vk.innerHTML=(typeof mascotSVG==='function')?mascotSVG(step.mood||'blij',118):''; vk.classList.remove('onb-vonk-in'); void vk.offsetWidth; vk.classList.add('onb-vonk-in'); }
  const bub=document.getElementById('onb-bubble');
  if(bub){ bub.innerHTML=step.text||''; bub.classList.remove('pop'); void bub.offsetWidth; bub.classList.add('pop'); }
  const bd=document.getElementById('onb-body');
  if(bd){ bd.innerHTML=step.body?step.body():''; bd.classList.remove('slidein'); void bd.offsetWidth; bd.classList.add('slidein'); }
  onbRenderCard();
  const foot=document.getElementById('onb-foot');
  if(foot) foot.style.display=(step.type==='multi')?'flex':'none';
  const skip=document.getElementById('onb-skip');
  if(skip) skip.style.display=step.optional?'':'none';
  const nxt=document.querySelector('#onb-foot .onb-next');
  if(nxt) nxt.disabled=(step.key==='vakken'&&ONB.data.vakken.length===0);
  // Feestelijk aankomen op het slotscherm
  if(step.key==='klaar'){ _onbConfetti('gold'); _onbHaptic([16,30,20]); }
  if(!first) _onbSound('swoosh');
}

function onbPick(key,val){
  ONB.data[key]=val;
  _onbHaptic([12,28,18]); _onbSound('correct');
  // Bij niveau-keuze: klas resetten én meteen de niveau-data laden (voedt de vakkenstap)
  if(key==='niveau'){
    ONB.data.klas=null;
    try{
      // In-memory zetten + data laden (voedt de vakkenstap), maar NIET persisteren:
      // pas bij onbComplete wordt examenapp_level opgeslagen. Zo herstart een
      // reload midden in de intro netjes i.p.v. als "terugkerende gebruiker".
      if(typeof APP_LEVEL!=='undefined') APP_LEVEL=val;
      if(typeof applyLevelTheme==='function') applyLevelTheme(val);
      if(typeof ensureLevelData==='function') ensureLevelData(val,()=>{});
    }catch(e){}
  }
  onbRenderCard();
  const bd=document.getElementById('onb-body');
  if(bd){
    bd.querySelectorAll('.onb-opt,.onb-dier').forEach(b=>b.classList.remove('sel'));
    const chosen=Array.from(bd.querySelectorAll('.onb-opt,.onb-dier')).find(b=>{const oc=b.getAttribute('onclick');return oc&&oc.includes("'"+val+"'");});
    if(chosen) chosen.classList.add('sel');
  }
  // Vonk reageert blij + hopt
  const vk=document.getElementById('onb-vonk');
  if(vk&&typeof mascotSVG==='function'){ vk.innerHTML=mascotSVG('feest',118); vk.classList.remove('onb-hop'); void vk.offsetWidth; vk.classList.add('onb-hop'); }
  const step=ONB_STEPS[ONB.i];
  if(step.type==='single'){ setTimeout(()=>onbNext(),470); }
}

function onbToggleVak(id){
  const arr=ONB.data.vakken, i=arr.indexOf(id);
  const nowOn=i<0;
  if(nowOn) arr.push(id); else arr.splice(i,1);
  _onbHaptic(nowOn?[14]:[8]); _onbSound(nowOn?'correct':'tap');
  const bd=document.getElementById('onb-body');
  const btn=bd&&Array.from(bd.querySelectorAll('.onb-vak')).find(b=>{const oc=b.getAttribute('onclick');return oc&&oc.includes("'"+id+"'");});
  if(btn) btn.classList.toggle('sel',nowOn);
  onbRenderCard();
  const nxt=document.querySelector('#onb-foot .onb-next');
  if(nxt) nxt.disabled=arr.length===0;
}

function onbNext(){
  _onbHaptic([12]); _onbSound('tap');
  ONB.i++;
  // Stappen die voor dit niveau niet gelden overslaan (bv. havo/vwo-profiel bij vmbo)
  while(ONB.i<ONB_STEPS.length && ONB_STEPS[ONB.i].skip && ONB_STEPS[ONB.i].skip(ONB.data)){ ONB.i++; }
  if(ONB.i>=ONB_STEPS.length){ onbFinish(); return; }
  onbRender();
}
function onbSkip(){ _onbHaptic([10]); onbNext(); }

// De "profielkaart" (het boekje) die meeloopt
function onbRenderCard(){
  const c=document.getElementById('onb-card'); if(!c)return;
  const d=ONB.data;
  const rows=[];
  if(d.niveau) rows.push(['Niveau', d.niveau.toUpperCase()]);
  if(d.klas) rows.push(['Klas', _onbKlasLabel(d.klas)]);
  if(d.profiel) rows.push(['Profiel', d.profiel.toUpperCase()]);
  if(d.vakken&&d.vakken.length) rows.push(['Vakken', d.vakken.length+' gekozen']);
  if(!rows.length){ c.classList.remove('show'); return; }
  c.classList.add('show');
  c.innerHTML='<div class="onb-card-hd"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> Jouw profiel</div>'
    +rows.map((r,idx)=>`<div class="onb-card-row"${idx===rows.length-1?' style="--in:1"':''}><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');
}

// Optionele ja/nee-stappen (cijfers/studieplan/account)
function onbOpt(key,yes){
  ONB.data[key]=yes;
  _onbHaptic(yes?[12,28,18]:[8]); _onbSound(yes?'correct':'tap');
  onbNext();
}

// Als onbNext voorbij de laatste stap gaat blijven we op 'klaar' staan.
function onbFinish(){ /* niet gebruikt - 'klaar' sluit via onbComplete */ }

// Alles opslaan (device-lokaal, blijft zonder account) + de app in.
function onbComplete(){
  _onbHaptic([18,40,26,40,60]); _onbSound('levelup');
  const d=ONB.data;
  try{
    // 1. Niveau
    if(d.niveau){ if(typeof APP_LEVEL!=='undefined') APP_LEVEL=d.niveau; localStorage.setItem('examenapp_level',d.niveau); }
    // 2. Profiel (klas/profiel/dier) in het profiel-object
    const PK='examenapp_profiel';
    const p=JSON.parse(localStorage.getItem(PK)||'{}');
    if(d.klas) p.klas=d.klas;
    if(d.profiel) p.profiel=d.profiel;
    if(d.animalId){ p.animalId=d.animalId; try{ if(typeof getAnimalEmoji==='function') p.avatar=getAnimalEmoji(d.animalId,0); }catch(e){} }
    localStorage.setItem(PK,JSON.stringify(p));
    // 3. Examenvakken (voedt "Jouw vakken" op de home)
    if(d.vakken&&d.vakken.length){
      try{ if(typeof lvlCol==='function') localStorage.setItem('examenapp_'+lvlCol('mijnvakken'),JSON.stringify(d.vakken)); }catch(e){}
      try{ if(typeof setMijnVakken==='function') setMijnVakken(d.vakken); }catch(e){}
    }
    // 4. Onboarding als voltooid markeren (voorkomt de oude intro)
    localStorage.setItem('slagio_onboard_v3','1');
    localStorage.setItem('slagio_seen_intro_v2','1');
    localStorage.setItem('slagio_vonk_intro_done','1');
  }catch(e){ console.warn('onbComplete save error',e); }

  _onbConfetti('gold');
  const ov=document.getElementById('onb'); if(ov){ ov.classList.remove('on'); setTimeout(()=>{ov.style.display='none';},340); }

  // Onthoud of we na de intro nog naar een optioneel scherm routeren. Zo weet
  // chooseLevel dat het de home-popups (daily challenge / streak-nudge) NIET
  // moet tonen, zodat die niet botsen met het cijfer-/studieplan-/accountscherm.
  window._onbRouting = !!(d.cijfers || d.studieplan || d.account);

  // De app volledig opzetten op het gekozen niveau, dan home.
  try{
    if(typeof chooseLevel==='function'){ chooseLevel(d.niveau||APP_LEVEL,true); }
    else if(typeof show==='function'){ show('sc-home'); if(typeof buildGrid==='function')buildGrid(); }
  }catch(e){ try{show('sc-home');}catch(_){} }

  // Optionele vervolgactie pas openen nadat het overlay netjes is gesloten,
  // zodat de overgang vloeiend is (geen scherm-over-overlay).
  if(window._onbRouting){ setTimeout(onbRoutePost,420); }
}

// Routeert naar het eerste gekozen optionele onderdeel in een logische volgorde
// (cijfers → studieplan → account). Bewust naar de account-VRIJE schermen:
// - cijfers  → sc-calc (slaagkans-calculator; géén account nodig)
// - studieplan → sc-studieplan
// - account  → sc-auth
// De rest blijft gewoon in-app bereikbaar; een korte toast wijst erop.
function onbRoutePost(){
  const d=ONB.data;
  try{
    let opened=null;
    if(d.cijfers && typeof show==='function'){ show('sc-calc'); if(typeof prefillCalcFromSaved==='function')setTimeout(prefillCalcFromSaved,60); opened='cijfers'; }
    else if(d.studieplan && typeof show==='function'){ show('sc-studieplan'); if(typeof renderStudieplan==='function')try{renderStudieplan();}catch(_){} opened='studieplan'; }
    else if(d.account && typeof show==='function'){ show('sc-auth'); opened='account'; }
    // Meer keuzes gemaakt dan we nu openen? Laat dat weten zodat niets "verdwijnt".
    const rest=[];
    if(d.cijfers && opened!=='cijfers') rest.push('cijfers invoeren');
    if(d.studieplan && opened!=='studieplan') rest.push('studieplan maken');
    if(d.account && opened!=='account') rest.push('account maken');
    if(rest.length && typeof showToast==='function'){
      setTimeout(()=>showToast('Ook '+rest.join(' en ')+' kun je zo doen via het menu.'),1500);
    }
  }catch(e){}
  finally{ window._onbRouting=false; }
}

// ═══════ DIRECT DE APP IN + MAATJE NA DE EERSTE QUIZ ═══════
// Nieuwe bezoekers komen na hun niveaukeuze meteen op de home met vakken. Geen
// dierkeuze of accountvraag vooraf: daar haakten de meeste nieuwkomers af. Ze
// krijgen een standaardmaatje en mogen er na hun eerste quiz zelf een kiezen,
// als beloning. Het account vraagt de app ook pas na die eerste quiz.
const MAATJE_STD='vos';
function onbStil(){
  try{
    const PK='examenapp_profiel';
    const p=JSON.parse(localStorage.getItem(PK)||'{}');
    if(!p.animalId){
      p.animalId=MAATJE_STD;
      try{ if(typeof getAnimalEmoji==='function') p.avatar=getAnimalEmoji(MAATJE_STD,0); }catch(e){}
      localStorage.setItem(PK,JSON.stringify(p));
      localStorage.setItem('slagio_maatje_kiezen','1');
    }
    localStorage.setItem('slagio_onboard_v3','1');
    localStorage.setItem('slagio_seen_intro_v2','1');
    localStorage.setItem('slagio_vonk_intro_done','1');
  }catch(e){}
  try{ if(typeof trackEvent==='function') trackEvent('onb_direct'); }catch(e){}
}
function maatjeOpen(){ try{ return localStorage.getItem('slagio_maatje_kiezen')==='1'; }catch(e){ return false; } }

// Bottom sheet in de finish-wachtrij (pqButton): sluiten roept pqNotifyClose aan.
function maatjeKiezen(){
  try{
    if(document.getElementById('maatje-sheet')){ try{pqNotifyClose();}catch(e){} return; }
    const A=(typeof ANIMAL_EVOLUTIONS!=='undefined')?ANIMAL_EVOLUTIONS:[];
    if(!A.length){ try{localStorage.removeItem('slagio_maatje_kiezen');}catch(e){} try{pqNotifyClose();}catch(e){} return; }
    let nu=MAATJE_STD; try{ nu=JSON.parse(localStorage.getItem('examenapp_profiel')||'{}').animalId||MAATJE_STD; }catch(e){}
    const el=document.createElement('div');
    el.id='maatje-sheet'; el.className='regp-ov';
    el.innerHTML=`<div class="regp-card maatje-card" role="dialog" aria-modal="true" aria-labelledby="maatje-h">
      <div class="regp-grip"></div>
      <button class="regp-x" onclick="maatjeSluit()" aria-label="Sluiten">✕</button>
      <div class="regp-badge">Beloning</div>
      <h3 class="regp-h" id="maatje-h">Je eerste quiz zit erop. Kies je maatje!</h3>
      <p class="regp-sub">Je maatje groeit mee met je XP en staat naast je bij elke oefening.</p>
      <div id="maatje-inhoud">${_maatjeGrid(nu)}</div>
    </div>`;
    el.addEventListener('click',e=>{ if(e.target===el) maatjeSluit(); });
    el.addEventListener('keydown',e=>{ if(e.key==='Escape') maatjeSluit(); });
    document.body.appendChild(el);
    try{ playSound&&playSound('open'); }catch(e){}
    try{ if(typeof trackEvent==='function') trackEvent('maatje_shown'); }catch(e){}
  }catch(e){ try{pqNotifyClose();}catch(_){} }
}
// Fase waarin we de dieren laten zien: een ei zegt nog weinig, dus een jong dier.
const MAATJE_FASE=2;
function _maatjeAv(id,px){ return (typeof getAnimalDisplay==='function')?getAnimalDisplay(id,MAATJE_FASE,px):''; }
function _maatjeGrid(nu){
  const A=(typeof ANIMAL_EVOLUTIONS!=='undefined')?ANIMAL_EVOLUTIONS:[];
  const naam=(A.find(a=>a.id===nu)||{n:'vos'}).n.toLowerCase();
  return `<button class="maatje-radknop" onclick="maatjeRad()"><span class="maatje-radknop-ic" aria-hidden="true">${_maatjeRadIcoon()}</span><span><b>Weet je het niet?</b><small>Draai aan het rad en laat het lot kiezen</small></span></button>
    <div class="onb-diergrid maatje-grid">${A.map(a=>`<button class="onb-dier${a.id===nu?' sel':''}" onclick="maatjeKies('${a.id}')"><span class="onb-dier-av">${_maatjeAv(a.id,44)}</span><span class="onb-dier-nm">${a.n}</span></button>`).join('')}</div>
    <button class="regp-later" onclick="maatjeSluit()">Ik houd de ${naam}</button>`;
}
function _maatjeRadIcoon(){
  return '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/></svg>';
}

// ── Het rad: alle dieren in taartpunten, de wijzer staat bovenaan ──
const MR_KLEUR=['#ffd84d','#7cd4ff','#ff9f7a','#a8e67a','#d3a8ff','#ffb8d9'];
let _mrHoek=0,_mrBezig=false,_mrDier=null;
function maatjeRad(){
  const A=(typeof ANIMAL_EVOLUTIONS!=='undefined')?ANIMAL_EVOLUTIONS:[];
  const box=document.getElementById('maatje-inhoud'); if(!box||!A.length)return;
  const n=A.length, seg=360/n;
  const stops=A.map((a,i)=>`${MR_KLEUR[i%MR_KLEUR.length]} ${(i*seg).toFixed(2)}deg ${((i+1)*seg).toFixed(2)}deg`).join(',');
  _mrHoek=0;_mrDier=null;
  box.innerHTML=`<div class="mr-wrap">
      <div class="mr-wijzer" aria-hidden="true"></div>
      <div class="mr-rad" id="mr-rad" style="background:conic-gradient(${stops})">
        ${A.map((a,i)=>`<span class="mr-dier" style="--h:${(i*seg+seg/2).toFixed(2)}deg">${_maatjeAv(a.id,36)}</span>`).join('')}
      </div>
      <div class="mr-as" aria-hidden="true"></div>
    </div>
    <div class="mr-uitslag" id="mr-uitslag" aria-live="polite"></div>
    <div class="mr-knoppen" id="mr-knoppen">
      <button class="regp-cta" onclick="maatjeDraai()">Draai!</button>
      <button class="regp-later" onclick="maatjeTerug()">Toch zelf kiezen</button>
    </div>`;
  _onbSound('tap');
  try{ if(typeof trackEvent==='function') trackEvent('maatje_rad'); }catch(e){}
}
function maatjeTerug(){
  if(_mrBezig)return;
  let nu=MAATJE_STD; try{ nu=JSON.parse(localStorage.getItem('examenapp_profiel')||'{}').animalId||MAATJE_STD; }catch(e){}
  const box=document.getElementById('maatje-inhoud'); if(box) box.innerHTML=_maatjeGrid(nu);
}
function maatjeDraai(){
  if(_mrBezig)return;
  const A=ANIMAL_EVOLUTIONS, n=A.length, seg=360/n;
  const rad=document.getElementById('mr-rad'); if(!rad)return;
  // Niet twee keer achter elkaar hetzelfde dier.
  let doel; do{ doel=Math.floor(Math.random()*n); }while(n>1&&A[doel].id===_mrDier);
  const midden=doel*seg+seg/2+(Math.random()-.5)*seg*.6;      // net niet altijd precies in het midden
  const rest=((360-midden)-(_mrHoek%360)+720)%360;
  _mrHoek+=360*5+rest;
  _mrBezig=true;
  const kn=document.getElementById('mr-knoppen'); if(kn) kn.classList.add('uit');
  const us=document.getElementById('mr-uitslag'); if(us){ us.classList.remove('aan'); us.innerHTML=''; }
  let stil=false; try{ stil=window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
  const klaar=()=>{ _mrBezig=false; _maatjeUitslag(A[doel]); };
  if(stil){ rad.style.transition='none'; rad.style.transform=`rotate(${_mrHoek}deg)`; klaar(); return; }
  const duur=4200;
  rad.style.transition=`transform ${duur}ms cubic-bezier(.12,.72,.12,1)`;
  rad.style.transform=`rotate(${_mrHoek}deg)`;
  // Tikjes bij elke taartpunt die langs de wijzer gaat (net als een echt rad).
  let vorig=null;
  const tik=()=>{
    if(!_mrBezig)return;
    const m=getComputedStyle(rad).transform;
    if(m&&m!=='none'){
      const v=m.split('(')[1].split(')')[0].split(',');
      const h=(Math.atan2(+v[1],+v[0])*180/Math.PI+360)%360;
      const vak=Math.floor(((360-h)%360)/seg);
      if(vorig!==null&&vak!==vorig){ _onbSound('tap'); _onbHaptic(4); const w=document.querySelector('.mr-wijzer'); if(w){ w.classList.remove('tik'); void w.offsetWidth; w.classList.add('tik'); } }
      vorig=vak;
    }
    requestAnimationFrame(tik);
  };
  requestAnimationFrame(tik);
  setTimeout(klaar,duur+60);
}
function _maatjeUitslag(a){
  _mrDier=a.id;
  _onbHaptic([18,40,26,40,60]); _onbSound('levelup'); _onbConfetti('gold');
  const us=document.getElementById('mr-uitslag');
  if(us){ us.innerHTML=`<span class="mr-uit-av">${_maatjeAv(a.id,56)}</span><span>Het wordt de <b>${a.n.toLowerCase()}</b>!</span>`; requestAnimationFrame(()=>us.classList.add('aan')); }
  const kn=document.getElementById('mr-knoppen');
  if(kn){ kn.innerHTML=`<button class="regp-cta" onclick="maatjeKies('${a.id}')">Deze wordt het</button><button class="regp-later" onclick="maatjeDraai()">Nog een keer draaien</button>`; kn.classList.remove('uit'); }
}

function maatjeKies(id){
  try{
    const PK='examenapp_profiel';
    const p=JSON.parse(localStorage.getItem(PK)||'{}');
    p.animalId=id;
    const xp=(typeof getTotalXP==='function')?getTotalXP():0;
    try{ if(typeof getAnimalEmoji==='function') p.avatar=getAnimalEmoji(id,xp); }catch(e){}
    localStorage.setItem(PK,JSON.stringify(p));
    if(typeof selectedAnimalId!=='undefined') selectedAnimalId=id;
  }catch(e){}
  _onbHaptic([12,28,18]); _onbSound('correct');
  try{ document.querySelectorAll('#maatje-sheet .onb-dier').forEach(b=>b.classList.toggle('sel',(b.getAttribute('onclick')||'').includes("'"+id+"'"))); }catch(e){}
  try{ if(typeof trackEvent==='function') trackEvent('maatje_gekozen',{dier:id}); }catch(e){}
  try{ if(typeof syncMyAvatarToCloud==='function') syncMyAvatarToCloud(); }catch(e){}
  try{ if(typeof updateProfileNav==='function') updateProfileNav(); }catch(e){}
  setTimeout(maatjeSluit,420);
}
function maatjeSluit(){
  try{ localStorage.removeItem('slagio_maatje_kiezen'); }catch(e){}
  const el=document.getElementById('maatje-sheet');
  if(el){ el.classList.add('regp-out'); setTimeout(()=>{ try{el.remove();}catch(e){} },220); }
  try{ pqNotifyClose(); }catch(e){}
}
