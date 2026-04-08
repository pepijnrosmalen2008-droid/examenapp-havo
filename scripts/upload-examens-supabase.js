#!/usr/bin/env node
/**
 * upload-examens-supabase.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Upload alle gedownloade examens uit examens/ naar een Supabase Storage bucket.
 *
 * Vereisten:
 *   1. Maak in Supabase dashboard een public bucket "examens"
 *   2. Stel de omgevingsvariabelen in:
 *        SUPABASE_URL=https://xxxx.supabase.co
 *        SUPABASE_SERVICE_KEY=eyJh...  (service_role key, NIET anon key)
 *
 * Gebruik:
 *   node scripts/upload-examens-supabase.js
 *   node scripts/upload-examens-supabase.js --vak bi
 *   node scripts/upload-examens-supabase.js --dry-run
 *
 * Na uploaden: de publieke URL van elk bestand is:
 *   {SUPABASE_URL}/storage/v1/object/public/examens/{niveau}/{id}/{jaar}/{tv}/{type}.pdf
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const https = require('https');
const url   = require('url');

const SUPABASE_URL  = process.env.SUPABASE_URL;
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_KEY;
const BUCKET        = 'examens';
const EXAMENS_DIR   = path.resolve(__dirname, '..', 'examens');
const DRY_RUN       = process.argv.includes('--dry-run');
const VAK_FILTER    = (process.argv.find(a => a.startsWith('--vak=')) || '').split('=')[1] ||
                      process.argv[process.argv.indexOf('--vak') + 1] || null;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Stel SUPABASE_URL en SUPABASE_SERVICE_KEY in als omgevingsvariabelen.');
  console.error('    De service_role key vind je in: Supabase dashboard → Settings → API');
  process.exit(1);
}

// ── Upload één bestand ────────────────────────────────────────────────────────
function uploadFile(localPath, storagePath) {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(localPath);
    const uploadUrl  = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`;
    const parsed     = new url.URL(uploadUrl);

    const req = https.request({
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/pdf',
        'Content-Length': fileBuffer.length,
        'x-upsert': 'true'   // overschrijf als al bestaat
      }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve({ ok: true });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 120)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(fileBuffer);
    req.end();
  });
}

// ── Alle lokale PDF's ophalen ─────────────────────────────────────────────────
function collectFiles(dir, base = '') {
  const result = [];
  if (!fs.existsSync(dir)) return result;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full    = path.join(dir, entry.name);
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      result.push(...collectFiles(full, relPath));
    } else if (entry.name.endsWith('.pdf')) {
      result.push({ localPath: full, storagePath: relPath });
    }
  }
  return result;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  let files = collectFiles(EXAMENS_DIR);
  if (VAK_FILTER) {
    files = files.filter(f => f.storagePath.split('/')[1] === VAK_FILTER);
    console.log(`   → filter: vak=${VAK_FILTER} → ${files.length} bestanden`);
  }

  console.log(`\n☁️   ${files.length} PDF's uploaden naar Supabase bucket "${BUCKET}"`);
  console.log(`   Endpoint: ${SUPABASE_URL}\n`);

  if (DRY_RUN) {
    files.slice(0, 10).forEach(f => console.log(`  ${f.storagePath}`));
    if (files.length > 10) console.log(`  ... en ${files.length - 10} meer`);
    return;
  }

  let ok = 0, errors = 0;
  const CONCURRENCY = 3;

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(f => uploadFile(f.localPath, f.storagePath))
    );
    results.forEach((res, j) => {
      if (res.status === 'fulfilled') { ok++; }
      else {
        errors++;
        console.error(`\n  ❌  ${batch[j].storagePath}: ${res.reason.message}`);
      }
    });
    process.stdout.write(`\r  ☁️  ${Math.min(i + CONCURRENCY, files.length)}/${files.length} · ok: ${ok} · fouten: ${errors}   `);
  }

  const baseUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;
  console.log(`\n\n✅  Klaar! ${ok} bestanden geüpload, ${errors} fouten.`);
  console.log(`\n📋  Publieke URL-basis: ${baseUrl}`);
  console.log(`   Voorbeeld: ${baseUrl}/havo/bi/2023/I/opgaven.pdf`);
  console.log(`\n➡️  Voeg nu deze regel toe aan je .env of stel in als omgevingsvariabele:`);
  console.log(`   EXAMENS_BASE_URL=${baseUrl}`);
}

main().catch(err => { console.error('\n❌  Fout:', err); process.exit(1); });
