// ═══════ PROFIEL & CIJFERS ═══════
const PROF_KEY='examenapp_profiel';
const CIJFER_KEY='examenapp_cijfers';

const VAK_NAAM_MAP={
  // ── Nederlands ──
  'nederlands':'nl','ne':'nl','ned':'nl','nl':'nl','nlt':'nl',
  'ned taal':'nl','ned. taal':'nl','nederlandse taal':'nl',
  'nederlandse taal en literatuur':'nl','ned. taal en lit.':'nl',
  'ned. taal en lit':'nl','ned taal en literatuur':'nl','taal en literatuur':'nl',
  // ── Wiskunde A (vóór generieke wiskunde) ──
  'wiskunde a':'wa','wisk. a':'wa','wisk.a':'wa','wiskunde-a':'wa',
  'wa':'wa','wis a':'wa','wisk a':'wa','wiska':'wa',
  // ── Wiskunde B ──
  'wiskunde b':'wb','wisk. b':'wb','wisk.b':'wb','wiskunde-b':'wb',
  'wb':'wb','wis b':'wb','wisk b':'wb','wiskb':'wb',
  // ── Wiskunde generiek (fallback) ──
  'wiskunde':'wa','wisk':'wa',
  // ── Biologie ──
  'biologie':'bi','bio':'bi','biol':'bi','bi':'bi',
  // ── Scheikunde ──
  'scheikunde':'sk','schk':'sk','schei':'sk','sk':'sk',
  'nask2':'sk','nask 2':'sk','nask-2':'sk',
  // ── Natuurkunde ──
  'natuurkunde':'na','natk':'na','na':'na','nat':'na',
  'nask1':'na','nask 1':'na','nask-1':'na','nask':'na',
  // ── Economie ──
  'economie':'ec','eco':'ec','econ':'ec','ec':'ec',
  // ── Bedrijfseconomie ──
  'bedrijfseconomie':'be','bedr.ec.':'be','bedrijfsec.':'be',
  'bedrijfsec':'be','bedr ec':'be','be':'be','bedreco':'be',
  // ── Engels ──
  'engels':'en','eng':'en','english':'en','en':'en',
  'engelse taal en literatuur':'en','eng. taal en lit.':'en',
  'eng. taal en lit':'en','engelse taal':'en',
  // ── Maatschappijwetenschappen ──
  'maatschappijwetenschappen':'mw','maatschappijwetensch.':'mw',
  'maatschappijwetensch':'mw','maatschappijleer':'mw',
  'maatsch.leer':'mw','maatsch leer':'mw','m&m':'mw','mw':'mw',
  'maat':'mw','maatwetensch':'mw','maw':'mw',
  // ── Geschiedenis ──
  'geschiedenis':'gs','ges':'gs','gesch':'gs','hist':'gs','gs':'gs',
  // ── Aardrijkskunde ──
  'aardrijkskunde':'ak','aard':'ak','aardrijksk':'ak','geo':'ak','ak':'ak',
  // ── Duits ──
  'duits':'du','du':'du','dui':'du','german':'du',
  'duitse taal en literatuur':'du','dui. taal en lit.':'du','duitse taal':'du',
  // ── Frans ──
  'frans':'fr','fr':'fr','fra':'fr','french':'fr',
  'franse taal en literatuur':'fr','fra. taal en lit.':'fr','franse taal':'fr',
};

// Gesorteerde sleutels: langste eerst zodat specifiekere matches prioriteit krijgen
const _VAK_KEYS_SORTED=Object.keys(VAK_NAAM_MAP).sort((a,b)=>b.length-a.length);

function matchVakNaam(raw){
  if(!raw||raw.length<2)return null;
  const s=raw.toLowerCase().trim()
    .replace(/[.,;:()\[\]\/|]/g,' ')
    .replace(/\s+/g,' ').trim();
  if(!s||s.length<2)return null;
  // 1. Exacte match
  if(VAK_NAAM_MAP[s])return VAK_NAAM_MAP[s];
  // 2. Bevat-match (langste sleutels eerst, minimaal 3 tekens)
  for(const key of _VAK_KEYS_SORTED){
    if(key.length>=3&&s.includes(key))return VAK_NAAM_MAP[key];
  }
  return null;
}

