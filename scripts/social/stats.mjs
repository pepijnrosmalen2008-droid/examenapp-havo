#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// stats.mjs · verzamelt de cijfers voor Jarvis' weekbriefing
//
// Bronnen: Supabase (events + leaderboard, met de publieke sleutel uit
// cloud.js, net als admin.html), Instagram Graph API (als IG_* gezet zijn),
// de content-plannen in social/ en de sitemap. Schrijft
// social/stats/<datum>.json zodat trends over weken zichtbaar worden.
//
//   node scripts/social/stats.mjs            → schrijft social/stats/<vandaag>.json
//   node scripts/social/stats.mjs --stdout   → alleen tonen
// Geen npm-afhankelijkheden.
// ═══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DAG = 864e5, NU = Date.now();
const iso = t => new Date(t).toISOString().slice(0, 10);

// ── Supabase ──────────────────────────────────────────────────────────────
const cloud = fs.readFileSync(path.join(ROOT, 'cloud.js'), 'utf8');
const SB_KEY = process.env.SUPABASE_KEY || cloud.match(/eyJ[\w-]+\.[\w-]+\.[\w-]+/)?.[0];
const SB_URL = (process.env.SUPABASE_URL || cloud.match(/https:\/\/[a-z0-9]+\.supabase\.co/)?.[0]) + '/rest/v1/';

async function haal(tabel, velden, sinds) {
  let uit = [], off = 0;
  for (;;) {
    const r = await fetch(`${SB_URL}${tabel}?select=${velden}&created_at=gte.${new Date(sinds).toISOString()}&order=created_at.asc&limit=1000&offset=${off}`,
      { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY } });
    const j = await r.json();
    if (!Array.isArray(j)) throw new Error(`Supabase ${tabel}: ${JSON.stringify(j).slice(0, 200)}`);
    uit = uit.concat(j); if (j.length < 1000) break; off += 1000;
  }
  return uit;
}

// Eigen/test-apparaten tellen niet mee (anders meet je jezelf). Zet device-id's
// (localStorage 'slagio_did', of de eerste 8 tekens) in social/jarvis-config.json.
const CONFIG_F = path.join(ROOT, 'social/jarvis-config.json');
const CONFIG = fs.existsSync(CONFIG_F) ? JSON.parse(fs.readFileSync(CONFIG_F, 'utf8')) : {};
const UITSLUITEN = (CONFIG.uitsluiten || []).map(String);
const uitgesloten = d => d && UITSLUITEN.some(u => d.startsWith(u));
// 'Passief' = openen, wegklikken, trechter, fouten. Wie alleen dat doet, is geen echte gebruiker (of een bot).
const PASSIEF = new Set(['app_open', 'return_card_shown', 'exit', 'funnel', 'js_error']);
const OEFENEN = new Set(['quiz_completed', 'oud_examen_quiz', 'flashcard', 'proefexamen', 'simulatietoets', 'foutenboek_oefen', 'bot_race', 'multiplayer', 'herhalen_open']);
const FUNCTIES = { quiz_completed: 'Snelle quiz', studieplan_generated: 'Studieplan', oud_examen_quiz: 'Oud-examenquiz', oud_examen_pdf: 'Examenarchief (PDF)',
  foutenboek_open: 'Foutenboek', flashcard: 'Flashcards', proefexamen: 'Proefexamen', simulatietoets: 'Simulatietoets', ai_chat: 'Vraag Vonk (AI)',
  ai_nakijken: 'AI-nakijken', bot_race: 'Race tegen bot', multiplayer: 'Klassenquiz', dagmissie_voltooid: 'Dagmissie' };

function venster(ev, van, tot) { return ev.filter(e => { const t = Date.parse(e.created_at); return t >= van && t < tot; }); }
const did = e => e.meta?.did || null;

