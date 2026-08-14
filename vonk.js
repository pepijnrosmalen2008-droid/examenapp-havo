// vonk.js - Vonk-gedragslaag: state machine + event bus + gaze + idle + testmodus.
// ─────────────────────────────────────────────────────────────────────────────
// Slagio heeft geen build-step (dus geen Rive-runtime, en een .riv kan niet in
// code worden ontworpen). Dit realiseert HETZELFDE gedragsmodel als Duolingo's
// Rive-pijplijn, maar bovenop de bestaande SVG-rig (mascotSVG + vonkPlay/CSS).
//
// Regels uit de motion-spec:
//  • Vonk moet altijd leven, maar nooit de taak overnemen.
//  • Max één HOOFD-animatie tegelijk.
//  • Zelfde event ⇒ zelfde reactie (voorspelbaar).
//  • Animatie stuurt aandacht (gaze naar CTA/timer), is geen decoratie.
//  • De app praat in EVENTS; Vonk vertaalt die naar gedrag (states).

var VonkFX = { primary: null, mainUntil: 0, idleT: null, lastEvt: 0 };

// ── EMOTION ENGINE ─────────────────────────────────────────────────────────
// Een laag BÓVEN de state machine: Vonk houdt een stemming bij over de hele
// sessie. Dezelfde 'correct'-reactie is net energieker na een goede reeks en
// rustiger na fouten. Zo voelt hij alsof hij met je meeleeft i.p.v. losse tics.
//  enthusiasm = hoe uitbundig (energie van de animaties, idle-tempo)
//  confidence = hoe zeker (invloed op houding / variant)
//  empathy    = hoe zorgzaam (stijgt bij fouten → bemoedigend gedrag)
// Mensen lezen gezichten, geen variabelen - vandaar naast de basis-drie ook
// curiosity/focus/pride, die de fysica sturen (kantelen, rust, houding).
var VonkMood = { enthusiasm: 55, confidence: 62, empathy: 45, curiosity: 45, focus: 45, pride: 40 };
var VONK_MOOD_BASE = { enthusiasm: 50, confidence: 60, empathy: 42, curiosity: 45, focus: 45, pride: 40 };
var _vonkRunWrong = 0, _vonkRunRight = 0;
function _clamp100(v) { return v < 0 ? 0 : v > 100 ? 100 : v; }
function vonkMoodBump(d) { if (!d) return; for (var k in VONK_MOOD_BASE) if (d[k] != null) VonkMood[k] = _clamp100(VonkMood[k] + d[k]); }
function vonkMoodGet() { return VonkMood; }
// Stemming zakt langzaam terug naar de basis (rust keert terug).
setInterval(function () {
  for (var k in VONK_MOOD_BASE) {
    var b = VONK_MOOD_BASE[k], c = VonkMood[k];
    if (c > b) VonkMood[k] = Math.max(b, c - 1.3);
    else if (c < b) VonkMood[k] = Math.min(b, c + 1.3);
  }
}, 6000);
// Per-event stemmingseffect.
var VONK_MOOD_FX = {
  answer_correct: { enthusiasm: 12, confidence: 6, empathy: -3, pride: 7, curiosity: 3, focus: 4 },
  combo_3: { enthusiasm: 15, confidence: 7, pride: 8 },
  combo_5: { enthusiasm: 23, confidence: 11, pride: 14, focus: 6 },
  combo_8: { enthusiasm: 30, confidence: 15, pride: 20 },
  half: { enthusiasm: 8, confidence: 4, focus: 6 },
  answer_wrong: { enthusiasm: -9, confidence: -12, empathy: 9, pride: -8, focus: 10 },
  level_up: { enthusiasm: 22, confidence: 13, pride: 18 },
  promotion: { enthusiasm: 24, confidence: 15, pride: 22 },
  evolve: { enthusiasm: 32, confidence: 18, pride: 26 },
  streak: { enthusiasm: 17, confidence: 9, pride: 12 }
};
// Energie-niveau (voor animatie-tempo/amplitude) uit enthousiasme.
function _vonkEnergy() { var e = VonkMood.enthusiasm; return e > 70 ? 'hi' : e < 34 ? 'lo' : 'mid'; }

