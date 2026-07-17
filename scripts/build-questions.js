#!/usr/bin/env node
/**
 * build-questions.js — de vragen-engine.
 *
 * Leidt term-gebaseerde quizvragen + flashcard-begrippen af uit de rijke
 * samenvattingen (SAM_RICH), zodat er geen handmatige vragen meer geschreven
 * hoeven te worden. Per domein:
 *   1. begrippen = bestaande curated (d.begrippen) OF automatisch geëxtraheerd
 *      uit de samenvatting (definitie-kaarten, term|definitie-tabelrijen,
 *      sleutelbegrip-lijsten).
 *   2. genereer gebalanceerde meerkeuzevragen op 3 moeilijkheidsniveaus
 *      (expliciete d=1/2/3) met goede uitleg → vervang de eerder gegenereerde.
 *   3. verwijder lengte-weggevers en rekenvragen uit de snelle quiz (floor 10).
 *
 *   node scripts/build-questions.js
 */
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const R = f => path.join(ROOT, f);

// ── laad data + samenvattingen ──
function load(file, name){const g={};new Function('g', fs.readFileSync(R(file),'utf8')+`\ng.V=${name};`)(g);return g.V;}
const SAM = {};
new Function('SAM_RICH', fs.readFileSync(R('sam-havo.js'),'utf8'))(SAM);
new Function('SAM_RICH', fs.readFileSync(R('sam-vwo.js'),'utf8'))(SAM);

