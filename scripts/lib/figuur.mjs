// ═══════════════════════════════════════════════════════════════════════════
// figuur.mjs · figuren voor samenvattingen die eruitzien als uit een goed leerboek
//
// Je schrijft een korte spec (JSON), dit maakt de markup. Zo hoeft niemand meer
// cirkels met tekst of genummerde rijtjes met de hand te tekenen.
//
//   fragment  echte brontekst met markeerstift en genummerde aantekeningen (HTML)
//   grafiek   assen met schaal, rasterlijnen, lijnen/punten met label aan de lijn
//   tijdlijn  tijdas op schaal, gebeurtenissen boven/onder, periodes als band
//   boom      argumentatiestructuur met echte zinnen in de vakken
//   kring     proces dat rondgaat (kringloop, cyclus) met gebogen pijlen
//
// Gebruik: node scripts/figuur.mjs <spec.json>  (zie docs/FIGUREN.md)
// Daarnaast: generiek(svg) → redenen waarom een figuur er als sjabloon uitziet.
// ═══════════════════════════════════════════════════════════════════════════

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const r1 = n => Math.round(n * 10) / 10;
// Breedte van tekst in Inter, geschat (gemiddeld 0,55 em; vet 0,59 em).
export const breedte = (t, fs, vet) => String(t).length * fs * (vet ? 0.59 : 0.55);
// Breekt tekst op woorden tot regels van maximaal `max` px.
export function breek(t, fs, max, vet) {
  const regels = []; let r = '';
  for (const w of String(t).split(/\s+/)) {
    const nieuw = r ? r + ' ' + w : w;
    if (r && breedte(nieuw, fs, vet) > max) { regels.push(r); r = w; } else r = nieuw;
  }
  if (r) regels.push(r);
  return regels;
}
const tekst = (x, y, t, o = {}) => `<text x="${r1(x)}" y="${r1(y)}"${o.halo ? ' paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round"' : ''}${o.anchor ? ` text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 11}"${o.vet ? ' font-weight="700"' : ''}${o.it ? ' font-style="italic"' : ''} fill="${o.kleur || 'var(--dk)'}">${esc(t)}</text>`;
const regelsTekst = (x, y, regels, o = {}) => `<text x="${r1(x)}" y="${r1(y)}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 11}"${o.vet ? ' font-weight="700"' : ''} fill="${o.kleur || 'var(--dk)'}">${regels.map((r, i) => `<tspan x="${r1(x)}" dy="${i ? r1((o.fs || 11) * 1.3) : 0}">${esc(r)}</tspan>`).join('')}</text>`;
// Pijlpunt als driehoek (geen <marker>: ids botsen als er meer figuren op één pagina staan).
function pijlpunt(x, y, hoek, k = 'var(--or)', m = 6) {
  const a = hoek, p = (d, h) => `${r1(x + Math.cos(a + h) * d)},${r1(y + Math.sin(a + h) * d)}`;
  return `<polygon points="${r1(x)},${r1(y)} ${p(-m, 0.45)} ${p(-m, -0.45)}" fill="${k}"/>`;
}
const svgOpen = (w, h, aria) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(aria)}"><g font-family="inherit">`;
const figuur = (svg, cap) => `<div class="sam-figure">${svg}</g></svg><div class="sam-figcap">${cap}</div></div>`;
function eis(spec, ...velden) { for (const v of velden) if (spec[v] == null) throw new Error(`${spec.soort}: veld "${v}" ontbreekt`); }

// ── fragment ────────────────────────────────────────────────────────────────
// { soort:'fragment', bron:'Uit: ...', alineas:['Tekst met [[gemarkeerd stuk::wat je hier ziet]] ...'], cap }
export function fragment(spec) {
  eis(spec, 'alineas', 'cap');
  let n = 0; const noten = [];
  const al = spec.alineas.map(a => '<p>' + esc(a).replace(/\[\[([\s\S]+?)::([\s\S]+?)\]\]/g, (_, t, noot) => { n++; noten.push(noot); return `<mark data-n="${n}">${t}</mark>`; }) + '</p>').join('');
  if (n < 2) throw new Error('fragment: minstens 2 gemarkeerde stukken ([[tekst::aantekening]])');
  return `<div class="sam-figure sam-frag"><div class="sam-frag-blad">${spec.bron ? `<div class="sam-frag-bron">${esc(spec.bron)}</div>` : ''}${al}</div><ol class="sam-frag-noten">${noten.map(t => `<li>${t}</li>`).join('')}</ol><div class="sam-figcap">${spec.cap}</div></div>`;
}

