// ═══════════════════════════════════════════════════════════════════════
// plus.js  ·  Slagio Plus — de persoonlijke examentrainer (Fase 2 t/m 8)
//
// Alles hier draait op een EIGEN, rule-based/statistische engine: domein- en
// vraagtype-analyse, puntenlekkage, examenvoorspeller, readiness, adaptief
// studieplan, examenrapport en het Plus-dashboard. GEEN AI — dat blijft
// voorbehouden aan het nakijken van open vragen (Fase 1, slagio-ai). Zo is
// Plus bij duizenden gebruikers gratis te draaien.
//
// Bron van de data: elk afgerond proefexamen wordt lokaal opgeslagen
// (slagio_plus_res_<niveau>). De backend wordt later de bron van waarheid voor
// Plus-toegang; de analyse blijft lokaal (snel, offline, gratis).
// ═══════════════════════════════════════════════════════════════════════

// ── Opslag van examenresultaten ───────────────────────────────────────────
function _plusKey(niveau){ return 'slagio_plus_res_'+(niveau||(typeof APP_LEVEL!=='undefined'?APP_LEVEL:'havo')); }
function plusResults(niveau){
  try{ const a=JSON.parse(localStorage.getItem(_plusKey(niveau))||'[]'); return Array.isArray(a)?a:[]; }
  catch(e){ return []; }
}
function _plusSave(niveau, arr){
  try{ localStorage.setItem(_plusKey(niveau), JSON.stringify(arr.slice(-60))); }catch(e){}
}

// Legt een afgerond examen vast: per domein en per vraagtype de behaalde/max
// punten. Wordt aangeroepen als de leerling het resultaatscherm verlaat, zodat
// de zelf-/AI-nagekeken open vragen erin zitten. Robuust bij ontbrekende velden.
function plusRecordExam(EXo){
  try{
    if(!EXo || !EXo.examen || !Array.isArray(EXo.examen.vragen)) return;
    const ex=EXo.examen, grades=EXo.grades||{};
    const niveau = ex.niveau || (typeof APP_LEVEL!=='undefined'?APP_LEVEL:'havo');
    const vakId = (typeof ST!=='undefined' && ST.vak && ST.vak.id) || EXo.vakId || (ex.titel||'').toLowerCase();
    const domeinen={}, types={open:{behaald:0,max:0,aantal:0}, mc:{behaald:0,max:0,aantal:0}};
    let behaald=0, max=0;
    ex.vragen.forEach((q,i)=>{
      const b=Math.max(0, +grades[i]||0), m=+q.punten||0;
      behaald+=b; max+=m;
      const d=q.domein||'Overig';
      (domeinen[d]||(domeinen[d]={behaald:0,max:0,aantal:0}));
      domeinen[d].behaald+=b; domeinen[d].max+=m; domeinen[d].aantal++;
      const t=(q.type==='mc')?'mc':'open';
      types[t].behaald+=b; types[t].max+=m; types[t].aantal++;
    });
    if(max<=0) return;
    const pct=behaald/max;
    const cijfer=Math.round((9*pct+1)*2)/2;
    const totaal=(ex.duur_minuten||0)*60;
    const gebruikt=Math.max(0, totaal-(EXo.secondsLeft||0));
    const rec={ ts:Date.now(), niveau, vakId, vak:ex.titel||vakId, cijfer,
      behaald, max, versie:EXo.versieId||'vol',
      tijdGebruikt:gebruikt, tijdTotaal:totaal, domeinen, types };
    const all=plusResults(niveau); all.push(rec); _plusSave(niveau, all);
    try{ if(typeof trackEvent==='function') trackEvent('examen_resultaat',{vak:ex.titel,cijfer,niveau}); }catch(e){}
    return rec;
  }catch(e){ return; }
}

