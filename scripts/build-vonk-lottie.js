#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   build-vonk-lottie.js - genereert vonk.lottie.json (Bodymovin/Lottie).

   Waarom: de SVG-mascotte (mascotSVG) beweegt alleen via CSS-keyframes op losse
   onderdelen - beperkt en "houterig". Lottie geeft frame-precieze, vrije
   beweging (squash/stretch, secondary motion, overlap) zoals Duolingo's Rive.

   Aanpak: we hergebruiken Vonk's ECHTE geometrie (dezelfde paden/ellipsen als
   mascotSVG, viewBox 120×120) en zetten die om naar Lottie-vormen, gegroepeerd
   in bewegende onderdelen (staart, armen, kop, oog-knipper, lijf). De animatie
   (ademen, zwaaien, knipperen, kop-tilt) zit op de groep-transforms.

   Eén Lottie met markers/segmenten:
     idle      : frame 0–90   (rustig ademen + af en toe knipperen, loopt)
     celebrate : frame 90–150 (sprong met squash/stretch + armzwaai + knipoog)

   Draai:  node scripts/build-vonk-lottie.js
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

// ── Palet (gelijk aan mascotSVG) ──
const OR = '#fb8c3e', SH = '#e9701f', CR = '#fff1dd', DK = '#2e2a39', NO = '#3b2a22';

// ── hex → Lottie kleur-array [r,g,b] in 0..1 ──
function col(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; // #fff → #ffffff
  return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255, 1];
}

/* ── SVG-pad → Lottie bezier ──
   Tokeniseert een `d`-string en bouwt absolute cubic-bezier-vertices. Retourneert
   {c,i,o,v}: v=ankerpunten, i=in-raaklijn (relatief tot v), o=uit-raaklijn. */
function pathToShape(d) {
  const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [];
  let i = 0;
  const num = () => parseFloat(toks[i++]);
  const V = [], IN = [], OUT = [];
  let cx = 0, cy = 0, sx = 0, sy = 0, cmd = '', closed = false;
  // px/py = laatste ankerpunt-index-coördinaat; prevC2 voor S/T-gladheid
  let lastC2 = null;
  const pushVertex = (x, y) => { V.push([x, y]); IN.push([0, 0]); OUT.push([0, 0]); };
  const setOut = (x, y) => { OUT[OUT.length - 1] = [x - cx, y - cy]; };
  const setInLast = (x, y) => { IN[IN.length - 1] = [x - V[V.length - 1][0], y - V[V.length - 1][1]]; };

  while (i < toks.length) {
    let t = toks[i];
    if (/[a-zA-Z]/.test(t)) { cmd = t; i++; } // nieuw commando
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    if (C === 'M') {
      let x = num(), y = num(); if (rel) { x += cx; y += cy; }
      cx = x; cy = y; sx = x; sy = y; pushVertex(x, y); lastC2 = null;
      cmd = rel ? 'l' : 'L'; // opeenvolgende paren na M zijn lineto
    } else if (C === 'L') {
      let x = num(), y = num(); if (rel) { x += cx; y += cy; }
      pushVertex(x, y); cx = x; cy = y; lastC2 = null;
    } else if (C === 'H') {
      let x = num(); if (rel) x += cx; pushVertex(x, cy); cx = x; lastC2 = null;
    } else if (C === 'V') {
      let y = num(); if (rel) y += cy; pushVertex(cx, y); cy = y; lastC2 = null;
    } else if (C === 'C') {
      let x1 = num(), y1 = num(), x2 = num(), y2 = num(), x = num(), y = num();
      if (rel) { x1 += cx; y1 += cy; x2 += cx; y2 += cy; x += cx; y += cy; }
      setOut(x1, y1); pushVertex(x, y); setInLast(x2, y2); cx = x; cy = y; lastC2 = [x2, y2];
    } else if (C === 'S') {
      let x2 = num(), y2 = num(), x = num(), y = num();
      if (rel) { x2 += cx; y2 += cy; x += cx; y += cy; }
      const rx = lastC2 ? 2 * cx - lastC2[0] : cx, ry = lastC2 ? 2 * cy - lastC2[1] : cy;
      setOut(rx, ry); pushVertex(x, y); setInLast(x2, y2); cx = x; cy = y; lastC2 = [x2, y2];
    } else if (C === 'Q') {
      let qx = num(), qy = num(), x = num(), y = num();
      if (rel) { qx += cx; qy += cy; x += cx; y += cy; }
      // quadratic → cubic
      const c1x = cx + 2 / 3 * (qx - cx), c1y = cy + 2 / 3 * (qy - cy);
      const c2x = x + 2 / 3 * (qx - x), c2y = y + 2 / 3 * (qy - y);
      setOut(c1x, c1y); pushVertex(x, y); setInLast(c2x, c2y); cx = x; cy = y; lastC2 = [qx, qy];
    } else if (C === 'T') {
      let x = num(), y = num(); if (rel) { x += cx; y += cy; }
      const qx = lastC2 ? 2 * cx - lastC2[0] : cx, qy = lastC2 ? 2 * cy - lastC2[1] : cy;
      const c1x = cx + 2 / 3 * (qx - cx), c1y = cy + 2 / 3 * (qy - cy);
      const c2x = x + 2 / 3 * (qx - x), c2y = y + 2 / 3 * (qy - y);
      setOut(c1x, c1y); pushVertex(x, y); setInLast(c2x, c2y); cx = x; cy = y; lastC2 = [qx, qy];
    } else if (C === 'Z') {
      closed = true; cx = sx; cy = sy; lastC2 = null;
    } else { i++; }
  }
  // Bij een gesloten pad valt het laatste vertex vaak samen met het eerste → dedupe
  if (closed && V.length > 1) {
    const a = V[0], b = V[V.length - 1];
    if (Math.abs(a[0] - b[0]) < 0.01 && Math.abs(a[1] - b[1]) < 0.01) {
      IN[0] = IN[IN.length - 1]; V.pop(); IN.pop(); OUT.pop();
    }
  }
  return { c: closed, i: IN, o: OUT, v: V };
}

