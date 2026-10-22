// Afleiders voor de begripsvragen (build-questions.js en verbeter-afleiders.js).
// Een goede afleider lijkt op het juiste antwoord: ongeveer even lang, dezelfde
// vorm (zin of rijtje), liefst uit hetzelfde domein. Willekeurige afleiders uit
// het hele vak ("Frameshiftmutatie" bij een vraag over validiteit) streep je weg
// zonder de stof te kennen.
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
// Stam van een begrip om te zien of het in een tekst staat (oxidatie → "oxidatiegetal").
const stam = t => { const n = norm(t).split(' ').filter(w => w.length >= 4); return n.length ? n.sort((a, b) => b.length - a.length)[0].slice(0, 7) : ''; };
const bevat = (tekst, term) => { const s = stam(term); return s.length >= 5 && norm(tekst).includes(s); };
// Bijna hetzelfde begrip (enkelvoud/meervoud, spelling): "Mitochondrion" en "Mitochondriën"
// zijn samen twee goede antwoorden. Gedeeld begin van 7+ letters of 1-2 letters verschil.
function afstand(a, b) { if (Math.abs(a.length - b.length) > 2) return 9; const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) { let p = d[0]; d[0] = i; for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = t; } } return d[b.length]; }
const bijnaGelijk = (x, y) => { const a = norm(x).replace(/ /g, ''), b = norm(y).replace(/ /g, ''); if (!a || !b) return false;
  let k = 0; while (k < a.length && k < b.length && a[k] === b[k]) k++; return k >= Math.min(7, Math.min(a.length, b.length) - 1) || afstand(a, b) <= 2; };
// Twee omschrijvingen die grotendeels dezelfde woorden gebruiken (dubbel begrip met dezelfde betekenis).
const zelfdeBetekenis = (x, y) => { const A = new Set(norm(x).split(' ').filter(w => w.length > 3)), B = new Set(norm(y).split(' ').filter(w => w.length > 3));
  if (A.size < 2 || B.size < 2) return false; let n = 0; A.forEach(w => { if (B.has(w)) n++; }); return n / Math.min(A.size, B.size) >= .6; };
const isLijst = s => { s = String(s); return (s.match(/,/g) || []).length >= 2 && s.length < 80 && !/\b(is|zijn|wordt|worden|heeft|hebben|kan|gaat|maakt|geeft|is)\b/i.test(s); };
const vorm = s => [isLijst(s) ? 'L' : 'Z', /^[A-Z]/.test(String(s)) ? 'H' : 'k', /:/.test(String(s)) ? 'd' : '-'].join('');
function rng(seed) { let h = 2166136261; for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; }
function schud(a, r) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// kies(juist, kandidaten, opts) → 3 afleiders of null
//   kandidaten: [{x, dom}]  (dom=true als uit hetzelfde domein)
//   opts.term: het begrip uit de vraag (afleiders mogen het niet bevatten)
//   opts.soort: 'def' | 'term'
function kies(juist, kand, opts) {
  const r = rng((opts.seed || '') + juist), nj = norm(juist), vj = vorm(juist), lj = Math.max(4, String(juist).length);
  const gezien = new Set([nj]);
  const scores = [];
  for (const k of kand) {
    const x = String(k.x || '').trim(), nx = norm(x);
    if (!nx || gezien.has(nx)) continue;
    if (opts.term && opts.soort === 'def' && bevat(x, opts.term)) continue;                // afleider beschrijft ook het begrip
    if (opts.soort === 'term' && (nx.includes(nj) || nj.includes(nx))) continue;           // "Vraag" naast "Vraagcurve"
    if (opts.soort === 'term' && bijnaGelijk(x, juist)) continue;                             // enkelvoud/meervoud van hetzelfde begrip
    if (opts.soort === 'def' && zelfdeBetekenis(x, juist)) continue;                          // tweede omschrijving van hetzelfde
    if (opts.soort === 'term' && opts.def && bevat(opts.def, x)) continue;                 // afleider staat in de omschrijving
    let s = Math.abs(Math.log(Math.max(4, x.length) / lj)) * 1.6;
    const v = vorm(x); for (let i = 0; i < 3; i++) if (v[i] !== vj[i]) s += i === 0 ? 1.4 : .35;
    if (opts.soort === 'term') s += Math.abs(x.split(/\s+/).length - String(juist).split(/\s+/).length) * .35;
    if (!k.dom) s += opts.dichtbij ? 1.2 : .3;
    scores.push([s + r() * .25, x, nx]);
  }
  scores.sort((a, b) => a[0] - b[0]);
  const uit = [];
  for (const [, x, nx] of scores) { if (gezien.has(nx) || uit.some(u => opts.soort === 'term' ? bijnaGelijk(u, x) : zelfdeBetekenis(u, x))) continue; gezien.add(nx); uit.push(x); if (uit.length === 3) break; }
  return uit.length === 3 ? uit : null;
}
// Vraag is een weggever: het begrip staat (bijna letterlijk) in de omschrijving.
const weggever = (term, def) => bevat(def, term);

module.exports = { kies, weggever, schud, rng, norm };
