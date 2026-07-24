// ═══════ BOT LEADERBOARD SEED ═══════
// Vaste dier-avatars per bot (animalId + stageIdx uit ANIMAL_EVOLUTIONS)
// Eenmalige cleanup: verwijder alle bot-entries uit localStorage
(function _purgeBots(){
  const done='slagio_bots_purged_v1';
  if(localStorage.getItem(done))return;
  ['havo','vwo'].forEach(n=>{
    const key='examenapp_leaderboard_'+n;
    try{
      const entries=JSON.parse(localStorage.getItem(key)||'[]').filter(e=>!e.isBot);
      localStorage.setItem(key,JSON.stringify(entries));
    }catch(e){}
  });
  // Wis alle oude seed-vlaggen
  ['v3','v7','v8','v9','v11','v12'].forEach(v=>localStorage.removeItem('slagio_bots_seeded_'+v));
  localStorage.setItem(done,'1');
})();

// ═══════ OFFLINE INDICATOR ═══════
// Eén niet-blokkerende status-toast (pointer-events:none). Offline blijft staan;
// "weer online" verschijnt kort en verdwijnt vanzelf. Nooit een heel scherm.
(function initOfflineBanner(){
  const banner=document.getElementById('offline-banner');
  if(!banner)return;
  const txt=document.getElementById('offline-banner-text')||banner;
  let hideT=0;
  function toast(msg,online){
    var ico=online?(typeof ICO_CHECK!=='undefined'?ICO_CHECK:''):(typeof ICO_SIGNALOFF!=='undefined'?ICO_SIGNALOFF:'');
    txt.innerHTML=ico+' '+msg;
    banner.classList.toggle('online',!!online);
    banner.classList.add('show');
    if(hideT){clearTimeout(hideT);hideT=0;}
    if(online){hideT=setTimeout(()=>banner.classList.remove('show'),3000);}
  }
  function hide(){banner.classList.remove('show');if(hideT){clearTimeout(hideT);hideT=0;}}
  const dismiss=document.getElementById('offline-dismiss');
  if(dismiss)dismiss.addEventListener('click',hide);
  window.addEventListener('offline',()=>toast('Geen internet — je voortgang wordt lokaal opgeslagen',false));
  window.addEventListener('online',()=>toast('Je bent weer online',true));
  if(!navigator.onLine)toast('Geen internet — je voortgang wordt lokaal opgeslagen',false);
})();