// ── Lottie shape-helpers ──
let _ix = 0;
const fillOf = (hex, op = 100) => ({ ty: 'fl', c: { a: 0, k: col(hex) }, o: { a: 0, k: op }, r: 1, bm: 0, nm: 'fill' });
const strokeOf = (hex, w, op = 100) => ({ ty: 'st', c: { a: 0, k: col(hex) }, o: { a: 0, k: op }, w: { a: 0, k: w }, lc: 2, lj: 2, ml: 4, bm: 0, nm: 'stroke' });
const shOf = (d) => ({ ty: 'sh', ind: 0, ks: { a: 0, k: pathToShape(d) }, nm: 'path', hd: false });
const elOf = (cx, cy, rx, ry) => ({ ty: 'el', p: { a: 0, k: [cx, cy] }, s: { a: 0, k: [rx * 2, ry * 2] }, nm: 'ellipse' });
// transform-blok voor een groep (met evt. anchor)
const tr = (opts = {}) => ({
  ty: 'tr',
  p: opts.p || { a: 0, k: [0, 0] },
  a: opts.a || { a: 0, k: [0, 0] },
  s: opts.s || { a: 0, k: [100, 100] },
  r: opts.r || { a: 0, k: 0 },
  o: opts.o || { a: 0, k: 100 },
  sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: 'tr'
});
// groep = verzameling shapes + fill/stroke + eigen transform
function group(nm, items, transform) {
  const it = [...items, transform || tr()];
  return { ty: 'gr', nm, it, np: it.length, bm: 0, hd: false };
}
// gevuld pad
const filledPath = (d, hex, op) => group('p_' + (_ix++), [shOf(d), fillOf(hex, op)]);
const filledEl = (cx, cy, rx, ry, hex, op) => group('e_' + (_ix++), [elOf(cx, cy, rx, ry), fillOf(hex, op)]);
const strokedPath = (d, hex, w, op) => group('s_' + (_ix++), [shOf(d), strokeOf(hex, w, op)]);

