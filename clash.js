// ═══════════════════════════════════════════════════════════════════════
// clash.js - Slagio Clash: kaartgevecht in een 2D-arena op echte examenstof
// ───────────────────────────────────────────────────────────────────────
// Lazy geladen door clashOpen() (arcade.js). Alles wordt vlak getekend op één
// canvas in Vonk-stijl, zonder 3D of extra bibliotheken. Speluitleg in het kort:
//   · Kennis is je energie. Hij loopt vanzelf op, maar een goed antwoord in
//     het vragenpaneel geeft er meteen 2 bij. Wie de stof kent, speelt meer.
//   · Drie goed op rij: je volgende kaart is versterkt (+25%).
//   · Vragen komen uit het gekozen vak, met voorrang voor je zwakke leerdoelen.
//     Alles gaat via arcLog() de mastery-laag in (en dus ook naar Kingdom).
//   · Arena 18 × 32 tegels. Team 0 = jij (onder), team 1 = tegenstander.
//     Schermpositie via clProj(x, hoogte, z); z = 0 is jouw achterlijn.
// ═══════════════════════════════════════════════════════════════════════

const CL={on:false,raf:0,klok:0,ents:[],fx:[],proj:[],lijken:[],hud:null,mode:'lobby'};
const CL_W=18,CL_L=32,CL_RIV0=15,CL_RIV1=17,CL_BRUG=[3.5,14.5];
const CL_TEAM=[
  {c:'#1CB0F6',d:'#1593CF',l:'#8CDCFF',css:'#1CB0F6',naam:'blauw'},
  {c:'#FF4B4B',d:'#D93636',l:'#FFA8A8',css:'#FF4B4B',naam:'rood'}];
const CL_ARENAS=[
  {naam:'Oefenveld',min:0,gras:['#A6E066','#9AD65A'],buiten:'#7CC846',buitenD:'#6CB63A',pad:'#F6E0AC',padD:'#E4C78C',boom:['#58CC02','#46A302'],decor:'bos',acc:.45,denk:1.4},
  {naam:'Kasteelweide',min:300,gras:['#9FDC60','#93D155'],buiten:'#72BF43',buitenD:'#63AD38',pad:'#F3DBA2',padD:'#E0C285',boom:['#4FBF2A','#3FA021'],decor:'kasteel',acc:.6,denk:1.05},
  {naam:'Rivierdelta',min:700,gras:['#9ADB7C','#8ED070'],buiten:'#6DC27B',buitenD:'#5DB06B',pad:'#ECD8A8',padD:'#D8BF8C',boom:['#3FBF7A','#2FA066'],decor:'delta',acc:.68,denk:.9},
  {naam:'Bergpas',min:1200,gras:['#B6D87C','#AACD70'],buiten:'#9FBA8C',buitenD:'#8DA87A',pad:'#E8D5B0',padD:'#D3BD95',boom:['#3F9F6A','#2F8558'],decor:'berg',acc:.76,denk:.78},
  {naam:'Examenhal',min:2000,gras:['#AADA8E','#9FCF83'],buiten:'#DCD2C1',buitenD:'#CBBFAA',pad:'#F0E6D2',padD:'#DDCFB4',boom:['#58CC02','#46A302'],decor:'hal',acc:.84,denk:.66}];

// ── Kaarten ─────────────────────────────────────────────────────────────
// t: unit | bouw | spreuk. doel: 'grond' | 'alles' | 'gebouw'. snelheid in tegels/s.
const CL_KAARTEN={
  ridder:{wat:'Stevig. Slaat alles op de grond, dichtbij.',naam:'Ridder',vak:'Geschiedenis',kort:'GS',k:3,t:'unit',n:1,hp:1450,dmg:165,hit:1.2,bereik:.9,v:1,doel:'grond',r:.45,zeld:0,
    feit:'Ridders vochten te paard voor hun leenheer. In ruil kregen ze land: het leenstelsel uit tijdvak 3.'},
  boog:{wat:'Twee schutters. Raken grond en lucht op afstand.',naam:'Boogschutters',vak:'Geschiedenis',kort:'GS',k:3,t:'unit',n:2,hp:300,dmg:92,hit:1,bereik:5,v:1,doel:'alles',r:.35,zeld:0,
    feit:'Met de Engelse handboog won een klein leger bij Azincourt (1415) van zwaar bewapende Franse ridders.'},
  reus:{wat:'Heel veel levens. Loopt alleen op gebouwen af.',naam:'Rotsreus',vak:'Aardrijkskunde',kort:'AK',k:5,t:'unit',n:1,hp:3300,dmg:215,hit:1.5,bereik:1.2,v:.72,doel:'gebouw',r:.8,zeld:1,
    feit:'Stollingsgesteente ontstaat als magma afkoelt. Graniet koelt diep en langzaam af, basalt snel aan het oppervlak.'},
  thermiet:{wat:'Vuurbal op een plek. Veel schade in een cirkel.',naam:'Thermiet',vak:'Scheikunde',kort:'SK',k:4,t:'spreuk',straal:2.5,dmg:580,toren:.35,zeld:1,
    feit:'Thermiet is aluminium met ijzeroxide. Aluminium is onedeler dan ijzer en neemt de zuurstof over: een sterk exotherme redoxreactie.'},
  pijlen:{wat:'Pijlenregen. Ruimt groepjes kleine eenheden op.',naam:'Pijlenregen',vak:'Geschiedenis',kort:'GS',k:3,t:'spreuk',straal:3.4,dmg:250,toren:.3,zeld:0,
    feit:'Een salvo pijlen is een baan onder invloed van de zwaartekracht: horizontaal gelijkmatig, verticaal versneld.'},
  elektron:{wat:'Vier snelle, zwakke eenheden. Goedkoop.',naam:'Elektronen',vak:'Natuurkunde',kort:'NA',k:1,t:'unit',n:4,hp:78,dmg:70,hit:1,bereik:.6,v:1.5,doel:'grond',r:.28,zeld:0,
    feit:'Een elektron heeft een lading van −1,6 · 10⁻¹⁹ C. Stroom is het aantal coulomb dat per seconde langskomt.'},
  robot:{wat:'Snel en slaat heel hard, maar valt maar één doel tegelijk aan.',naam:'Robot',vak:'Informatica',kort:'IN',k:4,t:'unit',n:1,hp:1250,dmg:610,hit:1.8,bereik:.9,v:1.5,doel:'grond',r:.5,zeld:1,
    feit:'Een algoritme is een eindig stappenplan. Deze robot kent er één: dichtstbijzijnde doel, slaan, herhalen.'},
  tesla:{wat:'Gebouw. Schiet bliksem op grond en lucht.',naam:'Teslaspoel',vak:'Natuurkunde',kort:'NA',k:4,t:'bouw',hp:1000,dmg:190,hit:1.1,bereik:5.5,leeft:35,doel:'alles',r:.9,zeld:1,
    feit:'Een teslaspoel is een transformator zonder ijzerkern die heel hoge spanning maakt. De vonk is lucht die geleidt.'},
  ptero:{wat:'Vliegt. Spuwt vuur op een groepje.',naam:'Pterosaurus',vak:'Biologie',kort:'BI',k:4,t:'unit',n:1,hp:1050,dmg:140,hit:1.5,bereik:3.5,v:1.5,doel:'alles',vlieg:true,splash:1.1,r:.6,zeld:2,
    feit:'Pterosauriërs waren vliegende reptielen, geen dinosauriërs. Hun vleugel was een huid gespannen aan één lange vinger.'},
  onderzoeker:{wat:'Gooit flesjes op grond en lucht, van ver.',naam:'Onderzoeker',vak:'Biologie',kort:'BI',k:4,t:'unit',n:1,hp:720,dmg:225,hit:1.1,bereik:6,v:1,doel:'alles',r:.42,zeld:1,
    feit:'Een goed experiment verandert één variabele tegelijk. De rest houd je constant, anders weet je niet wat het effect veroorzaakt.'},
  ram:{wat:'Snel. Rijdt alleen op gebouwen af.',naam:'Stormram',vak:'Geschiedenis',kort:'GS',k:4,t:'unit',n:1,hp:1500,dmg:280,hit:1.6,bereik:.9,v:1.5,doel:'gebouw',r:.7,zeld:1,
    feit:'Stormrammen waren er al bij de Assyriërs. Tegen de middeleeuwse stenen burcht hielp pas het buskruitkanon echt.'},
  kanon:{wat:'Gebouw. Werpt stenen in een parabool, alleen op de grond.',naam:'Paraboolkanon',vak:'Wiskunde',kort:'WI',k:3,t:'bouw',hp:820,dmg:185,hit:.9,bereik:5.5,leeft:30,doel:'grond',r:.8,zeld:0,
    feit:'Een kogel volgt een parabool: y = ax² + bx + c met a < 0. De top ligt bij x = −b / 2a.'},
};
const CL_ZELD=[{naam:'Gewoon',c:'#4FA3E0'},{naam:'Zeldzaam',c:'#FF9600'},{naam:'Episch',c:'#B65CFF'}];
const CL_DECK0=['ridder','boog','elektron','thermiet','reus','tesla','onderzoeker','pijlen'];
const CL_TOREN={prinses:{hp:1400,dmg:90,hit:.8,bereik:7.5,r:1.5},koning:{hp:2400,dmg:110,hit:1,bereik:7,r:2}};

// ── Opslag ──────────────────────────────────────────────────────────────
function clStore(){const s=arcStore();const c=Object.assign({bekers:0,gespeeld:0,gewonnen:0,deck:CL_DECK0.slice(),best:0,kisten:[]},s.clash||{});
  if(!c.coll){c.coll={};CL_DECK0.forEach(id=>c.coll[id]={lvl:1,n:0});}(c.deck||[]).forEach(id=>{if(!c.coll[id])c.coll[id]={lvl:1,n:0};});if(!Array.isArray(c.kisten))c.kisten=[];return c;}
// Kaarten komen vrij per arena (zoals in Clash Royale); je krijgt ze uit kisten.
const CL_ARENA_KAART={robot:1,kanon:1,ram:2,ptero:3};
const CL_UPGRADE=[0,2,4,10,20,50,100,200];// kaarten nodig voor level 2..8
const CL_MAXLVL=8;
function clLvl(id){const c=CL._store||clStore();return (c.coll[id]&&c.coll[id].lvl)||1;}
function clLvlF(lvl){return 1+.1*(lvl-1);}
const CL_KIST={hout:{naam:'Houten kist',nodig:4,kaarten:10,soorten:2,kl:'#b7793f'},zilver:{naam:'Zilveren kist',nodig:6,kaarten:24,soorten:3,kl:'#aab4c3'},goud:{naam:'Gouden kist',nodig:10,kaarten:60,soorten:4,kl:'#f5c542'}};
function clSave(c){const s=arcStore();s.clash=c;arcSave(s);}
function clArena(b){let a=0;CL_ARENAS.forEach((x,i)=>{if(b>=x.min)a=i;});return a;}

// ── 2D-tekenen in Vonk-stijl ────────────────────────────────────────────
// Alles staat op één canvas en is vlak getekend: twee tinten per vorm (licht
// plus een donkere kant), een witte glanslijn en zachte schaduwen. Geen
// verlopen, geen gloed. Het veld ligt schuin (CL_SY), figuren staan rechtop.
// Figuren zijn ontworpen op CL_U eenheden per tegel; voeten staan op (0,0).
const CL_SY=.78,CL_U=20,CL_US=1.28;
function clRnd(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
if(typeof CanvasRenderingContext2D!=='undefined'&&!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.max(0,Math.min(+r||0,Math.abs(w)/2,Math.abs(h)/2));this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();};}
let G=null,_clF=0;const _clMix={};
function clCss(k){return typeof k==='number'?'#'+k.toString(16).padStart(6,'0'):k;}
function clMeng(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
// Kleur door de trefferflits: tijdens een treffer kleurt alles even naar wit.
function ck(h){if(!_clF||h.length!==7||h[0]!=='#')return h;const k=h+_clF;return _clMix[k]||(_clMix[k]=clMeng(h,'#ffffff',_clF));}
function cE(x,y,rx,ry,c){G.fillStyle=ck(c);G.beginPath();G.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,7);G.fill();}
function cC(x,y,r,c){cE(x,y,r,r,c);}
function cR(x,y,w,h,r,c){G.fillStyle=ck(c);G.beginPath();G.roundRect(x,y,w,h,r);G.fill();}
function cP(pts,c){G.fillStyle=ck(c);G.beginPath();pts.forEach((p,i)=>i?G.lineTo(p[0],p[1]):G.moveTo(p[0],p[1]));G.closePath();G.fill();}
function cL(pts,c,w){G.strokeStyle=ck(c);G.lineWidth=w;G.lineCap='round';G.lineJoin='round';G.beginPath();pts.forEach((p,i)=>i?G.lineTo(p[0],p[1]):G.moveTo(p[0],p[1]));G.stroke();}
function cA(x,y,r,a0,a1,c,w){G.strokeStyle=ck(c);G.lineWidth=w;G.lineCap='round';G.beginPath();G.arc(x,y,r,a0,a1);G.stroke();}
// Vorm met twee tinten: licht, en rechts van sx de donkere kant.
function cV(pad,c,d,sx){G.beginPath();pad();G.fillStyle=ck(c);G.fill();if(d){G.save();G.clip();G.fillStyle=ck(d);G.fillRect(sx,-600,1200,1200);G.restore();}}
// Zelfde, maar de donkere kant zit onder sy.
function cVo(pad,c,d,sy){G.beginPath();pad();G.fillStyle=ck(c);G.fill();if(d){G.save();G.clip();G.fillStyle=ck(d);G.fillRect(-600,sy,1200,1200);G.restore();}}
function cGl(x,y,r,a0,a1,w){const a=G.globalAlpha;G.globalAlpha=a*.45;cA(x,y,r,a0,a1,'#ffffff',w||1.6);G.globalAlpha=a;}
function cPoly(pts){pts.forEach((p,i)=>i?G.lineTo(p[0],p[1]):G.moveTo(p[0],p[1]));G.closePath();}

// ── Figuren ─────────────────────────────────────────────────────────────
// Elke figuur is vlak getekend in drie tinten (licht, schaduw, glans) en krijgt
// bij het tekenen een donkere contour (clSticker), zoals speelstukken in een
// kaartspel. Voeten staan op (0,0); armhoek 0 = arm hangt. Aanvallen lopen via
// e.swing (seconden sinds de aanval), juichen via e.juichT.
const _clTint={};
// Gloed-modus: 0 = alles, 1 = zonder zachte gloed (voor de contour), 2 = alleen gloed.
let CL_GL=0;
function clDk(h,t){t=t||.24;const k=h+'d'+t;return _clTint[k]||(_clTint[k]=clMeng(h,'#2B2233',t));}
function clLt(h,t){t=t||.3;const k=h+'l'+t;return _clTint[k]||(_clTint[k]=clMeng(h,'#FFFFFF',t));}
const CL_HUID=['#F9CFA8','#E8AE82'],CL_INKT='#2B2233';
const CL_MENS={
  ridder:{s:1.06,hoofd:'helm',item:'zwaard',schild:true,cape:true,harnas:true,snor:true,broek:'#5B5F6B',laars:'#6B4423'},
  boog:{s:.9,hoofd:'kap',item:'boog',staart:true,koker:true,broek:'#8B5A2B',laars:'#6B4423',haar:'#F0703C'},
  onderzoeker:{s:.96,hoofd:'bril',item:'fles',jas:true,broek:'#4B4B4B',laars:'#3C3C3C',haar:'#8B5A2B'},
  wacht:{s:.8,hoofd:'kap',item:'boog',staart:true,broek:'#8B5A2B',laars:'#6B4423',haar:'#8B5A2B'},
  koning:{s:.98,hoofd:'kroon',item:'scepter',broek:'#4B4B4B',laars:'#3C3C3C',haar:'#F4F4F4',baard:true,mantel:true}};
// Animatie-hulpjes. Een aanval heeft drie stukken: aanloop, klap en terugveren.
const clEo=t=>1-Math.pow(1-t,3),clEi=t=>t*t*t;
function clSeg(t,a,b){return b<=a?(t>=b?1:0):Math.max(0,Math.min(1,(t-a)/(b-a)));}
function clLerp(a,b,t){return a+(b-a)*t;}
// [aanloop klaar, klap klaar, weer in rust] in seconden sinds de aanval begon.
const CL_SLAG={ridder:[.1,.17,.5],robot:[.12,.2,.5],reus:[.18,.24,.62],ram:[.15,.22,.6],boog:[.16,.17,.34],onderzoeker:[.15,.24,.5],ptero:[.08,.14,.36],kanon:[.12,.22,.9],tesla:[.05,.09,.32],elektron:[.06,.12,.3],koning:[.1,.16,.4]};
function clSlag(sw,id,rust,op,neer){const S=CL_SLAG[id];if(!S||sw>=S[2])return rust;
  if(sw<S[0])return clLerp(rust,op,clEo(sw/S[0]));if(sw<S[1])return clLerp(op,neer,clEi(clSeg(sw,S[0],S[1])));return clLerp(neer,rust,clEo(clSeg(sw,S[1],S[2])));}
// Uitdrukking per moment: rust, boos (aanval), au (geraakt), blij (juichen), slaap, dood.
function clUitdr(e,S,eigen){const t=CL.t||0,sw=e.swing==null?9:e.swing;
  if(e.dood)return 'dood';if(e.slaap)return 'slaap';if(e.flits>0)return 'au';if(e.juichT!=null&&t-e.juichT<1.3)return 'blij';
  if(S&&sw<S[1]+.1)return 'schreeuw';if(e.aanval||eigen)return 'boos';return 'rust';}
