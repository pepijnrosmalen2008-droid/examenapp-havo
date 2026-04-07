#!/usr/bin/env node
/**
 * generate-explanations.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Leest alle meerkeuzevragen uit index.html, genereert uitleg via de Anthropic
 * API en schrijft de 'u' (uitleg) velden terug naar het HTML-bestand.
 *
 * Gebruik:
 *   node scripts/generate-explanations.js [opties]
 *
 * Opties:
 *   --dry-run        Toon wat er gegenereerd zou worden, maar schrijf niets weg
 *   --vak <id>       Verwerk alleen vragen van dit vak (bijv. --vak nl)
 *   --domein <id>    Verwerk alleen vragen van dit domein (bijv. --domein A)
 *   --overwrite      Overschrijf ook vragen die al een uitleg hebben
 *   --batch <n>      Aantal gelijktijdige API-aanroepen (standaard: 3)
 *   --model <naam>   Anthropic model (standaard: claude-3-haiku-20240307)
 *
 * Omgevingsvariabele:
 *   ANTHROPIC_API_KEY  Verplicht — je Anthropic API-sleutel
 *
 * Afhankelijkheden:
 *   npm install @anthropic-ai/sdk   (of: npm install anthropic)
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── Argument parsing ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flag  = (f) => args.includes(f);
const opt   = (f, def) => {
  const i = args.indexOf(f);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};

const DRY_RUN   = flag('--dry-run');
const OVERWRITE = flag('--overwrite');
const VAK_FILTER   = opt('--vak',    null);
const DOMEIN_FILTER = opt('--domein', null);
const BATCH_SIZE = parseInt(opt('--batch', '3'), 10);
const MODEL      = opt('--model', 'claude-3-haiku-20240307');

const HTML_PATH  = path.resolve(__dirname, '..', 'index.html');
const API_KEY    = process.env.ANTHROPIC_API_KEY;

// ── Validation ────────────────────────────────────────────────────────────────
if (!API_KEY) {
  console.error('❌  Stel ANTHROPIC_API_KEY in als omgevingsvariabele.');
  process.exit(1);
}

if (!fs.existsSync(HTML_PATH)) {
  console.error(`❌  Bestand niet gevonden: ${HTML_PATH}`);
  process.exit(1);
}

// ── Anthropic SDK ─────────────────────────────────────────────────────────────
let Anthropic;
try {
  Anthropic = require('@anthropic-ai/sdk');
} catch {
  try {
    Anthropic = require('anthropic');
  } catch {
    console.error('❌  Installeer het Anthropic SDK: npm install @anthropic-ai/sdk');
    process.exit(1);
  }
}

const client = new Anthropic({ apiKey: API_KEY });

// ── HTML lezen ────────────────────────────────────────────────────────────────
console.log(`📂  HTML laden: ${HTML_PATH}`);
let html = fs.readFileSync(HTML_PATH, 'utf-8');

// ── Vragen extraheren ─────────────────────────────────────────────────────────
/**
 * Parseer alle {v:'...', o:[...], c:N, u:'...'} objecten uit de HTML.
 * We gebruiken een state machine in plaats van eval() voor veiligheid.
 *
 * Retourneert: Array van {matchStr, vakId, domeinId, v, o, c, u, startIdx}
 */
