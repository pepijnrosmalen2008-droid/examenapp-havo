// ═══════════════════════════════════════════════════════════════════════
// mascotte.js — VONK, de mascotte van Slagio.
// Herbruikbaar over de hele site: roep mascotSVG(stemming, grootte) aan en
// plaats het resultaat waar je wilt. mascotBubble() geeft Vonk + spraakbubbel.
// Eén naam-constante stuurt overal zijn naam.
// Animaties (bob/zwaai/kwast/knipper/spark) zitten in styles.css onder .m-*.
// ═══════════════════════════════════════════════════════════════════════

var MASCOT_NAME = 'Vonk';

// Stemmingen: blij (default) · trots · goed · laag (bemoedigend) · kijk (nieuwsgierig) · knipoog
function mascotSVG(mood, size) {
  size = size || 96;
  // gesloten-mond (glimlach) per stemming, onder de snuit (cx60, ~cy60)
  const M = {
    blij:   { mouth: 'M53 59 Q60 66 67 59', brow: '',                                       spark: false, eyeUp: 0, wink: false },
    trots:  { mouth: 'M51 58 Q60 69 69 58', brow: 'M41 33 Q47 29 53 32 M67 32 Q73 29 79 33', spark: true,  eyeUp: 0, wink: false },
    goed:   { mouth: 'M54 59 Q60 65 66 59', brow: '',                                       spark: false, eyeUp: 0, wink: false },
    laag:   { mouth: 'M54 62 Q60 57 66 62', brow: 'M41 35 Q47 32 53 35 M67 35 Q73 32 79 35', spark: false, eyeUp: 0, wink: false },
    kijk:   { mouth: 'M56 60 Q60 63 64 60', brow: '',                                       spark: false, eyeUp: 1, wink: false },
    knipoog:{ mouth: 'M53 59 Q60 66 67 59', brow: '',                                       spark: true,  eyeUp: 0, wink: true },
  };
  const s = M[mood] || M.blij;
  const dy = (s.eyeUp ? -2 : 0.5);
  // ogen op de kop (cx49/71, cy40); rechteroog knipoogt bij 'knipoog'
  const eye = (cx) => `<ellipse cx="${cx}" cy="40" rx="8" ry="9" fill="#fff"/>`;
  const pup = (cx) => `<circle cx="${cx}" cy="${40 + dy}" r="3.8" fill="#232741"/><circle cx="${cx + 1.5}" cy="${38.5 + dy}" r="1.4" fill="#fff"/>`;
  const eyesInner = s.wink
    ? `${eye(49)}<g class="m-pupils">${pup(49)}</g><path d="M64 40 Q71 34 78 40" stroke="#232741" stroke-width="2.8" stroke-linecap="round" fill="none"/>`
    : `${eye(49)}${eye(71)}<g class="m-pupils">${pup(49)}${pup(71)}</g>`;
  return `<svg class="m-svg" viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="${MASCOT_NAME}, de vos-studiemaatje-mascotte">
    <defs>
      <linearGradient id="mBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffa860"/><stop offset=".55" stop-color="#f5731a"/><stop offset="1" stop-color="#df560a"/></linearGradient>
      <linearGradient id="mCap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3c4163"/><stop offset="1" stop-color="#242840"/></linearGradient>
      <radialGradient id="mCheek" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff8fa3" stop-opacity=".8"/><stop offset="1" stop-color="#ff8fa3" stop-opacity="0"/></radialGradient>
    </defs>
    <ellipse class="m-shadow" cx="60" cy="114" rx="29" ry="5.5"/>
    <g class="m-fig">
      <!-- staart -->
      <g class="m-tail"><path d="M40 94 q-24 6 -25 -13 q-1 -13 12 -13 q-6 15 15 17 z" fill="url(#mBody)" stroke="#c34d07" stroke-width="1.2"/><path d="M18 66 q-8 1 -8 11 q7 6 13 1 q-7 -4 -5 -13z" fill="#ffe9cf"/></g>
      <!-- pootjes -->
      <ellipse cx="50" cy="107" rx="8" ry="5.5" fill="#c34d07"/><ellipse cx="70" cy="107" rx="8" ry="5.5" fill="#c34d07"/>
      <!-- achter-armpje -->
      <path d="M34 76 q-9 5 -8 15" stroke="url(#mBody)" stroke-width="8.5" stroke-linecap="round" fill="none"/>
      <!-- lijf -->
      <path d="M60 56 C81 56 83 78 81 89 C79 101 69 105 60 105 C51 105 41 101 39 89 C37 78 39 56 60 56Z" fill="url(#mBody)" stroke="#c34d07" stroke-width="1.5"/>
      <ellipse cx="60" cy="90" rx="14" ry="14" fill="#ffe9cf"/>
      <!-- kop -->
      <g class="m-head">
        <g class="m-ear-l"><path d="M45 30 L33 5 L58 21 Z" fill="url(#mBody)" stroke="#c34d07" stroke-width="1.2"/><path d="M46 26 L41 13 L54 22 Z" fill="#ffe9cf"/></g>
        <g class="m-ear-r"><path d="M75 30 L87 5 L62 21 Z" fill="url(#mBody)" stroke="#c34d07" stroke-width="1.2"/><path d="M74 26 L79 13 L66 22 Z" fill="#ffe9cf"/></g>
        <circle cx="60" cy="42" r="25" fill="url(#mBody)" stroke="#c34d07" stroke-width="1.5"/>
        <g class="m-cap">
          <path d="M60 6 L86 16 L60 26 L34 16 Z" fill="url(#mCap)"/>
          <path d="M60 6 L86 16 L60 20 Z" fill="#4c527a" opacity=".55"/>
          <circle cx="60" cy="16" r="2.4" fill="#facc15"/>
          <path class="m-tassel" d="M60 16 q16 2 15 12" stroke="#facc15" stroke-width="2" fill="none"/>
          <circle class="m-tassel" cx="75" cy="30" r="3.2" fill="#f59e0b"/>
        </g>
        <!-- snuit -->
        <ellipse cx="60" cy="55" rx="16" ry="13" fill="#ffe9cf"/>
        <g class="m-eyes">${eyesInner}</g>
        ${s.brow ? `<g stroke="#232741" stroke-width="2.4" stroke-linecap="round" fill="none">${s.brow}</g>` : ''}
        <circle cx="38" cy="52" r="6" fill="url(#mCheek)"/><circle cx="82" cy="52" r="6" fill="url(#mCheek)"/>
        <!-- neusje -->
        <path d="M56 48 Q60 45 64 48 Q62 53 60 53 Q58 53 56 48Z" fill="#2a1c12"/>
        <path d="M60 53 v3" stroke="#2a1c12" stroke-width="1.6" stroke-linecap="round"/>
        <!-- mond (dicht) + praat-frames -->
        <path class="m-mouth" d="${s.mouth}" stroke="#232741" stroke-width="3" stroke-linecap="round" fill="none"/>
        <g class="m-mouth-talk">
          <path class="mt mt-c" d="M55 60 Q60 63 65 60" stroke="#3a1f16" stroke-width="2.6" stroke-linecap="round" fill="none"/>
          <ellipse class="mt mt-a" cx="60" cy="61" rx="4.6" ry="6.2" fill="#3a1f16"/>
          <ellipse class="mt mt-b" cx="60" cy="60" rx="8" ry="3" fill="#3a1f16"/>
          <ellipse class="mt-tongue" cx="60" cy="62.5" rx="3" ry="2" fill="#ff7a8a"/>
        </g>
      </g>
      <!-- zwaai-armpje -->
      <g class="m-wave">
        <path d="M84 76 q11 -3 15 -14" stroke="url(#mBody)" stroke-width="8.5" stroke-linecap="round" fill="none"/>
        <circle cx="100" cy="60" r="6" fill="url(#mBody)" stroke="#c34d07" stroke-width="1.1"/>
      </g>
      ${s.spark ? `<g class="m-spark" fill="#facc15"><path d="M96 12 l2.2 5.4 5.4 2.2 -5.4 2.2 -2.2 5.4 -2.2 -5.4 -5.4 -2.2 5.4 -2.2z"/><circle cx="22" cy="26" r="2.3"/><circle cx="92" cy="36" r="1.7"/></g>` : ''}
    </g>
  </svg>`;
}

