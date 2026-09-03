// ═══════ KLAS (Fase 0: klascode-systeem) ═══════
// Docent maakt een klas → korte code. Leerlingen (anoniem via _DID of
// ingelogd) sluiten zich aan met de code. Klas-leaderboard telt de scores
// van de leden op. Alle DB-toegang loopt via SECURITY DEFINER-RPC's in
// Supabase (zie sql/klas-setup.sql); tot die er zijn toont de UI "binnenkort".

const KLAS_KEY = 'slagio_klas'; // {id,naam,code?,role,naamInKlas,niveau,vakId}
let _klasEnabled = null;        // null=onbekend, true/false na eerste RPC

function getActiveKlas(){ try{ return JSON.parse(localStorage.getItem(KLAS_KEY)||'null'); }catch(e){ return null; } }
function setActiveKlas(o){ try{ localStorage.setItem(KLAS_KEY, JSON.stringify(o)); }catch(e){} }
function clearActiveKlas(){ try{ localStorage.removeItem(KLAS_KEY); }catch(e){} }

// Herkent "functie/relatie bestaat nog niet" → feature nog niet geactiveerd.
function _klasNotReady(err){
  const m = String(err?.message||err?.hint||err||'').toLowerCase();
  return m.includes('does not exist') || m.includes('could not find') || m.includes('schema cache') || err?.code==='42883' || err?.code==='PGRST202';
}

async function _klasRpc(fn, args){
  const { data, error } = await SB.rpc(fn, args||{});
  if(error){
    if(_klasNotReady(error)){ _klasEnabled=false; const e=new Error('klas_disabled'); e._disabled=true; throw e; }
    throw error;
  }
  _klasEnabled=true;
  return data;
}

function _klasNaamVoorstel(){
  try{ const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}'); if(p.naam) return p.naam; }catch(e){}
  return '';
}

// ── Ingang ────────────────────────────────────────────────────
function openKlas(){
  show('sc-klas');
  renderKlas();
}

async function renderKlas(){
  const box = document.getElementById('klas-body');
  if(!box) return;
  const k = getActiveKlas();
  if(k){ box.innerHTML = _klasSkeleton(k); _klasLoadDetail(k); return; }
  box.innerHTML = _klasStartHtml();
}

// ── Startscherm (geen klas): join + (docent) maken ───────────
function _klasStartHtml(){
  const naam = _klasNaamVoorstel();
  const vakOpts = (typeof getVK==='function'?getVK():[]).map(v=>`<option value="${v.id}">${v.naam}</option>`).join('');
  return `
  <div class="klas-hero">
    <div class="klas-ico">👥</div>
    <h2>Samen oefenen met je klas</h2>
    <p>Doe mee met de klas van je docent en zie wie er bovenaan de klas-ranglijst staat. Elke oefensessie telt mee.</p>
  </div>
  <div class="klas-card">
    <h3>Doe mee met je klas</h3>
    <label class="klas-lbl" for="klas-join-code">Klascode</label>
    <input id="klas-join-code" class="klas-input klas-code-input" maxlength="6" autocapitalize="characters" placeholder="ABC123" oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'')">
    <label class="klas-lbl" for="klas-join-naam">Je naam in de klas</label>
    <input id="klas-join-naam" class="klas-input" maxlength="24" placeholder="Bijv. ${naam||'Sam'}" value="${_esc(naam)}">
    <button class="klas-btn klas-btn-primary" onclick="klasDoeMee()">Meedoen →</button>
    <div id="klas-join-err" class="klas-err"></div>
  </div>
  <p class="klas-doc-link">Ben je docent en wil je een klas aanmaken? Dat regel je op <a href="/vakken/slagio-school.html">Slagio School</a>, daar open je het docentenportaal en maak je gratis een klas aan.<br><a onclick="openZetQuiz()" style="cursor:pointer;color:var(--or);font-weight:700">📌 Of zet nu snel een oefenquiz klaar →</a></p>`;
}