// Gezicht: grote ogen met pupil, wenkbrauwen en een mond die meedoet.
function clGezicht(x,y,e,ud,o){
  o=o||{};const t=CL.t||0,br=o.brauw||'#4A2E1B',mond='#6B3A2E';
  const ooglid=(s,dicht)=>cA(x+s*3.8,y+.9+dicht,3,Math.PI*1.12,Math.PI*1.88,CL_INKT,1.4);
  if(o.stoppel){const a=G.globalAlpha;G.globalAlpha=a*.2;cE(x,y+6.4,6.6,3.6,'#5B3A22');G.globalAlpha=a;}
  if(!o.baard)cL([[x+.4,y+1.8],[x+1.3,y+3.6],[x+.1,y+4]],CL_HUID[1],1.1);
  if(ud==='dood'){for(const s of [-1,1]){cL([[x+s*3.8-1.4,y-1.3],[x+s*3.8+1.4,y+1.3]],CL_INKT,1.4);cL([[x+s*3.8-1.4,y+1.3],[x+s*3.8+1.4,y-1.3]],CL_INKT,1.4);}cL([[x-2.2,y+6],[x+2.2,y+6.4]],mond,1.2);return;}
  if(ud==='slaap'){for(const s of [-1,1])cL([[x+s*1.8,y+.3],[x+s*5.6,y+.6]],CL_INKT,1.4);}
  else if(ud==='au'){for(const s of [-1,1])cL([[x+s*5.6,y-1.6],[x+s*2.2,y+.1],[x+s*5.6,y+1.6]],CL_INKT,1.6);}
  else{const knip=((t*.7+(e.fase||0))%4)<.08?.12:1,kijk=ud==='boos'||ud==='schreeuw'?.5:Math.sin(t*.9+(e.fase||0))*.4,boos=ud==='boos'||ud==='schreeuw';
    for(const s of [-1,1]){
      G.fillStyle=ck('#FFFFFF');G.beginPath();G.moveTo(x+s*1.5,y+.3);G.quadraticCurveTo(x+s*3.8,y-1.9*knip,x+s*6.1,y-.1);G.quadraticCurveTo(x+s*3.8,y+1.7*knip,x+s*1.5,y+.3);G.closePath();G.fill();
      if(knip>.5){G.save();G.clip();cC(x+s*3.8+kijk,y,1.5,'#5A3A26');cC(x+s*3.8+kijk,y,.75,CL_INKT);cC(x+s*3.8+kijk-.5,y-.5,.45,'#FFFFFF');
        if(boos){G.fillStyle=ck(CL_HUID[0]);G.beginPath();G.moveTo(x+s*1,y-2.4);G.lineTo(x+s*6.6,y-2.4);G.lineTo(x+s*6.6,y-1);G.lineTo(x+s*1,y);G.closePath();G.fill();}G.restore();}
      cL([[x+s*1.4,y+.2],[x+s*3.8,y-1.9*knip+(boos?.8:0)],[x+s*6.4,y-.3]],CL_INKT,1.3);}}
  // wenkbrauwen: zwaar en recht, dieper bij de aanval
  if(!o.geenBrauw){const b=ud==='boos'||ud==='schreeuw'?[[-6.8,-4.2],[-1.3,-2.3]]:ud==='au'?[[-6.6,-3.4],[-1.6,-4.6]]:[[-6.8,-3.6],[-1.4,-3.1]];
    for(const s of [-1,1]){const rb=ud==='blij'&&s>0?-1:0;cL(b.map(([a,c])=>[x+a*s,y+c+rb]),br,2.3);}}
  // mond: strak, een grijns of een schreeuw
  const my=y+6;
  if(ud==='schreeuw'){cR(x-3,my-1.8,6,4.2,1.8,'#4A1F1F');cR(x-2.4,my-1.8,4.8,1.1,.4,'#FFFFFF');cR(x-2.2,my+1.5,4.4,.9,.4,'#FFFFFF');}
  else if(ud==='au'){cR(x-2.6,my-1,5.2,2.2,.9,'#4A1F1F');cL([[x-2.2,my+.1],[x+2.2,my+.1]],'#FFFFFF',.8);}
  else if(!o.baard&&!o.snor){if(ud==='blij'){G.strokeStyle=ck(mond);G.lineWidth=1.3;G.lineCap='round';G.beginPath();G.moveTo(x-2.4,my);G.quadraticCurveTo(x+.6,my+1.3,x+2.8,my-1.4);G.stroke();}
    else cL([[x-2.4,my],[x+2.4,my+(ud==='boos'?.5:-.2)]],mond,1.3);}
  if(o.snor){for(const s of [-1,1])cV(()=>{G.moveTo(x,my-2.6);G.quadraticCurveTo(x+s*3,my-4,x+s*5.6,my-1.4);G.quadraticCurveTo(x+s*3.4,my-.6,x,my-1.2);G.closePath();},'#7A4A26','#5B3A22',x+s*9);}
}
function clMens(e,id,team){
  if(CL_GL===2)return;
  const C=CL_MENS[id],tc=CL_TEAM[team],t=CL.t||0,ph=e.fase||0;
  const f=e.f||0,loopt=!!e.loopt,sw=e.swing==null?9:e.swing,rug=!!e.rug;
  const juich=e.juichT!=null&&t-e.juichT<1.3,jt=juich?t-e.juichT:0;
  const S=CL_SLAG[id==='wacht'?'boog':id];
  G.save();G.scale(C.s*.96,C.s*1.08);
  const lp=loopt?Math.sin(f):0;
  const bob=loopt?-Math.abs(Math.cos(f))*2:Math.sin(t*2.4+ph)*.45-(juich?Math.abs(Math.sin(jt*9))*4.5*(1-jt/1.3):0);
  // Benen en laarzen: om en om optillen en een halve pas zetten.
  for(const [x,q] of [[-3.8,lp],[3.8,-lp]]){const op=Math.max(0,q)*3.6,X=x+q*1.5;
    cV(()=>G.roundRect(X-2.7,-11.5-op,5.4,8+op*.3,2.4),C.broek,clDk(C.broek),X+.8);
    cV(()=>G.roundRect(X-3.3,-5.6-op,6.8,5.8,2.4),C.laars,clDk(C.laars),X+1.2);
    cR(X-3.3,-1.6-op,6.8,1.7,.8,CL_INKT);cR(X-2.5,-4.8-op,3.2,1,.5,clLt(C.laars,.3));}
  G.translate(0,bob);
  const golf=Math.sin(t*5+ph)*1.2+(loopt?Math.sin(f*2)*1.8:0);
  // Achterkant: cape of mantel en de pijlkoker.
  if((C.cape||C.mantel)&&!rug)cP([[-7,-23],[7,-23],[10+golf*.4,-5.5],[3,-4.5+golf*.5],[-3,-5.5-golf*.3],[-10+golf*.4,-4.5]],tc.d);
  if(C.koker&&!rug){G.save();G.translate(-5.5,-21);G.rotate(-.45);cV(()=>G.roundRect(-2.6,-10,5.2,13,2.2),'#9B6634','#7E4F24',.6);cR(-2.6,-10,5.2,2,1,'#6B4423');
    for(const dx of [-1.3,1.3]){cL([[dx,-10],[dx,-13]],'#C98E46',1);cP([[dx-1.3,-12.4],[dx,-15.4],[dx+1.3,-12.4]],tc.l);}G.restore();}
  // Armen.
  const rust=loopt?.14+lp*.55:.14+Math.sin(t*2.4+ph)*.05;
  let aL=rust,aR=loopt?-.14+lp*.55:-rust,trek=0;
  if(C.item==='zwaard'){aR=clSlag(sw,'ridder',aR,-2.95,-.3);if(sw<S[1]+.05)aL=clLerp(aL,.55,clSeg(sw,0,S[0]));}
  if(C.item==='boog'&&(sw<S[2]||e.aanval)){aR=-1.5;if(sw<S[0])trek=clEo(sw/S[0]);else if(sw<S[2])aR=-1.5+Math.sin(clSeg(sw,S[1],S[2])*Math.PI)*.45;else trek=.12;}
  if(C.item==='fles')aR=clSlag(sw,'onderzoeker',aR,-2.8,-.6);
  if(C.item==='scepter')aR=clSlag(sw,'koning',aR,-2.6,-1.1);
  const geworpen=C.item==='fles'&&sw>=S[1]&&sw<S[2]*1.2;
  if(juich){const j=Math.sin(jt*14)*.25;aL=2.6+j;aR=-2.6-j;}
  const mouw=C.jas?'#F2F4F7':tc.c,mouwD=C.jas?'#D5DAE1':tc.d;
  const hand=(x,y)=>{if(C.harnas)cV(()=>G.arc(x,y,3.1,0,7),'#DDE3EA','#AEB9C6',x+1);else cV(()=>G.arc(x,y,2.9,0,7),CL_HUID[0],CL_HUID[1],x+1);};
  const arm=(s,a,item,voor)=>{G.save();G.translate(s*8.6,-21.5);G.rotate(a);
    if(voor&&item)item(true);
    cV(()=>G.roundRect(-2.5,-1.6,5,12.4,2.5),mouw,mouwD,1);if(C.harnas)cR(-2.7,6.4,5.4,3,1.4,'#C9D2DC');
    if(!voor&&item)item(false);hand(0,11);if(voor&&item&&item.over)item.over();G.restore();};
  const zwaard=()=>{cV(()=>G.roundRect(-1.1,7.5,2.2,4,1),'#6B4423','#5B3A22',0);
    cV(()=>{G.moveTo(-1.8,13);G.lineTo(-1.8,27);G.lineTo(0,30.5);G.lineTo(1.8,27);G.lineTo(1.8,13);G.closePath();},'#F1F4F8','#BFC9D4',0);cL([[0,14],[0,27]],'#D5DCE4',.8);
    cV(()=>G.roundRect(-5,11,10,2.6,1.3),'#FFC800','#E6A800',0);cC(-5,12.3,1.4,'#E6A800');cC(5,12.3,1.4,'#E6A800');cC(0,7.2,1.6,'#FFC800');};
  const boog=()=>{const tr=trek*6.5;cL([[-10,11],[0,11-tr],[10,11]],'#FFF4D6',.9);
    G.strokeStyle=ck('#7E4F24');G.lineWidth=3;G.lineCap='round';G.beginPath();G.moveTo(-10,11);G.quadraticCurveTo(-5,24,0,22);G.quadraticCurveTo(5,24,10,11);G.stroke();
    G.strokeStyle=ck('#B07A45');G.lineWidth=1.2;G.beginPath();G.moveTo(-8.5,13);G.quadraticCurveTo(-4.5,22,0,21);G.stroke();cR(-1.6,19.5,3.2,4,1,'#5B3A22');
    if(trek>0||(sw>4&&e.aanval)){cL([[0,11-tr],[0,25-tr]],'#C98E46',1.4);cP([[-1.6,25-tr],[0,28.5-tr],[1.6,25-tr]],'#DDE3EA');cP([[0,11-tr],[-2,8.5-tr],[0,9.6-tr],[2,8.5-tr]],tc.c);}};
  const fles=()=>{if(geworpen)return;cR(-1.4,11.5,2.8,3.8,1,'#DDF4FF');cC(0,18,4.4,'#E8F7FF');G.save();G.beginPath();G.arc(0,18,4.4,0,7);G.clip();cR(-5,17,10,7,0,'#58CC02');cR(-5,17,10,1.3,0,'#89E219');G.restore();
    cGl(0,18,3,3.6,4.6,1.2);cR(-1.7,10.2,3.4,2,.9,'#C98E46');const b=(t*1.4+ph)%1;G.save();G.globalAlpha*=1-b;cC(Math.sin(b*9)*1.2,10-b*7,1+b*.6,'#B8F28A');G.restore();};
  const scepter=()=>{cV(()=>G.roundRect(-1.1,7,2.2,18,1),'#FFC800','#E6A800',.2);cR(-2.2,12,4.4,1.6,.8,'#E6A800');cV(()=>G.arc(0,26,3.4,0,7),tc.c,tc.d,1);cC(-1,25,1.1,'#FFFFFF');};
  const items={zwaard,boog,fles,scepter};
  if(rug)arm(1,aR,items[C.item],true);
  arm(-1,aL,null);
  if(C.schild&&!rug){G.save();G.translate(-8.6,-21.5);G.rotate(aL);
    cV(()=>G.arc(-1,8,7.6,0,7),'#C9D2DC','#9AA7B5',1);cV(()=>G.arc(-1,8,6,0,7),tc.c,tc.d,1.2);
    cP([[-1,3.6],[.6,6.6],[3.6,8],[.6,9.4],[-1,12.4],[-2.6,9.4],[-5.6,8],[-2.6,6.6]],'#FFFFFF');cC(-1,8,1.6,'#FFC800');cGl(-1,8,5.4,3.5,4.6,1.5);G.restore();}
  // Romp.
  if(C.jas){cV(()=>G.roundRect(-8,-25,16,16,5),'#F7F8FA','#D9DDE3',2.8);cP([[-3.4,-25],[3.4,-25],[0,-18.6]],tc.c);
    cP([[-3.4,-25],[0,-18.6],[-2,-17.4],[-5.2,-24]],'#E6E9EE');cP([[3.4,-25],[0,-18.6],[2,-17.4],[5.2,-24]],'#D9DDE3');
    cR(2.4,-16.4,3.8,3.2,1,'#E3E7EC');cR(3.1,-18,1,3,.4,tc.c);cC(-.2,-14.4,.7,'#C9CFD7');cC(-.2,-11.8,.7,'#C9CFD7');}
  else{cV(()=>{G.moveTo(-9.4,-25);G.lineTo(9.4,-25);G.quadraticCurveTo(10,-25,9.6,-22);G.lineTo(7.6,-9.4);G.lineTo(-7.6,-9.4);G.lineTo(-9.6,-22);G.quadraticCurveTo(-10,-25,-9.4,-25);G.closePath();},tc.c,tc.d,2.8);
    if(C.harnas){cV(()=>{G.moveTo(-7,-24.4);G.lineTo(7,-24.4);G.lineTo(6.4,-14.6);G.quadraticCurveTo(0,-11.8,-6.4,-14.6);G.closePath();},'#EDF1F5','#B9C3CE',2.2);
      cV(()=>G.roundRect(-2.6,-24.4,5.2,12.6,1.2),tc.c,tc.d,.8);cP([[0,-21.6],[1.6,-19.2],[0,-16.8],[-1.6,-19.2]],'#FFC800');cGl(-3.6,-19.6,4,3.4,4.4,1.2);}
    if(C.mantel){cV(()=>G.roundRect(-8,-25,16,4,2),'#FFFFFF','#E3E7EC',2);for(const x of [-4.6,-.4,3.8])cR(x,-23.8,1,1.8,.5,CL_INKT);cP([[-1.4,-21],[1.4,-21],[2.4,-11],[-2.4,-11]],'#FFC800');}
    cR(-8,-13,16,2.8,1.3,'#5B3A22');cV(()=>G.roundRect(-2.1,-13.5,4.2,3.8,1),'#FFC800','#E6A800',.5);cR(-1,-12.4,2,1.6,.4,'#5B3A22');}
  cGl(-2,-18,5,3.4,4.4,1.3);
  if(C.cape&&rug){cP([[-7.6,-23.5],[7.6,-23.5],[10+golf*.4,-4.5],[-10+golf*.4,-4.5]],tc.c);cP([[-10+golf*.4,-4.5],[10+golf*.4,-4.5],[9+golf*.4,-7.2],[-9+golf*.4,-7.2]],tc.d);cP([[golf*.2,-19],[golf*.2+2.6,-15],[golf*.2,-11],[golf*.2-2.6,-15]],'#FFC800');}
  if(C.koker&&rug){G.save();G.translate(1,-20);G.rotate(.35);cV(()=>G.roundRect(-2.8,-9,5.6,14,2.2),'#9B6634','#7E4F24',.6);for(const dx of [-1.4,1.4])cP([[dx-1.3,-9],[dx,-12.6],[dx+1.3,-9]],tc.l);G.restore();}
  if(!rug){arm(1,aR,items[C.item]);
    // Veeg: een witte boog achter het zwaard tijdens de klap.
    if(C.item==='zwaard'&&sw>=S[0]&&sw<S[1]+.08){const p=clSeg(sw,S[0],S[1]+.08),a0=-2.95+Math.PI/2,a1=aR+Math.PI/2;
      G.save();G.translate(8.6,-21.5);G.globalAlpha*=.8*(1-p*p);G.fillStyle=ck('#FFFFFF');G.beginPath();G.arc(0,0,31,a0,a1);G.arc(0,0,16,a1,a0,true);G.closePath();G.fill();G.restore();}}
  else if(C.schild){G.save();G.translate(8.6,-21.5);cV(()=>G.arc(1,8,7.6,0,7),'#B07A45','#8E5E32',2);cA(1,8,6,0,7,'#7E4F24',1.2);cC(1,8,1.6,'#9AA7B5');G.restore();}
  // Schouderstukken over de armen.
  if(C.harnas)for(const s of [-1,1])cV(()=>{G.ellipse(s*8.6,-22.2,4.8,3.8,0,Math.PI,0);G.lineTo(s*8.6+4.8,-21);G.lineTo(s*8.6-4.8,-21);G.closePath();},'#E4E9EF','#AEB9C6',s*8.6+1.2);
  // Kop: kleiner dan het lijf (volwassen verhoudingen) en veert iets na op de pas.
  G.translate(0,loopt?Math.sin(f*2-.7)*.6:0);G.translate(0,-23.5);G.scale(.8,.8);G.translate(0,23.5);
  const hy=-33,R=10.5,ud=clUitdr(e,S);
  if(C.staart){const z=Math.sin(t*4+ph)*.15+(loopt?Math.sin(f)*.2:0);G.save();G.translate(rug?0:-7,hy-2);G.rotate((rug?0:.6)+z);
    cV(()=>{G.moveTo(-2.6,0);G.quadraticCurveTo(-4.6,9,-1,15);G.quadraticCurveTo(3.4,9,2.6,0);G.closePath();},C.haar,clDk(C.haar),0);cR(-2.6,-.6,5.2,2.4,1.2,tc.c);G.restore();}
  if(C.hoofd==='kap')cC(0,hy-.4,R+2.2,tc.d);
  if(!rug)for(const s of [-1,1])cV(()=>G.arc(s*(R-.4),hy+1,2.4,0,7),CL_HUID[0],CL_HUID[1],s*R);
  cV(()=>G.arc(0,hy,R,0,7),CL_HUID[0],CL_HUID[1],4.8);
  if(!rug){const kn=(C.hoofd==='kroon'&&C.baard);clGezicht(0,hy+.8,e,ud,{snor:C.snor,stoppel:C.snor,baard:kn,brauw:C.hoofd==='kroon'?'#DADDE2':C.haar?clDk(C.haar,.3):'#5B3A22',geenBrauw:C.hoofd==='helm'&&false});
    if(!C.snor&&!kn)cE(0,hy+3.6,1.2,.9,CL_HUID[1]);}
  if(C.hoofd==='helm'){
    if(rug)cV(()=>G.arc(0,hy,R+1.3,0,7),'#E8EDF2','#B4BFCB',3.5);
    else{cV(()=>{G.arc(0,hy,R+1.3,Math.PI,0);G.lineTo(R+1.3,hy-2.4);G.lineTo(-R-1.3,hy-2.4);G.closePath();},'#E8EDF2','#B4BFCB',3.5);
      for(const s of [-1,1])cV(()=>G.roundRect(s>0?R-1.6:-R-1.4,hy-3,3,8,1.4),'#DDE3EA','#B4BFCB',s*R);
      cV(()=>G.roundRect(-1.4,hy-4.4,2.8,6.8,1.2),'#DDE3EA','#B4BFCB',.4);}
    cR(-R-1.5,hy-5.4,2*R+3,3.4,1.6,'#C9D2DC');for(const x of [-7,-3.5,3.5,7])cC(x,hy-3.7,.6,'#8C99A8');
    cGl(0,hy,R-1.5,3.5,4.4,1.7);
    G.save();G.translate(1.5,hy-R-1);G.rotate(-.5+Math.sin(t*3+ph)*.08-(e.leun||0)*2.2);cV(()=>G.ellipse(-2,-5,3.8,7.5,0,0,7),tc.c,tc.d,-1);cL([[-2,-1],[-2,-10]],clLt(tc.c,.35),1);G.restore();}
  else if(C.hoofd==='kap'){
    if(rug)cV(()=>G.arc(0,hy-.4,R+2.2,0,7),tc.c,tc.d,3);
    else{const a=G.globalAlpha;G.globalAlpha=a*.3;cE(0,hy-1.2,R*.95,3.2,CL_INKT);G.globalAlpha=a;
      cV(()=>{G.moveTo(-R-2.2,hy+1.5);G.arc(0,hy-.4,R+2.2,Math.PI,0);G.lineTo(R+2.2,hy+1.5);G.quadraticCurveTo(0,hy-8.6,-R-2.2,hy+1.5);G.closePath();},tc.c,tc.d,3);
      if(C.haar)cP([[-6.5,hy-4.8],[-2,hy-6.4],[1,hy-4.2],[-4,hy-3.2]],C.haar);}
    cGl(0,hy-.4,R,3.5,4.4,1.6);}
  else if(C.hoofd==='bril'){
    if(rug)cV(()=>G.arc(0,hy-.5,R+.8,0,7),C.haar,clDk(C.haar),3);
    else cV(()=>{G.moveTo(-R-.8,hy-.6);G.arc(0,hy-.5,R+.8,Math.PI,0);G.lineTo(R+.8,hy-.6);G.lineTo(6.5,hy-5);G.lineTo(2,hy-3.4);G.lineTo(-2.4,hy-5.6);G.lineTo(-6.6,hy-3.4);G.closePath();},C.haar,clDk(C.haar),3);
    for(const [x,y] of [[-4,-R-3.6],[0,-R-4.8],[3.6,-R-3.4]])cP([[x-2,hy-R+.4],[x,hy+y],[x+2,hy-R+.6]],C.haar);
    cR(-R-.6,hy-7.6,2*R+1.2,2.2,1,'#4B4B4B');for(const s of [-1,1]){cV(()=>G.arc(s*4.2,hy-6.6,3.4,0,7),'#5B5F6B','#3C3C3C',s*4.2+1);cC(s*4.2,hy-6.6,2.3,'#BDEBFF');cC(s*4.2-.8,hy-7.4,.8,'#FFFFFF');}}
  else if(C.hoofd==='kroon'){
    cV(()=>{G.arc(0,hy,R+.6,Math.PI*.92,Math.PI*2.08);G.closePath();},C.haar,'#DADDE2',3);
    if(!rug&&C.baard){cV(()=>{G.moveTo(-9,hy+2);G.quadraticCurveTo(-9.6,hy+11,-4,hy+14.6);G.quadraticCurveTo(0,hy+17,4,hy+14.6);G.quadraticCurveTo(9.6,hy+11,9,hy+2);G.quadraticCurveTo(0,hy+8.4,-9,hy+2);G.closePath();},'#FFFFFF','#DADDE2',3);
      for(const x of [-4,0,4])cA(x,hy+12,1.6,.2,Math.PI-.2,'#DADDE2',.9);
      for(const s of [-1,1])cV(()=>{G.moveTo(0,hy+4.4);G.quadraticCurveTo(s*3.4,hy+2.6,s*6.6,hy+5.4);G.quadraticCurveTo(s*3.6,hy+6.4,0,hy+5.6);G.closePath();},'#F4F4F4','#DADDE2',s*8);
      if(clUitdr(e,S)==='schreeuw'||clUitdr(e,S)==='blij')cE(0,hy+8,2.4,2,'#7A2E2E');}
    cV(()=>G.roundRect(-8.6,hy-9.4,17.2,3.6,1.6),'#FFFFFF','#E3E7EC',3);for(const x of [-6,-2,2,6])cR(x-.4,hy-8.6,.9,1.8,.4,CL_INKT);
    cV(()=>cPoly([[-8.6,hy-9.2],[8.6,hy-9.2],[9.8,hy-18.4],[5,hy-13.4],[0,hy-20.4],[-5,hy-13.4],[-9.8,hy-18.4]]),'#FFC800','#E6A800',2.5);
    for(const [x,y] of [[-9.8,-18.4],[0,-20.4],[9.8,-18.4]])cC(x,hy+y,1.4,'#FFC800');
    cC(0,hy-12.2,1.8,tc.c);cC(-5,hy-11.2,1.2,'#58CC02');cC(5,hy-11.2,1.2,'#CE82FF');cGl(-3.6,hy-12,3.4,3.4,4.6,1.1);}
  G.restore();
}
function clRobot(e,team){
  if(CL_GL===2)return;
  const tc=CL_TEAM[team],t=CL.t||0,ph=e.fase||0,f=e.f||0,loopt=!!e.loopt,sw=e.swing==null?9:e.swing;
  G.save();G.scale(1.08,1.08);
  const lp=loopt?Math.sin(f):0,bob=loopt?-Math.abs(Math.cos(f))*1.6:Math.sin(t*3+ph)*.4;
  for(const [x,q] of [[-5.4,lp],[5.4,-lp]]){const op=Math.max(0,q)*3.2,X=x+q*1.2;
    cV(()=>G.roundRect(X-2.4,-15-op,4.8,8,2),'#9AA4B1','#7C8794',X+.8);cV(()=>G.roundRect(X-3.4,-9-op,6.8,6.6,2.4),tc.d,clDk(tc.d),X+1);
    cV(()=>G.roundRect(X-4.6,-3.6-op,9.2,3.8,1.8),'#4B4B4B',CL_INKT,X+2);}
  G.translate(0,bob);
  cV(()=>G.roundRect(-8.5,-18,17,5,2),'#6E7783','#596270',3);
  const RS=CL_SLAG.robot,stoot=sw<RS[0]?0:sw<RS[1]?clEi(clSeg(sw,RS[0],RS[1])):sw<RS[2]?1-clEo(clSeg(sw,RS[1],RS[2])):0;
  const aL=loopt?lp*.4:0,aR=sw<RS[2]?clSlag(sw,'robot',loopt?-lp*.4:0,.7,-1.5):(loopt?-lp*.4:0);
  const arm=(s,a,uit)=>{G.save();G.translate(s*13,-31);G.rotate(a);cV(()=>G.roundRect(-2.5,0,5,8,2.5),'#AEB7C2','#8C96A3',.8);
    cV(()=>G.roundRect(-3.6,7+uit*6,7.2,8,3),tc.d,clDk(tc.d),1);cV(()=>G.arc(0,17.5+uit*7,5.2,0,7),'#4B4B4B',CL_INKT,1.5);cL([[-3,16+uit*7],[3,16+uit*7]],'#6B6B6B',1);G.restore();};
  arm(-1,aL,0);
  cV(()=>G.roundRect(-13.5,-37,27,21,7),tc.c,tc.d,5);
  if(!e.rug){cV(()=>G.roundRect(-8.5,-33,17,11,4),'#EEF1F5','#C6CED8',3);const pk=.6+Math.sin(t*5+ph)*.4;
    const a=G.globalAlpha;G.globalAlpha=a*.35*pk;cC(0,-27.5,6,tc.l);G.globalAlpha=a;cC(0,-27.5,3.6,tc.l);cC(0,-27.5,2,'#FFFFFF');
    for(const [x,y] of [[-11,-34.5],[11,-34.5],[-11,-19],[11,-19]])cC(x,y,.8,clLt(tc.c,.5));}
  else{for(const y of [-33,-29,-25])cR(-6,y,12,1.6,.8,tc.d);}
  cGl(-6,-27,8,3.5,4.3,1.6);
  for(const s of [-1,1])cV(()=>G.arc(s*13,-33,5.8,0,7),tc.c,tc.d,s*13+1.5);
  arm(1,aR,stoot);
  if(sw>=RS[0]&&sw<RS[1]+.1){const p=clSeg(sw,RS[0],RS[1]+.1);G.save();G.globalAlpha*=1-p;for(const [y,l] of [[-30,10],[-26,15],[-22,9]])cL([[16,y],[16+l*(1+p),y]],'#FFFFFF',1.8);G.restore();}
  // kop
  cL([[0,-52],[0,-58]],'#9AA4B1',1.8);cC(0,-59,2.8,(Math.sin(t*3+ph)>0)?tc.l:tc.c);cC(-.8,-59.8,.9,'#FFFFFF');
  for(const s of [-1,1])cV(()=>G.arc(s*11.4,-44,2.6,0,7),'#9AA4B1','#7C8794',s*11.4+.6);
  cV(()=>G.roundRect(-11,-53.5,22,18,8),'#EEF1F5','#C6CED8',4);
  if(!e.rug){cV(()=>G.roundRect(-8.6,-49.6,17.2,10,5),'#2E3440','#232832',4);const ud=clUitdr(e,RS);
    if(ud==='dood'){for(const s of [-1,1]){cL([[s*4-1.5,-46.4],[s*4+1.5,-43.2]],'#7DF9FF',1.3);cL([[s*4-1.5,-43.2],[s*4+1.5,-46.4]],'#7DF9FF',1.3);}}
    else{const kn=((t*.8+ph)%3.5)<.1?.2:1;for(const s of [-1,1]){
      if(ud==='boos'||ud==='schreeuw')cP([[s*1.6,-46.6],[s*6.4,-48],[s*6.4,-43],[s*1.6,-43]],'#7DF9FF');
      else if(ud==='au')cL([[s*6,-46.6],[s*2.4,-44.8],[s*6,-43]],'#7DF9FF',1.4);
      else cR(s*4-2.6,-45.8,5.2,2*kn,1,'#7DF9FF');}
      cR(-6.6,-48.6,3,1,.5,'#FFFFFF');}}
  cGl(-2,-46,7,3.5,4.5,1.6);
  G.restore();
}
function clReus(e,team){
  if(CL_GL===2)return;
  const tc=CL_TEAM[team],t=CL.t||0,ph=e.fase||0,f=e.f||0,loopt=!!e.loopt,sw=e.swing==null?9:e.swing;
  G.save();G.scale(1.08,1.08);
  const steen=['#BDB7AF','#9C968E','#7F7A73'],mos=['#7BC043','#5FA332'];
  const lp=loopt?Math.sin(f):0,bob=loopt?-Math.abs(Math.cos(f))*2.2:Math.sin(t*1.8+ph)*.6;
  for(const [x,q] of [[-7.5,lp],[7.5,-lp]]){const op=Math.max(0,q)*3.4;cV(()=>cPoly([[x-7,-1-op],[x-7.5,-14-op],[x,-17-op],[x+7.5,-13-op],[x+7,-1-op]]),steen[1],steen[2],x+1.5);cR(x-6.6,-3-op,13.2,3,1.4,steen[2]);}
  G.translate(0,bob);G.rotate(loopt?lp*.04:0);
  const slag=sw<CL_SLAG.reus[2]?clSlag(sw,'reus',0,1,-.08):0;
  const aL=loopt?lp*.35:Math.sin(t*1.8+ph)*.04,a=slag*2.5;
  const gloei=.65+Math.sin(t*3+ph)*.2+(slag>0?.3:0);
  const lava=(pts,w)=>{const al=G.globalAlpha;G.globalAlpha=al*.35*gloei;cL(pts,'#FFC800',w+3);G.globalAlpha=al;cL(pts,'#FF9600',w);cL(pts,'#FFE066',w*.4);};
  const arm=(s,ang)=>{G.save();G.translate(s*18,-41);G.rotate(ang);cV(()=>G.arc(0,3,7,0,7),steen[0],steen[1],2);
    cV(()=>cPoly([[-5,8],[5,8],[6,15],[-6,15]]),steen[1],steen[2],1.5);
    cV(()=>cPoly([[-9.5,13.5],[-7,24],[1,27],[9.5,21],[8,12.5],[0,10.5]]),steen[0],steen[1],2);for(const x of [-4,0,4])cL([[x,22.5],[x+1,25.5]],steen[2],1.2);
    lava([[-3,16],[0,19],[3,17]],1.4);if(!e.rug)cP([[-6,4],[-1,1],[3,3],[-2,6]],mos[0]);G.restore();};
  arm(-1,aL+a);
  cV(()=>cPoly([[-20,-31],[-15,-48],[-3,-55],[12,-53],[21,-40],[19,-21],[9,-12],[-11,-12],[-19,-18]]),steen[0],steen[1],5);
  cV(()=>cPoly([[-16,-45],[-5,-53],[8,-52],[0,-47],[-11,-42]]),mos[0],mos[1],2);cC(-12,-44,3.4,mos[0]);cC(13,-47,3,mos[1]);
  lava([[-8,-44],[-4,-37],[-8,-30],[-3,-22]],2.4);lava([[10,-43],[7,-35],[11,-28]],2);
  cL([[-16,-26],[-10,-22]],steen[2],1.4);cL([[14,-24],[17,-30]],steen[2],1.4);
  cP([[-19,-37],[-15,-42],[19,-25],[16,-20]],tc.c);cP([[6,-30],[19,-25],[16,-20],[4,-25]],tc.d);cV(()=>G.roundRect(-3.4,-36.4,6.8,6.8,1.6),'#FFC800','#E6A800',1);
  cGl(-4,-38,13,3.6,4.3,2);
  arm(1,-aL-a);
  // kop
  cV(()=>cPoly([[-9.5,-52],[-7.5,-64],[2,-67],[9.5,-62],[10.5,-52],[3,-48],[-5,-48]]),steen[0],steen[1],3);
  cP([[-6,-66],[1,-68],[6,-65],[0,-63.5]],mos[0]);
  const ud=clUitdr(e,CL_SLAG.reus,true);
  if(!e.rug){cV(()=>cPoly([[-9,-59],[9,-59],[8,-56],[-8,-56]]),steen[2],CL_INKT,99);
    if(ud==='dood'){for(const s of [-1,1]){cL([[s*4-1.5,-56.5],[s*4+1.5,-53.5]],CL_INKT,1.5);cL([[s*4-1.5,-53.5],[s*4+1.5,-56.5]],CL_INKT,1.5);}}
    else{const g=slag>0||e.flits>0?'#FFFFFF':'#FFC800';for(const s of [-1,1])cR(s*4-2.2,-56,4.4,2.8,1.4,g);
      if(ud==='schreeuw'){cR(-3.4,-51.6,6.8,2.4,1.2,'#FF9600');cR(-2.2,-51.2,4.4,1.2,.6,'#FFE066');}else cL([[-3,-50.4],[3,-50.4]],steen[2],1.2);}}
  G.restore();
}
function clElektron(e,team){
  const tc=CL_TEAM[team],t=CL.t||0,ph=e.fase||0,y=-11+Math.sin(t*6+ph)*1.6;
  const a=G.globalAlpha;
  if(CL_GL!==1){G.globalAlpha=a*.25;cC(0,y,12.5,tc.l);G.globalAlpha=a;
    if(e.loopt){G.globalAlpha=a*.35;for(let i=1;i<4;i++)cC(-i*3.4,y+i*.6,6.4-i*1.4,tc.l);G.globalAlpha=a;}}
  if(CL_GL===2)return;
  for(const k of [0,1]){G.save();G.translate(0,y);G.rotate(k?.55:-.55);G.globalAlpha=a*.85;G.strokeStyle=ck('#FFFFFF');G.lineWidth=1.4;G.beginPath();G.ellipse(0,0,12.5,4.4,0,Math.PI,Math.PI*2);G.stroke();G.globalAlpha=a;G.restore();}
  cV(()=>G.arc(0,y,7.2,0,7),tc.l,tc.c,2.4);cGl(0,y,5,3.6,4.6,1.6);
  {const z=t*14+ph;cL([[-3.4,y-1.6],[-.6,y-.2+Math.sin(z)*.8],[.6,y-2.2],[3.4,y+.4]],'#FFFFFF',1.4);cC(0,y,2.2,'#FFFFFF');}
  for(const k of [0,1]){G.save();G.translate(0,y);G.rotate(k?.55:-.55);G.globalAlpha=a*.85;G.strokeStyle=ck('#FFFFFF');G.lineWidth=1.4;G.beginPath();G.ellipse(0,0,12.5,4.4,0,0,Math.PI);G.stroke();G.globalAlpha=a;
    const h=t*(k?5:-6.2)+ph*2;cC(Math.cos(h)*12.5,Math.sin(h)*4.4,2,'#FFFFFF');G.restore();}
}
function clPtero(e,team){
  if(CL_GL===2)return;
  const tc=CL_TEAM[team],t=CL.t||0,ph=e.fase||0,fl=Math.sin(t*9+ph),sw=e.swing==null?9:e.swing;
  const lunge=sw<CL_SLAG.ptero[2]?clSlag(sw,'ptero',0,-3,5):0;
  G.save();G.translate(lunge*.4,-46+Math.sin(t*9+ph+1)*2.2);
  const huid=['#D19A62','#AD7744'];
  const vleugel=(s,achter)=>{const ty=-10-fl*14,by=6-fl*4,mx=s*18,my=-6-fl*8;const kl=achter?tc.d:tc.l,rand=achter?clDk(tc.d):tc.c;
    cP([[s*3,-3],[mx,my],[s*33,ty],[s*27,by-2],[s*17,by+2],[s*8,6]],kl);cP([[s*17,by+2],[s*27,by-2],[s*33,ty],[s*30,ty+5]],rand);
    cL([[s*3,-3],[mx,my],[s*33,ty]],achter?'#8E5E32':huid[1],2.4);cL([[mx,my],[s*27,by-2]],achter?'#8E5E32':huid[1],1);cL([[mx,my],[s*17,by+2]],achter?'#8E5E32':huid[1],1);
    cP([[mx,my],[mx+s*2,my-3],[mx+s*.5,my+.6]],'#FFF4D6');};
  vleugel(-1,true);
  cL([[-8,1],[-22,5]],huid[1],2.2);cP([[-22,5],[-26.5,1.5],[-28.5,6],[-25,10]],tc.c);
  for(const x of [-3,2])cL([[x,6],[x-.6,10],[x+1.4,11.4]],'#7E4F24',1.4);
  cV(()=>G.ellipse(0,0,11,7.6,0,0,7),huid[0],huid[1],3);cV(()=>G.ellipse(.6,2.8,7.4,4.2,0,0,7),'#F3D6A8','#E5C08C',3);
  for(const x of [-3,0,3])cL([[x,.6],[x+.6,4.6]],'#E0BB86',.8);
  cP([[3,-8.5],[-9,-20],[-4,-13],[1,-4]],tc.c);cP([[-9,-20],[-4,-13],[-6.5,-12]],tc.d);
  cV(()=>G.arc(8.4,-6,6,0,7),huid[0],huid[1],11);
  const open=sw<.3?Math.sin(clSeg(sw,0,.3)*Math.PI)*2.4:0;
  cV(()=>cPoly([[12,-9],[27,-5.6-open*.4],[12,-4.6]]),'#F2B544','#D99A2B',99);cV(()=>cPoly([[12,-4.2],[25,-3.6+open],[12,-2]]),'#E6A23A','#D99A2B',99);
  for(const x of [15,18,21])cP([[x,-4.6],[x+.8,-3.4],[x+1.6,-4.6]],'#FFFFFF');
  const ud=clUitdr(e,CL_SLAG.ptero,true);
  if(ud==='dood'){cL([[7.4,-9],[10.4,-6]],CL_INKT,1.2);cL([[7.4,-6],[10.4,-9]],CL_INKT,1.2);}
  else{cE(9.2,-7.4,2.3,1.5,'#FFE066');cE(9.8,-7.4,.7,1.4,CL_INKT);cL([[6.2,-10.4],[11.6,-8.4]],'#5B3A22',1.8);}
  if(sw<.3){const p=sw/.3;const a=G.globalAlpha;G.globalAlpha=a*(1-p);cC(28+p*6,-4.5,4.4+p*3,'#FF9600');cC(28+p*6,-4.5,2.4+p*1.5,'#FFC800');G.globalAlpha=a;}
  vleugel(1,false);
  cGl(-1,-1,7,3.6,4.5,1.4);
  G.restore();
}
function clRam(e,team){
  if(CL_GL===2)return;
  const tc=CL_TEAM[team],t=CL.t||0,sw=e.swing==null?9:e.swing,stoot=sw<CL_SLAG.ram[2]?clSlag(sw,'ram',0,-.55,1):0,rol=e.m&&e.m.wiel||0;
  const hobbel=e.loopt?Math.abs(Math.sin(rol*1.5))*1.2:0;
  G.save();G.translate(0,-hobbel);
  const pole=-18;cL([[pole,-31],[pole,-48]],'#7E4F24',1.8);
  const w=Math.sin(t*6)*1.5;cP([[pole,-48],[pole+12,-45+w],[pole,-40]],tc.c);cP([[pole,-44.5],[pole+6,-43.4+w*.5],[pole,-42.4]],clLt(tc.c,.35));cC(pole,-48.6,1.5,'#FFC800');
  cV(()=>cPoly([[-21,-16],[-7,-33],[7,-33],[21,-16]]),tc.c,tc.d,4);
  for(const x of [-12,-4,4,12]){const a=G.globalAlpha;G.globalAlpha=a*.28;cL([[x,-17],[x*.45,-32]],'#FFFFFF',2.2);G.globalAlpha=a;}
  cR(-8,-34.4,16,2.8,1.4,'#7E4F24');
  cV(()=>G.roundRect(-15+stoot*8,-25.5,38,7.6,3.6),'#9B6634','#7E4F24',99);cL([[-9+stoot*8,-23.6],[16+stoot*8,-23.6]],'#B98049',.9);
  for(const x of [-8,4,15])cR(x+stoot*8,-26,2.4,8.6,1,'#8C99A8');
  cV(()=>cPoly([[22+stoot*8,-27.4],[31+stoot*8,-24.6],[33+stoot*8,-21.7],[31+stoot*8,-18.8],[22+stoot*8,-16]]),'#E4E9EF','#AEB9C6',27+stoot*8);
  cC(28+stoot*8,-21.7,1.2,'#5B5F6B');
  cV(()=>G.roundRect(-24,-17,48,9.4,3),'#C98E46','#A8702E',8);for(const x of [-12,0,12])cL([[x,-16],[x,-8.4]],'#A8702E',.9);cR(-24,-13.4,48,1.6,.8,'#8C99A8');
  cGl(-8,-9,12,3.8,4.4,1.2);
  for(const x of [-15,0,15]){G.save();G.translate(x,-5.5);cC(0,0,7,'#5B5F6B');cC(0,0,5.6,'#9B6634');G.rotate(rol);for(let i=0;i<4;i++){G.rotate(Math.PI/4);cL([[-5,0],[5,0]],'#7E4F24',1.4);}cC(0,0,2,'#E8B46A');cC(0,0,.8,'#5B5F6B');G.restore();}
  G.restore();
  if(e.loopt&&!CL.lite){const a=G.globalAlpha;G.globalAlpha=a*.5;for(const [y,l] of [[-22,8],[-12,12]])cL([[-27-((t*60)%8),y],[-27-l-((t*60)%8),y]],'#FFFFFF',1.4);G.globalAlpha=a;}
}
function clTesla(e,team){
  const tc=CL_TEAM[team],t=CL.t||0,sw=e.swing==null?9:e.swing,fl=sw<.12;
  const lading=e.aanval&&e.cd!=null&&e.hit?Math.max(0,1-e.cd/(e.hit*.5)):0;
  if(CL_GL===2){const a=G.globalAlpha,puls=.2+Math.sin(t*5)*.06+(fl?.35:0)+lading*.3;G.globalAlpha=a*puls;cC(0,-55,14+(fl?5:0)+lading*4+Math.sin(t*30)*lading,tc.l);G.globalAlpha=a;return;}
  cV(()=>G.roundRect(-18,-11,36,12,4),'#E3D9C9','#C7BAA6',7);cR(-18,-2,36,3,1.5,'#BDAF98');for(const x of [-10,0,10])cL([[x,-10],[x,-3]],'#CDBFA8',1);
  cV(()=>cPoly([[-7,-10],[-4,-45],[4,-45],[7,-10]]),'#8A93A0','#6E7783',1);for(const y of [-14,-24,-34])cC(-3.6,y,.7,'#B9C1CB');
  for(let i=0;i<5;i++){const y=-16-i*6.6,r=9.6-i*.9;cV(()=>G.ellipse(0,y,r,3.2,0,0,7),'#F0A55E','#C9803A',r*.35);cGl(0,y,r-1.4,3.6,4.4,1);}
  cV(()=>G.roundRect(-6,-48,12,4,2),'#6E7783','#596270',2);
  const a=G.globalAlpha,puls=.2+Math.sin(t*5)*.06+(fl?.35:0)+lading*.3;if(CL_GL!==1){G.globalAlpha=a*puls;cC(0,-55,14+(fl?5:0)+lading*4+Math.sin(t*30)*lading,tc.l);G.globalAlpha=a;}
  cV(()=>G.arc(0,-55,8.2,0,7),fl?'#FFFFFF':tc.l,fl?tc.l:tc.c,2.8);
  const zz=(s)=>[[-4,-55+s],[-1.4,-58+s],[.8,-53.6+s],[3.6,-57+s]];cL(zz(0),'#FFFFFF',1.3);if(lading>.3)cL(zz(3),'#FFFFFF',1);
  cGl(0,-55,5.6,3.6,4.6,1.7);
  if(((t*1.7+(e.fase||0))%2.2)<.12||lading>.6){const s=t*40;cL([[0,-63],[3+Math.sin(s)*2,-68],[1,-70],[4,-75]],'#FFFFFF',1.3);cL([[-3,-62],[-6,-66+Math.sin(s)],[-5,-69]],tc.l,1.1);}
}
function clKanon(e,team){
  if(CL_GL===2)return;
  const tc=CL_TEAM[team],sw=e.swing==null?9:e.swing;
  const worp=sw<CL_SLAG.kanon[2]?clSlag(sw,'kanon',0,-.12,1):0,a=-.55+worp*2.15;
  for(const x of [-13,13]){cC(x,-5.5,6,'#5B5F6B');cC(x,-5.5,4.6,'#9B6634');cL([[x-4,-5.5],[x+4,-5.5]],'#7E4F24',1.2);cL([[x,-9.5],[x,-1.5]],'#7E4F24',1.2);cC(x,-5.5,1.6,'#E8B46A');}
  cV(()=>G.roundRect(-20,-14,40,7.6,3),'#C98E46','#A8702E',7);cR(-20,-11.4,40,1.4,.7,'#8C99A8');
  G.save();G.globalAlpha*=.85;G.strokeStyle='#FFFFFF';G.lineWidth=1.3;G.beginPath();G.moveTo(-9,-8.2);G.quadraticCurveTo(-4,-15,1,-8.2);G.stroke();G.restore();
  cV(()=>cPoly([[-8,-14],[-3,-32],[3,-32],[8,-14]]),'#B07A45','#8E5E32',.5);cL([[-5.5,-18],[5.5,-27]],'#8E5E32',1.4);cL([[5.5,-18],[-5.5,-27]],'#8E5E32',1.4);
  G.save();G.translate(0,-29);G.rotate(a);
  cV(()=>G.roundRect(-29,-2.4,32,4.8,2.4),'#9B6634','#7E4F24',99);cR(-12,-2.8,2.4,5.6,1,'#8C99A8');
  cE(-29,-1,6,4,'#7E4F24');cE(-29,-2.4,4.6,2.2,'#5B3A22');
  if(sw>=CL_SLAG.kanon[2]||sw<CL_SLAG.kanon[0])cV(()=>G.arc(-29,-5,4,0,7),'#C2BDB5','#A39E96',-28);
  G.restore();
  cV(()=>G.arc(0,-29,2.8,0,7),'#E8B46A','#C98E46',.6);
  cP([[14,-14],[14,-29],[23.5,-26],[14,-22.5]],tc.c);cP([[14,-27],[19,-25.6],[14,-24.6]],clLt(tc.c,.35));cL([[14,-13],[14,-30]],'#7E4F24',1.5);
}
const CL_TEKEN={ridder:(e,t)=>clMens(e,'ridder',t),boog:(e,t)=>clMens(e,'boog',t),onderzoeker:(e,t)=>clMens(e,'onderzoeker',t),
  robot:clRobot,reus:clReus,elektron:clElektron,ptero:clPtero,ram:clRam,tesla:clTesla,kanon:clKanon};
