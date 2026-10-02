// ═══════════════════════════════════════════════════════════════════════
// arcade2d.js - 2D-scènes voor de Arcade-minigames, in de stijl van Vonk
// ───────────────────────────────────────────────────────────────────────
// Vlakke vectorkunst: stevige vormen, elke vorm in twee tinten (licht + een
// donkerdere onderkant), een smalle witte glimlijn en een zachte slagschaduw.
// Geen verloop, geen glans, geen 3D-licht. Zelfde API als de oude 3D-laag:
// arcade.js roept a2Bom(host) enz. aan en daarna alleen haken via a3Haak(),
// bv. A3S.bom.knip(1). Ook de hub- en intro-illustraties komen hieruit (a2Art).
// Geladen vóór arcade.js (init.js: arcadeOpen).
// ═══════════════════════════════════════════════════════════════════════

var A3S = window.A3S || {};
window.A3S = A3S;

// ═══════ GEDEELD ═══════
const A2K = { // palet: [licht, schaduw]
  rood:['#FF4B4B','#D93636'], oranje:['#FF9600','#E07F00'], geel:['#FFC800','#E6A800'],
  groen:['#58CC02','#46A302'], blauw:['#1CB0F6','#1593CF'], paars:['#CE82FF','#A867D6'],
  grijs:['#E5E5E5','#C7C7C7'], inkt:['#4B4B4B','#3C3C3C'], hout:['#E8B46A','#C98E46'],
  papier:['#F5D7A8','#E3BD84'], staal:['#A9B6C4','#8796A6'],
};
function a2Stil(){try{return (typeof arcLite==='function'&&arcLite())||matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}
function a2Svg(vb,inner,cls,stijl){return `<svg class="a2-svg ${cls||''}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"${stijl?` style="${stijl}"`:''}>${inner}</svg>`;}
function a2Anim(el,frames,opt){if(!el||!el.animate||a2Stil())return null;return el.animate(frames,Object.assign({fill:'none'},opt||{}));}
// Draai/schaal rond een punt in viewBox-coördinaten.
function a2Om(el,x,y){if(el){el.style.transformBox='view-box';el.style.transformOrigin=`${x}px ${y}px`;}return el;}
function a2Schud(el,kracht,duur){return a2Anim(el,[{transform:'translateX(0)'},{transform:`translateX(${-kracht}px)`},{transform:`translateX(${kracht}px)`},{transform:`translateX(${-kracht*.6}px)`},{transform:`translateX(${kracht*.4}px)`},{transform:'translateX(0)'}],{duration:duur||360,easing:'ease-out'});}
function a2Plaats(host,svg,naam){
  host.innerHTML=svg;host.classList.add('a2',`a2-${naam}`);
  // 'dood' zodra de host niet meer in de pagina staat (zelfde betekenis als in de 3D-laag).
  return {host,get dood(){return !host.isConnected;}};
}
const $a2=(host,sel)=>host.querySelector(sel);
// Kleine vonkjes rond een punt (in viewBox-coördinaten).
function a2Spat(svg,x,y,kleuren,n){
  if(a2Stil()||!svg)return;const ns='http://www.w3.org/2000/svg';
  for(let i=0;i<(n||8);i++){const c=document.createElementNS(ns,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',3+Math.random()*3);
    c.setAttribute('fill',kleuren[i%kleuren.length]);svg.appendChild(c);const a=Math.PI*2*i/(n||8)+Math.random()*.4,d=22+Math.random()*22;
    c.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(.3)`,opacity:0}],{duration:520+Math.random()*200,easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=()=>c.remove();}
}
// Een uitdijende ring (inslag, succes, fout).
function a2Ring(svg,x,y,kleur,r,dik){
  if(a2Stil()||!svg)return;const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
  c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',r||30);c.setAttribute('fill','none');c.setAttribute('stroke',kleur);c.setAttribute('stroke-width',dik||6);
  a2Om(c,x,y);svg.appendChild(c);
  c.animate([{transform:'scale(.2)',opacity:1,strokeWidth:dik||6},{transform:'scale(1)',opacity:0,strokeWidth:1}],{duration:520,easing:'cubic-bezier(.15,.75,.3,1)'}).onfinish=()=>c.remove();
}
// Rookwolkjes die opbollen en vervagen.
function a2Rook(svg,x,y,n,kleur){
  if(a2Stil()||!svg)return;const ns='http://www.w3.org/2000/svg';
  for(let i=0;i<(n||6);i++){const c=document.createElementNS(ns,'circle');const r=10+Math.random()*12;c.setAttribute('cx',x+(Math.random()-.5)*60);c.setAttribute('cy',y+(Math.random()-.5)*30);c.setAttribute('r',r);
    c.setAttribute('fill',kleur||'#C7C7C7');svg.appendChild(c);const dx=(Math.random()-.5)*70,dy=-30-Math.random()*50;
    c.animate([{transform:'translate(0,0) scale(.3)',opacity:.95},{transform:`translate(${dx*.5}px,${dy*.5}px) scale(1.2)`,opacity:.8,offset:.4},{transform:`translate(${dx}px,${dy}px) scale(1.6)`,opacity:0}],
      {duration:900+Math.random()*500,delay:i*40,easing:'cubic-bezier(.2,.7,.3,1)',fill:'backwards'}).onfinish=()=>c.remove();}
}
// Brokstukken (rechthoekjes) die wegvliegen en tollen.
function a2Brok(svg,x,y,kleuren,n){
  if(a2Stil()||!svg)return;const ns='http://www.w3.org/2000/svg';
  for(let i=0;i<(n||8);i++){const r=document.createElementNS(ns,'rect');const w=8+Math.random()*12;r.setAttribute('x',x-w/2);r.setAttribute('y',y-4);r.setAttribute('width',w);r.setAttribute('height',8);r.setAttribute('rx',3);
    r.setAttribute('fill',kleuren[i%kleuren.length]);a2Om(r,x,y);svg.appendChild(r);const a=Math.PI*2*i/(n||8)+Math.random()*.5,d=90+Math.random()*80,rot=(Math.random()-.5)*900;
    r.animate([{transform:'translate(0,0) rotate(0deg)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d*.7+40}px) rotate(${rot}deg)`,opacity:0}],{duration:900+Math.random()*300,easing:'cubic-bezier(.15,.6,.4,1)'}).onfinish=()=>r.remove();}
}
// Vering: veel kleine overslagen naar een eindwaarde (voor rotaties).
function a2Veer(a){return [0,a*1.45,a*.72,a*1.16,a*.93,a];}
// Stervormige knal (voor 'boem' en laser-inslag).
function a2Ster(cx,cy,r1,r2,n){let d='';for(let i=0;i<n*2;i++){const r=i%2?r2:r1,a=Math.PI*i/n-Math.PI/2;d+=(i?'L':'M')+(cx+Math.cos(a)*r).toFixed(1)+' '+(cy+Math.sin(a)*r).toFixed(1);}return d+'Z';}

