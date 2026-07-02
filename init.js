// ═══════ INTRO MODAL ═══════
const INTRO_STEPS_N=3;
let _introIdx=0;
let _introPickedAnimal=null;

/* ===== ONBOARDING v3 ===== */
const OB_KEY='slagio_onboard_v3';
let _obStep=0,_obPickedAnimal=null;
function showOnboarding(){
  // Slanke flow: start direct bij de mascotte-keuze (het leuke, signature-deel).
  // Geen feature-tour en geen account-muur vooraf — waarde tonen, niet vertellen.
  _obStep=1;_obPickedAnimal=null;
  _obBuildAnimals();
  const prog=document.querySelector('#ob-overlay .ob-progress');
  if(prog)prog.style.display='none';
  document.getElementById('ob-overlay').style.display='flex';
  _obRender();
}
function obFinishAndStart(){
  try{obFinish(false);}catch(e){var o=document.getElementById('ob-overlay');if(o)o.style.display='none';}
  // Niveau → mascotte → direct een vraag (quick-start kiest het vak in één tik).
  try{startStreakQuiz();}catch(e){}
}
function _obBuildAnimals(){
  const grid=document.getElementById('ob-animal-grid');
  if(!grid)return;
  grid.innerHTML='';
  ANIMAL_EVOLUTIONS.forEach(a=>{
    const btn=document.createElement('button');
    btn.type='button';btn.className='ob-animal-btn';btn.dataset.id=a.id;
    btn.innerHTML=`<span class="ob-animal-emoji">${a.svg?getAnimalDisplay(a.id,0,28):a.s[0]}</span><span class="ob-animal-name">${a.n}</span>`;
    btn.onclick=()=>{
      grid.querySelectorAll('.ob-animal-btn').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');_obPickedAnimal=a.id;
      const hint=document.getElementById('ob-animal-hint');
      if(hint){hint.textContent=a.n+' gekozen ✓';hint.style.color='#818cf8';}
      const nb=document.getElementById('ob-next1-btn');if(nb)nb.disabled=false;
    };
    grid.appendChild(btn);
  });
}
function obTapFeat(el){el.classList.toggle('tapped');}
function obGoStep(n){
  if(n===2&&!_obPickedAnimal)return;
  _obStep=n;_obRender();
}
function _obRender(){
  for(let i=0;i<3;i++){
    const s=document.getElementById('ob-s'+i);
    if(s)s.classList.toggle('on',i===_obStep);
    const b=document.getElementById('ob-bar-'+i);
    if(b){b.classList.toggle('done',i<_obStep);b.classList.toggle('active',i===_obStep);}
  }
}
async function obDoRegister(){
  const naam=(document.getElementById('ob-naam').value||'').trim();
  const email=(document.getElementById('ob-email').value||'').trim();
  const pass=document.getElementById('ob-pass').value||'';
  const errEl=document.getElementById('ob-err');
  const btn=document.getElementById('ob-reg-btn');
  errEl.style.display='none';
  if(!naam){errEl.textContent='Vul je naam in.';errEl.style.display='block';return;}
  if(!email||!isValidEmail(email)){errEl.textContent='Voer een geldig e-mailadres in.';errEl.style.display='block';return;}
  if(pass.length<8){errEl.textContent='Wachtwoord moet minimaal 8 tekens zijn.';errEl.style.display='block';return;}
  if(passwordScore(pass)<2){errEl.textContent='Wachtwoord is te zwak. Voeg een hoofdletter, cijfer of speciaal teken toe.';errEl.style.display='block';return;}
  btn.disabled=true;btn.textContent='Bezig...';
  try{
    const {data,error}=await SB.auth.signUp({email,password:pass});
    if(error)throw error;
    const animalId=_obPickedAnimal||null;
    const initAvatar=animalId?getAnimalEmoji(animalId,0):'🐾';
    const prof={naam,avatar:initAvatar,animalId,school:'',klas:'',profiel:''};
    localStorage.setItem(PROF_KEY,JSON.stringify(prof));
    selectedAnimalId=animalId;
    if(data.user){currentUser=data.user;await cloudSet('profiel',prof);}
    obFinish(true);
    if(!data.session)showToast('✓ Account aangemaakt! Controleer je inbox om je e-mail te bevestigen.','#4ade80',5000);
  }catch(e){
    errEl.textContent=authErrMsg(e.message);errEl.style.display='block';
  }finally{btn.disabled=false;btn.textContent='Account aanmaken';}
}
function obFinish(registered){
  if(_obPickedAnimal){
    try{
      const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
      if(!p.animalId){
        p.animalId=_obPickedAnimal;
        const a=getAnimalById(_obPickedAnimal);
        p.avatar=a?(a.fallback?a.fallback[0]:a.s[0]):'🐾';
        localStorage.setItem(PROF_KEY,JSON.stringify(p));
        if(currentUser)cloudSet('profiel',p);
        selectedAnimalId=_obPickedAnimal;
      }
    }catch(e){}
  }
  document.getElementById('ob-overlay').style.display='none';
  localStorage.setItem(OB_KEY,'1');
  localStorage.setItem('slagio_seen_intro_v2','1');
  localStorage.setItem(TUTO_KEY,'1');
  updateProfileNav();renderXPHome();
}
function showVmboWaitlist(){
  const email=prompt('Laat je e-mailadres achter en we mailen je zodra VMBO-TL live gaat:');
  if(email&&email.includes('@')){
    try{localStorage.setItem('slagio_vmbo_waitlist',email);}catch(e){}
    alert('Bedankt! We laten het je weten zodra VMBO-TL beschikbaar is. 🎉');
  }
}

function showIntroModal(){
  _introIdx=0;
  _introPickedAnimal=null;
  const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  if(p.animalId)_introPickedAnimal=p.animalId;
  _buildIntroGrid();
  document.getElementById('sc-intro').style.display='flex';
  _introRender();
}

function _buildIntroGrid(){
  const grid=document.getElementById('intro-animal-grid');
  if(!grid)return;
  grid.innerHTML='';
  ANIMAL_EVOLUTIONS.forEach(a=>{
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='anim-pick-btn'+(_introPickedAnimal===a.id?' selected':'');
    btn.innerHTML=`<span class="anim-pick-emoji">${getAnimalDisplay(a.id,0,32)}</span><span class="anim-pick-name">${a.n}</span>`;
    btn.onclick=()=>{
      _introPickedAnimal=a.id;
      grid.querySelectorAll('.anim-pick-btn').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      const hint=document.getElementById('intro-animal-hint');
      hint.textContent=a.n+' gekozen ✓';
      hint.style.color='var(--or)';
      document.getElementById('intro-next-btn').disabled=false;
    };
    grid.appendChild(btn);
  });
}

