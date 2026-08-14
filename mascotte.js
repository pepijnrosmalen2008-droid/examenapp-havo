// ═══════════════════════════════════════════════════════════════════════
// mascotte.js, VONK, de mascotte van Slagio.
// Herbruikbaar over de hele site: roep mascotSVG(stemming, grootte) aan en
// plaats het resultaat waar je wilt. mascotBubble() geeft Vonk + spraakbubbel.
// Eén naam-constante stuurt overal zijn naam.
// Animaties (bob/zwaai/kwast/knipper/spark) zitten in styles.css onder .m-*.
// ═══════════════════════════════════════════════════════════════════════

var MASCOT_NAME = 'Vonk';
var _VONK_SKIN_PREVIEW = ''; // tijdelijke skin-override voor winkel-previews

// Stemmingen: blij (default) · trots · goed · laag (bemoedigend) · kijk (nieuwsgierig) · knipoog
function mascotSVG(mood, size) {
  size = size || 96;
  // Uitgeruste Vonk-skin (leest de equip live, of een preview-override uit de winkel).
  // Kroon/feesthoed vervangen de standaard afstudeerpet; bril en sjaal komen er bovenop.
  const _vsk = _VONK_SKIN_PREVIEW || ((typeof getEquippedVonk === 'function') ? getEquippedVonk() : '');
  const _hideCap = (_vsk === 'vk_crown' || _vsk === 'vk_party');
  // Flat-vector vos (Duolingo-stijl). Gesloten glimlach per stemming (cx60, ~cy60).
  const M = {
    blij:   { mouth: 'M51 60 Q60 70 69 60', brow: '',                                       arms: 'wave' },
    trots:  { mouth: 'M48 57 Q60 76 72 57 Q60 63 48 57 Z', brow: 'M39 28 Q46 23 53 27 M67 27 Q74 23 81 28', spark: true, filled: true, arms: 'hips' },
    goed:   { mouth: 'M53 60 Q60 68 67 60', brow: '',                                       arms: 'wave' },
    laag:   { mouth: 'M51 65 Q60 55 69 65', brow: 'M38 34 Q46 28 54 34 M66 34 Q74 28 82 34', arms: 'down' },
    kijk:   { mouth: 'M56 61 Q60 64 64 61', brow: '',                                       eyeUp: 1, arms: 'down' },
    knipoog:{ mouth: 'M51 60 Q60 70 69 60', brow: '',                                       spark: true, wink: true, arms: 'wave' },
    feest:  { mouth: 'M47 56 Q60 78 73 56 Q60 63 47 56 Z', brow: '',                         spark: true, filled: true, cheer: true, arms: 'cheer' },
    denk:   { mouth: 'M55 61 Q60 63 65 61', brow: '',                                       eyeUp: 1, prop: 'think', arms: 'chin' },
    oeps:   { mouth: 'M53 63 Q60 71 67 63 Q60 66 53 63 Z', brow: 'M38 33 Q46 29 54 33 M66 33 Q74 29 82 33', filled: true, prop: 'sweat', arms: 'down' },
    liefde: { mouth: 'M47 56 Q60 77 73 56 Q60 63 47 56 Z', brow: '',                         filled: true, heartEyes: true, prop: 'hearts', arms: 'down' },
    slaap:  { mouth: 'M56 61 Q60 63 64 61', brow: '',                                       sleep: true, prop: 'zzz', arms: 'down' },
    lees:   { mouth: 'M56 61 Q60 63 64 61', brow: '',                                       eyeDn: 1, prop: 'book', arms: 'read' },
  };
  const s = M[mood] || M.blij;
  const dy = (s.eyeUp ? -2.6 : (s.eyeDn ? 3.4 : 0.9));
  const eye = (cx) => `<ellipse cx="${cx}" cy="41" rx="9" ry="10.5" fill="#fff"/>`;
  const pup = (cx) => `<circle cx="${cx}" cy="${41 + dy}" r="5.4" fill="#2e2a39"/><circle cx="${cx + 2.1}" cy="${38.3 + dy}" r="2.2" fill="#fff"/><circle cx="${cx - 1.8}" cy="${43.5 + dy}" r="1.1" fill="#fff" opacity=".85"/>`;
  const heartEye = (cx) => `<path transform="translate(${cx},42)" d="M0 -1 C-2.6 -5 -8 -2.4 -6.4 1.4 C-5.2 4.2 -1.4 6 0 8 C1.4 6 5.2 4.2 6.4 1.4 C8 -2.4 2.6 -5 0 -1 Z" fill="#ff5a7a"/>`;
  const sleepEye = (cx) => `<path d="M${cx - 7} 41 Q${cx} 47 ${cx + 7} 41" stroke="#2e2a39" stroke-width="3" stroke-linecap="round" fill="none"/>`;
  const eyesInner = s.heartEyes
    ? `<g class="m-hearteyes">${heartEye(47)}${heartEye(73)}</g>`
    : s.sleep
    ? `${sleepEye(47)}${sleepEye(73)}`
    : s.wink
    ? `${eye(47)}<g class="m-pupils">${pup(47)}</g><path d="M65 41 Q73 34 81 41" stroke="#2e2a39" stroke-width="3" stroke-linecap="round" fill="none"/>`
    : `${eye(47)}${eye(73)}<g class="m-pupils">${pup(47)}${pup(73)}</g>`;
  // palet
  const OR = '#fb8c3e', SH = '#e9701f', CR = '#fff1dd', DK = '#2e2a39', NO = '#3b2a22';
  // Paw = volle oranje poot met een crème kussentje (hoogwaardiger dan een platte cirkel).
  const paw = (cx, cy, r) => `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${(r * 1.04).toFixed(1)}" fill="${OR}"/><ellipse cx="${cx}" cy="${(cy + r * 0.36).toFixed(1)}" rx="${(r * 0.6).toFixed(1)}" ry="${(r * 0.46).toFixed(1)}" fill="${CR}" opacity=".92"/>`;
  // props (denkwolk / zweetdruppel / hartjes / zzz)
  const PROPS = {
    think: `<g class="m-prop m-think"><circle cx="92" cy="34" r="3" fill="#fff" stroke="#d9dee8"/><circle cx="99" cy="27" r="4.5" fill="#fff" stroke="#d9dee8"/><ellipse cx="108" cy="16" rx="11" ry="8" fill="#fff" stroke="#d9dee8"/><text x="108" y="20" font-size="10" font-weight="700" text-anchor="middle" fill="#94a0b8">?</text></g>`,
    sweat: `<path class="m-prop m-sweat" d="M86 38 C82 45 82 50 86 50 C90 50 90 45 86 38 Z" fill="#7dd3fc"/>`,
    hearts: `<g class="m-prop m-hearts" fill="#ff6b9d"><path d="M92 26 C90 22 84 24 86 29 C87 32 91 34 92 36 C93 34 97 32 98 29 C100 24 94 22 92 26 Z"/><path d="M26 32 C24.5 29 20 30.5 21.5 34 C22 36 25 37.5 26 39 C27 37.5 30 36 30.5 34 C32 30.5 27.5 29 26 32 Z" opacity=".8"/></g>`,
    zzz: `<g class="m-prop m-zzz" fill="#94a0b8" font-family="var(--font-head)" font-weight="900"><text x="86" y="26" font-size="10">z</text><text x="94" y="20" font-size="13">Z</text></g>`,
    // Open boekje dat Vonk met beide poten vasthoudt (voor laadschermen).
    book: `<g class="m-prop m-book">
      <path d="M40 82 C34 88 38 95 46 97" stroke="${OR}" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="M80 82 C86 88 82 95 74 97" stroke="${OR}" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="M60 84 C51 80 43 81 39 83 L41 100 C45 98 52 98 60 102 Z" fill="#eef2fb" stroke="#c3cad9" stroke-width="1.2"/>
      <path d="M60 84 C69 80 77 81 81 83 L79 100 C75 98 68 98 60 102 Z" fill="#f8fafd" stroke="#c3cad9" stroke-width="1.2"/>
      <path d="M60 84 L60 102" stroke="#c3cad9" stroke-width="1.4"/>
      <g stroke="#d3d9e6" stroke-width="1" stroke-linecap="round" fill="none"><path d="M45 88h10M45 91h9M46 94h8"/><path d="M66 88h10M66 91h9M66 94h8"/></g>
      ${paw(44, 99, 5.2)}${paw(76, 99, 5.2)}
    </g>`,
  };
  const prop = s.prop ? (PROPS[s.prop] || '') : '';
  // armen per stemming (niet altijd zwaaien)
  const aDownL = `<g class="m-arm-l"><path d="M40 84 C32 88 31 96 37 100" stroke="${OR}" stroke-width="12" stroke-linecap="round" fill="none"/>${paw(37, 100, 6.3)}</g>`;
  const aDownR = `<path d="M80 84 C88 88 89 96 83 100" stroke="${OR}" stroke-width="12" stroke-linecap="round" fill="none"/>${paw(83, 100, 6.3)}`;
  const aWaveR = `<g class="m-wave"><path d="M80 82 C90 80 96 71 97 62" stroke="${OR}" stroke-width="12" stroke-linecap="round" fill="none"/>${paw(97, 60, 6.8)}</g>`;
  const aCheerL = `<g class="m-cheer-l"><path d="M42 80 C32 71 29 61 32 51" stroke="${OR}" stroke-width="12" stroke-linecap="round" fill="none"/>${paw(32, 50, 6.8)}</g>`;
  const aCheerR = `<g class="m-cheer-r"><path d="M78 80 C89 71 92 61 89 51" stroke="${OR}" stroke-width="12" stroke-linecap="round" fill="none"/>${paw(89, 50, 6.8)}</g>`;
  const aHipL = `<path d="M42 82 C33 82 32 90 41 92" stroke="${OR}" stroke-width="12" stroke-linecap="round" fill="none"/>${paw(42, 92, 6.3)}`;
  const aHipR = `<path d="M78 82 C87 82 88 90 79 92" stroke="${OR}" stroke-width="12" stroke-linecap="round" fill="none"/>${paw(78, 92, 6.3)}`;
  const aChinR = `<path d="M80 82 C88 76 74 70 63 66" stroke="${OR}" stroke-width="10.5" stroke-linecap="round" fill="none"/>${paw(61, 65, 6)}`;
  let leftArm, rightArm;
  switch (s.arms) {
    case 'read':  leftArm = ''; rightArm = ''; break; // armen zitten in het boek-prop (bovenlaag)
    case 'cheer': leftArm = aCheerL; rightArm = aCheerR; break;
    case 'hips':  leftArm = aHipL;  rightArm = aHipR;  break;
    case 'chin':  leftArm = aDownL; rightArm = aChinR; break;
    case 'wave':  leftArm = aDownL; rightArm = aWaveR; break;
    default:      leftArm = aDownL; rightArm = aDownR;
  }
  return `<svg class="m-svg m-mood-${mood || 'blij'}" viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="${MASCOT_NAME}, de vos-studiemaatje-mascotte">
    <defs><radialGradient id="mCheek" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff8fa3" stop-opacity=".8"/><stop offset="1" stop-color="#ff8fa3" stop-opacity="0"/></radialGradient></defs>
    <ellipse class="m-shadow" cx="60" cy="115" rx="30" ry="6"/>
    <g class="m-fig">
      <!-- staart -->
      <g class="m-tail">
        <path d="M44 96 C22 100 9 89 12 74 C14 63 28 62 31 74 C27 87 34 95 47 92 Z" fill="${OR}"/>
        <path d="M15 72 C8 74 7 84 13 87 C20 89 24 80 21 73 Z" fill="${CR}"/>
      </g>
      <!-- voetjes: volle oranje poot met crème kussentje (past bij de handen) -->
      <ellipse cx="49" cy="109" rx="9.5" ry="6.2" fill="${OR}"/><ellipse cx="49" cy="110.5" rx="5.8" ry="3.4" fill="${CR}" opacity=".92"/>
      <ellipse cx="71" cy="109" rx="9.5" ry="6.2" fill="${OR}"/><ellipse cx="71" cy="110.5" rx="5.8" ry="3.4" fill="${CR}" opacity=".92"/>
      <!-- linkerarm (per stemming) -->
      ${leftArm}
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
        ${_hideCap ? '' : `<g class="m-cap">
          <path d="M60 3 L89 15 L60 27 L31 15 Z" fill="#2e3350"/>
          <path d="M60 3 L89 15 L60 20 Z" fill="#3c4374"/>
          <circle cx="60" cy="15" r="2.5" fill="#facc15"/>
          <path class="m-tassel" d="M60 15 C74 17 76 24 75 31" stroke="#facc15" stroke-width="2" fill="none"/>
          <circle class="m-tassel" cx="75" cy="32" r="3.4" fill="#f59e0b"/>
        </g>`}
        <!-- tweekleurige snuit -->
        <path d="M35 46 C40 41 47 41 51 45 C55 49 65 49 69 45 C73 41 80 41 85 46 C88 59 76 71 60 71 C44 71 32 59 35 46 Z" fill="${CR}"/>
        <g class="m-eyes">${eyesInner}</g>
        ${s.brow ? `<g stroke="${DK}" stroke-width="2.6" stroke-linecap="round" fill="none">${s.brow}</g>` : ''}
        <circle cx="36" cy="56" r="6.5" fill="url(#mCheek)"/><circle cx="84" cy="56" r="6.5" fill="url(#mCheek)"/>
        <!-- neusje -->
        <path d="M54 49 Q60 45 66 49 Q64 57 60 58 Q56 57 54 49 Z" fill="${NO}"/>
        <path d="M60 58 v3" stroke="${NO}" stroke-width="1.8" stroke-linecap="round"/>
        <!-- mond (dicht) + praat-frames -->
        <path class="m-mouth" d="${s.mouth}" stroke="${NO}" stroke-width="3" stroke-linecap="round" fill="${s.filled ? NO : 'none'}"/>
        <g class="m-mouth-talk">
          <path class="mt mt-c" d="M55 61 Q60 64 65 61" stroke="${NO}" stroke-width="2.6" stroke-linecap="round" fill="none"/>
          <ellipse class="mt mt-a" cx="60" cy="62" rx="4.6" ry="6" fill="${NO}"/>
          <ellipse class="mt mt-b" cx="60" cy="61" rx="7.5" ry="3" fill="${NO}"/>
          <ellipse class="mt-tongue" cx="60" cy="63.5" rx="3" ry="2" fill="#ff8a9e"/>
        </g>
        <!-- geeuw (idle): crème dekje over de glimlach + wijd open mond -->
        <g class="m-yawn">
          <ellipse cx="60" cy="63" rx="10" ry="5.2" fill="${CR}"/>
          <ellipse cx="60" cy="64" rx="5.4" ry="6.6" fill="${NO}"/>
          <ellipse cx="60" cy="67" rx="3" ry="2.2" fill="#ff8a9e"/>
        </g>
      </g>
      <!-- rechterarm (per stemming) -->
      ${rightArm}
      ${s.spark ? `<g class="m-spark" fill="#facc15"><path d="M99 10 l2.3 5.6 5.6 2.3 -5.6 2.3 -2.3 5.6 -2.3 -5.6 -5.6 -2.3 5.6 -2.3z"/><circle cx="20" cy="24" r="2.4"/><circle cx="96" cy="38" r="1.8"/></g>` : ''}
      ${prop}
      ${_vonkSkinSVG(_vsk)}
    </g>
  </svg>`;
}
// Gekochte Vonk-skin als écht gedragen SVG-accessoire, precies op de anatomie:
// bril op de ogen (47,41)/(73,41), kroon/feesthoed op de kop, sjaal om de hals.
function _vonkSkinSVG(id) {
  if (!id && typeof getEquippedVonk === 'function') id = getEquippedVonk();
  switch (id) {
    case 'vk_glass': return `<g class="vk-skin vk-glass">
      <path d="M35 40 L28 35" stroke="#20242e" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M85 40 L92 35" stroke="#20242e" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="36" y="33.5" width="21" height="15" rx="7" fill="#20242e" opacity=".93"/>
      <rect x="63" y="33.5" width="21" height="15" rx="7" fill="#20242e" opacity=".93"/>
      <path d="M57 39 Q60 37 63 39" stroke="#20242e" stroke-width="2.6" fill="none"/>
      <ellipse cx="43" cy="38" rx="3.4" ry="2.1" fill="#fff" opacity=".22"/>
      <ellipse cx="70" cy="38" rx="3.4" ry="2.1" fill="#fff" opacity=".22"/></g>`;
    case 'vk_crown': return `<g class="vk-skin vk-crown">
      <path d="M43 23 L46 12 L53 18 L60 8 L67 18 L74 12 L77 23 Z" fill="#f5c518" stroke="#d4a017" stroke-width="1.3"/>
      <rect x="43" y="21.5" width="34" height="5.5" rx="2.2" fill="#e0a90f"/>
      <circle cx="60" cy="10.5" r="1.9" fill="#ff5a7a"/><circle cx="46.5" cy="13.5" r="1.5" fill="#5b8def"/><circle cx="73.5" cy="13.5" r="1.5" fill="#5b8def"/></g>`;
    case 'vk_party': return `<g class="vk-skin vk-party">
      <path d="M60 1 L71 23 L49 23 Z" fill="#f472b6" stroke="#db2777" stroke-width="1"/>
      <path d="M60 1 L65 11 L55 11 Z" fill="#facc15"/>
      <circle cx="60" cy="1.5" r="2.7" fill="#facc15"/>
      <circle cx="56" cy="17" r="1.7" fill="#fff" opacity=".85"/><circle cx="64" cy="14" r="1.4" fill="#fff" opacity=".7"/></g>`;
    case 'vk_scarf': return `<g class="vk-skin vk-scarf">
      <path d="M42 65 Q60 77 78 65 L78 71 Q60 82 42 71 Z" fill="#e5484d"/>
      <path d="M68 70 L76 88 L70 89 L64 72 Z" fill="#c93b3f"/></g>`;
    default: return '';
  }
}

