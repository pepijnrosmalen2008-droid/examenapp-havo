// ═══════ OPEN VAK ═══════
function openVak(id,_noHash){
  ST.vak=getVK().find(v=>v.id===id);
  if(!_noHash)_pushHash(APP_LEVEL+'-'+(_VAK_SLUG[id]||id));
  document.getElementById('dtitle').textContent=ST.vak.naam;
  document.getElementById('ddesc').textContent=ST.vak.beschrijving;
  document.getElementById('dce').innerHTML=ST.vak.ceInfo;
  const _bcVak=document.getElementById('det-bc-vak');
  if(_bcVak)_bcVak.textContent=ST.vak.naam;
  // Remove previously injected exam-meta + yt-card + grade-panel + ce-archief-card (avoid stacking on revisit)
  document.querySelectorAll('.exam-meta,.yt-card,.grade-panel,.ce-archief-card').forEach(el=>el.remove());
  // Exam metadata
  let metaHtml='<div class="exam-meta">';
  if(ST.vak.exDatum)metaHtml+=`<span class="em-chip em-date">📅 ${ST.vak.exDatum.split('-').reverse().join('-')} · ${ST.vak.exTijd}</span>`;
  if(ST.vak.exDuur)metaHtml+=`<span class="em-chip">⏱ ${ST.vak.exDuur}</span>`;
  if(ST.vak.hulpmiddelen)metaHtml+=`<span class="em-chip">📋 ${ST.vak.hulpmiddelen}</span>`;
  metaHtml+='</div>';
  if(ST.vak.youtubeKanaal&&ST.vak.youtubeUrl)metaHtml+=`<a class="yt-card" href="${ST.vak.youtubeUrl}" target="_blank" rel="noopener"><div class="yt-icon"><svg viewBox="0 0 24 24"><path d="M23.5 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.8 2.8 12 2.8 12 2.8s-4.8 0-7.3.1c-.6.1-1.9.1-3 1.3C.8 5 .5 7 .5 7S.2 9.3.2 11.5v2.1c0 2.2.3 4.5.3 4.5s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.2 22.2 12 22.2 12 22.2s4.8 0 7.3-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.3.3-4.5v-2.1C23.8 9.3 23.5 7 23.5 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/></svg></div><div class="yt-info"><span class="yt-label">Aanbevolen YouTube-kanaal</span><span class="yt-name">${ST.vak.youtubeKanaal}</span></div><span class="yt-arr">→</span></a>`;
  // Echte CE-examens archief
  // EXAMENS_BASE_URL: zet op je eigen Supabase URL na uploaden met upload-examens-supabase.js
  // Voorbeeld: 'https://xxxx.supabase.co/storage/v1/object/public/examens'
  // Laat leeg ('') om de AlleExamens.nl fallback te gebruiken.
  const _EXAMENS_BASE = 'https://sxrjdssmgwwygtskovyc.supabase.co/storage/v1/object/public/examens';
  const _aeNames={nl:'Nederlands',wa:'Wiskunde A',wb:'Wiskunde B',bi:'Biologie',sk:'Scheikunde',na:'Natuurkunde',en:'Engels',ec:'Economie',be:'Bedrijfseconomie',gs:'Geschiedenis',ak:'Aardrijkskunde',mw:'Maatschappijwetenschappen',de:'Duits',fr:'Frans',la:'Latijn',gr:'Grieks',in:'Informatica'};
  const _aeLvl=(ST.niveau||'havo').toUpperCase();
  const _niveau=(ST.niveau||'havo').toLowerCase();
  const _aeName=_aeNames[ST.vak.id];
  if(_aeName){
    const _enc=encodeURIComponent(_aeName);
    const _mkPdf=(year,tv,type)=>_EXAMENS_BASE
      ?`${_EXAMENS_BASE}/${_niveau}/${ST.vak.id}/${year}/${tv}/${type}.pdf`
      :`https://static.alleexamens.nl/${_aeLvl}/${_enc}/${year}/${tv}/${_enc}/${_enc}%20${year}%20${tv}_${type}.pdf`;
    const _bundel=_EXAMENS_BASE
      ?`${_EXAMENS_BASE}/${_niveau}/${ST.vak.id}/bundel.pdf`
      :`https://static.alleexamens.nl/${_aeLvl}/${_enc}/Examenbundels/Examenbundel_Compleet_${_aeLvl}_${_enc}.pdf`;
    const _jaren=[2025,2024,2023,2022,2021,2019];
    // Eerste CE-jaar van huidig examenprogramma per vak en niveau (bron: examenblad.nl / slo.nl)
    const _svData={
      havo:{wa:2017,wb:2017,bi:2024,sk:2024,na:2024,be:2021,gs:2020,ak:2025,ec:2023},
      vwo: {wa:2018,wb:2018,bi:2025,sk:2025,na:2025,gs:2021,ak:2026,ec:2023,mw:2020,la:2017,gr:2017,in:2022}
    };
    const _svVanaf=((_svData[(ST.niveau||'havo').toLowerCase()])||{})[ST.vak.id]||2019;
    const _svBadge=y=>y>=_svVanaf
      ?`<span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.3);color:#22c55e;letter-spacing:.2px;vertical-align:middle">✓ Zelfde syllabus</span>`
      :`<span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;background:rgba(234,179,8,.1);border:1px solid rgba(234,179,8,.3);color:#ca8a04;letter-spacing:.2px;vertical-align:middle" title="Huidig CE-programma geldt v.a. ${_svVanaf} (bron: examenblad.nl). Dit examen kan stof bevatten die niet meer in het syllabus staat, of nieuwe stof missen.">⚠ Ander syllabus (v.a. ${_svVanaf})</span>`;
    let _ch=`<div class="ce-archief-card" style="margin-top:16px;border-radius:16px;overflow:hidden;border:1.5px solid rgba(var(--or-rgb),.4);background:linear-gradient(135deg,rgba(var(--or-rgb),.08),rgba(var(--or-rgb),.03))"><div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;cursor:pointer;gap:10px;user-select:none" onclick="this.closest('.ce-archief-card').classList.toggle('open')"><div style="display:flex;align-items:center;gap:10px"><div style="width:36px;height:36px;border-radius:10px;background:rgba(var(--or-rgb),.18);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">📄</div><div><div style="font-size:14px;font-weight:800;color:var(--or)">Echte CE-examens</div><div style="font-size:11px;color:var(--mu);margin-top:1px">${_aeName} · opgaven + antwoorden · 2019–2025</div></div></div><div style="width:28px;height:28px;border-radius:8px;background:rgba(var(--or-rgb),.15);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--or);flex-shrink:0;transition:transform .22s" class="ce-arr">▼</div></div><div class="ce-archief-body" style="display:none;padding:0 16px 16px">`;
    _ch+=`<a href="${_bundel}" target="_blank" rel="noopener" class="ce-bundel-btn">📦 Download complete examenbundel — alle jaren in één PDF</a><div style="display:flex;align-items:flex-start;gap:8px;background:rgba(234,179,8,.08);border:1px solid rgba(234,179,8,.3);border-radius:10px;padding:9px 12px;margin-bottom:14px;font-size:12px;color:#ca8a04;line-height:1.5"><span style="font-size:15px;flex-shrink:0">⚠️</span><span><strong>Let op: zeer groot bestand.</strong> Deze PDF bevat alle examenjaren en kan honderden MB's groot zijn. Dit kan je browser of computer tijdelijk laten vastlopen. Download liever de losse examens per jaar hieronder.</span></div>`;
    const _hasTb=['nl','en','fr','de'].includes(ST.vak.id);
    _jaren.forEach(year=>{
      _ch+=`<div class="ce-jaar-blok"><div class="ce-jaar-lbl" style="display:flex;align-items:center;gap:7px">${year}${year===2020?' (geannuleerd — COVID)':''} ${_svBadge(year)}</div><div class="ce-tv-row">`;
      if(year!==2020){['I','II'].forEach(tv=>{
        const _urlOpg=_mkPdf(year,tv,'opgaven');
        const _urlCv=_mkPdf(year,tv,'correctievoorschrift');
        // Bijlage (tekstboekje) via alleexamens.nl — bevestigd werkend formaat
        const _urlTb=`https://static.alleexamens.nl/${_aeLvl}/${_enc}/${year}/${tv}/${_enc}/${_enc}%20${year}%20${tv}_bijlage.pdf`;
        const _titleOpg=`${_aeName} ${year} Tijdvak ${tv} — Opgaven`;
        const _titleCv=`${_aeName} ${year} Tijdvak ${tv} — Antwoorden`;
        const _titleTb=`${_aeName} ${year} Tijdvak ${tv} — Tekstboekje`;
        _ch+=`<div class="ce-tv-col"><div class="ce-tv-title">Tijdvak ${tv}</div>`;
        _ch+=`<button class="ce-pdf-btn" onclick="openPdfViewer('${_urlOpg}','${_titleOpg.replace(/'/g,"\\'")}')">📋 Opgaven</button>`;
        if(_hasTb)_ch+=`<button class="ce-pdf-btn ce-pdf-tb" onclick="openPdfViewer('${_urlTb}','${_titleTb.replace(/'/g,"\\'")}')">📖 Tekstboekje</button>`;
        _ch+=`<button class="ce-pdf-btn ce-pdf-cv" onclick="openPdfViewer('${_urlCv}','${_titleCv.replace(/'/g,"\\'")}')">✅ Antwoorden</button>`;
        _ch+=`</div>`;
      });}
      _ch+=`</div></div>`;
    });
    _ch+=`<div style="font-size:11px;color:var(--mu);margin-top:10px;padding-top:10px;border-top:1px solid var(--bo)">${_EXAMENS_BASE?'Examens gehost door Slagio':'Examens via <a href="https://www.alleexamens.nl" target="_blank" rel="noopener" style="color:var(--mu)">AlleExamens.nl</a>'} · Syllabus &amp; normering: <a href="https://www.examenblad.nl" target="_blank" rel="noopener" style="color:var(--mu)">Examenblad.nl</a></div></div></div>`;
    metaHtml+=_ch;
  }
  document.getElementById('dce').insertAdjacentHTML('afterend',metaHtml);

  // Grade panel (SE cijfer + benodigde CE)
  const cijfers=getSavedCijfers();
  const cij=cijfers[ST.vak.id];
  if(cij!=null){
    const ceNodig=Math.round(Math.max(1,Math.min(10,11-cij))*10)/10;
    const kleur=cij>=7?'#4ADE80':cij>=5.5?'#FCD34D':'#F87171';
    const status=cij>=7?'Goed op koers — focus op je zwakste CE-domeinen 🎯':cij>=5.5?'CE hard nodig — oefen intensief 📚':'CE is cruciaal — elke punt telt ⚠️';
    const ceTxt=cij>=9?'Je hebt al bijna genoeg zonder CE':ceNodig<=1?'Minimale CE voldoende':`CE-score ≥ ${ceNodig.toFixed(1).replace('.',',')} voor een voldoende`;
    // Quiz insight section inside grade panel
    const vpData=getVakBestPct(ST.vak.id);
    let quizInsightHtml='';
    if(vpData.hasData){
      const estCE=Math.round((1+9*vpData.pct)*10)/10;
      const estCEStr=estCE.toFixed(1).replace('.',',');
      const estColor=estCE>=ceNodig?'#4ADE80':estCE>=ceNodig-1?'#FCD34D':'#F87171';
      // Find weakest domain
      let weakestDomein=null;let weakestPct=2;
      ST.vak.domeinen.forEach(d=>{
        const dr=getDomeinBestPct(ST.vak.id,d.id);
        if(dr.hasData&&dr.pct<weakestPct){weakestPct=dr.pct;weakestDomein=d;}
      });
      const weakHtml=weakestDomein?`<div class="gp-weak-domain">
        <span class="gp-weak-txt">⚡ Zwakste domein: <strong>${weakestDomein.naam}</strong> (${Math.round(weakestPct*100)}%) — oefen dit nu voor de meeste winst</span>
        <button class="gp-weak-btn" onclick="openQmode('${weakestDomein.id}')">Oefen →</button>
      </div>`:'';
      quizInsightHtml=`<div class="gp-quiz-insight">
        <div class="gp-est-ce"><span>📈 Geschatte CE op basis van oefenscore:</span><span class="gp-est-val" style="color:${estColor}">${estCEStr}</span><span style="font-size:11px;color:var(--mu)">Gebaseerd op je beste quizresultaten</span></div>
        ${weakHtml}
      </div>`;
    }
    const gpHtml=`<div class="grade-panel">
      <div class="gp-se"><span class="gp-lbl">SE-cijfer</span><span class="gp-val" style="color:${kleur}">${cij.toFixed(1).replace('.',',')}</span></div>
      <div class="gp-div"></div>
      <div class="gp-ce"><span class="gp-lbl">Benodigde CE</span><span class="gp-ce-val">${ceTxt}</span></div>
      <div class="gp-status">${status}</div>
      ${quizInsightHtml}
    </div>`;
    document.querySelector('.exam-meta').insertAdjacentHTML('afterend',gpHtml);
  }

  // Progress overview
  const poGrid=document.getElementById('po-grid');
  const poBox=document.getElementById('progress-overview');
  poGrid.innerHTML='';
  let hasAnyProgress=false;
  ST.vak.domeinen.forEach(d=>{
    const r=getDomeinBestPct(ST.vak.id,d.id);
    if(r.hasData)hasAnyProgress=true;
    const pctVal=Math.round(r.pct*100);
    const scoreColor=pctVal>=70?'#4ADE80':pctVal>=50?'#FCD34D':'var(--mu)';
    poGrid.innerHTML+=`<div class="po-item">
      <div class="po-letter" style="background:${ST.vak.kleur}22;color:${ST.vak.kleur}">${d.id}</div>
      <div class="po-info"><div class="po-name">${d.naam}</div><div class="po-score" style="color:${r.hasData?scoreColor:'var(--mu)'}">${r.hasData?pctVal+'% beste score':'Nog niet geoefend'}</div></div>
    </div>`;
  });
  poBox.style.display=hasAnyProgress?'block':'none';

  const dl=document.getElementById('dlist');
  dl.innerHTML='';
  ST.vak.domeinen.forEach(d=>{
    const r=getDomeinBestPct(ST.vak.id,d.id);
    const decay=getDecayStatus(ST.vak.id,d.id);
    const decayDot=decay?`<span class="decay-dot" style="background:${decay.color};color:${decay.color}" title="${decay.label}"></span>`:'';
    const bestChip=r.hasData?`<span style="font-size:11px;color:var(--mu);font-weight:600;margin-left:4px">Record: ${Math.round(r.pct*100)}%</span>`:'';
    const _pbData=getPB(ST.vak.id,d.id);
    const pbChip=_pbData?`<span class="pb-chip">⭐ PB: ${Math.round(_pbData.score*100)}%</span>`:'';
    const progHtml=r.hasData?`<div class="dom-progress"><div class="dp-bar"><div class="dp-fill" style="width:${Math.round(r.pct*100)}%"></div></div><span class="dp-txt">${Math.round(r.pct*100)}%${bestChip}${pbChip}</span></div>`:'';
    const _ceMap={'CE':{cls:'CE',icon:'📝',txt:'Centraal Examen'},'SE':{cls:'SE',icon:'📋',txt:'Schoolexamen'},'CE+SE':{cls:'CESE',icon:'📝📋',txt:'CE + Schoolexamen'},'DEELS CE':{cls:'DEELS',icon:'📝',txt:'Deels CE'}};
    const _csInfo=d.ceStatus&&_ceMap[d.ceStatus];
    const csBadge=_csInfo?`<div class="dom-ce-badge dom-ce-${_csInfo.cls}">${_csInfo.icon} ${_csInfo.txt}</div>`:'';
    const el=document.createElement('div');
    el.className='dc2';
    el.dataset.domeinId=d.id;
    el.innerHTML=`
      <div class="dh" onclick="toggleD('top-${d.id}')">
        <div class="dlet" style="background:${ST.vak.kleur}22;color:${ST.vak.kleur}">${d.id}</div>
        <div class="di"><h4>Domein ${d.id}: ${d.naam}${decayDot}</h4>${csBadge}<p>${d.beschrijving}</p>${progHtml}</div>
        <div class="dbtns">
          <button class="fav-btn${isFav(ST.vak.id,d.id)?' active':''}" id="fav-${d.id}" onclick="event.stopPropagation();const on=toggleFav('${ST.vak.id}','${d.id}');this.classList.toggle('active',on)">⭐</button>
          <button class="exb" id="exb-${d.id}" onclick="event.stopPropagation();toggleD('top-${d.id}')">▼ Leerstof</button>
          <button class="qb" onclick="event.stopPropagation();openQmode('${d.id}')">▶ Quiz</button>
        </div>
      </div>
      <div class="dtop" id="top-${d.id}">
        <div class="dtab-bar">
          <button class="dtab-btn dtab-active" data-tab="theorie">📖 Theorie</button>
          <button class="dtab-btn" data-tab="quiz">⚡ Test jezelf</button>
          <button class="dtab-btn dtab-vid-tab" data-tab="vids" style="display:none">📹 Video's</button>
        </div>
        <div class="dtab-pane dtab-vis" data-tab-id="theorie">
          <p class="dom-intro">${d.beschrijving}</p>
          <div class="tlbl" style="margin-top:14px">CE-onderwerpen</div>
          <div class="ttags">${d.onderwerpen.map(o=>`<span class="tt">${o}</span>`).join('')}</div>
          <div class="tlbl">Samenvatting</div>
          <div class="sam">${SAM_RICH[ST.vak.id+'_'+d.id]||d.sam}</div>
          ${d.val&&d.val.length?`<div class="sam-val"><ul>${d.val.map(v=>`<li>${v}</li>`).join('')}</ul></div>`:''}
          ${d.binas&&d.binas.length?`<div class="sam-binas">${d.binas.map(b=>`<span class="sam-binas-tag">${b}</span>`).join('')}</div>`:''}
          <div class="sam-cta"><button class="sam-cta-btn" onclick="event.stopPropagation();openQmode('${d.id}')">▶ Oefenen op dit domein</button><button class="sam-print-btn" onclick="event.stopPropagation();printSam()">📄 Samenvatting printen</button></div>
        </div>
        <div class="dtab-pane" data-tab-id="quiz"></div>
        <div class="dtab-pane" data-tab-id="vids"></div>
      </div>`;
    dl.appendChild(el);
    initSamInteractive(el, d);
  });
  initMf();
  updateLpEntryCard();
  // Examen entry button — toon alleen als er een echt examen beschikbaar is voor dit vak + niveau
  const _exBtn = document.getElementById('exam-entry-btn');
  const _exSub = document.getElementById('exam-entry-sub');
  const _allEx = typeof EXAMENS !== 'undefined' && EXAMENS[ST.vak.id];
  const _exLijst = _allEx ? _allEx.filter(e=>!e.niveau||e.niveau===APP_LEVEL) : [];
  if(_exBtn){
    if(_exLijst.length > 0){
      const _ex0 = _exLijst[0];
      _exBtn.style.display = '';
      if(_exSub) _exSub.textContent = `${_ex0.jaar} Tijdvak ${_ex0.tijdvak} · ${_ex0.vragen.length} vragen · ${_ex0.duur_minuten} min`;
    } else {
      _exBtn.style.display = 'none';
    }
  }
  show('sc-detail');
  // Deep-link: als ?domein=X is meegegeven, open dat domein automatisch
  try{
    const _dl=sessionStorage.getItem('_slagio_open_domein');
    if(_dl){
      sessionStorage.removeItem('_slagio_open_domein');
      const _dom=ST.vak?.domeinen?.find(d=>d.id===_dl);
      if(_dom) setTimeout(()=>openQmode(_dl),200);
    }
  }catch(e){}
}

