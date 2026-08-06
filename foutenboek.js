// ═══════════════════════════════════════════════════════════════════════
// foutenboek.js - FOUTENBOEK 2.0
// Iedere fout van een leerling wordt automatisch opgeslagen mét: vraag, juist
// antwoord, gekozen antwoord, wanneer, hoe vaak gemaakt, en (waar bekend) het
// leerdoel + de misconceptie erachter ("waarom ging dit fout?"). Spaced
// repetition (Leitner) bepaalt wanneer je een fout opnieuw moet oefenen; goed
// beantwoorde fouten klimmen omhoog en worden uiteindelijk "beheerst".
//
// Opslag: localStorage lvlCol('foutenboek') → { qkey: record }.
// Verrijking: foutenboek-meta-<niveau>.js (lazy, alleen bij openen scherm).
// ═══════════════════════════════════════════════════════════════════════

// ─── Leitner: wachttijd (dagen) per box na een GOED herhaal-antwoord ───
var FB_WAIT = { 1: 1, 2: 3, 3: 8, 4: 20 };
var FB_MASTER_BOX = 5;            // box 5 = beheerst
var _FB_DAY = 86400000;

function fbQkey(domId, v) { return (domId || '') + '|' + (v || '').slice(0, 80); }
function _fbLoad() { try { return JSON.parse(localStorage.getItem(lvlCol('foutenboek')) || '{}'); } catch (e) { return {}; } }
function _fbStore(d) { try { localStorage.setItem(lvlCol('foutenboek'), JSON.stringify(d)); } catch (e) {} }

// Aantal open (nog niet beheerste) fouten - voor de badge op de home-knop.
function fbOpenCount() {
  const d = _fbLoad(); let n = 0;
  for (const k in d) if (!d[k].mastered) n++;
  return n;
}
// Aantal fouten die NU geoefend moeten worden (due).
function fbDueCount() {
  const d = _fbLoad(); const now = Date.now(); let n = 0;
  for (const k in d) { const e = d[k]; if (!e.mastered && (e.due || 0) <= now) n++; }
  return n;
}
// Samenvatting voor bv. het studieplan: { total, open, due, mastered }.
function fbStats() {
  const d = _fbLoad(); const now = Date.now();
  let total = 0, open = 0, due = 0, mastered = 0;
  for (const k in d) {
    const e = d[k]; total++;
    if (e.mastered) mastered++;
    else { open++; if ((e.due || 0) <= now) due++; }
  }
  return { total, open, due, mastered };
}
// ÉÉN bron voor de Foutenboek-regel in het studieplan (3 eerlijke staten).
function fbStudieplanRowHTML() {
  const s = fbStats();
  if (s.due > 0) {
    const mins = Math.max(3, Math.round(s.due * 0.7));
    return `<div class="sp-task-card sp-task-fb"><div class="sp-task-card-left">
      <div class="sp-task-card-vak">📕 Foutenboek</div>
      <div class="sp-task-card-dom">${s.due} ${s.due === 1 ? 'fout om te herhalen' : 'fouten om te herhalen'}</div>
      <div class="sp-task-card-meta">
        <button class="sp-act-btn sp-act-fb" style="padding:4px 10px;font-size:11px" onclick="fbOefen()">📕 Herhaal nu →</button>
        <span class="sp-task-card-time">~${mins} min</span>
      </div></div></div>`;
  }
  if (s.open > 0) {
    return `<div class="sp-task-card sp-task-fb-ok"><div class="sp-task-card-left">
      <div class="sp-task-card-vak">📕 Foutenboek <span style="color:#22c55e">✓</span></div>
      <div class="sp-task-card-dom">Je fouten zijn bijgewerkt${s.mastered ? ` (${s.mastered} beheerst)` : ''}. Geen herhaling nu.</div>
      <div class="sp-task-card-meta"><button class="sp-act-btn" style="padding:4px 10px;font-size:11px;background:var(--bg2);border:1px solid var(--bo);color:var(--dk)" onclick="openFoutenboek()">Bekijk →</button></div>
    </div></div>`;
  }
  return `<div class="sp-task-card sp-task-fb-empty"><div class="sp-task-card-left">
    <div class="sp-task-card-vak">📕 Foutenboek</div>
    <div class="sp-task-card-dom">Foute antwoorden verzamelen we hier, zodat je ze later slim kunt herhalen.</div>
    <div class="sp-task-card-meta"><button class="sp-act-btn" style="padding:4px 10px;font-size:11px;background:var(--bg2);border:1px solid var(--bo);color:var(--dk)" onclick="openFoutenboek()">Openen →</button></div>
  </div></div>`;
}
// Vul de altijd-zichtbare container bovenaan het studieplan. Wanneer het plan al
// is gegenereerd, zit de regel al ín "Vandaag" → hier dan leeg laten (geen dubbel).
function renderFbStudieplanRow() {
  const el = document.getElementById('sp-foutenboek-row');
  if (!el) return;
  const content = document.getElementById('studieplan-content');
  // Alleen leegmaken als het plan al een echt "Vandaag"-blok bevat (geen dubbel).
  // Bij de lege staat ("geen examens") heeft content wél tekst maar geen Vandaag.
  if (content && content.querySelector('.sp-vandaag')) { el.innerHTML = ''; return; }
  const s = fbStats();
  const badge = s.due > 0 ? `<span class="sp-vandaag-badge">${s.due} open</span>` : '';
  el.innerHTML = `<div class="sp-vandaag" style="margin-bottom:16px"><div class="sp-vandaag-header"><div class="sp-vandaag-title">📌 Vandaag</div>${badge}</div>${fbStudieplanRowHTML()}</div>`;
}