// Hoogte (in tegels) van de levensbalk boven een figuur.
const CL_H2D={ridder:2.85,boog:2.3,onderzoeker:2.45,elektron:1.35,robot:3.25,reus:3.75,ptero:3.5,ram:2.6,tesla:3.6,kanon:2.2};
// Kader (in tekeneenheden, na schalen) waarbinnen een figuur getekend wordt.
// Kader van een figuur in tekeneenheden, geschaald naar de figuurgrootte.
const _clKd={};function clKd(id){return _clKd[id]||(_clKd[id]=(CL_KADER[id]||CL_KADER.ridder).map(v=>v*CL_US/1.1));}
const CL_KADER={ridder:[-44,-86,50,14],boog:[-38,-62,42,14],onderzoeker:[-32,-64,32,12],elektron:[-26,-34,24,8],robot:[-34,-82,60,12],reus:[-58,-92,58,14],
  ptero:[-48,-94,52,12],ram:[-58,-62,52,10],tesla:[-26,-92,26,10],kanon:[-46,-74,36,10],lijk:[-92,-90,92,28],toren:[-54,-106,66,42]};

// Contourlijn langs het laatst getekende pad (voor de torens, die direct getekend worden).
function cOmlijn(w){G.strokeStyle=CL_INKT;G.lineWidth=w||2;G.lineJoin='round';G.stroke();}
// Torens: voetstuk, stenen romp met teambanier, kantelen en de schutter erop.
function clToren(e){
  const tc=CL_TEAM[e.team],t=CL.t||0,kon=e.sub==='koning';
  const B=kon?38:28,bw=kon?64:48,bh=kon?22:19,y0=B*CL_SY*.45,top=y0-bh;
  // Slagschaduw op het gras en het voetstuk.
  const a0=G.globalAlpha;G.globalAlpha=a0*.16;cE(B*.35,B*CL_SY*.3,B*1.25,B*CL_SY*.95,'#1E3A10');G.globalAlpha=a0;
  cR(-B,-B*CL_SY+5,2*B,2*B*CL_SY,12,'#B3A58C');G.beginPath();G.roundRect(-B,-B*CL_SY,2*B,2*B*CL_SY+5,12);cOmlijn(2);cV(()=>G.roundRect(-B,-B*CL_SY,2*B,2*B*CL_SY,12),'#DCD1BD','#CBBDA6',B*.45);
  for(let i=-2;i<=2;i++)for(let j=-1;j<=1;j++){const al=G.globalAlpha;G.globalAlpha=al*.4;cR(i*B*.36-B*.15,j*B*CL_SY*.55-2,B*.3,4,2,'#C7B9A1');G.globalAlpha=al;}
  const val=e.m&&e.m.val,vp=val?Math.min(1,val.t/1.1):0;
  if(e.dood&&(!val||vp>=1)){clRuine(e,bw,y0,tc);return;}
  // Staat er iets achter de toren, dan wordt hij doorzichtig zodat je het veld blijft zien.
  G.save();G.globalAlpha*=e.m&&e.m.fade!=null?e.m.fade:1;
  if(val){G.beginPath();G.rect(-200,-400,400,400+y0+.5);G.clip();G.translate(Math.sin(vp*40)*2.4*(1-vp),vp*vp*bh*.9);}
  // romp met stenen
  G.beginPath();G.roundRect(-bw/2,top,bw,bh,7);cOmlijn(2.6);
  cV(()=>G.roundRect(-bw/2,top,bw,bh,7),'#F3EBDD','#DCD0BC',bw*.2);
  G.save();G.beginPath();G.roundRect(-bw/2,top,bw,bh,7);G.clip();
  for(let r=0;r<3;r++){const y=top+2+r*7;for(let c=-1;c<5;c++){const x=-bw/2+c*13+(r%2?6.5:0);cV(()=>G.roundRect(x+1,y,11.2,7,2.4),x+6<bw*.2?'#EFE6D6':'#D6C9B2',null);cR(x+2,y+.6,8,1.2,.6,x+6<bw*.2?'#FAF5EC':'#E2D7C3');}}
  G.restore();
  cR(-bw/2,y0-4,bw,4,2,'#CBBDA6');
  cV(()=>{G.moveTo(-6,y0);G.lineTo(-6,y0-5);G.arc(0,y0-5,6,Math.PI,0);G.lineTo(6,y0);G.closePath();},'#C9BCA6','#B3A58C',2);
  cV(()=>{G.moveTo(-4.6,y0);G.lineTo(-4.6,y0-4.8);G.arc(0,y0-4.8,4.6,Math.PI,0);G.lineTo(4.6,y0);G.closePath();},'#8B6B4A','#6E5238',1.6);
  // banier
  const bt=top+2,bb=kon?13:11;
  G.beginPath();cPoly([[-9,bt],[9,bt],[9,bt+bb],[0,bt+bb-5],[-9,bt+bb]]);cOmlijn(1.6);cV(()=>cPoly([[-9,bt],[9,bt],[9,bt+bb],[0,bt+bb-5],[-9,bt+bb]]),tc.c,tc.d,3);cR(-9,bt,18,2.2,1,'#FFC800');
  if(kon)cV(()=>cPoly([[-4,bt+8.6],[4,bt+8.6],[5,bt+3.4],[2,bt+5.6],[0,bt+2.4],[-2,bt+5.6],[-5,bt+3.4]]),'#FFC800','#E6A800',2);
  else{cC(0,bt+5.4,2.8,'#FFFFFF');cP([[0,bt+3.2],[1,bt+5.4],[0,bt+7.6],[-1,bt+5.4]],tc.c);}
  // houten bovenkant
  const dw=bw+12;
  G.beginPath();G.roundRect(-dw/2,top-8,dw,10,5);cOmlijn(2.6);cV(()=>G.roundRect(-dw/2,top-8,dw,10,5),'#E8DFCF','#CEC1AB',dw*.24);cR(-dw/2+2,top-2.6,dw-4,2,1,'#CEC1AB');
  for(let i=0;i<5;i++)cR(-dw/2+4+i*(dw-8)/5,top-1.6,2,3.4,1,'#B3A58C');
  // vlaggen achter
  const vlag=(x,s)=>{cL([[x,top-8],[x,top-35]],'#9B6634',2);const w=Math.sin(t*5+x)*2,w2=Math.sin(t*5+x+1.4)*2.6;
    G.fillStyle=ck(tc.c);G.beginPath();G.moveTo(x,top-35);G.quadraticCurveTo(x+s*7,top-36+w,x+s*14,top-31+w2);G.quadraticCurveTo(x+s*7,top-26.5+w,x,top-25);G.closePath();G.fill();
    G.fillStyle=ck(clLt(tc.c,.3));G.beginPath();G.moveTo(x,top-33);G.quadraticCurveTo(x+s*5,top-33.6+w,x+s*9,top-31+w2*.7);G.lineTo(x,top-30);G.closePath();G.fill();cC(x,top-36,1.7,'#FFC800');};
  if(kon){vlag(-dw/2+5,-1);vlag(dw/2-5,1);}else vlag(-dw/2+5,-1);
  // schutter
  const s=e.m||{};const sch={fase:e.fase,f:0,loopt:false,swing:e.swing,rug:false,juichT:e.juichT,dood:false,slaap:kon&&!e.actief,aanval:e.aanval,flits:e.flits};
  G.save();G.translate(kon?-8:0,top-7);G.scale((s.dir||1)*.9,.9);
  {const m=G.getTransform(),px=Math.hypot(m.a,m.b),K=[-30,-72,34,8],_f=_clF;_clF=0;
    const rand=!CL.lite&&!(CL.q&&CL.q.geenRand),tq=Math.floor(t*30),key=tq+'|'+(_f?1:0)+'|'+px.toFixed(3)+'|'+rand+'|'+(s.dir||1);
    let st=e._sch;if(!st){const c=document.createElement('canvas');st=e._sch={c,g:c.getContext('2d')};}
    if(st.key!==key){const tOud=CL.t;CL.t=tq/30;const r=clSticker(K,px,()=>clMens(sch,kon?'koning':'wacht',e.team),_f?.5:0,rand?Math.max(2,px*1.4):0);CL.t=tOud;
      if(st.c.width!==r.w||st.c.height!==r.h){st.c.width=r.w;st.c.height=r.h;}else st.g.clearRect(0,0,r.w,r.h);st.g.drawImage(r.c,0,0,r.w,r.h,0,0,r.w,r.h);st.key=key;st.w=r.w;st.h=r.h;}
    _clF=_f;G.drawImage(st.c,0,0,st.w,st.h,K[0]-4/px,K[1]-4/px,st.w/px,st.h/px);}
  G.restore();
  if(kon){G.save();G.translate(16,top-12);cV(()=>G.arc(0,4,5,0,7),'#7E4F24','#5B3A22',1);cC(0,4,2,'#E8B46A');G.rotate(s.mik!=null?s.mik:-.35);const terug=e.swing<.3?Math.sin(clSeg(e.swing,0,.3)*Math.PI)*(e.swing<.08?5:3):0;
    cV(()=>G.roundRect(-3-terug,-3.8,17.5,7.6,3.6),'#5B5F6B','#3C3C3C',99);G.save();G.translate(-terug,0);cR(12.5,-4.6,4.2,9.2,1.6,'#3C3C3C');cR(4,-4.2,2,8.4,1,'#8C99A8');G.restore();cGl(4,0,6,3.8,4.6,1.2);G.restore();}
  if(kon&&!e.actief&&!e.dood){for(const k of [0,.5]){const p=(t*.7+k)%1;G.save();G.globalAlpha*=Math.sin(p*Math.PI);G.fillStyle=ck('#FFFFFF');G.font='900 '+(6+p*5)+'px Inter,system-ui,sans-serif';G.fillText('z',-4+p*10,top-50-p*15);G.restore();}}
  // kantelen vooraan
  const n=kon?6:4,mw=dw/(n*2-1);
  for(let i=0;i<n;i++){const x=-dw/2+i*mw*2;G.beginPath();G.roundRect(x,top-13.5,mw,7,2.2);cOmlijn(2.2);cV(()=>G.roundRect(x,top-13.5,mw,7,2.2),'#F3EBDD','#DCD0BC',x+mw*.62);cR(x+1,top-12.6,mw*.5,1.4,.7,'#FFFFFF');}
  G.restore();
}
function clRuine(e,bw,y0,tc){
  cV(()=>cPoly([[-bw/2,y0],[-bw/2,y0-16],[-bw/2+8,y0-21],[-bw/2+14,y0-13],[-2,y0-24],[6,y0-15],[bw/2-10,y0-22],[bw/2,y0-12],[bw/2,y0]]),'#E4DACA','#C9BCA6',bw*.15);
  cP([[-bw/2+8,y0-21],[-bw/2+14,y0-13],[-bw/2+10,y0-12]],'#5B5F6B');cP([[-2,y0-24],[6,y0-15],[0,y0-16]],'#5B5F6B');
  cV(()=>{G.moveTo(-6.5,y0);G.lineTo(-6.5,y0-7);G.arc(0,y0-7,6.5,Math.PI,0);G.lineTo(6.5,y0);G.closePath();},'#8B6B4A','#6E5238',2);
  cP([[bw/2-16,y0-20],[bw/2-8,y0-20],[bw/2-9,y0-8],[bw/2-12,y0-11],[bw/2-15,y0-6]],tc.d);
  const R=clRnd(e.id*7+3);for(let i=0;i<9;i++){const x=(R()-.5)*bw*1.3,y=y0-R()*6+3,s=2.5+R()*3.8;cV(()=>cPoly([[x-s,y],[x-s*.6,y-s],[x+s*.5,y-s*1.1],[x+s,y-.2]]),i%2?'#E4DACA':'#C2BDB5',i%2?'#C9BCA6':'#A39E96',x);}
}
// Sticker: teken een figuur op een los canvas en zet er een donkere contour omheen.
// Witte trefferflits als laag eroverheen. Geeft het canvas en de maat terug.
const _clS=[0,1,2].map(()=>{const c=document.createElement('canvas');c.width=c.height=8;return {c,g:c.getContext('2d')};});
function clSticker(kader,px,teken,flits,dikte){
  const w=Math.ceil((kader[2]-kader[0])*px)+8,h=Math.ceil((kader[3]-kader[1])*px)+8;
  for(const o of _clS){if(o.c.width<w)o.c.width=w;if(o.c.height<h)o.c.height=h;}
  const [A,B,C]=_clS;
  A.g.setTransform(1,0,0,1,0,0);A.g.clearRect(0,0,w,h);A.g.setTransform(px,0,0,px,4-kader[0]*px,4-kader[1]*px);
  const oud=G;G=A.g;G.globalAlpha=1;teken();G=oud;A.g.setTransform(1,0,0,1,0,0);
  if(flits){A.g.globalCompositeOperation='source-atop';A.g.fillStyle=`rgba(255,255,255,${flits})`;A.g.fillRect(0,0,w,h);A.g.globalCompositeOperation='source-over';}
  if(!dikte)return {c:A.c,w,h};
  B.g.setTransform(1,0,0,1,0,0);B.g.clearRect(0,0,w,h);B.g.drawImage(A.c,0,0,w,h,0,0,w,h);B.g.globalCompositeOperation='source-in';B.g.fillStyle=CL_INKT;B.g.fillRect(0,0,w,h);B.g.globalCompositeOperation='source-over';
  C.g.setTransform(1,0,0,1,0,0);C.g.clearRect(0,0,w,h);
  const n=CL.q&&CL.q.rand4?4:8;for(let i=0;i<n;i++){const a=i/n*Math.PI*2+(n===4?Math.PI/4:0);C.g.drawImage(B.c,0,0,w,h,Math.cos(a)*dikte,Math.sin(a)*dikte,w,h);}
  C.g.drawImage(A.c,0,0,w,h,0,0,w,h);return {c:C.c,w,h};
}
// Zet een sticker op het hoofdcanvas met de voeten op (sx, sy) in schermpunten.
function clPlak(kader,schaal,sx,sy,teken,flits,rand,gloed){
  const z=(CL.cam&&CL.cam.z)||1,dpr=CL.dpr||1,px=schaal*dpr*z;
  if(gloed){G.save();G.translate(sx,sy);G.scale(schaal,schaal);CL_GL=2;teken();CL_GL=0;G.restore();}
  CL_GL=gloed?1:0;
  const r=clSticker(kader,px,teken,flits,rand&&!CL.lite&&!(CL.q&&CL.q.geenRand)?Math.max(2,px*1.5):0);CL_GL=0;
  G.drawImage(r.c,0,0,r.w,r.h,sx+(kader[0]*px-4)/(dpr*z),sy+(kader[1]*px-4)/(dpr*z),r.w/(dpr*z),r.h/(dpr*z));
}

// ── Arena ───────────────────────────────────────────────────────────────
// Per arena een eigen palet en omgeving, vooraf op een los canvas getekend.
function clProj(x,y,z){return [CL.ox+x*CL.S,CL.oy+(CL_L-z)*CL.S*CL_SY-(y||0)*CL.S];}
function clScherm(x,y,z){const p=clProj(x,y,z),c=CL.cam;if(!c)return [p[0],p[1],0];
  return [CL.vw/2+(p[0]-CL.vw/2)*c.z,CL.vh/2+(p[1]-CL.vh/2+c.y)*c.z,0];}
function clPunt(px,py){const c=CL.cam||{z:1,y:0};const sx=CL.vw/2+(px-CL.vw/2)/c.z,sy=CL.vh/2+(py-CL.vh/2)/c.z-c.y;
  return [(sx-CL.ox)/CL.S,CL_L-(sy-CL.oy)/(CL.S*CL_SY)];}
// Decor: bomen, dennen, struiken, rotsen. Getekend zonder eigen schaduw; de
// schaduw komt los op het gras en de contour via clSticker (zoals de vechters).
function clBoom(s,kl,R){
  cV(()=>{G.moveTo(-3.2,0);G.lineTo(-2.6,-14);G.lineTo(2.6,-14);G.lineTo(3.2,0);G.quadraticCurveTo(5,1,6,0.2);G.lineTo(-6,.2);G.quadraticCurveTo(-5,1,-3.2,0);G.closePath();},'#B07A45','#8E5E32',.6);
  cL([[-1,-3],[-.6,-9]],'#C98E5A',1);
  cC(5,-21,12,kl[1]);cC(-6.5,-19,9,kl[1]);cC(-1.5,-26,12.5,kl[0]);cC(-7.5,-20,8.5,kl[0]);cC(6.5,-17,8,kl[0]);cC(2,-31,7,kl[0]);
  cC(-4,-29,5,clLt(kl[0],.22));cC(-9,-22,3.2,clLt(kl[0],.22));cC(3.5,-33,3,clLt(kl[0],.22));
  for(const [x,y] of [[6,-24],[-2,-18],[9,-15]])cA(x,y,3.2,.3,Math.PI-.3,kl[1],1.2);
  if(R&&R()<.35)for(const [x,y] of [[-6,-24],[4,-19],[0,-29]])cC(x,y,1.6,'#FF4B4B');
}
function clDen(kl,sneeuw){
  cV(()=>G.roundRect(-2.2,-8,4.4,8,1.5),'#8E5E32','#6E4421',.4);
  for(const [y,w,h] of [[-6,13,13],[-14,10.5,12.5],[-22,8,11.5]]){cV(()=>cPoly([[-w,y],[0,y-h],[w,y]]),kl[0],kl[1],0);cP([[-w,y],[w,y],[w*.8,y+2.2],[-w*.8,y+2.2]],kl[1]);
    if(sneeuw)cP([[-w*.35,y-h*.62],[0,y-h],[w*.35,y-h*.62],[w*.15,y-h*.5],[0,y-h*.6],[-w*.15,y-h*.5]],'#FFFFFF');}
  const a=G.globalAlpha;G.globalAlpha=a*.4;cL([[-3,-27],[-1.2,-31]],'#FFFFFF',1.6);G.globalAlpha=a;
}
function clStruik(kl,R){cC(-7,-5,6.5,kl[1]);cC(7,-5,6.8,kl[1]);cC(0,-8.5,8,kl[0]);cC(-5,-7,5,kl[0]);cC(-2.5,-11,3.4,clLt(kl[0],.22));
  if(R&&R()<.5)for(const [x,y] of [[-4,-6],[3,-9],[6,-4]])cC(x,y,1.4,R()<.5?'#CE82FF':'#FF8FC7');}
function clRots(s,mos){cV(()=>cPoly([[-11*s,0],[-9*s,-8*s],[-2*s,-13*s],[7*s,-10*s],[11*s,-2*s],[10*s,0]]),'#D4CFC7','#ABA59C',1*s);
  cP([[-9*s,-8*s],[-2*s,-13*s],[2*s,-10*s],[-5*s,-7*s]],'#E8E4DD');if(mos)cP([[-9*s,-8*s],[-2*s,-13*s],[3*s,-12*s],[-3*s,-10*s]],'#7BC043');}
