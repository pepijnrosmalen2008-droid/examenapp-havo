// ═══════════════════════════════════════════════════════════════════════════
// formats.mjs · de drie vaste post-formats van Slagio
//
//   aftellen     → 1 feed-post (4:5) + 1 story (9:16): dagen tot de eerste CE's
//   examenvraag  → carrousel van 4: vraag stellen, zelf kiezen, antwoord+uitleg, app
//   begrippen    → carrousel van 7: 5 begrippen uit één domein, groot en opslaanbaar
//
// Alle tekst op de slides komt uit de app-data; er wordt niets verzonnen.
// ═══════════════════════════════════════════════════════════════════════════
import { slide, top, chip, foot, mascot, esc } from './render.mjs';
import { NIVEAUS, vakken, eersteExamen } from './data.mjs';

const BRAND = '#E85C0D';
const DAGEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
const MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
export const datumNL = iso => { const d = new Date(iso + 'T12:00:00Z'); return `${DAGEN[d.getUTCDay()]} ${d.getUTCDate()} ${MAANDEN[d.getUTCMonth()]}`; };
const dagenTussen = (a, b) => Math.round((new Date(b + 'T12:00:00Z') - new Date(a + 'T12:00:00Z')) / 864e5);
function weekenden(van, tot) {
  let n = 0; const d = new Date(van + 'T12:00:00Z'), e = new Date(tot + 'T12:00:00Z');
  while (d < e) { if (d.getUTCDay() === 6) n++; d.setUTCDate(d.getUTCDate() + 1); }
  return n;
}

// ── 1. AFTELLEN ────────────────────────────────────────────────────────────
export function aftellen(publicatieDatum) {
  const eerste = ['havo', 'vwo', 'vmbo'].map(n => ({ n, e: eersteExamen(n) })).filter(x => x.e);
  const startDatum = eerste.map(x => x.e.datum).sort()[0];
  const dagen = dagenTussen(publicatieDatum, startDatum);
  const weekendenTot = weekenden(publicatieDatum, startDatum);
  const mood = dagen > 120 ? 'blij' : dagen > 45 ? 'denk' : 'trots';

  const rijen = eerste.map(({ n, e }) => `
    <div class="cd-row"><span class="cd-niv" style="--niv:${NIVEAUS[n].kleur}">${NIVEAUS[n].label}</span>
      <span class="cd-vak">${esc(e.vak)}</span><span class="cd-tijd num">${esc(e.tijd.split('–')[0])}</span></div>`).join('');

  const css = `
  .cd-eyebrow{margin-top:70px}
  .cd-nog{font-family:'Bricolage';font-weight:600;font-size:64px;color:rgba(255,255,255,.62);margin-top:34px;letter-spacing:-.02em}
  .cd-big{font-family:'Bricolage';font-weight:800;font-size:330px;line-height:.86;letter-spacing:-.045em;margin-left:-10px;
    font-variation-settings:"opsz" 96;background:linear-gradient(180deg,#fff 30%,color-mix(in srgb,var(--acc) 55%,#fff));-webkit-background-clip:text;color:transparent}
  .cd-dagen{font-family:'Bricolage';font-weight:800;font-size:92px;letter-spacing:-.03em;margin-top:6px}
  .cd-sub{font-size:33px;line-height:1.4;color:rgba(255,255,255,.66);margin-top:26px;max-width:660px}
  .cd-sub b{color:#fff;font-weight:600}
  .cd-list{margin-top:auto;margin-bottom:44px;display:flex;flex-direction:column;gap:14px;max-width:640px}
  .cd-when{font-weight:600;font-size:27px;color:rgba(255,255,255,.55);margin-bottom:4px}
  .cd-row{display:flex;align-items:center;gap:22px;font-size:34px;padding:18px 26px;border-radius:22px;
    background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1)}
  .cd-niv{font-weight:800;font-size:25px;letter-spacing:.06em;padding:7px 14px;border-radius:10px;
    background:color-mix(in srgb,var(--niv) 34%,transparent);color:color-mix(in srgb,var(--niv) 22%,#fff);min-width:104px;text-align:center}
  .cd-vak{font-weight:600;flex:1}
  .cd-tijd{color:rgba(255,255,255,.55);font-weight:600}
  .story .cd-big{font-size:400px}
  .story .cd-list{margin-bottom:70px}`;

  const inhoud = (story) => `
    <div class="glow"></div><div class="line"></div>
    ${top(chip('Eindexamen 2027'))}
    <div class="body">
      <div class="cd-nog cd-eyebrow">Nog</div>
      <div class="cd-big num">${dagen}</div>
      <div class="cd-dagen">dagen</div>
      <div class="cd-sub">tot de eerste centrale examens. Dat zijn nog <b>${weekendenTot} weekenden</b>.</div>
      <div class="cd-list"><div class="cd-when">Het begint op ${datumNL(startDatum)}</div>${rijen}</div>
    </div>
    ${mascot(mood, story ? 360 : 300, story ? 'right:40px;bottom:250px' : 'right:34px;bottom:210px')}
    ${foot('slagio.nl')}`;

  return {
    dagen, startDatum, weekenden: weekendenTot,
    feed: [slide({ cls: 'dark', acc: BRAND, css, body: inhoud(false) })],
    story: [slide({ h: 1920, cls: 'dark story', acc: BRAND, css, body: inhoud(true) })],
  };
}

