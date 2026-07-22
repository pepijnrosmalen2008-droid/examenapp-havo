#!/usr/bin/env node
/**
 * tag-leerdoelen.js — koppelt bestaande vragen aan leerdoelen (F1 / M2).
 *
 * Schrijft UITSLUITEND de sidecar `knowledge-koppeling-<niveau>.js` met per vraag:
 *   { lo, confidence, source, via }
 * Raakt `data-*.js` en `q/*.js` NOOIT aan (vragen blijven byte-identiek).
 *
 *   node scripts/tag-leerdoelen.js            # havo bi, schrijft sidecar
 *   node scripts/tag-leerdoelen.js --check    # alleen rapport, schrijft niets
 *
 * Match: vraagstam + JUIST antwoord (niet de afleiders — die zijn sibling-
 * begrippen en koppelen anders ~20% fout, zie F1-BIOLOGIE-COVERAGE-REVIEW).
 */
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const NIVEAU = args.find(a => !a.startsWith('--') && ['havo', 'vwo'].includes(a)) || 'havo';
const VAKID = args.find(a => !a.startsWith('--') && !['havo', 'vwo'].includes(a)) || 'bi';

// ── Handmatige overrides: qkey (eerste 80 tekens van v) → leerdoel-id ──
// Voor restambiguïteiten na matcher + conceptopschoning. source=manual_override, confidence=1.0
const OVERRIDES = {
  // Vragen die geen begrip letterlijk noemen (synoniem/context) en daardoor als
  // fallback vielen. Handmatig beoordeeld o.b.v. het juiste antwoord + uitleg.
  'Een grafiek toont dat de reactiesnelheid van een enzym stijgt tot 37°C en daarna': 'bi.A.3', // enzym-optimum uit grafiek
  'Wat is het verschil tussen correlatie en causaliteit?': 'bi.A.4',
  'Waarom zijn meerdere herhalingen (replicaties) belangrijk in biologisch onderzoe': 'bi.A.2', // betrouwbaarheid
  '(a) Noem het optimum en beschrijf het verband.\n(b) Verklaar waarom de activiteit': 'bi.A.3', // enzym-grafiek (open)
  'Welk begrip beschrijft de waarneembare eigenschap van een organisme (bijv. oogkl': 'bi.M.7', // fenotype
  'Wat is het verschil tussen een prokaryoot en een eukaryoot?': 'bi.M.1',
  '(a) Geef alle mogelijke genotypen van de kinderen met hun verhouding.\n(b) Welk p': 'bi.M.7', // kruising (open)
  'Welk orgaan bewaart glycogeen als reservesuiker en speelt een centrale rol in de': 'bi.O.2', // bloedsuikerregulatie (lever)
  'Welke cellen zijn verantwoordelijk voor het direct doden van met virus geïnfecte': 'bi.O.4', // cytotoxische T-cellen
  'Welk evolutionair concept stelt dat allelfrequenties constant blijven als er gee': 'bi.P.6', // Hardy-Weinberg
  'Welk begrip beschrijft de verandering van allelfrequenties door toeval, los van ': 'bi.P.6', // genetische drift
  'Welke voorwaarde is GEEN vereiste voor Hardy-Weinberg evenwicht?': 'bi.P.6',
  'Beschrijf het volledige ecologische proces dat leidt tot vissterfte. Noem de rol': 'bi.P.2', // eutrofiëring/nutriënten
};

// ── laden ──
const dg = {}; new Function('g', read(`data-${NIVEAU}.js`) + `\ng.V=(typeof VAKKEN!=='undefined'?VAKKEN:VAKKEN_VWO);`)(dg);
const kg = {}; new Function('g', read(`knowledge-${NIVEAU}.js`) + '\ng.L=LEERDOELEN;')(kg);
const vak = dg.V.find(v => v.id === VAKID);
if (!vak) { console.error(`Vak ${VAKID} niet gevonden`); process.exit(1); }

