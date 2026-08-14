#!/usr/bin/env node
/**
 * validate-goldstandard.mjs — de afdwingbare GOUDEN-STANDAARD-poort.
 *
 * Toetst een leerdoel-module (vak + domein) tegen de Slagio-contentstandaard.
 * Een module die hierdoor komt, is publicatie-waardig als gouden standaard.
 * HARD = blokkeert (exit 1). SOFT = waarschuwing (blokkeert niet).
 *
 * Blueprint van een af leerdoel (zie docs/SLICE0-DEFINITION-OF-DONE.md §7):
 *   vraag = { v, o[4], c, d(1..3), u, uo[4], uh }
 *   - v   ≤ 110 tekens
 *   - o   4 niet-lege, unieke opties
 *   - c   geldige index (0..3)
 *   - d   R-niveau 1..3
 *   - u   onthoud/takeaway (> 12 tekens)
 *   - uo  4 per-optie-uitleg (elk niet-leeg) — de slimme, keuze-specifieke uitleg
 *   - uh  onthoud-tip (niet-leeg)
 *
 * Module-eisen: antwoordpositie-balans, geen lengte-bias, geen overclaim in de
 * canonieke velden (juist antwoord + uo + u), leerdoel-koppeling (matched),
 * R-dekking, bankdiepte.
 *
 *   node scripts/validate-goldstandard.mjs            # alle gemarkeerde modules
 *   node scripts/validate-goldstandard.mjs havo bi M3 # één module
 */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// Modules die de gouden standaard MOETEN halen (uitbreiden bij elke go-live).
const GOLDEN = [{ niveau: 'havo', vak: 'bi', dom: 'M3' }];
const A = process.argv.slice(2);
const targets = A.length >= 3 ? [{ niveau: A[0], vak: A[1], dom: A[2] }] : GOLDEN;

const MIN_BANK = 25;          // SOFT: streefdiepte per leerdoel
const MAX_STEM = 110;         // HARD: max vraaglengte
const MAX_POS_SHARE = 0.40;   // HARD: max aandeel juist antwoord op één positie
const MAX_LONGEST = 0.40;     // HARD: max aandeel vragen waar juist = langste optie

// Overclaim HARD-patronen (spiegelt scripts/overclaim-check.js).
const OVER = [
  { re: /\bprecies\s+(?:één|een|1)\s+(?:substraat|type|soort|stof|reactie)/i, t: 'precies één X' },
  { re: /\buitsluitend\b/i, t: 'uitsluitend' },
  { re: /\bin\s+alle\s+gevallen\b/i, t: 'in alle gevallen' },
  { re: /\bwordt\s+altijd\s+(?:veroorzaakt|bepaald|gevormd)/i, t: 'wordt altijd veroorzaakt' },
  { re: /\balleen\s+\w+\s+(?:past|bindt|werkt|kan\s+binden)\b/i, t: 'alleen X past/werkt' },
];
const negated = (s, idx) => /\b(niet|geen)\s+\S{0,14}$/i.test(s.slice(0, idx));
function overclaims(text) {
  const out = [];
  for (const sen of (text || '').split(/(?<=[.!?…])\s+/)) {
    for (const p of OVER) { const m = p.re.exec(sen); if (m && !negated(sen, m.index)) out.push(p.t + ' → "' + sen.trim().slice(0, 90) + '"'); }
  }
  return out;
}

// ── bron laden ──
const load = (file, name) => { const g = {}; new Function('g', read(file) + `\ng.V=${name};`)(g); return g.V; };
const norm = s => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();

