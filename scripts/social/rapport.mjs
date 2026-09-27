#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// rapport.mjs · stelt Jarvis samen als één zelfstandige pagina
//
//   --stats    stats.json (stats.mjs)       --analyse  analyse.json (Jarvis/Claude)
//   --geheugen jarvis-geheugen.json (opt.)  --week     social/weken/<week> (opt.)
//   --out      jarvis.html
// Ontwerp en gedrag: scripts/social/jarvis/jarvis.css + jarvis.js. Publiceer met
// capabilities {sample:{}} zodat 'Vraag Jarvis' werkt (zie social/JARVIS.md).
// ═══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { bouwKennis } from './lib/kennis.mjs';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const lees = f => (f && fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
const stats = lees(opt('--stats')), analyse = lees(opt('--analyse')) || {}, geheugen = lees(opt('--geheugen')) || { voorspellingen: [], experimenten: [] };
if (!stats) { console.error('--stats ontbreekt'); process.exit(1); }
const WEEK = opt('--week'), OUT = opt('--out') || 'jarvis.html';

function ffmpeg() { try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); return 'ffmpeg'; } catch (e) {}
  return execFileSync('python3', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())'], { encoding: 'utf8' }).trim(); }
function thumb(file, w) {
  const tmp = path.join(process.env.TMPDIR || '/tmp', `jt-${process.pid}-${Math.random().toString(36).slice(2)}.jpg`);
  execFileSync(ffmpeg(), ['-loglevel', 'error', '-y', '-i', file, '-vf', `scale=${w}:-2`, '-q:v', '5', tmp]);
  const d = 'data:image/jpeg;base64,' + fs.readFileSync(tmp).toString('base64'); fs.rmSync(tmp); return d;
}
let content = null;
if (WEEK && fs.existsSync(path.join(WEEK, 'plan.json'))) {
  const plan = JSON.parse(fs.readFileSync(path.join(WEEK, 'plan.json'), 'utf8'));
  content = { week: plan.week, posts: plan.posts.map(p => {
    const eerste = p.format === 'reel' ? p.cover : p.bestanden[0];
    const staand = p.format === 'reel' || p.format === 'story';
    const f = eerste && path.join(WEEK, eerste);
    return { id: p.id, format: p.format, info: p.info, dag: p.id.split('-')[2], tijd: p.publiceren.slice(11, 16), n: p.bestanden.length,
      thumb: f && fs.existsSync(f) ? thumb(f, staand ? 200 : 300) : null };
  }) };
}

const data = JSON.stringify({ stats, analyse, geheugen, content }).replace(/</g, '\\u003c');
const cfg = lees(path.join(HIER, '../../social/jarvis-config.json')) || {};
const kennis = JSON.stringify(bouwKennis({ examenDatum: cfg.examenDatum })).replace(/</g, '\\u003c');
const FONT = fs.readFileSync(path.join(HIER, 'fonts/bricolage.woff2')).toString('base64');
const CSS = fs.readFileSync(path.join(HIER, 'jarvis/jarvis.css'), 'utf8');
const JS = fs.readFileSync(path.join(HIER, 'jarvis/jarvis.js'), 'utf8');
const BREIN = fs.readFileSync(path.join(HIER, 'jarvis/brein.js'), 'utf8');
const ic = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