// ── LESMETHODE FILTER LOGIC ──────────────────────────────
function initMf(){
  const vak=ST.vak;
  const el=document.getElementById('methode-filter');
  if(!vak||!el)return;
  const niveau=(ST.niveau||'havo').toLowerCase();
  const vakData=LESMETHODES[vak.id];
  const methodes=vakData?(vakData[niveau]||vakData.havo||[]):[];
  if(!methodes.length){el.style.display='none';return;}
  el.style.display='';
  const mSel=document.getElementById('mf-methode');
  mSel.innerHTML='<option value="">— Kies methode —</option>'+
    methodes.map(m=>`<option value="${m.id}">${m.naam} · ${m.uitgever}</option>`).join('');
  const hSel=document.getElementById('mf-hoofdstuk');
  hSel.style.display='none';hSel.disabled=true;
  document.getElementById('mf-chip').style.display='none';
  const saved=_mfLoad(vak.id+'_'+niveau);
  if(saved&&saved.methodeId){
    mSel.value=saved.methodeId;
    _mfFillHfdst(saved.methodeId,methodes,false);
    if(saved.hfdstNr){
      hSel.value=String(saved.hfdstNr);
      _mfApply(saved.methodeId,saved.hfdstNr,methodes);
    }
    el.classList.add('open');
  }
}
function _mfFillHfdst(mid,methodes,reset){
  const m=methodes.find(x=>x.id===mid);
  const hSel=document.getElementById('mf-hoofdstuk');
  if(!m){hSel.style.display='none';return;}
  hSel.innerHTML='<option value="">— Kies hoofdstuk —</option>'+
    m.hoofdstukken.map(h=>`<option value="${h.nr}">H${h.nr}: ${h.titel}</option>`).join('');
  hSel.style.display='';hSel.disabled=false;
  if(reset)hSel.value='';
}
function _mfApply(mid,hnr,methodes){
  const m=methodes.find(x=>x.id===mid);
  if(!m)return;
  const h=m.hoofdstukken.find(x=>x.nr===hnr);
  if(!h)return;
  document.querySelectorAll('#dlist [data-domein-id]').forEach(el=>{
    el.style.display=h.domeinen.includes(el.dataset.domeinId)?'':'none';
  });
  const chip=document.getElementById('mf-chip');
  const txt=document.getElementById('mf-chip-txt');
  if(chip)chip.style.display='flex';
  if(txt)txt.textContent=`${m.naam} · H${hnr}: ${h.titel} (domein${h.domeinen.length>1?'en':''} ${h.domeinen.join(', ')})`;
}
function onMfMethodeChange(){
  const vak=ST.vak;if(!vak)return;
  const niveau=(ST.niveau||'havo').toLowerCase();
  const vakData=LESMETHODES[vak.id];
  const methodes=vakData?(vakData[niveau]||vakData.havo||[]):[];
  const mid=document.getElementById('mf-methode').value;
  if(!mid){resetMf();return;}
  _mfFillHfdst(mid,methodes,true);
  document.getElementById('mf-chip').style.display='none';
  document.querySelectorAll('#dlist [data-domein-id]').forEach(el=>el.style.display='');
  _mfClear(vak.id+'_'+niveau);
}
function onMfHoofdstukChange(){
  const vak=ST.vak;if(!vak)return;
  const niveau=(ST.niveau||'havo').toLowerCase();
  const vakData=LESMETHODES[vak.id];
  const methodes=vakData?(vakData[niveau]||vakData.havo||[]):[];
  const mid=document.getElementById('mf-methode').value;
  const hnr=parseInt(document.getElementById('mf-hoofdstuk').value);
  if(!mid||!hnr){
    document.getElementById('mf-chip').style.display='none';
    document.querySelectorAll('#dlist [data-domein-id]').forEach(el=>el.style.display='');
    return;
  }
  _mfApply(mid,hnr,methodes);
  _mfSave(vak.id+'_'+niveau,mid,hnr);
}
function resetMf(){
  const vak=ST.vak;
  const niveau=(ST.niveau||'havo').toLowerCase();
  const mSel=document.getElementById('mf-methode');
  const hSel=document.getElementById('mf-hoofdstuk');
  if(mSel)mSel.value='';
  if(hSel){hSel.innerHTML='<option value="">— Kies hoofdstuk —</option>';hSel.style.display='none';hSel.disabled=true;}
  document.getElementById('mf-chip').style.display='none';
  document.querySelectorAll('#dlist [data-domein-id]').forEach(el=>el.style.display='');
  if(vak)_mfClear(vak.id+'_'+niveau);
}
function _mfSave(key,mid,hnr){
  try{const d=JSON.parse(localStorage.getItem('slg_mf')||'{}');d[key]={methodeId:mid,hfdstNr:hnr};localStorage.setItem('slg_mf',JSON.stringify(d));}catch(e){}
}
function _mfLoad(key){
  try{return JSON.parse(localStorage.getItem('slg_mf')||'{}')[key]||null;}catch(e){return null;}
}
function _mfClear(key){
  try{const d=JSON.parse(localStorage.getItem('slg_mf')||'{}');delete d[key];localStorage.setItem('slg_mf',JSON.stringify(d));}catch(e){}
}

