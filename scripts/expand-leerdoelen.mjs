#!/usr/bin/env node
/**
 * expand-leerdoelen.mjs - de EFFICIENTE contentfabriek (v2).
 * ─────────────────────────────────────────────────────────────────────────────
 * Probleem: een gouden-standaard leerdoel met de hand schrijven = 25 vragen ×
 * (stam + 4 opties + juist + d + u + 4× uo + uh) ≈ 200 regels. Daardoor past er
 * hooguit één leerdoel per prompt.
 *
 * Oplossing: je schrijft alleen nog een COMPACTE spec per leerdoel:
 *   - concepten[]  = { t: term, d: definitie, k?: korte kern, fout?: [verwante termen] }
 *   - sam          = de rijke samenvatting (HTML) - dit is de echte inhoud
 *   - toepas[]?    = optionele, met de hand geschreven toepassings-/redeneervragen
 *
 * De expander leidt hieruit een VOLLEDIG gouden-standaard leerdoel af:
 *   - begrippen  = concepten (t/d)                         (≥8 vereist)
 *   - sv[]       = gegenereerde MC-vragen met per-optie-uitleg (uo) + onthoud (uh),
 *                  gebalanceerd op antwoordpositie en lengte, met R1-R3-dekking.
 *   + jouw toepas-vragen worden er ongewijzigd bij gemengd.
 *
 * Koppeling (leerdoel↔vraag) is GEEN handwerk: registreer het leerdoel-id in
 * DOMEIN_LO (tag-leerdoelen.js) → alle vragen krijgen automatisch 'matched'.
 *
 * Zo kost een leerdoel ~12 conceptregels i.p.v. 200 → meerdere vakken per prompt.
 *
 *   node scripts/expand-leerdoelen.mjs <spec.js|spec.json>   # expand + self-check
 *   node scripts/expand-leerdoelen.mjs --selftest            # ingebouwde proef (na C1)
 *
 * De expander MUTEERT data-*.js niet zelf: hij levert het leerdoel-object +
 * een gouden-zelfcheck. Het wegschrijven (merge in data-<niveau>.js) doet een
 * dunne integratie zodat de bestaande build/split/validatie ongewijzigd blijft.
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

// ── golden constraints (spiegelt validate-goldstandard.mjs) ──
const MAX_STEM = 110, MAX_POS = 0.40, MAX_LONGEST = 0.40, MIN_UO = 8, MIN_U = 12;
const OVER = [
  /\bprecies\s+(?:één|een|1)\s+(?:substraat|type|soort|stof|reactie)/i,
  /\buitsluitend\b/i, /\bin\s+alle\s+gevallen\b/i,
  /\bwordt\s+altijd\s+(?:veroorzaakt|bepaald|gevormd)/i,
  /\balleen\s+\w+\s+(?:past|bindt|werkt|kan\s+binden)\b/i,
];
const overclaim = t => OVER.some(re => re.test(t || ''));

// ── helpers ──
const shuffle = (a, seed) => { a = a.slice(); let s = seed || 1; const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };
const kernOf = c => (c.k || String(c.d).split(/[;(]/)[0].trim()).replace(/\.$/, '');
const strictLongest = (opts, ci) => { const L = opts.map(o => o.length); return L[ci] === Math.max(...L) && L.filter(x => x === L[ci]).length === 1; };

// Plaats het juiste item op doelpositie p; bouw o[] en uo[] consistent.
function place(correctOpt, correctUo, distrs, p) {
  const rest = distrs.slice();
  const o = [], uo = [];
  for (let i = 0; i < 4; i++) {
    if (i === p) { o.push(correctOpt); uo.push(correctUo); }
    else { const d = rest.shift(); o.push(d.opt); uo.push(d.uo); }
  }
  return { o, uo, c: p };
}

/**
 * Genereer de vraagbank voor één leerdoel uit de concepten.
 * Retourneert een lijst kandidaat-vragen (nog niet gebalanceerd op positie).
 */
