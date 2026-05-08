// ═══════ SUPABASE ═══════
const SUPABASE_URL='https://sxrjdssmgwwygtskovyc.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4cmpkc3NtZ3d3eWd0c2tvdnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTEwNDAsImV4cCI6MjA4OTI2NzA0MH0.iML8S6I6wZ9zGUDBZJleyFHlpPYmUvdGyNyDSYcxon4';
const SB=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
// Persistent device ID — generated once, stored in localStorage
const _DID=(()=>{try{let id=localStorage.getItem('slagio_did');if(!id){id=(crypto.randomUUID?crypto.randomUUID():'x'+Math.random().toString(36).slice(2)+Date.now().toString(36));localStorage.setItem('slagio_did',id);}return id;}catch(e){return null;}})();
async function trackEvent(type,meta){
  try{
    const vak=typeof ST!=='undefined'?ST?.vak:null;
    const niveau=typeof APP_LEVEL!=='undefined'?APP_LEVEL:'havo';
    const naam=_safeLocalGet('profiel',{}).naam||null;
    const _mob=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<=768;
    const _pwa=window.matchMedia('(display-mode:standalone)').matches||!!navigator.standalone;
    const device=_mob?(_pwa?'mobile-pwa':'mobile'):'desktop';
    SB.from('events').insert({
      user_id:currentUser?.id||null,
      naam:naam,
      event_type:type,
      vak_naam:vak?.naam||null,
      niveau:niveau,
      meta:{...(meta||{}),device,did:_DID}
    }).then(()=>{}).catch(()=>{});
  }catch(e){}
}
// Detecteer herkomst (UTM param > referrer > direct)
function _getSrc(){
  try{const p=new URLSearchParams(location.search);const utm=p.get('utm_source');if(utm)return utm.toLowerCase();}catch(e){}
  try{
    const ref=document.referrer;
    if(!ref)return 'direct';
    const host=new URL(ref).hostname.replace(/^www\./,'');
    const MAP={
      'chatgpt.com':'ChatGPT','chat.openai.com':'ChatGPT',
      'claude.ai':'Claude AI','gemini.google.com':'Gemini',
      'copilot.microsoft.com':'Copilot','perplexity.ai':'Perplexity',
      'instagram.com':'Instagram','l.instagram.com':'Instagram',
      'facebook.com':'Facebook','fb.com':'Facebook','m.facebook.com':'Facebook',
      'twitter.com':'Twitter/X','x.com':'Twitter/X','t.co':'Twitter/X',
      'tiktok.com':'TikTok','youtube.com':'YouTube','youtu.be':'YouTube',
      'reddit.com':'Reddit','linkedin.com':'LinkedIn',
      'google.com':'Google','google.nl':'Google',
      'bing.com':'Bing','duckduckgo.com':'DuckDuckGo',
      'whatsapp.com':'WhatsApp','wa.me':'WhatsApp',
      'snapchat.com':'Snapchat'
    };
    return MAP[host]||host;
  }catch(e){return 'direct';}
}
// Track app open once per browser session
if(!sessionStorage.getItem('_slagio_ao')){sessionStorage.setItem('_slagio_ao','1');setTimeout(()=>trackEvent('app_open',{src:_getSrc()}),2000);}

