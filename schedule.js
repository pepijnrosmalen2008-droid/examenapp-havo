// ═══════ EXAM SCHEDULE ═══════
const EXAM_SCHEDULE=[
// ── HAVO CSE 1e tijdvak 2026 ──
{datum:'2026-05-08',tijd:'09:00–12:00',vak:'Filosofie',duur:'3 uur',niveau:'havo'},
{datum:'2026-05-08',tijd:'13:30–16:30',vak:'Nederlands',duur:'3 uur',niveau:'havo',vakId:'nl'},
{datum:'2026-05-11',tijd:'09:00–12:00',vak:'Kunst (algemeen)',duur:'3 uur',niveau:'havo'},
{datum:'2026-05-11',tijd:'13:30–16:30',vak:'Economie',duur:'3 uur',niveau:'havo',vakId:'ec'},
{datum:'2026-05-12',tijd:'09:00–12:00',vak:'Geschiedenis',duur:'3 uur',niveau:'havo',vakId:'gs'},
{datum:'2026-05-12',tijd:'13:30–16:30',vak:'Scheikunde',duur:'3 uur',niveau:'havo',vakId:'sk'},
{datum:'2026-05-13',tijd:'13:30–16:00',vak:'Frans',duur:'2,5 uur',niveau:'havo'},
{datum:'2026-05-18',tijd:'09:00–12:00',vak:'Maatschappijwetenschappen',duur:'3 uur',niveau:'havo',vakId:'mw'},
{datum:'2026-05-18',tijd:'13:30–16:00',vak:'Engels',duur:'2,5 uur',niveau:'havo',vakId:'en'},
{datum:'2026-05-19',tijd:'09:00–11:30',vak:'Muziek',duur:'2,5 uur',niveau:'havo'},
{datum:'2026-05-19',tijd:'13:30–16:30',vak:'Wiskunde A / Wiskunde B',duur:'3 uur',niveau:'havo',vakId:'wa'},
{datum:'2026-05-20',tijd:'09:00–11:30',vak:'Duits',duur:'2,5 uur',niveau:'havo'},
{datum:'2026-05-20',tijd:'13:30–16:30',vak:'Biologie',duur:'3 uur',niveau:'havo',vakId:'bi'},
{datum:'2026-05-21',tijd:'09:00–11:30',vak:'Tekenen/Handvaardigheid',duur:'2,5 uur',niveau:'havo'},
{datum:'2026-05-21',tijd:'13:30–16:30',vak:'Aardrijkskunde',duur:'3 uur',niveau:'havo',vakId:'ak'},
{datum:'2026-05-22',tijd:'13:30–16:30',vak:'Bedrijfseconomie',duur:'3 uur',niveau:'havo',vakId:'be'},
{datum:'2026-05-26',tijd:'13:30–16:30',vak:'Natuurkunde',duur:'3 uur',niveau:'havo',vakId:'na'},
{datum:'2026-05-27',tijd:'09:00–11:30',vak:'Fries / Russisch',duur:'2,5 uur',niveau:'havo'},
{datum:'2026-05-27',tijd:'13:30–16:00',vak:'Arabisch / Spaans / Turks',duur:'2,5 uur',niveau:'havo'},
// ── VWO CSE 1e tijdvak 2026 ──
{datum:'2026-05-08',tijd:'09:00–12:00',vak:'Kunst (algemeen)',duur:'3 uur',niveau:'vwo'},
{datum:'2026-05-08',tijd:'13:30–16:30',vak:'Bedrijfseconomie',duur:'3 uur',niveau:'vwo'},
{datum:'2026-05-11',tijd:'09:00–12:00',vak:'Geschiedenis',duur:'3 uur',niveau:'vwo',vakId:'gs'},
{datum:'2026-05-11',tijd:'13:30–16:30',vak:'Natuurkunde',duur:'3 uur',niveau:'vwo',vakId:'na'},
{datum:'2026-05-12',tijd:'09:00–11:30',vak:'Tekenen/Handvaardigheid',duur:'2,5 uur',niveau:'vwo'},
{datum:'2026-05-12',tijd:'13:30–16:30',vak:'Nederlands',duur:'3 uur',niveau:'vwo',vakId:'nl'},
{datum:'2026-05-13',tijd:'09:00–12:00',vak:'Filosofie',duur:'3 uur',niveau:'vwo'},
{datum:'2026-05-13',tijd:'13:30–16:30',vak:'Wiskunde A',duur:'3 uur',niveau:'vwo',vakId:'wa'},
{datum:'2026-05-13',tijd:'13:30–16:30',vak:'Wiskunde B',duur:'3 uur',niveau:'vwo',vakId:'wb'},
{datum:'2026-05-18',tijd:'09:00–11:30',vak:'Duits',duur:'2,5 uur',niveau:'vwo',vakId:'du'},
{datum:'2026-05-18',tijd:'13:30–16:30',vak:'Aardrijkskunde',duur:'3 uur',niveau:'vwo',vakId:'ak'},
{datum:'2026-05-19',tijd:'09:00–12:00',vak:'Latijnse taal en cultuur',duur:'3 uur',niveau:'vwo',vakId:'la'},
{datum:'2026-05-19',tijd:'13:30–16:30',vak:'Scheikunde',duur:'3 uur',niveau:'vwo',vakId:'sk'},
{datum:'2026-05-20',tijd:'09:00–12:00',vak:'Maatschappijwetenschappen',duur:'3 uur',niveau:'vwo',vakId:'mw'},
{datum:'2026-05-20',tijd:'13:30–16:00',vak:'Engels',duur:'2,5 uur',niveau:'vwo',vakId:'en'},
{datum:'2026-05-21',tijd:'09:00–11:30',vak:'Muziek',duur:'2,5 uur',niveau:'vwo'},
{datum:'2026-05-21',tijd:'13:30–16:30',vak:'Economie',duur:'3 uur',niveau:'vwo',vakId:'ec'},
{datum:'2026-05-22',tijd:'09:00–12:00',vak:'Griekse taal en cultuur',duur:'3 uur',niveau:'vwo',vakId:'gr'},
{datum:'2026-05-22',tijd:'13:30–16:30',vak:'Biologie',duur:'3 uur',niveau:'vwo',vakId:'bi'},
{datum:'2026-05-26',tijd:'13:30–16:00',vak:'Frans',duur:'2,5 uur',niveau:'vwo',vakId:'fr'},
{datum:'2026-05-27',tijd:'09:00–11:30',vak:'Fries / Russisch',duur:'2,5 uur',niveau:'vwo'},
{datum:'2026-05-27',tijd:'13:30–16:00',vak:'Arabisch / Spaans / Turks',duur:'2,5 uur',niveau:'vwo'},
// ── HAVO CSE 2e tijdvak 2026 (herkansingen) ──
{datum:'2026-06-16',tijd:'13:30–16:00',vak:'Frans',duur:'2,5 uur',niveau:'havo',tijdvak:2},
{datum:'2026-06-16',tijd:'13:30–16:30',vak:'Natuurkunde',duur:'3 uur',niveau:'havo',vakId:'na',tijdvak:2},
{datum:'2026-06-16',tijd:'13:30–16:30',vak:'Scheikunde',duur:'3 uur',niveau:'havo',vakId:'sk',tijdvak:2},
{datum:'2026-06-17',tijd:'13:30–16:30',vak:'Economie',duur:'3 uur',niveau:'havo',vakId:'ec',tijdvak:2},
{datum:'2026-06-17',tijd:'13:30–16:30',vak:'Nederlands',duur:'3 uur',niveau:'havo',vakId:'nl',tijdvak:2},
{datum:'2026-06-17',tijd:'13:30–16:30',vak:'Wiskunde A',duur:'3 uur',niveau:'havo',vakId:'wa',tijdvak:2},
{datum:'2026-06-18',tijd:'13:30–16:30',vak:'Aardrijkskunde',duur:'3 uur',niveau:'havo',vakId:'ak',tijdvak:2},
{datum:'2026-06-18',tijd:'13:30–16:30',vak:'Geschiedenis',duur:'3 uur',niveau:'havo',vakId:'gs',tijdvak:2},
{datum:'2026-06-18',tijd:'13:30–16:30',vak:'Wiskunde B',duur:'3 uur',niveau:'havo',vakId:'wb',tijdvak:2},
{datum:'2026-06-22',tijd:'13:30–16:00',vak:'Engels',duur:'2,5 uur',niveau:'havo',vakId:'en',tijdvak:2},
{datum:'2026-06-22',tijd:'13:30–16:30',vak:'Bedrijfseconomie',duur:'3 uur',niveau:'havo',vakId:'be',tijdvak:2},
{datum:'2026-06-23',tijd:'13:30–16:00',vak:'Duits',duur:'2,5 uur',niveau:'havo',tijdvak:2},
{datum:'2026-06-23',tijd:'13:30–16:30',vak:'Biologie',duur:'3 uur',niveau:'havo',vakId:'bi',tijdvak:2},
{datum:'2026-06-23',tijd:'13:30–16:30',vak:'Maatschappijwetenschappen',duur:'3 uur',niveau:'havo',vakId:'mw',tijdvak:2},
// ── VWO CSE 2e tijdvak 2026 (herkansingen) ──
{datum:'2026-06-16',tijd:'13:30–16:00',vak:'Frans',duur:'2,5 uur',niveau:'vwo',vakId:'fr',tijdvak:2},
{datum:'2026-06-16',tijd:'13:30–16:30',vak:'Natuurkunde',duur:'3 uur',niveau:'vwo',vakId:'na',tijdvak:2},
{datum:'2026-06-16',tijd:'13:30–16:30',vak:'Scheikunde',duur:'3 uur',niveau:'vwo',vakId:'sk',tijdvak:2},
{datum:'2026-06-17',tijd:'13:30–16:30',vak:'Economie',duur:'3 uur',niveau:'vwo',vakId:'ec',tijdvak:2},
{datum:'2026-06-17',tijd:'13:30–16:30',vak:'Nederlands',duur:'3 uur',niveau:'vwo',vakId:'nl',tijdvak:2},
{datum:'2026-06-17',tijd:'13:30–16:30',vak:'Wiskunde A',duur:'3 uur',niveau:'vwo',vakId:'wa',tijdvak:2},
{datum:'2026-06-18',tijd:'13:30–16:30',vak:'Aardrijkskunde',duur:'3 uur',niveau:'vwo',vakId:'ak',tijdvak:2},
{datum:'2026-06-18',tijd:'13:30–16:30',vak:'Geschiedenis',duur:'3 uur',niveau:'vwo',vakId:'gs',tijdvak:2},
{datum:'2026-06-18',tijd:'13:30–16:30',vak:'Wiskunde B',duur:'3 uur',niveau:'vwo',vakId:'wb',tijdvak:2},
{datum:'2026-06-22',tijd:'13:30–16:00',vak:'Engels',duur:'2,5 uur',niveau:'vwo',vakId:'en',tijdvak:2},
{datum:'2026-06-22',tijd:'13:30–16:30',vak:'Bedrijfseconomie',duur:'3 uur',niveau:'vwo',tijdvak:2},
{datum:'2026-06-23',tijd:'13:30–16:00',vak:'Duits',duur:'2,5 uur',niveau:'vwo',vakId:'du',tijdvak:2},
{datum:'2026-06-23',tijd:'13:30–16:30',vak:'Biologie',duur:'3 uur',niveau:'vwo',vakId:'bi',tijdvak:2},
{datum:'2026-06-23',tijd:'13:30–16:30',vak:'Maatschappijwetenschappen',duur:'3 uur',niveau:'vwo',vakId:'mw',tijdvak:2}
];
function getMijnVakken(){try{const d=JSON.parse(localStorage.getItem('examenapp_'+lvlCol('mijnvakken'))||'[]');return Array.isArray(d)?d:(d.list||[]);}catch(e){return [];}}
function setMijnVakken(arr){cloudSet(lvlCol('mijnvakken'),{list:arr});try{pushSyncBundle();}catch(e){}}
function renderSchedule(){
  const list=document.getElementById('schedule-list');
  const onlyMine=document.getElementById('sch-filter-mine').checked;
  const mijn=getMijnVakken();
  list.innerHTML='';
  const now=new Date();
  const dagNamen=['zo','ma','di','wo','do','vr','za'];
  const maandNamen=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  // Dynamische header
  const hdr=document.getElementById('sch-header');
  if(hdr)hdr.textContent='Examenrooster '+APP_LEVEL.toUpperCase()+' 2026';
  // Vakken van huidig niveau
  const niveauVakIds=new Set(getVK().map(v=>v.id));
  let _tv2Shown=false;
  EXAM_SCHEDULE.forEach(ex=>{
    // Verberg als item bij een specifiek ander niveau hoort
    if(ex.niveau&&ex.niveau!==APP_LEVEL)return;
    if(ex.vakId&&!niveauVakIds.has(ex.vakId))return;
    if(onlyMine&&!mijn.includes(ex.vakId||ex.vak))return;
    if(ex.tijdvak===2&&!_tv2Shown){_tv2Shown=true;list.innerHTML+='<div class="sch-tv-divider">↻ Tweede tijdvak — herkansingen</div>';}
    const d=new Date(ex.datum+'T'+ex.tijd.split('–')[0]+':00+02:00');
    const diff=d-now;
    let cdText='';
    if(diff<=0)cdText='Afgelopen';
    else{const dd=Math.floor(diff/(1000*60*60*24));const hh=Math.floor((diff%(1000*60*60*24))/(1000*60*60));cdText=dd>0?dd+'d '+hh+'u':'< '+hh+' uur';}
    const isMine=mijn.includes(ex.vakId||ex.vak);
    const dagNaam=dagNamen[d.getDay()];
    const datumStr=dagNaam+' '+d.getDate()+' '+maandNamen[d.getMonth()];
    list.innerHTML+=`<div class="sch-card${isMine?' sch-mine':''}">
      <input type="checkbox" class="sch-check" ${isMine?'checked':''} onchange="toggleMijnVak('${ex.vakId||ex.vak}',this.checked)">
      <div class="sch-date">${datumStr}</div>
      <div class="sch-time">${ex.tijd}</div>
      <div class="sch-name">${ex.vak}</div>
      <div class="sch-dur">${ex.duur}</div>
      <div class="sch-cd">${cdText}</div>
    </div>`;
  });
}
function toggleMijnVak(id,checked){
  let m=getMijnVakken();
  if(checked&&!m.includes(id))m.push(id);
  if(!checked)m=m.filter(v=>v!==id);
  setMijnVakken(m);
  renderSchedule();
  updateCountdown(); // refresh timer to reflect new vak selection
}
// Start countdown now that EXAM_SCHEDULE is defined
updateCountdown();
if(!window._cdTimer)window._cdTimer=setInterval(updateCountdown,1000);

