#!/usr/bin/env node
/**
 * curriculum-factory.js — de Curriculum Factory (F1.55).
 *
 * Doel: de machine die leerdoelen produceert, i.p.v. ze met de hand te schrijven.
 * De factory automatiseert ALLES rond het schrijven: bron-extractie, briefing,
 * schema, coverage-doelen, misconceptie-signalen, provenance en validatie.
 * De creatieve draft-stap (concepten → leerdoelen) is een PLUGGABLE fase:
 *   - nu: een mens/agent vult de gegenereerde briefing volgens het schema;
 *   - later (met ANTHROPIC_API_KEY): een automatische Claude-call op dezelfde briefing;
 *   - later (met netwerk): een crawler die officiële syllabi als extra bron toevoegt.
 *
 * Subcommando's:
 *   brief    <niveau> <vak>   → factory/brief-<niveau>-<vak>.json  (extractor + briefing)
 *   validate <niveau> <vak>   → toetst factory/draft-<niveau>-<vak>.json aan schema+coverage
 *
 * Bronnen nu: Slagio interne content (begrippen + samenvattingen + vragen).
 * Externe bronnen (CvTE/syllabus/examenblad) zijn een extra, optionele bronlaag
 * die hier niet bereikbaar is; de factory draait volledig op interne content.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const FACT = path.join(ROOT, 'factory');
const KDIR = niv => path.join(ROOT, 'knowledge', niv);

const argv = process.argv.slice(2);
const FLAGS = argv.filter(a => a.startsWith('--'));
const POS = argv.filter(a => !a.startsWith('--'));
const cmd = POS[0], niveau = POS[1] || 'havo', vakId = POS[2];
const DRY = FLAGS.includes('--dry-run');
const needsVak = ['brief', 'validate', 'ingest'];
if (!['brief', 'validate', 'ingest', 'assemble'].includes(cmd) || (needsVak.includes(cmd) && !vakId)) {
  console.error('gebruik:\n  curriculum-factory.js brief|validate|ingest <niveau> <vak> [--dry-run]\n  curriculum-factory.js assemble <niveau>');
  process.exit(1);
}
if (!fs.existsSync(FACT)) fs.mkdirSync(FACT);

// ── deterministische content-hash (voor versiebeheer/idempotentie) ──
// Sluit _meta en id uit; volgorde-onafhankelijk voor concepten/veelgemaakteFouten.
function contentHash(ld) {
  const canon = {
    titel: ld.titel || '', eindterm: ld.eindterm || '', teVerifiëren: !!ld.teVerifiëren,
    beschrijving: ld.beschrijving || '',
    concepten: [...(ld.concepten || [])].sort(),
    vaardigheid: ld.vaardigheid || '', examenskill: ld.examenskill || '', examenrelevantie: ld.examenrelevantie || '',
    veelgemaakteFouten: [...(ld.veelgemaakteFouten || [])].sort(),
  };
  return crypto.createHash('sha1').update(JSON.stringify(canon)).digest('hex').slice(0, 12);
}

// ── schema dat de draft-stap moet volgen (single source of truth) ──
const SCHEMA = {
  vaardigheden: ['onthouden', 'beschrijven', 'verklaren', 'toepassen', 'berekenen', 'analyseren', 'beoordelen'],
  examenskills: ['bron-interpretatie', 'data-verwerken', 'meerstaps-redeneren', 'antwoord-formuleren', 'context-transfer'],
  examenrelevantie: ['hoog', 'midden', 'laag'],
  leerdoelenPerDomein: { min: 4, max: 8 },
  veld: { id: '"<vak>.<domein>.<n>"', titel: 'kort', eindterm: 'verwijzing (teVerifiëren:true tot syllabus-check)', beschrijving: 'De kandidaat kan…', concepten: '[begrippen uit dit domein]', vaardigheid: 'enum', examenskill: 'enum', examenrelevantie: 'enum', veelgemaakteFouten: '[misconcepties]' },
};

// ── interne bron laden ──
const dg = {};
new Function('g', read(`data-${niveau}.js`) + `\ng.V=(typeof VAKKEN!=='undefined'?VAKKEN:VAKKEN_VWO);`)(dg);
const vak = vakId ? dg.V.find(v => v.id === vakId) : null;
if (needsVak.includes(cmd) && !vak) { console.error(`vak ${vakId} niet in data-${niveau}.js`); process.exit(1); }

// samenvattingen (optioneel — extra thematische context)
let SAM = {};
try {
  const sg = {};
  new Function('g', read('data.js') + '\n' + read(`sam-${niveau}.js`) + '\ng.S=SAM_RICH;')(sg);
  SAM = sg.S || {};
} catch (e) { /* sam optioneel */ }
const stripHtml = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function briefVak() {
  const domeinen = vak.domeinen.map(d => {
    const qs = [...(d.sv || []), ...(d.oe || [])];
    const hayAll = qs.map(q => ((q.v || '') + ' ' + ((q.o || q.a || []).join(' '))).toLowerCase());
    // concept-frequentie: in hoeveel vragen komt de term voor (belang-signaal)
    const concepten = (d.begrippen || []).map(b => {
      const t = (b.t || '').toLowerCase();
      const freq = hayAll.filter(h => h.includes(t)).length;
      return { term: b.t, definitie: b.d || '', freqInVragen: freq };
    }).sort((a, b) => b.freqInVragen - a.freqInVragen);

    // misconceptie-signalen uit uitleg (u): zinnen die een verwarring benoemen
    const misSet = new Set();
    const MIS_RE = /verwar|denkt? dat|niet te verwarren|in tegenstelling|is géén|is geen |mag niet|vergeet|veelgemaakte fout|veel leerlingen|let op|hoort niet|juist niet|≠|is niet hetzelfde/i;
    for (const q of qs) {
      for (const zin of ((q.u || '') + ' ' + (q.ctx || '')).split(/(?<=[.!?])\s+/)) {
        if (MIS_RE.test(zin) && zin.length > 15 && zin.length < 150) misSet.add(zin.trim());
      }
    }
    // SAM_RICH is gekeyd op niveau_vak_domein (bv. havo_sk_C)
    const samThema = stripHtml(SAM[`${niveau}_${vakId}_${d.id}`]).slice(0, 320);

    return {
      id: d.id, naam: d.naam,
      nVragen: { sv: (d.sv || []).length, oe: (d.oe || []).length },
      richtlijn: SCHEMA.leerdoelenPerDomein,
      concepten,
      samThema: samThema || null,
      misconceptieSignalen: [...misSet].slice(0, 12),
    };
  });

  return {
    factory: 'curriculum-factory@1', gegenereerd: new Date().toISOString().slice(0, 10),
    niveau, vak: { id: vak.id, naam: vak.naam },
    bron: ['Slagio interne content: begrippen + samenvattingen + vragen'],
    externeBronnen: { status: 'niet-bereikbaar-in-omgeving', gepland: ['CvTE-examenprogramma', 'syllabus', 'examenblad.nl'] },
    schema: SCHEMA,
    opdracht: 'Schrijf per domein 4–8 leerdoelen die de concepten dekken; gebruik de misconceptie-signalen voor veelgemaakteFouten; kies vaardigheid+examenskill uit de enums; zet examenrelevantie; koppel elk leerdoel aan een eindterm (teVerifiëren:true).',
    domeinen,
  };
}