// ── FEEDBACK POPUP (1-5 sterren na event) ──────────────────────────────
const _FB_LABELS={snel:'Snelle Quiz',flashcard:'Flashcards',simulatietoets:'Simulatietoets',bot_race:'Bot Race'};
function showFeedbackPopup(feature){
  // Eén keer per browser-sessie per feature tonen
  const sk='_slagio_fb_'+feature;
  if(sessionStorage.getItem(sk))return;
  sessionStorage.setItem(sk,'1');
  _fbRemove();
  const label=_FB_LABELS[feature]||feature;
  const el=document.createElement('div');
  el.id='fb-popup';
  el.className='fb-popup';
  el.innerHTML=`
    <div class="fb-title">Hoe nuttig vond je de ${label}?</div>
    <div class="fb-sub">Jouw mening helpt ons verbeteren</div>
    <div class="fb-stars" id="fb-stars-row">
      ${[1,2,3,4,5].map(i=>`<button class="fb-star" data-v="${i}"
        onmouseenter="_fbHov(${i})" onmouseleave="_fbHovOut()"
        onclick="_fbRate(${i},'${feature}')" aria-label="${i} ster">★</button>`).join('')}
    </div>
    <button class="fb-skip" onclick="_fbRemove()">Overslaan</button>`;
  document.body.appendChild(el);
}
function _fbHov(n){
  document.querySelectorAll('#fb-stars-row .fb-star').forEach((s,i)=>{
    s.classList.toggle('lit',i<n);
    s.style.transform=i===n-1?'scale(1.22)':'scale(1)';
  });
}
function _fbHovOut(){
  document.querySelectorAll('#fb-stars-row .fb-star').forEach(s=>{
    s.classList.remove('lit');s.style.transform='';
  });
}
function _fbRemove(){
  const el=document.getElementById('fb-popup');
  if(!el)return;
  el.classList.add('fb-out');
  setTimeout(()=>el?.remove(),220);
}
async function _fbRate(rating,feature){
  const el=document.getElementById('fb-popup');
  if(el){
    el.innerHTML=`<div class="fb-thanks-wrap"><div class="fb-thanks-ico">${rating>=4?'🌟':'⭐'}</div><div class="fb-thanks-txt">Bedankt voor je feedback!</div></div>`;
    setTimeout(_fbRemove,1400);
  }
  try{
    const domein=(typeof ST!=='undefined'&&ST?.domein?.naam)||null;
    await trackEvent('feedback',{rating,feature,domein});
  }catch(e){}
}
let currentUser=null;
// Synchrone pre-check: lees Supabase-sessie direct uit localStorage zodat
// updateProfileNav() meteen de juiste staat toont (geen "Inloggen"-flits).
(function _preloadSession(){
  try{
    const k=Object.keys(localStorage).find(x=>x.startsWith('sb-')&&x.endsWith('-auth-token'));
    if(!k)return;
    const s=JSON.parse(localStorage.getItem(k)||'null');
    const user=s?.user||s?.data?.user||null;
    // Controleer of token nog niet verlopen is (exp in seconden)
    const exp=s?.expires_at||(s?.data?.session?.expires_at)||0;
    if(user&&(exp===0||exp*1000>Date.now())){currentUser=user;}
  }catch(e){}
})();
// Async check + token-refresh via Supabase
SB.auth.getSession().then(({data:{session}})=>{
  currentUser=session?.user||null;
  updateProfileNav();updateCloudStatusBar();
  if(currentUser){syncFromCloud();syncMyAvatarToCloud();}
});
// Listen for auth changes (login/logout/token refresh)
SB.auth.onAuthStateChange((_event,session)=>{
  currentUser=session?.user||null;
  updateProfileNav();updateCloudStatusBar();
  if(currentUser){
    syncFromCloud();syncMyAvatarToCloud();
  } else if(_event==='SIGNED_OUT'){
    // Meteen alle account-UI resetten zodat je nergens meer ingelogd lijkt
    try{renderXPHome();renderStreak();renderFavHome();renderHomeStats();buildGrid();}catch(e){}
  }
  // Detecteer wachtwoord-reset link (type=recovery in URL hash)
  if(_event==='PASSWORD_RECOVERY'){show('sc-reset-pass');}
});