// ── Leerling sluit zich aan ───────────────────────────────────
async function klasDoeMee(){
  const err = document.getElementById('klas-join-err');
  const code = (document.getElementById('klas-join-code').value||'').trim().toUpperCase();
  const naam = (document.getElementById('klas-join-naam').value||'').trim();
  if(err) err.textContent='';
  if(code.length<4){ if(err) err.textContent='Vul de klascode van je docent in.'; return; }
  const btn = document.querySelector('#sc-klas .klas-btn-primary');
  if(btn){ btn.disabled=true; btn.textContent='Bezig…'; }
  try{
    const rows = await _klasRpc('klas_join', { p_code: code, p_did: _DID, p_naam: naam });
    const r = Array.isArray(rows)?rows[0]:rows;
    if(!r){ if(err) err.textContent='Klas niet gevonden. Controleer de code.'; return; }
    setActiveKlas({ id:r.id, naam:r.naam, role:'leerling', naamInKlas:naam||'Leerling', niveau:r.niveau, vakId:r.vak_id });
    try{ trackEvent('klas',{actie:'join'}); }catch(e){}
    renderKlas();
  }catch(e){
    if(e._disabled){ if(err) err.textContent='De klasfunctie wordt binnenkort geactiveerd. Kom snel terug!'; return; }
    const m=String(e?.message||e);
    if(err) err.textContent = m.includes('klas_niet_gevonden') ? 'Klas niet gevonden. Controleer de code.' : 'Er ging iets mis. Probeer het opnieuw.';
  }finally{ if(btn){ btn.disabled=false; btn.textContent='Meedoen →'; } }
}

// ── Docent maakt een klas ─────────────────────────────────────
async function klasMaak(){
  const err = document.getElementById('klas-new-err');
  if(err) err.textContent='';
  if(typeof currentUser==='undefined' || !currentUser){
    if(err) err.innerHTML='Maak eerst een gratis account aan (via <b onclick="openProfiel()" style="cursor:pointer;color:var(--or)">Profiel</b>) - dan blijft je klas bewaard.';
    return;
  }
  const naam = (document.getElementById('klas-new-naam').value||'').trim();
  const niveau = document.getElementById('klas-new-niv').value;
  const vak = document.getElementById('klas-new-vak').value;
  const btn = document.querySelector('#klas-new-err').previousElementSibling;
  if(btn){ btn.disabled=true; btn.textContent='Bezig…'; }
  try{
    const rows = await _klasRpc('klas_create', { p_naam:naam, p_niveau:niveau, p_vak_id:vak });
    const r = Array.isArray(rows)?rows[0]:rows;
    setActiveKlas({ id:r.id, naam:naam||'Mijn klas', code:r.code, role:'docent', niveau, vakId:vak });
    try{ trackEvent('klas',{actie:'create'}); }catch(e){}
    renderKlas();
  }catch(e){
    if(e._disabled){ if(err) err.textContent='De klasfunctie wordt binnenkort geactiveerd. Kom snel terug!'; return; }
    if(err) err.textContent = String(e?.message||e).includes('auth_required') ? 'Je moet ingelogd zijn om een klas te maken.' : 'Er ging iets mis. Probeer het opnieuw.';
  }finally{ if(btn){ btn.disabled=false; btn.textContent='Klas aanmaken →'; } }
}

// ── Detailweergave van de actieve klas ────────────────────────
function _klasSkeleton(k){
  const isDoc = k.role==='docent';
  const codeBlok = isDoc && k.code ? `
    <div class="klas-code-box">
      <div class="klas-code-lbl">Klascode - deel deze met je leerlingen</div>
      <div class="klas-code-big" id="klas-code-big">${k.code}</div>
      <button class="klas-btn klas-btn-ghost" onclick="klasDeel()">📤 Code delen / kopiëren</button>
      <a class="klas-btn klas-btn-primary" href="/docent.html?code=${encodeURIComponent(k.code)}" target="_blank" rel="noopener" style="display:block;text-align:center;text-decoration:none;margin-top:8px">📊 Open docentendashboard</a>
    </div>` : '';
  return `
  <div class="klas-head">
    <div>
      <div class="klas-head-sub">${isDoc?'Jouw klas':'Je klas'}</div>
      <h2 class="klas-head-naam">${_esc(k.naam||'Mijn klas')}</h2>
    </div>
    <button class="klas-leave" onclick="klasVerlaat()">${isDoc?'Sluiten':'Verlaten'}</button>
  </div>
  ${codeBlok}
  <div id="klas-week"></div>
  <div class="klas-lb-head"><span>🏆 Klas-ranglijst</span><span class="klas-lb-sub" id="klas-leden-count"></span></div>
  <div id="klas-lb" class="klas-lb"><div class="klas-empty">Laden…</div></div>`;
}

