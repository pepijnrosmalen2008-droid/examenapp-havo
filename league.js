// ═══════════════════════════════════════════════════════════════════════
// league.js - Weekwedstrijd / divisies (Duolingo-stijl)
// ───────────────────────────────────────────────────────────────────────
// Elke week strijd je in een divisie tegen ~29 andere "spelers" (bots die op
// echte leerlingen lijken: volledige naam, avatar, XP die door de week groeit).
// Top-7 promoveert, onderste-5 degradeert. Puur client-side; je weekXP komt
// uit addXP(). Bots zijn deterministisch per week (seeded), dus stabiel bij
// elke render maar vernieuwen elke maandag.
// ═══════════════════════════════════════════════════════════════════════

const LEAGUE_DIVISIONS = [
  { naam: 'Brons',   kleur: '#c17a3f', ic: '🥉' },
  { naam: 'Zilver',  kleur: '#9aa4b2', ic: '🥈' },
  { naam: 'Goud',    kleur: '#e8a91d', ic: '🥇' },
  { naam: 'Platina', kleur: '#3fb8c4', ic: '💠' },
  { naam: 'Diamant', kleur: '#5b8def', ic: '💎' },
  { naam: 'Legende', kleur: '#a855f7', ic: '👑' },
];
const LEAGUE_COHORT = 30;   // jij + 29 bots
const LEAGUE_PROMO  = 7;    // top-7 promoveert
const LEAGUE_DEMOTE = 5;    // onderste-5 degradeert
// Bots krijgen een echte app-avatar (zelfde dieren + evolutiestadia als spelers).
const _LG_DIER = ['adelaar','beer','cactus','draak','eenhoorn','gorilla','haai','leeuw','octopus','olifant','robot','slang','slijm','tijger','uil','vlinder','vos','wolf'];

// ── Namen: realistische, gevarieerde volledige namen ──
const _LG_VN = ['Sanne','Emma','Julia','Tess','Anna','Sophie','Lisa','Fenna','Isa','Eva','Lotte','Roos','Zoë','Nora','Mila','Yara','Evi','Lieke','Fleur','Amber','Nina','Femke','Britt','Iris','Maud','Vera','Loïs','Merel','Noor','Milou','Saar','Lina','Nour','Amina','Yasmin','Zeynep','Elif','Aya','Maya','Sara','Hanna','Lynn','Fiene','Norah','Sofia','Daan','Sem','Lucas','Milan','Levi','Finn','Luuk','Bram','Thijs','Jesse','Noah','Liam','Lars','Tim','Ruben','Gijs','Sven','Teun','Cas','Mees','Stijn','Jens','Thomas','Max','Boaz','Julian','Hugo','Mats','Jort','Tygo','Siem','Kai','Pim','Bas','Joris','Niek','Koen','Rick','Wout','Floris','Tijn','Vince','Benjamin','Willem','Adam','Youssef','Bilal','Amir','Sami','Yusuf','Rayan','Emir','Kaan','Deniz','Mohammed','Ravi','Sem','Jayden','Dylan'];
const _LG_AN = ['de Vries','Jansen','van den Berg','Bakker','Visser','Smit','Meijer','de Boer','Mulder','de Groot','Bos','Vos','Peters','Hendriks','van Leeuwen','Dekker','Brouwer','de Wit','Dijkstra','Smits','de Graaf','van der Meer','van der Linden','Kok','Jacobs','de Haan','Vermeulen','van den Heuvel','van der Veen','van den Broek','de Bruijn','de Jong','Willems','van Dijk','Hoekstra','Maas','Verhoeven','Koster','van Dam','Prins','Blom','Huisman','Kuipers','Post','Martens','Groen','Wolters','Sanders','van der Woude','Timmermans','Aydin','Yılmaz','Öztürk','Demir','El Amrani','Bouazza','Haddad','Kaya','Nguyen','Chen','Kowalski','Silva','Ali','Khan','Hassan','Ahmed','Yildiz','Aktaş','Bakış'];