function dismissIntro(){
  if(_introPickedAnimal){
    try{
      const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
      if(!p.animalId){
        p.animalId=_introPickedAnimal;
        const a=getAnimalById(_introPickedAnimal);
        p.avatar=a?(a.fallback?a.fallback[0]:a.s[0]):'🐾';
        localStorage.setItem(PROF_KEY,JSON.stringify(p));
        if(currentUser)cloudSet('profiel',p);
        selectedAnimalId=_introPickedAnimal;
      }
    }catch(e){}
  }
  document.getElementById('sc-intro').style.display='none';
  localStorage.setItem('slagio_seen_intro_v2','1');
  updateProfileNav();
  renderXPHome();
  setTimeout(showTutorial,400);
}

function _introRender(){
  document.querySelectorAll('#sc-intro .intro-step').forEach((s,i)=>s.classList.toggle('on',i===_introIdx));
  const dots=document.getElementById('intro-mdots');
  dots.innerHTML=Array.from({length:INTRO_STEPS_N},(_,i)=>`<div class="intro-mdot${i===_introIdx?' on':''}"></div>`).join('');
  const badge=document.getElementById('intro-level-badge');
  if(badge)badge.textContent=(APP_LEVEL==='havo'?'HAVO':'VWO')+' 2026';
  const next=document.getElementById('intro-next-btn');
  const skip=document.getElementById('intro-skip-btn');
  const last=_introIdx===INTRO_STEPS_N-1;
  const isAnimalStep=_introIdx===1;
  next.textContent=last?'Aan de slag 🚀':'Volgende →';
  next.onclick=last?dismissIntro:()=>{_introIdx++;_introRender();};
  next.disabled=isAnimalStep&&!_introPickedAnimal;
  skip.style.display=last?'none':'';
}

// ═══════ TUTORIAL ═══════
const TUTO_KEY='examio_tutorial_done';
const TUTO_TOTAL=4;
let tutIdx=0;
function showTutorial(){
  if(localStorage.getItem(TUTO_KEY))return;
  tutIdx=0;
  _updateTuto();
  document.getElementById('tuto-overlay').style.display='flex';
}
function closeTutorial(){
  localStorage.setItem(TUTO_KEY,'1');
  document.getElementById('tuto-overlay').style.display='none';
}
function tutSlide(dir){
  tutIdx=Math.max(0,Math.min(TUTO_TOTAL-1,tutIdx+dir));
  _updateTuto();
}
function _updateTuto(){
  document.querySelectorAll('#tuto-slides .tuto-slide').forEach((s,i)=>s.classList.toggle('active',i===tutIdx));
  // dots
  const dots=document.getElementById('tuto-dots');
  dots.innerHTML='';
  for(let i=0;i<TUTO_TOTAL;i++){
    const d=document.createElement('span');
    d.className='tuto-dot'+(i===tutIdx?' active':'');
    d.onclick=()=>{tutIdx=i;_updateTuto();};
    dots.appendChild(d);
  }
  // prev button
  const prev=document.getElementById('tuto-prev');
  prev.style.visibility=tutIdx===0?'hidden':'visible';
  // next button
  const next=document.getElementById('tuto-next');
  if(tutIdx===TUTO_TOTAL-1){
    next.textContent='Aan de slag';
    next.onclick=closeTutorial;
  } else {
    next.textContent='Volgende →';
    next.onclick=()=>tutSlide(1);
  }
}

// ═══════ CIJFER SPOTLIGHT TUTORIAL ═══════
const CTUTO_KEY='slagio_cijfer_tuto_v1';
const CTUTO_STEPS=[
  {sel:'#cijfer-grid',pad:10,pos:'below',
   title:'📝 Vul hier je SE-cijfers in',
   body:'Dit zijn je schoolexamencijfers - de cijfers die je al hebt gehaald op school. Vul ze in per vak.'},
  {sel:'#cijfer-grid .cijfer-input',pad:6,pos:'below',
   title:'✏️ Typ je cijfer in',
   body:'Klik op een vakje en typ je SE-cijfer, bijv. 7,5. Doe dit voor elk vak dat je dit jaar volgt.'},
  {sel:'.cijfer-save-btn',pad:8,pos:'above',
   title:'💾 Sla op!',
   body:'Klik op Opslaan om je cijfers te bewaren. Ze worden dan gebruikt voor de eindcijferberekening en slagingskans.'},
];
let _ctutoIdx=0;
function showCijferTuto(){
  if(localStorage.getItem(CTUTO_KEY))return;
  if(Object.keys(getSavedCijfers()).length>0){localStorage.setItem(CTUTO_KEY,'1');return;}
  _ctutoIdx=0;
  document.getElementById('ctuto-overlay').style.display='block';
  _ctutoRender();
}
function closeCijferTuto(){
  localStorage.setItem(CTUTO_KEY,'1');
  document.getElementById('ctuto-overlay').style.display='none';
}
function _ctutoRender(){
  const step=CTUTO_STEPS[_ctutoIdx];
  const target=document.querySelector(step.sel);
  if(!target){closeCijferTuto();return;}
  const r=target.getBoundingClientRect();
  const p=step.pad,TW=280,margin=14;
  // Spotlight
  const spot=document.getElementById('ctuto-spot');
  spot.style.left=(r.left-p)+'px';
  spot.style.top=(r.top-p)+'px';
  spot.style.width=(r.width+p*2)+'px';
  spot.style.height=(r.height+p*2)+'px';
  // Tooltip position
  const tip=document.getElementById('ctuto-tip');
  let tx,ty;
  if(step.pos==='below'){
    ty=r.bottom+p+margin;
    tx=Math.max(margin,Math.min(window.innerWidth-TW-margin,r.left+r.width/2-TW/2));
  } else {
    ty=r.top-p-margin-165;
    tx=Math.max(margin,Math.min(window.innerWidth-TW-margin,r.left+r.width/2-TW/2));
  }
  ty=Math.max(margin,Math.min(window.innerHeight-180,ty));
  tip.style.left=tx+'px';
  tip.style.top=ty+'px';
  // Content
  document.getElementById('ctuto-title').textContent=step.title;
  document.getElementById('ctuto-body').textContent=step.body;
  // Dots
  document.getElementById('ctuto-dots').innerHTML=CTUTO_STEPS.map((_,i)=>`<div class="ctuto-tip-dot${i===_ctutoIdx?' on':''}"></div>`).join('');
  // Button
  const btn=document.getElementById('ctuto-next');
  const last=_ctutoIdx===CTUTO_STEPS.length-1;
  btn.textContent=last?'Begrepen ✓':'Volgende →';
  btn.onclick=last?closeCijferTuto:()=>{_ctutoIdx++;_ctutoRender();};
}

