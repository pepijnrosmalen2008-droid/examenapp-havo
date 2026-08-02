// ═══════════════════════════════════════════════════════════════════════
// notif-engine.js - SLIMME NOTIFICATIE-MOTOR (fase 1 van de terugkeer-machine)
// ───────────────────────────────────────────────────────────────────────
// Eén brein dat uit ALLE app-signalen (streak, examen-countdown, foutenboek,
// divisie-zone, dagmissie, hoe lang je weg bent, tijdstip) het meest relevante
// bericht kiest. Dat brein voedt twee kanalen:
//   1. de in-app TERUGKEER-KAART op home (Vonk + één-tik-actie) - werkt overal,
//      ook op iOS; dit is waar re-engagement écht converteert.
//   2. de lokale MELDING (service worker) - de SW is "dom" en toont enkel wat
//      het brein hier besliste, zodat de logica niet dubbel bestaat.
//
// Berichtenbank met rotatie (nooit twee keer hetzelfde), toon die meegroeit met
// hoe lang iemand weg is (vrolijk → aanmoedigend → zachte schuld), en de
// examen-countdown die alles overstemt: Slagio's echte, oneerlijke urgentie.
// ═══════════════════════════════════════════════════════════════════════

// ── Context: lees de bestaande app-data uit; alles defensief (typeof-guards). ──
function notifContext(){
  const ctx={hour:new Date().getHours()};
  try{const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
    ctx.naam=(p.naam&&p.naam.trim())?p.naam.trim().split(/\s+/)[0]:'';}catch(e){ctx.naam='';}
  let st={current:0};try{st=calcStreak();}catch(e){}
  ctx.streak=st.current||0;
  const todayStr=new Date().toISOString().slice(0,10);
  let days=[];try{days=(getStreak().days)||[];}catch(e){}
  ctx.practicedToday=days.indexOf(todayStr)!==-1;
  ctx.lapsedDays=_notifLapsed(days);
  try{const tgt=(typeof getCountdownTarget==='function')?getCountdownTarget():null;
    if(tgt&&tgt.datum){const d=Math.ceil((new Date(tgt.datum)-new Date())/86400000);
      if(d>=0&&d<=60){ctx.examDays=d;ctx.examVak=tgt.vak||'je volgende examen';}}}catch(e){}
  try{ctx.fbDue=(typeof fbDueCount==='function')?fbDueCount():0;}catch(e){ctx.fbDue=0;}
  try{if(typeof ensureLeague==='function'){const L=ensureLeague();const rows=_lgStandings(L);
      const me=rows.find(r=>r.me);
      if(me){ctx.leagueRank=me.rank;ctx.leagueTotal=rows.length;
        ctx.leaguePromo=me.rank<=LEAGUE_PROMO;
        ctx.leagueDemote=me.rank>(rows.length-LEAGUE_DEMOTE);
        ctx.leagueDiv=(LEAGUE_DIVISIONS[L.division]||{}).naam||'';
        ctx.leagueDaysLeft=(typeof _lgDaysLeft==='function')?_lgDaysLeft():null;}}}catch(e){}
  try{ctx.dagmissieOpen=(typeof dagmissieDone==='function')?!dagmissieDone():false;}catch(e){ctx.dagmissieOpen=false;}
  return ctx;
}
// Dagen sinds laatste oefendag (0 = vandaag geoefend, 1 = gisteren, ...).
function _notifLapsed(days){
  if(!days||!days.length)return 999;
  const today=new Date();today.setHours(0,0,0,0);
  let best=999;
  for(const d of days){const diff=Math.round((today-new Date(d+'T00:00:00'))/86400000);
    if(diff>=0&&diff<best)best=diff;}
  return best;
}

// ── Hulpjes voor tekst ──
function _nDag(n){return n===1?'dag':'dagen';}
function _nNaam(ctx){return ctx.naam?(' '+ctx.naam):'';}

