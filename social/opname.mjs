// Neemt de échte app op, frame voor frame, voor gebruik in een post.
//   node social/opname.mjs <scenario>        → social/out/opname/<scenario>/f0001.jpg … + meta.json
// Scenario's staan in social/opnames/<naam>.mjs en exporteren:
//   { duur, voorbereiding(page, h), stappen: [[tijd, async (page, h) => …], …] }
// Hoe het werkt: Playwright's klok bestuurt Date/timers/requestAnimationFrame
// (dus ook three.js), en CSS-animaties/transities zetten we per frame zelf door
// (Web Animations API). Zo loopt alles synchroon, hoe traag de machine ook is.
// Tikken krijgen een zichtbare vinger-cirkel; hun positie komt in meta.json.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const naam = process.argv[2];
if (!naam) { console.log('gebruik: node social/opname.mjs <scenario>'); process.exit(1); }
const S = (await import(path.join(ROOT, 'social', 'opnames', naam + '.mjs'))).default;
const FPS = S.fps || 30, W = S.breedte || 390, H = S.hoogte || 844, DPR = S.dpr || 2;
const UIT = path.join(ROOT, 'social', 'out', 'opname', naam); fs.mkdirSync(UIT, { recursive: true });
for (const f of fs.readdirSync(UIT)) fs.unlinkSync(path.join(UIT, f));

let pw; try { pw = await import('playwright'); } catch { pw = await import('/opt/node22/lib/node_modules/playwright/index.mjs'); }
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.glb': 'model/gltf-binary', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  let p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (p.endsWith('/')) p += 'index.html';
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(ROOT, 'index.html');   // SPA-routes
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
}).listen(0);
const BASIS = `http://127.0.0.1:${server.address().port}`;

const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'], ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}) });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR, isMobile: true, hasTouch: true, colorScheme: S.donker ? 'dark' : 'light' });
const page = await ctx.newPage();
page.on('pageerror', e => console.log('  paginafout:', e.message.slice(0, 160)));
// Lettertypes lokaal (geen netwerk nodig) en externe diensten stil.
const fontCss = `@font-face{font-family:'Inter';src:url(${BASIS}/social/fonts/inter.woff2) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'Bricolage Grotesque';src:url(${BASIS}/social/fonts/bricolage.woff2) format('woff2');font-weight:200 800;font-display:block}`;
await page.route('https://fonts.googleapis.com/**', r => r.fulfill({ contentType: 'text/css', body: fontCss }));
await page.route(/supabase|googletagmanager|google-analytics|plausible|jsdelivr/, r => r.abort());
await page.addInitScript(({ opslag }) => {
  try { for (const [k, v] of Object.entries(opslag)) localStorage.setItem(k, v); } catch (e) {}
  try { sessionStorage.setItem('dc_dismissed', '1'); } catch (e) {}
  // Vinger-cirkel bij een tik (loopt op de nep-klok via CSS-animatie die we zelf stappen).
  window.__tik = (x, y) => {
    const d = document.createElement('div');
    d.style.cssText = `position:fixed;left:${x - 28}px;top:${y - 28}px;width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.55);border:3px solid rgba(255,255,255,.95);box-shadow:0 4px 18px rgba(0,0,0,.25);z-index:2147483647;pointer-events:none`;
    document.documentElement.appendChild(d);
    d.animate([{ transform: 'scale(.6)', opacity: 0 }, { transform: 'scale(1)', opacity: 1, offset: .25 }, { transform: 'scale(1.35)', opacity: 0 }], { duration: 520, easing: 'ease-out', fill: 'forwards' }).onfinish = () => d.remove();
  };
}, { opslag: S.opslag || {} });
await page.clock.install({ time: new Date(S.datum || '2026-10-06T16:30:00+02:00') });
const cdp = await ctx.newCDPSession(page);
await cdp.send('Animation.enable'); await cdp.send('Animation.setPlaybackRate', { playbackRate: 0 });

