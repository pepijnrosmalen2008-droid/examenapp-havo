#!/usr/bin/env node
/**
 * build-foutenboek-meta.js — genereert de SHIPPED verrijkingslaag voor Foutenboek 2.0.
 *
 * Foutenboek 2.0 slaat iedere fout van een leerling op. Om die fout te verrijken met
 * "waarom ging dit fout?" (leerdoel + misconceptie + concept) heeft de student-app een
 * compacte, lazy-geladen mapping nodig: qkey → { lt, m, c }.
 *
 * Bron (NIET met de hand bewerken — dit is een afgeleide):
 *   - knowledge-koppeling-<niveau>.js  (LO_KOPPELING: vraag → leerdoel, met status)
 *   - knowledge-<niveau>.js            (LEERDOELEN: titel, misconcepties, concepten)
 *
 * Alleen 'matched' koppelingen (concept_match | manual_override) worden verrijkt — die
 * hebben een betrouwbaar leerdoel. off_level/fallback → geen verrijking (fout wordt nog
 * steeds opgeslagen in de app, maar zonder "waarom fout").
 *
 *   node scripts/build-foutenboek-meta.js [havo|vwo]
 */
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const niveau = process.argv[2] || 'havo';

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// LEERDOELEN laden
const kg = {}; new Function('g', read(`knowledge-${niveau}.js`) + '\ng.L=LEERDOELEN;')(kg);
const byId = {};
for (const b of Object.values(kg.L)) for (const ld of (b.leerdoelen || [])) byId[ld.id] = ld;

// LO_KOPPELING laden
const kc = {}; new Function('g', read(`knowledge-koppeling-${niveau}.js`) + '\ng.K=LO_KOPPELING;')(kc);
const KOPP = kc.K || {};

// Twee tabellen (dedup): FB_LO = leerdoel → {lt,m,c} (~80 stuks);
// FB_META[vak][qkey] = leerdoel-id (verwijst naar FB_LO). Scheelt ~10× in bytes.
const LO = {};
const META = {};
let nTot = 0, nVerrijkt = 0;
for (const [vak, qmap] of Object.entries(KOPP)) {
  const out = {};
  for (const [qkey, e] of Object.entries(qmap)) {
    nTot++;
    if (e.status !== 'matched' || !e.lo) continue; // alleen betrouwbare koppelingen
    const ld = byId[e.lo]; if (!ld) continue;
    if (!LO[ld.id]) {
      const rec = { lt: ld.titel };
      const m = (ld.veelgemaakteFouten || [])[0] || null;
      const c = (ld.concepten || [])[0] || null;
      if (m) rec.m = m;
      if (c) rec.c = c;
      LO[ld.id] = rec;
    }
    out[qkey] = ld.id;
    nVerrijkt++;
  }
  if (Object.keys(out).length) META[vak] = out;
}

// deterministisch schrijven (vakken + keys + leerdoelen gesorteerd)
const sortedLO = {}; for (const id of Object.keys(LO).sort()) sortedLO[id] = LO[id];
const sorted = {};
for (const vak of Object.keys(META).sort()) {
  sorted[vak] = {};
  for (const k of Object.keys(META[vak]).sort()) sorted[vak][k] = META[vak][k];
}

const banner = `// ═══════════════════════════════════════════════════════════════════════
// foutenboek-meta-${niveau}.js — GEGENEREERD door scripts/build-foutenboek-meta.js
// Verrijkingslaag voor Foutenboek 2.0: koppelt een foute vraag aan het leerdoel
// + de misconceptie erachter ("waarom ging dit fout?"). NIET met de hand bewerken.
// FB_LO[loId]   = { lt: leerdoel-titel, m?: misconceptie, c?: concept }
// FB_META[vak][qkey] = loId   (qkey = "<domeinId>|<eerste 80 tekens van vraag.v>")
// Alleen betrouwbaar-gekoppelde (matched) vragen worden verrijkt.
// ═══════════════════════════════════════════════════════════════════════
`;
const body = `var FB_LO = (typeof FB_LO !== 'undefined' && FB_LO) || {};\n` +
  `Object.assign(FB_LO, ${JSON.stringify(sortedLO)});\n` +
  `var FB_META = (typeof FB_META !== 'undefined' && FB_META) || {};\n` +
  Object.entries(sorted).map(([vak, m]) => `FB_META[${JSON.stringify(vak)}] = ${JSON.stringify(m)};`).join('\n') + '\n';

fs.writeFileSync(path.join(ROOT, `foutenboek-meta-${niveau}.js`), banner + body);
console.log(`✓ foutenboek-meta-${niveau}.js — ${nVerrijkt} verrijkt / ${nTot} koppelingen · vakken: ${Object.keys(sorted).join(', ')}`);
