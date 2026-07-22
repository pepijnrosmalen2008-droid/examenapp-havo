#!/usr/bin/env node
/**
 * leerdoel-dekking.js — DRY-RUN dekkingsrapport voor de Curriculum Intelligence
 * Layer (F1 / M1). Matcht bestaande vragen op leerdoelen en rapporteert de
 * dekking. Schrijft NIETS: er wordt geen `lo`-veld toegevoegd, geen bestand
 * aangepast. Puur ter beoordeling van de pilotstructuur.
 *
 *   node scripts/leerdoel-dekking.js            # standaard: havo bi
 *   node scripts/leerdoel-dekking.js havo bi
 *
 * Matchstrategie (grof → fijn), conform het ontwerp §3.2:
 *   1. concept-match  — de vraag/afleiders bevatten een `concept` van een leerdoel
 *                       (specifieker leerdoel wint via langere-concept-weging)
 *   2. domein-fallback — geen concepthit → het eerste leerdoel van het domein
 */
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

const [, , NIVEAU = 'havo', VAKID = 'bi'] = process.argv;

// ── data laden (zonder de app te draaien) ──
const dg = {};
new Function('g', read(`data-${NIVEAU}.js`) + `\ng.V = (typeof VAKKEN!=='undefined'?VAKKEN:VAKKEN_VWO);`)(dg);
const kg = {};
new Function('g', read(`knowledge-${NIVEAU}.js`) + '\ng.L = LEERDOELEN;')(kg);
const VAKKEN = dg.V, LEERDOELEN = kg.L;

const vak = VAKKEN.find(v => v.id === VAKID);
if (!vak) { console.error(`Vak ${VAKID} niet gevonden in data-${NIVEAU}.js`); process.exit(1); }

// ── concept-matcher ──
function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function conceptHit(concept, hay) {
  const c = concept.toLowerCase();
  // korte, puur-alfabetische termen (Cel, DNA) → woordgrens, anders over-matchen ze
  if (/^[a-zà-ÿ]{1,4}$/.test(c)) return new RegExp('\\b' + esc(c) + '\\b', 'i').test(hay);
  return hay.includes(c);
}

// bouw index: domein → leerdoelen
function domLeerdoelen(domId) {
  const key = `${VAKID}_${domId}`;
  return (LEERDOELEN[key] && LEERDOELEN[key].leerdoelen) || [];
}

// per leerdoel-id tellers
const tally = {};       // id → {n, concept, fallback}
const allLd = [];
for (const d of vak.domeinen) for (const ld of domLeerdoelen(d.id)) {
  tally[ld.id] = { n: 0, concept: 0, fallback: 0, titel: ld.titel, dom: d.id, rel: ld.examenrelevantie, vd: ld.vaardigheid, es: ld.examenskill };
  allLd.push(ld.id);
}

let totalQ = 0, matchedConcept = 0, matchedFallback = 0, noLeerdoelenDom = 0;
const domSummary = [];

for (const d of vak.domeinen) {
  const lds = domLeerdoelen(d.id);
  const qs = [...(d.sv || []), ...(d.oe || [])];
  totalQ += qs.length;
  if (!lds.length) { noLeerdoelenDom += qs.length; domSummary.push({ dom: d.id, naam: d.naam, q: qs.length, lds: 0 }); continue; }
  const fallbackId = lds[0].id;
  for (const q of qs) {
    const hay = ((q.v || '') + ' ' + ((q.o || q.a || []).join(' '))).toLowerCase();
    let best = null, bestScore = 0;
    for (const ld of lds) {
      let score = 0;
      for (const c of (ld.concepten || [])) if (conceptHit(c, hay)) score += c.length;
      if (score > bestScore) { bestScore = score; best = ld.id; }
    }
    if (best) { tally[best].n++; tally[best].concept++; matchedConcept++; }
    else { tally[fallbackId].n++; tally[fallbackId].fallback++; matchedFallback++; }
  }
  domSummary.push({ dom: d.id, naam: d.naam, q: qs.length, lds: lds.length });
}

// ── rapport ──
const pad = (s, n) => String(s).padEnd(n).slice(0, n);
const padL = (s, n) => String(s).padStart(n);
console.log(`\n═══ Leerdoel-dekkingsrapport (DRY-RUN, niets geschreven) ═══`);
console.log(`Vak: ${vak.naam} (${NIVEAU}/${VAKID}) · ${allLd.length} leerdoelen · ${totalQ} vragen\n`);

for (const ds of domSummary) {
  console.log(`── [${ds.dom}] ${ds.naam}  (${ds.lds} leerdoelen, ${ds.q} vragen)`);
  if (!ds.lds) { console.log('   ⚠ geen leerdoelen gedefinieerd voor dit domein'); continue; }
  console.log('   ' + pad('leerdoel', 9) + pad('titel', 40) + padL('#vr', 5) + padL('concept', 9) + padL('fallb', 7) + '  rel/vaardigh/examenskill');
  for (const id of allLd.filter(i => tally[i].dom === ds.dom)) {
    const t = tally[id];
    const flag = t.n === 0 ? ' ⚠0' : '';
    console.log('   ' + pad(id, 9) + pad(t.titel, 40) + padL(t.n, 5) + padL(t.concept, 9) + padL(t.fallback, 7) +
      `  ${t.rel}/${t.vd}/${t.es}${flag}`);
  }
  console.log('');
}

const zero = allLd.filter(i => tally[i].n === 0);
const pct = totalQ ? (matchedConcept / totalQ * 100) : 0;
console.log('─── Samenvatting ───');
console.log(`  vragen totaal          : ${totalQ}`);
console.log(`  via concept-match      : ${matchedConcept}  (${pct.toFixed(1)}%)`);
console.log(`  via domein-fallback    : ${matchedFallback}  (${(100 - pct).toFixed(1)}%)`);
console.log(`  domeinen zonder leerdoelen: ${noLeerdoelenDom} vragen`);
console.log(`  leerdoelen met 0 vragen: ${zero.length}${zero.length ? '  → ' + zero.join(', ') : ''}`);
console.log(`\n  (⚠0 = leerdoel zonder gekoppelde vraag = kandidaat voor F2-generatie)`);
console.log(`  NB: dit is een dry-run — er is NIETS naar data-${NIVEAU}.js of q/ geschreven.\n`);