// Sleutel is domein-gescoped: een vraag hoort bij precies één domein en leerdoelen
// zijn domein-gescoped. Dit voorkomt botsingen van identieke vragen die als begrip
// in twee domeinen voorkomen (bv. 'Mengsel' in sk_A én sk_B).
const qkeyOf = (q, domId) => domId + '|' + (q.v || '').slice(0, 80);
function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function hit(concept, hay) {
  const c = concept.toLowerCase();
  return /^[a-zà-ÿ]{1,4}$/.test(c) ? new RegExp('\\b' + esc(c) + '\\b', 'i').test(hay) : hay.includes(c);
}
function domLeerdoelen(domId) {
  const k = `${VAKID}_${domId}`;
  return (kg.L[k] && kg.L[k].leerdoelen) || [];
}

// normaliseer een term voor exacte vergelijking (bv. "Bladgroenkorrel (plant)" → "bladgroenkorrel")
const normTerm = t => (t || '').toLowerCase().replace(/\([^)]*\)/g, '').replace(/[«».,:?]/g, '').trim();

// Haal het "gedefinieerde begrip" uit een definitievraag:
//   «Term» in de stam, of het juiste antwoord bij "welke term/begrip past bij …"
function primaryTerm(q) {
  const g = (q.v || '').match(/«([^»]+)»/);
  if (g) return g[1];
  if (/welke term|welk begrip|hoort bij deze omschrijving|past bij/i.test(q.v || '')) {
    const opts = q.o || q.a || [];
    if (opts[q.c]) return opts[q.c];
  }
  return null;
}

// ── confidence-model (deterministisch, uitlegbaar) ──
function classify(lds, hay, q) {
  // 1) Definitievraag met een expliciet begrip → het leerdoel dat dát begrip
  //    bezit wint hoog. Voorkomt dat een langer, generieker concept in het
  //    antwoord (Ecosysteem, Fotosynthese) het specifieke begrip overstemt.
  const pt = primaryTerm(q);
  if (pt) {
    const ptn = normTerm(pt);
    for (const ld of lds) for (const c of (ld.concepten || [])) {
      if (normTerm(c) === ptn) return { lo: ld.id, confidence: 0.95, source: 'concept_match', via: c };
    }
  }
  // 2) Anders: score elk leerdoel op conceptdekking (langere concepten wegen zwaarder)
  const scored = lds.map(ld => {
    let score = 0; const via = [];
    for (const c of (ld.concepten || [])) if (hit(c, hay)) { score += c.length; via.push(c); }
    return { id: ld.id, score, via };
  }).sort((a, b) => b.score - a.score);
  const best = scored[0], second = scored[1];
  if (!best || best.score === 0) return null; // → fallback
  let confidence;
  if (!second || second.score === 0) confidence = 0.97;
  else {
    const margin = (best.score - second.score) / best.score; // 0..1
    confidence = Math.min(0.95, Math.max(0.55, +(0.55 + 0.45 * margin).toFixed(2)));
  }
  return { lo: best.id, confidence: +confidence.toFixed(2), source: 'concept_match', via: best.via.join('+') || null };
}

// ── koppel alle vragen van het vak ──
const koppeling = {};
const stat = { n: 0, concept: 0, fallback: 0, override: 0, low: 0, confSum: 0, perLd: {} };
for (const d of vak.domeinen) {
  const lds = domLeerdoelen(d.id);
  const fallbackId = lds[0] && lds[0].id;
  for (const q of [...(d.sv || []), ...(d.oe || [])]) {
    stat.n++;
    const key = qkeyOf(q, d.id);
    const opts = q.o || q.a || [];
    const isOe = (d.oe || []).includes(q);
    // stam + JUIST antwoord (open vraag: stam + context + uitleg; o is leeg)
    const hay = isOe
      ? ((q.v || '') + ' ' + (q.ctx || '') + ' ' + (q.u || '')).toLowerCase()
      : ((q.v || '') + ' ' + (opts[q.c] || '')).toLowerCase();

    let entry;
    const ovKey = key.slice(key.indexOf('|') + 1); // OVERRIDES worden op de vraagtekst gematcht (domein-onafhankelijk)
    if (OVERRIDES[ovKey]) { entry = { lo: OVERRIDES[ovKey], confidence: 1.0, source: 'manual_override', via: null }; stat.override++; }
    else {
      const m = classify(lds, hay, q);
      if (m) { entry = m; stat.concept++; }
      else { entry = { lo: fallbackId, confidence: 0.30, source: 'fallback', via: null }; stat.fallback++; }
    }
    if (entry.confidence < 0.70) stat.low++;
    stat.confSum += entry.confidence;
    stat.perLd[entry.lo] = (stat.perLd[entry.lo] || 0) + 1;
    koppeling[key] = entry;
  }
}

