// ═══════ EXAMENBIBLIOTHEEK ═══════
// Alle echte centrale examens van je niveau op één plek, in de app:
//  - het nieuwste examen met klok (EXAMEN_SIM, examens-2026.js)
//  - een interactief examen met nakijken (EXAMENS, examens.js)
//  - echte examenvragen om te oefenen (CE_OE, ce_data.js → openCEExamens)
//  - het Slagio-proefexamen, heel of per vraag (SLAGIO_EXAMENS, zie onderaan)
//  - het archief per jaar en tijdvak: opgaven, bijlage en correctievoorschrift
//    in de pdf-weergave van de app (openPdfViewer, lb.js)
// Bron van de pdf's: alleexamens.nl (zelfde adressen als het archief op de vakpagina).
const EB_NAMEN = { nl: 'Nederlands', wa: 'Wiskunde A', wb: 'Wiskunde B', bi: 'Biologie', sk: 'Scheikunde', na: 'Natuurkunde', en: 'Engels', ec: 'Economie', be: 'Bedrijfseconomie', gs: 'Geschiedenis', ak: 'Aardrijkskunde', mw: 'Maatschappijwetenschappen', du: 'Duits', fr: 'Frans', la: 'Latijn', gr: 'Grieks', in: 'Informatica' };
const EB_NAMEN_VMBO = { nl: 'Nederlands', en: 'Engels', du: 'Duits', fa: 'Frans', wi: 'Wiskunde', na1: 'Natuur- en scheikunde 1', na2: 'Natuur- en scheikunde 2', bi: 'Biologie', ec: 'Economie', gs: 'Geschiedenis en staatsinrichting', ak: 'Aardrijkskunde', ma: 'Maatschappijkunde' };
const EB_BIJLAGE = { nl: 'Tekstboekje', en: 'Tekstboekje', du: 'Tekstboekje', fr: 'Tekstboekje', fa: 'Tekstboekje', gs: 'Bronnenboekje', ak: 'Bronnenboekje', ec: 'Bronnenboekje', mw: 'Bronnenboekje', ma: 'Bronnenboekje', be: 'Bijlage', la: 'Tekstboekje', gr: 'Tekstboekje' };
const EB_UITWERK = { na: 1, sk: 1, bi: 1, wa: 1, wb: 1, wi: 1, na1: 1, na2: 1 };
const EB_JAREN = [2025, 2024, 2023, 2022, 2021, 2019];
let _ebVak = null;

function _ebEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function _ebNiv() { return (typeof APP_LEVEL !== 'undefined' && APP_LEVEL) || 'havo'; }
function _ebPdf(vakId, jaar, tv, type) {
  const vmbo = _ebNiv() === 'vmbo';
  const naam = (vmbo ? EB_NAMEN_VMBO : EB_NAMEN)[vakId]; if (!naam) return '';
  const lvl = vmbo ? 'VMBO-GL%20en%20TL' : _ebNiv().toUpperCase(), e = encodeURIComponent(naam);
  return `https://static.alleexamens.nl/${lvl}/${e}/${jaar}/${tv}/${e}/${e}%20${jaar}%20${tv}_${type}.pdf`;
}

function openExamenBieb(vakId) {
  const V = (typeof getVK === 'function') ? getVK() : [];
  const namen = _ebNiv() === 'vmbo' ? EB_NAMEN_VMBO : EB_NAMEN;
  const vakken = V.filter(v => namen[v.id]);
  let mijn = []; try { const r = JSON.parse(localStorage.getItem('examenapp_' + lvlCol('mijnvakken')) || '[]'); mijn = Array.isArray(r) ? r : (r.list || []); } catch (e) {}
  _ebVak = vakId || _ebVak || (ST.vak && namen[ST.vak.id] ? ST.vak.id : null) || mijn.find(id => namen[id]) || (vakken[0] && vakken[0].id);
  const el = document.getElementById('eb-inhoud'); if (!el) return;
  const kies = document.getElementById('eb-vak');
  if (kies) {
    kies.innerHTML = vakken.map(v => `<option value="${v.id}"${v.id === _ebVak ? ' selected' : ''}>${_ebEsc(v.naam)}</option>`).join('');
    kies.onchange = () => openExamenBieb(kies.value);
  }
  show('sc-examens');
  try { trackEvent('examenbieb_open', { vak: _ebVak }); } catch (e) {}
  const render = () => { el.innerHTML = _ebHtml(_ebVak); };
  render();
  // echte examenvragen (CE_OE) laden voor het aantal; daarna opnieuw tekenen
  if (typeof CE_OE === 'undefined' && typeof _ceEnsure === 'function') _ceEnsure(render);
}

