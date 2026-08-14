#!/usr/bin/env node
/**
 * overclaim-check.js - Canonical Overclaim Check (ANALYZER). READ-ONLY, beslist NIET.
 *
 * Engineverbetering #2 (Slice-0 review): een canonical knowledge engine mag geen
 * absolute vereenvoudigingen als universele waarheid de content in laten lekken.
 * Deze linter scant PROZA (samenvattingen, vraagstammen, opties, uitleg) op
 * absolute kwantoren en meldt elke niet-gerechtvaardigde overclaim.
 *
 * Voorbeelden die het opspoort:
 *   "een enzym past bij PRECIES ÉÉN substraat"        → verboden overclaim
 *   "denaturatie wordt ALTIJD veroorzaakt door hoge temperatuur"
 *   "ALLEEN zetmeel past in het actief centrum"
 *
 * Onderdrukken van een terecht absolute bewering (bv. "elke lichaamscel heeft DNA"):
 * zet de marker  [[overclaim-ok:reden]]  in dezelfde regel/bewering. De linter
 * telt die dan als bewust-gerechtvaardigd (met bron), niet als issue.
 *
 * De check BESLIST niet - hij meet. De pipeline/DoD-gate E6 beslist:
 * 0 niet-gerechtvaardigde overclaims ⇒ pass.
 *
 *   node scripts/overclaim-check.js --file <pad>        één bestand (txt/md/html/js/json)
 *   node scripts/overclaim-check.js <niveau>            geshipte q-*.js + knowledge-*.js van een niveau
 *   node scripts/overclaim-check.js --file <pad> --json machine-leesbaar
 */
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const A = process.argv.slice(2);
const flag = n => { const i = A.indexOf('--' + n); return i < 0 ? undefined : (A[i + 1] && !A[i + 1].startsWith('--') ? A[i + 1] : true); };
const asJSON = A.includes('--json');
const niveau = A.find(x => !x.startsWith('--')) || 'havo';

// Twee niveaus. HARD = hoge-precisie dubieuze absoluten die als canonieke waarheid
// bijna nooit kloppen (gate-blokkerend). SOFT = kwantoren met veel legitieme
// betekenissen ("alleen"=slechts, "elk enzym heeft een actief centrum"=waar) -
// alleen ter review, blokkeren de gate niet. \b-grenzen tegen 'alleenstaand' e.d.
const HARD = [
  { re: /\bprecies\s+(?:één|een|1)\s+(?:substraat|type|soort|stof|reactie)/i, term: 'precies één X' },
  { re: /\buitsluitend\b/i, term: 'uitsluitend' },
  { re: /\bin\s+alle\s+gevallen\b/i, term: 'in alle gevallen' },
  { re: /\bwordt\s+altijd\s+(?:veroorzaakt|bepaald|gevormd)/i, term: 'wordt altijd veroorzaakt' },
  { re: /\balleen\s+\w+\s+(?:past|bindt|werkt|kan\s+binden)\b/i, term: 'alleen X past/werkt (exclusiviteit)' },
  { re: /\b(?:één|1)\s+enzym\s*=\s*(?:één|1)\s+substraat/i, term: '1 enzym = 1 substraat' },
];
const SOFT = [
  { re: /\balleen\b/i, term: 'alleen' },
  { re: /\baltijd\b/i, term: 'altijd' },
  { re: /\bnooit\b/i, term: 'nooit' },
  { re: /\b(?:elk|elke|ieder|iedere)\b/i, term: 'elk/ieder' },
  { re: /\bgeen\s+enkele?\b/i, term: 'geen enkele' },
];
// Termen die in vaste examen-idiomen legitiem zijn (verlagen severity, geen onderdrukking).
const SOFT_CONTEXT = /(?:precies|maar)\s+(?:één|een|1)\s+(?:juist|antwoord)|(?:juist|correct)\s+antwoord/i;

// Zinnen uit een tekst halen (ruwe splitsing; goed genoeg voor MC-content).
function sentences(txt) {
  return txt
    .replace(/<[^>]+>/g, ' ')          // strip html-tags
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')  // strip html-entities
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?…])\s+|\s*[|•·]\s*/)
    .map(s => s.trim())
    .filter(Boolean);
}

