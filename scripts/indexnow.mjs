#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// indexnow.mjs · meldt nieuwe/gewijzigde pagina's direct aan zoekmachines
//
// IndexNow wordt gedeeld door Bing (en daarmee ChatGPT-search/Copilot),
// Yandex, Seznam en Naver: één ping en ze komen de pagina meteen ophalen i.p.v.
// te wachten tot de crawler langskomt. De sleutel staat als <key>.txt in de
// root (zo bewijzen we dat slagio.nl van ons is).
//
//   node scripts/indexnow.mjs --changed <base-sha> <head-sha>   gewijzigde .html
//   node scripts/indexnow.mjs --all                             hele sitemap
//   node scripts/indexnow.mjs <url> [<url>...]                  losse URL's
//   --dry-run                                                   alleen tonen
// ═══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOST = 'slagio.nl';
const ORIGIN = 'https://' + HOST;

const keyFile = fs.readdirSync(ROOT).find(f => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) { console.error('Geen IndexNow-sleutelbestand (<32 hex>.txt) in de root.'); process.exit(1); }
const KEY = keyFile.replace('.txt', '');

const args = process.argv.slice(2);
const dry = args.includes('--dry-run');
const rest = args.filter(a => a !== '--dry-run');

// Alleen URL's die ook echt in de sitemap staan (dus indexeerbaar zijn).
const sitemapUrls = new Set(
  (fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').match(/<loc>[^<]+/g) || []).map(s => s.slice(5))
);

function fileToUrls(file) {
  // Zoek de canonical van het bestand; die is de URL die we melden.
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) return [];
  const html = fs.readFileSync(abs, 'utf8');
  const canon = (html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) || [])[1];
  let url = canon || ORIGIN + '/' + file.replace(/(^|\/)index\.html$/, '$1');
  if (url === ORIGIN) url = ORIGIN + '/';
  return sitemapUrls.has(url) ? [url] : [];
}

let urls = [];
if (rest[0] === '--all') {
  urls = [...sitemapUrls];
} else if (rest[0] === '--changed') {
  const [, base, head = 'HEAD'] = rest;
  // Eerste push of onbekende basis → vergelijk met de vorige commit.
  const diffArgs = !base || /^0+$/.test(base) ? [head + '~1', head] : [base, head];
  let files = [];
  try {
    files = execFileSync('git', ['diff', '--name-only', '--diff-filter=AMR', ...diffArgs], { cwd: ROOT, encoding: 'utf8' })
      .split('\n').filter(f => f.endsWith('.html'));
  } catch (e) { console.error('git diff mislukt:', e.message); }
  urls = [...new Set(files.flatMap(fileToUrls))];
} else {
  urls = rest.filter(u => u.startsWith(ORIGIN));
}

if (!urls.length) { console.log('IndexNow: niets te melden.'); process.exit(0); }

const body = { host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList: urls.slice(0, 10000) };
console.log(`IndexNow: ${urls.length} URL('s) melden${dry ? ' (dry-run)' : ''}`);
urls.slice(0, 12).forEach(u => console.log('  ' + u));
if (urls.length > 12) console.log(`  … en ${urls.length - 12} meer`);
if (dry) process.exit(0);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});
// 200 = ontvangen, 202 = ontvangen (sleutel wordt nog gecontroleerd).
console.log(`IndexNow antwoord: HTTP ${res.status}`);
if (res.status >= 400) { console.error(await res.text()); process.exit(1); }
