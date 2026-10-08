// ═══════ INTRO MODAL ═══════
const INTRO_STEPS_N=3;
let _introIdx=0;
let _introPickedAnimal=null;

/* ===== ONBOARDING v3 ===== */
const OB_KEY='slagio_onboard_v3';
let _obStep=0,_obPickedAnimal=null;
function showOnboarding(){
  // Slanke flow: start direct bij de mascotte-keuze (het leuke, signature-deel).
  // Geen feature-tour en geen account-muur vooraf - waarde tonen, niet vertellen.
  _obStep=1;_obPickedAnimal=null;
  _obBuildAnimals();
  const prog=document.querySelector('#ob-overlay .ob-progress');
  if(prog)prog.style.display='none';
  document.getElementById('ob-overlay').style.display='flex';
  _obRender();
}
function obFinishAndStart(){
  try{obFinish(false);}catch(e){var o=document.getElementById('ob-overlay');if(o)o.style.display='none';}
  // Niveau → mascotte → commitment (waarom + dagdoel) → eerste oefening (eerste winst).
  if(typeof showCommit==='function'&&typeof committed==='function'&&!committed()){
    setTimeout(()=>{try{showCommit();}catch(e){try{startStreakQuiz();}catch(_){}}},350);
  }else{
    try{startStreakQuiz();}catch(e){}
  }
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
    try{ if(typeof grantRegGift==='function') setTimeout(grantRegGift,1200); }catch(e){}
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
  // Vonk neemt de intro over: loopt alle belangrijke dingen langs.
  setTimeout(()=>{try{if(typeof vonkIntro==='function')vonkIntro();}catch(e){}},650);
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
  setTimeout(()=>{try{if(typeof vonkIntro==='function')vonkIntro();}catch(e){}},450);
}

function _introRender(){
  document.querySelectorAll('#sc-intro .intro-step').forEach((s,i)=>s.classList.toggle('on',i===_introIdx));
  const dots=document.getElementById('intro-mdots');
  dots.innerHTML=Array.from({length:INTRO_STEPS_N},(_,i)=>`<div class="intro-mdot${i===_introIdx?' on':''}"></div>`).join('');
  const badge=document.getElementById('intro-level-badge');
  if(badge)badge.textContent=(APP_LEVEL==='havo'?'HAVO':'VWO')+' 2027';
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
  html.classList.remove('level-havo','level-vwo','level-vmbo');
  html.classList.add('level-'+level);
  // Update favicon colour to match level (vmbo = teal)
  const col=level==='vwo'?'%238b5cf6':level==='vmbo'?'%2316a34a':'%232563eb';
  const svg=`%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='${col}'/%3E%3Ctext x='16' y='24' font-family='Arial Black,sans-serif' font-size='19' font-weight='900' fill='white' text-anchor='middle'%3ESl%3C/text%3E%3C/svg%3E`;
  const fav=document.querySelector('link[rel="icon"]');
  if(fav)fav.href='data:image/svg+xml,'+svg;
}

// ═══════ LEVEL SELECT ═══════
function _updatePageSEO(level){
  const nivNaam=level==='havo'?'HAVO':level==='vmbo'?'VMBO GL/TL':'VWO';
  const url='https://slagio.nl/'+(level||'');
  document.title=level
    ?`Slagio - ${nivNaam} Examenvoorbereiding 2027 | 20.000+ vragen, eindexamens, studieplan`
    :'Slagio - Complete HAVO, VWO & VMBO Examenvoorbereiding 2027';
  const desc=level
    ?`Gratis ${nivNaam} examenvoorbereiding 2027. 20.000+ oefenvragen per domein, echte CE-eindexamens 2019–2025, persoonlijk studieplan, spaced repetition flashcards en cijfercalculator. Geen account nodig.`
    :'Kies je niveau: HAVO, VWO of VMBO. Gratis examenvoorbereiding met 20.000+ oefenvragen, echte eindexamens 2019–2025, studieplan en meer.';
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
  try{ if(typeof _funnel==='function')_funnel('level'); }catch(e){} // trechter: niveau gekozen
  applyLevelTheme(level);
  // Samenvattingen alvast op de achtergrond laden (parallel, blokkeert de grid niet),
  // zodat ze klaar zijn wanneer een leerling een vak/samenvatting opent.
  try{if(typeof ensureSamData==='function')ensureSamData(level);}catch(e){}
  updateLevelChip();
  buildGrid();
  buildSlaagInputs();
  renderSchedule();
  // Update intro badge
  const badge=document.getElementById('intro-level-badge');
  if(badge)badge.textContent=(level==='havo'?'HAVO':level==='vmbo'?'VMBO':'VWO')+' 2027';
  // Push URL: /havo or /vwo
  if(!_noHistory)history.pushState({level},'','/'+level);
  _updatePageSEO(level);
  // Show intro for first-time users, home for returning users
  show('sc-home');
  buildGrid();renderStreak();renderFavHome();renderXPHome();renderDailyChallenge();renderHomeStats();renderGreeting();try{renderKlasHome();}catch(e){}try{renderEconHome();renderLeagueHome();}catch(e){}
  const _isNew=!localStorage.getItem(OB_KEY)&&!localStorage.getItem('slagio_seen_intro_v2');
  // Als de onboarding net is afgerond en meteen naar een optioneel scherm
  // (cijfers/studieplan/account) routeert, geen home-popups tonen: die zouden
  // over dat scherm heen vallen en de intro "niet vlekkeloos" laten voelen.
  if(window._onbRouting){/* geen popups tijdens post-onboarding routing */}
  else if(_isNew){try{if(typeof onbStil==='function')onbStil();}catch(e){}} // nieuw: meteen de vakken, maatje en account pas na de eerste quiz
  else if(!localStorage.getItem('slagio_vonk_intro_done')){setTimeout(()=>{try{if(typeof vonkIntro==='function')vonkIntro();}catch(e){}},500);}
  else{try{if(typeof vonkStreakNudge==='function')vonkStreakNudge();}catch(e){}} // de dagelijkse uitdaging staat op de home, geen pop-up meer
}
function _nivLabel(l){return l==='vwo'?'VWO':l==='vmbo'?'VMBO':'HAVO';}
function updateLevelChip(){
  const chip=document.getElementById('home-level-chip');
  if(chip)chip.textContent=_nivLabel(APP_LEVEL)+' 2027';
  const badge=document.getElementById('vak-level-badge');
  if(badge)badge.textContent=_nivLabel(APP_LEVEL);
}