function updateLpEntryCard(){
  if(!ST.vak)return;
  const vak=ST.vak;
  const domeinen=vak.domeinen;
  let doneCount=0,startedCount=0,totalPct=0,pctCount=0;
  domeinen.forEach(d=>{
    const r=getDomeinBestPct(vak.id,d.id);
    const decay=getDecayStatus(vak.id,d.id);
    const isDone=r.pct>=0.7;
    const needsReview=isDone&&decay&&(decay.label.includes('geleden')&&!decay.label.includes('Vandaag'));
    if(isDone)doneCount++;
    else if(r.hasData)startedCount++;
    if(r.hasData){totalPct+=r.pct;pctCount++;}
  });
  const overallPct=Math.round(doneCount/domeinen.length*100);
  const allDone=doneCount===domeinen.length&&domeinen.length>0;

  // Sub text
  const sub=document.getElementById('lp-ec-sub');
  if(sub){
    if(allDone) sub.textContent='🏆 Alle domeinen voltooid!';
    else if(doneCount>0) sub.textContent=`${doneCount} van ${domeinen.length} domeinen voltooid`;
    else if(startedCount>0) sub.textContent=`${startedCount} domein${startedCount>1?'en':''} gestart — ga door!`;
    else sub.textContent='Begin met het eerste domein →';
  }

  // Footer
  const foot=document.getElementById('lp-ec-foot');
  if(foot) foot.textContent=`${doneCount}/${domeinen.length} domeinen op ≥70%${allDone?' 🎯':''}`;

  // Domain dots
  const dotsEl=document.getElementById('lp-ec-dots');
  if(dotsEl){
    dotsEl.innerHTML=domeinen.map(d=>{
      const r=getDomeinBestPct(vak.id,d.id);
      const decay=getDecayStatus(vak.id,d.id);
      const isDone=r.pct>=0.7;
      const needsReview=isDone&&decay&&(decay.label.includes('geleden')&&!decay.label.includes('Vandaag'));
      let cls='lp-ec-dot';
      if(needsReview) cls+=' d-review';
      else if(isDone) cls+=' d-done';
      else if(r.hasData) cls+=' d-started';
      return `<div class="${cls}" title="Domein ${d.id}: ${d.naam}"></div>`;
    }).join('');
  }

  // Progress bar (with tiny delay for animation)
  const bar=document.getElementById('lp-ec-bar');
  if(bar){
    bar.style.width='0%';
    setTimeout(()=>{bar.style.width=overallPct+'%';},80);
  }
}