async function cloudSet(col,data){
  localStorage.setItem('examenapp_'+col,JSON.stringify(data));
  if(!currentUser)return;
  try{
    await SB.from('user_data').upsert(
      {user_id:currentUser.id,[col]:data,updated_at:new Date().toISOString()},
      {onConflict:'user_id'}
    );
  }catch(e){console.warn('cloudSet error:',e);}
}
function _safeLocalGet(col,def){
  try{const raw=localStorage.getItem('examenapp_'+col);return raw?JSON.parse(raw):def;}
  catch(e){return def;}
}
async function cloudGet(col,def){
  if(!currentUser)return _safeLocalGet(col,def);
  try{
    const {data,error}=await SB.from('user_data').select(col).eq('user_id',currentUser.id).single();
    if(error||!data)return _safeLocalGet(col,def);
    return data[col]??def;
  }catch(e){return _safeLocalGet(col,def);}
}
// ── Cross-device sync bundle (packed into profiel.sync) ──────────────────
// Alle data die NIET via aparte Supabase-kolommen gesynchroon gaat, wordt
// hier ingepakt in het bestaande profiel-veld (100% betrouwbaar aanwezig).
let _syncBundleTimer=null;
function _ls(key,def){try{return JSON.parse(localStorage.getItem(key)||'null')??def;}catch(e){return def;}}
function buildSyncBundle(){
  return {
    v:2,
    ach:getAchieved(),
    decay:getDecay(),
    sp_done:spGetDone(),
    sp_prefs:_ls('slagio_sp_prefs_v1',{}),
    sp_plan:_ls('slagio_sp_plan_v1',null),
    counters:{
      fc:parseInt(localStorage.getItem('slagio_fc_sessions')||'0'),
      race:parseInt(localStorage.getItem('slagio_race_wins')||'0'),
      perfect:parseInt(localStorage.getItem('slagio_perfect_count')||'0'),
      plan:parseInt(localStorage.getItem('slagio_plan_tasks')||'0')
    },
    cij_h:_ls('examenapp_cijfers_havo',{}),
    cij_v:_ls('examenapp_cijfers_vwo',{}),
    mijn_h:_ls('examenapp_mijnvakken_havo',[]),
    mijn_v:_ls('examenapp_mijnvakken_vwo',[])
  };
}
function restoreSyncBundle(bundle){
  if(!bundle||typeof bundle!=='object')return;
  // Achievements: union — badge ooit verdiend = altijd behouden
  if(bundle.ach){localStorage.setItem(ACH_KEY,JSON.stringify({...getAchieved(),...bundle.ach}));}
  // Decay: meest recente timestamp per domein
  if(bundle.decay){
    const m={...getDecay()};
    Object.keys(bundle.decay).forEach(k=>{if(!m[k]||bundle.decay[k]>m[k])m[k]=bundle.decay[k];});
    localStorage.setItem(DECAY_KEY,JSON.stringify(m));
  }
  // Studieplan done: union
  if(bundle.sp_done){localStorage.setItem(SP_DONE_KEY,JSON.stringify({...spGetDone(),...bundle.sp_done}));}
  // Studieplan prefs: remote wint (bewuste keuze gebruiker)
  if(bundle.sp_prefs&&Object.keys(bundle.sp_prefs).length)
    localStorage.setItem(SP_PREF_KEY,JSON.stringify(bundle.sp_prefs));
  // Studieplan zelf: meest recente plan wint; geen lokaal plan → gebruik remote
  if(bundle.sp_plan){
    const local=_ls('slagio_sp_plan_v1',null);
    if(!local||(bundle.sp_plan.generated&&(!local.generated||bundle.sp_plan.generated>=local.generated))){
      localStorage.setItem(SP_PLAN_KEY,JSON.stringify(bundle.sp_plan));
      localStorage.setItem('slagio_plan_generated','1');
    }
  }
  // Tellers: neem het hoogste getal
  if(bundle.counters){
    [['fc','slagio_fc_sessions'],['race','slagio_race_wins'],
     ['perfect','slagio_perfect_count'],['plan','slagio_plan_tasks']].forEach(([k,lk])=>{
      const v=bundle.counters[k]||0;
      if(v>0)localStorage.setItem(lk,String(Math.max(v,parseInt(localStorage.getItem(lk)||'0'))));
    });
  }
  // Cijfers: remote vult lokale leegte aan; lokale waarde wint bij conflict
  if(bundle.cij_h&&Object.keys(bundle.cij_h).length){
    localStorage.setItem('examenapp_cijfers_havo',
      JSON.stringify({...bundle.cij_h,..._ls('examenapp_cijfers_havo',{})}));
  }
  if(bundle.cij_v&&Object.keys(bundle.cij_v).length){
    localStorage.setItem('examenapp_cijfers_vwo',
      JSON.stringify({...bundle.cij_v,..._ls('examenapp_cijfers_vwo',{})}));
  }
  // Mijn vakken: remote wint als het niet leeg is
  if(Array.isArray(bundle.mijn_h)&&bundle.mijn_h.length)
    localStorage.setItem('examenapp_mijnvakken_havo',JSON.stringify(bundle.mijn_h));
  if(Array.isArray(bundle.mijn_v)&&bundle.mijn_v.length)
    localStorage.setItem('examenapp_mijnvakken_vwo',JSON.stringify(bundle.mijn_v));
}
async function pushSyncBundle(){
  if(!currentUser)return;
  clearTimeout(_syncBundleTimer);
  _syncBundleTimer=setTimeout(async()=>{
    try{
      const prof=_ls(PROF_KEY,{});
      prof.sync=buildSyncBundle();
      localStorage.setItem(PROF_KEY,JSON.stringify(prof));
      await SB.from('user_data').upsert(
        {user_id:currentUser.id,profiel:prof,updated_at:new Date().toISOString()},
        {onConflict:'user_id'}
      );
    }catch(e){console.warn('pushSyncBundle error:',e);}
  },4000);
}
// ─────────────────────────────────────────────────────────────────────────

