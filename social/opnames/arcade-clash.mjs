import { DATUM, OPSLAG } from './_basis.mjs';
const goed = (p, h) => p.evaluate(() => CL.flits && CL.flits.juist).then(k => h.tik(`.cl-opt[data-k="${k}"]`));
const kaart = i => async (p, h) => { await h.tik(`#cl-kaarten .cl-kaart@${i}`); await h.stap(); const b = await p.evaluate(() => { const r = document.getElementById('cl-veld').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }); if (b) await h.tik([b.x + b.width * (i ? .7 : .35), b.y + b.height * .62]); };
export default {
  datum: DATUM, opslag: { ...OPSLAG, examenapp_level: 'havo' }, duur: 6,
  voorbereiding: async (p, h) => {
    await p.evaluate(() => { try { chooseLevel('havo', true); } catch (e) {} }); await h.wacht(1200);
    await p.evaluate(() => arcadeOpen()); await h.tot(() => typeof clashOpen === 'function' && !!document.querySelector('.arc-tile'));
    await p.evaluate(() => { ARC.vakId = 'bi'; clashOpen(); }); await h.tot(() => !!document.getElementById('cl-strijd'), 90);
    await p.evaluate(() => { const c = clStore(); c.uitlegGezien = true; clSave(c); });
    await h.wacht(600); await h.tik('#cl-strijd'); await h.tot(() => !!(window.CL && CL.flits), 60); await h.wacht(2500); },
  stappen: [[0.3, goed], [1.0, goed], [1.7, kaart(0)], [2.6, goed], [3.3, goed], [4.0, kaart(1)]],
};
