// ═══════ SAM-FIGURE REVEAL-ANIMATIE ═══════
// Laat de diagrammen in de rijke samenvattingen "opbouwen" wanneer ze in beeld komen:
// lijnen/curves tekenen zichzelf (stroke-dashoffset), vlakken en labels faden gestaggerd in.
// Progressive enhancement: bij prefers-reduced-motion, oude browsers of welke fout dan ook
// blijven de diagrammen gewoon volledig zichtbaar (authored state). Diagrammen worden nooit
// permanent verborgen — er zijn harde safety-timeouts die alles terugzetten.
(function () {
  "use strict";
  try {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function len(el) { try { return el.getTotalLength ? el.getTotalLength() : 0; } catch (e) { return 0; } }

    function classify(svg) {
      var draws = [], fades = [];
      var els = svg.querySelectorAll("path,line,polyline,circle,rect,ellipse,polygon,text,tspan");
      for (var i = 0; i < els.length; i++) {
        var el = els[i], tag = el.tagName.toLowerCase();
        if (tag === "text" || tag === "tspan") { fades.push(el); continue; }
        var fill = (el.getAttribute("fill") || "").toLowerCase();
        var stroke = el.getAttribute("stroke");
        var isLine = (tag === "path" || tag === "line" || tag === "polyline");
        if (isLine && (fill === "" || fill === "none") && stroke && stroke !== "none") draws.push(el);
        else fades.push(el);
      }
      return { draws: draws, fades: fades };
    }

    // Verberg-staat, gezet zodra we een figuur gaan observeren (vóór het in beeld is).
    function prep(fig) {
      var svg = fig.querySelector("svg");
      if (!svg) { fig.__done = true; return; }
      var c = classify(svg);
      fig.__c = c; fig.__svg = svg;
      c.draws.forEach(function (el) {
        var L = len(el); if (!L) return;
        el.__L = L; el.style.transition = "none";
        el.style.strokeDasharray = L; el.style.strokeDashoffset = L;
      });
      c.fades.forEach(function (el) { el.style.transition = "none"; el.style.opacity = "0"; });
    }

    // Zet alles terug naar de oorspronkelijke (authored) staat — volledig zichtbaar.
    function reveal(fig) {
      var c = fig.__c; if (!c) return;
      c.draws.concat(c.fades).forEach(function (el) {
        el.style.transition = ""; el.style.strokeDasharray = "";
        el.style.strokeDashoffset = ""; el.style.opacity = "";
      });
    }

    function play(fig) {
      if (fig.__done) return; fig.__done = true;
      var c = fig.__c; if (!c) return;
      if (fig.__svg) void fig.__svg.getBoundingClientRect(); // reflow zodat de verberg-staat "vastligt"
      var maxd = 0;
      c.draws.forEach(function (el, i) {
        if (!el.__L) return;
        var d = Math.min(0.04 * i, 0.5); maxd = Math.max(maxd, d);
        el.style.transition = "stroke-dashoffset .7s ease " + d + "s";
        el.style.strokeDashoffset = "0";
      });
      c.fades.forEach(function (el, i) {
        var d = 0.2 + Math.min(0.025 * i, 0.6); maxd = Math.max(maxd, d);
        el.style.transition = "opacity .4s ease " + d + "s";
        el.style.opacity = "1";
      });
      // Na de animatie de inline-styles opruimen -> exact de authored SVG.
      setTimeout(function () { reveal(fig); }, (maxd * 1000) + 900);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); play(e.target); } });
    }, { threshold: 0.2 });

    function observe(fig) {
      if (fig.__obs) return; fig.__obs = true;
      prep(fig);
      io.observe(fig);
      // Harde vangnet: wat er ook gebeurt, na 3,5s is het figuur zichtbaar.
      setTimeout(function () { if (!fig.__done) { fig.__done = true; reveal(fig); try { io.unobserve(fig); } catch (e) {} } }, 3500);
    }

    function scan(root) {
      if (!root || !root.querySelectorAll) return;
      if (root.classList && root.classList.contains("sam-figure")) observe(root);
      var figs = root.querySelectorAll(".sam-figure");
      for (var i = 0; i < figs.length; i++) observe(figs[i]);
    }

    function init() {
      scan(document);
      try {
        var mo = new MutationObserver(function (muts) {
          for (var i = 0; i < muts.length; i++) {
            var an = muts[i].addedNodes; if (!an) continue;
            for (var j = 0; j < an.length; j++) { var n = an[j]; if (n.nodeType === 1) scan(n); }
          }
        });
        mo.observe(document.body, { childList: true, subtree: true });
      } catch (e) {}
    }
    if (document.readyState !== "loading") init();
    else document.addEventListener("DOMContentLoaded", init);
  } catch (e) {}
})();
