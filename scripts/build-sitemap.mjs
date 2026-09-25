#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// build-sitemap.mjs · genereert sitemap.xml uit de pagina's zelf
//
// Bron van waarheid is de HTML: elke pagina met een canonical en zonder
// noindex komt erin, onder zijn canonical-URL (dus redirect-stubs zoals
// havo-ak.html → havo-aardrijkskunde.html vallen vanzelf weg, en /havo, /vwo,
// /vmbo komen via hun redirect-pagina's binnen). lastmod = laatste git-commit
// van het bestand. Zo kan de sitemap nooit meer uit de pas lopen met de site.
//
//   node scripts/build-sitemap.mjs          → schrijft sitemap.xml
//   node scripts/build-sitemap.mjs --check  → exit 1 als sitemap.xml verouderd is
//   node scripts/build-sitemap.mjs --urls   → print alleen de URL-lijst
// ═══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://slagio.nl';
// Bewust níét in de sitemap, ook al hebben ze geen noindex.
const EXCLUDE = new Set(['link.html']);

function gitDate(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (out) return out;
  } catch (e) {}
  return new Date().toISOString().slice(0, 10);
}

function meta(html) {
  const robots = (html.match(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/i) || [])[1] || '';
  const canon = (html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) || [])[1] || '';
  return { noindex: /noindex/i.test(robots), canonical: canon };
}

function normalize(url) {
  if (!url.startsWith(ORIGIN)) return null;          // externe canonical → niet onze pagina
  let p = url.slice(ORIGIN.length) || '/';
  if (!p.startsWith('/')) p = '/' + p;
  return ORIGIN + p;
}

// Prioriteit + wijzigingsfrequentie per soort pagina.
function rank(loc) {
  const p = loc.slice(ORIGIN.length);
  if (p === '/') return ['weekly', '1.0'];
  if (/^\/(havo|vwo|vmbo)$/.test(p)) return ['weekly', '0.95'];
  if (p === '/vakken/') return ['monthly', '0.9'];
  if (/examenrooster|examenuitslag/.test(p)) return ['monthly', '0.9'];
  if (/calculator/.test(p)) return ['monthly', '0.85'];
  if (/-domein-/.test(p)) return ['monthly', '0.75'];
  if (/^\/vakken\/(havo|vwo|vmbo)-/.test(p)) return ['monthly', '0.8'];
  if (/faq\.html$/.test(p)) return ['monthly', '0.8'];
  if (/docenten\.html$|slagio-school\.html$/.test(p)) return ['monthly', '0.75'];
  if (/over-ons\.html$/.test(p)) return ['monthly', '0.7'];
  if (/privacy\.html$|voorwaarden\.html$/.test(p)) return ['yearly', '0.3'];
  return ['monthly', '0.6'];
}

function collect() {
  const files = [
    ...fs.readdirSync(ROOT).filter(f => f.endsWith('.html')),
    ...fs.readdirSync(path.join(ROOT, 'vakken')).filter(f => f.endsWith('.html')).map(f => 'vakken/' + f),
  ].filter(f => !EXCLUDE.has(f));

  const byLoc = new Map();
  for (const file of files) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const { noindex, canonical } = meta(html);
    if (noindex) continue;
    let loc = canonical ? normalize(canonical) : ORIGIN + '/' + file.replace(/(^|\/)index\.html$/, '$1');
    if (!loc) continue;
    if (loc === ORIGIN) loc = ORIGIN + '/';
    const last = gitDate(file);
    // Meerdere bestanden met dezelfde canonical → één entry, jongste datum wint.
    const prev = byLoc.get(loc);
    if (!prev || last > prev.lastmod) byLoc.set(loc, { loc, lastmod: last });
  }
  // Volgorde: home, niveaus, info, vakken-overzicht, dan de rest alfabetisch.
  const order = l => {
    const p = l.slice(ORIGIN.length);
    if (p === '/') return '0';
    if (/^\/(havo|vwo|vmbo)$/.test(p)) return '1' + p;
    if (!p.startsWith('/vakken/')) return '2' + p;
    if (p === '/vakken/') return '3';
    return '4' + p;
  };
  return [...byLoc.values()].sort((a, b) => order(a.loc).localeCompare(order(b.loc)));
}

function render(entries) {
  const rows = entries.map(({ loc, lastmod }) => {
    const [freq, prio] = rank(loc);
    return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${freq}</changefreq><priority>${prio}</priority></url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Automatisch gegenereerd door scripts/build-sitemap.mjs — niet met de hand bewerken. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows.join('\n')}
</urlset>
`;
}

const entries = collect();
const xml = render(entries);
const target = path.join(ROOT, 'sitemap.xml');
const arg = process.argv[2];

if (arg === '--urls') {
  entries.forEach(e => console.log(e.loc));
} else if (arg === '--check') {
  const cur = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  if (cur !== xml) { console.error('sitemap.xml is verouderd — draai: node scripts/build-sitemap.mjs'); process.exit(1); }
  console.log(`sitemap.xml actueel (${entries.length} URL's)`);
} else {
  fs.writeFileSync(target, xml);
  console.log(`sitemap.xml geschreven: ${entries.length} URL's`);
}
