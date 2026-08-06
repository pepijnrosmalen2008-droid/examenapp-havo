// ═══════════════════════════════════════════════════════════════
//  ONBOARDING v2 - Vonk leidt een gesprek (Duolingo-stijl)
//  Vervangt de oude intro. Stap voor stap; haptics + geluid + een
//  "profielkaart" (het boekje) die Vonk stap voor stap invult.
// ═══════════════════════════════════════════════════════════════
const ONB = { i:0, data:{ niveau:null, klas:null, profiel:null, vakken:[], animalId:null, cijfers:false, studieplan:false } };

function _onbHaptic(p){ try{ if(typeof haptic==='function') haptic(p); }catch(e){} }
function _onbSound(t){ try{ if(typeof playSound==='function') playSound(t); }catch(e){} }
function _onbConfetti(kind){ try{ if(typeof launchConfetti==='function') launchConfetti(kind); }catch(e){} }

// Klas-opties hangen af van niveau
function _onbKlassen(){ return ONB.data.niveau==='vwo' ? [['4V','4 VWO'],['5V','5 VWO'],['6V','6 VWO']] : [['4H','4 HAVO'],['5H','5 HAVO']]; }
function _onbKlasLabel(v){ const f=_onbKlassen().find(k=>k[0]===v); return f?f[1]:v; }

// ── Stappen ─────────────────────────────────────────────────────
// type: 'single' (auto-door na keuze) | 'multi' | 'info'
const ONB_STEPS = [
  { key:'welkom', mood:'blij', type:'info',
    text:'Hoi! Ik ben <b>Vonk</b> - jouw examen-maatje. Ik stel je een paar vlugge vragen en zet Slagio helemaal voor jou klaar.',
    body:()=>`<button class="onb-cta" onclick="onbNext()">Ja, we gaan!</button>` },

  { key:'niveau', mood:'goed', type:'single',
    text:'Doe je <b>HAVO</b> of <b>VWO</b>?',
    body:()=>{
      const opt=(v,lbl,sub)=>`<button class="onb-opt${ONB.data.niveau===v?' sel':''}" onclick="onbPick('niveau','${v}')"><span class="onb-opt-tx"><span class="onb-opt-main">${lbl}</span><span class="onb-opt-sub">${sub}</span></span><span class="onb-opt-check">✓</span></button>`;
      return `<div class="onb-opts">${opt('havo','HAVO','5 jaar')}${opt('vwo','VWO','6 jaar')}</div>`;
    } },

  { key:'klas', mood:'goed', type:'single',
    text:'In welke klas zit je nu?',
    body:()=>`<div class="onb-opts">${_onbKlassen().map(([v,lbl])=>`<button class="onb-opt${ONB.data.klas===v?' sel':''}" onclick="onbPick('klas','${v}')"><span class="onb-opt-tx"><span class="onb-opt-main">${lbl}</span></span><span class="onb-opt-check">✓</span></button>`).join('')}</div>` },

  { key:'profiel', mood:'denk', type:'single',
    text:'Welk <b>profiel</b> volg je?',
    body:()=>{
      const P=[['nt','Natuur & Techniek','N&T'],['ng','Natuur & Gezondheid','N&G'],['em','Economie & Maatschappij','E&M'],['cm','Cultuur & Maatschappij','C&M']];
      return `<div class="onb-opts">${P.map(([v,lbl,ab])=>`<button class="onb-opt${ONB.data.profiel===v?' sel':''}" onclick="onbPick('profiel','${v}')"><span class="onb-opt-tx"><span class="onb-opt-main">${lbl}</span><span class="onb-opt-sub">${ab}</span></span><span class="onb-opt-check">✓</span></button>`).join('')}</div>`;
    } },

  { key:'vakken', mood:'goed', type:'multi',
    text:'Kies je <b>examenvakken</b>. Deze zet ik bovenaan je startscherm.',
    body:()=>{
      const vk=(typeof getVK==='function')?getVK():[];
      if(!vk.length) return '<div class="onb-loading">Vakken laden…</div>';
      return `<div class="onb-vakgrid">${vk.map(v=>`<button class="onb-vak${ONB.data.vakken.includes(v.id)?' sel':''}" onclick="onbToggleVak('${v.id}')" style="--vc:${v.kleur}"><span class="onb-vak-ic"><svg viewBox="0 0 24 24">${(typeof VAK_ICONS!=='undefined'&&VAK_ICONS[v.id])||'<circle cx="12" cy="12" r="4"/>'}</svg></span><span class="onb-vak-nm">${v.naam}</span><span class="onb-vak-ck">✓</span></button>`).join('')}</div>`;
    } },

  { key:'dier', mood:'blij', type:'single',
    text:'Kies je <b>maatje</b>. Hij groeit mee met je XP.',
    body:()=>{
      const A=(typeof ANIMAL_EVOLUTIONS!=='undefined')?ANIMAL_EVOLUTIONS:[];
      return `<div class="onb-diergrid">${A.map(a=>`<button class="onb-dier${ONB.data.animalId===a.id?' sel':''}" onclick="onbPick('animalId','${a.id}')"><span class="onb-dier-av">${(typeof getAnimalDisplay==='function')?getAnimalDisplay(a.id,0,44):''}</span><span class="onb-dier-nm">${a.n}</span></button>`).join('')}</div>`;
    } },

  { key:'uitleg', mood:'trots', type:'info',
    text:'Zo werkt Slagio - in het kort:',
    body:()=>`<div class="onb-uitleg">
      <div class="onb-ul-row"><span class="onb-ul-ic">⚡</span><div><b>Oefen slim</b> - korte quizzen per domein met directe feedback.</div></div>
      <div class="onb-ul-row"><span class="onb-ul-ic">🔥</span><div><b>Bouw je streak</b> - elke dag oefenen geeft bonus-XP en badges.</div></div>
      <div class="onb-ul-row"><span class="onb-ul-ic">🏆</span><div><b>Zie je slagingskans</b> - en klim in de wekelijkse divisies.</div></div>
      <button class="onb-cta" onclick="onbNext()">Duidelijk!</button></div>` },
];

