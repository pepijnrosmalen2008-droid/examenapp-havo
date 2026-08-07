// vonk.js — Vonk-gedragslaag: state machine + event bus + gaze + idle + testmodus.
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

// Markeer de op-scherm "hoofd-Vonk" (voor idle-gedrag + gaze).
function vonkRegister(el) {
  var svg = (typeof _vonkSvgOf === 'function') ? _vonkSvgOf(el) : null;
  VonkFX.primary = svg || null;
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
  var el = _vonkActiveEl(opts);
  // Timing-laag: anim + geluid + haptiek starten samen (binnen ~1 frame).
  if (el && st.anim && typeof vonkPlay === 'function') vonkPlay(el, st.anim, st.dur);
  if (st.gaze) vonkGaze(el, opts.gazeTarget || 'cta');
  if (!opts.silent) {
    if (st.sound) { try { if (typeof playSound === 'function') playSound(st.sound); } catch (e) {} }
    if (st.haptic) { try { if (typeof haptic === 'function') haptic(st.haptic); } catch (e) {} }
  }
  if (st.main) VonkFX.mainUntil = now + (st.dur || 800);
  _vonkIdleSchedule();
}

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
function _vonkIdleTick() {
  try {
    var el = VonkFX.primary;
    if (el && document.body.contains(el) && el.offsetParent !== null && Date.now() > VonkFX.mainUntil) {
      if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        var pup = el.querySelector('.m-pupils');
        if (pup && Math.random() < 0.7) {
          var dir = Math.random() < 0.5 ? -2.4 : 2.4;
          pup.style.animation = 'none'; pup.style.transform = 'translateX(' + dir + 'px)';
          setTimeout(function () { pup.style.transform = ''; pup.style.animation = ''; }, 1500);
        } else if (typeof vonkPlay === 'function') {
          vonkPlay(el, 'nod', 640);
        }
      }
    }
  } catch (e) {}
  _vonkIdleSchedule();
}

// ── Testmodus: elke state handmatig afspelen (voelt Vonk zoals Duo?) ───────
// Openen via ?vonktest=1 of vonkTest().
function vonkTest() {
  if (document.getElementById('vonk-test')) return;
  var oneShots = ['idle', 'think', 'look_cta', 'correct', 'stronger', 'wrong', 'celebrate', 'proud', 'evolve', 'greet'];
  var d = document.createElement('div'); d.id = 'vonk-test';
  d.style.cssText = 'position:fixed;inset:0;z-index:100000;background:#0e1119;display:flex;flex-direction:column;align-items:center;gap:16px;padding:26px 18px;overflow:auto;font-family:system-ui,sans-serif';
  d.innerHTML =
    '<div style="color:#fff;font-weight:800;font-size:18px">Vonk — testmodus</div>' +
    '<div style="color:#8a94a8;font-size:13px;text-align:center;max-width:420px">Speel elke state af. Idle loopt vanzelf (ademen, knipperen, rondkijken).</div>' +
    '<div id="vt-stage" style="width:200px;height:200px;filter:drop-shadow(0 10px 30px rgba(0,0,0,.5))">' + (typeof mascotSVG === 'function' ? mascotSVG('blij', 200) : '') + '</div>' +
    '<div id="vt-btns" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:520px"></div>' +
    '<button id="vt-close" style="margin-top:6px;padding:9px 18px;border-radius:11px;border:none;background:#e8580c;color:#fff;font-weight:800;cursor:pointer">Sluiten</button>';
  document.body.appendChild(d);
  var stage = d.querySelector('#vt-stage');
  var btns = d.querySelector('#vt-btns');
  d.querySelector('#vt-close').onclick = function () { d.remove(); };
  vonkRegister(stage);
  oneShots.forEach(function (s) {
    var b = document.createElement('button'); b.textContent = s;
    b.style.cssText = 'padding:8px 13px;border-radius:9px;border:1px solid #33384a;background:#1c2130;color:#fff;cursor:pointer;font-size:13px;font-weight:600';
    b.onclick = function () {
      var st = VONK_STATES[s];
      if (s === 'look_cta') { vonkGaze(stage, b); return; }
      if (st && st.anim) vonkPlay(stage, st.anim, st.dur);
      if (st && st.sound) { try { playSound(st.sound); } catch (e) {} }
      if (st && st.haptic) { try { haptic(st.haptic); } catch (e) {} }
    };
    btns.appendChild(b);
  });
}
try { if (location.search.indexOf('vonktest') !== -1) window.addEventListener('load', function () { setTimeout(vonkTest, 500); }); } catch (e) {}
