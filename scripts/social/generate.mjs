#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// generate.mjs · maakt een complete week social content, klaar om goed te keuren
//
//   node scripts/social/generate.mjs                 → volgende week
//   node scripts/social/generate.mjs --week 2026-W41
//   node scripts/social/generate.mjs --zonder-video  → sneller, zonder Reel
//
// Schrijft naar social/weken/<week>/:
//   *.jpg / *.mp4   de media (JPEG/MP4, zoals Instagram ze wil)
//   plan.json       wat er wanneer geplaatst wordt, met onderschrift
//   OVERZICHT.md    alles op één pagina, om in de goedkeurings-PR te bekijken
// en houdt social/geschiedenis.json bij zodat vragen en vakken niet herhalen.
//
// Weekritme (NL-tijd): ma 07:45 story + 17:30 aftellen · wo 17:30 examenvraag
// · vr 17:00 begrippen · zo 19:30 reel. Niveaus rouleren per week.
// ═══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import * as D from './lib/data.mjs';
import * as F from './lib/formats.mjs';
import * as C from './lib/captions.mjs';
import { renderSlides } from './lib/render.mjs';

const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const ZONDER_VIDEO = args.includes('--zonder-video');

// ── Datums ────────────────────────────────────────────────────────────────
function isoWeek(d) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dag = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dag);
  const jaar = t.getUTCFullYear(), week = Math.ceil(((t - Date.UTC(jaar, 0, 1)) / 864e5 + 1) / 7);
  return `${jaar}-W${String(week).padStart(2, '0')}`;
}
function maandagVan(week) {
  const [j, w] = week.split('-W').map(Number);
  const jan4 = new Date(Date.UTC(j, 0, 4)); const dag = jan4.getUTCDay() || 7;
  const ma = new Date(jan4); ma.setUTCDate(jan4.getUTCDate() - dag + 1 + (w - 1) * 7);
  return ma;
}
const isoDag = d => d.toISOString().slice(0, 10);
function nlTijd(datum, hhmm) {
  // offset van Europe/Amsterdam op die dag (+01:00 of +02:00)
  const probe = new Date(`${datum}T12:00:00Z`);
  const off = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Amsterdam', timeZoneName: 'longOffset' })
    .formatToParts(probe).find(p => p.type === 'timeZoneName').value.replace('GMT', '') || '+00:00';
  return `${datum}T${hhmm}:00${off}`;
}

const WEEK = opt('--week') || isoWeek(new Date(Date.now() + 7 * 864e5));
const MA = maandagVan(WEEK);
const dag = n => { const d = new Date(MA); d.setUTCDate(MA.getUTCDate() + n); return isoDag(d); };
const weekNr = Number(WEEK.split('-W')[1]);
const OUT = path.join(D.ROOT, 'social/weken', WEEK);
const GESCH = path.join(D.ROOT, 'social/geschiedenis.json');

const r = D.rng(WEEK);
const gesch = fs.existsSync(GESCH) ? JSON.parse(fs.readFileSync(GESCH, 'utf8')) : { vragen: [], begrippen: [], vakken: {}, weken: [] };
if (gesch.weken.includes(WEEK) && !args.includes('--opnieuw')) {
  console.error(`${WEEK} is al gegenereerd. Gebruik --opnieuw om hem opnieuw te maken.`); process.exit(1);
}

// Niveaus rouleren: elke week een ander niveau voor vraag / begrippen / reel.
const ROT = ['havo', 'vwo', 'vmbo'];
const nivVraag = ROT[weekNr % 3], nivBeg = ROT[(weekNr + 1) % 3], nivReel = ROT[(weekNr + 2) % 3];

// Kies het vak dat voor dit niveau het langst niet aan de beurt was.
function kiesVak(niveau, geschikt) {
  const recent = gesch.vakken[niveau] || [];
  const kandidaten = D.vakken(niveau).filter(v => geschikt(v.id));
  kandidaten.sort((a, b) => {
    const ia = recent.lastIndexOf(a.id), ib = recent.lastIndexOf(b.id);
    return ia - ib || r() - 0.5;                          // -1 (nooit) eerst
  });
  const v = kandidaten[0];
  gesch.vakken[niveau] = [...recent.filter(x => x !== v.id), v.id].slice(-20);
  return v;
}

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const posts = [];
const rel = f => path.basename(f);

