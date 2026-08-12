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
// Absoluut XP-plafond per divisie: de sterkste bot (#1) komt hier ~ op uit, de
// rest zit eronder. Vaste, niveau-onafhankelijke doelen i.p.v. meeschalen met de
// speler → geen 20k-bots meer in brons; elke divisie voelt als een eigen niveau.
const LEAGUE_TOP_XP   = [4500, 7500, 18000, 24000, 30000, 38000];
// Richt-XP rond de promotiedrempel (~plek 7): bepaalt hoe zwaar promoveren voelt.
const LEAGUE_PROMO_XP = [1100, 2600, 8000, 12000, 16000, 22000];
function _lgDivTop(d){return LEAGUE_TOP_XP[d]!=null?LEAGUE_TOP_XP[d]:LEAGUE_TOP_XP[LEAGUE_TOP_XP.length-1];}
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

// ── Opslag (gescheiden per niveau: havo/vwo hebben een eigen divisie + cohort) ──
function _lgKey(){return (typeof lvlCol==='function')?lvlCol('slagio_league'):'slagio_league';}
function getLeague(){
  try{
    let raw=localStorage.getItem(_lgKey());
    if(raw==null){
      // Migratie: neem de oude niveau-loze league eenmalig over voor dit niveau,
      // zodat bestaande spelers hun divisie/voortgang niet kwijtraken.
      const legacy=localStorage.getItem('slagio_league');
      if(legacy!=null){ try{localStorage.setItem(_lgKey(),legacy);}catch(e){} raw=legacy; }
    }
    return JSON.parse(raw||'null');
  }catch(e){return null;}
}
function _saveLeague(L){try{localStorage.setItem(_lgKey(),JSON.stringify(L));}catch(e){}}
// Server-bucket per niveau: vwo krijgt een divisie-offset zodat echte medespelers
// van havo/vwo elkaar niet mengen (lokale weergavedivisie blijft gewoon 0..5).
function _lgSyncDiv(d){return (d||0)+((typeof APP_LEVEL!=='undefined'&&APP_LEVEL==='vwo')?100:0);}