// ── Kleine helpers ────────────────────────────────────────────────────────
function _plusKleur(pct){ return pct>=0.75?'groen':(pct>=0.55?'oranje':'rood'); }
function _plusDot(pct){ return pct>=0.75?'🟢':(pct>=0.55?'🟠':'🔴'); }
function _plusVakResults(vakId, niveau){ return plusResults(niveau).filter(r=>r.vakId===vakId); }
function _plusRecent(vakId, n, niveau){ const a=_plusVakResults(vakId,niveau); return a.slice(-(n||5)); }
function plusVakkenMetData(niveau){
  const seen={}, out=[];
  plusResults(niveau).forEach(r=>{ if(!seen[r.vakId]){ seen[r.vakId]=1; out.push({vakId:r.vakId, vak:r.vak}); } });
  return out;
}

// ── Domein- en vraagtype-analyse ──────────────────────────────────────────
function plusDomeinAnalyse(vakId, niveau){
  const recent=_plusRecent(vakId,5,niveau); const agg={};
  recent.forEach(r=>{ Object.keys(r.domeinen||{}).forEach(d=>{
    const s=r.domeinen[d]; (agg[d]||(agg[d]={behaald:0,max:0})); agg[d].behaald+=s.behaald; agg[d].max+=s.max; }); });
  return Object.keys(agg).map(d=>{ const pct=agg[d].max?agg[d].behaald/agg[d].max:0;
    return {domein:d, pct, kleur:_plusKleur(pct), verloren:agg[d].max-agg[d].behaald}; })
    .sort((a,b)=>a.pct-b.pct);
}
function plusVraagtypeAnalyse(vakId, niveau){
  const recent=_plusRecent(vakId,5,niveau); const t={open:{behaald:0,max:0}, mc:{behaald:0,max:0}};
  recent.forEach(r=>{ ['open','mc'].forEach(k=>{ const s=(r.types||{})[k]; if(s){ t[k].behaald+=s.behaald; t[k].max+=s.max; } }); });
  return { open: t.open.max? t.open.behaald/t.open.max : null, openMax:t.open.max,
           mc: t.mc.max? t.mc.behaald/t.mc.max : null, mcMax:t.mc.max };
}
function plusPuntenlekkage(vakId, niveau){
  const recent=_plusRecent(vakId,3,niveau); let open=0, mc=0; const perDom={};
  recent.forEach(r=>{ const to=(r.types||{}).open, tm=(r.types||{}).mc;
    if(to) open+=(to.max-to.behaald); if(tm) mc+=(tm.max-tm.behaald);
    Object.keys(r.domeinen||{}).forEach(d=>{ perDom[d]=(perDom[d]||0)+(r.domeinen[d].max-r.domeinen[d].behaald); }); });
  const totaal=open+mc;
  const domList=Object.keys(perDom).map(d=>({domein:d, verloren:perDom[d]})).sort((a,b)=>b.verloren-a.verloren);
  return { totaal, open, mc, aantalExamens:recent.length, domList };
}

// ── Examenvoorspeller ─────────────────────────────────────────────────────
function plusVoorspeldCijfer(vakId, niveau){
  const recent=_plusRecent(vakId,5,niveau); if(!recent.length) return null;
  let sw=0, sm=0; recent.forEach((r,i)=>{ const w=i+1; sw+=w; sm+=w*r.cijfer; });
  const gew=sm/sw;
  const eerste=recent[0].cijfer, laatste=recent[recent.length-1].cijfer;
  const trend=recent.length>1 ? (laatste-eerste)/(recent.length-1) : 0;
  let v=gew + 0.4*Math.max(-0.5,Math.min(0.5,trend));
  v=Math.max(1, Math.min(10, v));
  const cijfers=recent.map(r=>r.cijfer);
  const spread=cijfers.length>1 ? Math.min(1.0, _plusStd(cijfers)) : 0.5;
  return { cijfer:Math.round(v*10)/10, laag:Math.max(1,Math.round((v-spread)*10)/10),
           hoog:Math.min(10,Math.round((v+spread*0.8)*10)/10), trend, reeks:cijfers };
}
function _plusStd(a){ const m=a.reduce((x,y)=>x+y,0)/a.length; return Math.sqrt(a.reduce((x,y)=>x+(y-m)*(y-m),0)/a.length); }

