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
  try{ if(typeof pushSyncBundle==='function') pushSyncBundle(); }catch(e){} // cross-device sync
}
// Legt een gewone quiz-/oud-examen-sessie vast in dezelfde vorm als een examen,
// zodat het dashboard leert van ÁLLE oefening (niet alleen proefexamens). Eén
// domein, meerkeuze. bron: 'quiz' (snelle) of 'oud' (oud examen).
function plusRecordQuiz(o){
  try{
    if(!o || !(o.max>0)) return;
    const niveau = o.niveau || (typeof APP_LEVEL!=='undefined'?APP_LEVEL:'havo');
    const dom = o.domein || 'Overig';
    const behaald = Math.max(0, o.behaald||0), max = o.max, aantal = o.aantal||max;
    const domeinen = {}; domeinen[dom] = {behaald, max, aantal};
    const types = {open:{behaald:0,max:0,aantal:0}, mc:{behaald, max, aantal}};
    const pct = behaald/max;
    const rec = { ts:Date.now(), niveau, vakId:o.vakId, vak:o.vak||o.vakId, cijfer:Math.round((9*pct+1)*2)/2,
      behaald, max, versie:o.bron||'quiz', bron:o.bron||'quiz', tijdGebruikt:0, tijdTotaal:0, domeinen, types };
    const all=plusResults(niveau); all.push(rec); _plusSave(niveau, all);
    return rec;
  }catch(e){ return; }
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
      behaald, max, versie:EXo.versieId||'vol', bron:'sim',
      tijdGebruikt:gebruikt, tijdTotaal:totaal, domeinen, types };
    const all=plusResults(niveau); all.push(rec); _plusSave(niveau, all);
    try{ if(typeof trackEvent==='function') trackEvent('examen_resultaat',{vak:ex.titel,cijfer,niveau}); }catch(e){}
    return rec;
  }catch(e){ return; }
}

// ── Kleine helpers ────────────────────────────────────────────────────────
function _plusKleur(pct){ return pct>=0.75?'groen':(pct>=0.55?'oranje':'rood'); }
function _plusDot(pct){ return pct>=0.75?'🟢':(pct>=0.55?'🟠':'🔴'); }
function _plusVakResults(vakId, niveau, bron){ return plusResults(niveau).filter(r=>r.vakId===vakId && (!bron || (r.bron||'sim')===bron)); }
function _plusRecent(vakId, n, niveau, bron){ const a=_plusVakResults(vakId,niveau,bron); return a.slice(-(n||5)); }
function plusVakkenMetData(niveau){
  const seen={}, out=[];
  plusResults(niveau).forEach(r=>{ if(!seen[r.vakId]){ seen[r.vakId]=1; out.push({vakId:r.vakId, vak:r.vak}); } });
  return out;
}