// ── State-definities ──────────────────────────────────────────────────────
// anim = vonkPlay-state (CSS-rig) | sound | haptic | gaze | dur(ms) | main
var VONK_STATES = {
  idle:      { main: false },
  think:     { anim: 'think',     main: true,  dur: 1420 },
  reading:   { main: true },  // leespose loopt via vonkLoading()-overlay
  look_cta:  { gaze: true,         main: false },
  correct:   { anim: 'happy',     sound: 'correct', haptic: [14, 32, 60],            main: true, dur: 600 },
  stronger:  { anim: 'jump',      sound: 'combo',   haptic: [18, 40, 22, 40, 70],    main: true, dur: 820 },
  wrong:     { anim: 'sad',       sound: 'wrong',   haptic: [90, 45, 90],            main: true, dur: 1400 },
  celebrate: { anim: 'celebrate', sound: 'levelup', haptic: [40, 30, 80, 30, 140],   main: true, dur: 1180 },
  proud:     { anim: 'celebrate', sound: 'levelup', haptic: [50, 30, 90, 30, 120],   main: true, dur: 1180 },
  evolve:    { anim: 'evolve',    sound: 'evolve',  haptic: [80, 40, 80, 40, 200],   main: true, dur: 1520 },
  greet:     { anim: 'wave',      main: false, dur: 920 }
};

// ── Event → state (de app-taal) ───────────────────────────────────────────
var VONK_EVENTS = {
  home_open: 'idle', cta_focus: 'look_cta', quiz_loading: 'reading',
  answer_correct: 'correct', answer_wrong: 'wrong',
  combo_3: 'correct', combo_5: 'stronger', combo_8: 'celebrate', half: 'correct',
  level_up: 'celebrate', promotion: 'proud', evolve: 'evolve', streak: 'proud', greet: 'greet'
};

// ── INTENT ENGINE ──────────────────────────────────────────────────────────
// De laag bóven de emotie: Context → Voorspelling → Intentie. Vonk anticipeert
// i.p.v. alleen te reageren. De intentie stuurt houding + blik van de hoofd-Vonk.
var VonkCtx = { screen: 'home', qIndex: 0, qTotal: 0, timeLeft: 99, combo: 0, accuracy: 1, promoDist: 99, demoDist: 99, lastQuestion: false };
function _vonkIntent() {
  var c = VonkCtx;
  if (c.screen === 'quiz') {
    if (c.timeLeft <= 5 && c.timeLeft > 0) return 'warn';       // tijd bijna op → let op de klok
    if (c.lastQuestion) return 'anticipate';                    // laatste vraag → spanning
    if (c.combo >= 3) return 'focus';
    return 'focus';
  }
  if (c.promoDist > 0 && c.promoDist <= 2) return 'anticipate'; // dicht bij promotie
  if (c.demoDist > 0 && c.demoDist <= 2) return 'warn';
  return 'calm';
}
function _vonkApplyIntent() {
  var intent = _vonkIntent(); VonkFX.intent = intent;
  var body = VonkFX.primary && VonkFX.primary._body;
  if (!body) return;
  switch (intent) {
    case 'anticipate':   // borst vooruit, blik omhoog naar de knop, gretiger
      body._intentLean = 0.7; VonkMood.curiosity = Math.max(VonkMood.curiosity, 62); VonkMood.focus = Math.max(VonkMood.focus, 62);
      body.gazeTo(0, -1.7); break;
    case 'warn':         // blik op de timer, gespannen
      body._intentLean = 0.3; VonkMood.focus = Math.max(VonkMood.focus, 78);
      try { var ring = document.getElementById('qring'); if (ring && typeof body.gazeToEl === 'function') body.gazeToEl(ring); else body.gazeTo(0, 1.4); } catch (e) {}
      break;
    case 'focus':        // rustig, geconcentreerd
      body._intentLean = 0; VonkMood.focus = Math.max(VonkMood.focus, 55); break;
    default:             // calm
      body._intentLean = 0;
  }
  body.setMood(VonkMood);
}
// De app voedt context; Vonk berekent daaruit zijn intentie.
function vonkContext(patch) { if (patch) for (var k in patch) VonkCtx[k] = patch[k]; try { _vonkApplyIntent(); } catch (e) {} }