// ═══════ VONK-ONDERDELEN (blij/wave-pose, viewBox 120×120) ═══════
// Staart
function tailShapes() {
  return [
    filledPath('M44 96 C22 100 9 89 12 74 C14 63 28 62 31 74 C27 87 34 95 47 92 Z', OR),
    filledPath('M15 72 C8 74 7 84 13 87 C20 89 24 80 21 73 Z', CR),
  ];
}
// Voetjes
function feetShapes() {
  return [
    filledEl(49, 109, 9.5, 6.2, OR), filledEl(49, 110.5, 5.8, 3.4, CR, 92),
    filledEl(71, 109, 9.5, 6.2, OR), filledEl(71, 110.5, 5.8, 3.4, CR, 92),
  ];
}
// Lijf
function bodyShapes() {
  return [
    filledPath('M60 64 C76 64 85 77 85 90 C85 104 74 110 60 110 C46 110 35 104 35 90 C35 77 44 64 60 64 Z', OR),
    filledPath('M60 66 C71 66 79 78 79 92 C79 103 71 107 60 107 C49 107 41 103 41 92 C41 78 49 66 60 66 Z', CR),
    filledPath('M60 110 C74 110 85 104 85 90 C85 96 82 101 78 104 C72 108 66 109 60 109 C54 109 48 108 42 104 C38 101 35 96 35 90 C35 104 46 110 60 110 Z', SH, 35),
  ];
}
// Linkerarm omlaag (aDownL): stroke-pad + poot
function armLeftShapes() {
  return [
    strokedPath('M40 84 C32 88 31 96 37 100', OR, 12),
    filledEl(37, 100, 6.3, 6.3, OR), filledEl(37, 100.5, 3.8, 2.9, CR, 92),
  ];
}
// Rechterarm zwaaiend (aWaveR): omhoog, wordt geanimeerd (rotatie om schouder ~[80,82])
function armWaveShapes() {
  return [
    strokedPath('M80 82 C90 80 96 71 97 62', OR, 12),
    filledEl(97, 60, 6.8, 6.8, OR), filledEl(97, 60.5, 4.1, 3.1, CR, 92),
  ];
}
// Oren als eigen lagen (voor follow-through / gedrag). Elk: oranje buiten + crème binnen.
function earLeftLeaves() {
  return [
    filledPath('M43 27 C33 9 20 8 23 23 C25 33 37 34 43 27 Z', OR),
    filledPath('M40 24 C34 15 28 15 30 23 C31 29 37 29 40 24 Z', CR),
  ];
}
function earRightLeaves() {
  return [
    filledPath('M77 27 C87 9 100 8 97 23 C95 33 83 34 77 27 Z', OR),
    filledPath('M80 24 C86 15 92 15 90 23 C89 29 83 29 80 24 Z', CR),
  ];
}
// Kop-onderdelen als platte leaf-lijst (achter→voor); oren + ogen zitten in eigen lagen.
function headLeaves() {
  return [
    // kop
    filledPath('M60 12 C39 12 27 27 27 45 C27 63 40 72 60 72 C80 72 93 63 93 45 C93 27 81 12 60 12 Z', OR),
    filledEl(47, 30, 15, 10, '#ffb877', 50),
    // zijpluizen
    filledPath('M31 50 C24 55 21 62 27 63 C33 64 36 58 35 53 Z', CR),
    filledPath('M89 50 C96 55 99 62 93 63 C87 64 84 58 85 53 Z', CR),
    // pet (achter→voor: donker vlak, lichter facet, knop, kwast-lijn, kwast-bol)
    filledPath('M60 3 L89 15 L60 27 L31 15 Z', '#2e3350'),
    filledPath('M60 3 L89 15 L60 20 Z', '#3c4374'),
    filledEl(60, 15, 2.5, 2.5, '#facc15'),
    strokedPath('M60 15 C74 17 76 24 75 31', '#facc15', 2),
    filledEl(75, 32, 3.4, 3.4, '#f59e0b'),
    // snuit (crème) over de kop
    filledPath('M35 46 C40 41 47 41 51 45 C55 49 65 49 69 45 C73 41 80 41 85 46 C88 59 76 71 60 71 C44 71 32 59 35 46 Z', CR),
    // wangen (roze)
    filledEl(36, 56, 5.2, 5.2, '#ff8fa3', 32), filledEl(84, 56, 5.2, 5.2, '#ff8fa3', 32),
    // neusje
    filledPath('M54 49 Q60 45 66 49 Q64 57 60 58 Q56 57 54 49 Z', NO),
    // mond
    strokedPath('M51 60 Q60 70 69 60', NO, 3),
  ];
}
// Oog-wit (eigen laag met knipper-schaal).
function eyeWhiteLeaves() {
  return [
    filledEl(47, 41, 9, 10.5, '#fff'), filledEl(73, 41, 9, 10.5, '#fff'),
  ];
}
// Pupillen + glans (eigen laag: knippert mee én kan rondkijken).
function pupilLeaves() {
  return [
    filledEl(47, 41.9, 5.4, 5.4, DK), filledEl(73, 41.9, 5.4, 5.4, DK),
    filledEl(49.1, 39.3, 2.2, 2.2, '#fff'), filledEl(75.1, 39.3, 2.2, 2.2, '#fff'),
    filledEl(45.2, 44.4, 1.1, 1.1, '#fff', 85), filledEl(71.2, 44.4, 1.1, 1.1, '#fff', 85),
  ];
}

