import { DATUM, OPSLAG } from './_basis.mjs';
export default {
  datum: DATUM, opslag: { ...OPSLAG, examenapp_level: 'havo', slagio_kd_hint_v1: '1' }, duur: 5.5,
  voorbereiding: async (p, h) => {
    await p.evaluate(() => { try { chooseLevel('havo', true); } catch (e) {} }); await h.wacht(1200);
    // Een volgebouwd eiland (alle leerdoelen beheerst) zodat alle wonderen zichtbaar zijn.
    await p.evaluate(() => { const prog = {}; getVK().forEach(v => kdLeerdoelen(v).forEach(x => { prog[`${v.id}_${x.ld.id}_snel`] = { best: 9, total: 10, attempts: 1 }; }));
      localStorage.setItem('examenapp_progress_havo', JSON.stringify(prog)); const g = {}; getVK().forEach(v => g[v.id] = 4); localStorage.setItem('slagio_kingdom_havo', JSON.stringify({ gebouwd: g })); });
    await p.evaluate(() => kingdomOpen()); await h.tot(() => typeof K3 !== 'undefined' && K3.on, 90); await h.wacht(2500);
    await p.evaluate(() => { K3.r.setPixelRatio(1.4); K3.w = 0; k3Maat(); kdBlad('peek', true); kdOverzicht(true); }); await h.wacht(600); },
  stappen: [
    // Eén vloeiende zwaai: een kwartslag om het eiland heen en dichterbij, zodat je de wijken en wonderen ziet.
    [0.3, p => p.evaluate(() => { K3.invoer = 1e9; k3Naar(K3.doel.clone(), K3.dist * .6, K3.az + 1.25, null, 5); })],
  ],
};
