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

// ── Zelfstandigheidsfilter ───────────────────────────────────
// De CE_OE-vragen zijn gedistilleerd uit echte examens, maar de originele
// figuren + contextteksten zijn eruit gehaald. Veel vragen verwijzen naar
// die weggevallen context (figuur/tabel/casus) en zijn zonder afbeelding
// niet zelfstandig te maken. Tot de figuren erbij staan tonen we alleen
// vragen die op zichzelf te beantwoorden zijn. Best-effort heuristiek;
// bij twijfel filteren we liever te streng dan te ruim.
const _CE_MEDIA=/\b(figuur|afbeelding|grafiek|tabel|diagram|schema|curve|curven|curves|bron|tekst|artikel|fragment|foto|stamboom|kruisingsschema|formule|proefopstelling|proefopzet|afgebeeld|hierboven|hieronder|bovenstaand|onderstaand|hiernaast|weide|nestje|proefperso|onderzoeker|slangetje|toediening|het onderzoek|dit onderzoek)\b/i;
const _CE_ANAFOOR=/\b(deze|dit|dezelfde|genoemde|betreffende|dergelijke|zulke|bovengenoemde|voornoemde|voorgaande|zojuist)\b/i;
const _CE_REF=/\b(de volgende|andere factor|de andere|in ieder geval|het gegeven|gegeven dat|volgens de|de proef\b|de pati[eë]nt|deze pati[eë]nt)\b/i;
function _ceTrailing(v){const i=v.lastIndexOf('?');if(i<0||i>=v.length-2)return false;const tail=v.slice(i+1).trim();return tail.length>3&&/^[a-zà-ÿ]/.test(tail);}
function _ceProperNoun(v){
  const words=v.replace(/[?.,;:]/g,'').split(/\s+/).slice(1); // eerste woord overslaan
  return words.some(w=>/^[A-Z][a-zà-ÿ]{2,}$/.test(w) && !/^(DNA|RNA|ADH|ATP|EPO|MSUD|GZ|ADI)$/.test(w));
}
// True = zelfstandig te maken (mag getoond worden).
function _ceStandalone(v){
  if(!v||v.length<15) return false;
  if(_CE_MEDIA.test(v)||_CE_ANAFOOR.test(v)||_CE_REF.test(v)) return false;
  if(_ceTrailing(v)) return false;
  if((v.match(/\?/g)||[]).length>=2) return false;   // samengevoegde meerluik-vragen
  if(_ceProperNoun(v)) return false;                 // casus-specifieke eigennaam
  return true;
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
  return (CE_OE[vakId]||[]).filter(q=>_ceMatchesNiveau(q,niv)&&_ceStandalone(_ceClean(q.v))).length;
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
      .filter(q=>_ceStandalone(q.v)); // alleen zelfstandige vragen tot de figuren erbij staan
    if(!oe.length){
      if(typeof toast==='function')toast('Nog geen echte examenvragen voor dit vak.');
      return;
    }
    ST.domein={id:'CE',_ce:true,naam:'Echte examenvragen',oe};
    openOEPicker();
  });
}
