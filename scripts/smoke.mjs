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

// ── 5. regressie-guards (fixes die stil kunnen terugbreken) ──
group('Regressie-guards');
// 5a. Mobiel leaderboard bereikbaar: de sociaal-sectie (route naar leaderboard)
//     mag op mobiel NIET met display:none verborgen worden.
try {
  const css = read('styles.css');
  // De sectie mág op DESKTOP (min-width) verborgen worden (daar telt de bento-route),
  // maar NIET met display:none!important en NIET in een mobiel/basis-scope.
  // Bug-signatuur die we bewaken: een harde !important-hide (zat in de max-width:640-blok).
  const hardHide = /\.hm-sociaal-section[^{}]*\{[^}]*display\s*:\s*none\s*!important/i.test(css);
  hardHide ? bad('.hm-sociaal-section wordt met display:none!important verborgen — leaderboard onbereikbaar op mobiel')
           : ok('.hm-sociaal-section niet hard verborgen (leaderboard bereikbaar op mobiel)');
  const idx = read('index.html');
  idx.includes("show('sc-leaderboard')") && idx.includes('hm-soc-lb')
    ? ok('home heeft leaderboard-knop (.hm-soc-lb)')
    : bad('leaderboard-knop (.hm-soc-lb) ontbreekt in index.html');
} catch (e) { bad('CSS/leaderboard-check mislukt: ' + e.message); }

// 5b. Leaderboard-bots: mens-bots hebben een dier-avatar (animalId + stage),
//     robot-bots houden een emoji-avatar. Dit voedt de "opvulling".
try {
  const lg = {};
  new Function('g', read('lb.js').match(/const _BOT_VAKNAAM=[\s\S]*?const LB_BOTS=\{[\s\S]*?\n\};/)[0] +
    '\ng.B = LB_BOTS; g.stage = _botStage;')(lg);
  for (const niveau of ['havo', 'vwo']) {
    const bots = lg.B[niveau] || [];
    const human = bots.filter(b => b.animalId);
    const robot = bots.filter(b => !b.animalId);
    bots.length >= 12 ? ok(`${niveau}: ${bots.length} bots (opvulling)`) : bad(`${niveau}: te weinig bots (${bots.length})`);
    human.length >= 5 && human.every(b => b.animalId && b.stageIdx != null && b.avatar == null)
      ? ok(`${niveau}: ${human.length} mens-bots met dier-avatar + stage`)
      : bad(`${niveau}: mens-bots missen animalId/stage`);
    robot.length >= 4 && robot.every(b => b.avatar && b.animalId == null)
      ? ok(`${niveau}: ${robot.length} robot-bots met emoji-avatar`)
      : bad(`${niveau}: robot-bots missen emoji-avatar`);
  }
  // stage-mapping monotone check
  lg.stage(950) === 5 && lg.stage(940) === 5 && lg.stage(450) === 2 && lg.stage(100) === 1
    ? ok('_botStage schaalt score → evolutie-stage')
    : bad('_botStage geeft onverwachte stage');
} catch (e) { bad('LB_BOTS-check mislukt: ' + e.message); }

// 5c. Registratie-foutmelding: authErrMsg toont de ECHTE fout i.p.v. hem te
//     verbergen achter een generieke tekst (anders is registreren "kapot").
try {
  const cg = {};
  new Function('g', read('cloud.js').match(/function authErrMsg[\s\S]*?\n\}/)[0] + '\ng.f = authErrMsg;')(cg);
  const f = cg.f;
  f('Email signups are disabled').includes('tijdelijk uit')
    ? ok('authErrMsg: signups-disabled → duidelijke melding') : bad('authErrMsg mist signups-disabled-melding');
  f('User already registered').includes('al in gebruik')
    ? ok('authErrMsg: reeds-geregistreerd → nette melding') : bad('authErrMsg mist already-registered-melding');
  f('Some weird unexpected error XYZ').includes('XYZ')
    ? ok('authErrMsg: onbekende fout toont echte tekst') : bad('authErrMsg verbergt onbekende fout (registreren lijkt kapot)');
  f('') && !f('').includes('undefined')
    ? ok('authErrMsg: lege fout → veilige fallback') : bad('authErrMsg faalt op lege input');
} catch (e) { bad('authErrMsg-check mislukt: ' + e.message); }

