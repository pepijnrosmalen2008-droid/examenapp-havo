// ═══════ SIMULATIETOETS ═══════
let SIM={};
const SIM_MODES={
  oefenen:{key:'oefenen',label:'Oefenen', icon:'📖',vpd:1,  tpq:0, deelsPts:0.5, clr:'#22c55e',badgeCls:'sim-mi-oe'},
  normaal: {key:'normaal', label:'Normaal', icon:'🎯',vpd:999,tpq:5, deelsPts:0.5, clr:'#6366f1',badgeCls:'sim-mi-no'},
  examen:  {key:'examen',  label:'Examen',  icon:'⚡',vpd:999,tpq:3, deelsPts:0.25,clr:'#ef4444',badgeCls:'sim-mi-ex'},
};
let _simMode='normaal';

function simSelectMode(key){
  _simMode=key;
  ['oefenen','normaal','examen'].forEach(k=>{
    document.getElementById('sim-mc-'+k.slice(0,2))?.classList.toggle('selected',k===key);
  });
  // Update hint + info-grid
  const m=SIM_MODES[key];
  const hints={
    oefenen:'📖 <strong>Oefenen</strong> — 1 willekeurige vraag per CE-domein, geen tijdslimiet. Ideaal om rustig te verkennen zonder druk.',
    normaal: '🎯 <strong>Normaal</strong> — alle vragen, 5 minuten per vraag. Realistische oefensessie met tijdlimiet.',
    examen:  '⚡ <strong>Examen</strong> — alle vragen, 3 minuten per vraag. <em>Deels goed</em> telt als kwart punt — scherpe beoordelingen vereist.',
  };
  const hintClrs={oefenen:'rgba(34,197,94,.08)',normaal:'rgba(99,102,241,.07)',examen:'rgba(239,68,68,.07)'};
  const hintBrdr={oefenen:'rgba(34,197,94,.25)',normaal:'rgba(99,102,241,.2)',examen:'rgba(239,68,68,.2)'};
  const hintTxt={oefenen:'#16a34a',normaal:'#818cf8',examen:'#ef4444'};
  const hint=document.getElementById('sim-mode-hint');
  if(hint){hint.style.background=hintClrs[key];hint.style.border='1px solid '+hintBrdr[key];hint.style.color=hintTxt[key];hint.innerHTML=hints[key];}
  // Recompute grid if vak known
  if(SIM.vak)_simUpdateInfoGrid();
}

function _simUpdateInfoGrid(){
  const m=SIM_MODES[_simMode];
  const vak=SIM.vak;
  const ceDomeinen=vak.domeinen.filter(d=>!d.ceStatus||d.ceStatus!=='SE');
  let total=0;
  ceDomeinen.forEach(d=>{
    const pool=(d.oe||[]).filter(q=>q.v&&q.u);
    total+=Math.min(pool.length,m.vpd);
  });
  const mins=m.tpq===0?'∞':total*m.tpq;
  const grid=document.getElementById('sim-info-grid');
  if(!grid)return;
  grid.innerHTML=`
    <div class="sim-info-card"><div class="sim-info-num">${total}</div><div class="sim-info-lbl">Open vragen</div></div>
    <div class="sim-info-card"><div class="sim-info-num">${mins}${m.tpq?'&nbsp;min':''}</div><div class="sim-info-lbl">Tijdlimiet</div></div>
    <div class="sim-info-card"><div class="sim-info-num">${ceDomeinen.length}</div><div class="sim-info-lbl">CE-domeinen</div></div>`;
  const btn=document.getElementById('sim-start-btn');
  if(btn){btn.style.background=m.key==='examen'?'linear-gradient(135deg,#ef4444,#f87171)':m.key==='oefenen'?'linear-gradient(135deg,#22c55e,#4ade80)':'linear-gradient(135deg,#6366f1,#818cf8)';btn.style.boxShadow='0 4px 18px '+m.clr+'55';}
}

function startSimToets(){
  trackEvent('simulatietoets',{vak:ST.vak?.naam||null});
  if(!ST.vak)return;
  const vak=ST.vak;
  SIM={vak,questions:[],idx:0,answers:[],timer:null,duration:0,started:false,mode:_simMode};

  // Reset mode selector UI to current _simMode
  simSelectMode(_simMode);

  // Store vak reference so _simUpdateInfoGrid works
  _simUpdateInfoGrid();

  // Update setup screen
  document.getElementById('sim-nav-title').textContent=vak.naam+' — Simulatie';
  document.getElementById('sim-setup-title').textContent='Simulatietoets '+vak.naam;
  const ceDomeinen=vak.domeinen.filter(d=>!d.ceStatus||d.ceStatus!=='SE');
  document.getElementById('sim-setup-desc').textContent=ceDomeinen.length+' CE-domeinen · kies een moeilijkheidsgraad.';

  // Reset phases
  document.getElementById('sim-setup').style.display='';
  document.getElementById('sim-quiz').style.display='none';
  document.getElementById('sim-result').style.display='none';
  document.getElementById('sim-timer-chip').style.display='none';
  show('sc-simtoets');
}

function simStart(){
  // Build question pool based on selected mode
  const m=SIM_MODES[_simMode]||SIM_MODES.normaal;
  SIM.mode=m;
  const vak=SIM.vak;
  const ceDomeinen=vak.domeinen.filter(d=>!d.ceStatus||d.ceStatus!=='SE');
  SIM.questions=[];
  ceDomeinen.forEach(d=>{
    const pool=(d.oe||[]).filter(q=>q.v&&q.u).map(q=>({...q,_type:'open',domeinId:d.id,domeinNaam:d.naam,domeinKleur:vak.kleur}));
    const shuffled=[...pool].sort(()=>Math.random()-.5);
    shuffled.slice(0,m.vpd).forEach(q=>SIM.questions.push(q));
  });
  SIM.questions.sort(()=>Math.random()-.5);

  const total=SIM.questions.length;
  SIM.duration=m.tpq>0?total*m.tpq*60:0; // 0 = no timer

  document.getElementById('sim-setup').style.display='none';
  document.getElementById('sim-quiz').style.display='';
  const timerChip=document.getElementById('sim-timer-chip');
  timerChip.style.display=m.tpq>0?'':'none';

  // Mode badge in nav
  const navBadge=document.getElementById('sim-mode-nav-badge');
  if(navBadge){navBadge.className='sim-mode-indicator '+m.badgeCls;navBadge.textContent=m.icon+' '+m.label;navBadge.style.display='';}

  SIM.idx=0;SIM.answers=[];SIM.started=true;
  if(m.tpq>0){
    SIM.endTime=Date.now()+SIM.duration*1000;
    if(SIM.timer)clearInterval(SIM.timer);
    SIM.timer=setInterval(simTimerTick,1000);
  }
  simShowQ();
}

