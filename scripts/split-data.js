#!/usr/bin/env node
/**
 * split-data.js — splitst de volledige niveau-data op in een lichte metadata-laag
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
    mv.domeinen = (vak.domeinen || []).map(dom => {
      const md = {};
      for (const k in dom) if (!HEAVY.has(k)) md[k] = dom[k];
      const sv = dom.sv || [], oe = dom.oe || [], beg = dom.begrippen || [];
      md.nSv = sv.length; md.nOe = oe.length; md.nBeg = beg.length;
      metaQ += sv.length + oe.length;
      const p = {};
      if (sv.length) p.sv = sv; if (oe.length) p.oe = oe; if (beg.length) p.begrippen = beg;
      if (dom.sam) p.sam = dom.sam;
      if (Object.keys(p).length) payload[dom.id] = p;
      return md;
    });
    // schrijf per-vak vraagbestand
    const body = `__hydrateVak(${JSON.stringify(level)},${JSON.stringify(vak.id)},${JSON.stringify(payload)});`;
    const qf = `q/${level}-${vak.id}.js`;
    fs.writeFileSync(R(qf), body);
    qBytes += Buffer.byteLength(body);
    manifest.push(qf);
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

// manifest voor de SW (welke q-bestanden bestaan er)
fs.writeFileSync(R('q/manifest.json'), JSON.stringify([...m1, ...m2]));
console.log('\nKlaar. Vergeet niet de SW-cache te bumpen en data-*.meta.js in ASSETS te zetten.');