function genBank(concepten) {
  const byTerm = {}; concepten.forEach(c => { byTerm[c.t.toLowerCase()] = c; });
  const cand = [];
  const distractorsFor = (c, kind) => {
    // dichtbij eerst (fout), dan overige concepten; als opt/uo-paren
    const close = (c.fout || []).map(t => byTerm[String(t).toLowerCase()]).filter(Boolean);
    const far = concepten.filter(x => x.t !== c.t && !close.includes(x));
    const pool = [...close, ...shuffle(far, c.t.length + kind.length)];
    return { close, pool };
  };

  const termDistr = ds => ds.map(d => ({ opt: d.t, uo: `«${d.t}» betekent ${kernOf(d)}.` }));
  concepten.forEach((c) => {
    const kern = kernOf(c);
    const uh = `Onthoud: «${c.t}» = ${kern}.`.slice(0, 140);
    const u = `«${c.t}»: ${c.d}.`.slice(0, 200);
    const { close, pool } = distractorsFor(c, 'x');
    const far = pool.filter(x => !close.includes(x));

    const push = q => { q.isLongest = strictLongest([q.correctOpt, ...q.distrs.map(x => x.opt)], 0); cand.push(q); };
    // TEMPLATE A-dichtbij (d3) - definitie → term met VERWARBARE afleiders (opties = termen)
    if (close.length >= 1) {
      const chosen = [...close, ...far].slice(0, 3);
      if (chosen.length === 3) push({ _t: 'A3', stem: `Welk begrip hoort bij: "${c.d}"?`, correctOpt: c.t, correctUo: `Klopt, dit is «${c.t}».`, distrs: termDistr(chosen), u, uh, d: close.length >= 2 ? 3 : 2 });
    }
    // TEMPLATE A-ver (d2) - definitie → term via de KORTE kern (korte stam + andere set)
    {
      const chosen = (far.length >= 3 ? far : [...far, ...close]).slice(0, 3);
      if (chosen.length === 3) push({ _t: 'A2', stem: `Welke term hoort bij "${kern}"?`, correctOpt: c.t, correctUo: `Klopt, «${c.t}» past hierbij.`, distrs: termDistr(chosen), u, uh, d: 2 });
    }
    // TEMPLATE B (d1) - term → definitie (opties = definities)
    {
      const chosen = pool.slice(0, 3);
      if (chosen.length === 3) push({ _t: 'B', stem: `Wat betekent «${c.t}»?`, correctOpt: c.d, correctUo: `Klopt: ${kern}.`, distrs: chosen.map(d => ({ opt: d.d, uo: `Dat is «${d.t}».` })), u, uh, d: 1 });
    }
  });
  // dedup op stam + weer te lange stammen
  const seen = new Set();
  return cand.filter(q => { if (q.stem.length > MAX_STEM) return false; const k = q.stem.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
}

/** Selecteer + balanceer tot een gouden bank (positie ≤40%, lengte-bias ≤40%, R1-R3, ≥25). */
function balance(cand, target = 26) {
  target = Math.max(target, 25);
  const longestCap = Math.floor(0.35 * target); // ruim onder de 40%-poort
  // d-gemengde volgorde (round-robin over R-niveaus zodat 1,2,3 aanwezig zijn),
  // en binnen die volgorde 'correct = langste' vragen begrensd tot de cap.
  const byD = { 1: [], 2: [], 3: [] };
  cand.forEach(q => byD[q.d].push(q));
  const order = [];
  let more = true;
  while (more) { more = false; for (const d of [3, 2, 1]) { if (byD[d].length) { order.push(byD[d].shift()); more = true; } } }
  const picked = [], reserve = []; let longestN = 0;
  for (const q of order) {
    if (picked.length >= target) { reserve.push(q); continue; }
    if (q.isLongest && longestN >= longestCap) { reserve.push(q); continue; }
    picked.push(q); if (q.isLongest) longestN++;
  }
  // aanvullen tot minimaal 25 als de cap te streng was (blijft < 40%)
  while (picked.length < 25 && reserve.length) picked.push(reserve.shift());

  // positie-balans: round-robin doelposities 0..3
  return picked.map((q, i) => {
    const pl = place(q.correctOpt, q.correctUo, q.distrs, i % 4);
    return { v: q.stem, o: pl.o, c: pl.c, d: q.d, u: q.u, uo: pl.uo, uh: q.uh, _t: q._t };
  });
}

/** Bouw het volledige leerdoel-object. */
export function expandLeerdoel(spec) {
  const beg = spec.concepten.map(c => ({ t: c.t, d: c.d }));
  const bank = balance(genBank(spec.concepten), spec.target || 26);
  const toepas = (spec.toepas || []).map(q => ({ ...q }));
  const sv = [...toepas, ...bank].map(({ _t, ...q }) => q);
  const ld = {
    id: spec.leerdoel, naam: spec.naam,
    beschrijving: spec.beschrijving || '', ceStatus: spec.ceStatus || 'CE',
    onderwerpen: spec.onderwerpen || [], sam: spec.sam || '',
    begrippen: beg, sv, oe: spec.oe || [],
  };
  return ld;
}

/** Gouden-zelfcheck (spiegelt validate-goldstandard HARD-poorten, minus koppeling). */
export function goldenSelfCheck(ld) {
  const hard = [];
  const sv = ld.sv || [];
  const norm = s => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const cPos = [0, 0, 0, 0]; let longest = 0; const dS = new Set();
  sv.forEach((q, i) => {
    const tag = `Q${i + 1}`, o = q.o || [];
    if (o.length !== 4 || o.some(x => !x || !String(x).trim())) hard.push(`${tag}: geen 4 gevulde opties`);
    if (new Set(o.map(norm)).size !== o.length) hard.push(`${tag}: dubbele opties`);
    if (!Number.isInteger(q.c) || q.c < 0 || q.c >= o.length) hard.push(`${tag}: ongeldige c`); else cPos[q.c]++;
    if (![1, 2, 3].includes(q.d)) hard.push(`${tag}: d ongeldig`); else dS.add(q.d);
    if (!q.u || String(q.u).length < MIN_U) hard.push(`${tag}: u te kort`);
    if (!Array.isArray(q.uo) || q.uo.length !== 4 || q.uo.some(w => !w || String(w).trim().length < MIN_UO)) hard.push(`${tag}: uo onvolledig`);
    if (!q.uh || String(q.uh).trim().length < MIN_UO) hard.push(`${tag}: uh ontbreekt`);
    if ((q.v || '').length > MAX_STEM) hard.push(`${tag}: vraag te lang (${q.v.length})`);
    const canon = [o[q.c], ...(q.uo || []), q.u].join(' . ');
    if (overclaim(canon)) hard.push(`${tag}: overclaim in canoniek veld`);
    if (o.length === 4 && Number.isInteger(q.c)) { const L = o.map(x => String(x).length); if (L[q.c] === Math.max(...L)) longest++; }
  });
  const n = sv.length || 1;
  const posShare = Math.max(...cPos) / (cPos.reduce((a, b) => a + b, 0) || 1);
  if (posShare > MAX_POS) hard.push(`positie-bias ${(posShare * 100).toFixed(0)}% (max 40%)`);
  if (longest / n > MAX_LONGEST) hard.push(`lengte-bias ${longest}/${n} (max 40%)`);
  const beg = ld.begrippen || [];
  if (beg.length < 8) hard.push(`begrippen ${beg.length} < 8`);
  beg.forEach((b, i) => { if (!b.t || !String(b.t).trim()) hard.push(`begrip ${i + 1}: term ontbreekt`); if (!b.d || String(b.d).trim().length < 12) hard.push(`begrip ${i + 1}: definitie te kort`); if (overclaim(String(b.d || ''))) hard.push(`begrip ${i + 1}: overclaim`); });
  const soft = [];
  if (![1, 2, 3].every(l => dS.has(l))) soft.push(`R-dekking: alleen ${[...dS].sort().join(',')}`);
  if (n < 25) soft.push(`bankdiepte ${n} < 25`);
  return { hard, soft, n, posShare, longestRatio: longest / n, dLevels: [...dS].sort() };
}

// ── zelftest: reproduceer na/C1 uit een compacte spec ──
const SELFTEST = {
  niveau: 'havo', vak: 'na', domein: 'C', leerdoel: 'C1', naam: 'Snelheid en versnelling',
  beschrijving: 'Snelheid en versnelling herkennen, onderscheiden en aflezen.',
  onderwerpen: ['Snelheid v = s/t', 'Versnelling a = Δv/t', 'Vrije val en g', '(x,t)- en (v,t)-diagrammen'],
  sam: '<p>Snelheid vertelt hoeveel afstand je per seconde aflegt; versnelling hoe snel die snelheid verandert.</p>',
  concepten: [
    { t: 'Snelheid', d: 'de afgelegde afstand per tijd; v = s / t, eenheid m/s', k: 'afstand per tijd', fout: ['Versnelling', 'Gemiddelde snelheid', 'Momentane snelheid'] },
    { t: 'Versnelling', d: 'de snelheidsverandering per tijd; a = verandering van v / t, eenheid m/s2', k: 'snelheidsverandering per tijd', fout: ['Snelheid', 'Vertraging', 'Valversnelling'] },
    { t: 'Vrije val', d: 'een val waarbij alleen de zwaartekracht werkt (luchtweerstand verwaarloosd)', k: 'vallen met alleen zwaartekracht', fout: ['Valversnelling'] },
    { t: 'Valversnelling', d: 'de versnelling bij een vrije val, g is ongeveer 9,8 m/s2', k: 'de g bij vrije val', fout: ['Vrije val', 'Versnelling'] },
    { t: 'Eenparige beweging', d: 'beweging met een constante snelheid (versnelling is nul)', k: 'constante snelheid', fout: ['Eenparig versnelde beweging'] },
    { t: 'Eenparig versnelde beweging', d: 'beweging waarbij de snelheid met een vaste versnelling toeneemt', k: 'vaste versnelling', fout: ['Eenparige beweging'] },
    { t: 'Gemiddelde snelheid', d: 'de totale afstand gedeeld door de totale tijd', k: 'totale afstand door totale tijd', fout: ['Momentane snelheid', 'Snelheid'] },
    { t: 'Momentane snelheid', d: 'de snelheid op een bepaald moment', k: 'snelheid op een moment', fout: ['Gemiddelde snelheid'] },
    { t: 'Vertraging', d: 'een versnelling die de snelheid juist kleiner maakt', k: 'afremmende versnelling', fout: ['Versnelling'] },
    { t: 'Afstand-tijd-diagram', d: 'grafiek met de afstand tegen de tijd; de helling is de snelheid', k: 'helling is de snelheid', fout: ['Snelheid-tijd-diagram'] },
    { t: 'Snelheid-tijd-diagram', d: 'grafiek met de snelheid tegen de tijd; de helling is de versnelling', k: 'helling is de versnelling', fout: ['Afstand-tijd-diagram'] },
    { t: 'Meter per seconde', d: 'de eenheid van snelheid (m/s)', k: 'de eenheid m/s', fout: ['Versnelling'] },
  ],
};

// ── data-integratie: upsert leerdoelen in data-<niveau>.js ──
const DATA = { havo: { file: 'data-havo.js', name: 'VAKKEN', pretty: 1 }, vwo: { file: 'data-vwo.js', name: 'VAKKEN_VWO', pretty: 0 }, vmbo: { file: 'data-vmbo.js', name: 'VAKKEN_VMBO', pretty: 1 } };
function loadVakken(niveau) { const d = DATA[niveau]; const g = {}; new Function('g', fs.readFileSync(path.join(ROOT, d.file), 'utf8') + `\ng.V=${d.name};`)(g); return g.V; }
function writeVakken(niveau, V) { const d = DATA[niveau]; fs.writeFileSync(path.join(ROOT, d.file), `var ${d.name} = ` + JSON.stringify(V, null, d.pretty) + ';'); }

async function loadSpecs(specfile) {
  const abs = path.resolve(specfile);
  if (abs.endsWith('.json')) return JSON.parse(fs.readFileSync(abs, 'utf8'));
  const mod = await import(pathToFileURL(abs).href);
  const s = mod.default || mod.specs || mod.SPECS;
  return Array.isArray(s) ? s : [s];
}

async function runSpecFile(specfile, write) {
  const specs = await loadSpecs(specfile);
  let hardTotal = 0; const perNiveau = {};
  const results = [];
  for (const spec of specs) {
    const ld = expandLeerdoel(spec);
    const r = goldenSelfCheck(ld);
    results.push({ spec, ld, r });
    hardTotal += r.hard.length;
    console.log(`\n═══ ${spec.niveau}/${spec.vak}/${spec.leerdoel || spec.domein} - ${spec.naam} (${r.n} vragen · R${r.dLevels.join('')} · pos ${(r.posShare * 100).toFixed(0)}% · len ${(r.longestRatio * 100).toFixed(0)}%) ═══`);
    if (!r.hard.length) console.log('  ✓ gouden-standaard-poorten gehaald');
    r.hard.forEach(m => console.log('  ✗ HARD  ' + m));
    r.soft.forEach(m => console.log('  · soft  ' + m));
    (perNiveau[spec.niveau] = perNiveau[spec.niveau] || []).push({ spec, ld });
  }
  if (hardTotal) { console.log(`\n✗ ${hardTotal} harde tekortkoming(en) - niets weggeschreven. Verbeter de spec.`); process.exit(1); }
  if (!write) { console.log('\n(dry-run - voeg --write toe om in data-<niveau>.js te schrijven)\n'); return; }

  const reg = [];
  for (const niveau of Object.keys(perNiveau)) {
    const V = loadVakken(niveau);
    for (const { spec, ld } of perNiveau[niveau]) {
      const vak = V.find(v => v.id === spec.vak);
      if (!vak) { console.error(`✗ vak ${spec.vak} niet gevonden in ${niveau}`); process.exit(1); }
      const dom = (vak.domeinen || []).find(d => d.id === spec.domein);
      if (!dom) { console.error(`✗ domein ${spec.domein} niet gevonden in ${spec.vak}`); process.exit(1); }
      if (spec.leerdoel) {
        // leerdoel-modus (havo/vwo): upsert als sub-leerdoel
        dom.leerdoelen = dom.leerdoelen || [];
        const i = dom.leerdoelen.findIndex(l => l.id === spec.leerdoel);
        if (i >= 0) dom.leerdoelen[i] = ld; else dom.leerdoelen.push(ld);
        reg.push(`${spec.niveau} ${spec.vak} ${spec.leerdoel}`);
      } else {
        // domein-modus (vmbo): hang de bank direct onder het domein
        dom.sv = ld.sv; dom.begrippen = ld.begrippen;
        if (spec.sam) dom.sam = spec.sam;
        if (spec.oe) dom.oe = spec.oe;
        reg.push(`${spec.niveau} ${spec.vak} domein ${spec.domein}`);
      }
    }
    writeVakken(niveau, V);
    console.log(`\n✓ ${niveau}: ${perNiveau[niveau].length} leerdoel(en) geschreven naar ${DATA[niveau].file}`);
  }
  console.log('\nNOG DOEN (registratie, éénmalig per leerdoel):');
  console.log('  1. tag-leerdoelen.js  → DOMEIN_LO[vak][leerdoel] = "<vak>.<domein>.<n>"   (auto-matched koppeling)');
  console.log('  2. validate-goldstandard.mjs → voeg het leerdoel toe aan de GOLDEN-lijst');
  console.log('  3. node scripts/tag-leerdoelen.js <niveau> <vak> && node scripts/validate-goldstandard.mjs <niveau> <vak> <leerdoel>');
  console.log('  4. node scripts/split-data.js && node scripts/smoke.mjs && SW-cache bumpen\n');
}

const _specArg = process.argv.slice(2).find(a => !a.startsWith('--'));
if (_specArg) { await runSpecFile(_specArg, process.argv.includes('--write')); }
else if (process.argv.includes('--selftest')) {
  const ld = expandLeerdoel(SELFTEST);
  const r = goldenSelfCheck(ld);
  console.log(`\n═══ zelftest: expand na/C1 uit compacte spec (${SELFTEST.concepten.length} concepten) ═══`);
  console.log(`gegenereerd: ${r.n} vragen · R-niveaus ${r.dLevels.join(',')} · positie-max ${(r.posShare * 100).toFixed(0)}% · lengte-bias ${(r.longestRatio * 100).toFixed(0)}%`);
  if (!r.hard.length) console.log('  ✓ alle HARDE gouden-standaard-poorten gehaald (koppeling via DOMEIN_LO)');
  r.hard.forEach(m => console.log('  ✗ HARD  ' + m));
  r.soft.forEach(m => console.log('  · soft  ' + m));
  console.log('\nvoorbeeldvraag:'); console.log(JSON.stringify(ld.sv[3], null, 1));
  process.exit(r.hard.length ? 1 : 0);
}
