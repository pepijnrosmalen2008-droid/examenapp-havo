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
      if (chosen.length === 3) push({ _t: 'A3', stem: `Welk begrip hoort bij: "${c.d}"?`, correctOpt: c.t, correctUo: `Klopt, dit is «${c.t}».`, distrs: termDistr(chosen), u, uh, d: 3 });
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

/** Selecteer + balanceer tot een gouden bank (positie ≤40%, lengte-bias <40%, R1-R3, ≥25). */
function balance(cand, target = 26) {
  target = Math.max(target, 25);
  // d-gemengde volgorde (round-robin over R-niveaus zodat 1,2,3 aanwezig zijn).
  const dOrder = arr => { const byD = { 1: [], 2: [], 3: [] }; arr.forEach(q => byD[q.d].push(q)); const out = []; let more = true; while (more) { more = false; for (const d of [3, 2, 1]) if (byD[d].length) { out.push(byD[d].shift()); more = true; } } return out; };
  const nonL = dOrder(cand.filter(q => !q.isLongest));
  const lng = dOrder(cand.filter(q => q.isLongest));
  // Neem eerst niet-langste vragen; vul aan met langste zolang de lengte-bias < 40% blijft.
  const picked = nonL.slice(0, target);
  let longestN = 0;
  for (const q of lng) {
    if (picked.length >= target) break;
    const n = picked.length + 1, k = longestN + 1;
    if (k / n < 0.40) { picked.push(q); longestN++; }
  }
  // positie-balans: round-robin doelposities 0..3
  return picked.map((q, i) => {
    const pl = place(q.correctOpt, q.correctUo, q.distrs, i % 4);
    return { v: q.stem, o: pl.o, c: pl.c, d: q.d, u: q.u, uo: pl.uo, uh: q.uh, _t: q._t };
  });
}

const _esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/**
 * Bouw een RIJKE samenvatting (HTML met de sam-markup van de app) uit de
 * concepten: intro + een gestileerde begrippenlijst (.sam-definitie) + een
 * onthoud-blok met de belangrijkste verschillen. Zo is de samenvatting geen
 * losse alinea meer maar echte leerstof. `spec.samFull` overschrijft dit.
 */
// Render één geschreven sectie in de gouden sam-markup (kop + prosa + optioneel
// een formulebox en/of een voorbeeldopgave). p/formula/worked bevatten bewust
// HTML (bv. <strong>), dus die worden niet ge-escaped.
function renderSectie(s) {
  let out = `<div class="sam-head">${s.h}</div>`;
  (s.p || []).forEach(p => { out += `<p>${p}</p>`; });
  if (s.formula) out += `<div class="sam-formula-box"><div class="sam-formula-label">${_esc(s.formula.label)}</div><div class="sam-formula-eq">${s.formula.eq}</div>${s.formula.note ? `<div class="sam-formula-note">${s.formula.note}</div>` : ''}</div>`;
  if (s.worked) { const st = (s.worked.steps || []).map(x => `<li>${x}</li>`).join(''); out += `<div class="sam-worked"><div class="sam-worked-h">✍️ Voorbeeldopgave</div><div class="sam-worked-q">${s.worked.q}</div><ol class="sam-worked-steps">${st}</ol><div class="sam-worked-ans">✅ ${s.worked.ans}</div></div>`; }
  return out;
}
/**
 * Bouw de samenvatting. Gouden route: als de spec `intro` + `secties` geeft,
 * renderen we prosa-secties (kop, uitleg, formulebox, voorbeeldopgave) in de
 * gouden markup, gevolgd door een begrippen-overzicht + onthoud-blok. Zonder
 * secties valt hij terug op de compacte begrippen-samenvatting.
 */