// Valideert een draft-object (schema, enums, id-format, referentiële integriteit).
// Retourneert {issues, ids} en logt. Gedeeld door `validate` én `ingest`.
function validateDraftObj(draft, { silent = false } = {}) {
  const begrippenPerDom = {};
  for (const d of vak.domeinen) begrippenPerDom[d.id] = new Set((d.begrippen || []).map(b => (b.t || '').toLowerCase()));
  let issues = 0; const seen = new Set();
  const warn = (m) => { issues++; if (!silent) console.log('  ✗ ' + m); };
  const ok = (m) => { if (!silent) console.log('  ✓ ' + m); };

  for (const [domKey, block] of Object.entries(draft)) {
    const domId = domKey.split('_')[1] || domKey;
    const validDom = vak.domeinen.some(d => d.id === domId);
    if (!validDom) warn(`onbekend domein: ${domKey}`);
    const lds = (block.leerdoelen || []);
    const n = lds.length;
    (n >= SCHEMA.leerdoelenPerDomein.min && n <= SCHEMA.leerdoelenPerDomein.max)
      ? ok(`${domKey}: ${n} leerdoelen (binnen 4–8)`) : warn(`${domKey}: ${n} leerdoelen (buiten 4–8)`);
    for (const ld of lds) {
      if (!/^[a-z]{2}\.[A-Z0-9]+\.\d+$/.test(ld.id || '')) warn(`id fout schema: ${ld.id}`);
      else if (ld.id.split('.')[1] !== domId) warn(`${ld.id}: domein-deel klopt niet met ${domKey}`);
      if (seen.has(ld.id)) warn(`dubbele id: ${ld.id}`); seen.add(ld.id);
      if (!ld.titel) warn(`${ld.id}: titel ontbreekt`);
      if (!SCHEMA.vaardigheden.includes(ld.vaardigheid)) warn(`${ld.id}: vaardigheid '${ld.vaardigheid}' niet in enum`);
      if (!SCHEMA.examenskills.includes(ld.examenskill)) warn(`${ld.id}: examenskill '${ld.examenskill}' niet in enum`);
      if (!SCHEMA.examenrelevantie.includes(ld.examenrelevantie)) warn(`${ld.id}: examenrelevantie ongeldig`);
      const known = begrippenPerDom[domId] || new Set();
      const vreemd = (ld.concepten || []).filter(c => !known.has(String(c).toLowerCase()));
      if (vreemd.length && !silent) console.log(`  · ${ld.id}: ${vreemd.length} concept(en) niet in begrippen (bewuste toevoeging?): ${vreemd.join(', ')}`);
    }
  }
  return { issues, ids: seen };
}

