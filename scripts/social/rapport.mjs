#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// rapport.mjs · bouwt Jarvis' weekbriefing als één zelfstandige HTML-pagina
//
// Vaste vorm (elke week even verzorgd), inhoud uit twee bronnen:
//   --stats   social/stats/<datum>.json   (cijfers, door stats.mjs)
//   --analyse analyse.json                (het verhaal en oordeel, door Jarvis/Claude)
//   --week    social/weken/<week>         (optioneel: content om goed te keuren)
//   --out     rapport.html
// Schema van analyse.json: zie social/JARVIS.md.
// ═══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const S = JSON.parse(fs.readFileSync(opt('--stats'), 'utf8'));
const A = JSON.parse(fs.readFileSync(opt('--analyse'), 'utf8'));
const WEEKDIR = opt('--week');
const OUT = opt('--out') || 'rapport.html';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Eenvoudige opmaak in analyse-teksten: **vet**
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
const nf = n => n == null ? '–' : Number(n).toLocaleString('nl-NL');
const DAGEN = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
const MND = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
const kort = iso => { const d = new Date(iso + 'T12:00:00Z'); return `${d.getUTCDate()} ${MND[d.getUTCMonth()]}`; };

const app = S.app || {}, deze = app.deze || {}, vorige = app.vorige || {};

// ── Kerncijfers ───────────────────────────────────────────────────────────
function delta(nu, toen, meerIsBeter = true) {
  if (nu == null || toen == null || toen === 0) return '';
  const p = Math.round((nu - toen) / toen * 100);
  if (p === 0) return `<span class="d flat">gelijk</span>`;
  const goed = (p > 0) === meerIsBeter;
  return `<span class="d ${goed ? 'up' : 'down'}">${p > 0 ? '▲' : '▼'} ${Math.abs(p)}%</span>`;
}
function spark(reeks, kleur) {
  if (!reeks?.length) return '';
  const w = 120, h = 34, max = Math.max(1, ...reeks);
  const pts = reeks.map((v, i) => [i / (reeks.length - 1) * w, h - 3 - v / max * (h - 6)]);
  const lijn = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
  const [lx, ly] = pts[pts.length - 1];
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    <path d="${lijn}L${w},${h}L0,${h}Z" fill="${kleur}" fill-opacity=".14"/><path d="${lijn}" fill="none" stroke="${kleur}" stroke-width="1.8" stroke-linejoin="round"/>
    <circle cx="${lx}" cy="${ly}" r="2.6" fill="${kleur}"/></svg>`;
}
const dag = app.dagelijks || [];
const kpis = [
  { l: 'Betrokken leerlingen', v: deze.betrokken, d: delta(deze.betrokken, vorige.betrokken), s: spark(dag.map(x => x.betrokken || 0), '#ff7a33'), u: 'deden meer dan alleen openen' },
  { l: 'Bezoekers', v: deze.actief, d: delta(deze.actief, vorige.actief), s: spark(dag.map(x => x.actief), '#8b95a8'), u: 'unieke apparaten, incl. bots' },
  { l: 'Oefensessies', v: deze.oefensessies, d: delta(deze.oefensessies, vorige.oefensessies), s: spark(dag.map(x => x.oefensessies), '#3ecf8e'), u: 'quiz, flashcards, examens' },
  { l: 'Terugkeer', v: app.terugkeerBetrokken != null ? app.terugkeerBetrokken + '%' : '–', d: '', s: '', u: 'van vorige week kwam terug' },
  { l: 'App-fouten', v: deze.fouten, d: delta(deze.fouten, vorige.fouten, false), s: '', u: 'JavaScript-fouten bij gebruikers' },
  { l: 'Instagram', v: S.instagram?.gekoppeld ? nf(S.instagram.followers_count) : '–', d: '', s: '', u: S.instagram?.gekoppeld ? 'volgers' : 'nog niet gekoppeld' },
];

// ── Grafiek: 28 dagen, bezoekers (grijs) vs betrokken (oranje) ─────────────
function grafiek() {
  if (!dag.length) return '';
  const W = 960, H = 220, L = 34, B = 26, T = 12, R = 8;
  const max = Math.max(4, ...dag.map(d => d.actief));
  const stap = Math.pow(10, Math.floor(Math.log10(max))) * (max / Math.pow(10, Math.floor(Math.log10(max))) > 5 ? 2 : 1);
  const top = Math.ceil(max / stap) * stap;
  const bw = (W - L - R) / dag.length;
  const y = v => T + (H - T - B) * (1 - v / top);
  let g = '';
  for (let v = 0; v <= top; v += stap) g += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${L - 8}" y="${y(v) + 4}" class="ax" text-anchor="end">${v}</text>`;
  dag.forEach((d, i) => {
    const x = L + i * bw + bw * 0.14, w = bw * 0.72;
    g += `<rect x="${x}" y="${y(d.actief)}" width="${w}" height="${Math.max(0, H - B - y(d.actief))}" rx="2.5" class="b1"><title>${kort(d.datum)}: ${d.actief} bezoekers, ${d.betrokken} betrokken</title></rect>`;
    g += `<rect x="${x}" y="${y(d.betrokken || 0)}" width="${w}" height="${Math.max(0, H - B - y(d.betrokken || 0))}" rx="2.5" class="b2"/>`;
    const dt = new Date(d.datum + 'T12:00:00Z');
    if (dt.getUTCDay() === 1 || i === dag.length - 1) g += `<text x="${x + w / 2}" y="${H - 8}" class="ax" text-anchor="middle">${DAGEN[dt.getUTCDay()]} ${kort(d.datum)}</text>`;
  });
  return `<div class="chartwrap"><svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Bezoekers en betrokken leerlingen per dag, afgelopen 28 dagen">${g}</svg></div>`;
}