// ── extractor ──
const ENT={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&#215;':'×','&#183;':'·','&nbsp;':' '};
const decode=s=>String(s).replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(+n)).replace(/&[a-z#0-9]+;/gi,e=>ENT[e]||e);
const strip=h=>decode(String(h).replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim();
const STOP=new Set(['ja','nee','onderwerp','begrip','kern','regel','vorm','functie','type','situatie','verband','as','punt','aspect','techniek','vraag','stap','soort','voorbeeld','informeel','formeel','wil je','naam onbekend','naam bekend']);
function okPair(t,d){
  if(t.length<3||t.length>44||d.length<12||d.length>130)return false;
  if(STOP.has(t.toLowerCase()))return false;
  if(/^\d/.test(t)||!/[a-zA-Zé]/.test(t))return false;
  if(/[=×·√Δ∫∑]|\b\d+\s*[+\-*/^]\s*\d/.test(d))return false;            // reken/formule → weg
  if(/^[a-z]/.test(t)&&t.split(' ').length>1)return false;               // "gelijke stappen erbij" → weg
  return true;
}
function extract(html){
  const pairs=[],seen=new Set();
  const add=(t,d)=>{t=strip(t);d=strip(d);if(!okPair(t,d))return;const k=t.toLowerCase();if(seen.has(k))return;seen.add(k);pairs.push({t,d});};
  let m,re;
  re=/<div class="sam-definitie-term">(.*?)<\/div><div class="sam-definitie-body">(.*?)<\/div>/g;while(m=re.exec(html))add(m[1],m[2]);
  re=/<tr><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/g;while(m=re.exec(html))add(m[1],m[2]);
  re=/<li><strong>(.*?)<\/strong>\s*[:—-]\s*(.*?)<\/li>/g;while(m=re.exec(html))add(m[1],m[2]);
  return pairs;
}

// ── uitleg-contrasten (verrijken de u van gegenereerde vragen) ──
const UITLEG={
  'Mitose':'Let op het verschil met meiose: mitose geeft 2 identieke cellen, meiose 4 met het halve chromosoomaantal.',
  'Meiose':'Anders dan mitose: meiose halveert het chromosoomaantal en zorgt voor variatie.',
  'Oxidatie':'Ezelsbruggetje OIL RIG: Oxidation Is Loss van elektronen.','Reductie':'Ezelsbruggetje OIL RIG: Reduction Is Gain van elektronen.',
  'Exotherm':'Tegenover endotherm: exotherm geeft warmte áf (ΔH < 0).','Endotherm':'Tegenover exotherm: endotherm neemt warmte óp (ΔH > 0).',
  'Betrouwbaarheid':'Betrouwbaar ≠ valide: consistent meten is niet hetzelfde als het júiste meten.','Validiteit':'Valide ≠ betrouwbaar: valide = het juiste meten, betrouwbaar = herhaalbaar.',
  'Mitigatie':'Tegenover adaptatie: mitigatie pakt de oorzaak aan, adaptatie de gevolgen.','Adaptatie':'Tegenover mitigatie: adaptatie pakt de gevolgen aan.',
  'Pushfactor':'Tegenover pull: push duwt weg uit het herkomstgebied.','Pullfactor':'Tegenover push: pull trekt aan naar een gebied.',
  'Primaire bron':'Anders dan een secundaire bron: een primaire bron stamt uit de tijd zelf.','Secundaire bron':'Anders dan een primaire bron: later gemaakt over die tijd.',
  'Correlatie':'Correlatie is geen causaliteit: samen bewegen ≠ elkaar veroorzaken.',
  'Constante kosten':'Tegenover variabele kosten: constante kosten veranderen niet met de productie.','Variabele kosten':'Tegenover constante kosten: variabele kosten bewegen mee met de productie.',
  'Metafoor':'Anders dan een vergelijking: een metafoor gebruikt géén "als/zoals".','Vergelijking':'Anders dan een metafoor: een vergelijking gebruikt "als" of "zoals".',
  'Simile':'Anders dan een metaphor: a simile uses "like"/"as".','Metaphor':'Anders dan een simile: a metaphor omits "like"/"as".',
};

// ── generator ──
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function sample(pool,n,excl){const out=[];for(const x of shuffle(pool)){if(out.length>=n)break;if(excl.includes(x)||out.includes(x))continue;out.push(x);}return out;}
function genQ(pairs, vakPool){
  const vakDefs=vakPool.map(p=>p.d), vakTerms=vakPool.map(p=>p.t), domTerms=pairs.map(p=>p.t), qs=[];
  pairs.forEach(({t,d},i)=>{
    const ext=UITLEG[t]?' '+UITLEG[t]:''; const mod=i%3;
    if(mod===0){const dis=sample(vakDefs,3,[d]);if(dis.length<3)return;const o=shuffle([d,...dis]);qs.push({v:`Wat betekent «${t}»?`,o,c:o.indexOf(d),u:`«${t}» betekent: ${d}.${ext}`,d:1});}
    else if(mod===1){const dis=sample(vakTerms,3,[t]);if(dis.length<3)return;const o=shuffle([t,...dis]);qs.push({v:`Welk begrip hoort bij deze omschrijving: "${d}"?`,o,c:o.indexOf(t),u:`Het juiste begrip is «${t}»: ${d}.${ext}`,d:2});}
    else{let dis=sample(domTerms,3,[t]),dd=3;if(dis.length<3){dis=sample(vakTerms,3,[t]);dd=2;}if(dis.length<3)return;const o=shuffle([t,...dis]);qs.push({v:`Welk begrip hoort bij deze omschrijving: "${d}"?`,o,c:o.indexOf(t),u:`Het juiste begrip is «${t}»: ${d}.${ext}`,d:dd});}
  });
  return qs;
}
const isGen=v=>/^Wat betekent «|^Welk begrip hoort bij/.test(v||'');

// ── kwaliteitsfilter (weggevers/reken) ──
function lenGiveaway(o,c){const L=o.map(x=>String(x).length),cor=L[c],oth=L.filter((_,i)=>i!==c).sort((a,b)=>b-a);if(cor>=oth[0]*1.5&&cor-oth[0]>=12)return 2;if(cor<=oth[oth.length-1]*0.4&&oth[0]-cor>=20)return 1;return 0;}
function calcish(v,o){if(/\bbereken\b|\bhoeveel\s+(gram|mol|liter|meter|joule|newton|procent|%)/i.test(v))return 3;if(/\d+\s*[×x*/^]\s*\d+|\d+[.,]\d+\s*[×x*/+\-]/.test(v))return 3;const n=(o||[]).filter(x=>/\d/.test(String(x))&&/[.,]\d|\d{3,}|10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹^]|[×x*/]/.test(String(x))).length;return n>=3?2:0;}
function yearGiveaway(v,o){return /\b(1[5-9]\d\d|20\d\d)\b/.test(v)&&(o||[]).some(x=>/\b(1[5-9]\d\d|20\d\d)\b/.test(String(x)))&&!/in welk jaar|welk jaartal/i.test(v);}
function badness(q){if(!q.o||!q.o.length||typeof q.c!=='number')return 0;let b=0;const c=calcish(q.v,q.o);if(c)b+=c*10;const l=lenGiveaway(q.o,q.c);if(l)b+=l*3;if(yearGiveaway(q.v,q.o))b+=5;if((q.v||'').length>140)b+=1;return b;}
const FLOOR=10;

// ── run ──
function run(file, name, niveau, pretty){
  const V=load(file,name);
  let curatedDoms=0,extractedDoms=0,gen=0,removed=0; const low=[], noQ=[];
  for(const vak of V){
    // 1. begrippen per domein bepalen (curated behouden, anders extractie)
    for(const d of vak.domeinen){
      if(!(d.begrippen&&d.begrippen.length)){
        const key=niveau+'_'+vak.id+'_'+d.id;
        const ex=extract(SAM[key]||d.sam||'');
        if(ex.length>=4){d.begrippen=ex;extractedDoms++;}
      } else curatedDoms++;
    }
    // 2. vak-brede pool voor afleiders
    const vakPool=[]; vak.domeinen.forEach(d=>(d.begrippen||[]).forEach(b=>vakPool.push(b)));
    // 3. genereer + vervang oude gegenereerde
    for(const d of vak.domeinen){
      d.sv=(d.sv||[]).filter(q=>!isGen(q.v));
      if(d.begrippen&&d.begrippen.length>=4){
        const seen=new Set(d.sv.map(q=>q.v));
        for(const q of genQ(d.begrippen,vakPool)){if(seen.has(q.v))continue;seen.add(q.v);d.sv.push(q);gen++;}
      }
    }
  }
  // 4. opschonen weggevers/reken (met floor)
  for(const vak of V)for(const d of vak.domeinen){
    const sv=d.sv||[];if(!sv.length){noQ.push(vak.id+'/'+d.id);continue;}
    const keep=[],flagged=[];
    for(const q of sv){if(!isGen(q.v)&&badness(q)>0)flagged.push(q);else keep.push(q);}
    if(flagged.length){flagged.sort((a,b)=>badness(a)-badness(b));while(keep.length<FLOOR&&flagged.length)keep.push(flagged.shift());removed+=flagged.length;d.sv=keep;}
    if(d.sv.length<FLOOR)low.push(vak.id+'/'+d.id+'='+d.sv.length);
  }
  fs.writeFileSync(R(file), `var ${name} = `+(pretty?JSON.stringify(V,null,1):JSON.stringify(V))+';');
  console.log(`\n${file}: ${curatedDoms} curated + ${extractedDoms} geëxtraheerde domeinen | +${gen} term-MC | -${removed} weggevers/reken`);
  if(low.length)console.log('  onder floor '+FLOOR+':', low.join(', '));
  if(noQ.length)console.log('  ZONDER vragen:', noQ.join(', '));
}
run('data-havo.js','VAKKEN','havo',true);
run('data-vwo.js','VAKKEN_VWO','vwo',false);
console.log('\nKlaar.');
