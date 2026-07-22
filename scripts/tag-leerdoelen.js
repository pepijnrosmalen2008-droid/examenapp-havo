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

// ── Handmatige overrides per vak: qkey-tekst (eerste 80 tekens van v) → leerdoel-id ──
// Voor restambiguïteiten na matcher + conceptopschoning. source=manual_override, confidence=1.0
const OVERRIDES_ALL = {
  bi: {
    // Vragen die geen begrip letterlijk noemen (synoniem/context) en daardoor als
    // fallback vielen. Handmatig beoordeeld o.b.v. het juiste antwoord + uitleg.
    'Een grafiek toont dat de reactiesnelheid van een enzym stijgt tot 37°C en daarna': 'bi.A.3',
    'Wat is het verschil tussen correlatie en causaliteit?': 'bi.A.4',
    'Waarom zijn meerdere herhalingen (replicaties) belangrijk in biologisch onderzoe': 'bi.A.2',
    '(a) Noem het optimum en beschrijf het verband.\n(b) Verklaar waarom de activiteit': 'bi.A.3',
    'Welk begrip beschrijft de waarneembare eigenschap van een organisme (bijv. oogkl': 'bi.M.7',
    'Wat is het verschil tussen een prokaryoot en een eukaryoot?': 'bi.M.1',
    '(a) Geef alle mogelijke genotypen van de kinderen met hun verhouding.\n(b) Welk p': 'bi.M.7',
    'Welk orgaan bewaart glycogeen als reservesuiker en speelt een centrale rol in de': 'bi.O.2',
    'Welke cellen zijn verantwoordelijk voor het direct doden van met virus geïnfecte': 'bi.O.4',
    'Welk evolutionair concept stelt dat allelfrequenties constant blijven als er gee': 'bi.P.6',
    'Welk begrip beschrijft de verandering van allelfrequenties door toeval, los van ': 'bi.P.6',
    'Welke voorwaarde is GEEN vereiste voor Hardy-Weinberg evenwicht?': 'bi.P.6',
    'Beschrijf het volledige ecologische proces dat leidt tot vissterfte. Noem de rol': 'bi.P.2',
  },
  sk: {
    // Scheikunde-review: fallbacks handmatig beoordeeld o.b.v. juist antwoord + uitleg.
    'Welke variabele verandert de onderzoeker bewust in een experiment?': 'sk.A.3',
    'Een grafiek toont een rechte lijn door de oorsprong. Welk verband beschrijft dit': 'sk.A.3',
    'Bij welke handeling in het lab is het essentieel om zuur aan water toe te voegen': 'sk.A.4',
    'Waarom is het essentieel om meerdere meetpunten te gebruiken bij het opstellen v': 'sk.A.3',
    'Wat is een significante cijfer en hoeveel significante cijfers heeft het getal 0': 'sk.A.3',
    '(a) Wat is het equivalentiepunt en hoe herken je het in de grafiek?\n(b) Wat is d': 'sk.A.3',
    'Wat bepaalt de groepsindeling (kolom) in het periodiek systeem?': 'sk.B.1',
    'Welke eigenschap van metalen wordt verklaard door de aanwezigheid van vrij beweg': 'sk.B.4',
    'Welk begrip beschrijft de energie die vrijkomt bij het vormen van 1 mol ionroost': 'sk.B.3',
    'Wat houdt de stoichiometrie in bij de reactie: N₂ + 3H₂ → 2NH₃?': 'sk.C.2',
    '(a) Bereken het aantal mol HCl dat wordt gebruikt.\n(b) Bereken de concentratie v': 'sk.C.2',
    '(a) Hoeveel gram ijzer kan maximaal worden gewonnen uit 480 g Fe2O3?\n(b) Bij 168': 'sk.C.2',
    '(a) Bereken de molmassa van H2SO4.\n(b) Hoeveel gram is 0,5 mol H2SO4?': 'sk.C.2',
    'Bereken de concentratie in mol/L.': 'sk.C.2',
    'Bereken de concentratie van de HCl-oplossing.': 'sk.C.2',
    'Welk polymerisatietype produceert bij elke koppelingstap een bijproduct (water o': 'sk.D.6',
    'Welke naam heeft het organisme dat bij de fermentatie (gisting) van suiker ethan': 'sk.D.2',
    'Welk type reactie ondergaan alkanen met chloorgas bij UV-licht?': 'sk.D.5',
    'Hoe verandert het kookpunt als men van methaan (CH₄) naar butaan (C₄H₁₀) gaat in': 'sk.D.1',
    'Welk compromis wordt in het Haber-Bosch-proces gemaakt ten aanzien van temperatu': 'sk.E.1',
    'Wat is het verschil tussen een thermoplast en een thermoharder?': 'sk.E.1',
    'Welk effect heeft een toename van CO₂ in de atmosfeer op het klimaat?': 'sk.E.2',
    'Wat is de hoofdfunctie van de ozonlaag in de stratosfeer?': 'sk.E.2',
    'Welke eigenschap onderscheidt een thermoplast van een thermoharder?': 'sk.E.1',
    'Wat verstaat men onder de koolstofkringloop en welke rol speelt fotosynthese daa': 'sk.E.2',
    'Welk conserveringsmethode werkt via osmose om bacteriën te doden?': 'sk.E.5',
    'Welk begrip hoort bij deze omschrijving: "Haber-Bosch; compromis rendement/snelh': 'sk.E.1',
    'Welke term past bij: "Haber-Bosch; compromis rendement/snelheid"?': 'sk.E.1',
    '(a) Verklaar waardoor "lage ozon" (in steden) wordt gevormd en waarom het schade': 'sk.E.2',
  },
  na: {
    // Natuurkunde-review. Rekenvragen/synoniemen → juiste leerdoel. NB: sommige
    // (impuls, cirkelbeweging, Lorentzkracht, transformator, fotonenergie, E=mc²,
    // eV, generator) zijn vermoedelijk VWO-lekkage in de HAVO-bank → tijdelijk
    // gehuisvest bij het dichtstbijzijnde leerdoel, apart gemeld voor owner-review.
    'Wat is de SI-basiseenheid van massa?': 'na.A.1',
    'Welk verband hoort bij een parabool door de oorsprong?': 'na.A.3',
    'Welk verband geeft een afvlakkende kromme die steeds minder snel stijgt?': 'na.A.3',
    'Welk verband geeft een rechte lijn die niet door de oorsprong gaat?': 'na.A.3',
    'Wat stelt de oppervlakte onder een (v,t)-diagram voor?': 'na.A.5',
    'Waarom pas je een coördinatentransformatie toe op een grafiek?': 'na.A.5',
    'Wat is de golfvergelijking?': 'na.B.2',
    'Welke wet beschrijft de relatie tussen de hoek van inval en de hoek van weerkaat': 'na.B.4',
    'Een lichtstraal gaat van glas (n = 1,5) naar lucht (n = 1). Bij welke hoek van i': 'na.B.4',
    'Welk verschijnsel treedt op als golven een smalle opening passeren en uitwaaiere': 'na.B.4',
    'Wat is een echo?': 'na.B.3',
    'Leg uit waarom botten duidelijk zichtbaar zijn op een röntgenfoto.': 'na.B.4',
    'Welke formule geeft de afgelegde afstand bij een eenparige beweging?': 'na.C.1',
    'Welke formule geeft de afstand bij een eenparig versnelde beweging vanuit stilst': 'na.C.1',
    'Welke formule geeft de veerkracht?': 'na.C.2',
    'Wanneer is een hefboom in evenwicht?': 'na.C.3',
    'Welke formule geeft de warmte die nodig is om een stof op te warmen?': 'na.C.6',
    'Leg uit wat deze grafiek zegt over de veer en noem de bijbehorende natuurkundige': 'na.C.2',
    '(a) Na hoeveel tijd staat de auto stil?\n(b) Welke afstand legt de auto af tijden': 'na.C.1',
    'Wat is het verschil tussen gelijkstroom (DC) en wisselstroom (AC)?': 'na.D.1',
    'In welke richting loopt de afgesproken stroomrichting?': 'na.D.1',
    'Hoe sluit je een ampèremeter aan in een schakeling?': 'na.D.2',
    'Hoe sluit je een voltmeter aan?': 'na.D.2',
    'Welke formule geeft de verbruikte elektrische energie?': 'na.D.3',
    'Wat is 1 kilowattuur (kWh)?': 'na.D.3',
    'Hoe wekt een zonnecel elektriciteit op?': 'na.D.4',
    'Leg uit waarom het lampje uitgaat wanneer de schakelaar wordt geopend.': 'na.D.2',
    'Bij beta-min-verval verandert het atoomnummer Z met:': 'na.E.2',
    'Wat is de atoommassa van een element en waaruit bestaat het?': 'na.E.2',
  },
};

