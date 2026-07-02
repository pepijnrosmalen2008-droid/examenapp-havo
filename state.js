

// ═══════ STATE ═══════
// antwrd entries: {pts: 0|0.5|1}
let ST = {vak:null,domein:null,mode:null,vragen:[],idx:0,score:0,antwrd:[],timer:null,tijd:20,shuffleMap:[],shuffleMaps:[],combo:0,xpThisRound:0,isDailyChallenge:false};

// ═══════ UI HELPERS ═══════
// ═══════ HASH ROUTING ═══════
const _SCREEN_HASHES={'sc-info':'info','sc-schedule':'rooster','sc-studieplan':'studieplan','sc-calc':'rekenmachine','sc-streak':'streaks','sc-zoek':'zoek'};
// Vak ID → URL-slug (volledige naam)
const _VAK_SLUG={nl:'nederlands',wa:'wiskunde-a',wb:'wiskunde-b',bi:'biologie',sk:'scheikunde',na:'natuurkunde',be:'bedrijfseconomie',en:'engels',ec:'economie',gs:'geschiedenis',ak:'aardrijkskunde',mw:'maatschappijwetenschappen',du:'duits',fr:'frans',la:'latijn',gr:'grieks',in:'informatica'};
const _SLUG_VAK=Object.fromEntries(Object.entries(_VAK_SLUG).map(([k,v])=>[v,k]));
function _pushHash(h){if((location.hash||'#').slice(1)!==h)history.pushState(null,'',h?'#'+h:location.pathname+location.search);}
function _routeFromHash(){
  const h=(location.hash||'').slice(1);
  if(!h){show('sc-home');return;}
  // vak: #havo-biologie of #vwo-wiskunde-a; domein: #havo-biologie-a
  const vm=h.match(/^(havo|vwo)-(.+)$/);
  if(vm){
    const [,niv,rest]=vm;
    let id=_SLUG_VAK[rest],domLetter=null;
    if(!id){
      const dm=rest.match(/^(.+)-([a-z])$/);
      if(dm&&_SLUG_VAK[dm[1]]){id=_SLUG_VAK[dm[1]];domLetter=dm[2].toUpperCase();}
    }
    if(id){
      // Zorg dat de niveau-data geladen is voordat we het vak openen
      if(typeof ensureLevelData==='function'&&typeof _levelLoaded==='function'&&!_levelLoaded(niv)){
        ensureLevelData(niv,()=>_routeFromHash());return;
      }
      if(niv!==APP_LEVEL){APP_LEVEL=niv;localStorage.setItem('examenapp_level',niv);applyLevelTheme(niv);}
      const vak=getVK().find(v=>v.id===id);
      if(vak){
        openVak(id,true);
        if(domLetter&&vak.domeinen.some(d=>d.id===domLetter))openDomein(domLetter,true);
        return;
      }
    }
  }
  // zoekscherm: bouwt de index lazy op
  if(h==='zoek'){if(window.openZoek){openZoek();return;}}
  // statische schermen
  const sc=Object.entries(_SCREEN_HASHES).find(([,v])=>v===h);
  if(sc){show(sc[0],true);return;}
  show('sc-home',true);
}
function _routeFromPath(){
  const path=location.pathname.replace(/\/$/,'');
  if(path==='/havo'){chooseLevel('havo',true);return;}
  if(path==='/vwo'){chooseLevel('vwo',true);return;}
  // Terugkerende gebruiker: direct naar opgeslagen niveau - sla welkomstscherm over
  const saved=localStorage.getItem('examenapp_level');
  if(saved==='havo'||saved==='vwo'){chooseLevel(saved,true);return;}
  // Nieuwe gebruiker: toon niveau-kiezer
  show('sc-welcome',true);
  _updatePageSEO(null);
}
window.addEventListener('popstate',()=>{
  const path=location.pathname.replace(/\/$/,'');
  // Domein-URL (/vakken/<niveau>-<vak>-domein-<x>.html) → heropen dat domein in-app
  const dm=path.match(/^\/vakken\/(havo|vwo)-(.+)-domein-([a-z])\.html$/);
  if(dm){
    const niv=dm[1],id=_SLUG_VAK[dm[2]],letter=dm[3].toUpperCase();
    if(id){
      const go=()=>{
        if(niv!==APP_LEVEL){APP_LEVEL=niv;localStorage.setItem('examenapp_level',niv);applyLevelTheme(niv);}
        const vak=getVK().find(v=>v.id===id);
        if(vak){if(!ST.vak||ST.vak.id!==id)openVak(id,true);if(vak.domeinen.some(d=>d.id===letter))openDomein(letter,true);}
      };
      if(typeof ensureLevelData==='function'&&typeof _levelLoaded==='function'&&!_levelLoaded(niv)){ensureLevelData(niv,go);}else go();
      return;
    }
  }
  if(path==='/havo'||path==='/vwo'){_routeFromPath();return;}
  if(path==='/'||path===''){
    // terug naar niveau-kiezer
    show('sc-welcome',true);
    _updatePageSEO(null);
    return;
  }
  _routeFromHash();
});

