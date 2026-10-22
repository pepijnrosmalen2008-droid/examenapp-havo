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

// ── Prognose: eerlijk teruggetest ─────────────────────────────────────────
// Vier eenvoudige modellen voorspellen elke week uit de weken ervóór. Het model
// dat in die terugtest het minst misging wint, en de marge komt uit zijn échte
// fouten (80%-band), niet uit een aanname. Een rechte lijn door een groeifase
// blijft na een plafond doorstijgen; daarom doet die alleen mee als hij wint.
const MODELLEN = {
  vorige: w => w[w.length - 1],
  mediaan3: w => mediaan(w.slice(-3)),
  gedempt: w => { // Holt met gedempte trend (phi 0,5): trend telt mee, maar dooft snel uit
    let niv = w[0], tr = w.length > 1 ? w[1] - w[0] : 0; const a = .5, b = .3, phi = .5;
    for (let i = 1; i < w.length; i++) { const vn = niv; niv = a * w[i] + (1 - a) * (niv + phi * tr); tr = b * (niv - vn) + (1 - b) * phi * tr; }
    return niv + phi * tr;
  },
  lineair: w => { const n = w.length, mx = (n - 1) / 2, my = w.reduce((x, y) => x + y, 0) / n;
    const h = w.reduce((a, y, i) => a + (i - mx) * (y - my), 0) / (w.reduce((a, _, i) => a + (i - mx) ** 2, 0) || 1); return my + h * (n - mx); },
};
const MODEL_NL = { vorige: 'gelijk aan vorige week', mediaan3: 'mediaan van de laatste 3 weken', gedempt: 'trend die uitdooft', lineair: 'rechte lijn door 8 weken' };
export function prognose(reeks, examenDatum, nu) {
  const weken = [];
  for (let i = reeks.length; i >= 7; i -= 7) weken.unshift(reeks.slice(i - 7, i).reduce((a, r) => a + r.betrokken, 0));
  const w = weken.slice(-10); if (w.length < 4) return null;
  // Terugtest: voorspel week k uit de weken ervóór (min. 3), voor elk model.
  const fouten = Object.fromEntries(Object.keys(MODELLEN).map(m => [m, []]));
  for (let k = 3; k < w.length; k++) for (const [m, f] of Object.entries(MODELLEN)) fouten[m].push(w[k] - f(w.slice(Math.max(0, k - 8), k)));
  // Recente fouten wegen zwaarder (elke week ouder telt 30% minder): na een omslag wint snel het model dat de omslag volgt.
  const gw = (i, n) => Math.pow(.7, n - 1 - i);
  const mae = m => fouten[m].reduce((a, e, i) => a + Math.abs(e) * gw(i, fouten[m].length), 0) / fouten[m].reduce((a, _, i) => a + gw(i, fouten[m].length), 0);
  const beste = Object.keys(MODELLEN).sort((x, y) => mae(x) - mae(y))[0];
  const abs = fouten[beste].map(Math.abs).sort((x, y) => x - y);
  const q80 = abs.length ? abs[Math.min(abs.length - 1, Math.ceil(abs.length * .8) - 1)] : 0;
  const basis = Math.max(0, MODELLEN[beste](w.slice(-8)));
  const marge = Math.max(Math.round(q80), Math.round(basis * .1), 3);
  const n = w.length, mx = (n - 1) / 2, my = w.reduce((a, b) => a + b, 0) / n;
  const hel = w.reduce((a, y, i) => a + (i - mx) * (y - my), 0) / w.reduce((a, _, i) => a + (i - mx) ** 2, 0);
  const sd = Math.sqrt(w.map((y, i) => y - (my + hel * (i - mx))).reduce((a, r) => a + r * r, 0) / Math.max(1, n - 2));
  const raak = fouten[beste].filter(e => Math.abs(e) <= marge).length;
  const vw = Math.round(basis);
  // Over 4 weken: bij een uitdovende trend of een vlak model blijft het niveau; alleen 'lineair' rekent door.
  const over4 = Math.max(0, Math.round(beste === 'lineair' ? my + hel * (n + 3 - mx) : basis));
  return { historie: w.slice(-8), helling: +hel.toFixed(2), spreiding: Math.round(sd), wekenTotExamen: Math.max(0, Math.round((Date.parse(examenDatum) - nu) / (7 * DAG))),
    model: beste, modelUitleg: MODEL_NL[beste],
    terugtest: { weken: fouten[beste].length, gemFout: Math.round(mae(beste)), raak: `${raak} van ${fouten[beste].length}`,
      perModel: Object.fromEntries(Object.keys(MODELLEN).map(m => [m, Math.round(mae(m))])) },
    volgendeWeek: { verwacht: vw, laag: Math.max(0, vw - marge), hoog: vw + marge }, over4Weken: over4 };
}