// ── Berichtenbank: geordend op prioriteit. Elk bericht kiest zelf zijn toon,
//    Vonk-pose en de knop-actie. `variants` levert 1+ tekstvarianten voor rotatie.
//    prio kan een getal of een functie(ctx) zijn (bv. examen: hoe dichterbij, hoe
//    hoger). `card` = mag als grote terugkeer-kaart op home verschijnen.
function _notifRules(){return [
  { id:'exam_urgent', prio:100, card:true, mood:'denk', action:'exam',
    test:c=>c.examDays!=null&&c.examDays<=3,
    variants:c=>[
      {t:`Nog ${c.examDays} ${_nDag(c.examDays)} tot ${c.examVak}`, b:`Eén korte oefensessie telt nu écht dubbel. Zullen we?`},
      {t:`${c.examVak} over ${c.examDays} ${_nDag(c.examDays)}`, b:`Vonk heeft een setje kernvragen voor je klaargezet.`},
    ]},
  { id:'exam_soon', prio:90, card:true, mood:'denk', action:'exam',
    test:c=>c.examDays!=null&&c.examDays>=4&&c.examDays<=7,
    variants:c=>[
      {t:`Over ${c.examDays} dagen is ${c.examVak}`, b:`Nu elke dag tien minuten maakt straks het verschil op je cijfer.`},
      {t:`${c.examVak} komt eraan`, b:`Nog ${c.examDays} dagen. Vandaag een domein afronden?`},
    ]},
  { id:'streak_risk_eve', prio:85, card:true, mood:'oeps', action:'streak',
    test:c=>c.streak>=2&&!c.practicedToday&&c.hour>=18,
    variants:c=>[
      {t:`Je streak van ${c.streak} dagen loopt af`, b:`Nog een paar uur tot middernacht. Twee minuten redt 'm. 🔥`},
      {t:`Snel${_nNaam(c)} - ${c.streak} dagen op het spel`, b:`Eén korte quiz vanavond en je streak blijft staan.`},
    ]},
  { id:'lapsed_long', prio:80, card:true, mood:'laag', action:'streak',
    test:c=>c.lapsedDays>=7&&c.lapsedDays<900,
    variants:c=>[
      {t:`Vonk heeft je ${c.lapsedDays} dagen niet gezien`, b:`Dit is de laatste herinnering die we sturen... tenzij je 'm verrast. 👀`},
      {t:`${c.lapsedDays} dagen zonder oefenen`, b:`Vonk maakt zich stiekem zorgen om je examen. Kom je terug?`},
    ]},
  { id:'lapsed_mid', prio:75, card:true, mood:'laag', action:'streak',
    test:c=>c.lapsedDays>=3&&c.lapsedDays<7,
    variants:c=>[
      {t:`Vonk mist je${_nNaam(c)}`, b:`Het is ${c.lapsedDays} dagen geleden. Eén rustige sessie en je bent weer bezig.`},
      {t:`Al ${c.lapsedDays} dagen niet geoefend`, b:`Geen stress - we pakken het rustig weer op. 💪`},
    ]},
  { id:'league_demote', prio:70, card:true, mood:'oeps', action:'league',
    test:c=>c.leagueDemote&&c.leagueDaysLeft!=null&&c.leagueDaysLeft<=1&&c.leagueDiv,
    variants:c=>[
      {t:`Je zakt uit de ${c.leagueDiv}-divisie`, b:`Nog ${c.leagueDaysLeft} ${_nDag(c.leagueDaysLeft)} - één quiz houdt je erin.`},
    ]},
  { id:'exam_14', prio:65, card:true, mood:'denk', action:'exam',
    test:c=>c.examDays!=null&&c.examDays>=8&&c.examDays<=14,
    variants:c=>[
      {t:`Nog twee weken tot ${c.examVak}`, b:`Wie nú begint, haalt straks het hoogste cijfer. Vandaag starten?`},
      {t:`${c.examVak}: ${c.examDays} dagen te gaan`, b:`Een klein rondje vandaag houdt de stof vers.`},
    ]},
  { id:'lapsed_short', prio:60, card:true, mood:'kijk', action:'streak',
    test:c=>c.lapsedDays>=1&&c.lapsedDays<=2,
    variants:c=>[
      {t:`Welkom terug${_nNaam(c)}`, b:`Gisteren overgeslagen? Geen probleem. Vonk staat klaar voor een nieuwe ronde.`},
      {t:`Weer even oefenen?`, b:`Je was net zo lekker bezig. Twee minuten en je bent er weer in.`},
    ]},
  { id:'streak_risk_day', prio:58, card:true, mood:'kijk', action:'streak',
    test:c=>c.streak>=2&&!c.practicedToday,
    variants:c=>[
      {t:`${c.streak} dagen op rij${_nNaam(c)}`, b:`Even vandaag ook? Dan groeit je streak door. 🔥`},
    ]},
  { id:'fb_due', prio:55, card:true, mood:'denk', action:'foutenboek',
    test:c=>c.fbDue>=3,
    variants:c=>[
      {t:`${c.fbDue} fouten staan klaar om te herhalen`, b:`Nu oefenen zet ze vast in je geheugen - precies op het juiste moment.`},
    ]},
  { id:'league_promo', prio:50, card:false, mood:'trots', action:'league',
    test:c=>c.leaguePromo&&c.leagueDaysLeft!=null&&c.leagueDaysLeft<=2&&c.leagueDiv,
    variants:c=>[
      {t:`Je staat op promotie!`, b:`Nog ${c.leagueDaysLeft} ${_nDag(c.leagueDaysLeft)} in de ${c.leagueDiv}-divisie. Pak 'm.`},
    ]},
  { id:'dagmissie', prio:45, card:false, mood:'blij', action:'dagmissie',
    test:c=>c.dagmissieOpen===true,
    variants:c=>[
      {t:`Je dagmissie staat nog open`, b:`Voltooi 'm voor dubbele XP de rest van vandaag.`},
    ]},
  { id:'exam_30', prio:40, card:false, mood:'kijk', action:'exam',
    test:c=>c.examDays!=null&&c.examDays>=15&&c.examDays<=30,
    variants:c=>[
      {t:`Nog ${c.examDays} dagen tot ${c.examVak}`, b:`Vandaag een zwak domein aanpakken?`},
    ]},
  { id:'streak_keep', prio:35, card:false, mood:'blij', action:'streak',
    test:c=>c.streak>=1&&!c.practicedToday,
    variants:c=>[
      {t:`Klaar voor je dagelijkse rondje?`, b:`Twee minuten en je streak groeit.`},
    ]},
  { id:'generic', prio:10, card:false, mood:'blij', action:'streak',
    test:c=>true,
    variants:c=>[
      {t:`Even oefenen${_nNaam(c)}?`, b:`Vonk heeft een frisse set vragen voor je klaarstaan.`},
      {t:`Tijd voor een korte quiz`, b:`Klein moment nu, groot verschil op je examen.`},
    ]},
];}