// ═══════ 💣 BOM ═══════
// Bundel dynamiet links, tijdklok rechts, drie draden ertussen.
const A2_BOM_DRAAD=['#ef4444','#3b82f6','#facc15'];
function a2BomGeo(){
  const sticks=[78,114,150],s=sticks.map(y=>({x:224,y:y+17})),e=[112,128,144].map(y=>({x:288,y}));
  return s.map((p,i)=>{const q=e[i],m={x:(p.x+q.x)/2,y:Math.max(p.y,q.y)+14};return {p,q,m};});
}
function a2BomSvg(o){
  o=o||{};const R=A2K.rood,P=A2K.papier,I=A2K.inkt;
  const stick=y=>`<rect x="44" y="${y}" width="180" height="34" rx="17" fill="${R[1]}"/><rect x="44" y="${y}" width="180" height="27" rx="13.5" fill="${R[0]}"/>
    <rect x="64" y="${y+6}" width="64" height="6" rx="3" fill="#fff" opacity=".45"/><rect x="44" y="${y}" width="17" height="34" rx="8.5" fill="${P[1]}"/><rect x="44" y="${y}" width="17" height="27" rx="8.5" fill="${P[0]}"/>
    <rect x="207" y="${y}" width="17" height="34" rx="8.5" fill="${P[1]}"/><rect x="207" y="${y}" width="17" height="27" rx="8.5" fill="${P[0]}"/>`;
  const band=x=>`<rect x="${x}" y="72" width="18" height="116" rx="6" fill="${I[1]}"/><rect x="${x}" y="72" width="18" height="108" rx="6" fill="${I[0]}"/>`;
  const draden=a2BomGeo().map((g,i)=>`<g class="a2-draad" data-i="${i}">
    <path class="h1" d="M${g.p.x} ${g.p.y}Q${g.p.x+12} ${g.m.y} ${g.m.x} ${g.m.y}" stroke="${A2_BOM_DRAAD[i]}" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path class="h2" d="M${g.m.x} ${g.m.y}Q${g.q.x-12} ${g.m.y} ${g.q.x} ${g.q.y}" stroke="${A2_BOM_DRAAD[i]}" stroke-width="6" stroke-linecap="round" fill="none"/></g>`).join('');
  const tijd=o.tijd||'00:30';
  return a2Svg('0 0 400 220',`
    <rect x="16" y="186" width="368" height="22" rx="11" fill="rgba(255,255,255,.07)"/>
    <ellipse cx="134" cy="190" rx="104" ry="8" fill="rgba(0,0,0,.28)"/><ellipse cx="334" cy="176" rx="50" ry="6" fill="rgba(0,0,0,.28)"/>
    <g class="a2-bundel">
      <path class="a2-lont" d="M50 84C26 72 40 44 22 30" stroke="#C8A06A" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g class="a2-vonkje" transform="translate(22 30)"><path d="${a2Ster(0,0,13,6,6)}" fill="${A2K.geel[0]}"/><circle r="4.5" fill="#fff"/></g>
      ${stick(150)}${stick(114)}${stick(78)}${band(84)}${band(172)}
    </g>
    ${draden}
    <g class="a2-klok">
      <rect x="288" y="88" width="92" height="84" rx="14" fill="#2c2f35"/><rect x="288" y="88" width="92" height="76" rx="14" fill="#4b4f57"/>
      <rect x="300" y="94" width="40" height="5" rx="2.5" fill="#fff" opacity=".18"/>
      <rect class="a2-scherm" x="298" y="102" width="72" height="34" rx="8" fill="#1d1f23"/>
      <text class="a2-tijd" x="334" y="126" text-anchor="middle" font-family="ui-monospace,'SF Mono',Menlo,monospace" font-weight="800" font-size="20" fill="${R[0]}">${tijd}</text>
      ${[0,1,2].map(i=>`<circle class="a2-led" data-i="${i}" cx="${312+i*22}" cy="151" r="5.5" fill="#2c2f35"/>`).join('')}
    </g>
    <g class="a2-knal" opacity="0">
      <path d="${a2Ster(200,112,150,86,14)}" fill="${A2K.geel[0]}"/><path d="${a2Ster(200,112,104,62,12)}" fill="${A2K.oranje[0]}"/>
      <path d="${a2Ster(200,112,62,38,10)}" fill="${R[0]}"/><circle cx="200" cy="112" r="24" fill="#fff"/>
    </g>`,'a2-bom-svg');
}
function a2Bom(host){
  const P=a2Plaats(host,a2BomSvg(),'bom');const B={P,uit:false};
  const svg=$a2(host,'svg'),geo=a2BomGeo();
  B.tijd=(sec,frac,krit)=>{if(B.uit||B.gestopt)return;const t=$a2(host,'.a2-tijd');if(t)t.textContent='00:'+String(Math.max(0,Math.round(sec))).padStart(2,'0');svg.classList.toggle('krit',!!krit);};
  B.knip=i=>{const d=$a2(host,`.a2-draad[data-i="${i}"]`);if(!d||d.dataset.uit)return;d.dataset.uit='1';const g=geo[i];
    const h1=a2Om(d.querySelector('.h1'),g.p.x,g.p.y),h2=a2Om(d.querySelector('.h2'),g.q.x,g.q.y);
    const rot=(el,a)=>{el.style.transform=`rotate(${a}deg)`;a2Anim(el,a2Veer(a).map(v=>({transform:`rotate(${v}deg)`})),{duration:900,easing:'ease-out'});};
    rot(h1,26);rot(h2,-26);a2Spat(svg,g.m.x,g.m.y,['#fff',A2K.geel[0],A2_BOM_DRAAD[i]],10);a2Ring(svg,g.m.x,g.m.y,'#fff',22,4);
    const led=$a2(host,`.a2-led[data-i="${i}"]`);if(led)led.setAttribute('fill',A2K.groen[0]);};
  B.fout=()=>{if(B.uit)return;a2Schud($a2(host,'.a2-bundel'),7,380);a2Schud($a2(host,'.a2-klok'),5,380);a2Ring(svg,334,119,A2K.rood[0],60,8);
    const s=$a2(host,'.a2-scherm');a2Anim(s,[{fill:A2K.rood[0]},{fill:'#1d1f23'}],{duration:420});};
  B.ok=()=>{B.gestopt=true;svg.classList.remove('krit');const s=$a2(host,'.a2-scherm'),t=$a2(host,'.a2-tijd');
    if(s)s.setAttribute('fill',A2K.groen[0]);if(t){t.textContent='VEILIG';t.setAttribute('fill','#fff');t.setAttribute('font-size','15');}
    const b=a2Om($a2(host,'.a2-bundel'),134,186);a2Anim(b,[{transform:'translateY(0) scale(1,1)'},{transform:'translateY(2px) scale(1.06,.9)',offset:.18},{transform:'translateY(-16px) scale(.96,1.06)',offset:.45},{transform:'translateY(0) scale(1.04,.95)',offset:.75},{transform:'translateY(0) scale(1,1)'}],{duration:640,easing:'ease-out'});
    a2Ring(svg,334,119,A2K.groen[0],70,8);
    const v=$a2(host,'.a2-vonkje'),l=$a2(host,'.a2-lont');if(v)v.style.display='none';if(l)l.setAttribute('stroke-dasharray','2 6');
    a2Spat(svg,334,119,[A2K.groen[0],A2K.geel[0],'#fff'],12);};
  B.boem=()=>{if(B.uit)return;B.uit=true;svg.classList.remove('krit');
    ['.a2-bundel','.a2-klok'].forEach(s=>{const el=$a2(host,s);if(el)el.style.opacity='0';});host.querySelectorAll('.a2-draad').forEach(d=>d.style.opacity='0');
    const k=a2Om($a2(host,'.a2-knal'),200,112);if(!k)return;k.setAttribute('opacity','1');
    a2Anim(k,[{transform:'scale(.1) rotate(-12deg)'},{transform:'scale(1.18) rotate(5deg)',offset:.4},{transform:'scale(.96) rotate(-2deg)',offset:.7},{transform:'scale(1) rotate(0deg)'}],{duration:620,easing:'cubic-bezier(.2,.9,.3,1)'});
    a2Ring(svg,200,112,A2K.geel[0],190,10);a2Brok(svg,200,112,[A2K.rood[0],A2K.papier[0],A2K.inkt[0],A2K.rood[1]],14);setTimeout(()=>a2Rook(svg,200,120,9,'#9a9a9a'),160);
    a2Schud(svg,10,700);};
  return B;
}