// ── Seeded PRNG (mulberry32) + string-hash ──
function _lgHash(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19;}return (h^h>>>16)>>>0;}
function _lgRng(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}

function _lgBotName(rng){
  const vn = _LG_VN[Math.floor(rng()*_LG_VN.length)];
  const r = rng();
  if (r < 0.72) return vn + ' ' + _LG_AN[Math.floor(rng()*_LG_AN.length)];      // Voornaam Achternaam
  if (r < 0.88) return vn + ' ' + _LG_AN[Math.floor(rng()*_LG_AN.length)][0] + '.'; // Voornaam A.
  // handle-stijl (sommige leerlingen gebruiken een gebruikersnaam)
  const yr = 5 + Math.floor(rng()*8);
  return vn.toLowerCase() + (rng()<0.5?'_':'.') + ['0'+yr,''+(2007+Math.floor(rng()*4)),'xx','nl',''+Math.floor(rng()*100)][Math.floor(rng()*5)];
}

// ── Week-helpers (maandag = weekstart, id = maandagdatum) ──
function _lgWeekStart(d){const x=new Date(d);x.setHours(0,0,0,0);const day=(x.getDay()+6)%7;x.setDate(x.getDate()-day);return x;}
function _lgWeekId(d){return _lgWeekStart(d).toISOString().slice(0,10);}
function _lgWeekProgress(){const s=_lgWeekStart(new Date());const now=Date.now();return Math.max(0,Math.min(1,(now-s.getTime())/(7*86400000)));}
function _lgDaysLeft(){const s=_lgWeekStart(new Date());const end=s.getTime()+7*86400000;return Math.max(0,Math.ceil((end-Date.now())/86400000));}

// ── Opslag ──
function getLeague(){try{return JSON.parse(localStorage.getItem('slagio_league')||'null');}catch(e){return null;}}
function _saveLeague(L){try{localStorage.setItem('slagio_league',JSON.stringify(L));}catch(e){}}

function _lgMakeCohort(division,baseline,seedStr){
  const rng=_lgRng(_lgHash(seedStr+'|d'+division));
  const divMult=Math.pow(1.16,division);
  const out=[];
  for(let i=0;i<LEAGUE_COHORT-1;i++){
    const factor=0.28+rng()*1.7;
    const target=Math.max(60,Math.round(baseline*divMult*factor));
    out.push({
      naam:_lgBotName(rng),
      animalId:_LG_DIER[Math.floor(rng()*_LG_DIER.length)],
      stage:Math.min(6,1+Math.floor(rng()*4)+Math.floor(division*0.7)),
      target:target,
      front:0.55+rng()*0.95   // hoe vroeg in de week deze speler actief is
    });
  }
  return out;
}