// ─── Vonk die van de zijkant binnenglijdt, iets zegt, en weer wegduikt ───
// Geen vaste widget: hij komt op, praat, en verdwijnt. vonkSay(msg, opts).
// opts: {mood, side:'left'|'right', size, duration(ms, 0=blijft), once:'sleutel'
//        (max 1× ooit tonen), action:{label, onclick}}.
// Klikbare pagina-verwijzingen in Vonk's tekst. Schrijf {{Label|sleutel}} en
// het wordt een link die naar dat scherm navigeert.
var VONK_NAV = {
  home:        function () { show('sc-home'); },
  vakken:      function () { show('sc-home'); const g = document.getElementById('vakgrid'); if (g) g.scrollIntoView({ behavior: 'smooth' }); },
  foutenboek:  function () { if (typeof openFoutenboek === 'function') openFoutenboek(); else show('sc-foutenboek'); },
  studieplan:  function () { show('sc-studieplan'); if (typeof renderStudieplan === 'function' && localStorage.getItem('slagio_plan_generated')) try { renderStudieplan(); } catch (e) {} },
  leaderboard: function () { show('sc-leaderboard'); if (typeof renderLeaderboard === 'function') try { renderLeaderboard(); } catch (e) {} },
  rooster:     function () { show('sc-schedule'); if (typeof renderSchedule === 'function') try { renderSchedule(); } catch (e) {} },
  cijfers:     function () { show('sc-calc'); if (typeof prefillCalcFromSaved === 'function') setTimeout(prefillCalcFromSaved, 50); },
  profiel:     function () { if (typeof openProfiel === 'function') openProfiel(); else show('sc-profiel'); },
  simulatie:   function () { show('sc-simtoets'); },
  groep:       function () { show('sc-groep'); if (typeof renderGroepScreen === 'function') try { renderGroepScreen(); } catch (e) {} },
};
function vonkNav(key) { vonkHide(); const f = VONK_NAV[key]; if (f) try { f(); } catch (e) {} }
function vonkRenderMsg(msg) {
  return String(msg).replace(/\{\{([^|}]+)\|([^}]+)\}\}/g, function (_, label, key) {
    return `<a class="vonk-link" role="button" tabindex="0" onclick="vonkNav('${key.trim()}')">${label}</a>`;
  });
}
function _vonkPlain(msg) { return String(msg).replace(/\{\{([^|}]+)\|[^}]+\}\}/g, '$1').replace(/<[^>]+>/g, ''); }

