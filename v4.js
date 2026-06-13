// ═══════════════════════════════════════════════════════════════
// V4 — LIVING LAYER
// Brengt de hele site tot leven: avatars die ademen & knipperen,
// scroll-reveals, 3D-tilt, magnetische knoppen, marquee, count-ups.
// Volledig additief: faalt stil, breekt nooit functionaliteit.
// ═══════════════════════════════════════════════════════════════
(function(){
'use strict';
const REDUCE=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=window.matchMedia&&window.matchMedia('(pointer: fine)').matches;

/* ── 1. AVATAR LEVEN (Duolingo-stijl) ─────────────────────────
   Elke avatar-SVG krijgt: idle-ademhaling, knipperende ogen,
   willekeurige vreugdesprongetjes en een squish bij aanraken. */
function isEyePart(c){
  const r=parseFloat(c.getAttribute('r')||0);
  if(!r||r>8)return false;
  const f=(c.getAttribute('fill')||'').toLowerCase().trim();
  if(f==='#fff'||f==='#ffffff'||f==='white')return r>=3.5; // oogwit
  return /^#(0[0-9a-f]|1[0-9a-f]|2[0-9a-f]|3[0-9a-f]|4[0-3])/.test(f); // donkere pupillen
}
function enliven(svg){
  if(svg.dataset.v4)return;
  svg.dataset.v4='1';
  try{
    const wrap=svg.closest('.anim-svg-wrap');
    if(wrap)wrap.classList.add('v4-avt');
    // Ogen vinden en laten knipperen (elke avatar net even anders)
    const delay=(Math.random()*4).toFixed(2)+'s';
    const dur=(3.8+Math.random()*2.4).toFixed(2)+'s';
    svg.querySelectorAll('circle').forEach(c=>{
      if(isEyePart(c)){
        c.classList.add('v4-eye');
        c.style.animationDelay=delay;
        c.style.animationDuration=dur;
      }
    });
    // Idle-fase desynchroniseren zodat avatars niet synchroon bewegen
    svg.style.animationDelay=(Math.random()*3).toFixed(2)+'s';
  }catch(e){}
}
function scanAvatars(root){
  try{(root||document).querySelectorAll('.anim-svg-wrap svg:not([data-v4])').forEach(enliven);}catch(e){}
}
// Willekeurig vreugdesprongetje: af en toe springt één zichtbare avatar
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
// Squish bij aanraken (event delegation — werkt op alles, ook dynamisch)
document.addEventListener('pointerdown',e=>{
  const w=e.target.closest&&e.target.closest('.v4-avt');
  if(w&&!REDUCE){
    w.classList.remove('v4-squish');void w.offsetWidth;
    w.classList.add('v4-squish');
    setTimeout(()=>w.classList.remove('v4-squish'),450);
  }
},{passive:true});

/* ── 2. SCROLL REVEAL ─────────────────────────────────────────
   Secties faden omhoog terwijl je scrolt. JS voegt eerst de
   verberg-klasse toe (geen JS = niets verborgen). */
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
      // Alleen verbergen wat onder de vouw ligt
      if(r.top>innerHeight*.92){
        el.classList.add('v4-r');
        revealObs.observe(el);
      }
    });
  }catch(e){}
}

/* ── 3. 3D-TILT op welcome-kaarten en countdown ───────────────── */
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

/* ── 4. MAGNETISCHE CTA (desktop) ─────────────────────────────── */
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

/* ── 5. COUNT-UP statistieken (welcome) ───────────────────────── */
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
    let txt=hasDot&&v>=1000?(v/1000).toFixed(1).replace('.',',').replace(',0','')+'.'+String(v%1000).padStart(3,'0').slice(0,3):String(v);
    if(hasDot&&v>=1000){txt=String(v).replace(/\B(?=(\d{3})+(?!\d))/g,'.');}
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

/* ── 6. VAKKEN-MARQUEE in hero (activatie: 1 tik naar je vak) ── */
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

/* ── 7. OBSERVER: nieuwe DOM-elementen automatisch verlevendigen ─ */
let scanQueued=false;
function queueScan(){
  if(scanQueued)return;
  scanQueued=true;
  requestAnimationFrame(()=>{
    scanQueued=false;
    scanAvatars();
    scanReveal();
  });
}
function setupObserver(){
  try{
    new MutationObserver(queueScan).observe(document.body,{childList:true,subtree:true});
  }catch(e){}
}

/* ── INIT ─────────────────────────────────────────────────────── */
function init(){
  setupReveal();
  setupTilt();
  setupMagnet();
  setupCountUp();
  setupObserver();
  scanAvatars();
  scanReveal();
  buildMarquee();
  if(!REDUCE)setTimeout(randomHop,4000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