// Eén frame vooruit: JS-klok + alle CSS/Web-animaties.
const dt = 1000 / FPS;
const PROF = { klok: 0, anim: 0, foto: 0 };
async function stap(ms = dt) {
  let t0 = Date.now();
  await page.clock.runFor(ms);
  PROF.klok += Date.now() - t0; t0 = Date.now();
  await page.evaluate(ms => {
    for (const a of document.getAnimations()) {
      if (a.playState === 'finished' || a.playState === 'idle') continue;
      if (a.__vt == null) { a.__vt = a.currentTime || 0; a.pause(); }
      a.__vt += ms;
      const end = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming().endTime : Infinity;
      if (isFinite(end) && a.__vt >= end) { try { a.currentTime = end; a.play(); a.finish(); } catch (e) {} }
      else a.currentTime = a.__vt;
    }
  }, ms);
  PROF.anim += Date.now() - t0;
}
const tikken = [];
const h = {
  BASIS, stap,
  wacht: async ms => { for (let t = 0; t < ms; t += dt) await stap(); },
  // Tik op een element (of x,y): vinger-cirkel + echte klik.
  tik: async (doel, dy = 0) => {
    let x, y;
    if (typeof doel === 'string') {
      // Zelf zoeken in de pagina (Playwright-locators wachten op requestAnimationFrame, en die staat stil).
      // 'selector@n' = het n-de element (vanaf 0); 'a >> b' = b binnen a.
      const b = await page.evaluate(sel => { let [css, n] = sel.split('@'); const delen = css.split('>>').map(x => x.trim());
        let els = [...document.querySelectorAll(delen[0])];
        for (const d of delen.slice(1)) els = els.flatMap(e => [...e.querySelectorAll(d)]);
        els = els.filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height; });
        const e = els[+(n || 0)]; if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }, doel);
      if (!b) { console.log('  niet gevonden:', doel); return; } x = b.x + b.width / 2; y = b.y + b.height / 2 + dy; }
    else [x, y] = doel;
    tikken.push({ t: h.t, x, y });
    await page.evaluate(([x, y]) => window.__tik(x, y), [x, y]);
    await page.mouse.click(x, y);
  },
  scroll: async (sel, dy, ms = 600) => { // vloeiend scrollen over ms
    const n = Math.round(ms / dt); for (let i = 1; i <= n; i++) { const e = .5 - Math.cos(Math.PI * i / n) / 2, e0 = .5 - Math.cos(Math.PI * (i - 1) / n) / 2;
      await page.evaluate(([sel, d]) => { const el = sel ? document.querySelector(sel) : document.scrollingElement; el.scrollBy(0, d); }, [sel, dy * (e - e0)]); await stap(); h.t += dt / 1000; await frame(); }
  },
  t: 0,
  // Wacht (in klokstappen) tot een voorwaarde in de pagina waar is, bv. tot een 3D-scène geladen is.
  tot: async (cond, maxS = 60) => { const eind = Date.now() + maxS * 1000;
    while (Date.now() < eind) { if (await page.evaluate(cond).catch(() => false)) return true; await stap(); await new Promise(r => setTimeout(r, 30)); }
    console.log('  wachten verlopen:', String(cond).slice(0, 80)); return false; },
};
let nr = 0;
async function frame() { nr++; const t0 = Date.now(); const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 90 }); fs.writeFileSync(path.join(UIT, 'f' + String(nr).padStart(4, '0') + '.jpg'), Buffer.from(data, 'base64')); PROF.foto += Date.now() - t0; if (process.env.PROF && nr % 10 === 0) console.log(' frame', nr, JSON.stringify(PROF)); }

await page.goto(BASIS + (S.pad || '/index.html'));
// requestAnimationFrame op 30 per seconde (de nep-klok draait hem op 60): één render per opgenomen frame.
await page.evaluate(fps => { const origC = window.cancelAnimationFrame.bind(window), mijn = new Set();
  window.requestAnimationFrame = cb => { const id = setTimeout(() => { mijn.delete(id); cb(performance.now()); }, 1000 / fps); mijn.add(id); return id; };
  window.cancelAnimationFrame = id => { if (mijn.has(id)) { mijn.delete(id); clearTimeout(id); } else { try { origC(id); } catch (e) {} } }; }, FPS);
await h.wacht(S.opstart || 2500);
if (S.voorbereiding) await S.voorbereiding(page, h);
const totaal = Math.round(S.duur * FPS);
const stappen = (S.stappen || []).slice().sort((a, b) => a[0] - b[0]);
console.log(`opname ${naam}: ${S.duur}s, ${totaal} frames (${W}×${H} @${DPR}x)`);
while (nr < totaal) {
  h.t = nr / FPS;
  while (stappen.length && stappen[0][0] <= h.t + 1e-6) { const [, f] = stappen.shift(); await f(page, h); }
  if (nr >= totaal) break;
  await stap(); await frame();
  if (nr % FPS === 0) process.stdout.write(`\r  ${Math.round(nr / totaal * 100)}%`);
}
fs.writeFileSync(path.join(UIT, 'meta.json'), JSON.stringify({ fps: FPS, frames: nr, breedte: W * DPR, hoogte: H * DPR, tikken }, null, 1));
console.log(`\r  klaar → social/out/opname/${naam}/ (${nr} frames)`);
await browser.close(); server.close();
