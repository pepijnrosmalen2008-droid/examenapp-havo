// ═══════ MIJN STOF ═══════
// Leerlingen oefenen met hun eigen samenvattingen. Een samenvatting is gewoon
// tekst (plakken of een .txt-bestand). Slagio haalt er zelf kaartjes uit
// (regels "begrip: uitleg" en "vraag?" met het antwoord op de regel eronder),
// maakt er een quiz van (betekenis, begrip bij uitleg, invulzinnen) en zet de
// kaartjes in het herhaalritme (SM-2). Op verzoek maakt Vonk extra vragen uit
// precies die tekst (aiGenereerVragen met stof). Daarnaast: eigen toetsen met
// datum, gekoppelde stof en een doelcijfer; die verschijnen in het Vandaag-blok.
// Alles staat per niveau in lvlCol('slagio_mijnstof') en gaat met het account
// mee: in de kolom user_data.mijnstof, of zolang die er niet is in de sync-bundel.
// Ook: foto van je schrift naar tekst (aiFotoNaarTekst), Slagio-begrippen als
// begin, scores en zwakke begrippen per samenvatting, voortgang per toets en
// eigen ezelsbruggetjes bij quizvragen.

const MS_STOP = new Set(['let op', 'tip', 'voorbeeld', 'bijvoorbeeld', 'opmerking', 'belangrijk', 'nb', 'n.b.', 'hoofdstuk', 'paragraaf', 'bron', 'bronnen', 'samenvatting', 'datum', 'naam', 'klas', 'vak', 'toets', 'zie', 'dus', 'conclusie', 'inleiding', 'stap 1', 'stap 2', 'stap 3']);
let MS = { tab: 'stof', vak: '', view: 'lijst', id: null, terug: null };

function _msKey() { return (typeof lvlCol === 'function') ? lvlCol('slagio_mijnstof') : 'slagio_mijnstof'; }
function msLaad() {
  try { const d = JSON.parse(localStorage.getItem(_msKey()) || 'null'); if (d && Array.isArray(d.n)) { d.t = d.t || []; d.x = d.x || {}; d.e = d.e || {}; return d; } } catch (e) {}
  return { n: [], t: [], x: {}, e: {} };
}
function msBewaar(d, stil) { try { localStorage.setItem(_msKey(), JSON.stringify(d)); if (!stil) _msCloudPlan(); return true; } catch (e) { if (typeof showToast === 'function') showToast('Je opslag is vol. Verwijder een oude samenvatting.', '#ef4444', 3200); return false; } }
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
function msBouwVragen(notities, max, focus) {
  max = max || 10;
  const kaarten = [], gezien = new Set();
  notities.forEach(n => msKaarten(n.tekst).forEach(k => { const s = k.t.toLowerCase(); if (!gezien.has(s)) { gezien.add(s); kaarten.push(Object.assign({ nid: n.id }, k)); } }));
  const begrip = kaarten.filter(k => !k.vraag), vraag = kaarten.filter(k => k.vraag);
  const defs = begrip.map(k => k.d), termen = begrip.map(k => k.t), antw = vraag.map(k => k.d);
  const kand = [];
  begrip.forEach(k => {
    let o = _msOpties(k.d, defs);
    if (o) kand.push({ v: `Wat betekent «${k.t}»?`, o, c: 0, u: `${k.t}: ${k.d}`, d: 1, _k: k.t, _nid: k.nid });
    o = _msOpties(k.t, termen);
    if (o) kand.push({ v: `Welk begrip hoort bij deze uitleg?\n«${k.d}»`, o, c: 0, u: `${k.t}: ${k.d}`, d: 2, _k: k.t, _nid: k.nid });
  });
  vraag.forEach(k => {
    const o = _msOpties(k.d, antw.length >= 4 ? antw : antw.concat(defs));
    if (o) kand.push({ v: k.t, o, c: 0, u: k.d, d: 1, _k: k.t, _nid: k.nid });
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
          kand.push({ v: 'Vul in:\n' + zin.replace(re, '_____'), o, c: 0, u: zin, d: 2, _k: t, _nid: n.id });
        });
      });
    });
  }
  // Vragen die Vonk eerder uit deze tekst maakte
  notities.forEach(n => { if (n.ai && n.ai.h === _msHash(n.tekst)) (n.ai.vragen || []).forEach(q => kand.push({ v: q.v, o: q.o.slice(0, 4), c: q.c, u: q.uitleg || '', d: 2, _ai: 1, _nid: n.id })); });
  // Spreiden: niet twee keer hetzelfde begrip vlak na elkaar, AI-vragen mee in de mix
  const per = {}; _msMix(kand).forEach(q => { const s = q._k || ('ai' + Math.random()); (per[s] = per[s] || []).push(q); });
  const uit = []; let rest = Object.values(per);
  // Zwakke begrippen eerst (Oefen wat je fout had)
  if (focus && focus.size) { const f = rest.filter(g => focus.has(g[0]._k)); rest = rest.filter(g => !focus.has(g[0]._k)); _msMix(f).forEach(g => { while (g.length && uit.length < max && uit.filter(q => q._k === g[0]._k).length < 2) uit.push(g.shift()); }); }
  while (uit.length < max && rest.length) { rest = _msMix(rest); rest.forEach(g => { if (uit.length < max && g.length) uit.push(g.shift()); }); rest = rest.filter(g => g.length); }
  return { vragen: uit, nKaart: kaarten.length, kaarten };
}
function _msHash(s) { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }

