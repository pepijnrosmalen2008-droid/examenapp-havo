// ═══════ MIJN STOF ═══════
// Leerlingen oefenen met hun eigen samenvattingen. Een samenvatting is gewoon
// tekst (plakken of een .txt-bestand). Slagio haalt er zelf kaartjes uit
// (regels "begrip: uitleg" en "vraag?" met het antwoord op de regel eronder),
// maakt er een quiz van (betekenis, begrip bij uitleg, invulzinnen) en zet de
// kaartjes in het herhaalritme (SM-2). Op verzoek maakt Vonk extra vragen uit
// precies die tekst (aiGenereerVragen met stof). Daarnaast: eigen toetsen met
// datum, gekoppelde stof en een doelcijfer; die verschijnen in het Vandaag-blok.
// Alles staat lokaal per niveau in lvlCol('slagio_mijnstof').

const MS_STOP = new Set(['let op', 'tip', 'voorbeeld', 'bijvoorbeeld', 'opmerking', 'belangrijk', 'nb', 'n.b.', 'hoofdstuk', 'paragraaf', 'bron', 'bronnen', 'samenvatting', 'datum', 'naam', 'klas', 'vak', 'toets', 'zie', 'dus', 'conclusie', 'inleiding', 'stap 1', 'stap 2', 'stap 3']);
let MS = { tab: 'stof', vak: '', view: 'lijst', id: null, terug: null };

