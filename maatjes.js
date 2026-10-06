// ═══════ MAATJES (dieren) IN VONK-STIJL ═══════
// Eén tekenstijl voor alle maatjes: dezelfde chibi-opbouw als Vonk (grote kop,
// klein lijf, vlak met twee tinten) en hetzelfde gezicht-systeem, zodat elk dier
// emoties kan tonen (stemmingen uit VONK_M: blij, trots, laag, oeps, wow, slaap…).
// Per dier: palet + kenmerken (oren, manen, slurf, vleugels, hoorn, tentakels…).
// Groeifasen 0-5: 0 = ei/kleintje, kenmerken groeien mee, 4 = goud (kroontje),
// 5 = ultiem (kroon + gouden gloed). maatjeSVG(id, fase, stemming, px).
// getAnimalDisplay (profile.js) wordt hier overschreven en valt terug op de oude
// tekeningen voor dieren die hier (nog) niet staan.

const MJ = {
  vos:      { c: '#fb8c3e', s: '#e9701f', b: '#fff1dd', ear: 'punt', snuit: 1, staart: 'vos' },
  wolf:     { c: '#8b97a8', s: '#6e7a8c', b: '#eef1f5', ear: 'punt', snuit: 1, staart: 'wolf', masker: '#5d6879' },
  tijger:   { c: '#f28a2e', s: '#d96f17', b: '#fff3e0', ear: 'kat', snuit: 1, staart: 'tijger', strepen: '#2e2a39' },
  leeuw:    { c: '#f2a94a', s: '#d98a2b', b: '#fff1d6', ear: 'rond', snuit: 1, staart: 'leeuw', manen: '#b8641c' },
  beer:     { c: '#a0673a', s: '#85532c', b: '#e8c9a5', ear: 'rond', snuit: 1 },
  gorilla:  { c: '#3d424e', s: '#2a2e37', b: '#b39782', ear: 'klein', snuit: 0, gezicht: 1 },
  olifant:  { c: '#9aa5b8', s: '#7f8aa0', b: '#dfe4ee', ear: 'olifant', slurf: 1 },
  eenhoorn: { c: '#fbf8ff', s: '#e3def3', b: '#ffffff', ear: 'kat', snuit: 0, hoorn: 1, rand: '#d9d0ee', manenKleur: ['#f9a8d4', '#a5b4fc', '#fde68a'] },
  draak:    { c: '#3fae5f', s: '#2e8a49', b: '#c9f0b0', ear: 'geen', snuit: 0, horens: '#f3e3a6', vleugel: '#2e8a49', staart: 'draak', ei: 1 },
  adelaar:  { c: '#8a5a2b', s: '#6b4520', b: '#c79a64', ear: 'geen', snavel: '#f5b301', vleugel: '#6b4520', kopKleur: '#ffffff', rand: '#e6dccb', ei: 1 },
  uil:      { c: '#a07a4f', s: '#85623c', b: '#f3e2c4', ear: 'pluim', snavel: '#f59e0b', vleugel: '#85623c', ei: 1, uilOog: 1 },
  haai:     { c: '#5b86b4', s: '#46698f', b: '#eef4fa', ear: 'geen', vin: 1, kieuw: 1 },
  octopus:  { c: '#f472b6', s: '#db4f98', b: '#ffd1e8', ear: 'geen', tentakel: 1, vlekken: 1 },
  slang:    { c: '#4caf50', s: '#3a8f3e', b: '#d6f2c4', ear: 'geen', slang: 1, ei: 1 },
  slijm:    { c: '#55c776', s: '#3aa65c', b: '#a6ecbb', ear: 'geen', slijm: 1 },
  cactus:   { c: '#4caf6e', s: '#3a8f58', b: '#8fd6a6', ear: 'geen', cactus: 1 },
  robot:    { c: '#b8c4d6', s: '#93a2b8', b: '#dfe6f0', ear: 'geen', robot: 1 },
  vlinder:  { c: '#6d4bc4', s: '#5537a3', b: '#c4b5fd', ear: 'geen', vlinder: ['#a78bfa', '#f472b6'] },
};

