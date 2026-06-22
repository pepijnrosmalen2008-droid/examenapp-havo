// ═══════ XP & LEVELS ═══════
const XP_KEY='slagio_xp';
const XP_LEVELS=[0,100,500,2000,7500,30000,75000,200000];
const LEVEL_NAMES=['','Baby','Jong','Tiener','Volwassen','Prime','Goud','Diamant','Platina'];
// ═══════ RIPPLE EFFECT ═══════
(function initRipple(){
  document.addEventListener('click',function(e){
    const target=e.target.closest('button,.opt,.card,.wlc-card,.hm-ql-btn,.lb-filter-btn');
    if(!target)return;
    const r=target.getBoundingClientRect();
    const size=Math.max(r.width,r.height)*1.6;
    const x=e.clientX-r.left-size/2;
    const y=e.clientY-r.top-size/2;
    const wave=document.createElement('span');
    wave.className='ripple-wave';
    const isDark=target.classList.contains('opt')||target.classList.contains('wlc-card');
    wave.style.cssText='width:'+size+'px;height:'+size+'px;left:'+x+'px;top:'+y+'px;background:'+(isDark?'rgba(255,255,255,.22)':'rgba(0,0,0,.08)');
    // Ensure target is positioned
    const pos=getComputedStyle(target).position;
    if(pos==='static')target.style.position='relative';
    target.style.overflow='hidden';
    target.appendChild(wave);
    setTimeout(()=>wave.remove(),700);
  });
})();

// ═══════ 3D CARD TILT ═══════
function addTiltToCards(){
  document.querySelectorAll('#vakgrid .card').forEach(card=>{
    card.addEventListener('mousemove',function(e){
      const r=this.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      this.style.transform='perspective(700px) rotateY('+x*9+'deg) rotateX('+-y*9+'deg) translateY(-6px) scale(1.02)';
      this.style.transition='box-shadow .2s';
    });
    card.addEventListener('mouseleave',function(){
      this.style.transform='';
      this.style.transition='transform .55s cubic-bezier(.22,1,.36,1),box-shadow .35s';
    });
  });
}

// ═══════ LIVE STUDENT COUNTER ═══════
function getLiveCount(){
  const h=new Date().getHours();
  const day=new Date().getDay();
  const weekday=day>=1&&day<=5;
  let base;
  if(h>=16&&h<=22)base=weekday?54:38;
  else if(h>=9&&h<=16)base=weekday?33:20;
  else if(h>=7&&h<=9)base=weekday?24:14;
  else base=weekday?9:6;
  return base+Math.floor(Math.random()*11);
}
function animateNum(el,target){
  const start=parseInt(el.textContent)||0;
  const diff=target-start;
  const dur=600;
  const t0=performance.now();
  (function step(now){
    const p=Math.min(1,(now-t0)/dur);
    const ease=1-Math.pow(1-p,3);
    el.textContent=Math.round(start+diff*ease);
    if(p<1)requestAnimationFrame(step);
  })(performance.now());
}
function renderLiveCount(){
  const box=document.getElementById('live-count-home');
  if(!box)return;
  const n=getLiveCount();
  if(!box.innerHTML){
    box.innerHTML='<div class="live-count-wrap"><span class="live-dot"></span><span class="live-num" id="live-num">'+n+'</span><span class="live-sep">·</span><span>leerlingen oefenen nu</span><span class="live-sub">🟢 Live</span></div>';
  } else {
    const el=document.getElementById('live-num');
    if(el){el.style.opacity='0';setTimeout(()=>{el.style.opacity='1';animateNum(el,n);},220);}
  }
}
setInterval(renderLiveCount,32000);

// ═══════ CONFETTI ═══════
function launchConfetti(type){
  type=type||'normal';
  const canvas=document.createElement('canvas');
  canvas.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9990';
  document.body.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  canvas.width=innerWidth;canvas.height=innerHeight;
  const colors=type==='gold'?['#f59e0b','#fbbf24','#fcd34d','#fff','#E85C0D']:['#E85C0D','#6366f1','#22c55e','#ec4899','#f59e0b','#60a5fa','#a78bfa'];
  const count=type==='gold'?130:90;
  const pieces=[];
  for(let i=0;i<count;i++){
    pieces.push({x:Math.random()*innerWidth,y:type==='gold'?Math.random()*innerHeight*.3:Math.random()*-innerHeight*.4,
      w:Math.random()*10+4,h:Math.random()*6+3,r:Math.random()*Math.PI*2,rd:(Math.random()-.5)*.3,
      vx:Math.random()*6-3,vy:Math.random()*4+1.5,color:colors[Math.floor(Math.random()*colors.length)],alpha:1});
  }
  let fr;
  (function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let alive=false;
    pieces.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.r+=p.rd;p.vy+=.07;p.alpha-=.006;
      if(p.alpha>0&&p.y<canvas.height+20){alive=true;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.globalAlpha=Math.max(0,p.alpha);ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();}
    });
    if(alive)fr=requestAnimationFrame(draw);else canvas.remove();
  })();
  setTimeout(()=>{cancelAnimationFrame(fr);canvas.remove();},6000);
}

// ═══════ FLOATING XP ═══════
function floatXP(amount,refEl){
  const el=refEl||document.getElementById('qfb');
  if(!el)return;
  const r=el.getBoundingClientRect();
  const div=document.createElement('div');
  div.className='xp-float';
  div.textContent='+'+amount+' XP';
  div.style.left=(r.left+r.width/2)+'px';
  div.style.top=(r.top+10)+'px';
  document.body.appendChild(div);
  setTimeout(()=>div.remove(),900);
}

