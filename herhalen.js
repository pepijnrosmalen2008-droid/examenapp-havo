// ═══════════════════════════════════════════════════════════════════════
// herhalen.js - HERHAALPLANNING (spaced repetition voor ÁLLE geoefende domeinen)
// Bouwt op de bestaande decay-tijdstempels (getDecay in lb.js). Een domein dat
// je lang niet oefende en/of matig beheerst, zakt weg en komt hier terug om op
// te frissen. Vonk presenteert het. Geen LLM, puur op bestaande data.
// ═══════════════════════════════════════════════════════════════════════

// Herhaal-interval (dagen) op basis van beheersing: beter beheerst = langer vast.
function _herInterval(pct) { return pct >= 0.85 ? 21 : pct >= 0.7 ? 12 : pct >= 0.5 ? 7 : 4; }

// Alle geoefende domeinen die "due" zijn om te herhalen, gesorteerd op urgentie.
function herhaalDueList() {
  const out = []; const now = Date.now();
  let decay = {}; try { if (typeof getDecay === 'function') decay = getDecay() || {}; } catch (e) {}
  const vakken = (typeof getVK === 'function') ? getVK() : [];
  vakken.forEach(function (vak) {
    (vak.domeinen || []).forEach(function (dom) {
      const ts = decay[vak.id + '_' + dom.id]; if (!ts) return;           // nooit geoefend
      const r = (typeof getDomeinBestPct === 'function') ? getDomeinBestPct(vak.id, dom.id) : { hasData: false, pct: 0 };
      if (!r.hasData) return;
      const days = (now - ts) / 864e5;
      const interval = _herInterval(r.pct);
      if (days >= interval) out.push({ vakId: vak.id, vakNaam: vak.naam, domId: dom.id, domNaam: dom.naam, pct: r.pct, days: Math.floor(days), urg: days / interval });
    });
  });
  out.sort(function (a, b) { return b.urg - a.urg; });
  return out;
}
function herhaalDueCount() { return herhaalDueList().length; }

function renderHerhalen() {
  const el = document.getElementById('herhaal-list'); if (!el) return;
  const due = herhaalDueList();
  const vonkBox = document.getElementById('herhaal-vonk');
  if (vonkBox) {
    const mood = due.length ? 'kijk' : 'blij';
    const say = due.length
      ? ('Deze ' + due.length + ' ' + (due.length === 1 ? 'onderdeel zakt' : 'onderdelen zakken') + ' weg uit je geheugen. Zullen we ze opfrissen?')
      : 'Alles staat nog vers in je hoofd. Niks te herhalen, goed bezig!';
    vonkBox.innerHTML = '<div class="her-vonk">' + ((typeof mascotSVG === 'function') ? mascotSVG(mood, 88) : '') + '</div>' +
      '<div class="her-vonk-say"><div class="her-vonk-name">' + (typeof MASCOT_NAME !== 'undefined' ? MASCOT_NAME : 'Vonk') + '</div><div>' + say + '</div></div>';
  }
  if (!due.length) { el.innerHTML = '<div class="her-empty">🟢 Alles vers! Kom terug zodra er iets dreigt weg te zakken.</div>'; return; }
  el.innerHTML = '<button class="her-all" onclick="herhaalOefen()">🔁 Fris het zwakste onderdeel op</button>' +
    due.map(function (d) {
      const col = d.pct < 0.5 ? '#ef4444' : d.pct < 0.7 ? '#f97316' : '#22c55e';
      return '<div class="her-item"><div class="her-item-body"><div class="her-item-dom">' + d.domNaam + '</div>' +
        '<div class="her-item-sub">' + d.vakNaam + ' · ' + d.days + ' dagen geleden · <span style="color:' + col + '">' + Math.round(d.pct * 100) + '%</span></div></div>' +
        '<button class="her-oefen" onclick="goToDomein(\'' + d.vakId + '\',\'' + d.domId + '\',\'snel\')">Oefen →</button></div>';
    }).join('');
}
function herhaalOefen() { const due = herhaalDueList(); if (due.length && typeof goToDomein === 'function') goToDomein(due[0].vakId, due[0].domId, 'snel'); }
function openHerhalen() { show('sc-herhalen'); renderHerhalen(); try { trackEvent('herhalen_open', { due: herhaalDueCount() }); } catch (e) {} }

// Home-kaart: alleen zichtbaar als er iets weg dreigt te zakken.
function renderHerhaalHomeCard() {
  const box = document.getElementById('herhaal-home'); if (!box) return;
  const n = herhaalDueCount();
  if (!n) { box.innerHTML = ''; return; }
  box.innerHTML = '<button class="her-card" onclick="openHerhalen()"><span class="her-card-ic">🔁</span>' +
    '<div class="her-card-body"><div class="her-card-t">' + n + ' ' + (n === 1 ? 'onderdeel zakt' : 'onderdelen zakken') + ' weg</div>' +
    '<div class="her-card-s">Fris ze op voordat je ze vergeet</div></div><span class="her-card-go">→</span></button>';
}

