#!/usr/bin/env node
/**
 * integreer-leerdoel.mjs - zet één gekeurde leerdoel-module op zijn plek.
 *
 *   node scripts/integreer-leerdoel.mjs <niveau> <vak> <domein> <leerdoel.json> <samenvatting.html>
 *
 * - data-<niveau>.js: module in domein.leerdoelen[] (zelfde id = vervangen, anders erbij,
 *   gesorteerd op nummer). Het bestand wordt in exact hetzelfde formaat teruggeschreven.
 * - sam-<niveau>.js: SAM_RICH['<niveau>_<vak>_<leerdoelId>'] (vervangen of toegevoegd).
 * Draai eerst check-leerdoel.mjs en render-leerdoel.mjs --html; daarna split-data.js.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [niveau, vakId, domId, jsonPath, htmlPath] = process.argv.slice(2);
if (!htmlPath) { console.error('gebruik: node scripts/integreer-leerdoel.mjs <niveau> <vak> <domein> <leerdoel.json> <samenvatting.html>'); process.exit(2); }
const VAR = { havo: 'VAKKEN', vwo: 'VAKKEN_VWO', vmbo: 'VAKKEN_VMBO' }[niveau];
if (!VAR) { console.error('onbekend niveau'); process.exit(2); }

const ld = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const html = fs.readFileSync(htmlPath, 'utf8').trim();
if (!ld.id) { console.error('leerdoel.json mist id'); process.exit(1); }

// ── data ──
const dataF = path.join(ROOT, `data-${niveau}.js`);
const src = fs.readFileSync(dataF, 'utf8');
const g = {}; new Function('g', src + `\ng.V=${VAR};`)(g);
const pretty = src.startsWith(`var ${VAR} = [\n`);
const ser = V => `var ${VAR} = ` + (pretty ? JSON.stringify(V, null, 1) : JSON.stringify(V)) + ';';
if (ser(g.V) !== src) { console.error(`data-${niveau}.js komt niet identiek terug na inlezen; ik schrijf niets.`); process.exit(1); }
const vak = g.V.find(v => v.id === vakId); if (!vak) { console.error('vak niet gevonden: ' + vakId); process.exit(1); }
const dom = vak.domeinen.find(d => d.id === domId); if (!dom) { console.error('domein niet gevonden: ' + domId); process.exit(1); }
if (!Array.isArray(dom.leerdoelen)) dom.leerdoelen = [];
const i = dom.leerdoelen.findIndex(l => l.id === ld.id);
if (i >= 0) dom.leerdoelen[i] = ld; else dom.leerdoelen.push(ld);
const nr = id => parseInt(String(id).replace(/\D+/g, ''), 10) || 0;
dom.leerdoelen.sort((a, b) => nr(a.id) - nr(b.id));
fs.writeFileSync(dataF, ser(g.V));

// ── samenvatting ──
const samF = path.join(ROOT, `sam-${niveau}.js`);
let sam = fs.readFileSync(samF, 'utf8');
const key = `${niveau}_${vakId}_${ld.id}`;
const lit = html.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const kop = `'${key}':\``;
const at = sam.indexOf('\n' + kop);
if (at >= 0) {
  let j = at + 1 + kop.length;
  while (j < sam.length && !(sam[j] === '`' && sam[j - 1] !== '\\')) j++;
  sam = sam.slice(0, at + 1) + kop + lit + sam.slice(j);
} else {
  const eind = sam.lastIndexOf('\n});');
  if (eind < 0) { console.error(`kan het einde van sam-${niveau}.js niet vinden`); process.exit(1); }
  const voor = sam.slice(0, eind).replace(/\s*$/, '');
  sam = voor + (voor.endsWith(',') ? '' : ',') + '\n' + kop + lit + '`' + sam.slice(eind);
}
fs.writeFileSync(samF, sam);
// controle: laadt het nog en staat de tekst er precies in?
const c = { SAM_RICH: {} }; new Function('SAM_RICH', sam)(c.SAM_RICH);
if (c.SAM_RICH[key] !== html) { console.error('controle mislukt: samenvatting niet goed weggeschreven'); process.exit(1); }
console.log(`✓ ${niveau}/${vakId}/${domId}: leerdoel ${ld.id} ${i >= 0 ? 'vervangen' : 'toegevoegd'} (${(ld.sv || []).length} vragen), samenvatting ${key} (${html.length} tekens).`);
console.log('  volgende stap: node scripts/split-data.js');