async function _klasLoadDetail(k){
  const lb = document.getElementById('klas-lb');
  const cnt = document.getElementById('klas-leden-count');
  try{
    const [rows, info, week] = await Promise.all([
      _klasRpc('klas_leaderboard', { p_klas_id:k.id }),
      _klasRpc('klas_info', { p_klas_id:k.id }).catch(()=>null),
      _klasRpc('klas_week', { p_klas_id:k.id }).catch(()=>null)
    ]);
    const ledenN = info ? ((Array.isArray(info)?info[0]:info)||{}).leden : null;
    if(cnt && ledenN!=null){ cnt.textContent = ledenN+' leerling'+(ledenN==1?'':'en'); }
    try{ _klasRenderWeek(week, ledenN); }catch(e){}
    if(!lb) return;
    if(!rows || !rows.length){ lb.innerHTML = '<div class="klas-empty">Nog geen scores. Zodra iemand een quiz doet, verschijnt de ranglijst hier.</div>'; return; }
    const mij = (k.naamInKlas||'').toLowerCase();
    lb.innerHTML = rows.map((r,i)=>{
      const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':`<span class="klas-rank">${i+1}</span>`;
      const me = r.naam && r.naam.toLowerCase()===mij ? ' klas-me':'';
      return `<div class="klas-lb-row${me}"><span class="klas-lb-pos">${medal}</span><span class="klas-lb-naam">${_esc(r.naam||'Leerling')}</span><span class="klas-lb-pts">${r.totaal} pt</span></div>`;
    }).join('');
  }catch(e){
    if(e._disabled){ lb.innerHTML = _klasBinnenkort(); return; }
    if(lb) lb.innerHTML = '<div class="klas-empty">Kon de ranglijst niet laden.</div>';
  }
}

function _klasBinnenkort(){
  return '<div class="klas-empty">De klasfunctie wordt binnenkort geactiveerd. Kom snel terug!</div>';
}

// ── "Klas deze week": gezamenlijke week-XP + collectief doel + klas-streak ──
function _klasRenderWeek(week, leden){
  const box = document.getElementById('klas-week'); if(!box) return;
  let w = week; if(Array.isArray(w)) w = w[0];
  if(!w || typeof w !== 'object'){ box.innerHTML=''; return; }
  const total = Math.max(0, parseInt(w.total)||0);
  const streak = Math.max(0, parseInt(w.streak)||0);
  const ledenWeek = Math.max(0, parseInt(w.leden_week)||0);
  const n = Math.max(1, parseInt(leden)||ledenWeek||1);
  const goal = Math.max(1000, n*600);
  const pct = Math.min(100, Math.round(total/goal*100));
  const fmt = x => x.toLocaleString('nl-NL');
  const streakLine = streak>0
    ? `<div class="klas-week-streak"><span class="klas-week-flame">🔥</span> De klas oefende <b>${streak} dag${streak===1?'':'en'}</b> op rij</div>`
    : `<div class="klas-week-streak klas-week-off">Nog geen klas-streak - laat vandaag iemand oefenen om 'm te starten</div>`;
  box.innerHTML = `
  <div class="klas-week-card">
    <div class="klas-week-top">
      <span class="klas-week-title">Klas deze week</span>
      <span class="klas-week-xp">${fmt(total)}<span> XP</span></span>
    </div>
    <div class="klas-week-bar"><div class="klas-week-fill" style="width:${pct}%"></div></div>
    <div class="klas-week-sub">${pct}% van het weekdoel (${fmt(goal)} XP) · ${ledenWeek} actief deze week</div>
    ${streakLine}
  </div>`;
}

