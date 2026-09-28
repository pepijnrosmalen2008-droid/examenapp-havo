// Rendert een Instagram-post (social/posts/<naam>.html) frame voor frame naar MP4.
//   node social/render.mjs aftellen                 → social/out/aftellen.mp4 + cover.png
//   node social/render.mjs quiz "?vraag=econ-maxprijs"
// Vereist: Playwright (Chromium) en ffmpeg (FFMPEG=/pad/naar/ffmpeg als het niet op PATH staat).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [naam = 'aftellen', query = '', uitNaam] = process.argv.slice(2);
const UIT = path.join(ROOT, 'social', 'out'); fs.mkdirSync(UIT, { recursive: true });
const doelNaam = uitNaam || naam + (query ? '-' + query.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') : '');

let pw; try { pw = await import('playwright'); } catch { pw = await import('/opt/node22/lib/node_modules/playwright/index.mjs'); }
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

// Eenvoudige statische server op de repo-root.
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
}).listen(0);
const poort = server.address().port;

const browser = await pw.chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage();
const url = `http://127.0.0.1:${poort}/social/posts/${naam}.html${query ? (query.startsWith('?') ? query + '&' : '?' + query + '&') : '?'}render=1`;
await page.goto(url, { waitUntil: 'load' });
const { w, h, duur, fps } = await page.evaluate(async () => { await window.__klaar; const c = document.querySelector('.mo-canvas'); return { w: c.offsetWidth, h: c.offsetHeight, duur: window.__DUUR, fps: window.__FPS }; });
await page.setViewportSize({ width: w, height: h });
const frames = Math.round(duur * fps);
console.log(`${naam}: ${w}×${h}, ${duur}s @ ${fps}fps = ${frames} frames`);

const mp4 = path.join(UIT, doelNaam + '.mp4');
const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'slow', '-profile:v', 'high', '-movflags', '+faststart', mp4], { stdio: ['pipe', 'inherit', 'inherit'] });
const el = await page.$('.mo-canvas');
for (let i = 0; i < frames; i++) {
  await page.evaluate(t => window.__seek(t), i / fps);
  const buf = await el.screenshot({ type: 'png' });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % fps === 0) process.stdout.write(`\r  ${Math.round(i / frames * 100)}%`);
}
ff.stdin.end();
await new Promise((r, j) => ff.on('close', c => c === 0 ? r() : j(new Error('ffmpeg ' + c))));
// Cover: het frame dat de post het best samenvat (window.__COVER of 75% van de duur).
const coverT = await page.evaluate(d => window.__COVER ?? d * .75, duur);
await page.evaluate(t => window.__seek(t), coverT);
await el.screenshot({ path: path.join(UIT, doelNaam + '-cover.png') });
console.log(`\r  klaar → social/out/${doelNaam}.mp4`);
await browser.close(); server.close();