const html = `<title>Jarvis</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>@font-face{font-family:'Bricolage';src:url(data:font/woff2;base64,${FONT}) format('woff2');font-weight:200 800;font-display:swap}
${CSS}</style>
<div class="wrap">
  <header class="top">
    <div class="brand"><i>S</i>Slagio <span>Jarvis</span></div>
    <span class="pulse" style="font-size:13px;color:var(--label2)">Actief</span>
    <div class="meta"><span id="periode"></span> · <button type="button" id="open-pal" style="border:1px solid var(--sep);background:var(--mat);border-radius:8px;padding:2px 8px;font-size:12px;cursor:pointer;color:var(--label2)">⌘K</button></div>
  </header>
  <main>
  <div class="hero" id="overzicht">
    <div>
      <div class="eyebrow" id="groet"></div>
      <h1 id="kop"></h1>
      <div class="brief" id="briefing"></div>
      <div class="statuses" id="statuses" aria-label="Status per systeem"></div>
    </div>
    <div class="core" id="core"><canvas aria-label="Neurale kern: de systemen van Slagio en hun status" role="img"></canvas>
      <div class="corelabel"><div class="health" id="health"></div><div class="hint" id="corehint">Tik op een systeem</div></div></div>
  </div>

  <div class="kpis" id="kpis"></div>

  <section id="denkwerk"><div class="sh"><h2>Denkwerk</h2><span class="sub">Wat Jarvis denkt, en wat hij automatisch detecteerde</span></div>
    <div class="grid2"><div class="card"><div class="eyebrow" style="margin-bottom:12px">Hypotheses</div><div id="denk"></div></div>
    <div><div class="signals" id="signals"></div></div></div></section>

  <section id="groei"><div class="sh"><h2>Groei</h2><span class="sub" id="seizoen"></span></div>
    <div class="card"><h3 class="chart-title">Leerlingen per dag</h3><p class="chart-sum" id="groei-sum"></p>
      <div class="chart-bar"><div class="seg" id="groei-seg" role="group" aria-label="Periode"></div><div class="keys" id="groei-keys" role="group" aria-label="Reeksen"></div></div>
      <div class="plot" id="groei-plot"></div></div>
    <div class="grid2" style="margin-top:14px">
      <div class="card"><h3 class="chart-title">Prognose</h3><p class="chart-sum" id="prog-sum"></p><div class="plot" id="prog-plot"></div></div>
      <div class="card"><h3 class="chart-title">Doelen</h3><p class="chart-sum">Wat er nodig is om je doel te halen, op basis van deze week.</p><div id="doelen"></div></div>
    </div></section>

  <section id="trechter"><div class="sh"><h2>Trechter</h2><span class="sub">Van echte bezoeker tot eerste actie</span></div>
    <div class="card"><p class="chart-sum" id="funnel-sum"></p><div class="funnel" id="funnel"></div><p class="fnote" id="funnel-note"></p></div></section>

  <section id="terugkeer"><div class="sh"><h2>Terugkeer</h2><span class="sub">Komen nieuwe leerlingen de weken erna terug?</span></div>
    <div class="card"><p class="chart-sum" id="cohort-sum"></p><div class="cohort" id="cohort"></div></div></section>

  <section id="herkomst"><div class="sh"><h2>Herkomst</h2><span class="sub">Waar bezoekers vandaan komen</span></div>
    <div class="card"><div class="chart-bar"><p class="chart-sum" id="src-sum" style="margin:0;flex:1"></p><div class="seg" id="src-seg" role="group" aria-label="Periode"></div></div><div class="src" id="src" style="margin-top:12px"></div></div></section>

  <section id="content"><div class="sh"><h2 id="content-title">Content</h2></div>
    <p class="chart-sum" id="content-sum"></p><div class="posts" id="posts"></div><div style="margin-top:16px" id="content-cta"></div></section>

  <section id="kansen"><div class="sh"><h2>Kansen</h2><span class="sub">Wat Jarvis in de site, de app en de contentfabriek vond</span></div>
    <div class="grid3" id="kansen-grid"></div></section>

  <section id="geheugen"><div class="sh"><h2>Geheugen</h2><span class="sub">Voorspellingen die Jarvis deed, en of ze uitkwamen</span></div>
    <div class="memo"><div class="card"><h3 class="chart-title">Voorspellingen</h3><p class="chart-sum" id="kalibratie"></p><div id="preds"></div></div>
      <div class="card exp" id="exp"></div></div></section>

  <section id="gezondheid"><div class="sh"><h2>Gezondheid</h2><span class="sub">App-fouten en vindbaarheid</span></div>
    <div class="grid2"><div class="card"><h3 class="chart-title">App-fouten deze week</h3><ul class="list" id="errs" style="margin-top:8px"></ul></div>
      <div class="card"><h3 class="chart-title">Vindbaarheid</h3><ul class="list" id="seo" style="margin-top:8px"></ul></div></div></section>

  <section id="acties"><div class="sh"><h2>Jouw acties</h2><span class="sub">Afvinken wordt in je browser onthouden</span></div><div class="todo" id="todo"></div></section>
  </main>
  <footer><span>Jarvis · opgesteld uit Supabase, de content-plannen en de sitemap</span><span id="gemeten"></span></footer>
</div>

<nav class="dock" aria-label="Secties">
  <div class="tabs glass">
    <a href="#overzicht" aria-current="true">${ic('<circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="8.5"/>')}<span>Overzicht</span></a>
    <a href="#groei">${ic('<path d="M4 18l5-6 4 3 7-9"/><path d="M15 6h5v5"/>')}<span>Groei</span></a>
    <a href="#trechter">${ic('<path d="M4 5h16l-6 7v6l-4 2v-8z"/>')}<span>Trechter</span></a>
    <a href="#content">${ic('<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/>')}<span>Content</span></a>
    <a href="#gezondheid">${ic('<path d="M3 12h4l2-5 4 10 2-5h6"/>')}<span>Gezondheid</span></a>
  </div>
  <button type="button" class="ask glass" id="ask" hidden aria-label="Vraag Jarvis">${ic('<path d="M12 3l1.8 4.6L18.5 9l-4.7 1.5L12 15l-1.8-4.5L5.5 9l4.7-1.4z"/><path d="M18 15l.8 2 2 .8-2 .7-.8 2-.8-2-2-.7 2-.8z"/>')}</button>
</nav>

<div class="overlay" id="palette" hidden><div class="palette glass" role="dialog" aria-label="Commandopalet">
  <input id="pal-in" type="text" placeholder="Zoek een sectie of stel Jarvis een vraag" autocomplete="off" aria-label="Zoeken of vragen">
  <ul id="pal-list" role="listbox"></ul></div></div>

<div class="sheet glass" id="sheet" hidden role="dialog" aria-label="Vraag Jarvis">
  <header><div><b>Jarvis</b><br><span>Analyse, content, social en vindbaarheid</span></div>
    <button type="button" id="open-stem" hidden aria-label="Praat met Jarvis" title="Praat met Jarvis" style="margin-left:auto">${ic('<path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/>')}</button>
    <button type="button" id="wis" aria-label="Gesprek wissen" title="Gesprek wissen">${ic('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>')}</button>
    <button type="button" id="close" aria-label="Sluiten">${ic('<path d="M6 6l12 12M18 6L6 18"/>')}</button></header>
  <div class="modebar"><div class="seg" id="modi" role="radiogroup" aria-label="Expertise"></div>
    <button type="button" id="diep" class="diep" aria-pressed="false" title="Langer nadenken met het sterkste model">Diep</button></div>
  <div class="msgs" id="msgs" aria-live="polite"></div>
  <div class="composer"><textarea id="box" rows="1" placeholder="Vraag Jarvis iets…" aria-label="Je vraag"></textarea>
    <button type="button" id="dicteer" class="mic" hidden aria-label="Dicteer">${ic('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>')}</button>
    <button type="button" id="send" aria-label="Verstuur">↑</button></div>
  <div class="note">Draait op je eigen Claude-account. Jarvis werkt met de data en kennisbank van deze briefing.</div>
</div>

<div class="stem" id="stem" hidden role="dialog" aria-label="Gesprek met Jarvis" data-fase="rust">
  <div class="stem-top"><span class="brand"><i>S</i>Jarvis</span><select id="stem-kies" aria-label="Stem" hidden></select>
    <button type="button" id="stem-sluit" aria-label="Gesprek beëindigen">${ic('<path d="M6 6l12 12M18 6L6 18"/>')}</button></div>
  <p class="stem-jij" id="stem-jij" aria-live="polite"></p>
  <button type="button" class="orb-knop" id="orb-knop" aria-label="Begin met praten"><canvas id="orb" aria-hidden="true"></canvas></button>
  <p class="stem-status" id="stem-status">Tik op de bol om te praten</p>
  <p class="stem-hij" id="stem-hij" aria-live="polite"></p>
  <form class="stem-typ" id="stem-typ" hidden><input id="stem-in" type="text" placeholder="Typ je vraag" autocomplete="off" aria-label="Je vraag"><button type="submit" aria-label="Verstuur">↑</button></form>
</div>

<script type="application/json" id="jarvis-data">${data}</script>
<script type="application/json" id="jarvis-kennis">${kennis}</script>
<script>${JS}</script>
<script>${BREIN}</script>
`;
fs.writeFileSync(OUT, html);
console.log(`✓ ${OUT} (${Math.round(html.length / 1024)} KB)`);