function clBloem(kl){cC(-1.6,-1.6,1.4,kl);cC(1.6,-1.6,1.4,kl);cC(0,-3.2,1.4,kl);cC(0,0,1.4,kl);cC(0,-1.6,.9,'#FFC800');}
function clRiet(){for(const [x,h] of [[-3,14],[0,18],[3,12]]){cL([[x,0],[x+1,-h]],'#58A836',1.6);cV(()=>G.roundRect(x-.2,-h-1,2.4,6.4,1.2),'#8B5A2B','#6E4421',x+1);}cL([[-5,0],[-7,-8]],'#7BC043',1.4);cL([[5,0],[7,-7]],'#7BC043',1.4);}
function clPaal(kl){cV(()=>G.roundRect(-1.3,-36,2.6,36,1.2),'#9B6634','#7E4F24',.4);const w=0;cP([[0,-35],[14,-32],[0,-27]],kl);cP([[0,-33.5],[8,-32],[0,-30.5]],clLt(kl,.35));cC(0,-36.5,1.8,'#FFC800');}
function clZuil(){cV(()=>G.roundRect(-6,-46,12,46,2),'#F1EBDF','#D9CFBE',2);for(const x of [-3,0,3])cL([[x,-42],[x,-6]],'#E2D8C7',1);cV(()=>G.roundRect(-8.5,-51,17,5,2),'#E8E0D0','#D2C6B2',4);cV(()=>G.roundRect(-8.5,-4.5,17,4.5,1.5),'#E8E0D0','#D2C6B2',4);}
function clPot(){cV(()=>cPoly([[-6,0],[-7.5,-9],[7.5,-9],[6,0]]),'#E0874A','#C46E33',1);cR(-8,-10.5,16,2.6,1.2,'#C46E33');cC(-3,-14,5,'#58CC02');cC(3,-15,5,'#46A302');cC(0,-18.5,5.2,'#58CC02');cC(-1.4,-19.4,1.8,'#89E219');}
const CL_DKADER={boom:[-22,-46,22,4],den:[-16,-38,16,4],struik:[-16,-18,16,4],rots:[-14,-16,14,3],riet:[-9,-22,9,2],paal:[-3,-40,16,2],zuil:[-11,-54,11,2],pot:[-10,-26,10,2],steen:[-14,-16,14,3]};
function clBouwBg(){
  const ar=CL_ARENAS[CL.arena||0],S=CL.S,dpr=Math.min(CL.dpr,2);
  const X0=-8,X1=26,Z0=-5,Z1=36,PT=3*S;
  const w=Math.ceil((X1-X0)*S),h=Math.ceil((Z1-Z0)*S*CL_SY+PT);
  const c=CL.bg||document.createElement('canvas');c.width=Math.ceil(w*dpr);c.height=Math.ceil(h*dpr);
  const g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);
  Object.assign(CL,{bg:c,bgW:w,bgH:h,bgX0:X0,bgZ1:Z1,bgPT:PT,bgNodig:false});
  const oud=G;G=g;const k=S/CL_U;
  const P=(x,z)=>[(x-X0)*S,(Z1-z)*S*CL_SY+PT];
  const R=clRnd((CL.arena||0)*31+7);
  const gd=clDk(ar.gras[1],.18),gl=clLt(ar.gras[0],.2);
  g.fillStyle=ar.buiten;g.fillRect(0,0,w,h);
  // Buiten het veld: plukjes gras of vloertegels.
  if(ar.decor==='hal'){for(let x=X0;x<X1;x+=2)for(let z=Z0;z<Z1;z+=2){const [a,b]=P(x,z+2);g.fillStyle=((x+z)/2)%2?ar.buiten:ar.buitenD;g.fillRect(a,b,2*S,2*S*CL_SY);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(a,b,2*S,2);}}
  else{for(let i=0;i<70;i++){const x=X0+R()*(X1-X0),z=Z0+R()*(Z1-Z0);if(x>-1&&x<19&&z>-1&&z<33)continue;const [a,b]=P(x,z);g.globalAlpha=.25;cE(a,b,S*(1+R()*1.6),S*.5*(1+R()),clLt(ar.buiten,.25));g.globalAlpha=1;}
    for(let i=0;i<320;i++){const x=X0+R()*(X1-X0),z=Z0+R()*(Z1-Z0);if(x>-1&&x<19&&z>-1&&z<33)continue;const [a,b]=P(x,z);cL([[a-2.2,b-3.4],[a-.6,b]],ar.buitenD,1.3);cL([[a+.4,b-4.2],[a,b]],ar.buitenD,1.3);cL([[a+2.4,b-3],[a+.6,b]],ar.buitenD,1.3);}}
  // Veld: geblokt gras met lichte vlekken en plukjes.
  for(let x=0;x<CL_W;x++)for(let z=0;z<CL_L;z++){const [a,b]=P(x,z+1);g.fillStyle=ar.gras[(x+z)%2];g.fillRect(a,b,S+.5,S*CL_SY+.5);}
  for(let i=0;i<46;i++){const x=.5+R()*17,z=.5+R()*31;if(Math.abs(z-16)<1.6)continue;const [a,b]=P(x,z);g.globalAlpha=.22;cE(a,b,S*(.6+R()*1.1),S*CL_SY*(.35+R()*.5),gl);g.globalAlpha=1;}
  for(let i=0;i<300;i++){const x=.3+R()*17.4,z=.3+R()*31.4;if(Math.abs(z-16)<1.6)continue;const [a,b]=P(x,z);const kl=R()<.7?gd:gl;
    cL([[a-1.8,b-2.8],[a-.4,b]],kl,1.1);cL([[a+.3,b-3.4],[a,b]],kl,1.1);cL([[a+2,b-2.4],[a+.5,b]],kl,1.1);}
  // Zachte rand langs de muren (diepte).
  {const [a,b]=P(0,CL_L),[a2,b2]=P(CL_W,0);g.fillStyle='rgba(30,58,16,.12)';g.fillRect(a,b,a2-a,S*.32);g.fillRect(a,b,S*.28,b2-b);g.fillRect(a2-S*.28,b,S*.28,b2-b);}
  // Keienpaden: zandbed met een donkere rand en ronde keien erin.
  const padPts=[];for(const m of [z=>z,z=>CL_L-z]){padPts.push([[[3.5,6.5],[3.5,15.1]].map(p=>[p[0],m(p[1])]),1.7]);padPts.push([[[14.5,6.5],[14.5,15.1]].map(p=>[p[0],m(p[1])]),1.7]);padPts.push([[[3.5,6.5],[6,3.4],[12,3.4],[14.5,6.5]].map(p=>[p[0],m(p[1])]),1.35]);}
  for(const [kl,dy,dw] of [[clDk(ar.padD,.15),3,5],[ar.padD,1.5,3],[ar.pad,0,0]])for(const [pts,br] of padPts){g.strokeStyle=kl;g.lineWidth=br*S+dw;g.lineCap='round';g.lineJoin='round';g.beginPath();pts.forEach((p,i)=>{const [a,b]=P(p[0],p[1]);i?g.lineTo(a,b+dy):g.moveTo(a,b+dy);});g.stroke();}
  const kei=clLt(ar.pad,.35),keiD=ar.padD;
  for(const [pts,br] of padPts)for(let s=0;s<pts.length-1;s++){const [x0,z0]=pts[s],[x1,z1]=pts[s+1],L=Math.hypot(x1-x0,z1-z0),nx=-(z1-z0)/L,nz=(x1-x0)/L;
    for(let d=.25,rij=0;d<L-.1;d+=.5,rij++)for(let o=-br/2+.3+(rij%2)*.22;o<br/2-.2;o+=.48){if(R()<.18)continue;const x=x0+(x1-x0)*d/L+nx*o+(R()-.5)*.08,z=z0+(z1-z0)*d/L+nz*o+(R()-.5)*.08;const [a,b]=P(x,z);
      const rx=S*(.16+R()*.05),ry=rx*.72;cE(a,b+1.2,rx,ry,keiD);cE(a,b,rx,ry,kei);cE(a-rx*.3,b-ry*.35,rx*.35,ry*.3,'rgba(255,255,255,.55)');}}
  // Rivier: twee blauwtinten, een stenen oever en wat stenen in het water.
  {const [a,b]=P(X0,CL_RIV1),[a2,b2]=P(X1,CL_RIV0);g.fillStyle='#4FC0F3';g.fillRect(a,b,a2-a,b2-b);
    g.fillStyle='#3FAEE6';g.fillRect(a,b,a2-a,S*.42);g.fillStyle='#7AD3F7';g.fillRect(a,b+(b2-b)*.55,a2-a,(b2-b)*.18);
    // stenen oever aan de overkant (je ziet de voorkant)
    const oh=S*.42;g.fillStyle='#B9A886';g.fillRect(a,b-oh,a2-a,oh);
    for(let x=a-((P(0,0)[0]-a)%(S*.9)),r=0;x<a2;x+=S*.9,r++){g.fillStyle=r%2?'#CFC0A2':'#C6B795';g.beginPath();g.roundRect(x+1,b-oh+1.5,S*.9-2,oh*.5-2,2.5);g.fill();g.fillStyle=r%2?'#C6B795':'#CFC0A2';g.beginPath();g.roundRect(x+1+S*.45,b-oh*.5+1,S*.9-2,oh*.5-2,2.5);g.fill();}
    g.fillStyle='#A7956F';g.fillRect(a,b-2,a2-a,2);
    g.fillStyle=clDk(ar.gras[0],.12);g.fillRect(a,b-oh-S*.12,a2-a,S*.12);
    g.fillStyle='#A9E3FB';g.fillRect(a,b2-3,a2-a,3);g.fillStyle=clDk(ar.gras[1],.15);g.fillRect(a,b2,a2-a,2);}
  for(let i=0;i<10;i++){const x=X0+R()*(X1-X0);if(Math.abs(x-3.5)<2.2||Math.abs(x-14.5)<2.2)continue;const z=R()<.5?15.2:16.75,[a,b]=P(x,z);
    if(ar.decor==='delta'){g.save();g.translate(a,b);g.scale(k,k);cE(0,0,5.4,2.6,'#58CC02');cP([[0,0],[5.4,-1],[4.4,1.6]],'#4FC0F3');if(R()<.5){cC(-1,-1.6,1.8,'#FF8FC7');cC(-1,-1.6,.7,'#FFC800');}g.restore();}
    else{const r=clSticker(CL_DKADER.steen,k*.7*dpr,()=>clRots(.9,R()<.3),0,Math.max(1.5,k*.7*dpr*1.3));g.drawImage(r.c,0,0,r.w,r.h,a+(CL_DKADER.steen[0]*k*.7*dpr-4)/dpr,b+(CL_DKADER.steen[1]*k*.7*dpr-4)/dpr,r.w/dpr,r.h/dpr);}}
  // Bruggen: planken met spijkers, palen met kapjes en een touwleuning.
  for(const bx of CL_BRUG){const [a,b]=P(bx-1.55,CL_RIV1+.5),[a2,b2]=P(bx+1.55,CL_RIV0-.5),bw=a2-a,bh=b2-b;
    g.fillStyle='rgba(20,60,90,.25)';g.fillRect(a+S*.2,b2,bw,S*.3);
    g.fillStyle='#6E4421';g.beginPath();g.roundRect(a-1,b-1,bw+2,bh+S*.32,4);g.fill();
    const n=9;for(let i=0;i<n;i++){const y=b+i*bh/n;g.fillStyle=i%2?'#E8B46A':'#DFA85C';g.beginPath();g.roundRect(a+1,y+.6,bw-2,bh/n-1.2,2);g.fill();
      g.fillStyle='rgba(255,255,255,.22)';g.fillRect(a+3,y+1.2,bw-6,1.2);g.fillStyle='#8E5E32';g.beginPath();g.arc(a+S*.45,y+bh/n/2,1.1,0,7);g.arc(a2-S*.45,y+bh/n/2,1.1,0,7);g.fill();}
    g.fillStyle='#9B6634';g.fillRect(a,b2,bw,S*.3);
    for(const x of [a+S*.12,a2-S*.12]){const posts=[b-S*.15,b+bh*.5-S*.1,b2-S*.05];
      g.strokeStyle='#C9A274';g.lineWidth=2;g.beginPath();g.moveTo(x,posts[0]);g.quadraticCurveTo(x+(x<bx*S?-.5:.5),(posts[0]+posts[1])/2+S*.25,x,posts[1]);g.quadraticCurveTo(x,(posts[1]+posts[2])/2+S*.25,x,posts[2]);g.stroke();
      for(const y of posts){g.fillStyle=CL_INKT;g.beginPath();g.roundRect(x-S*.17,y-S*.38,S*.34,S*.5,3);g.fill();g.fillStyle='#9B6634';g.beginPath();g.roundRect(x-S*.14,y-S*.35,S*.28,S*.44,2.5);g.fill();g.fillStyle='#C98E46';g.beginPath();g.roundRect(x-S*.14,y-S*.35,S*.28,S*.12,2);g.fill();}}}
  // Stenen muur rond het veld, met kantelen aan de korte kanten.
  // Doorlopende muur: donkere omlijning, lichte bovenkant, voegen en kantelen.
  const strook=(x,y,bw,bh,r)=>{g.fillStyle=CL_INKT;g.beginPath();g.roundRect(x-1.5,y-1.5,bw+3,bh+3,r+1);g.fill();g.fillStyle='#D2C4AD';g.beginPath();g.roundRect(x,y,bw,bh,r);g.fill();};
  const muurH=(z,x0,x1)=>{const [a,b]=P(x0,z),[a2]=P(x1,z),bh=S*.5,y=b-bh;
    for(let x=a+S*.1,i=0;x<a2-S*.5;x+=S*.9,i++)if(i%2===0){strook(x,y-S*.34,S*.62,S*.4,3);g.fillStyle='#F6EFE3';g.beginPath();g.roundRect(x,y-S*.34,S*.62,S*.2,3);g.fill();}
    strook(a,y,a2-a,bh,4);g.fillStyle='#EFE6D6';g.beginPath();g.roundRect(a,y,a2-a,bh*.42,4);g.fill();
    g.fillStyle='rgba(43,34,51,.28)';for(let r=0;r<2;r++)for(let x=a+(r?S*.45:S*.9);x<a2-2;x+=S*.9)g.fillRect(x,y+bh*.45+r*bh*.27,1.4,bh*.25);g.fillRect(a+2,y+bh*.7,a2-a-4,1.2);};
  const muurV=(x,z0,z1)=>{const [a,b]=P(x,z1),[,b2]=P(x,z0),bw=S*.5;strook(a-bw/2,b,bw,b2-b,4);g.fillStyle='#EFE6D6';g.beginPath();g.roundRect(a-bw/2,b,bw*.62,b2-b,4);g.fill();
    g.fillStyle='rgba(43,34,51,.28)';for(let y=b+S*.6;y<b2-3;y+=S*.6)g.fillRect(a-bw/2+2,y,bw-4,1.3);};
  muurV(-.3,CL_RIV1+.6,32.3);muurV(18.3,CL_RIV1+.6,32.3);muurV(-.3,-.3,CL_RIV0-.6);muurV(18.3,-.3,CL_RIV0-.6);
  muurH(32.35,-.55,18.55);muurH(-.2,-.55,18.55);
  // Omgeving.
  const dec=[];const kies=a=>a[(R()*a.length)|0];
  const BL=['#FF8FC7','#FFFFFF','#FFC800','#CE82FF'];
  for(let i=0;i<130;i++){const kant=R()<.5;const x=kant?X0+R()*(-1.2-X0):19.2+R()*(X1-19.2),z=Z0+R()*(Z1-Z0);if(Math.abs(z-16)<1.6){dec.push({x,z,t:ar.decor==='hal'?'pot':'riet',s:1});continue;}
    let t;const r=R();
    if(ar.decor==='berg')t=r<.5?'den':r<.75?'rots':'struik';
    else if(ar.decor==='hal')t=r<.25?'zuil':r<.4?'pot':'niets';
    else if(ar.decor==='kasteel')t=r<.55?'boom':r<.7?'struik':r<.8?'paal':'bloem';
    else t=r<.6?'boom':r<.78?'struik':r<.88?'rots':'bloem';
    if(t!=='niets')dec.push({x,z,t,s:.85+R()*.5,kl:kies(BL)});}
  for(let i=0;i<40;i++){const x=-1+R()*20,z=R()<.5?Z0+R()*(-1.4-Z0):33.6+R()*(Z1-33.6);dec.push({x,z,t:ar.decor==='berg'?'den':ar.decor==='hal'?'pot':R()<.6?'boom':'struik',s:.8+R()*.4,kl:kies(BL)});}
  for(let i=0;i<40;i++){const x=R()<.5?.35+R()*.8:16.85+R()*.8,z=.6+R()*30.8;if(Math.abs(z-16)<1.8||Math.abs(z-6.5)<2.2||Math.abs(z-25.5)<2.2)continue;dec.push({x,z,t:'bloem',s:1,kl:kies(BL)});}
  dec.sort((a,b)=>b.z-a.z);
  for(const d of dec){const [a,b]=P(d.x,d.z);
    if(d.t==='bloem'){g.save();g.translate(a,b);g.scale(k,k);clBloem(d.kl);g.restore();continue;}
    const K=CL_DKADER[d.t],px=k*d.s*dpr;
    if(d.t==='boom'||d.t==='den'||d.t==='struik'||d.t==='rots'||d.t==='zuil'||d.t==='pot'){g.globalAlpha=.16;cE(a+3*k*d.s,b,(d.t==='boom'?14:d.t==='den'?11:10)*k*d.s,4.4*k*d.s,'#1E3A10');g.globalAlpha=1;}
    const r=clSticker(K,px,()=>{
      if(d.t==='boom')clBoom(1,ar.boom,R);else if(d.t==='den')clDen(ar.boom,ar.decor==='berg');else if(d.t==='struik')clStruik(ar.boom,R);else if(d.t==='rots')clRots(1,R()<.4);
      else if(d.t==='riet')clRiet();else if(d.t==='paal')clPaal(d.kl==='#FFFFFF'?'#FFC800':d.kl);else if(d.t==='zuil')clZuil();else if(d.t==='pot')clPot();},0,Math.max(1.5,px*1.3));
    g.drawImage(r.c,0,0,r.w,r.h,a+(K[0]*px-4)/dpr,b+(K[1]*px-4)/dpr,r.w/dpr,r.h/dpr);}
  G=oud;
}
// Water: schuim langs de oevers, golfjes en schitteringen, tussen de bruggen door.
function clGolven(){
  const t=CL.t||0,S=CL.S;G.save();G.beginPath();
  for(const [x0,x1] of [[-8,CL_BRUG[0]-1.6],[CL_BRUG[0]+1.6,CL_BRUG[1]-1.6],[CL_BRUG[1]+1.6,26]]){const [a,b]=clProj(x0,0,CL_RIV1),[a2,b2]=clProj(x1,0,CL_RIV0);G.rect(a,b,a2-a,b2-b);}
  G.clip();
  const [ax,by]=clProj(-8,0,CL_RIV1),[,by2]=clProj(-8,0,CL_RIV0),[ax2]=clProj(26,0,CL_RIV1);
  G.fillStyle='rgba(255,255,255,.7)';G.beginPath();G.moveTo(ax,by);for(let x=ax;x<=ax2;x+=6)G.lineTo(x,by+S*.12+Math.sin(x*.12+t*2.2)*S*.05);G.lineTo(ax2,by);G.closePath();G.fill();
  G.beginPath();G.moveTo(ax,by2);for(let x=ax;x<=ax2;x+=6)G.lineTo(x,by2-S*.1-Math.sin(x*.1-t*1.8)*S*.05);G.lineTo(ax2,by2);G.closePath();G.fill();
  G.globalAlpha=.55;
  for(let i=0;i<22;i++){const x=-8+((i*3.1+t*(.5+(i%3)*.15))%34),z=15.5+(i%3)*.45;const [a,b]=clProj(x,0,z);cL([[a,b],[a+S*.7,b]],'#FFFFFF',1.6);}
  G.globalAlpha=1;
  for(let i=0;i<9;i++){const fase=(t*.7+i*.37)%1,x=-6+((i*4.3)%30),z=15.4+((i*.53)%1.3),[a,b]=clProj(x,0,z),s=S*.16*Math.sin(fase*Math.PI);
    if(s>.5)cP([[a,b-s],[a+s*.3,b],[a,b+s],[a-s*.3,b]],'#FFFFFF');}
  G.restore();
}
// Leven rond het veld: vlinders langs de randen en af en toe de schaduw van een vogel.
function clLeven(){
  if(CL.lite)return;const t=CL.t||0,S=CL.S;
  for(let i=0;i<4;i++){const x=i<2?-1.4+Math.sin(t*.4+i*2)*.9:19.4+Math.sin(t*.35+i)*.9,z=6+i*6.5+Math.sin(t*.5+i*1.7)*2.2,y=1.2+Math.sin(t*1.3+i)*.4;
    const [a,b]=clProj(x,y,z),fl=Math.abs(Math.sin(t*14+i)),kl=['#FF8FC7','#FFC800','#CE82FF','#FFFFFF'][i];
    cE(a-S*.12*fl,b,S*.13*fl+.6,S*.1,kl);cE(a+S*.12*fl,b,S*.13*fl+.6,S*.1,kl);cR(a-.6,b-S*.08,1.2,S*.16,.6,CL_INKT);}
  const p=(t%14)/5;if(p<1){const x=-4+p*26,z=34-p*36,[a,b]=clProj(x,0,z);G.save();G.globalAlpha=.13;G.translate(a,b);
    const f=Math.sin(t*10)*.3;cE(0,0,S*.5,S*.16,'#1E3A10');cP([[0,0],[-S*.9,-S*(.3+f)],[-S*.3,0]],'#1E3A10');cP([[0,0],[S*.9,-S*(.3+f)],[S*.3,0]],'#1E3A10');G.restore();}
}
// Camera: het hele veld past precies in het vrije vlak boven het dock.
function clFit(){
  const w=CL.vw,h=CL.vh;if(!w||!h)return;const oud=CL.S;
  if(CL.mode==='lobby'){CL.S=Math.max(Math.min(w/15.5,h/18),h/(CL_L*CL_SY+2));CL.lobbyPan=Math.max(0,(CL_L*CL_SY+2)*CL.S-h)/2;}
  else{const top=CL.topPad!=null?CL.topPad:58;CL.S=Math.min((w-8)/19,(h-top-8)/(CL_L*CL_SY+.8));CL.lobbyPan=0;}
  CL.S=Math.max(8,CL.S);const fw=CL_W*CL.S,fh=CL_L*CL.S*CL_SY;
  CL.ox=(w-fw)/2;
  CL.oy=CL.mode==='lobby'?(h-fh)/2:(CL.topPad!=null?CL.topPad:58)+.4*CL.S+Math.max(0,(h-(CL.topPad!=null?CL.topPad:58)-8-fh-.8*CL.S)/2);
  if(oud!==CL.S)CL.bgNodig=true;
}

// ── Entiteiten ──────────────────────────────────────────────────────────
function clHpBar(e){
  const b=document.createElement('div');b.className='cl-hp t'+e.team+(e.soort==='toren'?' toren '+e.sub:'');
  b.innerHTML=e.soort==='toren'?`<i></i><b>${Math.ceil(e.hp)}</b>`:'<i></i>';
  CL.bars.appendChild(b);e.bar=b;e.barI=b.querySelector('i');e.barB=b.querySelector('b');
}
function clNieuw(e){e.id=++CL.nid;e.cd=e.cd==null?.5:e.cd;e.tgt=null;e.herzie=0;e.fase=Math.random()*6;e.hoek=e.team?0:Math.PI;e.hitT=0;e.swing=9;e.born=CL.t;e.f=0;
  e.m=e.m||{};e.m.dir=e.team?-1:1;e.rug=!e.team&&e.soort==='unit';
  CL.ents.push(e);clHpBar(e);return e;}
function clMaakToren(sub,team,x,z){
  const d=CL_TOREN[sub];
  return clNieuw({soort:'toren',sub,team,x,z,hp:d.hp,max:d.hp,r:d.r,bereik:d.bereik,dmg:d.dmg,hit:d.hit,doel:'alles',m:{},actief:sub==='prinses',hoogte:sub==='koning'?3.3:2.85,cd:1});
}
const CL_FORM={1:[[0,0]],2:[[-.45,0],[.45,0]],3:[[0,.4],[-.45,-.3],[.45,-.3]],4:[[-.4,.4],[.4,.4],[-.4,-.4],[.4,-.4]]};
function clInzet(id,team,x,z,sterk){
  const d=CL_KAARTEN[id];const lvl=team?CL.botLvl||1:clLvl(id);const f=(sterk?1.25:1)*clLvlF(lvl);
  if(d.t==='spreuk'){clSpreuk(id,team,x,z,f);return;}
  const n=d.n||1;const F=CL_FORM[n]||CL_FORM[1];
  F.forEach(([ox,oz],i)=>{
    clNieuw({soort:d.t==='bouw'?'bouw':'unit',kaart:id,team,x:x+ox,z:z+(team?-oz:oz),y:0,hp:d.hp*f,max:d.hp*f,r:d.r,lucht:!!d.vlieg,bereik:d.bereik,dmg:d.dmg*f,hit:d.hit,
      v:d.v,doel:d.doel,splash:d.splash,leeft:d.leeft,m:{},drop:.4+i*.06,inzet:.65,eerste:i===0,cd:d.t==='bouw'?.8:.6,sterk:!!sterk,hoogte:(CL_H2D[id]||2.4)*CL_US});
  });
  clStof(x,z,d.t==='bouw'?1.6:1.1);clLichtzuil(x,z,team);arcSnd('pop');
}
function clLevend(e){return e&&!e.dood&&CL.ents.includes(e);}
function clAfst(a,b){return Math.hypot(a.x-b.x,a.z-b.z);}
function clKanRaken(a,b){if(a.team===b.team||b.dood)return false;if(a.doel==='gebouw')return b.soort==='toren'||b.soort==='bouw';if(a.doel==='grond'&&b.lucht)return false;
  if((a.soort==='toren'||a.soort==='bouw')&&b.soort==='toren')return false;return true;}
function clInBereik(a,b){return clAfst(a,b)-(b.r||.4)-(a.soort==='unit'?a.r*.3:0)<=a.bereik;}
function clKant(z){return z<CL_RIV0-.05?0:z>CL_RIV1+.05?1:-1;}
function clLaanDoel(e){
  const vij=CL.ents.filter(o=>o.team!==e.team&&o.soort==='toren'&&!o.dood);
  const links=e.x<9;const pr=vij.find(o=>o.sub==='prinses'&&(o.x<9)===links);
  return pr||vij.find(o=>o.sub==='koning')||vij[0]||null;
}
function clZoekDoel(e){
  let best=null,bd=1e9;const zicht=e.soort==='unit'?Math.max(e.bereik+4.5,5.5):e.bereik+(e.soort==='toren'?0:.2);
  for(const o of CL.ents){if(!clKanRaken(e,o))continue;if(e.soort!=='unit'&&o.soort==='toren')continue;
    const d=clAfst(e,o)-(o.r||.4);if(d<=zicht&&d<bd){bd=d;best=o;}}
  if(!best&&e.soort==='unit'){if(e.doel==='gebouw'){let bb=null,bdd=1e9;for(const o of CL.ents){if(o.team!==e.team&&o.soort==='bouw'&&!o.dood){const d=clAfst(e,o);if(d<bdd&&d<6){bdd=d;bb=o;}}}if(bb)return bb;}
    return clLaanDoel(e);}
  return best;
}
function clBeweeg(e,tx,tz,dt){
  let wx=tx,wz=tz;
  if(!e.lucht){const mk=clKant(e.z),dk=tz<16?0:1;
    if(mk===-1){const bx=Math.abs(e.x-CL_BRUG[0])<Math.abs(e.x-CL_BRUG[1])?CL_BRUG[0]:CL_BRUG[1];wx=bx;wz=dk?CL_RIV1+.9:CL_RIV0-.9;}
    else if(mk!==dk){const bx=(Math.abs(e.x-3.5)+Math.abs(tx-3.5))<(Math.abs(e.x-14.5)+Math.abs(tx-14.5))?3.5:14.5;
      if(Math.abs(e.x-bx)<.7){wx=bx;wz=mk===0?CL_RIV1+.9:CL_RIV0-.9;}else{wx=bx;wz=mk===0?CL_RIV0-.5:CL_RIV1+.5;}}}
  const dx=wx-e.x,dz=wz-e.z,l=Math.hypot(dx,dz)||1;const stap=Math.min(l,e.v*dt*CL.tempo);
  e.x+=dx/l*stap;e.z+=dz/l*stap;e.loopt=true;e.kijk=Math.atan2(dx,-dz);
}
function clSchade(o,dmg,bron){
  if(!o||o.dood)return;o.hp-=dmg;o.hitT=.12;o.flits=.09;
  if(o.soort!=='toren'){const zwaar=o.max>=1300;o.sqv=(o.sqv||0)-(zwaar?1.8:3.2);
    if(bron&&o.soort==='unit'){const dx=o.x-bron.x,dz=o.z-bron.z,l=Math.hypot(dx,dz)||1,kr=o.max<=400?.22:zwaar?.05:.12;o.kbx=(o.kbx||0)+dx/l*kr;o.kbz=(o.kbz||0)+dz/l*kr;}}
  if(dmg>=40&&(!o.laatstGetal||CL.t-o.laatstGetal>.22)){o.laatstGetal=CL.t;const pt=clScherm(o.x,(o.hoogte||2)+.2,o.z);clGetal(pt,Math.round(dmg),o.team);}
  if(o.soort==='toren'&&o.sub==='koning'&&!o.actief){o.actief=true;clKoningWakker(o);}
  if(o.hp<=0)clDood(o,bron);
}
function clGetal(pt,n,team){if(!CL.pops||CL.lite)return;const e=document.createElement('div');e.className='cl-getal t'+team;e.textContent=n;e.style.left=(pt[0]+(Math.random()-.5)*18)+'px';e.style.top=pt[1]+'px';CL.pops.appendChild(e);setTimeout(()=>e.remove(),800);}
function clKoningWakker(o){const m=clScherm(o.x,3.8,o.z);clPop(m,'De koning doet mee','kw');arcSnd('flip');o.juichT=CL.t;}
function clDood(o){
  o.dood=true;o.hp=0;
  if(o.soort==='toren'&&CL.klaar){clInstort(o);return;}
  if(o.soort==='toren'){
    const tegen=1-o.team;CL.kronen[tegen]+=o.sub==='koning'?3-CL.kronen[tegen]:1;CL.kronen[tegen]=Math.min(3,CL.kronen[tegen]);
    clInstort(o);clKroonVlieg(o,tegen);clFx('toren');
    if(Math.random()<.7)setTimeout(()=>{if(CL.on&&!CL.klaar)clEmote(1,arcPick(tegen===1?CL_EMO_BOT.toren:CL_EMO_BOT.verlies));},900);
    if(o.sub==='prinses'){const k=CL.ents.find(x=>x.team===o.team&&x.sub==='koning'&&!x.dood);if(k&&!k.actief){k.actief=true;clKoningWakker(k);}}
    if(o.sub==='koning'||CL.overtime)CL.eindeNa=1.4;
    CL.hudUpd=true;
  }else if(o.soort==='unit'&&o.kaart!=='elektron'){
    // Valt om, ogen worden kruisjes, en verdwijnt dan in een wolkje.
    o.flits=null;CL.lijken.push({e:o,t:0});
  }else{clPoef(o.x,o.z,o.lucht?2.2:.6,o.soort==='bouw'?9:5);clVonk(o.x,o.lucht?2.2:.8,o.z,o.soort==='bouw'?'#FFC800':CL_TEAM[o.team].l,7);if(o.soort==='bouw')clBrokken(o.x,o.z,1.2,8,['#C98E46','#A8702E']);}
  if(o.bar){o.bar.remove();o.bar=null;}
  if(o.soort!=='toren')CL.ents=CL.ents.filter(x=>x!==o);
  if(o._st){o._st.c.width=o._st.c.height=0;o._st=null;}
}
function clLijkenStap(dt){
  for(const l of CL.lijken.slice()){l.t+=dt;
    if(l.t>.62&&!l.plof){l.plof=true;clPoef(l.e.x,l.e.z,.3,5,0xF2EEE6,.85);clVonk(l.e.x,.8,l.e.z,'#FFFFFF',4);}
    if(l.t>.8)CL.lijken=CL.lijken.filter(x=>x!==l);}
}
function clInstort(o){
  arcFx('boom');arcHap([40,30,80]);clSchud(.7);o.m.val={t:0};
  const H=o.sub==='koning'?1.6:1.4;
  clFx2(.5,p=>{const [sx,sy]=clProj(o.x,H,o.z),R=CL.S*2.2*(.3+clEo(p)*.9);G.save();G.globalAlpha*=(1-p)*(1-p);cC(sx,sy,R,'#FF9600');cC(sx-R*.1,sy-R*.1,R*.72,'#FFC800');if(p<.3)cC(sx-R*.15,sy-R*.15,R*.42,'#FFFFFF');G.restore();});
  clRing(o.x,o.z,3.2,'#FFFFFF');clRing(o.x,o.z,2.4,'#EDE5D7');clDecal(o.x,o.z,1.4,'schroei');
  for(let i=0;i<16;i++)setTimeout(()=>{if(CL.on)clPoef(o.x+(Math.random()-.5)*2.8,o.z+(Math.random()-.5)*2.2,Math.random()*3,3,0xEDE5D7,1.25);},i*50);
  clBrokken(o.x,o.z,2.5,CL.lite?6:16,['#F3EBDD','#DCD0BC']);
  if(o.bar){o.bar.remove();o.bar=null;}
}
function clBrokken(x,z,y,n,kl){
  const B=[];for(let i=0;i<n;i++){const a=Math.random()*6.28,v=2+Math.random()*3.4;
    B.push({x,z,y:y*(.6+Math.random()*.6),vx:Math.cos(a)*v,vz:Math.sin(a)*v*.75,vy:4+Math.random()*5,r:Math.random()*6,vr:(Math.random()-.5)*14,s:.45+Math.random()*.7,kl:i%3?kl:['#CFCAC2','#ABA59C']});}
  clFx2(1.6,p=>{const a0=G.globalAlpha;G.globalAlpha=p>.75?(1-p)/.25:1;
    for(const b of B){const [sx,sy]=clProj(b.x,b.y,b.z);G.save();G.translate(sx,sy);G.rotate(b.r);const k=CL.S/CL_U*b.s;G.scale(k,k);cV(()=>cPoly([[-6,-4],[1,-7],[7,-1],[3,5.5],[-5,5]]),b.kl[0],b.kl[1],1.5);G.restore();}
    G.globalAlpha=a0;},'top',(p,dt)=>{for(const b of B){b.vy-=22*dt;b.x+=b.vx*dt;b.z+=b.vz*dt;b.y+=b.vy*dt;b.r+=b.vr*dt;if(b.y<.05){b.y=.05;b.vx*=.45;b.vz*=.45;b.vy=Math.abs(b.vy)*.3;b.vr*=.5;}}});
}
function clKroonVlieg(o,team){
  const m=clScherm(o.x,4,o.z);const r=document.getElementById('cl-veld').getBoundingClientRect();
  const doel=document.querySelector(`#cl-kronen${team} .k:nth-child(${Math.min(3,CL.kronen[team])})`);
  const b=doel?arcMid(doel):{x:r.left+r.width/2,y:r.top+30};
  try{arcFly({x:r.left+m[0],y:r.top+m[1]},b,`<span class="cl-kroon-vl t${team}">${CL_KROON}</span>`,{duur:900,mid:1.7,eind:1,boog:-40});}catch(e){}
  setTimeout(()=>{if(CL.on){clHud();arcSnd(team?'wrong':'fanfare');}},850);
}
const CL_ZWAARDEN='<svg class="cl-zwaarden" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#2B2233" stroke-width="3" stroke-linejoin="round"><path d="M12 6 40 40l-4 4L8 10V6z" fill="#EEF2F6"/><path d="M52 6 24 40l4 4 28-34V6z" fill="#EEF2F6"/><path d="M30 40l-8 8 4 4 8-8zM34 40l8 8-4 4-8-8z" fill="#FFC800"/><path d="M20 50l-6 6 3 3 6-6zM44 50l6 6-3 3-6-6z" fill="#9B6634"/></g></svg>';
const CL_KROON='<svg viewBox="0 0 24 20" aria-hidden="true"><path d="M2 16 1 5l6 5 5-8 5 8 6-5-1 11z" fill="currentColor"/><path d="M3.4 14.4 2.8 8l3.6 3" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.4" stroke-linecap="round"/><rect x="2" y="16" width="20" height="3" rx="1.5" fill="currentColor"/></svg>';