// ═══════ GRADE CALCULATORS ═══════
function switchCalc(id){
  document.querySelectorAll('.calc-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.calc-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('calc-'+id).classList.add('active');
  event.target.classList.add('active');
  if(id==='slaag')buildSlaagInputs();
  if(id==='eind'){buildEindVakSelect();}
  if(id==='nterm'){buildNtermVakSelect();}
  if(id==='herk'){buildHerkSelect();const firstId=document.getElementById('herk-vak')?.value;if(firstId)buildHerkSERow(firstId);}
  if(id==='plan'){buildActiePlan();}
}
function buildActiePlan(){
  const el=document.getElementById('actieplan-content');
  if(!el)return;
  const cijfers=getSavedCijfers();
  const vakken=getVK();
  const metCijfer=vakken.filter(v=>cijfers[v.id]!=null);
  const hasQuizData=vakken.some(v=>getVakBestPct(v.id).hasData);
  if(metCijfer.length===0&&!hasQuizData){
    el.innerHTML=`<p class="ap-empty">Voer je SE-cijfers in en maak een paar quizzen om je actieplan te zien.</p>`;
    return;
  }
  const mustBetter=[],canBetter=[],onTrack=[];
  vakken.forEach(v=>{
    const c=cijfers[v.id];
    const quiz=getVakBestPct(v.id);
    const seScore=c!=null?c:null;
    const quizPct=quiz.hasData?quiz.pct:null;
    if(seScore!=null||quizPct!=null){
      const isMust=(seScore!=null&&seScore<6)||(quizPct!=null&&quizPct<0.5);
      const isCan=!isMust&&((seScore!=null&&seScore<7)||(quizPct!=null&&quizPct<0.65));
      if(isMust)mustBetter.push({v,seScore,quizPct,quiz});
      else if(isCan)canBetter.push({v,seScore,quizPct,quiz});
      else onTrack.push({v,seScore,quizPct,quiz});
    }
  });
  function renderItem({v,seScore,quizPct,quiz}){
    // Find weakest domain
    let weakestDomein=null;let weakestPct=2;
    v.domeinen.forEach(d=>{
      const dr=getDomeinBestPct(v.id,d.id);
      if(dr.hasData&&dr.pct<weakestPct){weakestPct=dr.pct;weakestDomein=d;}
    });
    const detailParts=[];
    if(seScore!=null)detailParts.push(`SE: ${seScore.toFixed(1).replace('.',',')}`);
    if(quizPct!=null)detailParts.push(`Quiz: ${Math.round(quizPct*100)}%`);
    if(weakestDomein)detailParts.push(`Zwakste domein: ${weakestDomein.naam}`);
    return `<div class="ap-item">
      <div class="ap-dot" style="background:${v.kleur}"></div>
      <div class="ap-info"><div class="ap-naam">${v.naam}</div><div class="ap-detail">${detailParts.join(' · ')}</div></div>
      <button class="ap-btn" onclick="openVak('${v.id}')">Oefen →</button>
    </div>`;
  }
  function renderSection(emoji,title,items,showItems){
    if(items.length===0)return'';
    const itemsHtml=showItems?items.map(renderItem).join(''):'';
    return `<div class="ap-section">
      <div class="ap-section-head">${emoji} ${title}</div>
      ${itemsHtml}
    </div>`;
  }
  const slaagLink=`<div class="ap-slaag-link" onclick="document.querySelectorAll('.calc-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.calc-panel').forEach(p=>p.classList.remove('active'));document.getElementById('calc-slaag').classList.add('active');document.querySelectorAll('.calc-tab')[0].classList.add('active');buildSlaagInputs()">📊 Bereken slagingskans →</div>`;
  el.innerHTML=`<h3 style="font-size:16px;font-weight:800;margin-bottom:16px">Jouw persoonlijke studieplan</h3>
    ${renderSection('🔴','Moet beter',mustBetter,true)}
    ${renderSection('🟠','Kan beter',canBetter,true)}
    ${renderSection('🟢','Goed op koers',onTrack,false)}
    ${mustBetter.length===0&&canBetter.length===0&&onTrack.length===0?'<p class="ap-empty">Voer je SE-cijfers in en maak een paar quizzen om je actieplan te zien.</p>':''}
    ${slaagLink}`;
}
function buildSlaagInputs(){
  const box=document.getElementById('slaag-inputs');
  const saved=getSavedCijfers();
  const hasSaved=Object.keys(saved).length>0;
  box.innerHTML=hasSaved?'<div class="calc-prefill-note">✓ SE-cijfers automatisch ingevuld vanuit je opgeslagen cijfers</div>':'';
  box.innerHTML+=`<div style="font-size:11px;color:var(--mu);margin-bottom:8px;display:flex;gap:10px"><span style="flex:1">Vak</span><span style="width:70px;text-align:center">SE</span><span style="width:70px;text-align:center">CE</span></div>`;
  getVK().forEach(v=>{
    const seVal=saved[v.id]!=null?saved[v.id]:'';
    box.innerHTML+=`<div class="calc-row"><span class="calc-label">${v.naam} <span style="color:var(--mu);font-size:10px">(${v.code})</span></span><input type="number" class="calc-input slaag-se" data-vak="${v.code}" min="1" max="10" step="0.1" placeholder="—" value="${seVal}"><input type="number" class="calc-input slaag-ce" data-vak="${v.code}" min="1" max="10" step="0.1" placeholder="—"></div>`;
  });
}
function buildEindVakSelect(){
  const sel=document.getElementById('eind-vak');
  if(!sel||sel.options.length>1)return;
  getVK().forEach(v=>{sel.innerHTML+=`<option value="${v.id}">${v.naam}</option>`;});
}
function buildNtermVakSelect(){
  const sel=document.getElementById('nt-vak');
  if(!sel||sel.options.length>1)return;
  getVK().forEach(v=>{sel.innerHTML+=`<option value="${v.id}">${v.naam}</option>`;});
}
function prefillEindFromSaved(vakId){
  if(!vakId)return;
  const saved=getSavedCijfers();
  const inp=document.getElementById('eind-se');
  if(inp&&saved[vakId]!=null){inp.value=saved[vakId];}
}
function prefillNtermSE(vakId){
  if(!vakId)return;
  const saved=getSavedCijfers();
  const inp=document.getElementById('nt-se');
  if(inp&&saved[vakId]!=null){inp.value=saved[vakId];}
}
function buildHerkSERow(vakId){
  const row=document.getElementById('herk-se-row');
  if(!row)return;
  const saved=getSavedCijfers();
  const cij=vakId&&saved[vakId]!=null?saved[vakId]:null;
  row.innerHTML=`<div class="calc-row"><span class="calc-label">SE-cijfer</span><input type="number" id="herk-se" class="calc-input" min="1" max="10" step="0.1" placeholder="—" value="${cij!=null?cij:''}">${cij!=null?`<span style="font-size:11px;color:#22C55E;font-weight:600;white-space:nowrap">✓ opgeslagen</span>`:''}</div>`;
}
function berekenSlaag(){
  const seInputs=document.querySelectorAll('.slaag-se');
  const ceInputs=document.querySelectorAll('.slaag-ce');
  const profiel=document.getElementById('calc-profiel').value;
  let vakken=[];let ceTotal=0;let ceCount=0;
  seInputs.forEach((inp,i)=>{
    const se=parseFloat(inp.value);
    const ce=parseFloat(ceInputs[i].value);
    const code=inp.dataset.vak;
    if(!isNaN(se)&&!isNaN(ce)){
      const eind=Math.round((se+ce)/2);
      const ceRound=Math.round(ce*10)/10;
      vakken.push({code,se,ce:ceRound,eind});
      ceTotal+=ceRound;ceCount++;
    }
  });
  if(vakken.length<3){document.getElementById('slaag-result').innerHTML='<div class="calc-result"><p>Vul minimaal 3 vakken in.</p></div>';return;}
  const ceGem=ceTotal/ceCount;
  const kernvakken=profiel==='cm'?['NE','EN']:['NE','EN','WA','WB'];
  const kernGrades=vakken.filter(v=>kernvakken.includes(v.code));
  const kernOnder6=kernGrades.filter(v=>v.eind<6);
  let r1=ceGem>=5.5;
  let r2=kernOnder6.length<=1&&kernOnder6.every(v=>v.eind>=5);
  let allEind=vakken.map(v=>v.eind);
  let onder4=allEind.filter(e=>e<4).length;
  let vijven=allEind.filter(e=>e===5).length;
  let vieren=allEind.filter(e=>e===4).length;
  let eindGem=allEind.reduce((a,b)=>a+b,0)/allEind.length;
  let r3=true;
  if(onder4>0)r3=false;
  else if(vieren>=1&&vijven>=1)r3=eindGem>=6.0;
  else if(vijven>=3)r3=false;
  else if(vijven===2||vieren===1)r3=eindGem>=6.0;
  let geslaagd=r1&&r2&&r3;
  let cumLaude=false;
  if(geslaagd){
    const noBelow6=allEind.every(e=>e>=6);
    cumLaude=noBelow6&&eindGem>=8.0;
  }
  let icon=geslaagd?(cumLaude?'🎓':'🎉'):'😔';
  let title=geslaagd?(cumLaude?'Cum laude geslaagd!':'Geslaagd!'):'Gezakt';
  let color=geslaagd?'calc-pass':'calc-fail';
  let detail=`<div class="calc-detail">
    <div><span class="${r1?'ck':'cx'}">${r1?'✓':'✗'}</span> CE-gemiddelde: ${ceGem.toFixed(2)} ${r1?'≥':'<'} 5,50</div>
    <div><span class="${r2?'ck':'cx'}">${r2?'✓':'✗'}</span> Kernvakkenregel: ${kernOnder6.length} kernvak(ken) onder 6 ${profiel==='cm'?'(C&M: NE+EN)':'(NE+EN+WI)'}</div>
    <div><span class="${r3?'ck':'cx'}">${r3?'✓':'✗'}</span> Compensatie: ${onder4>0?'cijfer <4 gevonden':vijven+' vijf(ven), '+vieren+' vier(en)'}, gem ${eindGem.toFixed(1)}</div>
  </div>`;
  let tableHtml='<div style="margin-top:14px;font-size:12px"><table style="width:100%;border-collapse:collapse">';
  vakken.forEach(v=>{
    const col=v.eind<6?'color:#EF4444':'';
    tableHtml+=`<tr style="border-bottom:1px solid var(--bo)"><td style="padding:4px 0">${v.code}</td><td style="text-align:center">${v.se}</td><td style="text-align:center">${v.ce}</td><td style="text-align:center;font-weight:700;${col}">${v.eind}</td></tr>`;
  });
  tableHtml+='</table></div>';
  // Coaching: where is the most improvement possible?
  const allVakken=getVK();
  const coachVakken=vakken.filter(v=>v.eind<6||(v.ce<(Math.max(1,Math.min(10,11-v.se))))).sort((a,b)=>a.eind-b.eind).slice(0,3);
  let coachHtml='';
  if(coachVakken.length>0){
    const coachItems=coachVakken.map(cv=>{
      const vakObj=allVakken.find(v=>v.code===cv.code);
      const ceNodigVoor6=Math.max(1,Math.min(10,11-cv.se));
      const ceGap=Math.round((ceNodigVoor6-cv.ce)*10)/10;
      const gapTxt=ceGap>0?`CE ${ceGap.toFixed(1).replace('.',',')} punt omhoog → al voldoende`:`eindcijfer ${cv.eind}`;
      const oefenBtn=vakObj?`<button class="ap-btn" onclick="openVak('${vakObj.id}')">Oefen →</button>`:'';
      return `<div class="ap-item">
        <div class="ap-dot" style="background:${vakObj?vakObj.kleur:'#999'}"></div>
        <div class="ap-info"><div class="ap-naam">${cv.code}</div><div class="ap-detail">eindcijfer ${cv.eind} — ${gapTxt}</div></div>
        ${oefenBtn}
      </div>`;
    }).join('');
    coachHtml=`<div class="ap-section" style="margin-top:14px;border-top:1px solid var(--bo);padding-top:12px">
      <div class="ap-section-head">💡 Waar valt de meeste winst te halen?</div>
      ${coachItems}
    </div>`;
  }
  document.getElementById('slaag-result').innerHTML=`<div class="calc-result">
    <div class="calc-result-icon">${icon}</div>
    <h3 class="${color}">${title}</h3>
    <p>CE-gemiddelde: ${ceGem.toFixed(2)} · Eindcijfergemiddelde: ${eindGem.toFixed(1)}</p>
    ${detail}${tableHtml}${coachHtml}
  </div>`;
}
function berekenEind(){
  const se=parseFloat(document.getElementById('eind-se').value);
  const ce=parseFloat(document.getElementById('eind-ce').value);
  if(isNaN(se)||isNaN(ce)){document.getElementById('eind-result').innerHTML='<div class="calc-result"><p>Vul beide cijfers in.</p></div>';return;}
  const gem=(se+ce)/2;
  const eind=Math.round(gem);
  document.getElementById('eind-result').innerHTML=`<div class="calc-result">
    <div class="calc-result-icon">📊</div>
    <h3>${eind}</h3>
    <p>SE (${se}) + CE (${ce}) = ${gem.toFixed(2)} → afgerond: <strong>${eind}</strong></p>
  </div>`;
}
function berekenNterm(){
  const s=parseFloat(document.getElementById('nt-score').value);
  const l=parseFloat(document.getElementById('nt-max').value);
  const n=parseFloat(document.getElementById('nt-n').value);
  if(isNaN(s)||isNaN(l)||isNaN(n)){document.getElementById('nterm-result').innerHTML='<div class="calc-result"><p>Vul alle velden in.</p></div>';return;}
  const c=9*(s/l)+n;
  const cRound=Math.round(c*10)/10;
  const cFinal=Math.min(10,Math.max(1,cRound));
  document.getElementById('nterm-result').innerHTML=`<div class="calc-result">
    <div class="calc-result-icon">🧮</div>
    <h3>${cFinal}</h3>
    <p>C = 9 × (${s}/${l}) + ${n} = ${c.toFixed(2)} → afgerond: <strong>${cFinal}</strong></p>
    <p style="margin-top:8px;font-size:11px">Formule: C = 9 × (S/L) + N</p>
  </div>`;
}
function berekenBenodigdScore(){
  const se=parseFloat(document.getElementById('nt-se').value);
  const doel=parseFloat(document.getElementById('nt-doel').value||'6');
  const maxScore=parseFloat(document.getElementById('nt-max').value);
  const nterm=parseFloat(document.getElementById('nt-n').value);
  const res=document.getElementById('nterm-benodig-result');
  if(isNaN(se)){res.innerHTML='<div class="calc-result"><p>Vul je SE-cijfer in (of kies een vak).</p></div>';return;}
  if(isNaN(doel)||isNaN(maxScore)||isNaN(nterm)){res.innerHTML='<div class="calc-result"><p>Vul ook maximale score en N-term in (boven).</p></div>';return;}
  // CE nodig = 2*doel - se (voor eindcijfer = round((se+ce)/2) >= doel)
  const ceNodig=2*doel-se;
  if(ceNodig<=1){
    res.innerHTML=`<div class="calc-result"><div class="calc-result-icon">🎯</div><h3 class="calc-pass">Al op koers!</h3><p>Met SE ${se} heb je CE ≥ 1 nodig voor een ${doel}. Je bent al goed op koers!</p></div>`;
    return;
  }
  if(ceNodig>10){
    res.innerHTML=`<div class="calc-result"><div class="calc-result-icon">😔</div><h3 class="calc-fail">Helaas niet haalbaar</h3><p>Met SE ${se} is een eindcijfer van ${doel} wiskundig niet meer haalbaar (vereiste CE = ${ceNodig.toFixed(1)} > 10).</p></div>`;
    return;
  }
  // score nodig = (ceNodig - nterm) * max / 9
  const scoreNodig=Math.ceil(((ceNodig-nterm)*maxScore)/9);
  const scoreNodigClamp=Math.max(0,Math.min(maxScore,scoreNodig));
  const pct=Math.round((scoreNodigClamp/maxScore)*100);
  const barClr=pct<=60?'#22C55E':pct<=80?'#F59E0B':'#EF4444';
  res.innerHTML=`<div class="calc-result">
    <div class="calc-result-icon">🎯</div>
    <h3>${scoreNodigClamp} / ${maxScore} punten</h3>
    <p>Voor eindcijfer <strong>${doel}</strong> met SE <strong>${se}</strong> heb je CE ≥ <strong>${ceNodig.toFixed(1).replace('.',',')}</strong> nodig.</p>
    <p style="margin-top:6px">Op het examen: minimaal <strong>${scoreNodigClamp} van de ${maxScore} punten</strong> (${pct}%).</p>
    <div class="calc-result-bar" style="margin-top:10px"><span style="font-size:11px;color:var(--mu);min-width:16px">0</span><div class="calc-result-bar-track"><div class="calc-result-bar-fill" style="width:${pct}%;background:${barClr}"></div></div><span style="font-size:11px;color:var(--mu)">${maxScore}</span></div>
  </div>`;
}
function buildHerkSelect(){
  const sel=document.getElementById('herk-vak');
  if(sel.options.length>1)return;
  sel.innerHTML='';
  getVK().forEach(v=>{sel.innerHTML+=`<option value="${v.id}">${v.naam} (${v.code})</option>`;});
}
function berekenHerk(){
  const vakId=document.getElementById('herk-vak').value;
  const nieuwCe=parseFloat(document.getElementById('herk-ce').value);
  const seInp=document.getElementById('herk-se');
  const se=seInp?parseFloat(seInp.value):NaN;
  const res=document.getElementById('herk-result');
  if(isNaN(nieuwCe)){res.innerHTML='<div class="calc-result"><p>Vul een nieuw CE-cijfer in.</p></div>';return;}
  if(isNaN(se)){res.innerHTML='<div class="calc-result"><p>Vul je SE-cijfer in.</p></div>';return;}
  const vak=getVK().find(v=>v.id===vakId);
  const gem=(se+nieuwCe)/2;
  const eind=Math.round(gem);
  const kleur=eind>=6?'calc-pass':'calc-fail';
  const icon=eind>=6?'🎉':'😔';
  const ceVoldoende=Math.round(Math.max(1,Math.min(10,11-se))*10)/10;
  const barPct=Math.min(100,Math.round((eind/10)*100));
  const barClr=eind>=6?'#22C55E':eind>=5?'#F59E0B':'#EF4444';
  res.innerHTML=`<div class="calc-result">
    <div class="calc-result-icon">${icon}</div>
    <h3 class="${kleur}">${eind} — ${eind>=6?'voldoende ✓':'onvoldoende ✗'}</h3>
    <p>SE: <strong>${se}</strong> + nieuw CE: <strong>${nieuwCe}</strong> = gem ${gem.toFixed(2)} → afgerond <strong>${eind}</strong></p>
    <div class="calc-result-bar"><span style="font-size:11px;color:var(--mu);min-width:16px">1</span><div class="calc-result-bar-track"><div class="calc-result-bar-fill" style="width:${barPct}%;background:${barClr}"></div></div><span style="font-size:11px;color:var(--mu)">10</span></div>
    <p style="margin-top:10px;font-size:12px;color:var(--mu)">Voor een 6 als eindcijfer heb je CE ≥ <strong>${ceVoldoende.toFixed(1).replace('.',',')}</strong> nodig bij SE ${se}.</p>
  </div>`;
}

// ═══════ FLASHCARDS ═══════
// ═══════ SPACED REPETITION (SM-2) ═══════
const SR_KEY='slagio_sr_v1';
function getSR(){try{return JSON.parse(localStorage.getItem(SR_KEY)||'{}');}catch(e){return{};}}
function saveSR(d){localStorage.setItem(SR_KEY,JSON.stringify(d));}
function srKey(vakId,domId,term){return vakId+'__'+domId+'__'+term.slice(0,35).replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_]/g,'');}