// ── grafiek ─────────────────────────────────────────────────────────────────
// { soort:'grafiek', aria, cap, x:{label,min,max,stap}, y:{label,min,max,stap},
//   lijnen:[{punten:[[x,y],...], label, glad?, zacht?}], punten?:[{x,y,label}], zones?:[{van,tot,label}] }
export function grafiek(spec) {
  eis(spec, 'aria', 'cap', 'x', 'y', 'lijnen');
  const W = 320, H = 210, R = 16, T = 14, B = 38;
  const { x: X, y: Y } = spec;
  const L0 = 42; let L = spec.y.labels ? 30 : L0;
  const sx = v => L + (v - X.min) / (X.max - X.min) * (W - L - R);
  const sy = v => H - B - (v - Y.min) / (Y.max - Y.min) * (H - T - B);
  const fmt = v => String(Math.round(v * 1000) / 1000).replace('.', ',');
  let s = svgOpen(W, H, spec.aria);
  for (const z of spec.zones || []) {
    s += `<rect x="${r1(sx(z.van))}" y="${T}" width="${r1(sx(z.tot) - sx(z.van))}" height="${H - T - B}" fill="rgba(var(--or-rgb),.09)"/>`;
    s += tekst(sx(z.van) + 5, T + 12, z.label, { fs: 10, kleur: 'var(--mu)', it: true });
  }
  // schaal: getallen per stap, of eigen woorden via labels:[[waarde,'tekst'],...]
  const schaal = A => A.labels || (() => { const o = []; for (let v = A.min; v <= A.max + 1e-9; v += A.stap) o.push([v, fmt(v)]); return o; })();
  for (const [v, t] of schaal(Y)) {
    s += `<line x1="${L}" y1="${r1(sy(v))}" x2="${W - R}" y2="${r1(sy(v))}" stroke="var(--bo)" stroke-width="${v === Y.min ? 0 : 1}"/>`;
    if (Y.labels) s += `<text transform="translate(${L - 6} ${r1(sy(v))}) rotate(-90)" text-anchor="${v === Y.min ? 'start' : v === Y.max ? 'end' : 'middle'}" font-size="10" fill="var(--mu)">${esc(t)}</text>`;
    else s += tekst(L - 6, sy(v) + 3.5, t, { anchor: 'end', fs: 10, kleur: 'var(--mu)' });
  }
  for (const [v, t] of schaal(X)) {
    s += `<line x1="${r1(sx(v))}" y1="${H - B}" x2="${r1(sx(v))}" y2="${H - B + 4}" stroke="var(--dk)" stroke-width="1"/>`;
    s += tekst(sx(v), H - B + 15, t, { anchor: v === X.min && X.labels ? 'start' : v === X.max && X.labels ? 'end' : 'middle', fs: 10, kleur: 'var(--mu)' });
  }
  s += `<path d="M${L} ${T}V${H - B}H${W - R}" fill="none" stroke="var(--dk)" stroke-width="1.3"/>`;
  s += tekst((L + W - R) / 2, H - 6, X.label, { anchor: 'middle', fs: 11, vet: true });
  s += `<text transform="translate(${Y.labels ? 11 : 11} ${r1((T + H - B) / 2)}) rotate(-90)" text-anchor="middle" font-size="11" font-weight="700" fill="var(--dk)">${esc(Y.label)}</text>`;
  spec.lijnen.forEach((l, i) => {
    const P = l.punten.map(([a, b]) => [sx(a), sy(b)]);
    let d = `M${r1(P[0][0])} ${r1(P[0][1])}`;
    if (l.glad && P.length > 2) {
      for (let k = 0; k < P.length - 1; k++) {
        const p0 = P[k - 1] || P[k], p1 = P[k], p2 = P[k + 1], p3 = P[k + 2] || p2;
        d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`;
      }
    } else d += P.slice(1).map(p => `L${r1(p[0])} ${r1(p[1])}`).join('');
    const zacht = l.zacht || i > 0;
    s += `<path d="${d}" fill="none" stroke="${zacht ? 'rgba(var(--or-rgb),.45)' : 'var(--or)'}" stroke-width="${zacht ? 2 : 2.6}" stroke-linecap="round" stroke-linejoin="round"${l.stippel ? ' stroke-dasharray="5 4"' : ''}/>`;
    if (l.label) {
      const [ex, ey] = P[P.length - 1];
      s += tekst(Math.min(ex, W - R) - 4, Math.max(T + 10, Math.min(H - B - 5, ey + (l.labelOnder ? 15 : -8))), l.label, { anchor: 'end', fs: 11, vet: true, kleur: zacht ? 'var(--mu)' : 'var(--or)' });
    }
  });
  for (const p of spec.punten || []) {
    const x = sx(p.x), y = sy(p.y);
    s += `<line x1="${r1(x)}" y1="${r1(y)}" x2="${r1(x)}" y2="${H - B}" stroke="var(--mu)" stroke-width="1" stroke-dasharray="2 3"/>`;
    s += `<circle cx="${r1(x)}" cy="${r1(y)}" r="4" fill="var(--s)" stroke="var(--or)" stroke-width="2"/>`;
    s += tekst(x + (p.links ? -8 : 8), y - 7, p.label, { anchor: p.links ? 'end' : 'start', fs: 10.5, halo: true, kleur: 'var(--dk)' });
  }
  return figuur(s, spec.cap);
}

// ── tijdlijn ────────────────────────────────────────────────────────────────
// { soort:'tijdlijn', aria, cap, van, tot, stap, gebeurtenissen:[{jaar,label,sub?}], periodes?:[{van,tot,label}] }
export function tijdlijn(spec) {
  eis(spec, 'aria', 'cap', 'van', 'tot', 'stap', 'gebeurtenissen');
  const W = 320, L = 14, R = 14, AS = 112;
  const sx = v => L + (v - spec.van) / (spec.tot - spec.van) * (W - L - R);
  let s = '';
  for (const p of spec.periodes || []) {
    s += `<rect x="${r1(sx(p.van))}" y="${AS - 7}" width="${r1(sx(p.tot) - sx(p.van))}" height="14" rx="3" fill="rgba(var(--or-rgb),.16)"/>`;
    s += tekst((sx(p.van) + sx(p.tot)) / 2, AS + 30, p.label, { anchor: 'middle', fs: 10, kleur: 'var(--mu)', it: true });
  }
  s += `<line x1="${L}" y1="${AS}" x2="${W - R}" y2="${AS}" stroke="var(--dk)" stroke-width="1.5"/>`;
  for (let v = Math.ceil(spec.van / spec.stap) * spec.stap; v <= spec.tot; v += spec.stap) {
    s += `<line x1="${r1(sx(v))}" y1="${AS - 3}" x2="${r1(sx(v))}" y2="${AS + 3}" stroke="var(--dk)"/>`;
    s += tekst(sx(v), AS + 16, v, { anchor: 'middle', fs: 9.5, kleur: 'var(--mu)' });
  }
  // gebeurtenissen om en om boven, en verder van de as als ze elkaar raken
  const bezet = { boven: [], onder: [] };
  const evs = [...spec.gebeurtenissen].sort((a, b) => a.jaar - b.jaar);
  let yMin = AS - 10, yMax = AS + ((spec.periodes || []).length ? 34 : 20);
  evs.forEach((e, i) => {
    const x = sx(e.jaar), kant = (spec.periodes && spec.periodes.length) ? 'boven' : (i % 2 ? 'onder' : 'boven');
    const w = Math.max(breedte(e.label, 10.5, true), breedte(e.sub || '', 9.5)) + 6;
    let x0 = Math.min(Math.max(x - w / 2, 2), W - 2 - w);
    let laag = 0; while (bezet[kant].some(b => b.laag === laag && !(x0 + w < b.a || x0 > b.b))) laag++;
    bezet[kant].push({ a: x0, b: x0 + w, laag });
    const y = kant === 'boven' ? AS - 22 - laag * 30 : AS + 44 + laag * 30;
    yMin = Math.min(yMin, y - (e.sub ? 22 : 12)); yMax = Math.max(yMax, y + (e.sub ? 6 : 4));
    s += `<line x1="${r1(x)}" y1="${AS}" x2="${r1(x)}" y2="${r1(kant === 'boven' ? y + 6 : y - 12)}" stroke="var(--mu)" stroke-width="1"/>`;
    s += `<circle cx="${r1(x)}" cy="${AS}" r="4" fill="var(--or)"/>`;
    s += tekst(x0 + w / 2, y - (e.sub ? 10 : 0), e.label, { anchor: 'middle', fs: 10.5, vet: true });
    if (e.sub) s += tekst(x0 + w / 2, y + 2, e.sub, { anchor: 'middle', fs: 9.5, kleur: 'var(--mu)' });
  });
  const top = Math.floor(yMin - 6), h = Math.ceil(yMax + 6 - top);
  return figuur(svgOpen(W, h, spec.aria).replace(`viewBox="0 0 ${W} ${h}"`, `viewBox="0 ${top} ${W} ${h}"`) + s, spec.cap);
}

// ── boom (argumentatie, opbouw) ─────────────────────────────────────────────
// { soort:'boom', aria, cap, top:'Stelling', kop?:'standpunt', takken:[{tekst, kop?, sub?:['...']}] }
export function boom(spec) {
  eis(spec, 'aria', 'cap', 'top', 'takken');
  const W = 320, n = spec.takken.length, gap = 8, bw = (W - 8 - gap * (n - 1)) / n;
  const hoogte = (w, kop, t, sterk) => 14 + (kop ? 13 : 0) + breek(t, 10.5, w - 14, sterk).length * 10.5 * 1.3;
  const rijH = Math.max(...spec.takken.map(tk => hoogte(bw, tk.kop, tk.tekst)));
  const vak = (x, y, w, kop, t, sterk, vastH) => {
    const fs = 10.5, regels = breek(t, fs, w - 14, sterk);
    const h = vastH || hoogte(w, kop, t, sterk);
    let s = `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="8" fill="${sterk ? 'var(--or)' : 'rgba(var(--or-rgb),.12)'}"/>`;
    if (kop) s += tekst(x + 8, y + 14, kop, { fs: 9.5, vet: true, kleur: sterk ? 'rgba(255,255,255,.8)' : 'var(--or)' });
    s += regelsTekst(x + 8, y + (kop ? 27 : 17), regels, { fs, vet: sterk, kleur: sterk ? '#fff' : 'var(--dk)' });
    return { s, h };
  };
  let s = '', y = 6;
  const t = vak(4, y, W - 8, spec.kop || 'standpunt', spec.top, true); s += t.s; y += t.h;
  const yTak = y + 22; let maxY = yTak;
  spec.takken.forEach((tk, i) => {
    const x = 4 + i * (bw + gap);
    s += `<path d="M${r1(W / 2)} ${r1(y)}V${r1(y + 10)}H${r1(x + bw / 2)}V${r1(yTak - 4)}" fill="none" stroke="var(--or)" stroke-width="1.5"/>` + pijlpunt(x + bw / 2, yTak, Math.PI / 2, 'var(--or)', 5);
    const v = vak(x, yTak, bw, tk.kop, tk.tekst, false, rijH); s += v.s; let yy = yTak + v.h;
    for (const sub of tk.sub || []) {
      s += `<line x1="${r1(x + 12)}" y1="${r1(yy)}" x2="${r1(x + 12)}" y2="${r1(yy + 14)}" stroke="var(--mu)" stroke-width="1"/>`;
      const regels = breek(sub, 9.5, bw - 22);
      s += regelsTekst(x + 18, yy + 22, regels, { fs: 9.5, kleur: 'var(--mu)' });
      yy += 18 + regels.length * 12.4;
    }
    maxY = Math.max(maxY, yy);
  });
  return figuur(svgOpen(W, Math.ceil(maxY + 8), spec.aria) + s, spec.cap);
}

// ── kring (cyclus) ──────────────────────────────────────────────────────────
// { soort:'kring', aria, cap, midden?:'...', stappen:[{kop, sub?}] }  (3 tot 6 stappen)
export function kring(spec) {
  eis(spec, 'aria', 'cap', 'stappen');
  const W = 320, H = 220, cx = 160, cy = 110, rx = 112, ry = 76, n = spec.stappen.length;
  if (n < 3 || n > 6) throw new Error('kring: 3 tot 6 stappen');
  const hoek = i => -Math.PI / 2 + i * 2 * Math.PI / n, pos = i => [cx + Math.cos(hoek(i)) * rx, cy + Math.sin(hoek(i)) * ry];
  let s = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="rgba(var(--or-rgb),.25)" stroke-width="10"/>`;
  for (let i = 0; i < n; i++) {
    const a1 = hoek(i) + 0.42, a2 = hoek(i + 1) - 0.42;
    const P = a => [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
    const [x1, y1] = P(a1), [x2, y2] = P(a2), [xm, ym] = P((a1 + a2) / 2);
    s += `<path d="M${r1(x1)} ${r1(y1)}Q${r1(2 * xm - (x1 + x2) / 2)} ${r1(2 * ym - (y1 + y2) / 2)} ${r1(x2)} ${r1(y2)}" fill="none" stroke="var(--or)" stroke-width="2"/>`;
    const [xb, yb] = P(a2 - 0.05); s += pijlpunt(x2, y2, Math.atan2(y2 - yb, x2 - xb));
  }
  spec.stappen.forEach((st, i) => {
    const [x, y] = pos(i), w = Math.max(breedte(st.kop, 11, true), breedte(st.sub || '', 9.5)) + 16, h = st.sub ? 32 : 20;
    const x0 = Math.min(Math.max(x - w / 2, 2), W - 2 - w);
    s += `<rect x="${r1(x0)}" y="${r1(y - h / 2)}" width="${r1(w)}" height="${h}" rx="${h / 2}" fill="var(--s)" stroke="var(--or)" stroke-width="1.5"/>`;
    s += tekst(x0 + w / 2, y + (st.sub ? -2 : 4), st.kop, { anchor: 'middle', fs: 11, vet: true });
    if (st.sub) s += tekst(x0 + w / 2, y + 10, st.sub, { anchor: 'middle', fs: 9.5, kleur: 'var(--mu)' });
  });
  if (spec.midden) s += regelsTekst(cx, cy - 2, breek(spec.midden, 10.5, 120), { anchor: 'middle', fs: 10.5, kleur: 'var(--mu)' });
  return figuur(svgOpen(W, H, spec.aria) + s, spec.cap);
}

export const MAKERS = { fragment, grafiek, tijdlijn, boom, kring };
export function maak(spec) { const f = MAKERS[spec.soort]; if (!f) throw new Error(`onbekende soort "${spec.soort}" (kies: ${Object.keys(MAKERS).join(', ')})`); return f(spec); }

// ── sjabloon-detector ───────────────────────────────────────────────────────
// Redenen waarom een figuur eruitziet als een standaard AI-plaatje.
export function generiek(svg) {
  const r = [];
  const cirkels = [...svg.matchAll(/<circle\b[^>]*\bcx="([\d.]+)"[^>]*\bcy="([\d.]+)"[^>]*\br="([\d.]+)"/g)].map(m => ({ x: +m[1], y: +m[2], r: +m[3] }));
  const teksten = [...svg.matchAll(/<text\b[^>]*\bx="([\d.]+)"[^>]*\by="([\d.]+)"[^>]*>([^<]*)</g)].map(m => ({ x: +m[1], y: +m[2], t: m[3].trim() }));
  const binnen = (t, c) => Math.abs(t.x - c.x) < c.r * 0.9 && Math.abs(t.y - 4 - c.y) < c.r * 0.9;
  const nummers = teksten.filter(t => /^\d$/.test(t.t) && cirkels.some(c => c.r <= 16 && binnen(t, c))).length;
  if (nummers >= 3) r.push('genummerd rijtje (cijfers in rondjes): dat is een lijst, geen figuur');
  const bellen = cirkels.filter(c => c.r >= 14 && teksten.some(t => /[a-z]{3}/i.test(t.t) && binnen(t, c))).length;
  if (bellen >= 2) r.push(`${bellen} begrippen in een rondje: teken het verband zelf (een grafiek, een tekstfragment, een proces)`);
  const stip = cirkels.filter(c => c.r >= 8 && c.r <= 26);
  if (stip.length >= 3 && /<line\b/.test(svg) && new Set(stip.map(c => c.y)).size <= 2 && bellen + nummers >= 1) r.push('stippen met lijntjes ertussen (boompje of tijdlijn zonder schaal)');
  const streep = [...svg.matchAll(/<line\b[^>]*x1="([\d.]+)"[^>]*y1="([\d.]+)"[^>]*x2="([\d.]+)"[^>]*y2="([\d.]+)"/g)].filter(m => m[2] === m[4] && +m[3] - +m[1] < 140).length;
  if (streep >= 4 && !/<path\b/.test(svg)) r.push('rij korte streepjes onder woorden: een opgemaakte lijst');
  return r;
}