// Prioriteit als getal (rules gebruiken vaste getallen, maar sta functies toe).
function _notifPrio(r,ctx){return typeof r.prio==='function'?r.prio(ctx):r.prio;}

// ── Kern: kies het beste bericht voor deze context. ──
// opts.cardOnly → alleen berichten die als grote kaart mogen; anders alles
// (meldingen mogen ook een generiek bericht sturen).
function pickNotif(ctx,opts){
  ctx=ctx||notifContext();opts=opts||{};
  const rules=_notifRules()
    .filter(r=>{try{return r.test(ctx);}catch(e){return false;}})
    .filter(r=>opts.cardOnly?r.card:true)
    .sort((a,b)=>_notifPrio(b,ctx)-_notifPrio(a,ctx));
  if(!rules.length)return null;
  const r=rules[0];
  let vars=[];try{vars=r.variants(ctx)||[];}catch(e){vars=[];}
  if(!vars.length)return null;
  // Rotatie: vermijd de laatst getoonde variant van deze regel.
  let last='';try{last=localStorage.getItem('slagio_notif_last')||'';}catch(e){}
  let idx=0;
  if(vars.length>1){
    const opts2=vars.map((_,i)=>r.id+':'+i).filter(k=>k!==last);
    const pickKey=opts2.length?opts2[Math.floor(Math.random()*opts2.length)]:(r.id+':0');
    idx=parseInt(pickKey.split(':')[1])||0;
  }
  try{localStorage.setItem('slagio_notif_last',r.id+':'+idx);}catch(e){}
  const v=vars[idx]||vars[0];
  return {ruleId:r.id, prio:_notifPrio(r,ctx), title:v.t, body:v.b, mood:r.mood, action:r.action};
}