// SM-2: quality 0=again 2=hard 3=good 5=easy
// Max interval: 365 dagen zodat kaarten niet te lang weggaan
const SR_MAX_INTERVAL=365;
function sm2(sr={},q){
  let{interval=0,ease=2.5,reps=0,lapses=0}=sr;
  if(q===0){lapses++;reps=0;interval=1;}
  else if(q===2){interval=Math.max(1,Math.ceil((interval||1)*1.2));reps=Math.max(0,reps-1);}
  else{
    if(reps===0)interval=1;
    else if(reps===1)interval=3;
    else interval=Math.round((interval||3)*ease);
    if(q===5)interval=Math.round(interval*1.3);
    reps++;
  }
  ease=Math.max(1.3,ease+0.1-(5-q)*(0.08+(5-q)*0.02));
  interval=Math.min(interval,SR_MAX_INTERVAL);
  const due=new Date();due.setDate(due.getDate()+Math.max(1,interval));
  return{interval,ease:Math.round(ease*1000)/1000,reps,lapses,due:due.toISOString().slice(0,10)};
}
function _fmtDays(d){
  if(d>=365)return Math.round(d/365)+'jr';
  if(d>=30)return Math.round(d/30)+'mo';
  return d+'d';
}
// Gebruik sm2 preview zodat label altijd consistent is met het echte algoritme
function srIntLabel(q,sr={}){
  if(q===0)return'<1m';
  return _fmtDays(sm2(sr,q).interval);
}

