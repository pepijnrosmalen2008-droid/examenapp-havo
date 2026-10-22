#!/usr/bin/env node
// Toont de open opdrachten van Jarvis voor de bouwer (Claude).
// Haalt de nieuwste backlog van de branch jarvis-geheugen en sluit opdrachten
// die al in een commit op main staan ("[B-12]").
//   node scripts/social/backlog.mjs           → open opdrachten
//   node scripts/social/backlog.mjs --alles   → ook afgeronde
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
try { git('fetch', '-q', 'origin', 'jarvis-geheugen', 'main'); } catch (e) {}
let G;
try { G = JSON.parse(git('show', 'origin/jarvis-geheugen:social/jarvis-geheugen.json')); } catch (e) { console.log('Geen backlog gevonden (branch jarvis-geheugen ontbreekt).'); process.exit(0); }
const B = G.backlog || [];
let log = ''; try { log = git('log', 'origin/main', '--since=120 days ago', '--format=%h %ad %s', '--date=short'); } catch (e) {}
for (const regel of log.split('\n')) for (const m of regel.matchAll(/\[(B-\d+)\]/g)) { const b = B.find(x => x.id === m[1]); if (b && b.status !== 'gedaan') Object.assign(b, { status: 'gedaan', gedaan: regel.split(' ')[1], commit: regel.split(' ')[0] }); }
const alles = process.argv.includes('--alles');
const lijst = B.filter(b => alles || b.status === 'open' || b.status === 'bezig').sort((a, b) => (a.status === 'gedaan') - (b.status === 'gedaan') || a.prioriteit - b.prioriteit);
console.log(`Backlog van Jarvis: ${B.filter(b => b.status === 'open' || b.status === 'bezig').length} open, ${B.filter(b => b.status === 'gedaan').length} gedaan.\n`);
for (const b of lijst) console.log(`[${b.id}] P${b.prioriteit} · ${b.soort} · ${b.grootte}${b.status === 'gedaan' ? ` · gedaan ${b.gedaan} (${b.commit})` : ''}\n  ${b.titel}\n  waarom: ${b.waarom || '-'}\n  bewijs: ${b.bewijs || '-'}${b.voorstel ? '\n  voorstel: ' + b.voorstel : ''}\n`);
if (!lijst.length) console.log('Niets open.');
console.log('Afronden: zet "[B-n]" in het commitbericht op main.');
