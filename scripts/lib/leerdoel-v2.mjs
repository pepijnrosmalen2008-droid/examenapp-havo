/**
 * leerdoel-v2.mjs - de inhoudelijke regels van de gouden standaard v2
 * (docs/GOUDEN-STANDAARD-V2.md). Gedeeld door check-leerdoel.mjs (vóór integratie)
 * en validate-goldstandard.mjs (in smoke/CI, voor elke module met gs:2).
 *
 * checkV2(ld, samHtml?) -> { hard: string[], soft: string[] }
 */
const woorden = s => new Set(String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').match(/[a-z0-9]{3,}/g) || []);
const jaccard = (a, b) => { const A = woorden(a), B = woorden(b); if (!A.size || !B.size) return 0; let i = 0; A.forEach(w => { if (B.has(w)) i++; }); return i / (A.size + B.size - i); };
const zichtbaar = html => String(html || '').replace(/<!--[\s\S]*?-->/g, '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, 'x').replace(/\s+/g, ' ').trim();
const DEF_STAM = /^(wat is|wat zijn|wat betekent|wat houdt|wat wordt (er )?bedoeld|welke omschrijving|hoe heet)/i;
// Taalvakken: bij een CE-domein horen echte leesteksten (zie §5 van de lat).
const TAALVAK = /^(nl|en|du|fa|sp|la|gr|fi|it|tu|ar|ch|ru)$/;
const KAAL_NEE = /^(nee|fout|onjuist|niet juist|klopt niet)\b[^.]{0,45}\.?$/i;

export function checkV2(ld, samHtml, opt = {}) {
  const hard = [], soft = [];
  // Strengere regels (okt 2026, na de eerste routine-output): hard vóór integratie
  // (check-leerdoel.mjs), zacht in CI voor modules die al live staan.
  const streng = opt.streng ? hard : soft;
  const sv = ld.sv || [], ond = ld.onderwerpen || [];
  const vak = String(ld.lo || '').split('.')[0].toLowerCase();
  const taal = TAALVAK.test(vak), ceTaal = taal && /CE/.test(String(ld.ceStatus || ''));
  if (!ond.length) hard.push('onderwerpen[] ontbreekt (nodig voor s-tags en adaptief oefenen)');
  // naam en beschrijving staan op het leerdoelenscherm: geschreven voor de leerling, zonder jargon
  if (/gouden|standaard|module|engine|\bR[1-5]\b|leerdoel-id|[a-z]{2}\.[A-Z]\.\d/i.test((ld.naam || '') + ' ' + (ld.beschrijving || ''))) hard.push('naam/beschrijving bevat intern jargon (gouden standaard, module, R-niveau, leerdoel-id): schrijf voor de leerling');
  if (String(ld.beschrijving || '').trim().length < 40) hard.push('beschrijving te kort (< 40 tekens): wat kan de leerling na dit leerdoel?');
  if (sv.length < 25) hard.push(`sv: ${sv.length} < 25 vragen`);

  const perS = new Array(ond.length).fill(0), perD = { 1: 0, 2: 0, 3: 0 };
  let defStam = 0, metCtx = 0;
  const stammen = [];
  sv.forEach((q, i) => {
    const t = 'Q' + (i + 1);
    if (!Number.isInteger(q.s) || q.s < 0 || q.s >= ond.length) hard.push(`${t}: s (onderwerp-index 0..${ond.length - 1}) ontbreekt of ongeldig`);
    else perS[q.s]++;
    if (perD[q.d] != null) perD[q.d]++;
    const v = String(q.v || '');
    if (/[«»]/.test(v)) hard.push(`${t}: sjabloonvraag met «» - schrijf een echte vraag`);
    if (DEF_STAM.test(v.trim())) defStam++;
    const maxCtx = taal ? 1400 : 600;
    if (q.ctx && String(q.ctx).trim().length >= 40) { metCtx++; if (String(q.ctx).length > maxCtx) hard.push(`${t}: ctx te lang (${String(q.ctx).length} > ${maxCtx}): kort de casus in`); }
    stammen.push({ v, ctx: String(q.ctx || '').trim() });
    const uo = Array.isArray(q.uo) ? q.uo : [];
    uo.forEach((w, k) => {
      const s = String(w || '').trim();
      if (k === q.c) {
        if (s.length < 45) hard.push(`${t}: uitleg bij het juiste antwoord te kort (${s.length} < 45): zeg wáárom het klopt`);
      } else {
        if (s.length < 70) hard.push(`${t}: uitleg bij fout antwoord ${'ABCD'[k]} te kort (${s.length} < 70): benoem de denkfout en het juiste onderscheid`);
        else if (s.length > 360) hard.push(`${t}: uitleg bij ${'ABCD'[k]} te lang (${s.length} > 360)`);
        if (KAAL_NEE.test(s)) hard.push(`${t}: uitleg bij ${'ABCD'[k]} is een kaal "nee": leg de denkfout uit`);
      }
    });
    const fout = uo.filter((_, k) => k !== q.c);
    for (let a = 0; a < fout.length; a++) for (let b = a + 1; b < fout.length; b++)
      if (jaccard(fout[a], fout[b]) > 0.6) hard.push(`${t}: twee foute-antwoord-uitleggen zijn bijna gelijk: elke afleider heeft zijn eigen denkfout`);
  });
  // Uitleg moet de gekozen optie noemen en de denkfout uitleggen, en afleiders moeten echte fouten zijn.
  const fouteUo = sv.flatMap(q => (q.uo || []).filter((_, k) => k !== q.c).map(String));
  if (fouteUo.length) {
    // Ondergrens (meer dan goed genoeg) is hard vóór integratie; de streefwaarde (niveau bi.M3) is een waarschuwing.
    const meld = (waarde, grens, streef, tekst) => { if (waarde < grens) streng.push(tekst + ' (ondergrens)'); else if (waarde < streef) soft.push(tekst + ' (streefwaarde, mag)'); };
    const dit = fouteUo.filter(u => /^koos je dit\?/i.test(u.trim())).length / fouteUo.length;
    const kort = fouteUo.filter(u => u.trim().length < 100).length / fouteUo.length;
    const gem = fouteUo.reduce((a, u) => a + u.length, 0) / fouteUo.length;
    meld(1 - dit, 0.4, 0.7, `${Math.round(dit * 100)}% van de foute-antwoord-uitleg begint met een kaal "Koos je dit?" (max. 60%, streef 30%): noem wat de leerling koos ("Koos je 'hormoon'? Dan denk je ...")`);
    meld(1 - kort, 0.6, 0.8, `${Math.round(kort * 100)}% van de foute-antwoord-uitleg is korter dan 100 tekens (max. 40%, streef 20%): benoem denkfout, waarom niet, en het juiste onderscheid`);
    meld(gem, 105, 120, `gemiddelde foute-antwoord-uitleg ${Math.round(gem)} tekens (min. 105, streef 120; bi.M3: 158)`);
  }
  const wc = x => String(x || '').trim().split(/\s+/).length;
  const nep = [];
  // Opvulafleider: een los woord uit het fragment als antwoordoptie ("school", "de bus") naast een
  // volzin als juist antwoord. Korte vaktermen (bv. namen van drogredenen) zijn wél echte afleiders.
  sv.forEach((q, i) => (q.o || []).forEach((o, k) => {
    if (k !== q.c && wc(o) <= 2 && wc((q.o || [])[q.c]) >= 3 && q.ctx && String(q.ctx).toLowerCase().includes(String(o).toLowerCase().trim())) nep.push(`Q${i + 1} "${o}"`);
  }));
  if (nep.length) streng.push(`opvulafleiders (los woord uit het fragment, meteen weg te strepen): ${nep.slice(0, 6).join(', ')}: vervang door een echte denkfout van leerlingen`);
  // Vragen bij dezelfde leestekst delen hun ctx: vergelijk dan alleen de vraag zelf.
  for (let a = 0; a < stammen.length; a++) for (let b = a + 1; b < stammen.length; b++) {
    const A = stammen[a], B = stammen[b], zelfdeTekst = A.ctx && A.ctx === B.ctx;
    const sim = zelfdeTekst ? jaccard(A.v, B.v) : jaccard(A.v + ' ' + A.ctx, B.v + ' ' + B.ctx);
    if (sim > (zelfdeTekst ? 0.6 : 0.75)) hard.push(`Q${a + 1} en Q${b + 1} zijn bijna dezelfde vraag`);
  }

  // ── Moeilijker (okt 2026, na de rating: routine-output was goed maar makkelijker dan het examen).
  // Hard vóór integratie (streng), waarschuwing in CI voor modules die al live staan.
  if (perD[3] < 8) streng.push(`R3: ${perD[3]} vragen (min. 8): meer examenniveau, met een casus of tekst en twee stappen redeneren`);
  if (perD[2] < 8) streng.push(`R2: ${perD[2]} vragen (min. 8)`);
  if (perD[1] > 7) streng.push(`R1: ${perD[1]} vragen (max. 7): minder herkennen, meer toepassen`);
  const d3 = sv.filter(q => q.d === 3), d3ctx = d3.filter(q => String(q.ctx || '').trim().length >= 120).length;
  if (d3.length && d3ctx / d3.length < 0.8) streng.push(`R3: ${d3ctx} van ${d3.length} met een casus/tekst van min. 120 tekens (min. 80%): examenvragen beginnen bij een situatie, niet bij een definitie`);
  const ctxL = sv.map(q => String(q.ctx || '').trim().length).filter(n => n >= 40);
  if (ctxL.length < 8) streng.push(`${ctxL.length} vragen met ctx (min. 8)`);
  else if (ctxL.reduce((a, n) => a + n, 0) / ctxL.length < 150) streng.push(`ctx gemiddeld ${Math.round(ctxL.reduce((a, n) => a + n, 0) / ctxL.length)} tekens (min. 150): geef de leerling een echte casus, meetreeks of tekst, geen losse zin`);
  if (defStam > 3) streng.push(`${defStam} kale definitievragen (max. 3 bij nieuwe leerdoelen)`);
  if (ceTaal) {
    const teksten = {};
    sv.forEach(q => { const c = String(q.ctx || '').trim(); if (c.length >= 500) teksten[c] = (teksten[c] || 0) + 1; });
    const lang = Object.values(teksten).filter(n => n >= 3).length;
    if (lang < 2) streng.push(`leesteksten: ${lang} tekst(en) van 500-1400 tekens met min. 3 vragen (min. 2): het CE werkt met echte teksten, niet met losse zinnen. Zet dezelfde tekst in ctx van elke vraag erbij`);
  }
  ond.forEach((o, k) => { if (perS[k] < 2) hard.push(`onderwerp ${k} "${o}": ${perS[k]} vraag/vragen (min. 2, zodat de vervolgvraag na een fout iets heeft)`); });
  [1, 2, 3].forEach(d => { if (perD[d] < 4) hard.push(`R${d}: ${perD[d]} vragen (min. 4 per niveau, voor de adaptieve trap)`); });
  if (defStam > 5) hard.push(`${defStam} kale definitievragen ("Wat is ...?"): max. 5, de rest toepassen/onderscheiden/redeneren`);
  if (metCtx < 5) hard.push(`${metCtx} vragen met een casus/bron/meetreeks/fragment in ctx (min. 5)`);

  const beg = ld.begrippen || [];
  if (beg.length < 10) hard.push(`begrippen: ${beg.length} < 10`);
  const oe = ld.oe || [];
  if (oe.length < 5) hard.push(`oe: ${oe.length} < 5 examenvragen`);
  oe.forEach((q, i) => { if (!q.u || String(q.u).trim().length < 60) hard.push(`oe ${i + 1}: modelantwoord (u) te kort (< 60): schrijf het antwoord zoals een correctievoorschrift`); });
  const oeCtx = oe.filter(q => String(q.ctx || '').trim().length >= 150).length;
  if (oe.length && oeCtx < Math.min(4, oe.length)) streng.push(`examenvragen: ${oeCtx} met een casus/bron van min. 150 tekens (min. 4)`);
  const open = oe.filter(q => !Array.isArray(q.o) || !q.o.length); // meerkeuze = 1 punt, geen verdeling nodig
  const oePunt = open.filter(q => /\(\s*\d\s*p\s*\)|\d\s*punt|\bpunt(en)?\b/i.test(String(q.u || ''))).length;
  if (open.length && oePunt < open.length) streng.push(`examenvragen: ${open.length - oePunt} open modelantwoord(en) zonder puntenverdeling ("(1p)", "1 punt voor ..."), zoals in een correctievoorschrift`);

  if (samHtml != null) {
    const h = String(samHtml);
    if (/—/.test(h)) hard.push('samenvatting: em dash (—)');
    const hoofd = h.split(/(?=<div class="sam-chapter")/).filter(x => x.startsWith('<div class="sam-chapter"'));
    if (!/class="sam-intro"/.test(h)) hard.push('samenvatting: sam-intro ontbreekt');
    if (!/class="sam-table"/.test(h)) hard.push('samenvatting: begrippenlijst (sam-table) ontbreekt');
    if (hoofd.length < 3) hard.push(`samenvatting: ${hoofd.length} hoofdstukken (min. 3)`);
    hoofd.forEach((c, i) => { if (!/class="sam-figure"|class="sam-clip /.test(c)) hard.push(`samenvatting: hoofdstuk ${i + 1} heeft geen figuur of clip`); });
    if (!/class="sam-tip"/.test(h)) hard.push('samenvatting: examentip (sam-tip) ontbreekt');
    const tekst = zichtbaar(h);
    if (tekst.length < 2500) hard.push(`samenvatting: ${tekst.length} tekens leestekst (min. 2500): te dun voor een heel leerdoel`);
    if (tekst.length > 14000) soft.push(`samenvatting: ${tekst.length} tekens: is alles nodig?`);
    const tl = tekst.toLowerCase();
    const gedekt = beg.filter(b => { const w = String(b.t || '').toLowerCase().split(/[\s/(),&]+/).filter(x => x.length >= 4)[0]; return w && tl.includes(w); }).length;
    if (beg.length && gedekt / beg.length < 0.8) hard.push(`samenvatting noemt maar ${gedekt}/${beg.length} begrippen (min. 80%)`);
    if (/var\(--or\)/.test(h)) {
      const caps = (h.match(/<div class="sam-figcap">[\s\S]*?<\/div>/g) || []).join(' ') + ' ' + tekst;
      const m = caps.match(/\b(oranje|blauwe?|paarse?|groene?) (zone|lijn|curve|vlak|deel|gebied|pijl)\b/i);
      if (m) hard.push(`samenvatting verwijst naar "${m[0]}" maar var(--or) is per niveau een andere kleur: noem de vorm, niet de kleur`);
    }
    // ── Uitgebreidere figuren (okt 2026): geen opgemaakte lijstjes, echte tekeningen.
    const svgs = [...h.matchAll(/<div class="sam-(figure|clip)[^"]*">[\s\S]*?<svg[\s\S]*?<\/svg>/g)].map(m => ({ clip: m[1] === 'clip', svg: m[0] }));
    const teken = x => (x.match(/<(path|line|circle|ellipse|polygon|polyline)\b/g) || []).length;
    const labels = x => (x.match(/<text\b/g) || []).length;
    if (svgs.length < 4) streng.push(`samenvatting: ${svgs.length} figuren/clips (min. 4)`);
    const lijst = svgs.filter(f => !f.clip && teken(f.svg) < 3).length;
    if (lijst > 1) streng.push(`samenvatting: ${lijst} figuren zijn alleen vakjes met tekst (max. 1): teken het verband (pijlen, lijnen, assen, haken, een doorsnede), geen opgemaakte lijst`);
    const rijk = svgs.filter(f => f.clip || (teken(f.svg) >= 6 && labels(f.svg) >= 5)).length;
    if (rijk < 2) streng.push(`samenvatting: ${rijk} rijke figuren (min. 2 met ≥6 lijnen/paden/vormen en ≥5 labels, of een clip): denk aan een grafiek met assen en ticks, een doorsnede, een proces met pijlen, een geannoteerd tekstfragment`);
    const sleutel = [...beg.map(b => b.t), ...ond].flatMap(x => String(x || '').toLowerCase().split(/[\s/(),&:]+/)).filter(w => w.length >= 5);
    const blokken = h.match(/<div class="sam-(figure|clip)[^"]*">[\s\S]*?(<\/svg>[\s\S]*?<\/div>)/g) || [];
    blokken.forEach((b, i) => {
      const lbl = ((b.match(/aria-label="([^"]*)"/) || [])[1] || '') + ' ' + ((b.match(/class="sam-figcap">([\s\S]*?)<\/div>/) || [])[1] || '');
      if (!sleutel.some(w => lbl.toLowerCase().includes(w))) hard.push(`figuur/clip ${i + 1}: aria-label en bijschrift noemen geen enkel begrip of onderwerp van dit leerdoel: hoort hij hier wel?`);
    });
  }
  return { hard, soft };
}
