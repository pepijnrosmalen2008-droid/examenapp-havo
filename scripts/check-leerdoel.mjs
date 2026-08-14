#!/usr/bin/env node
/**
 * check-leerdoel.mjs - valideert een los leerdoel-content-bestand tegen de
 * gouden-standaard-poort VOORDAT het in data-havo.js wordt gezet.
 *
 *   node scripts/check-leerdoel.mjs <leerdoel.json> [samenvatting.html]
 *
 * Exit 0 = klaar voor integratie. Exit 1 = herstel eerst de gemelde punten.
 */
import fs from 'node:fs';

const jsonPath = process.argv[2];
const htmlPath = process.argv[3];
if (!jsonPath) { console.error('gebruik: node scripts/check-leerdoel.mjs <leerdoel.json> [samenvatting.html]'); process.exit(2); }

const raw = fs.readFileSync(jsonPath, 'utf8');
const ld = JSON.parse(raw);
const hard = [];
const norm = s => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();

// em dashes nergens
if (/—/.test(raw)) hard.push('em dash (—) gevonden in het JSON-bestand - vervang door - of :');

const sv = ld.sv || [];
if (sv.length < 25) hard.push(`sv: ${sv.length} < 25 vragen`);

const OVER = [
  /\bprecies\s+(?:één|een|1)\s+(?:substraat|type|soort|stof|reactie)/i,
  /\buitsluitend\b/i, /\bin\s+alle\s+gevallen\b/i,
  /\bwordt\s+altijd\s+(?:veroorzaakt|bepaald|gevormd)/i,
  /\balleen\s+\w+\s+(?:past|bindt|werkt|kan\s+binden)\b/i,
];
const negated = (s, idx) => /\b(niet|geen)\s+\S{0,14}$/i.test(s.slice(0, idx));
function overclaims(text) {
  const out = [];
  for (const sen of (text || '').split(/(?<=[.!?…])\s+/))
    for (const re of OVER) { const m = re.exec(sen); if (m && !negated(sen, m.index)) out.push(sen.trim().slice(0, 70)); }
  return out;
}

const cPos = [0, 0, 0, 0]; let longest = 0; const dLevels = new Set();
sv.forEach((q, i) => {
  const t = 'Q' + (i + 1); const o = q.o || [];
  if (!Array.isArray(o) || o.length !== 4 || o.some(x => !x || !String(x).trim())) hard.push(`${t}: geen 4 gevulde opties`);
  if (new Set(o.map(norm)).size !== o.length) hard.push(`${t}: dubbele opties`);
  if (!Number.isInteger(q.c) || q.c < 0 || q.c > 3) hard.push(`${t}: ongeldige c`); else cPos[q.c]++;
  if (![1, 2, 3].includes(q.d)) hard.push(`${t}: R-niveau d ontbreekt/ongeldig`); else dLevels.add(q.d);
  if (!q.u || String(q.u).length < 12) hard.push(`${t}: u te kort`);
  if (!Array.isArray(q.uo) || q.uo.length !== 4 || q.uo.some(w => !w || String(w).trim().length < 8)) hard.push(`${t}: uo (4 per-optie-uitleg) onvolledig`);
  if (!q.uh || String(q.uh).trim().length < 8) hard.push(`${t}: uh ontbreekt`);
  if ((q.v || '').length > 110) hard.push(`${t}: vraag te lang (${q.v.length})`);
  const canon = [o[q.c], ...(q.uo || []), q.u].join(' . ');
  overclaims(canon).forEach(s => hard.push(`${t}: overclaim -> "${s}"`));
  if (Array.isArray(o) && o.length === 4 && Number.isInteger(q.c)) { const L = o.map(x => String(x).length); if (L[q.c] === Math.max(...L)) longest++; }
});
const n = sv.length || 1;
const posShare = Math.max(...cPos) / (cPos.reduce((a, b) => a + b, 0) || 1);
if (posShare > 0.40) hard.push(`antwoordpositie-bias: ${(posShare * 100).toFixed(0)}% op positie (max 40%) - verdeling ${cPos.join('/')}`);
if (longest / n > 0.40) hard.push(`lengte-bias: juist = langste in ${longest}/${n} (max 40%) - verleng afleiders`);
if (![1, 2, 3].every(l => dLevels.has(l))) hard.push(`R-dekking: alleen ${[...dLevels].sort().join(',')} (R1-R3 alledrie vereist)`);

const beg = ld.begrippen || [];
if (beg.length < 8) hard.push(`begrippen: ${beg.length} < 8`);
beg.forEach((b, i) => { if (!b || !b.t || !String(b.t).trim()) hard.push(`begrip ${i + 1}: term ontbreekt`); if (!b || !b.d || String(b.d).trim().length < 12) hard.push(`begrip ${i + 1}: definitie te kort`); overclaims(String((b && b.d) || '')).forEach(s => hard.push(`begrip ${i + 1}: overclaim -> "${s}"`)); });

if (!(ld.oe && ld.oe.length >= 3)) hard.push(`oe: ${(ld.oe || []).length} < 3 oud-examenvragen`);
if (!ld.sam || String(ld.sam).length < 150) hard.push('sam (basis-stub) ontbreekt of te kort');
if (!ld.id || !ld.naam) hard.push('id of naam ontbreekt');

// samenvatting-HTML: elk hoofdstuk een afbeelding
if (htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  if (/—/.test(html)) hard.push('em dash (—) in de samenvatting-HTML');
  const chapters = (html.match(/class="sam-chapter"/g) || []).length;
  const figs = (html.match(/class="sam-figure"/g) || []).length;
  const svgs = (html.match(/<svg/g) || []).length;
  if (chapters < 3) hard.push(`samenvatting: ${chapters} hoofdstukken (>=3 vereist)`);
  if (figs < chapters) hard.push(`samenvatting: ${figs} figuren bij ${chapters} hoofdstukken - ELK hoofdstuk moet een afbeelding hebben`);
  if (svgs < chapters) hard.push(`samenvatting: ${svgs} svg's bij ${chapters} hoofdstukken`);
  if (!/class="sam-intro"/.test(html)) hard.push('samenvatting: sam-intro ontbreekt');
  if (!/class="sam-table"/.test(html)) hard.push('samenvatting: begrippenlijst (sam-table) ontbreekt');
}

console.log(`\n=== ${ld.id || '?'} ${ld.naam || ''} - ${sv.length} vragen, ${beg.length} begrippen, ${(ld.oe || []).length} oud-examen ===`);
if (!hard.length) { console.log('  ✓ KLAAR voor integratie: alle gouden-standaard-poorten gehaald.'); process.exit(0); }
console.log(`  positie ${cPos.join('/')} (max ${(posShare * 100).toFixed(0)}%) | lengte-bias ${longest}/${n} | R ${[...dLevels].sort().join(',')}`);
hard.forEach(m => console.log('  ✗ ' + m));
console.log(`\n  ${hard.length} punt(en) te herstellen.`);
process.exit(1);