// ── gezicht (gedeeld met Vonk: VONK_M) ──
function _mjGezicht(d, m, mood) {
  const DK = '#2e2a39', NO = d.robot ? '#5ee6ff' : '#3b2a22';
  const dy = m.eyeUp ? -2.6 : (m.eyeDn ? 3.4 : 0.9);
  const big = d.uilOog ? 1.25 : 1;
  const er = (m.wide ? 12 : 9.5) * big, ery = (m.wide ? 13 : 10.5) * big, pr = (m.wide ? 4.2 : 5.6) * big;
  let ogen;
  const boog = (cx, up) => `<path d="M${cx - 7} ${up ? 44 : 41} Q${cx} ${up ? 37 : 47} ${cx + 7} ${up ? 44 : 41}" stroke="${d.robot ? NO : DK}" stroke-width="3.2" stroke-linecap="round" fill="none"/>`;
  if (d.robot) {
    const og = cx => m.laugh ? boog(cx, 1) : m.sleep ? boog(cx, 0) : (m.heartEyes ? `<path transform="translate(${cx},42)" d="M0 -1 C-2.6 -5 -8 -2.4 -6.4 1.4 C-5.2 4.2 -1.4 6 0 8 C1.4 6 5.2 4.2 6.4 1.4 C8 -2.4 2.6 -5 0 -1 Z" fill="#ff7ab0"/>`
      : `<rect x="${cx - (m.wide ? 6 : 5)}" y="${42 + dy - (m.wide ? 7 : 6)}" width="${m.wide ? 12 : 10}" height="${m.wide ? 14 : 12}" rx="5" fill="${NO}"/>`);
    ogen = og(47) + (m.wink ? boog(73, 1) : og(73));
  } else {
    const oog = cx => `<ellipse cx="${cx}" cy="41" rx="${er}" ry="${ery}" fill="#fff"/><circle cx="${cx}" cy="${41 + dy}" r="${pr}" fill="${DK}"/><circle cx="${cx + 2.1}" cy="${38.4 + dy}" r="${2.2 * big}" fill="#fff"/>`;
    const hart = cx => `<path transform="translate(${cx},42)" d="M0 -1 C-2.6 -5 -8 -2.4 -6.4 1.4 C-5.2 4.2 -1.4 6 0 8 C1.4 6 5.2 4.2 6.4 1.4 C8 -2.4 2.6 -5 0 -1 Z" fill="#ff5a7a"/>`;
    if (m.heartEyes) ogen = hart(47) + hart(73);
    else if (m.laugh) ogen = boog(47, 1) + boog(73, 1);
    else if (m.sleep) ogen = boog(47, 0) + boog(73, 0);
    else if (m.dizzy) ogen = [47, 73].map(cx => `<circle cx="${cx}" cy="41" r="7" fill="#fff"/><path d="M${cx} 41 m-3 0 a3 3 0 1 1 3 3 a5 5 0 1 1 -5 -5" stroke="${DK}" stroke-width="2" fill="none"/>`).join('');
    else if (m.wink) ogen = oog(47) + boog(73, 1);
    else ogen = oog(47) + oog(73);
    if (d.uilOog && !m.laugh && !m.sleep && !m.heartEyes) ogen = `<circle cx="47" cy="41" r="14" fill="${d.b}"/><circle cx="73" cy="41" r="14" fill="${d.b}"/>` + ogen;
  }
  let g = `<g class="mj-ogen">${ogen}</g>`;
  if (m.shades) g += `<g><rect x="34" y="33" width="22" height="15" rx="7" fill="#20242e"/><rect x="64" y="33" width="22" height="15" rx="7" fill="#20242e"/><path d="M56 38 Q60 36 64 38" stroke="#20242e" stroke-width="2.6" fill="none"/></g>`;
  if (m.brow) g += `<path d="${m.brow}" stroke="${d.robot ? NO : (d.c === '#3d424e' ? '#14161b' : DK)}" stroke-width="3" stroke-linecap="round" fill="none"/>`;
  // wangen
  g += `<ellipse cx="35" cy="56" rx="6" ry="4" fill="#ff8fa3" opacity="${m.blush ? .6 : .28}"/><ellipse cx="85" cy="56" rx="6" ry="4" fill="#ff8fa3" opacity="${m.blush ? .6 : .28}"/>`;
  // neus / snavel / mond
  if (d.snavel) {
    const open = m.filled;
    g += open ? `<path d="M52 49 L68 49 L60 56 Z" fill="${d.snavel}"/><path d="M54 58 L66 58 L60 66 Z" fill="${d.snavel}" opacity=".9"/><path d="M54 56.5 Q60 60 66 56.5" stroke="#3b2a22" stroke-width="2" fill="none"/>`
               : `<path d="M52 49 Q60 46 68 49 L60 62 Z" fill="${d.snavel}"/><path d="M60 50 L60 61" stroke="#000" stroke-opacity=".12" stroke-width="1.5"/>`;
  } else if (d.slurf) {
    // de slurf zelf staat in de kop; bij blijdschap krult hij omhoog
  } else if (d.robot) {
    g += `<path d="${m.mouth}" stroke="${NO}" stroke-width="3" stroke-linecap="round" fill="${m.filled ? NO : 'none'}" opacity=".95"/>`;
  } else {
    if (d.snuit === 1 || d.gezicht) g += `<path d="M54 49 Q60 45 66 49 Q64 56 60 57 Q56 56 54 49 Z" fill="#3b2a22"/>`;
    g += `<path d="${m.mouth}" stroke="#3b2a22" stroke-width="3" stroke-linecap="round" fill="${m.filled ? '#3b2a22' : 'none'}"/>`;
    if (m.tongue) g += `<path d="M54 64.5 Q60 60.5 66 64.5 Q64 69.5 60 69.5 Q56 69.5 54 64.5 Z" fill="#ff8a9e"/>`;
    if (m.teeth) g += `<path d="M52 61.6 L68 61.6 L68 63.4 L52 63.4 Z" fill="#fff"/>`;
  }
  return g;
}

