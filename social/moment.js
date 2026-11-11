// ═══════════════════════════════════════════════════════════════════════
// social/moment.js - gedeelde basis voor de momenten (level, promotie, streak)
// ───────────────────────────────────────────────────────────────────────
// Eén pagina levert twee formaten:
//   posts/moment-level.html            → 1080×1080 (voor in de app, of een feedpost)
//   posts/moment-level.html?f=reel     → 1080×1920 met haak bovenin en merk onderin
// Alles wat het moment zelf tekent staat op .mm-podium (1080×1080, gecentreerd).
// Deeltjes (confetti, vonken, sintels) staan op één canvas en volgen een gesloten
// formule van t, dus elk frame is reproduceerbaar.
// ═══════════════════════════════════════════════════════════════════════
(function () {
  const { p, E, lerp, zet, rnd, clamp } = Motion;
  const q = new URLSearchParams(location.search);
  const reel = q.get('f') === 'reel';
  const H = reel ? 1920 : 1080, S = reel ? .84 : 1, CY = reel ? 910 : 540, PY = CY - 540;
  const NIV = { havo: ['#2f6bff', 'rgba(47,107,255,.42)'], vwo: ['#7c4dff', 'rgba(124,77,255,.42)'], vmbo: ['#14b8a6', 'rgba(20,184,166,.42)'] };
  const niv = NIV[q.get('niveau')] || NIV.havo;
  let ctx, podium, g1, g2, flits, hookW = [], merk;
  const deeltjes = [];

  function bouw(html, opts = {}) {
    const c = document.querySelector('.mo-canvas');
    c.style.height = H + 'px'; c.style.setProperty('--niv', niv[0]); c.style.setProperty('--niv-g', niv[1]);
    c.innerHTML = '<div class="abs mm-bg"></div><div class="abs mm-gloed mm-g1"></div><div class="abs mm-gloed mm-g2"></div>'
      + '<canvas class="abs mm-korrel" width="540" height="' + (H / 2) + '"></canvas>'
      + '<div class="abs mm-podium-w" style="top:' + PY + 'px;transform:scale(' + S + ')"><div class="abs mm-podium">' + html + '</div></div>'
      + '<canvas class="abs mm-deel" width="1080" height="' + H + '"></canvas>'
      + (reel ? '<div class="abs mm-hook">' + (opts.haak || '').split(' ').map(w => '<span>' + w + '</span>').join(' ') + '</div>'
        + '<div class="abs mm-merk"><b><img src="../../icon-512.png" alt="">slagio.nl</b><small>' + (opts.onder || 'Gratis oefenen voor je examen') + '</small></div>' : '')
      + '<div class="abs mm-flits"></div>';
    const k = c.querySelector('.mm-korrel'), g = k.getContext('2d'), d = g.createImageData(k.width, k.height), r = rnd(5);
    for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    g.putImageData(d, 0, 0); k.style.width = '1080px'; k.style.height = H + 'px';
    ctx = c.querySelector('.mm-deel').getContext('2d'); podium = c.querySelector('.mm-podium');
    g1 = c.querySelector('.mm-g1'); g2 = c.querySelector('.mm-g2'); flits = c.querySelector('.mm-flits');
    hookW = [...c.querySelectorAll('.mm-hook span')]; merk = c.querySelector('.mm-merk');
    return podium;
  }
  // Confetti: n stukjes vanuit (x,y) op het podium, kegel rond hoek (rad, -PI/2 = omhoog).
  function confetti({ t0, x, y, n = 60, kleuren, kracht = 1500, hoek = -Math.PI / 2, spreid = Math.PI, seed = 1, leven = 2.6 }) {
    const r = rnd(seed);
    for (let i = 0; i < n; i++) {
      const a = hoek + (r() - .5) * spreid, v = kracht * (.35 + r() * .65);
      deeltjes.push({ soort: 'c', t0: t0 + r() * .05, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: 14 + r() * 16, h: 8 + r() * 10,
        k: kleuren[Math.floor(r() * kleuren.length)], rot: r() * 6.28, om: (r() - .5) * 16, fl: 6 + r() * 10, ff: r() * 6.28, leven: leven * (.7 + r() * .3), rond: r() < .18 });
    }
  }
  // Vonken: korte lichtpuntjes die alle kanten op schieten.
  function vonken({ t0, x, y, n = 24, kleur = '#ffd76a', kracht = 700, seed = 2, leven = .7, grootte = 7 }) {
    const r = rnd(seed);
    for (let i = 0; i < n; i++) { const a = r() * 6.283, v = kracht * (.4 + r() * .6);
      deeltjes.push({ soort: 'v', t0: t0 + r() * .04, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, k: kleur, s: grootte * (.5 + r()), leven: leven * (.6 + r() * .4) }); }
  }
  // Sintels: stijgen langzaam op en doven (voor de vlam).
  function sintels({ t0, t1, x, y, breed = 160, n = 40, seed = 3, kleur = '#ffb020' }) {
    const r = rnd(seed);
    for (let i = 0; i < n; i++) deeltjes.push({ soort: 's', t0: lerp(t0, t1, r()), x: x + (r() - .5) * breed, y, vy: -(160 + r() * 240), zw: 20 + r() * 50, zf: 2 + r() * 3, ff: r() * 6.28, k: kleur, s: 3 + r() * 5, leven: 1.1 + r() * 1.1 });
  }
  function tekenDeeltjes(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 1080, H); ctx.setTransform(S, 0, 0, S, 540 * (1 - S), CY - 540 * S);
    for (const d of deeltjes) {
      const tau = t - d.t0; if (tau < 0 || tau > d.leven) continue; const u = tau / d.leven;
      if (d.soort === 'c') { const kk = 2.2, f = (1 - Math.exp(-kk * tau)) / kk;
        const x = d.x + d.vx * f, y = d.y + d.vy * f + 520 * tau * tau;
        ctx.save(); ctx.translate(x, y); ctx.rotate(d.rot + d.om * tau); ctx.scale(1, Math.cos(d.ff + d.fl * tau));
        ctx.globalAlpha = u > .75 ? (1 - u) / .25 : 1; ctx.fillStyle = d.k;
        if (d.rond) { ctx.beginPath(); ctx.arc(0, 0, d.h * .8, 0, 6.283); ctx.fill(); } else { ctx.beginPath(); ctx.roundRect(-d.w / 2, -d.h / 2, d.w, d.h, 3); ctx.fill(); }
        ctx.restore(); }
      else if (d.soort === 'v') { const kk = 4, f = (1 - Math.exp(-kk * tau)) / kk; const x = d.x + d.vx * f, y = d.y + d.vy * f + 200 * tau * tau;
        ctx.globalAlpha = (1 - u) * (1 - u); ctx.fillStyle = d.k; ctx.beginPath(); ctx.arc(x, y, d.s * (1 - u * .6), 0, 6.283); ctx.fill();
        ctx.globalAlpha = (1 - u) * .25; ctx.beginPath(); ctx.arc(x, y, d.s * 2.6, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
      else { const x = d.x + Math.sin(d.ff + tau * d.zf) * d.zw * u, y = d.y + d.vy * tau;
        ctx.globalAlpha = Math.sin(u * Math.PI) * .9; ctx.fillStyle = d.k; ctx.beginPath(); ctx.arc(x, y, d.s * (1 - u * .5), 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
    }
  }
  // Wat elk frame gelijk is: gloed die zacht beweegt, haak en merk in reel-formaat, flits, schudden.
  function kader(t, { flitsT = [], schud = 0, haakT = .15, merkT = 2.6 } = {}) {
    zet(g1, { transform: `translate(${-240 + Math.sin(t * .6) * 120}px,${PY - 260 + Math.cos(t * .5) * 80}px)` });
    zet(g2, { transform: `translate(${230 + Math.cos(t * .55) * 130}px,${PY + 330 + Math.sin(t * .7) * 90}px)` });
    const fl = Math.max(0, ...flitsT.map(g => t >= g ? 1 - clamp((t - g) / .22) : 0)); zet(flits, { opacity: String(fl * .5) });
    const r = rnd(Math.floor(t * 30) + 1); zet(podium, { transform: schud > 0 ? `translate(${(r() - .5) * schud}px,${(r() - .5) * schud}px)` : 'none' });
    hookW.forEach((el, i) => { const x = p(t, haakT + i * .07, haakT + i * .07 + .4, E.terug); zet(el, { opacity: String(Math.min(1, x * 1.6)), transform: `translateY(${lerp(50, 0, x)}px) scale(${lerp(.85, 1, x)})` }); });
    if (merk) { const m = p(t, merkT, merkT + .5, E.uit); zet(merk, { opacity: String(m), transform: `translateY(${lerp(50, 0, m)}px)` }); }
    tekenDeeltjes(t);
  }
  // Vierpuntige ster (glinstering) als SVG.
  const ster = k => `<svg viewBox="-10 -10 20 20"><path d="M0 -10C1.2 -3 3 -1.2 10 0C3 1.2 1.2 3 0 10C-1.2 3 -3 1.2 -10 0C-3 -1.2 -1.2 -3 0 -10Z" fill="${k || '#ffe9a8'}"/></svg>`;
  window.Moment = { bouw, confetti, vonken, sintels, kader, ster, q, reel, H, PY, niv };
})();