// ── Delen / verlaten ─────────────────────────────────────────
function klasDeel(){
  const k = getActiveKlas(); if(!k||!k.code) return;
  const tekst = `Doe mee met onze klas op Slagio! Ga naar slagio.nl, kies "Mijn klas" en vul de code in: ${k.code}`;
  if(navigator.share){ navigator.share({ title:'Slagio klas', text:tekst }).catch(()=>{}); }
  else { try{ navigator.clipboard.writeText(k.code); showToast('Klascode '+k.code+' gekopieerd','#22c55e'); }catch(e){ showToast('Klascode: '+k.code,'#22c55e'); } }
}

function klasVerlaat(){
  const k = getActiveKlas();
  const msg = k && k.role==='docent' ? 'Deze klas sluiten op dit apparaat? De klas en de scores blijven bestaan; je kunt met de code terugkeren.' : 'Deze klas verlaten op dit apparaat?';
  if(!confirm(msg)) return;
  clearActiveKlas();
  renderKlas();
  if(typeof renderKlasHome==='function') renderKlasHome();
}

// ── Score-hook (aangeroepen vanuit saveLeaderboardEntry in lb.js) ──
function klasScoreSave(entry){
  try{
    const k = getActiveKlas();
    if(!k || !k.id || _klasEnabled===false) return;
    const score = Math.round(entry?.score||0);
    if(score<=0) return;
    // fire-and-forget; stil falen is prima
    _klasRpc('klas_score_add', {
      p_klas_id:k.id, p_did:_DID, p_naam:(k.naamInKlas||entry?.naam||'Leerling'),
      p_score:score, p_vak:entry?.vakNaam||null, p_domein:entry?.domeinNaam||null
    }).catch(()=>{});
  }catch(e){}
}

// ── Home-kaart ───────────────────────────────────────────────
// Zit de leerling al in een klas → altijd tonen. Zo niet → de "doe mee"-kaart
// pas tonen zodra de backend (RPC's) beschikbaar is, zodat er vóór het draaien
// van de SQL geen doodlopende kaart verschijnt.
let _klasProbed = false;
async function _klasProbe(){
  if(_klasProbed) return; _klasProbed = true;
  try{ await _klasRpc('klas_mine'); }catch(e){}
  try{ renderKlasHome(); }catch(e){}
}
function renderKlasHome(){
  // Demo-huiswerk aan/uit via ?hwdemo=1 / ?hwdemo=0 (om de leerling-flow te bekijken).
  try{
    if(location.search.indexOf('hwdemo=0')>=0){ if(getDemoHw())localStorage.removeItem('slagio_hw_demo'); }
    else if(location.search.indexOf('hwdemo=1')>=0 && !getDemoHw() && typeof getVK==='function' && getVK().length){ _setDemoHw(); }
    // ?docent=1 → open de heldere "zet een quiz klaar"-picker (één keer).
    if(location.search.indexOf('docent=1')>=0 && !_zqOpened && typeof getVK==='function' && getVK().length){ _zqOpened=true; setTimeout(function(){try{openZetQuiz();}catch(e){}},350); }
  }catch(e){}
  try{ renderKlasHuiswerk(); }catch(e){}
  const el = document.getElementById('klas-home');
  if(!el) return;
  const k = getActiveKlas();
  if(k){
    el.innerHTML = `<div class="klas-home-card" onclick="openKlas()" role="button" tabindex="0">
      <div class="klas-home-ico">👥</div>
      <div class="klas-home-txt"><div class="klas-home-t">${_esc(k.naam||'Mijn klas')}</div><div class="klas-home-s">${k.role==='docent'?'Bekijk je klas-ranglijst':'Bekijk de klas-ranglijst'}</div></div>
      <div class="klas-home-arr">→</div></div>`;
    return;
  }
  if(_klasEnabled === true){
    el.innerHTML = `<div class="klas-home-card klas-home-join" onclick="openKlas()" role="button" tabindex="0">
      <div class="klas-home-ico">👥</div>
      <div class="klas-home-txt"><div class="klas-home-t">Doe mee met je klas</div><div class="klas-home-s">Vul de code van je docent in en oefen samen</div></div>
      <div class="klas-home-arr">→</div></div>`;
  } else {
    el.innerHTML = '';
    if(_klasEnabled === null) _klasProbe();
  }
}

