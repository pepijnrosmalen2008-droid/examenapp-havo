// ═══════════════════════════════════════════════════════════════════════
// momenten.js - de grote beloningsmomenten: level omhoog, promotie, streak
// ───────────────────────────────────────────────────────────────────────
// Eén bron voor twee plekken:
//   · de app: Momenten.toon('level', {level:5}, {regel, knop, klaar}) opent een
//     eigen scherm met de animatie en een knop Verder (lazy geladen via
//     momentToon() in features.js, samen met /social/geluid.js);
//   · de video's: social/posts/moment-*.html roept Momenten.maak() aan en
//     render.mjs schrijft het frame voor frame naar MP4.
// Elk moment is één functie render(t): alles volgt de tijd, geen losse
// CSS-animaties. Het moment zelf staat op .mm-podium (1080×1080); de pagina
// of het scherm eromheen bepaalt hoogte (H), schaal (S) en middelpunt (CY).
// Geluid: één compositie per moment (mLevel, mPromotie, mStreak in geluid.js).
// ═══════════════════════════════════════════════════════════════════════
(function () {
  // ── Kleine motion-helpers (in de video's komen ze uit social/engine.js) ──
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const E = (window.Motion && Motion.E) || {
    lin: x => x, uit: x => 1 - Math.pow(1 - x, 3), uit5: x => 1 - Math.pow(1 - x, 5), in: x => x * x * x,
    inUit: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    terug: x => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); },
    veer: x => x >= 1 ? 1 : 1 - Math.exp(-6.5 * x) * Math.cos(11 * x),
  };
  const p = (t, a, b, ease) => (ease || E.lin)(clamp((t - a) / (b - a)));
  const lerp = (a, b, x) => a + (b - a) * x;
  const rnd = seed => { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  const zet = (el, st) => { for (const k in st) { const v = st[k]; if (el.style[k] !== v) el.style[k] = v; } };

  const CSS = `
.mm-root{position:relative;overflow:hidden;width:1080px;background:#10142a;--mm-kop:var(--font-head,var(--kop,system-ui));--mm-tekst:var(--font,var(--tekst,system-ui));line-height:1;-webkit-font-smoothing:antialiased}
.mm-root *{box-sizing:border-box;margin:0;padding:0}
.mm-root .mm-a{position:absolute}
.mm-root svg{display:block;overflow:visible}
.mm-root .m-shadow{display:none}
.mm-deel{left:0;top:0;pointer-events:none}
.mm-podium-w{left:0;width:1080px;height:1080px;transform-origin:50% 50%}
.mm-podium{left:0;top:0;width:1080px;height:1080px}
.mm-wereld{left:0;top:0;width:1080px;height:1080px}
.mm-midden{left:0;right:0;text-align:center}
.mm-hook{left:80px;right:80px;top:250px;text-align:center;font:800 80px/1.04 var(--mm-kop);color:#fff;letter-spacing:-.03em;word-spacing:.06em}
.mm-hook span{display:inline-block}
.mm-merk{left:0;right:0;top:1352px;text-align:center}
.mm-merk b{display:inline-flex;align-items:center;gap:22px;font:800 64px/1 var(--mm-kop);color:#fff;letter-spacing:-.02em}
.mm-merk img{width:84px;height:84px;border-radius:22px}
.mm-merk small{display:block;margin-top:16px;font:600 34px/1 var(--mm-tekst);color:rgba(255,255,255,.7)}
.mm-vonk svg{width:100%;height:100%}
.mm-kick{font:800 40px/1 var(--mm-tekst);letter-spacing:.24em;text-transform:uppercase;color:#ffc247;white-space:nowrap}
.mm-groot{font:800 170px/1.08 var(--mm-kop);color:#fff;letter-spacing:-.045em;white-space:nowrap}
.mm-groot em{font-style:normal;color:#ffc247}
.mm-l{display:inline-block;overflow:hidden;vertical-align:top;padding:0 .02em;margin:0 -.02em}
.mm-l i{display:inline-block;font-style:normal}
.mm-zon{border-radius:50%}
/* level: de trap */
.mm-trede{overflow:hidden}
.mm-trede u{position:absolute;left:0;right:0;top:0;height:26px;text-decoration:none}
.mm-trede b{position:absolute;left:0;right:0;text-align:center;font:800 190px/1 var(--mm-kop);letter-spacing:-.05em}
.mm-vul{left:0;right:0;bottom:0;background:#ffb020}
.mm-vul u{background:#ffd76a}
.mm-glim{top:0;bottom:0;width:120px;background:rgba(255,255,255,.55);transform:skewX(-20deg)}
.mm-stok{width:10px;border-radius:5px;background:#e9edf5;transform-origin:50% 100%}
.mm-vaan{transform-origin:0 50%}
/* promotie: door het plafond */
.mm-zone{left:-2460px;width:6000px}
.mm-balk{left:-2460px;width:6000px;height:40px}
.mm-zlab{font:800 34px/1 var(--mm-tekst);letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.75)}
.mm-rail{width:6px;top:-3000px;height:7000px;background:rgba(255,255,255,.08)}
.mm-vloed{border-radius:50%;width:200px;height:200px;margin:-100px 0 0 -100px}
.mm-plat{width:380px;height:50px;margin-left:-190px;border-radius:14px;background:#aeb6c8;overflow:hidden}
.mm-plat u{position:absolute;left:0;right:0;top:0;height:20px;background:#e9edf5}
.mm-wijs{width:70px;height:46px;margin-left:-35px}
.mm-schild{width:230px;height:264px;margin:-132px 0 0 -115px}
.mm-schild .mm-sv{position:absolute;inset:0}
.mm-schild svg{position:absolute;inset:0;width:100%;height:100%}
.mm-kring{border-radius:50%;border:10px solid #fff;width:240px;height:240px;margin:-120px 0 0 -120px}
/* streak: klapbord en kampvuur */
.mm-bord{display:flex;gap:14px;justify-content:center;left:0;right:0;top:96px;perspective:1400px}
.mm-kaart{position:relative;width:210px;height:300px}
.mm-helft{position:absolute;left:0;right:0;height:149px;overflow:hidden;backface-visibility:hidden}
.mm-helft.mm-b{top:0;border-radius:22px 22px 4px 4px;background:#2a3160;transform-origin:50% 100%}
.mm-helft.mm-o{top:151px;border-radius:4px 4px 22px 22px;background:#222850;transform-origin:50% 0}
.mm-helft b{position:absolute;left:0;right:0;text-align:center;font:800 250px/300px var(--mm-kop);color:#fff;letter-spacing:-.04em}
.mm-helft.mm-b b{top:0}.mm-helft.mm-o b{top:-151px}
.mm-helft.mm-goud b{color:#ffc247}
.mm-pen{position:absolute;top:139px;width:12px;height:22px;border-radius:4px;background:#10142a;z-index:3}
.mm-onder{top:430px;font:800 56px/1 var(--mm-kop);color:#fff;letter-spacing:-.02em}
.mm-dag{width:66px;height:66px;margin:-33px 0 0 -33px;border-radius:50%;background:#232a4d;display:grid;place-items:center}
.mm-dag i{position:absolute;inset:0;border-radius:50%;background:#ffb020}
.mm-dag svg{position:relative;width:34px;height:34px;fill:none;stroke:#3a1600;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}
.mm-grond{left:-2460px;width:6000px;top:985px;height:4000px;background:#0b0e1f}
.mm-vuur{left:640px;top:985px;width:0;height:0}
.mm-vuur svg{position:absolute;left:-170px;top:-380px;width:340px;height:420px}
.mm-blok{width:130px;height:38px;margin:-19px 0 0 -65px;border-radius:10px;background:#8a5a2b;overflow:hidden}
.mm-blok u{position:absolute;left:0;right:0;top:0;height:14px;background:#a8743c}
.mm-blok s{position:absolute;right:0;top:0;bottom:0;width:26px;background:#d9b382;border-radius:50%/40%}
/* het scherm in de app */
.mm-ov{position:fixed;inset:0;z-index:9700;background:#10142a;overflow:hidden;opacity:0;transition:opacity .25s ease;touch-action:manipulation}
.mm-ov.mm-aan{opacity:1}
.mm-ov .mm-root{position:absolute;left:50%;top:0;margin-left:-540px;transform-origin:50% 0;overflow:visible;background:none}
.mm-voet{position:absolute;z-index:2;left:0;right:0;bottom:0;padding:0 22px calc(22px + env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:14px;
  opacity:0;transform:translateY(24px);transition:opacity .35s ease,transform .45s cubic-bezier(.2,1.3,.4,1);pointer-events:none}
.mm-voet.mm-aan{opacity:1;transform:none;pointer-events:auto}
.mm-regel{font:600 16px/1.35 var(--font,system-ui);color:rgba(255,255,255,.9);text-align:center;max-width:340px;background:rgba(11,13,24,.78);padding:8px 16px;border-radius:999px}
.mm-regel b{color:#ffc247;font-weight:800}
.mm-knop{width:100%;max-width:360px;min-height:56px;border-radius:18px;border:2px solid rgba(0,0,0,.18);border-bottom-width:5px;background:#fff;color:#10142a;
  font:800 18px/1 var(--font-head,system-ui);letter-spacing:-.01em;cursor:pointer;transition:transform .08s ease,border-bottom-width .08s ease}
.mm-knop:active{transform:translateY(3px);border-bottom-width:2px}
@media(prefers-reduced-motion:reduce){.mm-ov,.mm-voet{transition:opacity .2s ease}.mm-voet{transform:none}}
`;
  function stijl() { let s = document.getElementById('mm-css'); if (!s) { s = document.createElement('style'); s.id = 'mm-css'; document.head.appendChild(s); } if (s.textContent !== CSS) s.textContent = CSS; }

  const NIV = { havo: ['#2f6bff', '#1f4fd0', '#6f9bff'], vwo: ['#7c4dff', '#5b33cf', '#a98bff'], vmbo: ['#14b8a6', '#0d8f81', '#5fd9cb'] };
  const BG = '#10142a';
  const vonkSVG = (m, px) => (typeof mascotSVG === 'function') ? mascotSVG(m, px) : '';
  const mix = (k, w, pc) => `color-mix(in srgb,${k} ${100 - pc}%,${w} ${pc}%)`;
  const kleurVast = k => { const d = document.createElement('i'); d.style.color = k; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };

  // ── Basis: vlak decor, één canvas voor papier, stof en brokstukken, haak en merk (video) ──
  // Stijl: vlakke vormen in twee tinten, geen gloed of verloop. Beweging met aanloop,
  // rek en doorveren. Vonk doet het werk; de rest ondersteunt.
  function basis(root, o, klasse, html) {
    stijl();
    const H = o.H || 1080, S = o.S || 1, CY = o.CY || 540, PY = CY - 540, niv = NIV[o.niveau] || NIV.havo;
    root.classList.add('mm-root'); root.style.height = H + 'px';
    root.innerHTML = '<div class="mm-a mm-podium-w" style="top:' + PY + 'px;transform:scale(' + S + ')"><div class="mm-a mm-podium ' + klasse + '">' + html + '</div></div>'
      + '<canvas class="mm-a mm-deel" width="1080" height="' + H + '"></canvas>'
      + (o.haak ? '<div class="mm-a mm-hook">' + o.haak.split(' ').map(w => '<span>' + w + '</span>').join(' ') + '</div>'
        + '<div class="mm-a mm-merk"><b><img src="' + (o.icoon || '/icon-512.png') + '" alt="">slagio.nl</b><small>' + (o.onder || '') + '</small></div>' : '');
    const ctx = root.querySelector('.mm-deel').getContext('2d'), podium = root.querySelector('.mm-podium');
    const hookW = [...root.querySelectorAll('.mm-hook span')], merk = root.querySelector('.mm-merk');
    const deel = [];
    const B = {
      $: s => root.querySelector(s), niv, podium,
      nieuw(ouder, klasse2, html2) { const el = document.createElement('div'); el.className = 'mm-a ' + klasse2; if (html2) el.innerHTML = html2; root.querySelector(ouder).appendChild(el); return el; },
      // Vonk met de voeten op (x,y); sx/sy = rek, rot = helling. De stemming wisselt alleen als hij verandert.
      vonk(sel, W) { const el = root.querySelector(sel); el.style.width = el.style.height = W + 'px'; el.style.transformOrigin = '50% 92%'; let m0 = '';
        return (m, x, y, sx = 1, sy = 1, rot = 0, zicht = 1) => { if (m !== m0) { m0 = m; el.innerHTML = vonkSVG(m, W); }
          zet(el, { left: (x - W / 2) + 'px', top: (y - W * .92) + 'px', opacity: String(zicht), transform: `rotate(${rot}deg) scale(${sx},${sy})` }); }; },
      // Tekst die letter voor letter omhoog komt uit een masker.
      letters(sel) { const el = root.querySelector(sel); const maak2 = n => { if (n.nodeType === 3) { const f = document.createDocumentFragment(); [...n.textContent].forEach(ch => { const s = document.createElement('span'); s.className = 'mm-l'; s.innerHTML = '<i>' + (ch === ' ' ? '&nbsp;' : ch) + '</i>'; f.appendChild(s); }); n.replaceWith(f); } else [...n.childNodes].forEach(maak2); };
        [...el.childNodes].forEach(maak2); return [...el.querySelectorAll('.mm-l i')]; },
      tekst(L, t, t0, stap = .035, dur = .5) { L.forEach((el, i) => { const x = p(t, t0 + i * stap, t0 + i * stap + dur, E.uit5); zet(el, { transform: `translateY(${(1 - x) * 110}%)` }); }); },
      // Papier: een handvol grote vlakke vormen die wegspatten en neerdwarrelen.
      papier({ t0, x, y, n = 14, kleuren, kracht = 1300, hoek = -Math.PI / 2, spreid = 2.4, seed = 1, leven = 2.2, maat = 1 }) {
        const r = rnd(seed); for (let i = 0; i < n; i++) { const a = hoek + (r() - .5) * spreid, v = kracht * (.45 + r() * .55);
          deel.push({ s: 'p', t0: t0 + r() * .04, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, m: (26 + r() * 30) * maat, k: kleuren[i % kleuren.length], vorm: i % 6, rot: r() * 6.28, om: (r() - .5) * 7, leven: leven * (.75 + r() * .25) }); } },
      // Stof: vlakke wolkjes die uitdijen bij een landing.
      stof({ t0, x, y, n = 6, kleur = 'rgba(255,255,255,.5)', breed = 150, seed = 2 }) {
        const r = rnd(seed); for (let i = 0; i < n; i++) deel.push({ s: 'd', t0: t0 + r() * .03, x: x + (r() - .5) * 30, y: y - r() * 8, vx: (i % 2 ? 1 : -1) * breed * (.5 + r()), m: 16 + r() * 22, k: kleur, leven: .45 + r() * .25 }); },
      // Brokken: rechthoeken die wegvliegen en vallen.
      brokken({ t0, x, y, n = 9, kleur, seed = 3, breed = 320 }) {
        const r = rnd(seed); for (let i = 0; i < n; i++) deel.push({ s: 'b', t0, x: x + (r() - .5) * breed, y, vx: (r() - .5) * 900, vy: -(300 + r() * 900), w: 30 + r() * 60, h: 22 + r() * 22, k: kleur, rot: r() * 6.28, om: (r() - .5) * 12, leven: 2 }); },
      // Slagster: één of twee beelden een vlakke ster op het punt van de klap.
      ster({ t0, x, y, r1 = 240, kleur = '#fff', punten = 12, dur = .1 }) { deel.push({ s: 'i', t0, x, y, r1, k: kleur, n: punten, leven: dur }); },
      // Vonkjes: kleine ruitjes die opstijgen uit het vuur. lus = herhaal (in de app).
      vonkjes({ t0, t1, x, y, n = 16, breed = 120, seed = 4, lus = 0, kleuren = ['#ffd76a', '#ff9a2e'] }) {
        const r = rnd(seed); for (let i = 0; i < n; i++) deel.push({ s: 'v', t0: lerp(t0, t1, r()), x: x + (r() - .5) * breed, y, vy: -(170 + r() * 220), zw: 20 + r() * 40, zf: 2 + r() * 3, ff: r() * 6.28, m: 6 + r() * 7, k: kleuren[i % kleuren.length], leven: 1 + r() * .9, lus }); },
      kader(t, { haakT = .15, merkT = 2.6 } = {}) {
        hookW.forEach((el, i) => { const x = p(t, haakT + i * .07, haakT + i * .07 + .4, E.terug); zet(el, { opacity: String(Math.min(1, x * 1.6)), transform: `translateY(${lerp(50, 0, x)}px) scale(${lerp(.85, 1, x)})` }); });
        if (merk) { const m = p(t, merkT, merkT + .5, E.uit); zet(merk, { opacity: String(m), transform: `translateY(${lerp(50, 0, m)}px)` }); }
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 1080, H); ctx.setTransform(S, 0, 0, S, 540 * (1 - S), CY - 540 * S);
        for (const d of deel) {
          let tau = t - d.t0; if (tau < 0) continue; if (d.lus && tau > d.leven) tau = tau % d.lus; if (tau > d.leven) continue; const u = tau / d.leven;
          ctx.fillStyle = ctx.strokeStyle = d.k; ctx.globalAlpha = 1;
          if (d.s === 'p') { const kk = 3, f = (1 - Math.exp(-kk * tau)) / kk, x = d.x + d.vx * f, y = d.y + d.vy * f + 330 * tau * tau, sc = (u < .08 ? u / .08 : u > .7 ? (1 - u) / .3 : 1), m = d.m * sc;
            ctx.save(); ctx.translate(x, y); ctx.rotate(d.rot + d.om * tau); ctx.beginPath();
            if (d.vorm === 0) { ctx.arc(0, 0, m * .5, 0, 6.283); ctx.fill(); }
            else if (d.vorm === 1) { ctx.moveTo(0, -m * .6); ctx.lineTo(m * .55, m * .45); ctx.lineTo(-m * .55, m * .45); ctx.closePath(); ctx.fill(); }
            else if (d.vorm === 2) { ctx.lineWidth = m * .22; ctx.lineCap = 'round'; ctx.moveTo(-m * .7, 0); ctx.bezierCurveTo(-m * .35, -m * .6, -m * .1, m * .6, m * .2, 0); ctx.bezierCurveTo(m * .4, -m * .4, m * .55, -m * .2, m * .7, 0); ctx.stroke(); }
            else if (d.vorm === 3) { ctx.lineWidth = m * .2; ctx.arc(0, 0, m * .42, 0, 6.283); ctx.stroke(); }
            else if (d.vorm === 4) { ctx.fillRect(-m * .5, -m * .13, m, m * .26); ctx.fillRect(-m * .13, -m * .5, m * .26, m); }
            else { ctx.fillRect(-m * .5, -m * .28, m, m * .56); }
            ctx.restore(); }
          else if (d.s === 'd') { const e = 1 - Math.pow(1 - u, 3); ctx.globalAlpha = 1 - u; ctx.beginPath(); ctx.ellipse(d.x + d.vx * e, d.y - e * 22, d.m * (.6 + e), d.m * (.45 + e * .5), 0, 0, 6.283); ctx.fill(); }
          else if (d.s === 'b') { const x = d.x + d.vx * tau, y = d.y + d.vy * tau + 1400 * tau * tau; ctx.globalAlpha = u > .8 ? (1 - u) / .2 : 1; ctx.save(); ctx.translate(x, y); ctx.rotate(d.rot + d.om * tau); ctx.fillRect(-d.w / 2, -d.h / 2, d.w, d.h); ctx.restore(); }
          else if (d.s === 'i') { ctx.beginPath(); for (let i = 0; i < d.n * 2; i++) { const a = i * Math.PI / d.n, rr = (i % 2 ? .45 : 1) * d.r1 * (.7 + u * .5); ctx.lineTo(d.x + Math.cos(a) * rr, d.y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
          else { const x = d.x + Math.sin(d.ff + tau * d.zf) * d.zw * u, y = d.y + d.vy * tau, m = d.m * (1 - u * .6); ctx.globalAlpha = Math.sin(u * Math.PI); ctx.save(); ctx.translate(x, y); ctx.rotate(.785); ctx.fillRect(-m / 2, -m / 2, m, m); ctx.restore(); }
        }
        ctx.globalAlpha = 1;
      },
    };
    return B;
  }
  // Sprongbaan: van a naar b met een boog van hoogte h (u = 0..1).
  const boog = (a, b, h, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)];
  // Na een landing: indrukken en terugveren (geeft sx, sy).
  const plet = (t, tl, diep = .28) => { if (t < tl) return [1, 1]; const d = Math.exp(-(t - tl) * 9) * Math.cos((t - tl) * 20) * diep; return [1 + d * .8, 1 - d]; };

  // ═══════ LEVEL OMHOOG ═══════   o: { level }
  // Vonk staat op de trede van zijn level. De volgende trede loopt vol, licht op,
  // Vonk hurkt, springt erop en plant een vaantje.
  function level(root, o) {
    const LV = Math.max(2, +(o.level || 5));
    const V0 = .5, V1 = 1.35, HK = 1.62, SP = 1.85, TL = 2.3;
    const A = { x: 110, w: 410, y: 800 }, Bt = { x: 520, w: 450, y: 640 };
    const B = basis(root, Object.assign({ haak: o.video ? 'Zo voelt een level omhoog.' : '', onder: 'Elke goede vraag levert XP op' }, o), 'mm-lv', `
      <div class="mm-a mm-wereld">
        <div class="mm-a mm-zon" style="left:${Bt.x + Bt.w / 2 - 430}px;top:${Bt.y - 500}px;width:860px;height:860px;background:#1a2147"></div>
        <div class="mm-a mm-trede mm-ta" style="left:${A.x}px;top:${A.y}px;width:${A.w}px;height:4000px;background:var(--mm-n2)"><u style="background:var(--mm-n1)"></u><b style="top:70px;color:rgba(255,255,255,.55)">${LV - 1}</b></div>
        <div class="mm-a mm-trede mm-tb" style="left:${Bt.x}px;top:${Bt.y}px;width:${Bt.w}px;height:4000px;background:#232a4d"><u style="background:#2c3460"></u>
          <div class="mm-a mm-vulw" style="left:0;right:0;top:0;height:640px;overflow:hidden"><div class="mm-a mm-vul" style="height:0"><u></u></div></div><div class="mm-a mm-glim"></div><b class="mm-tbn" style="top:86px;color:rgba(255,255,255,.22)">${LV}</b></div>
        <div class="mm-a mm-stok" style="left:${Bt.x + Bt.w - 92}px;top:${Bt.y - 250}px;height:250px"></div>
        <div class="mm-a mm-vaan" style="left:${Bt.x + Bt.w - 84}px;top:${Bt.y - 250}px;width:150px;height:96px"><svg viewBox="0 0 150 96" width="150" height="96"><path d="M0 0H150L112 48L150 96H0Z" fill="#ffb020"/><path d="M0 0H150L112 48H0Z" fill="#ffd76a"/></svg></div>
        <div class="mm-a mm-vonk"></div>
      </div>
      <div class="mm-a mm-midden mm-kick" style="top:128px">Level omhoog</div>
      <div class="mm-a mm-midden mm-groot" style="top:186px">Level <em>${LV}</em></div>`);
    root.style.setProperty('--mm-n1', B.niv[0]); root.style.setProperty('--mm-n2', B.niv[1]);
    const $ = B.$, vonk = B.vonk('.mm-vonk', 300), LK = B.letters('.mm-kick'), LG = B.letters('.mm-groot');
    const pA = [A.x + A.w / 2, A.y], pB = [Bt.x + Bt.w / 2 - 30, Bt.y];
    const KL = ['#ffc247', '#ffffff', B.niv[2], '#ff7a59'];
    B.stof({ t0: .42, x: pA[0], y: A.y, n: 4, breed: 90, seed: 5 });
    B.stof({ t0: TL, x: pB[0], y: Bt.y, n: 8, seed: 6 });
    B.ster({ t0: TL, x: pB[0], y: Bt.y + 6, r1: 150, kleur: '#fff', dur: .07 });
    B.papier({ t0: TL + .02, x: pB[0], y: Bt.y - 120, n: 16, kleuren: KL, kracht: 1500, spreid: 3, seed: 7 });
    function render(t) {
      // de treden komen omhoog
      const ia = p(t, .05, .5, E.uit5), ib = p(t, .16, .62, E.uit5);
      const dip = t >= TL ? Math.exp(-(t - TL) * 8) * Math.cos((t - TL) * 18) * 18 : 0;
      zet($('.mm-ta'), { transform: `translateY(${(1 - ia) * 420}px)` });
      zet($('.mm-tb'), { transform: `translateY(${(1 - ib) * 520 + dip}px)` });
      // de volgende trede loopt vol en licht op
      const vul = p(t, V0, V1, E.inUit); zet($('.mm-vul'), { height: (vul * 100) + '%' });
      const vol = t >= V1; zet($('.mm-tb'), { background: vol ? '#ffb020' : '#232a4d' }); zet($('.mm-tbn'), { color: vol ? '#3a1600' : 'rgba(255,255,255,.22)', transform: `scale(${1 + (vol ? Math.exp(-(t - V1) * 9) * .22 : 0)})` });
      const gl = p(t, V1, V1 + .32); zet($('.mm-glim'), { left: lerp(-160, Bt.w + 40, gl) + 'px', opacity: gl > 0 && gl < 1 ? '1' : '0' });
      // de zon achter de trap gaat op bij de landing
      const zn = p(t, TL, TL + .7, E.uit5); zet($('.mm-zon'), { transform: `scale(${zn})` });
      // Vonk: landt op zijn trede, kijkt, schrikt blij, hurkt, springt, landt, viert
      let m = 'kijk', x = pA[0], y = A.y + (1 - ia) * 420, sx = 1, sy = 1, rot = 0, zicht = p(t, .12, .3);
      if (t < HK) { const [a, b] = plet(t, .42, .2); sx = a; sy = b;
        if (t > V0 && t < V1) { sy *= 1 + Math.sin(t * 22) * .012; rot = lerp(0, 4, vul); }
        if (t >= V1) { m = 'wow'; const h = p(t, V1, V1 + .26); y -= Math.sin(h * Math.PI) * 46; const [c, d] = plet(t, V1 + .26, .14); sx = c; sy = d; rot = 4; } }
      else if (t < SP) { m = 'vastberaden'; const h = p(t, HK, SP, E.uit); sx = lerp(1, 1.16, h); sy = lerp(1, .76, h); rot = lerp(4, -8, h); }
      else if (t < TL) { m = 'wow'; const u = p(t, SP, TL); const e = u < .5 ? E.uit(u * 2) / 2 : .5 + E.in((u - .5) * 2) / 2; [x, y] = boog(pA, pB, 250, e);
        const rek = Math.sin(u * Math.PI); sx = lerp(1.1, .88, Math.min(1, u * 4)) + (1 - rek) * .04; sy = lerp(.8, 1.2, Math.min(1, u * 4)) - (u > .8 ? (u - .8) * 1.2 : 0); rot = lerp(-10, 12, u); }
      else { m = t < TL + .22 ? 'wow' : 'feest'; x = pB[0]; y = Bt.y + dip; const [a, b] = plet(t, TL, .3); sx = a; sy = b;
        if (t > TL + .7) { const dn = (t - TL - .7); y -= Math.abs(Math.sin(dn * 5.2)) * 22; rot = Math.sin(dn * 5.2) * 5; sy *= 1 + Math.sin(dn * 10.4) * .02; } }
      vonk(m, x, y, sx, sy, rot, zicht);
      // het vaantje
      const st = p(t, TL + .45, TL + .8, E.veer); zet($('.mm-stok'), { transform: `translateY(${dip}px) scaleY(${Math.min(1.05, st)})`, opacity: t > TL + .45 ? '1' : '0' });
      const vn = p(t, TL + .62, TL + 1.05, E.veer); zet($('.mm-vaan'), { transform: `translateY(${dip}px) scaleX(${Math.min(1.08, vn)}) skewY(${Math.sin(t * 5) * 4 * Math.min(1, vn)}deg)`, opacity: t > TL + .62 ? '1' : '0' });
      // de wereld schuift iets op zodat de nieuwe trede midden staat
      const cam = p(t, TL - .1, TL + .7, E.inUit); zet($('.mm-wereld'), { transform: `translate(${-cam * 150}px,${cam * 40}px)` });
      B.tekst(LK, t, TL + .18, .03, .45); B.tekst(LG, t, TL + .3, .05, .55);
      B.kader(t, { merkT: TL + 1.2 });
    }
    return { duur: 5.2, cover: 3.6, klap: TL, knop: TL + 1.3, render, geluid: [[0, 'mLevel', 1, { vul0: V0, vul1: V1, hurk: HK, sprong: SP, land: TL }]] };
  }

  // ═══════ PROMOTIE ═══════   o: { van, naar } (index in DIV of naam)
  // Onderin je oude divisie, boven het plafond de nieuwe. Het platform schiet omhoog,
  // Vonk gaat door het plafond en de kleur van de nieuwe divisie stroomt het beeld in.
  const DIV = [['Brons', '#c17a3f'], ['Zilver', '#9aa4b2'], ['Goud', '#e8a91d'], ['Platina', '#3fb8c4'], ['Diamant', '#5b8def'], ['Legende', '#a855f7']];
  const EMBLEEM = [
    '<path d="M-44 20L0 -18L44 20"/>',
    '<path d="M-44 0L0 -38L44 0M-44 42L0 4L44 42"/>',
    '<path d="M-44 -18L0 -56L44 -18M-44 22L0 -16L44 22M-44 62L0 24L44 62"/>',
    '<path fill="#fff" stroke="none" d="M0 -58L16 -18L58 -14L26 14L36 56L0 34L-36 56L-26 14L-58 -14L-16 -18Z"/>',
    '<path fill="#fff" stroke="none" d="M0 -62L52 -8L0 66L-52 -8Z"/><path d="M-52 -8H52M-20 -8L0 -62L20 -8L0 66Z" style="stroke-width:5;opacity:.45;stroke:#000"/>',
    '<path fill="#fff" stroke="none" d="M-56 44L-64 -30L-28 2L0 -52L28 2L64 -30L56 44Z"/>',
  ];
  const schild = i => { const k = DIV[i][1]; return `<svg viewBox="-105 -125 210 250">
    <path d="M0 -118L94 -84V8C94 74 48 110 0 130C-48 110 -94 74 -94 8V-84Z" fill="#fff"/>
    <path d="M0 -104L82 -74V8C82 64 42 96 0 114C-42 96 -82 64 -82 8V-74Z" fill="${k}"/>
    <path d="M0 -104L82 -74V8C82 64 42 96 0 114Z" fill="${mix(k, '#000', 18)}"/>
    <g fill="none" stroke="#fff" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 6) scale(.82)">${EMBLEEM[i]}</g></svg>`; };
  function promotie(root, o) {
    const zoek = n => typeof n === 'number' ? clamp(n, 0, 5) : Math.max(0, DIV.findIndex(d => d[0].toLowerCase() === String(n || '').toLowerCase()));
    const iN = o.naar != null ? zoek(o.naar) : 1, iV = o.van != null ? zoek(o.van) : Math.max(0, iN - 1);
    const T0 = 1.5, TI = 1.74, TP = 2.08, TR = 2.5, TS = 2.5;       // start, door het plafond, hoogste punt, rust, stempel
    const YB = 420, Y0 = 930, YI = 716, YP = 640, YR = 820;         // plafond, platform: start, klap, top, rust
    const tint = i => mix(DIV[i][1], '#0b0d18', 60), ton2 = i => DIV[i][1];
    const B = basis(root, Object.assign({ haak: o.video ? 'Deze week in de top 7.' : '', onder: 'Elke week een nieuwe wedstrijd' }, o), 'mm-pr', `
      <div class="mm-a mm-zone" style="top:${YB}px;height:5000px;background:${tint(iV)}"></div>
      <div class="mm-a mm-zone" style="top:-3000px;height:${3000 + YB}px;background:${tint(iN)}"></div>
      <div class="mm-a mm-vloed" style="left:540px;top:${YB}px;background:${tint(iN)}"></div>
      <div class="mm-a mm-rail" style="left:397px"></div><div class="mm-a mm-rail" style="left:677px"></div>
      <div class="mm-a mm-zlab mm-zl1" style="left:70px;top:${YB + 64}px">${DIV[iV][0]}</div>
      <div class="mm-a mm-zlab mm-zl2" style="left:70px;top:${YB - 70}px">${DIV[iN][0]}</div>
      <div class="mm-a mm-balk mm-bl" style="top:${YB}px;background:${ton2(iV)};transform-origin:2460px 50%"></div>
      <div class="mm-wijzers"></div>
      <div class="mm-a mm-plat"><u></u></div>
      <div class="mm-a mm-vonk"></div>
      <div class="mm-a mm-kring" style="left:540px;top:215px"></div>
      <div class="mm-a mm-schild" style="left:540px;top:215px"><div class="mm-sv">${schild(iN)}</div></div>
      <div class="mm-a mm-midden mm-groot" style="top:352px;font-size:104px">${DIV[iN][0]}-divisie</div>
      <div class="mm-a mm-midden mm-kick" style="top:480px">Promotie</div>`);
    const $ = B.$, vonk = B.vonk('.mm-vonk', 280), LG = B.letters('.mm-groot'), LK = B.letters('.mm-kick');
    const WIJ = [0, .16, .32].map((d, i) => { const el = B.nieuw('.mm-wijzers', 'mm-wijs', '<svg viewBox="-35 -23 70 46" width="70" height="46"><path d="M-26 12L0 -12L26 12" fill="none" stroke="#ffc247" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>'); el.style.left = '540px'; return { el, d, i }; });
    const KL = [DIV[iN][1], '#ffffff', '#ffc247', mix(DIV[iN][1], '#fff', 50)].map(kleurVast);
    B.ster({ t0: TI, x: 540, y: YB, r1: 170, kleur: '#fff', dur: .07 });
    B.brokken({ t0: TI, x: 540, y: YB, n: 11, kleur: kleurVast(ton2(iV)), seed: 31 });
    B.papier({ t0: TI + .03, x: 540, y: YB - 40, n: 14, kleuren: KL, kracht: 1500, spreid: 2.6, seed: 32 });
    B.stof({ t0: TR - .05, x: 540, y: YR, n: 6, breed: 220, seed: 33 });
    B.papier({ t0: TS + .02, x: 540, y: 215, n: 10, kleuren: KL, kracht: 1100, spreid: 6.283, seed: 34, leven: 1.7, maat: .8 });
    function render(t) {
      // platform: komt binnen, laadt op, schiet omhoog, veert uit
      const inn = p(t, .1, .6, E.uit5), laad = p(t, .65, T0, E.in);
      let y = lerp(Y0 + 420, Y0, inn) + laad * 26;
      if (t >= T0 && t < TI) y = lerp(Y0 + 26, YI, p(t, T0, TI, E.in));
      else if (t >= TI && t < TP) y = lerp(YI, YP, p(t, TI, TP, E.uit));
      else if (t >= TP) y = lerp(YP, YR, p(t, TP, TR, E.inUit)) + (t >= TR ? Math.exp(-(t - TR) * 8) * Math.cos((t - TR) * 17) * -16 : 0);
      const r = rnd(Math.floor(t * 30) + 7), tril = t < T0 ? laad * 7 : 0, tx = (r() - .5) * tril;
      zet($('.mm-plat'), { left: (540 + tx) + 'px', top: y + 'px' });
      WIJ.forEach(w => { const c = ((t - .65 - w.d) % .48 + .48) % .48 / .48; zet(w.el, { top: (y + 78 + w.i * 40) + 'px', opacity: String(t > .65 && t < T0 ? .35 + .65 * (c < .5 ? 1 : 0) : (t >= T0 && t < TP ? 1 : 0)), transform: `translateY(${t >= T0 ? (t - T0) * 260 : 0}px)` }); });
      // Vonk
      let m = 'blij', sx = 1, sy = 1, rot = 0;
      if (t < .65) { const [a, b] = plet(t, .6, .12); sx = a; sy = b; }
      else if (t < T0) { m = 'vastberaden'; sx = 1 + laad * .14; sy = 1 - laad * .22; }
      else if (t < TI) { m = 'wow'; const u = p(t, T0, TI); sx = lerp(1.14, .86, Math.min(1, u * 3)); sy = lerp(.78, 1.24, Math.min(1, u * 3)); }
      else if (t < TP) { m = 'wow'; const u = p(t, TI, TI + .12); sx = lerp(1.2, .95, u); sy = lerp(.74, 1.08, u); rot = Math.sin((t - TI) * 30) * 4 * (1 - p(t, TI, TP)); }
      else { m = t < TR ? 'wow' : 'feest'; const [a, b] = plet(t, TR, .22); sx = a; sy = b; if (t > TR + .5) { const dn = t - TR - .5; rot = Math.sin(dn * 4.8) * 4; sy *= 1 + Math.sin(dn * 9.6) * .02; } }
      vonk(m, 540 + tx, y + (t > TR + .5 ? -Math.abs(Math.sin((t - TR - .5) * 4.8)) * 18 : 0), sx, sy, rot, p(t, .1, .25));
      // het plafond breekt, de nieuwe kleur stroomt het beeld in
      const br = p(t, TI, TI + .5, E.uit); zet($('.mm-bl'), { opacity: String(1 - p(t, TI + .05, TI + .4)), transform: `scaleY(${1 + br * 2})` });
      const vl = p(t, TI, TI + .62, E.inUit); zet($('.mm-vloed'), { transform: `scale(${vl * 40})`, opacity: t >= TI ? '1' : '0' });
      zet($('.mm-zl1'), { opacity: String(p(t, .2, .5) * (1 - p(t, TI, TI + .15))) }); zet($('.mm-zl2'), { opacity: String(p(t, .3, .6) * (1 - p(t, TI + .2, TI + .45))) });
      // het schild wordt gestempeld, de naam komt eronder
      const sl = p(t, TS - .16, TS, E.in), [a, b] = plet(t, TS, .2);
      zet($('.mm-schild'), { opacity: t >= TS - .16 ? '1' : '0', transform: `scale(${lerp(2.6, 1, sl) * a},${lerp(2.6, 1, sl) * b}) rotate(${lerp(-14, 0, sl)}deg)` });
      const kr = p(t, TS, TS + .5, E.uit); zet($('.mm-kring'), { opacity: String(kr > 0 ? (1 - kr) : 0), transform: `scale(${lerp(.9, 2.4, kr)})`, borderWidth: lerp(12, 2, kr) + 'px' });
      B.tekst(LG, t, TS + .12, .035, .5); B.tekst(LK, t, TS + .4, .03, .45);
      B.kader(t, { merkT: TS + 1 });
    }
    return { duur: 5.4, cover: 3.8, klap: TI, knop: TS + 1.1, render, geluid: [[0, 'mPromotie', 1, { start: T0, klap: TI, stempel: TS }]] };
  }

  // ═══════ STREAK ═══════   o: { dagen }
  // Vonk huppelt naar het kampvuur met een blok hout: elke dag een blok. Het blok
  // vliegt op het vuur, het vuur laait op en het klapbord springt naar de nieuwe stand.
  function streak(root, o) {
    const N = Math.max(2, +(o.dagen || 7)), VOL = Math.min(N, 7), DX = i => 540 + (i - 3) * 92, DY = 570;
    const HOP = [.3, .62], TB = 1.2, TW = 1.5, TF = 1.88, TK = TF + .1;          // hops, uithalen, worp, blok landt, klapbord
    const sO = String(N - 1), sN = String(N), len = Math.max(sO.length, sN.length), dO = sO.padStart(len, ' '), dN = sN.padStart(len, ' ');
    const kaart = i => { const a = dO[i] === ' ' ? '' : dO[i], b = dN[i]; const wis = a !== b; return `<div class="mm-kaart" data-wis="${wis ? 1 : 0}">
        <div class="mm-helft mm-b ${wis ? 'mm-goud' : ''}"><b>${b}</b></div><div class="mm-helft mm-o"><b>${a}</b></div>
        <div class="mm-helft mm-b mm-kb"><b>${a}</b></div><div class="mm-helft mm-o mm-ko mm-goud"><b>${b}</b></div>
        <i class="mm-pen" style="left:-6px"></i><i class="mm-pen" style="right:-6px"></i></div>`; };
    const B = basis(root, Object.assign({ haak: o.video ? 'Elke dag even. Dat telt op.' : '', onder: 'Elke dag dat je oefent telt mee' }, o), 'mm-st', `
      <div class="mm-a mm-zon" style="left:240px;top:560px;width:800px;height:800px;background:#1d2040"></div>
      <div class="mm-a mm-grond"></div>
      <div class="mm-a mm-bord">${[...Array(len)].map((_, i) => kaart(i)).join('')}</div>
      <div class="mm-a mm-midden mm-onder">dagen op rij</div>
      <div class="mm-dagen"></div>
      <div class="mm-a mm-vuur"><svg viewBox="-170 -380 340 420">
        <g class="mm-v1"><path d="M0 -330C40 -250 130 -190 130 -90C130 -20 70 20 0 20S-130 -20 -130 -90C-130 -150 -90 -180 -70 -220C-60 -180 -40 -160 -20 -160C-40 -230 -30 -280 0 -330Z" fill="#ff5a1f"/></g>
        <g class="mm-v2"><path d="M0 -230C30 -180 90 -140 90 -70C90 -20 50 14 0 14S-90 -20 -90 -70C-90 -110 -60 -130 -48 -160C-40 -130 -26 -116 -12 -116C-26 -160 -20 -196 0 -230Z" fill="#ff9a2e"/></g>
        <g class="mm-v3"><path d="M0 -130C20 -100 54 -80 54 -40C54 -10 30 8 0 8S-54 -10 -54 -40C-54 -64 -36 -76 -28 -94C-24 -76 -16 -68 -8 -68C-14 -92 -12 -112 0 -130Z" fill="#ffd76a"/></g>
        <g class="mm-hout"><rect x="-128" y="-6" width="256" height="38" rx="12" fill="#6e451e" transform="rotate(-12)"/><rect x="-128" y="-6" width="256" height="38" rx="12" fill="#8a5a2b" transform="rotate(11)"/><rect x="-128" y="-6" width="256" height="13" rx="6" fill="#a8743c" transform="rotate(11)"/></g>
        <g class="mm-extra"><rect x="-104" y="-44" width="208" height="36" rx="12" fill="#8a5a2b" transform="rotate(-3)"/><rect x="-104" y="-44" width="208" height="12" rx="6" fill="#a8743c" transform="rotate(-3)"/></g></svg></div>
      <div class="mm-a mm-vonk"></div>
      <div class="mm-a mm-blok"><u></u><s></s></div>`);
    const $ = B.$, vonk = B.vonk('.mm-vonk', 270);
    const DAG = [...Array(7)].map((_, i) => { const el = B.nieuw('.mm-dagen', 'mm-dag', '<i></i><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'); el.style.left = DX(i) + 'px'; el.style.top = DY + 'px';
      return { el, vul: el.firstChild, vink: el.lastChild, t: i < VOL - 1 ? .5 + i * .09 : (i === VOL - 1 ? TF : 99) }; });
    const KA = [...root.querySelectorAll('.mm-kaart')].map(el => ({ wis: el.dataset.wis === '1', kb: el.querySelector('.mm-kb'), ko: el.querySelector('.mm-ko') }));
    const VX = 300, VY = 985, FX = 640;
    B.stof({ t0: HOP[0] + .3, x: 150, y: VY, n: 3, breed: 60, seed: 41 }); B.stof({ t0: HOP[1] + .32, x: VX, y: VY, n: 4, breed: 70, seed: 42 });
    B.ster({ t0: TF, x: FX, y: VY - 40, r1: 130, kleur: '#fff', dur: .07 });
    B.vonkjes({ t0: .2, t1: TF, x: FX, y: VY - 90, n: 8, breed: 90, seed: 43 });
    B.vonkjes({ t0: TF, t1: TF + .25, x: FX, y: VY - 120, n: 18, breed: 200, seed: 44 });
    B.vonkjes({ t0: TF + .2, t1: 5, x: FX, y: VY - 150, n: 26, breed: 170, seed: 45, lus: o.blijf ? 3 : 0 });
    function render(t) {
      // vuur: drie vlakke lagen die elk op hun eigen tempo wiebelen; laait op bij TF
      const laai = p(t, TF, TF + .5, E.veer), kr = lerp(.56, 1, Math.min(1.22, laai)) * p(t, .05, .5, E.terug), klap = t >= TF ? Math.exp(-(t - TF) * 5) * .25 : 0;
      [['.mm-v1', 7, 0], ['.mm-v2', 9.5, 1.3], ['.mm-v3', 12, 2.1]].forEach(([s, f, ph], i) => { const w = Math.sin(t * f + ph), w2 = Math.sin(t * f * .63 + ph * 2);
        $(s).setAttribute('transform', `scale(${kr * (1 + w * .05 + klap * .5)},${kr * (1 + w2 * .09 + klap * (1 + i * .3))}) skewX(${w2 * 5})`); });
      const ex = p(t, TF, TF + .25, E.terug); $('.mm-extra').setAttribute('transform', `scale(${ex})`); $('.mm-extra').setAttribute('opacity', t >= TF ? '1' : '0');
      zet($('.mm-zon'), { transform: `scale(${lerp(.55, 1, Math.min(1.1, laai)) * (1 + Math.sin(t * 3) * .015)})` });
      // Vonk huppelt binnen met het blok, haalt uit, gooit, kijkt naar het vuur
      let m = 'blij', x = VX, y = VY, sx = 1, sy = 1, rot = 0, bx, by, br = 14, blok = 1;
      const h1 = p(t, HOP[0], HOP[0] + .3), h2 = p(t, HOP[1], HOP[1] + .32);
      if (t < HOP[1] + .32) { x = h2 > 0 ? lerp(150, VX, h2) : lerp(-170, 150, h1); const u = h2 > 0 ? h2 : h1; y = VY - Math.sin(u * Math.PI) * 90; sy = 1 + Math.sin(u * Math.PI) * .1; sx = 1 - Math.sin(u * Math.PI) * .06; rot = 6;
        if (h1 >= 1 && h2 <= 0) { const [a, b] = plet(t, HOP[0] + .3, .2); sx = a; sy = b; } }
      else if (t < TB) { const [a, b] = plet(t, HOP[1] + .32, .22); sx = a; sy = b; }
      else if (t < TW) { m = 'vastberaden'; const u = p(t, TB, TW, E.uit); rot = lerp(0, -14, u); sx = 1 + u * .06; sy = 1 - u * .08; }
      else if (t < TF) { m = 'vastberaden'; const u = p(t, TW, TW + .16, E.uit); rot = lerp(-14, 14, u); sx = lerp(1.06, .96, u); sy = lerp(.92, 1.06, u); }
      else { m = t < TF + .6 ? 'wow' : 'trots'; const u = p(t, TF, TF + .5, E.uit); rot = lerp(14, 0, u) + (t < TF + .5 ? -Math.sin(u * Math.PI) * 8 : 0); const [a, b] = plet(t, TF, .1); sx = a; sy = b;
        if (t > TF + .9) { const dn = t - TF - .9; sy *= 1 + Math.sin(dn * 3.2) * .018; rot = Math.sin(dn * 1.6) * 2; } }
      vonk(m, x, y, sx, sy, rot, 1);
      // het blok: in de hand, dan in een boog naar het vuur
      const hx = x + 96 + (t >= TB && t < TW ? -p(t, TB, TW, E.uit) * 150 : 0), hy = y - 118 + (t >= TB && t < TW ? -p(t, TB, TW, E.uit) * 60 : 0);
      if (t < TW) { bx = hx; by = hy; br = 14 + rot * 2; } else { const u = p(t, TW, TF); [bx, by] = boog([VX - 54 + 96, VY - 178], [FX, VY - 60], 190, u); br = -14 + u * 330; blok = t < TF ? 1 : 0; }
      zet($('.mm-blok'), { left: bx + 'px', top: by + 'px', opacity: String(blok), transform: `rotate(${br}deg)` });
      // klapbord: bovenste helft klapt omlaag, onderste helft valt eroverheen
      const bi = p(t, .1, .55, E.uit5); zet($('.mm-bord'), { opacity: String(Math.min(1, bi * 2)), transform: `translateY(${(1 - bi) * -60}px)` });
      KA.forEach((k, i) => { if (!k.wis) { zet(k.kb, { opacity: '0' }); zet(k.ko, { opacity: '0' }); return; } const t0 = TK + i * .07, a = p(t, t0, t0 + .22, E.in), b = p(t, t0 + .22, t0 + .5, E.veer);
        zet(k.kb, { transform: `rotateX(${-a * 90}deg)`, opacity: a < 1 ? '1' : '0' }); zet(k.ko, { transform: `rotateX(${(1 - Math.min(1.12, b)) * 90}deg)`, opacity: t >= t0 + .22 ? '1' : '0' }); });
      const on = p(t, .3, .7, E.uit); zet($('.mm-onder'), { opacity: String(on), transform: `translateY(${lerp(24, 0, on)}px)` });
      DAG.forEach((d, i) => { const inn = p(t, .25 + i * .04, .6 + i * .04, E.terug), v = p(t, d.t, d.t + .3, E.terug);
        zet(d.el, { opacity: String(Math.min(1, inn * 2)), transform: `scale(${inn * (1 + Math.max(0, 1 - Math.abs(t - d.t - .08) * 9) * .3)})` });
        zet(d.vul, { opacity: String(Math.min(1, v * 2)), transform: `scale(${v})` }); zet(d.vink, { opacity: String(Math.min(1, v * 2)), transform: `scale(${v})` }); });
      B.kader(t, { merkT: TF + 1 });
    }
    return { duur: 5, cover: 3.3, klap: TF, knop: TF + 1.3, render, geluid: [[0, 'mStreak', 1, { hops: [HOP[0] + .3, HOP[1] + .32], dagen: DAG.filter((d, i) => i < VOL - 1).map(d => d.t), terug: TB, worp: TW, vlam: TF, duur: 5 }]] };
  }

  const DEF = { level, promotie, streak };
  function maak(soort, root, o) { return (DEF[soort] || level)(root, o || {}); }

  // ═══════ IN DE APP: EIGEN SCHERM MET KNOP VERDER ═══════
  // Momenten.toon('level', {level, naam}, { regel:'+120 XP', knop:'Verder', klaar: fn })
  let open = null;
  function toon(soort, o, ui) {
    ui = ui || {}; if (open) open.sluit(true);
    stijl();
    const ov = document.createElement('div'); ov.className = 'mm-ov'; ov.id = 'mm-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', ui.titel || 'Beloning');
    const root = document.createElement('div'); ov.appendChild(root);
    const voet = document.createElement('div'); voet.className = 'mm-voet';
    voet.innerHTML = (ui.regel ? '<div class="mm-regel">' + ui.regel + '</div>' : '') + '<button class="mm-knop" type="button">' + (ui.knop || 'Verder') + '</button>';
    ov.appendChild(voet); document.body.appendChild(ov);
    const vw = innerWidth, vh = innerHeight, sch = Math.min(vw / 1080, vh / 1420), H = Math.ceil(vh / sch);
    const niveau = (typeof APP_LEVEL !== 'undefined' && APP_LEVEL) || 'havo';
    // Het podium staat iets boven het midden, zodat de knop onderin vrij blijft.
    const CY = Math.max(610, Math.min(H - 710, H * ({ level: .5, streak: .5 }[soort] || .45)));
    const m = maak(soort, root, Object.assign({ H, CY, S: 1, niveau, blijf: true }, o || {}));
    root.style.transform = 'scale(' + sch + ')';
    const rustig = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    let raf = 0, t0 = 0, stopGeluid = null, knopAan = false;
    const zetKnop = () => { if (knopAan) return; knopAan = true; voet.classList.add('mm-aan'); try { voet.querySelector('.mm-knop').focus({ preventScroll: true }); } catch (e) {} };
    const lus = nu => { if (!t0) t0 = nu; const t = (nu - t0) / 1000; try { m.render(t); } catch (e) {} if (t >= m.knop) zetKnop(); raf = requestAnimationFrame(lus); };
    if (rustig) { m.render(m.cover); zetKnop(); }
    else { m.render(0); raf = requestAnimationFrame(lus);
      try { if (window.Geluid && Geluid.speelAlles && !(typeof _soundOn !== 'undefined' && !_soundOn)) stopGeluid = Geluid.speelAlles(m.geluid, 1.4); } catch (e) {}
      try { if (typeof haptic === 'function') setTimeout(() => { try { haptic([40, 40, 90, 40, 160]); } catch (e) {} }, m.klap * 1000); } catch (e) {} }
    requestAnimationFrame(() => ov.classList.add('mm-aan'));
    const toets = e => { if (e.key === 'Escape' || (e.key === 'Enter' && knopAan)) { e.preventDefault(); e.stopPropagation(); sluit(); } };
    document.addEventListener('keydown', toets, true);
    voet.querySelector('.mm-knop').addEventListener('click', () => sluit());
    // Wie tikt voordat de knop er staat, krijgt hem meteen (niemand hoeft te wachten).
    ov.addEventListener('click', e => { if (!knopAan && !e.target.closest('.mm-knop')) zetKnop(); });
    function sluit(stil) {
      if (!open) return; open = null; cancelAnimationFrame(raf); document.removeEventListener('keydown', toets, true);
      try { if (stopGeluid) stopGeluid(); } catch (e) {}
      ov.classList.remove('mm-aan'); setTimeout(() => { try { ov.remove(); } catch (e) {} }, 260);
      if (!stil) { try { if (typeof playSound === 'function') playSound('nav'); } catch (e) {} }
      try { if (typeof ui.klaar === 'function') ui.klaar(); } catch (e) {}
    }
    open = { sluit };
    return sluit;
  }
  window.Momenten = { maak, toon, DIV, sluit: () => { if (open) open.sluit(); } };
})();
