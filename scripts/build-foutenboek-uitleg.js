#!/usr/bin/env node
/**
 * build-foutenboek-uitleg.js — Sprint 2b GENERATOR (build-time, pluggable LLM).
 *
 * Genereert per betrouwbaar-gekoppelde meerkeuzevraag een RIJKE uitleg:
 *   - per antwoordoptie: waarom fout / waarom juist
 *   - welke afleider het meest verleidelijk is (en waarom)
 *   - "hoe herken je dit de volgende keer?"
 * en schrijft die STATISCH weg naar foutenboek-uitleg-<niveau>.js. De app laadt
 * dat bestand lui op het Foutenboek-scherm — geen backend, geen runtime-key,
 * werkt offline. Dit is het "prozastap = pluggable LLM"-patroon uit de
 * Question Engine, nu concreet voor uitleg.
 *
 * DRAAIEN (lokaal, met jouw key — deze sandbox heeft geen netwerk/key):
 *   ANTHROPIC_API_KEY=sk-... node scripts/build-foutenboek-uitleg.js havo --vak bi --limit 30
 *   # daarna: node scripts/build-foutenboek-meta.js havo (niet nodig) en SW bumpen,
 *   #         foutenboek-uitleg-havo.js committen. De consumer pikt 'm vanzelf op.
 *
 * Eigenschappen:
 *   - Idempotent/hervatbaar: bestaande uitleg met dezelfde vraag-hash wordt
 *     overgeslagen (--force om te hertekenen). Je kunt in batches draaien.
 *   - Zonder key of met --dry-run: bouwt alleen de specs en rapporteert; 0 calls.
 *   - Alleen 'matched' koppelingen (zelfde poort als de verrijkingsmeta).
 *
 * Vlaggen: [havo|vwo] [--vak <id>] [--limit N=20] [--force] [--dry-run] [--model <id>]
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const A = process.argv.slice(2);
const niveau = A.find(x => !x.startsWith('--')) || 'havo';
const flag = n => { const i = A.indexOf('--' + n); return i >= 0 ? (A[i + 1] && !A[i + 1].startsWith('--') ? A[i + 1] : true) : undefined; };
const onlyVak = flag('vak');
const limit = +(flag('limit') || 20);
const force = !!flag('force');
const dryRun = !!flag('dry-run');
const MODEL = flag('model') || 'claude-opus-4-8';
const KEY = process.env.ANTHROPIC_API_KEY;

// ── bronnen laden ──
const dg = {}; new Function('g', read(`data-${niveau}.js`) + `\ng.V=(typeof VAKKEN!=='undefined'?VAKKEN:VAKKEN_VWO);`)(dg);
const kc = {}; new Function('g', read(`knowledge-koppeling-${niveau}.js`) + '\ng.K=LO_KOPPELING;')(kc);
const KOPP = kc.K || {};
const kg = {}; new Function('g', read(`knowledge-${niveau}.js`) + '\ng.L=LEERDOELEN;')(kg);
const byId = {}; for (const b of Object.values(kg.L)) for (const ld of (b.leerdoelen || [])) byId[ld.id] = ld;

const qHash = q => crypto.createHash('sha1').update(JSON.stringify([q.v, q.o, q.c])).digest('hex').slice(0, 12);
const qkey = (domId, v) => (domId || '') + '|' + (v || '').slice(0, 80);

// ── bestaande uitleg (hervatten) ──
const OUT = `foutenboek-uitleg-${niveau}.js`;
let EXIST = {};
try { const e = {}; new Function('g', read(OUT) + '\ng.U=FB_UITLEG;')(e); EXIST = e.U || {}; } catch (_) {}

// ── specs bouwen: alleen matched koppelingen, nog niet gedekt (of --force) ──
const specs = [];
for (const vak of dg.V) {
  if (onlyVak && vak.id !== onlyVak) continue;
  const kp = KOPP[vak.id] || {};
  for (const d of vak.domeinen) for (const q of (d.sv || [])) {
    if (!q.o || typeof q.c !== 'number' || q.o.length < 2) continue;
    const e = kp[qkey(d.id, q.v)];
    if (!e || e.status !== 'matched' || !e.lo) continue;
    const ld = byId[e.lo]; if (!ld) continue;
    const key = qkey(d.id, q.v);
    const h = qHash(q);
    const have = (EXIST[vak.id] || {})[key];
    if (have && have.h === h && !force) continue;         // al gedekt, ongewijzigd
    specs.push({ vakId: vak.id, vak: vak.naam, domId: d.id, key, h, q,
      leerdoel: ld.titel, misconceptie: (ld.veelgemaakteFouten || [])[0] || null });
  }
}

console.log(`\n═══ Foutenboek-uitleg generator · ${niveau}${onlyVak ? '/' + onlyVak : ''} ═══`);
console.log(`te genereren: ${specs.length} vraag/vragen (matched, nieuw of gewijzigd)${force ? ' [--force]' : ''}`);
const batch = specs.slice(0, limit);
console.log(`deze run: ${batch.length} (limit ${limit})`);

if (!batch.length) { console.log('  niets te doen.\n'); process.exit(0); }

if (dryRun || !KEY) {
  console.log(dryRun ? '\n[--dry-run] geen API-calls. Voorbeeld-spec:' : '\n⚠ Geen ANTHROPIC_API_KEY in env → 0 calls. Voorbeeld-spec:');
  const s = batch[0];
  console.log(JSON.stringify({ vak: s.vak, leerdoel: s.leerdoel, misconceptie: s.misconceptie, vraag: s.q.v.slice(0, 90) + '…', opties: s.q.o, juist: s.q.c }, null, 1));
  console.log(`\nZet ANTHROPIC_API_KEY en laat --dry-run weg om ${batch.length} uitleg(gen) te genereren.\n`);
  process.exit(0);
}

// ── LLM-prompt: strikt JSON terug ──
const SYS = `Je bent examendocent voor het Nederlandse HAVO/VWO. Je legt beknopt en correct uit waarom antwoordopties fout of juist zijn. Antwoord UITSLUITEND met geldige JSON, geen tekst eromheen.`;
function userPrompt(s) {
  const opts = s.q.o.map((o, i) => `${i}${i === s.q.c ? ' (JUIST)' : ''}: ${o}`).join('\n');
  return `Vraag: ${s.q.v}
Opties:
${opts}
Leerdoel: ${s.leerdoel}${s.misconceptie ? `\nBekende misconceptie: ${s.misconceptie}` : ''}

Geef JSON in exact dit schema:
{"opts":[{"w":"<1 zin: waarom deze optie fout is, of bij de juiste: waarom die klopt>","juist":<true bij het juiste antwoord, anders false>}],  // even lang als het aantal opties, in dezelfde volgorde
 "verleidelijk":<index van de meest verleidelijke FOUTE optie>,
 "herken":"<1-2 zinnen: hoe herken je dit type valkuil de volgende keer>"}
Kort, concreet, examen-Nederlands. Geen inleiding.`;
}

async function callLLM(s) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 900, system: SYS, messages: [{ role: 'user', content: userPrompt(s) }] }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const txt = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
  const m = txt.match(/\{[\s\S]*\}/); if (!m) throw new Error('geen JSON in antwoord');
  const j = JSON.parse(m[0]);
  if (!Array.isArray(j.opts) || j.opts.length !== s.q.o.length) throw new Error('opts-lengte klopt niet');
  return j;
}

(async () => {
  const result = JSON.parse(JSON.stringify(EXIST)); // start van bestaande, vul aan
  let ok = 0, fail = 0;
  for (let i = 0; i < batch.length; i++) {
    const s = batch[i];
    process.stdout.write(`  [${i + 1}/${batch.length}] ${s.vakId} ${s.domId} — ${s.q.v.slice(0, 48)}… `);
    try {
      const j = await callLLM(s);
      (result[s.vakId] = result[s.vakId] || {})[s.key] = {
        h: s.h,
        opts: j.opts.map((o, ix) => ({ w: String(o.w || '').trim(), juist: ix === s.q.c })),
        verleidelijk: (typeof j.verleidelijk === 'number' && j.verleidelijk !== s.q.c) ? j.verleidelijk : undefined,
        herken: String(j.herken || '').trim(),
      };
      ok++; console.log('✓');
    } catch (e) { fail++; console.log('✗ ' + e.message); }
    await new Promise(r => setTimeout(r, 250)); // vriendelijk voor rate limits
  }

  // deterministisch schrijven (vakken + keys gesorteerd)
  const sorted = {};
  for (const vak of Object.keys(result).sort()) { sorted[vak] = {}; for (const k of Object.keys(result[vak]).sort()) sorted[vak][k] = result[vak][k]; }
  const banner = `// ═══════════════════════════════════════════════════════════════════════
// foutenboek-uitleg-${niveau}.js — GEGENEREERD door scripts/build-foutenboek-uitleg.js
// Rijke per-afleider uitleg bij fouten (Sprint 2b). NIET met de hand bewerken;
// hertekenen met de generator (build-time LLM). Sleutel = "<domeinId>|<v80>".
// Waarde: { h, opts:[{w,juist}], verleidelijk?, herken }
// ═══════════════════════════════════════════════════════════════════════
`;
  const body = `var FB_UITLEG = (typeof FB_UITLEG !== 'undefined' && FB_UITLEG) || {};\n` +
    Object.entries(sorted).map(([vak, m]) => `FB_UITLEG[${JSON.stringify(vak)}] = ${JSON.stringify(m)};`).join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, OUT), banner + body);

  const total = Object.values(sorted).reduce((a, m) => a + Object.keys(m).length, 0);
  console.log(`\n✓ ${OUT} — +${ok} gegenereerd, ${fail} mislukt · ${total} uitleg(gen) totaal`);
  console.log(`  volgende: SW-cache bumpen + ${OUT} committen. Herhaal met --limit voor de rest.\n`);
})();
