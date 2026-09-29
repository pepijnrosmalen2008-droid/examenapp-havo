// ═══════════════════════════════════════════════════════════════════════
// social/geluid.js - geluid voor de Instagram-posts
// ───────────────────────────────────────────────────────────────────────
// Dezelfde synthese als playSound() in quiz.js (warme tonen met glide,
// detune-laag, octaaf-sparkle, korte reverb), zodat de video's klinken als
// de app. Aangevuld met filmische geluiden voor montage: whoosh, impact,
// wekker, teller, kist, riser.
//
// Een post zet window.__GELUID = [[tijd, 'naam', volume?, extra?], ...].
//   Geluid.wav(cues, duur)  → Promise<base64 WAV> (OfflineAudioContext, exact)
//   Geluid.speel(naam, vol) → live afspelen tijdens de preview
// Ruis is geseed: elke render klinkt identiek.
// ═══════════════════════════════════════════════════════════════════════
(function () {
  const SR = 48000;
  function rnd(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

  // Mengtafel: master + korte reverb (zelfde opzet als de app).
  function tafel(ac) {
    const mg = ac.createGain(); mg.gain.value = .6;
    // zachte limiter zodat stapelende geluiden niet clippen
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -10; comp.knee.value = 8; comp.ratio.value = 6; comp.attack.value = .003; comp.release.value = .12;
    mg.connect(comp); comp.connect(ac.destination);
    const len = Math.floor(ac.sampleRate * .6), ir = ac.createBuffer(2, len, ac.sampleRate), r = rnd(99);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (r() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    const cv = ac.createConvolver(); cv.buffer = ir; const rev = ac.createGain(); const rw = ac.createGain(); rw.gain.value = .22;
    rev.connect(cv); cv.connect(rw); rw.connect(mg);
    return { mg, rev };
  }

  // Toon (port van _slTone): f1→f2 glide, lowpass, detune-laag, octaaf.
  function T(ac, M, uit, f1, f2, start, dur, opt) {
    opt = opt || {};
    const g = ac.createGain(), lp = ac.createBiquadFilter();
    const vol = opt.vol != null ? opt.vol : .12;
    g.gain.setValueAtTime(.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + (opt.attack || .008));
    g.gain.exponentialRampToValueAtTime(.0001, start + dur);
    lp.type = 'lowpass'; lp.frequency.value = opt.cut || 2400; lp.Q.value = opt.q != null ? opt.q : .7;
    g.connect(lp); lp.connect(uit); if (opt.rev) lp.connect(M.rev);
    const mk = (type, det, vfrac, fmul) => {
      const o = ac.createOscillator(); o.type = type;
      const a = f1 * (fmul || 1), b = (f2 || f1) * (fmul || 1);
      o.frequency.setValueAtTime(a, start);
      if (f2 && f2 !== f1) o.frequency.exponentialRampToValueAtTime(Math.max(30, b), start + dur * (opt.glide || .5));
      if (det) o.detune.value = det;
      const gg = ac.createGain(); gg.gain.value = vfrac; o.connect(gg); gg.connect(g);
      o.start(start); o.stop(start + dur + .05);
    };
    mk(opt.type || 'sine', 0, 1, 1);
    if (opt.detune) mk(opt.type || 'sine', opt.detune, .6, 1);
    if (opt.harm) mk('sine', 0, opt.harm, 2);
  }
  // Gefilterde ruis (port van _slNoise), met optionele filter-sweep.
  let _seed = 1;
  function N(ac, M, uit, start, dur, opt) {
    opt = opt || {};
    const len = Math.max(1, Math.floor(ac.sampleRate * dur)), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0), r = rnd(_seed++ * 7919);
    for (let i = 0; i < len; i++) d[i] = r() * 2 - 1;
    const n = ac.createBufferSource(); n.buffer = buf;
    const bp = ac.createBiquadFilter(); bp.type = opt.filter || 'bandpass'; bp.frequency.setValueAtTime(opt.freq || 2200, start); bp.Q.value = opt.q || 1.1;
    if (opt.freq2) bp.frequency.exponentialRampToValueAtTime(opt.freq2, start + dur * (opt.sweep || .9));
    const g = ac.createGain(); const vol = opt.vol != null ? opt.vol : .05;
    if (opt.swell) { g.gain.setValueAtTime(.0001, start); g.gain.exponentialRampToValueAtTime(vol, start + dur * opt.swell); g.gain.exponentialRampToValueAtTime(.0001, start + dur); }
    else { g.gain.setValueAtTime(vol, start); g.gain.exponentialRampToValueAtTime(.0001, start + dur); }
    n.connect(bp); bp.connect(g); g.connect(uit); if (opt.rev) g.connect(M.rev);
    n.start(start); n.stop(start + dur + .02);
  }

  // Recepten. (t = starttijd, x = extra parameter uit de cue)
  const R = {
    // ── uit de app (quiz.js playSound) ──
    tap: (a, M, u, t) => { N(a, M, u, t, .008, { freq: 2600, vol: .022, q: .9 }); T(a, M, u, 587, 775, t, .085, { vol: .085, glide: .32, cut: 2900, harm: .16, detune: 7 }); },
    pop: (a, M, u, t) => { N(a, M, u, t, .012, { freq: 3000, vol: .04 }); T(a, M, u, 560, 1120, t, .12, { vol: .16, glide: .36, cut: 3600, harm: .24, detune: 11 }); T(a, M, u, 1680, null, t + .03, .10, { type: 'triangle', vol: .06, cut: 5000 }); },
    nav: (a, M, u, t) => T(a, M, u, 440, 860, t, .10, { vol: .10, glide: .7, cut: 3200, harm: .12, detune: 6 }),
    open: (a, M, u, t) => { T(a, M, u, 392, 784, t, .16, { vol: .12, glide: .7, cut: 3400, detune: 8 }); T(a, M, u, 587, 1175, t + .03, .18, { type: 'triangle', vol: .07, glide: .7 }); T(a, M, u, 1568, null, t + .12, .14, { vol: .05, rev: true }); },
    correct: (a, M, u, t) => { [784, 988, 1319].forEach((f, i) => T(a, M, u, f, null, t + i * .066, .20, { vol: .16, cut: 3800, harm: .30, detune: 6, rev: true })); T(a, M, u, 1976, null, t + .16, .30, { type: 'triangle', vol: .07, cut: 6000, rev: true }); },
    combo: (a, M, u, t) => { [659, 831, 988, 1319].forEach((f, i) => T(a, M, u, f, null, t + i * .06, .18, { vol: .15, cut: 4200, harm: .26, detune: 6, rev: true })); T(a, M, u, 1976, null, t + .20, .30, { type: 'triangle', vol: .07, rev: true }); },
    streak: (a, M, u, t) => [659, 659, 988, 1319].forEach((f, i) => T(a, M, u, f, f * 1.04, t + i * .08, .16, { type: 'triangle', vol: .13, cut: 4200, harm: .20, detune: 7 })),
    start: (a, M, u, t) => { T(a, M, u, 392, 784, t, .14, { type: 'triangle', vol: .14, glide: .6, detune: 9 }); T(a, M, u, 587, 1175, t + .07, .18, { vol: .10, glide: .6, harm: .22, rev: true }); },
    flip: (a, M, u, t) => { N(a, M, u, t, .06, { freq: 3400, vol: .05, q: .5 }); T(a, M, u, 480, 1020, t, .10, { vol: .08, glide: .8, cut: 4400, harm: .14 }); },
    tick: (a, M, u, t, x) => T(a, M, u, x || 760, null, t, .045, { vol: .07, cut: 2400 }),
    xp: (a, M, u, t) => { T(a, M, u, 880, 1320, t, .10, { type: 'triangle', vol: .13, glide: .3, harm: .20 }); T(a, M, u, 1320, 1760, t + .07, .12, { type: 'triangle', vol: .12, glide: .3, harm: .20, rev: true }); },
    badge: (a, M, u, t) => { [659, 988, 1319, 1568].forEach((f, i) => T(a, M, u, f, null, t + i * .078, .24, { type: 'triangle', vol: .15, cut: 4600, harm: .24, detune: 5, rev: true })); T(a, M, u, 1976, null, t + .32, .5, { vol: .06, rev: true }); },
    evolve: (a, M, u, t) => { [523, 659, 784, 1047, 1319].forEach((f, i) => T(a, M, u, f, f * 1.18, t + i * .075, .30, { type: 'triangle', vol: .13, glide: .4, harm: .20, detune: 6, rev: true })); T(a, M, u, 1568, null, t + .44, .6, { vol: .06, rev: true }); },
    levelup: (a, M, u, t) => { [392, 523, 659, 784].forEach((f, i) => T(a, M, u, f, f * 1.25, t + i * .10, .34, { type: 'triangle', vol: .16, glide: .25, harm: .22, detune: 7, rev: true })); T(a, M, u, 1568, null, t + .44, .55, { vol: .08, rev: true }); T(a, M, u, 1976, null, t + .50, .40, { vol: .05, rev: true }); },
    fanfare: (a, M, u, t) => { [523, 659, 784, 1047].forEach((f, i) => T(a, M, u, f, f * 1.2, t + i * .105, .40, { type: 'triangle', vol: .17, glide: .2, harm: .20, detune: 6, rev: true })); T(a, M, u, 1047, null, t + .48, .6, { vol: .09, rev: true }); T(a, M, u, 1568, null, t + .48, .6, { type: 'triangle', vol: .06, rev: true }); },
    coin: (a, M, u, t) => { T(a, M, u, 1046, 1568, t, .09, { type: 'triangle', vol: .13, glide: .35, harm: .30, detune: 8, rev: true }); T(a, M, u, 1568, 2093, t + .05, .12, { vol: .10, glide: .35, harm: .26, rev: true }); N(a, M, u, t, .02, { freq: 5200, vol: .03, q: .8 }); },
    // ── montage ──
    whoosh: (a, M, u, t, x) => { const d = x || .38; N(a, M, u, t, d, { freq: 350, freq2: 4200, q: .8, vol: .10, swell: .55, sweep: .8 }); N(a, M, u, t, d * .9, { filter: 'lowpass', freq: 220, freq2: 900, vol: .05, swell: .5 }); },
    impact: (a, M, u, t) => { T(a, M, u, 150, 42, t, .42, { vol: .34, glide: .35, cut: 900, attack: .003 }); N(a, M, u, t, .18, { filter: 'lowpass', freq: 1400, freq2: 200, vol: .16, rev: true }); N(a, M, u, t, .03, { freq: 4000, vol: .05 }); },
    boem: (a, M, u, t) => { T(a, M, u, 120, 36, t, .55, { vol: .40, glide: .3, cut: 700, attack: .002 }); T(a, M, u, 60, 32, t, .7, { vol: .22, glide: .6, cut: 300, attack: .002 }); N(a, M, u, t, .25, { filter: 'lowpass', freq: 2200, freq2: 150, vol: .2, rev: true }); },
    riser: (a, M, u, t, x) => { const d = x || 1.2; T(a, M, u, 180, 880, t, d, { type: 'sawtooth', vol: .05, glide: 1, cut: 1800, attack: d * .8, detune: 12 }); N(a, M, u, t, d, { freq: 500, freq2: 6000, q: .6, vol: .06, swell: .92, sweep: 1 }); },
    teller: (a, M, u, t, x) => { // tikjes die vertragen, zoals een teller die uitloopt
      const d = x || 1.2, n = 18; for (let i = 0; i < n; i++) { const q = i / (n - 1); const tt = t + d * (1 - Math.pow(1 - q, 2.2)); T(a, M, u, 900 + q * 700, null, tt, .04, { vol: .06, cut: 3500 }); } },
    wekker: (a, M, u, t) => { for (let i = 0; i < 9; i++) T(a, M, u, i % 2 ? 1319 : 1760, null, t + i * .06, .07, { type: 'square', vol: .045, cut: 3800, attack: .002 }); N(a, M, u, t, .5, { freq: 3000, vol: .02 }); },
    schud: (a, M, u, t) => { for (let i = 0; i < 4; i++) N(a, M, u, t + i * .03, .04, { freq: 900 + i * 200, vol: .08, q: 1.4 }); T(a, M, u, 220, 170, t, .12, { vol: .1, cut: 900 }); },
    kist: (a, M, u, t) => { N(a, M, u, t, .22, { freq: 600, freq2: 1600, q: 2, vol: .05 }); R.badge(a, M, u, t + .08); T(a, M, u, 2637, null, t + .2, .7, { vol: .04, rev: true }); },
    ontbrand: (a, M, u, t) => { N(a, M, u, t, .7, { filter: 'lowpass', freq: 300, freq2: 2400, vol: .12, swell: .3 }); T(a, M, u, 200, 400, t, .5, { vol: .08, cut: 1200, glide: .6 }); },
    nacht: (a, M, u, t, x) => { const d = x || 2; T(a, M, u, 110, null, t, d, { vol: .05, cut: 500, attack: .6, detune: 9 }); T(a, M, u, 165, null, t, d, { vol: .03, cut: 700, attack: .8, detune: -7 }); },
    snurk: (a, M, u, t) => N(a, M, u, t, .6, { filter: 'lowpass', freq: 180, freq2: 520, vol: .07, swell: .6 }),
  };

  function plan(ac, M, cues) {
    for (const [t, naam, vol, x] of cues) {
      const f = R[naam]; if (!f) continue;
      const g = ac.createGain(); g.gain.value = vol == null ? 1 : vol; g.connect(M.mg);
      f(ac, M, g, Math.max(0, t), x);
    }
  }
  async function render(cues, duur) {
    _seed = 1;
    const ac = new OfflineAudioContext(2, Math.ceil(SR * (duur + .05)), SR);
    const M = tafel(ac); plan(ac, M, cues);
    return ac.startRendering();
  }
  // 16-bit PCM WAV, base64 (voor render.mjs).
  async function wav(cues, duur) {
    const buf = await render(cues, duur);
    const n = Math.floor(SR * duur), L = buf.getChannelData(0), Rr = buf.getChannelData(1);
    const out = new DataView(new ArrayBuffer(44 + n * 4));
    const s = (o, str) => { for (let i = 0; i < str.length; i++) out.setUint8(o + i, str.charCodeAt(i)); };
    s(0, 'RIFF'); out.setUint32(4, 36 + n * 4, true); s(8, 'WAVE'); s(12, 'fmt '); out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 2, true);
    out.setUint32(24, SR, true); out.setUint32(28, SR * 4, true); out.setUint16(32, 4, true); out.setUint16(34, 16, true); s(36, 'data'); out.setUint32(40, n * 4, true);
    for (let i = 0; i < n; i++) { out.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i])) * 32767, true); out.setInt16(46 + i * 4, Math.max(-1, Math.min(1, Rr[i])) * 32767, true); }
    const bytes = new Uint8Array(out.buffer); let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  // Live (preview).
  let live = null;
  function speel(naam, vol, x) {
    try { if (!live) { const ac = new AudioContext(); live = { ac, M: tafel(ac) }; } if (live.ac.state === 'suspended') live.ac.resume();
      plan(live.ac, live.M, [[live.ac.currentTime + .01, naam, vol, x]]); } catch (e) {}
  }
  window.Geluid = { wav, speel, recepten: Object.keys(R) };
})();
