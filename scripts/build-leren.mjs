#!/usr/bin/env node
/**
 * build-leren.mjs - openbare leerpagina's uit de eigen content (geen extra werk per leerdoel).
 *
 *   node scripts/build-leren.mjs           → schrijft leren/** + llms.txt
 *   node scripts/build-leren.mjs --check   → exit 1 als de pagina's verouderd zijn
 *
 * Per leerdoel-module met een rijke samenvatting (SAM_RICH['<niveau>_<vak>_<id>']):
 *   /leren/<niveau>/<vak>/<leerdoel>.html   samenvatting met figuren/clips, voorbeeldvragen met
 *                                           uitleg per antwoord, knop "Oefen alle N vragen" in de app
 * Per vak:   /leren/<niveau>/<vak>/index.html (leerdoelen per domein) en begrippen.html
 * Overzicht: /leren/index.html, en /llms.txt voor AI-zoekmachines.
 *
 * Echte, leesbare pagina's voor mens én zoekmachine (geen doorsturen naar de app).
 * Draai na elke content-wijziging (de routine doet dit in STAP 4); build-sitemap neemt ze mee.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://slagio.nl';
const CHECK = process.argv.includes('--check');
const VAR = { havo: 'VAKKEN', vwo: 'VAKKEN_VWO', vmbo: 'VAKKEN_VMBO' };
const NIV = { havo: 'HAVO', vwo: 'VWO', vmbo: 'VMBO' };
const SLUG = { nl: 'nederlands', wa: 'wiskunde-a', wb: 'wiskunde-b', bi: 'biologie', sk: 'scheikunde', na: 'natuurkunde', be: 'bedrijfseconomie', en: 'engels', ec: 'economie', gs: 'geschiedenis', ak: 'aardrijkskunde', mw: 'maatschappijwetenschappen', du: 'duits', fr: 'frans', la: 'latijn', gr: 'grieks', in: 'informatica', wi: 'wiskunde', na1: 'natuur-scheikunde-1', na2: 'natuur-scheikunde-2', ma: 'maatschappijkunde', fa: 'frans' };

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plat = s => String(s ?? '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
const slug = s => String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' en ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
const kort = (s, n) => { s = plat(s); return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…'; };

// ── stijl: alleen de samenvattingsregels + kleurtokens uit styles.css ──
function blokken(css) {
  const out = []; let i = 0, start = 0, diepte = 0, sel = '';
  while (i < css.length) {
    const ch = css[i];
    if (ch === '/' && css[i + 1] === '*') { const e = css.indexOf('*/', i + 2); i = e < 0 ? css.length : e + 2; if (diepte === 0) start = i; continue; }
    if (ch === '{') { if (diepte === 0) sel = css.slice(start, i).trim(), start = i + 1; diepte++; }
    else if (ch === '}') { diepte--; if (diepte === 0) { out.push({ sel, body: css.slice(start, i) }); start = i + 1; } }
    else if (ch === ';' && diepte === 0) { start = i + 1; }
    i++;
  }
  return out;
}
function samCss(css) {
  const houd = sel => /\.sam\b|\.sam-|\bsam-clip/.test(sel) || /^(:root|html(\.[\w-]+|\[[^\]]+\]|:not\([^)]*\))*)(\s*,\s*(:root|html(\.[\w-]+|\[[^\]]+\]|:not\([^)]*\))*))*$/.test(sel);
  const uit = [];
  for (const b of blokken(css)) {
    if (b.sel.startsWith('@media') || b.sel.startsWith('@supports')) {
      const binnen = blokken(b.body).filter(x => houd(x.sel)).map(x => `${x.sel}{${x.body}}`).join('');
      if (binnen) uit.push(`${b.sel}{${binnen}}`);
    } else if (b.sel.startsWith('@keyframes')) { if (/sam|clip|cap/i.test(b.sel)) uit.push(`${b.sel}{${b.body}}`); }
    else if (!b.sel.startsWith('@') && houd(b.sel)) uit.push(`${b.sel}{${b.body}}`);
  }
  return uit.join('\n');
}
const PAGINA_CSS = `
:root{--pg-bg:#f6f7fb;--pg-kaart:#fff;--pg-tekst:#141a26;--pg-zacht:#5b6476;--pg-lijn:#e3e6ee;--pg-accent:#2563eb;--pg-goed:#15803d;--pg-fout:#b42318}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--pg-bg:#0f1420;--pg-kaart:#171e2c;--pg-tekst:#e8ecf3;--pg-zacht:#9aa4b6;--pg-lijn:#283043;--pg-accent:#6ea0ff;--pg-goed:#4ade80;--pg-fout:#f87171}}
:root[data-theme="dark"]{--pg-bg:#0f1420;--pg-kaart:#171e2c;--pg-tekst:#e8ecf3;--pg-zacht:#9aa4b6;--pg-lijn:#283043;--pg-accent:#6ea0ff;--pg-goed:#4ade80;--pg-fout:#f87171}
*{box-sizing:border-box}html{background:var(--pg-bg)}body{margin:0;background:var(--pg-bg);color:var(--pg-tekst);font:16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
.pg{max-width:760px;margin:0 auto;padding:18px 16px 60px}
.pg-top{display:flex;align-items:center;gap:10px;margin-bottom:14px}.pg-top img{width:32px;height:32px;border-radius:8px}.pg-top a{color:var(--pg-tekst);font-weight:800;text-decoration:none}
.pg-kruim{font-size:13px;color:var(--pg-zacht);margin:0 0 6px}.pg-kruim a{color:var(--pg-accent);text-decoration:none}
h1{font-size:28px;line-height:1.2;margin:4px 0 8px;text-wrap:balance}h2{font-size:21px;margin:34px 0 12px;text-wrap:balance}
.pg-lead{color:var(--pg-zacht);font-size:17px;margin:0 0 16px}
.pg-cta{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0 22px}
.pg-knop{display:inline-flex;align-items:center;gap:6px;padding:12px 18px;border-radius:12px;background:var(--pg-accent);color:#fff;font-weight:700;text-decoration:none}
.pg-knop.licht{background:var(--pg-kaart);color:var(--pg-accent);border:1px solid var(--pg-lijn)}
.pg-feiten{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 6px;padding:0;list-style:none}.pg-feiten li{font-size:13px;padding:4px 10px;border-radius:99px;background:var(--pg-kaart);border:1px solid var(--pg-lijn);color:var(--pg-zacht)}
.pg-kaart{background:var(--pg-kaart);border:1px solid var(--pg-lijn);border-radius:16px;padding:16px;margin:0 0 14px}
.sam{background:var(--pg-kaart);border:1px solid var(--pg-lijn);border-radius:16px;padding:16px}
.pg-vraag .ctx{font-size:15px;color:var(--pg-zacht);border-left:3px solid var(--pg-lijn);padding:2px 0 2px 10px;margin:0 0 8px}
.pg-vraag .v{font-weight:700;margin:0 0 8px}.pg-vraag ol{margin:0 0 8px;padding-left:22px}
.pg-vraag details{margin-top:6px}.pg-vraag summary{cursor:pointer;color:var(--pg-accent);font-weight:700}
.pg-vraag .uo{margin:8px 0 0;padding:0;list-style:none}.pg-vraag .uo li{margin:0 0 8px;font-size:15px}
.pg-vraag .uo b.goed{color:var(--pg-goed)}.pg-vraag .uo b.fout{color:var(--pg-fout)}
.pg-lijst{margin:0;padding:0;list-style:none}.pg-lijst li{padding:10px 0;border-bottom:1px solid var(--pg-lijn)}.pg-lijst li:last-child{border:0}
.pg-lijst a{color:var(--pg-tekst);font-weight:700;text-decoration:none}.pg-lijst a:hover{color:var(--pg-accent)}.pg-lijst span{display:block;color:var(--pg-zacht);font-size:14px}
dl.pg-begr dt{font-weight:800;margin-top:14px}dl.pg-begr dd{margin:2px 0 0;color:var(--pg-zacht)}dl.pg-begr dd a{color:var(--pg-accent);font-size:13px;text-decoration:none}
.pg-afb{background:#fbfaf7;border:1px solid var(--pg-lijn);border-radius:14px;padding:14px;margin:0 0 14px;overflow-x:auto}.pg-afb svg{display:block;width:100%;height:auto;max-width:520px;margin:0 auto}.pg-afb figcaption{margin-top:8px;font-size:13px;font-weight:700;color:#556072;text-align:center}
.pg-ctx{white-space:pre-line;color:var(--pg-zacht);font-size:15px;margin:0 0 12px}.pg-vraag .pt{float:right;font-size:13px;font-weight:700;color:var(--pg-zacht)}.pg-vraag .ma{white-space:pre-line;margin:8px 0 0}
.pg-voet{margin-top:40px;font-size:13px;color:var(--pg-zacht)}.pg-voet a{color:var(--pg-accent)}
a:focus-visible,summary:focus-visible{outline:3px solid var(--pg-accent);outline-offset:2px;border-radius:6px}
@media (max-width:480px){h1{font-size:24px}}`;

