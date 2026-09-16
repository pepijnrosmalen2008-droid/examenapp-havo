// ═══════════════════════════════════════════════════════════════════════════
// perf.js · Adaptieve prestatie-modus
//
// Doel: op sterke apparaten de volle beleving (animaties, glas, physics-Vonk),
// maar op zwakke laptops automatisch een "soepele modus" die de continue
// render-kosten wegneemt, zodat scrollen en klikken vloeiend blijven.
//
// Werking:
//   1. Direct bij laden: pas een opgeslagen keuze toe, of een snelle heuristiek
//      (weinig cores/geheugen, of prefers-reduced-motion) → data-perf="lite".
//   2. Na de boot: meet de ECHTE framerate een paar seconden. Haalt het
//      apparaat het niet, dan schakelt 'ie zichzelf naar lite (en onthoudt dat).
//   3. Andere modules lezen slagioLite() en doen dan minder (Vonk-physics uit,
//      flikkergrid uit); CSS onder html[data-perf="lite"] zet zware effecten uit.
//
// De leerling kan het ook zelf zetten (Profiel → toegankelijkheid).
// ═══════════════════════════════════════════════════════════════════════════
(function(){
  var KEY = 'slagio_perf_mode'; // 'lite' | 'full' | (leeg = auto)
  var root = document.documentElement;

  function stored(){ try{ return localStorage.getItem(KEY)||''; }catch(e){ return ''; } }
  function setAttr(lite){ if(lite) root.setAttribute('data-perf','lite'); else root.removeAttribute('data-perf'); }

  // Snelle heuristiek voor de allereerste frames (voor de FPS-meting klaar is).
  function heuristicLite(){
    try{
      if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
      var cores = navigator.hardwareConcurrency;
      if(typeof cores==='number' && cores>0 && cores<=4) return true;
      var mem = navigator.deviceMemory;
      if(typeof mem==='number' && mem>0 && mem<=4) return true;
    }catch(e){}
    return false;
  }

  var choice = stored();
  if(choice==='lite') setAttr(true);
  else if(choice==='full') setAttr(false);
  else setAttr(heuristicLite()); // auto: pas alvast een inschatting toe

  // Publieke API
  window.slagioLite = function(){ return root.getAttribute('data-perf')==='lite'; };
  window.slagioSetPerf = function(mode){ // 'lite' | 'full' | 'auto'
    try{
      if(mode==='auto'){ localStorage.removeItem(KEY); setAttr(heuristicLite()); _measure(true); }
      else { localStorage.setItem(KEY, mode); setAttr(mode==='lite'); }
    }catch(e){}
    try{ if(typeof vonkPhysRefresh==='function') vonkPhysRefresh(); }catch(e){}
  };

  // ── Echte framerate meten en zo nodig terugschakelen ──────────────────────
  function _measure(force){
    // Alleen autometen als de gebruiker geen expliciete keuze maakte.
    if(!force && stored()) return;
    if(window.slagioLite()) return; // al lite → niks te winnen met meten
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var frames=0, longFrames=0, last=performance.now(), start=last, RUN=2200;
    function tick(now){
      var d=now-last; last=now; frames++;
      if(d>34) longFrames++; // < ~30 fps voor dit frame
      if(now-start < RUN){ requestAnimationFrame(tick); return; }
      var secs=(now-start)/1000, fps=frames/secs;
      // Zwak apparaat: lage gemiddelde fps óf veel haperende frames.
      if(fps < 45 || longFrames > frames*0.25){
        setAttr(true);
        try{ localStorage.setItem(KEY,'lite'); }catch(e){}
        try{ if(typeof vonkPhysRefresh==='function') vonkPhysRefresh(); }catch(e){}
      }
    }
    requestAnimationFrame(tick);
  }
  // Meet nadat de boot-drukte voorbij is (anders meet je de opstart, niet idle).
  try{
    if(document.readyState==='complete') setTimeout(function(){ _measure(false); }, 3500);
    else window.addEventListener('load', function(){ setTimeout(function(){ _measure(false); }, 3500); });
  }catch(e){}
})();