// ─── CAPTURE: aangeroepen vanuit quiz.js na elk MC-antwoord ───
// ok=false → fout: opslaan/ophogen, box terug naar 0, meteen due.
// ok=true  → als deze vraag een open fout is: promoveren (box++), evt. beheerst.
function fbRecord(q, ok, chosenText) {
  if (!q || !q.o || typeof q.c !== 'number') return;   // alleen meerkeuzevragen
  const vakId = (q._fbVak) || (ST.vak && ST.vak.id);
  const vakNaam = (q._fbVakNaam) || (ST.vak && ST.vak.naam);
  const domId = (q._fbDom) || (ST.domein && ST.domein.id);
  const domNaam = (q._fbDomNaam) || (ST.domein && ST.domein.naam);
  if (!vakId || !domId) return;
  const key = vakId + '§' + fbQkey(domId, q.v);
  const d = _fbLoad(); const now = Date.now();
  let e = d[key];
  if (!ok) {
    if (!e) e = d[key] = { vakId, vak: vakNaam, domId, dom: domNaam, v: q.v || '', first: now, count: 0, box: 0 };
    e.count = (e.count || 0) + 1;
    e.last = now; e.box = 0; e.due = now; e.mastered = false;
    e.o = q.o.slice(); e.c = q.c; if (q.u) e.u = q.u;
    e.chosen = chosenText || e.chosen || '';
    _fbStore(d);
  } else if (e && !e.mastered) {                        // goed herhaald → promoveren
    e.box = Math.min(FB_MASTER_BOX, (e.box || 0) + 1);
    e.last = now;
    if (e.box >= FB_MASTER_BOX) { e.mastered = true; e.masteredAt = now; e.due = null; }
    else e.due = now + (FB_WAIT[e.box] || 1) * _FB_DAY;
    _fbStore(d);
  }
}