// ── data ──
const lees = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const data = {}, sam = {};
for (const n of Object.keys(VAR)) {
  const g = {}; new Function('g', lees(`data-${n}.js`) + `\ng.V=${VAR[n]};`)(g); data[n] = g.V;
  try { new Function('SAM_RICH', lees(`sam-${n}.js`))(sam); } catch (e) {}
}

// Slagio-proefexamens (origineel, examenstijl): één pagina met losse examenvragen per vak
const PE = (() => {
  const fs_ = fs.readdirSync(ROOT).filter(f => /^proefexamen-.*\.js$/.test(f)).sort();
  try { return new Function('window', fs_.map(lees).join('\n;\n') + '\nreturn SLAGIO_EXAMENS;')({}) || {}; } catch (e) { return {}; }
})();
const peUrl = (niv, id) => `${ORIGIN}/leren/${niv}/${SLUG[id] || id}/examenvragen.html`;

const bestanden = new Map();   // pad → inhoud
const zet = (p, inhoud) => bestanden.set(p, inhoud);
const kop = ({ titel, beschrijving, url, ld, extraHead = '', html = '' }) => `<!doctype html>
<html lang="nl" class="${html}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(beschrijving)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(titel)}"><meta property="og:description" content="${esc(beschrijving)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${ORIGIN}/icon-512.png">
<link rel="icon" href="/icon-192.png">
<link rel="stylesheet" href="/leren/leren.css">
${ld.map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('\n')}
${extraHead}
</head>`;
const top = `<div class="pg-top"><a href="/"><img src="/icon-192.png" alt="" width="32" height="32"></a><a href="/">Slagio</a></div>`;
const voet = `<p class="pg-voet">Slagio is een gratis examentrainer voor havo, vwo en vmbo, gebaseerd op de syllabi van het CvTE (examenblad.nl). <a href="/leren/">Alle leerpagina's</a> · <a href="/">Naar de app</a></p>`;
const kruimel = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([naam, url], i) => ({ '@type': 'ListItem', position: i + 1, name: naam, item: url })) });