// ═══════ LEVEL THEME ═══════
function applyLevelTheme(level){
  const html=document.documentElement;
  html.classList.remove('level-havo','level-vwo');
  html.classList.add('level-'+level);
  // Update favicon colour to match level
  const col=level==='vwo'?'%238b5cf6':'%23E85C0D';
  const svg=`%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='${col}'/%3E%3Ctext x='16' y='24' font-family='Arial Black,sans-serif' font-size='19' font-weight='900' fill='white' text-anchor='middle'%3ESl%3C/text%3E%3C/svg%3E`;
  const fav=document.querySelector('link[rel="icon"]');
  if(fav)fav.href='data:image/svg+xml,'+svg;
}

// ═══════ LEVEL SELECT ═══════
function _updatePageSEO(level){
  const isHavo=level==='havo';
  const nivNaam=isHavo?'HAVO':'VWO';
  const url='https://slagio.nl/'+(level||'');
  document.title=level
    ?`Slagio - ${nivNaam} Examenvoorbereiding 2026 | 2.000+ vragen, eindexamens, studieplan`
    :'Slagio - Complete HAVO & VWO Examenvoorbereiding 2026';
  const desc=level
    ?`Gratis ${nivNaam} examenvoorbereiding 2026. 2.000+ oefenvragen per domein, echte CE-eindexamens 2019–2025, persoonlijk studieplan, spaced repetition flashcards en cijfercalculator. Geen account nodig.`
    :'Kies je niveau: HAVO of VWO. Gratis examenvoorbereiding met 2.000+ oefenvragen, echte eindexamens 2019–2025, studieplan en meer.';
  const metaDesc=document.querySelector('meta[name="description"]');
  if(metaDesc)metaDesc.content=desc;
  const og=document.querySelector('meta[property="og:url"]');
  if(og)og.content=url;
  const ogTitle=document.querySelector('meta[property="og:title"]');
  if(ogTitle)ogTitle.content=document.title;
  const canon=document.querySelector('link[rel="canonical"]');
  if(canon)canon.href=url;
}
function chooseLevel(level,_noHistory){
  // Gate: laad eerst de niveau-data (data-havo.js / data-vwo.js) indien nodig.
  if(typeof ensureLevelData==='function'&&typeof _levelLoaded==='function'&&!_levelLoaded(level)){
    ensureLevelData(level,()=>chooseLevel(level,_noHistory));
    return;
  }
  APP_LEVEL=level;
  localStorage.setItem('examenapp_level',level);
  applyLevelTheme(level);
  updateLevelChip();
  buildGrid();
  buildSlaagInputs();
  renderSchedule();
  // Update intro badge
  const badge=document.getElementById('intro-level-badge');
  if(badge)badge.textContent=(level==='havo'?'HAVO':'VWO')+' 2026';
  // Push URL: /havo or /vwo
  if(!_noHistory)history.pushState({level},'','/'+level);
  _updatePageSEO(level);
  // Show intro for first-time users, home for returning users
  show('sc-home');
  buildGrid();renderStreak();renderFavHome();renderXPHome();renderDailyChallenge();renderHomeStats();renderGreeting();
  const _isNew=!localStorage.getItem(OB_KEY)&&!localStorage.getItem('slagio_seen_intro_v2');
  if(_isNew){setTimeout(showOnboarding,300);}
  else if(!localStorage.getItem(TUTO_KEY)){setTimeout(showTutorial,400);}
  else{showDailyChallengePopup();}
}
function updateLevelChip(){
  const chip=document.getElementById('home-level-chip');
  if(chip)chip.textContent=(APP_LEVEL==='vwo'?'VWO':'HAVO')+' 2026';
  const badge=document.getElementById('vak-level-badge');
  if(badge)badge.textContent=(APP_LEVEL==='vwo'?'VWO':'HAVO');
}

// ═══════ INIT ═══════
// Only apply level theme if a level was already chosen (skip on welcome screen)
if(localStorage.getItem('examenapp_level')) applyLevelTheme(APP_LEVEL);
else document.documentElement.classList.add('level-welcome');
try{initChallengeOnLoad();}catch(e){}
renderFavHome();
renderStreak();
renderXPHome();
renderDailyChallenge();
renderHomeStats();
renderGreeting();
renderDailyGoal();
buildGrid();
try{renderComebackCard();}catch(e){}
updateProfileNav();
updateLevelChip();
// Always start on the welcome/level-select screen.
// If a level was previously chosen, highlight that card so the user knows.
(function markPrevLevel(){
  const prev=localStorage.getItem('examenapp_level');
  if(!prev)return;
  const card=document.querySelector('.lc-'+prev);
  if(!card)return;
  card.classList.add('lc-active');
  const tag=document.createElement('span');
  tag.className='level-prev-tag';
  tag.textContent='Vorige keuze ✓';
  card.appendChild(tag);
})();
if(document.getElementById('sc-schedule'))renderSchedule();
buildRegisterAnimalPicker();
buildSlaagInputs();
// Push initial ads op home (na kleine vertraging zodat AdSense geladen is)
setTimeout(()=>{tryPushAds('sc-home');},1500);
// Show welcome on first load (sc-welcome is default via class="on")
// ═══════ BOTTOM NAV ═══════
function updateBottomNav(id){
  // sc-auth counts as sc-profiel for nav highlighting
  const activeId=(id==='sc-auth')?'sc-profiel':id;
  document.querySelectorAll('.bnav-btn').forEach(b=>{
    b.classList.toggle('active',b.dataset.screen===activeId);
  });
  // Update profiel button label: Inloggen vs Profiel
  const lbl=document.getElementById('bnav-profiel-label');
  if(lbl)lbl.textContent=currentUser?'Profiel':'Inloggen';
  // Hide bottom nav during quiz/flashcard/qmode
  const hideScreens=['sc-quiz','sc-flash','sc-qmode','sc-welcome','sc-race'];
  const bn=document.getElementById('bottom-nav');
  if(bn) bn.style.display=hideScreens.includes(id)?'none':'';
  // Avatar in de profiel-knop van de bottom nav
  const bnavIcon=document.getElementById('bnav-profiel-icon');
  if(bnavIcon&&currentUser){
    try{
      const _p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
      if(_p.animalId){
        const _si=getAnimalStageIdx(getTotalXP());
        bnavIcon.innerHTML=`<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:rgba(var(--or-rgb),.15);border:1.5px solid rgba(var(--or-rgb),.3);overflow:hidden">${getAnimalDisplay(_p.animalId,_si,22)}</span>`;
      }
    }catch(e){}
  }
}
// Patch show() to update bottom nav (pass all args through)
const _origShow=show;
window.show=function(id,_noHash){_origShow(id,_noHash);updateBottomNav(id);};