function show(id,_noHash){
  const prev=document.querySelector('.sc.on');
  if(id==='sc-privacy'&&prev)window._privacyFrom=prev.id;
  // Stop quiz timer wanneer de gebruiker de quiz verlaat
  if(prev&&prev.id==='sc-q'&&id!=='sc-q')clearInterval(ST.timer);
  document.querySelectorAll('.sc').forEach(s=>s.classList.remove('on'));
  const _sc=document.getElementById(id);
  _sc.classList.add('on');
  window.scrollTo(0,0);
  // Focus eerste heading voor screenreaders
  try{const _h=_sc.querySelector('h1,h2,h3,[role="heading"]');if(_h){_h.setAttribute('tabindex','-1');_h.focus({preventScroll:true});}}catch(e){}
  updateBottomNav(id);
  tryPushAds(id);
  // URL bijwerken
  if(!_noHash){
    if(id==='sc-home')_pushHash('');
    else if(_SCREEN_HASHES[id])_pushHash(_SCREEN_HASHES[id]);
  }
  if(id==='sc-detail'){
    if(!ST.vak){show('sc-home',true);return;}
    const dlist=document.getElementById('dlist');
    if(!dlist||!dlist.children.length){try{openVak(ST.vak.id,true);}catch(e){}return;}
  }
  if(id==='sc-home'){try{renderComebackCard();}catch(e){}try{renderFeatDisc();}catch(e){}}
  if(id==='sc-schedule'&&localStorage.getItem('slagio_plan_generated')&&!document.getElementById('studieplan-content')?.children.length){try{renderStudieplan();}catch(e){}}
  if(id==='sc-studieplan'){try{spInitPrefs();}catch(e){}if(localStorage.getItem('slagio_plan_generated')){try{renderStudieplan();}catch(e){}}}
  // Welcome screen gets its own indigo theme; level pages get their own theme
  if(id==='sc-welcome'){
    document.documentElement.classList.remove('level-havo','level-vwo');
    document.documentElement.classList.add('level-welcome');
    if(!_noHash&&location.pathname!=='/')history.pushState({},'','/');
    _updatePageSEO(null);
  } else {
    document.documentElement.classList.remove('level-welcome');
    if(!document.documentElement.classList.contains('level-havo')&&!document.documentElement.classList.contains('level-vwo')){
      applyLevelTheme(APP_LEVEL);
    }
  }
}
// Ads: push ads alleen op rustschermen, nooit tijdens quiz/flashcards
// ═══════ COOKIE CONSENT & ADS ═══════
const AD_SCREENS=['sc-home','sc-info','sc-res','sc-schedule','sc-calc'];
const pushedAds=new Set();
function getConsent(){return localStorage.getItem('examenapp_cookie_consent');}
function cookieChoice(accepted){
  localStorage.setItem('examenapp_cookie_consent',accepted?'accepted':'declined');
  document.getElementById('cookie-banner').classList.remove('show');
  if(accepted){loadAdsScript();tryPushAds(document.querySelector('.sc.on')?.id||'sc-home');}
  else{hideAllAds();}
}
function cookieReset(){
  localStorage.removeItem('examenapp_cookie_consent');
  document.getElementById('cookie-banner').classList.add('show');
}
function hideAllAds(){document.querySelectorAll('.ad-wrapper').forEach(w=>w.style.display='none');}
function showAllAds(){document.querySelectorAll('.ad-wrapper').forEach(w=>w.style.display='');}
function loadAdsScript(){
  if(document.querySelector('script[src*="adsbygoogle"]'))return;
  const s=document.createElement('script');s.async=true;
  s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3580526892359138';
  s.crossOrigin='anonymous';document.head.appendChild(s);
}
function tryPushAds(screenId){
  if(!AD_SCREENS.includes(screenId))return;
  if(getConsent()!=='accepted'){hideAllAds();return;}
  showAllAds();
  try{const slots=document.querySelectorAll('#'+screenId+' .adsbygoogle');
  slots.forEach(s=>{if(!pushedAds.has(s)){pushedAds.add(s);(adsbygoogle=window.adsbygoogle||[]).push({});}});}catch(e){}
}
// Init cookie consent
(function(){
  const c=getConsent();
  if(!c){setTimeout(()=>{document.getElementById('cookie-banner').classList.add('show');},800);}
  else if(c==='accepted'){loadAdsScript();}
  else{hideAllAds();}
})();
const ICON_MOON=`<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const ICON_SUN=`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
function toggleDark(){
  const dark=document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme',dark?'dark':'light');
  const icon=dark?ICON_SUN:ICON_MOON;
  document.querySelectorAll('.theme-btn').forEach(b=>b.innerHTML=icon);
}
// Restore saved theme
(function(){if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');document.querySelectorAll('.theme-btn').forEach(b=>b.innerHTML=ICON_SUN);}})();
function tog(hd){const bd=hd.nextElementSibling;const arr=hd.querySelector('span');bd.classList.toggle('on');arr.textContent=bd.classList.contains('on')?'▲':'▼'}

// ═══════ BUILD SUBJECT GRID ═══════
const VAK_ICONS={
  nl:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  wa:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  bi:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  sk:'<path d="M10 2v7.31l-4.72 8.38A1 1 0 0 0 6.19 19H18a1 1 0 0 0 .87-1.5L14 9.31V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/>',
  na:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  be:'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  en:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  ec:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>',
  mw:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  gs:'<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>',
  ak:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  wb:'<polyline points="4 19 8 13 12 15 16 8 20 5"/><line x1="4" y1="19" x2="20" y2="19"/>',
  la:'<path d="M4 19V5h3l5 8 5-8h3v14h-3v-9l-5 7-5-7v9z"/>',
  gr:'<line x1="3" y1="22" x2="21" y2="22"/><rect x="6" y="2" width="3" height="14"/><rect x="15" y="2" width="3" height="14"/><line x1="6" y1="9" x2="18" y2="9"/>',
  in:'<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  fr:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  du:'<path d="M4 4h16v2l-8 8-8-8V4z"/><path d="M4 20h16"/>',
  wc:'<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
};
// Jaar/tijdvak toevoegen aan oe-vragen gebeurt nu per niveau in _processLevelOe()
// (data.js), aangeroepen door ensureLevelData() zodra data-havo.js/data-vwo.js laadt.

// ═══════ CONCEPT DEPENDENCY GRAPH (adaptive learning engine - intern, niet zichtbaar voor gebruiker) ═══════
const conceptGraph = {
  "subject": "Natuurkunde HAVO",
  "concepts": [
    { "id": "A1", "name": "SI-stelsel", "domain": "A", "subdomain": "A1", "prerequisites": [] },
    { "id": "A2", "name": "Basisgrootheden", "domain": "A", "subdomain": "A1", "prerequisites": [ { "id": "A1", "weight": "must" } ] },
    { "id": "A3", "name": "Afgeleide grootheden", "domain": "A", "subdomain": "A1", "prerequisites": [ { "id": "A2", "weight": "must" } ] },
    { "id": "A4", "name": "Omrekenen met machten van 10", "domain": "A", "subdomain": "A1", "prerequisites": [ { "id": "A1", "weight": "must" } ] },
    { "id": "A5", "name": "Lineair verband herkennen", "domain": "A", "subdomain": "A2", "prerequisites": [] },
    { "id": "A6", "name": "Hellingshoek bepalen", "domain": "A", "subdomain": "A2", "prerequisites": [ { "id": "A5", "weight": "must" } ] },
    { "id": "A7", "name": "Oppervlakte onder grafiek", "domain": "A", "subdomain": "A2", "prerequisites": [ { "id": "A5", "weight": "must" } ] },
    { "id": "B1", "name": "Gemiddelde snelheid v = s/t", "domain": "B", "subdomain": "B1", "prerequisites": [ { "id": "A1", "weight": "must" } ] },
    { "id": "B2", "name": "Ogenblikkelijke snelheid uit grafiek", "domain": "B", "subdomain": "B1", "prerequisites": [ { "id": "A6", "weight": "must" } ] },
    { "id": "B3", "name": "s-t grafiek interpreteren", "domain": "B", "subdomain": "B1", "prerequisites": [ { "id": "A5", "weight": "must" } ] },
    { "id": "B4", "name": "v-t grafiek interpreteren", "domain": "B", "subdomain": "B1", "prerequisites": [ { "id": "A5", "weight": "must" } ] },
    { "id": "B5", "name": "Versnelling a = Δv/Δt", "domain": "B", "subdomain": "B2", "prerequisites": [ { "id": "B1", "weight": "must" } ] },
    { "id": "B6", "name": "Versnelling uit v-t grafiek", "domain": "B", "subdomain": "B2", "prerequisites": [ { "id": "B4", "weight": "must" } ] },
    { "id": "B7", "name": "Negatieve versnelling (remmen)", "domain": "B", "subdomain": "B2", "prerequisites": [ { "id": "B5", "weight": "must" } ] },
    { "id": "C1", "name": "Krachten tekenen (vectoren)", "domain": "C", "subdomain": "C1", "prerequisites": [ { "id": "A1", "weight": "must" } ] },
    { "id": "C2", "name": "Resulterende kracht FR", "domain": "C", "subdomain": "C1", "prerequisites": [ { "id": "C1", "weight": "must" } ] },
    { "id": "C3", "name": "Evenwicht (FR = 0)", "domain": "C", "subdomain": "C1", "prerequisites": [ { "id": "C2", "weight": "must" } ] },
    { "id": "C4", "name": "F = m·a toepassen", "domain": "C", "subdomain": "C2", "prerequisites": [ { "id": "B5", "weight": "must" }, { "id": "C2", "weight": "must" } ] },
    { "id": "C5", "name": "Gewicht vs massa", "domain": "C", "subdomain": "C2", "prerequisites": [ { "id": "A1", "weight": "must" } ] },
    { "id": "C6", "name": "Actie-reactie (3e wet)", "domain": "C", "subdomain": "C2", "prerequisites": [ { "id": "C1", "weight": "must" } ] },
    { "id": "D1", "name": "Arbeid W = F·s", "domain": "D", "subdomain": "D1", "prerequisites": [ { "id": "C2", "weight": "must" } ] },
    { "id": "D2", "name": "Kinetische energie Ek = ½mv²", "domain": "D", "subdomain": "D1", "prerequisites": [ { "id": "B1", "weight": "must" } ] },
    { "id": "D3", "name": "Potentiële energie Ep = mgh", "domain": "D", "subdomain": "D1", "prerequisites": [ { "id": "A1", "weight": "must" } ] },
    { "id": "D4", "name": "Rendement η = Euit/Ein", "domain": "D", "subdomain": "D1", "prerequisites": [ { "id": "D1", "weight": "medium" }, { "id": "D2", "weight": "medium" } ] },
    { "id": "D5", "name": "Energiebehoud", "domain": "D", "subdomain": "D2", "prerequisites": [ { "id": "D2", "weight": "must" }, { "id": "D3", "weight": "must" } ] },
    { "id": "D6", "name": "Vermogen P = E/t", "domain": "D", "subdomain": "D2", "prerequisites": [ { "id": "A1", "weight": "must" } ] },
    { "id": "D7", "name": "Warmte Q = c·m·ΔT", "domain": "D", "subdomain": "D2", "prerequisites": [ { "id": "A1", "weight": "must" } ] },
    { "id": "E1", "name": "Spanning U", "domain": "E", "subdomain": "E1", "prerequisites": [ { "id": "A1", "weight": "must" } ] },
    { "id": "E2", "name": "Stroomsterkte I", "domain": "E", "subdomain": "E1", "prerequisites": [ { "id": "A1", "weight": "must" } ] },
    { "id": "E3", "name": "Weerstand R", "domain": "E", "subdomain": "E1", "prerequisites": [ { "id": "A1", "weight": "must" } ] },
    { "id": "E4", "name": "Ohmse wet U = I·R", "domain": "E", "subdomain": "E1", "prerequisites": [ { "id": "E1", "weight": "must" }, { "id": "E2", "weight": "must" }, { "id": "E3", "weight": "must" } ] },
    { "id": "E5", "name": "Serieschakeling", "domain": "E", "subdomain": "E2", "prerequisites": [ { "id": "E4", "weight": "must" } ] },
    { "id": "E6", "name": "Parallelschakeling", "domain": "E", "subdomain": "E2", "prerequisites": [ { "id": "E4", "weight": "must" } ] },
    { "id": "E7", "name": "Totale weerstand series", "domain": "E", "subdomain": "E2", "prerequisites": [ { "id": "E5", "weight": "must" } ] },
    { "id": "E8", "name": "Totale weerstand parallel", "domain": "E", "subdomain": "E2", "prerequisites": [ { "id": "E6", "weight": "must" } ] },
    { "id": "F1", "name": "Golflengte λ = v/f", "domain": "F", "subdomain": "F1", "prerequisites": [ { "id": "A1", "weight": "must" } ] },
    { "id": "F2", "name": "Frequentie f", "domain": "F", "subdomain": "F1", "prerequisites": [ { "id": "A1", "weight": "must" } ] },
    { "id": "F3", "name": "EM-spectrum", "domain": "F", "subdomain": "F1", "prerequisites": [ { "id": "F1", "weight": "medium" }, { "id": "F2", "weight": "medium" } ] },
    { "id": "F4", "name": "Soorten straling (α, β, γ)", "domain": "F", "subdomain": "F2", "prerequisites": [ { "id": "F3", "weight": "must" } ] },
    { "id": "F5", "name": "Halveringstijd", "domain": "F", "subdomain": "F2", "prerequisites": [ { "id": "A1", "weight": "must" } ] },
    { "id": "F6", "name": "Activiteit A = ΔN/Δt", "domain": "F", "subdomain": "F2", "prerequisites": [ { "id": "A1", "weight": "must" } ] }
  ]
};

// ═══════ VWO VAKKEN ═══════


// ═══════ NIVEAU BEHEER ═══════
let APP_LEVEL=localStorage.getItem('examenapp_level')||'havo';
function getVK(){var a=APP_LEVEL==='vwo'?(typeof VAKKEN_VWO!=='undefined'?VAKKEN_VWO:null):(typeof VAKKEN!=='undefined'?VAKKEN:null);return a||[];}
// Level-specifieke localStorage/Supabase kolomnamen - altijd suffix (_havo / _vwo)
function lvlCol(col){return col+'_'+APP_LEVEL;}
// Migreer bestaande HAVO data van oude keys (zonder suffix) naar nieuwe keys (_havo)
(function migreerHavo(){
  const cols=['progress','cijfers','favs','mijnvakken'];
  const lbOld='examenapp_leaderboard';
  cols.forEach(col=>{
    const oldKey='examenapp_'+col;
    const newKey='examenapp_'+col+'_havo';
    if(!localStorage.getItem(newKey)&&localStorage.getItem(oldKey)){
      localStorage.setItem(newKey,localStorage.getItem(oldKey));
    }
  });
  if(!localStorage.getItem('examenapp_leaderboard_havo')&&localStorage.getItem(lbOld)){
    localStorage.setItem('examenapp_leaderboard_havo',localStorage.getItem(lbOld));
  }
})();

let _activeSort='naam';
let _favOnly=false;

function filterBtnClick(){
  const inp=document.getElementById('sb-input');
  if(inp&&inp.value.length>0){clearGridSearch();}
  else{toggleFilterPanel();}
}
function toggleFilterPanel(){
  const panel=document.getElementById('filter-panel');
  if(!panel)return;
  panel.classList.toggle('open');
}
function setSort(s){
  _activeSort=s;
  ['naam','progd','proga','cijfd'].forEach(k=>{
    const el=document.getElementById('fp-'+k);
    if(el)el.classList.toggle('active',k===s);
  });
  _updateFilterBtn();
  buildGrid();
}
function setFavFilter(favOnly){
  _favOnly=favOnly;
  document.getElementById('fp-all').classList.toggle('active',!favOnly);
  document.getElementById('fp-fav').classList.toggle('active',favOnly);
  _updateFilterBtn();
  buildGrid();
}
function _updateFilterBtn(){
  const btn=document.getElementById('sb-filter-btn');
  if(!btn)return;
  const nonDefault=_activeSort!=='naam'||_favOnly;
  btn.classList.toggle('fp-active',nonDefault);
}

function filterGrid(query){
  const poda=document.getElementById('sb-poda');
  if(poda)poda.classList.toggle('sb-has-text',query.length>0);
  const q=query.trim().toLowerCase();
  // Deep search bij 2+ tekens
  if(q.length>=2)_showDeepResults(q,query);
  else _hideDeepResults();
  // Home grid filteren
  let visible=0;
  document.querySelectorAll('#vakgrid .card').forEach(card=>{
    const name=card.querySelector('.card-name')?.textContent.toLowerCase()||'';
    const desc=card.querySelector('.card-desc')?.textContent.toLowerCase()||'';
    const domains=card.dataset.domains||'';
    const match=!q||name.includes(q)||desc.includes(q)||domains.includes(q);
    card.style.display=match?'':'none';
    if(match)visible++;
  });
  const nr=document.getElementById('sb-noresult');
  if(nr){
    nr.textContent='';
    nr.classList.remove('show');
  }
}
function clearGridSearch(){
  const inp=document.getElementById('sb-input');
  if(inp){inp.value='';inp.focus();}
  const poda=document.getElementById('sb-poda');
  if(poda)poda.classList.remove('sb-has-text');
  _hideDeepResults();
  filterGrid('');
}

// ── DEEP SEARCH ──────────────────────────────────────────────────────────
let _sbRes=null;
let _sbData=[]; // flat array van alle vraag-resultaten (voor directe navigatie)

function _hl(text,q){
  const s=String(text||'');
  const i=s.toLowerCase().indexOf(q);
  if(i<0)return s.slice(0,80)+(s.length>80?'…':'');
  const from=Math.max(0,i-25);
  return (from>0?'…':'')+s.slice(from,i)+'<mark class="sb-res-mark">'+s.slice(i,i+q.length)+'</mark>'+s.slice(i+q.length,i+q.length+55)+(s.length>i+q.length+55?'…':'');
}

function _showDeepResults(q,rawQ){
  const vakken=getVK();
  const rVak=[],rDom=[];
  _sbData=[];
  vakken.forEach(vak=>{
    if(vak.naam.toLowerCase().includes(q)||(vak.beschrijving||'').toLowerCase().includes(q))
      rVak.push(vak);
    (vak.domeinen||[]).forEach(dom=>{
      if(dom.naam.toLowerCase().includes(q))
        rDom.push({vak,dom});
      (dom.oe||[]).forEach(v=>{
        const t=(v.v||v.vraag||'').toLowerCase();
        const a=(v.u||v.antwoord||'').toLowerCase();
        if(t.includes(q)||a.includes(q))
          _sbData.push({vak,dom,v,mode:'oe',icon:'✏️',type:'Open',rawT:v.v||v.vraag||''});
      });
      (dom.sv||[]).forEach(v=>{
        if((v.v||'').toLowerCase().includes(q))
          _sbData.push({vak,dom,v,mode:'snel',icon:'🔘',type:'MC',rawT:v.v||''});
      });
    });
  });
  const total=rVak.length+rDom.length+_sbData.length;
  if(!total){_hideDeepResults();return;}
  let html='';
  if(rVak.length){
    html+=`<div class="sb-res-group"><div class="sb-res-label">📚 Vakken</div>`;
    rVak.slice(0,4).forEach(vak=>{
      html+=`<div class="sb-res-item" onclick="_sbGo('vak','${vak.id}')">
        <div class="sb-res-icon" style="background:${vak.kleur}22;color:${vak.kleur};font-weight:800">${vak.naam[0]}</div>
        <div><div class="sb-res-title">${vak.naam}</div><div class="sb-res-sub">${(vak.beschrijving||'').slice(0,55)}${(vak.beschrijving||'').length>55?'…':''}</div></div>
      </div>`;
    });
    html+='</div>';
  }
  if(rDom.length){
    html+=`<div class="sb-res-group"><div class="sb-res-label">📂 Domeinen</div>`;
    rDom.slice(0,5).forEach(({vak,dom})=>{
      html+=`<div class="sb-res-item" onclick="_sbGo('domein','${vak.id}','${dom.id}')">
        <div class="sb-res-icon" style="background:${vak.kleur}22;color:${vak.kleur}">📂</div>
        <div><div class="sb-res-title">Domein ${dom.id}: ${dom.naam}</div><div class="sb-res-sub">${vak.naam}</div></div>
      </div>`;
    });
    html+='</div>';
  }
  if(_sbData.length){
    html+=`<div class="sb-res-group"><div class="sb-res-label">❓ Vragen (${_sbData.length})</div>`;
    _sbData.slice(0,6).forEach((r,i)=>{
      html+=`<div class="sb-res-item" onclick="_sbGo('vraag',${i})">
        <div class="sb-res-icon" style="background:${r.vak.kleur}22;color:${r.vak.kleur}">${r.icon}</div>
        <div><div class="sb-res-title">${_hl(r.rawT,q)}</div><div class="sb-res-sub">${r.vak.naam} · Domein ${r.dom.id} · ${r.type}</div></div>
      </div>`;
    });
    html+='</div>';
  }
  if(!_sbRes){
    _sbRes=document.createElement('div');
    _sbRes.className='sb-results';
    const wrap=document.querySelector('.sb-wrap');
    if(wrap)wrap.appendChild(_sbRes);
    setTimeout(()=>document.addEventListener('click',_sbOutClick),0);
  }
  _sbRes.innerHTML=html;
}

function _sbOutClick(e){
  const inp=document.getElementById('sb-input');
  if(_sbRes&&!_sbRes.contains(e.target)&&e.target!==inp)_hideDeepResults();
}
function _hideDeepResults(){
  if(_sbRes){_sbRes.remove();_sbRes=null;}
  document.removeEventListener('click',_sbOutClick);
}

function _sbGo(type,arg,domeinId){
  clearGridSearch();
  _hideDeepResults();
  if(type==='vraag'){
    const r=_sbData[arg];
    if(!r)return;
    // Zet state direct - geen openVak nodig (vermijdt sc-detail tussenslide)
    ST.vak=r.vak;
    ST.domein=r.dom;
    const pool=r.mode==='snel'?(r.dom.sv||[]):(r.dom.oe||[]);
    const rest=pool.filter(q=>q!==r.v);
    clearQuizDraft();
    ST.mode=r.mode;
    ST.idx=0;ST.score=0;ST.antwrd=[];ST.tijdPerVraag=[];ST.combo=0;ST.xpThisRound=0;ST.flagged=new Set();ST.isDailyChallenge=false;
    ST.vragen=[r.v,...rest];
    if(r.mode==='snel'){
      ST.shuffleMaps=ST.vragen.map(()=>{const m=[0,1,2,3];for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[m[i],m[j]]=[m[j],m[i]];}return m;});
    }else{ST.shuffleMaps=[];}
    const qmeta=document.getElementById('qmeta');
    if(qmeta)qmeta.textContent=`${ST.vak.naam} · D${ST.domein.id}: ${ST.domein.naam} · ${r.mode==='snel'?'Snelle Quiz':'Open vragen'}`;
    const scQuiz=document.getElementById('sc-quiz');
    if(scQuiz)scQuiz.classList.remove('oud-mode');
    show('sc-quiz');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const skel=document.getElementById('quiz-skeleton');
      const body=document.getElementById('qbody-inner');
      if(skel)skel.style.display='none';
      if(body)body.style.display='';
      toonV();
    }));
  } else if(type==='domein'){
    openVak(arg);
    setTimeout(()=>openQmode(domeinId),120);
  } else {
    openVak(arg);
  }
}

