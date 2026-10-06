// ═══════ MAATJES: EMOTIES OP DE EIGEN TEKENINGEN ═══════
// De maatjes (ANIMAL_EVOLUTIONS in profile.js) houden hun eigen tekening. Deze
// laag geeft ze emoties: de ogen worden in de SVG zelf gevonden (twee gespiegelde
// witte cirkels met een pupil) en per stemming aangepast (lachoogjes, dichte
// ogen, hartjes, wijd open, knipoog, zonnebril), met blosjes, een rekwisiet
// (traan, zweetdruppel, zzz, sterretjes) en een beweging van het hele dier.
// Stemmingen volgen de namen van Vonk (VONK_M). getAnimalDisplay krijgt een
// vijfde argument: de stemming. Zonder stemming blijft alles zoals het was.

const _MJ_STEM = {
  blij:        { ogen: 'lach', blos: 1, beweeg: 'hup' },
  trots:       { ogen: 'lach', blos: 1, spark: 1, beweeg: 'hup' },
  feest:       { ogen: 'lach', blos: 1, spark: 1, beweeg: 'spring' },
  giechel:     { ogen: 'lach', blos: 1, beweeg: 'giechel' },
  goed:        { blos: 1 },
  knipoog:     { ogen: 'knip', spark: 1 },
  kijk:        { pupil: [0.3, -0.3] },
  denk:        { pupil: [0.35, -0.45], prop: 'denk' },
  laag:        { pupil: [0, 0.4], prop: 'zweet', beweeg: 'hang' },
  oeps:        { ogen: 'wijd', prop: 'zweet', beweeg: 'schud' },
  verdrietig:  { pupil: [0, 0.4], prop: 'traan', beweeg: 'hang' },
  schrik:      { ogen: 'wijd', prop: 'zweet', beweeg: 'schud' },
  wow:         { ogen: 'wijd', spark: 1, beweeg: 'spring' },
  liefde:      { ogen: 'hart', blos: 1, prop: 'hartjes', beweeg: 'hup' },
  kus:         { ogen: 'lach', blos: 1, prop: 'hartjes' },
  verlegen:    { pupil: [0, 0.35], blos: 2 },
  slaap:       { ogen: 'dicht', prop: 'zzz', beweeg: 'adem' },
  cool:        { ogen: 'bril', spark: 1 },
  vastberaden: { spark: 1, beweeg: 'hup' },
  duizelig:    { ogen: 'dicht', prop: 'zweet', beweeg: 'schud' },
};
const _mjCache = {};

