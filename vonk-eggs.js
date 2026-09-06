// ═══════════════════════════════════════════════════════════════════════════
// vonk-eggs.js — speelse easter-eggs voor Vonk.
// Zelfstandig en defensief: alle externe functies via typeof-guards, respecteert
// prefers-reduced-motion, en reageert ALLEEN op "vrijstaande" Vonks (niet op een
// Vonk die binnen een klikbare kaart/knop zit, om de kaart-actie niet te kapen).
//   • Tik op Vonk  → speelse pop + sparkles; oplopend: 5× = spin, 10× = feest.
//   • Konami-code  → disco-Vonk + confetti.
//   • Bijzondere dagen → een eenmalige feestelijke knipoog.
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  'use strict';
  var reduce = false;
  try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var tapN = 0, tapT = 0;

  function _haptic(p) { try { if (typeof haptic === 'function') haptic(p); else if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  function _sound(n) { try { if (typeof playSound === 'function') playSound(n); } catch (e) {} }
  function _toast(msg, col, ms) { try { if (typeof showToast === 'function') showToast(msg, col || '#f59e0b', ms || 2200); } catch (e) {} }
  function _confetti(g) { try { if (typeof launchConfetti === 'function') launchConfetti(g); } catch (e) {} }
  function _pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  // Laat Vonk kort een emotie tonen (physics-veilige mond-morph uit vonk.js).
  function _emote(svg, mood, ms) { try { if (typeof vonkEmote === 'function') vonkEmote(svg, mood, ms || 1500); } catch (e) {} }

  // Sparkle-burst rond een element (kleine emoji's die uitspatten).
  function _sparkle(el, n, emojis) {
    if (reduce || !el) return;
    var r = el.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height * 0.42;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('div');
      s.className = 'vonk-sparkle';
      s.textContent = emojis[i % emojis.length];
      s.style.left = (cx - 9) + 'px';
      s.style.top = (cy - 9) + 'px';
      var ang = (Math.PI * 2 * i / n) + (Math.random() - 0.5);
      var dist = 34 + Math.random() * 30;
      s.style.setProperty('--sx', (Math.cos(ang) * dist).toFixed(0) + 'px');
      s.style.setProperty('--sy', (Math.sin(ang) * dist - 14).toFixed(0) + 'px');
      s.style.setProperty('--sr', ((Math.random() - 0.5) * 120).toFixed(0) + 'deg');
      document.body.appendChild(s);
      (function (node) { setTimeout(function () { try { node.remove(); } catch (e) {} }, 880); })(s);
    }
  }

  // Speel een korte reactie-animatie op de hele SVG (los van de idle-timeline).
  function _react(svg, cls) {
    if (reduce || !svg) return;
    svg.classList.remove('m-egg-pop', 'm-egg-spin', 'm-egg-wobble');
    void svg.offsetWidth; // herstart de animatie
    svg.classList.add(cls);
    setTimeout(function () { try { svg.classList.remove(cls); } catch (e) {} }, 900);
  }

  // Alleen vrijstaande Vonks reageren op een tik (niet binnen een klikbare kaart).
  function _eligible(svg) {
    try { return svg && !svg.closest('button,a,[onclick],[role="button"],.dm-card,.klas-home-card,.sp-vonk,.vc-card,label'); }
    catch (e) { return false; }
  }

  // ── Tik op Vonk ─────────────────────────────────────────────────────────
  document.addEventListener('click', function (ev) {
    var t = ev.target;
    var svg = t && t.closest ? t.closest('.m-svg') : null;
    if (!svg || !_eligible(svg)) return;

    var now = Date.now();
    if (now - tapT > 1400) tapN = 0;
    tapT = now; tapN++;

    if (tapN >= 20) {
      tapN = 0;
      _react(svg, 'm-egg-wobble'); _emote(svg, 'kus', 1600);
      _sparkle(svg, 16, ['💛', '💖', '😍', '✨', '🦊']);
      _haptic([20, 40, 20, 40, 20, 40, 90]); _sound('levelup'); _confetti('gold');
      _toast('😍 Oké, jij bent officieel Vonks bestie! Kusje terug. 💛', '#ec4899', 3400);
    } else if (tapN >= 10) {
      _react(svg, 'm-egg-spin'); _emote(svg, 'feest', 1500);
      _sparkle(svg, 14, ['✨', '🎉', '⭐', '🔥', '💫']);
      _haptic([20, 40, 20, 40, 60]); _sound('levelup'); _confetti('gold');
      if (tapN === 10) _toast('🦊 Je hebt Vonk helemaal gek gemaakt! Echte superfan. 💛', '#8b5cf6', 3200);
    } else if (tapN >= 5) {
      _react(svg, 'm-egg-spin'); _emote(svg, _pick(['duizelig', 'cool', 'giechel']), 1400);
      _sparkle(svg, 8, ['🎉', '✨', '⭐']);
      _haptic([15, 30, 15]); _sound('coin');
      if (tapN === 5) _toast('🌀 ' + _pick(['Wheee! Niet stoppen!', 'Nog een keer!', 'Ik word duizelig 😵‍💫']), '#f59e0b', 1900);
    } else {
      _react(svg, 'm-egg-pop'); _emote(svg, _pick(['giechel', 'blij', 'wow', 'knipoog']), 1300);
      _sparkle(svg, 5, ['✨', '⭐', '💫']);
      _haptic(12);
    }
  }, true);

  // ── Lang indrukken op Vonk → hij giert het uit ──────────────────────────
  var _lpT = null, _lpSvg = null;
  function _lpStart(ev) {
    var t = ev.target, svg = t && t.closest ? t.closest('.m-svg') : null;
    if (!svg || !_eligible(svg)) return;
    _lpSvg = svg;
    _lpT = setTimeout(function () {
      _lpT = null;
      _emote(_lpSvg, 'giechel', 1900); _react(_lpSvg, 'm-egg-wobble');
      _sparkle(_lpSvg, 9, ['😂', '🤭', '✨', '⭐']);
      _haptic([10, 20, 10, 20, 10]); _sound('coin');
      _toast('🤭 ' + _pick(['Hihi, dat kietelt!', 'Hahaha, stop! 😂', 'Jij bent grappig!']), '#f59e0b', 2000);
    }, 620);
  }
  function _lpEnd() { if (_lpT) { clearTimeout(_lpT); _lpT = null; } }
  document.addEventListener('pointerdown', _lpStart, true);
  document.addEventListener('pointerup', _lpEnd, true);
  document.addEventListener('pointercancel', _lpEnd, true);
  document.addEventListener('pointermove', function (e) { if (_lpT && (Math.abs(e.movementX) > 6 || Math.abs(e.movementY) > 6)) _lpEnd(); }, true);

  // ── Typ "vonk" → hij schrikt op en zwaait ───────────────────────────────
  var _typed = '';
  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;
    if (!/^[a-z]$/i.test(e.key)) return;
    _typed = (_typed + e.key.toLowerCase()).slice(-4);
    if (_typed === 'vonk') {
      _typed = '';
      var svg = document.querySelector('.m-svg'); if (!svg) return;
      _emote(svg, 'wow', 1600); _react(svg, 'm-egg-pop');
      _sparkle(svg, 10, ['🦊', '✨', '👋', '⭐']);
      _haptic([15, 25]); _sound('coin');
      _toast('🦊 Hé, dat ben ik! Hoi hoi! 👋', '#f59e0b', 2200);
    }
  });

  // ── Konami-code (↑↑↓↓←→←→ B A) → disco-Vonk ─────────────────────────────
  var KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], kbuf = [];
  document.addEventListener('keydown', function (e) {
    kbuf.push(e.keyCode);
    if (kbuf.length > KONAMI.length) kbuf.shift();
    if (kbuf.length === KONAMI.length && KONAMI.every(function (k, i) { return kbuf[i] === k; })) {
      kbuf = [];
      var svg = document.querySelector('.m-svg');
      if (svg) { _react(svg, 'm-egg-spin'); _sparkle(svg, 18, ['🪩', '✨', '🎉', '⭐', '🔥', '💫']); }
      _haptic([30, 50, 30, 50, 30, 50, 80]);
      _confetti('gold'); setTimeout(function () { _confetti(); }, 320);
      _toast('🪩 DISCO VONK! Geheime code ontgrendeld. 🕺', '#8b5cf6', 3400);
    }
  });

  // ── Bijzondere dagen: eenmalige feestelijke knipoog ─────────────────────
  function _season() {
    try {
      var d = new Date(), m = d.getMonth() + 1, day = d.getDate();
      var key = 'slagio_egg_' + d.getFullYear() + '-' + m + '-' + day;
      if (localStorage.getItem(key)) return;
      var msg = null;
      if (m === 12 && day === 5) msg = '🎁 Fijne pakjesavond! Vonk heeft ook een cadeautje voor je: doorzetten. 😉';
      else if (m === 12 && day >= 24 && day <= 26) msg = '🎄 Fijne kerst! Even bijkomen — daarna weer knallen.';
      else if ((m === 12 && day === 31) || (m === 1 && day === 1)) msg = '🎆 Gelukkig nieuwjaar! Nieuw jaar, nieuwe leerdoelen. 💪';
      else if (m === 4 && day === 27) msg = '👑 Fijne Koningsdag! Vandaag ben jij de koning van je leerdoelen.';
      else if (m === 4 && day === 1) msg = '🦊 Vonk zegt: je haalt een 10 zónder te leren! …grapje. 1 april! 😄';
      if (!msg) return;
      localStorage.setItem(key, '1');
      setTimeout(function () {
        _toast(msg, '#f59e0b', 4200);
        var svg = document.querySelector('.m-svg');
        if (svg) { _react(svg, 'm-egg-wobble'); _sparkle(svg, 7, ['✨', '🎉', '⭐']); }
      }, 2600);
    } catch (e) {}
  }
  // ── Tijd van de dag: eenmalige knipoog bij laat/vroeg oefenen ───────────
  function _timeGreet() {
    try {
      if (sessionStorage.getItem('slagio_egg_timegreet')) return;
      var h = new Date().getHours(), msg = null, mood = null, emo = ['✨'];
      if (h >= 0 && h < 5) { msg = '🌙 Zo laat nog aan het leren? Petje af — maar slaap is óók studeren. 😴'; mood = 'slaap'; emo = ['😴', '💤', '🌙']; }
      else if (h >= 5 && h < 8) { msg = '🌅 Vroege vogel! Even oefenen voor school? Daar hou ik van. ☕'; mood = 'trots'; emo = ['🌅', '☕', '✨']; }
      if (!msg) return;
      sessionStorage.setItem('slagio_egg_timegreet', '1');
      setTimeout(function () {
        _toast(msg, '#8b5cf6', 4000);
        var svg = document.querySelector('.m-svg');
        if (svg) { _emote(svg, mood, 2200); _react(svg, 'm-egg-wobble'); _sparkle(svg, 6, emo); }
      }, 3200);
    } catch (e) {}
  }
  function _run() { _season(); _timeGreet(); }
  if (document.readyState !== 'loading') _run();
  else document.addEventListener('DOMContentLoaded', _run);
})();
