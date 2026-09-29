// ═══════════════════════════════════════════════════════════════════════
// social/engine.js - kleine motion-engine voor Instagram-posts van Slagio
// ───────────────────────────────────────────────────────────────────────
// Elke post is een HTML-pagina met één functie render(t) die het hele beeld
// op tijdstip t (seconden) tekent. Geen losse CSS-animaties: alles volgt t,
// dus het beeld is per frame exact reproduceerbaar en render.mjs kan het
// frame voor frame naar MP4 schrijven.
//
//   Motion.maak({ duur: 9, render })   → start preview (of wacht op render.mjs)
//   ?t=3.2 in de url                   → bevroren beeld op 3,2 s (voor een cover)
//   Motion.maak({ ..., geluid: [[t,'naam',vol], ...], klaar: promise })
//     geluid: cues voor geluid.js (render.mjs mixt ze in de MP4)
//     klaar:  extra laadwerk (bv. avatars) waar de render op wacht
//
// Preview: spatie = pauze, ← → = 1 frame, schuifbalk onderin. Geluid speelt
// mee zodra je één keer in de pagina hebt geklikt (regel van de browser).
// ═══════════════════════════════════════════════════════════════════════
(function () {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const E = {
    lin: x => x,
    uit: x => 1 - Math.pow(1 - x, 3),
    uit5: x => 1 - Math.pow(1 - x, 5),
    in: x => x * x * x,
    inUit: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    // lichte overshoot, voor dingen die "ploppen"
    terug: x => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); },
    // gedempte veer: schiet door en komt tot rust
    veer: x => x >= 1 ? 1 : 1 - Math.exp(-6.5 * x) * Math.cos(11 * x),
  };
  // Voortgang van t tussen a en b (0..1), met optionele easing.
  const p = (t, a, b, ease) => (ease || E.lin)(clamp((t - a) / (b - a)));
  const lerp = (a, b, x) => a + (b - a) * x;
  // In- en uitfaden rond een venster: 0 → 1 → 0.
  const venster = (t, a, b, inDur = .3, uitDur = .3) => Math.min(p(t, a, a + inDur, E.uit), 1 - p(t, b - uitDur, b, E.in));
  // Deterministische ruis/willekeur op basis van een zaadje.
  const rnd = seed => { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  // Zet stijlen alleen als ze veranderen (scheelt layoutwerk per frame).
  const zet = (el, st) => { for (const k in st) { const v = st[k]; if (el.style[k] !== v) el.style[k] = v; } };
  const $ = s => document.querySelector(s);

  function maak({ duur, fps = 30, render, geluid, klaar: extra }) {
    const q = new URLSearchParams(location.search);
    window.__DUUR = duur; window.__FPS = fps;
    window.__seek = async t => { await render(t); return true; };
    if (geluid) window.__GELUID = geluid;
    const klaar = Promise.all([document.fonts ? document.fonts.ready : null, extra || null]);
    window.__klaar = klaar.then(() => new Promise(r => requestAnimationFrame(() => r(true))));
    if (q.has('render')) { klaar.then(() => render(0)); return; }
    if (q.has('t')) { klaar.then(() => render(+q.get('t'))); return; }
    // Preview met bediening
    const bar = document.createElement('div');
    bar.className = 'mo-bar';
    bar.innerHTML = '<button>❚❚</button><input type="range" min="0" max="' + duur + '" step="' + (1 / fps) + '" value="0"><span>0.00</span>';
    document.body.appendChild(bar);
    const [knop, schuif, lbl] = bar.children;
    let t = 0, loopt = true, vorige = 0;
    const teken = () => { render(t); schuif.value = t; lbl.textContent = t.toFixed(2); };
    knop.onclick = () => { loopt = !loopt; knop.textContent = loopt ? '❚❚' : '▶'; };
    schuif.oninput = () => { t = +schuif.value; loopt = false; knop.textContent = '▶'; teken(); };
    addEventListener('keydown', e => {
      if (e.key === ' ') { e.preventDefault(); knop.click(); }
      if (e.key === 'ArrowRight') { t = Math.min(duur, t + 1 / fps); loopt = false; teken(); }
      if (e.key === 'ArrowLeft') { t = Math.max(0, t - 1 / fps); loopt = false; teken(); }
    });
    const lus = nu => { const dt = vorige ? (nu - vorige) / 1000 : 0; vorige = nu;
      if (loopt) { const oud = t; t = (t + dt) % duur; if (geluid && window.Geluid && t > oud) for (const c of geluid) if (c[0] > oud && c[0] <= t) window.Geluid.speel(c[1], c[2], c[3]); teken(); }
      requestAnimationFrame(lus); };
    klaar.then(() => requestAnimationFrame(lus));
  }
  // Past het canvas (vaste pixelmaat) in het venster tijdens de preview.
  function schaal() {
    const s = document.querySelector('.mo-canvas'); if (!s || new URLSearchParams(location.search).has('render')) return;
    const w = s.offsetWidth, h = s.offsetHeight; const f = Math.min((innerWidth - 20) / w, (innerHeight - 70) / h, 1);
    s.style.transform = 'scale(' + f + ')'; s.style.transformOrigin = 'top left';
    document.body.style.width = (w * f) + 'px'; document.body.style.height = (h * f) + 'px';
  }
  addEventListener('resize', schaal); addEventListener('load', schaal);
  // Film: een reeks frames uit social/out/opname/<naam>/ als <img>, per tijdstip.
  // Statusbalk van de telefoon-mockup: tijd en iconen, achtergrond = kleur van de bovenrand van het frame,
  // tekst donker of licht naar gelang die kleur. Wordt vanzelf aangemaakt in .scherm.
  const _sbC = document.createElement('canvas'); _sbC.width = 16; _sbC.height = 1; const _sbX = _sbC.getContext('2d', { willReadFrequently: true });
  const _sbKleur = {};   // één kleur per opname (van het eerste frame), anders flikkert de balk mee met wat eronder scrolt
  function statusbalk(img, sleutel) {
    const sch = img.closest('.scherm'); if (!sch || !img.naturalWidth) return;
    let sb = sch.querySelector('.statusbalk');
    if (!sb) { sb = document.createElement('div'); sb.className = 'statusbalk';
      sb.innerHTML = '<span>9:41</span><span class="sb-r"><svg width="34" height="22" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx=".8"/><rect x="4.6" y="5" width="3" height="6" rx=".8"/><rect x="9.2" y="2.6" width="3" height="8.4" rx=".8"/><rect x="13.8" y="0" width="3" height="11" rx=".8"/></svg>'
        + '<svg width="31" height="22" viewBox="0 0 15.5 11"><path d="M7.75 2.2c2.1 0 4 .8 5.5 2.1l1.1-1.1A9.3 9.3 0 0 0 7.75.6 9.3 9.3 0 0 0 1.1 3.2l1.1 1.1a7.8 7.8 0 0 1 5.55-2.1zm0 3.2c1.2 0 2.3.45 3.2 1.2l1.1-1.1a6.1 6.1 0 0 0-8.6 0l1.1 1.1c.9-.75 2-1.2 3.2-1.2zm0 3.2c.4 0 .8.15 1.1.4L7.75 10.2 6.65 9c.3-.25.7-.4 1.1-.4z"/></svg>'
        + '<svg width="54" height="24" viewBox="0 0 27 12"><rect x=".6" y=".6" width="22.8" height="10.8" rx="3.2" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="1.2"/><rect x="2.4" y="2.4" width="19.2" height="7.2" rx="1.8"/><path d="M25 4v4c.8-.3 1.3-1.1 1.3-2S25.8 4.3 25 4z" fill-opacity=".45"/></svg></span>';
      sch.insertBefore(sb, sch.firstChild); }
    if (sleutel && _sbKleur[sleutel]) { sb.style.background = _sbKleur[sleutel][0]; sb.style.color = _sbKleur[sleutel][1]; return; }
    try { _sbX.drawImage(img, 0, 0, img.naturalWidth, 2, 0, 0, 16, 1); const d = _sbX.getImageData(0, 0, 16, 1).data; let r = 0, g = 0, b = 0;
      for (let i = 0; i < 64; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; } r /= 16; g /= 16; b /= 16;
      const k = [`rgb(${r | 0},${g | 0},${b | 0})`, (.2126 * r + .7152 * g + .0722 * b) > 150 ? '#000' : '#fff']; if (sleutel) _sbKleur[sleutel] = k; sb.style.background = k[0]; sb.style.color = k[1]; } catch (e) {}
  }
  // film.op(t) zet het juiste frame en geeft een promise die klaar is als het geladen is.
  function film(img, naam, meta) {
    const n = meta.frames, fps = meta.fps; let huidig = -1; const cache = new Map();
    const src = i => `../out/opname/${naam}/f${String(i).padStart(4, '0')}.jpg`;
    return {
      duur: n / fps, meta,
      op(t) { const i = Math.max(1, Math.min(n, Math.floor(t * fps) + 1)); if (i === huidig) return Promise.resolve();
        huidig = i; img.src = src(i); for (let k = 1; k <= 3; k++) if (i + k <= n && !cache.has(i + k)) { const im = new Image(); im.src = src(i + k); cache.set(i + k, im); }
        return (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(() => statusbalk(img, naam)); },
    };
  }
  const laadFilm = async (img, naam) => film(img, naam, await (await fetch(`../out/opname/${naam}/meta.json`)).json());
  window.Motion = { maak, E, p, lerp, clamp, venster, rnd, zet, $, laadFilm, statusbalk };
})();
