// ═══════ QUIZ MODE ═══════
function openQmode(did){
  ST.domein=ST.vak.domeinen.find(d=>d.id===did);
  document.getElementById('qmsub').textContent=`${ST.vak.naam} · Domein ${ST.domein.id}: ${ST.domein.naam}`;
  // Toon resume-chip als er een opgeslagen quiz is voor dit domein
  const resumeEl=document.getElementById('qm-resume');
  if(resumeEl){
    const draft=getQuizDraft();
    const pool=draft&&draft.mode==='snel'?ST.domein.sv:ST.domein.oe;
    const tot=pool?pool.length:0;
    if(draft&&draft.vakId===ST.vak.id&&draft.domeinId===did&&draft.idx>0&&draft.idx<tot){
      const pct=Math.round(draft.idx/tot*100);
      resumeEl.innerHTML=`<div class="qm-resume-chip" onclick="resumeQuizDraft()">
        <div style="font-size:22px">↩️</div>
        <div class="qm-resume-info">
          <div class="qm-resume-label">Doorgaan</div>
          <div style="font-size:13px;color:rgba(255,255,255,.8)">${draft.idx} van ${tot} vragen · ${draft.mode==='snel'?'Snelle Quiz':'Oud-examen'}</div>
          <div class="qm-resume-bar"><div class="qm-resume-bar-fill" style="width:${pct}%"></div></div>
        </div>
        <button onclick="event.stopPropagation();clearQuizDraft();document.getElementById('qm-resume').innerHTML=''" style="background:rgba(255,255,255,.1);border:none;color:rgba(255,255,255,.5);border-radius:8px;padding:4px 8px;cursor:pointer;font-size:12px">✕</button>
      </div>`;
    }else{resumeEl.innerHTML='';}
  }
  show('sc-qmode');
}

function startQ(mode){
  if(mode==='oud')trackEvent('oud_examen_quiz',{vak:ST.vak?.naam||null,domein:ST.domein?.naam||null});
  // If oud-examen mode and domain has year-tagged questions → show picker first
  if(mode==='oud'){
    const hasJaar=(ST.domein.oe||[]).some(q=>q.jaar);
    if(hasJaar){openOEPicker();return;}
  }
  clearQuizDraft();
  ST.mode=mode;
  ST.idx=0;ST.score=0;ST.antwrd=[];ST.tijdPerVraag=[];ST.combo=0;ST.xpThisRound=0;ST.flagged=new Set();
  if(!ST.isDailyChallenge)ST.isDailyChallenge=false;
  const pool=mode==='snel'?ST.domein.sv:ST.domein.oe;
  if(mode==='snel'){
    const _calcRe=/\bbereken\b/i;
    const filteredPool=pool.filter(q=>!_calcRe.test(q.v));
    const snelPool=filteredPool.length>=5?filteredPool:pool;
    ST.vragen=aqpSelectQuestions(snelPool,ST.vak.id,ST.domein.id,10);
  }else{
    ST.vragen=pool.slice();
  }
  // Pre-compute shuffle maps voor alle vragen in één keer (niet per vraag)
  if(mode==='snel'){
    ST.shuffleMaps=ST.vragen.map(()=>{
      const m=[0,1,2,3];
      for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[m[i],m[j]]=[m[j],m[i]];}
      return m;
    });
  }else{ST.shuffleMaps=[];}
  document.getElementById('qmeta').textContent=`${ST.vak.naam} · D${ST.domein.id}: ${ST.domein.naam} · ${mode==='snel'?'Snelle Quiz':'Oud-examen'}`;
  document.getElementById('sc-quiz').classList.toggle('oud-mode',mode==='oud');
  show('sc-quiz');
  // Toon skeleton kort terwijl quiz initialiseert
  const skel=document.getElementById('quiz-skeleton');
  const body=document.getElementById('qbody-inner');
  if(skel&&body){skel.style.display='flex';body.style.display='none';}
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(skel)skel.style.display='none';
    if(body)body.style.display='';
    toonV();
  }));
}

function openOEPicker(){
  const oe=ST.domein.oe||[];
  const withJaar=oe.filter(q=>q.jaar);
  // Group by jaar+tijdvak (desc)
  const groups={};
  withJaar.forEach(q=>{
    const key=`${q.jaar}-${q.tijdvak||1}`;
    if(!groups[key])groups[key]={jaar:q.jaar,tv:q.tijdvak||1,vragen:[]};
    groups[key].vragen.push(q);
  });
  const sorted=Object.values(groups).sort((a,b)=>b.jaar-a.jaar||b.tv-a.tv);
  let html='';
  sorted.forEach(g=>{
    const tvCls=g.tv===1?'tv1':'tv2';
    html+=`<div class="oep-group">
      <div class="oep-group-hdr">
        <span class="oep-jaar">${g.jaar}</span>
        <span class="oep-tv ${tvCls}">Tijdvak ${g.tv}</span>
      </div>`;
    g.vragen.forEach(q=>{
      const idx=oe.indexOf(q);
      const preview=q.v.length>110?q.v.slice(0,110)+'…':q.v;
      const hasCtx=q.ctx&&q.ctx.trim().length>0;
      html+=`<div class="oep-card" data-oeidx="${idx}">
        <div class="oep-card-domein">${ST.domein.naam}</div>
        <div class="oep-card-q">${preview}</div>
        <div class="oep-card-foot">
          <div class="oep-card-tags">
            ${hasCtx?'<span class="oep-card-tag">📄 Tekstfragment</span>':''}
            <span class="oep-card-tag">Open vraag</span>
          </div>
          <span class="oep-card-cta">Start</span>
        </div>
      </div>`;
    });
    html+='</div>';
  });
  // Uncategorized
  const noJaar=oe.filter(q=>!q.jaar);
  if(noJaar.length){
    html+=`<div class="oep-group"><div class="oep-group-hdr"><span class="oep-jaar" style="font-size:15px">Oefenvragen</span></div>`;
    noJaar.forEach(q=>{
      const idx=oe.indexOf(q);
      const preview=q.v.length>110?q.v.slice(0,110)+'…':q.v;
      html+=`<div class="oep-card" data-oeidx="${idx}">
        <div class="oep-card-domein">${ST.domein.naam}</div>
        <div class="oep-card-q">${preview}</div>
        <div class="oep-card-foot"><div class="oep-card-tags"><span class="oep-card-tag">Open vraag</span></div><span class="oep-card-cta">Start</span></div>
      </div>`;
    });
    html+='</div>';
  }
  document.getElementById('oep-list').innerHTML=html;
  document.getElementById('oep-title').textContent=`${ST.vak.naam} · Domein ${ST.domein.id}: ${ST.domein.naam}`;
  document.getElementById('oep-count').textContent=oe.length+' '+(oe.length===1?'vraag':'vragen');
  document.getElementById('oep-back-btn').onclick=()=>show('sc-qmode');
  // Attach clicks
  document.querySelectorAll('#oep-list .oep-card').forEach(card=>{
    card.addEventListener('click',()=>startOESingle(parseInt(card.dataset.oeidx)));
  });
  show('sc-oe-pick');
}

function startOESingle(qIdx){
  ST.mode='oud';
  ST.idx=0;ST.score=0;ST.antwrd=[];ST.tijdPerVraag=[];ST.combo=0;ST.xpThisRound=0;ST.flagged=new Set();
  ST.vragen=[ST.domein.oe[qIdx]];
  const q=ST.domein.oe[qIdx];
  const jaarLabel=q.jaar?` · ${q.jaar} T${q.tijdvak||1}`:'';
  document.getElementById('qmeta').textContent=`${ST.vak.naam} · D${ST.domein.id}${jaarLabel}`;
  document.getElementById('sc-quiz').classList.add('oud-mode');
  show('sc-quiz');
  toonV();
}

// ═══════ QUIZ LOGIC ═══════
function toggleFlagQ(){
  if(!ST.flagged)ST.flagged=new Set();
  const i=ST.idx;
  if(ST.flagged.has(i))ST.flagged.delete(i);else ST.flagged.add(i);
  const btn=document.getElementById('quiz-flag-btn');
  if(btn)btn.classList.toggle('flagged',ST.flagged.has(i));
  haptic&&haptic([10]);
}
function toonV(){
  const q=ST.vragen[ST.idx];
  const tot=ST.vragen.length;
  ST._vraagStartMs=Date.now(); // starttijd voor responstijd-meting

  // Vlag-knop bijwerken
  const _fb=document.getElementById('quiz-flag-btn');
  if(_fb)_fb.classList.toggle('flagged',!!(ST.flagged&&ST.flagged.has(ST.idx)));

  // Show adaptive pill if history exists for this domain
  const _aqpd=aqpGet();
  const _aqpdom=aqpDomainData(_aqpd,ST.vak.id,ST.domein.id);
  const _adaptPill=document.getElementById('adaptive-pill');
  if(_adaptPill)_adaptPill.style.display=Object.values(_aqpdom).some(e=>e.n>0)?'inline-flex':'none';

  document.getElementById('qctr').textContent=`Vraag ${ST.idx+1} van ${tot}`;
  document.getElementById('qprog').style.width=`${(ST.idx/tot)*100}%`;
  document.getElementById('qfb').style.display='none';
  document.getElementById('qnxt').style.display='none';

  // context tekst
  const ctx=document.getElementById('qctx');
  const hasCtxNow=!!(q.ctx&&q.ctx!=='');
  document.getElementById('sc-quiz').classList.toggle('has-ctx',hasCtxNow);
  if(hasCtxNow){ctx.style.display='block';ctx.textContent=q.ctx;}
  else{ctx.style.display='none';}

  // vraagstelling
  document.getElementById('qq').textContent=q.v;

  // Bronvermelding chip — altijd zichtbaar
  {const bronEl=document.getElementById('qbron');
  if(bronEl){const isCE=q.bron&&/CE\s*\d{4}|CE\s*20\d\d|\d{4}\s*T[12]/i.test(q.bron);
  const label=isCE?q.bron.replace(/\s*\(.*\)/,'').trim():'Slagio oefenvraag';
  bronEl.innerHTML=`<span class="q-src ${isCE?'q-src-ce':'q-src-oef'}">${isCE?'📋':'✍️'} ${label}</span>`;}}

  if(ST.mode==='snel'){
    // Toon timer, verberg oud-area
    document.getElementById('qring').style.display='block';
    document.getElementById('oud-area').style.display='none';
    document.getElementById('snel-area').style.display='grid';

    // Gebruik pre-computed shuffle voor deze vraag (éénmalig berekend bij quiz-start)
    const idxs=ST.shuffleMaps[ST.idx]||[0,1,2,3];
    const correctPos=idxs.indexOf(q.c);
    ST.shuffleMap=idxs;

    const cols=['oA','oB','oC','oD'];
    const labs=['A','B','C','D'];
    const area=document.getElementById('snel-area');
    area.innerHTML='';
    idxs.forEach((origIdx,pos)=>{
      const btn=document.createElement('button');
      btn.className=`opt ${cols[pos]}`;
      btn.innerHTML=`<span class="oi">${labs[pos]}</span>${q.o[origIdx]}`;
      btn.dataset.pos=pos;
      btn.dataset.correct=correctPos;
      btn.onclick=function(){kies(parseInt(this.dataset.pos),parseInt(this.dataset.correct));};
      area.appendChild(btn);
    });
    startTimer(20);
    // Lucky bonus kans per vraag
    maybeGiveLucky();
    // XP Surge kans (1/5, duurt 3 vragen)
    maybeSurge();
    // Toon keyboard-hint alleen op desktop
    const kbHint=document.getElementById('quiz-kb-hint');
    if(kbHint)kbHint.style.display=(navigator.maxTouchPoints===0)?'block':'none';

  } else {
    // Oud-examen: verberg timer + snel-area
    clearInterval(ST.timer);
    document.getElementById('qring').style.display='none';
    document.getElementById('snel-area').style.display='none';
    document.getElementById('snel-area').innerHTML='';

    // bronlabel al gezet bovenaan voor beide modi

    // Reset oud-area volledig voor elke nieuwe vraag
    document.getElementById('oud-area').style.display='block';
    document.getElementById('oa-input').value='';
    document.getElementById('oa-input').disabled=false;
    document.getElementById('nakijk-btn').style.display='block';
    document.getElementById('nakijk-btn').disabled=false;
    document.getElementById('model-blok').style.display='none';
    document.getElementById('ma-text').textContent=q.u;
    // Heractiveer de beoordelingsknopppen voor elke nieuwe vraag
    document.querySelectorAll('.assess-btn').forEach(b=>{b.disabled=false;});
  }
}