// ── Aanvallen en projectielen ───────────────────────────────────────────
function clAanval(e,o){
  e.swing=0;
  if(e.soort==='toren'&&e.sub==='koning')setTimeout(()=>{if(!CL.on)return;const m=e.m.mik!=null?e.m.mik:-.35,mx=e.x+.8+Math.cos(m)*.85,my=1.25-Math.sin(m)*.85;clMond(mx,my,e.z,m);clPoef(mx,e.z,my-.3,2,0xE8E4DC,.7);},160);
  const kind=e.soort==='toren'?(e.sub==='koning'?'kogel':'pijl'):({boog:'pijl',onderzoeker:'fles',ptero:'spuug',kanon:'parabool',tesla:'bliksem'})[e.kaart];
  if(kind==='bliksem'){clBliksem(e,o);clSchade(o,e.dmg,e);clFx('bliksem');return;}
  if(!kind){const zwaar=e.kaart==='reus'||e.kaart==='ram';
    setTimeout(()=>{if(!CL.on||!clLevend(o))return;clSchade(o,e.dmg,e);clFx(zwaar?'dreun':'zwaard');
      const hx=(e.x+o.x)/2+(o.x-e.x)*.25,hz=(e.z+o.z)/2+(o.z-e.z)*.25,hy=o.lucht?2.4:1;
      clKlap(hx,hy,hz,zwaar?'#FFC800':'#FFFFFF',zwaar?1.3:.9);clVonk(o.x,hy,o.z,zwaar?'#FFC800':'#FFFFFF',zwaar?7:5);
      if(zwaar){clSchud(.16);clStof(o.x,o.z,.9);if(e.kaart==='reus')clDecal(e.x+(o.x-e.x)*.5,e.z+(o.z-e.z)*.5,.9,'barst');}},zwaar?220:110);return;}
  const hoog=e.soort==='toren'?(e.sub==='koning'?1.35:2.15):e.lucht?2.5:1.3;
  const x0=e.soort==='toren'&&e.sub==='koning'?e.x+.9:e.x;
  const vuur=()=>{if(!CL.on||e.dood&&e.soort!=='toren')return;clFx(kind==='pijl'?'pijl':kind==='kogel'||kind==='parabool'?'kanon':'worp');clProjectiel({kind,team:e.team,x:x0,y:hoog,z:e.z,tgt:o,dmg:e.dmg,splash:e.splash,bron:e});};
  if(e.soort==='toren'||e.kaart==='boog'||e.kaart==='onderzoeker'||e.kaart==='kanon')setTimeout(vuur,160);else if(e.kaart==='ptero')setTimeout(vuur,90);else vuur();
}
function clProjectiel(p){
  p.t=0;p.x0=p.x;p.y0=p.y;p.z0=p.z;p.tx=p.tgt.x;p.tz=p.tgt.z;p.ty=p.tgt.lucht?2.4:(p.tgt.soort==='toren'?2.6:.8);
  const d=Math.hypot(p.tgt.x-p.x,p.tgt.z-p.z);p.dur=Math.max(.18,d/(p.kind==='parabool'?7:p.kind==='kogel'?10:13));
  p.boog=p.kind==='parabool'?Math.max(1.6,d*.4):p.kind==='fles'?d*.18:p.kind==='pijl'?d*.08:d*.05;
  if(p.kind==='parabool')clParaboolSpoor(p);
  p.wx=p.x;p.wy=p.y;p.wz=p.z;p.vx=0;p.vy=0;p.vz=0;p.rot=0;
  CL.proj.push(p);
}
function clProjStap(dt){
  for(const p of CL.proj.slice()){
    p.t+=dt*CL.tempo;const k=Math.min(1,p.t/p.dur);
    if(clLevend(p.tgt)){p.tx=p.tgt.x;p.tz=p.tgt.z;p.ty=p.tgt.lucht?2.4:(p.tgt.soort==='toren'?2.6:.8);}
    const x=p.x0+(p.tx-p.x0)*k,z=p.z0+(p.tz-p.z0)*k,y=p.y0+(p.ty-p.y0)*k+Math.sin(k*Math.PI)*p.boog;
    if(dt>0){p.vx=x-p.wx;p.vy=y-p.wy;p.vz=z-p.wz;}p.wx=x;p.wy=y;p.wz=z;p.rot+=dt*9;
    (p.spoor=p.spoor||[]).push([x,y,z]);if(p.spoor.length>6)p.spoor.shift();
    if((p.kind==='kogel'||p.kind==='parabool'||p.kind==='spuug'||p.kind==='thermiet')&&!CL.lite&&Math.random()<.5)clPoef(x,z,y-.3,1,p.kind==='spuug'||p.kind==='thermiet'?0xFFB066:0xEFEBE4,p.kind==='thermiet'?.8:.35);
    if(k>=1){CL.proj=CL.proj.filter(q=>q!==p);clInslag(p);}
  }
}
// Projectiel tekenen: richting volgt de vlucht op het scherm.
function clTekenProj(p){
  const [sx,sy]=clProj(p.wx,p.wy,p.wz),[gx,gy]=clProj(p.wx,0,p.wz),k=CL.S/CL_U;
  const a0=G.globalAlpha;G.globalAlpha=a0*.16;cE(gx,gy,(p.kind==='thermiet'?12:4)*k,(p.kind==='thermiet'?4.5:1.6)*k,'#000000');G.globalAlpha=a0;
  const hoek=Math.atan2(-p.vz*CL.S*CL_SY-p.vy*CL.S,p.vx*CL.S||1e-6);
  // Spoor: een vervagende streep achter pijlen en ballen.
  if(p.spoor&&p.spoor.length>2&&!CL.lite){const P=p.spoor.map(q=>clProj(q[0],q[1],q[2]));const kl=p.kind==='spuug'||p.kind==='thermiet'?'#FFC800':'#FFFFFF';
    G.save();G.lineCap='round';for(let i=1;i<P.length;i++){G.globalAlpha=a0*.45*i/P.length;G.strokeStyle=kl;G.lineWidth=Math.max(1,CL.S*(p.kind==='thermiet'?.5:p.kind==='pijl'||p.kind==='spreukpijl'?.09:.2)*i/P.length);G.beginPath();G.moveTo(P[i-1][0],P[i-1][1]);G.lineTo(P[i][0],P[i][1]);G.stroke();}G.restore();}
  G.save();G.translate(sx,sy);G.scale(k,k);
  if(p.kind==='pijl'||p.kind==='spreukpijl'){G.rotate(hoek);cL([[-11,0],[7,0]],'#B07A45',1.8);cP([[7,-2.6],[12,0],[7,2.6]],'#DDE3EA');cP([[-11,0],[-14,-3],[-8,0]],CL_TEAM[p.team].c);cP([[-11,0],[-14,3],[-8,0]],CL_TEAM[p.team].c);}
  else if(p.kind==='kogel'){cV(()=>G.arc(0,0,5.2,0,7),'#5B5F6B','#3C3C3C',1.5);cGl(0,0,3.4,3.5,4.5,1.3);}
  else if(p.kind==='parabool'){G.rotate(p.rot);cV(()=>cPoly([[-6,-3],[-2,-6.5],[5,-5],[6.5,1],[2,6],[-5,4.5]]),'#CFCAC2','#ABA59C',1);cGl(0,0,3.5,3.5,4.5,1.3);}
  else if(p.kind==='fles'){G.rotate(p.rot);cR(-1.3,-8,2.6,4,1,'#DDF4FF');cC(0,0,4.4,'#E8F7FF');G.save();G.beginPath();G.arc(0,0,4.4,0,7);G.clip();cR(-6,0,12,6,0,'#58CC02');G.restore();cR(-1.6,-9.2,3.2,2,1,'#C98E46');cGl(0,0,3,3.6,4.6,1.1);}
  else if(p.kind==='spuug'){const f=1+Math.sin(CL.t*40)*.12;cC(0,0,6.4*f,'#FF9600');cC(-.6,-.6,4*f,'#FFC800');cC(-1.4,-1.4,1.8,'#FFFFFF');}
  else if(p.kind==='thermiet'){const f=1+Math.sin(CL.t*30)*.08;const a=G.globalAlpha;G.globalAlpha=a*.3;cC(0,0,20*f,'#FF9600');G.globalAlpha=a;cC(0,0,13*f,'#FF4B4B');cC(-1,-1,9.5*f,'#FF9600');cC(-2,-2,5.6*f,'#FFC800');cC(-3.2,-3.2,2.2,'#FFFFFF');}
  G.restore();
}
function clInslag(p){
  if(p.spreuk){p.klaar(p);return;}
  if(p.splash){for(const o of CL.ents.slice())if(o.team!==p.team&&!o.dood&&Math.hypot(o.x-p.tx,o.z-p.tz)<=p.splash+(o.r||.4)*.5)clSchade(o,p.dmg,p.bron);clPoef(p.tx,p.tz,p.ty,3,0xFFB066);clRing(p.tx,p.tz,p.splash||1,'#FF9600');}
  else if(clLevend(p.tgt))clSchade(p.tgt,p.dmg,p.bron);
  if(p.kind==='fles'){clVonk(p.tx,p.ty,p.tz,'#58CC02',8);clPoef(p.tx,p.tz,p.ty,2,0xB8F28A,.6);}
  else if(p.kind==='kogel'||p.kind==='parabool'){clPoef(p.tx,p.tz,p.ty,2);clVonk(p.tx,p.ty,p.tz,'#FFC800',5);clKlap(p.tx,p.ty,p.tz,'#FFC800',1);if(p.kind==='parabool')clDecal(p.tx,p.tz,.5,'schroei');}
  else if(p.kind==='spuug'){clKlap(p.tx,p.ty,p.tz,'#FF9600',1);clVonk(p.tx,p.ty,p.tz,'#FFC800',5);}
  else{clKlap(p.tx,p.ty,p.tz,'#FFFFFF',.6);clVonk(p.tx,p.ty,p.tz,'#FFFFFF',3);}
}
// Spreuken: vanaf de eigen koningstoren in een boog naar het doel.
function clSpreuk(id,team,x,z,f){
  const d=CL_KAARTEN[id];const k=CL.ents.find(o=>o.team===team&&o.sub==='koning')||{x:9,z:team?29:3};
  const raak=(px,pz,dmg)=>{for(const o of CL.ents.slice()){if(o.team===team||o.dood)continue;const a=Math.hypot(o.x-px,o.z-pz);if(a<=d.straal+(o.r||.4)*.5){
      clSchade(o,dmg*(o.soort==='toren'?d.toren:1),null);
      if(!o.dood&&o.soort==='unit'&&o.max<=400&&a>.01){o.x+=(o.x-px)/a*.8;o.z+=(o.z-pz)/a*.8;}}}};
  // Doelcirkel op de grond, zodat je ziet waar hij valt.
  const doel=(dur)=>clFx2(dur,p=>{const [sx,sy]=clProj(x,0,z);const r=d.straal*CL.S;G.save();G.globalAlpha=.18+.12*Math.sin(p*20);cE(sx,sy,r,r*CL_SY,CL_TEAM[team].c);G.globalAlpha=.85;G.strokeStyle=CL_TEAM[team].c;G.lineWidth=2.5;G.setLineDash([8,6]);G.lineDashOffset=-p*40;G.beginPath();G.ellipse(sx,sy,r,r*CL_SY,0,0,7);G.stroke();G.restore();},'grond');
  if(id==='thermiet'){
    const p={kind:'thermiet',team,x:k.x,y:6,z:k.z,tgt:{x,z,dood:true},tx:x,tz:z,ty:0,dmg:0,spreuk:true};
    p.t=0;p.x0=k.x;p.y0=6;p.z0=k.z;p.dur=Math.max(.7,Math.hypot(x-k.x,z-k.z)/14);p.boog=5;p.wx=p.x0;p.wy=p.y0;p.wz=p.z0;p.vx=p.vy=p.vz=0;p.rot=0;
    p.klaar=()=>{raak(x,z,d.dmg*f);clOntploffing(x,z,d.straal);};CL.proj.push(p);doel(p.dur);
    return;}
  // Pijlenregen: drie salvo's, elk een derde van de schade.
  doel(1.4);
  for(let s=0;s<3;s++)setTimeout(()=>{if(!CL.on)return;
    for(let i=0;i<9;i++){const px=x+(Math.random()-.5)*d.straal*1.4,pz=z+(Math.random()-.5)*d.straal*1.4;
      const p={kind:'spreukpijl',team,x:k.x+(Math.random()-.5),y:5,z:k.z,tgt:{x:px,z:pz,dood:true},tx:px,tz:pz,ty:0,spreuk:true};
      p.t=0;p.x0=p.x;p.y0=5;p.z0=p.z;p.dur=.75+Math.random()*.15;p.boog=4.5;p.wx=p.x0;p.wy=p.y0;p.wz=p.z0;p.vx=p.vy=p.vz=0;p.rot=0;
      p.klaar=i===0?()=>{raak(x,z,d.dmg*f/3);clPoef(x,z,0,4,0xE8D5AE);clRing(x,z,d.straal*.8,'#FFFFFF');arcSnd('tick');}:()=>{clVonk(px,.1,pz,'#E8D5AE',1);clPin(px,pz,team);};CL.proj.push(p);}
  },s*260);
}
// Pijl die even in de grond blijft steken.
function clPin(x,z,team){clFx2(.9,p=>{const [sx,sy]=clProj(x,0,z),k=CL.S/CL_U;G.save();G.globalAlpha=p>.6?(1-p)/.4:1;G.translate(sx,sy);G.scale(k,k);G.rotate(-.35);cL([[0,0],[0,-9]],'#B07A45',1.6);cP([[0,-9],[-2.6,-12],[0,-10.5],[2.6,-12]],CL_TEAM[team].c);G.restore();},'grond');}

// ── Effecten ────────────────────────────────────────────────────────────
// Elk effect is een kort leven (dur) met een tekenfunctie; de laag bepaalt of
// het op de grond ligt (onder figuren) of erboven zweeft.
function clFx2(dur,teken,laag,upd){const f={t:0,p:0,dur,teken,laag:laag||'top',upd};CL.fx.push(f);return f;}
function clPoef(x,z,y,n,kleur,maat){
  if(CL.lite)n=Math.ceil(n/2);const kl=clCss(kleur||0xF2EEE6);
  for(let i=0;i<n;i++){const a=Math.random()*6.28,r=Math.random()*.5,vx=Math.cos(a)*.9,vz=Math.sin(a)*.7,vy=1+Math.random(),m=(maat||1)*(.9+Math.random()*.9),x0=x+Math.cos(a)*r,z0=z+Math.sin(a)*r,y0=(y||0)+.3;
    clFx2(.7+Math.random()*.4,p=>{const e=1-Math.pow(1-p,2.2);const [sx,sy]=clProj(x0+vx*e*.9,y0+vy*e*.9,z0+vz*e*.9);const rr=CL.S*.26*m*(.6+e*1.5);const a0=G.globalAlpha;
      G.globalAlpha=a0*(1-p)*.95;cC(sx,sy,rr,kl);G.globalAlpha=a0*(1-p)*.55;cC(sx-rr*.32,sy-rr*.32,rr*.42,'#FFFFFF');G.globalAlpha=a0;});}
}
function clVonk(x,y,z,kleur,n){
  const kl=clCss(kleur);
  for(let i=0;i<(CL.lite?2:n);i++){const vx=(Math.random()-.5)*4,vy=1.5+Math.random()*3,vz=(Math.random()-.5)*3,r0=Math.random()*3;
    clFx2(.35+Math.random()*.25,p=>{const [sx,sy]=clProj(x+vx*p*.45,y+vy*p*.45-p*p*1.2,z+vz*p*.45);const s=CL.S*.2*(1-p)+.8;
      G.save();G.translate(sx,sy);G.rotate(r0+p*5);cP([[0,-s],[s*.28,-s*.28],[s,0],[s*.28,s*.28],[0,s],[-s*.28,s*.28],[-s,0],[-s*.28,-s*.28]],kl);G.restore();});}
}
function clRing(x,z,r,kleur){clFx2(.45,p=>{const [sx,sy]=clProj(x,0,z);const rr=CL.S*r*(.4+p*.9);G.save();G.globalAlpha=(1-p)*.85;G.strokeStyle=kleur;G.lineWidth=Math.max(1,4*(1-p));G.beginPath();G.ellipse(sx,sy,rr,rr*CL_SY,0,0,7);G.stroke();G.restore();},'grond');}
function clStof(x,z,r){clRing(x,z,r*1.3,'#FFFFFF');clPoef(x,z,0,4,0xEDE3CC,.7);}
function clOntploffing(x,z,r){
  arcFx('boom');arcHap([20,20,50]);clSchud(.4);
  clFx2(.55,p=>{const [sx,sy]=clProj(x,.4,z);const e=1-Math.pow(1-p,3),R=CL.S*r*(.35+e*.85);const a0=G.globalAlpha;
    G.globalAlpha=a0*(1-p)*(1-p);cE(sx,sy,R,R*.82,'#FF4B4B');cE(sx-R*.08,sy-R*.08,R*.78,R*.64,'#FF9600');cE(sx-R*.14,sy-R*.14,R*.5,R*.42,'#FFC800');
    if(p<.25){G.globalAlpha=a0*(1-p/.25);cC(sx-R*.18,sy-R*.18,R*.28,'#FFFFFF');}G.globalAlpha=a0;});
  clRing(x,z,r*1.25,'#FFC800');clRing(x,z,r*.9,'#FFFFFF');
  clFx2(2.2,p=>{const [sx,sy]=clProj(x,0,z);const R=CL.S*r*.55;G.save();G.globalAlpha=.28*(1-p);cE(sx,sy,R,R*CL_SY,'#4B4B4B');G.restore();},'grond');
  clDecal(x,z,r*.7,'schroei');clPoef(x,z,.2,10,0x8C7B6A,1.4);clVonk(x,.6,z,'#FFC800',12);clBrokken(x,z,.4,CL.lite?3:7,['#B07A45','#8E5E32']);
}
function clBliksem(a,b){
  const ay=a.soort==='bouw'?3.4:1.6,by=b.lucht?2.4:.9,ax=a.x,az=a.z;const pts=[];const n=8;
  for(let i=0;i<=n;i++){const k=i/n,j=i&&i<n?.42:0;pts.push([ax+(b.x-ax)*k+(Math.random()-.5)*j,ay+(by-ay)*k+(Math.random()-.5)*j,az+(b.z-az)*k+(Math.random()-.5)*j]);}
  const kl=CL_TEAM[a.team].l;
  clFx2(.2,p=>{const P=pts.map(q=>clProj(q[0],q[1],q[2]));G.save();G.globalAlpha=1-p;G.lineJoin='round';G.lineCap='round';
    G.strokeStyle=kl;G.lineWidth=CL.S*.32;G.beginPath();P.forEach((q,i)=>i?G.lineTo(q[0],q[1]):G.moveTo(q[0],q[1]));G.stroke();
    G.strokeStyle='#FFFFFF';G.lineWidth=CL.S*.11;G.stroke();G.restore();});
  clVonk(b.x,by,b.z,kl,4);
}
// Het paraboolkanon laat zijn baan even zien: een stippellijn in de lucht.
function clParaboolSpoor(p){
  const pts=[];for(let i=1;i<=22;i++){const k=i/23;pts.push([p.x0+(p.tgt.x-p.x0)*k,p.y0+(.8-p.y0)*k+Math.sin(k*Math.PI)*p.boog,p.z0+(p.tgt.z-p.z0)*k]);}
  clFx2(.9,q=>{G.save();G.globalAlpha=.85*(1-q);for(const [i,v] of pts.entries()){if(i/pts.length>q*2.2)break;const [sx,sy]=clProj(v[0],v[1],v[2]);cC(sx,sy,Math.max(1.2,CL.S*.08),'#FFFFFF');}G.restore();});
}
// Bij inzetten: een korte lichtzuil in de teamkleur.
function clLichtzuil(x,z,team){
  const kl=CL_TEAM[team].l;
  clFx2(.55,p=>{const [sx,sy]=clProj(x,0,z);const w=CL.S*1.5*(1-p*.6),h=CL.S*6;G.save();G.globalAlpha=.42*(1-p);cR(sx-w/2,sy-h,w,h,w/2,kl);G.globalAlpha=.6*(1-p);cR(sx-w*.18,sy-h,w*.36,h,w*.18,'#FFFFFF');G.restore();});
  for(let i=0;i<6;i++){const a=i/6*6.28;clFx2(.6,p=>{const [sx,sy]=clProj(x+Math.cos(a)*(.5+p*.9),.4+p*1.6,z+Math.sin(a)*(.5+p*.9));const s=CL.S*.16*(1-p);G.save();G.translate(sx,sy);G.rotate(p*4);cP([[0,-s],[s*.3,0],[0,s],[-s*.3,0]],kl);cP([[-s,0],[0,s*.3],[s,0],[0,-s*.3]],kl);G.restore();});}
}
// Klap: een platte ster die even openploft waar de klap landt.
function clKlap(x,y,z,kleur,s){
  const r0=Math.random()*6;
  clFx2(.18,p=>{const [sx,sy]=clProj(x,y,z),R=CL.S*.55*(s||1)*(.35+clEo(p)*.75);G.save();G.translate(sx,sy);G.rotate(r0);G.globalAlpha*=1-p*p;
    const P=[];for(let i=0;i<16;i++){const a=i/16*Math.PI*2,r=i%2?R*.42:R;P.push([Math.cos(a)*r,Math.sin(a)*r]);}cP(P,kleur);if(p<.5)cC(0,0,R*.32,'#FFFFFF');G.restore();});
}
// Mondvuur van de koningskanon.
function clMond(x,y,z,hoek){
  clFx2(.14,p=>{const [sx,sy]=clProj(x,y,z),R=CL.S*.5*(.6+p*.6);G.save();G.translate(sx,sy);G.rotate(hoek);G.globalAlpha*=1-p;
    cP([[0,-R*.55],[R*1.6,0],[0,R*.55],[R*.25,0]],'#FF9600');cP([[0,-R*.32],[R*1.05,0],[0,R*.32]],'#FFC800');cC(0,0,R*.3,'#FFFFFF');G.restore();});
}
// Sporen op de grond: schroeiplek of barst, die langzaam vervagen.
function clDecal(x,z,r,soort){
  const R=clRnd((x*97+z*13)|0),vlek=[];for(let i=0;i<7;i++)vlek.push([(R()-.5)*1.3,(R()-.5)*1.3,.35+R()*.45]);
  const lijnen=[];for(let i=0;i<5;i++){const a=i/5*6.28+R()*.6,l=.6+R()*.5;lijnen.push([[0,0],[Math.cos(a)*l*.5,Math.sin(a)*l*.5+(R()-.5)*.2],[Math.cos(a)*l,Math.sin(a)*l]]);}
  clFx2(3.2,p=>{const [sx,sy]=clProj(x,0,z),S=CL.S*r;G.save();G.globalAlpha*=.3*(1-p*p);
    if(soort==='schroei'){for(const [dx,dz,rr] of vlek)cE(sx+dx*S,sy+dz*S*CL_SY,rr*S,rr*S*CL_SY,'#3C3C3C');}
    else for(const L of lijnen){G.globalAlpha=.4*(1-p*p);cL(L.map(([a,b])=>[sx+a*S,sy+b*S*CL_SY]),'#5B4A35',Math.max(1.2,CL.S*.08));}
    G.restore();},'grond');
}
function clSchud(s){CL.schud=Math.max(CL.schud||0,CL.lite?s*.4:s);}
function clPop(pt,tekst,cls){if(!CL.pops)return;const e=document.createElement('div');e.className='cl-pop '+(cls||'');e.textContent=tekst;e.style.left=pt[0]+'px';e.style.top=pt[1]+'px';CL.pops.appendChild(e);setTimeout(()=>e.remove(),1300);}

// ── Simulatie ───────────────────────────────────────────────────────────
function clEntStap(e,dt){
  if(e.drop>0){e.drop-=dt;if(e.drop<=0)clLand(e);return;}
  if(e.inzet>0){e.inzet-=dt;return;}
  e.hitT=Math.max(0,e.hitT-dt);e.swing+=dt;e.loopt=false;
  if(e.soort==='bouw'){e.hp-=e.max/e.leeft*dt;if(e.hp<=0){clDood(e);return;}}
  if(e.soort==='toren'&&(!e.actief||e.dood))return;
  e.herzie-=dt;
  if(!clLevend(e.tgt)||(e.herzie<=0&&!e.aanval)){e.tgt=clZoekDoel(e);e.herzie=.3;}
  const o=e.tgt;if(!o){e.aanval=false;return;}
  if(clInBereik(e,o)){
    if(!e.aanval){e.aanval=true;e.cd=Math.max(e.cd,e.hit*.35);}
    e.kijk=Math.atan2(o.x-e.x,-(o.z-e.z));e.cd-=dt*CL.tempo;
    if(e.cd<=0){clAanval(e,o);e.cd=e.hit;}
  }else{
    e.aanval=false;e.cd=Math.max(e.cd-dt,e.hit*.35);
    if(e.soort==='unit')clBeweeg(e,o.x,o.z,dt);else e.tgt=null;
  }
}
// Elkaar opzij duwen, niet door torens heen, niet door de rivier.
function clScheid(){
  const L=CL.ents.filter(e=>!e.dood||e.soort==='toren');
  for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++){
    const a=L[i],b=L[j];if(a.lucht!==b.lucht)continue;const vastA=a.soort!=='unit',vastB=b.soort!=='unit';if(vastA&&vastB)continue;
    if((a.drop>0)||(b.drop>0))continue;
    const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz),min=(vastA?a.r*.95:a.r)+(vastB?b.r*.95:b.r);
    if(d>=min||d<1e-4)continue;const over=(min-d),nx=dx/d,nz=dz/d;
    const ma=vastA?1e9:a.r*a.r,mb=vastB?1e9:b.r*b.r,sa=mb/(ma+mb),sb=ma/(ma+mb);
    if(!vastA){a.x-=nx*over*sa*.5;a.z-=nz*over*sa*.5;}if(!vastB){b.x+=nx*over*sb*.5;b.z+=nz*over*sb*.5;}
  }
  for(const e of L){if(e.soort!=='unit')continue;e.x=Math.max(.4,Math.min(17.6,e.x));e.z=Math.max(.4,Math.min(31.6,e.z));
    if(!e.lucht&&e.z>CL_RIV0-.1&&e.z<CL_RIV1+.1){const opBrug=CL_BRUG.some(b=>Math.abs(e.x-b)<1.3);
      if(!opBrug)e.z=e.z<16?CL_RIV0-.1:CL_RIV1+.1;else{const b=CL_BRUG.find(b=>Math.abs(e.x-b)<1.3);e.x=Math.max(b-1.2,Math.min(b+1.2,e.x));}}}
}
function clHoekNaar(a,b,k){let d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return a+d*k;}
// Animatietoestand: kijkrichting (links/rechts, voor/rug), looppas, wielen.
function clAnim(dt){
  const sdt=CL.klaar?dt*.25:dt,veer=Math.min(sdt,.033);
  for(const e of CL.ents){const m=e.m;
    if(e.soort==='unit'){
      if(e.kijk!=null)e.hoek=clHoekNaar(e.hoek,e.kijk,Math.min(1,dt*10));
      const s=Math.sin(e.hoek);if(Math.abs(s)>.22)m.dir=s>0?1:-1;
      e.rug=Math.cos(e.hoek)<-.25;
      if(e.loopt){const oud=e.f;e.f+=sdt*(e.v||1)*9*CL.tempo;if(e.kaart==='ram')m.wiel=(m.wiel||0)+sdt*(e.v||1)*4*m.dir;
        // Zware voeten: stofwolkje bij elke stap.
        if((e.kaart==='reus'||e.kaart==='robot')&&Math.floor(oud/Math.PI)!==Math.floor(e.f/Math.PI)){e.sqv=(e.sqv||0)-(e.kaart==='reus'?2.4:1.2);if(!CL.lite)clPoef(e.x+(Math.random()-.5)*.5,e.z,0,1,0xEDE3CC,e.kaart==='reus'?.7:.45);}}
    }else if(e.aanval&&clLevend(e.tgt)){const dx=e.tgt.x-e.x,dz=e.tgt.z-e.z;if(Math.abs(dx)>.3)m.dir=dx>0?1:-1;
      if(e.sub==='koning')m.mik=clHoekNaar(m.mik!=null?m.mik:-.35,Math.atan2(-dz*CL_SY,dx-.8),Math.min(1,dt*10));}
    // Helling: voorover bij lopen, naar achter in de aanloop, voorover in de klap.
    if(e.soort==='unit'){const S=CL_SLAG[e.kaart],sw=e.swing==null?9:e.swing;let doel=e.loopt?(e.max>=1300?.04:.07):0;
      if(S&&sw<S[2]&&e.kaart!=='boog'&&e.kaart!=='elektron')doel=sw<S[0]?-.1*clEo(sw/S[0]):sw<S[1]?clLerp(-.1,.15,clSeg(sw,S[0],S[1])):clLerp(.15,0,clEo(clSeg(sw,S[1],S[2])));
      e.leun=clLerp(e.leun||0,doel,Math.min(1,dt*18));
      // Moment van de klap: even uitrekken.
      if(S&&e._sw!=null&&e._sw<S[0]&&sw>=S[0])e.sqv=(e.sqv||0)+(e.kaart==='reus'?-5:3);e._sw=sw;}
    // Veer (squash en stretch) en terugdeinzen uitdempen.
    if(e.sq||e.sqv){const a=-320*(e.sq||0)-15*(e.sqv||0);e.sqv=(e.sqv||0)+a*veer;e.sq=Math.max(-.45,Math.min(.45,(e.sq||0)+e.sqv*veer));if(Math.abs(e.sq)<.001&&Math.abs(e.sqv)<.01){e.sq=0;e.sqv=0;}}
    if(e.kbx||e.kbz){const d=Math.exp(-11*sdt);e.kbx*=d;e.kbz*=d;if(Math.abs(e.kbx)+Math.abs(e.kbz)<.002)e.kbx=e.kbz=0;}
    if(e.flits!=null){e.flits-=dt;if(e.flits<=0)e.flits=null;}
    // Toren doorzichtig als er iets achter staat.
    if(e.soort==='toren'&&!e.dood){const H=(e.sub==='koning'?3.4:3)/CL_SY;let achter=e.team===0&&CL.mode==='strijd'&&(CL.gekozen>=0||!!CL.ghost);
      const chk=(x,z)=>z>e.z-.2&&z<e.z+H&&Math.abs(x-e.x)<e.r+1;
      for(const u of CL.ents)if(u.soort!=='toren'&&chk(u.x,u.z)){achter=true;break;}
      if(!achter&&CL.ghost&&chk(CL.ghost.x,CL.ghost.z))achter=true;
      if(!achter)for(const l of CL.lijken)if(chk(l.e.x,l.e.z)){achter=true;break;}
      m.fade=clLerp(m.fade==null?1:m.fade,achter?.32:1,Math.min(1,dt*9));}
    if(m.val&&m.val.t<1.2){m.val.t+=sdt;if(m.val.t>=1.1&&!m.val.klaar){m.val.klaar=true;m.ruine=true;clPoef(e.x,e.z,.5,6,0xEDE5D7,1.4);}}
    if(m.ruine&&!CL.lite&&Math.random()<dt*.5)clPoef(e.x+(Math.random()-.5)*1.4,e.z,1.2,1,0xD9D2C5,.8);
  }
  for(const l of CL.lijken){const e=l.e;if(e.kbx||e.kbz){const d=Math.exp(-11*sdt);e.kbx*=d;e.kbz*=d;}}
  clLijkenStap(sdt);
}
function clFxStap(dt){for(const f of CL.fx.slice()){f.t+=dt;const p=Math.min(1,f.t/f.dur);f.p=p;if(f.upd)f.upd(p,dt);if(p>=1)CL.fx=CL.fx.filter(x=>x!==f);}}
function clLand(e){
  if(e.eerste)clFx('inzet');const zwaar=e.max>=1300||e.soort==='bouw';
  e.sqv=(e.sqv||0)-(zwaar?8:6.5);clRing(e.x,e.z,zwaar?1.4:.9,'#FFFFFF');
  if(e.eerste&&!CL.lite)clPoef(e.x,e.z,0,zwaar?5:3,0xEDE3CC,zwaar?.9:.6);
  if(zwaar&&e.eerste)clSchud(.12);
}
function clBalken(){
  for(const e of CL.ents){if(!e.bar)continue;
    const klok=e.inzet>0&&e.drop<=0;if(klok!==e._klok){e._klok=klok;e.bar.classList.toggle('klok',klok);}
    if(klok)e.bar.style.setProperty('--p',(1-e.inzet/.65).toFixed(2));
    const onder=e.soort==='toren'&&e.sub==='koning'&&e.team===1;// bovenrand zit onder de HUD: balk onder de toren
    const [x,y]=onder?clScherm(e.x,0,e.z-2.55):clScherm(e.x,(e.hoogte||2)+(e.lucht?.4:0),e.z);
    const toon=e.soort==='toren'||e.hp<e.max-.5||CL.t-e.born<1.4;
    e.bar.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;e.bar.classList.toggle('uit',!toon||e.drop>0||(e.soort==='toren'&&e.sub==='koning'&&!e.actief&&e.hp>=e.max));
    e.barI.style.width=Math.max(0,e.hp/e.max*100).toFixed(1)+'%';if(e.barB)e.barB.textContent=Math.ceil(e.hp);}
}

