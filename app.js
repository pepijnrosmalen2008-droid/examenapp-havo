

// ═══════ STATE ═══════
// antwrd entries: {pts: 0|0.5|1}
let ST = {vak:null,domein:null,mode:null,vragen:[],idx:0,score:0,antwrd:[],timer:null,tijd:20,shuffleMap:[],shuffleMaps:[],combo:0,xpThisRound:0,isDailyChallenge:false};

// ═══════ UI HELPERS ═══════
// ═══════ HASH ROUTING ═══════
const _SCREEN_HASHES={'sc-info':'info','sc-schedule':'rooster','sc-studieplan':'studieplan','sc-calc':'rekenmachine','sc-streak':'streaks'};
// Vak ID → URL-slug (volledige naam)
const _VAK_SLUG={nl:'nederlands',wa:'wiskunde-a',wb:'wiskunde-b',bi:'biologie',sk:'scheikunde',na:'natuurkunde',be:'bedrijfseconomie',en:'engels',ec:'economie',gs:'geschiedenis',ak:'aardrijkskunde',mw:'maatschappijwetenschappen',du:'duits',fr:'frans',la:'latijn',gr:'grieks',in:'informatica'};
const _SLUG_VAK=Object.fromEntries(Object.entries(_VAK_SLUG).map(([k,v])=>[v,k]));
function _pushHash(h){if((location.hash||'#').slice(1)!==h)history.pushState(null,'',h?'#'+h:location.pathname+location.search);}
function _routeFromHash(){
  const h=(location.hash||'').slice(1);
  if(!h){show('sc-home');return;}
  // vak: #havo-biologie of #vwo-wiskunde-a
  const vm=h.match(/^(havo|vwo)-(.+)$/);
  if(vm){
    const [,niv,slug]=vm;
    const id=_SLUG_VAK[slug];
    if(id){
      if(niv!==APP_LEVEL){APP_LEVEL=niv;localStorage.setItem('examenapp_level',niv);applyLevelTheme(niv);}
      const vak=getVK().find(v=>v.id===id);
      if(vak){openVak(id,true);return;}
    }
  }
  // statische schermen
  const sc=Object.entries(_SCREEN_HASHES).find(([,v])=>v===h);
  if(sc){show(sc[0],true);return;}
  show('sc-home',true);
}
function _routeFromPath(){
  const path=location.pathname.replace(/\/$/,'');
  if(path==='/havo'){chooseLevel('havo',true);return;}
  if(path==='/vwo'){chooseLevel('vwo',true);return;}
  // Terugkerende gebruiker: direct naar opgeslagen niveau — sla welkomstscherm over
  const saved=localStorage.getItem('examenapp_level');
  if(saved==='havo'||saved==='vwo'){chooseLevel(saved,true);return;}
  // Nieuwe gebruiker: toon niveau-kiezer
  show('sc-welcome',true);
  _updatePageSEO(null);
}
window.addEventListener('popstate',()=>{
  const path=location.pathname.replace(/\/$/,'');
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
// Auto-voeg jaar/tijdvak toe aan HAVO oe-vragen op basis van de bron-string
(function(){
  VAKKEN.forEach(vak=>{
    vak.domeinen.forEach(dom=>{
      (dom.oe||[]).forEach(q=>{
        if(!q.jaar){
          const m=q.bron&&q.bron.match(/(\d{4})\s+Tijdvak\s+(\d)/i);
          if(m){q.jaar=parseInt(m[1]);q.tijdvak=parseInt(m[2]);}
        }
      });
    });
  });
})();

// ═══════ CONCEPT DEPENDENCY GRAPH (adaptive learning engine — intern, niet zichtbaar voor gebruiker) ═══════
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
function getVK(){return APP_LEVEL==='vwo'?VAKKEN_VWO:VAKKEN;}
// Level-specifieke localStorage/Supabase kolomnamen — altijd suffix (_havo / _vwo)
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
    nr.textContent=q&&visible===0?`Geen vakken gevonden voor "${query}"`:'';
    nr.classList.toggle('show',q.length>0&&visible===0);
  }
}
function clearGridSearch(){
  const inp=document.getElementById('sb-input');
  if(inp){inp.value='';inp.focus();}
  const poda=document.getElementById('sb-poda');
  if(poda)poda.classList.remove('sb-has-text');
  filterGrid('');
}

function buildGradeInsight(){
  const el=document.getElementById('grade-insight-home');
  if(!el)return;
  const cijfers=getSavedCijfers();
  const vakken=getVK();
  const metCijfer=vakken.filter(v=>cijfers[v.id]!=null);
  if(metCijfer.length===0){el.innerHTML='';return;}
  const atRisk=metCijfer.filter(v=>cijfers[v.id]<6).length;
  const warnHtml=atRisk>0?`<div class="gi-warning">⚠ ${atRisk} vak${atRisk>1?'ken':''} onder de 6 — focus op CE!</div>`:'';
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
// Check existing session on load
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

// ═══════ PROFIEL & CIJFERS ═══════
const PROF_KEY='examenapp_profiel';
const CIJFER_KEY='examenapp_cijfers';

const VAK_NAAM_MAP={
  // ── Nederlands ──
  'nederlands':'nl','ne':'nl','ned':'nl','nl':'nl','nlt':'nl',
  'ned taal':'nl','ned. taal':'nl','nederlandse taal':'nl',
  'nederlandse taal en literatuur':'nl','ned. taal en lit.':'nl',
  'ned. taal en lit':'nl','ned taal en literatuur':'nl','taal en literatuur':'nl',
  // ── Wiskunde A (vóór generieke wiskunde) ──
  'wiskunde a':'wa','wisk. a':'wa','wisk.a':'wa','wiskunde-a':'wa',
  'wa':'wa','wis a':'wa','wisk a':'wa','wiska':'wa',
  // ── Wiskunde B ──
  'wiskunde b':'wb','wisk. b':'wb','wisk.b':'wb','wiskunde-b':'wb',
  'wb':'wb','wis b':'wb','wisk b':'wb','wiskb':'wb',
  // ── Wiskunde generiek (fallback) ──
  'wiskunde':'wa','wisk':'wa',
  // ── Biologie ──
  'biologie':'bi','bio':'bi','biol':'bi','bi':'bi',
  // ── Scheikunde ──
  'scheikunde':'sk','schk':'sk','schei':'sk','sk':'sk',
  'nask2':'sk','nask 2':'sk','nask-2':'sk',
  // ── Natuurkunde ──
  'natuurkunde':'na','natk':'na','na':'na','nat':'na',
  'nask1':'na','nask 1':'na','nask-1':'na','nask':'na',
  // ── Economie ──
  'economie':'ec','eco':'ec','econ':'ec','ec':'ec',
  // ── Bedrijfseconomie ──
  'bedrijfseconomie':'be','bedr.ec.':'be','bedrijfsec.':'be',
  'bedrijfsec':'be','bedr ec':'be','be':'be','bedreco':'be',
  // ── Engels ──
  'engels':'en','eng':'en','english':'en','en':'en',
  'engelse taal en literatuur':'en','eng. taal en lit.':'en',
  'eng. taal en lit':'en','engelse taal':'en',
  // ── Maatschappijwetenschappen ──
  'maatschappijwetenschappen':'mw','maatschappijwetensch.':'mw',
  'maatschappijwetensch':'mw','maatschappijleer':'mw',
  'maatsch.leer':'mw','maatsch leer':'mw','m&m':'mw','mw':'mw',
  'maat':'mw','maatwetensch':'mw','maw':'mw',
  // ── Geschiedenis ──
  'geschiedenis':'gs','ges':'gs','gesch':'gs','hist':'gs','gs':'gs',
  // ── Aardrijkskunde ──
  'aardrijkskunde':'ak','aard':'ak','aardrijksk':'ak','geo':'ak','ak':'ak',
  // ── Duits ──
  'duits':'du','du':'du','dui':'du','german':'du',
  'duitse taal en literatuur':'du','dui. taal en lit.':'du','duitse taal':'du',
  // ── Frans ──
  'frans':'fr','fr':'fr','fra':'fr','french':'fr',
  'franse taal en literatuur':'fr','fra. taal en lit.':'fr','franse taal':'fr',
};

// Gesorteerde sleutels: langste eerst zodat specifiekere matches prioriteit krijgen
const _VAK_KEYS_SORTED=Object.keys(VAK_NAAM_MAP).sort((a,b)=>b.length-a.length);

function matchVakNaam(raw){
  if(!raw||raw.length<2)return null;
  const s=raw.toLowerCase().trim()
    .replace(/[.,;:()\[\]\/|]/g,' ')
    .replace(/\s+/g,' ').trim();
  if(!s||s.length<2)return null;
  // 1. Exacte match
  if(VAK_NAAM_MAP[s])return VAK_NAAM_MAP[s];
  // 2. Bevat-match (langste sleutels eerst, minimaal 3 tekens)
  for(const key of _VAK_KEYS_SORTED){
    if(key.length>=3&&s.includes(key))return VAK_NAAM_MAP[key];
  }
  return null;
}

const AVATARS=[
  {e:'🦁',n:'Leeuw'},{e:'🐯',n:'Tijger'},{e:'🦊',n:'Vos'},{e:'🐺',n:'Wolf'},
  {e:'🐻',n:'Beer'},{e:'🐼',n:'Panda'},{e:'🐨',n:'Koala'},{e:'🦝',n:'Wasbeer'},
  {e:'🐸',n:'Kikker'},{e:'🐧',n:'Pinguïn'},{e:'🦦',n:'Otter'},{e:'🦉',n:'Uil'},
  {e:'🦆',n:'Eend'},{e:'🐬',n:'Dolfijn'},{e:'🦈',n:'Haai'},{e:'🐙',n:'Octopus'},
  {e:'🦋',n:'Vlinder'},{e:'🦜',n:'Papegaai'},{e:'🐊',n:'Krokodil'},{e:'🦒',n:'Giraf'},
];
let selectedAvatar=AVATARS[4].e;
// ── ANIMAL EVOLUTION SYSTEM ──
const ANIMAL_EVOLUTIONS=[
  {id:'adelaar', n:'Adelaar', s:['','','','',''], fallback:['🥚','🐣','🐥','🐦','🦅'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="35" rx="16" ry="19" fill="#fef3c7" stroke="#b45309" stroke-width="3"/><path d="M24 22 L30 15 L36 22" stroke="#b45309" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="23" cy="27" rx="7" ry="4" fill="white" opacity="0.35"/><circle cx="24" cy="30" r="2" fill="#d97706"/><circle cx="36" cy="33" r="1.5" fill="#d97706"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="42" rx="10" ry="5" fill="#fbbf24" stroke="#b45309" stroke-width="2" transform="rotate(20,10,42)"/><ellipse cx="50" cy="42" rx="10" ry="5" fill="#fbbf24" stroke="#b45309" stroke-width="2" transform="rotate(-20,50,42)"/><circle cx="30" cy="34" r="19" fill="#fde68a" stroke="#b45309" stroke-width="3"/><circle cx="22" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="30" r="3.5" fill="#1a0a00"/><circle cx="38" cy="30" r="3.5" fill="#1a0a00"/><circle cx="21" cy="28.5" r="1.2" fill="white"/><circle cx="37" cy="28.5" r="1.2" fill="white"/><path d="M26 37 Q30 35 34 37 Q35 41 32 44 Q30 45 28 44 Q25 41 26 37Z" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/><ellipse cx="24" cy="25" rx="8" ry="4" fill="white" opacity="0.25"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="7" cy="38" rx="11" ry="6" fill="#d97706" stroke="#92400e" stroke-width="2" transform="rotate(-20,7,38)"/><ellipse cx="53" cy="38" rx="11" ry="6" fill="#d97706" stroke="#92400e" stroke-width="2" transform="rotate(20,53,38)"/><ellipse cx="30" cy="43" rx="16" ry="11" fill="#92400e" stroke="#1a0a00" stroke-width="2.5"/><circle cx="30" cy="27" r="17" fill="#d97706" stroke="#1a0a00" stroke-width="3"/><circle cx="22" cy="24" r="5.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="24" r="5.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="24" r="3" fill="#1a0a00"/><circle cx="38" cy="24" r="3" fill="#1a0a00"/><circle cx="21" cy="23" r="1" fill="white"/><circle cx="37" cy="23" r="1" fill="white"/><path d="M25 33 Q30 31 35 33 Q36 38 33 41 Q31 43 29 42 Q26 41 24 38 Q24 35 25 33Z" fill="#f59e0b" stroke="#b45309" stroke-width="2"/><ellipse cx="23" cy="21" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M6 42 Q3 24 14 14 Q18 30 22 42Z" fill="#78350f" stroke="#1a0a00" stroke-width="2"/><path d="M54 42 Q57 24 46 14 Q42 30 38 42Z" fill="#78350f" stroke="#1a0a00" stroke-width="2"/><ellipse cx="30" cy="45" rx="15" ry="10" fill="#78350f" stroke="#1a0a00" stroke-width="2"/><circle cx="30" cy="26" r="17" fill="#f1f5f9" stroke="#1a0a00" stroke-width="3"/><circle cx="22" cy="23" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="23" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="23" r="3.5" fill="#d97706"/><circle cx="38" cy="23" r="3.5" fill="#d97706"/><circle cx="22" cy="23" r="1.8" fill="#1a0a00"/><circle cx="38" cy="23" r="1.8" fill="#1a0a00"/><circle cx="21" cy="22" r="1" fill="white"/><circle cx="37" cy="22" r="1" fill="white"/><path d="M24 31 Q30 28 36 31 Q37 36 34 40 Q32 42 30 41 Q27 41 25 38 Q23 35 24 31Z" fill="#f59e0b" stroke="#b45309" stroke-width="2"/><ellipse cx="23" cy="19" rx="8" ry="4" fill="white" opacity="0.3"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M14 12 L18 4 L22 12 L26 5 L30 12 L34 5 L38 12 L42 4 L46 12Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><path d="M4 44 Q2 22 13 12 Q18 28 20 44Z" fill="#7c2d12" stroke="#1a0a00" stroke-width="2"/><path d="M56 44 Q58 22 47 12 Q42 28 40 44Z" fill="#7c2d12" stroke="#1a0a00" stroke-width="2"/><ellipse cx="30" cy="47" rx="15" ry="10" fill="#7c2d12" stroke="#1a0a00" stroke-width="2"/><circle cx="30" cy="27" r="18" fill="#f1f5f9" stroke="#1a0a00" stroke-width="3"/><circle cx="22" cy="24" r="7" fill="#fde68a" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="24" r="7" fill="#fde68a" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="24" r="4" fill="#d97706"/><circle cx="38" cy="24" r="4" fill="#d97706"/><circle cx="22" cy="24" r="2" fill="#1a0a00"/><circle cx="38" cy="24" r="2" fill="#1a0a00"/><circle cx="21" cy="23" r="1.2" fill="white"/><circle cx="37" cy="23" r="1.2" fill="white"/><path d="M23 32 Q30 29 37 32 Q38 38 35 43 Q33 45 30 44 Q27 44 25 41 Q22 38 23 32Z" fill="#f59e0b" stroke="#b45309" stroke-width="2.5"/><ellipse cx="24" cy="19" rx="9" ry="4.5" fill="white" opacity="0.2"/></svg>'
   ],
   lbl:['Verward Ei','Slaperig Kuiken','Trotse Pieper','Bijziende Vogel','Legendarische Adelaar'],
   desc:['Ligt lekker te snoozen. Weet nog van niks.','Piept bij elke vraag. Begrijpt nog niks.','Denkt dat het alles snapt. Vergeet de helft.','Vliegt al, maar googlet stiekem nog antwoorden.','Zweeft boven de examenvragen als een god.'],
   evoMsg:['🐣 Je ei is gebarsten! Je Adelaar is wakker... een beetje.','🐥 Je Adelaar piept van trots!','🐦 Je Adelaar vliegt al! Niet helemaal recht, maar toch.','🦅 LEGENDARISCHE ADELAAR ONTGRENDELD! De examinator trilt.']},
  {id:'leeuw', n:'Leeuw', s:['','','','',''], fallback:['🐾','🐱','🐈','🐆','🦁'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="24" rx="7" ry="9" fill="#fb923c" stroke="#c2410c" stroke-width="2.5" transform="rotate(-15,20,24)"/><ellipse cx="40" cy="24" rx="7" ry="9" fill="#fb923c" stroke="#c2410c" stroke-width="2.5" transform="rotate(15,40,24)"/><ellipse cx="20" cy="24" rx="4" ry="6" fill="#fda4af" transform="rotate(-15,20,24)"/><ellipse cx="40" cy="24" rx="4" ry="6" fill="#fda4af" transform="rotate(15,40,24)"/><circle cx="30" cy="36" r="19" fill="#fb923c" stroke="#c2410c" stroke-width="3"/><circle cx="22" cy="32" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="32" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="32" r="3.5" fill="#15803d"/><circle cx="38" cy="32" r="3.5" fill="#15803d"/><circle cx="22" cy="32" r="1.8" fill="#1a0a00"/><circle cx="38" cy="32" r="1.8" fill="#1a0a00"/><circle cx="21" cy="31" r="1" fill="white"/><circle cx="37" cy="31" r="1" fill="white"/><path d="M27 37 Q30 34 33 37 Q31 40 30 41 Q29 40 27 37Z" fill="#be185d" stroke="#9d174d" stroke-width="1"/><line x1="19" y1="38" x2="7" y2="36" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="19" y1="41" x2="6" y2="41" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="41" y1="38" x2="53" y2="36" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="41" y1="41" x2="54" y2="41" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><ellipse cx="23" cy="27" rx="7" ry="4" fill="white" opacity="0.25"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="18" cy="20" rx="7" ry="10" fill="#fb923c" stroke="#c2410c" stroke-width="2" transform="rotate(-15,18,20)"/><ellipse cx="42" cy="20" rx="7" ry="10" fill="#fb923c" stroke="#c2410c" stroke-width="2" transform="rotate(15,42,20)"/><ellipse cx="18" cy="20" rx="4" ry="6" fill="#fda4af" transform="rotate(-15,18,20)"/><ellipse cx="42" cy="20" rx="4" ry="6" fill="#fda4af" transform="rotate(15,42,20)"/><circle cx="30" cy="36" r="22" fill="#ea580c" stroke="#1a0a00" stroke-width="3"/><circle cx="30" cy="36" r="17" fill="#fb923c" stroke="#c2410c" stroke-width="2"/><circle cx="22" cy="32" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="32" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="32" r="3.5" fill="#15803d"/><circle cx="38" cy="32" r="3.5" fill="#15803d"/><circle cx="22" cy="32" r="1.8" fill="#1a0a00"/><circle cx="38" cy="32" r="1.8" fill="#1a0a00"/><circle cx="21" cy="31" r="1" fill="white"/><circle cx="37" cy="31" r="1" fill="white"/><path d="M27 38 Q30 35 33 38 Q31 41 30 42 Q29 41 27 38Z" fill="#be185d" stroke="#9d174d" stroke-width="1"/><line x1="19" y1="39" x2="7" y2="37" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="19" y1="42" x2="6" y2="42" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="41" y1="39" x2="53" y2="37" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="41" y1="42" x2="54" y2="42" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><path d="M24 43 Q30 47 36 43" stroke="#c2410c" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="26" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="18" rx="7" ry="11" fill="#f97316" stroke="#c2410c" stroke-width="2" transform="rotate(-10,16,18)"/><ellipse cx="44" cy="18" rx="7" ry="11" fill="#f97316" stroke="#c2410c" stroke-width="2" transform="rotate(10,44,18)"/><ellipse cx="16" cy="18" rx="4" ry="7" fill="#fda4af" transform="rotate(-10,16,18)"/><ellipse cx="44" cy="18" rx="4" ry="7" fill="#fda4af" transform="rotate(10,44,18)"/><circle cx="30" cy="35" r="24" fill="#d97706" stroke="#1a0a00" stroke-width="3"/><circle cx="30" cy="35" r="18" fill="#f97316" stroke="#c2410c" stroke-width="2"/><circle cx="22" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="31" r="3.5" fill="#d97706"/><circle cx="38" cy="31" r="3.5" fill="#d97706"/><circle cx="22" cy="31" r="1.8" fill="#1a0a00"/><circle cx="38" cy="31" r="1.8" fill="#1a0a00"/><circle cx="21" cy="30" r="1" fill="white"/><circle cx="37" cy="30" r="1" fill="white"/><path d="M27 37 Q30 34 33 37 Q31 40 30 41 Q29 40 27 37Z" fill="#be185d" stroke="#9d174d" stroke-width="1"/><line x1="19" y1="37" x2="7" y2="35" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="19" y1="40" x2="6" y2="40" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="41" y1="37" x2="53" y2="35" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="41" y1="40" x2="54" y2="40" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><path d="M23 42 Q30 47 37 42" stroke="#c2410c" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="25" rx="9" ry="4.5" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="33" r="28" fill="#b45309" stroke="#1a0a00" stroke-width="3"/><ellipse cx="14" cy="22" rx="7" ry="10" fill="#d97706" stroke="#1a0a00" stroke-width="2" transform="rotate(-15,14,22)"/><ellipse cx="46" cy="22" rx="7" ry="10" fill="#d97706" stroke="#1a0a00" stroke-width="2" transform="rotate(15,46,22)"/><ellipse cx="14" cy="22" rx="4" ry="7" fill="#fda4af" transform="rotate(-15,14,22)"/><ellipse cx="46" cy="22" rx="4" ry="7" fill="#fda4af" transform="rotate(15,46,22)"/><circle cx="30" cy="33" r="20" fill="#fbbf24" stroke="#b45309" stroke-width="2"/><circle cx="21" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="29" r="4" fill="#22c55e"/><circle cx="39" cy="29" r="4" fill="#22c55e"/><circle cx="21" cy="29" r="2" fill="#1a0a00"/><circle cx="39" cy="29" r="2" fill="#1a0a00"/><circle cx="20" cy="28" r="1" fill="white"/><circle cx="38" cy="28" r="1" fill="white"/><path d="M27 35 Q30 32 33 35 Q31 38 30 39 Q29 38 27 35Z" fill="#be185d" stroke="#9d174d" stroke-width="1"/><line x1="18" y1="36" x2="6" y2="34" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="18" y1="39" x2="5" y2="39" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="42" y1="36" x2="54" y2="34" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="42" y1="39" x2="55" y2="39" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><path d="M22 41 Q30 47 38 41" stroke="#92400e" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="23" rx="9" ry="5" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M12 14 L16 5 L20 13 L24 6 L30 13 L36 6 L40 13 L44 5 L48 14Z" fill="#fbbf24" stroke="#b45309" stroke-width="2"/><circle cx="30" cy="32" r="28" fill="#92400e" stroke="#1a0a00" stroke-width="3"/><ellipse cx="12" cy="20" rx="7" ry="11" fill="#f97316" stroke="#1a0a00" stroke-width="2" transform="rotate(-15,12,20)"/><ellipse cx="48" cy="20" rx="7" ry="11" fill="#f97316" stroke="#1a0a00" stroke-width="2" transform="rotate(15,48,20)"/><ellipse cx="12" cy="20" rx="4" ry="7" fill="#fda4af" transform="rotate(-15,12,20)"/><ellipse cx="48" cy="20" rx="4" ry="7" fill="#fda4af" transform="rotate(15,48,20)"/><circle cx="30" cy="32" r="20" fill="#fbbf24" stroke="#b45309" stroke-width="2"/><circle cx="21" cy="28" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="28" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="28" r="4.5" fill="#dc2626"/><circle cx="39" cy="28" r="4.5" fill="#dc2626"/><circle cx="21" cy="28" r="2" fill="#1a0a00"/><circle cx="39" cy="28" r="2" fill="#1a0a00"/><circle cx="20" cy="27" r="1.2" fill="white"/><circle cx="38" cy="27" r="1.2" fill="white"/><path d="M27 34 Q30 31 33 34 Q31 37 30 38 Q29 37 27 34Z" fill="#be185d" stroke="#9d174d" stroke-width="1"/><line x1="18" y1="35" x2="5" y2="33" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="18" y1="38" x2="4" y2="38" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="42" y1="35" x2="55" y2="33" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="42" y1="38" x2="56" y2="38" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><path d="M22 40 Q30 46 38 40" stroke="#78350f" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="22" rx="10" ry="5" fill="white" opacity="0.2"/></svg>'
   ],
   lbl:['Huilerig Welp','Nieuwsgierig Katje','Brutaal Puber','Gevaarlijke Luipaard','Onoverwinnelijke Leeuw'],
   desc:['Huilt bij de eerste moeilijke vraag.','Speelt liever dan oefent. Schattig maar nutteloos.','Denkt dat het beter is dan de leraar. Heeft een punt.','Jaagt op hoge cijfers. Laat niemand ontkomen.','Brult bij elk examen. Zelfs de surveillant is bang.'],
   evoMsg:['🐱 Je Leeuw heeft zijn eerste tand! Ow wat schattig.','🐈 Je Leeuw is in de puberteit. Excuses voor het gedrag.','🐆 Je Leeuw jaagt nu echt op die hoge cijfers!','🦁 GEBRUL! Je Leeuw heeft het maximum bereikt. Vrees hem.']},
  {id:'draak', n:'Draak', s:['','','','',''], fallback:['🥚','🦎','🐊','🐲','🐉'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="35" rx="16" ry="19" fill="#1e1b4b" stroke="#6d28d9" stroke-width="3"/><path d="M24 22 L30 14 L36 22" stroke="#a855f7" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="23" cy="28" rx="7" ry="3.5" fill="#7c3aed" opacity="0.4"/><circle cx="25" cy="31" r="2" fill="#a855f7"/><circle cx="35" cy="34" r="1.5" fill="#a855f7"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="34" r="17" fill="#7c3aed" stroke="#4c1d95" stroke-width="3"/><ellipse cx="18" cy="17" rx="5" ry="8" fill="#6d28d9" stroke="#4c1d95" stroke-width="2" transform="rotate(-20,18,17)"/><ellipse cx="42" cy="17" rx="5" ry="8" fill="#6d28d9" stroke="#4c1d95" stroke-width="2" transform="rotate(20,42,17)"/><circle cx="22" cy="32" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="32" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="32" r="3.5" fill="#22c55e"/><circle cx="38" cy="32" r="3.5" fill="#22c55e"/><ellipse cx="22" cy="32" rx="0.9" ry="2.5" fill="#1a0a00"/><ellipse cx="38" cy="32" rx="0.9" ry="2.5" fill="#1a0a00"/><circle cx="21" cy="31" r="1" fill="white"/><circle cx="37" cy="31" r="1" fill="white"/><ellipse cx="30" cy="39" rx="6" ry="3.5" fill="#5b21b6" stroke="#4c1d95" stroke-width="1.5"/><circle cx="27" cy="38" r="1.5" fill="#3b0764"/><circle cx="33" cy="38" r="1.5" fill="#3b0764"/><path d="M27 43 L29 47 L31 43" stroke="#ef4444" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="27" rx="7" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="34" r="20" fill="#6d28d9" stroke="#4c1d95" stroke-width="3"/><ellipse cx="16" cy="14" rx="5" ry="10" fill="#4c1d95" stroke="#1a0a00" stroke-width="2" transform="rotate(-20,16,14)"/><ellipse cx="44" cy="14" rx="5" ry="10" fill="#4c1d95" stroke="#1a0a00" stroke-width="2" transform="rotate(20,44,14)"/><path d="M3 36 Q8 26 18 34" stroke="#9333ea" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M57 36 Q52 26 42 34" stroke="#9333ea" stroke-width="6" stroke-linecap="round" fill="none"/><circle cx="22" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="31" r="3.5" fill="#22c55e"/><circle cx="38" cy="31" r="3.5" fill="#22c55e"/><ellipse cx="22" cy="31" rx="0.9" ry="2.5" fill="#1a0a00"/><ellipse cx="38" cy="31" rx="0.9" ry="2.5" fill="#1a0a00"/><circle cx="21" cy="30" r="1" fill="white"/><circle cx="37" cy="30" r="1" fill="white"/><ellipse cx="30" cy="38" rx="6" ry="3.5" fill="#5b21b6" stroke="#4c1d95" stroke-width="1.5"/><circle cx="27" cy="37" r="1.5" fill="#3b0764"/><circle cx="33" cy="37" r="1.5" fill="#3b0764"/><path d="M26 42 L28 47 L30 44 L32 47 L34 42" stroke="#f97316" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="23" cy="26" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M3 45 Q1 26 11 15 Q18 6 28 8 Q30 2 32 8 Q42 6 49 15 Q59 26 57 45 Q52 58 30 59 Q8 58 3 45Z" fill="#7c3aed" stroke="#4c1d95" stroke-width="3"/><ellipse cx="18" cy="10" rx="5" ry="9" fill="#4c1d95" stroke="#1a0a00" stroke-width="2" transform="rotate(-25,18,10)"/><ellipse cx="42" cy="10" rx="5" ry="9" fill="#4c1d95" stroke="#1a0a00" stroke-width="2" transform="rotate(25,42,10)"/><path d="M1 36 Q7 24 18 33" stroke="#9333ea" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M59 36 Q53 24 42 33" stroke="#9333ea" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="22" cy="30" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="30" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="30" r="4.5" fill="#dc2626"/><circle cx="38" cy="30" r="4.5" fill="#dc2626"/><ellipse cx="22" cy="30" rx="1" ry="3" fill="#1a0a00"/><ellipse cx="38" cy="30" rx="1" ry="3" fill="#1a0a00"/><circle cx="21" cy="29" r="1.2" fill="white"/><circle cx="37" cy="29" r="1.2" fill="white"/><ellipse cx="30" cy="37" rx="7" ry="4" fill="#5b21b6" stroke="#4c1d95" stroke-width="2"/><circle cx="26" cy="36" r="2" fill="#3b0764"/><circle cx="34" cy="36" r="2" fill="#3b0764"/><path d="M24 43 L27 49 L30 45 L33 49 L36 43" stroke="#f97316" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="23" cy="22" rx="9" ry="4.5" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M14 8 L17 2 L20 8 L23 3 L26 8 L30 2 L34 8 L37 3 L40 8 L43 2 L46 8Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><path d="M2 46 Q0 24 11 13 Q19 4 28 6 Q30 0 32 6 Q41 4 49 13 Q60 24 58 46 Q52 59 30 60 Q8 59 2 46Z" fill="#6d28d9" stroke="#4c1d95" stroke-width="3"/><ellipse cx="16" cy="8" rx="5" ry="10" fill="#3b0764" stroke="#1a0a00" stroke-width="2" transform="rotate(-25,16,8)"/><ellipse cx="44" cy="8" rx="5" ry="10" fill="#3b0764" stroke="#1a0a00" stroke-width="2" transform="rotate(25,44,8)"/><path d="M0 35 Q6 22 18 32" stroke="#7c3aed" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M60 35 Q54 22 42 32" stroke="#7c3aed" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="21" cy="28" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="28" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="28" r="5" fill="#f97316"/><circle cx="39" cy="28" r="5" fill="#f97316"/><ellipse cx="21" cy="28" rx="1.2" ry="3.5" fill="#1a0a00"/><ellipse cx="39" cy="28" rx="1.2" ry="3.5" fill="#1a0a00"/><circle cx="20" cy="27" r="1.5" fill="white"/><circle cx="38" cy="27" r="1.5" fill="white"/><ellipse cx="30" cy="36" rx="8" ry="4.5" fill="#5b21b6" stroke="#4c1d95" stroke-width="2"/><circle cx="25" cy="35" r="2.2" fill="#3b0764"/><circle cx="35" cy="35" r="2.2" fill="#3b0764"/><path d="M22 42 L25 49 L28 45 L30 51 L32 45 L35 49 L38 42" stroke="#f97316" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="22" cy="21" rx="10" ry="5" fill="white" opacity="0.18"/></svg>'
   ],
   lbl:['Mysterieus Ei','Verward Hagedisje','Krokodil met Ambities','Semi-Draak','Legendarische Vuurdrake'],
   desc:['Niemand weet wat erin zit. Jijzelf ook niet.','Klein maar heeft grote plannen. Legt ze niet uit.','Bijt van zich af bij moeilijke vragen. Letterlijk.','Spuwt soms vuur. Soms per ongeluk op de samenvatting.','Vernietigt elk examen met één adem. Onstopbaar.'],
   evoMsg:['🦎 Je Draak kruipt uit het ei! Ziet er... interessant uit.','🐊 Je Draak bijt van zich af! Pas op je vingers.','🐲 HALF-DRAAK ONTGRENDELD! Er komt rook uit z\'n neus.','🐉 VUURDRAKE! Het examenlokaal heeft extra brandblusser nodig.']},
  {id:'wolf', n:'Wolf', s:['','','','',''], fallback:['🐾','🐶','🐕','🐺','🌕'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="19" cy="20" rx="7" ry="11" fill="#94a3b8" stroke="#475569" stroke-width="2.5" transform="rotate(-15,19,20)"/><ellipse cx="41" cy="20" rx="7" ry="11" fill="#94a3b8" stroke="#475569" stroke-width="2.5" transform="rotate(15,41,20)"/><ellipse cx="19" cy="20" rx="4" ry="7" fill="#fda4af" transform="rotate(-15,19,20)"/><ellipse cx="41" cy="20" rx="4" ry="7" fill="#fda4af" transform="rotate(15,41,20)"/><circle cx="30" cy="36" r="19" fill="#cbd5e1" stroke="#475569" stroke-width="3"/><ellipse cx="30" cy="44" rx="11" ry="7" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/><circle cx="22" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="31" r="3.5" fill="#d97706"/><circle cx="38" cy="31" r="3.5" fill="#d97706"/><circle cx="22" cy="31" r="1.8" fill="#1a0a00"/><circle cx="38" cy="31" r="1.8" fill="#1a0a00"/><circle cx="21" cy="30" r="1" fill="white"/><circle cx="37" cy="30" r="1" fill="white"/><ellipse cx="30" cy="41" rx="3" ry="2" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="23" cy="26" rx="7" ry="4" fill="white" opacity="0.25"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="17" cy="17" rx="7" ry="12" fill="#94a3b8" stroke="#475569" stroke-width="2" transform="rotate(-12,17,17)"/><ellipse cx="43" cy="17" rx="7" ry="12" fill="#94a3b8" stroke="#475569" stroke-width="2" transform="rotate(12,43,17)"/><ellipse cx="17" cy="17" rx="4" ry="7" fill="#fda4af" transform="rotate(-12,17,17)"/><ellipse cx="43" cy="17" rx="4" ry="7" fill="#fda4af" transform="rotate(12,43,17)"/><circle cx="30" cy="34" r="20" fill="#94a3b8" stroke="#475569" stroke-width="3"/><ellipse cx="30" cy="43" rx="13" ry="9" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/><circle cx="21" cy="29" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="29" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="29" r="3.5" fill="#d97706"/><circle cx="39" cy="29" r="3.5" fill="#d97706"/><circle cx="21" cy="29" r="1.8" fill="#1a0a00"/><circle cx="39" cy="29" r="1.8" fill="#1a0a00"/><circle cx="20" cy="28" r="1" fill="white"/><circle cx="38" cy="28" r="1" fill="white"/><ellipse cx="30" cy="40" rx="3.5" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="22" cy="24" rx="8" ry="4" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="15" cy="15" rx="7" ry="13" fill="#64748b" stroke="#334155" stroke-width="2.5" transform="rotate(-10,15,15)"/><ellipse cx="45" cy="15" rx="7" ry="13" fill="#64748b" stroke="#334155" stroke-width="2.5" transform="rotate(10,45,15)"/><ellipse cx="15" cy="15" rx="4" ry="8" fill="#475569" transform="rotate(-10,15,15)"/><ellipse cx="45" cy="15" rx="4" ry="8" fill="#475569" transform="rotate(10,45,15)"/><circle cx="30" cy="33" r="21" fill="#64748b" stroke="#334155" stroke-width="3"/><ellipse cx="30" cy="44" rx="14" ry="9" fill="#94a3b8" stroke="#64748b" stroke-width="1.5"/><circle cx="21" cy="28" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="28" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="28" r="4" fill="#d97706"/><circle cx="39" cy="28" r="4" fill="#d97706"/><circle cx="21" cy="28" r="2" fill="#1a0a00"/><circle cx="39" cy="28" r="2" fill="#1a0a00"/><circle cx="20" cy="27" r="1" fill="white"/><circle cx="38" cy="27" r="1" fill="white"/><ellipse cx="30" cy="40" rx="4" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><path d="M24 44 Q30 48 36 44" stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="23" rx="9" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="13" cy="13" rx="7" ry="13" fill="#475569" stroke="#1e293b" stroke-width="2.5" transform="rotate(-8,13,13)"/><ellipse cx="47" cy="13" rx="7" ry="13" fill="#475569" stroke="#1e293b" stroke-width="2.5" transform="rotate(8,47,13)"/><ellipse cx="13" cy="13" rx="4" ry="8" fill="#334155" transform="rotate(-8,13,13)"/><ellipse cx="47" cy="13" rx="4" ry="8" fill="#334155" transform="rotate(8,47,13)"/><circle cx="30" cy="32" r="22" fill="#475569" stroke="#1e293b" stroke-width="3"/><ellipse cx="30" cy="44" rx="15" ry="10" fill="#64748b" stroke="#475569" stroke-width="1.5"/><circle cx="21" cy="27" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="27" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="27" r="4.5" fill="#d97706"/><circle cx="39" cy="27" r="4.5" fill="#d97706"/><circle cx="21" cy="27" r="2.2" fill="#1a0a00"/><circle cx="39" cy="27" r="2.2" fill="#1a0a00"/><circle cx="20" cy="26" r="1.2" fill="white"/><circle cx="38" cy="26" r="1.2" fill="white"/><ellipse cx="30" cy="40" rx="4.5" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><path d="M24 43 Q30 49 36 43" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="21" rx="10" ry="5" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="9" r="10" fill="#fde68a" stroke="#b45309" stroke-width="2" opacity="0.7"/><ellipse cx="11" cy="13" rx="7" ry="13" fill="#334155" stroke="#1e293b" stroke-width="2.5" transform="rotate(-8,11,13)"/><ellipse cx="49" cy="13" rx="7" ry="13" fill="#334155" stroke="#1e293b" stroke-width="2.5" transform="rotate(8,49,13)"/><ellipse cx="11" cy="13" rx="4" ry="8" fill="#1e293b" transform="rotate(-8,11,13)"/><ellipse cx="49" cy="13" rx="4" ry="8" fill="#1e293b" transform="rotate(8,49,13)"/><circle cx="30" cy="32" r="23" fill="#334155" stroke="#1e293b" stroke-width="3"/><ellipse cx="30" cy="45" rx="16" ry="10" fill="#475569" stroke="#334155" stroke-width="1.5"/><circle cx="20" cy="27" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="40" cy="27" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="20" cy="27" r="5" fill="#d97706"/><circle cx="40" cy="27" r="5" fill="#d97706"/><circle cx="20" cy="27" r="2.5" fill="#1a0a00"/><circle cx="40" cy="27" r="2.5" fill="#1a0a00"/><circle cx="19" cy="26" r="1.2" fill="white"/><circle cx="39" cy="26" r="1.2" fill="white"/><ellipse cx="30" cy="41" rx="5" ry="3.5" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><path d="M23 46 Q30 52 37 46" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="21" cy="21" rx="11" ry="5" fill="white" opacity="0.18"/></svg>'
   ],
   lbl:['Piepklein Welp','Enthousiast Puppybrein','Trouwe Studeerbuddy','Gevaarlijke Wolf','Hurling-bij-de-Maan Wolf'],
   desc:['Zo klein dat het bijna zielig is. Bijna.','Blij met elke vraag. Ook de foute antwoorden.','Leert trucjes. Vooral het trucje "niet opgeven".','Huilt naar de maan als het examen nadert.','Huilt succesvol naar de volle maan. 10/10 geslaagd.'],
   evoMsg:['🐶 Je Wolf kwispelt van vreugde! Alles is spannend!','🐕 Je Wolf leert nieuwe trucjes! Zit. Goed zo.','🐺 WOLF ONTGRENDELD! Huilt professioneel naar de maan.','🌕 JE WOLF HUILT NAAR DE MAAN! De buren bellen de politie.']},
  {id:'vlinder', n:'Vlinder', s:['','','','',''], fallback:['🥚','🐛','🫘','🐚','🦋'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="38" rx="9" ry="12" fill="#65a30d" stroke="#3f6212" stroke-width="3"/><ellipse cx="21" cy="46" rx="15" ry="5" fill="#4d7c0f" stroke="#3f6212" stroke-width="2"/><circle cx="30" cy="26" r="8" fill="#bbf7d0" stroke="#4ade80" stroke-width="2.5"/><ellipse cx="27" cy="24" rx="5" ry="3" fill="white" opacity="0.4"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 56 Q20 52 16 44 Q12 36 14 28 Q16 18 20 14 Q24 10 28 12 Q30 8 32 12 Q36 10 40 14 Q44 18 46 28 Q48 36 44 44 Q40 52 30 56Z" fill="#22c55e" stroke="#15803d" stroke-width="3"/><path d="M24 18 Q30 14 36 18" stroke="#4ade80" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M21 26 Q30 22 39 26" stroke="#4ade80" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M20 34 Q30 30 40 34" stroke="#4ade80" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="25" cy="14" r="4" fill="#166534" stroke="#15803d" stroke-width="2"/><circle cx="35" cy="14" r="4" fill="#166534" stroke="#15803d" stroke-width="2"/><circle cx="25" cy="14" r="2.5" fill="#1a0a00"/><circle cx="35" cy="14" r="2.5" fill="#1a0a00"/><circle cx="24.5" cy="13" r="0.8" fill="white"/><circle cx="34.5" cy="13" r="0.8" fill="white"/><ellipse cx="24" cy="10" rx="5" ry="3" fill="white" opacity="0.25"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="36" rx="11" ry="18" fill="#a16207" stroke="#92400e" stroke-width="3"/><ellipse cx="30" cy="30" rx="9" ry="13" fill="#ca8a04" stroke="#92400e" stroke-width="2"/><path d="M22 20 Q30 16 38 20" stroke="#d97706" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M22 28 Q30 24 38 28" stroke="#d97706" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M22 36 Q30 32 38 36" stroke="#d97706" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="26" cy="18" r="4" fill="#92400e" stroke="#78350f" stroke-width="1.5"/><circle cx="34" cy="18" r="4" fill="#92400e" stroke="#78350f" stroke-width="1.5"/><ellipse cx="25" cy="24" rx="6" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 42 Q14 36 7 24 Q4 16 10 10 Q16 6 22 10 Q26 14 30 12 Q34 14 38 10 Q44 6 50 10 Q56 16 53 24 Q46 36 30 42Z" fill="#a855f7" stroke="#7c3aed" stroke-width="3"/><path d="M30 40 Q18 34 14 26 Q12 20 16 18 Q20 16 24 20 Q27 24 30 22 Q33 24 36 20 Q40 16 44 18 Q48 20 46 26 Q42 34 30 40Z" fill="#d8b4fe" stroke="#a855f7" stroke-width="2"/><ellipse cx="30" cy="42" rx="5" ry="15" fill="#7c3aed" stroke="#4c1d95" stroke-width="2.5"/><circle cx="30" cy="28" r="6" fill="#6d28d9" stroke="#4c1d95" stroke-width="2"/><circle cx="27.5" cy="26" r="3" fill="white" stroke="#1a0a00" stroke-width="1.5"/><circle cx="32.5" cy="26" r="3" fill="white" stroke="#1a0a00" stroke-width="1.5"/><circle cx="27.5" cy="26" r="1.5" fill="#1a0a00"/><circle cx="32.5" cy="26" r="1.5" fill="#1a0a00"/><circle cx="27" cy="25.5" r="0.6" fill="white"/><circle cx="32" cy="25.5" r="0.6" fill="white"/><ellipse cx="28" cy="24" rx="5" ry="2.5" fill="white" opacity="0.3"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 44 Q10 32 3 18 Q0 8 8 4 Q16 2 22 8 Q26 14 30 10 Q34 14 38 8 Q44 2 52 4 Q60 8 57 18 Q50 32 30 44Z" fill="#db2777" stroke="#be185d" stroke-width="3"/><path d="M30 38 Q16 28 10 18 Q8 12 12 10 Q18 8 22 14 Q26 18 30 16 Q34 18 38 14 Q42 8 48 10 Q52 12 50 18 Q44 28 30 38Z" fill="#f9a8d4" stroke="#ec4899" stroke-width="2"/><path d="M30 44 Q20 38 16 30 Q14 24 18 22 Q22 22 24 26 Q27 30 30 28 Q33 30 36 26 Q38 22 42 22 Q46 24 44 30 Q40 38 30 44Z" fill="#fce7f3" stroke="#f9a8d4" stroke-width="1.5"/><ellipse cx="30" cy="44" rx="5" ry="14" fill="#7c3aed" stroke="#4c1d95" stroke-width="2.5"/><circle cx="30" cy="30" r="6.5" fill="#6d28d9" stroke="#4c1d95" stroke-width="2"/><circle cx="27" cy="28" r="3.5" fill="white" stroke="#1a0a00" stroke-width="1.5"/><circle cx="33" cy="28" r="3.5" fill="white" stroke="#1a0a00" stroke-width="1.5"/><circle cx="27" cy="28" r="1.8" fill="#1a0a00"/><circle cx="33" cy="28" r="1.8" fill="#1a0a00"/><circle cx="26.5" cy="27" r="0.8" fill="white"/><circle cx="32.5" cy="27" r="0.8" fill="white"/><ellipse cx="28" cy="26" rx="5" ry="2.5" fill="white" opacity="0.3"/></svg>'
   ],
   lbl:['Twijfelachtig Eitje','Trage Rups','Zwijgende Cocon','Bijna-Vlinder','Prachtige Vlinder'],
   desc:['Twijfelt of het de moeite waard is. Doet het toch.','Eet bladzijden studie-materiaal. Letterlijk.','Slaapt, maar denkt tegelijkertijd na. Multitasken.','Vleugels groeien al. Nog even geduld.','Danst door de examenzaal. De surveillant is ontroerd.'],
   evoMsg:['🐛 Je Vlinder kruipt! Langzaam maar zeker.','🫘 Je Vlinder zit in de cocon. Ssh, niet storen.','🐚 Vleugels groeien... nog even...','🦋 JE VLINDER IS ER! Ze danst door de examenzaal!']},
  {id:'tijger', n:'Tijger', s:['','','','',''], fallback:['🐾','🐱','🐈','🐅','🐯'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="19" cy="20" rx="7" ry="11" fill="#f97316" stroke="#c2410c" stroke-width="2.5" transform="rotate(-15,19,20)"/><ellipse cx="41" cy="20" rx="7" ry="11" fill="#f97316" stroke="#c2410c" stroke-width="2.5" transform="rotate(15,41,20)"/><ellipse cx="19" cy="20" rx="4" ry="7" fill="#fde68a" transform="rotate(-15,19,20)"/><ellipse cx="41" cy="20" rx="4" ry="7" fill="#fde68a" transform="rotate(15,41,20)"/><circle cx="30" cy="36" r="19" fill="#fb923c" stroke="#c2410c" stroke-width="3"/><ellipse cx="30" cy="44" rx="12" ry="8" fill="#fde68a" stroke="#f97316" stroke-width="1.5"/><circle cx="22" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="30" r="3.5" fill="#15803d"/><circle cx="38" cy="30" r="3.5" fill="#15803d"/><circle cx="22" cy="30" r="1.8" fill="#1a0a00"/><circle cx="38" cy="30" r="1.8" fill="#1a0a00"/><circle cx="21" cy="29" r="1" fill="white"/><circle cx="37" cy="29" r="1" fill="white"/><ellipse cx="30" cy="40" rx="3" ry="2" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="23" cy="25" rx="7" ry="4" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="17" cy="16" rx="7" ry="13" fill="#f97316" stroke="#c2410c" stroke-width="2" transform="rotate(-12,17,16)"/><ellipse cx="43" cy="16" rx="7" ry="13" fill="#f97316" stroke="#c2410c" stroke-width="2" transform="rotate(12,43,16)"/><ellipse cx="17" cy="16" rx="4" ry="8" fill="#fde68a" transform="rotate(-12,17,16)"/><ellipse cx="43" cy="16" rx="4" ry="8" fill="#fde68a" transform="rotate(12,43,16)"/><circle cx="30" cy="34" r="20" fill="#f97316" stroke="#c2410c" stroke-width="3"/><ellipse cx="30" cy="44" rx="13" ry="9" fill="#fde68a" stroke="#f97316" stroke-width="1.5"/><path d="M18 22 L16 32" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round"/><path d="M22 20 L20 30" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round"/><path d="M42 22 L44 32" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round"/><path d="M38 20 L40 30" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round"/><circle cx="22" cy="29" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="29" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="29" r="3.5" fill="#15803d"/><circle cx="38" cy="29" r="3.5" fill="#15803d"/><circle cx="22" cy="29" r="1.8" fill="#1a0a00"/><circle cx="38" cy="29" r="1.8" fill="#1a0a00"/><circle cx="21" cy="28" r="1" fill="white"/><circle cx="37" cy="28" r="1" fill="white"/><ellipse cx="30" cy="40" rx="3.5" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="22" cy="24" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="15" cy="15" rx="7" ry="13" fill="#ea580c" stroke="#c2410c" stroke-width="2.5" transform="rotate(-10,15,15)"/><ellipse cx="45" cy="15" rx="7" ry="13" fill="#ea580c" stroke="#c2410c" stroke-width="2.5" transform="rotate(10,45,15)"/><ellipse cx="15" cy="15" rx="4" ry="8" fill="#fde68a" transform="rotate(-10,15,15)"/><ellipse cx="45" cy="15" rx="4" ry="8" fill="#fde68a" transform="rotate(10,45,15)"/><circle cx="30" cy="33" r="21" fill="#ea580c" stroke="#c2410c" stroke-width="3"/><ellipse cx="30" cy="43" rx="14" ry="10" fill="#fde68a" stroke="#f97316" stroke-width="1.5"/><path d="M16 19 L13 30" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/><path d="M20 16 L18 28" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/><path d="M44 19 L47 30" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/><path d="M40 16 L42 28" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/><circle cx="22" cy="28" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="28" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="28" r="4" fill="#dc2626"/><circle cx="38" cy="28" r="4" fill="#dc2626"/><circle cx="22" cy="28" r="2" fill="#1a0a00"/><circle cx="38" cy="28" r="2" fill="#1a0a00"/><circle cx="21" cy="27" r="1" fill="white"/><circle cx="37" cy="27" r="1" fill="white"/><ellipse cx="30" cy="39" rx="4" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><ellipse cx="22" cy="23" rx="9" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="13" cy="12" rx="7" ry="13" fill="#c2410c" stroke="#7c2d12" stroke-width="2.5" transform="rotate(-8,13,12)"/><ellipse cx="47" cy="12" rx="7" ry="13" fill="#c2410c" stroke="#7c2d12" stroke-width="2.5" transform="rotate(8,47,12)"/><ellipse cx="13" cy="12" rx="4" ry="8" fill="#fde68a" transform="rotate(-8,13,12)"/><ellipse cx="47" cy="12" rx="4" ry="8" fill="#fde68a" transform="rotate(8,47,12)"/><circle cx="30" cy="32" r="22" fill="#c2410c" stroke="#7c2d12" stroke-width="3"/><ellipse cx="30" cy="44" rx="15" ry="10" fill="#fde68a" stroke="#f97316" stroke-width="2"/><path d="M14 18 L11 30" stroke="#7c2d12" stroke-width="3.5" stroke-linecap="round"/><path d="M18 14 L16 28" stroke="#7c2d12" stroke-width="3.5" stroke-linecap="round"/><path d="M46 18 L49 30" stroke="#7c2d12" stroke-width="3.5" stroke-linecap="round"/><path d="M42 14 L44 28" stroke="#7c2d12" stroke-width="3.5" stroke-linecap="round"/><circle cx="21" cy="27" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="27" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="27" r="4.5" fill="#dc2626"/><circle cx="39" cy="27" r="4.5" fill="#dc2626"/><circle cx="21" cy="27" r="2.2" fill="#1a0a00"/><circle cx="39" cy="27" r="2.2" fill="#1a0a00"/><circle cx="20" cy="26" r="1.2" fill="white"/><circle cx="38" cy="26" r="1.2" fill="white"/><ellipse cx="30" cy="40" rx="4.5" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><ellipse cx="22" cy="21" rx="10" ry="4.5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M12 10 L16 3 L20 10 L24 4 L30 10 L36 4 L40 10 L44 3 L48 10Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><ellipse cx="11" cy="11" rx="7" ry="13" fill="#7c2d12" stroke="#1a0a00" stroke-width="2.5" transform="rotate(-8,11,11)"/><ellipse cx="49" cy="11" rx="7" ry="13" fill="#7c2d12" stroke="#1a0a00" stroke-width="2.5" transform="rotate(8,49,11)"/><ellipse cx="11" cy="11" rx="4" ry="8" fill="#fde68a" transform="rotate(-8,11,11)"/><ellipse cx="49" cy="11" rx="4" ry="8" fill="#fde68a" transform="rotate(8,49,11)"/><circle cx="30" cy="32" r="23" fill="#7c2d12" stroke="#1a0a00" stroke-width="3"/><ellipse cx="30" cy="44" rx="16" ry="11" fill="#fde68a" stroke="#f97316" stroke-width="2"/><path d="M12 17 L9 30" stroke="#f97316" stroke-width="4" stroke-linecap="round"/><path d="M17 13 L15 28" stroke="#f97316" stroke-width="4" stroke-linecap="round"/><path d="M48 17 L51 30" stroke="#f97316" stroke-width="4" stroke-linecap="round"/><path d="M43 13 L45 28" stroke="#f97316" stroke-width="4" stroke-linecap="round"/><circle cx="20" cy="27" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="40" cy="27" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="20" cy="27" r="5" fill="#f97316"/><circle cx="40" cy="27" r="5" fill="#f97316"/><circle cx="20" cy="27" r="2.5" fill="#1a0a00"/><circle cx="40" cy="27" r="2.5" fill="#1a0a00"/><circle cx="19" cy="26" r="1.2" fill="white"/><circle cx="39" cy="26" r="1.2" fill="white"/><ellipse cx="22" cy="21" rx="11" ry="5" fill="white" opacity="0.18"/></svg>'
   ],
   lbl:['Schuchtere Welp','Nieuwsgierig Katje','Gestreepte Puber','Sluipende Tijger','Opper-Tijger'],
   desc:['Verschuilt zich achter de samenvatting.','Speelt met de flashcards. Kauwt er ook op.','Heeft strepen. Denkt dat het cool is.','Sluipt onhoorbaar door de examenstof.','Sprintt naar een 10 en kijkt niet meer om.'],
   evoMsg:['🐱 Je Tijger miauwt stoer! (Het is schattig.)','🐈 Je Tijger heeft zijn eerste strepen!','🐅 SLUIPENDE TIJGER! De examenvragen weten niet wat ze te wachten staat.','🐯 OPPER-TIJGER! BRULLLLL!']},
  {id:'haai', n:'Haai', s:['','','','',''], fallback:['🦠','🐟','🐠','🦈','🦈'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="36" rx="20" ry="12" fill="#7dd3fc" stroke="#0369a1" stroke-width="3"/><path d="M52 36 Q58 30 58 36 Q56 42 52 40Z" fill="#7dd3fc" stroke="#0369a1" stroke-width="2"/><circle cx="22" cy="32" r="5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="32" r="3" fill="#1a0a00"/><circle cx="21.5" cy="31" r="1" fill="white"/><path d="M28 36 L24 40 L32 40 L36 36" fill="white" stroke="#0369a1" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="36" cy="30" rx="9" ry="4" fill="white" opacity="0.25"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M22 18 Q30 12 30 18Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/><ellipse cx="32" cy="34" rx="22" ry="14" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/><path d="M54 34 Q60 26 60 34 Q58 42 54 40Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/><ellipse cx="32" cy="40" rx="16" ry="8" fill="#bae6fd" stroke="#7dd3fc" stroke-width="1.5"/><circle cx="20" cy="30" r="5.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="20" cy="30" r="3.5" fill="#0c4a6e"/><circle cx="20" cy="30" r="1.8" fill="#1a0a00"/><circle cx="19.5" cy="29" r="1" fill="white"/><path d="M26 36 L22 41 L30 41 L34 36" fill="white" stroke="#0284c7" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="38" cy="26" rx="10" ry="5" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M20 16 Q28 8 30 16Z" fill="#0ea5e9" stroke="#0284c7" stroke-width="2.5"/><path d="M36 14 Q42 8 44 16Z" fill="#0ea5e9" stroke="#0284c7" stroke-width="2"/><ellipse cx="32" cy="33" rx="24" ry="15" fill="#0ea5e9" stroke="#0284c7" stroke-width="3"/><path d="M56 33 Q62 24 62 33 Q60 42 56 40Z" fill="#0ea5e9" stroke="#0284c7" stroke-width="2"/><ellipse cx="32" cy="40" rx="18" ry="9" fill="#7dd3fc" stroke="#38bdf8" stroke-width="1.5"/><circle cx="18" cy="29" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="18" cy="29" r="4" fill="#0c4a6e"/><circle cx="18" cy="29" r="2" fill="#1a0a00"/><circle cx="17.5" cy="28" r="1" fill="white"/><path d="M24 36 L20 42 L28 42 L32 36" fill="white" stroke="#0284c7" stroke-width="2" stroke-linejoin="round"/><ellipse cx="38" cy="24" rx="12" ry="5" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M18 12 Q28 4 30 12Z" fill="#475569" stroke="#334155" stroke-width="2.5"/><ellipse cx="32" cy="32" rx="26" ry="17" fill="#475569" stroke="#334155" stroke-width="3"/><path d="M58 32 Q64 22 64 32 Q62 42 58 40Z" fill="#475569" stroke="#334155" stroke-width="2"/><ellipse cx="32" cy="42" rx="20" ry="10" fill="#94a3b8" stroke="#64748b" stroke-width="1.5"/><circle cx="16" cy="28" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="16" cy="28" r="4.5" fill="#0f172a"/><circle cx="15.5" cy="27" r="1.5" fill="white"/><path d="M22 38 L18 44 L26 44 L30 38" fill="white" stroke="#334155" stroke-width="2" stroke-linejoin="round"/><path d="M30 44 L34 50 L38 44" fill="white" stroke="#334155" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="38" cy="22" rx="13" ry="6" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M16 8 Q28 0 30 8Z" fill="#334155" stroke="#1e293b" stroke-width="2.5"/><ellipse cx="33" cy="30" rx="28" ry="20" fill="#334155" stroke="#1e293b" stroke-width="3"/><path d="M61 30 Q68 18 68 30 Q66 42 61 40Z" fill="#334155" stroke="#1e293b" stroke-width="2"/><ellipse cx="33" cy="43" rx="22" ry="12" fill="#64748b" stroke="#475569" stroke-width="2"/><circle cx="14" cy="27" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="14" cy="27" r="5.5" fill="#0f172a"/><circle cx="13.5" cy="25.5" r="2" fill="white"/><path d="M20 38 L16 46 L26 46 L30 38" fill="white" stroke="#1e293b" stroke-width="2.5" stroke-linejoin="round"/><path d="M30 46 L34 52 L38 46 L42 52 L46 46" fill="white" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/><circle cx="46" cy="10" r="5" fill="#fbbf24" stroke="#b45309" stroke-width="2"/><path d="M44 8 L46 4 L48 8" fill="#fbbf24" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="40" cy="20" rx="14" ry="6" fill="white" opacity="0.15"/></svg>'
   ],
   lbl:['Micro-Organisme','Bangelijk Visje','Tropisch Toerist','Jonge Haai','Grote Witte Examendoder'],
   desc:['Zo klein dat niemand je ziet. Voordeel bij tentamens.','Zwemt in cirkels rond de studiezaal.','Kleurrijk maar nog steeds geen antwoord op vraag 3.','Bijt alvast in de examenbundel. Ter voorbereiding.','Elke vraag is voedsel. Verslindt ze allemaal.'],
   evoMsg:['🐟 Je Haai zwemt! Een beetje wiebelig nog.','🐠 Je Haai is tropisch! Nog niet gevaarlijk, wel mooi.','🦈 JE HAAI HAS ARRIVED! DUM DUM DUM DUM DUM DUM...','🦈🦈 GROTE WITTE EXAMENDODER ONTGRENDELD! Vrees het water.']},
  {id:'olifant', n:'Olifant', s:['','','','',''], fallback:['🐾','🦔','🦛','🐘','🦣'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="36" r="16" fill="#94a3b8" stroke="#475569" stroke-width="3"/><ellipse cx="21" cy="24" rx="8" ry="13" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><ellipse cx="39" cy="24" rx="8" ry="13" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><path d="M26 44 Q24 52 22 56" stroke="#cbd5e1" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="23" cy="32" r="5.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="37" cy="32" r="5.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="23" cy="32" r="3.5" fill="#1a0a00"/><circle cx="37" cy="32" r="3.5" fill="#1a0a00"/><circle cx="22.5" cy="31" r="1.2" fill="white"/><circle cx="36.5" cy="31" r="1.2" fill="white"/><ellipse cx="25" cy="28" rx="8" ry="4" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="17" cy="22" rx="9" ry="14" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><ellipse cx="43" cy="22" rx="9" ry="14" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><circle cx="30" cy="35" r="19" fill="#94a3b8" stroke="#475569" stroke-width="3"/><path d="M23 46 Q21 54 20 58" stroke="#cbd5e1" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="23" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="37" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="23" cy="30" r="3.5" fill="#1a0a00"/><circle cx="37" cy="30" r="3.5" fill="#1a0a00"/><circle cx="22.5" cy="29" r="1.2" fill="white"/><circle cx="36.5" cy="29" r="1.2" fill="white"/><ellipse cx="24" cy="25" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="13" cy="22" rx="10" ry="15" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><ellipse cx="47" cy="22" rx="10" ry="15" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><circle cx="30" cy="35" r="21" fill="#94a3b8" stroke="#475569" stroke-width="3"/><path d="M21 46 Q19 54 18 58" stroke="#cbd5e1" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M21 44 Q14 48 8 44" stroke="#e2e8f0" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="22" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="29" r="4" fill="#1a0a00"/><circle cx="38" cy="29" r="4" fill="#1a0a00"/><circle cx="21.5" cy="28" r="1.5" fill="white"/><circle cx="37.5" cy="28" r="1.5" fill="white"/><ellipse cx="23" cy="24" rx="9" ry="4.5" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="22" rx="10" ry="16" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><ellipse cx="50" cy="22" rx="10" ry="16" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><circle cx="30" cy="34" r="23" fill="#94a3b8" stroke="#475569" stroke-width="3"/><path d="M20 48 Q18 56 16 60" stroke="#cbd5e1" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M20 45 Q12 50 6 46" stroke="#e2e8f0" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M40 45 Q48 50 54 46" stroke="#e2e8f0" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="21" cy="27" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="27" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="27" r="4.5" fill="#1a0a00"/><circle cx="39" cy="27" r="4.5" fill="#1a0a00"/><circle cx="20.5" cy="26" r="1.8" fill="white"/><circle cx="38.5" cy="26" r="1.8" fill="white"/><ellipse cx="22" cy="22" rx="10" ry="5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M12 8 L16 2 L20 8 L24 3 L30 8 L36 3 L40 8 L44 2 L48 8Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><ellipse cx="8" cy="22" rx="10" ry="17" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/><ellipse cx="52" cy="22" rx="10" ry="17" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/><circle cx="30" cy="33" r="24" fill="#e2e8f0" stroke="#94a3b8" stroke-width="3"/><path d="M18 48 Q16 56 14 60" stroke="#f8fafc" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M18 44 Q10 50 4 46" stroke="#f8fafc" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M42 44 Q50 50 56 46" stroke="#f8fafc" stroke-width="4.5" fill="none" stroke-linecap="round"/><circle cx="20" cy="26" r="8" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="40" cy="26" r="8" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="20" cy="26" r="5" fill="#1a0a00"/><circle cx="40" cy="26" r="5" fill="#1a0a00"/><circle cx="19.5" cy="25" r="2" fill="white"/><circle cx="39.5" cy="25" r="2" fill="white"/><ellipse cx="22" cy="21" rx="11" ry="5" fill="white" opacity="0.18"/></svg>'
   ],
   lbl:['Prikkelend Egeltje','Dikhuidige Leerling','Kolossale Olifant','Prehistorische Mammoet','Tijdloze Mammoet'],
   desc:['Prikkt bij moeilijke vragen. Zacht maar aanwezig.','Dik genoeg om alles te onthouden. Vergeet nooit.','Geheugen van een olifant. Herinnert elk antwoord.','Ouder dan de meeste examenvragen. Wijzer ook.','Bestond al voor het eindexamen. Zal er ook na zijn.'],
   evoMsg:['🦔 Je Olifant begint als egeltje! Stekelig maar lief.','🦛 Je Olifant wordt ENORM! Past niet meer door de deur.','🐘 OLIFANT! Vergeet nooit meer een formule.','🦣 MAMMOET! Bevroren in kennis. Voor altijd.']},
  {id:'eenhoorn', n:'Eenhoorn', s:['','','','',''], fallback:['🐾','🐴','🐎','🏇','🦄'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M15 18 Q12 28 13 38 Q16 50 30 52 Q44 50 47 38 Q48 28 45 18 Q40 8 30 8 Q20 8 15 18Z" fill="#fef9ee" stroke="#d4b896" stroke-width="2.5"/><ellipse cx="30" cy="47" rx="11" ry="6" fill="#f0d9c8" stroke="#d4b896" stroke-width="1.5"/><path d="M16 16 L11 4 L25 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M17 15 L13 6 L24 11Z" fill="#fda4af"/><path d="M44 16 L49 4 L35 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M43 15 L47 6 L36 11Z" fill="#fda4af"/><path d="M26 10 Q21 18 19 26" stroke="#fde68a" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.8"/><ellipse cx="21" cy="29" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="39" cy="29" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="21" cy="29" rx="3.5" ry="4.5" fill="#7c3aed"/><ellipse cx="39" cy="29" rx="3.5" ry="4.5" fill="#7c3aed"/><ellipse cx="21" cy="29" rx="1.8" ry="2.2" fill="#1a0a00"/><ellipse cx="39" cy="29" rx="1.8" ry="2.2" fill="#1a0a00"/><circle cx="20" cy="27" r="1.2" fill="white"/><circle cx="38" cy="27" r="1.2" fill="white"/><ellipse cx="14" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.4"/><ellipse cx="46" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.4"/><ellipse cx="25" cy="47" rx="3" ry="2" fill="#d4b896"/><ellipse cx="35" cy="47" rx="3" ry="2" fill="#d4b896"/><path d="M25 51 Q30 54 35 51" stroke="#d4b896" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M15 18 Q12 28 13 38 Q16 50 30 52 Q44 50 47 38 Q48 28 45 18 Q40 8 30 8 Q20 8 15 18Z" fill="#fef9ee" stroke="#d4b896" stroke-width="2.5"/><ellipse cx="30" cy="47" rx="11" ry="6" fill="#f0d9c8" stroke="#d4b896" stroke-width="1.5"/><path d="M16 16 L11 4 L25 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M17 15 L13 6 L24 11Z" fill="#fda4af"/><path d="M44 16 L49 4 L35 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M43 15 L47 6 L36 11Z" fill="#fda4af"/><ellipse cx="30" cy="8" rx="3.5" ry="4" fill="#fde68a" stroke="#d97706" stroke-width="1.5"/><path d="M26 10 Q19 20 17 28" stroke="#fbbf24" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M28 9 Q23 18 21 26" stroke="#f9a8d4" stroke-width="4" stroke-linecap="round" fill="none"/><ellipse cx="21" cy="29" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="39" cy="29" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="21" cy="29" rx="3.5" ry="4.5" fill="#7c3aed"/><ellipse cx="39" cy="29" rx="3.5" ry="4.5" fill="#7c3aed"/><ellipse cx="21" cy="29" rx="1.8" ry="2.2" fill="#1a0a00"/><ellipse cx="39" cy="29" rx="1.8" ry="2.2" fill="#1a0a00"/><circle cx="20" cy="27" r="1.2" fill="white"/><circle cx="38" cy="27" r="1.2" fill="white"/><ellipse cx="14" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.4"/><ellipse cx="46" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.4"/><ellipse cx="25" cy="47" rx="3" ry="2" fill="#d4b896"/><ellipse cx="35" cy="47" rx="3" ry="2" fill="#d4b896"/><path d="M25 51 Q30 54 35 51" stroke="#d4b896" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M15 18 Q12 28 13 38 Q16 50 30 52 Q44 50 47 38 Q48 28 45 18 Q40 8 30 8 Q20 8 15 18Z" fill="#fef9ee" stroke="#d4b896" stroke-width="2.5"/><ellipse cx="30" cy="47" rx="11" ry="6" fill="#f0d9c8" stroke="#d4b896" stroke-width="1.5"/><path d="M16 16 L11 3 L25 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M17 15 L13 5 L24 11Z" fill="#f472b6"/><path d="M44 16 L49 3 L35 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M43 15 L47 5 L36 11Z" fill="#c084fc"/><polygon points="30,1 27,12 33,12" fill="#fde68a" stroke="#d97706" stroke-width="2"/><path d="M30 1 Q28 6 30 12" stroke="#fb923c" stroke-width="2" fill="none" opacity="0.85"/><path d="M25 10 Q17 22 15 32" stroke="#f472b6" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M27 9 Q21 20 19 30" stroke="#c084fc" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M13 18 Q3 30 5 44" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" fill="none"/><ellipse cx="21" cy="28" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="39" cy="28" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="21" cy="28" rx="3.5" ry="4.5" fill="#a855f7"/><ellipse cx="39" cy="28" rx="3.5" ry="4.5" fill="#a855f7"/><ellipse cx="21" cy="28" rx="1.8" ry="2.2" fill="#1a0a00"/><ellipse cx="39" cy="28" rx="1.8" ry="2.2" fill="#1a0a00"/><circle cx="20" cy="26" r="1.2" fill="white"/><circle cx="38" cy="26" r="1.2" fill="white"/><ellipse cx="14" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.4"/><ellipse cx="46" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.4"/><ellipse cx="25" cy="47" rx="3" ry="2" fill="#d4b896"/><ellipse cx="35" cy="47" rx="3" ry="2" fill="#d4b896"/><path d="M25 51 Q30 54 35 51" stroke="#d4b896" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="14" r="1.5" fill="#fbbf24"/><circle cx="53" cy="14" r="1.5" fill="#f472b6"/><circle cx="5" cy="9" r="1" fill="#c084fc"/><circle cx="55" cy="9" r="1" fill="#60a5fa"/><path d="M15 18 Q12 28 13 38 Q16 50 30 52 Q44 50 47 38 Q48 28 45 18 Q40 8 30 8 Q20 8 15 18Z" fill="#fef9ee" stroke="#d4b896" stroke-width="2.5"/><ellipse cx="30" cy="47" rx="11" ry="6" fill="#f0d9c8" stroke="#d4b896" stroke-width="1.5"/><path d="M16 16 L10 2 L25 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M17 15 L12 4 L24 11Z" fill="#f472b6"/><path d="M44 16 L50 2 L35 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M43 15 L48 4 L36 11Z" fill="#c084fc"/><polygon points="30,-1 26,13 34,13" fill="#fde68a" stroke="#d97706" stroke-width="2"/><path d="M30 -1 Q27 6 30 13" stroke="#fb923c" stroke-width="2" fill="none" opacity="0.9"/><path d="M30 -1 Q33 6 30 13" stroke="#f472b6" stroke-width="1.5" fill="none" opacity="0.7"/><path d="M24 10 Q14 24 12 36" stroke="#f472b6" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M26 9 Q18 22 16 34" stroke="#fb923c" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M28 8 Q22 20 20 32" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M11 18 Q1 28 2 44" stroke="#c084fc" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M10 22 Q0 32 1 48" stroke="#818cf8" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M49 18 Q59 28 58 44" stroke="#60a5fa" stroke-width="5" stroke-linecap="round" fill="none"/><ellipse cx="21" cy="28" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="39" cy="28" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="21" cy="28" rx="3.5" ry="4.5" fill="#7c3aed"/><ellipse cx="39" cy="28" rx="3.5" ry="4.5" fill="#7c3aed"/><ellipse cx="21" cy="28" rx="1.8" ry="2.2" fill="#1a0a00"/><ellipse cx="39" cy="28" rx="1.8" ry="2.2" fill="#1a0a00"/><circle cx="20" cy="26" r="1.2" fill="white"/><circle cx="38" cy="26" r="1.2" fill="white"/><ellipse cx="14" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.45"/><ellipse cx="46" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.45"/><ellipse cx="25" cy="47" rx="3" ry="2" fill="#d4b896"/><ellipse cx="35" cy="47" rx="3" ry="2" fill="#d4b896"/><path d="M24 51 Q30 55 36 51" stroke="#c084fc" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="1" r="2" fill="#fbbf24"/><circle cx="20" cy="4" r="1.5" fill="#f472b6"/><circle cx="40" cy="4" r="1.5" fill="#a78bfa"/><circle cx="10" cy="10" r="1.5" fill="#60a5fa"/><circle cx="50" cy="10" r="1.5" fill="#4ade80"/><circle cx="5" cy="6" r="1" fill="#fb923c"/><path d="M15 18 Q12 28 13 38 Q16 50 30 52 Q44 50 47 38 Q48 28 45 18 Q40 8 30 8 Q20 8 15 18Z" fill="#fef9ee" stroke="#d4b896" stroke-width="2.5"/><ellipse cx="30" cy="47" rx="11" ry="6" fill="#f0d9c8" stroke="#d4b896" stroke-width="1.5"/><path d="M15 16 L9 2 L24 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M16 15 L11 4 L23 11Z" fill="#f472b6"/><path d="M45 16 L51 2 L36 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M44 15 L49 4 L37 11Z" fill="#c084fc"/><polygon points="30,-3 25,14 35,14" fill="#fde68a" stroke="#d97706" stroke-width="2"/><path d="M30 -3 Q26 5 30 14" stroke="#fb923c" stroke-width="2.5" fill="none" opacity="0.9"/><path d="M30 -3 Q34 5 30 14" stroke="#f472b6" stroke-width="2" fill="none" opacity="0.8"/><path d="M30 -3 Q27 10 30 14" stroke="#a78bfa" stroke-width="1.5" fill="none" opacity="0.7"/><circle cx="30" cy="0" r="2" fill="white" opacity="0.95"/><path d="M23 10 Q12 26 10 38" stroke="#f472b6" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M25 9 Q16 24 14 36" stroke="#fb923c" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M27 8 Q20 22 18 34" stroke="#fbbf24" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M29 8 Q24 20 22 32" stroke="#4ade80" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M11 16 Q0 28 1 44" stroke="#c084fc" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M10 20 Q-1 32 0 48" stroke="#818cf8" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M9 24 Q-2 36 -1 52" stroke="#60a5fa" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M49 16 Q60 28 59 44" stroke="#a78bfa" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M50 20 Q61 32 60 48" stroke="#f9a8d4" stroke-width="5" stroke-linecap="round" fill="none"/><ellipse cx="21" cy="27" rx="6" ry="7" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="39" cy="27" rx="6" ry="7" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="21" cy="27" rx="4" ry="5.5" fill="#6d28d9"/><ellipse cx="39" cy="27" rx="4" ry="5.5" fill="#6d28d9"/><ellipse cx="21" cy="27" rx="2" ry="2.8" fill="#1a0a00"/><ellipse cx="39" cy="27" rx="2" ry="2.8" fill="#1a0a00"/><circle cx="20" cy="25" r="1.5" fill="white"/><circle cx="38" cy="25" r="1.5" fill="white"/><ellipse cx="13" cy="37" rx="5" ry="3" fill="#fda4af" opacity="0.5"/><ellipse cx="47" cy="37" rx="5" ry="3" fill="#fda4af" opacity="0.5"/><ellipse cx="25" cy="47" rx="3" ry="2" fill="#d4b896"/><ellipse cx="35" cy="47" rx="3" ry="2" fill="#d4b896"/><path d="M23 51 Q30 56 37 51" stroke="#c084fc" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>'
   ],
   lbl:['Verlegen Veulen','Gewoon Paard','Ongeduldig Renpaard','Racend naar de Finish','Magisch Eenhoorn'],
   desc:['Wil eigenlijk al een eenhoorn zijn. Heeft geduld.','100% paard. 0% magie. Werkt hard ter compensatie.','Rent harder dan de tijd. Haalt deadlines dus altijd.','Stof vliegt op. Surveillant moet wegkijken.','Spreidt sprankels over het examenpapier. Slaagt altijd.'],
   evoMsg:['🐴 Je Eenhoorn dribbelt al! Nog geen hoorn maar goed.','🐎 Je Eenhoorn galoppeeert! De maan is het doel.','🏇 RENPAARD! Sprint naar die 10 als de wind!','🦄 MAGISCH EENHOORN ONTGRENDELD! Regenbogen en alles.']},
  {id:'vos', n:'Vos', s:['','','','',''], fallback:['🐾','🐶','🐕','🦝','🦊'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="19" cy="20" rx="7" ry="11" fill="#fb923c" stroke="#c2410c" stroke-width="2.5" transform="rotate(-15,19,20)"/><ellipse cx="41" cy="20" rx="7" ry="11" fill="#fb923c" stroke="#c2410c" stroke-width="2.5" transform="rotate(15,41,20)"/><ellipse cx="19" cy="20" rx="4" ry="7" fill="#fda4af" transform="rotate(-15,19,20)"/><ellipse cx="41" cy="20" rx="4" ry="7" fill="#fda4af" transform="rotate(15,41,20)"/><circle cx="30" cy="36" r="18" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/><circle cx="22" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="31" r="3.5" fill="#92400e"/><circle cx="38" cy="31" r="3.5" fill="#92400e"/><circle cx="22" cy="31" r="1.8" fill="#1a0a00"/><circle cx="38" cy="31" r="1.8" fill="#1a0a00"/><circle cx="21" cy="30" r="1" fill="white"/><circle cx="37" cy="30" r="1" fill="white"/><ellipse cx="30" cy="39" rx="3" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="23" cy="26" rx="7" ry="4" fill="white" opacity="0.25"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="17" cy="18" rx="7" ry="12" fill="#fb923c" stroke="#c2410c" stroke-width="2" transform="rotate(-12,17,18)"/><ellipse cx="43" cy="18" rx="7" ry="12" fill="#fb923c" stroke="#c2410c" stroke-width="2" transform="rotate(12,43,18)"/><ellipse cx="17" cy="18" rx="4" ry="7" fill="#fda4af" transform="rotate(-12,17,18)"/><ellipse cx="43" cy="18" rx="4" ry="7" fill="#fda4af" transform="rotate(12,43,18)"/><circle cx="30" cy="35" r="19" fill="#f97316" stroke="#c2410c" stroke-width="3"/><ellipse cx="30" cy="44" rx="12" ry="8" fill="#fff7ed" stroke="#fed7aa" stroke-width="1.5"/><circle cx="22" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="30" r="3.5" fill="#92400e"/><circle cx="38" cy="30" r="3.5" fill="#92400e"/><circle cx="22" cy="30" r="1.8" fill="#1a0a00"/><circle cx="38" cy="30" r="1.8" fill="#1a0a00"/><circle cx="21" cy="29" r="1" fill="white"/><circle cx="37" cy="29" r="1" fill="white"/><ellipse cx="30" cy="40" rx="3.5" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="22" cy="25" rx="8" ry="4" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="15" cy="17" rx="7" ry="13" fill="#ea580c" stroke="#c2410c" stroke-width="2.5" transform="rotate(-10,15,17)"/><ellipse cx="45" cy="17" rx="7" ry="13" fill="#ea580c" stroke="#c2410c" stroke-width="2.5" transform="rotate(10,45,17)"/><ellipse cx="15" cy="17" rx="4" ry="8" fill="#fda4af" transform="rotate(-10,15,17)"/><ellipse cx="45" cy="17" rx="4" ry="8" fill="#fda4af" transform="rotate(10,45,17)"/><circle cx="30" cy="34" r="20" fill="#ea580c" stroke="#c2410c" stroke-width="3"/><ellipse cx="30" cy="44" rx="13" ry="9" fill="#fff7ed" stroke="#fed7aa" stroke-width="1.5"/><circle cx="22" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="29" r="4" fill="#fbbf24"/><circle cx="38" cy="29" r="4" fill="#fbbf24"/><circle cx="22" cy="29" r="2" fill="#1a0a00"/><circle cx="38" cy="29" r="2" fill="#1a0a00"/><circle cx="21" cy="28" r="1" fill="white"/><circle cx="37" cy="28" r="1" fill="white"/><ellipse cx="30" cy="40" rx="4" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><ellipse cx="22" cy="24" rx="9" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="13" cy="15" rx="7" ry="13" fill="#92400e" stroke="#78350f" stroke-width="2.5" transform="rotate(-8,13,15)"/><ellipse cx="47" cy="15" rx="7" ry="13" fill="#92400e" stroke="#78350f" stroke-width="2.5" transform="rotate(8,47,15)"/><ellipse cx="13" cy="15" rx="4" ry="8" fill="#d97706" transform="rotate(-8,13,15)"/><ellipse cx="47" cy="15" rx="4" ry="8" fill="#d97706" transform="rotate(8,47,15)"/><circle cx="30" cy="33" r="21" fill="#92400e" stroke="#78350f" stroke-width="3"/><ellipse cx="30" cy="43" rx="14" ry="10" fill="#fde68a" stroke="#d4b8a0" stroke-width="1.5"/><circle cx="22" cy="28" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="28" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="28" r="4.5" fill="#d97706"/><circle cx="38" cy="28" r="4.5" fill="#d97706"/><circle cx="22" cy="28" r="2.2" fill="#1a0a00"/><circle cx="38" cy="28" r="2.2" fill="#1a0a00"/><circle cx="21" cy="27" r="1.2" fill="white"/><circle cx="37" cy="27" r="1.2" fill="white"/><ellipse cx="30" cy="39" rx="4" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><ellipse cx="22" cy="22" rx="10" ry="4.5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="13" rx="7" ry="13" fill="#c2410c" stroke="#7c2d12" stroke-width="2.5" transform="rotate(-6,12,13)"/><ellipse cx="48" cy="13" rx="7" ry="13" fill="#c2410c" stroke="#7c2d12" stroke-width="2.5" transform="rotate(6,48,13)"/><ellipse cx="12" cy="13" rx="4" ry="8" fill="#fde68a" transform="rotate(-6,12,13)"/><ellipse cx="48" cy="13" rx="4" ry="8" fill="#fde68a" transform="rotate(6,48,13)"/><circle cx="30" cy="32" r="22" fill="#c2410c" stroke="#7c2d12" stroke-width="3"/><ellipse cx="30" cy="43" rx="15" ry="10" fill="#fff7ed" stroke="#fed7aa" stroke-width="2"/><circle cx="21" cy="28" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="28" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="28" r="5" fill="#fbbf24"/><circle cx="39" cy="28" r="5" fill="#fbbf24"/><circle cx="21" cy="28" r="2.5" fill="#1a0a00"/><circle cx="39" cy="28" r="2.5" fill="#1a0a00"/><circle cx="20" cy="27" r="1.2" fill="white"/><circle cx="38" cy="27" r="1.2" fill="white"/><ellipse cx="30" cy="40" rx="4.5" ry="3.5" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><path d="M24 46 Q30 51 36 46" stroke="#7c2d12" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="22" rx="11" ry="5" fill="white" opacity="0.18"/></svg>'
   ],
   lbl:['Sluw Welpje','Grappig Puppy','Slimme Hond','Schrandere Wasbeer','Listige Vos'],
   desc:['Kijkt al slim. Weet nog niks, maar kijkt slim.','Blij en dom. Een goede combinatie.','Slimmer dan het eruitziet. Maar dat weet het zelf al.','Wast zijn poten na elke quiz. Hygiënisch.','Overtuigt de examinator dat alles goed was. En dat klopt.'],
   evoMsg:['🐶 Je Vos kwispelt slim! (Strategisch kwispelen.)','🐕 Je Vos wordt slimmer. En het weet dat je dat weet.','🦝 WASBEER MODUS! Wast zijn handen na een perfecte score.','🦊 LISTIGE VOS! Niemand zag de 10 komen. De vos wel.']},
  {id:'uil', n:'Uil', s:['','','','',''], fallback:['🥚','🐣','🐥','🐦','🦉'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="35" rx="15" ry="18" fill="#1e293b" stroke="#334155" stroke-width="3"/><path d="M22 20 L26 14 L30 20" stroke="#fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 20 L34 14 L38 20" stroke="#fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="24" cy="27" rx="6" ry="3.5" fill="#475569" opacity="0.5"/><circle cx="29" cy="31" r="3" fill="#fbbf24" opacity="0.4"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="18" cy="18" rx="6" ry="10" fill="#b45309" stroke="#92400e" stroke-width="2" transform="rotate(-15,18,18)"/><ellipse cx="42" cy="18" rx="6" ry="10" fill="#b45309" stroke="#92400e" stroke-width="2" transform="rotate(15,42,18)"/><ellipse cx="18" cy="18" rx="3.5" ry="6" fill="#fde68a" transform="rotate(-15,18,18)"/><ellipse cx="42" cy="18" rx="3.5" ry="6" fill="#fde68a" transform="rotate(15,42,18)"/><circle cx="30" cy="36" r="18" fill="#d97706" stroke="#92400e" stroke-width="3"/><circle cx="22" cy="30" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="30" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><path d="M17 29 L27 29" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/><path d="M33 29 L43 29" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/><circle cx="22" cy="31" r="3" fill="#1a0a00"/><circle cx="38" cy="31" r="3" fill="#1a0a00"/><circle cx="21.5" cy="30" r="1" fill="white"/><circle cx="37.5" cy="30" r="1" fill="white"/><polygon points="30,36 27.5,40 32.5,40" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/><ellipse cx="24" cy="25" rx="7" ry="4" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="16" rx="6" ry="11" fill="#92400e" stroke="#78350f" stroke-width="2.5" transform="rotate(-12,16,16)"/><ellipse cx="44" cy="16" rx="6" ry="11" fill="#92400e" stroke="#78350f" stroke-width="2.5" transform="rotate(12,44,16)"/><ellipse cx="16" cy="16" rx="3.5" ry="7" fill="#fde68a" transform="rotate(-12,16,16)"/><ellipse cx="44" cy="16" rx="3.5" ry="7" fill="#fde68a" transform="rotate(12,44,16)"/><circle cx="30" cy="34" r="20" fill="#b45309" stroke="#78350f" stroke-width="3"/><circle cx="22" cy="27" r="8" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="27" r="8" fill="white" stroke="#1a0a00" stroke-width="2"/><path d="M16 25 L28 25" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/><path d="M32 25 L44 25" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/><circle cx="22" cy="27" r="5" fill="#fde68a"/><circle cx="38" cy="27" r="5" fill="#fde68a"/><circle cx="22" cy="27" r="3" fill="#1a0a00"/><circle cx="38" cy="27" r="3" fill="#1a0a00"/><circle cx="21.5" cy="26" r="1" fill="white"/><circle cx="37.5" cy="26" r="1" fill="white"/><polygon points="30,34 27.5,38 32.5,38" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/><ellipse cx="23" cy="22" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="14" cy="14" rx="6" ry="11" fill="#78350f" stroke="#1a0a00" stroke-width="2.5" transform="rotate(-10,14,14)"/><ellipse cx="46" cy="14" rx="6" ry="11" fill="#78350f" stroke="#1a0a00" stroke-width="2.5" transform="rotate(10,46,14)"/><ellipse cx="14" cy="14" rx="3.5" ry="7" fill="#d97706" transform="rotate(-10,14,14)"/><ellipse cx="46" cy="14" rx="3.5" ry="7" fill="#d97706" transform="rotate(10,46,14)"/><circle cx="30" cy="33" r="22" fill="#92400e" stroke="#1a0a00" stroke-width="3"/><circle cx="21" cy="26" r="9" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="26" r="9" fill="white" stroke="#1a0a00" stroke-width="2"/><path d="M14 23 L28 23" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/><path d="M32 23 L46 23" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/><circle cx="21" cy="26" r="6" fill="#fde68a"/><circle cx="39" cy="26" r="6" fill="#fde68a"/><circle cx="21" cy="26" r="3.5" fill="#1a0a00"/><circle cx="39" cy="26" r="3.5" fill="#1a0a00"/><circle cx="20.5" cy="25" r="1.2" fill="white"/><circle cx="38.5" cy="25" r="1.2" fill="white"/><polygon points="30,33 27,37 33,37" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/><ellipse cx="23" cy="20" rx="9" ry="4.5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M12 12 L16 4 L20 12 L24 5 L30 12 L36 5 L40 12 L44 4 L48 12Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="6" ry="11" fill="#92400e" stroke="#1a0a00" stroke-width="2" transform="rotate(-10,12,12)"/><ellipse cx="48" cy="12" rx="6" ry="11" fill="#92400e" stroke="#1a0a00" stroke-width="2" transform="rotate(10,48,12)"/><ellipse cx="12" cy="12" rx="3.5" ry="7" fill="#fbbf24" transform="rotate(-10,12,12)"/><ellipse cx="48" cy="12" rx="3.5" ry="7" fill="#fbbf24" transform="rotate(10,48,12)"/><circle cx="30" cy="32" r="23" fill="#78350f" stroke="#1a0a00" stroke-width="3"/><circle cx="21" cy="25" r="10" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="25" r="10" fill="white" stroke="#1a0a00" stroke-width="2"/><path d="M13 22 L29 22" stroke="#1a0a00" stroke-width="3.5" stroke-linecap="round"/><path d="M31 22 L47 22" stroke="#1a0a00" stroke-width="3.5" stroke-linecap="round"/><circle cx="21" cy="25" r="7.5" fill="#fbbf24"/><circle cx="39" cy="25" r="7.5" fill="#fbbf24"/><circle cx="21" cy="25" r="4.5" fill="#1a0a00"/><circle cx="39" cy="25" r="4.5" fill="#1a0a00"/><circle cx="20.5" cy="24" r="1.8" fill="white"/><circle cx="38.5" cy="24" r="1.8" fill="white"/><polygon points="30,33 27,38 33,38" fill="#f97316" stroke="#c2410c" stroke-width="2"/><ellipse cx="23" cy="19" rx="10" ry="5" fill="white" opacity="0.18"/></svg>'
   ],
   lbl:['Nachtelijk Ei','Suf Kuiken','Knipper-Kuiken','Brildrager-Vogel','Alwetende Uil'],
   desc:['Slaapt door de dag. Studeert om 3 uur \'s nachts.','Ziet er moe uit. IS moe. Studeert toch.','Knippert verward bij elke vraag. Geeft altijd het goede antwoord.','Heeft een bril nodig maar weigert dat toe te geven.','Weet het antwoord al voor de vraag gesteld wordt.'],
   evoMsg:['🐣 Je Uil wordt wakker! Om 14:00. Goed geslapen.','🐥 Je Uil knippert van begrip!','🐦 Je Uil ziet ALLES. Zelfs de valkuilvragen.','🦉 ALWETENDE UIL! "Whooo" heeft er een 10? Jij.']},
  {id:'octopus', n:'Octopus', s:['','','','',''], fallback:['🐚','🦐','🦞','🦑','🐙'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="16" fill="#fda4af" stroke="#be185d" stroke-width="3"/><ellipse cx="25" cy="26" rx="6" ry="3.5" fill="white" opacity="0.35"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="26" r="18" fill="#fda4af" stroke="#be185d" stroke-width="3"/><circle cx="23" cy="22" r="5.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="37" cy="22" r="5.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="23" cy="22" r="3" fill="#be185d"/><circle cx="37" cy="22" r="3" fill="#be185d"/><circle cx="23" cy="22" r="1.5" fill="#1a0a00"/><circle cx="37" cy="22" r="1.5" fill="#1a0a00"/><circle cx="22.5" cy="21" r="0.8" fill="white"/><circle cx="36.5" cy="21" r="0.8" fill="white"/><path d="M19 40 Q18 50 16 56" stroke="#fda4af" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M41 40 Q42 50 44 56" stroke="#fda4af" stroke-width="5" stroke-linecap="round" fill="none"/><ellipse cx="24" cy="18" rx="6" ry="3.5" fill="white" opacity="0.3"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="24" r="20" fill="#fb7185" stroke="#be185d" stroke-width="3"/><circle cx="22" cy="20" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="20" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="20" r="3.5" fill="#be185d"/><circle cx="38" cy="20" r="3.5" fill="#be185d"/><circle cx="22" cy="20" r="1.8" fill="#1a0a00"/><circle cx="38" cy="20" r="1.8" fill="#1a0a00"/><circle cx="21.5" cy="19" r="1" fill="white"/><circle cx="37.5" cy="19" r="1" fill="white"/><path d="M14 38 Q12 48 10 56" stroke="#fda4af" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M22 40 Q20 50 18 58" stroke="#fda4af" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M38 40 Q40 50 42 58" stroke="#fda4af" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M46 38 Q48 48 50 56" stroke="#fda4af" stroke-width="5" stroke-linecap="round" fill="none"/><ellipse cx="24" cy="16" rx="8" ry="4" fill="white" opacity="0.25"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="22" r="22" fill="#c026d3" stroke="#86198f" stroke-width="3"/><circle cx="22" cy="18" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="18" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="18" r="4" fill="#9333ea"/><circle cx="38" cy="18" r="4" fill="#9333ea"/><circle cx="22" cy="18" r="2" fill="#1a0a00"/><circle cx="38" cy="18" r="2" fill="#1a0a00"/><circle cx="21.5" cy="17" r="1" fill="white"/><circle cx="37.5" cy="17" r="1" fill="white"/><path d="M10 38 Q6 48 4 58" stroke="#c026d3" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M17 41 Q14 51 12 60" stroke="#c026d3" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M24 42 Q22 52 20 60" stroke="#a21caf" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M36 42 Q38 52 40 60" stroke="#a21caf" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M43 41 Q46 51 48 60" stroke="#c026d3" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M50 38 Q54 48 56 58" stroke="#c026d3" stroke-width="5" stroke-linecap="round" fill="none"/><ellipse cx="23" cy="13" rx="9" ry="4.5" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M14 6 L18 0 L22 6 L26 1 L30 6 L34 1 L38 6 L42 0 L46 6Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><circle cx="30" cy="22" r="22" fill="#7c3aed" stroke="#4c1d95" stroke-width="3"/><circle cx="21" cy="18" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="18" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="18" r="5" fill="#4c1d95"/><circle cx="39" cy="18" r="5" fill="#4c1d95"/><circle cx="21" cy="18" r="2.5" fill="#1a0a00"/><circle cx="39" cy="18" r="2.5" fill="#1a0a00"/><circle cx="20.5" cy="17" r="1.2" fill="white"/><circle cx="38.5" cy="17" r="1.2" fill="white"/><path d="M7 37 Q2 48 0 58" stroke="#7c3aed" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M13 40 Q10 51 8 60" stroke="#6d28d9" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M20 42 Q18 53 16 62" stroke="#7c3aed" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M30 44 Q30 55 30 64" stroke="#4c1d95" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M40 42 Q42 53 44 62" stroke="#7c3aed" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M47 40 Q50 51 52 60" stroke="#6d28d9" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M53 37 Q58 48 60 58" stroke="#7c3aed" stroke-width="5.5" stroke-linecap="round" fill="none"/><ellipse cx="23" cy="13" rx="10" ry="5" fill="white" opacity="0.2"/></svg>'
   ],
   lbl:['Leeg Schelpje','Nerveuze Garnaal','Hummerige Kreeft','Inktspuwende Inktvis','Acht-Armige Meester'],
   desc:['Leeg maar potentievol. Net als jij op dag 1.','Springt schrikachtig omhoog bij elke toets.','Knijpt in zijn klauwen bij open vragen. Doet het goed.','Spuugt inkt als het antwoord fout is. Soms op het papier.','Acht armen, acht vakken tegelijk. Multitasken pro.'],
   evoMsg:['🦐 Je Octopus springt van schrik! Een kleine garnaal.','🦞 Je Octopus knijpt van trots! KNEEP.','🦑 INKTVIS! Spuugt inkt bij fout antwoord. Opletten.','🐙 ACHT ARMEN! Doet 8 vakken tegelijk. Indrukwekkend.']},
  {id:'beer', n:'Beer', s:['','','','',''], fallback:['🐾','🐿️','🦦','🐻','🐻‍❄️'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="21" cy="21" rx="9" ry="10" fill="#a16207" stroke="#78350f" stroke-width="2.5"/><ellipse cx="39" cy="21" rx="9" ry="10" fill="#a16207" stroke="#78350f" stroke-width="2.5"/><circle cx="30" cy="36" r="18" fill="#b45309" stroke="#78350f" stroke-width="3"/><ellipse cx="30" cy="43" rx="10" ry="7" fill="#d97706" stroke="#b45309" stroke-width="1.5"/><circle cx="23" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="37" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="23" cy="31" r="3.5" fill="#1a0a00"/><circle cx="37" cy="31" r="3.5" fill="#1a0a00"/><circle cx="22.5" cy="30" r="1.2" fill="white"/><circle cx="36.5" cy="30" r="1.2" fill="white"/><ellipse cx="30" cy="39" rx="3" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="24" cy="26" rx="7" ry="4" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="19" cy="19" rx="9" ry="11" fill="#92400e" stroke="#78350f" stroke-width="2.5"/><ellipse cx="41" cy="19" rx="9" ry="11" fill="#92400e" stroke="#78350f" stroke-width="2.5"/><circle cx="30" cy="35" r="20" fill="#92400e" stroke="#78350f" stroke-width="3"/><ellipse cx="30" cy="44" rx="12" ry="8" fill="#b45309" stroke="#92400e" stroke-width="1.5"/><circle cx="22" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="30" r="3.5" fill="#1a0a00"/><circle cx="38" cy="30" r="3.5" fill="#1a0a00"/><circle cx="21.5" cy="29" r="1.2" fill="white"/><circle cx="37.5" cy="29" r="1.2" fill="white"/><ellipse cx="30" cy="40" rx="3.5" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="23" cy="25" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="18" rx="9" ry="12" fill="#78350f" stroke="#1a0a00" stroke-width="2.5"/><ellipse cx="44" cy="18" rx="9" ry="12" fill="#78350f" stroke="#1a0a00" stroke-width="2.5"/><circle cx="30" cy="34" r="21" fill="#78350f" stroke="#1a0a00" stroke-width="3"/><ellipse cx="30" cy="45" rx="14" ry="10" fill="#a16207" stroke="#92400e" stroke-width="1.5"/><circle cx="22" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="29" r="4" fill="#1a0a00"/><circle cx="38" cy="29" r="4" fill="#1a0a00"/><circle cx="21.5" cy="28" r="1.5" fill="white"/><circle cx="37.5" cy="28" r="1.5" fill="white"/><ellipse cx="30" cy="41" rx="4" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><ellipse cx="23" cy="23" rx="9" ry="4.5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="14" cy="16" rx="9" ry="13" fill="#1a0a00" stroke="#0c0a09" stroke-width="2.5"/><ellipse cx="46" cy="16" rx="9" ry="13" fill="#1a0a00" stroke="#0c0a09" stroke-width="2.5"/><circle cx="30" cy="33" r="23" fill="#1a0a00" stroke="#0c0a09" stroke-width="3"/><ellipse cx="30" cy="46" rx="16" ry="11" fill="#292524" stroke="#1a0a00" stroke-width="1.5"/><circle cx="21" cy="28" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="28" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="28" r="4.5" fill="#1a0a00"/><circle cx="39" cy="28" r="4.5" fill="#1a0a00"/><circle cx="20.5" cy="27" r="1.8" fill="white"/><circle cx="38.5" cy="27" r="1.8" fill="white"/><ellipse cx="30" cy="43" rx="4.5" ry="3.5" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><ellipse cx="22" cy="22" rx="10" ry="5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M12 10 L16 3 L20 10 L24 4 L30 10 L36 4 L40 10 L44 3 L48 10Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><ellipse cx="12" cy="14" rx="9" ry="13" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/><ellipse cx="48" cy="14" rx="9" ry="13" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/><circle cx="30" cy="32" r="23" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/><ellipse cx="30" cy="45" rx="16" ry="12" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1.5"/><circle cx="21" cy="27" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="27" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="27" r="5" fill="#1e293b"/><circle cx="39" cy="27" r="5" fill="#1e293b"/><circle cx="20.5" cy="26" r="2" fill="white"/><circle cx="38.5" cy="26" r="2" fill="white"/><ellipse cx="30" cy="42" rx="4.5" ry="3.5" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><ellipse cx="22" cy="21" rx="11" ry="5" fill="white" opacity="0.2"/></svg>'
   ],
   lbl:['Piepklein Welp','Nootjes-Eekhoorn','Relaxte Otter','Slaperige Beer','IJskoude IJsbeer'],
   desc:['Wil eigenlijk alleen maar slapen. Selectief studeren.','Hamstert kennis voor de winter (het examen).','Ligt op zijn rug en denkt na. Werkt verrassend goed.','Slaap-oefenen is ook oefenen. Toch?','IJskoud kalm bij elk examen. De kou heeft hem gehard.'],
   evoMsg:['🐿️ Je Beer begint als eekhoorn! Hamstert kennis.','🦦 Je Beer lounget als een otter. Ontspannen maar scherp.','🐻 BEER WAKKER! Heeft gewinterd en is er klaar voor.','🐻‍❄️ IJSBEER! Bevriest de examenangst. Letterlijk.']},
  {id:'slang', n:'Slang', s:['','','','',''], fallback:['🥚','🐛','🦎','🐍','🐉'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="35" rx="17" ry="21" fill="#f0fdf4" stroke="#86efac" stroke-width="2.5"/><ellipse cx="22" cy="22" rx="7" ry="4" fill="white" opacity="0.6"/><path d="M30 14 L28 20 L32 25 L27 32" stroke="#4ade80" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="24" cy="36" rx="3.5" ry="3" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/><ellipse cx="24" cy="36" rx="0.8" ry="2.5" fill="#14532d"/><ellipse cx="36" cy="36" rx="3.5" ry="3" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/><ellipse cx="36" cy="36" rx="0.8" ry="2.5" fill="#14532d"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="33" rx="18" ry="16" fill="#86efac" stroke="#16a34a" stroke-width="2.5"/><ellipse cx="20" cy="24" rx="8" ry="4" fill="white" opacity="0.28"/><circle cx="25" cy="36" r="1.5" fill="#4ade80" opacity="0.7"/><circle cx="30" cy="38" r="1.5" fill="#4ade80" opacity="0.7"/><circle cx="35" cy="36" r="1.5" fill="#4ade80" opacity="0.7"/><circle cx="22" cy="27" r="5.5" fill="white" stroke="#15803d" stroke-width="1.5"/><circle cx="38" cy="27" r="5.5" fill="white" stroke="#15803d" stroke-width="1.5"/><ellipse cx="22" cy="27" rx="1.2" ry="4" fill="#14532d"/><ellipse cx="38" cy="27" rx="1.2" ry="4" fill="#14532d"/><circle cx="21" cy="25" r="1.2" fill="white"/><circle cx="37" cy="25" r="1.2" fill="white"/><path d="M28 44 L30 48 L32 44" stroke="#f87171" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M12 42 Q9 28 16 16 Q22 8 30 7 Q38 8 44 16 Q51 28 48 42 Q42 54 30 55 Q18 54 12 42Z" fill="#4ade80" stroke="#16a34a" stroke-width="2.5"/><ellipse cx="21" cy="18" rx="9" ry="4" fill="white" opacity="0.22"/><path d="M14 34 Q22 30 30 32 Q38 30 46 34" stroke="#22c55e" stroke-width="1.2" fill="none" opacity="0.55"/><path d="M14 40 Q22 36 30 38 Q38 36 46 40" stroke="#22c55e" stroke-width="1.2" fill="none" opacity="0.55"/><circle cx="22" cy="25" r="6.5" fill="white" stroke="#14532d" stroke-width="1.5"/><circle cx="38" cy="25" r="6.5" fill="white" stroke="#14532d" stroke-width="1.5"/><circle cx="22" cy="25" r="4" fill="#fde68a"/><circle cx="38" cy="25" r="4" fill="#fde68a"/><ellipse cx="22" cy="25" rx="1.3" ry="3.5" fill="#14532d"/><ellipse cx="38" cy="25" rx="1.3" ry="3.5" fill="#14532d"/><circle cx="21" cy="23" r="1.2" fill="white"/><circle cx="37" cy="23" r="1.2" fill="white"/><path d="M27 44 L29 50 L31 44 L33 50 L35 44" stroke="#ef4444" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M8 44 Q6 26 14 14 Q22 4 34 4 Q46 4 52 16 Q58 30 56 44 Q48 58 30 58 Q12 58 8 44Z" fill="#22c55e" stroke="#15803d" stroke-width="2.5"/><ellipse cx="20" cy="16" rx="10" ry="4.5" fill="white" opacity="0.18"/><path d="M10 36 Q20 31 30 33 Q40 31 50 36" stroke="#16a34a" stroke-width="1.5" fill="none" opacity="0.6"/><path d="M10 42 Q20 37 30 39 Q40 37 50 42" stroke="#16a34a" stroke-width="1.5" fill="none" opacity="0.6"/><path d="M12 30 Q20 26 28 28" stroke="#16a34a" stroke-width="1.5" fill="none" opacity="0.6"/><path d="M32 28 Q40 26 48 30" stroke="#16a34a" stroke-width="1.5" fill="none" opacity="0.6"/><circle cx="21" cy="24" r="7" fill="white" stroke="#14532d" stroke-width="1.5"/><circle cx="39" cy="24" r="7" fill="white" stroke="#14532d" stroke-width="1.5"/><circle cx="21" cy="24" r="5" fill="#f59e0b"/><circle cx="39" cy="24" r="5" fill="#f59e0b"/><ellipse cx="21" cy="24" rx="1.5" ry="4.5" fill="#14532d"/><ellipse cx="39" cy="24" rx="1.5" ry="4.5" fill="#14532d"/><circle cx="20" cy="22" r="1.4" fill="white"/><circle cx="38" cy="22" r="1.4" fill="white"/><circle cx="27" cy="38" r="1.2" fill="#15803d"/><circle cx="33" cy="38" r="1.2" fill="#15803d"/><path d="M25 46 L27 53 L30 46 L33 53 L35 46" stroke="#ef4444" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M6 44 Q4 24 14 12 Q22 2 34 2 Q46 2 54 14 Q60 28 58 44 Q50 60 30 60 Q10 60 6 44Z" fill="#166534" stroke="#14532d" stroke-width="3"/><path d="M18 14 L20 4 L24 14Z" fill="#15803d" stroke="#14532d" stroke-width="1.5"/><path d="M36 8 L40 3 L44 10Z" fill="#15803d" stroke="#14532d" stroke-width="1.5"/><ellipse cx="20" cy="16" rx="10" ry="4.5" fill="white" opacity="0.12"/><path d="M8 36 Q20 30 30 33 Q40 30 52 36" stroke="#15803d" stroke-width="1.5" fill="none" opacity="0.7"/><path d="M8 42 Q20 37 30 40 Q40 37 52 42" stroke="#15803d" stroke-width="1.5" fill="none" opacity="0.7"/><path d="M10 28 Q20 24 28 26" stroke="#15803d" stroke-width="1.5" fill="none" opacity="0.7"/><path d="M32 26 Q40 24 50 28" stroke="#15803d" stroke-width="1.5" fill="none" opacity="0.7"/><circle cx="20" cy="24" r="8" fill="white" stroke="#14532d" stroke-width="2"/><circle cx="40" cy="24" r="8" fill="white" stroke="#14532d" stroke-width="2"/><circle cx="20" cy="24" r="6" fill="#dc2626"/><circle cx="40" cy="24" r="6" fill="#dc2626"/><ellipse cx="20" cy="24" rx="1.8" ry="5.5" fill="#14532d"/><ellipse cx="40" cy="24" rx="1.8" ry="5.5" fill="#14532d"/><circle cx="19" cy="22" r="1.5" fill="white"/><circle cx="39" cy="22" r="1.5" fill="white"/><ellipse cx="27" cy="38" rx="1.5" ry="0.8" fill="#14532d"/><ellipse cx="33" cy="38" rx="1.5" ry="0.8" fill="#14532d"/><path d="M23 46 L25 55 L30 46 L35 55 L37 46" stroke="#ef4444" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
   ],
   lbl:['Glanzend Ei','Kronkelende Worm','Listige Hagedis','Giftige Slang','Drakenslang-Legende'],
   desc:['Kronkelt al vanbinnen. Kan niet wachten.','Sssst. Ssstudeert. Ssssnel ook.','Likt zijn ogen af na elke correcte quiz.','Glipt ongezien door de moeilijkste vragen heen.','Half slang, half draak. Helemaal gevaarlijk.'],
   evoMsg:['🐛 Je Slang kronkelt uit het ei! Sssss.','🦎 Je Slang likt zijn ogen! (Hagedissen doen dat echt.)','🐍 GIFTIGE SLANG! De examenvragen hebben geen kans.','🐉 DRAKENSLANG-LEGENDE! Sssssss... (van trots)']},
  // ── CUSTOM SVG DIEREN ────────────────────────────
  {id:'slijm', n:'Slijm', s:['','','','',''], fallback:['🟢','🟢','💚','💚','👑'],
   svg:[
    // Stadium 0: Piepklein druppeltje, één oog
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="41" rx="11" ry="9" fill="#4ade80"/><path d="M24 36Q27 32 30 31Q33 32 36 36" fill="#4ade80"/><circle cx="30" cy="37" r="2.5" fill="#166534"/><circle cx="31.2" cy="36" r=".9" fill="#fff"/></svg>',
    // Stadium 1: Kleine blob, twee ogen, blij
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M19 44Q13 36 19 27Q24 20 30 20Q36 20 41 27Q47 36 41 44Q36 50 24 49Z" fill="#4ade80"/><circle cx="25" cy="33" r="2.8" fill="#166534"/><circle cx="35" cy="33" r="2.8" fill="#166534"/><circle cx="26" cy="32" r=".9" fill="#fff"/><circle cx="36" cy="32" r=".9" fill="#fff"/><path d="M26 39Q30 42 34 39" stroke="#166534" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
    // Stadium 2: Middelgrote blob, bulk, horentjes
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="22" cy="20" rx="5" ry="6" fill="#22c55e"/><ellipse cx="38" cy="20" rx="5" ry="6" fill="#22c55e"/><path d="M15 46Q9 37 16 27Q22 17 30 17Q38 17 44 27Q51 37 45 46Q38 52 22 52Z" fill="#22c55e"/><circle cx="25" cy="32" r="3.2" fill="#166534"/><circle cx="35" cy="32" r="3.2" fill="#166534"/><circle cx="26.2" cy="30.8" r="1.1" fill="#fff"/><circle cx="36.2" cy="30.8" r="1.1" fill="#fff"/><path d="M25 40Q30 45 35 40" stroke="#166534" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    // Stadium 3: Grote blob met armen
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="9" cy="36" rx="8" ry="5" fill="#16a34a" transform="rotate(-20,9,36)"/><ellipse cx="51" cy="36" rx="8" ry="5" fill="#16a34a" transform="rotate(20,51,36)"/><ellipse cx="21" cy="16" rx="5" ry="6" fill="#16a34a"/><ellipse cx="30" cy="13" rx="5" ry="6" fill="#16a34a"/><ellipse cx="39" cy="16" rx="5" ry="6" fill="#16a34a"/><path d="M13 48Q7 38 13 27Q19 14 30 14Q41 14 47 27Q53 38 47 48Q40 55 20 55Z" fill="#16a34a"/><circle cx="24" cy="30" r="3.5" fill="#166534"/><circle cx="36" cy="30" r="3.5" fill="#166534"/><circle cx="25.2" cy="28.8" r="1.2" fill="#fff"/><circle cx="37.2" cy="28.8" r="1.2" fill="#fff"/><path d="M23 39Q30 45 37 39" stroke="#166534" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
    // Stadium 4: SLIJMKONING met kroon en gouden ogen
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M17 20L21 11L27 18L30 9L33 18L39 11L43 20Z" fill="#fbbf24"/><circle cx="21" cy="11" r="2" fill="#f59e0b"/><circle cx="30" cy="9" r="2.5" fill="#fde68a"/><circle cx="39" cy="11" r="2" fill="#f59e0b"/><ellipse cx="8" cy="38" rx="9" ry="5" fill="#15803d" transform="rotate(-15,8,38)"/><ellipse cx="52" cy="38" rx="9" ry="5" fill="#15803d" transform="rotate(15,52,38)"/><path d="M11 50Q5 39 12 28Q18 16 30 17Q42 16 48 28Q55 39 49 50Q40 57 20 57Z" fill="#15803d"/><circle cx="23" cy="33" r="4" fill="#fde047"/><circle cx="37" cy="33" r="4" fill="#fde047"/><circle cx="23" cy="33" r="2.2" fill="#166534"/><circle cx="37" cy="33" r="2.2" fill="#166534"/><circle cx="24.2" cy="32" r=".9" fill="#fff"/><circle cx="38.2" cy="32" r=".9" fill="#fff"/><path d="M21 42Q30 49 39 42" stroke="#166534" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>'
   ],
   lbl:['Piepklein Druppeltje','Vrolijke Blob','Stevige Slijmbal','Spier-Slijm','Slijmkoning'],
   desc:['Zo klein dat niemand je ziet. Ideaal voor tentamens.','Heeft twee ogen! Ziet nu twee keer zoveel fout.','Heeft horentjes gekregen. Weet zelf niet waarom.','Heeft armen! Maar weet niet wat ermee te doen.','Regeert over alle slijm. En over jouw examen.'],
   evoMsg:['🟢 Je Slijm heeft een oog gekregen! Ziet nu 50% meer.','💚 Je Slijm heeft horentjes! Waarvoor? Niemand weet het.','💚 SPIERSLIJM! Klopt op armen die net zijn verschenen.','👑 SLIJMKONING! Alle slijm buigt voor hem. Inclusief de stof.']},
  {id:'cactus', n:'Cactus', s:['','','','',''], fallback:['🌱','🌱','🌵','🌵','🌵'],
   svg:[
    // Stadium 0: Zaadje
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="42" rx="11" ry="13" fill="#a16207"/><ellipse cx="30" cy="38" rx="8" ry="9" fill="#ca8a04"/><path d="M27 28Q30 21 33 28" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"/><circle cx="30" cy="20" r="3" fill="#4ade80"/></svg>',
    // Stadium 1: Klein sprietje
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="53" rx="9" ry="4" fill="#92400e"/><rect x="28.5" y="30" width="3" height="23" rx="1.5" fill="#16a34a"/><path d="M30 40Q22 38 20 30Q26 32 30 40Z" fill="#22c55e"/><path d="M30 40Q38 38 40 30Q34 32 30 40Z" fill="#22c55e"/><circle cx="30" cy="29" r="3" fill="#4ade80"/></svg>',
    // Stadium 2: Kleine cactus, één arm
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="55" rx="11" ry="4" fill="#92400e"/><rect x="26" y="22" width="8" height="33" rx="4" fill="#15803d"/><rect x="14" y="30" width="12" height="6" rx="3" fill="#15803d"/><rect x="11" y="22" width="6" height="13" rx="3" fill="#15803d"/><circle cx="30" cy="22" r="2" fill="#bbf7d0"/><circle cx="26" cy="27" r="2" fill="#bbf7d0"/><circle cx="34" cy="27" r="2" fill="#bbf7d0"/></svg>',
    // Stadium 3: Twee armen + bloem
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="56" rx="13" ry="4" fill="#92400e"/><rect x="24" y="15" width="12" height="40" rx="6" fill="#15803d"/><rect x="10" y="26" width="14" height="7" rx="3.5" fill="#15803d"/><rect x="7" y="18" width="7" height="13" rx="3.5" fill="#15803d"/><rect x="36" y="30" width="14" height="7" rx="3.5" fill="#15803d"/><rect x="46" y="22" width="7" height="13" rx="3.5" fill="#15803d"/><circle cx="30" cy="12" r="7" fill="#f9a8d4"/><circle cx="24" cy="10" r="4" fill="#f9a8d4"/><circle cx="36" cy="10" r="4" fill="#f9a8d4"/><circle cx="30" cy="12" r="4" fill="#fbbf24"/></svg>',
    // Stadium 4: MEGA CACTUS met zonnebril en kroon
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="57" rx="14" ry="4" fill="#92400e"/><rect x="22" y="11" width="16" height="45" rx="8" fill="#166534"/><rect x="5" y="23" width="17" height="8" rx="4" fill="#166534"/><rect x="2" y="14" width="8" height="15" rx="4" fill="#166534"/><rect x="38" y="27" width="17" height="8" rx="4" fill="#166534"/><rect x="50" y="18" width="8" height="15" rx="4" fill="#166534"/><circle cx="30" cy="9" r="8" fill="#f472b6"/><circle cx="23" cy="7" r="5" fill="#f472b6"/><circle cx="37" cy="7" rx="5" ry="5" fill="#f472b6"/><circle cx="30" cy="9" r="4.5" fill="#fbbf24"/><path d="M20 3L23 -4L26 3L30 -6L34 3L37 -4L40 3Z" fill="#fbbf24" transform="translate(0,7)"/><rect x="21" y="17" width="8" height="5" rx="2" fill="#0f172a"/><rect x="31" y="17" width="8" height="5" rx="2" fill="#0f172a"/><line x1="21" y1="19.5" x2="39" y2="19.5" stroke="#0f172a" stroke-width="2"/></svg>'
   ],
   lbl:['Slapend Zaadje','Piepklein Sprietje','Eigenzinnige Cactus','Bloeiende Held','Zonnebril-Legende'],
   desc:['Ligt in de grond. Denkt na. Heel lang.','Eén sprietje! Al trots op zichzelf.','Heeft een arm gekregen. Wijst naar de goede antwoorden.','Twee armen én bloemen. Absoluut overdressed.','Zonnebril aan, kroon op. Examen? Geen probleem.'],
   evoMsg:['🌱 Je Cactus kiemt! Eén sprietje. Bijzonder.','🌵 Je Cactus heeft een arm! En wijst al.','🌵🌸 BLOEIENDE CACTUS! Zijn bloem ruikt naar succes.','😎🌵 ZONNEBRIL-LEGENDE! De zon kijkt weg van jaloezie.']},
  {id:'robot', n:'Robot', s:['','','','',''], fallback:['🔩','🤖','🤖','🤖','🦾'],
   svg:[
    // Stadium 0: Microchip
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="19" y="19" width="22" height="22" rx="3" fill="#475569"/><rect x="22" y="22" width="16" height="16" rx="2" fill="#0f172a"/><line x1="19" y1="25" x2="13" y2="25" stroke="#94a3b8" stroke-width="2"/><line x1="19" y1="30" x2="13" y2="30" stroke="#94a3b8" stroke-width="2"/><line x1="19" y1="35" x2="13" y2="35" stroke="#94a3b8" stroke-width="2"/><line x1="41" y1="25" x2="47" y2="25" stroke="#94a3b8" stroke-width="2"/><line x1="41" y1="30" x2="47" y2="30" stroke="#94a3b8" stroke-width="2"/><line x1="41" y1="35" x2="47" y2="35" stroke="#94a3b8" stroke-width="2"/><circle cx="27" cy="27" r="2.2" fill="#22d3ee"/><circle cx="33" cy="33" r="2.2" fill="#22d3ee"/><line x1="27" y1="27" x2="33" y2="33" stroke="#22d3ee" stroke-width="1.2"/><circle cx="33" cy="27" r="1.5" fill="#22d3ee" opacity=".5"/><circle cx="27" cy="33" r="1.5" fill="#22d3ee" opacity=".5"/></svg>',
    // Stadium 1: Blokrobot
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="22" y="21" width="16" height="13" rx="3" fill="#64748b"/><rect x="24" y="24" width="5" height="4" rx="1.5" fill="#22d3ee"/><rect x="31" y="24" width="5" height="4" rx="1.5" fill="#22d3ee"/><rect x="22" y="34" width="16" height="14" rx="2" fill="#475569"/><rect x="13" y="36" width="8" height="9" rx="2" fill="#475569"/><rect x="39" y="36" width="8" height="9" rx="2" fill="#475569"/><rect x="24" y="48" width="5" height="8" rx="2" fill="#334155"/><rect x="31" y="48" width="5" height="8" rx="2" fill="#334155"/><line x1="30" y1="19" x2="30" y2="13" stroke="#64748b" stroke-width="2.5"/><circle cx="30" cy="11" r="3.5" fill="#f59e0b"/></svg>',
    // Stadium 2: Robot met echt armen
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="15" width="20" height="16" rx="4" fill="#64748b"/><rect x="22" y="18" width="6" height="5" rx="2" fill="#38bdf8"/><rect x="32" y="18" width="6" height="5" rx="2" fill="#38bdf8"/><rect x="20" y="31" width="20" height="16" rx="3" fill="#475569"/><rect x="8" y="32" width="11" height="7" rx="2.5" fill="#475569"/><rect x="6" y="26" width="5" height="13" rx="2" fill="#334155"/><rect x="41" y="32" width="11" height="7" rx="2.5" fill="#475569"/><rect x="49" y="26" width="5" height="13" rx="2" fill="#334155"/><rect x="23" y="47" width="6" height="10" rx="2" fill="#334155"/><rect x="31" y="47" width="6" height="10" rx="2" fill="#334155"/><line x1="30" y1="13" x2="30" y2="7" stroke="#64748b" stroke-width="2.5"/><circle cx="30" cy="5" r="4" fill="#f97316"/><rect x="25" y="38" width="10" height="3" rx="1" fill="#38bdf8" opacity=".6"/></svg>',
    // Stadium 3: Geavanceerde robot
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="11" width="28" height="18" rx="5" fill="#475569"/><rect x="19" y="15" width="8" height="6" rx="2.5" fill="#d97706"/><rect x="33" y="15" width="8" height="6" rx="2.5" fill="#d97706"/><path d="M27 23L30 26L33 23" fill="#475569"/><rect x="16" y="29" width="28" height="18" rx="4" fill="#334155"/><rect x="5" y="29" width="10" height="9" rx="3" fill="#334155"/><rect x="3" y="23" width="6" height="14" rx="3" fill="#475569"/><rect x="45" y="29" width="10" height="9" rx="3" fill="#334155"/><rect x="51" y="23" width="6" height="14" rx="3" fill="#475569"/><rect x="20" y="47" width="8" height="11" rx="3" fill="#334155"/><rect x="32" y="47" width="8" height="11" rx="3" fill="#334155"/><line x1="30" y1="9" x2="30" y2="3" stroke="#64748b" stroke-width="3"/><rect x="27" y="0" width="6" height="5" rx="1.5" fill="#f97316"/><rect x="22" y="36" width="16" height="4" rx="1.5" fill="#d97706" opacity=".7"/></svg>',
    // Stadium 4: MEGA MECH
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="13" y="5" width="34" height="21" rx="6" fill="#334155"/><rect x="16" y="9" width="10" height="8" rx="3" fill="#0ea5e9"/><rect x="34" y="9" width="10" height="8" rx="3" fill="#0ea5e9"/><line x1="30" y1="3" x2="30" y2="0" stroke="#64748b" stroke-width="3"/><rect x="27" y="-2" width="6" height="5" rx="1.5" fill="#f97316" transform="translate(0,2)"/><rect x="13" y="26" width="34" height="20" rx="5" fill="#1e293b"/><rect x="21" y="34" width="18" height="5" rx="2" fill="#0ea5e9" opacity=".8"/><rect x="2" y="24" width="10" height="10" rx="3" fill="#1e293b"/><rect x="0" y="18" width="6" height="15" rx="3" fill="#334155"/><rect x="48" y="24" width="10" height="10" rx="3" fill="#1e293b"/><rect x="54" y="18" width="6" height="15" rx="3" fill="#334155"/><rect x="17" y="46" width="10" height="13" rx="3" fill="#1e293b"/><rect x="33" y="46" width="10" height="13" rx="3" fill="#1e293b"/><circle cx="20" cy="58" r="4" fill="#f97316"/><circle cx="40" cy="58" r="4" fill="#f97316"/></svg>'
   ],
   lbl:['Saaie Microchip','Blokkerige Beginrobot','Arm-Robot-3000','Geavanceerde Strijder','MEGA MECH ULTIEM'],
   desc:['Klein, vlak en nutteloos. Maar heeft potentie.','Vierkant en trots. Botst tegen deurkozijnen.','Heeft armen! Kan nu ook op de rug kloppen.','Gloeiende ogen. Weet alles. Vertelt het niet.','Brandt op raketlaarzen. Het examen heeft geen kans.'],
   evoMsg:['🔩 Je Robot is geassembleerd! Vierkant maar trots.','🤖 ARMEN! Je Robot kan nu dingen vastpakken. Bijv. een 8.','🤖✨ GEAVANCEERDE ROBOT! Zijn ogen gloeien van kennis.','🦾 MEGA MECH! Start raketlaarzen. Examens vernietigd.']},
  {id:'gorilla', n:'Gorilla', s:['','','','',''], fallback:['🐒','🐒','🦍','🦧','🦍'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="22" rx="8" ry="10" fill="#b45309" stroke="#92400e" stroke-width="2.5"/><ellipse cx="40" cy="22" rx="8" ry="10" fill="#b45309" stroke="#92400e" stroke-width="2.5"/><circle cx="30" cy="35" r="18" fill="#a16207" stroke="#78350f" stroke-width="3"/><ellipse cx="30" cy="43" rx="11" ry="8" fill="#d97706" stroke="#b45309" stroke-width="1.5"/><circle cx="23" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="37" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="23" cy="30" r="3.5" fill="#1a0a00"/><circle cx="37" cy="30" r="3.5" fill="#1a0a00"/><circle cx="22.5" cy="29" r="1.2" fill="white"/><circle cx="36.5" cy="29" r="1.2" fill="white"/><ellipse cx="30" cy="39" rx="3.5" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="24" cy="26" rx="7" ry="4" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="18" cy="18" rx="8" ry="11" fill="#92400e" stroke="#78350f" stroke-width="2.5"/><ellipse cx="42" cy="18" rx="8" ry="11" fill="#92400e" stroke="#78350f" stroke-width="2.5"/><rect x="14" y="14" width="32" height="7" rx="3.5" fill="#78350f" stroke="#1a0a00" stroke-width="1.5"/><circle cx="30" cy="32" r="20" fill="#78350f" stroke="#1a0a00" stroke-width="3"/><ellipse cx="30" cy="43" rx="13" ry="9" fill="#a16207" stroke="#92400e" stroke-width="1.5"/><circle cx="22" cy="28" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="28" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="28" r="3.5" fill="#1a0a00"/><circle cx="38" cy="28" r="3.5" fill="#1a0a00"/><circle cx="21.5" cy="27" r="1.2" fill="white"/><circle cx="37.5" cy="27" r="1.2" fill="white"/><ellipse cx="30" cy="39" rx="4" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="23" cy="23" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="16" rx="8" ry="11" fill="#44403c" stroke="#1a0a00" stroke-width="2.5"/><ellipse cx="44" cy="16" rx="8" ry="11" fill="#44403c" stroke="#1a0a00" stroke-width="2.5"/><rect x="12" y="12" width="36" height="8" rx="4" fill="#1c1917" stroke="#1a0a00" stroke-width="2"/><circle cx="30" cy="30" r="21" fill="#292524" stroke="#1a0a00" stroke-width="3"/><ellipse cx="30" cy="43" rx="14" ry="10" fill="#44403c" stroke="#292524" stroke-width="1.5"/><circle cx="22" cy="27" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="27" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="27" r="4" fill="#1a0a00"/><circle cx="38" cy="27" r="4" fill="#1a0a00"/><circle cx="21.5" cy="26" r="1.5" fill="white"/><circle cx="37.5" cy="26" r="1.5" fill="white"/><ellipse cx="30" cy="39" rx="4" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><path d="M5 38 Q2 30 8 26" stroke="#292524" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M55 38 Q58 30 52 26" stroke="#292524" stroke-width="8" stroke-linecap="round" fill="none"/><ellipse cx="23" cy="22" rx="9" ry="4.5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="15" cy="16" rx="8" ry="12" fill="#ea580c" stroke="#c2410c" stroke-width="2.5"/><ellipse cx="45" cy="16" rx="8" ry="12" fill="#ea580c" stroke="#c2410c" stroke-width="2.5"/><circle cx="30" cy="30" r="22" fill="#c2410c" stroke="#7c2d12" stroke-width="3"/><ellipse cx="30" cy="43" rx="15" ry="10" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/><circle cx="22" cy="27" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="27" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="27" r="4" fill="#431407"/><circle cx="38" cy="27" r="4" fill="#431407"/><circle cx="22" cy="27" r="2" fill="#1a0a00"/><circle cx="38" cy="27" r="2" fill="#1a0a00"/><circle cx="21.5" cy="26" r="1" fill="white"/><circle cx="37.5" cy="26" r="1" fill="white"/><ellipse cx="30" cy="39" rx="4.5" ry="3.5" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><path d="M4 40 Q2 30 8 24" stroke="#c2410c" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M56 40 Q58 30 52 24" stroke="#c2410c" stroke-width="9" stroke-linecap="round" fill="none"/><ellipse cx="23" cy="21" rx="9" ry="4.5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M14 8 L18 2 L22 8 L26 3 L30 8 L34 3 L38 8 L42 2 L46 8Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><ellipse cx="13" cy="15" rx="8" ry="12" fill="#292524" stroke="#1a0a00" stroke-width="2.5"/><ellipse cx="47" cy="15" rx="8" ry="12" fill="#292524" stroke="#1a0a00" stroke-width="2.5"/><rect x="11" y="11" width="38" height="8" rx="4" fill="#0c0a09" stroke="#1a0a00" stroke-width="2"/><circle cx="30" cy="30" r="22" fill="#1c1917" stroke="#0c0a09" stroke-width="3"/><ellipse cx="30" cy="43" rx="15" ry="11" fill="#292524" stroke="#1c1917" stroke-width="1.5"/><rect x="14" y="35" width="32" height="8" rx="4" fill="#d1d5db" stroke="#94a3b8" stroke-width="1.5" opacity="0.75"/><circle cx="21" cy="26" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="26" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="26" r="4.5" fill="#1c1917"/><circle cx="39" cy="26" r="4.5" fill="#1c1917"/><circle cx="20.5" cy="25" r="1.8" fill="#ef4444"/><circle cx="38.5" cy="25" r="1.8" fill="#ef4444"/><ellipse cx="30" cy="39" rx="4.5" ry="3.5" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><path d="M3 42 Q1 30 8 22" stroke="#1c1917" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M57 42 Q59 30 52 22" stroke="#1c1917" stroke-width="10" stroke-linecap="round" fill="none"/><ellipse cx="23" cy="21" rx="10" ry="5" fill="white" opacity="0.18"/></svg>'
   ],
   lbl:['Hyper Aapje','Klimmend Jonkie','Borstklopende Gorilla','Superieure Orang-oetan','Silverback-Legende'],
   desc:['Trekt aan alles. Inclusief de studieplannen.','Klimt van onderwerp naar onderwerp.','Klopt op zijn borst na elk goed antwoord. Terecht.','Denkt dieper na dan de vraagsteller. Problematisch.','Zit boven in de boom der kennis. Kijkt neer op twijfel.'],
   evoMsg:['🐒 Je Gorilla zwaait van tak tot tak!','🦍 Je Gorilla groeit! Klopt al op z\'n borst.','🦧 ORANG-OETAN! Intelligent en oranje. Gevaarlijke combo.','🦍 SILVERBACK-LEGENDE! Alle gorilla\'s buigen voor hem.']},
];
const ANIM_THRESHOLDS=[0,100,500,2000,7500,30000,75000,200000];
const ANIM_STAGE_NAMES=['Baby','Jong','Tiener','Volwassen','Prime','Goud','Diamant','Platina'];
let selectedAnimalId=null;

function getAnimalById(id){return ANIMAL_EVOLUTIONS.find(a=>a.id===id)||null;}
function getAnimalStageIdx(totalXP){
  let idx=0;
  for(let i=ANIM_THRESHOLDS.length-1;i>=0;i--){if(totalXP>=ANIM_THRESHOLDS[i]){idx=i;break;}}
  return idx;
}
function getAnimalEmoji(animalId,totalXP){
  const a=getAnimalById(animalId);
  if(!a)return'🐾';
  const idx=getAnimalStageIdx(totalXP);
  // Custom SVG dieren: gebruik fallback emoji
  if(a.svg)return a.fallback?.[Math.min(idx,a.fallback.length-1)]||a.fallback?.[0]||'⭐';
  return a.s[Math.min(idx,a.s.length-1)];
}
// Geeft HTML terug: SVG voor custom dieren, emoji-span voor normale
function getAnimalDisplay(animalId,stageIdx,size){
  size=size||48;
  const a=getAnimalById(animalId);
  if(!a)return'<span style="font-size:'+size+'px">🐾</span>';
  // Premium ring wrapper for Goud(5), Diamant(6), Platina(7)
  const premInfo=stageIdx>=5?[
    {cls:'avo-goud',ring:'avo-ring-goud'},
    {cls:'avo-diamant',ring:'avo-ring-diamant'},
    {cls:'avo-platina',ring:'avo-ring-platina'},
  ][stageIdx-5]||{cls:'avo-platina',ring:'avo-ring-platina'}:null;
  if(a.svg){
    const svgIdx=Math.min(stageIdx,a.svg.length-1);
    if(a.svg[svgIdx]){
      const svgCls='anim-svg-wrap'+(premInfo?' '+premInfo.cls:'');
      const svgSpan='<span class="'+svgCls+'" style="width:'+size+'px;height:'+size+'px">'+a.svg[svgIdx]+'</span>';
      if(premInfo){
        // Ring wrapper auto-sizes to svg + 6px (3px padding each side)
        return'<span class="avo-prem-ring '+premInfo.ring+'">'+svgSpan+'</span>';
      }
      return svgSpan;
    }
  }
  const sIdx=Math.min(stageIdx,a.s.length-1);
  return'<span style="font-size:'+size+'px;line-height:1">'+a.s[sIdx]+'</span>';
}
function buildRegisterAnimalPicker(){
  const grid=document.getElementById('reg-animal-grid');
  if(!grid)return;
  grid.innerHTML='';
  ANIMAL_EVOLUTIONS.forEach(a=>{
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='anim-pick-btn';
    btn.innerHTML=`<span class="anim-pick-emoji">${a.svg?getAnimalDisplay(a.id,0,36):a.s[0]}</span><span class="anim-pick-name">${a.n}</span>`;
    btn.onclick=()=>{
      selectedAnimalId=a.id;
      document.querySelectorAll('.anim-pick-btn').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
    };
    grid.appendChild(btn);
  });
}
function renderAnimalEvoSection(animalId,totalXP){
  const sec=document.getElementById('anim-evo-section');
  if(!sec)return;
  if(!animalId){
    sec.innerHTML=`
      <div class="prof-section-title" style="margin-bottom:6px">Kies je startdier</div>
      <div class="prof-section-sub" style="margin-bottom:10px">Je dier evolueert automatisch naarmate je XP verdient. <strong>Je kunt later niet meer wisselen!</strong></div>
      <div class="anim-pick-grid" id="prof-animal-grid"></div>
      <div class="anim-warn">⚠️ <strong>Let op:</strong> na opslaan is je keuze definitief.</div>`;
    const grid=document.getElementById('prof-animal-grid');
    ANIMAL_EVOLUTIONS.forEach(a=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='anim-pick-btn';
      btn.innerHTML=`<span class="anim-pick-emoji">${a.svg?getAnimalDisplay(a.id,0,36):a.s[0]}</span><span class="anim-pick-name">${a.n}</span>`;
      btn.onclick=()=>{
        selectedAnimalId=a.id;
        selectedAvatar=a.s[0];
        document.querySelectorAll('#prof-animal-grid .anim-pick-btn').forEach(b=>b.classList.remove('selected'));
        btn.classList.add('selected');
      };
      grid.appendChild(btn);
    });
    return;
  }
  const a=getAnimalById(animalId);
  if(!a){sec.innerHTML='';return;}
  const stageIdx=getAnimalStageIdx(totalXP);
  const isMaxed=stageIdx===ANIM_THRESHOLDS.length-1;
  const nextThreshold=isMaxed?null:ANIM_THRESHOLDS[stageIdx+1];
  const prevThreshold=ANIM_THRESHOLDS[stageIdx];
  const pct=isMaxed?100:Math.round(Math.min(100,(totalXP-prevThreshold)/(nextThreshold-prevThreshold)*100));
  let stagesHtml='';
  for(let i=0;i<ANIM_THRESHOLDS.length;i++){
    const emoji=a.s[Math.min(i,a.s.length-1)];
    const isDone=i<stageIdx;
    const isCurrent=i===stageIdx;
    const cls=isDone?'done':isCurrent?'current':'';
    const reqTxt=i===0?'Start':ANIM_THRESHOLDS[i].toLocaleString('nl')+' XP';
    const stageLbl=(a.lbl&&a.lbl[i])||ANIM_STAGE_NAMES[i];
    const pipContent=a.svg
      ?getAnimalDisplay(a.id,i,36)
      :`<span style="font-size:32px;line-height:1;${!isDone&&!isCurrent?'filter:grayscale(.6);opacity:.5':''}">${emoji}</span>`;
    stagesHtml+=`<div class="anim-stage ${cls}" title="${a.desc?a.desc[Math.min(i,a.desc.length-1)]:''}">
      <div class="anim-stage-pip" style="${!isDone&&!isCurrent&&a.svg?'opacity:.45;filter:grayscale(.7)':''}">${pipContent}</div>
      <div class="anim-stage-label">${stageLbl}</div>
      <div class="anim-stage-req">${reqTxt}</div>
    </div>`;
  }
  const curLbl=(a.lbl&&a.lbl[stageIdx])||ANIM_STAGE_NAMES[stageIdx];
  const curDesc=a.desc?a.desc[Math.min(stageIdx,a.desc.length-1)]:'';
  const nextLbl=!isMaxed?((a.lbl&&a.lbl[stageIdx+1])||ANIM_STAGE_NAMES[stageIdx+1]):'';

  const progressHtml=isMaxed
    ?`<div style="font-size:12px;color:var(--or);font-weight:700;text-align:center">🏆 Maximaal stadium bereikt! Je ${a.n} is een legende.</div>`
    :`<div class="anim-evo-prog-bar"><div class="anim-evo-prog-fill" style="width:${pct}%"></div></div>
      <div class="anim-evo-prog-txt">${totalXP.toLocaleString('nl')} / ${nextThreshold.toLocaleString('nl')} XP → ${!a.svg&&a.s[stageIdx+1]?a.s[stageIdx+1]+' ':''}${nextLbl}</div>`;
  const bigDisplay=getAnimalDisplay(a.id,stageIdx,52);
  sec.innerHTML=`<div class="anim-evo-card">
    <div class="anim-evo-title">${bigDisplay} ${a.n} <button class="anim-change-btn" onclick="toggleAnimalPicker()" title="Verander dier">🔄 Wisselen</button></div>
    <div class="anim-evo-subtitle">${curLbl} · ${totalXP.toLocaleString('nl')} XP totaal</div>
    ${curDesc?`<div style="font-size:13px;color:var(--mu);font-style:italic;margin:4px 0 10px;text-align:center">"${curDesc}"</div>`:''}
    <div class="anim-evo-stages">${stagesHtml}</div>
    <div class="anim-evo-progress">${progressHtml}</div>
    <div id="animal-picker-inline" style="display:none;margin-top:14px">
      <div style="font-size:12px;color:var(--mu);margin-bottom:10px;text-align:center">Kies een nieuw dier — je evolutiestadium blijft behouden</div>
      <div class="anim-pick-grid" id="prof-animal-switch-grid"></div>
      <button onclick="saveAnimalChoice()" style="width:100%;margin-top:10px;padding:12px;background:var(--or);color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font)">Opslaan</button>
    </div>
  </div>`;
}

function buildAvatarPicker(current){
  // Legacy - now handled by animal evolution system
}

function toggleAnimalPicker(){
  const p=document.getElementById('animal-picker-inline');
  if(!p)return;
  const visible=p.style.display!=='none';
  if(!visible){
    // Bouw switcher grid als nog leeg
    const grid=document.getElementById('prof-animal-switch-grid');
    if(grid&&!grid.children.length){
      const prof=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
      const curId=prof.animalId;
      const stageIdx=getAnimalStageIdx(getTotalXP());
      ANIMAL_EVOLUTIONS.forEach(a=>{
        const btn=document.createElement('button');
        btn.type='button';
        btn.className='anim-pick-btn'+(a.id===curId?' selected':'');
        btn.innerHTML=`<span class="anim-pick-emoji">${getAnimalDisplay(a.id,stageIdx,36)}</span><span class="anim-pick-name">${a.n}</span>`;
        btn.onclick=()=>{
          selectedAnimalId=a.id;
          document.querySelectorAll('#prof-animal-switch-grid .anim-pick-btn').forEach(b=>b.classList.remove('selected'));
          btn.classList.add('selected');
        };
        grid.appendChild(btn);
      });
      // Zet selectedAnimalId op huidige
      selectedAnimalId=curId;
    }
  }
  p.style.display=visible?'none':'block';
}

async function saveAnimalChoice(){
  if(!selectedAnimalId)return;
  const prof=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  prof.animalId=selectedAnimalId;
  prof.avatar=getAnimalEmoji(selectedAnimalId,0);
  localStorage.setItem(PROF_KEY,JSON.stringify(prof));
  if(currentUser)cloudSet('profiel',prof);
  syncAvatarToProfile();
  // Herrender de sectie
  const xp=getTotalXP();
  renderAnimalEvoSection(selectedAnimalId,xp);
  renderXPHome();
  updateProfileNav();
  showToast('✅ Dier gewijzigd naar '+ANIMAL_EVOLUTIONS.find(a=>a.id===selectedAnimalId)?.n,'#4ADE80',3000);
}

function loadProfile(){
  let p={};
  try{p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');}catch(e){p={};}
  const set=(id,val)=>{const el=document.getElementById(id);if(el)el.value=val;};
  if(p.naam){set('pf-naam',p.naam);}
  if(p.school)set('pf-school',p.school);
  if(p.klas)set('pf-klas',p.klas);
  if(p.profiel)set('pf-profiel',p.profiel);
  // Animal evolution
  const animalId=p.animalId||null;
  selectedAnimalId=animalId;
  const totalXP=getTotalXP();
  if(animalId){
    selectedAvatar=getAnimalEmoji(animalId,totalXP);
  } else {
    selectedAvatar=p.avatar||'🐾';
  }
  renderAnimalEvoSection(animalId,totalXP);
}

async function saveProfileData(){
  const get=(id)=>document.getElementById(id)?.value||'';
  let p={};
  try{p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');}catch(e){p={};}
  const totalXP=getTotalXP();
  // Animal: only set if not already locked
  const lockedAnimalId=p.animalId||null;
  const newAnimalId=lockedAnimalId||(selectedAnimalId||null);
  const computedAvatar=newAnimalId?getAnimalEmoji(newAnimalId,totalXP):(selectedAvatar||'🐾');
  const updated={
    naam:get('pf-naam').trim(),
    school:get('pf-school').trim(),
    klas:get('pf-klas'),
    profiel:get('pf-profiel'),
    avatar:computedAvatar,
    animalId:newAnimalId,
  };
  await cloudSet('profiel',updated);
  selectedAnimalId=newAnimalId;
  selectedAvatar=computedAvatar;
  renderAnimalEvoSection(newAnimalId,totalXP);
  const msg=document.getElementById('pf-saved-msg');
  if(msg){msg.classList.add('show');setTimeout(()=>msg.classList.remove('show'),2500);}
  updateProfileNav();
}

function getSavedCijfers(){
  try{return JSON.parse(localStorage.getItem('examenapp_'+lvlCol('cijfers'))||'{}');}
  catch(e){return {};}
}

function buildCijferGrid(){
  const saved=getSavedCijfers();
  const grid=document.getElementById('cijfer-grid');
  grid.innerHTML='';
  getVK().forEach(v=>{
    const val=saved[v.id]||'';
    const div=document.createElement('div');
    div.className='cijfer-item';
    div.innerHTML=`<div class="cijfer-vak"><div class="cijfer-dot" style="background:${v.kleur}"></div>${v.naam}</div>
      <input class="cijfer-input${val?(' has-val'):''}" id="ci-${v.id}" type="number" min="1" max="10" step="0.1" value="${val}" placeholder="—" oninput="this.classList.toggle('has-val',this.value!=='')" />
      <div class="cijfer-label">SE-cijfer</div>`;
    grid.appendChild(div);
  });
  setTimeout(showCijferTuto,350);
}

function saveCijfers(){
  const saved={};
  getVK().forEach(v=>{
    const inp=document.getElementById('ci-'+v.id);
    if(inp&&inp.value!==''){
      const n=parseFloat(inp.value.replace(',','.'));
      if(!isNaN(n)&&n>=1&&n<=10)saved[v.id]=Math.round(n*10)/10;
    }
  });
  cloudSet(lvlCol('cijfers'),saved);
  try{pushSyncBundle();}catch(e){}
  buildGrid();
  const msg=document.getElementById('cijfer-saved-msg');
  msg.classList.add('show');
  setTimeout(()=>msg.classList.remove('show'),2500);
}

function toggleImportPanel(app){
  const magPanel=document.getElementById('imp-panel-magister');
  const somPanel=document.getElementById('imp-panel-somtoday');
  const magBtn=document.getElementById('imp-btn-mag');
  const somBtn=document.getElementById('imp-btn-som');
  if(app==='magister'){
    const showing=magPanel.classList.contains('show');
    magPanel.classList.toggle('show',!showing);
    somPanel.classList.remove('show');
    magBtn.classList.toggle('active',!showing);
    somBtn.classList.remove('active');
  }else{
    const showing=somPanel.classList.contains('show');
    somPanel.classList.toggle('show',!showing);
    magPanel.classList.remove('show');
    somBtn.classList.toggle('active',!showing);
    magBtn.classList.remove('active');
  }
}

function parseCijferText(text){
  const found={};

  function toGrade(s){
    if(!s)return null;
    const n=parseFloat(String(s).replace(',','.'));
    return(!isNaN(n)&&n>=1&&n<=10)?Math.round(n*10)/10:null;
  }

  // ── Normaliseer ──────────────────────────────────────────────────
  let t=text
    .replace(/\r\n/g,'\n').replace(/\r/g,'\n')
    .replace(/\u00a0/g,' ')
    .replace(/\u200b|\u200c|\u200d|\ufeff/g,'')
    // Plak tab als spatie (sommige exports gebruiken tabs)
    .replace(/\t/g,'  ')
    // Splits "NederlandsSE7,8" → "Nederlands\nSE7,8"
    .replace(/([a-zA-Z\u00c0-\u024f])(SE\s*\d)/gi,'$1\n$2');

  const lines=t.split('\n').map(l=>l.trim()).filter(Boolean);

  // ── STRATEGIE 1: vak + cijfer op dezelfde regel ──────────────────
  // Herkent: "Biologie 7,8"  "Biologie: 7,8"  "Biologie | 7,8"
  //          "Biologie SE7,8"  "Biologie SE 7,8"  "Biologie  7,8  SE1 7,5"
  for(const line of lines){
    // Splits op scheidingstekens (|, ;, :) en probeer vak in deel 0, cijfer in rest
    const parts=line.split(/\s*[|;:]\s*/);
    if(parts.length>=2){
      const vid=matchVakNaam(parts[0]);
      if(vid&&!found[vid]){
        for(let i=1;i<parts.length;i++){
          const raw=parts[i].replace(/^SE\s*/i,'').trim();
          const g=toGrade((raw.match(/^[\d,.]+/))||null);
          if(g){found[vid]=g;break;}
        }
      }
    }

    // "VakNaam   7,8" (≥2 spaties als scheiding of einde van regel)
    const mSpace=line.match(/^(.+?)\s{2,}(\d{1,2}[,.]\d)\s*(?:SE.*)?$/);
    if(mSpace){
      const vid=matchVakNaam(mSpace[1].replace(/\bSE\b.*/gi,'').trim());
      if(vid&&!found[vid]){const g=toGrade(mSpace[2]);if(g)found[vid]=g;}
    }

    // "VakNaam SE7,8" of "VakNaam SE 7,8"
    const mSE=line.match(/^(.+?)\s+SE\s*(\d{1,2}[,.]\d)\b/i);
    if(mSE){
      const vid=matchVakNaam(mSE[1]);
      if(vid&&!found[vid]){const g=toGrade(mSE[2]);if(g)found[vid]=g;}
    }

    // Regel eindigt op cijfer: "Biologie 7,8" (1 spatie)
    const mEnd=line.match(/^(.+?)\s(\d{1,2}[,.]\d)\s*$/);
    if(mEnd){
      const vid=matchVakNaam(mEnd[1].replace(/\bSE\b.*/gi,'').trim());
      if(vid&&!found[vid]){const g=toGrade(mEnd[2]);if(g)found[vid]=g;}
    }
  }

  // ── STRATEGIE 2: vak op één regel, cijfer op volgende regels ─────
  for(let i=0;i<lines.length;i++){
    const vid=matchVakNaam(lines[i]);
    if(!vid)continue;

    for(let j=i+1;j<=i+6&&j<lines.length;j++){
      const nx=lines[j];
      if(matchVakNaam(nx))break; // nieuw vak gevonden

      // "SE 8,4" of "SE8,4" of "SE: 8,4"
      const seM=nx.match(/\bSE\s*:?\s*([0-9]{1,2}[,.]?[0-9]+)\b/i);
      if(seM){const g=toGrade(seM[1]);if(g&&!found[vid]){found[vid]=g;i=j;}break;}

      // Puur cijfer op eigen regel: "8,4" of "8.4" of "10"
      const barM=nx.match(/^([0-9]{1,2}[,.][0-9]|10)\s*$/);
      if(barM){const g=toGrade(barM[1]);if(g&&!found[vid]){found[vid]=g;i=j;}break;}
    }
  }

  return found;
}

// Tijdelijk opslaan van geparste import voor preview-bevestiging
let _pendingImport=null;

function doImport(app){
  const resultId=app==='unified'?'imp-result-unified':('imp-result-'+app);
  const textareaId=app==='unified'?'imp-paste-unified':('imp-paste-'+app);
  const textarea=document.getElementById(textareaId);
  const result=document.getElementById(resultId);
  const text=textarea.value.trim();

  if(!text){
    result.innerHTML='<strong>Plak eerst tekst</strong> van Magister of SomToday hierboven.';
    result.className='import-result err';return;
  }

  const parsed=parseCijferText(text);
  const keys=Object.keys(parsed);

  if(keys.length===0){
    result.innerHTML=`<strong>Geen cijfers herkend.</strong><br>
Tips:<br>
• Kopieer de <em>volledige</em> pagina: <kbd>Ctrl+A</kbd> → <kbd>Ctrl+C</kbd><br>
• Zorg dat je op de <strong>cijferpagina</strong> staat (niet het dashboard)<br>
• Probeer zowel Magister als SomToday`;
    result.className='import-result err';return;
  }

  // Sla op voor bevestiging
  _pendingImport=parsed;

  // Toon preview met bevestigknop
  const rows=keys.map(k=>{
    const naam=getVK().find(v=>v.id===k)?.naam||k;
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.07)">
      <span style="font-weight:600">${naam}</span>
      <span style="font-size:18px;font-weight:800;color:var(--or)">${parsed[k]}</span>
    </div>`;
  }).join('');

  result.innerHTML=`
    <div style="font-weight:700;margin-bottom:8px">✅ ${keys.length} vak${keys.length===1?'':'ken'} herkend — klopt dit?</div>
    <div style="margin-bottom:12px">${rows}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="import-go-btn" style="flex:1;min-width:140px" onclick="doImportConfirm('${app}')">💾 Ja, sla op</button>
      <button class="import-go-btn" style="flex:1;min-width:100px;background:transparent;border:1.5px solid var(--or);color:var(--or)" onclick="document.getElementById('${resultId}').innerHTML='';_pendingImport=null">✕ Annuleer</button>
    </div>`;
  result.className='import-result ok';
}

function doImportConfirm(app){
  if(!_pendingImport)return;
  const resultId=app==='unified'?'imp-result-unified':('imp-result-'+app);
  const textareaId=app==='unified'?'imp-paste-unified':('imp-paste-'+app);
  const result=document.getElementById(resultId);
  const textarea=document.getElementById(textareaId);
  const keys=Object.keys(_pendingImport);
  const existing=getSavedCijfers();
  const merged={...existing,..._pendingImport};
  cloudSet(lvlCol('cijfers'),merged);
  try{pushSyncBundle();}catch(e){}
  buildCijferGrid();
  buildGrid();
  result.innerHTML=`✓ <strong>${keys.length} vak${keys.length===1?'':'ken'}</strong> opgeslagen: ${keys.map(k=>getVK().find(v=>v.id===k)?.naam||k).join(', ')}`;
  result.className='import-result ok';
  textarea.value='';
  _pendingImport=null;
}

function updateProfileNav(){
  const btn=document.getElementById('home-prof-btn');
  if(!btn)return;
  if(!currentUser){
    btn.className='hnav-icon-btn hnav-login-cta';
    btn.dataset.tip='';
    btn.setAttribute('aria-label','Inloggen');
    btn.innerHTML=`<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>Inloggen`;
    return;
  }
  btn.className='hnav-icon-btn';
  const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  const liveAvatar=getMyCurrentAvatar();
  if(p.naam&&liveAvatar!=='🐾'){
    btn.dataset.tip=p.naam.split(' ')[0];
    btn.innerHTML=`<div class="dock-avatar" style="font-size:16px;background:transparent">${liveAvatar}</div>`;
  }else if(p.naam){
    const initials=p.naam.trim().split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
    btn.dataset.tip=p.naam.split(' ')[0];
    btn.innerHTML=`<div class="dock-avatar dock-avatar-ini">${initials}</div>`;
  }else{
    btn.dataset.tip='Profiel';
    btn.innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  }
}

function openProfiel(){
  if(!currentUser){show('sc-auth');return;}
  loadProfile();
  buildCijferGrid();
  updateCloudStatusBar();
  buildMijnStats();
  renderProfileBadges();
  renderNotifStatus();
  applyAccPrefs();
  show('sc-profiel');
}

function buildMijnStats(){
  const el=document.getElementById('mijn-stats-content');
  if(!el)return;
  const prof=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  const myNaam=prof.naam||null;
  if(!myNaam){el.innerHTML='<p style="color:var(--mu);font-size:13px">Sla eerst je naam op om statistieken bij te houden.</p>';return;}
  // Gather all my entries (both levels)
  const entriesH=JSON.parse(localStorage.getItem('examenapp_leaderboard_havo')||'[]');
  const entriesV=JSON.parse(localStorage.getItem('examenapp_leaderboard_vwo')||'[]');
  const mine=[...entriesH,...entriesV].filter(e=>!e.isBot&&e.naam===myNaam);
  if(!mine.length){el.innerHTML='<p style="color:var(--mu);font-size:13px">Maak eerst een quiz om statistieken te zien.</p>';return;}
  // Aggregate
  const bestScore=Math.max(...mine.map(e=>e.score));
  const totalGoed=mine.reduce((s,e)=>s+(e.goed||0),0);
  const totalTot=mine.reduce((s,e)=>s+(e.tot||0),0);
  const accuracy=totalTot>0?Math.round(totalGoed/totalTot*100):0;
  const avgSpeed=+(mine.reduce((s,e)=>s+(e.avgTijd||0),0)/mine.length).toFixed(1);
  const totalQuizzes=mine.length;
  // Streak from localStorage
  const streakKey='examenapp_streak';
  const streakData=JSON.parse(localStorage.getItem(streakKey)||'{}');
  const streak=streakData.current||0;
  // Fav subject
  const vakMap={};mine.forEach(e=>{vakMap[e.vakNaam]=(vakMap[e.vakNaam]||0)+1;});
  const favVak=Object.entries(vakMap).sort((a,b)=>b[1]-a[1])[0]?.[0]||'–';
  // Best per vak
  const bestPerVak={};
  mine.forEach(e=>{if(!bestPerVak[e.vakNaam]||e.score>bestPerVak[e.vakNaam].score)bestPerVak[e.vakNaam]=e;});
  const topVakken=Object.values(bestPerVak).sort((a,b)=>b.score-a.score).slice(0,4);
  // Tier
  function tierLabel(s){if(s>=850)return'🏆 Elite';if(s>=650)return'⚡ Expert';if(s>=400)return'📚 Gevorderd';if(s>=150)return'✏️ Leerling';return'🌱 Beginner';}
  function tierCls(s){if(s>=850)return'lb-tier-elite';if(s>=650)return'lb-tier-expert';if(s>=400)return'lb-tier-gevorderd';if(s>=150)return'lb-tier-leerling';return'lb-tier-beginner';}
  const vakHtml=topVakken.map(e=>`<div class="ms-vak-row"><span class="ms-vak-naam">${e.vakNaam}${e.domeinId?` · D${e.domeinId}`:''}</span><span style="display:flex;align-items:center;gap:8px"><span style="font-size:11px;color:var(--mu)">${e.goed||0}/${e.tot||0} goed</span><span class="ms-vak-score">${e.score} pts</span></span></div>`).join('');
  el.innerHTML=`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <span class="lb-niveau-chip">${APP_LEVEL.toUpperCase()}</span>
      <span class="lb-tier ${tierCls(bestScore)}">${tierLabel(bestScore)}</span>
    </div>
    <div class="ms-grid">
      <div class="ms-card">
        <div class="ms-val">${bestScore}</div>
        <div class="ms-lbl">⚡ Beste score</div>
        <div class="ms-bar-wrap"><div class="ms-bar" style="width:${bestScore/10}%"></div></div>
      </div>
      <div class="ms-card">
        <div class="ms-val">${accuracy}%</div>
        <div class="ms-lbl">🎯 Nauwkeurigheid</div>
        <div class="ms-bar-wrap"><div class="ms-bar" style="width:${accuracy}%"></div></div>
      </div>
      <div class="ms-card">
        <div class="ms-val">${totalQuizzes}</div>
        <div class="ms-lbl">📋 Quizzes gespeeld</div>
      </div>
      <div class="ms-card">
        <div class="ms-val">${streak}</div>
        <div class="ms-lbl">🔥 Dagstreak</div>
      </div>
    </div>
    <div class="ms-row"><span class="ms-key">⏱ Gem. reactietijd</span><span class="ms-val2">${avgSpeed}s per vraag</span></div>
    <div class="ms-row"><span class="ms-key">✅ Totaal goed</span><span class="ms-val2">${totalGoed} / ${totalTot} vragen</span></div>
    <div class="ms-row"><span class="ms-key">❤️ Favoriete vak</span><span class="ms-val2">${favVak}</span></div>
    ${topVakken.length?`<p style="font-size:10px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px">Beste quizzes</p><div style="display:flex;flex-direction:column;gap:6px">${vakHtml}</div>`:''}
  `;
}

function prefillCalcFromSaved(){
  buildSlaagInputs();
  buildEindVakSelect();
  buildNtermVakSelect();
  buildHerkSelect();
  const firstId=document.getElementById('herk-vak')?.value;
  if(firstId)buildHerkSERow(firstId);
}

// ═══════ OPEN VAK ═══════
function openVak(id,_noHash){
  ST.vak=getVK().find(v=>v.id===id);
  if(!_noHash)_pushHash(APP_LEVEL+'-'+(_VAK_SLUG[id]||id));
  document.getElementById('dtitle').textContent=ST.vak.naam;
  document.getElementById('ddesc').textContent=ST.vak.beschrijving;
  document.getElementById('dce').innerHTML=ST.vak.ceInfo;
  const _bcVak=document.getElementById('det-bc-vak');
  if(_bcVak)_bcVak.textContent=ST.vak.naam;
  // Remove previously injected exam-meta + yt-card + grade-panel + ce-archief-card (avoid stacking on revisit)
  document.querySelectorAll('.exam-meta,.yt-card,.grade-panel,.ce-archief-card').forEach(el=>el.remove());
  // Exam metadata
  let metaHtml='<div class="exam-meta">';
  if(ST.vak.exDatum)metaHtml+=`<span class="em-chip em-date">📅 ${ST.vak.exDatum.split('-').reverse().join('-')} · ${ST.vak.exTijd}</span>`;
  if(ST.vak.exDuur)metaHtml+=`<span class="em-chip">⏱ ${ST.vak.exDuur}</span>`;
  if(ST.vak.hulpmiddelen)metaHtml+=`<span class="em-chip">📋 ${ST.vak.hulpmiddelen}</span>`;
  metaHtml+='</div>';
  if(ST.vak.youtubeKanaal&&ST.vak.youtubeUrl)metaHtml+=`<a class="yt-card" href="${ST.vak.youtubeUrl}" target="_blank" rel="noopener"><div class="yt-icon"><svg viewBox="0 0 24 24"><path d="M23.5 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.8 2.8 12 2.8 12 2.8s-4.8 0-7.3.1c-.6.1-1.9.1-3 1.3C.8 5 .5 7 .5 7S.2 9.3.2 11.5v2.1c0 2.2.3 4.5.3 4.5s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.2 22.2 12 22.2 12 22.2s4.8 0 7.3-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.3.3-4.5v-2.1C23.8 9.3 23.5 7 23.5 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/></svg></div><div class="yt-info"><span class="yt-label">Aanbevolen YouTube-kanaal</span><span class="yt-name">${ST.vak.youtubeKanaal}</span></div><span class="yt-arr">→</span></a>`;
  // Echte CE-examens archief
  // EXAMENS_BASE_URL: zet op je eigen Supabase URL na uploaden met upload-examens-supabase.js
  // Voorbeeld: 'https://xxxx.supabase.co/storage/v1/object/public/examens'
  // Laat leeg ('') om de AlleExamens.nl fallback te gebruiken.
  const _EXAMENS_BASE = 'https://sxrjdssmgwwygtskovyc.supabase.co/storage/v1/object/public/examens';
  const _aeNames={nl:'Nederlands',wa:'Wiskunde A',wb:'Wiskunde B',bi:'Biologie',sk:'Scheikunde',na:'Natuurkunde',en:'Engels',ec:'Economie',be:'Bedrijfseconomie',gs:'Geschiedenis',ak:'Aardrijkskunde',mw:'Maatschappijwetenschappen',de:'Duits',fr:'Frans',la:'Latijn',gr:'Grieks',in:'Informatica'};
  const _aeLvl=(ST.niveau||'havo').toUpperCase();
  const _niveau=(ST.niveau||'havo').toLowerCase();
  const _aeName=_aeNames[ST.vak.id];
  if(_aeName){
    const _enc=encodeURIComponent(_aeName);
    const _mkPdf=(year,tv,type)=>_EXAMENS_BASE
      ?`${_EXAMENS_BASE}/${_niveau}/${ST.vak.id}/${year}/${tv}/${type}.pdf`
      :`https://static.alleexamens.nl/${_aeLvl}/${_enc}/${year}/${tv}/${_enc}/${_enc}%20${year}%20${tv}_${type}.pdf`;
    const _bundel=_EXAMENS_BASE
      ?`${_EXAMENS_BASE}/${_niveau}/${ST.vak.id}/bundel.pdf`
      :`https://static.alleexamens.nl/${_aeLvl}/${_enc}/Examenbundels/Examenbundel_Compleet_${_aeLvl}_${_enc}.pdf`;
    const _jaren=[2025,2024,2023,2022,2021,2019];
    // Eerste CE-jaar van huidig examenprogramma per vak en niveau (bron: examenblad.nl / slo.nl)
    const _svData={
      havo:{wa:2017,wb:2017,bi:2024,sk:2024,na:2024,be:2021,gs:2020,ak:2025,ec:2023},
      vwo: {wa:2018,wb:2018,bi:2025,sk:2025,na:2025,gs:2021,ak:2026,ec:2023,mw:2020,la:2017,gr:2017,in:2022}
    };
    const _svVanaf=((_svData[(ST.niveau||'havo').toLowerCase()])||{})[ST.vak.id]||2019;
    const _svBadge=y=>y>=_svVanaf
      ?`<span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.3);color:#22c55e;letter-spacing:.2px;vertical-align:middle">✓ Zelfde syllabus</span>`
      :`<span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;background:rgba(234,179,8,.1);border:1px solid rgba(234,179,8,.3);color:#ca8a04;letter-spacing:.2px;vertical-align:middle" title="Huidig CE-programma geldt v.a. ${_svVanaf} (bron: examenblad.nl). Dit examen kan stof bevatten die niet meer in het syllabus staat, of nieuwe stof missen.">⚠ Ander syllabus (v.a. ${_svVanaf})</span>`;
    let _ch=`<div class="ce-archief-card" style="margin-top:16px;border-radius:16px;overflow:hidden;border:1.5px solid rgba(var(--or-rgb),.4);background:linear-gradient(135deg,rgba(var(--or-rgb),.08),rgba(var(--or-rgb),.03))"><div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;cursor:pointer;gap:10px;user-select:none" onclick="this.closest('.ce-archief-card').classList.toggle('open')"><div style="display:flex;align-items:center;gap:10px"><div style="width:36px;height:36px;border-radius:10px;background:rgba(var(--or-rgb),.18);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">📄</div><div><div style="font-size:14px;font-weight:800;color:var(--or)">Echte CE-examens</div><div style="font-size:11px;color:var(--mu);margin-top:1px">${_aeName} · opgaven + antwoorden · 2019–2025</div></div></div><div style="width:28px;height:28px;border-radius:8px;background:rgba(var(--or-rgb),.15);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--or);flex-shrink:0;transition:transform .22s" class="ce-arr">▼</div></div><div class="ce-archief-body" style="display:none;padding:0 16px 16px">`;
    _ch+=`<a href="${_bundel}" target="_blank" rel="noopener" class="ce-bundel-btn">📦 Download complete examenbundel — alle jaren in één PDF</a><div style="display:flex;align-items:flex-start;gap:8px;background:rgba(234,179,8,.08);border:1px solid rgba(234,179,8,.3);border-radius:10px;padding:9px 12px;margin-bottom:14px;font-size:12px;color:#ca8a04;line-height:1.5"><span style="font-size:15px;flex-shrink:0">⚠️</span><span><strong>Let op: zeer groot bestand.</strong> Deze PDF bevat alle examenjaren en kan honderden MB's groot zijn. Dit kan je browser of computer tijdelijk laten vastlopen. Download liever de losse examens per jaar hieronder.</span></div>`;
    _jaren.forEach(year=>{
      _ch+=`<div class="ce-jaar-blok"><div class="ce-jaar-lbl" style="display:flex;align-items:center;gap:7px">${year}${year===2020?' (geannuleerd — COVID)':''} ${_svBadge(year)}</div><div class="ce-tv-row">`;
      if(year!==2020){['I','II'].forEach(tv=>{
        const _urlOpg=_mkPdf(year,tv,'opgaven');
        const _urlCv=_mkPdf(year,tv,'correctievoorschrift');
        const _titleOpg=`${_aeName} ${year} Tijdvak ${tv} — Opgaven`;
        const _titleCv=`${_aeName} ${year} Tijdvak ${tv} — Antwoorden`;
        _ch+=`<div class="ce-tv-col"><div class="ce-tv-title">Tijdvak ${tv}</div>`;
        _ch+=`<button class="ce-pdf-btn" onclick="openPdfViewer('${_urlOpg}','${_titleOpg.replace(/'/g,"\\'")}')">📋 Opgaven</button>`;
        _ch+=`<button class="ce-pdf-btn ce-pdf-cv" onclick="openPdfViewer('${_urlCv}','${_titleCv.replace(/'/g,"\\'")}')">✅ Antwoorden</button>`;
        _ch+=`</div>`;
      });}
      _ch+=`</div></div>`;
    });
    _ch+=`<div style="font-size:11px;color:var(--mu);margin-top:10px;padding-top:10px;border-top:1px solid var(--bo)">${_EXAMENS_BASE?'Examens gehost door Slagio':'Examens via <a href="https://www.alleexamens.nl" target="_blank" rel="noopener" style="color:var(--mu)">AlleExamens.nl</a>'} · Syllabus &amp; normering: <a href="https://www.examenblad.nl" target="_blank" rel="noopener" style="color:var(--mu)">Examenblad.nl</a></div></div></div>`;
    metaHtml+=_ch;
  }
  document.getElementById('dce').insertAdjacentHTML('afterend',metaHtml);

  // Grade panel (SE cijfer + benodigde CE)
  const cijfers=getSavedCijfers();
  const cij=cijfers[ST.vak.id];
  if(cij!=null){
    const ceNodig=Math.round(Math.max(1,Math.min(10,11-cij))*10)/10;
    const kleur=cij>=7?'#4ADE80':cij>=5.5?'#FCD34D':'#F87171';
    const status=cij>=7?'Goed op koers — focus op je zwakste CE-domeinen 🎯':cij>=5.5?'CE hard nodig — oefen intensief 📚':'CE is cruciaal — elke punt telt ⚠️';
    const ceTxt=cij>=9?'Je hebt al bijna genoeg zonder CE':ceNodig<=1?'Minimale CE voldoende':`CE-score ≥ ${ceNodig.toFixed(1).replace('.',',')} voor een voldoende`;
    // Quiz insight section inside grade panel
    const vpData=getVakBestPct(ST.vak.id);
    let quizInsightHtml='';
    if(vpData.hasData){
      const estCE=Math.round((1+9*vpData.pct)*10)/10;
      const estCEStr=estCE.toFixed(1).replace('.',',');
      const estColor=estCE>=ceNodig?'#4ADE80':estCE>=ceNodig-1?'#FCD34D':'#F87171';
      // Find weakest domain
      let weakestDomein=null;let weakestPct=2;
      ST.vak.domeinen.forEach(d=>{
        const dr=getDomeinBestPct(ST.vak.id,d.id);
        if(dr.hasData&&dr.pct<weakestPct){weakestPct=dr.pct;weakestDomein=d;}
      });
      const weakHtml=weakestDomein?`<div class="gp-weak-domain">
        <span class="gp-weak-txt">⚡ Zwakste domein: <strong>${weakestDomein.naam}</strong> (${Math.round(weakestPct*100)}%) — oefen dit nu voor de meeste winst</span>
        <button class="gp-weak-btn" onclick="openQmode('${weakestDomein.id}')">Oefen →</button>
      </div>`:'';
      quizInsightHtml=`<div class="gp-quiz-insight">
        <div class="gp-est-ce"><span>📈 Geschatte CE op basis van oefenscore:</span><span class="gp-est-val" style="color:${estColor}">${estCEStr}</span><span style="font-size:11px;color:var(--mu)">Gebaseerd op je beste quizresultaten</span></div>
        ${weakHtml}
      </div>`;
    }
    const gpHtml=`<div class="grade-panel">
      <div class="gp-se"><span class="gp-lbl">SE-cijfer</span><span class="gp-val" style="color:${kleur}">${cij.toFixed(1).replace('.',',')}</span></div>
      <div class="gp-div"></div>
      <div class="gp-ce"><span class="gp-lbl">Benodigde CE</span><span class="gp-ce-val">${ceTxt}</span></div>
      <div class="gp-status">${status}</div>
      ${quizInsightHtml}
    </div>`;
    document.querySelector('.exam-meta').insertAdjacentHTML('afterend',gpHtml);
  }

  // Progress overview
  const poGrid=document.getElementById('po-grid');
  const poBox=document.getElementById('progress-overview');
  poGrid.innerHTML='';
  let hasAnyProgress=false;
  ST.vak.domeinen.forEach(d=>{
    const r=getDomeinBestPct(ST.vak.id,d.id);
    if(r.hasData)hasAnyProgress=true;
    const pctVal=Math.round(r.pct*100);
    const scoreColor=pctVal>=70?'#4ADE80':pctVal>=50?'#FCD34D':'var(--mu)';
    poGrid.innerHTML+=`<div class="po-item">
      <div class="po-letter" style="background:${ST.vak.kleur}22;color:${ST.vak.kleur}">${d.id}</div>
      <div class="po-info"><div class="po-name">${d.naam}</div><div class="po-score" style="color:${r.hasData?scoreColor:'var(--mu)'}">${r.hasData?pctVal+'% beste score':'Nog niet geoefend'}</div></div>
    </div>`;
  });
  poBox.style.display=hasAnyProgress?'block':'none';

  const dl=document.getElementById('dlist');
  dl.innerHTML='';
  ST.vak.domeinen.forEach(d=>{
    const r=getDomeinBestPct(ST.vak.id,d.id);
    const decay=getDecayStatus(ST.vak.id,d.id);
    const decayDot=decay?`<span class="decay-dot" style="background:${decay.color};color:${decay.color}" title="${decay.label}"></span>`:'';
    const bestChip=r.hasData?`<span style="font-size:11px;color:var(--mu);font-weight:600;margin-left:4px">Record: ${Math.round(r.pct*100)}%</span>`:'';
    const _pbData=getPB(ST.vak.id,d.id);
    const pbChip=_pbData?`<span class="pb-chip">⭐ PB: ${Math.round(_pbData.score*100)}%</span>`:'';
    const progHtml=r.hasData?`<div class="dom-progress"><div class="dp-bar"><div class="dp-fill" style="width:${Math.round(r.pct*100)}%"></div></div><span class="dp-txt">${Math.round(r.pct*100)}%${bestChip}${pbChip}</span></div>`:'';
    const _ceMap={'CE':{cls:'CE',icon:'📝',txt:'Centraal Examen'},'SE':{cls:'SE',icon:'📋',txt:'Schoolexamen'},'CE+SE':{cls:'CESE',icon:'📝📋',txt:'CE + Schoolexamen'},'DEELS CE':{cls:'DEELS',icon:'📝',txt:'Deels CE'}};
    const _csInfo=d.ceStatus&&_ceMap[d.ceStatus];
    const csBadge=_csInfo?`<div class="dom-ce-badge dom-ce-${_csInfo.cls}">${_csInfo.icon} ${_csInfo.txt}</div>`:'';
    const el=document.createElement('div');
    el.className='dc2';
    el.dataset.domeinId=d.id;
    el.innerHTML=`
      <div class="dh" onclick="toggleD('top-${d.id}')">
        <div class="dlet" style="background:${ST.vak.kleur}22;color:${ST.vak.kleur}">${d.id}</div>
        <div class="di"><h4>Domein ${d.id}: ${d.naam}${decayDot}</h4>${csBadge}<p>${d.beschrijving}</p>${progHtml}</div>
        <div class="dbtns">
          <button class="fav-btn${isFav(ST.vak.id,d.id)?' active':''}" id="fav-${d.id}" onclick="event.stopPropagation();const on=toggleFav('${ST.vak.id}','${d.id}');this.classList.toggle('active',on)">⭐</button>
          <button class="exb" id="exb-${d.id}" onclick="event.stopPropagation();toggleD('top-${d.id}')">▼ Leerstof</button>
          <button class="qb" onclick="event.stopPropagation();openQmode('${d.id}')">▶ Quiz</button>
        </div>
      </div>
      <div class="dtop" id="top-${d.id}">
        <div class="dtab-bar">
          <button class="dtab-btn dtab-active" data-tab="theorie">📖 Theorie</button>
          <button class="dtab-btn" data-tab="quiz">⚡ Test jezelf</button>
          <button class="dtab-btn dtab-vid-tab" data-tab="vids" style="display:none">📹 Video's</button>
        </div>
        <div class="dtab-pane dtab-vis" data-tab-id="theorie">
          <p class="dom-intro">${d.beschrijving}</p>
          <div class="tlbl" style="margin-top:14px">CE-onderwerpen</div>
          <div class="ttags">${d.onderwerpen.map(o=>`<span class="tt">${o}</span>`).join('')}</div>
          <div class="tlbl">Samenvatting</div>
          <div class="sam">${SAM_RICH[ST.vak.id+'_'+d.id]||d.sam}</div>
          ${d.val&&d.val.length?`<div class="sam-val"><ul>${d.val.map(v=>`<li>${v}</li>`).join('')}</ul></div>`:''}
          ${d.binas&&d.binas.length?`<div class="sam-binas">${d.binas.map(b=>`<span class="sam-binas-tag">${b}</span>`).join('')}</div>`:''}
          <div class="sam-cta"><button class="sam-cta-btn" onclick="event.stopPropagation();openQmode('${d.id}')">▶ Oefenen op dit domein</button><button class="sam-print-btn" onclick="event.stopPropagation();printSam()">📄 Samenvatting printen</button></div>
        </div>
        <div class="dtab-pane" data-tab-id="quiz"></div>
        <div class="dtab-pane" data-tab-id="vids"></div>
      </div>`;
    dl.appendChild(el);
    initSamInteractive(el, d);
  });
  initMf();
  updateLpEntryCard();
  // Examen entry button — toon alleen als er een echt examen beschikbaar is voor dit vak + niveau
  const _exBtn = document.getElementById('exam-entry-btn');
  const _exSub = document.getElementById('exam-entry-sub');
  const _allEx = typeof EXAMENS !== 'undefined' && EXAMENS[ST.vak.id];
  const _exLijst = _allEx ? _allEx.filter(e=>!e.niveau||e.niveau===APP_LEVEL) : [];
  if(_exBtn){
    if(_exLijst.length > 0){
      const _ex0 = _exLijst[0];
      _exBtn.style.display = '';
      if(_exSub) _exSub.textContent = `${_ex0.jaar} Tijdvak ${_ex0.tijdvak} · ${_ex0.vragen.length} vragen · ${_ex0.duur_minuten} min`;
    } else {
      _exBtn.style.display = 'none';
    }
  }
  show('sc-detail');
}

// ── LESMETHODE FILTER LOGIC ──────────────────────────────
function initMf(){
  const vak=ST.vak;
  const el=document.getElementById('methode-filter');
  if(!vak||!el)return;
  const niveau=(ST.niveau||'havo').toLowerCase();
  const vakData=LESMETHODES[vak.id];
  const methodes=vakData?(vakData[niveau]||vakData.havo||[]):[];
  if(!methodes.length){el.style.display='none';return;}
  el.style.display='';
  const mSel=document.getElementById('mf-methode');
  mSel.innerHTML='<option value="">— Kies methode —</option>'+
    methodes.map(m=>`<option value="${m.id}">${m.naam} · ${m.uitgever}</option>`).join('');
  const hSel=document.getElementById('mf-hoofdstuk');
  hSel.style.display='none';hSel.disabled=true;
  document.getElementById('mf-chip').style.display='none';
  const saved=_mfLoad(vak.id+'_'+niveau);
  if(saved&&saved.methodeId){
    mSel.value=saved.methodeId;
    _mfFillHfdst(saved.methodeId,methodes,false);
    if(saved.hfdstNr){
      hSel.value=String(saved.hfdstNr);
      _mfApply(saved.methodeId,saved.hfdstNr,methodes);
    }
    el.classList.add('open');
  }
}
function _mfFillHfdst(mid,methodes,reset){
  const m=methodes.find(x=>x.id===mid);
  const hSel=document.getElementById('mf-hoofdstuk');
  if(!m){hSel.style.display='none';return;}
  hSel.innerHTML='<option value="">— Kies hoofdstuk —</option>'+
    m.hoofdstukken.map(h=>`<option value="${h.nr}">H${h.nr}: ${h.titel}</option>`).join('');
  hSel.style.display='';hSel.disabled=false;
  if(reset)hSel.value='';
}
function _mfApply(mid,hnr,methodes){
  const m=methodes.find(x=>x.id===mid);
  if(!m)return;
  const h=m.hoofdstukken.find(x=>x.nr===hnr);
  if(!h)return;
  document.querySelectorAll('#dlist [data-domein-id]').forEach(el=>{
    el.style.display=h.domeinen.includes(el.dataset.domeinId)?'':'none';
  });
  const chip=document.getElementById('mf-chip');
  const txt=document.getElementById('mf-chip-txt');
  if(chip)chip.style.display='flex';
  if(txt)txt.textContent=`${m.naam} · H${hnr}: ${h.titel} (domein${h.domeinen.length>1?'en':''} ${h.domeinen.join(', ')})`;
}
function onMfMethodeChange(){
  const vak=ST.vak;if(!vak)return;
  const niveau=(ST.niveau||'havo').toLowerCase();
  const vakData=LESMETHODES[vak.id];
  const methodes=vakData?(vakData[niveau]||vakData.havo||[]):[];
  const mid=document.getElementById('mf-methode').value;
  if(!mid){resetMf();return;}
  _mfFillHfdst(mid,methodes,true);
  document.getElementById('mf-chip').style.display='none';
  document.querySelectorAll('#dlist [data-domein-id]').forEach(el=>el.style.display='');
  _mfClear(vak.id+'_'+niveau);
}
function onMfHoofdstukChange(){
  const vak=ST.vak;if(!vak)return;
  const niveau=(ST.niveau||'havo').toLowerCase();
  const vakData=LESMETHODES[vak.id];
  const methodes=vakData?(vakData[niveau]||vakData.havo||[]):[];
  const mid=document.getElementById('mf-methode').value;
  const hnr=parseInt(document.getElementById('mf-hoofdstuk').value);
  if(!mid||!hnr){
    document.getElementById('mf-chip').style.display='none';
    document.querySelectorAll('#dlist [data-domein-id]').forEach(el=>el.style.display='');
    return;
  }
  _mfApply(mid,hnr,methodes);
  _mfSave(vak.id+'_'+niveau,mid,hnr);
}
function resetMf(){
  const vak=ST.vak;
  const niveau=(ST.niveau||'havo').toLowerCase();
  const mSel=document.getElementById('mf-methode');
  const hSel=document.getElementById('mf-hoofdstuk');
  if(mSel)mSel.value='';
  if(hSel){hSel.innerHTML='<option value="">— Kies hoofdstuk —</option>';hSel.style.display='none';hSel.disabled=true;}
  document.getElementById('mf-chip').style.display='none';
  document.querySelectorAll('#dlist [data-domein-id]').forEach(el=>el.style.display='');
  if(vak)_mfClear(vak.id+'_'+niveau);
}
function _mfSave(key,mid,hnr){
  try{const d=JSON.parse(localStorage.getItem('slg_mf')||'{}');d[key]={methodeId:mid,hfdstNr:hnr};localStorage.setItem('slg_mf',JSON.stringify(d));}catch(e){}
}
function _mfLoad(key){
  try{return JSON.parse(localStorage.getItem('slg_mf')||'{}')[key]||null;}catch(e){return null;}
}
function _mfClear(key){
  try{const d=JSON.parse(localStorage.getItem('slg_mf')||'{}');delete d[key];localStorage.setItem('slg_mf',JSON.stringify(d));}catch(e){}
}

function updateLpEntryCard(){
  if(!ST.vak)return;
  const vak=ST.vak;
  const domeinen=vak.domeinen;
  let doneCount=0,startedCount=0,totalPct=0,pctCount=0;
  domeinen.forEach(d=>{
    const r=getDomeinBestPct(vak.id,d.id);
    const decay=getDecayStatus(vak.id,d.id);
    const isDone=r.pct>=0.7;
    const needsReview=isDone&&decay&&(decay.label.includes('geleden')&&!decay.label.includes('Vandaag'));
    if(isDone)doneCount++;
    else if(r.hasData)startedCount++;
    if(r.hasData){totalPct+=r.pct;pctCount++;}
  });
  const overallPct=Math.round(doneCount/domeinen.length*100);
  const allDone=doneCount===domeinen.length&&domeinen.length>0;

  // Sub text
  const sub=document.getElementById('lp-ec-sub');
  if(sub){
    if(allDone) sub.textContent='🏆 Alle domeinen voltooid!';
    else if(doneCount>0) sub.textContent=`${doneCount} van ${domeinen.length} domeinen voltooid`;
    else if(startedCount>0) sub.textContent=`${startedCount} domein${startedCount>1?'en':''} gestart — ga door!`;
    else sub.textContent='Begin met het eerste domein →';
  }

  // Footer
  const foot=document.getElementById('lp-ec-foot');
  if(foot) foot.textContent=`${doneCount}/${domeinen.length} domeinen op ≥70%${allDone?' 🎯':''}`;

  // Domain dots
  const dotsEl=document.getElementById('lp-ec-dots');
  if(dotsEl){
    dotsEl.innerHTML=domeinen.map(d=>{
      const r=getDomeinBestPct(vak.id,d.id);
      const decay=getDecayStatus(vak.id,d.id);
      const isDone=r.pct>=0.7;
      const needsReview=isDone&&decay&&(decay.label.includes('geleden')&&!decay.label.includes('Vandaag'));
      let cls='lp-ec-dot';
      if(needsReview) cls+=' d-review';
      else if(isDone) cls+=' d-done';
      else if(r.hasData) cls+=' d-started';
      return `<div class="${cls}" title="Domein ${d.id}: ${d.naam}"></div>`;
    }).join('');
  }

  // Progress bar (with tiny delay for animation)
  const bar=document.getElementById('lp-ec-bar');
  if(bar){
    bar.style.width='0%';
    setTimeout(()=>{bar.style.width=overallPct+'%';},80);
  }
}

// ═══════ UITLEG VIDEOS PER DOMEIN ═══════
// Voeg hier YouTube video-ID's toe per vak → domein.
// Formaat: UITLEG_VIDEOS[vakId][domeinId] = [{id:'YT_ID', titel:'...', kanaal:'...'}]
// Laat een domein weg of gebruik een lege array als er geen video is.
const UITLEG_VIDEOS = {
  nl: {
    A: [{id:'dQw4w9WgXcQ',titel:'Argumenteren & redeneren',kanaal:'ExamenTrainer NL'}],
    B: [{id:'dQw4w9WgXcQ',titel:'Leesvaardigheid – strategieën',kanaal:'ExamenTrainer NL'}],
    C: [{id:'dQw4w9WgXcQ',titel:'Luistervaardigheid uitgelegd',kanaal:'ExamenTrainer NL'}],
    D: [{id:'dQw4w9WgXcQ',titel:'Schrijfvaardigheid: opbouw tekst',kanaal:'ExamenTrainer NL'}],
    E: [{id:'dQw4w9WgXcQ',titel:'Stellen & formuleren',kanaal:'ExamenTrainer NL'}],
    F: [{id:'dQw4w9WgXcQ',titel:'Spreken & gesprekken voeren',kanaal:'ExamenTrainer NL'}]
  },
  wa: {
    B: [{id:'dQw4w9WgXcQ',titel:'Verbanden & veranderingen',kanaal:'WiskundeAcademie'}],
    C: [{id:'dQw4w9WgXcQ',titel:'Meetkunde – basisconcepten',kanaal:'WiskundeAcademie'}],
    D: [{id:'dQw4w9WgXcQ',titel:'Statistiek & kansen',kanaal:'WiskundeAcademie'}],
    E: [{id:'dQw4w9WgXcQ',titel:'Discrete wiskunde',kanaal:'WiskundeAcademie'}]
  },
  bi: {
    A: [{id:'dQw4w9WgXcQ',titel:'Cellen & stofwisseling',kanaal:'BioExamen'}],
    M: [{id:'dQw4w9WgXcQ',titel:'Organismen & ecosystemen',kanaal:'BioExamen'}],
    O: [{id:'dQw4w9WgXcQ',titel:'Evolutie & erfelijkheid',kanaal:'BioExamen'}],
    P: [{id:'dQw4w9WgXcQ',titel:'Mens & omgeving',kanaal:'BioExamen'}]
  },
  en: {
    A: [{id:'dQw4w9WgXcQ',titel:'Reading comprehension strategies',kanaal:'English HAVO'}],
    B: [{id:'dQw4w9WgXcQ',titel:'Listening skills – exam tips',kanaal:'English HAVO'}],
    C: [{id:'dQw4w9WgXcQ',titel:'Writing: essay structure',kanaal:'English HAVO'}],
    D: [{id:'dQw4w9WgXcQ',titel:'Speaking & conversation',kanaal:'English HAVO'}],
    E: [{id:'dQw4w9WgXcQ',titel:'Vocabulary in context',kanaal:'English HAVO'}],
    F: [{id:'dQw4w9WgXcQ',titel:'Grammar essentials',kanaal:'English HAVO'}]
  },
  ec: {
    B: [{id:'dQw4w9WgXcQ',titel:'Vraag & aanbod uitgelegd',kanaal:'EconomieExamen'}],
    C: [{id:'dQw4w9WgXcQ',titel:'Overheid & markt',kanaal:'EconomieExamen'}],
    D: [{id:'dQw4w9WgXcQ',titel:'Macro-economie basics',kanaal:'EconomieExamen'}],
    E: [{id:'dQw4w9WgXcQ',titel:'Internationale economie',kanaal:'EconomieExamen'}]
  }
};

function initSamInteractive(container, d) {
  // 1. Collapsible sam-head sections
  const samEl = container.querySelector('.sam');
  if (samEl) {
    samEl.querySelectorAll('.sam-head').forEach(h => {
      h.addEventListener('click', () => {
        const collapsed = h.classList.toggle('sh-collapsed');
        // toggle ALL siblings until next sam-head (ul, tip, warn, check, onthoud, etc.)
        let sib = h.nextElementSibling;
        while (sib && !sib.classList.contains('sam-head')) {
          sib.classList.toggle('sam-ul-hidden', collapsed);
          sib = sib.nextElementSibling;
        }
      });
    });

    // 1a. Interactieve Q&A (.qa/.q/.hint/.a)
    samEl.querySelectorAll('.qa').forEach(qa => {
      const q = qa.querySelector('.q');
      if (!q) return;
      q.addEventListener('click', () => {
        qa.classList.toggle('qa-open');
      });
    });

    // 1b. Leesvoortgang — progress bar + per-sectie vinkje
    {
      const vakId = (typeof ST!=='undefined'&&ST.vak)?ST.vak.id:'x';
      const domId = d.id||'x';
      const key = `slagio_read_${vakId}_${domId}`;
      let readSet = new Set(JSON.parse(localStorage.getItem(key)||'[]'));
      const heads = [...samEl.querySelectorAll('.sam-head')];
      const total = heads.length;
      const prog = document.createElement('div');
      prog.className = 'sam-prog-wrap';
      prog.innerHTML = `<div class="sam-prog-bar"><div class="sam-prog-fill"></div></div><span class="sam-prog-label"></span>`;
      samEl.insertAdjacentElement('beforebegin', prog);
      const fill = prog.querySelector('.sam-prog-fill');
      const lbl = prog.querySelector('.sam-prog-label');
      const upd = () => {
        const n = readSet.size, pct = total ? n/total*100 : 0;
        fill.style.width = pct+'%';
        lbl.textContent = `${n}/${total} gelezen`;
        prog.classList.toggle('prog-done', n===total&&total>0);
      };
      heads.forEach(h => {
        const title = h.childNodes[0]?.textContent?.trim()||h.textContent.trim();
        const btn = document.createElement('button');
        btn.className = 'sam-head-ck'+(readSet.has(title)?' hck-done':'');
        btn.title = readSet.has(title)?'Ongelezen':'Gelezen markeren';
        btn.textContent = '✓';
        btn.addEventListener('click', e => {
          e.stopPropagation();
          readSet.has(title) ? readSet.delete(title) : readSet.add(title);
          btn.classList.toggle('hck-done', readSet.has(title));
          btn.title = readSet.has(title)?'Ongelezen':'Gelezen markeren';
          localStorage.setItem(key, JSON.stringify([...readSet]));
          upd();
        });
        h.insertBefore(btn, h.lastChild.nodeType===3 ? h.lastChild : null);
        h.appendChild(btn);
      });
      upd();
    }

    // 1c. Inline check-vragen — inject after every 2nd section, max 3 total
    if (d.sv && d.sv.length >= 2) {
      const heads = [...samEl.querySelectorAll('.sam-head')];
      const pool = [...d.sv].sort(() => Math.random() - .5);
      let qi = 0, added = 0;
      heads.forEach((h, hi) => {
        if (added >= 3 || qi >= pool.length) return;
        if ((hi + 1) % 2 !== 0) return; // every 2nd section
        // find last sibling of this section
        let last = h.nextElementSibling;
        while (last?.nextElementSibling && !last.nextElementSibling.classList.contains('sam-head')) last = last.nextElementSibling;
        if (!last) return;
        const q = pool[qi++];
        const sh = q.o.map((t,i)=>({t,i})).sort(()=>Math.random()-.5);
        const ci = sh.findIndex(s=>s.i===q.c);
        const ck = document.createElement('div');
        ck.className = 'sam-check';
        ck.innerHTML = `<div class="sam-check-label">✓ Check je begrip</div><div class="sam-check-q">${q.v}</div><div class="sam-check-opts">${sh.map((s,i)=>`<button class="sam-check-opt" data-i="${i}">${s.t}</button>`).join('')}</div>`;
        last.insertAdjacentElement('afterend', ck);
        added++;
        ck.querySelectorAll('.sam-check-opt').forEach(btn => {
          btn.addEventListener('click', function() {
            if (ck.classList.contains('ck-done')) return;
            ck.classList.add('ck-done');
            const i = +this.dataset.i, ok = i===ci;
            this.classList.add(ok ? 'ck-correct' : 'ck-wrong');
            if (!ok) ck.querySelectorAll('.sam-check-opt')[ci]?.classList.add('ck-reveal');
            const fb = document.createElement('div');
            fb.className = `sam-check-fb ${ok?'fb-ok':'fb-err'}`;
            fb.textContent = ok ? '✓ Goed!' : `✗ ${(q.u||'').split('.')[0]||'Niet helemaal'}.`;
            ck.querySelector('.sam-check-opts').after(fb);
          });
        });
      });
    }

    // 1d. Auto CE-spotlight uit oe[] (fase 5) — alleen als nog geen sam-ce-spot aanwezig
    if (d.oe && d.oe.length > 0 && !samEl.querySelector('.sam-ce-spot')) {
      const ex = d.oe.slice(0, Math.min(2, d.oe.length));
      const spot = document.createElement('div');
      spot.className = 'sam-ce-spot sam-ce-auto';
      spot.innerHTML = ex.map((q,i) =>
        `${i>0?'<div class="sam-ce-sep"></div>':''}<div class="sam-ce-ex"><span class="sam-ce-bron">${q.bron||''}</span><div class="sam-ce-v">${q.v}</div></div>`
      ).join('');
      samEl.appendChild(spot);
    }
  }

  // 2. Tab wiring
  const dtop = container.querySelector('.dtop');
  if (!dtop) return;
  const tabBar = dtop.querySelector('.dtab-bar');
  if (tabBar) {
    tabBar.querySelectorAll('.dtab-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const target = btn.dataset.tab;
        tabBar.querySelectorAll('.dtab-btn').forEach(b => b.classList.remove('dtab-active'));
        dtop.querySelectorAll('.dtab-pane').forEach(p => p.classList.remove('dtab-vis'));
        btn.classList.add('dtab-active');
        dtop.querySelector(`[data-tab-id="${target}"]`)?.classList.add('dtab-vis');
      });
    });
  }

  // 3. YouTube uitleg video's — inject into video tab
  const vidPane = dtop.querySelector('[data-tab-id="vids"]');
  const vidTabBtn = dtop.querySelector('.dtab-vid-tab');
  if (vidPane && d.id) {
    const vakId = (typeof ST !== 'undefined' && ST.vak) ? ST.vak.id : '';
    const domId = d.id.toUpperCase();
    const vids = (UITLEG_VIDEOS[vakId] || {})[domId] || [];
    if (vids.length > 0) {
      if (vidTabBtn) vidTabBtn.style.display = '';
      vidPane.innerHTML = `<div class="sv-video-card-list">${vids.map(v=>`<a class="sv-video-item" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">
        <div class="sv-video-thumb-placeholder"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
        <div class="sv-video-info"><div class="sv-video-name">${v.titel}</div><div class="sv-video-ch">${v.kanaal}</div></div>
        <svg class="sv-video-arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </a>`).join('')}</div>`;
    }
  }

  // 4. Test jezelf mini-quiz — inject into quiz tab
  const quizPane = dtop.querySelector('[data-tab-id="quiz"]');
  if (!quizPane || !d.sv || d.sv.length < 3) return;
  const pool = [...d.sv].sort(() => Math.random() - 0.5).slice(0, 3);
  let cur = 0, score = 0;
  const tjEl = document.createElement('div');
  tjEl.className = 'tj';
  quizPane.appendChild(tjEl);
  function renderQ() {
    if (cur >= pool.length) {
      const pct = score / pool.length;
      const lbl = pct === 1 ? 'Perfecte score! 🎉' : pct >= 0.67 ? 'Goed gedaan! 👍' : 'Blijf oefenen! 💪';
      tjEl.innerHTML = `<div class="tj-hd"><span class="tj-title">⚡ Test jezelf</span><span class="tj-prog">Klaar!</span></div><div class="tj-body"><div class="tj-score-wrap"><div class="tj-score-num">${score}/${pool.length}</div><div class="tj-score-lbl">${lbl}</div><button class="tj-retry-btn">↺ Opnieuw proberen</button></div></div>`;
      tjEl.querySelector('.tj-retry-btn').addEventListener('click', () => { cur = 0; score = 0; pool.sort(() => Math.random() - 0.5); renderQ(); });
      return;
    }
    const q = pool[cur];
    const shuffled = q.o.map((text, i) => ({text, orig: i})).sort(() => Math.random() - 0.5);
    const correctIdx = shuffled.findIndex(s => s.orig === q.c);
    tjEl.innerHTML = `<div class="tj-hd"><span class="tj-title">⚡ Test jezelf</span><span class="tj-prog">${cur + 1}/${pool.length}</span></div><div class="tj-body"><div class="tj-q">${q.v}</div><div class="tj-opts">${shuffled.map((s, i) => `<button class="tj-opt" data-i="${i}">${s.text}</button>`).join('')}</div></div>`;
    tjEl.querySelectorAll('.tj-opt').forEach(btn => {
      btn.addEventListener('click', function () {
        if (tjEl.querySelector('.tj-opt.tj-c, .tj-opt.tj-w')) return;
        const i = +this.dataset.i;
        const ok = i === correctIdx;
        if (ok) score++;
        this.classList.add(ok ? 'tj-c' : 'tj-w');
        if (!ok) tjEl.querySelector(`.tj-opt[data-i="${correctIdx}"]`).classList.add('tj-c');
        tjEl.querySelectorAll('.tj-opt').forEach(b => b.disabled = true);
        const body = tjEl.querySelector('.tj-body');
        const fb = document.createElement('div');
        fb.className = 'tj-feedback';
        fb.textContent = q.u;
        body.appendChild(fb);
        const nb = document.createElement('button');
        nb.className = 'tj-next-btn';
        nb.textContent = cur < pool.length - 1 ? 'Volgende →' : 'Resultaat →';
        nb.addEventListener('click', () => { cur++; renderQ(); });
        body.appendChild(nb);
      });
    });
  }
  renderQ();
}

function printSam() {
  const dtopOpen = document.querySelector('.dtop.on');
  if (!dtopOpen) return;
  const samEl = dtopOpen.querySelector('.sam');
  if (!samEl) return;
  const domNaam = dtopOpen.previousElementSibling?.querySelector('h4')?.textContent || 'Samenvatting';
  const vakNaam = ST?.vak?.naam || '';
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${vakNaam} — ${domNaam}</title><style>
    body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1a1d26;font-size:13pt;line-height:1.8}
    .sam-head{font-size:10pt;font-weight:800;text-transform:uppercase;color:#888;margin:20px 0 4px;padding-top:16px;border-top:1px solid #ddd}
    .sam-head:first-child{border-top:none;padding-top:0;margin-top:0}
    ul{padding-left:16px;margin:4px 0 12px}li{padding:3px 0}strong{color:#222}
    .sam-tip{background:#f0fdf4;border-left:3px solid #22c55e;padding:8px 12px;margin:8px 0;border-radius:0 6px 6px 0}
    .sam-warn{background:#fef2f2;border-left:3px solid #ef4444;padding:8px 12px;margin:8px 0;border-radius:0 6px 6px 0}
    .sam-onthoud{background:#faf5ff;border:1.5px dashed #c084fc;border-radius:8px;padding:10px 14px;margin:10px 0}
    .sam-ce-spot{background:#fff7ed;border:1.5px solid #fdba74;border-radius:8px;padding:10px 14px;margin:10px 0}
    .sam-definitie{border-left:3px solid #6366f1;padding:8px 12px;margin:8px 0}
    .sam-definitie-term{font-size:9pt;font-weight:800;text-transform:uppercase;color:#6366f1}
    .sam-timeline{border-left:2px solid #f97316;padding:0 0 0 16px;list-style:none}
    .sam-timeline-date{font-weight:800;color:#f97316;font-size:9pt}
    .fm{font-family:monospace;background:#f0f0f0;padding:1px 6px;border-radius:4px}
    .sam-check,.sam-prog-wrap,.sam-head-ck,.sam-cta{display:none}
    @media print{body{margin:20mm}}
  </style></head><body>
    <h1>${vakNaam} — ${domNaam}</h1>
    ${samEl.innerHTML}
  </body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 300);
}

function toggleD(id){
  const el=document.getElementById(id);
  el.classList.toggle('on');
}

// ═══════ QUIZ DRAFT (crash recovery) ═══════
const QUIZ_DRAFT_KEY='slagio_quiz_draft';
function saveQuizDraft(){
  if(!ST.vragen.length||!ST.vak||!ST.domein||ST.idx<=0)return;
  try{
    localStorage.setItem(QUIZ_DRAFT_KEY,JSON.stringify({
      vakId:ST.vak.id,domeinId:ST.domein.id,mode:ST.mode,
      idx:ST.idx,score:ST.score,
      antwrd:ST.antwrd,tijdPerVraag:ST.tijdPerVraag||[],
      shuffleMaps:ST.shuffleMaps,combo:ST.combo,
      xpThisRound:ST.xpThisRound,isDailyChallenge:ST.isDailyChallenge,
      savedAt:Date.now()
    }));
  }catch(e){}
}
function clearQuizDraft(){localStorage.removeItem(QUIZ_DRAFT_KEY);}
// ── CHALLENGE LINKS ──────────────────────────────────────────────────
let _chalState=null; // {vakId,domeinId,score,naam} if launched from challenge URL

function parseChallengeHash(){
  try{
    const h=window.location.hash;
    if(!h.startsWith('#chal/'))return null;
    const parts=h.slice(6).split('/');
    if(parts.length<4)return null;
    return{vakId:parts[0],domeinId:parts[1],score:parseInt(parts[2])||0,naam:decodeURIComponent(parts[3]||'Iemand')};
  }catch(e){return null;}
}

function buildChallengeUrl(vakId,domeinId,score,naam){
  return'https://slagio.nl/#chal/'+vakId+'/'+domeinId+'/'+score+'/'+encodeURIComponent(naam);
}

function initChallengeOnLoad(){
  const c=parseChallengeHash();
  if(!c)return;
  _chalState=c;
  // Find vak+domein objects
  const allVakken=[...(typeof VAKKEN!=='undefined'?VAKKEN:[]),...(typeof VAKKEN_VWO!=='undefined'?VAKKEN_VWO:[])];
  const vak=allVakken.find(v=>v.id===c.vakId);
  const domein=vak&&vak.domeinen&&vak.domeinen.find(d=>d.id===c.domeinId);
  if(!vak||!domein){_chalState=null;return;}
  // Populate intro screen
  document.getElementById('chal-intro-naam').textContent=c.naam;
  document.getElementById('chal-intro-sub').textContent='daagt je uit bij '+vak.naam+' — '+domein.naam;
  document.getElementById('chal-intro-score').textContent=c.score;
  document.getElementById('chal-intro-max').textContent='/ 1000 punten';
  // Set up ST so accept goes straight to quiz
  ST.vak=vak;ST.domein=domein;
  show('sc-chal-intro');
  // Clear hash so it doesn't persist
  history.replaceState(null,'',window.location.pathname);
}

function acceptChallenge(){
  if(!_chalState||!ST.vak||!ST.domein){show('sc-home');return;}
  startQ('snel');
}

function renderChallengeResult(){
  const rWrap=document.getElementById('chal-result-wrap');
  const sWrap=document.getElementById('chal-share-wrap');
  if(!rWrap||!sWrap)return;
  if(!_chalState){rWrap.innerHTML='';sWrap.innerHTML='';return;}
  const myScore=ST.antwrd.reduce((s,a)=>s+a.pts*50+Math.round((a.tijdOver||0)/20*50),0);
  const theirScore=_chalState.score;
  const naam=_chalState.naam;
  const myWin=myScore>theirScore,tie=myScore===theirScore;
  const banner=myWin?'🏆 Jij wint van '+naam+'!':tie?'🤝 Gelijkspel!':'💪 '+naam+' wint — probeer het opnieuw!';
  const cls=myWin?'win':tie?'tie':'lose';
  rWrap.innerHTML=`<div class="chal-result-banner ${cls}">${banner}</div>
    <div class="chal-vs-card">
      <div class="chal-vs-side"><div class="chal-vs-label">Jij</div><div class="chal-vs-score ${myWin?'win':tie?'tie':'lose'}">${myScore}</div></div>
      <div class="chal-vs-divider">VS</div>
      <div class="chal-vs-side"><div class="chal-vs-label">${naam}</div><div class="chal-vs-score ${!myWin&&!tie?'win':tie?'tie':'lose'}">${theirScore}</div></div>
    </div>`;
  sWrap.innerHTML='';
}

function daagUit(){
  if(!ST.vak||!ST.domein)return;
  const naam=localStorage.getItem('slagio_naam')||(currentUser&&currentUser.user_metadata&&currentUser.user_metadata.naam)||'Jij';
  const myScore=ST.antwrd.reduce((s,a)=>s+a.pts*50+Math.round((a.tijdOver||0)/20*50),0);
  const url=buildChallengeUrl(ST.vak.id,ST.domein.id,myScore,naam);
  const tekst='Ik scoorde '+myScore+'/1000 bij '+ST.vak.naam+' op Slagio — kun jij mij verslaan? 🎯\n'+url;
  if(navigator.share){navigator.share({title:'Slagio uitdaging',text:tekst,url:url}).catch(()=>{});}
  else{navigator.clipboard.writeText(url).then(()=>showToast('Link gekopieerd! 📋')).catch(()=>showToast(url));}
}
// ── END CHALLENGE LINKS ───────────────────────────────────────────────

// ── GROEPSLEADERBOARD ─────────────────────────────────────────────────
const GRP_KEY='slagio_groep_v1'; // {id,code,name,role:'owner'|'member'}

function getMyGroep(){try{return JSON.parse(localStorage.getItem(GRP_KEY)||'null');}catch(e){return null;}}
function saveMyGroep(g){if(g)localStorage.setItem(GRP_KEY,JSON.stringify(g));else localStorage.removeItem(GRP_KEY);}

function genGroepCode(){return Math.random().toString(36).slice(2,8).toUpperCase();}

async function maakGroep(naam){
  if(!currentUser){showToast('Log eerst in om een groep aan te maken');return;}
  const code=genGroepCode();
  const displayName=localStorage.getItem('slagio_naam')||(currentUser.user_metadata&&currentUser.user_metadata.naam)||'Jij';
  try{
    const {data,error}=await SB.from('groups').insert({code,name:naam,created_by:currentUser.id}).select().single();
    if(error)throw error;
    await SB.from('group_members').insert({group_id:data.id,user_id:currentUser.id,display_name:displayName});
    saveMyGroep({id:data.id,code:data.code,name:data.name,role:'owner'});
    showToast('Groep aangemaakt! Code: '+code);
    renderGroepScreen();
  }catch(e){showToast('Fout bij aanmaken: '+e.message);}
}

async function doeGroepMee(code){
  if(!currentUser){showToast('Log eerst in om lid te worden van een groep');return;}
  const displayName=localStorage.getItem('slagio_naam')||(currentUser.user_metadata&&currentUser.user_metadata.naam)||'Jij';
  try{
    const {data:grp,error:e1}=await SB.from('groups').select('*').eq('code',code.toUpperCase().trim()).single();
    if(e1||!grp){showToast('Groep niet gevonden. Controleer de code.');return;}
    const {error:e2}=await SB.from('group_members').upsert({group_id:grp.id,user_id:currentUser.id,display_name:displayName});
    if(e2)throw e2;
    saveMyGroep({id:grp.id,code:grp.code,name:grp.name,role:'member'});
    showToast('Welkom bij '+grp.name+'!');
    renderGroepScreen();
  }catch(e){showToast('Fout: '+e.message);}
}

async function verlaarGroep(){
  const g=getMyGroep();if(!g||!currentUser)return;
  if(!confirm('Wil je de groep verlaten?'))return;
  await SB.from('group_members').delete().eq('group_id',g.id).eq('user_id',currentUser.id);
  saveMyGroep(null);
  showToast('Je hebt de groep verlaten');
  renderGroepScreen();
}

async function fetchGroepLeaderboard(groupId){
  try{
    const {data:members}=await SB.from('group_members').select('user_id,display_name').eq('group_id',groupId);
    if(!members||!members.length)return[];
    const userIds=members.map(m=>m.user_id);
    const {data:scores}=await SB.from('leaderboard').select('user_id,score,vak_naam,domein_naam,animal_id,stage_idx').in('user_id',userIds).order('score',{ascending:false});
    // Aggregate best score per user
    const best={};
    (scores||[]).forEach(r=>{if(!best[r.user_id]||r.score>best[r.user_id].score)best[r.user_id]={...r};});
    return members.map(m=>({...m,...(best[m.user_id]||{score:0})})).sort((a,b)=>b.score-a.score);
  }catch(e){return[];}
}

async function renderGroepScreen(){
  const wrap=document.getElementById('groep-content');
  if(!wrap)return;
  const g=getMyGroep();

  if(!g){
    wrap.innerHTML=`
      <div class="grp-hero">
        <div class="grp-hero-icon">🏆</div>
        <div class="grp-hero-title">Samen studeren, samen slagen</div>
        <div class="grp-hero-sub">Maak een groep met vrienden, klasgenoten of een studiegroep en vergelijk live wie de hoogste score haalt</div>
        <div class="grp-hero-pills">
          <span class="grp-hero-pill">👫 Vrienden</span>
          <span class="grp-hero-pill">🏫 Klas</span>
          <span class="grp-hero-pill">📚 Studiegroep</span>
        </div>
      </div>
      ${!currentUser?'<div class="grp-no-account">⚠️ Je moet ingelogd zijn om een groep aan te maken of te joinen.</div>':''}
      <div class="grp-split">
        <div class="grp-card" style="margin-bottom:0">
          <div class="grp-card-title">🔑 Code invoeren</div>
          <input class="grp-input" id="grp-join-code" placeholder="bijv. XK4M7R" maxlength="6">
          <button class="grp-join-btn" onclick="doeGroepMee(document.getElementById('grp-join-code').value)">Doe mee →</button>
        </div>
        <div class="grp-card" style="margin-bottom:0">
          <div class="grp-card-title">✨ Nieuwe groep</div>
          <input class="grp-input grp-create-input" id="grp-new-naam" placeholder="bijv. Vrienden 2026">
          <button class="grp-create-btn" onclick="maakGroep(document.getElementById('grp-new-naam').value)">+ Aanmaken</button>
        </div>
      </div>`;
    return;
  }

  wrap.innerHTML=`<div style="display:flex;justify-content:center;padding:48px 0"><div style="animation:spin 1s linear infinite;font-size:28px">⏳</div></div>`;
  const members=await fetchGroepLeaderboard(g.id);

  const colors=['#f97316','#6366f1','#22c55e','#ec4899','#14b8a6','#f59e0b','#3b82f6','#8b5cf6'];
  const col=(name)=>colors[(name||'?').charCodeAt(0)%colors.length];
  const ini=(name)=>(name||'?').slice(0,2).toUpperCase();
  const _myProf=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  const _myEvo=_myProf.animalId?getAnimalEmoji(_myProf.animalId,getTotalXP()):null;
  const evoEmoji=(m)=>{
    const isMe=currentUser&&m.user_id===currentUser.id;
    if(isMe&&_myEvo)return _myEvo;
    if(!m.animal_id)return null;
    const a=getAnimalById(m.animal_id);
    if(!a)return null;
    const idx=m.stage_idx??0;
    return a.svg?(a.fallback?.[idx]||a.fallback?.[0]||'⭐'):(a.s[idx]||a.s[0]);
  };

  const sidebar=`
    <div class="grp-sidebar">
      <div class="grp-header-card">
        <div class="grp-header-emoji">👥</div>
        <div class="grp-header-name">${g.name}</div>
        <div class="grp-header-meta">${members.length} ${members.length===1?'lid':'leden'}</div>
        <div class="grp-code-label">Uitnodigingscode</div>
        <div class="grp-code-chip" onclick="navigator.clipboard.writeText('${g.code}').then(()=>showToast('Code gekopieerd! 📋'))" title="Klik om te kopiëren">
          <span class="grp-code-value">${g.code}</span>
          <span class="grp-code-btn">📋 Kopieer</span>
        </div>
        <div class="grp-header-hint">Stuur deze code naar vrienden of klasgenoten om ze toe te voegen aan de groep</div>
        <button class="grp-leave-btn" onclick="verlaarGroep()">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Groep verlaten
        </button>
      </div>
    </div>`;

  let scoreboard='';
  if(members.length===0){
    scoreboard=`<div class="grp-score-card"><div class="grp-empty">🏁 Nog geen scores<br><span style="font-size:12px">Maak een quiz om als eerste op het bord te komen!</span></div></div>`;
  } else {
    const top3=members.slice(0,Math.min(3,members.length));
    const rest=members.slice(top3.length);
    let podium='';
    if(members.length>=2){
      const slot=(m,cls,barH,barBg,medal,medalCls)=>{
        if(!m)return'';
        const isMe=currentUser&&m.user_id===currentUser.id;
        const emo=evoEmoji(m);
        const avContent=emo?`<span style="font-size:${cls==='first'?'26px':'18px'};line-height:1">${emo}</span>`:ini(m.display_name);
        const avBg=emo?(isMe?'rgba(var(--or-rgb),.12)':col(m.display_name)+'18'):col(m.display_name)+'22';
        const avBorder=emo?(isMe?'rgba(var(--or-rgb),.4)':col(m.display_name)+'55'):col(m.display_name)+'66';
        const clickAttr=isMe?`onclick="openProfiel()" style="cursor:pointer" title="Mijn profiel"`:``;
        return`<div class="grp-pod-col" ${clickAttr}>
          <div class="grp-pod-avatar ${cls}" style="background:${avBg};border-color:${avBorder};color:${col(m.display_name)}">${avContent}</div>
          <div class="grp-pod-name">${m.display_name||'?'}${isMe?'<br><span class="grp-me-badge">jij</span>':''}</div>
          <div class="grp-pod-score">${(m.score||0).toLocaleString('nl')} pts</div>
          <div class="grp-pod-bar" style="height:${barH}px;background:${barBg}"></div>
          <div class="grp-pod-medal ${medalCls}">${medal}</div>
        </div>`;
      };
      podium=`<div class="grp-podium">
        ${slot(top3[1],'','46','rgba(156,163,175,.18)','🥈','')}
        ${slot(top3[0],'first','70','rgba(234,179,8,.2)','🥇','first')}
        ${slot(top3[2],'','34','rgba(180,120,60,.18)','🥉','')}
      </div>`;
    }
    const listMembers=members.length>=2?rest:members;
    const medals=['🥇','🥈','🥉'];
    let rows='';
    listMembers.forEach((m,i)=>{
      const isMe=currentUser&&m.user_id===currentUser.id;
      const rank=members.length>=2?i+4:i+1;
      const emo=evoEmoji(m);
      const avContent=emo?`<span style="font-size:16px;line-height:1">${emo}</span>`:ini(m.display_name);
      const avBg=emo?(isMe?'rgba(var(--or-rgb),.12)':col(m.display_name)+'18'):col(m.display_name)+'22';
      const avBorder=emo?(isMe?'rgba(var(--or-rgb),.4)':col(m.display_name)+'44'):col(m.display_name)+'44';
      rows+=`<div class="grp-member-row${isMe?' me':''}"${isMe?' onclick="openProfiel()" style="cursor:pointer" title="Mijn profiel"':''}>
        <div class="grp-member-rank">${medals[rank-1]||rank}</div>
        <div class="grp-member-avatar" style="background:${avBg};color:${col(m.display_name)};border-color:${avBorder}">${avContent}</div>
        <div class="grp-member-info">
          <div class="grp-member-name">${m.display_name||'Onbekend'}${isMe?'<span class="grp-me-badge">jij</span>':''}</div>
          ${m.vak_naam?`<div class="grp-member-vak">Beste bij ${m.vak_naam}</div>`:''}
        </div>
        <div class="grp-member-score">${(m.score||0).toLocaleString('nl')}</div>
      </div>`;
    });
    scoreboard=`<div class="grp-score-card">
      <div class="grp-card-title">🏆 Scoreboard</div>
      ${podium}${rows}
    </div>`;
  }

  wrap.innerHTML=`<div class="grp-active-grid">${sidebar}${scoreboard}</div>`;
}
// ── END GROEPSLEADERBOARD ─────────────────────────────────────────────

// ── ADAPTIVE QUIZ PERFORMANCE ────────────────────────────────────────
const AQP_KEY='slagio_aqp_v1';
function aqpGet(){try{return JSON.parse(localStorage.getItem(AQP_KEY)||'{}')}catch(e){return{}}}
function aqpSave(d){try{localStorage.setItem(AQP_KEY,JSON.stringify(d))}catch(e){}}
function aqpDomainData(d,vakId,domeinId){const k=vakId+'_'+domeinId;if(!d[k])d[k]={};return d[k]}
function aqpQKey(q){return(q.v||'').slice(0,50)}
function aqpWeight(e){
  if(!e||e.n===0)return 2.0;
  const wr=e.w/e.n;
  let w=wr>0.5&&e.n>=2?4.0:wr>=0.2?2.5:0.6;
  if(e.ts&&(Date.now()-e.ts)/86400000>7)w*=1.4;
  return w;
}
function aqpSelectQuestions(pool,vakId,domeinId,count){
  if(!pool||pool.length<=count)return[...pool].sort(()=>Math.random()-.5);
  const d=aqpGet();
  const dom=aqpDomainData(d,vakId,domeinId);
  const keyed=pool.map(q=>({q,key:Math.pow(Math.random(),1/Math.max(0.01,aqpWeight(dom[aqpQKey(q)])))}));
  keyed.sort((a,b)=>b.key-a.key);
  return keyed.slice(0,count).map(x=>x.q);
}
function aqpRecord(q,pts){
  if(!ST||ST.mode!=='snel'||!ST.vak||!ST.domein)return;
  try{
    const d=aqpGet();
    const dom=aqpDomainData(d,ST.vak.id,ST.domein.id);
    const k=aqpQKey(q);
    if(!dom[k])dom[k]={n:0,w:0,ts:0};
    dom[k].n++;
    if(pts===0)dom[k].w++;
    dom[k].ts=Date.now();
    aqpSave(d);
  }catch(e){}
}
function aqpResetDomain(vakId,domeinId){
  const d=aqpGet();
  delete d[vakId+'_'+domeinId];
  aqpSave(d);
  showToast('Adaptieve voortgang gewist');
  renderAdaptiveResults();
}
function renderAdaptiveResults(){
  const wrap=document.getElementById('adaptive-res-wrap');
  if(!wrap||!ST||ST.mode!=='snel'||!ST.vak||!ST.domein){if(wrap)wrap.innerHTML='';return;}
  const d=aqpGet();
  const dom=aqpDomainData(d,ST.vak.id,ST.domein.id);
  const pool=(ST.domein&&ST.domein.sv)||[];
  const total=pool.length;
  const mastered=pool.filter(q=>{const e=dom[aqpQKey(q)];return e&&e.n>=3&&e.w/e.n<0.2;}).length;
  const mastPct=total>0?Math.round(mastered/total*100):0;
  const weak=Object.entries(dom).filter(([,e])=>e.n>=2&&e.w/e.n>0.5).sort((a,b)=>(b[1].w/b[1].n)-(a[1].w/a[1].n)).slice(0,4);
  const hasHistory=Object.values(dom).some(e=>e.n>0);
  if(!hasHistory){wrap.innerHTML='';return;}
  const barColor=mastPct>=70?'#22c55e':mastPct>=40?'#f59e0b':'#ef4444';
  let h=`<div class="adaptive-res-card">`;
  if(total>0){
    h+=`<div class="ar-mastery-row"><span class="ar-mastery-lbl">📊 Beheersing dit domein</span><span class="ar-mastery-val">${mastered}/${total} vragen (${mastPct}%)</span></div>`;
    h+=`<div class="ar-mastery-bar"><div class="ar-mastery-fill" style="width:${mastPct}%;background:${barColor}"></div></div>`;
  }
  if(weak.length>0){
    h+=`<div class="ar-weak-hdr">⚠️ Verbeterpunten</div><ul class="ar-weak-list">`;
    weak.forEach(([k,e])=>{
      const pct=Math.round(e.w/e.n*100);
      h+=`<li class="ar-weak-item"><span class="ar-weak-q">${k.slice(0,50)}…</span><span class="ar-weak-pct">${pct}% fout</span></li>`;
    });
    h+=`</ul>`;
  }
  h+=`<button class="ar-reset-btn" onclick="aqpResetDomain('${ST.vak.id}','${ST.domein.id}')">↺ Reset voortgang</button></div>`;
  wrap.innerHTML=h;
}
// ── END ADAPTIVE ─────────────────────────────────────────────────────
function getQuizDraft(){try{return JSON.parse(localStorage.getItem(QUIZ_DRAFT_KEY)||'null');}catch(e){return null;}}
function resumeQuizDraft(){
  const draft=getQuizDraft();
  if(!draft)return;
  const vak=getVK().find(v=>v.id===draft.vakId);
  if(!vak)return;
  const domein=vak.domeinen.find(d=>d.id===draft.domeinId);
  if(!domein)return;
  ST.vak=vak;ST.domein=domein;ST.mode=draft.mode;
  const pool=draft.mode==='snel'?domein.sv:domein.oe;
  ST.vragen=pool.slice();
  ST.idx=draft.idx;ST.score=draft.score;
  ST.antwrd=draft.antwrd||[];ST.tijdPerVraag=draft.tijdPerVraag||[];
  ST.shuffleMaps=draft.shuffleMaps||[];ST.combo=draft.combo||0;
  ST.xpThisRound=draft.xpThisRound||0;ST.isDailyChallenge=draft.isDailyChallenge||false;
  document.getElementById('qmeta').textContent=`${vak.naam} · D${domein.id}: ${domein.naam} · ${draft.mode==='snel'?'Snelle Quiz':'Oud-examen'}`;
  show('sc-quiz');
  const skel=document.getElementById('quiz-skeleton');const body=document.getElementById('qbody-inner');
  if(skel&&body){skel.style.display='flex';body.style.display='none';}
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(skel)skel.style.display='none';if(body)body.style.display='';
    toonV();
  }));
}

// ═══════ QUIZ MODE ═══════
function openQmode(did){
  ST.domein=ST.vak.domeinen.find(d=>d.id===did);
  document.getElementById('qmsub').textContent=`${ST.vak.naam} · Domein ${ST.domein.id}: ${ST.domein.naam}`;
  // Toon resume-chip als er een opgeslagen quiz is voor dit domein
  const resumeEl=document.getElementById('qm-resume');
  if(resumeEl){
    const draft=getQuizDraft();
    const pool=draft&&draft.mode==='snel'?ST.domein.sv:ST.domein.oe;
    const tot=pool?pool.length:0;
    if(draft&&draft.vakId===ST.vak.id&&draft.domeinId===did&&draft.idx>0&&draft.idx<tot){
      const pct=Math.round(draft.idx/tot*100);
      resumeEl.innerHTML=`<div class="qm-resume-chip" onclick="resumeQuizDraft()">
        <div style="font-size:22px">↩️</div>
        <div class="qm-resume-info">
          <div class="qm-resume-label">Doorgaan</div>
          <div style="font-size:13px;color:rgba(255,255,255,.8)">${draft.idx} van ${tot} vragen · ${draft.mode==='snel'?'Snelle Quiz':'Oud-examen'}</div>
          <div class="qm-resume-bar"><div class="qm-resume-bar-fill" style="width:${pct}%"></div></div>
        </div>
        <button onclick="event.stopPropagation();clearQuizDraft();document.getElementById('qm-resume').innerHTML=''" style="background:rgba(255,255,255,.1);border:none;color:rgba(255,255,255,.5);border-radius:8px;padding:4px 8px;cursor:pointer;font-size:12px">✕</button>
      </div>`;
    }else{resumeEl.innerHTML='';}
  }
  show('sc-qmode');
}

function startQ(mode){
  if(mode==='oud')trackEvent('oud_examen_quiz',{vak:ST.vak?.naam||null,domein:ST.domein?.naam||null});
  // If oud-examen mode and domain has year-tagged questions → show picker first
  if(mode==='oud'){
    const hasJaar=(ST.domein.oe||[]).some(q=>q.jaar);
    if(hasJaar){openOEPicker();return;}
  }
  clearQuizDraft();
  ST.mode=mode;
  ST.idx=0;ST.score=0;ST.antwrd=[];ST.tijdPerVraag=[];ST.combo=0;ST.xpThisRound=0;ST.flagged=new Set();
  if(!ST.isDailyChallenge)ST.isDailyChallenge=false;
  const pool=mode==='snel'?ST.domein.sv:ST.domein.oe;
  if(mode==='snel'){
    const _calcRe=/\bbereken\b/i;
    const filteredPool=pool.filter(q=>!_calcRe.test(q.v));
    const snelPool=filteredPool.length>=5?filteredPool:pool;
    ST.vragen=aqpSelectQuestions(snelPool,ST.vak.id,ST.domein.id,10);
  }else{
    ST.vragen=pool.slice();
  }
  // Pre-compute shuffle maps voor alle vragen in één keer (niet per vraag)
  if(mode==='snel'){
    ST.shuffleMaps=ST.vragen.map(()=>{
      const m=[0,1,2,3];
      for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[m[i],m[j]]=[m[j],m[i]];}
      return m;
    });
  }else{ST.shuffleMaps=[];}
  document.getElementById('qmeta').textContent=`${ST.vak.naam} · D${ST.domein.id}: ${ST.domein.naam} · ${mode==='snel'?'Snelle Quiz':'Oud-examen'}`;
  document.getElementById('sc-quiz').classList.toggle('oud-mode',mode==='oud');
  show('sc-quiz');
  // Toon skeleton kort terwijl quiz initialiseert
  const skel=document.getElementById('quiz-skeleton');
  const body=document.getElementById('qbody-inner');
  if(skel&&body){skel.style.display='flex';body.style.display='none';}
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(skel)skel.style.display='none';
    if(body)body.style.display='';
    toonV();
  }));
}

function openOEPicker(){
  const oe=ST.domein.oe||[];
  const withJaar=oe.filter(q=>q.jaar);
  // Group by jaar+tijdvak (desc)
  const groups={};
  withJaar.forEach(q=>{
    const key=`${q.jaar}-${q.tijdvak||1}`;
    if(!groups[key])groups[key]={jaar:q.jaar,tv:q.tijdvak||1,vragen:[]};
    groups[key].vragen.push(q);
  });
  const sorted=Object.values(groups).sort((a,b)=>b.jaar-a.jaar||b.tv-a.tv);
  let html='';
  sorted.forEach(g=>{
    const tvCls=g.tv===1?'tv1':'tv2';
    html+=`<div class="oep-group">
      <div class="oep-group-hdr">
        <span class="oep-jaar">${g.jaar}</span>
        <span class="oep-tv ${tvCls}">Tijdvak ${g.tv}</span>
      </div>`;
    g.vragen.forEach(q=>{
      const idx=oe.indexOf(q);
      const preview=q.v.length>110?q.v.slice(0,110)+'…':q.v;
      const hasCtx=q.ctx&&q.ctx.trim().length>0;
      html+=`<div class="oep-card" data-oeidx="${idx}">
        <div class="oep-card-domein">${ST.domein.naam}</div>
        <div class="oep-card-q">${preview}</div>
        <div class="oep-card-foot">
          <div class="oep-card-tags">
            ${hasCtx?'<span class="oep-card-tag">📄 Tekstfragment</span>':''}
            <span class="oep-card-tag">Open vraag</span>
          </div>
          <span class="oep-card-cta">Start</span>
        </div>
      </div>`;
    });
    html+='</div>';
  });
  // Uncategorized
  const noJaar=oe.filter(q=>!q.jaar);
  if(noJaar.length){
    html+=`<div class="oep-group"><div class="oep-group-hdr"><span class="oep-jaar" style="font-size:15px">Oefenvragen</span></div>`;
    noJaar.forEach(q=>{
      const idx=oe.indexOf(q);
      const preview=q.v.length>110?q.v.slice(0,110)+'…':q.v;
      html+=`<div class="oep-card" data-oeidx="${idx}">
        <div class="oep-card-domein">${ST.domein.naam}</div>
        <div class="oep-card-q">${preview}</div>
        <div class="oep-card-foot"><div class="oep-card-tags"><span class="oep-card-tag">Open vraag</span></div><span class="oep-card-cta">Start</span></div>
      </div>`;
    });
    html+='</div>';
  }
  document.getElementById('oep-list').innerHTML=html;
  document.getElementById('oep-title').textContent=`${ST.vak.naam} · Domein ${ST.domein.id}: ${ST.domein.naam}`;
  document.getElementById('oep-count').textContent=oe.length+' '+(oe.length===1?'vraag':'vragen');
  document.getElementById('oep-back-btn').onclick=()=>show('sc-qmode');
  // Attach clicks
  document.querySelectorAll('#oep-list .oep-card').forEach(card=>{
    card.addEventListener('click',()=>startOESingle(parseInt(card.dataset.oeidx)));
  });
  show('sc-oe-pick');
}

function startOESingle(qIdx){
  ST.mode='oud';
  ST.idx=0;ST.score=0;ST.antwrd=[];ST.tijdPerVraag=[];ST.combo=0;ST.xpThisRound=0;ST.flagged=new Set();
  ST.vragen=[ST.domein.oe[qIdx]];
  const q=ST.domein.oe[qIdx];
  const jaarLabel=q.jaar?` · ${q.jaar} T${q.tijdvak||1}`:'';
  document.getElementById('qmeta').textContent=`${ST.vak.naam} · D${ST.domein.id}${jaarLabel}`;
  document.getElementById('sc-quiz').classList.add('oud-mode');
  show('sc-quiz');
  toonV();
}

// ═══════ QUIZ LOGIC ═══════
function toggleFlagQ(){
  if(!ST.flagged)ST.flagged=new Set();
  const i=ST.idx;
  if(ST.flagged.has(i))ST.flagged.delete(i);else ST.flagged.add(i);
  const btn=document.getElementById('quiz-flag-btn');
  if(btn)btn.classList.toggle('flagged',ST.flagged.has(i));
  haptic&&haptic([10]);
}
function toonV(){
  const q=ST.vragen[ST.idx];
  const tot=ST.vragen.length;

  // Vlag-knop bijwerken
  const _fb=document.getElementById('quiz-flag-btn');
  if(_fb)_fb.classList.toggle('flagged',!!(ST.flagged&&ST.flagged.has(ST.idx)));

  // Show adaptive pill if history exists for this domain
  const _aqpd=aqpGet();
  const _aqpdom=aqpDomainData(_aqpd,ST.vak.id,ST.domein.id);
  const _adaptPill=document.getElementById('adaptive-pill');
  if(_adaptPill)_adaptPill.style.display=Object.values(_aqpdom).some(e=>e.n>0)?'inline-flex':'none';

  document.getElementById('qctr').textContent=`Vraag ${ST.idx+1} van ${tot}`;
  document.getElementById('qprog').style.width=`${(ST.idx/tot)*100}%`;
  document.getElementById('qfb').style.display='none';
  document.getElementById('qnxt').style.display='none';

  // context tekst
  const ctx=document.getElementById('qctx');
  const hasCtxNow=!!(q.ctx&&q.ctx!=='');
  document.getElementById('sc-quiz').classList.toggle('has-ctx',hasCtxNow);
  if(hasCtxNow){ctx.style.display='block';ctx.textContent=q.ctx;}
  else{ctx.style.display='none';}

  // vraagstelling
  document.getElementById('qq').textContent=q.v;

  // Bronvermelding chip — altijd zichtbaar
  {const bronEl=document.getElementById('qbron');
  if(bronEl){const isCE=q.bron&&/CE\s*\d{4}|CE\s*20\d\d|\d{4}\s*T[12]/i.test(q.bron);
  const label=isCE?q.bron.replace(/\s*\(.*\)/,'').trim():'Slagio oefenvraag';
  bronEl.innerHTML=`<span class="q-src ${isCE?'q-src-ce':'q-src-oef'}">${isCE?'📋':'✍️'} ${label}</span>`;}}

  if(ST.mode==='snel'){
    // Toon timer, verberg oud-area
    document.getElementById('qring').style.display='block';
    document.getElementById('oud-area').style.display='none';
    document.getElementById('snel-area').style.display='grid';

    // Gebruik pre-computed shuffle voor deze vraag (éénmalig berekend bij quiz-start)
    const idxs=ST.shuffleMaps[ST.idx]||[0,1,2,3];
    const correctPos=idxs.indexOf(q.c);
    ST.shuffleMap=idxs;

    const cols=['oA','oB','oC','oD'];
    const labs=['A','B','C','D'];
    const area=document.getElementById('snel-area');
    area.innerHTML='';
    idxs.forEach((origIdx,pos)=>{
      const btn=document.createElement('button');
      btn.className=`opt ${cols[pos]}`;
      btn.innerHTML=`<span class="oi">${labs[pos]}</span>${q.o[origIdx]}`;
      btn.dataset.pos=pos;
      btn.dataset.correct=correctPos;
      btn.onclick=function(){kies(parseInt(this.dataset.pos),parseInt(this.dataset.correct));};
      area.appendChild(btn);
    });
    startTimer(20);
    // Lucky bonus kans per vraag
    maybeGiveLucky();
    // XP Surge kans (1/5, duurt 3 vragen)
    maybeSurge();
    // Toon keyboard-hint alleen op desktop
    const kbHint=document.getElementById('quiz-kb-hint');
    if(kbHint)kbHint.style.display=(navigator.maxTouchPoints===0)?'block':'none';

  } else {
    // Oud-examen: verberg timer + snel-area
    clearInterval(ST.timer);
    document.getElementById('qring').style.display='none';
    document.getElementById('snel-area').style.display='none';
    document.getElementById('snel-area').innerHTML='';

    // bronlabel al gezet bovenaan voor beide modi

    // Reset oud-area volledig voor elke nieuwe vraag
    document.getElementById('oud-area').style.display='block';
    document.getElementById('oa-input').value='';
    document.getElementById('oa-input').disabled=false;
    document.getElementById('nakijk-btn').style.display='block';
    document.getElementById('nakijk-btn').disabled=false;
    document.getElementById('model-blok').style.display='none';
    document.getElementById('ma-text').textContent=q.u;
    // Heractiveer de beoordelingsknopppen voor elke nieuwe vraag
    document.querySelectorAll('.assess-btn').forEach(b=>{b.disabled=false;});
  }
}

// ═══════ QUIZ KEYBOARD SHORTCUTS ═══════
document.addEventListener('keydown',function(e){
  const scQuiz=document.getElementById('sc-quiz');
  if(!scQuiz||!scQuiz.classList.contains('on'))return;
  // Negeer als focus in een input/textarea zit
  if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;
  const nxt=document.getElementById('qnxt');
  const nxtVisible=nxt&&nxt.style.display!=='none';
  if(ST.mode==='snel'&&!nxtVisible){
    // Antwoord selecteren met 1-4 of a-d
    const keyMap={'1':0,'2':1,'3':2,'4':3,'a':0,'b':1,'c':2,'d':3};
    const pos=keyMap[e.key.toLowerCase()];
    if(pos!==undefined){
      const btns=document.querySelectorAll('#snel-area .opt');
      if(btns[pos]&&!btns[pos].disabled){btns[pos].click();e.preventDefault();}
    }
  }
  // Enter/Space = volgende vraag / bekijk resultaat
  if((e.key==='Enter'||e.key===' ')&&nxtVisible){
    nxt.click();e.preventDefault();
  }
});

function startTimer(max){
  clearInterval(ST.timer);
  ST.tijd=max;
  const c=document.getElementById('tcirc');
  const t=document.getElementById('tnum');
  const circ=2*Math.PI*21;
  c.style.stroke='var(--or)';
  c.style.strokeDashoffset='0';
  t.textContent=max;
  document.getElementById('qring').classList.remove('timer-urgent');
  ST.timer=setInterval(()=>{
    ST.tijd--;
    t.textContent=ST.tijd;
    c.style.strokeDashoffset=circ*(1-ST.tijd/max);
    if(ST.tijd<=5){c.style.stroke='#F87171';document.getElementById('qring').classList.add('timer-urgent');}
    if(ST.tijd<=0){clearInterval(ST.timer);tijdOp();}
  },1000);
}

function kies(gekozen,correct){
  clearInterval(ST.timer);
  // Immediately disable all buttons + show suspense shimmer on selected
  const btns=document.querySelectorAll('#snel-area .opt');
  btns.forEach(b=>b.disabled=true);
  btns[gekozen].classList.add('suspense-pending');
  // 350ms suspense delay — dopamine peak occurs in the gap between action and result
  setTimeout(()=>_kiesReveal(gekozen,correct,btns),350);
}
function _kiesReveal(gekozen,correct,btns){
  btns[gekozen].classList.remove('suspense-pending');
  const ok=gekozen===correct;
  ST.score+=ok?1:0;
  if(ok){ST.combo=(ST.combo||0)+1;playSound('correct');haptic([20]);}
  else{ST.combo=0;playSound('wrong');haptic([60,20,60]);}
  // Particles van de geklikte knop
  spawnParticles(btns[gekozen],ok);
  // Hot streak glow
  setHotStreak(ST.combo);
  // Comeback detectie
  checkComeback(ok);
  // Speed bonus (alleen bij correct)
  if(ok)checkSpeedBonus(Math.max(0,ST.tijd));
  // Lucky bonus (2× XP als de vraag lucky was)
  if(ok&&_luckyActive){const extra=Math.round((ST.xpThisRound||0)*.5);ST.xpThisRound=(ST.xpThisRound||0)+extra;_luckyActive=false;}
  if(ok&&ST.mode==='snel'){
    const mult=getComboMult(ST.combo);
    const streakBonus=getStreakBonus();
    const dcBonus=ST.isDailyChallenge?2:1;
    const surgeBonus=_surgeActive?2:1;
    const earned=Math.round(10*mult*(1+streakBonus)*dcBonus*surgeBonus);
    ST.xpThisRound=(ST.xpThisRound||0)+earned;
    showCombo(ST.combo);
    setTimeout(()=>{showXPToast(earned);floatXP(earned);},200);
    // Verlaag surge teller na correcte vraag
    if(_surgeActive){_surgeLeft--;if(_surgeLeft<=0){_surgeActive=false;_removeSurgeBadge();}else{_updateSurgeBadge();}}
  }
  if(!ok){
    const qa=document.getElementById('snel-area');
    if(qa){qa.classList.remove('shake');void qa.offsetWidth;qa.classList.add('shake');}
  }
  const q=ST.vragen[ST.idx];
  const chosenOrigIdx=ST.shuffleMap[gekozen];
  const tijdOver=Math.max(0,ST.tijd);
  ST.tijdPerVraag.push(tijdOver);
  aqpRecord(ST.vragen[ST.idx], ok?1:0);
  ST.antwrd.push({pts:ok?1:0,chosenText:q.o[chosenOrigIdx],tijdOver});
  saveQuizDraft();
  btns.forEach((b,i)=>{
    if(i===correct)b.classList.add('correct');
    else b.classList.add('wrong');
  });
  const fb=document.getElementById('qfb');
  fb.style.display='block';
  fb.className=`qfb ${ok?'fbok':'fbno'}`;
  if(ok){
    fb.innerHTML=`<div class="fbt">✓ Correct!</div>${q.u?`<button class="fbt-info-btn" onclick="this.nextElementSibling.classList.toggle('show');this.textContent=this.nextElementSibling.classList.contains('show')?'ℹ️ Verberg uitleg':'ℹ️ Toon uitleg'">ℹ️ Toon uitleg</button><div class="fbt-info-text">${q.u}</div>`:''}`;
  }else{
    const correctText=q.o[q.c]||'';
    fb.innerHTML=`<div class="fbt">✗ Fout</div><div class="fbtx"><span style="color:#4ade80;font-weight:700">✓ Juist:</span> ${correctText}</div>${q.u?`<button class="fbt-info-btn" style="margin-top:4px" onclick="this.nextElementSibling.classList.toggle('show');this.textContent=this.nextElementSibling.classList.contains('show')?'ℹ️ Verberg uitleg':'ℹ️ Toon uitleg'">ℹ️ Toon uitleg</button><div class="fbt-info-text">${q.u}</div>`:''}`;
  }
  const nxt=document.getElementById('qnxt');
  nxt.style.display='block';
  nxt.textContent=ST.idx<ST.vragen.length-1?'Volgende →':'Bekijk resultaat →';
}

function tijdOp(){
  const q=ST.vragen[ST.idx];
  ST.tijdPerVraag.push(0);
  aqpRecord(ST.vragen[ST.idx], 0);
  ST.antwrd.push({pts:0,chosenText:'⏱ Tijd was op',tijdOver:0});
  saveQuizDraft();
  const correct=ST.shuffleMap.indexOf(q.c);
  const btns=document.querySelectorAll('#snel-area .opt');
  btns.forEach((b,i)=>{b.disabled=true;if(i===correct)b.classList.add('correct');else b.classList.add('wrong');});
  const fb=document.getElementById('qfb');
  fb.style.display='block';
  fb.className='qfb fbtm';
  fb.innerHTML=`<div class="fbt">⏱ Tijd is om!</div><div class="fbtx">${q.u}</div>`;
  const nxt=document.getElementById('qnxt');
  nxt.style.display='block';
  nxt.textContent=ST.idx<ST.vragen.length-1?'Volgende →':'Bekijk resultaat →';
}

function nakijken(){
  document.getElementById('oa-input').disabled=true;
  document.getElementById('nakijk-btn').style.display='none';
  document.getElementById('model-blok').style.display='block';
}

function beoordeel(pts){
  ST.score+=pts;
  const userText=document.getElementById('oa-input').value||'(geen antwoord ingevuld)';
  ST.antwrd.push({pts,userText});
  saveQuizDraft();
  document.querySelectorAll('.assess-btn').forEach(b=>b.disabled=true);
  const colors={1:'#4ADE80',0.5:'#FCD34D',0:'#F87171'};
  const labels={1:'✓ Goed genoteerd',0.5:'~ Deels goed genoteerd',0:'✗ Fout genoteerd'};
  const fb=document.getElementById('qfb');
  fb.style.display='block';
  fb.className='qfb';
  fb.innerHTML=`<div class="fbt" style="color:${colors[pts]}">${labels[pts]}</div>`;
  const nxt=document.getElementById('qnxt');
  nxt.style.display='block';
  nxt.textContent=ST.idx<ST.vragen.length-1?'Volgende vraag →':'Bekijk resultaat →';
}

function nextQ(){
  ST.idx++;
  if(ST.idx>=ST.vragen.length)toonRes();
  else toonV();
}

// ═══════ PARTICLES ═══════
function spawnParticles(el,ok){
  if(!el)return;
  const r=el.getBoundingClientRect();
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  const cols=ok
    ?['#4ADE80','#22c55e','#86efac','#f59e0b','#fcd34d','#fff','#a3e635']
    :['#F87171','#ef4444','#fca5a5','#fb923c'];
  const n=ok?14:7;
  for(let i=0;i<n;i++){
    const p=document.createElement('div');
    p.className='particle';
    const angle=(i/n)*Math.PI*2+Math.random()*.7;
    const dist=ok?55+Math.random()*75:18+Math.random()*30;
    const size=ok?4+Math.random()*8:3+Math.random()*4;
    const dur=(.5+Math.random()*.35).toFixed(2)+'s';
    p.style.cssText=`left:${cx}px;top:${cy}px;background:${cols[i%cols.length]};width:${size}px;height:${size}px;--px:${Math.cos(angle)*dist}px;--py:${Math.sin(angle)*dist}px;--dur:${dur};animation-delay:${(Math.random()*.1).toFixed(3)}s`;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),950);
  }
}

// ═══════ HOT STREAK ═══════
function setHotStreak(combo){
  const q=document.getElementById('sc-quiz');
  if(!q)return;
  if(combo>=3){
    const intensity=Math.min((combo-2)*.05,.2).toFixed(3);
    q.style.setProperty('--heat',`rgba(245,158,11,${intensity})`);
    q.classList.add('hot-streak');
  }else{
    q.classList.remove('hot-streak');
    q.style.removeProperty('--heat');
  }
}

// ═══════ SPEED BONUS ═══════
function checkSpeedBonus(timeLeft){
  if(timeLeft<10)return;
  const bonus=Math.max(1,Math.round((timeLeft-9)*1.8));
  ST.xpThisRound=(ST.xpThisRound||0)+bonus;
  const el=document.createElement('div');
  el.className='speed-badge';
  el.textContent=`⚡ Snel! +${bonus} XP`;
  document.body.appendChild(el);
  haptic([10,5,15]);
  setTimeout(()=>el.remove(),1800);
}

// ═══════ LUCKY BONUS ═══════
let _luckyActive=false;
function maybeGiveLucky(){
  _luckyActive=Math.random()<(1/7);
  if(!_luckyActive)return;
  const fl=document.createElement('div');
  fl.className='lucky-flash';
  document.body.appendChild(fl);
  setTimeout(()=>fl.remove(),800);
  showToast('🍀 Lucky vraag! Dubbele XP!','#f59e0b',2800);
  haptic([20,10,20,10,40]);
}

// ═══════ XP SURGE ═══════
let _surgeActive=false,_surgeLeft=0;
function maybeSurge(){
  if(_surgeActive)return;
  if(Math.random()<(1/5)){
    _surgeActive=true;_surgeLeft=3;
    _showSurgeBadge();
    showToast('🔥 XP SURGE! Volgende 3 vragen ×2 XP!','#f59e0b',2500);
    haptic([25,10,45,10,25]);
    playSound('combo');
  }
}
function _showSurgeBadge(){
  _removeSurgeBadge();
  const el=document.createElement('div');
  el.id='surge-badge-el';el.className='surge-badge';
  el.innerHTML=`🔥 SURGE <span class="surge-count" id="surge-count">${_surgeLeft}</span> ×2 XP`;
  document.body.appendChild(el);
}
function _updateSurgeBadge(){
  const cnt=document.getElementById('surge-count');
  if(cnt)cnt.textContent=_surgeLeft;
}
function _removeSurgeBadge(){
  const old=document.getElementById('surge-badge-el');
  if(old)old.remove();
}

// ═══════ COMEBACK ═══════
let _wrongStreak=0;
function checkComeback(ok){
  if(!ok){_wrongStreak++;return;}
  if(_wrongStreak>=2){
    const el=document.createElement('div');
    el.className='comeback-toast';
    el.textContent='🔄 Comeback!';
    document.body.appendChild(el);
    haptic([15,10,35]);
    setTimeout(()=>el.remove(),2000);
  }
  _wrongStreak=0;
}

// ═══════ ACHIEVEMENTS ═══════
const ACH_KEY='slagio_ach_v1';
let _achShownSession=new Set();
const ALL_BADGES=[
  // Streak
  {id:'streak1',  emoji:'🌱', label:'Eerste stap',   tip:'Je eerste dag geoefend',          cat:'Streak',     rarity:'common'},
  {id:'streak3',  emoji:'🔥', label:'Op dreef',       tip:'3 dagen op rij geoefend',         cat:'Streak',     rarity:'common'},
  {id:'streak7',  emoji:'⚡', label:'Een week',        tip:'7 dagen op rij',                  cat:'Streak',     rarity:'rare'},
  {id:'streak14', emoji:'💎', label:'Twee weken',      tip:'14 dagen streak',                 cat:'Streak',     rarity:'epic'},
  {id:'streak30', emoji:'🔮', label:'Een maand',       tip:'30 dagen op rij',                 cat:'Streak',     rarity:'legendary'},
  {id:'streak100',emoji:'👑', label:'Legende',         tip:'100 dagen streak',                cat:'Streak',     rarity:'mythic'},
  {id:'streak200',emoji:'🌌', label:'Onsterfelijk',    tip:'200 dagen streak',                cat:'Streak',     rarity:'eternal'},
  {id:'streak300',emoji:'⚜️', label:'Grootmeester',    tip:'300 dagen streak',                cat:'Streak',     rarity:'eternal'},
  {id:'streak365',emoji:'🪐', label:'Heel het jaar',   tip:'365 dagen op rij — een vol jaar', cat:'Streak',     rarity:'eternal'},
  // Quizzen
  {id:'quiz1',    emoji:'🎯', label:'Beginner',        tip:'Je eerste quiz gemaakt',          cat:'Quizzen',    rarity:'common'},
  {id:'quiz10',   emoji:'📚', label:'Student',         tip:'10 quizzen gemaakt',              cat:'Quizzen',    rarity:'rare'},
  {id:'quiz50',   emoji:'🚀', label:'Gevorderd',       tip:'50 quizzen gemaakt',              cat:'Quizzen',    rarity:'epic'},
  {id:'quiz100',  emoji:'🌊', label:'Doorzetter',      tip:'100 quizzen gemaakt',             cat:'Quizzen',    rarity:'legendary'},
  {id:'quiz500',  emoji:'💫', label:'Meester',         tip:'500 quizzen gemaakt',             cat:'Quizzen',    rarity:'mythic'},
  // Prestaties
  {id:'combo3',   emoji:'💥', label:'3 op rij',        tip:'3 vragen op rij goed',            cat:'Prestaties', rarity:'rare'},
  {id:'combo5',   emoji:'🌩️', label:'God Mode',        tip:'5 vragen op rij goed',            cat:'Prestaties', rarity:'epic'},
  {id:'combo10',  emoji:'🏅', label:'Legendarisch',    tip:'10 vragen op rij goed',           cat:'Prestaties', rarity:'legendary'},
  {id:'perfect',  emoji:'🌟', label:'Perfecte score',  tip:'100% op een quiz',                cat:'Prestaties', rarity:'legendary'},
  // Vakken
  {id:'vakken3',  emoji:'📖', label:'Veelzijdig',      tip:'3 vakken geoefend',               cat:'Vakken',     rarity:'rare'},
  {id:'vakken10', emoji:'🌍', label:'Alleskunner',     tip:'10 vakken geoefend',              cat:'Vakken',     rarity:'legendary'},
  // Examen
  {id:'examen_done',emoji:'📄',label:'Examenkandidaat',tip:'Eerste echt examen afgemaakt',   cat:'Examen',     rarity:'mythic'},
  // Sociaal
  {id:'ambassadeur', emoji:'📣',label:'Ambassadeur',  tip:'Voortgang gedeeld met anderen',   cat:'Sociaal',    rarity:'rare'},
  // Flashcards
  {id:'fc_1',   emoji:'🃏', label:'Kaartjeskoning',  tip:'Eerste flashcard-sessie gespeeld',      cat:'Flashcards', rarity:'common'},
  {id:'fc_10',  emoji:'📦', label:'Kaartenstapel',   tip:'10 flashcard-sessies gespeeld',         cat:'Flashcards', rarity:'rare'},
  {id:'fc_50',  emoji:'🔁', label:'Herhaalmeester',  tip:'50 flashcard-sessies voltooid',         cat:'Flashcards', rarity:'epic'},
  // Bot Race
  {id:'race_1',    emoji:'🏁', label:'Op de baan',    tip:'Eerste Bot Race gestart',              cat:'Bot Race',   rarity:'common'},
  {id:'race_win1', emoji:'🥇', label:'Racewinnaar',   tip:'Eerste Bot Race gewonnen',             cat:'Bot Race',   rarity:'rare'},
  {id:'race_win10',emoji:'🏆', label:'Kampioen',      tip:'10 Bot Races gewonnen',                cat:'Bot Race',   rarity:'epic'},
  // Domein
  {id:'dom_1',  emoji:'🎖️', label:'Specialist',     tip:'1 domein ≥80% behaald',                cat:'Domein',     rarity:'rare'},
  {id:'dom_5',  emoji:'🌠', label:'Expert',          tip:'5 domeinen ≥80% behaald',              cat:'Domein',     rarity:'epic'},
  {id:'dom_15', emoji:'🧠', label:'Allround',        tip:'15 domeinen ≥80% behaald',             cat:'Domein',     rarity:'legendary'},
  // Comeback
  {id:'comeback_3', emoji:'💪', label:'Comeback',        tip:'Teruggekeerd na 3+ dagen weg',     cat:'Comeback',   rarity:'rare'},
  {id:'comeback_7', emoji:'🔄', label:'Vasthoudend',     tip:'Teruggekeerd na 7+ dagen weg',     cat:'Comeback',   rarity:'epic'},
  {id:'comeback_14',emoji:'🛡️', label:'Niet te stoppen', tip:'Teruggekeerd na 14+ dagen weg',   cat:'Comeback',   rarity:'legendary'},
  // Studieplan
  {id:'plan_1',  emoji:'📅', label:'Planmatig',       tip:'Eerste studieplan-taak gestart',       cat:'Studieplan', rarity:'common'},
  {id:'plan_7',  emoji:'📋', label:'Doelgericht',     tip:'7 studieplan-taken gestart',           cat:'Studieplan', rarity:'rare'},
  {id:'plan_30', emoji:'🗓️', label:'IJzeren routine', tip:'30 studieplan-taken gestart',          cat:'Studieplan', rarity:'epic'},
  {id:'plan_day',emoji:'🎯', label:'Dagplanner',     tip:'Alle taken van een studiedag voltooid',   cat:'Studieplan', rarity:'rare'},
  {id:'plan_3d', emoji:'📆', label:'Op schema',      tip:'3 studiedagen op rij alle taken gedaan',  cat:'Studieplan', rarity:'epic'},
  {id:'plan_wk', emoji:'🏆', label:'Weekkampioen',   tip:'5 studiedagen in een week voltooid',      cat:'Studieplan', rarity:'legendary'},
  // Perfectie
  {id:'perfect_3', emoji:'🌟', label:'Hat-trick',  tip:'3× een perfecte score (100%) behaald',   cat:'Perfectie',  rarity:'rare'},
  {id:'perfect_10',emoji:'💎', label:'Onfeilbaar', tip:'10× een perfecte score behaald',          cat:'Perfectie',  rarity:'epic'},
  {id:'perfect_25',emoji:'🌌', label:'Godniveau',  tip:'25× een perfecte score behaald',          cat:'Perfectie',  rarity:'legendary'},
];
const RARITY_LABEL={common:'Gewoon',rare:'Zeldzaam',epic:'Episch',legendary:'Legendarisch',mythic:'Mythisch',eternal:'Eeuwig'};
const FEATURED_BADGE_KEY='slagio_featured_badge_id';
function getSelectedFeaturedBadgeId(){return localStorage.getItem(FEATURED_BADGE_KEY)||null;}
function setSelectedFeaturedBadgeId(id){
  if(id)localStorage.setItem(FEATURED_BADGE_KEY,id);
  else localStorage.removeItem(FEATURED_BADGE_KEY);
}
function selectFeaturedBadge(id){
  const sel=getSelectedFeaturedBadgeId();
  const newId=sel===id?null:id;
  setSelectedFeaturedBadgeId(newId);
  renderProfileBadges();
  // Update own localStorage leaderboard entries live
  try{
    const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    if(p.naam){
      ['havo','vwo'].forEach(lvl=>{
        const key='examenapp_leaderboard_'+lvl;
        const entries=JSON.parse(localStorage.getItem(key)||'[]');
        let changed=false;
        entries.forEach(e=>{if(!e.isBot&&e.naam===p.naam){e.featuredBadgeId=newId;changed=true;}});
        if(changed)localStorage.setItem(key,JSON.stringify(entries));
      });
    }
  }catch(e){}
  // Push naar Supabase zodat andere gebruikers de badge ook zien
  if(currentUser){
    SB.from('leaderboard').update({featured_badge_id:newId}).eq('user_id',currentUser.id)
      .then(()=>{sessionStorage.removeItem(_avatarCloudSyncedKey);})
      .catch(()=>{});
  }
}
function getAchieved(){try{return JSON.parse(localStorage.getItem(ACH_KEY)||'{}');}catch(e){return{};}}
function earnAch(id){
  const a=getAchieved();
  if(a[id])return false;
  a[id]=Date.now();
  localStorage.setItem(ACH_KEY,JSON.stringify(a));
  try{pushSyncBundle();}catch(e){}
  return true;
}
function checkQuizCountAch(total){
  if(total>=1&&earnAch('quiz1'))setTimeout(()=>showAch('🎯','Eerste quiz gemaakt!'),400);
  if(total>=10&&earnAch('quiz10'))setTimeout(()=>showAch('📚','10 quizzen — student!'),400);
  if(total>=50&&earnAch('quiz50'))setTimeout(()=>showAch('🚀','50 quizzen — gevorderd!'),400);
  if(total>=100&&earnAch('quiz100'))setTimeout(()=>showAch('🌊','100 quizzen — doorzetter!'),400);
  if(total>=500&&earnAch('quiz500'))setTimeout(()=>showAch('💫','500 quizzen — meester!'),400);
}
function checkVakkenAch(){
  try{
    const ph=JSON.parse(localStorage.getItem('examenapp_progress_havo')||'{}');
    const pv=JSON.parse(localStorage.getItem('examenapp_progress_vwo')||'{}');
    const n=new Set([...Object.keys(ph),...Object.keys(pv)].map(k=>k.split('_')[0])).size;
    if(n>=3&&earnAch('vakken3'))setTimeout(()=>showAch('📖','3 vakken geoefend — veelzijdig!'),400);
    if(n>=10&&earnAch('vakken10'))setTimeout(()=>showAch('🌍','10 vakken — alleskunner!'),400);
  }catch(e){}
  checkDomeinAch();
}
function checkFcAch(){
  const n=parseInt(localStorage.getItem('slagio_fc_sessions')||'0')+1;
  localStorage.setItem('slagio_fc_sessions',n);
  if(n>=1&&earnAch('fc_1'))setTimeout(()=>showAch('🃏','Kaartjeskoning! Eerste flashcard-sessie!'),400);
  if(n>=10&&earnAch('fc_10'))setTimeout(()=>showAch('📦','10 flashcard-sessies — kaartenstapel!'),400);
  if(n>=50&&earnAch('fc_50'))setTimeout(()=>showAch('🔁','50 sessies — herhaalmeester!'),400);
}
function checkRaceAch(playerWin){
  if(earnAch('race_1'))setTimeout(()=>showAch('🏁','Op de baan! Eerste race gespeeld!'),400);
  if(playerWin){
    const w=parseInt(localStorage.getItem('slagio_race_wins')||'0')+1;
    localStorage.setItem('slagio_race_wins',w);
    if(w>=1&&earnAch('race_win1'))setTimeout(()=>showAch('🥇','Racewinnaar! Eerste race gewonnen!'),600);
    if(w>=10&&earnAch('race_win10'))setTimeout(()=>showAch('🏆','10 races gewonnen — kampioen!'),600);
  }
}
function checkDomeinAch(){
  try{
    let count=0;
    getVK().forEach(vak=>{(vak.domeinen||[]).forEach(dom=>{const{pct,hasData}=getDomeinBestPct(vak.id,dom.id);if(hasData&&pct>=0.80)count++;});});
    if(count>=1&&earnAch('dom_1'))setTimeout(()=>showAch('🎖️','Specialist! Eerste domein ≥80%!'),500);
    if(count>=5&&earnAch('dom_5'))setTimeout(()=>showAch('🌠','Expert! 5 domeinen ≥80%!'),500);
    if(count>=15&&earnAch('dom_15'))setTimeout(()=>showAch('🧠','Allround! 15 domeinen ≥80%!'),500);
  }catch(e){}
}
function checkComebackAch(dayGap){
  if(dayGap>=3&&earnAch('comeback_3'))setTimeout(()=>showAch('💪','Comeback na 3+ dagen weg!'),400);
  if(dayGap>=7&&earnAch('comeback_7'))setTimeout(()=>showAch('🔄','Vasthoudend! 7+ dagen weg maar terug!'),400);
  if(dayGap>=14&&earnAch('comeback_14'))setTimeout(()=>showAch('🛡️','Niet te stoppen! 14+ dagen weg maar terug!'),400);
}
function checkPlanAch(){
  const n=parseInt(localStorage.getItem('slagio_plan_tasks')||'0')+1;
  localStorage.setItem('slagio_plan_tasks',n);
  if(n>=1&&earnAch('plan_1'))setTimeout(()=>showAch('📅','Planmatig! Eerste studieplan-taak!'),400);
  if(n>=7&&earnAch('plan_7'))setTimeout(()=>showAch('📋','7 studieplan-taken — doelgericht!'),400);
  if(n>=30&&earnAch('plan_30'))setTimeout(()=>showAch('🗓️','30 taken — IJzeren routine!'),400);
}
function checkPlanDayAch(dateStr){
  try{
    const plan=spGetPlan();
    if(!plan)return;
    const dayTasks=(plan.tasks||[]).filter(t=>t.dateStr===dateStr);
    if(!dayTasks.length)return;
    const doneMap=spGetDone();
    const allDone=dayTasks.every(t=>!!doneMap[`${t.dateStr}_${t.vakId}_${t.domId}_${t.actKey}`]);
    if(!allDone)return;
    if(earnAch('plan_day'))setTimeout(()=>{showAch('🎯','Dagplanner! Alle taken gedaan! +100 XP');try{addXP(100);launchConfetti();}catch(e){}},400);
    checkConsecutivePlanDays();
  }catch(e){}
}
function checkConsecutivePlanDays(){
  try{
    const plan=spGetPlan();
    if(!plan)return;
    const doneMap=spGetDone();
    const dates=[...new Set((plan.tasks||[]).map(t=>t.dateStr))].sort();
    const today=new Date().toISOString().slice(0,10);
    let streak=0;
    for(let i=dates.length-1;i>=0;i--){
      const ds=dates[i];
      if(ds>today)continue;
      const dayTasks=(plan.tasks||[]).filter(t=>t.dateStr===ds);
      if(dayTasks.length>0&&dayTasks.every(t=>!!doneMap[`${t.dateStr}_${t.vakId}_${t.domId}_${t.actKey}`]))streak++;
      else break;
    }
    if(streak>=3&&earnAch('plan_3d'))setTimeout(()=>{showAch('📆','Op schema! 3 studiedagen op rij! +50 XP');try{addXP(50);}catch(e){}},500);
    if(streak>=5&&earnAch('plan_wk'))setTimeout(()=>showAch('🏆','Weekkampioen! 5 studiedagen voltooid!'),600);
  }catch(e){}
}
function checkPerfectCountAch(){
  const n=parseInt(localStorage.getItem('slagio_perfect_count')||'0')+1;
  localStorage.setItem('slagio_perfect_count',n);
  if(n>=3&&earnAch('perfect_3'))setTimeout(()=>showAch('🌟','Hat-trick! 3× perfect gescoord!'),500);
  if(n>=10&&earnAch('perfect_10'))setTimeout(()=>showAch('💎','Onfeilbaar! 10× perfect!'),500);
  if(n>=25&&earnAch('perfect_25'))setTimeout(()=>showAch('🌌','Godniveau! 25× perfect!'),500);
}
function renderProfileBadges(){
  const el=document.getElementById('prof-badges-content');
  const sub=document.getElementById('prof-badges-sub');
  if(!el)return;
  const ach=getAchieved();
  const selId=getSelectedFeaturedBadgeId();
  const earned=ALL_BADGES.filter(b=>ach[b.id]);
  const selBadge=earned.find(b=>b.id===selId);
  if(sub){
    sub.innerHTML=earned.length===0
      ?`<span style="color:var(--mu)">Maak quizzen om badges te verdienen</span>`
      :`<span style="color:var(--mu)">${earned.length} van ${ALL_BADGES.length} behaald · </span>`
       +(selBadge?`<span style="color:var(--or);font-weight:700">${selBadge.emoji} ${selBadge.label} op avatar</span>`
                 :`<span style="color:var(--mu)">Klik een badge om te selecteren</span>`);
  }
  // Feature 6: badge progress data
  const _bpStreak=calcStreak().current||0;
  const _bpTotalQ=getStreak().totalQuizzes||0;
  let _bpVakCount=0;
  try{const ph=JSON.parse(localStorage.getItem('examenapp_progress_havo')||'{}');const pv=JSON.parse(localStorage.getItem('examenapp_progress_vwo')||'{}');_bpVakCount=new Set([...Object.keys(ph),...Object.keys(pv)].map(k=>k.split('_')[0])).size;}catch(e){}
  function _badgeProgress(b){
    // Returns 0–1 fraction (capped at 0.99) or null if not computable
    if(b.id==='streak7')return Math.min(0.99,_bpStreak/7);
    if(b.id==='streak14')return Math.min(0.99,_bpStreak/14);
    if(b.id==='streak30')return Math.min(0.99,_bpStreak/30);
    if(b.id==='streak100')return Math.min(0.99,_bpStreak/100);
    if(b.id==='streak200')return Math.min(0.99,_bpStreak/200);
    if(b.id==='streak300')return Math.min(0.99,_bpStreak/300);
    if(b.id==='streak365')return Math.min(0.99,_bpStreak/365);
    if(b.id==='streak3')return Math.min(0.99,_bpStreak/3);
    if(b.id==='streak1')return Math.min(0.99,_bpStreak/1);
    if(b.id==='quiz1')return Math.min(0.99,_bpTotalQ/1);
    if(b.id==='quiz10')return Math.min(0.99,_bpTotalQ/10);
    if(b.id==='quiz50')return Math.min(0.99,_bpTotalQ/50);
    if(b.id==='quiz100')return Math.min(0.99,_bpTotalQ/100);
    if(b.id==='quiz500')return Math.min(0.99,_bpTotalQ/500);
    if(b.id==='vakken3')return Math.min(0.99,_bpVakCount/3);
    if(b.id==='vakken10')return Math.min(0.99,_bpVakCount/10);
    const _fcN=parseInt(localStorage.getItem('slagio_fc_sessions')||'0');
    if(b.id==='fc_1')return Math.min(0.99,_fcN/1);
    if(b.id==='fc_10')return Math.min(0.99,_fcN/10);
    if(b.id==='fc_50')return Math.min(0.99,_fcN/50);
    const _raceW=parseInt(localStorage.getItem('slagio_race_wins')||'0');
    if(b.id==='race_win1')return Math.min(0.99,_raceW/1);
    if(b.id==='race_win10')return Math.min(0.99,_raceW/10);
    const _perfN=parseInt(localStorage.getItem('slagio_perfect_count')||'0');
    if(b.id==='perfect_3')return Math.min(0.99,_perfN/3);
    if(b.id==='perfect_10')return Math.min(0.99,_perfN/10);
    if(b.id==='perfect_25')return Math.min(0.99,_perfN/25);
    const _planN=parseInt(localStorage.getItem('slagio_plan_tasks')||'0');
    if(b.id==='plan_1')return Math.min(0.99,_planN/1);
    if(b.id==='plan_7')return Math.min(0.99,_planN/7);
    if(b.id==='plan_30')return Math.min(0.99,_planN/30);
    return null;
  }
  const _rarityColors={common:'#6b7280',rare:'#3b82f6',epic:'#8b5cf6',legendary:'#f59e0b',mythic:'#ef4444',eternal:'#06b6d4'};
  const cats=[...new Set(ALL_BADGES.map(b=>b.cat))];
  el.innerHTML=cats.map(cat=>{
    const bs=ALL_BADGES.filter(b=>b.cat===cat);
    return `<div class="prof-badge-cat">
      <div class="prof-badge-cat-title">${cat}</div>
      <div class="prof-badges-grid">
        ${bs.map(b=>{
          const isEarned=!!ach[b.id];
          const isSelected=isEarned&&b.id===selId;
          const dateStr=isEarned?new Date(ach[b.id]).toLocaleDateString('nl-NL',{day:'numeric',month:'short',year:'numeric'}):'';
          const rarityLabel=RARITY_LABEL[b.rarity]||'';
          const tip=isEarned?`${b.tip} · ${dateStr} · ${rarityLabel}${isSelected?' · ✓ op avatar':''}`:b.tip+' · Nog niet behaald';
          const clickAttr=isEarned?`onclick="selectFeaturedBadge('${b.id}')" style="cursor:pointer"`:'';
          // Feature 6: progress bar for unearned badges
          let progHtml='';
          if(!isEarned){
            const prog=_badgeProgress(b);
            if(prog!==null&&prog>0.1){
              const fillPct=Math.round(prog*100);
              const fillColor=_rarityColors[b.rarity]||'var(--or)';
              progHtml=`<div class="badge-prog-wrap"><div class="badge-prog-fill" style="width:${fillPct}%;background:${fillColor}"></div></div><div class="badge-prog-lbl">${fillPct}% compleet</div>`;
            }
          }
          return `<div class="prof-badge-item badge-tooltip" data-tip="${tip}" ${clickAttr}>
            <div class="prof-badge-circle ${isEarned?'earned rarity-'+b.rarity:'unearned'}${isSelected?' selected':''}">${b.emoji}${isSelected?'<span class="badge-selected-check">✓</span>':''}</div>
            <div class="prof-badge-lbl ${isEarned?'earned':''}">${b.label}</div>
            ${isEarned?`<div class="prof-badge-rarity rarity-txt-${b.rarity}">${rarityLabel}</div>`:''}
            ${progHtml}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}
function showAch(emoji,txt,offset){
  if(_achShownSession.has(txt))return;
  _achShownSession.add(txt);
  const top=(offset||130);
  const el=document.createElement('div');
  el.className='achievement-toast';
  el.style.top=top+'px';
  el.innerHTML=`<span class="ach-emoji">${emoji}</span><div class="ach-body"><div class="ach-label">Prestatie behaald!</div><div class="ach-text">${txt}</div></div>`;
  document.body.appendChild(el);
  haptic([35,15,60,15,90]);
  playSound('levelup');
  setTimeout(()=>{el.classList.add('ach-out');setTimeout(()=>el.remove(),450);},3200);
}
function checkComboAch(combo){
  if(combo===3&&earnAch('combo3'))showAch('💥','3 vragen op rij!');
  if(combo===5&&earnAch('combo5'))showAch('🌩️','GOD MODE — 5 op rij!',175);
  if(combo===10&&earnAch('combo10'))showAch('🏅','10 op rij — legendarisch!',220);
}

// ═══════ GELUID ═══════
const SND_KEY='slagio_sound';
let _soundOn=localStorage.getItem(SND_KEY)!=='0';
function toggleSound(){
  _soundOn=!_soundOn;
  localStorage.setItem(SND_KEY,_soundOn?'1':'0');
  const btn=document.getElementById('quiz-snd-btn');
  if(btn)btn.textContent=_soundOn?'🔊':'🔇';
  if(_soundOn)playSound('correct');
}
function playSound(type){
  if(!_soundOn)return;
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const now=ctx.currentTime;
    const FREQS={
      correct:[[523,.0],[659,.08]],
      wrong:[[180,.0]],
      combo:[[523,.0],[659,.06],[784,.12]],
      levelup:[[392,.0],[523,.1],[659,.2],[784,.3]],
      streak:[[523,.0],[523,.1],[659,.2]]
    };
    const seqs=FREQS[type]||FREQS.correct;
    seqs.forEach(([freq,delay])=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.type=type==='wrong'?'square':'sine';
      o.frequency.value=freq;
      const t=now+delay;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(type==='wrong'?.08:.14,t+.02);
      g.gain.exponentialRampToValueAtTime(.001,t+(type==='wrong'?.18:.28));
      o.start(t);o.stop(t+(type==='wrong'?.2:.32));
    });
  }catch(e){}
}
// Initieel geluid-knop instellen
document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.getElementById('quiz-snd-btn');
  if(btn)btn.textContent=_soundOn?'🔊':'🔇';
  spInitPrefs();
  try{renderVandaagWidget();}catch(e){}
  try{renderDecayAlert();}catch(e){}
  try{renderExamAlert();}catch(e){}
});
window.addEventListener('offline',()=>{document.getElementById('offline-banner')?.classList.add('show');});
window.addEventListener('online',()=>{document.getElementById('offline-banner')?.classList.remove('show');});

// ═══════ HAPTIC ═══════
function haptic(pat){try{if(navigator.vibrate)navigator.vibrate(pat);}catch(e){}}

// ═══════ BUTTON RIPPLE ═══════
document.addEventListener('click',function(e){
  const el=e.target.closest('button,.opt,.card,.daily-card,.qmcd,.hm-ql-btn');
  if(!el||el.disabled)return;
  // Zorg dat het element relatief gepositioneerd is voor ripple
  const pos=getComputedStyle(el).position;
  if(pos==='static')el.style.position='relative';
  el.style.overflow='hidden';
  const r=el.getBoundingClientRect();
  const size=Math.max(r.width,r.height)*2;
  const rip=document.createElement('span');
  rip.className='btn-ripple';
  rip.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
  el.appendChild(rip);
  setTimeout(()=>rip.remove(),600);
},{passive:true});

// ═══════ QUIZ VERLATEN (exit interstitial) ═══════
function stopQ(){
  clearInterval(ST.timer);
  // Toon bevestigingsdialoog alleen als quiz bezig is
  if(ST.vragen&&ST.vragen.length>0&&ST.idx>0&&ST.idx<ST.vragen.length){
    _showQuitDialog();
  }else{
    _surgeActive=false;_surgeLeft=0;_removeSurgeBadge();
    show('sc-detail');
  }
}
function _showQuitDialog(){
  const tot=ST.idx;const sc=ST.score;
  const pct=tot>0?Math.round(sc/tot*100):0;
  const combo=ST.combo||0;
  const xpSoFar=ST.xpThisRound||0;
  const overlay=document.createElement('div');
  overlay.className='quit-overlay';
  overlay.innerHTML=`<div class="quit-card">
    <div style="font-size:36px;margin-bottom:8px">⚠️</div>
    <h3 style="font-family:var(--font-head);font-size:20px;font-weight:900;color:var(--dk);margin-bottom:6px">Quiz stoppen?</h3>
    <p style="font-size:13px;color:var(--mu);margin-bottom:14px;line-height:1.5">Je hebt ${tot} van de ${ST.vragen.length} vragen beantwoord.</p>
    <div class="quit-progress-row">
      <div class="quit-stat"><div class="quit-stat-val">${pct}%</div><div class="quit-stat-lbl">Score</div></div>
      <div class="quit-stat"><div class="quit-stat-val">${tot}/${ST.vragen.length}</div><div class="quit-stat-lbl">Vragen</div></div>
      ${xpSoFar>0?`<div class="quit-stat"><div class="quit-stat-val">+${xpSoFar}</div><div class="quit-stat-lbl">XP gewonnen</div></div>`:''}
    </div>
    ${combo>=2?`<div class="quit-combo-warn">🔥 Je verliest je ${combo}× combo als je stopt!</div>`:''}
    <div style="display:flex;gap:10px">
      <button onclick="this.closest('.quit-overlay').remove();_surgeActive=false;_surgeLeft=0;_removeSurgeBadge();show('sc-detail')" style="flex:1;padding:13px;background:var(--s);border:1px solid var(--bo);border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;color:var(--mu);font-family:var(--font)">Stoppen</button>
      <button onclick="this.closest('.quit-overlay').remove();if(ST.mode==='snel'&&ST.tijd>0)startTimer(ST.tijd)" style="flex:2;padding:13px;background:var(--or);border:none;border-radius:12px;font-size:15px;font-weight:900;cursor:pointer;color:#fff;font-family:var(--font)">Doorgaan 🔥</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  haptic([30]);
}

// ═══════ RESULTS ═══════
function toonRes(){
  clearInterval(ST.timer);
  clearQuizDraft();
  setHotStreak(0);
  _wrongStreak=0;_luckyActive=false;
  _surgeActive=false;_surgeLeft=0;_removeSurgeBadge();
  const tot=ST.vragen.length;
  const sc=Math.round(ST.score*10)/10;
  const pct=sc/tot;
  // Save progress & streak
  let _recordResult=null;
  try{_recordResult=saveProgress(ST.vak.id,ST.domein.id,ST.mode,sc,tot);}catch(e){}
  try{recordPractice();}catch(e){}
  // Feature 2: PB tracking
  window._newPB=false;window._oldPB=null;
  try{const _pbRes=savePB(ST.vak.id,ST.domein.id,pct);if(_pbRes.isNew){window._newPB=true;window._oldPB=_pbRes.prev?_pbRes.prev.score:null;}}catch(e){}
  // Rebuild grid and streak to update UI
  try{const g=document.getElementById('vakgrid');if(g){g.innerHTML='';buildGrid();}
  renderStreak();renderFavHome();renderXPHome();renderDailyChallenge();renderDailyGoal();renderLiveCount();renderHomeStats();renderGreeting();try{renderComebackCard();}catch(e){}try{renderFeatDisc();}catch(e){}try{renderHmQuickChips();renderHmStatsStrip();renderDecayAlert();renderExamAlert();}catch(e){}try{renderVandaagWidget();}catch(e){}showDailyChallengePopup();}catch(e){}
  try{recordDailyGoal();}catch(e){};
  const isPerfect=pct===1&&ST.mode==='snel'&&tot>=3;
  if(isPerfect&&earnAch('perfect'))setTimeout(()=>showAch('🌟','Perfecte score! Geen enkel fout!',90),800);
  if(isPerfect)checkPerfectCountAch();
  try{
    let emi,tit,sub;
    if(isPerfect){emi='🌟';tit='Perfecte score!';sub='Fenomenaal! Alles goed — jij bent klaar voor het CE!';}
    else if(pct>=0.9){emi='🏆';tit='Uitstekend!';sub='Je beheerst dit domein helemaal goed.';}
    else if(pct>=0.7){emi='🎉';tit='Goed gedaan!';sub='Je snapt het meeste — kleine herhaling loont.';}
    else if(pct>=0.5){emi='📖';tit='Aardig begin';sub='De basis zit erin. Oefen dit domein nog eens.';}
    else{emi='💪';tit='Blijven oefenen!';sub='Dit domein verdient meer aandacht.';}
    if(isPerfect)setTimeout(()=>launchConfetti('gold'),400);
    else if(pct>=0.9)setTimeout(()=>launchConfetti(),600);
    document.getElementById('remi').textContent=emi;
    document.getElementById('rtit').textContent=tit;
    document.getElementById('rsub').textContent=sub;
    document.getElementById('rnum').textContent=sc;
    document.getElementById('rden').textContent=`van ${tot}`;
    const circ=2*Math.PI*50;
    setTimeout(()=>{const c=document.getElementById('scirc');if(c){c.style.strokeDashoffset=circ*(1-pct);c.style.transition='stroke-dashoffset 1s ease';}},200);
    let bdHtml='';
    if(ST.mode==='snel'){
      const goed=ST.antwrd.filter(a=>a.pts===1).length;
      const fout=ST.antwrd.filter(a=>a.pts===0).length;
      const lbScoreDisplay=ST.antwrd.reduce((sum,a)=>sum+a.pts*50+Math.round((a.tijdOver||0)/20*50),0);
      const maxLbScore=tot*100;
      bdHtml=`<div class="rbr"><span>✓ Correct</span><span class="rbc">${goed} / ${tot}</span></div>
        <div class="rbr"><span>✗ Fout of tijd op</span><span class="rbw">${fout}</span></div>
        <div class="rbr"><span>Nauwkeurigheid</span><span style="font-weight:600;color:var(--or)">${Math.round(pct*100)}%</span></div>
        <div class="rbr res-lb-row"><span>🏆 Leaderboardscore</span><span class="res-lb-val">${lbScoreDisplay} <span class="res-lb-max">/ ${maxLbScore}</span></span></div>`;
    } else {
      const goed=ST.antwrd.filter(a=>a.pts===1).length;
      const deels=ST.antwrd.filter(a=>a.pts===0.5).length;
      const fout=ST.antwrd.filter(a=>a.pts===0).length;
      bdHtml=`<div class="rbr"><span>✓ Goed</span><span class="rbc">${goed}</span></div>
        <div class="rbr"><span>~ Deels goed</span><span style="color:#FCD34D;font-weight:600">${deels}</span></div>
        <div class="rbr"><span>✗ Fout</span><span class="rbw">${fout}</span></div>
        <div class="rbr"><span>Totaalscore</span><span style="font-weight:600;color:var(--or)">${sc} / ${tot} punten</span></div>`;
    }
    const rbdEl=document.getElementById('rbd');
    if(rbdEl)rbdEl.innerHTML=bdHtml;
    // Share card — laat zien bij ≥50%, competitief frame
    if(rbdEl&&pct>=0.5){
      const shareCard=document.createElement('div');
      shareCard.id='share-score-card';
      const pctNum=Math.round(pct*100);
      const emoji=pct>=1?'🌟':pct>=0.9?'🔥':pct>=0.8?'🎯':pct>=0.7?'✅':'💪';
      const msg=pct>=1?'Perfecte score!':pct>=0.9?'Bijna perfect!':pct>=0.8?'Super gedaan!':pct>=0.7?'Goed bezig!':'Kun jij het beter?';
      const cta=pct>=0.8?'Stuur dit naar je klas 👇':'Daag je klas uit 👇';
      shareCard.innerHTML=`<div style="background:linear-gradient(135deg,rgba(var(--or-rgb),.15),rgba(var(--or-rgb),.06));border:1px solid rgba(var(--or-rgb),.35);border-radius:16px;padding:16px 18px;margin:14px 0 6px;text-align:center">
        <div style="font-size:28px;margin-bottom:4px">${emoji}</div>
        <div style="font-size:18px;font-weight:900;color:var(--or);margin-bottom:2px">${pctNum}%</div>
        <div style="font-size:13px;font-weight:700;color:var(--dk);margin-bottom:2px">${msg}</div>
        <div style="font-size:12px;color:var(--mu);margin-bottom:12px">${cta}</div>
        <button onclick="deelScore()" style="background:var(--or);color:#fff;border:none;border-radius:12px;padding:11px 24px;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font);width:100%;display:flex;align-items:center;justify-content:center;gap:8px"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>Deel met je klas</button>
      </div>`;
      rbdEl.insertAdjacentElement('afterend',shareCard);
    }
    // Near-miss nudge
    const missedCount=tot-Math.round(sc);
    if(rbdEl&&pct>=0.8&&pct<1&&tot>=4&&missedCount<=2){
      const nm=document.createElement('div');
      nm.className='nearmiss-nudge';
      nm.innerHTML=`<span>Bijna! Nog maar ${missedCount} ${missedCount===1?'fout':'fouten'}...</span><button onclick="retryQ()">Doe het opnieuw →</button>`;
      rbdEl.insertAdjacentElement('afterend',nm);
    }
    // Persoonlijk record banner
    if(rbdEl&&_recordResult&&_recordResult.isNewRecord&&sc>0){
      const prevPct=_recordResult.prevBest>0?Math.round(_recordResult.prevBest/_recordResult.total*100):null;
      const newPct=Math.round(sc/tot*100);
      const rec=document.createElement('div');
      rec.className='record-banner';
      rec.innerHTML=`🏆 Nieuw persoonlijk record! ${prevPct!==null?prevPct+'% → ':''}<strong>${newPct}%</strong>`;
      rbdEl.insertAdjacentElement('afterend',rec);
      setTimeout(()=>{playSound('levelup');haptic([40,20,80,20,120]);},300);
      if(earnAch('record1'))setTimeout(()=>showAch('🏆','Je eerste persoonlijk record!'),600);
    }
    // Feature 2: PB banner (for new PB from savePB)
    if(window._newPB){
      const pbEl=document.createElement('div');
      pbEl.className='pb-banner';
      const oldPctStr=window._oldPB!==null?`<div class="pb-prev">Vorige record: ${Math.round(window._oldPB*100)}% → nu ${Math.round(pct*100)}%</div>`:'';
      pbEl.innerHTML=`🏆 Nieuw persoonlijk record!${oldPctStr}`;
      const anchor=document.getElementById('rbd');
      if(anchor)anchor.insertAdjacentElement('afterend',pbEl);
    }
    // Feature 3: Smart next action
    try{
      const naEl=document.getElementById('quiz-next-action');
      if(naEl&&ST.vak&&ST.domein){
        const na=getSmartNextAction(ST.vak.id,ST.domein.id,pct);
        if(na){
          let btnAttr='';
          if(na.type==='retry')btnAttr=`onclick="retryQ()"`;
          else if(na.type==='domain')btnAttr=`onclick="openVak('${ST.vak.id}');setTimeout(()=>{const el=document.querySelector('[data-domein-id=\\'${na.domeinId}\\']');if(el)el.scrollIntoView({behavior:'smooth'});},300)"`;
          else if(na.type==='simtoets')btnAttr=`onclick="openVak('${ST.vak.id}')"`;
          naEl.innerHTML=`<div class="next-action-card">
            <div class="na-icon">${na.icon}</div>
            <div class="na-info"><div class="na-label">${na.label}</div><div class="na-sub">${na.sub}</div></div>
            <button class="na-btn" ${btnAttr}>Ga →</button>
          </div>`;
        }
      }
    }catch(e){}
    // Show "next domain" button if there's a next domain
    try{
      const _ndb=document.getElementById('res-next-dom');
      if(_ndb&&ST.vak&&ST.domein){
        const _doms=ST.vak.domeinen;
        const _idx=_doms.findIndex(d=>d.id===ST.domein.id);
        const _next=_doms[_idx+1];
        if(_next){_ndb.textContent=`→ Volgend: Domein ${_next.id} — ${_next.naam}`;_ndb.style.display='block';}
        else _ndb.style.display='none';
      }
    }catch(e){}
  }catch(e){console.warn('toonRes display error:',e);}
  // XP reward
  try{
    const xpEl=document.getElementById('res-xp-card');
    if(xpEl)xpEl.remove();
    if(ST.mode==='snel'&&ST.xpThisRound>0){
      if(isPerfect)ST.xpThisRound=Math.round(ST.xpThisRound*1.5);
      const res=addXP(ST.xpThisRound);
      const xpPct=getXPPct(res.totalXP);
      const lvlName=LEVEL_NAMES[res.newLvl]||'Level '+res.newLvl;
      const curXP=getXPForLevel(res.newLvl);
      const nxtXP=getXPForLevel(res.newLvl+1)||curXP+1000;
      const card=document.createElement('div');
      card.id='res-xp-card';card.className='res-xp';
      // Build avatar section
      const _rp=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
      const _ra=_rp.animalId?getAnimalById(_rp.animalId):null;
      const _rsi=getAnimalStageIdx(res.totalXP);
      const _rsn=_ra&&_ra.lbl?_ra.lbl[_rsi]:ANIM_STAGE_NAMES[_rsi];
      const _rav=_ra?getAnimalDisplay(_ra.id,_rsi,52):`<span style="font-size:38px">⭐</span>`;
      // Mini journey (5 dots + connecting lines)
      let _rj='';
      for(let _ri=0;_ri<5;_ri++){
        const _rdone=_ri<_rsi,_rcur=_ri===_rsi;
        const _rdot=_ra&&(_rdone||_rcur)?getAnimalDisplay(_ra.id,_ri,_rcur?24:18):(_rdone||_rcur?`<span style="font-size:${_rcur?24:18}px">${_ra?(_ra.s[_ri]||'⭐'):'⭐'}</span>`:`<span style="font-size:15px;opacity:.22;filter:grayscale(1)">❓</span>`);
        _rj+=`<div class="res-xp-jdot">${_rdot}</div>`;
        if(_ri<4)_rj+=`<div class="res-xp-jline${_rdone?' done':''}"></div>`;
      }
      card.innerHTML=`
        <div class="res-xp-avatar-wrap">
          <div class="res-xp-avatar-ring">${_rav}</div>
          <div class="res-xp-avatar-lbl">${_ra?_ra.n:'Avatar'} · ${_rsn}</div>
        </div>
        <div class="res-xp-num">+${res.added} XP</div>
        <div class="res-xp-sub">${ST.isDailyChallenge?'⚡ Dagelijkse uitdaging bonus':''}&nbsp;</div>
        <div class="res-xp-lvl">Level ${res.newLvl} — ${lvlName} · ${res.totalXP-curXP} / ${nxtXP-curXP} XP</div>
        <div class="xp-bar-wrap"><div class="xp-bar" style="width:${xpPct}%"></div></div>
        <div class="res-xp-journey-mini">${_rj}</div>
        ${res.leveled?`<div class="levelup-banner">🎉 Level up! Je bent nu level ${res.newLvl} — ${lvlName}!</div>`:''}
        ${isPerfect?`<div class="perfect-banner">🌟 Perfecte score! +50% XP bonus verdiend!</div>`:''}`;
      const rbdEl2=document.getElementById('rbd');
      if(rbdEl2)rbdEl2.insertAdjacentElement('afterend',card);
      if(res.leveled){setTimeout(()=>launchConfetti(),300);setTimeout(()=>playSound('levelup'),400);haptic([50,30,80,30,120]);}
      setTimeout(()=>floatXP(res.added),150);
      // Level teaser — als dichtbij volgend level
      try{
        const xpToNext=nxtXP-res.totalXP;
        if(!res.leveled&&xpToNext<150){
          const tPct=Math.round((res.totalXP-curXP)/(nxtXP-curXP)*100);
          const tsr=document.createElement('div');tsr.className='lvl-teaser';
          tsr.innerHTML=`<div style="font-size:22px">⭐</div><div class="lvl-teaser-bar"><div class="lvl-teaser-lbl">Nog <strong>${xpToNext} XP</strong> voor level ${res.newLvl+1} — ${LEVEL_NAMES[res.newLvl+1]||'Level '+(res.newLvl+1)}</div><div class="lvl-teaser-fill"><div class="lvl-teaser-fill-inner" style="width:0%" data-target="${tPct}"></div></div></div>`;
          card.appendChild(tsr);
          setTimeout(()=>{const fill=tsr.querySelector('.lvl-teaser-fill-inner');if(fill)fill.style.width=fill.dataset.target+'%';},200);
        }
      }catch(e){}
      syncAvatarToProfile();
      updateProfileNav();
      if(res.evolved){
        const _p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
        if(_p.animalId){
          setTimeout(()=>launchConfetti('gold'),600);
          setTimeout(()=>showEvoReveal(res.newStage,_p.animalId),900);
        }
      }
      if(ST.isDailyChallenge){
        try{const _k=_dcLevelKey();const dc=JSON.parse(localStorage.getItem(_k)||'{}');dc.done=true;localStorage.setItem(_k,JSON.stringify(dc));}catch(e){}
        ST.isDailyChallenge=false;
      }
    }
  }catch(e){console.warn('toonRes XP error:',e);}
  // Leaderboard
  try{
    const lbBtn=document.getElementById('lb-res-btn');
    const _regPrompt=document.getElementById('res-register-prompt');
    if(ST.mode==='snel'){
      const goed=ST.antwrd.filter(a=>a.pts===1).length;
      const tijden=ST.tijdPerVraag||[];
      const totalTijd=tijden.reduce((a,b)=>a+b,0);
      const lbScore=ST.antwrd.reduce((sum,a)=>sum+a.pts*50+Math.round((a.tijdOver||0)/20*50),0);
      const avgTijd=tijden.length?Math.round(totalTijd/tijden.length*10)/10:0;
      const prof=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
      const naam=prof.naam||'Anoniem';
      const avatar=getMyCurrentAvatar()||'🐻';
      const animalId=prof.animalId||null;
      const stageIdx=animalId?getAnimalStageIdx(getTotalXP()):0;
      const _ach=getAchieved();
      const featuredBadgeId=getBestBadgeId(_ach)||null;
      const badgeIds=Object.keys(_ach).filter(k=>_ach[k]);
      const entry={naam,avatar,animalId,stageIdx,featuredBadgeId,badgeIds,vak:ST.vak.id,vakNaam:ST.vak.naam,domeinId:ST.domein.id,domeinNaam:ST.domein.naam,score:lbScore,goed,tot,avgTijd,date:new Date().toISOString().slice(0,10)};
      saveLeaderboardEntry(entry);
      if(lbBtn)lbBtn.style.display='block';
      if(_regPrompt)_regPrompt.style.display=currentUser?'none':'block';
    } else {
      if(lbBtn)lbBtn.style.display='none';
      if(_regPrompt)_regPrompt.style.display='none';
    }
  }catch(e){console.warn('toonRes LB error:',e);}
  // "Eén meer quiz" suggestie
  try{
    const omBox=document.getElementById('one-more-wrap');
    if(omBox&&ST.mode==='snel'&&ST.vak){
      const domeinen=ST.vak.domeinen||[];
      const score=ST.score/ST.vragen.length;
      // Als score <80%: opnieuw hetzelfde domein, anders: volgend domein
      let sugDomein=null,sugLabel='';
      if(score<0.8){
        sugDomein=ST.domein;sugLabel='📖 Herhalen';
      }else{
        const cur=domeinen.findIndex(d=>d.id===ST.domein.id);
        const nxt=domeinen.slice(cur+1).find(d=>d.sv&&d.sv.length);
        if(nxt){sugDomein=nxt;sugLabel='➡️ Volgende domein';}
      }
      if(sugDomein){
        omBox.innerHTML=`<div class="one-more-card" onclick="ST.vak=ST.vak;ST.domein=ST.vak.domeinen.find(d=>d.id==='${sugDomein.id}');startQ('snel')">
          <div class="one-more-tag">${sugLabel}</div>
          <div class="one-more-title">${sugDomein.naam}</div>
          <div class="one-more-sub">${ST.vak.naam} · Snelle Quiz · ${sugDomein.sv?sugDomein.sv.length:0} vragen</div>
          <div class="one-more-cta">Starten →</div>
        </div>`;
      }else{omBox.innerHTML='';}
    }
  }catch(e){if(document.getElementById('one-more-wrap'))document.getElementById('one-more-wrap').innerHTML='';}
  try{renderAdaptiveResults();}catch(e){}
  try{renderChallengeResult();}catch(e){}
  show('sc-res');
  if(ST.mode==='snel')setTimeout(()=>showFeedbackPopup('snel'),2500);
}

function retryQ(){startQ(ST.mode);}
function switchMode(){show('sc-qmode');}
function nextDomeinQ(){
  const doms=ST.vak?.domeinen;
  if(!doms){show('sc-detail');return;}
  const idx=doms.findIndex(d=>d.id===ST.domein?.id);
  const next=doms[idx+1];
  if(next){ST.domein=next;startQ(ST.mode||'snel');}
  else show('sc-detail');
}
function openLastVakCE(){
  const vak=ST.vak||getVK()[0];
  if(!vak)return;
  openVak(vak.id);
  setTimeout(()=>{
    const card=document.querySelector('.ce-archief-card');
    if(card){card.classList.add('open');card.scrollIntoView({behavior:'smooth',block:'center'});}
  },400);
}
function openLastVakRace(){
  const vak=ST.vak||getVK()[0];
  if(!vak)return;
  ST.vak=vak;
  if(!ST.domein||ST.domein.vakId!==vak.id)ST.domein=vak.domeinen[0];
  show('sc-qmode');
  setTimeout(()=>{
    document.getElementById('qmode-race-section')?.scrollIntoView({behavior:'smooth',block:'center'});
  },200);
}
function scrollToCeArchief(){
  const card=document.querySelector('.ce-archief-card');
  if(card){card.classList.add('open');card.scrollIntoView({behavior:'smooth',block:'center'});}
}
function renderHmQuickChips(){
  const wrap=document.getElementById('hm-quick-scroll');
  if(!wrap)return;
  const vak=ST.vak||null;
  const vakNaam=vak?.naam||null;
  const chips=[
    {icon:'📅',label:'Studieplan',fn:()=>show('sc-schedule')},
    {icon:'📊',label:'Voortgang',fn:()=>openRapport()},
    {icon:'📋',label:'Actieplan',fn:()=>{show('sc-calc');setTimeout(()=>switchCalc('plan'),100);}},
    vakNaam
      ?{icon:'📄',label:`${vakNaam} examens`,fn:()=>openLastVakCE()}
      :{icon:'📄',label:'CE-examens',fn:()=>show('sc-schedule')},
    vakNaam
      ?{icon:'🏁',label:`Race — ${vakNaam}`,fn:()=>openLastVakRace()}
      :{icon:'🏁',label:'Bot Race',fn:()=>show('sc-home')},
    {icon:'🏅',label:'Badges',fn:()=>openProfiel()},
  ];
  wrap.innerHTML='';
  chips.forEach(c=>{
    const btn=document.createElement('button');
    btn.className='hm-qchip';
    btn.textContent=`${c.icon} ${c.label}`;
    btn.addEventListener('click',c.fn);
    wrap.appendChild(btn);
  });
}
function renderHmStatsStrip(){
  const wrap=document.getElementById('hm-stats-strip-wrap');
  if(!wrap)return;
  const streak=calcStreak()?.current||0;
  const ach=getAchieved();
  const earned=ALL_BADGES.filter(b=>ach[b.id]).length;
  let vakCount=0;
  try{const ph=JSON.parse(localStorage.getItem('examenapp_progress_havo')||'{}');const pv=JSON.parse(localStorage.getItem('examenapp_progress_vwo')||'{}');vakCount=new Set([...Object.keys(ph),...Object.keys(pv)].map(k=>k.split('_')[0])).size;}catch(e){}
  const totalQ=getStreak().totalQuizzes||0;
  let xpToday=0;try{const s=JSON.parse(localStorage.getItem('slagio_xp_today')||'{}');if(s.d===new Date().toISOString().slice(0,10))xpToday=s.x||0;}catch(e){}
  const pills=[
    streak>0?`<span class="hm-stat-pill" onclick="openProfiel()" title="Dagelijkse streak">🔥 ${streak} dag${streak===1?'':'en'}</span>`:'',
    earned>0?`<span class="hm-stat-pill" onclick="openProfiel()" title="Behaalde badges">🏅 ${earned} badge${earned===1?'':'s'}</span>`:'',
    vakCount>0?`<span class="hm-stat-pill" onclick="openProfiel()" title="Actieve vakken">📚 ${vakCount} vak${vakCount===1?'':'ken'}</span>`:'',
    totalQ>0?`<span class="hm-stat-pill" onclick="openProfiel()" title="Totaal quizzen">⚡ ${totalQ} quiz${totalQ===1?'':'zen'}</span>`:'',
    xpToday>0?`<span class="hm-stat-pill" onclick="openProfiel()" title="XP vandaag verdiend">✨ +${xpToday} XP vandaag</span>`:'',
  ].filter(Boolean);
  wrap.innerHTML=pills.length?`<div class="hm-stats-strip">${pills.join('')}</div>`:'';
}
function renderExamAlert(){
  const el=document.getElementById('hm-exam-alert');
  if(!el)return;
  const mijn=getMijnVakken();
  const today=new Date();today.setHours(0,0,0,0);
  const imminent=EXAM_SCHEDULE.filter(e=>{
    if(!e.vakId||(mijn.length>0&&!mijn.includes(e.vakId)))return false;
    const d=new Date(e.datum);d.setHours(0,0,0,0);
    const days=Math.round((d-today)/864e5);
    return days>=0&&days<=2;
  }).sort((a,b)=>new Date(a.datum)-new Date(b.datum));
  if(!imminent.length){el.innerHTML='';return;}
  const MN=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  const items=imminent.map(e=>{
    const d=new Date(e.datum);d.setHours(0,0,0,0);
    const days=Math.round((d-today)/864e5);
    const when=days===0?'Vandaag!':days===1?'Morgen':'Overmorgen';
    const urgColor=days===0?'#ef4444':days===1?'#f97316':'#facc15';
    return`<div style="display:flex;align-items:center;gap:10px;padding:9px 14px;background:${urgColor}14;border-radius:11px;border:1px solid ${urgColor}35">
      <span style="font-size:20px">🎓</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:700;color:var(--dk);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${e.vak}</div>
        <div style="font-size:11px;color:var(--mu)">${d.getDate()} ${MN[d.getMonth()]} · ${e.tijd}</div>
      </div>
      <span style="font-size:12px;font-weight:800;color:${urgColor};white-space:nowrap;flex-shrink:0">${when}</span>
    </div>`;
  }).join('');
  el.innerHTML=`<div style="margin-bottom:14px;display:flex;flex-direction:column;gap:6px">
    <div style="font-size:12px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px">⏰ Aankomend examen</div>
    ${items}
  </div>`;
}
function renderDecayAlert(){
  const wrap=document.getElementById('hm-decay-alert');
  if(!wrap)return;
  const stale=[];
  getVK().forEach(vak=>{
    (vak.domeinen||[]).forEach(dom=>{
      const r=getDomeinBestPct(vak.id,dom.id);
      if(!r.hasData)return;
      const decay=getDecayStatus(vak.id,dom.id);
      if(!decay||decay.label==='Vandaag geoefend')return;
      const days=Math.floor((Date.now()-getDecay()[`${vak.id}_${dom.id}`])/(864e5));
      if(days<7)return;
      stale.push({vakId:vak.id,vakNaam:vak.naam,domId:dom.id,domNaam:dom.naam,days,color:decay.color,pct:r.pct});
    });
  });
  if(!stale.length){wrap.innerHTML='';return;}
  stale.sort((a,b)=>b.days-a.days);
  const top=stale.slice(0,4);
  const chips=top.map(s=>`<button class="hm-decay-chip" style="background:${s.color}18;border-color:${s.color}40;color:${s.color}" onclick="goToDomein('${s.vakId}','${s.domId}','snel')">
    <span style="width:7px;height:7px;border-radius:50%;background:${s.color};flex-shrink:0;display:inline-block"></span>
    ${s.vakNaam} · ${s.domNaam} <span style="opacity:.7;font-weight:600">${s.days}d</span>
  </button>`).join('');
  const extra=stale.length>4?`<span style="font-size:11px;color:var(--mu);align-self:center">+${stale.length-4} meer</span>`:'';
  wrap.innerHTML=`<div class="hm-decay-card">
    <div class="hm-decay-header">
      <div class="hm-decay-title">🔁 Opfrissen aanbevolen</div>
      <span style="font-size:11px;color:var(--mu)">${stale.length} domein${stale.length===1?'':'en'}</span>
    </div>
    <div class="hm-decay-chips">${chips}${extra}</div>
  </div>`;
}
async function deelScore(){
  const vakNaam=ST.vak?.naam||'een vak';
  const score=document.getElementById('rnum')?.textContent||'?';
  const total=document.getElementById('rden')?.textContent||'';
  const pctRaw=total?Math.round(parseInt(score)/parseInt(total.replace('/',''))*100):null;
  const pctTxt=pctRaw?` (${pctRaw}%)`:'';
  const modeTxt={snel:'snelle quiz',oud:'open vragen',fc:'flashcards',race:'Bot Race'}[ST.mode]||'quiz';
  const tekst=`${pctRaw>=90?'🌟':pctRaw>=70?'🔥':'💪'} ${score}${total}${pctTxt} op ${vakNaam} ${modeTxt} — kun jij het beter?\nGratis oefenen op slagio.nl`;
  if(navigator.share){
    try{
      await navigator.share({title:'Slagio — Mijn score',text:tekst,url:'https://slagio.nl'});
      if(earnAch('ambassadeur'))setTimeout(()=>showAch('📣','Ambassadeur! Score gedeeld.'),500);
    }catch(e){}
  }else{
    try{await navigator.clipboard.writeText(tekst);showToast('📋 Score gekopieerd naar klembord!');}
    catch(e){showToast('slagio.nl');}
    if(earnAch('ambassadeur'))setTimeout(()=>showAch('📣','Ambassadeur! Score gedeeld.'),500);
  }
}

// ═══════ RAPPORT ═══════
function openRapport(){
  const modal=document.getElementById('rapport-modal');
  if(!modal)return;
  renderRapport();
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeRapport(){
  document.getElementById('rapport-modal')?.classList.remove('open');
  document.body.style.overflow='';
}
function renderRapport(){
  const el=document.getElementById('rapport-content');
  if(!el)return;
  const vakken=getVK();
  const allDomains=[];
  vakken.forEach(vak=>{
    (vak.domeinen||[]).forEach(dom=>{
      const {pct,hasData}=getDomeinBestPct(vak.id,dom.id);
      if(hasData)allDomains.push({vakNaam:vak.naam,domNaam:dom.naam,pct});
    });
  });
  const p=getProgress();
  const totalAttempts=Object.values(p).reduce((s,v)=>s+(v.attempts||0),0);
  const avgPct=allDomains.length?Math.round(allDomains.reduce((s,d)=>s+d.pct,0)/allDomains.length*100):0;
  const sorted=[...allDomains].sort((a,b)=>b.pct-a.pct);
  const strong=sorted.slice(0,3);
  const weak=[...allDomains].filter(d=>d.pct<0.65).sort((a,b)=>a.pct-b.pct).slice(0,3);
  const mijn=getMijnVakken();
  const today=new Date();today.setHours(0,0,0,0);
  const upcoming=EXAM_SCHEDULE.filter(e=>{
    const d=new Date(e.datum);
    return d>=today&&(mijn.length===0||!e.vakId||(e.vakId&&mijn.includes(e.vakId)));
  }).slice(0,3);
  const maand=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  const domRow=(d,color)=>`<div class="rp-domain-row">
    <div class="rp-domain-info"><div class="rp-domain-name">${d.domNaam}</div><div class="rp-domain-vak">${d.vakNaam}</div></div>
    <div class="rp-pct-bar"><div class="rp-pct-fill" style="width:${Math.round(d.pct*100)}%;background:${color}"></div></div>
    <div class="rp-pct-lbl" style="color:${color}">${Math.round(d.pct*100)}%</div>
  </div>`;
  el.innerHTML=`
    <div class="rp-stats-row">
      <div class="rp-stat"><div class="rp-stat-val">${totalAttempts}</div><div class="rp-stat-lbl">Quizzen</div></div>
      <div class="rp-stat"><div class="rp-stat-val">${allDomains.length}</div><div class="rp-stat-lbl">Domeinen</div></div>
      <div class="rp-stat"><div class="rp-stat-val">${avgPct}%</div><div class="rp-stat-lbl">Gemiddeld</div></div>
    </div>
    ${strong.length?`<div class="rp-section-title">💪 Sterkste domeinen</div>${strong.map(d=>domRow(d,'#22c55e')).join('')}`:''}
    ${weak.length?`<div class="rp-section-title">⚠️ Focuspunten</div>${weak.map(d=>domRow(d,'#f97316')).join('')}`:''}
    ${upcoming.length?`<div class="rp-section-title">📅 Aankomende examens</div>${upcoming.map(e=>{
      const d=new Date(e.datum);const dL=Math.ceil((d-today)/(864e5));
      return`<div class="rp-exam-row"><div><div class="rp-exam-vak">${e.vak}</div><div class="rp-exam-date">${d.getDate()} ${maand[d.getMonth()]} · ${e.tijd}</div></div><div style="font-family:var(--font-head);font-size:13px;font-weight:800;color:${dL<=7?'#ef4444':dL<=14?'#f97316':'var(--or)'}">${dL}d</div></div>`;
    }).join('')}`:''}
    ${allDomains.length===0?`<div class="sp-empty">Je hebt nog geen domeinen geoefend.<br>Maak eerst een quiz om je rapport te zien.</div>`:''}
    <button class="rp-share-btn" onclick="shareRapport()">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
      Deel mijn rapport
    </button>`;
}
async function shareRapport(){
  const vakken=getVK();
  const allDomains=[];
  vakken.forEach(vak=>{(vak.domeinen||[]).forEach(dom=>{const {pct,hasData}=getDomeinBestPct(vak.id,dom.id);if(hasData)allDomains.push(pct);});});
  const avg=allDomains.length?Math.round(allDomains.reduce((s,v)=>s+v,0)/allDomains.length*100):0;
  const p=getProgress();
  const tot=Object.values(p).reduce((s,v)=>s+(v.attempts||0),0);
  const tekst=`Mijn voortgang op Slagio 📊\n${tot} quizzen · ${allDomains.length} domeinen · gemiddeld ${avg}%\nOok oefenen voor het examen? → slagio.nl`;
  if(navigator.share){
    try{await navigator.share({title:'Mijn Slagio Rapport',text:tekst,url:'https://slagio.nl'});if(earnAch('ambassadeur'))setTimeout(()=>showAch('📣','Ambassadeur! Rapport gedeeld.'),500);}catch(e){}
  }else{
    try{await navigator.clipboard.writeText(tekst);showToast('📋 Rapport gekopieerd!');}catch(e){showToast('slagio.nl');}
    if(earnAch('ambassadeur'))setTimeout(()=>showAch('📣','Ambassadeur! Rapport gedeeld.'),500);
  }
}
// ═══════ STUDIEPLAN v2 ═══════
const SP_PREF_KEY='slagio_sp_prefs_v1';
const SP_PREV_KEY='slagio_sp_prev_v1';
const SP_PLAN_KEY='slagio_sp_plan_v1';
const SP_DONE_KEY='slagio_sp_done_v1';

function spGetDone(){try{return JSON.parse(localStorage.getItem(SP_DONE_KEY)||'{}');}catch(e){return{};}}
function spIsDone(key){return!!spGetDone()[key];}
function spMarkDone(key){
  const d=spGetDone();
  if(d[key])return;
  d[key]=true;
  localStorage.setItem(SP_DONE_KEY,JSON.stringify(d));
  try{addXP(25);}catch(e){}
  try{renderVandaagWidget();}catch(e){}
  try{
    const btn=document.querySelector(`[data-spkey="${key}"]`);
    if(btn){btn.classList.add('checked');btn.closest('.sp-task-card')?.classList.add('sp-done');}
    const vanBtn=document.querySelector(`[data-spkey-hw="${key}"]`);
    if(vanBtn)vanBtn.closest('.sp-hw-task')?.remove();
  }catch(e){}
  try{checkPlanAch();}catch(e){}
  try{checkPlanDayAch(key.slice(0,10));}catch(e){}
  try{pushSyncBundle();}catch(e){}
}

function spStorePlan(tasks){
  try{localStorage.setItem(SP_PLAN_KEY,JSON.stringify({generated:new Date().toISOString().slice(0,10),tasks}));}catch(e){}
  try{pushSyncBundle();}catch(e){}
}
function spGetPlan(){try{return JSON.parse(localStorage.getItem(SP_PLAN_KEY)||'null');}catch(e){return null;}}
function spGetTodayTasks(){
  const plan=spGetPlan();
  if(!plan)return[];
  const today=new Date().toISOString().slice(0,10);
  return(plan.tasks||[]).filter(t=>t.dateStr===today);
}

// Actie-kleur helper
function spActCls(actKey){
  return{leerstof:'rgba(99,102,241,.15)',quiz:'rgba(249,115,22,.15)',flash:'rgba(20,184,166,.15)',open:'rgba(139,92,246,.15)',herhaal:'rgba(34,197,94,.15)'}[actKey]||'rgba(255,255,255,.08)';
}

function renderVandaagWidget(){
  const wrap=document.getElementById('sp-home-widget-wrap');
  if(!wrap)return;
  const plan=spGetPlan();
  const ACTS_HW={leerstof:['📖','Leerstof lezen'],quiz:['⚡','Snelle quiz'],flash:['🃏','Flashcards'],open:['📝','Open vragen'],herhaal:['🔄','Herhalen']};

  if(!plan){
    wrap.innerHTML=`<div class="sp-home-widget">
      <div class="sp-hw-header"><div class="sp-hw-title">📅 Studieplan</div></div>
      <div class="sp-hw-generate"><button class="sp-hw-gen-btn" onclick="show('sc-studieplan');renderStudieplan()">✨ Genereer mijn studieplan</button></div>
    </div>`;
    return;
  }

  const today=new Date().toISOString().slice(0,10);
  const todayTasks=(plan.tasks||[]).filter(t=>t.dateStr===today);
  const done=spGetDone();
  const openTasks=todayTasks.filter(t=>!done[`${t.dateStr}_${t.vakId}_${t.domId}_${t.actKey}`]);

  // Check urgency: any exam within 5 days?
  const mijn=getMijnVakken();
  const tody=new Date();tody.setHours(0,0,0,0);
  const urgent=EXAM_SCHEDULE.some(e=>{
    if(!e.vakId||(mijn.length>0&&!mijn.includes(e.vakId)))return false;
    const d=new Date(e.datum);d.setHours(0,0,0,0);
    return(d-tody)/864e5<=5&&(d-tody)>=0;
  });

  if(openTasks.length===0){
    const allDone=todayTasks.length>0;
    wrap.innerHTML=`<div class="sp-home-widget${urgent?' sp-urgent':''}">
      <div class="sp-hw-header">
        <div class="sp-hw-title">📅 Vandaag</div>
        <span class="sp-hw-link" onclick="show('sc-studieplan');renderStudieplan()">Plan →</span>
      </div>
      ${allDone
        ?'<div class="sp-hw-done-state">🎉 Alle taken voor vandaag gedaan!</div>'
        :'<div style="padding:12px 16px 14px;font-size:13px;color:var(--mu)">Geen taken ingepland voor vandaag.</div>'}
    </div>`;
    return;
  }

  const taskHtml=openTasks.slice(0,3).map(t=>{
    const key=`${t.dateStr}_${t.vakId}_${t.domId}_${t.actKey}`;
    const [icon,label]=ACTS_HW[t.actKey]||['📚','Oefenen'];
    return`<div class="sp-hw-task" onclick="spMarkDone('${key}');goToDomein('${t.vakId}','${t.domId}','${t.mode}')" data-spkey-hw="${key}">
      <div class="sp-hw-task-icon" style="background:${spActCls(t.actKey)}">${icon}</div>
      <div class="sp-hw-task-body">
        <div class="sp-hw-task-dom">${t.domNaam}</div>
        <div class="sp-hw-task-sub">${t.vakNaam} · ${label}</div>
      </div>
      <div class="sp-hw-task-time">~${t.mins}m</div>
    </div>`;
  }).join('');

  const extra=openTasks.length>3?`<div style="padding:0 16px 12px;font-size:12px;color:var(--mu)">+${openTasks.length-3} meer taken</div>`:'';

  wrap.innerHTML=`<div class="sp-home-widget${urgent?' sp-urgent':''}">
    <div class="sp-hw-header">
      <div class="sp-hw-title">📅 Vandaag <span style="font-size:11px;font-weight:700;background:rgba(var(--or-rgb),.15);color:var(--or);padding:2px 8px;border-radius:12px;border:1px solid rgba(var(--or-rgb),.25)">${openTasks.length} open</span></div>
      <span class="sp-hw-link" onclick="show('sc-studieplan');renderStudieplan()">Plan →</span>
    </div>
    <div class="sp-hw-tasks">${taskHtml}</div>
    ${extra}
  </div>`;
}

function spCheckAfterQuiz(vakId,domId,mode,score,total){
  try{
    if(!total||total<5||score<=0)return;
    const modeToAct={snel:'quiz',oud:'open',flash:'flash'};
    const actKey=modeToAct[mode];
    if(!actKey)return;
    const today=new Date().toISOString().slice(0,10);
    const key=`${today}_${vakId}_${domId}_${actKey}`;
    const plan=spGetPlan();
    if(!plan)return;
    const match=(plan.tasks||[]).find(t=>t.dateStr===today&&t.vakId===vakId&&t.domId===domId&&t.actKey===actKey);
    if(match&&!spIsDone(key)){
      spMarkDone(key);
      try{
        const t=document.createElement('div');
        t.style.cssText='position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#22c55e;color:#fff;padding:8px 18px;border-radius:12px;font-size:13px;font-weight:700;z-index:9999;box-shadow:0 4px 16px rgba(34,197,94,.4);pointer-events:none;white-space:nowrap';
        t.textContent='📅 Studieplan taak voltooid! +25 XP';
        document.body.appendChild(t);
        setTimeout(()=>t.remove(),2800);
      }catch(e){}
    }
  }catch(e){}
}

function spGetPrefs(){
  try{const p=JSON.parse(localStorage.getItem(SP_PREF_KEY)||'null');return p||{1:2,2:2,3:2,4:2,5:2,6:1};}
  catch(e){return{1:2,2:2,3:2,4:2,5:2,6:1};}
}
function spSavePrefs(p){try{localStorage.setItem(SP_PREF_KEY,JSON.stringify(p));}catch(e){}try{pushSyncBundle();}catch(e){}}

function spCyclePref(el){
  const prefs=spGetPrefs();
  const day=parseInt(el.dataset.day);
  const cur=parseInt(el.dataset.intensity)||0;
  const next=(cur+1)%4;
  el.dataset.intensity=next;
  prefs[day]=next;
  spSavePrefs(prefs);
}

function spInitPrefs(){
  const prefs=spGetPrefs();
  document.querySelectorAll('.sp-pref-day[data-day]').forEach(el=>{
    const d=parseInt(el.dataset.day);
    if(prefs[d]!==undefined)el.dataset.intensity=prefs[d];
  });
}

function spGetTrend(vakId,domId){
  try{
    const prev=JSON.parse(localStorage.getItem(SP_PREV_KEY)||'{}');
    const key=`${vakId}_${domId}`;
    if(prev[key]===undefined)return'new';
    const {pct,hasData}=getDomeinBestPct(vakId,domId);
    if(!hasData)return'new';
    const diff=pct-prev[key];
    if(diff>0.05)return'up';
    if(diff<-0.05)return'down';
    return'stable';
  }catch(e){return'stable';}
}

function spStorePcts(domains,vakId){
  try{
    const prev=JSON.parse(localStorage.getItem(SP_PREV_KEY)||'{}');
    domains.forEach(d=>{prev[`${vakId}_${d.id}`]=d.pct;});
    localStorage.setItem(SP_PREV_KEY,JSON.stringify(prev));
  }catch(e){}
}

function spDomActivities(dom,trend){
  if(!dom.hasData)return['leerstof','flash'];
  const p=dom.pct;
  if(trend==='down'){
    if(p<0.5)return['flash','quiz','flash'];
    if(p<0.75)return['flash','quiz'];
    return['quiz'];
  }
  if(trend==='up'){
    if(p<0.4)return['flash','quiz'];
    if(p<0.7)return['quiz'];
    return['herhaal'];
  }
  if(p<0.4)return['flash','quiz'];
  if(p<0.7)return['quiz','open'];
  return['herhaal'];
}

// Navigate to a domain and launch an activity
function goToDomein(vakId,domeinId,mode){
  const vak=getVK().find(v=>v.id===vakId);
  if(!vak)return;
  ST.vak=vak;
  ST.domein=vak.domeinen.find(d=>d.id===domeinId);
  if(!ST.domein){openVak(vakId);return;}
  checkPlanAch();
  if(mode==='snel')startQ('snel');
  else if(mode==='oud')startQ('oud');
  else if(mode==='flash')startFlash();
  else openVak(vakId);
}
function renderStudieplan(){
  const el=document.getElementById('studieplan-content');
  if(!el)return;
  const mijn=getMijnVakken();
  const today=new Date();today.setHours(0,0,0,0);
  const todayStr=today.toISOString().slice(0,10);
  const DN=['zo','ma','di','wo','do','vr','za'];
  const MN=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  const prefs=spGetPrefs();
  const BUDGET={0:0,1:30,2:50,3:70}; // minuten per dag per intensiteit

  // [icon, label, cssClass, mode, minutes]
  const ACTS={
    leerstof:['📖','Leerstof lezen','sp-act-leerstof','vak',20],
    quiz:    ['⚡','Snelle quiz',   'sp-act-quiz',    'snel',10],
    flash:   ['🃏','Flashcards',    'sp-act-flash',   'flash',8],
    open:    ['📝','Open vragen',   'sp-act-open',    'oud',15],
    herhaal: ['🔄','Herhalen',      'sp-act-herhaal', 'snel',10],
  };

  const upcoming=EXAM_SCHEDULE.filter(e=>{
    const d=new Date(e.datum);
    return d>today&&e.vakId&&(mijn.length===0||mijn.includes(e.vakId));
  });
  if(!upcoming.length){
    el.innerHTML='<div class="sp-empty">Geen aankomende examens gevonden.<br>Vink eerst je vakken aan via "Alleen mijn vakken" boven.</div>';
    return;
  }

  // 1. Bouw domeininfo per vak
  const vakInfo={};
  upcoming.forEach(ex=>{
    const vak=getVK().find(v=>v.id===ex.vakId);
    if(!vak||!vak.domeinen)return;
    const examD=new Date(ex.datum);examD.setHours(0,0,0,0);
    const daysLeft=Math.ceil((examD-today)/864e5);
    if(daysLeft<=0)return;
    const domains=vak.domeinen.map(dom=>{
      const {pct,hasData}=getDomeinBestPct(vak.id,dom.id);
      const trend=spGetTrend(vak.id,dom.id);
      const urgency=!hasData?0:pct<0.4?1:pct<0.7?2:3;
      return{id:dom.id,naam:dom.naam,pct,hasData,urgency,trend};
    }).sort((a,b)=>a.urgency-b.urgency||a.pct-b.pct);
    spStorePcts(domains,vak.id);
    vakInfo[vak.id]={vak,ex,examD,daysLeft,domains};
  });

  // 2. Verzamel alle taken in één globale pool, gesorteerd op prioriteit
  const pool=[];
  Object.values(vakInfo).forEach(({vak,examD,daysLeft,domains})=>{
    const examDateStr=examD.toISOString().slice(0,10);
    domains.filter(d=>d.urgency<3).forEach(dom=>{
      spDomActivities(dom,dom.trend).forEach(actKey=>{
        const [,,,mode,mins]=ACTS[actKey];
        const urgFactor=[3,2,1][dom.urgency]??1;
        const priority=(1-dom.pct)*urgFactor*100/Math.max(1,daysLeft)+(dom.trend==='down'?50:0);
        pool.push({priority,vakId:vak.id,vakNaam:vak.naam,domId:dom.id,domNaam:dom.naam,
          actKey,mins,mode,examDateStr,daysLeft,pct:dom.pct,hasData:dom.hasData});
      });
    });
  });
  pool.sort((a,b)=>b.priority-a.priority);

  // 3. Bouw globale studiedagenkaart (vandaag → laatste examen)
  const maxExamD=Object.values(vakInfo).reduce((mx,{examD})=>examD>mx?examD:mx,today);
  const dayMap={};
  {const d=new Date(today);while(d<maxExamD){
    const ds=d.toISOString().slice(0,10);
    const dow=d.getDay();const intensity=dow===0?0:(prefs[dow]??2);
    if(intensity>0)dayMap[ds]={date:new Date(d),intensity,remaining:BUDGET[intensity],tasks:[]};
    d.setDate(d.getDate()+1);
  }}
  const sortedDays=Object.keys(dayMap).sort();

  // 4. Wijs taken toe vanuit pool aan vroegste beschikbare dag met budget
  pool.forEach(task=>{
    for(const ds of sortedDays){
      if(ds>=task.examDateStr)break;
      const day=dayMap[ds];
      if(day.remaining>=task.mins){day.tasks.push(task);day.remaining-=task.mins;return;}
    }
    for(const ds of sortedDays){
      if(ds>=task.examDateStr)break;
      const day=dayMap[ds];
      if(day.remaining>0){day.tasks.push(task);day.remaining=0;return;}
    }
    for(let i=sortedDays.length-1;i>=0;i--){
      if(sortedDays[i]<task.examDateStr){dayMap[sortedDays[i]].tasks.push(task);return;}
    }
  });

  // 5. Voeg herhalingsdag toe de dag vóór elk examen
  Object.values(vakInfo).forEach(({vak,examD,domains})=>{
    const dayBefore=new Date(examD);dayBefore.setDate(examD.getDate()-1);
    if(dayBefore<today||dayBefore.getDay()===0)return;
    const ds=dayBefore.toISOString().slice(0,10);
    if(dayMap[ds])dayMap[ds].tasks.push({isReview:true,vakId:vak.id,vakNaam:vak.naam,
      actKey:'herhaal',mins:15,mode:'snel',domId:'_review',domNaam:'Herhaling'});
  });

  // 6. Platte takenlijst voor widget + autodetectie
  const allPlanTasks=[];
  sortedDays.forEach(ds=>{
    (dayMap[ds]?.tasks||[]).forEach(t=>{
      if(!t.isReview)allPlanTasks.push({dateStr:ds,...t});
    });
  });
  spStorePlan(allPlanTasks);
  if(!allPlanTasks.length&&!Object.keys(vakInfo).length){
    el.innerHTML='<div class="sp-empty">Alle domeinen zijn al klaar! 🎉</div>';return;
  }

  const doneMap=spGetDone();
  const fmtDate=d=>`${d.getDate()} ${MN[d.getMonth()]}`;
  function dayLbl(d){
    const ds=d.toISOString().slice(0,10);if(ds===todayStr)return'Vandaag';
    const tmr=new Date(today);tmr.setDate(today.getDate()+1);
    if(ds===tmr.toISOString().slice(0,10))return'Morgen';
    return DN[d.getDay()];
  }
  function ringHtml(pct,color){
    const r=9,cx=12,cy=12,circ=2*Math.PI*r;
    const off=(circ*(1-Math.max(0,Math.min(1,pct||0)))).toFixed(1);
    return`<svg width="26" height="26" viewBox="0 0 24 24" style="flex-shrink:0"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${off}" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/></svg>`;
  }
  function pctColor(pct,hasData){
    if(!hasData)return'rgba(255,255,255,.25)';
    if(pct<0.4)return'#ef4444';if(pct<0.7)return'#f97316';return'#22c55e';
  }
  function trendHtml(trend){
    if(trend==='up')return'<span class="sp-trend-up">↑</span>';
    if(trend==='down')return'<span class="sp-trend-down">↓</span>';
    if(trend==='new')return'<span class="sp-trend-stable" style="font-size:9px">nieuw</span>';
    return'';
  }

  // ── Vandaag sectie ──
  const todayAllTasks=(dayMap[todayStr]?.tasks||[]).filter(t=>!t.isReview);
  const todayOpenTasks=todayAllTasks.filter(t=>!doneMap[`${todayStr}_${t.vakId}_${t.domId}_${t.actKey}`]);
  let vandaagHtml='';
  if(todayAllTasks.length>0){
    const todayMins=todayAllTasks.reduce((s,t)=>s+(t.mins||0),0);
    const allDoneToday=todayOpenTasks.length===0;
    const cards=todayAllTasks.map(t=>{
      const key=`${todayStr}_${t.vakId}_${t.domId}_${t.actKey}`;
      const isDone=!!doneMap[key];
      const [icon,label,cls,mode,mins]=ACTS[t.actKey];
      return`<div class="sp-task-card${isDone?' sp-done':''}" id="sp-card-${key}">
        <div class="sp-task-card-left">
          <div class="sp-task-card-vak">${t.vakNaam}</div>
          <div class="sp-task-card-dom">${t.domNaam}</div>
          <div class="sp-task-card-meta">
            <button class="sp-act-btn ${cls}" style="padding:4px 10px;font-size:11px" onclick="goToDomein('${t.vakId}','${t.domId}','${mode}')">${icon} ${label} →</button>
            <span class="sp-task-card-time">~${mins} min</span>
          </div>
        </div>
        <button class="sp-check-btn${isDone?' checked':''}" data-spkey="${key}"
          onclick="spMarkDone('${key}');this.classList.add('checked');this.closest('.sp-task-card')?.classList.add('sp-done');renderVandaagWidget()"
          aria-label="Markeer als gedaan">
          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
      </div>`;
    }).join('');
    vandaagHtml=`<div class="sp-vandaag">
      <div class="sp-vandaag-header">
        <div class="sp-vandaag-title">📌 Vandaag</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="sp-task-card-time" style="font-size:12px">~${todayMins} min</span>
          ${allDoneToday?'<span style="font-size:12px;color:#22c55e;font-weight:700;background:rgba(34,197,94,.12);padding:2px 9px;border-radius:20px;border:1px solid rgba(34,197,94,.2)">✓ Klaar!</span>':`<span class="sp-vandaag-badge">${todayOpenTasks.length} open</span>`}
        </div>
      </div>
      ${cards}
    </div>`;
  } else if(allPlanTasks.length>0){
    vandaagHtml=`<div class="sp-vandaag" style="text-align:center;padding:18px 16px">
      <div class="sp-vandaag-title" style="margin-bottom:6px">📌 Vandaag</div>
      <div style="font-size:13px;color:var(--mu)">🌴 Vrije dag — goed verdiend!</div>
    </div>`;
  }

  // ── Statistieken ──
  const totalTasks=allPlanTasks.length;
  const totalMins=allPlanTasks.reduce((s,t)=>s+(t.mins||0),0);
  const totalDoneTasks=allPlanTasks.filter(t=>!!doneMap[`${t.dateStr}_${t.vakId}_${t.domId}_${t.actKey}`]).length;
  const summaryHtml=`<div class="sp-summary">
    <div class="sp-sum-card"><div class="sp-sum-val">${totalTasks}</div><div class="sp-sum-lbl">Taken gepland</div></div>
    <div class="sp-sum-card"><div class="sp-sum-val">${totalDoneTasks}</div><div class="sp-sum-lbl">Gedaan</div></div>
    <div class="sp-sum-card"><div class="sp-sum-val">~${(totalMins/60).toFixed(1)}u</div><div class="sp-sum-lbl">Studeertijd</div></div>
  </div>`;

  // ── Kalender: komende dagen ──
  const futureDates=sortedDays.filter(ds=>ds>todayStr&&(dayMap[ds]?.tasks||[]).length>0).slice(0,14);
  let calHtml='';
  if(futureDates.length>0){
    const intColors={1:'#22c55e',2:'var(--or)',3:'#ef4444'};
    const dayRows=futureDates.map(ds=>{
      const day=dayMap[ds];
      const d=day.date;
      const realTasks=day.tasks.filter(t=>!t.isReview);
      const reviewTasks=day.tasks.filter(t=>t.isReview);
      const usedMins=realTasks.reduce((s,t)=>s+(t.mins||0),0);
      const doneCnt=realTasks.filter(t=>!!doneMap[`${ds}_${t.vakId}_${t.domId}_${t.actKey}`]).length;
      const allDone=realTasks.length>0&&doneCnt===realTasks.length;
      const taskRows=[...realTasks.map(t=>{
        const isDone=!!doneMap[`${ds}_${t.vakId}_${t.domId}_${t.actKey}`];
        const [icon,,,, mins]=ACTS[t.actKey];
        return`<div class="sp-cal-task-row${isDone?' sp-done':''}">
          <span class="sp-act-badge">${icon}</span>
          <div class="sp-cal-task-info">
            <span class="sp-cal-task-vak">${t.vakNaam}</span>
            <span class="sp-cal-task-dom">${t.domNaam}</span>
          </div>
          <span class="sp-cal-task-meta">~${mins}m</span>
        </div>`;
      }),...reviewTasks.map(t=>`<div class="sp-cal-task-row" style="opacity:.65">
        <span class="sp-act-badge">🔄</span>
        <div class="sp-cal-task-info">
          <span class="sp-cal-task-vak">${t.vakNaam}</span>
          <span class="sp-cal-task-dom">Herhalingsdag vóór examen</span>
        </div>
        <span class="sp-cal-task-meta">~15m</span>
      </div>`)].join('');
      return`<div class="sp-cal-day${allDone?' sp-done':''}">
        <div class="sp-cal-day-header">
          <div>
            <div class="sp-cal-day-name">${dayLbl(d)}</div>
            <div class="sp-cal-day-date">${fmtDate(d)}</div>
          </div>
          <div class="sp-cal-day-right">
            <span class="sp-cal-task-count" style="color:${intColors[day.intensity]||'var(--mu)'}">${realTasks.length+reviewTasks.length} taken</span>
            <span class="sp-cal-mins">~${usedMins} min</span>
            ${allDone?'<span class="sp-cal-done-badge">✓ Klaar</span>':''}
          </div>
        </div>
        <div class="sp-cal-tasks">${taskRows}</div>
      </div>`;
    }).join('');
    calHtml=`<div style="margin-top:4px"><div class="sp-section-title">Komende dagen</div>${dayRows}</div>`;
  }

  // ── Beheersing per vak ──
  let masteryHtml='<div style="margin-top:24px"><div class="sp-section-title">Beheersing per vak</div>';
  Object.values(vakInfo).forEach(({vak,examD,daysLeft,domains})=>{
    const doneCount=domains.filter(d=>d.urgency===3).length;
    const donePct=domains.length?Math.round(doneCount/domains.length*100):100;
    const urgCls=daysLeft<=5?'urgent':daysLeft<=12?'soon':'ok';
    const urgTxt=daysLeft<=5?`⚠️ ${daysLeft}d`:`${daysLeft}d`;
    masteryHtml+=`<div class="sp-vak-block" style="margin-bottom:12px">
      <div class="sp-vak-header">
        ${vak.kleur?`<div class="sp-vak-dot" style="background:${vak.kleur}"></div>`:''}
        <div class="sp-vak-name">${vak.naam}</div>
        <div class="sp-vak-meta">${doneCount}/${domains.length} klaar</div>
        <span class="sp-vak-countdown ${urgCls}">${urgTxt}</span>
      </div>
      <div class="sp-progress-bar"><div class="sp-progress-fill" style="width:${donePct}%"></div></div>
      <div class="sp-mastery-grid">${domains.map(dom=>{
        const color=pctColor(dom.pct,dom.hasData);
        const pctTxt=dom.hasData?Math.round(dom.pct*100)+'%':'–';
        return`<div class="sp-mastery-card">
          ${ringHtml(dom.pct,color)}
          <div class="sp-mastery-info">
            <div class="sp-mastery-name">${dom.naam}</div>
            <div class="sp-mastery-row"><span class="sp-mastery-pct" style="color:${color}">${pctTxt}</span>${trendHtml(dom.trend)}</div>
            <div class="sp-mastery-bar"><div class="sp-mastery-bar-fill" style="width:${dom.hasData?Math.round(dom.pct*100):0}%;background:${color}"></div></div>
          </div>
        </div>`;
      }).join('')}</div>
    </div>`;
  });
  masteryHtml+='</div>';

  el.innerHTML=vandaagHtml+summaryHtml+calHtml+masteryHtml;
  localStorage.setItem('slagio_plan_generated','1');
  if(todayAllTasks.length)setTimeout(()=>document.querySelector('.sp-vandaag')?.scrollIntoView({behavior:'smooth',block:'nearest'}),120);
  const btn=document.getElementById('sp-gen-btn');
  if(btn)btn.textContent='🔄 Herbereken studieplan';
  try{trackEvent('studieplan_generated',{vakken:Object.keys(vakInfo).length});}catch(e){}
}
// ═══════ TOEGANKELIJKHEID ═══════
const ACC_KEY='slagio_acc_v1';
function getAccPrefs(){try{return JSON.parse(localStorage.getItem(ACC_KEY)||'{}');}catch(e){return{};}}
function toggleDyslexie(on){const p=getAccPrefs();p.dyslexie=on;localStorage.setItem(ACC_KEY,JSON.stringify(p));applyAccPrefs();}
function toggleHoogContrast(on){const p=getAccPrefs();p.contrast=on;localStorage.setItem(ACC_KEY,JSON.stringify(p));applyAccPrefs();}
function applyAccPrefs(){
  const p=getAccPrefs();
  document.body.classList.toggle('dyslexie',!!p.dyslexie);
  document.body.classList.toggle('hoog-contrast',!!p.contrast);
  if(p.dyslexie&&!document.getElementById('dyslexic-font')){
    const link=document.createElement('link');
    link.id='dyslexic-font';link.rel='stylesheet';
    link.href='https://fonts.cdnfonts.com/css/opendyslexic';
    document.head.appendChild(link);
  }
  const t1=document.getElementById('acc-dyslexie-toggle');
  const t2=document.getElementById('acc-contrast-toggle');
  if(t1)t1.checked=!!p.dyslexie;
  if(t2)t2.checked=!!p.contrast;
}
// Apply on load
applyAccPrefs();

// ═══════ LEERPAD ═══════
function showLeerpad(){
  if(!ST.vak)return;
  const vak=ST.vak;
  const domeinen=vak.domeinen;

  // Header
  document.getElementById('lp-nav-title').textContent=vak.naam;
  document.getElementById('lp-nav-badge').textContent=(APP_LEVEL||'havo').toUpperCase();
  document.getElementById('lp-hero-title').textContent=vak.naam;

  // Stats
  let doneCount=0,totalPct=0,pctCount=0;
  domeinen.forEach(d=>{
    const r=getDomeinBestPct(vak.id,d.id);
    if(r.pct>=0.7)doneCount++;
    if(r.hasData){totalPct+=r.pct;pctCount++;}
  });
  const avgPct=pctCount>0?Math.round(totalPct/pctCount*100):0;
  const overallPct=Math.round(doneCount/domeinen.length*100);
  const allDone=domeinen.length>0&&doneCount===domeinen.length;

  document.getElementById('lp-stat-done').textContent=doneCount;
  document.getElementById('lp-stat-total').textContent=domeinen.length;
  document.getElementById('lp-stat-avg').textContent=avgPct+'%';
  document.getElementById('lp-overall-pct').textContent=overallPct+'%';
  document.getElementById('lp-hero-sub').textContent=
    allDone?'🎉 Alle domeinen voltooid — goed bezig!':
    doneCount>0?`${doneCount} van ${domeinen.length} domeinen voltooid`:
    'Werk systematisch door alle domeinen heen';

  document.getElementById('lp-champion').style.display=allDone?'block':'none';

  // Find recommended next domain (first not done, or first needing review)
  let nextIdx=-1;
  for(let i=0;i<domeinen.length;i++){
    const r=getDomeinBestPct(vak.id,domeinen[i].id);
    const decay=getDecayStatus(vak.id,domeinen[i].id);
    const isDone=r.pct>=0.7;
    const needsReview=isDone&&decay&&(decay.label.includes('geleden')&&!decay.label.includes('Vandaag'));
    if(needsReview&&nextIdx===-1){nextIdx=i;}
    if(!isDone&&nextIdx===-1){nextIdx=i;}
  }
  if(nextIdx===-1)nextIdx=0;

  // Build path HTML
  const container=document.getElementById('lp-path');
  container.innerHTML='';
  const R=40,SZ=88,C=(2*Math.PI*R); // bigger ring: r=40, 88px SVG

  domeinen.forEach((d,i)=>{
    const isUnlocked=i===0||getDomeinBestPct(vak.id,domeinen[i-1].id).pct>=0.60;
    const r=getDomeinBestPct(vak.id,d.id);
    const decay=getDecayStatus(vak.id,d.id);
    const pct=Math.round(r.pct*100);
    const isDone=r.pct>=0.7;
    const isStarted=r.hasData&&!isDone;
    const needsReview=isDone&&decay&&(decay.label.includes('geleden')&&!decay.label.includes('Vandaag'));
    const isNext=i===nextIdx;

    if(!isUnlocked){
      // LOCKED domain
      const statusKey='s-locked';
      const statusEmoji='🔒';
      const statusTxt=`Domein ${domeinen[i-1].id} eerst voltooien`;
      const ringStroke='rgba(255,255,255,.1)';
      const ringGlow='';
      const connHtml=`<div class="lp-conn"><div class="lp-conn-line"><div class="lp-conn-fill"></div></div></div>`;
      const side=i%2===0?'r-left':'r-right';
      const delayStyle=`animation-delay:${i*0.09}s`;
      const prevDomeinId=domeinen[i-1].id;
      const nodeHtml=`${connHtml}
<div class="lp-node-wrap" style="${delayStyle}">
<div class="lp-row ${side}">
  <div class="lp-row-side">
    <div class="lp-card lp-locked" onclick="showToast('Voltooi eerst Domein ${prevDomeinId} (60%) om dit domein te ontgrendelen 🔒','#6366f1',3000)">
      <div class="lp-card-head">
        <div class="lp-card-letter" style="background:rgba(255,255,255,.06);color:rgba(255,255,255,.3)">${d.id}</div>
        <div class="lp-card-name">Domein ${d.id}<br><span style="font-weight:500;font-size:11.5px;color:rgba(255,255,255,.25)">${d.naam}</span></div>
      </div>
      <div class="lp-card-badge ${statusKey}">${statusEmoji} ${statusTxt}</div>
    </div>
  </div>
  <div class="lp-row-mid">
    <div class="lp-ring-outer lp-locked-ring">
      <svg class="lp-ring-svg" width="${SZ}" height="${SZ}" viewBox="0 0 ${SZ} ${SZ}">
        <circle class="lp-ring-bg" cx="44" cy="44" r="${R}" stroke="${ringStroke}"/>
        <text x="44" y="44" text-anchor="middle" font-size="22" style="dominant-baseline:middle">🔒</text>
      </svg>
    </div>
  </div>
  <div class="lp-row-side" style="visibility:hidden"></div>
</div>
</div>`;
      container.insertAdjacentHTML('beforeend',nodeHtml);
      return;
    }

    // Status
    let statusKey,statusTxt,statusEmoji,ringStroke,ringGlow;
    if(isDone&&needsReview){
      statusKey='s-review';statusTxt='Herhaling aanbevolen';statusEmoji='🔁';ringStroke='#f97316';ringGlow='';
    }else if(isDone){
      statusKey='s-done';statusTxt='Voltooid ✓';statusEmoji='⭐';ringStroke='#4ade80';ringGlow='done';
    }else if(isNext&&!isStarted){
      statusKey='s-next';statusTxt='Begin hier';statusEmoji='🎯';ringStroke='var(--or)';ringGlow='next';
    }else if(isStarted){
      statusKey='s-started';statusTxt=pct+'% beste score';statusEmoji='⚡';ringStroke='var(--or)';ringGlow=isNext?'next':'';
    }else{
      statusKey='s-locked';statusTxt='Nog niet geoefend';statusEmoji='📖';ringStroke='rgba(255,255,255,.12)';ringGlow='';
    }
    const ringOffset=(C*(1-r.pct)).toFixed(1);
    const pctColor=isDone?'#4ade80':isStarted||isNext?'var(--or)':'rgba(255,255,255,.3)';

    // Connector from previous node
    let connHtml='';
    if(i>0){
      const prevDone=getDomeinBestPct(vak.id,domeinen[i-1].id).pct>=0.7;
      const connDone=(prevDone&&isDone)?'done':'';
      connHtml=`<div class="lp-conn"><div class="lp-conn-line"><div class="lp-conn-fill ${connDone}"></div></div></div>`;
    }

    const cardCls=`lp-card ${isDone?'s-done':''} ${needsReview?'s-review':''} ${(isNext&&!isDone)?'s-next':''}`.trim();
    const side=i%2===0?'r-left':'r-right';
    const miniBarHtml=r.hasData?`<div class="lp-mini-bar"><div class="lp-mini-fill" style="background:${ringStroke}" data-w="${pct}"></div></div>`:'';
    const glowHtml=ringGlow?`<div class="lp-ring-glow lp-ring-glow-${ringGlow}"></div>`:'';
    const delayStyle=`animation-delay:${i*0.09}s`;

    const nodeHtml=`${connHtml}
<div class="lp-node-wrap" style="${delayStyle}">
<div class="lp-row ${side}">
  <div class="lp-row-side">
    <div class="${cardCls}" onclick="lpToggleCard(this,'${d.id}')">
      ${isNext&&!isDone?'<div class="lp-next-pill">▶ Volgende</div>':''}
      <div class="lp-card-head">
        <div class="lp-card-letter" style="background:${vak.kleur}28;color:${vak.kleur}">${d.id}</div>
        <div class="lp-card-name">Domein ${d.id}<br><span style="font-weight:500;font-size:11.5px;color:rgba(255,255,255,.45)">${d.naam}</span></div>
      </div>
      <div class="lp-card-badge ${statusKey}">${statusEmoji} ${statusTxt}</div>
      ${miniBarHtml}
      <div class="lp-card-extra">
        <div class="lp-card-desc">${d.beschrijving}</div>
        <div class="lp-card-btns">
          <button class="lp-qbtn primary" onclick="event.stopPropagation();lpStartOefenen('${d.id}')">▶ Oefenen</button>
          <button class="lp-qbtn" onclick="event.stopPropagation();lpStartFlash('${d.id}')">📇 Flashcards</button>
        </div>
      </div>
    </div>
  </div>
  <div class="lp-row-mid">
    <div class="lp-ring-outer">
      ${glowHtml}
      <svg class="lp-ring-svg" width="${SZ}" height="${SZ}" viewBox="0 0 ${SZ} ${SZ}">
        <circle class="lp-ring-bg" cx="44" cy="44" r="${R}"/>
        <circle class="lp-ring-fill"
          cx="44" cy="44" r="${R}"
          stroke="${ringStroke}"
          stroke-dasharray="${C.toFixed(1)}"
          stroke-dashoffset="${C.toFixed(1)}"
          data-to="${ringOffset}"
          style="transform:rotate(-90deg);transform-origin:44px 44px"/>
        <text x="44" y="40" text-anchor="middle" font-size="22" style="dominant-baseline:middle">${statusEmoji}</text>
        ${r.hasData?`<text x="44" y="58" text-anchor="middle" font-size="11" font-weight="800" fill="${pctColor}" font-family="Inter,sans-serif" letter-spacing="0.5">${pct}%</text>`:''}
      </svg>
    </div>
  </div>
  <div class="lp-row-side" style="visibility:hidden"></div>
</div>
</div>`;
    container.insertAdjacentHTML('beforeend',nodeHtml);
  });

  // Show screen first, then animate
  show('sc-leerpad');
  setTimeout(()=>{
    container.querySelectorAll('.lp-ring-fill').forEach(ring=>{
      const target=ring.dataset.to;
      if(target!==undefined)ring.style.strokeDashoffset=target;
    });
    container.querySelectorAll('.lp-mini-fill').forEach(fill=>{
      fill.style.width=(fill.dataset.w||'0')+'%';
    });
    container.querySelectorAll('.lp-conn-fill.done').forEach(fill=>{
      // re-trigger animation by removing and re-adding class
      fill.classList.remove('done');
      requestAnimationFrame(()=>requestAnimationFrame(()=>fill.classList.add('done')));
    });
    document.getElementById('lp-overall-fill').style.width=overallPct+'%';
  },150);
}

function lpToggleCard(card,domeinId){
  const extra=card.querySelector('.lp-card-extra');
  if(!extra)return;
  const isOpen=extra.classList.contains('open');
  // Close all other open cards first
  document.querySelectorAll('#lp-path .lp-card-extra.open').forEach(e=>{
    e.classList.remove('open');
    e.closest('.lp-card').style.zIndex='';
  });
  if(!isOpen){
    extra.classList.add('open');
    card.style.zIndex='2';
  }
}

function lpStartOefenen(domeinId){
  if(!ST.vak)return;
  ST.domein=ST.vak.domeinen.find(d=>d.id===domeinId);
  if(!ST.domein)return;
  openQmode(domeinId);
}

function lpStartFlash(domeinId){
  if(!ST.vak)return;
  ST.domein=ST.vak.domeinen.find(d=>d.id===domeinId);
  if(!ST.domein)return;
  show('sc-flash');
  startFlash();
}

// ═══════ SIMULATIETOETS ═══════
let SIM={};
const SIM_MODES={
  oefenen:{key:'oefenen',label:'Oefenen', icon:'📖',vpd:1,  tpq:0, deelsPts:0.5, clr:'#22c55e',badgeCls:'sim-mi-oe'},
  normaal: {key:'normaal', label:'Normaal', icon:'🎯',vpd:999,tpq:5, deelsPts:0.5, clr:'#6366f1',badgeCls:'sim-mi-no'},
  examen:  {key:'examen',  label:'Examen',  icon:'⚡',vpd:999,tpq:3, deelsPts:0.25,clr:'#ef4444',badgeCls:'sim-mi-ex'},
};
let _simMode='normaal';

function simSelectMode(key){
  _simMode=key;
  ['oefenen','normaal','examen'].forEach(k=>{
    document.getElementById('sim-mc-'+k.slice(0,2))?.classList.toggle('selected',k===key);
  });
  // Update hint + info-grid
  const m=SIM_MODES[key];
  const hints={
    oefenen:'📖 <strong>Oefenen</strong> — 1 willekeurige vraag per CE-domein, geen tijdslimiet. Ideaal om rustig te verkennen zonder druk.',
    normaal: '🎯 <strong>Normaal</strong> — alle vragen, 5 minuten per vraag. Realistische oefensessie met tijdlimiet.',
    examen:  '⚡ <strong>Examen</strong> — alle vragen, 3 minuten per vraag. <em>Deels goed</em> telt als kwart punt — scherpe beoordelingen vereist.',
  };
  const hintClrs={oefenen:'rgba(34,197,94,.08)',normaal:'rgba(99,102,241,.07)',examen:'rgba(239,68,68,.07)'};
  const hintBrdr={oefenen:'rgba(34,197,94,.25)',normaal:'rgba(99,102,241,.2)',examen:'rgba(239,68,68,.2)'};
  const hintTxt={oefenen:'#16a34a',normaal:'#818cf8',examen:'#ef4444'};
  const hint=document.getElementById('sim-mode-hint');
  if(hint){hint.style.background=hintClrs[key];hint.style.border='1px solid '+hintBrdr[key];hint.style.color=hintTxt[key];hint.innerHTML=hints[key];}
  // Recompute grid if vak known
  if(SIM.vak)_simUpdateInfoGrid();
}

function _simUpdateInfoGrid(){
  const m=SIM_MODES[_simMode];
  const vak=SIM.vak;
  const ceDomeinen=vak.domeinen.filter(d=>!d.ceStatus||d.ceStatus!=='SE');
  let total=0;
  ceDomeinen.forEach(d=>{
    const pool=(d.oe||[]).filter(q=>q.v&&q.u);
    total+=Math.min(pool.length,m.vpd);
  });
  const mins=m.tpq===0?'∞':total*m.tpq;
  const grid=document.getElementById('sim-info-grid');
  if(!grid)return;
  grid.innerHTML=`
    <div class="sim-info-card"><div class="sim-info-num">${total}</div><div class="sim-info-lbl">Open vragen</div></div>
    <div class="sim-info-card"><div class="sim-info-num">${mins}${m.tpq?'&nbsp;min':''}</div><div class="sim-info-lbl">Tijdlimiet</div></div>
    <div class="sim-info-card"><div class="sim-info-num">${ceDomeinen.length}</div><div class="sim-info-lbl">CE-domeinen</div></div>`;
  const btn=document.getElementById('sim-start-btn');
  if(btn){btn.style.background=m.key==='examen'?'linear-gradient(135deg,#ef4444,#f87171)':m.key==='oefenen'?'linear-gradient(135deg,#22c55e,#4ade80)':'linear-gradient(135deg,#6366f1,#818cf8)';btn.style.boxShadow='0 4px 18px '+m.clr+'55';}
}

function startSimToets(){
  trackEvent('simulatietoets',{vak:ST.vak?.naam||null});
  if(!ST.vak)return;
  const vak=ST.vak;
  SIM={vak,questions:[],idx:0,answers:[],timer:null,duration:0,started:false,mode:_simMode};

  // Reset mode selector UI to current _simMode
  simSelectMode(_simMode);

  // Store vak reference so _simUpdateInfoGrid works
  _simUpdateInfoGrid();

  // Update setup screen
  document.getElementById('sim-nav-title').textContent=vak.naam+' — Simulatie';
  document.getElementById('sim-setup-title').textContent='Simulatietoets '+vak.naam;
  const ceDomeinen=vak.domeinen.filter(d=>!d.ceStatus||d.ceStatus!=='SE');
  document.getElementById('sim-setup-desc').textContent=ceDomeinen.length+' CE-domeinen · kies een moeilijkheidsgraad.';

  // Reset phases
  document.getElementById('sim-setup').style.display='';
  document.getElementById('sim-quiz').style.display='none';
  document.getElementById('sim-result').style.display='none';
  document.getElementById('sim-timer-chip').style.display='none';
  show('sc-simtoets');
}

function simStart(){
  // Build question pool based on selected mode
  const m=SIM_MODES[_simMode]||SIM_MODES.normaal;
  SIM.mode=m;
  const vak=SIM.vak;
  const ceDomeinen=vak.domeinen.filter(d=>!d.ceStatus||d.ceStatus!=='SE');
  SIM.questions=[];
  ceDomeinen.forEach(d=>{
    const pool=(d.oe||[]).filter(q=>q.v&&q.u).map(q=>({...q,_type:'open',domeinId:d.id,domeinNaam:d.naam,domeinKleur:vak.kleur}));
    const shuffled=[...pool].sort(()=>Math.random()-.5);
    shuffled.slice(0,m.vpd).forEach(q=>SIM.questions.push(q));
  });
  SIM.questions.sort(()=>Math.random()-.5);

  const total=SIM.questions.length;
  SIM.duration=m.tpq>0?total*m.tpq*60:0; // 0 = no timer

  document.getElementById('sim-setup').style.display='none';
  document.getElementById('sim-quiz').style.display='';
  const timerChip=document.getElementById('sim-timer-chip');
  timerChip.style.display=m.tpq>0?'':'none';

  // Mode badge in nav
  const navBadge=document.getElementById('sim-mode-nav-badge');
  if(navBadge){navBadge.className='sim-mode-indicator '+m.badgeCls;navBadge.textContent=m.icon+' '+m.label;navBadge.style.display='';}

  SIM.idx=0;SIM.answers=[];SIM.started=true;
  if(m.tpq>0){
    SIM.endTime=Date.now()+SIM.duration*1000;
    if(SIM.timer)clearInterval(SIM.timer);
    SIM.timer=setInterval(simTimerTick,1000);
  }
  simShowQ();
}

function simTimerTick(){
  const left=Math.max(0,Math.round((SIM.endTime-Date.now())/1000));
  const m=Math.floor(left/60),s=left%60;
  const chip=document.getElementById('sim-timer-chip');
  if(chip)chip.textContent='⏱ '+m+':'+(s<10?'0':'')+s;
  if(chip){
    if(left<=60)chip.style.color='#ef4444';
    else if(left<=180)chip.style.color='#f97316';
    else chip.style.color='var(--or)';
  }
  if(left===0){clearInterval(SIM.timer);simFinish();}
}

function simShowQ(){
  if(SIM.idx>=SIM.questions.length){simFinish();return;}
  const q=SIM.questions[SIM.idx];
  const total=SIM.questions.length;
  const pct=Math.round(SIM.idx/total*100);
  document.getElementById('sim-prog-bar').style.width=pct+'%';
  document.getElementById('sim-q-domain').textContent='Domein '+q.domeinId+': '+q.domeinNaam;
  document.getElementById('sim-q-counter').textContent=(SIM.idx+1)+' / '+total;
  document.getElementById('sim-q-text').textContent=q.v;

  const isMC=q._type==='mc'||(q.o&&q.o.length>1);
  // Type badge
  const badge=document.getElementById('sim-type-badge');
  badge.textContent=isMC?'Multiple choice':'Open vraag';
  badge.className='sim-type-badge '+(isMC?'sim-type-mc':'sim-type-open');

  // Context box (open vragen)
  const ctxWrap=document.getElementById('sim-ctx-wrap');
  if(q.ctx&&!isMC){ctxWrap.style.display='';document.getElementById('sim-ctx-text').textContent=q.ctx;}
  else{ctxWrap.style.display='none';}

  // Show/hide MC vs open
  const optsEl=document.getElementById('sim-q-opts');
  const openArea=document.getElementById('sim-open-area');
  const nextBtn=document.getElementById('sim-next-btn');
  nextBtn.textContent=SIM.idx===total-1?'Afronden →':'Volgende →';

  if(isMC){
    optsEl.style.display='flex';
    openArea.style.display='none';
    const idxArr=[0,1,2,3].slice(0,q.o.length);
    const shuffled=[...idxArr].sort(()=>Math.random()-.5);
    optsEl.innerHTML=shuffled.map(oi=>`
      <button class="sim-opt" onclick="simSelectOpt(this,${oi},${q.c})">${q.o[oi]}</button>
    `).join('');
    nextBtn.disabled=true;nextBtn.style.opacity='.35';
  }else{
    optsEl.style.display='none';
    openArea.style.display='block';
    document.getElementById('sim-open-ta').value='';
    document.getElementById('sim-open-ta').disabled=false;
    document.getElementById('sim-nakijk-btn').style.display='block';
    document.getElementById('sim-model-blok').style.display='none';
    document.getElementById('sim-ma-text').textContent=q.u||'';
    document.querySelectorAll('.sim-ab').forEach(b=>b.disabled=false);
    nextBtn.disabled=true;nextBtn.style.opacity='.35';
  }
}

function simSelectOpt(btn,selectedIdx,correctIdx){
  const optsEl=document.getElementById('sim-q-opts');
  optsEl.querySelectorAll('.sim-opt').forEach(b=>b.disabled=true);
  btn.classList.add(selectedIdx===correctIdx?'correct':'wrong');
  if(selectedIdx!==correctIdx){
    optsEl.querySelectorAll('.sim-opt').forEach(b=>{
      if(parseInt(b.getAttribute('onclick').match(/simSelectOpt\(this,(\d+)/)?.[1])===correctIdx){
        b.classList.add('correct');
      }
    });
  }
  const q=SIM.questions[SIM.idx];
  SIM.answers.push({correct:selectedIdx===correctIdx,pts:selectedIdx===correctIdx?1:0,_type:'mc',domeinId:q.domeinId,domeinNaam:q.domeinNaam,domeinKleur:q.domeinKleur});
  const nextBtn=document.getElementById('sim-next-btn');
  nextBtn.disabled=false;nextBtn.style.opacity='1';
}

function simNakijken(){
  document.getElementById('sim-open-ta').disabled=true;
  document.getElementById('sim-nakijk-btn').style.display='none';
  document.getElementById('sim-model-blok').style.display='block';
}

function simBeoordeel(rawPts){
  document.querySelectorAll('.sim-ab').forEach(b=>b.disabled=true);
  const q=SIM.questions[SIM.idx];
  // In examen mode: "deels" = 0.25 instead of 0.5
  const m=SIM.mode||SIM_MODES.normaal;
  const pts=rawPts===0.5?m.deelsPts:rawPts;
  SIM.answers.push({correct:pts>=0.5,pts,rawPts,_type:'open',domeinId:q.domeinId,domeinNaam:q.domeinNaam,domeinKleur:q.domeinKleur});
  const nextBtn=document.getElementById('sim-next-btn');
  nextBtn.disabled=false;nextBtn.style.opacity='1';
}

function simNextQ(){
  SIM.idx++;
  if(SIM.idx>=SIM.questions.length){simFinish();return;}
  simShowQ();
}

function simFinish(){
  if(SIM.timer){clearInterval(SIM.timer);SIM.timer=null;}
  document.getElementById('sim-quiz').style.display='none';
  document.getElementById('sim-timer-chip').style.display='none';
  document.getElementById('sim-result').style.display='';

  const totalPts=SIM.answers.reduce((s,a)=>s+(a.pts??(a.correct?1:0)),0);
  const total=SIM.answers.length;
  const correct=Math.round(totalPts);
  const pct=total>0?totalPts/total:0;
  // CE grade estimate: 9 * (pct) + 1, rounded to 0.5
  const rawGrade=9*pct+1;
  const grade=Math.round(rawGrade*2)/2;
  const gradeColor=grade>=7?'#22c55e':grade>=5.5?'#f97316':'#ef4444';
  const gradeEmoji=grade>=8?'🏆':grade>=7?'⭐':grade>=6?'👍':grade>=5.5?'📈':'📚';

  const m=SIM.mode||SIM_MODES.normaal;
  const isOefenen=m.key==='oefenen';
  document.getElementById('sim-res-emoji').textContent=isOefenen?'📖':gradeEmoji;
  document.getElementById('sim-res-grade').textContent=isOefenen?Math.round(pct*100)+'%':grade.toFixed(1).replace('.',',');
  document.getElementById('sim-res-grade').style.color=gradeColor;
  document.getElementById('sim-res-label').textContent=isOefenen?'Oefenscore':'Geschat CE-cijfer';
  const modeLbl=`<span style="font-size:11px;font-weight:800;padding:2px 9px;border-radius:20px;background:${m.clr}18;color:${m.clr};border:1px solid ${m.clr}33;margin-left:6px">${m.icon} ${m.label}</span>`;
  document.getElementById('sim-res-score').innerHTML=correct+' van '+total+' vragen correct ('+Math.round(pct*100)+'%)'+modeLbl;

  // Per-domain breakdown
  const domMap={};
  SIM.answers.forEach(a=>{
    if(!domMap[a.domeinId])domMap[a.domeinId]={naam:a.domeinNaam,kleur:a.domeinKleur,correct:0,total:0};
    domMap[a.domeinId].total++;
    if(a.correct)domMap[a.domeinId].correct++;
  });

  const domRes=document.getElementById('sim-domain-results');
  domRes.innerHTML='<div style="font-size:12px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.7px;margin-bottom:12px">Resultaat per domein</div>'+
    Object.entries(domMap).map(([id,d])=>{
      const dp=d.total>0?Math.round(d.correct/d.total*100):0;
      const dc=dp>=70?'#22c55e':dp>=50?'#f97316':'#ef4444';
      return `<div class="sim-dom-card">
        <div class="sim-dom-letter" style="background:${d.kleur}22;color:${d.kleur}">${id}</div>
        <div class="sim-dom-info">
          <div class="sim-dom-name">Domein ${id}: ${d.naam}</div>
          <div class="sim-dom-bar-wrap"><div class="sim-dom-bar" style="width:${dp}%;background:${dc}"></div></div>
        </div>
        <div class="sim-dom-score" style="color:${dc}">${d.correct}/${d.total}</div>
      </div>`;
    }).join('');

  // Show progress bar full
  document.getElementById('sim-prog-bar').style.width='100%';
}

function simExit(){
  if(SIM.timer){clearInterval(SIM.timer);SIM.timer=null;}
  const nb=document.getElementById('sim-mode-nav-badge');if(nb)nb.style.display='none';
  show('sc-detail');
}

// ═══════ EXAMEN MODUS ═══════
let EX = {}; // examen state

function startExamen(){
  // Zoek examen voor huidig vak + niveau
  const vakId = (ST.vak && ST.vak.id) || ST.vakId || '';
  const allEx = typeof EXAMENS !== 'undefined' && EXAMENS[vakId];
  const examenLijst = allEx ? allEx.filter(e=>!e.niveau||e.niveau===APP_LEVEL) : [];
  if(!examenLijst || examenLijst.length === 0){
    showToast('Nog geen echt examen beschikbaar voor dit vak');
    return;
  }
  const examen = examenLijst[0]; // gebruik eerste (meest recent) examen
  EX = {
    examen,
    idx: 0,
    answers: {},    // nr -> tekst
    grades: {},     // nr -> {pts, max}
    phase: 'intro', // intro | quiz | result
    timer: null,
    secondsLeft: examen.duur_minuten * 60,
    selfPts: 0,
    gradedCount: 0
  };
  // Update intro UI
  document.getElementById('ex-intro-title').textContent =
    `${examen.titel} HAVO ${examen.jaar} · Tijdvak ${examen.tijdvak}`;
  document.getElementById('ex-intro-sub').textContent =
    `Officieel eindexamen · ${examen.bron}`;
  document.getElementById('ex-stat-vragen').textContent = examen.vragen.length;
  document.getElementById('ex-stat-punten').textContent = examen.max_punten;
  const h = Math.floor(examen.duur_minuten/60);
  const m = examen.duur_minuten % 60;
  document.getElementById('ex-stat-tijd').textContent = m===0 ? `${h} uur` : `${h}u ${m}m`;
  // Reset timer display
  document.getElementById('ex-timer').textContent = _exFmtTime(examen.duur_minuten*60);
  document.getElementById('ex-timer').className = 'ex-timer';
  document.getElementById('ex-score-chip').textContent = `0 / ${examen.max_punten} pt`;
  document.getElementById('ex-prog-fill').style.width = '0%';
  // Toon scherm
  document.getElementById('ex-intro').style.display = '';
  document.getElementById('ex-quiz').style.display = 'none';
  document.getElementById('ex-result').style.display = 'none';
  show('sc-examen');
}

function examenStart(){
  EX.phase = 'quiz';
  document.getElementById('ex-intro').style.display = 'none';
  document.getElementById('ex-quiz').style.display = '';
  // Bouw vraag-grid
  _exBuildGrid();
  // Toon eerste vraag
  examenShowQ(0);
  // Start timer
  EX.timer = setInterval(_exTimerTick, 1000);
}

function _exTimerTick(){
  EX.secondsLeft--;
  document.getElementById('ex-timer').textContent = _exFmtTime(EX.secondsLeft);
  const pct = 1 - EX.secondsLeft / (EX.examen.duur_minuten * 60);
  document.getElementById('ex-prog-fill').style.width = (pct*100)+'%';
  const el = document.getElementById('ex-timer');
  if(EX.secondsLeft <= 60){ el.className='ex-timer danger'; }
  else if(EX.secondsLeft <= 300){ el.className='ex-timer warn'; }
  else { el.className='ex-timer'; }
  if(EX.secondsLeft <= 0){ clearInterval(EX.timer); EX.timer=null; examenFinish(); }
}

function _exFmtTime(s){
  const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=s%60;
  if(h>0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function _exBuildGrid(){
  const g = document.getElementById('ex-qgrid');
  g.innerHTML = EX.examen.vragen.map((q,i) => {
    const cls = q.needs_bijlage ? ' bijlage' : '';
    return `<div class="ex-qd${cls}" id="exqd-${i}" onclick="examenShowQ(${i})">${q.nr}</div>`;
  }).join('');
}

function examenShowQ(idx){
  const q = EX.examen.vragen[idx];
  if(!q) return;
  EX.idx = idx;
  // Opgave banner
  const prevQ = idx > 0 ? EX.examen.vragen[idx-1] : null;
  document.getElementById('ex-opgave-banner').textContent = `Opgave ${q.opgave}`;
  // Context — toon alleen als anders dan vorige vraag in zelfde opgave
  const ctxEl = document.getElementById('ex-context');
  const ctxTxt = q.context || '';
  if(ctxTxt){
    ctxEl.textContent = ctxTxt;
    ctxEl.style.display = '';
  } else {
    ctxEl.style.display = 'none';
  }
  // Bijlage note
  const bijlEl = document.getElementById('ex-bijlage-note');
  if(q.needs_bijlage && q.bijlage_tekst){
    bijlEl.textContent = q.bijlage_tekst;
    bijlEl.style.display = '';
  } else {
    bijlEl.style.display = 'none';
  }
  // Vraag
  document.getElementById('ex-q-nr').textContent = `Vraag ${q.nr}`;
  document.getElementById('ex-vraag').textContent = q.vraag;
  document.getElementById('ex-q-pts').textContent = `${q.punten}p`;
  // Antwoord textarea
  document.getElementById('ex-textarea').value = EX.answers[q.nr] || '';
  // Knop label
  const isLast = idx === EX.examen.vragen.length - 1;
  const nextBtn = document.getElementById('ex-next-btn');
  nextBtn.textContent = isLast ? 'Afronden →' : 'Volgende →';
  nextBtn.onclick = isLast ? examenFinish : ()=>examenNav(1);
  // Grid update
  _exUpdateGrid();
  // Scroll top
  document.getElementById('sc-examen').scrollTo(0,0);
}

function examenSaveAnswer(val){
  const q = EX.examen.vragen[EX.idx];
  if(!q) return;
  EX.answers[q.nr] = val;
  _exUpdateGrid();
  // Score chip: toon beantwoorde vragen
  const beantwoord = Object.keys(EX.answers).filter(k=>EX.answers[k].trim()).length;
  document.getElementById('ex-score-chip').textContent = `${beantwoord} / ${EX.examen.vragen.length} ingevuld`;
}

function examenNav(dir){
  const newIdx = EX.idx + dir;
  if(newIdx < 0 || newIdx >= EX.examen.vragen.length) return;
  examenShowQ(newIdx);
}

function _exUpdateGrid(){
  EX.examen.vragen.forEach((q,i)=>{
    const el = document.getElementById(`exqd-${i}`);
    if(!el) return;
    const hasAns = EX.answers[q.nr] && EX.answers[q.nr].trim();
    const isCur = i===EX.idx;
    const isBijl = q.needs_bijlage;
    el.className = 'ex-qd' + (isCur?' current':hasAns?' answered':isBijl?' bijlage':'');
  });
}

function examenFinish(){
  if(EX.timer){ clearInterval(EX.timer); EX.timer=null; }
  EX.phase = 'result';
  document.getElementById('ex-quiz').style.display = 'none';
  document.getElementById('ex-result').style.display = '';
  // Reset self-grade state
  EX.selfPts = 0;
  EX.gradedCount = 0;
  EX.grades = {};
  _exBuildResultList();
  _exUpdateGrade();
  document.getElementById('sc-examen').scrollTo(0,0);
  // Badge: eerste echt examen afgemaakt
  try{if(earnAch('examen_done'))setTimeout(()=>showAch('📄','Eerste echt examen afgemaakt!'),1200);}catch(e){}
}

function _exBuildResultList(){
  const list = document.getElementById('ex-rev-list');
  list.innerHTML = EX.examen.vragen.map((q,i) => {
    const antw = EX.answers[q.nr] || '';
    const isBijl = q.needs_bijlage;
    const bijlHtml = isBijl ? `<div class="ex-rev-bijlage">${q.bijlage_tekst||'Bijlage benodigd'}</div>` : '';
    return `
    <div class="ex-rev-card" id="exrc-${i}">
      <div class="ex-rev-header">
        <span class="ex-rev-nr">Vraag ${q.nr} · Opgave ${q.opgave}</span>
        <span class="ex-rev-pts-badge" id="exrb-${i}">0 / ${q.punten}p</span>
      </div>
      <div class="ex-rev-vraag">${q.vraag}</div>
      ${bijlHtml}
      <div class="ex-rev-jouw">Jouw antwoord</div>
      <div class="ex-rev-jouw-text">${antw.trim() || '(geen antwoord gegeven)'}</div>
      <div class="ex-rev-model">Modelantwoord</div>
      <div class="ex-rev-model-text">${q.antwoord}</div>
      <div class="ex-rev-rubric">${q.antwoord_rubric}</div>
      <div class="ex-rev-grade">
        <button class="ex-rev-grade-btn rg-fout" onclick="examenGrade(${i},0)">✗<span style="font-size:10px">Fout<br>0p</span></button>
        <button class="ex-rev-grade-btn rg-deels" onclick="examenGrade(${i},${Math.ceil(q.punten/2)})">◑<span style="font-size:10px">Deels<br>${Math.ceil(q.punten/2)}p</span></button>
        <button class="ex-rev-grade-btn rg-goed" onclick="examenGrade(${i},${q.punten})">✓<span style="font-size:10px">Goed<br>${q.punten}p</span></button>
      </div>
    </div>`;
  }).join('');
}

function examenGrade(idx, pts){
  const q = EX.examen.vragen[idx];
  const wasGraded = EX.grades[idx] !== undefined;
  const oldPts = wasGraded ? EX.grades[idx] : 0;
  EX.grades[idx] = pts;
  if(!wasGraded) EX.gradedCount++;
  EX.selfPts = EX.selfPts - oldPts + pts;
  // Update badge
  document.getElementById(`exrb-${idx}`).textContent = `${pts} / ${q.punten}p`;
  // Update card style
  const card = document.getElementById(`exrc-${idx}`);
  card.className = 'ex-rev-card ' + (pts===0?'graded-fout':pts===q.punten?'graded-goed':'graded-deels');
  // Highlight selected button
  const btns = card.querySelectorAll('.ex-rev-grade-btn');
  btns.forEach(b=>b.classList.remove('selected'));
  const ptsArr = [0, Math.ceil(q.punten/2), q.punten];
  const selIdx = ptsArr.indexOf(pts);
  if(selIdx>=0 && btns[selIdx]) btns[selIdx].classList.add('selected');
  _exUpdateGrade();
}

function _exUpdateGrade(){
  const maxPts = EX.examen.max_punten;
  const pct = maxPts > 0 ? EX.selfPts / maxPts : 0;
  // CE cijfer: 9 * pct + 1, afgerond op 0.5
  const cijfer = Math.round((9 * pct + 1) * 2) / 2;
  const cijferStr = cijfer.toFixed(1);
  document.getElementById('ex-grade-num').textContent = cijferStr;
  document.getElementById('ex-score-bar-fill').style.width = (pct*100)+'%';
  document.getElementById('ex-self-total').innerHTML =
    `Gescoord: <strong>${EX.selfPts} / ${maxPts}</strong> punten · ${EX.gradedCount}/${EX.examen.vragen.length} beoordeeld`;
}

function examenConfirmExit(){
  if(EX.phase==='quiz'){
    if(confirm('Weet je zeker dat je het examen wil stoppen? Je antwoorden gaan verloren.')){
      examenExit();
    }
  } else {
    examenExit();
  }
}

function examenExit(){
  if(EX.timer){ clearInterval(EX.timer); EX.timer=null; }
  EX = {};
  show('sc-detail');
}

// ═══════ RACE MODE ═══════
const RACE_BOTS={
  easy:{name:'Bot Bas 🤖',emoji:'🤖',speed:{min:4.5,max:9},accuracy:.52,skipChance:.12},
  medium:{name:'Bot Max 🤖',emoji:'🤖',speed:{min:3,max:6},accuracy:.68,skipChance:.07},
  hard:{name:'Bot Pro 🤖',emoji:'🤖',speed:{min:1.8,max:4.2},accuracy:.84,skipChance:.03}
};

const POWERUPS=[
  {id:'freeze',icon:'🧊',label:'Freeze',desc:'Bot staat 6s stil',apply:function(){
    RC.botFrozen=true;
    raceToast('🧊 Bot bevroren voor 6 seconden!');
    setTimeout(()=>{RC.botFrozen=false;},6000);
  }},
  {id:'double',icon:'⚡',label:'Dubbelstap',desc:'+2 stappen vooruit',apply:function(){
    RC.playerScore=Math.min(15,RC.playerScore+2);
    raceUpdateTrack();
    raceToast('⚡ Dubbelstap! +2 vooruit');
  }},
  {id:'shield',icon:'🛡️',label:'Shield',desc:'Beschermt vs 1 power-up',apply:function(){
    RC.playerShield=true;
    raceToast('🛡️ Shield actief! Jij bent beschermd.');
  }},
  {id:'sendback',icon:'↩️',label:'Terugsturen',desc:'Bot moet een extra vraag beantwoorden',apply:function(){
    RC.botPenaltyQ++;
    raceToast('↩️ Bot moet een extra vraag beantwoorden!');
  }},
  {id:'turbo',icon:'🚀',label:'Turbo',desc:'Volgende vraag telt dubbel',apply:function(){
    RC.turboNext=true;
    raceToast('🚀 Turbo! Volgende vraag telt dubbel.');
  }}
];

let RC={};
let _raceFinishTimeout=null;

function startRace(diff){
  diff=diff||'medium';
  trackEvent('bot_race',{diff:diff,vak:ST.vak?.naam||null});
  window._lastRaceDiff=diff;
  const vak=ST.vak;
  if(!vak)return;

  let allQ=[];
  (vak.domeinen||[]).forEach(d=>{
    (d.sv||[]).forEach(q=>{allQ.push({...q,_domein:d.naam});});
  });
  if(allQ.length<5){raceToast('Te weinig vragen voor een race!');return;}

  const shuffle=arr=>[...arr].sort(()=>Math.random()-.5);
  const botCfg=RACE_BOTS[diff]||RACE_BOTS.medium;

  RC={
    diff,allQ,
    TARGET:15,
    pool:shuffle(allQ),
    playerQIdx:0,
    playerScore:0,
    playerQCount:0,
    shuffleMaps:{},
    botPool:shuffle(allQ),
    botQIdx:0,
    botScore:0,
    botCfg,
    botTimer:null,botFrozen:false,botPenaltyQ:0,
    playerShield:false,turboNext:false,
    startTime:Date.now(),
    finished:false,
    powerupsEarned:0,
    combo:0,
    lastMilestone:0,
  };

  document.getElementById('race-meta').textContent=`${vak.naam} · Bot Race · ${botCfg.name}`;
  document.getElementById('race-label-bot').textContent=botCfg.name;
  show('sc-race');
  raceUpdateTrack();
  raceShowQ();
  raceBotTick();
}

function raceGetCurrentQ(){
  // Cycle through pool when exhausted
  if(RC.playerQIdx>=RC.pool.length){
    RC.pool=[...RC.allQ].sort(()=>Math.random()-.5);
    RC.playerQIdx=0;
    RC.shuffleMaps={};
  }
  return RC.pool[RC.playerQIdx];
}

function raceShowQ(){
  if(RC.finished)return;
  const q=raceGetCurrentQ();
  document.getElementById('race-qctr').textContent=`VRAAG ${RC.playerQCount+1} · STAP ${RC.playerScore}/${RC.TARGET}`;
  document.getElementById('race-qq').textContent=q.v;
  document.getElementById('race-fb').style.display='none';
  document.getElementById('race-powerup-bar').style.display='none';
  document.getElementById('race-nxt').style.display='none';

  if(!RC.shuffleMaps[RC.playerQIdx]){
    const m=[0,1,2,3];
    for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[m[i],m[j]]=[m[j],m[i]];}
    RC.shuffleMaps[RC.playerQIdx]=m;
  }
  const map=RC.shuffleMaps[RC.playerQIdx];
  const correctPos=map.indexOf(q.c);
  RC._currentCorrect=correctPos;

  const area=document.getElementById('race-opts');
  area.innerHTML='';
  const labs=['A','B','C','D'];
  map.forEach((origIdx,pos)=>{
    const btn=document.createElement('button');
    btn.className='race-opt';
    btn.innerHTML=`<span class="opt-lbl">${labs[pos]}</span>${q.o[origIdx]}`;
    btn.dataset.pos=pos;
    btn.onclick=function(){if(!btn.disabled)raceKies(pos,correctPos);};
    area.appendChild(btn);
  });
  raceStartTimer();
}

let _raceTimerInterval=null;
function raceStartTimer(){
  clearInterval(_raceTimerInterval);
  RC._tijd=15;
  const circ=document.getElementById('race-tcirc');
  const num=document.getElementById('race-tnum');
  const total=119;
  if(circ)circ.style.strokeDashoffset='0';
  if(num)num.textContent='15';
  _raceTimerInterval=setInterval(()=>{
    RC._tijd--;
    if(num)num.textContent=Math.max(0,RC._tijd);
    if(circ)circ.style.strokeDashoffset=String(Math.round((1-RC._tijd/15)*total));
    if(RC._tijd<=0){clearInterval(_raceTimerInterval);raceTijdOp();}
  },1000);
}

function raceTijdOp(){
  const btns=document.querySelectorAll('#race-opts .race-opt');
  btns.forEach(b=>b.disabled=true);
  if(btns[RC._currentCorrect])btns[RC._currentCorrect].classList.add('correct');
  raceFeedback(false,raceGetCurrentQ());
}

function raceKies(gekozen,correct){
  clearInterval(_raceTimerInterval);
  const btns=document.querySelectorAll('#race-opts .race-opt');
  btns.forEach(b=>b.disabled=true);
  const ok=gekozen===correct;
  if(ok) btns[gekozen].classList.add('correct');
  else{ btns[gekozen].classList.add('wrong'); if(btns[correct])btns[correct].classList.add('correct'); }
  raceFeedback(ok,raceGetCurrentQ());
}

function raceFeedback(ok,q){
  if(RC.finished)return;
  if(ok){
    RC.playerScore++;
    if(RC.turboNext){RC.playerScore++;RC.turboNext=false;raceToast('🚀 Turbo! +2 stappen!');}
    RC.combo=(RC.combo||0)+1;
    RC.powerupsEarned++;
    raceUpdateTrack();
    if(RC.finished)return;
    playSound&&playSound('correct');
    raceEdgeFlash(true);
    raceFloatNum('+1 🚀');
    raceShowCombo(RC.combo);
    raceMilestoneCheck(RC.playerScore);
    // Animate car
    const cp=document.getElementById('race-car-player');
    if(cp){cp.classList.remove('scored');void cp.offsetWidth;cp.classList.add('scored');}
    if(RC.powerupsEarned%3===0){showPowerupChoice(q);return;}
  } else {
    RC.combo=0;
    raceEdgeFlash(false);
    // Shake wrong button
    document.querySelectorAll('#race-opts .race-opt.wrong').forEach(b=>{
      b.style.animation='raceShake .4s ease';
      setTimeout(()=>b.style.animation='',400);
    });
    playSound&&playSound('wrong');
    const combo=document.getElementById('race-combo');
    if(combo)combo.classList.remove('show');
  }
  const fb=document.getElementById('race-fb');
  fb.style.display='block';
  fb.className='race-fb '+(ok?'fbok':'fbno');
  fb.innerHTML=`<div class="fbt">${ok?'✓ Stap vooruit!':'✗ Fout — geen stap'}</div><div class="fbtx">${q.u||''}</div>`;
  document.getElementById('race-nxt').style.display='block';
}

function raceEdgeFlash(ok){
  const el=document.getElementById('race-edge-flash');
  if(!el)return;
  el.className='race-edge-flash';
  void el.offsetWidth;
  el.className='race-edge-flash '+(ok?'flash-ok':'flash-no');
  setTimeout(()=>{el.className='race-edge-flash';},550);
}

function raceFloatNum(txt){
  const el=document.createElement('div');
  el.className='race-float';
  el.textContent=txt;
  el.style.color='#4ade80';
  el.style.left=(30+Math.random()*40)+'%';
  el.style.top='55%';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1000);
}

function raceShowCombo(n){
  const el=document.getElementById('race-combo');
  if(!el)return;
  if(n<2){el.classList.remove('show');return;}
  const labels=['','','🔥 x2','🔥 x3','🔥 x4 COMBO!','💥 x5 COMBO!!','⚡ x'+n+' UNSTOPPABLE!!!'];
  const colors=['','','#f59e0b','#ef4444','#ef4444','#a855f7','#a855f7'];
  el.textContent=labels[Math.min(n,6)];
  el.style.color=colors[Math.min(n,6)];
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
}

function raceMilestoneCheck(score){
  const milestones={5:'Halverwege! 🎯',10:'Nog 5 stappen! 🔥',14:'Nog 1 stap! 😱'};
  if(milestones[score]&&score>RC.lastMilestone){
    RC.lastMilestone=score;
    raceToast(milestones[score]);
  }
}

function showPowerupChoice(q){
  const bar=document.getElementById('race-powerup-bar');
  const row=document.getElementById('race-pu-row');
  const shuffled=[...POWERUPS].sort(()=>Math.random()-.5).slice(0,3);
  row.innerHTML='';
  shuffled.forEach(pu=>{
    const btn=document.createElement('button');
    btn.className='race-pu-btn';
    btn.style.animation='puPop .3s ease';
    btn.innerHTML=`${pu.icon} ${pu.label}<span class="pu-desc">${pu.desc}</span>`;
    btn.onclick=()=>{
      if(RC.finished)return;
      pu.apply();
      bar.style.display='none';
      const fb=document.getElementById('race-fb');
      fb.style.display='block';
      fb.className='race-fb fbok';
      fb.innerHTML=`<div class="fbt">✓ Stap vooruit! + ${pu.icon} ${pu.label}</div><div class="fbtx">${q.u||''}</div>`;
      document.getElementById('race-nxt').style.display='block';
    };
    row.appendChild(btn);
  });
  bar.style.display='block';
  // Also show feedback + next behind the powerup panel
  const fb=document.getElementById('race-fb');
  fb.style.display='block';
  fb.className='race-fb fbok';
  fb.innerHTML=`<div class="fbt">✓ Stap vooruit!</div><div class="fbtx">${q.u||''}</div>`;
  document.getElementById('race-nxt').style.display='block';
}

function raceNextQ(){
  if(RC.finished)return;
  RC.playerQIdx++;
  RC.playerQCount++;
  raceShowQ();
}

function raceUpdateTrack(){
  const T=RC.TARGET||15;
  const track=document.querySelector('.race-track');
  const trackW=track?track.clientWidth:280;
  const usable=trackW-32-36;
  const pPct=Math.min(1,RC.playerScore/T);
  const bPct=Math.min(1,RC.botScore/T);

  const cp=document.getElementById('race-car-player');
  const cb=document.getElementById('race-car-bot');
  const fp=document.getElementById('rf-player');
  const fb=document.getElementById('rf-bot');
  if(cp)cp.style.left=(6+pPct*usable)+'px';
  if(cb)cb.style.left=(6+bPct*usable)+'px';
  if(fp)fp.style.width=(pPct*100)+'%';
  if(fb)fb.style.width=(bPct*100)+'%';

  const sp=document.getElementById('race-score-player');
  const sb=document.getElementById('race-score-bot');
  if(sp){sp.textContent=`${RC.playerScore}/${T}`;sp.className='race-track-score'+(RC.playerScore>RC.botScore?' leading':'');}
  if(sb)sb.textContent=`${RC.botScore}/${T}`;

  // Bot danger warning
  const gap=RC.playerScore-RC.botScore;
  if(gap===-1&&RC.playerScore>0)raceToast('⚠️ Bot is dichtbij!');
  else if(gap<=-3&&RC.botScore>0)raceToast('🚨 Bot loopt voor!');

  if(!RC.finished){
    if(RC.playerScore>=T) raceFinish('player');
    else if(RC.botScore>=T) raceFinish('bot');
  }
}

function raceBotTick(){
  const T=RC.TARGET||15;
  function botAnswerNext(){
    if(RC.finished||RC.botScore>=T)return;
    if(RC.botFrozen){RC.botTimer=setTimeout(botAnswerNext,500);return;}
    if(RC.botPenaltyQ>0){
      RC.botPenaltyQ--;
      raceToast('↩️ Bot beantwoordt extra vraag…');
      RC.botTimer=setTimeout(botAnswerNext,3000+Math.random()*2000);
      return;
    }
    const cfg=RC.botCfg;
    const delay=(cfg.speed.min+Math.random()*(cfg.speed.max-cfg.speed.min))*1000;
    RC.botTimer=setTimeout(()=>{
      if(RC.finished)return;
      // Cycle bot pool if exhausted
      if(RC.botQIdx>=RC.botPool.length){
        RC.botPool=[...RC.allQ].sort(()=>Math.random()-.5);
        RC.botQIdx=0;
      }
      RC.botQIdx++;
      if(Math.random()<cfg.accuracy){
        RC.botScore++;
        raceUpdateTrack();
        const cb=document.getElementById('race-car-bot');
        if(cb){cb.style.animation='racePulse .3s ease';setTimeout(()=>{cb.style.animation=''},350);}
      }
      botAnswerNext();
    },delay);
  }
  botAnswerNext();
}

function raceFinish(who){
  if(RC.finished)return;
  RC.finished=true;
  clearInterval(_raceTimerInterval);
  clearTimeout(RC.botTimer);

  // Disable all opts + hide nav
  document.querySelectorAll('#race-opts .race-opt').forEach(b=>b.disabled=true);
  document.getElementById('race-nxt').style.display='none';
  document.getElementById('race-powerup-bar').style.display='none';

  const elapsed=Math.round((Date.now()-RC.startTime)/1000);
  const tot=RC.TARGET||15;
  const playerWin=RC.playerScore>=tot||(RC.playerScore>RC.botScore)||(RC.playerScore===RC.botScore&&who==='player');
  checkRaceAch(playerWin);

  // Show finish overlay with confetti
  const ov=document.getElementById('race-finish-overlay');
  const title=document.getElementById('rfo-title');
  const sub=document.getElementById('rfo-sub');
  if(ov&&title&&sub){
    title.textContent=playerWin?'JIJ WINT! 🎉':'BOT WINT 😤';
    title.style.color=playerWin?'#4ade80':'#f87171';
    sub.textContent=playerWin
      ?`${RC.playerScore}/${tot} stappen in ${elapsed}s 🏆`
      :`Bot: ${RC.botScore}/${tot} · Jij: ${RC.playerScore}/${tot}`;
    // Confetti dots
    if(playerWin){
      let conf=document.querySelector('.rfo-confetti');
      if(!conf){conf=document.createElement('div');conf.className='rfo-confetti';ov.appendChild(conf);}
      conf.innerHTML='';
      const colors=['#f59e0b','#ef4444','#22c55e','#3b82f6','#a855f7','#ec4899','#fcd34d'];
      for(let i=0;i<40;i++){
        const d=document.createElement('div');
        d.className='rfo-dot';
        d.style.cssText=`left:${Math.random()*100}%;top:-10px;background:${colors[i%colors.length]};--d:${.8+Math.random()*.8}s;--delay:${Math.random()*.6}s;transform:rotate(${Math.random()*360}deg)`;
        conf.appendChild(d);
      }
    }
    ov.classList.add('visible');
  }

  _raceFinishTimeout=setTimeout(()=>{
    if(ov)ov.classList.remove('visible');
    // Build result screen
    document.getElementById('race-res-emi').textContent=playerWin?'🏆':'😅';
    document.getElementById('race-res-tit').textContent=playerWin?'Jij wint! 🎉':'Bot wint… 😤';
    document.getElementById('race-res-sub').textContent=playerWin
      ?`${RC.playerScore}/${tot} goed — ${elapsed}s. Geweldig!`
      :`${RC.botScore}/${tot} voor de bot, jij had ${RC.playerScore}/${tot}. Probeer opnieuw!`;

    const vs=document.getElementById('race-res-vs');
    vs.innerHTML=`
      <div class="race-res-col${playerWin?' winner':''}">
        <div class="res-emo">🚀</div>
        <div class="res-name">Jij</div>
        <div class="res-sc">${RC.playerScore}/${tot}</div>
        <div class="res-time">${elapsed}s</div>
      </div>
      <div class="race-res-col${!playerWin?' winner':''}">
        <div class="res-emo">${RC.botCfg.emoji}</div>
        <div class="res-name">${RC.botCfg.name}</div>
        <div class="res-sc">${RC.botScore}/${tot}</div>
        <div class="res-time">${RC.diff}</div>
      </div>`;

    // Breakdown
    const pct=Math.round((RC.playerScore/tot)*100);
    const kleur=pct>=70?'#4ade80':pct>=50?'#fcd34d':'#f87171';
    document.getElementById('race-res-bd').innerHTML=`
      <div class="rb-row"><span>Jouw score</span><strong style="color:${kleur}">${RC.playerScore}/${tot} (${pct}%)</strong></div>
      <div class="rb-row"><span>Moeilijkheid</span><strong>${RC.diff==='easy'?'😌 Makkelijk':RC.diff==='medium'?'😤 Gemiddeld':'💀 Moeilijk'}</strong></div>
      <div class="rb-row"><span>Tijd</span><strong>${elapsed}s</strong></div>`;

    show('sc-race-res');
  },2500);
}

function stopRace(){
  RC.finished=true;
  clearInterval(_raceTimerInterval);
  clearTimeout(RC&&RC.botTimer);
  clearTimeout(_raceFinishTimeout);
  const ov=document.getElementById('race-finish-overlay');
  if(ov)ov.classList.remove('visible');
  show('sc-qmode');
}

function raceToast(msg){
  const t=document.getElementById('race-toast');
  if(!t)return;
  t.textContent=msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}

// ═══════ BOT LEADERBOARD SEED ═══════
// Vaste dier-avatars per bot (animalId + stageIdx uit ANIMAL_EVOLUTIONS)
// Eenmalige cleanup: verwijder alle bot-entries uit localStorage
(function _purgeBots(){
  const done='slagio_bots_purged_v1';
  if(localStorage.getItem(done))return;
  ['havo','vwo'].forEach(n=>{
    const key='examenapp_leaderboard_'+n;
    try{
      const entries=JSON.parse(localStorage.getItem(key)||'[]').filter(e=>!e.isBot);
      localStorage.setItem(key,JSON.stringify(entries));
    }catch(e){}
  });
  // Wis alle oude seed-vlaggen
  ['v3','v7','v8','v9','v11','v12'].forEach(v=>localStorage.removeItem('slagio_bots_seeded_'+v));
  localStorage.setItem(done,'1');
})();

// ═══════ OFFLINE INDICATOR ═══════
(function initOfflineBanner(){
  const banner=document.createElement('div');
  banner.id='offline-banner';
  banner.innerHTML='📵 Geen internet — voortgang wordt lokaal opgeslagen';
  document.body.appendChild(banner);
  function update(){banner.classList.toggle('show',!navigator.onLine);}
  window.addEventListener('offline',update);
  window.addEventListener('online',update);
  update();
})();

// ═══════ LEADERBOARD ═══════
function getLbKey(){return 'examenapp_leaderboard_'+APP_LEVEL;}
function getLbEntries(){try{return JSON.parse(localStorage.getItem(getLbKey())||'[]');}catch(e){return[];}}
async function saveLeaderboardEntry(entry){
  entry.niveau=APP_LEVEL;
  if(currentUser)entry.uid=currentUser.id;
  // Save to local cache
  let all=getLbEntries();
  all.push(entry);
  all.sort((a,b)=>b.score-a.score);
  if(all.length>200)all=all.slice(0,200);
  localStorage.setItem(getLbKey(),JSON.stringify(all));
  // Save to Supabase global leaderboard (cross-user)
  if(currentUser){
    const base={
      user_id:currentUser.id,
      naam:entry.naam,avatar:entry.avatar,
      animal_id:entry.animalId||null,stage_idx:entry.stageIdx??null,
      featured_badge_id:entry.featuredBadgeId||null,
      vak:entry.vak,vak_naam:entry.vakNaam,
      domein_id:entry.domeinId||null,domein_naam:entry.domeinNaam||null,
      score:entry.score,correct:entry.goed,total:entry.tot,
      avg_tijd:entry.avgTijd||null,
      niveau:APP_LEVEL
    };
    // Try with badge_ids (requires badge_ids text[] column); fall back without if column missing
    try{
      await SB.from('leaderboard').insert({...base,badge_ids:entry.badgeIds||[]});
    }catch(e){
      if(String(e?.message||e).includes('badge_ids')){
        try{await SB.from('leaderboard').insert(base);}catch(e2){console.warn('leaderboard save error:',e2);}
      }else{console.warn('leaderboard save error:',e);}
    }
  }
}
async function loadLeaderboardFromSupabase(){
  try{
    const {data,error}=await SB.from('leaderboard').select('*').eq('niveau',APP_LEVEL).order('score',{ascending:false}).limit(200);
    if(error||!data)return;
    const remote=data.map(d=>({
      naam:d.naam,avatar:d.avatar,
      animalId:d.animal_id||null,stageIdx:d.stage_idx??null,
      featuredBadgeId:d.featured_badge_id||null,
      badgeIds:d.badge_ids||[],
      vak:d.vak,vakNaam:d.vak_naam,
      domeinId:d.domein_id||null,domeinNaam:d.domein_naam||null,
      score:d.score,goed:d.correct,tot:d.total,uid:d.user_id,
      avgTijd:d.avg_tijd||null,niveau:d.niveau,date:d.created_at?.slice(0,10)
    }));
    const merged=remote.filter(e=>e.score<=1000&&(e.tot||0)>5).sort((a,b)=>b.score-a.score).slice(0,200);
    localStorage.setItem(getLbKey(),JSON.stringify(merged));
  }catch(e){console.warn('leaderboard load error:',e);}
}
// ═══════ LB PROFILE ═══════
function getTierLabel(score){
  if(score>=850)return'🏆 Elite';
  if(score>=650)return'⚡ Expert';
  if(score>=400)return'📚 Gevorderd';
  if(score>=150)return'✏️ Leerling';
  return'🌱 Beginner';
}
function getTierClass(score){
  if(score>=850)return'lb-tier-elite';
  if(score>=650)return'lb-tier-expert';
  if(score>=400)return'lb-tier-gevorderd';
  if(score>=150)return'lb-tier-leerling';
  return'lb-tier-beginner';
}
function openLbProfile(naam){
  const allEntries=getLbEntries().filter(e=>e.naam===naam);
  if(!allEntries.length)return;
  const avatarHtml=getLbAvatarHtml(allEntries[0],50);
  const niveau=allEntries[0]?.niveau?.toUpperCase()||'';
  // Aggregate stats
  const bestScore=Math.max(...allEntries.map(e=>e.score));
  const totalGoed=allEntries.reduce((s,e)=>s+(e.goed||0),0);
  const totalTot=allEntries.reduce((s,e)=>s+(e.tot||0),0);
  const accuracy=totalTot>0?Math.round(totalGoed/totalTot*100):0;
  const avgSpeed=allEntries.length?+(allEntries.reduce((s,e)=>s+(e.avgTijd||0),0)/allEntries.length).toFixed(1):0;
  const totalQuizzes=allEntries.length;
  const favVakMap={};
  allEntries.forEach(e=>{favVakMap[e.vakNaam]=(favVakMap[e.vakNaam]||0)+1;});
  const favVak=Object.entries(favVakMap).sort((a,b)=>b[1]-a[1])[0]?.[0]||'–';
  const dates=allEntries.map(e=>e.date).filter(Boolean).sort();
  const actief=dates[0]||'–';
  const recent=[...allEntries].sort((a,b)=>b.score-a.score).slice(0,3);
  const tierLabel=getTierLabel(bestScore);
  const tierCls=getTierClass(bestScore);
  const recentHtml=recent.map(e=>`
    <div class="lbp-recent-row">
      <span class="lbp-recent-vak">${e.vakNaam}${e.domeinId?` · D${e.domeinId}`:''}</span>
      <span style="display:flex;align-items:center;gap:8px;flex-shrink:0">
        <span style="font-size:11px;color:var(--mu)">${e.goed||0}/${e.tot||0} goed</span>
        <span class="lbp-recent-score">${e.score} pts</span>
      </span>
    </div>
  `).join('');
  // ── Badge sectie ──────────────────────────────────
  const prof2=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  const myNaamLbp=prof2.naam||'';
  const isMe=(myNaamLbp&&naam===myNaamLbp)||(typeof currentUser!=='undefined'&&currentUser&&(currentUser.user_metadata?.naam===naam||currentUser.email?.split('@')[0]===naam));
  let badgeSectionHtml='';
  if(isMe){
    const achieved=getAchieved();
    const earned=ALL_BADGES.filter(b=>achieved[b.id]);
    if(earned.length){
      const items=earned.map(b=>`<div class="lbp-badge-item rarity-${b.rarity}" title="${b.label} — ${b.tip}"><span class="lbp-badge-emoji">${b.emoji}</span><span class="lbp-badge-lbl">${b.label}</span></div>`).join('');
      badgeSectionHtml=`<p class="lbp-section-title">Jouw badges (${earned.length}/${ALL_BADGES.length})</p><div class="lbp-badges-grid">${items}</div>`;
    }
  } else {
    // Show all earned badges — from stored badgeIds (real players & bots), else fall back to featured only
    const allBadgeIds=[...new Set(allEntries.flatMap(e=>e.badgeIds||[]))];
    if(allBadgeIds.length){
      const earnedBadges=allBadgeIds.map(id=>ALL_BADGES.find(b=>b.id===id)).filter(Boolean);
      if(earnedBadges.length){
        const items=earnedBadges.map(b=>`<div class="lbp-badge-item rarity-${b.rarity}" title="${b.label} — ${b.tip}"><span class="lbp-badge-emoji">${b.emoji}</span><span class="lbp-badge-lbl">${b.label}</span></div>`).join('');
        badgeSectionHtml=`<p class="lbp-section-title">Badges (${earnedBadges.length})</p><div class="lbp-badges-grid">${items}</div>`;
      }
    } else {
      const featId=allEntries[0]?.featuredBadgeId;
      const featB=featId?ALL_BADGES.find(b=>b.id===featId):null;
      if(featB){
        badgeSectionHtml=`<p class="lbp-section-title">Uitgelichte badge</p>
          <div class="lbp-featured-badge rarity-${featB.rarity}">
            <span style="font-size:30px;line-height:1">${featB.emoji}</span>
            <div><div style="font-size:13px;font-weight:700;color:var(--dk)">${featB.label}</div><div style="font-size:11px;color:var(--mu);margin-top:2px">${featB.tip} · <em>${RARITY_LABEL[featB.rarity]||''}</em></div></div>
          </div>`;
      }
    }
  }
  const el=document.getElementById('lbp-overlay');
  el.innerHTML=`<div class="lbp-card" onclick="event.stopPropagation()">
    <div class="lbp-drag"></div>
    <button class="lbp-close" onclick="closeLbProfile()">✕</button>
    <div class="lbp-header">
      <div class="lbp-av-wrap"><div class="lbp-av">${avatarHtml}</div>${getLbBadgeOverlay(allEntries[0]?.featuredBadgeId)}</div>
      <div class="lbp-headinfo">
        <div class="lbp-naam">${naam}</div>
        <div class="lbp-chips">
          ${niveau?`<span class="lb-niveau-chip">${niveau}</span>`:''}
          <span class="lb-tier ${tierCls}">${tierLabel}</span>
        </div>
      </div>
    </div>
    <div class="lbp-stats">
      <div class="lbp-stat">
        <div class="lbp-stat-val">${bestScore}</div>
        <div class="lbp-stat-lbl">⚡ Beste score</div>
        <div class="lbp-bar-wrap" style="margin-top:7px"><div class="lbp-bar-fill" style="width:${bestScore/10}%"></div></div>
      </div>
      <div class="lbp-stat">
        <div class="lbp-stat-val">${accuracy}%</div>
        <div class="lbp-stat-lbl">🎯 Nauwkeurigheid</div>
        <div class="lbp-bar-wrap" style="margin-top:7px"><div class="lbp-bar-fill" style="width:${accuracy}%"></div></div>
      </div>
      <div class="lbp-stat">
        <div class="lbp-stat-val">${avgSpeed}s</div>
        <div class="lbp-stat-lbl">⏱ Gem. reactietijd</div>
      </div>
      <div class="lbp-stat">
        <div class="lbp-stat-val">${totalQuizzes}</div>
        <div class="lbp-stat-lbl">📋 Quizzes</div>
      </div>
    </div>
    <p class="lbp-section-title">Statistieken</p>
    <div class="lbp-detail-row"><span class="lbp-detail-key">❤️ Favoriete vak</span><span class="lbp-detail-val">${favVak}</span></div>
    <div class="lbp-detail-row"><span class="lbp-detail-key">📅 Actief sinds</span><span class="lbp-detail-val">${actief}</span></div>
    <div class="lbp-detail-row"><span class="lbp-detail-key">✅ Totaal goed</span><span class="lbp-detail-val">${totalGoed} / ${totalTot} vragen</span></div>
    ${recentHtml?`<p class="lbp-section-title" style="margin-top:16px">Beste quizzes</p><div style="display:flex;flex-direction:column;gap:6px">${recentHtml}</div>`:''}
    ${badgeSectionHtml}
  </div>`;
  el.classList.add('open');
  setTimeout(()=>{el.querySelector('.lbp-bar-fill')&&el.querySelectorAll('.lbp-bar-fill').forEach(b=>{const w=b.style.width;b.style.width='0';setTimeout(()=>b.style.width=w,50);});},50);
}
function closeLbProfile(){
  document.getElementById('lbp-overlay').classList.remove('open');
}

/* ── PDF VIEWER ──────────────────────────────────────── */
let _pdfCurrentUrl='';
function openPdfViewer(url,title){
  trackEvent('oud_examen_pdf',{title:title||null,pdf:url?.split('/').pop()||null});
  _pdfCurrentUrl=url;
  const modal=document.getElementById('pdf-viewer-modal');
  const iframe=document.getElementById('pdf-viewer-iframe');
  const loading=document.getElementById('pdf-modal-loading');
  const error=document.getElementById('pdf-modal-error');
  const newtab=document.getElementById('pdf-modal-newtab');
  const errOpen=document.getElementById('pdf-error-open');
  document.getElementById('pdf-modal-title').textContent=title||'PDF';
  newtab.href=url;
  errOpen.href=url;
  // Reset state
  loading.classList.remove('hidden');
  error.classList.remove('show');
  iframe.src='about:blank';
  modal.classList.add('open');
  document.body.style.overflow='hidden';
  // Small delay so modal renders first, then load PDF
  setTimeout(()=>{
    iframe.onload=function(){
      // If the src is still about:blank (reset), ignore
      if(iframe.src==='about:blank')return;
      loading.classList.add('hidden');
    };
    iframe.onerror=function(){
      loading.classList.add('hidden');
      error.classList.add('show');
    };
    iframe.src=url;
    // Timeout fallback — if PDF doesn't load in 12s, show error
    setTimeout(()=>{
      if(!loading.classList.contains('hidden')){
        loading.classList.add('hidden');
        error.classList.add('show');
      }
    },12000);
  },80);
}
function closePdfViewer(){
  const modal=document.getElementById('pdf-viewer-modal');
  const iframe=document.getElementById('pdf-viewer-iframe');
  modal.classList.remove('open');
  document.body.style.overflow='';
  // Unload iframe to stop download / prevent memory leak
  setTimeout(()=>{iframe.src='about:blank';},200);
}
// Close PDF viewer on Escape key
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&document.getElementById('pdf-viewer-modal').classList.contains('open')){
    closePdfViewer();
  }
});

let lbVakFilter='all';
function renderLeaderboard(){
  loadLeaderboardFromSupabase().then(()=>_renderLbWithData());
}
function _renderLbWithData(){
  // Clean up any stored entries with score > 1000
  try{const key=getLbKey();const stored=getLbEntries();const cleaned=stored.filter(e=>e.score<=1000);if(cleaned.length!==stored.length)localStorage.setItem(key,JSON.stringify(cleaned));}catch(e){}
  const all=getLbEntries();
  const prof=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  const myUid=currentUser?currentUser.id:null;
  const myNaam=prof.naam||null;

  // Build filter buttons (alleen vakken van huidig niveau)
  const vakSet=new Set(all.map(e=>e.vak));
  const filterEl=document.getElementById('lb-filter');
  filterEl.innerHTML='';
  const allBtn=document.createElement('button');
  allBtn.className='lb-filter-btn'+(lbVakFilter==='all'?' active':'');
  allBtn.textContent='Alle vakken';
  allBtn.onclick=()=>{lbVakFilter='all';renderLeaderboard();};
  filterEl.appendChild(allBtn);
  const VAKKEN_MAP={};getVK().forEach(v=>{VAKKEN_MAP[v.id]=v;});
  [...vakSet].forEach(vid=>{
    const vak=VAKKEN_MAP[vid];if(!vak)return;
    const btn=document.createElement('button');
    btn.className='lb-filter-btn'+(lbVakFilter===vid?' active':'');
    btn.textContent=vak.code;
    btn.onclick=()=>{lbVakFilter=vid;renderLeaderboard();};
    filterEl.appendChild(btn);
  });

  // Niveau badge + dynamic subtitle
  const badge=document.getElementById('lb-niveau-badge');
  const VAKKEN_LABEL=lbVakFilter==='all'?'Alle vakken':(VAKKEN_MAP[lbVakFilter]?VAKKEN_MAP[lbVakFilter].naam:lbVakFilter);
  if(badge)badge.textContent=APP_LEVEL.toUpperCase()+' 2026 · '+VAKKEN_LABEL;
  const subtitleEl=document.getElementById('lb-subtitle');
  const playerCount=[...new Set(all.map(e=>e.uid||e.naam))].length;
  if(subtitleEl){
    if(playerCount===0)subtitleEl.textContent='Nog geen spelers — wees de eerste!';
    else if(lbVakFilter==='all')subtitleEl.textContent=`Snelle quiz · beste score per speler · ${playerCount} deelnemer${playerCount===1?'':'s'}`;
    else subtitleEl.textContent=`Snelle quiz · beste ${VAKKEN_LABEL}-score per speler`;
  }

  // Filter entries (remove invalid scores above 1000)
  const valid=all.filter(e=>e.score<=1000);
  const filtered=lbVakFilter==='all'?valid:valid.filter(e=>e.vak===lbVakFilter);

  // Stap 1: beste score per naam+vak+domein (verwijder duplicaten per quiz)
  const entryMap={};
  filtered.forEach(e=>{
    const k=`${e.naam}|${e.vak}|${e.domeinId}`;
    if(!entryMap[k]||e.score>entryMap[k].score)entryMap[k]=e;
  });
  // Stap 2: deduplicate per gebruiker — toon elke speler maar één keer (beste score ooit)
  const userMap={};
  Object.values(entryMap).forEach(e=>{
    const uk=e.uid||e.naam;
    if(!userMap[uk]||e.score>userMap[uk].score)userMap[uk]=e;
  });
  const deduped=Object.values(userMap).sort((a,b)=>b.score-a.score);
  const top=deduped.slice(0,25);

  // My best score in current filter (match on uid if available, else name)
  const myEntries=filtered.filter(e=>myUid?(e.uid===myUid):(myNaam&&e.naam===myNaam));
  const myBest=myEntries.sort((a,b)=>b.score-a.score)[0]||null;
  const myRank=myBest?deduped.findIndex(e=>(myUid?e.uid===myUid:e.naam===myBest.naam))+1:null;
  const myBox=document.getElementById('lb-myscore-box');
  const myLiveAvatar32=getMyCurrentAvatarHtml(32);
  const myLiveAvatar28=getMyCurrentAvatarHtml(28);
  const myBestBadgeId=getBestBadgeId(getAchieved());
  if(myBest&&prof.naam){
    myBox.innerHTML=`<div class="lb-my-score">
      <div class="lb-my-av" style="position:relative">${myLiveAvatar32}${getLbBadgeOverlay(myBestBadgeId,'var(--or)')}</div>
      <div class="lb-my-info">
        <div class="lb-my-title">Jouw beste score</div>
        <div class="lb-my-name">${prof.naam}</div>
        <div class="lb-my-det">${myBest.vakNaam}${myBest.domeinId?` · D${myBest.domeinId}: ${myBest.domeinNaam}`:''}${myBest.avgTijd?` · gem. ${myBest.avgTijd}s`:''} · ${myBest.goed}/${myBest.tot} goed</div>
      </div>
      <div class="lb-my-score-box"><div class="lb-my-score-n">${myBest.score}</div><div class="lb-my-score-l">rank #${myRank||'?'}</div></div>
    </div>`;
  } else {
    myBox.innerHTML='';
  }

  // Helper: safe percentage
  const safePct=(goed,tot)=>tot>0?Math.round(goed/tot*100):0;
  const lbMeta=(e)=>`${e.vakNaam}${e.domeinId?` · D${e.domeinId}`:''}${e.avgTijd?` · gem. ${e.avgTijd}s`:''} · ${safePct(e.goed,e.tot)}% goed`;
  const lbMeSpan=(isMe)=>isMe?' <span style="font-size:10px;color:var(--or)">(jij)</span>':'';
  // Helper: tier badge from score
  function tierBadge(score){
    if(score>=850)return`<span class="lb-tier lb-tier-elite">🏆 Elite</span>`;
    if(score>=650)return`<span class="lb-tier lb-tier-expert">⚡ Expert</span>`;
    if(score>=400)return`<span class="lb-tier lb-tier-gevorderd">📚 Gevorderd</span>`;
    if(score>=150)return`<span class="lb-tier lb-tier-leerling">✏️ Leerling</span>`;
    return`<span class="lb-tier lb-tier-beginner">🌱 Beginner</span>`;
  }
  // Helper: niveau chip
  const niveauChip=(e)=>e.niveau?`<span class="lb-niveau-chip">${e.niveau.toUpperCase()}</span>`:'';
  // Helper: rank colour class
  const rankCls=(r)=>r===1?'top1':r===2?'top2':r===3?'top3':'';
  // Helper: premium stage chip (only for stages 5=Goud, 6=Diamant, 7=Platina)
  const stageBadge=(e)=>{
    const idx=e.stageIdx!=null?e.stageIdx:0;
    if(idx<5)return'';
    const stageN=ANIM_STAGE_NAMES[idx]||'';
    const clsMap={5:'lb-sc-goud',6:'lb-sc-diamant',7:'lb-sc-platina'};
    const em={5:'✨',6:'💎',7:'🔮'}[idx]||'⭐';
    return`<span class="lb-stage-chip ${clsMap[idx]||'lb-sc-goud'}">${em} ${stageN}</span>`;
  };

  // Podium (top 3)
  const podEl=document.getElementById('lb-podium');
  if(top.length>=3){
    const medals=['🥇','🥈','🥉'];
    const classes=['gold','silver','bronze'];
    const order=[1,0,2];
    const heights=[60,80,50];
    let podHtml='';
    order.forEach((ri,pi)=>{
      const e=top[ri];if(!e)return;
      const isMe=myNaam&&e.naam===myNaam;
      podHtml+=`<div class="lb-pod lb-clickable" data-lbname="${e.naam.replace(/"/g,'&quot;')}" style="cursor:pointer">
        <div class="lb-pod-medal">${medals[ri]}</div>
        <div style="position:relative;display:inline-block">
          <div class="lb-pod-avatar ${classes[ri]}" style="${isMe?'border-color:var(--or)':''}">${isMe?myLiveAvatar32:getLbAvatarHtml(e,32)}</div>
          <div style="position:absolute;bottom:-3px;right:-3px;width:18px;height:18px;border-radius:50%;background:${['#F59E0B','#9CA3AF','#CD7C3F'][ri]};color:#fff;font-size:9px;font-weight:900;display:flex;align-items:center;justify-content:center;border:2px solid var(--bg)">${ri+1}</div>
          ${getLbBadgeOverlay(isMe?myBestBadgeId:e.featuredBadgeId)}
        </div>
        <div class="lb-pod-bar ${classes[ri]}" style="height:${heights[pi]}px">${e.score}</div>
        <div class="lb-pod-name">${e.naam}</div>
        <div class="lb-pod-score">${e.goed}/${e.tot} · ${safePct(e.goed,e.tot)}%</div>
        <div style="margin-top:5px;display:flex;gap:4px;justify-content:center;flex-wrap:wrap">${niveauChip(e)}${tierBadge(e.score)}${stageBadge(e)}</div>
      </div>`;
    });
    podEl.innerHTML=podHtml;
  } else {
    podEl.innerHTML='';
  }

  // List
  const listEl=document.getElementById('lb-list');
  if(top.length===0){
    listEl.innerHTML=`<div class="lb-empty">
      <div class="lb-empty-orb">🏆</div>
      <div class="lb-empty-title">Wees de eerste!</div>
      <div class="lb-empty-sub">Het bord is leeg — jij kunt de #1 positie pakken. Maak een snelle quiz en zet je score neer.</div>
      <div class="lb-empty-tiers">
        <div class="lb-empty-tier"><div class="lb-empty-tier-icon">🌱</div><div class="lb-empty-tier-name">Beginner</div><div class="lb-empty-tier-pts">&lt;150</div></div>
        <div class="lb-empty-tier"><div class="lb-empty-tier-icon">✏️</div><div class="lb-empty-tier-name">Leerling</div><div class="lb-empty-tier-pts">150+</div></div>
        <div class="lb-empty-tier"><div class="lb-empty-tier-icon">📚</div><div class="lb-empty-tier-name">Gevorderd</div><div class="lb-empty-tier-pts">400+</div></div>
        <div class="lb-empty-tier"><div class="lb-empty-tier-icon">⚡</div><div class="lb-empty-tier-name">Expert</div><div class="lb-empty-tier-pts">650+</div></div>
        <div class="lb-empty-tier"><div class="lb-empty-tier-icon">🏆</div><div class="lb-empty-tier-name">Elite</div><div class="lb-empty-tier-pts">850+</div></div>
      </div>
      <button class="lb-empty-cta" onclick="show('sc-home')">🎯 Start een quiz</button>
    </div>`;
    return;
  }
  const showPodium=top.length>=3;
  let listHtml='';
  top.forEach((e,i)=>{
    const rank=i+1;
    const isMe=myNaam&&e.naam===myNaam;
    if(showPodium&&rank<=3)return;
    listHtml+=`<div class="lb-row${isMe?' me':''} lb-clickable" data-lbname="${e.naam.replace(/"/g,'&quot;')}">
      <div class="lb-rank-col ${rankCls(rank)}">${rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':'#'+rank}</div>
      <div class="lb-av-wrap">
        <div class="lb-av">${isMe?myLiveAvatar28:getLbAvatarHtml(e,28)}</div>
        ${getLbBadgeOverlay(isMe?myBestBadgeId:e.featuredBadgeId)}
      </div>
      <div class="lb-info">
        <div class="lb-name">${e.naam}${lbMeSpan(isMe)}${niveauChip(e)}${tierBadge(e.score)}${stageBadge(e)}</div>
        <div class="lb-meta">${lbMeta(e)}</div>
      </div>
      <div class="lb-score"><div class="lb-score-num">${e.score}</div><div class="lb-score-sub">pts</div><div style="font-size:9px;color:var(--mu);margin-top:2px">Bekijk →</div></div>
    </div>`;
  });
  listEl.innerHTML=listHtml||'';

  // Attach click handlers via delegation (avoids inline-onclick quote issues)
  document.querySelectorAll('.lb-clickable').forEach(el=>{
    el.addEventListener('click',()=>openLbProfile(el.dataset.lbname));
  });
}

// ═══════ COUNTDOWN ═══════
// Returns the earliest upcoming exam relevant to the user (own vakken first, else level fallback)
function getCountdownTarget(){
  try{
    const mijn=getMijnVakken();
    const now=new Date();
    const niveauVakIds=new Set(getVK().map(v=>v.id));
    const upcoming=EXAM_SCHEDULE
      .filter(ex=>!ex.niveau||ex.niveau===APP_LEVEL)
      .filter(ex=>ex.vakId&&niveauVakIds.has(ex.vakId))
      .map(ex=>({...ex,dt:new Date(ex.datum+'T'+ex.tijd.split('–')[0]+':00+02:00')}))
      .filter(ex=>ex.dt>now)
      .sort((a,b)=>a.dt-b.dt);
    if(!upcoming.length)return null;
    if(mijn.length){
      const mine=upcoming.filter(ex=>mijn.includes(ex.vakId));
      if(mine.length)return mine[0];
    }
    return upcoming[0];
  }catch(e){return null;}
}
function updateCountdown(){
  const setEl=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};
  // Apply level glow class
  const cdEl=document.getElementById('countdown');
  if(cdEl){cdEl.classList.remove('cd-havo','cd-vwo');cdEl.classList.add(APP_LEVEL==='vwo'?'cd-vwo':'cd-havo');}
  // Dynamic target
  const tgt=getCountdownTarget();
  const labelEl=document.getElementById('cd-label');
  const subEl=document.getElementById('cd-sub');
  if(!tgt){
    setEl('cd-title','Alle examens zijn klaar 🎓');
    if(labelEl)labelEl.textContent='Gefeliciteerd!';
    if(subEl)subEl.textContent='Je hebt alle examens gehad';
    ['cd-d','cd-h','cd-m','cd-s','cd-days-text'].forEach(id=>setEl(id,'0'));
    return;
  }
  // Update vak name + formatted date
  if(labelEl)labelEl.textContent=tgt.vak;
  if(subEl){
    const dn=['zo','ma','di','wo','do','vr','za'];
    const mn=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
    subEl.textContent=dn[tgt.dt.getDay()]+' '+tgt.dt.getDate()+' '+mn[tgt.dt.getMonth()]+' · '+tgt.tijd;
  }
  const now=new Date();
  const diff=tgt.dt-now;
  if(diff<=0){
    setEl('cd-title','Het examen is begonnen! 🎓');
    ['cd-d','cd-h','cd-m','cd-s','cd-days-text'].forEach(id=>setEl(id,'0'));
    return;
  }
  const d=Math.floor(diff/(1000*60*60*24));
  const h=Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const m=Math.floor((diff%(1000*60*60))/(1000*60));
  const s=Math.floor((diff%(1000*60))/1000);
  setEl('cd-d',d);setEl('cd-h',String(h).padStart(2,'0'));
  setEl('cd-m',String(m).padStart(2,'0'));setEl('cd-s',String(s).padStart(2,'0'));
  setEl('cd-days-text',d);
  // ── PANIEKMODUS: <1 dag ──
  const panicMsgs=['😱 MORGEN IS HET EXAMEN!','💀 Geen tijd meer voor Netflix.','📚 Nu studeren of nooit.','🚨 NOODTOESTAND ACTIEF','😰 Slapen is voor later.','🔥 Alles op het spel!','⏰ De klok tikt... SNEL!'];
  const panicEl=document.getElementById('cd-panic-msg');
  if(d<1){
    if(cdEl)cdEl.classList.add('cd-panic');
    if(panicEl){panicEl.style.display='';panicEl.textContent=panicMsgs[Math.floor(Date.now()/2500)%panicMsgs.length];}
  }else{
    if(cdEl)cdEl.classList.remove('cd-panic');
    if(panicEl)panicEl.style.display='none';
  }
}
// updateCountdown() is called after EXAM_SCHEDULE is defined (below)

// ═══════ PROGRESS TRACKING ═══════
function getProgress(){
  try{return JSON.parse(localStorage.getItem('examenapp_'+lvlCol('progress'))||'{}');}
  catch(e){return {};}
}
function saveProgress(vakId,domeinId,mode,score,total){
  const p=getProgress();
  const key=`${vakId}_${domeinId}_${mode}`;
  const prevBest=p[key]?p[key].best:0;
  if(!p[key])p[key]={best:0,total:total,attempts:0};
  p[key].attempts++;
  const isNewRecord=score>prevBest&&score>0;
  if(score>p[key].best)p[key].best=score;
  p[key].total=total;
  cloudSet(lvlCol('progress'),p);
  // Sla oefentijdstip op voor knowledge decay indicator
  try{setDecayNow(vakId,domeinId);}catch(e){}
  // Studieplan: check of dit een geplande taak afrondt
  try{spCheckAfterQuiz(vakId,domeinId,mode,score,total);}catch(e){}
  // Auto-tick vandaag-taken als domein mastery-drempel (70%) gepasseerd wordt
  if(total>=5&&score>0){
    try{
      const newPct=score/total;const oldPct=prevBest/(total||1);
      if(newPct>=0.7&&oldPct<0.7){
        const todayStr=new Date().toISOString().slice(0,10);
        const plan=spGetPlan();
        if(plan)(plan.tasks||[]).filter(t=>t.dateStr===todayStr&&t.vakId===vakId&&t.domId===domeinId).forEach(t=>{
          const k=`${todayStr}_${t.vakId}_${t.domId}_${t.actKey}`;
          if(!spIsDone(k))spMarkDone(k);
        });
      }
    }catch(e){}
  }
  return{isNewRecord,prevBest,newBest:p[key].best,total};
}
// ═══════ KNOWLEDGE DECAY ═══════
const DECAY_KEY='slagio_decay_v1';
function getDecay(){try{return JSON.parse(localStorage.getItem(DECAY_KEY)||'{}');}catch(e){return{};}}
function setDecayNow(vakId,domeinId){
  const d=getDecay();
  d[`${vakId}_${domeinId}`]=Date.now();
  localStorage.setItem(DECAY_KEY,JSON.stringify(d));
  try{pushSyncBundle();}catch(e){}
}
function getDecayStatus(vakId,domeinId){
  const d=getDecay();
  const ts=d[`${vakId}_${domeinId}`];
  if(!ts)return null;
  const days=(Date.now()-ts)/(1000*60*60*24);
  if(days<1)return{color:'#22c55e',label:'Vandaag geoefend'};
  if(days<7)return{color:'#facc15',label:`${Math.floor(days)}d geleden`};
  if(days<21)return{color:'#f97316',label:`${Math.floor(days)}d geleden`};
  return{color:'#ef4444',label:`${Math.floor(days)} dagen geleden — herhalen!`};
}
function getVakProgress(vakId){
  const p=getProgress();
  const results={};
  Object.keys(p).forEach(key=>{
    if(key.startsWith(vakId+'_')){
      results[key]=p[key];
    }
  });
  return results;
}
function getDomeinBestPct(vakId,domeinId){
  const p=getProgress();
  let bestPct=0;
  let hasData=false;
  ['snel','oud'].forEach(mode=>{
    const key=`${vakId}_${domeinId}_${mode}`;
    if(p[key]&&p[key].total>0){
      hasData=true;
      const pct=p[key].best/p[key].total;
      if(pct>bestPct)bestPct=pct;
    }
  });
  return {pct:bestPct,hasData};
}
function getVakBestPct(vakId){
  const vak=getVK().find(v=>v.id===vakId);
  if(!vak)return {pct:0,hasData:false};
  let totalPct=0;let count=0;let hasAny=false;
  vak.domeinen.forEach(d=>{
    const r=getDomeinBestPct(vakId,d.id);
    if(r.hasData){hasAny=true;totalPct+=r.pct;count++;}
  });
  return {pct:count>0?totalPct/count:0,hasData:hasAny};
}
function trapFocus(el,onEscape){
  const sel='button:not([disabled]),a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
  const nodes=[...el.querySelectorAll(sel)];
  if(!nodes.length)return()=>{};
  nodes[0].focus();
  function onKey(e){
    if(e.key==='Tab'){
      if(e.shiftKey){if(document.activeElement===nodes[0]){e.preventDefault();nodes[nodes.length-1].focus();}}
      else{if(document.activeElement===nodes[nodes.length-1]){e.preventDefault();nodes[0].focus();}}
    }
    if(e.key==='Escape'&&onEscape)onEscape();
  }
  el.addEventListener('keydown',onKey);
  return()=>el.removeEventListener('keydown',onKey);
}
function showConfirm(icon,title,msg,okLabel,onOk){
  const ov=document.getElementById('confirm-overlay');
  document.getElementById('confirm-icon').textContent=icon;
  document.getElementById('confirm-title-el').textContent=title;
  document.getElementById('confirm-msg').textContent=msg;
  const okBtn=document.getElementById('confirm-ok');
  const cancelBtn=document.getElementById('confirm-cancel');
  okBtn.textContent=okLabel||'Verwijderen';
  const prev=document.activeElement;
  ov.classList.add('show');
  let releaseTrap;
  const close=()=>{ov.classList.remove('show');if(releaseTrap)releaseTrap();prev?.focus();};
  releaseTrap=trapFocus(ov,close);
  okBtn.onclick=()=>{close();onOk();};
  cancelBtn.onclick=close;
  ov.onclick=(e)=>{if(e.target===ov)close();};
}
function resetVakProgress(){
  if(!ST.vak)return;
  showConfirm(
    '🗑️',
    'Voortgang wissen?',
    `Al je voortgang voor ${ST.vak.naam} wordt permanent verwijderd. Dit kan niet ongedaan worden gemaakt.`,
    'Wissen',
    ()=>{
      const p=getProgress();
      Object.keys(p).forEach(key=>{if(key.startsWith(ST.vak.id+'_'))delete p[key];});
      localStorage.setItem('examenapp_'+lvlCol('progress'),JSON.stringify(p));
      cloudSet(lvlCol('progress'),p);
      openVak(ST.vak.id);
      showToast('Voortgang gewist','#ef4444');
    }
  );
}

// ═══════ FAVORITES ═══════
function getFavs(){
  try{const d=JSON.parse(localStorage.getItem('examenapp_'+lvlCol('favs'))||'[]');return Array.isArray(d)?d:(d.list||[]);}
  catch(e){return [];}
}
function toggleFav(vakId,domeinId){
  let favs=getFavs();
  const key=`${vakId}_${domeinId}`;
  const idx=favs.indexOf(key);
  if(idx>=0)favs.splice(idx,1);else favs.push(key);
  cloudSet(lvlCol('favs'),{list:favs});
  renderFavHome();
  return favs.includes(key);
}
function isFav(vakId,domeinId){return getFavs().includes(`${vakId}_${domeinId}`);}
function renderFavHome(){
  const favs=getFavs();
  const box=document.getElementById('fav-home');
  const chips=document.getElementById('fav-chips');
  if(!favs.length){box.style.display='none';return;}
  box.style.display='block';
  chips.innerHTML='';
  favs.forEach(key=>{
    const [vakId,domId]=key.split('_');
    const vak=getVK().find(v=>v.id===vakId);
    if(!vak)return;
    const dom=vak.domeinen.find(d=>d.id===domId);
    if(!dom)return;
    const chip=document.createElement('div');
    chip.className='fav-chip';
    chip.innerHTML=`<span class="fav-chip-dot" style="background:${vak.kleur}"></span><span class="fav-chip-name">${vak.code} · ${dom.naam}</span>`;
    chip.onclick=()=>{openVak(vakId);};
    chips.appendChild(chip);
  });
}

// ═══════ XP & LEVELS ═══════
const XP_KEY='slagio_xp';
const XP_LEVELS=[0,100,500,2000,7500,30000,75000,200000];
const LEVEL_NAMES=['','Baby','Jong','Tiener','Volwassen','Prime','Goud','Diamant','Platina'];
// ═══════ RIPPLE EFFECT ═══════
(function initRipple(){
  document.addEventListener('click',function(e){
    const target=e.target.closest('button,.opt,.card,.wlc-card,.hm-ql-btn,.lb-filter-btn');
    if(!target)return;
    const r=target.getBoundingClientRect();
    const size=Math.max(r.width,r.height)*1.6;
    const x=e.clientX-r.left-size/2;
    const y=e.clientY-r.top-size/2;
    const wave=document.createElement('span');
    wave.className='ripple-wave';
    const isDark=target.classList.contains('opt')||target.classList.contains('wlc-card');
    wave.style.cssText='width:'+size+'px;height:'+size+'px;left:'+x+'px;top:'+y+'px;background:'+(isDark?'rgba(255,255,255,.22)':'rgba(0,0,0,.08)');
    // Ensure target is positioned
    const pos=getComputedStyle(target).position;
    if(pos==='static')target.style.position='relative';
    target.style.overflow='hidden';
    target.appendChild(wave);
    setTimeout(()=>wave.remove(),700);
  });
})();

// ═══════ 3D CARD TILT ═══════
function addTiltToCards(){
  document.querySelectorAll('#vakgrid .card').forEach(card=>{
    card.addEventListener('mousemove',function(e){
      const r=this.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      this.style.transform='perspective(700px) rotateY('+x*9+'deg) rotateX('+-y*9+'deg) translateY(-6px) scale(1.02)';
      this.style.transition='box-shadow .2s';
    });
    card.addEventListener('mouseleave',function(){
      this.style.transform='';
      this.style.transition='transform .55s cubic-bezier(.22,1,.36,1),box-shadow .35s';
    });
  });
}

// ═══════ LIVE STUDENT COUNTER ═══════
function getLiveCount(){
  const h=new Date().getHours();
  const day=new Date().getDay();
  const weekday=day>=1&&day<=5;
  let base;
  if(h>=16&&h<=22)base=weekday?54:38;
  else if(h>=9&&h<=16)base=weekday?33:20;
  else if(h>=7&&h<=9)base=weekday?24:14;
  else base=weekday?9:6;
  return base+Math.floor(Math.random()*11);
}
function animateNum(el,target){
  const start=parseInt(el.textContent)||0;
  const diff=target-start;
  const dur=600;
  const t0=performance.now();
  (function step(now){
    const p=Math.min(1,(now-t0)/dur);
    const ease=1-Math.pow(1-p,3);
    el.textContent=Math.round(start+diff*ease);
    if(p<1)requestAnimationFrame(step);
  })(performance.now());
}
function renderLiveCount(){
  const box=document.getElementById('live-count-home');
  if(!box)return;
  const n=getLiveCount();
  if(!box.innerHTML){
    box.innerHTML='<div class="live-count-wrap"><span class="live-dot"></span><span class="live-num" id="live-num">'+n+'</span><span class="live-sep">·</span><span>leerlingen oefenen nu</span><span class="live-sub">🟢 Live</span></div>';
  } else {
    const el=document.getElementById('live-num');
    if(el){el.style.opacity='0';setTimeout(()=>{el.style.opacity='1';animateNum(el,n);},220);}
  }
}
setInterval(renderLiveCount,32000);

// ═══════ CONFETTI ═══════
function launchConfetti(type){
  type=type||'normal';
  const canvas=document.createElement('canvas');
  canvas.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9990';
  document.body.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  canvas.width=innerWidth;canvas.height=innerHeight;
  const colors=type==='gold'?['#f59e0b','#fbbf24','#fcd34d','#fff','#E85C0D']:['#E85C0D','#6366f1','#22c55e','#ec4899','#f59e0b','#60a5fa','#a78bfa'];
  const count=type==='gold'?130:90;
  const pieces=[];
  for(let i=0;i<count;i++){
    pieces.push({x:Math.random()*innerWidth,y:type==='gold'?Math.random()*innerHeight*.3:Math.random()*-innerHeight*.4,
      w:Math.random()*10+4,h:Math.random()*6+3,r:Math.random()*Math.PI*2,rd:(Math.random()-.5)*.3,
      vx:Math.random()*6-3,vy:Math.random()*4+1.5,color:colors[Math.floor(Math.random()*colors.length)],alpha:1});
  }
  let fr;
  (function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let alive=false;
    pieces.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.r+=p.rd;p.vy+=.07;p.alpha-=.006;
      if(p.alpha>0&&p.y<canvas.height+20){alive=true;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.globalAlpha=Math.max(0,p.alpha);ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();}
    });
    if(alive)fr=requestAnimationFrame(draw);else canvas.remove();
  })();
  setTimeout(()=>{cancelAnimationFrame(fr);canvas.remove();},6000);
}

// ═══════ FLOATING XP ═══════
function floatXP(amount,refEl){
  const el=refEl||document.getElementById('qfb');
  if(!el)return;
  const r=el.getBoundingClientRect();
  const div=document.createElement('div');
  div.className='xp-float';
  div.textContent='+'+amount+' XP';
  div.style.left=(r.left+r.width/2)+'px';
  div.style.top=(r.top+10)+'px';
  document.body.appendChild(div);
  setTimeout(()=>div.remove(),900);
}

// ═══════ TOAST ═══════
function getMyCurrentAvatar(){
  try{
    const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    if(p.animalId)return getAnimalEmoji(p.animalId,getTotalXP());
    return p.avatar||'🐾';
  }catch(e){return '🐾';}
}
function getMyCurrentAvatarHtml(size){
  size=size||28;
  try{
    const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    if(p.animalId)return getAnimalDisplay(p.animalId,getAnimalStageIdx(getTotalXP()),size);
    return`<span style="font-size:${size}px;line-height:1">${p.avatar||'🐾'}</span>`;
  }catch(e){return`<span style="font-size:${size}px">🐾</span>`;}
}
function getLbAvatarHtml(e,size){
  size=size||28;
  if(e&&e.animalId){return getAnimalDisplay(e.animalId,e.stageIdx!=null?e.stageIdx:0,size);}
  return`<span style="font-size:${size}px;line-height:1">${e&&e.avatar?e.avatar:'🐻'}</span>`;
}
// Prioriteitsvolgorde voor "beste badge" display
const BADGE_PRIORITY=['streak100','streak30','streak14','streak7','quiz500','quiz100','combo10','perfect','streak3','quiz50','combo5','vakken10','quiz10','combo3','vakken3','examen_done','quiz1','streak1'];
function getBestBadgeId(achievedObj){
  // Gebruik handmatig geselecteerde badge als die is verdiend
  const sel=getSelectedFeaturedBadgeId();
  if(sel&&achievedObj&&achievedObj[sel])return sel;
  // Anders automatisch hoogste badge
  if(!achievedObj)return null;
  for(const id of BADGE_PRIORITY){if(achievedObj[id])return id;}
  return null;
}
function getLbBadgeOverlay(badgeId,borderColor){
  if(!badgeId)return'';
  const b=ALL_BADGES.find(x=>x.id===badgeId);
  if(!b)return'';
  const rarity=b.rarity||'common';
  return`<div class="lb-av-badge rarity-${rarity}" style="${borderColor?'border-color:'+borderColor:''}" title="${b.label} · ${RARITY_LABEL[rarity]||''}">${b.emoji}</div>`;
}
// ── EVOLUTION REVEAL ─────────────────────────────────────────────
function showEvoReveal(newStage,animalId){
  const a=getAnimalById(animalId);
  const modal=document.getElementById('evo-reveal-modal');
  if(!modal)return;
  const stageName=ANIM_STAGE_NAMES[newStage]||'Nieuw stadium';
  // Styles per stage: 5=Goud, 6=Diamant, 7=Platina; lager=paars (default)
  const cfg={
    5:{badge:'evo-rb-goud',btn:'evo-btn-goud',glow:'evo-reveal-glow-goud',div:'evo-divider-goud',crown:'✨',em:'✨'},
    6:{badge:'evo-rb-diamant',btn:'evo-btn-diamant',glow:'evo-reveal-glow-diamant',div:'evo-divider-diamant',crown:'💎',em:'💎'},
    7:{badge:'evo-rb-platina',btn:'evo-btn-platina',glow:'evo-reveal-glow-platina',div:'evo-divider-platina',crown:'🔮',em:'🔮'},
  }[newStage]||{badge:'evo-rb-default',btn:'evo-btn-default',glow:'',div:'evo-divider-default',crown:'⭐',em:'⭐'};
  // Reset card animation so it replays
  const card=modal.querySelector('.evo-reveal-card');
  if(card){card.style.animation='none';card.style.opacity='0';requestAnimationFrame(()=>requestAnimationFrame(()=>{card.style.animation='';}));}
  const glowEl=document.getElementById('evo-reveal-glow');
  const crownEl=document.getElementById('evo-reveal-crown');
  const badgeEl=document.getElementById('evo-reveal-badge');
  const avEl=document.getElementById('evo-reveal-av');
  const divEl=document.getElementById('evo-reveal-divider');
  const titleEl=document.getElementById('evo-reveal-title');
  const subEl=document.getElementById('evo-reveal-sub');
  const btnEl=document.getElementById('evo-reveal-btn');
  if(glowEl)glowEl.className='evo-reveal-glow '+(cfg.glow);
  if(crownEl){crownEl.style.animation='none';crownEl.textContent=cfg.crown;requestAnimationFrame(()=>requestAnimationFrame(()=>{crownEl.style.animation='';}));}
  if(badgeEl){badgeEl.className='evo-reveal-badge '+cfg.badge;badgeEl.textContent=cfg.em+' '+stageName;}
  if(avEl){avEl.style.animation='none';avEl.innerHTML=getAnimalDisplay(animalId,newStage,80);requestAnimationFrame(()=>requestAnimationFrame(()=>{avEl.style.animation='';}));}
  if(divEl)divEl.className='evo-reveal-divider '+cfg.div;
  const animalLabel=(a&&a.lbl&&a.lbl[Math.min(newStage,a.lbl.length-1)])||(a?stageName+' '+a.n:stageName);
  const msgs={
    5:'Je dier gloeit als goud. Jij bent een echte topper! 🥇',
    6:'Diamant — zo zeldzaam als jouw doorzettingsvermogen. 💎',
    7:'Platina. Het allerhoogste niveau. Slechts weinigen halen dit. 🏆'
  };
  if(titleEl)titleEl.textContent=animalLabel;
  if(subEl)subEl.textContent=msgs[newStage]||'Gefeliciteerd! Je dier evolueert naar '+stageName+'!';
  if(btnEl){btnEl.className='evo-reveal-btn '+cfg.btn;btnEl.textContent='Geweldig! 🎉';}
  modal.classList.add('open');
  haptic([80,40,80,40,200]);
}
function closeEvoReveal(){
  const modal=document.getElementById('evo-reveal-modal');
  if(modal)modal.classList.remove('open');
}
function syncAvatarToProfile(){
  try{
    const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    if(!p.animalId)return;
    p.avatar=getAnimalEmoji(p.animalId,getTotalXP());
    localStorage.setItem(PROF_KEY,JSON.stringify(p));
    if(p.naam)_updateMyLbAvatar(p.avatar,p.naam);
  }catch(e){}
}
// Sync eigen avatar-velden naar alle Supabase leaderboard-entries (1x per sessie)
const _avatarCloudSyncedKey='slagio_av_synced_'+new Date().toISOString().slice(0,10);
async function syncMyAvatarToCloud(){
  if(!currentUser)return;
  if(sessionStorage.getItem(_avatarCloudSyncedKey))return;
  try{
    const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    if(!p.animalId)return;
    const stageIdx=getAnimalStageIdx(getTotalXP());
    const featuredBadgeId=getBestBadgeId(getAchieved())||null;
    await SB.from('leaderboard').update({
      animal_id:p.animalId,
      stage_idx:stageIdx,
      featured_badge_id:featuredBadgeId,
      avatar:getAnimalEmoji(p.animalId,getTotalXP())
    }).eq('user_id',currentUser.id);
    sessionStorage.setItem(_avatarCloudSyncedKey,'1');
  }catch(e){console.warn('syncMyAvatarToCloud error:',e);}
}
// Patch avatar in all own leaderboard entries (called after evolution)
function _updateMyLbAvatar(newAvatar,naam){
  try{
    const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    const animalId=p.animalId||null;
    const stageIdx=animalId?getAnimalStageIdx(getTotalXP()):0;
    ['havo','vwo'].forEach(niveau=>{
      const key='examenapp_leaderboard_'+niveau;
      const entries=JSON.parse(localStorage.getItem(key)||'[]');
      let changed=false;
      const featuredBadgeId=getBestBadgeId(getAchieved())||null;
      entries.forEach(e=>{
        if(!e.isBot&&e.naam===naam){
          e.avatar=newAvatar;
          if(animalId){e.animalId=animalId;e.stageIdx=stageIdx;}
          if(featuredBadgeId)e.featuredBadgeId=featuredBadgeId;
          changed=true;
        }
      });
      if(changed)localStorage.setItem(key,JSON.stringify(entries));
    });
  }catch(e){}
}

function showToast(msg,color,dur){
  color=color||'#22c55e';dur=dur||2800;
  document.querySelectorAll('.app-toast').forEach(e=>e.remove());
  const el=document.createElement('div');
  el.className='app-toast';
  el.style.background=color;
  el.innerHTML=msg;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),dur);
}

// ═══════ DAILY GOAL ═══════
const DG_KEY='slagio_daily_goal';
const DG_TARGET=3;
function getDailyGoal(){
  const today=new Date().toISOString().slice(0,10);
  try{const d=JSON.parse(localStorage.getItem(DG_KEY)||'{}');if(d.date===today)return d;}catch(e){}
  const d={date:today,done:0,rewarded:false};
  localStorage.setItem(DG_KEY,JSON.stringify(d));
  return d;
}
function recordDailyGoal(){
  const d=getDailyGoal();
  d.done=(d.done||0)+1;
  const wasRewarded=d.rewarded;
  if(d.done>=DG_TARGET&&!d.rewarded){
    d.rewarded=true;
    localStorage.setItem(DG_KEY,JSON.stringify(d));
    addXP(75);
    renderXPHome();
    setTimeout(()=>{
      launchConfetti('gold');launchConfetti();
      playSound('levelup');haptic([60,30,80,30,120,30,200]);
      // Grote viering overlay
      const ov=document.createElement('div');
      ov.style.cssText='position:fixed;inset:0;z-index:9700;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.55);backdrop-filter:blur(6px)';
      ov.innerHTML=`<div style="background:var(--bg);border-radius:28px;padding:32px 28px;max-width:340px;width:100%;text-align:center;animation:comboIn .45s cubic-bezier(.34,1.2,.64,1)">
        <div style="font-size:52px;margin-bottom:12px">🎯</div>
        <h2 style="font-family:var(--font-head);font-size:26px;font-weight:900;color:var(--or);margin-bottom:8px">Dagdoel bereikt!</h2>
        <p style="color:var(--mu);font-size:14px;margin-bottom:18px;line-height:1.5">Je hebt vandaag ${DG_TARGET} quizzen voltooid.<br><strong style="color:var(--dk)">+75 XP bonus verdiend!</strong></p>
        <button onclick="this.closest('div[style]').remove()" style="width:100%;padding:14px;background:var(--or);border:none;border-radius:14px;font-size:15px;font-weight:900;color:#fff;cursor:pointer;font-family:var(--font)">Doorgaan 🔥</button>
      </div>`;
      document.body.appendChild(ov);
      ov.addEventListener('click',e=>{if(e.target===ov)ov.remove();});
      if(earnAch('daily_goal'))showAch('🎯','Eerste dagdoel bereikt!',90);
    },500);
  } else {
    localStorage.setItem(DG_KEY,JSON.stringify(d));
  }
  renderDailyGoal();
}
function renderDailyGoal(){
  const box=document.getElementById('daily-goal-home');
  if(!box)return;
  const d=getDailyGoal();
  const done=Math.min(d.done||0,DG_TARGET);
  if(d.rewarded||done>=DG_TARGET){
    box.innerHTML='<div class="dg-done">🎯 Dagdoel bereikt! <span>'+DG_TARGET+' / '+DG_TARGET+' quizzen</span></div>';
    return;
  }
  const dots=Array.from({length:DG_TARGET},function(_,i){return '<div class="dg-dot'+(i<done?' dg-dot-done':'')+'"></div>';}).join('');
  box.innerHTML='<div class="dg-card"><div class="dg-top"><span class="dg-ico">🎯</span><span class="dg-lbl">Dagdoel <span class="dg-cnt">'+done+'/'+DG_TARGET+'</span></span><span class="dg-bonus">+75 XP</span></div><div class="dg-dots">'+dots+'</div><div class="dg-bar-wrap"><div class="dg-bar" style="width:'+Math.round(done/DG_TARGET*100)+'%"></div></div></div>';
}
function getXPData(){
  try{
    const fromKey=(JSON.parse(localStorage.getItem(XP_KEY)||'{"xp":0}').xp)||0;
    const prof=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    const fromProf=typeof prof.xp==='number'?prof.xp:null;
    // Neem de hoogste waarde zodat XP nooit terugvalt bij een desync
    const xp=fromProf!==null?Math.max(fromProf,fromKey):fromKey;
    return{xp};
  }catch(e){return{xp:0};}
}
function getTotalXP(){return getXPData().xp||0;}
function getLevelForXP(xp){let l=1;for(let i=0;i<XP_LEVELS.length;i++){if(xp>=XP_LEVELS[i])l=i+1;}return Math.min(l,XP_LEVELS.length);}
function getXPForLevel(l){return XP_LEVELS[Math.min(l-1,XP_LEVELS.length-1)]||0;}
function getXPPct(xp){
  const l=getLevelForXP(xp);
  const cur=getXPForLevel(l);
  const nxt=getXPForLevel(l+1)||cur+1000;
  return Math.min(Math.round((xp-cur)/(nxt-cur)*100),100);
}
function addXP(amount){
  try{const t=new Date().toISOString().slice(0,10);const k='slagio_xp_today';const s=JSON.parse(localStorage.getItem(k)||'{}');if(s.d!==t){s.d=t;s.x=0;}s.x=(s.x||0)+amount;localStorage.setItem(k,JSON.stringify(s));}catch(e){}
  const d=getXPData();
  const oldLvl=getLevelForXP(d.xp);
  d.xp=(d.xp||0)+amount;
  localStorage.setItem(XP_KEY,JSON.stringify(d));
  // Sla XP op in profiel-kolom (betrouwbare Supabase-kolom)
  if(currentUser){
    try{
      const prof=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
      prof.xp=d.xp;
      localStorage.setItem(PROF_KEY,JSON.stringify(prof));
      cloudSet('profiel',prof);
    }catch(e){}
  }
  const newLvl=getLevelForXP(d.xp);
  const oldStage=getAnimalStageIdx(d.xp-(amount));
  const newStage=getAnimalStageIdx(d.xp);
  return{added:amount,oldLvl,newLvl,leveled:newLvl>oldLvl,totalXP:d.xp,evolved:newStage>oldStage,newStage};
}
function getComboMult(combo){if(combo>=5)return 2;if(combo>=3)return 1.5;return 1;}
function getStreakBonus(){const s=calcStreak();return Math.min((s.current||0)*0.1,0.5);}
function showCombo(combo){
  document.querySelectorAll('.combo-badge').forEach(e=>e.remove());
  if(combo<2)return;
  const mult=getComboMult(combo);
  const el=document.createElement('div');
  el.className='combo-badge'+(combo>=5?' combo-big':'');
  const labels={2:'Goed zo!',3:'Super!',4:'Onstoppbaar!',5:'GOD MODE!'};
  const lbl=labels[Math.min(combo,5)]||'Onstoppbaar!';
  el.innerHTML=`🔥 <strong>${combo}×</strong> — ${lbl} <span style="opacity:.7;font-size:.75em">×${mult} XP</span>`;
  document.body.appendChild(el);
  haptic(combo>=5?[50,30,50,30,100]:combo>=3?[40,20,60]:[25]);
  playSound(combo>=3?'combo':'correct');
  checkComboAch(combo);
  setTimeout(()=>el.remove(),2000);
}
function showXPToast(xp){
  document.querySelectorAll('.xp-toast').forEach(e=>e.remove());
  const el=document.createElement('div');
  el.className='xp-toast';
  el.textContent=`+${xp} XP`;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1500);
}
function floatXP(amount){
  const anchor=document.getElementById('res-xp-card')||document.getElementById('sc-res');
  const el=document.createElement('div');
  el.className='xp-float';
  el.textContent='+'+amount+' XP';
  const top=anchor?anchor.getBoundingClientRect().top+window.scrollY-40:innerHeight*0.4;
  const left=anchor?anchor.getBoundingClientRect().left+anchor.offsetWidth/2:innerWidth/2;
  el.style.cssText='top:'+top+'px;left:'+left+'px;transform:translateX(-50%);opacity:1';
  document.body.appendChild(el);
  requestAnimationFrame(()=>{
    el.style.transition='transform 1.3s cubic-bezier(.2,.8,.4,1),opacity 1.3s ease-out';
    el.style.transform='translateX(-50%) translateY(-90px)';
    el.style.opacity='0';
  });
  setTimeout(()=>el.remove(),1500);
}
function renderGreeting(){
  const el=document.getElementById('hm-greeting');
  if(!el)return;
  const h=new Date().getHours();
  const gdag=h<12?'Goedemorgen':h<18?'Goedemiddag':'Goedenavond';
  const naam=localStorage.getItem('slagio_naam')||(typeof currentUser!=='undefined'&&currentUser&&currentUser.user_metadata&&currentUser.user_metadata.naam)||'';
  const {current:streak,days}=calcStreak();
  const todayStr=new Date().toISOString().slice(0,10);
  const practicedToday=days&&days.includes(todayStr);
  el.className='hm-greeting';
  if(!practicedToday&&streak>0){
    el.className='hm-greeting hm-greeting-warn';
    el.textContent='⚠️ Je '+streak+'-daagse streak staat op het spel!';
  }else if(practicedToday&&streak>=7){
    el.textContent='💎 '+streak+' dagen op rij — ongelooflijk!';
  }else if(practicedToday&&streak>=3){
    el.textContent='🔥 '+streak+' dagen op rij — ga zo door!';
  }else if(practicedToday){
    el.textContent='✅ Vandaag al geoefend — top!';
  }else{
    el.textContent=gdag+(naam?' '+naam:'')+' — klaar voor je examen?';
  }
}

function renderHomeStats(){
  const box=document.getElementById('home-bento');
  if(!box)return;
  // ── Data ──────────────────────────────────────────
  const {current:streak}=calcStreak();
  const xp=getTotalXP();
  const lvl=getLevelForXP(xp);
  const cijfers=getSavedCijfers();
  const vals=Object.values(cijfers).filter(v=>typeof v==='number'&&v>0);
  const avg=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;
  // ── Action cells (always shown) ───────────────────
  const actCells=`
    <button class="bento-cell bento-act" onclick="show('sc-schedule')" aria-label="Rooster">
      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      <span class="bento-al">Rooster</span>
    </button>
    <button class="bento-cell bento-act" onclick="show('sc-calc');setTimeout(prefillCalcFromSaved,50)" aria-label="Berekenen">
      <svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>
      <span class="bento-al">Berekenen</span>
    </button>
    <button class="bento-cell bento-act" onclick="show('sc-sociaal')" aria-label="Sociaal">
      <svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="19" cy="8" r="2"/><path d="M19 14c1.7 0 3 1.3 3 3v1"/></svg>
      <span class="bento-al">Sociaal</span>
    </button>
    <button class="bento-cell bento-act" onclick="show('sc-info')" aria-label="Slaagregels">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <span class="bento-al">Slaagregels</span>
    </button>`;
  // ── Dagdoel (berekend vroeg, nodig voor beide paden) ──
  const _dg=getDailyGoal();
  const _dgDone=Math.min(_dg.done||0,DG_TARGET);
  const _dgRewarded=_dg.rewarded||_dgDone>=DG_TARGET;
  function _buildDgCell(){
    if(_dgRewarded){
      return`<div class="bento-cell bento-dg bento-dg-done" style="grid-column:1/-1;padding:12px 16px;display:flex;align-items:center;gap:10px">
        <span style="font-size:20px;position:relative;z-index:1">✅</span>
        <div style="flex:1;position:relative;z-index:1">
          <div style="font-size:13px;font-weight:700;color:#22c55e">Dagdoel bereikt!</div>
          <div style="font-size:11px;color:var(--mu);margin-top:1px">${DG_TARGET} / ${DG_TARGET} quizzen voltooid · +75 XP verdiend</div>
        </div>
        <span style="font-size:11px;font-weight:700;color:#22c55e;background:rgba(34,197,94,.1);padding:3px 10px;border-radius:20px;position:relative;z-index:1">+75 XP</span>
      </div>`;
    }
    // Countdown tot middernacht
    const _now=new Date();
    const _mn=new Date(_now);_mn.setHours(23,59,59,999);
    const _ms=_mn-_now;
    const _h=Math.floor(_ms/3600000);
    const _m=Math.floor((_ms%3600000)/60000);
    const _s=Math.floor((_ms%60000)/1000);
    const _timer=`${String(_h).padStart(2,'0')}:${String(_m).padStart(2,'0')}:${String(_s).padStart(2,'0')}`;
    const _pct=Math.round(_dgDone/DG_TARGET*100);
    return`<div class="bento-cell bento-dg" style="grid-column:1/-1;padding:12px 16px">
      <div style="display:flex;align-items:center;gap:8px;position:relative;z-index:1">
        <span style="font-size:16px">🎯</span>
        <span style="font-size:13px;font-weight:700;color:var(--dk)">Dagdoel</span>
        <span style="font-size:12px;color:var(--mu)">${_dgDone} / ${DG_TARGET} quizzen</span>
        <span id="bento-dg-timer" style="margin-left:auto;font-size:11px;font-weight:600;color:var(--mu);background:var(--bo);padding:3px 9px;border-radius:20px;font-variant-numeric:tabular-nums">⏱ ${_timer}</span>
      </div>
      <div class="bento-dg-bar"><div class="bento-dg-bar-fill" style="width:${_pct}%"></div></div>
    </div>`;
  }
  // ── Clear standalone containers (altijd) ──────────
  const _dgBox=document.getElementById('daily-goal-home');if(_dgBox)_dgBox.innerHTML='';
  const _smBox=document.getElementById('streak-milestone-banner-home');if(_smBox)_smBox.innerHTML='';
  // ── No data → empty state + actions + dagdoel ─────
  if(!xp&&!streak&&avg===null){
    box.innerHTML=`<div class="bento">
      <div class="bento-cell bento-empty" onclick="document.getElementById('vakgrid')?.scrollIntoView({behavior:'smooth'})">
        <span class="bento-empty-icon">🚀</span>
        <span class="bento-empty-text">Maak je eerste quiz om je streak, XP en gemiddelde te zien</span>
        <span class="bento-empty-cta">Begin →</span>
      </div>
      ${actCells}${_buildDgCell()}
    </div>`;
    return;
  }
  // ── Streak cell ───────────────────────────────────
  const todayStr=new Date().toISOString().slice(0,10);
  const s=getStreak();
  const practicedToday=s.days&&s.days.includes(todayStr);
  const atRisk=!practicedToday&&streak>0;
  const milestones=[3,7,14,30,100,200,300,365];
  const nextMile=milestones.find(m=>m>streak);
  let streakSub=atRisk?'⚠ Oefen voor middernacht!':streak>0?'Dagen op rij':'Begin je streak!';
  const mileLabel={3:'🔥3-daags',7:'⚡7-daags',14:'💎14-daags',30:'🔮30-daags',100:'👑100-daags',200:'🌌200-daags',300:'⚜️300-daags',365:'🪐365-daags'};
  if(!atRisk&&nextMile&&(nextMile-streak)<=2)streakSub=`Nog ${nextMile-streak}d voor ${mileLabel[nextMile]||nextMile+'d'} badge!`;
  const streakCell=`<div class="bento-cell bento-streak${atRisk?' bento-at-risk':''}" onclick="show('sc-home');setTimeout(()=>{const el=document.getElementById('streak-home');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},120)" role="button" tabindex="0">
    <div class="bento-stat"><div class="bento-si">🔥</div><div class="bento-sv">${streak} dag${streak!==1?'en':''}</div><div class="bento-sl">${streakSub}</div></div>
  </div>`;
  // ── Level / XP cell ───────────────────────────────
  const nxtXP=getXPForLevel(lvl+1)||(getXPForLevel(lvl)+1000);
  const xpToNext=nxtXP-xp;
  const xpIsUrgent=xpToNext<=100&&xpToNext>0;
  const xpSub=xp>0?(xpIsUrgent?`⚡ Nog ${xpToNext} XP!`:`Nog ${xpToNext} XP`):'';
  const lvlCell=xp>0?`<div class="bento-cell bento-xp${xpIsUrgent?' bento-xp-urgent':''}" onclick="show('sc-home');setTimeout(()=>{const el=document.getElementById('xp-home-bar');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},120)" role="button" tabindex="0">
    <div class="bento-stat"><div class="bento-si">⭐</div><div class="bento-sv">Level ${lvl}</div><div class="bento-sl">${xpSub}</div></div>
  </div>`:'';
  // ── Badges cell ───────────────────────────────────
  const earnedCount=ALL_BADGES.filter(b=>getAchieved()[b.id]).length;
  const badgeCell=earnedCount>0?`<div class="bento-cell bento-badges" onclick="openProfiel();setTimeout(()=>{const el=document.getElementById('prof-badges-content');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},250)" role="button" tabindex="0">
    <div class="bento-stat"><div class="bento-si">🏅</div><div class="bento-sv">${earnedCount}/${ALL_BADGES.length}</div><div class="bento-sl">Badges</div></div>
  </div>`:'';
  // ── Avg cell (altijd zichtbaar; leeg = uitnodiging om cijfers in te voeren) ──
  const avgCell=avg!==null
    ?`<div class="bento-cell ${avg<6?'bento-avg-warn':'bento-avg-ok'}" onclick="show('sc-calc');setTimeout(prefillCalcFromSaved,50)" role="button" tabindex="0">
        <div class="bento-stat"><div class="bento-si">📈</div><div class="bento-sv">${avg.toFixed(1).replace('.',',')}</div><div class="bento-sl">Gem. SE</div></div>
      </div>`
    :`<div class="bento-cell bento-avg-empty" onclick="show('sc-calc');setTimeout(prefillCalcFromSaved,50)" role="button" tabindex="0">
        <div class="bento-stat"><div class="bento-si" style="font-size:18px">📈</div><div class="bento-sv" style="font-size:13px;font-weight:700;color:var(--mu)">Cijfers</div><div class="bento-sl" style="font-size:10px">Voer in →</div></div>
      </div>`;
  const groepCell='';
  // ── Streak milestone cell (conditional, full-width) ──
  let smCell='';
  const nextMile2=getNextStreakMilestone(streak);
  if(nextMile2){
    const dLeft=nextMile2-streak;
    if(dLeft>0&&dLeft<=7){
      const bMap={7:{e:'⚡',n:'Een week'},14:{e:'💎',n:'Twee weken'},30:{e:'🔮',n:'Een maand'},100:{e:'👑',n:'Legende'},200:{e:'🌌',n:'Onsterfelijk'},300:{e:'⚜️',n:'Grootmeester'},365:{e:'🪐',n:'Heel het jaar'}};
      const b=bMap[nextMile2]||{e:'🏅',n:nextMile2+' dagen'};
      const fp=Math.round(Math.min(99,streak/nextMile2*100));
      smCell=`<div class="bento-cell streak-milestone-banner" style="grid-column:1/-1;border-radius:14px;padding:12px 16px;margin:0">
        <div class="smb-row"><div class="smb-icon">🔥</div><div class="smb-text">Nog <strong>${dLeft} dag${dLeft>1?'en':''}</strong> tot je ${b.e} <strong>${b.n}</strong> badge! Oefen vandaag voor dag ${streak+1}.</div></div>
        <div class="smb-bar-wrap"><div class="smb-bar-fill" style="width:${fp}%"></div></div>
        <div class="smb-bar-lbl">${streak} / ${nextMile2} dagen</div>
      </div>`;
    }
  }
  box.innerHTML=`<div class="bento">${streakCell}${lvlCell}${badgeCell}${avgCell}${groepCell}${actCells}${_buildDgCell()}${smCell}</div>`;
  // Live countdown ticker (alleen als dagdoel nog niet voltooid)
  if(!_dgRewarded){
    if(window._dgTimer)clearInterval(window._dgTimer);
    window._dgTimer=setInterval(()=>{
      const el=document.getElementById('bento-dg-timer');
      if(!el){clearInterval(window._dgTimer);return;}
      const now=new Date();const mn=new Date(now);mn.setHours(23,59,59,999);
      const ms=mn-now;
      const h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000),s=Math.floor((ms%60000)/1000);
      el.textContent=`⏱ ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    },1000);
  } else {
    if(window._dgTimer)clearInterval(window._dgTimer);
  }
}

function renderXPHome(){
  const box=document.getElementById('xp-home-bar');
  if(!box)return;
  const xp=getTotalXP();
  // Avatar evolution progress
  const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  const animalId=p.animalId||null;
  const animal=animalId?getAnimalById(animalId):null;
  if(xp===0&&!animal){box.innerHTML='';return;}
  const stageIdx=getAnimalStageIdx(xp);
  const isMaxStage=stageIdx===ANIM_THRESHOLDS.length-1;
  const curThresh=ANIM_THRESHOLDS[stageIdx];
  const nxtThresh=isMaxStage?curThresh+1:ANIM_THRESHOLDS[stageIdx+1];
  const stagePct=isMaxStage?100:Math.round(Math.min(100,(xp-curThresh)/(nxtThresh-curThresh)*100));
  const currentEmoji=animal?animal.s[stageIdx]:'⭐';
  const currentDisplay=animal?getAnimalDisplay(animal.id,stageIdx,50):`<span style="font-size:30px">⭐</span>`;
  const animalName=animal?animal.n:'Avatar';
  const stageName=ANIM_STAGE_NAMES[stageIdx];
  const nextStageName=isMaxStage?null:ANIM_STAGE_NAMES[stageIdx+1];
  const toNext=nxtThresh-xp;
  // Build journey steps (all 5 stages)
  let journeyHtml='';
  for(let i=0;i<ANIM_THRESHOLDS.length;i++){
    const isDone=i<stageIdx;
    const isCur=i===stageIdx;
    const emoji=animal?animal.s[i]:'⭐';
    const cls='xp-evo-step'+(isDone?' done':isCur?' current':'');
    const stepLbl=animal&&animal.lbl?animal.lbl[i]:ANIM_STAGE_NAMES[i];
    const stepDisplay=isDone||isCur
      ?(animal?getAnimalDisplay(animal.id,i,isCur?26:22):emoji)
      :'<span style="font-size:20px;opacity:.3;filter:grayscale(1)">❓</span>';
    journeyHtml+=`<div class="${cls}"><span class="xp-evo-step-emoji">${stepDisplay}</span><span class="xp-evo-step-name">${isDone||isCur?stepLbl:'???'}</span></div>`;
    if(i<ANIM_THRESHOLDS.length-1){
      journeyHtml+=`<div class="xp-evo-connector${isDone?' done':''}"></div>`;
    }
  }
  const footLeft=isMaxStage?`🏆 Maximaal stadium bereikt!`:`${(xp-curThresh).toLocaleString('nl')} / ${(nxtThresh-curThresh).toLocaleString('nl')} XP`;
  const footRight=isMaxStage?`${xp.toLocaleString('nl')} XP totaal`:(stagePct>=80?`🔥 Nog ${toNext} XP!`:`→ ${nextStageName}`);
  box.innerHTML=`<div class="xp-home-bar">
    <div class="xp-hb-inner">
      <div class="xp-home-lvl">${currentDisplay}</div>
      <div class="xp-home-info">
        <div class="xp-home-head">
          <div class="xp-home-title">${animalName} <span class="xp-evo-chip">${stageName}</span></div>
          <div class="xp-home-pct">${stagePct}%</div>
        </div>
        <div class="xp-evo-journey">${journeyHtml}</div>
        <div class="xp-bar-wrap"><div class="xp-bar" id="xp-bar-fill" style="width:0%"></div></div>
        <div class="xp-evo-foot"><span class="xp-evo-foot-from">${footLeft}</span><span class="xp-evo-foot-to">${footRight}</span></div>
      </div>
    </div>
  </div>`;
  setTimeout(()=>{const b=document.getElementById('xp-bar-fill');if(b)b.style.width=stagePct+'%';},50);
}

// ═══════ DAILY CHALLENGE ═══════
const DC_KEY='slagio_daily_challenge';
let _dcCache=null; // cached per render so startDailyChallenge doesn't re-validate
function _dcLevelKey(){return DC_KEY+'_'+APP_LEVEL;}
function getDailyChallenge(){
  const today=new Date().toISOString().slice(0,10);
  const key=_dcLevelKey();
  try{
    const d=JSON.parse(localStorage.getItem(key)||'{}');
    if(d.date===today){
      const vak=getVK().find(v=>v.id===d.vakId);
      const dom=vak&&vak.domeinen.find(x=>x.id===d.domeinId);
      if(vak&&dom&&dom.sv&&dom.sv.length>=3)return d;
    }
  }catch(e){}
  // Pick a fresh challenge from all valid HAVO/VWO domains
  const all=[];
  getVK().forEach(v=>v.domeinen.forEach(d=>{if(d.sv&&d.sv.length>=3)all.push({vak:v,domein:d});}));
  if(!all.length)return null;
  const pick=all[Math.floor(Math.random()*all.length)];
  const dc={date:today,vakId:pick.vak.id,vakNaam:pick.vak.naam,domeinId:pick.domein.id,domeinNaam:pick.domein.naam,done:false};
  try{localStorage.setItem(key,JSON.stringify(dc));}catch(e){}
  return dc;
}
function renderDailyChallenge(){
  // Inline card verwijderd — uitdaging verschijnt nu als popup
  const box=document.getElementById('daily-challenge-home');
  if(box)box.innerHTML='';
  _dcCache=getDailyChallenge();
}
let _dcTrapRelease=null;
function showDailyChallengePopup(){
  const dc=getDailyChallenge();
  if(!dc||dc.done)return;
  if(sessionStorage.getItem('dc_dismissed'))return;
  const popup=document.getElementById('dc-popup');
  if(!popup)return;
  const titleEl=document.getElementById('dc-popup-title');
  const subEl=document.getElementById('dc-popup-sub');
  if(titleEl)titleEl.textContent=dc.domeinNaam;
  if(subEl)subEl.textContent=dc.vakNaam+' · Snelle Quiz · 20 sec per vraag';
  _dcCache=dc;
  setTimeout(()=>{
    popup.classList.add('show');
    _dcTrapRelease=trapFocus(popup,()=>closeDcPopup(false));
  },500);
}
function closeDcPopup(start){
  const popup=document.getElementById('dc-popup');
  if(popup)popup.classList.remove('show');
  if(_dcTrapRelease){_dcTrapRelease();_dcTrapRelease=null;}
  sessionStorage.setItem('dc_dismissed','1');
  if(start)setTimeout(startDailyChallenge,300);
}
function startDailyChallenge(){
  try{
    const dc=_dcCache||getDailyChallenge();
    if(!dc||dc.done)return;
    const vak=getVK().find(v=>v.id===dc.vakId);
    if(!vak){_dcCache=null;localStorage.removeItem(_dcLevelKey());renderDailyChallenge();showToast('Uitdaging vernieuwd — probeer opnieuw!','#f97316');return;}
    const domein=vak.domeinen.find(d=>d.id===dc.domeinId);
    if(!domein||!domein.sv||!domein.sv.length){_dcCache=null;localStorage.removeItem(_dcLevelKey());renderDailyChallenge();showToast('Uitdaging vernieuwd — probeer opnieuw!','#f97316');return;}
    ST.vak=vak;ST.domein=domein;ST.isDailyChallenge=true;
    startQ('snel');
  }catch(err){
    console.error('[DC]',err);
    showToast('Kon quiz niet starten: '+err.message,'#ef4444');
  }
}

// ═══════ STREAK & BADGES ═══════
function getStreak(){
  try{return JSON.parse(localStorage.getItem('examenapp_streak')||'{}');}
  catch(e){return {};}
}
function recordPractice(){
  const s=getStreak();
  const today=new Date().toISOString().slice(0,10);
  if(!s.days)s.days=[];
  if(!s.days.includes(today))s.days.push(today);
  // Keep only last 60 days
  const cutoff=new Date();cutoff.setDate(cutoff.getDate()-60);
  s.days=s.days.filter(d=>new Date(d)>=cutoff);
  if(!s.totalQuizzes)s.totalQuizzes=0;
  s.totalQuizzes++;
  cloudSet('streak',s);
  // Quiz count badges
  try{checkQuizCountAch(s.totalQuizzes);}catch(e){}
  // Vak badges
  try{checkVakkenAch();}catch(e){}
}
function calcStreak(){
  const s=getStreak();
  if(!s.days||!s.days.length)return {current:0,longest:0,total:s.totalQuizzes||0,days:[]};
  const sorted=[...s.days].sort().reverse();
  let current=0;
  const today=new Date();today.setHours(0,0,0,0);
  const check=new Date(today);
  // Check if practiced today or yesterday to start streak
  const todayStr=today.toISOString().slice(0,10);
  const yesterday=new Date(today);yesterday.setDate(yesterday.getDate()-1);
  const yestStr=yesterday.toISOString().slice(0,10);
  if(!sorted.includes(todayStr)&&!sorted.includes(yestStr))return {current:0,longest:0,total:s.totalQuizzes||0,days:s.days};
  if(!sorted.includes(todayStr))check.setDate(check.getDate()-1);
  for(let i=0;i<60;i++){
    const d=new Date(check);d.setDate(d.getDate()-i);
    if(sorted.includes(d.toISOString().slice(0,10)))current++;
    else break;
  }
  return {current,total:s.totalQuizzes||0,days:s.days};
}
function startStreakQuiz(){
  // Open a random subject from mijn vakken, or scroll to the vakgrid
  const mijn=JSON.parse(localStorage.getItem('examenapp_'+lvlCol('mijnvakken'))||'[]');
  if(mijn.length>0){
    const id=mijn[Math.floor(Math.random()*mijn.length)];
    openVak(id);
    return;
  }
  // Fallback: scroll to vakgrid and highlight it
  const grid=document.getElementById('vakgrid');
  if(grid){
    grid.scrollIntoView({behavior:'smooth',block:'start'});
    grid.style.transition='box-shadow 0.3s';
    grid.style.boxShadow='0 0 0 3px var(--or), 0 0 24px rgba(var(--or-rgb),.3)';
    setTimeout(()=>{grid.style.boxShadow='';},1600);
  }
}
function quickOefen(){
  // If we know the user's current vak, jump straight to quiz mode
  if(ST.vak){
    const dom=ST.domein||ST.vak.domeinen[0];
    openQmode(dom?dom.id:'');
    return;
  }
  // If user has chosen vakken, open one of them
  const mijn=JSON.parse(localStorage.getItem('examenapp_'+lvlCol('mijnvakken'))||'[]');
  if(mijn.length>0){
    const id=mijn[Math.floor(Math.random()*mijn.length)];
    openVak(id);
    return;
  }
  // Fallback: go home and highlight the vakkengrid
  show('sc-home');
  setTimeout(()=>{
    const grid=document.getElementById('vakgrid');
    if(grid){
      grid.scrollIntoView({behavior:'smooth',block:'start'});
      grid.style.transition='box-shadow 0.35s';
      grid.style.boxShadow='0 0 0 3px var(--or),0 0 24px rgba(var(--or-rgb),.3)';
      setTimeout(()=>{grid.style.boxShadow='';},1600);
    }
  },120);
}
function renderStreak(){
  const box=document.getElementById('streak-home');
  const info=calcStreak();
  if(info.total===0){
    // Toon motiverende streak-start kaart voor nieuwe gebruikers
    box.innerHTML=`<div class="streak-card" style="opacity:.7">
      <div class="streak-top">
        <div class="streak-headline">📚 Bouw je streak op!</div>
        <div class="streak-tagline">Oefen elke dag en verdien badges — begin vandaag.</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        ${['zo','ma','di','wo','do','vr','za'].map(d=>`<div style="flex:1;text-align:center"><div style="height:22px;border-radius:6px;background:var(--bo2);margin-bottom:4px"></div><div style="font-size:10px;color:var(--mu)">${d}</div></div>`).join('')}
      </div>
    </div>`;
    return;
  }
  // 7-day grid
  const dayLabels=['zo','ma','di','wo','do','vr','za'];
  let weekHtml='';
  for(let i=6;i>=0;i--){
    const d=new Date();d.setDate(d.getDate()-i);
    const ds=d.toISOString().slice(0,10);
    const isActive=info.days.includes(ds);
    const isToday=i===0;
    let pipClass='streak-day-pip';
    if(isActive){pipClass+=' active';if(isToday)pipClass+=' is-today';}
    else if(isToday)pipClass+=' today-empty';
    const nameClass='streak-day-name'+(isActive?' act':'');
    weekHtml+=`<div class="streak-day-cell">
      <div class="${pipClass}">${isActive?'✓':''}</div>
      <div class="${nameClass}">${dayLabels[d.getDay()]}</div>
    </div>`;
  }
  // Streak milestone achievements (eenmalig)
  if(info.total>=1&&earnAch('streak1'))setTimeout(()=>showAch('🌱','Eerste dag geoefend!'),400);
  if(info.current>=3&&earnAch('streak3'))setTimeout(()=>showAch('🔥','3 dagen op rij — op dreef!'),400);
  if(info.current>=7&&earnAch('streak7'))setTimeout(()=>showAch('⚡','7 dagen op rij — geweldig!'),400);
  if(info.current>=14&&earnAch('streak14'))setTimeout(()=>showAch('💎','14 dagen streak — twee weken!'),400);
  if(info.current>=30&&earnAch('streak30'))setTimeout(()=>showAch('🔮','30 dagen streak — ongelooflijk!',175),600);
  if(info.current>=100&&earnAch('streak100'))setTimeout(()=>showAch('👑','100 dagen — Slagio Legende!',220),800);
  if(info.current>=200&&earnAch('streak200'))setTimeout(()=>showAch('🌌','200 dagen — Onsterfelijk!',265),1000);
  if(info.current>=300&&earnAch('streak300'))setTimeout(()=>showAch('⚜️','300 dagen — Grootmeester!',310),1200);
  if(info.current>=365&&earnAch('streak365'))setTimeout(()=>showAch('🪐','365 dagen — Een heel jaar op rij!',355),1400);
  // Badges (streak + quizzen categorieën)
  const ach=getAchieved();
  const badgeDefs=ALL_BADGES.filter(b=>b.cat==='Streak'||b.cat==='Quizzen');
  let badgeHtml='';
  badgeDefs.forEach(b=>{
    const isEarned=!!ach[b.id];
    badgeHtml+=`<div class="badge-tooltip badge ${isEarned?'earned':'unearned'}" data-tip="${b.tip}">${b.emoji}</div>`;
  });
  // Headline
  const todayStr=new Date().toISOString().slice(0,10);
  const practicedToday=info.days.includes(todayStr);
  const fireEmoji=info.current>=365?'🪐':info.current>=300?'⚜️':info.current>=200?'🌌':info.current>=100?'👑':info.current>=30?'🔮':info.current>=14?'💎':info.current>=7?'⚡':info.current>=3?'🔥':'📚';
  const headline=info.current>0
    ?`${info.current} dag${info.current>1?'en':''} op rij!`
    :'Start vandaag je streak!';
  const tagline=info.current>=365?'🪐 Een heel jaar! Jij bent een absolute legende.'
    :info.current>=300?'⚜️ 300 dagen — Grootmeester van Slagio!'
    :info.current>=200?'🌌 200 dagen — Onsterfelijk!'
    :info.current>=100?'👑 Legendarisch — jij bent een Slagio Legende!'
    :info.current>=30?'🔮 Ongelooflijk! 30 dagen op rij!'
    :info.current>=7?'Je bent op dreef, ga zo door! 💪'
    :info.current>=3?'Geweldig, blijf volhouden!'
    :info.current>0?'Kom morgen terug om je streak te verlengen.'
    :'Maak een quiz en bouw je streak op.';
  // Longest streak stat
  const s=getStreak();
  const longest=s.longestStreak||info.current;
  box.innerHTML=`<div class="streak-card">
    <div class="streak-top">
      <div class="streak-flame-wrap">
        <div class="streak-flame-big">${fireEmoji}</div>
        <div class="streak-count-num">${info.current}</div>
        <div class="streak-count-lbl">dagen</div>
      </div>
      <div class="streak-meta">
        <div class="streak-headline">${headline}</div>
        <div class="streak-tagline">${tagline}</div>
        <div class="streak-stats">
          <div class="streak-stat">
            <div class="streak-stat-num">${info.total}</div>
            <div class="streak-stat-lbl">quizzen</div>
          </div>
          <div class="streak-stat">
            <div class="streak-stat-num">${longest}</div>
            <div class="streak-stat-lbl">record</div>
          </div>
        </div>
      </div>
    </div>
    <div class="streak-week">${weekHtml}</div>
    <div class="streak-divider"></div>
    <div class="streak-badges-row">${badgeHtml}</div>
    ${!practicedToday?`<button class="streak-cta" onclick="startStreakQuiz()">🎯 Oefen vandaag — verleng je streak!</button>`:''}
  </div>`;
  // Update longest streak
  if(info.current>longest){s.longestStreak=info.current;cloudSet('streak',s);}
  // Feature 1: streak milestone banner (rendered separately above streak card)
  try{renderStreakMilestoneBanner(info.current);}catch(e){}
}

// ═══════ FEATURE 1: STREAK MILESTONE BANNER ═══════
function getNextStreakMilestone(currentStreak){
  const milestones=[7,14,30,100,200,300,365];
  for(const m of milestones){if(currentStreak<m)return m;}
  return null;
}
function renderStreakMilestoneBanner(currentStreak){
  const el=document.getElementById('streak-milestone-banner-home');
  if(!el)return;
  const nextMilestone=getNextStreakMilestone(currentStreak);
  if(!nextMilestone){el.innerHTML='';return;}
  const daysLeft=nextMilestone-currentStreak;
  if(daysLeft>7||daysLeft<=0){el.innerHTML='';return;}
  const badgeMap={7:{emoji:'⚡',naam:'Een week'},14:{emoji:'💎',naam:'Twee weken'},30:{emoji:'🔮',naam:'Een maand'},100:{emoji:'👑',naam:'Legende'},200:{emoji:'🌌',naam:'Onsterfelijk'},300:{emoji:'⚜️',naam:'Grootmeester'},365:{emoji:'🪐',naam:'Heel het jaar'}};
  const badge=badgeMap[nextMilestone]||{emoji:'🏅',naam:nextMilestone+' dagen'};
  const fillPct=Math.round(Math.min(99,currentStreak/nextMilestone*100));
  el.innerHTML=`<div class="streak-milestone-banner">
    <div class="smb-row">
      <div class="smb-icon">🔥</div>
      <div class="smb-text">Nog <strong>${daysLeft} dag${daysLeft>1?'en':''}</strong> tot je ${badge.emoji} <strong>${badge.naam}</strong> badge! Oefen vandaag voor dag ${currentStreak+1}.</div>
    </div>
    <div class="smb-bar-wrap"><div class="smb-bar-fill" style="width:${fillPct}%"></div></div>
    <div class="smb-bar-lbl">${currentStreak} / ${nextMilestone} dagen</div>
  </div>`;
}

// ═══════ FEATURE 2: PERSONAL BEST (PB) TRACKING ═══════
const PB_KEY='slagio_pb_v1';
function getPBs(){try{return JSON.parse(localStorage.getItem(PB_KEY)||'{}');}catch(e){return{};}}
function savePB(vakId,domeinId,score){
  const pbs=getPBs();
  const key=vakId+'_'+domeinId;
  const prev=pbs[key];
  if(!prev||score>prev.score){
    pbs[key]={score,date:new Date().toISOString().slice(0,10)};
    localStorage.setItem(PB_KEY,JSON.stringify(pbs));
    return {isNew:true,prev:prev||null};
  }
  return {isNew:false,prev:prev||null};
}
function getPB(vakId,domeinId){
  const pbs=getPBs();
  return pbs[vakId+'_'+domeinId]||null;
}

// ═══════ FEATURE 3: SMART NEXT ACTION ═══════
function getSmartNextAction(vakId,domeinId,score){
  if(score<0.5){
    return {type:'retry',label:'Nog een keer proberen',sub:'Je score is onder 50% — herhaling helpt!',icon:'🔄'};
  }
  const vak=getVK().find(v=>v.id===vakId);
  if(!vak)return null;
  let worstDom=null,worstPct=1;
  vak.domeinen.forEach(d=>{
    if(d.id===domeinId)return;
    const r=getDomeinBestPct(vakId,d.id);
    if(r.hasData&&r.pct<worstPct){worstPct=r.pct;worstDom=d;}
    if(!r.hasData&&!worstDom)worstDom=d;
  });
  if(worstDom){
    const wr=getDomeinBestPct(vakId,worstDom.id);
    if(!wr.hasData||worstPct<0.65){
      return {type:'domain',domeinId:worstDom.id,label:worstDom.naam,sub:wr.hasData?`Score: ${Math.round(worstPct*100)}% — kan beter!`:'Nog niet geoefend',icon:'⚡'};
    }
  }
  return {type:'simtoets',label:'Simulatietoets',sub:'Alle domeinen ≥65% — test jezelf met een volledig examen!',icon:'🎯'};
}

// ═══════ FEATURE 4: COMEBACK CARD ═══════
function renderComebackCard(){
  const el=document.getElementById('comeback-card-home');
  if(!el)return;
  const dismissed=sessionStorage.getItem('slagio_comeback_dismissed');
  if(dismissed){el.innerHTML='';return;}
  const sd=getStreak();
  if(!sd)return;
  const today=new Date().toISOString().slice(0,10);
  const days=(sd.days||[]).slice().sort();
  if(days.length<2)return;
  const lastDay=days[days.length-1];
  const prevDay=days[days.length-2];
  if(lastDay!==today)return;
  const msGap=new Date(today)-new Date(prevDay);
  const dayGap=Math.round(msGap/86400000);
  if(dayGap<2)return;
  checkComebackAch(dayGap);
  const cbClose=document.createElement('button');
  cbClose.className='comeback-close';
  cbClose.textContent='✕';
  cbClose.addEventListener('click',()=>{sessionStorage.setItem('slagio_comeback_dismissed','1');el.querySelector('.comeback-card')?.remove();});
  const cbAct=document.createElement('button');
  cbAct.className='comeback-action';
  cbAct.textContent='📅 Bekijk je studieplan →';
  cbAct.addEventListener('click',()=>{show('sc-schedule');renderStudieplan();});
  const card=document.createElement('div');
  card.className='comeback-card';
  card.innerHTML=`<div class="comeback-icon">💪</div><div class="comeback-title">Welkom terug!</div><div class="comeback-sub">Je was ${dayGap} dag${dayGap>1?'en':''} weg — maar je bent er weer! Bouw je streak opnieuw op. Elke dag telt.</div><div class="comeback-xp">🎁 +50 XP comeback bonus</div>`;
  card.prepend(cbClose);
  card.appendChild(cbAct);
  el.innerHTML='';
  el.appendChild(card);
  if(!sessionStorage.getItem('slagio_comeback_xp')){
    try{addXP(50);}catch(e){}
    sessionStorage.setItem('slagio_comeback_xp','1');
    try{showXPToast(50);}catch(e){}
  }
}

const FEAT_DISC_KEY='slagio_feat_disc_v1';
const FEAT_HINTS=[
  {icon:'📅',title:'Persoonlijk studieplan',sub:'Slagio maakt automatisch een dagplanning tot je examendatum. Weet precies wat je wanneer moet oefenen.',act:'📅 Open studieplan',fn:()=>{show('sc-schedule');renderStudieplan();}},
  {icon:'🏁',title:'Bot Race',sub:'Race tegen AI-tegenstanders over 15 vragen. Kies je vak en een moeilijkheidsgraad — en ga!',act:'🏁 Probeer Bot Race',fn:()=>show('sc-race')},
  {icon:'📊',title:'Voortgangsrapport',sub:'Bekijk jouw score per vak en domein, aankomende examens en je zwakke punten in één overzicht.',act:'📊 Bekijk rapport',fn:()=>openRapport()},
];
function renderFeatDisc(){
  const el=document.getElementById('feat-disc-home');
  if(!el)return;
  const dismissed=localStorage.getItem(FEAT_DISC_KEY);
  if(dismissed)return;
  const sd=getStreak();
  if(!sd||!(sd.totalQuizzes>=1||sd.days?.length>=1))return;
  const seen=JSON.parse(sessionStorage.getItem('slagio_feat_disc_seen')||'[]');
  const hint=FEAT_HINTS.find(h=>!seen.includes(h.title))||null;
  if(!hint){el.innerHTML='';return;}
  seen.push(hint.title);
  sessionStorage.setItem('slagio_feat_disc_seen',JSON.stringify(seen));
  const card=document.createElement('div');
  card.className='feat-disc-card';
  const closeBtn=document.createElement('button');
  closeBtn.className='feat-disc-close';closeBtn.textContent='✕';
  closeBtn.addEventListener('click',()=>{localStorage.setItem(FEAT_DISC_KEY,'1');el.innerHTML='';});
  const actBtn=document.createElement('button');
  actBtn.className='feat-disc-btn';actBtn.textContent=hint.act;
  actBtn.addEventListener('click',()=>{localStorage.setItem(FEAT_DISC_KEY,'1');el.innerHTML='';try{hint.fn();}catch(e){}});
  card.innerHTML=`<div class="feat-disc-icon">${hint.icon}</div><div class="feat-disc-body"><div class="feat-disc-title">Wist je dit? ${hint.title}</div><div class="feat-disc-sub">${hint.sub}</div></div>`;
  card.appendChild(actBtn);
  card.appendChild(closeBtn);
  el.innerHTML='';
  el.appendChild(card);
}

// ═══════ REVIEW ═══════
function openReview(){
  document.getElementById('review-sub').textContent=`${ST.vak.naam} · Domein ${ST.domein.id}: ${ST.domein.naam} · ${ST.mode==='snel'?'Snelle Quiz':'Oud-examen'}`;
  // Bouw de volledige HTML in één keer (geen innerHTML+= per stap)
  let html='';
  ST.vragen.forEach((q,i)=>{
    const a=ST.antwrd[i];
    if(!a)return;
    let statusClass,statusText;
    if(a.pts===1){statusClass='rc-ok';statusText='✓ Goed';}
    else if(a.pts===0.5){statusClass='rc-half';statusText='~ Deels';}
    else{statusClass='rc-wrong';statusText='✗ Fout';}
    let answerHtml='';
    if(ST.mode==='snel'){
      const correctAns=q.o[q.c];
      // Toon jouw antwoord alleen als het fout was (niet nodig bij goed)
      if(a.pts!==1&&a.chosenText&&a.chosenText!=='⏱ Tijd was op'){
        answerHtml+=`<div class="rc-answer rc-answer-wrong"><span class="rc-answer-lbl">Jouw antwoord</span> ${a.chosenText}</div>`;
      }
      if(a.chosenText==='⏱ Tijd was op'){
        answerHtml+=`<div class="rc-answer" style="color:#F87171">⏱ Tijd was op</div>`;
      }
      answerHtml+=`<div class="rc-answer rc-answer-correct"><span class="rc-answer-lbl">Juist antwoord</span> ${correctAns}</div>`;
      // Uitleg (toelichting) alleen als aanwezig
      if(q.u)answerHtml+=`<div class="rc-explanation"><span class="rc-expl-icon">💡</span>${q.u}</div>`;
    } else {
      if(a.userText)answerHtml+=`<div class="rc-answer"><span class="rc-answer-lbl">Jouw antwoord</span> ${a.userText}</div>`;
      if(q.u)answerHtml+=`<div class="rc-explanation"><span class="rc-expl-icon">📋</span>${q.u}</div>`;
    }
    const ctxHtml=q.ctx?`<div class="rc-ctx">${q.ctx.substring(0,250)+(q.ctx.length>250?'…':'')}</div>`:'';
    html+=`<div class="review-card ${statusClass}-card">
      <div class="rc-head"><span class="rc-num">Vraag ${i+1}${ST.flagged&&ST.flagged.has(i)?'<span class="rc-flag">🚩 Herhalen</span>':''}</span><span class="rc-status ${statusClass}">${statusText}</span></div>
      <div class="rc-q">${q.v}</div>
      ${ctxHtml}
      ${answerHtml}
    </div>`;
  });
  document.getElementById('review-list').innerHTML=html;
  show('sc-review');
}

// ═══════ EXAM SCHEDULE ═══════
const EXAM_SCHEDULE=[
// ── HAVO CSE 1e tijdvak 2026 ──
{datum:'2026-05-08',tijd:'09:00–12:00',vak:'Filosofie',duur:'3 uur',niveau:'havo'},
{datum:'2026-05-08',tijd:'13:30–16:30',vak:'Nederlands',duur:'3 uur',niveau:'havo',vakId:'nl'},
{datum:'2026-05-11',tijd:'09:00–12:00',vak:'Kunst (algemeen)',duur:'3 uur',niveau:'havo'},
{datum:'2026-05-11',tijd:'13:30–16:30',vak:'Economie',duur:'3 uur',niveau:'havo',vakId:'ec'},
{datum:'2026-05-12',tijd:'09:00–12:00',vak:'Geschiedenis',duur:'3 uur',niveau:'havo',vakId:'gs'},
{datum:'2026-05-12',tijd:'13:30–16:30',vak:'Scheikunde',duur:'3 uur',niveau:'havo',vakId:'sk'},
{datum:'2026-05-13',tijd:'13:30–16:00',vak:'Frans',duur:'2,5 uur',niveau:'havo'},
{datum:'2026-05-18',tijd:'09:00–12:00',vak:'Maatschappijwetenschappen',duur:'3 uur',niveau:'havo',vakId:'mw'},
{datum:'2026-05-18',tijd:'13:30–16:00',vak:'Engels',duur:'2,5 uur',niveau:'havo',vakId:'en'},
{datum:'2026-05-19',tijd:'09:00–11:30',vak:'Muziek',duur:'2,5 uur',niveau:'havo'},
{datum:'2026-05-19',tijd:'13:30–16:30',vak:'Wiskunde A / Wiskunde B',duur:'3 uur',niveau:'havo',vakId:'wa'},
{datum:'2026-05-20',tijd:'09:00–11:30',vak:'Duits',duur:'2,5 uur',niveau:'havo'},
{datum:'2026-05-20',tijd:'13:30–16:30',vak:'Biologie',duur:'3 uur',niveau:'havo',vakId:'bi'},
{datum:'2026-05-21',tijd:'09:00–11:30',vak:'Tekenen/Handvaardigheid',duur:'2,5 uur',niveau:'havo'},
{datum:'2026-05-21',tijd:'13:30–16:30',vak:'Aardrijkskunde',duur:'3 uur',niveau:'havo',vakId:'ak'},
{datum:'2026-05-22',tijd:'13:30–16:30',vak:'Bedrijfseconomie',duur:'3 uur',niveau:'havo',vakId:'be'},
{datum:'2026-05-26',tijd:'13:30–16:30',vak:'Natuurkunde',duur:'3 uur',niveau:'havo',vakId:'na'},
{datum:'2026-05-27',tijd:'09:00–11:30',vak:'Fries / Russisch',duur:'2,5 uur',niveau:'havo'},
{datum:'2026-05-27',tijd:'13:30–16:00',vak:'Arabisch / Spaans / Turks',duur:'2,5 uur',niveau:'havo'},
// ── VWO CSE 1e tijdvak 2026 ──
{datum:'2026-05-08',tijd:'09:00–12:00',vak:'Kunst (algemeen)',duur:'3 uur',niveau:'vwo'},
{datum:'2026-05-08',tijd:'13:30–16:30',vak:'Bedrijfseconomie',duur:'3 uur',niveau:'vwo'},
{datum:'2026-05-11',tijd:'09:00–12:00',vak:'Geschiedenis',duur:'3 uur',niveau:'vwo',vakId:'gs'},
{datum:'2026-05-11',tijd:'13:30–16:30',vak:'Natuurkunde',duur:'3 uur',niveau:'vwo',vakId:'na'},
{datum:'2026-05-12',tijd:'09:00–11:30',vak:'Tekenen/Handvaardigheid',duur:'2,5 uur',niveau:'vwo'},
{datum:'2026-05-12',tijd:'13:30–16:30',vak:'Nederlands',duur:'3 uur',niveau:'vwo',vakId:'nl'},
{datum:'2026-05-13',tijd:'09:00–12:00',vak:'Filosofie',duur:'3 uur',niveau:'vwo'},
{datum:'2026-05-13',tijd:'13:30–16:30',vak:'Wiskunde A',duur:'3 uur',niveau:'vwo',vakId:'wa'},
{datum:'2026-05-13',tijd:'13:30–16:30',vak:'Wiskunde B',duur:'3 uur',niveau:'vwo',vakId:'wb'},
{datum:'2026-05-18',tijd:'09:00–11:30',vak:'Duits',duur:'2,5 uur',niveau:'vwo',vakId:'du'},
{datum:'2026-05-18',tijd:'13:30–16:30',vak:'Aardrijkskunde',duur:'3 uur',niveau:'vwo',vakId:'ak'},
{datum:'2026-05-19',tijd:'09:00–12:00',vak:'Latijnse taal en cultuur',duur:'3 uur',niveau:'vwo',vakId:'la'},
{datum:'2026-05-19',tijd:'13:30–16:30',vak:'Scheikunde',duur:'3 uur',niveau:'vwo',vakId:'sk'},
{datum:'2026-05-20',tijd:'09:00–12:00',vak:'Maatschappijwetenschappen',duur:'3 uur',niveau:'vwo',vakId:'mw'},
{datum:'2026-05-20',tijd:'13:30–16:00',vak:'Engels',duur:'2,5 uur',niveau:'vwo',vakId:'en'},
{datum:'2026-05-21',tijd:'09:00–11:30',vak:'Muziek',duur:'2,5 uur',niveau:'vwo'},
{datum:'2026-05-21',tijd:'13:30–16:30',vak:'Economie',duur:'3 uur',niveau:'vwo',vakId:'ec'},
{datum:'2026-05-22',tijd:'09:00–12:00',vak:'Griekse taal en cultuur',duur:'3 uur',niveau:'vwo',vakId:'gr'},
{datum:'2026-05-22',tijd:'13:30–16:30',vak:'Biologie',duur:'3 uur',niveau:'vwo',vakId:'bi'},
{datum:'2026-05-26',tijd:'13:30–16:00',vak:'Frans',duur:'2,5 uur',niveau:'vwo',vakId:'fr'},
{datum:'2026-05-27',tijd:'09:00–11:30',vak:'Fries / Russisch',duur:'2,5 uur',niveau:'vwo'},
{datum:'2026-05-27',tijd:'13:30–16:00',vak:'Arabisch / Spaans / Turks',duur:'2,5 uur',niveau:'vwo'}
];
function getMijnVakken(){try{const d=JSON.parse(localStorage.getItem('examenapp_'+lvlCol('mijnvakken'))||'[]');return Array.isArray(d)?d:(d.list||[]);}catch(e){return [];}}
function setMijnVakken(arr){cloudSet(lvlCol('mijnvakken'),{list:arr});try{pushSyncBundle();}catch(e){}}
function renderSchedule(){
  const list=document.getElementById('schedule-list');
  const onlyMine=document.getElementById('sch-filter-mine').checked;
  const mijn=getMijnVakken();
  list.innerHTML='';
  const now=new Date();
  const dagNamen=['zo','ma','di','wo','do','vr','za'];
  const maandNamen=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  // Dynamische header
  const hdr=document.getElementById('sch-header');
  if(hdr)hdr.textContent='Examenrooster '+APP_LEVEL.toUpperCase()+' 2026';
  // Vakken van huidig niveau
  const niveauVakIds=new Set(getVK().map(v=>v.id));
  EXAM_SCHEDULE.forEach(ex=>{
    // Verberg als item bij een specifiek ander niveau hoort
    if(ex.niveau&&ex.niveau!==APP_LEVEL)return;
    if(ex.vakId&&!niveauVakIds.has(ex.vakId))return;
    if(onlyMine&&!mijn.includes(ex.vakId||ex.vak))return;
    const d=new Date(ex.datum+'T'+ex.tijd.split('–')[0]+':00+02:00');
    const diff=d-now;
    let cdText='';
    if(diff<=0)cdText='Afgelopen';
    else{const dd=Math.floor(diff/(1000*60*60*24));const hh=Math.floor((diff%(1000*60*60*24))/(1000*60*60));cdText=dd>0?dd+'d '+hh+'u':'< '+hh+' uur';}
    const isMine=mijn.includes(ex.vakId||ex.vak);
    const dagNaam=dagNamen[d.getDay()];
    const datumStr=dagNaam+' '+d.getDate()+' '+maandNamen[d.getMonth()];
    list.innerHTML+=`<div class="sch-card${isMine?' sch-mine':''}">
      <input type="checkbox" class="sch-check" ${isMine?'checked':''} onchange="toggleMijnVak('${ex.vakId||ex.vak}',this.checked)">
      <div class="sch-date">${datumStr}</div>
      <div class="sch-time">${ex.tijd}</div>
      <div class="sch-name">${ex.vak}</div>
      <div class="sch-dur">${ex.duur}</div>
      <div class="sch-cd">${cdText}</div>
    </div>`;
  });
}
function toggleMijnVak(id,checked){
  let m=getMijnVakken();
  if(checked&&!m.includes(id))m.push(id);
  if(!checked)m=m.filter(v=>v!==id);
  setMijnVakken(m);
  renderSchedule();
  updateCountdown(); // refresh timer to reflect new vak selection
}
// Start countdown now that EXAM_SCHEDULE is defined
updateCountdown();
if(!window._cdTimer)window._cdTimer=setInterval(updateCountdown,1000);

// ═══════ GRADE CALCULATORS ═══════
function switchCalc(id){
  document.querySelectorAll('.calc-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.calc-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('calc-'+id).classList.add('active');
  event.target.classList.add('active');
  if(id==='slaag')buildSlaagInputs();
  if(id==='eind'){buildEindVakSelect();}
  if(id==='nterm'){buildNtermVakSelect();}
  if(id==='herk'){buildHerkSelect();const firstId=document.getElementById('herk-vak')?.value;if(firstId)buildHerkSERow(firstId);}
  if(id==='plan'){buildActiePlan();}
}
function buildActiePlan(){
  const el=document.getElementById('actieplan-content');
  if(!el)return;
  const cijfers=getSavedCijfers();
  const vakken=getVK();
  const metCijfer=vakken.filter(v=>cijfers[v.id]!=null);
  const hasQuizData=vakken.some(v=>getVakBestPct(v.id).hasData);
  if(metCijfer.length===0&&!hasQuizData){
    el.innerHTML=`<p class="ap-empty">Voer je SE-cijfers in en maak een paar quizzen om je actieplan te zien.</p>`;
    return;
  }
  const mustBetter=[],canBetter=[],onTrack=[];
  vakken.forEach(v=>{
    const c=cijfers[v.id];
    const quiz=getVakBestPct(v.id);
    const seScore=c!=null?c:null;
    const quizPct=quiz.hasData?quiz.pct:null;
    if(seScore!=null||quizPct!=null){
      const isMust=(seScore!=null&&seScore<6)||(quizPct!=null&&quizPct<0.5);
      const isCan=!isMust&&((seScore!=null&&seScore<7)||(quizPct!=null&&quizPct<0.65));
      if(isMust)mustBetter.push({v,seScore,quizPct,quiz});
      else if(isCan)canBetter.push({v,seScore,quizPct,quiz});
      else onTrack.push({v,seScore,quizPct,quiz});
    }
  });
  function renderItem({v,seScore,quizPct,quiz}){
    // Find weakest domain
    let weakestDomein=null;let weakestPct=2;
    v.domeinen.forEach(d=>{
      const dr=getDomeinBestPct(v.id,d.id);
      if(dr.hasData&&dr.pct<weakestPct){weakestPct=dr.pct;weakestDomein=d;}
    });
    const detailParts=[];
    if(seScore!=null)detailParts.push(`SE: ${seScore.toFixed(1).replace('.',',')}`);
    if(quizPct!=null)detailParts.push(`Quiz: ${Math.round(quizPct*100)}%`);
    if(weakestDomein)detailParts.push(`Zwakste domein: ${weakestDomein.naam}`);
    return `<div class="ap-item">
      <div class="ap-dot" style="background:${v.kleur}"></div>
      <div class="ap-info"><div class="ap-naam">${v.naam}</div><div class="ap-detail">${detailParts.join(' · ')}</div></div>
      <button class="ap-btn" onclick="openVak('${v.id}')">Oefen →</button>
    </div>`;
  }
  function renderSection(emoji,title,items,showItems){
    if(items.length===0)return'';
    const itemsHtml=showItems?items.map(renderItem).join(''):'';
    return `<div class="ap-section">
      <div class="ap-section-head">${emoji} ${title}</div>
      ${itemsHtml}
    </div>`;
  }
  const slaagLink=`<div class="ap-slaag-link" onclick="document.querySelectorAll('.calc-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.calc-panel').forEach(p=>p.classList.remove('active'));document.getElementById('calc-slaag').classList.add('active');document.querySelectorAll('.calc-tab')[0].classList.add('active');buildSlaagInputs()">📊 Bereken slagingskans →</div>`;
  el.innerHTML=`<h3 style="font-size:16px;font-weight:800;margin-bottom:16px">Jouw persoonlijke studieplan</h3>
    ${renderSection('🔴','Moet beter',mustBetter,true)}
    ${renderSection('🟠','Kan beter',canBetter,true)}
    ${renderSection('🟢','Goed op koers',onTrack,false)}
    ${mustBetter.length===0&&canBetter.length===0&&onTrack.length===0?'<p class="ap-empty">Voer je SE-cijfers in en maak een paar quizzen om je actieplan te zien.</p>':''}
    ${slaagLink}`;
}
function buildSlaagInputs(){
  const box=document.getElementById('slaag-inputs');
  const saved=getSavedCijfers();
  const hasSaved=Object.keys(saved).length>0;
  box.innerHTML=hasSaved?'<div class="calc-prefill-note">✓ SE-cijfers automatisch ingevuld vanuit je opgeslagen cijfers</div>':'';
  box.innerHTML+=`<div style="font-size:11px;color:var(--mu);margin-bottom:8px;display:flex;gap:10px"><span style="flex:1">Vak</span><span style="width:70px;text-align:center">SE</span><span style="width:70px;text-align:center">CE</span></div>`;
  getVK().forEach(v=>{
    const seVal=saved[v.id]!=null?saved[v.id]:'';
    box.innerHTML+=`<div class="calc-row"><span class="calc-label">${v.naam} <span style="color:var(--mu);font-size:10px">(${v.code})</span></span><input type="number" class="calc-input slaag-se" data-vak="${v.code}" min="1" max="10" step="0.1" placeholder="—" value="${seVal}"><input type="number" class="calc-input slaag-ce" data-vak="${v.code}" min="1" max="10" step="0.1" placeholder="—"></div>`;
  });
}
function buildEindVakSelect(){
  const sel=document.getElementById('eind-vak');
  if(!sel||sel.options.length>1)return;
  getVK().forEach(v=>{sel.innerHTML+=`<option value="${v.id}">${v.naam}</option>`;});
}
function buildNtermVakSelect(){
  const sel=document.getElementById('nt-vak');
  if(!sel||sel.options.length>1)return;
  getVK().forEach(v=>{sel.innerHTML+=`<option value="${v.id}">${v.naam}</option>`;});
}
function prefillEindFromSaved(vakId){
  if(!vakId)return;
  const saved=getSavedCijfers();
  const inp=document.getElementById('eind-se');
  if(inp&&saved[vakId]!=null){inp.value=saved[vakId];}
}
function prefillNtermSE(vakId){
  if(!vakId)return;
  const saved=getSavedCijfers();
  const inp=document.getElementById('nt-se');
  if(inp&&saved[vakId]!=null){inp.value=saved[vakId];}
}
function buildHerkSERow(vakId){
  const row=document.getElementById('herk-se-row');
  if(!row)return;
  const saved=getSavedCijfers();
  const cij=vakId&&saved[vakId]!=null?saved[vakId]:null;
  row.innerHTML=`<div class="calc-row"><span class="calc-label">SE-cijfer</span><input type="number" id="herk-se" class="calc-input" min="1" max="10" step="0.1" placeholder="—" value="${cij!=null?cij:''}">${cij!=null?`<span style="font-size:11px;color:#22C55E;font-weight:600;white-space:nowrap">✓ opgeslagen</span>`:''}</div>`;
}
function berekenSlaag(){
  const seInputs=document.querySelectorAll('.slaag-se');
  const ceInputs=document.querySelectorAll('.slaag-ce');
  const profiel=document.getElementById('calc-profiel').value;
  let vakken=[];let ceTotal=0;let ceCount=0;
  seInputs.forEach((inp,i)=>{
    const se=parseFloat(inp.value);
    const ce=parseFloat(ceInputs[i].value);
    const code=inp.dataset.vak;
    if(!isNaN(se)&&!isNaN(ce)){
      const eind=Math.round((se+ce)/2);
      const ceRound=Math.round(ce*10)/10;
      vakken.push({code,se,ce:ceRound,eind});
      ceTotal+=ceRound;ceCount++;
    }
  });
  if(vakken.length<3){document.getElementById('slaag-result').innerHTML='<div class="calc-result"><p>Vul minimaal 3 vakken in.</p></div>';return;}
  const ceGem=ceTotal/ceCount;
  const kernvakken=profiel==='cm'?['NE','EN']:['NE','EN','WA','WB'];
  const kernGrades=vakken.filter(v=>kernvakken.includes(v.code));
  const kernOnder6=kernGrades.filter(v=>v.eind<6);
  let r1=ceGem>=5.5;
  let r2=kernOnder6.length<=1&&kernOnder6.every(v=>v.eind>=5);
  let allEind=vakken.map(v=>v.eind);
  let onder4=allEind.filter(e=>e<4).length;
  let vijven=allEind.filter(e=>e===5).length;
  let vieren=allEind.filter(e=>e===4).length;
  let eindGem=allEind.reduce((a,b)=>a+b,0)/allEind.length;
  let r3=true;
  if(onder4>0)r3=false;
  else if(vieren>=1&&vijven>=1)r3=eindGem>=6.0;
  else if(vijven>=3)r3=false;
  else if(vijven===2||vieren===1)r3=eindGem>=6.0;
  let geslaagd=r1&&r2&&r3;
  let cumLaude=false;
  if(geslaagd){
    const noBelow6=allEind.every(e=>e>=6);
    cumLaude=noBelow6&&eindGem>=8.0;
  }
  let icon=geslaagd?(cumLaude?'🎓':'🎉'):'😔';
  let title=geslaagd?(cumLaude?'Cum laude geslaagd!':'Geslaagd!'):'Gezakt';
  let color=geslaagd?'calc-pass':'calc-fail';
  let detail=`<div class="calc-detail">
    <div><span class="${r1?'ck':'cx'}">${r1?'✓':'✗'}</span> CE-gemiddelde: ${ceGem.toFixed(2)} ${r1?'≥':'<'} 5,50</div>
    <div><span class="${r2?'ck':'cx'}">${r2?'✓':'✗'}</span> Kernvakkenregel: ${kernOnder6.length} kernvak(ken) onder 6 ${profiel==='cm'?'(C&M: NE+EN)':'(NE+EN+WI)'}</div>
    <div><span class="${r3?'ck':'cx'}">${r3?'✓':'✗'}</span> Compensatie: ${onder4>0?'cijfer <4 gevonden':vijven+' vijf(ven), '+vieren+' vier(en)'}, gem ${eindGem.toFixed(1)}</div>
  </div>`;
  let tableHtml='<div style="margin-top:14px;font-size:12px"><table style="width:100%;border-collapse:collapse">';
  vakken.forEach(v=>{
    const col=v.eind<6?'color:#EF4444':'';
    tableHtml+=`<tr style="border-bottom:1px solid var(--bo)"><td style="padding:4px 0">${v.code}</td><td style="text-align:center">${v.se}</td><td style="text-align:center">${v.ce}</td><td style="text-align:center;font-weight:700;${col}">${v.eind}</td></tr>`;
  });
  tableHtml+='</table></div>';
  // Coaching: where is the most improvement possible?
  const allVakken=getVK();
  const coachVakken=vakken.filter(v=>v.eind<6||(v.ce<(Math.max(1,Math.min(10,11-v.se))))).sort((a,b)=>a.eind-b.eind).slice(0,3);
  let coachHtml='';
  if(coachVakken.length>0){
    const coachItems=coachVakken.map(cv=>{
      const vakObj=allVakken.find(v=>v.code===cv.code);
      const ceNodigVoor6=Math.max(1,Math.min(10,11-cv.se));
      const ceGap=Math.round((ceNodigVoor6-cv.ce)*10)/10;
      const gapTxt=ceGap>0?`CE ${ceGap.toFixed(1).replace('.',',')} punt omhoog → al voldoende`:`eindcijfer ${cv.eind}`;
      const oefenBtn=vakObj?`<button class="ap-btn" onclick="openVak('${vakObj.id}')">Oefen →</button>`:'';
      return `<div class="ap-item">
        <div class="ap-dot" style="background:${vakObj?vakObj.kleur:'#999'}"></div>
        <div class="ap-info"><div class="ap-naam">${cv.code}</div><div class="ap-detail">eindcijfer ${cv.eind} — ${gapTxt}</div></div>
        ${oefenBtn}
      </div>`;
    }).join('');
    coachHtml=`<div class="ap-section" style="margin-top:14px;border-top:1px solid var(--bo);padding-top:12px">
      <div class="ap-section-head">💡 Waar valt de meeste winst te halen?</div>
      ${coachItems}
    </div>`;
  }
  document.getElementById('slaag-result').innerHTML=`<div class="calc-result">
    <div class="calc-result-icon">${icon}</div>
    <h3 class="${color}">${title}</h3>
    <p>CE-gemiddelde: ${ceGem.toFixed(2)} · Eindcijfergemiddelde: ${eindGem.toFixed(1)}</p>
    ${detail}${tableHtml}${coachHtml}
  </div>`;
}
function berekenEind(){
  const se=parseFloat(document.getElementById('eind-se').value);
  const ce=parseFloat(document.getElementById('eind-ce').value);
  if(isNaN(se)||isNaN(ce)){document.getElementById('eind-result').innerHTML='<div class="calc-result"><p>Vul beide cijfers in.</p></div>';return;}
  const gem=(se+ce)/2;
  const eind=Math.round(gem);
  document.getElementById('eind-result').innerHTML=`<div class="calc-result">
    <div class="calc-result-icon">📊</div>
    <h3>${eind}</h3>
    <p>SE (${se}) + CE (${ce}) = ${gem.toFixed(2)} → afgerond: <strong>${eind}</strong></p>
  </div>`;
}
function berekenNterm(){
  const s=parseFloat(document.getElementById('nt-score').value);
  const l=parseFloat(document.getElementById('nt-max').value);
  const n=parseFloat(document.getElementById('nt-n').value);
  if(isNaN(s)||isNaN(l)||isNaN(n)){document.getElementById('nterm-result').innerHTML='<div class="calc-result"><p>Vul alle velden in.</p></div>';return;}
  const c=9*(s/l)+n;
  const cRound=Math.round(c*10)/10;
  const cFinal=Math.min(10,Math.max(1,cRound));
  document.getElementById('nterm-result').innerHTML=`<div class="calc-result">
    <div class="calc-result-icon">🧮</div>
    <h3>${cFinal}</h3>
    <p>C = 9 × (${s}/${l}) + ${n} = ${c.toFixed(2)} → afgerond: <strong>${cFinal}</strong></p>
    <p style="margin-top:8px;font-size:11px">Formule: C = 9 × (S/L) + N</p>
  </div>`;
}
function berekenBenodigdScore(){
  const se=parseFloat(document.getElementById('nt-se').value);
  const doel=parseFloat(document.getElementById('nt-doel').value||'6');
  const maxScore=parseFloat(document.getElementById('nt-max').value);
  const nterm=parseFloat(document.getElementById('nt-n').value);
  const res=document.getElementById('nterm-benodig-result');
  if(isNaN(se)){res.innerHTML='<div class="calc-result"><p>Vul je SE-cijfer in (of kies een vak).</p></div>';return;}
  if(isNaN(doel)||isNaN(maxScore)||isNaN(nterm)){res.innerHTML='<div class="calc-result"><p>Vul ook maximale score en N-term in (boven).</p></div>';return;}
  // CE nodig = 2*doel - se (voor eindcijfer = round((se+ce)/2) >= doel)
  const ceNodig=2*doel-se;
  if(ceNodig<=1){
    res.innerHTML=`<div class="calc-result"><div class="calc-result-icon">🎯</div><h3 class="calc-pass">Al op koers!</h3><p>Met SE ${se} heb je CE ≥ 1 nodig voor een ${doel}. Je bent al goed op koers!</p></div>`;
    return;
  }
  if(ceNodig>10){
    res.innerHTML=`<div class="calc-result"><div class="calc-result-icon">😔</div><h3 class="calc-fail">Helaas niet haalbaar</h3><p>Met SE ${se} is een eindcijfer van ${doel} wiskundig niet meer haalbaar (vereiste CE = ${ceNodig.toFixed(1)} > 10).</p></div>`;
    return;
  }
  // score nodig = (ceNodig - nterm) * max / 9
  const scoreNodig=Math.ceil(((ceNodig-nterm)*maxScore)/9);
  const scoreNodigClamp=Math.max(0,Math.min(maxScore,scoreNodig));
  const pct=Math.round((scoreNodigClamp/maxScore)*100);
  const barClr=pct<=60?'#22C55E':pct<=80?'#F59E0B':'#EF4444';
  res.innerHTML=`<div class="calc-result">
    <div class="calc-result-icon">🎯</div>
    <h3>${scoreNodigClamp} / ${maxScore} punten</h3>
    <p>Voor eindcijfer <strong>${doel}</strong> met SE <strong>${se}</strong> heb je CE ≥ <strong>${ceNodig.toFixed(1).replace('.',',')}</strong> nodig.</p>
    <p style="margin-top:6px">Op het examen: minimaal <strong>${scoreNodigClamp} van de ${maxScore} punten</strong> (${pct}%).</p>
    <div class="calc-result-bar" style="margin-top:10px"><span style="font-size:11px;color:var(--mu);min-width:16px">0</span><div class="calc-result-bar-track"><div class="calc-result-bar-fill" style="width:${pct}%;background:${barClr}"></div></div><span style="font-size:11px;color:var(--mu)">${maxScore}</span></div>
  </div>`;
}
function buildHerkSelect(){
  const sel=document.getElementById('herk-vak');
  if(sel.options.length>1)return;
  sel.innerHTML='';
  getVK().forEach(v=>{sel.innerHTML+=`<option value="${v.id}">${v.naam} (${v.code})</option>`;});
}
function berekenHerk(){
  const vakId=document.getElementById('herk-vak').value;
  const nieuwCe=parseFloat(document.getElementById('herk-ce').value);
  const seInp=document.getElementById('herk-se');
  const se=seInp?parseFloat(seInp.value):NaN;
  const res=document.getElementById('herk-result');
  if(isNaN(nieuwCe)){res.innerHTML='<div class="calc-result"><p>Vul een nieuw CE-cijfer in.</p></div>';return;}
  if(isNaN(se)){res.innerHTML='<div class="calc-result"><p>Vul je SE-cijfer in.</p></div>';return;}
  const vak=getVK().find(v=>v.id===vakId);
  const gem=(se+nieuwCe)/2;
  const eind=Math.round(gem);
  const kleur=eind>=6?'calc-pass':'calc-fail';
  const icon=eind>=6?'🎉':'😔';
  const ceVoldoende=Math.round(Math.max(1,Math.min(10,11-se))*10)/10;
  const barPct=Math.min(100,Math.round((eind/10)*100));
  const barClr=eind>=6?'#22C55E':eind>=5?'#F59E0B':'#EF4444';
  res.innerHTML=`<div class="calc-result">
    <div class="calc-result-icon">${icon}</div>
    <h3 class="${kleur}">${eind} — ${eind>=6?'voldoende ✓':'onvoldoende ✗'}</h3>
    <p>SE: <strong>${se}</strong> + nieuw CE: <strong>${nieuwCe}</strong> = gem ${gem.toFixed(2)} → afgerond <strong>${eind}</strong></p>
    <div class="calc-result-bar"><span style="font-size:11px;color:var(--mu);min-width:16px">1</span><div class="calc-result-bar-track"><div class="calc-result-bar-fill" style="width:${barPct}%;background:${barClr}"></div></div><span style="font-size:11px;color:var(--mu)">10</span></div>
    <p style="margin-top:10px;font-size:12px;color:var(--mu)">Voor een 6 als eindcijfer heb je CE ≥ <strong>${ceVoldoende.toFixed(1).replace('.',',')}</strong> nodig bij SE ${se}.</p>
  </div>`;
}

// ═══════ FLASHCARDS ═══════
// ═══════ SPACED REPETITION (SM-2) ═══════
const SR_KEY='slagio_sr_v1';
function getSR(){try{return JSON.parse(localStorage.getItem(SR_KEY)||'{}');}catch(e){return{};}}
function saveSR(d){localStorage.setItem(SR_KEY,JSON.stringify(d));}
function srKey(vakId,domId,term){return vakId+'__'+domId+'__'+term.slice(0,35).replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_]/g,'');}

// SM-2: quality 0=again 2=hard 3=good 5=easy
// Max interval: 365 dagen zodat kaarten niet te lang weggaan
const SR_MAX_INTERVAL=365;
function sm2(sr={},q){
  let{interval=0,ease=2.5,reps=0,lapses=0}=sr;
  if(q===0){lapses++;reps=0;interval=1;}
  else if(q===2){interval=Math.max(1,Math.ceil((interval||1)*1.2));reps=Math.max(0,reps-1);}
  else{
    if(reps===0)interval=1;
    else if(reps===1)interval=3;
    else interval=Math.round((interval||3)*ease);
    if(q===5)interval=Math.round(interval*1.3);
    reps++;
  }
  ease=Math.max(1.3,ease+0.1-(5-q)*(0.08+(5-q)*0.02));
  interval=Math.min(interval,SR_MAX_INTERVAL);
  const due=new Date();due.setDate(due.getDate()+Math.max(1,interval));
  return{interval,ease:Math.round(ease*1000)/1000,reps,lapses,due:due.toISOString().slice(0,10)};
}
function _fmtDays(d){
  if(d>=365)return Math.round(d/365)+'jr';
  if(d>=30)return Math.round(d/30)+'mo';
  return d+'d';
}
// Gebruik sm2 preview zodat label altijd consistent is met het echte algoritme
function srIntLabel(q,sr={}){
  if(q===0)return'<1m';
  return _fmtDays(sm2(sr,q).interval);
}

let FC={cards:[],queue:[],again:[],stats:{again:0,hard:0,good:0,easy:0},vakId:'',domId:'',flipped:false,sessionTotal:0};

// Haalt term→definitie paren uit <strong>term</strong>: def patroon in sam HTML
function _parseSamCards(html){
  const tmp=document.createElement('div');
  tmp.innerHTML=html;
  const cards=[];
  const seen=new Set();
  tmp.querySelectorAll('li').forEach(li=>{
    const first=li.querySelector('strong');
    if(!first)return;
    const term=first.textContent.trim();
    if(!term||term.length<2||term.length>72||seen.has(term))return;
    seen.add(term);
    const full=li.textContent;
    const tidx=full.indexOf(term);
    let def=tidx>=0?full.slice(tidx+term.length).replace(/^[\s:,\-–]+/,'').trim():full.trim();
    if(def.length<5)return;
    if(def.length>220)def=def.slice(0,220).replace(/\s\S+$/,'')+'…';
    cards.push({term,def});
  });
  return cards;
}

function startFlash(){
  trackEvent('flashcard',{domein:ST.domein?.naam||null});
  const d=ST.domein,v=ST.vak;
  if(!d||!v)return;
  // Stap 1: haal term→def paren uit <strong> tags in sam HTML
  let cards=d.sam?_parseSamCards(d.sam):[];
  // Stap 2: fallback — koppel elke onderwerp aan de meest relevante zin (keyword-matching)
  if(cards.length<3){
    const terms=(d.onderwerpen||[]).filter(t=>t&&t.trim().length>1);
    const samText=(d.sam||'').replace(/<[^>]+>/g,'');
    const sents=samText.split(/(?<=[.!?])\s+/).filter(s=>s.length>15&&s.length<300);
    cards=terms.map(term=>{
      const kw=term.toLowerCase().replace(/[^a-zéèëïöüàâ ]/gi,'').split(/\s+/).filter(w=>w.length>3);
      const scored=sents.map(s=>{const sl=s.toLowerCase();return{s,n:kw.filter(w=>sl.includes(w)).length};}).sort((a,b)=>b.n-a.n);
      const best=scored[0];
      let def=(best&&best.n>0)?best.s:sents[0]||'Bestudeer dit begrip in de samenvatting.';
      if(def.length>220)def=def.slice(0,220).replace(/\s\S+$/,'')+'…';
      return{term,def};
    });
  }
  if(!cards.length){showToast('Geen flashcards voor dit domein','#ef4444');return;}

  const today=new Date().toISOString().slice(0,10);
  const srData=getSR();
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const newCards=[],dueCards=[];
  cards.forEach(c=>{
    const k=srKey(v.id,d.id,c.term);
    const sr=srData[k];
    if(!sr)newCards.push({...c,k,sr:{}});
    else if(sr.due<=today)dueCards.push({...c,k,sr});
  });

  let queue=[...shuffle(dueCards),...shuffle(newCards).slice(0,20)];
  let isPractice=false;

  // No due/new cards → fallback: practice all cards (ignores due dates)
  if(!queue.length){
    isPractice=true;
    queue=shuffle(cards.map(c=>{
      const k=srKey(v.id,d.id,c.term);
      return{...c,k,sr:srData[k]||{}};
    }));
    showToast('Klaar voor vandaag! Extra oefensessie gestart 🔥','var(--or)',2500);
  }

  FC={
    cards,
    queue,
    again:[],
    stats:{again:0,hard:0,good:0,easy:0},
    vakId:v.id,domId:d.id,flipped:false,
    sessionTotal:queue.length,
    newCount:isPractice?0:Math.min(newCards.length,20),
    dueCount:isPractice?queue.length:dueCards.length,
    isPractice
  };

  // Always reset card visibility before starting
  const cardEl=document.getElementById('fc-card');
  if(cardEl){cardEl.style.display='';cardEl.classList.remove('flipped');}
  document.getElementById('fc-score').innerHTML='';
  document.getElementById('fc-btns').style.display='none';

  const metaEl=document.getElementById('fc-meta');
  if(metaEl)metaEl.textContent=v.naam+' · D'+d.id+': '+d.naam+(isPractice?' · Oefensessie':'');
  _fcUpdateChips();
  show('sc-flash');
  showFlashcard();
}

function _fcUpdateChips(){
  const el=document.getElementById('fc-counts');
  if(!el)return;
  if(FC.isPractice){el.innerHTML=`<span class="fc-count-chip fc-chip-due">${FC.dueCount} oefening</span>`;return;}
  el.innerHTML=
    (FC.newCount>0?`<span class="fc-count-chip fc-chip-new">${FC.newCount} nieuw</span>`:'')+
    (FC.dueCount>0?`<span class="fc-count-chip fc-chip-due">${FC.dueCount} herhaling</span>`:'');
}

function showFlashcard(){
  // Progress bar
  const done=FC.sessionTotal-FC.queue.length;
  const bar=document.getElementById('fc-prog-bar');
  if(bar)bar.style.width=(FC.sessionTotal>0?Math.round(done/FC.sessionTotal*100):0)+'%';

  // Session complete
  if(!FC.queue.length&&!FC.again.length){_fcSummary();return;}

  // Flush "again" cards back into queue when main queue empties
  if(!FC.queue.length&&FC.again.length){
    FC.queue=[...FC.again];FC.again=[];
    FC.sessionTotal+=FC.queue.length;
    showToast('🔄 Herhaling van '+FC.queue.length+' moeilijke kaart'+(FC.queue.length!==1?'en':''),'var(--or)',2200);
  }

  const c=FC.queue[0];
  FC.flipped=false;
  const cardEl=document.getElementById('fc-card');
  cardEl.style.display='';
  cardEl.classList.remove('flipped');
  document.getElementById('fc-front').innerHTML=`<span>${c.term}</span><span class="fc-front-hint">Tik om te draaien</span>`;
  document.getElementById('fc-back').innerHTML=`<div class="fc-back-term">${c.term}</div><div>${c.def}</div>`;
  document.getElementById('fc-btns').style.display='none';
  document.getElementById('fc-score').innerHTML='';

  const doneTotal=FC.sessionTotal-FC.queue.length-(FC.again.length>0?0:0);
  const progEl=document.getElementById('fc-progress');
  if(progEl)progEl.textContent=(done+1)+' van '+FC.sessionTotal+(FC.again.length?' · +'+FC.again.length+' herhaling':'');
}

function flipCard(){
  if(FC.flipped)return;
  FC.flipped=true;
  document.getElementById('fc-card').classList.add('flipped');
  const btnsEl=document.getElementById('fc-btns');
  btnsEl.style.display='grid';
  const c=FC.queue[0]||{};
  [0,2,3,5].forEach(q=>{
    const el=document.getElementById('fc-int-'+q);
    if(el)el.textContent=srIntLabel(q,c.sr||{});
  });
}

function fcRate(q){
  if(!FC.queue.length)return;
  const c=FC.queue.shift();
  const srData=getSR();
  srData[c.k]=sm2(c.sr||{},q);
  saveSR(srData);
  if(q===0){FC.stats.again++;FC.again.push({...c,sr:srData[c.k]});}
  else if(q===2)FC.stats.hard++;
  else if(q===3)FC.stats.good++;
  else FC.stats.easy++;
  showFlashcard();
}

function _fcSummary(){
  const s=FC.stats;
  const total=s.again+s.hard+s.good+s.easy;
  const goodCount=s.good+s.easy;
  const pct=total>0?Math.round(goodCount/total*100):0;
  const col=pct>=80?'#22c55e':pct>=50?'var(--or)':'#ef4444';
  const title=pct>=80?'Uitstekend! 🎉':pct>=50?'Goed bezig! 💪':'Blijf oefenen! 📚';

  // Count mastered (reps >= 2) across full deck
  const srData=getSR();
  const mastered=FC.cards.filter(c=>(srData[srKey(FC.vakId,FC.domId,c.term)]?.reps||0)>=2).length;

  // Next due card date
  const today=new Date();
  const dueDates=FC.cards.map(c=>srData[srKey(FC.vakId,FC.domId,c.term)]?.due).filter(Boolean).sort();
  const nextDue=dueDates[0];
  let nextLabel='—';
  if(nextDue){
    const diff=Math.round((new Date(nextDue)-today)/(1000*60*60*24));
    nextLabel=diff<=0?'Vandaag':diff===1?'Morgen':'Over '+diff+' dagen';
  }

  checkFcAch();
  document.getElementById('fc-card').style.display='none';
  document.getElementById('fc-btns').style.display='none';
  document.getElementById('fc-progress').textContent='';
  const bar=document.getElementById('fc-prog-bar');
  if(bar)bar.style.width='100%';

  document.getElementById('fc-score').innerHTML=`
    <div class="fc-summary">
      <div class="fc-sum-title">${title}</div>
      <div class="fc-sum-sub">${total} kaarten beoordeeld deze sessie</div>
      <div class="fc-sum-stats">
        <div class="fc-sum-stat">
          <div class="fc-sum-stat-n" style="color:#22c55e">${goodCount}</div>
          <div class="fc-sum-stat-l">Goed</div>
        </div>
        <div class="fc-sum-stat">
          <div class="fc-sum-stat-n" style="color:var(--or)">${s.hard}</div>
          <div class="fc-sum-stat-l">Moeilijk</div>
        </div>
        <div class="fc-sum-stat">
          <div class="fc-sum-stat-n" style="color:#ef4444">${s.again}</div>
          <div class="fc-sum-stat-l">Opnieuw</div>
        </div>
      </div>
      <div class="fc-mastery-wrap"><div class="fc-mastery-bar" style="width:${Math.round(mastered/Math.max(1,FC.cards.length)*100)}%;background:${col}"></div></div>
      <div class="fc-mastery-lbl">${mastered}/${FC.cards.length} kaarten beheerst · ${pct}% goed deze sessie</div>
      <div style="font-size:11px;color:var(--mu);margin:10px 0 2px">⏰ Volgende herhaling: <strong>${nextLabel}</strong></div>
      <button class="fc-sum-btn fc-sum-btn-primary" onclick="startFlash()">🔄 Nieuwe sessie</button>
      <button class="fc-sum-btn fc-sum-btn-sec" onclick="show('sc-detail')">← Terug</button>
    </div>`;
  setTimeout(()=>showFeedbackPopup('flashcard'),2000);
}

// ═══════ POMODORO ═══════
let POMO={timer:null,seconds:25*60,total:25*60,running:false,mode:'study',breakTimer:null,breakSeconds:0,sessions:0};

function renderPomo(){
  const box=document.getElementById('pomo-home');
  if(!box)return;
  const mins=Math.floor(POMO.seconds/60);
  const secs=POMO.seconds%60;
  const isBreak=POMO.mode==='break';
  const modeClass=isBreak?' pomo-break':'';
  const modeBadge=isBreak?'☕ Pauze':'🎯 Studie';
  const modeLabel=isBreak?'Rust even uit':'Blijf gefocust';
  const infoOpen=box._infoOpen||false;
  // Circular ring
  const R=80,C=2*Math.PI*R;
  const progress=POMO.total>0?POMO.seconds/POMO.total:1;
  const offset=C*(1-progress);
  // Session dots (max 4)
  const dots=Array.from({length:4},(_,i)=>`<div class="pomo-session-dot${i<POMO.sessions?' done':''}"></div>`).join('');
  box.innerHTML=`<div class="pomo${modeClass}">
    <div class="pomo-header">
      <div class="pomo-title">Pomodoro Timer</div>
      <div class="pomo-mode-badge">${modeBadge}</div>
    </div>
    <div class="pomo-ring-wrap">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle class="pomo-ring-bg" cx="90" cy="90" r="${R}"/>
        <circle class="pomo-ring-fg" cx="90" cy="90" r="${R}"
          stroke-dasharray="${C.toFixed(2)}"
          stroke-dashoffset="${offset.toFixed(2)}"/>
      </svg>
      <div class="pomo-ring-center">
        <div class="pomo-time">${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}</div>
        <div class="pomo-label">${modeLabel}</div>
      </div>
    </div>
    <div class="pomo-sessions">${dots}</div>
    <div class="pomo-btns">
      <button class="pomo-btn${POMO.running?' pomo-active':''}" onclick="togglePomo()">
        ${POMO.running?'<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pauze':'<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Start'}
      </button>
      <button class="pomo-btn" onclick="resetPomo()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg> Reset
      </button>
    </div>
    <div class="pomo-info">
      <button class="pomo-info-toggle${infoOpen?' open':''}" onclick="const b=this.nextElementSibling;b.classList.toggle('open');this.classList.toggle('open');document.getElementById('pomo-home')._infoOpen=b.classList.contains('open')">
        Wat is de Pomodoro-techniek? <span class="pomo-info-arrow">▾</span>
      </button>
      <div class="pomo-info-body${infoOpen?' open':''}">
        <p>De <strong>Pomodoro-techniek</strong> is een bewezen methode om gefocust te studeren en mentale vermoeidheid te voorkomen.</p>
        <ol>
          <li>⏱ Werk <strong>25 minuten</strong> volledig gefocust (één pomodoro)</li>
          <li>☕ Neem <strong>5 minuten</strong> korte pauze — sta op, rek je uit</li>
          <li>🔁 Herhaal dit <strong>4 keer</strong> na elkaar</li>
          <li>🧘 Na 4 pomodoro's: neem een <strong>lange pauze</strong> van 15–30 minuten</li>
        </ol>
        <div class="pomo-info-tip">💡 <strong>Tip:</strong> leg je telefoon weg tijdens de 25 minuten. Elke afleiding verlengt de herstarttijd van je concentratie met gemiddeld 23 minuten.</div>
      </div>
    </div>
  </div>`;
}

function pomoAlert(){
  // Play sound using Web Audio API
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    function beep(freq,start,dur){
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.type='sine';o.frequency.value=freq;
      g.gain.setValueAtTime(0.3,ctx.currentTime+start);
      g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+start+dur);
      o.start(ctx.currentTime+start);o.stop(ctx.currentTime+start+dur);
    }
    beep(880,0,.15);beep(880,.2,.15);beep(1100,.45,.3);
  }catch(e){}
  // Vibrate on mobile
  if(navigator.vibrate)navigator.vibrate([200,100,200,100,300]);
}

function showPomoOverlay(type){
  const ov=document.getElementById('pomo-overlay');
  const icon=document.getElementById('pomo-ov-icon');
  const title=document.getElementById('pomo-ov-title');
  const sub=document.getElementById('pomo-ov-sub');
  const timer=document.getElementById('pomo-ov-timer');
  const bar=document.getElementById('pomo-ov-bar');
  const btn=document.getElementById('pomo-ov-action');

  const mgBtn=document.getElementById('pomo-ov-mg-btn');
  if(type==='break'){
    ov.classList.add('break-mode');
    icon.textContent='☕';
    title.textContent='Pauze tijd!';
    sub.textContent='Goed bezig! Neem even 5 minuten rust.';
    timer.textContent='05:00';
    bar.style.width='100%';
    btn.textContent='▶ Start pauze';
    btn.onclick=startBreakFromOverlay;
    btn.style.display='';
    if(mgBtn)mgBtn.style.display='';
  }else{
    ov.classList.remove('break-mode');
    icon.textContent='🔥';
    title.textContent='Pauze voorbij!';
    sub.textContent='Tijd om weer aan de slag te gaan!';
    timer.textContent='00:00';
    bar.style.width='0%';
    btn.textContent='▶ Nieuwe sessie';
    btn.onclick=function(){dismissPomoOverlay();POMO.mode='study';POMO.seconds=25*60;POMO.total=25*60;renderPomo();togglePomo();};
    btn.style.display='';
    if(mgBtn)mgBtn.style.display='none';
  }
  ov.classList.add('show');
  pomoAlert();
}

function startBreakFromOverlay(){
  const btn=document.getElementById('pomo-ov-action');
  btn.style.display='none';
  POMO.mode='break';POMO.seconds=5*60;POMO.total=5*60;POMO.running=true;
  renderPomo();

  clearInterval(POMO.breakTimer);
  const totalBreak=5*60;
  POMO.breakTimer=setInterval(()=>{
    POMO.seconds--;
    const m=Math.floor(POMO.seconds/60);
    const s=POMO.seconds%60;
    const ovTimer=document.getElementById('pomo-ov-timer');
    const ovBar=document.getElementById('pomo-ov-bar');
    if(ovTimer)ovTimer.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
    if(ovBar)ovBar.style.width=((POMO.seconds/totalBreak)*100)+'%';
    renderPomo();
    if(POMO.seconds<=0){
      clearInterval(POMO.breakTimer);POMO.running=false;
      dismissPomoOverlay();
      POMO.mode='study';POMO.seconds=25*60;
      renderPomo();
      setTimeout(()=>showPomoOverlay('study'),400);
    }
  },1000);
}

function dismissPomoOverlay(){
  clearInterval(window._mgTimer);
  window._mgState=null;
  document.getElementById('pomo-overlay').classList.remove('show','break-mode');
  clearInterval(POMO.breakTimer);
}

function startPomoMinigame(){
  clearInterval(window._mgTimer);
  const card=document.querySelector('.pomo-overlay-card');
  const emojis=['🌟','⚡','🎯','🚀','🦊','🎨','🎵','🌈'];
  const deck=[...emojis,...emojis].sort(()=>Math.random()-.5);
  window._mgState={flipped:[],matched:0,moves:0,locked:false,startTime:Date.now()};
  card.innerHTML=`
    <div class="mg-wrap">
      <div class="mg-header">🎮 Geheugenspel — vind alle paren!</div>
      <div class="mg-stats">
        <div class="mg-stat"><span class="mg-stat-val" id="mg-moves">0</span><span class="mg-stat-lbl">Zetten</span></div>
        <div class="mg-stat"><span class="mg-stat-val" id="mg-time">0s</span><span class="mg-stat-lbl">Tijd</span></div>
      </div>
      <div class="mg-grid" id="mg-grid">${deck.map((e,i)=>`<div class="mg-card" data-i="${i}" data-e="${e}" onclick="mgFlip(this)"></div>`).join('')}</div>
      <div style="text-align:center">
        <button class="pomo-overlay-btn secondary" style="padding:9px 20px;font-size:13px" onclick="dismissPomoOverlay()">✕ Sluiten</button>
      </div>
    </div>`;
  window._mgTimer=setInterval(()=>{
    const el=document.getElementById('mg-time');
    if(el&&window._mgState)el.textContent=Math.floor((Date.now()-window._mgState.startTime)/1000)+'s';
  },1000);
}

function mgFlip(el){
  const st=window._mgState;
  if(!st||st.locked)return;
  if(el.classList.contains('mg-flipped')||el.classList.contains('mg-matched'))return;
  el.textContent=el.dataset.e;
  el.classList.add('mg-flipped');
  st.flipped.push(el);
  if(st.flipped.length===2){
    st.moves++;
    const mv=document.getElementById('mg-moves');
    if(mv)mv.textContent=st.moves;
    const[a,b]=st.flipped;
    if(a.dataset.e===b.dataset.e){
      a.classList.replace('mg-flipped','mg-matched');
      b.classList.replace('mg-flipped','mg-matched');
      st.flipped=[];st.matched++;
      if(st.matched===8){
        clearInterval(window._mgTimer);
        const secs=Math.floor((Date.now()-st.startTime)/1000);
        setTimeout(()=>mgDone(st.moves,secs),500);
      }
    }else{
      st.locked=true;
      setTimeout(()=>{
        a.textContent='';b.textContent='';
        a.classList.remove('mg-flipped');b.classList.remove('mg-flipped');
        st.flipped=[];st.locked=false;
      },750);
    }
  }
}

function mgDone(moves,secs){
  const card=document.querySelector('.pomo-overlay-card');
  const star=moves<=12?'🏆':moves<=18?'🥈':'🥉';
  const lbl=moves<=12?'Fenomenaal!':moves<=18?'Goed gedaan!':'Blijf oefenen!';
  card.innerHTML=`
    <div style="text-align:center">
      <span class="mg-done-emoji">${star}</span>
      <div class="mg-done-title">${lbl}</div>
      <div class="mg-done-sub">Alle paren gevonden in <strong>${moves} zetten</strong> en <strong>${secs}s</strong></div>
      <div class="mg-done-btns">
        <button class="pomo-overlay-btn secondary" onclick="dismissPomoOverlay()">Sluiten</button>
        <button class="pomo-overlay-btn mg-btn" onclick="startPomoMinigame()">↺ Opnieuw</button>
        <button class="pomo-overlay-btn primary" onclick="startBreakFromOverlay()">☕ Start pauze</button>
      </div>
    </div>`;
}

function togglePomo(){
  if(POMO.running){
    clearInterval(POMO.timer);clearInterval(POMO.breakTimer);POMO.running=false;
  }else{
    POMO.running=true;
    POMO.timer=setInterval(()=>{
      POMO.seconds--;
      if(POMO.seconds<=0){
        clearInterval(POMO.timer);POMO.running=false;
        if(POMO.mode==='study'){
          POMO.sessions=Math.min((POMO.sessions||0)+1,4);
          renderPomo();
          showPomoOverlay('break');
          return;
        }else{
          POMO.mode='study';POMO.seconds=25*60;POMO.total=25*60;
          if(POMO.sessions>=4)POMO.sessions=0;
        }
      }
      renderPomo();
    },1000);
  }
  renderPomo();
}

function resetPomo(){clearInterval(POMO.timer);clearInterval(POMO.breakTimer);POMO.running=false;POMO.mode='study';POMO.seconds=25*60;POMO.total=25*60;POMO.sessions=0;dismissPomoOverlay();renderPomo();}

// ═══════ INTRO MODAL ═══════
const INTRO_STEPS_N=3;
let _introIdx=0;
let _introPickedAnimal=null;

/* ===== ONBOARDING v3 ===== */
const OB_KEY='slagio_onboard_v3';
let _obStep=0,_obPickedAnimal=null;
function showOnboarding(){
  _obStep=0;_obPickedAnimal=null;
  _obBuildAnimals();
  document.getElementById('ob-overlay').style.display='flex';
  _obRender();
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
const TUTO_TOTAL=5;
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
    next.textContent='Aan de slag! 🚀';
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
   body:'Dit zijn je schoolexamencijfers — de cijfers die je al hebt gehaald op school. Vul ze in per vak.'},
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
    ?`Slagio — ${nivNaam} Examenvoorbereiding 2026 | 1.800+ vragen, eindexamens, studieplan`
    :'Slagio — Complete HAVO & VWO Examenvoorbereiding 2026';
  const desc=level
    ?`Gratis ${nivNaam} examenvoorbereiding 2026. 1.800+ oefenvragen per domein, echte CE-eindexamens 2019–2025, persoonlijk studieplan, spaced repetition flashcards en cijfercalculator. Geen account nodig.`
    :'Kies je niveau: HAVO of VWO. Gratis examenvoorbereiding met 1.800+ oefenvragen, echte eindexamens 2019–2025, studieplan en meer.';
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
renderPomo();
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
  // Query-param fallback: ?niveau=havo&vak=bi → redirect naar hash
  const _qp=new URLSearchParams(location.search);
  const _qniv=_qp.get('niveau'), _qvak=_qp.get('vak');
  if(_qniv&&_qvak&&_VAK_SLUG[_qvak]){
    history.replaceState(null,'','#'+_qniv+'-'+_VAK_SLUG[_qvak]);
  }
  // Path-based routing: /havo en /vwo
  const _path=location.pathname.replace(/\/$/,'');
  if(_path==='/havo'||_path==='/vwo'){
    setTimeout(()=>_routeFromPath(),80);
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
  if(wrap)wrap.innerHTML=pl.map(p=>`<div class="mq-player-chip"><span class="mq-player-av">${p.avatar}</span><span class="mq-player-nm">${p.name}</span></div>`).join('');
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
  if(lb)lb.innerHTML=results.slice(0,5).map((r,i)=>`<div class="mq-lb-row"><span class="mq-lb-pos">${i+1}</span><span class="mq-lb-av">${r.avatar}</span><span class="mq-lb-nm">${r.name}</span><span class="mq-lb-pts">${scores[r.id]||0} pt</span></div>`).join('');
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
  if(lb)lb.innerHTML=(Array.isArray(scores)?scores:[]).map((p,i)=>`<div class="mq-final-row${i<3?' mq-final-top':''}"><span class="mq-final-pos">${medals[i]||i+1}</span><span class="mq-final-av">${p.avatar}</span><span class="mq-final-nm">${p.name}</span><span class="mq-final-score">${p.score} pt</span></div>`).join('');
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
  // iOS in browser (niet geïnstalleerd): meldingen werken niet — toon installatie-tip
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
  if(b)b.innerHTML='Meldingen werken op iOS alleen via de geïnstalleerde app.<br><br>Tik op <strong>Delen&nbsp;⬆</strong> in Safari en kies <strong>"Zet op beginscherm"</strong> — dan ontvang je dagelijkse studie&shy;herinneringen.';
  if(btns)btns.innerHTML='<button class="np-allow" onclick="_dismissIOSInstall()">👍 Begrepen</button>';
  el.classList.add('visible');
}
function _dismissIOSInstall(){
  const el=document.getElementById('notif-prompt');if(el)el.classList.remove('visible');
  const cfg=_nCfg()||{};cfg.iosInstallDismissed=true;_nSave(cfg);
}

async function enableNotifications(){
  const el=document.getElementById('notif-prompt');if(el)el.classList.remove('visible');
  // iOS browser: kan geen toestemming vragen — installatie nodig
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

// Toon notificatie via Service Worker — werkt op iOS standalone én desktop
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
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'}).then(reg=>{
      reg.update();
      // Init notifications after SW ready
      navigator.serviceWorker.ready.then(()=>initNotifications());
    }).catch(()=>{});
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      const b=document.getElementById('sw-update-banner');
      if(b)b.classList.add('show');
    });
  });
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

  document.getElementById('pwa-install-btn').addEventListener('click',()=>{
    hideBanner();
    if(_deferredPrompt){
      _deferredPrompt.prompt();
      _deferredPrompt.userChoice.then(()=>{_deferredPrompt=null;});
    }
  });

  document.getElementById('pwa-dismiss-btn').addEventListener('click',()=>{
    hideBanner();snooze();
  });

  // iOS: show manual instructions
  if(isIOS&&sessions>=2&&!isSnoozed()){
    setTimeout(()=>{
      if(_bannerShown||isSnoozed())return;
      _bannerShown=true;
      const b=document.getElementById('pwa-banner');
      b.querySelector('.pwa-banner-title').textContent='Voeg toe aan beginscherm';
      b.querySelector('.pwa-banner-sub').textContent='Tik op Delen ↑ → "Zet op beginscherm" voor snelle toegang';
      b.querySelector('#pwa-install-btn').style.display='none';
      b.classList.add('show');
    },2000);
  }
})();