// ═══════ INIT ═══════
// Only apply level theme if a level was already chosen (skip on welcome screen)
if(localStorage.getItem('examenapp_level')) applyLevelTheme(APP_LEVEL);
else document.documentElement.classList.add('level-welcome');
try{initChallengeOnLoad();}catch(e){}
try{applyTheme();}catch(e){}
try{reconcileCoins();applyStreakFreezes();}catch(e){}
try{ensureLeague();}catch(e){}
try{renderEconHome();renderLeagueHome();}catch(e){}
try{renderRegHome();}catch(e){}
setTimeout(()=>{try{renderPlayRow();}catch(e){}},0);
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
// Home-screen widget-mogelijkheid: app-icoon-badge + snelkoppeling-deeplinks.
try{if(typeof slagioWidgetInit==='function')slagioWidgetInit();}catch(e){}
// Show welcome on first load (sc-welcome is default via class="on")
// ═══════ BOTTOM NAV ═══════
function updateBottomNav(id){
  // sc-auth counts as sc-profiel; sociaal-subschermen tellen als sc-sociaal (Wedstrijd)
  let activeId=(id==='sc-auth')?'sc-profiel':id;
  if(['sc-league','sc-groep','sc-leaderboard'].includes(id))activeId='sc-sociaal';
  document.querySelectorAll('.bnav-btn').forEach(b=>{
    b.classList.toggle('active',b.dataset.screen===activeId);
  });
  // Secundaire "Meer"-items (zijbalk) ook markeren op hun eigen scherm.
  document.querySelectorAll('.snav-btn').forEach(b=>{
    b.classList.toggle('active',!!b.dataset.screen&&b.dataset.screen===activeId);
  });
  // Update profiel button label: Inloggen vs Profiel
  const lbl=document.getElementById('bnav-profiel-label');
  if(lbl)lbl.textContent=currentUser?'Profiel':'Inloggen';
  const pbtn=document.getElementById('bnav-profiel-btn');
  if(pbtn)pbtn.title=currentUser?'Profiel':'Inloggen';
  // Hide bottom nav during quiz/flashcard/qmode + het resultaat-moment
  // (finish = één rustige compositie, geen concurrerende navigatiebalk).
  const hideScreens=['sc-quiz','sc-flash','sc-qmode','sc-welcome','sc-race','sc-res','sc-race-res','sc-examen','sc-examsim'];
  const bn=document.getElementById('bottom-nav');
  const navHidden=hideScreens.includes(id);
  if(bn) bn.style.display=navHidden?'none':'';
  // Op desktop laat de body-padding de zijbalk-ruimte vrij; tijdens quiz weg.
  try{document.body.classList.toggle('nav-hidden',navHidden);}catch(e){}
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
// ── Desktop-zijbalk in-/uitklappen (voorkeur onthouden) ──
function toggleSidebar(){
  const c=document.body.classList.toggle('sidebar-collapsed');
  try{localStorage.setItem('slagio_sidebar_collapsed',c?'1':'0');}catch(e){}
}
// Voorkeur direct toepassen (voor de eerste paint, zonder flikker).
try{if(localStorage.getItem('slagio_sidebar_collapsed')==='1')document.body.classList.add('sidebar-collapsed');}catch(e){}
// Hover-tooltips op de nav-knoppen (nuttig als de zijbalk is ingeklapt).
try{document.querySelectorAll('#bottom-nav .bnav-btn,#bottom-nav .snav-btn,#bottom-nav .bnav-fab').forEach(function(b){
  if(!b.title){var t=b.getAttribute('aria-label')||(b.textContent||'').trim();if(t)b.title=t;}
});}catch(e){}

// ── Mobiel menu (bottom-sheet met alle onderdelen) ──
// ═══════ MENU (TELEFOON) ═══════
// Eén menu voor alles wat geen eigen tab heeft. Op de telefoon een bottom sheet
// in Slagio-stijl: nachtblauw kopje zoals de aftelklok (gloed in de niveaukleur),
// Vonk die over de rand kijkt, dikke tegels met tekeningen in Vonk-stijl (vlak,
// twee tinten) en per tegel wat er nu speelt. Veer-animatie, vegen om te sluiten.
// Desktop heeft de zijbalk; daar is dit een zwevende kaart (CSS, min-width:900px).
const _MS_ART={
  examens:'<rect x="9" y="5" width="25" height="33" rx="4" fill="var(--t2)"/><rect x="14" y="12" width="14" height="3.2" rx="1.6" fill="var(--t1)"/><rect x="14" y="18.5" width="10" height="3.2" rx="1.6" fill="var(--t1)"/><rect x="14" y="25" width="12" height="3.2" rx="1.6" fill="var(--t1)" opacity=".55"/><circle cx="34" cy="35" r="9" fill="var(--t1)"/><path d="M30 35.2l2.8 2.8 5-5.6" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  herhalen:'<rect x="7" y="7" width="23" height="29" rx="4.5" fill="var(--t2)"/><rect x="17" y="13" width="23" height="29" rx="4.5" fill="var(--t1)"/><path d="M33.6 26.5a5.2 5.2 0 1 1-1.9-4.1" stroke="#fff" stroke-width="2.7" fill="none" stroke-linecap="round"/><path d="M32.6 19.4l.4 3.6-3.6.6" stroke="#fff" stroke-width="2.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  fouten:'<rect x="9" y="5" width="27" height="36" rx="4.5" fill="var(--t1)"/><rect x="33" y="9" width="6" height="29" rx="2.5" fill="var(--t2)"/><rect x="13" y="5" width="3.5" height="36" fill="#000" opacity=".12"/><path d="M20 18l8 8M28 18l-8 8" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>',
  plan:'<rect x="7" y="10" width="34" height="30" rx="5" fill="var(--t2)"/><path d="M7 15a5 5 0 0 1 5-5h24a5 5 0 0 1 5 5v4H7z" fill="var(--t1)"/><rect x="14" y="6" width="3.6" height="9" rx="1.8" fill="var(--t1)"/><rect x="30.4" y="6" width="3.6" height="9" rx="1.8" fill="var(--t1)"/><path d="M17 29.5l4.2 4.2 9-9.6" stroke="var(--t1)" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  rooster:'<rect x="20.5" y="3.5" width="7" height="5" rx="2" fill="var(--t1)"/><circle cx="24" cy="26" r="17" fill="var(--t1)"/><circle cx="24" cy="26" r="12.5" fill="#fff"/><path d="M24 26v-8M24 26l5.5 3.4" stroke="var(--t1)" stroke-width="3.2" stroke-linecap="round"/><circle cx="24" cy="26" r="2.4" fill="var(--t1)"/>',
  voortgang:'<rect x="7" y="27" width="9" height="13" rx="2.5" fill="var(--t2)"/><rect x="19.5" y="19" width="9" height="21" rx="2.5" fill="var(--t2)"/><rect x="32" y="9" width="9" height="31" rx="2.5" fill="var(--t1)"/><path d="M9 20l9-7 7 4 11-10" stroke="var(--t1)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>',
  cijfers:'<rect x="10" y="4" width="28" height="40" rx="6" fill="var(--t1)"/><rect x="14.5" y="8.5" width="19" height="9" rx="2.5" fill="var(--t2)"/><g fill="#fff"><circle cx="17.5" cy="24.5" r="2.5"/><circle cx="24" cy="24.5" r="2.5"/><circle cx="30.5" cy="24.5" r="2.5"/><circle cx="17.5" cy="31" r="2.5"/><circle cx="24" cy="31" r="2.5"/><circle cx="30.5" cy="31" r="2.5"/><circle cx="17.5" cy="37.5" r="2.5"/><circle cx="24" cy="37.5" r="2.5"/></g><rect x="28" y="34.5" width="5" height="6" rx="2.5" fill="var(--t2)"/>',
  trainer:'<circle cx="22" cy="26" r="17" fill="var(--t2)"/><circle cx="22" cy="26" r="11" fill="#fff"/><circle cx="22" cy="26" r="5.5" fill="var(--t1)"/><path d="M22 26L40 8" stroke="var(--t1)" stroke-width="3.2" stroke-linecap="round"/><path d="M35 6.5l5.5 1.5L42 13.5l-3.8-1.2z" fill="var(--t1)"/>',
  arcade:'<rect x="4" y="14" width="40" height="22" rx="11" fill="var(--t1)"/><rect x="11" y="23.5" width="10" height="3.4" rx="1.7" fill="#fff"/><rect x="14.3" y="20.2" width="3.4" height="10" rx="1.7" fill="#fff"/><circle cx="32" cy="22.5" r="3" fill="var(--t2)"/><circle cx="37" cy="28" r="3" fill="#fff"/><rect x="18" y="9" width="12" height="7" rx="3" fill="var(--t2)"/>',
  wedstrijd:'<path d="M13 6h22v10a11 11 0 0 1-22 0z" fill="var(--t1)"/><path d="M13.5 10H8.5a5.5 5.5 0 0 0 6.5 8M34.5 10h5a5.5 5.5 0 0 1-6.5 8" stroke="var(--t1)" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="21.5" y="26" width="5" height="7" fill="var(--t1)"/><rect x="13" y="32" width="22" height="9" rx="3" fill="var(--t2)"/><path d="M24 10.5l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="#fff"/>',
  groep:'<circle cx="31.5" cy="16" r="6.5" fill="var(--t2)"/><path d="M20 38a11.5 11.5 0 0 1 23 0z" fill="var(--t2)"/><circle cx="18.5" cy="18.5" r="7.5" fill="var(--t1)"/><path d="M5 41a13.5 13.5 0 0 1 27 0z" fill="var(--t1)"/>',
  winkel:'<path d="M16.5 17v-3.5a7.5 7.5 0 0 1 15 0V17" stroke="var(--t1)" stroke-width="3.4" fill="none" stroke-linecap="round"/><rect x="7" y="15" width="31" height="26" rx="6" fill="var(--t1)"/><rect x="7" y="15" width="31" height="6" rx="3" fill="#000" opacity=".1"/><circle cx="35" cy="35" r="9" fill="#f6b11c"/><circle cx="35" cy="35" r="5.8" fill="#ffd45c"/><path d="M35 31.5v7" stroke="#d98a00" stroke-width="2.4" stroke-linecap="round"/>',
  mijnstof:'<path d="M8 6.5A3.5 3.5 0 0 1 11.5 3H33l7 7v29.5a3.5 3.5 0 0 1-3.5 3.5h-25A3.5 3.5 0 0 1 8 39.5z" fill="var(--t2)"/><path d="M33 3v5.5a1.5 1.5 0 0 0 1.5 1.5H40z" fill="var(--t1)"/><rect x="14" y="16" width="16" height="3.2" rx="1.6" fill="var(--t1)"/><rect x="14" y="22.5" width="12" height="3.2" rx="1.6" fill="var(--t1)"/><path d="M27 41l2-7.5 12.5-12.5a2.8 2.8 0 0 1 4 4L33 37.5z" fill="var(--t1)"/><path d="M29 33.5l3.5 3.5" stroke="#fff" stroke-width="1.6" opacity=".7"/>',
  toetsen:'<rect x="6" y="9" width="36" height="32" rx="6" fill="var(--t2)"/><path d="M6 15a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6v4H6z" fill="var(--t1)"/><rect x="13" y="5" width="4" height="9" rx="2" fill="var(--t1)"/><rect x="31" y="5" width="4" height="9" rx="2" fill="var(--t1)"/><text x="24" y="35.5" text-anchor="middle" font-family="var(--font-head)" font-weight="900" font-size="14" fill="var(--t1)">7</text>',
  profiel:'<circle cx="24" cy="24" r="19" fill="var(--t2)"/><circle cx="24" cy="19.5" r="7" fill="var(--t1)"/><path d="M11.5 37.5a13 13 0 0 1 25 0A18.8 18.8 0 0 1 24 43a18.8 18.8 0 0 1-12.5-5.5z" fill="var(--t1)"/>'
};
function _msArt(n){return '<svg viewBox="0 0 48 48" aria-hidden="true">'+(_MS_ART[n]||'')+'</svg>';}
const _MS_IC={
  zoek:'<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4.3-4.3"/>',
  geluid:'<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
  maan:'<path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.6 6.6 0 0 0 9.7 9.7z"/>',
  wissel:'<path d="M7 4 3 8l4 4"/><path d="M3 8h14"/><path d="m17 12 4 4-4 4"/><path d="M21 16H7"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2.2-2.4 3.7M12 17.3h.01"/>'
};
function _msSvg(n){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(_MS_IC[n]||'')+'</svg>';}
// Wat er nu speelt per tegel: kort, echt en alleen als het iets zegt.
function _msStand(){
  const st={};
  try{const n=(typeof fbDueCount==='function')?fbDueCount():0;st.fouten=n>0?{t:n+' klaar',heet:1}:{t:'je fouten'};}catch(e){}
  try{const n=(typeof herhaalDueCount==='function')?herhaalDueCount():0;st.herhalen=n>0?{t:n+' klaar',heet:1}:{t:'alles bij'};}catch(e){}
  try{const t=getCountdownTarget();if(t){const d=Math.ceil(((t.dt||new Date(t.datum))-new Date())/864e5);st.rooster={t:'nog '+d+' dagen'};}}catch(e){}
  try{st.winkel={t:getCoins()+' munten'};}catch(e){}
  try{const m=(typeof msStand==='function')?msStand():null;if(m){st.toetsen=m.toets?m:{t:'met aftelklok'};st.mijnstof=m.toets?{t:'kaartjes en quiz'}:m;}}catch(e){}
  try{const L=ensureLeague();const d=LEAGUE_DIVISIONS[L.division];if(d)st.wedstrijd={t:d.naam};}catch(e){}
  try{const m=getMijnVakken();st.plan={t:m.length?'voor '+m.length+' vakken':'maak je plan'};}catch(e){}
  return st;
}
const _MS_GROEPEN=[
  ['Leren','ms-g-leer',[
    ['mijnstof','Mijn stof',"openMijnStof('stof')",''],
    ['examens','Examens',"openExamenBieb()",'met antwoorden'],
    ['herhalen','Herhalen',"openHerhalen()",''],
    ['fouten','Foutenboek',"openFoutenboek()",'','ms-rood'],
    ['vonk','Vraag Vonk',"openVonkChat()",'stel je vraag'],
    ['toetsen','Mijn toetsen',"openMijnStof('toets')",'']]],
  ['Plannen','ms-g-plan',[
    ['plan','Studieplan',"show('sc-studieplan');renderStudieplan()",''],
    ['rooster','Rooster',"show('sc-schedule');renderSchedule()",'je examens'],
    ['voortgang','Voortgang',"openRapport()",'per vak'],
    ['cijfers','Cijfers',"show('sc-calc');setTimeout(prefillCalcFromSaved,50)",'je eindcijfer']]],
  ['Spelen','ms-g-spel',[
    ['arcade','Arcade',"arcadeOpen()",'speel en leer'],
    ['wedstrijd','Wedstrijd',"openLeague()",'deze week'],
    ['groep','Groep',"show('sc-groep');renderGroepScreen()",'met je klas'],
    ['winkel','Winkel',"openShop()",'']]]
];
// Home: de tegels en de zoekbalk krijgen dezelfde tekeningen en Vonk als het menu.
(function(){
  try{document.querySelectorAll('.hm-tegel [data-art]').forEach(el=>{el.innerHTML=_msArt(el.dataset.art);});}catch(e){}
  try{const v=document.getElementById('hm-zoekbalk-vonk');if(v&&typeof mascotSVG==='function')v.innerHTML=mascotSVG('kijk',40);}catch(e){}
})();
let _msY0=0,_msDY=0,_msT0=0,_msSleep=false,_msTerugFocus=null;
function openNavSheet(){
  let ov=document.getElementById('nav-sheet-ov');
  if(ov)ov.remove();
  ov=document.createElement('div');ov.id='nav-sheet-ov';ov.className='ms-ov';
  ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Menu');
  let geluid=true;try{geluid=localStorage.getItem(SND_KEY)!=='0';}catch(e){}
  const donker=document.documentElement.classList.contains('dark');
  const niv=(typeof APP_LEVEL!=='undefined'&&APP_LEVEL)?APP_LEVEL.toUpperCase():'';
  let naam='';try{naam=(localStorage.getItem('slagio_naam')||'').trim().split(' ')[0];}catch(e){}
  let streak=0,munten=0,lvl=1;
  try{streak=calcStreak().current||0;}catch(e){}try{munten=getCoins();}catch(e){}try{lvl=getLevelForXP(getTotalXP());}catch(e){}
  const stand=_msStand();
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const ga=code=>"_msGa('"+code.replace(/\\/g,'\\\\').replace(/'/g,"\\'")+"')";
  let i=0;
  const vonk=(typeof mascotSVG==='function')?mascotSVG('blij',84):'';
  const vonkKlein=(typeof mascotSVG==='function')?mascotSVG('kijk',40):'';
  const tegel=([art,lbl,go,sub,extra])=>{
    const s=stand[art]||(sub?{t:sub}:null);
    const ic=art==='vonk'?'<span class="ms-art ms-art-vonk">'+vonkKlein+'</span>':'<span class="ms-art">'+_msArt(art)+'</span>';
    return '<button class="ms-tegel'+(extra?' '+extra:'')+'" style="--i:'+(i++)+'" onclick="'+ga(go)+'">'+ic
      +'<span class="ms-tt"><b>'+lbl+'</b>'+(s?'<small'+(s.heet?' class="heet"':'')+'>'+esc(s.t)+'</small>':'')+'</span></button>';
  };
  ov.innerHTML='<div class="ms-sheet" tabindex="-1">'
    +'<div class="ms-kop">'
      +'<div class="ms-vonk" aria-hidden="true">'+vonk+'</div>'
      +'<div class="ms-grip" aria-hidden="true"></div>'
      +'<div class="ms-kop-rij"><div><div class="ms-titel">'+(naam?'Hoi '+esc(naam)+'!':'Hoi!')+'</div><div class="ms-sub">Waar gaan we heen?</div></div>'
      +'</div>'
      +'<div class="ms-stats"><span><i class="ms-st-vuur"></i>'+streak+' <em>streak</em></span><span><i class="ms-st-munt"></i>'+munten+' <em>munten</em></span><span><i class="ms-st-ster"></i>level '+lvl+'</span><button class="ms-x" onclick="closeNavSheet()" aria-label="Sluit menu"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>'
      +'<button class="ms-zoek" onclick="'+ga('openZoek()')+'">'+_msSvg('zoek')+'<span>Vraag het Slagio of zoek iets</span></button>'
    +'</div>'
    +'<div class="ms-body">'
    +'<div class="ms-groot" style="--i:'+(i++)+'">'
      +'<button class="ms-kaart ms-k-trainer" onclick="'+ga('openExamentrainer()')+'"><span class="ms-art">'+_msArt('trainer')+'</span><span class="ms-tt"><b>Examentrainer</b><small>jouw cijfer</small></span></button>'
      +'<button class="ms-kaart ms-k-profiel" onclick="'+ga('openProfiel()')+'"><span class="ms-art">'+_msArt('profiel')+'</span><span class="ms-tt"><b>Profiel</b><small>je account</small></span></button>'
    +'</div>'
    +_MS_GROEPEN.map(([kop,kl,items])=>'<section class="ms-groep '+kl+'"><h3 class="ms-groep-kop" style="--i:'+(i++)+'">'+kop+'</h3><div class="ms-raster">'+items.map(tegel).join('')+'</div></section>').join('')
    +'<div class="ms-lijst" style="--i:'+(i++)+'">'
      +'<div class="ms-rij"><span class="ms-rij-ic">'+_msSvg('geluid')+'</span><span class="ms-rij-t">Geluid</span><button class="ms-switch'+(geluid?' aan':'')+'" role="switch" aria-checked="'+geluid+'" aria-label="Geluid" onclick="_msSchakel(this,\'geluid\')"><i></i></button></div>'
      +'<div class="ms-rij"><span class="ms-rij-ic">'+_msSvg('maan')+'</span><span class="ms-rij-t">Nachtmodus</span><button class="ms-switch'+(donker?' aan':'')+'" role="switch" aria-checked="'+donker+'" aria-label="Nachtmodus" onclick="_msSchakel(this,\'donker\')"><i></i></button></div>'
      +'<button class="ms-rij" onclick="'+ga("show('sc-welcome')")+'"><span class="ms-rij-ic">'+_msSvg('wissel')+'</span><span class="ms-rij-t">Ander niveau</span><span class="ms-rij-w">'+niv+'</span><span class="ms-rij-pijl">›</span></button>'
      +'<button class="ms-rij" onclick="'+ga('showIntroModal()')+'"><span class="ms-rij-ic">'+_msSvg('help')+'</span><span class="ms-rij-t">Hoe werkt Slagio?</span><span class="ms-rij-pijl">›</span></button>'
    +'</div>'
    +'</div></div>';
  ov.addEventListener('click',e=>{if(e.target===ov)closeNavSheet();});
  document.body.appendChild(ov);
  _msTerugFocus=document.activeElement;
  const sh=ov.querySelector('.ms-sheet');
  _msSleepWire(ov,sh);
  document.documentElement.classList.add('ms-open');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ov.classList.add('open');try{sh.focus({preventScroll:true});}catch(e){}}));
  try{if(typeof haptic==='function')haptic([8]);}catch(e){}
  document.addEventListener('keydown',_msToets);
}
function _msToets(e){if(e.key==='Escape')closeNavSheet();}
function closeNavSheet(ga){
  const ov=document.getElementById('nav-sheet-ov');if(!ov||ov.classList.contains('dicht'))return;
  document.removeEventListener('keydown',_msToets);
  const sh=ov.querySelector('.ms-sheet');if(sh){sh.style.transition='';sh.style.transform='';}
  ov.classList.remove('open');ov.classList.add('dicht');
  document.documentElement.classList.remove('ms-open');
  setTimeout(()=>{ov.remove();},ga?260:420);
  if(!ga){try{if(_msTerugFocus&&_msTerugFocus.focus)_msTerugFocus.focus({preventScroll:true});}catch(e){}}
}
// Kies iets: menu glijdt weg terwijl het nieuwe scherm al opent.
function _msGa(code){
  closeNavSheet(true);
  setTimeout(()=>{try{(new Function(code))();}catch(e){}},120);
}
function _msSchakel(btn,wat){
  if(wat==='geluid'){try{toggleSound();}catch(e){}let aan=true;try{aan=localStorage.getItem(SND_KEY)!=='0';}catch(e){}btn.classList.toggle('aan',aan);btn.setAttribute('aria-checked',aan);}
  else{try{toggleDark();}catch(e){}const aan=document.documentElement.classList.contains('dark');btn.classList.toggle('aan',aan);btn.setAttribute('aria-checked',aan);}
  try{if(typeof haptic==='function')haptic([6]);}catch(e){}
}
// Vegen: het blad volgt je vinger; ver genoeg of snel genoeg omlaag = dicht.
function _msSleepWire(ov,sh){
  const body=sh.querySelector('.ms-body');
  const start=e=>{
    if(window.innerWidth>=900)return;
    const opKop=e.target.closest('.ms-grip,.ms-kop');
    if(!opKop&&body.scrollTop>0)return;
    _msSleep=true;_msY0=e.touches?e.touches[0].clientY:e.clientY;_msDY=0;_msT0=performance.now();
    sh.style.transition='none';
  };
  const beweeg=e=>{
    if(!_msSleep)return;
    const y=e.touches?e.touches[0].clientY:e.clientY;let dy=y-_msY0;
    if(dy<0)dy=-Math.pow(-dy,.7); // weerstand naar boven
    if(dy>0&&e.cancelable)e.preventDefault();
    _msDY=dy;sh.style.transform='translateY('+dy+'px)';
    ov.style.setProperty('--ms-dim',Math.max(0,1-dy/(sh.offsetHeight||600)));
  };
  const los=()=>{
    if(!_msSleep)return;_msSleep=false;
    const v=_msDY/Math.max(1,performance.now()-_msT0);
    sh.style.transition='';ov.style.removeProperty('--ms-dim');
    if(_msDY>120||(v>.55&&_msDY>30))closeNavSheet();else sh.style.transform='';
  };
  sh.addEventListener('touchstart',start,{passive:true});
  sh.addEventListener('touchmove',beweeg,{passive:false});
  sh.addEventListener('touchend',los);sh.addEventListener('touchcancel',los);
}
// Patch show() to update bottom nav (pass all args through)
const _origShow=show;
window.show=function(id,_noHash){_origShow(id,_noHash);updateBottomNav(id);if(id==='sc-home'){try{renderVandaagHub();}catch(e){}try{renderFocusLeerdoel();}catch(e){}}};