// Activeer routing na volledig laden
window.addEventListener('load',()=>{
  // Query-param fallback: ?niveau=havo&vak=bi[&domein=C] → open vak (+ optioneel domein)
  const _qp=new URLSearchParams(location.search);
  const _qniv=_qp.get('niveau'), _qvak=_qp.get('vak'), _qdom=_qp.get('domein');
  if(_qniv&&_qvak&&_VAK_SLUG[_qvak]){
    if(_qdom){
      // Domein deep-link: bewaar domein en route via hash (openVak pakt het op).
      history.replaceState(null,'','#'+_qniv+'-'+_VAK_SLUG[_qvak]);
      try{sessionStorage.setItem('_slagio_open_domein',_qdom);}catch(e){}
    }else{
      // Vak deep-link: leg meteen de echte vak-URL vast en open het vak.
      const _url='/vakken/'+_qniv+'-'+_VAK_SLUG[_qvak]+'.html';
      history.replaceState(null,'',_url);
      if(typeof _routeVakkenPath==='function'){setTimeout(()=>_routeVakkenPath(_url),80);return;}
    }
  }
  // Path-based routing: /havo en /vwo
  const _path=location.pathname.replace(/\/$/,'');
  if(_path==='/havo'||_path==='/vwo'){
    setTimeout(()=>_routeFromPath(),80);
    return;
  }
  // Echte vak-/domein-URL (/vakken/<niveau>-<vak>[-domein-<x>].html): een
  // terugkerende gebruiker die zo'n statische SEO-pagina boot in de SPA laadt,
  // landt direct op het juiste in-app scherm (met oefeningen en samenvatting).
  if(/^\/vakken\/(havo|vwo)-/.test(_path)&&typeof _routeVakkenPath==='function'){
    setTimeout(()=>_routeVakkenPath(_path),80);
    return;
  }
  // Hash-routing voor sub-schermen
  if(location.hash&&location.hash.length>1){
    setTimeout(_routeFromHash,120);
  }
});


/* ═══════ MULTIPLAYER QUIZ ═══════ */
/* ═══════ MULTIPLAYER QUIZ (Kahoot-stijl) ═══════ */
const MQ_GUEST_KEY='slagio_mq_guest';
let MQ=null;

function _mqId(){let id=localStorage.getItem(MQ_GUEST_KEY);if(!id){id='g'+Math.random().toString(36).slice(2,9);localStorage.setItem(MQ_GUEST_KEY,id);}return currentUser?.id||id;}
function _mqName(){try{return JSON.parse(localStorage.getItem(PROF_KEY)||'{}').naam||'Speler';}catch(e){return'Speler';}}
function _mqAvatar(){try{return JSON.parse(localStorage.getItem(PROF_KEY)||'{}').avatar||'🐾';}catch(e){return'🐾';}}
function _mqCode(){const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return Array.from({length:6},()=>c[Math.floor(Math.random()*c.length)]).join('');}

function _mqPhase(ph){
  document.querySelectorAll('#mq-overlay .mq-phase').forEach(el=>el.classList.toggle('on',el.dataset.phase===ph));
}

function openMultiQuiz(){
  trackEvent('multiplayer',{vak:ST.vak?.naam||null,domein:ST.domein?.naam||null});
  if(!ST.vak||!ST.domein){showToast('Kies eerst een vak en domein','#ef4444');return;}
  const el=document.getElementById('mq-entry-vak');
  if(el)el.textContent=ST.vak.naam+' · '+ST.domein.naam;
  const inp=document.getElementById('mq-join-code');
  if(inp)inp.value='';
  document.getElementById('mq-overlay').style.display='flex';
  _mqPhase('entry');
}

function mqClose(){
  if(MQ?.channel){try{SB.removeChannel(MQ.channel);}catch(e){}}
  if(MQ?.timer)clearInterval(MQ.timer);
  MQ=null;
  document.getElementById('mq-overlay').style.display='none';
}

function _mqRenderLobby(){
  const wrap=document.getElementById('mq-players-wrap');
  const cnt=document.getElementById('mq-player-count');
  const startBtn=document.getElementById('mq-start-btn');
  const hint=document.getElementById('mq-lobby-hint');
  const pl=MQ?.players||[];
  if(wrap)wrap.innerHTML=pl.map(p=>`<div class="mq-player-chip"><span class="mq-player-av">${escapeHtml(p.avatar)}</span><span class="mq-player-nm">${escapeHtml(p.name)}</span></div>`).join('');
  if(cnt)cnt.textContent=pl.length+' speler'+(pl.length===1?'':'s');
  if(startBtn)startBtn.style.display=MQ?.isHost&&pl.length>=1?'block':'none';
  if(hint)hint.textContent=MQ?.isHost?'Stuur de spelcode naar je vrienden':'Wachten op de host om het spel te starten…';
}