// ── Oefenen ──
let _msLaatste = null;
function msOefen(ids, titel, focus) {
  const d = msLaad(), notities = d.n.filter(n => ids.indexOf(n.id) >= 0);
  if (!notities.length) return;
  const r = msBouwVragen(notities, 10, focus ? new Set(focus) : null);
  if (r.vragen.length < 3) { msUitlegWeinig(r.nKaart); return; }
  _msLaatste = { ids, titel, focus };
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
function msOpnieuw() { if (_msLaatste) msOefen(_msLaatste.ids, _msLaatste.titel, _msLaatste.focus); else openMijnStof(); }
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
  _msOefendag(ids);
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
  MS._vers = true; setTimeout(() => { MS._vers = false; }, 0);
  try { trackEvent('mijnstof_open', { tab: MS.tab }); } catch (e) {}
}
function msTab(t) { MS.tab = t; MS.view = 'lijst'; msRender(); }
function msFilter(v) { MS.vak = v; msRender(); }
// Elke weergave binnen Mijn stof is een stap terug (vegen of terugknop), behalve
// als het scherm net in dezelfde tik is geopend (dan telt de schermwissel al).
function _msStap() { if (!MS._vers && typeof navStap === 'function') navStap(); }
function msOpen(id) { _msStap(); MS.view = 'lees'; MS.id = id; msRender(); window.scrollTo(0, 0); }
function msNieuw(vak) { _msStap(); MS.view = 'bewerk'; MS.id = null; MS._nieuwVak = vak || MS.vak || ''; msRender(); window.scrollTo(0, 0); }
function msBewerk(id) { _msStap(); MS.view = 'bewerk'; MS.id = id; msRender(); window.scrollTo(0, 0); }
function msTerugNaarLijst() { terug(() => { MS.view = 'lijst'; MS.id = null; msRender(); }); }

function _msVakOpties(gekozen) {
  let vk = []; try { vk = getVK() || []; } catch (e) {}
  return vk.map(v => `<option value="${v.id}"${v.id === gekozen ? ' selected' : ''}>${_msEsc(v.naam)}</option>`).join('') + `<option value="anders"${gekozen === 'anders' ? ' selected' : ''}>Overig</option>`;
}

function msRender() {
  const el = document.getElementById('ms-inhoud'); if (!el) return;
  const d = msLaad();
  if (MS.view === 'bewerk') { el.innerHTML = _msBewerkHtml(d); _msConceptTerug(d); _msLive(); return; }
  if (MS.view === 'lees') { el.innerHTML = _msLeesHtml(d); return; }
  if (MS.view === 'toets') { el.innerHTML = _msToetsBewerkHtml(d); return; }
  el.innerHTML = _msLijstHtml(d);
}