// ── Terugkeerprofiel: wat deden terugkomers op hun eerste dag anders? ─────
// Voor nieuwe betrokken leerlingen van 8 tot 42 dagen geleden: kwam het apparaat
// binnen 7 dagen op een latere dag terug? Per kenmerk van de eerste dag het
// terugkeerpercentage, zodat zichtbaar wordt wat met terugkomen samengaat.
// Samenhang, geen oorzaak: zeg dat erbij.
export function terugkeerProfiel(ev, nu) {
  const perApp = {};
  for (const e of ev) { const d = did(e); if (!d) continue; (perApp[d] ||= []).push(e); }
  const KENMERK = {
    'quiz afgemaakt': x => x.some(e => e.event_type === 'quiz_completed'),
    '3+ oefensessies': x => x.filter(e => ['quiz_completed', 'flashcard', 'oud_examen_quiz', 'minigame', 'proefexamen'].includes(e.event_type)).length >= 3,
    'studieplan gemaakt': x => x.some(e => e.event_type === 'studieplan_generated'),
    'foutenboek of herhalen': x => x.some(e => /^foutenboek|herhalen/.test(e.event_type)),
    'account aangemaakt': x => x.some(e => e.event_type === 'account_aangemaakt'),
    'maatje gekozen': x => x.some(e => e.event_type === 'maatje_gekozen'),
    'agenda-herinnering': x => x.some(e => e.event_type === 'herinnering_agenda'),
    'Arcade gespeeld': x => x.some(e => e.event_type === 'arcade_open' || e.event_type === 'minigame'),
    'Vonk of zoeken gebruikt': x => x.some(e => /^ai_chat|^vraag_slagio/.test(e.event_type)),
    'mijn stof': x => x.some(e => /^mijnstof/.test(e.event_type)),
    'geïnstalleerde app': x => x.some(e => e.meta?.device === 'mobile-pwa'),
    'via zoekmachine of AI': x => x.some(e => e.event_type === 'app_open' && /google|bing|chatgpt|openai|perplexity|copilot/i.test(String(e.meta?.src || ''))),
  };
  const rijen = [];
  for (const [d, lijst] of Object.entries(perApp)) {
    const betr = lijst.filter(isBetrokken); if (!betr.length) continue;
    const t0 = Date.parse(betr[0].created_at); if (t0 > nu - 8 * DAG || t0 < nu - 42 * DAG) continue;
    const dag0 = iso(t0), eersteDag = lijst.filter(e => iso(Date.parse(e.created_at)) === dag0);
    const terug = lijst.some(e => { const t = Date.parse(e.created_at); return iso(t) !== dag0 && t - t0 <= 7 * DAG && isBetrokken(e); });
    rijen.push({ terug, k: Object.fromEntries(Object.entries(KENMERK).map(([n, f]) => [n, f(eersteDag)])) });
  }
  const n = rijen.length, nTerug = rijen.filter(r => r.terug).length;
  const basis = n ? Math.round(nTerug / n * 100) : null;
  const kenmerken = Object.keys(KENMERK).map(naam => {
    const met = rijen.filter(r => r.k[naam]), zonder = rijen.filter(r => !r.k[naam]);
    const p = l => l.length ? Math.round(l.filter(r => r.terug).length / l.length * 100) : null;
    return { kenmerk: naam, met: met.length, terugMet: p(met), zonder: zonder.length, terugZonder: p(zonder) };
  }).filter(k => k.met >= 3).sort((a, b) => (b.terugMet - b.terugZonder) - (a.terugMet - a.terugZonder));
  return { leerlingen: n, terug: nTerug, basisPct: basis, kenmerken, let_op: 'Samenhang, geen oorzaak. Onder 30 leerlingen per groep is het een aanwijzing.' };
}

// ── Functies per dag: om een piek aan een gebeurtenis te koppelen ─────────
export function functiesPerDag(ev, nu, dagen, functieVan) {
  const uit = {}; const grens = nu - dagen * DAG;
  for (const e of ev) { const t = Date.parse(e.created_at); if (t < grens) continue; const f = functieVan(e); if (!f) continue;
    const d = iso(t); ((uit[d] ||= {})[f] = (uit[d][f] || 0) + 1); }
  return uit;
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
export function signalen({ profiel, deze, vorige, terugkeerBetrokken, afw, trecht, trechtVorige, bron, bronVorige, cohort, prog, concentratie }) {
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
  // Wat samengaat met terugkomen (sterkste verschil, met genoeg leerlingen in beide groepen)
  const top = (profiel?.kenmerken || []).find(k => k.met >= 5 && k.zonder >= 5 && k.terugMet - k.terugZonder >= 10);
  if (top) s.push({ soort: 'goed', titel: `Wie op dag 1 "${top.kenmerk}" doet, komt vaker terug`, bewijs: `${top.terugMet}% van ${top.met} leerlingen met, tegen ${top.terugZonder}% van ${top.zonder} zonder (nieuwe leerlingen van de laatste 6 weken). Samenhang, geen bewezen oorzaak.`, zekerheid: top.met >= 30 ? 'middel' : 'laag (kleine aantallen)' });
  if (prog) s.push({ soort: prog.helling >= 0 ? 'goed' : 'let-op', titel: `Trend: ${prog.helling >= 0 ? '+' : ''}${prog.helling} betrokken dagbezoeken per week`, bewijs: `Betrokken dagbezoeken per week (één leerling op één dag = 1). Verwachting volgende week ${prog.volgendeWeek.verwacht} (80%-band ${prog.volgendeWeek.laag} tot ${prog.volgendeWeek.hoog}), model: ${prog.modelUitleg}; in de terugtest ${prog.terugtest.raak} weken binnen de band, gemiddelde fout ${prog.terugtest.gemFout}.`, zekerheid: prog.terugtest.weken < 4 ? 'laag (korte geschiedenis)' : 'middel' });
  return s;
}