const AVATARS=[
  {e:'🦁',n:'Leeuw'},{e:'🐯',n:'Tijger'},{e:'🦊',n:'Vos'},{e:'🐺',n:'Wolf'},
  {e:'🐻',n:'Beer'},{e:'🐼',n:'Panda'},{e:'🐨',n:'Koala'},{e:'🦝',n:'Wasbeer'},
  {e:'🐸',n:'Kikker'},{e:'🐧',n:'Pinguïn'},{e:'🦦',n:'Otter'},{e:'🦉',n:'Uil'},
  {e:'🦆',n:'Eend'},{e:'🐬',n:'Dolfijn'},{e:'🦈',n:'Haai'},{e:'🐙',n:'Octopus'},
  {e:'🦋',n:'Vlinder'},{e:'🦜',n:'Papegaai'},{e:'🐊',n:'Krokodil'},{e:'🦒',n:'Giraf'},
];
let selectedAvatar=AVATARS[4].e;
// ── ANIMAL EVOLUTION SYSTEM ──
const ANIMAL_EVOLUTIONS=[
  {id:'adelaar', n:'Adelaar', s:['','','','','',''], fallback:['🥚','🐣','🐥','🦅','🦅','🦅'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="52" rx="15" ry="3.5" fill="#6b4520" opacity=".18"/><path d="M19 50 q11 5 22 0" fill="none" stroke="#8b6a3a" stroke-width="2.4" stroke-linecap="round"/><path d="M30 14 C39 14 45 27 45 37 C45 46 38 51 30 51 C22 51 15 46 15 37 C15 27 21 14 30 14Z" fill="#f4ecd8" stroke="#c79a5b" stroke-width="2.4"/><path d="M26 29 l4 3 -4 3 4 3" fill="none" stroke="#c79a5b" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><circle cx="23" cy="27" r="1.6" fill="#d8b06e"/><circle cx="37" cy="35" r="1.8" fill="#d8b06e"/><ellipse cx="25" cy="24" rx="5" ry="2.6" fill="#fff" opacity=".5"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="53" rx="12" ry="3" fill="#6b4520" opacity=".16"/><path d="M14 39 q-4 -4 0 -7 M46 39 q4 -4 0 -7" stroke="#eaba52" stroke-width="3.2" fill="none" stroke-linecap="round"/><circle cx="30" cy="34" r="16" fill="#f3cd6e"/><path d="M24 18 q1.5 -5 3.5 -1 M30 16 q1.5 -5.5 3.5 -1 M36 18 q-1.5 -5 -3.5 -1" stroke="#eaba52" stroke-width="3.2" fill="none" stroke-linecap="round"/><circle cx="24" cy="33" r="5.4" fill="#fff"/><circle cx="36" cy="33" r="5.4" fill="#fff"/><circle cx="24.6" cy="34" r="3.2" fill="#3a2408"/><circle cx="35.4" cy="34" r="3.2" fill="#3a2408"/><circle cx="23.2" cy="32.2" r="1.2" fill="#fff"/><circle cx="34.6" cy="32.2" r="1.2" fill="#fff"/><path d="M27 39 l3 -2.4 3 2.4 -3 3Z" fill="#f6a821" stroke="#cf7212" stroke-width="1" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="54" rx="13" ry="3" fill="#5a3a1a" opacity=".2"/><ellipse cx="13" cy="38" rx="7" ry="11" fill="#9c6a32" stroke="#6b4520" stroke-width="2" transform="rotate(18,13,38)"/><ellipse cx="47" cy="38" rx="7" ry="11" fill="#9c6a32" stroke="#6b4520" stroke-width="2" transform="rotate(-18,47,38)"/><circle cx="30" cy="35" r="17" fill="#b07a38"/><circle cx="30" cy="35" r="17" fill="none" stroke="#9c6a32" stroke-width="0"/><circle cx="23" cy="33" r="6" fill="#fff"/><circle cx="37" cy="33" r="6" fill="#fff"/><circle cx="23.6" cy="34" r="3.5" fill="#f59e0b"/><circle cx="36.4" cy="34" r="3.5" fill="#f59e0b"/><circle cx="23.6" cy="34" r="1.9" fill="#1a0a00"/><circle cx="36.4" cy="34" r="1.9" fill="#1a0a00"/><circle cx="22.2" cy="32.4" r="1.3" fill="#fff"/><circle cx="35" cy="32.4" r="1.3" fill="#fff"/><path d="M27 40 q3 -2 6 0 q-1 4 -3 5 q-2 -1 -3 -5Z" fill="#f6b40e" stroke="#c98a00" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="55" rx="14" ry="3" fill="#3a250f" opacity=".22"/><path d="M14 30 q-12 4 -10 18 q9 -2 14 -9Z" fill="#7c5326" stroke="#4a3015" stroke-width="2" stroke-linejoin="round"/><path d="M46 30 q12 4 10 18 q-9 -2 -14 -9Z" fill="#7c5326" stroke="#4a3015" stroke-width="2" stroke-linejoin="round"/><circle cx="30" cy="34" r="18" fill="#8b5a2b"/><path d="M30 16 q-13 1 -16 12" fill="none" stroke="#a06a32" stroke-width="2" stroke-linecap="round" opacity=".7"/><circle cx="22.5" cy="32" r="6.2" fill="#fff"/><circle cx="37.5" cy="32" r="6.2" fill="#fff"/><circle cx="23.2" cy="33" r="3.6" fill="#f59e0b"/><circle cx="36.8" cy="33" r="3.6" fill="#f59e0b"/><circle cx="23.2" cy="33" r="2" fill="#0a0500"/><circle cx="36.8" cy="33" r="2" fill="#0a0500"/><circle cx="21.8" cy="31.4" r="1.3" fill="#fff"/><circle cx="35.4" cy="31.4" r="1.3" fill="#fff"/><path d="M17 27 q5 -2 8 1 M43 27 q-5 -2 -8 1" stroke="#6b4520" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M26.5 38 q3.5 -2 7 0 q-1 5 -3.5 6.5 q-2.5 -1.5 -3.5 -6.5Z" fill="#f6b40e" stroke="#b8780a" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="56" rx="14" ry="3" fill="#2a1a08" opacity=".25"/><path d="M13 28 q-13 4 -11 19 q10 -2 15 -10Z" fill="#5a3a1a" stroke="#2a1a08" stroke-width="2" stroke-linejoin="round"/><path d="M47 28 q13 4 11 19 q-10 -2 -15 -10Z" fill="#5a3a1a" stroke="#2a1a08" stroke-width="2" stroke-linejoin="round"/><ellipse cx="30" cy="38" rx="15" ry="15.5" fill="#6b4520"/><path d="M15 26 Q30 12 45 26 Q42 31 30 32 Q18 31 15 26Z" fill="#f7f3ea" stroke="#ddd3c0" stroke-width="1.6"/><circle cx="23" cy="27" r="6.2" fill="#fff"/><circle cx="37" cy="27" r="6.2" fill="#fff"/><circle cx="23.6" cy="28" r="3.5" fill="#fbbf24"/><circle cx="36.4" cy="28" r="3.5" fill="#fbbf24"/><circle cx="23.6" cy="28" r="1.9" fill="#0a0500"/><circle cx="36.4" cy="28" r="1.9" fill="#0a0500"/><circle cx="22.2" cy="26.4" r="1.3" fill="#fff"/><circle cx="35" cy="26.4" r="1.3" fill="#fff"/><path d="M16 23 q6 -1 9 2 M44 23 q-6 -1 -9 2" stroke="#cdaa5a" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M26 33 q4 -2 8 0 q-1 5.5 -4 7.5 q-3 -2 -4 -7.5Z" fill="#f6b40e" stroke="#b8780a" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="57" rx="14" ry="2.8" fill="#2a1a08" opacity=".28"/><path d="M11 20 Q-3 26 4 44 Q14 38 20 30 Q15 24 11 20Z" fill="#4a3015" stroke="#2a1a08" stroke-width="1.8" stroke-linejoin="round"/><path d="M49 20 Q63 26 56 44 Q46 38 40 30 Q45 24 49 20Z" fill="#4a3015" stroke="#2a1a08" stroke-width="1.8" stroke-linejoin="round"/><ellipse cx="30" cy="39" rx="15" ry="15" fill="#5a3a1a"/><path d="M14 25 Q30 11 46 25 Q43 31 30 32 Q17 31 14 25Z" fill="#f8f5ee" stroke="#ddd3c0" stroke-width="1.6"/><path d="M30 4 l2.6 5.2 5.7 .7 -4.2 4 1 5.6 -5.1 -2.8 -5.1 2.8 1 -5.6 -4.2 -4 5.7 -.7Z" fill="#f9cf4d" stroke="#dca91e" stroke-width="1" stroke-linejoin="round"/><circle cx="22.5" cy="26" r="6.4" fill="#fff"/><circle cx="37.5" cy="26" r="6.4" fill="#fff"/><circle cx="23.2" cy="27" r="3.6" fill="#fbbf24"/><circle cx="36.8" cy="27" r="3.6" fill="#fbbf24"/><circle cx="23.2" cy="27" r="2" fill="#0a0500"/><circle cx="36.8" cy="27" r="2" fill="#0a0500"/><circle cx="21.8" cy="25.4" r="1.4" fill="#fff"/><circle cx="35.4" cy="25.4" r="1.4" fill="#fff"/><path d="M16 22 q6 -1 9 2 M44 22 q-6 -1 -9 2" stroke="#d4a534" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M25.5 32 q4.5 -2 9 0 q-1.5 6 -4.5 8 q-3 -2 -4.5 -8Z" fill="#f6b40e" stroke="#b8780a" stroke-width="1.6" stroke-linejoin="round"/><path d="M25 52 l-1.5 4.5 M30 53 l0 4.5 M35 52 l1.5 4.5" stroke="#f6b40e" stroke-width="2.4" stroke-linecap="round"/></svg>'
   ],
   lbl:['Verward Ei','Pluizig Kuiken','Jonge Pieper','Bruine Jager','Witkop-Adelaar','Gouden Adelaar','Hemelheerser'],
   desc:['Ligt te broeden op kennis. Komt er bijna uit.','Donzig en nieuwsgierig, piept bij elke vraag.','Eerste veren, eerste oefenvluchten. Valt nog vaak.','Scherpe blik, jaagt op hoge cijfers.','Witte kop, gouden blik. Niets ontgaat hem meer.','Verguld van kop tot klauw. Bijna op de allerhoogste top.','Met gespreide vleugels en kroon torent hij boven elk examen uit.'],
   evoMsg:['🐣 Je ei is uit! Een donzig kuikentje piept van trots.','🐥 Eerste veren! Je Adelaar waagt zijn eerste vlucht.','🦅 Bruine jager ontwaakt - scherpe blik, scherpe geest.','🦅 WITKOP-ADELAAR! De examinator voelt de wind van je vleugels.','🏅 GOUDEN ADELAAR! Je verenkleed glanst als puur goud.','👑 HEMELHEERSER ONTGRENDELD! Het ultieme niveau. Jij zweeft.']},
  {id:'leeuw', n:'Leeuw', s:['','','','','',''], fallback:['🐱','🐱','🦁','🦁','🦁','🦁'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="51" rx="12" ry="3" fill="#7c4a1e" opacity=".15"/><circle cx="20" cy="24" r="4.6" fill="#e0a05c"/><circle cx="40" cy="24" r="4.6" fill="#e0a05c"/><circle cx="20" cy="24" r="2.2" fill="#f3b9a0"/><circle cx="40" cy="24" r="2.2" fill="#f3b9a0"/><circle cx="30" cy="34" r="15" fill="#edb072"/><ellipse cx="30" cy="39" rx="8.5" ry="6.5" fill="#f8e2c2"/><circle cx="24" cy="32" r="4.4" fill="#fff"/><circle cx="36" cy="32" r="4.4" fill="#fff"/><circle cx="24.4" cy="33" r="2.4" fill="#3a2410"/><circle cx="35.6" cy="33" r="2.4" fill="#3a2410"/><circle cx="23.4" cy="31.4" r="1" fill="#fff"/><circle cx="34.6" cy="31.4" r="1" fill="#fff"/><path d="M30 37.5 l-2.4 -2 h4.8Z" fill="#6b3f18"/><path d="M30 39.5 q-2.5 2.2 -4.5 1 M30 39.5 q2.5 2.2 4.5 1" fill="none" stroke="#b07a3c" stroke-width="1.3" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="52" rx="13" ry="3" fill="#7c4a1e" opacity=".16"/><circle cx="30" cy="34" r="19" fill="#cd7d2c" opacity=".5"/><circle cx="19" cy="23" r="4.8" fill="#e0a05c"/><circle cx="41" cy="23" r="4.8" fill="#e0a05c"/><circle cx="19" cy="23" r="2.3" fill="#f3b9a0"/><circle cx="41" cy="23" r="2.3" fill="#f3b9a0"/><circle cx="30" cy="34" r="15.5" fill="#edb072"/><ellipse cx="30" cy="39" rx="9" ry="7" fill="#f8e2c2"/><circle cx="24" cy="32" r="4.6" fill="#fff"/><circle cx="36" cy="32" r="4.6" fill="#fff"/><circle cx="24.4" cy="33" r="2.5" fill="#3a2410"/><circle cx="35.6" cy="33" r="2.5" fill="#3a2410"/><circle cx="23.3" cy="31.4" r="1.1" fill="#fff"/><circle cx="34.5" cy="31.4" r="1.1" fill="#fff"/><path d="M30 38 l-2.6 -2.2 h5.2Z" fill="#6b3f18"/><path d="M30 40 q-3 2.4 -5 1 M30 40 q3 2.4 5 1" fill="none" stroke="#b07a3c" stroke-width="1.4" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="53" rx="14" ry="3" fill="#5e3815" opacity=".18"/><g fill="#bd6e1e"><circle cx="30" cy="34" r="20"/><circle cx="13" cy="27" r="5.2"/><circle cx="47" cy="27" r="5.2"/><circle cx="16" cy="42" r="5"/><circle cx="44" cy="42" r="5"/><circle cx="30" cy="15" r="5"/></g><circle cx="20" cy="24" r="4.6" fill="#e0a05c"/><circle cx="40" cy="24" r="4.6" fill="#e0a05c"/><circle cx="20" cy="24" r="2.2" fill="#f3b9a0"/><circle cx="40" cy="24" r="2.2" fill="#f3b9a0"/><circle cx="30" cy="34" r="15" fill="#edb072"/><ellipse cx="30" cy="39" rx="9" ry="7" fill="#f8e2c2"/><circle cx="24" cy="32" r="4.6" fill="#fff"/><circle cx="36" cy="32" r="4.6" fill="#fff"/><circle cx="24.4" cy="33" r="2.6" fill="#3a2410"/><circle cx="35.6" cy="33" r="2.6" fill="#3a2410"/><circle cx="23.3" cy="31.4" r="1.1" fill="#fff"/><circle cx="34.5" cy="31.4" r="1.1" fill="#fff"/><path d="M30 38 l-2.6 -2.2 h5.2Z" fill="#6b3f18"/><path d="M30 40 q-3 2.4 -5 1 M30 40 q3 2.4 5 1" fill="none" stroke="#a06a30" stroke-width="1.4" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="55" rx="15" ry="3" fill="#4a2c10" opacity=".2"/><g fill="#b05f16"><circle cx="30" cy="33" r="23"/><circle cx="9" cy="24" r="6"/><circle cx="51" cy="24" r="6"/><circle cx="8" cy="38" r="6"/><circle cx="52" cy="38" r="6"/><circle cx="14" cy="50" r="5.5"/><circle cx="46" cy="50" r="5.5"/><circle cx="30" cy="10" r="6"/></g><g fill="#cd7d2c"><circle cx="30" cy="33" r="18"/></g><circle cx="20" cy="22" r="4.6" fill="#e0a05c"/><circle cx="40" cy="22" r="4.6" fill="#e0a05c"/><circle cx="20" cy="22" r="2.2" fill="#f3b9a0"/><circle cx="40" cy="22" r="2.2" fill="#f3b9a0"/><circle cx="30" cy="33" r="15" fill="#edb072"/><ellipse cx="30" cy="38" rx="9.5" ry="7.5" fill="#f8e2c2"/><circle cx="23.5" cy="31" r="4.8" fill="#fff"/><circle cx="36.5" cy="31" r="4.8" fill="#fff"/><circle cx="24" cy="32" r="2.7" fill="#c9912a"/><circle cx="36" cy="32" r="2.7" fill="#c9912a"/><circle cx="24" cy="32" r="1.5" fill="#1a0e00"/><circle cx="36" cy="32" r="1.5" fill="#1a0e00"/><circle cx="22.8" cy="30.4" r="1.1" fill="#fff"/><circle cx="34.8" cy="30.4" r="1.1" fill="#fff"/><path d="M30 37 l-2.8 -2.4 h5.6Z" fill="#6b3f18"/><path d="M30 39.4 q-3.2 2.6 -5.5 1 M30 39.4 q3.2 2.6 5.5 1" fill="none" stroke="#9c6428" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="56" rx="16" ry="3" fill="#3a2208" opacity=".22"/><g fill="#a85614"><circle cx="30" cy="33" r="25"/><circle cx="6" cy="22" r="6.5"/><circle cx="54" cy="22" r="6.5"/><circle cx="4" cy="36" r="6.5"/><circle cx="56" cy="36" r="6.5"/><circle cx="10" cy="50" r="6"/><circle cx="50" cy="50" r="6"/><circle cx="30" cy="8" r="6.5"/><circle cx="18" cy="13" r="5.5"/><circle cx="42" cy="13" r="5.5"/></g><g fill="#c2701c"><circle cx="30" cy="33" r="19"/></g><circle cx="19" cy="21" r="4.8" fill="#dd9a52"/><circle cx="41" cy="21" r="4.8" fill="#dd9a52"/><circle cx="19" cy="21" r="2.3" fill="#f3b9a0"/><circle cx="41" cy="21" r="2.3" fill="#f3b9a0"/><circle cx="30" cy="33" r="15.5" fill="#edb072"/><ellipse cx="30" cy="38" rx="10" ry="8" fill="#f9e6c8"/><circle cx="23.5" cy="31" r="5" fill="#fff"/><circle cx="36.5" cy="31" r="5" fill="#fff"/><circle cx="24" cy="32" r="2.8" fill="#cf9a2c"/><circle cx="36" cy="32" r="2.8" fill="#cf9a2c"/><circle cx="24" cy="32" r="1.6" fill="#160c00"/><circle cx="36" cy="32" r="1.6" fill="#160c00"/><circle cx="22.7" cy="30.3" r="1.2" fill="#fff"/><circle cx="34.7" cy="30.3" r="1.2" fill="#fff"/><path d="M30 37 l-3 -2.5 h6Z" fill="#5e3614"/><path d="M30 39.5 q-3.5 2.8 -6 1 M30 39.5 q3.5 2.8 6 1" fill="none" stroke="#8a5420" stroke-width="1.6" stroke-linecap="round"/><path d="M19 38 l-9 -2 M19 41 l-9 1 M41 38 l9 -2 M41 41 l9 1" stroke="#cdb089" stroke-width="1.1" stroke-linecap="round" opacity=".7"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="57" rx="16" ry="2.8" fill="#3a2208" opacity=".24"/><g fill="#9c4e10"><circle cx="30" cy="34" r="25"/><circle cx="6" cy="23" r="6.5"/><circle cx="54" cy="23" r="6.5"/><circle cx="4" cy="37" r="6.5"/><circle cx="56" cy="37" r="6.5"/><circle cx="10" cy="51" r="6"/><circle cx="50" cy="51" r="6"/><circle cx="18" cy="14" r="5.5"/><circle cx="42" cy="14" r="5.5"/></g><g fill="#bb6818"><circle cx="30" cy="34" r="19"/></g><path d="M30 3 l3 5.5 6 .7 -4.5 4.3 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4.3 6 -.7Z" fill="#f9cf4d" stroke="#dca91e" stroke-width="1" stroke-linejoin="round"/><circle cx="19" cy="22" r="4.8" fill="#dd9a52"/><circle cx="41" cy="22" r="4.8" fill="#dd9a52"/><circle cx="19" cy="22" r="2.3" fill="#f3b9a0"/><circle cx="41" cy="22" r="2.3" fill="#f3b9a0"/><circle cx="30" cy="34" r="15.5" fill="#edb072"/><ellipse cx="30" cy="39" rx="10" ry="8" fill="#f9e6c8"/><circle cx="23.5" cy="32" r="5" fill="#fff"/><circle cx="36.5" cy="32" r="5" fill="#fff"/><circle cx="24" cy="33" r="2.8" fill="#cf9a2c"/><circle cx="36" cy="33" r="2.8" fill="#cf9a2c"/><circle cx="24" cy="33" r="1.6" fill="#160c00"/><circle cx="36" cy="33" r="1.6" fill="#160c00"/><circle cx="22.7" cy="31.3" r="1.2" fill="#fff"/><circle cx="34.7" cy="31.3" r="1.2" fill="#fff"/><path d="M30 38 l-3 -2.5 h6Z" fill="#5e3614"/><path d="M30 40.5 q-3.5 2.8 -6 1 M30 40.5 q3.5 2.8 6 1" fill="none" stroke="#8a5420" stroke-width="1.6" stroke-linecap="round"/><path d="M19 39 l-9 -2 M19 42 l-9 1 M41 39 l9 -2 M41 42 l9 1" stroke="#cdb089" stroke-width="1.1" stroke-linecap="round" opacity=".7"/></svg>'
   ],
   lbl:['Leeuwenwelp','Speelse Welp','Jonge Manen','Manen-Leeuw','Manenkoning','Gouden Leeuw','Koning der Savanne'],
   desc:['Klein, donzig en altijd honger naar kennis.','Speelt liever dan oefent. Schattig maar leergierig.','Eerste manenpluk! Voelt zich al heel wat.','Volle manen, vol zelfvertrouwen.','Brult bij elk goed antwoord. De savanne luistert.','Verguld van manen tot poot. Bijna onaantastbaar.','De koning der savanne. Zelfs de surveillant buigt.'],
   evoMsg:['🦁 Je welpje speelt en leert! Eerste stapjes.','🦁 Eerste manenpluk! Je Leeuw voelt zich al heel wat.','🦁 Manen-Leeuw ontwaakt - vol zelfvertrouwen.','🦁 MANENKONING! De savanne valt stil als je brult.','🏅 GOUDEN LEEUW! Je manen glanzen als puur goud.','👑 KONING DER SAVANNE! De ultieme, gekroonde vorm.']},
  {id:'draak', n:'Draak', s:['','','','','',''], fallback:['🥚','🐲','🐲','🐉','🐉','🐉'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="51" rx="12" ry="3" fill="#1f5132" opacity=".16"/><path d="M30 14 C39 14 45 27 45 37 C45 47 38 51 30 51 C22 51 15 47 15 37 C15 27 21 14 30 14Z" fill="#bfe8c6" stroke="#5aab6c" stroke-width="2.4"/><path d="M30 16 q-8 6 -7 16 q7 4 14 0 q1 -10 -7 -16Z" fill="#a6dcaf" opacity=".7"/><path d="M24 28 l4 4 -4 4" fill="none" stroke="#5aab6c" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/><circle cx="22" cy="26" r="1.5" fill="#7cc488"/><circle cx="38" cy="34" r="1.6" fill="#7cc488"/><ellipse cx="25" cy="24" rx="5" ry="2.6" fill="#fff" opacity=".5"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="52" rx="12" ry="3" fill="#1f5132" opacity=".18"/><path d="M22 16 l-2 -7 6 5Z" fill="#e8d8a8"/><path d="M38 16 l2 -7 -6 5Z" fill="#e8d8a8"/><circle cx="30" cy="34" r="16" fill="#48b863"/><ellipse cx="30" cy="40" rx="9" ry="6.5" fill="#bfe8c6"/><path d="M30 11 q-3 4 0 6 q3 -2 0 -6Z" fill="#3a9a52"/><circle cx="24" cy="33" r="4.8" fill="#fff"/><circle cx="36" cy="33" r="4.8" fill="#fff"/><circle cx="24.4" cy="34" r="2.6" fill="#143d22"/><circle cx="35.6" cy="34" r="2.6" fill="#143d22"/><circle cx="23.3" cy="32.4" r="1.1" fill="#fff"/><circle cx="34.5" cy="32.4" r="1.1" fill="#fff"/><path d="M25 39 q5 3 10 0" fill="none" stroke="#2e7d46" stroke-width="1.6" stroke-linecap="round"/><circle cx="25.5" cy="41" r="1" fill="#3a9a52"/><circle cx="34.5" cy="41" r="1" fill="#3a9a52"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="54" rx="14" ry="3" fill="#143d22" opacity=".2"/><path d="M8 32 q-6 6 -2 14 q7 -2 11 -8Z" fill="#3a9a52" stroke="#2e7d46" stroke-width="1.6" stroke-linejoin="round"/><path d="M52 32 q6 6 2 14 q-7 -2 -11 -8Z" fill="#3a9a52" stroke="#2e7d46" stroke-width="1.6" stroke-linejoin="round"/><path d="M21 15 l-2.5 -8 7 6Z" fill="#e8d8a8" stroke="#bba35a" stroke-width="1"/><path d="M39 15 l2.5 -8 -7 6Z" fill="#e8d8a8" stroke="#bba35a" stroke-width="1"/><circle cx="30" cy="34" r="17" fill="#44b35e"/><ellipse cx="30" cy="40" rx="10" ry="7" fill="#bfe8c6"/><path d="M30 9 q-4 5 0 8 q4 -3 0 -8Z" fill="#2e8c46"/><circle cx="23.5" cy="33" r="5" fill="#fff"/><circle cx="36.5" cy="33" r="5" fill="#fff"/><circle cx="24" cy="34" r="2.7" fill="#0e2e18"/><circle cx="36" cy="34" r="2.7" fill="#0e2e18"/><circle cx="22.8" cy="32.4" r="1.1" fill="#fff"/><circle cx="34.8" cy="32.4" r="1.1" fill="#fff"/><path d="M24 39 q6 4 12 0" fill="none" stroke="#256b39" stroke-width="1.7" stroke-linecap="round"/><path d="M26 41 l1 2 M30 42 l0 2 M34 41 l-1 2" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="55" rx="15" ry="3" fill="#0e2e18" opacity=".22"/><path d="M6 28 q-8 8 -3 18 q9 -2 14 -10Z" fill="#359150" stroke="#256b39" stroke-width="1.7" stroke-linejoin="round"/><path d="M54 28 q8 8 3 18 q-9 -2 -14 -10Z" fill="#359150" stroke="#256b39" stroke-width="1.7" stroke-linejoin="round"/><path d="M19 14 l-3 -9 8 7Z" fill="#ecdcac" stroke="#bba35a" stroke-width="1"/><path d="M41 14 l3 -9 -8 7Z" fill="#ecdcac" stroke="#bba35a" stroke-width="1"/><circle cx="30" cy="34" r="18.5" fill="#40ad5a"/><path d="M30 16 v-7 M22 18 q-2 -5 1 -8 M38 18 q2 -5 -1 -8" stroke="#2e8c46" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="30" cy="40" rx="11" ry="8" fill="#c6ebcc"/><circle cx="23" cy="32" r="5.2" fill="#fff"/><circle cx="37" cy="32" r="5.2" fill="#fff"/><circle cx="23.6" cy="33" r="2.9" fill="#d4a32c"/><circle cx="36.4" cy="33" r="2.9" fill="#d4a32c"/><circle cx="23.6" cy="33" r="1.6" fill="#0a2010"/><circle cx="36.4" cy="33" r="1.6" fill="#0a2010"/><circle cx="22.3" cy="31.3" r="1.2" fill="#fff"/><circle cx="35.1" cy="31.3" r="1.2" fill="#fff"/><path d="M22 39 q8 5 16 0" fill="none" stroke="#1f5e32" stroke-width="1.8" stroke-linecap="round"/><path d="M25 41 l1.5 2.5 M30 42 l0 2.5 M35 41 l-1.5 2.5" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="56" rx="16" ry="3" fill="#0a2010" opacity=".24"/><path d="M4 24 q-9 9 -3 20 q10 -2 16 -11Z" fill="#2f8748" stroke="#1f5e32" stroke-width="1.8" stroke-linejoin="round"/><path d="M56 24 q9 9 3 20 q-10 -2 -16 -11Z" fill="#2f8748" stroke="#1f5e32" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 28 q-2 6 2 13 M54 28 q2 6 -2 13" stroke="#1f5e32" stroke-width="1.3" fill="none" opacity=".5"/><path d="M18 13 l-3 -10 9 8Z" fill="#efdfb0" stroke="#bba35a" stroke-width="1"/><path d="M42 13 l3 -10 -9 8Z" fill="#efdfb0" stroke="#bba35a" stroke-width="1"/><circle cx="30" cy="34" r="19.5" fill="#3ca855"/><path d="M30 15 v-7 M21 17 q-3 -5 0 -9 M39 17 q3 -5 0 -9" stroke="#2e8c46" stroke-width="2.3" fill="none" stroke-linecap="round"/><path d="M16 18 q14 -7 28 0" fill="none" stroke="#2e8c46" stroke-width="1.6" opacity=".5"/><ellipse cx="30" cy="40" rx="11.5" ry="8.5" fill="#cdeed2"/><circle cx="22.5" cy="32" r="5.4" fill="#fff"/><circle cx="37.5" cy="32" r="5.4" fill="#fff"/><circle cx="23.1" cy="33" r="3" fill="#dba830"/><circle cx="36.9" cy="33" r="3" fill="#dba830"/><circle cx="23.1" cy="33" r="1.7" fill="#081a0c"/><circle cx="36.9" cy="33" r="1.7" fill="#081a0c"/><circle cx="21.7" cy="31.2" r="1.3" fill="#fff"/><circle cx="35.5" cy="31.2" r="1.3" fill="#fff"/><path d="M21 39 q9 5 18 0" fill="none" stroke="#185028" stroke-width="1.9" stroke-linecap="round"/><path d="M24 41 l1.6 3 M30 42 l0 3 M36 41 l-1.6 3" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="57" rx="16" ry="2.8" fill="#081a0c" opacity=".26"/><path d="M3 22 q-9 10 -2 21 q11 -2 17 -12Z" fill="#287a40" stroke="#185028" stroke-width="1.8" stroke-linejoin="round"/><path d="M57 22 q9 10 2 21 q-11 -2 -17 -12Z" fill="#287a40" stroke="#185028" stroke-width="1.8" stroke-linejoin="round"/><path d="M18 13 l-3 -10 9 8Z" fill="#efdfb0" stroke="#bba35a" stroke-width="1"/><path d="M42 13 l3 -10 -9 8Z" fill="#efdfb0" stroke="#bba35a" stroke-width="1"/><circle cx="30" cy="35" r="19.5" fill="#39a352"/><path d="M30 4 l3 5.5 6 .7 -4.5 4.3 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4.3 6 -.7Z" fill="#f9cf4d" stroke="#dca91e" stroke-width="1" stroke-linejoin="round"/><ellipse cx="30" cy="41" rx="11.5" ry="8.5" fill="#cdeed2"/><circle cx="22.5" cy="33" r="5.4" fill="#fff"/><circle cx="37.5" cy="33" r="5.4" fill="#fff"/><circle cx="23.1" cy="34" r="3" fill="#e2b830"/><circle cx="36.9" cy="34" r="3" fill="#e2b830"/><circle cx="23.1" cy="34" r="1.7" fill="#061407"/><circle cx="36.9" cy="34" r="1.7" fill="#061407"/><circle cx="21.7" cy="32.2" r="1.3" fill="#fff"/><circle cx="35.5" cy="32.2" r="1.3" fill="#fff"/><path d="M21 40 q9 5 18 0" fill="none" stroke="#124020" stroke-width="1.9" stroke-linecap="round"/><path d="M24 42 l1.6 3 M30 43 l0 3 M36 42 l-1.6 3" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>'
   ],
   lbl:['Draken-Ei','Draakje','Jonge Draak','Vleugeldraak','Vuurdraak','Gouden Draak','Oeroude Draak'],
   desc:['Een glad, warm ei. Er borrelt vuur binnenin.','Klein en schattig, maar spuugt al vonkjes.','Eerste vleugeltjes! Fladdert onhandig rond.','Vliegt nu echt, en spuugt vuur bij elke fout.','Beheerst het vuur. Examens smelten weg.','Verguld van schub tot vleugel. Bijna onaantastbaar.','De oeroude draak. Ouder en wijzer dan elk examen.'],
   evoMsg:['🐲 Je ei is uit! Een draakje spuugt vonkjes.','🐲 Eerste vleugeltjes! Je Draak fladdert rond.','🐉 Vleugeldraak vliegt nu echt - en spuwt vuur!','🐉 VUURDRAAK! Examens smelten onder je adem.','🏅 GOUDEN DRAAK! Je schubben glanzen als puur goud.','👑 OEROUDE DRAAK! De ultieme, gekroonde vorm.']},
  {id:'wolf', n:'Wolf', s:['','','','','',''], fallback:['🐺','🐺','🐺','🐺','🐺','🐺'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="51" rx="12" ry="3" fill="#3a4452" opacity=".16"/><path d="M19 26 l-3 -9 8 6Z" fill="#8794a3"/><path d="M41 26 l3 -9 -8 6Z" fill="#8794a3"/><path d="M19 24 l-1.5 -4 3 3Z" fill="#5a6675"/><path d="M41 24 l1.5 -4 -3 3Z" fill="#5a6675"/><circle cx="30" cy="34" r="15" fill="#97a3b2"/><path d="M30 38 q-7 0 -8 8 q8 4 16 0 q-1 -8 -8 -8Z" fill="#d2dae3"/><circle cx="24" cy="32" r="4.4" fill="#fff"/><circle cx="36" cy="32" r="4.4" fill="#fff"/><circle cx="24.4" cy="33" r="2.4" fill="#3a2410"/><circle cx="35.6" cy="33" r="2.4" fill="#3a2410"/><circle cx="23.4" cy="31.4" r="1" fill="#fff"/><circle cx="34.6" cy="31.4" r="1" fill="#fff"/><path d="M30 41 l-2.2 -2 h4.4Z" fill="#2a323c"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="52" rx="13" ry="3" fill="#3a4452" opacity=".16"/><path d="M18 25 l-4 -10 9 6Z" fill="#8290a0"/><path d="M42 25 l4 -10 -9 6Z" fill="#8290a0"/><path d="M18 23 l-2 -5 4 3Z" fill="#5a6675"/><path d="M42 23 l2 -5 -4 3Z" fill="#5a6675"/><circle cx="30" cy="34" r="16" fill="#8e9bab"/><path d="M30 37 q-8 0 -9 9 q9 4 18 0 q-1 -9 -9 -9Z" fill="#d2dae3"/><circle cx="24" cy="32" r="4.6" fill="#fff"/><circle cx="36" cy="32" r="4.6" fill="#fff"/><circle cx="24.4" cy="33" r="2.5" fill="#caa028"/><circle cx="35.6" cy="33" r="2.5" fill="#caa028"/><circle cx="24.4" cy="33" r="1.4" fill="#1a140a"/><circle cx="35.6" cy="33" r="1.4" fill="#1a140a"/><circle cx="23.3" cy="31.4" r="1.1" fill="#fff"/><circle cx="34.5" cy="31.4" r="1.1" fill="#fff"/><path d="M30 41 l-2.4 -2.2 h4.8Z" fill="#2a323c"/><path d="M30 43.2 v3" stroke="#2a323c" stroke-width="1.3" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="54" rx="14" ry="3" fill="#2a323c" opacity=".18"/><path d="M16 24 l-4 -11 10 6Z" fill="#7c8a9a"/><path d="M44 24 l4 -11 -10 6Z" fill="#7c8a9a"/><path d="M16 22 l-2 -6 5 4Z" fill="#566270"/><path d="M44 22 l2 -6 -5 4Z" fill="#566270"/><circle cx="30" cy="34" r="17" fill="#8795a5"/><path d="M30 36 q-9 0 -10 10 q10 5 20 0 q-1 -10 -10 -10Z" fill="#d6dee6"/><circle cx="23.5" cy="32" r="4.8" fill="#fff"/><circle cx="36.5" cy="32" r="4.8" fill="#fff"/><circle cx="24" cy="33" r="2.7" fill="#cca52a"/><circle cx="36" cy="33" r="2.7" fill="#cca52a"/><circle cx="24" cy="33" r="1.5" fill="#161008"/><circle cx="36" cy="33" r="1.5" fill="#161008"/><circle cx="22.8" cy="31.4" r="1.1" fill="#fff"/><circle cx="34.8" cy="31.4" r="1.1" fill="#fff"/><path d="M18 28 q4 -2 7 1 M42 28 q-4 -2 -7 1" stroke="#5a6675" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M30 41 l-2.6 -2.4 h5.2Z" fill="#222a34"/><path d="M30 43.4 v3.5" stroke="#222a34" stroke-width="1.4" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="55" rx="15" ry="3" fill="#222a34" opacity=".2"/><path d="M13 23 l-4 -12 11 6Z" fill="#76838f"/><path d="M47 23 l4 -12 -11 6Z" fill="#76838f"/><path d="M13 21 l-2 -7 6 4Z" fill="#4e5a68"/><path d="M47 21 l2 -7 -6 4Z" fill="#4e5a68"/><circle cx="30" cy="34" r="18.5" fill="#808 e9b"/><circle cx="30" cy="34" r="18.5" fill="#828f9f"/><path d="M30 35 q-10 0 -11 11 q11 5 22 0 q-1 -11 -11 -11Z" fill="#dae1e8"/><path d="M30 16 q-4 4 -3 9 M30 16 q4 4 3 9" stroke="#6a7686" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="23" cy="31" r="5" fill="#fff"/><circle cx="37" cy="31" r="5" fill="#fff"/><circle cx="23.6" cy="32" r="2.9" fill="#d4ab2c"/><circle cx="36.4" cy="32" r="2.9" fill="#d4ab2c"/><circle cx="23.6" cy="32" r="1.6" fill="#120c06"/><circle cx="36.4" cy="32" r="1.6" fill="#120c06"/><circle cx="22.3" cy="30.3" r="1.2" fill="#fff"/><circle cx="35.1" cy="30.3" r="1.2" fill="#fff"/><path d="M17 27 q5 -2 8 1 M43 27 q-5 -2 -8 1" stroke="#566270" stroke-width="1.7" fill="none" stroke-linecap="round"/><path d="M30 41 l-2.8 -2.5 h5.6Z" fill="#1e252e"/><path d="M30 43.5 v4" stroke="#1e252e" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="56" rx="16" ry="3" fill="#161c24" opacity=".22"/><path d="M11 22 l-4 -13 12 6Z" fill="#6e7b88"/><path d="M49 22 l4 -13 -12 6Z" fill="#6e7b88"/><path d="M11 20 l-2 -8 7 5Z" fill="#46525f"/><path d="M49 20 l2 -8 -7 5Z" fill="#46525f"/><circle cx="30" cy="34" r="19.5" fill="#7d8a9a"/><path d="M30 35 q-11 0 -12 12 q12 5 24 0 q-1 -12 -12 -12Z" fill="#dde4ea"/><path d="M30 15 q-5 4 -4 10 M30 15 q5 4 4 10" stroke="#616d7c" stroke-width="1.7" fill="none" stroke-linecap="round"/><circle cx="22.5" cy="31" r="5.2" fill="#fff"/><circle cx="37.5" cy="31" r="5.2" fill="#fff"/><circle cx="23.1" cy="32" r="3" fill="#dcb22e"/><circle cx="36.9" cy="32" r="3" fill="#dcb22e"/><circle cx="23.1" cy="32" r="1.7" fill="#0e0a04"/><circle cx="36.9" cy="32" r="1.7" fill="#0e0a04"/><circle cx="21.7" cy="30.2" r="1.3" fill="#fff"/><circle cx="35.5" cy="30.2" r="1.3" fill="#fff"/><path d="M16 26 q5 -2 9 1 M44 26 q-5 -2 -9 1" stroke="#4e5a68" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M30 41 l-3 -2.6 h6Z" fill="#181f27"/><path d="M30 43.6 v4.4" stroke="#181f27" stroke-width="1.6" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="57" rx="16" ry="2.8" fill="#161c24" opacity=".24"/><path d="M11 23 l-4 -13 12 6Z" fill="#646f7c"/><path d="M49 23 l4 -13 -12 6Z" fill="#646f7c"/><path d="M11 21 l-2 -8 7 5Z" fill="#3e4954"/><path d="M49 21 l2 -8 -7 5Z" fill="#3e4954"/><circle cx="30" cy="35" r="19.5" fill="#76838f"/><path d="M30 4 l3 5.5 6 .7 -4.5 4.3 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4.3 6 -.7Z" fill="#f9cf4d" stroke="#dca91e" stroke-width="1" stroke-linejoin="round"/><path d="M30 36 q-11 0 -12 12 q12 5 24 0 q-1 -12 -12 -12Z" fill="#e0e7ec"/><path d="M30 17 q-5 4 -4 10 M30 17 q5 4 4 10" stroke="#5a6675" stroke-width="1.7" fill="none" stroke-linecap="round"/><circle cx="22.5" cy="32" r="5.2" fill="#fff"/><circle cx="37.5" cy="32" r="5.2" fill="#fff"/><circle cx="23.1" cy="33" r="3" fill="#e2b830"/><circle cx="36.9" cy="33" r="3" fill="#e2b830"/><circle cx="23.1" cy="33" r="1.7" fill="#0e0a04"/><circle cx="36.9" cy="33" r="1.7" fill="#0e0a04"/><circle cx="21.7" cy="31.2" r="1.3" fill="#fff"/><circle cx="35.5" cy="31.2" r="1.3" fill="#fff"/><path d="M16 27 q5 -2 9 1 M44 27 q-5 -2 -9 1" stroke="#46525f" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M30 42 l-3 -2.6 h6Z" fill="#141a22"/><path d="M30 44.6 v4.4" stroke="#141a22" stroke-width="1.6" stroke-linecap="round"/></svg>'
   ],
   lbl:['Wolfje','Speels Pupje','Jonge Wolf','Eenzame Wolf','Roedelleider','Gouden Wolf','Alfawolf'],
   desc:['Klein, donzig en altijd op jacht naar kennis.','Speelt en jankt, maar leert razendsnel.','Eerste echte jachtinstinct - ruikt het juiste antwoord.','Sluipt geruisloos door de moeilijkste stof.','De roedel volgt hem. Twijfel kent hij niet.','Verguld van vacht tot snuit. Bijna onaantastbaar.','De alfawolf. Bij volle maan kraakt hij elk examen.'],
   evoMsg:['🐺 Je wolfje jankt en leert razendsnel!','🐺 Eerste jachtinstinct - je ruikt het juiste antwoord.','🐺 Eenzame Wolf ontwaakt - geruisloos en scherp.','🐺 ROEDELLEIDER! De roedel volgt jou nu.','🏅 GOUDEN WOLF! Je vacht glanst als puur goud.','👑 ALFAWOLF! De ultieme, gekroonde vorm.']},
  {id:'vlinder', n:'Vlinder', s:['','','','','',''], fallback:['🥚','🐛','🐛','🦋','🦋','🦋'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="50" rx="11" ry="3" fill="#3a5a2a" opacity=".16"/><path d="M10 44 q10 6 40 -2" fill="none" stroke="#5aa83c" stroke-width="3" stroke-linecap="round"/><ellipse cx="30" cy="34" rx="8" ry="11" fill="#eef6e0" stroke="#9cc46a" stroke-width="2.2"/><circle cx="27" cy="30" r="1.4" fill="#b7d488"/><circle cx="33" cy="36" r="1.6" fill="#b7d488"/><ellipse cx="27" cy="29" rx="3" ry="1.6" fill="#fff" opacity=".5"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="52" rx="13" ry="3" fill="#3a5a2a" opacity=".18"/><g fill="#6cbf3e"><circle cx="14" cy="38" r="6"/><circle cx="22" cy="36" r="6.6"/><circle cx="31" cy="35" r="7"/><circle cx="40" cy="36" r="6.6"/></g><circle cx="46" cy="34" r="7.6" fill="#7ccd48"/><path d="M44 27 q-1 -5 2 -7 M49 27 q2 -5 5 -5" stroke="#4a9a2a" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="48" cy="32" r="2.4" fill="#fff"/><circle cx="48.4" cy="32.4" r="1.4" fill="#1f3d12"/><circle cx="47.6" cy="31.4" r=".6" fill="#fff"/><path d="M44 36 q3 2 5 0" fill="none" stroke="#3a7a1e" stroke-width="1.3" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="53" rx="11" ry="3" fill="#2a3a5a" opacity=".18"/><path d="M30 8 q-3 0 -3 4" stroke="#8a7a5a" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M30 12 C39 12 41 24 41 32 C41 42 36 50 30 50 C24 50 19 42 19 32 C19 24 21 12 30 12Z" fill="#7ab0d8" stroke="#4a82ab" stroke-width="2.2"/><path d="M23 22 q7 3 14 0 M22 30 q8 3 16 0 M23 38 q7 3 14 0" fill="none" stroke="#5a96c2" stroke-width="1.6" opacity=".7"/><ellipse cx="25" cy="20" rx="4" ry="2.4" fill="#fff" opacity=".4"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="53" rx="13" ry="3" fill="#3a2a5a" opacity=".18"/><path d="M28 26 q-16 -12 -22 -2 q-4 8 6 12 q10 3 16 -4Z" fill="#9c6cf0" stroke="#7a4ad0" stroke-width="1.8" stroke-linejoin="round"/><path d="M32 26 q16 -12 22 -2 q4 8 -6 12 q-10 3 -16 -4Z" fill="#9c6cf0" stroke="#7a4ad0" stroke-width="1.8" stroke-linejoin="round"/><circle cx="14" cy="24" r="3" fill="#f5b301"/><circle cx="46" cy="24" r="3" fill="#f5b301"/><ellipse cx="30" cy="32" rx="3.4" ry="11" fill="#3a2a4a"/><path d="M27 16 q-2 -4 -4 -5 M33 16 q2 -4 4 -5" stroke="#3a2a4a" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="27.5" cy="22" r="1.4" fill="#fff"/><circle cx="32.5" cy="22" r="1.4" fill="#fff"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="55" rx="15" ry="3" fill="#3a2a5a" opacity=".2"/><path d="M28 26 q-19 -15 -25 -2 q-5 10 7 14 q11 3 18 -5Z" fill="#a76cf2" stroke="#7a4ad0" stroke-width="1.9" stroke-linejoin="round"/><path d="M32 26 q19 -15 25 -2 q5 10 -7 14 q-11 3 -18 -5Z" fill="#a76cf2" stroke="#7a4ad0" stroke-width="1.9" stroke-linejoin="round"/><path d="M28 34 q-15 13 -19 2 q-3 -8 7 -10 q8 -1 12 5Z" fill="#f08ac0" stroke="#d05a9a" stroke-width="1.7" stroke-linejoin="round"/><path d="M32 34 q15 13 19 2 q3 -8 -7 -10 q-8 -1 -12 5Z" fill="#f08ac0" stroke="#d05a9a" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="22" r="3.4" fill="#f5b301"/><circle cx="48" cy="22" r="3.4" fill="#f5b301"/><circle cx="14" cy="40" r="2.6" fill="#fcd34d"/><circle cx="46" cy="40" r="2.6" fill="#fcd34d"/><ellipse cx="30" cy="33" rx="3.6" ry="12" fill="#3a2a4a"/><path d="M27 14 q-2 -4 -5 -5 M33 14 q2 -4 5 -5" stroke="#3a2a4a" stroke-width="1.7" fill="none" stroke-linecap="round"/><circle cx="27.3" cy="21" r="1.5" fill="#fff"/><circle cx="32.7" cy="21" r="1.5" fill="#fff"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="56" rx="16" ry="2.8" fill="#2a1a4a" opacity=".22"/><path d="M28 25 q-20 -16 -26 -2 q-5 11 8 15 q11 3 18 -6Z" fill="#9d5cf0" stroke="#6a3ac0" stroke-width="1.9" stroke-linejoin="round"/><path d="M32 25 q20 -16 26 -2 q5 11 -8 15 q-11 3 -18 -6Z" fill="#9d5cf0" stroke="#6a3ac0" stroke-width="1.9" stroke-linejoin="round"/><path d="M28 34 q-16 14 -20 2 q-3 -9 8 -11 q8 -1 12 5Z" fill="#ef7fbb" stroke="#c84a90" stroke-width="1.7" stroke-linejoin="round"/><path d="M32 34 q16 14 20 2 q3 -9 -8 -11 q-8 -1 -12 5Z" fill="#ef7fbb" stroke="#c84a90" stroke-width="1.7" stroke-linejoin="round"/><circle cx="13" cy="20" r="3.2" fill="#fde68a"/><circle cx="47" cy="20" r="3.2" fill="#fde68a"/><circle cx="11" cy="28" r="2.4" fill="#7cc4f0"/><circle cx="49" cy="28" r="2.4" fill="#7cc4f0"/><path d="M30 4 l2.6 5 5.4 .6 -4 3.8 1 5.4 -5 -2.7 -5 2.7 1 -5.4 -4 -3.8 5.4 -.6Z" fill="#f9cf4d" stroke="#dca91e" stroke-width=".9" stroke-linejoin="round"/><ellipse cx="30" cy="34" rx="3.7" ry="12.5" fill="#352542"/><path d="M27 15 q-2 -4 -5 -5 M33 15 q2 -4 5 -5" stroke="#352542" stroke-width="1.7" fill="none" stroke-linecap="round"/><circle cx="27.2" cy="22" r="1.6" fill="#fff"/><circle cx="32.8" cy="22" r="1.6" fill="#fff"/></svg>'
   ],
   lbl:['Vlinder-Ei','Rupsje','Pop','Jonge Vlinder','Pronkvlinder','Gouden Vlinder','Hemelvlinder'],
   desc:['Een minuscuul eitje op een blad. Geduld...','Een gulzig rupsje dat alle stof opeet.','In de pop. Er gebeurt iets moois van binnen.','De pop barst open - eerste fladdervlucht!','Schitterende vleugels die alle ogen trekken.','Verguld van vleugel tot voelspriet. Bijna onaantastbaar.','De hemelvlinder. Fladdert sierlijk over elk examen.'],
   evoMsg:['🐛 Uit het ei! Een gulzig rupsje eet alle stof op.','🛡 Verpopt! Er gebeurt iets moois van binnen.','🦋 De pop barst open - je eerste fladdervlucht!','🦋 PRONKVLINDER! Schitterende vleugels trekken alle ogen.','🏅 GOUDEN VLINDER! Je vleugels glanzen als puur goud.','👑 HEMELVLINDER! De ultieme, gekroonde vorm.']},
  {id:'tijger', n:'Tijger', s:['','','','','',''], fallback:['🐱','🐅','🐅','🐅','🐅','🐅'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="51" rx="12" ry="3" fill="#7c3a0e" opacity=".15"/><path d="M17 27 l-3 -8 7 4Z" fill="#f0892e"/><path d="M43 27 l3 -8 -7 4Z" fill="#f0892e"/><circle cx="30" cy="34" r="15" fill="#f29a3e"/><ellipse cx="30" cy="40" rx="9" ry="6.5" fill="#fdf3e6"/><path d="M30 21 v6 M22 24 l2 5 M38 24 l-2 5" stroke="#2a1a0e" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="33" r="4.6" fill="#fff"/><circle cx="36" cy="33" r="4.6" fill="#fff"/><circle cx="24.4" cy="34" r="2.5" fill="#2a1a0e"/><circle cx="35.6" cy="34" r="2.5" fill="#2a1a0e"/><circle cx="23.3" cy="32.4" r="1" fill="#fff"/><circle cx="34.5" cy="32.4" r="1" fill="#fff"/><path d="M30 38 l-2.4 -2 h4.8Z" fill="#7c3a0e"/><path d="M30 40 q-2.5 2 -4.5 1 M30 40 q2.5 2 4.5 1" fill="none" stroke="#c2701c" stroke-width="1.3" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="52" rx="13" ry="3" fill="#7c3a0e" opacity=".16"/><path d="M16 26 l-3 -9 8 4Z" fill="#ef861f"/><path d="M44 26 l3 -9 -8 4Z" fill="#ef861f"/><path d="M16 26 l-2 -5 4 2Z" fill="#fdf3e6"/><path d="M44 26 l2 -5 -4 2Z" fill="#fdf3e6"/><circle cx="30" cy="34" r="16" fill="#f0892e"/><ellipse cx="30" cy="40" rx="9.5" ry="7" fill="#fdf3e6"/><path d="M30 20 v6 M21 24 l2 6 M39 24 l-2 6 M14 33 l5 1 M46 33 l-5 1" stroke="#2a1a0e" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="33" r="4.7" fill="#fff"/><circle cx="36" cy="33" r="4.7" fill="#fff"/><circle cx="24.4" cy="34" r="2.6" fill="#2a1a0e"/><circle cx="35.6" cy="34" r="2.6" fill="#2a1a0e"/><circle cx="23.3" cy="32.4" r="1.1" fill="#fff"/><circle cx="34.5" cy="32.4" r="1.1" fill="#fff"/><path d="M30 38.5 l-2.5 -2 h5Z" fill="#7c3a0e"/><path d="M30 40.5 q-2.7 2.2 -4.8 1 M30 40.5 q2.7 2.2 4.8 1" fill="none" stroke="#c2701c" stroke-width="1.4" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="54" rx="14" ry="3" fill="#5e2c0a" opacity=".18"/><path d="M14 26 l-3 -10 9 5Z" fill="#ee831b"/><path d="M46 26 l3 -10 -9 5Z" fill="#ee831b"/><path d="M14 26 l-2 -6 5 3Z" fill="#fdf3e6"/><path d="M46 26 l2 -6 -5 3Z" fill="#fdf3e6"/><circle cx="30" cy="34" r="17" fill="#f0892e"/><ellipse cx="30" cy="40" rx="10" ry="7.5" fill="#fdf3e6"/><path d="M30 19 v7 M20 23 l2.5 7 M40 23 l-2.5 7 M13 31 l6 1.5 M47 31 l-6 1.5 M13 37 l6 -.5 M47 37 l-6 -.5" stroke="#241408" stroke-width="2.1" stroke-linecap="round"/><circle cx="23.5" cy="33" r="4.9" fill="#fff"/><circle cx="36.5" cy="33" r="4.9" fill="#fff"/><circle cx="24" cy="34" r="2.7" fill="#2a1a0e"/><circle cx="36" cy="34" r="2.7" fill="#2a1a0e"/><circle cx="22.8" cy="32.3" r="1.1" fill="#fff"/><circle cx="34.8" cy="32.3" r="1.1" fill="#fff"/><path d="M30 38.5 l-2.6 -2.2 h5.2Z" fill="#7c3a0e"/><path d="M30 41 q-3 2.4 -5 1 M30 41 q3 2.4 5 1" fill="none" stroke="#b0651a" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="55" rx="15" ry="3" fill="#4a2208" opacity=".2"/><path d="M12 25 l-3 -11 10 5Z" fill="#ec7f17"/><path d="M48 25 l3 -11 -10 5Z" fill="#ec7f17"/><path d="M12 25 l-2 -7 6 3Z" fill="#fdf3e6"/><path d="M48 25 l2 -7 -6 3Z" fill="#fdf3e6"/><circle cx="30" cy="34" r="18.5" fill="#f0892e"/><ellipse cx="30" cy="40" rx="11" ry="8" fill="#fdf3e6"/><path d="M30 17 v8 M19 21 l3 8 M41 21 l-3 8 M11 30 l7 1.5 M49 30 l-7 1.5 M11 36 l7 0 M49 36 l-7 0 M11 41 l6 -1.5 M49 41 l-6 -1.5" stroke="#201207" stroke-width="2.2" stroke-linecap="round"/><circle cx="23" cy="32" r="5.1" fill="#fff"/><circle cx="37" cy="32" r="5.1" fill="#fff"/><circle cx="23.6" cy="33" r="2.9" fill="#caa028"/><circle cx="36.4" cy="33" r="2.9" fill="#caa028"/><circle cx="23.6" cy="33" r="1.6" fill="#160c00"/><circle cx="36.4" cy="33" r="1.6" fill="#160c00"/><circle cx="22.3" cy="31.3" r="1.2" fill="#fff"/><circle cx="35.1" cy="31.3" r="1.2" fill="#fff"/><path d="M30 38 l-2.8 -2.4 h5.6Z" fill="#6b3210"/><path d="M30 40.6 q-3.3 2.6 -5.5 1 M30 40.6 q3.3 2.6 5.5 1" fill="none" stroke="#a85c18" stroke-width="1.6" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="56" rx="16" ry="3" fill="#3a1a06" opacity=".22"/><path d="M11 24 l-3 -12 11 5Z" fill="#ea7b13"/><path d="M49 24 l3 -12 -11 5Z" fill="#ea7b13"/><path d="M11 24 l-2 -8 7 4Z" fill="#fdf3e6"/><path d="M49 24 l2 -8 -7 4Z" fill="#fdf3e6"/><circle cx="30" cy="34" r="19.5" fill="#f0892e"/><ellipse cx="30" cy="40" rx="11.5" ry="8.5" fill="#fdf3e6"/><path d="M30 16 v9 M18 20 l3.5 9 M42 20 l-3.5 9 M10 29 l8 1.5 M50 29 l-8 1.5 M10 35 l8 0 M50 35 l-8 0 M10 41 l7 -1.5 M50 41 l-7 -1.5" stroke="#1c1006" stroke-width="2.3" stroke-linecap="round"/><circle cx="23" cy="32" r="5.3" fill="#fff"/><circle cx="37" cy="32" r="5.3" fill="#fff"/><circle cx="23.6" cy="33" r="3" fill="#cfa42a"/><circle cx="36.4" cy="33" r="3" fill="#cfa42a"/><circle cx="23.6" cy="33" r="1.7" fill="#120a00"/><circle cx="36.4" cy="33" r="1.7" fill="#120a00"/><circle cx="22.2" cy="31.2" r="1.3" fill="#fff"/><circle cx="35" cy="31.2" r="1.3" fill="#fff"/><path d="M30 38 l-3 -2.5 h6Z" fill="#5e2c0c"/><path d="M30 40.6 q-3.5 2.8 -6 1 M30 40.6 q3.5 2.8 6 1" fill="none" stroke="#9c5414" stroke-width="1.7" stroke-linecap="round"/><path d="M19 38 l-9 -2 M19 41 l-9 1 M41 38 l9 -2 M41 41 l9 1" stroke="#3a2a1a" stroke-width="1.1" stroke-linecap="round" opacity=".6"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="57" rx="16" ry="2.8" fill="#3a1a06" opacity=".24"/><path d="M11 25 l-3 -12 11 5Z" fill="#dd7310"/><path d="M49 25 l3 -12 -11 5Z" fill="#dd7310"/><path d="M11 25 l-2 -8 7 4Z" fill="#fdf3e6"/><path d="M49 25 l2 -8 -7 4Z" fill="#fdf3e6"/><circle cx="30" cy="35" r="19.5" fill="#f0892e"/><path d="M30 4 l3 5.5 6 .7 -4.5 4.3 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4.3 6 -.7Z" fill="#f9cf4d" stroke="#dca91e" stroke-width="1" stroke-linejoin="round"/><ellipse cx="30" cy="41" rx="11.5" ry="8.5" fill="#fdf3e6"/><path d="M30 18 v8 M18 22 l3.5 8 M42 22 l-3.5 8 M10 30 l8 1.5 M50 30 l-8 1.5 M10 36 l8 0 M50 36 l-8 0 M10 42 l7 -1.5 M50 42 l-7 -1.5" stroke="#1c1006" stroke-width="2.3" stroke-linecap="round"/><circle cx="23" cy="33" r="5.3" fill="#fff"/><circle cx="37" cy="33" r="5.3" fill="#fff"/><circle cx="23.6" cy="34" r="3" fill="#cfa42a"/><circle cx="36.4" cy="34" r="3" fill="#cfa42a"/><circle cx="23.6" cy="34" r="1.7" fill="#120a00"/><circle cx="36.4" cy="34" r="1.7" fill="#120a00"/><circle cx="22.2" cy="32.2" r="1.3" fill="#fff"/><circle cx="35" cy="32.2" r="1.3" fill="#fff"/><path d="M30 39 l-3 -2.5 h6Z" fill="#5e2c0c"/><path d="M30 41.6 q-3.5 2.8 -6 1 M30 41.6 q3.5 2.8 6 1" fill="none" stroke="#9c5414" stroke-width="1.7" stroke-linecap="round"/></svg>'
   ],
   lbl:['Tijgertje','Speels Welpje','Jonge Streep','Streeptijger','Koningstijger','Gouden Tijger','Heer van de Jungle'],
   desc:['Klein, gestreept en vol energie.','Springt op elke vraag af. Schattig roofdiertje.','Strepen worden scherper, net als zijn focus.','Sluipt geruisloos naar hoge cijfers.','Niemand ontsnapt aan zijn blik. Ook fouten niet.','Verguld met gouden strepen. Bijna onaantastbaar.','De heer van de jungle. Het examen verstijft.'],
   evoMsg:['🐅 Je tijgertje sluipt al rond de vragen!','🐅 Strepen worden scherper, net als je focus.','🐅 Streeptijger ontwaakt - geruisloos en snel.','🐅 KONINGSTIJGER! Niemand ontsnapt aan je blik.','🏅 GOUDEN TIJGER! Je strepen glanzen als puur goud.','👑 HEER VAN DE JUNGLE! De ultieme, gekroonde vorm.']},
  {id:'haai', n:'Haai', s:['','','','','',''], fallback:['🐟','🐠','🦈','🦈','🦈','🦈'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="50" rx="12" ry="2.8" fill="#1e3a52" opacity=".18"/><path d="M30 17 l5 8 -10 0Z" fill="#5b86a8"/><ellipse cx="30" cy="37" rx="14" ry="12" fill="#6a93b3"/><ellipse cx="30" cy="42" rx="10" ry="6.5" fill="#e9f1f7"/><circle cx="24.5" cy="35" r="4.6" fill="#fff"/><circle cx="35.5" cy="35" r="4.6" fill="#fff"/><circle cx="25" cy="36" r="2.5" fill="#16384f"/><circle cx="35" cy="36" r="2.5" fill="#16384f"/><circle cx="23.8" cy="34.4" r="1" fill="#fff"/><circle cx="33.8" cy="34.4" r="1" fill="#fff"/><path d="M25 42 q5 3 10 0" fill="none" stroke="#2e567a" stroke-width="1.8" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="52" rx="13" ry="3" fill="#1e3a52" opacity=".2"/><path d="M12 36 l-8 4 7 4Z" fill="#4f7a9e"/><path d="M48 36 l8 4 -7 4Z" fill="#4f7a9e"/><path d="M30 14 l6 9 -12 0Z" fill="#4f7a9e"/><ellipse cx="30" cy="37" rx="15" ry="13" fill="#5d89ab"/><ellipse cx="30" cy="43" rx="11" ry="7" fill="#e9f1f7"/><circle cx="24" cy="35" r="4.8" fill="#fff"/><circle cx="36" cy="35" r="4.8" fill="#fff"/><circle cx="24.5" cy="36" r="2.6" fill="#16384f"/><circle cx="35.5" cy="36" r="2.6" fill="#16384f"/><circle cx="23.3" cy="34.4" r="1.1" fill="#fff"/><circle cx="34.3" cy="34.4" r="1.1" fill="#fff"/><path d="M24 42 q6 4 12 0 l-2 3 -2-2 -2 2 -2-2 -2 2Z" fill="#fff" stroke="#2e567a" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="53" rx="14" ry="3" fill="#13283a" opacity=".22"/><path d="M10 35 l-8 5 8 4Z" fill="#456f91"/><path d="M50 35 l8 5 -8 4Z" fill="#456f91"/><path d="M30 12 l7 11 -14 0Z" fill="#456f91"/><ellipse cx="30" cy="37" rx="16" ry="14" fill="#52809f"/><ellipse cx="30" cy="44" rx="12" ry="7.5" fill="#eaf2f8"/><path d="M40 30 l2 0 M40 34 l2 0 M40 38 l2 0" stroke="#3a6385" stroke-width="1.4" stroke-linecap="round"/><circle cx="24" cy="34" r="5" fill="#fff"/><circle cx="36" cy="34" r="5" fill="#fff"/><circle cx="24.6" cy="35" r="2.7" fill="#0d2435"/><circle cx="35.4" cy="35" r="2.7" fill="#0d2435"/><circle cx="23.3" cy="33.4" r="1.1" fill="#fff"/><circle cx="34.1" cy="33.4" r="1.1" fill="#fff"/><path d="M23 42 q7 5 14 0 l-2.3 3.5 -2-2.2 -2.4 2.2 -2.4-2.2 -2 2.2Z" fill="#fff" stroke="#2e567a" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="54" rx="15" ry="3" fill="#0d1f2e" opacity=".25"/><path d="M8 33 l-7 6 8 4Z" fill="#3c6486"/><path d="M52 33 l7 6 -8 4Z" fill="#3c6486"/><path d="M30 10 l8 12 -16 0Z" fill="#3c6486"/><ellipse cx="30" cy="37" rx="17" ry="15" fill="#477394"/><ellipse cx="30" cy="45" rx="13" ry="8" fill="#eaf2f8"/><path d="M41 28 l2.5 0 M41 32 l2.5 0 M41 36 l2.5 0" stroke="#345a7a" stroke-width="1.5" stroke-linecap="round"/><circle cx="23.5" cy="33" r="5.2" fill="#fff"/><circle cx="36.5" cy="33" r="5.2" fill="#fff"/><circle cx="24.2" cy="34" r="2.8" fill="#08151f"/><circle cx="35.8" cy="34" r="2.8" fill="#08151f"/><circle cx="22.8" cy="32.4" r="1.2" fill="#fff"/><circle cx="34.4" cy="32.4" r="1.2" fill="#fff"/><path d="M18 28 q5 -2 9 1 M42 28 q-5 -2 -9 1" stroke="#2e567a" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M21 42 q9 6 18 0 l-2.8 4 -2.3-2.6 -2.9 2.6 -2.9-2.6 -2.3 2.6Z" fill="#fff" stroke="#2e567a" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="55" rx="16" ry="3" fill="#0a1722" opacity=".28"/><path d="M6 31 l-6 8 9 3Z" fill="#34597a"/><path d="M54 31 l6 8 -9 3Z" fill="#34597a"/><path d="M30 8 l9 13 -18 0Z" fill="#34597a"/><ellipse cx="30" cy="37" rx="18" ry="16" fill="#3f6a8c"/><ellipse cx="30" cy="46" rx="14" ry="8.5" fill="#f0f5fa"/><path d="M42 26 l3 0 M42 30 l3 0 M42 34 l3 0 M42 38 l3 0" stroke="#2c5070" stroke-width="1.6" stroke-linecap="round"/><circle cx="23" cy="32" r="5.4" fill="#fff"/><circle cx="37" cy="32" r="5.4" fill="#fff"/><circle cx="23.8" cy="33" r="2.9" fill="#06121b"/><circle cx="36.2" cy="33" r="2.9" fill="#06121b"/><circle cx="22.3" cy="31.3" r="1.3" fill="#fff"/><circle cx="34.7" cy="31.3" r="1.3" fill="#fff"/><path d="M17 27 q6 -2 10 1 M43 27 q-6 -2 -10 1" stroke="#23415c" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M19 41 q11 7 22 0 l-3.2 4.6 -2.6-3 -3.4 3 -3.4-3 -2.6 3Z" fill="#fff" stroke="#23415c" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="56" rx="16" ry="2.8" fill="#081521" opacity=".3"/><path d="M4 29 l-7 9 10 3Z" fill="#2b4d6b"/><path d="M56 29 l7 9 -10 3Z" fill="#2b4d6b"/><path d="M30 5 l10 15 -20 0Z" fill="#2b4d6b"/><path d="M30 7 l3 5 -6 0Z" fill="#5f87a8"/><ellipse cx="30" cy="38" rx="19" ry="16.5" fill="#37607f"/><ellipse cx="30" cy="47" rx="15" ry="9" fill="#f2f7fb"/><path d="M43 25 l3.4 0 M43 29 l3.4 0 M43 33 l3.4 0 M43 37 l3.4 0 M43 41 l3.4 0" stroke="#24465f" stroke-width="1.6" stroke-linecap="round"/><path d="M13 32 l5 -3 M11 38 l6 -2" stroke="#7da9c6" stroke-width="1.4" stroke-linecap="round" opacity=".7"/><circle cx="22.5" cy="31" r="5.6" fill="#fff"/><circle cx="37.5" cy="31" r="5.6" fill="#fff"/><circle cx="23.3" cy="32" r="3" fill="#05101a"/><circle cx="36.7" cy="32" r="3" fill="#05101a"/><circle cx="21.8" cy="30.2" r="1.4" fill="#fff"/><circle cx="35.2" cy="30.2" r="1.4" fill="#fff"/><path d="M16 26 q6 -2 11 1 M44 26 q-6 -2 -11 1" stroke="#1c3850" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M17 40 q13 8 26 0 l-3.7 5.4 -3-3.4 -3.9 3.4 -3.9-3.4 -3 3.4Z" fill="#fff" stroke="#1c3850" stroke-width="1.5" stroke-linejoin="round"/></svg>'
   ],
   lbl:['Mini-Haai','Nieuwsgierig Visje','Jonge Jager','Roofvis','Witte Haai','Gouden Haai','Oerhaai'],
   desc:['Zo groot als een vinger, maar bijt al van zich af.','Zwemt nieuwsgierig rond elke vraag.','Eerste tandjes, eerste overwinningen.','Ruikt een goede score van mijlenver.','Niets ontsnapt aan zijn kaken. Ook fouten niet.','Schubben van puur goud. Bijna onaantastbaar.','De oerhaai uit de diepte. Examens trillen in het water.'],
   evoMsg:['🐟 Je visje is geboren en hapt al naar kennis!','🐠 Eerste tandjes! Je Haai jaagt op vragen.','🦈 Roofvis ontwaakt - scherpe blik, scherpe tanden.','🦈 WITTE HAAI! De examinator durft het water niet meer in.','🏅 GOUDEN HAAI! Je schubben glanzen als puur goud.','👑 OERHAAI ONTGRENDELD! De ultieme vorm uit de diepte.']},
  {id:'olifant', n:'Olifant', s:['','','','',''], fallback:['🐾','🦔','🦛','🐘','🦣'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="36" r="16" fill="#94a3b8" stroke="#475569" stroke-width="3"/><ellipse cx="21" cy="24" rx="8" ry="13" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><ellipse cx="39" cy="24" rx="8" ry="13" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><path d="M26 44 Q24 52 22 56" stroke="#cbd5e1" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="23" cy="32" r="5.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="37" cy="32" r="5.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="23" cy="32" r="3.5" fill="#1a0a00"/><circle cx="37" cy="32" r="3.5" fill="#1a0a00"/><circle cx="22.5" cy="31" r="1.2" fill="white"/><circle cx="36.5" cy="31" r="1.2" fill="white"/><ellipse cx="25" cy="28" rx="8" ry="4" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="17" cy="22" rx="9" ry="14" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><ellipse cx="43" cy="22" rx="9" ry="14" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><circle cx="30" cy="35" r="19" fill="#94a3b8" stroke="#475569" stroke-width="3"/><path d="M23 46 Q21 54 20 58" stroke="#cbd5e1" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="23" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="37" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="23" cy="30" r="3.5" fill="#1a0a00"/><circle cx="37" cy="30" r="3.5" fill="#1a0a00"/><circle cx="22.5" cy="29" r="1.2" fill="white"/><circle cx="36.5" cy="29" r="1.2" fill="white"/><ellipse cx="24" cy="25" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="13" cy="22" rx="10" ry="15" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><ellipse cx="47" cy="22" rx="10" ry="15" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><circle cx="30" cy="35" r="21" fill="#94a3b8" stroke="#475569" stroke-width="3"/><path d="M21 46 Q19 54 18 58" stroke="#cbd5e1" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M21 44 Q14 48 8 44" stroke="#e2e8f0" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="22" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="29" r="4" fill="#1a0a00"/><circle cx="38" cy="29" r="4" fill="#1a0a00"/><circle cx="21.5" cy="28" r="1.5" fill="white"/><circle cx="37.5" cy="28" r="1.5" fill="white"/><ellipse cx="23" cy="24" rx="9" ry="4.5" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="22" rx="10" ry="16" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><ellipse cx="50" cy="22" rx="10" ry="16" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><circle cx="30" cy="34" r="23" fill="#94a3b8" stroke="#475569" stroke-width="3"/><path d="M20 48 Q18 56 16 60" stroke="#cbd5e1" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M20 45 Q12 50 6 46" stroke="#e2e8f0" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M40 45 Q48 50 54 46" stroke="#e2e8f0" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="21" cy="27" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="27" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="27" r="4.5" fill="#1a0a00"/><circle cx="39" cy="27" r="4.5" fill="#1a0a00"/><circle cx="20.5" cy="26" r="1.8" fill="white"/><circle cx="38.5" cy="26" r="1.8" fill="white"/><ellipse cx="22" cy="22" rx="10" ry="5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M12 8 L16 2 L20 8 L24 3 L30 8 L36 3 L40 8 L44 2 L48 8Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><ellipse cx="8" cy="22" rx="10" ry="17" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/><ellipse cx="52" cy="22" rx="10" ry="17" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/><circle cx="30" cy="33" r="24" fill="#e2e8f0" stroke="#94a3b8" stroke-width="3"/><path d="M18 48 Q16 56 14 60" stroke="#f8fafc" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M18 44 Q10 50 4 46" stroke="#f8fafc" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M42 44 Q50 50 56 46" stroke="#f8fafc" stroke-width="4.5" fill="none" stroke-linecap="round"/><circle cx="20" cy="26" r="8" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="40" cy="26" r="8" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="20" cy="26" r="5" fill="#1a0a00"/><circle cx="40" cy="26" r="5" fill="#1a0a00"/><circle cx="19.5" cy="25" r="2" fill="white"/><circle cx="39.5" cy="25" r="2" fill="white"/><ellipse cx="22" cy="21" rx="11" ry="5" fill="white" opacity="0.18"/></svg>'
   ],
   lbl:['Prikkelend Egeltje','Dikhuidige Leerling','Kolossale Olifant','Prehistorische Mammoet','Tijdloze Mammoet'],
   desc:['Prikkt bij moeilijke vragen. Zacht maar aanwezig.','Dik genoeg om alles te onthouden. Vergeet nooit.','Geheugen van een olifant. Herinnert elk antwoord.','Ouder dan de meeste examenvragen. Wijzer ook.','Bestond al voor het eindexamen. Zal er ook na zijn.'],
   evoMsg:['🦔 Je Olifant begint als egeltje! Stekelig maar lief.','🦛 Je Olifant wordt ENORM! Past niet meer door de deur.','🐘 OLIFANT! Vergeet nooit meer een formule.','🦣 MAMMOET! Bevroren in kennis. Voor altijd.']},
  {id:'eenhoorn', n:'Eenhoorn', s:['','','','','',''], fallback:['🐴','🦄','🦄','🦄','🦄','🦄'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="51" rx="12" ry="3" fill="#6a5a8a" opacity=".14"/><path d="M19 24 l-2 -7 6 5Z" fill="#f3eefb"/><path d="M41 24 l2 -7 -6 5Z" fill="#f3eefb"/><circle cx="30" cy="34" r="15" fill="#f7f3fc"/><ellipse cx="30" cy="40" rx="8.5" ry="6.5" fill="#fbeef4"/><path d="M30 19 q-4 -3 -8 -1" stroke="#f3a8d0" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="24" cy="32" r="4.4" fill="#fff"/><circle cx="36" cy="32" r="4.4" fill="#fff"/><circle cx="24.4" cy="33" r="2.4" fill="#5a3a6e"/><circle cx="35.6" cy="33" r="2.4" fill="#5a3a6e"/><circle cx="23.4" cy="31.4" r="1" fill="#fff"/><circle cx="34.6" cy="31.4" r="1" fill="#fff"/><ellipse cx="30" cy="39" rx="2.4" ry="1.6" fill="#e88ab8"/><path d="M30 41 q-2 1.5 -3.5 1 M30 41 q2 1.5 3.5 1" fill="none" stroke="#d77aa8" stroke-width="1.2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="52" rx="13" ry="3" fill="#6a5a8a" opacity=".15"/><path d="M30 18 l2.5 -10 1.5 10Z" fill="#f5c842" stroke="#dca91e" stroke-width="1"/><path d="M18 23 l-2 -8 6 6Z" fill="#f3eefb"/><path d="M42 23 l2 -8 -6 6Z" fill="#f3eefb"/><path d="M21 19 q-2 -2 -4 0" stroke="#a78bfa" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="30" cy="34" r="16" fill="#f7f3fc"/><ellipse cx="30" cy="40" rx="9" ry="7" fill="#fbeef4"/><path d="M30 18 q-5 -2 -9 1" stroke="#f3a8d0" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="24" cy="32" r="4.6" fill="#fff"/><circle cx="36" cy="32" r="4.6" fill="#fff"/><circle cx="24.4" cy="33" r="2.5" fill="#5a3a6e"/><circle cx="35.6" cy="33" r="2.5" fill="#5a3a6e"/><circle cx="23.3" cy="31.4" r="1.1" fill="#fff"/><circle cx="34.5" cy="31.4" r="1.1" fill="#fff"/><ellipse cx="30" cy="39.5" rx="2.6" ry="1.7" fill="#e88ab8"/><path d="M30 41.5 q-2.2 1.6 -4 1 M30 41.5 q2.2 1.6 4 1" fill="none" stroke="#d77aa8" stroke-width="1.3" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="54" rx="14" ry="3" fill="#4a3a6a" opacity=".17"/><path d="M30 16 l3 -12 1.6 12Z" fill="#f5c842" stroke="#dca91e" stroke-width="1"/><path d="M17 22 l-2 -9 6 7Z" fill="#f3eefb"/><path d="M43 22 l2 -9 -6 7Z" fill="#f3eefb"/><path d="M22 17 q5 -4 9 1 q-3 5 -8 4Z" fill="#f3a8d0"/><path d="M38 17 q-2 -2 -4 0" stroke="#7cc4f0" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="30" cy="34" r="17" fill="#f7f3fc"/><ellipse cx="30" cy="40" rx="10" ry="7.5" fill="#fbeef4"/><path d="M30 17 q-6 -2 -10 2 M30 17 q-2 4 -8 5" stroke="#f0a0c8" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="23.5" cy="32" r="4.8" fill="#fff"/><circle cx="36.5" cy="32" r="4.8" fill="#fff"/><circle cx="24" cy="33" r="2.6" fill="#5a3a6e"/><circle cx="36" cy="33" r="2.6" fill="#5a3a6e"/><circle cx="22.8" cy="31.4" r="1.1" fill="#fff"/><circle cx="34.8" cy="31.4" r="1.1" fill="#fff"/><ellipse cx="30" cy="39.5" rx="2.8" ry="1.8" fill="#e88ab8"/><path d="M30 41.7 q-2.4 1.8 -4.5 1 M30 41.7 q2.4 1.8 4.5 1" fill="none" stroke="#d77aa8" stroke-width="1.4" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="55" rx="15" ry="3" fill="#3a2a5a" opacity=".2"/><path d="M30 14 l3.5 -13 1.8 13Z" fill="#f7cf4a" stroke="#dca91e" stroke-width="1.1"/><path d="M16 21 l-2 -10 6 8Z" fill="#f3eefb"/><path d="M44 21 l2 -10 -6 8Z" fill="#f3eefb"/><path d="M21 16 q6 -5 11 1 q-4 6 -10 4Z" fill="#f3a8d0"/><path d="M39 16 q-6 -5 -11 1 q4 6 10 4Z" fill="#a78bfa"/><circle cx="30" cy="34" r="18.5" fill="#f8f4fd"/><ellipse cx="30" cy="40" rx="11" ry="8" fill="#fbeef4"/><path d="M30 16 q-7 -2 -11 3 M30 16 q-2 5 -9 6 M30 16 q7 -2 11 3" stroke="#ec9ec6" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="23" cy="32" r="5" fill="#fff"/><circle cx="37" cy="32" r="5" fill="#fff"/><circle cx="23.6" cy="33" r="2.8" fill="#5a3a6e"/><circle cx="36.4" cy="33" r="2.8" fill="#5a3a6e"/><circle cx="23.6" cy="33" r="1.5" fill="#160c22"/><circle cx="36.4" cy="33" r="1.5" fill="#160c22"/><circle cx="22.3" cy="31.3" r="1.2" fill="#fff"/><circle cx="35.1" cy="31.3" r="1.2" fill="#fff"/><ellipse cx="30" cy="39.5" rx="3" ry="1.9" fill="#e88ab8"/><path d="M30 42 q-2.6 1.9 -4.8 1 M30 42 q2.6 1.9 4.8 1" fill="none" stroke="#d77aa8" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="56" rx="16" ry="3" fill="#2a1a4a" opacity=".22"/><path d="M30 13 l4 -13 2 13Z" fill="#f9d24e" stroke="#dca91e" stroke-width="1.2"/><path d="M15 20 l-2 -11 7 9Z" fill="#f3eefb"/><path d="M45 20 l2 -11 -7 9Z" fill="#f3eefb"/><path d="M20 15 q7 -5 12 1 q-4 7 -11 4Z" fill="#f3a8d0"/><path d="M40 15 q-7 -5 -12 1 q4 7 11 4Z" fill="#8bc4f5"/><path d="M30 11 q-4 4 -3 8 q3 -2 3 -8Z" fill="#b39df9"/><circle cx="30" cy="34" r="19.5" fill="#f9f5fe"/><ellipse cx="30" cy="40" rx="11.5" ry="8.5" fill="#fceff5"/><path d="M30 15 q-8 -2 -12 4 M30 15 q-2 6 -10 7 M30 15 q8 -2 12 4 M30 15 q2 6 10 7" stroke="#eb98c2" stroke-width="2.7" fill="none" stroke-linecap="round"/><circle cx="22.5" cy="32" r="5.2" fill="#fff"/><circle cx="37.5" cy="32" r="5.2" fill="#fff"/><circle cx="23.1" cy="33" r="2.9" fill="#5a3a6e"/><circle cx="36.9" cy="33" r="2.9" fill="#5a3a6e"/><circle cx="23.1" cy="33" r="1.6" fill="#120a1e"/><circle cx="36.9" cy="33" r="1.6" fill="#120a1e"/><circle cx="21.7" cy="31.2" r="1.3" fill="#fff"/><circle cx="35.5" cy="31.2" r="1.3" fill="#fff"/><ellipse cx="30" cy="39.7" rx="3.1" ry="2" fill="#e88ab8"/><path d="M30 42.3 q-2.8 2 -5 1 M30 42.3 q2.8 2 5 1" fill="none" stroke="#d77aa8" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="57" rx="16" ry="2.8" fill="#2a1a4a" opacity=".24"/><path d="M15 21 l-2 -11 7 9Z" fill="#f3eefb"/><path d="M45 21 l2 -11 -7 9Z" fill="#f3eefb"/><path d="M20 16 q7 -5 12 1 q-4 7 -11 4Z" fill="#f3a8d0"/><path d="M40 16 q-7 -5 -12 1 q4 7 11 4Z" fill="#8bc4f5"/><circle cx="30" cy="35" r="19.5" fill="#f9f5fe"/><path d="M30 3 l3 5.5 6 .7 -4.5 4.3 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4.3 6 -.7Z" fill="#f9cf4d" stroke="#dca91e" stroke-width="1" stroke-linejoin="round"/><path d="M30 12 l2 -3 1 3Z" fill="#f9d24e"/><ellipse cx="30" cy="41" rx="11.5" ry="8.5" fill="#fceff5"/><path d="M30 17 q-8 -2 -12 4 M30 17 q-2 6 -10 7 M30 17 q8 -2 12 4 M30 17 q2 6 10 7" stroke="#eb98c2" stroke-width="2.7" fill="none" stroke-linecap="round"/><circle cx="22.5" cy="33" r="5.2" fill="#fff"/><circle cx="37.5" cy="33" r="5.2" fill="#fff"/><circle cx="23.1" cy="34" r="2.9" fill="#5a3a6e"/><circle cx="36.9" cy="34" r="2.9" fill="#5a3a6e"/><circle cx="23.1" cy="34" r="1.6" fill="#120a1e"/><circle cx="36.9" cy="34" r="1.6" fill="#120a1e"/><circle cx="21.7" cy="32.2" r="1.3" fill="#fff"/><circle cx="35.5" cy="32.2" r="1.3" fill="#fff"/><ellipse cx="30" cy="40.7" rx="3.1" ry="2" fill="#e88ab8"/><path d="M30 43.3 q-2.8 2 -5 1 M30 43.3 q2.8 2 5 1" fill="none" stroke="#d77aa8" stroke-width="1.5" stroke-linecap="round"/></svg>'
   ],
   lbl:['Veulen','Hoorntje','Jonge Eenhoorn','Regenboog-Eenhoorn','Sterrenhoorn','Gouden Eenhoorn','Hemelse Eenhoorn'],
   desc:['Klein veulen met een glittermanen. Nog geen hoorn.','Eerste hoorntje! Glittert van trots.','Manen in regenboogkleuren, hoorn van goud.','Tovert hoge cijfers tevoorschijn. Letterlijk.','Manen vol sterren. Examens worden magie.','Verguld van hoorn tot hoef. Bijna onaantastbaar.','De hemelse eenhoorn. Pure magie en wijsheid.'],
   evoMsg:['🦄 Eerste hoorntje! Je veulen glittert van trots.','🦄 Regenboogmanen! Je Eenhoorn tovert al een beetje.','🦄 Regenboog-Eenhoorn tovert hoge cijfers tevoorschijn!','🦄 STERRENHOORN! Je manen zitten vol sterren.','🏅 GOUDEN EENHOORN! Je hoorn glanst als puur goud.','👑 HEMELSE EENHOORN! De ultieme, gekroonde vorm.']},
  {id:'vos', n:'Vos', s:['','','','','',''], fallback:['🦊','🦊','🦊','🦊','🦊','🦊'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="51" rx="12" ry="3" fill="#7c3a14" opacity=".16"/><path d="M19 25 l-4 -10 9 7Z" fill="#e8702a"/><path d="M41 25 l4 -10 -9 7Z" fill="#e8702a"/><path d="M19 23 l-2 -4 3 3Z" fill="#2a1a12"/><path d="M41 23 l2 -4 -3 3Z" fill="#2a1a12"/><circle cx="30" cy="33" r="15" fill="#ee7a32"/><path d="M22 36 q8 5 16 0 q-2 7 -8 8 q-6 -1 -8 -8Z" fill="#fdf3e6"/><circle cx="24" cy="31" r="4.4" fill="#fff"/><circle cx="36" cy="31" r="4.4" fill="#fff"/><circle cx="24.4" cy="32" r="2.4" fill="#3a2410"/><circle cx="35.6" cy="32" r="2.4" fill="#3a2410"/><circle cx="23.4" cy="30.4" r="1" fill="#fff"/><circle cx="34.6" cy="30.4" r="1" fill="#fff"/><path d="M30 38 l-2.2 -1.8 h4.4Z" fill="#2a1a12"/><path d="M30 39.6 v3" stroke="#2a1a12" stroke-width="1.2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="52" rx="13" ry="3" fill="#7c3a14" opacity=".16"/><path d="M18 24 l-5 -11 10 7Z" fill="#e8702a"/><path d="M42 24 l5 -11 -10 7Z" fill="#e8702a"/><path d="M18 22 l-2.5 -5 4 4Z" fill="#2a1a12"/><path d="M42 22 l2.5 -5 -4 4Z" fill="#2a1a12"/><circle cx="30" cy="33" r="16" fill="#ee7a32"/><path d="M21 35 q9 6 18 0 q-2 8 -9 9 q-7 -1 -9 -9Z" fill="#fdf3e6"/><circle cx="24" cy="31" r="4.6" fill="#fff"/><circle cx="36" cy="31" r="4.6" fill="#fff"/><circle cx="24.4" cy="32" r="2.5" fill="#3a2410"/><circle cx="35.6" cy="32" r="2.5" fill="#3a2410"/><circle cx="23.3" cy="30.4" r="1.1" fill="#fff"/><circle cx="34.5" cy="30.4" r="1.1" fill="#fff"/><path d="M30 38.5 l-2.4 -2 h4.8Z" fill="#2a1a12"/><path d="M30 40.3 v3.2" stroke="#2a1a12" stroke-width="1.3" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="54" rx="14" ry="3" fill="#5e2c0e" opacity=".18"/><path d="M16 23 l-5 -12 11 8Z" fill="#ec762c"/><path d="M44 23 l5 -12 -11 8Z" fill="#ec762c"/><path d="M16 21 l-2.5 -6 5 4Z" fill="#241510"/><path d="M44 21 l2.5 -6 -5 4Z" fill="#241510"/><circle cx="30" cy="33" r="17" fill="#ee7a32"/><path d="M20 35 q10 6 20 0 q-2 9 -10 10 q-8 -1 -10 -10Z" fill="#fdf3e6"/><circle cx="23.5" cy="31" r="4.8" fill="#fff"/><circle cx="36.5" cy="31" r="4.8" fill="#fff"/><circle cx="24" cy="32" r="2.7" fill="#caa028"/><circle cx="36" cy="32" r="2.7" fill="#caa028"/><circle cx="24" cy="32" r="1.5" fill="#160c00"/><circle cx="36" cy="32" r="1.5" fill="#160c00"/><circle cx="22.8" cy="30.4" r="1.1" fill="#fff"/><circle cx="34.8" cy="30.4" r="1.1" fill="#fff"/><path d="M30 38.5 l-2.5 -2 h5Z" fill="#241510"/><path d="M30 40.4 v3.4" stroke="#241510" stroke-width="1.4" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="55" rx="15" ry="3" fill="#4a2208" opacity=".2"/><path d="M13 22 l-5 -13 12 8Z" fill="#ea722a"/><path d="M47 22 l5 -13 -12 8Z" fill="#ea722a"/><path d="M13 20 l-2.5 -7 6 5Z" fill="#201209"/><path d="M47 20 l2.5 -7 -6 5Z" fill="#201209"/><circle cx="30" cy="33" r="18.5" fill="#ee7a32"/><path d="M19 34 q11 7 22 0 q-2 10 -11 11 q-9 -1 -11 -11Z" fill="#fdf3e6"/><circle cx="23" cy="31" r="5" fill="#fff"/><circle cx="37" cy="31" r="5" fill="#fff"/><circle cx="23.6" cy="32" r="2.9" fill="#cf9a2c"/><circle cx="36.4" cy="32" r="2.9" fill="#cf9a2c"/><circle cx="23.6" cy="32" r="1.6" fill="#120a00"/><circle cx="36.4" cy="32" r="1.6" fill="#120a00"/><circle cx="22.3" cy="30.3" r="1.2" fill="#fff"/><circle cx="35.1" cy="30.3" r="1.2" fill="#fff"/><path d="M30 38 l-2.7 -2.2 h5.4Z" fill="#201209"/><path d="M30 40.2 v3.8" stroke="#201209" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="56" rx="16" ry="3" fill="#3a1a06" opacity=".22"/><path d="M11 21 l-5 -14 13 9Z" fill="#e86e26"/><path d="M49 21 l5 -14 -13 9Z" fill="#e86e26"/><path d="M11 19 l-2.5 -8 7 6Z" fill="#1c1008"/><path d="M49 19 l2.5 -8 -7 6Z" fill="#1c1008"/><circle cx="30" cy="34" r="19.5" fill="#ee7a32"/><path d="M18 34 q12 7 24 0 q-2 11 -12 12 q-10 -1 -12 -12Z" fill="#fdf4e8"/><circle cx="22.5" cy="31" r="5.2" fill="#fff"/><circle cx="37.5" cy="31" r="5.2" fill="#fff"/><circle cx="23.1" cy="32" r="3" fill="#d4a32c"/><circle cx="36.9" cy="32" r="3" fill="#d4a32c"/><circle cx="23.1" cy="32" r="1.7" fill="#0e0800"/><circle cx="36.9" cy="32" r="1.7" fill="#0e0800"/><circle cx="21.7" cy="30.2" r="1.3" fill="#fff"/><circle cx="35.5" cy="30.2" r="1.3" fill="#fff"/><path d="M30 38 l-2.9 -2.4 h5.8Z" fill="#1c1008"/><path d="M30 40.4 v4.2" stroke="#1c1008" stroke-width="1.6" stroke-linecap="round"/><path d="M18 37 l-8 -1 M18 40 l-8 2 M42 37 l8 -1 M42 40 l8 2" stroke="#e8d8c2" stroke-width="1" stroke-linecap="round" opacity=".7"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="57" rx="16" ry="2.8" fill="#3a1a06" opacity=".24"/><path d="M11 22 l-5 -14 13 9Z" fill="#dd671f"/><path d="M49 22 l5 -14 -13 9Z" fill="#dd671f"/><path d="M11 20 l-2.5 -8 7 6Z" fill="#180e06"/><path d="M49 20 l2.5 -8 -7 6Z" fill="#180e06"/><circle cx="30" cy="35" r="19.5" fill="#ee7a32"/><path d="M30 5 l3 5.5 6 .7 -4.5 4.3 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4.3 6 -.7Z" fill="#f9cf4d" stroke="#dca91e" stroke-width="1" stroke-linejoin="round"/><path d="M18 35 q12 7 24 0 q-2 11 -12 12 q-10 -1 -12 -12Z" fill="#fdf4e8"/><circle cx="22.5" cy="32" r="5.2" fill="#fff"/><circle cx="37.5" cy="32" r="5.2" fill="#fff"/><circle cx="23.1" cy="33" r="3" fill="#dba830"/><circle cx="36.9" cy="33" r="3" fill="#dba830"/><circle cx="23.1" cy="33" r="1.7" fill="#0e0800"/><circle cx="36.9" cy="33" r="1.7" fill="#0e0800"/><circle cx="21.7" cy="31.2" r="1.3" fill="#fff"/><circle cx="35.5" cy="31.2" r="1.3" fill="#fff"/><path d="M30 39 l-2.9 -2.4 h5.8Z" fill="#180e06"/><path d="M30 41.4 v4.2" stroke="#180e06" stroke-width="1.6" stroke-linecap="round"/><path d="M18 38 l-8 -1 M18 41 l-8 2 M42 38 l8 -1 M42 41 l8 2" stroke="#e8d8c2" stroke-width="1" stroke-linecap="round" opacity=".7"/></svg>'
   ],
   lbl:['Vosje','Speels Welpje','Jonge Vos','Slimme Vos','Sluwe Vos','Gouden Vos','Geestvos'],
   desc:['Klein, rood en oerslim. Ruikt elke valstrik.','Speelt en stoeit, maar mist nooit een truc.','Doorziet de moeilijkste strikvragen.','Sluw en snel - kiest altijd de slimste route.','Niemand pakt hem te grazen. Niemand.','Verguld van staart tot snuit. Bijna onaantastbaar.','De geestvos. Kent de antwoorden voor je ze leest.'],
   evoMsg:['🦊 Je vosje ruikt al elke valstrik!','🦊 Jonge Vos doorziet de strikvragen.','🦊 Slimme Vos ontwaakt - kiest de slimste route.','🦊 SLUWE VOS! Niemand pakt jou nog te grazen.','🏅 GOUDEN VOS! Je vacht glanst als puur goud.','👑 GEESTVOS! De ultieme, gekroonde vorm.']},
  {id:'uil', n:'Uil', s:['','','','','',''], fallback:['🥚','🐣','🦉','🦉','🦉','🦉'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="51" rx="14" ry="3.2" fill="#3a2a12" opacity=".18"/><path d="M30 14 C39 14 45 26 45 36 C45 46 38 51 30 51 C22 51 15 46 15 36 C15 26 21 14 30 14Z" fill="#f1e7d2" stroke="#b89a64" stroke-width="2.4"/><path d="M26 28 l4 3 -4 3 4 3" fill="none" stroke="#b89a64" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><circle cx="23" cy="27" r="1.6" fill="#cdb27c"/><circle cx="37" cy="34" r="1.7" fill="#cdb27c"/><ellipse cx="25" cy="24" rx="5" ry="2.6" fill="#fff" opacity=".5"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="53" rx="13" ry="3" fill="#3a2a12" opacity=".18"/><circle cx="30" cy="34" r="16" fill="#d9c08a"/><path d="M24 18 q1.5 -5 3.5 -1 M30 16 q1.5 -5.5 3.5 -1 M36 18 q-1.5 -5 -3.5 -1" stroke="#cdb074" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="23.5" cy="33" r="6.4" fill="#fff"/><circle cx="36.5" cy="33" r="6.4" fill="#fff"/><circle cx="23.8" cy="33.6" r="3.4" fill="#3a2408"/><circle cx="36.2" cy="33.6" r="3.4" fill="#3a2408"/><circle cx="22.3" cy="31.8" r="1.3" fill="#fff"/><circle cx="34.7" cy="31.8" r="1.3" fill="#fff"/><path d="M27 39 l3 -2.4 3 2.4 -3 2.6Z" fill="#f4a72a" stroke="#cf7d12" stroke-width="1" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="54" rx="14" ry="3" fill="#241808" opacity=".22"/><ellipse cx="13" cy="38" rx="6.5" ry="11" fill="#9c8048" stroke="#7c6334" stroke-width="1.8" transform="rotate(16,13,38)"/><ellipse cx="47" cy="38" rx="6.5" ry="11" fill="#9c8048" stroke="#7c6334" stroke-width="1.8" transform="rotate(-16,47,38)"/><circle cx="30" cy="35" r="17" fill="#b8975a"/><path d="M30 19 q-12 1 -15 11" fill="none" stroke="#a8854a" stroke-width="2" stroke-linecap="round" opacity=".6"/><circle cx="23" cy="34" r="7" fill="#fff"/><circle cx="37" cy="34" r="7" fill="#fff"/><circle cx="23.4" cy="34.6" r="3.7" fill="#caa33a"/><circle cx="36.6" cy="34.6" r="3.7" fill="#caa33a"/><circle cx="23.4" cy="34.6" r="2" fill="#1a0f00"/><circle cx="36.6" cy="34.6" r="2" fill="#1a0f00"/><circle cx="21.9" cy="32.8" r="1.4" fill="#fff"/><circle cx="35.1" cy="32.8" r="1.4" fill="#fff"/><path d="M27 40 l3 -2.6 3 2.6 -3 2.8Z" fill="#f4a72a" stroke="#cf7d12" stroke-width="1.1" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="55" rx="15" ry="3" fill="#1c1306" opacity=".24"/><path d="M14 30 q-12 4 -10 18 q9 -2 13 -9Z" fill="#8a6f3e" stroke="#6b5430" stroke-width="1.8" stroke-linejoin="round"/><path d="M46 30 q12 4 10 18 q-9 -2 -13 -9Z" fill="#8a6f3e" stroke="#6b5430" stroke-width="1.8" stroke-linejoin="round"/><path d="M18 16 l3 -8 4 7Z" fill="#9c8048"/><path d="M42 16 l-3 -8 -4 7Z" fill="#9c8048"/><circle cx="30" cy="35" r="18" fill="#a98a52"/><path d="M30 17 q-13 1 -16 12 M16 40 q14 6 28 0" fill="none" stroke="#977845" stroke-width="1.8" stroke-linecap="round" opacity=".55"/><circle cx="22.5" cy="33" r="7.4" fill="#fff"/><circle cx="37.5" cy="33" r="7.4" fill="#fff"/><circle cx="23" cy="33.6" r="3.9" fill="#e0b53c"/><circle cx="37" cy="33.6" r="3.9" fill="#e0b53c"/><circle cx="23" cy="33.6" r="2.1" fill="#140c00"/><circle cx="37" cy="33.6" r="2.1" fill="#140c00"/><circle cx="21.4" cy="31.7" r="1.5" fill="#fff"/><circle cx="35.4" cy="31.7" r="1.5" fill="#fff"/><path d="M27 39 l3 -2.8 3 2.8 -3 3Z" fill="#f4a72a" stroke="#c57612" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="56" rx="15" ry="2.8" fill="#160f04" opacity=".26"/><path d="M13 28 q-13 4 -11 19 q10 -2 15 -10Z" fill="#7c6334" stroke="#5a4526" stroke-width="1.8" stroke-linejoin="round"/><path d="M47 28 q13 4 11 19 q-10 -2 -15 -10Z" fill="#7c6334" stroke="#5a4526" stroke-width="1.8" stroke-linejoin="round"/><path d="M17 14 l3.5 -9 4.5 8Z" fill="#8a6f3e"/><path d="M43 14 l-3.5 -9 -4.5 8Z" fill="#8a6f3e"/><circle cx="30" cy="35" r="19" fill="#9c7f4a"/><ellipse cx="30" cy="40" rx="13" ry="11" fill="#c7ac76"/><path d="M30 18 q-14 1 -17 13" fill="none" stroke="#8a6f3e" stroke-width="1.8" stroke-linecap="round" opacity=".5"/><circle cx="22" cy="33" r="8" fill="#fff"/><circle cx="38" cy="33" r="8" fill="#fff"/><circle cx="22.6" cy="33.6" r="4.2" fill="#f0c244"/><circle cx="37.4" cy="33.6" r="4.2" fill="#f0c244"/><circle cx="22.6" cy="33.6" r="2.2" fill="#100a00"/><circle cx="37.4" cy="33.6" r="2.2" fill="#100a00"/><circle cx="20.9" cy="31.6" r="1.6" fill="#fff"/><circle cx="35.7" cy="31.6" r="1.6" fill="#fff"/><path d="M14 28 q4 -3 7 -1 M46 28 q-4 -3 -7 -1" stroke="#6b5430" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M26.5 38 l3.5 -3 3.5 3 -3.5 3.4Z" fill="#f4a72a" stroke="#c57612" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="57" rx="15" ry="2.6" fill="#100a02" opacity=".3"/><path d="M11 24 Q-3 30 4 46 Q14 40 19 31 Q14 27 11 24Z" fill="#6b5430" stroke="#4a3820" stroke-width="1.8" stroke-linejoin="round"/><path d="M49 24 Q63 30 56 46 Q46 40 41 31 Q46 27 49 24Z" fill="#6b5430" stroke="#4a3820" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 13 l4 -10 5 9Z" fill="#7c6334"/><path d="M44 13 l-4 -10 -5 9Z" fill="#7c6334"/><path d="M30 4 l2.6 5.2 5.7 .7 -4.2 4 1 5.6 -5.1 -2.8 -5.1 2.8 1 -5.6 -4.2 -4 5.7 -.7Z" fill="#f9cf4d" stroke="#dca91e" stroke-width="1" stroke-linejoin="round"/><circle cx="30" cy="36" r="19.5" fill="#8e7242"/><ellipse cx="30" cy="41" rx="13.5" ry="11.5" fill="#c7ac76"/><circle cx="21.5" cy="34" r="8.2" fill="#fff"/><circle cx="38.5" cy="34" r="8.2" fill="#fff"/><circle cx="22.1" cy="34.6" r="4.3" fill="#f4c948"/><circle cx="37.9" cy="34.6" r="4.3" fill="#f4c948"/><circle cx="22.1" cy="34.6" r="2.3" fill="#0e0900"/><circle cx="37.9" cy="34.6" r="2.3" fill="#0e0900"/><circle cx="20.4" cy="32.5" r="1.7" fill="#fff"/><circle cx="36.2" cy="32.5" r="1.7" fill="#fff"/><path d="M13 29 q4 -3 8 -1 M47 29 q-4 -3 -8 -1" stroke="#5a4526" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M26 39 l4 -3.4 4 3.4 -4 3.6Z" fill="#f4a72a" stroke="#c57612" stroke-width="1.4" stroke-linejoin="round"/></svg>'
   ],
   lbl:['Uilen-Ei','Pluizig Uiltje','Jonge Oehoe','Wijze Waker','Grote Oehoe','Gouden Uil','Orakeluil'],
   desc:['Broedt op wijsheid. Komt er bijna uit.','Donzig en grootogig, knippert bij elke vraag.','Eerste veren en oortjes, blijft de hele nacht wakker.','Ziet in het donker welk antwoord klopt.','Niets ontgaat zijn enorme ogen. Echt niets.','Verguld verenkleed dat glanst. Bijna op de top.','Het alziend orakel met kroon. Kent het antwoord al.'],
   evoMsg:['🐣 Je ei is uit! Een donzig uiltje knippert wijs.','🦉 Eerste oortjes! Je Uil blijft de hele nacht oefenen.','🦉 Wijze waker ontwaakt - ziet in het donker.','🦉 GROTE OEHOE! Niets ontgaat zijn enorme ogen.','🏅 GOUDEN UIL! Je verenkleed glanst als puur goud.','👑 ORAKELUIL ONTGRENDELD! De ultieme, alwetende vorm.']},
  {id:'octopus', n:'Octopus', s:['','','','','',''], fallback:['🐙','🐙','🐙','🐙','🐙','🐙'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="51" rx="11" ry="3" fill="#7a1f5a" opacity=".16"/><path d="M21 38 q-3 8 -5 10 M27 40 q-1 9 -2 11 M33 40 q1 9 2 11 M39 38 q3 8 5 10" stroke="#e063a8" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="30" cy="30" r="15" fill="#ec74b4"/><circle cx="24" cy="29" r="4.6" fill="#fff"/><circle cx="36" cy="29" r="4.6" fill="#fff"/><circle cx="24.4" cy="30" r="2.5" fill="#3a1030"/><circle cx="35.6" cy="30" r="2.5" fill="#3a1030"/><circle cx="23.3" cy="28.4" r="1.1" fill="#fff"/><circle cx="34.5" cy="28.4" r="1.1" fill="#fff"/><path d="M26 35 q4 3 8 0" fill="none" stroke="#c2407e" stroke-width="1.6" stroke-linecap="round"/><circle cx="20" cy="27" r="2.4" fill="#f7a8d0" opacity=".7"/><circle cx="40" cy="27" r="2.4" fill="#f7a8d0" opacity=".7"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="53" rx="13" ry="3" fill="#7a1f5a" opacity=".18"/><path d="M18 40 q-5 8 -8 11 M24 42 q-3 9 -4 12 M30 43 q0 9 0 12 M36 42 q3 9 4 12 M42 40 q5 8 8 11" stroke="#dd5aa2" stroke-width="3.2" fill="none" stroke-linecap="round"/><circle cx="30" cy="30" r="16.5" fill="#ec74b4"/><circle cx="24" cy="29" r="4.8" fill="#fff"/><circle cx="36" cy="29" r="4.8" fill="#fff"/><circle cx="24.4" cy="30" r="2.6" fill="#3a1030"/><circle cx="35.6" cy="30" r="2.6" fill="#3a1030"/><circle cx="23.3" cy="28.4" r="1.1" fill="#fff"/><circle cx="34.5" cy="28.4" r="1.1" fill="#fff"/><path d="M26 35 q4 3 8 0" fill="none" stroke="#c2407e" stroke-width="1.7" stroke-linecap="round"/><circle cx="19" cy="33" r="2.2" fill="#f7a8d0" opacity=".7"/><circle cx="41" cy="33" r="2.2" fill="#f7a8d0" opacity=".7"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="54" rx="14" ry="3" fill="#5a1542" opacity=".2"/><path d="M15 40 q-6 9 -9 12 M22 43 q-4 10 -6 13 M30 44 q0 10 0 13 M38 43 q4 10 6 13 M45 40 q6 9 9 12" stroke="#d850 9c" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M15 40 q-6 9 -9 12 M22 43 q-4 10 -6 13 M30 44 q0 10 0 13 M38 43 q4 10 6 13 M45 40 q6 9 9 12" stroke="#d8509c" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="30" cy="30" r="18" fill="#ec74b4"/><circle cx="23.5" cy="29" r="5" fill="#fff"/><circle cx="36.5" cy="29" r="5" fill="#fff"/><circle cx="24" cy="30" r="2.8" fill="#3a1030"/><circle cx="36" cy="30" r="2.8" fill="#3a1030"/><circle cx="22.8" cy="28.4" r="1.1" fill="#fff"/><circle cx="34.8" cy="28.4" r="1.1" fill="#fff"/><path d="M25 35 q5 3 10 0" fill="none" stroke="#c2407e" stroke-width="1.8" stroke-linecap="round"/><circle cx="18" cy="34" r="2.4" fill="#f7a8d0" opacity=".7"/><circle cx="42" cy="34" r="2.4" fill="#f7a8d0" opacity=".7"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="55" rx="15" ry="3" fill="#4a1036" opacity=".22"/><path d="M13 40 q-7 9 -10 13 M21 43 q-5 10 -7 14 M30 45 q0 10 0 14 M39 43 q5 10 7 14 M47 40 q7 9 10 13" stroke="#d34a96" stroke-width="3.6" fill="none" stroke-linecap="round"/><circle cx="30" cy="30" r="19.5" fill="#ec74b4"/><circle cx="23" cy="29" r="5.2" fill="#fff"/><circle cx="37" cy="29" r="5.2" fill="#fff"/><circle cx="23.6" cy="30" r="2.9" fill="#3a1030"/><circle cx="36.4" cy="30" r="2.9" fill="#3a1030"/><circle cx="22.3" cy="28.3" r="1.2" fill="#fff"/><circle cx="35.1" cy="28.3" r="1.2" fill="#fff"/><path d="M24 35 q6 4 12 0" fill="none" stroke="#bc3a78" stroke-width="1.9" stroke-linecap="round"/><circle cx="17" cy="33" r="2.6" fill="#f7a8d0" opacity=".7"/><circle cx="43" cy="33" r="2.6" fill="#f7a8d0" opacity=".7"/><circle cx="26" cy="46" r="1.6" fill="#f7a8d0"/><circle cx="34" cy="46" r="1.6" fill="#f7a8d0"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="56" rx="16" ry="3" fill="#3a0c2a" opacity=".24"/><path d="M11 40 q-8 10 -10 14 M20 44 q-6 11 -8 15 M30 46 q0 11 0 15 M40 44 q6 11 8 15 M49 40 q8 10 10 14" stroke="#cd4290" stroke-width="3.8" fill="none" stroke-linecap="round"/><circle cx="14" cy="50" r="1.6" fill="#f7a8d0"/><circle cx="22" cy="54" r="1.6" fill="#f7a8d0"/><circle cx="38" cy="54" r="1.6" fill="#f7a8d0"/><circle cx="46" cy="50" r="1.6" fill="#f7a8d0"/><circle cx="30" cy="30" r="20.5" fill="#ec74b4"/><circle cx="22.5" cy="29" r="5.4" fill="#fff"/><circle cx="37.5" cy="29" r="5.4" fill="#fff"/><circle cx="23.1" cy="30" r="3" fill="#3a1030"/><circle cx="36.9" cy="30" r="3" fill="#3a1030"/><circle cx="21.7" cy="28.2" r="1.3" fill="#fff"/><circle cx="35.5" cy="28.2" r="1.3" fill="#fff"/><path d="M16 24 q4 -3 7 -1 M44 24 q-4 -3 -7 -1" stroke="#c2407e" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M23 35 q7 4 14 0" fill="none" stroke="#bc3a78" stroke-width="2" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="57" rx="16" ry="2.8" fill="#3a0c2a" opacity=".26"/><path d="M11 41 q-8 10 -10 14 M20 45 q-6 11 -8 15 M30 47 q0 11 0 15 M40 45 q6 11 8 15 M49 41 q8 10 10 14" stroke="#c23a86" stroke-width="3.8" fill="none" stroke-linecap="round"/><circle cx="14" cy="51" r="1.6" fill="#f7a8d0"/><circle cx="22" cy="55" r="1.6" fill="#f7a8d0"/><circle cx="38" cy="55" r="1.6" fill="#f7a8d0"/><circle cx="46" cy="51" r="1.6" fill="#f7a8d0"/><circle cx="30" cy="31" r="20.5" fill="#ec74b4"/><path d="M30 5 l3 5.5 6 .7 -4.5 4.3 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4.3 6 -.7Z" fill="#f9cf4d" stroke="#dca91e" stroke-width="1" stroke-linejoin="round"/><circle cx="22.5" cy="30" r="5.4" fill="#fff"/><circle cx="37.5" cy="30" r="5.4" fill="#fff"/><circle cx="23.1" cy="31" r="3" fill="#3a1030"/><circle cx="36.9" cy="31" r="3" fill="#3a1030"/><circle cx="21.7" cy="29.2" r="1.3" fill="#fff"/><circle cx="35.5" cy="29.2" r="1.3" fill="#fff"/><path d="M16 25 q4 -3 7 -1 M44 25 q-4 -3 -7 -1" stroke="#c2407e" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M23 36 q7 4 14 0" fill="none" stroke="#bc3a78" stroke-width="2" stroke-linecap="round"/></svg>'
   ],
   lbl:['Mini-Octopus','Inktvisje','Jonge Octopus','Slimme Octopus','Acht-Armige Genie','Gouden Octopus','Diepzee-Kraken'],
   desc:['Acht armpjes, en alle acht willen leren.','Spuit inkt als het spannend wordt. Schattig.','Lost acht vragen tegelijk op. Eén per arm.','Het slimste wezen in de zee. En daarbuiten.','Acht armen, acht pennen, nul fouten.','Verguld van kop tot zuignap. Bijna onaantastbaar.','De diepzee-kraken. Examens verdwijnen in de diepte.'],
   evoMsg:['🐙 Acht armpjes die allemaal willen leren!','🐙 Je Octopus lost acht vragen tegelijk op!','🐙 Slimme Octopus - het slimste wezen in zee.','🐙 ACHT-ARMIGE GENIE! Acht pennen, nul fouten.','🏅 GOUDEN OCTOPUS! Je armen glanzen als puur goud.','👑 DIEPZEE-KRAKEN! De ultieme, gekroonde vorm.']},
  {id:'beer', n:'Beer', s:['','','','',''], fallback:['🐾','🐿️','🦦','🐻','🐻‍❄️'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="21" cy="21" rx="9" ry="10" fill="#a16207" stroke="#78350f" stroke-width="2.5"/><ellipse cx="39" cy="21" rx="9" ry="10" fill="#a16207" stroke="#78350f" stroke-width="2.5"/><circle cx="30" cy="36" r="18" fill="#b45309" stroke="#78350f" stroke-width="3"/><ellipse cx="30" cy="43" rx="10" ry="7" fill="#d97706" stroke="#b45309" stroke-width="1.5"/><circle cx="23" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="37" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="23" cy="31" r="3.5" fill="#1a0a00"/><circle cx="37" cy="31" r="3.5" fill="#1a0a00"/><circle cx="22.5" cy="30" r="1.2" fill="white"/><circle cx="36.5" cy="30" r="1.2" fill="white"/><ellipse cx="30" cy="39" rx="3" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="24" cy="26" rx="7" ry="4" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="19" cy="19" rx="9" ry="11" fill="#92400e" stroke="#78350f" stroke-width="2.5"/><ellipse cx="41" cy="19" rx="9" ry="11" fill="#92400e" stroke="#78350f" stroke-width="2.5"/><circle cx="30" cy="35" r="20" fill="#92400e" stroke="#78350f" stroke-width="3"/><ellipse cx="30" cy="44" rx="12" ry="8" fill="#b45309" stroke="#92400e" stroke-width="1.5"/><circle cx="22" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="30" r="3.5" fill="#1a0a00"/><circle cx="38" cy="30" r="3.5" fill="#1a0a00"/><circle cx="21.5" cy="29" r="1.2" fill="white"/><circle cx="37.5" cy="29" r="1.2" fill="white"/><ellipse cx="30" cy="40" rx="3.5" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="23" cy="25" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="18" rx="9" ry="12" fill="#78350f" stroke="#1a0a00" stroke-width="2.5"/><ellipse cx="44" cy="18" rx="9" ry="12" fill="#78350f" stroke="#1a0a00" stroke-width="2.5"/><circle cx="30" cy="34" r="21" fill="#78350f" stroke="#1a0a00" stroke-width="3"/><ellipse cx="30" cy="45" rx="14" ry="10" fill="#a16207" stroke="#92400e" stroke-width="1.5"/><circle cx="22" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="29" r="4" fill="#1a0a00"/><circle cx="38" cy="29" r="4" fill="#1a0a00"/><circle cx="21.5" cy="28" r="1.5" fill="white"/><circle cx="37.5" cy="28" r="1.5" fill="white"/><ellipse cx="30" cy="41" rx="4" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><ellipse cx="23" cy="23" rx="9" ry="4.5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="14" cy="16" rx="9" ry="13" fill="#1a0a00" stroke="#0c0a09" stroke-width="2.5"/><ellipse cx="46" cy="16" rx="9" ry="13" fill="#1a0a00" stroke="#0c0a09" stroke-width="2.5"/><circle cx="30" cy="33" r="23" fill="#1a0a00" stroke="#0c0a09" stroke-width="3"/><ellipse cx="30" cy="46" rx="16" ry="11" fill="#292524" stroke="#1a0a00" stroke-width="1.5"/><circle cx="21" cy="28" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="28" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="28" r="4.5" fill="#1a0a00"/><circle cx="39" cy="28" r="4.5" fill="#1a0a00"/><circle cx="20.5" cy="27" r="1.8" fill="white"/><circle cx="38.5" cy="27" r="1.8" fill="white"/><ellipse cx="30" cy="43" rx="4.5" ry="3.5" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><ellipse cx="22" cy="22" rx="10" ry="5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M12 10 L16 3 L20 10 L24 4 L30 10 L36 4 L40 10 L44 3 L48 10Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><ellipse cx="12" cy="14" rx="9" ry="13" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/><ellipse cx="48" cy="14" rx="9" ry="13" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/><circle cx="30" cy="32" r="23" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/><ellipse cx="30" cy="45" rx="16" ry="12" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1.5"/><circle cx="21" cy="27" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="27" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="27" r="5" fill="#1e293b"/><circle cx="39" cy="27" r="5" fill="#1e293b"/><circle cx="20.5" cy="26" r="2" fill="white"/><circle cx="38.5" cy="26" r="2" fill="white"/><ellipse cx="30" cy="42" rx="4.5" ry="3.5" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><ellipse cx="22" cy="21" rx="11" ry="5" fill="white" opacity="0.2"/></svg>'
   ],
   lbl:['Piepklein Welp','Nootjes-Eekhoorn','Relaxte Otter','Slaperige Beer','IJskoude IJsbeer'],
   desc:['Wil eigenlijk alleen maar slapen. Selectief studeren.','Hamstert kennis voor de winter (het examen).','Ligt op zijn rug en denkt na. Werkt verrassend goed.','Slaap-oefenen is ook oefenen. Toch?','IJskoud kalm bij elk examen. De kou heeft hem gehard.'],
   evoMsg:['🐿️ Je Beer begint als eekhoorn! Hamstert kennis.','🦦 Je Beer lounget als een otter. Ontspannen maar scherp.','🐻 BEER WAKKER! Heeft gewinterd en is er klaar voor.','🐻‍❄️ IJSBEER! Bevriest de examenangst. Letterlijk.']},
  {id:'slang', n:'Slang', s:['','','','','',''], fallback:['🥚','🐍','🐍','🐍','🐍','🐍'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="50" rx="13" ry="3" fill="#1f5132" opacity=".18"/><path d="M30 16 C39 16 44 27 44 36 C44 46 38 51 30 51 C22 51 16 46 16 36 C16 27 21 16 30 16Z" fill="#eaf6e2" stroke="#7ab06a" stroke-width="2.4"/><path d="M25 30 q5 4 0 8" fill="none" stroke="#7ab06a" stroke-width="1.8" stroke-linecap="round"/><path d="M36 28 q4 5 -1 9" fill="none" stroke="#9ec78c" stroke-width="1.6" stroke-linecap="round"/><circle cx="24" cy="26" r="1.5" fill="#a8d295"/><circle cx="37" cy="34" r="1.6" fill="#a8d295"/><ellipse cx="25" cy="24" rx="5" ry="2.6" fill="#fff" opacity=".5"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="52" rx="13" ry="3" fill="#1f5132" opacity=".2"/><path d="M22 50 q-6 -2 -4 -8 q1 -4 6 -4" fill="none" stroke="#4fae5e" stroke-width="6" stroke-linecap="round"/><circle cx="30" cy="34" r="15" fill="#5cb96b"/><path d="M30 40 q-2 6 0 10" stroke="#7fd189" stroke-width="2" fill="none" opacity=".6"/><circle cx="24" cy="33" r="4.8" fill="#fff"/><circle cx="36" cy="33" r="4.8" fill="#fff"/><ellipse cx="24.5" cy="34" rx="1.6" ry="3" fill="#143d22"/><ellipse cx="35.5" cy="34" rx="1.6" ry="3" fill="#143d22"/><circle cx="23.3" cy="32" r="1" fill="#fff"/><circle cx="34.3" cy="32" r="1" fill="#fff"/><path d="M30 39 v4 l-3 3 M30 43 l3 3" stroke="#e0537a" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="53" rx="15" ry="3" fill="#143d22" opacity=".22"/><path d="M20 51 q-9 -1 -8 -9 q1 -7 9 -7 q6 0 7 5" fill="none" stroke="#43a253" stroke-width="7" stroke-linecap="round"/><circle cx="32" cy="33" r="16" fill="#54b264"/><path d="M22 28 q10 -3 20 0 M22 36 q10 3 20 0" stroke="#3f9850" stroke-width="1.6" fill="none" opacity=".5"/><circle cx="26" cy="32" r="5" fill="#fff"/><circle cx="38" cy="32" r="5" fill="#fff"/><ellipse cx="26.6" cy="33" rx="1.7" ry="3.2" fill="#0e2e18"/><ellipse cx="37.4" cy="33" rx="1.7" ry="3.2" fill="#0e2e18"/><circle cx="25.2" cy="31" r="1.1" fill="#fff"/><circle cx="36" cy="31" r="1.1" fill="#fff"/><path d="M32 38 v4 l-3.5 3.5 M32 42 l3.5 3.5" stroke="#e0537a" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="54" rx="16" ry="3" fill="#0e2e18" opacity=".24"/><path d="M18 52 q-11 0 -10 -10 q1 -9 11 -9 q8 0 8 6" fill="none" stroke="#3a9149" stroke-width="8" stroke-linecap="round"/><ellipse cx="33" cy="32" rx="17" ry="16" fill="#49a659"/><path d="M22 26 q11 -3 22 0 M22 32 q11 3 22 0 M22 38 q11 3 22 0" stroke="#3a8b49" stroke-width="1.6" fill="none" opacity=".5"/><circle cx="27" cy="31" r="5.2" fill="#fdf2c0"/><circle cx="39" cy="31" r="5.2" fill="#fdf2c0"/><ellipse cx="27.6" cy="32" rx="1.8" ry="3.4" fill="#0a2412"/><ellipse cx="38.4" cy="32" rx="1.8" ry="3.4" fill="#0a2412"/><circle cx="26.2" cy="30" r="1.1" fill="#fff"/><circle cx="37" cy="30" r="1.1" fill="#fff"/><path d="M22 26 q4 -2 7 0 M37 26 q4 -2 7 0" stroke="#2e7340" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M33 38 v4 l-4 4 M33 42 l4 4" stroke="#e0537a" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="55" rx="16" ry="2.8" fill="#0a2412" opacity=".26"/><path d="M16 53 q-12 0 -11 -11 q1 -10 12 -10 q9 0 9 7" fill="none" stroke="#2f7d3e" stroke-width="8.5" stroke-linecap="round"/><path d="M14 22 q-10 4 -10 14 q10 -2 14 -8Z" fill="#43a153" stroke="#2f7d3e" stroke-width="1.6" stroke-linejoin="round"/><path d="M50 22 q10 4 10 14 q-10 -2 -14 -8Z" fill="#43a153" stroke="#2f7d3e" stroke-width="1.6" stroke-linejoin="round"/><ellipse cx="32" cy="32" rx="17" ry="16" fill="#41a052"/><path d="M22 24 q10 -3 20 0 M22 30 q10 3 20 0 M22 36 q10 3 20 0" stroke="#357f44" stroke-width="1.6" fill="none" opacity=".5"/><circle cx="26.5" cy="31" r="5.4" fill="#fdf2c0"/><circle cx="37.5" cy="31" r="5.4" fill="#fdf2c0"/><ellipse cx="27.1" cy="32" rx="1.9" ry="3.6" fill="#08200f"/><ellipse cx="36.9" cy="32" rx="1.9" ry="3.6" fill="#08200f"/><circle cx="25.7" cy="30" r="1.2" fill="#fff"/><circle cx="35.5" cy="30" r="1.2" fill="#fff"/><path d="M21 25 q5 -2 8 0 M35 25 q5 -2 8 0" stroke="#296b39" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M32 38 v4.5 l-4.5 4.5 M32 42.5 l4.5 4.5" stroke="#e0537a" stroke-width="1.9" fill="none" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="56" rx="16" ry="2.6" fill="#08200f" opacity=".3"/><path d="M15 54 q-13 0 -12 -12 q1 -11 13 -11 q10 0 10 8" fill="none" stroke="#296b39" stroke-width="9" stroke-linecap="round"/><path d="M11 18 q-13 5 -12 17 q12 -2 17 -9Z" fill="#3a9149" stroke="#266235" stroke-width="1.6" stroke-linejoin="round"/><path d="M53 18 q13 5 12 17 q-12 -2 -17 -9Z" fill="#3a9149" stroke="#266235" stroke-width="1.6" stroke-linejoin="round"/><path d="M30 5 l3 5.5 6 .7 -4.5 4.3 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4.3 6 -.7Z" fill="#f9cf4d" stroke="#dca91e" stroke-width="1" stroke-linejoin="round"/><ellipse cx="31" cy="33" rx="18" ry="16.5" fill="#3d9b4e"/><path d="M21 25 q10 -3 21 0 M21 31 q10 3 21 0 M21 37 q10 3 21 0" stroke="#317a40" stroke-width="1.6" fill="none" opacity=".5"/><circle cx="25.5" cy="32" r="5.6" fill="#fdf2c0"/><circle cx="37.5" cy="32" r="5.6" fill="#fdf2c0"/><ellipse cx="26.1" cy="33" rx="2" ry="3.8" fill="#06180c"/><ellipse cx="36.9" cy="33" rx="2" ry="3.8" fill="#06180c"/><circle cx="24.6" cy="31" r="1.3" fill="#fff"/><circle cx="35.4" cy="31" r="1.3" fill="#fff"/><path d="M20 26 q5 -2 8 0 M35 26 q5 -2 8 0" stroke="#256033" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M31 39 v5 l-5 5 M31 44 l5 5" stroke="#e0537a" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
   ],
   lbl:['Slang-Ei','Kronkelaar','Jonge Adder','Gladde Jager','Brilcobra','Gouden Slang','Oerslang'],
   desc:['Een glad eitje. Er kronkelt al wat binnenin.','Klein maar wendbaar, glijdt door de stof.','Eerste gifttandjes, eerste lastige vragen.','Sluipt geruisloos naar hoge cijfers.','Spreidt zijn schild en hypnotiseert het examen.','Gouden schubben die verblinden. Bijna op de top.','De oerslang met kroon. Wijs, oud en onverslaanbaar.'],
   evoMsg:['🐍 Je slang is uit het ei! Een kronkelend kereltje.','🐍 Eerste gifttandjes! Je Slang glijdt door de stof.','🐍 Gladde jager ontwaakt - geruisloos en scherp.','🐍 BRILCOBRA! Het examen kijkt als gehypnotiseerd toe.','🏅 GOUDEN SLANG! Je schubben glanzen als puur goud.','👑 OERSLANG ONTGRENDELD! De ultieme, gekroonde vorm.']},
  // ── CUSTOM SVG DIEREN ────────────────────────────
  {id:'slijm', n:'Slijm', s:['','','','',''], fallback:['🟢','🟢','💚','💚','👑'],
   svg:[
    // Stadium 0: Piepklein druppeltje, één oog
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="41" rx="11" ry="9" fill="#4ade80"/><path d="M24 36Q27 32 30 31Q33 32 36 36" fill="#4ade80"/><circle cx="30" cy="37" r="2.5" fill="#166534"/><circle cx="31.2" cy="36" r=".9" fill="#fff"/></svg>',
    // Stadium 1: Kleine blob, twee ogen, blij
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M19 44Q13 36 19 27Q24 20 30 20Q36 20 41 27Q47 36 41 44Q36 50 24 49Z" fill="#4ade80"/><circle cx="25" cy="33" r="2.8" fill="#166534"/><circle cx="35" cy="33" r="2.8" fill="#166534"/><circle cx="26" cy="32" r=".9" fill="#fff"/><circle cx="36" cy="32" r=".9" fill="#fff"/><path d="M26 39Q30 42 34 39" stroke="#166534" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
    // Stadium 2: Middelgrote blob, bulk, horentjes
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="22" cy="20" rx="5" ry="6" fill="#22c55e"/><ellipse cx="38" cy="20" rx="5" ry="6" fill="#22c55e"/><path d="M15 46Q9 37 16 27Q22 17 30 17Q38 17 44 27Q51 37 45 46Q38 52 22 52Z" fill="#22c55e"/><circle cx="25" cy="32" r="3.2" fill="#166534"/><circle cx="35" cy="32" r="3.2" fill="#166534"/><circle cx="26.2" cy="30.8" r="1.1" fill="#fff"/><circle cx="36.2" cy="30.8" r="1.1" fill="#fff"/><path d="M25 40Q30 45 35 40" stroke="#166534" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    // Stadium 3: Grote blob met armen
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="9" cy="36" rx="8" ry="5" fill="#16a34a" transform="rotate(-20,9,36)"/><ellipse cx="51" cy="36" rx="8" ry="5" fill="#16a34a" transform="rotate(20,51,36)"/><ellipse cx="21" cy="16" rx="5" ry="6" fill="#16a34a"/><ellipse cx="30" cy="13" rx="5" ry="6" fill="#16a34a"/><ellipse cx="39" cy="16" rx="5" ry="6" fill="#16a34a"/><path d="M13 48Q7 38 13 27Q19 14 30 14Q41 14 47 27Q53 38 47 48Q40 55 20 55Z" fill="#16a34a"/><circle cx="24" cy="30" r="3.5" fill="#166534"/><circle cx="36" cy="30" r="3.5" fill="#166534"/><circle cx="25.2" cy="28.8" r="1.2" fill="#fff"/><circle cx="37.2" cy="28.8" r="1.2" fill="#fff"/><path d="M23 39Q30 45 37 39" stroke="#166534" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
    // Stadium 4: SLIJMKONING met kroon en gouden ogen
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M17 20L21 11L27 18L30 9L33 18L39 11L43 20Z" fill="#fbbf24"/><circle cx="21" cy="11" r="2" fill="#f59e0b"/><circle cx="30" cy="9" r="2.5" fill="#fde68a"/><circle cx="39" cy="11" r="2" fill="#f59e0b"/><ellipse cx="8" cy="38" rx="9" ry="5" fill="#15803d" transform="rotate(-15,8,38)"/><ellipse cx="52" cy="38" rx="9" ry="5" fill="#15803d" transform="rotate(15,52,38)"/><path d="M11 50Q5 39 12 28Q18 16 30 17Q42 16 48 28Q55 39 49 50Q40 57 20 57Z" fill="#15803d"/><circle cx="23" cy="33" r="4" fill="#fde047"/><circle cx="37" cy="33" r="4" fill="#fde047"/><circle cx="23" cy="33" r="2.2" fill="#166534"/><circle cx="37" cy="33" r="2.2" fill="#166534"/><circle cx="24.2" cy="32" r=".9" fill="#fff"/><circle cx="38.2" cy="32" r=".9" fill="#fff"/><path d="M21 42Q30 49 39 42" stroke="#166534" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>'
   ],
   lbl:['Piepklein Druppeltje','Vrolijke Blob','Stevige Slijmbal','Spier-Slijm','Slijmkoning'],
   desc:['Zo klein dat niemand je ziet. Ideaal voor tentamens.','Heeft twee ogen! Ziet nu twee keer zoveel fout.','Heeft horentjes gekregen. Weet zelf niet waarom.','Heeft armen! Maar weet niet wat ermee te doen.','Regeert over alle slijm. En over jouw examen.'],
   evoMsg:['🟢 Je Slijm heeft een oog gekregen! Ziet nu 50% meer.','💚 Je Slijm heeft horentjes! Waarvoor? Niemand weet het.','💚 SPIERSLIJM! Klopt op armen die net zijn verschenen.','👑 SLIJMKONING! Alle slijm buigt voor hem. Inclusief de stof.']},
  {id:'cactus', n:'Cactus', s:['','','','',''], fallback:['🌱','🌱','🌵','🌵','🌵'],
   svg:[
    // Stadium 0: Zaadje
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="42" rx="11" ry="13" fill="#a16207"/><ellipse cx="30" cy="38" rx="8" ry="9" fill="#ca8a04"/><path d="M27 28Q30 21 33 28" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"/><circle cx="30" cy="20" r="3" fill="#4ade80"/></svg>',
    // Stadium 1: Klein sprietje
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="53" rx="9" ry="4" fill="#92400e"/><rect x="28.5" y="30" width="3" height="23" rx="1.5" fill="#16a34a"/><path d="M30 40Q22 38 20 30Q26 32 30 40Z" fill="#22c55e"/><path d="M30 40Q38 38 40 30Q34 32 30 40Z" fill="#22c55e"/><circle cx="30" cy="29" r="3" fill="#4ade80"/></svg>',
    // Stadium 2: Kleine cactus, één arm
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="55" rx="11" ry="4" fill="#92400e"/><rect x="26" y="22" width="8" height="33" rx="4" fill="#15803d"/><rect x="14" y="30" width="12" height="6" rx="3" fill="#15803d"/><rect x="11" y="22" width="6" height="13" rx="3" fill="#15803d"/><circle cx="30" cy="22" r="2" fill="#bbf7d0"/><circle cx="26" cy="27" r="2" fill="#bbf7d0"/><circle cx="34" cy="27" r="2" fill="#bbf7d0"/></svg>',
    // Stadium 3: Twee armen + bloem
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="56" rx="13" ry="4" fill="#92400e"/><rect x="24" y="15" width="12" height="40" rx="6" fill="#15803d"/><rect x="10" y="26" width="14" height="7" rx="3.5" fill="#15803d"/><rect x="7" y="18" width="7" height="13" rx="3.5" fill="#15803d"/><rect x="36" y="30" width="14" height="7" rx="3.5" fill="#15803d"/><rect x="46" y="22" width="7" height="13" rx="3.5" fill="#15803d"/><circle cx="30" cy="12" r="7" fill="#f9a8d4"/><circle cx="24" cy="10" r="4" fill="#f9a8d4"/><circle cx="36" cy="10" r="4" fill="#f9a8d4"/><circle cx="30" cy="12" r="4" fill="#fbbf24"/></svg>',
    // Stadium 4: MEGA CACTUS met zonnebril en kroon
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="57" rx="14" ry="4" fill="#92400e"/><rect x="22" y="11" width="16" height="45" rx="8" fill="#166534"/><rect x="5" y="23" width="17" height="8" rx="4" fill="#166534"/><rect x="2" y="14" width="8" height="15" rx="4" fill="#166534"/><rect x="38" y="27" width="17" height="8" rx="4" fill="#166534"/><rect x="50" y="18" width="8" height="15" rx="4" fill="#166534"/><circle cx="30" cy="9" r="8" fill="#f472b6"/><circle cx="23" cy="7" r="5" fill="#f472b6"/><circle cx="37" cy="7" rx="5" ry="5" fill="#f472b6"/><circle cx="30" cy="9" r="4.5" fill="#fbbf24"/><path d="M20 3L23 -4L26 3L30 -6L34 3L37 -4L40 3Z" fill="#fbbf24" transform="translate(0,7)"/><rect x="21" y="17" width="8" height="5" rx="2" fill="#0f172a"/><rect x="31" y="17" width="8" height="5" rx="2" fill="#0f172a"/><line x1="21" y1="19.5" x2="39" y2="19.5" stroke="#0f172a" stroke-width="2"/></svg>'
   ],
   lbl:['Slapend Zaadje','Piepklein Sprietje','Eigenzinnige Cactus','Bloeiende Held','Zonnebril-Legende'],
   desc:['Ligt in de grond. Denkt na. Heel lang.','Eén sprietje! Al trots op zichzelf.','Heeft een arm gekregen. Wijst naar de goede antwoorden.','Twee armen én bloemen. Absoluut overdressed.','Zonnebril aan, kroon op. Examen? Geen probleem.'],
   evoMsg:['🌱 Je Cactus kiemt! Eén sprietje. Bijzonder.','🌵 Je Cactus heeft een arm! En wijst al.','🌵🌸 BLOEIENDE CACTUS! Zijn bloem ruikt naar succes.','😎🌵 ZONNEBRIL-LEGENDE! De zon kijkt weg van jaloezie.']},
  {id:'robot', n:'Robot', s:['','','','',''], fallback:['🔩','🤖','🤖','🤖','🦾'],
   svg:[
    // Stadium 0: Microchip
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="19" y="19" width="22" height="22" rx="3" fill="#475569"/><rect x="22" y="22" width="16" height="16" rx="2" fill="#0f172a"/><line x1="19" y1="25" x2="13" y2="25" stroke="#94a3b8" stroke-width="2"/><line x1="19" y1="30" x2="13" y2="30" stroke="#94a3b8" stroke-width="2"/><line x1="19" y1="35" x2="13" y2="35" stroke="#94a3b8" stroke-width="2"/><line x1="41" y1="25" x2="47" y2="25" stroke="#94a3b8" stroke-width="2"/><line x1="41" y1="30" x2="47" y2="30" stroke="#94a3b8" stroke-width="2"/><line x1="41" y1="35" x2="47" y2="35" stroke="#94a3b8" stroke-width="2"/><circle cx="27" cy="27" r="2.2" fill="#22d3ee"/><circle cx="33" cy="33" r="2.2" fill="#22d3ee"/><line x1="27" y1="27" x2="33" y2="33" stroke="#22d3ee" stroke-width="1.2"/><circle cx="33" cy="27" r="1.5" fill="#22d3ee" opacity=".5"/><circle cx="27" cy="33" r="1.5" fill="#22d3ee" opacity=".5"/></svg>',
    // Stadium 1: Blokrobot
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="22" y="21" width="16" height="13" rx="3" fill="#64748b"/><rect x="24" y="24" width="5" height="4" rx="1.5" fill="#22d3ee"/><rect x="31" y="24" width="5" height="4" rx="1.5" fill="#22d3ee"/><rect x="22" y="34" width="16" height="14" rx="2" fill="#475569"/><rect x="13" y="36" width="8" height="9" rx="2" fill="#475569"/><rect x="39" y="36" width="8" height="9" rx="2" fill="#475569"/><rect x="24" y="48" width="5" height="8" rx="2" fill="#334155"/><rect x="31" y="48" width="5" height="8" rx="2" fill="#334155"/><line x1="30" y1="19" x2="30" y2="13" stroke="#64748b" stroke-width="2.5"/><circle cx="30" cy="11" r="3.5" fill="#f59e0b"/></svg>',
    // Stadium 2: Robot met echt armen
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="15" width="20" height="16" rx="4" fill="#64748b"/><rect x="22" y="18" width="6" height="5" rx="2" fill="#38bdf8"/><rect x="32" y="18" width="6" height="5" rx="2" fill="#38bdf8"/><rect x="20" y="31" width="20" height="16" rx="3" fill="#475569"/><rect x="8" y="32" width="11" height="7" rx="2.5" fill="#475569"/><rect x="6" y="26" width="5" height="13" rx="2" fill="#334155"/><rect x="41" y="32" width="11" height="7" rx="2.5" fill="#475569"/><rect x="49" y="26" width="5" height="13" rx="2" fill="#334155"/><rect x="23" y="47" width="6" height="10" rx="2" fill="#334155"/><rect x="31" y="47" width="6" height="10" rx="2" fill="#334155"/><line x1="30" y1="13" x2="30" y2="7" stroke="#64748b" stroke-width="2.5"/><circle cx="30" cy="5" r="4" fill="#f97316"/><rect x="25" y="38" width="10" height="3" rx="1" fill="#38bdf8" opacity=".6"/></svg>',
    // Stadium 3: Geavanceerde robot
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="11" width="28" height="18" rx="5" fill="#475569"/><rect x="19" y="15" width="8" height="6" rx="2.5" fill="#d97706"/><rect x="33" y="15" width="8" height="6" rx="2.5" fill="#d97706"/><path d="M27 23L30 26L33 23" fill="#475569"/><rect x="16" y="29" width="28" height="18" rx="4" fill="#334155"/><rect x="5" y="29" width="10" height="9" rx="3" fill="#334155"/><rect x="3" y="23" width="6" height="14" rx="3" fill="#475569"/><rect x="45" y="29" width="10" height="9" rx="3" fill="#334155"/><rect x="51" y="23" width="6" height="14" rx="3" fill="#475569"/><rect x="20" y="47" width="8" height="11" rx="3" fill="#334155"/><rect x="32" y="47" width="8" height="11" rx="3" fill="#334155"/><line x1="30" y1="9" x2="30" y2="3" stroke="#64748b" stroke-width="3"/><rect x="27" y="0" width="6" height="5" rx="1.5" fill="#f97316"/><rect x="22" y="36" width="16" height="4" rx="1.5" fill="#d97706" opacity=".7"/></svg>',
    // Stadium 4: MEGA MECH
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="13" y="5" width="34" height="21" rx="6" fill="#334155"/><rect x="16" y="9" width="10" height="8" rx="3" fill="#0ea5e9"/><rect x="34" y="9" width="10" height="8" rx="3" fill="#0ea5e9"/><line x1="30" y1="3" x2="30" y2="0" stroke="#64748b" stroke-width="3"/><rect x="27" y="-2" width="6" height="5" rx="1.5" fill="#f97316" transform="translate(0,2)"/><rect x="13" y="26" width="34" height="20" rx="5" fill="#1e293b"/><rect x="21" y="34" width="18" height="5" rx="2" fill="#0ea5e9" opacity=".8"/><rect x="2" y="24" width="10" height="10" rx="3" fill="#1e293b"/><rect x="0" y="18" width="6" height="15" rx="3" fill="#334155"/><rect x="48" y="24" width="10" height="10" rx="3" fill="#1e293b"/><rect x="54" y="18" width="6" height="15" rx="3" fill="#334155"/><rect x="17" y="46" width="10" height="13" rx="3" fill="#1e293b"/><rect x="33" y="46" width="10" height="13" rx="3" fill="#1e293b"/><circle cx="20" cy="58" r="4" fill="#f97316"/><circle cx="40" cy="58" r="4" fill="#f97316"/></svg>'
   ],
   lbl:['Saaie Microchip','Blokkerige Beginrobot','Arm-Robot-3000','Geavanceerde Strijder','MEGA MECH ULTIEM'],
   desc:['Klein, vlak en nutteloos. Maar heeft potentie.','Vierkant en trots. Botst tegen deurkozijnen.','Heeft armen! Kan nu ook op de rug kloppen.','Gloeiende ogen. Weet alles. Vertelt het niet.','Brandt op raketlaarzen. Het examen heeft geen kans.'],
   evoMsg:['🔩 Je Robot is geassembleerd! Vierkant maar trots.','🤖 ARMEN! Je Robot kan nu dingen vastpakken. Bijv. een 8.','🤖✨ GEAVANCEERDE ROBOT! Zijn ogen gloeien van kennis.','🦾 MEGA MECH! Start raketlaarzen. Examens vernietigd.']},
  {id:'gorilla', n:'Gorilla', s:['','','','',''], fallback:['🐒','🐒','🦍','🦧','🦍'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="22" rx="8" ry="10" fill="#b45309" stroke="#92400e" stroke-width="2.5"/><ellipse cx="40" cy="22" rx="8" ry="10" fill="#b45309" stroke="#92400e" stroke-width="2.5"/><circle cx="30" cy="35" r="18" fill="#a16207" stroke="#78350f" stroke-width="3"/><ellipse cx="30" cy="43" rx="11" ry="8" fill="#d97706" stroke="#b45309" stroke-width="1.5"/><circle cx="23" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="37" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="23" cy="30" r="3.5" fill="#1a0a00"/><circle cx="37" cy="30" r="3.5" fill="#1a0a00"/><circle cx="22.5" cy="29" r="1.2" fill="white"/><circle cx="36.5" cy="29" r="1.2" fill="white"/><ellipse cx="30" cy="39" rx="3.5" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="24" cy="26" rx="7" ry="4" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="18" cy="18" rx="8" ry="11" fill="#92400e" stroke="#78350f" stroke-width="2.5"/><ellipse cx="42" cy="18" rx="8" ry="11" fill="#92400e" stroke="#78350f" stroke-width="2.5"/><rect x="14" y="14" width="32" height="7" rx="3.5" fill="#78350f" stroke="#1a0a00" stroke-width="1.5"/><circle cx="30" cy="32" r="20" fill="#78350f" stroke="#1a0a00" stroke-width="3"/><ellipse cx="30" cy="43" rx="13" ry="9" fill="#a16207" stroke="#92400e" stroke-width="1.5"/><circle cx="22" cy="28" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="28" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="28" r="3.5" fill="#1a0a00"/><circle cx="38" cy="28" r="3.5" fill="#1a0a00"/><circle cx="21.5" cy="27" r="1.2" fill="white"/><circle cx="37.5" cy="27" r="1.2" fill="white"/><ellipse cx="30" cy="39" rx="4" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="23" cy="23" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="16" rx="8" ry="11" fill="#44403c" stroke="#1a0a00" stroke-width="2.5"/><ellipse cx="44" cy="16" rx="8" ry="11" fill="#44403c" stroke="#1a0a00" stroke-width="2.5"/><rect x="12" y="12" width="36" height="8" rx="4" fill="#1c1917" stroke="#1a0a00" stroke-width="2"/><circle cx="30" cy="30" r="21" fill="#292524" stroke="#1a0a00" stroke-width="3"/><ellipse cx="30" cy="43" rx="14" ry="10" fill="#44403c" stroke="#292524" stroke-width="1.5"/><circle cx="22" cy="27" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="27" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="27" r="4" fill="#1a0a00"/><circle cx="38" cy="27" r="4" fill="#1a0a00"/><circle cx="21.5" cy="26" r="1.5" fill="white"/><circle cx="37.5" cy="26" r="1.5" fill="white"/><ellipse cx="30" cy="39" rx="4" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><path d="M5 38 Q2 30 8 26" stroke="#292524" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M55 38 Q58 30 52 26" stroke="#292524" stroke-width="8" stroke-linecap="round" fill="none"/><ellipse cx="23" cy="22" rx="9" ry="4.5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="15" cy="16" rx="8" ry="12" fill="#ea580c" stroke="#c2410c" stroke-width="2.5"/><ellipse cx="45" cy="16" rx="8" ry="12" fill="#ea580c" stroke="#c2410c" stroke-width="2.5"/><circle cx="30" cy="30" r="22" fill="#c2410c" stroke="#7c2d12" stroke-width="3"/><ellipse cx="30" cy="43" rx="15" ry="10" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/><circle cx="22" cy="27" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="27" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="27" r="4" fill="#431407"/><circle cx="38" cy="27" r="4" fill="#431407"/><circle cx="22" cy="27" r="2" fill="#1a0a00"/><circle cx="38" cy="27" r="2" fill="#1a0a00"/><circle cx="21.5" cy="26" r="1" fill="white"/><circle cx="37.5" cy="26" r="1" fill="white"/><ellipse cx="30" cy="39" rx="4.5" ry="3.5" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><path d="M4 40 Q2 30 8 24" stroke="#c2410c" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M56 40 Q58 30 52 24" stroke="#c2410c" stroke-width="9" stroke-linecap="round" fill="none"/><ellipse cx="23" cy="21" rx="9" ry="4.5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M14 8 L18 2 L22 8 L26 3 L30 8 L34 3 L38 8 L42 2 L46 8Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><ellipse cx="13" cy="15" rx="8" ry="12" fill="#292524" stroke="#1a0a00" stroke-width="2.5"/><ellipse cx="47" cy="15" rx="8" ry="12" fill="#292524" stroke="#1a0a00" stroke-width="2.5"/><rect x="11" y="11" width="38" height="8" rx="4" fill="#0c0a09" stroke="#1a0a00" stroke-width="2"/><circle cx="30" cy="30" r="22" fill="#1c1917" stroke="#0c0a09" stroke-width="3"/><ellipse cx="30" cy="43" rx="15" ry="11" fill="#292524" stroke="#1c1917" stroke-width="1.5"/><rect x="14" y="35" width="32" height="8" rx="4" fill="#d1d5db" stroke="#94a3b8" stroke-width="1.5" opacity="0.75"/><circle cx="21" cy="26" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="26" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="26" r="4.5" fill="#1c1917"/><circle cx="39" cy="26" r="4.5" fill="#1c1917"/><circle cx="20.5" cy="25" r="1.8" fill="#ef4444"/><circle cx="38.5" cy="25" r="1.8" fill="#ef4444"/><ellipse cx="30" cy="39" rx="4.5" ry="3.5" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><path d="M3 42 Q1 30 8 22" stroke="#1c1917" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M57 42 Q59 30 52 22" stroke="#1c1917" stroke-width="10" stroke-linecap="round" fill="none"/><ellipse cx="23" cy="21" rx="10" ry="5" fill="white" opacity="0.18"/></svg>'
   ],
   lbl:['Hyper Aapje','Klimmend Jonkie','Borstklopende Gorilla','Superieure Orang-oetan','Silverback-Legende'],
   desc:['Trekt aan alles. Inclusief de studieplannen.','Klimt van onderwerp naar onderwerp.','Klopt op zijn borst na elk goed antwoord. Terecht.','Denkt dieper na dan de vraagsteller. Problematisch.','Zit boven in de boom der kennis. Kijkt neer op twijfel.'],
   evoMsg:['🐒 Je Gorilla zwaait van tak tot tak!','🦍 Je Gorilla groeit! Klopt al op z\'n borst.','🦧 ORANG-OETAN! Intelligent en oranje. Gevaarlijke combo.','🦍 SILVERBACK-LEGENDE! Alle gorilla\'s buigen voor hem.']},
];
const ANIM_THRESHOLDS=[0,500,1000,2500,10000,20000,30000];
const ANIM_STAGE_NAMES=['Baby','Jong','Tiener','Volwassen','Prime','Goud','Ultiem'];
// Soort-eigen idle-beweging per mascotte (CSS-klassen in styles.css)
const ANIMAL_MOVE={
  adelaar:'amv-fly', uil:'amv-fly', draak:'amv-fly',
  vlinder:'amv-flutter', eekhoorn:'amv-flutter',
  haai:'amv-swim',
  octopus:'amv-drift', slijm:'amv-drift',
  slang:'amv-slither',
  leeuw:'amv-prowl', tijger:'amv-prowl', wolf:'amv-prowl', vos:'amv-prowl',
  beer:'amv-prowl', gorilla:'amv-prowl', olifant:'amv-prowl', eenhoorn:'amv-prance',
  cactus:'amv-sway', robot:'amv-mech'
};
let selectedAnimalId=null;