// Payload voor een systeem-melding (titel + body). Titel krijgt het merk erbij.
function notifPayload(){
  const n=pickNotif();
  if(!n)return null;
  return {title:'Slagio · '+n.title, body:n.body, tag:'slagio-daily', ruleId:n.ruleId};
}

// ── Actie-dispatcher voor de terugkeer-kaart (één-tik-knoppen). ──
function notifCardAction(action){
  _notifDismissCard(); // kaart weg bij starten
  try{
    if(action==='foutenboek'&&typeof openFoutenboek==='function')return openFoutenboek();
    if(action==='league'&&typeof openLeague==='function')return openLeague();
    if(action==='dagmissie'&&typeof startStreakQuiz==='function')return startStreakQuiz();
  }catch(e){}
  try{if(typeof startStreakQuiz==='function')return startStreakQuiz();}catch(e){}
}

// ── De in-app TERUGKEER-KAART: Vonk + slim bericht + één-tik-actie. ──
// Verschijnt alleen als er een échte reden is (kaart-waardig bericht) en is
// per dag weg te tikken, zodat dagelijkse gebruikers niet genag'd worden.
function renderNotifReturnCard(){
  const el=document.getElementById('comeback-card-home');
  if(!el)return;
  el.innerHTML='';
  // Vandaag al weggetikt? Dan niet opnieuw tonen.
  const todayStr=new Date().toISOString().slice(0,10);
  try{if(localStorage.getItem('slagio_return_dismissed')===todayStr)return;}catch(e){}
  const ctx=notifContext();
  const n=pickNotif(ctx,{cardOnly:true});
  if(!n)return;
  const vonk=(typeof mascotSVG==='function')?mascotSVG(n.mood,74):'';
  const ctaLabel={exam:'Begin nu',streak:'Start oefensessie',foutenboek:'Herhaal fouten',
    league:'Naar mijn divisie',dagmissie:'Doe de dagmissie'}[n.action]||'Start';
  const guilt=(n.mood==='laag'||n.mood==='oeps')?' rc-guilt':'';
  el.innerHTML=`
  <div class="return-card${guilt}" role="group" aria-label="Herinnering van Vonk">
    <button class="return-x" onclick="_notifDismissCard()" aria-label="Sluiten">✕</button>
    <div class="return-vonk">${vonk}</div>
    <div class="return-body">
      <div class="return-title">${_notifEsc(n.title)}</div>
      <div class="return-sub">${_notifEsc(n.body)}</div>
      <button class="return-cta" onclick="notifCardAction('${n.action}')">${ctaLabel}
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
    </div>
  </div>`;
  try{trackEvent('return_card_shown',{rule:n.ruleId});}catch(e){}
}
function _notifDismissCard(){
  const el=document.getElementById('comeback-card-home');if(el)el.innerHTML='';
  try{localStorage.setItem('slagio_return_dismissed',new Date().toISOString().slice(0,10));}catch(e){}
}
function _notifEsc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
// (renderComebackCard blijft in features.js en delegeert naar renderNotifReturnCard,
//  zodat alle bestaande home-render-aanroepen automatisch de terugkeer-kaart tonen.)