function simTimerTick(){
  const left=Math.max(0,Math.round((SIM.endTime-Date.now())/1000));
  const m=Math.floor(left/60),s=left%60;
  const chip=document.getElementById('sim-timer-chip');
  if(chip)chip.textContent='⏱ '+m+':'+(s<10?'0':'')+s;
  if(chip){
    if(left<=60)chip.style.color='#ef4444';
    else if(left<=180)chip.style.color='#f97316';
    else chip.style.color='var(--or)';
  }
  if(left===0){clearInterval(SIM.timer);simFinish();}
}

function simShowQ(){
  if(SIM.idx>=SIM.questions.length){simFinish();return;}
  const q=SIM.questions[SIM.idx];
  const total=SIM.questions.length;
  const pct=Math.round(SIM.idx/total*100);
  document.getElementById('sim-prog-bar').style.width=pct+'%';
  document.getElementById('sim-q-domain').textContent='Domein '+q.domeinId+': '+q.domeinNaam;
  document.getElementById('sim-q-counter').textContent=(SIM.idx+1)+' / '+total;
  document.getElementById('sim-q-text').textContent=q.v;

  const isMC=q._type==='mc'||(q.o&&q.o.length>1);
  // Type badge
  const badge=document.getElementById('sim-type-badge');
  badge.textContent=isMC?'Multiple choice':'Open vraag';
  badge.className='sim-type-badge '+(isMC?'sim-type-mc':'sim-type-open');

  // Context box (open vragen)
  const ctxWrap=document.getElementById('sim-ctx-wrap');
  if(q.ctx&&!isMC){ctxWrap.style.display='';document.getElementById('sim-ctx-text').textContent=q.ctx;}
  else{ctxWrap.style.display='none';}

  // Show/hide MC vs open
  const optsEl=document.getElementById('sim-q-opts');
  const openArea=document.getElementById('sim-open-area');
  const nextBtn=document.getElementById('sim-next-btn');
  nextBtn.textContent=SIM.idx===total-1?'Afronden →':'Volgende →';

  if(isMC){
    optsEl.style.display='flex';
    openArea.style.display='none';
    const idxArr=[0,1,2,3].slice(0,q.o.length);
    const shuffled=[...idxArr].sort(()=>Math.random()-.5);
    optsEl.innerHTML=shuffled.map(oi=>`
      <button class="sim-opt" onclick="simSelectOpt(this,${oi},${q.c})">${q.o[oi]}</button>
    `).join('');
    nextBtn.disabled=true;nextBtn.style.opacity='.35';
  }else{
    optsEl.style.display='none';
    openArea.style.display='block';
    document.getElementById('sim-open-ta').value='';
    document.getElementById('sim-open-ta').disabled=false;
    document.getElementById('sim-nakijk-btn').style.display='block';
    document.getElementById('sim-model-blok').style.display='none';
    document.getElementById('sim-ma-text').textContent=q.u||'';
    document.querySelectorAll('.sim-ab').forEach(b=>b.disabled=false);
    nextBtn.disabled=true;nextBtn.style.opacity='.35';
  }
}