const overzicht = [];   // voor /leren/ en llms.txt
for (const [niv, V] of Object.entries(data)) {
  for (const vak of V) {
    const vs = SLUG[vak.id] || vak.id;
    const vakNaam = `${vak.naam} ${NIV[niv]}`;
    const vakUrl = `${ORIGIN}/leren/${niv}/${vs}/`;
    const modules = [];
    for (const d of vak.domeinen) for (const l of (d.leerdoelen || [])) {
      const s = sam[`${niv}_${vak.id}_${l.id}`];
      if (!s || !(l.sv || []).length) continue;
      modules.push({ d, l, s, slug: slug(l.naam) || l.id.toLowerCase() });
    }
    if (!modules.length) continue;
    // dubbele slugs binnen een vak voorkomen
    const gezien = new Set(); modules.forEach(m => { let x = m.slug, k = 2; while (gezien.has(x)) x = m.slug + '-' + k++; m.slug = x; gezien.add(x); });

    for (const [i, m] of modules.entries()) {
      const { d, l, s } = m;
      const url = `${vakUrl}${m.slug}.html`;
      const app = `/?niveau=${niv}&vak=${vak.id}&leerdoel=${encodeURIComponent(l.id)}`;
      const titel = `${l.naam}: uitleg en oefenvragen | ${vakNaam} | Slagio`;
      const beschrijving = kort(`${l.beschrijving || ''} Samenvatting met figuren, ${l.sv.length} oefenvragen met uitleg bij elk antwoord. Gratis, examen ${new Date().getFullYear() + 1}.`, 158);
      // voorbeeldvragen: liefst met casus, verspreid over de niveaus
      const pool = l.sv.filter(q => Array.isArray(q.uo) && q.uo.length === 4);
      const kies = []; for (const lvl of [1, 2, 3, 3]) { const q = pool.find(q => q.d === lvl && !kies.includes(q) && (lvl === 1 || q.ctx)) || pool.find(q => q.d === lvl && !kies.includes(q)); if (q) kies.push(q); }
      const vragenHtml = kies.map((q, k) => `<div class="pg-kaart pg-vraag">
${q.ctx ? `<p class="ctx">${esc(q.ctx)}</p>` : ''}<p class="v">${k + 1}. ${esc(q.v)}</p>
<ol type="A">${q.o.map(o => `<li>${esc(o)}</li>`).join('')}</ol>
<details><summary>Antwoord en uitleg</summary>
<ul class="uo">${q.o.map((o, j) => `<li><b class="${j === q.c ? 'goed' : 'fout'}">${'ABCD'[j]}${j === q.c ? ' (juist)' : ''}:</b> ${esc(q.uo[j])}</li>`).join('')}</ul>
${q.uh ? `<p><b>Onthoud:</b> ${esc(q.uh)}</p>` : ''}</details></div>`).join('\n');
      const quiz = {
        '@context': 'https://schema.org', '@type': 'Quiz', name: `Oefenvragen ${l.naam} (${vakNaam})`,
        about: { '@type': 'Thing', name: l.naam }, educationalLevel: NIV[niv],
        educationalAlignment: [{ '@type': 'AlignmentObject', alignmentType: 'educationalSubject', targetName: vak.naam }],
        hasPart: kies.map(q => ({
          '@type': 'Question', eduQuestionType: 'Multiple choice', learningResourceType: 'Practice problem',
          text: (q.ctx ? q.ctx + ' ' : '') + q.v, encodingFormat: 'text/html',
          suggestedAnswer: q.o.map((o, j) => j === q.c ? null : ({ '@type': 'Answer', position: j, text: o, encodingFormat: 'text/html', comment: { '@type': 'Comment', text: q.uo[j] } })).filter(Boolean),
          acceptedAnswer: { '@type': 'Answer', position: q.c, text: q.o[q.c], encodingFormat: 'text/html', answerExplanation: { '@type': 'Comment', text: q.u || q.uo[q.c] } },
        })),
      };
      const bron = { '@context': 'https://schema.org', '@type': 'LearningResource', name: l.naam, description: plat(l.beschrijving), url, inLanguage: 'nl', isAccessibleForFree: true, educationalLevel: NIV[niv], learningResourceType: ['Samenvatting', 'Oefenvragen'], teaches: (l.onderwerpen || []).join(', '), provider: { '@type': 'Organization', name: 'Slagio', url: ORIGIN }, about: (l.begrippen || []).slice(0, 12).map(b => ({ '@type': 'DefinedTerm', name: b.t, description: b.d })) };
      const buren = [modules[i - 1], modules[i + 1]].filter(Boolean);
      zet(`leren/${niv}/${vs}/${m.slug}.html`, kop({ titel, beschrijving, url, html: `level-${niv}`, ld: [bron, quiz, kruimel([['Slagio', ORIGIN + '/'], ['Leren', ORIGIN + '/leren/'], [vakNaam, vakUrl], [l.naam, url]])] }) + `
<body><main class="pg">
${top}
<p class="pg-kruim"><a href="/leren/">Leren</a> › <a href="${vakUrl}">${esc(vakNaam)}</a> › Domein ${esc(d.id)}: ${esc(d.naam)}</p>
<h1>${esc(l.naam)}</h1>
<p class="pg-lead">${esc(plat(l.beschrijving))}</p>
<ul class="pg-feiten"><li>${esc(vakNaam)}</li><li>${l.ceStatus ? esc(l.ceStatus) : 'examenstof'}</li><li>${l.sv.length} oefenvragen</li><li>${(l.begrippen || []).length} begrippen</li></ul>
<div class="pg-cta"><a class="pg-knop" href="${app}&oefen=1">Oefen alle ${l.sv.length} vragen</a><a class="pg-knop licht" href="${app}">Open in de app</a></div>
<h2>Samenvatting</h2>
<div class="sam">${s}</div>
${vragenHtml ? `<h2>Oefen alvast: ${kies.length} vragen met uitleg</h2>\n${vragenHtml}\n<div class="pg-cta"><a class="pg-knop" href="${app}&oefen=1">Oefen de andere ${l.sv.length - kies.length} vragen, aangepast aan jouw niveau</a></div>` : ''}
${buren.length ? `<h2>Verder in ${esc(vakNaam)}</h2><ul class="pg-lijst">${buren.map(b => `<li><a href="${vakUrl}${b.slug}.html">${esc(b.l.naam)}</a><span>${esc(kort(b.l.beschrijving, 140))}</span></li>`).join('')}</ul>` : ''}
${voet}
</main><script src="/sam-clip.js" defer></script></body></html>
`);
      overzicht.push({ niv, vakNaam, vs, naam: l.naam, url, besch: kort(l.beschrijving, 160) });
    }

    // vak-index
    const perDom = new Map(); modules.forEach(m => { if (!perDom.has(m.d.id)) perDom.set(m.d.id, []); perDom.get(m.d.id).push(m); });
    zet(`leren/${niv}/${vs}/index.html`, kop({ titel: `${vakNaam}: alle onderwerpen met uitleg en oefenvragen | Slagio`, beschrijving: kort(`Uitleg, samenvattingen met figuren en oefenvragen voor ${vakNaam}, per leerdoel van het examenprogramma. Gratis.`, 158), url: vakUrl, ld: [kruimel([['Slagio', ORIGIN + '/'], ['Leren', ORIGIN + '/leren/'], [vakNaam, vakUrl]])] }) + `
<body><main class="pg">${top}
<p class="pg-kruim"><a href="/leren/">Leren</a> › ${esc(vakNaam)}</p>
<h1>${esc(vakNaam)}</h1>
<p class="pg-lead">Per onderwerp een samenvatting met figuren en oefenvragen met uitleg bij elk antwoord. <a href="${vakUrl}begrippen.html">Alle begrippen</a>.</p>
<div class="pg-cta"><a class="pg-knop" href="/?niveau=${niv}&vak=${vak.id}">Oefen ${esc(vak.naam)} in de app</a>${PE[niv] && PE[niv][vak.id] ? `<a class="pg-knop licht" href="${peUrl(niv, vak.id)}">Examenvragen met antwoorden</a>` : ''}</div>
${[...perDom.entries()].map(([did, ms]) => `<h2>Domein ${esc(did)}: ${esc(ms[0].d.naam)}</h2><ul class="pg-lijst">${ms.map(m => `<li><a href="${vakUrl}${m.slug}.html">${esc(m.l.naam)}</a><span>${esc(kort(m.l.beschrijving, 150))}</span></li>`).join('')}</ul>`).join('\n')}
${voet}
</main></body></html>
`);
    // begrippen
    const begr = []; const bgz = new Set();
    for (const m of modules) for (const b of (m.l.begrippen || [])) { const k = slug(b.t); if (!k || bgz.has(k)) continue; bgz.add(k); begr.push({ k, t: b.t, d: b.d, m }); }
    begr.sort((a, b) => a.t.localeCompare(b.t, 'nl'));
    zet(`leren/${niv}/${vs}/begrippen.html`, kop({ titel: `Begrippenlijst ${vakNaam}: ${begr.length} begrippen uitgelegd | Slagio`, beschrijving: kort(`Alle begrippen voor het examen ${vakNaam} met een korte uitleg, gekoppeld aan de samenvatting en oefenvragen. ${begr.slice(0, 6).map(b => b.t).join(', ')} en meer.`, 158), url: `${vakUrl}begrippen.html`,
      ld: [{ '@context': 'https://schema.org', '@type': 'DefinedTermSet', name: `Begrippen ${vakNaam}`, url: `${vakUrl}begrippen.html`, hasDefinedTerm: begr.map(b => ({ '@type': 'DefinedTerm', name: b.t, description: b.d, url: `${vakUrl}begrippen.html#${b.k}` })) }, kruimel([['Slagio', ORIGIN + '/'], ['Leren', ORIGIN + '/leren/'], [vakNaam, vakUrl], ['Begrippen', `${vakUrl}begrippen.html`]])] }) + `
<body><main class="pg">${top}
<p class="pg-kruim"><a href="/leren/">Leren</a> › <a href="${vakUrl}">${esc(vakNaam)}</a> › Begrippen</p>
<h1>Begrippenlijst ${esc(vakNaam)}</h1>
<p class="pg-lead">${begr.length} begrippen met een korte uitleg. Klik door naar het onderwerp voor de samenvatting en oefenvragen.</p>
<dl class="pg-begr">${begr.map(b => `<dt id="${b.k}">${esc(b.t)}</dt><dd>${esc(b.d)} <a href="${vakUrl}${b.m.slug}.html">${esc(b.m.l.naam)} →</a></dd>`).join('\n')}</dl>
${voet}
</main></body></html>
`);
  }
}