function _msLijstHtml(d) {
  const vonk = typeof mascotSVG === 'function' ? mascotSVG(d.n.length ? 'blij' : 'kijk', 64) : '';
  const nE = Object.keys(d.e).length;
  const tabs = `<div class="ms-seg" role="tablist"><button role="tab" class="${MS.tab === 'stof' ? 'on' : ''}" onclick="msTab('stof')">Stof<span>${d.n.length}</span></button><button role="tab" class="${MS.tab === 'toets' ? 'on' : ''}" onclick="msTab('toets')">Toetsen<span>${d.t.filter(t => _msDagen(t.datum) >= 0).length}</span></button><button role="tab" class="${MS.tab === 'ezel' ? 'on' : ''}" onclick="msTab('ezel')">Bruggetjes<span>${nE}</span></button></div>`;
  let h = `<div class="ms-kop2"><div class="ms-kop2-vonk">${vonk}</div><div><h2>Mijn stof</h2><p>${d.n.length ? 'Jouw eigen samenvattingen en toetsen. Ik maak er kaartjes en vragen van.' : 'Plak je eigen samenvatting en ik maak er kaartjes en een quiz van. Zet je toetsen erbij, dan plan ik mee.'}</p></div></div>` + tabs;
  if (MS.tab === 'toets') return h + _msToetsenHtml(d);
  if (MS.tab === 'ezel') return h + _msEzelLijstHtml(d);
  const vakken = [...new Set(d.n.map(n => n.vak))];
  if (vakken.length > 1) h += `<div class="ms-chips"><button class="${!MS.vak ? 'on' : ''}" onclick="msFilter('')">Alles</button>${vakken.map(v => `<button class="${MS.vak === v ? 'on' : ''}" style="--vk:${_msVakKleur(v)}" onclick="msFilter('${v}')">${_msEsc(_msVakNaam(v))}</button>`).join('')}</div>`;
  h += `<button class="ms-plus" onclick="msNieuw()"><span class="ms-plus-ic">+</span><span><b>Samenvatting toevoegen</b><small>Plakken, een foto van je schrift of een tekstbestand</small></span></button>`;
  const lijst = d.n.filter(n => !MS.vak || n.vak === MS.vak).sort((a, b) => (b.ts || 0) - (a.ts || 0));
  if (!lijst.length) return h + _msLeegHtml();
  h += '<div class="ms-lijst2">' + lijst.map(n => {
    const k = msKaarten(n.tekst).length;
    const toets = d.t.filter(t => (t.stof || []).indexOf(n.id) >= 0 && _msDagen(t.datum) >= 0).sort((a, b) => a.datum < b.datum ? -1 : 1)[0];
    return `<button class="ms-item" style="--vk:${_msVakKleur(n.vak)}" onclick="msOpen('${n.id}')">
      <span class="ms-item-vak">${_msEsc(_msVakNaam(n.vak))}</span>
      <b>${_msEsc(n.titel)}</b>
      <small>${k} ${k === 1 ? 'kaartje' : 'kaartjes'}${n.ai && n.ai.h === _msHash(n.tekst) ? ' · ' + n.ai.vragen.length + ' vragen van Vonk' : ''}${toets ? ` · <em>toets ${_msDagTekst(_msDagen(toets.datum))}</em>` : ''}</small>
      ${_msScoreBalk(n)}
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
  return `<div class="ms-topbar"><button class="ms-terug" onclick="_msConceptWeg();msTerugNaarLijst()">Annuleren</button><b>${n ? 'Samenvatting bewerken' : 'Nieuwe samenvatting'}</b><button class="ms-opslaan" onclick="msOpslaan()">Opslaan</button></div>
  <label class="ms-veld"><span>Titel</span><input id="ms-titel" maxlength="80" oninput="_msConceptBewaar()" placeholder="Bijv. H3 Enzymen" value="${n ? _msEsc(n.titel) : ''}"></label>
  <label class="ms-veld"><span>Vak</span><select id="ms-vak">${_msVakOpties(vak)}</select></label>
  <div class="ms-bronnen">
    <button type="button" class="ms-bron" onclick="document.getElementById('ms-foto').click()"><span class="ms-bron-ic">${_msIc('foto')}</span><b>Foto van je schrift</b><small>Vonk zet het om</small></button>
    <button type="button" class="ms-bron" onclick="msSlagioBegrippen()"><span class="ms-bron-ic">${_msIc('boek')}</span><b>Slagio-begrippen</b><small>als begin</small></button>
    <button type="button" class="ms-bron" onclick="document.getElementById('ms-file').click()"><span class="ms-bron-ic">${_msIc('bestand')}</span><b>Tekstbestand</b><small>.txt of .md</small></button>
  </div>
  <input type="file" id="ms-foto" accept="image/*" multiple hidden onchange="msFotoGekozen(this)">
  <label class="ms-veld ms-veld-tekst"><span>Jouw samenvatting</span>
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
// Concept: wat je typt blijft bewaard tot je opslaat of annuleert, ook als je per ongeluk wegklikt of de app sluit.
function _msConceptKey() { return lvlCol('slagio_ms_concept'); }
let _msConceptT = null;
function _msConceptBewaar() {
  clearTimeout(_msConceptT);
  _msConceptT = setTimeout(() => {
    const ta = document.getElementById('ms-tekst'), ti = document.getElementById('ms-titel'), vk = document.getElementById('ms-vak'); if (!ta) return;
    try { localStorage.setItem(_msConceptKey(), JSON.stringify({ id: MS.id || 'nieuw', titel: ti ? ti.value : '', vak: vk ? vk.value : '', tekst: ta.value.slice(0, 60000), ts: Date.now() })); } catch (e) {}
  }, 400);
}
function _msConceptWeg() { clearTimeout(_msConceptT); try { localStorage.removeItem(_msConceptKey()); } catch (e) {} }
function _msConceptTerug(d) {
  let c = null; try { c = JSON.parse(localStorage.getItem(_msConceptKey()) || 'null'); } catch (e) {}
  if (!c || c.id !== (MS.id || 'nieuw')) return;
  const n = MS.id ? d.n.find(x => x.id === MS.id) : null;
  if (!c.tekst.trim() || (n && n.tekst === c.tekst.trim() && n.titel === c.titel.trim())) return;
  const ta = document.getElementById('ms-tekst'), ti = document.getElementById('ms-titel'), vk = document.getElementById('ms-vak'); if (!ta) return;
  ta.value = c.tekst; if (ti) ti.value = c.titel || ''; if (vk && c.vak && vk.querySelector(`option[value="${c.vak}"]`)) vk.value = c.vak;
  const box = document.createElement('div'); box.className = 'ms-concept';
  box.innerHTML = `<span>Je tekst van de vorige keer staat er weer. Hij was nog niet opgeslagen.</span><button type="button" onclick="_msConceptWeg();msRender()">Weggooien</button>`;
  const top = document.querySelector('#ms-inhoud .ms-topbar') || document.querySelector('.ms-topbar'); if (top) top.after(box);
}
function _msLive() {
  _msConceptBewaar();
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
  _msConceptWeg();
  try { trackEvent('mijnstof_opslaan', { nieuw, kaarten: msKaarten(n.tekst).length, lengte: n.tekst.length }); } catch (e) {}
  // Bewerken kwam van de samenvatting: terug daarheen. Nieuw: de editor wordt de samenvatting.
  if (nieuw) { MS.view = 'lees'; MS.id = n.id; msRender(); window.scrollTo(0, 0); }
  else terug(() => { MS.view = 'lees'; MS.id = n.id; msRender(); });
}
function msVerwijder(id) {
  _msSheet(`<h3>Samenvatting verwijderen?</h3><p>Je kaartjes en de vragen van Vonk bij deze samenvatting verdwijnen ook.</p>
    <div class="msx-rij"><button class="msx-knop licht" onclick="_msSheetDicht()">Laat staan</button><button class="msx-knop rood" onclick="_msVerwijderJa('${id}')">Verwijderen</button></div>`);
}
function _msVerwijderJa(id) {
  const d = msLaad(); d.n = d.n.filter(n => n.id !== id); d.x[id] = Date.now(); d.t.forEach(t => { t.stof = (t.stof || []).filter(x => x !== id); t.ts = Date.now(); }); msBewaar(d);
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
  ${_msStandHtml(n)}
  <div class="ms-tekst">${_msOpmaak(n.tekst)}</div>
  <button class="ms-verwijder" onclick="msVerwijder('${n.id}')">Samenvatting verwijderen</button>`;
}
function _msIc(n) {
  const p = {
    quiz: '<path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="10"/>',
    kaart: '<rect x="3" y="6" width="14" height="14" rx="2.5"/><path d="M7 3h11.5A2.5 2.5 0 0 1 21 5.5V17"/>',
    ster: '<path d="M12 3l1.9 5.3L19 10l-5.1 1.7L12 17l-1.9-5.3L5 10l5.1-1.7z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    toets: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    foto: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
    boek: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
    bestand: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    brug: '<path d="M3 17c3-6 15-6 18 0"/><path d="M3 17v3M21 17v3M8 13v7M16 13v7M12 12v8"/>'
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
      ${n >= 0 ? _msToetsVoortgang(t, stof) : ''}
      <div class="ms-toets-knoppen">${stof.length && n >= 0 ? `<button class="ms-mini hoofd" onclick="msOefenToets('${t.id}')">Oefen</button>` : ''}<button class="ms-mini" onclick="msToetsBewerk('${t.id}')">Wijzig</button></div></div></div>`;
  };
  h += kom.map(kaart).join('');
  if (weg.length) h += '<h3 class="ms-sub-kop">Geweest</h3>' + weg.map(kaart).join('');
  return h;
}
function msToetsNieuw() { _msStap(); MS.view = 'toets'; MS.id = null; msRender(); window.scrollTo(0, 0); }
function msToetsBewerk(id) { _msStap(); MS.view = 'toets'; MS.id = id; msRender(); window.scrollTo(0, 0); }
function _msToetsBewerkHtml(d) {
  const t = MS.id ? d.t.find(x => x.id === MS.id) : null;
  const vak = t ? t.vak : (MS.vak || '');
  const morgen = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
  const stof = t ? (t.stof || []) : [];
  return `<div class="ms-topbar"><button class="ms-terug" onclick="terug(() => msTab('toets'))">Annuleren</button><b>${t ? 'Toets wijzigen' : 'Nieuwe toets'}</b><button class="ms-opslaan" onclick="msToetsOpslaan()">Opslaan</button></div>
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
  Object.assign(t, { naam: naam || ('Toets ' + _msVakNaam(vak)), vak, datum, doel: (doel && !isNaN(doel)) ? Math.round(doel * 10) / 10 : null, stof, ts: Date.now() });
  msBewaar(d);
  try { trackEvent('mijnstof_toets', { dagen: _msDagen(datum), stof: stof.length }); } catch (e) {}
  terug(() => { MS.tab = 'toets'; MS.view = 'lijst'; MS.id = null; msRender(); });
}
function msToetsVerwijder(id) { const d = msLaad(); d.t = d.t.filter(t => t.id !== id); d.x[id] = Date.now(); msBewaar(d); msTab('toets'); }
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
    if (t) { const n = _msDagen(t.datum); return { t: n === 0 ? 'vandaag' : n === 1 ? 'morgen' : 'over ' + n + ' dagen', toets: 1, heet: n <= 3 ? 1 : 0 }; }
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

// ═══════ MIJN STOF: SCORES EN VOORTGANG ═══════
const _msVandaag = () => { const t = new Date(); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); };
// Een dag waarop je stof van een toets oefende, telt mee in de voortgang van die toets.
function _msOefendag(ids) {
  const d = msLaad(), dag = _msVandaag(); let ver = false;
  d.t.forEach(t => { if ((t.stof || []).some(x => ids.indexOf(x) >= 0)) { t.dagen = t.dagen || []; if (t.dagen.indexOf(dag) < 0) { t.dagen.push(dag); t.ts = Date.now(); ver = true; } } });
  if (ver) msBewaar(d);
}
// Na een quiz uit eigen stof: score per samenvatting en per begrip bijhouden.
function msNoteerQuiz() {
  try {
    if (!ST || !ST.vak || ST.vak.id !== 'mijnstof' || !(ST.antwrd || []).length) return;
    const d = msLaad(), per = {};
    ST.antwrd.forEach((a, i) => {
      const q = ST.vragen[a.vi != null ? a.vi : i]; if (!q || !q._nid) return;
      const p = per[q._nid] = per[q._nid] || { g: 0, n: 0, k: {} };
      p.n++; p.g += a.pts || 0;
      if (q._k) { const k = p.k[q._k] = p.k[q._k] || { g: 0, f: 0 }; if (a.pts) k.g++; else k.f++; }
    });
    Object.keys(per).forEach(id => {
      const n = d.n.find(x => x.id === id); if (!n) return; const p = per[id];
      n.sc = (n.sc || []).concat([{ ts: Date.now(), p: Math.round(p.g / p.n * 100) }]).slice(-8);
      n.zw = n.zw || {};
      Object.keys(p.k).forEach(t => { const z = n.zw[t] = n.zw[t] || { g: 0, f: 0 }; z.g += p.k[t].g; z.f += p.k[t].f; if (p.k[t].g && !p.k[t].f) z.f = Math.max(0, z.f - 1); });
      n.ts = Date.now();
    });
    msBewaar(d);
    _msOefendag(Object.keys(per));
  } catch (e) {}
}
(function () {
  if (typeof toonRes !== 'function') return;
  const oud = toonRes;
  toonRes = function () { const r = oud.apply(this, arguments); msNoteerQuiz(); return r; };
})();
function _msLaatsteScore(n) { const s = n && n.sc; return s && s.length ? s[s.length - 1].p : null; }
function _msZwak(n) { return Object.keys((n && n.zw) || {}).filter(t => n.zw[t].f > 0).sort((a, b) => n.zw[b].f - n.zw[a].f); }
function _msScoreBalk(n) {
  const p = _msLaatsteScore(n); if (p == null) return '';
  return `<span class="ms-score"><span class="ms-score-balk"><i style="width:${p}%"></i></span><span>${p}% goed</span></span>`;
}
function _msStandHtml(n) {
  const p = _msLaatsteScore(n), zwak = _msZwak(n);
  if (p == null) return '';
  const vorige = n.sc.length > 1 ? n.sc[n.sc.length - 2].p : null;
  const pijl = vorige == null ? '' : p > vorige ? `<em class="op">+${p - vorige}</em>` : p < vorige ? `<em class="neer">${p - vorige}</em>` : '';
  return `<div class="ms-stand">
    <div class="ms-stand-kop"><b>${p}%</b><span>goed bij je laatste quiz ${pijl}</span></div>
    ${zwak.length ? `<div class="ms-stand-zwak"><span>Nog lastig:</span>${zwak.slice(0, 6).map(t => `<i>${_msEsc(t)}</i>`).join('')}</div>
    <button class="ms-mini hoofd" onclick="msOefen(['${n.id}'],null,${_msEsc(JSON.stringify(zwak.slice(0, 6)))})">Oefen wat je fout had</button>` : '<div class="ms-stand-zwak"><span>Alles goed beantwoord. Morgen nog een keer, dan blijft het hangen.</span></div>'}
  </div>`;
}
// Toets: geoefende dagen tot de toets, stand van je stof en je doel.
function _msToetsVoortgang(t, stof) {
  const n = _msDagen(t.datum), dagen = t.dagen || [], scores = stof.map(_msLaatsteScore).filter(x => x != null);
  const gem = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  const vak = [], vandaag = new Date(); vandaag.setHours(12, 0, 0, 0);
  for (let i = -3; i <= Math.min(n, 10); i++) {
    const dt = new Date(vandaag.getTime() + i * 864e5), key = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
    const kl = i === n ? 'toets' : dagen.indexOf(key) >= 0 ? 'gedaan' : i < 0 ? 'gemist' : i === 0 ? 'nu' : '';
    vak.push(`<span class="ms-dag ${kl}" title="${dt.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}"><i></i><small>${['zo','ma','di','wo','do','vr','za'][dt.getDay()]}</small></span>`);
  }
  let zin;
  if (gem == null) zin = stof.length ? 'Doe een eerste quiz, dan zie je waar je staat.' : 'Koppel een samenvatting, dan kun je ervoor oefenen.';
  else if (gem >= 85) zin = `Je stof zit erin (${gem}% goed). Blijf elke dag even herhalen.`;
  else if (gem >= 60) zin = `${gem}% goed. Oefen vooral wat je fout had.`;
  else zin = `${gem}% goed. Plan er de komende dagen elke dag een quiz voor.`;
  return `<div class="ms-dagen" aria-label="Geoefend op ${dagen.length} dagen">${vak.join('')}</div><p class="ms-toets-zin">${zin}</p>`;
}

// ═══════ MIJN STOF: FOTO EN SLAGIO-BEGRIPPEN ═══════
function _msVerklein(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = () => { const img = new Image(); img.onload = () => {
      const max = 1600, f = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * f); c.height = Math.round(img.height * f);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', .82));
    }; img.onerror = () => res(null); img.src = r.result; };
    r.onerror = () => res(null); r.readAsDataURL(file);
  });
}
async function msFotoGekozen(inp) {
  const files = [...(inp.files || [])].slice(0, 4); inp.value = ''; if (!files.length) return;
  const box = document.getElementById('ms-gevonden');
  if (box) box.innerHTML = `<div class="ms-bezig"><span class="ms-bezig-vonk">${typeof mascotSVG === 'function' ? mascotSVG('lees', 52) : ''}</span><span><b>Vonk leest je ${files.length > 1 ? files.length + " foto's" : 'foto'}…</b><small>Dit duurt een paar seconden.</small></span></div>`;
  const fotos = (await Promise.all(files.map(_msVerklein))).filter(Boolean);
  const vak = (document.getElementById('ms-vak') || {}).value || '';
  const res = (typeof aiFotoNaarTekst === 'function') ? await aiFotoNaarTekst({ fotos, vak: _msVakNaam(vak) }) : { error: true };
  if (res && res.text) {
    const ta = document.getElementById('ms-tekst'); if (ta) ta.value = (ta.value.trim() ? ta.value.trim() + '\n\n' : '') + res.text.trim();
    _msLive(); try { trackEvent('mijnstof_foto', { n: fotos.length }); } catch (e) {}
    if (typeof showToast === 'function') showToast('Lees het even na: klopt alles wat Vonk las?', '#22c55e', 3200);
    return;
  }
  _msLive();
  let msg = 'Het lukte niet om je foto te lezen. Probeer een scherpere foto bij goed licht.';
  if (res && res.login) msg = 'Log in om een foto van je schrift om te zetten.';
  else if (res && res.limit) msg = 'Je gratis AI-gebruik voor deze week is op. Met Slagio Plus kan het onbeperkt.';
  else if (res && res.oudeServer) msg = 'Foto omzetten komt er bijna aan. Typ of plak je tekst voor nu.';
  if (typeof showToast === 'function') showToast(msg, '#f59e0b', 3800);
}
function msSlagioBegrippen() {
  const vakId = (document.getElementById('ms-vak') || {}).value;
  const vak = (getVK() || []).find(v => v.id === vakId);
  if (!vak) { if (typeof showToast === 'function') showToast('Kies eerst een vak', '#f59e0b'); return; }
  const lijst = (vak.domeinen || []).filter(dm => (dm.nBeg || (dm.begrippen || []).length) > 0);
  _msSheet(`<h3>Begin met Slagio-begrippen</h3><p>Kies een onderwerp. Ik zet de begrippen in je samenvatting; daarna pas je ze aan in je eigen woorden.</p>
    <div class="msx-lijst">${(lijst.length ? lijst : vak.domeinen || []).map(dm => `<button class="msx-optie" onclick="_msBegrippenErin('${vak.id}','${dm.id}')"><b>${_msEsc(dm.naam)}</b><small>${dm.nBeg || (dm.begrippen || []).length || ''} begrippen</small></button>`).join('')}</div>
    <button class="msx-knop licht" onclick="_msSheetDicht()">Annuleren</button>`);
}
function _msBegrippenErin(vakId, domId) {
  const zet = () => {
    const vak = (getVK() || []).find(v => v.id === vakId), dm = vak && (vak.domeinen || []).find(x => x.id === domId);
    const beg = (dm && dm.begrippen) || [];
    if (!beg.length) { if (typeof showToast === 'function') showToast('Hier staan nog geen begrippen', '#f59e0b'); return; }
    const ta = document.getElementById('ms-tekst'); if (!ta) return;
    const regels = ['# ' + dm.naam].concat(beg.slice(0, 40).map(b => (b.t || '').replace(/[:\n]/g, ' ').trim() + ': ' + String(b.d || '').replace(/\n/g, ' ').trim()));
    ta.value = (ta.value.trim() ? ta.value.trim() + '\n\n' : '') + regels.join('\n');
    const ti = document.getElementById('ms-titel'); if (ti && !ti.value) ti.value = dm.naam.slice(0, 80);
    _msSheetDicht(); _msLive();
    try { trackEvent('mijnstof_slagio_begrippen', { vak: vakId, dom: domId, n: beg.length }); } catch (e) {}
  };
  if (typeof ensureVakData === 'function' && typeof vakHydrated === 'function' && !vakHydrated(APP_LEVEL, vakId)) ensureVakData(APP_LEVEL, vakId, zet); else zet();
}

// ═══════ MIJN STOF: EZELSBRUGGETJES ═══════
// Na een fout antwoord kun je een eigen ezelsbruggetje bedenken; de volgende keer
// dat je die vraag beantwoordt, staat het in de uitleg.
function _msTekst(html) { const el = document.createElement('div'); el.innerHTML = String(html || ''); return el.textContent.trim(); }
function _msEzelSleutel(q) { return 'e' + _msHash(_msTekst(q.v) + '|' + _msTekst(q.o && q.o[q.c])); }
let _msEzelQ = null;
function msEzelInFeedback(fb, q, ok) {
  if (!fb || !q || !q.o) return;
  const d = msLaad(), k = _msEzelSleutel(q), e = d.e[k];
  const box = document.createElement('div'); box.className = 'ms-ezel-fb';
  if (e) box.innerHTML = `<div class="ms-ezel-toon"><span class="ms-ezel-ic">${_msIc('brug')}</span><span><b>Jouw ezelsbruggetje</b>${_msEsc(e.t)}</span><button onclick="msEzelSchrijf()" aria-label="Ezelsbruggetje wijzigen">Wijzig</button></div>`;
  else if (!ok) box.innerHTML = `<button class="ms-ezel-knop" onclick="msEzelSchrijf()"><span class="ms-ezel-ic">${_msIc('brug')}</span>Bedenk een ezelsbruggetje</button>`;
  else return;
  _msEzelQ = q; fb.appendChild(box);
}
function msEzelSchrijf(sleutel) {
  const d = msLaad();
  let q = _msEzelQ, k = sleutel || (q ? _msEzelSleutel(q) : null); if (!k) return;
  const e = d.e[k] || {}, vraag = e.v || (q ? _msTekst(q.v) : ''), antw = e.a || (q ? _msTekst(q.o[q.c]) : '');
  _msSheet(`<div class="msx-vonk">${typeof mascotSVG === 'function' ? mascotSVG('denk', 72) : ''}</div>
    <h3>Jouw ezelsbruggetje</h3>
    <p class="msx-vraag">${_msEsc(vraag)}<br><b>${_msEsc(antw)}</b></p>
    <textarea id="ms-ezel-ta" class="msx-ta" rows="3" maxlength="240" placeholder="Iets geks, een rijmpje of een beeld in je hoofd. Hoe gekker, hoe beter het blijft hangen.">${_msEsc(e.t || '')}</textarea>
    <div class="msx-rij">${e.t ? `<button class="msx-knop licht" onclick="_msEzelWeg('${k}')">Verwijderen</button>` : `<button class="msx-knop licht" onclick="_msSheetDicht()">Later</button>`}<button class="msx-knop" onclick="_msEzelOp('${k}')">Bewaren</button></div>`);
  _msEzelData = { v: vraag, a: antw, vak: e.vak || (ST && ST.vak ? (ST.vak.id === 'mijnstof' ? (ST.domein && ST.domein.naam) : ST.vak.naam) : '') || '' };
  setTimeout(() => { const ta = document.getElementById('ms-ezel-ta'); if (ta) ta.focus(); }, 250);
}
let _msEzelData = null;
function _msEzelOp(k) {
  const ta = document.getElementById('ms-ezel-ta'), t = ta ? ta.value.trim() : ''; if (!t) { _msSheetDicht(); return; }
  const d = msLaad(); d.e[k] = Object.assign({}, d.e[k] || {}, _msEzelData || {}, { t, ts: Date.now() }); msBewaar(d);
  _msSheetDicht(); try { trackEvent('mijnstof_ezel', {}); } catch (e) {}
  const knop = document.querySelector('.ms-ezel-fb'); if (knop && _msEzelQ) { const fb = knop.parentNode; knop.remove(); msEzelInFeedback(fb, _msEzelQ, true); }
  if (document.getElementById('sc-mijnstof') && document.getElementById('sc-mijnstof').classList.contains('on')) msRender();
}
function _msEzelWeg(k) { const d = msLaad(); delete d.e[k]; d.x['e:' + k] = Date.now(); msBewaar(d); _msSheetDicht(); if (document.getElementById('sc-mijnstof').classList.contains('on')) msRender(); }
function _msEzelLijstHtml(d) {
  const lijst = Object.keys(d.e).map(k => Object.assign({ k }, d.e[k])).sort((a, b) => (b.ts || 0) - (a.ts || 0));
  if (!lijst.length) return `<div class="ms-leeg"><h3>Je eigen ezelsbruggetjes</h3><p>Heb je een vraag fout in een quiz? Tik dan op <b>Bedenk een ezelsbruggetje</b>. Het komt hier te staan en je ziet het terug als je die vraag weer krijgt.</p></div>`;
  return '<div class="ms-lijst2">' + lijst.map(e => `<button class="ms-item ms-ezel-item" onclick="_msEzelQ=null;msEzelSchrijf('${e.k}')">${e.vak ? `<span class="ms-item-vak">${_msEsc(e.vak)}</span>` : ''}<small class="ms-ezel-v">${_msEsc(e.v || '')}</small><b>${_msEsc(e.a || '')}</b><span class="ms-ezel-t">${_msEsc(e.t)}</span></button>`).join('') + '</div>';
}

// ═══════ MIJN STOF: MET JE ACCOUNT ═══════
// Opslag: kolom user_data.mijnstof (jsonb) met per niveau {n,t,x,e}. Bestaat die
// kolom nog niet, dan gaat het mee in profiel.sync (vlag slagio_ms_bundel=1).
// Samenvoegen per id: de nieuwste versie (ts) wint; verwijderd (x) blijft verwijderd.
const _MS_NIV = ['havo', 'vwo', 'vmbo'];
let _msCloudT = null;
function msAlles() { const o = {}; _MS_NIV.forEach(n => { try { const v = localStorage.getItem('slagio_mijnstof_' + n); if (v) o[n] = JSON.parse(v); } catch (e) {} }); return o; }
function _msCloudPlan() {
  if (typeof currentUser === 'undefined' || !currentUser) return;
  clearTimeout(_msCloudT); _msCloudT = setTimeout(_msCloudPush, 2500);
}
async function _msCloudPush() {
  try {
    if (typeof currentUser === 'undefined' || !currentUser || typeof SB === 'undefined') return;
    if (localStorage.getItem('slagio_ms_bundel') === '1') { if (typeof pushSyncBundle === 'function') pushSyncBundle(); return; }
    const { error } = await SB.from('user_data').upsert({ user_id: currentUser.id, mijnstof: msAlles(), updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (error) { localStorage.setItem('slagio_ms_bundel', '1'); if (typeof pushSyncBundle === 'function') pushSyncBundle(); }
  } catch (e) {}
}
function msCloudBundel() { try { return localStorage.getItem('slagio_ms_bundel') === '1' ? msAlles() : undefined; } catch (e) { return undefined; } }
function _msTs(o) { return (o && (o.ts || o.gemaakt)) || 0; }
function _msSamen(a, b) {
  a = a || {}; b = b || {};
  const x = Object.assign({}, a.x || {}); Object.keys(b.x || {}).forEach(k => { x[k] = Math.max(x[k] || 0, b.x[k]); });
  const lijst = (l1, l2) => { const m = {}; (l1 || []).concat(l2 || []).forEach(o => { if (o && o.id && (!m[o.id] || _msTs(o) > _msTs(m[o.id]))) m[o.id] = o; }); return Object.values(m).filter(o => !(x[o.id] && x[o.id] >= _msTs(o))); };
  const e = {}; [a.e || {}, b.e || {}].forEach(src => Object.keys(src).forEach(k => { if (!e[k] || (src[k].ts || 0) > (e[k].ts || 0)) e[k] = src[k]; }));
  Object.keys(e).forEach(k => { if (x['e:' + k] && x['e:' + k] >= (e[k].ts || 0)) delete e[k]; });
  return { n: lijst(a.n, b.n), t: lijst(a.t, b.t), x, e };
}
function msCloudSamenvoegen(obj, bron) {
  if (!obj || typeof obj !== 'object') return;
  let anders = false;
  _MS_NIV.forEach(niv => {
    const remote = obj[niv]; if (!remote) return;
    let local = null; try { local = JSON.parse(localStorage.getItem('slagio_mijnstof_' + niv) || 'null'); } catch (e) {}
    const m = _msSamen(local, remote), js = JSON.stringify(m);
    localStorage.setItem('slagio_mijnstof_' + niv, js);
    if (js !== JSON.stringify(_msSamen(remote, {}))) anders = true;
  });
  // lokaal had iets dat de cloud nog niet kende: terugsturen
  _MS_NIV.forEach(niv => { if (!obj[niv] && localStorage.getItem('slagio_mijnstof_' + niv)) anders = true; });
  if (anders && bron === 'kolom') _msCloudPlan();
  try { if (document.getElementById('sc-mijnstof').classList.contains('on')) msRender(); } catch (e) {}
}
function msCloudVanServer(data) {
  if (!data) return;
  if (Object.prototype.hasOwnProperty.call(data, 'mijnstof')) {
    const wasBundel = localStorage.getItem('slagio_ms_bundel') === '1';
    localStorage.setItem('slagio_ms_bundel', '0');
    if (data.mijnstof) msCloudSamenvoegen(data.mijnstof, 'kolom');
    else if (Object.keys(msAlles()).length || wasBundel) _msCloudPlan();
  } else localStorage.setItem('slagio_ms_bundel', '1');
}