// ─── Vonk-animatie-API: speel een bewegings-state op een Vonk-instance ───
// target: element dat een .m-svg bevat (of de .m-svg zelf) of een selector.
// state: 'happy'|'jump'|'celebrate'|'sad'|'nod'|'think'|'wave'|'run'|'evolve'.
// ms=0 → blijft doorlopen (bv. 'run'); anders auto-stop na de duur.
var _VONK_STATE_MS = { happy: 600, jump: 820, celebrate: 1180, sad: 2200, nod: 640, think: 1420, wave: 920, run: 0, evolve: 1520 };
function _vonkSvgOf(target) {
  if (typeof target === 'string') target = document.querySelector(target);
  if (!target) return null;
  return (target.classList && target.classList.contains('m-svg')) ? target : target.querySelector('.m-svg');
}
function _vonkClearStates(svg) {
  if (!svg) return;
  Array.prototype.slice.call(svg.classList).forEach(function (c) { if (/^m-do-/.test(c)) svg.classList.remove(c); });
}
function vonkPlay(target, state, ms) {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var svg = _vonkSvgOf(target); if (!svg) return;
    _vonkClearStates(svg);
    void svg.offsetWidth;                       // herstart de animatie
    svg.classList.add('m-do-' + state);
    clearTimeout(svg._vpT);
    var dur = (ms != null) ? ms : (_VONK_STATE_MS[state] != null ? _VONK_STATE_MS[state] : 800);
    if (dur > 0) svg._vpT = setTimeout(function () { try { svg.classList.remove('m-do-' + state); } catch (e) {} }, dur + 40);
  } catch (e) {}
}
function vonkStop(target) {
  try { var svg = _vonkSvgOf(target); if (!svg) return; clearTimeout(svg._vpT); _vonkClearStates(svg); } catch (e) {}
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
  herhalen:    function () { if (typeof openHerhalen === 'function') openHerhalen(); else show('sc-herhalen'); },
};
function vonkNav(key) {
  const f = VONK_NAV[key]; if (!f) return;
  try { f(); } catch (e) {}
  // Vonk volgt je mee en legt de nieuwe pagina uit; hij verdwijnt dus niet zomaar.
  setTimeout(function () { try { vonkExplain(); } catch (e) {} }, 430);
}
function vonkRenderMsg(msg, plain) {
  return String(msg).replace(/\{\{([^|}]+)\|([^}]+)\}\}/g, function (_, label, key) {
    if (plain) return `<b>${label}</b>`;
    return `<a class="vonk-link" role="button" tabindex="0" onclick="vonkNav('${key.trim()}')">${label}</a>`;
  });
}
function _vonkPlain(msg) { return String(msg).replace(/\{\{([^|}]+)\|[^}]+\}\}/g, '$1').replace(/<[^>]+>/g, ''); }