function getAnimalById(id){return ANIMAL_EVOLUTIONS.find(a=>a.id===id)||null;}
function getAnimalStageIdx(totalXP){
  let idx=0;
  for(let i=ANIM_THRESHOLDS.length-1;i>=0;i--){if(totalXP>=ANIM_THRESHOLDS[i]){idx=i;break;}}
  return idx;
}
function getAnimalEmoji(animalId,totalXP){
  const a=getAnimalById(animalId);
  if(!a)return'🐾';
  const idx=getAnimalStageIdx(totalXP);
  // Custom SVG dieren: gebruik fallback emoji
  if(a.svg)return a.fallback?.[Math.min(idx,a.fallback.length-1)]||a.fallback?.[0]||'⭐';
  return a.s[Math.min(idx,a.s.length-1)];
}
// Geeft HTML terug: SVG voor custom dieren, emoji-span voor normale
function getAnimalDisplay(animalId,stageIdx,size){
  size=size||48;
  const a=getAnimalById(animalId);
  if(!a)return'<span style="font-size:'+size+'px">🐾</span>';
  // Ultiem (laatste rang) krijgt een subtiele klasse-hook voor extra glans
  // (géén metaal-ring meer — de ultieme vorm onderscheidt zich door zijn eigen art).
  // Twee toptiers: Goud (voorlaatste) = vergulde mascotte, Ultiem (laatste) =
  // stralende "ascended" vorm. Beide gebruiken de hoogste art met eigen behandeling.
  const _topIdx=ANIM_THRESHOLDS.length-1;
  let tierCls='';
  if(stageIdx>=_topIdx)tierCls=' anim-ascend';
  else if(stageIdx===_topIdx-1)tierCls=' anim-goud';
  // Soort-eigen idle-beweging (alleen op grotere avatars; pips/nav blijven stil)
  const moveCls=(size>=44&&typeof ANIMAL_MOVE!=='undefined'&&ANIMAL_MOVE[animalId])?(' '+ANIMAL_MOVE[animalId]):'';
  if(a.svg){
    const svgIdx=Math.min(stageIdx,a.svg.length-1);
    if(a.svg[svgIdx]){
      return'<span class="anim-svg-wrap'+tierCls+moveCls+'" style="width:'+size+'px;height:'+size+'px">'+a.svg[svgIdx]+'</span>';
    }
  }
  const sIdx=Math.min(stageIdx,a.s.length-1);
  return'<span style="font-size:'+size+'px;line-height:1">'+a.s[sIdx]+'</span>';
}
function buildRegisterAnimalPicker(){
  const grid=document.getElementById('reg-animal-grid');
  if(!grid)return;
  grid.innerHTML='';
  ANIMAL_EVOLUTIONS.forEach(a=>{
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='anim-pick-btn';
    btn.innerHTML=`<span class="anim-pick-emoji">${a.svg?getAnimalDisplay(a.id,0,36):a.s[0]}</span><span class="anim-pick-name">${a.n}</span>`;
    btn.onclick=()=>{
      selectedAnimalId=a.id;
      document.querySelectorAll('.anim-pick-btn').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
    };
    grid.appendChild(btn);
  });
}
function renderAnimalEvoSection(animalId,totalXP){
  const sec=document.getElementById('anim-evo-section');
  if(!sec)return;
  if(!animalId){
    sec.innerHTML=`
      <div class="prof-section-title" style="margin-bottom:6px">Kies je startdier</div>
      <div class="prof-section-sub" style="margin-bottom:10px">Je dier evolueert automatisch naarmate je XP verdient. <strong>Je kunt later niet meer wisselen!</strong></div>
      <div class="anim-pick-grid" id="prof-animal-grid"></div>
      <div class="anim-warn">⚠️ <strong>Let op:</strong> na opslaan is je keuze definitief.</div>`;
    const grid=document.getElementById('prof-animal-grid');
    ANIMAL_EVOLUTIONS.forEach(a=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='anim-pick-btn';
      btn.innerHTML=`<span class="anim-pick-emoji">${a.svg?getAnimalDisplay(a.id,0,36):a.s[0]}</span><span class="anim-pick-name">${a.n}</span>`;
      btn.onclick=()=>{
        selectedAnimalId=a.id;
        selectedAvatar=a.s[0];
        document.querySelectorAll('#prof-animal-grid .anim-pick-btn').forEach(b=>b.classList.remove('selected'));
        btn.classList.add('selected');
      };
      grid.appendChild(btn);
    });
    return;
  }
  const a=getAnimalById(animalId);
  if(!a){sec.innerHTML='';return;}
  const stageIdx=getAnimalStageIdx(totalXP);
  const isMaxed=stageIdx===ANIM_THRESHOLDS.length-1;
  const nextThreshold=isMaxed?null:ANIM_THRESHOLDS[stageIdx+1];
  const prevThreshold=ANIM_THRESHOLDS[stageIdx];
  const pct=isMaxed?100:Math.round(Math.min(100,(totalXP-prevThreshold)/(nextThreshold-prevThreshold)*100));
  let stagesHtml='';
  for(let i=0;i<ANIM_THRESHOLDS.length;i++){
    const emoji=a.s[Math.min(i,a.s.length-1)];
    const isDone=i<stageIdx;
    const isCurrent=i===stageIdx;
    const cls=isDone?'done':isCurrent?'current':'';
    const reqTxt=i===0?'Start':ANIM_THRESHOLDS[i].toLocaleString('nl')+' XP';
    const stageLbl=(a.lbl&&a.lbl[i])||ANIM_STAGE_NAMES[i];
    const pipContent=a.svg
      ?getAnimalDisplay(a.id,i,36)
      :`<span style="font-size:32px;line-height:1;${!isDone&&!isCurrent?'filter:grayscale(.6);opacity:.5':''}">${emoji}</span>`;
    stagesHtml+=`<div class="anim-stage ${cls}" title="${a.desc?a.desc[Math.min(i,a.desc.length-1)]:''}">
      <div class="anim-stage-pip" style="${!isDone&&!isCurrent&&a.svg?'opacity:.45;filter:grayscale(.7)':''}">${pipContent}</div>
      <div class="anim-stage-label">${stageLbl}</div>
      <div class="anim-stage-req">${reqTxt}</div>
    </div>`;
  }
  const curLbl=(a.lbl&&a.lbl[stageIdx])||ANIM_STAGE_NAMES[stageIdx];
  const curDesc=a.desc?a.desc[Math.min(stageIdx,a.desc.length-1)]:'';
  const nextLbl=!isMaxed?((a.lbl&&a.lbl[stageIdx+1])||ANIM_STAGE_NAMES[stageIdx+1]):'';

  const progressHtml=isMaxed
    ?`<div style="font-size:12px;color:var(--or);font-weight:700;text-align:center">🏆 Maximaal stadium bereikt! Je ${a.n} is een legende.</div>`
    :`<div class="anim-evo-prog-bar"><div class="anim-evo-prog-fill" style="width:${pct}%"></div></div>
      <div class="anim-evo-prog-txt">${totalXP.toLocaleString('nl')} / ${nextThreshold.toLocaleString('nl')} XP → ${!a.svg&&a.s[stageIdx+1]?a.s[stageIdx+1]+' ':''}${nextLbl}</div>`;
  const bigDisplay=getAnimalDisplay(a.id,stageIdx,52);
  sec.innerHTML=`<div class="anim-evo-card">
    <div class="anim-evo-title">${bigDisplay} ${a.n} <button class="anim-change-btn" onclick="toggleAnimalPicker()" title="Verander dier">🔄 Wisselen</button></div>
    <div class="anim-evo-subtitle">${curLbl} · ${totalXP.toLocaleString('nl')} XP totaal</div>
    ${curDesc?`<div style="font-size:13px;color:var(--mu);font-style:italic;margin:4px 0 10px;text-align:center">"${curDesc}"</div>`:''}
    <div class="anim-evo-stages">${stagesHtml}</div>
    <div class="anim-evo-progress">${progressHtml}</div>
    <div id="animal-picker-inline" style="display:none;margin-top:14px">
      <div style="font-size:12px;color:var(--mu);margin-bottom:10px;text-align:center">Kies een nieuw dier - je evolutiestadium blijft behouden</div>
      <div class="anim-pick-grid" id="prof-animal-switch-grid"></div>
      <button onclick="saveAnimalChoice()" style="width:100%;margin-top:10px;padding:12px;background:var(--or);color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font)">Opslaan</button>
    </div>
  </div>`;
}