let FC={cards:[],queue:[],again:[],stats:{again:0,hard:0,good:0,easy:0},vakId:'',domId:'',flipped:false,sessionTotal:0};

// Haalt term→definitie paren uit <strong>term</strong>: def patroon in sam HTML
function _parseSamCards(html){
  const tmp=document.createElement('div');
  tmp.innerHTML=html;
  const cards=[];
  const seen=new Set();
  tmp.querySelectorAll('li').forEach(li=>{
    const first=li.querySelector('strong');
    if(!first)return;
    const term=first.textContent.trim();
    if(!term||term.length<2||term.length>72||seen.has(term))return;
    seen.add(term);
    const full=li.textContent;
    const tidx=full.indexOf(term);
    let def=tidx>=0?full.slice(tidx+term.length).replace(/^[\s:,\-–]+/,'').trim():full.trim();
    if(def.length<5)return;
    if(def.length>220)def=def.slice(0,220).replace(/\s\S+$/,'')+'…';
    cards.push({term,def});
  });
  // Formuleboxen → kaarten (voorkant = naam, achterkant = formule + uitleg)
  tmp.querySelectorAll('.sam-formula-box').forEach(fb=>{
    const lab=fb.querySelector('.sam-formula-label');if(!lab)return;
    const term=lab.textContent.trim();
    if(!term||term.length<2||term.length>72||seen.has(term))return;
    const eq=fb.querySelector('.sam-formula-eq'),note=fb.querySelector('.sam-formula-note');
    let def=eq?eq.innerHTML.trim():'';
    if(note){let n=note.textContent.trim();if(n.length>180)n=n.slice(0,180).replace(/\s\S+$/,'')+'…';def+=(def?' — ':'')+n;}
    if(def.replace(/<[^>]+>/g,'').length<3)return;
    seen.add(term);cards.push({term,def});
  });
  // Tabelrijen → kaarten (voorkant = eerste cel, achterkant = overige cellen)
  tmp.querySelectorAll('.sam-table tbody tr').forEach(tr=>{
    const tds=[...tr.children];if(tds.length<2)return;
    const term=tds[0].textContent.trim();
    if(!term||term.length<2||term.length>72||seen.has(term))return;
    let def=tds.slice(1).map(td=>td.textContent.trim()).filter(Boolean).join(' — ');
    if(def.length<2)return;
    if(def.length>220)def=def.slice(0,220).replace(/\s\S+$/,'')+'…';
    seen.add(term);cards.push({term,def});
  });
  return cards;
}

