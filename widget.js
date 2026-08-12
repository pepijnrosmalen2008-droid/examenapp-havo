// ═══════════════════════════════════════════════════════════════════════
// widget.js - Telefoon "home-screen widget"-mogelijkheid (werking; design volgt)
// ───────────────────────────────────────────────────────────────────────
// Een echte PWA-home-screen-widget is op iOS/Android nog nauwelijks mogelijk.
// De haalbare vorm die vandaag wél op het telefoonscherm zichtbaar is:
//   1. Badging API  → een klein getal op het geïnstalleerde app-icoon
//      (openstaande acties: onopgehaalde week-kist, daguitdaging, streak-risico).
//   2. Snelkoppelingen (manifest.shortcuts) → long-press-acties, hier gerouterd.
//   3. Widget-data → doorgestuurd naar de service worker voor de PWA-widget-spec
//      (Windows-widgetbord e.d.); faalt stil waar niet ondersteund.
// ═══════════════════════════════════════════════════════════════════════

// ── Openstaande acties → badge-getal ──────────────────────────────────
// Klein en betekenisvol; nooit een grote/verwarrende teller.
function slagioPendingCount(){
  let n=0;
  // Onopgehaalde week-kist (league)
  try{
    const L=(typeof getLeague==='function')?getLeague():null;
    if(L&&L.result&&L.result.chest&&!L.result.chest.claimed)n++;
  }catch(e){}
  // Daguitdaging vandaag nog niet afgerond
  try{
    const today=new Date().toISOString().slice(0,10);
    const lvl=(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo';
    const dc=JSON.parse(localStorage.getItem('slagio_daily_challenge_'+lvl)||'{}');
    if(!(dc.date===today&&dc.done))n++;
  }catch(e){}
  // Streak in gevaar: wel een reeks, maar vandaag nog niet geoefend/bevroren
  try{
    if(typeof calcStreak==='function'){
      const cs=calcStreak();
      const today=new Date().toISOString().slice(0,10);
      const doneToday=[...(cs.days||[]),...(cs.frozen||[])].indexOf(today)>=0;
      if((cs.current||0)>0&&!doneToday)n++;
    }
  }catch(e){}
  return n;
}

// ── Badge op het app-icoon zetten/legen (Badging API) ─────────────────
function slagioUpdateBadge(){
  try{
    if(!('setAppBadge' in navigator))return;
    const n=slagioPendingCount();
    if(n>0){ navigator.setAppBadge(n).catch(()=>{}); }
    else if('clearAppBadge' in navigator){ navigator.clearAppBadge().catch(()=>{}); }
  }catch(e){}
}

// ── Glanceable widget-data (streak + examen-aftelklok + dagdoel) ───────
function slagioWidgetData(){
  let examDays=null, examVak='';
  try{
    if(typeof getCountdownTarget==='function'){
      const t=getCountdownTarget();
      if(t&&t.datum){
        const end=new Date(t.datum+'T'+((t.tijd&&t.tijd.split('–')[0])||'09:00')+':00+02:00').getTime();
        examDays=Math.max(0,Math.ceil((end-Date.now())/86400000));
        examVak=t.vak||'';
      }
    }
  }catch(e){}
  let streak=0;
  try{ if(typeof calcStreak==='function')streak=calcStreak().current||0; }catch(e){}
  return {
    streak:streak, examDays:examDays, examVak:examVak,
    pending:slagioPendingCount(),
    niveau:(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo',
    ts:Date.now()
  };
}

// Stuur de data naar de SW zodat die (waar ondersteund) een PWA-widget bijwerkt.
function slagioPushWidgetData(){
  try{
    if(navigator.serviceWorker&&navigator.serviceWorker.controller){
      navigator.serviceWorker.controller.postMessage({type:'WIDGET_DATA',data:slagioWidgetData()});
    }
  }catch(e){}
}

// Publieke haak: overal aanroepbaar na een actie (kist geopend, quiz gedaan, …).
function slagioWidgetRefresh(){ slagioUpdateBadge(); slagioPushWidgetData(); }

// ── Snelkoppeling-deeplinks (long-press op het app-icoon): ?start=… ────
function slagioHandleStartParam(){
  try{
    const s=new URLSearchParams(location.search).get('start');
    if(!s)return false;
    // Param uit de URL halen zodat een refresh de actie niet opnieuw triggert.
    try{const u=new URL(location.href);u.searchParams.delete('start');history.replaceState(null,'',u.pathname+u.search+u.hash);}catch(e){}
    setTimeout(()=>{
      try{
        if(s==='quiz'){
          if(typeof startDailyChallenge==='function'){startDailyChallenge();return;}
          if(typeof show==='function')show('sc-home');
        }else if(s==='calc'){
          if(typeof show==='function')show('sc-calc');
        }else if(s==='schedule'){
          if(typeof show==='function')show('sc-schedule');
          try{if(typeof renderSchedule==='function')renderSchedule();}catch(e){}
        }
      }catch(e){}
    },300);
    return true;
  }catch(e){return false;}
}

// ── Init ──────────────────────────────────────────────────────────────
function slagioWidgetInit(){
  try{ slagioWidgetRefresh(); }catch(e){}
  // Bij het verlaten/backgrounden van de app het icoon-badge + widget verversen,
  // zodat het home-scherm klopt op het moment dat de gebruiker ernaar kijkt.
  try{
    document.addEventListener('visibilitychange',function(){
      if(document.visibilityState==='hidden')slagioWidgetRefresh();
    });
  }catch(e){}
  try{ slagioHandleStartParam(); }catch(e){}
}