// ── 2. EXAMENVRAAG (carrousel van 4) ─────────────────────────────────────────
export function examenvraag(q) {
  const niv = NIVEAUS[q.niveau];
  const vak = vakken(q.niveau).find(v => v.id === q.vakId);
  const acc = niv.kleur;
  const letters = ['A', 'B', 'C', 'D'];
  const kop = chip(`${niv.label} · ${vak.naam}`);
  const N = 4;

  // De meest verleidelijke fout: een fout antwoord met een echte uitleg erbij.
  const valkuil = q.perOptie
    ? q.opties.map((o, i) => ({ o, i, u: q.perOptie[i] })).filter(x => x.i !== q.juist && x.u && x.u.replace(/^nee[,.:]?\s*/i, '').length >= 14)[0]
    : null;

  const css = `
  .ev-cover-t{font-family:'Bricolage';font-weight:800;font-size:150px;line-height:.92;letter-spacing:-.018em;margin-top:120px;max-width:700px}
  .ev-cover-t em{font-style:normal;color:color-mix(in srgb,var(--acc) 45%,#fff)}
  .ev-cover-s{font-size:36px;line-height:1.4;color:rgba(255,255,255,.66);margin-top:36px;max-width:620px}
  .ev-cover-s b{color:#fff;font-weight:600}
  .ev-qbox{flex-shrink:0;max-height:340px;display:flex}
  .ev-center{justify-content:center;padding-bottom:30px}
  .ev-q{width:100%;font-family:'Bricolage';font-weight:700;font-size:66px;line-height:1.1;letter-spacing:-.02em;max-height:340px;overflow:hidden;text-wrap:balance}
  .ev-opts{flex-shrink:0;display:flex;flex-direction:column;gap:18px;margin-top:54px}
  .ev-opt{display:flex;align-items:center;gap:26px;background:#fff;border:2px solid var(--line);border-radius:26px;padding:22px 28px;height:122px}
  .ev-l{flex:0 0 64px;height:64px;border-radius:50%;display:grid;place-items:center;font-family:'Bricolage';font-weight:800;font-size:32px;
    color:var(--acc);border:3px solid color-mix(in srgb,var(--acc) 35%,transparent);background:color-mix(in srgb,var(--acc) 7%,#fff)}
  .ev-t{flex:1;font-size:38px;font-weight:600;line-height:1.2;max-height:92px;overflow:hidden}
  .ev-opt.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 7%,#fff)}
  .ev-opt.ok .ev-l{background:var(--ok);border-color:var(--ok);color:#fff}
  .ev-ans-lbl{margin-top:0}
  .ev-exp{font-size:46px;line-height:1.4;margin-top:40px;color:#23262f;max-height:330px;overflow:hidden}
  .ev-trap{margin-top:48px;background:#fff;border:2px solid var(--line);border-radius:26px;padding:28px 32px}
  .ev-trap-h{font-weight:700;font-size:28px;color:var(--mu);margin-bottom:10px}
  .ev-trap-t{font-size:34px;line-height:1.4;max-height:150px;overflow:hidden}
  .cta-t{font-family:'Bricolage';font-weight:800;font-size:112px;line-height:.95;letter-spacing:-.018em;margin-top:120px;max-width:760px}
  .cta-list{display:flex;flex-direction:column;gap:22px;margin-top:56px}
  .cta-li{display:flex;align-items:center;gap:22px;font-size:37px;font-weight:500;color:rgba(255,255,255,.85)}
  .cta-li i{flex:0 0 16px;height:16px;border-radius:50%;background:var(--brand)}
  .cta-pill{margin-top:auto;margin-bottom:54px;align-self:flex-start;display:inline-flex;align-items:center;gap:18px;
    background:var(--brand);color:#fff;font-family:'Bricolage';font-weight:800;font-size:44px;padding:26px 44px;border-radius:26px}
  .cta-pill small{font-family:'Inter';font-weight:600;font-size:28px;opacity:.85}`;

  const opties = (toon) => q.opties.map((o, i) => `
      <div class="ev-opt${toon && i === q.juist ? ' ok' : ''}"><span class="ev-l">${letters[i]}</span><span class="ev-t" data-fit="28">${esc(o)}</span></div>`).join('');

  return { slides: [
    slide({ cls: 'dark', acc, niv: acc, css, body: `<div class="glow"></div><div class="line"></div>${top(kop)}
      <div class="body"><div class="ev-cover-t">Kun jij <em>deze</em>?</div>
        <div class="ev-cover-s">Een vraag uit <b>${esc(q.domeinNaam || vak.naam)}</b>. Kies eerst zelf je antwoord, swipe daarna.</div></div>
      ${mascot('denk', 390, 'right:10px;bottom:120px')}${foot('Examenvraag van de week', 0, N)}` }),

    slide({ cls: 'light', acc, niv: acc, css, body: `${top(kop)}
      <div class="body ev-center"><div class="ev-qbox" data-fitbox="1"><div class="ev-q" data-fit="40">${esc(q.vraag)}</div></div>
        <div class="ev-opts">${opties(false)}</div></div>${foot('A, B, C of D?', 1, N)}` }),

    slide({ cls: 'light', acc, niv: acc, css, body: `${top(kop)}
      <div class="body ev-center"><div class="label ev-ans-lbl">Het antwoord</div>
        <div class="ev-opts" style="margin-top:22px"><div class="ev-opt ok"><span class="ev-l">${letters[q.juist]}</span><span class="ev-t" data-fit="28">${esc(q.opties[q.juist])}</span></div></div>
        <div class="ev-exp" data-fit="30">${esc(q.uitleg)}</div>
        ${valkuil ? `<div class="ev-trap"><div class="ev-trap-h">Waarom niet ${letters[valkuil.i]}?</div><div class="ev-trap-t" data-fit="26">${esc(valkuil.u.replace(/^nee[,.:]?\s*/i, '').replace(/^./, c => c.toUpperCase()))}</div></div>` : ''}
      </div>${foot('Goed gegokt?', 2, N)}` }),

    cta(3, N, css, `Zo oefen je er nog 20.000.`, [
      'Echte examenvragen van 2019 tot 2025',
      'Bij elk antwoord uitleg, ook als je het fout hebt',
      'Gratis, zonder account',
    ], 'feest'),
  ] };
}