// examenvragen per vak (uit het Slagio-proefexamen)
const examenPaginas = [];
for (const [niv, V] of Object.entries(data)) for (const vak of V) {
  const ex = PE[niv] && PE[niv][vak.id]; if (!ex || !(ex.vragen || []).length) continue;
  const vs = SLUG[vak.id] || vak.id, vakNaam = `${vak.naam} ${NIV[niv]}`, vakUrl = `${ORIGIN}/leren/${niv}/${vs}/`, url = peUrl(niv, vak.id);
  const heeftIndex = bestanden.has(`leren/${niv}/${vs}/index.html`);
  const L = 'ABCDEFGH', nV = ex.vragen.length, pt = ex.vragen.reduce((a, q) => a + (q.punten || 0), 0);
  const antw = q => q.type === 'mc' && q.opties ? `Juist is ${L[q.correct]}: ${q.opties[q.correct]}${q.uitleg ? '. ' + q.uitleg : ''}` : (q.antwoord || '');
  const rubric = q => (q.antwoord_rubric || '').replace(/\.\s+(?=\d+\s*punt)/g, '.\n');
  const opgHtml = (ex.opgaven || []).map(op => {
    const vr = ex.vragen.filter(q => q.opgave === op.nr); if (!vr.length) return '';
    const fig = (svg, cap) => svg ? `<figure class="pg-afb">${svg}${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>` : '';
    return `<h2 id="opgave-${op.nr}">Opgave ${op.nr}: ${esc(op.titel || '')}</h2>
${op.context ? `<p class="pg-ctx">${esc(op.context)}</p>` : ''}${fig(op.afb, op.afb_cap)}
${vr.map(q => `<div class="pg-kaart pg-vraag"><span class="pt">${q.punten || 1} ${(q.punten || 1) === 1 ? 'punt' : 'punten'}</span>
${q.afb && q.afb !== op.afb ? fig(q.afb, q.afb_cap) : ''}<p class="v">${q.nr}. ${esc(q.vraag)}</p>
${q.type === 'mc' && q.opties ? `<ol type="A">${q.opties.map(o => `<li>${esc(o)}</li>`).join('')}</ol>` : ''}
<details><summary>${q.type === 'mc' ? 'Antwoord en uitleg' : 'Modelantwoord en puntenverdeling'}</summary>
<p class="ma">${esc(antw(q))}</p>${rubric(q) ? `<p class="ma"><b>Zo worden de punten verdeeld:</b>\n${esc(rubric(q))}</p>` : ''}</details></div>`).join('\n')}`;
  }).join('\n');
  const titel = `Examenvragen ${vakNaam} met antwoorden: ${nV} vragen in examenstijl | Slagio`;
  const beschrijving = kort(`${nV} oefenvragen voor het eindexamen ${vakNaam} in de stijl van het centraal examen, met figuren, modelantwoord en puntenverdeling. Gratis, ook als proefexamen met klok in de app.`, 158);
  const quiz = {
    '@context': 'https://schema.org', '@type': 'Quiz', name: `Examenvragen ${vakNaam} (Slagio-proefexamen)`, educationalLevel: NIV[niv], inLanguage: 'nl', isAccessibleForFree: true,
    educationalAlignment: [{ '@type': 'AlignmentObject', alignmentType: 'educationalSubject', targetName: vak.naam }],
    provider: { '@type': 'Organization', name: 'Slagio', url: ORIGIN },
    hasPart: ex.vragen.map(q => q.type === 'mc' && q.opties ? ({
      '@type': 'Question', eduQuestionType: 'Multiple choice', learningResourceType: 'Practice problem', text: q.vraag,
      suggestedAnswer: q.opties.map((o, j) => j === q.correct ? null : ({ '@type': 'Answer', position: j, text: o })).filter(Boolean),
      acceptedAnswer: { '@type': 'Answer', position: q.correct, text: q.opties[q.correct], answerExplanation: { '@type': 'Comment', text: q.uitleg || '' } },
    }) : ({
      '@type': 'Question', eduQuestionType: 'Open-ended', learningResourceType: 'Practice problem', text: q.vraag,
      acceptedAnswer: { '@type': 'Answer', text: q.antwoord || '', answerExplanation: { '@type': 'Comment', text: q.antwoord_rubric || '' } },
    })),
  };
  const app = `/?niveau=${niv}&vak=${vak.id}`;
  zet(`leren/${niv}/${vs}/examenvragen.html`, kop({ titel, beschrijving, url, html: `level-${niv}`, ld: [quiz, kruimel([['Slagio', ORIGIN + '/'], ['Leren', ORIGIN + '/leren/'], ...(heeftIndex ? [[vakNaam, vakUrl]] : []), ['Examenvragen', url]])] }) + `
<body><main class="pg">
${top}
<p class="pg-kruim"><a href="/leren/">Leren</a> › ${heeftIndex ? `<a href="${vakUrl}">${esc(vakNaam)}</a>` : esc(vakNaam)} › Examenvragen</p>
<h1>Examenvragen ${esc(vakNaam)} met antwoorden</h1>
<p class="pg-lead">${nV} vragen (${pt} punten) in de stijl van het centraal examen, verdeeld over ${(ex.opgaven || []).length} opgaven met context en figuren. Probeer eerst zelf een antwoord en klap daarna het modelantwoord met de puntenverdeling open.</p>
<ul class="pg-feiten"><li>${esc(vakNaam)}</li><li>${nV} vragen</li><li>${pt} punten</li><li>Slagio-proefexamen, geen officieel CE</li></ul>
<div class="pg-cta"><a class="pg-knop" href="${app}">Maak het als proefexamen met klok</a>${heeftIndex ? `<a class="pg-knop licht" href="${vakUrl}">Uitleg per onderwerp</a>` : ''}</div>
${opgHtml}
<div class="pg-cta"><a class="pg-knop" href="${app}">Oefen ${esc(vak.naam)} verder in de app</a></div>
<p class="pg-voet">Dit is een origineel Slagio-proefexamen in examenstijl, met eigen contexten en figuren. De echte centrale examens staan op examenblad.nl en in de examenbibliotheek van de app.</p>
${voet}
</main></body></html>
`);
  examenPaginas.push({ niv, vakNaam, url, nV });
}

