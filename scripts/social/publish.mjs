#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// publish.mjs · plaatst goedgekeurde posts op Instagram (officiële Graph API)
//
// Goedkeuren = de wekelijkse content-PR mergen. Alles wat daarna in
// social/weken/*/plan.json op main staat, wordt op het geplande moment
// geplaatst. Wat al geplaatst is staat in social/gepubliceerd.json.
//
//   node scripts/social/publish.mjs              → plaats wat nu aan de beurt is
//   node scripts/social/publish.mjs --dry-run    → laat alleen zien wat er zou gebeuren
//   node scripts/social/publish.mjs --controleer → valideer alle plannen (voor CI)
//   node scripts/social/publish.mjs --opruimen   → media van oude weken weghalen
//
// Omgeving: IG_USER_ID, IG_ACCESS_TOKEN (secrets). Tokens die met "IG" beginnen
// gaan via graph.instagram.com (Instagram-login), anders via graph.facebook.com.
// Geen npm-afhankelijkheden: draait in een paar seconden.
// ═══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const WEKEN = path.join(ROOT, 'social/weken');
const STAAT = path.join(ROOT, 'social/gepubliceerd.json');
const SITE = process.env.SITE_URL || 'https://slagio.nl';
const API_VERSIE = 'v23.0';
const MAX_TE_LAAT_UUR = 36;          // later dan dit: overslaan i.p.v. alsnog plaatsen
const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry-run');

const leesJSON = (f, def) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : def);
const staat = leesJSON(STAAT, {});

function plannen() {
  if (!fs.existsSync(WEKEN)) return [];
  return fs.readdirSync(WEKEN).filter(w => /^\d{4}-W\d{2}$/.test(w)).sort().map(week => {
    const f = path.join(WEKEN, week, 'plan.json');
    return fs.existsSync(f) ? { week, dir: path.join(WEKEN, week), plan: leesJSON(f) } : null;
  }).filter(Boolean);
}

// ── Controleren (CI op de content-PR) ─────────────────────────────────────
const FORMATEN = new Set(['image', 'story', 'carousel', 'reel']);
function controleer() {
  const fouten = [];
  for (const { week, dir, plan } of plannen()) {
    if (plan.week !== week) fouten.push(`${week}: plan.week klopt niet (${plan.week})`);
    const ids = new Set();
    for (const p of plan.posts || []) {
      const w = `${week}/${p.id}`;
      if (ids.has(p.id)) fouten.push(`${w}: dubbel id`); ids.add(p.id);
      if (!FORMATEN.has(p.format)) fouten.push(`${w}: onbekend format ${p.format}`);
      if (isNaN(Date.parse(p.publiceren))) fouten.push(`${w}: ongeldige datum ${p.publiceren}`);
      if (p.format === 'carousel' && (p.bestanden.length < 2 || p.bestanden.length > 10)) fouten.push(`${w}: carrousel moet 2-10 slides hebben`);
      if (p.format !== 'story' && !p.caption) fouten.push(`${w}: onderschrift ontbreekt`);
      if ((p.caption || '').length > 2200) fouten.push(`${w}: onderschrift > 2200 tekens`);
      if (/—/.test(p.caption || '')) fouten.push(`${w}: gedachtestreepje in onderschrift (stijlgids)`);
      if ((p.caption || '').match(/#/g)?.length > 30) fouten.push(`${w}: meer dan 30 hashtags`);
      for (const f of [...(p.bestanden || []), ...(p.cover ? [p.cover] : [])]) {
        const abs = path.join(dir, f);
        if (!fs.existsSync(abs)) { fouten.push(`${w}: bestand ontbreekt: ${f}`); continue; }
        const kop = fs.readFileSync(abs).subarray(0, 12);
        const isJpg = kop[0] === 0xff && kop[1] === 0xd8;
        const isMp4 = kop.subarray(4, 8).toString() === 'ftyp';
        if (/\.jpe?g$/i.test(f) && !isJpg) fouten.push(`${w}: ${f} is geen echte JPEG (Instagram eist JPEG)`);
        if (/\.mp4$/i.test(f) && !isMp4) fouten.push(`${w}: ${f} is geen MP4`);
      }
    }
  }
  return fouten;
}

// ── Graph API ──────────────────────────────────────────────────────────────
const TOKEN = process.env.IG_ACCESS_TOKEN || '';
const IG = process.env.IG_USER_ID || '';
const HOST = TOKEN.startsWith('IG') ? 'https://graph.instagram.com' : 'https://graph.facebook.com';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function api(pad, params = {}, method = 'POST') {
  const url = new URL(`${HOST}/${API_VERSIE}/${pad}`);
  const body = new URLSearchParams({ ...params, access_token: TOKEN });
  if (DRY) {
    const toon = Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v).length > 70 ? String(v).slice(0, 67) + '…' : v]));
    console.log(`    [dry-run] ${method} ${pad}`, JSON.stringify(toon));
    return { id: `dry_${Math.random().toString(36).slice(2, 8)}`, status_code: 'FINISHED', permalink: '(dry-run)' };
  }
  const res = method === 'GET'
    ? await fetch(`${url}?${body}`)
    : await fetch(url, { method, body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) throw new Error(`${method} ${pad}: ${json.error?.message || res.status}`);
  return json;
}