// ─── VERRIJKING (lazy) ───
var _fbMetaState = 0; // 0=niet geladen, 1=laden, 2=klaar
function ensureFbMeta(cb) {
  if (_fbMetaState === 2 || typeof FB_META !== 'undefined') { _fbMetaState = 2; cb && cb(); return; }
  if (_fbMetaState === 1) { setTimeout(() => ensureFbMeta(cb), 120); return; }
  _fbMetaState = 1;
  const s = document.createElement('script');
  s.src = 'foutenboek-meta-' + (typeof APP_LEVEL !== 'undefined' ? APP_LEVEL : 'havo') + '.js';
  s.onload = () => { _fbMetaState = 2; cb && cb(); };
  s.onerror = () => { _fbMetaState = 2; cb && cb(); };   // degradeer: geen verrijking
  document.head.appendChild(s);
}
// ─── RIJKE UITLEG (Sprint 2b, lazy, optioneel) ───
// foutenboek-uitleg-<niveau>.js bestaat pas nadat build-foutenboek-uitleg.js is
// gedraaid + gecommit. Ontbreekt hij, dan degradeert alles stil naar 2a.
var _fbUitState = 0; // 0=niet geprobeerd, 1=laden, 2=klaar/faalde
function ensureFbUitleg(cb) {
  if (_fbUitState === 2 || typeof FB_UITLEG !== 'undefined') { _fbUitState = 2; cb && cb(); return; }
  if (_fbUitState === 1) { setTimeout(() => ensureFbUitleg(cb), 120); return; }
  _fbUitState = 1;
  const s = document.createElement('script');
  s.src = 'foutenboek-uitleg-' + (typeof APP_LEVEL !== 'undefined' ? APP_LEVEL : 'havo') + '.js';
  s.onload = () => { _fbUitState = 2; cb && cb(); };
  s.onerror = () => { _fbUitState = 2; cb && cb(); };   // bestaat (nog) niet → stil verder
  document.head.appendChild(s);
}
function fbUitlegFor(vakId, domId, v) {
  if (typeof FB_UITLEG === 'undefined') return null;
  const vm = FB_UITLEG[vakId]; if (!vm) return null;
  return vm[fbQkey(domId, v)] || null;
}

// Geef { lt, m, c } voor een fout, of null als niet betrouwbaar gekoppeld.
function fbEnrich(vakId, domId, v) {
  if (typeof FB_META === 'undefined' || typeof FB_LO === 'undefined') return null;
  const vm = FB_META[vakId]; if (!vm) return null;
  const lo = vm[fbQkey(domId, v)]; if (!lo) return null;
  return FB_LO[lo] || null;
}
// Inline "Waarom fout?"-blok voor in de quiz-feedback. Leeg als de vraag niet
// betrouwbaar gekoppeld is of de meta nog niet geladen is (degradeert stil).
function fbWhyWrongHTML(q) {
  if (!q) return '';
  const vakId = (q._fbVak) || (typeof ST !== 'undefined' && ST.vak && ST.vak.id);
  const domId = (q._fbDom) || (typeof ST !== 'undefined' && ST.domein && ST.domein.id);
  if (!vakId || !domId) return '';
  const enr = fbEnrich(vakId, domId, q.v);
  if (!enr || !enr.m) return '';
  return `<div class="q-why"><span class="q-why-lbl">💡 Veelgemaakte fout</span> ${_fbEsc(enr.m)}</div>`;
}