async function mqHost(){
  const code=_mqCode();
  const me={id:_mqId(),name:_mqName(),avatar:_mqAvatar()};
  const pool=ST.domein.sv||[];
  const qs=(pool.length<=10?[...pool]:[...pool].sort(()=>Math.random()-.5).slice(0,10)).map(q=>{
    const m=[0,1,2,3];for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[m[i],m[j]]=[m[j],m[i]];}
    return{v:q.v,o:m.map(i=>q.o[i]||''),c:m.indexOf(q.c),u:q.u||''};
  });
  MQ={room:code,isHost:true,me,players:[{...me,score:0}],questions:qs,currentQ:0,answers:{},scores:{[me.id]:0},timer:null,channel:null};

  const ch=SB.channel('mq_'+code,{config:{broadcast:{self:false}}});
  MQ.channel=ch;
  ch.on('broadcast',{event:'join'},({payload:p})=>{
    if(MQ.players.find(x=>x.id===p.id))return;
    MQ.players.push({...p,score:0});MQ.scores[p.id]=0;
    _mqRenderLobby();
    ch.send({type:'broadcast',event:'roster',payload:{players:MQ.players}});
  });
  ch.on('broadcast',{event:'answer'},({payload:{pid,choice,ms}})=>{
    if(MQ.answers[pid]!==undefined)return;
    MQ.answers[pid]={choice,ms};
    if(Object.keys(MQ.answers).length>=MQ.players.length)_mqDoReveal();
  });
  await ch.subscribe();

  document.getElementById('mq-code-display').textContent=code;
  document.getElementById('mq-vak-display').textContent=ST.vak.naam+' · '+ST.domein.naam;
  _mqRenderLobby();
  _mqPhase('lobby');
}