// ── Huiswerk van de docent (één-klik oefenset) op de home ────────────
// Cache van het actuele huiswerk (resolved naar vak/domein-id's), zodat de quiz
// bij afronding synchroon kan checken of een opdracht is voltooid → beloning.
let _klasHw = [];
function _hwList(key){try{return JSON.parse(localStorage.getItem(key)||'[]');}catch(e){return [];}}
function getDemoHw(){try{return JSON.parse(localStorage.getItem('slagio_hw_demo')||'null');}catch(e){return null;}}
// Huiswerk starten: zorg dat het vak gehydrateerd is (anders is de vragenbank leeg),
// zoek het domein OF leerdoel op (duFind pakt ook geneste leerdoelen — goToDomein
// niet, die valt daarop terug op de vakpagina), en start dan direct de snelle quiz.
function hwStart(vakId, domId){
  try{
    if(typeof ensureVakData==='function' && typeof vakHydrated==='function' && typeof APP_LEVEL!=='undefined' && !vakHydrated(APP_LEVEL,vakId)){
      try{ if(typeof vonkLoading==='function') vonkLoading('Quiz laden…'); }catch(e){}
      ensureVakData(APP_LEVEL, vakId, function(){ hwStart(vakId, domId); });
      return;
    }
    try{ if(typeof vonkLoadingHide==='function') vonkLoadingHide(); }catch(e){}
    const _fail=(why)=>{ try{ if(typeof showToast==='function') showToast('Dit onderwerp is niet meer beschikbaar — kies een vak om te oefenen.','#64748b',3200); }catch(e){} try{ if(typeof openVak==='function') openVak(vakId); }catch(e){} };
    const vak=(typeof getVK==='function')?getVK().find(v=>v.id===vakId):null;
    if(!vak){ _fail('vak '+vakId+' niet gevonden'); return; }
    ST.vak=vak;
    let dom = domId && ((typeof duFind==='function')?duFind(vak,domId):(vak.domeinen||[]).find(d=>d.id===domId));
    if(!dom){ _fail('onderwerp "'+(domId||'?')+'" niet gevonden'); return; }
    // Kies een onderdeel met vragen: het domein zelf, anders het rijkste leerdoel.
    if(dom.sv && dom.sv.length){ ST.domein=dom; if(typeof startQ==='function'){startQ('snel');return;} }
    const lds=(dom.leerdoelen||[]).filter(l=>l.sv&&l.sv.length).sort((a,b)=>b.sv.length-a.sv.length);
    if(lds.length){ ST.domein=lds[0]; if(typeof startQ==='function'){startQ('snel');return;} }
    _fail('geen vragen bij "'+((dom&&dom.naam)||domId)+'"');
  }catch(e){ try{ if(typeof showToast==='function')showToast('Huiswerk-fout: '+(e&&e.message||e),'#ef4444',4500);}catch(_){}
    try{ if(typeof openVak==='function') openVak(vakId); }catch(_){} }
}
async function renderKlasHuiswerk(){
  const el = document.getElementById('klas-huiswerk-home');
  if(!el) return;
  const k = getActiveKlas();
  const demoHw = getDemoHw();
  const inKlas = !!(k && k.id && _klasEnabled!==false);
  if(!inKlas && !demoHw){ el.innerHTML=''; _klasHw=[]; return; }
  try{
    let rpcRows=[];
    if(inKlas){ const rows = await _klasRpc('klas_huiswerk_get', { p_klas_id:k.id }); rpcRows = Array.isArray(rows)?rows:(rows?[rows]:[]); }
    const list=[...(demoHw?[demoHw]:[]), ...rpcRows];
    if(!list.length){ el.innerHTML=''; _klasHw=[]; return; }
    const vakken = (typeof getVK==='function')?getVK():[];
    const done=_hwList('slagio_hw_done'), seen=_hwList('slagio_hw_seen');
    const nrm=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();
    _klasHw = list.map(hw=>{
      const key=(hw.vak||'')+'|'+(hw.domein||'')+'|'+(hw.created_at||'');
      let vakId=null,domId=null,act='openKlas()';
      // 1) Voorkeur: de opgeslagen id's (picker/demo) — geen naam-matching nodig.
      let vak = (hw.vakId && vakken.find(v=>v.id===hw.vakId)) || null;
      if(!vak) vak = vakken.find(v=>v.naam===hw.vak) || vakken.find(v=>nrm(v.naam)===nrm(hw.vak)) || (k && vakken.find(v=>v.id===k.vakId));
      if(vak){ vakId=vak.id;
        let dom = (hw.domId && ((typeof duFind==='function')?duFind(vak,hw.domId):(vak.domeinen||[]).find(d=>d.id===hw.domId))) || null;
        // 2) Fallback: domein OF leerdoel op naam, id of genormaliseerde naam.
        if(!dom) dom=(vak.domeinen||[]).find(d=>d.naam===hw.domein) || (vak.domeinen||[]).find(d=>d.id===hw.domein) || (vak.domeinen||[]).find(d=>nrm(d.naam)===nrm(hw.domein));
        if(!dom){ for(const d of (vak.domeinen||[])){ const l=(d.leerdoelen||[]).find(x=>x.naam===hw.domein||x.id===hw.domein||nrm(x.naam)===nrm(hw.domein)); if(l){dom=l;break;} } }
        // Klik op huiswerk → meteen de snelle quiz (hwStart hydrateert eerst het vak).
        if(dom){ domId=dom.id; act=`hwStart('${vak.id}','${dom.id}')`; }
        else act=`hwStart('${vak.id}','')`; }
      return {vak:hw.vak, domein:hw.domein, key, vakId, domId, act, isDone:done.includes(key)};
    });
    // Nieuw huiswerk? → duidelijke, eenmalige melding.
    const fresh=_klasHw.filter(h=>!seen.includes(h.key));
    if(fresh.length){
      fresh.forEach(h=>seen.push(h.key));
      try{localStorage.setItem('slagio_hw_seen',JSON.stringify(seen.slice(-60)));}catch(e){}
      try{ if(typeof showToast==='function') showToast('📌 Nieuw huiswerk van je docent!','#f59e0b',3400); }catch(e){}
      try{ if(typeof haptic==='function') haptic([20,45,20,45,20]); }catch(e){}
    }
    const open=_klasHw.filter(h=>!h.isDone);
    const show=open[0]||_klasHw[0];
    if(show.isDone){
      el.innerHTML=`<div class="klas-home-card klas-home-hw hw-done"><div class="klas-home-ico">✅</div><div class="klas-home-txt"><div class="klas-home-t">Huiswerk gedaan — top!</div><div class="klas-home-s">${_esc(show.domein||show.vak||'')} afgerond en beloond</div></div></div>`;
    }else{
      el.innerHTML=`<div class="klas-home-card klas-home-hw" onclick="${show.act}" role="button" tabindex="0">
        <div class="klas-home-ico">📌</div>
        <div class="klas-home-txt"><div class="klas-home-t">Huiswerk van je docent <span class="hw-badge">+ beloning</span></div><div class="klas-home-s">Oefen ${_esc(show.domein||show.vak||'de opgegeven stof')} → verdien extra XP én een kist</div></div>
        <div class="klas-home-arr">→</div></div>`;
    }
  }catch(e){ el.innerHTML=''; _klasHw=[]; }
}
// Aangeroepen door de quiz bij afronding: is er een openstaand huiswerk dat met
// deze oefening is voltooid? Zo ja: markeer als gedaan en geef het terug (de quiz
// kent de beloning toe). Rond hooguit één opdracht per keer af.
function hwOnQuizDone(vakId, domId){
  try{
    if(!_klasHw || !_klasHw.length) return null;
    const done=_hwList('slagio_hw_done');
    const vak=(typeof getVK==='function')?getVK().find(v=>v.id===vakId):null;
    const parId=(vak && typeof duParent==='function')?((duParent(vak,domId)||{}).id||null):null; // ouderdomein van een leerdoel
    const m=_klasHw.find(h=>!h.isDone && !done.includes(h.key) && h.vakId===vakId &&
      (h.domId==null || h.domId===domId || (parId && h.domId===parId)));
    if(!m) return null;
    done.push(m.key); try{localStorage.setItem('slagio_hw_done',JSON.stringify(done.slice(-120)));}catch(e){}
    m.isDone=true;
    try{ if(typeof trackEvent==='function') trackEvent('huiswerk_done',{vak:m.vak,domein:m.domein}); }catch(e){}
    return {onderwerp:m.domein||m.vak||'het huiswerk'};
  }catch(e){ return null; }
}