function mergeProgress(cloudProg,localProg){
  const merged=Object.assign({},localProg);
  if(cloudProg&&typeof cloudProg==='object'){
    Object.keys(cloudProg).forEach(key=>{
      const c=cloudProg[key],l=merged[key];
      if(!l){merged[key]=c;}
      else{
        merged[key]={
          best:Math.max(c.best||0,l.best||0),
          total:Math.max(c.total||0,l.total||0),
          attempts:Math.max(c.attempts||0,l.attempts||0)
        };
      }
    });
  }
  return merged;
}

async function syncFromCloud(){
  try{
    const {data,error}=await SB.from('user_data').select('*').eq('user_id',currentUser.id).single();
    if(error||!data){
      updateProfileNav();renderStreak();renderFavHome();renderXPHome();renderDailyChallenge();buildGrid();renderHomeStats();
      return;
    }
    // Profiel & XP + sync-bundle
    if(data.profiel){
      localStorage.setItem(PROF_KEY,JSON.stringify(data.profiel));
      if(data.profiel.xp)localStorage.setItem(XP_KEY,JSON.stringify({xp:data.profiel.xp}));
      if(data.profiel.sync)restoreSyncBundle(data.profiel.sync);
    }
    // ── PROGRESS: NOOIT wissen — altijd mergen met lokale data ────────────
    // Zo gaat er nooit voortgang verloren, ook niet bij netwerkproblemen
    ['havo','vwo'].forEach(lvl=>{
      const localProg=_safeLocalGet('progress_'+lvl,{});
      const cloudProg=data['progress_'+lvl];
      const merged=mergeProgress(cloudProg,localProg);
      localStorage.setItem('examenapp_progress_'+lvl,JSON.stringify(merged));
      // Upload merged terug naar cloud als er lokale data bijgekomen is
      if(Object.keys(merged).length>0){
        const cloudKeys=Object.keys(cloudProg||{});
        const hasNew=Object.keys(merged).some(k=>!cloudKeys.includes(k)||merged[k].best>(cloudProg[k]?.best||0));
        if(hasNew) SB.from('user_data').upsert(
          {user_id:currentUser.id,['progress_'+lvl]:merged,updated_at:new Date().toISOString()},
          {onConflict:'user_id'}
        ).catch(()=>{});
      }
    });
    // ─────────────────────────────────────────────────────────────────────
    if(data.streak)localStorage.setItem('examenapp_streak',JSON.stringify(data.streak));
    const cij=data[lvlCol('cijfers')];if(cij)localStorage.setItem('examenapp_'+lvlCol('cijfers'),JSON.stringify(cij));
    const favs=data[lvlCol('favs')];if(favs)localStorage.setItem('examenapp_'+lvlCol('favs'),JSON.stringify(favs.list||[]));
    const mijn=data[lvlCol('mijnvakken')];if(mijn)localStorage.setItem('examenapp_'+lvlCol('mijnvakken'),JSON.stringify(mijn.list||[]));
    updateProfileNav();renderStreak();renderFavHome();renderXPHome();renderDailyChallenge();buildGrid();renderHomeStats();
    try{renderDecayAlert();}catch(e){}
    try{renderVandaagWidget();}catch(e){}
    try{if(document.getElementById('sc-cijfers')?.classList.contains('on'))buildCijferGrid();}catch(e){}
    try{if(document.getElementById('sc-studieplan')?.classList.contains('on'))renderStudieplan();}catch(e){}
    // Upload lokale data die de cloud nog niet kent (bijv. cijfers vóór sync-update)
    try{pushSyncBundle();}catch(e){}
  }catch(e){
    console.warn('syncFromCloud error:',e);
  }
}