// overzicht + llms.txt
const perVak = new Map(); overzicht.forEach(o => { const k = o.niv + '/' + o.vs; if (!perVak.has(k)) perVak.set(k, []); perVak.get(k).push(o); });
zet('leren/index.html', kop({ titel: 'Leren voor je eindexamen: uitleg en oefenvragen per onderwerp | Slagio', beschrijving: 'Gratis samenvattingen met figuren en oefenvragen met uitleg per antwoord, per onderwerp van het examenprogramma voor havo, vwo en vmbo.', url: `${ORIGIN}/leren/`, ld: [kruimel([['Slagio', ORIGIN + '/'], ['Leren', ORIGIN + '/leren/']])] }) + `
<body><main class="pg">${top}
<h1>Leren voor je eindexamen</h1>
<p class="pg-lead">Per onderwerp van het examenprogramma: een samenvatting met figuren en oefenvragen met uitleg bij elk antwoord. Er komen elke dag onderwerpen bij.</p>
${[...perVak.entries()].map(([k, os]) => `<h2><a href="/leren/${k}/" style="color:inherit;text-decoration:none">${esc(os[0].vakNaam)}</a></h2><ul class="pg-lijst">${os.map(o => `<li><a href="${o.url}">${esc(o.naam)}</a></li>`).join('')}</ul>`).join('\n')}
<h2>Examenvragen met antwoorden</h2>
<p class="pg-lead">Per vak een proefexamen in examenstijl, met figuren, modelantwoord en puntenverdeling.</p>
<ul class="pg-lijst">${examenPaginas.map(e => `<li><a href="${e.url}">Examenvragen ${esc(e.vakNaam)}</a><span>${e.nV} vragen</span></li>`).join('')}</ul>
${voet}
</main></body></html>
`);
zet('llms.txt', `# Slagio

> Gratis examentrainer voor havo, vwo en vmbo in Nederland. Per leerdoel van het officiële examenprogramma (syllabi CvTE, examenblad.nl): een samenvatting met figuren, oefenvragen met uitleg bij elk antwoord, begrippenlijsten en examenvragen in examenstijl. Adaptief oefenen in de app op ${ORIGIN}.

## Leerpagina's per onderwerp
${overzicht.map(o => `- [${o.naam} (${o.vakNaam})](${o.url}): ${o.besch}`).join('\n')}

## Examenvragen in examenstijl (met modelantwoord en puntenverdeling)
${examenPaginas.map(e => `- [Examenvragen ${e.vakNaam}](${e.url}): ${e.nV} vragen uit een Slagio-proefexamen`).join('\n')}

## Begrippenlijsten
${[...perVak.entries()].map(([k, os]) => `- [Begrippen ${os[0].vakNaam}](${ORIGIN}/leren/${k}/begrippen.html)`).join('\n')}

## Overig
- [Examenrooster 2027](${ORIGIN}/examenrooster-2027.html)
- [Eindcijfer berekenen](${ORIGIN}/eindcijfer-calculator.html)
- [Alle vakken](${ORIGIN}/vakken/)
`);
zet('leren/leren.css', '/* gegenereerd door scripts/build-leren.mjs - niet met de hand bewerken */\n' + samCss(lees('styles.css')) + '\n' + PAGINA_CSS + '\n');

