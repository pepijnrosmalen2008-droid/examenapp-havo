// ═══════════════════════════════════════════════════════════════════════════
// kennis.mjs · Jarvis' kennisbank over Slagio zelf
//
// Wat Jarvis moet weten om als specialist te werken, rechtstreeks uit de repo:
//   inhoud      vakken en domeinen per niveau, met aantallen (data-*.meta.js)
//   gaten       waar content ontbreekt of dun is, met prioriteit
//   vraagbank   echte, los bruikbare vragen per vak (voor posts en voorbeelden)
//   seo         audit van elke indexeerbare pagina + dekking van de vakpagina's
//   social      formats die de fabriek kan maken + wat er al gepost is
//   docs        stijlgids en de Jarvis-doctrine (social/jarvis-brein.md)
// Wordt door rapport.mjs in de pagina gezet; de gesprekslaag haalt er via tools
// alleen op wat hij nodig heeft (een vraag aan Claude mag max. 64 KB zijn).
// ═══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, NIVEAUS, vakken, geschikteVragen, geschikteBegrippenSets, eersteExamen } from './data.mjs';

const ORIGIN = 'https://slagio.nl';
const lees = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const bestaat = f => fs.existsSync(path.join(ROOT, f));
const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ── Inhoud + gaten ─────────────────────────────────────────────────────────
function inhoud() {
  const uit = {}, gaten = [], totalen = {};
  for (const n of Object.keys(NIVEAUS)) {
    const V = vakken(n);
    const eerste = eersteExamen(n);
    totalen[n] = { vakken: V.length, vragen: 0, oudExamen: 0, begrippen: 0, domeinen: 0, leeg: 0, eersteExamen: eerste ? `${eerste.datum} ${eerste.vak}` : null };
    uit[n] = V.map(v => {
      const dom = (v.domeinen || []).map(d => {
        const ce = /CE/.test(d.ceStatus || '');
        const t = totalen[n]; t.domeinen++; t.vragen += d.nSv || 0; t.oudExamen += d.nOe || 0; t.begrippen += d.nBeg || 0;
        const leeg = !(d.nSv || d.nOe || d.nBeg);
        if (leeg) t.leeg++;
        // Prioriteit: CE-stof weegt zwaarder; leeg > dun > geen samenvatting > geen begrippen.
        const redenen = [];
        if (leeg) redenen.push('leeg: leerling ziet "Binnenkort"');
        else {
          if ((d.nSv || 0) < 25) redenen.push(`maar ${d.nSv || 0} oefenvragen`);
          if (!d.hasSam) redenen.push('geen samenvatting');
          if (!(d.nBeg || 0)) redenen.push('geen begrippen');
        }
        if (redenen.length) {
          const w = (ce ? 2 : 1) * (leeg ? 5 : (d.nSv || 0) < 25 ? 3 : !d.hasSam ? 2 : 1);
          gaten.push({ niveau: n, vak: v.naam, vakId: v.id, domein: `${d.id} ${d.naam}`, ce: d.ceStatus || '', exDatum: v.exDatum || '', redenen, prioriteit: w });
        }
        return [d.id, d.naam, d.ceStatus || '', d.nSv || 0, d.nOe || 0, d.nBeg || 0, d.hasSam ? 1 : 0];
      });
      return { id: v.id, naam: v.naam, exDatum: v.exDatum || '', dom };
    });
  }
  gaten.sort((a, b) => b.prioriteit - a.prioriteit || a.exDatum.localeCompare(b.exDatum));
  return { inhoud: uit, gaten, totalen };
}