// Markeer de op-scherm "hoofd-Vonk" (voor idle-gedrag + gaze).
function vonkRegister(el) {
  var svg = (typeof _vonkSvgOf === 'function') ? _vonkSvgOf(el) : null;
  VonkFX.primary = svg || null;
  // De hoofd-Vonk wordt een fysiek lichaam (ademen/knipperen/rondkijken via physics).
  try { if (svg && typeof vonkPhysics === 'function') vonkPhysics(svg); } catch (e) {}
  _vonkIdleSchedule();
}
function _vonkActiveEl(opts) {
  if (opts && opts.el) { var e = (typeof _vonkSvgOf === 'function') ? _vonkSvgOf(opts.el) : null; if (e) return e; }
  if (VonkFX.primary && document.body.contains(VonkFX.primary) && VonkFX.primary.offsetParent !== null) return VonkFX.primary;
  var all = document.querySelectorAll('.m-svg');
  for (var i = all.length - 1; i >= 0; i--) { if (all[i].offsetParent !== null) return all[i]; }
  return null;
}

// ── Centrale entry: de app roept ALTIJD vonkEvent(...) aan ─────────────────
// opts: { el, gazeTarget, silent (geen sound/haptic), soft (val terug als er al
// een hoofdanimatie loopt) }.
function vonkEvent(name, opts) {
  opts = opts || {};
  var stName = VONK_EVENTS[name] || name;
  var st = VONK_STATES[stName]; if (!st) return;
  var now = Date.now(); VonkFX.lastEvt = now;
  // Eén hoofdanimatie tegelijk: een 'soft' event wijkt voor een lopende main.
  if (st.main && opts.soft && now < VonkFX.mainUntil) return;
  // Emotion engine: werk de stemming bij en tel goed/fout-reeksen.
  if (VONK_MOOD_FX[name]) vonkMoodBump(VONK_MOOD_FX[name]);
  if (name === 'answer_correct' || name === 'combo_3' || name === 'combo_5' || name === 'combo_8') { _vonkRunRight++; _vonkRunWrong = 0; }
  else if (name === 'answer_wrong') { _vonkRunWrong++; _vonkRunRight = 0; }
  var el = _vonkActiveEl(opts);
  var energy = _vonkEnergy();
  // Variant-keuze op basis van stemming: dezelfde gebeurtenis, andere energie.
  var anim = st.anim;
  if (stName === 'correct') anim = VonkMood.enthusiasm > 74 ? 'jump' : VonkMood.enthusiasm < 32 ? 'nod' : 'happy';
  else if (stName === 'celebrate' && VonkMood.enthusiasm < 40) anim = 'happy';   // rustiger vieren na een zware reeks
  // Timing-laag: anim + geluid + haptiek starten samen (binnen ~1 frame).
  if (el) { try { el.setAttribute('data-energy', energy); } catch (e) {} }
  // Physics-first: als het kan wordt de Vonk een fysiek lichaam en krijgt hij een
  // IMPULS (parameters uit de mood). Anders valt hij terug op de CSS-rig-states.
  var body = (el && typeof vonkPhysics === 'function') ? vonkPhysics(el) : null;
  if (body) { body.setMood(VonkMood); if (anim) body.impulse(anim); }
  else if (el && anim && typeof vonkPlay === 'function') vonkPlay(el, anim, st.dur);
  if (st.gaze) vonkGaze(el, opts.gazeTarget || 'cta');
  if (!opts.silent) {
    if (st.sound) { try { if (typeof playSound === 'function') playSound(st.sound); } catch (e) {} }
    if (st.haptic) { try { if (typeof haptic === 'function') haptic(st.haptic); } catch (e) {} }
  }
  if (st.main) VonkFX.mainUntil = now + (st.dur || 800);
  // RECOVERY: 3+ fouten op rij → na het verdriet een bemoedigend knikje +
  // opbeurend bericht (empathie stijgt). Werkt óók zonder zichtbare Vonk.
  if (name === 'answer_wrong' && _vonkRunWrong >= 3) {
    setTimeout(function () {
      try { if (el && typeof vonkPlay === 'function') vonkPlay(el, 'nod', 640); } catch (e) {}
      try { if (typeof vonkReact === 'function') vonkReact('goed', _vonkPick(['Kom op, jij kan dit!', 'Even doorzetten - de volgende pak je!', 'Niet opgeven, ik geloof in je!']), { duration: 1900 }); } catch (e) {}
    }, (st.dur || 1400) + 120);
  }
  _vonkIdleSchedule();
}
function _vonkPick(a) { return a[Math.floor(Math.random() * a.length)]; }

