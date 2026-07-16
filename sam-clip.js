// ═══════ SAM-CLIP: korte geanimeerde uitleg ("mini-video") ═══════
// Speelt een stapsgewijze animatie af in een samenvatting, als een korte silent-explainer:
// de controller telt data-step 0..N-1 op met een vaste tik; per stap toont hij de bijbehorende
// bijschrifttekst en verschuift een voortgangsbalk. De visuele staat per stap zit in styles.css
// (.clip-<naam>[data-step="N"]). Auto-play één keer bij in-beeld-scrollen; daarna pauze/opnieuw.
// Progressive enhancement: bij prefers-reduced-motion of een fout blijft de clip als statisch
// eindbeeld staan met alle stappen als tekst (klasse .reduced) — nooit een leeg/kapot kader.
(function () {
  "use strict";
  try {
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var STEP_MS = 2000;

    function setup(clip) {
      if (clip.__init) return; clip.__init = true;
      var steps = parseInt(clip.getAttribute("data-steps") || "0", 10);
      if (!steps) { clip.classList.add("reduced"); return; }
      var capEls = clip.querySelectorAll(".sam-clip-caps p");
      var capOut = clip.querySelector(".sam-clip-cap");
      var dots = clip.querySelectorAll(".sam-clip-dots i");
      var btn = clip.querySelector(".sam-clip-play");
      var timer = null, playing = false;

      if (reduce) { clip.classList.add("reduced"); return; }

      function show(i) {
        clip.setAttribute("data-step", i);
        if (capOut && capEls[i]) capOut.textContent = capEls[i].textContent;
        for (var d = 0; d < dots.length; d++) dots[d].classList.toggle("on", d <= i);
      }
      function stop() { playing = false; if (timer) { clearTimeout(timer); timer = null; } if (btn) btn.innerHTML = "↻ Opnieuw"; }
      function step(i) {
        show(i);
        if (i >= steps - 1) { stop(); return; }
        timer = setTimeout(function () { step(i + 1); }, STEP_MS);
      }
      function play() {
        if (timer) { clearTimeout(timer); timer = null; }
        playing = true; if (btn) btn.innerHTML = "❚❚ Pauze";
        show(0);
        timer = setTimeout(function () { step(0); }, 70); // korte reset zodat de transitie vanuit elke staat loopt
      }
      function toggle() { if (playing) stop(); else play(); }

      if (btn) btn.addEventListener("click", toggle);
      show(0);

      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting && !clip.__played) { clip.__played = true; io.unobserve(clip); play(); } });
        }, { threshold: 0.4 });
        io.observe(clip);
      } else { play(); }
    }

    function scan(root) {
      if (!root || !root.querySelectorAll) return;
      if (root.classList && root.classList.contains("sam-clip")) setup(root);
      var cs = root.querySelectorAll(".sam-clip");
      for (var i = 0; i < cs.length; i++) setup(cs[i]);
    }
    function init() {
      scan(document);
      try {
        var mo = new MutationObserver(function (m) {
          for (var i = 0; i < m.length; i++) { var an = m[i].addedNodes; if (!an) continue; for (var j = 0; j < an.length; j++) { if (an[j].nodeType === 1) scan(an[j]); } }
        });
        mo.observe(document.body, { childList: true, subtree: true });
      } catch (e) {}
    }
    if (document.readyState !== "loading") init();
    else document.addEventListener("DOMContentLoaded", init);
  } catch (e) {}
})();
