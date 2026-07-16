// ═══════ SUPABASE ═══════
const SUPABASE_URL='https://wcfenegohryxhatzxvtw.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZmVuZWdvaHJ5eGhhdHp4dnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyODcwMDAsImV4cCI6MjA5Njg2MzAwMH0.B3ygpkosBybQd53VLiRxqIbVxBPWw4V-Nj2IS3k4UFo';
// Supabase-client. Als de (cross-origin) library niet geladen is — offline, CDN plat,
// of geblokkeerd door een adblocker — mag de app NIET stuklopen: dan draaien we op een
// veilige offline-stub zodat alles op lokale data blijft werken (vakken, quiz, samenvattingen).
function _sbOfflineStub(){
  var res=function(v){return Promise.resolve(v);};
  var q={then:function(r){try{r&&r({data:[],error:{message:'offline'}});}catch(e){}return q;},
         catch:function(){return q;},finally:function(f){try{f&&f();}catch(e){}return q;}};
  var chain=new Proxy(q,{get:function(t,p){return (p in t)?t[p]:function(){return chain;};}});
  return {
    from:function(){return chain;},
    rpc:function(){return chain;},
    channel:function(){return {on:function(){return this;},subscribe:function(){return {unsubscribe:function(){}};}};},
    removeChannel:function(){},
    auth:{
      getSession:function(){return res({data:{session:null},error:null});},
      getUser:function(){return res({data:{user:null},error:null});},
      onAuthStateChange:function(cb){try{setTimeout(function(){cb&&cb('INITIAL_SESSION',null);},0);}catch(e){}return {data:{subscription:{unsubscribe:function(){}}}};},
      signInWithPassword:function(){return res({data:{user:null,session:null},error:{message:'Geen internetverbinding'}});},
      signUp:function(){return res({data:{user:null,session:null},error:{message:'Geen internetverbinding'}});},
      signOut:function(){return res({error:null});},
      resetPasswordForEmail:function(){return res({data:{},error:{message:'Geen internetverbinding'}});},
      updateUser:function(){return res({data:{user:null},error:{message:'Geen internetverbinding'}});}
    }
  };
}
const _sbLib=window.supabase;
const SB=(_sbLib&&_sbLib.createClient)?_sbLib.createClient(SUPABASE_URL,SUPABASE_KEY):_sbOfflineStub();
if(!(_sbLib&&_sbLib.createClient)){try{console.warn('[Slagio] Supabase niet beschikbaar — offline modus; lokale data blijft werken.');}catch(e){}}
// Persistent device ID - generated once, stored in localStorage
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

// ═══════ FOUT-MONITORING → bestaande events-tabel (geen Supabase-wijziging nodig) ═══════
// Vangt live JS-fouten, niet-afgehandelde promises en mislukte bron-loads op en logt ze
// als event_type 'js_error' (in meta). Gededupliceerd + gecapt zodat het nooit spamt.
(function initErrorMonitor(){
  var seen={}, sent=0, MAX=12;
  function report(kind,msg,src,line,col,stack){
    try{
      if(sent>=MAX)return;
      msg=String(msg||'').slice(0,300);
      var sig=kind+'|'+msg+'|'+(line||0);
      if(seen[sig])return; seen[sig]=1; sent++;
      var scr=''; try{var on=document.querySelector('.sc.on');scr=on?on.id:'';}catch(e){}
      if(typeof trackEvent==='function')trackEvent('js_error',{
        kind:kind, message:msg,
        source:String(src||'').replace(location.origin,'').slice(0,140),
        line:line||null, col:col||null,
        stack:String(stack||'').slice(0,700),
        screen:scr, path:location.pathname,
        online:navigator.onLine, ua:navigator.userAgent.slice(0,170)
      });
    }catch(e){}
  }
  window.addEventListener('error',function(e){
    if(e&&e.message)report('error',e.message,e.filename,e.lineno,e.colno,e.error&&e.error.stack);
    else if(e&&e.target&&(e.target.src||e.target.href))report('resource','bron kon niet laden: '+(e.target.src||e.target.href),e.target.src||e.target.href);
  },true);
  window.addEventListener('unhandledrejection',function(e){
    var r=e&&e.reason; report('promise',(r&&r.message)||String(r),'',null,null,r&&r.stack);
  });
})();

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