function buildGradeInsight(){
  const el=document.getElementById('grade-insight-home');
  if(!el)return;
  const cijfers=getSavedCijfers();
  const vakken=getVK();
  const metCijfer=vakken.filter(v=>cijfers[v.id]!=null);
  if(metCijfer.length===0){el.innerHTML='';return;}
  const atRisk=metCijfer.filter(v=>cijfers[v.id]<6).length;
  const warnHtml=atRisk>0?`<div class="gi-warning">⚠ ${atRisk} vak${atRisk>1?'ken':''} onder de 6 - focus op CE!</div>`:'';
  const rows=metCijfer.map(v=>{
    const c=cijfers[v.id];
    const kleur=c>=7?'#4ADE80':c>=5.5?'#FCD34D':'#F87171';
    const ceN=Math.round(Math.max(1,Math.min(10,11-c))*10)/10;
    const ceTxt=c>=8?'✓ op koers':c>=6?`CE ≥ ${ceN.toFixed(1).replace('.',',')}`:c>=5.5?`⚠ CE ≥ ${ceN.toFixed(1).replace('.',',')}`:` CE ≥ ${ceN.toFixed(1).replace('.',',')} cruciaal`;
    return `<div class="gi-row" onclick="openVak('${v.id}')">
      <div class="gi-dot" style="background:${v.kleur}"></div>
      <div class="gi-naam">${v.naam}</div>
      <div class="gi-bar-wrap"><div class="gi-bar" style="width:${Math.min(100,(c/10)*100)}%;background:${kleur}"></div></div>
      <div class="gi-cij" style="color:${kleur}">${c.toFixed(1).replace('.',',')}</div>
      <div class="gi-ce">${ceTxt}</div>
    </div>`;
  }).join('');
  // Build Verbeterpunten (focus) card
  const urgentVakken=metCijfer.map(v=>{
    const c=cijfers[v.id];
    const ceNodig=Math.max(1,Math.min(10,11-c));
    const quiz=getVakBestPct(v.id);
    return {v,c,ceNodig,quiz};
  }).sort((a,b)=>{
    const aRed=a.c<6?1:0,bRed=b.c<6?1:0;
    if(bRed!==aRed)return bRed-aRed;
    if(b.ceNodig!==a.ceNodig)return b.ceNodig-a.ceNodig;
    const aPct=a.quiz.hasData?a.quiz.pct:1,bPct=b.quiz.hasData?b.quiz.pct:1;
    return aPct-bPct;
  }).slice(0,3);
  const focusItems=urgentVakken.map(({v,c,ceNodig,quiz})=>{
    const ceNodigRnd=Math.round(ceNodig*10)/10;
    let urgCls,urgLbl;
    if(c<5.5){urgCls='ur-red';urgLbl='🔴 Cruciaal';}
    else if(c<6.5){urgCls='ur-orange';urgLbl='🟠 Belangrijk';}
    else if(c<7.5){urgCls='ur-yellow';urgLbl='🟡 Let op';}
    else{urgCls='ur-green';urgLbl='🟢 Goed';}
    const quizChip=quiz.hasData?`<span class="focus-quiz-chip">Quiz: ${Math.round(quiz.pct*100)}%</span>`:'';
    return `<div class="focus-item">
      <span class="focus-urgency ${urgCls}">${urgLbl}</span>
      <div class="focus-info">
        <div class="focus-naam"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${v.kleur};margin-right:5px;vertical-align:middle"></span>${v.naam}</div>
        <div class="focus-ce">CE ≥ ${ceNodigRnd.toFixed(1).replace('.',',')} nodig ${quizChip}</div>
      </div>
      <button class="focus-btn" onclick="openVak('${v.id}')">Oefen nu →</button>
    </div>`;
  }).join('');
  const focusCard=urgentVakken.length>0?`<div class="focus-card">
    <div class="focus-card-head"><span class="focus-card-title">🎯 Verbeterpunten</span></div>
    ${focusItems}
  </div>`:'';
  el.innerHTML=`<div class="grade-insight-card">
    <div class="gi-head"><span class="gi-title">📊 Mijn SE-cijfers</span><button class="gi-edit-btn" onclick="event.stopPropagation();show('sc-cijfers');setTimeout(buildCijferGrid,50)">Bewerk</button></div>
    ${warnHtml}
    <div class="gi-rows">${rows}</div>
  </div>${focusCard}`;
}