// ── Tekenen per beeld ───────────────────────────────────────────────────
function clTekenGrond(e){
  const [sx,sy]=clProj(e.x,0,e.z),k=CL.S/CL_U;
  if(e.soort==='toren')return;
  const r=Math.max(.42,(e.r||.4)*1.05)*CL.S*(e.soort==='bouw'?1.1:1.15)*CL_US/1.1,ry=r*CL_SY*.62;
  const a0=G.globalAlpha;
  G.globalAlpha=a0*(e.lucht?.12:.2);cE(sx,sy,r*(e.lucht?.8:1),ry*(e.lucht?.8:1),'#1E3A10');
  if(e.drop>0){G.globalAlpha=a0;return;}
  G.globalAlpha=a0*.9;G.strokeStyle=CL_TEAM[e.team].c;G.lineWidth=Math.max(1.6,k*2.2);G.beginPath();G.ellipse(sx,sy,r,ry,0,0,7);G.stroke();
  if(e.sterk){G.globalAlpha=a0*(.55+Math.sin(CL.t*6)*.3);G.strokeStyle='#FFC800';G.lineWidth=Math.max(2,k*3);G.beginPath();G.ellipse(sx,sy,r*1.22,ry*1.22,0,0,7);G.stroke();}
  G.globalAlpha=a0;
}
function clTekenEnt(e){
  const k=CL.S/CL_U;
  const [sx,sy]=clProj(e.x+(e.kbx||0),0,e.z+(e.kbz||0));
  if(e.soort==='toren'){G.save();G.translate(sx,sy);G.scale(k,k);_clF=e.flits>0&&!e.dood?.45:0;clToren(e);_clF=0;G.restore();return;}
  // Neerploffen: valt uit de lucht, uitgerekt, en veert bij de landing.
  let y=0,rx=1,ry=1;
  if(e.drop>0){const p=Math.min(1,1-e.drop/.45);y=(1-p)*(1-p)*80;rx=.8+p*.2;ry=1.28-p*.28;}
  const sq=e.sq||0;rx*=1-sq*.7;ry*=1+sq;
  if(!e.loopt&&e.drop<=0)ry*=1+Math.sin((CL.t||0)*2.4+(e.fase||0))*.012;
  const dir=e.m.dir||1,K=clKd(e.kaart),kader=dir>0?K:[-K[2],K[1],-K[0],K[3]];
  const gloed=e.kaart==='elektron'||e.kaart==='tesla';
  // Pose als losse afbeelding, 30 keer per seconde vernieuwd (zoals een spritesheet).
  // Plaats, helling, veer en val worden pas bij het neerzetten toegepast: die blijven vloeiend.
  const z=(CL.cam&&CL.cam.z)||1,dpr=CL.dpr||1,px=k*dpr*z,tq=Math.floor((CL.t||0)*30);
  const rand=!CL.lite&&!(CL.q&&CL.q.geenRand);
  const key=tq+'|'+dir+'|'+(e.flits>0?1:0)+'|'+px.toFixed(3)+'|'+rand+'|'+(CL.q&&CL.q.rand4?4:8);
  let st=e._st;if(!st){const c=document.createElement('canvas');st=e._st={c,g:c.getContext('2d')};}
  if(st.key!==key){const tOud=CL.t;CL.t=tq/30;CL_GL=gloed?1:0;
    const r=clSticker(kader,px,()=>{G.scale(dir*CL_US,CL_US);CL_TEKEN[e.kaart](e,e.team);},e.flits>0?.8:0,rand?Math.max(2,px*1.5):0);
    CL_GL=0;CL.t=tOud;
    if(st.c.width!==r.w||st.c.height!==r.h){st.c.width=r.w;st.c.height=r.h;}else st.g.clearRect(0,0,r.w,r.h);
    st.g.drawImage(r.c,0,0,r.w,r.h,0,0,r.w,r.h);st.key=key;st.w=r.w;st.h=r.h;}
  G.save();G.translate(sx,sy);G.scale(k,k);G.translate(0,-y);G.rotate(dir*(e.leun||0));G.scale(rx,ry);
  if(gloed){G.save();G.scale(dir*CL_US,CL_US);CL_GL=2;CL_TEKEN[e.kaart](e,e.team);CL_GL=0;G.restore();}
  G.drawImage(st.c,0,0,st.w,st.h,kader[0]-4/px,kader[1]-4/px,st.w/px,st.h/px);
  G.restore();
}
function clTekenLijk(l){
  const e=l.e,t=l.t,val=clEo(clSeg(t,.06,.34)),wip=Math.sin(clSeg(t,0,.34)*Math.PI)*7;
  const [sx,sy]=clProj(e.x+(e.kbx||0),0,e.z+(e.kbz||0)),k=CL.S/CL_U;const a0=G.globalAlpha;
  G.globalAlpha=a0*(t<.5?1:Math.max(0,1-(t-.5)/.28));
  const bots=t>.34?Math.sin(clSeg(t,.34,.5)*Math.PI)*.1:0,dir=e.m.dir||1;
  clPlak(clKd('lijk'),k,sx,sy,()=>{if(e.lucht)G.translate(0,val*46*CL_US);G.translate(0,-wip);G.rotate(dir*(val*1.5-bots));G.scale(dir*CL_US,CL_US*(1-bots*.6));
    e.swing=9;e.loopt=false;CL_TEKEN[e.kaart](e,e.team);},t<.08?.9:0,true);
  G.globalAlpha=a0;
}
function clTeken(){
  const g=CL.ctx;if(!g||!CL.S)return;G=g;const w=CL.vw,h=CL.vh,ar=CL_ARENAS[CL.arena||0];
  g.setTransform(CL.dpr,0,0,CL.dpr,0,0);g.globalAlpha=1;
  g.fillStyle=ar.buiten;g.fillRect(0,0,w,h);
  if(CL.bgNodig||!CL.bg)clBouwBg();
  const c=CL.cam||{z:1,y:0},s=CL.schud||0;
  g.translate(w/2,h/2);g.scale(c.z,c.z);g.translate(-w/2+(s?(Math.random()-.5)*s*CL.S*.6:0),-h/2+c.y+(s?(Math.random()-.5)*s*CL.S*.4:0));
  g.drawImage(CL.bg,CL.ox+CL.bgX0*CL.S,CL.oy+(CL_L-CL.bgZ1)*CL.S*CL_SY-CL.bgPT,CL.bgW,CL.bgH);
  clGolven();
  if(CL.zoneAan)clTekenZone();
  for(const f of CL.fx)if(f.laag==='grond')f.teken(f.p);
  for(const e of CL.ents)clTekenGrond(e);
  if(CL.route)clTekenRoute();
  if(CL.ghost)clTekenGhostGrond();
  const L=CL.ents.filter(e=>!e.lucht).concat(CL.lijken.filter(l=>!l.e.lucht).map(l=>({lijk:l,z:l.e.z}))).sort((a,b)=>b.z-a.z);
  for(const e of L)e.lijk?clTekenLijk(e.lijk):clTekenEnt(e);
  if(CL.ghost)clTekenGhost();
  for(const l of CL.lijken)if(l.e.lucht)clTekenLijk(l);
  for(const e of CL.ents.filter(e=>e.lucht).sort((a,b)=>b.z-a.z))clTekenEnt(e);
  clLeven();
  for(const p of CL.proj)clTekenProj(p);
  for(const f of CL.fx)if(f.laag!=='grond')f.teken(f.p);
}

// ── Tegenstander ────────────────────────────────────────────────────────
function clBot(dt){
  const b=CL.bot,ar=CL_ARENAS[CL.arena];
  b.antw-=dt;if(b.antw<=0){b.antw=(2.6+Math.random()*1.8)*ar.denk;if(Math.random()<ar.acc){CL.kennis[1]=Math.min(10,CL.kennis[1]+1);b.goed++;}b.vragen++;}
  b.denk-=dt;if(b.denk>0)return;b.denk=(.45+Math.random()*.5)*ar.denk;
  const kn=CL.kennis[1],hand=b.hand;
  const speel=(i,x,z)=>{const id=hand[i];const d=CL_KAARTEN[id];if(CL.kennis[1]<d.k)return false;
    if(d.t!=='spreuk'&&!clMagHier(id,1,x,z)){const alt=clVrijePlek(id,1,x,z);if(!alt)return false;x=alt[0];z=alt[1];}
    CL.kennis[1]-=d.k;clInzet(id,1,x,z,false);hand[i]=b.rij.shift();b.rij.push(id);b.denk+=.6*ar.denk;return true;};
  const dreig=CL.ents.filter(e=>e.team===0&&e.soort==='unit'&&!e.dood&&e.z>10.5);
  if(dreig.length){
    const mx=dreig.reduce((s,e)=>s+e.x,0)/dreig.length,mz=dreig.reduce((s,e)=>s+e.z,0)/dreig.length;
    const lucht=dreig.some(e=>e.lucht),grond=dreig.some(e=>!e.lucht),klein=dreig.filter(e=>e.max<=400).length,tank=dreig.some(e=>e.max>=1300);
    const waarde=dreig.reduce((s,e)=>s+(CL_KAARTEN[e.kaart]?CL_KAARTEN[e.kaart].k/(CL_KAARTEN[e.kaart].n||1):1),0);
    let best=-1,bs=0;
    hand.forEach((id,i)=>{const d=CL_KAARTEN[id];if(d.k>kn)return;let s=1;
      if(d.doel==='gebouw')s-=6;
      if(d.t==='spreuk'){const inR=dreig.filter(e=>Math.hypot(e.x-mx,e.z-mz)<d.straal).length;s+=inR>=3?4:inR>=2&&waarde>=4?2:-3;if(id==='thermiet'&&klein>=3)s-=1;}
      if(lucht&&!grond&&d.doel==='grond')s-=6;if(lucht&&(d.doel==='alles'||d.t==='spreuk'))s+=2;
      if(klein>=3&&(d.splash||id==='pijlen'||id==='tesla'))s+=3;
      if(tank&&(d.t==='bouw'||id==='robot'))s+=3;
      if(d.k>waarde+3)s-=1.5;
      if(s>bs){bs=s;best=i;}});
    if(best>=0&&bs>=1){const d=CL_KAARTEN[hand[best]];
      if(d.t==='spreuk')speel(best,mx,mz+(mz<16?0:.6));
      else if(d.t==='bouw')speel(best,mx<9?7:11,20.5);
      else speel(best,Math.max(1,Math.min(17,mx)),Math.max(17.8,Math.min(26,mz+2.5)));
      return;}
  }
  // Toren afmaken met een spreuk als dat kan.
  const zwak=CL.ents.find(e=>e.team===0&&e.soort==='toren'&&!e.dood&&e.hp<180);
  if(zwak){const i=hand.findIndex(id=>CL_KAARTEN[id].t==='spreuk'&&CL_KAARTEN[id].k<=kn&&CL_KAARTEN[id].dmg*CL_KAARTEN[id].toren>=zwak.hp);if(i>=0){speel(i,zwak.x,zwak.z);return;}}
  const mijnTank=CL.ents.find(e=>e.team===1&&e.soort==='unit'&&e.max>=1300&&e.z>12);
  if(mijnTank&&kn>=4){const i=hand.findIndex(id=>{const d=CL_KAARTEN[id];return d.t==='unit'&&d.k<=kn&&d.bereik>2;});
    if(i>=0){speel(i,mijnTank.x,Math.min(30,mijnTank.z+2));return;}}
  if(kn>=9.3||(kn>=7&&Math.random()<.2)){
    const pr=CL.ents.filter(e=>e.team===0&&e.sub==='prinses');const l=pr.find(e=>e.dood)||pr.sort((a,b)=>a.hp-b.hp)[0];const lx=l?l.x:(Math.random()<.5?3.5:14.5);
    const tanks=['reus','ram','ridder'];let i=hand.findIndex(id=>tanks.includes(id)&&CL_KAARTEN[id].k<=kn);
    if(i>=0){const id=hand[i];speel(i,lx,id==='reus'?29.5:18.4);return;}
    i=hand.findIndex(id=>CL_KAARTEN[id].t==='unit'&&CL_KAARTEN[id].k<=kn);if(i>=0)speel(i,lx,19);
  }
}
function clVrijePlek(id,team,x,z){for(let r=.5;r<4;r+=.5)for(let a=0;a<8;a++){const px=x+Math.cos(a/8*6.28)*r,pz=z+Math.sin(a/8*6.28)*r;if(clMagHier(id,team,px,pz))return [px,pz];}return null;}
function clMagHier(id,team,x,z){
  const d=CL_KAARTEN[id];if(d.t==='spreuk')return x>=0&&x<=CL_W&&z>=0&&z<=CL_L;
  if(x<.5||x>17.5)return false;
  const vijPr=CL.ents.filter(o=>o.team!==team&&o.sub==='prinses');const open=l=>vijPr.some(o=>o.dood&&(o.x<9)===l);
  if(team===0){const max=open(x<9)?21.5:CL_RIV0-.5;if(z<.5||z>max)return false;}
  else{const min=open(x<9)?10.5:CL_RIV1+.5;if(z>31.5||z<min)return false;}
  if(z>CL_RIV0-.3&&z<CL_RIV1+.3)return false;
  for(const o of CL.ents){if(o.soort==='unit'||(o.dood&&o.soort!=='toren'))continue;if(Math.hypot(o.x-x,o.z-z)<o.r+(d.t==='bouw'?d.r:.25))return false;}
  return true;
}

// ── Kaartportretten: getekend met dezelfde figuren als in de arena ──────
const CL_PORTRET={};
function clPortretten(){
  if(Object.keys(CL_PORTRET).length)return;
  const c=document.createElement('canvas');c.width=200;c.height=240;const g=c.getContext('2d');if(!g)return;
  const oud=G,tOud=CL.t;G=g;CL.t=.8;
  const fig=(id,x,y,s,extra)=>{const K=CL_KADER[id];CL_GL=1;
    const r=clSticker(K,s,()=>CL_TEKEN[id](Object.assign({team:0,kaart:id,fase:1.2,f:0,loopt:false,swing:9,rug:false,m:{dir:1,wiel:.3},actief:true},extra||{}),0),0,Math.max(3,s*1.5));
    g.save();g.globalAlpha=.2;g.fillStyle='#1E3A10';g.beginPath();g.ellipse(x+4,y,15*s,4.4*s,0,0,7);g.fill();g.restore();
    CL_GL=0;g.drawImage(r.c,0,0,r.w,r.h,x+K[0]*s-4,y+K[1]*s-4,r.w,r.h);};
  const los=(teken,s)=>{const K=[-30,-30,30,30];const r=clSticker(K,s,teken,0,Math.max(3,s*1.5));g.drawImage(r.c,0,0,r.w,r.h,100+K[0]*s-4,112+K[1]*s-4,r.w,r.h);};
  for(const id of Object.keys(CL_KAARTEN)){
    const d=CL_KAARTEN[id],zc=CL_ZELD[d.zeld].c;
    g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,200,240);
    // Achtergrond: lucht in de kleur van de zeldzaamheid, zonnestralen en een grasheuvel.
    g.fillStyle=clMeng(zc,'#FFFFFF',.5);g.fillRect(0,0,200,240);
    g.save();g.translate(100,170);g.fillStyle='rgba(255,255,255,.2)';for(let i=0;i<16;i++){g.rotate(Math.PI/8);if(i%2){g.beginPath();g.moveTo(0,0);g.lineTo(-34,-300);g.lineTo(34,-300);g.closePath();g.fill();}}g.restore();
    g.fillStyle='rgba(255,255,255,.75)';for(const [x,y,r] of [[32,40,14],[48,36,18],[64,42,12],[150,56,12],[164,50,16],[178,58,11]]){g.beginPath();g.arc(x,y,r,0,7);g.fill();}
    if(d.t!=='spreuk'){g.fillStyle='#7BC043';g.beginPath();g.ellipse(100,262,170,74,0,0,7);g.fill();g.fillStyle='#9AD65A';g.beginPath();g.ellipse(100,252,160,66,0,0,7);g.fill();
      g.fillStyle='#B4E27A';for(const [x,y] of [[40,214],[150,206],[118,226],[70,230]]){g.beginPath();g.ellipse(x,y,7,2.4,0,0,7);g.fill();}}
    if(id==='thermiet'){g.save();g.globalAlpha=.35;g.fillStyle='#FF9600';g.beginPath();g.arc(100,112,22*4.3,0,7);g.fill();g.restore();}
    if(id==='thermiet')los(()=>{cC(0,0,14,'#FF4B4B');cC(-1,-1,10.5,'#FF9600');cC(-2.4,-2.4,6.2,'#FFC800');cC(-4,-4,2.4,'#FFFFFF');
      for(let i=0;i<6;i++){const h=i/6*6.28+.4,x=Math.cos(h)*19,y=Math.sin(h)*15;cV(()=>cPoly([[x-2.4,y],[x,y-2.8],[x+2.8,y+.6],[x,y+2.6]]),'#C2BDB5','#A39E96',x);}
      for(let i=0;i<5;i++)cP([[-10+i*5,12],[-8+i*5,22+i%2*4],[-6+i*5,12]],'#FFC800');},4.3);
    else if(id==='pijlen')los(()=>{for(let i=0;i<5;i++){G.save();G.translate((i-2)*7.5,Math.abs(i-2)*3.6-6);G.rotate(Math.PI/2+(i-2)*.13);
      cL([[-15,0],[10,0]],'#B07A45',2.4);cV(()=>cPoly([[10,-3.6],[16.5,0],[10,3.6]]),'#EEF2F6','#BFC9D4',12);cP([[-15,0],[-19.5,-4],[-11,0]],CL_TEAM[0].c);cP([[-15,0],[-19.5,4],[-11,0]],CL_TEAM[0].d);G.restore();}},4.2);
    else if(id==='boog'){fig('boog',70,222,3,{fase:2});fig('boog',132,228,3.2);}
    else if(id==='elektron'){fig('elektron',58,150,3.2,{fase:0});fig('elektron',142,138,3.2,{fase:2});fig('elektron',100,226,4,{fase:4});}
    else if(id==='ptero')fig('ptero',100,298,3.3,{m:{dir:1}});
    else{const s={ridder:3.1,onderzoeker:3.4,robot:2.75,reus:2.5,ram:3.1,tesla:2.85,kanon:3.7}[id]||3.2;fig(id,id==='ram'?88:100,228,s);}
    CL_PORTRET[id]=c.toDataURL('image/png');
  }
  G=oud;CL.t=tOud;
}
const CL_VAKKLEUR={GS:'#b45309',AK:'#15803d',SK:'#dc2626',NA:'#2563eb',IN:'#0e7490',BI:'#16a34a',WI:'#7c3aed'};
function clKaartHtml(id,o){o=o||{};const d=CL_KAARTEN[id];const z=CL_ZELD[d.zeld];
  let lv='';if(o.coll){const c=o.coll[id];if(c){const nodig=CL_UPGRADE[c.lvl]||0;const kan=nodig&&c.n>=nodig;
      lv=`<span class="cl-kaart-meta"><span class="cl-lvl${kan?' kan':''}">${c.lvl}</span>${c.lvl<CL_MAXLVL?`<span class="cl-voortg${kan?' kan':''}"><i style="width:${Math.min(100,c.n/nodig*100).toFixed(0)}%"></i><b>${kan?'↑ ':''}${c.n}/${nodig}</b></span>`:'<span class="cl-voortg max"><b>Max</b></span>'}</span>`;}
    else lv=`<span class="cl-slot">${_arcEsc(CL_ARENAS[CL_ARENA_KAART[id]||0].naam)}</span>`;}
  return `<span class="cl-kaart-art${o.coll&&!o.coll[id]?' dicht':''}" style="--zc:${z.c};--vc:${CL_VAKKLEUR[d.kort]||'#64748b'}">${CL_PORTRET[id]?`<img src="${CL_PORTRET[id]}" alt="" draggable="false">`:''}<em>${d.k}</em>${o.naam!==false?`<span class="cl-kaart-n">${_arcEsc(d.naam)}</span>`:''}<small>${d.kort}</small></span>${lv}`;}

// ── Renderer en lus ─────────────────────────────────────────────────────
function clStartRenderer(host){
  CL.lite=arcLite()||(navigator.hardwareConcurrency||8)<=3;
  CL.mobiel=matchMedia('(pointer:coarse)').matches||innerWidth<700;
  CL.dpr=CL.lite?1:Math.min(devicePixelRatio||1,2);
  const cv=document.createElement('canvas');cv.className='cl-canvas';const ctx=cv.getContext('2d');if(!ctx)throw new Error('geen canvas');
  host.prepend(cv);CL.cv=cv;CL.ctx=ctx;CL.cam={z:1,y:0};CL.q={fps:[]};CL.bg=null;
  CL.ro=new ResizeObserver(()=>{cancelAnimationFrame(CL.roRaf);CL.roRaf=requestAnimationFrame(clResize);});CL.ro.observe(host);CL.host=host;clResize();
}
// Fps-bewaker: meet 3 seconden; is het gemiddelde te laag, dan een stap lichter.
function clBewaak(ms){
  const q=CL.q;if(!q||q.vast||CL.mode!=='strijd')return;q.fps.push(ms);if(q.fps.length<150)return;
  const gem=q.fps.reduce((a,b)=>a+b,0)/q.fps.length;q.fps=[];if(gem<21)return;
  if(!q.rand4)q.rand4=true;else if(!q.geenRand)q.geenRand=true;else if(CL.dpr>1){CL.dpr=Math.max(1,CL.dpr-.5);CL.forceResize=true;clResize();}else CL.lite=true;
}
function clResize(){const h=CL.host;if(!h||!CL.cv)return;const w=Math.max(1,h.clientWidth),hh=Math.max(1,h.clientHeight);
  if(w===CL.vw&&hh===CL.vh&&!CL.forceResize)return;CL.forceResize=false;CL.vw=w;CL.vh=hh;
  CL.cv.width=Math.round(w*CL.dpr);CL.cv.height=Math.round(hh*CL.dpr);CL.cv.style.width=w+'px';CL.cv.style.height=hh+'px';CL.bgNodig=true;clFit();}
function clLus(nu){
  if(!CL.on)return;CL.raf=requestAnimationFrame(clLus);
  if(document.hidden){CL.vorige=nu;return;}
  const dt=Math.min(.05,Math.max(0,(nu-(CL.vorige||nu))/1000));
  if(CL.vorige)clBewaak(nu-CL.vorige);CL.vorige=nu;
  if(CL.mode==='strijd'&&!CL.pauze){
    if(!CL.klaar&&!CL.tut){
      CL.tijd-=dt;const dubbel=CL.tijd<=60||CL.overtime;
      if(dubbel&&!CL.dubbelGemeld){CL.dubbelGemeld=true;clBanner(CL.overtime?'Verlenging':'Dubbele kennis',CL.overtime?'De eerste toren die valt, beslist':'Je kennis loopt twee keer zo snel op');}
      const regen=dt/(dubbel?1.6:3.2);for(const t of [0,1])CL.kennis[t]=Math.min(10,CL.kennis[t]+regen);
      clBot(dt);
    }
    const sdt=CL.klaar?dt*.25:dt;CL.t+=sdt;
    for(const e of CL.ents.slice())clEntStap(e,sdt);clScheid();clProjStap(sdt);
    if(!CL.klaar){
      if(CL.tijd<=0&&!CL.tut)clTijdOp();
      if(CL.eindeNa!=null){CL.eindeNa-=dt;if(CL.eindeNa<=0){CL.eindeNa=null;clEinde();}}
      clDockTik();
    }
  }else CL.t+=dt;
  clFxStap(dt);clAnim(dt);
  if(CL.mode==='lobby'){CL.cam.z=1;CL.cam.y=Math.sin(CL.t*.11)*(CL.lobbyPan||0);}
  else if(!CL.zwaai){CL.schud=Math.max(0,(CL.schud||0)-dt*1.6);}
  clTeken();
  if(CL.mode!=='lobby')clBalken();
}
function clStop(){
  CL.on=false;cancelAnimationFrame(CL.raf);clCoachWeg();CL.tut=null;
  try{CL.ro&&CL.ro.disconnect();}catch(e){}
  if(CL._key){document.removeEventListener('keydown',CL._key);CL._key=null;}
  if(CL._mv){document.removeEventListener('pointermove',CL._mv);document.removeEventListener('pointerup',CL._up);document.removeEventListener('pointercancel',CL._af);CL._mv=CL._up=CL._af=null;}
  document.querySelectorAll('.cl-sleepkaart').forEach(x=>x.remove());
  if(CL.bg){CL.bg.width=CL.bg.height=0;}
  CL.cv=null;CL.ctx=null;CL.bg=null;CL.lijken=[];CL.route=null;CL.ghost=null;CL.zoneAan=false;CL.bars=null;CL.pops=null;CL.ents=[];CL.fx=[];CL.proj=[];CL.mode='lobby';CL.vw=CL.vh=0;
}
// Ghost, zone en route: wat je ziet terwijl je een kaart plaatst.
function clTekenZone(){
  const vijPr=CL.ents.filter(o=>o.team===1&&o.sub==='prinses');
  for(const links of [true,false]){const open=vijPr.some(o=>o.dood&&(o.x<9)===links);const z0=open?21.5:CL_RIV0;
    const [x0,y0]=clProj(links?0:9,0,CL_L),[x1,y1]=clProj(links?9:18,0,z0);
    G.save();G.fillStyle='rgba(255,75,75,.16)';G.fillRect(x0,y0,x1-x0,y1-y0);G.beginPath();G.rect(x0,y0,x1-x0,y1-y0);G.clip();
    G.strokeStyle='rgba(255,75,75,.2)';G.lineWidth=CL.S*.32;const H=y1-y0,o=(CL.t*CL.S*.6)%(CL.S*1.2);
    for(let s=-H-CL.S*1.2;s<x1-x0+CL.S;s+=CL.S*1.2){G.beginPath();G.moveTo(x0+s+o,y1);G.lineTo(x0+s+o+H,y0);G.stroke();}
    G.restore();G.save();G.strokeStyle='rgba(255,75,75,.75)';G.lineWidth=2;G.setLineDash([7,6]);G.beginPath();G.moveTo(x0,y1);G.lineTo(x1,y1);G.stroke();G.restore();}
}
function clTekenRoute(){
  const r=CL.route;const P=r.pts.map(([x,z])=>clProj(x,0,z));
  G.save();G.lineCap='round';G.lineJoin='round';
  G.strokeStyle='rgba(30,58,16,.18)';G.lineWidth=5;G.beginPath();P.forEach((q,i)=>i?G.lineTo(q[0],q[1]+2):G.moveTo(q[0],q[1]+2));G.stroke();
  G.strokeStyle='#FFFFFF';G.lineWidth=3;G.setLineDash([CL.S*.45,CL.S*.35]);G.lineDashOffset=-CL.t*CL.S*1.6;G.beginPath();P.forEach((q,i)=>i?G.lineTo(q[0],q[1]):G.moveTo(q[0],q[1]));G.stroke();
  G.setLineDash([]);const [dx,dy]=clProj(r.doel.x,0,r.doel.z);const pr=1+Math.sin(CL.t*6)*.06,rr=CL.S*2*r.doel.s*pr;
  G.globalAlpha=.9;G.lineWidth=3;G.beginPath();G.ellipse(dx,dy,rr,rr*CL_SY,0,0,7);G.stroke();G.globalAlpha=.18;G.fillStyle='#FFFFFF';G.fill();
  G.restore();
}
function clTekenGhostGrond(){
  const g=CL.ghost,d=CL_KAARTEN[g.id];const r=(d.t==='spreuk'?d.straal:d.t==='bouw'?d.r:.55)*CL.S;const [sx,sy]=clProj(g.x,0,g.z);const kl=g.ok?'#FFFFFF':'#FF4B4B';
  G.save();G.globalAlpha=.24;cE(sx,sy,r,r*CL_SY,kl);G.globalAlpha=.95;G.strokeStyle=kl;G.lineWidth=2.5;G.beginPath();G.ellipse(sx,sy,r,r*CL_SY,0,0,7);G.stroke();
  if(d.bereik>2){const b=d.bereik*CL.S;G.globalAlpha=.55;G.setLineDash([6,6]);G.lineDashOffset=-CL.t*20;G.beginPath();G.ellipse(sx,sy,b,b*CL_SY,0,0,7);G.stroke();}
  G.restore();
}
function clTekenGhost(){
  const g=CL.ghost,d=CL_KAARTEN[g.id];if(d.t==='spreuk')return;
  const n=d.n||1,F=CL_FORM[n]||CL_FORM[1],k=CL.S/CL_U*(n>1?.9:1),a0=G.globalAlpha;
  G.globalAlpha=a0*(g.ok?.7:.42);
  for(const [ox,oz] of F){const [sx,sy]=clProj(g.x+ox,0,g.z+oz);
    clPlak(clKd(g.id),k,sx,sy-Math.sin(CL.t*5)*1.5,()=>{G.scale(CL_US,CL_US);CL_TEKEN[g.id]({team:0,kaart:g.id,fase:ox,f:0,loopt:false,swing:9,rug:false,m:{dir:1},actief:true},0);},0,true);}
  G.globalAlpha=a0;
}
// ── Openen en lobby ─────────────────────────────────────────────────────
function openClash(direct){
  ARC.game='clash';
  arcStage('clash',`<div class="cl-root" id="cl-root"><div class="cl-veld" id="cl-veld"></div></div>`);
  ARC.onClose=()=>clStop();
  const veld=document.getElementById('cl-veld');
  try{clStartRenderer(veld);}catch(e){clGeenCanvas();return;}
  CL.on=true;CL.nid=0;CL.t=0;CL.mode='lobby';CL.lijken=[];CL.schud=0;
  const c=clStore();CL.arena=clArena(c.bekers);CL.bgNodig=true;clZetTorens();clFit();
  clPortretten();
  clLeerPool(()=>{clLobby();if(direct&&clGenoegLeerstof())clStartPotje();});
  CL.vorige=0;CL.raf=requestAnimationFrame(clLus);
}
function clGeenCanvas(){arcStage('clash',`${arcTop('')}<div class="arc-intro"><h2 class="arc-intro-h">Dit toestel kan de arena niet tonen</h2><p class="arc-intro-p">Probeer een nieuwere browser, of speel een van de andere games.</p><button class="arc-go" onclick="arcClose()">Terug naar de Arcade</button></div>`);}
function clKiesScene(i){if(CL.arena!==i||!CL.bg){CL.arena=i;CL.bgNodig=true;}}
function clLeegVeld(){
  for(const e of CL.ents)if(e.bar)e.bar.remove();
  CL.lijken=[];CL.ents=[];CL.proj=[];CL.fx=[];
}
function clZetTorens(){
  clLeegVeld();if(!CL.bars){CL.bars=document.createElement('div');}
  for(const t of [0,1]){const z=v=>t?CL_L-v:v;clMaakToren('prinses',t,3.5,z(6.5));clMaakToren('prinses',t,14.5,z(6.5));clMaakToren('koning',t,9,z(3));}
}
function clLobby(){
  CL.mode='lobby';CL.klaar=false;CL.cam&&(CL.cam.z=1);clFit();
  const c=clStore();const ar=CL_ARENAS[CL.arena];const volgende=CL_ARENAS[CL.arena+1];
  const vak=arcVak(ARC.vakId);const genoeg=clGenoegLeerstof();
  const veld=document.getElementById('cl-veld');if(!veld)return;
  veld.querySelectorAll('.cl-lobby,.cl-laden,.cl-hud,.cl-bars,.cl-pops,.cl-overlay').forEach(x=>x.remove());
  const pct=volgende?Math.min(100,(c.bekers-ar.min)/(volgende.min-ar.min)*100):100;
  const L=document.createElement('div');L.className='cl-lobby';
  // Compact zoals het hoofdscherm van een kaartspel: kop, arena in beeld, en onderaan
  // een vast paneel met kisten, je deck als rij en de grote Strijd-knop.
  L.innerHTML=`<div class="cl-lobby-top"><button class="arc-x" onclick="arcClose()" aria-label="Sluiten">✕</button>
      <div class="cl-lobby-titel"><small>${_arcEsc(vak?vak.naam:'')}</small><b>Slagio Clash</b></div>
      <div class="cl-bekers" title="Bekers">${CL_BEKER}<b>${arcNf(c.bekers,0)}</b></div></div>
    <div class="cl-arena"><div class="cl-arena-r"><span>${_arcEsc(ar.naam)}</span><small>${volgende?`${arcNf(volgende.min-c.bekers,0)} bekers tot ${_arcEsc(volgende.naam)}`:'Hoogste arena'}</small></div><div class="cl-arena-bar"><i style="width:${pct.toFixed(0)}%"></i></div></div>
    <div class="cl-lobby-ruimte"></div>
    <div class="cl-lobby-onder">
      <div class="cl-kisten">${[0,1,2,3].map(i=>{const k=c.kisten[i];return k?`<button class="cl-kist ${k.soort}" onclick="clKistOpen(${i})">${clKistSvg(k.soort)}<small>${CL_KIST[k.soort].nodig} begrippen</small></button>`:`<div class="cl-kist leeg"><span></span></div>`;}).join('')}</div>
      <div class="cl-deck-kop"><b>Jouw deck</b><button class="cl-hoe" onclick="clRegels(true)">Hoe werkt het?</button></div>
      <div class="cl-deck mini" id="cl-deck">${c.deck.map((id,i)=>{const cc=c.coll[id]||{lvl:1,n:0},kan=cc.lvl<CL_MAXLVL&&cc.n>=(CL_UPGRADE[cc.lvl]||1e9);
        return `<button class="cl-kaart mini${kan?' upg':''}" onclick="clKaartInfo(${i})" aria-label="${_arcEsc(CL_KAARTEN[id].naam)}, level ${cc.lvl}">${clKaartHtml(id,{naam:false})}<span class="cl-mlvl">${kan?'↑':cc.lvl}</span></button>`;}).join('')}</div>
      ${genoeg?`<button class="arc-go cl-strijd" id="cl-strijd">${CL_ZWAARDEN}<span>Strijd</span></button>`:`<p class="cl-lobby-p">${_arcEsc(vak?vak.naam:'Dit vak')} heeft nog te weinig begrippen en korte vragen. Kies in de Arcade een ander vak.</p><button class="arc-go" onclick="arcClose()">Terug</button>`}
      <div class="cl-lobby-stat">${c.gespeeld?`${c.gewonnen} van ${c.gespeeld} gewonnen`:'Je eerste potje: de uitleg volgt in het spel'}</div>
    </div>`;
  veld.appendChild(L);
  const b=document.getElementById('cl-strijd');if(b)b.onclick=()=>{arcSnd('start');clStartPotje();};
}
const CL_BEKER='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v3h3v2a5 5 0 0 1-4.3 4.95A5 5 0 0 1 13 15.9V18h3v3H8v-3h3v-2.1a5 5 0 0 1-2.7-2.95A5 5 0 0 1 4 8V6h3zm0 5V8H6a3 3 0 0 0 1 2.2zm10 0v2.2A3 3 0 0 0 18 8z" fill="currentColor"/></svg>';
function clKaartInfo(i){
  const c=clStore();const id=c.deck[i];const d=CL_KAARTEN[id];const my=c.coll[id]||{lvl:1,n:0};const f=clLvlF(my.lvl);
  const rest=Object.keys(CL_KAARTEN).filter(k=>!c.deck.includes(k));
  const st=d.t==='spreuk'?[['Schade',Math.round(d.dmg*f)],['Straal',arcNf(d.straal,1)+' tegels'],['Op torens',Math.round(d.toren*100)+'%']]
    :[['Levens',Math.round(d.hp*f)*(d.n||1)+(d.n>1?` (${d.n}×)`:'')],['Schade',Math.round(d.dmg*f)],['Bereik',d.bereik>2?arcNf(d.bereik,1):'dichtbij'],d.leeft?['Staat',d.leeft+' s']:['Doel',d.doel==='gebouw'?'gebouwen':d.doel==='grond'?'grond':'grond en lucht']];
  const nodig=CL_UPGRADE[my.lvl]||0;const kan=my.lvl<CL_MAXLVL&&my.n>=nodig;
  const o=document.createElement('div');o.className='cl-sheet';o.innerHTML=`<div class="cl-sheet-in" role="dialog" aria-label="${_arcEsc(d.naam)}">
    <div class="cl-sheet-kop"><div class="cl-kaart groot">${clKaartHtml(id,{naam:false})}</div><div><div class="cl-sheet-z" style="color:${CL_ZELD[d.zeld].c}">${CL_ZELD[d.zeld].naam} · ${_arcEsc(d.vak)} · Level ${my.lvl}</div><h3>${_arcEsc(d.naam)}</h3><div class="cl-sheet-st">${st.map(s=>`<span><small>${s[0]}</small><b>${s[1]}</b></span>`).join('')}</div></div></div>
    <p class="cl-sheet-feit">${_arcEsc(d.feit)}</p>
    ${my.lvl<CL_MAXLVL?`<div class="cl-upg"><div class="cl-upg-t"><b>Naar level ${my.lvl+1}</b><span>${my.n} van ${nodig} kaarten · +10% levens en schade</span></div><button class="arc-go cl-upg-k" data-upg ${kan?'':'disabled'}>${kan?'Upgraden':'Nog '+(nodig-my.n)}</button></div>`:'<div class="cl-upg"><div class="cl-upg-t"><b>Maximaal level</b></div></div>'}
    <div class="cl-sheet-k">Wisselen voor</div>
    <div class="cl-deck">${rest.map(k=>`<button class="cl-kaart klein" data-k="${k}" ${c.coll[k]?'':'disabled'}>${clKaartHtml(k,{coll:c.coll})}</button>`).join('')}</div>
    <button class="arc-ghost" data-sluit>Klaar</button></div>`;
  document.getElementById('cl-veld').appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
  const sluit=()=>{o.classList.remove('on');setTimeout(()=>o.remove(),220);};
  o.addEventListener('click',e=>{if(e.target===o||e.target.closest('[data-sluit]'))sluit();
    if(e.target.closest('[data-upg]')&&kan){const c2=clStore();const x=c2.coll[id];x.n-=nodig;x.lvl++;clSave(c2);clFx('kist');arcXP(6*x.lvl);
      try{const m=arcMid(o.querySelector('.cl-kaart.groot'));arcBurst(m.x,m.y,{n:26,afstand:150,maat:9});}catch(er){}sluit();setTimeout(()=>{clLobby();clPopMid&&0;},230);return;}
    const k=e.target.closest('[data-k]');
    if(k&&!k.disabled){const c2=clStore();c2.deck[i]=k.dataset.k;clSave(c2);clFx('kaart');sluit();clLobby();}});
}

