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
const ROOT = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const FACT = path.join(ROOT, 'factory');

const [cmd, niveau = 'havo', vakId] = process.argv.slice(2);
if (!['brief', 'validate'].includes(cmd) || !vakId) {
  console.error('gebruik: node scripts/curriculum-factory.js <brief|validate> <niveau> <vakId>');
  process.exit(1);
}
if (!fs.existsSync(FACT)) fs.mkdirSync(FACT);

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
const vak = dg.V.find(v => v.id === vakId);
if (!vak) { console.error(`vak ${vakId} niet in data-${niveau}.js`); process.exit(1); }

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

function validateDraft() {
  const draftFile = path.join(FACT, `draft-${niveau}-${vakId}.json`);
  if (!fs.existsSync(draftFile)) { console.error(`ontbreekt: factory/draft-${niveau}-${vakId}.json`); process.exit(1); }
  const draft = JSON.parse(fs.readFileSync(draftFile, 'utf8'));
  const begrippenPerDom = {};
  for (const d of vak.domeinen) begrippenPerDom[d.id] = new Set((d.begrippen || []).map(b => (b.t || '').toLowerCase()));
  let issues = 0; const warn = (m) => { issues++; console.log('  ✗ ' + m); };
  const ok = (m) => console.log('  ✓ ' + m);

  for (const [domKey, block] of Object.entries(draft)) {
    const domId = domKey.split('_')[1] || domKey;
    const lds = (block.leerdoelen || []);
    const n = lds.length;
    (n >= SCHEMA.leerdoelenPerDomein.min && n <= SCHEMA.leerdoelenPerDomein.max)
      ? ok(`${domKey}: ${n} leerdoelen (binnen 4–8)`) : warn(`${domKey}: ${n} leerdoelen (buiten 4–8)`);
    for (const ld of lds) {
      if (!/^[a-z]{2}\.[A-Z0-9]+\.\d+$/.test(ld.id || '')) warn(`id fout schema: ${ld.id}`);
      if (!SCHEMA.vaardigheden.includes(ld.vaardigheid)) warn(`${ld.id}: vaardigheid '${ld.vaardigheid}' niet in enum`);
      if (!SCHEMA.examenskills.includes(ld.examenskill)) warn(`${ld.id}: examenskill '${ld.examenskill}' niet in enum`);
      if (!SCHEMA.examenrelevantie.includes(ld.examenrelevantie)) warn(`${ld.id}: examenrelevantie ongeldig`);
      // concepten moeten uit dit domein komen (of een bewuste toevoeging zijn)
      const known = begrippenPerDom[domId] || new Set();
      const vreemd = (ld.concepten || []).filter(c => !known.has(String(c).toLowerCase()));
      if (vreemd.length) console.log(`  · ${ld.id}: ${vreemd.length} concept(en) niet in begrippen (bewuste toevoeging?): ${vreemd.join(', ')}`);
    }
  }
  console.log('\n' + (issues ? `✗ ${issues} schema-issue(s)` : '✓ draft voldoet aan het schema'));
  process.exit(issues ? 1 : 0);
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
  validateDraft();
}
