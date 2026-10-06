// ═══════════════════════════════════════════════════════════
//  SLAGIO - EXAMENZOEKMACHINE (in-app)
//  Client-side full-text zoek over examens, begrippen, uitleg & oefenvragen.
//  Index wordt lazy opgebouwd bij eerste opening; ce_data.js lazy geladen.
// ═══════════════════════════════════════════════════════════
let _zkPassages=[],_zkAntwT=0,_zkVast='';
let _zoekIndex=null,_zoekBuilt=false,_zoekCeLoaded=(typeof CE_OE!=='undefined');
const _zoekState={all:[],filter:'all',niv:'all',vak:'all',shown:0,toks:[]};
const _ZK_PAGE=25;

// ── Normalisatie: kleine letters, diacrieten weg, sub/superscript → cijfer ──
const _ZK_SUB='₀₁₂₃₄₅₆₇₈₉',_ZK_SUP='⁰¹²³⁴⁵⁶⁷⁸⁹';
function _zkNorm(s){
  return (s==null?'':String(s)).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[₀-₉]/g,c=>String(_ZK_SUB.indexOf(c)))
    .replace(/[⁰¹²³⁴-⁹]/g,c=>{const i=_ZK_SUP.indexOf(c);return i>=0?String(i):' ';})
    .replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
