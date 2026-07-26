#!/usr/bin/env node
/**
 * question-engine.js — eerste echte CONSUMENT van de kennislaag (stap 3).
 * Integratietest: raakt curriculum + concepten + misconcepties + examenskill +
 * examengewicht + reviewstatus + provenance.
 *
 * Principes (hard):
 *  - De engine KIEST NOOIT zelf zijn input. Hij verwerkt uitsluitend query-output:
 *    de selectie loopt via curriculum-query.js (--json). engine.run(query).
 *  - Twee modi, nooit de gate versoepelen om te testen:
 *      --mode production  → review=approved
 *      --mode test        → review in {reviewed, approved}
 *  - De prozastap (spec → vraagtekst) is de PLUGGABLE LLM-kern; hier levert de
 *    engine de volledige generatie-SPEC uit de metadata (LLM-stap gemarkeerd).
 *
 *   node scripts/question-engine.js havo --mode test [--limit N] [--write]
 */
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const ROOT = path.resolve(__dirname, '..');
const A = process.argv.slice(2);
const niveau = A.find(x => !x.startsWith('--')) || 'havo';
const flag = n => { const i = A.indexOf('--' + n); return i >= 0 ? (A[i + 1] && !A[i + 1].startsWith('--') ? A[i + 1] : true) : undefined; };
const mode = flag('mode') || 'test';
const limit = +(flag('limit') || 8);
if (!['test', 'production'].includes(mode)) { console.error("mode moet 'test' of 'production' zijn"); process.exit(1); }

// ── SELECTIE via de Query Engine (de engine kiest niet zelf) ──
// production: alleen approved. test: reviewed of approved. + generatie-waardig (AI-Ready).
// DNF (OR van AND-groepen); de querytaal kent geen haakjes.
const where = mode === 'production'
  ? 'review=approved AND airready>=80'
  : 'review=reviewed AND airready>=80 OR review=approved AND airready>=80';
let selected;
try {
  const out = cp.execSync(`node ${path.join(__dirname, 'curriculum-query.js')} ${niveau} --where ${JSON.stringify(where)} --json`, { encoding: 'utf8' });
  selected = JSON.parse(out);
} catch (e) { console.error('query-selectie faalde: ' + e.message); process.exit(1); }

console.log(`\n═══ Question Engine · mode=${mode} ═══`);
console.log(`selectie-query: "${where}"  →  ${selected.length} leerdoel(en)`);
if (!selected.length) {
  console.log(mode === 'production'
    ? '  0 leerdoelen approved → de engine genereert NIETS. De gate werkt (geen versoepeling om te testen).'
    : '  0 leerdoelen voldoen. Niets te genereren.');
  process.exit(0);
}

// ── volledige leerdoel-data laden voor de geselecteerde IDs ──
const kg = {}; new Function('g', fs.readFileSync(path.join(ROOT, `knowledge-${niveau}.js`), 'utf8') + '\ng.L=LEERDOELEN;')(kg);
const byId = {}; for (const b of Object.values(kg.L)) for (const ld of (b.leerdoelen || [])) byId[ld.id] = ld;

// examenskill → vraagvorm ; examenrelevantie → difficulty
const SKILL_FORM = { 'bron-interpretatie': 'bron/grafiek-interpretatievraag', 'data-verwerken': 'reken-/afleesvraag', 'meerstaps-redeneren': 'meerstaps-redeneervraag', 'antwoord-formuleren': 'open vraag (correctievoorschrift)', 'context-transfer': 'transfervraag (nieuwe context)' };
const DIFF = { hoog: 3, midden: 2, laag: 1 };

const today = new Date().toISOString().slice(0, 10);
const specs = [];
for (const row of selected.slice(0, limit)) {
  const ld = byId[row.id]; if (!ld) continue;
  const misconceptie = (ld.veelgemaakteFouten || [])[0] || null;
  const spec = {
    // ── generatie-spec: elke as van de kennislaag wordt verbruikt ──
    leerdoel: ld.id, leerdoelVersion: (ld._meta && ld._meta.version) || 1, titel: ld.titel,
    concept: (ld.concepten || [])[0] || null,
    misconceptie,
    examenskill: ld.examenskill, vraagvorm: SKILL_FORM[ld.examenskill] || 'meerkeuzevraag',
    examengewicht: ld.examenrelevantie, difficulty: DIFF[ld.examenrelevantie] || 2,
    opdracht: `Genereer een ${SKILL_FORM[ld.examenskill] || 'vraag'} over "${ld.titel}" (concept: ${(ld.concepten || [])[0] || '—'}) op moeilijkheid ${DIFF[ld.examenrelevantie] || 2}${misconceptie ? `, die de misconceptie "${misconceptie}" ontmaskert` : ''}.`,
    prozatekst: '[LLM-stap — hier vult de generator de daadwerkelijke vraag + afleiders in]',
    _prov: { engine: 'question-engine@1', mode, method: 'spec-only (LLM-kern pluggable)', bronReview: row.review, aiReady: row.airready, datum: today },
  };
  specs.push(spec);
}

console.log(`\n${specs.length} generatie-spec(s) opgebouwd uit de metadata:\n`);
for (const s of specs) {
  console.log(`• ${s.leerdoel} v${s.leerdoelVersion} — ${s.titel}  [${s.examenskill}/${s.examengewicht}·diff${s.difficulty}]`);
  console.log(`   ${s.opdracht}`);
}

if (flag('write')) {
  const dir = path.join(ROOT, 'knowledge', 'generated'); if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const f = path.join(dir, `questionspecs-${niveau}.json`);
  fs.writeFileSync(f, JSON.stringify({ _meta: { engine: 'question-engine@1', mode, datum: today }, specs }, null, 1));
  console.log(`\n✓ store: knowledge/generated/questionspecs-${niveau}.json (${specs.length} specs)`);
} else {
  console.log(`\n(dry-run — gebruik --write om naar de question-store te schrijven)`);
}
console.log('');