function _mjProps(m) {
  const P = {
    think: `<g><circle cx="94" cy="32" r="3" fill="#fff" stroke="#d9dee8"/><ellipse cx="106" cy="18" rx="10" ry="7.5" fill="#fff" stroke="#d9dee8"/><text x="106" y="22" font-size="10" font-weight="700" text-anchor="middle" fill="#94a0b8">?</text></g>`,
    sweat: `<path d="M88 34 C84 41 84 46 88 46 C92 46 92 41 88 34 Z" fill="#7dd3fc"/>`,
    tear: `<path class="mj-traan" d="M40 50 C37 56 37 60 40.5 60 C44 60 44 56 40 50 Z" fill="#7dd3fc"/>`,
    hearts: `<g fill="#ff6b9d"><path d="M94 22 C92 18 86 20 88 25 C89 28 93 30 94 32 C95 30 99 28 100 25 C102 20 96 18 94 22 Z"/></g>`,
    zzz: `<g fill="#94a0b8" font-family="sans-serif" font-weight="900"><text x="88" y="24" font-size="10">z</text><text x="96" y="16" font-size="14">Z</text></g>`,
    book: '',
  };
  let s = m.prop ? (P[m.prop] || '') : '';
  if (m.spark) s += `<g fill="#facc15"><path d="M101 8 l2.3 5.6 5.6 2.3 -5.6 2.3 -2.3 5.6 -2.3 -5.6 -5.6 -2.3 5.6 -2.3z"/><circle cx="18" cy="22" r="2.4"/></g>`;
  return s;
}

