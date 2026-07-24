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
  // Flat-vector vos (Duolingo-stijl). Gesloten glimlach per stemming (cx60, ~cy60).
  const M = {
    blij:   { mouth: 'M53 60 Q60 67 67 60', brow: '',                                       spark: false, eyeUp: 0, wink: false },
    trots:  { mouth: 'M50 59 Q60 71 70 59', brow: 'M39 30 Q46 25 53 29 M67 29 Q74 25 81 30', spark: true,  eyeUp: 0, wink: false },
    goed:   { mouth: 'M54 60 Q60 66 66 60', brow: '',                                       spark: false, eyeUp: 0, wink: false },
    laag:   { mouth: 'M54 63 Q60 58 66 63', brow: 'M39 32 Q46 29 53 32 M67 32 Q74 29 81 32', spark: false, eyeUp: 0, wink: false },
    kijk:   { mouth: 'M56 61 Q60 64 64 61', brow: '',                                       spark: false, eyeUp: 1, wink: false },
    knipoog:{ mouth: 'M53 60 Q60 67 67 60', brow: '',                                       spark: true,  eyeUp: 0, wink: true },
  };
  const s = M[mood] || M.blij;
  const dy = (s.eyeUp ? -2.6 : 0.9);
  const eye = (cx) => `<ellipse cx="${cx}" cy="41" rx="9" ry="10.5" fill="#fff"/>`;
  const pup = (cx) => `<circle cx="${cx}" cy="${41 + dy}" r="5.4" fill="#2e2a39"/><circle cx="${cx + 2.1}" cy="${38.3 + dy}" r="2.2" fill="#fff"/><circle cx="${cx - 1.8}" cy="${43.5 + dy}" r="1.1" fill="#fff" opacity=".85"/>`;
  const eyesInner = s.wink
    ? `${eye(47)}<g class="m-pupils">${pup(47)}</g><path d="M65 41 Q73 34 81 41" stroke="#2e2a39" stroke-width="3" stroke-linecap="round" fill="none"/>`
    : `${eye(47)}${eye(73)}<g class="m-pupils">${pup(47)}${pup(73)}</g>`;
  // palet
  const OR = '#fb8c3e', SH = '#e9701f', CR = '#fff1dd', DK = '#2e2a39', NO = '#3b2a22';
  return `<svg class="m-svg" viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="${MASCOT_NAME}, de vos-studiemaatje-mascotte">
    <defs><radialGradient id="mCheek" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff8fa3" stop-opacity=".8"/><stop offset="1" stop-color="#ff8fa3" stop-opacity="0"/></radialGradient></defs>
    <ellipse class="m-shadow" cx="60" cy="115" rx="30" ry="6"/>
    <g class="m-fig">
      <!-- staart -->
      <g class="m-tail">
        <path d="M44 96 C22 100 9 89 12 74 C14 63 28 62 31 74 C27 87 34 95 47 92 Z" fill="${OR}"/>
        <path d="M15 72 C8 74 7 84 13 87 C20 89 24 80 21 73 Z" fill="${CR}"/>
      </g>
      <!-- pootjes -->
      <ellipse cx="49" cy="108" rx="8.5" ry="5.5" fill="${SH}"/><ellipse cx="71" cy="108" rx="8.5" ry="5.5" fill="${SH}"/>
      <!-- achter-armpje -->
      <path d="M40 84 C33 88 32 96 37 100" stroke="${OR}" stroke-width="10" stroke-linecap="round" fill="none"/>
      <circle cx="37" cy="100" r="5.5" fill="${OR}"/>
      <!-- lijf -->
      <path d="M60 64 C76 64 85 77 85 90 C85 104 74 110 60 110 C46 110 35 104 35 90 C35 77 44 64 60 64 Z" fill="${OR}"/>
      <path d="M60 66 C71 66 79 78 79 92 C79 103 71 107 60 107 C49 107 41 103 41 92 C41 78 49 66 60 66 Z" fill="${CR}"/>
      <path d="M60 110 C74 110 85 104 85 90 C85 96 82 101 78 104 C72 108 66 109 60 109 C54 109 48 108 42 104 C38 101 35 96 35 90 C35 104 46 110 60 110 Z" fill="${SH}" opacity=".35"/>
      <!-- kop -->
      <g class="m-head">
        <g class="m-ear-l"><path d="M43 27 C33 9 20 8 23 23 C25 33 37 34 43 27 Z" fill="${OR}"/><path d="M40 24 C34 15 28 15 30 23 C31 29 37 29 40 24 Z" fill="${CR}"/></g>
        <g class="m-ear-r"><path d="M77 27 C87 9 100 8 97 23 C95 33 83 34 77 27 Z" fill="${OR}"/><path d="M80 24 C86 15 92 15 90 23 C89 29 83 29 80 24 Z" fill="${CR}"/></g>
        <path d="M60 12 C39 12 27 27 27 45 C27 63 40 72 60 72 C80 72 93 63 93 45 C93 27 81 12 60 12 Z" fill="${OR}"/>
        <ellipse cx="47" cy="30" rx="15" ry="10" fill="#ffb877" opacity=".5"/>
        <path d="M31 50 C24 55 21 62 27 63 C33 64 36 58 35 53 Z" fill="${CR}"/>
        <path d="M89 50 C96 55 99 62 93 63 C87 64 84 58 85 53 Z" fill="${CR}"/>
        <g class="m-cap">
          <path d="M60 3 L89 15 L60 27 L31 15 Z" fill="#2e3350"/>
          <path d="M60 3 L89 15 L60 20 Z" fill="#3c4374"/>
          <circle cx="60" cy="15" r="2.5" fill="#facc15"/>
          <path class="m-tassel" d="M60 15 C74 17 76 24 75 31" stroke="#facc15" stroke-width="2" fill="none"/>
          <circle class="m-tassel" cx="75" cy="32" r="3.4" fill="#f59e0b"/>
        </g>
        <!-- tweekleurige snuit -->
        <path d="M35 46 C40 41 47 41 51 45 C55 49 65 49 69 45 C73 41 80 41 85 46 C88 59 76 71 60 71 C44 71 32 59 35 46 Z" fill="${CR}"/>
        <g class="m-eyes">${eyesInner}</g>
        ${s.brow ? `<g stroke="${DK}" stroke-width="2.6" stroke-linecap="round" fill="none">${s.brow}</g>` : ''}
        <circle cx="36" cy="56" r="6.5" fill="url(#mCheek)"/><circle cx="84" cy="56" r="6.5" fill="url(#mCheek)"/>
        <!-- neusje -->
        <path d="M54 49 Q60 45 66 49 Q64 57 60 58 Q56 57 54 49 Z" fill="${NO}"/>
        <path d="M60 58 v3" stroke="${NO}" stroke-width="1.8" stroke-linecap="round"/>
        <!-- mond (dicht) + praat-frames -->
        <path class="m-mouth" d="${s.mouth}" stroke="${NO}" stroke-width="3" stroke-linecap="round" fill="none"/>
        <g class="m-mouth-talk">
          <path class="mt mt-c" d="M55 61 Q60 64 65 61" stroke="${NO}" stroke-width="2.6" stroke-linecap="round" fill="none"/>
          <ellipse class="mt mt-a" cx="60" cy="62" rx="4.6" ry="6" fill="${NO}"/>
          <ellipse class="mt mt-b" cx="60" cy="61" rx="7.5" ry="3" fill="${NO}"/>
          <ellipse class="mt-tongue" cx="60" cy="63.5" rx="3" ry="2" fill="#ff8a9e"/>
        </g>
      </g>
      <!-- zwaai-armpje -->
      <g class="m-wave">
        <path d="M80 82 C89 80 95 71 96 62" stroke="${OR}" stroke-width="10" stroke-linecap="round" fill="none"/>
        <circle cx="96" cy="60" r="6" fill="${OR}"/>
      </g>
      ${s.spark ? `<g class="m-spark" fill="#facc15"><path d="M99 10 l2.3 5.6 5.6 2.3 -5.6 2.3 -2.3 5.6 -2.3 -5.6 -5.6 -2.3 5.6 -2.3z"/><circle cx="20" cy="24" r="2.4"/><circle cx="96" cy="38" r="1.8"/></g>` : ''}
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