try {
  // ── Maandag: aftellen (feed + story) ─────────────────────────────────────
  const af = F.aftellen(dag(0));
  const afVars = { dagen: af.dagen, weken: Math.round(af.dagen / 7), weekenden: af.weekenden, datum: F.datumNL(af.startDatum) };
  await renderSlides(browser, af.story, [path.join(OUT, 'ma-story-aftellen.jpg')]);
  await renderSlides(browser, af.feed, [path.join(OUT, 'ma-aftellen.jpg')]);
  posts.push({ id: `${WEEK}-ma-story`, type: 'aftellen', format: 'story', publiceren: nlTijd(dag(0), '07:45'),
    bestanden: ['ma-story-aftellen.jpg'], caption: '', info: `Story: nog ${af.dagen} dagen` });
  posts.push({ id: `${WEEK}-ma-aftellen`, type: 'aftellen', format: 'image', publiceren: nlTijd(dag(0), '17:30'),
    bestanden: ['ma-aftellen.jpg'], caption: C.captionAftellen(r, afVars), info: `Nog ${af.dagen} dagen tot ${af.startDatum}` });

  // ── Woensdag: examenvraag-carrousel ──────────────────────────────────────
  const vakQ = kiesVak(nivVraag, id => D.geschikteVragen(nivVraag, id).some(q => !gesch.vragen.includes(q.id)));
  const pool = D.geschikteVragen(nivVraag, vakQ.id).filter(q => !gesch.vragen.includes(q.id));
  // Voorkeur: CE-stof, een echte uitleg en een 'waarom niet'-uitleg bij een fout antwoord.
  const score = q => (q.ce ? 3 : 0) + (q.uitleg.length >= 45 ? 2 : 0) + (q.perOptie ? 2 : 0) + (q.moeilijk >= 3 ? 1 : 0) + r();
  const vraag = [...pool].sort((a, b) => score(b) - score(a))[0];
  gesch.vragen.push(vraag.id);
  const ev = F.examenvraag(vraag);
  const evFiles = ev.slides.map((_, i) => path.join(OUT, `wo-examenvraag-${i + 1}.jpg`));
  await renderSlides(browser, ev.slides, evFiles);
  const niv = n => D.NIVEAUS[n].label;
  posts.push({ id: `${WEEK}-wo-examenvraag`, type: 'examenvraag', format: 'carousel', publiceren: nlTijd(dag(2), '17:30'),
    bestanden: evFiles.map(rel), niveau: nivVraag, vak: vakQ.naam,
    caption: C.captionVraag(r, { vak: vakQ.naam, niveau: niv(nivVraag), niveauId: nivVraag, domein: vraag.domeinNaam }, vraag.ce),
    info: `${niv(nivVraag)} ${vakQ.naam}: ${vraag.vraag}`, bron: vraag.id });

  // ── Vrijdag: begrippen-carrousel ─────────────────────────────────────────
  const vakB = kiesVak(nivBeg, id => D.geschikteBegrippenSets(nivBeg, id).some(s => !gesch.begrippen.includes(s.id)));
  const sets = D.geschikteBegrippenSets(nivBeg, vakB.id).filter(s => !gesch.begrippen.includes(s.id));
  const set = [...sets].sort((a, b) => (b.ce - a.ce) || (r() - 0.5))[0];
  gesch.begrippen.push(set.id);
  const vijf = D.schud(r, set.begrippen).slice(0, 5);
  const bg = F.begrippen(set, vijf);
  const bgFiles = bg.slides.map((_, i) => path.join(OUT, `vr-begrippen-${i + 1}.jpg`));
  await renderSlides(browser, bg.slides, bgFiles);
  posts.push({ id: `${WEEK}-vr-begrippen`, type: 'begrippen', format: 'carousel', publiceren: nlTijd(dag(4), '17:00'),
    bestanden: bgFiles.map(rel), niveau: nivBeg, vak: vakB.naam,
    caption: C.captionBegrippen(r, { vak: vakB.naam, niveau: niv(nivBeg), niveauId: nivBeg, domein: set.domeinNaam, totaal: bg.totaalBegrippen }),
    info: `${niv(nivBeg)} ${vakB.naam}: ${vijf.map(b => b.t).join(', ')}`, bron: set.id });

  // ── Zondag: faceless Reel uit de echte app ───────────────────────────────
  if (!ZONDER_VIDEO) {
    const { maakReel } = await import('./lib/video.mjs');
    const vakR = kiesVak(nivReel, id => D.geschikteVragen(nivReel, id).length >= 12);
    const alle = D.geschikteVragen(nivReel, vakR.id);
    const tel = {}; alle.forEach(q => { const h = q.domId.replace(/\d+$/, ''); tel[h] = (tel[h] || 0) + 1; });
    const domId = Object.entries(tel).sort((a, b) => b[1] - a[1])[0][0];
    const lijst = D.schud(r, alle.filter(q => q.domId.replace(/\d+$/, '') === domId && q.vraag.length < 95 && !gesch.vragen.includes(q.id))).slice(0, 4);
    lijst.forEach(q => gesch.vragen.push(q.id));
    const hook = D.kies(r, [
      `POV: je oefent ${vakR.naam} met echte examenvragen`,
      `Vier ${vakR.naam}-vragen in vijftien seconden`,
      `Zo oefen je ${vakR.naam} voor je ${niv(nivReel).toLowerCase()}-examen`,
    ]);
    const k = F.reelKaarten(nivReel, vakR.naam, hook);
    await maakReel(browser, { niveau: nivReel, vakId: vakR.id, domId, hook, vragenLijst: lijst.map(q => q.raw),
      introSlide: k.intro, outroSlide: k.outro, out: path.join(OUT, 'zo-reel.mp4'), vragen: lijst.length });
    posts.push({ id: `${WEEK}-zo-reel`, type: 'reel', format: 'reel', publiceren: nlTijd(dag(6), '19:30'),
      bestanden: ['zo-reel.mp4'], cover: 'zo-reel-cover.jpg', niveau: nivReel, vak: vakR.naam,
      caption: C.captionReel(r, { vak: vakR.naam, niveauId: nivReel }), info: `Reel ${niv(nivReel)} ${vakR.naam}: "${hook}"` });
  }
} finally {
  await browser.close();
}