var _vonkTimer = null;
function vonkSay(msg, opts) {
  opts = opts || {};
  if (opts.once) { const k = 'slagio_vonk_' + opts.once; try { if (localStorage.getItem(k)) return; localStorage.setItem(k, '1'); } catch (e) {} }
  const rendered = vonkRenderMsg(msg);
  const plainLen = _vonkPlain(msg).length;
  let stage = document.getElementById('vonk-stage');
  if (!stage) { stage = document.createElement('div'); stage.id = 'vonk-stage'; document.body.appendChild(stage); }
  const side = opts.side || 'left';
  const mood = opts.mood || 'blij';
  const size = opts.size || 92;
  const act = opts.action ? `<button class="vonk-act">${opts.action.label}</button>` : '';
  stage.className = 'vonk-stage vonk-' + side;
  stage.setAttribute('role', 'status'); stage.setAttribute('aria-live', 'polite');
  stage.innerHTML = `<div class="vonk-peek">
    <div class="vonk-fig">${mascotSVG(mood, size)}</div>
    <div class="vonk-say">
      <button class="vonk-x" aria-label="Sluiten">✕</button>
      <div class="vonk-say-name">${MASCOT_NAME}</div>
      <div class="vonk-say-msg">${rendered}</div>
      ${act}
    </div>
  </div>`;
  const fig = stage.querySelector('.vonk-fig');
  const close = () => { clearTimeout(_vonkTimer); clearTimeout(stage._talkT); stage.classList.remove('vonk-in'); if (opts.onClose) { try { opts.onClose(); } catch (e) {} } setTimeout(() => { if (stage && !stage.classList.contains('vonk-in')) stage.innerHTML = ''; }, 480); };
  stage._close = close;
  const xb = stage.querySelector('.vonk-x'); if (xb) xb.onclick = close;
  const ab = stage.querySelector('.vonk-act');
  if (ab && opts.action) ab.onclick = () => { try { if (typeof opts.action.onclick === 'function') opts.action.onclick(); else if (typeof opts.action.onclick === 'string') (new Function(opts.action.onclick))(); } catch (e) {} close(); };
  requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add('vonk-in')));
  // Vonk "praat" terwijl de bubbel binnenkomt, en zakt daarna terug in een glimlach.
  if (fig) { setTimeout(() => fig.classList.add('talking'), 260); stage._talkT = setTimeout(() => fig.classList.remove('talking'), Math.min(5200, 1400 + plainLen * 48)); }
  const dur = (opts.duration != null) ? opts.duration : Math.min(12000, 4000 + plainLen * 55);
  clearTimeout(_vonkTimer);
  if (dur > 0) _vonkTimer = setTimeout(close, dur);
}
function vonkHide() { const s = document.getElementById('vonk-stage'); if (s && s._close) s._close(); }