function _ebHtml(vakId) {
  const niv = _ebNiv(), V = getVK(), vak = V.find(v => v.id === vakId); if (!vak) return '';
  const blokken = [];
  const sim = (typeof EXAMEN_SIM !== 'undefined' && EXAMEN_SIM[niv] && EXAMEN_SIM[niv][vakId]) || null;
  if (sim) blokken.push(`<button class="eb-actie" onclick="_ebStart('sim')"><span class="eb-ic">⏱</span><span><b>Examen ${sim.jaar} met klok</b><small>Het echte centraal examen van tijdvak ${sim.tijdvak}, met opgaven, ${sim.bijlage ? 'bijlage, ' : ''}antwoorden en een klok van ${sim.duur || 180} minuten.</small></span></button>`);
  const ex = (typeof EXAMENS !== 'undefined' && (EXAMENS[vakId] || []).filter(e => !e.niveau || e.niveau === niv)) || [];
  if (ex.length) blokken.push(`<button class="eb-actie" onclick="_ebStart('ex')"><span class="eb-ic">✍️</span><span><b>Examen ${ex[0].jaar} vraag voor vraag</b><small>${(ex[0].vragen || []).length} vragen van het echte examen in de app, met het modelantwoord na elke vraag.</small></span></button>`);
  const pe = ebProefExamen(vakId), nPe = pe ? ebProefVragen(vakId).length : 0;
  if (pe) {
    blokken.push(`<button class="eb-actie" onclick="_ebStart('pe')"><span class="eb-ic">📝</span><span><b>Slagio-proefexamen maken</b><small>Een heel examen in examenstijl: ${(pe.vragen || []).length} vragen, ${pe.max_punten || ''} punten, met figuren. Kies zelf hoe lang.</small></span></button>`);
    blokken.push(`<button class="eb-actie" onclick="_ebStart('pevr')"><span class="eb-ic">🧩</span><span><b>${nPe} examenvragen los oefenen</b><small>De vragen uit het proefexamen één voor één, met de context en figuur van de opgave en het modelantwoord met puntenverdeling.</small></span></button>`);
  }
  let nCe = null; try { if (typeof ceExamenCount === 'function') nCe = ceExamenCount(vakId); } catch (e) {}
  if (nCe) blokken.push(`<button class="eb-actie" onclick="_ebStart('ce')"><span class="eb-ic">📋</span><span><b>${nCe} echte examenvragen oefenen</b><small>Losse vragen uit oude examens, per jaar, met het antwoord uit het correctievoorschrift.</small></span></button>`);
  const bijl = EB_BIJLAGE[vakId], uitw = EB_UITWERK[vakId];
  const titel = (j, tv, wat) => `${vak.naam} ${j} tijdvak ${tv}: ${wat}`.replace(/'/g, "\\'");
  const knop = (url, label, t, cls) => `<button class="eb-pdf${cls ? ' ' + cls : ''}" onclick="openPdfViewer('${url}','${t}')">${label}</button>`;
  const rij = (j, tv) => {
    let h = knop(_ebPdf(vakId, j, tv, 'opgaven'), 'Opgaven', titel(j, tv, 'opgaven'));
    if (bijl) h += knop(_ebPdf(vakId, j, tv, 'bijlage'), bijl, titel(j, tv, bijl.toLowerCase()), 'licht');
    if (uitw) h += knop(_ebPdf(vakId, j, tv, 'uitwerkbijlage'), 'Uitwerkbijlage', titel(j, tv, 'uitwerkbijlage'), 'licht');
    h += knop(_ebPdf(vakId, j, tv, 'correctievoorschrift'), 'Antwoorden', titel(j, tv, 'antwoorden'), 'goed');
    return `<div class="eb-tv"><span>Tijdvak ${tv}</span><div class="eb-knoppen">${h}</div></div>`;
  };
  const jaren = (sim && sim.jaar > EB_JAREN[0] ? [sim.jaar] : []).concat(EB_JAREN);
  const archief = jaren.map(j => `<div class="eb-jaar"><div class="eb-jaar-kop">${j}</div>${rij(j, 'I')}${j === (sim && sim.jaar) ? '' : rij(j, 'II')}</div>`).join('');
  return `${blokken.length ? `<div class="eb-acties">${blokken.join('')}</div>` : ''}
    <h2 class="eb-h">Archief ${_ebEsc(vak.naam)} ${niv.toUpperCase()}</h2>
    <p class="eb-uitleg">De officiële examens van het CvTE. Tijdvak I is het examen in mei, tijdvak II de herkansing in juni. Ze openen hier in de app.</p>
    ${archief}
    <p class="eb-bron">Bron van de pdf's: alleexamens.nl. Werkt een pdf niet op je telefoon? Gebruik dan "open in nieuw tabblad" bovenin de weergave.</p>`;
}

function _ebStart(soort) {
  const vak = getVK().find(v => v.id === _ebVak); if (!vak) return;
  ST.vak = vak;
  try { trackEvent('examenbieb_start', { soort, vak: _ebVak }); } catch (e) {}
  if (soort === 'sim' && typeof openExamSim === 'function') openExamSim();
  else if (soort === 'ex' && typeof startExamen === 'function') startExamen();
  else if (soort === 'ce' && typeof openCEExamens === 'function') openCEExamens('sc-examens');
  else if (soort === 'pe' && typeof startProefexamen === 'function') startProefexamen();
  else if (soort === 'pevr') ebProefOpen(_ebVak);
}

// ═══════ LOSSE PROEFEXAMENVRAGEN ═══════
// De Slagio-proefexamens (proefexamen-*.js → SLAGIO_EXAMENS) los ontsloten: elke
// vraag wordt een oud-examenvraag met de context en figuur van zijn opgave en het
// modelantwoord plus puntenverdeling. Te oefenen vanuit de examenbibliotheek
// (per opgave), bij "Oud-examen stijl" van een domein en via Vraag het Slagio.
// Het domein-label in een proefexamen is vrije tekst; EB_PE_DOM koppelt het aan
// het domein van het vak. Wat niet zeker past, staat alleen in de bibliotheek.
const EB_PE_DOM = {
  havo: {
    ak: { Klimaat: 'C', Endogeen: 'C', Bevolking: 'B', Verstedelijking: 'B', Water: 'E' },
    be: { Prijsvorming: 'D', Marketing: 'D', Kostencalculatie: 'E', Financiering: 'E', Investeren: 'E', Verslaggeving: 'F' },
    bi: { A: 'A', O: 'O', M: 'M', P: 'P' },
    ec: { Markt: 'C', Kosten: 'C', Speltheorie: 'C', Conjunctuur: 'E', Geld: 'E' },
    en: { Leesvaardigheid: 'B' },
    gs: { Oorzaken: 'A', Bronnen: 'A', Chronologie: 'B', Crisis: 'B', KoudeOorlog: 'B', Dekolonisatie: 'B' },
    mw: { Vorming: 'B', Verandering: 'B', Verhouding: 'C' },
    na: { Beweging: 'C', Kracht: 'C', Energie: 'C', Elektriciteit: 'D', Geluid: 'B', Straling: 'E' },
    nl: { Leesvaardigheid: 'A', Argumentatie: 'E' },
    sk: { Stoffen: 'B', Reacties: 'C', Rekenen: 'C', Energie: 'C', Zuren: 'C', Koolstof: 'D' },
    wa: { Exponentieel: 'C', Verandering: 'D', Statistiek: 'E', Kans: 'E' },
    wb: { Functies: 'B', 'Differentiëren': 'D' }
  },
  vwo: {
    ak: { 'Systeem Aarde': 'C', Klimaat: 'C', Wereld: 'B', Leefomgeving: 'E' },
    bi: { Moleculair: 'C', Cel: 'C', Regeling: 'B', Genetica: 'E', Evolutie: 'F' },
    du: '*A', en: '*A', fr: '*A',
    nl: { Argumentatie: 'D', Drogredenen: 'D', '*': 'A' },
    ec: { Markt: 'D', Marktvormen: 'D', 'Ruil over tijd': 'E' },
    gr: { Vertalen: 'A', Grammatica: 'A', Stijl: 'A', Tekstbegrip: 'A', Cultuur: 'B' },
    la: { Vertalen: 'A', Grammatica: 'A', Stijl: 'A', Tekstbegrip: 'A', Cultuur: 'B' },
    gs: { 'Historisch redeneren': 'A', '*': 'B' },
    in: { Algoritmiek: 'A', Complexiteit: 'A', Zoekalgoritmen: 'A', Logica: 'A', Getalsystemen: 'B', Databases: 'B', SQL: 'B' },
    mw: { Vorming: 'B', Verhouding: 'C', Binding: 'D', Verandering: 'E' },
    na: { Trilling: 'B', Beweging: 'C', Kracht: 'C', Energie: 'C', Kernfysica: 'E', Quantum: 'F' },
    sk: { Koolstof: 'B', Evenwicht: 'C', Reactiesnelheid: 'C', Zuren: 'C', Redox: 'C', Rekenen: 'C' },
    wa: { 'Exponentiele groei': 'C', Differentiaalrekening: 'D', 'Normale verdeling': 'E', Toetsen: 'E' },
    wb: { Differentiaalrekening: 'C', Integraalrekening: 'C', Goniometrie: 'D', Meetkunde: 'E' }
  }
};
const _ebPeCache = {};

function ebProefExamen(vakId, niv) {
  niv = niv || _ebNiv();
  return (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS[niv] && SLAGIO_EXAMENS[niv][vakId]) || null;
}
function _ebPeDomein(niv, vakId, label) {
  const m = (EB_PE_DOM[niv] || {})[vakId];
  if (!m) return null;
  if (typeof m === 'string') return m.slice(1);
  return m[label] || m['*'] || null;
}
// Alle vragen van het proefexamen als losse oud-examenvragen (oe-vorm).
function ebProefVragen(vakId, niv) {
  niv = niv || _ebNiv();
  const key = niv + ':' + vakId;
  if (_ebPeCache[key]) return _ebPeCache[key];
  const ex = ebProefExamen(vakId, niv); if (!ex) return [];
  const L = 'ABCDEFGH', vak = (getVK() || []).find(v => v.id === vakId) || { domeinen: [] };
  const domNaam = id => (vak.domeinen.find(d => d.id === id) || {}).naam || '';
  const uit = (ex.vragen || []).map(q => {
    const op = (ex.opgaven || []).find(o => o.nr === q.opgave) || {};
    const afb = [];
    if (op.afb) afb.push({ s: op.afb, c: op.afb_cap || '' });
    if (q.afb && q.afb !== op.afb) afb.push({ s: q.afb, c: q.afb_cap || '' });
    const mc = q.type === 'mc' && Array.isArray(q.opties);
    const v = mc ? q.vraag + '\n\n' + q.opties.map((o, i) => L[i] + '   ' + o).join('\n') : q.vraag;
    const u = mc
      ? `Juist is ${L[q.correct]}: ${q.opties[q.correct]}${q.uitleg ? '\n\n' + q.uitleg : ''}`
      : (q.antwoord || '') + (q.antwoord_rubric ? '\n\nZo worden de punten verdeeld:\n' + q.antwoord_rubric.replace(/\.\s+(?=\d+\s*punt)/g, '.\n') : '');
    return {
      v, u, ctx: op.context || q.context || '', afb, mc, punten: q.punten || 1,
      bron: 'Slagio-proefexamen', proef: 1, peNr: q.nr, peLabel: q.domein,
      peDom: _ebPeDomein(niv, vakId, q.domein),
      peNaam: domNaam(_ebPeDomein(niv, vakId, q.domein)),
      groep: op.titel ? `Opgave ${q.opgave} · ${op.titel}` : `Opgave ${q.opgave}`,
      o: [''], c: 0
    };
  });
  _ebPeCache[key] = uit;
  return uit;
}
function ebProefVoorDomein(vakId, domId) {
  return ebProefVragen(vakId).filter(q => q.peDom === domId);
}
// Open alle losse proefexamenvragen van het vak in de oud-examenkiezer;
// met nr erbij start meteen die ene vraag (vanuit Vraag het Slagio).
function ebProefOpen(vakId, nr, terug) {
  const vak = getVK().find(v => v.id === vakId); if (!vak) return;
  const oe = ebProefVragen(vakId);
  if (!oe.length) { if (typeof showToast === 'function') showToast('Nog geen proefexamen voor dit vak'); return; }
  ST.vak = vak;
  ST.domein = { id: 'PE', _proef: true, naam: 'Slagio-proefexamen', oe, _terug: terug || 'sc-examens' };
  if (nr) {
    const i = oe.findIndex(q => q.peNr === nr);
    if (i >= 0 && typeof startOESingle === 'function') { startOESingle(i); return; }
  }
  if (typeof openOEPicker === 'function') openOEPicker();
}
