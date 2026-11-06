#!/usr/bin/env node
// figuur.mjs · maakt figuren voor samenvattingen uit een spec, en keurt bestaande figuren.
//   node scripts/figuur.mjs <spec.json>           → markup op stdout (spec mag ook een lijst zijn)
//   node scripts/figuur.mjs --keur <bestand.html>  → welke figuren zien eruit als een sjabloon
//   node scripts/figuur.mjs --overzicht            → per leerdoel in content-pending/ het aantal sjabloonfiguren
// Soorten en voorbeelden: docs/FIGUREN.md
import fs from 'node:fs';
import path from 'node:path';
import { maak, generiek } from './lib/figuur.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const figs = h => [...h.matchAll(/<div class="sam-figure[^"]*">[\s\S]*?<\/svg>/g)].map(m => m[0]);
const [a, b] = process.argv.slice(2);
if (!a) { console.error('gebruik: node scripts/figuur.mjs <spec.json> | --keur <html> | --overzicht'); process.exit(2); }
if (a === '--keur') {
  const lijst = figs(fs.readFileSync(b, 'utf8')); let n = 0;
  lijst.forEach((f, i) => { const r = generiek(f); if (r.length) { n++; console.log(`figuur ${i + 1}: ${r.join(' · ')}`); } });
  console.log(`${n}/${lijst.length} figuren zien eruit als een sjabloon`); process.exit(0);
}
if (a === '--overzicht') {
  const dir = path.join(ROOT, 'content-pending'), rij = [];
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.html'))) {
    const l = figs(fs.readFileSync(path.join(dir, f), 'utf8')), s = l.filter(x => generiek(x).length).length;
    rij.push([f.replace('.html', ''), s, l.length]);
  }
  rij.sort((x, y) => y[1] - x[1]);
  const tot = rij.reduce((t, r) => t + r[1], 0), alle = rij.reduce((t, r) => t + r[2], 0);
  rij.filter(r => r[1]).forEach(r => console.log(`${r[0].padEnd(16)} ${r[1]}/${r[2]}`));
  console.log(`\n${tot}/${alle} figuren in ${rij.filter(r => r[1]).length} leerdoelen zien eruit als een sjabloon`); process.exit(0);
}
const spec = JSON.parse(fs.readFileSync(a, 'utf8'));
for (const s of [].concat(spec)) console.log(maak(s));