function buildGrid(){
  const g=document.getElementById('vakgrid');
  if(!g)return;
  g.innerHTML='';
  // Reset search on rebuild (level switch etc.)
  const inp=document.getElementById('sb-input');
  if(inp)inp.value='';
  const poda=document.getElementById('sb-poda');
  if(poda)poda.classList.remove('sb-has-text');
  const nr=document.getElementById('sb-noresult');
  if(nr){nr.textContent='';nr.classList.remove('show');}
  const cijfers=getSavedCijfers();
  const favs=getFavs();
  let vakken=getVK();
  if(_favOnly){
    vakken=vakken.filter(v=>v.domeinen.some(d=>favs.includes(v.id+'_'+d.id)));
  }
  if(_activeSort==='progd'){
    vakken=[...vakken].sort((a,b)=>{const pa=getVakBestPct(a.id),pb=getVakBestPct(b.id);return (pb.hasData?pb.pct:-1)-(pa.hasData?pa.pct:-1);});
  }else if(_activeSort==='proga'){
    vakken=[...vakken].sort((a,b)=>{const pa=getVakBestPct(a.id),pb=getVakBestPct(b.id);return (pa.hasData?pa.pct:-1)-(pb.hasData?pb.pct:-1);});
  }else if(_activeSort==='cijfd'){
    vakken=[...vakken].sort((a,b)=>{const ca=cijfers[a.id]??-1,cb=cijfers[b.id]??-1;return cb-ca;});
  }
  vakken.forEach(v=>{
    const d=document.createElement('div');
    d.className='card';
    d.style.setProperty('--card-col',v.kleur);
    const prog=getVakBestPct(v.id);
    const progHtml=prog.hasData
      ?`<div class="card-progress"><div class="cp-bar"><div class="cp-fill" style="width:${Math.round(prog.pct*100)}%"></div></div><span class="cp-pct">${Math.round(prog.pct*100)}%</span></div>`
      :`<div class="card-progress no-data"><div class="cp-bar"><div class="cp-fill" style="width:0%"></div></div><span class="cp-pct">—</span></div>`;
    const iconPaths=VAK_ICONS[v.id]||'<circle cx="12" cy="12" r="4"/>';
    const cij=cijfers[v.id];
    const cijBadge=cij!=null?`<div class="card-grade-badge ${cij>=7?'grade-green':cij>=5.5?'grade-orange':'grade-red'}">${cij.toFixed(1).replace('.',',')}</div>`:'';
    // Leerpad dots for this subject
    const lpDots=v.domeinen.map(dom=>{
      const r=getDomeinBestPct(v.id,dom.id);
      const isDone=r.pct>=0.7;
      const isStarted=r.hasData&&!isDone;
      return `<div class="card-lp-dot${isDone?' cld-done':isStarted?' cld-started':''}" title="Domein ${dom.id}"></div>`;
    }).join('');
    const lpDotsHtml=`<div class="card-lp-dots">${lpDots}</div>`;
    const staleCount=v.domeinen.filter(dom=>{const ts=getDecay()[`${v.id}_${dom.id}`];return ts&&(Date.now()-ts)/864e5>=7;}).length;
    const decayDot=staleCount>0?`<div class="card-decay-dot" title="${staleCount} domein${staleCount>1?'en':''} opfrissen"></div>`:'';
    d.innerHTML=`${cijBadge}${decayDot}<div class="card-icon"><svg viewBox="0 0 24 24">${iconPaths}</svg></div><div class="card-name">${v.naam}</div><div class="card-desc">${v.beschrijving}</div><div class="card-meta">${v.domeinen.length} CE-domeinen</div>${progHtml}${lpDotsHtml}`;
    d.dataset.domains=v.domeinen.map(dom=>dom.naam).join(' ').toLowerCase();
    d.onclick=()=>openVak(v.id);
    d.style.animationDelay=(g.children.length*0.045)+'s';
    d.style.opacity='0';
    d.style.animation='fadeUpIn .5s cubic-bezier(.22,1,.36,1) both';
    g.appendChild(d);
  });
  buildGradeInsight();
  addTiltToCards();
  const countBadge=document.getElementById('vakken-count-badge');
  if(countBadge)countBadge.textContent=getVK().length+' vakken';
}