// ── Examen-readiness (0-100) ──────────────────────────────────────────────
function plusReadiness(vakId, niveau){
  const recent=_plusRecent(vakId,5,niveau); if(!recent.length) return null;
  let b=0,m=0; recent.forEach(r=>{ b+=r.behaald; m+=r.max; });
  const kennis=m? b/m : 0;
  const vt=plusVraagtypeAnalyse(vakId,niveau);
  const toepassen = vt.open!=null ? vt.open : kennis;
  const cijfers=recent.map(r=>r.cijfer);
  const consistentie = cijfers.length>1 ? Math.max(0, 1 - _plusStd(cijfers)/2) : 0.6;
  // tijdmanagement: ruim binnen de tijd blijven = goed
  let tijd=0.8, tc=0; recent.forEach(r=>{ if(r.tijdTotaal){ tc++; const ratio=r.tijdGebruikt/r.tijdTotaal; tijd += (ratio<=0.85?1:(ratio<=1?0.8:0.6)); } });
  tijd = tc? (tijd-0.8)/tc : 0.8;
  const dekking = Math.min(1, recent.length/3);
  const score = 0.40*kennis + 0.22*toepassen + 0.15*consistentie + 0.10*tijd + 0.13*dekking;
  const factoren=[
    {label:'Kennis', pct:kennis}, {label:'Toepassen (open)', pct:toepassen},
    {label:'Consistentie', pct:consistentie}, {label:'Tijdmanagement', pct:tijd},
    {label:'Ervaring', pct:dekking} ];
  return { score:Math.round(score*100), factoren };
}

// ── Dagen tot examen (uit het rooster) ────────────────────────────────────
function plusDagenTotExamen(vakId, niveau){
  try{
    const sched = (typeof schData==='function') ? schData() : (typeof EXAM_SCHEDULE!=='undefined'?EXAM_SCHEDULE:[]);
    const lvl = niveau || (typeof APP_LEVEL!=='undefined'?APP_LEVEL:'havo');
    const hit = sched.filter(e=>e.vakId===vakId && (!e.niveau||e.niveau===lvl))
      .map(e=>({e, t:Date.parse(e.datum)})).filter(x=>!isNaN(x.t) && x.t>Date.now()-864e5)
      .sort((a,b)=>a.t-b.t)[0];
    if(!hit) return null;
    const dagen=Math.max(0, Math.ceil((hit.t-Date.now())/864e5));
    return { dagen, datum:hit.e.datum };
  }catch(e){ return null; }
}

// ── Doelcijfer (per vak, instelbaar) ──────────────────────────────────────
function plusDoel(vakId){ try{ const v=parseFloat(localStorage.getItem('slagio_plus_doel_'+vakId)); return isNaN(v)?6.5:v; }catch(e){ return 6.5; } }
function plusSetDoel(vakId, v){ try{ localStorage.setItem('slagio_plus_doel_'+vakId, String(Math.max(1,Math.min(10,v)))); }catch(e){} if(typeof renderPlusDashboard==='function') renderPlusDashboard(); }

