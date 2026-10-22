#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// schermen.mjs · Jarvis' wekelijkse schermcontrole
//
// Draait de app lokaal (deze repo), opent de belangrijkste schermen op telefoon
// (licht en donker) en desktop, en speelt één quiz helemaal af. Per scherm:
// JS-fouten, horizontaal scrollen, kapotte plaatjes, "undefined/NaN" in beeld
// en te kleine tikvlakken. Schrijft een screenshot per scherm en rapport.json.
// De screenshots beoordeelt Jarvis zelf tegen docs/ONTWERP.md.
//
//   node scripts/social/schermen.mjs [--uit /tmp/jarvis-schermen] [--alleen home,vak]
// ═══════════════════════════════════════════════════════════════════════════
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/data.mjs';

let chromium;
try { ({ chromium } = await import('playwright')); } catch (e) { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')); }

const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d; };
const UIT = arg('uit', '/tmp/jarvis-schermen'), ALLEEN = arg('alleen', '') ? arg('alleen').split(',') : null;
fs.mkdirSync(UIT, { recursive: true });

// Kleine statische server; /havo, /vwo, /vmbo en onbekende paden → index.html (zoals GitHub Pages + SW).
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.jpg': 'image/jpeg', '.glb': 'model/gltf-binary' };
const srv = http.createServer((q, s) => {
  let p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname));
  if (p.endsWith('/')) p += 'index.html';
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(ROOT, 'index.html');
  s.writeHead(200, { 'content-type': TYPE[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(s);
}).listen(0);
const BASE = `http://127.0.0.1:${srv.address().port}`;

const SCHERMEN = [
  ['home', () => show('sc-home')],
  ['vak', () => openVak('bi')],
  ['domein', () => { openVak('bi'); setTimeout(() => openDomein(ST.vak.domeinen[1].id), 900); }],
  ['oefenmodus', () => { openVak('bi'); setTimeout(() => openQmode(ST.vak.domeinen[1].id), 900); }],
  ['studieplan', () => { show('sc-studieplan'); if (typeof renderStudieplan === 'function') renderStudieplan(); }],
  ['rooster', () => { show('sc-schedule'); renderSchedule(); }],
  ['cijfers', () => show('sc-calc')],
  ['foutenboek', () => openFoutenboek()],
  ['herhalen', () => openHerhalen()],
  ['examens', () => openExamenBieb()],
  ['zoeken', () => openZoek()],
  ['mijnstof', () => openMijnStof('stof')],
  ['divisie', () => openLeague()],
  ['spelen', () => show('sc-sociaal')],
  ['winkel', () => openShop()],
];
const ZET = (niv, donker) => ({ slagio_onboard_v3: '1', slagio_seen_intro_v2: '1', slagio_vonk_intro_done: '1', examenapp_level: niv, slagio_pwa_dismissed: '1', slagio_vonk_welkom: '1', slagio_maatje_kiezen: '0', slagio_reg_gift_seen: '1', theme: donker ? 'dark' : 'light' });

async function meet(p) {
  return p.evaluate(() => {
    const W = innerWidth, ov = [], kapot = [];
    let klein = 0;
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect(); if (!r.width || !el.offsetParent) continue;
      if (r.right > W + 2 && r.left < W) { const cs = getComputedStyle(el.parentElement || el); if (!/auto|scroll|hidden/.test(cs.overflowX)) ov.push(String(el.id || el.className || el.tagName).slice(0, 40)); }
      if (el.matches('button,a,[onclick]') && (r.width < 30 || r.height < 30)) klein++;
      if (el.tagName === 'IMG' && el.complete && !el.naturalWidth && el.src) kapot.push(el.src.replace(location.origin, ''));
    }
    const sc = document.querySelector('.sc.on'), tekst = sc ? sc.innerText : '';
    return { scherm: sc && sc.id, horizontaalScrollen: document.documentElement.scrollWidth > W + 2, uitsteken: [...new Set(ov)].slice(0, 5), kapottePlaatjes: kapot.slice(0, 5), kleineTikvlakken: klein, raar: tekst.match(/\bundefined\b|\bNaN\b|\[object|Infinity/g) || [] };
  });
}

const rapport = { gemaakt: new Date().toISOString(), schermen: [], quiz: null };
const b = await chromium.launch();
for (const [vp, label, donker, niv] of [[{ width: 390, height: 844 }, 'telefoon', false, 'havo'], [{ width: 390, height: 844 }, 'telefoon-donker', true, 'havo'], [{ width: 1440, height: 900 }, 'desktop', false, 'havo'], [{ width: 390, height: 844 }, 'vmbo', false, 'vmbo']]) {
  const c = await b.newContext({ viewport: vp, isMobile: vp.width < 600, hasTouch: vp.width < 600, colorScheme: donker ? 'dark' : 'light' });
  const p = await c.newPage(); let fouten = [];
  p.on('pageerror', e => fouten.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_|supabase/i.test(m.text())) fouten.push('console: ' + m.text().slice(0, 160)); });
  await p.route(/supabase|googletagmanager|plausible|jsdelivr.net\/npm\/@supabase/, r => r.abort());
  await p.addInitScript(z => { for (const [k, v] of Object.entries(z)) localStorage.setItem(k, v); }, ZET(niv, donker));
  const lijst = label === 'vmbo' ? SCHERMEN.slice(0, 4) : label === 'desktop' ? SCHERMEN.filter(s => ['home', 'vak', 'domein', 'examens', 'zoeken', 'studieplan'].includes(s[0])) : SCHERMEN;
  for (const [naam, fn] of lijst) {
    if (ALLEEN && !ALLEEN.includes(naam)) continue;
    fouten = [];
    await p.goto(`${BASE}/${niv}`); await p.waitForTimeout(2200);
    try { await p.evaluate(fn); } catch (e) { fouten.push('openen: ' + e.message); }
    await p.waitForTimeout(1600);
    await p.evaluate(() => { document.querySelectorAll('.chest-overlay,#levelup-overlay').forEach(e => e.remove()); scrollTo(0, 0); });
    const bestand = `${label}-${naam}.png`;
    await p.screenshot({ path: path.join(UIT, bestand) });
    rapport.schermen.push({ weergave: label, naam, bestand, fouten: [...new Set(fouten)], ...(await meet(p)) });
  }
  // Eén quiz helemaal afspelen (alleen op de gewone telefoonweergave).
  if (label === 'telefoon' && (!ALLEEN || ALLEEN.includes('quiz'))) {
    fouten = [];
    await p.goto(`${BASE}/${niv}`); await p.waitForTimeout(2200);
    await p.evaluate(() => { openVak('bi'); }); await p.waitForTimeout(1200);
    await p.evaluate(() => { ST.domein = ST.vak.domeinen[1]; startQ('snel'); }); await p.waitForTimeout(1500);
    let beantwoord = 0;
    for (let i = 0; i < 14; i++) {
      const ok = await p.evaluate(() => { const sc = document.getElementById('sc-quiz'); const bs = [...document.querySelectorAll('#snel-area button')]; if (!sc || !sc.classList.contains('on') || !bs.length || bs.every(x => x.disabled)) return false; bs[0].click(); return true; });
      if (!ok) break; beantwoord++; await p.waitForTimeout(700);
      if (i === 0) await p.screenshot({ path: path.join(UIT, 'telefoon-quiz-feedback.png') });
      await p.evaluate(() => { const n = document.getElementById('qnxt'); if (n && n.style.display !== 'none') n.click(); }); await p.waitForTimeout(500);
    }
    await p.waitForTimeout(2500);
    await p.screenshot({ path: path.join(UIT, 'telefoon-quiz-uitslag.png') });
    const eind = await p.evaluate(() => document.querySelector('.sc.on')?.id);
    rapport.quiz = { beantwoord, eindscherm: eind, gelukt: eind === 'sc-res', fouten: [...new Set(fouten)] };
  }
  await c.close();
}
await b.close(); srv.close();
const prob = rapport.schermen.filter(s => s.fouten.length || s.horizontaalScrollen || s.uitsteken.length || s.kapottePlaatjes.length || s.raar.length);
rapport.samenvatting = { schermen: rapport.schermen.length, metProbleem: prob.length, quizGelukt: rapport.quiz?.gelukt ?? null };
fs.writeFileSync(path.join(UIT, 'rapport.json'), JSON.stringify(rapport, null, 2));
console.log(`✓ ${rapport.schermen.length} schermen in ${UIT} · ${prob.length} met een probleem · quiz ${rapport.quiz ? (rapport.quiz.gelukt ? 'ok' : 'MISLUKT') : 'overgeslagen'}`);
prob.forEach(s => console.log(`  ✗ ${s.weergave}/${s.naam}: ${[...s.fouten, s.horizontaalScrollen ? 'scrollt horizontaal' : '', ...s.uitsteken.map(x => 'steekt uit: ' + x), ...s.kapottePlaatjes.map(x => 'plaatje kapot: ' + x), ...s.raar].filter(Boolean).join(' · ')}`));
