#!/usr/bin/env node
/**
 * split-data.js - splitst de volledige niveau-data op in een lichte metadata-laag
 * plus zware per-vak vraagbestanden, zodat de browser bij het kiezen van een niveau
 * niet de complete vragenberg hoeft te downloaden.
 *
 * Bron (blijft de waarheid, geschreven door build-questions.js):
 *   data-havo.js  →  var VAKKEN     = [ ... volledige domeinen met sv/oe/begrippen ]
 *   data-vwo.js   →  var VAKKEN_VWO = [ ... ]
 *
 * Output (wél naar de browser):
 *   data-havo.meta.js  →  var VAKKEN = [ ... domeinen ZONDER vraag-arrays, mét nSv/nOe/nBeg ]
 *   q/havo-<vakId>.js  →  __hydrateVak('havo','<vakId>',{ '<domId>':{sv,oe,begrippen}, ... })
 *   (idem voor vwo)
 *
 *   node scripts/split-data.js
 */
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const R = f => path.join(ROOT, f);
const load = (file, name) => { const g = {}; new Function('g', fs.readFileSync(R(file), 'utf8') + `\ng.V=${name};`)(g); return g.V; };

const QDIR = R('q');
if (!fs.existsSync(QDIR)) fs.mkdirSync(QDIR);

function split(srcFile, name, level, pretty) {
  const V = load(srcFile, name);
  const manifest = [];
  let qBytes = 0, metaQ = 0;

  const meta = V.map(vak => {
    const mv = {};
    // kopieer alle vak-velden behalve 'domeinen' (die herbouwen we licht)
    for (const k in vak) if (k !== 'domeinen') mv[k] = vak[k];
    const payload = {};                     // domId -> {sv,oe,begrippen}
    // velden die pas nodig zijn bij het openen van een vak → naar het q-bestand
    const HEAVY = new Set(['sv', 'oe', 'begrippen', 'sam']);
    // Splitst één domein- of leerdoel-object: zware velden → payload[id], lichte + counts → meta.
    const splitNode = (node, md) => {
      for (const k in node) if (!HEAVY.has(k) && k !== 'leerdoelen') md[k] = node[k];
      const sv = node.sv || [], oe = node.oe || [], beg = node.begrippen || [];
      md.nSv = sv.length; md.nOe = oe.length; md.nBeg = beg.length;
      if (node.sam) md.hasSam = true;   // lichte vlag zodat de status-badge werkt vóór hydratie
      metaQ += sv.length + oe.length;
      const p = {};
      if (sv.length) p.sv = sv; if (oe.length) p.oe = oe; if (beg.length) p.begrippen = beg;
      if (node.sam) p.sam = node.sam;
      if (Object.keys(p).length) payload[node.id] = p;
      return md;
    };
    mv.domeinen = (vak.domeinen || []).map(dom => {
      const md = splitNode(dom, {});
      // leerdoelen: elk als eigen payload-entry (flat, op leerdoel-id), lichte meta onder het domein
      if (Array.isArray(dom.leerdoelen) && dom.leerdoelen.length) {
        md.leerdoelen = dom.leerdoelen.map(ld => splitNode(ld, {}));
      }
      return md;
    });
    // schrijf per-vak vraagbestand - alleen als er echt vraagdata is (vakken in
    // opbouw krijgen 0 counts en dus géén q-bestand; de app fetcht dat dan ook niet)
    if (Object.keys(payload).length) {
      const body = `__hydrateVak(${JSON.stringify(level)},${JSON.stringify(vak.id)},${JSON.stringify(payload)});`;
      const qf = `q/${level}-${vak.id}.js`;
      fs.writeFileSync(R(qf), body);
      qBytes += Buffer.byteLength(body);
      manifest.push(qf);
    }
    return mv;
  });

  const metaSrc = `var ${name} = ` + (pretty ? JSON.stringify(meta, null, 1) : JSON.stringify(meta)) + ';';
  const metaFile = `data-${level}.meta.js`;
  fs.writeFileSync(R(metaFile), metaSrc);

  console.log(`${level}: ${meta.length} vakken → ${metaFile} (${(Buffer.byteLength(metaSrc) / 1024).toFixed(0)} KB, ${metaQ} vragen als count) + ${manifest.length} q-bestanden (${(qBytes / 1024).toFixed(0)} KB samen)`);
  return manifest;
}

const m1 = split('data-havo.js', 'VAKKEN', 'havo', true);
const m2 = split('data-vwo.js', 'VAKKEN_VWO', 'vwo', false);
// VMBO: bron aanwezig zodra data-vmbo.js bestaat (vakken in opbouw → 0 counts, geen q-bestand).
let m3 = [];
if (fs.existsSync(R('data-vmbo.js'))) m3 = split('data-vmbo.js', 'VAKKEN_VMBO', 'vmbo', true);

// manifest voor de SW (welke q-bestanden bestaan er)
fs.writeFileSync(R('q/manifest.json'), JSON.stringify([...m1, ...m2, ...m3]));
console.log('\nKlaar. Vergeet niet de SW-cache te bumpen en data-*.meta.js in ASSETS te zetten.');
