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

  // Segmentgrenzen (uit build-vonk-lottie.js): idle 0–90, celebrate 90–150.
  var SEG = { idle: [0, 90], celebrate: [90, 150] };

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
    el._vlDone = true;
    var size = parseInt(el.getAttribute('data-vl-size') || '120', 10);
    var state = el.getAttribute('data-vl-state') || 'idle';
    loadJSON(function (json) {
      if (!json || !el.isConnected) return;
      el.innerHTML = '';
      el.style.width = size + 'px'; el.style.height = size + 'px';
      var anim = window.lottie.loadAnimation({
        container: el, renderer: 'svg', loop: true, autoplay: true,
        animationData: JSON.parse(JSON.stringify(json)),
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: false }
      });
      el._vlAnim = anim;
      anim.addEventListener('DOMLoaded', function () { setState(el, state); });
    });
  }

  // State toepassen op een (ge-upgrade) holder.
  function setState(el, state) {
    var a = el && el._vlAnim; if (!a) return;
    if (state === 'celebrate') {
      a.loop = false;
      a.playSegments(SEG.celebrate, true);
      var back = function () { a.removeEventListener('complete', back); a.loop = true; a.playSegments(SEG.idle, true); };
      a.addEventListener('complete', back);
    } else {
      a.loop = true; a.playSegments(SEG.idle, true);
    }
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
  function cleanup(el) { if (el && el._vlAnim) { try { el._vlAnim.destroy(); } catch (e) {} el._vlAnim = null; } }

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