function simSelectOpt(btn,selectedIdx,correctIdx){
  const optsEl=document.getElementById('sim-q-opts');
  optsEl.querySelectorAll('.sim-opt').forEach(b=>b.disabled=true);
  btn.classList.add(selectedIdx===correctIdx?'correct':'wrong');
  if(selectedIdx!==correctIdx){
    optsEl.querySelectorAll('.sim-opt').forEach(b=>{
      if(parseInt(b.getAttribute('onclick').match(/simSelectOpt\(this,(\d+)/)?.[1])===correctIdx){
        b.classList.add('correct');
      }
    });
  }
  const q=SIM.questions[SIM.idx];
  SIM.answers.push({correct:selectedIdx===correctIdx,pts:selectedIdx===correctIdx?1:0,_type:'mc',domeinId:q.domeinId,domeinNaam:q.domeinNaam,domeinKleur:q.domeinKleur});
  const nextBtn=document.getElementById('sim-next-btn');
  nextBtn.disabled=false;nextBtn.style.opacity='1';
}

function simNakijken(){
  document.getElementById('sim-open-ta').disabled=true;
  document.getElementById('sim-nakijk-btn').style.display='none';
  document.getElementById('sim-model-blok').style.display='block';
}

function simBeoordeel(rawPts){
  document.querySelectorAll('.sim-ab').forEach(b=>b.disabled=true);
  const q=SIM.questions[SIM.idx];
  // In examen mode: "deels" = 0.25 instead of 0.5
  const m=SIM.mode||SIM_MODES.normaal;
  const pts=rawPts===0.5?m.deelsPts:rawPts;
  SIM.answers.push({correct:pts>=0.5,pts,rawPts,_type:'open',domeinId:q.domeinId,domeinNaam:q.domeinNaam,domeinKleur:q.domeinKleur});
  const nextBtn=document.getElementById('sim-next-btn');
  nextBtn.disabled=false;nextBtn.style.opacity='1';
}

function simNextQ(){
  SIM.idx++;
  if(SIM.idx>=SIM.questions.length){simFinish();return;}
  simShowQ();
}

function simFinish(){
  if(SIM.timer){clearInterval(SIM.timer);SIM.timer=null;}
  document.getElementById('sim-quiz').style.display='none';
  document.getElementById('sim-timer-chip').style.display='none';
  document.getElementById('sim-result').style.display='';

  const totalPts=SIM.answers.reduce((s,a)=>s+(a.pts??(a.correct?1:0)),0);
  const total=SIM.answers.length;
  const correct=Math.round(totalPts);
  const pct=total>0?totalPts/total:0;
  // CE grade estimate: 9 * (pct) + 1, rounded to 0.5
  const rawGrade=9*pct+1;
  const grade=Math.round(rawGrade*2)/2;
  const gradeColor=grade>=7?'#22c55e':grade>=5.5?'#f97316':'#ef4444';
  const gradeEmoji=grade>=8?'🏆':grade>=7?'⭐':grade>=6?'👍':grade>=5.5?'📈':'📚';

  const m=SIM.mode||SIM_MODES.normaal;
  const isOefenen=m.key==='oefenen';
  document.getElementById('sim-res-emoji').textContent=isOefenen?'📖':gradeEmoji;
  document.getElementById('sim-res-grade').textContent=isOefenen?Math.round(pct*100)+'%':grade.toFixed(1).replace('.',',');
  document.getElementById('sim-res-grade').style.color=gradeColor;
  document.getElementById('sim-res-label').textContent=isOefenen?'Oefenscore':'Geschat CE-cijfer';
  const modeLbl=`<span style="font-size:11px;font-weight:800;padding:2px 9px;border-radius:20px;background:${m.clr}18;color:${m.clr};border:1px solid ${m.clr}33;margin-left:6px">${m.icon} ${m.label}</span>`;
  document.getElementById('sim-res-score').innerHTML=correct+' van '+total+' vragen correct ('+Math.round(pct*100)+'%)'+modeLbl;

  // Per-domain breakdown
  const domMap={};
  SIM.answers.forEach(a=>{
    if(!domMap[a.domeinId])domMap[a.domeinId]={naam:a.domeinNaam,kleur:a.domeinKleur,correct:0,total:0};
    domMap[a.domeinId].total++;
    if(a.correct)domMap[a.domeinId].correct++;
  });

  const domRes=document.getElementById('sim-domain-results');
  domRes.innerHTML='<div style="font-size:12px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.7px;margin-bottom:12px">Resultaat per domein</div>'+
    Object.entries(domMap).map(([id,d])=>{
      const dp=d.total>0?Math.round(d.correct/d.total*100):0;
      const dc=dp>=70?'#22c55e':dp>=50?'#f97316':'#ef4444';
      return `<div class="sim-dom-card">
        <div class="sim-dom-letter" style="background:${d.kleur}22;color:${d.kleur}">${id}</div>
        <div class="sim-dom-info">
          <div class="sim-dom-name">Domein ${id}: ${d.naam}</div>
          <div class="sim-dom-bar-wrap"><div class="sim-dom-bar" style="width:${dp}%;background:${dc}"></div></div>
        </div>
        <div class="sim-dom-score" style="color:${dc}">${d.correct}/${d.total}</div>
      </div>`;
    }).join('');

  // Show progress bar full
  document.getElementById('sim-prog-bar').style.width='100%';
}

function simExit(){
  if(SIM.timer){clearInterval(SIM.timer);SIM.timer=null;}
  const nb=document.getElementById('sim-mode-nav-badge');if(nb)nb.style.display='none';
  show('sc-detail');
}

// ═══════ EXAMEN MODUS ═══════
let EX = {}; // examen state

function startExamen(){
  // Zoek examen voor huidig vak + niveau
  const vakId = (ST.vak && ST.vak.id) || ST.vakId || '';
  const allEx = typeof EXAMENS !== 'undefined' && EXAMENS[vakId];
  const examenLijst = allEx ? allEx.filter(e=>!e.niveau||e.niveau===APP_LEVEL) : [];
  if(!examenLijst || examenLijst.length === 0){
    showToast('Nog geen echt examen beschikbaar voor dit vak');
    return;
  }
  const examen = examenLijst[0]; // gebruik eerste (meest recent) examen
  EX = {
    examen,
    idx: 0,
    answers: {},    // nr -> tekst
    grades: {},     // nr -> {pts, max}
    phase: 'intro', // intro | quiz | result
    timer: null,
    secondsLeft: examen.duur_minuten * 60,
    selfPts: 0,
    gradedCount: 0
  };
  // Update intro UI
  document.getElementById('ex-intro-title').textContent =
    `${examen.titel} HAVO ${examen.jaar} · Tijdvak ${examen.tijdvak}`;
  document.getElementById('ex-intro-sub').textContent =
    `Officieel eindexamen · ${examen.bron}`;
  document.getElementById('ex-stat-vragen').textContent = examen.vragen.length;
  document.getElementById('ex-stat-punten').textContent = examen.max_punten;
  const h = Math.floor(examen.duur_minuten/60);
  const m = examen.duur_minuten % 60;
  document.getElementById('ex-stat-tijd').textContent = m===0 ? `${h} uur` : `${h}u ${m}m`;
  // Reset timer display
  document.getElementById('ex-timer').textContent = _exFmtTime(examen.duur_minuten*60);
  document.getElementById('ex-timer').className = 'ex-timer';
  document.getElementById('ex-score-chip').textContent = `0 / ${examen.max_punten} pt`;
  document.getElementById('ex-prog-fill').style.width = '0%';
  // Bijlage knoppen in intro
  const bijlRow = document.getElementById('ex-bijlage-row');
  if(bijlRow){
    const bijlagen = examen.bijlagen || [];
    if(bijlagen.length){
      bijlRow.innerHTML = bijlagen.map(b=>{
        const isCv = b.type==='antwoord';
        const icon = isCv ? '✅' : '📋';
        const cls = isCv ? ' cv' : '';
        const titleStr = (b.label+' — '+examen.titel).replace(/'/g,"\\'");
        return `<button class="ex-bijlage-btn${cls}" onclick="openPdfViewer('${b.url}','${titleStr}')"><span>${icon}</span><span>${b.label}</span></button>`;
      }).join('');
      bijlRow.style.display = '';
    } else {
      bijlRow.style.display = 'none';
    }
  }
  // Toon scherm
  document.getElementById('ex-intro').style.display = '';
  document.getElementById('ex-quiz').style.display = 'none';
  document.getElementById('ex-result').style.display = 'none';
  show('sc-examen');
}

function examenStart(){
  EX.phase = 'quiz';
  document.getElementById('ex-intro').style.display = 'none';
  document.getElementById('ex-quiz').style.display = '';
  // Bouw vraag-grid
  _exBuildGrid();
  // Toon eerste vraag
  examenShowQ(0);
  // Start timer
  EX.timer = setInterval(_exTimerTick, 1000);
  // Split layout: tekstboekje naast vragen inladen
  const _tb = (EX.examen.bijlagen||[]).find(b=>b.type==='tekstboekje');
  const _quiz = document.getElementById('ex-quiz');
  const _tbPanel = document.getElementById('ex-tb-panel');
  const _tbIframe = document.getElementById('ex-tb-iframe');
  const _tbNewtab = document.getElementById('ex-tb-newtab');
  if(_tb && _tbPanel && _tbIframe){
    _tbIframe.src = _tb.url;
    if(_tbNewtab) _tbNewtab.href = _tb.url;
    _tbPanel.style.display = '';
    _quiz.classList.add('split');
  } else {
    if(_tbPanel) _tbPanel.style.display = 'none';
    _quiz.classList.remove('split');
  }
}

function _exTimerTick(){
  EX.secondsLeft--;
  document.getElementById('ex-timer').textContent = _exFmtTime(EX.secondsLeft);
  const pct = 1 - EX.secondsLeft / (EX.examen.duur_minuten * 60);
  document.getElementById('ex-prog-fill').style.width = (pct*100)+'%';
  const el = document.getElementById('ex-timer');
  if(EX.secondsLeft <= 60){ el.className='ex-timer danger'; }
  else if(EX.secondsLeft <= 300){ el.className='ex-timer warn'; }
  else { el.className='ex-timer'; }
  if(EX.secondsLeft <= 0){ clearInterval(EX.timer); EX.timer=null; examenFinish(); }
}

function _exFmtTime(s){
  const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=s%60;
  if(h>0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function _exBuildGrid(){
  const g = document.getElementById('ex-qgrid');
  g.innerHTML = EX.examen.vragen.map((q,i) => {
    const cls = q.needs_bijlage ? ' bijlage' : '';
    return `<div class="ex-qd${cls}" id="exqd-${i}" onclick="examenShowQ(${i})">${q.nr}</div>`;
  }).join('');
}

function examenShowQ(idx){
  const q = EX.examen.vragen[idx];
  if(!q) return;
  EX.idx = idx;
  // Opgave banner
  const prevQ = idx > 0 ? EX.examen.vragen[idx-1] : null;
  document.getElementById('ex-opgave-banner').textContent = `Opgave ${q.opgave}`;
  // Context — toon alleen als anders dan vorige vraag in zelfde opgave
  const ctxEl = document.getElementById('ex-context');
  const ctxTxt = q.context || '';
  if(ctxTxt){
    ctxEl.textContent = ctxTxt;
    ctxEl.style.display = '';
  } else {
    ctxEl.style.display = 'none';
  }
  // Bijlage note
  const bijlEl = document.getElementById('ex-bijlage-note');
  if(q.needs_bijlage && q.bijlage_tekst){
    bijlEl.textContent = q.bijlage_tekst;
    bijlEl.style.display = '';
  } else {
    bijlEl.style.display = 'none';
  }
  // Vraag
  document.getElementById('ex-q-nr').textContent = `Vraag ${q.nr}`;
  document.getElementById('ex-vraag').textContent = q.vraag;
  document.getElementById('ex-q-pts').textContent = `${q.punten}p`;
  // Antwoord textarea
  document.getElementById('ex-textarea').value = EX.answers[q.nr] || '';
  // Knop label
  const isLast = idx === EX.examen.vragen.length - 1;
  const nextBtn = document.getElementById('ex-next-btn');
  nextBtn.textContent = isLast ? 'Afronden →' : 'Volgende →';
  nextBtn.onclick = isLast ? examenFinish : ()=>examenNav(1);
  // Grid update
  _exUpdateGrid();
  // Scroll top
  document.getElementById('sc-examen').scrollTo(0,0);
}

function examenSaveAnswer(val){
  const q = EX.examen.vragen[EX.idx];
  if(!q) return;
  EX.answers[q.nr] = val;
  _exUpdateGrid();
  // Score chip: toon beantwoorde vragen
  const beantwoord = Object.keys(EX.answers).filter(k=>EX.answers[k].trim()).length;
  document.getElementById('ex-score-chip').textContent = `${beantwoord} / ${EX.examen.vragen.length} ingevuld`;
}

function examenNav(dir){
  const newIdx = EX.idx + dir;
  if(newIdx < 0 || newIdx >= EX.examen.vragen.length) return;
  examenShowQ(newIdx);
}

function _exUpdateGrid(){
  EX.examen.vragen.forEach((q,i)=>{
    const el = document.getElementById(`exqd-${i}`);
    if(!el) return;
    const hasAns = EX.answers[q.nr] && EX.answers[q.nr].trim();
    const isCur = i===EX.idx;
    const isBijl = q.needs_bijlage;
    el.className = 'ex-qd' + (isCur?' current':hasAns?' answered':isBijl?' bijlage':'');
  });
}

function examenFinish(){
  if(EX.timer){ clearInterval(EX.timer); EX.timer=null; }
  EX.phase = 'result';
  document.getElementById('ex-quiz').style.display = 'none';
  document.getElementById('ex-result').style.display = '';
  // Reset self-grade state
  EX.selfPts = 0;
  EX.gradedCount = 0;
  EX.grades = {};
  _exBuildResultList();
  _exUpdateGrade();
  document.getElementById('sc-examen').scrollTo(0,0);
  // Badge: eerste echt examen afgemaakt
  try{if(earnAch('examen_done'))setTimeout(()=>showAch('📄','Eerste echt examen afgemaakt!'),1200);}catch(e){}
}

function _exBuildResultList(){
  const list = document.getElementById('ex-rev-list');
  list.innerHTML = EX.examen.vragen.map((q,i) => {
    const antw = EX.answers[q.nr] || '';
    const isBijl = q.needs_bijlage;
    const bijlHtml = isBijl ? `<div class="ex-rev-bijlage">${q.bijlage_tekst||'Bijlage benodigd'}</div>` : '';
    return `
    <div class="ex-rev-card" id="exrc-${i}">
      <div class="ex-rev-header">
        <span class="ex-rev-nr">Vraag ${q.nr} · Opgave ${q.opgave}</span>
        <span class="ex-rev-pts-badge" id="exrb-${i}">0 / ${q.punten}p</span>
      </div>
      <div class="ex-rev-vraag">${q.vraag}</div>
      ${bijlHtml}
      <div class="ex-rev-jouw">Jouw antwoord</div>
      <div class="ex-rev-jouw-text">${antw.trim() || '(geen antwoord gegeven)'}</div>
      <div class="ex-rev-model">Modelantwoord</div>
      <div class="ex-rev-model-text">${q.antwoord}</div>
      <div class="ex-rev-rubric">${q.antwoord_rubric}</div>
      <div class="ex-rev-grade">
        <button class="ex-rev-grade-btn rg-fout" onclick="examenGrade(${i},0)">✗<span style="font-size:10px">Fout<br>0p</span></button>
        <button class="ex-rev-grade-btn rg-deels" onclick="examenGrade(${i},${Math.ceil(q.punten/2)})">◑<span style="font-size:10px">Deels<br>${Math.ceil(q.punten/2)}p</span></button>
        <button class="ex-rev-grade-btn rg-goed" onclick="examenGrade(${i},${q.punten})">✓<span style="font-size:10px">Goed<br>${q.punten}p</span></button>
      </div>
    </div>`;
  }).join('');
}

function examenGrade(idx, pts){
  const q = EX.examen.vragen[idx];
  const wasGraded = EX.grades[idx] !== undefined;
  const oldPts = wasGraded ? EX.grades[idx] : 0;
  EX.grades[idx] = pts;
  if(!wasGraded) EX.gradedCount++;
  EX.selfPts = EX.selfPts - oldPts + pts;
  // Update badge
  document.getElementById(`exrb-${idx}`).textContent = `${pts} / ${q.punten}p`;
  // Update card style
  const card = document.getElementById(`exrc-${idx}`);
  card.className = 'ex-rev-card ' + (pts===0?'graded-fout':pts===q.punten?'graded-goed':'graded-deels');
  // Highlight selected button
  const btns = card.querySelectorAll('.ex-rev-grade-btn');
  btns.forEach(b=>b.classList.remove('selected'));
  const ptsArr = [0, Math.ceil(q.punten/2), q.punten];
  const selIdx = ptsArr.indexOf(pts);
  if(selIdx>=0 && btns[selIdx]) btns[selIdx].classList.add('selected');
  _exUpdateGrade();
}

function _exUpdateGrade(){
  const maxPts = EX.examen.max_punten;
  const pct = maxPts > 0 ? EX.selfPts / maxPts : 0;
  // CE cijfer: 9 * pct + 1, afgerond op 0.5
  const cijfer = Math.round((9 * pct + 1) * 2) / 2;
  const cijferStr = cijfer.toFixed(1);
  document.getElementById('ex-grade-num').textContent = cijferStr;
  document.getElementById('ex-score-bar-fill').style.width = (pct*100)+'%';
  document.getElementById('ex-self-total').innerHTML =
    `Gescoord: <strong>${EX.selfPts} / ${maxPts}</strong> punten · ${EX.gradedCount}/${EX.examen.vragen.length} beoordeeld`;
}

function examenConfirmExit(){
  if(EX.phase==='quiz'){
    if(confirm('Weet je zeker dat je het examen wil stoppen? Je antwoorden gaan verloren.')){
      examenExit();
    }
  } else {
    examenExit();
  }
}

function examenExit(){
  if(EX.timer){ clearInterval(EX.timer); EX.timer=null; }
  // Reset split layout
  const _quiz = document.getElementById('ex-quiz');
  const _tbPanel = document.getElementById('ex-tb-panel');
  const _tbIframe = document.getElementById('ex-tb-iframe');
  if(_quiz) _quiz.classList.remove('split');
  if(_tbPanel) _tbPanel.style.display = 'none';
  if(_tbIframe) _tbIframe.src = 'about:blank';
  EX = {};
  show('sc-detail');
}

// ═══════ RACE MODE ═══════
const RACE_BOTS={
  easy:{name:'Bot Bas 🤖',emoji:'🤖',speed:{min:4.5,max:9},accuracy:.52,skipChance:.12},
  medium:{name:'Bot Max 🤖',emoji:'🤖',speed:{min:3,max:6},accuracy:.68,skipChance:.07},
  hard:{name:'Bot Pro 🤖',emoji:'🤖',speed:{min:1.8,max:4.2},accuracy:.84,skipChance:.03}
};

const POWERUPS=[
  {id:'freeze',icon:'🧊',label:'Freeze',desc:'Bot staat 6s stil',apply:function(){
    RC.botFrozen=true;
    raceToast('🧊 Bot bevroren voor 6 seconden!');
    setTimeout(()=>{RC.botFrozen=false;},6000);
  }},
  {id:'double',icon:'⚡',label:'Dubbelstap',desc:'+2 stappen vooruit',apply:function(){
    RC.playerScore=Math.min(15,RC.playerScore+2);
    raceUpdateTrack();
    raceToast('⚡ Dubbelstap! +2 vooruit');
  }},
  {id:'shield',icon:'🛡️',label:'Shield',desc:'Beschermt vs 1 power-up',apply:function(){
    RC.playerShield=true;
    raceToast('🛡️ Shield actief! Jij bent beschermd.');
  }},
  {id:'sendback',icon:'↩️',label:'Terugsturen',desc:'Bot moet een extra vraag beantwoorden',apply:function(){
    RC.botPenaltyQ++;
    raceToast('↩️ Bot moet een extra vraag beantwoorden!');
  }},
  {id:'turbo',icon:'🚀',label:'Turbo',desc:'Volgende vraag telt dubbel',apply:function(){
    RC.turboNext=true;
    raceToast('🚀 Turbo! Volgende vraag telt dubbel.');
  }}
];

let RC={};
let _raceFinishTimeout=null;

function startRace(diff){
  diff=diff||'medium';
  trackEvent('bot_race',{diff:diff,vak:ST.vak?.naam||null});
  window._lastRaceDiff=diff;
  const vak=ST.vak;
  if(!vak)return;

  let allQ=[];
  (vak.domeinen||[]).forEach(d=>{
    (d.sv||[]).forEach(q=>{allQ.push({...q,_domein:d.naam});});
  });
  if(allQ.length<5){raceToast('Te weinig vragen voor een race!');return;}

  const shuffle=arr=>[...arr].sort(()=>Math.random()-.5);
  const botCfg=RACE_BOTS[diff]||RACE_BOTS.medium;

  RC={
    diff,allQ,
    TARGET:15,
    pool:shuffle(allQ),
    playerQIdx:0,
    playerScore:0,
    playerQCount:0,
    shuffleMaps:{},
    botPool:shuffle(allQ),
    botQIdx:0,
    botScore:0,
    botCfg,
    botTimer:null,botFrozen:false,botPenaltyQ:0,
    playerShield:false,turboNext:false,
    startTime:Date.now(),
    finished:false,
    powerupsEarned:0,
    combo:0,
    lastMilestone:0,
  };

  document.getElementById('race-meta').textContent=`${vak.naam} · Bot Race · ${botCfg.name}`;
  document.getElementById('race-label-bot').textContent=botCfg.name;
  show('sc-race');
  raceUpdateTrack();
  raceShowQ();
  raceBotTick();
}

function raceGetCurrentQ(){
  // Cycle through pool when exhausted
  if(RC.playerQIdx>=RC.pool.length){
    RC.pool=[...RC.allQ].sort(()=>Math.random()-.5);
    RC.playerQIdx=0;
    RC.shuffleMaps={};
  }
  return RC.pool[RC.playerQIdx];
}

function raceShowQ(){
  if(RC.finished)return;
  const q=raceGetCurrentQ();
  document.getElementById('race-qctr').textContent=`VRAAG ${RC.playerQCount+1} · STAP ${RC.playerScore}/${RC.TARGET}`;
  document.getElementById('race-qq').textContent=q.v;
  document.getElementById('race-fb').style.display='none';
  document.getElementById('race-powerup-bar').style.display='none';
  document.getElementById('race-nxt').style.display='none';

  if(!RC.shuffleMaps[RC.playerQIdx]){
    const m=[0,1,2,3];
    for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[m[i],m[j]]=[m[j],m[i]];}
    RC.shuffleMaps[RC.playerQIdx]=m;
  }
  const map=RC.shuffleMaps[RC.playerQIdx];
  const correctPos=map.indexOf(q.c);
  RC._currentCorrect=correctPos;

  const area=document.getElementById('race-opts');
  area.innerHTML='';
  const labs=['A','B','C','D'];
  map.forEach((origIdx,pos)=>{
    const btn=document.createElement('button');
    btn.className='race-opt';
    btn.innerHTML=`<span class="opt-lbl">${labs[pos]}</span>${q.o[origIdx]}`;
    btn.dataset.pos=pos;
    btn.onclick=function(){if(!btn.disabled)raceKies(pos,correctPos);};
    area.appendChild(btn);
  });
  raceStartTimer();
}

let _raceTimerInterval=null;
function raceStartTimer(){
  clearInterval(_raceTimerInterval);
  RC._tijd=15;
  const circ=document.getElementById('race-tcirc');
  const num=document.getElementById('race-tnum');
  const total=119;
  if(circ)circ.style.strokeDashoffset='0';
  if(num)num.textContent='15';
  _raceTimerInterval=setInterval(()=>{
    RC._tijd--;
    if(num)num.textContent=Math.max(0,RC._tijd);
    if(circ)circ.style.strokeDashoffset=String(Math.round((1-RC._tijd/15)*total));
    if(RC._tijd<=0){clearInterval(_raceTimerInterval);raceTijdOp();}
  },1000);
}

function raceTijdOp(){
  const btns=document.querySelectorAll('#race-opts .race-opt');
  btns.forEach(b=>b.disabled=true);
  if(btns[RC._currentCorrect])btns[RC._currentCorrect].classList.add('correct');
  raceFeedback(false,raceGetCurrentQ());
}

function raceKies(gekozen,correct){
  clearInterval(_raceTimerInterval);
  const btns=document.querySelectorAll('#race-opts .race-opt');
  btns.forEach(b=>b.disabled=true);
  const ok=gekozen===correct;
  if(ok) btns[gekozen].classList.add('correct');
  else{ btns[gekozen].classList.add('wrong'); if(btns[correct])btns[correct].classList.add('correct'); }
  raceFeedback(ok,raceGetCurrentQ());
}

function raceFeedback(ok,q){
  if(RC.finished)return;
  if(ok){
    RC.playerScore++;
    if(RC.turboNext){RC.playerScore++;RC.turboNext=false;raceToast('🚀 Turbo! +2 stappen!');}
    RC.combo=(RC.combo||0)+1;
    RC.powerupsEarned++;
    raceUpdateTrack();
    if(RC.finished)return;
    playSound&&playSound('correct');
    raceEdgeFlash(true);
    raceFloatNum('+1 🚀');
    raceShowCombo(RC.combo);
    raceMilestoneCheck(RC.playerScore);
    // Animate car
    const cp=document.getElementById('race-car-player');
    if(cp){cp.classList.remove('scored');void cp.offsetWidth;cp.classList.add('scored');}
    if(RC.powerupsEarned%3===0){showPowerupChoice(q);return;}
  } else {
    RC.combo=0;
    raceEdgeFlash(false);
    // Shake wrong button
    document.querySelectorAll('#race-opts .race-opt.wrong').forEach(b=>{
      b.style.animation='raceShake .4s ease';
      setTimeout(()=>b.style.animation='',400);
    });
    playSound&&playSound('wrong');
    const combo=document.getElementById('race-combo');
    if(combo)combo.classList.remove('show');
  }
  const fb=document.getElementById('race-fb');
  fb.style.display='block';
  fb.className='race-fb '+(ok?'fbok':'fbno');
  fb.innerHTML=`<div class="fbt">${ok?'✓ Stap vooruit!':'✗ Fout — geen stap'}</div><div class="fbtx">${q.u||''}</div>`;
  document.getElementById('race-nxt').style.display='block';
}

function raceEdgeFlash(ok){
  const el=document.getElementById('race-edge-flash');
  if(!el)return;
  el.className='race-edge-flash';
  void el.offsetWidth;
  el.className='race-edge-flash '+(ok?'flash-ok':'flash-no');
  setTimeout(()=>{el.className='race-edge-flash';},550);
}

function raceFloatNum(txt){
  const el=document.createElement('div');
  el.className='race-float';
  el.textContent=txt;
  el.style.color='#4ade80';
  el.style.left=(30+Math.random()*40)+'%';
  el.style.top='55%';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1000);
}

function raceShowCombo(n){
  const el=document.getElementById('race-combo');
  if(!el)return;
  if(n<2){el.classList.remove('show');return;}
  const labels=['','','🔥 x2','🔥 x3','🔥 x4 COMBO!','💥 x5 COMBO!!','⚡ x'+n+' UNSTOPPABLE!!!'];
  const colors=['','','#f59e0b','#ef4444','#ef4444','#a855f7','#a855f7'];
  el.textContent=labels[Math.min(n,6)];
  el.style.color=colors[Math.min(n,6)];
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
}

function raceMilestoneCheck(score){
  const milestones={5:'Halverwege! 🎯',10:'Nog 5 stappen! 🔥',14:'Nog 1 stap! 😱'};
  if(milestones[score]&&score>RC.lastMilestone){
    RC.lastMilestone=score;
    raceToast(milestones[score]);
  }
}

function showPowerupChoice(q){
  const bar=document.getElementById('race-powerup-bar');
  const row=document.getElementById('race-pu-row');
  const shuffled=[...POWERUPS].sort(()=>Math.random()-.5).slice(0,3);
  row.innerHTML='';
  shuffled.forEach(pu=>{
    const btn=document.createElement('button');
    btn.className='race-pu-btn';
    btn.style.animation='puPop .3s ease';
    btn.innerHTML=`${pu.icon} ${pu.label}<span class="pu-desc">${pu.desc}</span>`;
    btn.onclick=()=>{
      if(RC.finished)return;
      pu.apply();
      bar.style.display='none';
      const fb=document.getElementById('race-fb');
      fb.style.display='block';
      fb.className='race-fb fbok';
      fb.innerHTML=`<div class="fbt">✓ Stap vooruit! + ${pu.icon} ${pu.label}</div><div class="fbtx">${q.u||''}</div>`;
      document.getElementById('race-nxt').style.display='block';
    };
    row.appendChild(btn);
  });
  bar.style.display='block';
  // Also show feedback + next behind the powerup panel
  const fb=document.getElementById('race-fb');
  fb.style.display='block';
  fb.className='race-fb fbok';
  fb.innerHTML=`<div class="fbt">✓ Stap vooruit!</div><div class="fbtx">${q.u||''}</div>`;
  document.getElementById('race-nxt').style.display='block';
}

function raceNextQ(){
  if(RC.finished)return;
  RC.playerQIdx++;
  RC.playerQCount++;
  raceShowQ();
}

function raceUpdateTrack(){
  const T=RC.TARGET||15;
  const track=document.querySelector('.race-track');
  const trackW=track?track.clientWidth:280;
  const usable=trackW-32-36;
  const pPct=Math.min(1,RC.playerScore/T);
  const bPct=Math.min(1,RC.botScore/T);

  const cp=document.getElementById('race-car-player');
  const cb=document.getElementById('race-car-bot');
  const fp=document.getElementById('rf-player');
  const fb=document.getElementById('rf-bot');
  if(cp)cp.style.left=(6+pPct*usable)+'px';
  if(cb)cb.style.left=(6+bPct*usable)+'px';
  if(fp)fp.style.width=(pPct*100)+'%';
  if(fb)fb.style.width=(bPct*100)+'%';

  const sp=document.getElementById('race-score-player');
  const sb=document.getElementById('race-score-bot');
  if(sp){sp.textContent=`${RC.playerScore}/${T}`;sp.className='race-track-score'+(RC.playerScore>RC.botScore?' leading':'');}
  if(sb)sb.textContent=`${RC.botScore}/${T}`;

  // Bot danger warning
  const gap=RC.playerScore-RC.botScore;
  if(gap===-1&&RC.playerScore>0)raceToast('⚠️ Bot is dichtbij!');
  else if(gap<=-3&&RC.botScore>0)raceToast('🚨 Bot loopt voor!');

  if(!RC.finished){
    if(RC.playerScore>=T) raceFinish('player');
    else if(RC.botScore>=T) raceFinish('bot');
  }
}

function raceBotTick(){
  const T=RC.TARGET||15;
  function botAnswerNext(){
    if(RC.finished||RC.botScore>=T)return;
    if(RC.botFrozen){RC.botTimer=setTimeout(botAnswerNext,500);return;}
    if(RC.botPenaltyQ>0){
      RC.botPenaltyQ--;
      raceToast('↩️ Bot beantwoordt extra vraag…');
      RC.botTimer=setTimeout(botAnswerNext,3000+Math.random()*2000);
      return;
    }
    const cfg=RC.botCfg;
    const delay=(cfg.speed.min+Math.random()*(cfg.speed.max-cfg.speed.min))*1000;
    RC.botTimer=setTimeout(()=>{
      if(RC.finished)return;
      // Cycle bot pool if exhausted
      if(RC.botQIdx>=RC.botPool.length){
        RC.botPool=[...RC.allQ].sort(()=>Math.random()-.5);
        RC.botQIdx=0;
      }
      RC.botQIdx++;
      if(Math.random()<cfg.accuracy){
        RC.botScore++;
        raceUpdateTrack();
        const cb=document.getElementById('race-car-bot');
        if(cb){cb.style.animation='racePulse .3s ease';setTimeout(()=>{cb.style.animation=''},350);}
      }
      botAnswerNext();
    },delay);
  }
  botAnswerNext();
}

function raceFinish(who){
  if(RC.finished)return;
  RC.finished=true;
  clearInterval(_raceTimerInterval);
  clearTimeout(RC.botTimer);

  // Disable all opts + hide nav
  document.querySelectorAll('#race-opts .race-opt').forEach(b=>b.disabled=true);
  document.getElementById('race-nxt').style.display='none';
  document.getElementById('race-powerup-bar').style.display='none';

  const elapsed=Math.round((Date.now()-RC.startTime)/1000);
  const tot=RC.TARGET||15;
  const playerWin=RC.playerScore>=tot||(RC.playerScore>RC.botScore)||(RC.playerScore===RC.botScore&&who==='player');
  checkRaceAch(playerWin);

  // Show finish overlay with confetti
  const ov=document.getElementById('race-finish-overlay');
  const title=document.getElementById('rfo-title');
  const sub=document.getElementById('rfo-sub');
  if(ov&&title&&sub){
    title.textContent=playerWin?'JIJ WINT! 🎉':'BOT WINT 😤';
    title.style.color=playerWin?'#4ade80':'#f87171';
    sub.textContent=playerWin
      ?`${RC.playerScore}/${tot} stappen in ${elapsed}s 🏆`
      :`Bot: ${RC.botScore}/${tot} · Jij: ${RC.playerScore}/${tot}`;
    // Confetti dots
    if(playerWin){
      let conf=document.querySelector('.rfo-confetti');
      if(!conf){conf=document.createElement('div');conf.className='rfo-confetti';ov.appendChild(conf);}
      conf.innerHTML='';
      const colors=['#f59e0b','#ef4444','#22c55e','#3b82f6','#a855f7','#ec4899','#fcd34d'];
      for(let i=0;i<40;i++){
        const d=document.createElement('div');
        d.className='rfo-dot';
        d.style.cssText=`left:${Math.random()*100}%;top:-10px;background:${colors[i%colors.length]};--d:${.8+Math.random()*.8}s;--delay:${Math.random()*.6}s;transform:rotate(${Math.random()*360}deg)`;
        conf.appendChild(d);
      }
    }
    ov.classList.add('visible');
  }

  _raceFinishTimeout=setTimeout(()=>{
    if(ov)ov.classList.remove('visible');
    // Build result screen
    document.getElementById('race-res-emi').textContent=playerWin?'🏆':'😅';
    document.getElementById('race-res-tit').textContent=playerWin?'Jij wint! 🎉':'Bot wint… 😤';
    document.getElementById('race-res-sub').textContent=playerWin
      ?`${RC.playerScore}/${tot} goed — ${elapsed}s. Geweldig!`
      :`${RC.botScore}/${tot} voor de bot, jij had ${RC.playerScore}/${tot}. Probeer opnieuw!`;

    const vs=document.getElementById('race-res-vs');
    vs.innerHTML=`
      <div class="race-res-col${playerWin?' winner':''}">
        <div class="res-emo">🚀</div>
        <div class="res-name">Jij</div>
        <div class="res-sc">${RC.playerScore}/${tot}</div>
        <div class="res-time">${elapsed}s</div>
      </div>
      <div class="race-res-col${!playerWin?' winner':''}">
        <div class="res-emo">${RC.botCfg.emoji}</div>
        <div class="res-name">${RC.botCfg.name}</div>
        <div class="res-sc">${RC.botScore}/${tot}</div>
        <div class="res-time">${RC.diff}</div>
      </div>`;

    // Breakdown
    const pct=Math.round((RC.playerScore/tot)*100);
    const kleur=pct>=70?'#4ade80':pct>=50?'#fcd34d':'#f87171';
    document.getElementById('race-res-bd').innerHTML=`
      <div class="rb-row"><span>Jouw score</span><strong style="color:${kleur}">${RC.playerScore}/${tot} (${pct}%)</strong></div>
      <div class="rb-row"><span>Moeilijkheid</span><strong>${RC.diff==='easy'?'😌 Makkelijk':RC.diff==='medium'?'😤 Gemiddeld':'💀 Moeilijk'}</strong></div>
      <div class="rb-row"><span>Tijd</span><strong>${elapsed}s</strong></div>`;

    show('sc-race-res');
  },2500);
}

function stopRace(){
  RC.finished=true;
  clearInterval(_raceTimerInterval);
  clearTimeout(RC&&RC.botTimer);
  clearTimeout(_raceFinishTimeout);
  const ov=document.getElementById('race-finish-overlay');
  if(ov)ov.classList.remove('visible');
  show('sc-qmode');
}

function raceToast(msg){
  const t=document.getElementById('race-toast');
  if(!t)return;
  t.textContent=msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}

