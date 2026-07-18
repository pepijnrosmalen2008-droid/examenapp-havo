#!/usr/bin/env node
/**
 * smoke.mjs — snelle rooktest zonder browser. Vangt de klasse fouten die een deploy
 * stil kunnen breken: data die niet parseert, samenvattingen die niet assembleren,
 * ontbrekende gecachte bestanden, of een vergeten SW-cachebump.
 *
 *   node scripts/smoke.mjs
 *
 * Exit-code 0 = alles goed, 1 = er is iets mis (geschikt voor CI / pre-deploy).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
let fails = 0, checks = 0;
function ok(msg) { checks++; console.log('  ✓ ' + msg); }
function bad(msg) { checks++; fails++; console.log('  ✗ ' + msg); }
function warn(msg) { console.log('  ⚠ ' + msg); }
function group(t) { console.log('\n' + t); }

// ── 1. syntax van de kern-app-bestanden ──
group('Syntax');
for (const f of ['data.js', 'sam-havo.js', 'sam-vwo.js', 'data-havo.js', 'data-vwo.js',
  'state.js', 'cloud.js', 'vak.js', 'quiz.js', 'lb.js', 'features.js', 'schedule.js',
  'sim.js', 'tools.js', 'init.js', 'v4.js', 'zoek.js', 'klas.js', 'profile.js',
  'sam-clip.js', 'sam-anim.js', 'ico-swap.js']) {
  try { new Function(read(f)); ok(f + ' parseert'); }
  catch (e) { bad(f + ' PARSE-FOUT: ' + e.message); }
}

// ── 2. samenvattingen (SAM_RICH) assembleren tot 143 domeinen ──
group('Samenvattingen (SAM_RICH)');
const g = {};
try {
  new Function('g', read('data.js') + '\n' + read('sam-havo.js') + '\n' + read('sam-vwo.js') +
    '\ng.S = SAM_RICH; g.er = typeof ensureSamData; g.sr = typeof samReady;')(g);
  const keys = Object.keys(g.S);
  keys.length === 143 ? ok('143 samenvattingen (' +
    keys.filter(k => k.startsWith('havo_')).length + ' havo + ' +
    keys.filter(k => k.startsWith('vwo_')).length + ' vwo)') : bad('verwacht 143, kreeg ' + keys.length);
  g.er === 'function' && g.sr === 'function' ? ok('ensureSamData/samReady bestaan') : bad('lazy-loaders ontbreken');
  const empty = keys.filter(k => !g.S[k] || g.S[k].length < 200);
  empty.length ? bad('lege/korte samenvattingen: ' + empty.join(', ')) : ok('geen lege samenvattingen');
} catch (e) { bad('SAM_RICH assembleren mislukt: ' + e.message); }

// ── 3. vakken + vragen ──
group('Vakken & vragen');
const vk = {};
try {
  new Function('g', read('data-havo.js') + '\n' + read('data-vwo.js') + '\ng.H = VAKKEN; g.V = VAKKEN_VWO;')(vk);
  function stat(V) { let q = 0, doms = 0, empty = 0; for (const vak of V) for (const d of vak.domeinen) { doms++; const n = (d.sv || []).length + (d.oe || []).length; q += n; if (n === 0) empty++; } return { vakken: V.length, doms, q, empty }; }
  const h = stat(vk.H), v = stat(vk.V);
  h.vakken === 12 ? ok('HAVO 12 vakken') : bad('HAVO ' + h.vakken + ' vakken (verwacht 12)');
  v.vakken === 16 ? ok('VWO 16 vakken') : bad('VWO ' + v.vakken + ' vakken (verwacht 16)');
  const tot = h.q + v.q;
  tot > 2000 ? ok(tot + ' vragen totaal') : bad('slechts ' + tot + ' vragen (mogelijk vragen verloren)');
  // Lege domeinen zijn grotendeels vaardigheden/keuzeonderwerpen (niet meerkeuze-toetsbaar).
  // Informatief, geen build-breuk; de echte regressie-rem is het totaalaantal hierboven.
  const emptyN = h.empty + v.empty;
  emptyN <= 16 ? warn(emptyN + ' domein(en) zonder vragen (verwacht: vaardigheden/keuze)') : bad(emptyN + ' lege domeinen — meer dan verwacht, mogelijk regressie');

  // Meta+split in sync met de volledige bron? (counts kloppen, elk q-bestand bestaat)
  try {
    for (const [metaFile, name, lvl, full] of [['data-havo.meta.js','VAKKEN','havo',vk.H],['data-vwo.meta.js','VAKKEN_VWO','vwo',vk.V]]) {
      const mg = {}; new Function('g', read(metaFile) + `\ng.M=${name};`)(mg);
      const metaTot = mg.M.reduce((s,vak)=>s+vak.domeinen.reduce((a,d)=>a+(d.nSv||0)+(d.nOe||0),0),0);
      const fullTot = full.reduce((s,vak)=>s+vak.domeinen.reduce((a,d)=>a+(d.sv||[]).length+(d.oe||[]).length,0),0);
      if (metaTot !== fullTot) { bad(`${metaFile} counts (${metaTot}) ≠ bron (${fullTot}) — draai split-data.js opnieuw`); }
      else ok(`${metaFile}: counts in sync (${metaTot})`);
      const missing = full.filter(vak => !fs.existsSync(path.join(ROOT, 'q', `${lvl}-${vak.id}.js`))).map(v=>v.id);
      missing.length ? bad(`q-bestanden ontbreken: ${missing.join(', ')}`) : ok(`alle ${full.length} q-bestanden aanwezig (${lvl})`);
    }
  } catch (e) { bad('meta/split-controle mislukt: ' + e.message); }
} catch (e) { bad('VAKKEN laden mislukt: ' + e.message); }

// ── 4. service worker: cache-versie + alle ASSETS bestaan ──
group('Service worker & assets');
try {
  const sw = read('sw.js');
  const cache = (sw.match(/const CACHE\s*=\s*'([^']+)'/) || [])[1];
  cache ? ok('cache-versie: ' + cache) : bad('geen CACHE-versie gevonden in sw.js');
  const assets = (sw.match(/const ASSETS\s*=\s*\[([\s\S]*?)\]/) || [])[1] || '';
  const files = [...assets.matchAll(/'([^']+)'/g)].map(m => m[1]).filter(p => p !== '/' && !p.startsWith('http'));
  let miss = files.filter(p => !fs.existsSync(path.join(ROOT, p.replace(/^\//, ''))));
  miss.length ? bad('ASSETS ontbreken op schijf (addAll faalt → geen offline): ' + miss.join(', ')) : ok('alle ' + files.length + ' ASSETS bestaan');
  // scripts die de app laadt moeten ook gecof/geladen zijn
  const idx = read('index.html');
  for (const need of ['/ico-swap.js', '/sam-clip.js', '/data.js']) {
    idx.includes(need) ? ok('index.html laadt ' + need) : bad('index.html laadt ' + need + ' niet');
  }
} catch (e) { bad('SW-check mislukt: ' + e.message); }

// ── uitslag ──
console.log('\n' + (fails ? '✗ ' + fails + ' van ' + checks + ' checks GEFAALD' : '✓ alle ' + checks + ' checks geslaagd'));
process.exit(fails ? 1 : 0);
