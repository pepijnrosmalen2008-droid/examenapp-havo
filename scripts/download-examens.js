#!/usr/bin/env node
/**
 * download-examens.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Download alle officiële CE-examens (opgaven + correctievoorschriften)
 * van AlleExamens.nl en sla ze op in de map examens/.
 *
 * Gebruik:
 *   node scripts/download-examens.js
 *   node scripts/download-examens.js --vak bi        # alleen biologie
 *   node scripts/download-examens.js --niveau havo   # alleen HAVO
 *   node scripts/download-examens.js --jaar 2024     # alleen 2024
 *   node scripts/download-examens.js --dry-run       # toon URLs, download niets
 *
 * Output structuur:
 *   examens/havo/bi/2023/I/opgaven.pdf
 *   examens/havo/bi/2023/I/correctievoorschrift.pdf
 *   examens/havo/bi/2023/II/opgaven.pdf
 *   ...
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const url    = require('url');

// ── Config ────────────────────────────────────────────────────────────────────
const OUT_DIR   = path.resolve(__dirname, '..', 'examens');
const DRY_RUN   = process.argv.includes('--dry-run');
const VAK_FILTER   = (process.argv.find(a => a.startsWith('--vak=')) || '').split('=')[1] ||
                     process.argv[process.argv.indexOf('--vak') + 1] || null;
const NIVEAU_FILTER = (process.argv.find(a => a.startsWith('--niveau=')) || '').split('=')[1] ||
                     process.argv[process.argv.indexOf('--niveau') + 1] || null;
const JAAR_FILTER  = parseInt((process.argv.find(a => a.startsWith('--jaar=')) || '').split('=')[1] ||
                     process.argv[process.argv.indexOf('--jaar') + 1]) || null;

// ── Vakdata ───────────────────────────────────────────────────────────────────
const NIVEAUS = ['havo', 'vwo'];
const VAKKEN = {
  havo: {
    nl: 'Nederlands', wa: 'Wiskunde A', wb: 'Wiskunde B',
    bi: 'Biologie',   sk: 'Scheikunde', na: 'Natuurkunde',
    en: 'Engels',     ec: 'Economie',   be: 'Bedrijfseconomie',
    gs: 'Geschiedenis', ak: 'Aardrijkskunde', mw: 'Maatschappijwetenschappen'
  },
  vwo: {
    nl: 'Nederlands', wa: 'Wiskunde A', wb: 'Wiskunde B',
    bi: 'Biologie',   sk: 'Scheikunde', na: 'Natuurkunde',
    en: 'Engels',     ec: 'Economie',   be: 'Bedrijfseconomie',
    gs: 'Geschiedenis', ak: 'Aardrijkskunde', mw: 'Maatschappijwetenschappen',
    du: 'Duits',      fr: 'Frans',      la: 'Latijn',
    gr: 'Grieks',     in: 'Informatica'
  }
};
const JAREN     = [2019, 2021, 2022, 2023, 2024, 2025];
const TIJDVAKKEN = ['I', 'II'];
const TYPES     = ['opgaven', 'correctievoorschrift'];

// ── URL builder ───────────────────────────────────────────────────────────────
function buildUrl(niveau, vakNaam, jaar, tv, type) {
  const enc = encodeURIComponent(vakNaam);
  const niv = niveau.toUpperCase();
  return `https://static.alleexamens.nl/${niv}/${enc}/${jaar}/${tv}/${enc}/${enc}%20${jaar}%20${tv}_${type}.pdf`;
}

function localPath(niveau, vakId, jaar, tv, type) {
  return path.join(OUT_DIR, niveau, vakId, String(jaar), tv, `${type}.pdf`);
}

// ── Downloader ────────────────────────────────────────────────────────────────
function download(srcUrl, destPath) {
  return new Promise((resolve, reject) => {
    // Al aanwezig? Sla over.
    if (fs.existsSync(destPath)) {
      const size = fs.statSync(destPath).size;
      if (size > 1000) { resolve({ skipped: true, size }); return; }
    }
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    const tmpPath = destPath + '.tmp';
    const file    = fs.createWriteStream(tmpPath);

    const get = (u, redirects = 0) => {
      if (redirects > 5) { reject(new Error('Too many redirects')); return; }
      const mod = u.startsWith('https') ? https : http;
      const req = mod.get(u, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SlagioBot/1.0)' }
      }, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          get(res.headers.location, redirects + 1);
          return;
        }
        if (res.statusCode === 404) {
          file.close();
          fs.unlink(tmpPath, () => {});
          resolve({ notFound: true });
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(tmpPath, () => {});
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            fs.renameSync(tmpPath, destPath);
            resolve({ size: fs.statSync(destPath).size });
          });
        });
      });
      req.on('error', err => {
        file.close();
        fs.unlink(tmpPath, () => {});
        reject(err);
      });
      req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
    };
    get(srcUrl);
  });
}

// ── Taken bouwen ──────────────────────────────────────────────────────────────
function buildTasks() {
  const tasks = [];
  for (const niveau of NIVEAUS) {
    if (NIVEAU_FILTER && niveau !== NIVEAU_FILTER) continue;
    for (const [id, naam] of Object.entries(VAKKEN[niveau])) {
      if (VAK_FILTER && id !== VAK_FILTER) continue;
      for (const jaar of JAREN) {
        if (JAAR_FILTER && jaar !== JAAR_FILTER) continue;
        for (const tv of TIJDVAKKEN) {
          for (const type of TYPES) {
            tasks.push({ niveau, id, naam, jaar, tv, type,
              srcUrl:   buildUrl(niveau, naam, jaar, tv, type),
              destPath: localPath(niveau, id, jaar, tv, type)
            });
          }
        }
      }
    }
  }
  return tasks;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const tasks = buildTasks();
  console.log(`\n📥  ${tasks.length} bestanden te controleren`);
  if (VAK_FILTER)    console.log(`   → filter: vak=${VAK_FILTER}`);
  if (NIVEAU_FILTER) console.log(`   → filter: niveau=${NIVEAU_FILTER}`);
  if (JAAR_FILTER)   console.log(`   → filter: jaar=${JAAR_FILTER}`);
  if (DRY_RUN)       console.log('\n🟡  DRY-RUN — geen bestanden worden gedownload\n');

  if (DRY_RUN) {
    tasks.slice(0, 10).forEach(t => console.log(`  ${t.srcUrl}`));
    if (tasks.length > 10) console.log(`  ... en ${tasks.length - 10} meer`);
    return;
  }

  let downloaded = 0, skipped = 0, notFound = 0, errors = 0;
  let totalBytes = 0;

  // Verwerk 4 gelijktijdig
  const CONCURRENCY = 4;
  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(batch.map(t => download(t.srcUrl, t.destPath)));
    results.forEach((res, j) => {
      const t = batch[j];
      if (res.status === 'fulfilled') {
        const r = res.value;
        if (r.skipped)   { skipped++;  }
        else if (r.notFound) { notFound++; }
        else { downloaded++; totalBytes += r.size || 0; }
      } else {
        errors++;
        console.error(`\n  ❌  ${t.niveau}/${t.id}/${t.jaar}/${t.tv}/${t.type}: ${res.reason.message}`);
      }
    });
    const done = Math.min(i + CONCURRENCY, tasks.length);
    process.stdout.write(`\r  ✅ ${done}/${tasks.length} · gedownload: ${downloaded} · overgeslagen: ${skipped} · niet gevonden: ${notFound} · fouten: ${errors}   `);
  }

  const mb = (totalBytes / 1024 / 1024).toFixed(1);
  console.log(`\n\n✅  Klaar!`);
  console.log(`   Gedownload: ${downloaded} bestanden (${mb} MB nieuw)`);
  console.log(`   Al aanwezig: ${skipped}`);
  console.log(`   Niet gevonden: ${notFound}`);
  console.log(`   Fouten: ${errors}`);
  console.log(`   Opgeslagen in: ${OUT_DIR}`);
}

main().catch(err => { console.error('\n❌  Fout:', err); process.exit(1); });