function _mjNum(el, a) { const v = parseFloat(el.getAttribute(a)); return isNaN(v) ? 0 : v; }
function _mjWit(el) {
  const f = (el.getAttribute('fill') || '').toLowerCase(), op = el.getAttribute('opacity');
  if (op != null && parseFloat(op) <= .9) return false;
  if (f === '#fff' || f === '#ffffff' || f === 'white') return true;
  // heel licht (lichtgeel oogwit van de slang e.d.)
  const m = f.match(/^#([0-9a-f]{6})$/); if (!m) return false;
  const n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 232;
}
// Zoek de twee ogen: gespiegelde witte cirkels/ellipsen rond het midden (x=30).
function _mjOgen(svg) {
  const kand = [...svg.querySelectorAll('circle,ellipse')].filter(_mjWit).map(el => {
    const r = el.tagName === 'circle' ? _mjNum(el, 'r') : Math.max(_mjNum(el, 'rx'), _mjNum(el, 'ry'));
    return { el, cx: _mjNum(el, 'cx'), cy: _mjNum(el, 'cy'), r };
  }).filter(o => o.r >= 2.6 && o.r <= 9);
  for (const a of kand) for (const b of kand) {
    if (a === b || a.cx >= b.cx) continue;
    if (Math.abs(a.cx + b.cx - 60) < 9 && Math.abs(b.cx - a.cx) > a.r * 1.6 && Math.abs(a.cy - b.cy) < 1.6 && Math.abs(a.r - b.r) < 1.2) return [a, b];
  }
  return null;
}
function _mjOogDelen(svg, oog) {
  // alles wat binnen het oog valt (pupil, glimlichtje) hoort erbij
  return [...svg.querySelectorAll('circle,ellipse')].filter(el => {
    if (el === oog.el) return true;
    const r = el.tagName === 'circle' ? _mjNum(el, 'r') : Math.max(_mjNum(el, 'rx'), _mjNum(el, 'ry'));
    const dx = _mjNum(el, 'cx') - oog.cx, dy = _mjNum(el, 'cy') - oog.cy;
    return r <= oog.r && Math.sqrt(dx * dx + dy * dy) <= oog.r * 1.05;
  });
}

// Schalen via de maten zelf (geen transform: de CSS van de dieren zet soms
// transform-origin op de onderdelen, dan schuift een transform alles weg).
function _mjSchaal(el, o, k) {
  el.setAttribute('cx', (o.cx + (_mjNum(el, 'cx') - o.cx) * Math.min(k, 1)).toFixed(2));
  el.setAttribute('cy', (o.cy + (_mjNum(el, 'cy') - o.cy) * Math.min(k, 1)).toFixed(2));
  ['r', 'rx', 'ry'].forEach(a => { if (el.hasAttribute(a)) el.setAttribute(a, (_mjNum(el, a) * k).toFixed(2)); });
}

function maatjeEmotie(svgStr, mood) {
  const st = _MJ_STEM[mood]; if (!st || !svgStr || typeof DOMParser === 'undefined') return { svg: svgStr, beweeg: '' };
  let doc; try { doc = new DOMParser().parseFromString(svgStr, 'image/svg+xml'); } catch (e) { return { svg: svgStr, beweeg: '' }; }
  const svg = doc.documentElement; if (!svg || svg.nodeName !== 'svg') return { svg: svgStr, beweeg: '' };
  const NS = 'http://www.w3.org/2000/svg', DK = '#2e2a39';
  const voeg = (html) => { const g = doc.createElementNS(NS, 'g'); g.innerHTML = html; svg.appendChild(g); };
  const ogen = _mjOgen(svg);
  if (ogen) {
    const [l, r] = ogen, rr = l.r;
    const delen = ogen.map(o => _mjOogDelen(svg, o));
    const weg = i => delen[i].forEach(el => el.setAttribute('display', 'none'));
    const boog = (o, op) => `<path d="M${o.cx - rr * .85} ${o.cy + (op ? rr * .3 : -rr * .1)} Q${o.cx} ${o.cy + (op ? -rr * .85 : rr * .75)} ${o.cx + rr * .85} ${o.cy + (op ? rr * .3 : -rr * .1)}" stroke="${DK}" stroke-width="${Math.max(1.3, rr * .38).toFixed(2)}" stroke-linecap="round" fill="none"/>`;
    const hart = o => `<path transform="translate(${o.cx} ${o.cy - rr * .2}) scale(${(rr / 7).toFixed(2)})" d="M0 -1 C-2.6 -5 -8 -2.4 -6.4 1.4 C-5.2 4.2 -1.4 6 0 8 C1.4 6 5.2 4.2 6.4 1.4 C8 -2.4 2.6 -5 0 -1 Z" fill="#ff4d7a"/>`;
    switch (st.ogen) {
      case 'lach': weg(0); weg(1); voeg(boog(l, 1) + boog(r, 1)); break;
      case 'dicht': weg(0); weg(1); voeg(boog(l, 0) + boog(r, 0)); break;
      case 'knip': weg(1); voeg(boog(r, 1)); break;
      case 'hart': weg(0); weg(1); voeg(hart(l) + hart(r)); break;
      case 'wijd': ogen.forEach((o, i) => delen[i].forEach(el => _mjSchaal(el, o, el === o.el ? 1.18 : 0.7))); break;
      case 'bril': voeg(`<g><rect x="${l.cx - rr * 1.35}" y="${l.cy - rr * .95}" width="${rr * 2.7}" height="${rr * 1.9}" rx="${rr * .8}" fill="#1f232c"/><rect x="${r.cx - rr * 1.35}" y="${r.cy - rr * .95}" width="${rr * 2.7}" height="${rr * 1.9}" rx="${rr * .8}" fill="#1f232c"/><path d="M${l.cx + rr * 1.3} ${l.cy - rr * .3} L${r.cx - rr * 1.3} ${r.cy - rr * .3}" stroke="#1f232c" stroke-width="${rr * .35}"/><path d="M${l.cx - rr * .8} ${l.cy - rr * .4} l${rr * .7} ${rr * .4}" stroke="#fff" stroke-opacity=".35" stroke-width="${rr * .25}" stroke-linecap="round"/></g>`); break;
    }
    if (st.pupil) ogen.forEach((o, i) => delen[i].forEach(el => { if (el !== o.el && !_mjWit(el)) { el.setAttribute('cx', (_mjNum(el, 'cx') + st.pupil[0] * rr).toFixed(2)); el.setAttribute('cy', (_mjNum(el, 'cy') + st.pupil[1] * rr).toFixed(2)); } }));
    if (st.blos) voeg(ogen.map(o => `<ellipse cx="${o.cx + (o === l ? -rr * .5 : rr * .5)}" cy="${o.cy + rr * 1.55}" rx="${rr * .85}" ry="${rr * .5}" fill="#ff7f9c" opacity="${st.blos > 1 ? .7 : .5}"/>`).join(''));
    if (st.prop === 'traan') voeg(`<path class="mj-traan" d="M${l.cx - rr * .3} ${l.cy + rr * .9} c-1.6 3 -1.6 5 .3 5 s1.9 -2 -.3 -5 z" fill="#7dd3fc"/>`);
  }
  const P = {
    zweet: `<path d="M50 14 c-2.4 4 -2.4 7 0 7 s2.4 -3 0 -7 z" fill="#7dd3fc"/>`,
    zzz: `<g fill="#8b97ad" font-family="sans-serif" font-weight="900"><text x="45" y="14" font-size="7">z</text><text x="50" y="9" font-size="9">Z</text></g>`,
    hartjes: `<g fill="#ff6b9d"><path transform="translate(50 10) scale(.5)" d="M0 -1 C-2.6 -5 -8 -2.4 -6.4 1.4 C-5.2 4.2 -1.4 6 0 8 C1.4 6 5.2 4.2 6.4 1.4 C8 -2.4 2.6 -5 0 -1 Z"/><path transform="translate(9 14) scale(.38)" d="M0 -1 C-2.6 -5 -8 -2.4 -6.4 1.4 C-5.2 4.2 -1.4 6 0 8 C1.4 6 5.2 4.2 6.4 1.4 C8 -2.4 2.6 -5 0 -1 Z" opacity=".8"/></g>`,
    denk: `<g><circle cx="49" cy="15" r="1.4" fill="#fff" stroke="#cfd6e3" stroke-width=".6"/><ellipse cx="54" cy="8" rx="5" ry="3.8" fill="#fff" stroke="#cfd6e3" stroke-width=".6"/><text x="54" y="10" font-size="5" font-weight="800" text-anchor="middle" fill="#8b97ad">?</text></g>`,
  };
  if (st.prop && P[st.prop]) voeg(P[st.prop]);
  if (st.spark) voeg(`<g class="mj-spark" fill="#facc15"><path d="M51 6 l1.1 2.7 2.7 1.1 -2.7 1.1 -1.1 2.7 -1.1 -2.7 -2.7 -1.1 2.7 -1.1z"/><circle cx="8" cy="12" r="1.2"/></g>`);
  svg.setAttribute('overflow', 'visible');
  return { svg: new XMLSerializer().serializeToString(svg), beweeg: st.beweeg || '' };
}

// Stemming van je eigen maatje: wat er nu speelt (streak, vandaag geoefend, tijd).
function maatjeStemming() {
  try {
    const h = new Date().getHours();
    let streak = 0; try { streak = calcStreak().current || 0; } catch (e) {}
    let vandaag = false; try { const t = new Date(); t.setHours(0, 0, 0, 0); vandaag = (getStreak().days || []).indexOf(t.toISOString().slice(0, 10)) >= 0; } catch (e) {}
    if (h >= 23 || h < 6) return 'slaap';
    if (streak >= 7) return 'trots';
    if (vandaag) return 'blij';
    if (streak >= 1 && h >= 18) return 'oeps';      // streak loopt gevaar
    return 'kijk';
  } catch (e) { return 'blij'; }
}

// getAnimalDisplay: zelfde tekeningen, met een optionele stemming als vijfde argument.
(function () {
  if (typeof getAnimalDisplay !== 'function') return;
  const oud = getAnimalDisplay;
  window.getAnimalDisplay = function (animalId, stageIdx, size, accSvg, mood) {
    const html = oud(animalId, stageIdx, size, accSvg);
    if (!mood || !_MJ_STEM[mood]) return html;
    const k = [animalId, stageIdx, size, mood, accSvg || ''].join('|');
    if (_mjCache[k]) return _mjCache[k];
    const m = html.match(/^([\s\S]*?)(<svg[\s\S]*<\/svg>)([\s\S]*)$/i);
    if (!m) return html;
    const e = maatjeEmotie(m[2], mood);
    let voor = m[1];
    if (e.beweeg) voor = voor.replace('class="anim-svg-wrap', 'class="anim-svg-wrap mj-' + e.beweeg);
    const uit = voor + e.svg + m[3];
    const ks = Object.keys(_mjCache); if (ks.length > 200) delete _mjCache[ks[0]];
    return (_mjCache[k] = uit);
  };
})();

// Je maatje reageert in de quiz: goed = blij, reeks = feest, fout = oeps.
const _MJ_REACTIE = { correct: 'blij', streak: 'feest', wrong: 'oeps', combo: 'trots', perfect: 'trots' };
function maatjeReageer(comp, state, ms) {
  if (!comp || !comp.dataset.dier) return;
  const zet = md => {
    const w = comp.querySelector('.anim-svg-wrap'); if (!w) return;
    const html = getAnimalDisplay(comp.dataset.dier, +comp.dataset.fase || 0, +comp.dataset.px || 36, '', md);
    const t = document.createElement('div'); t.innerHTML = html; const nw = t.firstElementChild; if (!nw) return;
    w.innerHTML = nw.innerHTML;
    [...w.classList].filter(c => /^mj-/.test(c)).forEach(c => w.classList.remove(c));
    [...nw.classList].filter(c => /^mj-/.test(c)).forEach(c => w.classList.add(c));
  };
  zet(_MJ_REACTIE[state] || 'blij');
  clearTimeout(comp._mjT);
  comp._mjT = setTimeout(() => zet(null), Math.max(900, ms || 1200));
}