// ═══════ TOAST ═══════
function getMyCurrentAvatar(){
  try{
    const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    if(p.animalId)return getAnimalEmoji(p.animalId,getTotalXP());
    return p.avatar||'🐾';
  }catch(e){return '🐾';}
}
function getMyCurrentAvatarHtml(size){
  size=size||28;
  try{
    const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    if(p.animalId)return getAnimalDisplay(p.animalId,getAnimalStageIdx(getTotalXP()),size);
    return`<span style="font-size:${size}px;line-height:1">${p.avatar||'🐾'}</span>`;
  }catch(e){return`<span style="font-size:${size}px">🐾</span>`;}
}
function getLbAvatarHtml(e,size){
  size=size||28;
  if(e&&e.animalId){return getAnimalDisplay(e.animalId,e.stageIdx!=null?e.stageIdx:0,size);}
  return`<span style="font-size:${size}px;line-height:1">${e&&e.avatar?e.avatar:'🐻'}</span>`;
}
// Prioriteitsvolgorde voor "beste badge" display
const BADGE_PRIORITY=['streak100','streak30','streak14','streak7','quiz500','quiz100','combo10','perfect','streak3','quiz50','combo5','vakken10','quiz10','combo3','vakken3','examen_done','quiz1','streak1'];
function getBestBadgeId(achievedObj){
  // Gebruik handmatig geselecteerde badge als die is verdiend
  const sel=getSelectedFeaturedBadgeId();
  if(sel&&achievedObj&&achievedObj[sel])return sel;
  // Anders automatisch hoogste badge
  if(!achievedObj)return null;
  for(const id of BADGE_PRIORITY){if(achievedObj[id])return id;}
  return null;
}
function getLbBadgeOverlay(badgeId,borderColor){
  if(!badgeId)return'';
  const b=ALL_BADGES.find(x=>x.id===badgeId);
  if(!b)return'';
  const rarity=b.rarity||'common';
  return`<div class="lb-av-badge rarity-${rarity}" style="${borderColor?'border-color:'+borderColor:''}" title="${b.label} · ${RARITY_LABEL[rarity]||''}">${b.emoji}</div>`;
}
// ── EVOLUTION REVEAL ─────────────────────────────────────────────
function showEvoReveal(newStage,animalId){
  const a=getAnimalById(animalId);
  const modal=document.getElementById('evo-reveal-modal');
  if(!modal)return;
  try{if(typeof v4AvatarReact==='function')setTimeout(()=>v4AvatarReact('levelup'),350);}catch(e){}
  const stageName=ANIM_STAGE_NAMES[newStage]||'Nieuw stadium';
  // Styles per stage: 5=Goud, 6=Diamant, 7=Platina; lager=paars (default)
  const cfg={
    5:{badge:'evo-rb-goud',btn:'evo-btn-goud',glow:'evo-reveal-glow-goud',div:'evo-divider-goud',crown:'✨',em:'✨'},
    6:{badge:'evo-rb-diamant',btn:'evo-btn-diamant',glow:'evo-reveal-glow-diamant',div:'evo-divider-diamant',crown:'💎',em:'💎'},
    7:{badge:'evo-rb-platina',btn:'evo-btn-platina',glow:'evo-reveal-glow-platina',div:'evo-divider-platina',crown:'🔮',em:'🔮'},
  }[newStage]||{badge:'evo-rb-default',btn:'evo-btn-default',glow:'',div:'evo-divider-default',crown:'⭐',em:'⭐'};
  // Reset card animation so it replays
  const card=modal.querySelector('.evo-reveal-card');
  if(card){card.style.animation='none';card.style.opacity='0';requestAnimationFrame(()=>requestAnimationFrame(()=>{card.style.animation='';}));}
  const glowEl=document.getElementById('evo-reveal-glow');
  const crownEl=document.getElementById('evo-reveal-crown');
  const badgeEl=document.getElementById('evo-reveal-badge');
  const avEl=document.getElementById('evo-reveal-av');
  const divEl=document.getElementById('evo-reveal-divider');
  const titleEl=document.getElementById('evo-reveal-title');
  const subEl=document.getElementById('evo-reveal-sub');
  const btnEl=document.getElementById('evo-reveal-btn');
  if(glowEl)glowEl.className='evo-reveal-glow '+(cfg.glow);
  if(crownEl){crownEl.style.animation='none';crownEl.textContent=cfg.crown;requestAnimationFrame(()=>requestAnimationFrame(()=>{crownEl.style.animation='';}));}
  if(badgeEl){badgeEl.className='evo-reveal-badge '+cfg.badge;badgeEl.textContent=cfg.em+' '+stageName;}
  if(avEl){avEl.style.animation='none';avEl.innerHTML=getAnimalDisplay(animalId,newStage,80);requestAnimationFrame(()=>requestAnimationFrame(()=>{avEl.style.animation='';}));}
  if(divEl)divEl.className='evo-reveal-divider '+cfg.div;
  const animalLabel=(a&&a.lbl&&a.lbl[Math.min(newStage,a.lbl.length-1)])||(a?stageName+' '+a.n:stageName);
  const msgs={
    5:'Je dier gloeit als goud. Jij bent een echte topper! 🥇',
    6:'Diamant — zo zeldzaam als jouw doorzettingsvermogen. 💎',
    7:'Platina. Het allerhoogste niveau. Slechts weinigen halen dit. 🏆'
  };
  if(titleEl)titleEl.textContent=animalLabel;
  if(subEl)subEl.textContent=msgs[newStage]||'Gefeliciteerd! Je dier evolueert naar '+stageName+'!';
  if(btnEl){btnEl.className='evo-reveal-btn '+cfg.btn;btnEl.textContent='Geweldig! 🎉';}
  modal.classList.add('open');
  haptic([80,40,80,40,200]);
}
function closeEvoReveal(){
  const modal=document.getElementById('evo-reveal-modal');
  if(modal)modal.classList.remove('open');
}
function syncAvatarToProfile(){
  try{
    const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    if(!p.animalId)return;
    p.avatar=getAnimalEmoji(p.animalId,getTotalXP());
    localStorage.setItem(PROF_KEY,JSON.stringify(p));
    if(p.naam)_updateMyLbAvatar(p.avatar,p.naam);
  }catch(e){}
}
// Sync eigen avatar-velden naar alle Supabase leaderboard-entries (1x per sessie)
const _avatarCloudSyncedKey='slagio_av_synced_'+new Date().toISOString().slice(0,10);
async function syncMyAvatarToCloud(){
  if(!currentUser)return;
  if(sessionStorage.getItem(_avatarCloudSyncedKey))return;
  try{
    const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    if(!p.animalId)return;
    const stageIdx=getAnimalStageIdx(getTotalXP());
    const featuredBadgeId=getBestBadgeId(getAchieved())||null;
    await SB.from('leaderboard').update({
      animal_id:p.animalId,
      stage_idx:stageIdx,
      featured_badge_id:featuredBadgeId,
      avatar:getAnimalEmoji(p.animalId,getTotalXP())
    }).eq('user_id',currentUser.id);
    sessionStorage.setItem(_avatarCloudSyncedKey,'1');
  }catch(e){console.warn('syncMyAvatarToCloud error:',e);}
}
// Patch avatar in all own leaderboard entries (called after evolution)
function _updateMyLbAvatar(newAvatar,naam){
  try{
    const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    const animalId=p.animalId||null;
    const stageIdx=animalId?getAnimalStageIdx(getTotalXP()):0;
    ['havo','vwo'].forEach(niveau=>{
      const key='examenapp_leaderboard_'+niveau;
      const entries=JSON.parse(localStorage.getItem(key)||'[]');
      let changed=false;
      const featuredBadgeId=getBestBadgeId(getAchieved())||null;
      entries.forEach(e=>{
        if(!e.isBot&&e.naam===naam){
          e.avatar=newAvatar;
          if(animalId){e.animalId=animalId;e.stageIdx=stageIdx;}
          if(featuredBadgeId)e.featuredBadgeId=featuredBadgeId;
          changed=true;
        }
      });
      if(changed)localStorage.setItem(key,JSON.stringify(entries));
    });
  }catch(e){}
}

function showToast(msg,color,dur){
  color=color||'#22c55e';dur=dur||2800;
  document.querySelectorAll('.app-toast').forEach(e=>e.remove());
  const el=document.createElement('div');
  el.className='app-toast';
  el.style.background=color;
  el.innerHTML=msg;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),dur);
}

