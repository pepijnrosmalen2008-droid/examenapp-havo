#!/usr/bin/env node
/**
 * curriculum-query.js — de Query Engine (READ-ONLY).
 *
 * De enige laag waar engines doorheen lezen; geen enkele generator loopt zelf
 * door JSON-bestanden. Input = filters, output = leerdoel-nodes + afgeleide metrics.
 *
 *   node scripts/curriculum-query.js <niveau> [filters...]
 * Filters:
 *   --vak <id>              beperk tot een vak
 *   --gewicht hoog|midden|laag
 *   --review draft|reviewed|approved
 *   --concept <term>        leerdoelen die dit concept gebruiken (via concept-graaf)
 *   --ai-ready-min <0-100>  minimale AI-Ready score
 *   --vragen-min <n> / --vragen-max <n>
 *   --misconcepties         toon i.p.v. leerdoelen alle misconcepties (bv. + --concept enzym)
 *   --json                  machine-leesbare output (voor andere engines)
 *
 * Voorbeelden:
 *   ... havo --gewicht hoog --ai-ready-min 90 --review reviewed --concept energie
 *   ... havo --misconcepties --concept enzym
 *   ... havo --gewicht hoog --vragen-max 10        (onderbedeelde high-stakes leerdoelen)
 */
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const A = process.argv.slice(2);
const niveau = A.find(x => !x.startsWith('--')) || 'havo';
const flag = n => { const i = A.indexOf('--' + n); return i >= 0 ? (A[i + 1] && !A[i + 1].startsWith('--') ? A[i + 1] : true) : undefined; };

const kg = {}; new Function('g', read(`knowledge-${niveau}.js`) + '\ng.L=LEERDOELEN;')(kg);
const LEERDOELEN = kg.L;
let KOPP = {}; try { const c = {}; new Function('g', read(`knowledge-koppeling-${niveau}.js`) + '\ng.K=LO_KOPPELING;')(c); KOPP = c.K || {}; } catch (e) {}
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\([^)]*\)/g, '').trim();

// ── afgeleide metrics per leerdoel (uit de koppeling-sidecar) ──
const stat = {}; // lo → {n, confSum, low, via:Set}
for (const kp of Object.values(KOPP)) for (const e of Object.values(kp)) {
  const t = stat[e.lo] = stat[e.lo] || { n: 0, confSum: 0, low: 0, via: new Set() };
  t.n++; t.confSum += e.confidence; if (e.confidence < 0.70) t.low++;
  if (e.via) for (const c of String(e.via).split('+')) t.via.add(norm(c));
}
function metrics(ld) {
  const t = stat[ld.id] || { n: 0, confSum: 0, low: 0, via: new Set() };
  const conf = t.n ? t.confSum / t.n : 0;
  const cs = (ld.concepten || []).map(norm).filter(Boolean);
  const cov = cs.length ? cs.filter(c => t.via.has(c)).length / cs.length : 1;
  const ai = t.n ? (0.40 * conf + 0.25 * cov + 0.20 * Math.min(1, t.n / 12) + 0.15 * (1 - t.low / t.n)) : 0;
  return { n: t.n, conf, cov, aiReady: Math.round(ai * 100) };
}

// ── alle leerdoelen platslaan ──
const all = [];
for (const [domKey, block] of Object.entries(LEERDOELEN)) {
  const vak = domKey.split('_')[0];
  for (const ld of (block.leerdoelen || [])) all.push({ ld, vak, dom: domKey, m: metrics(ld) });
}

// ── filters toepassen ──
let rows = all;
if (flag('vak')) rows = rows.filter(r => r.vak === flag('vak'));
if (flag('gewicht')) rows = rows.filter(r => r.ld.examenrelevantie === flag('gewicht'));
if (flag('review')) rows = rows.filter(r => (r.ld._meta && r.ld._meta.reviewStatus) === flag('review'));
if (flag('concept')) { const q = norm(flag('concept')); rows = rows.filter(r => (r.ld.concepten || []).some(c => norm(c).includes(q))); }
if (flag('ai-ready-min') !== undefined) rows = rows.filter(r => r.m.aiReady >= +flag('ai-ready-min'));
if (flag('vragen-min') !== undefined) rows = rows.filter(r => r.m.n >= +flag('vragen-min'));
if (flag('vragen-max') !== undefined) rows = rows.filter(r => r.m.n <= +flag('vragen-max'));
rows.sort((a, b) => b.m.aiReady - a.m.aiReady || b.m.n - a.m.n);

// ── output ──
if (flag('misconcepties')) {
  const out = [];
  for (const r of rows) for (const mis of (r.ld.veelgemaakteFouten || [])) out.push({ lo: r.ld.id, titel: r.ld.titel, misconceptie: mis });
  if (flag('json')) { console.log(JSON.stringify(out, null, 1)); process.exit(0); }
  console.log(`\n${out.length} misconceptie(s):`);
  for (const o of out) console.log(`  • [${o.lo}] ${o.misconceptie}`);
} else {
  if (flag('json')) { console.log(JSON.stringify(rows.map(r => ({ id: r.ld.id, titel: r.ld.titel, vak: r.vak, gewicht: r.ld.examenrelevantie, review: r.ld._meta && r.ld._meta.reviewStatus, ...r.m })), null, 1)); process.exit(0); }
  console.log(`\n${rows.length} leerdoel(en):`);
  console.log('  ' + 'id'.padEnd(9) + 'gew'.padEnd(7) + 'review'.padEnd(10) + 'vr'.padStart(4) + 'AI'.padStart(5) + '  titel');
  for (const r of rows) console.log('  ' + r.ld.id.padEnd(9) + (r.ld.examenrelevantie || '').padEnd(7) + ((r.ld._meta && r.ld._meta.reviewStatus) || '').padEnd(10) + String(r.m.n).padStart(4) + (r.m.aiReady + '%').padStart(5) + '  ' + r.ld.titel);
}
console.log('');