// ─── STATUS + HULP ───
function _fbStatus(e) {
  if (e.mastered) return { k: 'mastered', dot: '🟢', label: 'Beheerst' };
  if ((e.due || 0) <= Date.now()) return { k: 'due', dot: '🔴', label: 'Nu oefenen' };
  const dagen = Math.max(1, Math.round(((e.due || 0) - Date.now()) / _FB_DAY));
  return { k: 'later', dot: '🟡', label: `Over ${dagen} ${dagen === 1 ? 'dag' : 'dagen'}` };
}
function _fbAgo(ts) {
  if (!ts) return '';
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 3600) return 'zojuist';
  if (s < 86400) return Math.floor(s / 3600) + ' uur geleden';
  const dg = Math.floor(s / 86400);
  if (dg === 1) return 'gisteren';
  if (dg < 30) return dg + ' dagen geleden';
  return Math.floor(dg / 7) + ' weken geleden';
}
function _fbEsc(s) { return (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

// ─── RENDER ───
function renderFoutenboek() {
  const wrap = document.getElementById('fb-list');
  const stats = document.getElementById('fb-stats');
  if (!wrap) return;
  wrap.innerHTML = `<div class="fb-loading">Foutenboek laden…</div>`;
  ensureFbMeta(() => ensureFbUitleg(() => _renderFoutenboekInner(wrap, stats)));
}
function _renderFoutenboekInner(wrap, stats) {
  const d = _fbLoad();
  const all = Object.keys(d).map(k => Object.assign({ _key: k }, d[k]));
  const open = all.filter(e => !e.mastered);
  const mastered = all.filter(e => e.mastered);
  const now = Date.now();
  const due = open.filter(e => (e.due || 0) <= now);

  if (stats) {
    stats.innerHTML = `
      <div class="fb-stat fb-stat-due"><div class="fb-stat-n">${due.length}</div><div class="fb-stat-l">Nu oefenen</div></div>
      <div class="fb-stat fb-stat-open"><div class="fb-stat-n">${open.length}</div><div class="fb-stat-l">Open fouten</div></div>
      <div class="fb-stat fb-stat-mast"><div class="fb-stat-n">${mastered.length}</div><div class="fb-stat-l">Beheerst</div></div>`;
  }

  if (!all.length) {
    wrap.innerHTML = `<div class="fb-empty">
      <div class="fb-empty-ic">${typeof mascotSVG === 'function' ? mascotSVG('blij', 92) : '📕'}</div>
      <h3>Nog geen fouten</h3>
      <p>Zodra je een quizvraag fout hebt, bewaren we die hier, mét waarom het fout ging en wanneer je hem het beste opnieuw kunt oefenen.</p>
      <button class="fb-oefen-btn" onclick="quickOefen()">Start een quiz →</button>
    </div>`;
    return;
  }

  let html = '';

  // Grote "oefen alles wat due is"-knop
  if (due.length) {
    html += `<button class="fb-oefen-all" onclick="fbOefen()">🔴 Oefen ${due.length} ${due.length === 1 ? 'fout' : 'fouten'} nu</button>`;
  } else if (open.length) {
    html += `<div class="fb-allclear">✅ Niets te oefenen op dit moment. Kom later terug voor je herhaling.</div>`;
  }

  // Groepeer open fouten per vak
  const byVak = {};
  for (const e of open) { (byVak[e.vakId] = byVak[e.vakId] || { naam: e.vak, items: [] }).items.push(e); }
  const vakIds = Object.keys(byVak).sort((a, b) => byVak[b].items.length - byVak[a].items.length);

  for (const vid of vakIds) {
    const g = byVak[vid];
    const dueN = g.items.filter(e => (e.due || 0) <= now).length;
    // sorteer: due eerst, dan vaakst fout
    g.items.sort((a, b) => ((a.due || 0) <= now ? 0 : 1) - ((b.due || 0) <= now ? 0 : 1) || (b.count || 0) - (a.count || 0));
    html += `<div class="fb-vak">
      <div class="fb-vak-hdr">
        <span class="fb-vak-naam">${_fbEsc(g.naam || vid)}</span>
        <span class="fb-vak-meta">${g.items.length} open${dueN ? ` · ${dueN} due` : ''}</span>
        ${dueN ? `<button class="fb-vak-oefen" onclick="fbOefen('${vid}')">Oefen ${dueN} →</button>` : ''}
      </div>`;
    for (const e of g.items) {
      const st = _fbStatus(e);
      const enr = fbEnrich(e.vakId, e.domId, e.v);
      const uit = fbUitlegFor(e.vakId, e.domId, e.v);
      const correct = (e.o && typeof e.c === 'number') ? e.o[e.c] : '';
      // Rijke uitleg (2b) heeft voorrang; anders de misconceptie (2a).
      let whyHtml = '';
      if (uit && Array.isArray(uit.opts) && e.o) {
        const rows = e.o.map((opt, ix) => {
          const u = uit.opts[ix] || {};
          const cls = u.juist ? 'fb-opt-goed' : (uit.verleidelijk === ix ? 'fb-opt-verl' : 'fb-opt-fout');
          const tag = u.juist ? '✓ juist' : (uit.verleidelijk === ix ? '⚠ verleidelijk' : '✗ fout');
          return `<div class="fb-opt ${cls}"><div class="fb-opt-t"><span class="fb-opt-tag">${tag}</span> ${_fbEsc(opt)}</div>${u.w ? `<div class="fb-opt-w">${_fbEsc(u.w)}</div>` : ''}</div>`;
        }).join('');
        whyHtml = `<div class="fb-why fb-why-rich">
          <div class="fb-why-hdr">💡 Waarom ging dit fout?</div>
          ${enr ? `<div class="fb-why-lo">${_fbEsc(enr.lt)}</div>` : ''}
          <div class="fb-opts">${rows}</div>
          ${uit.herken ? `<div class="fb-herken"><span class="fb-herken-lbl">Zo herken je het:</span> ${_fbEsc(uit.herken)}</div>` : ''}
        </div>`;
      } else if (enr) {
        whyHtml = `<div class="fb-why">
          <div class="fb-why-hdr">💡 Waarom ging dit fout?</div>
          <div class="fb-why-lo">${_fbEsc(enr.lt)}</div>
          ${enr.m ? `<div class="fb-why-m">Let op: ${_fbEsc(enr.m)}</div>` : ''}
        </div>`;
      }
      html += `<div class="fb-item fb-item-${st.k}">
        <div class="fb-item-top">
          <span class="fb-dot">${st.dot}</span>
          <span class="fb-item-status">${st.label}</span>
          ${(e.count || 0) > 1 ? `<span class="fb-item-count">${e.count}× fout</span>` : ''}
          <span class="fb-item-ago">${_fbAgo(e.last)}</span>
        </div>
        <div class="fb-item-v">${_fbEsc(e.v)}</div>
        <div class="fb-item-ans"><span class="fb-ans-lbl">Juist:</span> ${_fbEsc(correct)}</div>
        ${whyHtml}
      </div>`;
    }
    html += `</div>`;
  }

  // Beheerste fouten (ingeklapt)
  if (mastered.length) {
    html += `<details class="fb-mastered">
      <summary>🟢 ${mastered.length} beheerst${mastered.length === 1 ? 'e fout' : 'e fouten'}</summary>
      <div class="fb-mastered-body">${mastered.map(e => `<div class="fb-mast-item">${_fbEsc(e.vak || '')} · ${_fbEsc((e.v || '').slice(0, 70))}${(e.v || '').length > 70 ? '…' : ''}</div>`).join('')}</div>
    </details>`;
  }

  wrap.innerHTML = html;
}

// ─── HERHAAL-OEFENING ───
// Bouwt een snelle quiz uit de opgeslagen fouten. Zonder vakId → alle due fouten.
function fbOefen(vakId) {
  ensureFbMeta();                                       // "Waarom fout?" alvast klaarzetten
  const d = _fbLoad(); const now = Date.now();
  let recs = Object.values(d).filter(e => !e.mastered && e.o && typeof e.c === 'number');
  if (vakId) recs = recs.filter(e => e.vakId === vakId);
  let due = recs.filter(e => (e.due || 0) <= now);
  if (!due.length) due = recs;                          // niets due → oefen alle open
  if (!due.length) { if (typeof showToast === 'function') showToast('Geen fouten om te oefenen 🎉', '#22c55e'); return; }
  // due eerst, vaakst fout eerst; max 15 per sessie
  due.sort((a, b) => (b.count || 0) - (a.count || 0));
  due = due.slice(0, 15);

  ST.vak = { id: due[0].vakId, naam: vakId ? due[0].vak : 'Foutenboek', domeinen: [] };
  ST.domein = { id: 'FB', naam: 'Herhaling van fouten' };
  ST.mode = 'snel'; ST.isFoutenboek = true; ST.isDailyChallenge = false; ST.adaptive = false;
  ST.idx = 0; ST.score = 0; ST.antwrd = []; ST.tijdPerVraag = []; ST.combo = 0; ST.xpThisRound = 0; ST.flagged = new Set();
  ST.vragen = due.map(r => ({ v: r.v, o: r.o.slice(), c: r.c, u: r.u || '', bron: 'Foutenboek', _fbVak: r.vakId, _fbVakNaam: r.vak, _fbDom: r.domId, _fbDomNaam: r.dom }));
  ST.shuffleMaps = ST.vragen.map(() => {
    const m = [0, 1, 2, 3];
    for (let i = 3; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[m[i], m[j]] = [m[j], m[i]]; }
    return m;
  });
  const metaEl = document.getElementById('qmeta');
  if (metaEl) metaEl.textContent = `📕 Foutenboek · ${due.length} ${due.length === 1 ? 'vraag' : 'vragen'}`;
  const scq = document.getElementById('sc-quiz'); if (scq) scq.classList.remove('oud-mode');
  show('sc-quiz');
  try { playSound('start'); } catch (e) {}
  try { trackEvent('foutenboek_oefen', { aantal: due.length, vak: vakId || null }); } catch (e) {}
  const skel = document.getElementById('quiz-skeleton'); const body = document.getElementById('qbody-inner');
  if (skel && body) { skel.style.display = 'flex'; body.style.display = 'none'; }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (skel) skel.style.display = 'none';
    if (body) body.style.display = '';
    toonV();
  }));
}