// ═══════ LEADERBOARD ═══════
function getLbKey(){return 'examenapp_leaderboard_'+APP_LEVEL;}
function getLbEntries(){try{return JSON.parse(localStorage.getItem(getLbKey())||'[]');}catch(e){return[];}}
// Client-side sanity-check: houdt onmogelijke scores uit de gedeelde ranglijst.
// (Geen vervanging voor Supabase RLS — wél een rem op corruptie door bugs.)
function _lbEntryValid(e){
  var s=+e.score, g=+e.goed, t=+e.tot;
  if(!isFinite(s)||s<0||s>1000)return false;      // max haalbare score is 1000
  if(!isFinite(t)||t<1||t>60)return false;         // realistisch aantal vragen
  if(!isFinite(g)||g<0||g>t)return false;          // goed kan niet > totaal
  return true;
}
async function saveLeaderboardEntry(entry){
  entry.niveau=APP_LEVEL;
  if(currentUser)entry.uid=currentUser.id;
  // Save to local cache
  let all=getLbEntries();
  all.push(entry);
  all.sort((a,b)=>b.score-a.score);
  if(all.length>200)all=all.slice(0,200);
  localStorage.setItem(getLbKey(),JSON.stringify(all));
  // Save to Supabase global leaderboard (cross-user) — alleen valide scores
  if(currentUser && _lbEntryValid(entry)){
    const base={
      user_id:currentUser.id,
      naam:entry.naam,avatar:entry.avatar,
      animal_id:entry.animalId||null,stage_idx:entry.stageIdx??null,
      featured_badge_id:entry.featuredBadgeId||null,
      vak:entry.vak,vak_naam:entry.vakNaam,
      domein_id:entry.domeinId||null,domein_naam:entry.domeinNaam||null,
      score:entry.score,correct:entry.goed,total:entry.tot,
      avg_tijd:entry.avgTijd||null,
      niveau:APP_LEVEL
    };
    // Try with badge_ids (requires badge_ids text[] column); fall back without if column missing
    try{
      await SB.from('leaderboard').insert({...base,badge_ids:entry.badgeIds||[]});
    }catch(e){
      if(String(e?.message||e).includes('badge_ids')){
        try{await SB.from('leaderboard').insert(base);}catch(e2){console.warn('leaderboard save error:',e2);}
      }else{console.warn('leaderboard save error:',e);}
    }
  }
  // Klas-ranglijst: tel deze score mee als de leerling in een klas zit.
  try{ if(typeof klasScoreSave==='function') klasScoreSave(entry); }catch(e){}
}
// ═══════ LEADERBOARD-BOTS (opvulling) ═══════
// Twee smaken: accounts die duidelijk bots zijn (robot-namen + robot-avatar,
// vaak strakke ronde scores) en accounts die op echte leerlingen lijken
// (gewone naam + dier-avatar). Puur voor opvulling; ze worden lokaal
// samengevoegd met de echte Supabase-scores en ranken gewoon mee.
const _BOT_VAKNAAM={nl:'Nederlands',wa:'Wiskunde A',wb:'Wiskunde B',bi:'Biologie',sk:'Scheikunde',na:'Natuurkunde',en:'Engels',ec:'Economie',be:'Bedrijfseconomie',gs:'Geschiedenis',ak:'Aardrijkskunde',mw:'Maatschappijwetenschappen',du:'Duits',fr:'Frans',gr:'Grieks',la:'Latijn',in:'Informatica'};
// Evolutie-stage die plausibel bij de score past (zoals bij echte leerlingen
// de stage met XP meegroeit). Max 5 — de allerhoogste stage blijft voor echte
// toppers.
function _botStage(score){return score>=900?5:score>=750?4:score>=600?3:score>=450?2:1;}
function _mkBots(niveau,rows){
  return rows.map((r,i)=>{
    // Mens-achtige bots hebben een animalId (7e veld) → zelfde dier-avatar +
    // evolutie-stage als echte leerlingprofielen. Robot-bots houden hun
    // robot-emoji als avatar, zoals de bots van het 2026-leaderboard.
    const [naam,avatar,score,goed,vak,avgTijd,animalId]=r;
    return{uid:'bot_'+niveau+'_'+i,naam,
      avatar:animalId?null:avatar,
      animalId:animalId||null,stageIdx:animalId?_botStage(score):null,
      featuredBadgeId:null,badgeIds:[],vak,vakNaam:_BOT_VAKNAAM[vak]||vak,
      domeinId:null,domeinNaam:null,score,goed,tot:10,avgTijd,niveau,
      date:'2026-05-'+String(9+(i%19)).padStart(2,'0'),_bot:true};
  });
}
const LB_BOTS={
  havo:_mkBots('havo',[
    ['OefenBot 3000','🤖',940,10,'wa',5],['Sanne','',905,10,'bi',7,'vos'],
    ['QuizMachine','⚙️',890,10,'na',4],['Daan','',865,9,'ec',8,'wolf'],
    ['StudieBot_v2','🤖',850,9,'nl',5],['Fenna','',815,9,'en',9,'uil'],
    ['Lucas','',780,9,'gs',10,'haai'],['ExamenBot','🤖',760,8,'sk',6],
    ['Noor','',720,8,'ak',11,'vlinder'],['Sem','',690,8,'wb',9,'tijger'],
    ['RoboLeerling','🤖',655,8,'bi',7],['Julia K.','',610,7,'nl',12,'eenhoorn'],
    ['Bram','',560,7,'en',13,'olifant'],['AI-Tutor','🤖',510,7,'ec',6],
    ['Milan','',450,6,'gs',12,'leeuw'],['Yara','',380,6,'bi',14,'adelaar'],
  ]),
  vwo:_mkBots('vwo',[
    ['OefenBot 3000','🤖',945,10,'wb',5],['Thijs','',910,10,'na',7,'wolf'],
    ['QuizMachine','⚙️',895,10,'sk',4],['Isa','',870,9,'bi',8,'uil'],
    ['StudieBot_v2','🤖',855,9,'wa',5],['Lars','',820,9,'ec',9,'haai'],
    ['Fenna','',785,9,'gs',10,'vos'],['ExamenBot','🤖',765,8,'in',6],
    ['Tess','',725,8,'en',11,'vlinder'],['Sven','',695,8,'du',9,'draak'],
    ['RoboLeerling','🤖',660,8,'na',7],['Nora','',615,7,'la',12,'eenhoorn'],
    ['Jesse','',565,7,'gr',13,'octopus'],['AI-Tutor','🤖',515,7,'wa',6],
    ['Evi','',455,6,'mw',12,'leeuw'],['Guus','',385,6,'fr',14,'adelaar'],
  ]),
};
async function loadLeaderboardFromSupabase(){
  let remote=[];
  try{
    const {data,error}=await SB.from('leaderboard').select('*').eq('niveau',APP_LEVEL).order('score',{ascending:false}).limit(200);
    if(!error&&data){
      remote=data.map(d=>({
        naam:d.naam,avatar:d.avatar,
        animalId:d.animal_id||null,stageIdx:d.stage_idx??null,
        featuredBadgeId:d.featured_badge_id||null,
        badgeIds:d.badge_ids||[],
        vak:d.vak,vakNaam:d.vak_naam,
        domeinId:d.domein_id||null,domeinNaam:d.domein_naam||null,
        score:d.score,goed:d.correct,tot:d.total,uid:d.user_id,
        avgTijd:d.avg_tijd||null,niveau:d.niveau,date:d.created_at?.slice(0,10)
      }));
    }
  }catch(e){console.warn('leaderboard load error:',e);}
  // Voeg bots toe als opvulling (altijd, ook als Supabase leeg/onbereikbaar is).
  const bots=(LB_BOTS[APP_LEVEL]||[]);
  const merged=[...remote,...bots].filter(e=>e.score<=1000&&(e.tot||0)>5).sort((a,b)=>b.score-a.score).slice(0,200);
  localStorage.setItem(getLbKey(),JSON.stringify(merged));
}
// ═══════ LB PROFILE ═══════
function getTierLabel(score){
  if(score>=850)return'🏆 Elite';
  if(score>=650)return'⚡ Expert';
  if(score>=400)return'📚 Gevorderd';
  if(score>=150)return'✏️ Leerling';
  return'🌱 Beginner';
}
function getTierClass(score){
  if(score>=850)return'lb-tier-elite';
  if(score>=650)return'lb-tier-expert';
  if(score>=400)return'lb-tier-gevorderd';
  if(score>=150)return'lb-tier-leerling';
  return'lb-tier-beginner';
}
function openLbProfile(naam){
  const allEntries=getLbEntries().filter(e=>e.naam===naam);
  if(!allEntries.length)return;
  const avatarHtml=getLbAvatarHtml(allEntries[0],50);
  const niveau=allEntries[0]?.niveau?.toUpperCase()||'';
  // Aggregate stats
  const bestScore=Math.max(...allEntries.map(e=>e.score));
  const totalGoed=allEntries.reduce((s,e)=>s+(e.goed||0),0);
  const totalTot=allEntries.reduce((s,e)=>s+(e.tot||0),0);
  const accuracy=totalTot>0?Math.round(totalGoed/totalTot*100):0;
  const avgSpeed=allEntries.length?+(allEntries.reduce((s,e)=>s+(e.avgTijd||0),0)/allEntries.length).toFixed(1):0;
  const totalQuizzes=allEntries.length;
  const favVakMap={};
  allEntries.forEach(e=>{favVakMap[e.vakNaam]=(favVakMap[e.vakNaam]||0)+1;});
  const favVak=Object.entries(favVakMap).sort((a,b)=>b[1]-a[1])[0]?.[0]||'–';
  const dates=allEntries.map(e=>e.date).filter(Boolean).sort();
  const actief=dates[0]||'–';
  const recent=[...allEntries].sort((a,b)=>b.score-a.score).slice(0,3);
  const tierLabel=getTierLabel(bestScore);
  const tierCls=getTierClass(bestScore);
  const recentHtml=recent.map(e=>`
    <div class="lbp-recent-row">
      <span class="lbp-recent-vak">${e.vakNaam}${e.domeinId?` · D${e.domeinId}`:''}</span>
      <span style="display:flex;align-items:center;gap:8px;flex-shrink:0">
        <span style="font-size:11px;color:var(--mu)">${e.goed||0}/${e.tot||0} goed</span>
        <span class="lbp-recent-score">${e.score} pts</span>
      </span>
    </div>
  `).join('');
  // ── Badge sectie ──────────────────────────────────
  const prof2=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  const myNaamLbp=prof2.naam||'';
  const isMe=(myNaamLbp&&naam===myNaamLbp)||(typeof currentUser!=='undefined'&&currentUser&&(currentUser.user_metadata?.naam===naam||currentUser.email?.split('@')[0]===naam));
  let badgeSectionHtml='';
  if(isMe){
    const achieved=getAchieved();
    const earned=ALL_BADGES.filter(b=>achieved[b.id]);
    if(earned.length){
      const items=earned.map(b=>`<div class="lbp-badge-item rarity-${b.rarity}" title="${b.label} - ${b.tip}"><span class="lbp-badge-emoji">${b.emoji}</span><span class="lbp-badge-lbl">${b.label}</span></div>`).join('');
      badgeSectionHtml=`<p class="lbp-section-title">Jouw badges (${earned.length}/${ALL_BADGES.length})</p><div class="lbp-badges-grid">${items}</div>`;
    }
  } else {
    // Show all earned badges - from stored badgeIds (real players & bots), else fall back to featured only
    const allBadgeIds=[...new Set(allEntries.flatMap(e=>e.badgeIds||[]))];
    if(allBadgeIds.length){
      const earnedBadges=allBadgeIds.map(id=>ALL_BADGES.find(b=>b.id===id)).filter(Boolean);
      if(earnedBadges.length){
        const items=earnedBadges.map(b=>`<div class="lbp-badge-item rarity-${b.rarity}" title="${b.label} - ${b.tip}"><span class="lbp-badge-emoji">${b.emoji}</span><span class="lbp-badge-lbl">${b.label}</span></div>`).join('');
        badgeSectionHtml=`<p class="lbp-section-title">Badges (${earnedBadges.length})</p><div class="lbp-badges-grid">${items}</div>`;
      }
    } else {
      const featId=allEntries[0]?.featuredBadgeId;
      const featB=featId?ALL_BADGES.find(b=>b.id===featId):null;
      if(featB){
        badgeSectionHtml=`<p class="lbp-section-title">Uitgelichte badge</p>
          <div class="lbp-featured-badge rarity-${featB.rarity}">
            <span style="font-size:30px;line-height:1">${featB.emoji}</span>
            <div><div style="font-size:13px;font-weight:700;color:var(--dk)">${featB.label}</div><div style="font-size:11px;color:var(--mu);margin-top:2px">${featB.tip} · <em>${RARITY_LABEL[featB.rarity]||''}</em></div></div>
          </div>`;
      }
    }
  }
  const el=document.getElementById('lbp-overlay');
  el.innerHTML=`<div class="lbp-card" onclick="event.stopPropagation()">
    <div class="lbp-drag"></div>
    <button class="lbp-close" onclick="closeLbProfile()">✕</button>
    <div class="lbp-header">
      <div class="lbp-av-wrap"><div class="lbp-av">${avatarHtml}</div>${getLbBadgeOverlay(allEntries[0]?.featuredBadgeId)}</div>
      <div class="lbp-headinfo">
        <div class="lbp-naam">${escapeHtml(naam)}</div>
        <div class="lbp-chips">
          ${niveau?`<span class="lb-niveau-chip">${niveau}</span>`:''}
          <span class="lb-tier ${tierCls}">${tierLabel}</span>
        </div>
      </div>
    </div>
    <div class="lbp-stats">
      <div class="lbp-stat">
        <div class="lbp-stat-val">${bestScore}</div>
        <div class="lbp-stat-lbl">⚡ Beste score</div>
        <div class="lbp-bar-wrap" style="margin-top:7px"><div class="lbp-bar-fill" style="width:${bestScore/10}%"></div></div>
      </div>
      <div class="lbp-stat">
        <div class="lbp-stat-val">${accuracy}%</div>
        <div class="lbp-stat-lbl">🎯 Nauwkeurigheid</div>
        <div class="lbp-bar-wrap" style="margin-top:7px"><div class="lbp-bar-fill" style="width:${accuracy}%"></div></div>
      </div>
      <div class="lbp-stat">
        <div class="lbp-stat-val">${avgSpeed}s</div>
        <div class="lbp-stat-lbl">⏱ Gem. reactietijd</div>
      </div>
      <div class="lbp-stat">
        <div class="lbp-stat-val">${totalQuizzes}</div>
        <div class="lbp-stat-lbl">📋 Quizzes</div>
      </div>
    </div>
    <p class="lbp-section-title">Statistieken</p>
    <div class="lbp-detail-row"><span class="lbp-detail-key">❤️ Favoriete vak</span><span class="lbp-detail-val">${favVak}</span></div>
    <div class="lbp-detail-row"><span class="lbp-detail-key">📅 Actief sinds</span><span class="lbp-detail-val">${actief}</span></div>
    <div class="lbp-detail-row"><span class="lbp-detail-key">✅ Totaal goed</span><span class="lbp-detail-val">${totalGoed} / ${totalTot} vragen</span></div>
    ${recentHtml?`<p class="lbp-section-title" style="margin-top:16px">Beste quizzes</p><div style="display:flex;flex-direction:column;gap:6px">${recentHtml}</div>`:''}
    ${badgeSectionHtml}
  </div>`;
  el.classList.add('open');
  setTimeout(()=>{el.querySelector('.lbp-bar-fill')&&el.querySelectorAll('.lbp-bar-fill').forEach(b=>{const w=b.style.width;b.style.width='0';setTimeout(()=>b.style.width=w,50);});},50);
}
function closeLbProfile(){
  document.getElementById('lbp-overlay').classList.remove('open');
}