// ═══════ UITLEG VIDEOS PER DOMEIN ═══════
// Voeg hier YouTube video-ID's toe per vak → domein.
// Formaat: UITLEG_VIDEOS[vakId][domeinId] = [{id:'YT_ID', titel:'...', kanaal:'...'}]
// Laat een domein weg of gebruik een lege array als er geen video is.
const UITLEG_VIDEOS = {
  nl: {
    A: [{id:'dQw4w9WgXcQ',titel:'Argumenteren & redeneren',kanaal:'ExamenTrainer NL'}],
    B: [{id:'dQw4w9WgXcQ',titel:'Leesvaardigheid – strategieën',kanaal:'ExamenTrainer NL'}],
    C: [{id:'dQw4w9WgXcQ',titel:'Luistervaardigheid uitgelegd',kanaal:'ExamenTrainer NL'}],
    D: [{id:'dQw4w9WgXcQ',titel:'Schrijfvaardigheid: opbouw tekst',kanaal:'ExamenTrainer NL'}],
    E: [{id:'dQw4w9WgXcQ',titel:'Stellen & formuleren',kanaal:'ExamenTrainer NL'}],
    F: [{id:'dQw4w9WgXcQ',titel:'Spreken & gesprekken voeren',kanaal:'ExamenTrainer NL'}]
  },
  wa: {
    B: [{id:'dQw4w9WgXcQ',titel:'Verbanden & veranderingen',kanaal:'WiskundeAcademie'}],
    C: [{id:'dQw4w9WgXcQ',titel:'Meetkunde – basisconcepten',kanaal:'WiskundeAcademie'}],
    D: [{id:'dQw4w9WgXcQ',titel:'Statistiek & kansen',kanaal:'WiskundeAcademie'}],
    E: [{id:'dQw4w9WgXcQ',titel:'Discrete wiskunde',kanaal:'WiskundeAcademie'}]
  },
  bi: {
    A: [{id:'dQw4w9WgXcQ',titel:'Cellen & stofwisseling',kanaal:'BioExamen'}],
    M: [{id:'dQw4w9WgXcQ',titel:'Organismen & ecosystemen',kanaal:'BioExamen'}],
    O: [{id:'dQw4w9WgXcQ',titel:'Evolutie & erfelijkheid',kanaal:'BioExamen'}],
    P: [{id:'dQw4w9WgXcQ',titel:'Mens & omgeving',kanaal:'BioExamen'}]
  },
  en: {
    A: [{id:'dQw4w9WgXcQ',titel:'Reading comprehension strategies',kanaal:'English HAVO'}],
    B: [{id:'dQw4w9WgXcQ',titel:'Listening skills – exam tips',kanaal:'English HAVO'}],
    C: [{id:'dQw4w9WgXcQ',titel:'Writing: essay structure',kanaal:'English HAVO'}],
    D: [{id:'dQw4w9WgXcQ',titel:'Speaking & conversation',kanaal:'English HAVO'}],
    E: [{id:'dQw4w9WgXcQ',titel:'Vocabulary in context',kanaal:'English HAVO'}],
    F: [{id:'dQw4w9WgXcQ',titel:'Grammar essentials',kanaal:'English HAVO'}]
  },
  ec: {
    B: [{id:'dQw4w9WgXcQ',titel:'Vraag & aanbod uitgelegd',kanaal:'EconomieExamen'}],
    C: [{id:'dQw4w9WgXcQ',titel:'Overheid & markt',kanaal:'EconomieExamen'}],
    D: [{id:'dQw4w9WgXcQ',titel:'Macro-economie basics',kanaal:'EconomieExamen'}],
    E: [{id:'dQw4w9WgXcQ',titel:'Internationale economie',kanaal:'EconomieExamen'}]
  }
};