// ═══════ DAILY GOAL ═══════
const DG_KEY='slagio_daily_goal';
const DG_TARGET=3;
function getDailyGoal(){
  const today=new Date().toISOString().slice(0,10);
  try{const d=JSON.parse(localStorage.getItem(DG_KEY)||'{}');if(d.date===today)return d;}catch(e){}
  const d={date:today,done:0,rewarded:false};
  localStorage.setItem(DG_KEY,JSON.stringify(d));
  return d;
}
function recordDailyGoal(){
  const d=getDailyGoal();
  d.done=(d.done||0)+1;
  const wasRewarded=d.rewarded;
  if(d.done>=DG_TARGET&&!d.rewarded){
    d.rewarded=true;
    localStorage.setItem(DG_KEY,JSON.stringify(d));
    addXP(75);
    renderXPHome();
    setTimeout(()=>{
      launchConfetti('gold');launchConfetti();
      playSound('levelup');haptic([60,30,80,30,120,30,200]);
      // Grote viering overlay
      const ov=document.createElement('div');
      ov.style.cssText='position:fixed;inset:0;z-index:9700;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.55);backdrop-filter:blur(6px)';
      ov.innerHTML=`<div style="background:var(--bg);border-radius:28px;padding:32px 28px;max-width:340px;width:100%;text-align:center;animation:comboIn .45s cubic-bezier(.34,1.2,.64,1)">
        <div style="font-size:52px;margin-bottom:12px">🎯</div>
        <h2 style="font-family:var(--font-head);font-size:26px;font-weight:900;color:var(--or);margin-bottom:8px">Dagdoel bereikt!</h2>
        <p style="color:var(--mu);font-size:14px;margin-bottom:18px;line-height:1.5">Je hebt vandaag ${DG_TARGET} quizzen voltooid.<br><strong style="color:var(--dk)">+75 XP bonus verdiend!</strong></p>
        <button onclick="this.closest('div[style]').remove()" style="width:100%;padding:14px;background:var(--or);border:none;border-radius:14px;font-size:15px;font-weight:900;color:#fff;cursor:pointer;font-family:var(--font)">Doorgaan 🔥</button>
      </div>`;
      document.body.appendChild(ov);
      ov.addEventListener('click',e=>{if(e.target===ov)ov.remove();});
      if(earnAch('daily_goal'))showAch('🎯','Eerste dagdoel bereikt!',90);
    },500);
  } else {
    localStorage.setItem(DG_KEY,JSON.stringify(d));
  }
  renderDailyGoal();
}
function renderDailyGoal(){
  const box=document.getElementById('daily-goal-home');
  if(!box)return;
  const d=getDailyGoal();
  const done=Math.min(d.done||0,DG_TARGET);
  if(d.rewarded||done>=DG_TARGET){
    box.innerHTML='<div class="dg-done">🎯 Dagdoel bereikt! <span>'+DG_TARGET+' / '+DG_TARGET+' quizzen</span></div>';
    return;
  }
  const dots=Array.from({length:DG_TARGET},function(_,i){return '<div class="dg-dot'+(i<done?' dg-dot-done':'')+'"></div>';}).join('');
  box.innerHTML='<div class="dg-card"><div class="dg-top"><span class="dg-ico">🎯</span><span class="dg-lbl">Dagdoel <span class="dg-cnt">'+done+'/'+DG_TARGET+'</span></span><span class="dg-bonus">+75 XP</span></div><div class="dg-dots">'+dots+'</div><div class="dg-bar-wrap"><div class="dg-bar" style="width:'+Math.round(done/DG_TARGET*100)+'%"></div></div></div>';
}
function getXPData(){
  try{
    const fromKey=(JSON.parse(localStorage.getItem(XP_KEY)||'{"xp":0}').xp)||0;
    const prof=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    const fromProf=typeof prof.xp==='number'?prof.xp:null;
    // Neem de hoogste waarde zodat XP nooit terugvalt bij een desync
    const xp=fromProf!==null?Math.max(fromProf,fromKey):fromKey;
    return{xp};
  }catch(e){return{xp:0};}
}
function getTotalXP(){return getXPData().xp||0;}
function getLevelForXP(xp){let l=1;for(let i=0;i<XP_LEVELS.length;i++){if(xp>=XP_LEVELS[i])l=i+1;}return Math.min(l,XP_LEVELS.length);}
function getXPForLevel(l){return XP_LEVELS[Math.min(l-1,XP_LEVELS.length-1)]||0;}
function getXPPct(xp){
  const l=getLevelForXP(xp);
  const cur=getXPForLevel(l);
  const nxt=getXPForLevel(l+1)||cur+1000;
  return Math.min(Math.round((xp-cur)/(nxt-cur)*100),100);
}
function addXP(amount){
  try{const t=new Date().toISOString().slice(0,10);const k='slagio_xp_today';const s=JSON.parse(localStorage.getItem(k)||'{}');if(s.d!==t){s.d=t;s.x=0;}s.x=(s.x||0)+amount;localStorage.setItem(k,JSON.stringify(s));}catch(e){}
  const d=getXPData();
  const oldLvl=getLevelForXP(d.xp);
  d.xp=(d.xp||0)+amount;
  localStorage.setItem(XP_KEY,JSON.stringify(d));
  // Sla XP op in profiel-kolom (betrouwbare Supabase-kolom)
  if(currentUser){
    try{
      const prof=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
      prof.xp=d.xp;
      localStorage.setItem(PROF_KEY,JSON.stringify(prof));
      cloudSet('profiel',prof);
    }catch(e){}
  }
  const newLvl=getLevelForXP(d.xp);
  const oldStage=getAnimalStageIdx(d.xp-(amount));
  const newStage=getAnimalStageIdx(d.xp);
  return{added:amount,oldLvl,newLvl,leveled:newLvl>oldLvl,totalXP:d.xp,evolved:newStage>oldStage,newStage};
}
function getComboMult(combo){if(combo>=5)return 2;if(combo>=3)return 1.5;return 1;}
function getStreakBonus(){const s=calcStreak();return Math.min((s.current||0)*0.1,0.5);}
function showCombo(combo){
  document.querySelectorAll('.combo-badge').forEach(e=>e.remove());
  if(combo<2)return;
  const mult=getComboMult(combo);
  const el=document.createElement('div');
  el.className='combo-badge'+(combo>=5?' combo-big':'');
  const labels={2:'Goed zo!',3:'Super!',4:'Onstoppbaar!',5:'GOD MODE!'};
  const lbl=labels[Math.min(combo,5)]||'Onstoppbaar!';
  el.innerHTML=`🔥 <strong>${combo}×</strong> — ${lbl} <span style="opacity:.7;font-size:.75em">×${mult} XP</span>`;
  document.body.appendChild(el);
  haptic(combo>=5?[50,30,50,30,100]:combo>=3?[40,20,60]:[25]);
  playSound(combo>=3?'combo':'correct');
  checkComboAch(combo);
  setTimeout(()=>el.remove(),2000);
}
function showXPToast(xp){
  document.querySelectorAll('.xp-toast').forEach(e=>e.remove());
  const el=document.createElement('div');
  el.className='xp-toast';
  el.textContent=`+${xp} XP`;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1500);
}
function floatXP(amount){
  const anchor=document.getElementById('res-xp-card')||document.getElementById('sc-res');
  const el=document.createElement('div');
  el.className='xp-float';
  el.textContent='+'+amount+' XP';
  const top=anchor?anchor.getBoundingClientRect().top+window.scrollY-40:innerHeight*0.4;
  const left=anchor?anchor.getBoundingClientRect().left+anchor.offsetWidth/2:innerWidth/2;
  el.style.cssText='top:'+top+'px;left:'+left+'px;transform:translateX(-50%);opacity:1';
  document.body.appendChild(el);
  requestAnimationFrame(()=>{
    el.style.transition='transform 1.3s cubic-bezier(.2,.8,.4,1),opacity 1.3s ease-out';
    el.style.transform='translateX(-50%) translateY(-90px)';
    el.style.opacity='0';
  });
  setTimeout(()=>el.remove(),1500);
}
function renderGreeting(){
  const el=document.getElementById('hm-greeting');
  if(!el)return;
  const h=new Date().getHours();
  const gdag=h<12?'Goedemorgen':h<18?'Goedemiddag':'Goedenavond';
  const naam=localStorage.getItem('slagio_naam')||(typeof currentUser!=='undefined'&&currentUser&&currentUser.user_metadata&&currentUser.user_metadata.naam)||'';
  const {current:streak,days}=calcStreak();
  const todayStr=new Date().toISOString().slice(0,10);
  const practicedToday=days&&days.includes(todayStr);
  el.className='hm-greeting';
  if(!practicedToday&&streak>0){
    el.className='hm-greeting hm-greeting-warn';
    el.textContent='⚠️ Je '+streak+'-daagse streak staat op het spel!';
  }else if(practicedToday&&streak>=7){
    el.textContent='💎 '+streak+' dagen op rij — ongelooflijk!';
  }else if(practicedToday&&streak>=3){
    el.textContent='🔥 '+streak+' dagen op rij — ga zo door!';
  }else if(practicedToday){
    el.textContent='✅ Vandaag al geoefend — top!';
  }else{
    const moti=[
      '— elke vraag telt 💪',
      '— 10 vragen en je dag is gewonnen ✨',
      '— kleine stappen, groot resultaat 🚀',
      '— jouw toekomstige ik bedankt je alvast 🎓',
      '— vandaag iets beter dan gisteren 📈',
      '— klaar voor je examen?'
    ];
    const pick=moti[Math.floor(Date.now()/864e5)%moti.length];
    el.textContent=gdag+(naam?' '+naam:'')+' '+pick;
  }
}