// ── Staafjes (functies, vakken) op schaal ─────────────────────────────────
function staven(obj, kleur) {
  const rij = Object.entries(obj || {}).slice(0, 7); if (!rij.length) return '<p class="leeg">Nog geen gebruik gemeten.</p>';
  const max = Math.max(...rij.map(r => r[1]));
  return `<div class="bars">${rij.map(([k, v]) => `<div class="bar"><span class="bl">${esc(k)}</span><span class="bt"><i style="width:${(v / max * 100).toFixed(1)}%;background:${kleur}"></i></span><span class="bv num">${v}</span></div>`).join('')}</div>`;
}
function verdeling(obj, kleuren, labels) {
  const tot = Object.values(obj || {}).reduce((a, b) => a + b, 0); if (!tot) return '';
  const delen = Object.entries(obj).sort((a, b) => b[1] - a[1]);
  return `<div class="split">${delen.map(([k, v]) => `<i style="width:${v / tot * 100}%;background:${kleuren[k] || '#566079'}" title="${esc(labels[k] || k)}: ${v}"></i>`).join('')}</div>
    <div class="legend">${delen.map(([k, v]) => `<span><b style="background:${kleuren[k] || '#566079'}"></b>${esc(labels[k] || k)} <em class="num">${Math.round(v / tot * 100)}%</em></span>`).join('')}</div>`;
}

