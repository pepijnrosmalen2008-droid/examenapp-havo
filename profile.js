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
  {id:'adelaar', n:'Adelaar', s:['','','','',''], fallback:['🥚','🐣','🐥','🐦','🦅'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="35" rx="16" ry="19" fill="#fef3c7" stroke="#b45309" stroke-width="3"/><path d="M24 22 L30 15 L36 22" stroke="#b45309" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="23" cy="27" rx="7" ry="4" fill="white" opacity="0.35"/><circle cx="24" cy="30" r="2" fill="#d97706"/><circle cx="36" cy="33" r="1.5" fill="#d97706"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="42" rx="10" ry="5" fill="#fbbf24" stroke="#b45309" stroke-width="2" transform="rotate(20,10,42)"/><ellipse cx="50" cy="42" rx="10" ry="5" fill="#fbbf24" stroke="#b45309" stroke-width="2" transform="rotate(-20,50,42)"/><circle cx="30" cy="34" r="19" fill="#fde68a" stroke="#b45309" stroke-width="3"/><circle cx="22" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="30" r="3.5" fill="#1a0a00"/><circle cx="38" cy="30" r="3.5" fill="#1a0a00"/><circle cx="21" cy="28.5" r="1.2" fill="white"/><circle cx="37" cy="28.5" r="1.2" fill="white"/><path d="M26 37 Q30 35 34 37 Q35 41 32 44 Q30 45 28 44 Q25 41 26 37Z" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/><ellipse cx="24" cy="25" rx="8" ry="4" fill="white" opacity="0.25"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="7" cy="38" rx="11" ry="6" fill="#d97706" stroke="#92400e" stroke-width="2" transform="rotate(-20,7,38)"/><ellipse cx="53" cy="38" rx="11" ry="6" fill="#d97706" stroke="#92400e" stroke-width="2" transform="rotate(20,53,38)"/><ellipse cx="30" cy="43" rx="16" ry="11" fill="#92400e" stroke="#1a0a00" stroke-width="2.5"/><circle cx="30" cy="27" r="17" fill="#d97706" stroke="#1a0a00" stroke-width="3"/><circle cx="22" cy="24" r="5.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="24" r="5.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="24" r="3" fill="#1a0a00"/><circle cx="38" cy="24" r="3" fill="#1a0a00"/><circle cx="21" cy="23" r="1" fill="white"/><circle cx="37" cy="23" r="1" fill="white"/><path d="M25 33 Q30 31 35 33 Q36 38 33 41 Q31 43 29 42 Q26 41 24 38 Q24 35 25 33Z" fill="#f59e0b" stroke="#b45309" stroke-width="2"/><ellipse cx="23" cy="21" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M6 42 Q3 24 14 14 Q18 30 22 42Z" fill="#78350f" stroke="#1a0a00" stroke-width="2"/><path d="M54 42 Q57 24 46 14 Q42 30 38 42Z" fill="#78350f" stroke="#1a0a00" stroke-width="2"/><ellipse cx="30" cy="45" rx="15" ry="10" fill="#78350f" stroke="#1a0a00" stroke-width="2"/><circle cx="30" cy="26" r="17" fill="#f1f5f9" stroke="#1a0a00" stroke-width="3"/><circle cx="22" cy="23" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="23" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="23" r="3.5" fill="#d97706"/><circle cx="38" cy="23" r="3.5" fill="#d97706"/><circle cx="22" cy="23" r="1.8" fill="#1a0a00"/><circle cx="38" cy="23" r="1.8" fill="#1a0a00"/><circle cx="21" cy="22" r="1" fill="white"/><circle cx="37" cy="22" r="1" fill="white"/><path d="M24 31 Q30 28 36 31 Q37 36 34 40 Q32 42 30 41 Q27 41 25 38 Q23 35 24 31Z" fill="#f59e0b" stroke="#b45309" stroke-width="2"/><ellipse cx="23" cy="19" rx="8" ry="4" fill="white" opacity="0.3"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M14 12 L18 4 L22 12 L26 5 L30 12 L34 5 L38 12 L42 4 L46 12Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><path d="M4 44 Q2 22 13 12 Q18 28 20 44Z" fill="#7c2d12" stroke="#1a0a00" stroke-width="2"/><path d="M56 44 Q58 22 47 12 Q42 28 40 44Z" fill="#7c2d12" stroke="#1a0a00" stroke-width="2"/><ellipse cx="30" cy="47" rx="15" ry="10" fill="#7c2d12" stroke="#1a0a00" stroke-width="2"/><circle cx="30" cy="27" r="18" fill="#f1f5f9" stroke="#1a0a00" stroke-width="3"/><circle cx="22" cy="24" r="7" fill="#fde68a" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="24" r="7" fill="#fde68a" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="24" r="4" fill="#d97706"/><circle cx="38" cy="24" r="4" fill="#d97706"/><circle cx="22" cy="24" r="2" fill="#1a0a00"/><circle cx="38" cy="24" r="2" fill="#1a0a00"/><circle cx="21" cy="23" r="1.2" fill="white"/><circle cx="37" cy="23" r="1.2" fill="white"/><path d="M23 32 Q30 29 37 32 Q38 38 35 43 Q33 45 30 44 Q27 44 25 41 Q22 38 23 32Z" fill="#f59e0b" stroke="#b45309" stroke-width="2.5"/><ellipse cx="24" cy="19" rx="9" ry="4.5" fill="white" opacity="0.2"/></svg>'
   ],
   lbl:['Verward Ei','Slaperig Kuiken','Trotse Pieper','Bijziende Vogel','Legendarische Adelaar'],
   desc:['Ligt lekker te snoozen. Weet nog van niks.','Piept bij elke vraag. Begrijpt nog niks.','Denkt dat het alles snapt. Vergeet de helft.','Vliegt al, maar googlet stiekem nog antwoorden.','Zweeft boven de examenvragen als een god.'],
   evoMsg:['🐣 Je ei is gebarsten! Je Adelaar is wakker... een beetje.','🐥 Je Adelaar piept van trots!','🐦 Je Adelaar vliegt al! Niet helemaal recht, maar toch.','🦅 LEGENDARISCHE ADELAAR ONTGRENDELD! De examinator trilt.']},
  {id:'leeuw', n:'Leeuw', s:['','','','',''], fallback:['🐾','🐱','🐈','🐆','🦁'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="24" rx="7" ry="9" fill="#fb923c" stroke="#c2410c" stroke-width="2.5" transform="rotate(-15,20,24)"/><ellipse cx="40" cy="24" rx="7" ry="9" fill="#fb923c" stroke="#c2410c" stroke-width="2.5" transform="rotate(15,40,24)"/><ellipse cx="20" cy="24" rx="4" ry="6" fill="#fda4af" transform="rotate(-15,20,24)"/><ellipse cx="40" cy="24" rx="4" ry="6" fill="#fda4af" transform="rotate(15,40,24)"/><circle cx="30" cy="36" r="19" fill="#fb923c" stroke="#c2410c" stroke-width="3"/><circle cx="22" cy="32" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="32" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="32" r="3.5" fill="#15803d"/><circle cx="38" cy="32" r="3.5" fill="#15803d"/><circle cx="22" cy="32" r="1.8" fill="#1a0a00"/><circle cx="38" cy="32" r="1.8" fill="#1a0a00"/><circle cx="21" cy="31" r="1" fill="white"/><circle cx="37" cy="31" r="1" fill="white"/><path d="M27 37 Q30 34 33 37 Q31 40 30 41 Q29 40 27 37Z" fill="#be185d" stroke="#9d174d" stroke-width="1"/><line x1="19" y1="38" x2="7" y2="36" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="19" y1="41" x2="6" y2="41" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="41" y1="38" x2="53" y2="36" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="41" y1="41" x2="54" y2="41" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><ellipse cx="23" cy="27" rx="7" ry="4" fill="white" opacity="0.25"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="18" cy="20" rx="7" ry="10" fill="#fb923c" stroke="#c2410c" stroke-width="2" transform="rotate(-15,18,20)"/><ellipse cx="42" cy="20" rx="7" ry="10" fill="#fb923c" stroke="#c2410c" stroke-width="2" transform="rotate(15,42,20)"/><ellipse cx="18" cy="20" rx="4" ry="6" fill="#fda4af" transform="rotate(-15,18,20)"/><ellipse cx="42" cy="20" rx="4" ry="6" fill="#fda4af" transform="rotate(15,42,20)"/><circle cx="30" cy="36" r="22" fill="#ea580c" stroke="#1a0a00" stroke-width="3"/><circle cx="30" cy="36" r="17" fill="#fb923c" stroke="#c2410c" stroke-width="2"/><circle cx="22" cy="32" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="32" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="32" r="3.5" fill="#15803d"/><circle cx="38" cy="32" r="3.5" fill="#15803d"/><circle cx="22" cy="32" r="1.8" fill="#1a0a00"/><circle cx="38" cy="32" r="1.8" fill="#1a0a00"/><circle cx="21" cy="31" r="1" fill="white"/><circle cx="37" cy="31" r="1" fill="white"/><path d="M27 38 Q30 35 33 38 Q31 41 30 42 Q29 41 27 38Z" fill="#be185d" stroke="#9d174d" stroke-width="1"/><line x1="19" y1="39" x2="7" y2="37" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="19" y1="42" x2="6" y2="42" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="41" y1="39" x2="53" y2="37" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="41" y1="42" x2="54" y2="42" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><path d="M24 43 Q30 47 36 43" stroke="#c2410c" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="26" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="18" rx="7" ry="11" fill="#f97316" stroke="#c2410c" stroke-width="2" transform="rotate(-10,16,18)"/><ellipse cx="44" cy="18" rx="7" ry="11" fill="#f97316" stroke="#c2410c" stroke-width="2" transform="rotate(10,44,18)"/><ellipse cx="16" cy="18" rx="4" ry="7" fill="#fda4af" transform="rotate(-10,16,18)"/><ellipse cx="44" cy="18" rx="4" ry="7" fill="#fda4af" transform="rotate(10,44,18)"/><circle cx="30" cy="35" r="24" fill="#d97706" stroke="#1a0a00" stroke-width="3"/><circle cx="30" cy="35" r="18" fill="#f97316" stroke="#c2410c" stroke-width="2"/><circle cx="22" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="31" r="3.5" fill="#d97706"/><circle cx="38" cy="31" r="3.5" fill="#d97706"/><circle cx="22" cy="31" r="1.8" fill="#1a0a00"/><circle cx="38" cy="31" r="1.8" fill="#1a0a00"/><circle cx="21" cy="30" r="1" fill="white"/><circle cx="37" cy="30" r="1" fill="white"/><path d="M27 37 Q30 34 33 37 Q31 40 30 41 Q29 40 27 37Z" fill="#be185d" stroke="#9d174d" stroke-width="1"/><line x1="19" y1="37" x2="7" y2="35" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="19" y1="40" x2="6" y2="40" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="41" y1="37" x2="53" y2="35" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="41" y1="40" x2="54" y2="40" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><path d="M23 42 Q30 47 37 42" stroke="#c2410c" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="25" rx="9" ry="4.5" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="33" r="28" fill="#b45309" stroke="#1a0a00" stroke-width="3"/><ellipse cx="14" cy="22" rx="7" ry="10" fill="#d97706" stroke="#1a0a00" stroke-width="2" transform="rotate(-15,14,22)"/><ellipse cx="46" cy="22" rx="7" ry="10" fill="#d97706" stroke="#1a0a00" stroke-width="2" transform="rotate(15,46,22)"/><ellipse cx="14" cy="22" rx="4" ry="7" fill="#fda4af" transform="rotate(-15,14,22)"/><ellipse cx="46" cy="22" rx="4" ry="7" fill="#fda4af" transform="rotate(15,46,22)"/><circle cx="30" cy="33" r="20" fill="#fbbf24" stroke="#b45309" stroke-width="2"/><circle cx="21" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="29" r="4" fill="#22c55e"/><circle cx="39" cy="29" r="4" fill="#22c55e"/><circle cx="21" cy="29" r="2" fill="#1a0a00"/><circle cx="39" cy="29" r="2" fill="#1a0a00"/><circle cx="20" cy="28" r="1" fill="white"/><circle cx="38" cy="28" r="1" fill="white"/><path d="M27 35 Q30 32 33 35 Q31 38 30 39 Q29 38 27 35Z" fill="#be185d" stroke="#9d174d" stroke-width="1"/><line x1="18" y1="36" x2="6" y2="34" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="18" y1="39" x2="5" y2="39" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="42" y1="36" x2="54" y2="34" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="42" y1="39" x2="55" y2="39" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><path d="M22 41 Q30 47 38 41" stroke="#92400e" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="23" rx="9" ry="5" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M12 14 L16 5 L20 13 L24 6 L30 13 L36 6 L40 13 L44 5 L48 14Z" fill="#fbbf24" stroke="#b45309" stroke-width="2"/><circle cx="30" cy="32" r="28" fill="#92400e" stroke="#1a0a00" stroke-width="3"/><ellipse cx="12" cy="20" rx="7" ry="11" fill="#f97316" stroke="#1a0a00" stroke-width="2" transform="rotate(-15,12,20)"/><ellipse cx="48" cy="20" rx="7" ry="11" fill="#f97316" stroke="#1a0a00" stroke-width="2" transform="rotate(15,48,20)"/><ellipse cx="12" cy="20" rx="4" ry="7" fill="#fda4af" transform="rotate(-15,12,20)"/><ellipse cx="48" cy="20" rx="4" ry="7" fill="#fda4af" transform="rotate(15,48,20)"/><circle cx="30" cy="32" r="20" fill="#fbbf24" stroke="#b45309" stroke-width="2"/><circle cx="21" cy="28" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="28" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="28" r="4.5" fill="#dc2626"/><circle cx="39" cy="28" r="4.5" fill="#dc2626"/><circle cx="21" cy="28" r="2" fill="#1a0a00"/><circle cx="39" cy="28" r="2" fill="#1a0a00"/><circle cx="20" cy="27" r="1.2" fill="white"/><circle cx="38" cy="27" r="1.2" fill="white"/><path d="M27 34 Q30 31 33 34 Q31 37 30 38 Q29 37 27 34Z" fill="#be185d" stroke="#9d174d" stroke-width="1"/><line x1="18" y1="35" x2="5" y2="33" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="18" y1="38" x2="4" y2="38" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="42" y1="35" x2="55" y2="33" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><line x1="42" y1="38" x2="56" y2="38" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/><path d="M22 40 Q30 46 38 40" stroke="#78350f" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="22" rx="10" ry="5" fill="white" opacity="0.2"/></svg>'
   ],
   lbl:['Huilerig Welp','Nieuwsgierig Katje','Brutaal Puber','Gevaarlijke Luipaard','Onoverwinnelijke Leeuw'],
   desc:['Huilt bij de eerste moeilijke vraag.','Speelt liever dan oefent. Schattig maar nutteloos.','Denkt dat het beter is dan de leraar. Heeft een punt.','Jaagt op hoge cijfers. Laat niemand ontkomen.','Brult bij elk examen. Zelfs de surveillant is bang.'],
   evoMsg:['🐱 Je Leeuw heeft zijn eerste tand! Ow wat schattig.','🐈 Je Leeuw is in de puberteit. Excuses voor het gedrag.','🐆 Je Leeuw jaagt nu echt op die hoge cijfers!','🦁 GEBRUL! Je Leeuw heeft het maximum bereikt. Vrees hem.']},
  {id:'draak', n:'Draak', s:['','','','',''], fallback:['🥚','🦎','🐊','🐲','🐉'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="35" rx="16" ry="19" fill="#1e1b4b" stroke="#6d28d9" stroke-width="3"/><path d="M24 22 L30 14 L36 22" stroke="#a855f7" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="23" cy="28" rx="7" ry="3.5" fill="#7c3aed" opacity="0.4"/><circle cx="25" cy="31" r="2" fill="#a855f7"/><circle cx="35" cy="34" r="1.5" fill="#a855f7"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="34" r="17" fill="#7c3aed" stroke="#4c1d95" stroke-width="3"/><ellipse cx="18" cy="17" rx="5" ry="8" fill="#6d28d9" stroke="#4c1d95" stroke-width="2" transform="rotate(-20,18,17)"/><ellipse cx="42" cy="17" rx="5" ry="8" fill="#6d28d9" stroke="#4c1d95" stroke-width="2" transform="rotate(20,42,17)"/><circle cx="22" cy="32" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="32" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="32" r="3.5" fill="#22c55e"/><circle cx="38" cy="32" r="3.5" fill="#22c55e"/><ellipse cx="22" cy="32" rx="0.9" ry="2.5" fill="#1a0a00"/><ellipse cx="38" cy="32" rx="0.9" ry="2.5" fill="#1a0a00"/><circle cx="21" cy="31" r="1" fill="white"/><circle cx="37" cy="31" r="1" fill="white"/><ellipse cx="30" cy="39" rx="6" ry="3.5" fill="#5b21b6" stroke="#4c1d95" stroke-width="1.5"/><circle cx="27" cy="38" r="1.5" fill="#3b0764"/><circle cx="33" cy="38" r="1.5" fill="#3b0764"/><path d="M27 43 L29 47 L31 43" stroke="#ef4444" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="27" rx="7" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="34" r="20" fill="#6d28d9" stroke="#4c1d95" stroke-width="3"/><ellipse cx="16" cy="14" rx="5" ry="10" fill="#4c1d95" stroke="#1a0a00" stroke-width="2" transform="rotate(-20,16,14)"/><ellipse cx="44" cy="14" rx="5" ry="10" fill="#4c1d95" stroke="#1a0a00" stroke-width="2" transform="rotate(20,44,14)"/><path d="M3 36 Q8 26 18 34" stroke="#9333ea" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M57 36 Q52 26 42 34" stroke="#9333ea" stroke-width="6" stroke-linecap="round" fill="none"/><circle cx="22" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="31" r="3.5" fill="#22c55e"/><circle cx="38" cy="31" r="3.5" fill="#22c55e"/><ellipse cx="22" cy="31" rx="0.9" ry="2.5" fill="#1a0a00"/><ellipse cx="38" cy="31" rx="0.9" ry="2.5" fill="#1a0a00"/><circle cx="21" cy="30" r="1" fill="white"/><circle cx="37" cy="30" r="1" fill="white"/><ellipse cx="30" cy="38" rx="6" ry="3.5" fill="#5b21b6" stroke="#4c1d95" stroke-width="1.5"/><circle cx="27" cy="37" r="1.5" fill="#3b0764"/><circle cx="33" cy="37" r="1.5" fill="#3b0764"/><path d="M26 42 L28 47 L30 44 L32 47 L34 42" stroke="#f97316" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="23" cy="26" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M3 45 Q1 26 11 15 Q18 6 28 8 Q30 2 32 8 Q42 6 49 15 Q59 26 57 45 Q52 58 30 59 Q8 58 3 45Z" fill="#7c3aed" stroke="#4c1d95" stroke-width="3"/><ellipse cx="18" cy="10" rx="5" ry="9" fill="#4c1d95" stroke="#1a0a00" stroke-width="2" transform="rotate(-25,18,10)"/><ellipse cx="42" cy="10" rx="5" ry="9" fill="#4c1d95" stroke="#1a0a00" stroke-width="2" transform="rotate(25,42,10)"/><path d="M1 36 Q7 24 18 33" stroke="#9333ea" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M59 36 Q53 24 42 33" stroke="#9333ea" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="22" cy="30" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="30" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="30" r="4.5" fill="#dc2626"/><circle cx="38" cy="30" r="4.5" fill="#dc2626"/><ellipse cx="22" cy="30" rx="1" ry="3" fill="#1a0a00"/><ellipse cx="38" cy="30" rx="1" ry="3" fill="#1a0a00"/><circle cx="21" cy="29" r="1.2" fill="white"/><circle cx="37" cy="29" r="1.2" fill="white"/><ellipse cx="30" cy="37" rx="7" ry="4" fill="#5b21b6" stroke="#4c1d95" stroke-width="2"/><circle cx="26" cy="36" r="2" fill="#3b0764"/><circle cx="34" cy="36" r="2" fill="#3b0764"/><path d="M24 43 L27 49 L30 45 L33 49 L36 43" stroke="#f97316" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="23" cy="22" rx="9" ry="4.5" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M14 8 L17 2 L20 8 L23 3 L26 8 L30 2 L34 8 L37 3 L40 8 L43 2 L46 8Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><path d="M2 46 Q0 24 11 13 Q19 4 28 6 Q30 0 32 6 Q41 4 49 13 Q60 24 58 46 Q52 59 30 60 Q8 59 2 46Z" fill="#6d28d9" stroke="#4c1d95" stroke-width="3"/><ellipse cx="16" cy="8" rx="5" ry="10" fill="#3b0764" stroke="#1a0a00" stroke-width="2" transform="rotate(-25,16,8)"/><ellipse cx="44" cy="8" rx="5" ry="10" fill="#3b0764" stroke="#1a0a00" stroke-width="2" transform="rotate(25,44,8)"/><path d="M0 35 Q6 22 18 32" stroke="#7c3aed" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M60 35 Q54 22 42 32" stroke="#7c3aed" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="21" cy="28" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="28" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="28" r="5" fill="#f97316"/><circle cx="39" cy="28" r="5" fill="#f97316"/><ellipse cx="21" cy="28" rx="1.2" ry="3.5" fill="#1a0a00"/><ellipse cx="39" cy="28" rx="1.2" ry="3.5" fill="#1a0a00"/><circle cx="20" cy="27" r="1.5" fill="white"/><circle cx="38" cy="27" r="1.5" fill="white"/><ellipse cx="30" cy="36" rx="8" ry="4.5" fill="#5b21b6" stroke="#4c1d95" stroke-width="2"/><circle cx="25" cy="35" r="2.2" fill="#3b0764"/><circle cx="35" cy="35" r="2.2" fill="#3b0764"/><path d="M22 42 L25 49 L28 45 L30 51 L32 45 L35 49 L38 42" stroke="#f97316" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="22" cy="21" rx="10" ry="5" fill="white" opacity="0.18"/></svg>'
   ],
   lbl:['Mysterieus Ei','Verward Hagedisje','Krokodil met Ambities','Semi-Draak','Legendarische Vuurdrake'],
   desc:['Niemand weet wat erin zit. Jijzelf ook niet.','Klein maar heeft grote plannen. Legt ze niet uit.','Bijt van zich af bij moeilijke vragen. Letterlijk.','Spuwt soms vuur. Soms per ongeluk op de samenvatting.','Vernietigt elk examen met één adem. Onstopbaar.'],
   evoMsg:['🦎 Je Draak kruipt uit het ei! Ziet er... interessant uit.','🐊 Je Draak bijt van zich af! Pas op je vingers.','🐲 HALF-DRAAK ONTGRENDELD! Er komt rook uit z\'n neus.','🐉 VUURDRAKE! Het examenlokaal heeft extra brandblusser nodig.']},
  {id:'wolf', n:'Wolf', s:['','','','',''], fallback:['🐾','🐶','🐕','🐺','🌕'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="19" cy="20" rx="7" ry="11" fill="#94a3b8" stroke="#475569" stroke-width="2.5" transform="rotate(-15,19,20)"/><ellipse cx="41" cy="20" rx="7" ry="11" fill="#94a3b8" stroke="#475569" stroke-width="2.5" transform="rotate(15,41,20)"/><ellipse cx="19" cy="20" rx="4" ry="7" fill="#fda4af" transform="rotate(-15,19,20)"/><ellipse cx="41" cy="20" rx="4" ry="7" fill="#fda4af" transform="rotate(15,41,20)"/><circle cx="30" cy="36" r="19" fill="#cbd5e1" stroke="#475569" stroke-width="3"/><ellipse cx="30" cy="44" rx="11" ry="7" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/><circle cx="22" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="31" r="3.5" fill="#d97706"/><circle cx="38" cy="31" r="3.5" fill="#d97706"/><circle cx="22" cy="31" r="1.8" fill="#1a0a00"/><circle cx="38" cy="31" r="1.8" fill="#1a0a00"/><circle cx="21" cy="30" r="1" fill="white"/><circle cx="37" cy="30" r="1" fill="white"/><ellipse cx="30" cy="41" rx="3" ry="2" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="23" cy="26" rx="7" ry="4" fill="white" opacity="0.25"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="17" cy="17" rx="7" ry="12" fill="#94a3b8" stroke="#475569" stroke-width="2" transform="rotate(-12,17,17)"/><ellipse cx="43" cy="17" rx="7" ry="12" fill="#94a3b8" stroke="#475569" stroke-width="2" transform="rotate(12,43,17)"/><ellipse cx="17" cy="17" rx="4" ry="7" fill="#fda4af" transform="rotate(-12,17,17)"/><ellipse cx="43" cy="17" rx="4" ry="7" fill="#fda4af" transform="rotate(12,43,17)"/><circle cx="30" cy="34" r="20" fill="#94a3b8" stroke="#475569" stroke-width="3"/><ellipse cx="30" cy="43" rx="13" ry="9" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/><circle cx="21" cy="29" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="29" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="29" r="3.5" fill="#d97706"/><circle cx="39" cy="29" r="3.5" fill="#d97706"/><circle cx="21" cy="29" r="1.8" fill="#1a0a00"/><circle cx="39" cy="29" r="1.8" fill="#1a0a00"/><circle cx="20" cy="28" r="1" fill="white"/><circle cx="38" cy="28" r="1" fill="white"/><ellipse cx="30" cy="40" rx="3.5" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="22" cy="24" rx="8" ry="4" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="15" cy="15" rx="7" ry="13" fill="#64748b" stroke="#334155" stroke-width="2.5" transform="rotate(-10,15,15)"/><ellipse cx="45" cy="15" rx="7" ry="13" fill="#64748b" stroke="#334155" stroke-width="2.5" transform="rotate(10,45,15)"/><ellipse cx="15" cy="15" rx="4" ry="8" fill="#475569" transform="rotate(-10,15,15)"/><ellipse cx="45" cy="15" rx="4" ry="8" fill="#475569" transform="rotate(10,45,15)"/><circle cx="30" cy="33" r="21" fill="#64748b" stroke="#334155" stroke-width="3"/><ellipse cx="30" cy="44" rx="14" ry="9" fill="#94a3b8" stroke="#64748b" stroke-width="1.5"/><circle cx="21" cy="28" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="28" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="28" r="4" fill="#d97706"/><circle cx="39" cy="28" r="4" fill="#d97706"/><circle cx="21" cy="28" r="2" fill="#1a0a00"/><circle cx="39" cy="28" r="2" fill="#1a0a00"/><circle cx="20" cy="27" r="1" fill="white"/><circle cx="38" cy="27" r="1" fill="white"/><ellipse cx="30" cy="40" rx="4" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><path d="M24 44 Q30 48 36 44" stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="23" rx="9" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="13" cy="13" rx="7" ry="13" fill="#475569" stroke="#1e293b" stroke-width="2.5" transform="rotate(-8,13,13)"/><ellipse cx="47" cy="13" rx="7" ry="13" fill="#475569" stroke="#1e293b" stroke-width="2.5" transform="rotate(8,47,13)"/><ellipse cx="13" cy="13" rx="4" ry="8" fill="#334155" transform="rotate(-8,13,13)"/><ellipse cx="47" cy="13" rx="4" ry="8" fill="#334155" transform="rotate(8,47,13)"/><circle cx="30" cy="32" r="22" fill="#475569" stroke="#1e293b" stroke-width="3"/><ellipse cx="30" cy="44" rx="15" ry="10" fill="#64748b" stroke="#475569" stroke-width="1.5"/><circle cx="21" cy="27" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="27" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="27" r="4.5" fill="#d97706"/><circle cx="39" cy="27" r="4.5" fill="#d97706"/><circle cx="21" cy="27" r="2.2" fill="#1a0a00"/><circle cx="39" cy="27" r="2.2" fill="#1a0a00"/><circle cx="20" cy="26" r="1.2" fill="white"/><circle cx="38" cy="26" r="1.2" fill="white"/><ellipse cx="30" cy="40" rx="4.5" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><path d="M24 43 Q30 49 36 43" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="21" rx="10" ry="5" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="9" r="10" fill="#fde68a" stroke="#b45309" stroke-width="2" opacity="0.7"/><ellipse cx="11" cy="13" rx="7" ry="13" fill="#334155" stroke="#1e293b" stroke-width="2.5" transform="rotate(-8,11,13)"/><ellipse cx="49" cy="13" rx="7" ry="13" fill="#334155" stroke="#1e293b" stroke-width="2.5" transform="rotate(8,49,13)"/><ellipse cx="11" cy="13" rx="4" ry="8" fill="#1e293b" transform="rotate(-8,11,13)"/><ellipse cx="49" cy="13" rx="4" ry="8" fill="#1e293b" transform="rotate(8,49,13)"/><circle cx="30" cy="32" r="23" fill="#334155" stroke="#1e293b" stroke-width="3"/><ellipse cx="30" cy="45" rx="16" ry="10" fill="#475569" stroke="#334155" stroke-width="1.5"/><circle cx="20" cy="27" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="40" cy="27" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="20" cy="27" r="5" fill="#d97706"/><circle cx="40" cy="27" r="5" fill="#d97706"/><circle cx="20" cy="27" r="2.5" fill="#1a0a00"/><circle cx="40" cy="27" r="2.5" fill="#1a0a00"/><circle cx="19" cy="26" r="1.2" fill="white"/><circle cx="39" cy="26" r="1.2" fill="white"/><ellipse cx="30" cy="41" rx="5" ry="3.5" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><path d="M23 46 Q30 52 37 46" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="21" cy="21" rx="11" ry="5" fill="white" opacity="0.18"/></svg>'
   ],
   lbl:['Piepklein Welp','Enthousiast Puppybrein','Trouwe Studeerbuddy','Gevaarlijke Wolf','Hurling-bij-de-Maan Wolf'],
   desc:['Zo klein dat het bijna zielig is. Bijna.','Blij met elke vraag. Ook de foute antwoorden.','Leert trucjes. Vooral het trucje "niet opgeven".','Huilt naar de maan als het examen nadert.','Huilt succesvol naar de volle maan. 10/10 geslaagd.'],
   evoMsg:['🐶 Je Wolf kwispelt van vreugde! Alles is spannend!','🐕 Je Wolf leert nieuwe trucjes! Zit. Goed zo.','🐺 WOLF ONTGRENDELD! Huilt professioneel naar de maan.','🌕 JE WOLF HUILT NAAR DE MAAN! De buren bellen de politie.']},
  {id:'vlinder', n:'Vlinder', s:['','','','',''], fallback:['🥚','🐛','🫘','🐚','🦋'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="38" rx="9" ry="12" fill="#65a30d" stroke="#3f6212" stroke-width="3"/><ellipse cx="21" cy="46" rx="15" ry="5" fill="#4d7c0f" stroke="#3f6212" stroke-width="2"/><circle cx="30" cy="26" r="8" fill="#bbf7d0" stroke="#4ade80" stroke-width="2.5"/><ellipse cx="27" cy="24" rx="5" ry="3" fill="white" opacity="0.4"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 56 Q20 52 16 44 Q12 36 14 28 Q16 18 20 14 Q24 10 28 12 Q30 8 32 12 Q36 10 40 14 Q44 18 46 28 Q48 36 44 44 Q40 52 30 56Z" fill="#22c55e" stroke="#15803d" stroke-width="3"/><path d="M24 18 Q30 14 36 18" stroke="#4ade80" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M21 26 Q30 22 39 26" stroke="#4ade80" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M20 34 Q30 30 40 34" stroke="#4ade80" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="25" cy="14" r="4" fill="#166534" stroke="#15803d" stroke-width="2"/><circle cx="35" cy="14" r="4" fill="#166534" stroke="#15803d" stroke-width="2"/><circle cx="25" cy="14" r="2.5" fill="#1a0a00"/><circle cx="35" cy="14" r="2.5" fill="#1a0a00"/><circle cx="24.5" cy="13" r="0.8" fill="white"/><circle cx="34.5" cy="13" r="0.8" fill="white"/><ellipse cx="24" cy="10" rx="5" ry="3" fill="white" opacity="0.25"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="36" rx="11" ry="18" fill="#a16207" stroke="#92400e" stroke-width="3"/><ellipse cx="30" cy="30" rx="9" ry="13" fill="#ca8a04" stroke="#92400e" stroke-width="2"/><path d="M22 20 Q30 16 38 20" stroke="#d97706" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M22 28 Q30 24 38 28" stroke="#d97706" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M22 36 Q30 32 38 36" stroke="#d97706" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="26" cy="18" r="4" fill="#92400e" stroke="#78350f" stroke-width="1.5"/><circle cx="34" cy="18" r="4" fill="#92400e" stroke="#78350f" stroke-width="1.5"/><ellipse cx="25" cy="24" rx="6" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 42 Q14 36 7 24 Q4 16 10 10 Q16 6 22 10 Q26 14 30 12 Q34 14 38 10 Q44 6 50 10 Q56 16 53 24 Q46 36 30 42Z" fill="#a855f7" stroke="#7c3aed" stroke-width="3"/><path d="M30 40 Q18 34 14 26 Q12 20 16 18 Q20 16 24 20 Q27 24 30 22 Q33 24 36 20 Q40 16 44 18 Q48 20 46 26 Q42 34 30 40Z" fill="#d8b4fe" stroke="#a855f7" stroke-width="2"/><ellipse cx="30" cy="42" rx="5" ry="15" fill="#7c3aed" stroke="#4c1d95" stroke-width="2.5"/><circle cx="30" cy="28" r="6" fill="#6d28d9" stroke="#4c1d95" stroke-width="2"/><circle cx="27.5" cy="26" r="3" fill="white" stroke="#1a0a00" stroke-width="1.5"/><circle cx="32.5" cy="26" r="3" fill="white" stroke="#1a0a00" stroke-width="1.5"/><circle cx="27.5" cy="26" r="1.5" fill="#1a0a00"/><circle cx="32.5" cy="26" r="1.5" fill="#1a0a00"/><circle cx="27" cy="25.5" r="0.6" fill="white"/><circle cx="32" cy="25.5" r="0.6" fill="white"/><ellipse cx="28" cy="24" rx="5" ry="2.5" fill="white" opacity="0.3"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 44 Q10 32 3 18 Q0 8 8 4 Q16 2 22 8 Q26 14 30 10 Q34 14 38 8 Q44 2 52 4 Q60 8 57 18 Q50 32 30 44Z" fill="#db2777" stroke="#be185d" stroke-width="3"/><path d="M30 38 Q16 28 10 18 Q8 12 12 10 Q18 8 22 14 Q26 18 30 16 Q34 18 38 14 Q42 8 48 10 Q52 12 50 18 Q44 28 30 38Z" fill="#f9a8d4" stroke="#ec4899" stroke-width="2"/><path d="M30 44 Q20 38 16 30 Q14 24 18 22 Q22 22 24 26 Q27 30 30 28 Q33 30 36 26 Q38 22 42 22 Q46 24 44 30 Q40 38 30 44Z" fill="#fce7f3" stroke="#f9a8d4" stroke-width="1.5"/><ellipse cx="30" cy="44" rx="5" ry="14" fill="#7c3aed" stroke="#4c1d95" stroke-width="2.5"/><circle cx="30" cy="30" r="6.5" fill="#6d28d9" stroke="#4c1d95" stroke-width="2"/><circle cx="27" cy="28" r="3.5" fill="white" stroke="#1a0a00" stroke-width="1.5"/><circle cx="33" cy="28" r="3.5" fill="white" stroke="#1a0a00" stroke-width="1.5"/><circle cx="27" cy="28" r="1.8" fill="#1a0a00"/><circle cx="33" cy="28" r="1.8" fill="#1a0a00"/><circle cx="26.5" cy="27" r="0.8" fill="white"/><circle cx="32.5" cy="27" r="0.8" fill="white"/><ellipse cx="28" cy="26" rx="5" ry="2.5" fill="white" opacity="0.3"/></svg>'
   ],
   lbl:['Twijfelachtig Eitje','Trage Rups','Zwijgende Cocon','Bijna-Vlinder','Prachtige Vlinder'],
   desc:['Twijfelt of het de moeite waard is. Doet het toch.','Eet bladzijden studie-materiaal. Letterlijk.','Slaapt, maar denkt tegelijkertijd na. Multitasken.','Vleugels groeien al. Nog even geduld.','Danst door de examenzaal. De surveillant is ontroerd.'],
   evoMsg:['🐛 Je Vlinder kruipt! Langzaam maar zeker.','🫘 Je Vlinder zit in de cocon. Ssh, niet storen.','🐚 Vleugels groeien... nog even...','🦋 JE VLINDER IS ER! Ze danst door de examenzaal!']},
  {id:'tijger', n:'Tijger', s:['','','','',''], fallback:['🐾','🐱','🐈','🐅','🐯'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="19" cy="20" rx="7" ry="11" fill="#f97316" stroke="#c2410c" stroke-width="2.5" transform="rotate(-15,19,20)"/><ellipse cx="41" cy="20" rx="7" ry="11" fill="#f97316" stroke="#c2410c" stroke-width="2.5" transform="rotate(15,41,20)"/><ellipse cx="19" cy="20" rx="4" ry="7" fill="#fde68a" transform="rotate(-15,19,20)"/><ellipse cx="41" cy="20" rx="4" ry="7" fill="#fde68a" transform="rotate(15,41,20)"/><circle cx="30" cy="36" r="19" fill="#fb923c" stroke="#c2410c" stroke-width="3"/><ellipse cx="30" cy="44" rx="12" ry="8" fill="#fde68a" stroke="#f97316" stroke-width="1.5"/><circle cx="22" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="30" r="3.5" fill="#15803d"/><circle cx="38" cy="30" r="3.5" fill="#15803d"/><circle cx="22" cy="30" r="1.8" fill="#1a0a00"/><circle cx="38" cy="30" r="1.8" fill="#1a0a00"/><circle cx="21" cy="29" r="1" fill="white"/><circle cx="37" cy="29" r="1" fill="white"/><ellipse cx="30" cy="40" rx="3" ry="2" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="23" cy="25" rx="7" ry="4" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="17" cy="16" rx="7" ry="13" fill="#f97316" stroke="#c2410c" stroke-width="2" transform="rotate(-12,17,16)"/><ellipse cx="43" cy="16" rx="7" ry="13" fill="#f97316" stroke="#c2410c" stroke-width="2" transform="rotate(12,43,16)"/><ellipse cx="17" cy="16" rx="4" ry="8" fill="#fde68a" transform="rotate(-12,17,16)"/><ellipse cx="43" cy="16" rx="4" ry="8" fill="#fde68a" transform="rotate(12,43,16)"/><circle cx="30" cy="34" r="20" fill="#f97316" stroke="#c2410c" stroke-width="3"/><ellipse cx="30" cy="44" rx="13" ry="9" fill="#fde68a" stroke="#f97316" stroke-width="1.5"/><path d="M18 22 L16 32" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round"/><path d="M22 20 L20 30" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round"/><path d="M42 22 L44 32" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round"/><path d="M38 20 L40 30" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round"/><circle cx="22" cy="29" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="29" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="29" r="3.5" fill="#15803d"/><circle cx="38" cy="29" r="3.5" fill="#15803d"/><circle cx="22" cy="29" r="1.8" fill="#1a0a00"/><circle cx="38" cy="29" r="1.8" fill="#1a0a00"/><circle cx="21" cy="28" r="1" fill="white"/><circle cx="37" cy="28" r="1" fill="white"/><ellipse cx="30" cy="40" rx="3.5" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="22" cy="24" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="15" cy="15" rx="7" ry="13" fill="#ea580c" stroke="#c2410c" stroke-width="2.5" transform="rotate(-10,15,15)"/><ellipse cx="45" cy="15" rx="7" ry="13" fill="#ea580c" stroke="#c2410c" stroke-width="2.5" transform="rotate(10,45,15)"/><ellipse cx="15" cy="15" rx="4" ry="8" fill="#fde68a" transform="rotate(-10,15,15)"/><ellipse cx="45" cy="15" rx="4" ry="8" fill="#fde68a" transform="rotate(10,45,15)"/><circle cx="30" cy="33" r="21" fill="#ea580c" stroke="#c2410c" stroke-width="3"/><ellipse cx="30" cy="43" rx="14" ry="10" fill="#fde68a" stroke="#f97316" stroke-width="1.5"/><path d="M16 19 L13 30" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/><path d="M20 16 L18 28" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/><path d="M44 19 L47 30" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/><path d="M40 16 L42 28" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/><circle cx="22" cy="28" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="28" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="28" r="4" fill="#dc2626"/><circle cx="38" cy="28" r="4" fill="#dc2626"/><circle cx="22" cy="28" r="2" fill="#1a0a00"/><circle cx="38" cy="28" r="2" fill="#1a0a00"/><circle cx="21" cy="27" r="1" fill="white"/><circle cx="37" cy="27" r="1" fill="white"/><ellipse cx="30" cy="39" rx="4" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><ellipse cx="22" cy="23" rx="9" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="13" cy="12" rx="7" ry="13" fill="#c2410c" stroke="#7c2d12" stroke-width="2.5" transform="rotate(-8,13,12)"/><ellipse cx="47" cy="12" rx="7" ry="13" fill="#c2410c" stroke="#7c2d12" stroke-width="2.5" transform="rotate(8,47,12)"/><ellipse cx="13" cy="12" rx="4" ry="8" fill="#fde68a" transform="rotate(-8,13,12)"/><ellipse cx="47" cy="12" rx="4" ry="8" fill="#fde68a" transform="rotate(8,47,12)"/><circle cx="30" cy="32" r="22" fill="#c2410c" stroke="#7c2d12" stroke-width="3"/><ellipse cx="30" cy="44" rx="15" ry="10" fill="#fde68a" stroke="#f97316" stroke-width="2"/><path d="M14 18 L11 30" stroke="#7c2d12" stroke-width="3.5" stroke-linecap="round"/><path d="M18 14 L16 28" stroke="#7c2d12" stroke-width="3.5" stroke-linecap="round"/><path d="M46 18 L49 30" stroke="#7c2d12" stroke-width="3.5" stroke-linecap="round"/><path d="M42 14 L44 28" stroke="#7c2d12" stroke-width="3.5" stroke-linecap="round"/><circle cx="21" cy="27" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="27" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="27" r="4.5" fill="#dc2626"/><circle cx="39" cy="27" r="4.5" fill="#dc2626"/><circle cx="21" cy="27" r="2.2" fill="#1a0a00"/><circle cx="39" cy="27" r="2.2" fill="#1a0a00"/><circle cx="20" cy="26" r="1.2" fill="white"/><circle cx="38" cy="26" r="1.2" fill="white"/><ellipse cx="30" cy="40" rx="4.5" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><ellipse cx="22" cy="21" rx="10" ry="4.5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M12 10 L16 3 L20 10 L24 4 L30 10 L36 4 L40 10 L44 3 L48 10Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><ellipse cx="11" cy="11" rx="7" ry="13" fill="#7c2d12" stroke="#1a0a00" stroke-width="2.5" transform="rotate(-8,11,11)"/><ellipse cx="49" cy="11" rx="7" ry="13" fill="#7c2d12" stroke="#1a0a00" stroke-width="2.5" transform="rotate(8,49,11)"/><ellipse cx="11" cy="11" rx="4" ry="8" fill="#fde68a" transform="rotate(-8,11,11)"/><ellipse cx="49" cy="11" rx="4" ry="8" fill="#fde68a" transform="rotate(8,49,11)"/><circle cx="30" cy="32" r="23" fill="#7c2d12" stroke="#1a0a00" stroke-width="3"/><ellipse cx="30" cy="44" rx="16" ry="11" fill="#fde68a" stroke="#f97316" stroke-width="2"/><path d="M12 17 L9 30" stroke="#f97316" stroke-width="4" stroke-linecap="round"/><path d="M17 13 L15 28" stroke="#f97316" stroke-width="4" stroke-linecap="round"/><path d="M48 17 L51 30" stroke="#f97316" stroke-width="4" stroke-linecap="round"/><path d="M43 13 L45 28" stroke="#f97316" stroke-width="4" stroke-linecap="round"/><circle cx="20" cy="27" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="40" cy="27" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="20" cy="27" r="5" fill="#f97316"/><circle cx="40" cy="27" r="5" fill="#f97316"/><circle cx="20" cy="27" r="2.5" fill="#1a0a00"/><circle cx="40" cy="27" r="2.5" fill="#1a0a00"/><circle cx="19" cy="26" r="1.2" fill="white"/><circle cx="39" cy="26" r="1.2" fill="white"/><ellipse cx="22" cy="21" rx="11" ry="5" fill="white" opacity="0.18"/></svg>'
   ],
   lbl:['Schuchtere Welp','Nieuwsgierig Katje','Gestreepte Puber','Sluipende Tijger','Opper-Tijger'],
   desc:['Verschuilt zich achter de samenvatting.','Speelt met de flashcards. Kauwt er ook op.','Heeft strepen. Denkt dat het cool is.','Sluipt onhoorbaar door de examenstof.','Sprintt naar een 10 en kijkt niet meer om.'],
   evoMsg:['🐱 Je Tijger miauwt stoer! (Het is schattig.)','🐈 Je Tijger heeft zijn eerste strepen!','🐅 SLUIPENDE TIJGER! De examenvragen weten niet wat ze te wachten staat.','🐯 OPPER-TIJGER! BRULLLLL!']},
  {id:'haai', n:'Haai', s:['','','','',''], fallback:['🦠','🐟','🐠','🦈','🦈'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="36" rx="20" ry="12" fill="#7dd3fc" stroke="#0369a1" stroke-width="3"/><path d="M52 36 Q58 30 58 36 Q56 42 52 40Z" fill="#7dd3fc" stroke="#0369a1" stroke-width="2"/><circle cx="22" cy="32" r="5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="32" r="3" fill="#1a0a00"/><circle cx="21.5" cy="31" r="1" fill="white"/><path d="M28 36 L24 40 L32 40 L36 36" fill="white" stroke="#0369a1" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="36" cy="30" rx="9" ry="4" fill="white" opacity="0.25"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M22 18 Q30 12 30 18Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/><ellipse cx="32" cy="34" rx="22" ry="14" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/><path d="M54 34 Q60 26 60 34 Q58 42 54 40Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/><ellipse cx="32" cy="40" rx="16" ry="8" fill="#bae6fd" stroke="#7dd3fc" stroke-width="1.5"/><circle cx="20" cy="30" r="5.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="20" cy="30" r="3.5" fill="#0c4a6e"/><circle cx="20" cy="30" r="1.8" fill="#1a0a00"/><circle cx="19.5" cy="29" r="1" fill="white"/><path d="M26 36 L22 41 L30 41 L34 36" fill="white" stroke="#0284c7" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="38" cy="26" rx="10" ry="5" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M20 16 Q28 8 30 16Z" fill="#0ea5e9" stroke="#0284c7" stroke-width="2.5"/><path d="M36 14 Q42 8 44 16Z" fill="#0ea5e9" stroke="#0284c7" stroke-width="2"/><ellipse cx="32" cy="33" rx="24" ry="15" fill="#0ea5e9" stroke="#0284c7" stroke-width="3"/><path d="M56 33 Q62 24 62 33 Q60 42 56 40Z" fill="#0ea5e9" stroke="#0284c7" stroke-width="2"/><ellipse cx="32" cy="40" rx="18" ry="9" fill="#7dd3fc" stroke="#38bdf8" stroke-width="1.5"/><circle cx="18" cy="29" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="18" cy="29" r="4" fill="#0c4a6e"/><circle cx="18" cy="29" r="2" fill="#1a0a00"/><circle cx="17.5" cy="28" r="1" fill="white"/><path d="M24 36 L20 42 L28 42 L32 36" fill="white" stroke="#0284c7" stroke-width="2" stroke-linejoin="round"/><ellipse cx="38" cy="24" rx="12" ry="5" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M18 12 Q28 4 30 12Z" fill="#475569" stroke="#334155" stroke-width="2.5"/><ellipse cx="32" cy="32" rx="26" ry="17" fill="#475569" stroke="#334155" stroke-width="3"/><path d="M58 32 Q64 22 64 32 Q62 42 58 40Z" fill="#475569" stroke="#334155" stroke-width="2"/><ellipse cx="32" cy="42" rx="20" ry="10" fill="#94a3b8" stroke="#64748b" stroke-width="1.5"/><circle cx="16" cy="28" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="16" cy="28" r="4.5" fill="#0f172a"/><circle cx="15.5" cy="27" r="1.5" fill="white"/><path d="M22 38 L18 44 L26 44 L30 38" fill="white" stroke="#334155" stroke-width="2" stroke-linejoin="round"/><path d="M30 44 L34 50 L38 44" fill="white" stroke="#334155" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="38" cy="22" rx="13" ry="6" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M16 8 Q28 0 30 8Z" fill="#334155" stroke="#1e293b" stroke-width="2.5"/><ellipse cx="33" cy="30" rx="28" ry="20" fill="#334155" stroke="#1e293b" stroke-width="3"/><path d="M61 30 Q68 18 68 30 Q66 42 61 40Z" fill="#334155" stroke="#1e293b" stroke-width="2"/><ellipse cx="33" cy="43" rx="22" ry="12" fill="#64748b" stroke="#475569" stroke-width="2"/><circle cx="14" cy="27" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="14" cy="27" r="5.5" fill="#0f172a"/><circle cx="13.5" cy="25.5" r="2" fill="white"/><path d="M20 38 L16 46 L26 46 L30 38" fill="white" stroke="#1e293b" stroke-width="2.5" stroke-linejoin="round"/><path d="M30 46 L34 52 L38 46 L42 52 L46 46" fill="white" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/><circle cx="46" cy="10" r="5" fill="#fbbf24" stroke="#b45309" stroke-width="2"/><path d="M44 8 L46 4 L48 8" fill="#fbbf24" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="40" cy="20" rx="14" ry="6" fill="white" opacity="0.15"/></svg>'
   ],
   lbl:['Micro-Organisme','Bangelijk Visje','Tropisch Toerist','Jonge Haai','Grote Witte Examendoder'],
   desc:['Zo klein dat niemand je ziet. Voordeel bij tentamens.','Zwemt in cirkels rond de studiezaal.','Kleurrijk maar nog steeds geen antwoord op vraag 3.','Bijt alvast in de examenbundel. Ter voorbereiding.','Elke vraag is voedsel. Verslindt ze allemaal.'],
   evoMsg:['🐟 Je Haai zwemt! Een beetje wiebelig nog.','🐠 Je Haai is tropisch! Nog niet gevaarlijk, wel mooi.','🦈 JE HAAI HAS ARRIVED! DUM DUM DUM DUM DUM DUM...','🦈🦈 GROTE WITTE EXAMENDODER ONTGRENDELD! Vrees het water.']},
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
  {id:'eenhoorn', n:'Eenhoorn', s:['','','','',''], fallback:['🐾','🐴','🐎','🏇','🦄'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M15 18 Q12 28 13 38 Q16 50 30 52 Q44 50 47 38 Q48 28 45 18 Q40 8 30 8 Q20 8 15 18Z" fill="#fef9ee" stroke="#d4b896" stroke-width="2.5"/><ellipse cx="30" cy="47" rx="11" ry="6" fill="#f0d9c8" stroke="#d4b896" stroke-width="1.5"/><path d="M16 16 L11 4 L25 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M17 15 L13 6 L24 11Z" fill="#fda4af"/><path d="M44 16 L49 4 L35 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M43 15 L47 6 L36 11Z" fill="#fda4af"/><path d="M26 10 Q21 18 19 26" stroke="#fde68a" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.8"/><ellipse cx="21" cy="29" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="39" cy="29" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="21" cy="29" rx="3.5" ry="4.5" fill="#7c3aed"/><ellipse cx="39" cy="29" rx="3.5" ry="4.5" fill="#7c3aed"/><ellipse cx="21" cy="29" rx="1.8" ry="2.2" fill="#1a0a00"/><ellipse cx="39" cy="29" rx="1.8" ry="2.2" fill="#1a0a00"/><circle cx="20" cy="27" r="1.2" fill="white"/><circle cx="38" cy="27" r="1.2" fill="white"/><ellipse cx="14" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.4"/><ellipse cx="46" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.4"/><ellipse cx="25" cy="47" rx="3" ry="2" fill="#d4b896"/><ellipse cx="35" cy="47" rx="3" ry="2" fill="#d4b896"/><path d="M25 51 Q30 54 35 51" stroke="#d4b896" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M15 18 Q12 28 13 38 Q16 50 30 52 Q44 50 47 38 Q48 28 45 18 Q40 8 30 8 Q20 8 15 18Z" fill="#fef9ee" stroke="#d4b896" stroke-width="2.5"/><ellipse cx="30" cy="47" rx="11" ry="6" fill="#f0d9c8" stroke="#d4b896" stroke-width="1.5"/><path d="M16 16 L11 4 L25 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M17 15 L13 6 L24 11Z" fill="#fda4af"/><path d="M44 16 L49 4 L35 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M43 15 L47 6 L36 11Z" fill="#fda4af"/><ellipse cx="30" cy="8" rx="3.5" ry="4" fill="#fde68a" stroke="#d97706" stroke-width="1.5"/><path d="M26 10 Q19 20 17 28" stroke="#fbbf24" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M28 9 Q23 18 21 26" stroke="#f9a8d4" stroke-width="4" stroke-linecap="round" fill="none"/><ellipse cx="21" cy="29" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="39" cy="29" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="21" cy="29" rx="3.5" ry="4.5" fill="#7c3aed"/><ellipse cx="39" cy="29" rx="3.5" ry="4.5" fill="#7c3aed"/><ellipse cx="21" cy="29" rx="1.8" ry="2.2" fill="#1a0a00"/><ellipse cx="39" cy="29" rx="1.8" ry="2.2" fill="#1a0a00"/><circle cx="20" cy="27" r="1.2" fill="white"/><circle cx="38" cy="27" r="1.2" fill="white"/><ellipse cx="14" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.4"/><ellipse cx="46" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.4"/><ellipse cx="25" cy="47" rx="3" ry="2" fill="#d4b896"/><ellipse cx="35" cy="47" rx="3" ry="2" fill="#d4b896"/><path d="M25 51 Q30 54 35 51" stroke="#d4b896" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M15 18 Q12 28 13 38 Q16 50 30 52 Q44 50 47 38 Q48 28 45 18 Q40 8 30 8 Q20 8 15 18Z" fill="#fef9ee" stroke="#d4b896" stroke-width="2.5"/><ellipse cx="30" cy="47" rx="11" ry="6" fill="#f0d9c8" stroke="#d4b896" stroke-width="1.5"/><path d="M16 16 L11 3 L25 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M17 15 L13 5 L24 11Z" fill="#f472b6"/><path d="M44 16 L49 3 L35 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M43 15 L47 5 L36 11Z" fill="#c084fc"/><polygon points="30,1 27,12 33,12" fill="#fde68a" stroke="#d97706" stroke-width="2"/><path d="M30 1 Q28 6 30 12" stroke="#fb923c" stroke-width="2" fill="none" opacity="0.85"/><path d="M25 10 Q17 22 15 32" stroke="#f472b6" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M27 9 Q21 20 19 30" stroke="#c084fc" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M13 18 Q3 30 5 44" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" fill="none"/><ellipse cx="21" cy="28" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="39" cy="28" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="21" cy="28" rx="3.5" ry="4.5" fill="#a855f7"/><ellipse cx="39" cy="28" rx="3.5" ry="4.5" fill="#a855f7"/><ellipse cx="21" cy="28" rx="1.8" ry="2.2" fill="#1a0a00"/><ellipse cx="39" cy="28" rx="1.8" ry="2.2" fill="#1a0a00"/><circle cx="20" cy="26" r="1.2" fill="white"/><circle cx="38" cy="26" r="1.2" fill="white"/><ellipse cx="14" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.4"/><ellipse cx="46" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.4"/><ellipse cx="25" cy="47" rx="3" ry="2" fill="#d4b896"/><ellipse cx="35" cy="47" rx="3" ry="2" fill="#d4b896"/><path d="M25 51 Q30 54 35 51" stroke="#d4b896" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="14" r="1.5" fill="#fbbf24"/><circle cx="53" cy="14" r="1.5" fill="#f472b6"/><circle cx="5" cy="9" r="1" fill="#c084fc"/><circle cx="55" cy="9" r="1" fill="#60a5fa"/><path d="M15 18 Q12 28 13 38 Q16 50 30 52 Q44 50 47 38 Q48 28 45 18 Q40 8 30 8 Q20 8 15 18Z" fill="#fef9ee" stroke="#d4b896" stroke-width="2.5"/><ellipse cx="30" cy="47" rx="11" ry="6" fill="#f0d9c8" stroke="#d4b896" stroke-width="1.5"/><path d="M16 16 L10 2 L25 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M17 15 L12 4 L24 11Z" fill="#f472b6"/><path d="M44 16 L50 2 L35 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M43 15 L48 4 L36 11Z" fill="#c084fc"/><polygon points="30,-1 26,13 34,13" fill="#fde68a" stroke="#d97706" stroke-width="2"/><path d="M30 -1 Q27 6 30 13" stroke="#fb923c" stroke-width="2" fill="none" opacity="0.9"/><path d="M30 -1 Q33 6 30 13" stroke="#f472b6" stroke-width="1.5" fill="none" opacity="0.7"/><path d="M24 10 Q14 24 12 36" stroke="#f472b6" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M26 9 Q18 22 16 34" stroke="#fb923c" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M28 8 Q22 20 20 32" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M11 18 Q1 28 2 44" stroke="#c084fc" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M10 22 Q0 32 1 48" stroke="#818cf8" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M49 18 Q59 28 58 44" stroke="#60a5fa" stroke-width="5" stroke-linecap="round" fill="none"/><ellipse cx="21" cy="28" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="39" cy="28" rx="5.5" ry="6.5" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="21" cy="28" rx="3.5" ry="4.5" fill="#7c3aed"/><ellipse cx="39" cy="28" rx="3.5" ry="4.5" fill="#7c3aed"/><ellipse cx="21" cy="28" rx="1.8" ry="2.2" fill="#1a0a00"/><ellipse cx="39" cy="28" rx="1.8" ry="2.2" fill="#1a0a00"/><circle cx="20" cy="26" r="1.2" fill="white"/><circle cx="38" cy="26" r="1.2" fill="white"/><ellipse cx="14" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.45"/><ellipse cx="46" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.45"/><ellipse cx="25" cy="47" rx="3" ry="2" fill="#d4b896"/><ellipse cx="35" cy="47" rx="3" ry="2" fill="#d4b896"/><path d="M24 51 Q30 55 36 51" stroke="#c084fc" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="1" r="2" fill="#fbbf24"/><circle cx="20" cy="4" r="1.5" fill="#f472b6"/><circle cx="40" cy="4" r="1.5" fill="#a78bfa"/><circle cx="10" cy="10" r="1.5" fill="#60a5fa"/><circle cx="50" cy="10" r="1.5" fill="#4ade80"/><circle cx="5" cy="6" r="1" fill="#fb923c"/><path d="M15 18 Q12 28 13 38 Q16 50 30 52 Q44 50 47 38 Q48 28 45 18 Q40 8 30 8 Q20 8 15 18Z" fill="#fef9ee" stroke="#d4b896" stroke-width="2.5"/><ellipse cx="30" cy="47" rx="11" ry="6" fill="#f0d9c8" stroke="#d4b896" stroke-width="1.5"/><path d="M15 16 L9 2 L24 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M16 15 L11 4 L23 11Z" fill="#f472b6"/><path d="M45 16 L51 2 L36 11Z" fill="#fef9ee" stroke="#d4b896" stroke-width="1.5"/><path d="M44 15 L49 4 L37 11Z" fill="#c084fc"/><polygon points="30,-3 25,14 35,14" fill="#fde68a" stroke="#d97706" stroke-width="2"/><path d="M30 -3 Q26 5 30 14" stroke="#fb923c" stroke-width="2.5" fill="none" opacity="0.9"/><path d="M30 -3 Q34 5 30 14" stroke="#f472b6" stroke-width="2" fill="none" opacity="0.8"/><path d="M30 -3 Q27 10 30 14" stroke="#a78bfa" stroke-width="1.5" fill="none" opacity="0.7"/><circle cx="30" cy="0" r="2" fill="white" opacity="0.95"/><path d="M23 10 Q12 26 10 38" stroke="#f472b6" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M25 9 Q16 24 14 36" stroke="#fb923c" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M27 8 Q20 22 18 34" stroke="#fbbf24" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M29 8 Q24 20 22 32" stroke="#4ade80" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M11 16 Q0 28 1 44" stroke="#c084fc" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M10 20 Q-1 32 0 48" stroke="#818cf8" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M9 24 Q-2 36 -1 52" stroke="#60a5fa" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M49 16 Q60 28 59 44" stroke="#a78bfa" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M50 20 Q61 32 60 48" stroke="#f9a8d4" stroke-width="5" stroke-linecap="round" fill="none"/><ellipse cx="21" cy="27" rx="6" ry="7" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="39" cy="27" rx="6" ry="7" fill="white" stroke="#7c5533" stroke-width="1.5"/><ellipse cx="21" cy="27" rx="4" ry="5.5" fill="#6d28d9"/><ellipse cx="39" cy="27" rx="4" ry="5.5" fill="#6d28d9"/><ellipse cx="21" cy="27" rx="2" ry="2.8" fill="#1a0a00"/><ellipse cx="39" cy="27" rx="2" ry="2.8" fill="#1a0a00"/><circle cx="20" cy="25" r="1.5" fill="white"/><circle cx="38" cy="25" r="1.5" fill="white"/><ellipse cx="13" cy="37" rx="5" ry="3" fill="#fda4af" opacity="0.5"/><ellipse cx="47" cy="37" rx="5" ry="3" fill="#fda4af" opacity="0.5"/><ellipse cx="25" cy="47" rx="3" ry="2" fill="#d4b896"/><ellipse cx="35" cy="47" rx="3" ry="2" fill="#d4b896"/><path d="M23 51 Q30 56 37 51" stroke="#c084fc" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>'
   ],
   lbl:['Verlegen Veulen','Gewoon Paard','Ongeduldig Renpaard','Racend naar de Finish','Magisch Eenhoorn'],
   desc:['Wil eigenlijk al een eenhoorn zijn. Heeft geduld.','100% paard. 0% magie. Werkt hard ter compensatie.','Rent harder dan de tijd. Haalt deadlines dus altijd.','Stof vliegt op. Surveillant moet wegkijken.','Spreidt sprankels over het examenpapier. Slaagt altijd.'],
   evoMsg:['🐴 Je Eenhoorn dribbelt al! Nog geen hoorn maar goed.','🐎 Je Eenhoorn galoppeeert! De maan is het doel.','🏇 RENPAARD! Sprint naar die 10 als de wind!','🦄 MAGISCH EENHOORN ONTGRENDELD! Regenbogen en alles.']},
  {id:'vos', n:'Vos', s:['','','','',''], fallback:['🐾','🐶','🐕','🦝','🦊'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="19" cy="20" rx="7" ry="11" fill="#fb923c" stroke="#c2410c" stroke-width="2.5" transform="rotate(-15,19,20)"/><ellipse cx="41" cy="20" rx="7" ry="11" fill="#fb923c" stroke="#c2410c" stroke-width="2.5" transform="rotate(15,41,20)"/><ellipse cx="19" cy="20" rx="4" ry="7" fill="#fda4af" transform="rotate(-15,19,20)"/><ellipse cx="41" cy="20" rx="4" ry="7" fill="#fda4af" transform="rotate(15,41,20)"/><circle cx="30" cy="36" r="18" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/><circle cx="22" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="31" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="31" r="3.5" fill="#92400e"/><circle cx="38" cy="31" r="3.5" fill="#92400e"/><circle cx="22" cy="31" r="1.8" fill="#1a0a00"/><circle cx="38" cy="31" r="1.8" fill="#1a0a00"/><circle cx="21" cy="30" r="1" fill="white"/><circle cx="37" cy="30" r="1" fill="white"/><ellipse cx="30" cy="39" rx="3" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="23" cy="26" rx="7" ry="4" fill="white" opacity="0.25"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="17" cy="18" rx="7" ry="12" fill="#fb923c" stroke="#c2410c" stroke-width="2" transform="rotate(-12,17,18)"/><ellipse cx="43" cy="18" rx="7" ry="12" fill="#fb923c" stroke="#c2410c" stroke-width="2" transform="rotate(12,43,18)"/><ellipse cx="17" cy="18" rx="4" ry="7" fill="#fda4af" transform="rotate(-12,17,18)"/><ellipse cx="43" cy="18" rx="4" ry="7" fill="#fda4af" transform="rotate(12,43,18)"/><circle cx="30" cy="35" r="19" fill="#f97316" stroke="#c2410c" stroke-width="3"/><ellipse cx="30" cy="44" rx="12" ry="8" fill="#fff7ed" stroke="#fed7aa" stroke-width="1.5"/><circle cx="22" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="30" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="30" r="3.5" fill="#92400e"/><circle cx="38" cy="30" r="3.5" fill="#92400e"/><circle cx="22" cy="30" r="1.8" fill="#1a0a00"/><circle cx="38" cy="30" r="1.8" fill="#1a0a00"/><circle cx="21" cy="29" r="1" fill="white"/><circle cx="37" cy="29" r="1" fill="white"/><ellipse cx="30" cy="40" rx="3.5" ry="2.5" fill="#fda4af" stroke="#be185d" stroke-width="1"/><ellipse cx="22" cy="25" rx="8" ry="4" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="15" cy="17" rx="7" ry="13" fill="#ea580c" stroke="#c2410c" stroke-width="2.5" transform="rotate(-10,15,17)"/><ellipse cx="45" cy="17" rx="7" ry="13" fill="#ea580c" stroke="#c2410c" stroke-width="2.5" transform="rotate(10,45,17)"/><ellipse cx="15" cy="17" rx="4" ry="8" fill="#fda4af" transform="rotate(-10,15,17)"/><ellipse cx="45" cy="17" rx="4" ry="8" fill="#fda4af" transform="rotate(10,45,17)"/><circle cx="30" cy="34" r="20" fill="#ea580c" stroke="#c2410c" stroke-width="3"/><ellipse cx="30" cy="44" rx="13" ry="9" fill="#fff7ed" stroke="#fed7aa" stroke-width="1.5"/><circle cx="22" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="29" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="29" r="4" fill="#fbbf24"/><circle cx="38" cy="29" r="4" fill="#fbbf24"/><circle cx="22" cy="29" r="2" fill="#1a0a00"/><circle cx="38" cy="29" r="2" fill="#1a0a00"/><circle cx="21" cy="28" r="1" fill="white"/><circle cx="37" cy="28" r="1" fill="white"/><ellipse cx="30" cy="40" rx="4" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><ellipse cx="22" cy="24" rx="9" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="13" cy="15" rx="7" ry="13" fill="#92400e" stroke="#78350f" stroke-width="2.5" transform="rotate(-8,13,15)"/><ellipse cx="47" cy="15" rx="7" ry="13" fill="#92400e" stroke="#78350f" stroke-width="2.5" transform="rotate(8,47,15)"/><ellipse cx="13" cy="15" rx="4" ry="8" fill="#d97706" transform="rotate(-8,13,15)"/><ellipse cx="47" cy="15" rx="4" ry="8" fill="#d97706" transform="rotate(8,47,15)"/><circle cx="30" cy="33" r="21" fill="#92400e" stroke="#78350f" stroke-width="3"/><ellipse cx="30" cy="43" rx="14" ry="10" fill="#fde68a" stroke="#d4b8a0" stroke-width="1.5"/><circle cx="22" cy="28" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="28" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="28" r="4.5" fill="#d97706"/><circle cx="38" cy="28" r="4.5" fill="#d97706"/><circle cx="22" cy="28" r="2.2" fill="#1a0a00"/><circle cx="38" cy="28" r="2.2" fill="#1a0a00"/><circle cx="21" cy="27" r="1.2" fill="white"/><circle cx="37" cy="27" r="1.2" fill="white"/><ellipse cx="30" cy="39" rx="4" ry="3" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><ellipse cx="22" cy="22" rx="10" ry="4.5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="13" rx="7" ry="13" fill="#c2410c" stroke="#7c2d12" stroke-width="2.5" transform="rotate(-6,12,13)"/><ellipse cx="48" cy="13" rx="7" ry="13" fill="#c2410c" stroke="#7c2d12" stroke-width="2.5" transform="rotate(6,48,13)"/><ellipse cx="12" cy="13" rx="4" ry="8" fill="#fde68a" transform="rotate(-6,12,13)"/><ellipse cx="48" cy="13" rx="4" ry="8" fill="#fde68a" transform="rotate(6,48,13)"/><circle cx="30" cy="32" r="22" fill="#c2410c" stroke="#7c2d12" stroke-width="3"/><ellipse cx="30" cy="43" rx="15" ry="10" fill="#fff7ed" stroke="#fed7aa" stroke-width="2"/><circle cx="21" cy="28" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="28" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="28" r="5" fill="#fbbf24"/><circle cx="39" cy="28" r="5" fill="#fbbf24"/><circle cx="21" cy="28" r="2.5" fill="#1a0a00"/><circle cx="39" cy="28" r="2.5" fill="#1a0a00"/><circle cx="20" cy="27" r="1.2" fill="white"/><circle cx="38" cy="27" r="1.2" fill="white"/><ellipse cx="30" cy="40" rx="4.5" ry="3.5" fill="#fda4af" stroke="#be185d" stroke-width="1.5"/><path d="M24 46 Q30 51 36 46" stroke="#7c2d12" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="22" rx="11" ry="5" fill="white" opacity="0.18"/></svg>'
   ],
   lbl:['Sluw Welpje','Grappig Puppy','Slimme Hond','Schrandere Wasbeer','Listige Vos'],
   desc:['Kijkt al slim. Weet nog niks, maar kijkt slim.','Blij en dom. Een goede combinatie.','Slimmer dan het eruitziet. Maar dat weet het zelf al.','Wast zijn poten na elke quiz. Hygiënisch.','Overtuigt de examinator dat alles goed was. En dat klopt.'],
   evoMsg:['🐶 Je Vos kwispelt slim! (Strategisch kwispelen.)','🐕 Je Vos wordt slimmer. En het weet dat je dat weet.','🦝 WASBEER MODUS! Wast zijn handen na een perfecte score.','🦊 LISTIGE VOS! Niemand zag de 10 komen. De vos wel.']},
  {id:'uil', n:'Uil', s:['','','','',''], fallback:['🥚','🐣','🐥','🐦','🦉'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="35" rx="15" ry="18" fill="#1e293b" stroke="#334155" stroke-width="3"/><path d="M22 20 L26 14 L30 20" stroke="#fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 20 L34 14 L38 20" stroke="#fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="24" cy="27" rx="6" ry="3.5" fill="#475569" opacity="0.5"/><circle cx="29" cy="31" r="3" fill="#fbbf24" opacity="0.4"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="18" cy="18" rx="6" ry="10" fill="#b45309" stroke="#92400e" stroke-width="2" transform="rotate(-15,18,18)"/><ellipse cx="42" cy="18" rx="6" ry="10" fill="#b45309" stroke="#92400e" stroke-width="2" transform="rotate(15,42,18)"/><ellipse cx="18" cy="18" rx="3.5" ry="6" fill="#fde68a" transform="rotate(-15,18,18)"/><ellipse cx="42" cy="18" rx="3.5" ry="6" fill="#fde68a" transform="rotate(15,42,18)"/><circle cx="30" cy="36" r="18" fill="#d97706" stroke="#92400e" stroke-width="3"/><circle cx="22" cy="30" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="30" r="7" fill="white" stroke="#1a0a00" stroke-width="2"/><path d="M17 29 L27 29" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/><path d="M33 29 L43 29" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/><circle cx="22" cy="31" r="3" fill="#1a0a00"/><circle cx="38" cy="31" r="3" fill="#1a0a00"/><circle cx="21.5" cy="30" r="1" fill="white"/><circle cx="37.5" cy="30" r="1" fill="white"/><polygon points="30,36 27.5,40 32.5,40" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/><ellipse cx="24" cy="25" rx="7" ry="4" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="16" rx="6" ry="11" fill="#92400e" stroke="#78350f" stroke-width="2.5" transform="rotate(-12,16,16)"/><ellipse cx="44" cy="16" rx="6" ry="11" fill="#92400e" stroke="#78350f" stroke-width="2.5" transform="rotate(12,44,16)"/><ellipse cx="16" cy="16" rx="3.5" ry="7" fill="#fde68a" transform="rotate(-12,16,16)"/><ellipse cx="44" cy="16" rx="3.5" ry="7" fill="#fde68a" transform="rotate(12,44,16)"/><circle cx="30" cy="34" r="20" fill="#b45309" stroke="#78350f" stroke-width="3"/><circle cx="22" cy="27" r="8" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="27" r="8" fill="white" stroke="#1a0a00" stroke-width="2"/><path d="M16 25 L28 25" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/><path d="M32 25 L44 25" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/><circle cx="22" cy="27" r="5" fill="#fde68a"/><circle cx="38" cy="27" r="5" fill="#fde68a"/><circle cx="22" cy="27" r="3" fill="#1a0a00"/><circle cx="38" cy="27" r="3" fill="#1a0a00"/><circle cx="21.5" cy="26" r="1" fill="white"/><circle cx="37.5" cy="26" r="1" fill="white"/><polygon points="30,34 27.5,38 32.5,38" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/><ellipse cx="23" cy="22" rx="8" ry="4" fill="white" opacity="0.2"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="14" cy="14" rx="6" ry="11" fill="#78350f" stroke="#1a0a00" stroke-width="2.5" transform="rotate(-10,14,14)"/><ellipse cx="46" cy="14" rx="6" ry="11" fill="#78350f" stroke="#1a0a00" stroke-width="2.5" transform="rotate(10,46,14)"/><ellipse cx="14" cy="14" rx="3.5" ry="7" fill="#d97706" transform="rotate(-10,14,14)"/><ellipse cx="46" cy="14" rx="3.5" ry="7" fill="#d97706" transform="rotate(10,46,14)"/><circle cx="30" cy="33" r="22" fill="#92400e" stroke="#1a0a00" stroke-width="3"/><circle cx="21" cy="26" r="9" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="26" r="9" fill="white" stroke="#1a0a00" stroke-width="2"/><path d="M14 23 L28 23" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/><path d="M32 23 L46 23" stroke="#1a0a00" stroke-width="3" stroke-linecap="round"/><circle cx="21" cy="26" r="6" fill="#fde68a"/><circle cx="39" cy="26" r="6" fill="#fde68a"/><circle cx="21" cy="26" r="3.5" fill="#1a0a00"/><circle cx="39" cy="26" r="3.5" fill="#1a0a00"/><circle cx="20.5" cy="25" r="1.2" fill="white"/><circle cx="38.5" cy="25" r="1.2" fill="white"/><polygon points="30,33 27,37 33,37" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/><ellipse cx="23" cy="20" rx="9" ry="4.5" fill="white" opacity="0.18"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M12 12 L16 4 L20 12 L24 5 L30 12 L36 5 L40 12 L44 4 L48 12Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="6" ry="11" fill="#92400e" stroke="#1a0a00" stroke-width="2" transform="rotate(-10,12,12)"/><ellipse cx="48" cy="12" rx="6" ry="11" fill="#92400e" stroke="#1a0a00" stroke-width="2" transform="rotate(10,48,12)"/><ellipse cx="12" cy="12" rx="3.5" ry="7" fill="#fbbf24" transform="rotate(-10,12,12)"/><ellipse cx="48" cy="12" rx="3.5" ry="7" fill="#fbbf24" transform="rotate(10,48,12)"/><circle cx="30" cy="32" r="23" fill="#78350f" stroke="#1a0a00" stroke-width="3"/><circle cx="21" cy="25" r="10" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="25" r="10" fill="white" stroke="#1a0a00" stroke-width="2"/><path d="M13 22 L29 22" stroke="#1a0a00" stroke-width="3.5" stroke-linecap="round"/><path d="M31 22 L47 22" stroke="#1a0a00" stroke-width="3.5" stroke-linecap="round"/><circle cx="21" cy="25" r="7.5" fill="#fbbf24"/><circle cx="39" cy="25" r="7.5" fill="#fbbf24"/><circle cx="21" cy="25" r="4.5" fill="#1a0a00"/><circle cx="39" cy="25" r="4.5" fill="#1a0a00"/><circle cx="20.5" cy="24" r="1.8" fill="white"/><circle cx="38.5" cy="24" r="1.8" fill="white"/><polygon points="30,33 27,38 33,38" fill="#f97316" stroke="#c2410c" stroke-width="2"/><ellipse cx="23" cy="19" rx="10" ry="5" fill="white" opacity="0.18"/></svg>'
   ],
   lbl:['Nachtelijk Ei','Suf Kuiken','Knipper-Kuiken','Brildrager-Vogel','Alwetende Uil'],
   desc:['Slaapt door de dag. Studeert om 3 uur \'s nachts.','Ziet er moe uit. IS moe. Studeert toch.','Knippert verward bij elke vraag. Geeft altijd het goede antwoord.','Heeft een bril nodig maar weigert dat toe te geven.','Weet het antwoord al voor de vraag gesteld wordt.'],
   evoMsg:['🐣 Je Uil wordt wakker! Om 14:00. Goed geslapen.','🐥 Je Uil knippert van begrip!','🐦 Je Uil ziet ALLES. Zelfs de valkuilvragen.','🦉 ALWETENDE UIL! "Whooo" heeft er een 10? Jij.']},
  {id:'octopus', n:'Octopus', s:['','','','',''], fallback:['🐚','🦐','🦞','🦑','🐙'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="16" fill="#fda4af" stroke="#be185d" stroke-width="3"/><ellipse cx="25" cy="26" rx="6" ry="3.5" fill="white" opacity="0.35"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="26" r="18" fill="#fda4af" stroke="#be185d" stroke-width="3"/><circle cx="23" cy="22" r="5.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="37" cy="22" r="5.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="23" cy="22" r="3" fill="#be185d"/><circle cx="37" cy="22" r="3" fill="#be185d"/><circle cx="23" cy="22" r="1.5" fill="#1a0a00"/><circle cx="37" cy="22" r="1.5" fill="#1a0a00"/><circle cx="22.5" cy="21" r="0.8" fill="white"/><circle cx="36.5" cy="21" r="0.8" fill="white"/><path d="M19 40 Q18 50 16 56" stroke="#fda4af" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M41 40 Q42 50 44 56" stroke="#fda4af" stroke-width="5" stroke-linecap="round" fill="none"/><ellipse cx="24" cy="18" rx="6" ry="3.5" fill="white" opacity="0.3"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="24" r="20" fill="#fb7185" stroke="#be185d" stroke-width="3"/><circle cx="22" cy="20" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="20" r="6" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="20" r="3.5" fill="#be185d"/><circle cx="38" cy="20" r="3.5" fill="#be185d"/><circle cx="22" cy="20" r="1.8" fill="#1a0a00"/><circle cx="38" cy="20" r="1.8" fill="#1a0a00"/><circle cx="21.5" cy="19" r="1" fill="white"/><circle cx="37.5" cy="19" r="1" fill="white"/><path d="M14 38 Q12 48 10 56" stroke="#fda4af" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M22 40 Q20 50 18 58" stroke="#fda4af" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M38 40 Q40 50 42 58" stroke="#fda4af" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M46 38 Q48 48 50 56" stroke="#fda4af" stroke-width="5" stroke-linecap="round" fill="none"/><ellipse cx="24" cy="16" rx="8" ry="4" fill="white" opacity="0.25"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="22" r="22" fill="#c026d3" stroke="#86198f" stroke-width="3"/><circle cx="22" cy="18" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="38" cy="18" r="6.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="22" cy="18" r="4" fill="#9333ea"/><circle cx="38" cy="18" r="4" fill="#9333ea"/><circle cx="22" cy="18" r="2" fill="#1a0a00"/><circle cx="38" cy="18" r="2" fill="#1a0a00"/><circle cx="21.5" cy="17" r="1" fill="white"/><circle cx="37.5" cy="17" r="1" fill="white"/><path d="M10 38 Q6 48 4 58" stroke="#c026d3" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M17 41 Q14 51 12 60" stroke="#c026d3" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M24 42 Q22 52 20 60" stroke="#a21caf" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M36 42 Q38 52 40 60" stroke="#a21caf" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M43 41 Q46 51 48 60" stroke="#c026d3" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M50 38 Q54 48 56 58" stroke="#c026d3" stroke-width="5" stroke-linecap="round" fill="none"/><ellipse cx="23" cy="13" rx="9" ry="4.5" fill="white" opacity="0.22"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M14 6 L18 0 L22 6 L26 1 L30 6 L34 1 L38 6 L42 0 L46 6Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><circle cx="30" cy="22" r="22" fill="#7c3aed" stroke="#4c1d95" stroke-width="3"/><circle cx="21" cy="18" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="39" cy="18" r="7.5" fill="white" stroke="#1a0a00" stroke-width="2"/><circle cx="21" cy="18" r="5" fill="#4c1d95"/><circle cx="39" cy="18" r="5" fill="#4c1d95"/><circle cx="21" cy="18" r="2.5" fill="#1a0a00"/><circle cx="39" cy="18" r="2.5" fill="#1a0a00"/><circle cx="20.5" cy="17" r="1.2" fill="white"/><circle cx="38.5" cy="17" r="1.2" fill="white"/><path d="M7 37 Q2 48 0 58" stroke="#7c3aed" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M13 40 Q10 51 8 60" stroke="#6d28d9" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M20 42 Q18 53 16 62" stroke="#7c3aed" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M30 44 Q30 55 30 64" stroke="#4c1d95" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M40 42 Q42 53 44 62" stroke="#7c3aed" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M47 40 Q50 51 52 60" stroke="#6d28d9" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M53 37 Q58 48 60 58" stroke="#7c3aed" stroke-width="5.5" stroke-linecap="round" fill="none"/><ellipse cx="23" cy="13" rx="10" ry="5" fill="white" opacity="0.2"/></svg>'
   ],
   lbl:['Leeg Schelpje','Nerveuze Garnaal','Hummerige Kreeft','Inktspuwende Inktvis','Acht-Armige Meester'],
   desc:['Leeg maar potentievol. Net als jij op dag 1.','Springt schrikachtig omhoog bij elke toets.','Knijpt in zijn klauwen bij open vragen. Doet het goed.','Spuugt inkt als het antwoord fout is. Soms op het papier.','Acht armen, acht vakken tegelijk. Multitasken pro.'],
   evoMsg:['🦐 Je Octopus springt van schrik! Een kleine garnaal.','🦞 Je Octopus knijpt van trots! KNEEP.','🦑 INKTVIS! Spuugt inkt bij fout antwoord. Opletten.','🐙 ACHT ARMEN! Doet 8 vakken tegelijk. Indrukwekkend.']},
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
  {id:'slang', n:'Slang', s:['','','','',''], fallback:['🥚','🐛','🦎','🐍','🐉'],
   svg:[
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="35" rx="17" ry="21" fill="#f0fdf4" stroke="#86efac" stroke-width="2.5"/><ellipse cx="22" cy="22" rx="7" ry="4" fill="white" opacity="0.6"/><path d="M30 14 L28 20 L32 25 L27 32" stroke="#4ade80" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="24" cy="36" rx="3.5" ry="3" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/><ellipse cx="24" cy="36" rx="0.8" ry="2.5" fill="#14532d"/><ellipse cx="36" cy="36" rx="3.5" ry="3" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/><ellipse cx="36" cy="36" rx="0.8" ry="2.5" fill="#14532d"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="33" rx="18" ry="16" fill="#86efac" stroke="#16a34a" stroke-width="2.5"/><ellipse cx="20" cy="24" rx="8" ry="4" fill="white" opacity="0.28"/><circle cx="25" cy="36" r="1.5" fill="#4ade80" opacity="0.7"/><circle cx="30" cy="38" r="1.5" fill="#4ade80" opacity="0.7"/><circle cx="35" cy="36" r="1.5" fill="#4ade80" opacity="0.7"/><circle cx="22" cy="27" r="5.5" fill="white" stroke="#15803d" stroke-width="1.5"/><circle cx="38" cy="27" r="5.5" fill="white" stroke="#15803d" stroke-width="1.5"/><ellipse cx="22" cy="27" rx="1.2" ry="4" fill="#14532d"/><ellipse cx="38" cy="27" rx="1.2" ry="4" fill="#14532d"/><circle cx="21" cy="25" r="1.2" fill="white"/><circle cx="37" cy="25" r="1.2" fill="white"/><path d="M28 44 L30 48 L32 44" stroke="#f87171" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M12 42 Q9 28 16 16 Q22 8 30 7 Q38 8 44 16 Q51 28 48 42 Q42 54 30 55 Q18 54 12 42Z" fill="#4ade80" stroke="#16a34a" stroke-width="2.5"/><ellipse cx="21" cy="18" rx="9" ry="4" fill="white" opacity="0.22"/><path d="M14 34 Q22 30 30 32 Q38 30 46 34" stroke="#22c55e" stroke-width="1.2" fill="none" opacity="0.55"/><path d="M14 40 Q22 36 30 38 Q38 36 46 40" stroke="#22c55e" stroke-width="1.2" fill="none" opacity="0.55"/><circle cx="22" cy="25" r="6.5" fill="white" stroke="#14532d" stroke-width="1.5"/><circle cx="38" cy="25" r="6.5" fill="white" stroke="#14532d" stroke-width="1.5"/><circle cx="22" cy="25" r="4" fill="#fde68a"/><circle cx="38" cy="25" r="4" fill="#fde68a"/><ellipse cx="22" cy="25" rx="1.3" ry="3.5" fill="#14532d"/><ellipse cx="38" cy="25" rx="1.3" ry="3.5" fill="#14532d"/><circle cx="21" cy="23" r="1.2" fill="white"/><circle cx="37" cy="23" r="1.2" fill="white"/><path d="M27 44 L29 50 L31 44 L33 50 L35 44" stroke="#ef4444" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M8 44 Q6 26 14 14 Q22 4 34 4 Q46 4 52 16 Q58 30 56 44 Q48 58 30 58 Q12 58 8 44Z" fill="#22c55e" stroke="#15803d" stroke-width="2.5"/><ellipse cx="20" cy="16" rx="10" ry="4.5" fill="white" opacity="0.18"/><path d="M10 36 Q20 31 30 33 Q40 31 50 36" stroke="#16a34a" stroke-width="1.5" fill="none" opacity="0.6"/><path d="M10 42 Q20 37 30 39 Q40 37 50 42" stroke="#16a34a" stroke-width="1.5" fill="none" opacity="0.6"/><path d="M12 30 Q20 26 28 28" stroke="#16a34a" stroke-width="1.5" fill="none" opacity="0.6"/><path d="M32 28 Q40 26 48 30" stroke="#16a34a" stroke-width="1.5" fill="none" opacity="0.6"/><circle cx="21" cy="24" r="7" fill="white" stroke="#14532d" stroke-width="1.5"/><circle cx="39" cy="24" r="7" fill="white" stroke="#14532d" stroke-width="1.5"/><circle cx="21" cy="24" r="5" fill="#f59e0b"/><circle cx="39" cy="24" r="5" fill="#f59e0b"/><ellipse cx="21" cy="24" rx="1.5" ry="4.5" fill="#14532d"/><ellipse cx="39" cy="24" rx="1.5" ry="4.5" fill="#14532d"/><circle cx="20" cy="22" r="1.4" fill="white"/><circle cx="38" cy="22" r="1.4" fill="white"/><circle cx="27" cy="38" r="1.2" fill="#15803d"/><circle cx="33" cy="38" r="1.2" fill="#15803d"/><path d="M25 46 L27 53 L30 46 L33 53 L35 46" stroke="#ef4444" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M6 44 Q4 24 14 12 Q22 2 34 2 Q46 2 54 14 Q60 28 58 44 Q50 60 30 60 Q10 60 6 44Z" fill="#166534" stroke="#14532d" stroke-width="3"/><path d="M18 14 L20 4 L24 14Z" fill="#15803d" stroke="#14532d" stroke-width="1.5"/><path d="M36 8 L40 3 L44 10Z" fill="#15803d" stroke="#14532d" stroke-width="1.5"/><ellipse cx="20" cy="16" rx="10" ry="4.5" fill="white" opacity="0.12"/><path d="M8 36 Q20 30 30 33 Q40 30 52 36" stroke="#15803d" stroke-width="1.5" fill="none" opacity="0.7"/><path d="M8 42 Q20 37 30 40 Q40 37 52 42" stroke="#15803d" stroke-width="1.5" fill="none" opacity="0.7"/><path d="M10 28 Q20 24 28 26" stroke="#15803d" stroke-width="1.5" fill="none" opacity="0.7"/><path d="M32 26 Q40 24 50 28" stroke="#15803d" stroke-width="1.5" fill="none" opacity="0.7"/><circle cx="20" cy="24" r="8" fill="white" stroke="#14532d" stroke-width="2"/><circle cx="40" cy="24" r="8" fill="white" stroke="#14532d" stroke-width="2"/><circle cx="20" cy="24" r="6" fill="#dc2626"/><circle cx="40" cy="24" r="6" fill="#dc2626"/><ellipse cx="20" cy="24" rx="1.8" ry="5.5" fill="#14532d"/><ellipse cx="40" cy="24" rx="1.8" ry="5.5" fill="#14532d"/><circle cx="19" cy="22" r="1.5" fill="white"/><circle cx="39" cy="22" r="1.5" fill="white"/><ellipse cx="27" cy="38" rx="1.5" ry="0.8" fill="#14532d"/><ellipse cx="33" cy="38" rx="1.5" ry="0.8" fill="#14532d"/><path d="M23 46 L25 55 L30 46 L35 55 L37 46" stroke="#ef4444" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
   ],
   lbl:['Glanzend Ei','Kronkelende Worm','Listige Hagedis','Giftige Slang','Drakenslang-Legende'],
   desc:['Kronkelt al vanbinnen. Kan niet wachten.','Sssst. Ssstudeert. Ssssnel ook.','Likt zijn ogen af na elke correcte quiz.','Glipt ongezien door de moeilijkste vragen heen.','Half slang, half draak. Helemaal gevaarlijk.'],
   evoMsg:['🐛 Je Slang kronkelt uit het ei! Sssss.','🦎 Je Slang likt zijn ogen! (Hagedissen doen dat echt.)','🐍 GIFTIGE SLANG! De examenvragen hebben geen kans.','🐉 DRAKENSLANG-LEGENDE! Sssssss... (van trots)']},
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
const ANIM_THRESHOLDS=[0,100,500,2000,7500,30000,75000,200000];
const ANIM_STAGE_NAMES=['Baby','Jong','Tiener','Volwassen','Prime','Goud','Diamant','Platina'];
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
  // Premium ring wrapper for Goud(5), Diamant(6), Platina(7)
  const premInfo=stageIdx>=5?[
    {cls:'avo-goud',ring:'avo-ring-goud'},
    {cls:'avo-diamant',ring:'avo-ring-diamant'},
    {cls:'avo-platina',ring:'avo-ring-platina'},
  ][stageIdx-5]||{cls:'avo-platina',ring:'avo-ring-platina'}:null;
  if(a.svg){
    const svgIdx=Math.min(stageIdx,a.svg.length-1);
    if(a.svg[svgIdx]){
      const svgCls='anim-svg-wrap'+(premInfo?' '+premInfo.cls:'');
      const svgSpan='<span class="'+svgCls+'" style="width:'+size+'px;height:'+size+'px">'+a.svg[svgIdx]+'</span>';
      if(premInfo){
        // Ring wrapper auto-sizes to svg + 6px (3px padding each side)
        return'<span class="avo-prem-ring '+premInfo.ring+'">'+svgSpan+'</span>';
      }
      return svgSpan;
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
      <div style="font-size:12px;color:var(--mu);margin-bottom:10px;text-align:center">Kies een nieuw dier — je evolutiestadium blijft behouden</div>
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
    <div style="font-weight:700;margin-bottom:8px">✅ ${keys.length} vak${keys.length===1?'':'ken'} herkend — klopt dit?</div>
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
  if(!btn)return;
  btn.style.visibility='';
  // Lees altijd eerst uit localStorage — staat er direct al in, geen Supabase-wacht nodig
  const p=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  const liveAvatar=getMyCurrentAvatar();
  const isLoggedIn=!!(currentUser||(p.naam&&(typeof _hasLocalSession==='undefined'||_hasLocalSession)));
  if(!isLoggedIn){
    btn.className='hnav-icon-btn hnav-login-cta';
    btn.dataset.tip='';
    btn.setAttribute('aria-label','Inloggen');
    btn.innerHTML=`<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>Inloggen`;
    return;
  }
  btn.className='hnav-icon-btn';
  if(p.naam&&liveAvatar!=='🐾'){
    btn.dataset.tip=p.naam.split(' ')[0];
    btn.innerHTML=`<div class="dock-avatar" style="font-size:16px;background:transparent">${liveAvatar}</div>`;
  }else if(p.naam){
    const initials=p.naam.trim().split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
    btn.dataset.tip=p.naam.split(' ')[0];
    btn.innerHTML=`<div class="dock-avatar dock-avatar-ini">${initials}</div>`;
  }else{
    btn.dataset.tip='Profiel';
    btn.innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  }
}

function openProfiel(){
  if(!currentUser){show('sc-auth');return;}
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

