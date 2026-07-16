// ═══════ SAM-CLIP: korte geanimeerde uitleg ("mini-video") ═══════
// Hoogwaardige, herbruikbare mini-explainers in samenvattingen. Een clip wordt
// aangedreven door een requestAnimationFrame-tijdlijn: de choreografie (per clip,
// in CHOREO) plaatst elk element per frame exact (o.a. een deeltje dat de échte
// curve volgt via getPointAtLength, met fysieke easing). Bijschriften lopen mee.
// Auto-play bij in-beeld; play/pauze/opnieuw. Progressive enhancement: bij
// prefers-reduced-motion, geen rAF/SVG-ondersteuning of een fout toont de clip een
// statisch eindbeeld + alle stappen als tekst (klasse .reduced) — nooit kapot.
(function () {
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var supported = !!(window.requestAnimationFrame && document.createElementNS &&
    ("getPointAtLength" in (document.createElementNS("http://www.w3.org/2000/svg", "path"))));

  // ── easing ──
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function seg(t, a, b) { return clamp01((t - a) / (b - a)); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeIn(t) { return t * t * t; }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  // ══ Choreografie-register. Elke clip levert: build(clip)->ctx, duration, cues,
  //    render(t,ctx), staticState(ctx). ══
  var CHOREO = {};

  // ── clip: activeringsenergie & katalysator ──
  CHOREO.activering = {
    duration: 10.8,
    cues: [
      { t: 0.0, i: 0 }, { t: 2.0, i: 1 }, { t: 4.2, i: 2 },
      { t: 5.6, i: 3 }, { t: 7.5, i: 4 }, { t: 9.4, i: 5 }
    ],
    build: function (clip) {
      var svg = clip.querySelector("svg");
      var ctx = {
        svg: svg,
        ball: svg.querySelector(".ball"),
        glow: svg.querySelector(".glow"),
        high: svg.querySelector(".curve-high"),
        low: svg.querySelector(".curve-low"),
        lbl: svg.querySelector(".lbl-kat"),
        bx: 46, by: 110               // authored basispositie van het deeltje
      };
      ctx.Lh = ctx.high.getTotalLength();
      ctx.Ll = ctx.low.getTotalLength();
      // lage curve klaarzetten als "teken-in" (verborgen tot de katalysator-fase)
      ctx.low.style.strokeDasharray = ctx.Ll;
      ctx.low.style.strokeDashoffset = ctx.Ll;
      ctx.lpeak = 0.46;              // fractie van de lage curve waar de top ligt
      return ctx;
    },
    _put: function (ctx, path, f) {
      var L = (path === ctx.high) ? ctx.Lh : ctx.Ll;
      var p = path.getPointAtLength(f * L);
      var tr = "translate(" + (p.x - ctx.bx).toFixed(2) + "," + (p.y - ctx.by).toFixed(2) + ")";
      ctx.ball.setAttribute("transform", tr);
      ctx.glow.setAttribute("transform", tr);
    },
    render: function (t, ctx) {
      var onLow = t >= 7.5;
      // deeltje op de HOGE curve tot de succes-fase
      if (!onLow) {
        var f;
        if (t < 2.0) f = 0;                                   // intro: stil bij reactanten
        else if (t < 4.0) f = 0.30 * easeOut(seg(t, 2.0, 4.0)); // klimt op, remt af (verliest energie)
        else if (t < 5.6) f = 0.30 * (1 - easeIn(seg(t, 4.0, 5.6))); // rolt terug, versnelt
        else f = 0;                                           // katalysator-fase: stil bij reactanten
        this._put(ctx, ctx.high, f);
      } else {
        // succes: volgt de lage curve, remt af naar de (lagere) top en versnelt eraf
        var e = seg(t, 7.5, 10.4), lf;
        if (e < 0.5) lf = ctx.lpeak * easeOut(e / 0.5);
        else lf = ctx.lpeak + (1 - ctx.lpeak) * easeIn((e - 0.5) / 0.5);
        this._put(ctx, ctx.low, lf);
      }
      // katalysator: lage curve tekent zich in (5.6→6.9), label fade-in, hoge curve dimt
      ctx.low.style.strokeDashoffset = (t >= 5.6 ? ctx.Ll * (1 - easeOut(seg(t, 5.6, 6.9))) : ctx.Ll).toFixed(1);
      ctx.lbl.style.opacity = (t >= 5.6 ? easeOut(seg(t, 5.6, 6.4)) : 0).toFixed(2);
      ctx.high.style.opacity = (t >= 5.6 ? 1 - 0.66 * easeOut(seg(t, 5.6, 6.3)) : 1).toFixed(2);
      // gloed: feller terwijl het deeltje beweegt
      var moving = (t >= 2.0 && t < 5.6) || (t >= 7.5 && t <= 10.4);
      ctx.glow.style.opacity = (moving ? 0.30 : 0.12).toFixed(2);
    },
    staticState: function (ctx) {
      this._put(ctx, ctx.low, 1);
      ctx.low.style.strokeDashoffset = "0";
      ctx.lbl.style.opacity = "1";
      ctx.high.style.opacity = "0.34";
      ctx.glow.style.opacity = "0.12";
    }
  };

  // ══ Framework ══
  function nameOf(clip) {
    var cl = clip.className && clip.className.baseVal !== undefined ? clip.className.baseVal : clip.className;
    var m = (cl || "").match(/\bclip-([a-z0-9]+)\b/);
    return m ? m[1] : null;
  }

  function setup(clip) {
    if (clip.__init) return; clip.__init = true;
    var choreo = CHOREO[nameOf(clip)];
    var capEls = clip.querySelectorAll(".sam-clip-caps p");
    var capOut = clip.querySelector(".sam-clip-cap");
    var dots = clip.querySelectorAll(".sam-clip-dots i");
    var btn = clip.querySelector(".sam-clip-play");

    function staticFallback() {
      clip.classList.add("reduced");
      try { if (choreo) { var c = choreo.build(clip); choreo.staticState(c); } } catch (e) {}
    }
    if (!choreo || !supported || reduce) { staticFallback(); return; }

    var ctx = null, raf = 0, last = 0, elapsed = 0, playing = false, finished = false, lastCue = -1;

    function caption(t) {
      var idx = 0, ci = 0;
      for (var k = 0; k < choreo.cues.length; k++) { if (choreo.cues[k].t <= t + 1e-3) { idx = choreo.cues[k].i; ci = k; } }
      if (ci !== lastCue) {
        lastCue = ci;
        if (capOut && capEls[idx]) {
          capOut.classList.remove("cap-fade"); void capOut.offsetWidth;
          capOut.textContent = capEls[idx].textContent; capOut.classList.add("cap-fade");
        }
        for (var d = 0; d < dots.length; d++) dots[d].classList.toggle("on", d <= ci);
      }
    }
    function frame(now) {
      if (!playing) return;
      if (!last) last = now;
      elapsed += (now - last) / 1000; last = now;
      var t = elapsed;
      if (t >= choreo.duration) { t = choreo.duration; }
      try { choreo.render(t, ctx); } catch (e) {}
      caption(t);
      if (elapsed >= choreo.duration) { playing = false; finished = true; if (btn) btn.innerHTML = "↻ Opnieuw"; return; }
      raf = requestAnimationFrame(frame);
    }
    function ensure() { if (!ctx) ctx = choreo.build(clip); }
    function start(fromZero) {
      ensure();
      if (fromZero) { elapsed = 0; finished = false; lastCue = -1; }
      playing = true; last = 0; if (btn) btn.innerHTML = "❚❚ Pauze";
      raf = requestAnimationFrame(frame);
    }
    function pause() { playing = false; if (raf) cancelAnimationFrame(raf); if (btn) btn.innerHTML = finished ? "↻ Opnieuw" : "▶ Verder"; }
    function toggle() { if (playing) pause(); else start(finished); }

    try { ensure(); choreo.render(0, ctx); caption(0); } catch (e) { staticFallback(); return; }
    if (btn) btn.addEventListener("click", toggle);

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && !clip.__played) { clip.__played = true; io.unobserve(clip); start(true); } });
      }, { threshold: 0.45 });
      io.observe(clip);
    } else { start(true); }
  }

  function scan(root) {
    if (!root || !root.querySelectorAll) return;
    if (root.classList && root.classList.contains("sam-clip")) setup(root);
    var cs = root.querySelectorAll(".sam-clip");
    for (var i = 0; i < cs.length; i++) setup(cs[i]);
  }
  function init() {
    try { scan(document); } catch (e) {}
    try {
      var mo = new MutationObserver(function (m) {
        for (var i = 0; i < m.length; i++) { var an = m[i].addedNodes; if (!an) continue; for (var j = 0; j < an.length; j++) { if (an[j].nodeType === 1) scan(an[j]); } }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
