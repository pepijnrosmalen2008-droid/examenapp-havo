/* ═══════════════════════════════════════════════════════════════════════
   Jarvis · gesprekslaag en stem
   Jarvis is Claude (via de sample-capability, op het account van de kijker),
   gespecialiseerd door drie dingen die hier samenkomen:
     1. vakkennis   social/jarvis-brein.md + de stijlgids, in elke vraag
     2. kennisbank  inhoud, contentgaten, vraagbank en SEO-audit uit de repo,
                    opvraagbaar via tools (een vraag mag max. 64 KB zijn)
     3. werktools   posts en voorstellen tonen, tekst toetsen aan de stijlgids,
                    een redactieronde, en de briefing aanwijzen
   De stem gebruikt de spraakherkenning en -synthese van de browser. Alles
   valt netjes weg als iets niet beschikbaar is.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const J = window.JARVIS || (window.JARVIS = {});
  const K = JSON.parse(document.getElementById('jarvis-kennis')?.textContent || '{}');
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const store = J.store, REDUCE = J.REDUCE || matchMedia('(prefers-reduced-motion: reduce)');
  const NIV = { havo: { l: 'HAVO', k: '#2f6bff' }, vwo: { l: 'VWO', k: '#8b5cf6' }, vmbo: { l: 'VMBO', k: '#14b8a6' } };
  const bytes = s => new TextEncoder().encode(s).length;

  let ASK = null, TOOLMAX = 0, ctl = null;
  let modus = store.get('modus') || 'auto', diep = !!store.get('diep');
  let turns = (store.get('gesprek') || []).filter(t => t && t.content);

  // ── Modi ────────────────────────────────────────────────────────────────
  const MODI = {
    auto: { l: 'Auto', focus: 'Kies zelf welke expertise de vraag nodig heeft.',
      chips: ['Wat is nu het belangrijkste om te doen?', 'Maak een carrousel voor deze week', 'Welke pagina moet ik als eerste verbeteren voor Google?', 'Waar ontbreekt content in de app?'] },
    analyse: { intro: 'Ik verklaar je cijfers, weeg het bewijs en kies het ene ding dat nu het meeste oplevert.', l: 'Analyse', focus: 'Analyse: verklaar de cijfers, weeg bewijs, kies het ene ding dat nu het meeste oplevert en hoe je meet of het werkt.',
      chips: ['Waarom komen leerlingen niet terug?', 'Hoe realistisch is mijn doel van 250 per week?', 'Wat zie je in de trechter?', 'Ontwerp een experiment voor volgende week'] },
    content: { intro: 'Ik beoordeel en verbeter vragen, begrippen en samenvattingen, en vul de gaten in de app.', l: 'Content', focus: 'Content in de app: beoordeel en verbeter vragen, begrippen en samenvattingen, en vul gaten aan. Lever voorstellen in het app-formaat via toonVoorstel.',
      chips: ['Welke contentgaten moet ik eerst dichten?', 'Beoordeel vijf biologie-vragen van havo', 'Schrijf 5 vragen voor een leeg vmbo-domein', 'Welke vakken zijn het dunst?'] },
    social: { intro: 'Ik maak posts met echte vragen uit de app, laat ze zien zoals ze gepost worden en toets ze aan de stijlgids.', l: 'Social', focus: 'Social: maak posts die leerlingen opslaan en delen. Lever de post zelf via toonPost, controleer hem, en verbeter tot de controle schoon is.',
      chips: ['Maak een examenvraag-carrousel voor biologie havo', 'Schrijf een reel-script zonder gezicht', 'Plan de posts van volgende week', 'Tien hooks voor wiskunde A'] },
    vindbaar: { intro: 'Ik werk aan je plek in Google en in AI-assistenten, met nieuwe titles, teksten en pagina’s.', l: 'Vindbaarheid', focus: 'Vindbaarheid: Google en AI-assistenten. Gebruik de SEO-audit, geef concrete nieuwe titles, descriptions en tekst, en lever die via toonVoorstel.',
      chips: ['Wat zijn de grootste SEO-problemen?', 'Herschrijf de titles van de havo-vakpagina’s', 'Hoe word ik vaker genoemd door ChatGPT?', 'Welke nieuwe pagina’s leveren het meeste op?'] },
  };

  // ── Stijlcontrole (dezelfde harde regels als captions.mjs + de stijlgids) ──
  const VERBODEN = [[/—/, 'gedachtestreepje (—)'], [/ – /, 'gedachtestreepje (–)'], [/\bontdek/i, '"ontdek"'], [/\bduik (in|mee)/i, '"duik in"'], [/unlock|ontgrendel/i, '"ontgrendel"'],
    [/game.?changer/i, '"game-changer"'], [/klaar om\b/i, '"klaar om…"'], [/in een wereld waar/i, '"in een wereld waar"'], [/het geheim (van|achter)/i, '"het geheim van"'],
    [/\bboost/i, '"boost"'], [/naar een hoger niveau/i, '"naar een hoger niveau"'], [/\breis\b/i, '"reis"'], [/\bniet (alleen )?\w+(,| maar)\s+maar\b|\bniet \w+[^.]{0,40}, maar /i, 'constructie "niet X, maar Y"'],
    [/✨|🚀|💡/u, 'verboden emoji (✨ 🚀 💡)'], [/^\s*\p{Extended_Pictographic}/mu, 'emoji als opsommingsteken']];
  function controleer(tekst, { caption = false } = {}) {
    const t = String(tekst || ''), p = [];
    VERBODEN.forEach(([re, w]) => { if (re.test(t)) p.push(w); });
    const emoji = (t.match(/\p{Extended_Pictographic}/gu) || []).length; if (emoji > 2) p.push(`${emoji} emoji (max 2)`);
    if (caption) {
      const tags = t.match(/#[\p{L}\d]+/gu) || [];
      if (tags.length && (tags.length < 5 || tags.length > 8)) p.push(`${tags.length} hashtags (5 tot 8)`);
      if (tags.length && !tags.some(x => x.toLowerCase() === '#eindexamen2027')) p.push('#eindexamen2027 ontbreekt');
      if (t.length > 2100) p.push('te lang voor Instagram');
    }
    const cijfers = t.match(/\b\d{2,3}\s?%/g); if (cijfers) p.push(`controleer of ${cijfers.join(', ')} uit de gemeten data komt`);
    return p;
  }

  // ── Kennisbank-tools ─────────────────────────────────────────────────────
  const vakVan = (n, v) => (K.inhoud?.[n] || []).find(x => x.id === v || x.naam.toLowerCase() === String(v || '').toLowerCase());
  function inhoudTool({ niveau, vak }) {
    const n = String(niveau || '').toLowerCase();
    if (!K.inhoud?.[n]) return { niveaus: Object.keys(K.inhoud || {}), totalen: K.totalen };
    if (!vak) return { niveau: n, kolommen: ['id', 'naam', 'examen', 'domeinen', 'oefenvragen', 'begrippen'],
      vakken: K.inhoud[n].map(v => [v.id, v.naam, v.exDatum, v.dom.length, v.dom.reduce((a, d) => a + d[3], 0), v.dom.reduce((a, d) => a + d[5], 0)]) };
    const v = vakVan(n, vak); if (!v) throw new Error(`Vak "${vak}" niet gevonden bij ${n}. Kies een id uit inhoud({niveau}).`);
    return { niveau: n, vak: v.naam, id: v.id, examen: v.exDatum, kolommen: ['domein', 'naam', 'CE/SE', 'oefenvragen', 'oud-examen', 'begrippen', 'samenvatting'], domeinen: v.dom };
  }
  function vragenTool({ niveau, vak, domein, zoek, aantal }) {
    const n = String(niveau || '').toLowerCase(), v = vakVan(n, vak);
    if (!v) throw new Error('Onbekend vak. Gebruik inhoud({niveau}) voor de ids.');
    const b = K.vraagbank?.[`${n}:${v.id}`]; if (!b) return { vragen: [], let_op: 'Geen losse vragen beschikbaar voor dit vak.' };
    let qs = b.vragen;
    if (domein) qs = qs.filter(q => q[0].toLowerCase().startsWith(String(domein).toLowerCase()));
    if (zoek) { const z = String(zoek).toLowerCase(); qs = qs.filter(q => (q[3] + q[4].join(' ') + q[6]).toLowerCase().includes(z)); }
    return { vak: v.naam, niveau: n, let_op: 'Steekproef van max. 24 los bruikbare vragen per vak, niet de hele vraagbank.',
      vragen: qs.slice(0, Math.min(8, Number(aantal) || 5)).map(q => ({ domein: `${q[0]} ${q[1]}`, ce: !!q[2], vraag: q[3], opties: q[4], juist: q[5], uitleg: q[6] })),
      begrippen: b.begrippen.filter(x => !domein || x[0].toLowerCase().startsWith(String(domein).toLowerCase())).slice(0, 8).map(x => ({ term: x[1], definitie: x[2] })) };
  }
  function gatenTool({ niveau, max }) {
    const g = (K.gaten || []).filter(x => !niveau || x.niveau === String(niveau).toLowerCase());
    return { totaal: g.length, gaten: g.slice(0, Math.min(40, Number(max) || 20)).map(x => ({ niveau: x.niveau, vak: x.vak, vakId: x.vakId, domein: x.domein, status: x.ce, examen: x.exDatum, redenen: x.redenen })) };
  }
  function seoTool({ pad, probleem }) {
    const P = K.seo?.paginas || [];
    if (pad) { const p = P.find(x => x.pad === pad || x.pad.endsWith('/' + pad) || x.url.endsWith(pad)); if (!p) throw new Error('Pagina niet gevonden. Gebruik seoAudit() voor de lijst.'); return p; }
    const telling = {};
    P.forEach(p => p.issues.forEach(([e, t]) => { const k = t.replace(/\d+/g, '#'); (telling[k] ||= { ernst: e, n: 0, voorbeelden: [] }); telling[k].n++; if (telling[k].voorbeelden.length < 4) telling[k].voorbeelden.push(p.pad); }));
    let lijst = P.filter(p => p.issues.length);
    if (probleem) { const z = String(probleem).toLowerCase(); lijst = lijst.filter(p => p.issues.some(i => i[1].toLowerCase().includes(z))); }
    lijst.sort((a, b) => b.issues.reduce((s, i) => s + i[0], 0) - a.issues.reduce((s, i) => s + i[0], 0));
    return { score: K.seo?.score, paginas: P.length, problemen: telling,
      zonderDomeinpaginas: (K.seo?.dekking || []).filter(d => !d.domeinpaginas).map(d => `${d.niveau} ${d.vak}`),
      ergste: lijst.slice(0, 15).map(p => ({ pad: p.pad, title: p.title, woorden: p.woorden, issues: p.issues.map(i => i[1]) })) };
  }

  // ── Kaarten: posts en voorstellen in het gesprek ─────────────────────────
  const LET = ['A', 'B', 'C', 'D'];
  function slideHtml(s, i, n, p) {
    const niv = NIV[p.niveau] || { l: '', k: '#E85C0D' };
    const type = s.type || (i === 0 ? 'cover' : i === n - 1 ? 'cta' : 'tekst');
    const licht = type === 'vraag' || type === 'antwoord';
    const chip = `<span class="sl-chip" style="--niv:${niv.k}">${esc([niv.l, p.vak].filter(Boolean).join(' · ') || 'Slagio')}</span>`;
    const opts = Array.isArray(s.opties) ? `<div class="sl-opts">${s.opties.slice(0, 4).map((o, k) => `<div class="sl-opt${type === 'antwoord' && k === s.juist ? ' ok' : ''}"><i>${LET[k]}</i>${esc(o)}</div>`).join('')}</div>` : '';
    const dots = `<div class="sl-prog">${Array.from({ length: n }, (_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>`;
    return `<div class="sl ${licht ? 'licht' : 'donker'} sl-${esc(type)}" style="--acc:${type === 'cta' ? '#E85C0D' : niv.k}">
      <div class="sl-top"><b><i>S</i>Slagio</b>${chip}</div>
      <div class="sl-body">${s.label ? `<div class="sl-lbl">${esc(s.label)}</div>` : ''}${s.kop ? `<div class="sl-kop">${esc(s.kop)}</div>` : ''}${s.tekst ? `<div class="sl-txt">${esc(s.tekst)}</div>` : ''}${opts}</div>
      <div class="sl-foot"><span>slagio.nl</span>${dots}</div></div>`;
  }
  function postKaart(p, extra = {}) {
    const staand = /reel|story|tiktok/i.test(p.format || '');
    const slides = (p.slides || []).slice(0, 10);
    const cap = p.onderschrift || '';
    const probl = controleer(cap, { caption: true }).concat(...slides.map(s => controleer([s.kop, s.tekst, ...(s.opties || [])].join('\n'))));
    const uniek = [...new Set(probl)];
    const d = document.createElement('div'); d.className = 'kaart post';
    d.innerHTML = `<div class="k-kop"><span class="k-type">${esc(p.format || 'post')}</span><b>${esc(p.titel || [NIV[p.niveau]?.l, p.vak].filter(Boolean).join(' · ') || 'Voorstel')}</b>
        <span class="k-check ${uniek.length ? 'warn' : 'ok'}" title="${esc(uniek.join('\n'))}">${uniek.length ? `${uniek.length} punt${uniek.length > 1 ? 'en' : ''}` : 'Stijlgids ok'}</span></div>
      ${staand && p.scenes ? `<div class="sl-rij">${p.scenes.slice(0, 8).map((sc, i) => `<div class="sl staand donker" style="--acc:${NIV[p.niveau]?.k || '#E85C0D'}"><div class="sl-sec">${esc(sc.sec ?? i * 3)}s</div><div class="sl-body"><div class="sl-lbl">${esc(sc.beeld || '')}</div><div class="sl-kop">${esc(sc.tekst || '')}</div></div></div>`).join('')}</div>`
        : `<div class="sl-rij">${slides.map((s, i) => slideHtml(s, i, slides.length, p)).join('')}</div>`}
      ${cap ? `<div class="k-cap">${esc(cap)}</div>` : ''}
      ${uniek.length ? `<ul class="k-probl">${uniek.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${extra.redactie ? `<div class="k-red"><b>Redactie</b> ${esc(extra.redactie)}</div>` : ''}
      <div class="k-acties">${cap ? '<button type="button" data-a="cap">Kopieer onderschrift</button>' : ''}<button type="button" data-a="json">Kopieer als JSON</button>${ASK ? '<button type="button" data-a="red">Redactieronde</button>' : ''}</div>`;
    d.addEventListener('click', async e => {
      const a = e.target.closest('button')?.dataset.a; if (!a) return;
      if (a === 'cap') kopieer(cap, e.target);
      if (a === 'json') kopieer(JSON.stringify(p, null, 2), e.target);
      if (a === 'red') redactie(p, d, e.target);
    });
    return d;
  }
  function voorstelKaart(v) {
    const d = document.createElement('div'); d.className = 'kaart voorstel';
    const items = Array.isArray(v.items) ? v.items.slice(0, 30) : [];
    let body = '';
    if (v.soort === 'vragen') body = items.map(q => { const pr = controleer([q.v, ...(q.o || []), q.u].join('\n')); return `<div class="vq"><p><b>${esc(q.v)}</b></p><ol type="A">${(q.o || []).map((o, i) => `<li class="${i === q.c ? 'ok' : ''}">${esc(o)}${q.uo?.[i] && i !== q.c ? `<small>${esc(q.uo[i])}</small>` : ''}</li>`).join('')}</ol>${q.u ? `<p class="vq-u">${esc(q.u)}</p>` : ''}${pr.length ? `<p class="vq-p">${esc(pr.join(' · '))}</p>` : ''}</div>`; }).join('');
    else if (v.soort === 'begrippen') body = `<dl class="vb">${items.map(b => `<dt>${esc(b.t)}</dt><dd>${esc(b.d)}</dd>`).join('')}</dl>`;
    else body = `<div class="vt"><table><thead><tr><th>Pagina</th><th>Nu</th><th>Voorstel</th></tr></thead><tbody>${items.map(r => `<tr><td>${esc(r.pad || r.waar || '')}</td><td class="oud">${esc(r.oud || '')}</td><td><b>${esc(r.nieuw || '')}</b>${r.nieuw ? `<small>${String(r.nieuw).length} tekens</small>` : ''}</td></tr>`).join('')}</tbody></table></div>`;
    d.innerHTML = `<div class="k-kop"><span class="k-type">${esc(v.soort || 'voorstel')}</span><b>${esc(v.titel || 'Voorstel')}</b><span class="k-check">${items.length} item${items.length === 1 ? '' : 's'}</span></div>
      ${v.toelichting ? `<p class="k-toel">${esc(v.toelichting)}</p>` : ''}${body}
      <div class="k-acties"><button type="button" data-a="json">Kopieer als JSON</button></div>`;
    d.querySelector('[data-a=json]').addEventListener('click', e => kopieer(JSON.stringify(v, null, 2), e.target));
    return d;
  }
  async function kopieer(t, knop) {
    try { await navigator.clipboard.writeText(t); } catch (e) {
      const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (x) {} ta.remove(); }
    const o = knop.textContent; knop.textContent = 'Gekopieerd'; setTimeout(() => { knop.textContent = o; }, 1400);
  }
  async function redactie(p, kaart, knop) {
    if (!ASK) return; knop.disabled = true; knop.textContent = 'Redactie leest…';
    const prompt = `Je bent de eindredacteur van Slagio. Beoordeel deze social post streng tegen de stijlgids en de vakkennis hieronder, en lever een verbeterde versie.
Let op: hook op slide 1 (max 8 woorden, herkenbaar), één gedachte per slide, alles klopt met de app-data (verander vraag, opties en juist antwoord niet inhoudelijk), één duidelijke actie, geen AI-taal.
Automatische controle vond: ${JSON.stringify(controleer(p.onderschrift || '', { caption: true }))}.

STIJLGIDS:
${K.docs?.stijlgids || ''}

SOCIAL-KENNIS:
${(K.docs?.brein || '').split('## Social')[1]?.split('## Vindbaarheid')[0] || ''}

POST:
${JSON.stringify(p)}

Antwoord met alleen JSON: {"oordeel": "één zin", "post": { dezelfde vorm als POST }}`;
    try {
      const r = await ASK.json(prompt, { cache: false });
      if (r?.post?.slides || r?.post?.scenes) { const nieuw = postKaart({ ...p, ...r.post }, { redactie: r.oordeel }); nieuw.dataset.id = kaart.dataset.id || ''; kaart.replaceWith(nieuw); bewaarKaart(kaart, { t: 'post', p: { ...p, ...r.post }, redactie: r.oordeel }); }
      else { knop.textContent = 'Geen verbetering ontvangen'; }
    } catch (e) { knop.disabled = false; knop.textContent = e.code === 'cancelled' ? 'Redactieronde' : (FOUT[e.code] || 'Mislukt, probeer opnieuw'); }
  }
  // Kaarten horen bij een beurt, zodat ze na herladen terugkomen.
  function bewaarKaart(oud, spec) {
    for (const t of turns) { const i = (t.kaarten || []).findIndex(k => k._id === oud.dataset.id); if (i >= 0) { spec._id = oud.dataset.id; t.kaarten[i] = spec; } }
    store.set('gesprek', turns.slice(-24));
  }
  function maakKaart(spec) {
    const el = spec.t === 'post' ? postKaart(spec.p, { redactie: spec.redactie }) : voorstelKaart(spec.p);
    el.dataset.id = spec._id; return el;
  }

  // ── Instructie ───────────────────────────────────────────────────────────
  function kennisKort() {
    const s = K.seo || {}, telling = {};
    (s.paginas || []).forEach(p => p.issues.forEach(([, t]) => { const k = t.replace(/\d+/g, '#'); telling[k] = (telling[k] || 0) + 1; }));
    return JSON.stringify({ totalen: K.totalen, contentgaten: (K.gaten || []).slice(0, 8).map(g => `${g.niveau} ${g.vak} · ${g.domein} · ${g.redenen.join(', ')}`),
      seo: { score: s.score, paginas: (s.paginas || []).length, problemen: telling }, socialFormats: K.social?.formats,
      gepost: (K.social?.geschiedenis || []).map(w => `${w.week}: ${w.posts.map(p => p[1]).join(' | ')}`) });
  }
  function instructie(stem) {
    const M = MODI[modus] || MODI.auto;
    const tools = TOOLMAX ? `
WERKTOOLS: inhoud, vragen, contentGaten en seoAudit halen feiten uit de kennisbank; gebruik ze in plaats van te gokken. Maak je een post, gebruik toonPost; maak je vragen, begrippen of SEO-teksten, gebruik toonVoorstel. Beide geven een stijlcontrole terug: los elk punt op en toon opnieuw tot die schoon is (hooguit twee keer). Verwijs in je tekst naar de kaart in plaats van alles te herhalen. wijsAan brengt de eigenaar naar een sectie van de briefing.` : `
Je hebt nu geen tools. Werk met de samenvatting van de kennisbank hieronder en zeg eerlijk wat je niet kunt inzien.`;
    const spraak = stem ? `
SPRAAK: je antwoord wordt hardop voorgelezen. Hooguit 70 woorden, gewone spreektaal, geen opsommingen, geen opmaak, geen tabellen, geen emoji. Rond getallen af. Stel hooguit één wedervraag.` : `
Opmaak: gewone zinnen, **vet** voor kernpunten, lijstjes met "- ". Standaard kort (max ~180 woorden), langer als het werk dat vraagt (posts, voorstellen, plannen).`;
    return `Je bent Jarvis, de vaste specialist van Slagio (slagio.nl, gratis examentraining voor havo, vwo en vmbo). Je werkt voor de eigenaar en bent meester in vier dingen: analyse van het gebruik, de content in de app, social media voor leerlingen en vindbaarheid in Google en AI-assistenten. Je praat Nederlands.
FOCUS: ${M.focus}${tools}${spraak}

VAKKENNIS:
${K.docs?.brein || ''}

STIJLGIDS SOCIAL:
${K.docs?.stijlgids || ''}

KENNISBANK (samenvatting, gebouwd ${String(K.gebouwd || '').slice(0, 10)}):
${kennisKort()}

GEBRUIKSDATA (definities: "betrokken" = deed iets echts; "dagelijks" = [datum, bezoekers, betrokken, nieuw, oefensessies]; prognose = betrokken dagbezoeken per week):
${J.compact ? J.compact() : '{}'}`;
  }

  // ── Tools voor Claude ────────────────────────────────────────────────────
  function maakTools(bubbel, stappen, kaartenVoorBeurt) {
    const stap = t => { stappen.hidden = false; stappen.insertAdjacentHTML('beforeend', `<li>${esc(t)}</li>`); scrollOnder(); };
    const niv = { type: 'string', enum: ['havo', 'vwo', 'vmbo'] };
    let anker = bubbel;
    const plaats = el => { anker.after(el); anker = el; scrollOnder(); };
    const lijst = [
      { name: 'toonPost', description: 'Toont een social post als echte slides in het gesprek (Slagio-huisstijl) en geeft een stijlcontrole terug. Gebruik voor elke post, carrousel, story of reel die je maakt.',
        inputSchema: { type: 'object', required: ['format', 'onderschrift'], properties: {
          format: { type: 'string', enum: ['carrousel', 'post', 'story', 'reel'] }, titel: { type: 'string' }, niveau: niv, vak: { type: 'string', description: 'Vaknaam zoals in de app' },
          slides: { type: 'array', description: 'Voor carrousel/post/story. type: cover|vraag|antwoord|tekst|cta. Bij vraag/antwoord: opties (4) en juist (0-3), exact uit de app-data.',
            items: { type: 'object', properties: { type: { type: 'string' }, label: { type: 'string' }, kop: { type: 'string' }, tekst: { type: 'string' }, opties: { type: 'array', items: { type: 'string' } }, juist: { type: 'integer' } } } },
          scenes: { type: 'array', description: 'Voor een reel: scènes met seconde, wat je ziet, en de tekst in beeld.', items: { type: 'object', properties: { sec: { type: 'number' }, beeld: { type: 'string' }, tekst: { type: 'string' } } } },
          onderschrift: { type: 'string', description: 'Volledig onderschrift inclusief 5-8 hashtags onderaan' } } },
        execute: i => { const spec = { t: 'post', p: i, _id: 'k' + Date.now() + Math.random().toString(36).slice(2, 6) }; kaartenVoorBeurt.push(spec); plaats(maakKaart(spec)); stap(`Post getoond: ${i.titel || i.format}`);
          const pr = [...new Set(controleer(i.onderschrift, { caption: true }).concat(...(i.slides || []).map(s => controleer([s.kop, s.tekst].join('\n')))))];
          return pr.length ? { stijlcontrole: pr, opdracht: 'Los deze punten op en toon de post opnieuw.' } : { stijlcontrole: 'schoon' }; } },
      { name: 'toonVoorstel', description: 'Toont een voorstel als kaart die de eigenaar kan kopiëren: nieuwe oefenvragen (app-formaat v,o,c,d,u,uo), begrippen (t,d) of SEO-teksten (pad, oud, nieuw). Geeft een stijlcontrole terug.',
        inputSchema: { type: 'object', required: ['soort', 'titel', 'items'], properties: { soort: { type: 'string', enum: ['vragen', 'begrippen', 'seo', 'tekst'] }, titel: { type: 'string' }, toelichting: { type: 'string' },
          niveau: niv, vak: { type: 'string' }, domein: { type: 'string' }, items: { type: 'array', items: { type: 'object' } } } },
        execute: i => { const spec = { t: 'voorstel', p: i, _id: 'k' + Date.now() + Math.random().toString(36).slice(2, 6) }; kaartenVoorBeurt.push(spec); plaats(maakKaart(spec)); stap(`Voorstel getoond: ${i.titel}`);
          const pr = [...new Set((i.items || []).flatMap(x => controleer(Object.values(x).flat().join('\n'))))]; return pr.length ? { stijlcontrole: pr } : { stijlcontrole: 'schoon' }; } },
      { name: 'contentGaten', description: 'Geeft de contentgaten in de app, geordend op prioriteit (lege domeinen, weinig vragen, geen samenvatting of begrippen).',
        inputSchema: { type: 'object', properties: { niveau: niv, max: { type: 'integer' } } }, execute: i => { stap('Contentgaten bekeken'); return gatenTool(i); } },
      { name: 'vragen', description: 'Geeft echte, los bruikbare oefenvragen en begrippen uit de app voor één vak (steekproef). Gebruik dit voor examenvraag-posts en om vraagkwaliteit te beoordelen. Verzin nooit zelf een vraag voor een post.',
        inputSchema: { type: 'object', required: ['niveau', 'vak'], properties: { niveau: niv, vak: { type: 'string', description: 'id (bv. bi) of naam' }, domein: { type: 'string' }, zoek: { type: 'string' }, aantal: { type: 'integer' } } },
        execute: i => { stap(`Vragen bekeken · ${i.vak} ${i.niveau || ''}`); return vragenTool(i); } },
      { name: 'seoAudit', description: 'Zonder pad: de SEO-score, problemen per soort en de slechtste pagina’s. Met pad: title, description, h1, woorden en problemen van één pagina.',
        inputSchema: { type: 'object', properties: { pad: { type: 'string' }, probleem: { type: 'string', description: 'filter, bv. "verouderd" of "dunne"' } } },
        execute: i => { stap(i.pad ? `Pagina bekeken · ${i.pad}` : 'SEO-audit bekeken'); return seoTool(i); } },
      { name: 'inhoud', description: 'Zonder vak: alle vakken van een niveau met aantallen. Met vak: de domeinen met CE/SE, oefenvragen, oud-examenvragen, begrippen en samenvatting.',
        inputSchema: { type: 'object', required: ['niveau'], properties: { niveau: niv, vak: { type: 'string' } } }, execute: i => { stap(`Inhoud bekeken · ${i.niveau}${i.vak ? ' ' + i.vak : ''}`); return inhoudTool(i); } },
      { name: 'wijsAan', description: 'Scrollt de briefing naar een sectie en licht die op, als bewijs bij je antwoord. Hooguit één keer.',
        inputSchema: { type: 'object', required: ['sectie'], properties: { sectie: { type: 'string', enum: (J.SECT || []).map(s => s[0]).concat('kansen') } } },
        execute: i => { J.gaNaar?.(String(i.sectie)); return 'ok'; } },
    ];
    return TOOLMAX ? lijst.slice(0, TOOLMAX) : undefined;
  }

  // ── Gesprek ──────────────────────────────────────────────────────────────
  const sheet = $('#sheet'), msgs = $('#msgs'), box = $('#box'), send = $('#send');
  const FOUT = { not_granted: 'Je hebt Jarvis geen toestemming gegeven om Claude te gebruiken.', sampling_disabled: 'Claude is niet beschikbaar voor dit account.', rate_limited: 'Even te veel vragen. Probeer het zo opnieuw.',
    session_expired: 'Log opnieuw in bij Claude.', refused: 'Deze vraag kan ik niet beantwoorden. Formuleer hem anders.', prompt_too_large: 'Het gesprek werd te lang. Wis het gesprek en vraag opnieuw.',
    empty_completion: 'Er kwam geen antwoord. Probeer het korter.', upstream_error: 'De verbinding viel weg. Probeer het opnieuw.', invalid_json: 'Het antwoord kwam niet goed door. Probeer het opnieuw.' };
  const mdChat = s => { const e = esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); const out = []; let list = null;
    e.split('\n').forEach(l => { const m = l.match(/^\s*(?:[-•]|\d+\.)\s+(.*)/); if (m) { if (!list) { list = []; out.push(list); } list.push(m[1]); } else { list = null; if (l.trim()) out.push(/^#{1,4}\s/.test(l) ? `<b>${l.replace(/^#+\s/, '')}</b>` : l); } });
    return out.map(x => Array.isArray(x) ? `<ul>${x.map(i => `<li>${i}</li>`).join('')}</ul>` : `<p>${x}</p>`).join(''); };
  const scrollOnder = () => { msgs.scrollTop = msgs.scrollHeight; };
  function addMsg(role, html, cls = '') { const d = document.createElement('div'); d.className = `msg ${role} ${cls}`; if (role === 'u') d.textContent = html; else d.innerHTML = html; msgs.appendChild(d); scrollOnder(); return d; }
  function renderModi() {
    $('#modi').innerHTML = Object.entries(MODI).map(([k, m]) => `<button type="button" role="radio" aria-checked="${k === modus}" data-m="${k}">${m.l}</button>`).join('');
    $('#diep').setAttribute('aria-pressed', diep);
  }
  function renderChat() {
    msgs.innerHTML = '';
    if (!turns.length) {
      addMsg('j', `<p>${modus === 'auto' ? 'Waar wil je aan werken? Ik ken je cijfers, alle vakken en domeinen, de contentgaten, de SEO van elke pagina en wat er al gepost is.' : `<b>${MODI[modus].l}.</b> ${esc(MODI[modus].intro)}`}</p>`);
      const c = document.createElement('div'); c.className = 'chips'; c.innerHTML = MODI[modus].chips.map(v => `<button type="button">${esc(v)}</button>`).join('');
      c.addEventListener('click', e => { const b = e.target.closest('button'); if (b) vraag(b.textContent); }); msgs.appendChild(c);
    }
    turns.forEach(t => { addMsg(t.role === 'user' ? 'u' : 'j', t.role === 'user' ? t.content : mdChat(t.content)); (t.kaarten || []).forEach(k => msgs.appendChild(maakKaart(k))); });
    scrollOnder();
  }
  function openChat() { sheet.hidden = false; document.body.classList.add('chat-open'); renderModi(); renderChat(); setTimeout(() => box.focus(), 30); }
  function sluitChat() { sheet.hidden = true; document.body.classList.remove('chat-open'); ctl?.abort(); }

  // Geschiedenis die in 64 KB past: instructie altijd, oudste beurten vallen eerst weg.
  function invoer(stem) {
    const inst = instructie(stem);
    const hist = turns.map(t => ({ role: t.role, content: t.role === 'assistant' && t.kaarten?.length
      ? `${t.content}\n\n[Getoond: ${t.kaarten.map(k => JSON.stringify(k.p).slice(0, 700)).join(' | ')}]` : t.content }));
    let h = hist.slice(-12);
    while (h.length > 1 && bytes(inst) + h.reduce((a, t) => a + bytes(t.content), 0) > 60000) h = h.slice(1);
    if (h[0]?.role === 'assistant') h = h.slice(1);
    return [{ role: 'user', content: inst }, ...h];
  }

  async function vraag(q, opt = {}) {
    q = String(q || '').trim(); if (!ASK || !q || ctl) return null;
    if (!opt.stem && sheet.hidden) openChat();
    if (msgs.querySelector('.chips')) msgs.innerHTML = '';
    turns.push({ role: 'user', content: q }); addMsg('u', q); box.value = ''; groei();
    const bubbel = addMsg('j', '<p>Aan het nadenken…</p>', 'think');
    const stappen = document.createElement('ul'); stappen.className = 'stappen'; stappen.hidden = true; bubbel.before(stappen);
    const kaarten = [];
    ctl = new AbortController(); zetSend(true); opt.onStart?.();
    let tekst = '';
    try {
      const tools = maakTools(bubbel, stappen, kaarten);
      const r = await ASK(invoer(opt.stem), { signal: ctl.signal, ...(tools ? { tools } : { cache: false }),
        modelTier: opt.stem ? 'quick' : diep ? 'complex' : 'default',
        onText: ({ text, delta }) => { tekst = text; bubbel.classList.remove('think'); bubbel.innerHTML = mdChat(text); scrollOnder(); opt.onDelta?.(delta, text); } });
      tekst = r.text;
      if (r.truncated) addMsg('j', '<p>Het antwoord werd afgekapt. Vraag om een deel tegelijk.</p>', 'think');
      turns.push({ role: 'assistant', content: tekst, kaarten });
    } catch (e) {
      if (e.code === 'refused') { bubbel.remove(); tekst = ''; }
      else if (e.text) { bubbel.innerHTML = mdChat(e.text); tekst = e.text; turns.push({ role: 'assistant', content: e.text, kaarten }); }
      else { bubbel.remove(); if (kaarten.length) turns.push({ role: 'assistant', content: '(onderbroken)', kaarten }); }
      if (['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled'].includes(e.code)) zetBeschikbaar(false);
      if (e.code !== 'cancelled') addMsg('j', `<p>${esc(FOUT[e.code] || FOUT.upstream_error)}</p>`, 'think');
      if (!e.text && !kaarten.length && turns[turns.length - 1]?.role === 'user') turns.pop();
      opt.onFout?.(e);
    } finally {
      ctl = null; zetSend(false);
      turns = turns.slice(-24); store.set('gesprek', turns);
    }
    return tekst;
  }
  function zetSend(bezig) { send.classList.toggle('stop', bezig); send.textContent = bezig ? '■' : '↑'; send.setAttribute('aria-label', bezig ? 'Stop' : 'Verstuur'); }
  function groei() { box.style.height = 'auto'; box.style.height = Math.min(140, box.scrollHeight) + 'px'; }

  $('#ask').addEventListener('click', () => sheet.hidden ? openChat() : sluitChat());
  $('#close').addEventListener('click', sluitChat);
  $('#wis').addEventListener('click', () => { ctl?.abort(); turns = []; store.set('gesprek', []); renderChat(); });
  send.addEventListener('click', () => { if (ctl) ctl.abort(); else vraag(box.value); });
  box.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); if (!ctl) vraag(box.value); } });
  box.addEventListener('input', groei);
  $('#modi').addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (!b) return; modus = b.dataset.m; store.set('modus', modus); renderModi(); if (!turns.length) renderChat(); });
  $('#diep').addEventListener('click', () => { diep = !diep; store.set('diep', diep); renderModi(); });

  // ── Stem ─────────────────────────────────────────────────────────────────
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const TTS = 'speechSynthesis' in window ? window.speechSynthesis : null;
  const stemEl = $('#stem'), orbCv = $('#orb'), stat = $('#stem-status'), jijEl = $('#stem-jij'), hijEl = $('#stem-hij');
  let micOk = !!SR, gesprekAan = false, rec = null, fase = 'rust', energie = 0, doel = 0, spreekRij = 0, streamKlaar = true, buffer = '';
  let stemKeuze = store.get('stem') || '';
  const FASE = { get rust() { return micOk ? 'Tik op de bol om te praten' : 'Typ hieronder, Jarvis praat terug'; }, luistert: 'Ik luister', denkt: 'Even denken', spreekt: 'Tik om te onderbreken' };

  function stemmen() { return TTS ? TTS.getVoices().filter(v => /^nl(-|_|$)/i.test(v.lang)) : []; }
  function kiesStem() {
    const vs = stemmen(); if (!vs.length) return null;
    return vs.find(v => v.voiceURI === stemKeuze) || vs.find(v => /google|neural|natural|premium|enhanced/i.test(v.name)) || vs.find(v => /nl-NL/i.test(v.lang)) || vs[0];
  }
  function vulStemmen() {
    const sel = $('#stem-kies'), vs = stemmen();
    sel.hidden = vs.length < 2;
    sel.innerHTML = vs.map(v => `<option value="${esc(v.voiceURI)}"${v === kiesStem() ? ' selected' : ''}>${esc(v.name.replace(/\s*\(.*\)$/, ''))}</option>`).join('');
  }
  TTS?.addEventListener?.('voiceschanged', vulStemmen);
  $('#stem-kies').addEventListener('change', e => { stemKeuze = e.target.value; store.set('stem', stemKeuze); });

  const spreekbaar = t => t.replace(/\*\*/g, '').replace(/[#*_`>]/g, '').replace(/\[[^\]]*\]\([^)]*\)/g, '').replace(/\p{Extended_Pictographic}/gu, '').replace(/\s+/g, ' ').trim();
  function zeg(zin, laatste) {
    if (!TTS || !zin) { if (laatste) naSpreken(); return; }
    const u = new SpeechSynthesisUtterance(zin); const v = kiesStem();
    if (v) u.voice = v; u.lang = v?.lang || 'nl-NL'; u.rate = 1.04; u.pitch = 1;
    u.onstart = () => { zetFase('spreekt'); doel = .55; };
    u.onboundary = () => { doel = .5 + Math.random() * .5; };
    u.onend = u.onerror = () => { spreekRij--; doel = .15; if (spreekRij <= 0 && streamKlaar) naSpreken(); };
    spreekRij++; TTS.speak(u);
  }
  function naSpreken() { spreekRij = 0; if (!gesprekAan) return zetFase('rust'); if (micOk) setTimeout(() => { if (gesprekAan && fase !== 'luistert') luister(); }, 350); else zetFase('rust'); }
  function zetFase(f) {
    fase = f; stemEl.dataset.fase = f; stat.textContent = FASE[f];
    $('#orb-knop').setAttribute('aria-label', f === 'luistert' ? 'Stop met luisteren' : f === 'spreekt' ? 'Onderbreek Jarvis' : 'Begin met praten');
  }
  function luister() {
    if (!SR || !micOk) { zetFase('rust'); $('#stem-typ').hidden = false; $('#stem-in').focus(); return; }
    stopSpreken();
    try { rec?.abort(); } catch (e) {}
    rec = new SR(); rec.lang = 'nl-NL'; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
    let definitief = '';
    rec.onstart = () => { zetFase('luistert'); jijEl.textContent = ''; doel = .25; };
    rec.onsoundstart = () => { doel = .45; };
    rec.onresult = e => { let tus = ''; for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i]; if (r.isFinal) definitief += r[0].transcript; else tus += r[0].transcript; }
      jijEl.textContent = (definitief + ' ' + tus).trim(); doel = .4 + Math.random() * .45; };
    rec.onerror = e => {
      if (['not-allowed', 'service-not-allowed', 'audio-capture'].includes(e.error)) { micOk = false; melding('De microfoon is hier niet beschikbaar. Typ je vraag; Jarvis praat wel terug.'); $('#stem-typ').hidden = false; }
      else if (e.error === 'no-speech') melding('Ik hoorde niets. Tik op de bol en probeer het opnieuw.');
    };
    rec.onend = () => { rec = null; const q = definitief.trim(); if (q) stuurStem(q); else if (fase === 'luistert') zetFase('rust'); };
    try { rec.start(); } catch (e) { micOk = false; $('#stem-typ').hidden = false; zetFase('rust'); }
  }
  function stopSpreken() { if (TTS && (TTS.speaking || TTS.pending)) TTS.cancel(); spreekRij = 0; }
  function melding(t) { hijEl.textContent = t; }
  async function stuurStem(q) {
    jijEl.textContent = q; hijEl.textContent = ''; zetFase('denkt'); buffer = ''; streamKlaar = false;
    const tekst = await vraag(q, { stem: true,
      onDelta: (delta, heel) => {
        hijEl.textContent = spreekbaar(heel).slice(-420);
        buffer += delta;
        let m;
        while ((m = buffer.match(/^([\s\S]*?[.!?…])\s+(?=\S)/)) && m[1].length > 12) { zeg(spreekbaar(m[1]), false); buffer = buffer.slice(m[0].length); }
      },
      onFout: e => { if (e.code !== 'cancelled') melding(FOUT[e.code] || FOUT.upstream_error); } });
    streamKlaar = true;
    if (tekst == null) return zetFase('rust');
    const rest = spreekbaar(buffer); buffer = '';
    if (rest) zeg(rest, true); else if (spreekRij <= 0) naSpreken();
    if (!TTS) zetFase('rust');
  }
  function openStem() {
    if (!ASK) return;
    stemEl.hidden = false; document.body.classList.add('stem-open'); gesprekAan = true; vulStemmen();
    $('#stem-typ').hidden = micOk; hijEl.textContent = micOk ? '' : 'Spraakherkenning werkt niet in deze browser. Typ je vraag; Jarvis praat terug.';
    jijEl.textContent = ''; zetFase('rust'); startOrb();
    if (micOk) luister(); else $('#stem-in').focus();
  }
  function sluitStem() { gesprekAan = false; try { rec?.abort(); } catch (e) {} stopSpreken(); ctl?.abort(); stemEl.hidden = true; document.body.classList.remove('stem-open'); stopOrb(); }
  $('#orb-knop').addEventListener('click', () => {
    if (fase === 'luistert') { try { rec?.stop(); } catch (e) {} return; }
    if (fase === 'spreekt' || fase === 'denkt') { stopSpreken(); ctl?.abort(); streamKlaar = true; }
    luister();
  });
  $('#stem-sluit').addEventListener('click', sluitStem);
  $('#stem-typ').addEventListener('submit', e => { e.preventDefault(); const q = $('#stem-in').value.trim(); if (!q || ctl) return; $('#stem-in').value = ''; stopSpreken(); stuurStem(q); });
  $('#open-stem').addEventListener('click', openStem);
  // Dicteren in het tekstveld
  $('#dicteer').addEventListener('click', () => {
    if (!SR || !micOk) return;
    const r = new SR(); r.lang = 'nl-NL'; r.interimResults = true; const basis = box.value ? box.value + ' ' : '';
    const knop = $('#dicteer'); knop.classList.add('aan');
    r.onresult = e => { box.value = basis + [...e.results].map(x => x[0].transcript).join(''); groei(); };
    r.onerror = e => { if (['not-allowed', 'service-not-allowed', 'audio-capture'].includes(e.error)) { micOk = false; knop.hidden = true; addMsg('j', '<p>De microfoon is hier niet beschikbaar. Typen werkt wel.</p>', 'think'); } };
    r.onend = () => { knop.classList.remove('aan'); box.focus(); };
    try { r.start(); } catch (e) { knop.classList.remove('aan'); }
  });

  // ── De bol ───────────────────────────────────────────────────────────────
  let orbRaf = 0, orbPts = null;
  function startOrb() {
    const cx = orbCv.getContext('2d'); if (!cx) return;
    const N = 520; orbPts = [];
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = Math.PI * (3 - Math.sqrt(5)) * i; orbPts.push([Math.cos(th) * r, y, Math.sin(th) * r, Math.random() * 6.28]); }
    let rot = 0, t0 = performance.now();
    const kleur = () => getComputedStyle(stemEl).getPropertyValue('--orb').trim() || '#ff8a3d';
    function frame(now) {
      const dpr = Math.min(2, devicePixelRatio || 1), b = orbCv.getBoundingClientRect(), W = b.width, H = b.height;
      if (orbCv.width !== Math.round(W * dpr)) { orbCv.width = Math.round(W * dpr); orbCv.height = Math.round(H * dpr); }
      const t = (now - t0) / 1000;
      if (fase === 'denkt') doel = .3 + .12 * Math.sin(t * 5);
      if (fase === 'rust') doel = .08 + .04 * Math.sin(t * 1.4);
      energie += (doel - energie) * (fase === 'spreekt' ? .22 : .1); doel *= fase === 'spreekt' ? .97 : 1;
      rot += (fase === 'denkt' ? .022 : .006) * (REDUCE.matches ? 0 : 1);
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H);
      const R = Math.min(W, H) * .34 * (1 + energie * .18), k = kleur();
      const g = cx.createRadialGradient(W / 2, H / 2, R * .1, W / 2, H / 2, Math.min(W, H) / 2);
      g.addColorStop(0, k + '55'); g.addColorStop(.45, k + '18'); g.addColorStop(1, 'transparent');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      const cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(.35), st = Math.sin(.35);
      for (const [x, y, z, ph] of orbPts) {
        const golf = 1 + energie * .22 * Math.sin(ph + t * (fase === 'spreekt' ? 7 : 3) + y * 4);
        let X = x * cr - z * sr, Z = x * sr + z * cr, Y = y * ct - Z * st; Z = y * st + Z * ct;
        const s = 1 / (1.9 - Z * .6), px = W / 2 + X * R * golf * s * 1.5, py = H / 2 + Y * R * golf * s * 1.5;
        cx.globalAlpha = Math.max(.08, (Z + 1.2) / 2.2) * (.55 + energie * .6); cx.fillStyle = Z > .2 ? '#fff' : k;
        cx.beginPath(); cx.arc(px, py, (Z + 1.4) * .9 * (1 + energie * .4), 0, 6.283); cx.fill();
      }
      cx.globalAlpha = 1;
      orbRaf = REDUCE.matches && fase === 'rust' ? 0 : requestAnimationFrame(frame);
    }
    cancelAnimationFrame(orbRaf); orbRaf = requestAnimationFrame(frame);
  }
  function stopOrb() { cancelAnimationFrame(orbRaf); orbRaf = 0; }
  new MutationObserver(() => { if (!stemEl.hidden && !orbRaf) startOrb(); }).observe(stemEl, { attributes: true, attributeFilter: ['data-fase'] });

  // ── Kansen: wat de kennisbank vindt, ook zonder Claude zichtbaar ──────────
  const LABEL = [[/verouderd examenjaar in title/, 'Oud examenjaar in title of description'], [/verouderd examenjaar in de tekst/, 'Oud examenjaar in de tekst'], [/dunne pagina/, 'Dunne pagina, minder dan 250 woorden'],
    [/^title .* tekens \(Google/, 'Title langer dan Google toont'], [/title kort/, 'Title te kort'], [/description .* zichtbaar/, 'Description te lang'], [/description kort/, 'Description te kort'], [/geen meta description/, 'Geen description'],
    [/h1/, 'Geen of meerdere h1'], [/structured data/, 'Geen structured data'], [/og:image/, 'Geen deelafbeelding'], [/interne links/, 'Weinig interne links'], [/sitemap/, 'Niet in de sitemap'], [/zelfde title/, 'Dubbele title']];
  const label = t => (LABEL.find(([re]) => re.test(t)) || [0, t])[1];
  function renderKansen() {
    const host = $('#kansen-grid'); if (!host || !K.seo) return;
    const groepen = {};
    K.seo.paginas.forEach(p => p.issues.forEach(([e, t]) => { const l = label(t); (groepen[l] ||= { e, n: 0 }).n++; groepen[l].e = Math.max(groepen[l].e, e); }));
    const gs = Object.entries(groepen).sort((a, b) => b[1].e * b[1].n - a[1].e * a[1].n);
    const max = Math.max(1, ...gs.map(g => g[1].n));
    const oud = groepen['Oud examenjaar in title of description']?.n || 0, dun = groepen['Dunne pagina, minder dan 250 woorden']?.n || 0;
    const zonderDom = (K.seo.dekking || []).filter(d => !d.domeinpaginas);
    const T = K.totalen || {}, gaten = K.gaten || [];
    const nf = n => Number(n || 0).toLocaleString('nl-NL');
    const knop = (m, v, t) => `<button type="button" class="kans-knop" data-modus="${m}" data-vraag="${esc(v)}" hidden>${esc(t)}</button>`;
    host.innerHTML = `
      <div class="card kans"><div class="kans-kop"><h3 class="chart-title">Vindbaarheid</h3><span class="kans-score" data-s="${K.seo.score >= 85 ? 'ok' : K.seo.score >= 65 ? 'let-op' : 'actie'}">${K.seo.score}<small>/100</small></span></div>
        <p class="chart-sum">${oud ? `<b>${oud} pagina's</b> noemen nog een oud examenjaar in title of description, terwijl leerlingen nu op ${K.examenJaar} zoeken. ` : ''}${dun ? `${dun} pagina's zijn te dun om te ranken.` : ''}${!oud && !dun ? `${K.seo.paginas.length} pagina's gecontroleerd.` : ''}</p>
        <ul class="kans-lijst">${gs.slice(0, 6).map(([l, g]) => `<li><span>${esc(l)}</span><i style="--w:${Math.round(g.n / max * 100)}%" data-e="${g.e}"></i><b class="num">${g.n}</b></li>`).join('')}</ul>
        ${zonderDom.length ? `<p class="fnote">Zonder domeinpagina's: ${esc([...new Set(zonderDom.map(d => d.niveau.toUpperCase()))].map(n => `${zonderDom.filter(d => d.niveau.toUpperCase() === n).length} vakken ${n}`).join(', '))}.</p>` : ''}
        ${knop('vindbaar', `Herschrijf title en description van de vakpagina's met een oud examenjaar. Begin met havo en lever ze als voorstel.`, 'Laat Jarvis nieuwe titles schrijven')}</div>
      <div class="card kans"><div class="kans-kop"><h3 class="chart-title">Content in de app</h3></div>
        <div class="kans-tot">${Object.entries(T).map(([n, t]) => `<div><small>${n.toUpperCase()}</small><b class="num">${nf(t.vragen)}</b><span>vragen · ${nf(t.begrippen)} begrippen</span></div>`).join('')}</div>
        <p class="chart-sum">${gaten.length ? `${gaten.length} domein${gaten.length === 1 ? '' : 'en'} met een gat. Eerst:` : 'Geen lege of dunne domeinen gevonden.'}</p>
        <ul class="list">${gaten.slice(0, 4).map(g => `<li><b>${esc(g.niveau.toUpperCase())} ${esc(g.vak)}</b> · ${esc(g.domein)}<br><span class="sub">${esc(g.redenen.join(', '))}</span></li>`).join('')}</ul>
        ${gaten.length ? knop('content', `Vul het belangrijkste contentgat: schrijf 5 oefenvragen in het app-formaat voor ${gaten[0].niveau} ${gaten[0].vak}, ${gaten[0].domein}.`, 'Laat Jarvis het eerste gat vullen') : ''}</div>
      <div class="card kans"><div class="kans-kop"><h3 class="chart-title">Social</h3></div>
        <p class="chart-sum">${(K.social?.geschiedenis || []).length ? `${K.social.geschiedenis.reduce((a, w) => a + w.posts.length, 0)} posts gepland in ${K.social.geschiedenis.length} weken.` : 'Nog geen weken in de contentfabriek.'} Jarvis maakt posts met echte vragen uit de app en toetst ze aan de stijlgids.</p>
        <ul class="list">${(K.social?.formats || []).map(f => `<li><b>${esc(f[0])}</b><br><span class="sub">${esc(f[1])}</span></li>`).join('')}</ul>
        ${knop('social', 'Maak een examenvraag-carrousel met een echte vraag uit de app, voor het vak met het eerste examen.', 'Laat Jarvis een post maken')}</div>`;
    host.querySelectorAll('[data-vraag]').forEach(b => b.addEventListener('click', () => { modus = b.dataset.modus; store.set('modus', modus); openChat(); vraag(b.dataset.vraag); }));
  }
  renderKansen();

  // ── Beschikbaarheid ──────────────────────────────────────────────────────
  function zetBeschikbaar(ja) {
    $('#ask').hidden = !ja; document.body.classList.toggle('can-ask', ja);
    document.querySelectorAll('[data-vraag]').forEach(b => { b.hidden = !ja; });
    $('#open-stem').hidden = !ja; $('#dicteer').hidden = !ja || !SR;
    if (!ja) { ASK = null; if (!sheet.hidden) renderChat(); }
  }
  J.kan = () => !!ASK; J.vraag = q => vraag(q); J.stem = () => openStem();
  J.escape = () => { if (!stemEl.hidden) sluitStem(); else if (!sheet.hidden) sluitChat(); };
  J._test = { controleer, seoTool, gatenTool, vragenTool, inhoudTool, postKaart, voorstelKaart, instructie, invoer, openChat, openStem };
  (async () => {
    try {
      if (!window.claude?.use) return;
      const s = await window.claude.use('sample'); if (!s) return;
      ASK = s; const lim = await s.limits().catch(() => null); TOOLMAX = lim?.tools?.maxCount || 0;
      zetBeschikbaar(true);
    } catch (e) {}
  })();
})();