// Home-knop badge bijwerken (mobiel + desktop-bento)
function fbUpdateBadge() {
  const n = fbDueCount();
  ['fb-home-badge', 'fb-bento-badge'].forEach(id => {
    const b = document.getElementById(id);
    if (!b) return;
    if (n > 0) { b.textContent = n; b.style.display = ''; }
    else b.style.display = 'none';
  });
}
function openFoutenboek() {
  show('sc-foutenboek'); renderFoutenboek();
  try { trackEvent('foutenboek_open', {}); } catch (e) {}
  try { setTimeout(() => { if (typeof vonkOnboard === 'function') vonkOnboard('foutenboek'); }, 750); } catch (e) {}
}

// ═══════════════════════════════════════════════════════════════════════
// "VRAAG HET AAN VONK" — persoonlijke fout-coach (na een fout).
// Vonk laat zien waarom het fout ging (voorgegenereerde uitleg/misconceptie),
// laat je één vergelijkbare vraag oefenen, en markeert het onderwerp als
// verbeterd (promoveert de foutenboek-entry via SM-2) als je die goed maakt.
// Geen live AI: alle uitleg is voorgegenereerd → gratis, snel, privacy-vriendelijk.
// ═══════════════════════════════════════════════════════════════════════
var _vcCtx = null, _vcCorrectText = '';