/* ── PDF VIEWER ──────────────────────────────────────── */
let _pdfCurrentUrl='';
function openPdfViewer(url,title){
  trackEvent('oud_examen_pdf',{title:title||null,pdf:url?.split('/').pop()||null});
  _pdfCurrentUrl=url;
  const modal=document.getElementById('pdf-viewer-modal');
  const iframe=document.getElementById('pdf-viewer-iframe');
  const loading=document.getElementById('pdf-modal-loading');
  const error=document.getElementById('pdf-modal-error');
  const newtab=document.getElementById('pdf-modal-newtab');
  const errOpen=document.getElementById('pdf-error-open');
  document.getElementById('pdf-modal-title').textContent=title||'PDF';
  newtab.href=url;
  errOpen.href=url;
  // Reset state
  loading.classList.remove('hidden');
  error.classList.remove('show');
  iframe.src='about:blank';
  modal.classList.add('open');
  document.body.style.overflow='hidden';
  // Small delay so modal renders first, then load PDF
  setTimeout(()=>{
    iframe.onload=function(){
      // If the src is still about:blank (reset), ignore
      if(iframe.src==='about:blank')return;
      loading.classList.add('hidden');
    };
    iframe.onerror=function(){
      loading.classList.add('hidden');
      error.classList.add('show');
    };
    iframe.src=url;
    // Timeout fallback - if PDF doesn't load in 12s, show error
    setTimeout(()=>{
      if(!loading.classList.contains('hidden')){
        loading.classList.add('hidden');
        error.classList.add('show');
      }
    },12000);
  },80);
}
function closePdfViewer(){
  const modal=document.getElementById('pdf-viewer-modal');
  const iframe=document.getElementById('pdf-viewer-iframe');
  modal.classList.remove('open');
  document.body.style.overflow='';
  // Unload iframe to stop download / prevent memory leak
  setTimeout(()=>{iframe.src='about:blank';},200);
}
// Close PDF viewer on Escape key
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&document.getElementById('pdf-viewer-modal').classList.contains('open')){
    closePdfViewer();
  }
});