// ═══════ QUIZ KEYBOARD SHORTCUTS ═══════
document.addEventListener('keydown',function(e){
  const scQuiz=document.getElementById('sc-quiz');
  if(!scQuiz||!scQuiz.classList.contains('on'))return;
  // Negeer als focus in een input/textarea zit
  if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;
  const nxt=document.getElementById('qnxt');
  const nxtVisible=nxt&&nxt.style.display!=='none';
  if(ST.mode==='snel'&&!nxtVisible){
    // Antwoord selecteren met 1-4 of a-d
    const keyMap={'1':0,'2':1,'3':2,'4':3,'a':0,'b':1,'c':2,'d':3};
    const pos=keyMap[e.key.toLowerCase()];
    if(pos!==undefined){
      const btns=document.querySelectorAll('#snel-area .opt');
      if(btns[pos]&&!btns[pos].disabled){btns[pos].click();e.preventDefault();}
    }
  }
  // Enter/Space = volgende vraag / bekijk resultaat
  if((e.key==='Enter'||e.key===' ')&&nxtVisible){
    nxt.click();e.preventDefault();
  }
});

function startTimer(max){
  clearInterval(ST.timer);
  ST.tijd=max;
  const c=document.getElementById('tcirc');
  const t=document.getElementById('tnum');
  const circ=2*Math.PI*21;
  c.style.stroke='var(--or)';
  c.style.strokeDashoffset='0';
  t.textContent=max;
  document.getElementById('qring').classList.remove('timer-urgent');
  ST.timer=setInterval(()=>{
    ST.tijd--;
    t.textContent=ST.tijd;
    c.style.strokeDashoffset=circ*(1-ST.tijd/max);
    if(ST.tijd<=5){c.style.stroke='#F87171';document.getElementById('qring').classList.add('timer-urgent');}
    if(ST.tijd<=0){clearInterval(ST.timer);tijdOp();}
  },1000);
}

function kies(gekozen,correct){
  clearInterval(ST.timer);
  // Immediately disable all buttons + show suspense shimmer on selected
  const btns=document.querySelectorAll('#snel-area .opt');
  btns.forEach(b=>b.disabled=true);
  btns[gekozen].classList.add('suspense-pending');
  // 350ms suspense delay — dopamine peak occurs in the gap between action and result
  setTimeout(()=>_kiesReveal(gekozen,correct,btns),350);
}
function _kiesReveal(gekozen,correct,btns){
  btns[gekozen].classList.remove('suspense-pending');
  const ok=gekozen===correct;
  ST.score+=ok?1:0;
  // Log per-vraag data voor adaptive engine
  try{const ms=ST._vraagStartMs?Date.now()-ST._vraagStartMs:null;logQuestion(ST.vak?.id,ST.domein?.id,ST.mode,ST.idx,ok,ms);}catch(e){}
  if(ok){ST.combo=(ST.combo||0)+1;playSound('correct');haptic([20]);}
  else{ST.combo=0;playSound('wrong');haptic([60,20,60]);}
  // Particles van de geklikte knop
  spawnParticles(btns[gekozen],ok);
  // Hot streak glow
  setHotStreak(ST.combo);
  // Comeback detectie
  checkComeback(ok);
  // Speed bonus (alleen bij correct)
  if(ok)checkSpeedBonus(Math.max(0,ST.tijd));
  // Lucky bonus (2× XP als de vraag lucky was)
  if(ok&&_luckyActive){const extra=Math.round((ST.xpThisRound||0)*.5);ST.xpThisRound=(ST.xpThisRound||0)+extra;_luckyActive=false;}
  if(ok&&ST.mode==='snel'){
    const mult=getComboMult(ST.combo);
    const streakBonus=getStreakBonus();
    const dcBonus=ST.isDailyChallenge?2:1;
    const surgeBonus=_surgeActive?2:1;
    const earned=Math.round(10*mult*(1+streakBonus)*dcBonus*surgeBonus);
    ST.xpThisRound=(ST.xpThisRound||0)+earned;
    showCombo(ST.combo);
    setTimeout(()=>{showXPToast(earned);floatXP(earned);},200);
    // Verlaag surge teller na correcte vraag
    if(_surgeActive){_surgeLeft--;if(_surgeLeft<=0){_surgeActive=false;_removeSurgeBadge();}else{_updateSurgeBadge();}}
  }
  if(!ok){
    const qa=document.getElementById('snel-area');
    if(qa){qa.classList.remove('shake');void qa.offsetWidth;qa.classList.add('shake');}
  }
  const q=ST.vragen[ST.idx];
  const chosenOrigIdx=ST.shuffleMap[gekozen];
  const tijdOver=Math.max(0,ST.tijd);
  ST.tijdPerVraag.push(tijdOver);
  aqpRecord(ST.vragen[ST.idx], ok?1:0);
  ST.antwrd.push({pts:ok?1:0,chosenText:q.o[chosenOrigIdx],tijdOver});
  saveQuizDraft();
  btns.forEach((b,i)=>{
    if(i===correct)b.classList.add('correct');
    else b.classList.add('wrong');
  });
  const fb=document.getElementById('qfb');
  fb.style.display='block';
  fb.className=`qfb ${ok?'fbok':'fbno'}`;
  if(ok){
    fb.innerHTML=`<div class="fbt">✓ Correct!</div>${q.u?`<button class="fbt-info-btn" onclick="this.nextElementSibling.classList.toggle('show');this.textContent=this.nextElementSibling.classList.contains('show')?'ℹ️ Verberg uitleg':'ℹ️ Toon uitleg'">ℹ️ Toon uitleg</button><div class="fbt-info-text">${q.u}</div>`:''}`;
  }else{
    const correctText=q.o[q.c]||'';
    fb.innerHTML=`<div class="fbt">✗ Fout</div><div class="fbtx"><span style="color:#4ade80;font-weight:700">✓ Juist:</span> ${correctText}</div>${q.u?`<button class="fbt-info-btn" style="margin-top:4px" onclick="this.nextElementSibling.classList.toggle('show');this.textContent=this.nextElementSibling.classList.contains('show')?'ℹ️ Verberg uitleg':'ℹ️ Toon uitleg'">ℹ️ Toon uitleg</button><div class="fbt-info-text">${q.u}</div>`:''}`;
  }
  const nxt=document.getElementById('qnxt');
  nxt.style.display='block';
  nxt.textContent=ST.idx<ST.vragen.length-1?'Volgende →':'Bekijk resultaat →';
}

function tijdOp(){
  const q=ST.vragen[ST.idx];
  ST.tijdPerVraag.push(0);
  aqpRecord(ST.vragen[ST.idx], 0);
  ST.antwrd.push({pts:0,chosenText:'⏱ Tijd was op',tijdOver:0});
  saveQuizDraft();
  const correct=ST.shuffleMap.indexOf(q.c);
  const btns=document.querySelectorAll('#snel-area .opt');
  btns.forEach((b,i)=>{b.disabled=true;if(i===correct)b.classList.add('correct');else b.classList.add('wrong');});
  const fb=document.getElementById('qfb');
  fb.style.display='block';
  fb.className='qfb fbtm';
  fb.innerHTML=`<div class="fbt">⏱ Tijd is om!</div><div class="fbtx">${q.u}</div>`;
  const nxt=document.getElementById('qnxt');
  nxt.style.display='block';
  nxt.textContent=ST.idx<ST.vragen.length-1?'Volgende →':'Bekijk resultaat →';
}

function nakijken(){
  document.getElementById('oa-input').disabled=true;
  document.getElementById('nakijk-btn').style.display='none';
  document.getElementById('model-blok').style.display='block';
}

function beoordeel(pts){
  ST.score+=pts;
  const userText=document.getElementById('oa-input').value||'(geen antwoord ingevuld)';
  ST.antwrd.push({pts,userText});
  saveQuizDraft();
  document.querySelectorAll('.assess-btn').forEach(b=>b.disabled=true);
  const colors={1:'#4ADE80',0.5:'#FCD34D',0:'#F87171'};
  const labels={1:'✓ Goed genoteerd',0.5:'~ Deels goed genoteerd',0:'✗ Fout genoteerd'};
  const fb=document.getElementById('qfb');
  fb.style.display='block';
  fb.className='qfb';
  fb.innerHTML=`<div class="fbt" style="color:${colors[pts]}">${labels[pts]}</div>`;
  const nxt=document.getElementById('qnxt');
  nxt.style.display='block';
  nxt.textContent=ST.idx<ST.vragen.length-1?'Volgende vraag →':'Bekijk resultaat →';
}