// ── Cross-tab sync: als tab A progress opslaat, update tab B meteen ──────
window.addEventListener('storage',e=>{
  if(e.key&&e.key.includes('progress')&&e.newValue){
    // Herrender voortgangsindicatoren in de actieve tab zonder pagina-reload
    try{
      if(typeof buildGrid==='function')buildGrid();
      if(typeof renderHomeStats==='function')renderHomeStats();
      // Als detail-scherm open is, update de domain progress bars
      if(ST&&ST.vak&&document.getElementById('sc-detail')?.classList.contains('on')){
        updateLpEntryCard();
      }
    }catch(err){}
  }
});

// ── Hersync bij terugkeren naar tab (visibilitychange) ───────────────────
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'&&currentUser){
    syncFromCloud();
  }
});

function authErrMsg(msg){
  if(!msg)return'Er is iets misgegaan. Probeer het opnieuw.';
  const m=msg.toLowerCase();
  if(m.includes('invalid login')||m.includes('invalid credentials'))return'Onjuist e-mailadres of wachtwoord.';
  if(m.includes('email not confirmed'))return'Bevestig eerst je e-mailadres via de mail die je hebt ontvangen.';
  if(m.includes('already registered')||m.includes('user already exists'))return'Dit e-mailadres is al in gebruik.';
  if(m.includes('password'))return'Wachtwoord moet minimaal 8 tekens zijn.';
  if(m.includes('rate limit'))return'Te veel pogingen. Probeer het later opnieuw.';
  if(m.includes('network')||m.includes('fetch'))return'Geen internetverbinding.';
  return'Er is iets misgegaan. Probeer het opnieuw.';
}

function switchAuthTab(tab){
  document.getElementById('auth-tab-login').classList.toggle('active',tab==='login');
  document.getElementById('auth-tab-register').classList.toggle('active',tab==='register');
  document.getElementById('auth-panel-login').classList.toggle('active',tab==='login');
  document.getElementById('auth-panel-register').classList.toggle('active',tab==='register');
  document.getElementById('auth-err-login').style.display='none';
  document.getElementById('auth-err-register').style.display='none';
}