function onbStart(){
  ONB.i=0; ONB.data={ niveau:null, klas:null, profiel:null, vakken:[], animalId:null, cijfers:false, studieplan:false };
  const ov=document.getElementById('onb'); if(!ov)return;
  ov.style.display='flex';
  requestAnimationFrame(()=>ov.classList.add('on'));
  onbRender(true);
}

function onbRender(first){
  const step=ONB_STEPS[ONB.i]; if(!step){ onbFinish(); return; }
  const pf=document.getElementById('onb-progress-fill');
  if(pf) pf.style.width=Math.round((ONB.i/(ONB_STEPS.length-1))*100)+'%';
  const vk=document.getElementById('onb-vonk');
  if(vk){ vk.innerHTML=(typeof mascotSVG==='function')?mascotSVG(step.mood||'blij',118):''; vk.classList.remove('onb-vonk-in'); void vk.offsetWidth; vk.classList.add('onb-vonk-in'); }
  const bub=document.getElementById('onb-bubble');
  if(bub){ bub.innerHTML=step.text||''; bub.classList.remove('pop'); void bub.offsetWidth; bub.classList.add('pop'); }
  const bd=document.getElementById('onb-body');
  if(bd){ bd.innerHTML=step.body?step.body():''; bd.classList.remove('slidein'); void bd.offsetWidth; bd.classList.add('slidein'); }
  onbRenderCard();
  const foot=document.getElementById('onb-foot');
  if(foot) foot.style.display=(step.type==='multi')?'flex':'none';
  const skip=document.getElementById('onb-skip');
  if(skip) skip.style.display=step.optional?'':'none';
  const nxt=document.querySelector('#onb-foot .onb-next');
  if(nxt) nxt.disabled=(step.key==='vakken'&&ONB.data.vakken.length===0);
  if(!first) _onbSound('swoosh');
}