function _lgMeName(){try{const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');return (p.naam&&p.naam.trim())?p.naam.trim():'Jij';}catch(e){return 'Jij';}}
function _lgMeAvatar(){try{const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');const xp=(typeof getTotalXP==='function')?getTotalXP():0;return {id:p.animalId||null,stage:(typeof getAnimalStageIdx==='function')?getAnimalStageIdx(xp):0};}catch(e){return {id:null,stage:0};}}
// Rendert de echte app-avatar (SVG/emoji per stadium); valt terug op een ster/vos.
function _lgAvatar(r){
  let inner='';
  if(r.animalId&&typeof getAnimalDisplay==='function'){try{inner=getAnimalDisplay(r.animalId,r.stage||0,26);}catch(e){}}
  if(!inner)inner='<span style="font-size:22px">'+(r.me?'⭐':'🦊')+'</span>';
  if(r.me&&typeof avatarSkinHTML==='function'){try{const sk=avatarSkinHTML(r.animalId,r.stage);if(sk)return '<span class="av-wrap">'+inner+sk+'</span>';}catch(e){}}
  return inner;
}

// Zorgt dat de league bij de huidige week hoort; finaliseert de vorige week
// (promotie/degradatie) als er een nieuwe week is begonnen.
function ensureLeague(){
  let L=getLeague();
  const wid=_lgWeekId(new Date());
  if(!L){
    L={week:wid,division:0,weekXP:0,lastWeekXP:0,result:null,cohort:_lgMakeCohort(0,700,wid)};
    _saveLeague(L);return L;
  }
  // Migratie: oude cohorts (van vóór de echte avatars) misten animalId → bots
  // vielen terug op een standaard-vos. Regenereer die in-place (deterministisch).
  if(L.cohort && L.cohort.length && !L.cohort[0].animalId){
    L.cohort=_lgMakeCohort(L.division, Math.max(400,L.lastWeekXP||0,700), L.week);
    _saveLeague(L);
  }
  if(L.week!==wid){
    // Finaliseer: eindstand met bots op hun weekdoel en jouw behaalde weekXP.
    const finals=_lgStandings(L,1);
    const me=finals.find(r=>r.me);const rank=me?me.rank:finals.length;
    const oldDiv=L.division;let promoted=false,relegated=false;
    if(rank<=LEAGUE_PROMO && L.division<LEAGUE_DIVISIONS.length-1){L.division++;promoted=true;}
    else if(rank>(finals.length-LEAGUE_DEMOTE) && L.division>0){L.division--;relegated=true;}
    const baseline=Math.max(400,L.weekXP||0,L.lastWeekXP||0);
    L.result={rank,promoted,relegated,oldDiv,newDiv:L.division,weekXP:L.weekXP||0,seen:false};
    L.lastWeekXP=L.weekXP||0;
    L.week=wid;L.weekXP=0;
    L.cohort=_lgMakeCohort(L.division,baseline,wid);
    _saveLeague(L);
  }
  return L;
}

// Standings van de huidige (of gefinaliseerde) week.
function _lgStandings(L,progOverride){
  const prog=progOverride!=null?progOverride:_lgWeekProgress();
  const rows=(L.cohort||[]).map(b=>{
    const xp=progOverride===1?b.target:Math.round(b.target*Math.min(1,prog*b.front));
    return {naam:b.naam,animalId:b.animalId,stage:b.stage,xp:xp,me:false};
  });
  const meAv=_lgMeAvatar();
  rows.push({naam:_lgMeName(),animalId:meAv.id,stage:meAv.stage,xp:L.weekXP||0,me:true});
  rows.sort((a,b)=>b.xp-a.xp||(a.me?1:-1));
  rows.forEach((r,i)=>r.rank=i+1);
  return rows;
}

// Aangeroepen vanuit addXP(): telt je XP mee in de weekstand.
function leagueAddXP(amount){
  if(!amount)return;
  const L=ensureLeague();
  L.weekXP=(L.weekXP||0)+amount;
  _saveLeague(L);
  try{renderLeagueHome();}catch(e){}
}

// ── Home-kaart ──
function renderLeagueHome(){
  const box=document.getElementById('league-home');
  if(!box)return;
  const L=ensureLeague();
  const div=LEAGUE_DIVISIONS[L.division];
  const rows=_lgStandings(L);
  const me=rows.find(r=>r.me)||{rank:LEAGUE_COHORT,xp:0};
  const promo=me.rank<=LEAGUE_PROMO, demote=me.rank>(rows.length-LEAGUE_DEMOTE);
  const zone=promo?'<span class="lg-zone lg-zone-up">Promotiezone</span>':(demote?'<span class="lg-zone lg-zone-dn">Degradatiezone</span>':'<span class="lg-zone lg-zone-safe">Veilig</span>');
  const res=(L.result&&!L.result.seen)?_lgResultBanner(L.result):'';
  box.innerHTML=`${res}
  <div class="lg-card" onclick="openLeague()" role="button" tabindex="0" style="--lg-col:${div.kleur}">
    <div class="lg-badge"><span class="lg-badge-ic no-ico">${div.ic}</span></div>
    <div class="lg-card-body">
      <div class="lg-card-top"><span class="lg-div-name">${div.naam}-divisie</span>${zone}</div>
      <div class="lg-card-sub">#${me.rank} van ${rows.length} · <b>${me.xp} XP</b> deze week · nog ${_lgDaysLeft()} dag${_lgDaysLeft()===1?'':'en'}</div>
    </div>
    <div class="lg-card-arr">→</div>
  </div>`;
}
function _lgResultBanner(r){
  if(r.promoted)return `<div class="lg-result lg-result-up" onclick="_lgSeen()"><b>Gepromoveerd!</b> Je bent naar de ${LEAGUE_DIVISIONS[r.newDiv].naam}-divisie gestegen. 🎉 <span class="lg-x">✕</span></div>`;
  if(r.relegated)return `<div class="lg-result lg-result-dn" onclick="_lgSeen()"><b>Gedegradeerd.</b> Je zakt naar de ${LEAGUE_DIVISIONS[r.newDiv].naam}-divisie - deze week pak je 'm terug! <span class="lg-x">✕</span></div>`;
  return `<div class="lg-result lg-result-safe" onclick="_lgSeen()">Je eindigde vorige week <b>#${r.rank}</b> in de ${LEAGUE_DIVISIONS[r.oldDiv].naam}-divisie. <span class="lg-x">✕</span></div>`;
}
function _lgSeen(){const L=getLeague();if(L&&L.result){L.result.seen=true;_saveLeague(L);}try{renderLeagueHome();}catch(e){}}

// ── Volledig bord ──
function openLeague(){show('sc-league');renderLeague();}
function renderLeague(){
  const box=document.getElementById('league-body');
  if(!box)return;
  const L=ensureLeague();
  const div=LEAGUE_DIVISIONS[L.division];
  const rows=_lgStandings(L);
  const next=LEAGUE_DIVISIONS[L.division+1];
  const prev=LEAGUE_DIVISIONS[L.division-1];
  const hdr=`
    <div class="lg-hero" style="--lg-col:${div.kleur}">
      <div class="lg-hero-badge no-ico">${div.ic}</div>
      <div class="lg-hero-name">${div.naam}-divisie</div>
      <div class="lg-hero-sub">Nog ${_lgDaysLeft()} dag${_lgDaysLeft()===1?'':'en'} · top ${LEAGUE_PROMO} promoveert${next?' naar '+next.naam:''}${prev?', onderste '+LEAGUE_DEMOTE+' degradeert':''}</div>
    </div>`;
  box.innerHTML=hdr+_lgListWithDividers(rows);
}
function _lgListWithDividers(rows){
  let html='<div class="lg-list">';
  rows.forEach(r=>{
    const promo=r.rank<=LEAGUE_PROMO, demote=r.rank>(rows.length-LEAGUE_DEMOTE);
    if(r.rank===LEAGUE_PROMO+1 && rows.length>LEAGUE_PROMO) html+=`<div class="lg-divider lg-divider-up"><span>▲ promotie&nbsp;/&nbsp;blijft</span></div>`;
    if(r.rank===rows.length-LEAGUE_DEMOTE+1 && rows.length>LEAGUE_DEMOTE) html+=`<div class="lg-divider lg-divider-dn"><span>▼ degradatiezone</span></div>`;
    const zoneCls=promo?'lg-row-up':(demote?'lg-row-dn':'');
    const rk=r.rank===1?'🥇':r.rank===2?'🥈':r.rank===3?'🥉':('<span class="lg-rk">'+r.rank+'</span>');
    html+=`<div class="lg-row ${zoneCls}${r.me?' lg-row-me':''}">
      <div class="lg-row-rank no-ico">${rk}</div>
      <div class="lg-row-av no-ico">${_lgAvatar(r)}</div>
      <div class="lg-row-name">${_lgEsc(r.naam)}${r.me?' <span class="lg-you">jij</span>':''}</div>
      <div class="lg-row-xp">${r.xp}<span class="lg-xp-u"> XP</span></div>
    </div>`;
  });
  html+='</div>';
  return html;
}
function _lgEsc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