function buildAvatarPicker(current){
  // Legacy - now handled by animal evolution system
}

function toggleAnimalPicker(){
  const p=document.getElementById('animal-picker-inline');
  if(!p)return;
  const visible=p.style.display!=='none';
  if(!visible){
    // Bouw switcher grid als nog leeg
    const grid=document.getElementById('prof-animal-switch-grid');
    if(grid&&!grid.children.length){
      const prof=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
      const curId=prof.animalId;
      const stageIdx=getAnimalStageIdx(getTotalXP());
      ANIMAL_EVOLUTIONS.forEach(a=>{
        const btn=document.createElement('button');
        btn.type='button';
        btn.className='anim-pick-btn'+(a.id===curId?' selected':'');
        btn.innerHTML=`<span class="anim-pick-emoji">${getAnimalDisplay(a.id,stageIdx,36)}</span><span class="anim-pick-name">${a.n}</span>`;
        btn.onclick=()=>{
          selectedAnimalId=a.id;
          document.querySelectorAll('#prof-animal-switch-grid .anim-pick-btn').forEach(b=>b.classList.remove('selected'));
          btn.classList.add('selected');
        };
        grid.appendChild(btn);
      });
      // Zet selectedAnimalId op huidige
      selectedAnimalId=curId;
    }
  }
  p.style.display=visible?'none':'block';
}

