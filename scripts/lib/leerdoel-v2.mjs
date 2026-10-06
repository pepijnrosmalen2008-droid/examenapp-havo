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
const KAAL_NEE = /^(nee|fout|onjuist|niet juist|klopt niet)\b[^.]{0,45}\.?$/i;

export function checkV2(ld, samHtml) {
  const hard = [], soft = [];
  const sv = ld.sv || [], ond = ld.onderwerpen || [];
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
    if (q.ctx && String(q.ctx).trim().length >= 40) { metCtx++; if (String(q.ctx).length > 420) hard.push(`${t}: ctx te lang (${String(q.ctx).length} > 420): kort de casus in`); }
    stammen.push((v + ' ' + (q.ctx || '')).trim());
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
  for (let a = 0; a < stammen.length; a++) for (let b = a + 1; b < stammen.length; b++)
    if (jaccard(stammen[a], stammen[b]) > 0.75) hard.push(`Q${a + 1} en Q${b + 1} zijn bijna dezelfde vraag`);
  ond.forEach((o, k) => { if (perS[k] < 2) hard.push(`onderwerp ${k} "${o}": ${perS[k]} vraag/vragen (min. 2, zodat de vervolgvraag na een fout iets heeft)`); });
  [1, 2, 3].forEach(d => { if (perD[d] < 4) hard.push(`R${d}: ${perD[d]} vragen (min. 4 per niveau, voor de adaptieve trap)`); });
  if (defStam > 5) hard.push(`${defStam} kale definitievragen ("Wat is ...?"): max. 5, de rest toepassen/onderscheiden/redeneren`);
  if (metCtx < 5) hard.push(`${metCtx} vragen met een casus/bron/meetreeks/fragment in ctx (min. 5)`);

  const beg = ld.begrippen || [];
  if (beg.length < 10) hard.push(`begrippen: ${beg.length} < 10`);
  const oe = ld.oe || [];
  if (oe.length < 5) hard.push(`oe: ${oe.length} < 5 examenvragen`);
  oe.forEach((q, i) => { if (!q.u || String(q.u).trim().length < 60) hard.push(`oe ${i + 1}: modelantwoord (u) te kort (< 60): schrijf het antwoord zoals een correctievoorschrift`); });

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
    const sleutel = [...beg.map(b => b.t), ...ond].flatMap(x => String(x || '').toLowerCase().split(/[\s/(),&:]+/)).filter(w => w.length >= 5);
    const blokken = h.match(/<div class="sam-(figure|clip)[^"]*">[\s\S]*?(<\/svg>[\s\S]*?<\/div>)/g) || [];
    blokken.forEach((b, i) => {
      const lbl = ((b.match(/aria-label="([^"]*)"/) || [])[1] || '') + ' ' + ((b.match(/class="sam-figcap">([\s\S]*?)<\/div>/) || [])[1] || '');
      if (!sleutel.some(w => lbl.toLowerCase().includes(w))) hard.push(`figuur/clip ${i + 1}: aria-label en bijschrift noemen geen enkel begrip of onderwerp van dit leerdoel: hoort hij hier wel?`);
    });
  }
  return { hard, soft };
}