function vonkCoachFromQuiz() {
  try {
    const q = ST.vragen[ST.idx]; const a = (ST.antwrd && ST.antwrd[ST.idx]) || {};
    openVonkCoach({ vakId: ST.vak.id, vakNaam: ST.vak.naam, domId: ST.domein.id, domNaam: ST.domein.naam,
      v: q.v, o: q.o, c: q.c, chosen: a.chosenText, u: q.u });
  } catch (e) {}
}

function _vonkSimilarQ(vakId, domId, excludeV) {
  try {
    const vakken = (typeof getVK === 'function') ? getVK() : [];
    const vak = vakken.find(v => v.id === vakId); if (!vak) return null;
    const dom = (vak.domeinen || []).find(d => d.id === domId); if (!dom) return null;
    const pool = [].concat(dom.sv || [], dom.oe || [])
      .filter(q => q && (q.v || '') !== excludeV && (q.a || q.o) && typeof q.c === 'number');
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  } catch (e) { return null; }
}

function openVonkCoach(ctx) {
  if (!ctx) return;
  _vcCtx = ctx;
  let el = document.getElementById('vonk-coach');
  if (!el) { el = document.createElement('div'); el.id = 'vonk-coach'; document.body.appendChild(el); }
  const uit = (typeof fbUitlegFor === 'function' && fbUitlegFor(ctx.vakId, ctx.domId, ctx.v)) || null;
  const enr = (typeof fbEnrich === 'function' && fbEnrich(ctx.vakId, ctx.domId, ctx.v)) || null;
  const why = uit || (enr && enr.m) || ctx.u || 'Kijk goed naar het juiste antwoord en waaróm dat klopt. Snap je die stap, dan pak je een vergelijkbare vraag zo.';
  const juist = ctx.o ? (ctx.o[ctx.c] || '') : '';
  const fox = (typeof mascotSVG === 'function') ? mascotSVG('kijk', 60) : '🦊';
  el.innerHTML = `<div class="vc-back" onclick="closeVonkCoach()"></div>
    <div class="vc-card" role="dialog">
      <button class="vc-x" onclick="closeVonkCoach()" aria-label="Sluiten">✕</button>
      <div class="vc-head"><div class="vc-fox">${fox}</div>
        <div><div class="vc-title">Even samen kijken</div><div class="vc-sub">${_fbEsc(ctx.domNaam || '')}</div></div></div>
      <div class="vc-body" id="vc-body">
        <div class="vc-q">${_fbEsc(ctx.v || '')}</div>
        <div class="vc-ans">
          <span class="vc-a vc-a-wrong"><b>Jouw antwoord</b>${_fbEsc(ctx.chosen || '-')}</span>
          <span class="vc-a vc-a-right"><b>Juist</b>${_fbEsc(juist)}</span>
        </div>
        <div class="vc-why"><span class="vc-why-lbl">Waarom ging dit fout?</span><span class="vc-why-tx">${_fbEsc(why)}</span></div>
      </div>
      <button class="vc-cta" id="vc-cta" onclick="vonkCoachPractice()">Oefen een vergelijkbare vraag →</button>
    </div>`;
  requestAnimationFrame(() => el.classList.add('on'));
  try { trackEvent('vonk_coach_open', { dom: ctx.domId }); } catch (e) {}
}