// ── oren en kopversiering ──
function _mjOren(d, f) {
  const C = d.c, S = d.s, B = d.b;
  switch (d.ear) {
    case 'punt': return `<g class="mj-oor-l"><path d="M42 26 C33 8 20 6 23 22 C25 32 36 33 42 26 Z" fill="${C}"/><path d="M39 23 C34 14 28 14 30 22 C31 28 36 28 39 23 Z" fill="${d.masker ? '#cfd5df' : B}"/></g><g class="mj-oor-r"><path d="M78 26 C87 8 100 6 97 22 C95 32 84 33 78 26 Z" fill="${C}"/><path d="M81 23 C86 14 92 14 90 22 C89 28 84 28 81 23 Z" fill="${d.masker ? '#cfd5df' : B}"/></g>`;
    case 'kat': return `<g class="mj-oor-l"><path d="M33 30 L30 9 L48 20 Z" fill="${C}"${d.rand ? ` stroke="${d.rand}" stroke-width="2" stroke-linejoin="round"` : ''}/><path d="M35 26 L34 14 L44 21 Z" fill="${d.hoorn ? '#fbcfe8' : '#ffc7a3'}"/></g><g class="mj-oor-r"><path d="M87 30 L90 9 L72 20 Z" fill="${C}"${d.rand ? ` stroke="${d.rand}" stroke-width="2" stroke-linejoin="round"` : ''}/><path d="M85 26 L86 14 L76 21 Z" fill="${d.hoorn ? '#fbcfe8' : '#ffc7a3'}"/></g>`;
    case 'rond': return `<g class="mj-oor-l"><circle cx="31" cy="20" r="11" fill="${C}"/><circle cx="31" cy="20" r="6" fill="${B}"/></g><g class="mj-oor-r"><circle cx="89" cy="20" r="11" fill="${C}"/><circle cx="89" cy="20" r="6" fill="${B}"/></g>`;
    case 'klein': return `<circle cx="26" cy="42" r="7" fill="${C}"/><circle cx="26" cy="42" r="3.6" fill="${B}"/><circle cx="94" cy="42" r="7" fill="${C}"/><circle cx="94" cy="42" r="3.6" fill="${B}"/>`;
    case 'olifant': { const r = 15 + f * 2; return `<g class="mj-oor-l"><ellipse cx="${27 - f}" cy="42" rx="${r}" ry="${r + 4}" fill="${C}"/><ellipse cx="${29 - f}" cy="43" rx="${r - 5}" ry="${r - 1}" fill="#f2c4cf"/></g><g class="mj-oor-r"><ellipse cx="${93 + f}" cy="42" rx="${r}" ry="${r + 4}" fill="${C}"/><ellipse cx="${91 + f}" cy="43" rx="${r - 5}" ry="${r - 1}" fill="#f2c4cf"/></g>`; }
    case 'pluim': return `<path d="M34 22 L28 4 L46 16 Z" fill="${S}"/><path d="M86 22 L92 4 L74 16 Z" fill="${S}"/>`;
    default: return '';
  }
}

