// ═══════════════════════════════════════════════════════════════════════════
// captions.mjs · onderschriften zonder AI-taal
//
// Met de hand geschreven varianten per format; de generator kiest er per week
// één (deterministisch). Regels (zie social/STIJLGIDS.md): korte zinnen, je/jij,
// geen gedachtestreepjes, max. 2 emoji en nooit als opsommingsteken, geen
// beweringen die we niet kunnen onderbouwen, één duidelijke vraag of actie.
// ═══════════════════════════════════════════════════════════════════════════
import { kies } from './data.mjs';

const t = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '');
const tag = s => '#' + s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

const AFTELLEN = [
  'Nog {dagen} dagen tot de eerste centrale examens. Dat lijkt veel, maar het zijn {weekenden} weekenden.\n\nWelk vak pak jij als eerste aan?',
  '{dagen} dagen. Op {datum} beginnen havo, vwo en vmbo tegelijk.\n\nTien minuten per dag is genoeg, zolang je het elke dag doet.',
  'Nog {weken} weken tot het eerste examen. Geen paniek, wel beginnen.\n\nWat is jouw lastigste vak?',
  'Elke maandag tellen we af. Deze week: nog {dagen} dagen.\n\nZet je vakken in Slagio en je krijgt een studieplan tot de examendag.',
  'Over {dagen} dagen zit je in de examenzaal. Hoe ver ben jij?\n\n1 = nog niks gedaan, 10 = ik ben er klaar voor. Zet je cijfer in de comments.',
];
const AFTELLEN_CTA = 'Gratis oefenen met echte examens: link in bio.';

const VRAAG = [
  'Examenvraag {vak}, {niveau}. Kies eerst zelf, swipe dan pas.\n\nA, B, C of D? Zet je antwoord in de comments voordat je kijkt.',
  'Deze komt uit {domein}, examenstof voor {vak} op {niveau}.\n\nWat is jouw antwoord? Het goede antwoord met uitleg staat op slide 3.',
  'Snelle check voor {vak} ({niveau}). Weet je het binnen tien seconden?\n\nSwipe voor het antwoord en waarom de andere opties niet kloppen.',
  'Tag iemand die {vak} doet en kijk wie hem goed heeft.\n\nAntwoord en uitleg op slide 3.',
];
const VRAAG_SE = 'Deze komt uit {domein} ({vak}, {niveau}).\n\nWat is jouw antwoord? Het goede antwoord met uitleg staat op slide 3.';
const VRAAG_CTA = 'Meer van deze, met uitleg bij elk antwoord: gratis via de link in bio.';

const BEGRIPPEN = [
  'Vijf begrippen uit {domein} die je voor {vak} moet kennen. Sla op voor als je gaat leren.',
  '{vak} ({niveau}): vijf begrippen uit {domein}. Hoeveel wist je er al zonder te kijken?',
  'Niet alleen uit je hoofd leren. Swipe door en probeer elk begrip in je eigen woorden uit te leggen.\n\nVijf begrippen uit {domein}, {vak} {niveau}.',
  'Opslaan en vlak voor je toets nog één keer doorswipen. Vijf begrippen uit {domein} voor {vak}.',
];
const BEGRIPPEN_CTA = 'Alle {totaal} begrippen van {vak} staan als flashcards in Slagio. Gratis, link in bio.';

const REEL = [
  'Zo ziet oefenen voor {vak} eruit in Slagio. Echte examenvragen, uitleg bij elk antwoord.\n\nGratis, zonder account. Link in bio.',
  'Vijf minuten {vak} tussendoor. Meer hoeft niet, als je het elke dag doet.\n\nGratis oefenen: link in bio.',
  'POV: je oefent met echte examenvragen in plaats van een examenbundel te kopen.\n\nSlagio is gratis. Link in bio.',
];

const BASIS_TAGS = ['#eindexamen2027', '#examen', '#examentips', '#studeren'];
const niveauTags = n => ({ havo: ['#havo', '#havo5'], vwo: ['#vwo', '#vwo6'], vmbo: ['#vmbo', '#vmbotl'] }[n] || []);

function hashtags(extra) {
  return [...new Set([...extra, ...BASIS_TAGS])].slice(0, 8).join(' ');
}

export function captionAftellen(r, v) {
  return `${t(kies(r, AFTELLEN), v)}\n\n${AFTELLEN_CTA}\n\n${hashtags(['#havo', '#vwo', '#vmbo', '#examenstress'])}`;
}
export function captionVraag(r, v, ce) {
  const tekst = ce ? kies(r, VRAAG) : VRAAG_SE;
  return `${t(tekst, v)}\n\n${VRAAG_CTA}\n\n${hashtags([tag(v.vak), ...niveauTags(v.niveauId)])}`;
}
export function captionBegrippen(r, v) {
  return `${t(kies(r, BEGRIPPEN), v)}\n\n${t(BEGRIPPEN_CTA, v)}\n\n${hashtags([tag(v.vak), ...niveauTags(v.niveauId), '#samenvatting'])}`;
}
export function captionReel(r, v) {
  return `${t(kies(r, REEL), v)}\n\n${hashtags([tag(v.vak), ...niveauTags(v.niveauId), '#studytok'])}`;
}

// Vangnet: controleert elk onderschrift op AI-tells voordat het de wachtrij in gaat.
const VERBODEN = [/—/, /–(?!\d)/, /\bontdek\b/i, /\bduik\b/i, /\bunlock/i, /game.?changer/i, /klaar om/i, /in een wereld/i,
  /het geheim/i, /\bboost\b/i, /naar een hoger niveau/i, /\bontgrendel/i, /\breis\b/i, /\bmagie\b/i, /✨/, /🚀/, /💡/];
export function controleerCaption(c) {
  const fouten = VERBODEN.filter(re => re.test(c)).map(String);
  const emoji = (c.match(/\p{Extended_Pictographic}/gu) || []).length;
  if (emoji > 2) fouten.push(`${emoji} emoji (max 2)`);
  if (c.length > 2100) fouten.push('te lang voor Instagram (max 2200)');
  return fouten;
}
