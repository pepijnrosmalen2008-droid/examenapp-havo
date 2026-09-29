import { DATUM, OPSLAG } from './_basis.mjs';
export default {
  datum: DATUM, opslag: { ...OPSLAG, examenapp_level: 'havo' }, duur: 3.2,
  voorbereiding: async (p, h) => { await p.evaluate(() => { try { chooseLevel('havo', true); } catch (e) {} }); await h.wacht(1200);
    await p.evaluate(() => arcadeOpen()); await h.tot(() => !!document.querySelector('#arcade-body .arc-tile')); await h.wacht(900); },
  stappen: [[0.5, (p, h) => h.scroll('#sc-arcade', 900, 2200)]],
};