function _msKey() { return (typeof lvlCol === 'function') ? lvlCol('slagio_mijnstof') : 'slagio_mijnstof'; }
function msLaad() {
  try { const d = JSON.parse(localStorage.getItem(_msKey()) || 'null'); if (d && Array.isArray(d.n)) { d.t = d.t || []; return d; } } catch (e) {}
  return { n: [], t: [] };
}
function msBewaar(d) { try { localStorage.setItem(_msKey(), JSON.stringify(d)); return true; } catch (e) { if (typeof showToast === 'function') showToast('Je opslag is vol. Verwijder een oude samenvatting.', '#ef4444', 3200); return false; } }
function _msEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function _msId(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function _msVakNaam(id) { try { const v = (getVK() || []).find(x => x.id === id); if (v) return v.naam; } catch (e) {} return id ? 'Overig' : ''; }
function _msVakKleur(id) { try { const v = (getVK() || []).find(x => x.id === id); if (v && v.kleur) return v.kleur; } catch (e) {} return 'var(--or)'; }
function _msMix(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function _msDagen(datum) { const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((new Date(datum + 'T00:00:00') - t) / 864e5); }
function _msDagTekst(n) { return n < 0 ? 'geweest' : n === 0 ? 'vandaag' : n === 1 ? 'morgen' : 'over ' + n + ' dagen'; }

// ── Kaartjes uit de tekst ──
function _msRegel(l) { return l.replace(/^\s*(?:[-*•·▪◦–]|\d{1,2}[.)])\s+/, '').trim(); }
function _msKaartRegel(l) {
  const r = _msRegel(l).replace(/^#+\s*/, '');
  const m = r.match(/^\**([^:=]{2,70}?)\**\s*(?::|=|\s[–—-]\s)\s*(.{6,500})$/);
  if (!m) return null;
  const t = m[1].replace(/\*+/g, '').trim(), d = m[2].replace(/\*+/g, '').trim();
  if (!t || t.split(/\s+/).length > 7 || /[.!?]$/.test(t) || MS_STOP.has(t.toLowerCase())) return null;
  if (/^https?$/i.test(t) || /^\d+$/.test(t)) return null;
  return { t, d };
}
function msKaarten(tekst) {
  const regels = String(tekst || '').split(/\r?\n/), uit = [], gezien = new Set();
  for (let i = 0; i < regels.length; i++) {
    const l = _msRegel(regels[i]); if (!l) continue;
    // "Vraag?" met het antwoord op de volgende regel
    if (/\?$/.test(l) && l.length <= 200) {
      let j = i + 1; while (j < regels.length && !regels[j].trim()) j++;
      const a = j < regels.length ? _msRegel(regels[j]) : '';
      if (a && !/\?$/.test(a) && a.length >= 2 && !_msKaartRegel(regels[j])) {
        const k = l.toLowerCase(); if (!gezien.has(k)) { gezien.add(k); uit.push({ t: l, d: a, vraag: true }); }
        i = j; continue;
      }
    }
    const k = _msKaartRegel(regels[i]);
    if (k && !gezien.has(k.t.toLowerCase())) { gezien.add(k.t.toLowerCase()); uit.push(k); }
  }
  return uit;
}

// ── Quiz uit de kaartjes ──
function _msOpties(goed, pool) {
  const andere = _msMix(pool.filter(x => x && x.toLowerCase() !== goed.toLowerCase()));
  const uniek = []; andere.forEach(x => { if (uniek.length < 3 && !uniek.some(u => u.toLowerCase() === x.toLowerCase())) uniek.push(x); });
  return uniek.length === 3 ? [goed].concat(uniek) : null;
}
function msBouwVragen(notities, max) {
  max = max || 10;
  const kaarten = [], gezien = new Set();
  notities.forEach(n => msKaarten(n.tekst).forEach(k => { const s = k.t.toLowerCase(); if (!gezien.has(s)) { gezien.add(s); kaarten.push(Object.assign({ nid: n.id }, k)); } }));
  const begrip = kaarten.filter(k => !k.vraag), vraag = kaarten.filter(k => k.vraag);
  const defs = begrip.map(k => k.d), termen = begrip.map(k => k.t), antw = vraag.map(k => k.d);
  const kand = [];
  begrip.forEach(k => {
    let o = _msOpties(k.d, defs);
    if (o) kand.push({ v: `Wat betekent «${k.t}»?`, o, c: 0, u: `${k.t}: ${k.d}`, d: 1, _k: k.t });
    o = _msOpties(k.t, termen);
    if (o) kand.push({ v: `Welk begrip hoort bij deze uitleg?\n«${k.d}»`, o, c: 0, u: `${k.t}: ${k.d}`, d: 2, _k: k.t });
  });
  vraag.forEach(k => {
    const o = _msOpties(k.d, antw.length >= 4 ? antw : antw.concat(defs));
    if (o) kand.push({ v: k.t, o, c: 0, u: k.d, d: 1, _k: k.t });
  });
  // Invulzinnen: zinnen uit de lopende tekst waarin een begrip voorkomt
  if (termen.length >= 4) {
    notities.forEach(n => {
      String(n.tekst || '').split(/\r?\n/).forEach(l => {
        if (_msKaartRegel(l)) return;
        (_msRegel(l).match(/[^.!?]+[.!?]/g) || []).forEach(zin => {
          zin = zin.trim(); if (zin.length < 35 || zin.length > 230) return;
          const t = termen.find(t => t.length >= 4 && new RegExp('(^|[^\\p{L}])' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=$|[^\\p{L}])', 'iu').test(zin));
          if (!t) return;
          const o = _msOpties(t, termen); if (!o) return;
          const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
          kand.push({ v: 'Vul in:\n' + zin.replace(re, '_____'), o, c: 0, u: zin, d: 2, _k: t });
        });
      });
    });
  }
  // Vragen die Vonk eerder uit deze tekst maakte
  notities.forEach(n => { if (n.ai && n.ai.h === _msHash(n.tekst)) (n.ai.vragen || []).forEach(q => kand.push({ v: q.v, o: q.o.slice(0, 4), c: q.c, u: q.uitleg || '', d: 2, _ai: 1 })); });
  // Spreiden: niet twee keer hetzelfde begrip vlak na elkaar, AI-vragen mee in de mix
  const per = {}; _msMix(kand).forEach(q => { const s = q._k || ('ai' + Math.random()); (per[s] = per[s] || []).push(q); });
  const uit = []; let rest = Object.values(per);
  while (uit.length < max && rest.length) { rest = _msMix(rest); rest.forEach(g => { if (uit.length < max && g.length) uit.push(g.shift()); }); rest = rest.filter(g => g.length); }
  return { vragen: uit, nKaart: kaarten.length, kaarten };
}
function _msHash(s) { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }

// ── Oefenen ──
let _msLaatste = null;
function msOefen(ids, titel) {
  const d = msLaad(), notities = d.n.filter(n => ids.indexOf(n.id) >= 0);
  if (!notities.length) return;
  const r = msBouwVragen(notities, 10);
  if (r.vragen.length < 3) { msUitlegWeinig(r.nKaart); return; }
  _msLaatste = { ids, titel };
  // opties en uitleg gaan als HTML het scherm op: eigen tekst eerst ontsmetten
  const qs = r.vragen.map(q => Object.assign({}, q, { o: q.o.map(_msEsc), u: _msEsc(q.u), bron: 'Mijn stof' }));
  ST.vak = { id: 'mijnstof', naam: 'Mijn stof', domeinen: [] };
  ST.domein = { id: ids.length === 1 ? ids[0] : 'toets', naam: titel || notities[0].titel, sv: qs };
  ST.mode = 'snel'; ST.isFoutenboek = true; ST.isDailyChallenge = false; ST.adaptive = false; ST._vonkTest = null;
  ST.idx = 0; ST.score = 0; ST.antwrd = []; ST.tijdPerVraag = []; ST.combo = 0; ST.xpThisRound = 0; ST.flagged = new Set(); ST._interShown = {};
  ST.vragen = qs;
  ST.shuffleMaps = qs.map(q => _msMix(q.o.map((_, i) => i)));
  try { clearQuizDraft(); } catch (e) {}
  const meta = document.getElementById('qmeta'); if (meta) meta.textContent = 'Mijn stof · ' + (titel || notities[0].titel);
  const scq = document.getElementById('sc-quiz'); if (scq) scq.classList.remove('oud-mode');
  show('sc-quiz');
  try { playSound('start'); } catch (e) {}
  try { if (typeof _showQuizVonk === 'function') _showQuizVonk(); } catch (e) {}
  try { trackEvent('mijnstof_quiz', { n: qs.length, kaarten: r.nKaart, ai: qs.filter(q => q._ai).length }); } catch (e) {}
  const skel = document.getElementById('quiz-skeleton'), body = document.getElementById('qbody-inner');
  if (skel && body) { skel.style.display = 'flex'; body.style.display = 'none'; }
  requestAnimationFrame(() => requestAnimationFrame(() => { if (skel) skel.style.display = 'none'; if (body) body.style.display = ''; if (typeof toonV === 'function') toonV(); }));
}
function msOpnieuw() { if (_msLaatste) msOefen(_msLaatste.ids, _msLaatste.titel); else openMijnStof(); }
function msUitlegWeinig(n) {
  const tekst = n ? `Ik vond pas ${n} ${n === 1 ? 'kaartje' : 'kaartjes'}. Voor een quiz heb ik er minstens 4 nodig.` : 'Ik vond nog geen begrippen in je tekst.';
  _msSheet(`<div class="msx-vonk">${typeof mascotSVG === 'function' ? mascotSVG('denk', 72) : ''}</div>
    <h3>Nog even aanvullen</h3><p>${tekst} Zet begrippen zo in je samenvatting, elk op een eigen regel:</p>
    <pre class="msx-vb">Osmose: verplaatsing van water door een membraan
Diffusie - verspreiding van deeltjes van hoog naar laag
Wat doet een enzym?
Het versnelt een reactie zonder zelf op te raken.</pre>
    <button class="msx-knop" onclick="_msSheetDicht()">Oké</button>`);
}

// Kaartjes (flashcards met herhaalritme)
function msKaartjes(ids, titel) {
  const d = msLaad(), notities = d.n.filter(n => ids.indexOf(n.id) >= 0);
  const cards = []; const gezien = new Set();
  notities.forEach(n => msKaarten(n.tekst).forEach(k => { const s = k.t.toLowerCase(); if (!gezien.has(s)) { gezien.add(s); cards.push({ term: _msEsc(k.t), def: _msEsc(k.d), _nid: n.id, _t: k.t }); } }));
  if (!cards.length) { msUitlegWeinig(0); return; }
  const today = new Date().toISOString().slice(0, 10), sr = getSR();
  const sk = c => srKey('mijnstof', c._nid, c._t);
  let nieuw = [], due = [];
  cards.forEach(c => { const k = sk(c), s = sr[k]; if (!s) nieuw.push(Object.assign({}, c, { k, sr: {} })); else if (s.due <= today) due.push(Object.assign({}, c, { k, sr: s })); });
  let queue = _msMix(due).concat(_msMix(nieuw).slice(0, 25)), oefen = false;
  if (!queue.length) { oefen = true; queue = _msMix(cards.map(c => Object.assign({}, c, { k: sk(c), sr: sr[sk(c)] || {} }))); }
  FC = { cards: cards.map(c => ({ term: c._t, def: c.def })), queue, again: [], stats: { again: 0, hard: 0, good: 0, easy: 0 },
    vakId: 'mijnstof', domId: notities[0].id, flipped: false, sessionTotal: queue.length,
    newCount: oefen ? 0 : Math.min(nieuw.length, 25), dueCount: oefen ? queue.length : due.length, isPractice: oefen,
    terug: 'sc-mijnstof', opnieuw: () => msKaartjes(ids, titel) };
  const cardEl = document.getElementById('fc-card'); if (cardEl) { cardEl.style.display = ''; cardEl.classList.remove('flipped'); }
  document.getElementById('fc-score').innerHTML = '';
  document.getElementById('fc-btns').style.display = 'none';
  const meta = document.getElementById('fc-meta'); if (meta) meta.textContent = 'Mijn stof · ' + (titel || notities[0].titel);
  try { _fcUpdateChips(); } catch (e) {}
  show('sc-flash'); showFlashcard();
  try { playSound('start'); } catch (e) {}
  try { trackEvent('mijnstof_kaartjes', { n: queue.length }); } catch (e) {}
}

// Vonk: vragen over je eigen tekst, of extra quizvragen uit die tekst
function msVraagVonk(id) {
  const n = msLaad().n.find(x => x.id === id); if (!n || typeof openVonkChat !== 'function') return;
  openVonkChat({ vak: _msVakNaam(n.vak), onderwerp: n.titel, bron: 'Eigen samenvatting van de leerling ("' + n.titel + '"):\n' + String(n.tekst).slice(0, 4000),
    intro: `Ik heb je samenvatting <b>${_msEsc(n.titel)}</b> gelezen. Vraag me wat je niet snapt, of zeg "overhoor me".` });
  try { trackEvent('mijnstof_vonk', {}); } catch (e) {}
}
function msVonkVragen(id, knop) {
  const d = msLaad(), n = d.n.find(x => x.id === id); if (!n) return;
  if (typeof aiGenereerVragen !== 'function') return;
  if (knop) { knop.disabled = true; knop.classList.add('bezig'); knop.querySelector('b').textContent = 'Vonk leest je stof…'; }
  aiGenereerVragen({ vak: _msVakNaam(n.vak), onderwerp: n.titel, stof: n.tekst, aantal: 8 }).then(res => {
    if (knop) { knop.disabled = false; knop.classList.remove('bezig'); }
    if (res && res.vragen && res.bron === 'stof') {
      const d2 = msLaad(), n2 = d2.n.find(x => x.id === id); if (!n2) return;
      n2.ai = { h: _msHash(n2.tekst), vragen: res.vragen.filter(q => q && q.v && Array.isArray(q.o) && q.o.length === 4) };
      msBewaar(d2); msRender();
      if (typeof showToast === 'function') showToast(n2.ai.vragen.length + ' vragen van Vonk toegevoegd aan je quiz', '#22c55e', 2600);
      try { trackEvent('mijnstof_ai', { n: n2.ai.vragen.length }); } catch (e) {}
      return;
    }
    let msg = 'Vonk kan nu even geen vragen maken. Probeer het later nog eens.';
    if (res && res.login) msg = 'Log in om Vonk vragen uit je stof te laten maken.';
    else if (res && res.limit) msg = 'Je gratis AI-vragen zijn op. Met Slagio Plus kan het onbeperkt.';
    else if (res && res.oudeServer) msg = 'Vragen uit je eigen stof komen er bijna aan. Je kaartjes en de gewone quiz werken al.';
    if (knop) knop.querySelector('b').textContent = 'Laat Vonk vragen maken';
    if (typeof showToast === 'function') showToast(msg, '#f59e0b', 3600);
  });
}

// ── Scherm ──
function openMijnStof(tab, vak) {
  MS.tab = tab || MS.tab || 'stof'; MS.view = 'lijst'; MS.id = null;
  if (vak !== undefined) MS.vak = vak || '';
  show('sc-mijnstof'); msRender();
  try { trackEvent('mijnstof_open', { tab: MS.tab }); } catch (e) {}
}
function msTab(t) { MS.tab = t; MS.view = 'lijst'; msRender(); }
function msFilter(v) { MS.vak = v; msRender(); }
function msOpen(id) { MS.view = 'lees'; MS.id = id; msRender(); window.scrollTo(0, 0); }
function msNieuw(vak) { MS.view = 'bewerk'; MS.id = null; MS._nieuwVak = vak || MS.vak || ''; msRender(); window.scrollTo(0, 0); }
function msBewerk(id) { MS.view = 'bewerk'; MS.id = id; msRender(); window.scrollTo(0, 0); }
function msTerugNaarLijst() { MS.view = 'lijst'; MS.id = null; msRender(); }

function _msVakOpties(gekozen) {
  let vk = []; try { vk = getVK() || []; } catch (e) {}
  return vk.map(v => `<option value="${v.id}"${v.id === gekozen ? ' selected' : ''}>${_msEsc(v.naam)}</option>`).join('') + `<option value="anders"${gekozen === 'anders' ? ' selected' : ''}>Overig</option>`;
}

function msRender() {
  const el = document.getElementById('ms-inhoud'); if (!el) return;
  const d = msLaad();
  if (MS.view === 'bewerk') { el.innerHTML = _msBewerkHtml(d); _msLive(); return; }
  if (MS.view === 'lees') { el.innerHTML = _msLeesHtml(d); return; }
  if (MS.view === 'toets') { el.innerHTML = _msToetsBewerkHtml(d); return; }
  el.innerHTML = _msLijstHtml(d);
}

function _msLijstHtml(d) {
  const vonk = typeof mascotSVG === 'function' ? mascotSVG(d.n.length ? 'blij' : 'kijk', 64) : '';
  const tabs = `<div class="ms-seg" role="tablist"><button role="tab" class="${MS.tab === 'stof' ? 'on' : ''}" onclick="msTab('stof')">Samenvattingen<span>${d.n.length}</span></button><button role="tab" class="${MS.tab === 'toets' ? 'on' : ''}" onclick="msTab('toets')">Toetsen<span>${d.t.filter(t => _msDagen(t.datum) >= 0).length}</span></button></div>`;
  let h = `<div class="ms-kop2"><div class="ms-kop2-vonk">${vonk}</div><div><h2>Mijn stof</h2><p>${d.n.length ? 'Jouw eigen samenvattingen en toetsen. Ik maak er kaartjes en vragen van.' : 'Plak je eigen samenvatting en ik maak er kaartjes en een quiz van. Zet je toetsen erbij, dan plan ik mee.'}</p></div></div>` + tabs;
  if (MS.tab === 'toets') return h + _msToetsenHtml(d);
  const vakken = [...new Set(d.n.map(n => n.vak))];
  if (vakken.length > 1) h += `<div class="ms-chips"><button class="${!MS.vak ? 'on' : ''}" onclick="msFilter('')">Alles</button>${vakken.map(v => `<button class="${MS.vak === v ? 'on' : ''}" style="--vk:${_msVakKleur(v)}" onclick="msFilter('${v}')">${_msEsc(_msVakNaam(v))}</button>`).join('')}</div>`;
  h += `<button class="ms-plus" onclick="msNieuw()"><span class="ms-plus-ic">+</span><span><b>Samenvatting toevoegen</b><small>Plakken of een tekstbestand kiezen</small></span></button>`;
  const lijst = d.n.filter(n => !MS.vak || n.vak === MS.vak).sort((a, b) => (b.ts || 0) - (a.ts || 0));
  if (!lijst.length) return h + _msLeegHtml();
  h += '<div class="ms-lijst2">' + lijst.map(n => {
    const k = msKaarten(n.tekst).length;
    const toets = d.t.filter(t => (t.stof || []).indexOf(n.id) >= 0 && _msDagen(t.datum) >= 0).sort((a, b) => a.datum < b.datum ? -1 : 1)[0];
    return `<button class="ms-item" style="--vk:${_msVakKleur(n.vak)}" onclick="msOpen('${n.id}')">
      <span class="ms-item-vak">${_msEsc(_msVakNaam(n.vak))}</span>
      <b>${_msEsc(n.titel)}</b>
      <small>${k} ${k === 1 ? 'kaartje' : 'kaartjes'}${n.ai && n.ai.h === _msHash(n.tekst) ? ' · ' + n.ai.vragen.length + ' vragen van Vonk' : ''}${toets ? ` · <em>toets ${_msDagTekst(_msDagen(toets.datum))}</em>` : ''}</small>
    </button>`;
  }).join('') + '</div>';
  return h;
}
function _msLeegHtml() {
  return `<div class="ms-leeg"><h3>Zo werkt het</h3>
    <ol><li><b>Plak je samenvatting</b> van school, je schrift of je eigen aantekeningen.</li>
    <li>Ik haal er <b>kaartjes</b> uit: elke regel <i>begrip: uitleg</i>, en elke vraag met het antwoord eronder.</li>
    <li>Je oefent met een <b>quiz</b> en met kaartjes die op tijd terugkomen. Wil je meer, dan maakt Vonk vragen uit jouw tekst.</li></ol></div>`;
}

function _msBewerkHtml(d) {
  const n = MS.id ? d.n.find(x => x.id === MS.id) : null;
  const vak = n ? n.vak : (MS._nieuwVak || (ST && ST.vak && ST.vak.id !== 'mijnstof' ? ST.vak.id : ''));
  return `<div class="ms-topbar"><button class="ms-terug" onclick="${n ? `msOpen('${n.id}')` : 'msTerugNaarLijst()'}">Annuleren</button><b>${n ? 'Samenvatting bewerken' : 'Nieuwe samenvatting'}</b><button class="ms-opslaan" onclick="msOpslaan()">Opslaan</button></div>
  <label class="ms-veld"><span>Titel</span><input id="ms-titel" maxlength="80" placeholder="Bijv. H3 Enzymen" value="${n ? _msEsc(n.titel) : ''}"></label>
  <label class="ms-veld"><span>Vak</span><select id="ms-vak">${_msVakOpties(vak)}</select></label>
  <label class="ms-veld ms-veld-tekst"><span>Jouw samenvatting<button type="button" class="ms-bestand" onclick="document.getElementById('ms-file').click()">Tekstbestand kiezen</button></span>
  <textarea id="ms-tekst" rows="14" oninput="_msLive()" placeholder="Plak hier je samenvatting.

Begrippen werken het best zo, elk op een eigen regel:
Osmose: verplaatsing van water door een membraan
Enzym - eiwit dat een reactie versnelt

Een vraag met het antwoord eronder kan ook:
Wat is de functie van mitochondriën?
Ze leveren energie door verbranding.">${n ? _msEsc(n.tekst) : ''}</textarea></label>
  <input type="file" id="ms-file" accept=".txt,.md,text/plain,text/markdown" hidden onchange="_msBestand(this)">
  <div class="ms-gevonden" id="ms-gevonden"></div>`;
}
function _msLive() {
  const ta = document.getElementById('ms-tekst'), box = document.getElementById('ms-gevonden'); if (!ta || !box) return;
  const k = msKaarten(ta.value);
  if (!ta.value.trim()) { box.innerHTML = ''; return; }
  box.innerHTML = `<div class="ms-gev-kop">${k.length ? `Ik vond <b>${k.length}</b> ${k.length === 1 ? 'kaartje' : 'kaartjes'}` : 'Nog geen kaartjes gevonden'}${k.length && k.length < 4 ? ' · nog ' + (4 - k.length) + ' voor een quiz' : ''}</div>`
    + (k.length ? '<div class="ms-gev-chips">' + k.slice(0, 14).map(x => `<span>${_msEsc(x.t.length > 40 ? x.t.slice(0, 38) + '…' : x.t)}</span>`).join('') + (k.length > 14 ? `<span class="meer">+${k.length - 14}</span>` : '') + '</div>'
      : '<p>Zet een begrip vooraan met een dubbele punt erachter, zoals <i>Osmose: …</i></p>');
}
function _msBestand(inp) {
  const f = inp.files && inp.files[0]; if (!f) return;
  if (f.size > 400000) { if (typeof showToast === 'function') showToast('Dit bestand is te groot (max 400 kB tekst)', '#ef4444'); return; }
  const r = new FileReader();
  r.onload = () => { const ta = document.getElementById('ms-tekst'); if (!ta) return; ta.value = (ta.value ? ta.value + '\n\n' : '') + String(r.result || ''); const ti = document.getElementById('ms-titel'); if (ti && !ti.value) ti.value = f.name.replace(/\.[^.]+$/, '').slice(0, 80); _msLive(); };
  r.readAsText(f);
}
function msOpslaan() {
  const titel = (document.getElementById('ms-titel').value || '').trim(), vak = document.getElementById('ms-vak').value, tekst = (document.getElementById('ms-tekst').value || '').trim();
  if (!tekst) { if (typeof showToast === 'function') showToast('Plak eerst je samenvatting', '#f59e0b'); return; }
  const d = msLaad(); let n = MS.id ? d.n.find(x => x.id === MS.id) : null;
  const nieuw = !n;
  if (!n) { n = { id: _msId('n'), gemaakt: Date.now() }; d.n.push(n); }
  n.titel = titel || (tekst.split(/\r?\n/).find(l => l.trim()) || 'Samenvatting').replace(/^#+\s*/, '').slice(0, 60);
  n.vak = vak; n.tekst = tekst.slice(0, 60000); n.ts = Date.now();
  if (!msBewaar(d)) return;
  try { trackEvent('mijnstof_opslaan', { nieuw, kaarten: msKaarten(n.tekst).length, lengte: n.tekst.length }); } catch (e) {}
  msOpen(n.id);
}
function msVerwijder(id) {
  _msSheet(`<h3>Samenvatting verwijderen?</h3><p>Je kaartjes en de vragen van Vonk bij deze samenvatting verdwijnen ook.</p>
    <div class="msx-rij"><button class="msx-knop licht" onclick="_msSheetDicht()">Laat staan</button><button class="msx-knop rood" onclick="_msVerwijderJa('${id}')">Verwijderen</button></div>`);
}
function _msVerwijderJa(id) {
  const d = msLaad(); d.n = d.n.filter(n => n.id !== id); d.t.forEach(t => { t.stof = (t.stof || []).filter(x => x !== id); }); msBewaar(d);
  _msSheetDicht(); msTerugNaarLijst();
}

function _msOpmaak(tekst) {
  return String(tekst || '').split(/\r?\n/).map(l => {
    const r = l.trim(); if (!r) return '';
    if (/^#{1,3}\s/.test(r)) return `<h4>${_msEsc(r.replace(/^#+\s*/, ''))}</h4>`;
    const k = _msKaartRegel(r);
    if (k) return `<p class="ms-r-kaart"><b>${_msEsc(k.t)}</b><span>${_msEsc(k.d)}</span></p>`;
    if (/^\s*(?:[-*•·▪◦–]|\d{1,2}[.)])\s+/.test(l)) return `<p class="ms-r-punt">${_msEsc(_msRegel(r))}</p>`;
    if (/\?$/.test(r)) return `<p class="ms-r-vraag">${_msEsc(r)}</p>`;
    if (r.length < 60 && /:$/.test(r)) return `<h4>${_msEsc(r.slice(0, -1))}</h4>`;
    return `<p>${_msEsc(r)}</p>`;
  }).join('');
}
function _msLeesHtml(d) {
  const n = d.n.find(x => x.id === MS.id); if (!n) { MS.view = 'lijst'; return _msLijstHtml(d); }
  const k = msKaarten(n.tekst).length, r = msBouwVragen([n], 10);
  const aiOk = n.ai && n.ai.h === _msHash(n.tekst);
  const toetsen = d.t.filter(t => (t.stof || []).indexOf(n.id) >= 0 && _msDagen(t.datum) >= 0);
  return `<div class="ms-topbar"><button class="ms-terug" onclick="msTerugNaarLijst()">Mijn stof</button><span></span><button class="ms-topbar-icoon" onclick="msBewerk('${n.id}')" aria-label="Bewerken"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button></div>
  <div class="ms-lees-kop" style="--vk:${_msVakKleur(n.vak)}"><span class="ms-item-vak">${_msEsc(_msVakNaam(n.vak))}</span><h2>${_msEsc(n.titel)}</h2>
  ${toetsen.length ? `<div class="ms-lees-toets">${toetsen.map(t => `Toets <b>${_msEsc(t.naam)}</b> ${_msDagTekst(_msDagen(t.datum))}`).join(' · ')}</div>` : ''}</div>
  <div class="ms-acties">
    <button class="ms-actie hoofd" onclick="msOefen(['${n.id}'])"${r.vragen.length < 3 ? ' data-weinig="1"' : ''}><span class="ms-actie-ic">${_msIc('quiz')}</span><span><b>Quiz mij</b><small>${r.vragen.length >= 3 ? r.vragen.length + ' vragen uit je stof' : 'nog te weinig begrippen'}</small></span></button>
    <button class="ms-actie" onclick="msKaartjes(['${n.id}'])"><span class="ms-actie-ic">${_msIc('kaart')}</span><span><b>Kaartjes</b><small>${k} ${k === 1 ? 'kaartje' : 'kaartjes'}, komen op tijd terug</small></span></button>
    <button class="ms-actie" onclick="msVonkVragen('${n.id}',this)"><span class="ms-actie-ic">${_msIc('ster')}</span><span><b>${aiOk ? 'Nieuwe vragen van Vonk' : 'Laat Vonk vragen maken'}</b><small>${aiOk ? n.ai.vragen.length + ' vragen staan al in je quiz' : 'alleen uit jouw tekst'}</small></span></button>
    <button class="ms-actie" onclick="msVraagVonk('${n.id}')"><span class="ms-actie-ic ms-actie-vonk">${typeof mascotSVG === 'function' ? mascotSVG('kijk', 34) : ''}</span><span><b>Vraag Vonk</b><small>over deze samenvatting</small></span></button>
  </div>
  <div class="ms-tekst">${_msOpmaak(n.tekst)}</div>
  <button class="ms-verwijder" onclick="msVerwijder('${n.id}')">Samenvatting verwijderen</button>`;
}
function _msIc(n) {
  const p = {
    quiz: '<path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="10"/>',
    kaart: '<rect x="3" y="6" width="14" height="14" rx="2.5"/><path d="M7 3h11.5A2.5 2.5 0 0 1 21 5.5V17"/>',
    ster: '<path d="M12 3l1.9 5.3L19 10l-5.1 1.7L12 17l-1.9-5.3L5 10l5.1-1.7z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    toets: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>'
  }[n] || '';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
}

// ── Toetsen ──
function _msToetsenHtml(d) {
  let h = `<button class="ms-plus" onclick="msToetsNieuw()"><span class="ms-plus-ic">+</span><span><b>Toets toevoegen</b><small>Schooltoets, PTA of SE met datum</small></span></button>`;
  const kom = d.t.filter(t => _msDagen(t.datum) >= 0).sort((a, b) => a.datum < b.datum ? -1 : 1);
  const weg = d.t.filter(t => _msDagen(t.datum) < 0).sort((a, b) => a.datum < b.datum ? 1 : -1).slice(0, 5);
  if (!kom.length && !weg.length) return h + `<div class="ms-leeg"><h3>Zet je toetsen erin</h3><p>Dan zie je op de home hoeveel dagen je nog hebt, en zet ik oefenen met de stof voor die toets bovenaan als het dichtbij komt.</p></div>`;
  const kaart = t => {
    const n = _msDagen(t.datum), stof = (t.stof || []).map(id => d.n.find(x => x.id === id)).filter(Boolean);
    const datum = new Date(t.datum + 'T12:00:00').toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'long' });
    return `<div class="ms-toets${n >= 0 && n <= 7 ? ' dichtbij' : ''}${n < 0 ? ' geweest' : ''}" style="--vk:${_msVakKleur(t.vak)}">
      <div class="ms-toets-dag"><b>${n < 0 ? '✓' : n}</b><small>${n < 0 ? 'geweest' : n === 1 ? 'dag' : 'dagen'}</small></div>
      <div class="ms-toets-tx"><span class="ms-item-vak">${_msEsc(_msVakNaam(t.vak))}</span><b>${_msEsc(t.naam)}</b><small>${datum}${t.doel ? ' · doel: ' + String(t.doel).replace('.', ',') : ''}${stof.length ? ' · ' + stof.length + ' samenvatting' + (stof.length === 1 ? '' : 'en') : ''}</small>
      <div class="ms-toets-knoppen">${stof.length && n >= 0 ? `<button class="ms-mini hoofd" onclick="msOefenToets('${t.id}')">Oefen</button>` : ''}<button class="ms-mini" onclick="msToetsBewerk('${t.id}')">Wijzig</button></div></div></div>`;
  };
  h += kom.map(kaart).join('');
  if (weg.length) h += '<h3 class="ms-sub-kop">Geweest</h3>' + weg.map(kaart).join('');
  return h;
}
function msToetsNieuw() { MS.view = 'toets'; MS.id = null; msRender(); window.scrollTo(0, 0); }
function msToetsBewerk(id) { MS.view = 'toets'; MS.id = id; msRender(); window.scrollTo(0, 0); }
function _msToetsBewerkHtml(d) {
  const t = MS.id ? d.t.find(x => x.id === MS.id) : null;
  const vak = t ? t.vak : (MS.vak || '');
  const morgen = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
  const stof = t ? (t.stof || []) : [];
  return `<div class="ms-topbar"><button class="ms-terug" onclick="msTab('toets')">Annuleren</button><b>${t ? 'Toets wijzigen' : 'Nieuwe toets'}</b><button class="ms-opslaan" onclick="msToetsOpslaan()">Opslaan</button></div>
  <label class="ms-veld"><span>Wat voor toets?</span><input id="ms-t-naam" maxlength="60" placeholder="Bijv. Toets H3 en H4" value="${t ? _msEsc(t.naam) : ''}"></label>
  <div class="ms-veld-rij"><label class="ms-veld"><span>Vak</span><select id="ms-t-vak" onchange="_msToetsStofLijst()">${_msVakOpties(vak)}</select></label>
  <label class="ms-veld"><span>Datum</span><input type="date" id="ms-t-datum" value="${t ? t.datum : morgen}"></label></div>
  <label class="ms-veld"><span>Welk cijfer wil je halen? <i>(mag leeg)</i></span><input id="ms-t-doel" inputmode="decimal" maxlength="4" placeholder="Bijv. 7,5" value="${t && t.doel ? String(t.doel).replace('.', ',') : ''}"></label>
  <div class="ms-veld"><span>Welke stof hoort erbij?</span><div id="ms-t-stof" data-gekozen="${stof.join(',')}"></div></div>
  ${t ? `<button class="ms-verwijder" onclick="msToetsVerwijder('${t.id}')">Toets verwijderen</button>` : ''}`;
}
function _msToetsStofLijst() {
  const box = document.getElementById('ms-t-stof'); if (!box) return;
  const vak = document.getElementById('ms-t-vak').value, gekozen = (box.dataset.gekozen || '').split(',').filter(Boolean);
  const d = msLaad(), lijst = d.n.filter(n => n.vak === vak);
  box.innerHTML = lijst.length ? lijst.map(n => `<label class="ms-vink"><input type="checkbox" value="${n.id}"${gekozen.indexOf(n.id) >= 0 || (!MS.id && lijst.length <= 3) ? ' checked' : ''}><span>${_msEsc(n.titel)}</span></label>`).join('')
    : `<p class="ms-hint">Nog geen samenvatting voor dit vak. Je kunt de toets toch opslaan en later stof toevoegen.</p>`;
}
function msToetsOpslaan() {
  const naam = (document.getElementById('ms-t-naam').value || '').trim(), vak = document.getElementById('ms-t-vak').value, datum = document.getElementById('ms-t-datum').value;
  const doelRaw = (document.getElementById('ms-t-doel').value || '').replace(',', '.').trim(), doel = doelRaw ? Math.max(1, Math.min(10, parseFloat(doelRaw))) : null;
  if (!datum) { if (typeof showToast === 'function') showToast('Kies een datum', '#f59e0b'); return; }
  const stof = [...document.querySelectorAll('#ms-t-stof input:checked')].map(i => i.value);
  const d = msLaad(); let t = MS.id ? d.t.find(x => x.id === MS.id) : null;
  if (!t) { t = { id: _msId('t') }; d.t.push(t); }
  Object.assign(t, { naam: naam || ('Toets ' + _msVakNaam(vak)), vak, datum, doel: (doel && !isNaN(doel)) ? Math.round(doel * 10) / 10 : null, stof });
  msBewaar(d);
  try { trackEvent('mijnstof_toets', { dagen: _msDagen(datum), stof: stof.length }); } catch (e) {}
  MS.tab = 'toets'; MS.view = 'lijst'; MS.id = null; msRender();
}
function msToetsVerwijder(id) { const d = msLaad(); d.t = d.t.filter(t => t.id !== id); msBewaar(d); msTab('toets'); }
function msOefenToets(id) {
  const d = msLaad(), t = d.t.find(x => x.id === id); if (!t) return;
  const ids = (t.stof || []).filter(x => d.n.some(n => n.id === x));
  if (!ids.length) { msToetsBewerk(id); return; }
  msOefen(ids, t.naam);
}

// Vandaag-blok (lb.js): een toets binnen 7 dagen met stof wordt je volgende stap.
function msVandaagItems() {
  try {
    const d = msLaad();
    return d.t.filter(t => { const n = _msDagen(t.datum); return n >= 0 && n <= 7 && (t.stof || []).some(x => d.n.some(m => m.id === x)); })
      .sort((a, b) => a.datum < b.datum ? -1 : 1).slice(0, 1)
      .map(t => ({ emoji: false, rc: _msVakKleur(t.vak), ic: `<b>${_msDagen(t.datum)}d</b>`, title: _msEsc(t.naam), sub: `${_msEsc(_msVakNaam(t.vak))} · toets ${_msDagTekst(_msDagen(t.datum))} · oefen je eigen stof`, onclick: `msOefenToets('${t.id}')` }));
  } catch (e) { return []; }
}
// Menu: stand van de tegel
function msStand() {
  try {
    const d = msLaad(), t = d.t.filter(x => _msDagen(x.datum) >= 0).sort((a, b) => a.datum < b.datum ? -1 : 1)[0];
    if (t) { const n = _msDagen(t.datum); return { t: n === 0 ? 'toets vandaag' : n === 1 ? 'toets morgen' : 'toets: ' + n + ' dagen', heet: n <= 3 ? 1 : 0 }; }
    return { t: d.n.length ? d.n.length + ' ' + (d.n.length === 1 ? 'samenvatting' : 'samenvattingen') : 'je eigen stof' };
  } catch (e) { return null; }
}
// Vraag het Slagio: eigen kaartjes en alinea's die bij de zoekvraag passen
function msZoekHtml(query) {
  try {
    const q = String(query || '').toLowerCase().trim(); if (q.length < 3) return '';
    const woorden = q.split(/\s+/).filter(w => w.length >= 3 && !['wat', 'wie', 'hoe', 'waarom', 'is', 'een', 'het', 'de', 'van'].includes(w)); if (!woorden.length) return '';
    const d = msLaad(), hits = [];
    d.n.forEach(n => {
      msKaarten(n.tekst).forEach(k => { const t = k.t.toLowerCase(); if (woorden.every(w => t.indexOf(w) >= 0 || k.d.toLowerCase().indexOf(w) >= 0) && woorden.some(w => t.indexOf(w) >= 0)) hits.push({ n, k }); });
      if (!hits.some(h => h.n === n) && woorden.every(w => String(n.tekst).toLowerCase().indexOf(w) >= 0)) hits.push({ n });
    });
    if (!hits.length) return '';
    return '<div class="zk-ms"><div class="zk-ms-kop">Uit jouw stof</div>' + hits.slice(0, 3).map(h => `<button class="zk-ms-item" onclick="openMijnStof('stof');msOpen('${h.n.id}')">${h.k ? `<b>${_msEsc(h.k.t)}</b> ${_msEsc(h.k.d.length > 140 ? h.k.d.slice(0, 138) + '…' : h.k.d)}` : `<b>${_msEsc(h.n.titel)}</b> bevat "${_msEsc(query)}"`}<small>${_msEsc(h.n.titel)}</small></button>`).join('') + '</div>';
  } catch (e) { return ''; }
}
// Vakpagina: tabblad "Mijn stof" met de stof en toetsen van dat vak
function msVakHtml(vakId) {
  const d = msLaad(), lijst = d.n.filter(n => n.vak === vakId).sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const toetsen = d.t.filter(t => t.vak === vakId && _msDagen(t.datum) >= 0).sort((a, b) => a.datum < b.datum ? -1 : 1);
  let h = '';
  toetsen.forEach(t => { h += `<button class="ms-vak-toets" onclick="openMijnStof('toets')"><b>${_msDagen(t.datum)}</b><span>${_msEsc(t.naam)}<small>toets ${_msDagTekst(_msDagen(t.datum))}</small></span></button>`; });
  h += lijst.map(n => { const k = msKaarten(n.tekst).length; return `<button class="ms-item" style="--vk:${_msVakKleur(n.vak)}" onclick="openMijnStof('stof');msOpen('${n.id}')"><b>${_msEsc(n.titel)}</b><small>${k} ${k === 1 ? 'kaartje' : 'kaartjes'}</small></button>`; }).join('');
  h += `<button class="ms-plus" onclick="openMijnStof('stof','${vakId}');msNieuw('${vakId}')"><span class="ms-plus-ic">+</span><span><b>Eigen samenvatting toevoegen</b><small>Ik maak er kaartjes en een quiz van</small></span></button>`;
  h += `<button class="ms-plus licht" onclick="openMijnStof('toets','${vakId}');msToetsNieuw()"><span class="ms-plus-ic">${_msIc('toets')}</span><span><b>Toets toevoegen</b><small>Dan tel ik met je af</small></span></button>`;
  return h;
}

// Kleine sheet voor bevestigingen en uitleg
function _msSheet(html) {
  _msSheetDicht(true);
  const ov = document.createElement('div'); ov.id = 'msx-ov'; ov.className = 'msx-ov';
  ov.innerHTML = `<div class="msx-kaart" role="dialog" aria-modal="true">${html}</div>`;
  ov.addEventListener('click', e => { if (e.target === ov) _msSheetDicht(); });
  document.body.appendChild(ov); requestAnimationFrame(() => ov.classList.add('on'));
}
function _msSheetDicht(direct) { const ov = document.getElementById('msx-ov'); if (!ov) return; if (direct) { ov.remove(); return; } ov.classList.remove('on'); setTimeout(() => ov.remove(), 220); }

// Na het tekenen van het bewerkscherm van een toets de stoflijst vullen.
(function () {
  const oud = msRender;
  msRender = function () { oud(); if (MS.view === 'toets') _msToetsStofLijst(); };
})();
