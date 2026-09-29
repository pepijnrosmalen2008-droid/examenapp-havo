import { DATUM, OPSLAG, goedAntwoord } from './_basis.mjs';
export default {
  datum: DATUM, opslag: OPSLAG, duur: 13.5,
  stappen: [
    [0.8, (p, h) => h.tik('.wlc-chavo .wlc-card-btn')],
    [2.3, (p, h) => h.scroll(null, 760, 800)],
    [3.6, (p, h) => h.tik('#sc-home .card@0')],
    [5.0, (p, h) => h.scroll(null, 620, 800)],
    [6.2, (p, h) => h.tik('#sc-detail .dc2 >> .qb@1')],
    [7.6, (p, h) => h.tik('#sc-qmode .qmcd@0')],
    [9.3, goedAntwoord],
    [10.7, (p, h) => h.tik('#qnxt')],
    [11.7, goedAntwoord],
  ],
};