// ── MASTERY TRACKING (localStorage + compacte Supabase upsert) ─────────────
// Structuur: {[vakId]: {[domeinId]: {c: correct, t: totaal}}}
// Supabase: 1 rij per device per vak - groeit NIET onbeperkt (upsert)
let _qBatch=[];
function logQuestion(vakId,domeinId,mode,vraagNr,isCorrect,responsMs){
  if(!vakId||!domeinId)return;
  try{ _qBatch.push({vakId,domeinId,isCorrect}); }catch(e){}
}
function _flushQBatch(){
  if(!_qBatch.length)return;
  const batch=[..._qBatch]; _qBatch=[];
  try{
    // Update cumulatieve mastery in localStorage
    const m=JSON.parse(localStorage.getItem('slagio_mastery')||'{}');
    const vaksTouched=new Set();
    batch.forEach(({vakId,domeinId,isCorrect})=>{
      if(!m[vakId])m[vakId]={};
      if(!m[vakId][domeinId])m[vakId][domeinId]={c:0,t:0};
      m[vakId][domeinId].t++;
      if(isCorrect)m[vakId][domeinId].c++;
      vaksTouched.add(vakId);
    });
    localStorage.setItem('slagio_mastery',JSON.stringify(m));
    // Sync naar Supabase: upsert 1 rij per vak (overschrijft, geen nieuwe rijen)
    const niv=typeof APP_LEVEL!=='undefined'?APP_LEVEL:'havo';
    vaksTouched.forEach(vakId=>{
      SB.from('mastery').upsert(
        {did:_DID,user_id:currentUser?.id||null,niveau:niv,vak_id:vakId,
         data:m[vakId],updated_at:new Date().toISOString()},
        {onConflict:'did,vak_id'}
      ).then(()=>{}).catch(()=>{});
    });
  }catch(e){}
}