// Activeer routing na volledig laden
window.addEventListener('load',()=>{
  // Geen intro-overlay meer bij het laden. Een nieuwe bezoeker landt direct op
  // de startpagina (sc-welcome) waar de niveaukeuze centraal staat. De korte,
  // functionele vraag (maatje kiezen + eventueel account) volgt PAS nadat een
  // niveau is gekozen - zie chooseLevel(). Waarde eerst, niet een muur vooraf.
  // Het standaard-actieve scherm is sc-welcome; die wordt niet via show()
  // geopend, dus zet hier zelf de nav-status goed (verbergt de desktop-zijbalk
  // en de 250px zijbalk-ruimte op de focus-startpagina).
  try{const _act=document.querySelector('.sc.on');if(_act&&typeof updateBottomNav==='function')updateBottomNav(_act.id);}catch(e){}
  // Query-param fallback: ?niveau=havo&vak=bi[&domein=C] → open vak (+ optioneel domein)
  const _qp=new URLSearchParams(location.search);
  const _qniv=_qp.get('niveau'), _qvak=_qp.get('vak'), _qdom=_qp.get('domein')||_qp.get('leerdoel');
  // ?oefen=1 (vanaf een leerpagina): meteen de adaptieve quiz van dat leerdoel starten
  try{if(_qdom&&_qp.get('oefen'))sessionStorage.setItem('_slagio_start_qmode','snel');}catch(e){}
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
  // Path-based routing: /havo, /vwo en /vmbo
  const _path=location.pathname.replace(/\/$/,'');
  if(_path==='/havo'||_path==='/vwo'||_path==='/vmbo'){
    setTimeout(()=>_routeFromPath(),80);
    return;
  }
  // Echte vak-/domein-URL (/vakken/<niveau>-<vak>[-domein-<x>].html): een
  // terugkerende gebruiker die zo'n statische SEO-pagina boot in de SPA laadt,
  // landt direct op het juiste in-app scherm (met oefeningen en samenvatting).
  if(/^\/vakken\/(havo|vwo|vmbo)-/.test(_path)&&typeof _routeVakkenPath==='function'){
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

  // Kleur cachen (niet elk frame getComputedStyle → dat forceert style-recalc),
  // en op ~20 fps tekenen: een flikkereffect heeft geen 60 fps nodig.
  var _rgb = getRgb(), _rgbT = 0, _acc = 0;
  function draw(time){
    animId = requestAnimationFrame(draw);
    var dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    _acc += dt;
    if (_acc < 0.05) return;              // ~20 fps
    var sdt = _acc; _acc = 0;
    _rgbT += sdt; if (_rgbT > 1){ _rgb = getRgb(); _rgbT = 0; } // kleur af en toe verversen (niveauwissel)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var rgb = _rgb, step = SQUARE + GAP;
    for (var i = 0; i < cols; i++){
      for (var j = 0; j < rows; j++){
        var idx = i * rows + j;
        if (Math.random() < FLICKER * sdt)
          squares[idx] = Math.random() * MAX_OP;
        ctx.fillStyle = 'rgba(' + rgb + ',' + squares[idx] + ')';
        ctx.fillRect(i * step * dpr, j * step * dpr, SQUARE * dpr, SQUARE * dpr);
      }
    }
  }
  function _flickerLite(){ return typeof window.slagioLite === 'function' && window.slagioLite(); }

  setup();
  new ResizeObserver(setup).observe(canvas.parentElement);

  // Pauzeer animatie als tab niet zichtbaar is
  document.addEventListener('visibilitychange', function(){
    if (document.hidden || _flickerLite()) {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    } else {
      if (!animId) animId = requestAnimationFrame(draw);
    }
  });

  // Pauzeer animatie als canvas buiten beeld is (IntersectionObserver)
  new IntersectionObserver(function(entries){
    if (entries[0].isIntersecting && !_flickerLite()) {
      if (!animId) animId = requestAnimationFrame(draw);
    } else {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    }
  }, { threshold: 0 }).observe(canvas);

  // Geen animatie voor gebruikers die dat prefereren of in soepele modus
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || _flickerLite()) return;

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
    // Slim, vooraf berekend bericht meesturen: de SW is "dom" en toont precies
    // dít wanneer periodicSync vuurt (geen dubbele logica in de service worker).
    let payload=null;try{if(typeof notifPayload==='function')payload=notifPayload();}catch(e){}
    reg.active?.postMessage({type:'NOTIF_CONFIG',config:{enabled:true,streak,examDays,payload,lastShown:null}});
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
  if((getStreak().days||[]).includes(todayStr))return; // al geoefend vandaag
  // Slim bericht via de motor; alleen sturen als het relevant genoeg is (prio ≥ 35).
  let title,body;
  let n=null;try{if(typeof pickNotif==='function')n=pickNotif();}catch(e){}
  if(n&&n.prio>=35){title='Slagio · '+n.title;body=n.body;}
  else{
    const cur=calcStreak().current;if(cur<1)return;
    title='Slagio 📚';
    body=`Je hebt een streak van ${cur} dag${cur===1?'':'en'}! Oefen vandaag om hem te bewaren. 🔥`;
  }
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
      try{const u=reg.update();if(u&&u.catch)u.catch(()=>{});}catch(e){}
      navigator.serviceWorker.ready.then(()=>initNotifications());
    }).catch(()=>{});
  });
  // Controleer op updates zodra de app weer op de voorgrond komt. Zo blijft een
  // geïnstalleerde PWA niet op een oude service worker (en oude cache) hangen,
  // ook als hij alleen uit de app-switcher wordt hervat.
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden)navigator.serviceWorker.getRegistration().then(r=>{if(r)return r.update();}).catch(()=>{});
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
  // Pas na 3 quizzen, alleen op de home en alleen als er dit bezoek nog niets
  // anders over het scherm kwam. Lukt het nu niet, dan bij een volgend home-bezoek.
  let _iosWacht=false;
  function magBanner(){
    if(_bannerShown||isSnoozed()||isInQuiz())return false;
    if(!document.getElementById('sc-home')?.classList.contains('on'))return false;
    try{if(((getStreak()||{}).totalQuizzes||0)<3)return false;}catch(e){return false;}
    if(window._homeMoment&&window._homeMoment!=='pwa')return false;
    return typeof homeMoment!=='function'||homeMoment('pwa');
  }
  function showBanner(){
    if(!magBanner())return;
    _bannerShown=true;
    document.getElementById('pwa-banner').classList.add('show');
  }
  window._pwaProbeer=function(){ if(_deferredPrompt)showBanner(); else if(_iosWacht)iosBanner(); };
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
    if(!isSnoozed()){
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
    if(isIOS&&!isSnoozed()){ _iosWacht=true; setTimeout(iosBanner,2000); }
  }
  function iosBanner(){
    if(!magBanner())return;
    _bannerShown=true;
    const b=document.getElementById('pwa-banner');
    if(!b)return;
    b.querySelector('.pwa-banner-title').textContent='Voeg toe aan beginscherm';
    b.querySelector('.pwa-banner-sub').textContent='Tik op Delen ↑ → "Zet op beginscherm" voor snelle toegang';
    b.querySelector('#pwa-install-btn').style.display='none';
    b.classList.add('show');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',_wirePwa);
  else _wirePwa();
})();