function scanText(txt, source) {
  const hits = [];
  for (const raw of sentences(txt)) {
    const suppressed = /\[\[overclaim-ok:[^\]]*\]\]/i.test(raw);
    const clean = () => raw.replace(/\[\[overclaim-ok:[^\]]*\]\]/gi, '').trim().slice(0, 200);
    const negatedAt = idx => /\b(niet|geen)\s+\S{0,14}$/i.test(raw.slice(0, idx));
    for (const p of HARD) {
      const m = p.re.exec(raw);
      if (!m) continue;
      hits.push({ source, term: p.term, severity: suppressed || negatedAt(m.index) ? 'gerechtvaardigd' : 'overclaim', zin: clean() });
    }
    for (const p of SOFT) {
      const m = p.re.exec(raw);
      if (!m) continue;
      if (suppressed || negatedAt(m.index) || SOFT_CONTEXT.test(raw)) continue; // ontkend/idioom → geen ruis
      hits.push({ source, term: p.term, severity: 'signaal', zin: clean() });
    }
  }
  return hits;
}

// ── invoer verzamelen ────────────────────────────────────────────
const targets = [];
if (flag('file')) {
  targets.push(flag('file'));
} else {
  const qdir = path.join(ROOT, 'q');
  if (fs.existsSync(qdir)) for (const f of fs.readdirSync(qdir)) if (f.startsWith(niveau + '-') && f.endsWith('.js')) targets.push(path.join('q', f));
  for (const f of [`knowledge-${niveau}.js`, `sam-${niveau}.js`]) if (fs.existsSync(path.join(ROOT, f))) targets.push(f);
}

let all = [];
for (const t of targets) {
  const abs = path.isAbsolute(t) ? t : path.join(ROOT, t);
  let txt; try { txt = fs.readFileSync(abs, 'utf8'); } catch (e) { console.error('  ! kan niet lezen: ' + t); continue; }
  all = all.concat(scanText(txt, t));
}

const over = all.filter(h => h.severity === 'overclaim');   // HARD → blokkeert gate
const soft = all.filter(h => h.severity === 'signaal');      // SOFT → alleen review
const okd = all.filter(h => h.severity === 'gerechtvaardigd');

if (asJSON) { console.log(JSON.stringify({ niveau, targets, hard: over.length, soft: soft.length, gerechtvaardigd: okd.length, hits: all }, null, 1)); process.exit(over.length ? 1 : 0); }

console.log(`\n═══ Overclaim-check ═══  (${targets.length} bron${targets.length === 1 ? '' : 'nen'})`);
if (!targets.length) { console.log('  (geen bronnen gevonden - nog geen geshipte content voor dit niveau)'); process.exit(0); }
if (!over.length) console.log('  ✓ 0 HARDE overclaims (gate E6: pass)');
for (const h of over) {
  console.log(`  ✗ HARD [${h.term}]  ${h.source}`);
  console.log(`      "${h.zin}"`);
}
if (soft.length) {
  console.log(`\n  ${soft.length} zacht signaal (kwantor met legitieme lezing - ter menselijke review, blokkeert niet):`);
  for (const h of soft.slice(0, 12)) console.log(`  · [${h.term}] "${h.zin.slice(0, 90)}"`);
  if (soft.length > 12) console.log(`  · … +${soft.length - 12} meer`);
}
if (okd.length) console.log(`\n  · ${okd.length} ontkend/idioom/gemarkeerd → correct, genegeerd`);
console.log(`\n  Gate E6 = 0 HARDE overclaims. Nu: ${over.length ? over.length + ' hard te herzien ⇒ FAIL' : 'pass'}.`);
console.log('  → HARD blokkeert; SOFT is een reviewhint. Scan bij voorkeur canonieke velden (samenvatting, juist antwoord, uitleg) - afleiders mógen bewust fout zijn.\n');
process.exit(over.length ? 1 : 0);