function renderHomeStats(){
  const box=document.getElementById('home-bento');
  if(!box)return;
  // ── Data ──────────────────────────────────────────
  const {current:streak}=calcStreak();
  const xp=getTotalXP();
  const lvl=getLevelForXP(xp);
  const cijfers=getSavedCijfers();
  const vals=Object.values(cijfers).filter(v=>typeof v==='number'&&v>0);
  const avg=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;
  // ── Action cells (always shown) ───────────────────
  const actCells=`
    <button class="bento-cell bento-act" onclick="show('sc-schedule')" aria-label="Rooster">
      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      <span class="bento-al">Rooster</span>
    </button>
    <button class="bento-cell bento-act" onclick="show('sc-calc');setTimeout(prefillCalcFromSaved,50)" aria-label="Berekenen">
      <svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>
      <span class="bento-al">Berekenen</span>
    </button>
    <button class="bento-cell bento-act" onclick="show('sc-sociaal')" aria-label="Sociaal">
      <svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="19" cy="8" r="2"/><path d="M19 14c1.7 0 3 1.3 3 3v1"/></svg>
      <span class="bento-al">Sociaal</span>
    </button>
    <button class="bento-cell bento-act" onclick="show('sc-info')" aria-label="Slaagregels">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <span class="bento-al">Slaagregels</span>
    </button>`;
  // ── Dagdoel (berekend vroeg, nodig voor beide paden) ──
  const _dg=getDailyGoal();
  const _dgDone=Math.min(_dg.done||0,DG_TARGET);
  const _dgRewarded=_dg.rewarded||_dgDone>=DG_TARGET;
  function _buildDgCell(){
    if(_dgRewarded){
      return`<div class="bento-cell bento-dg bento-dg-done" style="grid-column:1/-1;padding:12px 16px;display:flex;align-items:center;gap:10px">
        <span style="font-size:20px;position:relative;z-index:1">✅</span>
        <div style="flex:1;position:relative;z-index:1">
          <div style="font-size:13px;font-weight:700;color:#22c55e">Dagdoel bereikt!</div>
          <div style="font-size:11px;color:var(--mu);margin-top:1px">${DG_TARGET} / ${DG_TARGET} quizzen voltooid · +75 XP verdiend</div>
        </div>
        <span style="font-size:11px;font-weight:700;color:#22c55e;background:rgba(34,197,94,.1);padding:3px 10px;border-radius:20px;position:relative;z-index:1">+75 XP</span>
      </div>`;
    }
    // Countdown tot middernacht
    const _now=new Date();
    const _mn=new Date(_now);_mn.setHours(23,59,59,999);
    const _ms=_mn-_now;
    const _h=Math.floor(_ms/3600000);
    const _m=Math.floor((_ms%3600000)/60000);
    const _s=Math.floor((_ms%60000)/1000);
    const _timer=`${String(_h).padStart(2,'0')}:${String(_m).padStart(2,'0')}:${String(_s).padStart(2,'0')}`;
    const _pct=Math.round(_dgDone/DG_TARGET*100);
    return`<div class="bento-cell bento-dg" style="grid-column:1/-1;padding:12px 16px">
      <div style="display:flex;align-items:center;gap:8px;position:relative;z-index:1">
        <span style="font-size:16px">🎯</span>
        <span style="font-size:13px;font-weight:700;color:var(--dk)">Dagdoel</span>
        <span style="font-size:12px;color:var(--mu)">${_dgDone} / ${DG_TARGET} quizzen</span>
        <span id="bento-dg-timer" style="margin-left:auto;font-size:11px;font-weight:600;color:var(--mu);background:var(--bo);padding:3px 9px;border-radius:20px;font-variant-numeric:tabular-nums">⏱ ${_timer}</span>
      </div>
      <div class="bento-dg-bar"><div class="bento-dg-bar-fill" style="width:${_pct}%"></div></div>
    </div>`;
  }
  // ── Clear standalone containers (altijd) ──────────
  const _dgBox=document.getElementById('daily-goal-home');if(_dgBox)_dgBox.innerHTML='';
  const _smBox=document.getElementById('streak-milestone-banner-home');if(_smBox)_smBox.innerHTML='';
  // ── No data → empty state + actions + dagdoel ─────
  if(!xp&&!streak&&avg===null){
    box.innerHTML=`<div class="bento">
      <div class="bento-cell bento-empty" onclick="document.getElementById('vakgrid')?.scrollIntoView({behavior:'smooth'})">
        <span class="bento-empty-icon">🚀</span>
        <span class="bento-empty-text">Maak je eerste quiz om je streak, XP en gemiddelde te zien</span>
        <span class="bento-empty-cta">Begin →</span>
      </div>
      ${actCells}${_buildDgCell()}
    </div>`;
    return;
  }
  // ── Streak cell ───────────────────────────────────
  const todayStr=new Date().toISOString().slice(0,10);
  const s=getStreak();
  const practicedToday=s.days&&s.days.includes(todayStr);
  const atRisk=!practicedToday&&streak>0;
  const milestones=[3,7,14,30,100,200,300,365];
  const nextMile=milestones.find(m=>m>streak);
  let streakSub=atRisk?'⚠ Oefen voor middernacht!':streak>0?'Dagen op rij':'Begin je streak!';
  const mileLabel={3:'🔥3-daags',7:'⚡7-daags',14:'💎14-daags',30:'🔮30-daags',100:'👑100-daags',200:'🌌200-daags',300:'⚜️300-daags',365:'🪐365-daags'};
  if(!atRisk&&nextMile&&(nextMile-streak)<=2)streakSub=`Nog ${nextMile-streak}d voor ${mileLabel[nextMile]||nextMile+'d'} badge!`;
  const streakCell=`<div class="bento-cell bento-streak${atRisk?' bento-at-risk':''}" onclick="show('sc-home');setTimeout(()=>{const el=document.getElementById('streak-home');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},120)" role="button" tabindex="0">
    <div class="bento-stat"><div class="bento-si">🔥</div><div class="bento-sv">${streak} dag${streak!==1?'en':''}</div><div class="bento-sl">${streakSub}</div></div>
  </div>`;
  // ── Level / XP cell ───────────────────────────────
  const nxtXP=getXPForLevel(lvl+1)||(getXPForLevel(lvl)+1000);
  const xpToNext=nxtXP-xp;
  const xpIsUrgent=xpToNext<=100&&xpToNext>0;
  const xpSub=xp>0?(xpIsUrgent?`⚡ Nog ${xpToNext} XP!`:`Nog ${xpToNext} XP`):'';
  const lvlCell=xp>0?`<div class="bento-cell bento-xp${xpIsUrgent?' bento-xp-urgent':''}" onclick="show('sc-home');setTimeout(()=>{const el=document.getElementById('xp-home-bar');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},120)" role="button" tabindex="0">
    <div class="bento-stat"><div class="bento-si">⭐</div><div class="bento-sv">Level ${lvl}</div><div class="bento-sl">${xpSub}</div></div>
  </div>`:'';
  // ── Badges cell ───────────────────────────────────
  const earnedCount=ALL_BADGES.filter(b=>getAchieved()[b.id]).length;
  const badgeCell=earnedCount>0?`<div class="bento-cell bento-badges" onclick="openProfiel();setTimeout(()=>{const el=document.getElementById('prof-badges-content');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},250)" role="button" tabindex="0">
    <div class="bento-stat"><div class="bento-si">🏅</div><div class="bento-sv">${earnedCount}/${ALL_BADGES.length}</div><div class="bento-sl">Badges</div></div>
  </div>`:'';
  // ── Avg cell (altijd zichtbaar; leeg = uitnodiging om cijfers in te voeren) ──
  const avgCell=avg!==null
    ?`<div class="bento-cell ${avg<6?'bento-avg-warn':'bento-avg-ok'}" onclick="show('sc-calc');setTimeout(prefillCalcFromSaved,50)" role="button" tabindex="0">
        <div class="bento-stat"><div class="bento-si">📈</div><div class="bento-sv">${avg.toFixed(1).replace('.',',')}</div><div class="bento-sl">Gem. SE</div></div>
      </div>`
    :`<div class="bento-cell bento-avg-empty" onclick="show('sc-calc');setTimeout(prefillCalcFromSaved,50)" role="button" tabindex="0">
        <div class="bento-stat"><div class="bento-si" style="font-size:18px">📈</div><div class="bento-sv" style="font-size:13px;font-weight:700;color:var(--mu)">Cijfers</div><div class="bento-sl" style="font-size:10px">Voer in →</div></div>
      </div>`;
  const groepCell='';
  // ── Streak milestone cell (conditional, full-width) ──
  let smCell='';
  const nextMile2=getNextStreakMilestone(streak);
  if(nextMile2){
    const dLeft=nextMile2-streak;
    if(dLeft>0&&dLeft<=7){
      const bMap={7:{e:'⚡',n:'Een week'},14:{e:'💎',n:'Twee weken'},30:{e:'🔮',n:'Een maand'},100:{e:'👑',n:'Legende'},200:{e:'🌌',n:'Onsterfelijk'},300:{e:'⚜️',n:'Grootmeester'},365:{e:'🪐',n:'Heel het jaar'}};
      const b=bMap[nextMile2]||{e:'🏅',n:nextMile2+' dagen'};
      const fp=Math.round(Math.min(99,streak/nextMile2*100));
      smCell=`<div class="bento-cell streak-milestone-banner" style="grid-column:1/-1;border-radius:14px;padding:12px 16px;margin:0">
        <div class="smb-row"><div class="smb-icon">🔥</div><div class="smb-text">Nog <strong>${dLeft} dag${dLeft>1?'en':''}</strong> tot je ${b.e} <strong>${b.n}</strong> badge! Oefen vandaag voor dag ${streak+1}.</div></div>
        <div class="smb-bar-wrap"><div class="smb-bar-fill" style="width:${fp}%"></div></div>
        <div class="smb-bar-lbl">${streak} / ${nextMile2} dagen</div>
      </div>`;
    }
  }
  box.innerHTML=`<div class="bento">${streakCell}${lvlCell}${badgeCell}${avgCell}${groepCell}${actCells}${_buildDgCell()}${smCell}</div>`;
  // Live countdown ticker (alleen als dagdoel nog niet voltooid)
  if(!_dgRewarded){
    if(window._dgTimer)clearInterval(window._dgTimer);
    window._dgTimer=setInterval(()=>{
      const el=document.getElementById('bento-dg-timer');
      if(!el){clearInterval(window._dgTimer);return;}
      const now=new Date();const mn=new Date(now);mn.setHours(23,59,59,999);
      const ms=mn-now;
      const h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000),s=Math.floor((ms%60000)/1000);
      el.textContent=`⏱ ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    },1000);
  } else {
    if(window._dgTimer)clearInterval(window._dgTimer);
  }
}

function renderXPHome(){
  const box=document.getElementById('xp-home-bar');
  if(!box)return;
  const xp=getTotalXP();
  // Avatar evolution progress
  const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  const animalId=p.animalId||null;
  const animal=animalId?getAnimalById(animalId):null;
  if(xp===0&&!animal){box.innerHTML='';return;}
  const stageIdx=getAnimalStageIdx(xp);
  const isMaxStage=stageIdx===ANIM_THRESHOLDS.length-1;
  const curThresh=ANIM_THRESHOLDS[stageIdx];
  const nxtThresh=isMaxStage?curThresh+1:ANIM_THRESHOLDS[stageIdx+1];
  const stagePct=isMaxStage?100:Math.round(Math.min(100,(xp-curThresh)/(nxtThresh-curThresh)*100));
  const currentEmoji=animal?animal.s[stageIdx]:'⭐';
  const currentDisplay=animal?getAnimalDisplay(animal.id,stageIdx,50):`<span style="font-size:30px">⭐</span>`;
  const animalName=animal?animal.n:'Avatar';
  const stageName=ANIM_STAGE_NAMES[stageIdx];
  const nextStageName=isMaxStage?null:ANIM_STAGE_NAMES[stageIdx+1];
  const toNext=nxtThresh-xp;
  // Build journey steps (all 5 stages)
  let journeyHtml='';
  for(let i=0;i<ANIM_THRESHOLDS.length;i++){
    const isDone=i<stageIdx;
    const isCur=i===stageIdx;
    const emoji=animal?animal.s[i]:'⭐';
    const cls='xp-evo-step'+(isDone?' done':isCur?' current':'');
    const stepLbl=animal&&animal.lbl?animal.lbl[i]:ANIM_STAGE_NAMES[i];
    const stepDisplay=isDone||isCur
      ?(animal?getAnimalDisplay(animal.id,i,isCur?26:22):emoji)
      :'<span style="font-size:20px;opacity:.3;filter:grayscale(1)">❓</span>';
    journeyHtml+=`<div class="${cls}"><span class="xp-evo-step-emoji">${stepDisplay}</span><span class="xp-evo-step-name">${isDone||isCur?stepLbl:'???'}</span></div>`;
    if(i<ANIM_THRESHOLDS.length-1){
      journeyHtml+=`<div class="xp-evo-connector${isDone?' done':''}"></div>`;
    }
  }
  const footLeft=isMaxStage?`🏆 Maximaal stadium bereikt!`:`${(xp-curThresh).toLocaleString('nl')} / ${(nxtThresh-curThresh).toLocaleString('nl')} XP`;
  const footRight=isMaxStage?`${xp.toLocaleString('nl')} XP totaal`:(stagePct>=80?`🔥 Nog ${toNext} XP!`:`→ ${nextStageName}`);
  box.innerHTML=`<div class="xp-home-bar">
    <div class="xp-hb-inner">
      <div class="xp-home-lvl">${currentDisplay}</div>
      <div class="xp-home-info">
        <div class="xp-home-head">
          <div class="xp-home-title">${animalName} <span class="xp-evo-chip">${stageName}</span></div>
          <div class="xp-home-pct">${stagePct}%</div>
        </div>
        <div class="xp-evo-journey">${journeyHtml}</div>
        <div class="xp-bar-wrap"><div class="xp-bar" id="xp-bar-fill" style="width:0%"></div></div>
        <div class="xp-evo-foot"><span class="xp-evo-foot-from">${footLeft}</span><span class="xp-evo-foot-to">${footRight}</span></div>
      </div>
    </div>
  </div>`;
  setTimeout(()=>{const b=document.getElementById('xp-bar-fill');if(b)b.style.width=stagePct+'%';},50);
}

// ═══════ DAILY CHALLENGE ═══════
const DC_KEY='slagio_daily_challenge';
let _dcCache=null; // cached per render so startDailyChallenge doesn't re-validate
function _dcLevelKey(){return DC_KEY+'_'+APP_LEVEL;}
function getDailyChallenge(){
  const today=new Date().toISOString().slice(0,10);
  const key=_dcLevelKey();
  try{
    const d=JSON.parse(localStorage.getItem(key)||'{}');
    if(d.date===today){
      const vak=getVK().find(v=>v.id===d.vakId);
      const dom=vak&&vak.domeinen.find(x=>x.id===d.domeinId);
      if(vak&&dom&&dom.sv&&dom.sv.length>=3)return d;
    }
  }catch(e){}
  // Pick a fresh challenge from all valid HAVO/VWO domains
  const all=[];
  getVK().forEach(v=>v.domeinen.forEach(d=>{if(d.sv&&d.sv.length>=3)all.push({vak:v,domein:d});}));
  if(!all.length)return null;
  const pick=all[Math.floor(Math.random()*all.length)];
  const dc={date:today,vakId:pick.vak.id,vakNaam:pick.vak.naam,domeinId:pick.domein.id,domeinNaam:pick.domein.naam,done:false};
  try{localStorage.setItem(key,JSON.stringify(dc));}catch(e){}
  return dc;
}
function renderDailyChallenge(){
  // Inline card verwijderd — uitdaging verschijnt nu als popup
  const box=document.getElementById('daily-challenge-home');
  if(box)box.innerHTML='';
  _dcCache=getDailyChallenge();
}
let _dcTrapRelease=null;
function showDailyChallengePopup(){
  const dc=getDailyChallenge();
  if(!dc||dc.done)return;
  if(sessionStorage.getItem('dc_dismissed'))return;
  const popup=document.getElementById('dc-popup');
  if(!popup)return;
  const titleEl=document.getElementById('dc-popup-title');
  const subEl=document.getElementById('dc-popup-sub');
  if(titleEl)titleEl.textContent=dc.domeinNaam;
  if(subEl)subEl.textContent=dc.vakNaam+' · Snelle Quiz · 20 sec per vraag';
  _dcCache=dc;
  setTimeout(()=>{
    popup.classList.add('show');
    _dcTrapRelease=trapFocus(popup,()=>closeDcPopup(false));
  },500);
}
function closeDcPopup(start){
  const popup=document.getElementById('dc-popup');
  if(popup)popup.classList.remove('show');
  if(_dcTrapRelease){_dcTrapRelease();_dcTrapRelease=null;}
  sessionStorage.setItem('dc_dismissed','1');
  if(start)setTimeout(startDailyChallenge,300);
}
function startDailyChallenge(){
  try{
    const dc=_dcCache||getDailyChallenge();
    if(!dc||dc.done)return;
    const vak=getVK().find(v=>v.id===dc.vakId);
    if(!vak){_dcCache=null;localStorage.removeItem(_dcLevelKey());renderDailyChallenge();showToast('Uitdaging vernieuwd — probeer opnieuw!','#f97316');return;}
    const domein=vak.domeinen.find(d=>d.id===dc.domeinId);
    if(!domein||!domein.sv||!domein.sv.length){_dcCache=null;localStorage.removeItem(_dcLevelKey());renderDailyChallenge();showToast('Uitdaging vernieuwd — probeer opnieuw!','#f97316');return;}
    ST.vak=vak;ST.domein=domein;ST.isDailyChallenge=true;
    startQ('snel');
  }catch(err){
    console.error('[DC]',err);
    showToast('Kon quiz niet starten: '+err.message,'#ef4444');
  }
}

// ═══════ STREAK & BADGES ═══════
function getStreak(){
  try{return JSON.parse(localStorage.getItem('examenapp_streak')||'{}');}
  catch(e){return {};}
}
function recordPractice(){
  const s=getStreak();
  const today=new Date().toISOString().slice(0,10);
  if(!s.days)s.days=[];
  if(!s.days.includes(today))s.days.push(today);
  // Keep only last 60 days
  const cutoff=new Date();cutoff.setDate(cutoff.getDate()-60);
  s.days=s.days.filter(d=>new Date(d)>=cutoff);
  if(!s.totalQuizzes)s.totalQuizzes=0;
  s.totalQuizzes++;
  cloudSet('streak',s);
  // Quiz count badges
  try{checkQuizCountAch(s.totalQuizzes);}catch(e){}
  // Vak badges
  try{checkVakkenAch();}catch(e){}
}
function calcStreak(){
  const s=getStreak();
  if(!s.days||!s.days.length)return {current:0,longest:0,total:s.totalQuizzes||0,days:[]};
  const sorted=[...s.days].sort().reverse();
  let current=0;
  const today=new Date();today.setHours(0,0,0,0);
  const check=new Date(today);
  // Check if practiced today or yesterday to start streak
  const todayStr=today.toISOString().slice(0,10);
  const yesterday=new Date(today);yesterday.setDate(yesterday.getDate()-1);
  const yestStr=yesterday.toISOString().slice(0,10);
  if(!sorted.includes(todayStr)&&!sorted.includes(yestStr))return {current:0,longest:0,total:s.totalQuizzes||0,days:s.days};
  if(!sorted.includes(todayStr))check.setDate(check.getDate()-1);
  for(let i=0;i<60;i++){
    const d=new Date(check);d.setDate(d.getDate()-i);
    if(sorted.includes(d.toISOString().slice(0,10)))current++;
    else break;
  }
  return {current,total:s.totalQuizzes||0,days:s.days};
}
function startStreakQuiz(){
  const mijn=JSON.parse(localStorage.getItem('examenapp_'+lvlCol('mijnvakken'))||'[]');
  if(mijn.length>0){
    // Zoek het domein met de laagste score (of nooit geprobeerd) — dat heeft de meeste impact
    const prog=JSON.parse(localStorage.getItem('examenapp_progress_'+APP_LEVEL)||'{}');
    const vakArr=APP_LEVEL==='vwo'?(typeof VAKKEN_VWO!=='undefined'?VAKKEN_VWO:[]):(typeof VAKKEN!=='undefined'?VAKKEN:[]);
    let bestVak=null,bestDom=null,lowestScore=Infinity;
    mijn.forEach(vakId=>{
      const vak=vakArr.find(v=>v.id===vakId);
      if(!vak)return;
      vak.domeinen?.filter(d=>(d.sv?.length||0)>0).forEach(dom=>{
        const p=prog[vakId+'_'+dom.id+'_snel'];
        const sc=p?(p.best||0):-1;
        if(sc<lowestScore){lowestScore=sc;bestVak=vakId;bestDom=dom.id;}
      });
    });
    if(bestVak&&bestDom){
      try{sessionStorage.setItem('_slagio_open_domein',bestDom);}catch(e){}
      try{sessionStorage.setItem('_slagio_start_qmode','snel');}catch(e){}
      openVak(bestVak);return;
    }
    openVak(mijn[Math.floor(Math.random()*mijn.length)]);return;
  }
  // Geen vakken: toon quick-pick sheet
  _showQuickStartSheet();
}
function _showQuickStartSheet(){
  if(document.getElementById('qs-sheet'))return;
  const vakArr=APP_LEVEL==='vwo'?(typeof VAKKEN_VWO!=='undefined'?VAKKEN_VWO:[]):(typeof VAKKEN!=='undefined'?VAKKEN:[]);
  const topVakken=[...vakArr].sort((a,b)=>{
    const qa=a.domeinen?.reduce((s,d)=>s+(d.sv?.length||0),0)||0;
    const qb=b.domeinen?.reduce((s,d)=>s+(d.sv?.length||0),0)||0;
    return qb-qa;
  }).slice(0,8);
  const el=document.createElement('div');
  el.id='qs-sheet';
  el.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(6px);animation:_qsFd .2s ease';
  el.innerHTML=`<style>
    @keyframes _qsFd{from{opacity:0}to{opacity:1}}
    @keyframes _qsSl{from{transform:translateY(50px);opacity:0}to{transform:translateY(0);opacity:1}}
    .qs-wrap{background:var(--s);border-radius:28px 28px 0 0;padding:12px 20px 40px;width:100%;max-width:500px;animation:_qsSl .28s cubic-bezier(.22,1,.36,1)}
    .qs-pill{width:40px;height:4px;background:var(--bo);border-radius:2px;margin:0 auto 18px}
    .qs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
    .qs-card{background:rgba(var(--or-rgb),.07);border:1px solid rgba(var(--or-rgb),.2);border-radius:14px;padding:12px 14px;cursor:pointer;transition:all .15s;text-align:left;width:100%}
    .qs-card:active{background:rgba(var(--or-rgb),.15);transform:scale(.97)}
    .qs-card-name{font-size:13px;font-weight:700;color:var(--dk);margin-bottom:2px}
    .qs-card-sub{font-size:11px;color:var(--mu)}
    .qs-skip{width:100%;padding:10px;background:none;border:none;color:var(--mu);font-size:13px;cursor:pointer;font-family:var(--font)}
  </style>
  <div class="qs-wrap">
    <div class="qs-pill"></div>
    <div style="font-family:var(--font-head,sans-serif);font-size:17px;font-weight:800;color:var(--dk);margin-bottom:4px">⚡ Wat wil je oefenen?</div>
    <div style="font-size:12px;color:var(--mu);margin-bottom:16px">Kies een vak — quiz start direct</div>
    <div class="qs-grid" id="qs-grid"></div>
    <button class="qs-skip" id="qs-skip">Liever zelf kiezen</button>
  </div>`;
  document.body.appendChild(el);
  const grid=document.getElementById('qs-grid');
  topVakken.forEach(vak=>{
    const firstDom=vak.domeinen?.find(d=>(d.sv?.length||0)>0);
    const qCount=vak.domeinen?.reduce((s,d)=>s+(d.sv?.length||0),0)||0;
    const btn=document.createElement('button');
    btn.className='qs-card';
    btn.innerHTML=`<div class="qs-card-name">${vak.naam}</div><div class="qs-card-sub">${qCount} vragen · direct starten</div>`;
    btn.addEventListener('click',()=>{
      el.remove();
      if(firstDom){
        try{sessionStorage.setItem('_slagio_open_domein',firstDom.id);}catch(e){}
        try{sessionStorage.setItem('_slagio_start_qmode','snel');}catch(e){}
      }
      openVak(vak.id);
    });
    grid.appendChild(btn);
  });
  const close=()=>el.remove();
  document.getElementById('qs-skip').addEventListener('click',close);
  el.addEventListener('click',e=>{if(e.target===el)close();});
}
function quickOefen(){
  // If we know the user's current vak, jump straight to quiz mode
  if(ST.vak){
    const dom=ST.domein||ST.vak.domeinen[0];
    openQmode(dom?dom.id:'');
    return;
  }
  // If user has chosen vakken, open one of them
  const mijn=JSON.parse(localStorage.getItem('examenapp_'+lvlCol('mijnvakken'))||'[]');
  if(mijn.length>0){
    const id=mijn[Math.floor(Math.random()*mijn.length)];
    openVak(id);
    return;
  }
  // Fallback: go home and highlight the vakkengrid
  show('sc-home');
  setTimeout(()=>{
    const grid=document.getElementById('vakgrid');
    if(grid){
      grid.scrollIntoView({behavior:'smooth',block:'start'});
      grid.style.transition='box-shadow 0.35s';
      grid.style.boxShadow='0 0 0 3px var(--or),0 0 24px rgba(var(--or-rgb),.3)';
      setTimeout(()=>{grid.style.boxShadow='';},1600);
    }
  },120);
}
function renderStreak(){
  const box=document.getElementById('streak-home');
  const info=calcStreak();
  if(info.total===0){
    // Toon motiverende streak-start kaart voor nieuwe gebruikers
    const _td=new Date().getDay();
    box.innerHTML=`<div class="streak-card streak-card-empty">
      <div class="streak-top">
        <div class="streak-headline"><svg class="streak-flame-ic" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> Bouw je streak op!</div>
        <div class="streak-tagline">Oefen elke dag en verdien badges — begin vandaag.</div>
      </div>
      <div class="streak-week-empty">
        ${['zo','ma','di','wo','do','vr','za'].map((d,i)=>`<div class="swe-cell${i===_td?' swe-today':''}"><div class="swe-pip"></div><div class="swe-lbl">${d}</div></div>`).join('')}
      </div>
    </div>`;
    return;
  }
  // 7-day grid
  const dayLabels=['zo','ma','di','wo','do','vr','za'];
  let weekHtml='';
  for(let i=6;i>=0;i--){
    const d=new Date();d.setDate(d.getDate()-i);
    const ds=d.toISOString().slice(0,10);
    const isActive=info.days.includes(ds);
    const isToday=i===0;
    let pipClass='streak-day-pip';
    if(isActive){pipClass+=' active';if(isToday)pipClass+=' is-today';}
    else if(isToday)pipClass+=' today-empty';
    const nameClass='streak-day-name'+(isActive?' act':'');
    weekHtml+=`<div class="streak-day-cell">
      <div class="${pipClass}">${isActive?'✓':''}</div>
      <div class="${nameClass}">${dayLabels[d.getDay()]}</div>
    </div>`;
  }
  // Streak milestone achievements (eenmalig)
  if(info.total>=1&&earnAch('streak1'))setTimeout(()=>showAch('🌱','Eerste dag geoefend!'),400);
  if(info.current>=3&&earnAch('streak3'))setTimeout(()=>showAch('🔥','3 dagen op rij — op dreef!'),400);
  if(info.current>=7&&earnAch('streak7'))setTimeout(()=>showAch('⚡','7 dagen op rij — geweldig!'),400);
  if(info.current>=14&&earnAch('streak14'))setTimeout(()=>showAch('💎','14 dagen streak — twee weken!'),400);
  if(info.current>=30&&earnAch('streak30'))setTimeout(()=>showAch('🔮','30 dagen streak — ongelooflijk!',175),600);
  if(info.current>=100&&earnAch('streak100'))setTimeout(()=>showAch('👑','100 dagen — Slagio Legende!',220),800);
  if(info.current>=200&&earnAch('streak200'))setTimeout(()=>showAch('🌌','200 dagen — Onsterfelijk!',265),1000);
  if(info.current>=300&&earnAch('streak300'))setTimeout(()=>showAch('⚜️','300 dagen — Grootmeester!',310),1200);
  if(info.current>=365&&earnAch('streak365'))setTimeout(()=>showAch('🪐','365 dagen — Een heel jaar op rij!',355),1400);
  // Badges (streak + quizzen categorieën)
  const ach=getAchieved();
  const badgeDefs=ALL_BADGES.filter(b=>b.cat==='Streak'||b.cat==='Quizzen');
  let badgeHtml='';
  badgeDefs.forEach(b=>{
    const isEarned=!!ach[b.id];
    badgeHtml+=`<div class="badge-tooltip badge ${isEarned?'earned':'unearned'}" data-tip="${b.tip}">${b.emoji}</div>`;
  });
  // Headline
  const todayStr=new Date().toISOString().slice(0,10);
  const practicedToday=info.days.includes(todayStr);
  const fireEmoji=info.current>=365?'🪐':info.current>=300?'⚜️':info.current>=200?'🌌':info.current>=100?'👑':info.current>=30?'🔮':info.current>=14?'💎':info.current>=7?'⚡':info.current>=3?'🔥':'📚';
  const headline=info.current>0
    ?`${info.current} dag${info.current>1?'en':''} op rij!`
    :'Start vandaag je streak!';
  const tagline=info.current>=365?'🪐 Een heel jaar! Jij bent een absolute legende.'
    :info.current>=300?'⚜️ 300 dagen — Grootmeester van Slagio!'
    :info.current>=200?'🌌 200 dagen — Onsterfelijk!'
    :info.current>=100?'👑 Legendarisch — jij bent een Slagio Legende!'
    :info.current>=30?'🔮 Ongelooflijk! 30 dagen op rij!'
    :info.current>=7?'Je bent op dreef, ga zo door! 💪'
    :info.current>=3?'Geweldig, blijf volhouden!'
    :info.current>0?'Kom morgen terug om je streak te verlengen.'
    :'Maak een quiz en bouw je streak op.';
  // Longest streak stat
  const s=getStreak();
  const longest=s.longestStreak||info.current;
  box.innerHTML=`<div class="streak-card">
    <div class="streak-top">
      <div class="streak-flame-wrap">
        <div class="streak-flame-big">${fireEmoji}</div>
        <div class="streak-count-num">${info.current}</div>
        <div class="streak-count-lbl">dagen</div>
      </div>
      <div class="streak-meta">
        <div class="streak-headline">${headline}</div>
        <div class="streak-tagline">${tagline}</div>
        <div class="streak-stats">
          <div class="streak-stat">
            <div class="streak-stat-num">${info.total}</div>
            <div class="streak-stat-lbl">quizzen</div>
          </div>
          <div class="streak-stat">
            <div class="streak-stat-num">${longest}</div>
            <div class="streak-stat-lbl">record</div>
          </div>
        </div>
      </div>
    </div>
    <div class="streak-week">${weekHtml}</div>
    <div class="streak-divider"></div>
    <div class="streak-badges-row">${badgeHtml}</div>
    ${!practicedToday?`<button class="streak-cta" onclick="startStreakQuiz()">🎯 Oefen vandaag — verleng je streak!</button>`:''}
  </div>`;
  // Update longest streak
  if(info.current>longest){s.longestStreak=info.current;cloudSet('streak',s);}
  // Feature 1: streak milestone banner (rendered separately above streak card)
  try{renderStreakMilestoneBanner(info.current);}catch(e){}
}

// ═══════ FEATURE 1: STREAK MILESTONE BANNER ═══════
function getNextStreakMilestone(currentStreak){
  const milestones=[7,14,30,100,200,300,365];
  for(const m of milestones){if(currentStreak<m)return m;}
  return null;
}
function renderStreakMilestoneBanner(currentStreak){
  const el=document.getElementById('streak-milestone-banner-home');
  if(!el)return;
  const nextMilestone=getNextStreakMilestone(currentStreak);
  if(!nextMilestone){el.innerHTML='';return;}
  const daysLeft=nextMilestone-currentStreak;
  if(daysLeft>7||daysLeft<=0){el.innerHTML='';return;}
  const badgeMap={7:{emoji:'⚡',naam:'Een week'},14:{emoji:'💎',naam:'Twee weken'},30:{emoji:'🔮',naam:'Een maand'},100:{emoji:'👑',naam:'Legende'},200:{emoji:'🌌',naam:'Onsterfelijk'},300:{emoji:'⚜️',naam:'Grootmeester'},365:{emoji:'🪐',naam:'Heel het jaar'}};
  const badge=badgeMap[nextMilestone]||{emoji:'🏅',naam:nextMilestone+' dagen'};
  const fillPct=Math.round(Math.min(99,currentStreak/nextMilestone*100));
  el.innerHTML=`<div class="streak-milestone-banner">
    <div class="smb-row">
      <div class="smb-icon">🔥</div>
      <div class="smb-text">Nog <strong>${daysLeft} dag${daysLeft>1?'en':''}</strong> tot je ${badge.emoji} <strong>${badge.naam}</strong> badge! Oefen vandaag voor dag ${currentStreak+1}.</div>
    </div>
    <div class="smb-bar-wrap"><div class="smb-bar-fill" style="width:${fillPct}%"></div></div>
    <div class="smb-bar-lbl">${currentStreak} / ${nextMilestone} dagen</div>
  </div>`;
}

// ═══════ FEATURE 2: PERSONAL BEST (PB) TRACKING ═══════
const PB_KEY='slagio_pb_v1';
function getPBs(){try{return JSON.parse(localStorage.getItem(PB_KEY)||'{}');}catch(e){return{};}}
function savePB(vakId,domeinId,score){
  const pbs=getPBs();
  const key=vakId+'_'+domeinId;
  const prev=pbs[key];
  if(!prev||score>prev.score){
    pbs[key]={score,date:new Date().toISOString().slice(0,10)};
    localStorage.setItem(PB_KEY,JSON.stringify(pbs));
    return {isNew:true,prev:prev||null};
  }
  return {isNew:false,prev:prev||null};
}
function getPB(vakId,domeinId){
  const pbs=getPBs();
  return pbs[vakId+'_'+domeinId]||null;
}

// ═══════ FEATURE 3: SMART NEXT ACTION ═══════
function getSmartNextAction(vakId,domeinId,score){
  if(score<0.5){
    return {type:'retry',label:'Nog een keer proberen',sub:'Je score is onder 50% — herhaling helpt!',icon:'🔄'};
  }
  const vak=getVK().find(v=>v.id===vakId);
  if(!vak)return null;
  let worstDom=null,worstPct=1;
  vak.domeinen.forEach(d=>{
    if(d.id===domeinId)return;
    const r=getDomeinBestPct(vakId,d.id);
    if(r.hasData&&r.pct<worstPct){worstPct=r.pct;worstDom=d;}
    if(!r.hasData&&!worstDom)worstDom=d;
  });
  if(worstDom){
    const wr=getDomeinBestPct(vakId,worstDom.id);
    if(!wr.hasData||worstPct<0.65){
      return {type:'domain',domeinId:worstDom.id,label:worstDom.naam,sub:wr.hasData?`Score: ${Math.round(worstPct*100)}% — kan beter!`:'Nog niet geoefend',icon:'⚡'};
    }
  }
  return {type:'simtoets',label:'Simulatietoets',sub:'Alle domeinen ≥65% — test jezelf met een volledig examen!',icon:'🎯'};
}

// ═══════ FEATURE 4: COMEBACK CARD ═══════
function renderComebackCard(){
  const el=document.getElementById('comeback-card-home');
  if(!el)return;
  const dismissed=sessionStorage.getItem('slagio_comeback_dismissed');
  if(dismissed){el.innerHTML='';return;}
  const sd=getStreak();
  if(!sd)return;
  const today=new Date().toISOString().slice(0,10);
  const days=(sd.days||[]).slice().sort();
  if(days.length<2)return;
  const lastDay=days[days.length-1];
  const prevDay=days[days.length-2];
  if(lastDay!==today)return;
  const msGap=new Date(today)-new Date(prevDay);
  const dayGap=Math.round(msGap/86400000);
  if(dayGap<2)return;
  checkComebackAch(dayGap);
  const cbClose=document.createElement('button');
  cbClose.className='comeback-close';
  cbClose.textContent='✕';
  cbClose.addEventListener('click',()=>{sessionStorage.setItem('slagio_comeback_dismissed','1');el.querySelector('.comeback-card')?.remove();});
  const cbAct=document.createElement('button');
  cbAct.className='comeback-action';
  cbAct.textContent='📅 Bekijk je studieplan →';
  cbAct.addEventListener('click',()=>{show('sc-schedule');renderStudieplan();});
  const card=document.createElement('div');
  card.className='comeback-card';
  card.innerHTML=`<div class="comeback-icon">💪</div><div class="comeback-title">Welkom terug!</div><div class="comeback-sub">Je was ${dayGap} dag${dayGap>1?'en':''} weg — maar je bent er weer! Bouw je streak opnieuw op. Elke dag telt.</div><div class="comeback-xp">🎁 +50 XP comeback bonus</div>`;
  card.prepend(cbClose);
  card.appendChild(cbAct);
  el.innerHTML='';
  el.appendChild(card);
  if(!sessionStorage.getItem('slagio_comeback_xp')){
    try{addXP(50);}catch(e){}
    sessionStorage.setItem('slagio_comeback_xp','1');
    try{showXPToast(50);}catch(e){}
  }
}

const FEAT_DISC_KEY='slagio_feat_disc_v1';
const FEAT_HINTS=[
  {icon:'📅',title:'Persoonlijk studieplan',sub:'Slagio maakt automatisch een dagplanning tot je examendatum. Weet precies wat je wanneer moet oefenen.',act:'📅 Open studieplan',fn:()=>{show('sc-schedule');renderStudieplan();}},
  {icon:'🏁',title:'Bot Race',sub:'Race tegen AI-tegenstanders over 15 vragen. Kies je vak en een moeilijkheidsgraad — en ga!',act:'🏁 Probeer Bot Race',fn:()=>show('sc-race')},
  {icon:'📊',title:'Voortgangsrapport',sub:'Bekijk jouw score per vak en domein, aankomende examens en je zwakke punten in één overzicht.',act:'📊 Bekijk rapport',fn:()=>openRapport()},
];
function renderFeatDisc(){
  const el=document.getElementById('feat-disc-home');
  if(!el)return;
  const dismissed=localStorage.getItem(FEAT_DISC_KEY);
  if(dismissed)return;
  const sd=getStreak();
  if(!sd||!(sd.totalQuizzes>=1||sd.days?.length>=1))return;
  const seen=JSON.parse(sessionStorage.getItem('slagio_feat_disc_seen')||'[]');
  const hint=FEAT_HINTS.find(h=>!seen.includes(h.title))||null;
  if(!hint){el.innerHTML='';return;}
  seen.push(hint.title);
  sessionStorage.setItem('slagio_feat_disc_seen',JSON.stringify(seen));
  const card=document.createElement('div');
  card.className='feat-disc-card';
  const closeBtn=document.createElement('button');
  closeBtn.className='feat-disc-close';closeBtn.textContent='✕';
  closeBtn.addEventListener('click',()=>{localStorage.setItem(FEAT_DISC_KEY,'1');el.innerHTML='';});
  const actBtn=document.createElement('button');
  actBtn.className='feat-disc-btn';actBtn.textContent=hint.act;
  actBtn.addEventListener('click',()=>{localStorage.setItem(FEAT_DISC_KEY,'1');el.innerHTML='';try{hint.fn();}catch(e){}});
  card.innerHTML=`<div class="feat-disc-icon">${hint.icon}</div><div class="feat-disc-body"><div class="feat-disc-title">Wist je dit? ${hint.title}</div><div class="feat-disc-sub">${hint.sub}</div></div>`;
  card.appendChild(actBtn);
  card.appendChild(closeBtn);
  el.innerHTML='';
  el.appendChild(card);
}

// ═══════ REVIEW ═══════
function openReview(){
  document.getElementById('review-sub').textContent=`${ST.vak.naam} · Domein ${ST.domein.id}: ${ST.domein.naam} · ${ST.mode==='snel'?'Snelle Quiz':'Oud-examen'}`;
  // Bouw de volledige HTML in één keer (geen innerHTML+= per stap)
  let html='';
  ST.vragen.forEach((q,i)=>{
    const a=ST.antwrd[i];
    if(!a)return;
    let statusClass,statusText;
    if(a.pts===1){statusClass='rc-ok';statusText='✓ Goed';}
    else if(a.pts===0.5){statusClass='rc-half';statusText='~ Deels';}
    else{statusClass='rc-wrong';statusText='✗ Fout';}
    let answerHtml='';
    if(ST.mode==='snel'){
      const correctAns=q.o[q.c];
      // Toon jouw antwoord alleen als het fout was (niet nodig bij goed)
      if(a.pts!==1&&a.chosenText&&a.chosenText!=='⏱ Tijd was op'){
        answerHtml+=`<div class="rc-answer rc-answer-wrong"><span class="rc-answer-lbl">Jouw antwoord</span> ${a.chosenText}</div>`;
      }
      if(a.chosenText==='⏱ Tijd was op'){
        answerHtml+=`<div class="rc-answer" style="color:#F87171">⏱ Tijd was op</div>`;
      }
      answerHtml+=`<div class="rc-answer rc-answer-correct"><span class="rc-answer-lbl">Juist antwoord</span> ${correctAns}</div>`;
      // Uitleg (toelichting) alleen als aanwezig
      if(q.u)answerHtml+=`<div class="rc-explanation"><span class="rc-expl-icon">💡</span>${q.u}</div>`;
    } else {
      if(a.userText)answerHtml+=`<div class="rc-answer"><span class="rc-answer-lbl">Jouw antwoord</span> ${a.userText}</div>`;
      if(q.u)answerHtml+=`<div class="rc-explanation"><span class="rc-expl-icon">📋</span>${q.u}</div>`;
    }
    const ctxHtml=q.ctx?`<div class="rc-ctx">${q.ctx.substring(0,250)+(q.ctx.length>250?'…':'')}</div>`:'';
    html+=`<div class="review-card ${statusClass}-card">
      <div class="rc-head"><span class="rc-num">Vraag ${i+1}${ST.flagged&&ST.flagged.has(i)?'<span class="rc-flag">🚩 Herhalen</span>':''}</span><span class="rc-status ${statusClass}">${statusText}</span></div>
      <div class="rc-q">${q.v}</div>
      ${ctxHtml}
      ${answerHtml}
    </div>`;
  });
  document.getElementById('review-list').innerHTML=html;
  show('sc-review');
}

