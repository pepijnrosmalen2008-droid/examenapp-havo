// ═══════ RAPPORT ═══════
function openRapport(){
  const modal=document.getElementById('rapport-modal');
  if(!modal)return;
  renderRapport();
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeRapport(){
  document.getElementById('rapport-modal')?.classList.remove('open');
  document.body.style.overflow='';
}
function renderRapport(){
  const el=document.getElementById('rapport-content');
  if(!el)return;
  const vakken=getVK();
  const allDomains=[];
  vakken.forEach(vak=>{
    (vak.domeinen||[]).forEach(dom=>{
      const {pct,hasData}=getDomeinBestPct(vak.id,dom.id);
      if(hasData)allDomains.push({vakNaam:vak.naam,domNaam:dom.naam,pct});
    });
  });
  const p=getProgress();
  const totalAttempts=Object.values(p).reduce((s,v)=>s+(v.attempts||0),0);
  const avgPct=allDomains.length?Math.round(allDomains.reduce((s,d)=>s+d.pct,0)/allDomains.length*100):0;
  const sorted=[...allDomains].sort((a,b)=>b.pct-a.pct);
  const strong=sorted.slice(0,3);
  const weak=[...allDomains].filter(d=>d.pct<0.65).sort((a,b)=>a.pct-b.pct).slice(0,3);
  const mijn=getMijnVakken();
  const today=new Date();today.setHours(0,0,0,0);
  const upcoming=EXAM_SCHEDULE.filter(e=>{
    const d=new Date(e.datum);
    return (!e.niveau||e.niveau===APP_LEVEL)&&d>=today&&(mijn.length===0||!e.vakId||(e.vakId&&mijn.includes(e.vakId)));
  }).slice(0,3);
  const maand=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  const domRow=(d,color)=>`<div class="rp-domain-row">
    <div class="rp-domain-info"><div class="rp-domain-name">${d.domNaam}</div><div class="rp-domain-vak">${d.vakNaam}</div></div>
    <div class="rp-pct-bar"><div class="rp-pct-fill" style="width:${Math.round(d.pct*100)}%;background:${color}"></div></div>
    <div class="rp-pct-lbl" style="color:${color}">${Math.round(d.pct*100)}%</div>
  </div>`;
  el.innerHTML=`
    <div class="rp-stats-row">
      <div class="rp-stat"><div class="rp-stat-val">${totalAttempts}</div><div class="rp-stat-lbl">Quizzen</div></div>
      <div class="rp-stat"><div class="rp-stat-val">${allDomains.length}</div><div class="rp-stat-lbl">Domeinen</div></div>
      <div class="rp-stat"><div class="rp-stat-val">${avgPct}%</div><div class="rp-stat-lbl">Gemiddeld</div></div>
    </div>
    ${strong.length?`<div class="rp-section-title">💪 Sterkste domeinen</div>${strong.map(d=>domRow(d,'#22c55e')).join('')}`:''}
    ${weak.length?`<div class="rp-section-title">⚠️ Focuspunten</div>${weak.map(d=>domRow(d,'#f97316')).join('')}`:''}
    ${upcoming.length?`<div class="rp-section-title">📅 Aankomende examens</div>${upcoming.map(e=>{
      const d=new Date(e.datum);const dL=Math.ceil((d-today)/(864e5));
      return`<div class="rp-exam-row"><div><div class="rp-exam-vak">${e.vak}</div><div class="rp-exam-date">${d.getDate()} ${maand[d.getMonth()]} · ${e.tijd}</div></div><div style="font-family:var(--font-head);font-size:13px;font-weight:800;color:${dL<=7?'#ef4444':dL<=14?'#f97316':'var(--or)'}">${dL}d</div></div>`;
    }).join('')}`:''}
    ${allDomains.length===0?`<div class="sp-empty">Je hebt nog geen domeinen geoefend.<br>Maak eerst een quiz om je rapport te zien.</div>`:''}
    <button class="rp-share-btn" onclick="shareRapport()">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
      Deel mijn rapport
    </button>`;
}
async function shareRapport(){
  const vakken=getVK();
  const allDomains=[];
  vakken.forEach(vak=>{(vak.domeinen||[]).forEach(dom=>{const {pct,hasData}=getDomeinBestPct(vak.id,dom.id);if(hasData)allDomains.push(pct);});});
  const avg=allDomains.length?Math.round(allDomains.reduce((s,v)=>s+v,0)/allDomains.length*100):0;
  const p=getProgress();
  const tot=Object.values(p).reduce((s,v)=>s+(v.attempts||0),0);
  const tekst=`Mijn voortgang op Slagio 📊\n${tot} quizzen · ${allDomains.length} domeinen · gemiddeld ${avg}%\nOok oefenen voor het examen? → slagio.nl`;
  if(navigator.share){
    try{await navigator.share({title:'Mijn Slagio Rapport',text:tekst,url:'https://slagio.nl'});if(earnAch('ambassadeur'))setTimeout(()=>showAch('📣','Ambassadeur! Rapport gedeeld.'),500);}catch(e){}
  }else{
    try{await navigator.clipboard.writeText(tekst);showToast('📋 Rapport gekopieerd!');}catch(e){showToast('slagio.nl');}
    if(earnAch('ambassadeur'))setTimeout(()=>showAch('📣','Ambassadeur! Rapport gedeeld.'),500);
  }
}
// ═══════ STUDIEPLAN v2 ═══════
const SP_PREF_KEY='slagio_sp_prefs_v1';
const SP_PREV_KEY='slagio_sp_prev_v1';
const SP_PLAN_KEY='slagio_sp_plan_v1';
const SP_DONE_KEY='slagio_sp_done_v1';

function spGetDone(){try{return JSON.parse(localStorage.getItem(SP_DONE_KEY)||'{}');}catch(e){return{};}}
function spIsDone(key){return!!spGetDone()[key];}
function spMarkDone(key){
  const d=spGetDone();
  if(d[key])return;
  d[key]=true;
  localStorage.setItem(SP_DONE_KEY,JSON.stringify(d));
  try{addXP(25);}catch(e){}
  try{renderVandaagWidget();}catch(e){}
  try{
    const btn=document.querySelector(`[data-spkey="${key}"]`);
    if(btn){btn.classList.add('checked');btn.closest('.sp-task-card')?.classList.add('sp-done');}
    const vanBtn=document.querySelector(`[data-spkey-hw="${key}"]`);
    if(vanBtn)vanBtn.closest('.sp-hw-task')?.remove();
  }catch(e){}
  try{checkPlanAch();}catch(e){}
  try{checkPlanDayAch(key.slice(0,10));}catch(e){}
  try{pushSyncBundle();}catch(e){}
}

function spStorePlan(tasks){
  try{localStorage.setItem(SP_PLAN_KEY,JSON.stringify({generated:new Date().toISOString().slice(0,10),tasks}));}catch(e){}
  try{pushSyncBundle();}catch(e){}
}
function spGetPlan(){try{return JSON.parse(localStorage.getItem(SP_PLAN_KEY)||'null');}catch(e){return null;}}
function spGetTodayTasks(){
  const plan=spGetPlan();
  if(!plan)return[];
  const today=new Date().toISOString().slice(0,10);
  return(plan.tasks||[]).filter(t=>t.dateStr===today);
}

// Actie-kleur helper
function spActCls(actKey){
  return{leerstof:'rgba(99,102,241,.15)',quiz:'rgba(249,115,22,.15)',flash:'rgba(20,184,166,.15)',open:'rgba(139,92,246,.15)',herhaal:'rgba(34,197,94,.15)'}[actKey]||'rgba(255,255,255,.08)';
}

function renderVandaagWidget(){
  const wrap=document.getElementById('sp-home-widget-wrap');
  if(!wrap)return;
  const plan=spGetPlan();
  const ACTS_HW={leerstof:['📖','Leerstof lezen'],quiz:['⚡','Snelle quiz'],flash:['🃏','Flashcards'],open:['📝','Open vragen'],herhaal:['🔄','Herhalen']};

  if(!plan){
    wrap.innerHTML=`<div class="sp-home-widget">
      <div class="sp-hw-header"><div class="sp-hw-title">📅 Studieplan</div></div>
      <div class="sp-hw-generate"><button class="sp-hw-gen-btn" onclick="show('sc-studieplan');renderStudieplan()">✨ Genereer mijn studieplan</button></div>
    </div>`;
    return;
  }

  const today=new Date().toISOString().slice(0,10);
  const todayTasks=(plan.tasks||[]).filter(t=>t.dateStr===today);
  const done=spGetDone();
  const openTasks=todayTasks.filter(t=>!done[`${t.dateStr}_${t.vakId}_${t.domId}_${t.actKey}`]);

  // Check urgency: any exam within 5 days?
  const mijn=getMijnVakken();
  const tody=new Date();tody.setHours(0,0,0,0);
  const urgent=EXAM_SCHEDULE.some(e=>{
    if(!e.vakId||(mijn.length>0&&!mijn.includes(e.vakId)))return false;
    const d=new Date(e.datum);d.setHours(0,0,0,0);
    return(d-tody)/864e5<=5&&(d-tody)>=0;
  });

  if(openTasks.length===0){
    const allDone=todayTasks.length>0;
    wrap.innerHTML=`<div class="sp-home-widget${urgent?' sp-urgent':''}">
      <div class="sp-hw-header">
        <div class="sp-hw-title">📅 Vandaag</div>
        <span class="sp-hw-link" onclick="show('sc-studieplan');renderStudieplan()">Plan →</span>
      </div>
      ${allDone
        ?'<div class="sp-hw-done-state">🎉 Alle taken voor vandaag gedaan!</div>'
        :'<div style="padding:12px 16px 14px;font-size:13px;color:var(--mu)">Geen taken ingepland voor vandaag.</div>'}
    </div>`;
    return;
  }

  const taskHtml=openTasks.slice(0,3).map(t=>{
    const key=`${t.dateStr}_${t.vakId}_${t.domId}_${t.actKey}`;
    const [icon,label]=ACTS_HW[t.actKey]||['📚','Oefenen'];
    return`<div class="sp-hw-task" onclick="spMarkDone('${key}');goToDomein('${t.vakId}','${t.domId}','${t.mode}')" data-spkey-hw="${key}">
      <div class="sp-hw-task-icon" style="background:${spActCls(t.actKey)}">${icon}</div>
      <div class="sp-hw-task-body">
        <div class="sp-hw-task-dom">${t.domNaam}</div>
        <div class="sp-hw-task-sub">${t.vakNaam} · ${label}</div>
      </div>
      <div class="sp-hw-task-time">~${t.mins}m</div>
    </div>`;
  }).join('');

  const extra=openTasks.length>3?`<div style="padding:0 16px 12px;font-size:12px;color:var(--mu)">+${openTasks.length-3} meer taken</div>`:'';

  wrap.innerHTML=`<div class="sp-home-widget${urgent?' sp-urgent':''}">
    <div class="sp-hw-header">
      <div class="sp-hw-title">📅 Vandaag <span style="font-size:11px;font-weight:700;background:rgba(var(--or-rgb),.15);color:var(--or);padding:2px 8px;border-radius:12px;border:1px solid rgba(var(--or-rgb),.25)">${openTasks.length} open</span></div>
      <span class="sp-hw-link" onclick="show('sc-studieplan');renderStudieplan()">Plan →</span>
    </div>
    <div class="sp-hw-tasks">${taskHtml}</div>
    ${extra}
  </div>`;
}

function spCheckAfterQuiz(vakId,domId,mode,score,total){
  try{
    if(!total||total<5||score<=0)return;
    const modeToAct={snel:'quiz',oud:'open',flash:'flash'};
    const actKey=modeToAct[mode];
    if(!actKey)return;
    const today=new Date().toISOString().slice(0,10);
    const key=`${today}_${vakId}_${domId}_${actKey}`;
    const plan=spGetPlan();
    if(!plan)return;
    const match=(plan.tasks||[]).find(t=>t.dateStr===today&&t.vakId===vakId&&t.domId===domId&&t.actKey===actKey);
    if(match&&!spIsDone(key)){
      spMarkDone(key);
      try{
        const t=document.createElement('div');
        t.style.cssText='position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#22c55e;color:#fff;padding:8px 18px;border-radius:12px;font-size:13px;font-weight:700;z-index:9999;box-shadow:0 4px 16px rgba(34,197,94,.4);pointer-events:none;white-space:nowrap';
        t.textContent='📅 Studieplan taak voltooid! +25 XP';
        document.body.appendChild(t);
        setTimeout(()=>t.remove(),2800);
      }catch(e){}
    }
  }catch(e){}
}

function spGetPrefs(){
  try{const p=JSON.parse(localStorage.getItem(SP_PREF_KEY)||'null');return p||{1:2,2:2,3:2,4:2,5:2,6:1};}
  catch(e){return{1:2,2:2,3:2,4:2,5:2,6:1};}
}
function spSavePrefs(p){try{localStorage.setItem(SP_PREF_KEY,JSON.stringify(p));}catch(e){}try{pushSyncBundle();}catch(e){}}

function spCyclePref(el){
  const prefs=spGetPrefs();
  const day=parseInt(el.dataset.day);
  const cur=parseInt(el.dataset.intensity)||0;
  const next=(cur+1)%4;
  el.dataset.intensity=next;
  prefs[day]=next;
  spSavePrefs(prefs);
}

function spInitPrefs(){
  const prefs=spGetPrefs();
  document.querySelectorAll('.sp-pref-day[data-day]').forEach(el=>{
    const d=parseInt(el.dataset.day);
    if(prefs[d]!==undefined)el.dataset.intensity=prefs[d];
  });
}

function spGetTrend(vakId,domId){
  try{
    const prev=JSON.parse(localStorage.getItem(SP_PREV_KEY)||'{}');
    const key=`${vakId}_${domId}`;
    if(prev[key]===undefined)return'new';
    const {pct,hasData}=getDomeinBestPct(vakId,domId);
    if(!hasData)return'new';
    const diff=pct-prev[key];
    if(diff>0.05)return'up';
    if(diff<-0.05)return'down';
    return'stable';
  }catch(e){return'stable';}
}

function spStorePcts(domains,vakId){
  try{
    const prev=JSON.parse(localStorage.getItem(SP_PREV_KEY)||'{}');
    domains.forEach(d=>{prev[`${vakId}_${d.id}`]=d.pct;});
    localStorage.setItem(SP_PREV_KEY,JSON.stringify(prev));
  }catch(e){}
}

function spDomActivities(dom,trend){
  if(!dom.hasData)return['leerstof','flash'];
  const p=dom.pct;
  if(trend==='down'){
    if(p<0.5)return['flash','quiz','flash'];
    if(p<0.75)return['flash','quiz'];
    return['quiz'];
  }
  if(trend==='up'){
    if(p<0.4)return['flash','quiz'];
    if(p<0.7)return['quiz'];
    return['herhaal'];
  }
  if(p<0.4)return['flash','quiz'];
  if(p<0.7)return['quiz','open'];
  return['herhaal'];
}

// Navigate to a domain and launch an activity
function goToDomein(vakId,domeinId,mode){
  const vak=getVK().find(v=>v.id===vakId);
  if(!vak)return;
  ST.vak=vak;
  ST.domein=vak.domeinen.find(d=>d.id===domeinId);
  if(!ST.domein){openVak(vakId);return;}
  checkPlanAch();
  if(mode==='snel')startQ('snel');
  else if(mode==='oud')startQ('oud');
  else if(mode==='flash')startFlash();
  else openVak(vakId);
}
function renderStudieplan(){
  const el=document.getElementById('studieplan-content');
  if(!el)return;
  const mijn=getMijnVakken();
  const today=new Date();today.setHours(0,0,0,0);
  const todayStr=today.toISOString().slice(0,10);
  const DN=['zo','ma','di','wo','do','vr','za'];
  const MN=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  const prefs=spGetPrefs();
  const BUDGET={0:0,1:30,2:50,3:70}; // minuten per dag per intensiteit

  // [icon, label, cssClass, mode, minutes]
  const ACTS={
    leerstof:['📖','Leerstof lezen','sp-act-leerstof','vak',20],
    quiz:    ['⚡','Snelle quiz',   'sp-act-quiz',    'snel',10],
    flash:   ['🃏','Flashcards',    'sp-act-flash',   'flash',8],
    open:    ['📝','Open vragen',   'sp-act-open',    'oud',15],
    herhaal: ['🔄','Herhalen',      'sp-act-herhaal', 'snel',10],
  };

  const upcoming=EXAM_SCHEDULE.filter(e=>{
    const d=new Date(e.datum);
    return (!e.niveau||e.niveau===APP_LEVEL)&&d>today&&e.vakId&&(mijn.length===0||mijn.includes(e.vakId));
  });
  if(!upcoming.length){
    el.innerHTML='<div class="sp-empty">Geen aankomende examens gevonden.<br>Vink eerst je vakken aan via "Alleen mijn vakken" boven.</div>';
    return;
  }

  // 1. Bouw domeininfo per vak
  const vakInfo={};
  upcoming.forEach(ex=>{
    const vak=getVK().find(v=>v.id===ex.vakId);
    if(!vak||!vak.domeinen)return;
    const examD=new Date(ex.datum);examD.setHours(0,0,0,0);
    const daysLeft=Math.ceil((examD-today)/864e5);
    if(daysLeft<=0)return;
    const domains=vak.domeinen.map(dom=>{
      const {pct,hasData}=getDomeinBestPct(vak.id,dom.id);
      const trend=spGetTrend(vak.id,dom.id);
      const urgency=!hasData?0:pct<0.4?1:pct<0.7?2:3;
      return{id:dom.id,naam:dom.naam,pct,hasData,urgency,trend};
    }).sort((a,b)=>a.urgency-b.urgency||a.pct-b.pct);
    spStorePcts(domains,vak.id);
    vakInfo[vak.id]={vak,ex,examD,daysLeft,domains};
  });

  // 2. Verzamel alle taken in één globale pool, gesorteerd op prioriteit
  const pool=[];
  Object.values(vakInfo).forEach(({vak,examD,daysLeft,domains})=>{
    const examDateStr=examD.toISOString().slice(0,10);
    domains.filter(d=>d.urgency<3).forEach(dom=>{
      spDomActivities(dom,dom.trend).forEach(actKey=>{
        const [,,,mode,mins]=ACTS[actKey];
        const urgFactor=[3,2,1][dom.urgency]??1;
        const priority=(1-dom.pct)*urgFactor*100/Math.max(1,daysLeft)+(dom.trend==='down'?50:0);
        pool.push({priority,vakId:vak.id,vakNaam:vak.naam,domId:dom.id,domNaam:dom.naam,
          actKey,mins,mode,examDateStr,daysLeft,pct:dom.pct,hasData:dom.hasData});
      });
    });
  });
  pool.sort((a,b)=>b.priority-a.priority);

  // 3. Bouw globale studiedagenkaart (vandaag → laatste examen)
  const maxExamD=Object.values(vakInfo).reduce((mx,{examD})=>examD>mx?examD:mx,today);
  const dayMap={};
  {const d=new Date(today);while(d<maxExamD){
    const ds=d.toISOString().slice(0,10);
    const dow=d.getDay();const intensity=dow===0?0:(prefs[dow]??2);
    if(intensity>0)dayMap[ds]={date:new Date(d),intensity,remaining:BUDGET[intensity],tasks:[]};
    d.setDate(d.getDate()+1);
  }}
  const sortedDays=Object.keys(dayMap).sort();

  // 4. Wijs taken toe vanuit pool aan vroegste beschikbare dag met budget
  pool.forEach(task=>{
    for(const ds of sortedDays){
      if(ds>=task.examDateStr)break;
      const day=dayMap[ds];
      if(day.remaining>=task.mins){day.tasks.push(task);day.remaining-=task.mins;return;}
    }
    for(const ds of sortedDays){
      if(ds>=task.examDateStr)break;
      const day=dayMap[ds];
      if(day.remaining>0){day.tasks.push(task);day.remaining=0;return;}
    }
    for(let i=sortedDays.length-1;i>=0;i--){
      if(sortedDays[i]<task.examDateStr){dayMap[sortedDays[i]].tasks.push(task);return;}
    }
  });

  // 5. Voeg herhalingsdag toe de dag vóór elk examen
  Object.values(vakInfo).forEach(({vak,examD,domains})=>{
    const dayBefore=new Date(examD);dayBefore.setDate(examD.getDate()-1);
    if(dayBefore<today||dayBefore.getDay()===0)return;
    const ds=dayBefore.toISOString().slice(0,10);
    if(dayMap[ds])dayMap[ds].tasks.push({isReview:true,vakId:vak.id,vakNaam:vak.naam,
      actKey:'herhaal',mins:15,mode:'snel',domId:'_review',domNaam:'Herhaling'});
  });

  // 6. Platte takenlijst voor widget + autodetectie
  const allPlanTasks=[];
  sortedDays.forEach(ds=>{
    (dayMap[ds]?.tasks||[]).forEach(t=>{
      if(!t.isReview)allPlanTasks.push({dateStr:ds,...t});
    });
  });
  spStorePlan(allPlanTasks);
  if(!allPlanTasks.length&&!Object.keys(vakInfo).length){
    el.innerHTML='<div class="sp-empty">Alle domeinen zijn al klaar! 🎉</div>';return;
  }

  const doneMap=spGetDone();
  const fmtDate=d=>`${d.getDate()} ${MN[d.getMonth()]}`;
  function dayLbl(d){
    const ds=d.toISOString().slice(0,10);if(ds===todayStr)return'Vandaag';
    const tmr=new Date(today);tmr.setDate(today.getDate()+1);
    if(ds===tmr.toISOString().slice(0,10))return'Morgen';
    return DN[d.getDay()];
  }
  function ringHtml(pct,color){
    const r=9,cx=12,cy=12,circ=2*Math.PI*r;
    const off=(circ*(1-Math.max(0,Math.min(1,pct||0)))).toFixed(1);
    return`<svg width="26" height="26" viewBox="0 0 24 24" style="flex-shrink:0"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${off}" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/></svg>`;
  }
  function pctColor(pct,hasData){
    if(!hasData)return'rgba(255,255,255,.25)';
    if(pct<0.4)return'#ef4444';if(pct<0.7)return'#f97316';return'#22c55e';
  }
  function trendHtml(trend){
    if(trend==='up')return'<span class="sp-trend-up">↑</span>';
    if(trend==='down')return'<span class="sp-trend-down">↓</span>';
    if(trend==='new')return'<span class="sp-trend-stable" style="font-size:9px">nieuw</span>';
    return'';
  }

  // ── Vandaag sectie ──
  const todayAllTasks=(dayMap[todayStr]?.tasks||[]).filter(t=>!t.isReview);
  const todayOpenTasks=todayAllTasks.filter(t=>!doneMap[`${todayStr}_${t.vakId}_${t.domId}_${t.actKey}`]);
  let vandaagHtml='';
  if(todayAllTasks.length>0){
    const todayMins=todayAllTasks.reduce((s,t)=>s+(t.mins||0),0);
    const allDoneToday=todayOpenTasks.length===0;
    const cards=todayAllTasks.map(t=>{
      const key=`${todayStr}_${t.vakId}_${t.domId}_${t.actKey}`;
      const isDone=!!doneMap[key];
      const [icon,label,cls,mode,mins]=ACTS[t.actKey];
      return`<div class="sp-task-card${isDone?' sp-done':''}" id="sp-card-${key}">
        <div class="sp-task-card-left">
          <div class="sp-task-card-vak">${t.vakNaam}</div>
          <div class="sp-task-card-dom">${t.domNaam}</div>
          <div class="sp-task-card-meta">
            <button class="sp-act-btn ${cls}" style="padding:4px 10px;font-size:11px" onclick="goToDomein('${t.vakId}','${t.domId}','${mode}')">${icon} ${label} →</button>
            <span class="sp-task-card-time">~${mins} min</span>
          </div>
        </div>
        <button class="sp-check-btn${isDone?' checked':''}" data-spkey="${key}"
          onclick="spMarkDone('${key}');this.classList.add('checked');this.closest('.sp-task-card')?.classList.add('sp-done');renderVandaagWidget()"
          aria-label="Markeer als gedaan">
          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
      </div>`;
    }).join('');
    vandaagHtml=`<div class="sp-vandaag">
      <div class="sp-vandaag-header">
        <div class="sp-vandaag-title">📌 Vandaag</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="sp-task-card-time" style="font-size:12px">~${todayMins} min</span>
          ${allDoneToday?'<span style="font-size:12px;color:#22c55e;font-weight:700;background:rgba(34,197,94,.12);padding:2px 9px;border-radius:20px;border:1px solid rgba(34,197,94,.2)">✓ Klaar!</span>':`<span class="sp-vandaag-badge">${todayOpenTasks.length} open</span>`}
        </div>
      </div>
      ${cards}
    </div>`;
  } else if(allPlanTasks.length>0){
    vandaagHtml=`<div class="sp-vandaag" style="text-align:center;padding:18px 16px">
      <div class="sp-vandaag-title" style="margin-bottom:6px">📌 Vandaag</div>
      <div style="font-size:13px;color:var(--mu)">🌴 Vrije dag — goed verdiend!</div>
    </div>`;
  }

  // ── Statistieken ──
  const totalTasks=allPlanTasks.length;
  const totalMins=allPlanTasks.reduce((s,t)=>s+(t.mins||0),0);
  const totalDoneTasks=allPlanTasks.filter(t=>!!doneMap[`${t.dateStr}_${t.vakId}_${t.domId}_${t.actKey}`]).length;
  const summaryHtml=`<div class="sp-summary">
    <div class="sp-sum-card"><div class="sp-sum-val">${totalTasks}</div><div class="sp-sum-lbl">Taken gepland</div></div>
    <div class="sp-sum-card"><div class="sp-sum-val">${totalDoneTasks}</div><div class="sp-sum-lbl">Gedaan</div></div>
    <div class="sp-sum-card"><div class="sp-sum-val">~${(totalMins/60).toFixed(1)}u</div><div class="sp-sum-lbl">Studeertijd</div></div>
  </div>`;

  // ── Kalender: komende dagen ──
  const futureDates=sortedDays.filter(ds=>ds>todayStr&&(dayMap[ds]?.tasks||[]).length>0).slice(0,14);
  let calHtml='';
  if(futureDates.length>0){
    const intColors={1:'#22c55e',2:'var(--or)',3:'#ef4444'};
    const dayRows=futureDates.map(ds=>{
      const day=dayMap[ds];
      const d=day.date;
      const realTasks=day.tasks.filter(t=>!t.isReview);
      const reviewTasks=day.tasks.filter(t=>t.isReview);
      const usedMins=realTasks.reduce((s,t)=>s+(t.mins||0),0);
      const doneCnt=realTasks.filter(t=>!!doneMap[`${ds}_${t.vakId}_${t.domId}_${t.actKey}`]).length;
      const allDone=realTasks.length>0&&doneCnt===realTasks.length;
      const taskRows=[...realTasks.map(t=>{
        const isDone=!!doneMap[`${ds}_${t.vakId}_${t.domId}_${t.actKey}`];
        const [icon,,,, mins]=ACTS[t.actKey];
        return`<div class="sp-cal-task-row${isDone?' sp-done':''}">
          <span class="sp-act-badge">${icon}</span>
          <div class="sp-cal-task-info">
            <span class="sp-cal-task-vak">${t.vakNaam}</span>
            <span class="sp-cal-task-dom">${t.domNaam}</span>
          </div>
          <span class="sp-cal-task-meta">~${mins}m</span>
        </div>`;
      }),...reviewTasks.map(t=>`<div class="sp-cal-task-row" style="opacity:.65">
        <span class="sp-act-badge">🔄</span>
        <div class="sp-cal-task-info">
          <span class="sp-cal-task-vak">${t.vakNaam}</span>
          <span class="sp-cal-task-dom">Herhalingsdag vóór examen</span>
        </div>
        <span class="sp-cal-task-meta">~15m</span>
      </div>`)].join('');
      return`<div class="sp-cal-day${allDone?' sp-done':''}">
        <div class="sp-cal-day-header">
          <div>
            <div class="sp-cal-day-name">${dayLbl(d)}</div>
            <div class="sp-cal-day-date">${fmtDate(d)}</div>
          </div>
          <div class="sp-cal-day-right">
            <span class="sp-cal-task-count" style="color:${intColors[day.intensity]||'var(--mu)'}">${realTasks.length+reviewTasks.length} taken</span>
            <span class="sp-cal-mins">~${usedMins} min</span>
            ${allDone?'<span class="sp-cal-done-badge">✓ Klaar</span>':''}
          </div>
        </div>
        <div class="sp-cal-tasks">${taskRows}</div>
      </div>`;
    }).join('');
    calHtml=`<div style="margin-top:4px"><div class="sp-section-title">Komende dagen</div>${dayRows}</div>`;
  }

  // ── Beheersing per vak ──
  let masteryHtml='<div style="margin-top:24px"><div class="sp-section-title">Beheersing per vak</div>';
  Object.values(vakInfo).forEach(({vak,examD,daysLeft,domains})=>{
    const doneCount=domains.filter(d=>d.urgency===3).length;
    const donePct=domains.length?Math.round(doneCount/domains.length*100):100;
    const urgCls=daysLeft<=5?'urgent':daysLeft<=12?'soon':'ok';
    const urgTxt=daysLeft<=5?`⚠️ ${daysLeft}d`:`${daysLeft}d`;
    masteryHtml+=`<div class="sp-vak-block" style="margin-bottom:12px">
      <div class="sp-vak-header">
        ${vak.kleur?`<div class="sp-vak-dot" style="background:${vak.kleur}"></div>`:''}
        <div class="sp-vak-name">${vak.naam}</div>
        <div class="sp-vak-meta">${doneCount}/${domains.length} klaar</div>
        <span class="sp-vak-countdown ${urgCls}">${urgTxt}</span>
      </div>
      <div class="sp-progress-bar"><div class="sp-progress-fill" style="width:${donePct}%"></div></div>
      <div class="sp-mastery-grid">${domains.map(dom=>{
        const color=pctColor(dom.pct,dom.hasData);
        const pctTxt=dom.hasData?Math.round(dom.pct*100)+'%':'–';
        return`<div class="sp-mastery-card">
          ${ringHtml(dom.pct,color)}
          <div class="sp-mastery-info">
            <div class="sp-mastery-name">${dom.naam}</div>
            <div class="sp-mastery-row"><span class="sp-mastery-pct" style="color:${color}">${pctTxt}</span>${trendHtml(dom.trend)}</div>
            <div class="sp-mastery-bar"><div class="sp-mastery-bar-fill" style="width:${dom.hasData?Math.round(dom.pct*100):0}%;background:${color}"></div></div>
          </div>
        </div>`;
      }).join('')}</div>
    </div>`;
  });
  masteryHtml+='</div>';

  el.innerHTML=vandaagHtml+summaryHtml+calHtml+masteryHtml;
  localStorage.setItem('slagio_plan_generated','1');
  if(todayAllTasks.length)setTimeout(()=>document.querySelector('.sp-vandaag')?.scrollIntoView({behavior:'smooth',block:'nearest'}),120);
  const btn=document.getElementById('sp-gen-btn');
  if(btn)btn.textContent='🔄 Herbereken studieplan';
  try{trackEvent('studieplan_generated',{vakken:Object.keys(vakInfo).length});}catch(e){}
}
// ═══════ TOEGANKELIJKHEID ═══════
const ACC_KEY='slagio_acc_v1';
function getAccPrefs(){try{return JSON.parse(localStorage.getItem(ACC_KEY)||'{}');}catch(e){return{};}}
function toggleDyslexie(on){const p=getAccPrefs();p.dyslexie=on;localStorage.setItem(ACC_KEY,JSON.stringify(p));applyAccPrefs();}
function toggleHoogContrast(on){const p=getAccPrefs();p.contrast=on;localStorage.setItem(ACC_KEY,JSON.stringify(p));applyAccPrefs();}
function applyAccPrefs(){
  const p=getAccPrefs();
  document.body.classList.toggle('dyslexie',!!p.dyslexie);
  document.body.classList.toggle('hoog-contrast',!!p.contrast);
  if(p.dyslexie&&!document.getElementById('dyslexic-font')){
    const link=document.createElement('link');
    link.id='dyslexic-font';link.rel='stylesheet';
    link.href='https://fonts.cdnfonts.com/css/opendyslexic';
    document.head.appendChild(link);
  }
  const t1=document.getElementById('acc-dyslexie-toggle');
  const t2=document.getElementById('acc-contrast-toggle');
  if(t1)t1.checked=!!p.dyslexie;
  if(t2)t2.checked=!!p.contrast;
}
// Apply on load
applyAccPrefs();

// ═══════ LEERPAD ═══════
function showLeerpad(){
  if(!ST.vak)return;
  const vak=ST.vak;
  const domeinen=vak.domeinen;

  // Header
  document.getElementById('lp-nav-title').textContent=vak.naam;
  document.getElementById('lp-nav-badge').textContent=(APP_LEVEL||'havo').toUpperCase();
  document.getElementById('lp-hero-title').textContent=vak.naam;

  // Stats
  let doneCount=0,totalPct=0,pctCount=0;
  domeinen.forEach(d=>{
    const r=getDomeinBestPct(vak.id,d.id);
    if(r.pct>=0.7)doneCount++;
    if(r.hasData){totalPct+=r.pct;pctCount++;}
  });
  const avgPct=pctCount>0?Math.round(totalPct/pctCount*100):0;
  const overallPct=Math.round(doneCount/domeinen.length*100);
  const allDone=domeinen.length>0&&doneCount===domeinen.length;

  document.getElementById('lp-stat-done').textContent=doneCount;
  document.getElementById('lp-stat-total').textContent=domeinen.length;
  document.getElementById('lp-stat-avg').textContent=avgPct+'%';
  document.getElementById('lp-overall-pct').textContent=overallPct+'%';
  document.getElementById('lp-hero-sub').textContent=
    allDone?'🎉 Alle domeinen voltooid — goed bezig!':
    doneCount>0?`${doneCount} van ${domeinen.length} domeinen voltooid`:
    'Werk systematisch door alle domeinen heen';

  document.getElementById('lp-champion').style.display=allDone?'block':'none';

  // Find recommended next domain (first not done, or first needing review)
  let nextIdx=-1;
  for(let i=0;i<domeinen.length;i++){
    const r=getDomeinBestPct(vak.id,domeinen[i].id);
    const decay=getDecayStatus(vak.id,domeinen[i].id);
    const isDone=r.pct>=0.7;
    const needsReview=isDone&&decay&&(decay.label.includes('geleden')&&!decay.label.includes('Vandaag'));
    if(needsReview&&nextIdx===-1){nextIdx=i;}
    if(!isDone&&nextIdx===-1){nextIdx=i;}
  }
  if(nextIdx===-1)nextIdx=0;

  // Build path HTML
  const container=document.getElementById('lp-path');
  container.innerHTML='';
  const R=40,SZ=88,C=(2*Math.PI*R); // bigger ring: r=40, 88px SVG

  domeinen.forEach((d,i)=>{
    const isUnlocked=i===0||getDomeinBestPct(vak.id,domeinen[i-1].id).pct>=0.60;
    const r=getDomeinBestPct(vak.id,d.id);
    const decay=getDecayStatus(vak.id,d.id);
    const pct=Math.round(r.pct*100);
    const isDone=r.pct>=0.7;
    const isStarted=r.hasData&&!isDone;
    const needsReview=isDone&&decay&&(decay.label.includes('geleden')&&!decay.label.includes('Vandaag'));
    const isNext=i===nextIdx;

    if(!isUnlocked){
      // LOCKED domain
      const statusKey='s-locked';
      const statusEmoji='🔒';
      const statusTxt=`Domein ${domeinen[i-1].id} eerst voltooien`;
      const ringStroke='rgba(255,255,255,.1)';
      const ringGlow='';
      const connHtml=`<div class="lp-conn"><div class="lp-conn-line"><div class="lp-conn-fill"></div></div></div>`;
      const side=i%2===0?'r-left':'r-right';
      const delayStyle=`animation-delay:${i*0.09}s`;
      const prevDomeinId=domeinen[i-1].id;
      const nodeHtml=`${connHtml}
<div class="lp-node-wrap" style="${delayStyle}">
<div class="lp-row ${side}">
  <div class="lp-row-side">
    <div class="lp-card lp-locked" onclick="showToast('Voltooi eerst Domein ${prevDomeinId} (60%) om dit domein te ontgrendelen 🔒','#6366f1',3000)">
      <div class="lp-card-head">
        <div class="lp-card-letter" style="background:rgba(255,255,255,.06);color:rgba(255,255,255,.3)">${d.id}</div>
        <div class="lp-card-name">Domein ${d.id}<br><span style="font-weight:500;font-size:11.5px;color:rgba(255,255,255,.25)">${d.naam}</span></div>
      </div>
      <div class="lp-card-badge ${statusKey}">${statusEmoji} ${statusTxt}</div>
    </div>
  </div>
  <div class="lp-row-mid">
    <div class="lp-ring-outer lp-locked-ring">
      <svg class="lp-ring-svg" width="${SZ}" height="${SZ}" viewBox="0 0 ${SZ} ${SZ}">
        <circle class="lp-ring-bg" cx="44" cy="44" r="${R}" stroke="${ringStroke}"/>
        <text x="44" y="44" text-anchor="middle" font-size="22" style="dominant-baseline:middle">🔒</text>
      </svg>
    </div>
  </div>
  <div class="lp-row-side" style="visibility:hidden"></div>
</div>
</div>`;
      container.insertAdjacentHTML('beforeend',nodeHtml);
      return;
    }

    // Status
    let statusKey,statusTxt,statusEmoji,ringStroke,ringGlow;
    if(isDone&&needsReview){
      statusKey='s-review';statusTxt='Herhaling aanbevolen';statusEmoji='🔁';ringStroke='#f97316';ringGlow='';
    }else if(isDone){
      statusKey='s-done';statusTxt='Voltooid ✓';statusEmoji='⭐';ringStroke='#4ade80';ringGlow='done';
    }else if(isNext&&!isStarted){
      statusKey='s-next';statusTxt='Begin hier';statusEmoji='🎯';ringStroke='var(--or)';ringGlow='next';
    }else if(isStarted){
      statusKey='s-started';statusTxt=pct+'% beste score';statusEmoji='⚡';ringStroke='var(--or)';ringGlow=isNext?'next':'';
    }else{
      statusKey='s-locked';statusTxt='Nog niet geoefend';statusEmoji='📖';ringStroke='rgba(255,255,255,.12)';ringGlow='';
    }
    const ringOffset=(C*(1-r.pct)).toFixed(1);
    const pctColor=isDone?'#4ade80':isStarted||isNext?'var(--or)':'rgba(255,255,255,.3)';

    // Connector from previous node
    let connHtml='';
    if(i>0){
      const prevDone=getDomeinBestPct(vak.id,domeinen[i-1].id).pct>=0.7;
      const connDone=(prevDone&&isDone)?'done':'';
      connHtml=`<div class="lp-conn"><div class="lp-conn-line"><div class="lp-conn-fill ${connDone}"></div></div></div>`;
    }

    const cardCls=`lp-card ${isDone?'s-done':''} ${needsReview?'s-review':''} ${(isNext&&!isDone)?'s-next':''}`.trim();
    const side=i%2===0?'r-left':'r-right';
    const miniBarHtml=r.hasData?`<div class="lp-mini-bar"><div class="lp-mini-fill" style="background:${ringStroke}" data-w="${pct}"></div></div>`:'';
    const glowHtml=ringGlow?`<div class="lp-ring-glow lp-ring-glow-${ringGlow}"></div>`:'';
    const delayStyle=`animation-delay:${i*0.09}s`;

    const nodeHtml=`${connHtml}
<div class="lp-node-wrap" style="${delayStyle}">
<div class="lp-row ${side}">
  <div class="lp-row-side">
    <div class="${cardCls}" onclick="lpToggleCard(this,'${d.id}')">
      ${isNext&&!isDone?'<div class="lp-next-pill">▶ Volgende</div>':''}
      <div class="lp-card-head">
        <div class="lp-card-letter" style="background:${vak.kleur}28;color:${vak.kleur}">${d.id}</div>
        <div class="lp-card-name">Domein ${d.id}<br><span style="font-weight:500;font-size:11.5px;color:rgba(255,255,255,.45)">${d.naam}</span></div>
      </div>
      <div class="lp-card-badge ${statusKey}">${statusEmoji} ${statusTxt}</div>
      ${miniBarHtml}
      <div class="lp-card-extra">
        <div class="lp-card-desc">${d.beschrijving}</div>
        <div class="lp-card-btns">
          <button class="lp-qbtn primary" onclick="event.stopPropagation();lpStartOefenen('${d.id}')">▶ Oefenen</button>
          <button class="lp-qbtn" onclick="event.stopPropagation();lpStartFlash('${d.id}')">📇 Flashcards</button>
        </div>
      </div>
    </div>
  </div>
  <div class="lp-row-mid">
    <div class="lp-ring-outer">
      ${glowHtml}
      <svg class="lp-ring-svg" width="${SZ}" height="${SZ}" viewBox="0 0 ${SZ} ${SZ}">
        <circle class="lp-ring-bg" cx="44" cy="44" r="${R}"/>
        <circle class="lp-ring-fill"
          cx="44" cy="44" r="${R}"
          stroke="${ringStroke}"
          stroke-dasharray="${C.toFixed(1)}"
          stroke-dashoffset="${C.toFixed(1)}"
          data-to="${ringOffset}"
          style="transform:rotate(-90deg);transform-origin:44px 44px"/>
        <text x="44" y="40" text-anchor="middle" font-size="22" style="dominant-baseline:middle">${statusEmoji}</text>
        ${r.hasData?`<text x="44" y="58" text-anchor="middle" font-size="11" font-weight="800" fill="${pctColor}" font-family="Inter,sans-serif" letter-spacing="0.5">${pct}%</text>`:''}
      </svg>
    </div>
  </div>
  <div class="lp-row-side" style="visibility:hidden"></div>
</div>
</div>`;
    container.insertAdjacentHTML('beforeend',nodeHtml);
  });

  // Show screen first, then animate
  show('sc-leerpad');
  setTimeout(()=>{
    container.querySelectorAll('.lp-ring-fill').forEach(ring=>{
      const target=ring.dataset.to;
      if(target!==undefined)ring.style.strokeDashoffset=target;
    });
    container.querySelectorAll('.lp-mini-fill').forEach(fill=>{
      fill.style.width=(fill.dataset.w||'0')+'%';
    });
    container.querySelectorAll('.lp-conn-fill.done').forEach(fill=>{
      // re-trigger animation by removing and re-adding class
      fill.classList.remove('done');
      requestAnimationFrame(()=>requestAnimationFrame(()=>fill.classList.add('done')));
    });
    document.getElementById('lp-overall-fill').style.width=overallPct+'%';
  },150);
}

function lpToggleCard(card,domeinId){
  const extra=card.querySelector('.lp-card-extra');
  if(!extra)return;
  const isOpen=extra.classList.contains('open');
  // Close all other open cards first
  document.querySelectorAll('#lp-path .lp-card-extra.open').forEach(e=>{
    e.classList.remove('open');
    e.closest('.lp-card').style.zIndex='';
  });
  if(!isOpen){
    extra.classList.add('open');
    card.style.zIndex='2';
  }
}

function lpStartOefenen(domeinId){
  if(!ST.vak)return;
  ST.domein=ST.vak.domeinen.find(d=>d.id===domeinId);
  if(!ST.domein)return;
  openQmode(domeinId);
}

function lpStartFlash(domeinId){
  if(!ST.vak)return;
  ST.domein=ST.vak.domeinen.find(d=>d.id===domeinId);
  if(!ST.domein)return;
  show('sc-flash');
  startFlash();
}