var _vonkTimer = null;
// Vonk mag niet "door een paar berichten heen flitsen" bij het openen: meerdere
// vonkSay-aanroepen kort na elkaar worden samengevoegd tot één render (de laatste
// binnen het venster wint), zodat er meteen één juist bericht verschijnt.
var _vonkSayT = null, _vonkSayPending = null;
function vonkSay(msg, opts) {
  _vonkSayPending = { msg: msg, opts: opts || {} };
  clearTimeout(_vonkSayT);
  _vonkSayT = setTimeout(_vonkSayRender, 120);
}
function _vonkSayRender() {
  const _p = _vonkSayPending; _vonkSayPending = null;
  if (!_p) return;
  const msg = _p.msg; const opts = _p.opts || {};
  if (opts.once) { const k = 'slagio_vonk_' + opts.once; try { if (localStorage.getItem(k)) return; localStorage.setItem(k, '1'); } catch (e) {} }
  const rendered = vonkRenderMsg(msg, opts.plainLinks);
  const plainLen = _vonkPlain(msg).length;
  let stage = document.getElementById('vonk-stage');
  if (!stage) { stage = document.createElement('div'); stage.id = 'vonk-stage'; document.body.appendChild(stage); }
  const side = opts.side || 'left';
  const mood = opts.mood || 'blij';
  const size = opts.size || 92;
  const act = opts.action ? `<button class="vonk-act">${opts.action.label}</button>` : '';
  // Denk-beat: Vonk overweegt eerst (denk-pose) en begint daarna pas te praten.
  const startMood = opts.think ? 'denk' : mood;
  const figCls = 'vonk-fig' + (opts.action ? ' vonk-has-cta' : '');
  stage.className = 'vonk-stage vonk-' + side;
  stage.setAttribute('role', 'status'); stage.setAttribute('aria-live', 'polite');
  stage.innerHTML = `<div class="vonk-peek">
    <div class="${figCls}">${mascotSVG(startMood, size)}</div>
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
  if (ab && opts.action) ab.onclick = () => { try { if (typeof opts.action.onclick === 'function') opts.action.onclick(); else if (typeof opts.action.onclick === 'string') (new Function(opts.action.onclick))(); } catch (e) {} if (!opts.action.keepOpen) close(); };
  requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add('vonk-in')));
  // Levendige entree: Vonk zwaait/knikt even bij binnenkomst (niet bij 'think').
  if (fig && !opts.think) { try { vonkPlay(fig, (mood === 'blij' || mood === 'goed' || mood === 'trots') ? 'wave' : 'nod'); } catch (e) {} }
  // Vonk "praat" terwijl de bubbel binnenkomt, en zakt daarna terug in een glimlach.
  // Met opts.think denkt hij eerst even na (denk-pose) en wisselt dan naar praten.
  if (fig) {
    const talkDelay = opts.think ? 900 : 260;
    const talkDur = Math.min(5200, 1400 + plainLen * 48);
    if (opts.think) setTimeout(() => { fig.innerHTML = mascotSVG(mood, size); }, talkDelay - 20);
    // Visemes: de mond loopt door mondstanden die uit de tekst zijn afgeleid,
    // op spreektempo - i.p.v. een generieke praat-lus.
    setTimeout(() => { try { if (typeof vonkSpeak === 'function') vonkSpeak(fig, msg, talkDur); else fig.classList.add('talking'); } catch (e) { fig.classList.add('talking'); } }, talkDelay);
    stage._talkT = setTimeout(() => { try { if (typeof vonkSpeakStop === 'function') vonkSpeakStop(fig); else fig.classList.remove('talking'); } catch (e) { fig.classList.remove('talking'); } }, talkDelay + talkDur);
  }
  const dur = (opts.duration != null) ? opts.duration : Math.min(12000, 4000 + plainLen * 55);
  clearTimeout(_vonkTimer);
  if (dur > 0) _vonkTimer = setTimeout(close, dur);
}
function vonkHide() { const s = document.getElementById('vonk-stage'); if (s && s._close) s._close(); }

// ─── Visemes: mondstanden gesynchroniseerd met de "gesproken" tekst ───
// Geen audio → we leiden de mondstanden (dicht/open/wijd/smal) af uit de letters
// en lopen ze op spreektempo door. Klinkers openen de mond, medeklinkers sluiten
// hem, spaties = korte rust. Dat leest natuurlijker dan een generieke praat-lus.
function _vonkVisemeSeq(plain) {
  var seq = [];
  for (var i = 0; i < plain.length; i++) {
    var ch = plain.charAt(i).toLowerCase();
    if (/\s/.test(ch)) { if (seq.length && seq[seq.length - 1] !== 'rest') seq.push('rest'); continue; }
    if ('aáàâä'.indexOf(ch) >= 0 || 'oóòôö'.indexOf(ch) >= 0) seq.push('wide');
    else if ('eéèêë'.indexOf(ch) >= 0) seq.push('open');
    else if ('iíìïuúùûüy'.indexOf(ch) >= 0) seq.push('narrow');
    else if (/[a-z]/.test(ch)) seq.push(seq.length % 2 ? 'open' : 'closed');
    else if (/[.,!?;:]/.test(ch)) { if (seq.length && seq[seq.length - 1] !== 'rest') seq.push('rest'); }
  }
  return seq;
}
function _vonkVisemeApply(fig, v) {
  var mtC = fig.querySelector('.mt-c'), mtA = fig.querySelector('.mt-a'), mtB = fig.querySelector('.mt-b'), tongue = fig.querySelector('.mt-tongue');
  var oC = 0, oA = 0, oB = 0, oT = 0;
  if (v === 'wide') { oB = 1; oT = 1; }
  else if (v === 'open') { oA = 1; }
  else if (v === 'narrow') { oA = 1; }
  else { oC = 1; }                       // closed / rest → smalle curve
  if (mtC) mtC.style.opacity = oC; if (mtA) mtA.style.opacity = oA; if (mtB) mtB.style.opacity = oB; if (tongue) tongue.style.opacity = oT;
  // Smalle klank = mond iets samengeknepen.
  if (mtA) mtA.style.transform = (v === 'narrow') ? 'scaleX(.6)' : '';
}
function vonkSpeak(fig, text, totalMs) {
  try {
    if (!fig || !fig.querySelector('.m-mouth-talk')) { if (fig) fig.classList.add('talking'); return; }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { fig.classList.add('talking'); return; }
    var plain = (typeof _vonkPlain === 'function') ? _vonkPlain(text) : String(text || '');
    var seq = _vonkVisemeSeq(plain);
    if (!seq.length) { fig.classList.add('talking'); return; }
    fig.classList.add('talking', 'm-viseme');
    var step = Math.max(72, Math.min(150, (totalMs || seq.length * 100) / seq.length));
    var idx = 0;
    clearInterval(fig._vsT);
    _vonkVisemeApply(fig, seq[0]); idx = 1;
    fig._vsT = setInterval(function () {
      if (idx >= seq.length) { vonkSpeakStop(fig); return; }
      _vonkVisemeApply(fig, seq[idx]); idx++;
    }, step);
  } catch (e) { try { fig.classList.add('talking'); } catch (_) {} }
}
function vonkSpeakStop(fig) {
  try {
    if (!fig) return;
    clearInterval(fig._vsT);
    fig.classList.remove('m-viseme', 'talking');
    var mts = fig.querySelectorAll('.mt, .mt-tongue');
    for (var i = 0; i < mts.length; i++) { mts[i].style.opacity = ''; mts[i].style.transform = ''; }
  } catch (e) {}
}

// ─── Feest! Vonk juicht met slingers + confetti (celebration-overlay) ───
function vonkCelebrate(caption, opts) {
  opts = opts || {};
  const old = document.getElementById('vonk-celebrate'); if (old) old.remove();
  const cols = ['#fb8c3e', '#22c55e', '#6366f1', '#facc15', '#ff6b9d', '#38bdf8'];
  let confetti = '';
  for (let i = 0; i < 46; i++) {
    const l = Math.round(Math.random() * 100), delay = (Math.random() * 0.6).toFixed(2),
      dur = (1.5 + Math.random() * 1.5).toFixed(2), c = cols[i % cols.length],
      sz = 6 + Math.round(Math.random() * 6);
    confetti += `<span class="vc-confetti" style="left:${l}%;background:${c};width:${sz}px;height:${Math.round(sz * .55 + 2)}px;animation-delay:${delay}s;animation-duration:${dur}s"></span>`;
  }
  // slinger (bunting) met driehoekige vlaggetjes
  let flags = '';
  for (let f = 0; f < 10; f++) { const x = f * 11 + 3; flags += `<polygon points="${x},7 ${x + 8},7 ${x + 4},17" fill="${cols[f % cols.length]}"/>`; }
  const bunting = `<svg class="vc-bunting" viewBox="0 0 110 22" preserveAspectRatio="none"><path d="M0 7 Q55 14 110 7" stroke="rgba(255,255,255,.5)" stroke-width="1.4" fill="none"/>${flags}</svg>`;
  const svg = (typeof vonkHolder === 'function') ? vonkHolder('feest', 156, 'celebrate') : ((typeof mascotSVG === 'function') ? mascotSVG('feest', 156) : '🎉');
  const ov = document.createElement('div');
  ov.id = 'vonk-celebrate'; ov.className = 'vonk-celebrate'; ov.setAttribute('aria-hidden', 'true');
  ov.innerHTML = `${bunting}<div class="vc-confetti-wrap">${confetti}</div>
    <div class="vc-stage"><div class="vc-vonk">${svg}</div>${caption ? `<div class="vc-caption">${caption}</div>` : ''}</div>`;
  document.body.appendChild(ov);
  try { vonkEvent('level_up',{el:ov.querySelector('.vc-vonk'),silent:true}); } catch (e) {}
  try { if (typeof playSound === 'function') playSound('complete'); } catch (e) {}
  try { if (typeof haptic === 'function') haptic([30, 40, 30, 40, 80]); } catch (e) {}
  const kill = () => { ov.classList.add('vc-out'); setTimeout(() => { if (ov.parentNode) ov.remove(); }, 450); };
  ov.addEventListener('click', kill);
  setTimeout(kill, opts.duration || 2800);
}

// ─── Snelle Vonk-reactie (bv. tijdens de quiz): klein, kort, niet-blokkerend ───
var _vonkReactT = null;
function vonkReact(mood, text, opts) {
  opts = opts || {};
  let el = document.getElementById('vonk-react');
  if (!el) { el = document.createElement('div'); el.id = 'vonk-react'; el.className = 'vonk-react'; document.body.appendChild(el); }
  el.innerHTML = `<div class="vr-fig">${mascotSVG(mood || 'blij', 64)}</div>${text ? `<div class="vr-chip">${text}</div>` : ''}`;
  el.classList.remove('vr-in'); void el.offsetWidth; el.classList.add('vr-in');
  try { vonkPlay(el.querySelector('.vr-fig'), mood === 'oeps' || mood === 'laag' ? 'sad' : mood === 'feest' ? 'happy' : 'nod'); } catch (e) {}
  clearTimeout(_vonkReactT);
  _vonkReactT = setTimeout(() => { if (el) el.classList.remove('vr-in'); }, opts.duration || 1500);
}

// ─── Laad-overlay: Vonk leest een boekje terwijl data laadt ───
// Verschijnt pas na ~200ms zodat snelle (gecachete) loads nooit flitsen.
var _vlTimer = null;
function vonkLoading(caption) {
  clearTimeout(_vlTimer);
  _vlTimer = setTimeout(function () {
    let el = document.getElementById('vonk-loading');
    if (!el) {
      el = document.createElement('div'); el.id = 'vonk-loading'; el.className = 'vonk-loading';
      el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.innerHTML = '<div class="vl-card"><div class="vl-vonk">' + mascotSVG('lees', 120) + '</div>'
      + '<div class="vl-cap">' + (caption || 'Even laden…') + '</div>'
      + '<div class="vl-dots"><span></span><span></span><span></span></div></div>';
    requestAnimationFrame(function () { el.classList.add('on'); });
  }, 200);
}
function vonkLoadingHide() {
  clearTimeout(_vlTimer);
  const el = document.getElementById('vonk-loading');
  if (el) { el.classList.remove('on'); setTimeout(function () { if (el && !el.classList.contains('on')) el.remove(); }, 260); }
}

// ─── Streak-reddernudge: Vonk smeekt je je streak te redden (Duolingo-stijl) ───
// Toont zich als je een lopende streak hebt maar vandaag nog niet oefende.
// Max 1× per dag én per sessie. Geeft true terug als hij getoond is.
function vonkStreakNudge() {
  try {
    if (typeof calcStreak !== 'function' || typeof getStreak !== 'function') return false;
    if (window._vonkNudged) return false;
    const cur = (calcStreak().current || 0);
    if (cur < 2) return false;                                  // pas nuttig vanaf 2 dagen
    const today = new Date().toISOString().slice(0, 10);
    const days = (getStreak().days) || [];
    if (days.includes(today)) return false;                     // al geoefend → streak veilig
    if (!localStorage.getItem('slagio_vonk_intro_done')) return false; // niet tijdens de intro
    try { if (localStorage.getItem('slagio_vonk_nudge') === today) return false; } catch (e) {}
    try { localStorage.setItem('slagio_vonk_nudge', today); } catch (e) {}
    window._vonkNudged = true;
    vonkSay(`Je <b>${cur}-dagen streak</b> loopt gevaar! 🔥 Eén snelle quiz vandaag en hij blijft staan.`, {
      mood: 'laag', side: 'left', size: 96, duration: 0, plainLinks: true,
      action: { label: 'Red mijn streak →', onclick: function () { try { startStreakQuiz(); } catch (e) {} } }
    });
    try { trackEvent('vonk_streaknudge', { streak: cur }); } catch (e) {}
    return true;
  } catch (e) { return false; }
}

// Centrale uitleg-teksten: Vonk legt features uit, elk max 1× (once-sleutel).
function vonkOnboard(where) {
  const T = {
    home:       { once: 'welkom',     mood: 'blij',    msg: `Hoi, ik ben <b>Vonk</b>, je studiemaatje! Kies een {{vak|vakken}} en start een quiz, daarna vertel ik je precies hoe je ervoor staat. 👋` },
    foutenboek: { once: 'foutenboek', mood: 'kijk',    msg: `Elke fout die je maakt bewaar ik hier. Ik plan wanneer je ze het beste opnieuw oefent, zodat de stof blijft hangen. 📕` },
    studieplan: { once: 'studieplan', mood: 'goed',    msg: `Dit is jouw plan tot het examen. Ik zet elke dag klaar wát je oefent, begin met de rode dingen. 📅` },
    quiz:       { once: 'quiztip',    mood: 'knipoog', msg: `Tip: hoe sneller je goed antwoordt, hoe meer punten. Maar onthoud: goed gaat vóór snel. 😉` },
    coach:      { once: 'coachtip',   mood: 'trots',   msg: `Na elke quiz spring ik hier tevoorschijn met je verwachte cijfer en waar de meeste winst zit. Tot zo! ✨` },
  };
  const t = T[where]; if (!t) return;
  vonkSay(t.msg, { mood: t.mood, once: t.once });
}

// ─── Vonk-geleide intro voor nieuwe gebruikers (alle belangrijke dingen) ───
var VONK_INTRO_DONE = 'slagio_vonk_intro_done';
function vonkIntro(force) {
  if (!force) { try { if (localStorage.getItem(VONK_INTRO_DONE)) return; } catch (e) {} }
  try { localStorage.setItem(VONK_INTRO_DONE, '1'); } catch (e) {}
  const steps = [
    { mood: 'blij',    msg: `Hoi! Ik ben <b>Vonk</b>, je studiemaatje. 🦊 In een paar tips leg ik je alles uit, klaar?` },
    { mood: 'goed',    msg: `Kies onderaan een {{vak|vakken}}, dan een domein, en start een quiz. Zo simpel begin je met oefenen.` },
    { mood: 'kijk',    msg: `Er zijn twee soorten: de <b>Snelle quiz</b> (tegen de klok, voor punten + het {{leaderboard|leaderboard}}) en <b>Oud-examen</b> met échte examenvragen.` },
    { mood: 'trots',   msg: `Na elke quiz spring ik tevoorschijn met je <b>verwachte examencijfer</b> en waar je de meeste winst haalt. 🎓` },
    { mood: 'kijk',    msg: `Elke fout onthoud ik in je {{Foutenboek|foutenboek}}, mét waaróm het fout ging, en ik plan wanneer je 'm het best herhaalt.` },
    { mood: 'goed',    msg: `In je {{Studieplan|studieplan}} zet ik per dag klaar wát je oefent, helemaal tot je examen.` },
    { mood: 'trots',   msg: `Elke dag oefenen bouwt je <b>streak</b> en <b>XP</b> op, en je eigen dier-avatar groeit met je mee. 🔥` },
    { mood: 'knipoog', msg: `En zie je mij rechtsonder in de hoek? Tik me op elk scherm aan, dan leg ik uit wat je ziet. Succes! 🚀` },
  ];
  let i = 0;
  const step = () => {
    const st = steps[i];
    const last = i === steps.length - 1;
    vonkSay(st.msg, {
      mood: st.mood, side: 'left', size: 100, duration: 0, plainLinks: true,
      action: {
        label: last ? 'Aan de slag! 🚀' : 'Volgende →',
        keepOpen: !last,
        onclick: () => { if (last) { try { trackEvent('vonk_intro_klaar', {}); } catch (e) {} } else { i++; step(); } },
      },
    });
  };
  step();
  try { trackEvent('vonk_intro_start', {}); } catch (e) {}
}