function cta(i, N, css, titel, punten, mood) {
  return slide({ cls: 'dark', acc: BRAND, css, body: `<div class="glow"></div><div class="line"></div>${top('')}
    <div class="body"><div class="cta-t">${esc(titel)}</div>
      <div class="cta-list">${punten.map(p => `<div class="cta-li"><i></i>${esc(p)}</div>`).join('')}</div>
      <div class="cta-pill">slagio.nl <small>link in bio</small></div></div>
    ${mascot(mood, 330, 'right:30px;bottom:150px')}${foot('Gratis oefenen voor je eindexamen', i, N)}` });
}

// ── 3. BEGRIPPEN (carrousel van 7) ─────────────────────────────────────────
export function begrippen(set, gekozen) {
  const niv = NIVEAUS[set.niveau];
  const vak = vakken(set.niveau).find(v => v.id === set.vakId);
  const vakKleur = vak.kleur || niv.kleur;
  const totaal = (vak.domeinen || []).reduce((s, d) => s + (d.nBeg || 0), 0);
  const N = gekozen.length + 2;
  const kop = chip(`${niv.label} · ${vak.naam}`);

  const css = `
  .bg-cover-t{font-family:'Bricolage';font-weight:800;font-size:132px;line-height:.93;letter-spacing:-.018em;margin-top:110px;max-width:760px}
  .bg-cover-t em{font-style:normal;color:color-mix(in srgb,var(--acc) 40%,#fff)}
  .bg-cover-s{font-size:36px;line-height:1.4;color:rgba(255,255,255,.66);margin-top:34px;max-width:640px}
  .bg-cover-s b{color:#fff;font-weight:600}
  .bg-top{position:absolute;inset:0 0 auto 0;height:640px;background:var(--acc)}
  .bg-top::after{content:'';position:absolute;inset:0;background:radial-gradient(80% 90% at 100% 0%,rgba(255,255,255,.22),transparent 60%)}
  .bgs .top,.bgs .top .brand{color:#fff}
  .bgs .chip{background:rgba(255,255,255,.18);color:#fff;border-color:rgba(255,255,255,.35)}
  .bg-teller{flex-shrink:0;position:relative;z-index:2;font-weight:700;font-size:28px;color:rgba(255,255,255,.8);margin-top:92px;letter-spacing:.02em}
  .bg-term-box{flex-shrink:0;position:relative;z-index:2;height:310px;display:flex;align-items:flex-end;padding-bottom:40px}
  .bg-term{width:100%;font-family:'Bricolage';font-weight:800;font-size:124px;line-height:.98;letter-spacing:-.03em;color:#fff;max-height:260px;overflow:hidden;text-wrap:balance}
  .bg-def{min-height:0;font-size:52px;line-height:1.36;font-weight:500;color:#20232d;margin-top:150px;max-height:410px;overflow:hidden}
  .bg-def::first-letter{text-transform:uppercase}
  .bg-dom{margin-top:auto;margin-bottom:34px;font-weight:600;font-size:28px;color:var(--mu)}
  ${''}`;

  const cover = slide({ cls: 'dark', acc: vakKleur, niv: niv.kleur, css, body: `<div class="glow"></div><div class="line"></div>${top(kop)}
    <div class="body"><div class="bg-cover-t">5 begrippen die je <em>moet</em> kennen</div>
      <div class="bg-cover-s">Uit <b>${esc(set.domeinNaam)}</b>. Sla deze op, dan heb je ze straks bij de hand.</div></div>
    ${mascot('lees', 360, 'right:20px;bottom:130px')}${foot(`${esc(vak.naam)} · ${niv.label}`, 0, N)}` });

  const kaarten = gekozen.map((b, k) => slide({ cls: 'light bgs', acc: vakKleur, niv: niv.kleur, css, body: `
    <div class="bg-top"></div>${top(kop)}
    <div class="body"><div class="bg-teller">Begrip ${k + 1} van ${gekozen.length}</div>
      <div class="bg-term-box" data-fitbox="1"><div class="bg-term" data-fit="64">${esc(b.t)}</div></div>
      <div class="bg-def" data-fit="34">${esc(b.d)}</div>
      <div class="bg-dom">${esc(set.domeinNaam)}</div></div>
    ${foot('slagio.nl', k + 1, N)}` }));

  return { slides: [
    cover, ...kaarten,
    cta(N - 1, N, css + `
  .cta-t{font-family:'Bricolage';font-weight:800;font-size:106px;line-height:.95;letter-spacing:-.018em;margin-top:120px;max-width:760px}
  .cta-list{display:flex;flex-direction:column;gap:22px;margin-top:56px}
  .cta-li{display:flex;align-items:center;gap:22px;font-size:37px;font-weight:500;color:rgba(255,255,255,.85)}
  .cta-li i{flex:0 0 16px;height:16px;border-radius:50%;background:var(--brand)}
  .cta-pill{margin-top:auto;margin-bottom:54px;align-self:flex-start;display:inline-flex;align-items:center;gap:18px;
    background:var(--brand);color:#fff;font-family:'Bricolage';font-weight:800;font-size:44px;padding:26px 44px;border-radius:26px}
  .cta-pill small{font-family:'Inter';font-weight:600;font-size:28px;opacity:.85}`,
      `Nog ${totaal} begrippen van ${vak.naam}.`, [
        'Als flashcards die je slim laten herhalen',
        'Met uitleg per domein van het examen',
        'Gratis, zonder account',
      ], 'blij'),
  ], totaalBegrippen: totaal };
}

