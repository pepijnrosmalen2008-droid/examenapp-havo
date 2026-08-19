#!/usr/bin/env node
/**
 * export-exemplars.mjs - exporteert de rijk-adaptieve (gouden) vragen naar twee
 * herbruikbare vormen. READ-ONLY op de bron; schrijft alleen naar dataset/.
 *
 * Een gouden vraag = { v, o[4], c, d, u, uo[4], uh } (per-optie diagnostische uitleg).
 * Dit zijn de enige vragen die de volledige Slagio-standaard dragen; ze zijn de
 * bron voor (a) few-shot prompting vandaag en (b) een fine-tune-set later.
 *
 * Output:
 *   dataset/exemplars.jsonl   - few-shot-bank: per regel {level,vak,leerdoel,vraag}
 *   dataset/train.jsonl       - instructie-format: {messages:[{role,content}...]}
 *                               (system = Slagio-contract, user = leerdoel-brief,
 *                                assistant = de gouden vraag als JSON)
 *   dataset/stats.json        - tellingen per vak/niveau/leerdoel + R-verdeling
 *
 *   node scripts/export-exemplars.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'dataset');
fs.mkdirSync(OUT, { recursive: true });

const load = (file, name) => {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return [];
  const g = {};
  try { new Function('g', fs.readFileSync(p, 'utf8') + `\ng.V=${name};`)(g); } catch { return []; }
  return g.V || [];
};

const SETS = [
  ['data-havo.js', 'VAKKEN', 'havo'],
  ['data-vwo.js', 'VAKKEN_VWO', 'vwo'],
  ['data-vmbo.js', 'VAKKEN_VMBO', 'vmbo'],
];

// Het Slagio-contract dat de assistant altijd naleeft. Dit is de system-prompt
// waarmee straks zowel few-shot als fine-tune de juiste vorm afdwingen.
const SYSTEM = [
  'Je bent de Slagio-vraaggenerator voor Nederlandse eindexamens (HAVO/VWO/VMBO).',
  'Je levert uitsluitend geldige JSON voor één meerkeuzevraag met dit schema:',
  '{ "v": stam (<=110 tekens), "o": [4 unieke opties], "c": index 0-3 van het juiste antwoord,',
  '  "d": R-niveau 1-3, "u": onthoud/takeaway (>12 tekens),',
  '  "uo": [4 per-optie diagnostische uitleg, elk >=8 tekens], "uh": onthoud-tip (>=8 tekens) }.',
  'Harde regels: precies één juist antwoord; geen dubbele of overlappende opties;',
  'het juiste antwoord is bij voorkeur KORT en de afleiders langer (geen lengte-verklikker);',
  'geen antwoordpositie-bias; geen absolute overclaim (uitsluitend/altijd/alleen) in juist antwoord of uitleg;',
  'geen em dashes; curriculumwaarheid boven alles - verzin geen feiten.',
].join('\n');

const rich = q => Array.isArray(q.o) && q.o.length === 4 && Array.isArray(q.uo) && q.uo.length === 4 && q.uh && q.u;

const exemplars = [], train = [];
const stats = { total: 0, perVak: {}, perLeerdoel: {}, rVerdeling: { 1: 0, 2: 0, 3: 0 }, posVerdeling: [0, 0, 0, 0] };

for (const [file, name, lvl] of SETS) {
  const VAKKEN = load(file, name);
  for (const vak of VAKKEN) {
    for (const dom of vak.domeinen || []) {
      for (const node of [dom, ...(dom.leerdoelen || [])]) {
        for (const q of node.sv || []) {
          if (!rich(q)) continue;
          stats.total++;
          const vk = `${lvl}/${vak.id}`;
          stats.perVak[vk] = (stats.perVak[vk] || 0) + 1;
          stats.perLeerdoel[`${vk}/${node.id}`] = (stats.perLeerdoel[`${vk}/${node.id}`] || 0) + 1;
          if (stats.rVerdeling[q.d] != null) stats.rVerdeling[q.d]++;
          if (Number.isInteger(q.c)) stats.posVerdeling[q.c]++;

          const vraag = { v: q.v, o: q.o, c: q.c, d: q.d, u: q.u, uo: q.uo, uh: q.uh };
          exemplars.push({ level: lvl, vak: vak.id, leerdoel: node.id, naam: node.naam, vraag });

          const brief = `Niveau: ${lvl}\nVak: ${vak.naam}\nLeerdoel: ${node.naam}\nMaak één examenvraag (R-niveau ${q.d}) volgens het Slagio-schema.`;
          train.push({ messages: [
            { role: 'system', content: SYSTEM },
            { role: 'user', content: brief },
            { role: 'assistant', content: JSON.stringify(vraag) },
          ] });
        }
      }
    }
  }
}

const w = (f, lines) => fs.writeFileSync(path.join(OUT, f), lines.map(x => JSON.stringify(x)).join('\n') + '\n');
w('exemplars.jsonl', exemplars);
w('train.jsonl', train);
fs.writeFileSync(path.join(OUT, 'stats.json'), JSON.stringify(stats, null, 2));

console.log(`✓ dataset/exemplars.jsonl  (${exemplars.length} few-shot voorbeelden)`);
console.log(`✓ dataset/train.jsonl      (${train.length} instructie-paren)`);
console.log(`✓ dataset/stats.json`);
console.log(`\nGouden vragen: ${stats.total}`);
console.log(`R-verdeling: R1=${stats.rVerdeling[1]} R2=${stats.rVerdeling[2]} R3=${stats.rVerdeling[3]}`);
console.log(`Positie-verdeling (c): ${stats.posVerdeling.join('/')}`);
console.log(`Vakken: ${Object.entries(stats.perVak).map(([k, v]) => `${k}=${v}`).join(', ')}`);
const FINETUNE_MIN = 2000;
console.log(`\nFine-tune-drempel (indicatief): ${stats.total}/${FINETUNE_MIN}. ` +
  (stats.total >= FINETUNE_MIN ? 'genoeg voor een eerste LoRA.' : `nog ${FINETUNE_MIN - stats.total} te gaan - gebruik tot dan few-shot + gates.`));
