#!/usr/bin/env node
/**
 * curriculum-graph.js — READ-ONLY graph- & validation/evolution-engine.
 *
 * Realiseert twee architectuurpunten:
 *  1. Concept als eersteklas NODE (niet alleen een string in een leerdoel).
 *  2. Curriculum Evolution Engine: signaleert (schrijft NOOIT), doet voorstellen.
 *
 * Deze engine LEEST alleen (Curriculum Engine is de enige die schrijft).
 *
 *   node scripts/curriculum-graph.js concepts <niveau>        → knowledge/concepts-<niveau>.json + stats
 *   node scripts/curriculum-graph.js query <niveau> <term>    → welke leerdoelen gebruiken dit concept?
 *   node scripts/curriculum-graph.js evolve <niveau>          → voorstellen (split/overlap/gaten/dangling)
 */
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const [cmd, niveau = 'havo', term] = process.argv.slice(2);

const kg = {}; new Function('g', read(`knowledge-${niveau}.js`) + '\ng.L = LEERDOELEN;')(kg);
const LEERDOELEN = kg.L;
let KOPP = {};
try { const cg = {}; new Function('g', read(`knowledge-koppeling-${niveau}.js`) + '\ng.K = LO_KOPPELING;')(cg); KOPP = cg.K || {}; } catch (e) {}

