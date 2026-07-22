#!/usr/bin/env node
/**
 * evaluation-engine.js — Evaluation Engine (consument). READ-ONLY.
 *
 * Beoordeelt de kwaliteit van vragen. De fase verschuift van "kan de engine
 * genereren?" naar "is de content daadwerkelijk goed?". Draait op de BESTAANDE
 * vragenbank (structurele checks, geen LLM) én straks op gegenereerde vragen.
 *
 * Structureel (nu, deterministisch):
 *   4 opties · precies één geldig antwoord · geen dubbele opties · heeft uitleg ·
 *   moeilijkheidsveld · lengte-bias (juist = langste = tell) · antwoordpositie-bias ·
 *   dubbele vragen · leerdoel-koppeling (matched/unmatched/off_level).
 * LLM/mens-vereist (later, pluggable): inhoud klopt · misconceptie past · lijkt op
 *   een echte CE-vraag · pedagogisch nuttig.
 *
 *   node scripts/evaluation-engine.js havo [--vak bi] [--json]
 */
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const A = process.argv.slice(2);
const niveau = A.find(x => !x.startsWith('--')) || 'havo';
const flag = n => { const i = A.indexOf('--' + n); return i >= 0 ? (A[i + 1] && !A[i + 1].startsWith('--') ? A[i + 1] : true) : undefined; };

const dg = {}; new Function('g', read(`data-${niveau}.js`) + `\ng.V=(typeof VAKKEN!=='undefined'?VAKKEN:VAKKEN_VWO);`)(dg);
let KOPP = {}; try { const c = {}; new Function('g', read(`knowledge-koppeling-${niveau}.js`) + '\ng.K=LO_KOPPELING;')(c); KOPP = c.K || {}; } catch (e) {}
const norm = s => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();

function evalVak(vak) {
  const kp = KOPP[vak.id] || {};
  const R = { n: 0, opt4: 0, geldig: 0, geenDup: 0, uitleg: 0, diff: 0, geenLengtebias: 0 };
  const cPos = [0, 0, 0, 0]; const stems = {}; let dupQ = 0;
  const status = { matched: 0, unmatched: 0, off_level: 0, geen: 0 };
  const issues = [];
  for (const d of vak.domeinen) {
    for (const q of (d.sv || [])) {
      R.n++;
      const o = q.o || q.a || [];
      const opt4 = o.length === 4; if (opt4) R.opt4++;
      const geldig = Number.isInteger(q.c) && q.c >= 0 && q.c < o.length; if (geldig) R.geldig++;
      const geenDup = new Set(o.map(norm)).size === o.length; if (geenDup) R.geenDup++; else if (issues.length < 40) issues.push(`dubbele optie: "${(q.v || '').slice(0, 55)}"`);
      const uit = (q.u || '').length > 12; if (uit) R.uitleg++;
      const hasDiff = [1, 2, 3].includes(q.d); if (hasDiff) R.diff++;
      if (geldig) cPos[q.c]++;
      // lengte-bias: juist antwoord veel langer dan de gemiddelde afleider = tell
      if (geldig && o.length > 1) {
        const juist = (o[q.c] || '').length;
        const afl = o.filter((_, i) => i !== q.c).map(x => (x || '').length);
        const avg = afl.reduce((a, b) => a + b, 0) / afl.length;
        if (juist <= 1.6 * avg || juist < 25) R.geenLengtebias++;
        else if (issues.length < 40) issues.push(`lengte-bias (juist=langste): "${(q.v || '').slice(0, 45)}"`);
      } else R.geenLengtebias++;
      // dubbele vraag (zelfde stam binnen vak)
      const sk = norm(q.v).slice(0, 60); if (stems[sk]) dupQ++; else stems[sk] = 1;
      // leerdoel-koppeling
      const e = kp[d.id + '|' + (q.v || '').slice(0, 80)];
      status[e ? (e.status || 'geen') : 'geen']++;
    }
  }
  const pct = x => R.n ? Math.round(x / R.n * 100) : 0;
  // structurele kwaliteitsscore = gemiddelde van de per-vraag-checks
  const score = R.n ? ((R.opt4 + R.geldig + R.geenDup + R.uitleg + R.diff + R.geenLengtebias) / (6 * R.n)) : 0;
  const posBias = R.n ? Math.max(...cPos) / cPos.reduce((a, b) => a + b, 0) : 0;
  return { vak: vak.naam, id: vak.id, R, pct, score, cPos, posBias, dupQ, status, issues };
}

const vakken = dg.V.filter(v => !flag('vak') || v.id === flag('vak'));
const results = vakken.map(evalVak).filter(r => r.R.n > 0);
if (flag('json')) { console.log(JSON.stringify(results.map(r => ({ vak: r.id, n: r.R.n, score: +r.score.toFixed(3), posBias: +r.posBias.toFixed(2), dupQ: r.dupQ, status: r.status })), null, 1)); process.exit(0); }

for (const r of results) {
  console.log(`\n═══ Evaluation · ${r.vak} (${niveau}/${r.id}) — ${r.R.n} meerkeuzevragen ═══`);
  console.log(`  4 opties ${r.pct(r.R.opt4)}% · geldig antwoord ${r.pct(r.R.geldig)}% · geen dubbele opties ${r.pct(r.R.geenDup)}%`);
  console.log(`  heeft uitleg ${r.pct(r.R.uitleg)}% · moeilijkheidsveld ${r.pct(r.R.diff)}% · geen lengte-bias ${r.pct(r.R.geenLengtebias)}%`);
  console.log(`  antwoordpositie c=[${r.cPos.join(',')}]  → max ${Math.round(r.posBias * 100)}% ${r.posBias > 0.4 ? '⚠ positie-bias' : 'ok'}`);
  console.log(`  dubbele vragen (stam): ${r.dupQ}${r.dupQ > 5 ? ' ⚠' : ''}`);
  console.log(`  leerdoel-koppeling: matched ${r.status.matched} · unmatched ${r.status.unmatched} · off_level ${r.status.off_level}`);
  console.log(`  ▶ STRUCTURELE KWALITEITSSCORE: ${(r.score * 100).toFixed(1)}%`);
  if (r.issues.length) console.log(`    top-issues: ${r.issues.slice(0, 3).join(' · ')}`);
}
console.log(`\n  (LLM/mens-vereist, nog niet: inhoud klopt? · misconceptie past? · lijkt op een echte CE-vraag? · pedagogisch nuttig?)\n`);
