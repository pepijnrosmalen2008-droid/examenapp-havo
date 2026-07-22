#!/usr/bin/env node
/**
 * evaluation-engine.js — Evaluation Engine (ANALYZER). READ-ONLY, beslist NIET.
 *
 * Meet kwaliteit; beslist niets. Retourneert per vak { score, issues, warnings,
 * metrics }. De PIPELINE beslist daarna (bv. score>=95 AND issues=0), zodat de
 * evaluator onafhankelijk blijft van beleid.
 *
 * Structureel (nu, regels): 4 opties · precies één geldig antwoord · geen dubbele
 * opties · uitleg · moeilijkheidsveld · lengte-bias · antwoordpositie-verdeling ·
 * dubbele vragen · leerdoel-koppeling.
 * Inhoudelijk (model/mens, pluggable): zie docs/QUALITY-MODEL-vraag.md.
 *
 *   node scripts/evaluation-engine.js havo [--vak bi] [--json] [--baseline]
 */
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const A = process.argv.slice(2);
const niveau = A.find(x => !x.startsWith('--')) || 'havo';
const flag = n => A.includes('--' + n) ? (A[A.indexOf('--' + n) + 1] && !A[A.indexOf('--' + n) + 1].startsWith('--') ? A[A.indexOf('--' + n) + 1] : true) : undefined;

const dg = {}; new Function('g', read(`data-${niveau}.js`) + `\ng.V=(typeof VAKKEN!=='undefined'?VAKKEN:VAKKEN_VWO);`)(dg);
let KOPP = {}; try { const c = {}; new Function('g', read(`knowledge-koppeling-${niveau}.js`) + '\ng.K=LO_KOPPELING;')(c); KOPP = c.K || {}; } catch (e) {}
const norm = s => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
const rd = (x, d = 3) => +x.toFixed(d);

function evalVak(vak) {
  const kp = KOPP[vak.id] || {};
  let n = 0, opt4 = 0, geldig = 0, geenDup = 0, uitleg = 0, diff = 0, geenLengte = 0, dupQ = 0;
  const cPos = [0, 0, 0, 0]; const stems = {}; const status = { matched: 0, unmatched: 0, off_level: 0, geen: 0 };
  for (const d of vak.domeinen) for (const q of (d.sv || [])) {
    n++;
    const o = q.o || q.a || [];
    if (o.length === 4) opt4++;
    const ok = Number.isInteger(q.c) && q.c >= 0 && q.c < o.length; if (ok) { geldig++; cPos[q.c]++; }
    if (new Set(o.map(norm)).size === o.length) geenDup++;
    if ((q.u || '').length > 12) uitleg++;
    if ([1, 2, 3].includes(q.d)) diff++;
    if (ok && o.length > 1) {
      const jl = (o[q.c] || '').length, afl = o.filter((_, i) => i !== q.c).map(x => (x || '').length);
      const avg = afl.reduce((a, b) => a + b, 0) / afl.length;
      if (jl <= 1.6 * avg || jl < 25) geenLengte++;
    } else geenLengte++;
    const sk = norm(q.v).slice(0, 60); if (stems[sk]) dupQ++; else stems[sk] = 1;
    const e = kp[d.id + '|' + (q.v || '').slice(0, 80)]; status[e ? (e.status || 'geen') : 'geen']++;
  }
  const tot = cPos.reduce((a, b) => a + b, 0) || 1;
  const posDist = { A: rd(cPos[0] / tot, 2), B: rd(cPos[1] / tot, 2), C: rd(cPos[2] / tot, 2), D: rd(cPos[3] / tot, 2) };
  const posBias = Math.max(...cPos) / tot;
  const metrics = {
    n, correct_option_distribution: posDist, duplicate_questions: dupQ,
    duplicate_option_rate: rd((n - geenDup) / n), missing_explanation_rate: rd((n - uitleg) / n),
    difficulty_missing_rate: rd((n - diff) / n), length_bias_rate: rd((n - geenLengte) / n),
    coupling: { matched: status.matched, unmatched: status.unmatched, off_level: status.off_level },
  };
  const issues = [];
  if (posBias > 0.40) issues.push('answer_position_bias');
  if (geldig < n) issues.push('invalid_answer');
  if (geenDup < n) issues.push('duplicate_options');
  if (dupQ > 0) issues.push('duplicate_questions');
  const warnings = [];
  if (diff / n < 0.95) warnings.push('difficulty_missing');
  if ((n - geenLengte) / n > 0.05) warnings.push('length_bias');
  if (uitleg / n < 0.98) warnings.push('missing_explanation');
  if (status.unmatched > 0) warnings.push('unmatched_couplings');
  const score = rd(((opt4 + geldig + geenDup + uitleg + diff + geenLengte) / (6 * n)) * 100, 1);
  return { vak: vak.id, naam: vak.naam, score, issues, warnings, metrics };
}

const vakken = dg.V.filter(v => (!flag('vak') || v.id === flag('vak')) && v.domeinen.some(d => (d.sv || []).length));
const results = vakken.map(evalVak);
const BASE = path.join(ROOT, `knowledge/evaluation-baseline-${niveau}.json`);

if (flag('baseline')) {
  fs.writeFileSync(BASE, JSON.stringify({ _meta: { engine: 'evaluation-engine@1', datum: new Date().toISOString().slice(0, 10), toelichting: 'Bevroren "vóór"-meting — onafhankelijke referentie voor latere verbeteringen.' }, results }, null, 1));
  console.log(`✓ baseline vastgelegd: knowledge/evaluation-baseline-${niveau}.json (${results.length} vakken)`);
  process.exit(0);
}
if (flag('json')) { console.log(JSON.stringify(results, null, 1)); process.exit(0); }

let base = null; try { base = JSON.parse(fs.readFileSync(BASE, 'utf8')); } catch (e) {}
for (const r of results) {
  const b = base && base.results.find(x => x.vak === r.vak);
  const delta = b ? (r.score - b.score) : null;
  console.log(`\n═══ ${r.naam} (${niveau}/${r.vak}) — ${r.metrics.n} MC-vragen ═══`);
  console.log(`  score: ${r.score}%${delta != null ? `  (baseline ${b.score}% · Δ ${delta >= 0 ? '+' : ''}${rd(delta, 1)})` : ''}`);
  console.log(`  issues:   ${r.issues.length ? r.issues.join(', ') : '—'}`);
  console.log(`  warnings: ${r.warnings.length ? r.warnings.join(', ') : '—'}`);
  console.log(`  antwoordverdeling: A${r.metrics.correct_option_distribution.A} B${r.metrics.correct_option_distribution.B} C${r.metrics.correct_option_distribution.C} D${r.metrics.correct_option_distribution.D} · dubbele vragen ${r.metrics.duplicate_questions} · koppeling m/u/off ${r.metrics.coupling.matched}/${r.metrics.coupling.unmatched}/${r.metrics.coupling.off_level}`);
}
console.log(`\n  → de evaluator BESLIST niet. Een pipeline past beleid toe, bv.: accepteer als (score>=95 AND issues=[]); anders → human review.`);
console.log(`  Inhoudelijke kwaliteit (juistheid/afleiders/leerwaarde) = model/mens, zie docs/QUALITY-MODEL-vraag.md\n`);
