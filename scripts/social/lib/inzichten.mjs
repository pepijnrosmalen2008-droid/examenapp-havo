// ═══════════════════════════════════════════════════════════════════════════
// inzichten.mjs · Jarvis' analytisch brein (pure functies op de events)
//
//   afwijkingen   robuuste detectie (mediaan + MAD) op dagreeksen
//   trechter      binnenkomst → interactie → niveau → home → actie, per week
//   cohorten      retentie per instroomweek (van betrokken nieuwe apparaten)
//   herkomst      waar bezoekers vandaan komen (Google, ChatGPT, Instagram …)
//   prognose      trend + verwachting richting de examendatum, met onzekerheid
//   signalen      alles hierboven vertaald naar concrete, onderbouwde signalen
// Alles deterministisch en uitlegbaar: elk signaal draagt zijn bewijs mee.
// ═══════════════════════════════════════════════════════════════════════════

const DAG = 864e5;
export const PASSIEF = new Set(['app_open', 'return_card_shown', 'exit', 'funnel', 'js_error']);
export const did = e => e.meta?.did || null;
// Betrokken = deed iets echts: elke niet-passieve gebeurtenis, of de trechterstap
// 'action' (eerste echte actie, ook als die actie zelf geen eigen event heeft).
export const isBetrokken = e => !PASSIEF.has(e.event_type) || (e.event_type === 'funnel' && e.meta?.step === 'action');
const iso = t => new Date(t).toISOString().slice(0, 10);
const MND = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
export const kortNL = d => { const x = new Date(d + 'T12:00:00Z'); return `${x.getUTCDate()} ${MND[x.getUTCMonth()]}`; };
const mediaan = a => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length ? (s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) : 0; };

// ── Dagreeksen ───────────────────────────────────────────────────────────
export function dagreeks(ev, nu, dagen) {
  const buckets = new Map();
  for (let i = dagen - 1; i >= 0; i--) buckets.set(iso(nu - i * DAG - 1), { actief: new Set(), betrokken: new Set(), opens: 0, oefensessies: 0, nieuw: 0 });
  const OEF = new Set(['quiz_completed', 'oud_examen_quiz', 'flashcard', 'proefexamen', 'simulatietoets', 'foutenboek_oefen', 'bot_race', 'multiplayer', 'herhalen_open']);
  const eerste = {};
  ev.forEach(e => { const d = did(e); if (d && !(d in eerste)) eerste[d] = iso(Date.parse(e.created_at)); });
  ev.forEach(e => {
    const b = buckets.get(iso(Date.parse(e.created_at))); if (!b) return;
    const d = did(e); if (d) { b.actief.add(d); if (isBetrokken(e)) b.betrokken.add(d); }
    if (e.event_type === 'app_open') b.opens++;
    if (OEF.has(e.event_type)) b.oefensessies++;
  });
  const nieuwPerDag = {}; Object.values(eerste).forEach(dg => { nieuwPerDag[dg] = (nieuwPerDag[dg] || 0) + 1; });
  return [...buckets].map(([datum, b]) => ({ datum, actief: b.actief.size, betrokken: b.betrokken.size, opens: b.opens, oefensessies: b.oefensessies, nieuw: nieuwPerDag[datum] || 0 }));
}

// ── Afwijkingen: waarde t.o.v. mediaan van de 21 dagen ervoor ────────────
export function afwijkingen(reeks, veld, drempel = 3.5) {
  const uit = [];
  for (let i = 14; i < reeks.length; i++) {
    const venster = reeks.slice(Math.max(0, i - 21), i).map(r => r[veld]);
    const med = mediaan(venster), mad = mediaan(venster.map(v => Math.abs(v - med))) || 1;
    const z = 0.6745 * (reeks[i][veld] - med) / mad;
    if (Math.abs(z) >= drempel && Math.abs(reeks[i][veld] - med) >= 4)
      uit.push({ datum: reeks[i].datum, veld, waarde: reeks[i][veld], normaal: Math.round(med), richting: z > 0 ? 'piek' : 'dal', sterkte: +Math.abs(z).toFixed(1) });
  }
  return uit;
}

// ── Trechter: echte doorstroom per apparaat (doorsneden, dus nooit > 100%) ──
// Terugkerende bezoekers slaan 'welcome' en 'level' over (niveau al gekozen), dus
// twee paden: alle echte bezoekers (basis = interactie) en alleen nieuwe bezoekers.
const STAPPEN = ['welcome', 'interact', 'level', 'home', 'action'];
export function trechter(ev, van, tot) {
  const per = Object.fromEntries(STAPPEN.map(s => [s, new Set()]));
  ev.forEach(e => { if (e.event_type !== 'funnel') return; const t = Date.parse(e.created_at); if (t < van || t >= tot) return;
    const s = e.meta?.step; const d = did(e); if (per[s] && d) per[s].add(d); });
  const doorsnede = (a, b) => [...a].filter(x => b.has(x)).length;
  const basis = per.interact.size, nieuw = per.welcome.size;
  const pct = (a, b) => (b ? Math.round(a / b * 100) : null);
  return {
    basis, nieuw,
    stappen: [
      { stap: 'Echte bezoeker', n: basis },
      { stap: 'Op het startscherm', n: doorsnede(per.interact, per.home) },
      { stap: 'Iets gedaan', n: doorsnede(per.interact, per.action) },
    ],
    conversie: basis ? { home: pct(doorsnede(per.interact, per.home), basis), action: pct(doorsnede(per.interact, per.action), basis) } : null,
    nieuwPad: nieuw ? { niveau: pct(doorsnede(per.welcome, per.level), nieuw), action: pct(doorsnede(per.welcome, per.action), nieuw) } : null,
  };
}

