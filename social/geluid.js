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
    const mg = ac.createGain(); mg.gain.value = .7;
    // Warm houden: alles boven ~2,8 kHz 7 dB zachter en niets boven 7 kHz (dat is waar het 'schel' zit).
    const shelf = ac.createBiquadFilter(); shelf.type = 'highshelf'; shelf.frequency.value = 2800; shelf.gain.value = -7;
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 7000; lp.Q.value = .5;
    // zachte limiter zodat stapelende geluiden niet clippen
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -10; comp.knee.value = 8; comp.ratio.value = 6; comp.attack.value = .003; comp.release.value = .12;
    mg.connect(shelf); shelf.connect(lp); lp.connect(comp); comp.connect(ac.destination);
    const len = Math.floor(ac.sampleRate * .6), ir = ac.createBuffer(2, len, ac.sampleRate), r = rnd(99);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (r() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    const cv = ac.createConvolver(); cv.buffer = ir; const rev = ac.createGain(); const rw = ac.createGain(); rw.gain.value = .22;
    rev.connect(cv); cv.connect(rw); rw.connect(mg);
    // Zaal: lange, zachte galm voor de momenten (level, promotie, streak).
    const zl = Math.floor(ac.sampleRate * 2.6), zir = ac.createBuffer(2, zl, ac.sampleRate), zr = rnd(41);
    for (let ch = 0; ch < 2; ch++) { const d = zir.getChannelData(ch); let v = 0; for (let i = 0; i < zl; i++) { v = v * .72 + (zr() * 2 - 1) * .28; d[i] = v * Math.pow(1 - i / zl, 2.4) * (i < 600 ? i / 600 : 1); } }
    const zcv = ac.createConvolver(); zcv.buffer = zir; const zaal = ac.createGain(); const zw = ac.createGain(); zw.gain.value = .5;
    zaal.connect(zcv); zcv.connect(zw); zw.connect(mg);
    return { mg, rev, zaal };
  }

  // Toon (port van _slTone): f1→f2 glide, lowpass, detune-laag, octaaf.
  let PITCH = 1;
  function T(ac, M, uit, f1, f2, start, dur, opt) {
    opt = Object.assign({}, opt || {});
    f1 *= PITCH; if (f2) f2 *= PITCH;
    if (opt.harm) opt.harm *= .5;                                   // octaaf-sparkle half zo sterk
    opt.cut = Math.min(opt.cut || 2400, 2600);                      // geen scherpe boventonen
    opt.attack = Math.max(opt.attack || .008, dur > .3 ? .008 : .012);
    if (opt.type === 'square') opt.type = 'triangle';
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
    const bp = ac.createBiquadFilter(); bp.type = opt.filter || 'bandpass'; bp.frequency.setValueAtTime(Math.min(opt.freq || 2200, 2400), start); bp.Q.value = opt.q || 1.1;
    if (opt.freq2) bp.frequency.exponentialRampToValueAtTime(Math.min(opt.freq2, 2400), start + dur * (opt.sweep || .9));
    const g = ac.createGain(); const vol = opt.vol != null ? opt.vol : .05;
    if (opt.swell) { g.gain.setValueAtTime(.0001, start); g.gain.exponentialRampToValueAtTime(vol, start + dur * opt.swell); g.gain.exponentialRampToValueAtTime(.0001, start + dur); }
    else { g.gain.setValueAtTime(vol, start); g.gain.exponentialRampToValueAtTime(.0001, start + dur); }
    n.connect(bp); bp.connect(g); g.connect(uit); if (opt.rev) g.connect(M.rev);
    n.start(start); n.stop(start + dur + .02);
  }

  // ── Bouwstenen voor de momenten: voller en muzikaler dan de losse app-klanken ──
  const NOOT = n => 440 * Math.pow(2, n / 12);                    // halve tonen vanaf A4
  const env = (g, t, att, piek, dur) => { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(piek, t + att); g.gain.exponentialRampToValueAtTime(.0001, t + dur); };
  const pan = (ac, x) => { if (!ac.createStereoPanner) return null; const pn = ac.createStereoPanner(); pn.pan.value = x; return pn; };
  const naar = (ac, M, bron, uit, zaal, px) => { const pn = px ? pan(ac, px) : null; if (pn) { bron.connect(pn); pn.connect(uit); } else bron.connect(uit);
    if (zaal) { const z = ac.createGain(); z.gain.value = zaal; bron.connect(z); z.connect(M.zaal); } };
  // Klokje: grondtoon met twee onharmonische boventonen die snel wegsterven (celesta-achtig).
  function bel(ac, M, uit, f, t, dur, vol, px) {
    const g = ac.createGain(); g.gain.value = 1; naar(ac, M, g, uit, .55, px);
    [[1, 1, 1], [2.76, .34, .45], [5.4, .14, .22], [.5, .3, 1]].forEach(([m, v, d]) => { const o = ac.createOscillator(), e = ac.createGain(); o.type = 'sine'; o.frequency.value = f * m;
      env(e, t, .004, vol * v, dur * d); o.connect(e); e.connect(g); o.start(t); o.stop(t + dur * d + .05); });
  }
  // Pluk: korte, ronde toon waarvan het filter dichtvalt (marimba-achtig).
  function pluk(ac, M, uit, f, t, dur, vol, px) {
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 1.2; lp.frequency.setValueAtTime(Math.min(5200, f * 6), t); lp.frequency.exponentialRampToValueAtTime(Math.max(300, f * 1.2), t + dur);
    const g = ac.createGain(); env(g, t, .005, vol, dur); lp.connect(g); naar(ac, M, g, uit, .3, px);
    [['triangle', 1, 0], ['sine', .5, 0], ['triangle', .35, 7]].forEach(([ty, v, det]) => { const o = ac.createOscillator(), e = ac.createGain(); o.type = ty; o.frequency.value = f; o.detune.value = det; e.gain.value = v; o.connect(e); e.connect(lp); o.start(t); o.stop(t + dur + .05); });
  }
  // Vlak akkoord: per noot twee ontstemde zaagtanden door een filter dat opengaat.
  function vlak(ac, M, uit, freqs, t, dur, vol, o) {
    o = o || {}; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = .8;
    lp.frequency.setValueAtTime(o.c1 || 500, t); lp.frequency.exponentialRampToValueAtTime(o.c2 || 2200, t + (o.open || dur * .4)); lp.frequency.exponentialRampToValueAtTime(o.c3 || 700, t + dur);
    const g = ac.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (o.att || .04)); g.gain.setValueAtTime(vol, t + dur * (o.houd || .45)); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    lp.connect(g); naar(ac, M, g, uit, o.zaal == null ? .45 : o.zaal);
    freqs.forEach((f, i) => [-9, 8].forEach((det, k) => { const os = ac.createOscillator(), e = ac.createGain(), pn = pan(ac, (k ? 1 : -1) * .45); os.type = o.type || 'sawtooth'; os.frequency.value = f; os.detune.value = det + i * 2; e.gain.value = 1 / freqs.length;
      os.connect(e); if (pn) { e.connect(pn); pn.connect(lp); } else e.connect(lp); os.start(t); os.stop(t + dur + .05); }));
  }
  // Dreun: diepe klap met een tik erbovenop.
  function dreun(ac, M, uit, t, vol, laag) {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(laag ? 110 : 150, t); o.frequency.exponentialRampToValueAtTime(laag ? 34 : 42, t + .32);
    env(g, t, .003, vol, laag ? .9 : .6); o.connect(g); g.connect(uit); o.start(t); o.stop(t + 1);
    ruis(ac, M, uit, t, .1, { f1: 1800, f2: 300, vol: vol * .35, soort: 'lowpass' });
  }
  // Ruis met vrije filterbaan (tot 6 kHz): lucht, bekken, vuur.
  function ruis(ac, M, uit, t, dur, o) {
    o = o || {}; const len = Math.max(1, Math.floor(ac.sampleRate * dur)), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0), r = rnd(_seed++ * 7919);
    for (let i = 0; i < len; i++) d[i] = r() * 2 - 1;
    const n = ac.createBufferSource(); n.buffer = buf; const f = ac.createBiquadFilter(); f.type = o.soort || 'bandpass'; f.Q.value = o.q || .9;
    f.frequency.setValueAtTime(o.f1 || 1000, t); if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + dur * (o.baan || 1));
    const g = ac.createGain(), v = o.vol || .05; if (o.zwel) { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + dur * o.zwel); g.gain.exponentialRampToValueAtTime(.0001, t + dur); } else env(g, t, o.att || .004, v, dur);
    n.connect(f); f.connect(g); naar(ac, M, g, uit, o.zaal || 0, o.px); n.start(t); n.stop(t + dur + .02);
  }
  // Glinstering: losse hoge klokjes uit de toonladder, links en rechts.
  function glinster(ac, M, uit, t0, t1, noten, n, vol, seed) {
    const r = rnd(seed); for (let i = 0; i < n; i++) bel(ac, M, uit, NOOT(noten[Math.floor(r() * noten.length)] + 12), lerp(t0, t1, (i + r() * .6) / n), .9, vol * (.5 + r() * .5), (r() - .5) * 1.4);
  }
  const lerp = (a, b, x) => a + (b - a) * x;

  // ── Akoestische instrumenten en geluiden van dingen ──
  // Snaar (Karplus-Strong): een aangeslagen snaar die uitsterft. Klinkt als bas, ukelele of gitaar.
  function snaar(ac, M, uit, f, t, dur, vol, o, px) {
    o = o || {}; const sr = ac.sampleRate, N = Math.max(2, Math.round(sr / f)), len = Math.floor(sr * dur), buf = ac.createBuffer(1, len, sr), d = buf.getChannelData(0), r = rnd(_seed++ * 7919);
    const ring = new Float32Array(N); let vorig = 0; for (let i = 0; i < N; i++) { vorig += (o.helder || .5) * ((r() * 2 - 1) - vorig); ring[i] = vorig; }
    let k = 0, laatst = 0; const dm = o.demp || .995;
    for (let i = 0; i < len; i++) { const cur = ring[k]; ring[k] = dm * .5 * (cur + laatst); laatst = cur; d[i] = cur * (i > len - 1500 ? (len - i) / 1500 : 1); k = (k + 1) % N; }
    const n = ac.createBufferSource(); n.buffer = buf; const g = ac.createGain(); g.gain.value = vol * 2.2; n.connect(g);
    const pn = px ? pan(ac, px) : null; if (pn) { g.connect(pn); pn.connect(uit); } else g.connect(uit);
    const rv = ac.createGain(); rv.gain.value = .25; g.connect(rv); rv.connect(M.rev); n.start(t);
  }
  // Getokkeld akkoord: de snaren vlak na elkaar, zoals een duim over een ukelele.
  function tokkel(ac, M, uit, freqs, t, dur, vol) { freqs.forEach((f, i) => snaar(ac, M, uit, f, t + i * .017, dur, vol * (1 - i * .08), { demp: .9955, helder: .6 }, (i - 1.5) * .25)); }
  const osc = (ac, uit, type, f, t, att, piek, dur) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f; env(g, t, att, piek, dur); o.connect(g); g.connect(uit); o.start(t); o.stop(t + dur + .05); return o; };
  const bus = (ac, M, uit, px, galm) => { const g = ac.createGain(); const pn = px ? pan(ac, px) : null; if (pn) { g.connect(pn); pn.connect(uit); } else g.connect(uit); if (galm) { const rv = ac.createGain(); rv.gain.value = galm; g.connect(rv); rv.connect(M.rev); } return g; };
  // Marimba: houten toon, korte boventoon, zachte tik van de stok.
  function marimba(ac, M, uit, f, t, vol, px) { const g = bus(ac, M, uit, px, .3);
    osc(ac, g, 'sine', f, t, .004, vol, .5); osc(ac, g, 'sine', f * 3.93, t, .003, vol * .28, .09); osc(ac, g, 'sine', f * 9.2, t, .002, vol * .08, .03);
    ruis(ac, M, g, t, .014, { soort: 'lowpass', f1: 1300, vol: vol * .5 }); }
  // Kalimba: metalen tong, helder en kort.
  function kalimba(ac, M, uit, f, t, vol, px) { const g = bus(ac, M, uit, px, .35);
    osc(ac, g, 'sine', f, t, .003, vol, .85); osc(ac, g, 'sine', f * 2, t, .003, vol * .22, .3); osc(ac, g, 'sine', f * 5.35, t, .002, vol * .14, .05);
    ruis(ac, M, g, t, .008, { f1: 3200, vol: vol * .25, q: 1.5 }); }
  // Handklap: drie korte stootjes ruis en een staartje.
  function klap(ac, M, uit, t, vol) { const g = bus(ac, M, uit, 0, .3); [0, .011, .023].forEach(d => ruis(ac, M, g, t + d, .009, { f1: 1500, vol: vol, q: 1.3 })); ruis(ac, M, g, t + .03, .1, { f1: 1300, vol: vol * .7, q: .9 }); }
  function shaker(ac, M, uit, t, vol) { ruis(ac, M, uit, t, .045, { f1: 4600, vol: vol, q: 1.2, zwel: .3 }); }
  // Stamp: iets zwaars komt neer.
  function stamp(ac, M, uit, t, vol) { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(105, t); o.frequency.exponentialRampToValueAtTime(44, t + .16); env(g, t, .003, vol, .32); o.connect(g); g.connect(uit); o.start(t); o.stop(t + .4);
    ruis(ac, M, uit, t, .07, { soort: 'lowpass', f1: 500, vol: vol * .5 }); }
  function tom(ac, M, uit, t, f, vol, px) { const g = bus(ac, M, uit, px, .2); const o = ac.createOscillator(), e = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f * 1.6, t); o.frequency.exponentialRampToValueAtTime(f, t + .07); env(e, t, .003, vol, .24); o.connect(e); e.connect(g); o.start(t); o.stop(t + .3);
    ruis(ac, M, g, t, .02, { soort: 'lowpass', f1: 900, vol: vol * .4 }); }
  // Plof: iets lichts komt zacht neer (geen lage dreun).
  function plof(ac, M, uit, t, vol) { osc(ac, uit, 'sine', 165, t, .004, vol, .09); ruis(ac, M, uit, t, .05, { soort: 'lowpass', f1: 700, vol: vol * .6 }); }
  // Tok: hout op hout (f bepaalt hoe groot het stuk hout klinkt).
  function tok(ac, M, uit, t, vol, f) { const g = bus(ac, M, uit, 0, .2); osc(ac, g, 'sine', f, t, .002, vol * .22, .07); osc(ac, g, 'sine', f * 1.52, t, .002, vol * .12, .045); ruis(ac, M, g, t, .012, { f1: f * 3, vol: vol * .12, q: 2 }); }
  // Klak: een klepje van een klapbord dat omvalt.
  function klak(ac, M, uit, t, vol) { ruis(ac, M, uit, t, .012, { f1: 2400, vol: vol * .2, q: 3 }); ruis(ac, M, uit, t + .028, .02, { f1: 950, vol: vol * .22, q: 2 }); osc(ac, uit, 'sine', 140, t + .028, .002, vol * .14, .06); }
  function woesj(ac, M, uit, t, dur, vol, f1, f2) { ruis(ac, M, uit, t, dur, { f1: f1, f2: f2, vol: vol, zwel: .5, q: 1.1 }); }
  // Schuiffluit: het tekenfilmgeluid van iets dat omhoog gaat.
  function fluit(ac, M, uit, t, dur, f1, f2, vol) { const o = ac.createOscillator(), g = ac.createGain(), l = ac.createOscillator(), lg = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    l.frequency.value = 7; lg.gain.value = 9; l.connect(lg); lg.connect(o.frequency); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * .25); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(uit); o.start(t); l.start(t); o.stop(t + dur + .05); l.stop(t + dur + .05); }
  // Gruis: brokstukken die vallen.
  function gruis(ac, M, uit, t, dur, r) { for (let i = 0; i < 14; i++) { const tt = t + Math.pow(r(), 1.6) * dur; ruis(ac, M, uit, tt, .03 + r() * .06, { soort: 'lowpass', f1: 300 + r() * 900, vol: .1 * (1 - (tt - t) / dur) + .02, px: (r() - .5) * 1.4 }); if (i % 3 === 0) tok(ac, M, uit, tt, .35, 160 + r() * 200); } }
  // Vuur: zacht geraas met knetters.
  function vuur(ac, M, uit, t, dur, vol, r) { ruis(ac, M, uit, t, dur, { soort: 'lowpass', f1: 520, f2: 460, vol: vol, zwel: .08, q: .4 });
    const n = Math.round(dur * 9); for (let i = 0; i < n; i++) { const tt = t + r() * dur; ruis(ac, M, uit, tt, .015 + r() * .03, { f1: 1400 + r() * 2400, vol: vol * (.5 + r() * 1.2), q: 2.2, px: (r() - .5) * 1.2 }); } }
  // Het Slagio-motief: vier noten omhoog op marimba en kalimba, de laatste met een zacht getokkeld akkoord.
  function motief(ac, M, uit, t, grond, r) {
    [[4, 0], [7, .13], [9, .26], [12, .5]].forEach(([n, d], i) => { const tt = t + d + (r() - .5) * .008;
      marimba(ac, M, uit, NOOT(grond + n - 12), tt, .075 + i * .01, (i - 1.5) * .2); kalimba(ac, M, uit, NOOT(grond + n), tt + .004, .03 + i * .008, (1.5 - i) * .2); });
    snaar(ac, M, uit, NOOT(grond - 24), t + .5, 1.2, .07, { demp: .996, helder: .3 });
    tokkel(ac, M, uit, [0, 4, 7, 12].map(n => NOOT(grond + n - 12)), t + .5, 1.7, .07);
  }

  // Recepten. (t = starttijd, x = extra parameter uit de cue)
  const R = {
    // ── uit de app (quiz.js playSound) ──
    tap: (a, M, u, t) => { N(a, M, u, t, .008, { freq: 2600, vol: .022, q: .9 }); T(a, M, u, 587, 775, t, .085, { vol: .085, glide: .32, cut: 2900, harm: .16, detune: 7 }); },
    pop: (a, M, u, t) => { N(a, M, u, t, .012, { freq: 3000, vol: .04 }); T(a, M, u, 560, 1120, t, .12, { vol: .16, glide: .36, cut: 3600, harm: .24, detune: 11 }); T(a, M, u, 1680, null, t + .03, .10, { type: 'triangle', vol: .06, cut: 5000 }); },
    nav: (a, M, u, t) => T(a, M, u, 440, 860, t, .10, { vol: .10, glide: .7, cut: 3200, harm: .12, detune: 6 }),
    open: (a, M, u, t) => { T(a, M, u, 392, 784, t, .16, { vol: .12, glide: .7, cut: 3400, detune: 8 }); T(a, M, u, 587, 1175, t + .03, .18, { type: 'triangle', vol: .07, glide: .7 }); T(a, M, u, 1568, null, t + .12, .14, { vol: .05, rev: true }); },
    correct: (a, M, u, t) => { [784, 988, 1319].forEach((f, i) => T(a, M, u, f, null, t + i * .066, .20, { vol: .16, cut: 3800, harm: .30, detune: 6, rev: true })); T(a, M, u, 1976, null, t + .16, .30, { type: 'triangle', vol: .07, cut: 6000, rev: true }); },
    fout: (a, M, u, t) => { T(a, M, u, 330, 247, t, .16, { vol: .11, glide: .5, cut: 1500, detune: 5 }); T(a, M, u, 247, 196, t + .12, .20, { vol: .10, glide: .5, cut: 1200 }); },
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
    // Muziekbodem: rustige beat in A-mineur (Am F C G), laag en warm, zodat een post nooit stil valt.
    // x = { d: duur in s, bpm }. Faden in en uit via de gain van de cue.
    beat: (a, M, u, t, x) => {
      x = x || {}; const d = x.d || 10, bpm = x.bpm || 108, sp = 60 / bpm, eind = t + d;
      u.gain.setValueAtTime(.0001, t); u.gain.exponentialRampToValueAtTime(u.gain.value || 1, t + .6);
      u.gain.setValueAtTime(u.gain.value || 1, Math.max(t + .7, eind - 1.2)); u.gain.exponentialRampToValueAtTime(.0001, eind);
      const AK = [[110, [220, 261.6, 329.6]], [87.3, [174.6, 220, 261.6]], [130.8, [261.6, 329.6, 392]], [98, [196, 246.9, 293.7]]];
      for (let i = 0; t + i * sp < eind; i++) {
        const tt = t + i * sp, [bas, ak] = AK[Math.floor(i / 4) % 4];
        if (i % 4 === 0) ak.forEach((f, j) => T(a, M, u, f, null, tt, sp * 4, { vol: .026, cut: 1300, attack: .35, detune: j ? 6 : -6, rev: true }));
        T(a, M, u, 105, 44, tt, .3, { vol: i % 2 ? .20 : .26, glide: .3, cut: 700, attack: .003 });            // kick
        N(a, M, u, tt + sp / 2, .05, { freq: 2300, vol: .018, q: .8 });                                        // zachte hihat op de tel ertussen
        if (i % 2) N(a, M, u, tt, .12, { freq: 1200, vol: .035, q: .9, rev: true });                          // snare-achtig tikje op 2 en 4
        T(a, M, u, bas, null, tt + sp / 2, sp * .45, { type: 'triangle', vol: .11, cut: 500, attack: .012 });   // bas
        const ar = ak[(i * 2) % 3], ar2 = ak[(i * 2 + 1) % 3] * (i % 4 === 3 ? 2 : 1);                        // arpeggio
        T(a, M, u, ar * 2, null, tt, sp * .4, { type: 'triangle', vol: .04, cut: 1800, harm: .1 });
        T(a, M, u, ar2 * 2, null, tt + sp / 2, sp * .4, { type: 'triangle', vol: .03, cut: 1800, rev: true });
      }
    },
    // ── Momenten: één compositie per moment, op de tel van het beeld ──
    // Akoestisch gehouden: marimba, kalimba, een getokkeld akkoord, bas, handklap en
    // geluiden van de dingen in beeld (sprong, landing, klap door het plafond, hout, vuur).
    // Bewust zacht en klein: geen dreunen, trommels of effecten. Een paar houten tikjes
    // bij wat er gebeurt en aan het eind het motief van vier noten.
    // Level omhoog (D). x = { vul0, vul1, hurk, sprong, land }
    mLevel: (a, M, u, t, x) => {
      x = x || {}; const v0 = t + (x.vul0 || .5), v1 = t + (x.vul1 || 1.35), sp = t + (x.sprong || 1.85), L = t + (x.land || 2.3), r = rnd(11);
      const sch = [5, 7, 9, 12, 14, 17, 19, 21], n = 8;                                                // trede loopt vol: toonladder omhoog
      for (let i = 0; i < n; i++) marimba(a, M, u, NOOT(sch[i] - 12), lerp(v0, v1 - .06, i / (n - 1)) + (r() - .5) * .012, .045 + i * .006, (i / n - .5) * .5);
      kalimba(a, M, u, NOOT(17), v1, .06);                                                            // vol: tingel
      woesj(a, M, u, sp + .05, L - sp - .1, .012, 700, 1800);                                         // sprong: een zuchtje lucht
      plof(a, M, u, L, .1);                                                                           // landing
      motief(a, M, u, L + .2, 5, r);
    },
    // Promotie (E). x = { start, klap, stempel }
    mPromotie: (a, M, u, t, x) => {
      x = x || {}; const S0 = t + (x.start || 1.5), K = t + (x.klap || 1.74), ST = t + (x.stempel || 2.45), r = rnd(21);
      const op = [7, 9, 11, 14, 16, 19, 21, 23], n = 8;                                                // opladen: noten die versnellen en stijgen
      for (let i = 0; i < n; i++) { const q = i / (n - 1); marimba(a, M, u, NOOT(op[i] - 24), lerp(t + .7, S0 - .05, Math.pow(q, .7)), .04 + q * .035, (q - .5) * .5); }
      woesj(a, M, u, S0, K - S0 + .05, .016, 500, 2200);
      plof(a, M, u, K, .11);                                                                          // door het plafond: plof en een paar houten tikjes
      for (let i = 0; i < 5; i++) tok(a, M, u, K + .03 + r() * .4, .1 + r() * .08, 420 + r() * 500);
      kalimba(a, M, u, NOOT(19), K + .02, .06);
      motief(a, M, u, ST - .5, 7, r);                                                                  // laatste noot valt op het stempel
      tok(a, M, u, ST, .22, 520);
      tokkel(a, M, u, [7, 11, 14, 19].map(n2 => NOOT(n2 - 12)), ST + .7, 1.8, .06);                   // nog één zacht akkoord
    },
    // Streak (A). x = { hops:[t], dagen:[t], terug, worp, vlam, duur }
    mStreak: (a, M, u, t, x) => {
      x = x || {}; const W = t + (x.worp || 1.5), F = t + (x.vlam || 1.88), eind = t + (x.duur || 5), r = rnd(31), A = [0, 2, 4, 7, 9, 12];
      vuur(a, M, u, t, F - t, .012, r); vuur(a, M, u, F, eind - F, .024, r);
      (x.dagen || []).forEach((d, i) => marimba(a, M, u, NOOT(A[i % 6] - 12), t + d + (r() - .5) * .01, .045, (i - 3) * .12));
      woesj(a, M, u, W, F - W, .012, 700, 1800);                                                      // het blok vliegt
      tok(a, M, u, F, .3, 330); tok(a, M, u, F + .05, .18, 250);                                      // hout op hout
      ruis(a, M, u, F, .7, { soort: 'lowpass', f1: 300, f2: 2200, vol: .035, zwel: .15, q: .5, baan: .3 });   // het vuur laait op
      klak(a, M, u, F + .1, .22); klak(a, M, u, F + .34, .3);                                         // het klapbord valt om
      motief(a, M, u, F + .5, 0, r);
    },
    typ: (a, M, u, t, x) => { const r = rnd(Math.floor(t * 1000) + 3); N(a, M, u, t, .018, { freq: 1800 + r() * 500, vol: .03 * (x || 1), q: 1.6 }); },
    scan: (a, M, u, t, x) => { const d = x || .8; N(a, M, u, t, d, { freq: 600, freq2: 2200, q: 3, vol: .05, swell: .5, sweep: 1 }); T(a, M, u, 520, 1040, t, d, { vol: .03, glide: 1, cut: 1800 }); },
    snurk: (a, M, u, t) => N(a, M, u, t, .6, { filter: 'lowpass', freq: 180, freq2: 520, vol: .07, swell: .6 }),
  };

  // Transpositie per geluid: beloningsmelodieën een octaaf lager, korte tikjes
  // iets minder, de lage montagegeluiden blijven waar ze zijn.
  const TOON = { tap: .62, pop: .62, nav: .62, flip: .62, tick: .62, teller: .55, open: .55, start: .55, schud: 1, fout: .75,
    correct: .5, combo: .5, streak: .5, xp: .5, badge: .5, evolve: .5, levelup: .5, fanfare: .5, coin: .5, kist: .5, wekker: .5 };
  function plan(ac, M, cues) {
    for (const [t, naam, vol, x] of cues) {
      const f = R[naam]; if (!f) continue;
      const g = ac.createGain(); g.gain.value = vol == null ? 1 : vol; g.connect(M.mg);
      PITCH = TOON[naam] || 1;
      f(ac, M, g, Math.max(0, t), x);
      PITCH = 1;
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
  // Speelt een hele cue-lijst vanaf nu (voor de momenten in de app). Geeft een functie terug die het geluid uitfadet.
  function speelAlles(cues, vol) {
    try { if (!live) { const ac = new AudioContext(); live = { ac, M: tafel(ac) }; } if (live.ac.state === 'suspended') live.ac.resume();
      const ac = live.ac, groep = ac.createGain(); groep.gain.value = vol == null ? 1 : vol; groep.connect(live.M.mg);
      const t0 = ac.currentTime + .06; _seed = 1;
      plan(ac, { mg: groep, rev: live.M.rev, zaal: live.M.zaal }, cues.map(c => [t0 + c[0], c[1], c[2], c[3]]));
      return () => { try { groep.gain.setTargetAtTime(.0001, ac.currentTime, .08); setTimeout(() => { try { groep.disconnect(); } catch (e) {} }, 600); } catch (e) {} };
    } catch (e) { return () => {}; }
  }
  window.Geluid = { wav, speel, speelAlles, recepten: Object.keys(R) };
})();