// Centrale uitleg-teksten: Vonk legt features uit, elk max 1× (once-sleutel).
function vonkOnboard(where) {
  const T = {
    home:       { once: 'welkom',     mood: 'blij',    msg: `Hoi, ik ben <b>Vonk</b>, je studiemaatje! Kies een {{vak|vakken}} en start een quiz — daarna vertel ik je precies hoe je ervoor staat. 👋` },
    foutenboek: { once: 'foutenboek', mood: 'kijk',    msg: `Elke fout die je maakt bewaar ik hier. Ik plan wanneer je ze het beste opnieuw oefent, zodat de stof blijft hangen. 📕` },
    studieplan: { once: 'studieplan', mood: 'goed',    msg: `Dit is jouw plan tot het examen. Ik zet elke dag klaar wát je oefent — begin met de rode dingen. 📅` },
    quiz:       { once: 'quiztip',    mood: 'knipoog', msg: `Tip: hoe sneller je goed antwoordt, hoe meer punten. Maar onthoud: goed gaat vóór snel. 😉` },
    coach:      { once: 'coachtip',   mood: 'trots',   msg: `Na elke quiz spring ik hier tevoorschijn met je verwachte cijfer en waar de meeste winst zit. Tot zo! ✨` },
  };
  const t = T[where]; if (!t) return;
  vonkSay(t.msg, { mood: t.mood, once: t.once });
}