// ── Eén tik-haptic voor álle tikbare content-kaarten (zelfde gevoel overal) ──
// Op 'click' (niet pointerdown) zodat scrollen geen valse trilling geeft.
document.addEventListener('click', function (e) {
  const t = e.target;
  if (!t || !t.closest) return;
  if (t.closest('.card,.lg-card,.bento-cell,.hm-menu-open')) {
    try { if (typeof haptic === 'function') haptic(7); } catch (_) {}
  }
}, { passive: true });

// ═══════ ARCADE (lazy) ═══════
// De minigames staan in arcade.js en laden pas als je de Arcade opent.
function arcadeOpen(cb){
  // Meten wie de Arcade opent (niet alleen wie een spel afmaakt).
  try{if(typeof trackEvent==='function')trackEvent('arcade_open',{});}catch(e){}
  if(window._arcLoaded&&typeof openArcade==='function'){openArcade();if(typeof cb==='function')setTimeout(cb,60);return;}
  if(window._arcLoading)return;window._arcLoading=true;
  // Eerst de 2D-scènes (arcade2d.js), dan de games zelf (arcade.js).
  const laad=(src,ok)=>{const s=document.createElement('script');s.src=src;s.onload=ok;
    s.onerror=()=>{window._arcLoading=false;try{showToast('De Arcade kon niet laden. Controleer je verbinding.');}catch(e){}};document.head.appendChild(s);};
  laad('/arcade2d.js',()=>laad('/arcade.js',()=>{window._arcLoaded=true;window._arcLoading=false;try{openArcade();}catch(e){}if(typeof cb==='function')setTimeout(cb,120);}));
}