// ═══════ SECURITY HELPERS ═══════
function escapeHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function isValidEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);}
function passwordScore(p){let s=0;if(p.length>=8)s++;if(p.length>=12)s++;if(/[A-Z]/.test(p))s++;if(/[0-9]/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;return Math.min(s,4);}
function checkPasswordStrength(p){
  const fill=document.getElementById('reg-pass-strength-fill');
  const lbl=document.getElementById('reg-pass-strength-label');
  if(!fill||!lbl)return;
  if(!p){fill.style.width='0';lbl.textContent='';return;}
  const s=passwordScore(p);
  const pcts=['0%','25%','50%','75%','100%'];
  const cols=['#ef4444','#f59e0b','#eab308','#22c55e','#16a34a'];
  const txts=['','Zwak','Matig','Goed','Sterk'];
  fill.style.width=pcts[s];fill.style.background=cols[s];
  lbl.textContent=txts[s];lbl.style.color=cols[s];
}
// Client-side rate limiter for login
const _rl={n:0,until:0};
function _rlCheck(errEl){
  if(Date.now()<_rl.until){const sec=Math.ceil((_rl.until-Date.now())/1000);errEl.textContent='Te veel pogingen. Probeer het over '+sec+' seconden opnieuw.';errEl.style.display='block';return false;}
  return true;
}
function _rlFail(){_rl.n++;if(_rl.n>=5){_rl.until=Date.now()+30000;_rl.n=0;}}
function _rlReset(){_rl.n=0;_rl.until=0;}

