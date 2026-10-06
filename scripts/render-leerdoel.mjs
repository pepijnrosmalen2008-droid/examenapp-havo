#!/usr/bin/env node
/**
 * render-leerdoel.mjs - rendert de samenvatting van één leerdoel zoals een leerling
 * hem op de telefoon ziet, en keurt de beelden.
 *
 *   node scripts/render-leerdoel.mjs <niveau> <vak> <leerdoelId> [--uit <map>]
 *   node scripts/render-leerdoel.mjs --html <bestand.html> [--uit <map>]   (concept vóór integratie)
 *
 * Schrijft (standaard naar /tmp/render-<sleutel>/):
 *   pagina-licht.png, pagina-donker.png   hele samenvatting op 390 px breed
 *   fig-<n>.png                           elke figuur/clip apart, 2x scherp
 *   clip-<n>-<stap>.png                   elke clip op 3 momenten (begin, midden, eind)
 * BEKIJK DEZE BEELDEN (met de Read-tool) voordat je iets integreert.
 *
 * Harde fouten (exit 1):
 *   - figuur/clip zonder <svg role="img" aria-label="..."> (min. 30 tekens)
 *   - .sam-figure zonder .sam-figcap (min. 40 tekens)
 *   - labels in een svg die elkaar overlappen (>25% van het kleinste label)
 *   - tekst die buiten de figuur valt (afgesneden)
 *   - tekst die op de telefoon kleiner is dan 7 px
 *   - clip-<naam> zonder bestaande choreografie, of #stappen ≠ #bolletjes ≠ #bijschriften
 * Waarschuwingen: label dat half over een gevulde vorm valt, tekst < 8,5 px.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const uitIdx = args.indexOf('--uit');
let uit = uitIdx >= 0 ? args[uitIdx + 1] : null;
let html, sleutel;
if (args[0] === '--html') {
  html = fs.readFileSync(args[1], 'utf8');
  sleutel = path.basename(args[1]).replace(/\.\w+$/, '');
} else {
  const [niveau, vak, ld] = args;
  if (!niveau || !vak || !ld) { console.error('gebruik: node scripts/render-leerdoel.mjs <niveau> <vak> <leerdoelId> | --html <bestand>'); process.exit(2); }
  sleutel = `${niveau}_${vak}_${ld}`;
  const ctx = { SAM_RICH: {}, window: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, `sam-${niveau}.js`), 'utf8'), ctx);
  html = ctx.SAM_RICH[sleutel];
  if (!html) { console.error(`geen samenvatting gevonden onder SAM_RICH['${sleutel}']`); process.exit(1); }
}
uit = uit || `/tmp/render-${sleutel}`;
fs.mkdirSync(uit, { recursive: true });

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')); }

const pagina = (donker) => `<!doctype html><html class="level-havo${donker ? ' dark' : ''}"><head><meta charset="utf-8">
<meta name="viewport" content="width=390,initial-scale=1"><link rel="stylesheet" href="file://${ROOT}/styles.css">
<style>body{margin:0;padding:12px 14px;background:var(--bg,#fff)}</style></head>
<body><div class="sam">${html}</div><script src="file://${ROOT}/sam-clip.js"></script></body></html>`;

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const hard = [], warn = [];
for (const donker of [false, true]) {
  const f = path.join(uit, donker ? '_donker.html' : '_licht.html');
  fs.writeFileSync(f, pagina(donker));
  const p = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const fouten = []; p.on('pageerror', e => fouten.push(e.message));
  await p.goto('file://' + f); await p.waitForTimeout(600);
  await p.screenshot({ path: path.join(uit, donker ? 'pagina-donker.png' : 'pagina-licht.png'), fullPage: true });
  fouten.forEach(m => hard.push(`JS-fout bij renderen (${donker ? 'donker' : 'licht'}): ${m}`));
  if (donker) { await p.close(); continue; }

  // ── keuring ──
  const r = await p.evaluate(() => {
    const out = { hard: [], warn: [], figs: 0, clips: [] };
    const area = (a) => Math.max(0, a.width) * Math.max(0, a.height);
    const inter = (a, b) => { const w = Math.min(a.right, b.right) - Math.max(a.left, b.left), h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); return w > 0 && h > 0 ? w * h : 0; };
    const blokken = [...document.querySelectorAll('.sam-figure, .sam-clip')];
    blokken.forEach((b, i) => {
      const n = i + 1, isClip = b.classList.contains('sam-clip');
      const naam = isClip ? `clip ${n}` : `figuur ${n}`;
      const svg = b.querySelector('svg');
      if (!svg) { out.hard.push(`${naam}: geen <svg>`); return; }
      const lbl = svg.getAttribute('aria-label') || '';
      if (svg.getAttribute('role') !== 'img' || lbl.trim().length < 30) out.hard.push(`${naam}: svg mist role="img" of een beschrijvende aria-label (≥30 tekens)`);
      if (!isClip) { const cap = b.querySelector('.sam-figcap'); if (!cap || cap.textContent.trim().length < 40) out.hard.push(`${naam}: bijschrift (.sam-figcap) ontbreekt of is te kort (≥40 tekens: zeg wat je moet zien)`); }
      if (isClip) {
        const m = [...b.classList].find(c => c.startsWith('clip-')); const cn = m ? m.slice(5) : '';
        const info = window.__samClipInfo ? window.__samClipInfo(cn) : null;
        const caps = b.querySelectorAll('.sam-clip-caps p').length, dots = b.querySelectorAll('.sam-clip-dots i').length;
        if (!info) out.hard.push(`${naam}: clip-${cn} heeft geen choreografie in sam-clip.js`);
        else if (!(info.cues === caps && caps === dots)) out.hard.push(`${naam}: clip-${cn} heeft ${info.cues} stappen, ${dots} bolletjes en ${caps} bijschriften (moeten gelijk zijn)`);
        out.clips.push({ i, cn, dur: info ? info.duration : 0 });
      }
      out.figs++;
      if (isClip) return; // clip-labels bewegen; die keur je op de frames
      const sr = svg.getBoundingClientRect();
      const texts = [...svg.querySelectorAll('text')].filter(t => t.textContent.trim() && getComputedStyle(t).opacity !== '0');
      const boxes = texts.map(t => ({ t: t.textContent.trim().slice(0, 30), r: t.getBoundingClientRect() }));
      boxes.forEach(({ t, r }) => {
        if (r.left < sr.left - 2 || r.right > sr.right + 2 || r.top < sr.top - 2 || r.bottom > sr.bottom + 2) out.hard.push(`${naam}: label "${t}" valt (deels) buiten de figuur`);
        const fs = r.height / 1.2;
        if (fs < 7) out.hard.push(`${naam}: label "${t}" is op de telefoon ${fs.toFixed(1)} px (min. 7)`);
        else if (fs < 8.5) out.warn.push(`${naam}: label "${t}" is klein (${fs.toFixed(1)} px)`);
      });
      for (let a = 0; a < boxes.length; a++) for (let c = a + 1; c < boxes.length; c++) {
        const I = inter(boxes[a].r, boxes[c].r), m = Math.min(area(boxes[a].r), area(boxes[c].r));
        if (m > 0 && I / m > 0.25) out.hard.push(`${naam}: labels "${boxes[a].t}" en "${boxes[c].t}" overlappen`);
      }
      const vormen = [...svg.querySelectorAll('rect,circle,ellipse,path,polygon')].filter(e => {
        const cs = getComputedStyle(e); const fill = cs.fill;
        return fill && fill !== 'none' && !/rgba\(0, 0, 0, 0\)/.test(fill) && parseFloat(cs.fillOpacity || '1') * parseFloat(cs.opacity || '1') > 0.35;
      }).map(e => e.getBoundingClientRect()).filter(r => area(r) > 60 && area(r) < area(sr) * 0.6);
      boxes.forEach(({ t, r }) => {
        for (const v of vormen) { const I = inter(r, v); if (I > 0 && I / area(r) > 0.15 && I / area(r) < 0.85) { out.warn.push(`${naam}: label "${t}" valt half over een vorm - controleer op het beeld`); break; } }
      });
    });
    return out;
  });
  hard.push(...r.hard); warn.push(...r.warn);
  if (!r.figs) hard.push('geen enkele figuur of clip in de samenvatting');

  // losse figuren scherp
  const blokken = await p.$$('.sam-figure, .sam-clip');
  for (let i = 0; i < blokken.length; i++) { await blokken[i].scrollIntoViewIfNeeded(); await blokken[i].screenshot({ path: path.join(uit, `fig-${i + 1}.png`) }); }
  // clips op drie momenten
  for (const c of r.clips) {
    const el = blokken[c.i]; if (!el || !c.dur) continue;
    await el.scrollIntoViewIfNeeded();
    for (const [k, frac] of [['begin', 0.12], ['midden', 0.5], ['eind', 0.98]]) {
      await p.waitForTimeout(k === 'begin' ? c.dur * 1000 * frac : c.dur * 1000 * (frac - (k === 'midden' ? 0.12 : 0.5)));
      await el.screenshot({ path: path.join(uit, `clip-${c.i + 1}-${k}.png`) });
    }
  }
  await p.close();
}
await browser.close();

console.log(`\n=== render ${sleutel} → ${uit}`);
console.log(fs.readdirSync(uit).filter(f => f.endsWith('.png')).map(f => '  ' + path.join(uit, f)).join('\n'));
warn.forEach(m => console.log('  ! ' + m));
if (hard.length) { hard.forEach(m => console.log('  ✗ ' + m)); console.log(`\n  ${hard.length} harde fout(en) in de beelden.`); process.exit(1); }
console.log('  ✓ beelden technisch in orde. Bekijk nu zelf de png\'s: klopt elke figuur inhoudelijk en is hij leesbaar?');