// ── Gaze / attention: Vonk richt zijn blik op een doel (aandacht sturen) ───
function _vonkGazeTarget(name) {
  var map = {
    cta: '.qnxt,.hm-cta-primary,.qmcd,.dc-popup-btn,.btn-pri,.btn-primary,.cta,.lgc-cta,.chest-cta',
    timer: '#qring,.qring', xp: '#xp-home-bar,.res-xp,#quiz-coinbtn,.coin-btn'
  };
  var sel = map[name] || name;
  try { return document.querySelector(sel); } catch (e) { return null; }
}
function vonkGaze(el, target) {
  el = ((typeof _vonkSvgOf === 'function') ? _vonkSvgOf(el) : null) || _vonkActiveEl();
  if (!el) return;
  var pup = el.querySelector('.m-pupils'); if (!pup) return;
  var tEl = (typeof target === 'string') ? _vonkGazeTarget(target) : target;
  var tx = 0, ty = 0;
  if (tEl && tEl.getBoundingClientRect) {
    var r = el.getBoundingClientRect(), t = tEl.getBoundingClientRect();
    var dx = (t.left + t.width / 2) - (r.left + r.width / 2);
    var dy = (t.top + t.height / 2) - (r.top + r.height / 2);
    var mag = Math.hypot(dx, dy) || 1;
    tx = Math.max(-2.7, Math.min(2.7, dx / mag * 2.7));
    ty = Math.max(-2.3, Math.min(2.3, dy / mag * 2.3));
  }
  pup.style.animation = 'none';
  pup.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px)';
  clearTimeout(el._gazeT);
  el._gazeT = setTimeout(function () { pup.style.transform = ''; pup.style.animation = ''; }, 2400);
}

// ── Idle-laag: na 8s zonder event kijkt de hoofd-Vonk subtiel rond ─────────
function _vonkIdleSchedule() {
  clearTimeout(VonkFX.idleT);
  VonkFX.idleT = setTimeout(_vonkIdleTick, 8000);
}
function _vonkBlink(el) { var eyes = el.querySelector('.m-eyes'); if (!eyes) return; eyes.style.animation = 'none'; void eyes.offsetWidth; eyes.style.animation = 'mkBlink .28s'; setTimeout(function () { eyes.style.animation = ''; }, 340); }
function _vonkGlance(el, dx) { var pup = el.querySelector('.m-pupils'); if (!pup) return; pup.style.animation = 'none'; pup.style.transform = 'translateX(' + dx + 'px)'; setTimeout(function () { pup.style.transform = ''; pup.style.animation = ''; }, 1500); }
// Idle = geen vaste reeks maar een KANSVERDELING, op een wisselend interval,
// zodat Vonk levend voelt en nooit gescript. Langere rust → zeldzamer gedrag.
function _vonkIdleTick() {
  try {
    var el = VonkFX.primary;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Fysiek aangestuurde Vonk regelt zijn eigen idle (ademen/knipperen/rondkijken);
    // de CSS-idle hieronder alleen voor niet-physics Vonks.
    if (el && !el._body && document.body.contains(el) && el.offsetParent !== null && Date.now() > VonkFX.mainUntil && !reduce) {
      var idleSecs = (Date.now() - VonkFX.lastEvt) / 1000;
      var r = Math.random();
      if (r < 0.40) _vonkBlink(el);                       // 40% knipper
      else if (r < 0.63) _vonkGlance(el, -2.4);           // 23% kijk links
      else if (r < 0.80) _vonkGlance(el, 2.4);            // 17% kijk rechts
      else if (r < 0.92) vonkPlay(el, 'yawn', 1300);      // 12% geeuw
      else vonkPlay(el, 'tailflick', 700);                // 8%  staart
      if (idleSecs > 22 && Math.random() < 0.4) {         // zeldzamer na lange rust
        setTimeout(function () { try { vonkPlay(el, Math.random() < 0.5 ? 'think' : 'nod', Math.random() < 0.5 ? 1400 : 640); } catch (e) {} }, 900);
      }
    }
  } catch (e) {}
  clearTimeout(VonkFX.idleT);
  VonkFX.idleT = setTimeout(_vonkIdleTick, 6000 + Math.random() * 7000);  // 6–13s
}