let lbVakFilter='all';
function renderLeaderboard(){
  loadLeaderboardFromSupabase().then(()=>_renderLbWithData());
}
function _renderLbWithData(){
  // Clean up any stored entries with score > 1000
  try{const key=getLbKey();const stored=getLbEntries();const cleaned=stored.filter(e=>e.score<=1000);if(cleaned.length!==stored.length)localStorage.setItem(key,JSON.stringify(cleaned));}catch(e){}
  const all=getLbEntries();
  const prof=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  const myUid=currentUser?currentUser.id:null;
  const myNaam=prof.naam||null;

  // Build filter buttons (alleen vakken van huidig niveau)
  const vakSet=new Set(all.map(e=>e.vak));
  const filterEl=document.getElementById('lb-filter');
  filterEl.innerHTML='';
  const allBtn=document.createElement('button');
  allBtn.className='lb-filter-btn'+(lbVakFilter==='all'?' active':'');
  allBtn.textContent='Alle vakken';
  allBtn.onclick=()=>{lbVakFilter='all';renderLeaderboard();};
  filterEl.appendChild(allBtn);
  const VAKKEN_MAP={};getVK().forEach(v=>{VAKKEN_MAP[v.id]=v;});
  [...vakSet].forEach(vid=>{
    const vak=VAKKEN_MAP[vid];if(!vak)return;
    const btn=document.createElement('button');
    btn.className='lb-filter-btn'+(lbVakFilter===vid?' active':'');
    btn.textContent=vak.code;
    btn.onclick=()=>{lbVakFilter=vid;renderLeaderboard();};
    filterEl.appendChild(btn);
  });

  // Niveau badge + dynamic subtitle
  const badge=document.getElementById('lb-niveau-badge');
  const VAKKEN_LABEL=lbVakFilter==='all'?'Alle vakken':(VAKKEN_MAP[lbVakFilter]?VAKKEN_MAP[lbVakFilter].naam:lbVakFilter);
  if(badge)badge.textContent=APP_LEVEL.toUpperCase()+' 2026 · '+VAKKEN_LABEL;
  const subtitleEl=document.getElementById('lb-subtitle');
  const playerCount=[...new Set(all.map(e=>e.uid||e.naam))].length;
  if(subtitleEl){
    if(playerCount===0)subtitleEl.textContent='Nog geen spelers - wees de eerste!';
    else if(lbVakFilter==='all')subtitleEl.textContent=`Snelle quiz · beste score per speler · ${playerCount} deelnemer${playerCount===1?'':'s'}`;
    else subtitleEl.textContent=`Snelle quiz · beste ${VAKKEN_LABEL}-score per speler`;
  }

  // Filter entries (remove invalid scores above 1000)
  const valid=all.filter(e=>e.score<=1000);
  const filtered=lbVakFilter==='all'?valid:valid.filter(e=>e.vak===lbVakFilter);

  // Stap 1: beste score per naam+vak+domein (verwijder duplicaten per quiz)
  const entryMap={};
  filtered.forEach(e=>{
    const k=`${e.naam}|${e.vak}|${e.domeinId}`;
    if(!entryMap[k]||e.score>entryMap[k].score)entryMap[k]=e;
  });
  // Stap 2: deduplicate per gebruiker - toon elke speler maar één keer (beste score ooit)
  const userMap={};
  Object.values(entryMap).forEach(e=>{
    const uk=e.uid||e.naam;
    if(!userMap[uk]||e.score>userMap[uk].score)userMap[uk]=e;
  });
  const deduped=Object.values(userMap).sort((a,b)=>b.score-a.score);
  const top=deduped.slice(0,25);

  // My best score in current filter (match on uid if available, else name)
  const myEntries=filtered.filter(e=>myUid?(e.uid===myUid):(myNaam&&e.naam===myNaam));
  const myBest=myEntries.sort((a,b)=>b.score-a.score)[0]||null;
  const myRank=myBest?deduped.findIndex(e=>(myUid?e.uid===myUid:e.naam===myBest.naam))+1:null;
  const myBox=document.getElementById('lb-myscore-box');
  const myLiveAvatar32=getMyCurrentAvatarHtml(32);
  const myLiveAvatar28=getMyCurrentAvatarHtml(28);
  const myBestBadgeId=getBestBadgeId(getAchieved());
  if(myBest&&prof.naam){
    myBox.innerHTML=`<div class="lb-my-score">
      <div class="lb-my-av" style="position:relative">${myLiveAvatar32}${getLbBadgeOverlay(myBestBadgeId,'var(--or)')}</div>
      <div class="lb-my-info">
        <div class="lb-my-title">Jouw beste score</div>
        <div class="lb-my-name">${escapeHtml(prof.naam)}</div>
        <div class="lb-my-det">${myBest.vakNaam}${myBest.domeinId?` · D${myBest.domeinId}: ${myBest.domeinNaam}`:''}${myBest.avgTijd?` · gem. ${myBest.avgTijd}s`:''} · ${myBest.goed}/${myBest.tot} goed</div>
      </div>
      <div class="lb-my-score-box"><div class="lb-my-score-n">${myBest.score}</div><div class="lb-my-score-l">rank #${myRank||'?'}</div></div>
    </div>`;
  } else {
    myBox.innerHTML='';
  }

  // Helper: safe percentage
  const safePct=(goed,tot)=>tot>0?Math.round(goed/tot*100):0;
  const lbMeta=(e)=>`${e.vakNaam}${e.domeinId?` · D${e.domeinId}`:''}${e.avgTijd?` · gem. ${e.avgTijd}s`:''} · ${safePct(e.goed,e.tot)}% goed`;
  const lbMeSpan=(isMe)=>isMe?' <span style="font-size:10px;color:var(--or)">(jij)</span>':'';
  // Helper: tier badge from score
  function tierBadge(score){
    if(score>=850)return`<span class="lb-tier lb-tier-elite">🏆 Elite</span>`;
    if(score>=650)return`<span class="lb-tier lb-tier-expert">⚡ Expert</span>`;
    if(score>=400)return`<span class="lb-tier lb-tier-gevorderd">📚 Gevorderd</span>`;
    if(score>=150)return`<span class="lb-tier lb-tier-leerling">✏️ Leerling</span>`;
    return`<span class="lb-tier lb-tier-beginner">🌱 Beginner</span>`;
  }
  // Helper: niveau chip
  const niveauChip=(e)=>e.niveau?`<span class="lb-niveau-chip">${e.niveau.toUpperCase()}</span>`:'';
  // Helper: rank colour class
  const rankCls=(r)=>r===1?'top1':r===2?'top2':r===3?'top3':'';
  // Helper: premium stage chip — Goud (voorlaatste) en Ultiem (hoogste)
  const stageBadge=(e)=>{
    const idx=e.stageIdx!=null?e.stageIdx:0;
    const _u=ANIM_THRESHOLDS.length-1;
    if(idx>=_u)return`<span class="lb-stage-chip lb-sc-goud">👑 ${ANIM_STAGE_NAMES[_u]||'Ultiem'}</span>`;
    if(idx===_u-1)return`<span class="lb-stage-chip lb-sc-goud">🏅 ${ANIM_STAGE_NAMES[_u-1]||'Goud'}</span>`;
    return'';
  };

  // Podium (top 3)
  const podEl=document.getElementById('lb-podium');
  if(top.length>=3){
    const medals=['🥇','🥈','🥉'];
    const classes=['gold','silver','bronze'];
    const order=[1,0,2];
    const heights=[60,80,50];
    let podHtml='';
    order.forEach((ri,pi)=>{
      const e=top[ri];if(!e)return;
      const isMe=myNaam&&e.naam===myNaam;
      podHtml+=`<div class="lb-pod lb-clickable" data-lbname="${escapeHtml(e.naam)}" style="cursor:pointer">
        <div class="lb-pod-medal">${medals[ri]}</div>
        <div style="position:relative;display:inline-block">
          <div class="lb-pod-avatar ${classes[ri]}" style="${isMe?'border-color:var(--or)':''}">${isMe?myLiveAvatar32:getLbAvatarHtml(e,32)}</div>
          <div style="position:absolute;bottom:-3px;right:-3px;width:18px;height:18px;border-radius:50%;background:${['#F59E0B','#9CA3AF','#CD7C3F'][ri]};color:#fff;font-size:9px;font-weight:900;display:flex;align-items:center;justify-content:center;border:2px solid var(--bg)">${ri+1}</div>
          ${getLbBadgeOverlay(isMe?myBestBadgeId:e.featuredBadgeId)}
        </div>
        <div class="lb-pod-bar ${classes[ri]}" style="height:${heights[pi]}px">${e.score}</div>
        <div class="lb-pod-name">${escapeHtml(e.naam)}</div>
        <div class="lb-pod-score">${e.goed}/${e.tot} · ${safePct(e.goed,e.tot)}%</div>
        <div style="margin-top:5px;display:flex;gap:4px;justify-content:center;flex-wrap:wrap">${niveauChip(e)}${tierBadge(e.score)}${stageBadge(e)}</div>
      </div>`;
    });
    podEl.innerHTML=podHtml;
  } else {
    podEl.innerHTML='';
  }

  // List
  const listEl=document.getElementById('lb-list');
  _showLbResetPopup();
  if(top.length===0){
    listEl.innerHTML=`<div class="lb-empty">
      <div class="lb-empty-orb">🏆</div>
      <div class="lb-empty-title">Wees de eerste!</div>
      <div class="lb-empty-sub">Het bord is leeg - jij kunt de #1 positie pakken. Maak een snelle quiz en zet je score neer.</div>
      <div class="lb-empty-tiers">
        <div class="lb-empty-tier"><div class="lb-empty-tier-icon">🌱</div><div class="lb-empty-tier-name">Beginner</div><div class="lb-empty-tier-pts">&lt;150</div></div>
        <div class="lb-empty-tier"><div class="lb-empty-tier-icon">✏️</div><div class="lb-empty-tier-name">Leerling</div><div class="lb-empty-tier-pts">150+</div></div>
        <div class="lb-empty-tier"><div class="lb-empty-tier-icon">📚</div><div class="lb-empty-tier-name">Gevorderd</div><div class="lb-empty-tier-pts">400+</div></div>
        <div class="lb-empty-tier"><div class="lb-empty-tier-icon">⚡</div><div class="lb-empty-tier-name">Expert</div><div class="lb-empty-tier-pts">650+</div></div>
        <div class="lb-empty-tier"><div class="lb-empty-tier-icon">🏆</div><div class="lb-empty-tier-name">Elite</div><div class="lb-empty-tier-pts">850+</div></div>
      </div>
      <button class="lb-empty-cta" onclick="show('sc-home')">🎯 Start een quiz</button>
    </div>`;
    return;
  }
  const showPodium=top.length>=3;
  let listHtml='';
  top.forEach((e,i)=>{
    const rank=i+1;
    const isMe=myNaam&&e.naam===myNaam;
    if(showPodium&&rank<=3)return;
    listHtml+=`<div class="lb-row${isMe?' me':''} lb-clickable" data-lbname="${escapeHtml(e.naam)}">
      <div class="lb-rank-col ${rankCls(rank)}">${rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':'#'+rank}</div>
      <div class="lb-av-wrap">
        <div class="lb-av">${isMe?myLiveAvatar28:getLbAvatarHtml(e,28)}</div>
        ${getLbBadgeOverlay(isMe?myBestBadgeId:e.featuredBadgeId)}
      </div>
      <div class="lb-info">
        <div class="lb-name">${escapeHtml(e.naam)}${lbMeSpan(isMe)}${niveauChip(e)}${tierBadge(e.score)}${stageBadge(e)}</div>
        <div class="lb-meta">${lbMeta(e)}</div>
      </div>
      <div class="lb-score"><div class="lb-score-num">${e.score}</div><div class="lb-score-sub">pts</div><div style="font-size:9px;color:var(--mu);margin-top:2px">Bekijk →</div></div>
    </div>`;
  });
  listEl.innerHTML=listHtml||'';

  // Attach click handlers via delegation (avoids inline-onclick quote issues)
  document.querySelectorAll('.lb-clickable').forEach(el=>{
    el.addEventListener('click',()=>openLbProfile(el.dataset.lbname));
  });
}