let hardTotal = 0, softTotal = 0;
for (const t of targets) {
  const VAKKEN = load(`data-${t.niveau}.js`, t.niveau === 'havo' ? 'VAKKEN' : 'VAKKEN_VWO');
  const vak = VAKKEN.find(v => v.id === t.vak);
  // Zoek eerst als top-level domein, anders als leerdoel binnen een domein.
  let dom = vak && vak.domeinen.find(d => d.id === t.dom);
  if (vak && !dom) for (const D of vak.domeinen) { const ld = (D.leerdoelen || []).find(l => l.id === t.dom); if (ld) { dom = ld; break; } }
  const hard = [], soft = [];
  if (!dom) { console.log(`\n═══ ${t.niveau}/${t.vak}/${t.dom} — NIET GEVONDEN ═══`); hardTotal++; continue; }
  const sv = dom.sv || [];

  // koppeling
  let KOPP = {};
  try { const c = {}; new Function('g', read(`knowledge-koppeling-${t.niveau}.js`) + '\ng.K=LO_KOPPELING;')(c); KOPP = (c.K && c.K[t.vak]) || {}; } catch (e) {}

  const cPos = [0, 0, 0, 0]; let longest = 0; const dLevels = new Set();
  sv.forEach((q, i) => {
    const tag = `Q${i + 1}`;
    const o = q.o || [];
    if (!Array.isArray(o) || o.length !== 4 || o.some(x => !x || !String(x).trim())) hard.push(`${tag}: geen 4 gevulde opties`);
    if (new Set(o.map(norm)).size !== o.length) hard.push(`${tag}: dubbele opties`);
    if (!Number.isInteger(q.c) || q.c < 0 || q.c >= o.length) hard.push(`${tag}: ongeldige c`); else cPos[q.c]++;
    if (![1, 2, 3].includes(q.d)) hard.push(`${tag}: R-niveau (d) ontbreekt/ongeldig`); else dLevels.add(q.d);
    if (!q.u || String(q.u).length < 12) hard.push(`${tag}: u (takeaway) te kort/ontbreekt`);
    if (!Array.isArray(q.uo) || q.uo.length !== 4 || q.uo.some(w => !w || String(w).trim().length < 8)) hard.push(`${tag}: uo (4 per-optie-uitleg) onvolledig`);
    if (!q.uh || String(q.uh).trim().length < 8) hard.push(`${tag}: uh (onthoud-tip) ontbreekt`);
    if ((q.v || '').length > MAX_STEM) hard.push(`${tag}: vraag te lang (${q.v.length} > ${MAX_STEM})`);
    // canonieke overclaim: juist antwoord + alle uo + u (NIET de afleiders)
    const canon = [o[q.c], ...(q.uo || []), q.u].join(' . ');
    overclaims(canon).forEach(m => hard.push(`${tag}: overclaim ${m}`));
    // lengte-bias
    if (Array.isArray(o) && o.length === 4 && Number.isInteger(q.c)) {
      const L = o.map(x => String(x).length); if (L[q.c] === Math.max(...L)) longest++;
    }
    // koppeling
    const e = KOPP[t.dom + '|' + (q.v || '').slice(0, 80)];
    if (!e) hard.push(`${tag}: geen leerdoel-koppeling`);
    else if (e.status !== 'matched' || !e.lo) hard.push(`${tag}: koppeling niet 'matched' (${e.status})`);
  });

  // module-niveau
  const n = sv.length || 1;
  const posShare = Math.max(...cPos) / (cPos.reduce((a, b) => a + b, 0) || 1);
  if (posShare > MAX_POS_SHARE) hard.push(`antwoordpositie-bias: ${(posShare * 100).toFixed(0)}% op één positie (max ${MAX_POS_SHARE * 100}%)`);
  if (longest / n > MAX_LONGEST) hard.push(`lengte-bias: juist = langste in ${longest}/${n} (max ${Math.round(MAX_LONGEST * 100)}%)`);
  // begrippen (curated term->definitie: voedt flashcards/SM-2 als eigen pijler)
  const beg = dom.begrippen || [];
  if (beg.length < 8) hard.push(`begrippen: ${beg.length} < 8 (curated term->definitie vereist)`);
  beg.forEach((b, i) => {
    if (!b || !b.t || !String(b.t).trim()) hard.push(`begrip ${i + 1}: term (t) ontbreekt`);
    if (!b || !b.d || String(b.d).trim().length < 12) hard.push(`begrip ${i + 1}: definitie (d) te kort/ontbreekt`);
    overclaims(String((b && b.d) || '')).forEach(m => hard.push(`begrip ${i + 1}: overclaim ${m}`));
  });

  if (![1, 2, 3].every(l => dLevels.has(l))) soft.push(`R-dekking onvolledig: alleen niveaus ${[...dLevels].sort().join(',')} (streef R1-R3)`);
  if (n < MIN_BANK) soft.push(`bankdiepte ${n} < streef ${MIN_BANK} — memoriseerbaar, verdiep de bank`);

  console.log(`\n═══ ${t.niveau}/${t.vak}/${t.dom} — ${dom.naam} (${n} vragen) ═══`);
  if (!hard.length) console.log('  ✓ alle HARDE gouden-standaard-poorten gehaald');
  hard.forEach(m => console.log('  ✗ HARD  ' + m));
  soft.forEach(m => console.log('  · soft  ' + m));
  hardTotal += hard.length; softTotal += soft.length;
}

console.log(`\n${hardTotal ? '✗' : '✓'} gouden standaard: ${hardTotal} harde tekortkomingen, ${softTotal} zachte.`);
console.log('  HARD moet 0 zijn om als gouden standaard te publiceren. SOFT = aandachtspunt.\n');
process.exit(hardTotal ? 1 : 0);