// ═══════ 👹 EXAMENBOSS ═══════
// Een stevig monster in de vakkleur, met hoorns, wenkbrauwen en tanden.
function a2BossSvg(kleur,code){
  const k=kleur||'#8b5cf6',sh=`color-mix(in srgb,${k} 74%,#000)`,lt=`color-mix(in srgb,${k} 62%,#fff)`,I=A2K.inkt;
  const body='M66 198C54 128 66 50 150 46C234 50 246 128 234 198Z';
  return a2Svg('0 -14 300 250',`
    <ellipse class="a2-schaduw" cx="150" cy="214" rx="88" ry="10" fill="rgba(0,0,0,.28)"/>
    <g class="a2-boss">
      <g class="a2-stoom" opacity="0"><circle cx="80" cy="30" r="10" fill="#fff" opacity=".85"/><circle cx="68" cy="16" r="7" fill="#fff" opacity=".7"/>
        <circle cx="220" cy="30" r="10" fill="#fff" opacity=".85"/><circle cx="232" cy="16" r="7" fill="#fff" opacity=".7"/></g>
      <rect x="102" y="192" width="38" height="20" rx="10" style="fill:${sh}"/><rect x="160" y="192" width="38" height="20" rx="10" style="fill:${sh}"/>
      <ellipse cx="66" cy="146" rx="13" ry="20" transform="rotate(22 66 146)" style="fill:${sh}"/><ellipse cx="234" cy="146" rx="13" ry="20" transform="rotate(-22 234 146)" style="fill:${sh}"/>
      <path d="M94 72L74 18L120 58Z" fill="#E9D9BC"/><path d="M94 72L74 18L104 64Z" fill="#FFF1D6"/>
      <path d="M206 72L226 18L180 58Z" fill="#E9D9BC"/><path d="M206 72L226 18L196 64Z" fill="#FFF1D6"/>
      <path class="a2-lijf" d="${body}" style="fill:${k}"/>
      <path d="M234 198C240 150 238 110 222 80C226 132 214 178 182 198Z" style="fill:${sh}"/>
      <path d="M66 198L234 198L234 188C190 196 110 196 66 188Z" style="fill:${sh}"/>
      <path d="M98 66C110 56 128 52 146 52" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".35"/>
      <ellipse cx="150" cy="176" rx="44" ry="18" style="fill:${lt}"/>
      <text x="150" y="182" text-anchor="middle" font-family="'Bricolage Grotesque',Inter,sans-serif" font-weight="800" font-size="15" style="fill:${sh}">${code||'CE'}</text>
      <circle class="a2-wang" cx="102" cy="132" r="11" fill="${A2K.rood[0]}" opacity="0"/><circle class="a2-wang" cx="198" cy="132" r="11" fill="${A2K.rood[0]}" opacity="0"/>
      <g class="a2-ogen"><ellipse cx="124" cy="104" rx="19" ry="21" fill="#fff"/><ellipse cx="176" cy="104" rx="19" ry="21" fill="#fff"/>
        <circle class="a2-pupil" cx="128" cy="109" r="8.5" fill="${I[1]}"/><circle class="a2-pupil" cx="172" cy="109" r="8.5" fill="${I[1]}"/>
        <circle cx="131" cy="106" r="2.6" fill="#fff"/><circle cx="175" cy="106" r="2.6" fill="#fff"/></g>
      <g class="a2-ko" opacity="0" stroke="${I[1]}" stroke-width="7" stroke-linecap="round"><path d="M112 94L136 116M136 94L112 116M164 94L188 116M188 94L164 116"/></g>
      <path class="a2-brauw" d="M102 78L142 92M198 78L158 92" stroke="${I[1]}" stroke-width="9" stroke-linecap="round"/>
      <path class="a2-mond" d="M116 136Q150 170 184 136Z" fill="${I[1]}"/><path d="M124 136L131 147L138 136ZM162 136L169 147L176 136Z" fill="#fff"/>
      <path class="a2-flits" d="${body}" fill="#fff" opacity="0"/>
      <g class="a2-ko-sterren" opacity="0"><g class="a2-draai">${[0,1,2].map(i=>{const a=i*Math.PI*2/3;return `<path d="${a2Ster(150+Math.cos(a)*48,44+Math.sin(a)*12,9,4,5)}" fill="${A2K.geel[0]}"/>`;}).join('')}</g></g>
    </g>
    <g class="a2-laser" opacity="0"><rect x="134" y="104" width="32" height="140" rx="16" fill="${A2K.geel[0]}"/><rect x="143" y="104" width="14" height="140" rx="7" fill="#fff"/>
      <path d="${a2Ster(150,108,52,26,10)}" fill="${A2K.geel[0]}"/><circle cx="150" cy="108" r="16" fill="#fff"/></g>`,'a2-boss-svg',`--a2k:${k}`);
}
function a2BossCode(){try{const v=arcVak(ARC.vakId);return _arcEsc(((v&&v.naam)||'CE').slice(0,2).toUpperCase());}catch(e){return 'CE';}}
function a2Boss(host,kleur){
  const P=a2Plaats(host,a2BossSvg(kleur,a2BossCode()),'boss');const B={P,uit:false};
  const svg=$a2(host,'svg'),boss=a2Om($a2(host,'.a2-boss'),150,212);
  const flits=()=>{const f=$a2(host,'.a2-flits');a2Anim(f,[{opacity:.85},{opacity:0}],{duration:260,easing:'ease-out'});};
  B.raak=(dmg,crit)=>{if(B.uit)return;flits();
    a2Anim(boss,[{transform:'scale(1,1)'},{transform:'scale(1.12,.86)'},{transform:'scale(.94,1.06)'},{transform:'scale(1,1)'}],{duration:380,easing:'ease-out'});
    a2Spat(svg,150,100,crit?[A2K.geel[0],'#fff',A2K.oranje[0]]:['#fff',A2K.geel[0]],crit?14:8);a2Ring(svg,150,104,crit?A2K.geel[0]:'#fff',crit?90:64,crit?9:6);};
  B.fase=f=>{if(B.uit)return;svg.classList.toggle('fase1',f>=1);svg.classList.toggle('fase2',f>=2);
    const st=$a2(host,'.a2-stoom');if(st)st.setAttribute('opacity',f>=1?'1':'0');host.querySelectorAll('.a2-wang').forEach(w=>w.setAttribute('opacity',f>=2?'.75':f>=1?'.4':'0'));
    a2Schud(boss,6,500);};
  B.laser=()=>{if(B.uit)return;const l=a2Om($a2(host,'.a2-laser'),150,236);if(!l)return;l.setAttribute('opacity','1');
    const a=a2Anim(l,[{transform:'scaleY(0)',opacity:1},{transform:'scaleY(1)',opacity:1,offset:.35},{transform:'scaleY(1)',opacity:1,offset:.7},{transform:'scaleY(1)',opacity:0}],{duration:560,easing:'ease-out'});
    if(a)a.onfinish=()=>l.setAttribute('opacity','0');else setTimeout(()=>l.setAttribute('opacity','0'),300);
    setTimeout(()=>{if(!B.uit){flits();a2Schud(boss,8,420);a2Spat(svg,150,104,[A2K.geel[0],'#fff',A2K.oranje[0]],16);}},200);};
  B.aanval=()=>{if(B.uit)return;svg.classList.add('aanval');setTimeout(()=>svg.classList.remove('aanval'),520);
    a2Anim(boss,[{transform:'scale(1) translateY(0)'},{transform:'scale(.94) translateY(6px)',offset:.25},{transform:'scale(1.18) translateY(-4px)',offset:.55},{transform:'scale(1) translateY(0)'}],{duration:520,easing:'ease-in-out'});};
  B.dood=()=>{if(B.uit)return;B.uit=true;svg.classList.add('ko');const o=$a2(host,'.a2-ogen'),ko=$a2(host,'.a2-ko');if(o)o.setAttribute('opacity','0');if(ko)ko.setAttribute('opacity','1');
    boss.style.transform='rotate(-14deg) translateY(16px)';a2Anim(boss,[{transform:'rotate(0deg) translateY(0)'},{transform:'rotate(6deg) translateY(-8px)',offset:.3},{transform:'rotate(-14deg) translateY(16px)'}],{duration:700,easing:'ease-in'});
    a2Spat(svg,150,90,[A2K.geel[0],'#fff'],14);a2Rook(svg,150,190,6,'#ffffff');const st=$a2(host,'.a2-ko-sterren');if(st)setTimeout(()=>st.setAttribute('opacity','1'),500);};
  B.juich=()=>{if(B.uit)return;svg.classList.add('juich');a2Anim(boss,[{transform:'translateY(0)'},{transform:'translateY(-16px)'},{transform:'translateY(0)'},{transform:'translateY(-10px)'},{transform:'translateY(0)'}],{duration:900,easing:'ease-in-out'});};
  return B;
}