// keyframe helper (met zachte easing)
function kf(t, s) { return { t, s, i: { x: [0.34, 0.34], y: [1, 1] }, o: { x: [0.66, 0.66], y: [0, 0] } }; }
function kfR(t, s) { return { t, s: [s], i: { x: [0.34], y: [1] }, o: { x: [0.66], y: [0] } }; }

// ── LAAG-helper: één Lottie shape-layer per bewegend onderdeel. ──
// leavesBackToFront: leaf-groepen in natuurlijke (achter→voor) volgorde; binnen een
// laag schildert het EERSTE item bovenop, dus we keren de lijst om.
let _LIND = 0;
function layerOf(nm, leavesBackToFront, ks, opts = {}) {
  const L = {
    ddd: 0, ind: ++_LIND, ty: 4, nm, sr: 1,
    ks: {
      o: ks.o || { a: 0, k: 100 }, r: ks.r || { a: 0, k: 0 },
      p: ks.p || { a: 0, k: [0, 0, 0] }, a: ks.a || { a: 0, k: [0, 0, 0] },
      s: ks.s || { a: 0, k: [100, 100, 100] },
    },
    ao: 0, shapes: leavesBackToFront.slice().reverse(), ip: 0, op: 200, st: 0, bm: 0,
  };
  if (opts.parent) L.parent = opts.parent;
  return L;
}
// layer-transform keyframe-lijsten (2D → derde component blijft weg / 100)
const P = (a) => a; // positie-array [x,y]


function anim(kfs) { return { a: 1, k: kfs }; }

// ═══════ CLIP-SYSTEEM ═══════
// Elke animatie is een "clip" met per-eigenschap sporen op LOKALE tijd. Clips
// worden achter elkaar op één tijdlijn geplakt; niet-gebruikte eigenschappen
// houden hun rust-pose per clip. Elke clip begint én eindigt op rust, zodat de
// wrapper naadloos naar 'idle' kan terugvallen. Eigenschappen:
//   cP=ctrl positie [x,y], cS=ctrl schaal [x,y,100], cR=ctrl rotatie,
//   hR=kop rotatie, aR=zwaai-arm rotatie, tR=staart rotatie,
//   eS=ogen schaal (knipper), sS=schaduw schaal.
const REST = { cP: [60, 110], cS: [100, 100, 100], cR: 0, hR: 0, aR: -6, tR: 0, eS: [100, 100, 100], sS: [100, 100, 100], eLr: 0, eRr: 0, puP: [60, 41] };

// Rust-blink voor idle (ogen dicht rond t=42 en t=86).
const IDLE_BLINK = [[0, [100, 100, 100]], [40, [100, 100, 100]], [43, [100, 8, 100]], [46, [100, 100, 100]], [84, [100, 100, 100]], [87, [100, 8, 100]], [90, [100, 100, 100]]];