// ── DEMO-HUISWERK (zonder Supabase) ──────────────────────────────────
// Injecteert lokaal een nep-huiswerk zodat een docent/eigenaar zelf de hele
// leerling-flow kan zien: de melding, de kaart en de beloning bij voltooien.
// Aanzetten: open de app met ?hwdemo=1 (of roep enableHuiswerkDemo() aan in de
// console). Uitzetten: ?hwdemo=0 of disableHuiswerkDemo().
function _pickDemoDomein(){
  try{
    const vakken=(typeof getVK==='function')?getVK():[];
    if(!vakken.length)return null;
    const hasQ=d=>((d.nSv||(d.sv&&d.sv.length)||0)>0);
    const vak=vakken.find(v=>(v.domeinen||[]).some(hasQ))||vakken[0];
    const dom=(vak.domeinen||[]).find(hasQ)||(vak.domeinen||[])[0];
    if(!vak||!dom)return null;
    return {vak:vak.naam,domein:dom.naam,vakId:vak.id,domId:dom.id};
  }catch(e){return null;}
}
function _setDemoHw(){
  const pick=_pickDemoDomein(); if(!pick)return false;
  hwSetLocal(pick.vak,pick.domein,pick.vakId,pick.domId);
  return true;
}
function enableHuiswerkDemo(){
  if(!_setDemoHw()){try{if(typeof showToast==='function')showToast('Kies eerst een niveau/vak, dan werkt de demo.','#f97316');}catch(e){}return false;}
  try{if(typeof show==='function')show('sc-home');}catch(e){}
  try{renderKlasHome();}catch(e){}
  return true;
}
function disableHuiswerkDemo(){try{localStorage.removeItem('slagio_hw_demo');}catch(e){}try{renderKlasHome();}catch(e){}}