async function doLogin(){
  const email=document.getElementById('login-email').value.trim();
  const pass=document.getElementById('login-pass').value;
  const errEl=document.getElementById('auth-err-login');
  const okEl=document.getElementById('auth-ok-login');
  const btn=document.getElementById('login-btn');
  errEl.style.display='none';okEl.style.display='none';
  if(!_rlCheck(errEl))return;
  if(!email||!pass){errEl.textContent='Vul je e-mail en wachtwoord in.';errEl.style.display='block';return;}
  if(!isValidEmail(email)){errEl.textContent='Voer een geldig e-mailadres in.';errEl.style.display='block';return;}
  btn.disabled=true;btn.textContent='Bezig...';btn.classList.add('loading');
  try{
    const {error}=await SB.auth.signInWithPassword({email,password:pass});
    if(error)throw error;
    _rlReset();
    show('sc-home');
  }catch(e){
    _rlFail();
    errEl.textContent=authErrMsg(e.message);errEl.style.display='block';
  }finally{btn.disabled=false;btn.textContent='Inloggen';btn.classList.remove('loading');}
}

async function doRegister(){
  const naam=document.getElementById('reg-naam').value.trim();
  const email=document.getElementById('reg-email').value.trim();
  const pass=document.getElementById('reg-pass').value;
  const passConfirm=document.getElementById('reg-pass-confirm').value;
  const errEl=document.getElementById('auth-err-register');
  const btn=document.getElementById('register-btn');
  errEl.style.display='none';
  if(!naam){errEl.textContent='Vul je naam in.';errEl.style.display='block';return;}
  if(naam.length>50){errEl.textContent='Naam mag maximaal 50 tekens zijn.';errEl.style.display='block';return;}
  if(!email){errEl.textContent='Vul je e-mailadres in.';errEl.style.display='block';return;}
  if(!isValidEmail(email)){errEl.textContent='Voer een geldig e-mailadres in.';errEl.style.display='block';return;}
  if(!pass){errEl.textContent='Vul een wachtwoord in.';errEl.style.display='block';return;}
  if(pass.length<8){errEl.textContent='Wachtwoord moet minimaal 8 tekens zijn.';errEl.style.display='block';return;}
  if(passwordScore(pass)<2){errEl.textContent='Wachtwoord is te zwak. Voeg een hoofdletter, cijfer of speciaal teken toe.';errEl.style.display='block';return;}
  if(pass!==passConfirm){errEl.textContent='Wachtwoorden komen niet overeen.';errEl.style.display='block';return;}
  if(!selectedAnimalId){errEl.textContent='Kies eerst je startdier!';errEl.style.display='block';return;}
  btn.disabled=true;btn.textContent='Bezig...';btn.classList.add('loading');
  try{
    const {data,error}=await SB.auth.signUp({email,password:pass});
    if(error)throw error;
    const initAvatar=selectedAnimalId?getAnimalEmoji(selectedAnimalId,0):'🐾';
    const prof={naam,avatar:initAvatar,animalId:selectedAnimalId,school:'',klas:'',profiel:''};
    localStorage.setItem(PROF_KEY,JSON.stringify(prof));
    if(data.user){currentUser=data.user;await cloudSet('profiel',prof);}
    // Supabase may require email confirmation
    const needsConfirm=!data.session;
    if(needsConfirm){
      const okEl=document.getElementById('auth-ok-login');
      switchAuthTab('login');
      document.getElementById('auth-ok-login').textContent='✓ Account aangemaakt! Controleer je inbox om je e-mail te bevestigen.';
      document.getElementById('auth-ok-login').style.display='block';
    }else{
      show('sc-home');updateProfileNav();
    }
  }catch(e){
    errEl.textContent=authErrMsg(e.message);errEl.style.display='block';
  }finally{btn.disabled=false;btn.textContent='Account aanmaken';btn.classList.remove('loading');}
}

async function doForgotPassword(){
  const email=document.getElementById('login-email').value.trim();
  const errEl=document.getElementById('auth-err-login');
  const okEl=document.getElementById('auth-ok-login');
  errEl.style.display='none';okEl.style.display='none';
  if(!email){errEl.textContent='Vul eerst je e-mailadres in.';errEl.style.display='block';return;}
  try{
    const {error}=await SB.auth.resetPasswordForEmail(email,{redirectTo:'https://slagio.nl'});
    if(error)throw error;
    okEl.textContent='✓ Herstelmail verstuurd! Klik op de link in je inbox.';okEl.style.display='block';
  }catch(e){errEl.textContent=authErrMsg(e.message);errEl.style.display='block';}
}

