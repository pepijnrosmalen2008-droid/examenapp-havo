#!/usr/bin/env node
/**
 * validate-content.mjs — inhoudsvalidatie over alle ~10.000 oefenvragen.
 * Vangt de fouten die bij handmatig/gegenereerd toevoegen sluipen: kapotte
 * correcte-antwoord-index, lege of dubbele antwoordopties, ontbrekende vraagtekst
 * en (per domein) exact-dubbele vragen.
 *
 *   node scripts/validate-content.mjs            # rapport + exit-code
 *   node scripts/validate-content.mjs --warnings # ook zachte waarschuwingen tonen
 *
 * Exit-code 0 = geen harde fouten (dubbele vragen/lege uitleg zijn waarschuwingen),
 * 1 = structurele fout gevonden (geschikt voor CI / pre-deploy, naast smoke.mjs).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const showWarn = process.argv.includes('--warnings');

function load(file, globalName) {
  const g = {};
  new Function('g', read(file) + '\ng.V = ' + globalName + ';')(g);
  return g.V;
}

const norm = s => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();

let errors = 0, warnings = 0, scanned = 0;
const errList = [], warnList = [];
function err(loc, msg) { errors++; errList.push(loc + ' — ' + msg); }
function warn(loc, msg) { warnings++; warnList.push(loc + ' — ' + msg); }

// Opties kunnen onder `o` óf `a` staan (twee conventies in de brondata; de app
// normaliseert `a`→`o` bij hydratatie). Beide accepteren we hier.
const opts = q => (Array.isArray(q.o) ? q.o : (Array.isArray(q.a) ? q.a : null));
// Oud-examenvragen zijn vaak OPEN (bron/ctx + vraag, modelantwoord in `u`); die
// dragen bewust één lege optie [""] en worden niet als meerkeuze gevalideerd.
function isOpen(q) { const o = opts(q); return o && o.length === 1 && !String(o[0] || '').trim(); }

function checkQuestion(q, loc) {
  scanned++;
  // 1. Vraagtekst aanwezig
  if (!q || typeof q.v !== 'string' || !q.v.trim()) { err(loc, 'lege of ontbrekende vraagtekst'); return; }
  // Open vraag: alleen vraag + (zacht) modelantwoord vereist.
  if (isOpen(q)) {
    if (!q.u || !String(q.u).trim()) warn(loc, 'open vraag zonder modelantwoord (u)');
    return;
  }
  // 2. Meerkeuze-opties
  const o = opts(q);
  if (!Array.isArray(o) || o.length < 2) { err(loc, 'minder dan 2 antwoordopties'); return; }
  const blanks = o.filter(x => typeof x !== 'string' || !x.trim()).length;
  if (blanks) err(loc, blanks + ' lege antwoordoptie(s)');
  const uniq = new Set(o.map(norm));
  if (uniq.size !== o.length) err(loc, 'dubbele antwoordopties');
  // 3. Correcte-antwoord-index
  if (typeof q.c !== 'number' || !Number.isInteger(q.c) || q.c < 0 || q.c >= o.length) {
    err(loc, 'correcte index c=' + JSON.stringify(q.c) + ' buiten bereik (0..' + (o.length - 1) + ')');
  }
  // 4. Uitleg (zacht)
  if (!q.u || !String(q.u).trim()) warn(loc, 'geen uitleg (u)');
}

function checkLevel(niveau, vakken) {
  vakken.forEach(vk => {
    (vk.domeinen || []).forEach(dom => {
      ['sv', 'oe'].forEach(soort => {
        const arr = dom[soort] || [];
        const seen = new Map();
        arr.forEach((q, i) => {
          const loc = `${niveau}/${vk.id}/${dom.id}/${soort}[${i}]`;
          checkQuestion(q, loc);
          const key = norm(q && q.v);
          if (key) {
            if (seen.has(key)) warn(loc, 'dubbele vraag (ook op index ' + seen.get(key) + ')');
            else seen.set(key, i);
          }
        });
      });
    });
  });
}

// Hand-geschreven VMBO-vraagbestanden (q/vmbo-*.js) draaien via __hydrateVak;
// we vangen de payload met een stub en valideren elke vraag per domein.
function checkVmboQ() {
  const qdir = path.join(ROOT, 'q');
  if (!fs.existsSync(qdir)) return;
  const files = fs.readdirSync(qdir).filter(f => /^vmbo-.+\.js$/.test(f));
  for (const f of files) {
    const vakId = f.replace(/^vmbo-|\.js$/g, '');
    let payload = null;
    try { new Function('__hydrateVak', read('q/' + f))((lvl, vk, p) => { payload = p; }); }
    catch (e) { err('vmbo/' + vakId, 'q-bestand laadt niet: ' + e.message); continue; }
    if (!payload) continue;
    for (const domId of Object.keys(payload)) {
      ['sv', 'oe'].forEach(soort => {
        const arr = payload[domId][soort] || [];
        const seen = new Map();
        arr.forEach((q, i) => {
          const loc = `vmbo/${vakId}/${domId}/${soort}[${i}]`;
          checkQuestion(q, loc);
          const key = norm(q && q.v);
          if (key) { if (seen.has(key)) warn(loc, 'dubbele vraag (ook op index ' + seen.get(key) + ')'); else seen.set(key, i); }
        });
      });
    }
  }
}

console.log('Inhoudsvalidatie — Slagio oefenvragen\n');
try {
  checkLevel('havo', load('data-havo.js', 'VAKKEN'));
  checkLevel('vwo', load('data-vwo.js', 'VAKKEN_VWO'));
  checkVmboQ();
} catch (e) {
  console.error('KON DATA NIET LADEN: ' + e.message);
  process.exit(1);
}

console.log(`Gescand: ${scanned} vragen`);
console.log(`Harde fouten: ${errors}`);
console.log(`Waarschuwingen: ${warnings} (dubbele vragen / ontbrekende uitleg)`);

if (errList.length) {
  console.log('\n✗ FOUTEN:');
  errList.slice(0, 60).forEach(m => console.log('  ✗ ' + m));
  if (errList.length > 60) console.log(`  … en ${errList.length - 60} meer`);
}
if (showWarn && warnList.length) {
  console.log('\n⚠ WAARSCHUWINGEN:');
  warnList.slice(0, 100).forEach(m => console.log('  ⚠ ' + m));
  if (warnList.length > 100) console.log(`  … en ${warnList.length - 100} meer`);
} else if (warnList.length) {
  console.log(`\n(gebruik --warnings om ${warnList.length} waarschuwingen te tonen)`);
}

console.log(errors ? '\n✗ Inhoudsvalidatie: harde fouten gevonden.' : '\n✓ Inhoudsvalidatie: geen harde fouten.');
process.exit(errors ? 1 : 0);