// 5d. Curriculum Intelligence (F1): leerdoelen + koppeling-sidecar integer.
group('Curriculum Intelligence (F1)');
try {
  const lg = {}; new Function('g', read('knowledge-havo.js') + '\ng.L = LEERDOELEN;')(lg);
  // verzamel alle geldige leerdoel-id's + controleer id-schema
  const ids = new Set(); let ldCount = 0, badId = 0, sharedConcept = 0;
  const conceptOwner = {};
  for (const [k, v] of Object.entries(lg.L)) {
    for (const ld of (v.leerdoelen || [])) {
      ldCount++; ids.add(ld.id);
      if (!/^[a-z]{2}\.[A-Z]\.\d+$/.test(ld.id)) badId++;
      for (const c of (ld.concepten || [])) (conceptOwner[c] = conceptOwner[c] || new Set()).add(ld.id);
    }
  }
  ldCount >= 20 ? ok(`${ldCount} leerdoelen (bi-pilot)`) : bad(`te weinig leerdoelen (${ldCount})`);
  badId === 0 ? ok('alle leerdoel-id\'s volgen vak.domein.volgnr') : bad(`${badId} leerdoel-id's met fout schema`);
  const shared = Object.entries(conceptOwner).filter(([, s]) => s.size > 1);
  shared.length === 0 ? ok('geen concept in >1 leerdoel (geen ambiguïteit)') : bad('gedeelde concepten: ' + shared.map(([c]) => c).join(', '));

  // sidecar: elke koppeling verwijst naar bestaand leerdoel; provenance geldig
  const cg = {}; new Function('g', read('knowledge-koppeling-havo.js') + '\ng.K = LO_KOPPELING;')(cg);
  const bi = cg.K.bi || {};
  const entries = Object.values(bi);
  const badLo = entries.filter(e => !ids.has(e.lo));
  const badConf = entries.filter(e => typeof e.confidence !== 'number' || e.confidence < 0 || e.confidence > 1);
  const badSrc = entries.filter(e => !['concept_match', 'fallback', 'manual_override'].includes(e.source));
  entries.length > 0 ? ok(`sidecar: ${entries.length} koppelingen`) : bad('sidecar leeg');
  badLo.length === 0 ? ok('alle koppelingen → bestaand leerdoel') : bad(`${badLo.length} koppelingen naar onbekend leerdoel`);
  badConf.length === 0 ? ok('alle confidence-waarden in [0,1]') : bad(`${badConf.length} ongeldige confidence-waarden`);
  badSrc.length === 0 ? ok('alle source-waarden geldig') : bad(`${badSrc.length} ongeldige source-waarden`);

  // koppeling in sync met de bron: elke qkey hoort bij een echte bi-vraag, en alle vragen gedekt
  const vk2 = {}; new Function('g', read('data-havo.js') + '\ng.H = VAKKEN;')(vk2);
  const biVak = vk2.H.find(v => v.id === 'bi');
  const qkeys = new Set();
  for (const d of biVak.domeinen) for (const q of [...(d.sv || []), ...(d.oe || [])]) qkeys.add((q.v || '').slice(0, 80));
  const orphan = Object.keys(bi).filter(k => !qkeys.has(k));
  const uncovered = [...qkeys].filter(k => !bi[k]);
  orphan.length === 0 ? ok('geen wees-koppelingen (sidecar ⊆ bron)') : bad(`${orphan.length} koppelingen zonder vraag — draai tag-leerdoelen.js opnieuw`);
  uncovered.length === 0 ? ok(`alle ${qkeys.size} bi-vragen gekoppeld`) : bad(`${uncovered.length} bi-vragen zonder koppeling`);
} catch (e) { bad('F1-integriteitscheck mislukt: ' + e.message); }

// ── uitslag ──
console.log('\n' + (fails ? '✗ ' + fails + ' van ' + checks + ' checks GEFAALD' : '✓ alle ' + checks + ' checks geslaagd'));
process.exit(fails ? 1 : 0);
