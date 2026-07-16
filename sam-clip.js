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

  // helper: plaats een .ball + .glow op punt p, gegeven authored basispositie (bx,by)
  function putBall(ctx, p) {
    var tr = "translate(" + (p.x - ctx.bx).toFixed(2) + "," + (p.y - ctx.by).toFixed(2) + ")";
    ctx.ball.setAttribute("transform", tr);
    if (ctx.glow) ctx.glow.setAttribute("transform", tr);
  }

  // ── clip: trilling → lopende golf (amplitude & golflengte) ──
  CHOREO.golf = {
    duration: 9.2,
    cues: [{ t: 0, i: 0 }, { t: 1.7, i: 1 }, { t: 3.0, i: 2 }, { t: 5.0, i: 3 }, { t: 7.2, i: 4 }],
    audio: [{ t: 1.7, s: "clipRoll" }, { t: 3.05, s: "clipCatalyst" }, { t: 5.05, s: "clipCatalyst" }, { t: 8.6, s: "clipSuccess" }],
    build: function (clip) {
      var svg = clip.querySelector("svg");
      var ctx = {
        svg: svg, wave: svg.querySelector(".wave"), ball: svg.querySelector(".ball"),
        glow: svg.querySelector(".glow"), amp: svg.querySelector(".amp"),
        lam: svg.querySelector(".lam"), tnote: svg.querySelector(".tnote"),
        bx: 40, by: 90
      };
      ctx.L = ctx.wave.getTotalLength();
      ctx.wave.style.strokeDasharray = ctx.L;
      ctx.wave.style.strokeDashoffset = ctx.L;
      return ctx;
    },
    render: function (t, ctx) {
      var f = seg(t, 1.6, 7.0);
      ctx.wave.style.strokeDashoffset = (ctx.L * (1 - f)).toFixed(1);
      if (t < 1.55) { ctx.ball.style.opacity = "0"; ctx.glow.style.opacity = "0"; }
      else { ctx.ball.style.opacity = "1"; putBall(ctx, ctx.wave.getPointAtLength(f * ctx.L)); }
      ctx.amp.style.opacity = easeOut(seg(t, 3.0, 3.8)).toFixed(2);
      ctx.lam.style.opacity = easeOut(seg(t, 5.0, 5.8)).toFixed(2);
      ctx.tnote.style.opacity = easeOut(seg(t, 7.2, 8.0)).toFixed(2);
      var moving = t >= 1.6 && t < 7.0;
      ctx.glow.style.opacity = (t < 1.55 ? 0 : moving ? 0.28 : 0.1).toFixed(2);
    },
    staticState: function (ctx) {
      ctx.wave.style.strokeDashoffset = "0";
      ctx.ball.style.opacity = "1"; ctx.glow.style.opacity = "0.1";
      putBall(ctx, ctx.wave.getPointAtLength(ctx.L));
      ctx.amp.style.opacity = "1"; ctx.lam.style.opacity = "1"; ctx.tnote.style.opacity = "1";
    }
  };

  // ── clip: raaklijn = afgeleide (helling < 0 → 0 → > 0 op een dal-parabool) ──
  CHOREO.raaklijn = {
    duration: 9.6,
    cues: [{ t: 0, i: 0 }, { t: 2.2, i: 1 }, { t: 4.4, i: 2 }, { t: 5.6, i: 3 }, { t: 8.0, i: 4 }],
    audio: [{ t: 2.1, s: "clipRoll" }, { t: 4.45, s: "clipCatalyst" }, { t: 5.65, s: "clipRoll" }, { t: 8.2, s: "clipSuccess" }],
    build: function (clip) {
      var svg = clip.querySelector("svg");
      var ctx = {
        svg: svg, curve: svg.querySelector(".curve"), ball: svg.querySelector(".ball"),
        glow: svg.querySelector(".glow"), tangent: svg.querySelector(".tangent"),
        lbl: svg.querySelector(".lbl-slope"), vguide: svg.querySelector(".vguide"),
        bx: 40, by: 40, vx: 155
      };
      ctx.L = ctx.curve.getTotalLength();
      return ctx;
    },
    _frac: function (t) {
      if (t < 2.0) return 0;
      if (t < 4.3) return 0.5 * easeInOut(seg(t, 2.0, 4.3));
      if (t < 5.3) return 0.5;
      if (t < 7.6) return 0.5 + 0.5 * easeInOut(seg(t, 5.3, 7.6));
      return 1;
    },
    render: function (t, ctx) {
      var f = this._frac(t), Lf = f * ctx.L, eps = 1.6;
      var p = ctx.curve.getPointAtLength(Lf);
      var p1 = ctx.curve.getPointAtLength(Math.max(0, Lf - eps));
      var p2 = ctx.curve.getPointAtLength(Math.min(ctx.L, Lf + eps));
      var dx = p2.x - p1.x, dy = p2.y - p1.y, m = Math.hypot(dx, dy) || 1;
      var ux = dx / m, uy = dy / m, half = 30;
      ctx.tangent.setAttribute("x1", (p.x - ux * half).toFixed(1));
      ctx.tangent.setAttribute("y1", (p.y - uy * half).toFixed(1));
      ctx.tangent.setAttribute("x2", (p.x + ux * half).toFixed(1));
      ctx.tangent.setAttribute("y2", (p.y + uy * half).toFixed(1));
      putBall(ctx, p);
      var neg = p.x < ctx.vx - 5, pos = p.x > ctx.vx + 5;
      ctx.lbl.textContent = neg ? "helling < 0" : pos ? "helling > 0" : "helling = 0";
      ctx.lbl.setAttribute("x", p.x.toFixed(1));
      ctx.lbl.setAttribute("y", (p.y - 14).toFixed(1));
      ctx.lbl.style.fill = neg ? "#c0392b" : pos ? "#2e9e6b" : "var(--or)";
      ctx.lbl.style.opacity = easeOut(seg(t, 1.9, 2.4)).toFixed(2);
      ctx.vguide.style.opacity = easeOut(seg(t, 4.3, 4.9)).toFixed(2);
      ctx.glow.style.opacity = ((t >= 2.0 && t < 7.6) ? 0.24 : 0.1).toFixed(2);
    },
    staticState: function (ctx) { this.render(4.85, ctx); ctx.lbl.style.opacity = "1"; ctx.vguide.style.opacity = "1"; }
  };

  // ── clip: break-evenpunt (TK & TO snijden; verlies-/winst-zone) ──
  CHOREO.breakeven = {
    duration: 9.5,
    cues: [{ t: 0, i: 0 }, { t: 1.6, i: 1 }, { t: 3.6, i: 2 }, { t: 5.6, i: 3 }, { t: 7.4, i: 4 }],
    audio: [{ t: 1.65, s: "clipRoll" }, { t: 3.65, s: "clipRoll" }, { t: 5.65, s: "clipCatalyst" }, { t: 8.4, s: "clipSuccess" }],
    build: function (clip) {
      var svg = clip.querySelector("svg");
      var ctx = {
        tk: svg.querySelector(".line-tk"), to: svg.querySelector(".line-to"),
        dot: svg.querySelector(".be-dot"), drop: svg.querySelector(".be-drop"),
        verlies: svg.querySelector(".lbl-verlies"), winst: svg.querySelector(".lbl-winst"),
        lblbe: svg.querySelector(".lbl-be")
      };
      // snijpunt van TK (40,82)-(280,58) en TO (40,146)-(280,18)
      var u = (146 - 82) / (128 - 24), xi = 40 + 240 * u, yi = 82 - 24 * u;
      ctx.xi = xi; ctx.yi = yi;
      ctx.dot.setAttribute("cx", xi.toFixed(1)); ctx.dot.setAttribute("cy", yi.toFixed(1));
      ctx.drop.setAttribute("x1", xi.toFixed(1)); ctx.drop.setAttribute("y1", yi.toFixed(1));
      ctx.drop.setAttribute("x2", xi.toFixed(1)); ctx.drop.setAttribute("y2", "146");
      ctx.lblbe.setAttribute("x", xi.toFixed(1));
      ctx.Ltk = ctx.tk.getTotalLength(); ctx.Lto = ctx.to.getTotalLength();
      ctx.Ldrop = 146 - yi;
      ctx.tk.style.strokeDasharray = ctx.Ltk; ctx.tk.style.strokeDashoffset = ctx.Ltk;
      ctx.to.style.strokeDasharray = ctx.Lto; ctx.to.style.strokeDashoffset = ctx.Lto;
      ctx.drop.style.strokeDasharray = ctx.Ldrop; ctx.drop.style.strokeDashoffset = ctx.Ldrop;
      return ctx;
    },
    render: function (t, ctx) {
      ctx.tk.style.strokeDashoffset = (ctx.Ltk * (1 - easeOut(seg(t, 1.6, 3.4)))).toFixed(1);
      ctx.to.style.strokeDashoffset = (ctx.Lto * (1 - easeOut(seg(t, 3.6, 5.4)))).toFixed(1);
      var pop = easeOut(seg(t, 5.6, 6.3));
      ctx.dot.style.opacity = easeOut(seg(t, 5.6, 6.2)).toFixed(2);
      ctx.dot.setAttribute("r", (2 + 3 * pop).toFixed(2));
      ctx.drop.style.strokeDashoffset = (ctx.Ldrop * (1 - easeOut(seg(t, 5.7, 6.6)))).toFixed(1);
      ctx.lblbe.style.opacity = easeOut(seg(t, 6.0, 6.6)).toFixed(2);
      ctx.verlies.style.opacity = easeOut(seg(t, 7.4, 8.2)).toFixed(2);
      ctx.winst.style.opacity = easeOut(seg(t, 7.6, 8.4)).toFixed(2);
    },
    staticState: function (ctx) {
      ctx.tk.style.strokeDashoffset = "0"; ctx.to.style.strokeDashoffset = "0";
      ctx.drop.style.strokeDashoffset = "0";
      ctx.dot.style.opacity = "1"; ctx.dot.setAttribute("r", "5");
      ctx.lblbe.style.opacity = "1"; ctx.verlies.style.opacity = "1"; ctx.winst.style.opacity = "1";
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