// ── DOCENT: zet een oefenquiz klaar (heldere picker, werkt ook zonder Supabase) ──
// Schrijft het huiswerk lokaal (zelfde bridge als de leerling leest) én, als je in
// een echte klas als docent zit, via de Supabase-RPC. Zo kan een docent op één
// apparaat een echte quiz klaarzetten die de leerling meteen kan doen.
function _hwHasQ(d){return ((d.nSv||(d.sv&&d.sv.length)||0)>0);}
function hwSetLocal(vakNaam, domNaam, vakId, domId){
  const rec={vak:vakNaam,domein:domNaam,vakId:vakId||null,domId:domId||null,created_at:new Date().toISOString()};
  try{localStorage.setItem('slagio_hw_demo',JSON.stringify(rec));}catch(e){}
  try{const pre=vakNaam+'|'+domNaam+'|';
    localStorage.setItem('slagio_hw_seen',JSON.stringify(_hwList('slagio_hw_seen').filter(k=>k.indexOf(pre)!==0)));
    localStorage.setItem('slagio_hw_done',JSON.stringify(_hwList('slagio_hw_done').filter(k=>k.indexOf(pre)!==0)));
  }catch(e){}
}
let _zqOpened=false;
let _zqVakList=[];
function openZetQuiz(){
  const alle=(typeof getVK==='function')?getVK():[];
  if(!alle.length){try{if(typeof showToast==='function')showToast('Kies eerst een niveau, dan kun je een quiz klaarzetten.','#f97316');}catch(e){}return;}
  // Een klas is voor één vak op één niveau: beperk de keuze tot dat vak.
  const k=(typeof getActiveKlas==='function')?getActiveKlas():null;
  let locked=null;
  if(k&&k.vakId){ locked=alle.find(v=>v.id===k.vakId)||null; }
  _zqVakList = locked?[locked]:alle;
  let ov=document.getElementById('zetquiz-ov');
  if(!ov){ov=document.createElement('div');ov.id='zetquiz-ov';ov.className='zq-ov';ov.addEventListener('click',e=>{if(e.target===ov)closeZetQuiz();});document.body.appendChild(ov);}
  const niv=(k&&k.niveau?k.niveau.toUpperCase():((typeof APP_LEVEL!=='undefined'?APP_LEVEL:'')||'').toUpperCase());
  const vakOpts=_zqVakList.map((v,i)=>`<option value="${i}">${_esc(v.naam)}</option>`).join('');
  const vakField = locked
    ? `<div class="zq-fixed">${_esc(locked.naam)}${niv?` · ${niv}`:''}</div><input type="hidden" id="zq-vak" value="0">`
    : `<label class="zq-lbl">Vak</label><select class="zq-sel" id="zq-vak" onchange="_zqFillDom()">${vakOpts}</select>`;
  ov.innerHTML=`<div class="zq-card">
    <button class="zq-x" onclick="closeZetQuiz()" aria-label="Sluiten">✕</button>
    <div class="zq-title">📌 Zet een oefenquiz klaar</div>
    <div class="zq-sub">${locked?'Voor je klas ('+_esc(locked.naam)+'). ':'Kies een vak en onderwerp. '}De leerling ziet het meteen op de startpagina en kan de quiz direct maken — met een beloning als hij 'm afrondt.</div>
    ${locked?'<label class="zq-lbl">Vak van je klas</label>':''}${vakField}
    <label class="zq-lbl">Onderwerp</label>
    <select class="zq-sel" id="zq-dom"></select>
    <button class="zq-btn" id="zq-go" onclick="_zqSet()">Zet klaar voor de klas →</button>
    <div class="zq-done" id="zq-done" hidden></div>
  </div>`;
  _zqFillDom();
  requestAnimationFrame(()=>ov.classList.add('on'));
}
function _zqFillDom(){
  const vakken=_zqVakList.length?_zqVakList:((typeof getVK==='function')?getVK():[]);
  const vi=+document.getElementById('zq-vak').value;const vak=vakken[vi]||vakken[0];
  const doms=(vak.domeinen||[]).filter(_hwHasQ);
  const sel=document.getElementById('zq-dom');
  sel.innerHTML=doms.length?doms.map(d=>`<option value="${d.id}">${_esc(d.naam)} · ${(d.nSv||(d.sv&&d.sv.length)||0)} vragen</option>`).join(''):'<option value="">Nog geen onderwerpen met vragen</option>';
}
function _zqSet(){
  const vakken=_zqVakList.length?_zqVakList:((typeof getVK==='function')?getVK():[]);
  const vi=+document.getElementById('zq-vak').value;const vak=vakken[vi]||vakken[0];
  const domId=document.getElementById('zq-dom').value; if(!domId)return;
  const dom=(vak.domeinen||[]).find(d=>d.id===domId); if(!dom)return;
  hwSetLocal(vak.naam, dom.naam, vak.id, dom.id);
  try{const k=getActiveKlas();if(k&&k.role==='docent'&&k.code){_klasRpc('klas_huiswerk_set',{p_code:k.code,p_vak:vak.naam,p_domein:dom.naam}).catch(function(){});}}catch(e){}
  const d=document.getElementById('zq-done');
  if(d){d.hidden=false;d.innerHTML=`✅ <b>${_esc(dom.naam)}</b> staat klaar voor de klas.<br><button class="zq-btn zq-btn-2" onclick="closeZetQuiz();try{show('sc-home')}catch(e){};try{renderKlasHome()}catch(e){}">Bekijk als leerling →</button>`;}
  const go=document.getElementById('zq-go');if(go)go.style.display='none';
}
function closeZetQuiz(){const ov=document.getElementById('zetquiz-ov');if(ov){ov.classList.remove('on');setTimeout(function(){if(ov&&!ov.classList.contains('on'))ov.remove();},220);}}

function _esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
