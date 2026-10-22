// Afleiders voor de begripsvragen (build-questions.js en verbeter-afleiders.js).
// Een goede afleider lijkt op het juiste antwoord: ongeveer even lang, dezelfde
// vorm (zin of rijtje), liefst uit hetzelfde domein. Willekeurige afleiders uit
// het hele vak ("Frameshiftmutatie" bij een vraag over validiteit) streep je weg
// zonder de stof te kennen.
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
// Stam van een begrip om te zien of het in een tekst staat (oxidatie → "oxidatiegetal").
const stam = t => { const n = norm(t).split(' ').filter(w => w.length >= 4); return n.length ? n.sort((a, b) => b.length - a.length)[0].slice(0, 7) : ''; };
const bevat = (tekst, term) => { const s = stam(term); return s.length >= 5 && norm(tekst).includes(s); };
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
    if (opts.soort === 'term' && opts.def && bevat(opts.def, x)) continue;                 // afleider staat in de omschrijving
    let s = Math.abs(Math.log(Math.max(4, x.length) / lj)) * 1.6;
    const v = vorm(x); for (let i = 0; i < 3; i++) if (v[i] !== vj[i]) s += i === 0 ? 1.4 : .35;
    if (opts.soort === 'term') s += Math.abs(x.split(/\s+/).length - String(juist).split(/\s+/).length) * .35;
    if (!k.dom) s += opts.dichtbij ? 1.2 : .3;
    scores.push([s + r() * .25, x, nx]);
  }
  scores.sort((a, b) => a[0] - b[0]);
  const uit = [];
  for (const [, x, nx] of scores) { if (gezien.has(nx)) continue; gezien.add(nx); uit.push(x); if (uit.length === 3) break; }
  return uit.length === 3 ? uit : null;
}
// Vraag is een weggever: het begrip staat (bijna letterlijk) in de omschrijving.
const weggever = (term, def) => bevat(def, term);

module.exports = { kies, weggever, schud, rng, norm };
