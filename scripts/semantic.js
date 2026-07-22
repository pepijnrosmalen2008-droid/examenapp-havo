#!/usr/bin/env node
/**
 * semantic.js — Semantic Layer engine (F1.65 pilot). READ-ONLY.
 *
 * Bewijst dat onder Knowledge Units een laag van semantische FEITEN zit:
 * gecontroleerde triples (subject —predicate→ object) tussen concept-nodes.
 * Daaruit volgt (a) gratis reasoning via graph-traversal en (b) knowledge units.
 *
 *   node scripts/semantic.js validate <niveau>
 *   node scripts/semantic.js facts    <niveau> <concept>     alle feiten rond een concept
 *   node scripts/semantic.js path     <niveau> <A> <B>       redeneerketen tussen twee nodes
 *   node scripts/semantic.js units    <niveau> <concept>     afgeleide knowledge units
 */
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const [cmd, niveau = 'havo', a, b] = process.argv.slice(2);

// Gesloten predikaten-vocabulaire (ontologie). Uitbreiden = bewuste keuze, geen vrije tekst.
const PREDICATES = new Set(['is_a', 'has_part', 'part_of', 'binds_to', 'reduces', 'increases', 'affects',
  'causes', 'requires', 'used_by', 'occurs_in', 'produces', 'has_property', 'opposite_of',
  'often_confused_with', 'analogy_of', 'depends_on', 'results_in']);

const G = JSON.parse(fs.readFileSync(path.join(ROOT, `knowledge/semantic-${niveau}.json`), 'utf8'));
const label = id => (G.concepts[id] && G.concepts[id].label) || id;
const findConcept = term => {
  const t = term.toLowerCase();
  return Object.keys(G.concepts).find(id => id === term || id.endsWith('.' + t) || label(id).toLowerCase() === t || label(id).toLowerCase().includes(t));
};

if (cmd === 'validate') {
  let issues = 0; const bad = m => { issues++; console.log('  ✗ ' + m); };
  for (const f of G.facts) {
    if (!PREDICATES.has(f.p)) bad(`onbekend predikaat: ${f.p} (${f.s} → ${f.o})`);
    if (!G.concepts[f.s]) bad(`subject niet in registry: ${f.s}`);
    if (!G.concepts[f.o]) bad(`object niet in registry: ${f.o}`);
    if (typeof f.conf !== 'number' || f.conf < 0 || f.conf > 1) bad(`ongeldige confidence: ${f.s} ${f.p} ${f.o}`);
  }
  // geïsoleerde concepten (in registry maar in geen enkel feit)
  const used = new Set(); G.facts.forEach(f => { used.add(f.s); used.add(f.o); });
  const isolated = Object.keys(G.concepts).filter(id => !used.has(id));
  console.log(`\n${G.facts.length} feiten · ${Object.keys(G.concepts).length} concept-nodes · ${isolated.length} geïsoleerd`);
  console.log(issues ? `✗ ${issues} issue(s)` : '✓ semantische graaf integer (predikaten + nodes + confidence)');
  process.exit(issues ? 1 : 0);
}

if (cmd === 'facts') {
  const id = findConcept(a); if (!id) { console.log(`geen concept "${a}"`); process.exit(0); }
  console.log(`\nFeiten rond ${label(id)} [${id}]:`);
  for (const f of G.facts) {
    if (f.s === id) console.log(`  ${label(f.s)} —${f.p}→ ${label(f.o)}   (${f.conf})`);
    else if (f.o === id) console.log(`  ${label(f.s)} —${f.p}→ ${label(f.o)}   (${f.conf})   [inkomend]`);
  }
}

if (cmd === 'path') {
  // BFS over de graaf (ongericht voor het vinden; richting getoond) = reasoning.
  const sA = findConcept(a), sB = findConcept(b);
  if (!sA || !sB) { console.log('concept niet gevonden'); process.exit(0); }
  const adj = {};
  for (const f of G.facts) { (adj[f.s] = adj[f.s] || []).push([f.o, f, true]); (adj[f.o] = adj[f.o] || []).push([f.s, f, false]); }
  const q = [[sA, [sA], []]]; const seen = new Set([sA]); let found = null;
  while (q.length) {
    const [node, nds, eds] = q.shift();
    if (node === sB) { found = [nds, eds]; break; }
    for (const [nb, f] of (adj[node] || [])) if (!seen.has(nb)) { seen.add(nb); q.push([nb, [...nds, nb], [...eds, f]]); }
  }
  if (!found) { console.log(`\nGeen redeneerketen tussen ${label(sA)} en ${label(sB)}`); process.exit(0); }
  console.log(`\nRedeneerketen ${label(sA)} → ${label(sB)}:`);
  found[1].forEach(f => console.log(`   ${label(f.s)} —${f.p}→ ${label(f.o)}`));
  console.log(`\n(de tutor kan dit antwoord aflopen zonder dat iemand het uitschreef)`);
}

if (cmd === 'units') {
  // Knowledge Units als AFGELEIDEN van semantische feiten (kandidaten, ter review).
  const id = findConcept(a); if (!id) { console.log(`geen concept "${a}"`); process.exit(0); }
  const fs_ = p => G.facts.filter(f => f.s === id && f.p === p);
  const L = x => label(x).toLowerCase();
  const units = [];
  const isa = fs_('is_a'); if (isa.length) units.push({ type: 'definitie', tekst: `Een ${L(id)} is een ${isa.map(f => L(f.o)).join(' en een ')}.` });
  const red = fs_('reduces'), inc = fs_('increases');
  if (red.length || inc.length) units.push({ type: 'werking', tekst: `Een ${L(id)}${red.length ? ' verlaagt de ' + red.map(f => L(f.o)).join(', ') : ''}${red.length && inc.length ? ' en' : ''}${inc.length ? ' verhoogt de ' + inc.map(f => L(f.o)).join(', ') : ''}.` });
  const part = fs_('has_part'), bind = G.facts.filter(f => f.p === 'binds_to' && f.o === (part[0] && part[0].o));
  if (part.length) units.push({ type: 'voorwaarden', tekst: `Een ${L(id)} heeft een ${L(part[0].o)}${bind.length ? ` waar het ${L(bind[0].s)} in past (sleutel-slot)` : ''}.` });
  // valkuil uit een causes→reduces keten die bij dit concept uitkomt
  for (const c of G.facts.filter(f => f.p === 'causes')) {
    const chain = G.facts.find(f => f.s === c.o && f.p === 'reduces');
    if (chain) units.push({ type: 'valkuil', tekst: `Bij ${L(c.s)} treedt ${L(c.o)} op, waardoor de ${L(chain.o)} daalt.` });
  }
  const herb = fs_('has_property').filter(f => f.o.includes('herbruikbaar'));
  if (herb.length) units.push({ type: 'valkuil', tekst: `Een ${L(id)} wordt niet verbruikt en kan opnieuw worden gebruikt.` });

  console.log(`\nAfgeleide knowledge units voor ${label(id)} (kandidaten, ter review):`);
  units.forEach(u => console.log(`  [${u.type}] ${u.tekst}`));
  console.log(`\n(${units.length} KU's — automatisch uit de semantische feiten; niet handgeschreven)`);
}