// ── Adaptief studieplan ───────────────────────────────────────────────────
// Rule-based prioriteit: zwakste domein eerst, dan open-vraagtraining, dan
// foutenherhaling, geschaald op het tijdsbudget (ongeveer 1,5 min per item).
function plusStudieplan(vakId, minuten, niveau){
  const min=minuten||20; const budget=Math.round(min/1.5); // items
  const dom=plusDomeinAnalyse(vakId,niveau); const vt=plusVraagtypeAnalyse(vakId,niveau);
  const taken=[];
  const zwak = dom.filter(d=>d.pct<0.75);
  if(zwak[0]) taken.push({ic:_plusDot(zwak[0].pct), t:Math.max(4,Math.round(budget*0.45))+' vragen '+zwak[0].domein, tag:'zwakste onderwerp'});
  if(vt.open!=null && vt.open<0.7) taken.push({ic:'✍️', t:Math.max(3,Math.round(budget*0.3))+' open vragen oefenen', tag:'open vragen zijn je risico'});
  if(zwak[1]) taken.push({ic:_plusDot(zwak[1].pct), t:Math.max(3,Math.round(budget*0.25))+' vragen '+zwak[1].domein, tag:'tweede aandachtspunt'});
  taken.push({ic:'🔁', t:'Herhaal je oude fouten', tag:'foutenboek'});
  if(min>=30) taken.push({ic:'📝', t:'1 mini-examen (Kort)', tag:'oefen onder tijd'});
  return { minuten:min, taken:taken.slice(0, min>=30?5:4) };
}

// ═══════ EXAMENRAPPORT (na een examen) ═══════
function plusRapportHTML(rec){
  if(!rec) return '';
  const dom=Object.keys(rec.domeinen||{}).map(d=>({d, pct:rec.domeinen[d].max?rec.domeinen[d].behaald/rec.domeinen[d].max:0}));
  const best=dom.slice().sort((a,b)=>b.pct-a.pct)[0], slecht=dom.slice().sort((a,b)=>a.pct-b.pct)[0];
  const to=(rec.types||{}).open, tm=(rec.types||{}).mc;
  const tMin=Math.floor((rec.tijdTotaal-rec.tijdGebruikt)/60);
  const row=(l,v)=>`<div class="pr-row"><span>${l}</span><b>${v}</b></div>`;
  return `<div class="plus-rap">
    <div class="pr-grid">
      ${row('Cijfer', rec.cijfer.toFixed(1))}
      ${row('Punten', rec.behaald+' / '+rec.max)}
      ${to&&to.max?row('Open vragen', Math.round(to.behaald/to.max*100)+'%'):''}
      ${tm&&tm.max?row('Meerkeuze', Math.round(tm.behaald/tm.max*100)+'%'):''}
      ${rec.tijdTotaal?row('Tijd over', (tMin>=0?tMin:0)+' min'):''}
      ${best?row('Sterkste onderwerp', best.d):''}
      ${slecht&&slecht.d!==(best&&best.d)?row('Zwakste onderwerp', slecht.d):''}
    </div>
  </div>`;
}

// ═══════ PLUS-DASHBOARD ═══════
let _plusVak = null;
function openPlusDashboard(){
  try{ if(typeof show==='function') show('sc-plus'); }catch(e){}
  renderPlusDashboard();
}
function _plusPickVak(vakId){ _plusVak=vakId; renderPlusDashboard(); }