async function doResetPassword(){
  const pass=document.getElementById('reset-pass-input').value;
  const confirm=document.getElementById('reset-pass-confirm').value;
  const errEl=document.getElementById('reset-err');
  const okEl=document.getElementById('reset-ok');
  const btn=document.getElementById('reset-pass-btn');
  errEl.style.display='none';okEl.style.display='none';
  if(pass.length<8){errEl.textContent='Wachtwoord moet minimaal 8 tekens zijn.';errEl.style.display='block';return;}
  if(pass!==confirm){errEl.textContent='Wachtwoorden komen niet overeen.';errEl.style.display='block';return;}
  btn.disabled=true;btn.textContent='Opslaan…';
  try{
    const {error}=await SB.auth.updateUser({password:pass});
    if(error)throw error;
    okEl.textContent='✓ Wachtwoord opgeslagen! Je wordt doorgestuurd…';okEl.style.display='block';
    setTimeout(()=>{window.location.hash='';show('sc-home');},2000);
  }catch(e){
    errEl.textContent=authErrMsg(e.message);errEl.style.display='block';
  }finally{btn.disabled=false;btn.textContent='Wachtwoord opslaan';}
}

function doLogout(){
  showConfirm('👋','Uitloggen?','Je wordt uitgelogd. Je voortgang blijft bewaard in de cloud.','Uitloggen',async()=>{
    // Wacht totdat Supabase de sessie-tokens écht gewist heeft
    try{await SB.auth.signOut({scope:'local'});}catch(e){}
    currentUser=null;
    // Verwijder alle app-data én eventuele overgebleven Supabase-sessietokens
    const toClear=[
      'examenapp_profiel',
      'slagio_xp',
      'examenapp_streak',
      'slagio_daily_goal',
      'slagio_daily_challenge_havo',
      'slagio_daily_challenge_vwo',
      'slagio_fc_sessions','slagio_race_wins','slagio_plan_tasks','slagio_perfect_count',
      'slagio_sr_v1',
      'examenapp_cijfers_havo','examenapp_cijfers_vwo',
      'examenapp_progress_havo','examenapp_progress_vwo',
      'examenapp_favs_havo','examenapp_favs_vwo',
      'examenapp_mijnvakken_havo','examenapp_mijnvakken_vwo',
      'slagio_aqp_v1',
    ];
    toClear.forEach(k=>localStorage.removeItem(k));
    // Ruim ook alle Supabase auth-sleutels op zodat de sessie na reload echt weg is
    Object.keys(localStorage).filter(k=>k.startsWith('sb-')).forEach(k=>localStorage.removeItem(k));
    location.reload();
  });
}

function updateCloudStatusBar(){
  const bar=document.getElementById('cloud-status-bar');
  const sub=document.getElementById('prof-sub-text');
  if(!bar)return;
  if(currentUser){
    bar.innerHTML=`<div class="cloud-status">
      <div class="cs-icon">☁️</div>
      <div class="cs-info"><div class="cs-email">${escapeHtml(currentUser.email)}</div><div class="cs-sub">Gesynchroniseerd via Supabase ☁️</div></div>
      <button class="cs-logout" onclick="doLogout()">Uitloggen</button>
    </div>`;
    if(sub)sub.textContent='Wordt gesynchroniseerd met je account ☁️';
  }else{
    bar.innerHTML=`<div class="cloud-status" style="cursor:pointer" onclick="show('sc-auth')">
      <div class="cs-icon">🔑</div>
      <div class="cs-info"><div class="cs-email">Niet ingelogd</div><div class="cs-sub">Log in om je data te synchroniseren</div></div>
      <button class="cs-logout" style="border-color:var(--or);color:var(--or)" onclick="show('sc-auth')">Inloggen</button>
    </div>`;
    if(sub)sub.textContent='Wordt lokaal opgeslagen op dit apparaat';
  }
}