// ── rapport ──
const allLd = [];
for (const d of vak.domeinen) for (const ld of domLeerdoelen(d.id)) allLd.push(ld.id);
console.log(`\n═══ Leerdoel-koppeling ${vak.naam} (${NIVEAU}/${VAKID}) ${CHECK ? '[--check, niets geschreven]' : ''} ═══`);
console.log(`vragen: ${stat.n} · concept_match: ${stat.concept} · fallback: ${stat.fallback} · manual_override: ${stat.override}`);
console.log(`gem. confidence: ${(stat.confSum / stat.n).toFixed(3)} · laag-confidence (<0.70): ${stat.low}`);
const zero = allLd.filter(id => !stat.perLd[id]);
console.log(`leerdoelen zonder vraag: ${zero.length}${zero.length ? ' → ' + zero.join(', ') : ''}`);

// lijst van te-reviewen koppelingen (fallback + laag-confidence)
const review = Object.entries(koppeling).filter(([, e]) => e.confidence < 0.70)
  .sort((a, b) => a[1].confidence - b[1].confidence);
if (review.length) {
  console.log(`\n── Te reviewen (${review.length}, confidence<0.70) — kandidaten voor OVERRIDES/F2 ──`);
  for (const [key, e] of review.slice(0, 40)) {
    console.log(`  [${e.confidence.toFixed(2)} ${e.source}] → ${e.lo}   "${key.slice(0, 60)}"`);
  }
  if (review.length > 40) console.log(`  … +${review.length - 40} meer`);
}

// ── schrijven (tenzij --check) ──
if (!CHECK) {
  const outFile = `knowledge-koppeling-${NIVEAU}.js`;
  // MERGE: behoud koppelingen van andere vakken; vervang alleen dit vak. Deterministisch (vakken gesorteerd).
  let all = {};
  try { const eg = {}; new Function('g', read(outFile) + '\ng.K=LO_KOPPELING;')(eg); all = eg.K || {}; } catch (e) { /* nieuw bestand */ }
  all[VAKID] = koppeling;
  const sorted = {}; for (const k of Object.keys(all).sort()) sorted[k] = all[k];
  const lines = Object.entries(sorted).map(([vk, kp]) => `LO_KOPPELING[${JSON.stringify(vk)}] = ${JSON.stringify(kp, null, 0)};`).join('\n');
  const banner = `// ═══════════════════════════════════════════════════════════════════════
// knowledge-koppeling-${NIVEAU}.js — GEGENEREERD door scripts/tag-leerdoelen.js
// Sidecar: koppelt vragen aan leerdoelen mét provenance. NIET met de hand
// bewerken. Sleutel = eerste 80 tekens van vraag.v (botsingsvrij geverifieerd).
// Elke waarde: { lo, confidence (0–1), source: concept_match|fallback|manual_override, via }
// De app gebruikt dit nog niet; opgeslagen voor toekomstige AI/adaptive-processen.
// ═══════════════════════════════════════════════════════════════════════
var LO_KOPPELING = (typeof LO_KOPPELING !== 'undefined' && LO_KOPPELING) || {};
${lines}
if (typeof module !== 'undefined' && module.exports) module.exports = { LO_KOPPELING };
`;
  fs.writeFileSync(path.join(ROOT, outFile), banner);
  console.log(`\n✓ geschreven: ${outFile} (${VAKID}: ${Object.keys(koppeling).length} koppelingen; totaal vakken: ${Object.keys(sorted).length})`);
} else {
  console.log(`\n(--check: sidecar niet geschreven)`);
}
console.log('');