function nextQ(){
  ST.idx++;
  if(ST.idx>=ST.vragen.length)toonRes();
  else toonV();
}

// ═══════ PARTICLES ═══════
function spawnParticles(el,ok){
  if(!el)return;
  const r=el.getBoundingClientRect();
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  const cols=ok
    ?['#4ADE80','#22c55e','#86efac','#f59e0b','#fcd34d','#fff','#a3e635']
    :['#F87171','#ef4444','#fca5a5','#fb923c'];
  const n=ok?14:7;
  for(let i=0;i<n;i++){
    const p=document.createElement('div');
    p.className='particle';
    const angle=(i/n)*Math.PI*2+Math.random()*.7;
    const dist=ok?55+Math.random()*75:18+Math.random()*30;
    const size=ok?4+Math.random()*8:3+Math.random()*4;
    const dur=(.5+Math.random()*.35).toFixed(2)+'s';
    p.style.cssText=`left:${cx}px;top:${cy}px;background:${cols[i%cols.length]};width:${size}px;height:${size}px;--px:${Math.cos(angle)*dist}px;--py:${Math.sin(angle)*dist}px;--dur:${dur};animation-delay:${(Math.random()*.1).toFixed(3)}s`;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),950);
  }
}

// ═══════ HOT STREAK ═══════
function setHotStreak(combo){
  const q=document.getElementById('sc-quiz');
  if(!q)return;
  if(combo>=3){
    const intensity=Math.min((combo-2)*.05,.2).toFixed(3);
    q.style.setProperty('--heat',`rgba(245,158,11,${intensity})`);
    q.classList.add('hot-streak');
  }else{
    q.classList.remove('hot-streak');
    q.style.removeProperty('--heat');
  }
}

// ═══════ SPEED BONUS ═══════
function checkSpeedBonus(timeLeft){
  if(timeLeft<10)return;
  const bonus=Math.max(1,Math.round((timeLeft-9)*1.8));
  ST.xpThisRound=(ST.xpThisRound||0)+bonus;
  const el=document.createElement('div');
  el.className='speed-badge';
  el.textContent=`⚡ Snel! +${bonus} XP`;
  document.body.appendChild(el);
  haptic([10,5,15]);
  setTimeout(()=>el.remove(),1800);
}

// ═══════ LUCKY BONUS ═══════
let _luckyActive=false;
function maybeGiveLucky(){
  _luckyActive=Math.random()<(1/7);
  if(!_luckyActive)return;
  const fl=document.createElement('div');
  fl.className='lucky-flash';
  document.body.appendChild(fl);
  setTimeout(()=>fl.remove(),800);
  showToast('🍀 Lucky vraag! Dubbele XP!','#f59e0b',2800);
  haptic([20,10,20,10,40]);
}

// ═══════ XP SURGE ═══════
let _surgeActive=false,_surgeLeft=0;
function maybeSurge(){
  if(_surgeActive)return;
  if(Math.random()<(1/5)){
    _surgeActive=true;_surgeLeft=3;
    _showSurgeBadge();
    showToast('🔥 XP SURGE! Volgende 3 vragen ×2 XP!','#f59e0b',2500);
    haptic([25,10,45,10,25]);
    playSound('combo');
  }
}
function _showSurgeBadge(){
  _removeSurgeBadge();
  const el=document.createElement('div');
  el.id='surge-badge-el';el.className='surge-badge';
  el.innerHTML=`🔥 SURGE <span class="surge-count" id="surge-count">${_surgeLeft}</span> ×2 XP`;
  document.body.appendChild(el);
}
function _updateSurgeBadge(){
  const cnt=document.getElementById('surge-count');
  if(cnt)cnt.textContent=_surgeLeft;
}
function _removeSurgeBadge(){
  const old=document.getElementById('surge-badge-el');
  if(old)old.remove();
}

// ═══════ COMEBACK ═══════
let _wrongStreak=0;
function checkComeback(ok){
  if(!ok){_wrongStreak++;return;}
  if(_wrongStreak>=2){
    const el=document.createElement('div');
    el.className='comeback-toast';
    el.textContent='🔄 Comeback!';
    document.body.appendChild(el);
    haptic([15,10,35]);
    setTimeout(()=>el.remove(),2000);
  }
  _wrongStreak=0;
}