// ═══════ LB RESET POPUP ═══════
function _showLbResetPopup(){
  const KEY='slagio_lb_reset_v2026';
  try{if(localStorage.getItem(KEY))return;}catch(e){return;}
  const el=document.createElement('div');
  el.id='lb-reset-popup';
  el.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(6px);animation:_lbFdIn .2s ease';
  el.innerHTML=`
    <style>
      @keyframes _lbFdIn{from{opacity:0}to{opacity:1}}
      @keyframes _lbSlUp{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}
      .lb-reset-sheet{background:var(--s);border-radius:28px 28px 0 0;padding:10px 24px 44px;width:100%;max-width:500px;animation:_lbSlUp .28s cubic-bezier(.22,1,.36,1)}
      .lb-reset-pill{width:40px;height:4px;border-radius:2px;background:var(--bo);margin:0 auto 22px}
      .lb-reset-icon{font-size:44px;text-align:center;margin-bottom:12px;line-height:1}
      .lb-reset-title{font-family:var(--font-head,sans-serif);font-size:22px;font-weight:900;color:var(--dk,#fff);text-align:center;margin-bottom:8px}
      .lb-reset-body{font-size:13px;color:var(--mu,#8896a8);text-align:center;line-height:1.6;margin-bottom:24px}
      .lb-reset-body strong{color:var(--dk,#fff)}
      .lb-reset-cta{display:block;width:100%;padding:15px;background:var(--or,#f97316);color:#fff;border:none;border-radius:16px;font-family:var(--font-head,sans-serif);font-size:16px;font-weight:800;cursor:pointer;box-shadow:0 6px 24px rgba(249,115,22,.35);margin-bottom:10px;transition:opacity .15s}
      .lb-reset-cta:hover{opacity:.88}
      .lb-reset-skip{display:block;width:100%;padding:10px;background:none;border:none;color:var(--mu,#8896a8);font-size:13px;cursor:pointer}
    </style>
    <div class="lb-reset-sheet">
      <div class="lb-reset-pill"></div>
      <div class="lb-reset-icon">🏆</div>
      <div class="lb-reset-title">Nieuw schooljaar!</div>
      <div class="lb-reset-body">
        De scores zijn <strong>gereset op 1 juni 2026</strong> voor het nieuwe schooljaar 2026–2027.<br>
        Het bord is leeg - jij kunt als eerste de #1 pakken.
      </div>
      <button class="lb-reset-cta" id="lb-reset-btn">🎯 Claim de #1 plek</button>
      <button class="lb-reset-skip" id="lb-reset-skip">Sluiten</button>
    </div>`;
  document.body.appendChild(el);
  const close=()=>{
    try{localStorage.setItem(KEY,'1');}catch(e){}
    el.style.animation='_lbFdIn .18s ease reverse';
    setTimeout(()=>el.remove(),180);
  };
  document.getElementById('lb-reset-btn').onclick=close;
  document.getElementById('lb-reset-skip').onclick=close;
  el.addEventListener('click',e=>{if(e.target===el)close();});
}