// ── Cohorten: nieuwe betrokken apparaten per week, en of ze terugkwamen ──
export function cohorten(ev, nu, weken = 8) {
  const start = nu - weken * 7 * DAG;
  const eersteBetrokken = {}, actiefWeken = {};
  ev.forEach(e => {
    const d = did(e); if (!d) return; const t = Date.parse(e.created_at);
    if (isBetrokken(e) && !(d in eersteBetrokken)) eersteBetrokken[d] = t;
    const w = Math.floor((nu - t) / (7 * DAG)); (actiefWeken[d] ||= new Set()).add(w);
  });
  const rijen = [];
  for (let w = weken - 1; w >= 0; w--) {
    const van = nu - (w + 1) * 7 * DAG, tot = nu - w * 7 * DAG;
    const leden = Object.entries(eersteBetrokken).filter(([, t]) => t >= van && t < tot && t >= start).map(([d]) => d);
    const rij = { week: iso(van), omvang: leden.length, retentie: [] };
    for (let k = 1; k <= w; k++) rij.retentie.push(leden.length ? Math.round(leden.filter(d => actiefWeken[d]?.has(w - k)).length / leden.length * 100) : null);
    rijen.push(rij);
  }
  return rijen;
}

// ── Herkomst ──────────────────────────────────────────────────────────────
const BRON = s => {
  const x = String(s || '').toLowerCase();
  if (/chatgpt|openai/.test(x)) return 'ChatGPT';
  if (/perplexity|claude|copilot|gemini/.test(x)) return 'Andere AI';
  if (/google/.test(x)) return 'Google';
  if (/bing|yahoo|duckduckgo|ecosia/.test(x)) return 'Bing & co';
  if (/^ig$|instagram/.test(x)) return 'Instagram';
  if (/tiktok/.test(x)) return 'TikTok';
  if (/facebook|fb/.test(x)) return 'Facebook';
  if (/slagio/.test(x)) return 'Eigen pagina\'s';
  if (!x || x === 'direct' || x === '-') return 'Direct';
  return 'Overig';
};
export function herkomst(ev, van, tot) {
  const m = {};
  ev.forEach(e => { if (e.event_type !== 'app_open') return; const t = Date.parse(e.created_at); if (t < van || t >= tot) return; const b = BRON(e.meta?.src); m[b] = (m[b] || 0) + 1; });
  return Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1]));
}

// ── Prognose: lineaire trend op wekelijkse betrokkenen, met onzekerheidsband ──
export function prognose(reeks, examenDatum, nu) {
  // Weektotalen (som van dagelijkse betrokkenen ≈ betrokken bezoeken per week)
  const weken = [];
  for (let i = reeks.length; i >= 7; i -= 7) weken.unshift(reeks.slice(i - 7, i).reduce((a, r) => a + r.betrokken, 0));
  const w = weken.slice(-8); if (w.length < 4) return null;
  const n = w.length, xs = w.map((_, i) => i), mx = (n - 1) / 2, my = w.reduce((a, b) => a + b, 0) / n;
  const hel = xs.reduce((a, x, i) => a + (x - mx) * (w[i] - my), 0) / xs.reduce((a, x) => a + (x - mx) ** 2, 0);
  const res = w.map((y, i) => y - (my + hel * (i - mx)));
  const sd = Math.sqrt(res.reduce((a, r) => a + r * r, 0) / Math.max(1, n - 2));
  const wekenTotExamen = Math.max(0, Math.round((Date.parse(examenDatum) - nu) / (7 * DAG)));
  const voorspel = k => Math.max(0, Math.round(my + hel * (n - 1 + k - mx)));
  return { historie: w, helling: +hel.toFixed(2), spreiding: Math.round(sd), wekenTotExamen,
    volgendeWeek: { verwacht: voorspel(1), laag: Math.max(0, voorspel(1) - Math.round(sd)), hoog: voorspel(1) + Math.round(sd) },
    over4Weken: voorspel(4) };
}

// ── Seizoen: waar staan we in het examenjaar? ─────────────────────────────
export function seizoen(nu, examenDatum) {
  const dagen = Math.round((Date.parse(examenDatum) - nu) / DAG);
  const fase = dagen > 180 ? 'Opbouw: leerlingen zijn nog niet met het examen bezig. Groei komt nu vooral via zoekverkeer en docenten.'
    : dagen > 90 ? 'Voorbereiding: toetsweken en SE\'s. Leerlingen zoeken gericht per vak.'
    : dagen > 30 ? 'Aanloop naar het CE: de zoekvraag stijgt snel. Dit is het moment om zichtbaar te zijn.'
    : dagen >= 0 ? 'Examensprint: maximale vraag, elke dag telt.' : 'Na het examen: rustige periode, focus op volgend jaar.';
  return { dagenTotCE: dagen, fase };
}