// ─── Hoek-Vonk: altijd klein aanwezig; tik → uitleg over dít scherm ───
var VONK_EXPLAIN = {
  'sc-home':       { mood: 'blij', msg: `Dit is je startpunt. Kies onderaan een {{vak|vakken}} om te oefenen, tik op {{Foutenboek|foutenboek}} om fouten te herhalen, of open je {{Studieplan|studieplan}}. Na elke quiz vertel ik hoe je ervoor staat!` },
  'sc-detail':     { mood: 'goed', msg: `Alle domeinen van dit vak. <b>Groen</b> = onder de knie, <b>rood</b> = daar liggen punten. Tik een domein en kies een quiz.` },
  'sc-qmode':      { mood: 'goed', msg: `Kies hóé je oefent: <b>Snelle quiz</b> (tegen de klok, telt voor het {{leaderboard|leaderboard}}) of <b>Oud-examen</b>. Begin gerust met de snelle quiz.` },
  'sc-studieplan': { mood: 'goed', msg: `Je persoonlijke plan tot het examen. Ik zet per dag klaar wát je oefent — begin met de rode dingen. Je {{Foutenboek|foutenboek}}-fouten staan er ook bij.` },
  'sc-foutenboek': { mood: 'kijk', msg: `Al je foute antwoorden verzamel ik hier, mét waaróm het fout ging. Ik plan wanneer je ze het best herhaalt — en zet ze ook in je {{Studieplan|studieplan}}.` },
  'sc-leaderboard':{ mood: 'trots',msg: `Hier zie je hoe je scoort tegen andere leerlingen. Sneller én accurater = hogere score. Zin om te {{oefenen|vakken}}?` },
  'sc-calc':       { mood: 'goed', msg: `Reken uit welk cijfer je nog nodig hebt of wat je gemiddelde wordt. Bekijk ook je {{examenrooster|rooster}}.` },
  'sc-profiel':    { mood: 'blij', msg: `Je profiel: je dier-avatar groeit mee met je XP. Hier staan je badges, je streak en je voortgang.` },
  'sc-schedule':   { mood: 'goed', msg: `Je examenrooster. Vink je vakken (en eventueel herkansingen) aan — daar bouw ik je {{Studieplan|studieplan}} op.` },
  'sc-simtoets':   { mood: 'kijk', msg: `Een volledige oefentoets onder examen-omstandigheden. Ideaal als een examen dichtbij is.` },
  'sc-groep':      { mood: 'blij', msg: `Je klas of groep: samen oefenen en elkaars voortgang zien. Vergelijk op het {{leaderboard|leaderboard}}.` },
  'sc-res':        { mood: 'trots',msg: `Je resultaat! Ik laat je verwachte examencijfer zien en waar de meeste winst zit. Je fouten staan in je {{Foutenboek|foutenboek}}.` },
};
function vonkExplain() {
  const cur = document.querySelector('.sc.on');
  const id = cur ? cur.id : 'sc-home';
  const e = VONK_EXPLAIN[id] || { mood: 'kijk', msg: `Ik help je graag! Kijk hier rond en tik ergens — heb je een vraag, dan duik ik op waar ik kan. 😊` };
  const corner = document.getElementById('vonk-corner');
  if (corner) corner.style.visibility = 'hidden';
  vonkSay(e.msg, { mood: e.mood, side: 'right', duration: 0, onClose: () => { if (corner) corner.style.visibility = ''; } });
}
// Toont/verbergt de hoek-Vonk per scherm; wordt vanuit show() aangeroepen.
function updateVonkCorner(id) {
  id = id || ((document.querySelector('.sc.on') || {}).id);
  vonkHide(); // sluit een eventuele openstaande bubbel bij schermwissel
  const HIDE = ['sc-quiz', 'sc-flash', 'sc-qmode', 'sc-welcome', 'sc-race', 'sc-intro', 'sc-auth'];
  let el = document.getElementById('vonk-corner');
  if (HIDE.indexOf(id) !== -1) { if (el) el.style.display = 'none'; return; }
  if (!el) {
    el = document.createElement('button');
    el.id = 'vonk-corner'; el.className = 'vonk-corner';
    el.setAttribute('aria-label', MASCOT_NAME + ' — uitleg over dit scherm');
    el.innerHTML = `<span class="vonk-corner-fig">${mascotSVG('blij', 58)}</span><span class="vonk-corner-q">?</span>`;
    el.onclick = vonkExplain;
    document.body.appendChild(el);
  }
  el.style.display = ''; el.style.visibility = '';
}

// Vonk + spraakbubbel als herbruikbaar blok. opts: {name, size, dark, actionsHTML, fineHTML}
function mascotBubble(msg, mood, opts) {
  opts = opts || {};
  const size = opts.size || 84;
  const name = (opts.name !== undefined) ? opts.name : `${MASCOT_NAME} · je studiemaatje`;
  return `<div class="coach-pop coach-mood-${mood || 'blij'}${opts.dark ? ' coach-dark' : ''}">
    ${opts.closable === false ? '' : `<button class="coach-x" onclick="this.closest('.coach-pop').classList.add('coach-hide')" aria-label="Sluiten">✕</button>`}
    <div class="coach-avatar">${mascotSVG(mood, size)}</div>
    <div class="coach-bubble">
      ${name ? `<div class="coach-name">${name}</div>` : ''}
      <div class="coach-msg">${msg}</div>
      ${opts.actionsHTML || ''}
      ${opts.fineHTML || ''}
    </div>
  </div>`;
}