// ═══════ COUNTDOWN ═══════
// Alle aankomende examens die de leerling zelf koos: 1e-tijdvak-vakken (mijn vakken),
// aangevinkte herkansingen (2e tijdvak) en eigen 3e-tijdvak-data. Niks gekozen = lege lijst.
function getUpcomingExams(){
  try{
    const now=new Date();
    const niveauVakIds=new Set(getVK().map(v=>v.id));
    const mijn=getMijnVakken();
    const herk=(typeof getHerkansing==='function')?getHerkansing():[];
    const tv3=(typeof getTV3==='function')?getTV3():[];
    const cands=[];
    EXAM_SCHEDULE.forEach(ex=>{
      if(ex.niveau&&ex.niveau!==APP_LEVEL)return;
      if(ex.vakId&&!niveauVakIds.has(ex.vakId))return;
      const key=ex.vakId||ex.vak;
      if(!ex.tijdvak){ if(mijn.includes(key)) cands.push({...ex,dt:new Date(ex.datum+'T'+ex.tijd.split('–')[0]+':00+02:00')}); }
      else if(ex.tijdvak===2){ if(herk.includes(key)) cands.push({...ex,dt:new Date(ex.datum+'T'+ex.tijd.split('–')[0]+':00+02:00')}); }
    });
    // 1e-tijdvak-examens 2027 meenemen zodat de teller na 2026 doorrolt.
    if(typeof EXAM_SCHEDULE_2027!=='undefined'){
      EXAM_SCHEDULE_2027.forEach(ex=>{
        if(ex.niveau&&ex.niveau!==APP_LEVEL)return;
        if(ex.vakId&&!niveauVakIds.has(ex.vakId))return;
        const key=ex.vakId||ex.vak;
        if(mijn.includes(key)) cands.push({...ex,dt:new Date(ex.datum+'T'+ex.tijd.split('–')[0]+':00+02:00')});
      });
    }
    tv3.forEach(e=>cands.push({vak:e.vak,vakId:e.vakId,datum:e.datum,tijd:e.tijd||'13:30',duur:'',tijdvak:3,dt:new Date(e.datum+'T'+(e.tijd||'13:30')+':00+02:00')}));
    return cands.filter(e=>e.dt>now).sort((a,b)=>a.dt-b.dt);
  }catch(e){return [];}
}
// Eerstvolgende voor de countdown-timer
function getCountdownTarget(){const u=getUpcomingExams();return u.length?u[0]:null;}
function updateCountdown(){
  const setEl=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};
  // Apply level glow class
  const cdEl=document.getElementById('countdown');
  if(cdEl){cdEl.classList.remove('cd-havo','cd-vwo');cdEl.classList.add(APP_LEVEL==='vwo'?'cd-vwo':'cd-havo');}
  // Dynamic target
  const tgt=getCountdownTarget();
  const labelEl=document.getElementById('cd-label');
  const subEl=document.getElementById('cd-sub');
  if(!tgt){
    const now=new Date();
    const nogExamens=EXAM_SCHEDULE.some(ex=>(!ex.niveau||ex.niveau===APP_LEVEL)&&new Date(ex.datum+'T'+ex.tijd.split('–')[0]+':00+02:00')>now);
    if(nogExamens){
      setEl('cd-title','Stel je volgende examen in');
      if(labelEl)labelEl.textContent='Aftellen';
      if(subEl)subEl.textContent='Kies je herkansing of 3e tijdvak voor een live aftelling';
    }else{
      setEl('cd-title','Alle examens klaar - goed bezig!');
      if(labelEl)labelEl.textContent='Geslaagd-modus';
      if(subEl)subEl.textContent='Je hebt alle examens gehad';
    }
    ['cd-d','cd-h','cd-m','cd-s','cd-days-text'].forEach(id=>setEl(id,'–'));
    if(cdEl){cdEl.classList.remove('cd-panic');cdEl.classList.add('cd-empty');}
    const panicEl=document.getElementById('cd-panic-msg');if(panicEl)panicEl.style.display='none';
    return;
  }
  if(cdEl)cdEl.classList.remove('cd-empty');
  // Update vak name + formatted date
  if(labelEl)labelEl.textContent=tgt.vak;
  if(subEl){
    const dn=['zo','ma','di','wo','do','vr','za'];
    const mn=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
    subEl.textContent=dn[tgt.dt.getDay()]+' '+tgt.dt.getDate()+' '+mn[tgt.dt.getMonth()]+' · '+tgt.tijd;
  }
  const now=new Date();
  const diff=tgt.dt-now;
  if(diff<=0){
    setEl('cd-title','Het examen is begonnen! 🎓');
    ['cd-d','cd-h','cd-m','cd-s','cd-days-text'].forEach(id=>setEl(id,'0'));
    return;
  }
  const d=Math.floor(diff/(1000*60*60*24));
  const h=Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const m=Math.floor((diff%(1000*60*60))/(1000*60));
  const s=Math.floor((diff%(1000*60))/1000);
  setEl('cd-d',d);setEl('cd-h',String(h).padStart(2,'0'));
  setEl('cd-m',String(m).padStart(2,'0'));setEl('cd-s',String(s).padStart(2,'0'));
  setEl('cd-days-text',d);
  // ── PANIEKMODUS: <1 dag ──
  const panicMsgs=['😱 MORGEN IS HET EXAMEN!','💀 Geen tijd meer voor Netflix.','📚 Nu studeren of nooit.','🚨 NOODTOESTAND ACTIEF','😰 Slapen is voor later.','🔥 Alles op het spel!','⏰ De klok tikt... SNEL!'];
  const panicEl=document.getElementById('cd-panic-msg');
  if(d<1){
    if(cdEl)cdEl.classList.add('cd-panic');
    if(panicEl){panicEl.style.display='';panicEl.textContent=panicMsgs[Math.floor(Date.now()/2500)%panicMsgs.length];}
  }else{
    if(cdEl)cdEl.classList.remove('cd-panic');
    if(panicEl)panicEl.style.display='none';
  }
}
// updateCountdown() is called after EXAM_SCHEDULE is defined (below)