// ── Kwaliteitscontrole onderschriften ─────────────────────────────────────
const problemen = posts.flatMap(p => C.controleerCaption(p.caption).map(f => `${p.id}: ${f}`));
if (problemen.length) { console.error('Onderschrift afgekeurd:\n  ' + problemen.join('\n  ')); process.exit(1); }

// ── Plan + overzicht wegschrijven ─────────────────────────────────────────
const plan = { week: WEEK, gegenereerd: new Date().toISOString(), posts };
fs.writeFileSync(path.join(OUT, 'plan.json'), JSON.stringify(plan, null, 2) + '\n');

const DAG = { ma: 'Maandag', wo: 'Woensdag', vr: 'Vrijdag', zo: 'Zondag' };
const tijd = iso => iso.slice(11, 16);
const md = [`# Slagio content · ${WEEK}`, '',
  `Week van ${F.datumNL(dag(0))} t/m ${F.datumNL(dag(6))}. **Merge deze PR om alles in te plannen.** Wil je een post niet, verwijder hem dan uit \`plan.json\` of zet \`"overslaan": true\`. Onderschriften kun je daar ook aanpassen.`, ''];
for (const p of posts) {
  const d = DAG[p.id.split('-')[2]] || '';
  md.push(`## ${d} ${tijd(p.publiceren)} · ${p.format === 'carousel' ? 'Carrousel' : p.format === 'reel' ? 'Reel' : p.format === 'story' ? 'Story' : 'Post'}`, '', `_${p.info}_`, '');
  if (p.format === 'reel') md.push(`<img src="${p.cover}" width="220"> [▶ video bekijken](${p.bestanden[0]})`, '');
  else md.push(p.bestanden.map(f => `<img src="${f}" width="${p.format === 'story' ? 150 : 200}">`).join(' '), '');
  if (p.caption) md.push('```', p.caption, '```', '');
}
fs.writeFileSync(path.join(OUT, 'OVERZICHT.md'), md.join('\n'));

gesch.weken.push(WEEK);
gesch.vragen = gesch.vragen.slice(-600); gesch.begrippen = gesch.begrippen.slice(-300);
fs.writeFileSync(GESCH, JSON.stringify(gesch, null, 2) + '\n');

console.log(`✓ ${WEEK}: ${posts.length} posts in social/weken/${WEEK}/`);
posts.forEach(p => console.log(`  ${tijd(p.publiceren)} ${p.id.split('-').slice(2).join('-').padEnd(16)} ${p.info}`));
