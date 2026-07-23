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
  const M = {
    blij:   { mouth: 'M46 79 Q60 91 74 79', brow: '',                                             accent: '#22c55e', spark: false, eyeUp: 0,   wink: false },
    trots:  { mouth: 'M43 77 Q60 96 77 77', brow: 'M39 48 Q46 42 53 47 M67 47 Q74 42 81 48',       accent: '#22c55e', spark: true,  eyeUp: 0,   wink: false },
    goed:   { mouth: 'M47 79 Q60 88 73 79', brow: '',                                             accent: 'var(--or)', spark: false, eyeUp: 0, wink: false },
    laag:   { mouth: 'M48 83 Q60 77 72 83', brow: 'M39 51 Q46 48 53 51 M67 51 Q74 48 81 51',       accent: '#f59e0b', spark: false, eyeUp: 0,   wink: false },
    kijk:   { mouth: 'M53 81 Q60 85 67 81', brow: '',                                             accent: '#6366f1', spark: false, eyeUp: 1,   wink: false },
    knipoog:{ mouth: 'M46 79 Q60 90 74 79', brow: '',                                             accent: '#22c55e', spark: true,  eyeUp: 0,   wink: true },
  };
  const s = M[mood] || M.blij;
  const pdy = (s.eyeUp ? -2.5 : 0.5);
  // rechteroog knipoogt (boogje) bij 'knipoog'
  const rightEye = s.wink
    ? `<path d="M64 58 Q73 52 82 58" stroke="#232741" stroke-width="3" stroke-linecap="round" fill="none"/>`
    : `<ellipse cx="73" cy="58" rx="10" ry="11" fill="#fff"/><circle cx="73" cy="${58 + pdy}" r="4.6" fill="#232741"/><circle cx="74.8" cy="${56.2 + pdy}" r="1.7" fill="#fff"/>`;
  return `<svg class="m-svg" viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="${MASCOT_NAME}, de studiemaatje-mascotte">
    <defs>
      <linearGradient id="mBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffa860"/><stop offset=".55" stop-color="#f5731a"/><stop offset="1" stop-color="#df560a"/></linearGradient>
      <linearGradient id="mCap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3c4163"/><stop offset="1" stop-color="#242840"/></linearGradient>
      <radialGradient id="mCheek" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff8fa3" stop-opacity=".75"/><stop offset="1" stop-color="#ff8fa3" stop-opacity="0"/></radialGradient>
    </defs>
    <ellipse class="m-shadow" cx="60" cy="113" rx="30" ry="6"/>
    <g class="m-fig">
      <ellipse cx="49" cy="105" rx="9" ry="6" fill="#df560a"/><ellipse cx="71" cy="105" rx="9" ry="6" fill="#df560a"/>
      <path d="M30 68 q-11 5 -9 19" stroke="url(#mBody)" stroke-width="10" stroke-linecap="round" fill="none"/>
      <rect x="22" y="34" width="76" height="67" rx="33" fill="url(#mBody)" stroke="#c34d07" stroke-width="1.5"/>
      <ellipse cx="60" cy="75" rx="22" ry="20" fill="#fff" opacity=".13"/>
      <ellipse cx="34" cy="60" rx="6" ry="9" fill="#fff" opacity=".2"/>
      <path class="m-tuft" d="M60 33 q-5 -9 2 -13 q3 7 9 5 q-3 7 -11 8z" fill="#f5731a"/>
      <g class="m-cap">
        <rect x="47" y="20" width="26" height="9" rx="3" fill="url(#mCap)"/>
        <path d="M60 5 L88 16 L60 27 L32 16 Z" fill="url(#mCap)"/>
        <path d="M60 5 L88 16 L60 20 Z" fill="#4c527a" opacity=".55"/>
        <circle cx="60" cy="16" r="2.6" fill="#facc15"/>
        <path class="m-tassel" d="M60 16 q17 2 16 13" stroke="#facc15" stroke-width="2" fill="none"/>
        <circle class="m-tassel" cx="76" cy="31" r="3.4" fill="#f59e0b"/>
      </g>
      <g class="m-eyes">
        <ellipse cx="47" cy="58" rx="10" ry="11" fill="#fff"/><circle cx="47" cy="${58 + pdy}" r="4.6" fill="#232741"/><circle cx="48.8" cy="${56.2 + pdy}" r="1.7" fill="#fff"/>
        ${rightEye}
      </g>
      ${s.brow ? `<g stroke="#232741" stroke-width="2.4" stroke-linecap="round" fill="none">${s.brow}</g>` : ''}
      <circle cx="34" cy="73" r="7.5" fill="url(#mCheek)"/><circle cx="86" cy="73" r="7.5" fill="url(#mCheek)"/>
      <path d="${s.mouth}" stroke="#232741" stroke-width="3.4" stroke-linecap="round" fill="none"/>
      <g class="m-wave">
        <path d="M90 63 q13 -3 17 -17" stroke="url(#mBody)" stroke-width="10" stroke-linecap="round" fill="none"/>
        <circle cx="108" cy="45" r="6.5" fill="url(#mBody)" stroke="#c34d07" stroke-width="1.2"/>
      </g>
      ${s.spark ? `<g class="m-spark" fill="#facc15"><path d="M99 15 l2.2 5.4 5.4 2.2 -5.4 2.2 -2.2 5.4 -2.2 -5.4 -5.4 -2.2 5.4 -2.2z"/><circle cx="23" cy="30" r="2.3"/><circle cx="95" cy="40" r="1.7"/></g>` : ''}
    </g>
  </svg>`;
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