// Off-level: vragen die vermoedelijk NIET op dit niveau thuishoren (bv. VWO-stof in
// de HAVO-bank). Ze krijgen status 'off_level' + lo:null — GEEN onjuiste koppeling
// aan een HAVO-leerdoel. Een eigenschap van de VRAAG, gemeld voor owner-review.
const OFF_LEVEL_ALL = {
  na: {
    'Wat zegt de impulsstelling (F·Δt = Δp)?': 'vwo: impuls',
    'Wat geldt voor de totale impuls van een gesloten systeem (zonder externe krachte': 'vwo: behoud van impuls',
    'Welke kracht houdt een voorwerp in een cirkelbaan?': 'vwo: cirkelbeweging',
    'Welk principe ligt ten grondslag aan de werking van een transformator?': 'vwo: transformator/inductie',
    'Wat is de Lorentzkracht op een elektrisch geladen deeltje dat beweegt in een mag': 'vwo: Lorentzkracht',
    '(a) Bereken de Lorentzkracht.\n(b) Wat is de beweging van het elektron in dit vel': 'vwo: Lorentzkracht',
    'Hoe wekt een generator elektriciteit op?': 'vwo: inductie',
    'Wat is de fotonenergie en hoe hangt die af van de frequentie?': 'vwo: E=hf',
    'Bij welk proces wordt massa direct omgezet in energie volgens E = mc²?': 'vwo: E=mc²',
    'Wat geldt voor een foton met een kortere golflengte?': 'vwo: foton/quantum',
    'Wat is een elektronvolt (eV)?': 'vwo: elektronvolt',
  },
};
const OFF_LEVEL = OFF_LEVEL_ALL[VAKID] || {};
const OVERRIDES = OVERRIDES_ALL[VAKID] || {};

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
// status volgt uit de bron: matched (concept/override) · unmatched (fallback) · off_level
const STATUS = { concept_match: 'matched', manual_override: 'matched', fallback: 'unmatched', off_level: 'off_level' };
const koppeling = {};
const stat = { n: 0, concept: 0, fallback: 0, override: 0, offlevel: 0, low: 0, confSum: 0, perLd: {} };
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
    const ovKey = key.slice(key.indexOf('|') + 1); // op vraagtekst gematcht (domein-onafhankelijk)
    if (OFF_LEVEL[ovKey]) { entry = { lo: null, confidence: 0, source: 'off_level', via: null, offReason: OFF_LEVEL[ovKey] }; stat.offlevel++; }
    else if (OVERRIDES[ovKey]) { entry = { lo: OVERRIDES[ovKey], confidence: 1.0, source: 'manual_override', via: null }; stat.override++; }
    else {
      const m = classify(lds, hay, q);
      if (m) { entry = m; stat.concept++; }
      else { entry = { lo: fallbackId, confidence: 0.30, source: 'fallback', via: null }; stat.fallback++; }
    }
    entry.status = STATUS[entry.source];
    if (entry.confidence < 0.70 && entry.status !== 'off_level') stat.low++;
    stat.confSum += entry.confidence;
    if (entry.lo) stat.perLd[entry.lo] = (stat.perLd[entry.lo] || 0) + 1;
    koppeling[key] = entry;
  }
}

// ── rapport ──
const allLd = [];
for (const d of vak.domeinen) for (const ld of domLeerdoelen(d.id)) allLd.push(ld.id);
console.log(`\n═══ Leerdoel-koppeling ${vak.naam} (${NIVEAU}/${VAKID}) ${CHECK ? '[--check, niets geschreven]' : ''} ═══`);
console.log(`vragen: ${stat.n} · concept_match: ${stat.concept} · fallback: ${stat.fallback} · manual_override: ${stat.override} · off_level: ${stat.offlevel}`);
const matchedN = stat.n - stat.offlevel;
console.log(`gem. confidence (excl. off_level): ${(stat.confSum / (matchedN || 1)).toFixed(3)} · laag-confidence (<0.70): ${stat.low}`);
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
