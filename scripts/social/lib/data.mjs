// ═══════════════════════════════════════════════════════════════════════════
// data.mjs · leest de échte Slagio-content voor social posts
//
// Alles komt uit de app-bestanden zelf, zodat een post altijd klopt met wat een
// leerling in de app ziet: vakken + domeinen (data-*.meta.js), vragen/uitleg/
// begrippen (q/<niveau>-<vak>.js) en het officiële examenrooster (schedule.js).
// ═══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

export const NIVEAUS = {
  havo: { id: 'havo', label: 'HAVO', kleur: '#1d4ed8', varName: 'VAKKEN' },
  vwo:  { id: 'vwo',  label: 'VWO',  kleur: '#6d28d9', varName: 'VAKKEN_VWO' },
  vmbo: { id: 'vmbo', label: 'VMBO', kleur: '#0d9488', varName: 'VAKKEN_VMBO' },
};

const _metaCache = {};
export function vakken(niveau) {
  if (_metaCache[niveau]) return _metaCache[niveau];
  const src = fs.readFileSync(path.join(ROOT, `data-${niveau}.meta.js`), 'utf8');
  const g = {};
  new Function('g', `${src}\n;g.V=${NIVEAUS[niveau].varName};`)(g);
  return (_metaCache[niveau] = g.V);
}

const _qCache = {};
// Geeft { [domeinId]: { sv, oe, begrippen, sam } } voor één vak.
export function vakInhoud(niveau, vakId) {
  const key = niveau + '-' + vakId;
  if (_qCache[key]) return _qCache[key];
  const file = path.join(ROOT, 'q', `${key}.js`);
  if (!fs.existsSync(file)) return (_qCache[key] = {});
  let out = {};
  const __hydrateVak = (_n, _v, data) => { out = data || {}; };
  new Function('__hydrateVak', fs.readFileSync(file, 'utf8'))(__hydrateVak);
  return (_qCache[key] = out);
}

// Het officiële CE-rooster 2027 (letterlijk uit schedule.js gelicht, geen DOM nodig).
let _rooster = null;
export function rooster() {
  if (_rooster) return _rooster;
  const src = fs.readFileSync(path.join(ROOT, 'schedule.js'), 'utf8');
  const start = src.indexOf('const EXAM_SCHEDULE_2027=[');
  let i = src.indexOf('[', start), depth = 0, end = -1;
  for (; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']' && --depth === 0) { end = i; break; }
  }
  _rooster = new Function(`return ${src.slice(src.indexOf('[', start), end + 1)};`)();
  return _rooster;
}

// Eerste centraal examen (met vakId = een vak dat Slagio aanbiedt) per niveau.
export function eersteExamen(niveau) {
  const ids = new Set(vakken(niveau).map(v => v.id));
  return rooster()
    .filter(e => e.niveau === niveau && e.vakId && ids.has(e.vakId))
    .sort((a, b) => (a.datum + a.tijd).localeCompare(b.datum + b.tijd))[0] || null;
}

// ── Kwaliteitsfilters: alleen vragen die los, zonder plaatje, op een slide werken ──
const VERWIJST = /afbeelding|figuur|tabel|grafiek|diagram|bijlage|\bbron\b|hierboven|hieronder|onderstaande|bovenstaande|zie |tekst \d|regel \d|alinea/i;
const VAAG = /alle bovenstaande|geen van (de )?bovenstaande|zowel .* als/i;
// Automatisch gegenereerde begrip-vragen (uit build-questions.js) zijn prima om te
// oefenen, maar saai als 'examenvraag van de week'. Die slaan we over.
// Vragen die op een vorige vraag leunen ("in datzelfde onderzoek") werken niet los.
const CONTEXT = /datzelfde|dezelfde (proef|situatie|tekst|grafiek)|hetzelfde (onderzoek|experiment|voorbeeld)|dit onderzoek|deze proef|dit experiment|in deze situatie|vorige vraag|zie vraag|bovenstaand|de volgende situatie|in het voorbeeld/i;
const SJABLOON = /welk begrip|hoort bij deze omschrijving|herken je hier|welke term|wat is de juiste term|wat betekent het begrip/i;
const SJABLOON_UITLEG = /«|het juiste begrip is|dat past bij/i;

export function geschikteVragen(niveau, vakId) {
  const inh = vakInhoud(niveau, vakId);
  const vak = vakken(niveau).find(v => v.id === vakId);
  const doms = new Map((vak?.domeinen || []).map(d => [d.id, d]));
  const out = [];
  for (const [domId, dom] of Object.entries(inh)) {
    const hoofd = doms.get(domId) || doms.get(domId.replace(/\d+$/, ''));
    (dom.sv || []).forEach((q, idx) => {
      if (!q || !Array.isArray(q.o) || q.o.length !== 4 || typeof q.c !== 'number') return;
      if (!q.u || q.u.length < 12) return;                           // uitleg is verplicht
      if (SJABLOON.test(q.v) || SJABLOON_UITLEG.test(q.u) || CONTEXT.test(q.v)) return;
      if (q.v.length < 28 || q.v.length > 150) return;
      if (VERWIJST.test(q.v) || q.o.some(o => VERWIJST.test(o) || VAAG.test(o))) return;
      if (q.o.some(o => !o || o.length > 58)) return;
      if ((q.d ?? 2) < 2) return;                                    // geen instinkers van niveau 1
      out.push({
        id: `${niveau}:${vakId}:${domId}:sv${idx}`,
        niveau, vakId, domId,
        domeinNaam: hoofd?.naam || '',
        ce: /CE/.test(hoofd?.ceStatus || 'CE'),
        vraag: q.v.trim(), opties: q.o.map(s => s.trim()), juist: q.c,
        uitleg: q.u.trim(), perOptie: Array.isArray(q.uo) ? q.uo : null, moeilijk: q.d ?? 2,
        raw: q,                                                      // origineel app-formaat (voor de video)
      });
    });
  }
  return out;
}

export function geschikteBegrippenSets(niveau, vakId) {
  const inh = vakInhoud(niveau, vakId);
  const vak = vakken(niveau).find(v => v.id === vakId);
  const sets = [];
  for (const dom of vak?.domeinen || []) {
    // begrippen van het domein + zijn leerdoelen (A, A1, A2 …)
    const pool = Object.entries(inh)
      .filter(([id]) => id === dom.id || new RegExp(`^${dom.id}\\d+$`).test(id))
      .flatMap(([, d]) => d.begrippen || [])
      .filter(b => b && b.t && b.d && b.t.length <= 28 && b.d.length >= 22 && b.d.length <= 115 && !VERWIJST.test(b.d));
    const uniek = [...new Map(pool.map(b => [b.t.toLowerCase(), b])).values()];
    if (uniek.length >= 5) sets.push({
      id: `${niveau}:${vakId}:${dom.id}:beg`, niveau, vakId, domId: dom.id,
      domeinNaam: dom.naam, ce: /CE/.test(dom.ceStatus || ''), begrippen: uniek,
    });
  }
  return sets;
}

// Deterministische pseudo-random op basis van een seed-string (zelfde week = zelfde keuze).
export function rng(seed) {
  let h = 2166136261;
  for (const c of String(seed)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1e9) / 1e9; };
}
export const kies = (r, arr) => arr[Math.floor(r() * arr.length)];
export function schud(r, arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
