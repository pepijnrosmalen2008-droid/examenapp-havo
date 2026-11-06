#!/usr/bin/env node
// vervang-figuren.mjs · knapt de figuren van een live leerdoel op zonder de rest te raken.
//   node scripts/vervang-figuren.mjs <niveau> <vak> <leerdoelId> <spec.json> [--droog]
// spec.json = lijst van figuur-specs (zie docs/FIGUREN.md), elk met "nr": welke figuur
// (1 = eerste .sam-figure in de samenvatting) hij vervangt. Schrijft content-pending/<niveau>-<vak>-<id>.html
// en SAM_RICH['<niveau>_<vak>_<id>'] in sam-<niveau>.js. Daarna: render-leerdoel, check-leerdoel, smoke.
import fs from 'node:fs';
import path from 'node:path';
import { maak } from './lib/figuur.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [niveau, vak, ld, specF] = process.argv.slice(2), droog = process.argv.includes('--droog');
if (!specF) { console.error('gebruik: node scripts/vervang-figuren.mjs <niveau> <vak> <leerdoelId> <spec.json> [--droog]'); process.exit(2); }
const key = `${niveau}_${vak}_${ld}`, samF = path.join(ROOT, `sam-${niveau}.js`);
let sam = fs.readFileSync(samF, 'utf8');
const live = (() => { const o = {}; new Function('SAM_RICH', sam)(o); return o[key]; })();
if (!live) { console.error(`${key} staat niet in sam-${niveau}.js`); process.exit(1); }
const RE = /<div class="sam-figure[^"]*">[\s\S]*?<div class="sam-figcap">[\s\S]*?<\/div><\/div>/g;
const oud = live.match(RE) || [];
let html = live;
for (const s of JSON.parse(fs.readFileSync(specF, 'utf8'))) {
  if (!s.nr || !oud[s.nr - 1]) throw new Error(`spec zonder geldige "nr" (er zijn ${oud.length} figuren)`);
  const { nr, ...rest } = s;
  html = html.replace(oud[nr - 1], maak(rest));
}
if (droog) { process.stdout.write(html); process.exit(0); }
fs.writeFileSync(path.join(ROOT, 'content-pending', `${niveau}-${vak}-${ld}.html`), html + (html.endsWith('\n') ? '' : '\n'));
const lit = html.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const kop = `'${key}':\``, at = sam.indexOf('\n' + kop);
if (at < 0) { console.error(`kan ${key} niet vinden als losse regel in sam-${niveau}.js`); process.exit(1); }
let j = at + 1 + kop.length;
while (j < sam.length && !(sam[j] === '`' && sam[j - 1] !== '\\')) j++;
sam = sam.slice(0, at + 1) + kop + lit + sam.slice(j);
const c = {}; new Function('SAM_RICH', sam)(c);
if (c[key] !== html) { console.error('controle mislukt: samenvatting niet goed weggeschreven'); process.exit(1); }
fs.writeFileSync(samF, sam);
console.log(`✓ ${key}: ${JSON.parse(fs.readFileSync(specF, 'utf8')).length} figuur/figuren vervangen. Nu: node scripts/render-leerdoel.mjs ${niveau} ${vak} ${ld}`);