function onbPick(key,val){
  ONB.data[key]=val;
  _onbHaptic([12,28,18]); _onbSound('correct');
  // Bij niveau-keuze: klas resetten én meteen de niveau-data laden (voedt de vakkenstap)
  if(key==='niveau'){
    ONB.data.klas=null;
    try{
      if(typeof APP_LEVEL!=='undefined') APP_LEVEL=val;
      localStorage.setItem('examenapp_level',val);
      if(typeof applyLevelTheme==='function') applyLevelTheme(val);
      if(typeof ensureLevelData==='function') ensureLevelData(val,()=>{});
    }catch(e){}
  }
  onbRenderCard();
  const bd=document.getElementById('onb-body');
  if(bd){
    bd.querySelectorAll('.onb-opt,.onb-dier').forEach(b=>b.classList.remove('sel'));
    const chosen=Array.from(bd.querySelectorAll('.onb-opt,.onb-dier')).find(b=>{const oc=b.getAttribute('onclick');return oc&&oc.includes("'"+val+"'");});
    if(chosen) chosen.classList.add('sel');
  }
  // Vonk reageert blij + hopt
  const vk=document.getElementById('onb-vonk');
  if(vk&&typeof mascotSVG==='function'){ vk.innerHTML=mascotSVG('feest',118); vk.classList.remove('onb-hop'); void vk.offsetWidth; vk.classList.add('onb-hop'); }
  const step=ONB_STEPS[ONB.i];
  if(step.type==='single'){ setTimeout(()=>onbNext(),470); }
}

function onbToggleVak(id){
  const arr=ONB.data.vakken, i=arr.indexOf(id);
  const nowOn=i<0;
  if(nowOn) arr.push(id); else arr.splice(i,1);
  _onbHaptic(nowOn?[14]:[8]); _onbSound(nowOn?'correct':'tap');
  const bd=document.getElementById('onb-body');
  const btn=bd&&Array.from(bd.querySelectorAll('.onb-vak')).find(b=>{const oc=b.getAttribute('onclick');return oc&&oc.includes("'"+id+"'");});
  if(btn) btn.classList.toggle('sel',nowOn);
  onbRenderCard();
  const nxt=document.querySelector('#onb-foot .onb-next');
  if(nxt) nxt.disabled=arr.length===0;
}

function onbNext(){
  _onbHaptic([12]); _onbSound('tap');
  ONB.i++;
  if(ONB.i>=ONB_STEPS.length){ onbFinish(); return; }
  onbRender();
}
function onbSkip(){ _onbHaptic([10]); onbNext(); }

// De "profielkaart" (het boekje) die meeloopt
function onbRenderCard(){
  const c=document.getElementById('onb-card'); if(!c)return;
  const d=ONB.data;
  const rows=[];
  if(d.niveau) rows.push(['Niveau', d.niveau.toUpperCase()]);
  if(d.klas) rows.push(['Klas', _onbKlasLabel(d.klas)]);
  if(d.profiel) rows.push(['Profiel', d.profiel.toUpperCase()]);
  if(d.vakken&&d.vakken.length) rows.push(['Vakken', d.vakken.length+' gekozen']);
  if(!rows.length){ c.classList.remove('show'); return; }
  c.classList.add('show');
  c.innerHTML='<div class="onb-card-hd"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> Jouw profiel</div>'
    +rows.map((r,idx)=>`<div class="onb-card-row"${idx===rows.length-1?' style="--in:1"':''}><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');
}

function onbFinish(){
  // (volledige opslag + launch komt in de volgende fase)
  _onbConfetti('gold'); _onbHaptic([20,40,20]);
  const ov=document.getElementById('onb'); if(ov){ ov.classList.remove('on'); setTimeout(()=>{ov.style.display='none';},320); }
}