// ─── Hoek-Vonk: altijd klein aanwezig; tik → uitleg over dít scherm ───
var VONK_EXPLAIN = {
  'sc-home':       { mood: 'blij', msg: `Dit is je startpunt. Kies onderaan een {{vak|vakken}} om te oefenen, tik op {{Foutenboek|foutenboek}} om fouten te herhalen, of open je {{Studieplan|studieplan}}. Na elke quiz vertel ik hoe je ervoor staat!` },
  'sc-detail':     { mood: 'goed', msg: `Alle domeinen van dit vak. <b>Groen</b> = onder de knie, <b>rood</b> = daar liggen punten. Tik een domein en kies een quiz.` },
  'sc-qmode':      { mood: 'goed', msg: `Kies hóé je oefent: <b>Snelle quiz</b> (tegen de klok, telt voor het {{leaderboard|leaderboard}}) of <b>Oud-examen</b>. Begin gerust met de snelle quiz.` },
  'sc-studieplan': { mood: 'goed', msg: `Je persoonlijke plan tot het examen. Ik zet per dag klaar wát je oefent, begin met de rode dingen. Je {{Foutenboek|foutenboek}}-fouten staan er ook bij.` },
  'sc-foutenboek': { mood: 'kijk', msg: `Al je foute antwoorden verzamel ik hier, mét waaróm het fout ging. Ik plan wanneer je ze het best herhaalt, en zet ze ook in je {{Studieplan|studieplan}}.` },
  'sc-leaderboard':{ mood: 'trots',msg: `Hier zie je hoe je scoort tegen andere leerlingen. Sneller én accurater = hogere score. Zin om te {{oefenen|vakken}}?` },
  'sc-calc':       { mood: 'goed', msg: `Reken uit welk cijfer je nog nodig hebt of wat je gemiddelde wordt. Bekijk ook je {{examenrooster|rooster}}.` },
  'sc-profiel':    { mood: 'blij', msg: `Je profiel: je dier-avatar groeit mee met je XP. Hier staan je badges, je streak en je voortgang.` },
  'sc-schedule':   { mood: 'goed', msg: `Je examenrooster. Vink je vakken (en eventueel herkansingen) aan, daar bouw ik je {{Studieplan|studieplan}} op.` },
  'sc-simtoets':   { mood: 'kijk', msg: `Een volledige oefentoets onder examen-omstandigheden. Ideaal als een examen dichtbij is.` },
  'sc-groep':      { mood: 'blij', msg: `Je klas of groep: samen oefenen en elkaars voortgang zien. Vergelijk op het {{leaderboard|leaderboard}}.` },
  'sc-res':        { mood: 'trots',msg: `Je resultaat! Ik laat je verwachte examencijfer zien en waar de meeste winst zit. Je fouten staan in je {{Foutenboek|foutenboek}}.` },
  'sc-leerpad':    { mood: 'goed', msg: `Je leerpad: stap voor stap door de stof van een vak, van makkelijk naar moeilijk. Volg gewoon de route.` },
  'sc-domein':     { mood: 'kijk', msg: `Dit domein in detail: de begrippen, de samenvatting en uitlegvideo's. Lees eerst, oefen daarna.` },
  'sc-oe-pick':    { mood: 'goed', msg: `Kies een examenjaar en tijdvak, dan oefen je met de échte vragen van dat centraal examen.` },
  'sc-review':     { mood: 'kijk', msg: `Hier kijk je je antwoorden na met het correctievoorschrift, zodat je precies ziet waar de punten zitten.` },
  'sc-info':       { mood: 'goed', msg: `Alle examenregels op een rij: hoe je slaagt, de N-term, herkansingen en de belangrijke data.` },
  'sc-sociaal':    { mood: 'blij', msg: `Je sociale hub: de weekwedstrijd (divisies), je {{groep|groep}} en de topscores. Speel samen en vergelijk je voortgang.` },
  'sc-klas':       { mood: 'blij', msg: `Je klas: nodig klasgenoten uit, oefen samen en volg elkaars voortgang.` },
  'sc-examen':     { mood: 'kijk', msg: `De echte examen-PDF's en correctievoorschriften, om te downloaden en mee te oefenen.` },
  'sc-zoek':       { mood: 'kijk', msg: `Zoek door álle examens, begrippen en uitleg. Typ een woord en ik vind het voor je.` },
  'sc-herhalen':   { mood: 'kijk', msg: `Kennis zakt weg als je 'm niet ophaalt. Ik zet hier op tijd de onderdelen klaar die dreigen weg te zakken, zodat ze blijven zitten.` },
  'sc-shop':       { mood: 'blij', msg: `Het winkeltje! Met de munten die je verdient door te oefenen koop je <b>streak-freezes</b> (die je streak redden), <b>XP-boosts</b>, <b>thema's</b> die de hele app herkleuren en <b>skins</b> voor je avatar en voor mij. Alles is optioneel, oefenen blijft altijd gratis.` },
  'sc-league':     { mood: 'trots', msg: `De weekwedstrijd! Je strijdt in je divisie tegen andere leerlingen. Verdien XP door te oefenen en klim omhoog: de top promoveert, de onderste zakken. Elke maandag begint een nieuwe ronde. Zin om te {{oefenen|vakken}}?` },
};
function vonkExplain() {
  const cur = document.querySelector('.sc.on');
  const id = cur ? cur.id : 'sc-home';
  const e = VONK_EXPLAIN[id] || { mood: 'kijk', msg: `Ik help je graag! Kijk hier rond en tik ergens, heb je een vraag, dan duik ik op waar ik kan. 😊` };
  const corner = document.getElementById('vonk-corner');
  if (corner) corner.style.visibility = 'hidden';
  vonkSay(e.msg, { mood: e.mood, side: 'right', duration: 0, think: true, onClose: () => { if (corner) corner.style.visibility = ''; } });
}
// Toont/verbergt de hoek-Vonk per scherm; wordt vanuit show() aangeroepen.
function updateVonkCorner(id) {
  id = id || ((document.querySelector('.sc.on') || {}).id);
  vonkHide(); // sluit een eventuele openstaande bubbel bij schermwissel
  const HIDE = ['sc-quiz', 'sc-flash', 'sc-welcome', 'sc-race', 'sc-race-res', 'sc-intro', 'sc-auth', 'sc-reset-pass'];
  let el = document.getElementById('vonk-corner');
  if (HIDE.indexOf(id) !== -1) { if (el) el.style.display = 'none'; return; }
  if (!el) {
    el = document.createElement('button');
    el.id = 'vonk-corner'; el.className = 'vonk-corner';
    el.setAttribute('aria-label', MASCOT_NAME + ', uitleg over dit scherm');
    el.innerHTML = `<span class="vonk-corner-fig">${mascotSVG('blij', 58)}</span><span class="vonk-corner-q">?</span>`;
    el.onclick = vonkExplain;
    document.body.appendChild(el);
  }
  el.style.display = ''; el.style.visibility = '';
  // Registreer de hoek-Vonk als de 'hoofd-Vonk' zodat idle (rondkijken/knikken)
  // en gaze op hem werken.
  try { if (typeof vonkRegister === 'function') vonkRegister(el.querySelector('.vonk-corner-fig')); } catch (e) {}
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
