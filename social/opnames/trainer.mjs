import { DATUM, OPSLAG } from './_basis.mjs';
// Voorbeelddata (in de video als voorbeeld gelabeld): drie proefexamens Wiskunde A
// met een stijgende lijn en Statistiek als zwak punt, plus wat quizzen.
function voorbeeld() {
  const dag = 864e5, nu = Date.parse('2026-10-06T16:30:00+02:00');
  const dom = (a, b, c, d, e) => ({ 'Vaardigheden': { behaald: a, max: 12, aantal: 4 }, 'Algebra en tellen': { behaald: b, max: 14, aantal: 5 },
    'Verbanden en functies': { behaald: c, max: 18, aantal: 6 }, 'Verandering': { behaald: d, max: 16, aantal: 5 }, 'Statistiek': { behaald: e, max: 16, aantal: 5 } });
  const sim = (dagen, cijfer, d, open, mc) => { const behaald = Object.values(d).reduce((x, y) => x + y.behaald, 0);
    return { ts: nu - dagen * dag, niveau: 'havo', vakId: 'wa', vak: 'Wiskunde A', cijfer, behaald, max: 76, versie: 'vol', bron: 'sim', tijdGebruikt: 9800, tijdTotaal: 10800, domeinen: d,
      types: { open: { behaald: open, max: 60, aantal: 18 }, mc: { behaald: mc, max: 16, aantal: 7 } } }; };
  const quiz = (dagen, d, b, m) => ({ ts: nu - dagen * dag, niveau: 'havo', vakId: 'wa', vak: 'Wiskunde A', cijfer: Math.round((9 * b / m + 1) * 2) / 2, behaald: b, max: m, versie: 'quiz', bron: 'quiz',
    tijdGebruikt: 0, tijdTotaal: 0, domeinen: { [d]: { behaald: b, max: m, aantal: m } }, types: { open: { behaald: 0, max: 0, aantal: 0 }, mc: { behaald: b, max: m, aantal: m } } });
  return [sim(20, 5.5, dom(8, 9, 11, 8, 6), 30, 12), quiz(16, 'Statistiek', 5, 10), sim(12, 6.0, dom(9, 10, 13, 9, 6), 34, 13), quiz(8, 'Verandering', 7, 10),
    quiz(5, 'Statistiek', 6, 10), sim(3, 6.5, dom(10, 11, 14, 11, 7), 37, 14), quiz(1, 'Algebra en tellen', 9, 10)];
}
export default {
  datum: DATUM, opslag: { ...OPSLAG, examenapp_level: 'havo', slagio_plus_res_havo: JSON.stringify(voorbeeld()) }, duur: 9,
  voorbereiding: async (p, h) => { await p.evaluate(() => { try { chooseLevel('havo', true); } catch (e) {} }); await h.wacht(1200);
    await p.evaluate(() => openExamentrainer()); await h.tot(() => !!document.querySelector('.plus-head, .plus-forecast'), 30); await h.wacht(1200); },
  stappen: [[1.2, (p, h) => h.scroll(null, 520, 1100)], [3.4, (p, h) => h.scroll(null, 620, 1100)], [5.6, (p, h) => h.scroll(null, 620, 1100)], [7.6, (p, h) => h.scroll(null, 560, 1000)]],
};
