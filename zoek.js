// ═══════════════════════════════════════════════════════════
//  SLAGIO - EXAMENZOEKMACHINE (in-app)
//  Client-side full-text zoek over examens, begrippen, uitleg & oefenvragen.
//  Index wordt lazy opgebouwd bij eerste opening; ce_data.js lazy geladen.
// ═══════════════════════════════════════════════════════════
let _zkPassages=[],_zkAntwT=0;
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
  _zkPassages=[];
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
function _zkEnsureData(cb){
  function loadCe(){
    if(_zoekCeLoaded||typeof CE_OE!=='undefined'){cb();return;}
    const s=document.createElement('script');s.src='/ce_data.js';
    s.onload=()=>{_zoekCeLoaded=true;cb();};
    s.onerror=()=>{_zoekCeLoaded=true;cb();}; // zonder oud-examens is prima
    document.head.appendChild(s);
  }
  // De zoekindex omvat álle vragen + samenvattingen; hydrateer beide niveaus volledig
  // (per-vak vraagbestanden) zodat sv/oe/sam in de index komen. Alleen bij zoekgebruik.
  const eav=(typeof ensureAllVakData==='function');
  function sam(){ const n=(typeof APP_LEVEL!=='undefined'&&APP_LEVEL)||'havo';
    if(typeof ensureSamData==='function'&&typeof samReady==='function'&&!samReady(n)){ensureSamData(n,loadCe);} else loadCe(); }
  function vwo(){ if(eav)ensureAllVakData('vwo',sam); else sam(); }
  function havo(){ if(eav)ensureAllVakData('havo',vwo); else vwo(); }
  havo();
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
    if(kind==='quiz'&&domId){ setTimeout(()=>{try{openQmode(domId);}catch(e){}},70); }
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
  if(e.type==='examen'){
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
function _zkSearch(query){
  const clr=document.getElementById('zoek-clr');if(clr)clr.classList.toggle('on',!!query);
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
  const antw=document.getElementById('zoek-antw'); if(antw){ clearTimeout(_zkAntwT); _zkAntwT=setTimeout(()=>{antw.innerHTML=_zkAntwoordHtml(query);},260); }
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
  let deb; q.addEventListener('input',()=>{clearTimeout(deb);const v=q.value;deb=setTimeout(()=>_zkSearch(v),120);});
  q.addEventListener('keydown',e=>{if(e.key==='Enter'){_zkSaveRecent(q.value);q.blur();}else if(e.key==='Escape'){q.value='';_zkSearch('');}});
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
function _zkAntwoord(query){
  const term=_zkTerm(query); if(!term||term.length<2)return null;
  const toks=term.split(' ').filter(t=>t.length>=2), niv=(typeof APP_LEVEL!=='undefined'&&APP_LEVEL)||'havo';
  // 1. begrip met precies deze term (eigen niveau en leerdoel-modules eerst)
  let best=null,bs=0;
  (_zoekIndex||[]).forEach(e=>{
    if(e.type!=='begrip'||!e.def||!e.answer)return;
    const tn=_zkNorm(e.title); let s=0;
    if(tn===term)s=100; else if(tn.split(' ').includes(term)&&term.length>=4)s=55; else if(term.length>=5&&tn.indexOf(term)===0)s=50; else return;
    if(e.niveau===niv)s+=20; if(e.ld)s+=10;
    if(s>bs){bs=s;best=e;}
  });
  // 2. beste alinea uit een samenvatting
  let pas=null,ps=0;
  _zkPassages.forEach(p=>{
    if(best&&p.tabel)return;   // de begrippentabel herhaalt de definitie; liever een alinea met uitleg
    let s=0,alle=true;
    if(p.norm.indexOf(term)>=0)s+=30;
    toks.forEach(t=>{if(p.norm.indexOf(t)>=0)s+=8;else alle=false;});
    if(!alle&&s<30)return;
    if(p.niveau===niv)s+=12; if(p.ld)s+=6;
    if(best&&p.vakId===best.vakId)s+=10;
    if(best&&p.domId===best.domId)s+=10;
    if(s>ps){ps=s;pas=p;}
  });
  if(!best&&!pas)return {leeg:true,term};
  const bron=best||pas;
  return {term,toks,begrip:best,pas,niveau:bron.niveau,vakId:bron.vakId,vak:bron.vak,domId:bron.domId,dom:best?best.dom:pas.dom};
}
function _zkAntwoordHtml(query){
  const a=_zkAntwoord(query);
  if(!a)return '';
  const qEsc=_zkEsc(query);
  try{if(typeof trackEvent==='function'&&!_zkAntwGemeten[query]){_zkAntwGemeten[query]=1;trackEvent('vraag_slagio',{gevonden:!a.leeg,q:String(query).slice(0,80)});}}catch(e){}
  if(a.leeg){
    return '<div class="zk-antw zk-antw-leeg"><div class="zk-antw-kop">Vraag het Slagio</div>'
      +'<p>Hier heb ik nog geen uitleg over in de Slagio-stof. Vonk kan je wel verder helpen.</p>'
      +'<div class="zk-antw-acties"><button class="zk-antw-knop" onclick="_zkVraagVonk()">Vraag het aan Vonk</button></div></div>';
  }
  _zkLaatste=a;
  const niv=(a.niveau||'').toUpperCase();
  let html='<div class="zk-antw"><div class="zk-antw-kop">Antwoord uit Slagio<span>'+_zkEsc(a.vak)+(niv?' '+niv:'')+' · '+_zkEsc(a.dom||'')+'</span></div>';
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
