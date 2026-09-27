#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// geheugen.mjs · Jarvis onthoudt wat hij voorspelde en welke experimenten liepen
//
// Elke week legt Jarvis een voorspelling vast (uit de prognose) en eventueel een
// experiment (uit zijn analyse). Een week later vult hij de uitkomst in en houdt
// hij bij hoe vaak hij binnen zijn eigen marge zat (kalibratie). Zo wordt zijn
// zekerheid iets dat je kunt controleren, niet iets dat hij beweert.
//
//   node geheugen.mjs --evalueer --stats stats.json [--bestand geheugen.json]
//   node geheugen.mjs --onthoud  --stats stats.json --analyse analyse.json [--bestand …]
// Het bestand staat op de branch 'jarvis-geheugen' (nooit op main).
// ═══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';

const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const BESTAND = opt('--bestand') || 'social/jarvis-geheugen.json';
const leeg = { voorspellingen: [], experimenten: [] };
const G = fs.existsSync(BESTAND) ? JSON.parse(fs.readFileSync(BESTAND, 'utf8')) : structuredClone(leeg);
const S = opt('--stats') ? JSON.parse(fs.readFileSync(opt('--stats'), 'utf8')) : null;
const vandaag = new Date().toISOString().slice(0, 10);

// Betrokken dagbezoeken in de 7 dagen t/m 'datum' (zelfde maat als de prognose).
function weekWaarde(datum) {
  const reeks = S?.app?.dagelijks || [];
  const i = reeks.findIndex(r => r.datum === datum);
  if (i < 6) return null;
  return reeks.slice(i - 6, i + 1).reduce((a, r) => a + r.betrokken, 0);
}

if (args.includes('--evalueer')) {
  let n = 0;
  for (const v of G.voorspellingen) {
    if (v.uitkomst != null || v.voor > vandaag) continue;
    const w = weekWaarde(v.voor); if (w == null) continue;
    v.uitkomst = w; v.raak = w >= v.laag && w <= v.hoog; v.afwijking = w - v.verwacht; n++;
  }
  fs.writeFileSync(BESTAND, JSON.stringify(G, null, 2) + '\n');
  const klaar = G.voorspellingen.filter(v => v.uitkomst != null);
  console.log(`Geëvalueerd: ${n} nieuw. Kalibratie: ${klaar.filter(v => v.raak).length}/${klaar.length} binnen de marge.`);
}

if (args.includes('--onthoud')) {
  const A = opt('--analyse') ? JSON.parse(fs.readFileSync(opt('--analyse'), 'utf8')) : {};
  const p = S?.app?.prognose;
  const voor = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
  if (p && !G.voorspellingen.some(v => v.gedaan === vandaag)) {
    G.voorspellingen.push({ gedaan: vandaag, voor, metriek: 'betrokken dagbezoeken per week', verwacht: p.volgendeWeek.verwacht, laag: p.volgendeWeek.laag, hoog: p.volgendeWeek.hoog, uitkomst: null, raak: null });
  }
  // Experiment: nieuw toevoegen, of de status van een lopend experiment bijwerken.
  for (const e of [].concat(A.experiment || [])) {
    const bestaand = G.experimenten.find(x => x.titel === e.titel);
    if (bestaand) Object.assign(bestaand, e, { bijgewerkt: vandaag });
    else G.experimenten.push({ gestart: vandaag, status: 'loopt', resultaat: null, ...e });
  }
  G.voorspellingen = G.voorspellingen.slice(-52); G.experimenten = G.experimenten.slice(-20);
  fs.writeFileSync(BESTAND, JSON.stringify(G, null, 2) + '\n');
  console.log(`Onthouden: voorspelling voor ${voor}${A.experiment ? ' + experiment' : ''}.`);
}