// ── het dier ──
function maatjeSVG(id, fase, mood, size) {
  const d = MJ[id]; if (!d) return '';
  fase = Math.max(0, Math.min(5, fase | 0)); size = size || 96;
  const M = (typeof VONK_M !== 'undefined' && VONK_M) || {};
  const m = M[mood] || M.blij || { mouth: 'M51 60 Q60 70 69 60' };
  const C = d.c, S = d.s, B = d.b;
  const groei = [0, 0.35, 0.6, 0.85, 1, 1][fase];      // hoe ver kenmerken gegroeid zijn
  let achter = '', lijf = '', kop = '', voor = '';

  // staart / vleugels / manen achter het lijf
  if (d.staart === 'vos') achter += `<g class="mj-staart"><path d="M44 96 C22 100 9 89 12 74 C14 63 28 62 31 74 C27 87 34 95 47 92 Z" fill="${C}"/><path d="M15 72 C8 74 7 84 13 87 C20 89 24 80 21 73 Z" fill="${B}"/></g>`;
  if (d.staart === 'wolf') achter += `<g class="mj-staart"><path d="M44 98 C26 104 12 94 14 78 C16 68 28 70 30 80 C28 90 34 96 46 94 Z" fill="${S}"/><path d="M15 76 C11 80 12 87 17 88 C21 88 22 82 20 77 Z" fill="${B}"/></g>`;
  if (d.staart === 'tijger') achter += `<g class="mj-staart"><path d="M42 100 C24 104 14 92 18 80" stroke="${C}" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M20 90 l6 -3 M17 84 l6 -1" stroke="${d.strepen}" stroke-width="3" stroke-linecap="round"/></g>`;
  if (d.staart === 'leeuw') achter += `<g class="mj-staart"><path d="M42 100 C24 104 16 94 20 82" stroke="${C}" stroke-width="6" stroke-linecap="round" fill="none"/><circle cx="20" cy="80" r="6" fill="${d.manen}"/></g>`;
  if (d.staart === 'draak') achter += `<g class="mj-staart"><path d="M44 100 C24 106 12 96 14 82" stroke="${C}" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M8 82 L14 70 L20 82 Z" fill="${d.horens}"/></g>`;
  if (d.vleugel && !d.snavel && fase >= 2) {      // drakenvleugels
    const w = 10 + groei * 16;
    achter += `<g class="mj-vleugel"><path d="M40 78 C${30 - w} ${60 - w} ${22 - w} ${74 - w / 3} ${28 - w / 2} 94 C34 88 36 86 40 86 Z" fill="${d.vleugel}"/><path d="M80 78 C${90 + w} ${60 - w} ${98 + w} ${74 - w / 3} ${92 + w / 2} 94 C86 88 84 86 80 86 Z" fill="${d.vleugel}"/></g>`;
  }
  if (d.vlinder) {
    const w = 0.7 + groei * 0.5, [v1, v2] = d.vlinder;
    achter += `<g class="mj-vleugel" transform="translate(60 76) scale(${w}) translate(-60 -76)"><ellipse cx="34" cy="62" rx="26" ry="20" fill="${v1}" transform="rotate(-25 34 62)"/><ellipse cx="86" cy="62" rx="26" ry="20" fill="${v1}" transform="rotate(25 86 62)"/><ellipse cx="38" cy="92" rx="17" ry="13" fill="${v2}" transform="rotate(20 38 92)"/><ellipse cx="82" cy="92" rx="17" ry="13" fill="${v2}" transform="rotate(-20 82 92)"/><circle cx="30" cy="60" r="6" fill="#fff" opacity=".55"/><circle cx="90" cy="60" r="6" fill="#fff" opacity=".55"/></g>`;
  }
  if (d.manen) {
    const r = 30 + groei * 14, n = 14;
    let p = ''; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; p += `<circle cx="${(60 + Math.cos(a) * r).toFixed(1)}" cy="${(44 + Math.sin(a) * r * .92).toFixed(1)}" r="${(9 + groei * 5).toFixed(1)}"/>`; }
    achter += `<g fill="${d.manen}">${p}<circle cx="60" cy="44" r="${r}"/></g>`;
  }
  if (d.hoorn && d.manenKleur) {
    const [a, b2, c2] = d.manenKleur, l = 0.6 + groei * 0.5;
    achter += `<g transform="translate(60 30) scale(${l}) translate(-60 -30)"><path d="M78 14 C98 18 102 40 96 60 C90 50 86 40 84 30 Z" fill="${a}"/><path d="M84 22 C100 30 100 50 92 66 C88 54 86 44 86 34 Z" fill="${b2}"/><path d="M88 34 C98 44 96 58 88 70 C86 60 86 50 88 40 Z" fill="${c2}"/></g>`;
  }

  // voetjes, lijf, armen
  const poot = (cx, cy, r, kl) => `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${(r * 1.04).toFixed(1)}" fill="${kl || C}"/>`;
  const armen = () => {
    const kl = d.vleugel && d.snavel ? d.vleugel : C;
    const sw = d.robot ? 9 : 11;
    const neer = `<path d="M40 84 C32 88 31 96 37 100" stroke="${kl}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>${poot(37, 100, 6, kl)}`;
    const neerR = `<path d="M80 84 C88 88 89 96 83 100" stroke="${kl}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>${poot(83, 100, 6, kl)}`;
    const zwaai = `<g class="mj-zwaai"><path d="M80 82 C90 80 96 71 97 62" stroke="${kl}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>${poot(97, 60, 6.5, kl)}</g>`;
    const juichL = `<path d="M42 80 C32 71 29 61 32 51" stroke="${kl}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>${poot(32, 50, 6.5, kl)}`;
    const juichR = `<path d="M78 80 C89 71 92 61 89 51" stroke="${kl}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>${poot(89, 50, 6.5, kl)}`;
    if (m.arms === 'cheer') return [juichL, juichR];
    if (m.arms === 'wave') return [neer, zwaai];
    return [neer, neerR];
  };

  if (d.tentakel) {
    let t = ''; const xs = [34, 44, 54, 66, 76, 86];
    xs.forEach((x, i) => { const r = (i % 2 ? 1 : -1) * 6; t += `<path d="M${x} 74 C${x + r} 88 ${x - r} 96 ${x + r * .8} 108" stroke="${i % 2 ? S : C}" stroke-width="9" stroke-linecap="round" fill="none"/>`; });
    lijf += `<g class="mj-tentakels">${t}</g>`;
  } else if (d.slang) {
    lijf += `<path d="M60 70 C88 74 92 100 66 104 C42 108 30 96 44 88 C56 82 70 92 58 98" stroke="${C}" stroke-width="15" stroke-linecap="round" fill="none"/><path d="M60 70 C88 74 92 100 66 104 C42 108 30 96 44 88" stroke="${B}" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/>`;
  } else if (d.slijm) {
    // geen lijf: de kop is de klodder
  } else if (d.cactus) {
    lijf += `<path d="M44 66 h32 v32 h-32 Z" fill="${C}"/><path d="M52 66 v32 M60 66 v32 M68 66 v32" stroke="${S}" stroke-width="2"/>`
      + `<path d="M44 84 C34 84 30 78 30 70" stroke="${C}" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M76 80 C86 80 90 74 90 66" stroke="${C}" stroke-width="10" stroke-linecap="round" fill="none"/>`
      + `<path d="M38 96 h44 l-5 16 h-34 Z" fill="#d9774a"/><rect x="36" y="94" width="48" height="7" rx="3" fill="#c0603a"/>`;
  } else {
    lijf += poot(49, 109, 9.5) + poot(71, 109, 9.5);
    if (d.robot) lijf += `<rect x="38" y="68" width="44" height="40" rx="12" fill="${C}"/><rect x="46" y="76" width="28" height="20" rx="6" fill="${S}"/><circle cx="60" cy="86" r="5" fill="#5ee6ff"/>`;
    else lijf += `<path d="M60 64 C76 64 85 77 85 90 C85 104 74 110 60 110 C46 110 35 104 35 90 C35 77 44 64 60 64 Z" fill="${C}"${d.rand && !d.snavel ? ` stroke="${d.rand}" stroke-width="2.5"` : ''}/><path d="M60 68 C70 68 78 79 78 92 C78 102 70 106 60 106 C50 106 42 102 42 92 C42 79 50 68 60 68 Z" fill="${B}"/>`;
    if (d.vin) lijf += `<path d="M85 92 L104 80 L100 102 Z" fill="${S}"/>`;
  }
  let armL = '', armR = '';
  if (!d.tentakel && !d.slang && !d.slijm && !d.cactus) [armL, armR] = armen();

  // kop
  if (d.slijm) {
    const h = 6 + groei * 6;
    kop += `<path d="M60 ${18 - h} C88 ${18 - h} 98 50 98 80 C98 100 86 110 60 110 C34 110 22 100 22 80 C22 50 32 ${18 - h} 60 ${18 - h} Z" fill="${C}"/>`
      + `<path d="M30 92 C28 100 32 104 34 100 M90 94 C92 102 88 106 86 102" stroke="${S}" stroke-width="5" stroke-linecap="round" fill="none"/>`
      + `<ellipse cx="44" cy="${28 - h / 2}" rx="12" ry="7" fill="#fff" opacity=".35"/>`;
  } else if (d.robot) {
    kop += `<path d="M60 4 v10" stroke="${S}" stroke-width="3"/><circle cx="60" cy="4" r="${4 + groei * 2}" fill="#f472b6"/>`
      + `<rect x="26" y="14" width="68" height="56" rx="18" fill="${C}"/><rect x="33" y="22" width="54" height="40" rx="12" fill="#1e2a3a"/>`
      + `<rect x="20" y="34" width="8" height="16" rx="4" fill="${S}"/><rect x="92" y="34" width="8" height="16" rx="4" fill="${S}"/>`;
  } else {
    kop += `<g class="mj-oren">${_mjOren(d, groei * 4)}</g>`;
    const kopKleur = d.kopKleur || C;
    kop += `<path d="M60 12 C39 12 27 27 27 45 C27 63 40 72 60 72 C80 72 93 63 93 45 C93 27 81 12 60 12 Z" fill="${kopKleur}"${d.rand ? ` stroke="${d.rand}" stroke-width="2.5"` : ''}/>`;
    kop += `<ellipse cx="47" cy="27" rx="14" ry="8" fill="#fff" opacity=".18"/>`;
    if (d.masker) kop += `<path d="M30 40 C34 20 50 14 60 22 C70 14 86 20 90 40 C82 34 72 34 66 40 L60 46 L54 40 C48 34 38 34 30 40 Z" fill="${d.masker}" opacity=".55"/>`;
    if (d.strepen) kop += `<g fill="${d.strepen}"><path d="M56 13 L60 24 L64 13 Z"/><path d="M45 15 L50 24 L52 15 Z"/><path d="M75 15 L70 24 L68 15 Z"/><path d="M27 44 L36 46 L28 50 Z"/><path d="M93 44 L84 46 L92 50 Z"/></g>`;
    if (d.gezicht) kop += `<path d="M60 26 C76 24 86 34 84 50 C82 64 72 70 60 70 C48 70 38 64 36 50 C34 34 44 24 60 26 Z" fill="${B}"/><path d="M36 32 Q48 24 60 30 Q72 24 84 32" stroke="${S}" stroke-width="6" stroke-linecap="round" fill="none"/>`;
    if (d.snuit) kop += `<path d="M35 46 C40 41 47 41 51 45 C55 49 65 49 69 45 C73 41 80 41 85 46 C88 59 76 71 60 71 C44 71 32 59 35 46 Z" fill="${B}"/>`;
    if (d.vin) kop += `<path d="M48 14 C54 -2 70 -6 74 2 C68 6 66 10 66 14 Z" fill="${S}"/>`;
    if (d.kieuw) kop += `<path d="M30 48 q3 4 0 8 M34 47 q3 4 0 8" stroke="${S}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    if (d.vlekken) kop += `<g fill="${S}" opacity=".5"><circle cx="40" cy="24" r="4"/><circle cx="82" cy="28" r="3"/><circle cx="72" cy="18" r="2.4"/></g>`;
    if (d.horens) { const h = 6 + groei * 10; kop += `<path d="M38 20 L${32 - groei * 4} ${20 - h} L46 16 Z" fill="${d.horens}"/><path d="M82 20 L${88 + groei * 4} ${20 - h} L74 16 Z" fill="${d.horens}"/><path d="M54 12 L60 ${4 - groei * 4} L66 12 Z" fill="${S}"/>`; }
    if (d.hoorn) { const h = 10 + groei * 14; kop += `<path d="M54 14 L60 ${14 - h} L66 14 Z" fill="#f5c518"/><path d="M56 10 L64 8 M57 4 L63 2" stroke="#d4a017" stroke-width="1.5"/>`; }
    if (d.uilOog) kop += `<path d="M40 18 Q60 30 80 18" stroke="${S}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  if (d.cactus) {
    // cactus: kop is het bovenste deel van de plant
    kop = `<path d="M60 14 C78 14 86 26 86 44 L86 70 L34 70 L34 44 C34 26 42 14 60 14 Z" fill="${C}"/><path d="M48 18 v50 M60 15 v55 M72 18 v50" stroke="${S}" stroke-width="2"/>`
      + `<g stroke="#e8f5d0" stroke-width="1.6" stroke-linecap="round"><path d="M40 30 l-4 -2 M80 30 l4 -2 M40 60 l-4 2 M80 60 l4 2"/></g>`;
    if (fase >= 3) kop += `<g transform="translate(60 12)"><circle r="7" fill="#f472b6"/><circle r="3" fill="#facc15"/></g>`;
  }
  kop += `<g class="mj-gezicht">${_mjGezicht(d, m, mood)}</g>`;
  if (d.slurf) {
    const blij = m.filled || m.arms === 'cheer' || mood === 'blij' || mood === 'trots';
    const pad = blij ? 'M60 48 C60 60 64 66 72 64 C78 62 81 56 80 50' : 'M60 48 C60 62 60 72 68 78';
    kop += `<path d="${pad}" stroke="${S}" stroke-width="13" stroke-linecap="round" fill="none"/><path d="${pad}" stroke="${C}" stroke-width="9" stroke-linecap="round" fill="none"/><path d="${pad}" stroke="${S}" stroke-width="9" stroke-linecap="round" fill="none" stroke-dasharray="1.5 6" opacity=".55"/>`
      + (blij ? `<path d="M50 62 Q55 68 60 64" stroke="#3b2a22" stroke-width="2.6" fill="none" stroke-linecap="round"/>` : '');
  }
  if (d.vlinder) kop += `<path d="M50 16 C46 6 40 4 36 6 M70 16 C74 6 80 4 84 6" stroke="${S}" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="36" cy="6" r="3" fill="${d.vlinder[1]}"/><circle cx="84" cy="6" r="3" fill="${d.vlinder[1]}"/>`;

  // kroon voor goud en ultiem
  let kroon = '', gloed = '';
  if (fase >= 4) {
    kroon = `<g transform="translate(60 ${d.robot ? 12 : (d.slijm ? 4 : 10)})"><path d="M-14 0 L-11 -12 L-5 -6 L0 -15 L5 -6 L11 -12 L14 0 Z" fill="#f5c518"/><rect x="-14" y="-2" width="28" height="5" rx="2" fill="#e0a90f"/><circle cx="0" cy="-12" r="2" fill="#ff5a7a"/></g>`;
    if (fase === 5) gloed = `<circle cx="60" cy="62" r="58" fill="url(#mjGloed-${id})"/>`;
  }

  // ei (fase 0 bij eierleggers): het kleintje gluurt uit een gebarsten ei
  let ei = '';
  const schaal = fase === 0 ? 0.78 : [1, 0.86, 0.92, 0.97, 1, 1][fase];
  if (fase === 0 && d.ei) {
    ei = `<g><path d="M28 112 C24 96 26 76 36 70 L44 78 L52 70 L60 78 L68 70 L76 78 L84 70 C94 76 96 96 92 112 Z" fill="#f4ecd8"/><path d="M28 112 C24 96 26 76 36 70 L44 78 L52 70 L60 78 L68 70 L76 78 L84 70" stroke="#d8ccb0" stroke-width="2" fill="none"/><circle cx="40" cy="98" r="4" fill="#e8dcc0"/><circle cx="78" cy="92" r="3" fill="#e8dcc0"/></g>`;
    lijf = ''; armL = ''; armR = ''; achter = '';
  }

  const defs = fase === 5 ? `<defs><radialGradient id="mjGloed-${id}"><stop offset="0" stop-color="#ffe27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></radialGradient></defs>` : '';
  const ty = (1 - schaal) * 112;
  return `<svg class="mj-svg mj-mood-${mood || 'blij'}${fase >= 4 ? ' mj-goud' : ''}" viewBox="-8 -12 136 136" width="${size}" height="${size}" role="img" aria-label="maatje">${defs}${gloed}
    <ellipse cx="60" cy="116" rx="${28 * schaal}" ry="5" fill="#000" opacity=".12"/>
    <g class="mj-fig" transform="translate(${(60 * (1 - schaal)).toFixed(1)} ${ty.toFixed(1)}) scale(${schaal})">
      ${achter}${armL}${lijf}<g class="mj-kop">${kop}</g>${armR}${ei}${kroon}${_mjProps(m)}
    </g></svg>`;
}

