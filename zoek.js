// ═══════════════════════════════════════════════════════════
//  SLAGIO — EXAMENZOEKMACHINE (in-app)
//  Client-side full-text zoek over examens, begrippen, uitleg & oefenvragen.
//  Index wordt lazy opgebouwd bij eerste opening; ce_data.js lazy geladen.
// ═══════════════════════════════════════════════════════════
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

// ── ce_data.js lazy laden (niet in de app-shell om load licht te houden) ──
function _zkEnsureData(cb){
  if(_zoekCeLoaded||typeof CE_OE!=='undefined'){cb();return;}
  const s=document.createElement('script');s.src='/ce_data.js';
  s.onload=()=>{_zoekCeLoaded=true;cb();};
  s.onerror=()=>{_zoekCeLoaded=true;cb();}; // zonder oud-examens is prima
  document.head.appendChild(s);
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
  try{
    if(niveau && typeof APP_LEVEL!=='undefined' && niveau!==APP_LEVEL){
      APP_LEVEL=niveau; localStorage.setItem('examenapp_level',niveau);
      if(window.applyLevelTheme)applyLevelTheme(niveau);
      if(window.updateLevelChip)updateLevelChip();
      if(window.buildGrid)buildGrid();
    }
    if(window.openVak)openVak(vakId);
    if(kind==='quiz'&&domId){ setTimeout(()=>{try{openQmode(domId);}catch(e){}},70); }
    else if(domId){ setTimeout(()=>{const el=document.querySelector('#dlist [data-domein-id="'+domId+'"]');if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.classList.add('dc2-flash');setTimeout(()=>el.classList.remove('dc2-flash'),1400);}},260); }
  }catch(err){ if(window.showToast)showToast('Kon niet openen — probeer opnieuw'); }
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
    _zoekState.all=[];tabs.style.display='none';filt.style.display='none';stats.innerHTML='';more.innerHTML='';
    _zkEmpty();return;
  }
  _zoekState.toks=_zkNorm(query).split(' ').filter(t=>t.length>=2);
  _zoekState.all=_zkRun(query);_zoekState.filter='all';
  filt.style.display=_zoekState.all.length?'flex':'none';
  if(!_zoekState.all.length){
    tabs.style.display='none';stats.innerHTML='';more.innerHTML='';
    el.innerHTML='<div class="zk-state"><h3>Niets gevonden voor "'+_zkEsc(query)+'"</h3><p>Probeer een ander trefwoord of begrip.</p></div>';
    return;
  }
  _zkBuildFilters();
  _zkRenderTabs();_zkStats();_zkRenderList(true);
}
function _zkEmpty(){
  const el=document.getElementById('zoek-res');
  el.innerHTML='<div class="zk-state"><h3>Zoek in de hele kennisbank</h3><p>'+(_zoekIndex?_zoekIndex.length.toLocaleString('nl'):'Duizenden')+' vragen, begrippen en uitleg-fragmenten — HAVO &amp; VWO.</p></div>';
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
  _zkEnsureData(()=>{ buildZoekIndex(); if(!q.value)_zkEmpty(); else _zkSearch(q.value); });
  setTimeout(()=>{try{q.focus();}catch(e){}},80);
}
function _zkWire(){
  const q=document.getElementById('zoek-q'),clr=document.getElementById('zoek-clr'),
        chips=document.getElementById('zoek-chips'),res=document.getElementById('zoek-res');
  const SUGG=[['CO2','scheikunde'],['elasticiteit','economie'],['osmose','biologie'],['afgeleide','wiskunde'],['inflatie','economie'],['DNA','biologie'],['argumentatie','nederlands']];
  chips.innerHTML=SUGG.map(s=>'<button class="zk-chip" data-q="'+s[0]+'">'+s[0]+'<small>'+s[1]+'</small></button>').join('');
  [].forEach.call(chips.querySelectorAll('.zk-chip'),c=>c.onclick=()=>{q.value=c.getAttribute('data-q');_zkSearch(q.value);q.focus();});
  let deb; q.addEventListener('input',()=>{clearTimeout(deb);const v=q.value;deb=setTimeout(()=>_zkSearch(v),120);});
  clr.onclick=()=>{q.value='';_zkSearch('');q.focus();};
  res.addEventListener('click',ev=>{const b=ev.target.closest('.zk-ans-t');if(!b)return;const box=document.getElementById(b.getAttribute('data-t'));if(box)box.classList.toggle('open');});
}