// ── Vraagbank: echte vragen die los werken (zelfde filters als de fabriek) ───
function vraagbank(perVak = 24) {
  const bank = {};
  for (const n of Object.keys(NIVEAUS)) for (const v of vakken(n)) {
    const qs = geschikteVragen(n, v.id);
    // Spreid over domeinen: om de beurt één per domein.
    const perDom = new Map();
    qs.forEach(q => { if (!perDom.has(q.domId)) perDom.set(q.domId, []); perDom.get(q.domId).push(q); });
    const lijsten = [...perDom.values()], gekozen = [];
    for (let i = 0; gekozen.length < perVak && lijsten.some(l => l[i]); i++) lijsten.forEach(l => { if (l[i] && gekozen.length < perVak) gekozen.push(l[i]); });
    const begr = geschikteBegrippenSets(n, v.id).flatMap(s => s.begrippen.slice(0, 4).map(b => [s.domId, b.t, b.d])).slice(0, 16);
    if (gekozen.length || begr.length) bank[`${n}:${v.id}`] = {
      vragen: gekozen.map(q => [q.domId, q.domeinNaam, q.ce ? 1 : 0, q.vraag, q.opties, q.juist, q.uitleg]),
      begrippen: begr,
    };
  }
  return bank;
}

// ── SEO-audit ──────────────────────────────────────────────────────────────
const attr = (html, re) => ((html.match(re) || [])[1] || '').trim();
const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
function tekstVan(html) {
  return decode(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}
function seo(examenJaar) {
  const sitemap = bestaat('sitemap.xml') ? lees('sitemap.xml') : '';
  const inSitemap = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
  const files = [...fs.readdirSync(ROOT).filter(f => f.endsWith('.html')), ...fs.readdirSync(path.join(ROOT, 'vakken')).filter(f => f.endsWith('.html')).map(f => 'vakken/' + f)];
  const oudJaar = new RegExp(`\\b(eind)?examen(s)?\\s*(${examenJaar - 1}|${examenJaar - 2})\\b|\\b(${examenJaar - 1})\\s*[-–]?\\s*(eind)?examen`, 'i');
  const paginas = [];
  for (const f of files) {
    const html = lees(f);
    const robots = attr(html, /<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/i);
    if (/noindex/i.test(robots) || /http-equiv=["']refresh/i.test(html)) continue;
    const canonical = attr(html, /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    if (!canonical) continue;                                 // geen canonical = geen landingspagina (app-schermen, tools)
    const title = decode(attr(html, /<title>([^<]*)<\/title>/i));
    const desc = decode(attr(html, /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i));
    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => tekstVan(m[1]));
    const ld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].flatMap(m => [...m[1].matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map(x => x[1]));
    const intern = [...html.matchAll(/<a[^>]+href=["']([^"'#]+)["']/gi)].map(m => m[1]).filter(h => !/^(https?:)?\/\//.test(h) || h.startsWith(ORIGIN)).length;
    const woorden = f === 'index.html' ? tekstVan((html.match(/<noscript>([\s\S]*?)<\/noscript>/i) || [])[1] || '').split(' ').length : tekstVan(html).split(' ').length;
    const og = /property=["']og:image["']/i.test(html);
    const p = { pad: f, url: canonical, title, desc, h1: h1s[0] || '', woorden, intern, ld: [...new Set(ld)], issues: [] };
    const I = (ernst, tekst) => p.issues.push([ernst, tekst]);
    if (!title) I(3, 'geen <title>'); else if (title.length > 65) I(1, `title ${title.length} tekens (Google toont ±60)`); else if (title.length < 25) I(1, `title kort (${title.length} tekens)`);
    if (!desc) I(2, 'geen meta description'); else if (desc.length > 165) I(1, `description ${desc.length} tekens (±155 zichtbaar)`); else if (desc.length < 70) I(1, `description kort (${desc.length} tekens)`);
    if (oudJaar.test(title) || oudJaar.test(desc)) I(3, `verouderd examenjaar in title/description (leerlingen zoeken op ${examenJaar})`);
    else if (oudJaar.test(tekstVan(html))) I(2, `verouderd examenjaar in de tekst (${examenJaar - 1})`);
    if (h1s.length === 0) I(2, 'geen h1'); else if (h1s.length > 1) I(1, `${h1s.length} h1's`);
    if (!p.ld.length) I(1, 'geen structured data (JSON-LD)');
    if (!og) I(1, 'geen og:image (delen op sociale media)');
    if (woorden < 250 && !/privacy|voorwaarden/.test(f)) I(2, `dunne pagina (${woorden} woorden)`);
    if (intern < 5) I(1, `weinig interne links (${intern})`);
    const loc = canonical.startsWith(ORIGIN) ? canonical : null;
    if (loc && sitemap && !inSitemap.has(loc) && !inSitemap.has(loc.replace(/\/$/, '')) && !inSitemap.has(loc + '/')) I(2, 'staat niet in sitemap.xml');
    paginas.push(p);
  }
  // Dubbele titles
  const perTitle = {};
  paginas.forEach(p => { if (p.title) (perTitle[p.title] ||= []).push(p); });
  Object.values(perTitle).filter(l => l.length > 1).forEach(l => l.forEach(p => p.issues.push([2, `zelfde title als ${l.length - 1} andere pagina('s)`])));

  // Dekking: heeft elk vak in de app een landingspagina, en domeinpagina's?
  const vakFiles = new Set(fs.readdirSync(path.join(ROOT, 'vakken')));
  const dekking = [];
  for (const n of Object.keys(NIVEAUS)) for (const v of vakken(n)) {
    const kand = [`${n}-${slug(v.naam)}.html`, `${n}-${slug(v.naam).split('-')[0]}.html`, `${n}-${slug(v.naam).replace(/-en-/, '-')}.html`];
    const pagina = kand.find(k => vakFiles.has(k));
    const basis = pagina ? pagina.replace('.html', '') : null;
    const domPaginas = basis ? [...vakFiles].filter(x => x.startsWith(basis + '-domein-')).length : 0;
    dekking.push({ niveau: n, vak: v.naam, pagina: pagina ? 'vakken/' + pagina : null, domeinpaginas: domPaginas, domeinen: (v.domeinen || []).length });
  }
  const ernstTotaal = paginas.reduce((a, p) => a + p.issues.reduce((b, i) => b + i[0], 0), 0);
  const score = Math.max(0, Math.round(100 - ernstTotaal / Math.max(1, paginas.length) * 12));
  return { score, paginas, dekking, telling: { paginas: paginas.length, inSitemap: inSitemap.size } };
}

// ── Social: formats + geschiedenis ─────────────────────────────────────────
function social() {
  const dir = path.join(ROOT, 'social/weken');
  const weken = fs.existsSync(dir) ? fs.readdirSync(dir).filter(w => fs.existsSync(path.join(dir, w, 'plan.json'))).sort().slice(-8) : [];
  return {
    formats: [
      ['aftellen', 'feed-post 4:5 + story 9:16 met dagen tot de eerste CE'],
      ['examenvraag', 'carrousel van 4: cover, vraag met A-D, antwoord + uitleg + valkuil, app-slide'],
      ['begrippen', 'carrousel van 7: vijf begrippen uit één domein, opslaanbaar'],
      ['reel', 'faceless schermopname-video van een vraag in de app, 9:16'],
    ],
    geschiedenis: weken.map(w => { const p = JSON.parse(fs.readFileSync(path.join(dir, w, 'plan.json'), 'utf8')); return { week: w, posts: p.posts.map(x => [x.format, x.info]) }; }),
  };
}

export function bouwKennis({ examenDatum } = {}) {
  const jaar = Number((examenDatum || '2027').slice(0, 4));
  const { inhoud: inh, gaten, totalen } = inhoud();
  const docs = {};
  for (const [k, f] of [['stijlgids', 'social/STIJLGIDS.md'], ['brein', 'social/jarvis-brein.md']]) if (bestaat(f)) docs[k] = lees(f);
  return { gebouwd: new Date().toISOString(), examenJaar: jaar, totalen, inhoud: inh, gaten, vraagbank: vraagbank(), seo: seo(jaar), social: social(), docs };
}