async function mqJoin(){
  const code=(document.getElementById('mq-join-code').value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(code.length!==6){showToast('Voer een geldige spelcode in (6 tekens)','#ef4444');return;}
  const me={id:_mqId(),name:_mqName(),avatar:_mqAvatar()};
  MQ={room:code,isHost:false,me,players:[me],questions:[],currentQ:0,answers:{},scores:{},timer:null,channel:null};

  const ch=SB.channel('mq_'+code,{config:{broadcast:{self:false}}});
  MQ.channel=ch;
  ch.on('broadcast',{event:'roster'},({payload:{players}})=>{MQ.players=players;_mqRenderLobby();});
  ch.on('broadcast',{event:'start'},({payload:{questions}})=>{MQ.questions=questions;MQ.currentQ=0;_mqShowQ();});
  ch.on('broadcast',{event:'reveal'},({payload})=>_mqShowReveal(payload));
  ch.on('broadcast',{event:'next'},({payload:{idx}})=>{MQ.currentQ=idx;_mqShowQ();});
  ch.on('broadcast',{event:'end'},({payload:{scores}})=>_mqShowFinal(scores));
  await ch.subscribe();
  await ch.send({type:'broadcast',event:'join',payload:me});

  document.getElementById('mq-code-display').textContent=code;
  document.getElementById('mq-vak-display').textContent='Wachten op host…';
  _mqRenderLobby();
  _mqPhase('lobby');
}

async function mqStartGame(){
  if(!MQ?.isHost||MQ.players.length<1)return;
  await MQ.channel.send({type:'broadcast',event:'start',payload:{questions:MQ.questions}});
  MQ.currentQ=0;_mqShowQ();
}

const MQ_COLORS=['#e21b3c','#1368ce','#d89e00','#26890c'];
const MQ_SHAPES=['▲','◆','●','■'];

function _mqShowQ(){
  const q=MQ.questions[MQ.currentQ];if(!q)return;
  MQ.answers={};MQ._answered=false;MQ._qStart=Date.now();
  document.getElementById('mq-q-num').textContent='Vraag '+(MQ.currentQ+1)+' / '+MQ.questions.length;
  const qpl=document.getElementById('mq-q-players');if(qpl)qpl.textContent=MQ.players.length+' speler'+(MQ.players.length===1?'':'s');
  document.getElementById('mq-q-text').textContent=q.v;
  document.getElementById('mq-answered-banner').textContent='';
  const opts=document.querySelectorAll('.mq-opt');
  opts.forEach((btn,i)=>{
    btn.textContent=MQ_SHAPES[i]+' '+(q.o[i]||'');
    btn.style.background=MQ_COLORS[i];
    btn.disabled=false;
    btn.className='mq-opt';
    btn.setAttribute('aria-label','Antwoord '+(i+1)+': '+q.o[i]);
  });
  // Timer
  let t=15;
  const timerEl=document.getElementById('mq-timer');
  const tbar=document.getElementById('mq-tbar');
  if(timerEl)timerEl.textContent=t;
  if(timerEl)timerEl.classList.remove('urgent');
  if(tbar){tbar.style.transition='none';tbar.style.width='100%';requestAnimationFrame(()=>{tbar.style.transition='width 15s linear';tbar.style.width='0%';});}
  if(MQ.timer)clearInterval(MQ.timer);
  MQ.timer=setInterval(()=>{
    t--;if(timerEl)timerEl.textContent=Math.max(0,t);
    if(t<=5&&timerEl)timerEl.classList.add('urgent');
    if(t<=0){clearInterval(MQ.timer);if(MQ.isHost)_mqDoReveal();}
  },1000);
  _mqPhase('game');
}

async function mqAnswer(idx){
  if(!MQ||MQ._answered)return;
  MQ._answered=true;
  const ms=Date.now()-MQ._qStart;
  document.querySelectorAll('.mq-opt').forEach((btn,i)=>{
    btn.disabled=true;
    btn.classList.add(i===idx?'chosen':'dimmed');
  });
  document.getElementById('mq-answered-banner').textContent='✓ Antwoord ingediend!';
  if(MQ.isHost){MQ.answers[MQ.me.id]={choice:idx,ms};if(Object.keys(MQ.answers).length>=MQ.players.length)_mqDoReveal();}
  else{await MQ.channel.send({type:'broadcast',event:'answer',payload:{pid:MQ.me.id,choice:idx,ms}});}
}

async function _mqDoReveal(){
  if(!MQ?.isHost)return;
  clearInterval(MQ.timer);
  const q=MQ.questions[MQ.currentQ];const correct=q.c;
  const results=MQ.players.map(p=>{
    const ans=MQ.answers[p.id];
    const ok=ans?.choice===correct;
    const pts=ok?Math.round(500+500*Math.max(0,1-ans.ms/15000)):0;
    MQ.scores[p.id]=(MQ.scores[p.id]||0)+pts;
    return{id:p.id,name:p.name,avatar:p.avatar,ok,pts,choice:ans?.choice};
  }).sort((a,b)=>MQ.scores[b.id]-MQ.scores[a.id]);
  const payload={correct,results,scores:{...MQ.scores},q:MQ.currentQ,expl:q.u};
  await MQ.channel.send({type:'broadcast',event:'reveal',payload});
  _mqShowReveal(payload);
}

function _mqShowReveal(payload){
  clearInterval(MQ.timer);
  const{correct,results,scores,expl}=payload;
  // Update buttons
  document.querySelectorAll('.mq-opt').forEach((btn,i)=>{
    btn.disabled=true;btn.className='mq-opt';
    btn.classList.add(i===correct?'correct':'wrong');
    btn.style.background=MQ_COLORS[i];
  });
  // My result
  const mine=results.find(r=>r.id===MQ.me.id);
  const resEl=document.getElementById('mq-reveal-result');
  if(resEl){resEl.textContent=mine?.ok?('✓ +'+mine.pts+' punten!'):'✗ Helaas…';resEl.style.color=mine?.ok?'#4ade80':'#f87171';}
  const ex=document.getElementById('mq-reveal-expl');if(ex){ex.textContent=expl||'';ex.style.display=expl?'block':'none';}
  // Mini leaderboard
  const lb=document.getElementById('mq-reveal-lb');
  if(lb)lb.innerHTML=results.slice(0,5).map((r,i)=>`<div class="mq-lb-row"><span class="mq-lb-pos">${i+1}</span><span class="mq-lb-av">${escapeHtml(r.avatar)}</span><span class="mq-lb-nm">${escapeHtml(r.name)}</span><span class="mq-lb-pts">${scores[r.id]||0} pt</span></div>`).join('');
  const wait=document.getElementById('mq-reveal-wait');
  if(wait)wait.textContent=MQ.isHost?'Volgende vraag begint zo…':'Wachten op host…';
  // Show game screen with revealed answers before switching phase
  setTimeout(()=>{
    _mqPhase('reveal');
    if(MQ?.isHost){
      setTimeout(async()=>{
        const next=MQ.currentQ+1;
        if(next>=MQ.questions.length){
          const fs=MQ.players.map(p=>({...p,score:MQ.scores[p.id]||0})).sort((a,b)=>b.score-a.score);
          await MQ.channel.send({type:'broadcast',event:'end',payload:{scores:fs}});
          _mqShowFinal(fs);
        }else{
          MQ.currentQ=next;
          await MQ.channel.send({type:'broadcast',event:'next',payload:{idx:next}});
          _mqShowQ();
        }
      },4000);
    }
  },800);
}

function _mqShowFinal(scores){
  const lb=document.getElementById('mq-final-lb');
  const medals=['🥇','🥈','🥉'];
  if(lb)lb.innerHTML=(Array.isArray(scores)?scores:[]).map((p,i)=>`<div class="mq-final-row${i<3?' mq-final-top':''}"><span class="mq-final-pos">${medals[i]||i+1}</span><span class="mq-final-av">${escapeHtml(p.avatar)}</span><span class="mq-final-nm">${escapeHtml(p.name)}</span><span class="mq-final-score">${p.score} pt</span></div>`).join('');
  _mqPhase('final');
}


/* ═══════ FLICKERING GRID ═══════ */
/* ── Flickering Grid (ported from magicui/flickering-grid) ───────────────
   Draws a canvas grid of small squares whose opacity flickers randomly,
   using the current level colour (--or-rgb CSS variable).               */
(function initFlickeringGrid(){
  var SQUARE = 4, GAP = 6, FLICKER = 0.1, MAX_OP = 0.45;
  var canvas = document.getElementById('flicker-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var cols, rows, squares, dpr = 1, lastTime = 0, animId;

  function getRgb(){
    return (getComputedStyle(document.documentElement)
      .getPropertyValue('--or-rgb') || '99,102,241').trim();
  }

  function setup(){
    dpr = window.devicePixelRatio || 1;
    var zone = canvas.parentElement;
    var w = zone.offsetWidth, h = zone.offsetHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    cols = Math.floor(w / (SQUARE + GAP));
    rows = Math.floor(h / (SQUARE + GAP));
    squares = new Float32Array(cols * rows);
    for (var i = 0; i < squares.length; i++)
      squares[i] = Math.random() * MAX_OP;
  }

  function draw(time){
    animId = requestAnimationFrame(draw);
    var dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var rgb = getRgb();
    var step = SQUARE + GAP;
    for (var i = 0; i < cols; i++){
      for (var j = 0; j < rows; j++){
        var idx = i * rows + j;
        if (Math.random() < FLICKER * dt)
          squares[idx] = Math.random() * MAX_OP;
        ctx.fillStyle = 'rgba(' + rgb + ',' + squares[idx] + ')';
        ctx.fillRect(i * step * dpr, j * step * dpr, SQUARE * dpr, SQUARE * dpr);
      }
    }
  }

  setup();
  new ResizeObserver(setup).observe(canvas.parentElement);

  // Pauzeer animatie als tab niet zichtbaar is
  document.addEventListener('visibilitychange', function(){
    if (document.hidden) {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    } else {
      if (!animId) animId = requestAnimationFrame(draw);
    }
  });

  // Pauzeer animatie als canvas buiten beeld is (IntersectionObserver)
  new IntersectionObserver(function(entries){
    if (entries[0].isIntersecting) {
      if (!animId) animId = requestAnimationFrame(draw);
    } else {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    }
  }, { threshold: 0 }).observe(canvas);

  // Geen animatie voor gebruikers die dat prefereren
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  animId = requestAnimationFrame(draw);
})();


/* ═══════ PUSH NOTIFICATIONS ═══════ */
// ══════════════════════════════════════════════════════════════
// PUSH NOTIFICATIONS
// ══════════════════════════════════════════════════════════════
const _NK='slagio_notif_v1';
const _NV='slagio_visit_cnt';

function _nCfg(){try{return JSON.parse(localStorage.getItem(_NK)||'null');}catch{return null;}}
function _nSave(c){try{localStorage.setItem(_NK,JSON.stringify(c));}catch{}}
// iOS = iPhone/iPad (ook iPadOS op iPad met mouse die zich voordoet als Mac)
function _isIOS(){return /iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}
// Standalone = geïnstalleerd op beginscherm
function _isStandalone(){return window.matchMedia('(display-mode:standalone)').matches||!!navigator.standalone;}

function initNotifications(){
  const visits=parseInt(localStorage.getItem(_NV)||'0')+1;
  localStorage.setItem(_NV,String(visits));
  const cfg=_nCfg();
  // iOS in browser (niet geïnstalleerd): meldingen werken niet - toon installatie-tip
  if(_isIOS()&&!_isStandalone()){
    if(cfg?.iosInstallDismissed||cfg?.denied)return;
    if(visits>=3)setTimeout(_showIOSInstallPrompt,5000);
    return;
  }
  if(!('Notification' in window))return;
  if(Notification.permission==='granted'&&cfg?.granted){_setupNotifSW();_checkInAppNotif();return;}
  if(cfg?.denied||Notification.permission==='denied')return;
  if(cfg?.snoozeUntil&&Date.now()<cfg.snoozeUntil)return;
  const totalQ=(getStreak().totalQuizzes||0);
  if(visits>=2&&totalQ>=1)setTimeout(_showNotifPrompt,5000);
}

function _showNotifPrompt(){
  const el=document.getElementById('notif-prompt');
  if(!el||el.classList.contains('visible'))return;
  // Zorg dat standaard-prompt zichtbaar is (niet de iOS-variant)
  const ico=el.querySelector('.np-ico');const ttl=el.querySelector('.np-title');const btns=el.querySelector('.np-btns');
  if(ico)ico.textContent='🔔';
  if(ttl)ttl.innerHTML='Studieherinneringen<small>Gratis · altijd uit te zetten</small>';
  if(btns)btns.innerHTML='<button class="np-allow" onclick="enableNotifications()">🔔 Zet aan</button><button class="np-later" onclick="dismissNotifPrompt(false)">Straks</button>';
  const streak=calcStreak().current;
  const tgt=typeof getCountdownTarget==='function'?getCountdownTarget():null;
  let body='Ontvang elke dag een herinnering om te oefenen en je streak te bewaren. Gratis, altijd uit te zetten.';
  if(streak>1){body=`Je hebt een streak van <strong>${streak} dagen</strong>! We herinneren je dagelijks zodat je hem niet verliest. 🔥`;}
  else if(tgt?.datum){const d=Math.ceil((new Date(tgt.datum)-new Date())/86400000);if(d>0&&d<=30)body=`Nog <strong>${d} dagen</strong> tot ${tgt.vak||'je volgende examen'}! Dagelijkse herinneringen helpen je consistent te studeren.`;}
  const b=document.getElementById('np-body');if(b)b.innerHTML=body;
  el.classList.add('visible');
}

function _showIOSInstallPrompt(){
  const el=document.getElementById('notif-prompt');
  if(!el||el.classList.contains('visible'))return;
  const ico=el.querySelector('.np-ico');const ttl=el.querySelector('.np-title');const btns=el.querySelector('.np-btns');
  const b=document.getElementById('np-body');
  if(ico)ico.textContent='📲';
  if(ttl)ttl.innerHTML='Installeer Slagio<small>Voor herinneringen op iPhone/iPad</small>';
  if(b)b.innerHTML='Meldingen werken op iOS alleen via de geïnstalleerde app.<br><br>Tik op <strong>Delen&nbsp;⬆</strong> in Safari en kies <strong>"Zet op beginscherm"</strong> - dan ontvang je dagelijkse studie&shy;herinneringen.';
  if(btns)btns.innerHTML='<button class="np-allow" onclick="_dismissIOSInstall()">👍 Begrepen</button>';
  el.classList.add('visible');
}
function _dismissIOSInstall(){
  const el=document.getElementById('notif-prompt');if(el)el.classList.remove('visible');
  const cfg=_nCfg()||{};cfg.iosInstallDismissed=true;_nSave(cfg);
}

async function enableNotifications(){
  const el=document.getElementById('notif-prompt');if(el)el.classList.remove('visible');
  // iOS browser: kan geen toestemming vragen - installatie nodig
  if(_isIOS()&&!_isStandalone()){_showIOSInstallPrompt();return;}
  if(!('Notification' in window)){showToast('Je browser ondersteunt geen meldingen','#ef4444',3000);return;}
  try{
    const perm=await Notification.requestPermission();
    if(perm==='granted'){
      _nSave({granted:true,grantedAt:Date.now()});
      await _setupNotifSW();
      renderNotifStatus();
      showToast('✅ Meldingen ingeschakeld!','#4ade80',3500);
    }else{
      _nSave({denied:true});
      showToast('Meldingen zijn uitgeschakeld in je browser.','#94a3b8',3000);
    }
  }catch(e){console.warn('Notification permission:',e);}
}

function dismissNotifPrompt(permanent){
  const el=document.getElementById('notif-prompt');if(el)el.classList.remove('visible');
  const cfg=_nCfg()||{};
  if(permanent)cfg.denied=true;else cfg.snoozeUntil=Date.now()+3*24*3600000;
  _nSave(cfg);
}

async function _setupNotifSW(){
  if(!('serviceWorker' in navigator))return;
  try{
    const reg=await navigator.serviceWorker.ready;
    // Periodic background sync: Chrome PWA only (iOS negeert dit stilletjes)
    if('periodicSync' in reg){
      try{
        const status=await navigator.permissions.query({name:'periodic-background-sync'});
        if(status.state==='granted')await reg.periodicSync.register('slagio-daily',{minInterval:22*3600000});
      }catch{}
    }
    _sendNotifData(reg);
  }catch{}
}

function _sendNotifData(reg){
  try{
    const streak=calcStreak().current||0;
    const tgt=typeof getCountdownTarget==='function'?getCountdownTarget():null;
    let examDays=null;
    if(tgt?.datum){const d=Math.ceil((new Date(tgt.datum)-new Date())/86400000);if(d>0&&d<=30)examDays=d;}
    reg.active?.postMessage({type:'NOTIF_CONFIG',config:{enabled:true,streak,examDays,lastShown:null}});
  }catch{}
}

// Toon notificatie via Service Worker - werkt op iOS standalone én desktop
async function _showNotifViaReg(title,body){
  if(!('serviceWorker' in navigator))return false;
  try{
    const reg=await navigator.serviceWorker.ready;
    await reg.showNotification(title,{body,icon:'/icon-192.png',badge:'/icon-192.png',tag:'slagio-daily',data:{url:'/'}});
    return true;
  }catch{return false;}
}

function _checkInAppNotif(){
  if(Notification.permission!=='granted')return;
  const last=parseInt(localStorage.getItem('slagio_notif_shown')||'0');
  if(Date.now()-last<20*3600000)return;
  const today=new Date();today.setHours(0,0,0,0);
  const todayStr=today.toISOString().slice(0,10);
  if((getStreak().days||[]).includes(todayStr))return;
  const cur=calcStreak().current;if(cur<1)return;
  const title='Slagio 📚';
  const body=`Je hebt een streak van ${cur} dag${cur===1?'':'en'}! Oefen vandaag om hem te bewaren. 🔥`;
  // Gebruik altijd de SW-route: werkt op iOS standalone én desktop Chrome/Firefox
  _showNotifViaReg(title,body).then(ok=>{
    if(ok)localStorage.setItem('slagio_notif_shown',String(Date.now()));
  }).catch(()=>{
    try{new Notification(title,{body,icon:'/icon-192.png',badge:'/icon-192.png',tag:'slagio-daily'});
      localStorage.setItem('slagio_notif_shown',String(Date.now()));}catch{}
  });
}

function renderNotifStatus(){
  const el=document.getElementById('notif-status-row');
  if(!el)return;
  const cfg=_nCfg();
  const granted=cfg?.granted&&Notification.permission==='granted';
  el.innerHTML=granted
    ?`<span style="font-size:13px;color:var(--mu)">🔔 Meldingen <strong style="color:var(--or)">aan</strong></span>
       <button onclick="disableNotifications()" style="font-size:11px;color:var(--mu);background:none;border:1px solid var(--bo);border-radius:7px;padding:4px 10px;cursor:pointer;font-family:var(--font)">Uitzetten</button>`
    :`<span style="font-size:13px;color:var(--mu)">🔕 Meldingen uit</span>
       <button onclick="_showNotifPrompt()" style="font-size:11px;color:var(--or);background:rgba(var(--or-rgb),.1);border:1px solid rgba(var(--or-rgb),.3);border-radius:7px;padding:4px 10px;cursor:pointer;font-family:var(--font)">Inschakelen</button>`;
}

function disableNotifications(){
  _nSave({denied:true});
  renderNotifStatus();
  showToast('🔕 Meldingen uitgeschakeld','#94a3b8',2500);
}

if('serviceWorker' in navigator){
  // Toon de "nieuwe versie"-banner zodra een nieuwe SW de controle overneemt.
  // Alleen bij een echte update (er was al een controller), niet bij de
  // allereerste installatie.
  const _hadController=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
    if(_hadController){const b=document.getElementById('sw-update-banner');if(b)b.classList.add('show');}
  });
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'}).then(reg=>{
      reg.update();
      navigator.serviceWorker.ready.then(()=>initNotifications());
    }).catch(()=>{});
  });
  // Controleer op updates zodra de app weer op de voorgrond komt. Zo blijft een
  // geïnstalleerde PWA niet op een oude service worker (en oude cache) hangen,
  // ook als hij alleen uit de app-switcher wordt hervat.
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden)navigator.serviceWorker.getRegistration().then(r=>{if(r)r.update();}).catch(()=>{});
  });
}