// ═══════ KINGDOM (gedeeld deel: drempels, stand per vak, badge, lazy laden) ═══════
// Het eiland zelf staat in kingdom.js. Hier alleen wat de home nodig heeft om te
// weten of er iets te bouwen valt. Gebouwen komen vrij door BEHEERSTE leerdoelen
// (ldMastery ≥ 80%), niet door XP: 15%, 40%, 70% en 95% van de leerdoelen van een vak.
const KD_DREMPEL=[.15,.4,.7,.95];
function kdLeerdoelen(vak){const out=[];(vak&&vak.domeinen||[]).forEach(d=>{if(d.leerdoelen&&d.leerdoelen.length)d.leerdoelen.forEach(ld=>out.push({ld,dom:d}));else out.push({ld:d,dom:d});});return out;}
function kdVakStand(vakId){
  const vak=(typeof getVK==='function'?getVK():[]).find(v=>v.id===vakId);
  const lds=kdLeerdoelen(vak);const N=lds.length;
  let beheerst=0;const scores=[];
  lds.forEach(({ld,dom})=>{let m=null;try{m=ldMastery(vakId,ld);}catch(e){}const sc=m&&m.hasData?m.score:null;if(sc!=null&&sc>=.8)beheerst++;scores.push({ld,dom,score:sc});});
  let vorige=0;const eisen=KD_DREMPEL.map((f,i)=>{let e=Math.max(vorige+1,Math.ceil(f*N),i+1);e=Math.min(e,Math.max(1,N));vorige=e;return e;});
  const vrij=eisen.filter(e=>N>0&&beheerst>=e).length;
  return {vakId,N,beheerst,eisen,vrij,scores};
}
function kdKey(){return (typeof lvlCol==='function')?lvlCol('slagio_kingdom'):'slagio_kingdom';}
function kdStaat(){try{return JSON.parse(localStorage.getItem(kdKey())||'{}');}catch(e){return {};}}
function kdBewaar(s){try{localStorage.setItem(kdKey(),JSON.stringify(s));}catch(e){}}
function kdBouwklaar(){
  let n=0;try{const g=kdStaat().gebouwd||{};(getVK()||[]).forEach(v=>{const st=kdVakStand(v.id);n+=Math.max(0,st.vrij-(g[v.id]||0));});}catch(e){}
  return n;
}
function renderPlayRow(){
  const el=document.getElementById('kd-home-badge');if(!el)return;
  const n=kdBouwklaar();el.hidden=!n;el.textContent=n;el.setAttribute('aria-label',n===1?'1 gebouw klaar om te bouwen':n+' gebouwen klaar om te bouwen');
  const sub=document.getElementById('kd-home-sub');
  if(sub){let b=0;try{const g=kdStaat().gebouwd||{};Object.values(g).forEach(x=>b+=x);}catch(e){}
    sub.textContent=n?`Kingdom: ${n===1?'een gebouw':n+' gebouwen'} klaar om te bouwen`:'Clash, Kingdom en zes minigames op echte examenstof';}
}
// Melding als er sinds de vorige keer iets bouwklaar is geworden.
function kingdomCheck(){
  try{const n=kdBouwklaar();const s=kdStaat();if(n>(s.gemeld||0)){s.gemeld=n;kdBewaar(s);if(typeof showToast==='function')showToast('🏰 Nieuw gebouw klaar om te bouwen in je Kingdom','#7c3aed',3200);}
    else if(n<(s.gemeld||0)){s.gemeld=n;kdBewaar(s);}}catch(e){}
  try{renderPlayRow();}catch(e){}
}
function kingdomOpen(){
  if(window._kdLoaded&&typeof openKingdom==='function'){openKingdom();return;}
  if(window._kdLoading)return;window._kdLoading=true;
  const s=document.createElement('script');s.src='/kingdom.js';
  s.onload=()=>{window._kdLoaded=true;window._kdLoading=false;try{openKingdom();}catch(e){}};
  s.onerror=()=>{window._kdLoading=false;try{showToast('Kingdom kon niet laden. Controleer je verbinding.');}catch(e){}};
  document.head.appendChild(s);
}