function startFlash(){
  trackEvent('flashcard',{domein:ST.domein?.naam||null});
  const d=ST.domein,v=ST.vak;
  if(!d||!v)return;
  // Stap 1: haal term→def paren uit de (rijke) samenvatting: <strong>, formuleboxen en tabellen
  const samSrc=(typeof SAM_RICH!=='undefined'&&SAM_RICH[v.id+'_'+d.id])||d.sam;
  let cards=samSrc?_parseSamCards(samSrc):[];
  // Stap 2: fallback — koppel elke onderwerp aan de meest relevante zin (keyword-matching)
  if(cards.length<3){
    const terms=(d.onderwerpen||[]).filter(t=>t&&t.trim().length>1);
    const samText=(d.sam||'').replace(/<[^>]+>/g,'');
    const sents=samText.split(/(?<=[.!?])\s+/).filter(s=>s.length>15&&s.length<300);
    cards=terms.map(term=>{
      const kw=term.toLowerCase().replace(/[^a-zéèëïöüàâ ]/gi,'').split(/\s+/).filter(w=>w.length>3);
      const scored=sents.map(s=>{const sl=s.toLowerCase();return{s,n:kw.filter(w=>sl.includes(w)).length};}).sort((a,b)=>b.n-a.n);
      const best=scored[0];
      let def=(best&&best.n>0)?best.s:sents[0]||'Bestudeer dit begrip in de samenvatting.';
      if(def.length>220)def=def.slice(0,220).replace(/\s\S+$/,'')+'…';
      return{term,def};
    });
  }
  if(!cards.length){showToast('Geen flashcards voor dit domein','#ef4444');return;}

  const today=new Date().toISOString().slice(0,10);
  const srData=getSR();
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const newCards=[],dueCards=[];
  cards.forEach(c=>{
    const k=srKey(v.id,d.id,c.term);
    const sr=srData[k];
    if(!sr)newCards.push({...c,k,sr:{}});
    else if(sr.due<=today)dueCards.push({...c,k,sr});
  });

  let queue=[...shuffle(dueCards),...shuffle(newCards).slice(0,20)];
  let isPractice=false;

  // No due/new cards → fallback: practice all cards (ignores due dates)
  if(!queue.length){
    isPractice=true;
    queue=shuffle(cards.map(c=>{
      const k=srKey(v.id,d.id,c.term);
      return{...c,k,sr:srData[k]||{}};
    }));
    showToast('Klaar voor vandaag! Extra oefensessie gestart 🔥','var(--or)',2500);
  }

  FC={
    cards,
    queue,
    again:[],
    stats:{again:0,hard:0,good:0,easy:0},
    vakId:v.id,domId:d.id,flipped:false,
    sessionTotal:queue.length,
    newCount:isPractice?0:Math.min(newCards.length,20),
    dueCount:isPractice?queue.length:dueCards.length,
    isPractice
  };

  // Always reset card visibility before starting
  const cardEl=document.getElementById('fc-card');
  if(cardEl){cardEl.style.display='';cardEl.classList.remove('flipped');}
  document.getElementById('fc-score').innerHTML='';
  document.getElementById('fc-btns').style.display='none';

  const metaEl=document.getElementById('fc-meta');
  if(metaEl)metaEl.textContent=v.naam+' · D'+d.id+': '+d.naam+(isPractice?' · Oefensessie':'');
  _fcUpdateChips();
  show('sc-flash');
  showFlashcard();
}