const CLIPS = [
  { name: 'idle', dur: 90, tr: {
    // Levendige rust: ademen + subtiele gewichtsverdeling (wiegt licht), kop wiegt
    // tegen, oogjes kijken even rond, en één oor twitcht - nooit "bevroren".
    cP: [[0, [60, 110]], [30, [59.4, 108.7]], [60, [60.6, 108.7]], [90, [60, 110]]],
    cS: [[0, [100, 100, 100]], [45, [101, 98.4, 100]], [90, [100, 100, 100]]],
    hR: [[0, 0], [30, -1.6], [60, 1.6], [90, 0]],
    aR: [[0, -6], [22, 11], [44, -6], [66, 11], [88, -6], [90, -6]],
    tR: [[0, 0], [30, 8], [60, -5], [90, 0]],
    eS: IDLE_BLINK,
    puP: [[0, [60, 41]], [26, [60, 41]], [34, [62.4, 41.2]], [54, [62.4, 41.2]], [62, [60, 41]], [90, [60, 41]]],
    eLr: [[0, 0], [48, 0], [52, -8], [57, 3], [62, -1], [90, 0]],
    eRr: [[0, 0], [66, 0], [70, 6], [75, -2], [80, 0], [90, 0]],
  } },
  { name: 'celebrate', dur: 60, tr: {
    // Anticipatie-hurk → sprong → landing met overshoot en settle. Oren en staart
    // volgen na (follow-through), oogjes kijken omhoog tijdens de sprong.
    cP: [[0, [60, 110]], [8, [60, 114]], [17, [60, 82]], [31, [60, 113]], [41, [60, 108]], [49, [60, 111]], [60, [60, 110]]],
    cS: [[0, [100, 100, 100]], [8, [110, 88, 100]], [17, [88, 114, 100]], [31, [113, 86, 100]], [41, [97, 104, 100]], [52, [101, 99, 100]], [60, [100, 100, 100]]],
    aR: [[0, -6], [8, 8], [16, -28], [30, 16], [44, -28], [56, -6], [60, -6]],
    hR: [[0, 0], [8, 7], [17, -5], [40, 4], [60, 0]],
    tR: [[0, 0], [17, -16], [31, 18], [46, -7], [60, 0]],
    sS: [[0, [100, 100, 100]], [8, [113, 100, 100]], [17, [58, 100, 100]], [31, [113, 100, 100]], [60, [100, 100, 100]]],
    eS: [[0, [100, 100, 100]], [29, [100, 100, 100]], [32, [100, 10, 100]], [36, [100, 100, 100]], [60, [100, 100, 100]]],
    puP: [[0, [60, 41]], [10, [60, 38.3]], [30, [60, 38.3]], [44, [60, 41]], [60, [60, 41]]],
    eLr: [[0, 0], [8, 6], [17, 20], [33, -12], [46, 5], [60, 0]],
    eRr: [[0, 0], [8, 6], [17, -20], [33, 12], [46, -5], [60, 0]],
  } },
  { name: 'levelup', dur: 90, tr: {
    // Diepe hurk → hoge sprong met 360°-spin → landing met settle.
    cP: [[0, [60, 110]], [11, [60, 116]], [23, [60, 72]], [45, [60, 72]], [65, [60, 114]], [78, [60, 107]], [90, [60, 110]]],
    cR: [[0, 0], [12, -8], [23, 0], [65, 360], [78, 360], [90, 360]],
    cS: [[0, [100, 100, 100]], [11, [112, 86, 100]], [23, [86, 116, 100]], [37, [104, 96, 100]], [65, [114, 86, 100]], [78, [97, 103, 100]], [90, [100, 100, 100]]],
    aR: [[0, -6], [11, 10], [20, -26], [45, -26], [70, -12], [90, -6]],
    sS: [[0, [100, 100, 100]], [11, [118, 100, 100]], [23, [48, 100, 100]], [45, [48, 100, 100]], [65, [116, 100, 100]], [90, [100, 100, 100]]],
    puP: [[0, [60, 41]], [16, [60, 38]], [45, [60, 38]], [68, [60, 41]], [90, [60, 41]]],
    eLr: [[0, 0], [11, 8], [23, 22], [45, 22], [70, -8], [90, 0]],
    eRr: [[0, 0], [11, 8], [23, 22], [45, 22], [70, -8], [90, 0]],
  } },
  // ── Easter eggs (soms tijdens idle, iets doms/grappigs) ──
  { name: 'dizzy', dur: 70, tr: {
    hR: [[0, 0], [12, 16], [26, -16], [40, 12], [54, -10], [70, 0]],
    cR: [[0, 0], [15, 5], [35, -5], [55, 4], [70, 0]],
    tR: [[0, 0], [12, 14], [26, -14], [40, 10], [70, 0]],
    // oogjes rollen rond (het "duizelige" effect)
    puP: [[0, [60, 41]], [12, [62.5, 39.5]], [24, [60, 43]], [36, [57.5, 39.5]], [48, [60, 43]], [60, [61, 40.5]], [70, [60, 41]]],
    eLr: [[0, 0], [16, 10], [36, -8], [56, 6], [70, 0]],
    eRr: [[0, 0], [16, -10], [36, 8], [56, -6], [70, 0]],
  } },
  { name: 'yawn', dur: 80, tr: {
    cS: [[0, [100, 100, 100]], [24, [94, 110, 100]], [40, [94, 110, 100]], [56, [110, 92, 100]], [80, [100, 100, 100]]],
    cP: [[0, [60, 110]], [24, [60, 106]], [40, [60, 106]], [56, [60, 112]], [80, [60, 110]]],
    hR: [[0, 0], [24, -7], [40, -7], [80, 0]],
    aR: [[0, -6], [24, -26], [40, -26], [80, -6]],
    eS: [[0, [100, 100, 100]], [22, [100, 12, 100]], [42, [100, 12, 100]], [58, [100, 100, 100]], [80, [100, 100, 100]]],
  } },
  { name: 'trip', dur: 60, tr: {
    cR: [[0, 0], [10, 20], [22, -6], [34, 10], [46, -3], [60, 0]],
    cP: [[0, [60, 110]], [10, [64, 110]], [22, [58, 106]], [34, [62, 110]], [60, [60, 110]]],
    aR: [[0, -6], [10, 22], [22, -22], [60, -6]],
    hR: [[0, 0], [10, 12], [22, -6], [60, 0]],
  } },
  { name: 'fall', dur: 100, tr: {
    cR: [[0, 0], [16, -46], [52, -46], [66, 9], [82, -3], [100, 0]],
    cP: [[0, [60, 110]], [16, [55, 113]], [52, [55, 113]], [66, [60, 109]], [100, [60, 110]]],
    aR: [[0, -6], [16, 26], [52, 26], [66, -14], [100, -6]],
    sS: [[0, [100, 100, 100]], [16, [118, 100, 100]], [52, [118, 100, 100]], [66, [90, 100, 100]], [100, [100, 100, 100]]],
    eS: [[0, [100, 100, 100]], [20, [100, 100, 100]], [24, [100, 10, 100]], [50, [100, 10, 100]], [64, [100, 100, 100]], [100, [100, 100, 100]]],
  } },
  { name: 'dance', dur: 96, tr: {
    cP: [[0, [60, 110]], [16, [52, 106]], [32, [60, 110]], [48, [68, 106]], [64, [60, 110]], [80, [52, 106]], [96, [60, 110]]],
    hR: [[0, 0], [16, 6], [32, 0], [48, -6], [64, 0], [80, 6], [96, 0]],
    aR: [[0, -6], [16, -18], [32, -6], [48, -18], [64, -6], [80, -18], [96, -6]],
    tR: [[0, 0], [16, 10], [48, -10], [80, 10], [96, 0]],
  } },
];

