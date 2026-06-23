// ═══════════════════════════════════════════════════════════════
// V4 - LIVING LAYER + AVATAR STATE ENGINE
// Avatars die ademen, knipperen en écht reageren op app-events:
// correct / wrong / streak / levelup / celebrate - plus een
// quiz-companion die meeleeft. Demo: /index.html?avatardemo=1
// Volledig additief: faalt stil, breekt nooit functionaliteit.
// ═══════════════════════════════════════════════════════════════
(function(){
'use strict';
const REDUCE=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=window.matchMedia&&window.matchMedia('(pointer: fine)').matches;

/* ── 1. AVATAR IDLE-LEVEN ─────────────────────────────────────── */
function isEyePart(c){
  const r=parseFloat(c.getAttribute('r')||0);
  if(!r||r>8)return false;
  const f=(c.getAttribute('fill')||'').toLowerCase().trim();
  if(f==='#fff'||f==='#ffffff'||f==='white')return r>=3.5;
  return /^#(0[0-9a-f]|1[0-9a-f]|2[0-9a-f]|3[0-9a-f]|4[0-3])/.test(f);
}
function enliven(svg){
  if(svg.dataset.v4)return;
  svg.dataset.v4='1';
  try{
    const wrap=svg.closest('.anim-svg-wrap');
    if(wrap){wrap.classList.add('v4-avt');if(Math.random()<.45)wrap.classList.add('v4-idle-sway');}
    const delay=(Math.random()*4).toFixed(2)+'s';
    const dur=(3.8+Math.random()*2.4).toFixed(2)+'s';
    svg.querySelectorAll('circle').forEach(c=>{
      if(isEyePart(c)){
        c.classList.add('v4-eye');
        c.style.animationDelay=delay;
        c.style.animationDuration=dur;
      }
    });
    svg.style.animationDelay=(Math.random()*3).toFixed(2)+'s';
  }catch(e){}
}
function scanAvatars(root){
  try{(root||document).querySelectorAll('.anim-svg-wrap svg:not([data-v4])').forEach(enliven);}catch(e){}
}
function randomHop(){
  if(REDUCE)return;
  try{
    const avts=[...document.querySelectorAll('.v4-avt')].filter(el=>{
      const r=el.getBoundingClientRect();
      return r.top<innerHeight&&r.bottom>0&&r.width>0;
    });
    if(avts.length){
      const el=avts[Math.floor(Math.random()*avts.length)];
      el.classList.add('v4-hop');
      setTimeout(()=>el.classList.remove('v4-hop'),700);
    }
  }catch(e){}
  setTimeout(randomHop,6000+Math.random()*8000);
}
function randomPeek(){
  if(REDUCE)return;
  try{
    const avts=[...document.querySelectorAll('.v4-avt')].filter(el=>{
      const r=el.getBoundingClientRect();
      return r.top<innerHeight&&r.bottom>0&&r.width>0&&!el.classList.contains('v4-hop');
    });
    if(avts.length){
      const el=avts[Math.floor(Math.random()*avts.length)];
      el.classList.add('v4-peek');
      setTimeout(()=>el.classList.remove('v4-peek'),1500);
    }
  }catch(e){}
  setTimeout(randomPeek,9000+Math.random()*11000);
}
document.addEventListener('pointerdown',e=>{
  const w=e.target.closest&&e.target.closest('.v4-avt');
  if(w&&!REDUCE){
    w.classList.remove('v4-squish');void w.offsetWidth;
    w.classList.add('v4-squish');
    setTimeout(()=>w.classList.remove('v4-squish'),450);
  }
},{passive:true});

/* ── 2. AVATAR STATE-ENGINE (event → reactie) ─────────────────── */
const STATES={
  correct:{dur:800,bubble:'✓',bubbleCls:'v4b-ok'},
  wrong:{dur:850,bubble:'💪',bubbleCls:'v4b-soft'},
  streak:{dur:950,bubble:'🔥',bubbleCls:'v4b-fire'},
  levelup:{dur:1300,bubble:'⭐',bubbleCls:'v4b-gold'},
  celebrate:{dur:1900,bubble:'🎉',bubbleCls:'v4b-gold'}
};
let _reactTimer=null;
function v4AvatarReact(state){
  const cfg=STATES[state];
  if(!cfg)return;
  try{
    // Alle zichtbare avatars reageren mee
    const targets=[...document.querySelectorAll('.v4-avt')].filter(el=>{
      const r=el.getBoundingClientRect();
      return r.top<innerHeight&&r.bottom>0&&r.width>0;
    });
    const comp=document.getElementById('v4-companion');
    if(comp&&!targets.includes(comp.querySelector('.v4-avt')))targets.push(...comp.querySelectorAll('.v4-avt'));
    clearTimeout(_reactTimer);
    targets.forEach(el=>{
      Object.keys(STATES).forEach(s=>el.classList.remove('v4cs-'+s));
      void el.offsetWidth;
      el.classList.add('v4cs-'+state);
    });
    _reactTimer=setTimeout(()=>{
      targets.forEach(el=>el.classList.remove('v4cs-'+state));
    },cfg.dur);
    // Emote-bubble boven de companion
    if(comp)showBubble(comp,cfg);
  }catch(e){}
}
window.v4AvatarReact=v4AvatarReact;
function showBubble(comp,cfg){
  try{
    comp.querySelectorAll('.v4-bubble').forEach(b=>b.remove());
    const b=document.createElement('div');
    b.className='v4-bubble '+cfg.bubbleCls;
    b.textContent=cfg.bubble;
    comp.appendChild(b);
    setTimeout(()=>b.remove(),1400);
  }catch(e){}
}

/* ── 3. QUIZ-COMPANION ────────────────────────────────────────────
   Je mascotte zit klein in beeld tijdens de quiz en leeft mee.
   pointer-events:none - blokkeert nooit een tik. */
function ensureCompanion(){
  try{
    const quizOn=document.getElementById('sc-quiz')?.classList.contains('on');
    const demo=location.search.indexOf('avatardemo')>-1;
    let comp=document.getElementById('v4-companion');
    if(!quizOn&&!demo){if(comp)comp.remove();return;}
    if(comp)return;
    if(typeof getAnimalDisplay!=='function')return;
    let animalId=null,stage=0;
    try{
      const p=JSON.parse(localStorage.getItem('examenapp_profiel')||'{}');
      animalId=p.animalId||null;
      if(typeof getTotalXP==='function'&&typeof getAnimalStageIdx==='function')stage=getAnimalStageIdx(getTotalXP());
    }catch(e){}
    if(!animalId)animalId='slijm'; // anonieme gebruikers krijgen de blob als metgezel
    comp=document.createElement('div');
    comp.id='v4-companion';
    comp.setAttribute('aria-hidden','true');
    comp.innerHTML=getAnimalDisplay(animalId,stage,demo?64:36);
    // In de quiz: in de topbalk naast het logo - altijd zichtbaar, nooit overlap
    const bar=quizOn?document.querySelector('#sc-quiz .qtb'):null;
    if(bar){
      comp.classList.add('v4-inbar');
      const ql=bar.querySelector('.ql');
      if(ql)ql.insertAdjacentElement('afterend',comp);
      else bar.prepend(comp);
    }else{
      document.body.appendChild(comp);
    }
    scanAvatars(comp);
  }catch(e){}
}

/* ── 4. DEMO-ROUTE (?avatardemo=1) - test alle states ─────────── */
function buildDemo(){
  if(location.search.indexOf('avatardemo')===-1)return;
  if(document.getElementById('v4-demo'))return;
  const d=document.createElement('div');
  d.id='v4-demo';
  d.innerHTML='<div class="v4-demo-title">Avatar-states demo</div>'+
    Object.keys(STATES).map(s=>`<button class="v4-demo-btn" data-s="${s}">${s}</button>`).join('');
  d.addEventListener('click',e=>{
    const s=e.target.dataset&&e.target.dataset.s;
    if(s)v4AvatarReact(s);
  });
  document.body.appendChild(d);
  ensureCompanion();
}

/* ── 5. SCROLL REVEAL ─────────────────────────────────────────── */
const REVEAL_SEL='.home-section-header,.hm-tvk,.streak-card,.daily-card,.bento-cell,.hiw-step,.prof-section,.lb-row,.hm-sociaal-row,.dc2,.qmcd,#grade-insight-home>*,#xp-home-bar>*';
let revealObs=null;
function setupReveal(){
  if(REDUCE||!('IntersectionObserver' in window))return;
  revealObs=new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('v4-in');
        revealObs.unobserve(en.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -4% 0px'});
}
function scanReveal(root){
  if(!revealObs)return;
  try{
    (root||document).querySelectorAll(REVEAL_SEL).forEach(el=>{
      if(el.dataset.v4r)return;
      el.dataset.v4r='1';
      const r=el.getBoundingClientRect();
      if(r.top>innerHeight*.92){
        el.classList.add('v4-r');
        revealObs.observe(el);
      }
    });
  }catch(e){}
}

/* ── 6. 3D-TILT ───────────────────────────────────────────────── */
function setupTilt(){
  if(REDUCE||!FINE)return;
  document.addEventListener('pointermove',e=>{
    const card=e.target.closest&&e.target.closest('.wlc-card,.hm-countdown');
    if(!card)return;
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.setProperty('--tx',(x*100+50)+'%');
    card.style.setProperty('--ty',(y*100+50)+'%');
    card.style.transform=`perspective(900px) rotateY(${(x*6).toFixed(2)}deg) rotateX(${(-y*5).toFixed(2)}deg) translateY(-4px)`;
    card.classList.add('v4-tilting');
  },{passive:true});
  document.addEventListener('pointerout',e=>{
    const card=e.target.closest&&e.target.closest('.wlc-card,.hm-countdown');
    if(card&&!card.contains(e.relatedTarget)){
      card.style.transform='';
      card.classList.remove('v4-tilting');
    }
  },{passive:true});
}

/* ── 7. MAGNETISCHE CTA ───────────────────────────────────────── */
function setupMagnet(){
  if(REDUCE||!FINE)return;
  document.addEventListener('pointermove',e=>{
    const btn=e.target.closest&&e.target.closest('.hm-cta-primary');
    if(!btn)return;
    const r=btn.getBoundingClientRect();
    const x=(e.clientX-(r.left+r.width/2))*.18;
    const y=(e.clientY-(r.top+r.height/2))*.3;
    btn.style.translate=`${x.toFixed(1)}px ${y.toFixed(1)}px`;
  },{passive:true});
  document.addEventListener('pointerout',e=>{
    const btn=e.target.closest&&e.target.closest('.hm-cta-primary');
    if(btn&&!btn.contains(e.relatedTarget))btn.style.translate='';
  },{passive:true});
}

/* ── 8. COUNT-UP statistieken (welcome) ───────────────────────── */
function countUp(el){
  if(el.dataset.v4c||REDUCE)return;
  el.dataset.v4c='1';
  const raw=el.textContent.trim();
  const m=raw.match(/^([\d.]+)(\+?)$/);
  if(!m)return;
  const target=parseFloat(m[1].replace('.',''));
  const suffix=m[2];
  const hasDot=m[1].includes('.');
  const t0=performance.now(),DUR=1400;
  function frame(t){
    const p=Math.min(1,(t-t0)/DUR);
    const eased=1-Math.pow(1-p,3);
    let v=Math.round(target*eased);
    let txt=String(v);
    if(hasDot&&v>=1000)txt=String(v).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
    el.textContent=txt+suffix;
    if(p<1)requestAnimationFrame(frame);
    else el.textContent=raw;
  }
  requestAnimationFrame(frame);
}
function setupCountUp(){
  if(!('IntersectionObserver' in window))return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(en=>{if(en.isIntersecting){countUp(en.target);obs.unobserve(en.target);}});
  },{threshold:.4});
  document.querySelectorAll('.wlc-stat-n').forEach(el=>obs.observe(el));
}

/* ── 9. VAKKEN-MARQUEE in hero ────────────────────────────────── */
function buildMarquee(){
  try{
    if(document.getElementById('v4-marquee'))return;
    const hero=document.querySelector('.hm-hero-inner');
    if(!hero||typeof getVK!=='function')return;
    const vakken=getVK();
    if(!vakken||!vakken.length)return;
    const chips=vakken.map(v=>`<button class="v4-mq-chip" onclick="openVak('${v.id}')" tabindex="-1" style="--mqc:${v.kleur||'#888'}"><span class="v4-mq-dot"></span>${v.naam}</button>`).join('');
    const mq=document.createElement('div');
    mq.id='v4-marquee';mq.className='v4-marquee';
    mq.setAttribute('aria-hidden','true');
    mq.innerHTML=`<div class="v4-mq-track">${chips}${chips}</div>`;
    hero.appendChild(mq);
  }catch(e){}
}

/* ── 10b. PER-VAK WERELDEN (één data-vak-mechanisme) ──────────────
   Zet data-vak op <html> zodra een vak-scherm actief is. De CSS
   scopet daarop een eigen palet + motief per vak. Schoon weg bij
   het verlaten van de vak-flow. */
const VAK_SCREENS=['sc-detail','sc-quiz','sc-leerpad','sc-sim'];
function applyVakWorld(){
  try{
    const active=[...document.querySelectorAll('.sc.on')].map(s=>s.id);
    const onVak=active.some(id=>VAK_SCREENS.includes(id));
    const vak=(typeof ST!=='undefined'&&ST&&ST.vak)?ST.vak.id:null;
    const root=document.documentElement;
    if(onVak&&vak)root.setAttribute('data-vak',vak);
    else root.removeAttribute('data-vak');
  }catch(e){}
}
window.applyVakWorld=applyVakWorld;

/* ── 10. OBSERVER: nieuwe DOM automatisch verlevendigen ───────── */
let scanQueued=false;
function queueScan(){
  if(scanQueued)return;
  scanQueued=true;
  requestAnimationFrame(()=>{
    scanQueued=false;
    scanAvatars();
    scanReveal();
    ensureCompanion();
    applyVakWorld();
    // ST.vak kan nét ná de screen-switch worden gezet - vang die race
    setTimeout(applyVakWorld,70);
  });
}
function setupObserver(){
  try{
    new MutationObserver(queueScan).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }catch(e){}
}

/* ── 11. DETERMINISTISCHE HOOKS op navigatie ──────────────────────
   Wrap de globale show()/openVak() zodat de vak-wereld + companion
   exact op het juiste moment worden bijgewerkt (geen timing-race). */
function wrapNav(){
  try{
    if(typeof window.show==='function'&&!window.show._v4){
      const orig=window.show;
      window.show=function(){const r=orig.apply(this,arguments);applyVakWorld();ensureCompanion();return r;};
      window.show._v4=1;
    }
    if(typeof window.openVak==='function'&&!window.openVak._v4){
      const orig=window.openVak;
      window.openVak=function(){const r=orig.apply(this,arguments);applyVakWorld();return r;};
      window.openVak._v4=1;
    }
  }catch(e){}
}

/* ── INIT ─────────────────────────────────────────────────────── */
function init(){
  setupReveal();
  setupTilt();
  setupMagnet();
  setupCountUp();
  setupObserver();
  wrapNav();
  scanAvatars();
  scanReveal();
  buildMarquee();
  buildDemo();
  applyVakWorld();
  if(!REDUCE){setTimeout(randomHop,4000);setTimeout(randomPeek,7000);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