function kengetallen(alle, ev, van) {
  const apparaten = new Set(ev.map(did).filter(Boolean));
  const eerste = {}; alle.forEach(e => { const d = did(e); if (d && !(d in eerste)) eerste[d] = Date.parse(e.created_at); });
  const nieuw = [...apparaten].filter(d => eerste[d] >= van).length;
  const quiz = ev.filter(e => e.event_type === 'quiz_completed');
  const pct = quiz.map(e => Number(e.meta?.pct)).filter(n => !isNaN(n));
  const fb = ev.filter(e => e.event_type === 'feedback' && e.meta?.rating);
  const tel = (lijst, key) => { const m = {}; lijst.forEach(x => { const k = key(x); if (k) m[k] = (m[k] || 0) + 1; }); return m; };
  const perApp = {}; ev.forEach(e => { const d = did(e); if (d) perApp[d] = e; });
  const echt = new Set(ev.filter(e => !PASSIEF.has(e.event_type)).map(did).filter(Boolean));
  // Hoe geconcentreerd is het oefenen? (waarschuwing als een paar apparaten alles doen)
  const oefPer = {}; ev.filter(e => OEFENEN.has(e.event_type)).forEach(e => { const d = did(e); if (d) oefPer[d] = (oefPer[d] || 0) + 1; });
  const oefTop = Object.entries(oefPer).sort((a, b) => b[1] - a[1]);
  const oefTot = oefTop.reduce((a, [, n]) => a + n, 0);
  return {
    actief: apparaten.size, betrokken: echt.size, nieuw,
    concentratie: oefTot ? { top2Aandeel: Math.round(((oefTop[0]?.[1] || 0) + (oefTop[1]?.[1] || 0)) / oefTot * 100), top: oefTop.slice(0, 3).map(([d, n]) => ({ apparaat: d.slice(0, 8), n })) } : null,
    opens: ev.filter(e => e.event_type === 'app_open').length,
    oefensessies: ev.filter(e => OEFENEN.has(e.event_type)).length,
    quizzen: quiz.length,
    gemScore: pct.length ? Math.round(pct.reduce((a, b) => a + b, 0) / pct.length) : null,
    fouten: ev.filter(e => e.event_type === 'js_error').length,
    feedback: { aantal: fb.length, gem: fb.length ? +(fb.reduce((a, e) => a + Number(e.meta.rating), 0) / fb.length).toFixed(1) : null },
    niveaus: tel(Object.values(perApp), e => e.niveau),
    apparaten: tel(Object.values(perApp), e => e.meta?.device),
    functies: Object.fromEntries(Object.entries(tel(ev, e => FUNCTIES[e.event_type] || null)).sort((a, b) => b[1] - a[1])),
    vakken: Object.entries(tel(quiz, e => e.vak_naam ? `${e.vak_naam} (${(e.niveau || '').toUpperCase()})` : null))
      .sort((a, b) => b[1] - a[1]).slice(0, 8).map(([naam, n]) => ({ naam, n })),
  };
}

async function supabaseStats() {
  const ev = (await haal('events', 'event_type,created_at,niveau,vak_naam,meta', NU - 63 * DAG)).filter(e => !uitgesloten(did(e)));
  const w0 = venster(ev, NU - 7 * DAG, NU), w1 = venster(ev, NU - 14 * DAG, NU - 7 * DAG);
  const deze = kengetallen(ev, w0, NU - 7 * DAG), vorige = kengetallen(ev, w1, NU - 14 * DAG);
  const d0 = new Set(w0.map(did).filter(Boolean)), d1 = new Set(w1.map(did).filter(Boolean));
  const terug = d1.size ? Math.round([...d1].filter(d => d0.has(d)).length / d1.size * 100) : null;

  const dagelijks = [];
  for (let i = 27; i >= 0; i--) {
    const van = NU - (i + 1) * DAG, tot = NU - i * DAG, s = venster(ev, van, tot);
    dagelijks.push({ datum: iso(tot - 1), actief: new Set(s.map(did).filter(Boolean)).size,
      betrokken: new Set(s.filter(e => !PASSIEF.has(e.event_type)).map(did).filter(Boolean)).size,
      opens: s.filter(e => e.event_type === 'app_open').length, oefensessies: s.filter(e => OEFENEN.has(e.event_type)).length });
  }
  const foutMsg = {};
  w0.filter(e => e.event_type === 'js_error').forEach(e => {
    const m = String(e.meta?.message || 'onbekend').replace(/https?:\/\/slagio\.nl/g, '').slice(0, 110);
    (foutMsg[m] ||= { bericht: m, n: 0, laatst: null, schermen: new Set() });
    foutMsg[m].n++; foutMsg[m].laatst = e.created_at; if (e.meta?.screen) foutMsg[m].schermen.add(e.meta.screen);
  });
  const topFouten = Object.values(foutMsg).sort((a, b) => b.n - a.n).slice(0, 6).map(f => ({ ...f, schermen: [...f.schermen] }));
  // Terugkeer onder échte gebruikers: betrokken vorige week én actief deze week.
  const b1 = new Set(w1.filter(e => !PASSIEF.has(e.event_type)).map(did).filter(Boolean));
  const terugBetrokken = b1.size ? Math.round([...b1].filter(d => d0.has(d)).length / b1.size * 100) : null;
  return { deze, vorige, terugkeer: terug, terugkeerBetrokken: terugBetrokken, uitgesloten: UITSLUITEN.length, dagelijks, topFouten };
}

