// ═══════════════════════════════════════════════════════════
//  SLAGIO - ECHTE CE-EXAMENVRAGEN (oud-examen oefenmodus)
//  Ontsluit de echte CE-vragen uit ce_data.js (CE_OE) als een
//  oud-examen-oefensurface per vak, gegroepeerd per jaar/tijdvak.
//  Tekst-only (geen figuren): de originele afbeeldingen + context
//  zitten alleen in de auteursrechtelijke bron-PDF's. Zodra die
//  bereikbaar zijn (scripts/download-examens.js) komen fig/ctx erbij.
// ═══════════════════════════════════════════════════════════

// Mojibake-hersteller: draait dubbel-gecodeerde UTF-8 terug en ruimt
// resterende rommel op (bv. "Ã©" -> "é", losse "â "-bullets -> weg).
function _ceClean(s){
  if(!s) return '';
  try{ if(/Ã.|â‚|â€|Â./.test(s)) s=decodeURIComponent(escape(s)); }catch(e){}
  return s
    .replace(/â€™|â€˜/g,"'").replace(/â€œ|â€|â€/g,'"')
    .replace(/â€“|â€”/g,'-').replace(/â€¦/g,'...').replace(/â€¢/g,'')
    .replace(/�/g,'')
    .replace(/â/g,'')
    .replace(/\s+/g,' ')
    .replace(/^[\s\-•·]+/,'')
    .trim();
}

// Lazy-load ce_data.js (alleen gebruikt door zoek + deze module).
function _ceEnsure(cb){
  if(typeof CE_OE!=='undefined'){cb();return;}
  const s=document.createElement('script');
  s.src='/ce_data.js';
  s.onload=()=>cb();
  s.onerror=()=>cb(); // zonder echte examens val je terug op de oefenvragen
  document.head.appendChild(s);
}

// Aantal echte HAVO/VWO CE-vragen voor een vak (voor de entry-knop).
function ceExamenCount(vakId){
  if(typeof CE_OE==='undefined') return null; // nog niet geladen
  const niv=(APP_LEVEL||'havo');
  return (CE_OE[vakId]||[]).filter(q=>_ceMatchesNiveau(q,niv)).length;
}
function _ceMatchesNiveau(q,niv){
  const isVwo=/\(VWO\)/i.test(q.bron||'');
  return niv==='vwo' ? isVwo : !isVwo; // havo/vmbo: alle niet-VWO-vragen
}

// Bouw oe-items uit CE_OE[vak] en open de bestaande oud-examenpicker
// via een synthetisch "Examenvragen"-domein (hergebruikt alle machinerie).
function openCEExamens(){
  if(!ST.vak){show('sc-detail');return;}
  _ceEnsure(()=>{
    const niv=(APP_LEVEL||'havo');
    const bron=(typeof CE_OE!=='undefined'&&CE_OE[ST.vak.id])||[];
    const oe=bron
      .filter(q=>_ceMatchesNiveau(q,niv))
      .map(q=>({jaar:q.jaar||null,tijdvak:q.tijdvak||1,bron:q.bron||'CE',
                v:_ceClean(q.v),o:[''],c:0,u:_ceClean(q.u)}))
      .filter(q=>q.v.length>4);
    if(!oe.length){
      if(typeof toast==='function')toast('Nog geen echte examenvragen voor dit vak.');
      return;
    }
    ST.domein={id:'CE',_ce:true,naam:'Echte examenvragen',oe};
    openOEPicker();
  });
}