// ── Testmodus: elke state handmatig afspelen (voelt Vonk zoals Duo?) ───────
// Openen via ?vonktest=1 of vonkTest().
function vonkTest() {
  if (document.getElementById('vonk-test')) return;
  var oneShots = ['idle', 'think', 'look_cta', 'correct', 'stronger', 'wrong', 'celebrate', 'proud', 'evolve', 'greet'];
  var d = document.createElement('div'); d.id = 'vonk-test';
  d.style.cssText = 'position:fixed;inset:0;z-index:100000;background:#0e1119;display:flex;flex-direction:column;align-items:center;gap:16px;padding:26px 18px;overflow:auto;font-family:system-ui,sans-serif';
  var events = ['answer_correct', 'answer_wrong', 'combo_5', 'combo_8', 'level_up', 'promotion', 'evolve'];
  d.innerHTML =
    '<div style="color:#fff;font-weight:800;font-size:18px">Vonk - testmodus</div>' +
    '<div style="color:#8a94a8;font-size:13px;text-align:center;max-width:440px">Idle loopt vanzelf (ademen, knipperen, rondkijken, geeuwen). Simuleer <b>events</b> en let op hoe dezelfde reactie mee-energie krijgt met de stemming.</div>' +
    '<div id="vt-stage" style="width:200px;height:200px;filter:drop-shadow(0 10px 30px rgba(0,0,0,.5))">' + (typeof mascotSVG === 'function' ? mascotSVG('blij', 200) : '') + '</div>' +
    '<div id="vt-mood" style="font-family:ui-monospace,monospace;font-size:12.5px;color:#cbd3e1;background:#141824;border:1px solid #262c3b;border-radius:12px;padding:10px 14px;min-width:260px;text-align:left"></div>' +
    '<div style="color:#6b7488;font-size:12px;font-weight:700;margin-top:2px">EVENTS</div>' +
    '<div id="vt-evts" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:520px"></div>' +
    '<div style="color:#6b7488;font-size:12px;font-weight:700;margin-top:6px">LOSSE STATES</div>' +
    '<div id="vt-btns" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:520px"></div>' +
    '<button id="vt-close" style="margin-top:10px;padding:9px 18px;border-radius:11px;border:none;background:#e8580c;color:#fff;font-weight:800;cursor:pointer">Sluiten</button>';
  document.body.appendChild(d);
  var stage = d.querySelector('#vt-stage');
  var moodEl = d.querySelector('#vt-mood');
  d.querySelector('#vt-close').onclick = function () { clearInterval(d._mt); d.remove(); };
  vonkRegister(stage);
  function bar(v) { var n = Math.round(v / 10); return '█'.repeat(n) + '░'.repeat(10 - n); }
  function refresh() {
    moodEl.innerHTML =
      'enthusiasm ' + bar(VonkMood.enthusiasm) + ' ' + Math.round(VonkMood.enthusiasm) + '<br>' +
      'confidence ' + bar(VonkMood.confidence) + ' ' + Math.round(VonkMood.confidence) + '<br>' +
      'empathy&nbsp;&nbsp;&nbsp;' + bar(VonkMood.empathy) + ' ' + Math.round(VonkMood.empathy) + '<br>' +
      '<span style="color:#6b7488">energie: ' + _vonkEnergy() + ' · reeks +' + _vonkRunRight + ' / -' + _vonkRunWrong + '</span>';
  }
  d._mt = setInterval(refresh, 400); refresh();
  var body = (typeof vonkPhysics === 'function') ? vonkPhysics(stage) : null;  // fysiek lichaam
  var mk = function (label, host, fn, accent) {
    var b = document.createElement('button'); b.textContent = label;
    b.style.cssText = 'padding:8px 13px;border-radius:9px;border:1px solid ' + (accent ? '#e8580c' : '#33384a') + ';background:' + (accent ? '#2a1a10' : '#1c2130') + ';color:#fff;cursor:pointer;font-size:13px;font-weight:600';
    b.onclick = fn; host.appendChild(b);
  };
  var evHost = d.querySelector('#vt-evts');
  events.forEach(function (ev) { mk(ev, evHost, function () { vonkEvent(ev, { el: stage }); refresh(); }, true); });
  var btns = d.querySelector('#vt-btns');
  oneShots.forEach(function (s) {
    mk(s, btns, function () {
      if (s === 'look_cta') { if (body) body.gazeTo(2.5, -1.5); else vonkGaze(stage, moodEl); return; }
      var st = VONK_STATES[s];
      var anim = (st && st.anim) ? st.anim : s;
      if (body) { body.setMood(VonkMood); body.impulse(anim); }
      else if (st && st.anim) vonkPlay(stage, st.anim, st.dur);
    });
  });
}
try { if (location.search.indexOf('vonktest') !== -1) window.addEventListener('load', function () { setTimeout(vonkTest, 500); }); } catch (e) {}
