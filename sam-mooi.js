// ═══════ SAMENVATTING MOOI ═══════
// Werkt elke samenvatting bij het tonen bij, zonder de inhoud in sam-*.js aan te raken:
//  · figuren: kop met nummer en titel, leesbare letters (min. ~11 px op het scherm),
//    tekst die los staat van lijnen (halo), stevige lijnen, ronde hoeken, stippen met rand,
//    geen kleurwoorden die niet kloppen ("(oranje)" terwijl de lijn de niveaukleur heeft);
//  · structuur: "In deze samenvatting" met de onderdelen (tik = spring erheen), leestijd,
//    en onderaan "Alles op een rij" met de Onthoud-punten.
// Draait in de app (initSamInteractive in vak.js) en op de leerpagina's (/leren/).

(function(){
  var NS='http://www.w3.org/2000/svg';
  var DOEL_MAX=560; // zo breed wordt een figuur hooguit (styles.css: .sam-figure svg max-width)
  var MIN_PX=11.5;  // kleinste lettergrootte op het scherm

  function getal(v){var n=parseFloat(v);return isFinite(n)?n:null;}
  function attrOp(el,naam){ // attribuut, ook geërfd van een <g>
    for(var e=el;e&&e.getAttribute;e=e.parentNode){var v=e.getAttribute(naam);if(v!=null)return v;if(e.tagName&&e.tagName.toLowerCase()==='svg')break;}
    return null;
  }
  function heeftTransform(el){for(var e=el;e&&e.getAttribute;e=e.parentNode){if(e.tagName&&e.tagName.toLowerCase()==='svg')return false;if(e.getAttribute('transform'))return true;}return false;}
  var LEEG=/^(none|transparent)$/i;
  var WIT=/^(#fff|#ffffff|white|var\(--s\)|var\(--bg\)|var\(--bg2\)|rgba\(255,\s*255,\s*255)/i;

  // Vlakken (in svg-coördinaten) waar tekst op kan staan: dan geen halo, die zou een rand geven.
  function vlakken(svg){
    var uit=[];
    svg.querySelectorAll('rect,circle,ellipse,polygon,path').forEach(function(el){
      var f=attrOp(el,'fill');if(f==null)f=el.tagName.toLowerCase()==='path'?'none':'#000';
      if(LEEG.test(f))return;
      if(heeftTransform(el))return;
      var t=el.tagName.toLowerCase(),b=null;
      if(t==='rect'){var x=getal(el.getAttribute('x'))||0,y=getal(el.getAttribute('y'))||0,w=getal(el.getAttribute('width')),h=getal(el.getAttribute('height'));if(w&&h)b=[x,y,x+w,y+h];}
      else if(t==='circle'){var cx=getal(el.getAttribute('cx'))||0,cy=getal(el.getAttribute('cy'))||0,r=getal(el.getAttribute('r'));if(r&&r>6)b=[cx-r,cy-r,cx+r,cy+r];}
      else if(t==='ellipse'){var ex=getal(el.getAttribute('cx'))||0,ey=getal(el.getAttribute('cy'))||0,rx=getal(el.getAttribute('rx')),ry=getal(el.getAttribute('ry'));if(rx&&ry)b=[ex-rx,ey-ry,ex+rx,ey+ry];}
      else{ // polygon/path: ruwe omhullende uit de getallen
        var d=el.getAttribute(t==='polygon'?'points':'d')||'';if(t==='path'&&/[aAcCqQsStT]/.test(d)&&!/[zZ]/.test(d))return;
        var ns=(d.match(/-?\d*\.?\d+/g)||[]).map(Number);if(ns.length<6)return;
        var xs=[],ys=[];for(var i=0;i+1<ns.length;i+=2){xs.push(ns[i]);ys.push(ns[i+1]);}
        b=[Math.min.apply(0,xs),Math.min.apply(0,ys),Math.max.apply(0,xs),Math.max.apply(0,ys)];
        if(b[2]-b[0]<14||b[3]-b[1]<10)return;
      }
      if(b)uit.push(b);
    });
    return uit;
  }

  function kleurwoorden(fig,svg){
    var cap=fig.querySelector('.sam-figcap');if(!cap)return;
    var src=svg?svg.outerHTML:'';
    // "oranje" was de oude merkkleur; die lijnen hebben nu de niveaukleur.
    if(!/#f2994a|#f97316|#fb923c|#ea580c|orange/i.test(src)){
      cap.innerHTML=cap.innerHTML.replace(/\s*\((?:de\s+)?oranje\)/gi,'').replace(/\boranje\s+(?=(lijn|lijnen|stip|stippen|pijl|pijlen|vlak|vlakken|balk|balken|kromme|punt|punten|stippellijn|gebied|deel|band|blok|blokken|cirkel|vak|vakken)\b)/gi,'').replace(/\b(de|het|een)\s+oranje\b/gi,'$1 gekleurde');
    }
  }

  function figuurKop(fig){
    var cap=fig.querySelector('.sam-figcap');if(!cap||fig.querySelector('.sam-fig-kop'))return;
    var eerste=cap.firstElementChild,titel='';
    if(eerste&&eerste.tagName==='STRONG'&&cap.innerHTML.trim().indexOf('<strong')===0){
      titel=eerste.textContent.replace(/[:.\s]+$/,'').trim();
      if(titel.length>2&&titel.length<70){
        eerste.remove();
        cap.innerHTML=cap.innerHTML.replace(/^\s*[:.\-–]?\s*/,'');
        var t=cap.textContent.trim();if(t)cap.innerHTML=cap.innerHTML.replace(/^([a-zà-ÿ])/,function(m){return m.toUpperCase();});
        else cap.remove();
      }else titel='';
    }
    if(!titel){var svg=fig.querySelector(':scope>svg'),al=svg&&svg.getAttribute('aria-label');
      if(al){al=al.replace(/\s+/g,' ').trim();var kort=al.split(/[:.;]| - /)[0].trim();
        if(kort===al&&kort.length>=4&&kort.length<=48&&!/^(een|de|het)\s/i.test(kort))titel=kort.charAt(0).toUpperCase()+kort.slice(1);}}
    var kop=document.createElement('div');kop.className='sam-fig-kop';
    kop.innerHTML='<span class="sam-fig-nr"></span>'+(titel?'<span class="sam-fig-titel"></span>':'');
    if(titel)kop.querySelector('.sam-fig-titel').textContent=titel;
    fig.insertBefore(kop,fig.firstChild);
    fig.classList.add('sam-fig-mooi');
  }

  function svgMooi(svg,breedte){
    if(svg.dataset.mooi)return;svg.dataset.mooi='1';
    if(svg.closest('.sam-clip'))return; // clips hebben hun eigen choreografie
    var vb=(svg.getAttribute('viewBox')||'').split(/[\s,]+/).map(Number);
    var vbw=vb[2]||320;
    var schaal=Math.min(breedte||340,DOEL_MAX)/vbw;
    var vl=vlakken(svg);

    // Letters: kleine tekst groter, hooguit 22% erbij zodat het past.
    svg.querySelectorAll('text').forEach(function(t){
      var fsA=t.getAttribute('font-size'),fs=getal(fsA!=null?fsA:attrOp(t,'font-size'))||11;
      var nodig=MIN_PX/schaal;
      if(fs<nodig){var nw=Math.min(nodig,fs*1.22);t.setAttribute('font-size',Math.round(nw*10)/10);fs=nw;}
      var f=attrOp(t,'fill')||'';
      if(/var\(--or\)|rgba\(var\(--or-rgb\)/.test(f)&&!t.getAttribute('font-weight'))t.setAttribute('font-weight','650');
      if(WIT.test(f)||t.getAttribute('stroke')||heeftTransform(t))return;
      var x=getal(t.getAttribute('x')),y=getal(t.getAttribute('y'));
      if(x==null||y==null)return;
      var ym=y-fs*0.35;
      for(var i=0;i<vl.length;i++){var b=vl[i];if(x>=b[0]-2&&x<=b[2]+2&&ym>=b[1]-2&&ym<=b[3]+2)return;}
      t.classList.add('fig-halo');
    });

    // Lijnen: in grafieken de datalijnen steviger; overal ronde uiteinden, assen rustiger.
    svg.querySelectorAll('line').forEach(function(el){var s=attrOp(el,'stroke')||'';if(/var\(--mu\)/.test(s))el.classList.add('fig-as');});
    var grafiek=plotvlak(svg);
    svg.querySelectorAll('path,polyline,line').forEach(function(el){
      var s=attrOp(el,'stroke');if(!s||LEEG.test(s))return;
      var w=getal(attrOp(el,'stroke-width'))||1,f=attrOp(el,'fill');
      var tag=el.tagName.toLowerCase();
      if(/var\(--mu\)/.test(s)&&tag==='line'){el.classList.add('fig-as');return;}
      if(/var\(--bo\)/.test(s)){el.classList.add('fig-raster');return;}
      var data=(tag!=='line'||!el.getAttribute('stroke-dasharray'))&&(!f||LEEG.test(f));
      if(grafiek&&data&&w>=1.2&&w<2.2&&tag!=='line'&&!el.getAttribute('stroke-dasharray'))el.setAttribute('stroke-width','2.4');
    });

    // Vlakken: ronde hoeken.
    svg.querySelectorAll('rect').forEach(function(r){
      if(r.getAttribute('rx'))return;
      var w=getal(r.getAttribute('width')),h=getal(r.getAttribute('height'));if(!w||!h)return;
      var f=attrOp(r,'fill')||'#000';if(LEEG.test(f)&&!attrOp(r,'stroke'))return;
      if(w<6||h<6)return;
      r.setAttribute('rx',Math.round(Math.min(7,w/5,h/5)*10)/10);
    });

    // Stippen: een rand in de kleur van de kaart, zodat ze loskomen van de lijn.
    svg.querySelectorAll('circle').forEach(function(c){
      var r=getal(c.getAttribute('r'));if(!r||r>6.5||r<2)return;
      var f=attrOp(c,'fill')||'';if(LEEG.test(f)||WIT.test(f))return;
      if(c.getAttribute('stroke'))return;
      c.classList.add('fig-stip');
    });
    svg.classList.add('fig-svg');
  }

  // Grafiek met assen: een zacht vlak achter het plotgebied, zoals in een goed leerboek.
  function plotvlak(svg){
    var as=[].slice.call(svg.querySelectorAll('line.fig-as')).filter(function(l){return !heeftTransform(l);}).map(function(l){
      return [getal(l.getAttribute('x1')),getal(l.getAttribute('y1')),getal(l.getAttribute('x2')),getal(l.getAttribute('y2'))];
    }).filter(function(a){return a.every(function(v){return v!=null;});});
    var hor=as.filter(function(a){return Math.abs(a[1]-a[3])<0.5&&Math.abs(a[2]-a[0])>60;});
    var ver=as.filter(function(a){return Math.abs(a[0]-a[2])<0.5&&Math.abs(a[3]-a[1])>40;});
    if(hor.length!==1||ver.length!==1)return false;
    var h=hor[0],v=ver[0],x0=v[0],yb=h[1];
    var xl=Math.min(h[0],h[2]),xr=Math.max(h[0],h[2]),yt=Math.min(v[1],v[3]),ybot=Math.max(v[1],v[3]);
    if(Math.abs(xl-x0)>8||Math.abs(ybot-yb)>8)return false; // assen moeten elkaar in de hoek raken
    var r=document.createElementNS(NS,'rect');
    r.setAttribute('x',x0);r.setAttribute('y',yt);r.setAttribute('width',Math.max(0,xr-x0));r.setAttribute('height',Math.max(0,yb-yt));
    r.setAttribute('rx','4');r.setAttribute('class','fig-plot');
    var eerste=svg.firstElementChild;while(eerste&&/^(defs|title|desc|style)$/i.test(eerste.tagName))eerste=eerste.nextElementSibling;
    var ouder=eerste&&eerste.tagName.toLowerCase()==='g'&&!eerste.getAttribute('transform')?eerste:svg;
    ouder.insertBefore(r,ouder===svg?eerste:ouder.firstChild);
    return true;
  }

  // ── Structuur ──
  function tekstVan(el){var k=el.cloneNode(true);k.querySelectorAll('.sam-ch-n,.sam-head-n,.sam-head-ck,.sam-vink,button').forEach(function(x){x.remove();});return k.textContent.replace(/\s+/g,' ').trim();}
  var MINDER=function(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}};
  var VINK='<svg viewBox="0 0 24 24" aria-hidden="true"><path class="sam-vink-p" d="M6.5 12.5l3.6 3.6 7.4-8"/></svg>';

  // Emoji's weg uit de lopende tekst (✍ ✅ enz.); pijlen en wiskundige tekens blijven.
  function zonderEmoji(sam){
    var re=/(?:[☀-➿⭐⬆⬇⬅➡⤴⤵]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF])️?\s?/g;
    var houd=/[←-⇿∀-⋿✓✗×]/; // pijlen, wiskunde, ✓ ✗ ×
    var w=document.createTreeWalker(sam,NodeFilter.SHOW_TEXT,null),n,lijst=[];
    while((n=w.nextNode())){if(n.parentNode&&n.parentNode.closest&&n.parentNode.closest('svg'))continue;lijst.push(n);}
    lijst.forEach(function(t){var v=t.nodeValue;if(!re.test(v))return;re.lastIndex=0;
      t.nodeValue=v.replace(re,function(m){return houd.test(m)?m:'';}).replace(/^\s+/,t.previousSibling?' ':'');});
  }

  // Onderdelen: een sam-chapter, of een sam-head met alles tot de volgende kop.
  function onderdelen(sam){
    var koppen=[].slice.call(sam.querySelectorAll(':scope>.sam-chapter>.sam-ch-title,:scope>.sam-head,:scope>.sam-chapter>.sam-head'));
    return koppen.map(function(k,i){
      var o={kop:k,titel:tekstVan(k),nr:i+1};
      if(k.classList.contains('sam-ch-title')){o.blok=k.parentNode;o.eind=null;}
      else{o.blok=k;var s=k.nextElementSibling;while(s&&!s.classList.contains('sam-head')&&!s.classList.contains('sam-chapter')&&!s.classList.contains('sam-recap'))s=s.nextElementSibling;o.eind=s;}
      return o;
    });
  }

  function opslag(key){
    var lees=function(){try{return new Set(JSON.parse(localStorage.getItem(key)||'[]'));}catch(e){return new Set();}};
    return{lees:lees,zet:function(set){try{localStorage.setItem(key,JSON.stringify([].slice.call(set)));}catch(e){}}};
  }

  function voortgang(sam,delen,o){
    var key=(o&&o.leesKey)||('slagio_read_pagina_'+location.pathname);
    var st=opslag(key),gelezen=st.lees();
    var woorden=(sam.textContent||'').split(/\s+/).length,min=Math.max(1,Math.round(woorden/180));
    var nFig=sam.querySelectorAll('.sam-figure').length;

    // ── Donkere kop: in het kort + voortgang + onderdelen ──
    var intro=sam.querySelector(':scope>.sam-intro');
    var kop=document.createElement('section');kop.className='sam-kop';
    kop.innerHTML='<div class="sam-kop-meta"><span>'+delen.length+' onderdelen</span>'+(nFig?'<span>'+nFig+(nFig===1?' figuur':' figuren')+'</span>':'')+'<span>± '+min+' min</span></div>'+
      '<div class="sam-kop-bar" role="progressbar" aria-valuemin="0" aria-valuemax="'+delen.length+'"><span class="sam-kop-vul"></span></div>'+
      '<div class="sam-kop-stand"><span class="sam-kop-tel"></span><span class="sam-kop-klaar"></span></div>'+
      '<ol class="sam-kop-lijst"></ol>';
    if(intro){intro.classList.add('sam-kop-intro');kop.insertBefore(intro,kop.firstChild);}
    sam.insertBefore(kop,sam.firstChild);
    var lijst=kop.querySelector('.sam-kop-lijst');

    function spring(d){
      if(d.kop.classList.contains('sh-collapsed'))d.kop.click();
      var doel=d.blok;try{doel.scrollIntoView({behavior:MINDER()?'auto':'smooth',block:'start'});}catch(e){doel.scrollIntoView();}
    }

    delen.forEach(function(d,i){
      // rij in de kop
      var li=document.createElement('li');var b=document.createElement('button');b.type='button';b.className='sam-kop-rij';
      b.innerHTML='<span class="sam-kop-n"><span class="sam-kop-nr">'+d.nr+'</span>'+VINK+'</span><span class="sam-kop-t"></span>';
      b.querySelector('.sam-kop-t').textContent=d.titel;
      b.addEventListener('click',function(){spring(d);try{if(typeof trackEvent==='function')trackEvent('sam_inhoud',{n:d.nr});}catch(e){}});
      li.appendChild(b);lijst.appendChild(li);d.rij=b;

      // één nummering: hoofdstuknummers uit de inhoud volgen de volgorde van de onderdelen
      var chn=d.kop.querySelector('.sam-ch-n');if(chn)chn.textContent=d.nr;
      // nummer in de kantlijn bij een sam-head
      if(d.kop.classList.contains('sam-head')&&!d.kop.querySelector('.sam-head-n')){var n=document.createElement('span');n.className='sam-head-n';n.textContent=d.nr;d.kop.insertBefore(n,d.kop.firstChild);}

      // vinkje rechts in de kop
      var v=document.createElement('button');v.type='button';v.className='sam-vink';v.setAttribute('aria-label','Markeer '+d.titel+' als gelezen');
      v.innerHTML=VINK;v.addEventListener('click',function(e){e.stopPropagation();wissel(d,true);});
      d.kop.appendChild(v);d.vink=v;

      // "Klaar met dit deel" onderaan het onderdeel
      var k=document.createElement('button');k.type='button';k.className='sam-klaar';
      k.innerHTML='<span class="sam-klaar-c">'+VINK+'</span><span class="sam-klaar-t">Gelezen</span><span class="sam-klaar-door"></span>';
      k.addEventListener('click',function(){
        var was=gelezen.has(d.titel);wissel(d,true);
        if(!was&&delen[i+1]){setTimeout(function(){spring(delen[i+1]);},MINDER()?0:520);}
      });
      if(d.eind===null)d.blok.appendChild(k);else if(d.eind)sam.insertBefore(k,d.eind);else{var rc=sam.querySelector(':scope>.sam-recap');rc?sam.insertBefore(k,rc):sam.appendChild(k);}
      d.klaar=k;
    });

    function teken(d,feest){
      var aan=gelezen.has(d.titel);
      [d.vink,d.klaar,d.rij].forEach(function(el){if(!el)return;el.classList.toggle('aan',aan);if(feest&&aan){el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');}});
      d.vink.setAttribute('aria-pressed',aan?'true':'false');
      var volgende=delen[d.nr];
      d.klaar.querySelector('.sam-klaar-t').textContent=aan?'Gelezen':'Klaar met dit deel';
      d.klaar.querySelector('.sam-klaar-door').textContent=aan&&volgende?'Verder: '+volgende.titel:'';
    }
    function stand(feest){
      var n=delen.filter(function(d){return gelezen.has(d.titel);}).length,tot=delen.length;
      kop.querySelector('.sam-kop-vul').style.width=(tot?n/tot*100:0)+'%';
      kop.querySelector('.sam-kop-bar').setAttribute('aria-valuenow',n);
      kop.querySelector('.sam-kop-tel').textContent=n===tot?'Alles gelezen':n+' van '+tot+' gelezen';
      var klaar=n===tot&&tot>0;kop.classList.toggle('af',klaar);sam.classList.toggle('sam-af',klaar);
      kop.querySelector('.sam-kop-klaar').textContent=klaar?'Tijd om te oefenen':(n?'Nog '+(tot-n)+' te gaan':'Vink af wat je gelezen hebt');
      if(feest&&klaar)afgerond();
    }
    function afgerond(){
      var a=sam.querySelector('.sam-af-kaart');if(a)return;
      a=document.createElement('div');a.className='sam-af-kaart';
      var cta=document.querySelector('.sc.on .sam-cta-btn');
      a.innerHTML='<span class="sam-af-c">'+VINK+'</span><div><div class="sam-af-t">Alles gelezen</div><div class="sam-af-s">Zet het vast met een paar vragen.</div></div>'+(cta?'<button type="button" class="sam-af-knop">Oefen dit</button>':'');
      var b=a.querySelector('.sam-af-knop');if(b)b.addEventListener('click',function(){cta.click();});
      sam.appendChild(a);
      try{a.scrollIntoView({behavior:MINDER()?'auto':'smooth',block:'nearest'});}catch(e){}
    }
    function wissel(d,feest){
      if(gelezen.has(d.titel))gelezen.delete(d.titel);else{gelezen.add(d.titel);
        try{if(navigator.vibrate)navigator.vibrate(12);}catch(e){}
        try{if(typeof trackEvent==='function')trackEvent('sam_gelezen',{n:d.nr,totaal:delen.length});}catch(e){}
      }
      st.zet(gelezen);teken(d,feest&&gelezen.has(d.titel));stand(feest);
    }
    delen.forEach(function(d){teken(d,false);});stand(false);
    sam.dataset.lees='1';
  }

  function opEenRij(sam){
    if(sam.querySelector('.sam-recap'))return;
    var punten=[].slice.call(sam.querySelectorAll('.sam-onthoud')).map(function(o){
      var k=o.cloneNode(true);var s=k.firstElementChild;
      if(s&&s.tagName==='STRONG'&&/^\s*onthoud\b/i.test(s.textContent))s.remove();
      return k.innerHTML.replace(/^\s*[:.\-–]\s*/,'').trim();
    }).filter(function(h){return h&&h.replace(/<[^>]+>/g,'').trim().length>12;});
    sam.querySelectorAll('.sam-formula-box').forEach(function(b){
      var l=b.querySelector('.sam-formula-label'),e=b.querySelector('.sam-formula-eq');
      if(e)punten.push((l?'<strong>'+l.textContent.trim()+'</strong>':'')+'<span class="sam-recap-f">'+e.innerHTML+'</span>');
    });
    sam.querySelectorAll('.sam-definitie').forEach(function(b){
      var t=b.querySelector('.sam-definitie-term'),d=b.querySelector('.sam-definitie-body');
      if(t&&d)punten.push('<strong>'+t.textContent.trim()+':</strong> '+d.innerHTML);
    });
    if(punten.length<3)return;
    var box=document.createElement('div');box.className='sam-recap';
    box.innerHTML='<div class="sam-recap-kop">Alles op een rij</div><div class="sam-recap-sub">Ken je dit allemaal? Dan zit de basis erin.</div><ol>'+punten.slice(0,12).map(function(p){return '<li>'+p+'</li>';}).join('')+'</ol>';
    sam.appendChild(box);
  }

  window.samMooi=function(root,o){
    try{
      var sams=root&&root.classList&&root.classList.contains('sam')?[root]:[].slice.call((root||document).querySelectorAll('.sam'));
      sams.forEach(function(sam){
        if(sam.dataset.mooi||!sam.firstElementChild)return;sam.dataset.mooi='1';sam.classList.add('sam-v2');
        var br=sam.clientWidth||Math.min(window.innerWidth-32,720);
        zonderEmoji(sam);
        sam.querySelectorAll('.sam-figure').forEach(function(fig){
          var svg=fig.querySelector(':scope>svg');
          kleurwoorden(fig,svg);
          if(!fig.classList.contains('sam-frag')&&!fig.classList.contains('sam-clip'))figuurKop(fig);
          if(svg)svgMooi(svg,br-24);
        });
        opEenRij(sam);
        var delen=onderdelen(sam);
        if(delen.length>=2)voortgang(sam,delen,o);
      });
    }catch(e){try{console.warn('samMooi',e);}catch(_){}}
  };

  // Buiten de app (leerpagina's): zelf draaien.
  if(typeof initSamInteractive!=='function'&&typeof document!=='undefined'){
    var start=function(){if(typeof initSamInteractive!=='function')window.samMooi(document);};
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
  }
})();
