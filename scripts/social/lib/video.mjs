// ═══════════════════════════════════════════════════════════════════════════
// video.mjs · faceless Reel/TikTok uit de échte app
//
// Een robot opent Slagio op een virtuele telefoon (1080×1920), start een quiz
// bij een vak en beantwoordt vragen goed, terwijl we het scherm scherp opnemen
// via de Chrome-screencast (op volle apparaatresolutie, niet opgeschaald).
// Ervoor een hook-kaart, erna een afsluitkaart in huisstijl; ffmpeg plakt het
// samen tot een H.264-MP4 die Instagram en TikTok accepteren.
// ═══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { ROOT } from './data.mjs';
import { renderSlides } from './render.mjs';

export function ffmpegPath() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); return 'ffmpeg'; } catch (e) {}
  try { return execFileSync('python3', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())'], { encoding: 'utf8' }).trim(); } catch (e) {}
  throw new Error('ffmpeg niet gevonden (installeer ffmpeg of: pip install imageio-ffmpeg)');
}

// Minimale statische server voor de app (geen python nodig).
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };
export function startServer() {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      // SPA-routes (/havo, /vwo …) vallen terug op index.html
      const idx = path.join(ROOT, 'index.html');
      res.writeHead(200, { 'Content-Type': 'text/html' }); return fs.createReadStream(idx).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r({ server, url: `http://127.0.0.1:${server.address().port}` })));
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * Neemt een quiz-sessie op en schrijft een MP4.
 * @param browser  Playwright-browser
 * @param o { niveau, vakId, domId, hook, introSlide, outroSlide, out, vragen=4 }
 */
export async function maakReel(browser, o) {
  const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'slagio-reel-'));
  const { server, url } = await startServer();
  const ctx = await browser.newContext({
    viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true,
    colorScheme: 'dark', locale: 'nl-NL', serviceWorkers: 'block',
  });
  await ctx.addInitScript(({ niveau }) => {
    try {
      localStorage.setItem('examenapp_level', niveau);
      localStorage.setItem('slagio_seen_intro_v2', '1');
      localStorage.setItem('slagio_onboard_v3', '1');
      localStorage.setItem('slagio_vonk_intro_done', '1');
      localStorage.setItem('slagio_notif_shown', '1');
      localStorage.setItem('slagio_perf_mode', 'full');
      localStorage.setItem('theme', 'dark');
    } catch (e) {}
  }, { niveau: o.niveau });
  const page = await ctx.newPage();
  try {
    await page.goto(url + '/', { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: `#pwa-banner,#sw-update-banner,.vonk-corner,#offline-banner,.toast,.pwa-banner{display:none!important}
      .rec-hook{position:fixed;left:14px;right:14px;top:calc(env(safe-area-inset-top,0px) + 12px);z-index:99999;pointer-events:none;
        font:800 21px/1.18 'Bricolage Grotesque',sans-serif;letter-spacing:-.01em;color:#fff;text-align:center;text-wrap:balance;
        background:rgba(11,13,20,.86);border:1.5px solid rgba(232,92,13,.55);border-radius:16px;padding:12px 16px;
        box-shadow:0 10px 30px rgba(0,0,0,.4)}` });
    await page.evaluate(async ({ niveau, vakId, domId }) => {
      await new Promise(r => ensureLevelData(niveau, r));
      await new Promise(r => (typeof ensureVakData === 'function' ? ensureVakData(niveau, vakId, r) : r()));
      openVak(vakId, true);
    }, o);
    await sleep(700);
    await page.evaluate(({ domId }) => { openQmode(domId); }, o);
    await sleep(500);
    await page.evaluate(() => startQ('snel'));
    await sleep(500);
    // Zelf gekozen, sterke vragen tonen i.p.v. de willekeurige selectie van de app.
    if (o.vragenLijst && o.vragenLijst.length) {
      await page.evaluate(lijst => {
        ST.vragen = lijst;
        ST.shuffleMaps = lijst.map(() => { const a = [0, 1, 2, 3]; for (let i = 3; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; });
        ST.idx = 0; ST.antwrd = []; ST.score = 0;
        toonV();
      }, o.vragenLijst);
    }
    await sleep(700);
    await page.evaluate(hook => {
      const d = document.createElement('div'); d.className = 'rec-hook'; d.textContent = hook; document.body.appendChild(d);
    }, o.hook);

    // Screencast op volle resolutie
    const cdp = await ctx.newCDPSession(page);
    const frames = [];
    cdp.on('Page.screencastFrame', async f => {
      frames.push({ t: f.metadata.timestamp, data: f.data });
      try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {}
    });
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
    await sleep(1400);                                   // even de vraag laten lezen
    for (let i = 0; i < (o.vragen || 4); i++) {
      const ok = await page.evaluate(() => {
        const b = [...document.querySelectorAll('#snel-area .opt')];
        const goed = b.find(x => x.dataset.pos === x.dataset.correct);
        if (!goed) return false;
        goed.click(); return true;
      });
      if (!ok) break;
      await sleep(1900);                                 // feedback + uitleg in beeld
      await page.evaluate(() => { try { nextQ(); } catch (e) {} });
      await sleep(1300);
    }
    await cdp.send('Page.stopScreencast');
    if (frames.length < 10) throw new Error(`te weinig frames opgenomen (${frames.length})`);

    // Drie segmenten: hook-kaart, opname (frames met hun echte duur), afsluitkaart.
    // Apart ingelezen en via het concat-filter samengevoegd; dat is robuuster dan
    // stilstaande beelden en screencast-frames in één concat-lijst te mengen.
    const intro = path.join(tmp, 'intro.jpg'), outro = path.join(tmp, 'outro.jpg');
    await renderSlides(browser, [o.introSlide, o.outroSlide], [intro, outro]);
    const lines = [];
    frames.forEach((f, i) => {
      const file = path.join(tmp, `f${String(i).padStart(5, '0')}.jpg`);
      fs.writeFileSync(file, Buffer.from(f.data, 'base64'));
      const dur = i < frames.length - 1 ? Math.max(0.001, frames[i + 1].t - f.t) : 0.1;
      lines.push(`file '${file}'`, `duration ${dur.toFixed(4)}`);
    });
    lines.push(lines[lines.length - 2]);                  // laatste frame herhalen (concat-eigenaardigheid)
    const list = path.join(tmp, 'list.txt');
    fs.writeFileSync(list, lines.join('\n'));
    const norm = 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0b0d14,setsar=1,fps=30,format=yuv420p';
    execFileSync(ffmpegPath(), ['-loglevel', 'error', '-y',
      '-loop', '1', '-t', '2.2', '-i', intro,
      '-f', 'concat', '-safe', '0', '-i', list,
      '-loop', '1', '-t', '2.6', '-i', outro,
      '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
      '-filter_complex', `[0:v]${norm}[a];[1:v]${norm}[b];[2:v]${norm}[c];[a][b][c]concat=n=3:v=1:a=0[v]`,
      '-map', '[v]', '-map', '3:a',
      '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium', '-crf', '20', '-c:a', 'aac', '-b:a', '128k',
      '-shortest', '-movflags', '+faststart', o.out]);
    // Thumbnail (cover) = de hook-kaart
    fs.copyFileSync(intro, o.out.replace(/\.mp4$/, '-cover.jpg'));
    return { frames: frames.length };
  } finally {
    await ctx.close();
    server.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}