function loadDraft() {
  const f = path.join(FACT, `draft-${niveau}-${vakId}.json`);
  if (!fs.existsSync(f)) { console.error(`ontbreekt: factory/draft-${niveau}-${vakId}.json`); process.exit(1); }
  return JSON.parse(fs.readFileSync(f, 'utf8'));
}

// ── ASSEMBLE: knowledge/<niveau>/*.json → knowledge-<niveau>.js (deterministisch) ──
function assemble() {
  const dir = KDIR(niveau);
  if (!fs.existsSync(dir)) { console.error(`geen knowledge/${niveau}/`); process.exit(1); }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
  const merged = {};
  for (const f of files) {
    const obj = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    for (const k of Object.keys(obj)) merged[k] = obj[k];
  }
  const sorted = {}; for (const k of Object.keys(merged).sort()) sorted[k] = merged[k];
  const banner = `// ═══════════════════════════════════════════════════════════════════════
// knowledge-${niveau}.js — GEGENEREERD door curriculum-factory.js (assemble).
// Bron van waarheid: knowledge/${niveau}/<vak>.json. NIET met de hand bewerken;
// draai 'curriculum-factory.js ingest' of 'assemble'. Bevat provenance in _meta.
// ═══════════════════════════════════════════════════════════════════════
var LEERDOELEN = (typeof LEERDOELEN !== 'undefined' && LEERDOELEN) || {};
Object.assign(LEERDOELEN, ${JSON.stringify(sorted, null, 1)});
if (typeof module !== 'undefined' && module.exports) module.exports = { LEERDOELEN };
`;
  const out = `knowledge-${niveau}.js`;
  fs.writeFileSync(path.join(ROOT, out), banner);
  const nLd = Object.values(sorted).reduce((a, d) => a + (d.leerdoelen || []).length, 0);
  console.log(`✓ ${out} geassembleerd uit ${files.length} vak(ken): ${Object.keys(sorted).length} domeinen, ${nLd} leerdoelen`);
}