function buildSummary(spec) {
  if (spec.samFull) return spec.samFull;
  const cs = spec.concepten || [];
  const defs = cs.map(c => `<div class="sam-definitie"><div class="sam-definitie-term">${_esc(c.t)}</div><div class="sam-definitie-body">${_esc(String(c.d).replace(/\.$/, ''))}.</div></div>`).join('');
  const byTerm = {}; cs.forEach(c => { byTerm[c.t.toLowerCase()] = c; });
  const contrasts = [];
  for (const c of cs) {
    if (contrasts.length >= 4) break;
    const fc = byTerm[String((c.fout || [])[0] || '').toLowerCase()];
    if (fc && !contrasts.some(x => x.includes(`«${fc.t}»`) && x.includes(`«${c.t}»`)))
      contrasts.push(`<b>«${_esc(c.t)}»</b> is ${_esc(kernOf(c))}, terwijl <b>«${_esc(fc.t)}»</b> ${_esc(kernOf(fc))} is.`);
  }
  const onthoud = contrasts.length ? `<div class="sam-onthoud"><b>Let op de verschillen.</b> ${contrasts.join(' ')}</div>` : '';
  const begSection = `<div class="sam-head">Begrippen op een rij</div>${defs}${onthoud}`;
  if (Array.isArray(spec.secties) && spec.secties.length) {
    const intro = spec.intro ? `<div class="sam-intro">${spec.intro}</div>` : (spec.sam || '');
    return intro + spec.secties.map(renderSectie).join('') + begSection;
  }
  const intro = spec.sam || '';
  return `${intro}<div class="sam-head">Kernbegrippen</div>${defs}${onthoud}`;
}

// ── Situatie-vraaggenerator ─────────────────────────────────────────────────
// Maakt SITUATIE-vragen uit de begrippenkaarten: elke kaart krijgt een of meer
// concrete situaties (`vb`). Uit zo'n situatie bouwt de generator een inzicht-
// vraag "herken het begrip in deze situatie" met gewone begrippen als opties
// (GEEN haakjes) en persoonlijke per-optie-uitleg. Eén vraag per situatie, dus
// geen herhaling van hetzelfde begrip in drie vormen. De situatie zelf noemt het
// begrip niet; dat schrijf je bij het opstellen van `vb`.
const _lc1 = s => { s = String(s || '').trim(); return s ? s[0].toLowerCase() + s.slice(1) : s; };
const _stripEnd = s => String(s || '').replace(/[.\s]+$/, '');
const _endPunc = s => { s = String(s || '').trim(); return /[.!?]$/.test(s) ? s : s + '.'; };
const _PROMPTS = ['Welk begrip past hierbij?', 'Om welk begrip gaat het?', 'Welk begrip herken je hier?', 'Wat is hier aan de hand?'];
function generateSupplement(concepten, authored, perDiff) {
  const cs = (concepten || []).filter(c => c && c.t);
  if (cs.length < 4) return [];
  const byTerm = {}; cs.forEach(c => { byTerm[c.t.toLowerCase()] = c; });
  const norm = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const kernFor = c => _stripEnd(kernOf(c));
  const used = new Set((authored || []).map(q => norm(q.v)));
  const out = [];
  const add = q => {
    const k = norm(q.v);
    if (used.has(k) || q.v.length > MAX_STEM) return;
    if (new Set(q.o.map(norm)).size !== 4 || q.o.some(o => !String(o).trim())) return;
    if (q.uo.some(w => String(w).trim().length < MIN_UO) || String(q.u).length < MIN_U) return;
    used.add(k); out.push(q);
  };
  // Afleiders: bij een makkelijke vraag (d1) verre begrippen, bij een moeilijke
  // (d3) juist de verwarbare (fout) begrippen, zodat de moeilijkheid echt oploopt.
  const distractors = (c, d) => {
    const close = (c.fout || []).map(t => byTerm[norm(t)]).filter(Boolean).filter(x => x.t !== c.t);
    const far = cs.filter(x => x.t !== c.t && !close.includes(x));
    const order = d >= 3 ? [...close, ...shuffle(far, c.t.length + 5)]
      : d === 2 ? [...shuffle(close, c.t.length + 2), ...shuffle(far, c.t.length + 7)]
        : [...shuffle(far, c.t.length + 3), ...close];
    return order.slice(0, 3);
  };
  // Verzamel alle (begrip, situatie)-paren. `vb` mag een string of {s} zijn; een
  // eventuele d-tag wordt genegeerd, want de generator balanceert de moeilijkheid
  // zelf. De moeilijkheid bepaalt welke afleiders je krijgt: bij makkelijk verre
  // begrippen, bij moeilijk juist de verwarbare.
  const pairs = [];
  for (const c of cs) {
    const vbs = Array.isArray(c.vb) ? c.vb : (c.vb ? [c.vb] : []);
    for (const raw of vbs) { const s = typeof raw === 'string' ? raw : (raw && raw.s); if (s) pairs.push({ c, s }); }
  }
  // Seed met de handgeschreven verdeling, en vul daarna de minst gevulde
  // moeilijkheid steeds als eerste aan (richting 10/10/10).
  const filled = { 1: 0, 2: 0, 3: 0 };
  (authored || []).forEach(q => { if (filled[q.d] != null) filled[q.d]++; });
  let pi = 0;
  for (const { c, s } of shuffle(pairs, 101)) {
    const d = [1, 2, 3].reduce((best, x) => (filled[x] < filled[best] ? x : best), 1);
    const ds = distractors(c, d); if (ds.length < 3) continue;
    const prompt = _PROMPTS[pi++ % _PROMPTS.length];
    const before = out.length;
    add({
      v: `${_endPunc(s)} ${prompt}`,
      o: [c.t, ...ds.map(x => x.t)], c: 0, d,
      u: `${_endPunc(s)} Dat past bij ${c.t}: ${kernFor(c)}.`,
      uo: [`Klopt: ${kernFor(c)}.`, ...ds.map(x => `Nee, dat hoort bij ${x.t}: ${kernFor(x)}.`)],
      uh: `${c.t}: ${kernFor(c)}.`,
    });
    if (out.length > before) filled[d]++;
  }
  return out;
}

