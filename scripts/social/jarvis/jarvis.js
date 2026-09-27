/* ═══════════════════════════════════════════════════════════════════════
   Jarvis · client
   Rendert de briefing uit de ingebedde data, tekent de neurale kern en de
   grafieken, en laat je vragen stellen via de sample-capability (Claude op
   het account van de kijker). Alles werkt ook zonder die capability.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const D = JSON.parse(document.getElementById('jarvis-data').textContent);
  const S = D.stats, APP = S.app || {}, A = D.analyse || {}, G = D.geheugen || { voorspellingen: [], experimenten: [] };
  const deze = APP.deze || {}, vorige = APP.vorige || {};
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const nf = n => n == null ? '–' : Number(n).toLocaleString('nl-NL');
  const MND = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  const DAG = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
  const kort = d => { const x = new Date(d + 'T12:00:00Z'); return `${x.getUTCDate()} ${MND[x.getUTCMonth()]}`; };
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)');
  const store = { get(k) { try { return JSON.parse(localStorage.getItem('jarvis:' + k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('jarvis:' + k, JSON.stringify(v)); } catch (e) {} } };

  function niceScale(max, ticks = 4) {
    if (max <= 0) return { top: 4, step: 1 };
    const raw = max / ticks, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw) || 10 * mag;
    return { top: Math.ceil(max / step) * step, step };
  }
  const pctDelta = (a, b) => (a == null || !b ? null : Math.round((a - b) / b * 100));
  function deltaHtml(a, b, meerIsBeter = true) {
    const p = pctDelta(a, b); if (p == null) return '';
    if (p === 0) return '<span class="delta flat">gelijk</span>';
    const goed = (p > 0) === meerIsBeter;
    return `<span class="delta ${goed ? 'up' : 'down'}">${p > 0 ? '▲' : '▼'} ${Math.abs(p)}%</span>`;
  }

  // ── Kop + hero ────────────────────────────────────────────────────────
  $('#periode').textContent = `${kort(S.periode.van)} – ${kort(S.periode.tot)} · volgende briefing ${A.volgende || ''}`;
  $('#groet').textContent = A.groet || 'Goedemorgen.';
  $('#kop').innerHTML = md(A.kop || '').replace(/\*(.+?)\*/g, '<em>$1</em>');
  $('#briefing').innerHTML = (A.briefing || []).map(p => `<p>${md(p)}</p>`).join('');
  const LAMP = { ok: 'ok', 'let-op': 'warn', actie: 'bad', wacht: 'idle' };
  const SYS = { groei: 'Groei', app: 'App', content: 'Content', seo: 'Vindbaarheid' };
  const statusEntries = Object.entries(A.status || {});
  $('#statuses').innerHTML = statusEntries.map(([k, [st, t]]) =>
    `<div class="st"><span class="dot ${LAMP[st] || 'idle'}"></span><div><b>${esc(SYS[k] || k)}</b><span>${md(t)}</span></div></div>`).join('');
  const nOk = statusEntries.filter(([, [st]]) => st === 'ok').length;
  $('#health').innerHTML = `<b class="num">${nOk}/${statusEntries.length}</b>systemen in orde`;

  // ── Kerncijfers ───────────────────────────────────────────────────────
  const dag = APP.dagelijks || [];
  function spark(vals, color) {
    if (!vals.length) return '';
    const w = 130, h = 38, max = Math.max(1, ...vals);
    const pts = vals.map((v, i) => [i / (vals.length - 1) * w, h - 4 - v / max * (h - 8)]);
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
    const [lx, ly] = pts[pts.length - 1];
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}L${w},${h}L0,${h}Z" fill="${color}" fill-opacity=".14"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/><circle cx="${lx}" cy="${ly}" r="3" fill="${color}"/></svg>`;
  }
  const last28 = dag.slice(-28);
  const kpis = [
    { l: 'Betrokken leerlingen', v: deze.betrokken, d: deltaHtml(deze.betrokken, vorige.betrokken), s: spark(last28.map(x => x.betrokken), 'var(--accent)'), u: 'deden deze week iets echts' },
    { l: 'Bezoekers', v: deze.actief, d: deltaHtml(deze.actief, vorige.actief), s: spark(last28.map(x => x.actief), 'var(--label3)'), u: 'unieke apparaten, incl. bots' },
    { l: 'Nieuwe apparaten', v: deze.nieuw, d: deltaHtml(deze.nieuw, vorige.nieuw), s: spark(last28.map(x => x.nieuw), 'var(--blue)'), u: 'voor het eerst gezien' },
    { l: 'Terugkeer', v: APP.terugkeerBetrokken != null ? APP.terugkeerBetrokken + '%' : '–', d: '', s: '', u: 'van vorige week kwam terug' },
    { l: 'Oefensessies', v: deze.oefensessies, d: deltaHtml(deze.oefensessies, vorige.oefensessies), s: spark(last28.map(x => x.oefensessies), 'var(--green)'), u: 'quiz, flashcards, examens' },
    { l: 'App-fouten', v: deze.fouten, d: deltaHtml(deze.fouten, vorige.fouten, false), s: '', u: 'JavaScript-fouten bij gebruikers' },
  ];
  $('#kpis').innerHTML = kpis.map(k => `<div class="kpi"><div class="kl">${esc(k.l)}</div><div class="row"><div class="kv num">${typeof k.v === 'number' ? nf(k.v) : esc(k.v ?? '–')}</div>${k.s}</div><div class="ku">${k.d}<span>${esc(k.u)}</span></div></div>`).join('');

  // ── Denkwerk ──────────────────────────────────────────────────────────
  const ICON = { goed: '↑', 'let-op': '!', actie: '→' };
  $('#denk').innerHTML = (A.denkwerk || []).map(t => `<div class="thought"><h3>${esc(t.titel)}${t.kans ? `<span class="kans">${esc(t.kans)}</span>` : ''}</h3><p>${md(t.tekst)}</p></div>`).join('')
    || '<p class="chart-sum">Nog geen hypotheses deze week.</p>';
  $('#signals').innerHTML = (APP.signalen || []).map(s => `<div class="sig s-${esc(s.soort)}"><span class="ic" aria-hidden="true">${ICON[s.soort] || '·'}</span><div><h3>${esc(s.titel)}</h3><p>${esc(s.bewijs)}</p></div><span class="conf">zekerheid<br>${esc(s.zekerheid)}</span></div>`).join('');

  // ── Hoofdgrafiek (groei) ──────────────────────────────────────────────
  const SERIES = [
    { key: 'betrokken', label: 'Betrokken', color: 'var(--accent)', area: true },
    { key: 'actief', label: 'Bezoekers', color: 'var(--label3)' },
    { key: 'nieuw', label: 'Nieuw', color: 'var(--blue)' },
  ];
  const chartState = store.get('chart') || { bereik: 28, aan: { betrokken: true, actief: true, nieuw: false } };
  function lineChart(host, rows, series, opts = {}) {
    const W = Math.max(300, Math.round(host.clientWidth || 1000)), H = opts.h || Math.round(Math.min(320, Math.max(220, W * .3))), L = 40, R = 14, T = 22, B = 30;
    const vis = series.filter(s => s.on);
    const max = Math.max(1, ...rows.flatMap(r => vis.map(s => r[s.key] || 0)));
    const { top, step } = niceScale(max);
    const x = i => L + (rows.length === 1 ? 0 : i / (rows.length - 1) * (W - L - R));
    const y = v => T + (H - T - B) * (1 - v / top);
    let g = '';
    for (let v = 0; v <= top + 1e-9; v += step) g += `<line class="gl" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${nf(Math.round(v))}</text>`;
    const every = Math.max(1, Math.ceil(rows.length / Math.max(3, Math.floor(W / 115))));
    rows.forEach((r, i) => { if ((rows.length - 1 - i) % every === 0) { const d = new Date(r.datum + 'T12:00:00Z'); const anc = i === rows.length - 1 ? 'end' : i === 0 ? 'start' : 'middle'; g += `<text class="ax" x="${x(i)}" y="${H - 8}" text-anchor="${anc}">${DAG[d.getUTCDay()]} ${kort(r.datum)}</text>`; } });
    for (const s of [...vis].reverse()) {
      const d = rows.map((r, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(r[s.key] || 0).toFixed(1)}`).join('');
      if (s.area) g += `<path d="${d}L${x(rows.length - 1)},${y(0)}L${x(0)},${y(0)}Z" fill="${s.color}" fill-opacity=".12"/>`;
      g += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.area ? 2.6 : 1.8}" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;
    }
    // Afwijkingen annoteren (alleen zichtbare reeksen)
    const idx = Object.fromEntries(rows.map((r, i) => [r.datum, i]));
    const perDag = {};
    (opts.ann || []).filter(a => a.datum in idx && vis.some(s => s.key === a.veld)).forEach(a => { if (!perDag[a.datum] || a.sterkte > perDag[a.datum].sterkte) perDag[a.datum] = a; });
    // Opeenvolgende dagen met dezelfde richting zijn één gebeurtenis: toon alleen de sterkste.
    const ann = [];
    Object.values(perDag).sort((a, b) => idx[a.datum] - idx[b.datum]).forEach(a => {
      const v = ann[ann.length - 1];
      if (v && idx[a.datum] - v.tot <= 1 && v.a.richting === a.richting) { v.tot = idx[a.datum]; if (a.sterkte > v.a.sterkte) v.a = a; }
      else ann.push({ a, tot: idx[a.datum] });
    });
    g += '<g class="ann">' + ann.map(v => v.a).map(a => { const i = idx[a.datum]; const s = vis.find(v => v.key === a.veld);
      return `<circle cx="${x(i)}" cy="${y(a.waarde)}" r="5" fill="${s.color}" stroke="var(--mat)" stroke-width="2"/><text x="${x(i)}" y="${Math.max(12, y(a.waarde) - 10)}" text-anchor="middle">${a.richting === 'piek' ? 'Piek' : 'Dal'}</text>`; }).join('') + '</g>';
    g += `<line id="cx" x1="0" x2="0" y1="${T}" y2="${H - B}" stroke="var(--label3)" stroke-width="1" opacity="0"/><g id="cdots"></g>`;
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" tabindex="0" aria-label="${esc(opts.label || '')}">${g}<rect x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}" fill="transparent"/></svg><div class="tip" role="status"></div>`;
    const svg = host.querySelector('svg'), tip = host.querySelector('.tip'), cxl = svg.querySelector('#cx'), dots = svg.querySelector('#cdots');
    let cur = rows.length - 1;
    function show(i) {
      cur = Math.max(0, Math.min(rows.length - 1, i)); const r = rows[cur];
      cxl.setAttribute('x1', x(cur)); cxl.setAttribute('x2', x(cur)); cxl.setAttribute('opacity', '.6');
      dots.innerHTML = vis.map(s => `<circle cx="${x(cur)}" cy="${y(r[s.key] || 0)}" r="4.5" fill="${s.color}" stroke="var(--mat)" stroke-width="2"/>`).join('');
      const d = new Date(r.datum + 'T12:00:00Z');
      tip.innerHTML = `<b>${DAG[d.getUTCDay()]} ${kort(r.datum)}</b>` + vis.map(s => `<div><span><i style="background:${s.color}"></i>${s.label}</span><span class="num">${nf(r[s.key])}</span></div>`).join('');
      const bw = host.clientWidth, px = x(cur) / W * bw;
      tip.style.left = Math.min(bw - tip.offsetWidth - 4, Math.max(4, px + 12 - (px > bw * .6 ? tip.offsetWidth + 24 : 0))) + 'px';
      tip.style.top = '8px'; tip.style.opacity = 1;
    }
    function hide() { cxl.setAttribute('opacity', 0); dots.innerHTML = ''; tip.style.opacity = 0; }
    svg.addEventListener('pointermove', e => { const b = svg.getBoundingClientRect(); const vx = (e.clientX - b.left) / b.width * W; show(Math.round((vx - L) / (W - L - R) * (rows.length - 1))); });
    svg.addEventListener('pointerleave', hide);
    svg.addEventListener('focus', () => show(cur)); svg.addEventListener('blur', hide);
    svg.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { show(cur - 1); e.preventDefault(); } if (e.key === 'ArrowRight') { show(cur + 1); e.preventDefault(); } });
  }
  function renderGroei() {
    const rows = dag.slice(-chartState.bereik);
    const series = SERIES.map(s => ({ ...s, on: !!chartState.aan[s.key] }));
    const half = Math.floor(rows.length / 2), gem = a => a.length ? a.reduce((x, r) => x + r.betrokken, 0) / a.length : 0;
    const nu = gem(rows.slice(half)), toen = gem(rows.slice(0, half)), p = pctDelta(nu, toen);
    const sum = `Gemiddeld ${nu.toFixed(1).replace('.', ',')} betrokken leerlingen per dag in de laatste ${rows.length - half} dagen${p != null ? `, ${p >= 0 ? `${p}% meer` : `${-p}% minder`} dan de ${half} dagen ervoor` : ''}.`;
    $('#groei-sum').textContent = sum;
    $('#groei-seg').innerHTML = [14, 28, 60].map(n => `<button type="button" aria-pressed="${chartState.bereik === n}" data-n="${n}">${n} d</button>`).join('');
    $('#groei-keys').innerHTML = SERIES.map(s => `<button type="button" class="key" aria-pressed="${!!chartState.aan[s.key]}" data-k="${s.key}"><i style="background:${s.color}"></i>${s.label}</button>`).join('');
    lineChart($('#groei-plot'), rows, series, { ann: APP.afwijkingen, label: sum });
    store.set('chart', chartState);
  }
  $('#groei-seg').addEventListener('click', e => { const n = +e.target.closest('button')?.dataset.n; if (n) { chartState.bereik = n; renderGroei(); } });
  $('#groei-keys').addEventListener('click', e => { const k = e.target.closest('button')?.dataset.k; if (k) { chartState.aan[k] = !chartState.aan[k]; if (!Object.values(chartState.aan).some(Boolean)) chartState.aan[k] = true; renderGroei(); } });
  renderGroei();

  // Prognose: weekstaven + 4 weken vooruit met onzekerheid
  function renderProg() {
    const p = APP.prognose, host = $('#prog-plot');
    if (!p) { host.innerHTML = '<p class="chart-sum">Nog te weinig weken voor een prognose.</p>'; return; }
    const hist = p.historie, fut = [1, 2, 3, 4].map(k => Math.max(0, Math.round(hist[hist.length - 1] + p.helling * k)));
    fut[0] = p.volgendeWeek.verwacht;
    const all = [...hist, ...fut], W = Math.max(300, Math.round(host.clientWidth || 600)), H = 230, L = 36, R = 10, T = 16, B = 28;
    const { top, step } = niceScale(Math.max(p.volgendeWeek.hoog, ...all));
    const bw = (W - L - R) / all.length, y = v => T + (H - T - B) * (1 - v / top);
    let g = '';
    for (let v = 0; v <= top + 1e-9; v += step) g += `<line class="gl" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
    all.forEach((v, i) => {
      const x = L + i * bw + bw * .18, w = bw * .64, isF = i >= hist.length;
      g += `<rect x="${x}" y="${y(v)}" width="${w}" height="${y(0) - y(v)}" rx="6" fill="${isF ? 'var(--accent)' : 'var(--bar-muted)'}" fill-opacity="${isF ? .28 : 1}" ${isF ? 'stroke="var(--accent)" stroke-dasharray="4 4" stroke-width="1.5"' : ''}><title>${isF ? 'Verwacht' : 'Gemeten'}: ${v}</title></rect>`;
      g += `<text class="ax" x="${x + w / 2}" y="${H - 8}" text-anchor="middle">${isF ? `+${i - hist.length + 1}${W > 560 ? ' wk' : ''}` : i === hist.length - 1 ? (W > 560 ? 'deze wk' : 'nu') : `-${hist.length - 1 - i}`}</text>`;
      if (i === hist.length) g += `<line x1="${x + w / 2}" x2="${x + w / 2}" y1="${y(p.volgendeWeek.hoog)}" y2="${y(p.volgendeWeek.laag)}" stroke="var(--accent)" stroke-width="2"/><line x1="${x + w / 2 - 8}" x2="${x + w / 2 + 8}" y1="${y(p.volgendeWeek.hoog)}" y2="${y(p.volgendeWeek.hoog)}" stroke="var(--accent)" stroke-width="2"/><line x1="${x + w / 2 - 8}" x2="${x + w / 2 + 8}" y1="${y(p.volgendeWeek.laag)}" y2="${y(p.volgendeWeek.laag)}" stroke="var(--accent)" stroke-width="2"/>`;
    });
    const sum = `Verwachting volgende week: ${p.volgendeWeek.verwacht} betrokken dagbezoeken (tussen ${p.volgendeWeek.laag} en ${p.volgendeWeek.hoog}). De trend is ${p.helling >= 0 ? '+' : ''}${String(p.helling).replace('.', ',')} per week.`;
    $('#prog-sum').textContent = sum;
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(sum)}">${g}</svg>`;
  }
  renderProg();
  let rsT; new ResizeObserver(() => { clearTimeout(rsT); rsT = setTimeout(() => { renderGroei(); renderProg(); }, 120); }).observe($('#groei'));

  // Doelen
  $('#doelen').innerHTML = (APP.doelen || []).map(d => `<div><div class="chart-bar" style="margin:0 0 6px"><b style="font-size:15px">${esc(d.naam)}</b><span class="sub" style="margin-left:auto;font-size:13px;color:var(--label2)">doel ${nf(d.waarde)} op ${kort(d.datum)}</span></div>
      <div class="fbar" style="height:14px"><i style="width:${d.voortgangPct || 0}%"></i></div>
      <p class="chart-sum" style="margin:8px 0 0">Nu <b class="num">${nf(d.huidig)}</b>. Daarvoor is <b>${String(d.nodigeGroeiPerWeekPct).replace('.', ',')}% groei per week</b> nodig, ${d.wekenTot} weken lang.</p></div>`).join('')
    || '<p class="chart-sum">Nog geen doelen ingesteld (social/jarvis-config.json).</p>';

  // ── Trechter ──────────────────────────────────────────────────────────
  (function () {
    const t = APP.trechter?.deze, v = APP.trechter?.vorige;
    if (!t || !t.basis) { $('#funnel').innerHTML = '<p class="chart-sum">Nog geen trechterdata.</p>'; return; }
    const vorigePct = v?.basis ? [100, v.conversie.home, v.conversie.action] : [];
    $('#funnel').innerHTML = t.stappen.map((s, i) => { const p = Math.round(s.n / t.basis * 100);
      return `<div class="fstep"><span class="fl">${esc(s.stap)}</span><span class="fbar"><i style="width:${p}%"></i>${vorigePct[i] != null && i ? `<s style="left:${vorigePct[i]}%" title="vorige week ${vorigePct[i]}%"></s>` : ''}</span><span class="fv num">${i ? p + '%' : nf(s.n)}</span></div>`; }).join('');
    $('#funnel-sum').textContent = `${t.conversie.action}% van de echte bezoekers doet deze week iets${v?.conversie ? ` (vorige week ${v.conversie.action}%)` : ''}. Het streepje is vorige week.`;
    $('#funnel-note').textContent = t.nieuwPad ? `Nieuwe bezoekers (${t.nieuw}): ${t.nieuwPad.niveau}% kiest een niveau, ${t.nieuwPad.action}% doet daarna iets.` : '';
  })();

  // ── Cohorten ──────────────────────────────────────────────────────────
  (function () {
    const rows = (APP.cohorten || []).filter(c => c.omvang > 0);
    const cols = 7;
    let h = `<div class="crow h"><span>Instroomweek</span><span>Nieuw</span>${Array.from({ length: cols }, (_, i) => `<span style="text-align:center">+${i + 1} wk</span>`).join('')}</div>`;
    rows.forEach(c => {
      h += `<div class="crow"><span>${kort(c.week)}</span><span class="num">${c.omvang}</span>` + Array.from({ length: cols }, (_, i) => {
        const v = c.retentie[i]; if (v == null) return '<span class="cell na"></span>';
        const a = Math.min(1, v / 40); return `<span class="cell num" style="background:color-mix(in srgb,var(--accent) ${Math.round(8 + a * 70)}%,var(--mat3))" title="${v}% kwam na ${i + 1} week terug">${v}%</span>`;
      }).join('') + '</div>';
    });
    $('#cohort').innerHTML = h;
    const eerste = rows.filter(c => c.omvang >= 5 && c.retentie.length).map(c => c.retentie[0]);
    const gem = eerste.length ? Math.round(eerste.reduce((a, b) => a + b, 0) / eerste.length) : null;
    $('#cohort-sum').textContent = gem != null ? `Gemiddeld komt ${gem}% van de nieuwe leerlingen een week later terug. Hoe donkerder het vak, hoe meer er terugkwamen.` : 'Nog te weinig instroom om terugkeer te meten.';
  })();

  // ── Herkomst ──────────────────────────────────────────────────────────
  const BRONKLEUR = { ChatGPT: 'var(--teal)', 'Andere AI': 'var(--indigo)', Google: 'var(--blue)', 'Bing & co': 'var(--blue)', Instagram: 'var(--accent)', TikTok: 'var(--accent)', Facebook: 'var(--indigo)', Direct: 'var(--label3)', "Eigen pagina's": 'var(--label3)', Overig: 'var(--label3)' };
  let bronBereik = 'zestigDagen';
  function renderBron() {
    const h = APP.herkomst || {}, data = h[bronBereik] || {}, prev = bronBereik === 'deze' ? h.vorige || {} : null;
    const max = Math.max(1, ...Object.values(data));
    $('#src').innerHTML = Object.entries(data).map(([k, v]) => `<div class="srow"><span>${esc(k)}</span><span class="strack"><i style="width:${v / max * 100}%;background:${BRONKLEUR[k] || 'var(--label3)'}"></i></span><span class="sv num">${nf(v)}${prev ? ` <small>(${nf(prev[k] || 0)})</small>` : ''}</span></div>`).join('') || '<p class="chart-sum">Geen data.</p>';
    $('#src-seg').innerHTML = [['deze', 'Deze week'], ['zestigDagen', '60 dagen']].map(([k, l]) => `<button type="button" aria-pressed="${bronBereik === k}" data-k="${k}">${l}</button>`).join('');
    const ai = (data.ChatGPT || 0) + (data['Andere AI'] || 0), go = data.Google || 0;
    $('#src-sum').textContent = ai > go ? `AI-assistenten (${ai}) sturen meer bezoekers dan Google (${go}). Zoekverkeer verschuift naar ChatGPT.` : `Google stuurt ${go} bezoekers, AI-assistenten ${ai}.`;
  }
  $('#src-seg').addEventListener('click', e => { const k = e.target.closest('button')?.dataset.k; if (k) { bronBereik = k; renderBron(); } });
  renderBron();

  // ── Content ───────────────────────────────────────────────────────────
  (function () {
    const C = D.content; const rev = Object.fromEntries((A.content?.review || []).map(r => [r.id, r]));
    if (!C) { $('#posts').closest('section').hidden = true; return; }
    $('#content-title').textContent = A.content?.voorbeeld ? 'Zo ziet een week eruit' : 'Klaar om goed te keuren';
    $('#content-sum').innerHTML = md(A.content?.intro || '');
    const DGN = { ma: 'Maandag', di: 'Dinsdag', wo: 'Woensdag', do: 'Donderdag', vr: 'Vrijdag', za: 'Zaterdag', zo: 'Zondag' };
    const FMT = { image: 'Post', story: 'Story', carousel: 'Carrousel', reel: 'Reel' };
    const VT = { goed: 'Goedgekeurd door Jarvis', aangepast: 'Aangepast door Jarvis', vervangen: 'Vervangen door Jarvis', twijfel: 'Jarvis twijfelt' };
    $('#posts').innerHTML = C.posts.map(p => { const r = rev[p.id];
      return `<article class="post"><div class="pimg">${p.thumb ? `<img src="${p.thumb}" alt="" class="${p.format === 'reel' || p.format === 'story' ? 'tall' : ''}">` : ''}${p.format === 'carousel' ? `<span class="badge">${p.n} slides</span>` : p.format === 'reel' ? '<span class="badge">▶ video</span>' : ''}</div>
        <div class="pm"><div class="pw">${DGN[p.dag] || ''} ${esc(p.tijd)} · ${FMT[p.format] || p.format}</div><div class="pi">${esc(p.info)}</div>
        ${r ? `<span class="verdict v-${esc(r.oordeel)}">${VT[r.oordeel] || esc(r.oordeel)}</span>${r.notitie ? `<p class="vn">${md(r.notitie)}</p>` : ''}` : ''}</div></article>`; }).join('');
    $('#content-cta').innerHTML = A.content?.pr ? `<a class="btn primary" href="${esc(A.content.pr)}" target="_blank" rel="noopener">Bekijk en keur goed →</a>` : `<span class="btn plain">${esc(A.content?.knoptekst || 'Nog geen pull request')}</span>`;
  })();

  // ── Geheugen ──────────────────────────────────────────────────────────
  (function () {
    const vs = (G.voorspellingen || []).slice(-6).reverse();
    const klaar = (G.voorspellingen || []).filter(v => v.uitkomst != null), raak = klaar.filter(v => v.raak).length;
    $('#kalibratie').textContent = klaar.length ? `${raak} van ${klaar.length} voorspellingen binnen de marge.` : 'De eerste voorspelling wordt volgende week getoetst.';
    $('#preds').innerHTML = vs.map(v => `<div class="pred"><span class="pv num">${v.verwacht}</span><span class="pr">voor de week t/m ${kort(v.voor)} · marge ${v.laag}–${v.hoog}${v.uitkomst != null ? ` · werkelijk <b class="num">${v.uitkomst}</b>` : ''}</span><span class="pill ${v.uitkomst == null ? 'open' : v.raak ? 'raak' : 'mis'}">${v.uitkomst == null ? 'open' : v.raak ? 'raak' : 'mis'}</span></div>`).join('') || '<p class="chart-sum">Nog geen voorspellingen.</p>';
    const ex = (G.experimenten || []).slice().sort((a, b) => (a.status === 'loopt' ? -1 : 1) - (b.status === 'loopt' ? -1 : 1))[0];
    $('#exp').innerHTML = ex ? `<span class="pill ${ex.status === 'loopt' ? 'open' : ex.status === 'geslaagd' ? 'raak' : 'mis'}">${esc(ex.status)}</span><h3>${esc(ex.titel)}</h3><p class="chart-sum" style="margin:0">${md(ex.hypothese || '')}</p>
      <dl><dt>Wat je doet</dt><dd>${md(ex.actie || '')}</dd><dt>Meting</dt><dd>${md(ex.meting || '')}</dd><dt>Geslaagd als</dt><dd>${md(ex.doel || '')}</dd>${ex.resultaat ? `<dt>Resultaat</dt><dd>${md(ex.resultaat)}</dd>` : ''}</dl>` : '<p class="chart-sum">Nog geen experiment.</p>';
  })();

  // ── Gezondheid, vindbaarheid, acties ──────────────────────────────────
  $('#errs').innerHTML = (APP.topFouten || []).map(f => { const noot = Object.entries(A.fouten_notities || {}).find(([k]) => f.bericht.includes(k))?.[1];
    return `<li><span class="n num">${f.n}×</span><code>${esc(f.bericht)}</code>${noot ? `<span class="fix">${esc(noot)}</span>` : ''}</li>`; }).join('') || '<li>Geen fouten gemeten.</li>';
  $('#seo').innerHTML = `<li><span class="n num" style="color:var(--green)">${nf(S.seo?.paginas)}</span><span>pagina's in de sitemap, automatisch bijgehouden</span></li>
    <li><span class="n" style="color:${S.seo?.indexnow ? 'var(--green)' : 'var(--yellow)'}">${S.seo?.indexnow ? 'aan' : 'uit'}</span><span>IndexNow: nieuwe pagina's direct naar Bing en ChatGPT-search</span></li>
    <li><span class="n num" style="color:var(--teal)">${nf((APP.herkomst?.zestigDagen?.ChatGPT || 0) + (APP.herkomst?.zestigDagen?.['Andere AI'] || 0))}</span><span>bezoeken via AI-assistenten in 60 dagen</span></li>`;
  $('#todo').innerHTML = (A.acties || []).map((a, i) => `<label><input type="checkbox" id="actie-${i}" data-k="${esc(a.tekst.slice(0, 40))}"><span>${md(a.tekst)}${a.link ? ` <a href="${esc(a.link)}" target="_blank" rel="noopener">${esc(a.linktekst || 'open')} →</a>` : ''}</span></label>`).join('');
  document.querySelectorAll('#todo input').forEach(cb => { const k = 'todo:' + S.periode.tot + ':' + cb.dataset.k; cb.checked = store.get(k) === 1; cb.addEventListener('change', () => store.set(k, cb.checked ? 1 : 0)); });
  $('#seizoen').textContent = APP.seizoen ? `${APP.seizoen.dagenTotCE} dagen tot de eerste centrale examens. ${APP.seizoen.fase}` : '';
  $('#gemeten').textContent = 'Gemeten ' + new Date(S.gemeten).toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam', dateStyle: 'medium', timeStyle: 'short' });

  // ── Neurale kern ──────────────────────────────────────────────────────
  const NODES = [
    { id: 'groei', label: 'Groei', sectie: 'groei' }, { id: 'content', label: 'Content', sectie: 'content' },
    { id: 'app', label: 'App', sectie: 'gezondheid' }, { id: 'seo', label: 'Vindbaarheid', sectie: 'gezondheid' },
    { id: 'trechter', label: 'Trechter', sectie: 'trechter' },
  ];
  const nodeStatus = id => (A.status?.[id]?.[0]) || (id === 'trechter' ? ((APP.trechter?.deze?.conversie?.action ?? 0) >= 60 ? 'ok' : 'let-op') : 'wacht');
  (function core() {
    const wrap = $('#core'), cv = $('#core canvas'), ctx = cv.getContext('2d');
    let W = 0, H = 0, dpr = 1, raf = 0, t0 = performance.now(), visible = true, hover = -1;
    const N = 240, pts = [];
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
    const links = [];
    pts.forEach((p, i) => { const d = pts.map((q, j) => [j, (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2]).filter(([j]) => j > i).sort((a, b) => a[1] - b[1]).slice(0, 2); d.forEach(([j]) => links.push([i, j])); });
    let colors = {};
    const readColors = () => { colors = { accent: css('--accent'), label: css('--label'), label3: css('--label3'), green: css('--green'), yellow: css('--yellow'), red: css('--red') }; };
    const stColor = st => st === 'ok' ? colors.green : st === 'actie' ? colors.red : st === 'let-op' ? colors.yellow : colors.label3;
    function size() { const b = wrap.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1); W = b.width; H = b.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    const sat = [];
    function frame(now) {
      const t = (now - t0) / 1000, cx = W / 2, cy = H * .46, R = Math.min(W, H) * .27;
      ctx.clearRect(0, 0, W, H);
      const breathe = 1 + Math.sin(t * 1.1) * .015;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.9);
      glow.addColorStop(0, colors.accent + '55'); glow.addColorStop(.45, colors.accent + '18'); glow.addColorStop(1, colors.accent + '00');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
      const ay = t * .18, ax = .35 + Math.sin(t * .13) * .08, ca = Math.cos(ay), sa = Math.sin(ay), cb = Math.cos(ax), sb = Math.sin(ax);
      const proj = pts.map(([x, y, z]) => { const x1 = x * ca - z * sa, z1 = x * sa + z * ca, y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb; const s = 1.9 / (2.6 - z2); return [cx + x1 * R * s * breathe, cy + y1 * R * s * breathe, z2]; });
      ctx.lineWidth = .6;
      for (const [i, j] of links) { const a = proj[i], b = proj[j], dz = (a[2] + b[2]) / 2; ctx.strokeStyle = colors.accent + Math.round(18 + (dz + 1) * 40).toString(16).padStart(2, '0'); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
      for (const [x, y, z] of proj) { const a = .25 + (z + 1) * .37; ctx.fillStyle = z > .2 ? colors.accent : colors.label; ctx.globalAlpha = a * (z > .2 ? 1 : .45); ctx.beginPath(); ctx.arc(x, y, 1 + (z + 1) * .9, 0, 7); ctx.fill(); }
      ctx.globalAlpha = 1;
      // Satellieten: de systemen van Slagio, met hun status
      sat.length = 0;
      NODES.forEach((n, k) => {
        const ang = t * .07 + k / NODES.length * Math.PI * 2, rx = R * 1.62, ry = R * .62;
        const x = cx + Math.cos(ang) * rx, y = cy + Math.sin(ang) * ry + R * .05, front = Math.sin(ang) > 0;
        const st = nodeStatus(n.id), col = stColor(st);
        const tgt = proj[(k * 47) % N];
        ctx.strokeStyle = col; ctx.globalAlpha = front ? .35 : .15; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tgt[0], tgt[1]); ctx.stroke();
        const ph = (t * .5 + k * .23) % 1; ctx.globalAlpha = front ? .9 : .4; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + (tgt[0] - x) * ph, y + (tgt[1] - y) * ph, 2.2, 0, 7); ctx.fill();
        const r = (hover === k ? 9 : 7) + (st === 'actie' ? Math.sin(t * 4) * 1.5 : 0);
        ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
        ctx.strokeStyle = colors.label; ctx.globalAlpha = .25; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, r + 5, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
        ctx.fillStyle = colors.label; ctx.font = `600 ${hover === k ? 14 : 12}px -apple-system,BlinkMacSystemFont,Inter,system-ui,sans-serif`; ctx.textAlign = 'center'; ctx.globalAlpha = front || hover === k ? 1 : .6;
        ctx.fillText(n.label, x, y - r - 9); ctx.globalAlpha = 1;
        sat.push({ x, y, r: r + 10, n });
      });
      if (!REDUCE.matches && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }
    function start() { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
    readColors(); size(); start();
    new ResizeObserver(() => { size(); start(); }).observe(wrap);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(wrap);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { readColors(); start(); });
    REDUCE.addEventListener('change', start);
    const hit = e => { const b = cv.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top; return sat.findIndex(s => (s.x - x) ** 2 + (s.y - y) ** 2 < s.r * s.r); };
    cv.addEventListener('pointermove', e => { const h = hit(e); if (h !== hover) { hover = h; cv.style.cursor = h >= 0 ? 'pointer' : 'default'; $('#corehint').textContent = h >= 0 ? `${NODES[h].label}: ${(A.status?.[NODES[h].id]?.[1] || '').replace(/\*\*/g, '')}` : 'Tik op een systeem'; if (REDUCE.matches) start(); } });
    cv.addEventListener('click', e => { const h = hit(e); if (h >= 0) gaNaar(NODES[h].sectie); });
  })();

  // ── Navigatie: glazen dock + deep links ───────────────────────────────
  function gaNaar(id) { const el = document.getElementById(id); if (!el) return; el.scrollIntoView({ behavior: REDUCE.matches ? 'auto' : 'smooth', block: 'start' }); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); history.replaceState(null, '', '#' + id); }
  document.querySelectorAll('.tabs a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); gaNaar(a.getAttribute('href').slice(1)); }));
  const secties = [...document.querySelectorAll('main section[id], #overzicht')];
  const io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) document.querySelectorAll('.tabs a').forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id)); }); }, { rootMargin: '-40% 0px -55% 0px' });
  secties.forEach(s => io.observe(s));
  if (/^#[\w-]+$/.test(location.hash)) setTimeout(() => gaNaar(location.hash.slice(1)), 60);

  // ── Commandopalet (⌘K) ────────────────────────────────────────────────
  const VRAGEN = ['Wat is het belangrijkste dat ik deze week moet doen?', 'Waarom komen leerlingen niet terug, en wat helpt?', 'Welke bron levert de meest betrokken leerlingen?',
    'Hoe realistisch is mijn doel van 250 per week?', 'Wat zie je in de trechter?', 'Welke post van deze week is het zwakst en waarom?'];
  const SECT = [['overzicht', 'Overzicht'], ['denkwerk', 'Denkwerk'], ['groei', 'Groei & prognose'], ['trechter', 'Trechter'], ['terugkeer', 'Terugkeer'], ['herkomst', 'Herkomst'], ['content', 'Content'], ['geheugen', 'Geheugen'], ['gezondheid', 'Gezondheid'], ['kansen', 'Kansen'], ['acties', 'Acties']];
  const pal = $('#palette'), palIn = $('#pal-in'), palList = $('#pal-list');
  let palSel = 0, palItems = [];
  function palRender() {
    const q = palIn.value.trim().toLowerCase();
    const J = window.JARVIS, kan = !!J.kan?.();
    palItems = [...(q && kan ? [{ t: `Vraag Jarvis: “${palIn.value.trim()}”`, k: 'Vraag', run: () => J.vraag(palIn.value.trim()) }] : []),
      ...(kan && J.stem ? [{ t: 'Praat met Jarvis', k: 'Gesprek', run: () => J.stem() }].filter(() => !q || 'praat gesprek spraak stem'.includes(q)) : []),
      ...SECT.filter(([, l]) => !q || l.toLowerCase().includes(q)).map(([id, l]) => ({ t: l, k: 'Ga naar', run: () => gaNaar(id) })),
      ...(kan ? VRAGEN.filter(v => !q || v.toLowerCase().includes(q)).map(v => ({ t: v, k: 'Vraag', run: () => J.vraag(v) })) : [])];
    palSel = Math.min(palSel, Math.max(0, palItems.length - 1));
    palList.innerHTML = palItems.map((it, i) => `<li><button type="button" role="option" aria-selected="${i === palSel}" data-i="${i}">${esc(it.t)}<small>${it.k}</small></button></li>`).join('');
  }
  function palOpen() { pal.hidden = false; palIn.value = ''; palSel = 0; palRender(); palIn.focus(); }
  function palClose() { pal.hidden = true; }
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.hidden ? palOpen() : palClose(); }
    else if (e.key === 'Escape') { if (!pal.hidden) palClose(); else window.JARVIS.escape?.(); }
  });
  palIn.addEventListener('input', () => { palSel = 0; palRender(); });
  palIn.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { palSel = Math.min(palItems.length - 1, palSel + 1); palRender(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { palSel = Math.max(0, palSel - 1); palRender(); e.preventDefault(); }
    if (e.key === 'Enter' && palItems[palSel]) { const it = palItems[palSel]; palClose(); it.run(); }
  });
  palList.addEventListener('click', e => { const i = +e.target.closest('button')?.dataset.i; if (!isNaN(i)) { palClose(); palItems[i].run(); } });
  pal.addEventListener('click', e => { if (e.target === pal) palClose(); });
  $('#open-pal').addEventListener('click', palOpen);

  const compact = () => JSON.stringify({
    periode: S.periode, deze: { ...deze, functies: deze.functies, vakken: deze.vakken }, vorige: { betrokken: vorige.betrokken, actief: vorige.actief, nieuw: vorige.nieuw, oefensessies: vorige.oefensessies, fouten: vorige.fouten },
    terugkeerBetrokken: APP.terugkeerBetrokken, dagelijks: dag.slice(-60).map(r => [r.datum, r.actief, r.betrokken, r.nieuw, r.oefensessies]),
    afwijkingen: APP.afwijkingen, trechter: APP.trechter, herkomst: APP.herkomst, cohorten: APP.cohorten, prognose: APP.prognose, seizoen: APP.seizoen, doelen: APP.doelen,
    signalen: APP.signalen, topFouten: APP.topFouten, seo: S.seo, instagram: S.instagram, content: D.content ? D.content.posts.map(p => ({ id: p.id, format: p.format, info: p.info })) : null,
    jarvisAnalyse: { kop: A.kop, briefing: A.briefing, status: A.status, aandacht: A.aandacht, denkwerk: A.denkwerk, acties: A.acties, review: A.content?.review }, geheugen: G,
  });

  // De gesprekslaag (brein.js) leest alles via dit ene object.
  window.JARVIS = Object.assign(window.JARVIS || {}, { D, S, A, APP, G, dag, deze, vorige, gaNaar, SECT, VRAGEN, esc, store, compact, REDUCE });
})();