// ── Signalen: onderbouwde observaties voor de briefing ────────────────────
export function signalen({ deze, vorige, terugkeerBetrokken, afw, trecht, trechtVorige, bron, bronVorige, cohort, prog, concentratie }) {
  const s = [];
  const pct = (a, b) => b ? Math.round((a - b) / b * 100) : null;
  const dB = pct(deze.betrokken, vorige.betrokken);
  if (dB != null && Math.abs(dB) >= 20) s.push({ soort: dB > 0 ? 'goed' : 'let-op', titel: `Betrokken leerlingen ${dB > 0 ? '+' : ''}${dB}%`, bewijs: `${deze.betrokken} deze week tegen ${vorige.betrokken} vorige week.`, zekerheid: deze.betrokken + vorige.betrokken >= 30 ? 'hoog' : 'laag (kleine aantallen)' });
  if (concentratie?.vorige >= 50) s.push({ soort: 'let-op', titel: 'Een paar apparaten domineerden vorige week', bewijs: `${concentratie.vorige}% van het oefenen kwam van twee apparaten. Vergelijkingen met vorige week zijn daardoor scheef.`, zekerheid: 'hoog' });
  // Alleen afwijkingen van de laatste 14 dagen; per dag de sterkste.
  const grens = iso(Date.now() - 14 * DAG), perDag = {};
  afw.filter(a => a.datum >= grens).forEach(a => { if (!perDag[a.datum] || a.sterkte > perDag[a.datum].sterkte) perDag[a.datum] = a; });
  Object.values(perDag).slice(-2).forEach(a => s.push({ soort: a.richting === 'piek' ? 'goed' : 'let-op', titel: `${a.richting === 'piek' ? 'Piek' : 'Dal'} op ${kortNL(a.datum)}`, bewijs: `${a.waarde} ${a.veld === 'actief' ? 'bezoekers' : 'betrokken leerlingen'}, normaal rond ${a.normaal} (${a.sterkte}× de gebruikelijke spreiding).`, zekerheid: 'hoog' }));
  if (trecht?.conversie) {
    const c = trecht.conversie;
    s.push({ soort: c.action < 40 ? 'actie' : c.action < 60 ? 'let-op' : 'goed', titel: `${c.action}% van de echte bezoekers gaat iets doen`,
      bewijs: `Van ${trecht.basis} bezoekers die echt interacteerden, kwam ${c.home}% op het startscherm en ${c.action}% tot een eerste actie.${trechtVorige?.conversie ? ` Vorige week: ${trechtVorige.conversie.action}%.` : ''}${trecht.nieuwPad ? ` Nieuwe bezoekers: ${trecht.nieuwPad.niveau}% kiest een niveau.` : ''}`,
      zekerheid: trecht.basis >= 30 ? 'hoog' : 'laag (kleine aantallen)' });
  }
  const ai = (bron['ChatGPT'] || 0) + (bron['Andere AI'] || 0), goog = bron['Google'] || 0;
  if (ai > goog && ai >= 5) s.push({ soort: 'goed', titel: 'AI-zoekmachines sturen meer bezoekers dan Google', bewijs: `${ai} bezoeken via ChatGPT en andere AI, ${goog} via Google. llms.txt en de vakpagina's werken.`, zekerheid: 'hoog' });
  if (terugkeerBetrokken != null && terugkeerBetrokken < 25) s.push({ soort: 'actie', titel: `Terugkeer ${terugkeerBetrokken}%`, bewijs: 'Van de leerlingen die vorige week oefenden, kwam minder dan een kwart terug.', zekerheid: vorige.betrokken >= 15 ? 'hoog' : 'laag (kleine aantallen)' });
  const recent = cohort.filter(c => c.omvang >= 5 && c.retentie.length);
  if (recent.length) { const gem = Math.round(recent.reduce((a, c) => a + c.retentie[0], 0) / recent.length);
    s.push({ soort: gem < 20 ? 'let-op' : 'goed', titel: `Gemiddeld ${gem}% komt een week later terug`, bewijs: `Over ${recent.length} instroomweken met minstens 5 nieuwe leerlingen.`, zekerheid: recent.length >= 4 ? 'hoog' : 'middel' }); }
  if (prog) s.push({ soort: prog.helling >= 0 ? 'goed' : 'let-op', titel: `Trend: ${prog.helling >= 0 ? '+' : ''}${prog.helling} betrokken dagbezoeken per week`, bewijs: `Betrokken dagbezoeken per week (één leerling op één dag = 1), over de laatste ${prog.historie.length} weken. Verwachting volgende week ${prog.volgendeWeek.verwacht} (tussen ${prog.volgendeWeek.laag} en ${prog.volgendeWeek.hoog}).`, zekerheid: prog.spreiding > prog.volgendeWeek.verwacht * 0.5 ? 'laag (veel schommeling)' : 'middel' });
  return s;
}