function _fcUpdateChips(){
  const el=document.getElementById('fc-counts');
  if(!el)return;
  if(FC.isPractice){el.innerHTML=`<span class="fc-count-chip fc-chip-due">${FC.dueCount} oefening</span>`;return;}
  el.innerHTML=
    (FC.newCount>0?`<span class="fc-count-chip fc-chip-new">${FC.newCount} nieuw</span>`:'')+
    (FC.dueCount>0?`<span class="fc-count-chip fc-chip-due">${FC.dueCount} herhaling</span>`:'');
}

function showFlashcard(){
  // Progress bar
  const done=FC.sessionTotal-FC.queue.length;
  const bar=document.getElementById('fc-prog-bar');
  if(bar)bar.style.width=(FC.sessionTotal>0?Math.round(done/FC.sessionTotal*100):0)+'%';

  // Session complete
  if(!FC.queue.length&&!FC.again.length){_fcSummary();return;}

  // Flush "again" cards back into queue when main queue empties
  if(!FC.queue.length&&FC.again.length){
    FC.queue=[...FC.again];FC.again=[];
    FC.sessionTotal+=FC.queue.length;
    showToast('🔄 Herhaling van '+FC.queue.length+' moeilijke kaart'+(FC.queue.length!==1?'en':''),'var(--or)',2200);
  }

  const c=FC.queue[0];
  FC.flipped=false;
  const cardEl=document.getElementById('fc-card');
  cardEl.style.display='';
  cardEl.classList.remove('flipped');
  document.getElementById('fc-front').innerHTML=`<span>${c.term}</span><span class="fc-front-hint">Tik om te draaien</span>`;
  document.getElementById('fc-back').innerHTML=`<div class="fc-back-term">${c.term}</div><div>${c.def}</div>`;
  document.getElementById('fc-btns').style.display='none';
  document.getElementById('fc-score').innerHTML='';

  const doneTotal=FC.sessionTotal-FC.queue.length-(FC.again.length>0?0:0);
  const progEl=document.getElementById('fc-progress');
  if(progEl)progEl.textContent=(done+1)+' van '+FC.sessionTotal+(FC.again.length?' · +'+FC.again.length+' herhaling':'');
}

function flipCard(){
  if(FC.flipped)return;
  FC.flipped=true;
  document.getElementById('fc-card').classList.add('flipped');
  const btnsEl=document.getElementById('fc-btns');
  btnsEl.style.display='grid';
  const c=FC.queue[0]||{};
  [0,2,3,5].forEach(q=>{
    const el=document.getElementById('fc-int-'+q);
    if(el)el.textContent=srIntLabel(q,c.sr||{});
  });
}