// ═══════════════════════════════════════════════════════════════════════
// SLIM OEFENEN - één knop die automatisch een sessie samenstelt uit JOUW
// openstaande fouten + zwakste/wegzakkende domeinen. Cross-domein, hergebruikt
// de geteste foutenboek-quizflow (fbRecord tagt per vraag). Duolingo-stijl intro.
// ═══════════════════════════════════════════════════════════════════════
var _slimQs = null;
function slimHasData() {
  var f = 0, w = 0;
  try { f = (typeof fbDueCount === 'function') ? fbDueCount() : 0; } catch (e) {}
  try { w = (typeof herhaalDueCount === 'function') ? herhaalDueCount() : 0; } catch (e) {}
  return f + w > 0;
}
function slimOefenen() {
  try { if (typeof ensureFbMeta === 'function') ensureFbMeta(); } catch (e) {}
  var level = (typeof APP_LEVEL !== 'undefined') ? APP_LEVEL : 'havo';
  // Openstaande fouten (due).
  var fbDue = [];
  try {
    var d = (typeof _fbLoad === 'function') ? _fbLoad() : {}; var now = Date.now();
    fbDue = Object.values(d).filter(function (e) { return !e.mastered && e.o && typeof e.c === 'number' && (e.due || 0) <= now; })
      .sort(function (a, b) { return (b.count || 0) - (a.count || 0); });
  } catch (e) {}
  var weak = [];
  try { weak = (typeof herhaalDueList === 'function') ? herhaalDueList() : []; } catch (e) {}
  var needVak = [];
  weak.slice(0, 6).forEach(function (w2) { if (needVak.indexOf(w2.vakId) < 0) needVak.push(w2.vakId); });
  if (!needVak.length) { _slimCompose(fbDue, weak); return; }
  var pend = needVak.length;
  needVak.forEach(function (vid) {
    try { ensureVakData(level, vid, function () { if (--pend <= 0) _slimCompose(fbDue, weak); }); }
    catch (e) { if (--pend <= 0) _slimCompose(fbDue, weak); }
  });
}
function _slimCompose(fbDue, weak) {
  var TARGET = 10, out = [], used = {};
  // A) tot 5 openstaande fouten
  fbDue.slice(0, 5).forEach(function (r) {
    out.push({ v: r.v, o: r.o.slice(), c: r.c, u: r.u || '', bron: 'fout', _fbVak: r.vakId, _fbVakNaam: r.vak, _fbDom: r.domId, _fbDomNaam: r.dom });
    used[r.v] = 1;
  });
  // B) verse vragen uit zwakke/wegzakkende domeinen
  var vakken = (typeof getVK === 'function') ? getVK() : []; var byId = {};
  vakken.forEach(function (v) { byId[v.id] = v; });
  for (var i = 0; i < weak.length && out.length < TARGET; i++) {
    var w = weak[i], vak = byId[w.vakId]; if (!vak) continue;
    var dom = (vak.domeinen || []).filter(function (x) { return x.id === w.domId; })[0];
    if (!dom || !dom.sv || !dom.sv.length) continue;
    var pool = dom.sv.filter(function (q) { return q && q.o && typeof q.c === 'number' && !/\bbereken\b/i.test(q.v) && !used[q.v]; });
    for (var k = pool.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var t = pool[k]; pool[k] = pool[j]; pool[j] = t; }
    var take = Math.min(2, pool.length, TARGET - out.length);
    for (var m = 0; m < take; m++) {
      var q = pool[m];
      out.push({ v: q.v, o: q.o.slice(), c: q.c, u: q.u || '', bron: 'zwak', _fbVak: w.vakId, _fbVakNaam: w.vakNaam, _fbDom: w.domId, _fbDomNaam: w.domNaam });
      used[q.v] = 1;
    }
  }
  if (!out.length) {
    if (typeof showToast === 'function') showToast('Nog te weinig data - oefen eerst een paar domeinen', '#f59e0b', 3000);
    if (typeof startStreakQuiz === 'function') startStreakQuiz();
    return;
  }
  for (var x = out.length - 1; x > 0; x--) { var y = Math.floor(Math.random() * (x + 1)); var tmp = out[x]; out[x] = out[y]; out[y] = tmp; }
  var qs = out.slice(0, TARGET);
  var nFout = qs.filter(function (q) { return q.bron === 'fout'; }).length;
  _slimIntro(qs, nFout, qs.length - nFout);
}
// Duolingo-stijl intro: Vonk + tellende chips + 3D-startknop.
function _slimIntro(qs, nFout, nWeak) {
  _slimQs = qs;
  var el = document.getElementById('slim-intro');
  if (!el) { el = document.createElement('div'); el.id = 'slim-intro'; el.className = 'slim-overlay'; document.body.appendChild(el); }
  var vonk = (typeof mascotSVG === 'function') ? mascotSVG('trots', 96) : '';
  var chips = '';
  if (nFout > 0) chips += '<div class="slim-chip slim-chip-fout"><span class="slim-chip-n" data-n="' + nFout + '">0</span><span class="slim-chip-l">' + (nFout === 1 ? 'fout om te herhalen' : 'fouten om te herhalen') + '</span></div>';
  if (nWeak > 0) chips += '<div class="slim-chip slim-chip-weak"><span class="slim-chip-n" data-n="' + nWeak + '">0</span><span class="slim-chip-l">uit je zwakke punten</span></div>';
  el.innerHTML = '<div class="slim-card">'
    + '<button class="slim-x" onclick="_slimClose()" aria-label="Sluiten">✕</button>'
    + '<div class="slim-vonk">' + vonk + '</div>'
    + '<div class="slim-kicker">Vonk stelde je sessie samen</div>'
    + '<div class="slim-title">Jouw sessie staat klaar</div>'
    + '<div class="slim-chips">' + chips + '</div>'
    + '<button class="slim-start" onclick="_slimGo()">Start · ' + qs.length + ' vragen</button>'
    + '</div>';
  requestAnimationFrame(function () { el.classList.add('show'); });
  setTimeout(function () {
    el.querySelectorAll('.slim-chip-n').forEach(function (sp) {
      var target = +sp.getAttribute('data-n') || 0, t0 = performance.now(), dur = 650;
      var tick = function (now) { var p = Math.max(0, Math.min(1, (now - t0) / dur)); sp.textContent = Math.round(target * (1 - Math.pow(1 - p, 2))); if (p < 1) requestAnimationFrame(tick); else sp.textContent = target; };
      requestAnimationFrame(tick);
    });
  }, 480);
  try { if (typeof playSound === 'function') playSound('complete'); } catch (e) {}
}
function _slimGo() { var qs = _slimQs; _slimClose(); if (qs) setTimeout(function () { _slimLaunch(qs); }, 180); }
function _slimClose() { var el = document.getElementById('slim-intro'); if (el) { el.classList.remove('show'); setTimeout(function () { el.remove(); }, 240); } }
function _slimLaunch(qs) {
  try { if (typeof clearQuizDraft === 'function') clearQuizDraft(); } catch (e) {}
  ST.vak = { id: 'slim', naam: 'Slim oefenen', domeinen: [] };
  ST.domein = { id: 'SMART', naam: 'Jouw persoonlijke sessie' };
  ST.mode = 'snel'; ST.isFoutenboek = true; ST.isDailyChallenge = false; ST.adaptive = false;
  ST.idx = 0; ST.score = 0; ST.antwrd = []; ST.tijdPerVraag = []; ST.combo = 0; ST.xpThisRound = 0; ST.flagged = new Set();
  ST.vragen = qs;
  ST.shuffleMaps = qs.map(function (q) {
    var n = (q.o || []).length, mm = []; for (var i = 0; i < n; i++) mm.push(i);
    for (var a = n - 1; a > 0; a--) { var b = Math.floor(Math.random() * (a + 1)); var t = mm[a]; mm[a] = mm[b]; mm[b] = t; }
    return mm;
  });
  var metaEl = document.getElementById('qmeta'); if (metaEl) metaEl.textContent = '✨ Slim oefenen · ' + qs.length + ' vragen';
  var scq = document.getElementById('sc-quiz'); if (scq) scq.classList.remove('oud-mode');
  show('sc-quiz');
  try { if (typeof playSound === 'function') playSound('start'); } catch (e) {}
  try { trackEvent('slim_oefenen', { aantal: qs.length }); } catch (e) {}
  var skel = document.getElementById('quiz-skeleton'), body = document.getElementById('qbody-inner');
  if (skel && body) { skel.style.display = 'flex'; body.style.display = 'none'; }
  requestAnimationFrame(function () { requestAnimationFrame(function () { if (skel) skel.style.display = 'none'; if (body) body.style.display = ''; if (typeof toonV === 'function') toonV(); }); });
}
// Home-kaart: prominente Slim-oefenen ingang (alleen als er iets persoonlijks is).
function renderSlimHome() {
  var box = document.getElementById('slim-home'); if (!box) return;
  var nFout = 0, nWeak = 0;
  try { nFout = (typeof fbDueCount === 'function') ? fbDueCount() : 0; } catch (e) {}
  try { nWeak = (typeof herhaalDueCount === 'function') ? herhaalDueCount() : 0; } catch (e) {}
  if (nFout + nWeak < 1) { box.innerHTML = ''; return; }
  var parts = [];
  if (nFout > 0) parts.push(nFout + ' ' + (nFout === 1 ? 'fout' : 'fouten'));
  if (nWeak > 0) parts.push(nWeak + ' zwak' + (nWeak === 1 ? ' punt' : 'ke punten'));
  box.innerHTML = '<button class="slim-card-home" onclick="slimOefenen()">'
    + '<span class="slim-card-spark"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2l1.9 5.3L19 9l-5.1 1.7L12 16l-1.9-5.3L5 9l5.1-1.7z"/><path d="M19 14l.9 2.4L22 17l-2.1.7L19 20l-.9-2.3L16 17l2.1-.6z" opacity=".7"/></svg></span>'
    + '<span class="slim-card-body"><span class="slim-card-t">Slim oefenen</span>'
    + '<span class="slim-card-s">Vonk stelt een sessie samen uit ' + parts.join(' + ') + '</span></span>'
    + '<span class="slim-card-go">→</span></button>';
}
