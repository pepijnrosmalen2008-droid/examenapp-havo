// ═══════ ICO-SWAP: OS-emoji's → universele SVG-iconen (hele site) ═══════
// Loopt door tekst-nodes en vervangt elke emoji uit MAP door een inline line-icoon
// in dezelfde stijl als de rest van de app. Dier-avatars staan NIET in MAP en blijven
// dus ongemoeid. Werkt op de statische én de JS-gegenereerde schermen (MutationObserver).
// Zet class="no-ico" op een element om vervanging binnen dat element te voorkomen.
(function () {
  "use strict";
  var W = 'viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  function s(inner) { return '<svg class="ico" ' + W + ' aria-hidden="true">' + inner + '</svg>'; }
  // gekleurde variant (statusstippen, medailles) — vaste kleur i.p.v. currentColor
  function c(inner) { return '<svg class="ico" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">' + inner + '</svg>'; }
  var dot = function (col) { return c('<circle cx="12" cy="12" r="7" fill="' + col + '"/>'); };
  var medal = function (col, dk) { return c('<path d="M8 2 6 8" stroke="' + dk + '" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M16 2l2 6" stroke="' + dk + '" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="12" cy="15" r="6" fill="' + col + '"/><path d="M12 11.5l1.2 2.4 2.6.4-1.9 1.8.4 2.6-2.3-1.2-2.3 1.2.4-2.6L8.2 14.3l2.6-.4z" fill="#fff" opacity=".85"/>'); };

  var MAP = {
    // ── kern-UI ──
    "⚡": s('<polygon points="13 2 4 14 11 14 11 22 20 10 13 10 13 2" fill="currentColor" stroke="none"/>'),
    "🏆": s('<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3"/><path d="M17 6h3v1a3 3 0 0 1-3 3"/><path d="M12 14v3"/><path d="M8.5 21h7"/><path d="M9.5 21a2.5 2.5 0 0 1 5 0"/>'),
    "🎯": s('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>'),
    "🔥": s('<path d="M12 3c0 3-3.5 4.5-3.5 8a3.5 3.5 0 0 0 7 0c0-1.6-.8-2.6-1.4-3.4 2.3.6 3.4 2.6 3.4 4.6a5.5 5.5 0 1 1-11 0C5.5 8.5 9.5 6.5 12 3z"/>'),
    "📋": s('<rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2.5" width="6" height="3.2" rx="1"/><path d="M9 11h6M9 15h6"/>'),
    "📄": s('<path d="M14 3v5h5"/><path d="M14 3H6v18h12V8z"/><path d="M9 13h6M9 17h6"/>'),
    "📝": s('<path d="M14 3v5h5"/><path d="M14 3H6v18h12V8z"/><path d="M9 13h4"/><path d="M15.5 15.5 12 19l-2 .5.5-2z"/>'),
    "📖": s('<path d="M12 6C10.5 4.8 8.5 4 6 4H3v14h3c2.5 0 4.5.8 6 2z"/><path d="M12 6c1.5-1.2 3.5-2 6-2h3v14h-3c-2.5 0-4.5.8-6 2z"/><path d="M12 6v14"/>'),
    "📚": s('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M19 17H6a2 2 0 0 0-2 2"/>'),
    "🔄": s('<path d="M17 2.5 21 6l-4 3.5"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 21.5 3 18l4-3.5"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>'),
    "🔁": s('<path d="M17 2.5 21 6l-4 3.5"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 21.5 3 18l4-3.5"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>'),
    "🔀": s('<path d="M17 4l4 3.5-4 3.5"/><path d="M3 7.5h5c2 0 3 1 4.5 3"/><path d="M17 13l4 3.5-4 3.5"/><path d="M3 16.5h5c3 0 4-3 6-6.5"/>'),
    "↩️": s('<path d="M9 7 4 12l5 5"/><path d="M4 12h11a5 5 0 0 1 5 5"/>'),
    "⭐": s('<path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 17l-5.3 2.8 1-5.8L3.5 9.7l5.9-.9z"/>'),
    "🌟": s('<path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 17l-5.3 2.8 1-5.8L3.5 9.7l5.9-.9z"/>'),
    "✨": s('<path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4z"/><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>'),
    "💫": s('<path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4z"/><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>'),
    "🎉": s('<path d="M13 3l2.1 5.6L21 11l-5.9 2.4L13 19l-2.1-5.6L5 11l5.9-2.4z"/>'),
    "🎊": s('<path d="M13 3l2.1 5.6L21 11l-5.9 2.4L13 19l-2.1-5.6L5 11l5.9-2.4z"/>'),
    "📊": s('<path d="M4 21V4"/><path d="M4 21h16"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="14" width="3" height="4"/>'),
    "📈": s('<path d="M3 17l6-6 4 4 8-8"/><path d="M16 7h5v5"/>'),
    "📉": s('<path d="M3 7l6 6 4-4 8 8"/><path d="M16 17h5v-5"/>'),
    "📅": s('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9.5h18"/><path d="M8 3v4"/><path d="M16 3v4"/>'),
    "🗓️": s('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9.5h18"/><path d="M8 3v4"/><path d="M16 3v4"/>'),
    "📆": s('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9.5h18"/><path d="M8 3v4"/><path d="M16 3v4"/>'),
    "⏰": s('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 1.5"/><path d="M5 3 2 6M19 3l3 3"/>'),
    "🕐": s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),
    "⏱": s('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5"/><path d="M9 2h6"/>'),
    "⏳": s('<path d="M7 3h10M7 21h10"/><path d="M7 3c0 4 5 5 5 9 0-4 5-5 5-9"/><path d="M7 21c0-4 5-5 5-9 0 4 5 5 5 9"/>'),
    "⏸": s('<rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/>'),
    "▶️": s('<polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/>'),
    "▶": s('<polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/>'),
    "👥": s('<path d="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1"/><circle cx="9.5" cy="8" r="3.3"/><path d="M21 19v-1a4 4 0 0 0-3-3.9"/><path d="M15.5 4.6a3.3 3.3 0 0 1 0 6.4"/>'),
    "👤": s('<circle cx="12" cy="8" r="3.6"/><path d="M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"/>'),
    "🎓": s('<path d="M22 9 12 5 2 9l10 4 10-4z"/><path d="M6 11v5c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-5"/><path d="M22 9v5"/>'),
    "🔍": s('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.2-4.2"/>'),
    "🔎": s('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.2-4.2"/>'),
    "💎": s('<path d="M6 3h12l3 5-9 12L3 8z"/><path d="M3 8h18"/><path d="M9 3 7 8l5 12 5-12-2-5"/>'),
    "📲": s('<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10.5 18h3"/>'),
    "📱": s('<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10.5 18h3"/>'),
    "🖥️": s('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'),
    "🔔": s('<path d="M18 8a6 6 0 0 0-12 0c0 6-2.5 7.5-3 8h18c-.5-.5-3-2-3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>'),
    "🔕": s('<path d="M8.5 4.5A6 6 0 0 1 18 8c0 3 .8 4.9 1.6 6.1"/><path d="M6 8c0 6-2.5 7.5-3 8h13"/><path d="M10 20a2 2 0 0 0 4 0"/><path d="M3 3l18 18"/>'),
    "📣": s('<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6l-5 4H4a1 1 0 0 0-1 1z"/><path d="M16 8.5a4 4 0 0 1 0 7"/><path d="M18.5 6a7 7 0 0 1 0 12"/>'),
    "📢": s('<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6l-5 4H4a1 1 0 0 0-1 1z"/><path d="M16 8.5a4 4 0 0 1 0 7"/><path d="M18.5 6a7 7 0 0 1 0 12"/>'),
    "🌐": s('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.4 4 5.6 4 9s-1.5 6.6-4 9c-2.5-2.4-4-5.6-4-9s1.5-6.6 4-9z"/>'),
    "🌍": s('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.4 4 5.6 4 9s-1.5 6.6-4 9c-2.5-2.4-4-5.6-4-9s1.5-6.6 4-9z"/>'),
    "☁️": s('<path d="M7 18a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.5 1.5A3.5 3.5 0 0 1 17 18z"/>'),
    "🧮": s('<rect x="5" y="3" width="14" height="18" rx="2"/><rect x="8" y="6" width="8" height="3" rx="0.5"/><path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 17h.01M12 17h.01M15.5 17h.01"/>'),
    "🛡️": s('<path d="M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6z"/>'),
    "🛡": s('<path d="M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6z"/>'),
    "🔑": s('<circle cx="8" cy="15" r="4"/><path d="m10.8 12.2 8-8"/><path d="m16 7 2 2"/><path d="m19 4 2 2"/>'),
    "❓": s('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 4.6 1.3c0 1.7-2.4 2.2-2.4 3.7"/><path d="M12 17h.01"/>'),
    "❔": s('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 4.6 1.3c0 1.7-2.4 2.2-2.4 3.7"/><path d="M12 17h.01"/>'),
    "🏠": s('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/>'),
    "🏫": s('<path d="M3 21h18"/><path d="M5 21V9l7-4 7 4v12"/><path d="M12 5V2"/><rect x="10" y="14" width="4" height="7"/>'),
    "✍️": s('<path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6"/><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/>'),
    "✏️": s('<path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6"/><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/>'),
    "👍": s('<path d="M7 11v9"/><path d="M7 11l4-7a2 2 0 0 1 3 1.7L13 10h5.5a2 2 0 0 1 2 2.3l-1.1 6A2 2 0 0 1 17.4 20H7"/><rect x="3" y="11" width="4" height="9" rx="1"/>'),
    "💪": s('<polygon points="13 2 4 14 11 14 11 22 20 10 13 10 13 2" fill="currentColor" stroke="none"/>'),
    "📦": s('<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5"/><path d="M12 12v9"/>'),
    "📌": s('<path d="M9 3h6l-1 7 3 2.5V15H8v-2.5L11 10z"/><path d="M12 15v6"/>'),
    "📤": s('<path d="M12 15V4"/><path d="m7.5 8.5 4.5-4.5 4.5 4.5"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>'),
    "📥": s('<path d="M12 4v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>'),
    "💾": s('<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7V4"/><rect x="8" y="13" width="8" height="6"/>'),
    "🔗": s('<path d="M9.5 14.5 14.5 9.5"/><path d="M11 6.5 12.2 5.3a4 4 0 0 1 5.6 5.6l-1.2 1.2"/><path d="M13 17.5 11.8 18.7a4 4 0 0 1-5.6-5.6l1.2-1.2"/>'),
    "💡": s('<path d="M9.5 18h5"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.8 10.7c.5.5.8 1.1.8 1.8v.5h6v-.5c0-.7.3-1.3.8-1.8A6 6 0 0 0 12 3z"/>'),
    "💬": s('<path d="M4 5h16v11H10l-4 4V16H4z"/>'),
    "💭": s('<path d="M4 5h16v11H10l-4 4V16H4z"/>'),
    "📸": s('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7l1.5-2.5h5L16 7"/><circle cx="12" cy="13.5" r="3.5"/>'),
    "🎵": s('<path d="M9 18V5l10-2v11"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>'),
    "🎶": s('<path d="M9 18V5l10-2v11"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>'),
    "💼": s('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>'),
    "🔒": s('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    "🔓": s('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>'),
    "🗑️": s('<path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>'),
    "🚀": s('<path d="M12 15l-3-3a11 11 0 0 1 8-8c1.5 0 3 .3 3 .3s.3 1.5.3 3a11 11 0 0 1-8 8z"/><path d="M9 12H5s.4-2.5 2-4 4-1 4-1"/><path d="M12 15v4s2.5-.4 4-2 1-4 1-4"/><path d="M5 18c-1 1-1.3 3.5-1.3 3.5S6 21.2 7 20"/>'),
    "🏁": s('<path d="M5 21V4"/><path d="M5 4h14v10H5z"/><path d="M5 4h3.5v3.3H12V4h3.5v3.3H19M5 10.7h3.5V14H12v-3.3h3.5V14H19M8.5 7.3H12v3.4M15.5 7.3H19" opacity=".55"/>'),
    "🚩": s('<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>'),
    "🏅": medal("#e8a13a", "#b9772a"),
    "🥇": medal("#f5c518", "#c99a11"),
    "🥈": medal("#c2cbd4", "#93a0ad"),
    "🥉": medal("#d08b52", "#a5673a"),
    "🎖️": medal("#e05a4c", "#a83f34"),
    "🤖": s('<rect x="4" y="8" width="16" height="11" rx="2.5"/><path d="M12 8V4.5"/><circle cx="12" cy="3.5" r="1.2"/><circle cx="9" cy="13" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.1" fill="currentColor" stroke="none"/><path d="M9.5 16.5h5"/>'),
    "⚔️": s('<path d="M14 4h6v6"/><path d="M20 4 4 20"/><path d="M14.5 12.5 20 18v2h-2l-5.5-5.5"/><path d="M10 4H4v6"/><path d="m4 4 5.5 5.5"/><path d="M9.5 12.5 4 18v2h2l5.5-5.5"/>'),
    "🤝": s('<path d="M12 12 8 8a2.8 2.8 0 0 0-4 4l5 5 3-2 3 2 5-5a2.8 2.8 0 0 0-4-4z"/>'),
    "🌊": s('<path d="M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>'),
    "🧠": s('<path d="M12 5a3 3 0 0 0-5.6-1.5A2.8 2.8 0 0 0 4 8a3 3 0 0 0 .6 5.6A3 3 0 0 0 8 18a3 3 0 0 0 4 1.2z"/><path d="M12 5a3 3 0 0 1 5.6-1.5A2.8 2.8 0 0 1 20 8a3 3 0 0 1-.6 5.6A3 3 0 0 1 16 18a3 3 0 0 1-4 1.2z"/>'),
    "🧬": s('<path d="M6 3c0 6 12 6 12 12s-12 6-12 12" transform="translate(0 -3) scale(1 .75)"/><path d="M6 3c0 6 12 6 12 12"/><path d="M18 3c0 6-12 6-12 12"/><path d="M8 6h8M8 18h8M9.5 9h5M9.5 15h5"/>'),
    "📐": s('<path d="M4 20 20 4"/><path d="M4 4v16h16"/><path d="M8 20v-4M12 20v-6"/>'),
    "⚗️": s('<path d="M9 3h6"/><path d="M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>'),
    "🏛️": s('<path d="M3 21h18"/><path d="M4 21V10h16v11"/><path d="M3 10 12 4l9 6"/><path d="M8 21v-7M12 21v-7M16 21v-7"/>'),
    "⚖️": s('<path d="M12 3v18"/><path d="M7 21h10"/><path d="M5 7h14"/><path d="M5 7 2 13a3 3 0 0 0 6 0z"/><path d="M19 7l-3 6a3 3 0 0 0 6 0z"/>'),
    "💶": s('<circle cx="12" cy="12" r="9"/><path d="M15 9a4 4 0 1 0 0 6"/><path d="M7 11h5M7 13.5h5"/>'),
    "🔭": s('<path d="m3 15 6-2 3 6"/><path d="m9 13-2-5 11-4 2 5z"/><path d="M9 13 7 8"/><path d="M12 19v2M9 21h6"/>'),
    "🍪": s('<circle cx="12" cy="12" r="9"/><circle cx="9" cy="9.5" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="10" cy="14.5" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1" fill="currentColor" stroke="none"/>'),
    "🎇": s('<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m6 6 2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/><circle cx="12" cy="12" r="2"/>'),
    "🌠": s('<path d="M12 3.5l1.8 3.7 4 .6-3 2.8.7 4-3.5-1.9-3.5 1.9.7-4-3-2.8 4-.6z"/><path d="M3 21 8 16"/>'),
    "🌩️": s('<path d="M7 16a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.5 1.5A3.5 3.5 0 0 1 17 16"/><path d="m12 13-2 4h4l-2 4"/>'),
    "🧊": s('<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5"/><path d="M12 12v9"/>'),
    "💥": s('<path d="M12 2l2 5 5-3-3 5 5 2-5 2 3 5-5-3-2 5-2-5-5 3 3-5-5-2 5-2-3-5 5 3z"/>'),
    "📂": s('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
    "📁": s('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
    "📇": s('<rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10.5h5M13 14h5"/><path d="M2 6h20"/>'),
    "❤️": c('<path d="M12 20s-7-4.7-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.3 12 20 12 20z" fill="#e0554a"/>'),
    // ── waarschuwing / status ──
    "✅": c('<circle cx="12" cy="12" r="9" fill="#2e9e6b"/><path d="M8 12.3l2.6 2.6L16 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
    "✔": s('<path d="M5 12.5 10 17 19 6"/>'),
    "✔️": s('<path d="M5 12.5 10 17 19 6"/>'),
    "☑️": c('<rect x="3" y="3" width="18" height="18" rx="4" fill="#2e9e6b"/><path d="M7.5 12.3l2.6 2.6L16.5 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
    "⚠️": c('<path d="M10.3 4 2 18a2 2 0 0 0 1.7 3h16.6A2 2 0 0 0 22 18L13.7 4a2 2 0 0 0-3.4 0z" fill="none" stroke="#d19a1e" stroke-width="2" stroke-linejoin="round"/><path d="M12 9v4M12 17h.01" stroke="#d19a1e" stroke-width="2" stroke-linecap="round"/>'),
    "⚠": c('<path d="M10.3 4 2 18a2 2 0 0 0 1.7 3h16.6A2 2 0 0 0 22 18L13.7 4a2 2 0 0 0-3.4 0z" fill="none" stroke="#d19a1e" stroke-width="2" stroke-linejoin="round"/><path d="M12 9v4M12 17h.01" stroke="#d19a1e" stroke-width="2" stroke-linecap="round"/>'),
    "🚨": c('<path d="M6 20v-6a6 6 0 0 1 12 0v6z" fill="none" stroke="#e0554a" stroke-width="2" stroke-linejoin="round"/><path d="M4 20h16M12 5V3" stroke="#e0554a" stroke-width="2" stroke-linecap="round"/>'),
    "⛔": c('<circle cx="12" cy="12" r="9" fill="none" stroke="#e0554a" stroke-width="2.4"/><path d="M6 12h12" stroke="#e0554a" stroke-width="2.4" stroke-linecap="round"/>'),
    "🟢": dot("#22c55e"), "🔴": dot("#ef4444"), "🟠": dot("#f97316"), "🟡": dot("#eab308"), "🔵": dot("#3b82f6"), "🟣": dot("#8b5cf6"), "⚫": dot("#374151"), "⚪": dot("#cbd5e1"),
    // ── rank-tiers (gamification) ──
    "🌱": s('<path d="M12 21v-8"/><path d="M12 13c-.5-3-3-4.5-6-4.5.3 3 2.5 5 6 4.5z"/><path d="M12 12c.5-3 3-4.5 6-4.5-.3 3-2.5 5-6 4.5z"/>'),
    "🍀": s('<path d="M12 13c-2-2-5-2-5 .5S9 17 12 13z"/><path d="M12 13c2-2 5-2 5 .5S15 17 12 13z"/><path d="M12 13c-2-2-2-5 .5-5S12 11 12 13z"/><path d="M12 13v7"/>'),
    "👑": s('<path d="M4 18h16"/><path d="M4 18 3 7l5 4 4-6 4 6 5-4-1 11z"/>'),
    "🔮": s('<circle cx="12" cy="13" r="7"/><path d="M6.5 20h11"/><path d="M9.5 10.5a3.5 3.5 0 0 1 3-2"/>'),
    "🌌": s('<path d="M4 20c4-1 6-3 8-8s4-7 8-8"/><circle cx="7" cy="16" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="17" cy="8" r="1" fill="currentColor" stroke="none"/><path d="M5 7l.8 1.6M19 17l-.8-1.6"/>'),
    "⚜️": s('<path d="M12 3c1.5 2 1.5 4 0 6-1.5-2-1.5-4 0-6z"/><path d="M12 9c-2 0-4 1.5-4 4s2 5 4 8c2-3 4-5.5 4-8s-2-4-4-4z"/><path d="M8 13H5M16 13h3"/>'),
    "🪐": s('<circle cx="11" cy="11" r="6"/><ellipse cx="11" cy="12" rx="11" ry="3.4" transform="rotate(-24 11 12)" fill="none"/>'),
    // ── gezichten (approximaties) ──
    "😌": s('<circle cx="12" cy="12" r="9"/><path d="M8 14.5a4 4 0 0 0 8 0"/><path d="M8 9.5h2M14 9.5h2"/>'),
    "😊": s('<circle cx="12" cy="12" r="9"/><path d="M8 14a4 4 0 0 0 8 0"/><path d="M9 9.5h.01M15 9.5h.01"/>'),
    "😤": s('<path d="M12 3c0 3-3.5 4.5-3.5 8a3.5 3.5 0 0 0 7 0c0-1.6-.8-2.6-1.4-3.4 2.3.6 3.4 2.6 3.4 4.6a5.5 5.5 0 1 1-11 0C5.5 8.5 9.5 6.5 12 3z"/>'),
    "💀": s('<path d="M12 3a8 8 0 0 0-5 14v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2a8 8 0 0 0-5-14z"/><circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none"/><path d="M10.5 18v2M13.5 18v2"/>'),
    "😱": c('<circle cx="12" cy="12" r="9" fill="none" stroke="#d19a1e" stroke-width="2"/><path d="M9 15h6M9 9.5h.01M15 9.5h.01" stroke="#d19a1e" stroke-width="2" stroke-linecap="round"/>'),
    "😰": c('<circle cx="12" cy="12" r="9" fill="none" stroke="#d19a1e" stroke-width="2"/><path d="M9 15h6M9 9.5h.01M15 9.5h.01" stroke="#d19a1e" stroke-width="2" stroke-linecap="round"/>'),
    "😔": s('<circle cx="12" cy="12" r="9"/><path d="M8.5 15.5a4 4 0 0 1 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/>'),
    "😅": s('<circle cx="12" cy="12" r="9"/><path d="M8 14a4 4 0 0 0 8 0"/><path d="M9 9.5h.01M15 9.5h.01"/>')
  };

  var reduce = false;
  var supported = !!(document.createTreeWalker && window.MutationObserver);
  if (!supported) return;

  var keys = Object.keys(MAP).sort(function (a, b) { return b.length - a.length; });
  function esc(x) { return x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  var RE = new RegExp("(" + keys.map(esc).join("|") + ")", "gu");
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, OPTION: 1, CODE: 1 };

  function skip(el) {
    while (el && el.nodeType === 1) {
      var n = el.nodeName;
      if (n === "svg" || n === "SVG" || SKIP[n]) return true;
      if (el.classList && el.classList.contains("no-ico")) return true;
      el = el.parentNode;
    }
    return false;
  }
  function processText(node) {
    var txt = node.nodeValue;
    RE.lastIndex = 0;
    if (!RE.test(txt)) return;
    RE.lastIndex = 0;
    var frag = document.createDocumentFragment(), last = 0, m;
    while ((m = RE.exec(txt))) {
      if (m.index > last) frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
      var span = document.createElement("span");
      span.className = "ico-emoji";
      span.innerHTML = MAP[m[0]];
      frag.appendChild(span);
      last = m.index + m[0].length;
    }
    if (last < txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }
  function scan(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (!skip(root.parentNode)) processText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.nodeType === 1 && skip(root)) return;
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue) return NodeFilter.FILTER_REJECT;
        RE.lastIndex = 0;
        if (!RE.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        return skip(n.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    var list = [], n;
    while ((n = tw.nextNode())) list.push(n);
    for (var i = 0; i < list.length; i++) processText(list[i]);
  }

  var scheduled = false, queue = [];
  function flush() {
    scheduled = false;
    var q = queue; queue = [];
    for (var i = 0; i < q.length; i++) { try { scan(q[i]); } catch (e) {} }
  }
  function init() {
    try { scan(document.body); } catch (e) {}
    try {
      var mo = new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          var an = muts[i].addedNodes;
          for (var j = 0; j < an.length; j++) queue.push(an[j]);
        }
        // textContent-toewijzing verschijnt als childList-mutatie (nieuwe tekst-node),
        // dus characterData observeren is overbodig — scheelt werk tijdens live timers.
        if (!scheduled && queue.length) { scheduled = true; (window.requestAnimationFrame || setTimeout)(flush); }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