const norm = s => String(s || '').toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')   // accenten weg
  .replace(/\([^)]*\)/g, '').replace(/[«».,:?"]/g, '').trim().replace(/\s+/g, ' ');
const slugify = s => 'concept.' + norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ── bouw de concept-graaf (nodes + gebruikt-edges) ──
function buildConcepts() {
  const nodes = {}; // slug → node
  for (const [domKey, block] of Object.entries(LEERDOELEN)) {
    const vak = domKey.split('_')[0];
    for (const ld of (block.leerdoelen || [])) {
      for (const label of (ld.concepten || [])) {
        const slug = slugify(label);
        const n = nodes[slug] = nodes[slug] || { id: slug, labels: new Set(), appearsIn: [], vakken: new Set(), domeinen: new Set(), nVragen: 0 };
        n.labels.add(label); n.appearsIn.push(ld.id); n.vakken.add(vak); n.domeinen.add(domKey);
      }
    }
  }
  // vraag-tellingen uit de koppeling-sidecar (via-veld; concept_match)
  for (const kp of Object.values(KOPP)) for (const e of Object.values(kp)) {
    if (!e.via) continue;
    for (const label of String(e.via).split('+')) {
      const slug = slugify(label); if (nodes[slug]) nodes[slug].nVragen++;
    }
  }
  // serialiseerbaar maken
  const out = {};
  for (const slug of Object.keys(nodes).sort()) {
    const n = nodes[slug];
    out[slug] = { id: n.id, labels: [...n.labels], vakken: [...n.vakken].sort(), domeinen: [...n.domeinen].sort(), appearsIn: [...new Set(n.appearsIn)].sort(), nVragen: n.nVragen };
  }
  return out;
}

if (cmd === 'concepts') {
  const nodes = buildConcepts();
  const outFile = `knowledge/concepts-${niveau}.json`;
  fs.writeFileSync(path.join(ROOT, outFile), JSON.stringify(nodes, null, 1));
  const arr = Object.values(nodes);
  const crossVak = arr.filter(n => n.vakken.length > 1);
  console.log(`✓ ${outFile}: ${arr.length} concept-nodes`);
  console.log(`  vak-overstijgend (in ≥2 vakken): ${crossVak.length}`);
  crossVak.slice(0, 12).forEach(n => console.log(`   • ${n.labels[0]} → ${n.vakken.join('+')} (${n.appearsIn.length} leerdoelen, ${n.nVragen} vragen)`));
  const top = [...arr].sort((a, b) => b.nVragen - a.nVragen).slice(0, 8);
  console.log(`  meest getoetst: ${top.map(n => n.labels[0] + '·' + n.nVragen).join(', ')}`);
} else if (cmd === 'query') {
  const nodes = buildConcepts();
  const q = norm(term);
  const hits = Object.values(nodes).filter(n => n.labels.some(l => norm(l).includes(q)) || n.id.includes(q.replace(/\s+/g, '-')));
  if (!hits.length) { console.log(`geen concept-node voor "${term}"`); process.exit(0); }
  for (const n of hits) {
    console.log(`\n${n.labels.join(' / ')}  [${n.id}]`);
    console.log(`  vakken: ${n.vakken.join(', ')} · ${n.nVragen} vragen`);
    console.log(`  gebruikt in: ${n.appearsIn.join(', ')}`);
  }
} else if (cmd === 'evolve') {
  // Curriculum Evolution Engine — signaleert, schrijft niets.
  const nodes = buildConcepts();
  const allLd = {}; const domOf = {};
  for (const [domKey, block] of Object.entries(LEERDOELEN)) for (const ld of (block.leerdoelen || [])) { allLd[ld.id] = ld; domOf[ld.id] = domKey; }
  const nVragenLd = {}; // leerdoel → #koppelingen
  for (const kp of Object.values(KOPP)) for (const e of Object.values(kp)) nVragenLd[e.lo] = (nVragenLd[e.lo] || 0) + 1;

  const P = []; const add = (type, msg) => P.push(`  [${type}] ${msg}`);

  // 1. split-kandidaten: te veel vragen op één leerdoel
  for (const [id, n] of Object.entries(nVragenLd)) if (n > 40) add('split?', `${id} heeft ${n} vragen → overweeg splitsen`);
  // 2. overlap: leerdoelparen binnen 1 domein met hoge concept-overlap
  const byDom = {}; for (const [id, ld] of Object.entries(allLd)) (byDom[domOf[id]] = byDom[domOf[id]] || []).push(ld);
  for (const lds of Object.values(byDom)) for (let i = 0; i < lds.length; i++) for (let j = i + 1; j < lds.length; j++) {
    const a = new Set((lds[i].concepten || []).map(norm)), b = new Set((lds[j].concepten || []).map(norm));
    if (!a.size || !b.size) continue;
    const inter = [...a].filter(x => b.has(x)).length, uni = new Set([...a, ...b]).size;
    if (inter / uni >= 0.5) add('overlap?', `${lds[i].id} ~ ${lds[j].id} (${Math.round(inter / uni * 100)}% conceptoverlap)`);
  }
  // 3. concept zonder vraag (gat)
  for (const n of Object.values(nodes)) if (n.nVragen === 0) add('gat', `concept "${n.labels[0]}" (${n.appearsIn.join(',')}) heeft 0 gekoppelde vragen`);
  // 4. dangling prerequisites/vervolg (edges naar niet-bestaand leerdoel)
  for (const [id, ld] of Object.entries(allLd)) for (const f of ['voorkennis', 'vervolg']) for (const ref of (ld[f] || [])) if (!allLd[ref]) add('dangling', `${id}.${f} → ${ref} bestaat niet`);
  // 5. geïsoleerde leerdoelen (geen edges) — informatief zolang edges nog leeg zijn
  const withEdges = Object.values(allLd).filter(ld => (ld.voorkennis || []).length || (ld.vervolg || []).length).length;
  // 6. eindtermen die nog geverifieerd moeten worden
  const teVer = Object.values(allLd).filter(ld => ld.teVerifiëren).length;

  console.log(`\n═══ Curriculum Evolution — voorstellen (${niveau}) ═══`);
  console.log(P.length ? P.join('\n') : '  (geen signalen)');
  console.log(`\n  info: ${Object.keys(allLd).length} leerdoelen · ${withEdges} met voorkennis/vervolg-edges · ${teVer} eindtermen teVerifiëren`);
  console.log(`  (Evolution Engine schrijft niets — dit zijn voorstellen voor menselijke review.)`);
} else {
  console.error('gebruik: curriculum-graph.js concepts|query|evolve <niveau> [term]');
  process.exit(1);
}
