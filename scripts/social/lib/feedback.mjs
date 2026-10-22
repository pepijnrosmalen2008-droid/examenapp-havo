// ═══════════════════════════════════════════════════════════════════════════
// feedback.mjs · wat leerlingen Slagio vertellen, direct en indirect
//
//   gemeld       vragen die leerlingen als fout meldden (vraag_fout), met het
//                antwoord dat in de data staat, zodat Jarvis het kan controleren
//   verdacht     vragen die bijna iedereen fout heeft (uit vq/fq van quiz_completed):
//                mogelijk een fout antwoord in de data, of een te vage vraag
//   zoekvragen   wat leerlingen in Vraag het Slagio typen, en wat niets opleverde
//                (echte vraag naar stof die er niet is)
//   domeinen     gemiddelde quizscore per vak en domein: waar het moeilijk is
//   beoordeling  sterren per functie en domein
//   afhakers     waar leerlingen een quiz afbreken
// Pure functies op de events; de vraagteksten komen uit de app-data (q/*.js).
// ═══════════════════════════════════════════════════════════════════════════
import { NIVEAUS, vakken, vakInhoud } from './data.mjs';

// Zelfde hash als _qHash in cloud.js (vraagtekst → korte code).
export const qHash = s => { s = String(s || ''); let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
const nrm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

let _index = null;
// hash → { niveau, vak, domein, v, juist, uitleg } voor alle meerkeuzevragen
export function vraagIndex() {
  if (_index) return _index;
  _index = new Map();
  for (const n of Object.keys(NIVEAUS)) for (const v of vakken(n)) {
    for (const [dom, d] of Object.entries(vakInhoud(n, v.id))) for (const q of d.sv || []) {
      const o = q.o || q.a; if (!q.v || !Array.isArray(o)) continue;
      const h = qHash(q.v); if (!_index.has(h)) _index.set(h, { niveau: n, vak: v.id, vakNaam: v.naam, domein: dom, v: String(q.v).slice(0, 220), opties: o, juist: o[q.c], uitleg: String(q.u || '').slice(0, 220) });
    }
  }
  return _index;
}
function zoekOpTekst(tekst) {
  const t = nrm(tekst).slice(0, 80); if (!t) return null;
  for (const x of vraagIndex().values()) if (nrm(x.v).startsWith(t.slice(0, 60))) return x;
  return null;
}

export function feedback(ev, { van, tot } = {}) {
  const inV = e => { const t = Date.parse(e.created_at); return (!van || t >= van) && (!tot || t < tot); };
  const did = e => e.meta?.did || null;
  const E = ev.filter(inV);

  // ── Gemelde vragen ──
  const gm = {};
  E.filter(e => e.event_type === 'vraag_fout').forEach(e => {
    const k = nrm(e.meta?.vraag).slice(0, 90); if (!k) return;
    (gm[k] ||= { vraag: String(e.meta?.vraag || '').slice(0, 220), vak: e.vak_naam, niveau: e.niveau, domein: e.meta?.domein || e.meta?.domein_id, juistVolgensMelding: e.meta?.correct, n: 0, apparaten: new Set() });
    gm[k].n++; if (did(e)) gm[k].apparaten.add(did(e));
  });
  const gemeld = Object.values(gm).sort((a, b) => b.n - a.n).slice(0, 15).map(g => {
    const x = zoekOpTekst(g.vraag);
    return { ...g, apparaten: g.apparaten.size, gevonden: x ? { niveau: x.niveau, vak: x.vak, domein: x.domein, opties: x.opties, juist: x.juist, uitleg: x.uitleg } : null };
  });

  // ── Verdachte vragen: bijna iedereen fout ──
  const per = {};
  E.filter(e => e.event_type === 'quiz_completed' && e.meta?.vq).forEach(e => {
    const fout = new Set(String(e.meta.fq || '').split(',').filter(Boolean));
    String(e.meta.vq).split(',').filter(Boolean).forEach(h => { (per[h] ||= { n: 0, fout: 0, app: new Set() }); per[h].n++; if (fout.has(h)) per[h].fout++; if (did(e)) per[h].app.add(did(e)); });
  });
  const idx = vraagIndex();
  const metData = Object.entries(per).filter(([, s]) => s.app.size >= 4);
  const verdacht = metData.filter(([, s]) => s.fout / s.n >= .75)
    .sort((a, b) => b[1].fout / b[1].n - a[1].fout / a[1].n || b[1].n - a[1].n).slice(0, 12)
    .map(([h, s]) => ({ hash: h, gesteld: s.n, leerlingen: s.app.size, foutPct: Math.round(s.fout / s.n * 100), vraag: idx.get(h) || null }));
  const vraagMeting = { vragenMetGenoegData: metData.length, gesteldTotaal: Object.values(per).reduce((a, s) => a + s.n, 0) };

  // ── Zoekvragen ──
  const zv = {};
  E.filter(e => e.event_type === 'vraag_slagio' && e.meta?.q).forEach(e => {
    const k = nrm(e.meta.q); if (k.length < 3) return;
    (zv[k] ||= { q: String(e.meta.q).slice(0, 120), n: 0, gevonden: 0, app: new Set() }); zv[k].n++; if (e.meta.gevonden) zv[k].gevonden++; if (did(e)) zv[k].app.add(did(e));
  });
  // Typen gaat letter voor letter: houd alleen de langste variant van een prefix-reeks per apparaat.
  const sleutels = Object.keys(zv).sort((a, b) => b.length - a.length), houd = [];
  for (const k of sleutels) if (!houd.some(h => h.startsWith(k))) houd.push(k);
  const zoek = houd.map(k => ({ ...zv[k], app: zv[k].app.size }));
  const zoekvragen = { totaal: zoek.reduce((a, z) => a + z.n, 0), zonderAntwoord: zoek.filter(z => !z.gevonden).sort((a, b) => b.app - a.app || b.n - a.n).slice(0, 15), populair: zoek.filter(z => z.gevonden).sort((a, b) => b.app - a.app).slice(0, 10),
    aiVragen: E.filter(e => e.event_type === 'vraag_slagio_ai').map(e => String(e.meta?.q || '').slice(0, 120)).filter(Boolean).slice(-15) };

  // ── Domeinscores ──
  const ds = {};
  E.filter(e => e.event_type === 'quiz_completed' && e.meta?.vak_id && e.meta?.domein_id && e.meta?.mode === 'snel' && !/^(fb|foutenboek|mijnstof|slim)$/i.test(e.meta.vak_id) && e.meta.domein_id !== 'FB').forEach(e => {
    const k = `${e.niveau}|${e.meta.vak_id}|${e.meta.domein_id}`; (ds[k] ||= { niveau: e.niveau, vak: e.meta.vak || e.vak_naam, vakId: e.meta.vak_id, domein: e.meta.domein_id, n: 0, som: 0, app: new Set() });
    ds[k].n++; ds[k].som += Number(e.meta.pct) || 0; if (did(e)) ds[k].app.add(did(e));
  });
  const domeinen = Object.values(ds).map(d => ({ ...d, app: d.app.size, gem: Math.round(d.som / d.n), som: undefined })).filter(d => d.n >= 3).sort((a, b) => a.gem - b.gem);

  // ── Beoordelingen ──
  const fb = E.filter(e => e.event_type === 'feedback' && e.meta?.rating);
  const perF = {}; fb.forEach(e => { const k = `${e.meta.feature || '?'}${e.meta.domein ? ' · ' + e.meta.domein : ''}`; (perF[k] ||= []).push(Number(e.meta.rating)); });
  const beoordeling = { aantal: fb.length, gem: fb.length ? +(fb.reduce((a, e) => a + Number(e.meta.rating), 0) / fb.length).toFixed(1) : null,
    laag: Object.entries(perF).map(([k, r]) => ({ waar: k, n: r.length, gem: +(r.reduce((a, b) => a + b, 0) / r.length).toFixed(1) })).filter(x => x.gem <= 3).slice(0, 8),
    teksten: fb.map(e => e.meta.tekst || e.meta.text || e.meta.opmerking).filter(Boolean).map(t => String(t).slice(0, 200)).slice(-10) };

  // ── Afhakers ──
  const ab = E.filter(e => e.event_type === 'quiz_abandoned');
  const afhakers = { aantal: ab.length, voltooid: E.filter(e => e.event_type === 'quiz_completed').length,
    bijVraag: ab.reduce((m, e) => { const k = Number(e.meta?.gestopt_bij); if (!isNaN(k)) m[k] = (m[k] || 0) + 1; return m; }, {}),
    perVak: Object.entries(ab.reduce((m, e) => { const k = e.meta?.vak || e.vak_naam || '?'; m[k] = (m[k] || 0) + 1; return m; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6) };

  return { gemeld, verdacht, vraagMeting, zoekvragen, domeinen: { moeilijkst: domeinen.slice(0, 8), makkelijkst: domeinen.slice(-4).reverse() }, beoordeling, afhakers };
}
