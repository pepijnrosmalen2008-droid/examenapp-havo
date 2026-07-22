// ═══════════════════════════════════════════════════════════════════════
// curriculum-dash.js — gedeelde renderer voor het Curriculum Dashboard (F1.5).
// Gebruikt door curriculum.html (standalone) én admin.html (tab). Eén bron.
//
// window.renderCurriculumInto(el, { vak, lb })
//   el  = container-element
//   vak = vakId (default: eerste vak met koppeling)
//   lb  = leaderboard-rijen [{vak_naam,domein_naam,correct,total}] voor foutratio
//         (optioneel; domein-niveau). Zonder lb blijven foutratio/mastery op –.
//
// Leest globals: LEERDOELEN, LO_KOPPELING, VAKKEN (uit data-<niveau>.meta.js).
//
// Nieuwe kolommen t.o.v. v1: Syllabus (conceptdekking), AI-Ready (samengesteld),
// Review (🟢 gevalideerd / 🟡 review nodig / 🔴 concept — auto, of handmatig
// via leerdoel.review).
// ═══════════════════════════════════════════════════════════════════════
(function () {
  const CSS = `
.curd{--c-bg:#f6f7f9;--c-card:#fff;--c-ink:#161a20;--c-mu:#667085;--c-line:#e7e9ee;
  --c-or:#E85C0D;--c-ok:#12a150;--c-warn:#d97706;--c-bad:#dc2626;--c-acc:#2563eb;--c-chip:#eef1f6;
  font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:var(--c-ink)}
@media(prefers-color-scheme:dark){.curd{--c-bg:#0e1116;--c-card:#171b22;--c-ink:#e8eaed;--c-mu:#9aa3af;--c-line:#252a33;--c-chip:#212632}}
.curd *{box-sizing:border-box}
.curd .c-head{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:14px}
.curd .c-sel{font:inherit;padding:6px 11px;border:1px solid var(--c-line);border-radius:9px;background:var(--c-card);color:var(--c-ink)}
.curd .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:18px}
.curd .tile{background:var(--c-card);border:1px solid var(--c-line);border-radius:13px;padding:12px 15px}
.curd .tile .v{font-size:23px;font-weight:800;letter-spacing:-.5px}.curd .tile .v.sm{font-size:18px}
.curd .tile .l{font-size:11.5px;color:var(--c-mu);margin-top:2px}
.curd .legend{display:flex;flex-wrap:wrap;gap:12px;font-size:11.5px;color:var(--c-mu);margin:0 2px 16px}
.curd .legend b{color:var(--c-ink)}
.curd .dom{background:var(--c-card);border:1px solid var(--c-line);border-radius:15px;margin-bottom:16px;overflow:hidden}
.curd .dom-h{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 15px;padding:12px 16px;border-bottom:1px solid var(--c-line)}
.curd .dom-h .dn{font-weight:800;font-size:15px}.curd .dom-h .st{font-size:11.5px;color:var(--c-mu)}.curd .dom-h .st b{color:var(--c-ink)}
.curd .scroll{overflow-x:auto}
.curd table{width:100%;border-collapse:collapse;font-size:13px;min-width:820px}
.curd th,.curd td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--c-line);vertical-align:middle}
.curd th{font-size:10.5px;text-transform:uppercase;letter-spacing:.4px;color:var(--c-mu);font-weight:700;background:var(--c-chip);white-space:nowrap}
.curd tr:last-child td{border-bottom:none}
.curd td.num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.curd .ld-t{font-weight:600}.curd .ld-id{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;color:var(--c-mu)}
.curd .chips{margin-top:3px;display:flex;gap:4px;flex-wrap:wrap}
.curd .chip{font-size:10px;padding:1px 6px;border-radius:999px;background:var(--c-chip);color:var(--c-mu);white-space:nowrap}
.curd .bar{height:5px;border-radius:4px;background:var(--c-line);overflow:hidden;min-width:54px;margin-top:4px}
.curd .bar>i{display:block;height:100%;border-radius:4px}
.curd .badge{display:inline-block;font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:999px}
.curd .b-hoog{background:rgba(220,38,38,.12);color:#dc2626}.curd .b-midden{background:rgba(217,119,6,.14);color:#b45309}.curd .b-laag{background:rgba(100,116,139,.14);color:#64748b}
.curd .sig,.curd .rev{font-weight:700;font-size:12px;white-space:nowrap}
.curd .s-gat,.curd .r-concept{color:var(--c-bad)}.curd .s-dun{color:var(--c-warn)}.curd .s-moeilijk{color:#b45309}
.curd .s-onzeker,.curd .r-review{color:var(--c-acc)}.curd .s-ok,.curd .r-val{color:var(--c-ok)}
.curd .aiw{font-weight:800}.curd .muted{color:var(--c-mu)}
.curd .note{font-size:11.5px;color:var(--c-mu);background:var(--c-chip);border-radius:10px;padding:9px 13px;margin-top:10px}
`;
  function ensureCSS() {
    if (document.getElementById('curd-css')) return;
    const s = document.createElement('style'); s.id = 'curd-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  const pct = x => Math.round(x * 100) + '%';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const norm = t => String(t || '').toLowerCase().replace(/\([^)]*\)/g, '').replace(/[«».,:?]/g, '').trim();

  function leerdoelIndex(vak) {
    const byDom = {}, byId = {};
    for (const [key, val] of Object.entries(window.LEERDOELEN || {})) {
      if (!key.startsWith(vak + '_')) continue;
      const domId = key.slice(vak.length + 1);
      byDom[domId] = val.leerdoelen || [];
      for (const ld of (val.leerdoelen || [])) byId[ld.id] = { ld, domId };
    }
    return { byDom, byId };
  }
  function koppelStats(vak) {
    const k = (window.LO_KOPPELING && window.LO_KOPPELING[vak]) || {};
    const s = {};
    for (const e of Object.values(k)) {
      const t = s[e.lo] = s[e.lo] || { n: 0, confSum: 0, over: 0, low: 0, viaSet: new Set() };
      t.n++; t.confSum += e.confidence;
      if (e.source === 'manual_override') t.over++;
      if (e.confidence < 0.70) t.low++;
      if (e.via) for (const c of String(e.via).split('+')) t.viaSet.add(norm(c));
    }
    for (const t of Object.values(s)) t.conf = t.n ? t.confSum / t.n : 0;
    return s;
  }
  // Syllabus (conceptdekking): welk deel van de concepten van dit leerdoel wordt
  // door ≥1 vraag getoetst (o.b.v. het `via`-veld van de koppelingen).
  function syllabusCoverage(ld, t) {
    const cs = (ld.concepten || []).map(norm).filter(Boolean);
    if (!cs.length) return 1;
    const covered = cs.filter(c => t && t.viaSet && t.viaSet.has(c)).length;
    return covered / cs.length;
  }
  // AI-Ready: kan dit leerdoel veilig de vraaggenerator/AI in?
  //   0.40·confidence + 0.25·syllabusdekking + 0.20·genoeg-vragen + 0.15·(1−onzeker)
  function aiReady(t, cov) {
    if (!t || !t.n) return 0;
    const enough = Math.min(1, t.n / 12);
    const lowFrac = t.low / t.n;
    return 0.40 * t.conf + 0.25 * cov + 0.20 * enough + 0.15 * (1 - lowFrac);
  }
  function reviewStatus(ld, t, ai, cov) {
    if (ld.review) { // handmatig gezet wint
      const m = { gevalideerd: ['r-val', '🟢 Gevalideerd'], review: ['r-review', '🟡 Review nodig'], concept: ['r-concept', '🔴 Concept'] };
      return m[ld.review] || m.concept;
    }
    if (!t || t.n < 6 || ai < 0.60) return ['r-concept', '🔴 Concept'];
    if (t.low > 0 || cov < 0.80 || ai < 0.85) return ['r-review', '🟡 Review nodig'];
    return ['r-val', '🟢 Gevalideerd*'];
  }
  function signaal(n, low, fout) {
    if (n < 6) return ['s-gat', '🔴 gat'];
    if (fout != null && fout > 0.40) return ['s-moeilijk', '🔥 moeilijk'];
    if (low > 0) return ['s-onzeker', '🟦 onzeker'];
    if (n < 12) return ['s-dun', '🟡 dun'];
    return ['s-ok', '🟢 gezond'];
  }

  function foutIndex(lb, vakNaam) {
    const agg = {}, out = {};
    for (const r of (lb || [])) {
      if (r.vak_naam !== vakNaam || !r.domein_naam || !r.total) continue;
      const a = agg[r.domein_naam] = agg[r.domein_naam] || { goed: 0, tot: 0, n: 0 };
      a.goed += (r.correct || 0); a.tot += (r.total || 0); a.n++;
    }
    for (const [dn, a] of Object.entries(agg)) if (a.tot) out[dn] = { fout: 1 - a.goed / a.tot, mastery: a.goed / a.tot, n: a.n };
    return out;
  }

  window.renderCurriculumInto = function (el, opts) {
    ensureCSS();
    opts = opts || {};
    const vakken = Object.keys(window.LO_KOPPELING || {});
    if (!window.LEERDOELEN || !vakken.length) { el.innerHTML = '<div class="curd"><div class="note">Kennislaag niet geladen (knowledge-*.js / knowledge-koppeling-*.js).</div></div>'; return; }
    const vak = opts.vak && vakken.includes(opts.vak) ? opts.vak : vakken[0];
    const meta = (window.VAKKEN || []).find(v => v.id === vak) || null;
    const vakNaam = meta ? meta.naam : vak;
    const FOUT = foutIndex(opts.lb, vakNaam);

    const { byDom, byId } = leerdoelIndex(vak);
    const stats = koppelStats(vak);
    const domName = {}, domTot = {};
    if (meta) for (const d of meta.domeinen) { domName[d.id] = d.naam; domTot[d.id] = (d.nSv || 0) + (d.nOe || 0); }

    // samenvatting
    const allLd = Object.keys(byId);
    let totQ = 0, confSum = 0, over = 0, gaps = 0, onzeker = 0, aiSum = 0, aiReadyN = 0;
    for (const id of allLd) {
      const t = stats[id] || { n: 0, conf: 0, over: 0, low: 0 };
      const cov = syllabusCoverage(byId[id].ld, t);
      const ai = aiReady(t, cov);
      totQ += t.n; confSum += (t.confSum || 0); over += t.over;
      if (t.n < 6) gaps++; if (t.low > 0) onzeker++;
      aiSum += ai; if (ai >= 0.85) aiReadyN++;
    }
    const gemConf = totQ ? confSum / totQ : 0;
    const gemAi = allLd.length ? aiSum / allLd.length : 0;

    const selOpts = vakken.map(id => { const v = (window.VAKKEN || []).find(x => x.id === id); return `<option value="${id}"${id === vak ? ' selected' : ''}>${esc(v ? v.naam : id)}</option>`; }).join('');
    const tiles = [
      ['Leerdoelen', allLd.length, ''], ['Gekoppelde vragen', totQ, ''],
      ['Gem. confidence', pct(gemConf), 'sm'], ['Gem. AI-Ready', pct(gemAi), 'sm'],
      ['Overrides', over, ''], ['Gaten (&lt;6)', gaps, ''], ['AI-Ready leerdoelen', aiReadyN + '/' + allLd.length, 'sm'],
    ].map(([l, v, c]) => `<div class="tile"><div class="v ${c}">${v}</div><div class="l">${l}</div></div>`).join('');

    const order = Object.keys(byDom).sort();
    const doms = order.map(domId => {
      const lds = byDom[domId];
      const tagged = lds.reduce((a, ld) => a + ((stats[ld.id] || {}).n || 0), 0);
      const total = domTot[domId] || tagged;
      const fout = FOUT[domName[domId]];
      const rows = lds.map(ld => {
        const t = stats[ld.id] || { n: 0, conf: 0, over: 0, low: 0, viaSet: new Set() };
        const cov = syllabusCoverage(ld, t);
        const ai = aiReady(t, cov);
        const [sc, sl] = signaal(t.n, t.low, fout ? fout.fout : null);
        const [rc, rl] = reviewStatus(ld, t, ai, cov);
        const rel = ld.examenrelevantie || 'laag';
        const barCol = t.n < 6 ? 'var(--c-bad)' : t.n < 12 ? 'var(--c-warn)' : 'var(--c-ok)';
        const confCol = t.conf >= 0.9 ? 'var(--c-ok)' : t.conf >= 0.75 ? 'var(--c-warn)' : 'var(--c-bad)';
        const aiCol = ai >= 0.85 ? 'var(--c-ok)' : ai >= 0.7 ? 'var(--c-warn)' : 'var(--c-bad)';
        const covCol = cov >= 0.99 ? 'var(--c-ok)' : cov >= 0.75 ? 'var(--c-warn)' : 'var(--c-bad)';
        return `<tr>
          <td><div class="ld-t">${esc(ld.titel)}</div><div class="ld-id">${ld.id}</div>
            <div class="chips"><span class="chip">${esc(ld.vaardigheid)}</span><span class="chip">${esc(ld.examenskill)}</span></div></td>
          <td class="num"><b>${t.n}</b><div class="bar"><i style="width:${Math.min(100, t.n / 20 * 100)}%;background:${barCol}"></i></div></td>
          <td class="num" style="color:${covCol};font-weight:700">${t.n ? pct(cov) : '–'}</td>
          <td class="num" style="color:${confCol};font-weight:700">${t.n ? pct(t.conf) : '–'}</td>
          <td class="num aiw" style="color:${aiCol}">${t.n ? pct(ai) : '–'}</td>
          <td class="num">${t.over || '–'}${t.low ? ` <span class="s-onzeker" title="onzekere koppelingen">·${t.low}⚠</span>` : ''}</td>
          <td class="num">${fout ? pct(fout.fout) : '<span class="muted">–</span>'}</td>
          <td><span class="badge b-${rel}">${rel}</span></td>
          <td><span class="rev ${rc}">${rl}</span></td>
          <td><span class="sig ${sc}">${sl}</span></td>
        </tr>`;
      }).join('');
      return `<div class="dom">
        <div class="dom-h"><span class="dn">${domId} · ${esc(domName[domId] || '')}</span>
          <span class="st">gekoppeld <b>${tagged}</b>/${total}</span>
          ${fout ? `<span class="st">foutratio <b>${pct(fout.fout)}</b></span><span class="st">mastery <b>${pct(fout.mastery)}</b></span><span class="st">(${fout.n} quizzes)</span>` : `<span class="st muted">foutratio: domein-niveau (leaderboard)</span>`}</div>
        <div class="scroll"><table><thead><tr>
          <th>Leerdoel</th><th class="num">Vragen</th><th class="num">Syllabus</th><th class="num">Confidence</th>
          <th class="num">AI-Ready</th><th class="num">Overrides</th><th class="num">Foutratio</th>
          <th>Gewicht</th><th>Review</th><th>Signaal</th>
        </tr></thead><tbody>${rows}</tbody></table></div>
      </div>`;
    }).join('');

    el.innerHTML = `<div class="curd">
      <div class="c-head"><select class="c-sel" data-curd-sel>${selOpts}</select>
        <span class="muted" style="font-size:12px">pilot — koppeling beschikbaar voor ${vakken.length} vak(ken)</span></div>
      <div class="tiles">${tiles}</div>
      <div class="legend">
        <span><b>Syllabus</b> = conceptdekking</span>
        <span><b>AI-Ready</b> = 0.40·conf + 0.25·syllabus + 0.20·genoeg + 0.15·zeker</span>
        <span><b>Review</b>: 🟢 gevalideerd* / 🟡 review / 🔴 concept (*auto tot menselijke sign-off)</span>
        <span><b>Foutratio</b> nu op domein-niveau</span>
      </div>
      ${doms}
      <div class="note">De statische kolommen (vragen, syllabus, confidence, AI-Ready, overrides, gewicht) komen uit de curriculum-kennislaag. <b>Foutratio/mastery</b> staan op <b>domein-niveau</b> (leaderboard); leerdoel-niveau volgt zodra quiz-events een <code>lo</code> dragen. <b>Review</b> is auto-afgeleid tot een mens de status vastzet (<code>leerdoel.review</code>).</div>
    </div>`;
    const sel = el.querySelector('[data-curd-sel]');
    if (sel) sel.onchange = () => window.renderCurriculumInto(el, { vak: sel.value, lb: opts.lb });
  };
})();