// ── Content-thumbnails (als data-URI; externe beelden laden niet in een artifact) ──
function ffmpeg() { try { return execFileSync('python3', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())'], { encoding: 'utf8' }).trim(); } catch (e) { return 'ffmpeg'; } }
function thumb(file, w) {
  const tmp = path.join(process.env.TMPDIR || '/tmp', `jt-${Math.random().toString(36).slice(2)}.jpg`);
  execFileSync(ffmpeg(), ['-loglevel', 'error', '-y', '-i', file, '-vf', `scale=${w}:-2`, '-q:v', '5', tmp]);
  const d = 'data:image/jpeg;base64,' + fs.readFileSync(tmp).toString('base64'); fs.rmSync(tmp); return d;
}
function contentBlok() {
  if (!WEEKDIR || !fs.existsSync(path.join(WEEKDIR, 'plan.json'))) return '';
  const plan = JSON.parse(fs.readFileSync(path.join(WEEKDIR, 'plan.json'), 'utf8'));
  const review = Object.fromEntries((A.content?.review || []).map(r => [r.id, r]));
  const DAG = { ma: 'Maandag', di: 'Dinsdag', wo: 'Woensdag', do: 'Donderdag', vr: 'Vrijdag', za: 'Zaterdag', zo: 'Zondag' };
  const FORMAT = { image: 'Post', story: 'Story', carousel: 'Carrousel', reel: 'Reel' };
  const kaarten = plan.posts.map(p => {
    const r = review[p.id];
    const eerste = p.format === 'reel' ? p.cover : p.bestanden[0];
    const staand = p.format === 'reel' || p.format === 'story';
    const img = eerste && fs.existsSync(path.join(WEEKDIR, eerste)) ? `<img src="${thumb(path.join(WEEKDIR, eerste), staand ? 180 : 260)}" alt="" class="${staand ? 'tall' : ''}">` : '';
    const extra = p.format === 'carousel' ? `<span class="count">${p.bestanden.length} slides</span>` : p.format === 'reel' ? '<span class="count">▶ video</span>' : '';
    return `<article class="post">
      <div class="pimg">${img}${extra}</div>
      <div class="pmeta"><div class="pwhen">${DAG[p.id.split('-')[2]] || ''} <span class="num">${p.publiceren.slice(11, 16)}</span> · ${FORMAT[p.format] || p.format}</div>
      <div class="pinfo">${esc(p.info)}</div>
      ${r ? `<div class="verdict v-${esc(r.oordeel)}">${{ goed: 'Goedgekeurd door Jarvis', aangepast: 'Aangepast door Jarvis', vervangen: 'Vervangen door Jarvis', twijfel: 'Jarvis twijfelt' }[r.oordeel] || esc(r.oordeel)}</div>${r.notitie ? `<p class="vnote">${md(r.notitie)}</p>` : ''}` : ''}
      </div></article>`;
  }).join('');
  const knop = A.content?.pr
    ? `<a class="cta" href="${esc(A.content.pr)}" target="_blank" rel="noopener">Bekijk en keur goed <span aria-hidden="true">→</span></a>`
    : `<span class="cta off">${esc(A.content?.knoptekst || 'Wordt automatisch ingepland zodra Instagram gekoppeld is')}</span>`;
  return `<section><div class="sh"><h2>${A.content?.voorbeeld ? 'Zo ziet een week eruit' : 'Klaar om goed te keuren'}</h2><span class="tag">${esc(plan.week)}</span></div>
    ${A.content?.intro ? `<p class="lead">${md(A.content.intro)}</p>` : ''}
    <div class="posts">${kaarten}</div><div class="ctarow">${knop}</div></section>`;
}

// ── Pagina ────────────────────────────────────────────────────────────────
const LICHT = { ok: 'ok', 'let-op': 'warn', actie: 'bad', wacht: 'idle' };
const statusRij = Object.entries(A.status || {}).map(([k, [st, tekst]]) => `
  <li><span class="lamp ${LICHT[st] || 'idle'}" aria-hidden="true"></span><div><b>${esc({ app: 'App', groei: 'Groei', content: 'Content', seo: 'SEO' }[k] || k)}</b><span>${md(tekst)}</span></div></li>`).join('');
const aandacht = (A.aandacht || []).map(p => `<li class="att"><span class="chip c-${esc(p.niveau)}">${{ actie: 'Actie', 'let-op': 'Let op', goed: 'Goed nieuws' }[p.niveau] || esc(p.niveau)}</span><div><h3>${esc(p.titel)}</h3><p>${md(p.tekst)}</p></div></li>`).join('');
const fouten = (app.topFouten || []).map(f => {
  const noot = Object.entries(A.fouten_notities || {}).find(([k]) => f.bericht.includes(k))?.[1];
  return `<li><span class="num fn">${f.n}×</span><code>${esc(f.bericht)}</code>${noot ? `<span class="fix">${esc(noot)}</span>` : ''}</li>`;
}).join('');
const acties = (A.acties || []).map((a, i) => `<li><label><input type="checkbox" id="actie-${i}" data-k="${esc(a.tekst.slice(0, 40))}"><span>${md(a.tekst)}${a.link ? ` <a href="${esc(a.link)}" target="_blank" rel="noopener">${esc(a.linktekst || 'open')} →</a>` : ''}</span></label></li>`).join('');

const html = `<title>Jarvis Weekbriefing</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
<style>
:root{color-scheme:dark;--bg:#0a0c12;--p:#11151f;--p2:#161b28;--line:#222a3b;--ink:#eef1f7;--mu:#8b95a8;--mu2:#5f6a80;
  --brand:#ff7a33;--brand-d:#e85c0d;--up:#3ecf8e;--down:#ff6b6b;--warn:#f5b83d;--idle:#5f6a80;
  --fh:'Bricolage Grotesque','Inter',system-ui,sans-serif;--fb:'Inter',system-ui,-apple-system,sans-serif;--fm:'IBM Plex Mono',ui-monospace,monospace}
*{box-sizing:border-box}
html,body{background:var(--bg)}
body{margin:0;color:var(--ink);font-family:var(--fb);font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased}
.wrap{max-width:1080px;margin:0 auto;padding-inline:20px;padding-block:22px 64px}
.num{font-variant-numeric:tabular-nums}
a{color:var(--brand)}
:focus-visible{outline:2px solid var(--brand);outline-offset:2px;border-radius:4px}
.mono{font-family:var(--fm);font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mu)}

/* Kop */
.topbar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-bottom:18px;border-bottom:1px solid var(--line)}
.mark{display:flex;align-items:center;gap:10px;font-family:var(--fh);font-weight:800;font-size:19px;letter-spacing:-.01em}
.mark i{width:28px;height:28px;border-radius:8px;background:var(--brand-d);display:grid;place-items:center;font-style:normal;color:#fff;font-size:15px}
.mark span{color:var(--mu);font-weight:600}
.topbar .when{margin-left:auto;text-align:right}
.live{display:inline-flex;align-items:center;gap:8px}
.live::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--up);box-shadow:0 0 0 4px rgba(62,207,142,.15)}

/* Briefing */
.hero{display:grid;grid-template-columns:1.55fr 1fr;gap:28px;padding-block:34px 30px;align-items:start}
.hero h1{font-family:var(--fh);font-weight:800;font-size:clamp(30px,4.6vw,46px);line-height:1.04;letter-spacing:-.02em;margin:10px 0 18px;text-wrap:balance}
.hero h1 em{font-style:normal;color:var(--brand)}
.brief p{font-size:16.5px;line-height:1.65;color:#d6dbe6;margin:0 0 12px;max-width:62ch}
.brief p b{color:var(--ink)}
.status{background:var(--p);border:1px solid var(--line);border-radius:16px;padding:18px 18px 8px}
.status ul{list-style:none;margin:12px 0 0;padding:0}
.status li{display:flex;gap:12px;padding:10px 0;border-top:1px solid var(--line)}
.status li:first-child{border-top:none}
.status li b{display:block;font-weight:600;font-size:14px}
.status li span{display:block;font-size:13.5px;color:var(--mu);line-height:1.45}
.lamp{flex:0 0 10px;height:10px;border-radius:50%;margin-top:5px}
.lamp.ok{background:var(--up);box-shadow:0 0 10px rgba(62,207,142,.45)}
.lamp.warn{background:var(--warn);box-shadow:0 0 10px rgba(245,184,61,.45)}
.lamp.bad{background:var(--down);box-shadow:0 0 10px rgba(255,107,107,.45)}
.lamp.idle{background:var(--idle)}

/* Kerncijfers */
.kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.kpi{background:var(--p);padding:16px 18px 14px;display:grid;grid-template-columns:1fr auto;grid-template-rows:auto auto auto;column-gap:10px}
.kpi .kl{grid-column:1/-1;font-size:13px;color:var(--mu);font-weight:500}
.kpi .kv{font-family:var(--fh);font-weight:800;font-size:34px;letter-spacing:-.02em;line-height:1.1;margin-top:4px}
.kpi .spark{width:120px;height:34px;align-self:end}
.kpi .ku{grid-column:1/-1;display:flex;gap:10px;align-items:center;font-size:12.5px;color:var(--mu2);margin-top:6px}
.d{font-weight:600;font-size:12.5px}
.d.up{color:var(--up)}.d.down{color:var(--down)}.d.flat{color:var(--mu)}

section{margin-top:44px}
.sh{display:flex;align-items:baseline;gap:12px;margin-bottom:14px}
h2{font-family:var(--fh);font-weight:700;font-size:22px;letter-spacing:-.01em;margin:0}
.tag{font-family:var(--fm);font-size:11.5px;color:var(--mu);border:1px solid var(--line);border-radius:6px;padding:2px 7px}
.lead{color:var(--mu);margin:-4px 0 18px;max-width:70ch}
.panel{background:var(--p);border:1px solid var(--line);border-radius:16px;padding:18px 20px}

/* Grafiek */
.chartwrap{overflow-x:auto}
.chart{width:100%;min-width:600px;height:auto;display:block}
.chart .grid{stroke:var(--line);stroke-width:1}
.chart .ax{fill:var(--mu2);font:500 11px var(--fb)}
.chart .b1{fill:#2a3246}.chart .b2{fill:var(--brand)}
.keys{display:flex;gap:18px;font-size:13px;color:var(--mu);margin-top:10px}
.keys b{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:7px;vertical-align:-1px}

/* Aandacht */
.atts{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.att{display:flex;gap:14px;background:var(--p);border:1px solid var(--line);border-radius:14px;padding:15px 18px}
.att h3{margin:0 0 4px;font-size:15.5px;font-weight:600}
.att p{margin:0;color:var(--mu);font-size:14.5px;max-width:78ch}
.att p b{color:var(--ink);font-weight:600}
.chip{flex:0 0 auto;align-self:flex-start;font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:99px;margin-top:1px;white-space:nowrap}
.c-actie{background:rgba(255,107,107,.14);color:var(--down)}
.c-let-op{background:rgba(245,184,61,.14);color:var(--warn)}
.c-goed{background:rgba(62,207,142,.14);color:var(--up)}

/* Content */
.posts{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px}
.post{background:var(--p);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.pimg{position:relative;background:#07080d;display:grid;place-items:center;aspect-ratio:4/5}
.pimg img{width:100%;height:100%;object-fit:cover;display:block}
.pimg img.tall{object-fit:contain}
.count{position:absolute;right:8px;top:8px;font-size:11px;font-weight:600;background:rgba(10,12,18,.82);border:1px solid var(--line);padding:2px 8px;border-radius:99px}
.pmeta{padding:11px 13px 13px}
.pwhen{font-size:12.5px;color:var(--mu);font-weight:600}
.pinfo{font-size:13.5px;margin-top:3px;line-height:1.4}
.verdict{display:inline-block;margin-top:9px;font-size:11.5px;font-weight:700;padding:2px 8px;border-radius:6px}
.v-goed{background:rgba(62,207,142,.14);color:var(--up)}.v-aangepast,.v-vervangen{background:rgba(255,122,51,.14);color:var(--brand)}.v-twijfel{background:rgba(245,184,61,.14);color:var(--warn)}
.vnote{margin:6px 0 0;font-size:12.5px;color:var(--mu);line-height:1.45}
.ctarow{margin-top:16px}
.cta{display:inline-flex;align-items:center;gap:10px;background:var(--brand-d);color:#fff;text-decoration:none;font-weight:700;font-family:var(--fh);font-size:16px;padding:12px 20px;border-radius:12px}
.cta.off{background:var(--p2);color:var(--mu);font-family:var(--fb);font-weight:500;font-size:14px}

/* Gebruik */
.duo{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.bars{display:grid;gap:9px}
.bar{display:grid;grid-template-columns:150px 1fr 34px;gap:10px;align-items:center;font-size:13.5px}
.bl{color:#cfd5e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bt{height:8px;background:var(--p2);border-radius:5px;overflow:hidden}
.bt i{display:block;height:100%;border-radius:5px}
.bv{text-align:right;color:var(--mu)}
.split{display:flex;height:10px;border-radius:6px;overflow:hidden;gap:2px;margin:6px 0 10px}
.split i{display:block;height:100%}
.legend{display:flex;flex-wrap:wrap;gap:14px;font-size:13px;color:#cfd5e1}
.legend b{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:6px}
.legend em{font-style:normal;color:var(--mu)}
.sub{font-size:13px;color:var(--mu);margin:18px 0 6px;font-weight:600}
.leeg{color:var(--mu);font-size:14px;margin:0}

/* Gezondheid */
.errs{list-style:none;margin:0;padding:0}
.errs li{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap;padding:9px 0;border-top:1px solid var(--line);font-size:13.5px}
.errs li:first-child{border-top:none}
.fn{color:var(--warn);font-weight:600;min-width:34px}
.errs code{font-family:var(--fm);font-size:12.5px;color:#cfd5e1;flex:1;min-width:220px;word-break:break-word}
.fix{font-size:12px;font-weight:600;color:var(--up);background:rgba(62,207,142,.12);padding:2px 8px;border-radius:6px}

/* Acties */
.todo{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.todo label{display:flex;gap:12px;align-items:flex-start;background:var(--p);border:1px solid var(--line);border-radius:12px;padding:13px 15px;cursor:pointer}
.todo input{width:18px;height:18px;margin:2px 0 0;accent-color:var(--brand-d);flex:0 0 auto}
.todo input:checked+span{color:var(--mu2);text-decoration:line-through}
.todo a{white-space:nowrap}
footer{margin-top:52px;padding-top:18px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}

@media(max-width:820px){.hero{grid-template-columns:1fr}.kpis{grid-template-columns:repeat(2,1fr)}.duo{grid-template-columns:1fr}}
@media(max-width:460px){.kpis{grid-template-columns:1fr}.bar{grid-template-columns:110px 1fr 30px}.topbar .when{margin-left:0;text-align:left}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>

<div class="wrap">
  <header class="topbar">
    <div class="mark"><i>S</i>Slagio <span>· Jarvis</span></div>
    <span class="mono live">Systemen draaien</span>
    <div class="when"><div class="mono">Weekbriefing · ${esc(kort(S.periode.van))} – ${esc(kort(S.periode.tot))}</div>
      <div class="mono" style="color:var(--mu2)">Volgende: ${esc(A.volgende || '')}</div></div>
  </header>

  <div class="hero">
    <div class="brief">
      <div class="mono">${esc(A.groet || 'Goedemorgen.')}</div>
      <h1>${md(A.kop || '').replace(/\*(.+?)\*/g, '<em>$1</em>')}</h1>
      ${(A.briefing || []).map(p => `<p>${md(p)}</p>`).join('')}
    </div>
    <aside class="status" aria-label="Status"><div class="mono">Status</div><ul>${statusRij}</ul></aside>
  </div>

  <div class="kpis">${kpis.map(k => `<div class="kpi"><div class="kl">${esc(k.l)}</div><div class="kv num">${typeof k.v === 'number' ? nf(k.v) : esc(k.v ?? '–')}</div>${k.s}<div class="ku">${k.d}<span>${esc(k.u)}</span></div></div>`).join('')}</div>

  <section><div class="sh"><h2>Afgelopen 4 weken</h2><span class="tag">per dag</span></div>
    <div class="panel">${grafiek()}<div class="keys"><span><b style="background:#2a3246"></b>Bezoekers</span><span><b style="background:var(--brand)"></b>Betrokken leerlingen</span></div></div>
  </section>

  ${aandacht ? `<section><div class="sh"><h2>Vraagt je aandacht</h2></div><ul class="atts">${aandacht}</ul></section>` : ''}

  ${contentBlok()}

  <section><div class="sh"><h2>Waar leerlingen mee bezig zijn</h2><span class="tag">deze week</span></div>
    <div class="duo">
      <div class="panel"><div class="sub" style="margin-top:0">Functies</div>${staven(deze.functies, 'var(--brand)')}</div>
      <div class="panel"><div class="sub" style="margin-top:0">Niveau</div>${verdeling(deze.niveaus, { havo: '#3b6cf6', vwo: '#8b5cf6', vmbo: '#14b8a6' }, { havo: 'HAVO', vwo: 'VWO', vmbo: 'VMBO' })}
        <div class="sub">Apparaat</div>${verdeling(deze.apparaten, { desktop: '#8b95a8', mobile: '#ff7a33', 'mobile-pwa': '#3ecf8e' }, { desktop: 'Laptop/desktop', mobile: 'Telefoon (browser)', 'mobile-pwa': 'Telefoon (app)' })}
        <div class="sub">Gemiddelde quizscore</div><p class="leeg">${deze.gemScore != null ? `<b style="color:var(--ink)" class="num">${deze.gemScore}%</b> over ${deze.quizzen} afgeronde quizzen` : 'Nog geen afgeronde quizzen deze week.'}</p></div>
    </div>
  </section>

  <section><div class="sh"><h2>App-gezondheid</h2><span class="tag">${nf(deze.fouten)} fouten deze week</span></div>
    <div class="panel">${fouten ? `<ul class="errs">${fouten}</ul>` : '<p class="leeg">Geen fouten gemeten. Mooi.</p>'}</div>
  </section>

  <section><div class="sh"><h2>Vindbaarheid</h2></div>
    <div class="panel"><ul class="errs">
      <li><span class="num fn" style="color:var(--up)">${nf(S.seo?.paginas)}</span><code style="font-family:var(--fb)">pagina's in de sitemap, automatisch bijgehouden bij elke deploy</code></li>
      <li><span class="num fn" style="color:${S.seo?.indexnow ? 'var(--up)' : 'var(--warn)'}">${S.seo?.indexnow ? 'aan' : 'uit'}</span><code style="font-family:var(--fb)">IndexNow: nieuwe pagina's gaan direct naar Bing en ChatGPT-search</code></li>
    </ul></div>
  </section>

  ${acties ? `<section><div class="sh"><h2>Jouw acties deze week</h2></div><ul class="todo">${acties}</ul></section>` : ''}

  <footer><span class="mono">Jarvis · automatisch opgesteld uit Supabase, de content-plannen en de sitemap</span><span class="mono">Gemeten ${esc(new Date(S.gemeten).toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam', dateStyle: 'medium', timeStyle: 'short' }))}</span></footer>
</div>
<script>
// Afvinken onthouden (alleen in jouw browser).
document.querySelectorAll('.todo input').forEach(function(cb){
  var k='jarvis:'+${JSON.stringify(S.periode.tot)}+':'+cb.dataset.k;
  try{cb.checked=localStorage.getItem(k)==='1';}catch(e){}
  cb.addEventListener('change',function(){try{localStorage.setItem(k,cb.checked?'1':'0');}catch(e){}});
});
</script>
`;
fs.writeFileSync(OUT, html);
console.log(`✓ ${OUT} (${Math.round(html.length / 1024)} KB)`);