// ── CE-CIJFER COLLECTIE ──────────────────────────────────────────────────
function _checkCeScorePrompts(){
  try{
    const mijn=getMijnVakken();
    if(!mijn.length)return;
    const today=new Date();today.setHours(0,0,0,0);
    const shown=JSON.parse(localStorage.getItem('slagio_ce_prompted')||'[]');
    EXAM_SCHEDULE
      .filter(e=>e.vakId&&mijn.includes(e.vakId)&&(!e.niveau||e.niveau===APP_LEVEL))
      .forEach(e=>{
        const examD=new Date(e.datum);examD.setHours(0,0,0,0);
        const daysSince=Math.floor((today-examD)/864e5);
        // Toon prompt 1-14 dagen na examen, één keer per vak
        if(daysSince>=1&&daysSince<=14&&!shown.includes(e.vakId)){
          shown.push(e.vakId);
          localStorage.setItem('slagio_ce_prompted',JSON.stringify(shown));
          setTimeout(()=>_showCeScoreModal(e.vak,e.vakId),1500);
        }
      });
  }catch(err){}
}
function _showCeScoreModal(vakNaam,vakId){
  if(document.getElementById('ce-score-modal'))return;
  const el=document.createElement('div');
  el.id='ce-score-modal';
  el.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px)';
  el.innerHTML=`<div style="background:var(--s);border-radius:24px 24px 0 0;padding:28px 24px 40px;width:100%;max-width:480px;box-shadow:0 -20px 60px rgba(0,0,0,.3)">
    <div style="width:36px;height:4px;background:var(--bo);border-radius:2px;margin:0 auto 20px"></div>
    <div style="font-size:28px;text-align:center;margin-bottom:8px">🎓</div>
    <h3 style="font-family:var(--font-head);font-size:20px;font-weight:900;color:var(--dk);text-align:center;margin-bottom:6px">Je examen ${vakNaam} is geweest!</h3>
    <p style="font-size:13px;color:var(--mu);text-align:center;margin-bottom:22px;line-height:1.5">Wat was je eindcijfer? Jouw score helpt ons aantonen dat Slagio werkt - voor jou en toekomstige leerlingen.</p>
    <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-bottom:20px">
      ${[1,2,3,4,5,6,7,8,9,10].map(c=>`<button onclick="_submitCeScore('${vakId}','${vakNaam}',${c})" style="width:48px;height:48px;border-radius:12px;border:2px solid var(--bo);background:var(--s);font-family:var(--font-head);font-size:17px;font-weight:800;cursor:pointer;color:${c>=6?'#22c55e':c>=5?'var(--or)':'#ef4444'};transition:all .15s" onmouseenter="this.style.transform='scale(1.12)'" onmouseleave="this.style.transform=''">${c}</button>`).join('')}
    </div>
    <button onclick="document.getElementById('ce-score-modal').remove()" style="width:100%;padding:12px;background:none;border:none;color:var(--mu);font-size:13px;cursor:pointer">Overslaan</button>
  </div>`;
  document.body.appendChild(el);
}
function _submitCeScore(vakId,vakNaam,cijfer){
  try{
    const p=getProgress();
    const sessions=Object.entries(p).filter(([k])=>k.startsWith(vakId+'_')).reduce((s,[,v])=>s+(v.attempts||0),0);
    trackEvent('ce_cijfer',{vak_id:vakId,vak_naam:vakNaam,cijfer,sessions_voor_examen:sessions});
  }catch(e){}
  const modal=document.getElementById('ce-score-modal');
  if(modal){
    modal.innerHTML=`<div style="background:var(--s);border-radius:24px 24px 0 0;padding:40px 24px;width:100%;max-width:480px;text-align:center">
      <div style="font-size:40px;margin-bottom:12px">${cijfer>=6?'🎉':'💪'}</div>
      <h3 style="font-family:var(--font-head);font-size:22px;font-weight:900;color:var(--dk);margin-bottom:8px">${cijfer>=6?'Gefeliciteerd!':'Volgende keer beter!'}</h3>
      <p style="color:var(--mu);font-size:14px;margin-bottom:24px">Bedankt voor je cijfer - dit helpt ons enorm!</p>
      <button onclick="document.getElementById('ce-score-modal').remove()" style="padding:13px 32px;background:var(--or);color:#fff;border:none;border-radius:13px;font-family:var(--font-head);font-size:15px;font-weight:800;cursor:pointer">Sluiten</button>
    </div>`;
    setTimeout(()=>modal.remove(),4000);
  }
}
// Check CE score prompts elke keer dat de app opent (na examens)
setTimeout(()=>{try{if(typeof EXAM_SCHEDULE!=='undefined'&&typeof getMijnVakken==='function')_checkCeScorePrompts();}catch(e){}},5000);

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
let _authReady=false;    // true zodra onAuthStateChange heeft gefired
let _hasLocalSession=false; // true als er een opgeslagen sessie in localStorage staat
let _authReadyCbs=[];
// Roep cb(currentUser) aan zodra auth-staat bekend is (direct als al klaar)
function _onAuthReady(cb){if(_authReady){cb(currentUser);}else{_authReadyCbs.push(cb);}}
// Synchrone pre-check: lees Supabase-sessie direct uit localStorage
(function _preloadSession(){
  try{
    const k=Object.keys(localStorage).find(x=>x.startsWith('sb-')&&x.endsWith('-auth-token'));
    if(!k)return;
    const s=JSON.parse(localStorage.getItem(k)||'null');
    const user=s?.user||s?.data?.user||null;
    const exp=s?.expires_at||(s?.data?.session?.expires_at)||0;
    if(user){
      _hasLocalSession=true;
      if(exp===0||exp*1000>Date.now()){
        currentUser=user;
        localStorage.setItem('slagio_li','1'); // bootstrap - token is nog geldig
      } else {
        // Token verlopen - slagio_li wissen zodat UI niet vals "ingelogd" toont
        try{localStorage.removeItem('slagio_li');}catch(e){}
      }
    }
  }catch(e){}
})();
// Async check - alleen syncen, NIET currentUser op null zetten als er een lokale sessie is
// (getSession kan null geven bij verlopen token terwijl onAuthStateChange die nog refresht)
SB.auth.getSession().then(({data:{session}})=>{
  if(session?.user){
    currentUser=session.user;
    _authReady=true;
    const cbs=[..._authReadyCbs];_authReadyCbs=[];cbs.forEach(cb=>cb(currentUser));
    updateProfileNav();updateCloudStatusBar();
    syncFromCloud();syncMyAvatarToCloud();
  }
  // Als session null: wacht op onAuthStateChange (token-refresh) - geen actie
});
// Listen for auth changes (login/logout/token refresh)
SB.auth.onAuthStateChange((_event,session)=>{
  currentUser=session?.user||null;
  _authReady=true;
  const cbs=[..._authReadyCbs];_authReadyCbs=[];cbs.forEach(cb=>cb(currentUser));
  if(currentUser){try{localStorage.setItem('slagio_li','1');}catch(e){}}
  else if(_event==='SIGNED_OUT'){try{localStorage.removeItem('slagio_li');}catch(e){}_hasLocalSession=false;}
  // Deze callback kan synchroon vuren tijdens Supabase-init, vóór profile.js/
  // features.js geladen zijn → guard zodat er geen ReferenceError ontstaat.
  if(typeof updateProfileNav==='function')updateProfileNav();
  if(typeof updateCloudStatusBar==='function')updateCloudStatusBar();
  if(currentUser){
    try{syncFromCloud();syncMyAvatarToCloud();}catch(e){}
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
  // Achievements: union - badge ooit verdiend = altijd behouden
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
    // ── PROGRESS: NOOIT wissen - altijd mergen met lokale data ────────────
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
    // Wis lokale voortgang zodat het nieuwe account schoon begint
    ['examenapp_progress_havo','examenapp_progress_vwo','examenapp_streak','slagio_xp',
     'examenapp_mijnvakken_havo','examenapp_mijnvakken_vwo','examenapp_favs_havo','examenapp_favs_vwo',
     'examenapp_cijfers_havo','examenapp_cijfers_vwo','slagio_mastery',
     'slagio_daily_challenge_havo','slagio_daily_challenge_vwo',
     'slagio_fc_sessions','slagio_race_wins','slagio_plan_tasks','slagio_perfect_count',
     'slagio_sr_v1','slagio_aqp_v1'].forEach(k=>localStorage.removeItem(k));
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
      'slagio_li',
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

// ── Account-prompt bottom sheet (herbruikbaar voor alle account-gated features) ──
function _showAccountPrompt(title, desc, onRegister){
  if(document.getElementById('acct-prompt-sheet'))return;
  const el=document.createElement('div');
  el.id='acct-prompt-sheet';
  el.style.cssText='position:fixed;inset:0;z-index:9300;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.5);backdrop-filter:blur(5px);animation:_lbFdIn .22s ease';
  el.innerHTML=`<div style="background:var(--card,#1e2130);border-radius:22px 22px 0 0;padding:28px 24px 40px;width:100%;max-width:480px;box-shadow:0 -8px 40px rgba(0,0,0,.4);animation:_lbSlUp .3s cubic-bezier(.22,1,.36,1)">
    <div style="width:36px;height:4px;background:rgba(255,255,255,.15);border-radius:2px;margin:0 auto 20px"></div>
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:30px;margin-bottom:10px">🔑</div>
      <div style="font-size:17px;font-weight:900;color:var(--dk,#e2e8f0);margin-bottom:6px">${title}</div>
      <div style="font-size:13px;color:var(--mu,#94a3b8);line-height:1.5">${desc}</div>
    </div>
    <button id="acct-prompt-reg" style="display:block;width:100%;padding:14px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;border:none;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer;font-family:var(--font);margin-bottom:10px">Account aanmaken - gratis →</button>
    <button id="acct-prompt-login" style="display:block;width:100%;padding:12px;background:rgba(255,255,255,.07);color:var(--dk,#e2e8f0);border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--font);margin-bottom:8px">Al een account? Inloggen</button>
    <button id="acct-prompt-skip" style="display:block;width:100%;padding:8px;background:none;border:none;color:var(--mu,#94a3b8);font-size:13px;cursor:pointer;font-family:var(--font)">Niet nu</button>
  </div>`;
  const close=()=>{el.style.animation='_lbFdIn .18s ease reverse';setTimeout(()=>el.remove(),180);};
  el.addEventListener('click',e=>{if(e.target===el)close();});
  el.querySelector('#acct-prompt-reg').onclick=()=>{close();if(typeof onRegister==='function')onRegister();else{switchAuthTab&&switchAuthTab('register');show('sc-auth');}};
  el.querySelector('#acct-prompt-login').onclick=()=>{close();switchAuthTab&&switchAuthTab('login');show('sc-auth');};
  el.querySelector('#acct-prompt-skip').onclick=close;
  document.body.appendChild(el);
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