function vonkCoachPractice() {
  const ctx = _vcCtx; if (!ctx) return;
  const body = document.getElementById('vc-body'); const cta = document.getElementById('vc-cta');
  const q = _vonkSimilarQ(ctx.vakId, ctx.domId, ctx.v);
  if (!q) { // geen vraag beschikbaar → deep-link naar het domein
    if (cta) { cta.textContent = 'Oefen dit domein →'; cta.onclick = function () { closeVonkCoach(); try { if (typeof goToDomein === 'function') goToDomein(ctx.vakId, ctx.domId, 'snel'); else if (typeof openVak === 'function') openVak(ctx.vakId); } catch (e) {} }; }
    return;
  }
  const opts = (q.a || q.o || []).slice(); _vcCorrectText = opts[q.c];
  const idxs = opts.map((_, i) => i);
  for (let i = idxs.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = idxs[i]; idxs[i] = idxs[j]; idxs[j] = t; }
  body.innerHTML = `<div class="vc-practice-lbl">Vergelijkbare vraag</div>
    <div class="vc-q">${_fbEsc(q.v || '')}</div>
    <div class="vc-opts">${idxs.map(i => `<button class="vc-opt" onclick="vonkCoachAnswer(this,${opts[i] === _vcCorrectText ? 1 : 0})">${_fbEsc(opts[i])}</button>`).join('')}</div>
    <div class="vc-result" id="vc-result"></div>`;
  if (cta) cta.style.display = 'none';
}

function vonkCoachAnswer(btn, ok) {
  const opts = document.querySelectorAll('.vc-opt'); opts.forEach(b => b.disabled = true);
  const res = document.getElementById('vc-result');
  if (ok) {
    btn.classList.add('vc-opt-ok');
    try { if (typeof fbRecord === 'function') fbRecord({ v: _vcCtx.v, o: _vcCtx.o, c: _vcCtx.c, _fbVak: _vcCtx.vakId, _fbVakNaam: _vcCtx.vakNaam, _fbDom: _vcCtx.domId, _fbDomNaam: _vcCtx.domNaam }, true); } catch (e) {}
    try { _vonkMarkVerbeterd(_vcCtx.domId); } catch (e) {}
    if (res) res.innerHTML = `<div class="vc-good">Top! Je snapt het nu. Ik heb <b>${_fbEsc(_vcCtx.domNaam || 'dit onderwerp')}</b> als verbeterd gemarkeerd. ✓</div>`;
    try { if (typeof vonkReact === 'function') vonkReact('feest', 'Verbeterd!'); } catch (e) {}
    try { if (typeof playSound === 'function') playSound('correct'); } catch (e) {}
  } else {
    btn.classList.add('vc-opt-no');
    opts.forEach(b => { if (b.textContent === _vcCorrectText) b.classList.add('vc-opt-ok'); });
    if (res) res.innerHTML = `<div class="vc-bad">Nog niet - het juiste antwoord staat groen. Kijk nog eens naar de uitleg hierboven, je pakt 'm de volgende keer.</div>`;
    try { if (typeof playSound === 'function') playSound('wrong'); } catch (e) {}
  }
}

function _vonkMarkVerbeterd(domId) {
  try {
    const t = new Date().toISOString().slice(0, 10); let s = {};
    try { s = JSON.parse(localStorage.getItem('slagio_verbeterd') || '{}'); } catch (e) {}
    if (s.d !== t) { s.d = t; s.n = 0; } s.n = (s.n || 0) + 1;
    localStorage.setItem('slagio_verbeterd', JSON.stringify(s));
  } catch (e) {}
  try { trackEvent('vonk_coach_verbeterd', { dom: domId }); } catch (e) {}
}

function closeVonkCoach() { const el = document.getElementById('vonk-coach'); if (el) el.classList.remove('on'); }