function _zkStrip(s){return (s==null?'':String(s)).replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ');}
function _zkEsc(s){return (s==null?'':String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function _zkClip(s,n){s=s||'';return s.length>n?s.slice(0,n).replace(/\s\S*$/,'')+'…':s;}
function _zkHl(text,toks){
  let safe=_zkEsc(text);
  (toks||[]).forEach(t=>{ if(t.length<2)return;
    const re=new RegExp('('+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig');
    safe=safe.replace(re,'<mark>$1</mark>'); });
  return safe;
}

const _ZK_TYPES={
  examen:{label:'Examenvragen',cls:'zk-b-exam',col:'var(--or)'},
  begrip:{label:'Begrippen',cls:'zk-b-begrip',col:'#38bdf8'},
  uitleg:{label:'Uitleg & domeinen',cls:'zk-b-uitleg',col:'#a78bfa'},
  oefen:{label:'Oefenvragen',cls:'zk-b-oefen',col:'#22c55e'}
};

// ── Index opbouwen ──
function _zkIndexVakken(vakken,niveau,out){
  (vakken||[]).forEach(v=>{
    (v.domeinen||[]).forEach(d=>{
      const samText=_zkStrip(d.sam||''),onderw=(d.onderwerpen||[]).join(' · ');
      out.push({type:'uitleg',vakId:v.id,domId:d.id,vak:v.naam,niveau,
        title:'Domein '+d.id+': '+d.naam,ctx:d.beschrijving||samText.slice(0,180),
        norm:_zkNorm([v.naam,d.naam,d.beschrijving,onderw,samText].join(' '))});
      (d.onderwerpen||[]).forEach(o=>{
        out.push({type:'begrip',vakId:v.id,domId:d.id,vak:v.naam,niveau,dom:d.naam,
          title:o,norm:_zkNorm(o+' '+v.naam+' '+d.naam)});
      });
      // Begrippen met hun definitie (domein + leerdoel-modules): het directe antwoord op "wat is X?"
      (d.begrippen||[]).forEach(b=>{ if(!b||!b.t)return;
        out.push({type:'begrip',vakId:v.id,domId:d.id,vak:v.naam,niveau,dom:d.naam,title:b.t,answer:b.d,def:1,
          norm:_zkNorm(b.t+' '+(b.d||''))}); });
      (d.leerdoelen||[]).forEach(l=>{
        out.push({type:'uitleg',vakId:v.id,domId:l.id,vak:v.naam,niveau,dom:d.naam,ld:1,
          title:l.naam,ctx:l.beschrijving||'',norm:_zkNorm([v.naam,l.naam,l.beschrijving,(l.onderwerpen||[]).join(' ')].join(' '))});
        (l.begrippen||[]).forEach(b=>{ if(!b||!b.t)return;
          out.push({type:'begrip',vakId:v.id,domId:l.id,vak:v.naam,niveau,dom:l.naam,title:b.t,answer:b.d,def:1,ld:1,
            norm:_zkNorm(b.t+' '+(b.d||''))}); });
        (l.sv||[]).forEach(qq=>{const ans=(qq.o&&typeof qq.c==='number')?qq.o[qq.c]:qq.u;
          out.push({type:'oefen',vakId:v.id,domId:l.id,vak:v.naam,niveau,dom:l.naam,title:qq.v,answer:ans,norm:_zkNorm((qq.v||'')+' '+(ans||''))}); });
      });
      ['sv','oe'].forEach(k=>{
        (d[k]||[]).forEach(qq=>{
          const ans=(qq.a&&typeof qq.c==='number')?qq.a[qq.c]:(qq.u||qq.a);
          out.push({type:'oefen',vakId:v.id,domId:d.id,vak:v.naam,niveau,dom:d.naam,
            title:qq.v,answer:ans,norm:_zkNorm((qq.v||'')+' '+(ans||''))});
        });
      });
    });
  });
}
function buildZoekIndex(){
  if(_zoekBuilt)return;
  const out=[],vaknaam={};
  const havo=(typeof VAKKEN!=='undefined')?VAKKEN:[], vwo=(typeof VAKKEN_VWO!=='undefined')?VAKKEN_VWO:[];
  havo.forEach(v=>vaknaam[v.id]={naam:v.naam,niveau:'havo'});
  vwo.forEach(v=>vaknaam[v.id]={naam:v.naam,niveau:'vwo'});
  _zkIndexVakken(havo,'havo',out);
  _zkIndexVakken(vwo,'vwo',out);
  if(typeof VAKKEN_VMBO!=='undefined'){VAKKEN_VMBO.forEach(v=>vaknaam[v.id]=vaknaam[v.id]||{naam:v.naam,niveau:'vmbo'});_zkIndexVakken(VAKKEN_VMBO,'vmbo',out);}
  // Alinea's uit de rijke samenvattingen: hier komt de uitleg in de antwoordkaart vandaan.
  _zkPassages=[]; _zkTitels=null;
  if(typeof SAM_RICH!=='undefined'){
    const naamVan={};
    [['havo',havo],['vwo',vwo],['vmbo',(typeof VAKKEN_VMBO!=='undefined')?VAKKEN_VMBO:[]]].forEach(([n,V])=>V.forEach(v=>(v.domeinen||[]).forEach(d=>{
      naamVan[n+'_'+v.id+'_'+d.id]={niveau:n,vakId:v.id,vak:v.naam,domId:d.id,dom:d.naam};
      (d.leerdoelen||[]).forEach(l=>naamVan[n+'_'+v.id+'_'+l.id]={niveau:n,vakId:v.id,vak:v.naam,domId:l.id,dom:l.naam,ld:1});
    })));
    Object.keys(SAM_RICH).forEach(k=>{
      const bron=naamVan[k]; if(!bron)return;
      const html=String(SAM_RICH[k]||'').replace(/<svg[\s\S]*?<\/svg>/g,' ').replace(/<div class="sam-clip-caps">[\s\S]*?<\/div>/g,' ');
      (html.match(/<p[^>]*>[\s\S]*?<\/p>|<td>[\s\S]*?<\/td>\s*<td>[\s\S]*?<\/td>|<div class="sam-(?:tip|onthoud|intro)"[^>]*>[\s\S]*?<\/div>/g)||[]).forEach(blok=>{
        const t=_zkStrip(blok).replace(/\s+/g,' ').replace(/\s+([,.;:!?)])/g,'$1').replace(/\(\s+/g,'(').trim(); if(t.length<40)return;
        _zkPassages.push(Object.assign({text:t,norm:_zkNorm(t),tabel:blok.slice(0,3)==='<td'},bron));
      });
    });
  }
  if(typeof EXAMENS!=='undefined'){
    Object.keys(EXAMENS).forEach(vid=>{
      (EXAMENS[vid]||[]).forEach(ex=>{
        (ex.vragen||[]).forEach(q=>{
          out.push({type:'examen',vakId:vid,vak:ex.titel||(vaknaam[vid]&&vaknaam[vid].naam)||vid,
            niveau:ex.niveau,jaar:ex.jaar,tijdvak:ex.tijdvak,punten:q.punten,exam:1,
            title:q.vraag,ctx:q.context,answer:q.antwoord,
            norm:_zkNorm((q.context||'')+' '+(q.vraag||'')+' '+(q.antwoord||''))});
        });
      });
    });
  }
  // Slagio-proefexamens: elke vraag los vindbaar, met de context van de opgave
  if(typeof SLAGIO_EXAMENS!=='undefined'){
    Object.keys(SLAGIO_EXAMENS).forEach(niv=>{
      Object.keys(SLAGIO_EXAMENS[niv]||{}).forEach(vid=>{
        const ex=SLAGIO_EXAMENS[niv][vid];
        (ex.vragen||[]).forEach(q=>{
          const op=(ex.opgaven||[]).find(o=>o.nr===q.opgave)||{};
          const ans=q.type==='mc'&&q.opties?(q.opties[q.correct]+(q.uitleg?'. '+q.uitleg:'')):q.antwoord;
          out.push({type:'examen',vakId:vid,vak:(vaknaam[vid]&&vaknaam[vid].naam)||ex.titel||vid,
            niveau:niv,punten:q.punten,proef:1,peNr:q.nr,
            title:q.vraag,ctx:op.context,answer:ans,
            norm:_zkNorm((op.titel||'')+' '+(q.vraag||'')+' '+(ans||'')+' '+(op.context||'').slice(0,300))});
        });
      });
    });
  }
  if(typeof CE_OE!=='undefined'){
    Object.keys(CE_OE).forEach(vid=>{
      (CE_OE[vid]||[]).forEach(q=>{
        out.push({type:'examen',vakId:vid,vak:(vaknaam[vid]&&vaknaam[vid].naam)||vid,
          niveau:(vaknaam[vid]&&vaknaam[vid].niveau),jaar:q.jaar,tijdvak:q.tijdvak,oud:1,
          title:q.v,answer:q.u,norm:_zkNorm((q.v||'')+' '+(q.u||''))});
      });
    });
  }
  _zoekIndex=out;_zoekBuilt=true;
}

// ── Zoek doorzoekt beide niveaus + oud-examens: laad alles lazy vóór de index ──
// Eerst je eigen niveau (dan heb je meteen resultaten), daarna stil de rest:
// het andere niveau en de oude examens; de index wordt dan opnieuw opgebouwd.
let _zkRestBezig=false;
function _zkEnsureData(cb){
  const niv=(typeof APP_LEVEL!=='undefined'&&APP_LEVEL==='vwo')?'vwo':'havo', ander=niv==='vwo'?'havo':'vwo';
  const eav=(typeof ensureAllVakData==='function');
  function loadCe(next){
    if(_zoekCeLoaded||typeof CE_OE!=='undefined'){next();return;}
    const s=document.createElement('script');s.src='/ce_data.js';
    s.onload=()=>{_zoekCeLoaded=true;next();};
    s.onerror=()=>{_zoekCeLoaded=true;next();}; // zonder oud-examens is prima
    document.head.appendChild(s);
  }
  function sam(next){
    if(typeof ensureSamData==='function'&&typeof samReady==='function'&&!samReady(niv))ensureSamData(niv,next); else next();
  }
  function rest(){
    if(_zkRestBezig)return; _zkRestBezig=true;
    const klaar=()=>{
      _zoekBuilt=false; buildZoekIndex();
      try{const q=document.getElementById('zoek-q'),sc=document.getElementById('sc-zoek');
        if(q&&q.value&&sc&&sc.classList.contains('on')&&!_zkVast)_zkSearch(q.value);}catch(e){}
    };
    const na=()=>loadCe(klaar);
    if(eav)ensureAllVakData(ander,na); else na();
  }
  const eerst=next=>{ if(eav)ensureAllVakData(niv,next); else next(); };
  eerst(()=>sam(()=>{ cb(); setTimeout(rest,400); }));
}

// ── Zoeken ──
function _zkRun(query){
  const qn=_zkNorm(query); if(!qn)return[];
  const toks=qn.split(' ').filter(Boolean),out=[];
  for(let i=0;i<_zoekIndex.length;i++){
    const e=_zoekIndex[i],hay=e.norm; let score=0,all=true;
    if(hay.indexOf(qn)>=0) score+=200;
    for(let t=0;t<toks.length;t++){
      const pos=hay.indexOf(toks[t]);
      if(pos>=0){score+=12; if(pos<40)score+=6;} else all=false;
    }
    if(!all&&score<200) continue;
    if(e.type==='begrip') score+=8;
    out.push({e,s:score});
  }
  out.sort((a,b)=>b.s-a.s);
  return out.map(x=>x.e);
}

// ── Navigatie vanuit een resultaat ──
function zoekGoto(niveau,vakId,kind,domId){
  try{ const _q=document.getElementById('zoek-q'); if(_q)_zkSaveRecent(_q.value); }catch(e){}
  try{
    if(niveau && typeof APP_LEVEL!=='undefined' && niveau!==APP_LEVEL){
      APP_LEVEL=niveau; localStorage.setItem('examenapp_level',niveau);
      if(window.applyLevelTheme)applyLevelTheme(niveau);
      if(window.updateLevelChip)updateLevelChip();
      if(window.buildGrid)buildGrid();
    }
    if(window.openVak)openVak(vakId);
    if(kind==='proef'&&domId){ setTimeout(()=>{try{ebProefOpen(vakId,+domId,'sc-detail');}catch(e){}},70); }
    else if(kind==='quiz'&&domId){ setTimeout(()=>{try{openQmode(domId);}catch(e){}},70); }
    else if(kind==='uitleg'&&domId){ setTimeout(()=>{try{openDomein(domId);}catch(e){}},70); }
    else if(domId){ setTimeout(()=>{const el=document.querySelector('#dlist [data-domein-id="'+domId+'"]');if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.classList.add('dc2-flash');setTimeout(()=>el.classList.remove('dc2-flash'),1400);}},260); }
  }catch(err){ if(window.showToast)showToast('Kon niet openen - probeer opnieuw'); }
}

// ── Render ──
function _zkFiltered(){
  return _zoekState.all.filter(e=>{
    if(_zoekState.filter!=='all'&&e.type!==_zoekState.filter)return false;
    if(_zoekState.niv!=='all'&&e.niveau!==_zoekState.niv)return false;
    if(_zoekState.vak!=='all'&&e.vakId!==_zoekState.vak)return false;
    return true;
  });
}
function _zkCard(e){
  const t=_ZK_TYPES[e.type],niv=e.niveau?e.niveau.toUpperCase():'',toks=_zoekState.toks;
  const meta=[];
  if(e.vak)meta.push(_zkEsc(e.vak));
  if(niv)meta.push(niv);
  if(e.dom&&e.type!=='uitleg')meta.push(_zkEsc(e.dom));
  if(e.jaar)meta.push('CE '+e.jaar+(e.tijdvak?' · TV'+e.tijdvak:''));
  if(e.proef)meta.push('Slagio-proefexamen');
  if(e.punten)meta.push(e.punten+' pnt');
  const metaHtml=meta.map((m,i)=>(i?'<span class="zk-sep">·</span>':'')+'<span>'+m+'</span>').join(' ');

  let body='';
  if(e.type==='begrip'){ body='<div class="zk-begrip">'+_zkHl(e.title,toks)+'</div>'; }
  else{
    if(e.ctx)body+='<div class="zk-ctx">'+_zkHl(_zkClip(e.ctx,200),toks)+'</div>';
    body+='<div class="zk-q">'+_zkHl(_zkClip(e.title,300),toks)+'</div>';
  }
  let ans='';
  if(e.answer){
    const aid='zka'+(Math.random()*1e9|0);
    ans='<div class="zk-ans" id="'+aid+'"><button class="zk-ans-t" data-t="'+aid+'">'
      +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>'
      +(e.type==='examen'?'Toon antwoord':'Toon uitwerking')+'</button>'
      +'<div class="zk-ans-b">'+_zkHl(_zkClip(_zkStrip(e.answer),600),toks)+'</div></div>';
  }
  // Actie-knop
  const g="zoekGoto('"+(e.niveau||'')+"','"+e.vakId+"',";
  let act='';
  if(e.proef){
    act='<button class="zk-go" onclick="'+g+"'proef','"+e.peNr+"')\">Maak deze vraag"+_ZK_ARROW+'</button>';
  }else if(e.type==='examen'){
    act='<button class="zk-go" onclick="'+g+"'vak')\">Naar dit vak"+_ZK_ARROW+'</button>';
  }else if(e.domId){
    act='<button class="zk-go" onclick="'+g+"'quiz','"+e.domId+"')\">Oefen dit domein"+_ZK_ARROW+'</button>';
  }
  return '<div class="zk-card"><div class="zk-card-top">'
    +'<span class="zk-badge '+t.cls+'"><span class="zk-dot" style="background:'+t.col+'"></span>'+t.label.split(' ')[0]+(e.oud?' (oud)':'')+'</span>'
    +'<span class="zk-meta">'+metaHtml+'</span></div>'+body
    +'<div class="zk-actions">'+ans+'<span class="zk-spacer"></span>'+act+'</div></div>';
}
const _ZK_ARROW='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function _zkRenderList(reset){
  const el=document.getElementById('zoek-res'),more=document.getElementById('zoek-more');
  const list=_zkFiltered();
  if(reset){_zoekState.shown=0;el.innerHTML='';}
  const slice=list.slice(_zoekState.shown,_zoekState.shown+_ZK_PAGE);
  el.insertAdjacentHTML('beforeend',slice.map(_zkCard).join(''));
  _zoekState.shown+=slice.length;
  more.innerHTML=_zoekState.shown<list.length?'<button class="zk-more-btn" id="zk-more-btn">Toon meer ('+(list.length-_zoekState.shown)+')</button>':'';
  const mb=document.getElementById('zk-more-btn');
  if(mb)mb.onclick=()=>_zkRenderList(false);
}
function _zkRenderTabs(){
  const el=document.getElementById('zoek-tabs');
  const base=_zoekState.all.filter(e=>{
    if(_zoekState.niv!=='all'&&e.niveau!==_zoekState.niv)return false;
    if(_zoekState.vak!=='all'&&e.vakId!==_zoekState.vak)return false;
    return true;
  });
  const counts={all:base.length,examen:0,begrip:0,uitleg:0,oefen:0};
  base.forEach(e=>counts[e.type]++);
  const order=['all','examen','begrip','uitleg','oefen'];
  el.innerHTML=order.map(k=>{
    if(k!=='all'&&!counts[k])return'';
    const lbl=k==='all'?'Alles':_ZK_TYPES[k].label;
    const dot=k==='all'?'':'<span class="zk-dot" style="background:'+_ZK_TYPES[k].col+'"></span>';
    return '<button class="zk-tab'+(_zoekState.filter===k?' on':'')+'" data-f="'+k+'">'+dot+lbl+'<span class="zk-cnt">'+counts[k]+'</span></button>';
  }).join('');
  el.style.display=base.length?'flex':'none';
  [].forEach.call(el.querySelectorAll('.zk-tab'),b=>b.onclick=()=>{_zoekState.filter=b.getAttribute('data-f');_zkRenderTabs();_zkRenderList(true);});
}
function _zkApplyFilters(){ _zoekState.filter='all'; _zkRenderTabs(); _zkStats(); _zkRenderList(true); }
function _zkStats(){
  const el=document.getElementById('zoek-stats'),n=_zkFiltered().length;
  el.innerHTML=_zoekState.all.length?('<b>'+n.toLocaleString('nl')+'</b> resultaten'):'';
}
// ── Ga naar: onderdelen van de app zelf vinden ("foutenboek", "cijfer berekenen",
// "duits examen") zodat je niet hoeft te weten achter welke knop iets zit. ──
const _ZK_APP=[
  ['Examens','📚',['examen','examens','oud examen','oude examens','proefexamen','correctievoorschrift','examenvragen','pdf'],"openExamenBieb(%V)"],
  ['Foutenboek','📕',['foutenboek','fouten','foute antwoorden','mijn fouten'],"openFoutenboek()"],
  ['Herhalen','🔁',['herhalen','herhaal','flashcard','flashcards','kaartjes','stampen'],"openHerhalen()"],
  ['Examenrooster','🗓️',['rooster','examenrooster','examendata','wanneer is','datum examen'],"show('sc-schedule');renderSchedule()"],
  ['Studieplan','📅',['studieplan','planning','plannen','plan'],"show('sc-studieplan');renderStudieplan()"],
  ['Cijfers','🧮',['cijfer','cijfers','berekenen','eindcijfer','gemiddelde','se cijfer','wat moet ik halen'],"show('sc-calc');setTimeout(prefillCalcFromSaved,50)"],
  ['Voortgang','📊',['voortgang','rapport','statistieken','hoe sta ik ervoor'],"openRapport()"],
  ['Examentrainer','🎯',['examentrainer','trainer','verwacht cijfer','voorspelling','slagio plus'],"openExamentrainer()"],
  ['Arcade','🎮',['arcade','spel','spellen','spelletjes','clash','kingdom','game','games'],"arcadeOpen()"],
  ['Weekwedstrijd','🛡️',['divisie','wedstrijd','weekwedstrijd','competitie','league'],"openLeague()"],
  ['Topscores','🏆',['topscores','leaderboard','ranglijst','top 10'],"show('sc-leaderboard')"],
  ['Mijn groep','👥',['groep','klas','vrienden','klasgenoten'],"show('sc-groep');renderGroepScreen()"],
  ['Winkel','🛒',['winkel','munten','shop','thema','themas','streak freeze'],"openShop()"],
  ['Profiel','👤',['profiel','account','inloggen','log in','instellingen'],"openProfiel()"],
  ['Vonk','✨',['vonk','chat','ai','vraag aan vonk','uitleg vragen'],"openVonkChat()"],
  ['Nachtmodus','🌙',['nachtmodus','donker','dark mode','donkere modus'],"toggleDark()"]
];
function _zkApp(query){
  const q=_zkNorm(query).trim(); if(q.length<3)return [];
  const toks=q.split(/\s+/);
  const past=w=>{w=_zkNorm(w);return q===w||(' '+q+' ').includes(' '+w+' ')||(q.length>=3&&w.startsWith(q));};
  // vak in de vraag? ("duits examen", "biologie")
  let vak=null; try{(getVK()||[]).forEach(v=>{const n=_zkNorm(v.naam);if(!vak&&toks.some(t=>t.length>=4&&(n.startsWith(t)||n.split(' ').includes(t))))vak=v;});}catch(e){}
  const uit=[];
  _ZK_APP.forEach(([naam,ic,woorden,go])=>{
    if(!woorden.some(past))return;
    const isEx=go.indexOf('%V')>=0;
    uit.push({naam:isEx&&vak?naam+' '+vak.naam:naam,ic,go:go.replace('%V',isEx&&vak?"'"+vak.id+"'":'')});
  });
  if(vak&&!uit.some(a=>a.go.indexOf("'"+vak.id+"'")>=0))uit.push({naam:vak.naam,ic:'📘',go:"openVak('"+vak.id+"')"});
  return uit.slice(0,4);
}
function _zkAppHtml(query){
  const a=_zkApp(query); if(!a.length)return '';
  return '<div class="zk-app"><span class="zk-app-l">Ga naar</span>'+a.map(x=>'<button class="zk-app-b" onclick="_zkSaveRecent(document.getElementById(\'zoek-q\').value);'+x.go.replace(/"/g,'&quot;')+'"><span class="zk-app-ic no-ico">'+x.ic+'</span>'+_zkEsc(x.naam)+'</button>').join('')+'</div>';
}
function _zkSearch(query){
  const clr=document.getElementById('zoek-clr');if(clr)clr.classList.toggle('on',!!query);
  const _app=document.getElementById('zoek-app'); if(_app)_app.innerHTML=_zkAppHtml(query);
  const el=document.getElementById('zoek-res'),tabs=document.getElementById('zoek-tabs'),
        stats=document.getElementById('zoek-stats'),more=document.getElementById('zoek-more'),
        filt=document.getElementById('zoek-filters');
  if(!_zkNorm(query)){
    const _a=document.getElementById('zoek-antw'); if(_a)_a.innerHTML='';
    _zoekState.all=[];tabs.style.display='none';filt.style.display='none';stats.innerHTML='';more.innerHTML='';
    _zkEmpty();return;
  }
  // Typt iemand al terwijl de vakdata nog laadt? Dan wachten; openZoek zoekt opnieuw zodra de index klaar is.
  if(!_zoekBuilt||!_zoekIndex){tabs.style.display='none';filt.style.display='none';stats.innerHTML='';more.innerHTML='';el.innerHTML='<div class="zk-state"><p>Even laden…</p></div>';return;}
  _zoekState.toks=_zkNorm(query).split(' ').filter(t=>t.length>=2);
  _zoekState.all=_zkRun(_zkTerm(query)||query);_zoekState.filter='all';
  const antw=document.getElementById('zoek-antw'); if(antw){ clearTimeout(_zkAntwT); _zkAntwT=setTimeout(()=>{if(_zkVast&&_zkVast===query.trim())return;antw.innerHTML=_zkAntwoordHtml(query);},260); }
  filt.style.display=_zoekState.all.length?'flex':'none';
  if(!_zoekState.all.length){
    tabs.style.display='none';stats.innerHTML='';more.innerHTML='';
    el.innerHTML='';
    return;
  }
  _zkBuildFilters();
  _zkRenderTabs();_zkStats();_zkRenderList(true);
}
const _ZK_RECENT='slagio_zoek_recent';
function _zkGetRecent(){try{return JSON.parse(localStorage.getItem(_ZK_RECENT)||'[]');}catch(e){return[];}}
function _zkSaveRecent(q){q=(q||'').trim();if(q.length<3)return;
  let r=_zkGetRecent().filter(x=>x.toLowerCase()!==q.toLowerCase());
  r.unshift(q);r=r.slice(0,6);try{localStorage.setItem(_ZK_RECENT,JSON.stringify(r));}catch(e){}}
function _zkClearRecent(){try{localStorage.removeItem(_ZK_RECENT);}catch(e){}_zkEmpty();}
function _zkEmpty(){
  const el=document.getElementById('zoek-res');
  const app=document.getElementById('zoek-app');
  if(app)app.innerHTML='<div class="zk-app"><span class="zk-app-l">Snel naar</span>'+[_ZK_APP[0],_ZK_APP[1],_ZK_APP[3],_ZK_APP[5]].map(x=>'<button class="zk-app-b" onclick="'+x[3].replace('%V','')+'"><span class="zk-app-ic no-ico">'+x[1]+'</span>'+x[0]+'</button>').join('')+'</div>';
  const rec=_zkGetRecent();
  let recHtml='';
  if(rec.length){
    recHtml='<div class="zk-recent"><div class="zk-recent-hd"><span>Recent gezocht</span>'
      +'<button class="zk-recent-clr" onclick="_zkClearRecent()">wissen</button></div>'
      +'<div class="zk-recent-chips">'+rec.map(q=>'<button class="zk-chip zk-recent-chip" data-q="'+_zkEsc(q)+'">'
      +'<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
      +_zkEsc(q)+'</button>').join('')+'</div></div>';
  }
  el.innerHTML='<div class="zk-state"><h3>Zoek in de hele kennisbank</h3><p>'+(_zoekIndex?_zoekIndex.length.toLocaleString('nl'):'Duizenden')+' vragen, begrippen en uitleg-fragmenten - HAVO &amp; VWO.</p></div>'+recHtml;
  [].forEach.call(el.querySelectorAll('.zk-recent-chip'),c=>c.onclick=()=>{
    const q=document.getElementById('zoek-q');q.value=c.getAttribute('data-q');_zkSearch(q.value);q.focus();});
}
function _zkBuildFilters(){
  const filt=document.getElementById('zoek-filters');
  if(filt.dataset.built)return;
  // niveau-chips + vak-select
  const vakSet={};
  _zoekState.all.forEach(e=>{if(e.vakId)vakSet[e.vakId]=e.vak;});
  let vakOpts='<option value="all">Alle vakken</option>'+Object.keys(vakSet).sort((a,b)=>vakSet[a].localeCompare(vakSet[b])).map(id=>'<option value="'+id+'">'+_zkEsc(vakSet[id])+'</option>').join('');
  filt.innerHTML=
    '<div class="zk-niv">'
    +'<button class="zk-niv-b on" data-n="all">Alle</button>'
    +'<button class="zk-niv-b" data-n="havo">HAVO</button>'
    +'<button class="zk-niv-b" data-n="vwo">VWO</button></div>'
    +'<select class="zk-vak" id="zoek-vak">'+vakOpts+'</select>';
  filt.dataset.built='1';
  [].forEach.call(filt.querySelectorAll('.zk-niv-b'),b=>b.onclick=()=>{
    [].forEach.call(filt.querySelectorAll('.zk-niv-b'),x=>x.classList.remove('on'));
    b.classList.add('on');_zoekState.niv=b.getAttribute('data-n');_zkApplyFilters();
  });
  document.getElementById('zoek-vak').onchange=function(){_zoekState.vak=this.value;_zkApplyFilters();};
}

// ── Openen ──
let _zkWired=false;
function openZoek(){
  show('sc-zoek');
  const q=document.getElementById('zoek-q');
  try{q.focus({preventScroll:true});}catch(e){} // meteen, binnen de tik: dan opent het toetsenbord ook op iOS
  if(!_zkWired){ _zkWire(); _zkWired=true; }
  // Pending query vanuit /zoek.html?q=… of een externe deeplink
  try{const pend=sessionStorage.getItem('slagio_pending_zoek');
    if(pend){sessionStorage.removeItem('slagio_pending_zoek');q.value=pend;}}catch(e){}
  _zkEnsureData(()=>{ buildZoekIndex(); if(!q.value)_zkEmpty(); else _zkSearch(q.value); });
  setTimeout(()=>{try{q.focus();}catch(e){}},80);
}
function _zkWire(){
  const q=document.getElementById('zoek-q'),clr=document.getElementById('zoek-clr'),
        chips=document.getElementById('zoek-chips'),res=document.getElementById('zoek-res');
  const SUGG=[['wat is osmose?','biologie'],['wat is inflatie?','economie'],['hoofdgedachte','nederlands'],['drogreden','nederlands'],['elasticiteit','economie'],['afgeleide','wiskunde'],['denaturatie','biologie']];
  chips.innerHTML=SUGG.map(s=>'<button class="zk-chip" data-q="'+s[0]+'">'+s[0]+'<small>'+s[1]+'</small></button>').join('');
  [].forEach.call(chips.querySelectorAll('.zk-chip'),c=>c.onclick=()=>{q.value=c.getAttribute('data-q');_zkSearch(q.value);q.focus();});
  let deb; q.addEventListener('input',()=>{clearTimeout(deb);const v=q.value;if(_zkVast&&v.trim()!==_zkVast)_zkVast='';deb=setTimeout(()=>_zkSearch(v),90);});
  q.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();_zkVerstuur();}else if(e.key==='Escape'){q.value='';_zkSearch('');}});
  const go=document.getElementById('zoek-go'); if(go)go.onclick=_zkVerstuur;
  clr.onclick=()=>{q.value='';_zkSearch('');q.focus();};
  res.addEventListener('click',ev=>{const b=ev.target.closest('.zk-ans-t');if(!b)return;const box=document.getElementById(b.getAttribute('data-t'));if(box)box.classList.toggle('open');});
}

// Globale sneltoets: "/" opent de zoek van overal in de app (tenzij je typt).
document.addEventListener('keydown',function(e){
  if(e.key!=='/'||e.metaKey||e.ctrlKey||e.altKey)return;
  const t=e.target,tag=(t&&t.tagName||'').toLowerCase();
  if(tag==='input'||tag==='textarea'||tag==='select'||(t&&t.isContentEditable))return;
  if(typeof APP_LEVEL==='undefined')return;               // pas na niveaukeuze
  const cur=document.querySelector('.sc.on');
  if(cur&&(cur.id==='sc-q'||cur.id==='sc-simtoets'))return;// niet tijdens een toets
  e.preventDefault();
  if(window.openZoek)openZoek();
});


// ═══════ VRAAG HET SLAGIO: antwoordkaart uit de eigen stof ═══════
// "wat is osmose?" → definitie (begrip) + de bijbehorende uitleg uit de samenvatting, met
// knoppen naar de uitleg en het oefenen. Staat het er niet in, dan vraag je door aan Vonk
// (de AI krijgt de best passende Slagio-stof als bron mee). Elke vraag zonder antwoord wordt
// gemeten (event vraag_slagio), zodat we zien welke stof nog ontbreekt.
const _ZK_VRAAGWOORD=/^(wat (is|zijn|betekent|betekenen|houdt|bedoel(t|en)? (je|ze|men) met)( een| de| het)?|wat wordt (er )?bedoeld met( een| de| het)?|hoe (werkt|werken|ontstaat|ontstaan|verloopt|bereken je)( een| de| het)?|waarom|leg (eens )?uit( wat)?|uitleg( over| van)?|definitie( van)?|verschil tussen)\s+/;
function _zkTerm(q){
  let t=_zkNorm(q).replace(_ZK_VRAAGWOORD,'').replace(/\s+(in|bij|voor) (de |het )?(biologie|scheikunde|natuurkunde|economie|aardrijkskunde|geschiedenis|nederlands|engels|wiskunde|havo|vwo|vmbo)\b.*$/,'');
  return t.replace(/\s+(in|uit)$/,'').trim();
}
function _zkSnippet(text,toks,n){
  const low=_zkNorm(text); let pos=-1;
  for(const t of toks){const i=low.indexOf(t);if(i>=0&&(pos<0||i<pos))pos=i;}
  if(pos<0||text.length<=n)return _zkClip(text,n);
  const zinStart=Math.max(0,text.lastIndexOf('. ',Math.max(0,pos-20))+2);
  const s=text.slice(zinStart>pos?0:zinStart);
  return _zkClip(s,n);
}
// Woorden die niets zeggen over het onderwerp ("hoe werkt de nier" → "nier").
const _ZK_STOP=new Set('de het een en of in op aan van voor bij met uit over tot door om te is zijn was wordt worden werd hoe wat waarom wanneer waar wie welke welk doet doen werkt werken gebeurt komt kun kan je jij ik we ze er dat dit die deze niet wel ook nog als dan zo heel meer minder elkaar tussen verschil uitleg leg uitleggen betekent betekenis bedoeld zit zitten'.split(' '));
function _zkInhoud(term){return term.split(' ').filter(t=>t.length>=3&&!_ZK_STOP.has(t));}
// heel woord of begin van een woord ("nier" past op "nieren", niet op "manier")
function _zkWoord(norm,t){return (' '+norm).indexOf(' '+t)>=0;}
// Typfouten: dichtstbijzijnde begrip (Levenshtein), alleen bij genoeg letters.
let _zkTitels=null;
function _zkAfstand(a,b,max){
  if(Math.abs(a.length-b.length)>max)return max+1;
  let prev=Array.from({length:b.length+1},(_,j)=>j);
  for(let i=1;i<=a.length;i++){const cur=[i];let rij=i;
    for(let j=1;j<=b.length;j++){cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));if(cur[j]<rij)rij=cur[j];}
    if(rij>max)return max+1; prev=cur;}
  return prev[b.length];
}
function _zkCorrectie(term){
  if(term.length<5||!_zoekIndex)return null;
  if(!_zkTitels){const z=new Set();_zoekIndex.forEach(e=>{if(e.type==='begrip'&&e.def&&e.title){const n=_zkNorm(e.title);if(n.length>=4&&n.length<=40)z.add(n);}});_zkTitels=[...z];}
  const max=term.length>=8?2:1;let best=null,bd=max+1;
  for(const t of _zkTitels){const d=_zkAfstand(term,t,max);if(d<bd||(d===bd&&best&&t.length<best.length)){bd=d;best=t;if(d===0)break;}}
  return bd<=max&&best!==term?best:null;
}
function _zkAntwoord(query,_geenCorrectie){
  const term=_zkTerm(query); if(!term||term.length<2)return null;
  const inh=_zkInhoud(term), toks=inh.length?inh:term.split(' ').filter(t=>t.length>=2), niv=(typeof APP_LEVEL!=='undefined'&&APP_LEVEL)||'havo';
  // 1. begrip met precies deze term (eigen niveau en leerdoel-modules eerst, korte titels voor)
  let best=null,bs=0;
  const kern=inh.join(' ')||term;
  (_zoekIndex||[]).forEach(e=>{
    if(e.type!=='begrip'||!e.def||!e.answer)return;
    const tn=_zkNorm(e.title); let s=0;
    if(tn===term||tn===kern)s=100;
    else if(kern.length>=4&&(' '+tn+' ').indexOf(' '+kern+' ')>=0)s=55;
    else if(kern.length>=5&&tn.indexOf(kern)===0)s=50; else return;
    if(e.niveau===niv)s+=20; if(e.ld)s+=10; s-=Math.min(15,Math.max(0,tn.length-kern.length)/3);
    if(s>bs){bs=s;best=e;}
  });
  // 2. beste alinea uit een samenvatting: alle inhoudswoorden moeten er als woord in staan
  let pas=null,ps=0;
  _zkPassages.forEach(p=>{
    if(best&&p.tabel)return;   // de begrippentabel herhaalt de definitie; liever een alinea met uitleg
    let s=0;
    for(const t of toks){if(!_zkWoord(p.norm,t))return;s+=10;}
    if(p.norm.indexOf(kern)>=0)s+=30;
    if(p.niveau===niv)s+=12; if(p.ld)s+=6;
    if(best&&p.vakId===best.vakId)s+=10;
    if(best&&p.domId===best.domId)s+=10;
    if(s>ps){ps=s;pas=p;}
  });
  if(!best&&!pas){
    // Typfout? Probeer het dichtstbijzijnde begrip ("osmoze" → "osmose").
    const c=!_geenCorrectie&&_zkCorrectie(kern);
    if(c){const r=_zkAntwoord(c,true);if(r&&!r.leeg){r.bedoeld=c;return r;}}
    return {leeg:true,term};
  }
  const bron=best||pas;
  return {term,toks,begrip:best,pas,niveau:bron.niveau,vakId:bron.vakId,vak:bron.vak,domId:bron.domId,dom:best?best.dom:pas.dom};
}
function _zkAntwoordHtml(query){
  const a=_zkAntwoord(query);
  if(!a)return '';
  const qEsc=_zkEsc(query);
  try{if(typeof trackEvent==='function'&&!_zkAntwGemeten[query]){_zkAntwGemeten[query]=1;trackEvent('vraag_slagio',{gevonden:!a.leeg,q:String(query).slice(0,80)});}}catch(e){}
  if(a.leeg){
    const k=_zkAiCache(query);
    if(k)return _zkAiHtml(query,k);
    return '<div class="zk-antw zk-antw-leeg"><div class="zk-antw-kop">Vraag het Slagio</div>'
      +'<p>Dit staat nog niet in de Slagio-stof. Druk op <b>Zoek</b>, dan beantwoordt Vonk je vraag.</p></div>';
  }
  _zkLaatste=a;
  const niv=(a.niveau||'').toUpperCase();
  let html='<div class="zk-antw"><div class="zk-antw-kop">Antwoord uit Slagio<span>'+_zkEsc(a.vak)+(niv?' '+niv:'')+' · '+_zkEsc(a.dom||'')+'</span></div>';
  if(a.bedoeld)html+='<p class="zk-bedoeld">Bedoelde je <b>'+_zkEsc(a.bedoeld)+'</b>?</p>';
  if(a.begrip)html+='<p class="zk-antw-def"><b>'+_zkEsc(a.begrip.title)+'</b>: '+_zkEsc(a.begrip.answer)+'</p>';
  if(a.pas&&(!a.begrip||_zkNorm(a.pas.text).indexOf(_zkNorm(a.begrip.answer).slice(0,40))<0))html+='<p class="zk-antw-pas">'+_zkHl(_zkSnippet(a.pas.text,a.toks,340),a.toks)+'</p>';
  const g="zoekGoto('"+(a.niveau||'')+"','"+a.vakId+"',";
  html+='<div class="zk-antw-acties">'
    +'<button class="zk-antw-knop" onclick="'+g+"'uitleg','"+a.domId+"')\">Lees de uitleg"+_ZK_ARROW+'</button>'
    +'<button class="zk-antw-knop licht" onclick="'+g+"'quiz','"+a.domId+"')\">Oefen dit</button>"
    +'<button class="zk-antw-knop licht" onclick="_zkVraagVonk()">Vraag door aan Vonk</button></div></div>';
  return html;
}
const _zkAntwGemeten={}; let _zkLaatste=null;
function _zkVraagVonk(){
  const q=(document.getElementById('zoek-q')||{}).value||'';
  const a=_zkLaatste&&_zkTerm(q)===_zkLaatste.term?_zkLaatste:null;
  let bron='';
  if(a){ if(a.begrip)bron+=a.begrip.title+': '+a.begrip.answer+'\n'; if(a.pas)bron+=_zkClip(a.pas.text,900); }
  try{ if(typeof openVonkChat==='function') openVonkChat({vak:a?a.vak:'',onderwerp:a?(a.begrip?a.begrip.title:a.dom):'',seedUser:q,bron:bron.slice(0,1200)}); }catch(e){}
}