async function wachtTotKlaar(containerId, maxSec = 300) {
  for (let t = 0; t < maxSec; t += 6) {
    const s = await api(containerId, { fields: 'status_code,status' }, 'GET');
    if (s.status_code === 'FINISHED') return;
    if (s.status_code === 'ERROR' || s.status_code === 'EXPIRED') throw new Error(`verwerking mislukt: ${s.status || s.status_code}`);
    await sleep(6000);
  }
  throw new Error('video-verwerking duurde te lang');
}

async function bestaatOnline(url) {
  if (DRY) return true;
  try { const r = await fetch(url, { method: 'HEAD' }); return r.ok; } catch (e) { return false; }
}

async function plaats(week, p) {
  const media = f => `${SITE}/social/weken/${week}/${f}`;
  // De media moeten al live op slagio.nl staan (na merge + Pages-deploy).
  for (const f of p.bestanden) if (!(await bestaatOnline(media(f)))) return { wacht: `media nog niet online: ${f}` };

  let container;
  if (p.format === 'image') {
    container = await api(`${IG}/media`, { image_url: media(p.bestanden[0]), caption: p.caption });
  } else if (p.format === 'story') {
    container = await api(`${IG}/media`, { image_url: media(p.bestanden[0]), media_type: 'STORIES' });
  } else if (p.format === 'carousel') {
    const kinderen = [];
    for (const f of p.bestanden) kinderen.push((await api(`${IG}/media`, { image_url: media(f), is_carousel_item: 'true' })).id);
    container = await api(`${IG}/media`, { media_type: 'CAROUSEL', children: kinderen.join(','), caption: p.caption });
  } else if (p.format === 'reel') {
    const params = { media_type: 'REELS', video_url: media(p.bestanden[0]), caption: p.caption, share_to_feed: 'true' };
    if (p.cover) params.cover_url = media(p.cover);
    container = await api(`${IG}/media`, params);
    await wachtTotKlaar(container.id);
  }
  if (p.format === 'carousel' || p.format === 'story') await wachtTotKlaar(container.id, 120);
  const pub = await api(`${IG}/media_publish`, { creation_id: container.id });
  let permalink = '';
  try { permalink = (await api(pub.id, { fields: 'permalink' }, 'GET')).permalink || ''; } catch (e) {}
  return { media_id: pub.id, permalink };
}

// ── Opruimen: media van weken die helemaal klaar en >3 weken oud zijn ────
function opruimen() {
  const grens = Date.now() - 21 * 864e5;
  let weg = 0;
  for (const { dir, plan } of plannen()) {
    const klaar = plan.posts.every(p => staat[p.id] || p.overslaan);
    const laatste = Math.max(...plan.posts.map(p => Date.parse(p.publiceren)));
    if (!klaar || laatste > grens) continue;
    for (const f of fs.readdirSync(dir)) if (/\.(jpe?g|mp4)$/i.test(f)) { fs.rmSync(path.join(dir, f)); weg++; }
  }
  console.log(`Opgeruimd: ${weg} mediabestanden (plannen en overzichten blijven bewaard).`);
}

// ── Hoofdprogramma ─────────────────────────────────────────────────────────
if (args.has('--controleer')) {
  const f = controleer();
  if (f.length) { console.error('Content-plan afgekeurd:\n  ' + f.join('\n  ')); process.exit(1); }
  console.log(`Content-plannen in orde (${plannen().length} week/weken).`);
  process.exit(0);
}
if (args.has('--opruimen')) { opruimen(); process.exit(0); }

if (!DRY && (!TOKEN || !IG)) { console.log('Geen IG_USER_ID / IG_ACCESS_TOKEN ingesteld: niets geplaatst.'); process.exit(0); }

const nu = Date.now();
let geplaatst = 0, fouten = 0;
for (const { week, plan } of plannen()) {
  for (const p of plan.posts) {
    if (staat[p.id] || p.overslaan) continue;
    const t = Date.parse(p.publiceren);
    if (t > nu) continue;
    if (nu - t > MAX_TE_LAAT_UUR * 3600e3) {
      staat[p.id] = { status: 'gemist', gepland: p.publiceren, genoteerd: new Date().toISOString() };
      console.log(`  ⏭  ${p.id}: meer dan ${MAX_TE_LAAT_UUR} uur te laat, overgeslagen`);
      continue;
    }
    console.log(`  → ${p.id} (${p.format}, gepland ${p.publiceren})`);
    try {
      const r = await plaats(week, p);
      if (r.wacht) { console.log(`     wacht: ${r.wacht}`); continue; }
      if (!DRY) staat[p.id] = { status: 'geplaatst', ...r, format: p.format, type: p.type, niveau: p.niveau || null, vak: p.vak || null, gepland: p.publiceren, geplaatst: new Date().toISOString() };
      console.log(`     ✓ geplaatst ${r.permalink || ''}`);
      geplaatst++;
    } catch (e) {
      fouten++;
      console.error(`     ✗ ${e.message}`);
      if (!DRY) {
        const pog = (staat._pogingen ||= {});
        pog[p.id] = (pog[p.id] || 0) + 1;
        if (pog[p.id] >= 3) staat[p.id] = { status: 'mislukt', fout: e.message, gepland: p.publiceren, pogingen: pog[p.id] };
      }
    }
  }
}
if (!DRY) fs.writeFileSync(STAAT, JSON.stringify(staat, null, 2) + '\n');
console.log(`Klaar: ${geplaatst} geplaatst${fouten ? `, ${fouten} fout(en)` : ''}.`);
if (fouten && !geplaatst) process.exit(1);
