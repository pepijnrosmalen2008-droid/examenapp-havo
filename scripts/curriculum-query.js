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

// ══ Querytaal ("interne SQL voor onderwijs") ══
// Elk leerdoel → platte, queryebare record. Velden zonder store (summary/animatie/
// flashcards) staan bewust op 'ontbreekt' — dat maakt de content-backlog zichtbaar.
function record(r) {
  const ld = r.ld, m = r.m;
  return {
    id: ld.id, titel: ld.titel, vak: r.vak,
    gewicht: ld.examenrelevantie, review: (ld._meta && ld._meta.reviewStatus) || 'draft',
    vragen: m.n, airready: m.aiReady, confidence: Math.round(m.conf * 100), syllabus: Math.round(m.cov * 100),
    misconcepties: (ld.veelgemaakteFouten || []).length,
    voorbeelden: (ld.voorbeelden || []).length, voorkennis: (ld.voorkennis || []).length,
    _concepten: (ld.concepten || []).map(norm).join(' | '),
    // content-stores bestaan nog niet → alles 'ontbreekt' (eerlijk: dit ís de backlog)
    has_summary: false, has_animatie: false, has_flashcards: false, has_examens: m.n > 0,
    has_voorbeelden: (ld.voorbeelden || []).length > 0,
  };
}
const FALIAS = { examweight: 'gewicht', questioncount: 'vragen', reviewstatus: 'review', subject: 'vak', misconceptions: 'misconcepties', coverage: 'syllabus', concept: '_concepten' };
function evalClause(cl, rec) {
  let m;
  if (m = cl.match(/^missing\((\w+)\)$/i)) return !rec['has_' + m[1].toLowerCase()];
  if (m = cl.match(/^has\((\w+)\)$/i)) return !!rec['has_' + m[1].toLowerCase()];
  m = cl.match(/^(\w+)\s*(<=|>=|!=|=|<|>)\s*(.+)$/); if (!m) return false;
  let [, f, op, v] = m; f = f.toLowerCase(); f = FALIAS[f] || f; v = v.trim().replace(/^["']|["']$/g, '');
  let val = rec[f]; if (val === undefined) return false;
  if (f === '_concepten') return String(val).includes(norm(v)); // concept=... → lidmaatschap
  const num = parseFloat(v), isNum = !isNaN(num) && typeof val === 'number';
  const a = isNum ? val : String(val).toLowerCase(), b = isNum ? num : String(v).toLowerCase();
  return { '=': a == b, '!=': a != b, '<': a < b, '>': a > b, '<=': a <= b, '>=': a >= b }[op];
}
const evalExpr = (expr, rec) => expr.split(/\s+OR\s+/i).some(g => g.split(/\s+AND\s+/i).every(c => evalClause(c.trim(), rec)));

// Opgeslagen queries = "het dashboard". Uitbreiden is één regel.
const SAVED = {
  // curriculum
  'dun-vragen': { q: 'vragen<8', uitleg: 'leerdoelen met minder dan 8 vragen' },
  'geen-voorbeelden': { q: 'voorbeelden=0', uitleg: 'leerdoelen zonder voorbeelden' },
  'nog-draft': { q: 'review=draft', uitleg: 'nog niet gereviewd' },
  'lage-ai-ready': { q: 'airready<85', uitleg: 'lage AI-Ready score' },
  // examen / onderwijs
  'hoog-gewicht-weinig-vragen': { q: 'gewicht=hoog AND vragen<10', uitleg: 'high-stakes maar onderbedeeld' },
  'hoog-gewicht-lage-ai': { q: 'gewicht=hoog AND airready<90', uitleg: 'high-stakes maar niet generatie-klaar' },
  'veel-misconcepties': { q: 'misconcepties>=2', uitleg: 'leerdoelen met ≥2 gedocumenteerde misconcepties' },
  'onvolledige-syllabusdekking': { q: 'syllabus<100', uitleg: 'niet elk concept door een vraag gedekt' },
  // content-backlog (stores bestaan nog niet → tonen wat er gegenereerd moet worden)
  'geen-samenvatting-klaar': { q: 'missing(summary) AND review=approved AND gewicht=hoog', uitleg: 'approved high-stakes zonder samenvatting-view' },
  'klaar-voor-generatie': { q: 'review=approved AND airready>=90', uitleg: 'mag de Content Factory in' },
};

if (flag('offlevel')) {
  // status=off_level — vragen die vermoedelijk niet op dit niveau thuishoren (owner-review).
  const byReason = {}; let total = 0;
  for (const [vid, kp] of Object.entries(KOPP)) for (const e of Object.values(kp)) if (e.status === 'off_level') {
    total++; const r = `${vid} · ${e.offReason || 'onbekend'}`; byReason[r] = (byReason[r] || 0) + 1;
  }
  console.log(`\nstatus=off_level: ${total} vraag/vragen (vermoedelijk verkeerd niveau in de bank):`);
  for (const [r, n] of Object.entries(byReason).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}×  ${r}`);
  console.log(`\n(eigenschap van de VRAAG, lo:null — geen valse leerdoel-koppeling. Voor owner-review.)\n`);
  process.exit(0);
}
if (flag('list')) {
  console.log('\nOpgeslagen queries (--saved <naam>):');
  for (const [n, s] of Object.entries(SAVED)) console.log(`  ${n.padEnd(30)} ${s.uitleg}\n    ${' '.repeat(30)}${s.q}`);
  console.log('\nVelden: gewicht(hoog/midden/laag) review(draft/reviewed/approved) vak vragen airready confidence syllabus misconcepties voorbeelden voorkennis concept');
  console.log('Ops: = != < > <= >= · missing(summary|animatie|flashcards|examens) · has(...) · AND / OR');
  console.log('NB: summary/animatie/flashcards hebben nog GEEN store → missing() = altijd waar (dit ís de backlog).\n');
  process.exit(0);
}
const savedName = flag('saved');
const whereExpr = flag('where') || (savedName && SAVED[savedName] && SAVED[savedName].q);
if (savedName && !SAVED[savedName]) { console.error(`onbekende saved query: ${savedName} (zie --list)`); process.exit(1); }
if (whereExpr) {
  let rows = all.filter(r => evalExpr(String(whereExpr), record(r))).sort((a, b) => b.m.aiReady - a.m.aiReady);
  if (flag('json')) { console.log(JSON.stringify(rows.map(r => record(r)), null, 1)); process.exit(0); }
  console.log(`\nquery: ${savedName ? savedName + '  (' + whereExpr + ')' : whereExpr}`);
  console.log(`${rows.length} leerdoel(en):`);
  console.log('  ' + 'id'.padEnd(9) + 'gew'.padEnd(7) + 'review'.padEnd(10) + 'vr'.padStart(4) + 'AI'.padStart(5) + 'mis'.padStart(4) + '  titel');
  for (const r of rows) { const c = record(r); console.log('  ' + c.id.padEnd(9) + (c.gewicht || '').padEnd(7) + c.review.padEnd(10) + String(c.vragen).padStart(4) + (c.airready + '%').padStart(5) + String(c.misconcepties).padStart(4) + '  ' + c.titel); }
  console.log('');
  process.exit(0);
}

// ── (legacy) flag-filters ──
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