// ═══════ ACHIEVEMENTS ═══════
const ACH_KEY='slagio_ach_v1';
let _achShownSession=new Set();
const ALL_BADGES=[
  // Streak
  {id:'streak1',  emoji:'🌱', label:'Eerste stap',   tip:'Je eerste dag geoefend',          cat:'Streak',     rarity:'common'},
  {id:'streak3',  emoji:'🔥', label:'Op dreef',       tip:'3 dagen op rij geoefend',         cat:'Streak',     rarity:'common'},
  {id:'streak7',  emoji:'⚡', label:'Een week',        tip:'7 dagen op rij',                  cat:'Streak',     rarity:'rare'},
  {id:'streak14', emoji:'💎', label:'Twee weken',      tip:'14 dagen streak',                 cat:'Streak',     rarity:'epic'},
  {id:'streak30', emoji:'🔮', label:'Een maand',       tip:'30 dagen op rij',                 cat:'Streak',     rarity:'legendary'},
  {id:'streak100',emoji:'👑', label:'Legende',         tip:'100 dagen streak',                cat:'Streak',     rarity:'mythic'},
  {id:'streak200',emoji:'🌌', label:'Onsterfelijk',    tip:'200 dagen streak',                cat:'Streak',     rarity:'eternal'},
  {id:'streak300',emoji:'⚜️', label:'Grootmeester',    tip:'300 dagen streak',                cat:'Streak',     rarity:'eternal'},
  {id:'streak365',emoji:'🪐', label:'Heel het jaar',   tip:'365 dagen op rij — een vol jaar', cat:'Streak',     rarity:'eternal'},
  // Quizzen
  {id:'quiz1',    emoji:'🎯', label:'Beginner',        tip:'Je eerste quiz gemaakt',          cat:'Quizzen',    rarity:'common'},
  {id:'quiz10',   emoji:'📚', label:'Student',         tip:'10 quizzen gemaakt',              cat:'Quizzen',    rarity:'rare'},
  {id:'quiz50',   emoji:'🚀', label:'Gevorderd',       tip:'50 quizzen gemaakt',              cat:'Quizzen',    rarity:'epic'},
  {id:'quiz100',  emoji:'🌊', label:'Doorzetter',      tip:'100 quizzen gemaakt',             cat:'Quizzen',    rarity:'legendary'},
  {id:'quiz500',  emoji:'💫', label:'Meester',         tip:'500 quizzen gemaakt',             cat:'Quizzen',    rarity:'mythic'},
  // Prestaties
  {id:'combo3',   emoji:'💥', label:'3 op rij',        tip:'3 vragen op rij goed',            cat:'Prestaties', rarity:'rare'},
  {id:'combo5',   emoji:'🌩️', label:'God Mode',        tip:'5 vragen op rij goed',            cat:'Prestaties', rarity:'epic'},
  {id:'combo10',  emoji:'🏅', label:'Legendarisch',    tip:'10 vragen op rij goed',           cat:'Prestaties', rarity:'legendary'},
  {id:'perfect',  emoji:'🌟', label:'Perfecte score',  tip:'100% op een quiz',                cat:'Prestaties', rarity:'legendary'},
  // Vakken
  {id:'vakken3',  emoji:'📖', label:'Veelzijdig',      tip:'3 vakken geoefend',               cat:'Vakken',     rarity:'rare'},
  {id:'vakken10', emoji:'🌍', label:'Alleskunner',     tip:'10 vakken geoefend',              cat:'Vakken',     rarity:'legendary'},
  // Examen
  {id:'examen_done',emoji:'📄',label:'Examenkandidaat',tip:'Eerste echt examen afgemaakt',   cat:'Examen',     rarity:'mythic'},
  // Sociaal
  {id:'ambassadeur', emoji:'📣',label:'Ambassadeur',  tip:'Voortgang gedeeld met anderen',   cat:'Sociaal',    rarity:'rare'},
  // Flashcards
  {id:'fc_1',   emoji:'🃏', label:'Kaartjeskoning',  tip:'Eerste flashcard-sessie gespeeld',      cat:'Flashcards', rarity:'common'},
  {id:'fc_10',  emoji:'📦', label:'Kaartenstapel',   tip:'10 flashcard-sessies gespeeld',         cat:'Flashcards', rarity:'rare'},
  {id:'fc_50',  emoji:'🔁', label:'Herhaalmeester',  tip:'50 flashcard-sessies voltooid',         cat:'Flashcards', rarity:'epic'},
  // Bot Race
  {id:'race_1',    emoji:'🏁', label:'Op de baan',    tip:'Eerste Bot Race gestart',              cat:'Bot Race',   rarity:'common'},
  {id:'race_win1', emoji:'🥇', label:'Racewinnaar',   tip:'Eerste Bot Race gewonnen',             cat:'Bot Race',   rarity:'rare'},
  {id:'race_win10',emoji:'🏆', label:'Kampioen',      tip:'10 Bot Races gewonnen',                cat:'Bot Race',   rarity:'epic'},
  // Domein
  {id:'dom_1',  emoji:'🎖️', label:'Specialist',     tip:'1 domein ≥80% behaald',                cat:'Domein',     rarity:'rare'},
  {id:'dom_5',  emoji:'🌠', label:'Expert',          tip:'5 domeinen ≥80% behaald',              cat:'Domein',     rarity:'epic'},
  {id:'dom_15', emoji:'🧠', label:'Allround',        tip:'15 domeinen ≥80% behaald',             cat:'Domein',     rarity:'legendary'},
  // Comeback
  {id:'comeback_3', emoji:'💪', label:'Comeback',        tip:'Teruggekeerd na 3+ dagen weg',     cat:'Comeback',   rarity:'rare'},
  {id:'comeback_7', emoji:'🔄', label:'Vasthoudend',     tip:'Teruggekeerd na 7+ dagen weg',     cat:'Comeback',   rarity:'epic'},
  {id:'comeback_14',emoji:'🛡️', label:'Niet te stoppen', tip:'Teruggekeerd na 14+ dagen weg',   cat:'Comeback',   rarity:'legendary'},
  // Studieplan
  {id:'plan_1',  emoji:'📅', label:'Planmatig',       tip:'Eerste studieplan-taak gestart',       cat:'Studieplan', rarity:'common'},
  {id:'plan_7',  emoji:'📋', label:'Doelgericht',     tip:'7 studieplan-taken gestart',           cat:'Studieplan', rarity:'rare'},
  {id:'plan_30', emoji:'🗓️', label:'IJzeren routine', tip:'30 studieplan-taken gestart',          cat:'Studieplan', rarity:'epic'},
  {id:'plan_day',emoji:'🎯', label:'Dagplanner',     tip:'Alle taken van een studiedag voltooid',   cat:'Studieplan', rarity:'rare'},
  {id:'plan_3d', emoji:'📆', label:'Op schema',      tip:'3 studiedagen op rij alle taken gedaan',  cat:'Studieplan', rarity:'epic'},
  {id:'plan_wk', emoji:'🏆', label:'Weekkampioen',   tip:'5 studiedagen in een week voltooid',      cat:'Studieplan', rarity:'legendary'},
  // Perfectie
  {id:'perfect_3', emoji:'🌟', label:'Hat-trick',  tip:'3× een perfecte score (100%) behaald',   cat:'Perfectie',  rarity:'rare'},
  {id:'perfect_10',emoji:'💎', label:'Onfeilbaar', tip:'10× een perfecte score behaald',          cat:'Perfectie',  rarity:'epic'},
  {id:'perfect_25',emoji:'🌌', label:'Godniveau',  tip:'25× een perfecte score behaald',          cat:'Perfectie',  rarity:'legendary'},
];
const RARITY_LABEL={common:'Gewoon',rare:'Zeldzaam',epic:'Episch',legendary:'Legendarisch',mythic:'Mythisch',eternal:'Eeuwig'};
const FEATURED_BADGE_KEY='slagio_featured_badge_id';
function getSelectedFeaturedBadgeId(){return localStorage.getItem(FEATURED_BADGE_KEY)||null;}
function setSelectedFeaturedBadgeId(id){
  if(id)localStorage.setItem(FEATURED_BADGE_KEY,id);
  else localStorage.removeItem(FEATURED_BADGE_KEY);
}
function selectFeaturedBadge(id){
  const sel=getSelectedFeaturedBadgeId();
  const newId=sel===id?null:id;
  setSelectedFeaturedBadgeId(newId);
  renderProfileBadges();
  // Update own localStorage leaderboard entries live
  try{
    const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    if(p.naam){
      ['havo','vwo'].forEach(lvl=>{
        const key='examenapp_leaderboard_'+lvl;
        const entries=JSON.parse(localStorage.getItem(key)||'[]');
        let changed=false;
        entries.forEach(e=>{if(!e.isBot&&e.naam===p.naam){e.featuredBadgeId=newId;changed=true;}});
        if(changed)localStorage.setItem(key,JSON.stringify(entries));
      });
    }
  }catch(e){}
  // Push naar Supabase zodat andere gebruikers de badge ook zien
  if(currentUser){
    SB.from('leaderboard').update({featured_badge_id:newId}).eq('user_id',currentUser.id)
      .then(()=>{sessionStorage.removeItem(_avatarCloudSyncedKey);})
      .catch(()=>{});
  }
}
function getAchieved(){try{return JSON.parse(localStorage.getItem(ACH_KEY)||'{}');}catch(e){return{};}}
function earnAch(id){
  const a=getAchieved();
  if(a[id])return false;
  a[id]=Date.now();
  localStorage.setItem(ACH_KEY,JSON.stringify(a));
  try{pushSyncBundle();}catch(e){}
  return true;
}
function checkQuizCountAch(total){
  if(total>=1&&earnAch('quiz1'))setTimeout(()=>showAch('🎯','Eerste quiz gemaakt!'),400);
  if(total>=10&&earnAch('quiz10'))setTimeout(()=>showAch('📚','10 quizzen — student!'),400);
  if(total>=50&&earnAch('quiz50'))setTimeout(()=>showAch('🚀','50 quizzen — gevorderd!'),400);
  if(total>=100&&earnAch('quiz100'))setTimeout(()=>showAch('🌊','100 quizzen — doorzetter!'),400);
  if(total>=500&&earnAch('quiz500'))setTimeout(()=>showAch('💫','500 quizzen — meester!'),400);
}
function checkVakkenAch(){
  try{
    const ph=JSON.parse(localStorage.getItem('examenapp_progress_havo')||'{}');
    const pv=JSON.parse(localStorage.getItem('examenapp_progress_vwo')||'{}');
    const n=new Set([...Object.keys(ph),...Object.keys(pv)].map(k=>k.split('_')[0])).size;
    if(n>=3&&earnAch('vakken3'))setTimeout(()=>showAch('📖','3 vakken geoefend — veelzijdig!'),400);
    if(n>=10&&earnAch('vakken10'))setTimeout(()=>showAch('🌍','10 vakken — alleskunner!'),400);
  }catch(e){}
  checkDomeinAch();
}
function checkFcAch(){
  const n=parseInt(localStorage.getItem('slagio_fc_sessions')||'0')+1;
  localStorage.setItem('slagio_fc_sessions',n);
  if(n>=1&&earnAch('fc_1'))setTimeout(()=>showAch('🃏','Kaartjeskoning! Eerste flashcard-sessie!'),400);
  if(n>=10&&earnAch('fc_10'))setTimeout(()=>showAch('📦','10 flashcard-sessies — kaartenstapel!'),400);
  if(n>=50&&earnAch('fc_50'))setTimeout(()=>showAch('🔁','50 sessies — herhaalmeester!'),400);
}
function checkRaceAch(playerWin){
  if(earnAch('race_1'))setTimeout(()=>showAch('🏁','Op de baan! Eerste race gespeeld!'),400);
  if(playerWin){
    const w=parseInt(localStorage.getItem('slagio_race_wins')||'0')+1;
    localStorage.setItem('slagio_race_wins',w);
    if(w>=1&&earnAch('race_win1'))setTimeout(()=>showAch('🥇','Racewinnaar! Eerste race gewonnen!'),600);
    if(w>=10&&earnAch('race_win10'))setTimeout(()=>showAch('🏆','10 races gewonnen — kampioen!'),600);
  }
}
function checkDomeinAch(){
  try{
    let count=0;
    getVK().forEach(vak=>{(vak.domeinen||[]).forEach(dom=>{const{pct,hasData}=getDomeinBestPct(vak.id,dom.id);if(hasData&&pct>=0.80)count++;});});
    if(count>=1&&earnAch('dom_1'))setTimeout(()=>showAch('🎖️','Specialist! Eerste domein ≥80%!'),500);
    if(count>=5&&earnAch('dom_5'))setTimeout(()=>showAch('🌠','Expert! 5 domeinen ≥80%!'),500);
    if(count>=15&&earnAch('dom_15'))setTimeout(()=>showAch('🧠','Allround! 15 domeinen ≥80%!'),500);
  }catch(e){}
}
function checkComebackAch(dayGap){
  if(dayGap>=3&&earnAch('comeback_3'))setTimeout(()=>showAch('💪','Comeback na 3+ dagen weg!'),400);
  if(dayGap>=7&&earnAch('comeback_7'))setTimeout(()=>showAch('🔄','Vasthoudend! 7+ dagen weg maar terug!'),400);
  if(dayGap>=14&&earnAch('comeback_14'))setTimeout(()=>showAch('🛡️','Niet te stoppen! 14+ dagen weg maar terug!'),400);
}
function checkPlanAch(){
  const n=parseInt(localStorage.getItem('slagio_plan_tasks')||'0')+1;
  localStorage.setItem('slagio_plan_tasks',n);
  if(n>=1&&earnAch('plan_1'))setTimeout(()=>showAch('📅','Planmatig! Eerste studieplan-taak!'),400);
  if(n>=7&&earnAch('plan_7'))setTimeout(()=>showAch('📋','7 studieplan-taken — doelgericht!'),400);
  if(n>=30&&earnAch('plan_30'))setTimeout(()=>showAch('🗓️','30 taken — IJzeren routine!'),400);
}
function checkPlanDayAch(dateStr){
  try{
    const plan=spGetPlan();
    if(!plan)return;
    const dayTasks=(plan.tasks||[]).filter(t=>t.dateStr===dateStr);
    if(!dayTasks.length)return;
    const doneMap=spGetDone();
    const allDone=dayTasks.every(t=>!!doneMap[`${t.dateStr}_${t.vakId}_${t.domId}_${t.actKey}`]);
    if(!allDone)return;
    if(earnAch('plan_day'))setTimeout(()=>{showAch('🎯','Dagplanner! Alle taken gedaan! +100 XP');try{addXP(100);launchConfetti();}catch(e){}},400);
    checkConsecutivePlanDays();
  }catch(e){}
}
function checkConsecutivePlanDays(){
  try{
    const plan=spGetPlan();
    if(!plan)return;
    const doneMap=spGetDone();
    const dates=[...new Set((plan.tasks||[]).map(t=>t.dateStr))].sort();
    const today=new Date().toISOString().slice(0,10);
    let streak=0;
    for(let i=dates.length-1;i>=0;i--){
      const ds=dates[i];
      if(ds>today)continue;
      const dayTasks=(plan.tasks||[]).filter(t=>t.dateStr===ds);
      if(dayTasks.length>0&&dayTasks.every(t=>!!doneMap[`${t.dateStr}_${t.vakId}_${t.domId}_${t.actKey}`]))streak++;
      else break;
    }
    if(streak>=3&&earnAch('plan_3d'))setTimeout(()=>{showAch('📆','Op schema! 3 studiedagen op rij! +50 XP');try{addXP(50);}catch(e){}},500);
    if(streak>=5&&earnAch('plan_wk'))setTimeout(()=>showAch('🏆','Weekkampioen! 5 studiedagen voltooid!'),600);
  }catch(e){}
}
function checkPerfectCountAch(){
  const n=parseInt(localStorage.getItem('slagio_perfect_count')||'0')+1;
  localStorage.setItem('slagio_perfect_count',n);
  if(n>=3&&earnAch('perfect_3'))setTimeout(()=>showAch('🌟','Hat-trick! 3× perfect gescoord!'),500);
  if(n>=10&&earnAch('perfect_10'))setTimeout(()=>showAch('💎','Onfeilbaar! 10× perfect!'),500);
  if(n>=25&&earnAch('perfect_25'))setTimeout(()=>showAch('🌌','Godniveau! 25× perfect!'),500);
}
function renderProfileBadges(){
  const el=document.getElementById('prof-badges-content');
  const sub=document.getElementById('prof-badges-sub');
  if(!el)return;
  const ach=getAchieved();
  const selId=getSelectedFeaturedBadgeId();
  const earned=ALL_BADGES.filter(b=>ach[b.id]);
  const selBadge=earned.find(b=>b.id===selId);
  if(sub){
    sub.innerHTML=earned.length===0
      ?`<span style="color:var(--mu)">Maak quizzen om badges te verdienen</span>`
      :`<span style="color:var(--mu)">${earned.length} van ${ALL_BADGES.length} behaald · </span>`
       +(selBadge?`<span style="color:var(--or);font-weight:700">${selBadge.emoji} ${selBadge.label} op avatar</span>`
                 :`<span style="color:var(--mu)">Klik een badge om te selecteren</span>`);
  }
  // Feature 6: badge progress data
  const _bpStreak=calcStreak().current||0;
  const _bpTotalQ=getStreak().totalQuizzes||0;
  let _bpVakCount=0;
  try{const ph=JSON.parse(localStorage.getItem('examenapp_progress_havo')||'{}');const pv=JSON.parse(localStorage.getItem('examenapp_progress_vwo')||'{}');_bpVakCount=new Set([...Object.keys(ph),...Object.keys(pv)].map(k=>k.split('_')[0])).size;}catch(e){}
  function _badgeProgress(b){
    // Returns 0–1 fraction (capped at 0.99) or null if not computable
    if(b.id==='streak7')return Math.min(0.99,_bpStreak/7);
    if(b.id==='streak14')return Math.min(0.99,_bpStreak/14);
    if(b.id==='streak30')return Math.min(0.99,_bpStreak/30);
    if(b.id==='streak100')return Math.min(0.99,_bpStreak/100);
    if(b.id==='streak200')return Math.min(0.99,_bpStreak/200);
    if(b.id==='streak300')return Math.min(0.99,_bpStreak/300);
    if(b.id==='streak365')return Math.min(0.99,_bpStreak/365);
    if(b.id==='streak3')return Math.min(0.99,_bpStreak/3);
    if(b.id==='streak1')return Math.min(0.99,_bpStreak/1);
    if(b.id==='quiz1')return Math.min(0.99,_bpTotalQ/1);
    if(b.id==='quiz10')return Math.min(0.99,_bpTotalQ/10);
    if(b.id==='quiz50')return Math.min(0.99,_bpTotalQ/50);
    if(b.id==='quiz100')return Math.min(0.99,_bpTotalQ/100);
    if(b.id==='quiz500')return Math.min(0.99,_bpTotalQ/500);
    if(b.id==='vakken3')return Math.min(0.99,_bpVakCount/3);
    if(b.id==='vakken10')return Math.min(0.99,_bpVakCount/10);
    const _fcN=parseInt(localStorage.getItem('slagio_fc_sessions')||'0');
    if(b.id==='fc_1')return Math.min(0.99,_fcN/1);
    if(b.id==='fc_10')return Math.min(0.99,_fcN/10);
    if(b.id==='fc_50')return Math.min(0.99,_fcN/50);
    const _raceW=parseInt(localStorage.getItem('slagio_race_wins')||'0');
    if(b.id==='race_win1')return Math.min(0.99,_raceW/1);
    if(b.id==='race_win10')return Math.min(0.99,_raceW/10);
    const _perfN=parseInt(localStorage.getItem('slagio_perfect_count')||'0');
    if(b.id==='perfect_3')return Math.min(0.99,_perfN/3);
    if(b.id==='perfect_10')return Math.min(0.99,_perfN/10);
    if(b.id==='perfect_25')return Math.min(0.99,_perfN/25);
    const _planN=parseInt(localStorage.getItem('slagio_plan_tasks')||'0');
    if(b.id==='plan_1')return Math.min(0.99,_planN/1);
    if(b.id==='plan_7')return Math.min(0.99,_planN/7);
    if(b.id==='plan_30')return Math.min(0.99,_planN/30);
    return null;
  }
  const _rarityColors={common:'#6b7280',rare:'#3b82f6',epic:'#8b5cf6',legendary:'#f59e0b',mythic:'#ef4444',eternal:'#06b6d4'};
  const cats=[...new Set(ALL_BADGES.map(b=>b.cat))];
  el.innerHTML=cats.map(cat=>{
    const bs=ALL_BADGES.filter(b=>b.cat===cat);
    return `<div class="prof-badge-cat">
      <div class="prof-badge-cat-title">${cat}</div>
      <div class="prof-badges-grid">
        ${bs.map(b=>{
          const isEarned=!!ach[b.id];
          const isSelected=isEarned&&b.id===selId;
          const dateStr=isEarned?new Date(ach[b.id]).toLocaleDateString('nl-NL',{day:'numeric',month:'short',year:'numeric'}):'';
          const rarityLabel=RARITY_LABEL[b.rarity]||'';
          const tip=isEarned?`${b.tip} · ${dateStr} · ${rarityLabel}${isSelected?' · ✓ op avatar':''}`:b.tip+' · Nog niet behaald';
          const clickAttr=isEarned?`onclick="selectFeaturedBadge('${b.id}')" style="cursor:pointer"`:'';
          // Feature 6: progress bar for unearned badges
          let progHtml='';
          if(!isEarned){
            const prog=_badgeProgress(b);
            if(prog!==null&&prog>0.1){
              const fillPct=Math.round(prog*100);
              const fillColor=_rarityColors[b.rarity]||'var(--or)';
              progHtml=`<div class="badge-prog-wrap"><div class="badge-prog-fill" style="width:${fillPct}%;background:${fillColor}"></div></div><div class="badge-prog-lbl">${fillPct}% compleet</div>`;
            }
          }
          return `<div class="prof-badge-item badge-tooltip" data-tip="${tip}" ${clickAttr}>
            <div class="prof-badge-circle ${isEarned?'earned rarity-'+b.rarity:'unearned'}${isSelected?' selected':''}">${b.emoji}${isSelected?'<span class="badge-selected-check">✓</span>':''}</div>
            <div class="prof-badge-lbl ${isEarned?'earned':''}">${b.label}</div>
            ${isEarned?`<div class="prof-badge-rarity rarity-txt-${b.rarity}">${rarityLabel}</div>`:''}
            ${progHtml}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}
function showAch(emoji,txt,offset){
  if(_achShownSession.has(txt))return;
  _achShownSession.add(txt);
  const top=(offset||130);
  const el=document.createElement('div');
  el.className='achievement-toast';
  el.style.top=top+'px';
  el.innerHTML=`<span class="ach-emoji">${emoji}</span><div class="ach-body"><div class="ach-label">Prestatie behaald!</div><div class="ach-text">${txt}</div></div>`;
  document.body.appendChild(el);
  haptic([35,15,60,15,90]);
  playSound('levelup');
  setTimeout(()=>{el.classList.add('ach-out');setTimeout(()=>el.remove(),450);},3200);
}
function checkComboAch(combo){
  if(combo===3&&earnAch('combo3'))showAch('💥','3 vragen op rij!');
  if(combo===5&&earnAch('combo5'))showAch('🌩️','GOD MODE — 5 op rij!',175);
  if(combo===10&&earnAch('combo10'))showAch('🏅','10 op rij — legendarisch!',220);
}

// ═══════ GELUID ═══════
const SND_KEY='slagio_sound';
let _soundOn=localStorage.getItem(SND_KEY)!=='0';
function toggleSound(){
  _soundOn=!_soundOn;
  localStorage.setItem(SND_KEY,_soundOn?'1':'0');
  const btn=document.getElementById('quiz-snd-btn');
  if(btn)btn.textContent=_soundOn?'🔊':'🔇';
  if(_soundOn)playSound('correct');
}
function playSound(type){
  if(!_soundOn)return;
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const now=ctx.currentTime;
    const FREQS={
      correct:[[523,.0],[659,.08]],
      wrong:[[180,.0]],
      combo:[[523,.0],[659,.06],[784,.12]],
      levelup:[[392,.0],[523,.1],[659,.2],[784,.3]],
      streak:[[523,.0],[523,.1],[659,.2]]
    };
    const seqs=FREQS[type]||FREQS.correct;
    seqs.forEach(([freq,delay])=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.type=type==='wrong'?'square':'sine';
      o.frequency.value=freq;
      const t=now+delay;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(type==='wrong'?.08:.14,t+.02);
      g.gain.exponentialRampToValueAtTime(.001,t+(type==='wrong'?.18:.28));
      o.start(t);o.stop(t+(type==='wrong'?.2:.32));
    });
  }catch(e){}
}
// Initieel geluid-knop instellen
document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.getElementById('quiz-snd-btn');
  if(btn)btn.textContent=_soundOn?'🔊':'🔇';
  spInitPrefs();
  try{renderVandaagWidget();}catch(e){}
  try{renderDecayAlert();}catch(e){}
  try{renderExamAlert();}catch(e){}
});
window.addEventListener('offline',()=>{document.getElementById('offline-banner')?.classList.add('show');});
window.addEventListener('online',()=>{document.getElementById('offline-banner')?.classList.remove('show');});