// ── 4. REEL-KAARTEN (begin + eind van de faceless video, 9:16) ───────────────
export function reelKaarten(niveauId, vakNaam, hook) {
  const niv = NIVEAUS[niveauId];
  const css = `
  .rk-t{font-family:'Bricolage';font-weight:800;font-size:128px;line-height:.95;letter-spacing:-.018em;margin-top:260px;text-wrap:balance}
  .rk-t em{font-style:normal;color:color-mix(in srgb,var(--acc) 40%,#fff)}
  .rk-s{font-size:44px;line-height:1.35;color:rgba(255,255,255,.68);margin-top:44px;max-width:820px}
  .rk-pill{margin-top:70px;align-self:flex-start;display:inline-flex;align-items:center;gap:20px;background:var(--brand);color:#fff;
    font-family:'Bricolage';font-weight:800;font-size:64px;padding:34px 58px;border-radius:34px}`;
  const [kop, rest] = hook.includes(':') ? [hook.slice(0, hook.indexOf(':') + 1), hook.slice(hook.indexOf(':') + 1)] : ['', hook];
  const intro = slide({ h: 1920, cls: 'dark', acc: niv.kleur, niv: niv.kleur, css, body: `<div class="glow"></div><div class="line"></div>
    ${top(chip(`${niv.label} · ${vakNaam}`))}
    <div class="body"><div class="rk-t">${kop ? `<em>${esc(kop)}</em>` : ''}${esc(rest)}</div></div>
    ${mascot('denk', 480, 'right:40px;bottom:170px')}${foot('slagio.nl')}` });
  const outro = slide({ h: 1920, cls: 'dark', acc: '#E85C0D', css, body: `<div class="glow"></div><div class="line"></div>${top('')}
    <div class="body"><div class="rk-t">Gratis. Zonder account.</div>
      <div class="rk-s">Echte examenvragen voor ${esc(vakNaam)} en nog 39 andere vakken, met uitleg bij elk antwoord.</div>
      <div class="rk-pill">slagio.nl</div></div>
    ${mascot('feest', 500, 'right:30px;bottom:160px')}${foot('Link in bio')}` });
  return { intro, outro };
}