// Stemming van je eigen maatje: wat er nu speelt (streak, oefenen vandaag, tijd).
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

// getAnimalDisplay overnemen: nieuwe maatjes waar mogelijk, anders de oude tekening.
(function () {
  if (typeof getAnimalDisplay !== 'function') return;
  const oud = getAnimalDisplay;
  window.getAnimalDisplay = function (animalId, stageIdx, size, accSvg, mood) {
    if (!MJ[animalId]) return oud.apply(this, arguments);
    size = size || 48;
    const fase = Math.min(stageIdx | 0, 5);
    let svg = maatjeSVG(animalId, fase, mood || 'blij', size);
    // accessoires uit de winkel: van het oude 60×60-raster naar dit raster
    if (accSvg) svg = svg.replace(/<\/svg>\s*$/i, '<g transform="translate(-8 -12) scale(2.2667)">' + accSvg + '</g></svg>');
    const top = (typeof ANIM_THRESHOLDS !== 'undefined') ? ANIM_THRESHOLDS.length - 1 : 6;
    const tier = stageIdx >= top ? ' anim-ascend' : (stageIdx === top - 1 ? ' anim-goud' : '');
    const beweeg = (size >= 44 && typeof ANIMAL_MOVE !== 'undefined' && ANIMAL_MOVE[animalId]) ? ' ' + ANIMAL_MOVE[animalId] : '';
    return '<span class="anim-svg-wrap mj-wrap' + tier + beweeg + '" style="width:' + size + 'px;height:' + size + 'px">' + svg + '</span>';
  };
})();

// Je maatje reageert in de quiz met een gezicht: goed = blij, reeks = feest, fout = oeps.
const _MJ_REACTIE = { correct: 'blij', streak: 'feest', wrong: 'oeps', combo: 'trots', perfect: 'trots' };
function maatjeReageer(comp, state, ms) {
  if (!comp || !comp.dataset.dier || !MJ[comp.dataset.dier]) return;
  const mood = _MJ_REACTIE[state] || 'blij';
  const zet = md => { const w = comp.querySelector('.mj-wrap'); if (!w) return; w.innerHTML = maatjeSVG(comp.dataset.dier, +comp.dataset.fase || 0, md, +comp.dataset.px || 36); };
  zet(mood);
  clearTimeout(comp._mjT);
  comp._mjT = setTimeout(() => zet('blij'), Math.max(900, ms || 1200));
}