// ── schrijven of controleren ──
let anders = 0;
const bestaand = new Set();
const loop = dir => { if (!fs.existsSync(dir)) return; for (const f of fs.readdirSync(dir)) { const p = path.join(dir, f); if (fs.statSync(p).isDirectory()) loop(p); else bestaand.add(path.relative(ROOT, p)); } };
loop(path.join(ROOT, 'leren'));
for (const [p, inhoud] of bestanden) {
  const vol = path.join(ROOT, p);
  const oud = fs.existsSync(vol) ? fs.readFileSync(vol, 'utf8') : null;
  bestaand.delete(p);
  if (oud === inhoud) continue;
  anders++;
  if (!CHECK) { fs.mkdirSync(path.dirname(vol), { recursive: true }); fs.writeFileSync(vol, inhoud); }
}
for (const p of bestaand) { anders++; if (!CHECK) fs.unlinkSync(path.join(ROOT, p)); }
const n = overzicht.length, vakken = perVak.size, nEx = examenPaginas.length;
if (CHECK) { if (anders) { console.log(`✗ leerpagina's verouderd (${anders} bestanden): draai node scripts/build-leren.mjs`); process.exit(1); } console.log(`✓ leerpagina's actueel (${n} onderwerpen, ${vakken} vakken, ${nEx} examenvragenpagina's)`); }
else console.log(`✓ ${n} leerpagina's, ${vakken} vakindexen en begrippenlijsten, ${nEx} examenvragenpagina's, /leren/ en /llms.txt (${anders} bestanden bijgewerkt)`);