function fcRate(q){
  if(!FC.queue.length)return;
  const c=FC.queue.shift();
  const srData=getSR();
  srData[c.k]=sm2(c.sr||{},q);
  saveSR(srData);
  if(q===0){FC.stats.again++;FC.again.push({...c,sr:srData[c.k]});}
  else if(q===2)FC.stats.hard++;
  else if(q===3)FC.stats.good++;
  else FC.stats.easy++;
  showFlashcard();
}

function _fcSummary(){
  const s=FC.stats;
  const total=s.again+s.hard+s.good+s.easy;
  const goodCount=s.good+s.easy;
  const pct=total>0?Math.round(goodCount/total*100):0;
  const col=pct>=80?'#22c55e':pct>=50?'var(--or)':'#ef4444';
  const title=pct>=80?'Uitstekend! 🎉':pct>=50?'Goed bezig! 💪':'Blijf oefenen! 📚';

  // Count mastered (reps >= 2) across full deck
  const srData=getSR();
  const mastered=FC.cards.filter(c=>(srData[srKey(FC.vakId,FC.domId,c.term)]?.reps||0)>=2).length;

  // Next due card date
  const today=new Date();
  const dueDates=FC.cards.map(c=>srData[srKey(FC.vakId,FC.domId,c.term)]?.due).filter(Boolean).sort();
  const nextDue=dueDates[0];
  let nextLabel='—';
  if(nextDue){
    const diff=Math.round((new Date(nextDue)-today)/(1000*60*60*24));
    nextLabel=diff<=0?'Vandaag':diff===1?'Morgen':'Over '+diff+' dagen';
  }

  checkFcAch();
  document.getElementById('fc-card').style.display='none';
  document.getElementById('fc-btns').style.display='none';
  document.getElementById('fc-progress').textContent='';
  const bar=document.getElementById('fc-prog-bar');
  if(bar)bar.style.width='100%';

  document.getElementById('fc-score').innerHTML=`
    <div class="fc-summary">
      <div class="fc-sum-title">${title}</div>
      <div class="fc-sum-sub">${total} kaarten beoordeeld deze sessie</div>
      <div class="fc-sum-stats">
        <div class="fc-sum-stat">
          <div class="fc-sum-stat-n" style="color:#22c55e">${goodCount}</div>
          <div class="fc-sum-stat-l">Goed</div>
        </div>
        <div class="fc-sum-stat">
          <div class="fc-sum-stat-n" style="color:var(--or)">${s.hard}</div>
          <div class="fc-sum-stat-l">Moeilijk</div>
        </div>
        <div class="fc-sum-stat">
          <div class="fc-sum-stat-n" style="color:#ef4444">${s.again}</div>
          <div class="fc-sum-stat-l">Opnieuw</div>
        </div>
      </div>
      <div class="fc-mastery-wrap"><div class="fc-mastery-bar" style="width:${Math.round(mastered/Math.max(1,FC.cards.length)*100)}%;background:${col}"></div></div>
      <div class="fc-mastery-lbl">${mastered}/${FC.cards.length} kaarten beheerst · ${pct}% goed deze sessie</div>
      <div style="font-size:11px;color:var(--mu);margin:10px 0 2px">⏰ Volgende herhaling: <strong>${nextLabel}</strong></div>
      <button class="fc-sum-btn fc-sum-btn-primary" onclick="startFlash()">🔄 Nieuwe sessie</button>
      <button class="fc-sum-btn fc-sum-btn-sec" onclick="show('sc-detail')">← Terug</button>
    </div>`;
  setTimeout(()=>showFeedbackPopup('flashcard'),2000);
}

// ═══════ POMODORO ═══════
let POMO={timer:null,seconds:25*60,total:25*60,running:false,mode:'study',breakTimer:null,breakSeconds:0,sessions:0};

function renderPomo(){
  const box=document.getElementById('pomo-home');
  if(!box)return;
  const mins=Math.floor(POMO.seconds/60);
  const secs=POMO.seconds%60;
  const isBreak=POMO.mode==='break';
  const modeClass=isBreak?' pomo-break':'';
  const modeBadge=isBreak?'☕ Pauze':'🎯 Studie';
  const modeLabel=isBreak?'Rust even uit':'Blijf gefocust';
  const infoOpen=box._infoOpen||false;
  // Circular ring
  const R=80,C=2*Math.PI*R;
  const progress=POMO.total>0?POMO.seconds/POMO.total:1;
  const offset=C*(1-progress);
  // Session dots (max 4)
  const dots=Array.from({length:4},(_,i)=>`<div class="pomo-session-dot${i<POMO.sessions?' done':''}"></div>`).join('');
  box.innerHTML=`<div class="pomo${modeClass}">
    <div class="pomo-header">
      <div class="pomo-title">Pomodoro Timer</div>
      <div class="pomo-mode-badge">${modeBadge}</div>
    </div>
    <div class="pomo-ring-wrap">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle class="pomo-ring-bg" cx="90" cy="90" r="${R}"/>
        <circle class="pomo-ring-fg" cx="90" cy="90" r="${R}"
          stroke-dasharray="${C.toFixed(2)}"
          stroke-dashoffset="${offset.toFixed(2)}"/>
      </svg>
      <div class="pomo-ring-center">
        <div class="pomo-time">${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}</div>
        <div class="pomo-label">${modeLabel}</div>
      </div>
    </div>
    <div class="pomo-sessions">${dots}</div>
    <div class="pomo-btns">
      <button class="pomo-btn${POMO.running?' pomo-active':''}" onclick="togglePomo()">
        ${POMO.running?'<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pauze':'<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Start'}
      </button>
      <button class="pomo-btn" onclick="resetPomo()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg> Reset
      </button>
    </div>
    <div class="pomo-info">
      <button class="pomo-info-toggle${infoOpen?' open':''}" onclick="const b=this.nextElementSibling;b.classList.toggle('open');this.classList.toggle('open');document.getElementById('pomo-home')._infoOpen=b.classList.contains('open')">
        Wat is de Pomodoro-techniek? <span class="pomo-info-arrow">▾</span>
      </button>
      <div class="pomo-info-body${infoOpen?' open':''}">
        <p>De <strong>Pomodoro-techniek</strong> is een bewezen methode om gefocust te studeren en mentale vermoeidheid te voorkomen.</p>
        <ol>
          <li>⏱ Werk <strong>25 minuten</strong> volledig gefocust (één pomodoro)</li>
          <li>☕ Neem <strong>5 minuten</strong> korte pauze — sta op, rek je uit</li>
          <li>🔁 Herhaal dit <strong>4 keer</strong> na elkaar</li>
          <li>🧘 Na 4 pomodoro's: neem een <strong>lange pauze</strong> van 15–30 minuten</li>
        </ol>
        <div class="pomo-info-tip">💡 <strong>Tip:</strong> leg je telefoon weg tijdens de 25 minuten. Elke afleiding verlengt de herstarttijd van je concentratie met gemiddeld 23 minuten.</div>
      </div>
    </div>
  </div>`;
}

function pomoAlert(){
  // Play sound using Web Audio API
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    function beep(freq,start,dur){
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.type='sine';o.frequency.value=freq;
      g.gain.setValueAtTime(0.3,ctx.currentTime+start);
      g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+start+dur);
      o.start(ctx.currentTime+start);o.stop(ctx.currentTime+start+dur);
    }
    beep(880,0,.15);beep(880,.2,.15);beep(1100,.45,.3);
  }catch(e){}
  // Vibrate on mobile
  if(navigator.vibrate)navigator.vibrate([200,100,200,100,300]);
}