// ── Potje ───────────────────────────────────────────────────────────────
function clStartPotje(){
  const c=clStore();CL.arena=clArena(c.bekers);clKiesScene(CL.arena);
  const veld=document.getElementById('cl-veld');const root=document.getElementById('cl-root');if(!veld)return;
  veld.querySelectorAll('.cl-lobby,.cl-sheet,.cl-hud,.cl-bars,.cl-pops,.cl-overlay,.cl-emo-knop,.cl-emo-menu').forEach(x=>x.remove());
  CL.bars=document.createElement('div');CL.bars.className='cl-bars';veld.appendChild(CL.bars);
  CL.pops=document.createElement('div');CL.pops.className='cl-pops';veld.appendChild(CL.pops);
  let naam='';try{naam=_lgBotName(Math.random);}catch(e){naam='Tegenstander';}
  const hud=document.createElement('div');hud.className='cl-hud';hud.innerHTML=`<button class="arc-x cl-x" onclick="clOpgeven()" aria-label="Stoppen">✕</button>
    <div class="cl-score"><div class="cl-kr t0" id="cl-kronen0">${'<span class="k"></span>'.repeat(3)}</div><div class="cl-klok" id="cl-klok">3:00</div><div class="cl-kr t1" id="cl-kronen1">${'<span class="k"></span>'.repeat(3)}</div></div>
    <div class="cl-tegen">${_arcEsc(naam)} <small>computer</small></div><button class="arc-x cl-help" onclick="clRegels()" aria-label="Spelregels">?</button>`;
  veld.appendChild(hud);
  veld.insertAdjacentHTML('beforeend','<button class="cl-emo-knop" onclick="clEmoMenu()" aria-label="Emote sturen"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H10l-4 4V16H4z"/><path d="M9 10h.01M15 10h.01M9.5 13a3.5 3.5 0 0 0 5 0"/></svg></button>');
  // Staat van het potje.
  Object.assign(CL,{mode:'strijd',klaar:false,pauze:false,tijd:180,overtime:false,dubbelGemeld:false,eindeNa:null,t:0,tempo:1,kronen:[0,0],kennis:[5,5],
    gespeeld:0,sterk:false,reeks:0,dq:1.6,gebruikt:new Set(),gebruiktB:new Set(),herhaal:[],nr:0,log:[],botNaam:naam,gekozen:-1,schud:0,tut:null,beslissing:false,emoT:0});
  const deck=arcShuffle(c.deck.slice());CL.hand=deck.slice(0,4);CL.rij=deck.slice(4);
  const pool=Object.keys(CL_KAARTEN).filter(id=>(CL_ARENA_KAART[id]||0)<=CL.arena);const bd=arcShuffle(pool).slice(0,8);if(!bd.some(k=>['reus','ram','ridder'].includes(k)))bd[0]='ridder';
  CL.bot={hand:bd.slice(0,4),rij:bd.slice(4),denk:5,antw:4,goed:0,vragen:0};CL.botLvl=1+CL.arena;CL._store=c;
  clZetTorens();
  CL.topPad=root.clientWidth>=900?64:58;
  clDock();CL.forceResize=true;clResize();clFit();
  // Openingsbeeld: het veld zoomt rustig in naar de speelpositie.
  const t0=performance.now();CL.pauze=true;CL.zwaai=true;CL.cam.z=1.16;CL.cam.y=-CL.S*2.5;
  const zwaai=nu=>{if(!CL.on)return;const p=Math.min(1,(nu-t0)/950),e=1-Math.pow(1-p,3);CL.cam.z=1.16-.16*e;CL.cam.y=-CL.S*2.5*(1-e);
    if(p<1)requestAnimationFrame(zwaai);else{CL.cam.z=1;CL.cam.y=0;CL.zwaai=false;clAftellen();}};
  requestAnimationFrame(zwaai);
  clFlitsNieuw();
}
function clAftellen(){
  const veld=document.getElementById('cl-veld');const el=document.createElement('div');el.className='cl-overlay cl-cd';veld.appendChild(el);
  // Eerste potje: eerst de uitleg in stappen, het gevecht start pas daarna.
  if(!clStore().uitlegGezien){el.remove();clTutStart();return;}
  let n=3;const tik=()=>{if(!CL.on)return;if(n===0){el.innerHTML=`<b class="go">${CL_ZWAARDEN}<span>Strijd!</span></b>`;arcSnd('start');arcHap(20);CL.pauze=false;setTimeout(()=>el.remove(),650);return;}
    el.innerHTML=`<b>${n}</b>`;arcSnd('tick');n--;setTimeout(tik,650);};tik();
}
function clBanner(t,s){const veld=document.getElementById('cl-veld');if(!veld)return;const b=document.createElement('div');b.className='cl-overlay cl-banner';b.innerHTML=`<b>${_arcEsc(t)}</b><small>${_arcEsc(s||'')}</small>`;veld.appendChild(b);arcSnd('levelup');setTimeout(()=>b.remove(),2400);}
function clHud(){for(const t of [0,1]){const k=document.getElementById('cl-kronen'+t);if(k)k.querySelectorAll('.k').forEach((x,i)=>{const aan=i<CL.kronen[t];if(aan&&!x.classList.contains('aan')){x.classList.add('aan');x.innerHTML=CL_KROON;}});}}
function clTijdOp(){
  if(CL.beslissing)return;
  if(!CL.overtime&&CL.kronen[0]===CL.kronen[1]){CL.overtime=true;CL.tijd=60;CL.dubbelGemeld=false;return;}
  CL.tijd=0;
  // Tiebreaker: nog steeds gelijk? Dan valt de toren met het minste leven (in procenten).
  if(CL.kronen[0]===CL.kronen[1]){const t=CL.ents.filter(e=>e.soort==='toren'&&!e.dood).sort((a,b)=>a.hp/a.max-b.hp/b.max);
    if(t.length&&(t.length<2||t[0].hp/t[0].max<t[1].hp/t[1].max-.001||t[0].team===t[1].team)){CL.beslissing=true;clBanner('Beslissing','De toren met het minste leven valt');const x=t[0];setTimeout(()=>{if(!CL.on)return;x.hp=0;clDood(x);CL.eindeNa=null;setTimeout(()=>clEinde(),1400);},900);return;}}
  clEinde();
}
function clOpgeven(){
  if(CL.mode!=='strijd'||CL.klaar){arcClose();return;}
  if(!confirm('Stoppen? Dan telt dit potje als verloren.'))return;
  CL.kronen[1]=3;clEinde(true);
}
function clEinde(opgegeven){
  if(CL.klaar)return;CL.klaar=true;CL.gekozen=-1;clGhostWeg();
  const [a,b]=CL.kronen;const uitslag=a>b?'win':a<b?'verlies':'gelijk';CL.uitslag=uitslag;
  if(!opgegeven&&uitslag==='gelijk'){ // gelijk in kronen: laagste toren beslist niet, gewoon gelijkspel
  }
  const veld=document.getElementById('cl-veld');const o=document.createElement('div');o.className='cl-overlay cl-eind '+uitslag;
  o.innerHTML=`<b class="lint">${uitslag==='win'?'Gewonnen':uitslag==='verlies'?'Verloren':'Gelijkspel'}</b><div class="cl-eind-kr">${[0,1,2].map(i=>`<span class="${i<a?'aan':''}">${CL_KROON}</span>`).join('')}</div>`;
  veld&&veld.appendChild(o);
  arcSnd(uitslag==='win'?'fanfare':'complete');if(uitslag==='win'){try{const m=arcMid(o.querySelector('b'));arcBurst(m.x,m.y,{n:36,afstand:190,maat:9});}catch(e){}}
  setTimeout(()=>{if(CL.on)clUitslag();},2300);
}
function clUitslag(){
  const c=clStore();const [a,b]=CL.kronen;const u=CL.uitslag;
  const delta=u==='win'?30+(a-b-1)*4:u==='verlies'?-Math.min(c.bekers,20):0;
  const oudArena=clArena(c.bekers);c.bekers=Math.max(0,c.bekers+delta);c.gespeeld++;if(u==='win')c.gewonnen++;c.best=Math.max(c.best||0,c.bekers);
  let kist=null;if(u==='win'){if(c.kisten.length<4){const r=Math.random();kist=r<.06?'goud':r<.3?'zilver':'hout';c.kisten.push({soort:kist,arena:clArena(c.bekers),t:Date.now()});}else kist='vol';}
  clSave(c);CL._store=null;
  const nieuwArena=clArena(c.bekers);
  arcRecord('clash',c.bekers,true);
  const goed=CL.log.filter(x=>x.goed).length,tot=CL.log.length;const gepland=clLeerOpslaan();
  const xp=arcXP(goed*5+(u==='win'?25:u==='gelijk'?10:5)+a*8);
  try{if(typeof trackEvent==='function')trackEvent('minigame',{game:'clash',uitslag:u,kronen:a,tegen:b,goed,vragen:tot,bekers:c.bekers,xp,vak_id:ARC.vakId});}catch(e){}
  // Leerkaarten: wat je miste, als begrip met betekenis (niet als lange vraag).
  const gemist=[],gezien=new Set();for(const x of CL.log){if(x.goed)continue;const k=x.soort==='vraag'?x.item.q.v:x.item.t;if(gezien.has(k))continue;gezien.add(k);gemist.push(x);}
  const leer=gemist.slice(0,6).map(x=>x.soort==='vraag'
    ?`<li><div class="cl-leer-v">${_arcEsc(x.item.q.v)}</div><div class="cl-leer-a">${_arcEsc(x.item.q.o[x.item.q.c])}</div>${x.item.q.uh?`<div class="cl-leer-u">${_arcEsc(x.item.q.uh)}</div>`:''}</li>`
    :`<li><div class="cl-leer-v">${_arcEsc(x.item.t)}</div><div class="cl-leer-u">${_arcEsc(x.item.d)}</div></li>`).join('');
  const nBeg=new Set(CL.log.filter(x=>x.soort!=='vraag').map(x=>x.item.t)).size,nGoedBeg=new Set(CL.log.filter(x=>x.soort!=='vraag'&&x.goed).map(x=>x.item.t)).size;
  const zwakX=gemist.find(x=>x.soort==='vraag');const zwakLd=zwakX?zwakX.item:null;
  clStop();
  arcStage('clash-res',`${arcTop('')}
    <div class="arc-res cl-res ${u==='win'?'win':'lose'}">
      <div class="cl-res-kr">${[0,1,2].map(i=>`<span class="${i<a?'aan':''}" style="--i:${i}">${CL_KROON}</span>`).join('')}</div>
      <div class="arc-res-k">${u==='win'?'Gewonnen':u==='verlies'?'Verloren':'Gelijkspel'} · ${a} tegen ${b}</div>
      <div class="arc-res-big"><span class="cl-beker-ic">${CL_BEKER}</span><span class="arc-tel">${arcNf(c.bekers-delta,0)}</span></div>
      <div class="arc-res-sub">${delta>0?`+${delta} bekers`:delta<0?`${delta} bekers`:'Bekers blijven gelijk'}${nieuwArena>oudArena?` · Nieuwe arena: <b>${_arcEsc(CL_ARENAS[nieuwArena].naam)}</b>`:''}</div>
      <div class="arc-res-stats"><div><b>${goed}/${tot}</b><small>goed beantwoord</small></div><div><b>${nGoedBeg}/${nBeg}</b><small>begrippen gekend</small></div><div><b>${CL.gespeeld}</b><small>kaarten gespeeld</small></div></div>
      ${kist&&kist!=='vol'?`<div class="cl-res-kist">${clKistSvg(kist)}<div><b>Je kreeg een ${_arcEsc(CL_KIST[kist].naam.toLowerCase())}</b><span>Open hem in de lobby met ${CL_KIST[kist].nodig} goede begrippen.</span></div></div>`:kist==='vol'?`<div class="cl-res-kist"><div><b>Je kistplekken zijn vol</b><span>Open eerst een kist in de lobby.</span></div></div>`:''}
      ${xp?`<div class="arc-res-xp"><span class="arc-xp-chip">+<b class="arc-xp-n">0</b> XP</span><small>telt mee voor je divisie</small></div>`:''}
      ${leer?`<div class="cl-leer"><div class="cl-leer-k">Deze moet je nog even leren</div><ul>${leer}</ul>${gepland?`<div class="cl-leer-sr">${gepland===1?'Dit begrip komt':'Deze begrippen komen'} morgen terug in Herhalen.</div>`:''}</div>`:tot?`<div class="arc-res-leer">Alles goed beantwoord. Dat scheelt kennis, en kennis wint potjes.</div>`:''}
      <div class="arc-res-btns"><button class="arc-go" onclick="openClash(true)">Nog een potje</button>
        ${zwakLd?`<button class="arc-ghost" onclick="clOefenZwak('${_arcEsc(zwakLd.ldId)}')">Oefen ${_arcEsc(zwakLd.ldNaam||'dit leerdoel')} in Zwakke plek</button>`:''}
        <button class="arc-ghost" onclick="arcClose()">Terug naar de Arcade</button></div>
    </div>`);
  arcTel(document.querySelector('.arc-tel'),c.bekers,{van:c.bekers-delta,duur:1000});
  if(xp)setTimeout(()=>{arcTel(document.querySelector('.arc-xp-n'),xp,{duur:900});arcSnd('xp');},700);
  if(u==='win'){setTimeout(()=>{const m=arcMid(document.querySelector('.cl-res-kr'));arcBurst(m.x,m.y,{n:30,afstand:170,maat:9});},500);if(nieuwArena>oudArena){try{if(!arcLite())launchConfetti('gold');}catch(e){}}}
}
function clOefenZwak(ld){try{ZWAK.doel=null;ZWAK.forceLd=ld;}catch(e){}arcStart('zwak');}
function clUitleg(q,keuze){
  let t='';if(Array.isArray(q.uo)&&keuze!=null&&q.uo[keuze])t=q.uo[keuze];else if(q.u)t=q.u;
  if(!t)return '';try{return new DOMParser().parseFromString(String(t),'text/html').body.textContent.trim().slice(0,260);}catch(e){return '';}
}

// ── Leerstof: begrippenflitsen ──────────────────────────────────────────
// Korte flitsen in plaats van lange vragen: je leest één definitie en tikt het
// begrip (of andersom). Af en toe een korte meerkeuzevraag. Gemiste begrippen
// komen in hetzelfde potje terug (herhalen werkt beter dan één keer lezen) en
// gaan na afloop naar je herhaalkaarten.
const CL_REEKS=4;
function clLeerPool(klaar){
  const lvl=(typeof APP_LEVEL!=='undefined')?APP_LEVEL:'havo';
  const bouw=()=>{
    const vak=arcVak(ARC.vakId);const beg=[],gezien=new Set();
    ((vak&&vak.domeinen)||[]).forEach(d=>(d.begrippen||[]).forEach(b=>{if(!b||!b.t||!b.d)return;const t=String(b.t).trim(),df=String(b.d).trim().replace(/\.$/,'');
      if(t.length>30||df.length>110||df.length<8)return;const k=t.toLowerCase();if(gezien.has(k))return;gezien.add(k);beg.push({t,d:df,domId:d.id,domNaam:d.naam});}));
    CL.beg=beg;
    arcPool(ARC.vakId,p=>{CL.pool=p||[];CL.kortQ=CL.pool.filter(x=>x.q.v.length<=90&&x.q.o.every(o=>String(o).length<=34));klaar();});
  };
  try{if(typeof ensureVakData==='function')ensureVakData(lvl,ARC.vakId,bouw);else bouw();}catch(e){bouw();}
}
function clGenoegLeerstof(){return (CL.beg||[]).length>=6||(CL.kortQ||[]).length>=8;}
function clVolgendeFlits(){
  CL.nr++;
  const h=CL.herhaal.findIndex(x=>x.na<=CL.nr);
  if(h>=0){const x=CL.herhaal.splice(h,1)[0];return clMaakFlits(x.item,true);}
  const vragen=(CL.kortQ||[]).length>=6,begs=(CL.beg||[]).length>=6;
  if(vragen&&(!begs||CL.nr%4===0)){const it=arcNext(CL.kortQ,CL.gebruikt,Math.round(CL.dq));if(it){const o=arcOpties(it.q);return {soort:'vraag',item:it,o,juist:o.juist};}}
  const vrij=CL.beg.filter(b=>!CL.gebruiktB.has(b.t));if(!vrij.length)CL.gebruiktB.clear();
  const item=arcPick(vrij.length?vrij:CL.beg);CL.gebruiktB.add(item.t);return clMaakFlits(item,false);
}
function clMaakFlits(item,herh){
  const zelfde=CL.beg.filter(b=>b!==item&&b.domId===item.domId&&b.t.toLowerCase()!==item.t.toLowerCase());
  const rest=CL.beg.filter(b=>b!==item&&b.domId!==item.domId);
  const afl=arcShuffle(zelfde).slice(0,2);while(afl.length<2&&rest.length){const r=arcPick(rest);if(!afl.includes(r))afl.push(r);}
  const omgekeerd=!herh&&CL.nr>3&&Math.random()<.25&&item.d.length<=70&&afl.every(a=>a.d.length<=70);
  const opties=arcShuffle([item,...afl.slice(0,omgekeerd?1:2)]);
  return {soort:omgekeerd?'term':'def',item,opties,juist:opties.indexOf(item),herh};
}
function clFlitsNieuw(){
  const box=document.getElementById('cl-vraag');if(!box)return;
  if(!clGenoegLeerstof()){box.innerHTML='<div class="cl-v-leeg">Geen leerstof voor dit vak</div>';return;}
  const F=clVolgendeFlits();CL.flits=F;F.t0=performance.now();F.klaar=false;
  const reeks=`<span class="cl-f-reeks" aria-label="${CL.reeks} van ${CL_REEKS} op rij">${Array.from({length:CL_REEKS},(_,i)=>`<i class="${i<CL.reeks?'aan':''}"></i>`).join('')}</span>`;
  const kop=(label)=>`<div class="cl-f-kop"><span>${F.herh?'<b class="cl-f-herh">Nog een keer</b>':_arcEsc(label)}</span>${reeks}</div>`;
  if(F.soort==='vraag'){const L=['A','B','C','D'];
    box.innerHTML=`${kop(F.item.ldNaam||F.item.domNaam||'')}<div class="cl-f-v vraag">${_arcEsc(F.item.q.v)}</div>
      <div class="cl-f-o twee">${F.o.idx.map((oi,k)=>`<button class="cl-opt" data-k="${k}"><i>${L[k]}</i><span>${_arcEsc(F.item.q.o[oi])}</span></button>`).join('')}</div><div class="cl-f-fb" id="cl-vfb"></div>`;}
  else if(F.soort==='term'){
    box.innerHTML=`${kop('Wat betekent')}<div class="cl-f-v term">${_arcEsc(F.item.t)}</div>
      <div class="cl-f-o lang">${F.opties.map((o,k)=>`<button class="cl-opt" data-k="${k}"><span>${_arcEsc(o.d)}</span></button>`).join('')}</div><div class="cl-f-fb" id="cl-vfb"></div>`;}
  else{
    box.innerHTML=`${kop('Welk begrip is dit?')}<div class="cl-f-v">${_arcEsc(F.item.d)}</div>
      <div class="cl-f-o drie">${F.opties.map((o,k)=>`<button class="cl-opt chip" data-k="${k}"><span>${_arcEsc(o.t)}</span></button>`).join('')}</div><div class="cl-f-fb" id="cl-vfb"></div>`;}
  box.classList.remove('in');void box.offsetWidth;box.classList.add('in');
  box.querySelectorAll('.cl-opt').forEach(b=>b.onclick=()=>clAntwoord(+b.dataset.k));
}
function clAntwoord(k){
  const F=CL.flits;if(!F||F.klaar||CL.klaar)return;F.klaar=true;
  const goed=k===F.juist;const ms=performance.now()-F.t0;
  const knoppen=[...document.querySelectorAll('#cl-vraag .cl-opt')];knoppen.forEach(b=>b.disabled=true);knoppen[F.juist].classList.add('goed');
  // Leerlaag: meerkeuzevragen via arcLog (mastery + afleiders), begrippen per domein.
  if(F.soort==='vraag')arcLog(F.item,goed,F.o.idx[k],ms);
  else{try{if(typeof logQuestion==='function')logQuestion(ARC.vakId,F.item.domId,'arcade',0,goed,ms);}catch(e){}}
  CL.log.push({soort:F.soort,item:F.item,goed,keuze:F.soort==='vraag'?F.o.idx[k]:null,herh:F.herh,domId:F.soort==='vraag'?F.item.domId:F.item.domId});
  if(CL.tut&&CL.tut.stap===1)setTimeout(()=>clTutVerder(),goed?700:2200);
  if(goed){
    CL.dq=Math.min(3,CL.dq+.34);CL.reeks++;CL.kennis[0]=Math.min(10,CL.kennis[0]+1);
    arcSnd('correct');arcHap(10);
    try{arcFly(arcMid(knoppen[k]),arcMid(document.getElementById('cl-knum')),'<span class="cl-plus">+1</span>',{duur:480,eind:.8,boog:-26});}catch(e){}
    if(F.herh){const f=document.getElementById('cl-vfb');if(f)f.innerHTML='<span class="cl-f-ok">Onthouden!</span>';}
    if(CL.reeks>=CL_REEKS){CL.reeks=0;if(!CL.sterk){CL.sterk=true;arcSnd('streak');clDockTik();clPopMid('Je volgende kaart is versterkt');}}
    setTimeout(()=>{if(CL.mode==='strijd'&&!CL.klaar)clFlitsNieuw();},F.herh?750:430);
  }else{
    CL.dq=Math.max(1,CL.dq-.5);CL.reeks=0;knoppen[k].classList.add('fout');arcSnd('wrong');arcHap([15,25,15]);
    if(F.soort!=='vraag')CL.herhaal.push({item:F.item,na:CL.nr+3});
    const f=document.getElementById('cl-vfb');
    const uit=F.soort==='vraag'?(F.item.q.uh||clUitleg(F.item.q,F.o.idx[k])):`<b>${_arcEsc(F.item.t)}</b>: ${_arcEsc(F.item.d)}`;
    if(f)f.innerHTML=`<div class="cl-v-uit">${F.soort==='vraag'?_arcEsc(uit):uit}</div>`;
    setTimeout(()=>{if(CL.mode==='strijd'&&!CL.klaar)clFlitsNieuw();},2200);
  }
}
// Na afloop: beheersing per domein bijwerken en gemiste begrippen inplannen.
function clLeerOpslaan(){
  const perDom={};for(const x of CL.log){const k=x.domId;if(!k)continue;(perDom[k]=perDom[k]||{g:0,n:0});perDom[k].n++;if(x.goed)perDom[k].g++;}
  for(const [dom,v] of Object.entries(perDom))if(v.n>=6){try{saveProgress(ARC.vakId,dom,'snel',Math.round(v.g/v.n*10),10);}catch(e){}}
  let gepland=0;
  try{if(typeof getSR==='function'&&typeof sm2==='function'){const sr=getSR();
    for(const x of CL.log){if(x.soort==='vraag')continue;const k=srKey(ARC.vakId,x.item.domId,x.item.t);
      if(!x.goed){sr[k]=Object.assign({vakId:ARC.vakId,domId:x.item.domId,term:x.item.t},sm2(sr[k]||{},0));gepland++;}
      else if(sr[k]&&!x.herh)sr[k]=Object.assign({},sr[k],sm2(sr[k],3));}
    saveSR(sr);}}catch(e){}
  return gepland;
}