// ── Domein- en vraagtype-analyse ──────────────────────────────────────────
function plusDomeinAnalyse(vakId, niveau){
  const recent=_plusRecent(vakId,14,niveau); const agg={}; // alle oefening telt mee voor beheersing per onderwerp
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
  // Volledige proefexamens leiden de voorspelling. Nog geen proefexamen gedaan?
  // Dan een eerlijke SCHATTING op basis van je algehele beheersing (alle oefening),
  // zodat een leerling die alleen quizt óók ziet waar 'ie staat.
  const sim=_plusRecent(vakId,5,niveau,'sim');
  if(!sim.length){
    const all=_plusRecent(vakId,14,niveau); if(!all.length) return null;
    let b=0,m=0; all.forEach(r=>{ b+=r.behaald; m+=r.max; });
    const pct=m?b/m:0; const v=Math.max(1,Math.min(10,Math.round((9*pct+1)*10)/10));
    return { cijfer:v, laag:Math.max(1,Math.round((v-0.8)*10)/10), hoog:Math.min(10,Math.round((v+0.6)*10)/10),
             trend:0, reeks:[v], schatting:true };
  }
  const recent=sim;
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
  const recent=_plusRecent(vakId,8,niveau); if(!recent.length) return null;
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

// ── Vonk die je écht kent (#4) ─────────────────────────────────────────────
// Een persoonlijke coach die je traject kent: je prognose, je klim of dip, je
// zwakste vak en hoeveel dagen je nog hebt. Geen generieke "oefen even", maar
// een bericht dat naar JOUW data verwijst. Rule-based (geen AI-kosten), dus het
// werkt altijd en verwijst naar echte cijfers.
function plusVonkCoach(niveau){
  niveau = niveau || (typeof APP_LEVEL!=='undefined'?APP_LEVEL:'havo');
  let ctx={}; try{ ctx=(typeof notifContext==='function')?notifContext():{}; }catch(e){ ctx={}; }
  const naam = ctx.naam ? (' '+ctx.naam) : '';
  const pg = (typeof plusSlaagPrognose==='function') ? plusSlaagPrognose(niveau) : null;
  const vakken = (typeof plusVakkenMetData==='function') ? plusVakkenMetData(niveau) : [];
  // Sterkste stijger/daler uit de voorspellingsreeksen.
  let stijger=null, daler=null;
  vakken.forEach(v=>{ const vc=plusVoorspeldCijfer(v.vakId,niveau);
    if(vc && vc.reeks && vc.reeks.length>1){ const delta=vc.reeks[vc.reeks.length-1]-vc.reeks[0];
      if(delta>=0.5 && (!stijger||delta>stijger.delta)) stijger={vak:v.vak, vakId:v.vakId, delta};
      if(delta<=-0.5 && (!daler||delta<daler.delta)) daler={vak:v.vak, vakId:v.vakId, delta}; } });
  const risico = pg && pg.risico;
  const exVak = ctx.examVak, exD = ctx.examDays;
  const act=(label,onclick)=>({label,onclick});
  const _oef=(vakId)=> vakId?`_plusPickVak('${vakId}')`:`show('sc-home')`;

  // Kies het sterkste signaal (volgorde = prioriteit).
  // 1) Examen heel dichtbij → focus op risicovak.
  if(exD!=null && exD<=7 && risico){
    return { mood:'denk', kop:`Nog ${exD} ${exD===1?'dag':'dagen'} tot ${exVak}`,
      msg:`Je staat er ${pg.verdict==='slaag'?'goed':'oké'} voor${naam}. De laatste winst zit bij <b>${risico.vak}</b> (nu een ${risico.eind}). Daar 15 minuten insteken telt nu dubbel.`,
      actie:act(`Train ${risico.vak}`,_oef(risico.vakId)) };
  }
  // 2) Mooie klim → erken het, houd 'm vast.
  if(stijger){
    return { mood:'trots', kop:`Je klimt bij ${stijger.vak} 📈`,
      msg:`Sinds je begon ging je voorspelde cijfer voor <b>${stijger.vak}</b> +${stijger.delta.toFixed(1).replace('.',',')} omhoog${naam?','+naam:''}. Dit is precies hoe het werkt. Even doorpakken en het staat vast.`,
      actie:act(`Ga door met ${stijger.vak}`,_oef(stijger.vakId)) };
  }
  // 3) Al even niet geoefend, met examen op komst → zachte por met inzet.
  if((ctx.lapsedDays!=null && ctx.lapsedDays>=3) && exD!=null && exD<=21){
    return { mood:'kijk', kop:`Even weer opgepakt?`,
      msg:`Je oefende ${ctx.lapsedDays} dagen niet en ${exVak} is over ${exD} dagen${naam}. Geen stress, één setje van 10 minuten brengt je zo weer op gang.`,
      actie:act('Snelle sessie',risico?_oef(risico.vakId):`show('sc-home')`) };
  }
  // 4) Dip in een vak → benoem het rustig, wijs de weg.
  if(daler){
    return { mood:'kijk', kop:`${daler.vak} zakt iets weg`,
      msg:`Je voorspelde cijfer voor <b>${daler.vak}</b> daalde wat${naam}. Dat gebeurt, vaak zit het in één onderwerp. Laten we dat er even uithalen.`,
      actie:act(`Bekijk ${daler.vak}`,_oef(daler.vakId)) };
  }
  // 5) Staat op slagen → vier het, houd de lijn vast.
  if(pg && pg.verdict==='slaag'){
    return { mood:'trots', kop:`Je staat op slagen 🎉`,
      msg:`Gemiddeld een ${pg.eindGem.toFixed(1).replace('.',',')}${naam}. Sterk. Blijf je zwakste vak scherp houden, dan komt hier niks meer tussen.`,
      actie:risico?act(`Houd ${risico.vak} scherp`,_oef(risico.vakId)):null };
  }
  // 6) Risico bekend → wijs er rustig naar.
  if(risico && risico.eind<6){
    return { mood:'denk', kop:`Je grootste winst: ${risico.vak}`,
      msg:`${risico.vak} staat nu op een ${risico.eind}${naam}. Dat is het vak waar oefenen je slaagkans het meest omhoog trekt. Begin daar.`,
      actie:act(`Train ${risico.vak}`,_oef(risico.vakId)) };
  }
  // 7) Warme default.
  return { mood:'blij', kop:`Fijn dat je er bent${naam}`,
    msg:`Ik hou je cijfers, je zwakke punten en je examens in de gaten. Doe een quiz of proefexamen, dan vul ik je stand hierboven live aan.`,
    actie:act('Naar de vakken',`show('sc-home')`) };
}

// ── Tijdsdruk-analyse (#5) ─────────────────────────────────────────────────
// Op het echte examen is tijd de stille killer. Proefexamens worden op tijd
// gemaakt (tijdGebruikt/tijdTotaal), dus daaruit lezen we of je binnen de tijd
// blijft, hoeveel je overhoudt, en of je dreigt uit te lopen. Eigen engine.
function plusTempoAnalyse(vakId, niveau){
  const recent=_plusRecent(vakId,5,niveau,'sim').filter(r=>r.tijdTotaal>0 && r.tijdGebruikt>0);
  if(!recent.length) return null;
  let ratioSum=0, uitloop=0;
  recent.forEach(r=>{ const ratio=Math.min(1.2, r.tijdGebruikt/r.tijdTotaal); ratioSum+=ratio; if(r.tijdGebruikt/r.tijdTotaal>=0.985) uitloop++; });
  const ratio=ratioSum/recent.length;
  const pctTijd=Math.round(Math.min(1,ratio)*100);
  const overMin=Math.round((recent.reduce((s,r)=>s+Math.max(0,r.tijdTotaal-r.tijdGebruikt),0)/recent.length)/60);
  const totaalMin=Math.round(recent[recent.length-1].tijdTotaal/60);
  let status,kop,tip;
  if(uitloop>=Math.ceil(recent.length/2) && ratio>=0.97){
    status='krap'; kop='Je loopt uit de tijd';
    tip='Sla een vraag die vastloopt bewust over en kom terug. Oefen de examenmodus op tijd om je tempo op te bouwen.';
  } else if(ratio>=0.9){
    status='oppassen'; kop='Je zit krap in je tijd';
    tip=`Je gebruikt bijna al je tijd (~${overMin} min over). Werk de makkelijke punten eerst af, dan de tijdvreters.`;
  } else if(ratio<=0.6){
    status='ruim'; kop='Je hebt ruim tijd over';
    tip=`Je houdt gemiddeld ~${overMin} min over. Gebruik die tijd om je open antwoorden te controleren en preciezer te maken.`;
  } else {
    status='goed'; kop='Goed tempo';
    tip=`Mooi ritme: ~${overMin} min over. Blijf dit vasthouden onder examendruk.`;
  }
  return { status, kop, tip, pctTijd, ratio, overMin, totaalMin, aantal:recent.length, uitloop };
}

// ── Live slaagprognose over ÁLLE vakken ────────────────────────────────────
// Combineert je ingevoerde SE-cijfers met een data-voorspelde CE (uit al je
// oefening) tot een eindcijfer per vak, en past exact de uitslagregeling toe
// (dezelfde regels als de cijfercalculator). Zo zie je in één oogopslag of je
// nu zou slagen, welk vak je risico is en wat je nog moet doen. Eigen engine,
// geen AI. Herberekent elke keer dat het dashboard rendert (dus "live").
function _plusProfiel(){
  try{ const p=JSON.parse(localStorage.getItem(typeof PROF_KEY!=='undefined'?PROF_KEY:'examenapp_profiel')||'{}'); return (p&&p.profiel)||''; }
  catch(e){ return ''; }
}
function plusSlaagPrognose(niveau){
  niveau = niveau || (typeof APP_LEVEL!=='undefined'?APP_LEVEL:'havo');
  const cijfers = (typeof getSavedCijfers==='function')?getSavedCijfers():{};
  const vakken = (typeof getVK==='function')?getVK():[];
  const rows = vakken.map(v=>{
    const raw = cijfers[v.id];
    const se = (raw!=null && !isNaN(parseFloat(raw))) ? Math.round(parseFloat(raw)*10)/10 : null;
    const voorsp = plusVoorspeldCijfer(v.id, niveau);
    const ce = voorsp ? voorsp.cijfer : null;
    const schatting = voorsp ? !!voorsp.schatting : false;
    const eind = (se!=null && ce!=null) ? Math.round((se+ce)/2) : null;
    let status;
    if(eind==null) status = (se==null && ce==null) ? 'leeg' : (ce==null ? 'geen-ce' : 'geen-se');
    else if(eind>=7) status='goed';
    else if(eind>=6) status='voldoende';
    else if(eind===5) status='rand';
    else status='risico';
    return { vakId:v.id, vak:v.naam, code:v.code, kleur:v.kleur, se, ce, schatting, eind, status };
  });
  const compleet = rows.filter(r=>r.eind!=null);
  const hasEnough = compleet.length>=3;
  const profiel = _plusProfiel();
  const kernvakken = profiel==='cm' ? ['NE','EN'] : ['NE','EN','WA','WB'];
  const kernGrades = compleet.filter(r=>kernvakken.includes(r.code));
  const kernOnder6 = kernGrades.filter(r=>r.eind<6);
  const ceVals = compleet.map(r=>r.ce);
  const ceGem = ceVals.length ? ceVals.reduce((a,b)=>a+b,0)/ceVals.length : 0;
  const allEind = compleet.map(r=>r.eind);
  const onder4 = allEind.filter(e=>e<4).length;
  const vijven = allEind.filter(e=>e===5).length;
  const vieren = allEind.filter(e=>e===4).length;
  const eindGem = allEind.length ? allEind.reduce((a,b)=>a+b,0)/allEind.length : 0;
  const r1 = ceGem>=5.5;
  const r2 = kernOnder6.length<=1 && kernOnder6.every(r=>r.eind>=5);
  let r3=true;
  if(onder4>0) r3=false;
  else if(vieren>=1&&vijven>=1) r3=eindGem>=6.0;
  else if(vijven>=3) r3=false;
  else if(vijven===2||vieren===1) r3=eindGem>=6.0;
  const geslaagd = hasEnough && r1 && r2 && r3;
  let verdict;
  if(!hasEnough) verdict='onbekend';
  else if(!geslaagd) verdict='zak';
  else if(allEind.every(e=>e>=6)) verdict='slaag';
  else verdict='rand'; // slaagt, maar met compensatie (krap)
  // Reden bij zakken (welke regel valt om) + risicovak (laagste eindcijfer).
  let reden='';
  if(verdict==='zak'){
    if(!r1) reden=`je CE-gemiddelde is ${ceGem.toFixed(1).replace('.',',')} en dat moet minimaal 5,5 zijn`;
    else if(!r2) reden=`een kernvak (Nederlands, Engels of wiskunde) staat te laag`;
    else reden=`je hebt te veel onvoldoendes om te compenseren`;
  }
  const risico = compleet.slice().sort((a,b)=>a.eind-b.eind)[0] || null;
  // Voor het risicovak: hoeveel moet de CE omhoog voor een voldoende (eind ≥ 6)?
  let risicoActie=null;
  if(risico && risico.eind<6 && risico.se!=null){
    const ceNodig = Math.max(1, Math.min(10, 2*6 - risico.se)); // eind=round((se+ce)/2)≥6
    const gap = Math.round((ceNodig - risico.ce)*10)/10;
    risicoActie = { vakId:risico.vakId, vak:risico.vak, gap:Math.max(0,gap), ceNodig:Math.round(ceNodig*10)/10 };
  }
  const ontbreektSE = rows.filter(r=>r.se==null && r.ce!=null).length;
  const ontbreektData = rows.filter(r=>r.ce==null).length;
  return { rows, compleet, hasEnough, ceGem, eindGem, r1, r2, r3, geslaagd, verdict, reden, risico, risicoActie, ontbreektSE, ontbreektData, profiel, kernvakken };
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
function plusSetDoel(vakId, v){
  try{ localStorage.setItem('slagio_plus_doel_'+vakId, String(Math.max(1,Math.min(10,v)))); }catch(e){}
  // Ververs alleen de kop-kaart, niet het hele dashboard (geen "herladen").
  const old=document.querySelector('#sc-plus-body .plus-head');
  if(old){ const niveau=(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo'; old.outerHTML=_plusHeadHTML(vakId,niveau); }
  else if(typeof renderPlusDashboard==='function') renderPlusDashboard();
}

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

// ── Examenkalender: de eigen examens van de leerling met resterende dagen ──
function plusMijnExamens(niveau){
  const lvl = niveau || (typeof APP_LEVEL!=='undefined'?APP_LEVEL:'havo');
  let mijn=[]; try{ if(typeof getMijnVakken==='function') mijn=getMijnVakken()||[]; }catch(e){}
  const sched = (typeof schData==='function') ? schData() : (typeof EXAM_SCHEDULE!=='undefined'?EXAM_SCHEDULE:[]);
  const dataVakken = plusVakkenMetData(lvl).map(v=>v.vakId);
  const wil = new Set([].concat(mijn, dataVakken));
  const out=[];
  sched.forEach(e=>{
    if(e.niveau && e.niveau!==lvl) return;
    const id=e.vakId||e.vak;
    if(!wil.has(e.vakId) && !wil.has(e.vak) && !(dataVakken.indexOf(e.vakId)>=0)) return;
    const t=Date.parse(e.datum); if(isNaN(t) || t < Date.now()-864e5) return;
    out.push({ vak:e.vak, vakId:e.vakId||null, datum:e.datum, tijd:e.tijd||'',
      dagen:Math.max(0,Math.ceil((t-Date.now())/864e5)) });
  });
  return out.sort((a,b)=>Date.parse(a.datum)-Date.parse(b.datum));
}

// ── Eén onderliggend profiel: alle Plus-features zijn vensters hierop ──────
function plusProfiel(vakId, niveau){
  const lvl=niveau||(typeof APP_LEVEL!=='undefined'?APP_LEVEL:'havo');
  return {
    vakId, niveau:lvl,
    examens: _plusVakResults(vakId,lvl),
    domeinen: plusDomeinAnalyse(vakId,lvl),
    types: plusVraagtypeAnalyse(vakId,lvl),
    lek: plusPuntenlekkage(vakId,lvl),
    voorspeld: plusVoorspeldCijfer(vakId,lvl),
    readiness: plusReadiness(vakId,lvl),
    dagen: plusDagenTotExamen(vakId,lvl),
    doel: plusDoel(vakId),
    herhaling: plusHerhaling(vakId,lvl)
  };
}

// ── Prioriteitsmotor: waar levert de volgende training het meeste op? ─────
function plusPrioriteit(niveau){
  const lvl=niveau||(typeof APP_LEVEL!=='undefined'?APP_LEVEL:'havo');
  const vakken=plusVakkenMetData(lvl); if(!vakken.length) return null;
  let best=null;
  vakken.forEach(v=>{
    const voorsp=plusVoorspeldCijfer(v.vakId,lvl), ready=plusReadiness(v.vakId,lvl);
    const doel=plusDoel(v.vakId), dg=plusDagenTotExamen(v.vakId,lvl);
    const gap=Math.max(0, doel-(voorsp?voorsp.cijfer:doel));
    const readGap=ready?(100-ready.score)/100:0.5;
    const urg=dg?Math.max(0,Math.min(1,1-dg.dagen/120)):0.3;
    const score=gap*0.9 + readGap*1.2 + urg*1.0;
    let reden='hier valt de meeste winst te halen';
    if(urg>=0.6 && urg*1.0>=gap*0.9) reden='je examen komt eraan';
    else if(gap>=1) reden='hier lig je het verst van je doel';
    if(!best || score>best.score) best={vakId:v.vakId, vak:v.vak, score, reden, gap, readGap, urg};
  });
  return best;
}

// ── "Vandaag voor jou": één helder plan voor het meest urgente vak ────────
function plusVandaag(niveau){
  const lvl=niveau||(typeof APP_LEVEL!=='undefined'?APP_LEVEL:'havo');
  const pri=plusPrioriteit(lvl); if(!pri) return null;
  const plan=plusStudieplan(pri.vakId, plusTijd(), lvl);
  const herh=plusHerhaling(pri.vakId, lvl);
  let taken=plan.taken.slice();
  if(herh.length){ // vervang de generieke foutentaak door concrete slimme herhaling
    taken=taken.filter(t=>t.tag!=='foutenboek');
    taken.splice(Math.min(2,taken.length),0,{ic:'🔁', t:herh.length+' onderwerp'+(herh.length>1?'en':'')+' om te herhalen', tag:'slimme herhaling'});
  }
  return { vakId:pri.vakId, vak:pri.vak, reden:pri.reden,
    taken:taken.slice(0, plan.minuten>=30?5:4), minuten:plan.minuten, xp:Math.round(plan.minuten*1.7) };
}

// ── Slimme herhaling: welke onderwerpen zijn "toe aan herhaling"? ──────────
// Rule-based/spaced: zwakke domeinen die je een tijdje niet hebt geoefend
// komen terug. Robuust: gebruikt de bestaande resultaatopslag.
function plusHerhaling(vakId, niveau){
  const lvl=niveau||(typeof APP_LEVEL!=='undefined'?APP_LEVEL:'havo');
  const res=_plusVakResults(vakId,lvl); if(!res.length) return [];
  const laatste={}; // domein -> {pct som, n, laatste ts}
  res.forEach(r=>{ Object.keys(r.domeinen||{}).forEach(d=>{ const s=r.domeinen[d];
    const o=laatste[d]||(laatste[d]={behaald:0,max:0,ts:0});
    o.behaald+=s.behaald; o.max+=s.max; o.ts=Math.max(o.ts, r.ts||0); }); });
  const nu=Date.now();
  return Object.keys(laatste).map(d=>{ const o=laatste[d]; const pct=o.max?o.behaald/o.max:0;
    const dagenGeleden=Math.floor((nu-o.ts)/864e5);
    // "due": zwak (<75%) en minstens 2 dagen niet gedaan, of >7 dagen ongeacht
    const due = (pct<0.75 && dagenGeleden>=2) || dagenGeleden>=7;
    return {domein:d, pct, dagenGeleden, due}; })
    .filter(x=>x.due).sort((a,b)=>a.pct-b.pct);
}

// ═══════ PLUS-DASHBOARD ═══════
let _plusVak = null;
function openPlusDashboard(){
  window._plusEntering=true; // animeer alleen bij echte binnenkomst, niet bij re-renders
  try{ if(typeof show==='function') show('sc-plus'); }catch(e){}
  renderPlusDashboard();
}
// Centrale ingang voor de Examentrainer-knoppen. Plus-leden -> hun dashboard;
// iedereen zonder Plus (ook niet-ingelogd) -> de verkooppagina, want dat is de
// plek die Plus uitlegt en verkoopt. Zo ziet een niet-Plus-gebruiker nooit de
// lege "maak eerst een examen"-stand.
function openExamentrainer(){
  const isPlus=(typeof plusActive==='function') && plusActive();
  if(isPlus) openPlusDashboard();
  else openPlusIntro();
}

// ── Verleidelijke, duidelijke Plus-haakjes onder de gratis tools ───────────
// Eén gouden strip die concreet uitlegt wat Plus híer automatisch/persoonlijk
// doet — géén "je kunt niets meer", maar "Plus doet dit slimmer voor je".
// Leeg voor Plus-gebruikers: die hebben het al, dus niets in de weg.
function plusHookHTML(text){
  if((typeof plusActive==='function') && plusActive()) return '';
  return `<button class="plus-hook" onclick="openExamentrainer()" aria-label="Ontdek Slagio Plus">
    <span class="plus-hook-badge">✦&nbsp;Plus</span>
    <span class="plus-hook-txt">${text}</span>
    <span class="plus-hook-arr" aria-hidden="true"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>
  </button>`;
}
function _plusPickVak(vakId){ _plusVak=vakId; renderPlusDashboard(); }

// Losse bouwstenen zodat de tweak-knoppen (doel +/-, tijd) alleen hun eigen
// kaart verversen i.p.v. het hele dashboard te herbouwen (voorkomt "herladen").
function _plusHeadHTML(vakId, niveau, isPlus){
  if(isPlus===undefined) isPlus=(typeof plusActive==='function') && plusActive();
  const vakken=plusVakkenMetData(niveau);
  const vakNaam=(vakken.find(v=>v.vakId===vakId)||{}).vak||vakId;
  const voorsp=plusVoorspeldCijfer(vakId,niveau);
  const dagen=plusDagenTotExamen(vakId,niveau);
  const doel=plusDoel(vakId);
  let head=`<div class="plus-head">
    <div class="plus-head-top"><h2>${vakNaam}</h2>${dagen?`<span class="plus-days">${dagen.dagen} dagen tot examen</span>`:''}</div>`;
  if(isPlus && voorsp){
    const tekort=Math.max(0, Math.round((doel-voorsp.cijfer)*10)/10);
    head+=`<div class="plus-forecast">
      <div class="pf-main"><span class="pf-num">${voorsp.cijfer.toFixed(1)}</span><span class="pf-lbl">verwacht cijfer</span></div>
      <div class="pf-side">
        <div class="pf-range">${voorsp.schatting?'schatting op basis van je oefening · doe een proefexamen voor een echte voorspelling':'waarschijnlijk '+voorsp.laag.toFixed(1)+' tot '+voorsp.hoog.toFixed(1)}</div>
        <div class="pf-goal">🎯 doel ${doel.toFixed(1)} <button class="pf-goalbtn" onclick="plusSetDoel('${vakId}',${(doel-0.5).toFixed(1)})">−</button><button class="pf-goalbtn" onclick="plusSetDoel('${vakId}',${(doel+0.5).toFixed(1)})">+</button></div>
        ${tekort>0?`<div class="pf-need">nog +${tekort.toFixed(1)} te gaan</div>`:`<div class="pf-need done">doel gehaald 🎉</div>`}
      </div></div>`;
  } else if(voorsp){
    head+=`<div class="plus-lock"><div class="pl-blur">Verwacht cijfer &amp; doel</div>${_plusLockBtn()}</div>`;
  }
  head+=`</div>`;
  return head;
}
function _plusVandaagHTML(niveau, isPlus){
  if(isPlus===undefined) isPlus=(typeof plusActive==='function') && plusActive();
  if(isPlus){
    const vd=plusVandaag(niveau);
    if(!vd) return '';
    return `<div class="plus-vandaag">
      <div class="pv-top"><span class="pv-badge">🎯 Vandaag voor jou</span><span class="pv-vak">${vd.vak} · ${vd.reden}</span></div>
      <div class="plus-plan">${vd.taken.map(t=>`<div class="pp-item"><span class="pp-ic">${t.ic}</span><span class="pp-t">${t.t}<small>${t.tag}</small></span></div>`).join('')}</div>
      <div class="pv-foot">±${vd.minuten} min · +${vd.xp} XP <span class="plus-time">${[10,20,30].map(m=>`<button class="pt${m===plusTijd()?' on':''}" onclick="plusSetTijd(${m})">${m}m</button>`).join('')}</span></div>
      <button class="plus-cta" onclick="_plusStart('${vd.vakId}')">Start training</button></div>`;
  }
  return `<div class="plus-vandaag locked"><div class="pv-top"><span class="pv-badge">🎯 Vandaag voor jou</span></div>
    <div class="plus-lock"><div class="pl-blur">Elke dag één helder plan: precies wat je nu moet oefenen</div>${_plusLockBtn()}</div></div>`;
}

// Examenmodus: afleidingsvrije volledige simulatie op tijd. Zet het vak, markeert
// de focus-modus (onderdrukt gamification bij afloop) en start het volledige
// proefexamen. Tijdregistratie en het rapport lopen via de gewone runner.
function startExamenmodus(vakId){
  try{
    const vk=(typeof getVK==='function'?getVK():[]).find(v=>v.id===vakId);
    if(vk && typeof ST!=='undefined'){ ST.vak=vk; ST.vakId=vk.id; }
    window._examenModus=true;
    if(typeof startProefexamen==='function') startProefexamen();
    else if(typeof showToast==='function') showToast('Kies eerst een vak met een proefexamen.');
  }catch(e){}
}

// ── Kaart: live slaagprognose over alle vakken (crown jewel van Plus) ──────
function _ppStatusKleur(status){
  return { goed:'#22c55e', voldoende:'#22c55e', rand:'#f59e0b', risico:'#ef4444' }[status] || 'var(--mu)';
}
function _plusPrognoseHTML(niveau, isPlus){
  if(!isPlus){
    return `<div class="plus-card locked"><div class="plus-card-h">Slaag ik?</div>
      <div class="plus-lock"><div class="pl-blur">Je live slaagkans over al je vakken, met je zwakste vak</div>${_plusLockBtn()}</div></div>`;
  }
  const pg=plusSlaagPrognose(niveau);
  // Rijen met enige data (SE of CE); volledig lege vakken laten we weg.
  const rows=pg.rows.filter(r=>r.se!=null || r.ce!=null);
  if(!rows.length){
    return `<div class="plus-card plus-prognose"><div class="plus-card-h">Slaag ik?</div>
      <div class="pp-empty">Voer je SE-cijfers in en oefen een paar vakken, dan reken ik je slaagkans hier live uit.
      <button class="pp-mini-cta" onclick="goToCijferInvoer()">Vul je SE-cijfers in →</button></div></div>`;
  }
  const VS={
    slaag:{ic:'🎉',cls:'pp-slaag',kop:'Je staat op slagen'},
    rand:{ic:'⚖️',cls:'pp-rand',kop:'Je slaagt nu, net aan'},
    zak:{ic:'🔴',cls:'pp-zak',kop:'Nu zou je nog zakken'},
    onbekend:{ic:'📊',cls:'pp-onbekend',kop:'Vul je stand aan'}
  }[pg.verdict];
  let sub='';
  if(pg.verdict==='slaag') sub=`Gemiddeld eindcijfer <b>${pg.eindGem.toFixed(1).replace('.',',')}</b> · CE-gemiddelde ${pg.ceGem.toFixed(1).replace('.',',')}. Mooi zo, vasthouden.`;
  else if(pg.verdict==='rand') sub=`Eén tegenvaller en het kantelt.${pg.risico?` Je risicovak is <b>${pg.risico.vak}</b>.`:''} Til dat op en je zit veiliger.`;
  else if(pg.verdict==='zak') sub=`Waarom: ${pg.reden}. Dit is te draaien. Begin bij je zwakste vak.`;
  else sub=`Nog ${Math.max(0,3-pg.compleet.length)} vak(ken) met SE + oefening te gaan voor een echte prognose. Ik reken 'm daarna live uit.`;

  const metrics = pg.hasEnough ? `<div class="pp-metrics">
    <div class="pp-tile"><span class="pp-tile-val">${pg.eindGem.toFixed(1).replace('.',',')}</span><span class="pp-tile-lbl">gem. eindcijfer</span></div>
    <div class="pp-tile"><span class="pp-tile-val">${pg.ceGem.toFixed(1).replace('.',',')}</span><span class="pp-tile-lbl">CE-gemiddelde ${pg.r1?'✓':'✗ (min 5,5)'}</span></div>
    ${pg.risico&&pg.risico.eind<6?`<div class="pp-tile pp-tile-risk"><span class="pp-tile-val">${pg.risico.eind}</span><span class="pp-tile-lbl">risico: ${pg.risico.vak}</span></div>`:''}
  </div>`:'';

  const rowHtml=rows.map(r=>{
    const kl=_ppStatusKleur(r.status);
    const seCell = r.se!=null ? `<span class="pp-se">${r.se.toFixed(1).replace('.',',')}</span>`
      : `<button class="pp-cell-cta" onclick="event.stopPropagation();goToCijferInvoer()">SE?</button>`;
    const ceCell = r.ce!=null ? `<span class="pp-ce">${r.schatting?'~':''}${r.ce.toFixed(1).replace('.',',')}</span>`
      : `<button class="pp-cell-cta" onclick="event.stopPropagation();openVak('${r.vakId}')">oefen</button>`;
    const eindCell = r.eind!=null ? `<span class="pp-eind" style="color:${kl}">${r.eind}</span>` : `<span class="pp-eind pp-eind-none">-</span>`;
    return `<div class="pp-row" onclick="_plusPickVak('${r.vakId}')">
      <span class="pp-dot" style="background:${kl}"></span>
      <span class="pp-vak">${r.vak}</span>
      <span class="pp-col">${seCell}</span>
      <span class="pp-col">${ceCell}</span>
      <span class="pp-col pp-col-eind">${eindCell}</span>
    </div>`;
  }).join('');

  let actie='';
  if(pg.risicoActie && pg.risicoActie.gap>0){
    actie=`<button class="pp-actie" onclick="_plusPickVak('${pg.risicoActie.vakId}')">
      <span class="pp-actie-txt">🎯 <b>${pg.risicoActie.vak}</b>: CE +${pg.risicoActie.gap.toFixed(1).replace('.',',')} omhoog → voldoende</span>
      <span class="pp-actie-arr">→</span></button>`;
  }
  const coverage = (pg.ontbreektSE||pg.ontbreektData) ? `<div class="pp-cover">Op basis van ${rows.filter(r=>r.eind!=null).length} vak(ken).${pg.ontbreektData?` Oefen meer vakken`:''}${pg.ontbreektSE?`${pg.ontbreektData?' en vul':' Vul'} ontbrekende SE-cijfers in`:''} voor een completer beeld.</div>`:'';

  return `<div class="plus-card plus-prognose">
    <div class="plus-card-h">Slaag ik? <span class="pp-live">● live</span></div>
    <div class="pp-verdict ${VS.cls}"><span class="pp-verdict-ic">${VS.ic}</span><span class="pp-verdict-txt"><b>${VS.kop}</b><small>${sub}</small></span></div>
    ${metrics}
    <div class="pp-table">
      <div class="pp-row pp-head"><span class="pp-dot" style="visibility:hidden"></span><span class="pp-vak">vak</span><span class="pp-col">SE</span><span class="pp-col">CE*</span><span class="pp-col pp-col-eind">eind</span></div>
      ${rowHtml}
    </div>
    ${actie}
    ${coverage}
    <div class="pp-fine">*CE = voorspeld uit je oefening (~ = schatting). SE vul je zelf in. Eindcijfer = afgerond gemiddelde. Indicatie zonder N-term: richting, geen garantie.</div>
  </div>`;
}

// ── Kaart: persoonlijke Vonk-check-in (#4) ─────────────────────────────────
function _plusVonkCoachHTML(niveau){
  const c=plusVonkCoach(niveau);
  if(!c || typeof mascotBubble!=='function') return '';
  const actions = c.actie ? `<button class="coach-cta" onclick="${c.actie.onclick}">${c.actie.label} →</button>` : '';
  const msg = `<b class="pvc-kop">${c.kop}</b>${c.msg}`;
  const naam = (typeof MASCOT_NAME!=='undefined'?MASCOT_NAME:'Vonk')+' · je examencoach';
  return `<div class="plus-vonkcoach">${mascotBubble(msg, c.mood, {closable:false, name:naam, actionsHTML:actions})}</div>`;
}

// ── Kaart: tijdsdruk / tempo (#5) ──────────────────────────────────────────
function _plusTempoHTML(vakId, niveau, isPlus){
  const t=plusTempoAnalyse(vakId,niveau);
  if(!t) return ''; // geen getimede proefexamens → niets tonen
  if(!isPlus){
    return `<div class="plus-card locked"><div class="plus-card-h">Je tempo</div>
      <div class="plus-lock"><div class="pl-blur">Zie of je binnen de examentijd blijft en hoeveel je overhoudt</div>${_plusLockBtn()}</div></div>`;
  }
  const kl={krap:'#ef4444',oppassen:'#f59e0b',goed:'#22c55e',ruim:'#3b82f6'}[t.status];
  const pct=Math.max(6,Math.min(100,t.pctTijd));
  return `<div class="plus-card plus-tempo">
    <div class="plus-card-h">Je tempo <span class="pt-sub">laatste ${t.aantal} proefexamen(s)</span></div>
    <div class="pt-verdict" style="color:${kl}"><span class="pt-ic">⏱</span><b>${t.kop}</b><span class="pt-pct">${t.pctTijd}% van je tijd</span></div>
    <div class="pt-bar"><i style="width:${pct}%;background:${kl}"></i><span class="pt-finish" title="einde examentijd"></span></div>
    <div class="pt-scale"><span>start</span><span>~${t.overMin} min over</span><span>${t.totaalMin} min</span></div>
    <div class="pt-tip">${t.tip}</div>
  </div>`;
}

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

  // ── Kop: doel + voorspeld + dagen (losse bouwsteen) ──
  const head=_plusHeadHTML(vakId,niveau,isPlus);

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
    // #3: verse AI-vragen precies op je zwakste onderwerp (Plus).
    let trainBtn='';
    if(isPlus && top.length){
      const zw=top[0].domein; const zwEsc=String(zw).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
      trainBtn=`<button class="pz-train" onclick="openAiTrainer('${vakId}','${zwEsc}')">
        <span class="pz-train-txt">✦ Nieuwe oefenvragen over <b>${zw}</b></span>
        <span class="pz-train-sub">Vonk maakt steeds verse examenvragen op maat</span>
        <span class="pz-train-arr">→</span></button>`;
    }
    zwakHtml=`<div class="plus-card"><div class="plus-card-h">Waar je punten laat liggen</div>
      <div class="plus-zwak">${list}</div>${extra}${trainBtn}</div>`;
  }

  // ── Ontwikkeling ──
  let ontwHtml='';
  if(voorsp && voorsp.reeks.length>1){
    ontwHtml=`<div class="plus-card"><div class="plus-card-h">Je ontwikkeling</div>
      ${_plusSpark(voorsp.reeks)}
      <div class="plus-ontw-txt">${voorsp.reeks.map(c=>c.toFixed(1)).join(' → ')} <b class="${voorsp.trend>=0?'up':'down'}">${voorsp.trend>=0?'📈':'📉'} ${(voorsp.reeks[voorsp.reeks.length-1]-voorsp.reeks[0]>=0?'+':'')}${(voorsp.reeks[voorsp.reeks.length-1]-voorsp.reeks[0]).toFixed(1)}</b></div></div>`;
  }

  // ── Examenklaar per vak (readiness-vergelijking; het cijferoverzicht staat al
  //    bovenaan in de slaagprognose, dus hier alleen hoe klaar je per vak bent) ──
  let overHtml='';
  const overVakken = vakken.filter(v=>plusReadiness(v.vakId,niveau));
  if(overVakken.length>1){
    const rows=overVakken
      .map(v=>({v, rr:plusReadiness(v.vakId,niveau)}))
      .sort((a,b)=>a.rr.score-b.rr.score)
      .map(({v,rr})=>`<div class="po-row" onclick="_plusPickVak('${v.vakId}')"><span class="po-vak">${v.vak}</span>
        <span class="po-readybar"><i style="width:${rr.score}%;background:${rr.score>=70?'#22c55e':rr.score>=45?'#f59e0b':'#ef4444'}"></i></span>
        <span class="po-ready">${rr.score}%</span></div>`).join('');
    overHtml=`<div class="plus-card"><div class="plus-card-h">Examenklaar per vak</div>
      <div class="plus-over">${rows}</div></div>`;
  }

  // ── "Vandaag voor jou" (cross-vak, primaire actie; losse bouwsteen) ──
  const vandaagHtml=_plusVandaagHTML(niveau,isPlus);

  // ── Examenkalender ──
  let kalHtml='';
  const exm=plusMijnExamens(niveau);
  if(exm.length){
    const rows=exm.slice(0,6).map((e,i)=>`<div class="pk-row${i===0?' next':''}"><span class="pk-vak">${e.vak}</span><span class="pk-date">${_plusDatum(e.datum)}</span><span class="pk-days">nog ${e.dagen} dagen</span></div>`).join('');
    kalHtml=`<div class="plus-card"><div class="plus-card-h">Examenkalender</div><div class="plus-kal">${rows}</div></div>`;
  }

  // ── Examenmodus-knop (afleidingsvrije volledige simulatie) ──
  const modusHtml = `<button class="plus-modus" onclick="startExamenmodus('${vakId}')"><span class="pm-ic">🎧</span><span class="pm-t">Examenmodus<small>afleidingsvrije simulatie op tijd</small></span><span class="pm-arr">→</span></button>`;

  // Vonk legt de examentrainer uit (eenmalig te sluiten) + wekelijkse kist.
  let coachHtml='';
  try{ if(!localStorage.getItem('slagio_plus_coach_done')) coachHtml=_plusCoach('Dit is je <b>examentrainer</b>. Bovenaan zie je wat je vandaag het beste kunt doen; daaronder je verwachte cijfer, waar je punten laat liggen en hoe examenklaar je bent. Elke week ligt er ook een <b>kist</b> voor je klaar. 🎁'); }catch(e){}
  const kistHtml=_plusKistHTML();

  // ── Live slaagprognose (de eerste vraag: "sta ik ervoor?") ──
  const prognoseHtml=_plusPrognoseHTML(niveau,isPlus);

  // ── Tempo / tijdsdruk (per vak) ──
  const tempoHtml=_plusTempoHTML(vakId,niveau,isPlus);

  // ── Persoonlijke Vonk-check-in (na de eenmalige intro; verwijst naar je eigen data) ──
  const vonkHtml = coachHtml ? '' : _plusVonkCoachHTML(niveau);

  el.innerHTML = `${coachHtml}${vonkHtml}${prognoseHtml}${vandaagHtml}${kistHtml}${kalHtml}
    <div class="plus-sec-h">Per vak</div>
    <div class="plus-vchips">${chips}</div>${head}${modusHtml}${rapHtml}${readyHtml}${tempoHtml}${zwakHtml}${ontwHtml}${overHtml}
    ${!isPlus?`<div class="plus-upsell-foot"><b>Slagio Plus</b> geeft je AI-nakijken, je verwachte cijfer, readiness en een persoonlijk plan. Oefenen en zelf nakijken blijven altijd gratis.<button class="plus-cta" onclick="plusIntro()">🎯 Bekijk Slagio Plus</button></div>`:''}`;
  try{ _plusAnimate('sc-plus'); }catch(e){}
}
function _plusDatum(iso){ try{ const d=new Date(iso+'T00:00:00'); const mn=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec']; return d.getDate()+' '+mn[d.getMonth()]; }catch(e){ return iso; } }

function _plusLockBtn(){ return `<button class="pl-btn" onclick="plusIntro()">🔒 Slagio Plus</button>`; }

// ═══════════════════════════════════════════════════════════════════════════
// #3 · AI-oefentrainer: oneindige verse vragen op je zwakke punten
// Eén AI-call levert een set meerkeuzevragen; de client kijkt ze zelf na
// (correct antwoord meegeleverd). Gevoed door je zwakste domein + echte
// voorbeeldvragen als stijlanker. De moat: onbeperkte, persoonlijke oefening.
// ═══════════════════════════════════════════════════════════════════════════
let _AIT=null;
function _aitEsc(s){ return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
// Een paar echte vragen uit dit vak/domein als stijlanker voor de AI.
function _plusVoorbeeldVragen(vakId, domeinNaam, n){
  try{
    const vak=(typeof getVK==='function'?getVK():[]).find(v=>v.id===vakId); if(!vak) return [];
    let doms=vak.domeinen||[];
    const hit=doms.find(d=>d.naam===domeinNaam); if(hit) doms=[hit];
    const out=[];
    doms.forEach(d=>{ (d.sv||[]).concat(d.oe||[]).forEach(q=>{ if(q&&q.v&&out.length<(n||3)) out.push(String(q.v).slice(0,240)); }); });
    return out.slice(0,n||3);
  }catch(e){ return []; }
}
function openAiTrainer(vakId, onderwerp){
  const niveau=(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo';
  const vak=(typeof getVK==='function'?getVK():[]).find(v=>v.id===vakId);
  const vakNaam=vak?vak.naam:vakId;
  _AIT={vakId, vak:vakNaam, niveau, onderwerp:onderwerp||'', vragen:[], idx:0, score:0, answered:false};
  _aitEnsureOverlay();
  _aitShowLoading();
  const voorbeelden=_plusVoorbeeldVragen(vakId, onderwerp, 3);
  aiGenereerVragen({vak:vakNaam, niveau, onderwerp:onderwerp||vakNaam, voorbeelden, aantal:5}).then(res=>{
    if(!_AIT) return;
    if(res.login){ _aitClose(); if(typeof showToast==='function') showToast('Log in om AI-vragen te genereren'); try{ if(typeof openProfiel==='function') openProfiel(); }catch(e){} return; }
    if(res.limit){ _aitClose(); if(typeof showPlusUpsell==='function') showPlusUpsell({bron:'generate'}); else if(typeof showToast==='function') showToast('Je wekelijkse AI-tegoed is op'); return; }
    if(res.error || !res.vragen || !res.vragen.length){ _aitShowError(); return; }
    _AIT.vragen=res.vragen; _AIT.idx=0; _AIT.score=0; _aitRenderVraag();
  });
}
function _aitEnsureOverlay(){
  if(document.getElementById('ait-overlay')) return;
  const ov=document.createElement('div');
  ov.id='ait-overlay'; ov.className='ait-overlay';
  ov.innerHTML=`<div class="ait-modal" role="dialog" aria-label="AI-oefentrainer">
    <button class="ait-x" onclick="_aitClose()" aria-label="Sluiten">✕</button>
    <div id="ait-body"></div>
  </div>`;
  document.body.appendChild(ov);
}
function _aitClose(){ const ov=document.getElementById('ait-overlay'); if(ov) ov.remove(); _AIT=null; }
function _aitBody(html){ const b=document.getElementById('ait-body'); if(b) b.innerHTML=html; }
function _aitShowLoading(){
  const vonk=(typeof mascotSVG==='function')?mascotSVG('denk',72):'🦊';
  _aitBody(`<div class="ait-load"><div class="ait-vonk">${vonk}</div>
    <div class="ait-load-t">Vonk schrijft verse vragen<br><b>${_aitEsc(_AIT.onderwerp||_AIT.vak)}</b></div>
    <div class="ait-dots"><i></i><i></i><i></i></div></div>`);
}
function _aitShowError(){
  _aitBody(`<div class="ait-load"><div class="ait-load-t">Het lukte even niet om vragen te maken.<br>Probeer het zo nog eens.</div>
    <button class="ait-btn" onclick="_aitClose()">Sluiten</button></div>`);
}
function _aitRenderVraag(){
  const q=_AIT.vragen[_AIT.idx]; if(!q){ _aitFinish(); return; }
  _AIT.answered=false;
  const n=_AIT.vragen.length;
  const opts=q.o.map((o,i)=>`<button class="ait-opt" data-i="${i}" onclick="_aitAnswer(${i})">${_aitEsc(o)}</button>`).join('');
  _aitBody(`<div class="ait-head"><span class="ait-badge">✦ AI-training</span><span class="ait-prog">${_AIT.idx+1} / ${n}</span></div>
    <div class="ait-topic">${_aitEsc(_AIT.onderwerp||_AIT.vak)}</div>
    <div class="ait-vraag">${_aitEsc(q.v)}</div>
    <div class="ait-opts">${opts}</div>
    <div class="ait-fb" id="ait-fb"></div>
    <button class="ait-btn ait-next" id="ait-next" style="display:none" onclick="_aitNext()">Volgende →</button>`);
}
function _aitAnswer(i){
  if(!_AIT || _AIT.answered) return;
  _AIT.answered=true;
  const q=_AIT.vragen[_AIT.idx];
  const ok=(i===q.c);
  if(ok) _AIT.score++;
  document.querySelectorAll('.ait-opt').forEach(btn=>{
    const bi=parseInt(btn.dataset.i);
    btn.disabled=true;
    if(bi===q.c) btn.classList.add('ait-correct');
    else if(bi===i) btn.classList.add('ait-wrong');
  });
  try{ if(typeof playSound==='function') playSound(ok?'correct':'wrong'); }catch(e){}
  const fb=document.getElementById('ait-fb');
  if(fb) fb.innerHTML=`<div class="ait-fb-row ${ok?'good':'bad'}">${ok?'✓ Goed!':'✗ Niet helemaal.'} ${q.uitleg?_aitEsc(q.uitleg):''}</div>`;
  const nx=document.getElementById('ait-next'); if(nx){ nx.style.display=''; nx.textContent=(_AIT.idx>=_AIT.vragen.length-1)?'Bekijk resultaat →':'Volgende →'; }
}
function _aitNext(){ if(!_AIT) return; _AIT.idx++; if(_AIT.idx>=_AIT.vragen.length) _aitFinish(); else _aitRenderVraag(); }
function _aitFinish(){
  const n=_AIT.vragen.length, sc=_AIT.score;
  const pct=n?sc/n:0;
  // Voeg de sessie toe aan je Plus-data zodat het dashboard ervan leert.
  try{ if(typeof plusRecordQuiz==='function') plusRecordQuiz({vakId:_AIT.vakId, vak:_AIT.vak, niveau:_AIT.niveau, domein:_AIT.onderwerp||'Overig', behaald:sc, max:n, aantal:n, bron:'quiz'}); }catch(e){}
  const mood=pct>=0.8?'trots':pct>=0.5?'goed':'kijk';
  const vonk=(typeof mascotSVG==='function')?mascotSVG(mood,72):'🦊';
  const kop=pct>=0.8?'Sterk!':pct>=0.5?'Goed bezig':'Nog even oefenen';
  _aitBody(`<div class="ait-done"><div class="ait-vonk">${vonk}</div>
    <div class="ait-done-kop">${kop}</div>
    <div class="ait-score">${sc} / ${n} goed</div>
    <div class="ait-done-sub">Verse vragen op <b>${_aitEsc(_AIT.onderwerp||_AIT.vak)}</b>. Deze telt mee in je dashboard.</div>
    <button class="ait-btn ait-again" onclick="_aitAgain()">✦ Nog een verse set</button>
    <button class="ait-btn ait-ghost" onclick="_aitClose();try{renderPlusDashboard()}catch(e){}">Klaar</button>
  </div>`);
}
function _aitAgain(){ if(!_AIT) return; const v=_AIT.vakId, o=_AIT.onderwerp; openAiTrainer(v, o); }

// ── Vonk-uitleg (coach-bubble) ─────────────────────────────────────────────
function plusCoachDone(){ try{ localStorage.setItem('slagio_plus_coach_done','1'); }catch(e){} const b=document.getElementById('plus-coach'); if(b) b.remove(); }
function _plusCoach(text){
  if(typeof mascotBubble!=='function') return '';
  return `<div id="plus-coach">${mascotBubble(text,'blij',{closable:false, actionsHTML:'<button class="coach-cta" onclick="plusCoachDone()">Snap ik 👍</button>'})}</div>`;
}

// ── Wekelijkse Plus-kist (extra kisten, outfits & looks voor Plus-leden) ───
// Hergebruikt het bestaande kist-systeem (showChest) met een flink hogere kans
// op een outfit/look. Eén keer per week te openen.
function _plusChestRoll(){
  const rare=Math.random()<0.5; // Plus: veel vaker een cosmetisch item dan de gewone 16%
  if(rare){
    try{
      const all=(typeof COSMETICS_VONK!=='undefined'?COSMETICS_VONK:[]).concat(typeof COSMETICS_AV!=='undefined'?COSMETICS_AV:[]);
      const owned=(typeof getOwnedCosmetics==='function')?getOwnedCosmetics():[];
      const locked=all.filter(c=>owned.indexOf(c.id)===-1);
      if(locked.length) return {rare:true,item:locked[Math.floor(Math.random()*locked.length)]};
    }catch(e){}
  }
  return {rare:false,coins:40+Math.floor(Math.random()*61)}; // 40–100 munten (royaler)
}
function _plusKistWeek(){ return 'slagio_plus_kist_'+Math.floor(Date.now()/6048e5); }
function plusKistBeschikbaar(){ try{ return !localStorage.getItem(_plusKistWeek()); }catch(e){ return true; } }
function _plusKistHTML(){
  const isPlus=(typeof plusActive==='function') && plusActive();
  if(!isPlus){
    return `<button class="plus-kist locked" onclick="plusIntro()"><span class="pk-ic">🎁</span><span class="pk-t">Wekelijkse Plus-kist<small>Munten plus exclusieve outfits &amp; looks, met Plus</small></span><span class="pm-arr">🔒</span></button>`;
  }
  const beschikbaar=plusKistBeschikbaar();
  return `<button class="plus-kist${beschikbaar?' ready':' done'}" onclick="plusClaimKist()">
    <span class="pk-ic">🎁</span>
    <span class="pk-t">Wekelijkse Plus-kist<small>${beschikbaar?'Klaar om te openen: munten, outfits &amp; looks':'Geopend. Volgende week weer een nieuwe'}</small></span>
    <span class="pk-cta">${beschikbaar?'Openen':'✓'}</span></button>`;
}
function _plusUpdateKist(){ const el=document.querySelector('#sc-plus-body .plus-kist'); if(el) el.outerHTML=_plusKistHTML(); }
function plusClaimKist(){
  if(!(typeof plusActive==='function' && plusActive())){ openPlusIntro(); return; }
  if(!plusKistBeschikbaar()){ try{ if(typeof showToast==='function') showToast('Je Plus-kist van deze week is al open. Volgende week weer! 🎁'); }catch(e){} return; }
  try{ localStorage.setItem(_plusKistWeek(),'1'); }catch(e){}
  const reward=_plusChestRoll();
  try{
    if(typeof showChest==='function') showChest(function(){ try{_plusUpdateKist();}catch(e){} }, {reward:reward, kicker:'Je wekelijkse Plus-kist! 🎁', variant:'chest-plus'});
    else { if(reward.coins && typeof addCoins==='function') addCoins(reward.coins); _plusUpdateKist(); }
  }catch(e){ _plusUpdateKist(); }
  try{ if(typeof trackEvent==='function') trackEvent('plus_kist',{rare:!!reward.rare}); }catch(e){}
}

// ═══════════════════════════════════════════════════════════════════════
// DOPAMINE-LAAG — beweging + progressie + beloning maken de pagina levend.
// Onderbouwd door onderzoek naar micro-rewards: cijfers tellen op, ringen en
// balken vullen zich, de sparkline tekent zichzelf, kaarten komen gespreid
// binnen, en een behaald doel geeft een kleine sparkle. Alles kort (<1,1s),
// ease-out/veerkrachtig, en volledig uitgeschakeld bij prefers-reduced-motion.
// ═══════════════════════════════════════════════════════════════════════
function _plusReduced(){ try{ return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }catch(e){ return false; } }
function _plusEase(t){ return 1-Math.pow(1-t,3); } // easeOutCubic
function _plusCountUp(el){
  const raw=(el.getAttribute('data-cu')!=null)?el.getAttribute('data-cu'):el.textContent;
  if(el.children && el.children.length) return; // markup niet platslaan
  el.setAttribute('data-cu', raw);
  const m=String(raw).match(/^(\D*)(\d+(?:[.,]\d+)?)(\D*)$/);
  if(!m){ el.textContent=raw; return; }
  const pre=m[1], numStr=m[2], suf=m[3];
  const dec=(numStr.split(/[.,]/)[1]||'').length;
  const sep=numStr.indexOf(',')>=0?',':'.';
  const target=parseFloat(numStr.replace(',','.'));
  if(isNaN(target)){ el.textContent=raw; return; }
  if(_plusReduced()){ el.textContent=raw; return; }
  const dur=850, t0=performance.now();
  (function step(now){
    const p=Math.min(1,(now-t0)/dur), v=target*_plusEase(p);
    el.textContent=pre+v.toFixed(dec).replace('.',sep)+suf;
    if(p<1) requestAnimationFrame(step); else el.textContent=raw;
  })(t0);
}
function _plusSparkle(host){
  try{
    host.style.position='relative';
    for(let i=0;i<7;i++){
      const s=document.createElement('span'); s.className='plus-sparkle';
      const ang=Math.random()*6.283, dist=14+Math.random()*22;
      s.style.setProperty('--dx',(Math.cos(ang)*dist).toFixed(0)+'px');
      s.style.setProperty('--dy',(Math.sin(ang)*dist).toFixed(0)+'px');
      s.style.animationDelay=(Math.random()*0.15).toFixed(2)+'s';
      host.appendChild(s); setTimeout(()=>{try{s.remove();}catch(e){}},1300);
    }
  }catch(e){}
}
function _plusAnimate(screenId){
  // Alleen animeren bij echte binnenkomst (openPlusDashboard/openPlusIntro).
  // Bij een re-render in de pagina zelf (vak wisselen, doel/tijd aanpassen)
  // staat alles al in eindtoestand - dan NIETS opnieuw laten binnenkomen.
  const entering = !!window._plusEntering; window._plusEntering=false;
  if(!entering) return;
  const root=document.getElementById(screenId==='sc-plus'?'sc-plus-body':'sc-plus-intro-body');
  if(!root) return;
  const reduced=_plusReduced();
  // 1) gespreide binnenkomst van de kaarten
  if(!reduced){
    [...root.children].forEach((c,i)=>{
      c.style.animation='none'; void c.offsetWidth;
      c.style.animation='plusRise .5s cubic-bezier(.22,1,.36,1) '+Math.min(i*0.055,0.5).toFixed(3)+'s backwards';
    });
  }
  // 2) cijfers tellen op (jouw eigen getallen = de echte beloning)
  root.querySelectorAll('.pf-num,.ring span,.pr-fac b,.pz-pct,.po-ready').forEach(_plusCountUp);
  // 3) readiness-ring vult zich
  root.querySelectorAll('.ring').forEach(r=>{
    const target=parseFloat(r.style.getPropertyValue('--p')||'0')||0;
    if(reduced){ r.style.setProperty('--p',String(target)); return; }
    const t0=performance.now(), dur=1000;
    r.style.setProperty('--p','0');
    (function st(now){ const p=Math.min(1,(now-t0)/dur); r.style.setProperty('--p',(target*_plusEase(p)).toFixed(1)); if(p<1) requestAnimationFrame(st); })(t0);
  });
  // 4) readiness-balken schuiven open
  if(!reduced) root.querySelectorAll('.pr-fac .pr-bar i').forEach(bar=>{
    const w=bar.style.width; if(!w) return;
    bar.style.transition='none'; bar.style.width='0%'; void bar.offsetWidth;
    bar.style.transition='width 1s cubic-bezier(.22,1,.36,1)'; bar.style.width=w;
  });
  // 5) sparkline tekent zichzelf
  if(!reduced) root.querySelectorAll('.plus-spark polyline').forEach(pl=>{
    try{ const len=pl.getTotalLength(); if(!len) return;
      pl.style.strokeDasharray=len; pl.style.strokeDashoffset=len; pl.getBoundingClientRect();
      pl.style.transition='stroke-dashoffset 1.1s ease'; pl.style.strokeDashoffset='0';
    }catch(e){}
  });
  // 6) sparkle als het doel gehaald is
  if(!reduced){ const done=root.querySelector('.pf-need.done'); if(done) setTimeout(()=>_plusSparkle(done),650); }
}
function plusTijd(){ try{ const v=parseInt(localStorage.getItem('slagio_plus_tijd')||'20',10); return isNaN(v)?20:v; }catch(e){ return 20; } }
function plusSetTijd(m){
  try{ localStorage.setItem('slagio_plus_tijd', String(m)); }catch(e){}
  // Ververs alleen het "Vandaag voor jou"-blok, niet het hele dashboard.
  const old=document.querySelector('#sc-plus-body .plus-vandaag');
  if(old){ const niveau=(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo'; old.outerHTML=_plusVandaagHTML(niveau); }
  else if(typeof renderPlusDashboard==='function') renderPlusDashboard();
}
function _plusStart(vakId){
  try{ const vk=(typeof getVK==='function'?getVK():[]).find(v=>v.id===vakId); if(vk && typeof openVak==='function'){ openVak(vk); return; } }catch(e){}
  try{ show('sc-home'); }catch(e){}
}

// ═══════ PLUS VERKOOPPAGINA ═══════
// De conversie-surface. Opent met de vraag, niet met de techniek. Verkoopt
// gemak/zekerheid, nooit "je kunt niets meer" — de kern blijft altijd gratis.
const _PLUS_PLANNEN = [
  {id:'najaar', naam:'Najaar', prijs:'€ 14,99', periode:'september tot 31 januari', sub:'Begin je examenjaar slim.'},
  {id:'jaar',   naam:'Heel examenjaar', prijs:'€ 24,99', periode:'nu tot en met de examens', sub:'Alles, het hele jaar - en goedkoper dan de seizoenen los.', best:true},
  {id:'examen', naam:'Examenperiode', prijs:'€ 17,99', periode:'februari tot en met de examens', sub:'De laatste, beslissende fase.'},
  {id:'flex',   naam:'Flex', prijs:'€ 6,99', periode:'per maand, maandelijks opzegbaar', sub:'Liever niet ineens.'},
];
const _PLUS_FEATURES = [
  ['🤖','AI-nakijken','Laat open vragen nakijken tegen het echte scoringsvoorschrift, met feedback per punt.'],
  ['🎯','Zwakke-puntenanalyse','Zie precies welke onderwerpen en vraagtypes je punten kosten.'],
  ['🗺️','Persoonlijk studieplan','Elke dag de training die op dat moment het meeste oplevert.'],
  ['📈','Verwacht cijfer','Zie hoe je ervoor staat en hoe je resultaat zich ontwikkelt.'],
  ['🏆','Examen-readiness','Zie hoe klaar Slagio je vindt, over vijf factoren.'],
  ['🎁','Wekelijkse Plus-kist','Elke week een kist vol munten en exclusieve outfits &amp; looks voor Vonk en je avatar.'],
];
const _PLUS_VERGELIJK = [
  ['Alle oefenvragen &amp; examens', true, true],
  ['Modelantwoorden &amp; zelf nakijken', true, true],
  ['XP, streaks, foutenboek', true, true],
  ['AI-nakijken', '3&#215;/week', '★ ruim'],
  ['Zwakke-puntenanalyse', 'basis', '★ uitgebreid'],
  ['Studieplan &amp; verwacht cijfer', false, true],
  ['Examen-readiness &amp; rapport', false, true],
  ['Wekelijkse kist, outfits &amp; looks', false, '★ Plus'],
  ['Alle vakken inbegrepen', true, true],
];
// Korte, visueel rijke uitgelichte features (4 tegels) - de highlights, geen
// volledige lijst (die staat in de vergelijkingstabel).
const _PLUS_HIGHLIGHTS = [
  ['🤖','AI-nakijken','Feedback per scoringspunt op je open vragen.'],
  ['📈','Verwacht cijfer','Zie zwart-op-wit hoe je ervoor staat.'],
  ['🗺️','Vandaag-plan','Elke dag precies wat het meeste oplevert.'],
  ['🎁','Wekelijkse kist','Munten plus exclusieve outfits &amp; looks.'],
];

function openPlusIntro(){ window._plusEntering=true; try{ show('sc-plus-intro'); }catch(e){} renderPlusIntro(); }
// plusIntro() (aangeroepen vanuit sim.js/dashboard) opent voortaan het scherm.
function plusIntro(){ openPlusIntro(); }

// Persoonlijk blok: verkoop met de eigen cijfers van de leerling ("dit lost
// Slagio voor jou op"), niet met een featurelijst. Leeg als er nog geen data is.
function _plusIntroPersoonlijk(niveau){
  const pri = (typeof plusPrioriteit==='function') ? plusPrioriteit(niveau) : null;
  if(!pri) return '';
  const p = plusProfiel(pri.vakId, niveau);
  if(!p || !p.voorspeld) return '';
  const zwak = p.domeinen && p.domeinen[0];
  const openZwak = p.types && p.types.open!=null && (p.types.mc==null || p.types.open<=p.types.mc);
  const chips=[];
  if(zwak && zwak.pct<0.75) chips.push(`<div class="pip-chip"><span class="pip-chip-dot"></span>Zwakste onderwerp: <b>${zwak.domein}</b> · ${Math.round(zwak.pct*100)}%</div>`);
  if(openZwak) chips.push(`<div class="pip-chip"><span class="pip-chip-dot"></span>Meeste puntverlies bij <b>open vragen</b></div>`);
  const vd = (typeof plusVandaag==='function') ? plusVandaag(niveau) : null;
  const doen = vd ? vd.taken.slice(0,3).map(t=>t.t).join(' · ') : '';
  const gap = Math.max(0, Math.round((p.doel - p.voorspeld.cijfer)*10)/10);
  const pct = Math.max(6, Math.min(100, Math.round(p.voorspeld.cijfer/(p.doel||1)*100)));
  return `<div class="pi-perso">
    <div class="pip-eyebrow"><span class="pip-eye-dot"></span>Jouw stand nu · ${pri.vak}</div>
    <div class="pip-forecast">
      <div class="pip-fc"><span class="pip-fc-num">${p.voorspeld.cijfer.toFixed(1)}</span><span class="pip-fc-lbl">verwacht nu</span></div>
      <span class="pip-arrow" aria-hidden="true">→</span>
      <div class="pip-fc goal"><span class="pip-fc-num">${p.doel.toFixed(1)}</span><span class="pip-fc-lbl">jouw doel</span></div>
      ${p.dagen?`<div class="pip-days">nog ${p.dagen.dagen} dagen</div>`:''}
    </div>
    <div class="pip-prog"><div class="pip-prog-track"><i style="width:${pct}%"></i></div>
      <div class="pip-prog-cap">${gap>0?`nog <b>+${gap.toFixed(1)}</b> tot je doel`:'je doel is binnen bereik 🎉'}</div></div>
    ${chips.length?`<div class="pip-chips">${chips.join('')}</div>`:''}
    ${doen?`<div class="pip-doen"><span class="pip-doen-lbl">Vandaag</span><span>${doen}</span></div>`:''}
  </div>`;
}

function renderPlusIntro(){
  const el=document.getElementById('sc-plus-intro-body'); if(!el) return;
  const niveau=(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo';
  const perso=_plusIntroPersoonlijk(niveau);
  const active = (typeof plusActive==='function') && plusActive();
  const hl=_PLUS_HIGHLIGHTS.map(f=>`<div class="pi-hltile"><span class="pi-hltile-ic">${f[0]}</span><b>${f[1]}</b><span class="pi-hltile-d">${f[2]}</span></div>`).join('');
  const cell=v=> v===true?'<span class="pi-y">✓</span>' : (v===false?'<span class="pi-n">-</span>' : `<span class="pi-v">${v}</span>`);
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
      <h1>Weet jij of je <span class="pi-hl">klaar</span> bent voor je examen?</h1>
      <p class="pi-lead">Slagio Plus laat zien waar je punten laat liggen, wat je vandaag moet oefenen en hoe je ervoor staat richting je examen.</p>
      <p class="pi-killer">Van "ik moet meer leren" naar "ik weet precies wat ik moet doen."</p>
    </div>
    ${(typeof mascotBubble==='function')?mascotBubble('Ik ben <b>Vonk</b>! Gratis Slagio helpt je oefenen, dat blijft altijd zo. Met <b>Plus</b> laat ik je precies zien waar je staat, wat je vandaag moet doen, en kijk ik je open vragen na. En elke week krijg je een <b>kist</b> met munten en exclusieve outfits &amp; looks. 🎁','blij',{}):''}
    ${perso}
    ${active?`<div class="pi-active">✓ Je hebt Slagio Plus. <button class="pi-link" onclick="openPlusDashboard()">Naar je examentrainer</button></div>`:''}
    <div class="pi-hl-eyebrow">Dit krijg je met Plus</div>
    <div class="pi-highlights">${hl}</div>
    <div class="pi-vergelijk">
      <div class="pi-card-h">Gratis blijft gratis</div>
      <div class="pi-tbl-wrap"><table class="pi-tbl"><thead><tr><th></th><th>Gratis</th><th>Plus</th></tr></thead><tbody>${rows}</tbody></table></div>
      <p class="pi-note">Alles wat je nodig hebt om te slagen blijft gratis. Plus maakt je voorbereiding slimmer en persoonlijker.</p>
    </div>
    <div class="pi-prices-h">Kies je periode <small>alle vakken inbegrepen</small></div>
    <div class="pi-plans">${plans}</div>
    <div class="pi-trial">Twijfel je? Met een <b>gratis account</b> krijg je <b>3 AI-beoordelingen per week</b>, zonder creditcard. Zo voel je eerst wat Plus doet.</div>
  `;
  try{ _plusAnimate('sc-plus-intro'); }catch(e){}
}

// Checkout: nog niet gekoppeld aan de betaalprovider (Mollie/iDEAL). Registreert
// de interesse (waardevolle pre-launch data) en meldt dat het eraan komt.
function plusCheckout(plan){
  try{ if(typeof trackEvent==='function') trackEvent('plus_interesse',{plan}); }catch(e){}
  try{ showToast('Bedankt voor je interesse! Betalen via iDEAL komt er zeer binnenkort aan.'); }catch(e){}
}

// ── Premium Plus-pop-up (bv. wanneer de gratis AI-vragen op zijn) ──────────
function closePlusUpsell(){ const el=document.getElementById('plus-upsell'); if(el){ el.classList.remove('on'); setTimeout(()=>{ if(el.parentNode) el.remove(); },240); } }
function showPlusUpsell(opts){
  opts=opts||{};
  if(document.getElementById('plus-upsell')) return;
  const h = opts.title || 'Je gratis AI-vragen zijn op';
  const sub = opts.sub || 'Met Slagio Plus vraag je Vonk zo vaak je wilt - én krijg je je hele examentrainer erbij.';
  const el=document.createElement('div'); el.id='plus-upsell'; el.className='pu-ov';
  el.innerHTML=`<div class="pu-card" role="dialog" aria-label="Slagio Plus">
    <div class="pu-grip"></div>
    <div class="pu-badge">✦ Slagio Plus</div>
    <h3 class="pu-h">${h}</h3>
    <p class="pu-sub">${sub}</p>
    <div class="pu-benefits">
      <div class="pu-b"><span class="pu-b-ic">🤖</span><div><b>Onbeperkt AI</b><span>Vonk-uitleg &amp; nakijken zonder limiet</span></div></div>
      <div class="pu-b"><span class="pu-b-ic">📈</span><div><b>Je verwachte cijfer</b><span>en precies hoe je ervoor staat</span></div></div>
      <div class="pu-b"><span class="pu-b-ic">🎯</span><div><b>Wat moet ik vandaag doen</b><span>een slim plan op maat, elke dag</span></div></div>
      <div class="pu-b"><span class="pu-b-ic">🎁</span><div><b>Wekelijkse kist</b><span>munten plus exclusieve outfits &amp; looks</span></div></div>
    </div>
    <button class="pu-cta" onclick="closePlusUpsell();try{plusIntro()}catch(e){}">Bekijk Slagio Plus →</button>
    <button class="pu-later" onclick="closePlusUpsell()">Later</button>
  </div>`;
  el.addEventListener('click',e=>{ if(e.target===el) closePlusUpsell(); });
  document.body.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('on'));
  try{ if(typeof trackEvent==='function') trackEvent('plus_upsell_shown',{bron:opts.bron||'ai'}); }catch(e){}
}

// Sparkline van de cijferreeks (klein, inline SVG, themaneutraal via currentColor).
function _plusSpark(reeks){
  const w=280,h=54,pad=8; const min=Math.min.apply(null,reeks)-0.3, max=Math.max.apply(null,reeks)+0.3;
  const sx=i=>pad+(reeks.length<2?0:i/(reeks.length-1)*(w-2*pad));
  const sy=v=>h-pad-((v-min)/((max-min)||1))*(h-2*pad);
  const pts=reeks.map((v,i)=>sx(i).toFixed(1)+','+sy(v).toFixed(1)).join(' ');
  const dots=reeks.map((v,i)=>`<circle cx="${sx(i).toFixed(1)}" cy="${sy(v).toFixed(1)}" r="3" fill="currentColor"/>`).join('');
  return `<svg class="plus-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="cijferontwikkeling"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2.5"/>${dots}</svg>`;
}