function showPomoOverlay(type){
  const ov=document.getElementById('pomo-overlay');
  const icon=document.getElementById('pomo-ov-icon');
  const title=document.getElementById('pomo-ov-title');
  const sub=document.getElementById('pomo-ov-sub');
  const timer=document.getElementById('pomo-ov-timer');
  const bar=document.getElementById('pomo-ov-bar');
  const btn=document.getElementById('pomo-ov-action');

  const mgBtn=document.getElementById('pomo-ov-mg-btn');
  if(type==='break'){
    ov.classList.add('break-mode');
    icon.textContent='☕';
    title.textContent='Pauze tijd!';
    sub.textContent='Goed bezig! Neem even 5 minuten rust.';
    timer.textContent='05:00';
    bar.style.width='100%';
    btn.textContent='▶ Start pauze';
    btn.onclick=startBreakFromOverlay;
    btn.style.display='';
    if(mgBtn)mgBtn.style.display='';
  }else{
    ov.classList.remove('break-mode');
    icon.textContent='🔥';
    title.textContent='Pauze voorbij!';
    sub.textContent='Tijd om weer aan de slag te gaan!';
    timer.textContent='00:00';
    bar.style.width='0%';
    btn.textContent='▶ Nieuwe sessie';
    btn.onclick=function(){dismissPomoOverlay();POMO.mode='study';POMO.seconds=25*60;POMO.total=25*60;renderPomo();togglePomo();};
    btn.style.display='';
    if(mgBtn)mgBtn.style.display='none';
  }
  ov.classList.add('show');
  pomoAlert();
}

function startBreakFromOverlay(){
  const btn=document.getElementById('pomo-ov-action');
  btn.style.display='none';
  POMO.mode='break';POMO.seconds=5*60;POMO.total=5*60;POMO.running=true;
  renderPomo();

  clearInterval(POMO.breakTimer);
  const totalBreak=5*60;
  POMO.breakTimer=setInterval(()=>{
    POMO.seconds--;
    const m=Math.floor(POMO.seconds/60);
    const s=POMO.seconds%60;
    const ovTimer=document.getElementById('pomo-ov-timer');
    const ovBar=document.getElementById('pomo-ov-bar');
    if(ovTimer)ovTimer.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
    if(ovBar)ovBar.style.width=((POMO.seconds/totalBreak)*100)+'%';
    renderPomo();
    if(POMO.seconds<=0){
      clearInterval(POMO.breakTimer);POMO.running=false;
      dismissPomoOverlay();
      POMO.mode='study';POMO.seconds=25*60;
      renderPomo();
      setTimeout(()=>showPomoOverlay('study'),400);
    }
  },1000);
}

function dismissPomoOverlay(){
  clearInterval(window._mgTimer);
  window._mgState=null;
  document.getElementById('pomo-overlay').classList.remove('show','break-mode');
  clearInterval(POMO.breakTimer);
}

function startPomoMinigame(){
  clearInterval(window._mgTimer);
  const card=document.querySelector('.pomo-overlay-card');
  const emojis=['🌟','⚡','🎯','🚀','🦊','🎨','🎵','🌈'];
  const deck=[...emojis,...emojis].sort(()=>Math.random()-.5);
  window._mgState={flipped:[],matched:0,moves:0,locked:false,startTime:Date.now()};
  card.innerHTML=`
    <div class="mg-wrap">
      <div class="mg-header">🎮 Geheugenspel — vind alle paren!</div>
      <div class="mg-stats">
        <div class="mg-stat"><span class="mg-stat-val" id="mg-moves">0</span><span class="mg-stat-lbl">Zetten</span></div>
        <div class="mg-stat"><span class="mg-stat-val" id="mg-time">0s</span><span class="mg-stat-lbl">Tijd</span></div>
      </div>
      <div class="mg-grid" id="mg-grid">${deck.map((e,i)=>`<div class="mg-card" data-i="${i}" data-e="${e}" onclick="mgFlip(this)"></div>`).join('')}</div>
      <div style="text-align:center">
        <button class="pomo-overlay-btn secondary" style="padding:9px 20px;font-size:13px" onclick="dismissPomoOverlay()">✕ Sluiten</button>
      </div>
    </div>`;
  window._mgTimer=setInterval(()=>{
    const el=document.getElementById('mg-time');
    if(el&&window._mgState)el.textContent=Math.floor((Date.now()-window._mgState.startTime)/1000)+'s';
  },1000);
}

function mgFlip(el){
  const st=window._mgState;
  if(!st||st.locked)return;
  if(el.classList.contains('mg-flipped')||el.classList.contains('mg-matched'))return;
  el.textContent=el.dataset.e;
  el.classList.add('mg-flipped');
  st.flipped.push(el);
  if(st.flipped.length===2){
    st.moves++;
    const mv=document.getElementById('mg-moves');
    if(mv)mv.textContent=st.moves;
    const[a,b]=st.flipped;
    if(a.dataset.e===b.dataset.e){
      a.classList.replace('mg-flipped','mg-matched');
      b.classList.replace('mg-flipped','mg-matched');
      st.flipped=[];st.matched++;
      if(st.matched===8){
        clearInterval(window._mgTimer);
        const secs=Math.floor((Date.now()-st.startTime)/1000);
        setTimeout(()=>mgDone(st.moves,secs),500);
      }
    }else{
      st.locked=true;
      setTimeout(()=>{
        a.textContent='';b.textContent='';
        a.classList.remove('mg-flipped');b.classList.remove('mg-flipped');
        st.flipped=[];st.locked=false;
      },750);
    }
  }
}

function mgDone(moves,secs){
  const card=document.querySelector('.pomo-overlay-card');
  const star=moves<=12?'🏆':moves<=18?'🥈':'🥉';
  const lbl=moves<=12?'Fenomenaal!':moves<=18?'Goed gedaan!':'Blijf oefenen!';
  card.innerHTML=`
    <div style="text-align:center">
      <span class="mg-done-emoji">${star}</span>
      <div class="mg-done-title">${lbl}</div>
      <div class="mg-done-sub">Alle paren gevonden in <strong>${moves} zetten</strong> en <strong>${secs}s</strong></div>
      <div class="mg-done-btns">
        <button class="pomo-overlay-btn secondary" onclick="dismissPomoOverlay()">Sluiten</button>
        <button class="pomo-overlay-btn mg-btn" onclick="startPomoMinigame()">↺ Opnieuw</button>
        <button class="pomo-overlay-btn primary" onclick="startBreakFromOverlay()">☕ Start pauze</button>
      </div>
    </div>`;
}

function togglePomo(){
  if(POMO.running){
    clearInterval(POMO.timer);clearInterval(POMO.breakTimer);POMO.running=false;
  }else{
    POMO.running=true;
    POMO.timer=setInterval(()=>{
      POMO.seconds--;
      if(POMO.seconds<=0){
        clearInterval(POMO.timer);POMO.running=false;
        if(POMO.mode==='study'){
          POMO.sessions=Math.min((POMO.sessions||0)+1,4);
          renderPomo();
          showPomoOverlay('break');
          return;
        }else{
          POMO.mode='study';POMO.seconds=25*60;POMO.total=25*60;
          if(POMO.sessions>=4)POMO.sessions=0;
        }
      }
      renderPomo();
    },1000);
  }
  renderPomo();
}

function resetPomo(){clearInterval(POMO.timer);clearInterval(POMO.breakTimer);POMO.running=false;POMO.mode='study';POMO.seconds=25*60;POMO.total=25*60;POMO.sessions=0;dismissPomoOverlay();renderPomo();}

