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
//   node geheugen.mjs --backlog  [--bestand …]      → open opdrachten voor de bouwer
//
// Backlog: Jarvis zet opdrachten voor de bouwer (Claude) in analyse.opdrachten. Ze
// krijgen een nummer (B-1, B-2, …). Een commit op main met "[B-n]" in het bericht
// sluit de opdracht vanzelf (--evalueer kijkt in git log).
// Het bestand staat op de branch 'jarvis-geheugen' (nooit op main).
// ═══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';

const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const BESTAND = opt('--bestand') || 'social/jarvis-geheugen.json';
const leeg = { voorspellingen: [], experimenten: [], backlog: [] };
const G = fs.existsSync(BESTAND) ? JSON.parse(fs.readFileSync(BESTAND, 'utf8')) : structuredClone(leeg);
const S = opt('--stats') ? JSON.parse(fs.readFileSync(opt('--stats'), 'utf8')) : null;
const vandaag = new Date().toISOString().slice(0, 10);
G.backlog ||= [];
import { execFileSync } from 'node:child_process';
const nrm = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
// Opdrachten afsluiten die in een commit op main genoemd zijn ("[B-12]").
function syncBacklog() {
  let log = '';
  try { log = execFileSync('git', ['log', 'origin/main', '--since=120 days ago', '--format=%h %ad %s', '--date=short'], { encoding: 'utf8' }); } catch (e) { try { log = execFileSync('git', ['log', '--since=120 days ago', '--format=%h %ad %s', '--date=short'], { encoding: 'utf8' }); } catch (_) {} }
  let n = 0;
  for (const regel of log.split('\n')) for (const m of regel.matchAll(/\[(B-\d+)\]/g)) {
    const b = G.backlog.find(x => x.id === m[1]); if (!b || b.status === 'gedaan') continue;
    const [hash, datum] = regel.split(' '); Object.assign(b, { status: 'gedaan', gedaan: datum, commit: hash }); n++;
  }
  return n;
}

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
  const dicht = syncBacklog();
  fs.writeFileSync(BESTAND, JSON.stringify(G, null, 2) + '\n');
  if (dicht) console.log(`Backlog: ${dicht} opdracht(en) afgerond volgens git log.`);
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
  // Opdrachten voor de bouwer: nieuw nummeren, dubbele (zelfde titel, nog open) overslaan.
  let nieuw = 0;
  for (const o of [].concat(A.opdrachten || [])) {
    if (!o?.titel) continue;
    if (G.backlog.some(b => b.status !== 'gedaan' && b.status !== 'vervallen' && nrm(b.titel) === nrm(o.titel))) continue;
    const nr = 1 + G.backlog.reduce((m, b) => Math.max(m, Number(String(b.id).slice(2)) || 0), 0);
    G.backlog.push({ id: 'B-' + nr, gemaakt: vandaag, status: 'open', prioriteit: 2, grootte: 'klein', soort: 'ux', ...o, id: 'B-' + nr }); nieuw++;
  }
  // Statuswijzigingen die Jarvis zelf doorgeeft (bv. vervallen): { id, status, notitie }
  for (const u of [].concat(A.backlogUpdates || [])) { const b = G.backlog.find(x => x.id === u.id); if (b) Object.assign(b, u, { bijgewerkt: vandaag }); }
  if (nieuw) console.log(`Backlog: ${nieuw} nieuwe opdracht(en).`);
  G.voorspellingen = G.voorspellingen.slice(-52); G.experimenten = G.experimenten.slice(-20);
  fs.writeFileSync(BESTAND, JSON.stringify(G, null, 2) + '\n');
  console.log(`Onthouden: voorspelling voor ${voor}${A.experiment ? ' + experiment' : ''}.`);
}

if (args.includes('--backlog')) {
  syncBacklog();
  const open = G.backlog.filter(b => b.status === 'open' || b.status === 'bezig').sort((a, b) => a.prioriteit - b.prioriteit);
  console.log(`${open.length} open opdracht(en) voor de bouwer:`);
  for (const b of open) console.log(`\n[${b.id}] P${b.prioriteit} · ${b.soort} · ${b.grootte} · ${b.titel}\n  waarom: ${b.waarom || '-'}\n  bewijs: ${b.bewijs || '-'}${b.voorstel ? '\n  voorstel: ' + b.voorstel : ''}`);
}
