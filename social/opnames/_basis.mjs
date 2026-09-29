// Gedeelde instellingen voor opnames: intro's en pop-ups overslaan, vaste datum.
export const DATUM = '2026-10-06T16:30:00+02:00';
export const OPSLAG = {
  slagio_onb_done: '1', slagio_seen_intro_v2: '1', slagio_vonk_intro_done: '1', slagio_cijfer_tuto_v1: '1',
  slagio_reg_last: String(Date.parse(DATUM)), slagio_reg_home_weg: String(Date.parse(DATUM)),
  slagio_vonk_dagmissie: DATUM.slice(0, 10), slagio_kd_hint_v1: '1', slagio_pwa_dismissed: '1', pwa_banner_dismissed: '1',
};
// Tik op het goede antwoord van de huidige snelle-quizvraag.
export async function goedAntwoord(p, h) {
  const pos = await p.evaluate(() => { const b = document.querySelector('#snel-area .opt'); return b ? +b.dataset.correct : 0; });
  await h.tik(`#snel-area .opt[data-pos="${pos}"]`);
}