function _lgMakeCohort(division,baseline,seedStr){
  // `baseline` (jouw XP) wordt bewust NIET meer gebruikt om de doelen te schalen.
  // De bots hebben nu absolute, per-divisie doelen (LEAGUE_TOP_XP / _PROMO_XP),
  // zodat brons nooit meer 20k-bots krijgt en promoveren onderin haalbaar blijft.
  // Het niveau (havo/vwo) zit in de seed → gescheiden bot-cohorten per niveau.
  const lvl=(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo';
  const rng=_lgRng(_lgHash(seedStr+'|d'+division+'|'+lvl));
  const top=_lgDivTop(division);
  const promo=LEAGUE_PROMO_XP[division]!=null?LEAGUE_PROMO_XP[division]:Math.round(top*0.5);
  const floor=Math.max(40,Math.round(promo*0.14));
  const out=[];
  for(let i=0;i<LEAGUE_COHORT-1;i++){
    const rank=i+1;                                   // 1 = sterkste bot
    let t;
    if(rank<=LEAGUE_PROMO){
      // top (#1) → promotiedrempel (#7): de eerste plekken lopen van het plafond
      // naar de promotielijn (rang 1 is de "absolute top"-uitschieter).
      const f=(rank-1)/(LEAGUE_PROMO-1);              // 0..1
      t=top+(promo-top)*Math.pow(f,0.85);
    }else{
      // promotiedrempel → vloer over de resterende plekken (lange, zachte staart).
      const f=(rank-LEAGUE_PROMO)/((LEAGUE_COHORT-1)-LEAGUE_PROMO); // 0..1
      t=promo+(floor-promo)*Math.pow(f,0.9);
    }
    t=t*(0.93+rng()*0.14);                            // lichte ruis (±7%)
    out.push({
      naam:_lgBotName(rng),
      animalId:_LG_DIER[Math.floor(rng()*_LG_DIER.length)],
      stage:Math.min(6,1+Math.floor(rng()*4)+Math.floor(division*0.7)),
      target:Math.min(top,Math.max(floor,Math.round(t))),  // nooit boven het divisieplafond
      front:0.55+rng()*0.95,  // hoe vroeg in de week deze speler actief is
      seed:Math.floor(rng()*1e9)  // eigen seed voor de sessie-gedreven XP-groei
    });
  }
  return out;
}
// XP van een bot op moment `prog` (0..1 van de week): NIET één vloeiende lijn,
// maar een reeks losse "oefensessies" op willekeurige momenten (seeded), zodat
// de XP geleidelijk én grillig groeit - net als echte spelers. Bij prog>=1 = target.
function _lgBotXP(b,prog){
  if(prog>=1)return b.target;
  if(prog<=0)return 0;
  const seed=(b.seed!=null)?b.seed:_lgHash((b.naam||'')+'|'+(b.target||0));
  const rng=_lgRng(seed>>>0);
  const N=6+Math.floor(rng()*10);            // 6..15 sessies deze week
  const front=Math.max(0.5,b.front||1);
  let acc=0,tot=0;
  for(let i=0;i<N;i++){
    let t=rng();t=Math.pow(t,1/front);       // front>1 → sessies eerder in de week
    const w=0.4+rng();                       // sessie-grootte varieert
    tot+=w;if(t<=prog)acc+=w;
  }
  return tot>0?Math.round(b.target*acc/tot):0;
}
// Echte medespelers uit de cache (zelfde week + divisie), zonder mijzelf.
// Belangrijk: filter óók op mijn NAAM (niet alleen mijn did) en ontdubbel op naam,
// anders verschijnen mijn eigen entries van andere apparaten/sessies als 'kopieën'
// van mezelf (bv. meerdere 'Pepijn'-rijen die op mijn avatar lijken).
function _lgRealRows(L){
  const c=window._lgRealCache;
  if(!c||c.week!==L.week||c.division!==L.division||!Array.isArray(c.players))return [];
  const mine=(typeof _DID!=='undefined')?_DID:null;
  const myName=(_lgMeName()||'').trim().toLowerCase();
  const seen={};const out=[];
  c.players.forEach(p=>{
    if(!p||!p.did||p.did===mine)return;                       // mijn eigen device
    const nm=(p.naam||'Speler').trim();
    const key=nm.toLowerCase();
    if(myName&&key===myName)return;                           // mijn naam op een ander device
    if(seen[key]!==undefined){                                // ontdubbel op naam → hoogste XP
      const ex=out[seen[key]];ex.xp=Math.max(ex.xp,Math.max(0,p.xp||0));
      return;
    }
    seen[key]=out.length;
    out.push({naam:nm,animalId:p.animal_id||null,stage:p.stage||0,xp:Math.max(0,p.xp||0),me:false,real:true});
  });
  return out;
}

function _lgMeName(){try{const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');return (p.naam&&p.naam.trim())?p.naam.trim():'Jij';}catch(e){return 'Jij';}}
function _lgMeAvatar(){try{const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');const xp=(typeof getTotalXP==='function')?getTotalXP():0;return {id:p.animalId||null,stage:(typeof getAnimalStageIdx==='function')?getAnimalStageIdx(xp):0};}catch(e){return {id:null,stage:0};}}
// Rendert de echte app-avatar (SVG/emoji per stadium); valt terug op een ster/vos.
function _lgAvatar(r){
  let acc='';
  if(r.me&&typeof avatarSkinHTML==='function'){try{acc=avatarSkinHTML(r.animalId,r.stage);}catch(e){}}
  if(r.animalId&&typeof getAnimalDisplay==='function'){try{const h=getAnimalDisplay(r.animalId,r.stage||0,26,acc);if(h)return h;}catch(e){}}
  return '<span style="font-size:22px">'+(r.me?'⭐':'🦊')+'</span>';
}

// Zorgt dat de league bij de huidige week hoort; finaliseert de vorige week
// (promotie/degradatie) als er een nieuwe week is begonnen.
function ensureLeague(){
  let L=getLeague();
  const wid=_lgWeekId(new Date());
  if(!L){
    L={week:wid,division:0,weekXP:0,lastWeekXP:0,result:null,cohortVer:2,cohort:_lgMakeCohort(0,0,wid)};
    _saveLeague(L);return L;
  }
  // Migratie: oude cohorts (van vóór de echte avatars) misten animalId → bots
  // vielen terug op een standaard-vos. Regenereer die in-place (deterministisch).
  if(L.cohort && L.cohort.length && !L.cohort[0].animalId){
    L.cohort=_lgMakeCohort(L.division, 0, L.week);
    L.cohortVer=2;
    _saveLeague(L);
  }
  // Migratie naar absolute divisiedoelen: oude cohorts schaalden met jouw XP en
  // konden 20k+ worden. Regenereer eenmalig deze week met de nieuwe gecapte doelen.
  if(L.cohortVer!==2){
    L.cohort=_lgMakeCohort(L.division, 0, L.week);
    L.cohortVer=2;
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
    // Beloning = plaatsbeloning (op je eindplaats in de oude divisie) + eventuele
    // promotie-bonus. Bij top-7 zit dit in een KIST die je zelf opent (munten +
    // item/power). Zonder kist (rang 8+) worden de munten direct bijgeschreven.
    const placement=_lgPlacementReward(rank,oldDiv);
    const promoReward=promoted?_lgPromoReward(L.division):0;
    const reward=placement+promoReward;
    const tier=_lgRewardTier(rank);
    const chest=tier?{tier,coins:reward,claimed:false}:null;
    if(!chest&&reward>0){try{if(typeof addCoins==='function')addCoins(reward);}catch(e){}}
    L.result={rank,total:finals.length,promoted,relegated,oldDiv,newDiv:L.division,weekXP:L.weekXP||0,placement,promoReward,reward,chest,seen:false};
    L.lastWeekXP=L.weekXP||0;
    L.week=wid;L.weekXP=0;
    L.cohort=_lgMakeCohort(L.division,baseline,wid);L.cohortVer=2;
    _saveLeague(L);
  }
  // Houd de bots competitief: schaal hun weekdoelen mee met jouw tempo, zodat een
  // sterke speler niet in z'n eentje bovenaan staat. Gestage, gecapte opschaling.
  try{ _lgKeepCompetitive(L); }catch(e){}
  return L;
}
// Schaalt de cohort-doelen omhoog wanneer de speler ze voorbij dreigt te rennen,
// zodat de sterkste bots net bóven je verwachte eind-XP uitkomen (competitie blijft).
// Alleen omhoog, gecapt per keer, en stopt zodra het sterk genoeg is.
function _lgKeepCompetitive(L){
  if(!L||!Array.isArray(L.cohort)||!L.cohort.length)return;
  const prog=Math.max(0.12,_lgWeekProgress());
  const projected=(L.weekXP||0)/prog;                 // verwachte eind-XP van de speler
  const div=L.division||0;
  // Brons = beginners: niet opjagen (een normale starter mág gewoon winnen).
  // Hoe hoger de divisie, hoe eerder en agressiever de bots meeschalen.
  const minProj=div===0?900:(div===1?550:300);
  if(projected<minProj)return;
  let topTarget=0;for(const b of L.cohort){if((b.target||0)>topTarget)topTarget=b.target||0;}
  const cap=_lgDivTop(div);                           // hard divisieplafond
  const lead=div===0?1.0:(div===1?1.08:1.18);         // Brons: hooguit gelijk, niet erboven
  const want=Math.min(projected*lead, cap);           // nooit boven het plafond opjagen
  if(topTarget>=want)return;                          // al sterk genoeg
  const scale=Math.min(div===0?1.25:1.6, want/Math.max(1,topTarget)); // gestage, gecapte opschaling
  L.cohort.forEach(b=>{ b.target=Math.min(cap, Math.round((b.target||0)*scale)); }); // elke bot ≤ plafond
  _saveLeague(L);
}
// Beloning voor je eindplaats (los van promotie). Top-3 en de promotiezone
// leveren munten op; schaalt mee met de divisie (hoger = meer). Zo is er élke
// week iets te winnen, ook als je blijft.
function _lgPlacementReward(rank, division){
  const d = division || 0;
  if (rank === 1) return 60 + d * 40;
  if (rank <= 3)  return 35 + d * 22;
  if (rank <= LEAGUE_PROMO) return 15 + d * 10;   // promotiezone
  return 0;
}
// Promotie-bonus (bovenop de plaatsbeloning) voor de zojuist bereikte divisie.
function _lgPromoReward(newDivision){ return 100 + (newDivision || 0) * 75; }
// Kist-tier op basis van je eindplaats: top-3 = gouden kist (zeldzaam item),
// top-7 (promotiezone) = blauwe kist (power-up). Daaronder geen kist.
function _lgRewardTier(rank){ if(rank>=1&&rank<=3)return 'gold'; if(rank<=LEAGUE_PROMO)return 'blue'; return null; }
// Ken een power-up toe (voor de blauwe kist) en geef info voor de reveal terug.
function _lgGrantPower(){
  const pool=[];
  try{ if(typeof getFreezes==='function'&&typeof FREEZE_MAX!=='undefined'&&getFreezes()<FREEZE_MAX)pool.push('freeze'); }catch(e){}
  pool.push('xpboost');
  try{ if(typeof xpBoostDayActive==='function'&&!xpBoostDayActive())pool.push('boost24'); }catch(e){}
  const id=pool[Math.floor(Math.random()*pool.length)]||'xpboost';
  if(id==='freeze'){ try{setFreezes(getFreezes()+1);}catch(e){} return {id,naam:'Streak-freeze',icon:'freeze'}; }
  if(id==='boost24'){ try{localStorage.setItem('slagio_xpboost_day',String(Date.now()+24*3600000));}catch(e){} return {id,naam:'24u dubbele XP',icon:'rocket'}; }
  try{const n=(typeof getXpBoosts==='function'?getXpBoosts():0)+1;localStorage.setItem('slagio_xpboost',String(n));}catch(e){}
  return {id:'xpboost',naam:'Dubbele XP',icon:'bolt'};
}
// Open de verdiende week-kist: kent munten + item/power toe en toont de kist-reveal.
function _lgOpenRewardChest(onClose){
  onClose=(typeof onClose==='function')?onClose:function(){};
  const L=getLeague();
  if(!L||!L.result||!L.result.chest||L.result.chest.claimed){onClose();return;}
  const ch=L.result.chest;
  const coins=ch.coins||0;
  try{ if(coins>0&&typeof addCoins==='function')addCoins(coins); }catch(e){}
  let item=null, power=null;
  if(ch.tier==='gold'){
    try{
      const all=(typeof COSMETICS_VONK!=='undefined'?COSMETICS_VONK:[]).concat(typeof COSMETICS_AV!=='undefined'?COSMETICS_AV:[]);
      const owned=(typeof getOwnedCosmetics==='function')?getOwnedCosmetics():[];
      const locked=all.filter(c=>owned.indexOf(c.id)===-1);
      if(locked.length){ item=locked[Math.floor(Math.random()*locked.length)];
        try{owned.push(item.id);localStorage.setItem('slagio_cosmetics',JSON.stringify(owned));}catch(e){} }
    }catch(e){}
    if(!item) power=_lgGrantPower();     // alles al in bezit → toch een power-up
  }else{
    power=_lgGrantPower();
  }
  ch.claimed=true; L.result.chest=ch; _saveLeague(L);
  const reward={league:true,tier:ch.tier,coins:coins,item:item,power:power};
  const kicker=ch.tier==='gold'?'Top-3 van je divisie! 🏆':'Promotiezone! 🎖️';
  try{ showChest(function(){ try{renderLeague&&renderLeague();}catch(e){} try{renderLeagueHome&&renderLeagueHome();}catch(e){} onClose(); },
    {variant:'chest-league-'+ch.tier, reward:reward, kicker:kicker}); }
  catch(e){ onClose(); }
}
// Vanuit de recap: sluit de recap en open de kist.
function _lgClaimFromRecap(){
  const el=document.getElementById('lg-ceremony');
  if(el){el.classList.remove('show');setTimeout(()=>{if(el.parentNode)el.remove();},220);}
  try{_lgSeen();}catch(e){}
  setTimeout(()=>{try{_lgOpenRewardChest();}catch(e){}},240);
}

// Zorg dat GEEN bot op de speler lijkt (geen "jij-bot"): een bot met dezelfde
// naam of hetzelfde dier als jij krijgt deterministisch een andere naam/dier.
function _lgDedupeVsMe(bots){
  try{
    const myNameLc=(_lgMeName()||'').trim().toLowerCase();
    const myAv=_lgMeAvatar();
    bots.forEach((b,i)=>{
      if((b.naam||'').trim().toLowerCase()===myNameLc){
        const h=_lgHash((b.naam||'')+'|xn'+i);
        b.naam=_LG_VN[h%_LG_VN.length]+' '+_LG_AN[(h>>>7)%_LG_AN.length];
      }
      if(myAv.id&&b.animalId===myAv.id){
        const others=_LG_DIER.filter(d=>d!==myAv.id);
        if(others.length)b.animalId=others[_lgHash((b.naam||'')+'|xd'+i)%others.length];
      }
    });
  }catch(e){}
  return bots;
}

// Standings van de huidige (of gefinaliseerde) week.
// Cohort = echte medespelers (uit Supabase, indien beschikbaar) aangevuld met
// bots tot LEAGUE_COHORT. Zonder backend/echte spelers = enkel bots (als vanouds).
function _lgStandings(L,progOverride){
  const prog=progOverride!=null?progOverride:_lgWeekProgress();
  const real=_lgRealRows(L).slice(0,LEAGUE_COHORT-1);
  const nBots=Math.max(0,(LEAGUE_COHORT-1)-real.length);
  const bots=_lgDedupeVsMe((L.cohort||[]).slice(0,nBots).map(b=>({
    naam:b.naam,animalId:b.animalId,stage:b.stage,
    xp:(progOverride===1?b.target:_lgBotXP(b,prog)),me:false
  })));
  const rows=[...real,...bots];
  const meAv=_lgMeAvatar();
  rows.push({naam:_lgMeName(),animalId:meAv.id,stage:meAv.stage,xp:L.weekXP||0,me:true});
  rows.sort((a,b)=>b.xp-a.xp||(a.me?1:-1));
  rows.forEach((r,i)=>r.rank=i+1);
  return rows;
}

// ── RUSH-VENSTER: dagelijks één uur dubbele week-XP (deterministisch per dag). ──
// Geeft een reden om nú te openen. Het startuur varieert per dag (seeded), zodat
// het speciaal blijft, maar is vooraf zichtbaar zodat je het kunt plannen.
function leagueRushInfo(){
  const now=new Date();
  const dayKey=now.toISOString().slice(0,10);
  const rng=_lgRng(_lgHash('rush|'+dayKey));
  const startHour=15+Math.floor(rng()*6);            // 15:00–20:00
  const start=new Date(now);start.setHours(startHour,0,0,0);
  const end=new Date(start.getTime()+3600000);
  const active=now>=start&&now<end;
  const upcoming=now<start;
  return {active,upcoming,startHour,start,end,
    minsLeft:active?Math.max(1,Math.ceil((end-now)/60000)):0,
    startsInMin:upcoming?Math.ceil((start-now)/60000):0};
}
// Compacte rush-chip (actief / straks vandaag). Leeg als het venster voorbij is.
function leagueRushChip(){
  const r=leagueRushInfo();
  if(r.active)return `<div class="lg-rush lg-rush-on"><span class="lg-rush-bolt">⚡</span><b>Dubbele XP actief</b><span class="lg-rush-t">nog ${r.minsLeft} min</span></div>`;
  if(r.upcoming)return `<div class="lg-rush lg-rush-soon"><span class="lg-rush-bolt">⚡</span>Dubbele XP vandaag om <b>${String(r.startHour).padStart(2,'0')}:00</b></div>`;
  return '';
}

// Laatst toegevoegde week-XP-delta (na rush-verdubbeling) - voor de resultaat-widget.
var _lgLastDelta=0;
// Aangeroepen vanuit addXP(): telt je XP mee in de weekstand (dubbel tijdens rush).
function leagueAddXP(amount){
  if(!amount)return;
  const L=ensureLeague();
  let delta=amount;
  try{if(leagueRushInfo().active)delta=amount*2;}catch(e){}
  _lgLastDelta=delta;
  L.weekXP=(L.weekXP||0)+delta;
  _saveLeague(L);
  try{renderLeagueHome();}catch(e){}
  try{leagueSyncAndFetch();}catch(e){}
}

// ── ECHTE MEDESPELERS: push mijn weekstand en haal de cohort van deze week op. ──
// Zonder Supabase/RPC's gebeurt er niets (de league blijft dan bots-only).
var _lgSyncTs=0,_lgSyncing=false;
function leagueSyncAndFetch(force){
  if(typeof SB==='undefined'||!SB||typeof _DID==='undefined')return;
  const now=Date.now();
  if(!force&&(_lgSyncing||now-_lgSyncTs<45000))return;
  _lgSyncing=true;_lgSyncTs=now;
  const L=ensureLeague();const me=_lgMeAvatar();
  (async()=>{
    try{
      const sdiv=_lgSyncDiv(L.division);
      await SB.rpc('league_sync',{p_did:_DID,p_naam:_lgMeName(),p_animal:me.id,p_stage:me.stage||0,p_division:sdiv,p_week:L.week,p_xp:L.weekXP||0});
      const {data,error}=await SB.rpc('league_cohort',{p_division:sdiv,p_week:L.week});
      if(!error&&Array.isArray(data)){
        window._lgRealCache={week:L.week,division:L.division,players:data,ts:Date.now()};
        try{renderLeagueHome();}catch(e){}
        try{const sc=document.getElementById('sc-league');if(sc&&sc.classList.contains('on'))renderLeague();}catch(e){}
      }
    }catch(e){}finally{_lgSyncing=false;}
  })();
}

// ── WEEK-CEREMONIE: de wekelijkse promotie/degradatie-onthulling (één keer). ──
var _lgCeremonyDone=false;
function _lgMaybeCeremony(){
  if(_lgCeremonyDone)return;
  const L=getLeague();
  if(!L||!L.result||L.result.seen)return;              // recap voor ELKE weekafsluiting
  _lgCeremonyDone=true;
  setTimeout(()=>{try{showLeagueCeremony(L.result);}catch(e){}},600);
}
// Weekafsluiting-recap: toont prominent hoeveelste je bent geworden + de uitkomst
// (gepromoveerd / gebleven / gedegradeerd), voor élke week (niet enkel promo/demote).
function showLeagueCeremony(r){
  if(document.getElementById('lg-ceremony'))return;
  const up=!!r.promoted, dn=!!r.relegated;
  const lastDiv=LEAGUE_DIVISIONS[r.oldDiv]||LEAGUE_DIVISIONS[0];
  const newDiv=LEAGUE_DIVISIONS[r.newDiv]||lastDiv;
  const showDiv=up?newDiv:lastDiv;
  const total=r.total||LEAGUE_COHORT;
  const mood=up?'trots':(dn?'goed':'blij');
  const _vonk=(typeof vonkHolder==='function')?vonkHolder(mood,92,up?'celebrate':'idle')
    :((typeof mascotSVG==='function')?mascotSVG(mood,92):'');
  const medal=r.rank===1?'🥇':(r.rank===2?'🥈':(r.rank===3?'🥉':''));
  const kicker=up?'Gepromoveerd':(dn?'Gedegradeerd':'Weekafsluiting');
  const title=up?('Welkom in de '+newDiv.naam+'-divisie! 🎉')
    :(dn?('Je zakt naar de '+newDiv.naam+'-divisie')
      :('Je blijft in de '+lastDiv.naam+'-divisie'));
  const sub=up?'Sterk gewerkt — zo hoog blijven!'
    :(dn?'Deze week pak je \'m terug — jij kan dit.'
      :(r.rank<=LEAGUE_PROMO?'Net naast promotie — volgende week pak je \'m!':'Nieuwe week, nieuwe kans om te stijgen.'));
  const rNote=(r.promoReward>0&&r.placement>0)?'plek #'+r.rank+' + promotie'
    :(r.promoReward>0?'promotiebonus':'plek #'+r.rank);
  const coinIco=(typeof _ico==='function')?_ico('coin',20):'🪙';
  const hasChest=!!(r.chest&&!r.chest.claimed);
  const chestGold=hasChest&&r.chest.tier==='gold';
  const el=document.createElement('div');
  el.id='lg-ceremony';el.className='lgc-overlay';
  el.innerHTML=`<div class="lgc-card ${up?'lgc-up':(dn?'lgc-dn':'lgc-stay')}" style="--lg-col:${showDiv.kleur}">
    <div class="lgc-rays" aria-hidden="true"></div>
    <div class="lgc-vonk">${up?'<span class="lgc-crown" aria-hidden="true">👑</span>':''}${_vonk}<span class="lgc-badge-mini no-ico">${showDiv.ic}</span></div>
    <div class="lgc-kicker">${kicker}</div>
    <div class="lgc-recap-lbl">Je eindigde vorige week</div>
    <div class="lgc-rankbig">${medal?'<span class="lgc-medal" aria-hidden="true">'+medal+'</span>':''}#${r.rank} <span class="lgc-rankof">van ${total}</span></div>
    <div class="lgc-recap-meta">${lastDiv.naam}-divisie · <b>${r.weekXP||0} XP</b> deze week</div>
    <div class="lgc-title">${title}</div>
    <div class="lgc-sub">${sub}</div>
    ${hasChest
      ? `<div class="lgc-chesthint ${chestGold?'lgc-chest-gold':'lgc-chest-blue'}"><span class="lgc-chest-em">🎁</span> Je verdiende een <b>${chestGold?'gouden':'blauwe'} kist</b>${chestGold?' — munten + zeldzaam item':' — munten + power-up'}</div>
         <button class="lgc-cta" onclick="_lgClaimFromRecap()">Open je kist 🎁</button>`
      : `${r.reward>0?`<div class="lgc-reward"><span class="lgc-reward-ico">${coinIco}</span>+${r.reward} munten <span class="lgc-reward-note">${rNote}</span></div>`:''}
         <button class="lgc-cta" onclick="_lgCeremonyClose(true)">Bekijk mijn divisie</button>`}
    <button class="lgc-skip" onclick="_lgCeremonyClose(false)">${hasChest?'Later':'Sluiten'}</button>
  </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('show'));
  if(up){try{playSound('levelup');}catch(e){}try{if(typeof launchConfetti==='function')launchConfetti('gold');}catch(e){}try{haptic&&haptic([50,30,80,30,120]);}catch(e){}}
  else if(dn){try{playSound('complete');}catch(e){}}
  else{try{playSound('complete');}catch(e){}try{haptic&&haptic([30,20,50]);}catch(e){}}
}
function _lgCeremonyClose(go){
  const el=document.getElementById('lg-ceremony');
  if(el){el.classList.remove('show');setTimeout(()=>el.remove(),260);}
  try{_lgSeen();}catch(e){}
  if(go){try{openLeague();}catch(e){}}
}
// Finish-urgentie: laatste dag + in promotie-/degradatiezone.
function _lgFinishBanner(rows){
  if(_lgDaysLeft()>1)return '';
  const me=rows.find(r=>r.me);if(!me)return '';
  const promo=me.rank<=LEAGUE_PROMO, demote=me.rank>(rows.length-LEAGUE_DEMOTE);
  if(!promo&&!demote)return '';
  const txt=promo
    ?`Laatste dag! Je staat <b>#${me.rank}</b> in de promotiezone - houd 'm vast.`
    :`Laatste dag! Je staat <b>#${me.rank}</b> in de degradatiezone - één sessie kan je redden.`;
  return `<div class="lg-finish ${promo?'lg-finish-up':'lg-finish-dn'}">${txt}</div>`;
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
  // Promo/degradatie krijgt de ceremonie; alleen "gelijk gebleven" toont hier een banner.
  const res=(L.result&&!L.result.seen&&!L.result.promoted&&!L.result.relegated)?_lgResultBanner(L.result):'';
  const rush=leagueRushChip();
  box.innerHTML=`${res}${rush}
  <div class="lg-card" onclick="openLeague()" role="button" tabindex="0" style="--lg-col:${div.kleur}">
    <div class="lg-badge"><span class="lg-badge-ic no-ico">${div.ic}</span></div>
    <div class="lg-card-body">
      <div class="lg-card-top"><span class="lg-div-name">${div.naam}-divisie</span>${zone}</div>
      <div class="lg-card-sub">#${me.rank} van ${rows.length} · <b>${me.xp} XP</b> deze week · nog ${_lgDaysLeft()} dag${_lgDaysLeft()===1?'':'en'}</div>
    </div>
    <div class="lg-card-arr">→</div>
  </div>`;
  try{_lgMaybeCeremony();}catch(e){}
  try{leagueSyncAndFetch();}catch(e){}
}
function _lgResultBanner(r){
  if(r.promoted)return `<div class="lg-result lg-result-up" onclick="_lgSeen()"><b>Gepromoveerd!</b> Je bent naar de ${LEAGUE_DIVISIONS[r.newDiv].naam}-divisie gestegen. 🎉 <span class="lg-x">✕</span></div>`;
  if(r.relegated)return `<div class="lg-result lg-result-dn" onclick="_lgSeen()"><b>Gedegradeerd.</b> Je zakt naar de ${LEAGUE_DIVISIONS[r.newDiv].naam}-divisie - deze week pak je 'm terug! <span class="lg-x">✕</span></div>`;
  return `<div class="lg-result lg-result-safe" onclick="_lgSeen()">Je eindigde vorige week <b>#${r.rank}</b> in de ${LEAGUE_DIVISIONS[r.oldDiv].naam}-divisie. <span class="lg-x">✕</span></div>`;
}
function _lgSeen(){const L=getLeague();if(L&&L.result){L.result.seen=true;_saveLeague(L);}try{renderLeagueHome();}catch(e){}}

// ── Resultaat-widget (na een quiz): hoe ben je gestegen in de divisie? ──
// weekXP bevat op dit punt AL de zojuist behaalde XP (leagueAddXP loopt in addXP),
// dus reken de "vorige" stand terug door xpGained af te trekken.
function leagueRankInfo(xpGained){
  const L=ensureLeague();
  const div=LEAGUE_DIVISIONS[L.division];
  const prog=_lgWeekProgress();
  // Tegenstanders = echte medespelers (indien beschikbaar) + bots tot de cohortmaat.
  const real=_lgRealRows(L).slice(0,LEAGUE_COHORT-1).map(r=>r.xp);
  const nBots=Math.max(0,(LEAGUE_COHORT-1)-real.length);
  const botXP=[...real,...(L.cohort||[]).slice(0,nBots).map(b=>_lgBotXP(b,prog))];
  const total=botXP.length+1;
  const nowXP=L.weekXP||0;
  const beforeXP=Math.max(0,nowXP-(xpGained||0));
  // Rank identiek aan _lgStandings: bij gelijke XP staan bots bóven jou (>=).
  const rankFor=meXP=>1+botXP.reduce((n,x)=>n+(x>=meXP?1:0),0);
  const rankNow=rankFor(nowXP);
  const rankBefore=rankFor(beforeXP);
  // XP tot de eerstvolgende speler bóven je.
  const above=botXP.filter(x=>x>nowXP).sort((a,b)=>a-b);
  const toNext=above.length?(above[0]-nowXP+1):0;
  return {div,divIndex:L.division,rankNow,rankBefore,total,nowXP,xpGained:xpGained||0,
    toNext,promo:rankNow<=LEAGUE_PROMO,demote:rankNow>(total-LEAGUE_DEMOTE),climbed:rankBefore-rankNow};
}

function renderResultLeague(xpGained){
  const box=document.getElementById('res-league');
  if(!box)return;
  let info;try{info=leagueRankInfo(xpGained);}catch(e){box.innerHTML='';return;}
  const {div,rankNow,rankBefore,total,xpGained:gained,toNext,promo,demote,climbed}=info;
  const zone=promo?'<span class="rl-zone rl-zone-up">Promotiezone</span>'
    :(demote?'<span class="rl-zone rl-zone-dn">Degradatiezone</span>':'<span class="rl-zone rl-zone-safe">Veilig</span>');
  let rushActive=false;try{rushActive=leagueRushInfo().active;}catch(e){}
  const rushTag=rushActive?'<span class="rl-rush">⚡ ×2</span>':'';
  const climbLine=climbed>0
    ?`<div class="rl-climb rl-climb-up"><span class="rl-arrow">▲</span> ${climbed} plek${climbed===1?'':'ken'} gestegen</div>`
    :(promo?`<div class="rl-climb rl-climb-hold">Je staat in de promotiezone!</div>`
      :(toNext>0?`<div class="rl-climb rl-climb-hold">Nog <b>${toNext} XP</b> tot #${rankNow-1}</div>`
        :`<div class="rl-climb rl-climb-hold">+${gained} XP toegevoegd</div>`));
  box.innerHTML=`
  <div class="rl-card" style="--lg-col:${div.kleur}">
    <div class="rl-head">
      <span class="rl-badge no-ico">${div.ic}</span>
      <div class="rl-head-txt">
        <div class="rl-div">${div.naam}-divisie</div>
        <div class="rl-sub">Weekwedstrijd${zone}</div>
      </div>
      <div class="rl-xp">${rushTag}+${gained}<span>XP</span></div>
    </div>
    <div class="rl-rankrow">
      <div class="rl-rank">#<span class="rl-rank-num">${rankBefore}</span></div>
      <div class="rl-of">van ${total}</div>
      ${climbLine}
    </div>
    <button class="rl-cta" onclick="openLeague()">Bekijk divisie <span>→</span></button>
  </div>`;
  // Rangnummer laten "oplopen" van vorige stand naar nu (met pop bij aankomst).
  const numEl=box.querySelector('.rl-rank-num');
  const card=box.querySelector('.rl-card');
  if(numEl && rankNow!==rankBefore){
    const from=rankBefore,to=rankNow,steps=Math.abs(from-to);
    const dur=Math.min(1100,320+steps*130);const t0=performance.now();
    const tick=now=>{
      const p=Math.min(1,(now-t0)/dur);
      const eased=1-Math.pow(1-p,2);
      const val=Math.round(from+(to-from)*eased);
      numEl.textContent=val;
      if(p<1)requestAnimationFrame(tick);
      else{numEl.textContent=to;card&&card.classList.add('rl-pop');}
    };
    setTimeout(()=>requestAnimationFrame(tick),450);
  }else if(numEl){
    setTimeout(()=>{card&&card.classList.add('rl-pop');},450);
  }
}

// ── Divisie-stijging: vol scherm ná de finish als je plekken bent gestegen ──
// (Duolingo-stijl.) Toont het relevante stuk van het leaderboard en animeert
// jouw rij letterlijk omhoog (groen pijltje ▲), terwijl de mensen die je
// inhaalt zakken (rood pijltje ▼). 'finish' hoort bij de pop-up-wachtrij.
function showLeagueRankUp(info,finish){
  finish=(typeof finish==='function')?finish:function(){};
  if(!info||info.climbed<=0||document.getElementById('lg-rankup')){finish();return;}
  const L=ensureLeague();
  const div=info.div||LEAGUE_DIVISIONS[0];
  const promo=info.promo;
  const rows=_lgStandings(L);                 // EIND-stand (jij op nowXP), met .rank
  const pIdx=rows.findIndex(r=>r.me);
  if(pIdx<0){finish();return;}
  const above=pIdx>0?rows[pIdx-1]:null;       // iemand die nog boven je staat (context)
  const K=Math.min(info.climbed,4);           // toon maximaal 4 ingehaalde spelers
  const passed=rows.slice(pIdx+1,pIdx+1+K);   // spelers die je zojuist voorbij bent
  const base=above?1:0;
  const ROWH=60;                              // px per rij (moet met CSS matchen)
  // Zichtbare rijen in EIND-volgorde: [context?, JIJ, ingehaald...]
  const vis=[];
  if(above)vis.push({r:above,role:'ctx',after:0});
  vis.push({r:rows[pIdx],role:'me',after:base});
  passed.forEach((p,i)=>vis.push({r:p,role:'passed',after:base+1+i,pi:i}));
  const beforeIdx=v=>v.role==='ctx'?0:(v.role==='passed'?base+v.pi:base+passed.length);
  const rowHtml=vis.map(v=>{
    const dy=(beforeIdx(v)-v.after)*ROWH;
    const arrow=v.role==='me'?'<span class="lru-arw lru-up">▲</span>'
      :(v.role==='passed'?'<span class="lru-arw lru-dn">▼</span>':'');
    const cls=v.role==='me'?'lru-me':(v.role==='passed'?'lru-passed':'lru-ctx');
    return `<div class="lg-row lru-row ${cls}${v.r.me?' lg-row-me':''}" style="transform:translateY(${dy}px)" data-dy="${dy}">
      <div class="lru-rank">${arrow}<span class="lru-rk">${v.r.rank}</span></div>
      <div class="lg-row-av no-ico">${_lgAvatar(v.r)}</div>
      <div class="lg-row-name">${_lgEsc(v.r.naam)}${v.r.me?' <span class="lg-you">jij</span>':''}</div>
      <div class="lg-row-xp">${v.r.xp}<span class="lg-xp-u"> XP</span></div>
    </div>`;
  }).join('');
  const el=document.createElement('div');
  el.id='lg-rankup';el.className='lgc-overlay';
  el.innerHTML=`<div class="lgc-card lgc-up lru-card" style="--lg-col:${div.kleur}">
    <div class="lgc-rays" aria-hidden="true"></div>
    <div class="lru-badge no-ico">${div.ic}</div>
    <div class="lgc-kicker">${promo?'Promotiezone!':'Je bent gestegen'}</div>
    <div class="lru-title"><span class="lru-up-ar">▲</span> ${info.climbed} plek${info.climbed===1?'':'ken'} omhoog</div>
    <div class="lru-list" style="height:${vis.length*ROWH}px">${rowHtml}</div>
    <div class="lgc-sub">${div.naam}-divisie · #${info.rankNow} van ${info.total}</div>
    <button class="lgc-cta" onclick="_lgRankUpClose(true)">Bekijk mijn divisie</button>
    <button class="lgc-skip" onclick="_lgRankUpClose(false)">Verder</button>
  </div>`;
  window._lgRankUpFinish=finish;
  document.body.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('show'));
  try{if(typeof vonkPlay==='function')vonkEvent('promotion',{el:el.querySelector('.lgc-vonk'),silent:true});}catch(e){}
  try{playSound('complete');}catch(e){}
  // Na een korte beat: de rijen naar hun eindpositie laten schuiven + pijltjes/haptiek.
  setTimeout(()=>{
    el.querySelectorAll('.lru-row').forEach(rw=>{rw.style.transform='translateY(0)';});
    el.classList.add('lru-go');
    try{playSound(promo?'levelup':'combo');}catch(e){}
    try{if(promo&&typeof launchConfetti==='function')launchConfetti('gold');}catch(e){}
    try{haptic&&haptic([30,25,60,25,90]);}catch(e){}
  },600);
}
function _lgRankUpClose(go){
  const el=document.getElementById('lg-rankup');
  if(el){el.classList.remove('show');setTimeout(()=>el.remove(),260);}
  const fin=window._lgRankUpFinish;window._lgRankUpFinish=null;
  if(go){try{openLeague();}catch(e){}}
  if(typeof fin==='function'){try{fin();}catch(e){}}
}

// ── Volledig bord ──
function openLeague(){show('sc-league');renderLeague();try{leagueSyncAndFetch(true);}catch(e){}}
function renderLeague(){
  const box=document.getElementById('league-body');
  if(!box)return;
  const L=ensureLeague();
  const div=LEAGUE_DIVISIONS[L.division];
  const rows=_lgStandings(L);
  const next=LEAGUE_DIVISIONS[L.division+1];
  const prev=LEAGUE_DIVISIONS[L.division-1];
  const hdr=`
    <div class="lg-hero lg-hero-compact" style="--lg-col:${div.kleur}">
      <div class="lg-hero-badge no-ico">${div.ic}</div>
      <div class="lg-hero-txt">
        <div class="lg-hero-name">${div.naam}-divisie</div>
        <div class="lg-hero-sub">Nog ${_lgDaysLeft()} dag${_lgDaysLeft()===1?'':'en'} · top ${LEAGUE_PROMO} promoveert${next?' naar '+next.naam:''}${prev?', onderste '+LEAGUE_DEMOTE+' degradeert':''}</div>
      </div>
    </div>`;
  // Te winnen deze week (compacte strip): kist-beloningen per plek.
  const coin=(typeof _ico==='function')?_ico('coin',13):'🪙';
  const rw1=_lgPlacementReward(1,L.division), rw3=_lgPlacementReward(3,L.division), rw7=_lgPlacementReward(LEAGUE_PROMO,L.division);
  const rewardsRow=`<div class="lg-rewards"><span class="lg-rewards-lbl">🎁 Kisten</span>
    <span class="lg-rw lg-rw-gold"><b>Top&nbsp;3</b>${rw3}+${coin}item</span>
    <span class="lg-rw lg-rw-blue"><b>Top&nbsp;${LEAGUE_PROMO}</b>${rw7}+${coin}power</span></div>`;
  // Onopgehaalde week-kist? Prominente open-knop. Anders: recap-knop vorige week.
  const chestUnclaimed=!!(L.result&&L.result.chest&&!L.result.chest.claimed);
  let topBtn='';
  if(chestUnclaimed){
    const gold=L.result.chest.tier==='gold';
    topBtn=`<button class="lg-chest-btn ${gold?'lg-chest-gold':'lg-chest-blue'}" onclick="_lgOpenRewardChest()"><span class="lg-chest-em">🎁</span><span class="lg-chest-tx">Open je week-kist<small>${gold?'Top-3 · munten + zeldzaam item':'Top-7 · munten + power-up'}</small></span><span class="lg-recap-arr">→</span></button>`;
  }else if(L.result){
    topBtn=`<button class="lg-recap-btn" onclick="_lgShowRecap()"><span class="lg-recap-ic">📊</span>Recap vorige week — je werd <b>#${L.result.rank}</b> van ${L.result.total||LEAGUE_COHORT}<span class="lg-recap-arr">→</span></button>`;
  }
  box.innerHTML=hdr+topBtn+rewardsRow+leagueRushChip()+_lgFinishBanner(rows)+_lgListWithDividers(rows);
}
// Weekafsluiting-recap opnieuw tonen (vanuit de divisie-pagina).
function _lgShowRecap(){
  const L=getLeague();
  if(!L||!L.result)return;
  try{const ex=document.getElementById('lg-ceremony');if(ex)ex.remove();}catch(e){}
  try{showLeagueCeremony(L.result);}catch(e){}
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