function initSamInteractive(container, d) {
  // 1. Collapsible sam-head sections
  const samEl = container.querySelector('.sam');
  if (samEl) {
    samEl.querySelectorAll('.sam-head').forEach(h => {
      h.addEventListener('click', () => {
        const collapsed = h.classList.toggle('sh-collapsed');
        // toggle ALL siblings until next sam-head (ul, tip, warn, check, onthoud, etc.)
        let sib = h.nextElementSibling;
        while (sib && !sib.classList.contains('sam-head')) {
          sib.classList.toggle('sam-ul-hidden', collapsed);
          sib = sib.nextElementSibling;
        }
      });
    });

    // 1a. Interactieve Q&A (.qa/.q/.hint/.a)
    samEl.querySelectorAll('.qa').forEach(qa => {
      const q = qa.querySelector('.q');
      if (!q) return;
      q.addEventListener('click', () => {
        qa.classList.toggle('qa-open');
      });
    });

    // 1b. Leesvoortgang — progress bar + per-sectie vinkje
    {
      const vakId = (typeof ST!=='undefined'&&ST.vak)?ST.vak.id:'x';
      const domId = d.id||'x';
      const key = `slagio_read_${vakId}_${domId}`;
      let readSet = new Set(JSON.parse(localStorage.getItem(key)||'[]'));
      const heads = [...samEl.querySelectorAll('.sam-head')];
      const total = heads.length;
      const prog = document.createElement('div');
      prog.className = 'sam-prog-wrap';
      prog.innerHTML = `<div class="sam-prog-bar"><div class="sam-prog-fill"></div></div><span class="sam-prog-label"></span>`;
      samEl.insertAdjacentElement('beforebegin', prog);
      const fill = prog.querySelector('.sam-prog-fill');
      const lbl = prog.querySelector('.sam-prog-label');
      const upd = () => {
        const n = readSet.size, pct = total ? n/total*100 : 0;
        fill.style.width = pct+'%';
        lbl.textContent = `${n}/${total} gelezen`;
        prog.classList.toggle('prog-done', n===total&&total>0);
      };
      heads.forEach(h => {
        const title = h.childNodes[0]?.textContent?.trim()||h.textContent.trim();
        const btn = document.createElement('button');
        btn.className = 'sam-head-ck'+(readSet.has(title)?' hck-done':'');
        btn.title = readSet.has(title)?'Ongelezen':'Gelezen markeren';
        btn.textContent = '✓';
        btn.addEventListener('click', e => {
          e.stopPropagation();
          readSet.has(title) ? readSet.delete(title) : readSet.add(title);
          btn.classList.toggle('hck-done', readSet.has(title));
          btn.title = readSet.has(title)?'Ongelezen':'Gelezen markeren';
          localStorage.setItem(key, JSON.stringify([...readSet]));
          upd();
        });
        h.insertBefore(btn, h.lastChild.nodeType===3 ? h.lastChild : null);
        h.appendChild(btn);
      });
      upd();
    }

    // 1c. Inline check-vragen — inject after every 2nd section, max 3 total
    if (d.sv && d.sv.length >= 2) {
      const heads = [...samEl.querySelectorAll('.sam-head')];
      const pool = [...d.sv].sort(() => Math.random() - .5);
      let qi = 0, added = 0;
      heads.forEach((h, hi) => {
        if (added >= 3 || qi >= pool.length) return;
        if ((hi + 1) % 2 !== 0) return; // every 2nd section
        // find last sibling of this section
        let last = h.nextElementSibling;
        while (last?.nextElementSibling && !last.nextElementSibling.classList.contains('sam-head')) last = last.nextElementSibling;
        if (!last) return;
        const q = pool[qi++];
        const sh = q.o.map((t,i)=>({t,i})).sort(()=>Math.random()-.5);
        const ci = sh.findIndex(s=>s.i===q.c);
        const ck = document.createElement('div');
        ck.className = 'sam-check';
        ck.innerHTML = `<div class="sam-check-label">✓ Check je begrip</div><div class="sam-check-q">${q.v}</div><div class="sam-check-opts">${sh.map((s,i)=>`<button class="sam-check-opt" data-i="${i}">${s.t}</button>`).join('')}</div>`;
        last.insertAdjacentElement('afterend', ck);
        added++;
        ck.querySelectorAll('.sam-check-opt').forEach(btn => {
          btn.addEventListener('click', function() {
            if (ck.classList.contains('ck-done')) return;
            ck.classList.add('ck-done');
            const i = +this.dataset.i, ok = i===ci;
            this.classList.add(ok ? 'ck-correct' : 'ck-wrong');
            if (!ok) ck.querySelectorAll('.sam-check-opt')[ci]?.classList.add('ck-reveal');
            const fb = document.createElement('div');
            fb.className = `sam-check-fb ${ok?'fb-ok':'fb-err'}`;
            fb.textContent = ok ? '✓ Goed!' : `✗ ${(q.u||'').split('.')[0]||'Niet helemaal'}.`;
            ck.querySelector('.sam-check-opts').after(fb);
          });
        });
      });
    }

    // 1d. Auto CE-spotlight uit oe[] (fase 5) — alleen als nog geen sam-ce-spot aanwezig
    if (d.oe && d.oe.length > 0 && !samEl.querySelector('.sam-ce-spot')) {
      const ex = d.oe.slice(0, Math.min(2, d.oe.length));
      const spot = document.createElement('div');
      spot.className = 'sam-ce-spot sam-ce-auto';
      spot.innerHTML = ex.map((q,i) =>
        `${i>0?'<div class="sam-ce-sep"></div>':''}<div class="sam-ce-ex"><span class="sam-ce-bron">${q.bron||''}</span><div class="sam-ce-v">${q.v}</div></div>`
      ).join('');
      samEl.appendChild(spot);
    }
  }

  // 2. Tab wiring
  const dtop = container.querySelector('.dtop');
  if (!dtop) return;
  const tabBar = dtop.querySelector('.dtab-bar');
  if (tabBar) {
    tabBar.querySelectorAll('.dtab-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const target = btn.dataset.tab;
        tabBar.querySelectorAll('.dtab-btn').forEach(b => b.classList.remove('dtab-active'));
        dtop.querySelectorAll('.dtab-pane').forEach(p => p.classList.remove('dtab-vis'));
        btn.classList.add('dtab-active');
        dtop.querySelector(`[data-tab-id="${target}"]`)?.classList.add('dtab-vis');
      });
    });
  }

  // 3. YouTube uitleg video's — inject into video tab
  const vidPane = dtop.querySelector('[data-tab-id="vids"]');
  const vidTabBtn = dtop.querySelector('.dtab-vid-tab');
  if (vidPane && d.id) {
    const vakId = (typeof ST !== 'undefined' && ST.vak) ? ST.vak.id : '';
    const domId = d.id.toUpperCase();
    const vids = (UITLEG_VIDEOS[vakId] || {})[domId] || [];
    if (vids.length > 0) {
      if (vidTabBtn) vidTabBtn.style.display = '';
      vidPane.innerHTML = `<div class="sv-video-card-list">${vids.map(v=>`<a class="sv-video-item" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">
        <div class="sv-video-thumb-placeholder"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
        <div class="sv-video-info"><div class="sv-video-name">${v.titel}</div><div class="sv-video-ch">${v.kanaal}</div></div>
        <svg class="sv-video-arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </a>`).join('')}</div>`;
    }
  }

  // 4. Test jezelf mini-quiz — inject into quiz tab
  const quizPane = dtop.querySelector('[data-tab-id="quiz"]');
  if (!quizPane || !d.sv || d.sv.length < 3) return;
  const pool = [...d.sv].sort(() => Math.random() - 0.5).slice(0, 3);
  let cur = 0, score = 0;
  const tjEl = document.createElement('div');
  tjEl.className = 'tj';
  quizPane.appendChild(tjEl);
  function renderQ() {
    if (cur >= pool.length) {
      const pct = score / pool.length;
      const lbl = pct === 1 ? 'Perfecte score! 🎉' : pct >= 0.67 ? 'Goed gedaan! 👍' : 'Blijf oefenen! 💪';
      tjEl.innerHTML = `<div class="tj-hd"><span class="tj-title">⚡ Test jezelf</span><span class="tj-prog">Klaar!</span></div><div class="tj-body"><div class="tj-score-wrap"><div class="tj-score-num">${score}/${pool.length}</div><div class="tj-score-lbl">${lbl}</div><button class="tj-retry-btn">↺ Opnieuw proberen</button></div></div>`;
      tjEl.querySelector('.tj-retry-btn').addEventListener('click', () => { cur = 0; score = 0; pool.sort(() => Math.random() - 0.5); renderQ(); });
      return;
    }
    const q = pool[cur];
    const shuffled = q.o.map((text, i) => ({text, orig: i})).sort(() => Math.random() - 0.5);
    const correctIdx = shuffled.findIndex(s => s.orig === q.c);
    tjEl.innerHTML = `<div class="tj-hd"><span class="tj-title">⚡ Test jezelf</span><span class="tj-prog">${cur + 1}/${pool.length}</span></div><div class="tj-body"><div class="tj-q">${q.v}</div><div class="tj-opts">${shuffled.map((s, i) => `<button class="tj-opt" data-i="${i}">${s.text}</button>`).join('')}</div></div>`;
    tjEl.querySelectorAll('.tj-opt').forEach(btn => {
      btn.addEventListener('click', function () {
        if (tjEl.querySelector('.tj-opt.tj-c, .tj-opt.tj-w')) return;
        const i = +this.dataset.i;
        const ok = i === correctIdx;
        if (ok) score++;
        this.classList.add(ok ? 'tj-c' : 'tj-w');
        if (!ok) tjEl.querySelector(`.tj-opt[data-i="${correctIdx}"]`).classList.add('tj-c');
        tjEl.querySelectorAll('.tj-opt').forEach(b => b.disabled = true);
        const body = tjEl.querySelector('.tj-body');
        const fb = document.createElement('div');
        fb.className = 'tj-feedback';
        fb.textContent = q.u;
        body.appendChild(fb);
        const nb = document.createElement('button');
        nb.className = 'tj-next-btn';
        nb.textContent = cur < pool.length - 1 ? 'Volgende →' : 'Resultaat →';
        nb.addEventListener('click', () => { cur++; renderQ(); });
        body.appendChild(nb);
      });
    });
  }
  renderQ();
}

