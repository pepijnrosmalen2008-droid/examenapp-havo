// ═══════ KLAS (Fase 0: klascode-systeem) ═══════
// Docent maakt een klas → korte code. Leerlingen (anoniem via _DID of
// ingelogd) sluiten zich aan met de code. Klas-leaderboard telt de scores
// van de leden op. Alle DB-toegang loopt via SECURITY DEFINER-RPC's in
// Supabase (zie klas-supabase.sql); tot die er zijn toont de UI "binnenkort".

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
  <details class="klas-doc">
    <summary>Ik ben docent — maak een klas aan</summary>
    <div class="klas-doc-body">
      <p class="klas-doc-note">Je hebt een gratis Slagio-account nodig zodat je klas bewaard blijft.</p>
      <label class="klas-lbl" for="klas-new-naam">Naam van de klas</label>
      <input id="klas-new-naam" class="klas-input" maxlength="40" placeholder="Bijv. 5 HAVO biologie">
      <div class="klas-row">
        <div style="flex:1"><label class="klas-lbl" for="klas-new-niv">Niveau</label>
          <select id="klas-new-niv" class="klas-input"><option value="havo">HAVO</option><option value="vwo">VWO</option></select></div>
        <div style="flex:1"><label class="klas-lbl" for="klas-new-vak">Vak (optioneel)</label>
          <select id="klas-new-vak" class="klas-input"><option value="">—</option>${vakOpts}</select></div>
      </div>
      <button class="klas-btn klas-btn-primary" onclick="klasMaak()">Klas aanmaken →</button>
      <div id="klas-new-err" class="klas-err"></div>
    </div>
  </details>`;
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
    if(err) err.innerHTML='Maak eerst een gratis account aan (via <b onclick="openProfiel()" style="cursor:pointer;color:var(--or)">Profiel</b>) — dan blijft je klas bewaard.';
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
      <div class="klas-code-lbl">Klascode — deel deze met je leerlingen</div>
      <div class="klas-code-big" id="klas-code-big">${k.code}</div>
      <button class="klas-btn klas-btn-ghost" onclick="klasDeel()">📤 Code delen / kopiëren</button>
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
  <div class="klas-lb-head"><span>🏆 Klas-ranglijst</span><span class="klas-lb-sub" id="klas-leden-count"></span></div>
  <div id="klas-lb" class="klas-lb"><div class="klas-empty">Laden…</div></div>`;
}

async function _klasLoadDetail(k){
  const lb = document.getElementById('klas-lb');
  const cnt = document.getElementById('klas-leden-count');
  try{
    const [rows, info] = await Promise.all([
      _klasRpc('klas_leaderboard', { p_klas_id:k.id }),
      _klasRpc('klas_info', { p_klas_id:k.id }).catch(()=>null)
    ]);
    if(cnt && info){ const i=Array.isArray(info)?info[0]:info; if(i) cnt.textContent = i.leden+' leerling'+(i.leden==1?'':'en'); }
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

function _esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