/** Bouw het volledige leerdoel-object. */
export function expandLeerdoel(spec) {
  const beg = spec.concepten.map(c => ({ t: c.t, d: c.d }));
  // Vragen: als de spec HANDGESCHREVEN gouden vragen (spec.vragen) meelevert,
  // gebruiken we ALLEEN die (scenario-/begripsvragen met echte per-optie-uitleg).
  // Zonder spec.vragen valt de fabriek terug op de term-generator (begrip-herkenning)
  // - handig voor een snelle eerste vulling, maar niet de gouden standaard.
  let sv;
  if (Array.isArray(spec.vragen) && spec.vragen.length) {
    // Compact formaat: je schrijft {v,o,c,d,uo}; u (takeaway) en uh (onthoud)
    // worden afgeleid uit de juiste per-optie-uitleg als je ze niet meegeeft.
    sv = spec.vragen.map(q => {
      const o = q.o;
      // Per-optie-uitleg verrijken: een te korte afleider-reactie ("Nee.") krijgt
      // automatisch het juiste antwoord erbij, zodat elke optie iets uitlegt in
      // plaats van enkel te ontkennen. Reeds volwaardige redenen blijven staan.
      const uo = (q.uo || []).map((x, i) => {
        const s = String(x).trim();
        if (i === q.c) return s.length >= 8 ? s : 'Ja, dat klopt.';
        if (s.length >= 12) return s;
        const kort = s.replace(/[.!\s]*$/, '').trim();
        return `${kort ? kort + ', ' : 'Nee, '}het juiste antwoord is «${o[q.c]}».`;
      });
      let u = q.u;
      if (!u) { u = String(uo[q.c] || '').replace(/^(klopt|ja,? dat klopt)[\s:,.‑-]*/i, '').trim(); u = u ? u.charAt(0).toUpperCase() + u.slice(1) : ''; if (u.length < 12) u = 'Het juiste antwoord is: ' + o[q.c] + '.'; }
      // Onthoud = geheugensteun: noem het juiste antwoord samen met de kernreden,
      // zodat deze regel iets toevoegt boven de losse "waarom juist"-uitleg.
      let uh = q.uh;
      if (!uh) { const ans = String(o[q.c] || '').trim(); uh = (ans && u && !u.toLowerCase().startsWith(ans.toLowerCase().slice(0, 10))) ? `${ans}: ${u}` : u; }
      return { v: q.v, o, c: q.c, d: q.d, u, uo, uh };
    });
    // Situatie-aanvulling: waar begrippen concrete situaties (`vb`) hebben, maakt
    // de generator daar situatievragen van. Handgeschreven vragen blijven vooraan.
    if (spec.concepten && spec.concepten.some(c => c && (Array.isArray(c.vb) ? c.vb.length : c.vb))) {
      sv = [...sv, ...generateSupplement(spec.concepten, sv, spec.perDiff || 10)];
    }
    // Positiebalans: verdeel het juiste antwoord round-robin over 0..3 zodat geen
    // positie oververtegenwoordigd is (poort tegen positie-bias). De opties en de
    // per-optie-uitleg (uo) verhuizen mee, zodat alles gekoppeld blijft. In de app
    // worden opties bij het tonen sowieso nog eens geschud, dus dit is puur hygiëne.
    sv = sv.map((q, i) => {
      const t = i % 4;
      if (q.c === t) return q;
      const o = q.o.slice(), uo = q.uo.slice();
      [o[q.c], o[t]] = [o[t], o[q.c]];
      [uo[q.c], uo[t]] = [uo[t], uo[q.c]];
      return { ...q, c: t, o, uo };
    });
  } else {
    const bank = balance(genBank(spec.concepten), spec.target || 26);
    const toepas = (spec.toepas || []).map(q => ({ ...q }));
    sv = [...toepas, ...bank].map(({ _t, ...q }) => q);
  }
  const ld = {
    id: spec.leerdoel, naam: spec.naam,
    beschrijving: spec.beschrijving || '', ceStatus: spec.ceStatus || 'CE',
    onderwerpen: spec.onderwerpen || [], sam: buildSummary(spec),
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
    // lengte-bias = échte weggever: het juiste antwoord is duidelijk het langst
    // (uniek maximum én minstens 8 tekens langer dan de op één na langste optie).
    // Kleine lengteverschillen tellen niet als weggever.
    if (o.length === 4 && Number.isInteger(q.c)) { const L = o.map(x => String(x).length); const second = Math.max(...L.filter((_, i) => i !== q.c)); if (L[q.c] === Math.max(...L) && L[q.c] - second >= 8) longest++; }
  });
  const n = sv.length || 1;
  const posShare = Math.max(...cPos) / (cPos.reduce((a, b) => a + b, 0) || 1);
  if (posShare > MAX_POS) hard.push(`positie-bias ${(posShare * 100).toFixed(0)}% (max 40%)`);
  // lengte-bias is een ZACHT aandachtspunt bij handgeschreven vragen (echte,
  // betekenisvolle afleiders); het blokkeert niet. Streef wel naar korte juiste
  // antwoorden zodat de langste optie niet stelselmatig het goede is.
  const beg = ld.begrippen || [];
  if (beg.length < 8) hard.push(`begrippen ${beg.length} < 8`);
  beg.forEach((b, i) => { if (!b.t || !String(b.t).trim()) hard.push(`begrip ${i + 1}: term ontbreekt`); if (!b.d || String(b.d).trim().length < 12) hard.push(`begrip ${i + 1}: definitie te kort`); if (overclaim(String(b.d || ''))) hard.push(`begrip ${i + 1}: overclaim`); });
  const soft = [];
  if (longest / n > MAX_LONGEST) soft.push(`lengte-bias ${longest}/${n}: juist antwoord vaak het langst (streef < 40%)`);
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
        dom.sam = ld.sam;
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