function renderPlusDashboard(){
  const el=document.getElementById('sc-plus-body'); if(!el) return;
  const niveau=(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo';
  const vakken=plusVakkenMetData(niveau);
  if(!vakken.length){
    el.innerHTML=`<div class="plus-empty"><div class="plus-empty-ic">📊</div>
      <h3>Nog geen gegevens</h3>
      <p>Maak eerst een proefexamen af. Daarna laat Slagio hier zien waar je punten laat liggen, wat je vandaag moet oefenen en hoe je ervoor staat.</p>
      <button class="plus-cta" onclick="show('sc-home')">Naar de vakken</button></div>`;
    return;
  }
  if(!_plusVak || !vakken.some(v=>v.vakId===_plusVak)) _plusVak=vakken[vakken.length-1].vakId;
  const vakId=_plusVak;
  const isPlus = (typeof plusActive==='function') && plusActive();
  const vakNaam=(vakken.find(v=>v.vakId===vakId)||{}).vak||vakId;

  // Vakkiezer
  const chips=vakken.map(v=>`<button class="plus-vchip${v.vakId===vakId?' on':''}" onclick="_plusPickVak('${v.vakId}')">${v.vak}</button>`).join('');

  const voorsp=plusVoorspeldCijfer(vakId,niveau);
  const ready=plusReadiness(vakId,niveau);
  const dom=plusDomeinAnalyse(vakId,niveau);
  const lek=plusPuntenlekkage(vakId,niveau);
  const dagen=plusDagenTotExamen(vakId,niveau);
  const doel=plusDoel(vakId);

  // ── Kop: doel + voorspeld + dagen ──
  let head=`<div class="plus-head">
    <div class="plus-head-top"><h2>${vakNaam}</h2>${dagen?`<span class="plus-days">${dagen.dagen} dagen tot examen</span>`:''}</div>`;
  if(isPlus && voorsp){
    const tekort=Math.max(0, Math.round((doel-voorsp.cijfer)*10)/10);
    head+=`<div class="plus-forecast">
      <div class="pf-main"><span class="pf-num">${voorsp.cijfer.toFixed(1)}</span><span class="pf-lbl">verwacht cijfer</span></div>
      <div class="pf-side">
        <div class="pf-range">waarschijnlijk ${voorsp.laag.toFixed(1)} tot ${voorsp.hoog.toFixed(1)}</div>
        <div class="pf-goal">🎯 doel ${doel.toFixed(1)} <button class="pf-goalbtn" onclick="plusSetDoel('${vakId}',${(doel-0.5).toFixed(1)})">−</button><button class="pf-goalbtn" onclick="plusSetDoel('${vakId}',${(doel+0.5).toFixed(1)})">+</button></div>
        ${tekort>0?`<div class="pf-need">nog +${tekort.toFixed(1)} te gaan</div>`:`<div class="pf-need done">doel gehaald 🎉</div>`}
      </div></div>`;
  } else if(voorsp){
    head+=`<div class="plus-lock"><div class="pl-blur">Verwacht cijfer &amp; doel</div>${_plusLockBtn()}</div>`;
  }
  head+=`</div>`;

  // ── Laatste examen (rapport) ──
  const lastRec=_plusVakResults(vakId,niveau).slice(-1)[0];
  const rapHtml = lastRec ? `<div class="plus-card"><div class="plus-card-h">Je laatste examen</div>${plusRapportHTML(lastRec)}</div>` : '';

  // ── Readiness ──
  let readyHtml='';
  if(ready){
    if(isPlus){
      const bars=ready.factoren.map(f=>`<div class="pr-fac"><span>${f.label}</span><div class="pr-bar"><i style="width:${Math.round(f.pct*100)}%"></i></div><b>${Math.round(f.pct*100)}%</b></div>`).join('');
      readyHtml=`<div class="plus-card"><div class="plus-card-h">Examen-readiness</div>
        <div class="plus-ready"><div class="ring ring-${_plusKleur(ready.score/100)}" style="--p:${ready.score}"><span>${ready.score}%</span><small>klaar</small></div>
        <div class="pr-facs">${bars}</div></div></div>`;
    } else {
      readyHtml=`<div class="plus-card locked"><div class="plus-card-h">Examen-readiness</div><div class="plus-lock"><div class="pl-blur">Zie hoe klaar je bent over 5 factoren</div>${_plusLockBtn()}</div></div>`;
    }
  }

  // ── Vandaag (studieplan) ──
  let planHtml='';
  if(isPlus){
    const plan=plusStudieplan(vakId, plusTijd(), niveau);
    planHtml=`<div class="plus-card"><div class="plus-card-h">Vandaag · ±${plan.minuten} min
      <span class="plus-time">${[10,20,30].map(m=>`<button class="pt${m===plusTijd()?' on':''}" onclick="plusSetTijd(${m})">${m}m</button>`).join('')}</span></div>
      <div class="plus-plan">${plan.taken.map(t=>`<div class="pp-item"><span class="pp-ic">${t.ic}</span><span class="pp-t">${t.t}<small>${t.tag}</small></span></div>`).join('')}</div>
      <button class="plus-cta" onclick="_plusStart('${vakId}')">Start training</button></div>`;
  } else {
    planHtml=`<div class="plus-card locked"><div class="plus-card-h">Jouw plan voor vandaag</div><div class="plus-lock"><div class="pl-blur">Elke dag de training die het meeste oplevert</div>${_plusLockBtn()}</div></div>`;
  }

  // ── Zwakke punten (basis gratis, uitgebreid Plus) ──
  let zwakHtml='';
  if(dom.length){
    const top=dom.slice(0,4);
    const list=top.map(d=>`<div class="pz-row"><span class="pz-dot">${_plusDot(d.pct)}</span><span class="pz-dom">${d.domein}</span><span class="pz-pct">${Math.round(d.pct*100)}%</span></div>`).join('');
    let extra='';
    if(isPlus && lek.totaal>0){
      extra=`<div class="pz-lek">Je verloor de laatste ${lek.aantalExamens} examen(s) <b>${lek.totaal} punten</b>: ${lek.open} bij open vragen, ${lek.mc} bij meerkeuze.</div>`;
    } else if(!isPlus){
      extra=`<div class="plus-lock small"><div class="pl-blur">+ puntenlekkage en trainknop per onderwerp</div>${_plusLockBtn()}</div>`;
    }
    zwakHtml=`<div class="plus-card"><div class="plus-card-h">Waar je punten laat liggen</div>
      <div class="plus-zwak">${list}</div>${extra}</div>`;
  }

  // ── Ontwikkeling ──
  let ontwHtml='';
  if(voorsp && voorsp.reeks.length>1){
    ontwHtml=`<div class="plus-card"><div class="plus-card-h">Je ontwikkeling</div>
      ${_plusSpark(voorsp.reeks)}
      <div class="plus-ontw-txt">${voorsp.reeks.map(c=>c.toFixed(1)).join(' → ')} <b class="${voorsp.trend>=0?'up':'down'}">${voorsp.trend>=0?'📈':'📉'} ${(voorsp.reeks[voorsp.reeks.length-1]-voorsp.reeks[0]>=0?'+':'')}${(voorsp.reeks[voorsp.reeks.length-1]-voorsp.reeks[0]).toFixed(1)}</b></div></div>`;
  }

  // ── Examenoverzicht (alle vakken) ──
  let overHtml='';
  if(vakken.length>1){
    const rows=vakken.map(v=>{ const vc=plusVoorspeldCijfer(v.vakId,niveau); const rr=plusReadiness(v.vakId,niveau);
      return `<div class="po-row" onclick="_plusPickVak('${v.vakId}')"><span class="po-vak">${v.vak}</span>
        <span class="po-cij">${vc?vc.cijfer.toFixed(1):'–'}</span>
        <span class="po-ready">${rr?_plusDot(rr.score/100)+' '+rr.score+'%':'–'}</span></div>`; }).join('');
    overHtml=`<div class="plus-card"><div class="plus-card-h">Al je vakken</div>
      <div class="po-head"><span>vak</span><span>cijfer</span><span>klaar</span></div>
      <div class="plus-over">${rows}</div></div>`;
  }

  el.innerHTML = `<div class="plus-vchips">${chips}</div>${head}${rapHtml}${readyHtml}${planHtml}${zwakHtml}${ontwHtml}${overHtml}
    ${!isPlus?`<div class="plus-upsell-foot"><b>Slagio Plus</b> geeft je AI-nakijken, je verwachte cijfer, readiness en een persoonlijk plan. Oefenen en zelf nakijken blijven altijd gratis.<button class="plus-cta" onclick="plusIntro()">🎯 Bekijk Slagio Plus</button></div>`:''}`;
}

function _plusLockBtn(){ return `<button class="pl-btn" onclick="plusIntro()">🔒 Slagio Plus</button>`; }
function plusTijd(){ try{ const v=parseInt(localStorage.getItem('slagio_plus_tijd')||'20',10); return isNaN(v)?20:v; }catch(e){ return 20; } }
function plusSetTijd(m){ try{ localStorage.setItem('slagio_plus_tijd', String(m)); }catch(e){} renderPlusDashboard(); }
function _plusStart(vakId){
  try{ const vk=(typeof getVK==='function'?getVK():[]).find(v=>v.id===vakId); if(vk && typeof openVak==='function'){ openVak(vk); return; } }catch(e){}
  try{ show('sc-home'); }catch(e){}
}

// ═══════ PLUS VERKOOPPAGINA ═══════
// De conversie-surface. Opent met de vraag, niet met de techniek. Verkoopt
// gemak/zekerheid, nooit "je kunt niets meer" — de kern blijft altijd gratis.
const _PLUS_PLANNEN = [
  {id:'najaar', naam:'Najaar', prijs:'€ 7,99', periode:'september tot 31 januari', sub:'Begin je examenjaar slim.'},
  {id:'jaar',   naam:'Heel examenjaar', prijs:'€ 24,99', periode:'nu tot en met de examens', sub:'Alles, het hele jaar. Eén betaling, geen verlenging.', best:true},
  {id:'examen', naam:'Examenperiode', prijs:'€ 14,99', periode:'februari tot en met de examens', sub:'De laatste, beslissende fase.'},
  {id:'flex',   naam:'Flex', prijs:'€ 4,99', periode:'per maand, maandelijks opzegbaar', sub:'Liever niet ineens.'},
];
const _PLUS_FEATURES = [
  ['🤖','AI-nakijken','Laat open vragen nakijken tegen het echte scoringsvoorschrift, met feedback per punt.'],
  ['🎯','Zwakke-puntenanalyse','Zie precies welke onderwerpen en vraagtypes je punten kosten.'],
  ['🗺️','Persoonlijk studieplan','Elke dag de training die op dat moment het meeste oplevert.'],
  ['📈','Verwacht cijfer','Zie hoe je ervoor staat en hoe je resultaat zich ontwikkelt.'],
  ['🏆','Examen-readiness','Zie hoe klaar Slagio je vindt, over vijf factoren.'],
  ['📝','Examenrapport','Na elk examen een diepe analyse van waar je punten liet liggen.'],
];
const _PLUS_VERGELIJK = [
  ['Alle oefenvragen &amp; examens', true, true],
  ['Modelantwoorden &amp; zelf nakijken', true, true],
  ['XP, streaks, foutenboek', true, true],
  ['AI-nakijken', '3&#215;/week', '★ ruim'],
  ['Zwakke-puntenanalyse', 'basis', '★ uitgebreid'],
  ['Studieplan &amp; verwacht cijfer', false, true],
  ['Examen-readiness &amp; rapport', false, true],
  ['Alle vakken inbegrepen', true, true],
];

function openPlusIntro(){ try{ show('sc-plus-intro'); }catch(e){} renderPlusIntro(); }
// plusIntro() (aangeroepen vanuit sim.js/dashboard) opent voortaan het scherm.
function plusIntro(){ openPlusIntro(); }

function renderPlusIntro(){
  const el=document.getElementById('sc-plus-intro-body'); if(!el) return;
  const active = (typeof plusActive==='function') && plusActive();
  const feats=_PLUS_FEATURES.map(f=>`<div class="pi-feat"><span class="pi-feat-ic">${f[0]}</span><div><b>${f[1]}</b><span>${f[2]}</span></div></div>`).join('');
  const cell=v=> v===true?'<span class="pi-y">✓</span>' : (v===false?'<span class="pi-n">–</span>' : `<span class="pi-v">${v}</span>`);
  const rows=_PLUS_VERGELIJK.map(r=>`<tr><td>${r[0]}</td><td>${cell(r[1])}</td><td>${cell(r[2])}</td></tr>`).join('');
  const plans=_PLUS_PLANNEN.map(p=>`<div class="pi-plan${p.best?' best':''}">
    ${p.best?'<div class="pi-best">Beste deal</div>':''}
    <div class="pi-plan-naam">${p.naam}</div>
    <div class="pi-plan-prijs">${p.prijs}${p.id==='flex'?'<small>/mnd</small>':''}</div>
    <div class="pi-plan-per">${p.periode}</div>
    <div class="pi-plan-sub">${p.sub}</div>
    <button class="pi-plan-btn${p.best?' best':''}" onclick="plusCheckout('${p.id}')">Kies ${p.naam}</button>
  </div>`).join('');
  el.innerHTML = `
    <div class="pi-hero">
      <div class="pi-badge">🎯 Slagio Plus</div>
      <h1>Weet jij of je klaar bent voor je examen?</h1>
      <p class="pi-lead">Slagio Plus laat zien waar je punten laat liggen, wat je vandaag moet oefenen en hoe je ervoor staat richting je examen.</p>
      <p class="pi-killer">Van "ik moet meer leren" naar "ik weet precies wat ik moet doen."</p>
    </div>
    ${active?`<div class="pi-active">✓ Je hebt Slagio Plus. <button class="pi-link" onclick="openPlusDashboard()">Naar je examentrainer</button></div>`:''}
    <div class="pi-feats">${feats}</div>
    <div class="pi-vergelijk">
      <div class="pi-card-h">Gratis blijft gratis</div>
      <div class="pi-tbl-wrap"><table class="pi-tbl"><thead><tr><th></th><th>Gratis</th><th>Plus</th></tr></thead><tbody>${rows}</tbody></table></div>
      <p class="pi-note">Alles wat je nodig hebt om te slagen blijft gratis. Plus maakt je voorbereiding slimmer en persoonlijker.</p>
    </div>
    <div class="pi-prices-h">Kies je periode <small>alle vakken inbegrepen</small></div>
    <div class="pi-plans">${plans}</div>
    <div class="pi-trial">Twijfel je? Je krijgt <b>3 AI-beoordelingen per week gratis</b>, zonder account of creditcard. Zo voel je eerst wat Plus doet.</div>
  `;
}

// Checkout: nog niet gekoppeld aan de betaalprovider (Mollie/iDEAL). Registreert
// de interesse (waardevolle pre-launch data) en meldt dat het eraan komt.
function plusCheckout(plan){
  try{ if(typeof trackEvent==='function') trackEvent('plus_interesse',{plan}); }catch(e){}
  try{ showToast('Bedankt voor je interesse! Betalen via iDEAL komt er zeer binnenkort aan.'); }catch(e){}
}

// Sparkline van de cijferreeks (klein, inline SVG, themaneutraal via currentColor).
function _plusSpark(reeks){
  const w=280,h=54,pad=8; const min=Math.min.apply(null,reeks)-0.3, max=Math.max.apply(null,reeks)+0.3;
  const sx=i=>pad+(reeks.length<2?0:i/(reeks.length-1)*(w-2*pad));
  const sy=v=>h-pad-((v-min)/((max-min)||1))*(h-2*pad);
  const pts=reeks.map((v,i)=>sx(i).toFixed(1)+','+sy(v).toFixed(1)).join(' ');
  const dots=reeks.map((v,i)=>`<circle cx="${sx(i).toFixed(1)}" cy="${sy(v).toFixed(1)}" r="3" fill="#e8580c"/>`).join('');
  return `<svg class="plus-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="cijferontwikkeling"><polyline points="${pts}" fill="none" stroke="#e8580c" stroke-width="2.5"/>${dots}</svg>`;
}
