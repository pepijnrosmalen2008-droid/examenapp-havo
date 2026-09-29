import { DATUM, OPSLAG } from './_basis.mjs';
// Laat het goede antwoord herkennen: arcVraagHtml krijgt een data-goed op de juiste knop.
const markeer = () => { const o = window.arcVraagHtml; if (o.__m) return; window.arcVraagHtml = (item, x, cls) => { const k = x.idx.indexOf(item.q.c);
  return o(item, x, cls).replace(`data-k="${k}"`, `data-k="${k}" data-goed="1"`); }; window.arcVraagHtml.__m = 1; };
const goed = (p, h) => h.tik('.arc-opt[data-goed]');
export default {
  datum: DATUM, opslag: { ...OPSLAG, examenapp_level: 'havo' }, duur: 6,
  voorbereiding: async (p, h) => { await p.evaluate(() => { try { chooseLevel('havo', true); } catch (e) {} }); await h.wacht(1200);
    await p.evaluate(() => arcadeOpen()); await h.tot(() => typeof arcStart === 'function' && !!document.querySelector('.arc-tile'));
    await p.evaluate(markeer); await p.evaluate(() => { ARC.vakId = 'bi'; arcStart('boss', true); });
    await h.tot(() => !!document.querySelector('.arc-opt[data-goed]')); await h.tot(() => !!document.querySelector('#a3-boss canvas'), 30); await h.wacht(1200); },
  stappen: [[0.5, goed], [1.7, goed], [2.9, goed], [3.9, (p, h) => h.tik('#boss-super')], [4.4, goed]],
};