// ── Dock: flits, hand en kennisbalk ─────────────────────────────────────
function clDock(){
  const root=document.getElementById('cl-root');let d=document.getElementById('cl-dock');if(d)d.remove();
  d=document.createElement('div');d.className='cl-dock';d.id='cl-dock';
  const vak=arcVak(ARC.vakId);
  d.innerHTML=`<div class="cl-dock-kop"><b>${_arcEsc(vak?vak.naam:'Leerstof')}</b><span>Elk goed antwoord geeft 1 kennis. ${CL_REEKS} op rij versterkt je volgende kaart. Wat je mist, komt terug.</span></div>
    <div class="cl-vraag" id="cl-vraag"></div>
    <div class="cl-info" id="cl-info"></div>
    <div class="cl-hand"><div class="cl-next"><small>Volgende</small><div class="cl-kaart mini" id="cl-next"></div></div>
      <div class="cl-kaarten" id="cl-kaarten"></div></div>
    <div class="cl-kennis"><div class="cl-kennis-bar" id="cl-kbar"><i></i>${'<s></s>'.repeat(9)}</div><b id="cl-knum">5</b></div>`;
  root.appendChild(d);clHand();clInput();
}
function clHand(){
  // De knoppen blijven staan; alleen wat verandert wordt bijgewerkt (geen herbouw, geen flits).
  const k=document.getElementById('cl-kaarten');if(!k)return;
  if(k.children.length!==4)k.innerHTML=[0,1,2,3].map(i=>`<button class="cl-kaart" data-i="${i}"></button>`).join('');
  [...k.children].forEach((b,i)=>{const id=CL.hand[i];
    if(b.dataset.id!==id){const eerder=!!b.dataset.id;b.dataset.id=id;b.innerHTML=clKaartHtml(id);b.setAttribute('aria-label',`${CL_KAARTEN[id].naam}, ${CL_KAARTEN[id].k} kennis`);
      if(eerder){b.classList.remove('nieuw');void b.offsetWidth;b.classList.add('nieuw');}}
    b.classList.toggle('gekozen',CL.gekozen===i);});
  const n=document.getElementById('cl-next');if(n&&n.dataset.id!==CL.rij[0]){n.dataset.id=CL.rij[0];n.innerHTML=clKaartHtml(CL.rij[0],{naam:false});}
  const inf=document.getElementById('cl-info');
  if(inf){const id=CL.gekozen>=0?CL.hand[CL.gekozen]:null;inf.classList.toggle('zicht',!!id);
    if(id&&inf.dataset.id!==id){inf.dataset.id=id;const d=CL_KAARTEN[id];inf.innerHTML=`<b>${_arcEsc(d.naam)}</b><span>${_arcEsc(d.wat)}</span><em>${d.t==='spreuk'?'Tik waar hij moet landen':'Tik of sleep naar jouw helft'}</em>`;}}
  clDockTik(true);
}
function clDockTik(){
  const kn=CL.kennis[0];const bar=document.getElementById('cl-kbar');if(!bar)return;
  bar.firstChild.style.width=(kn*10).toFixed(1)+'%';const num=document.getElementById('cl-knum');const hele=Math.floor(kn);if(num.textContent!=hele){if(+num.textContent<hele)arcRestart(num,'plus');num.textContent=hele;}
  document.querySelectorAll('#cl-kaarten .cl-kaart').forEach(b=>{const id=CL.hand[+b.dataset.i];if(!id)return;const kan=kn>=CL_KAARTEN[id].k;
    const st=(kan?1:0)+(CL.sterk?2:0);if(b._st!==st){b._st=st;b.classList.toggle('kan',kan);b.classList.toggle('sterk',CL.sterk);}
    const l=Math.min(1,kn/CL_KAARTEN[id].k).toFixed(2);if(b._l!==l){b._l=l;b.style.setProperty('--laad',l);}});
  const kl=document.getElementById('cl-klok');if(kl){const t=Math.max(0,Math.ceil(CL.tijd));const txt=Math.floor(t/60)+':'+String(t%60).padStart(2,'0');if(kl.textContent!==txt)kl.textContent=txt;
    kl.classList.toggle('dubbel',CL.tijd<=60||CL.overtime);kl.classList.toggle('laatst',CL.tijd<=10);}
}

// ── Besturing: kaart slepen of tikken, dan op het veld tikken ───────────
function clInput(){
  const kaarten=document.getElementById('cl-kaarten'),cv=CL.cv;
  const punt=(cx,cy)=>{const r=cv.getBoundingClientRect();if(cx<r.left||cx>r.right||cy<r.top||cy>r.bottom)return null;
    const w=clPunt(cx-r.left,cy-r.top);return [Math.round(w[0]*2)/2,Math.round(w[1]*2)/2];};
  let sleep=null,vlieg=null;
  // De kaart volgt je vinger; boven het veld wordt hij het voorbeeld van de eenheid.
  const vliegZet=(x,y,opVeld)=>{if(!vlieg)return;vlieg.style.transform=`translate(${x}px,${y}px) translate(-50%,-62%) scale(${opVeld?.4:1.08})`;vlieg.classList.toggle('veld',!!opVeld);};
  const vliegWeg=()=>{if(vlieg){vlieg.remove();vlieg=null;}document.querySelectorAll('#cl-kaarten .cl-kaart.sleept').forEach(x=>x.classList.remove('sleept'));};
  // Bij aanraken ligt het plaatsingspunt net boven je vinger, zodat je ziet waar hij komt.
  const doelPunt=e=>punt(e.clientX,e.clientY-(e.pointerType==='touch'?34:0));
  kaarten.addEventListener('pointerdown',e=>{const b=e.target.closest('.cl-kaart');if(!b||CL.klaar||CL.mode!=='strijd')return;e.preventDefault();sleep={i:+b.dataset.i,x:e.clientX,y:e.clientY,beweeg:false,b};});
  kaarten.addEventListener('touchmove',e=>{if(sleep)e.preventDefault();},{passive:false});
  if(CL._mv){document.removeEventListener('pointermove',CL._mv);document.removeEventListener('pointerup',CL._up);document.removeEventListener('pointercancel',CL._af);}
  CL._mv=e=>{
    if(!sleep){if(CL.gekozen>=0&&e.pointerType==='mouse')clGhost(CL.hand[CL.gekozen],punt(e.clientX,e.clientY));return;}
    if(!sleep.beweeg&&Math.hypot(e.clientX-sleep.x,e.clientY-sleep.y)>10){sleep.beweeg=true;CL.gekozen=sleep.i;clHand();document.documentElement.classList.add('cl-sleept');
      const id=CL.hand[sleep.i];vlieg=document.createElement('div');vlieg.className='cl-sleepkaart';vlieg.innerHTML=CL_PORTRET[id]?`<img src="${CL_PORTRET[id]}" alt="">`:'';document.body.appendChild(vlieg);sleep.b.classList.add('sleept');arcSnd('tap');}
    if(sleep.beweeg){const pt=doelPunt(e);vliegZet(e.clientX,e.clientY,!!pt);clGhost(CL.hand[sleep.i],pt);}
  };
  CL._up=e=>{if(!sleep)return;const s=sleep;sleep=null;document.documentElement.classList.remove('cl-sleept');
    if(s.beweeg){const pt=doelPunt(e);vliegWeg();if(pt)clSpeel(s.i,pt[0],pt[1]);CL.gekozen=-1;clGhostWeg();clHand();}
    else{CL.gekozen=CL.gekozen===s.i?-1:s.i;arcSnd('tap');if(CL.gekozen<0)clGhostWeg();clHand();}};
  CL._af=()=>{if(!sleep)return;sleep=null;document.documentElement.classList.remove('cl-sleept');vliegWeg();CL.gekozen=-1;clGhostWeg();clHand();};
  document.addEventListener('pointermove',CL._mv);document.addEventListener('pointerup',CL._up);document.addEventListener('pointercancel',CL._af);
  if(!cv._clBound){cv._clBound=true;cv.addEventListener('pointerdown',e=>{if(CL.gekozen<0||CL.klaar||CL.mode!=='strijd')return;const pt=punt(e.clientX,e.clientY);if(!pt)return;
    if(clSpeel(CL.gekozen,pt[0],pt[1])){CL.gekozen=-1;clGhostWeg();clHand();}});}
  if(CL._key)document.removeEventListener('keydown',CL._key);
  CL._key=e=>{if(CL.mode!=='strijd'||CL.klaar)return;const k=String(e.key).toLowerCase();
    const a={a:0,b:1,c:2,d:3}[k];if(a!=null){e.preventDefault();const b=document.querySelectorAll('#cl-vraag .cl-opt')[a];if(b&&!b.disabled)b.click();return;}
    const kk={'1':0,'2':1,'3':2,'4':3}[k];if(kk!=null){CL.gekozen=CL.gekozen===kk?-1:kk;if(CL.gekozen<0)clGhostWeg();clHand();}
    if(k==='escape'){CL.gekozen=-1;clGhostWeg();clHand();}};
  document.addEventListener('keydown',CL._key);
}
function clSpeel(i,x,z){
  const id=CL.hand[i];const d=CL_KAARTEN[id];if(!d||CL.pauze||CL.klaar)return false;
  if(CL.kennis[0]<d.k){const b=document.querySelector(`#cl-kaarten [data-i="${i}"]`);arcRestart(b,'nee');arcSnd('wrong');
    clPopMid(`Nog ${Math.ceil(d.k-CL.kennis[0])} kennis nodig. Beantwoord een vraag!`);arcRestart(document.getElementById('cl-vraag'),'wijs');return false;}
  if(!clMagHier(id,0,x,z)){let a=null;if(d.t!=='spreuk'){const zz=Math.min(z,CL_RIV0-.5);a=clMagHier(id,0,x,zz)?[x,zz]:clVrijePlek(id,0,x,zz);}
    if(!a){clPopMid('Hier kun je niet inzetten');arcSnd('wrong');return false;}x=a[0];z=a[1];}
  CL.kennis[0]-=d.k;const sterk=CL.sterk;CL.sterk=false;
  // De kaart vliegt uit je hand naar de plek waar hij landt.
  try{const b=document.querySelector(`#cl-kaarten [data-i="${i}"] .cl-kaart-art`),v=document.getElementById('cl-veld').getBoundingClientRect(),p=clScherm(x,.8,z);
    if(b&&CL_PORTRET[id])arcFly(arcMid(b),{x:v.left+p[0],y:v.top+p[1]},`<img class="cl-vlieg" src="${CL_PORTRET[id]}" alt="">`,{duur:280,mid:1.1,eind:.25,boog:-24,fade:true});}catch(e){}
  clInzet(id,0,x,z,sterk);CL.gespeeld++;CL.hand[i]=CL.rij.shift();CL.rij.push(id);arcHap(10);clHand();
  if(CL.tut&&CL.tut.stap===3)setTimeout(()=>clTutVerder(),900);
  return true;
}
function clPopMid(t){const v=document.getElementById('cl-veld');if(!v)return;clPop([v.clientWidth/2,v.clientHeight*.62],t,'mid');}
function clGhost(id,pt){
  if(!pt||!id){CL.ghost=null;clRouteWeg();return;}
  const d=CL_KAARTEN[id];
  if(!CL.ghost||CL.ghost.id!==id)clZone(d.t!=='spreuk');
  const ok=CL.kennis[0]>=d.k&&(d.t==='spreuk'||clMagHier(id,0,pt[0],pt[1])||clMagHier(id,0,pt[0],Math.min(pt[1],CL_RIV0-.5)));
  let z=pt[1];if(d.t!=='spreuk'&&!clMagHier(id,0,pt[0],z))z=Math.min(z,CL_RIV0-.5);
  CL.ghost={id,x:pt[0],z,ok};
  if(d.t==='unit')clRoute(pt[0],z,d);else clRouteWeg();
}
function clZone(aan){CL.zoneAan=aan;}
// Laat zien waar een eenheid heen gaat: over de dichtstbijzijnde brug naar de toren van die kant.
function clRoute(x,z,d){
  const vij=CL.ents.filter(o=>o.team===1&&o.soort==='toren'&&!o.dood);const links=x<9;
  const doel=vij.find(o=>o.sub==='prinses'&&(o.x<9)===links)||vij.find(o=>o.sub==='koning');if(!doel){clRouteWeg();return;}
  const pts=[[x,z]];if(!d.vlieg&&z<CL_RIV0){const bx=links?CL_BRUG[0]:CL_BRUG[1];pts.push([bx,CL_RIV0-.4],[bx,CL_RIV1+.4]);}
  const dx=doel.x-pts[pts.length-1][0],dz=doel.z-pts[pts.length-1][1],l=Math.hypot(dx,dz)||1;pts.push([doel.x-dx/l*(doel.r+.3),doel.z-dz/l*(doel.r+.3)]);
  CL.route={pts,doel:{x:doel.x,z:doel.z,s:doel.sub==='koning'?1.2:.95}};
}
function clRouteWeg(){CL.route=null;}
function clGhostWeg(){clRouteWeg();CL.ghost=null;CL.zoneAan=false;}


// ── Uitleg bij het eerste potje ─────────────────────────────────────────
// Vier korte stappen met een spotlight. Het gevecht (klok en tegenstander)
// begint pas als de leerling de uitleg heeft gedaan.
function clTutStart(){CL.pauze=false;CL.tut={stap:0};CL.kennis[0]=Math.max(CL.kennis[0],5);clTutVerder();}
function clTutVerder(){
  const T0=CL.tut;if(!T0||!CL.on)return;T0.stap++;clCoachWeg();
  if(T0.stap===1)clCoach('#cl-vraag','Tik het juiste begrip','Lees de uitleg en kies het begrip dat erbij hoort. Elk goed antwoord geeft 1 kennis.',null,'boven');
  else if(T0.stap===2){CL.kennis[0]=Math.max(CL.kennis[0],6);clDockTik();clCoach('.cl-hand','Kennis betaalt je kaarten','Het gele getal op een kaart is de prijs. Kaarten die je kunt betalen, lichten op. Je balk hieronder vult zich ook vanzelf.','Verder','boven');}
  else if(T0.stap===3)clCoach('.cl-hand','Zet een kaart in','Sleep een kaart naar jouw helft van het veld. Of tik eerst een kaart en dan een plek. De lijn laat zien waar hij heen loopt.',null,'boven');
  else if(T0.stap===4)clCoach('#cl-veld','Haal torens neer','Je troepen lopen zelf over de brug naar de dichtstbijzijnde toren. Toren neer is 1 kroon. De koningstoren is 3 kronen en meteen gewonnen. Na 3 minuten wint wie de meeste kronen heeft.','Start het gevecht','midden');
  else{const c=clStore();c.uitlegGezien=true;clSave(c);CL.tut=null;clCoachWeg();arcSnd('start');clBanner('Strijd!','Je hebt 3 minuten');}
}
function clCoach(sel,titel,tekst,knop,plek){
  const doel=document.querySelector(sel);const r=doel?doel.getBoundingClientRect():{left:innerWidth/2-100,top:innerHeight/2-50,width:200,height:100,right:innerWidth/2+100,bottom:innerHeight/2+50};
  const spot=document.createElement('div');spot.className='cl-spot';
  Object.assign(spot.style,{left:(r.left-6)+'px',top:(r.top-6)+'px',width:(r.width+12)+'px',height:(r.height+12)+'px'});
  const b=document.createElement('div');b.className='cl-coach '+(plek||'boven');b.setAttribute('role','dialog');
  b.innerHTML=`<b>${_arcEsc(titel)}</b><p>${_arcEsc(tekst)}</p>${knop?`<button class="cl-coach-k">${_arcEsc(knop)}</button>`:'<small>Probeer het maar</small>'}`;
  document.body.append(spot,b);
  const bw=Math.min(340,innerWidth-24);b.style.width=bw+'px';
  const bh=b.offsetHeight;let top=plek==='midden'?r.top+r.height/2-bh/2:r.top-bh-16;if(top<10)top=r.bottom+14;
  b.style.left=Math.max(12,Math.min(innerWidth-bw-12,r.left+r.width/2-bw/2))+'px';b.style.top=top+'px';
  if(plek==='midden')spot.classList.add('zacht');
  const k=b.querySelector('.cl-coach-k');if(k)k.onclick=()=>{arcSnd('tap');clTutVerder();};
  CL._coach=[spot,b];
}
function clCoachWeg(){(CL._coach||[]).forEach(x=>x.remove());CL._coach=null;}
// De regels, altijd op te vragen met de ?-knop (het spel staat dan stil).
function clRegels(lobby){
  if(!CL.on||(CL.klaar&&!lobby))return;const was=CL.pauze;CL.pauze=true;
  const o=document.createElement('div');o.className='cl-sheet';
  o.innerHTML=`<div class="cl-sheet-in" role="dialog" aria-label="Spelregels"><h3 class="cl-regels-h">Zo werkt Slagio Clash</h3>
    <ol class="cl-regels"><li><b>Kennis verdien je met leren</b><span>Tik het juiste begrip: +1 kennis. Je kennis loopt ook langzaam vanzelf op. In de laatste minuut gaat alles twee keer zo snel.</span></li>
    <li><b>${CL_REEKS} goed op rij</b><span>Je volgende kaart is 25% sterker (gouden ring). Wat je fout had, komt later terug.</span></li>
    <li><b>Kaarten kosten kennis</b><span>Sleep een kaart naar jouw helft. Spreuken mag je overal neerzetten. Is een vijandelijke toren gevallen, dan mag je aan die kant verder naar voren.</span></li>
    <li><b>Troepen lopen zelf</b><span>Ze gaan over de dichtstbijzijnde brug naar de dichtstbijzijnde toren, en vechten onderweg met wat ze tegenkomen.</span></li>
    <li><b>Kronen</b><span>Toren neer: 1 kroon. Koningstoren: 3 kronen en meteen gewonnen. Na 3 minuten wint wie de meeste kronen heeft; bij gelijkspel volgt een minuut verlenging, en daarna valt de toren met het minste leven.</span></li>
    <li><b>Kisten en levels</b><span>Winnen levert een kist op. Die open je met goede begrippen. Met genoeg kaarten maak je een kaart een level sterker (+10%). Hogere arena's geven nieuwe kaarten.</span></li></ol>
    <button class="arc-go" data-sluit>Verder spelen</button></div>`;
  document.getElementById('cl-veld').appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
  o.addEventListener('click',e=>{if(e.target===o||e.target.closest('[data-sluit]')){o.classList.remove('on');setTimeout(()=>o.remove(),200);CL.pauze=was;}});
}


// ── Geluid ──────────────────────────────────────────────────────────────
// Eigen geluidjes voor het gevecht (Web Audio, geen bestanden). Kort en niet te luid.
const _clFxT={};
function clFx(type){
  try{
    if(typeof _soundOn!=='undefined'&&!_soundOn)return;const ac=_slAudio();if(!ac)return;const t=ac.currentTime;
    if(_clFxT[type]&&t-_clFxT[type]<.07)return;_clFxT[type]=t;const N=_slNoise,S=_slTone;
    if(type==='inzet'){N(ac,t,.12,{freq:420,q:.7,vol:.16});S(ac,170,70,t,.18,{type:'sine',vol:.15});}
    else if(type==='zwaard'){N(ac,t,.05,{freq:3400,q:3,vol:.07});S(ac,1700,1150,t,.09,{type:'triangle',vol:.04});}
    else if(type==='dreun'){N(ac,t,.2,{freq:260,q:.6,vol:.18});S(ac,120,55,t,.22,{type:'sine',vol:.16});}
    else if(type==='pijl'){N(ac,t,.13,{freq:2600,q:1.4,vol:.045});}
    else if(type==='worp'){N(ac,t,.1,{freq:1200,q:1,vol:.04});}
    else if(type==='kanon'){N(ac,t,.32,{freq:230,q:.6,vol:.2});S(ac,110,45,t,.3,{type:'sine',vol:.16});}
    else if(type==='bliksem'){N(ac,t,.16,{freq:5200,q:.8,vol:.07});S(ac,950,280,t,.14,{type:'sawtooth',vol:.035,cut:3200});}
    else if(type==='toren'){N(ac,t,.9,{freq:180,q:.5,vol:.3});N(ac,t+.1,.7,{freq:700,q:.7,vol:.12});S(ac,90,35,t,.8,{type:'sine',vol:.2});}
    else if(type==='emote'){S(ac,660,880,t,.08,{vol:.06});S(ac,990,990,t+.08,.08,{vol:.05});}
    else if(type==='kist'){S(ac,523,523,t,.12,{vol:.08});S(ac,659,659,t+.1,.12,{vol:.08});S(ac,784,784,t+.2,.14,{vol:.08});S(ac,1046,1046,t+.32,.3,{vol:.09,harm:.3});}
    else if(type==='kaart'){N(ac,t,.05,{freq:2800,q:2,vol:.05});S(ac,700,1100,t,.07,{type:'triangle',vol:.04});}
  }catch(e){}
}

// ── Emotes ──────────────────────────────────────────────────────────────
const CL_EMO=['Goed gespeeld!','Dank je!','Oei...','Kom maar op!'];
const CL_EMO_BOT={toren:['Haha!','Mooi zo!'],verlies:['Oei...','Au!'],reactie:['Dank je!','Jij ook!','Kom maar op!']};
function clEmoMenu(){
  const v=document.getElementById('cl-veld');if(!v||CL.klaar)return;let m=document.getElementById('cl-emo-menu');
  if(m){m.remove();return;}
  m=document.createElement('div');m.id='cl-emo-menu';m.className='cl-emo-menu';
  m.innerHTML=CL_EMO.map((t,i)=>`<button data-i="${i}">${_arcEsc(t)}</button>`).join('');v.appendChild(m);
  m.onclick=e=>{const b=e.target.closest('button');if(!b)return;m.remove();clEmote(0,CL_EMO[+b.dataset.i]);
    if(Math.random()<.6)setTimeout(()=>{if(CL.on&&!CL.klaar)clEmote(1,arcPick(CL_EMO_BOT.reactie));},1200+Math.random()*1200);};
}
function clEmote(team,tekst){
  if(!CL.on||!CL.pops)return;const nu=performance.now();CL.emoLaatst=CL.emoLaatst||[0,0];if(nu-CL.emoLaatst[team]<2500)return;CL.emoLaatst[team]=nu;
  const k=CL.ents.find(e=>e.team===team&&e.sub==='koning');if(!k)return;const pt=clScherm(k.x,(k.hoogte||6)+.8,k.z);
  const b=document.createElement('div');b.className='cl-emo t'+team;b.textContent=tekst;b.style.left=pt[0]+'px';b.style.top=pt[1]+'px';CL.pops.appendChild(b);
  clFx('emote');k.juichT=CL.t;
  setTimeout(()=>b.remove(),2200);
}


// ── Kisten: openen met leren ────────────────────────────────────────────
// In Clash Royale wacht je uren op een kist. Hier open je hem door begrippen
// goed te hebben: de beloning komt uit leren, niet uit wachten.
function clKistSvg(soort){const k=CL_KIST[soort]||CL_KIST.hout;const c=k.kl;
  return `<svg class="cl-kist-svg" viewBox="0 0 64 56" aria-hidden="true"><path d="M6 24h52v26a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" fill="${c}" stroke="#3b2210" stroke-width="2.5"/><path d="M6 24c0-10 8-16 26-16s26 6 26 16z" fill="${c}" stroke="#3b2210" stroke-width="2.5" filter="brightness(1.12)"/>
    <path d="M6 30h52M6 44h52" stroke="#3b2210" stroke-width="2" opacity=".35"/><rect x="26" y="20" width="12" height="14" rx="2" fill="#fcd34d" stroke="#3b2210" stroke-width="2.2"/><circle cx="32" cy="27" r="2" fill="#3b2210"/>
    <path d="M12 10q6-4 14-5" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".45" fill="none"/></svg>`;}
function clKistOpen(i){
  const c=clStore();const kist=c.kisten[i];if(!kist)return;const K=CL_KIST[kist.soort];
  if(!clGenoegLeerstof()){clPopMid('Dit vak heeft te weinig begrippen');return;}
  CL.nr=CL.nr||0;CL.herhaal=CL.herhaal||[];CL.gebruiktB=CL.gebruiktB||new Set();CL.gebruikt=CL.gebruikt||new Set();CL.dq=CL.dq||1.6;
  const o=document.createElement('div');o.className='cl-kistscherm';
  o.innerHTML=`<button class="arc-x cl-kist-x" aria-label="Sluiten">✕</button><div class="cl-kist-groot">${clKistSvg(kist.soort)}</div><h2>${_arcEsc(K.naam)}</h2>
    <p class="cl-kist-p">Heb ${K.nodig} begrippen goed om hem te openen.</p><div class="cl-kist-bol">${Array.from({length:K.nodig},()=>'<i></i>').join('')}</div>
    <div class="cl-vraag cl-kist-vraag" id="cl-kvraag"></div>`;
  document.getElementById('cl-veld').appendChild(o);
  let goed=0;const log=[];
  const nieuw=()=>{const F=clVolgendeFlits();F.klaar=false;F.t0=performance.now();const box=o.querySelector('#cl-kvraag');
    const kop=`<div class="cl-f-kop"><span>${F.herh?'<b class="cl-f-herh">Nog een keer</b>':F.soort==='def'?'Welk begrip is dit?':F.soort==='term'?'Wat betekent':_arcEsc(F.item.ldNaam||'')}</span></div>`;
    if(F.soort==='vraag')box.innerHTML=`${kop}<div class="cl-f-v vraag">${_arcEsc(F.item.q.v)}</div><div class="cl-f-o twee">${F.o.idx.map((oi,k)=>`<button class="cl-opt" data-k="${k}"><span>${_arcEsc(F.item.q.o[oi])}</span></button>`).join('')}</div>`;
    else if(F.soort==='term')box.innerHTML=`${kop}<div class="cl-f-v term">${_arcEsc(F.item.t)}</div><div class="cl-f-o lang">${F.opties.map((x,k)=>`<button class="cl-opt" data-k="${k}"><span>${_arcEsc(x.d)}</span></button>`).join('')}</div>`;
    else box.innerHTML=`${kop}<div class="cl-f-v">${_arcEsc(F.item.d)}</div><div class="cl-f-o drie">${F.opties.map((x,k)=>`<button class="cl-opt chip" data-k="${k}"><span>${_arcEsc(x.t)}</span></button>`).join('')}</div>`;
    box.classList.remove('in');void box.offsetWidth;box.classList.add('in');
    box.querySelectorAll('.cl-opt').forEach(b=>b.onclick=()=>{if(F.klaar)return;F.klaar=true;const k=+b.dataset.k;const ok=k===F.juist;const kn=[...box.querySelectorAll('.cl-opt')];kn.forEach(x=>x.disabled=true);kn[F.juist].classList.add('goed');
      log.push({soort:F.soort,item:F.item,goed:ok,herh:F.herh,domId:F.item.domId,keuze:F.soort==='vraag'?F.o.idx[k]:null});
      if(F.soort==='vraag')arcLog(F.item,ok,F.o.idx[k],performance.now()-F.t0);else{try{logQuestion(ARC.vakId,F.item.domId,'arcade',0,ok,performance.now()-F.t0);}catch(e){}}
      if(ok){goed++;clFx('kaart');o.querySelectorAll('.cl-kist-bol i')[goed-1]?.classList.add('aan');const g=o.querySelector('.cl-kist-groot');arcRestart(g,'schud');
        if(goed>=K.nodig){setTimeout(()=>clKistBuitScherm(o,i,log),450);return;}setTimeout(nieuw,380);}
      else{b.classList.add('fout');arcSnd('wrong');if(F.soort!=='vraag')CL.herhaal.push({item:F.item,na:CL.nr+2});
        const fb=document.createElement('div');fb.className='cl-f-fb';fb.innerHTML=F.soort==='vraag'?_arcEsc(F.item.q.uh||F.item.q.o[F.item.q.c]):`<b>${_arcEsc(F.item.t)}</b>: ${_arcEsc(F.item.d)}`;box.appendChild(fb);setTimeout(nieuw,2000);}});};
  o.querySelector('.cl-kist-x').onclick=()=>{o.remove();};
  nieuw();
}
function clKistBuit(soort,arena){
  const c=clStore();const K=CL_KIST[soort];const pool=Object.keys(CL_KAARTEN).filter(id=>(CL_ARENA_KAART[id]||0)<=arena);
  const nieuw=pool.filter(id=>!c.coll[id]);const soorten=[];
  if(nieuw.length&&(soort!=='hout'||Math.random()<.5))soorten.push(arcPick(nieuw));
  for(let g=0;soorten.length<Math.min(K.soorten,pool.length)&&g<50;g++){const x=arcPick(pool);if(!soorten.includes(x))soorten.push(x);}
  const w=id=>[1,.45,.2][CL_KAARTEN[id].zeld];const tw=soorten.reduce((a,id)=>a+w(id),0);
  return soorten.map(id=>({id,n:Math.max(1,Math.round(K.kaarten*w(id)/tw))}));
}
function clKistBuitScherm(o,i,log){
  const c=clStore();const kist=c.kisten[i];if(!kist){o.remove();return;}
  const buit=clKistBuit(kist.soort,Math.max(kist.arena||0,clArena(c.bekers)));
  for(const b of buit){if(!c.coll[b.id]){c.coll[b.id]={lvl:1,n:b.n-1};b.nieuw=true;}else c.coll[b.id].n+=b.n;}
  c.kisten.splice(i,1);clSave(c);
  // Gemiste begrippen gaan naar Herhalen, net als na een potje.
  try{const sr=getSR();for(const x of log){if(x.goed||x.soort==='vraag')continue;const k=srKey(ARC.vakId,x.item.domId,x.item.t);sr[k]=Object.assign({vakId:ARC.vakId,domId:x.item.domId,term:x.item.t},sm2(sr[k]||{},0));}saveSR(sr);}catch(e){}
  try{trackEvent('minigame',{game:'clash_kist',soort:kist.soort,goed:log.filter(x=>x.goed).length,vragen:log.length,vak_id:ARC.vakId});}catch(e){}
  clFx('kist');arcHap([30,20,60]);
  let n=0;const toon=()=>{
    if(n>=buit.length){o.innerHTML=`<h2>Buit</h2><div class="cl-buit">${buit.map(b=>`<div class="cl-kaart">${clKaartHtml(b.id,{coll:clStore().coll})}<b class="cl-buit-n">+${b.n}</b></div>`).join('')}</div><button class="arc-go" data-klaar>Verder</button>`;
      o.querySelector('[data-klaar]').onclick=()=>{o.remove();clLobby();};return;}
    const b=buit[n++];const cc=clStore().coll[b.id];const nodig=CL_UPGRADE[cc.lvl]||1;
    o.innerHTML=`<div class="cl-buit-een">${b.nieuw?'<div class="cl-buit-nieuw">Nieuwe kaart!</div>':''}<div class="cl-kaart groot">${clKaartHtml(b.id)}</div><div class="cl-buit-naam">${_arcEsc(CL_KAARTEN[b.id].naam)}</div><div class="cl-buit-plus">+${b.n}</div>
      <div class="cl-voortg groot${cc.n>=nodig?' kan':''}"><i style="width:${Math.min(100,cc.n/nodig*100).toFixed(0)}%"></i><b>${cc.n}/${nodig}</b></div><small>Tik om verder te gaan</small></div>`;
    clFx('kaart');try{const m=arcMid(o.querySelector('.cl-kaart.groot'));arcBurst(m.x,m.y,{n:b.nieuw?30:14,afstand:140,maat:8});}catch(e){}
    o.onclick=()=>{o.onclick=null;toon();};};
  o.classList.add('open');setTimeout(toon,500);
}