// ── Instagram ─────────────────────────────────────────────────────────────
async function instagramStats() {
  const TOKEN = process.env.IG_ACCESS_TOKEN, IG = process.env.IG_USER_ID;
  if (!TOKEN || !IG) return { gekoppeld: false };
  const HOST = TOKEN.startsWith('IG') ? 'https://graph.instagram.com' : 'https://graph.facebook.com';
  const get = async (p, q) => { const r = await fetch(`${HOST}/v23.0/${p}?${new URLSearchParams({ ...q, access_token: TOKEN })}`); const j = await r.json(); if (j.error) throw new Error(j.error.message); return j; };
  const uit = { gekoppeld: true };
  try { Object.assign(uit, await get(IG, { fields: 'username,followers_count,media_count' })); } catch (e) { uit.fout = e.message; return uit; }
  const staat = fs.existsSync(path.join(ROOT, 'social/gepubliceerd.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'social/gepubliceerd.json'), 'utf8')) : {};
  uit.posts = [];
  for (const [id, p] of Object.entries(staat)) {
    if (id.startsWith('_') || p.status !== 'geplaatst' || !p.media_id || p.format === 'story') continue;
    if (NU - Date.parse(p.geplaatst) > 42 * DAG) continue;
    const post = { id, format: p.format, type: p.type, vak: p.vak, niveau: p.niveau, geplaatst: p.geplaatst, permalink: p.permalink };
    try {
      const ins = await get(`${p.media_id}/insights`, { metric: 'reach,saved,shares,likes,comments,total_interactions' });
      ins.data.forEach(m => { post[m.name] = m.values?.[0]?.value ?? m.total_value?.value ?? null; });
    } catch (e) { post.fout = e.message; }
    try { const v = await get(`${p.media_id}/insights`, { metric: 'views' }); post.views = v.data?.[0]?.values?.[0]?.value ?? null; } catch (e) {}
    uit.posts.push(post);
  }
  return uit;
}

// ── Content-pijplijn + SEO ────────────────────────────────────────────────
function contentStats() {
  const dir = path.join(ROOT, 'social/weken');
  const staat = fs.existsSync(path.join(ROOT, 'social/gepubliceerd.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'social/gepubliceerd.json'), 'utf8')) : {};
  const posts = [];
  if (fs.existsSync(dir)) for (const w of fs.readdirSync(dir).sort()) {
    const f = path.join(dir, w, 'plan.json'); if (!fs.existsSync(f)) continue;
    for (const p of JSON.parse(fs.readFileSync(f, 'utf8')).posts) posts.push({ week: w, id: p.id, format: p.format, publiceren: p.publiceren, info: p.info, status: p.overslaan ? 'overgeslagen' : staat[p.id]?.status || 'gepland' });
  }
  const telStatus = s => posts.filter(p => p.status === s).length;
  return { gepland: telStatus('gepland'), geplaatst: telStatus('geplaatst'), gemist: telStatus('gemist'), mislukt: telStatus('mislukt'),
    komend: posts.filter(p => p.status === 'gepland' && Date.parse(p.publiceren) > NU).slice(0, 10) };
}
function seoStats() {
  const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return { paginas: (sm.match(/<loc>/g) || []).length, indexnow: fs.readdirSync(ROOT).some(f => /^[0-9a-f]{32}\.txt$/.test(f)) };
}

// ── Samenvoegen ───────────────────────────────────────────────────────────
const stats = { gemeten: new Date(NU).toISOString(), periode: { van: iso(NU - 7 * DAG), tot: iso(NU - DAG) } };
try { stats.app = await supabaseStats(); } catch (e) { stats.app = { fout: e.message }; }
try { stats.instagram = await instagramStats(); } catch (e) { stats.instagram = { gekoppeld: false, fout: e.message }; }
stats.content = contentStats();
stats.seo = seoStats();

const json = JSON.stringify(stats, null, 2) + '\n';
if (process.argv.includes('--stdout')) { process.stdout.write(json); }
else {
  const out = path.join(ROOT, 'social/stats', `${iso(NU)}.json`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, json);
  const a = stats.app;
  console.log(`✓ ${path.relative(ROOT, out)}`);
  if (a.deze) console.log(`  actief ${a.deze.actief} (betrokken ${a.deze.betrokken}; vorige week ${a.vorige.actief}/${a.vorige.betrokken}) · nieuw ${a.deze.nieuw} · oefensessies ${a.deze.oefensessies} · terugkeer ${a.terugkeer}% · fouten ${a.deze.fouten}`);
  console.log(`  instagram: ${stats.instagram.gekoppeld ? `${stats.instagram.followers_count} volgers` : 'niet gekoppeld'} · content: ${stats.content.geplaatst} geplaatst, ${stats.content.gepland} gepland`);
}