// ═══════ PROGRESS TRACKING ═══════
function getProgress(){
  try{return JSON.parse(localStorage.getItem('examenapp_'+lvlCol('progress'))||'{}');}
  catch(e){return {};}
}
function saveProgress(vakId,domeinId,mode,score,total){
  const p=getProgress();
  const key=`${vakId}_${domeinId}_${mode}`;
  const prevBest=p[key]?p[key].best:0;
  if(!p[key])p[key]={best:0,total:total,attempts:0};
  p[key].attempts++;
  const isNewRecord=score>prevBest&&score>0;
  if(score>p[key].best)p[key].best=score;
  p[key].total=total;
  cloudSet(lvlCol('progress'),p);
  // Sla oefentijdstip op voor knowledge decay indicator
  try{setDecayNow(vakId,domeinId);}catch(e){}
  // Studieplan: check of dit een geplande taak afrondt
  try{spCheckAfterQuiz(vakId,domeinId,mode,score,total);}catch(e){}
  // Auto-tick vandaag-taken als domein mastery-drempel (70%) gepasseerd wordt
  if(total>=5&&score>0){
    try{
      const newPct=score/total;const oldPct=prevBest/(total||1);
      if(newPct>=0.7&&oldPct<0.7){
        const todayStr=new Date().toISOString().slice(0,10);
        const plan=spGetPlan();
        if(plan)(plan.tasks||[]).filter(t=>t.dateStr===todayStr&&t.vakId===vakId&&t.domId===domeinId).forEach(t=>{
          const k=`${todayStr}_${t.vakId}_${t.domId}_${t.actKey}`;
          if(!spIsDone(k))spMarkDone(k);
        });
      }
    }catch(e){}
  }
  return{isNewRecord,prevBest,newBest:p[key].best,total};
}
// ═══════ KNOWLEDGE DECAY ═══════
const DECAY_KEY='slagio_decay_v1';
function getDecay(){try{return JSON.parse(localStorage.getItem(DECAY_KEY)||'{}');}catch(e){return{};}}
function setDecayNow(vakId,domeinId){
  const d=getDecay();
  d[`${vakId}_${domeinId}`]=Date.now();
  localStorage.setItem(DECAY_KEY,JSON.stringify(d));
  try{pushSyncBundle();}catch(e){}
}
function getDecayStatus(vakId,domeinId){
  const d=getDecay();
  const ts=d[`${vakId}_${domeinId}`];
  if(!ts)return null;
  const days=(Date.now()-ts)/(1000*60*60*24);
  if(days<1)return{color:'#22c55e',label:'Vandaag geoefend'};
  if(days<7)return{color:'#facc15',label:`${Math.floor(days)}d geleden`};
  if(days<21)return{color:'#f97316',label:`${Math.floor(days)}d geleden`};
  return{color:'#ef4444',label:`${Math.floor(days)} dagen geleden - herhalen!`};
}
function getVakProgress(vakId){
  const p=getProgress();
  const results={};
  Object.keys(p).forEach(key=>{
    if(key.startsWith(vakId+'_')){
      results[key]=p[key];
    }
  });
  return results;
}
function getDomeinBestPct(vakId,domeinId){
  const p=getProgress();
  let bestPct=0;
  let hasData=false;
  ['snel','oud'].forEach(mode=>{
    const key=`${vakId}_${domeinId}_${mode}`;
    if(p[key]&&p[key].total>0){
      hasData=true;
      const pct=p[key].best/p[key].total;
      if(pct>bestPct)bestPct=pct;
    }
  });
  return {pct:bestPct,hasData};
}
function getVakBestPct(vakId){
  const vak=getVK().find(v=>v.id===vakId);
  if(!vak)return {pct:0,hasData:false};
  let totalPct=0;let count=0;let hasAny=false;
  vak.domeinen.forEach(d=>{
    const r=getDomeinBestPct(vakId,d.id);
    if(r.hasData){hasAny=true;totalPct+=r.pct;count++;}
  });
  return {pct:count>0?totalPct/count:0,hasData:hasAny};
}