function printSam() {
  const dtopOpen = document.querySelector('.dtop.on');
  if (!dtopOpen) return;
  const samEl = dtopOpen.querySelector('.sam');
  if (!samEl) return;
  const domNaam = dtopOpen.previousElementSibling?.querySelector('h4')?.textContent || 'Samenvatting';
  const vakNaam = ST?.vak?.naam || '';
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${vakNaam} — ${domNaam}</title><style>
    body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1a1d26;font-size:13pt;line-height:1.8}
    .sam-head{font-size:10pt;font-weight:800;text-transform:uppercase;color:#888;margin:20px 0 4px;padding-top:16px;border-top:1px solid #ddd}
    .sam-head:first-child{border-top:none;padding-top:0;margin-top:0}
    ul{padding-left:16px;margin:4px 0 12px}li{padding:3px 0}strong{color:#222}
    .sam-tip{background:#f0fdf4;border-left:3px solid #22c55e;padding:8px 12px;margin:8px 0;border-radius:0 6px 6px 0}
    .sam-warn{background:#fef2f2;border-left:3px solid #ef4444;padding:8px 12px;margin:8px 0;border-radius:0 6px 6px 0}
    .sam-onthoud{background:#faf5ff;border:1.5px dashed #c084fc;border-radius:8px;padding:10px 14px;margin:10px 0}
    .sam-ce-spot{background:#fff7ed;border:1.5px solid #fdba74;border-radius:8px;padding:10px 14px;margin:10px 0}
    .sam-definitie{border-left:3px solid #6366f1;padding:8px 12px;margin:8px 0}
    .sam-definitie-term{font-size:9pt;font-weight:800;text-transform:uppercase;color:#6366f1}
    .sam-timeline{border-left:2px solid #f97316;padding:0 0 0 16px;list-style:none}
    .sam-timeline-date{font-weight:800;color:#f97316;font-size:9pt}
    .fm{font-family:monospace;background:#f0f0f0;padding:1px 6px;border-radius:4px}
    .sam-check,.sam-prog-wrap,.sam-head-ck,.sam-cta{display:none}
    @media print{body{margin:20mm}}
  </style></head><body>
    <h1>${vakNaam} — ${domNaam}</h1>
    ${samEl.innerHTML}
  </body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 300);
}

function toggleD(id){
  const el=document.getElementById(id);
  el.classList.toggle('on');
}

// ═══════ QUIZ DRAFT (crash recovery) ═══════
const QUIZ_DRAFT_KEY='slagio_quiz_draft';
function saveQuizDraft(){
  if(!ST.vragen.length||!ST.vak||!ST.domein||ST.idx<=0)return;
  try{
    localStorage.setItem(QUIZ_DRAFT_KEY,JSON.stringify({
      vakId:ST.vak.id,domeinId:ST.domein.id,mode:ST.mode,
      idx:ST.idx,score:ST.score,
      antwrd:ST.antwrd,tijdPerVraag:ST.tijdPerVraag||[],
      shuffleMaps:ST.shuffleMaps,combo:ST.combo,
      xpThisRound:ST.xpThisRound,isDailyChallenge:ST.isDailyChallenge,
      savedAt:Date.now()
    }));
  }catch(e){}
}
function clearQuizDraft(){localStorage.removeItem(QUIZ_DRAFT_KEY);}
// ── CHALLENGE LINKS ──────────────────────────────────────────────────
let _chalState=null; // {vakId,domeinId,score,naam} if launched from challenge URL

function parseChallengeHash(){
  try{
    const h=window.location.hash;
    if(!h.startsWith('#chal/'))return null;
    const parts=h.slice(6).split('/');
    if(parts.length<4)return null;
    return{vakId:parts[0],domeinId:parts[1],score:parseInt(parts[2])||0,naam:decodeURIComponent(parts[3]||'Iemand')};
  }catch(e){return null;}
}

function buildChallengeUrl(vakId,domeinId,score,naam){
  return'https://slagio.nl/#chal/'+vakId+'/'+domeinId+'/'+score+'/'+encodeURIComponent(naam);
}

function initChallengeOnLoad(){
  const c=parseChallengeHash();
  if(!c)return;
  _chalState=c;
  // Find vak+domein objects
  const allVakken=[...(typeof VAKKEN!=='undefined'?VAKKEN:[]),...(typeof VAKKEN_VWO!=='undefined'?VAKKEN_VWO:[])];
  const vak=allVakken.find(v=>v.id===c.vakId);
  const domein=vak&&vak.domeinen&&vak.domeinen.find(d=>d.id===c.domeinId);
  if(!vak||!domein){_chalState=null;return;}
  // Populate intro screen
  document.getElementById('chal-intro-naam').textContent=c.naam;
  document.getElementById('chal-intro-sub').textContent='daagt je uit bij '+vak.naam+' — '+domein.naam;
  document.getElementById('chal-intro-score').textContent=c.score;
  document.getElementById('chal-intro-max').textContent='/ 1000 punten';
  // Set up ST so accept goes straight to quiz
  ST.vak=vak;ST.domein=domein;
  show('sc-chal-intro');
  // Clear hash so it doesn't persist
  history.replaceState(null,'',window.location.pathname);
}

function acceptChallenge(){
  if(!_chalState||!ST.vak||!ST.domein){show('sc-home');return;}
  startQ('snel');
}

function renderChallengeResult(){
  const rWrap=document.getElementById('chal-result-wrap');
  const sWrap=document.getElementById('chal-share-wrap');
  if(!rWrap||!sWrap)return;
  if(!_chalState){rWrap.innerHTML='';sWrap.innerHTML='';return;}
  const myScore=ST.antwrd.reduce((s,a)=>s+a.pts*50+Math.round((a.tijdOver||0)/20*50),0);
  const theirScore=_chalState.score;
  const naam=_chalState.naam;
  const myWin=myScore>theirScore,tie=myScore===theirScore;
  const banner=myWin?'🏆 Jij wint van '+naam+'!':tie?'🤝 Gelijkspel!':'💪 '+naam+' wint — probeer het opnieuw!';
  const cls=myWin?'win':tie?'tie':'lose';
  rWrap.innerHTML=`<div class="chal-result-banner ${cls}">${banner}</div>
    <div class="chal-vs-card">
      <div class="chal-vs-side"><div class="chal-vs-label">Jij</div><div class="chal-vs-score ${myWin?'win':tie?'tie':'lose'}">${myScore}</div></div>
      <div class="chal-vs-divider">VS</div>
      <div class="chal-vs-side"><div class="chal-vs-label">${naam}</div><div class="chal-vs-score ${!myWin&&!tie?'win':tie?'tie':'lose'}">${theirScore}</div></div>
    </div>`;
  sWrap.innerHTML='';
}

function daagUit(){
  if(!ST.vak||!ST.domein)return;
  const naam=localStorage.getItem('slagio_naam')||(currentUser&&currentUser.user_metadata&&currentUser.user_metadata.naam)||'Jij';
  const myScore=ST.antwrd.reduce((s,a)=>s+a.pts*50+Math.round((a.tijdOver||0)/20*50),0);
  const url=buildChallengeUrl(ST.vak.id,ST.domein.id,myScore,naam);
  const tekst='Ik scoorde '+myScore+'/1000 bij '+ST.vak.naam+' op Slagio — kun jij mij verslaan? 🎯\n'+url;
  if(navigator.share){navigator.share({title:'Slagio uitdaging',text:tekst,url:url}).catch(()=>{});}
  else{navigator.clipboard.writeText(url).then(()=>showToast('Link gekopieerd! 📋')).catch(()=>showToast(url));}
}
// ── END CHALLENGE LINKS ───────────────────────────────────────────────

// ── GROEPSLEADERBOARD ─────────────────────────────────────────────────
const GRP_KEY='slagio_groep_v1'; // {id,code,name,role:'owner'|'member'}

function getMyGroep(){try{return JSON.parse(localStorage.getItem(GRP_KEY)||'null');}catch(e){return null;}}
function saveMyGroep(g){if(g)localStorage.setItem(GRP_KEY,JSON.stringify(g));else localStorage.removeItem(GRP_KEY);}

function genGroepCode(){return Math.random().toString(36).slice(2,8).toUpperCase();}

async function maakGroep(naam){
  if(!currentUser){showToast('Log eerst in om een groep aan te maken');return;}
  const code=genGroepCode();
  const displayName=localStorage.getItem('slagio_naam')||(currentUser.user_metadata&&currentUser.user_metadata.naam)||'Jij';
  try{
    const {data,error}=await SB.from('groups').insert({code,name:naam,created_by:currentUser.id}).select().single();
    if(error)throw error;
    await SB.from('group_members').insert({group_id:data.id,user_id:currentUser.id,display_name:displayName});
    saveMyGroep({id:data.id,code:data.code,name:data.name,role:'owner'});
    showToast('Groep aangemaakt! Code: '+code);
    renderGroepScreen();
  }catch(e){showToast('Fout bij aanmaken: '+e.message);}
}

async function doeGroepMee(code){
  if(!currentUser){showToast('Log eerst in om lid te worden van een groep');return;}
  const displayName=localStorage.getItem('slagio_naam')||(currentUser.user_metadata&&currentUser.user_metadata.naam)||'Jij';
  try{
    const {data:grp,error:e1}=await SB.from('groups').select('*').eq('code',code.toUpperCase().trim()).single();
    if(e1||!grp){showToast('Groep niet gevonden. Controleer de code.');return;}
    const {error:e2}=await SB.from('group_members').upsert({group_id:grp.id,user_id:currentUser.id,display_name:displayName});
    if(e2)throw e2;
    saveMyGroep({id:grp.id,code:grp.code,name:grp.name,role:'member'});
    showToast('Welkom bij '+grp.name+'!');
    renderGroepScreen();
  }catch(e){showToast('Fout: '+e.message);}
}

async function verlaarGroep(){
  const g=getMyGroep();if(!g||!currentUser)return;
  if(!confirm('Wil je de groep verlaten?'))return;
  await SB.from('group_members').delete().eq('group_id',g.id).eq('user_id',currentUser.id);
  saveMyGroep(null);
  showToast('Je hebt de groep verlaten');
  renderGroepScreen();
}

async function fetchGroepLeaderboard(groupId){
  try{
    const {data:members}=await SB.from('group_members').select('user_id,display_name').eq('group_id',groupId);
    if(!members||!members.length)return[];
    const userIds=members.map(m=>m.user_id);
    const {data:scores}=await SB.from('leaderboard').select('user_id,score,vak_naam,domein_naam,animal_id,stage_idx').in('user_id',userIds).order('score',{ascending:false});
    // Aggregate best score per user
    const best={};
    (scores||[]).forEach(r=>{if(!best[r.user_id]||r.score>best[r.user_id].score)best[r.user_id]={...r};});
    return members.map(m=>({...m,...(best[m.user_id]||{score:0})})).sort((a,b)=>b.score-a.score);
  }catch(e){return[];}
}

async function renderGroepScreen(){
  const wrap=document.getElementById('groep-content');
  if(!wrap)return;
  const g=getMyGroep();

  if(!g){
    wrap.innerHTML=`
      <div class="grp-hero">
        <div class="grp-hero-icon">🏆</div>
        <div class="grp-hero-title">Samen studeren, samen slagen</div>
        <div class="grp-hero-sub">Maak een groep met vrienden, klasgenoten of een studiegroep en vergelijk live wie de hoogste score haalt</div>
        <div class="grp-hero-pills">
          <span class="grp-hero-pill">👫 Vrienden</span>
          <span class="grp-hero-pill">🏫 Klas</span>
          <span class="grp-hero-pill">📚 Studiegroep</span>
        </div>
      </div>
      ${!currentUser?'<div class="grp-no-account">⚠️ Je moet ingelogd zijn om een groep aan te maken of te joinen.</div>':''}
      <div class="grp-split">
        <div class="grp-card" style="margin-bottom:0">
          <div class="grp-card-title">🔑 Code invoeren</div>
          <input class="grp-input" id="grp-join-code" placeholder="bijv. XK4M7R" maxlength="6">
          <button class="grp-join-btn" onclick="doeGroepMee(document.getElementById('grp-join-code').value)">Doe mee →</button>
        </div>
        <div class="grp-card" style="margin-bottom:0">
          <div class="grp-card-title">✨ Nieuwe groep</div>
          <input class="grp-input grp-create-input" id="grp-new-naam" placeholder="bijv. Vrienden 2026">
          <button class="grp-create-btn" onclick="maakGroep(document.getElementById('grp-new-naam').value)">+ Aanmaken</button>
        </div>
      </div>`;
    return;
  }

  wrap.innerHTML=`<div style="display:flex;justify-content:center;padding:48px 0"><div style="animation:spin 1s linear infinite;font-size:28px">⏳</div></div>`;
  const members=await fetchGroepLeaderboard(g.id);

  const colors=['#f97316','#6366f1','#22c55e','#ec4899','#14b8a6','#f59e0b','#3b82f6','#8b5cf6'];
  const col=(name)=>colors[(name||'?').charCodeAt(0)%colors.length];
  const ini=(name)=>(name||'?').slice(0,2).toUpperCase();
  const _myProf=JSON.parse(localStorage.getItem(PROF_KEY)||'{}');
  const _myEvo=_myProf.animalId?getAnimalEmoji(_myProf.animalId,getTotalXP()):null;
  const evoEmoji=(m)=>{
    const isMe=currentUser&&m.user_id===currentUser.id;
    if(isMe&&_myEvo)return _myEvo;
    if(!m.animal_id)return null;
    const a=getAnimalById(m.animal_id);
    if(!a)return null;
    const idx=m.stage_idx??0;
    return a.svg?(a.fallback?.[idx]||a.fallback?.[0]||'⭐'):(a.s[idx]||a.s[0]);
  };

  const sidebar=`
    <div class="grp-sidebar">
      <div class="grp-header-card">
        <div class="grp-header-emoji">👥</div>
        <div class="grp-header-name">${g.name}</div>
        <div class="grp-header-meta">${members.length} ${members.length===1?'lid':'leden'}</div>
        <div class="grp-code-label">Uitnodigingscode</div>
        <div class="grp-code-chip" onclick="navigator.clipboard.writeText('${g.code}').then(()=>showToast('Code gekopieerd! 📋'))" title="Klik om te kopiëren">
          <span class="grp-code-value">${g.code}</span>
          <span class="grp-code-btn">📋 Kopieer</span>
        </div>
        <div class="grp-header-hint">Stuur deze code naar vrienden of klasgenoten om ze toe te voegen aan de groep</div>
        <button class="grp-leave-btn" onclick="verlaarGroep()">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Groep verlaten
        </button>
      </div>
    </div>`;

  let scoreboard='';
  if(members.length===0){
    scoreboard=`<div class="grp-score-card"><div class="grp-empty">🏁 Nog geen scores<br><span style="font-size:12px">Maak een quiz om als eerste op het bord te komen!</span></div></div>`;
  } else {
    const top3=members.slice(0,Math.min(3,members.length));
    const rest=members.slice(top3.length);
    let podium='';
    if(members.length>=2){
      const slot=(m,cls,barH,barBg,medal,medalCls)=>{
        if(!m)return'';
        const isMe=currentUser&&m.user_id===currentUser.id;
        const emo=evoEmoji(m);
        const avContent=emo?`<span style="font-size:${cls==='first'?'26px':'18px'};line-height:1">${emo}</span>`:ini(m.display_name);
        const avBg=emo?(isMe?'rgba(var(--or-rgb),.12)':col(m.display_name)+'18'):col(m.display_name)+'22';
        const avBorder=emo?(isMe?'rgba(var(--or-rgb),.4)':col(m.display_name)+'55'):col(m.display_name)+'66';
        const clickAttr=isMe?`onclick="openProfiel()" style="cursor:pointer" title="Mijn profiel"`:``;
        return`<div class="grp-pod-col" ${clickAttr}>
          <div class="grp-pod-avatar ${cls}" style="background:${avBg};border-color:${avBorder};color:${col(m.display_name)}">${avContent}</div>
          <div class="grp-pod-name">${m.display_name||'?'}${isMe?'<br><span class="grp-me-badge">jij</span>':''}</div>
          <div class="grp-pod-score">${(m.score||0).toLocaleString('nl')} pts</div>
          <div class="grp-pod-bar" style="height:${barH}px;background:${barBg}"></div>
          <div class="grp-pod-medal ${medalCls}">${medal}</div>
        </div>`;
      };
      podium=`<div class="grp-podium">
        ${slot(top3[1],'','46','rgba(156,163,175,.18)','🥈','')}
        ${slot(top3[0],'first','70','rgba(234,179,8,.2)','🥇','first')}
        ${slot(top3[2],'','34','rgba(180,120,60,.18)','🥉','')}
      </div>`;
    }
    const listMembers=members.length>=2?rest:members;
    const medals=['🥇','🥈','🥉'];
    let rows='';
    listMembers.forEach((m,i)=>{
      const isMe=currentUser&&m.user_id===currentUser.id;
      const rank=members.length>=2?i+4:i+1;
      const emo=evoEmoji(m);
      const avContent=emo?`<span style="font-size:16px;line-height:1">${emo}</span>`:ini(m.display_name);
      const avBg=emo?(isMe?'rgba(var(--or-rgb),.12)':col(m.display_name)+'18'):col(m.display_name)+'22';
      const avBorder=emo?(isMe?'rgba(var(--or-rgb),.4)':col(m.display_name)+'44'):col(m.display_name)+'44';
      rows+=`<div class="grp-member-row${isMe?' me':''}"${isMe?' onclick="openProfiel()" style="cursor:pointer" title="Mijn profiel"':''}>
        <div class="grp-member-rank">${medals[rank-1]||rank}</div>
        <div class="grp-member-avatar" style="background:${avBg};color:${col(m.display_name)};border-color:${avBorder}">${avContent}</div>
        <div class="grp-member-info">
          <div class="grp-member-name">${m.display_name||'Onbekend'}${isMe?'<span class="grp-me-badge">jij</span>':''}</div>
          ${m.vak_naam?`<div class="grp-member-vak">Beste bij ${m.vak_naam}</div>`:''}
        </div>
        <div class="grp-member-score">${(m.score||0).toLocaleString('nl')}</div>
      </div>`;
    });
    scoreboard=`<div class="grp-score-card">
      <div class="grp-card-title">🏆 Scoreboard</div>
      ${podium}${rows}
    </div>`;
  }

  wrap.innerHTML=`<div class="grp-active-grid">${sidebar}${scoreboard}</div>`;
}
// ── END GROEPSLEADERBOARD ─────────────────────────────────────────────

// ── ADAPTIVE QUIZ PERFORMANCE ────────────────────────────────────────
const AQP_KEY='slagio_aqp_v1';
function aqpGet(){try{return JSON.parse(localStorage.getItem(AQP_KEY)||'{}')}catch(e){return{}}}
function aqpSave(d){try{localStorage.setItem(AQP_KEY,JSON.stringify(d))}catch(e){}}
function aqpDomainData(d,vakId,domeinId){const k=vakId+'_'+domeinId;if(!d[k])d[k]={};return d[k]}
function aqpQKey(q){return(q.v||'').slice(0,50)}
function aqpWeight(e){
  if(!e||e.n===0)return 2.0;
  const wr=e.w/e.n;
  let w=wr>0.5&&e.n>=2?4.0:wr>=0.2?2.5:0.6;
  if(e.ts&&(Date.now()-e.ts)/86400000>7)w*=1.4;
  return w;
}
function aqpSelectQuestions(pool,vakId,domeinId,count){
  if(!pool||pool.length<=count)return[...pool].sort(()=>Math.random()-.5);
  const d=aqpGet();
  const dom=aqpDomainData(d,vakId,domeinId);
  const keyed=pool.map(q=>({q,key:Math.pow(Math.random(),1/Math.max(0.01,aqpWeight(dom[aqpQKey(q)])))}));
  keyed.sort((a,b)=>b.key-a.key);
  return keyed.slice(0,count).map(x=>x.q);
}
function aqpRecord(q,pts){
  if(!ST||ST.mode!=='snel'||!ST.vak||!ST.domein)return;
  try{
    const d=aqpGet();
    const dom=aqpDomainData(d,ST.vak.id,ST.domein.id);
    const k=aqpQKey(q);
    if(!dom[k])dom[k]={n:0,w:0,ts:0};
    dom[k].n++;
    if(pts===0)dom[k].w++;
    dom[k].ts=Date.now();
    aqpSave(d);
  }catch(e){}
}
function aqpResetDomain(vakId,domeinId){
  const d=aqpGet();
  delete d[vakId+'_'+domeinId];
  aqpSave(d);
  showToast('Adaptieve voortgang gewist');
  renderAdaptiveResults();
}
function renderAdaptiveResults(){
  const wrap=document.getElementById('adaptive-res-wrap');
  if(!wrap||!ST||ST.mode!=='snel'||!ST.vak||!ST.domein){if(wrap)wrap.innerHTML='';return;}
  const d=aqpGet();
  const dom=aqpDomainData(d,ST.vak.id,ST.domein.id);
  const pool=(ST.domein&&ST.domein.sv)||[];
  const total=pool.length;
  const mastered=pool.filter(q=>{const e=dom[aqpQKey(q)];return e&&e.n>=3&&e.w/e.n<0.2;}).length;
  const mastPct=total>0?Math.round(mastered/total*100):0;
  const weak=Object.entries(dom).filter(([,e])=>e.n>=2&&e.w/e.n>0.5).sort((a,b)=>(b[1].w/b[1].n)-(a[1].w/a[1].n)).slice(0,4);
  const hasHistory=Object.values(dom).some(e=>e.n>0);
  if(!hasHistory){wrap.innerHTML='';return;}
  const barColor=mastPct>=70?'#22c55e':mastPct>=40?'#f59e0b':'#ef4444';
  let h=`<div class="adaptive-res-card">`;
  if(total>0){
    h+=`<div class="ar-mastery-row"><span class="ar-mastery-lbl">📊 Beheersing dit domein</span><span class="ar-mastery-val">${mastered}/${total} vragen (${mastPct}%)</span></div>`;
    h+=`<div class="ar-mastery-bar"><div class="ar-mastery-fill" style="width:${mastPct}%;background:${barColor}"></div></div>`;
  }
  if(weak.length>0){
    h+=`<div class="ar-weak-hdr">⚠️ Verbeterpunten</div><ul class="ar-weak-list">`;
    weak.forEach(([k,e])=>{
      const pct=Math.round(e.w/e.n*100);
      h+=`<li class="ar-weak-item"><span class="ar-weak-q">${k.slice(0,50)}…</span><span class="ar-weak-pct">${pct}% fout</span></li>`;
    });
    h+=`</ul>`;
  }
  h+=`<button class="ar-reset-btn" onclick="aqpResetDomain('${ST.vak.id}','${ST.domein.id}')">↺ Reset voortgang</button></div>`;
  wrap.innerHTML=h;
}
// ── END ADAPTIVE ─────────────────────────────────────────────────────
function getQuizDraft(){try{return JSON.parse(localStorage.getItem(QUIZ_DRAFT_KEY)||'null');}catch(e){return null;}}
function resumeQuizDraft(){
  const draft=getQuizDraft();
  if(!draft)return;
  const vak=getVK().find(v=>v.id===draft.vakId);
  if(!vak)return;
  const domein=vak.domeinen.find(d=>d.id===draft.domeinId);
  if(!domein)return;
  ST.vak=vak;ST.domein=domein;ST.mode=draft.mode;
  const pool=draft.mode==='snel'?domein.sv:domein.oe;
  ST.vragen=pool.slice();
  ST.idx=draft.idx;ST.score=draft.score;
  ST.antwrd=draft.antwrd||[];ST.tijdPerVraag=draft.tijdPerVraag||[];
  ST.shuffleMaps=draft.shuffleMaps||[];ST.combo=draft.combo||0;
  ST.xpThisRound=draft.xpThisRound||0;ST.isDailyChallenge=draft.isDailyChallenge||false;
  document.getElementById('qmeta').textContent=`${vak.naam} · D${domein.id}: ${domein.naam} · ${draft.mode==='snel'?'Snelle Quiz':'Oud-examen'}`;
  show('sc-quiz');
  const skel=document.getElementById('quiz-skeleton');const body=document.getElementById('qbody-inner');
  if(skel&&body){skel.style.display='flex';body.style.display='none';}
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(skel)skel.style.display='none';if(body)body.style.display='';
    toonV();
  }));
}