async function saveAnimalChoice(){
  if(!selectedAnimalId)return;
  const prof=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  prof.animalId=selectedAnimalId;
  prof.avatar=getAnimalEmoji(selectedAnimalId,0);
  localStorage.setItem(PROF_KEY,JSON.stringify(prof));
  if(currentUser)cloudSet('profiel',prof);
  syncAvatarToProfile();
  // Herrender de sectie
  const xp=getTotalXP();
  renderAnimalEvoSection(selectedAnimalId,xp);
  renderXPHome();
  updateProfileNav();
  showToast('✅ Dier gewijzigd naar '+ANIMAL_EVOLUTIONS.find(a=>a.id===selectedAnimalId)?.n,'#4ADE80',3000);
}

function loadProfile(){
  let p={};
  try{p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');}catch(e){p={};}
  const set=(id,val)=>{const el=document.getElementById(id);if(el)el.value=val;};
  if(p.naam){set('pf-naam',p.naam);}
  if(p.school)set('pf-school',p.school);
  if(p.klas)set('pf-klas',p.klas);
  if(p.profiel)set('pf-profiel',p.profiel);
  // Animal evolution
  const animalId=p.animalId||null;
  selectedAnimalId=animalId;
  const totalXP=getTotalXP();
  if(animalId){
    selectedAvatar=getAnimalEmoji(animalId,totalXP);
  } else {
    selectedAvatar=p.avatar||'🐾';
  }
  renderAnimalEvoSection(animalId,totalXP);
}

async function saveProfileData(){
  const get=(id)=>document.getElementById(id)?.value||'';
  let p={};
  try{p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');}catch(e){p={};}
  const totalXP=getTotalXP();
  // Animal: only set if not already locked
  const lockedAnimalId=p.animalId||null;
  const newAnimalId=lockedAnimalId||(selectedAnimalId||null);
  const computedAvatar=newAnimalId?getAnimalEmoji(newAnimalId,totalXP):(selectedAvatar||'🐾');
  const updated={
    naam:get('pf-naam').trim(),
    school:get('pf-school').trim(),
    klas:get('pf-klas'),
    profiel:get('pf-profiel'),
    avatar:computedAvatar,
    animalId:newAnimalId,
  };
  await cloudSet('profiel',updated);
  selectedAnimalId=newAnimalId;
  selectedAvatar=computedAvatar;
  renderAnimalEvoSection(newAnimalId,totalXP);
  const msg=document.getElementById('pf-saved-msg');
  if(msg){msg.classList.add('show');setTimeout(()=>msg.classList.remove('show'),2500);}
  updateProfileNav();
}

function getSavedCijfers(){
  try{return JSON.parse(localStorage.getItem('examenapp_'+lvlCol('cijfers'))||'{}');}
  catch(e){return {};}
}

function buildCijferGrid(){
  const saved=getSavedCijfers();
  const grid=document.getElementById('cijfer-grid');
  grid.innerHTML='';
  getVK().forEach(v=>{
    const val=saved[v.id]||'';
    const div=document.createElement('div');
    div.className='cijfer-item';
    div.innerHTML=`<div class="cijfer-vak"><div class="cijfer-dot" style="background:${v.kleur}"></div>${v.naam}</div>
      <input class="cijfer-input${val?(' has-val'):''}" id="ci-${v.id}" type="number" min="1" max="10" step="0.1" value="${val}" placeholder="—" oninput="this.classList.toggle('has-val',this.value!=='')" />
      <div class="cijfer-label">SE-cijfer</div>`;
    grid.appendChild(div);
  });
  setTimeout(showCijferTuto,350);
}

function saveCijfers(){
  const saved={};
  getVK().forEach(v=>{
    const inp=document.getElementById('ci-'+v.id);
    if(inp&&inp.value!==''){
      const n=parseFloat(inp.value.replace(',','.'));
      if(!isNaN(n)&&n>=1&&n<=10)saved[v.id]=Math.round(n*10)/10;
    }
  });
  cloudSet(lvlCol('cijfers'),saved);
  try{pushSyncBundle();}catch(e){}
  buildGrid();
  const msg=document.getElementById('cijfer-saved-msg');
  msg.classList.add('show');
  setTimeout(()=>msg.classList.remove('show'),2500);
}

function toggleImportPanel(app){
  const magPanel=document.getElementById('imp-panel-magister');
  const somPanel=document.getElementById('imp-panel-somtoday');
  const magBtn=document.getElementById('imp-btn-mag');
  const somBtn=document.getElementById('imp-btn-som');
  if(app==='magister'){
    const showing=magPanel.classList.contains('show');
    magPanel.classList.toggle('show',!showing);
    somPanel.classList.remove('show');
    magBtn.classList.toggle('active',!showing);
    somBtn.classList.remove('active');
  }else{
    const showing=somPanel.classList.contains('show');
    somPanel.classList.toggle('show',!showing);
    magPanel.classList.remove('show');
    somBtn.classList.toggle('active',!showing);
    magBtn.classList.remove('active');
  }
}

function parseCijferText(text){
  const found={};

  function toGrade(s){
    if(!s)return null;
    const n=parseFloat(String(s).replace(',','.'));
    return(!isNaN(n)&&n>=1&&n<=10)?Math.round(n*10)/10:null;
  }

  // ── Normaliseer ──────────────────────────────────────────────────
  let t=text
    .replace(/\r\n/g,'\n').replace(/\r/g,'\n')
    .replace(/\u00a0/g,' ')
    .replace(/\u200b|\u200c|\u200d|\ufeff/g,'')
    // Plak tab als spatie (sommige exports gebruiken tabs)
    .replace(/\t/g,'  ')
    // Splits "NederlandsSE7,8" → "Nederlands\nSE7,8"
    .replace(/([a-zA-Z\u00c0-\u024f])(SE\s*\d)/gi,'$1\n$2');

  const lines=t.split('\n').map(l=>l.trim()).filter(Boolean);

  // ── STRATEGIE 1: vak + cijfer op dezelfde regel ──────────────────
  // Herkent: "Biologie 7,8"  "Biologie: 7,8"  "Biologie | 7,8"
  //          "Biologie SE7,8"  "Biologie SE 7,8"  "Biologie  7,8  SE1 7,5"
  for(const line of lines){
    // Splits op scheidingstekens (|, ;, :) en probeer vak in deel 0, cijfer in rest
    const parts=line.split(/\s*[|;:]\s*/);
    if(parts.length>=2){
      const vid=matchVakNaam(parts[0]);
      if(vid&&!found[vid]){
        for(let i=1;i<parts.length;i++){
          const raw=parts[i].replace(/^SE\s*/i,'').trim();
          const g=toGrade((raw.match(/^[\d,.]+/))||null);
          if(g){found[vid]=g;break;}
        }
      }
    }

    // "VakNaam   7,8" (≥2 spaties als scheiding of einde van regel)
    const mSpace=line.match(/^(.+?)\s{2,}(\d{1,2}[,.]\d)\s*(?:SE.*)?$/);
    if(mSpace){
      const vid=matchVakNaam(mSpace[1].replace(/\bSE\b.*/gi,'').trim());
      if(vid&&!found[vid]){const g=toGrade(mSpace[2]);if(g)found[vid]=g;}
    }

    // "VakNaam SE7,8" of "VakNaam SE 7,8"
    const mSE=line.match(/^(.+?)\s+SE\s*(\d{1,2}[,.]\d)\b/i);
    if(mSE){
      const vid=matchVakNaam(mSE[1]);
      if(vid&&!found[vid]){const g=toGrade(mSE[2]);if(g)found[vid]=g;}
    }

    // Regel eindigt op cijfer: "Biologie 7,8" (1 spatie)
    const mEnd=line.match(/^(.+?)\s(\d{1,2}[,.]\d)\s*$/);
    if(mEnd){
      const vid=matchVakNaam(mEnd[1].replace(/\bSE\b.*/gi,'').trim());
      if(vid&&!found[vid]){const g=toGrade(mEnd[2]);if(g)found[vid]=g;}
    }
  }

  // ── STRATEGIE 2: vak op één regel, cijfer op volgende regels ─────
  for(let i=0;i<lines.length;i++){
    const vid=matchVakNaam(lines[i]);
    if(!vid)continue;

    for(let j=i+1;j<=i+6&&j<lines.length;j++){
      const nx=lines[j];
      if(matchVakNaam(nx))break; // nieuw vak gevonden

      // "SE 8,4" of "SE8,4" of "SE: 8,4"
      const seM=nx.match(/\bSE\s*:?\s*([0-9]{1,2}[,.]?[0-9]+)\b/i);
      if(seM){const g=toGrade(seM[1]);if(g&&!found[vid]){found[vid]=g;i=j;}break;}

      // Puur cijfer op eigen regel: "8,4" of "8.4" of "10"
      const barM=nx.match(/^([0-9]{1,2}[,.][0-9]|10)\s*$/);
      if(barM){const g=toGrade(barM[1]);if(g&&!found[vid]){found[vid]=g;i=j;}break;}
    }
  }

  return found;
}

// Tijdelijk opslaan van geparste import voor preview-bevestiging
let _pendingImport=null;

function doImport(app){
  const resultId=app==='unified'?'imp-result-unified':('imp-result-'+app);
  const textareaId=app==='unified'?'imp-paste-unified':('imp-paste-'+app);
  const textarea=document.getElementById(textareaId);
  const result=document.getElementById(resultId);
  const text=textarea.value.trim();

  if(!text){
    result.innerHTML='<strong>Plak eerst tekst</strong> van Magister of SomToday hierboven.';
    result.className='import-result err';return;
  }

  const parsed=parseCijferText(text);
  const keys=Object.keys(parsed);

  if(keys.length===0){
    result.innerHTML=`<strong>Geen cijfers herkend.</strong><br>
Tips:<br>
• Kopieer de <em>volledige</em> pagina: <kbd>Ctrl+A</kbd> → <kbd>Ctrl+C</kbd><br>
• Zorg dat je op de <strong>cijferpagina</strong> staat (niet het dashboard)<br>
• Probeer zowel Magister als SomToday`;
    result.className='import-result err';return;
  }

  // Sla op voor bevestiging
  _pendingImport=parsed;

  // Toon preview met bevestigknop
  const rows=keys.map(k=>{
    const naam=getVK().find(v=>v.id===k)?.naam||k;
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.07)">
      <span style="font-weight:600">${naam}</span>
      <span style="font-size:18px;font-weight:800;color:var(--or)">${parsed[k]}</span>
    </div>`;
  }).join('');

  result.innerHTML=`
    <div style="font-weight:700;margin-bottom:8px">✅ ${keys.length} vak${keys.length===1?'':'ken'} herkend - klopt dit?</div>
    <div style="margin-bottom:12px">${rows}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="import-go-btn" style="flex:1;min-width:140px" onclick="doImportConfirm('${app}')">💾 Ja, sla op</button>
      <button class="import-go-btn" style="flex:1;min-width:100px;background:transparent;border:1.5px solid var(--or);color:var(--or)" onclick="document.getElementById('${resultId}').innerHTML='';_pendingImport=null">✕ Annuleer</button>
    </div>`;
  result.className='import-result ok';
}

function doImportConfirm(app){
  if(!_pendingImport)return;
  const resultId=app==='unified'?'imp-result-unified':('imp-result-'+app);
  const textareaId=app==='unified'?'imp-paste-unified':('imp-paste-'+app);
  const result=document.getElementById(resultId);
  const textarea=document.getElementById(textareaId);
  const keys=Object.keys(_pendingImport);
  const existing=getSavedCijfers();
  const merged={...existing,..._pendingImport};
  cloudSet(lvlCol('cijfers'),merged);
  try{pushSyncBundle();}catch(e){}
  buildCijferGrid();
  buildGrid();
  result.innerHTML=`✓ <strong>${keys.length} vak${keys.length===1?'':'ken'}</strong> opgeslagen: ${keys.map(k=>getVK().find(v=>v.id===k)?.naam||k).join(', ')}`;
  result.className='import-result ok';
  textarea.value='';
  _pendingImport=null;
}

function updateProfileNav(){
  const btn=document.getElementById('home-prof-btn');
  const bnavIcon=document.getElementById('bnav-profiel-icon');
  const bnavLabel=document.getElementById('bnav-profiel-label');
  const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  const liveAvatar=getMyCurrentAvatar();
  const _sbSession=Object.keys(localStorage).some(k=>k.startsWith('sb-')&&k.includes('auth'));
  const isLoggedIn=!!(currentUser||localStorage.getItem('slagio_li')||_sbSession);
  // authConfirmed = we weten zeker dat iemand NIET ingelogd is (onAuthStateChange heeft gefired zonder user)
  const authConfirmed=typeof _authReady!=='undefined'&&_authReady&&!currentUser&&!_sbSession&&!localStorage.getItem('slagio_li');

  const _genericProfileSvgLg=`<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  const _genericProfileSvgSm=`<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  const _loginSvgLg=`<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`;
  const _loginSvgSm=`<svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`;

  // ── Desktop top-right knop ──
  if(btn){
    btn.style.visibility='';
    if(isLoggedIn){
      btn.className='hnav-icon-btn';
      if(p.naam&&liveAvatar!=='🐾'){
        btn.dataset.tip=p.naam.split(' ')[0];
        btn.innerHTML=`<div class="dock-avatar" style="font-size:16px;background:transparent">${liveAvatar}</div>`;
      }else if(p.naam){
        const ini=p.naam.trim().split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
        btn.dataset.tip=p.naam.split(' ')[0];
        btn.innerHTML=`<div class="dock-avatar dock-avatar-ini">${ini}</div>`;
      }else{
        btn.dataset.tip='Profiel';
        btn.innerHTML=_genericProfileSvgLg;
      }
    }else if(authConfirmed){
      btn.className='hnav-icon-btn hnav-login-cta';
      btn.dataset.tip='';
      btn.setAttribute('aria-label','Inloggen');
      btn.innerHTML=_loginSvgLg+'Inloggen';
    }else{
      // Auth state onbekend (nog niet geladen) - toon generiek profiel-icoon, geen Inloggen-flash
      btn.className='hnav-icon-btn';
      btn.dataset.tip='Profiel';
      btn.innerHTML=_genericProfileSvgLg;
    }
  }

  // ── Mobiele bottom nav knop ──
  if(bnavIcon&&bnavLabel){
    if(isLoggedIn){
      if(p.naam&&liveAvatar!=='🐾'){
        bnavIcon.innerHTML=`<span style="font-size:20px;line-height:1">${liveAvatar}</span>`;
        bnavLabel.textContent=p.naam.split(' ')[0];
      }else if(p.naam){
        const ini=p.naam.trim().split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
        bnavIcon.innerHTML=`<div class="dock-avatar dock-avatar-ini" style="width:26px;height:26px;font-size:11px">${ini}</div>`;
        bnavLabel.textContent=p.naam.split(' ')[0];
      }else{
        bnavIcon.innerHTML=_genericProfileSvgSm;
        bnavLabel.textContent='Profiel';
      }
    }else if(authConfirmed){
      bnavIcon.innerHTML=_loginSvgSm;
      bnavLabel.textContent='Inloggen';
    }else{
      // Auth state onbekend - generiek icoon, geen Inloggen-flash
      bnavIcon.innerHTML=_genericProfileSvgSm;
      bnavLabel.textContent='Profiel';
    }
  }
}

function openProfiel(){
  if(!currentUser){
    // Auth nog aan het laden - wacht op _onAuthReady callback
    _onAuthReady(user=>{
      if(user)openProfiel();
      else _showAccountPrompt(
        'Account nodig',
        'Maak een gratis account aan om je profiel te zien, voortgang te synchroniseren en op het leaderboard te verschijnen.'
      );
    });
    return;
  }
  loadProfile();
  buildCijferGrid();
  updateCloudStatusBar();
  buildMijnStats();
  renderProfileBadges();
  renderNotifStatus();
  applyAccPrefs();
  show('sc-profiel');
}

function buildMijnStats(){
  const el=document.getElementById('mijn-stats-content');
  if(!el)return;
  const prof=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  const myNaam=prof.naam||null;
  if(!myNaam){el.innerHTML='<p style="color:var(--mu);font-size:13px">Sla eerst je naam op om statistieken bij te houden.</p>';return;}
  // Gather all my entries (both levels)
  const entriesH=JSON.parse(localStorage.getItem('examenapp_leaderboard_havo')||'[]');
  const entriesV=JSON.parse(localStorage.getItem('examenapp_leaderboard_vwo')||'[]');
  const mine=[...entriesH,...entriesV].filter(e=>!e.isBot&&e.naam===myNaam);
  if(!mine.length){el.innerHTML='<p style="color:var(--mu);font-size:13px">Maak eerst een quiz om statistieken te zien.</p>';return;}
  // Aggregate
  const bestScore=Math.max(...mine.map(e=>e.score));
  const totalGoed=mine.reduce((s,e)=>s+(e.goed||0),0);
  const totalTot=mine.reduce((s,e)=>s+(e.tot||0),0);
  const accuracy=totalTot>0?Math.round(totalGoed/totalTot*100):0;
  const avgSpeed=+(mine.reduce((s,e)=>s+(e.avgTijd||0),0)/mine.length).toFixed(1);
  const totalQuizzes=mine.length;
  // Streak from localStorage
  const streakKey='examenapp_streak';
  const streakData=JSON.parse(localStorage.getItem(streakKey)||'{}');
  const streak=streakData.current||0;
  // Fav subject
  const vakMap={};mine.forEach(e=>{vakMap[e.vakNaam]=(vakMap[e.vakNaam]||0)+1;});
  const favVak=Object.entries(vakMap).sort((a,b)=>b[1]-a[1])[0]?.[0]||'–';
  // Best per vak
  const bestPerVak={};
  mine.forEach(e=>{if(!bestPerVak[e.vakNaam]||e.score>bestPerVak[e.vakNaam].score)bestPerVak[e.vakNaam]=e;});
  const topVakken=Object.values(bestPerVak).sort((a,b)=>b.score-a.score).slice(0,4);
  // Tier
  function tierLabel(s){if(s>=850)return'🏆 Elite';if(s>=650)return'⚡ Expert';if(s>=400)return'📚 Gevorderd';if(s>=150)return'✏️ Leerling';return'🌱 Beginner';}
  function tierCls(s){if(s>=850)return'lb-tier-elite';if(s>=650)return'lb-tier-expert';if(s>=400)return'lb-tier-gevorderd';if(s>=150)return'lb-tier-leerling';return'lb-tier-beginner';}
  const vakHtml=topVakken.map(e=>`<div class="ms-vak-row"><span class="ms-vak-naam">${e.vakNaam}${e.domeinId?` · D${e.domeinId}`:''}</span><span style="display:flex;align-items:center;gap:8px"><span style="font-size:11px;color:var(--mu)">${e.goed||0}/${e.tot||0} goed</span><span class="ms-vak-score">${e.score} pts</span></span></div>`).join('');
  el.innerHTML=`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <span class="lb-niveau-chip">${APP_LEVEL.toUpperCase()}</span>
      <span class="lb-tier ${tierCls(bestScore)}">${tierLabel(bestScore)}</span>
    </div>
    <div class="ms-grid">
      <div class="ms-card">
        <div class="ms-val">${bestScore}</div>
        <div class="ms-lbl">⚡ Beste score</div>
        <div class="ms-bar-wrap"><div class="ms-bar" style="width:${bestScore/10}%"></div></div>
      </div>
      <div class="ms-card">
        <div class="ms-val">${accuracy}%</div>
        <div class="ms-lbl">🎯 Nauwkeurigheid</div>
        <div class="ms-bar-wrap"><div class="ms-bar" style="width:${accuracy}%"></div></div>
      </div>
      <div class="ms-card">
        <div class="ms-val">${totalQuizzes}</div>
        <div class="ms-lbl">📋 Quizzes gespeeld</div>
      </div>
      <div class="ms-card">
        <div class="ms-val">${streak}</div>
        <div class="ms-lbl">🔥 Dagstreak</div>
      </div>
    </div>
    <div class="ms-row"><span class="ms-key">⏱ Gem. reactietijd</span><span class="ms-val2">${avgSpeed}s per vraag</span></div>
    <div class="ms-row"><span class="ms-key">✅ Totaal goed</span><span class="ms-val2">${totalGoed} / ${totalTot} vragen</span></div>
    <div class="ms-row"><span class="ms-key">❤️ Favoriete vak</span><span class="ms-val2">${favVak}</span></div>
    ${topVakken.length?`<p style="font-size:10px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px">Beste quizzes</p><div style="display:flex;flex-direction:column;gap:6px">${vakHtml}</div>`:''}
  `;
}

function prefillCalcFromSaved(){
  buildSlaagInputs();
  buildEindVakSelect();
  buildNtermVakSelect();
  buildHerkSelect();
  const firstId=document.getElementById('herk-vak')?.value;
  if(firstId)buildHerkSERow(firstId);
}

