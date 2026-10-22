// Zet de SEO-vakpagina's (vakken/*.html) op het komende examenjaar:
// jaartal in titels en teksten, en de examendatum uit EXAM_SCHEDULE_2027 (schedule.js).
//   node scripts/vakpagina-jaar.mjs          → schrijft de pagina's bij
//   node scripts/vakpagina-jaar.mjs --check  → faalt als er nog een oud examenjaar in staat
import fs from 'node:fs';
const OUD = '2026', NIEUW = '2027';
const src = fs.readFileSync('schedule.js', 'utf8');
const R = new Function('return ' + src.match(/const EXAM_SCHEDULE_2027\s*=\s*(\[[\s\S]*?\n\]);/)[1])();
const VAK = { aardrijkskunde: 'ak', bedrijfseconomie: 'Bedrijfseconomie', biologie: 'bi', duits: 'Duits', economie: 'ec', engels: 'en', frans: 'Frans',
  geschiedenis: 'gs', grieks: 'gr', latijn: 'la', maatschappijwetenschappen: 'mw', natuurkunde: 'na', nederlands: 'nl', scheikunde: 'sk', 'wiskunde-a': 'wa', 'wiskunde-b': 'wb', informatica: null };
const MAAND = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const fmt = d => { const [y, m, dd] = d.split('-').map(Number); return `${dd} ${MAAND[m - 1]} ${y}`; };
const check = process.argv.includes('--check');
let n = 0, fout = [];
for (const f of fs.readdirSync('vakken').filter(f => f.endsWith('.html'))) {
  const m = f.match(/^(havo|vwo|vmbo)-([a-z-]+?)(-domein-[a-z])?\.html$/); if (!m) continue;
  const p = 'vakken/' + f; let h = fs.readFileSync(p, 'utf8'); if (!h.includes(OUD)) continue;
  if (check) { if (/(Eindexamen|examen|CE)[^<"]{0,40}2026/i.test(h)) fout.push(f); continue; }
  const [, niv, slug] = m; const key = VAK[slug];
  const ex = key === undefined ? null : R.find(e => e.niveau === niv && (e.vakId === key || e.vak === key));
  if (slug === 'informatica') {
    // Informatica is een schoolexamenvak: geen centraal examen (alleen bij het staatsexamen).
    h = h.replace(/Het eerste tijdvak CE Informatica VWO is op [^"<]*/g, 'Informatica heeft op school geen centraal examen: je cijfer komt uit het schoolexamen. Alleen staatsexamenkandidaten maken een centraal examen.')
      .replace(/<p>1e tijdvak: <strong>[^<]*<\/strong><\/p>/, '<p>Geen centraal examen: informatica sluit je af met het schoolexamen.</p>')
      .replace(/het VWO CE Informatica 2026/g, 'informatica vwo 2027').replace(/, echte CE-examens 2019–2025/g, '').replace(/ Echte eindexamens 2019–2025 op Slagio\.nl\.?/g, '');
  } else if (ex) {
    h = h.replace(/\b\d{1,2} (mei|juni) 2026\b(?!\s*&middot;)/g, (s) => /^(1[1-9]|2\d) juni/.test(s) ? s : fmt(ex.datum));
  }
  // Uitslag en 2e tijdvak: geen verzonnen data, verwijs naar het Examenblad.
  h = h.replace(/<p>Normering: [^<]*2026[^<]*<\/p>/g, '<p>Uitslag en 2e tijdvak: juni 2027, de precieze data staan op <a href="https://www.examenblad.nl">examenblad.nl</a>.</p>');
  h = h.replace(/(&copy;|©) 2026/g, '$1 @@JR@@').replace(/2026/g, NIEUW).replace(/@@JR@@/g, '2026');
  fs.writeFileSync(p, h); n++;
}
if (check) { if (fout.length) { console.error('Oud examenjaar in:', fout.join(', ')); process.exit(1); } console.log('vakpagina\'s: jaar ok'); }
else console.log('bijgewerkt:', n);
