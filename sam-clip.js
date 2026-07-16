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
    audio: [
      { t: 2.05, s: "clipRoll" }, { t: 4.15, s: "clipFail" },
      { t: 5.70, s: "clipCatalyst" }, { t: 7.60, s: "clipRoll" }, { t: 10.15, s: "clipSuccess" }
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

  // ═══════ SPEC-ENGINE: clips uit een declaratieve tijdlijn ═══════
  // In plaats van per clip build/render/staticState met de hand te schrijven,
  // beschrijft een clip zich als data: een SVG-scène (met vaste klassen) plus een
  // lijst "tracks" op de tijdlijn. specChoreo() maakt daar een choreo-object van
  // dat het bestaande framework aandrijft. Tracktypes:
  //   reveal   — teken een pad in (stroke-dashoffset len→0) over [t0,t1]
  //   fade     — opacity from→to over [t0,t1]
  //   attr     — numeriek attribuut (bv. r) from→to over [t0,t1]
  //   moveAlong— .ball/.glow volgt een pad via f-keyframes [[t,fractie,ease]]
  //   tangent  — raaklijn aan een pad in het volgpunt + richtingslabel per zone
  //   custom   — ontsnappingsluik: fn(t,ctx)
  var EAS = { lin: function (x) { return x; }, out: easeOut, in: easeIn, io: easeInOut };

  function piecewise(kfs, t) {
    if (t <= kfs[0][0]) return kfs[0][1];
    for (var i = 1; i < kfs.length; i++) {
      if (t <= kfs[i][0]) {
        var a = kfs[i - 1], b = kfs[i];
        return a[1] + (b[1] - a[1]) * EAS[b[2] || "io"](seg(t, a[0], b[0]));
      }
    }
    return kfs[kfs.length - 1][1];
  }
  function putAt(ball, glow, p, base) {
    var tr = "translate(" + (p.x - base.x).toFixed(2) + "," + (p.y - base.y).toFixed(2) + ")";
    if (ball) ball.setAttribute("transform", tr);
    if (glow) glow.setAttribute("transform", tr);
  }
  function glowVal(tr, t) {
    if (tr.appear && t < tr.appear[0]) return 0;
    if (tr.bright && t >= tr.bright[0] && t < tr.bright[1]) return tr.brightVal != null ? tr.brightVal : 0.28;
    return tr.dimVal != null ? tr.dimVal : 0.1;
  }
  function applyTracks(ctx, t) {
    for (var n = 0; n < ctx.tracks.length; n++) {
      var tr = ctx.tracks[n], e;
      switch (tr.type) {
        case "reveal":
          e = EAS[tr.ease || "out"](seg(t, tr.t[0], tr.t[1]));
          tr.node.style.strokeDashoffset = (tr.len * (1 - e)).toFixed(1);
          break;
        case "fade":
          e = EAS[tr.ease || "out"](seg(t, tr.t[0], tr.t[1]));
          tr.node.style.opacity = ((tr.from != null ? tr.from : 0) + ((tr.to != null ? tr.to : 1) - (tr.from != null ? tr.from : 0)) * e).toFixed(2);
          break;
        case "attr":
          e = EAS[tr.ease || "out"](seg(t, tr.t[0], tr.t[1]));
          tr.node.setAttribute(tr.attr, (tr.from + (tr.to - tr.from) * e).toFixed(2));
          break;
        case "moveAlong": {
          var f = piecewise(tr.f, t), p = tr.path.getPointAtLength(f * tr.Lp);
          putAt(tr.ball, tr.glow, p, tr.base);
          if (tr.appear && tr.ball) tr.ball.style.opacity = EAS.out(seg(t, tr.appear[0], tr.appear[1])).toFixed(2);
          if (tr.glow) tr.glow.style.opacity = glowVal(tr, t).toFixed(2);
          break;
        }
        case "tangent": {
          var ft = piecewise(tr.f, t), Lf = ft * tr.Lp, eps = tr.eps || 1.6;
          var q = tr.path.getPointAtLength(Lf);
          var q1 = tr.path.getPointAtLength(Math.max(0, Lf - eps));
          var q2 = tr.path.getPointAtLength(Math.min(tr.Lp, Lf + eps));
          var dx = q2.x - q1.x, dy = q2.y - q1.y, m = Math.hypot(dx, dy) || 1, ux = dx / m, uy = dy / m, h = tr.half || 30;
          tr.line.setAttribute("x1", (q.x - ux * h).toFixed(1)); tr.line.setAttribute("y1", (q.y - uy * h).toFixed(1));
          tr.line.setAttribute("x2", (q.x + ux * h).toFixed(1)); tr.line.setAttribute("y2", (q.y + uy * h).toFixed(1));
          putAt(tr.ball, tr.glow, q, tr.base);
          if (tr.glow) tr.glow.style.opacity = ((tr.bright && t >= tr.bright[0] && t < tr.bright[1]) ? (tr.brightVal != null ? tr.brightVal : 0.24) : (tr.dimVal != null ? tr.dimVal : 0.1)).toFixed(2);
          if (tr.label) {
            var L = tr.label, neg = q.x < L.vx - 5, pos = q.x > L.vx + 5;
            tr.lbl.textContent = neg ? L.neg : pos ? L.pos : L.zero;
            tr.lbl.style.fill = neg ? L.cneg : pos ? L.cpos : L.czero;
            tr.lbl.setAttribute("x", q.x.toFixed(1)); tr.lbl.setAttribute("y", (q.y - 14).toFixed(1));
            tr.lbl.style.opacity = EAS.out(seg(t, L.fade[0], L.fade[1])).toFixed(2);
          }
          break;
        }
        case "custom": tr.fn(t, ctx); break;
      }
    }
  }
  function specChoreo(spec) {
    return {
      duration: spec.duration,
      cues: spec.cues.map(function (t, i) { return { t: t, i: i }; }),
      audio: (spec.audio || []).map(function (a) { return { t: a[0], s: a[1] }; }),
      build: function (clip) {
        var svg = clip.querySelector("svg"), ctx = { svg: svg, tracks: [] };
        if (spec.compute) spec.compute(svg);
        for (var i = 0; i < spec.tracks.length; i++) {
          var src = spec.tracks[i], tr = {};
          for (var k in src) tr[k] = src[k];
          if (tr.sel) tr.node = svg.querySelector(tr.sel);
          if (tr.type === "reveal") { tr.len = tr.node.getTotalLength(); tr.node.style.strokeDasharray = tr.len; tr.node.style.strokeDashoffset = tr.len; }
          if (tr.type === "moveAlong" || tr.type === "tangent") {
            tr.path = svg.querySelector(tr.pathSel); tr.Lp = tr.path.getTotalLength();
            tr.ball = svg.querySelector(tr.ballSel || ".ball"); tr.glow = svg.querySelector(tr.glowSel || ".glow");
            tr.base = tr.base || spec.base || { x: 0, y: 0 };
            if (tr.type === "tangent") { tr.line = svg.querySelector(tr.lineSel); if (tr.label) tr.lbl = svg.querySelector(tr.label.sel); }
          }
          ctx.tracks.push(tr);
        }
        return ctx;
      },
      render: function (t, ctx) { applyTracks(ctx, t); },
      staticState: function (ctx) { applyTracks(ctx, spec.staticAt != null ? spec.staticAt : spec.duration); }
    };
  }

  // ── clip-specs (data) ──
  var SPECS = {
    // trilling → lopende golf (amplitude & golflengte)
    golf: {
      duration: 9.2, base: { x: 40, y: 90 },
      cues: [0, 1.7, 3.0, 5.0, 7.2],
      audio: [[1.7, "clipRoll"], [3.05, "clipCatalyst"], [5.05, "clipCatalyst"], [8.6, "clipSuccess"]],
      tracks: [
        { type: "reveal", sel: ".wave", t: [1.6, 7.0], ease: "lin" },
        { type: "moveAlong", pathSel: ".wave", f: [[1.6, 0, "lin"], [7.0, 1, "lin"]], appear: [1.5, 1.6], bright: [1.6, 7.0], brightVal: 0.28, dimVal: 0.1 },
        { type: "fade", sel: ".amp", t: [3.0, 3.8] },
        { type: "fade", sel: ".lam", t: [5.0, 5.8] },
        { type: "fade", sel: ".tnote", t: [7.2, 8.0] }
      ]
    },
    // raaklijn = afgeleide (helling < 0 → 0 → > 0 op een dal-parabool)
    raaklijn: {
      duration: 9.6, staticAt: 5.0, base: { x: 40, y: 40 },
      cues: [0, 2.2, 4.4, 5.6, 8.0],
      audio: [[2.1, "clipRoll"], [4.45, "clipCatalyst"], [5.65, "clipRoll"], [8.2, "clipSuccess"]],
      tracks: [
        {
          type: "tangent", pathSel: ".curve", lineSel: ".tangent", half: 30,
          f: [[2.0, 0, "lin"], [4.3, 0.5, "io"], [5.3, 0.5, "lin"], [7.6, 1, "io"]],
          bright: [2.0, 7.6], brightVal: 0.24, dimVal: 0.1,
          label: { sel: ".lbl-slope", vx: 155, neg: "helling < 0", zero: "helling = 0", pos: "helling > 0", cneg: "#c0392b", czero: "var(--or)", cpos: "#2e9e6b", fade: [1.9, 2.4] }
        },
        { type: "fade", sel: ".vguide", t: [4.3, 4.9] }
      ]
    },
    // break-evenpunt (TK & TO snijden; verlies-/winst-zone)
    breakeven: {
      duration: 9.5,
      cues: [0, 1.6, 3.6, 5.6, 7.4],
      audio: [[1.65, "clipRoll"], [3.65, "clipRoll"], [5.65, "clipCatalyst"], [8.4, "clipSuccess"]],
      tracks: [
        { type: "reveal", sel: ".line-tk", t: [1.6, 3.4] },
        { type: "reveal", sel: ".line-to", t: [3.6, 5.4] },
        { type: "fade", sel: ".be-dot", t: [5.6, 6.2] },
        { type: "attr", sel: ".be-dot", attr: "r", from: 2, to: 5, t: [5.6, 6.3] },
        { type: "reveal", sel: ".be-drop", t: [5.7, 6.6] },
        { type: "fade", sel: ".lbl-be", t: [6.0, 6.6] },
        { type: "fade", sel: ".lbl-verlies", t: [7.4, 8.2] },
        { type: "fade", sel: ".lbl-winst", t: [7.6, 8.4] }
      ]
    },
    // marktevenwicht: vraag & aanbod snijden (Pe, Qe)
    markt: {
      duration: 9.5,
      cues: [0, 1.6, 3.6, 5.6, 7.4],
      audio: [[1.65, "clipRoll"], [3.65, "clipRoll"], [5.65, "clipCatalyst"], [8.4, "clipSuccess"]],
      tracks: [
        { type: "reveal", sel: ".demand", t: [1.6, 3.4] },
        { type: "reveal", sel: ".supply", t: [3.6, 5.4] },
        { type: "fade", sel: ".eq-dot", t: [5.6, 6.2] },
        { type: "attr", sel: ".eq-dot", attr: "r", from: 2, to: 5, t: [5.6, 6.3] },
        { type: "reveal", sel: ".drop-p", t: [5.7, 6.6] },
        { type: "reveal", sel: ".drop-q", t: [5.7, 6.6] },
        { type: "fade", sel: ".lbl-eq", t: [6.0, 6.6] },
        { type: "fade", sel: ".lbl-pe", t: [6.4, 7.1] },
        { type: "fade", sel: ".lbl-qe", t: [6.6, 7.3] }
      ]
    }
  };
  for (var _sk in SPECS) CHOREO[_sk] = specChoreo(SPECS[_sk]);

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
    var gesture = false, audioFired = 0;   // geluid pas ná een gebruikersklik (autoplay-beleid + niet opdringerig)

    function fireAudio(t) {
      if (!gesture || typeof window.playSound !== "function" || !choreo.audio) return;
      while (audioFired < choreo.audio.length && choreo.audio[audioFired].t <= t + 1e-3) {
        try { window.playSound(choreo.audio[audioFired].s); } catch (e) {}
        audioFired++;
      }
    }

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
      fireAudio(t);
      if (elapsed >= choreo.duration) { playing = false; finished = true; if (btn) btn.innerHTML = "↻ Opnieuw"; return; }
      raf = requestAnimationFrame(frame);
    }
    function ensure() { if (!ctx) ctx = choreo.build(clip); }
    function start(fromZero) {
      ensure();
      if (fromZero) { elapsed = 0; finished = false; lastCue = -1; audioFired = 0; }
      playing = true; last = 0; if (btn) btn.innerHTML = "❚❚ Pauze";
      raf = requestAnimationFrame(frame);
    }
    function pause() { playing = false; if (raf) cancelAnimationFrame(raf); if (btn) btn.innerHTML = finished ? "↻ Opnieuw" : "▶ Verder"; }
    function toggle() { if (playing) pause(); else start(finished); }

    try { ensure(); choreo.render(0, ctx); caption(0); } catch (e) { staticFallback(); return; }
    if (btn) btn.addEventListener("click", function () {
      if (!gesture) {                        // eerste echte gebruikersinteractie -> geluid mag
        gesture = true;
        if (!finished && elapsed > 0.05 && choreo.audio) { // hervat midden in de clip: al-gepasseerde geluiden overslaan (geen burst)
          audioFired = 0;
          while (audioFired < choreo.audio.length && choreo.audio[audioFired].t <= elapsed) audioFired++;
        }
      }
      toggle();
    });

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