// ═══════ EXAMENCOACH ═══════
// Eerlijke, transparante indicatie op basis van je oefenscores per domein.
// cijfer = 1 + 9·(gem. beheersing) — géén N-term, dus bewust aan de voorzichtige kant.
// risico = zwakste domein · winst = domein dat het dichtst bij beheersing (85%) zit.
function examCoachData(vakId){
  const vak=getVK().find(v=>v.id===vakId);
  if(!vak||!vak.domeinen)return null;
  const doms=vak.domeinen.map(d=>{const r=getDomeinBestPct(vakId,d.id);return{id:d.id,naam:d.naam,pct:r.pct,hasData:r.hasData};}).filter(d=>d.hasData);
  if(doms.length<2)return {vak,enough:false,n:doms.length};
  const avg=doms.reduce((s,d)=>s+d.pct,0)/doms.length;
  const cijfer=Math.max(1,Math.min(10,1+9*avg));
  const sorted=[...doms].sort((a,b)=>a.pct-b.pct);
  const risico=sorted[0].pct<0.85?sorted[0]:null;
  const winstCand=doms.filter(d=>d.pct>=0.4&&d.pct<0.85&&(!risico||d.id!==risico.id)).sort((a,b)=>b.pct-a.pct);
  const winst=winstCand[0]||null;
  return {vak,enough:true,cijfer,avg,risico,winst,n:doms.length};
}
function renderExamCoach(vakId){
  const el=document.getElementById('res-coach'); if(!el)return;
  const c=vakId?examCoachData(vakId):null;
  if(!c){el.innerHTML='';return;}
  let mood,msg,rows='';
  if(!c.enough){
    mood='kijk';
    msg=`Oefen nog een paar domeinen van <b>${c.vak.naam}</b>, dan reken ik je kans uit. Ik hou je in de gaten! 👀`;
  }else{
    const cij=c.cijfer.toFixed(1).replace('.',',');
    const cijColor=c.cijfer<5.45?'#ef4444':c.cijfer<7?'#f59e0b':'#22c55e';
    mood=c.cijfer>=7?'trots':c.cijfer>=5.45?'goed':'laag';
    const opener=mood==='trots'?'Sterk gedaan! ':mood==='laag'?'':'';
    const tail=mood==='trots'?' 🎉':mood==='laag'?' We pakken dit samen, stap voor stap.':' Nog een klein zetje.';
    msg=`${opener}Als het CE morgen was, zat je op een <b style="color:${cijColor}">${cij}</b> voor <b>${c.vak.naam}</b>.${tail}`;
    if(c.risico)rows+=`<button class="coach-chip coach-chip-risk" onclick="goToDomein('${vakId}','${c.risico.id}','snel')">⚠️ Risico: ${c.risico.naam} · ${Math.round(c.risico.pct*100)}% <span class="coach-chip-go">oefen →</span></button>`;
    if(c.winst)rows+=`<button class="coach-chip coach-chip-win" onclick="goToDomein('${vakId}','${c.winst.id}','snel')">📈 Winst: ${c.winst.naam} · ${Math.round(c.winst.pct*100)}% <span class="coach-chip-go">oefen →</span></button>`;
    if(!c.risico&&!c.winst)msg+=` Alles wat je oefende staat op niveau. 💪`;
  }
  const naam=(typeof MASCOT_NAME!=='undefined'?MASCOT_NAME:'Vonk')+' · je examencoach';
  const svg=(typeof mascotSVG==='function')?mascotSVG(mood,84):'';
  el.innerHTML=`<div class="coach-pop coach-dark coach-mood-${mood}">
    <button class="coach-x" onclick="this.closest('.coach-pop').classList.add('coach-hide')" aria-label="Sluiten">✕</button>
    <div class="coach-avatar">${svg}</div>
    <div class="coach-bubble">
      <div class="coach-name">${naam}</div>
      <div class="coach-msg">${msg}</div>
      ${rows?`<div class="coach-chips">${rows}</div>`:''}
      ${c.enough?`<div class="coach-fine">Indicatie op je oefenscores (${c.n} domeinen). Richting, geen garantie.</div>`:''}
    </div>
  </div>`;
}
function trapFocus(el,onEscape){
  const sel='button:not([disabled]),a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
  const nodes=[...el.querySelectorAll(sel)];
  if(!nodes.length)return()=>{};
  nodes[0].focus();
  function onKey(e){
    if(e.key==='Tab'){
      if(e.shiftKey){if(document.activeElement===nodes[0]){e.preventDefault();nodes[nodes.length-1].focus();}}
      else{if(document.activeElement===nodes[nodes.length-1]){e.preventDefault();nodes[0].focus();}}
    }
    if(e.key==='Escape'&&onEscape)onEscape();
  }
  el.addEventListener('keydown',onKey);
  return()=>el.removeEventListener('keydown',onKey);
}
function showConfirm(icon,title,msg,okLabel,onOk){
  const ov=document.getElementById('confirm-overlay');
  document.getElementById('confirm-icon').textContent=icon;
  document.getElementById('confirm-title-el').textContent=title;
  document.getElementById('confirm-msg').textContent=msg;
  const okBtn=document.getElementById('confirm-ok');
  const cancelBtn=document.getElementById('confirm-cancel');
  okBtn.textContent=okLabel||'Verwijderen';
  const prev=document.activeElement;
  ov.classList.add('show');
  let releaseTrap;
  const close=()=>{ov.classList.remove('show');if(releaseTrap)releaseTrap();prev?.focus();};
  releaseTrap=trapFocus(ov,close);
  okBtn.onclick=()=>{close();onOk();};
  cancelBtn.onclick=close;
  ov.onclick=(e)=>{if(e.target===ov)close();};
}
function resetVakProgress(){
  if(!ST.vak)return;
  showConfirm(
    '🗑️',
    'Voortgang wissen?',
    `Al je voortgang voor ${ST.vak.naam} wordt permanent verwijderd. Dit kan niet ongedaan worden gemaakt.`,
    'Wissen',
    ()=>{
      const p=getProgress();
      Object.keys(p).forEach(key=>{if(key.startsWith(ST.vak.id+'_'))delete p[key];});
      localStorage.setItem('examenapp_'+lvlCol('progress'),JSON.stringify(p));
      cloudSet(lvlCol('progress'),p);
      openVak(ST.vak.id);
      showToast('Voortgang gewist','#ef4444');
    }
  );
}

// ═══════ FAVORITES ═══════
function getFavs(){
  try{const d=JSON.parse(localStorage.getItem('examenapp_'+lvlCol('favs'))||'[]');return Array.isArray(d)?d:(d.list||[]);}
  catch(e){return [];}
}
function toggleFav(vakId,domeinId){
  let favs=getFavs();
  const key=`${vakId}_${domeinId}`;
  const idx=favs.indexOf(key);
  if(idx>=0)favs.splice(idx,1);else favs.push(key);
  cloudSet(lvlCol('favs'),{list:favs});
  renderFavHome();
  return favs.includes(key);
}
function isFav(vakId,domeinId){return getFavs().includes(`${vakId}_${domeinId}`);}
function renderFavHome(){
  const favs=getFavs();
  const box=document.getElementById('fav-home');
  const chips=document.getElementById('fav-chips');
  if(!favs.length){box.style.display='none';return;}
  box.style.display='block';
  chips.innerHTML='';
  favs.forEach(key=>{
    const [vakId,domId]=key.split('_');
    const vak=getVK().find(v=>v.id===vakId);
    if(!vak)return;
    const dom=vak.domeinen.find(d=>d.id===domId);
    if(!dom)return;
    const chip=document.createElement('div');
    chip.className='fav-chip';
    chip.innerHTML=`<span class="fav-chip-dot" style="background:${vak.kleur}"></span><span class="fav-chip-name">${vak.code} · ${dom.naam}</span>`;
    chip.onclick=()=>{openVak(vakId);};
    chips.appendChild(chip);
  });
}

