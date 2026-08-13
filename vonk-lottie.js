// ═══════════════════════════════════════════════════════════════════════════
// vonk-lottie.js — Vonk als Lottie (vrije, frame-precieze beweging) met SVG-fallback.
//
// Werkwijze: overal waar je een levende Vonk wilt, plaats je een "holder" via
// vonkHolder(mood,size,state). Die bevat standaard de bestaande SVG-Vonk
// (mascotSVG) als fallback. Zodra de Lottie-runtime geladen is, upgradet een
// MutationObserver elke holder automatisch naar de Lottie-versie. Bij
// reduced-motion of als de runtime ontbreekt, blijft de SVG staan.
//
// States: 'idle' (rustig ademen/knipperen/zwaaien, loopt) en 'celebrate'
// (sprong met squash/stretch, speelt één keer en valt terug naar idle).
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  'use strict';
  var LOTTIE_PATH = '/vonk.lottie.json';
  var _json = null, _jsonLoading = null, _jsonFailed = false;
  var _reduce = false;
  try { _reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function runtimeReady() { return typeof window.lottie !== 'undefined'; }

  // Segmentgrenzen komen uit de Lottie-JSON (_segments); dit is de fallback.
  var DEFAULT_SEG = { idle: [0, 90], celebrate: [90, 150], levelup: [150, 240] };
  // Easter eggs: soms tijdens idle iets doms/grappigs. (In-beeld-passende set;
  // 'fall' zit wel in de Lottie maar valt buiten het krappe kader, dus alleen
  // voor toekomstige ruime idle-plekken — niet in de standaardpool.)
  var EGGS = ['dizzy', 'yawn', 'trip', 'dance'];
  var EGG_MIN = 7000, EGG_MAX = 18000; // ms tussen grappen

  // De animatie-JSON één keer laden en hergebruiken (SW cachet 'm sowieso).
  function loadJSON(cb) {
    if (_json) { cb(_json); return; }
    if (_jsonFailed) { cb(null); return; }
    if (_jsonLoading) { _jsonLoading.push(cb); return; }
    _jsonLoading = [cb];
    fetch(LOTTIE_PATH).then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (j) { _json = j; var q = _jsonLoading; _jsonLoading = null; q.forEach(function (f) { f(j); }); })
      .catch(function () { _jsonFailed = true; var q = _jsonLoading || []; _jsonLoading = null; q.forEach(function (f) { f(null); }); });
  }

  // HTML-holder: bevat de SVG-fallback; wordt later ge-upgrade naar Lottie.
  // mood → alleen voor de fallback-SVG (Lottie heeft één expressieve pose).
  window.vonkHolder = function (mood, size, state) {
    size = size || 120; state = state || 'idle';
    var svg = (typeof mascotSVG === 'function') ? mascotSVG(mood || 'blij', size) : '';
    return '<span class="vonk-lottie" data-vl-state="' + state + '" data-vl-size="' + size +
      '" style="display:inline-flex;width:' + size + 'px;height:' + size + 'px;line-height:0">' + svg + '</span>';
  };

  // Eén holder upgraden naar Lottie (of met rust laten = SVG-fallback).
  function upgrade(el) {
    if (!el || el._vlDone) return;
    if (_reduce || !runtimeReady()) return;           // fallback: SVG blijft staan
    // Een uitgeruste Vonk-skin (bril/kroon/sjaal) zit op de SVG-rig, niet in de Lottie.
    // Heeft de speler er een op, dan laten we de SVG-Vonk (mét skin) staan i.p.v. te
    // upgraden — anders verdwijnt de gekochte look. De SVG-rig animeert zelf.
    if (typeof getEquippedVonk === 'function' && getEquippedVonk()) { el._vlDone = true; return; }
    el._vlDone = true;
    var size = parseInt(el.getAttribute('data-vl-size') || '120', 10);
    var state = el.getAttribute('data-vl-state') || 'idle';
    loadJSON(function (json) {
      if (!json || !el.isConnected) return;
      el.innerHTML = '';
      el.style.width = size + 'px'; el.style.height = size + 'px';
      el._vlSeg = json._segments || DEFAULT_SEG;
      var anim = window.lottie.loadAnimation({
        container: el, renderer: 'svg', loop: true, autoplay: true,
        animationData: JSON.parse(JSON.stringify(json)),
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: false }
      });
      el._vlAnim = anim;
      anim.addEventListener('DOMLoaded', function () { setState(el, state); });
    });
  }

  // Speel één segment af (loop of eenmalig met terugkeer naar idle). gen = token
  // zodat een oude 'complete' een nieuwere state niet overschrijft.
  function playSeg(el, name, thenIdle, gen) {
    var a = el._vlAnim, seg = el._vlSeg || DEFAULT_SEG, range = seg[name];
    if (!a || !range) return;
    if (thenIdle) {
      a.loop = false;
      a.playSegments(range, true);
      var back = function () {
        a.removeEventListener('complete', back);
        if (gen !== el._vlGen) return;                         // verouderd → negeren
        a.loop = true; a.playSegments(seg.idle, true); scheduleEgg(el);
      };
      a.addEventListener('complete', back);
    } else { a.loop = true; a.playSegments(range, true); }
  }

  // Af en toe (tijdens idle) een willekeurige grap.
  function scheduleEgg(el) {
    if (_reduce) return;
    clearTimeout(el._vlEggT);
    var gen = el._vlGen;
    el._vlEggT = setTimeout(function () {
      if (gen !== el._vlGen || !el.isConnected || !el._vlAnim) return;
      if (document.hidden) { scheduleEgg(el); return; }        // niet grappen op verborgen tab
      var seg = el._vlSeg || DEFAULT_SEG;
      var pool = EGGS.filter(function (n) { return seg[n]; });
      if (!pool.length) return;
      playSeg(el, pool[(Math.random() * pool.length) | 0], true, gen);
    }, EGG_MIN + Math.random() * (EGG_MAX - EGG_MIN));
  }

  // State toepassen op een (ge-upgrade) holder.
  function setState(el, state) {
    if (!el || !el._vlAnim) return;
    clearTimeout(el._vlEggT);
    var gen = (el._vlGen = (el._vlGen || 0) + 1);
    if (state === 'idle') { playSeg(el, 'idle', false); scheduleEgg(el); }
    else { playSeg(el, state, true, gen); }                    // moment speelt 1×, daarna idle
  }

  // Publieke API: state wisselen op een holder (element of dat een holder bevat).
  window.vonkLottieState = function (target, state) {
    if (typeof target === 'string') target = document.querySelector(target);
    if (!target) return;
    var el = target.classList && target.classList.contains('vonk-lottie') ? target : target.querySelector('.vonk-lottie');
    if (el) { if (!el._vlDone) el.setAttribute('data-vl-state', state); else setState(el, state); }
  };

  // Alle nog niet-ge-upgrade holders in een subtree upgraden.
  function upgradeAll(root) {
    (root || document).querySelectorAll('.vonk-lottie:not([data-vl-up])').forEach(function (el) {
      el.setAttribute('data-vl-up', '1'); upgrade(el);
    });
  }
  window.upgradeVonkLotties = upgradeAll;

  // Opruimen: als een holder uit de DOM verdwijnt, de Lottie-instantie stoppen.
  function cleanup(el) { if (el) { clearTimeout(el._vlEggT); if (el._vlAnim) { try { el._vlAnim.destroy(); } catch (e) {} el._vlAnim = null; } } }

  // Automatisch upgraden + opruimen via observer (dekt alle 31 Vonk-plekken zonder
  // ze los aan te passen: je vervangt mascotSVG(...) door vonkHolder(...) waar gewenst).
  function initObserver() {
    upgradeAll(document);
    try {
      var mo = new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          m.addedNodes && m.addedNodes.forEach(function (n) {
            if (n.nodeType !== 1) return;
            if (n.classList && n.classList.contains('vonk-lottie')) { n.setAttribute('data-vl-up', '1'); upgrade(n); }
            if (n.querySelectorAll) upgradeAll(n);
          });
          m.removedNodes && m.removedNodes.forEach(function (n) {
            if (n.nodeType !== 1) return;
            if (n.classList && n.classList.contains('vonk-lottie')) cleanup(n);
            if (n.querySelectorAll) n.querySelectorAll('.vonk-lottie').forEach(cleanup);
          });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initObserver);
  else initObserver();
})();