// Bouw segment-tabel + totale lengte.
function segments() {
  let t = 0; const map = {};
  CLIPS.forEach(c => { map[c.name] = [t, t + c.dur]; t += c.dur; });
  return { map, total: t };
}
// Compileer één eigenschap over alle clips tot een keyframe-lijst.
function compile(prop) {
  const isRot = (prop === 'cR' || prop === 'hR' || prop === 'aR' || prop === 'tR' || prop === 'eLr' || prop === 'eRr');
  const rest = REST[prop];
  const kfs = []; let off = 0;
  CLIPS.forEach(c => {
    const track = c.tr[prop];
    if (track) track.forEach(([lt, v]) => kfs.push(isRot ? kfR(off + lt, v) : kf(off + lt, v)));
    else { kfs.push(isRot ? kfR(off, rest) : kf(off, rest)); kfs.push(isRot ? kfR(off + c.dur, rest) : kf(off + c.dur, rest)); }
    off += c.dur;
  });
  return anim(kfs);
}

function build() {
  _LIND = 0;
  const { map, total } = segments();
  const OP = total + 1;

  const ctrl = {
    ddd: 0, ind: ++_LIND, ty: 3, nm: 'ctrl', sr: 1,
    ks: { o: { a: 0, k: 100 }, a: { a: 0, k: [60, 110, 0] }, p: compile('cP'), s: compile('cS'), r: compile('cR') },
    ao: 0, ip: 0, op: OP, st: 0, bm: 0,
  };
  const CTRL = ctrl.ind;

  const feet = layerOf('feet', feetShapes(), {}, { parent: CTRL });
  const armLeft = layerOf('arm_l', armLeftShapes(), {}, { parent: CTRL });
  const body = layerOf('body', bodyShapes(), {}, { parent: CTRL });
  const tail = layerOf('tail', tailShapes(), { a: { a: 0, k: [30, 80, 0] }, p: { a: 0, k: [30, 80, 0] }, r: compile('tR') }, { parent: CTRL });
  const head = layerOf('head', headLeaves(), { a: { a: 0, k: [60, 45, 0] }, p: { a: 0, k: [60, 45, 0] }, r: compile('hR') }, { parent: CTRL });
  const HEAD = head.ind;
  // Oren als eigen lagen (achter de kop) met follow-through-rotatie, volgen de kop.
  const earL = layerOf('ear_l', earLeftLeaves(), { a: { a: 0, k: [31, 24, 0] }, p: { a: 0, k: [31, 24, 0] }, r: compile('eLr') }, { parent: HEAD });
  const earR = layerOf('ear_r', earRightLeaves(), { a: { a: 0, k: [89, 24, 0] }, p: { a: 0, k: [89, 24, 0] }, r: compile('eRr') }, { parent: HEAD });
  // Oog-wit knippert; pupillen knipperen mee én kijken rond (eigen positie-track).
  const eyeWhite = layerOf('eye_white', eyeWhiteLeaves(), { a: { a: 0, k: [60, 41, 0] }, p: { a: 0, k: [60, 41, 0] }, s: compile('eS') }, { parent: HEAD });
  const pupils = layerOf('pupils', pupilLeaves(), { a: { a: 0, k: [60, 41, 0] }, p: compile('puP'), s: compile('eS') }, { parent: HEAD });
  const armWave = layerOf('arm_wave', armWaveShapes(), { a: { a: 0, k: [82, 80, 0] }, p: { a: 0, k: [82, 80, 0] }, r: compile('aR') }, { parent: CTRL });
  const shadow = layerOf('shadow', [filledEl(60, 115, 30, 6, '#000', 14)], { a: { a: 0, k: [60, 115, 0] }, p: { a: 0, k: [60, 115, 0] }, s: compile('sS') });

  // z-volgorde (eerste = bovenop): voor→achter. Pupillen vóór oog-wit vóór kop;
  // oren achter de kop; ctrl (onzichtbaar) laatst.
  const layers = [armWave, pupils, eyeWhite, head, earL, earR, body, armLeft, feet, tail, shadow, ctrl];
  layers.forEach(L => { L.op = OP; });

  const markers = CLIPS.map(c => ({ tm: map[c.name][0], cm: c.name, dr: c.dur }));
  return { v: '5.7.4', fr: 30, ip: 0, op: OP, w: 120, h: 120, nm: 'Vonk', ddd: 0, assets: [], layers, markers, _segments: map };
}

const out = build();
const dest = path.join(__dirname, '..', 'vonk.lottie.json');
fs.writeFileSync(dest, JSON.stringify(out));
console.log('✓ vonk.lottie.json (' + (JSON.stringify(out).length / 1024).toFixed(1) + ' KB), ' + out.layers.length + ' lagen, ' + out.markers.length + ' clips');
Object.keys(out._segments).forEach(k => console.log('   ' + k.padEnd(10) + out._segments[k].join('–')));
