// Kiest de afleiders van de bestaande begripsvragen (havo/vwo) opnieuw met
// scripts/lib/afleiders.js, en haalt weggevers weg (begrip staat in de omschrijving).
// Vraagtekst, juiste antwoord, uitleg en niveau blijven gelijk.
//   node scripts/verbeter-afleiders.js          → schrijft data-havo.js en data-vwo.js
//   node scripts/verbeter-afleiders.js --droog  → alleen tellen
// Daarna: node scripts/split-data.js
const fs = require('fs'), path = require('path');
const { kies, weggever, schud, rng, norm } = require('./lib/afleiders.js');
const R = f => path.join(__dirname, '..', f);
const droog = process.argv.includes('--droog');
const DEF = /^(Wat betekent «(.+)»\?|Wat houdt «(.+)» in\?)$/, TERM = /^(Welk begrip hoort bij deze omschrijving|Welke term past bij): "([\s\S]+)"\?$/;
const stat = { def: 0, term: 0, weg: 0, zonder: 0, verschoven: 0 };
for (const [file, name, mooi] of [['data-havo.js', 'VAKKEN', true], ['data-vwo.js', 'VAKKEN_VWO', false]]) {
  const V = new Function(fs.readFileSync(R(file), 'utf8') + ';return ' + name)();
  for (const vak of V) {
    const alle = []; vak.domeinen.forEach(d => (d.begrippen || []).forEach(b => alle.push({ ...b, d0: d.id })));
    for (const d of vak.domeinen) {
      if (!d.sv) continue;
      const defs = alle.map(b => ({ x: b.d, dom: b.d0 === d.id })), terms = alle.map(b => ({ x: b.t, dom: b.d0 === d.id }));
      d.sv = d.sv.filter(q => {
        const md = String(q.v).match(DEF), mt = String(q.v).match(TERM);
        if (!md && !mt) return true;
        const juist = q.o[q.c];
        let af;
        if (md) {
          const term = md[2] || md[3];
          af = kies(juist, defs, { soort: 'def', term, dichtbij: /^Wat houdt/.test(q.v), seed: q.v });
          stat.def++;
        } else {
          if (weggever(juist, mt[2])) { stat.weg++; return false; }
          af = kies(juist, terms, { soort: 'term', def: mt[2], dichtbij: /^Welke term/.test(q.v), seed: q.v });
          stat.term++;
        }
        if (!af) { stat.zonder++; return true; }                // te weinig kandidaten: laat de vraag zoals hij was
        const oud = q.o.map(norm).sort().join('|');
        q.o = schud([juist, ...af], rng('o' + q.v)); q.c = q.o.indexOf(juist);
        if (q.o.map(norm).sort().join('|') !== oud) stat.verschoven++;
        return true;
      });
    }
  }
  if (!droog) fs.writeFileSync(R(file), `var ${name} = ` + (mooi ? JSON.stringify(V, null, 1) : JSON.stringify(V)) + ';');
}
console.log(stat);
