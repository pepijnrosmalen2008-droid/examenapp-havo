// ═══════════════════════════════════════════════════════════════════════════
// render.mjs · Slagio-huisstijl voor social posts → JPEG via Playwright
//
// Elke slide is gewone HTML/CSS in dezelfde vormtaal als de app: Bricolage
// Grotesque + Inter (lokaal gevendord, dus identieke renders overal), de
// donkere hero met gloed van de home, niveau- en vakkleuren, en Vonk zelf
// (mascotte.js wordt letterlijk ingeladen). Tekst schaalt automatisch mee met
// de lengte (data-fit), zodat lange vragen nooit buiten de slide vallen.
// Instagram accepteert via de API alleen JPEG, dus we schrijven .jpg.
// ═══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './data.mjs';

const FONT_DIR = path.join(ROOT, 'scripts/social/fonts');
const b64 = f => fs.readFileSync(f).toString('base64');
const FONTS_CSS = `
@font-face{font-family:'Bricolage';src:url(data:font/woff2;base64,${b64(path.join(FONT_DIR, 'bricolage.woff2'))}) format('woff2');font-weight:200 800;font-display:block}
@font-face{font-family:'Inter';src:url(data:font/woff2;base64,${b64(path.join(FONT_DIR, 'inter.woff2'))}) format('woff2');font-weight:100 900;font-display:block}`;
const LOGO = `data:image/png;base64,${b64(path.join(ROOT, 'icon-192.png'))}`;
const MASCOT_JS = fs.readFileSync(path.join(ROOT, 'mascotte.js'), 'utf8');

export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const BASE_CSS = `
${FONTS_CSS}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#0b0d14}
:root{--brand:#E85C0D;--ink:#14161f;--bg:#f3f4f8;--card:#fff;--mu:#5d6472;--line:#e3e6ee;--dark:#0b0d14;--ok:#15803d}
.slide{position:relative;overflow:hidden;font-family:'Inter',sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;
  font-feature-settings:"ss01","cv11";display:flex;flex-direction:column}
[data-fit]{min-width:0}
.h{font-family:'Bricolage',sans-serif;font-variation-settings:"opsz" 96;letter-spacing:-.025em;line-height:1.02;text-wrap:balance}
.num{font-variant-numeric:tabular-nums}

/* Donker (hero van de app) */
.dark{background:var(--dark);color:#fff}
.dark .glow{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(70% 55% at 88% -4%,color-mix(in srgb,var(--acc) 38%,transparent),transparent 62%),
             radial-gradient(60% 45% at -10% 108%,color-mix(in srgb,var(--acc) 16%,transparent),transparent 60%)}
.dark .line{position:absolute;left:0;right:0;bottom:0;height:3px;background:linear-gradient(90deg,transparent,var(--acc),transparent);opacity:.55}
.light{background:var(--bg)}

/* Kop + voet, op elke slide gelijk */
.top{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:64px 76px 0}
.brand{display:flex;align-items:center;gap:18px;font-family:'Bricolage',sans-serif;font-weight:800;font-size:40px;letter-spacing:-.02em}
.brand img{width:62px;height:62px;border-radius:16px}
.chip{display:inline-flex;align-items:center;gap:12px;font-weight:700;font-size:27px;letter-spacing:.01em;
  padding:12px 24px;border-radius:99px;background:color-mix(in srgb,var(--niv) 14%,transparent);color:var(--niv);
  border:2px solid color-mix(in srgb,var(--niv) 30%,transparent)}
.dark .chip{background:color-mix(in srgb,var(--niv) 26%,transparent);color:color-mix(in srgb,var(--niv) 30%,#fff);
  border-color:color-mix(in srgb,var(--niv) 55%,transparent)}
.dot{width:12px;height:12px;border-radius:50%;background:currentColor}
.body{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;padding:0 76px;min-height:0}
.foot{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:0 76px 60px;
  font-weight:600;font-size:28px;color:var(--mu)}
.dark .foot{color:rgba(255,255,255,.5)}
.prog{display:flex;gap:10px}
.prog i{display:block;width:34px;height:8px;border-radius:5px;background:color-mix(in srgb,currentColor 28%,transparent)}
.prog i.on{background:var(--acc);width:58px}
.mascot{position:absolute;z-index:1;pointer-events:none}
.mascot svg{width:100%;height:auto;display:block}
.label{font-weight:700;font-size:26px;letter-spacing:.14em;text-transform:uppercase;color:var(--mu)}
.dark .label{color:rgba(255,255,255,.55)}
`;

function shell({ w, h, cls = '', acc, niv, body }) {
  return `<div class="slide ${cls}" style="width:${w}px;height:${h}px;--acc:${acc};--niv:${niv || acc}">${body}</div>`;
}
export const top = chip => `<div class="top"><div class="brand"><img src="${LOGO}" alt="">Slagio</div>${chip || ''}</div>`;
export const chip = (txt, dot = true) => `<span class="chip">${dot ? '<span class="dot"></span>' : ''}${esc(txt)}</span>`;
export const foot = (left, i, n) => `<div class="foot"><span>${left}</span>${n ? `<span class="prog">${Array.from({ length: n }, (_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</span>` : ''}</div>`;
export const mascot = (mood, size, pos) => `<div class="mascot" data-mood="${mood}" data-size="${size}" style="width:${size}px;${pos}"></div>`;

export function slide(opts) {
  return { w: opts.w || 1080, h: opts.h || 1350, html: shell({ w: opts.w || 1080, h: opts.h || 1350, ...opts }), css: opts.css || '' };
}

// Rendert een lijst slides naar JPEG-bestanden. Eén browser voor alles.
export async function renderSlides(browser, slides, outPaths) {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    await page.setViewportSize({ width: s.w, height: s.h });
    await page.setContent(`<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>${BASE_CSS}${s.css}</style></head>
<body>${s.html}<script>${MASCOT_JS}</script><script>
document.querySelectorAll('.mascot').forEach(m=>{m.innerHTML=mascotSVG(m.dataset.mood,+m.dataset.size)});
// Tekst passend maken: verklein tot hij in zijn vak past.
document.fonts.ready.then(()=>{document.querySelectorAll('[data-fit]').forEach(el=>{
  let fs=parseFloat(getComputedStyle(el).fontSize), min=+(el.dataset.fit||24);
  const box=el.parentElement.dataset.fitbox?el.parentElement:el;
  // Tolerantie schaalt met de lettergrootte: bij een regelafstand < 1 steken letters
  // altijd iets buiten hun regel uit, dat is geen echte overloop.
  const over=()=>{const t=fs*0.22;return el.scrollHeight>el.clientHeight+t||el.scrollWidth>el.clientWidth+6||(box!==el&&box.scrollHeight>box.clientHeight+t);};
  while(fs>min&&over()){fs-=2;el.style.fontSize=fs+'px';}
});document.body.dataset.ready=1;});
</script></body></html>`, { waitUntil: 'load' });
    await page.waitForFunction(() => document.body.dataset.ready === '1');
    await page.locator('.slide').screenshot({ path: outPaths[i], type: 'jpeg', quality: 92 });
  }
  await page.close();
}