// ═══════ HAPTIC ═══════
function haptic(pat){try{if(navigator.vibrate)navigator.vibrate(pat);}catch(e){}}

// ═══════ BUTTON RIPPLE ═══════
document.addEventListener('click',function(e){
  const el=e.target.closest('button,.opt,.card,.daily-card,.qmcd,.hm-ql-btn');
  if(!el||el.disabled)return;
  // Zorg dat het element relatief gepositioneerd is voor ripple
  const pos=getComputedStyle(el).position;
  if(pos==='static')el.style.position='relative';
  el.style.overflow='hidden';
  const r=el.getBoundingClientRect();
  const size=Math.max(r.width,r.height)*2;
  const rip=document.createElement('span');
  rip.className='btn-ripple';
  rip.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
  el.appendChild(rip);
  setTimeout(()=>rip.remove(),600);
},{passive:true});

// ═══════ QUIZ VERLATEN (exit interstitial) ═══════
function stopQ(){
  clearInterval(ST.timer);
  // Toon bevestigingsdialoog alleen als quiz bezig is
  if(ST.vragen&&ST.vragen.length>0&&ST.idx>0&&ST.idx<ST.vragen.length){
    _showQuitDialog();
  }else{
    _surgeActive=false;_surgeLeft=0;_removeSurgeBadge();
    show('sc-detail');
  }
}
function _showQuitDialog(){
  const tot=ST.idx;const sc=ST.score;
  const pct=tot>0?Math.round(sc/tot*100):0;
  const combo=ST.combo||0;
  const xpSoFar=ST.xpThisRound||0;
  const overlay=document.createElement('div');
  overlay.className='quit-overlay';
  overlay.innerHTML=`<div class="quit-card">
    <div style="font-size:36px;margin-bottom:8px">⚠️</div>
    <h3 style="font-family:var(--font-head);font-size:20px;font-weight:900;color:var(--dk);margin-bottom:6px">Quiz stoppen?</h3>
    <p style="font-size:13px;color:var(--mu);margin-bottom:14px;line-height:1.5">Je hebt ${tot} van de ${ST.vragen.length} vragen beantwoord.</p>
    <div class="quit-progress-row">
      <div class="quit-stat"><div class="quit-stat-val">${pct}%</div><div class="quit-stat-lbl">Score</div></div>
      <div class="quit-stat"><div class="quit-stat-val">${tot}/${ST.vragen.length}</div><div class="quit-stat-lbl">Vragen</div></div>
      ${xpSoFar>0?`<div class="quit-stat"><div class="quit-stat-val">+${xpSoFar}</div><div class="quit-stat-lbl">XP gewonnen</div></div>`:''}
    </div>
    ${combo>=2?`<div class="quit-combo-warn">🔥 Je verliest je ${combo}× combo als je stopt!</div>`:''}
    <div style="display:flex;gap:10px">
      <button onclick="try{_flushQBatch();trackEvent('quiz_abandoned',{vak:ST.vak?.naam,vak_id:ST.vak?.id,domein_id:ST.domein?.id,mode:ST.mode,gestopt_bij:ST.idx,totaal:ST.vragen?.length,score_zo_ver:ST.score});}catch(e){}this.closest('.quit-overlay').remove();_surgeActive=false;_surgeLeft=0;_removeSurgeBadge();show('sc-detail')" style="flex:1;padding:13px;background:var(--s);border:1px solid var(--bo);border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;color:var(--mu);font-family:var(--font)">Stoppen</button>
      <button onclick="this.closest('.quit-overlay').remove();if(ST.mode==='snel'&&ST.tijd>0)startTimer(ST.tijd)" style="flex:2;padding:13px;background:var(--or);border:none;border-radius:12px;font-size:15px;font-weight:900;cursor:pointer;color:#fff;font-family:var(--font)">Doorgaan 🔥</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  haptic([30]);
}

// ═══════ RESULTS ═══════
function toonRes(){
  clearInterval(ST.timer);
  clearQuizDraft();
  setHotStreak(0);
  _wrongStreak=0;_luckyActive=false;
  _surgeActive=false;_surgeLeft=0;_removeSurgeBadge();
  const tot=ST.vragen.length;
  const sc=Math.round(ST.score*10)/10;
  const pct=sc/tot;
  // Save progress & streak
  let _recordResult=null;
  try{_recordResult=saveProgress(ST.vak.id,ST.domein.id,ST.mode,sc,tot);}catch(e){}
  try{recordPractice();}catch(e){}
  // Track quiz voltooid
  try{_flushQBatch();trackEvent('quiz_completed',{vak:ST.vak?.naam,vak_id:ST.vak?.id,domein_id:ST.domein?.id,mode:ST.mode,score:sc,totaal:tot,pct:Math.round(pct*100)});}catch(e){}
  // Feature 2: PB tracking
  window._newPB=false;window._oldPB=null;
  try{const _pbRes=savePB(ST.vak.id,ST.domein.id,pct);if(_pbRes.isNew){window._newPB=true;window._oldPB=_pbRes.prev?_pbRes.prev.score:null;}}catch(e){}
  // Rebuild grid and streak to update UI
  try{const g=document.getElementById('vakgrid');if(g){g.innerHTML='';buildGrid();}
  renderStreak();renderFavHome();renderXPHome();renderDailyChallenge();renderDailyGoal();renderLiveCount();renderHomeStats();renderGreeting();try{renderComebackCard();}catch(e){}try{renderFeatDisc();}catch(e){}try{renderHmQuickChips();renderHmStatsStrip();renderDecayAlert();renderExamAlert();}catch(e){}try{renderVandaagWidget();}catch(e){}showDailyChallengePopup();}catch(e){}
  try{recordDailyGoal();}catch(e){};
  const isPerfect=pct===1&&ST.mode==='snel'&&tot>=3;
  if(isPerfect&&earnAch('perfect'))setTimeout(()=>showAch('🌟','Perfecte score! Geen enkel fout!',90),800);
  if(isPerfect)checkPerfectCountAch();
  try{
    let emi,tit,sub;
    if(isPerfect){emi='🌟';tit='Perfecte score!';sub='Fenomenaal! Alles goed — jij bent klaar voor het CE!';}
    else if(pct>=0.9){emi='🏆';tit='Uitstekend!';sub='Je beheerst dit domein helemaal goed.';}
    else if(pct>=0.7){emi='🎉';tit='Goed gedaan!';sub='Je snapt het meeste — kleine herhaling loont.';}
    else if(pct>=0.5){emi='📖';tit='Aardig begin';sub='De basis zit erin. Oefen dit domein nog eens.';}
    else{emi='💪';tit='Blijven oefenen!';sub='Dit domein verdient meer aandacht.';}
    if(isPerfect)setTimeout(()=>launchConfetti('gold'),400);
    else if(pct>=0.9)setTimeout(()=>launchConfetti(),600);
    document.getElementById('remi').textContent=emi;
    document.getElementById('rtit').textContent=tit;
    document.getElementById('rsub').textContent=sub;
    document.getElementById('rnum').textContent=sc;
    document.getElementById('rden').textContent=`van ${tot}`;
    const circ=2*Math.PI*50;
    setTimeout(()=>{const c=document.getElementById('scirc');if(c){c.style.strokeDashoffset=circ*(1-pct);c.style.transition='stroke-dashoffset 1s ease';}},200);
    let bdHtml='';
    if(ST.mode==='snel'){
      const goed=ST.antwrd.filter(a=>a.pts===1).length;
      const fout=ST.antwrd.filter(a=>a.pts===0).length;
      const lbScoreDisplay=ST.antwrd.reduce((sum,a)=>sum+a.pts*50+Math.round((a.tijdOver||0)/20*50),0);
      const maxLbScore=tot*100;
      bdHtml=`<div class="rbr"><span>✓ Correct</span><span class="rbc">${goed} / ${tot}</span></div>
        <div class="rbr"><span>✗ Fout of tijd op</span><span class="rbw">${fout}</span></div>
        <div class="rbr"><span>Nauwkeurigheid</span><span style="font-weight:600;color:var(--or)">${Math.round(pct*100)}%</span></div>
        <div class="rbr res-lb-row"><span>🏆 Leaderboardscore</span><span class="res-lb-val">${lbScoreDisplay} <span class="res-lb-max">/ ${maxLbScore}</span></span></div>`;
    } else {
      const goed=ST.antwrd.filter(a=>a.pts===1).length;
      const deels=ST.antwrd.filter(a=>a.pts===0.5).length;
      const fout=ST.antwrd.filter(a=>a.pts===0).length;
      bdHtml=`<div class="rbr"><span>✓ Goed</span><span class="rbc">${goed}</span></div>
        <div class="rbr"><span>~ Deels goed</span><span style="color:#FCD34D;font-weight:600">${deels}</span></div>
        <div class="rbr"><span>✗ Fout</span><span class="rbw">${fout}</span></div>
        <div class="rbr"><span>Totaalscore</span><span style="font-weight:600;color:var(--or)">${sc} / ${tot} punten</span></div>`;
    }
    const rbdEl=document.getElementById('rbd');
    if(rbdEl)rbdEl.innerHTML=bdHtml;
    // Share card — laat zien bij ≥50%, competitief frame
    if(rbdEl&&pct>=0.5){
      const shareCard=document.createElement('div');
      shareCard.id='share-score-card';
      const pctNum=Math.round(pct*100);
      const emoji=pct>=1?'🌟':pct>=0.9?'🔥':pct>=0.8?'🎯':pct>=0.7?'✅':'💪';
      const msg=pct>=1?'Perfecte score!':pct>=0.9?'Bijna perfect!':pct>=0.8?'Super gedaan!':pct>=0.7?'Goed bezig!':'Kun jij het beter?';
      const cta=pct>=0.8?'Stuur dit naar je klas 👇':'Daag je klas uit 👇';
      shareCard.innerHTML=`<div style="background:linear-gradient(135deg,rgba(var(--or-rgb),.15),rgba(var(--or-rgb),.06));border:1px solid rgba(var(--or-rgb),.35);border-radius:16px;padding:16px 18px;margin:14px 0 6px;text-align:center">
        <div style="font-size:28px;margin-bottom:4px">${emoji}</div>
        <div style="font-size:18px;font-weight:900;color:var(--or);margin-bottom:2px">${pctNum}%</div>
        <div style="font-size:13px;font-weight:700;color:var(--dk);margin-bottom:2px">${msg}</div>
        <div style="font-size:12px;color:var(--mu);margin-bottom:12px">${cta}</div>
        <button onclick="deelScore()" style="background:var(--or);color:#fff;border:none;border-radius:12px;padding:11px 24px;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font);width:100%;display:flex;align-items:center;justify-content:center;gap:8px"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>Deel met je klas</button>
      </div>`;
      rbdEl.insertAdjacentElement('afterend',shareCard);
    }
    // Near-miss nudge
    const missedCount=tot-Math.round(sc);
    if(rbdEl&&pct>=0.8&&pct<1&&tot>=4&&missedCount<=2){
      const nm=document.createElement('div');
      nm.className='nearmiss-nudge';
      nm.innerHTML=`<span>Bijna! Nog maar ${missedCount} ${missedCount===1?'fout':'fouten'}...</span><button onclick="retryQ()">Doe het opnieuw →</button>`;
      rbdEl.insertAdjacentElement('afterend',nm);
    }
    // Persoonlijk record banner
    if(rbdEl&&_recordResult&&_recordResult.isNewRecord&&sc>0){
      const prevPct=_recordResult.prevBest>0?Math.round(_recordResult.prevBest/_recordResult.total*100):null;
      const newPct=Math.round(sc/tot*100);
      const rec=document.createElement('div');
      rec.className='record-banner';
      rec.innerHTML=`🏆 Nieuw persoonlijk record! ${prevPct!==null?prevPct+'% → ':''}<strong>${newPct}%</strong>`;
      rbdEl.insertAdjacentElement('afterend',rec);
      setTimeout(()=>{playSound('levelup');haptic([40,20,80,20,120]);},300);
      if(earnAch('record1'))setTimeout(()=>showAch('🏆','Je eerste persoonlijk record!'),600);
    }
    // Feature 2: PB banner (for new PB from savePB)
    if(window._newPB){
      const pbEl=document.createElement('div');
      pbEl.className='pb-banner';
      const oldPctStr=window._oldPB!==null?`<div class="pb-prev">Vorige record: ${Math.round(window._oldPB*100)}% → nu ${Math.round(pct*100)}%</div>`:'';
      pbEl.innerHTML=`🏆 Nieuw persoonlijk record!${oldPctStr}`;
      const anchor=document.getElementById('rbd');
      if(anchor)anchor.insertAdjacentElement('afterend',pbEl);
    }
    // Feature 3: Smart next action
    try{
      const naEl=document.getElementById('quiz-next-action');
      if(naEl&&ST.vak&&ST.domein){
        const na=getSmartNextAction(ST.vak.id,ST.domein.id,pct);
        if(na){
          let btnAttr='';
          if(na.type==='retry')btnAttr=`onclick="retryQ()"`;
          else if(na.type==='domain')btnAttr=`onclick="openVak('${ST.vak.id}');setTimeout(()=>{const el=document.querySelector('[data-domein-id=\\'${na.domeinId}\\']');if(el)el.scrollIntoView({behavior:'smooth'});},300)"`;
          else if(na.type==='simtoets')btnAttr=`onclick="openVak('${ST.vak.id}')"`;
          naEl.innerHTML=`<div class="next-action-card">
            <div class="na-icon">${na.icon}</div>
            <div class="na-info"><div class="na-label">${na.label}</div><div class="na-sub">${na.sub}</div></div>
            <button class="na-btn" ${btnAttr}>Ga →</button>
          </div>`;
        }
      }
    }catch(e){}
    // Show "next domain" button if there's a next domain
    try{
      const _ndb=document.getElementById('res-next-dom');
      if(_ndb&&ST.vak&&ST.domein){
        const _doms=ST.vak.domeinen;
        const _idx=_doms.findIndex(d=>d.id===ST.domein.id);
        const _next=_doms[_idx+1];
        if(_next){_ndb.textContent=`→ Volgend: Domein ${_next.id} — ${_next.naam}`;_ndb.style.display='block';}
        else _ndb.style.display='none';
      }
    }catch(e){}
  }catch(e){console.warn('toonRes display error:',e);}
  // XP reward
  try{
    const xpEl=document.getElementById('res-xp-card');
    if(xpEl)xpEl.remove();
    if(ST.mode==='snel'&&ST.xpThisRound>0){
      if(isPerfect)ST.xpThisRound=Math.round(ST.xpThisRound*1.5);
      const res=addXP(ST.xpThisRound);
      const xpPct=getXPPct(res.totalXP);
      const lvlName=LEVEL_NAMES[res.newLvl]||'Level '+res.newLvl;
      const curXP=getXPForLevel(res.newLvl);
      const nxtXP=getXPForLevel(res.newLvl+1)||curXP+1000;
      const card=document.createElement('div');
      card.id='res-xp-card';card.className='res-xp';
      // Build avatar section
      const _rp=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
      const _ra=_rp.animalId?getAnimalById(_rp.animalId):null;
      const _rsi=getAnimalStageIdx(res.totalXP);
      const _rsn=_ra&&_ra.lbl?_ra.lbl[_rsi]:ANIM_STAGE_NAMES[_rsi];
      const _rav=_ra?getAnimalDisplay(_ra.id,_rsi,52):`<span style="font-size:38px">⭐</span>`;
      // Mini journey (5 dots + connecting lines)
      let _rj='';
      for(let _ri=0;_ri<5;_ri++){
        const _rdone=_ri<_rsi,_rcur=_ri===_rsi;
        const _rdot=_ra&&(_rdone||_rcur)?getAnimalDisplay(_ra.id,_ri,_rcur?24:18):(_rdone||_rcur?`<span style="font-size:${_rcur?24:18}px">${_ra?(_ra.s[_ri]||'⭐'):'⭐'}</span>`:`<span style="font-size:15px;opacity:.22;filter:grayscale(1)">❓</span>`);
        _rj+=`<div class="res-xp-jdot">${_rdot}</div>`;
        if(_ri<4)_rj+=`<div class="res-xp-jline${_rdone?' done':''}"></div>`;
      }
      card.innerHTML=`
        <div class="res-xp-avatar-wrap">
          <div class="res-xp-avatar-ring">${_rav}</div>
          <div class="res-xp-avatar-lbl">${_ra?_ra.n:'Avatar'} · ${_rsn}</div>
        </div>
        <div class="res-xp-num">+${res.added} XP</div>
        <div class="res-xp-sub">${ST.isDailyChallenge?'⚡ Dagelijkse uitdaging bonus':''}&nbsp;</div>
        <div class="res-xp-lvl">Level ${res.newLvl} — ${lvlName} · ${res.totalXP-curXP} / ${nxtXP-curXP} XP</div>
        <div class="xp-bar-wrap"><div class="xp-bar" style="width:${xpPct}%"></div></div>
        <div class="res-xp-journey-mini">${_rj}</div>
        ${res.leveled?`<div class="levelup-banner">🎉 Level up! Je bent nu level ${res.newLvl} — ${lvlName}!</div>`:''}
        ${isPerfect?`<div class="perfect-banner">🌟 Perfecte score! +50% XP bonus verdiend!</div>`:''}`;
      const rbdEl2=document.getElementById('rbd');
      if(rbdEl2)rbdEl2.insertAdjacentElement('afterend',card);
      if(res.leveled){setTimeout(()=>launchConfetti(),300);setTimeout(()=>playSound('levelup'),400);haptic([50,30,80,30,120]);}
      setTimeout(()=>floatXP(res.added),150);
      // Level teaser — als dichtbij volgend level
      try{
        const xpToNext=nxtXP-res.totalXP;
        if(!res.leveled&&xpToNext<150){
          const tPct=Math.round((res.totalXP-curXP)/(nxtXP-curXP)*100);
          const tsr=document.createElement('div');tsr.className='lvl-teaser';
          tsr.innerHTML=`<div style="font-size:22px">⭐</div><div class="lvl-teaser-bar"><div class="lvl-teaser-lbl">Nog <strong>${xpToNext} XP</strong> voor level ${res.newLvl+1} — ${LEVEL_NAMES[res.newLvl+1]||'Level '+(res.newLvl+1)}</div><div class="lvl-teaser-fill"><div class="lvl-teaser-fill-inner" style="width:0%" data-target="${tPct}"></div></div></div>`;
          card.appendChild(tsr);
          setTimeout(()=>{const fill=tsr.querySelector('.lvl-teaser-fill-inner');if(fill)fill.style.width=fill.dataset.target+'%';},200);
        }
      }catch(e){}
      syncAvatarToProfile();
      updateProfileNav();
      if(res.evolved){
        const _p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
        if(_p.animalId){
          setTimeout(()=>launchConfetti('gold'),600);
          setTimeout(()=>showEvoReveal(res.newStage,_p.animalId),900);
        }
      }
      if(ST.isDailyChallenge){
        try{const _k=_dcLevelKey();const dc=JSON.parse(localStorage.getItem(_k)||'{}');dc.done=true;localStorage.setItem(_k,JSON.stringify(dc));}catch(e){}
        ST.isDailyChallenge=false;
      }
    }
  }catch(e){console.warn('toonRes XP error:',e);}
  // Leaderboard
  try{
    const lbBtn=document.getElementById('lb-res-btn');
    const _regPrompt=document.getElementById('res-register-prompt');
    if(ST.mode==='snel'){
      const goed=ST.antwrd.filter(a=>a.pts===1).length;
      const tijden=ST.tijdPerVraag||[];
      const totalTijd=tijden.reduce((a,b)=>a+b,0);
      const lbScore=ST.antwrd.reduce((sum,a)=>sum+a.pts*50+Math.round((a.tijdOver||0)/20*50),0);
      const avgTijd=tijden.length?Math.round(totalTijd/tijden.length*10)/10:0;
      const prof=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
      const naam=prof.naam||'Anoniem';
      const avatar=getMyCurrentAvatar()||'🐻';
      const animalId=prof.animalId||null;
      const stageIdx=animalId?getAnimalStageIdx(getTotalXP()):0;
      const _ach=getAchieved();
      const featuredBadgeId=getBestBadgeId(_ach)||null;
      const badgeIds=Object.keys(_ach).filter(k=>_ach[k]);
      const entry={naam,avatar,animalId,stageIdx,featuredBadgeId,badgeIds,vak:ST.vak.id,vakNaam:ST.vak.naam,domeinId:ST.domein.id,domeinNaam:ST.domein.naam,score:lbScore,goed,tot,avgTijd,date:new Date().toISOString().slice(0,10)};
      saveLeaderboardEntry(entry);
      if(lbBtn)lbBtn.style.display='block';
      if(_regPrompt)_regPrompt.style.display=currentUser?'none':'block';
    } else {
      if(lbBtn)lbBtn.style.display='none';
      if(_regPrompt)_regPrompt.style.display='none';
    }
  }catch(e){console.warn('toonRes LB error:',e);}
  // "Eén meer quiz" suggestie
  try{
    const omBox=document.getElementById('one-more-wrap');
    if(omBox&&ST.mode==='snel'&&ST.vak){
      const domeinen=ST.vak.domeinen||[];
      const score=ST.score/ST.vragen.length;
      // Als score <80%: opnieuw hetzelfde domein, anders: volgend domein
      let sugDomein=null,sugLabel='';
      if(score<0.8){
        sugDomein=ST.domein;sugLabel='📖 Herhalen';
      }else{
        const cur=domeinen.findIndex(d=>d.id===ST.domein.id);
        const nxt=domeinen.slice(cur+1).find(d=>d.sv&&d.sv.length);
        if(nxt){sugDomein=nxt;sugLabel='➡️ Volgende domein';}
      }
      if(sugDomein){
        omBox.innerHTML=`<div class="one-more-card" onclick="ST.vak=ST.vak;ST.domein=ST.vak.domeinen.find(d=>d.id==='${sugDomein.id}');startQ('snel')">
          <div class="one-more-tag">${sugLabel}</div>
          <div class="one-more-title">${sugDomein.naam}</div>
          <div class="one-more-sub">${ST.vak.naam} · Snelle Quiz · ${sugDomein.sv?sugDomein.sv.length:0} vragen</div>
          <div class="one-more-cta">Starten →</div>
        </div>`;
      }else{omBox.innerHTML='';}
    }
  }catch(e){if(document.getElementById('one-more-wrap'))document.getElementById('one-more-wrap').innerHTML='';}
  try{renderAdaptiveResults();}catch(e){}
  try{renderChallengeResult();}catch(e){}
  show('sc-res');
  if(ST.mode==='snel')setTimeout(()=>showFeedbackPopup('snel'),2500);
}

function retryQ(){startQ(ST.mode);}
function switchMode(){show('sc-qmode');}
function nextDomeinQ(){
  const doms=ST.vak?.domeinen;
  if(!doms){show('sc-detail');return;}
  const idx=doms.findIndex(d=>d.id===ST.domein?.id);
  const next=doms[idx+1];
  if(next){ST.domein=next;startQ(ST.mode||'snel');}
  else show('sc-detail');
}
function openLastVakCE(){
  const vak=ST.vak||getVK()[0];
  if(!vak)return;
  openVak(vak.id);
  setTimeout(()=>{
    const card=document.querySelector('.ce-archief-card');
    if(card){card.classList.add('open');card.scrollIntoView({behavior:'smooth',block:'center'});}
  },400);
}
function openLastVakRace(){
  const vak=ST.vak||getVK()[0];
  if(!vak)return;
  ST.vak=vak;
  if(!ST.domein||ST.domein.vakId!==vak.id)ST.domein=vak.domeinen[0];
  show('sc-qmode');
  setTimeout(()=>{
    document.getElementById('qmode-race-section')?.scrollIntoView({behavior:'smooth',block:'center'});
  },200);
}
function scrollToCeArchief(){
  const card=document.querySelector('.ce-archief-card');
  if(card){card.classList.add('open');card.scrollIntoView({behavior:'smooth',block:'center'});}
}
function renderHmQuickChips(){
  const wrap=document.getElementById('hm-quick-scroll');
  if(!wrap)return;
  const vak=ST.vak||null;
  const vakNaam=vak?.naam||null;
  const chips=[
    {icon:'📅',label:'Studieplan',fn:()=>show('sc-schedule')},
    {icon:'📊',label:'Voortgang',fn:()=>openRapport()},
    {icon:'📋',label:'Actieplan',fn:()=>{show('sc-calc');setTimeout(()=>switchCalc('plan'),100);}},
    vakNaam
      ?{icon:'📄',label:`${vakNaam} examens`,fn:()=>openLastVakCE()}
      :{icon:'📄',label:'CE-examens',fn:()=>show('sc-schedule')},
    vakNaam
      ?{icon:'🏁',label:`Race — ${vakNaam}`,fn:()=>openLastVakRace()}
      :{icon:'🏁',label:'Bot Race',fn:()=>show('sc-home')},
    {icon:'🏅',label:'Badges',fn:()=>openProfiel()},
  ];
  wrap.innerHTML='';
  chips.forEach(c=>{
    const btn=document.createElement('button');
    btn.className='hm-qchip';
    btn.textContent=`${c.icon} ${c.label}`;
    btn.addEventListener('click',c.fn);
    wrap.appendChild(btn);
  });
}
function renderHmStatsStrip(){
  const wrap=document.getElementById('hm-stats-strip-wrap');
  if(!wrap)return;
  const streak=calcStreak()?.current||0;
  const ach=getAchieved();
  const earned=ALL_BADGES.filter(b=>ach[b.id]).length;
  let vakCount=0;
  try{const ph=JSON.parse(localStorage.getItem('examenapp_progress_havo')||'{}');const pv=JSON.parse(localStorage.getItem('examenapp_progress_vwo')||'{}');vakCount=new Set([...Object.keys(ph),...Object.keys(pv)].map(k=>k.split('_')[0])).size;}catch(e){}
  const totalQ=getStreak().totalQuizzes||0;
  let xpToday=0;try{const s=JSON.parse(localStorage.getItem('slagio_xp_today')||'{}');if(s.d===new Date().toISOString().slice(0,10))xpToday=s.x||0;}catch(e){}
  const pills=[
    streak>0?`<span class="hm-stat-pill" onclick="openProfiel()" title="Dagelijkse streak">🔥 ${streak} dag${streak===1?'':'en'}</span>`:'',
    earned>0?`<span class="hm-stat-pill" onclick="openProfiel()" title="Behaalde badges">🏅 ${earned} badge${earned===1?'':'s'}</span>`:'',
    vakCount>0?`<span class="hm-stat-pill" onclick="openProfiel()" title="Actieve vakken">📚 ${vakCount} vak${vakCount===1?'':'ken'}</span>`:'',
    totalQ>0?`<span class="hm-stat-pill" onclick="openProfiel()" title="Totaal quizzen">⚡ ${totalQ} quiz${totalQ===1?'':'zen'}</span>`:'',
    xpToday>0?`<span class="hm-stat-pill" onclick="openProfiel()" title="XP vandaag verdiend">✨ +${xpToday} XP vandaag</span>`:'',
  ].filter(Boolean);
  wrap.innerHTML=pills.length?`<div class="hm-stats-strip">${pills.join('')}</div>`:'';
}
function renderExamAlert(){
  const el=document.getElementById('hm-exam-alert');
  if(!el)return;
  const mijn=getMijnVakken();
  const today=new Date();today.setHours(0,0,0,0);
  const imminent=EXAM_SCHEDULE.filter(e=>{
    if(!e.vakId||(mijn.length>0&&!mijn.includes(e.vakId)))return false;
    const d=new Date(e.datum);d.setHours(0,0,0,0);
    const days=Math.round((d-today)/864e5);
    return days>=0&&days<=2;
  }).sort((a,b)=>new Date(a.datum)-new Date(b.datum));
  if(!imminent.length){el.innerHTML='';return;}
  const MN=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  const items=imminent.map(e=>{
    const d=new Date(e.datum);d.setHours(0,0,0,0);
    const days=Math.round((d-today)/864e5);
    const when=days===0?'Vandaag!':days===1?'Morgen':'Overmorgen';
    const urgColor=days===0?'#ef4444':days===1?'#f97316':'#facc15';
    return`<div style="display:flex;align-items:center;gap:10px;padding:9px 14px;background:${urgColor}14;border-radius:11px;border:1px solid ${urgColor}35">
      <span style="font-size:20px">🎓</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:700;color:var(--dk);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${e.vak}</div>
        <div style="font-size:11px;color:var(--mu)">${d.getDate()} ${MN[d.getMonth()]} · ${e.tijd}</div>
      </div>
      <span style="font-size:12px;font-weight:800;color:${urgColor};white-space:nowrap;flex-shrink:0">${when}</span>
    </div>`;
  }).join('');
  el.innerHTML=`<div style="margin-bottom:14px;display:flex;flex-direction:column;gap:6px">
    <div style="font-size:12px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px">⏰ Aankomend examen</div>
    ${items}
  </div>`;
}
function renderDecayAlert(){
  const wrap=document.getElementById('hm-decay-alert');
  if(!wrap)return;
  const stale=[];
  getVK().forEach(vak=>{
    (vak.domeinen||[]).forEach(dom=>{
      const r=getDomeinBestPct(vak.id,dom.id);
      if(!r.hasData)return;
      const decay=getDecayStatus(vak.id,dom.id);
      if(!decay||decay.label==='Vandaag geoefend')return;
      const days=Math.floor((Date.now()-getDecay()[`${vak.id}_${dom.id}`])/(864e5));
      if(days<7)return;
      stale.push({vakId:vak.id,vakNaam:vak.naam,domId:dom.id,domNaam:dom.naam,days,color:decay.color,pct:r.pct});
    });
  });
  if(!stale.length){wrap.innerHTML='';return;}
  stale.sort((a,b)=>b.days-a.days);
  const top=stale.slice(0,4);
  const chips=top.map(s=>`<button class="hm-decay-chip" style="background:${s.color}18;border-color:${s.color}40;color:${s.color}" onclick="goToDomein('${s.vakId}','${s.domId}','snel')">
    <span style="width:7px;height:7px;border-radius:50%;background:${s.color};flex-shrink:0;display:inline-block"></span>
    ${s.vakNaam} · ${s.domNaam} <span style="opacity:.7;font-weight:600">${s.days}d</span>
  </button>`).join('');
  const extra=stale.length>4?`<span style="font-size:11px;color:var(--mu);align-self:center">+${stale.length-4} meer</span>`:'';
  wrap.innerHTML=`<div class="hm-decay-card">
    <div class="hm-decay-header">
      <div class="hm-decay-title">🔁 Opfrissen aanbevolen</div>
      <span style="font-size:11px;color:var(--mu)">${stale.length} domein${stale.length===1?'':'en'}</span>
    </div>
    <div class="hm-decay-chips">${chips}${extra}</div>
  </div>`;
}
async function deelScore(){
  const vakNaam=ST.vak?.naam||'een vak';
  const score=document.getElementById('rnum')?.textContent||'?';
  const total=document.getElementById('rden')?.textContent||'';
  const pctRaw=total?Math.round(parseInt(score)/parseInt(total.replace('/',''))*100):null;
  const pctTxt=pctRaw?` (${pctRaw}%)`:'';
  const modeTxt={snel:'snelle quiz',oud:'open vragen',fc:'flashcards',race:'Bot Race'}[ST.mode]||'quiz';
  const tekst=`${pctRaw>=90?'🌟':pctRaw>=70?'🔥':'💪'} ${score}${total}${pctTxt} op ${vakNaam} ${modeTxt} — kun jij het beter?\nGratis oefenen op slagio.nl`;
  if(navigator.share){
    try{
      await navigator.share({title:'Slagio — Mijn score',text:tekst,url:'https://slagio.nl'});
      if(earnAch('ambassadeur'))setTimeout(()=>showAch('📣','Ambassadeur! Score gedeeld.'),500);
    }catch(e){}
  }else{
    try{await navigator.clipboard.writeText(tekst);showToast('📋 Score gekopieerd naar klembord!');}
    catch(e){showToast('slagio.nl');}
    if(earnAch('ambassadeur'))setTimeout(()=>showAch('📣','Ambassadeur! Score gedeeld.'),500);
  }
}