function parseVragen(source) {
  const results = [];

  // Regex om elk vraag-object te vinden (over meerdere regels)
  // Patroon: {v:'...', o:[...], c:N, u:'...'} (u kan leeg zijn)
  const pattern = /\{v:'((?:[^'\\]|\\.)*)'\s*,\s*o:\s*\[([\s\S]*?)\]\s*,\s*c\s*:\s*(\d+)\s*,\s*u:'((?:[^'\\]|\\.)*)'\s*\}/g;

  let match;
  while ((match = pattern.exec(source)) !== null) {
    const [fullMatch, v, oRaw, cStr, u] = match;
    const startIdx = match.index;

    // Parseer antwoorden
    const answerPattern = /'((?:[^'\\]|\\.)*?)'/g;
    const options = [];
    let am;
    while ((am = answerPattern.exec(oRaw)) !== null) {
      options.push(am[1].replace(/\\'/g, "'"));
    }

    // Zoek het bijbehorende vak + domein door terug te zoeken
    const before = source.slice(0, startIdx);
    const vakMatch   = [...before.matchAll(/\{id:'([a-z]+)',naam:/g)].pop();
    const domeinMatch = [...before.matchAll(/\{id:'([A-Z])'/g)].pop();

    const vakId    = vakMatch ? vakMatch[1] : 'onbekend';
    const domeinId = domeinMatch ? domeinMatch[1] : '?';

    results.push({
      fullMatch,
      startIdx,
      vakId,
      domeinId,
      v: v.replace(/\\'/g, "'"),
      o: options,
      c: parseInt(cStr, 10),
      u: u.replace(/\\'/g, "'"),
    });
  }

  return results;
}

// ── Uitleg genereren via API ──────────────────────────────────────────────────
async function generateUitleg(vraag) {
  const { v, o, c } = vraag;
  const correct = o[c] || o[0];

  const prompt = `Je bent een Nederlandse middelbare school docent.
Geef een korte, heldere uitleg (maximaal 2-3 zinnen) bij de volgende meerkeuzevraag.
Leg uit WAAROM het goede antwoord correct is en waarom de andere opties minder goed zijn.
Schrijf in eenvoudig Nederlands, geschikt voor HAVO/VWO leerlingen.
Geef ALLEEN de uitleg, geen inleiding of afsluiting.

Vraag: ${v}
Antwoorden: ${o.map((opt, i) => `${i === c ? '✓' : '✗'} ${opt}`).join(' | ')}
Juist antwoord: ${correct}

Uitleg:`;

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
  });

  return msg.content[0].text.trim();
}

// ── Rate limiter ──────────────────────────────────────────────────────────────
async function runBatched(tasks, batchSize) {
  const results = new Array(tasks.length);
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(t => t()));
    batchResults.forEach((res, j) => {
      results[i + j] = res;
    });
    // Kleine pauze tussen batches om rate limit te vermijden
    if (i + batchSize < tasks.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return results;
}

// ── Vraag in HTML updaten ─────────────────────────────────────────────────────
function escapeForSingleQuote(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function updateVraagInHtml(source, vraag, nieuweUitleg) {
  const escaped = escapeForSingleQuote(nieuweUitleg);
  const updated = vraag.fullMatch.replace(
    /,\s*u:'(?:[^'\\]|\\.)*'/,
    `,u:'${escaped}'`
  );
  return source.replace(vraag.fullMatch, updated);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`🔍  Vragen extraheren uit HTML…`);
  const alleVragen = parseVragen(html);
  console.log(`   → ${alleVragen.length} vragen gevonden`);

  // Filter op vak/domein
  let toProcess = alleVragen;
  if (VAK_FILTER) {
    toProcess = toProcess.filter(q => q.vakId === VAK_FILTER);
    console.log(`   → Na --vak ${VAK_FILTER}: ${toProcess.length} vragen`);
  }
  if (DOMEIN_FILTER) {
    toProcess = toProcess.filter(q => q.domeinId === DOMEIN_FILTER);
    console.log(`   → Na --domein ${DOMEIN_FILTER}: ${toProcess.length} vragen`);
  }

  // Filter op lege uitleg (tenzij --overwrite)
  if (!OVERWRITE) {
    const before = toProcess.length;
    toProcess = toProcess.filter(q => !q.u || q.u.trim() === '');
    console.log(`   → ${before - toProcess.length} al voorzien van uitleg (gebruik --overwrite om te herverwerken)`);
  }

  console.log(`\n🚀  ${toProcess.length} vragen te verwerken`);

  if (toProcess.length === 0) {
    console.log('✅  Niets te doen.');
    return;
  }

  if (DRY_RUN) {
    console.log('\n🟡  DRY-RUN modus — geen wijzigingen worden opgeslagen.\n');
    for (const q of toProcess.slice(0, 5)) {
      console.log(`  [${q.vakId}/${q.domeinId}] ${q.v.slice(0, 60)}…`);
    }
    if (toProcess.length > 5) console.log(`  … en ${toProcess.length - 5} meer.`);
    return;
  }

  // ── Verwerk vragen in batches ──
  let processed = 0;
  let errors    = 0;
  let updatedHtml = html;

  // We moeten vragen in omgekeerde volgorde updaten zodat startIdx klopt
  // Maar omdat we fullMatch zoeken (string replace) is volgorde minder kritiek
  // Toch: verwerk in batches, update HTML na elke batch

  const tasks = toProcess.map(vraag => async () => {
    try {
      const uitleg = await generateUitleg(vraag);
      return { vraag, uitleg };
    } catch (err) {
      throw { vraag, err };
    }
  });

  // Verwerk in batches en update HTML direct
  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    const batch = tasks.slice(i, i + BATCH_SIZE).map(t => t());
    const batchResults = await Promise.allSettled(batch);

    for (const res of batchResults) {
      if (res.status === 'fulfilled') {
        const { vraag, uitleg } = res.value;
        updatedHtml = updateVraagInHtml(updatedHtml, vraag, uitleg);
        processed++;
        const pct = Math.round((processed / toProcess.length) * 100);
        process.stdout.write(`\r  ✅  ${processed}/${toProcess.length} (${pct}%)  `);
      } else {
        const { vraag, err } = res.reason;
        errors++;
        console.error(`\n  ❌  Fout bij [${vraag.vakId}/${vraag.domeinId}]: ${err.message || err}`);
      }
    }

    // Tussentijds opslaan elke 20 vragen
    if ((i + BATCH_SIZE) % 20 === 0 || i + BATCH_SIZE >= tasks.length) {
      fs.writeFileSync(HTML_PATH, updatedHtml, 'utf-8');
      process.stdout.write(' 💾 opgeslagen');
    }

    // Rate limit pauze
    if (i + BATCH_SIZE < tasks.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Definitief opslaan
  fs.writeFileSync(HTML_PATH, updatedHtml, 'utf-8');

  console.log(`\n\n✅  Klaar! ${processed} vragen bijgewerkt, ${errors} fouten.`);
  console.log(`💾  Opgeslagen naar ${HTML_PATH}`);
}

main().catch(err => {
  console.error('\n❌  Onverwachte fout:', err);
  process.exit(1);
});