// Wisselend voorbeeld in de zoekbalk op de home: laat zien wat je allemaal kunt vragen.
(function(){
  const VB=['wat is osmose?','foutenboek','Duits examen 2024','cijfer berekenen','wat is inflatie?','examenrooster','wat is een drogreden?','arcade'];
  let i=0;
  setInterval(function(){
    const el=document.getElementById('hm-zoekbalk-vb');
    if(!el||document.hidden||!el.offsetParent)return;
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){i=(i+1)%VB.length;el.textContent=VB[i];return;}
    el.classList.add('weg');
    setTimeout(function(){i=(i+1)%VB.length;el.textContent=VB[i];el.classList.remove('weg');el.classList.add('komt');void el.offsetWidth;el.classList.remove('komt');},360);
  },3600);
})();

// ═══════ VRAAG HET SLAGIO: AI ALS DE STOF HET NIET WEET ═══════
// Alleen na een bewuste zoekactie (Enter of de Zoek-knop), nooit tijdens het typen:
// dat scheelt AI-tokens en halve antwoorden. De AI beantwoordt alleen leer- en
// examenvragen; de rest krijgt een vriendelijk nee. Antwoorden worden lokaal
// bewaard, zodat dezelfde vraag niet nog een keer een AI-aanroep kost.
const _ZK_AI_KEY='slagio_zoek_ai_v1', _ZK_NEE='[GEEN_LEERVRAAG]';
function _zkAiSleutel(q){return (typeof APP_LEVEL!=='undefined'?APP_LEVEL:'')+'|'+_zkNorm(q);}
function _zkAiCache(q,zet){
  let m={};try{m=JSON.parse(localStorage.getItem(_ZK_AI_KEY)||'{}')||{};}catch(e){}
  const k=_zkAiSleutel(q);
  if(zet===undefined)return m[k]||null;
  m[k]=zet;const ks=Object.keys(m);if(ks.length>60)ks.sort((a,b)=>(m[a].ts||0)-(m[b].ts||0)).slice(0,ks.length-60).forEach(x=>delete m[x]);
  try{localStorage.setItem(_ZK_AI_KEY,JSON.stringify(m));}catch(e){}
}
// Snelle voorfilter: dingen die duidelijk geen leervraag zijn, gaan niet naar de AI.
const _ZK_NIET=/\b(seks|sex|porno|naakt|drugs|wiet|wapen|bom maken|hack|wachtwoord|cheat|spieken|antwoorden van de toets|uitslag|wk|ek|champions league|eredivisie|tiktok|fortnite|roblox|minecraft|instagram|snapchat|crush|verliefd|vriendin|vriendje|rijk worden|bitcoin|crypto|gokken|casino)\b/;
function _zkVerstuur(){
  const inp=document.getElementById('zoek-q'); const q=(inp&&inp.value||'').trim();
  if(!q)return;
  _zkVast=q;
  _zkSaveRecent(q);
  try{inp.blur();}catch(e){}
  const antw=document.getElementById('zoek-antw'); if(!antw)return;
  clearTimeout(_zkAntwT);
  if(!_zoekBuilt){antw.innerHTML='<div class="zk-antw"><p>Even laden…</p></div>';_zkEnsureData(()=>{buildZoekIndex();_zkVerstuur();});return;}
  const a=_zkAntwoord(q);
  if(a&&!a.leeg){antw.innerHTML=_zkAntwoordHtml(q);return;}
  // App-onderdeel ("foutenboek") is geen vraag voor de AI
  if(_zkApp(q).length&&q.split(/\s+/).length<=3){antw.innerHTML='';return;}
  _zkAi(q);
}
async function _zkAi(q){
  const antw=document.getElementById('zoek-antw');
  const k=_zkAiCache(q); if(k){antw.innerHTML=_zkAiHtml(q,k);return;}
  const qn=_zkNorm(q);
  if(qn.replace(/[^a-z]/g,'').length<3||_ZK_NIET.test(qn)){antw.innerHTML=_zkAiHtml(q,{nee:1});try{trackEvent('vraag_slagio_ai',{uitkomst:'nee_filter',q:q.slice(0,80)});}catch(e){}return;}
  const vonk=(typeof mascotSVG==='function')?mascotSVG('denk',56):'';
  antw.innerHTML='<div class="zk-antw zk-ai zk-ai-laden"><div class="zk-ai-vonk">'+vonk+'</div><div><div class="zk-antw-kop">Vonk zoekt het uit…</div><div class="zk-ai-stip"><i></i><i></i><i></i></div></div></div>';
  // De best passende Slagio-stof gaat als bron mee, zodat het antwoord aansluit.
  let bron='';try{const r=_zkRun(_zkTerm(q)||q).filter(e=>e.answer||e.type==='begrip').slice(0,3);bron=r.map(e=>(e.title||'')+': '+_zkClip(_zkStrip(e.answer||''),260)).join('\n');}catch(e){}
  const niv=(typeof APP_LEVEL!=='undefined'&&APP_LEVEL)||'havo';
  const prompt='[Vraag via de zoekfunctie van Slagio, een examentrainer. Regels: 1) Gaat de vraag over schoolstof, het eindexamen ('+niv+') of over leren en studeren? Beantwoord hem dan juist en kort: eerst de kern in één of twee zinnen, daarna hooguit een korte uitleg of voorbeeld, samen maximaal 110 woorden. 2) Gaat de vraag over iets anders (privé, roddels, sport, games, geld verdienen, iets maken of doen dat niets met leren te maken heeft, of iets ongepasts), antwoord dan alleen met '+_ZK_NEE+' en verder niets. 3) Weet je het niet zeker, zeg dat eerlijk.]'
    +(bron?'\n[Mogelijk passende Slagio-stof:]\n'+bron:'')+'\n\nVraag: '+q;
  let res=null;try{res=await aiVonkChat([{role:'user',content:prompt}],{niveau:niv,onderwerp:'Vraag het Slagio',zoek:true});}catch(e){res={error:true};}
  // Is er intussen iets anders gezocht? Dan dit antwoord niet meer tonen.
  if(((document.getElementById('zoek-q')||{}).value||'').trim()!==q)return;
  let uit;
  if(res&&res.text){
    const t=String(res.text).trim();
    uit=t.indexOf(_ZK_NEE)>=0?{nee:1,ts:Date.now()}:{t,ts:Date.now()};
    _zkAiCache(q,uit);
    try{trackEvent('vraag_slagio_ai',{uitkomst:uit.nee?'nee':'antwoord',q:q.slice(0,80)});}catch(e){}
  }else if(res&&res.login)uit={login:1};
  else if(res&&res.limit)uit={limit:1};
  else uit={fout:1};
  antw.innerHTML=_zkAiHtml(q,uit);
}
function _zkAiHtml(q,u){
  const vonk=(typeof mascotSVG==='function')?mascotSVG(u.nee?'denk':(u.t?'blij':'kijk'),56):'';
  const kop=(t,s)=>'<div class="zk-antw zk-ai"><div class="zk-ai-vonk">'+vonk+'</div><div class="zk-ai-inh"><div class="zk-antw-kop">'+t+(s?'<span>'+s+'</span>':'')+'</div>';
  if(u.nee)return kop('Daar help ik je niet mee')+'<p>Ik beantwoord vragen over je vakken en het examen. Vraag bijvoorbeeld: <i>wat is osmose?</i> of <i>hoe bereken je de molmassa?</i></p></div></div>';
  if(u.login)return kop('Vonk beantwoordt je vraag')+'<p>Dit staat nog niet in de Slagio-stof. Met een gratis account beantwoordt Vonk het voor je.</p><div class="zk-antw-acties"><button class="zk-antw-knop" onclick="try{switchAuthTab&&switchAuthTab(\'register\')}catch(e){};show(\'sc-auth\')">Gratis account maken</button></div></div></div>';
  if(u.limit)return kop('Je AI-vragen zijn op')+'<p>Je gratis vragen aan Vonk voor deze week zijn op. Volgende week kun je weer, of probeer het met andere woorden in de Slagio-stof.</p></div></div>';
  if(u.fout)return kop('Vonk is even niet bereikbaar')+'<p>Probeer het zo nog eens.</p><div class="zk-antw-acties"><button class="zk-antw-knop" onclick="_zkVerstuur()">Opnieuw</button></div></div></div>';
  const tekst=(typeof _vchatMd==='function')?_vchatMd(u.t):_zkEsc(u.t).replace(/\n/g,'<br>');
  return kop('Antwoord van Vonk','AI')+'<div class="zk-ai-tekst">'+tekst+'</div>'
    +'<div class="zk-antw-acties"><button class="zk-antw-knop" onclick="_zkAiDoor()">Vraag door aan Vonk</button></div>'
    +'<p class="zk-ai-let">Vonk is een AI en kan zich vergissen. Check het in je lesstof.</p></div></div>';
}
function _zkAiDoor(){
  const q=((document.getElementById('zoek-q')||{}).value||'').trim();const k=_zkAiCache(q);
  try{openVonkChat({onderwerp:'Vraag het Slagio',bron:k&&k.t?('Eerdere vraag: '+q+'\nAntwoord van Vonk: '+k.t).slice(0,1200):''});}catch(e){}
}