// ═══════ 🎰 RISICO RUN ═══════
// Muntenstapels links (groeien met de pot), een kluis rechts.
function a2MuntSvg(x,y,cls){const G=A2K.geel;return `<g class="${cls||'a2-munt'}" transform="translate(${x} ${y})"><rect x="-26" y="-6" width="52" height="12" fill="${G[1]}"/><ellipse cy="6" rx="26" ry="7" fill="${G[1]}"/><ellipse cy="-6" rx="26" ry="7" fill="${G[0]}"/><ellipse cy="-6" rx="15" ry="3.6" fill="#FFE27A"/></g>`;}
function a2MuntPos(i){return {x:i%2?168:112,y:170-Math.floor(i/2)*11};}
function a2RisicoSvg(n){
  const S=A2K.staal;let munten='';for(let i=0;i<(n||0);i++){const p=a2MuntPos(i);munten+=a2MuntSvg(p.x,p.y);}
  return a2Svg('0 0 400 200',`
    <rect x="16" y="178" width="368" height="16" rx="8" fill="rgba(0,0,0,.14)"/>
    <ellipse cx="140" cy="180" rx="74" ry="7" fill="rgba(0,0,0,.18)"/><ellipse cx="300" cy="180" rx="66" ry="7" fill="rgba(0,0,0,.18)"/>
    <g class="a2-kluis">
      <rect x="244" y="164" width="18" height="16" rx="4" fill="${A2K.inkt[0]}"/><rect x="338" y="164" width="18" height="16" rx="4" fill="${A2K.inkt[0]}"/>
      <rect x="236" y="62" width="128" height="112" rx="16" fill="${S[1]}"/><rect x="236" y="62" width="128" height="104" rx="16" fill="${S[0]}"/>
      <rect x="250" y="76" width="100" height="78" rx="11" fill="#C3CEDA"/>
      <rect class="a2-kluis-rand" x="250" y="76" width="100" height="78" rx="11" fill="none" stroke="${A2K.geel[0]}" stroke-width="5" opacity="0"/>
      <g class="a2-wiel"><circle cx="300" cy="115" r="22" fill="${S[1]}"/><circle cx="300" cy="115" r="13" fill="#E6ECF2"/>
        <path d="M300 93V102M300 128V137M278 115H287M313 115H322" stroke="${S[1]}" stroke-width="5" stroke-linecap="round"/></g>
      <rect x="252" y="68" width="40" height="5" rx="2.5" fill="#fff" opacity=".4"/>
    </g>
    <g class="a2-munten">${munten}</g>`,'a2-risico-svg');
}
function a2Risico(host){
  const P=a2Plaats(host,a2RisicoSvg(0),'risico');const B={P,n:0};const svg=$a2(host,'svg'),box=$a2(host,'.a2-munten');
  const MAX=16;const doel=b=>Math.max(0,Math.min(MAX,Math.ceil((b||0)/10)));
  B.pot=bedrag=>{const d=doel(bedrag);const ns='http://www.w3.org/2000/svg';
    while(box.children.length<d){const i=box.children.length,p=a2MuntPos(i);const t=document.createElement('template');t.innerHTML=`<svg xmlns="${ns}">${a2MuntSvg(p.x,p.y)}</svg>`;const g=t.content.firstChild.firstChild;box.appendChild(g);
      a2Anim(g,[{transform:`translate(${p.x}px,${p.y-80}px) scale(.9,1.1)`,opacity:0},{transform:`translate(${p.x}px,${p.y-10}px) scale(.94,1.08)`,opacity:1,offset:.55},{transform:`translate(${p.x}px,${p.y+2}px) scale(1.14,.82)`,offset:.75},{transform:`translate(${p.x}px,${p.y}px) scale(1,1)`}],{duration:460,delay:Math.max(0,i-B.n)*70,easing:'ease-in',fill:'backwards'});}
    while(box.children.length>d)box.lastChild.remove();B.n=d;glim();};
  const glim=()=>{box.querySelectorAll('.a2-glim').forEach(x=>x.remove());const top=box.lastElementChild;if(!top)return;
    const t=document.createElement('template');t.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg"><path class="a2-glim" d="${a2Ster(12,-9,7,2,4)}" fill="#fff"/></svg>`;top.appendChild(t.content.firstChild.firstChild);};
  B.bank=()=>{const ms=[...box.children];ms.forEach((m,i)=>{const p=a2MuntPos(i);const a=a2Anim(m,[{transform:`translate(${p.x}px,${p.y}px) scale(1)`,opacity:1},{transform:`translate(${(p.x+300)/2}px,${Math.min(p.y,80)-40}px) scale(.8)`,opacity:1,offset:.5},{transform:'translate(300px,115px) scale(.25)',opacity:0}],{duration:520,delay:i*45,easing:'ease-in'});
      if(a)a.onfinish=()=>m.remove();else m.remove();});
    const r=$a2(host,'.a2-kluis-rand');setTimeout(()=>{if(r){r.setAttribute('opacity','1');a2Anim(r,[{opacity:1},{opacity:0}],{duration:700,delay:200});setTimeout(()=>r.setAttribute('opacity','0'),900);}
      a2Anim(a2Om($a2(host,'.a2-wiel'),300,115),[{transform:'rotate(0deg)'},{transform:'rotate(220deg)',offset:.6},{transform:'rotate(190deg)',offset:.8},{transform:'rotate(200deg)'}],{duration:800,easing:'ease-out'});
      a2Anim(a2Om($a2(host,'.a2-kluis'),300,174),[{transform:'scale(1,1)'},{transform:'scale(1.06,.94)',offset:.3},{transform:'scale(.97,1.04)',offset:.6},{transform:'scale(1,1)'}],{duration:520,easing:'ease-out'});
      a2Spat(svg,300,90,[A2K.geel[0],'#fff'],12);a2Ring(svg,300,115,A2K.geel[0],70,8);},ms.length*45+380);
    B.n=0;};
  B.verlies=()=>{const ms=[...box.children];ms.forEach((m,i)=>{const p=a2MuntPos(i),dx=(Math.random()-.5)*120;const a=a2Anim(m,[{transform:`translate(${p.x}px,${p.y}px) rotate(0deg)`,opacity:1},{transform:`translate(${p.x+dx*.5}px,${p.y-30}px) rotate(${dx}deg)`,opacity:1,offset:.35},{transform:`translate(${p.x+dx}px,${p.y+60}px) rotate(${dx*2}deg)`,opacity:0}],{duration:620,delay:i*20,easing:'ease-in'});
      if(a)a.onfinish=()=>m.remove();else m.remove();});a2Schud($a2(host,'.a2-kluis'),6,420);if(ms.length)a2Rook(svg,140,150,5,'#ffffff');B.n=0;};
  return B;
}

// ═══════ 🎯 ZWAKKE PLEK ═══════
// Dartbord in Slagio-oranje, met Vonk ernaast die meeleeft.
function a2BordSvg(pijlen){
  const O=A2K.oranje,C='#FFE9C7';const ring=[[84,A2K.inkt[0]],[76,C],[62,O[0]],[48,C],[34,O[0]],[20,C],[9,A2K.rood[0]]];
  return a2Svg('0 0 400 200',`
    <ellipse cx="184" cy="190" rx="72" ry="6" fill="rgba(0,0,0,.12)"/>
    <g class="a2-bord"><circle cx="184" cy="102" r="86" fill="${A2K.inkt[1]}"/>${ring.map(([r,f])=>`<circle cx="184" cy="${r===84?98:100}" r="${r}" fill="${f}"/>`).join('')}
      <path d="M126 52A78 78 0 0 1 172 26" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".35"/></g>
    <g class="a2-pijlen">${pijlen||''}</g>`,'a2-zwak-svg');
}
function a2PijlSvg(x,y,hoek){const B=A2K.blauw;return `<g class="a2-pijl" transform="translate(${x} ${y}) rotate(${hoek||0})"><path d="M0 0L30 -16" stroke="${A2K.inkt[0]}" stroke-width="4.5" stroke-linecap="round"/><path d="M26 -14L44 -28L46 -14Z" fill="${B[0]}"/><path d="M26 -14L46 -14L40 -4Z" fill="${B[1]}"/><circle r="3.4" fill="${A2K.inkt[1]}"/></g>`;}
function a2Zwak(host){
  const P=a2Plaats(host,a2BordSvg('')+`<div class="a2-vonk">${typeof mascotSVG==='function'?mascotSVG('kijk',96):''}</div>`,'zwak');const B={P};
  const box=$a2(host,'.a2-pijlen');let n=0;
  const vonk=st=>{const v=$a2(host,'.a2-vonk');if(v&&typeof mascotSVG==='function'){v.innerHTML=mascotSVG(st,96);a2Anim(v,[{transform:'translateY(0)'},{transform:'translateY(-8px)'},{transform:'translateY(0)'}],{duration:360,easing:'ease-out'});}};
  B.gooi=(goed,dicht)=>{
    const r=goed?Math.random()*Math.max(4,30*(1-(dicht||0))):46+Math.random()*30,a=Math.random()*Math.PI*2;
    const x=184+Math.cos(a)*r,y=100+Math.sin(a)*r*.96,h=-8+Math.random()*16;
    const t=document.createElement('template');t.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg">${a2PijlSvg(x,y,h)}</svg>`;const g=t.content.firstChild.firstChild;box.appendChild(g);n++;
    while(box.children.length>7)box.firstChild.remove();
    a2Anim(g,[{transform:`translate(${x+190}px,${y-70}px) rotate(${h-18}deg) scale(1.4)`,opacity:0},{transform:`translate(${x+30}px,${y-12}px) rotate(${h-6}deg) scale(1.08)`,opacity:1,offset:.7},{transform:`translate(${x}px,${y}px) rotate(${h}deg) scale(1)`,opacity:1}],{duration:340,easing:'cubic-bezier(.4,0,.6,1)'});
    setTimeout(()=>{g.style.transformBox='view-box';g.style.transformOrigin='0px 0px';
      a2Anim(g,a2Veer(7).map(v=>({transform:`translate(${x}px,${y}px) rotate(${h+v-7}deg)`})),{duration:700,easing:'ease-out'});a2Ring($a2(host,'svg'),x,y,goed?A2K.groen[0]:A2K.rood[0],goed?36:28,5);
      a2Schud($a2(host,'.a2-bord'),goed?2:4,240);if(goed)a2Spat($a2(host,'svg'),x,y,[A2K.groen[0],'#fff',A2K.geel[0]],8);vonk(goed?(dicht>=1?'feest':'trots'):'oeps');},300);};
  return B;
}

// ═══════ 🧩 SORTEER ═══════
// Een plank met vakjes; elk goed gekozen blok valt op zijn plek.
const A2_BLOK=['blauw','groen','oranje','paars','rood','geel'];
function a2SortGeo(n){const w=Math.min(56,(340-(n-1)*10)/n),tot=n*w+(n-1)*10,x0=200-tot/2;return Array.from({length:n},(_,i)=>({x:x0+i*(w+10),w}));}
function a2BlokSvg(i,v){const k=A2K[A2_BLOK[i%A2_BLOK.length]];const s=Math.min(v.w,56);return `<g class="a2-blok" data-i="${i}" transform="translate(${v.x+v.w/2} 86)"><rect x="${-s/2}" y="${-s/2}" width="${s}" height="${s}" rx="12" fill="${k[1]}"/><rect x="${-s/2}" y="${-s/2}" width="${s}" height="${s-7}" rx="12" fill="${k[0]}"/><rect x="${-s/2+8}" y="${-s/2+6}" width="${s*.38}" height="5" rx="2.5" fill="#fff" opacity=".45"/><text y="${s*.16}" text-anchor="middle" font-family="'Bricolage Grotesque',Inter,sans-serif" font-weight="800" font-size="${Math.round(s*.46)}" fill="#fff">${i+1}</text></g>`;}
function a2SorteerSvg(n,gevuld){
  n=Math.max(2,Math.min(8,n||5));const H=A2K.hout,geo=a2SortGeo(n);
  return a2Svg('0 0 400 160',`
    <rect x="22" y="120" width="356" height="26" rx="10" fill="${H[1]}"/><rect x="22" y="120" width="356" height="18" rx="9" fill="${H[0]}"/>
    <rect x="34" y="124" width="120" height="4" rx="2" fill="#fff" opacity=".35"/>
    <rect x="38" y="146" width="14" height="10" rx="3" fill="${H[1]}"/><rect x="348" y="146" width="14" height="10" rx="3" fill="${H[1]}"/>
    ${geo.map((v,i)=>`<rect class="a2-slot" data-i="${i}" x="${v.x}" y="${120-Math.min(v.w,56)-6}" width="${v.w}" height="${Math.min(v.w,56)+4}" rx="12" fill="rgba(0,0,0,.07)"/>`).join('')}
    <g class="a2-blokken">${(gevuld||[]).map(i=>a2BlokSvg(i,geo[i])).join('')}</g>`,'a2-sorteer-svg');
}
function a2Sorteer(host,aantal){
  const n=Math.max(2,Math.min(8,aantal||5));const P=a2Plaats(host,a2SorteerSvg(n),'sorteer');const B={P,n};const geo=a2SortGeo(n),box=$a2(host,'.a2-blokken'),svg=$a2(host,'svg');
  B.zet=i=>{if(i<0||i>=n||box.querySelector(`[data-i="${i}"]`))return;const v=geo[i];const t=document.createElement('template');t.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg">${a2BlokSvg(i,v)}</svg>`;const g=t.content.firstChild.firstChild;box.appendChild(g);
    const cx=v.x+v.w/2;g.style.transformBox='view-box';g.style.transformOrigin='0px 0px';
    a2Anim(g,[{transform:`translate(${cx}px,-50px) rotate(-14deg) scale(.9,1.1)`},{transform:`translate(${cx}px,86px) rotate(3deg) scale(.92,1.08)`,offset:.62},{transform:`translate(${cx}px,92px) rotate(0deg) scale(1.16,.8)`,offset:.74},{transform:`translate(${cx}px,80px) scale(.96,1.05)`,offset:.88},{transform:`translate(${cx}px,86px) scale(1,1)`}],{duration:560,easing:'ease-in'});
    setTimeout(()=>{a2Spat(svg,cx,118,['#fff',A2K.geel[0]],7);a2Ring(svg,cx,112,'#fff',34,4);},350);volgende();};
  const volgende=()=>{host.querySelectorAll('.a2-slot').forEach(r=>r.classList.remove('volgende'));for(let k=0;k<n;k++){if(!box.querySelector(`[data-i="${k}"]`)){const r=$a2(host,`.a2-slot[data-i="${k}"]`);if(r)r.classList.add('volgende');break;}}};
  volgende();
  B.fout=()=>{a2Schud(svg,6,360);};
  B.klaar=()=>{host.querySelectorAll('.a2-slot').forEach(r=>r.classList.remove('volgende'));[...box.children].forEach((g,k)=>{const i=+g.dataset.i,cx=geo[i].x+geo[i].w/2;g.style.transformBox='view-box';g.style.transformOrigin='0px 0px';
    a2Anim(g,[{transform:`translate(${cx}px,86px) scale(1,1)`},{transform:`translate(${cx}px,90px) scale(1.12,.86)`,offset:.15},{transform:`translate(${cx}px,58px) scale(.92,1.1)`,offset:.5},{transform:`translate(${cx}px,88px) scale(1.08,.9)`,offset:.82},{transform:`translate(${cx}px,86px) scale(1,1)`}],{duration:620,delay:k*80,easing:'ease-in-out'});});
    setTimeout(()=>a2Spat(svg,200,70,[A2K.geel[0],A2K.groen[0],A2K.blauw[0],'#fff'],16),n*70+200);};
  return B;
}

// ═══════ 🪤 VAL OF WAAR ═══════
// Een muizenval met kaas: klapt dicht bij een val, wiebelt als je hem doorziet.
function a2ValSvg(dicht){
  const H=A2K.hout,S=A2K.staal,G=A2K.geel;
  return a2Svg('0 0 400 160',`
    <ellipse cx="200" cy="140" rx="104" ry="7" fill="rgba(0,0,0,.25)"/>
    <g class="a2-val">
      <rect x="104" y="100" width="192" height="36" rx="10" fill="${H[1]}"/><rect x="104" y="100" width="192" height="26" rx="10" fill="${H[0]}"/>
      <rect x="116" y="105" width="70" height="4" rx="2" fill="#fff" opacity=".35"/>
      <g class="a2-kaas"><path d="M238 100L284 100L284 74Z" fill="${G[1]}"/><path d="M238 100L284 100L284 80L246 96Z" fill="${G[0]}"/><circle cx="268" cy="92" r="3.5" fill="${G[1]}"/><circle cx="277" cy="86" r="2.6" fill="${G[1]}"/></g>
      <circle cx="200" cy="98" r="9" fill="${S[1]}"/><circle cx="200" cy="96" r="6" fill="${S[0]}"/>
      <g class="a2-beugel" style="transform-box:view-box;transform-origin:200px 96px;transform:rotate(${dicht?0:180}deg)"><path d="M200 96H282" stroke="${S[1]}" stroke-width="7" stroke-linecap="round"/><path d="M282 96V84" stroke="${S[1]}" stroke-width="7" stroke-linecap="round"/></g>
    </g>
    <g class="a2-uitroep" opacity="0"><circle cx="200" cy="40" r="22" fill="${G[0]}"/><rect x="196" y="26" width="8" height="18" rx="4" fill="${A2K.inkt[1]}"/><circle cx="200" cy="51" r="4.5" fill="${A2K.inkt[1]}"/></g>`,'a2-val-svg');
}
function a2Val(host){
  const P=a2Plaats(host,a2ValSvg(false),'val');const B={P,klap:false};const svg=$a2(host,'svg'),beugel=$a2(host,'.a2-beugel'),val=a2Om($a2(host,'.a2-val'),200,136);
  const zet=d=>{beugel.style.transform=`rotate(${d}deg)`;};
  B.snap=()=>{B.klap=true;zet(0);a2Anim(beugel,[{transform:'rotate(180deg)'},{transform:'rotate(-8deg)',offset:.6},{transform:'rotate(0deg)'}],{duration:220,easing:'ease-in'});
    setTimeout(()=>{a2Anim(val,[{transform:'translateY(0) scale(1,1)'},{transform:'translateY(3px) scale(1.04,.92)',offset:.2},{transform:'translateY(-6px) scale(.98,1.04)',offset:.5},{transform:'translateY(0) scale(1,1)'}],{duration:420,easing:'ease-out'});
      a2Spat(svg,268,86,['#fff',A2K.staal[0],A2K.geel[0]],10);a2Ring(svg,270,92,'#fff',46,5);},150);
    clearTimeout(B._t);B._t=setTimeout(()=>{B.klap=false;zet(180);a2Anim(beugel,[{transform:'rotate(0deg)'},{transform:'rotate(180deg)'}],{duration:420,easing:'ease-out'});},1100);};
  B.ontdekt=()=>{const u=a2Om($a2(host,'.a2-uitroep'),200,62);if(u){u.setAttribute('opacity','1');a2Anim(u,[{transform:'scale(0)'},{transform:'scale(1.2)',offset:.6},{transform:'scale(1)'}],{duration:320,easing:'ease-out'});
      clearTimeout(B._u);B._u=setTimeout(()=>u.setAttribute('opacity','0'),900);}
    a2Anim(val,[{transform:'rotate(0deg)'},{transform:'rotate(-4deg)'},{transform:'rotate(3deg)'},{transform:'rotate(-2deg)'},{transform:'rotate(0deg)'}],{duration:460,easing:'ease-in-out'});};
  return B;
}

// ═══════ ILLUSTRATIES (hub + intro) ═══════
// Stilstaande versies van dezelfde scènes, op hun eigen achtergrondkleur.
function a2Art(naam){
  let svg='';
  if(naam==='bom')svg=a2BomSvg({tijd:'00:23'});
  else if(naam==='boss')svg=a2BossSvg('#8b5cf6','CE');
  else if(naam==='risico')svg=a2RisicoSvg(9);
  else if(naam==='zwak')svg=a2BordSvg(a2PijlSvg(178,96,-4)+a2PijlSvg(214,74,6))+`<div class="a2-vonk">${typeof mascotSVG==='function'?mascotSVG('trots',96):''}</div>`;
  else if(naam==='sorteer')svg=a2SorteerSvg(5,[0,1,2]);
  else if(naam==='val')svg=a2ValSvg(false);
  return `<div class="a2-art a2 a2-${naam}">${svg}</div>`;
}