// ── INGEST: gevalideerde draft → knowledge/<niveau>/<vak>.json (idempotent, versie+provenance) ──
function ingest() {
  const draft = loadDraft();
  console.log(`\n── Validatie ──`);
  const { issues } = validateDraftObj(draft);
  if (issues) { console.error(`\n✗ ${issues} schema-issue(s) — ingest afgebroken. Corrigeer de draft.`); process.exit(1); }

  const today = new Date().toISOString().slice(0, 10);
  const file = path.join(KDIR(niveau), `${vakId}.json`);
  const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  // index bestaande leerdoelen op id (id = STABIELE sleutel; tekst mag evolueren)
  const exById = {};
  for (const block of Object.values(existing)) for (const ld of (block.leerdoelen || [])) exById[ld.id] = ld;

  const report = { added: [], changed: [], unchanged: [], kept: [] };
  const out = {};
  const draftIds = new Set();

  // merge domeinen uit de draft
  for (const [domKey, block] of Object.entries(draft)) {
    const lds = (block.leerdoelen || []).map(ld => {
      draftIds.add(ld.id);
      const hash = contentHash(ld);
      const prev = exById[ld.id];
      let meta;
      if (!prev) {
        meta = { version: 1, reviewStatus: 'draft', lastReviewed: null, source: 'curriculum-factory@1', created: today, updated: today, contentHash: hash };
        report.added.push(ld.id);
      } else if (prev._meta && prev._meta.contentHash === hash) {
        meta = prev._meta; // idempotent: niets veranderd
        report.unchanged.push(ld.id);
      } else {
        const pm = prev._meta || { version: 0, source: 'onbekend', created: today };
        meta = { version: pm.version + 1, reviewStatus: 'draft', lastReviewed: null, source: 'curriculum-factory@1', created: pm.created, updated: today, contentHash: hash };
        report.changed.push(`${ld.id} (v${pm.version}→v${meta.version})`);
      }
      const { _meta, ...content } = ld; // drop een eventueel meegeleverde _meta
      return { ...content, _meta: meta };
    });
    out[domKey] = { syllabus: block.syllabus || (existing[domKey] && existing[domKey].syllabus) || null, leerdoelen: lds };
  }
  // domeinen die alleen in het bestaande bestand zitten → behouden (niet stil verwijderen)
  for (const [domKey, block] of Object.entries(existing)) {
    if (out[domKey]) continue;
    out[domKey] = block;
    for (const ld of (block.leerdoelen || [])) report.kept.push(ld.id);
  }
  // bestaande leerdoelen binnen een draft-domein die niet meer in de draft staan → behouden + flaggen
  for (const [domKey, block] of Object.entries(draft)) {
    const ex = existing[domKey]; if (!ex) continue;
    for (const ld of (ex.leerdoelen || [])) {
      if (!draftIds.has(ld.id)) { out[domKey].leerdoelen.push(ld); report.kept.push(ld.id + ' (niet in draft)'); }
    }
  }

  // ── diff-rapport (vóór schrijven) ──
  console.log(`\n── Ingest-rapport ${vakId} (${niveau}) ${DRY ? '[DRY-RUN]' : ''} ──`);
  console.log(`  toegevoegd : ${report.added.length}${report.added.length ? '  ' + report.added.join(', ') : ''}`);
  console.log(`  gewijzigd  : ${report.changed.length}${report.changed.length ? '  ' + report.changed.join(', ') : ''}`);
  console.log(`  ongewijzigd: ${report.unchanged.length}`);
  if (report.kept.length) console.log(`  behouden   : ${report.kept.length}  ${report.kept.join(', ')}`);

  if (DRY) { console.log('\n(DRY-RUN: niets geschreven)'); return; }
  // deterministisch schrijven: domeinen gesorteerd
  const sortedOut = {}; for (const k of Object.keys(out).sort()) sortedOut[k] = out[k];
  fs.writeFileSync(file, JSON.stringify(sortedOut, null, 1));
  console.log(`\n✓ geschreven: knowledge/${niveau}/${vakId}.json`);
  assemble();
}

if (cmd === 'brief') {
  const b = briefVak();
  const out = path.join(FACT, `brief-${niveau}-${vakId}.json`);
  fs.writeFileSync(out, JSON.stringify(b, null, 1));
  const totC = b.domeinen.reduce((a, d) => a + d.concepten.length, 0);
  const totM = b.domeinen.reduce((a, d) => a + d.misconceptieSignalen.length, 0);
  console.log(`\n✓ briefing: factory/brief-${niveau}-${vakId}.json`);
  console.log(`  vak: ${b.vak.naam} · ${b.domeinen.length} domeinen · ${totC} concepten · ${totM} misconceptie-signalen`);
  for (const d of b.domeinen) console.log(`   [${d.id}] ${d.naam}: ${d.concepten.length} concepten, ${d.misconceptieSignalen.length} mis-signalen, sam:${d.samThema ? 'ja' : 'nee'}`);
  console.log(`\n  → volgende stap: draft leerdoelen volgens de briefing → factory/draft-${niveau}-${vakId}.json → 'validate'`);
} else if (cmd === 'validate') {
  const { issues } = validateDraftObj(loadDraft());
  console.log('\n' + (issues ? `✗ ${issues} schema-issue(s)` : '✓ draft voldoet aan het schema'));
  process.exit(issues ? 1 : 0);
} else if (cmd === 'assemble') {
  assemble();
} else if (cmd === 'ingest') {
  ingest();
}