// Veilige SW-update: skipWaiting → éénmalig controllerchange → herlaad
function swUpdate(){
  navigator.serviceWorker.getRegistration().then(reg=>{
    if(reg?.waiting){
      // Luister éénmalig op controllerchange, pas DAN herlaad (na SW-overname)
      navigator.serviceWorker.addEventListener('controllerchange',()=>window.location.reload(),{once:true});
      reg.waiting.postMessage({type:'SKIP_WAITING'});
    } else {
      window.location.reload();
    }
  }).catch(()=>window.location.reload());
}


/* ═══════ PWA INSTALL BANNER ═══════ */
(function(){
  const SNOOZE_KEY='slagio_pwa_snooze';
  const SESSION_KEY='slagio_pwa_sessions';
  const QUIZ_SCREENS=['sc-quiz','sc-flash','sc-botrace','sc-simtoets','sc-leerpad'];
  let _deferredPrompt=null;
  let _bannerShown=false;

  function isSnoozed(){
    const t=localStorage.getItem(SNOOZE_KEY);
    return t&&(Date.now()-parseInt(t))<7*24*60*60*1000;
  }
  function snooze(){localStorage.setItem(SNOOZE_KEY,Date.now());}
  function isInQuiz(){
    return QUIZ_SCREENS.some(id=>{const el=document.getElementById(id);return el&&el.classList.contains('on');});
  }
  function showBanner(){
    if(_bannerShown||isSnoozed()||isInQuiz())return;
    _bannerShown=true;
    document.getElementById('pwa-banner').classList.add('show');
  }
  function hideBanner(){document.getElementById('pwa-banner').classList.remove('show');}

  // Count sessions
  const sessions=parseInt(sessionStorage.getItem(SESSION_KEY)||'0')+1;
  sessionStorage.setItem(SESSION_KEY,sessions);

  // iOS fallback banner
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!window.MSStream;
  const isStandalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone;

  if(isStandalone){return;} // Already installed

  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    _deferredPrompt=e;
    if(sessions>=2&&!isSnoozed()){
      setTimeout(showBanner,2000);
    }
  });

  // De pwa-banner-elementen staan later in de HTML dan dit script → bind de
  // knoppen pas als de DOM klaar is (anders null.addEventListener bij parse-tijd).
  function _wirePwa(){
    const ib=document.getElementById('pwa-install-btn');
    if(ib)ib.addEventListener('click',()=>{
      hideBanner();
      if(_deferredPrompt){
        _deferredPrompt.prompt();
        _deferredPrompt.userChoice.then(()=>{_deferredPrompt=null;});
      }
    });
    const db=document.getElementById('pwa-dismiss-btn');
    if(db)db.addEventListener('click',()=>{hideBanner();snooze();});
    // iOS: show manual instructions
    if(isIOS&&sessions>=2&&!isSnoozed()){
      setTimeout(()=>{
        if(_bannerShown||isSnoozed())return;
        _bannerShown=true;
        const b=document.getElementById('pwa-banner');
        if(!b)return;
        b.querySelector('.pwa-banner-title').textContent='Voeg toe aan beginscherm';
        b.querySelector('.pwa-banner-sub').textContent='Tik op Delen ↑ → "Zet op beginscherm" voor snelle toegang';
        b.querySelector('#pwa-install-btn').style.display='none';
        b.classList.add('show');
      },2000);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',_wirePwa);
  else _wirePwa();
})();
