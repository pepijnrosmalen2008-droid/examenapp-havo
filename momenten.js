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
.mm-root{position:relative;overflow:hidden;width:1080px;background:#0b0d16;--mm-kop:var(--font-head,var(--kop,system-ui));--mm-tekst:var(--font,var(--tekst,system-ui));line-height:1;-webkit-font-smoothing:antialiased}
.mm-root *{box-sizing:border-box;margin:0;padding:0}
.mm-root .mm-a{position:absolute}
.mm-root svg{display:block}
.mm-bg{inset:0;background:radial-gradient(90% 70% at 50% 42%,#1c2140,#0f1118 62%,#0a0b12)}
.mm-gloed{width:1100px;height:1100px;border-radius:50%;filter:blur(60px);left:-10px;top:0}
.mm-g1{background:radial-gradient(circle,rgba(255,138,31,.42),rgba(255,138,31,0) 62%)}
.mm-g2{background:radial-gradient(circle,var(--mm-niv-g,rgba(47,107,255,.4)),rgba(47,107,255,0) 62%)}
.mm-korrel{inset:0;opacity:.07;mix-blend-mode:overlay}
.mm-deel{left:0;top:0}
.mm-podium-w{left:0;width:1080px;height:1080px;transform-origin:50% 50%}
.mm-podium{left:0;top:0;width:1080px;height:1080px}
.mm-midden{left:0;right:0;text-align:center}
.mm-hook{left:80px;right:80px;top:250px;text-align:center;font:800 80px/1.04 var(--mm-kop);color:#fff;letter-spacing:-.03em;word-spacing:.06em}
.mm-hook span{display:inline-block}
.mm-merk{left:0;right:0;top:1352px;text-align:center}
.mm-merk b{display:inline-flex;align-items:center;gap:22px;font:800 64px/1 var(--mm-kop);color:#fff;letter-spacing:-.02em}
.mm-merk img{width:84px;height:84px;border-radius:22px}
.mm-merk small{display:block;margin-top:16px;font:600 34px/1 var(--mm-tekst);color:rgba(255,255,255,.7)}
.mm-flits{inset:0;background:#fff;opacity:0;pointer-events:none}
.mm-pil{display:inline-block;padding:26px 58px 30px;border-radius:999px;background:linear-gradient(135deg,#ffd76a,#ffb020 45%,#ff8a1f);
  font:800 84px/1 var(--mm-kop);color:#3a1600;letter-spacing:-.03em;white-space:nowrap;box-shadow:0 10px 0 #c95f00,0 34px 70px -18px rgba(255,150,30,.75)}
.mm-sub{font:700 44px/1 var(--mm-tekst);color:rgba(255,255,255,.82);letter-spacing:-.01em}
.mm-ster{width:70px;height:70px;margin:-35px 0 0 -35px}
.mm-ster svg,.mm-vonk svg,.mm-ring svg,.mm-vlam svg,.mm-pijl svg{width:100%;height:100%;overflow:visible}
.mm-stralen{left:40px;width:1000px;height:1000px;border-radius:50%;opacity:0;
  background:repeating-conic-gradient(var(--mm-str,rgba(255,214,120,.42)) 0 9deg,transparent 9deg 22.5deg);
  -webkit-mask:radial-gradient(circle,#000 24%,transparent 66%);mask:radial-gradient(circle,#000 24%,transparent 66%)}
.mm-schok{border-radius:50%;border:10px solid #ffd76a;opacity:0}
.mm-label{top:120px;font:800 32px/1 var(--mm-tekst);letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.62)}
/* level */
.mm-lv .mm-stralen{top:-30px}
.mm-lv .mm-schok{left:540px;top:470px;width:470px;height:470px;margin:-235px 0 0 -235px}
.mm-lv .mm-vonk{left:370px;top:0;width:340px;height:340px}
.mm-ring{left:260px;top:190px;width:560px;height:560px}
.mm-kern{left:540px;top:470px;width:0;height:0}
.mm-kern small{position:absolute;left:-200px;width:400px;top:-150px;text-align:center;font:800 32px/1 var(--mm-tekst);letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.62)}
.mm-cijfer{position:absolute;left:-200px;width:400px;top:-108px;height:240px;overflow:hidden;text-align:center}
.mm-cijfer b,.mm-teller b{position:absolute;left:0;right:0;top:0;font:800 250px/240px var(--mm-kop);letter-spacing:-.05em;color:#fff}
.mm-cijfer b.mm-nieuw,.mm-teller b.mm-nieuw{background:linear-gradient(180deg,#fff3c4,#ffc247 48%,#ff8a1f);-webkit-background-clip:text;background-clip:text;color:transparent}
.mm-kop{left:545px;top:232px;width:0;height:0}
.mm-kop i{position:absolute;left:-17px;top:-17px;width:34px;height:34px;border-radius:50%;background:#fff;box-shadow:0 0 30px 12px rgba(255,214,120,.9)}
/* promotie */
.mm-pr .mm-stralen{top:-60px}
.mm-pr .mm-schok{left:540px;top:440px;width:460px;height:460px;margin:-230px 0 0 -230px;border-color:#fff}
.mm-streep{width:8px;border-radius:8px;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,.75),rgba(255,255,255,0))}
.mm-pr .mm-vonk{left:380px;top:0;width:320px;height:320px}
.mm-schild{left:330px;top:200px;width:420px;height:480px}
.mm-schild .mm-sv{position:absolute;inset:0}
.mm-schild svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.mm-pijl{width:90px;height:60px;margin-left:-45px}
.mm-divnaam{top:722px;height:100px;overflow:hidden}
.mm-divnaam b{position:absolute;left:0;right:0;top:0;font:800 84px/100px var(--mm-kop);color:#fff;letter-spacing:-.035em}
/* streak */
.mm-halo{left:190px;top:-40px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(255,150,40,.6),rgba(255,106,19,.18) 45%,rgba(255,106,19,0) 68%)}
.mm-st .mm-schok{left:540px;top:330px;width:380px;height:380px;margin:-190px 0 0 -190px}
.mm-vlam{left:390px;top:110px;width:300px;height:375px}
.mm-teller{top:478px;height:250px;overflow:hidden}
.mm-teller b{line-height:250px}
.mm-onder{top:738px;font:800 58px/1 var(--mm-kop);color:#ffd9a0;letter-spacing:-.02em}
.mm-dag{width:92px;height:92px;margin:-46px 0 0 -46px;border-radius:50%;background:rgba(255,255,255,.07);border:4px solid rgba(255,255,255,.14);display:grid;place-items:center}
.mm-dag i{position:absolute;inset:-4px;border-radius:50%;background:linear-gradient(135deg,#ffd76a,#ff8a1f);box-shadow:0 6px 0 #c95f00}
.mm-dag svg{position:relative;width:46px;height:46px;fill:none;stroke:#3a1600;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}
.mm-vandaag{top:968px;font:800 26px/1 var(--mm-tekst);letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.6);width:200px;margin-left:-100px;text-align:center}
.mm-vuurtje{width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;background:#fff;box-shadow:0 0 30px 14px rgba(255,190,90,.95)}
/* het scherm in de app */
.mm-ov{position:fixed;inset:0;z-index:9700;background:radial-gradient(90% 70% at 50% 42%,#1c2140,#0f1118 62%,#0a0b12);overflow:hidden;opacity:0;transition:opacity .25s ease;touch-action:manipulation}
.mm-ov.mm-aan{opacity:1}
.mm-ov .mm-root{position:absolute;left:50%;top:0;margin-left:-540px;transform-origin:50% 0;overflow:visible;background:none}
.mm-ov .mm-bg{display:none}
.mm-ov .mm-korrel{display:none}
.mm-voet{position:absolute;z-index:2;left:0;right:0;bottom:0;padding:0 22px calc(22px + env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:14px;
  opacity:0;transform:translateY(24px);transition:opacity .35s ease,transform .45s cubic-bezier(.2,1.3,.4,1);pointer-events:none}
.mm-voet.mm-aan{opacity:1;transform:none;pointer-events:auto}
.mm-regel{font:600 16px/1.35 var(--font,system-ui);color:rgba(255,255,255,.82);text-align:center;max-width:340px}
.mm-regel b{color:#ffd76a;font-weight:800}
.mm-knop{width:100%;max-width:360px;min-height:56px;border-radius:18px;border:2px solid rgba(0,0,0,.18);border-bottom-width:5px;background:var(--mm-niv,#2f6bff);color:#fff;
  font:800 18px/1 var(--font-head,system-ui);letter-spacing:-.01em;cursor:pointer;transition:transform .08s ease,border-bottom-width .08s ease}
.mm-knop:active{transform:translateY(3px);border-bottom-width:2px}
@media(prefers-reduced-motion:reduce){.mm-ov,.mm-voet{transition:opacity .2s ease}.mm-voet{transform:none}}
`;
  function stijl() { if (document.getElementById('mm-css')) return; const s = document.createElement('style'); s.id = 'mm-css'; s.textContent = CSS; document.head.appendChild(s); }

  const NIV = { havo: ['#2f6bff', 'rgba(47,107,255,.42)'], vwo: ['#7c4dff', 'rgba(124,77,255,.42)'], vmbo: ['#14b8a6', 'rgba(20,184,166,.42)'] };
  const ster = k => `<svg viewBox="-10 -10 20 20"><path d="M0 -10C1.2 -3 3 -1.2 10 0C3 1.2 1.2 3 0 10C-1.2 3 -3 1.2 -10 0C-3 -1.2 -1.2 -3 0 -10Z" fill="${k || '#ffe9a8'}"/></svg>`;
  const vonkSVG = (m, px) => (typeof mascotSVG === 'function') ? mascotSVG(m, px) : '';

  // ── Basis: achtergrond, deeltjes, flits, haak en merk (alleen in de video's) ──
  function basis(root, o, klasse, html) {
    stijl();
    const H = o.H || 1080, S = o.S || 1, CY = o.CY || 540, PY = CY - 540, niv = NIV[o.niveau] || NIV.havo;
    root.classList.add('mm-root'); root.style.height = H + 'px'; root.style.setProperty('--mm-niv', niv[0]); root.style.setProperty('--mm-niv-g', niv[1]);
    root.innerHTML = '<div class="mm-a mm-bg"></div><div class="mm-a mm-gloed mm-g1"></div><div class="mm-a mm-gloed mm-g2"></div>'
      + '<canvas class="mm-a mm-korrel" width="270" height="' + Math.round(H / 4) + '"></canvas>'
      + '<div class="mm-a mm-podium-w" style="top:' + PY + 'px;transform:scale(' + S + ')"><div class="mm-a mm-podium ' + klasse + '">' + html + '</div></div>'
      + '<canvas class="mm-a mm-deel" width="1080" height="' + H + '"></canvas>'
      + (o.haak ? '<div class="mm-a mm-hook">' + o.haak.split(' ').map(w => '<span>' + w + '</span>').join(' ') + '</div>'
        + '<div class="mm-a mm-merk"><b><img src="' + (o.icoon || '/icon-512.png') + '" alt="">slagio.nl</b><small>' + (o.onder || '') + '</small></div>' : '')
      + '<div class="mm-a mm-flits"></div>';
    const k = root.querySelector('.mm-korrel'), g = k.getContext('2d'), d = g.createImageData(k.width, k.height), r0 = rnd(5);
    for (let i = 0; i < d.data.length; i += 4) { const v = r0() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    g.putImageData(d, 0, 0); k.style.width = '1080px'; k.style.height = H + 'px';
    const ctx = root.querySelector('.mm-deel').getContext('2d'), podium = root.querySelector('.mm-podium');
    const g1 = root.querySelector('.mm-g1'), g2 = root.querySelector('.mm-g2'), flits = root.querySelector('.mm-flits');
    const hookW = [...root.querySelectorAll('.mm-hook span')], merk = root.querySelector('.mm-merk');
    const deeltjes = [];
    const B = {
      $: s => root.querySelector(s), niv, podium,
      nieuw(ouder, klasse2, html2) { const el = document.createElement('div'); el.className = 'mm-a ' + klasse2; if (html2) el.innerHTML = html2; root.querySelector(ouder).appendChild(el); return el; },
      // Confetti: n stukjes vanuit (x,y) op het podium, kegel rond hoek (rad, -PI/2 = omhoog).
      confetti({ t0, x, y, n = 60, kleuren, kracht = 1500, hoek = -Math.PI / 2, spreid = Math.PI, seed = 1, leven = 2.6 }) {
        const r = rnd(seed);
        for (let i = 0; i < n; i++) { const a = hoek + (r() - .5) * spreid, v = kracht * (.35 + r() * .65);
          deeltjes.push({ soort: 'c', t0: t0 + r() * .05, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: 14 + r() * 16, h: 8 + r() * 10,
            k: kleuren[Math.floor(r() * kleuren.length)], rot: r() * 6.28, om: (r() - .5) * 16, fl: 6 + r() * 10, ff: r() * 6.28, leven: leven * (.7 + r() * .3), rond: r() < .18 }); }
      },
      // Vonken: korte lichtpuntjes die alle kanten op schieten.
      vonken({ t0, x, y, n = 24, kleur = '#ffd76a', kracht = 700, seed = 2, leven = .7, grootte = 7 }) {
        const r = rnd(seed);
        for (let i = 0; i < n; i++) { const a = r() * 6.283, v = kracht * (.4 + r() * .6);
          deeltjes.push({ soort: 'v', t0: t0 + r() * .04, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, k: kleur, s: grootte * (.5 + r()), leven: leven * (.6 + r() * .4) }); }
      },
      // Sintels: stijgen langzaam op en doven (voor de vlam). lus = blijf herhalen na t1 (in de app).
      sintels({ t0, t1, x, y, breed = 160, n = 40, seed = 3, kleur = '#ffb020', lus = 0 }) {
        const r = rnd(seed);
        for (let i = 0; i < n; i++) deeltjes.push({ soort: 's', t0: lerp(t0, t1, r()), x: x + (r() - .5) * breed, y, vy: -(160 + r() * 240), zw: 20 + r() * 50, zf: 2 + r() * 3, ff: r() * 6.28, k: kleur, s: 3 + r() * 5, leven: 1.1 + r() * 1.1, lus });
      },
      // Elk frame: gloed, flits, schudden, haak en merk, deeltjes.
      kader(t, { flitsT = [], schud = 0, haakT = .15, merkT = 2.6 } = {}) {
        zet(g1, { transform: `translate(${-240 + Math.sin(t * .6) * 120}px,${PY - 260 + Math.cos(t * .5) * 80}px)` });
        zet(g2, { transform: `translate(${230 + Math.cos(t * .55) * 130}px,${PY + 330 + Math.sin(t * .7) * 90}px)` });
        const fl = Math.max(0, ...flitsT.map(x => t >= x ? 1 - clamp((t - x) / .22) : 0)); zet(flits, { opacity: String(fl * .5) });
        const r = rnd(Math.floor(t * 30) + 1); zet(podium, { transform: schud > 0 ? `translate(${(r() - .5) * schud}px,${(r() - .5) * schud}px)` : 'none' });
        hookW.forEach((el, i) => { const x = p(t, haakT + i * .07, haakT + i * .07 + .4, E.terug); zet(el, { opacity: String(Math.min(1, x * 1.6)), transform: `translateY(${lerp(50, 0, x)}px) scale(${lerp(.85, 1, x)})` }); });
        if (merk) { const m = p(t, merkT, merkT + .5, E.uit); zet(merk, { opacity: String(m), transform: `translateY(${lerp(50, 0, m)}px)` }); }
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 1080, H); ctx.setTransform(S, 0, 0, S, 540 * (1 - S), CY - 540 * S);
        for (const d of deeltjes) {
          let tau = t - d.t0; if (tau < 0) continue; if (d.lus && tau > d.leven) tau = tau % d.lus; if (tau > d.leven) continue; const u = tau / d.leven;
          if (d.soort === 'c') { const kk = 2.2, f = (1 - Math.exp(-kk * tau)) / kk; const x = d.x + d.vx * f, y = d.y + d.vy * f + 520 * tau * tau;
            ctx.save(); ctx.translate(x, y); ctx.rotate(d.rot + d.om * tau); ctx.scale(1, Math.cos(d.ff + d.fl * tau));
            ctx.globalAlpha = u > .75 ? (1 - u) / .25 : 1; ctx.fillStyle = d.k; ctx.beginPath();
            if (d.rond) ctx.arc(0, 0, d.h * .8, 0, 6.283); else if (ctx.roundRect) ctx.roundRect(-d.w / 2, -d.h / 2, d.w, d.h, 3); else ctx.rect(-d.w / 2, -d.h / 2, d.w, d.h);
            ctx.fill(); ctx.restore(); }
          else if (d.soort === 'v') { const kk = 4, f = (1 - Math.exp(-kk * tau)) / kk; const x = d.x + d.vx * f, y = d.y + d.vy * f + 200 * tau * tau;
            ctx.globalAlpha = (1 - u) * (1 - u); ctx.fillStyle = d.k; ctx.beginPath(); ctx.arc(x, y, d.s * (1 - u * .6), 0, 6.283); ctx.fill();
            ctx.globalAlpha = (1 - u) * .25; ctx.beginPath(); ctx.arc(x, y, d.s * 2.6, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
          else { const x = d.x + Math.sin(d.ff + tau * d.zf) * d.zw * u, y = d.y + d.vy * tau;
            ctx.globalAlpha = Math.sin(u * Math.PI) * .9; ctx.fillStyle = d.k; ctx.beginPath(); ctx.arc(x, y, d.s * (1 - u * .5), 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
        }
      },
      sterren(lijst, t0, stap, kleur2) { return lijst.map(([x, y, s], i) => { const el = B.nieuw('.mm-sterren', 'mm-ster', ster(i % 2 ? '#fff' : (kleur2 || '#ffe08a'))); el.style.left = x + 'px'; el.style.top = y + 'px'; return { el, s, t: t0 + i * stap }; }); },
      // blijf = in de app blijven de glinsteringen staan; in de video doven ze aan het eind.
      tekenSterren(ST, t, uitA, uitB) { ST.forEach(s => { const x = p(t, s.t, s.t + .35, E.terug); const tw = .75 + Math.sin(t * 5 + s.t * 9) * .25; zet(s.el, { opacity: String(Math.min(1, x * 2) * (o.blijf ? 1 : 1 - p(t, uitA, uitB))), transform: `scale(${x * s.s * tw}) rotate(${t * 40 + s.t * 90}deg)` }); }); },
    };
    return B;
  }
  const kleurVast = k => { const d = document.createElement('i'); d.style.color = k; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
  const mix = (k, w, pc) => `color-mix(in srgb,${k} ${100 - pc}%,${w} ${pc}%)`;

  // ═══════ LEVEL OMHOOG ═══════   o: { level, naam }
  function level(root, o) {
    const LV = Math.max(2, +(o.level || 5)), R = 215, OM = 2 * Math.PI * R, T0 = 1.62;
    const B = basis(root, Object.assign({ haak: o.video ? 'Zo voelt een level omhoog.' : '', onder: 'Elke goede vraag levert XP op' }, o), 'mm-lv', `
      <div class="mm-a mm-stralen"></div>
      <div class="mm-a mm-schok mm-s1"></div><div class="mm-a mm-schok mm-s2"></div>
      <div class="mm-a mm-vonk"></div>
      <div class="mm-a mm-ring"><svg viewBox="-280 -280 560 560">
        <defs><linearGradient id="mm-rg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ff7a1a"/><stop offset=".55" stop-color="#ffb020"/><stop offset="1" stop-color="#ffe08a"/></linearGradient>
        <radialGradient id="mm-kg" cx=".5" cy=".38" r=".7"><stop offset="0" stop-color="#262c52"/><stop offset="1" stop-color="#12152a"/></radialGradient></defs>
        <circle r="${R + 22}" fill="url(#mm-kg)"/><circle r="${R}" fill="none" stroke="rgba(255,255,255,.09)" stroke-width="40"/>
        <circle class="mm-boog" r="${R}" fill="none" stroke="url(#mm-rg)" stroke-width="40" stroke-linecap="round" stroke-dasharray="${OM}" stroke-dashoffset="${OM}" transform="rotate(-90)"/>
        <circle r="${R - 34}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="2"/></svg></div>
      <div class="mm-a mm-kop"><i></i></div>
      <div class="mm-a mm-kern"><small>Level</small><div class="mm-cijfer"><b class="mm-oud">${LV - 1}</b><b class="mm-nieuw">${LV}</b></div></div>
      <div class="mm-sterren"></div>
      <div class="mm-a mm-midden mm-pilw" style="top:800px"><span class="mm-pil">Level omhoog</span></div>
      <div class="mm-a mm-midden mm-sub" style="top:968px">${o.naam ? 'Je bent nu ' + o.naam : ''}</div>`);
    const $ = B.$, ST = B.sterren([[250, 300, .9], [840, 250, 1.2], [900, 560, .8], [190, 600, 1.1], [300, 130, .7], [800, 720, .75]], T0 + .12, .09);
    const GOUD = ['#ffd76a', '#ffb020', '#ff8a1f', '#ffffff', B.niv[0], '#fff3c4'];
    B.confetti({ t0: T0, x: 540, y: 470, n: 110, kleuren: GOUD, kracht: 1900, spreid: 6.283, seed: 11, leven: 3 });
    B.confetti({ t0: T0 + .42, x: 120, y: 1000, n: 46, kleuren: GOUD, kracht: 2100, hoek: -1.15, spreid: .7, seed: 12, leven: 2.8 });
    B.confetti({ t0: T0 + .5, x: 960, y: 1000, n: 46, kleuren: GOUD, kracht: 2100, hoek: -1.99, spreid: .7, seed: 13, leven: 2.8 });
    B.vonken({ t0: T0, x: 540, y: 470, n: 46, kracht: 1500, seed: 14, leven: .8, grootte: 9 });
    for (let i = 0; i < 22; i++) { const tt = .55 + i * .047, f = lerp(.62, 1, p(tt, .5, T0, E.inUit)), a = -Math.PI / 2 + f * 6.283; B.vonken({ t0: tt, x: 540 + Math.cos(a) * R, y: 470 + Math.sin(a) * R, n: 3, kracht: 260, seed: 40 + i, leven: .45, grootte: 5 }); }
    let stemming = ''; const vonkZet = m => { if (m !== stemming) { stemming = m; $('.mm-vonk').innerHTML = vonkSVG(m, 340); } };
    function render(t) {
      let schud = 0;
      const op = p(t, .05, .5, E.terug);
      const puls = t >= T0 ? 1 + Math.exp(-(t - T0) * 7) * Math.cos((t - T0) * 22) * .13 : 1 + p(t, 1.2, T0, E.in) * .03;
      zet($('.mm-ring'), { opacity: String(Math.min(1, op * 1.8)), transform: `scale(${lerp(.6, 1, op) * puls})` });
      zet($('.mm-kern'), { opacity: String(Math.min(1, op * 1.8)), transform: `scale(${lerp(.6, 1, op) * puls})` });
      const vol = t < T0 ? lerp(.62, 1, p(t, .5, T0, E.inUit)) : lerp(0, .12, p(t, T0 + .5, T0 + 1.3, E.uit5));
      $('.mm-boog').setAttribute('stroke-dashoffset', String(OM * (1 - vol)));
      const a = -Math.PI / 2 + vol * 6.283;
      zet($('.mm-kop'), { left: (540 + Math.cos(a) * R) + 'px', top: (470 + Math.sin(a) * R) + 'px', opacity: t > .5 && t < T0 ? '1' : '0', transform: `scale(${1 + Math.sin(t * 40) * .15})` });
      if (t > 1.15 && t < T0) schud = p(t, 1.15, T0) * 9;
      const wis = p(t, T0 - .02, T0 + .5, E.veer);
      zet($('.mm-oud'), { transform: `translateY(${-wis * 260}px)`, opacity: String(1 - p(t, T0, T0 + .14)) });
      zet($('.mm-nieuw'), { transform: `translateY(${lerp(260, 0, wis)}px) scale(${1 + (t >= T0 ? Math.exp(-(t - T0) * 6) * .25 : 0)})`, opacity: t >= T0 - .02 ? '1' : '0' });
      const str = p(t, T0, T0 + .45, E.uit5); zet($('.mm-stralen'), { opacity: String(str * (.85 - p(t, 3.9, 5) * .35)), transform: `rotate(${t * 26}deg) scale(${lerp(.45, 1.08, str)})` });
      [['.mm-s1', 0], ['.mm-s2', .16]].forEach(([s, d]) => { const x = p(t, T0 + d, T0 + d + .7, E.uit); zet($(s), { opacity: String(x > 0 ? (1 - x) * .9 : 0), transform: `scale(${lerp(.9, 2.5, x)})`, borderWidth: lerp(12, 2, x) + 'px' }); });
      if (t >= T0 && t < T0 + .3) schud = (T0 + .3 - t) * 70;
      vonkZet(t < T0 + .75 ? 'wow' : 'feest');
      const vk = p(t, T0 + .12, T0 + .7, E.veer); const dans = t > T0 + .7 ? Math.sin((t - T0 - .7) * 5.2) : 0;
      zet($('.mm-vonk'), { opacity: t > T0 + .1 ? '1' : '0', transform: `translateY(${lerp(250, -36, Math.min(1.08, vk)) + Math.abs(dans) * -16}px) rotate(${dans * 5}deg)` });
      const pl = p(t, T0 + .38, T0 + .85, E.veer); zet($('.mm-pilw'), { opacity: String(Math.min(1, pl * 2.2)), transform: `scale(${lerp(.3, 1, pl)}) rotate(${lerp(-6, 0, Math.min(1, pl))}deg)` });
      const sb = p(t, T0 + .8, T0 + 1.2, E.uit); zet($('.mm-sub'), { opacity: String(sb), transform: `translateY(${lerp(30, 0, sb)}px)` });
      B.tekenSterren(ST, t, 4.5, 5);
      B.kader(t, { flitsT: [T0], schud, merkT: T0 + 1.2 });
    }
    return { duur: 5, cover: 2.9, klap: T0, knop: T0 + 1.5, render, geluid: [[0, 'mLevel', 1, { hit: T0 }]] };
  }

  // ═══════ PROMOTIE ═══════   o: { van, naar } (index in DIV of naam)
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
    <path d="M0 -118L94 -84V8C94 74 48 110 0 130C-48 110 -94 74 -94 8V-84Z" fill="${mix(k, '#000', 42)}"/>
    <path d="M0 -104L82 -74V8C82 64 42 96 0 114C-42 96 -82 64 -82 8V-74Z" fill="${k}"/>
    <path d="M0 -104L82 -74V8C82 64 42 96 0 114Z" fill="${mix(k, '#000', 16)}"/>
    <path d="M0 -104L-82 -74V-30L0 -62Z" fill="${mix(k, '#fff', 34)}"/><path d="M0 -104L82 -74V-30L0 -62Z" fill="${mix(k, '#fff', 14)}"/>
    <g fill="none" stroke="#fff" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 18) scale(.82)">${EMBLEEM[i]}</g></svg>`; };
  function promotie(root, o) {
    const zoek = n => typeof n === 'number' ? clamp(n, 0, 5) : Math.max(0, DIV.findIndex(d => d[0].toLowerCase() === String(n || '').toLowerCase()));
    const iN = o.naar != null ? zoek(o.naar) : 1, iV = o.van != null ? zoek(o.van) : Math.max(0, iN - 1);
    const T0 = 1.7, TL = T0 + .42;
    const B = basis(root, Object.assign({ haak: o.video ? 'Deze week in de top 7.' : '', onder: 'Elke week een nieuwe wedstrijd' }, o), 'mm-pr', `
      <div class="mm-a mm-midden mm-label">Weekwedstrijd</div>
      <div class="mm-a mm-stralen" style="--mm-str:${mix(DIV[iN][1], '#fff', 45)}"></div>
      <div class="mm-strepen"></div>
      <div class="mm-a mm-schok mm-s1"></div><div class="mm-a mm-schok mm-s2"></div>
      <div class="mm-a mm-vonk"></div>
      <div class="mm-a mm-schild"><div class="mm-sv">${schild(iV)}</div></div>
      <div class="mm-pijlen"></div>
      <div class="mm-a mm-midden mm-divnaam"><b class="mm-doud">${DIV[iV][0]}-divisie</b><b class="mm-dnieuw">${DIV[iN][0]}-divisie</b></div>
      <div class="mm-sterren"></div>
      <div class="mm-a mm-midden mm-pilw" style="top:856px"><span class="mm-pil">Promotie</span></div>`);
    const $ = B.$, rs = rnd(21);
    const STR = [...Array(16)].map((_, i) => ({ el: B.nieuw('.mm-strepen', 'mm-streep'), x: 90 + i * 60 + (rs() - .5) * 30, h: 160 + rs() * 260, v: 1500 + rs() * 1300, f: rs() }));
    const PIJ = [[190, 0], [190, .18], [190, .36], [890, .09], [890, .27], [890, .45]].map(([x, d]) => { const el = B.nieuw('.mm-pijlen', 'mm-pijl', '<svg viewBox="-45 -30 90 60"><path d="M-34 16L0 -16L34 16" fill="none" stroke="#4ade80" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></svg>'); el.style.left = x + 'px'; return { el, d }; });
    const ST = B.sterren([[230, 250, 1], [850, 230, 1.2], [910, 560, .8], [170, 590, 1.05], [320, 110, .7], [770, 120, .8]], T0 + .5, .09, mix(DIV[iN][1], '#fff', 55));
    const KL = [DIV[iN][1], '#ffffff', '#ffd76a', '#ffb020', mix(DIV[iN][1], '#fff', 50), '#4ade80'].map(kleurVast);
    B.confetti({ t0: TL, x: 540, y: 440, n: 120, kleuren: KL, kracht: 2000, spreid: 6.283, seed: 31, leven: 3 });
    B.confetti({ t0: TL + .38, x: 110, y: 1010, n: 44, kleuren: KL, kracht: 2100, hoek: -1.15, spreid: .7, seed: 32, leven: 2.8 });
    B.confetti({ t0: TL + .46, x: 970, y: 1010, n: 44, kleuren: KL, kracht: 2100, hoek: -1.99, spreid: .7, seed: 33, leven: 2.8 });
    B.vonken({ t0: TL, x: 540, y: 440, n: 50, kleur: '#ffffff', kracht: 1500, seed: 34, leven: .8, grootte: 9 });
    let stemming = '', gezicht = iV; const vonkZet = m => { if (m !== stemming) { stemming = m; $('.mm-vonk').innerHTML = vonkSVG(m, 320); } };
    function render(t) {
      let schud = 0;
      const lb = p(t, .05, .45, E.uit); zet($('.mm-label'), { opacity: String(lb * (1 - p(t, T0 + .3, T0 + .5))), transform: `translateY(${lerp(-30, 0, lb)}px)` });
      const op = p(t, .1, .6, E.veer), laad = p(t, .7, T0, E.in);
      const spr = p(t, T0, TL), hoogte = Math.sin(spr * Math.PI) * -150, draai = p(t, T0, TL, E.inUit) * 540;
      const land = t >= TL ? 1 + Math.exp(-(t - TL) * 7) * Math.cos((t - TL) * 20) * .16 : 1;
      const face = draai >= 270 ? iN : iV; if (face !== gezicht) { gezicht = face; $('.mm-sv').innerHTML = schild(face); }
      const tril = t < T0 ? laad * 10 : 0, r = rnd(Math.floor(t * 30) + 7);
      zet($('.mm-schild'), { opacity: String(Math.min(1, op * 2)), transform: `translate(${(r() - .5) * tril}px,${hoogte + (r() - .5) * tril + (t > TL + .5 ? Math.sin((t - TL) * 2.2) * 8 : 0)}px) perspective(1400px) rotateY(${draai}deg) scale(${lerp(.4, 1, Math.min(1.1, op)) * (1 + laad * .06) * (1 + Math.sin(spr * Math.PI) * .22) * land})` });
      STR.forEach(s => { const y = 1150 - ((t * s.v + s.f * 1400) % 1500); zet(s.el, { left: s.x + 'px', top: y + 'px', height: s.h + 'px', opacity: String(laad * .55 * (1 - p(t, TL, TL + .3))) }); });
      PIJ.forEach(a => { const c = ((t - .7 - a.d) % .9 + .9) % .9 / .9; const aan = t > .7 + a.d && t < TL; zet(a.el, { top: (700 - c * 420) + 'px', opacity: String(aan ? Math.sin(c * Math.PI) * .95 * (1 - p(t, T0, TL)) : 0), transform: `scale(${.7 + c * .5})` }); });
      if (t > 1.2 && t < T0) schud = laad * 8; if (t >= TL && t < TL + .3) schud = (TL + .3 - t) * 80;
      const str = p(t, TL, TL + .45, E.uit5); zet($('.mm-stralen'), { opacity: String(str * (.9 - p(t, 4.4, 5.4) * .35)), transform: `rotate(${t * 24}deg) scale(${lerp(.45, 1.08, str)})` });
      [['.mm-s1', 0], ['.mm-s2', .16]].forEach(([s, d]) => { const x = p(t, TL + d, TL + d + .7, E.uit); zet($(s), { opacity: String(x > 0 ? (1 - x) * .9 : 0), transform: `scale(${lerp(.9, 2.6, x)})`, borderWidth: lerp(12, 2, x) + 'px' }); });
      const nm = p(t, .3, .7, E.uit), wis = p(t, TL - .05, TL + .45, E.veer);
      zet($('.mm-doud'), { opacity: String(nm * (1 - p(t, TL, TL + .12))), transform: `translateY(${lerp(40, 0, nm) - wis * 110}px)` });
      zet($('.mm-dnieuw'), { opacity: t >= TL - .05 ? '1' : '0', transform: `translateY(${lerp(110, 0, wis)}px)` });
      vonkZet(t < TL + .9 ? 'wow' : 'trots');
      const vk = p(t, TL + .15, TL + .75, E.veer), dans = t > TL + .75 ? Math.sin((t - TL - .75) * 4.6) : 0;
      zet($('.mm-vonk'), { opacity: t > TL + .12 ? '1' : '0', transform: `translateY(${lerp(260, -50, Math.min(1.08, vk)) + Math.abs(dans) * -14}px) rotate(${dans * 4}deg)` });
      const pl = p(t, TL + .3, TL + .8, E.veer); zet($('.mm-pilw'), { opacity: String(Math.min(1, pl * 2.2)), transform: `scale(${lerp(.3, 1, pl)}) rotate(${lerp(6, 0, Math.min(1, pl))}deg)` });
      B.tekenSterren(ST, t, 4.9, 5.4);
      B.kader(t, { flitsT: [TL], schud, merkT: TL + 1.1 });
    }
    return { duur: 5.4, cover: 3.2, klap: TL, knop: TL + 1.4, render, geluid: [[0, 'mPromotie', 1, { start: T0, land: TL }]] };
  }

  // ═══════ STREAK ═══════   o: { dagen }
  function streak(root, o) {
    const N = Math.max(2, +(o.dagen || 7)), VOL = Math.min(N, 7), DX = i => 540 + (i - 3) * 128, DY = 900, TD = 1.45, TF = TD + .42;
    const B = basis(root, Object.assign({ haak: o.video ? 'Elke dag even. Dat telt op.' : '', onder: 'Elke dag dat je oefent telt mee' }, o), 'mm-st', `
      <div class="mm-a mm-halo"></div>
      <div class="mm-a mm-schok mm-s1"></div><div class="mm-a mm-schok mm-s2"></div>
      <div class="mm-a mm-vlam"><svg viewBox="0 0 120 150">
        <defs><linearGradient id="mm-fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff3d00"/><stop offset=".55" stop-color="#ff8a1f"/><stop offset="1" stop-color="#ffd76a"/></linearGradient>
        <linearGradient id="mm-fl2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffd76a"/><stop offset="1" stop-color="#fff6d0"/></linearGradient></defs>
        <path d="M60 4C74 34 104 52 104 92c0 30-20 52-44 52S16 122 16 92c0-22 12-34 20-44 2 14 8 22 16 24-4-24 0-44 8-68z" fill="url(#mm-fl)"/>
        <path class="mm-fk" d="M60 64c10 16 24 24 24 44 0 16-10 28-24 28s-24-12-24-28c0-12 8-20 12-26 2 8 6 12 10 12-2-12-2-20 2-30z" fill="url(#mm-fl2)"/></svg></div>
      <div class="mm-a mm-midden mm-teller"><b class="mm-oud">${N - 1}</b><b class="mm-nieuw">${N}</b></div>
      <div class="mm-a mm-midden mm-onder">dagen op rij</div>
      <div class="mm-dagen"></div>
      <div class="mm-a mm-vandaag" style="left:${DX(VOL - 1)}px">vandaag</div>
      <div class="mm-a mm-vuurtje"></div>
      <div class="mm-sterren"></div>`);
    const $ = B.$;
    const DAG = [...Array(7)].map((_, i) => { const el = B.nieuw('.mm-dagen', 'mm-dag', '<i></i><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'); el.style.left = DX(i) + 'px'; el.style.top = DY + 'px';
      return { el, vul: el.firstChild, vink: el.lastChild, t: i < VOL - 1 ? .45 + i * .11 : (i === VOL - 1 ? TD : 99) }; });
    const ST = B.sterren([[250, 200, 1], [830, 170, 1.15], [880, 420, .8], [200, 440, .9]], TF + .15, .1);
    B.vonken({ t0: TD, x: DX(VOL - 1), y: DY, n: 18, kracht: 520, seed: 51, leven: .5, grootte: 6 });
    B.vonken({ t0: TF, x: 540, y: 360, n: 60, kleur: '#ffd76a', kracht: 1500, seed: 52, leven: .9, grootte: 9 });
    B.vonken({ t0: TF, x: 540, y: 360, n: 30, kleur: '#ff8a1f', kracht: 1000, seed: 53, leven: 1.1, grootte: 8 });
    B.sintels({ t0: .3, t1: TF, x: 540, y: 430, breed: 120, n: 14, seed: 54 });
    B.sintels({ t0: TF, t1: 5, x: 540, y: 440, breed: 230, n: 90, seed: 55, lus: o.blijf ? 3.2 : 0 });
    B.sintels({ t0: TF, t1: 5, x: 540, y: 440, breed: 200, n: 40, seed: 56, kleur: '#fff0c0', lus: o.blijf ? 3.2 : 0 });
    function render(t) {
      let schud = 0;
      const op = p(t, .05, .5, E.terug), laai = p(t, TF, TF + .5, E.veer), kracht = lerp(.62, 1, Math.min(1.25, laai));
      const flik = 1 + Math.sin(t * 9) * .03 + Math.sin(t * 23) * .015, klap = t >= TF ? Math.exp(-(t - TF) * 5) * .3 : 0;
      zet($('.mm-vlam'), { opacity: String(Math.min(1, op * 2)), transform: `translateY(${(1 - kracht) * 90}px) scale(${lerp(.3, 1, op) * kracht * flik * (1 + klap)},${lerp(.3, 1, op) * kracht * (1 + Math.sin(t * 13) * .035) * (1 + klap * 1.4)}) rotate(${Math.sin(t * 6) * 2.4}deg)`, filter: `saturate(${lerp(.55, 1, Math.min(1, laai))}) brightness(${lerp(.8, 1, Math.min(1, laai))})`, transformOrigin: '50% 92%' });
      zet($('.mm-fk'), { transform: `translateY(${Math.sin(t * 11) * 2.5}px) scale(${1 + Math.sin(t * 17) * .04})`, transformOrigin: '60px 130px' });
      zet($('.mm-halo'), { opacity: String(lerp(.25, .95, Math.min(1, laai)) * op), transform: `scale(${lerp(.7, 1, Math.min(1, laai)) * (1 + Math.sin(t * 7) * .03) + klap})` });
      const cf = p(t, .15, .55, E.uit), wis = p(t, TF - .02, TF + .5, E.veer);
      zet($('.mm-oud'), { opacity: String(cf * (1 - p(t, TF, TF + .14))), transform: `translateY(${lerp(40, 0, cf) - wis * 270}px)` });
      zet($('.mm-nieuw'), { opacity: t >= TF - .02 ? '1' : '0', transform: `translateY(${lerp(270, 0, wis)}px) scale(${1 + (t >= TF ? Math.exp(-(t - TF) * 6) * .22 : 0)})` });
      const on = p(t, .3, .7, E.uit); zet($('.mm-onder'), { opacity: String(on), transform: `translateY(${lerp(30, 0, on)}px)` });
      DAG.forEach((d, i) => { const inn = p(t, .2 + i * .04, .55 + i * .04, E.terug), v = p(t, d.t, d.t + .3, E.terug), pu = i === VOL - 1 && t < TD ? 1 + Math.sin(t * 6) * .06 : 1;
        zet(d.el, { opacity: String(Math.min(1, inn * 2)), transform: `scale(${inn * pu * (1 + Math.max(0, 1 - Math.abs(t - d.t - .08) * 9) * .25)})` });
        zet(d.vul, { opacity: String(Math.min(1, v * 2)), transform: `scale(${v})` }); zet(d.vink, { opacity: String(Math.min(1, v * 2)), transform: `scale(${v})` }); });
      const vd = p(t, .5, .8, E.uit); zet($('.mm-vandaag'), { opacity: String(vd * (.6 + .4 * Math.sin(t * 6) ** 2)) });
      const vl = p(t, TD + .06, TF, E.inUit), x0 = DX(VOL - 1), bx = lerp(x0, 540, vl), by = lerp(DY, 400, vl) - Math.sin(vl * Math.PI) * 170;
      zet($('.mm-vuurtje'), { left: bx + 'px', top: by + 'px', opacity: vl > 0 && vl < 1 ? '1' : '0', transform: `scale(${1 + Math.sin(t * 50) * .2})` });
      [['.mm-s1', 0], ['.mm-s2', .16]].forEach(([s, d]) => { const x = p(t, TF + d, TF + d + .7, E.uit); zet($(s), { opacity: String(x > 0 ? (1 - x) * .9 : 0), transform: `scale(${lerp(.8, 2.8, x)})`, borderWidth: lerp(12, 2, x) + 'px' }); });
      if (t >= TF && t < TF + .3) schud = (TF + .3 - t) * 60;
      B.tekenSterren(ST, t, 4.5, 5);
      B.kader(t, { flitsT: [TF], schud, merkT: TF + 1 });
    }
    return { duur: 5, cover: 3.1, klap: TF, knop: TF + 1.3, render, geluid: [[0, 'mStreak', 1, { dagen: DAG.filter((d, i) => i < VOL - 1).map(d => d.t), vink: TD, vlam: TF, duur: 5 }]] };
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
    const CY = Math.max(610, Math.min(H - 710, H * .43));
    const m = maak(soort, root, Object.assign({ H, CY, S: 1, niveau, blijf: true }, o || {}));
    root.style.transform = 'scale(' + sch + ')'; ov.style.setProperty('--mm-niv', NIV[niveau] ? NIV[niveau][0] : NIV.havo[0]);
    const rustig = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    let raf = 0, t0 = 0, stopGeluid = null, knopAan = false;
    const zetKnop = () => { if (knopAan) return; knopAan = true; voet.classList.add('mm-aan'); try { voet.querySelector('.mm-knop').focus({ preventScroll: true }); } catch (e) {} };
    const lus = nu => { if (!t0) t0 = nu; const t = (nu - t0) / 1000; try { m.render(t); } catch (e) {} if (t >= m.knop) zetKnop(); raf = requestAnimationFrame(lus); };
    if (rustig) { m.render(m.cover); zetKnop(); }
    else { m.render(0); raf = requestAnimationFrame(lus);
      try { if (window.Geluid && Geluid.speelAlles && !(typeof _soundOn !== 'undefined' && !_soundOn)) stopGeluid = Geluid.speelAlles(m.geluid, .9); } catch (e) {}
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
