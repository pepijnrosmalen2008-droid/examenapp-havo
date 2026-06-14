path = r"C:\Users\pepij\examenapp-havo\index.html"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# ── FIX 1: Remove display:none from CSS classes so JS can control them freely ──
c = c.replace('.sim-open-area{display:none}', '.sim-open-area{display:none}', 1)  # placeholder
c = c.replace('.sim-open-area{display:none}', '.sim-open-area{}', 1)
c = c.replace('.sim-model-blok{display:none;', '.sim-model-blok{', 1)

# ── FIX 2: startSimToets — use ONLY oe questions (all of them, no MC sv pool) ──
old_pool = """  // Build question pool: 2 MC (sv) + 1 open (oe) per CE domain only
  const ceDomeinen=vak.domeinen.filter(d=>!d.ceStatus||d.ceStatus!=='SE');
  ceDomeinen.forEach(d=>{
    const svPool=(d.sv||[]).filter(q=>q.v&&q.o?.length>1&&q.c!==undefined);
    [...svPool].sort(()=>Math.random()-.5).slice(0,2)
      .forEach(q=>SIM.questions.push({...q,_type:'mc',domeinId:d.id,domeinNaam:d.naam,domeinKleur:vak.kleur}));
    const oePool=(d.oe||[]).filter(q=>q.v&&q.u);
    if(oePool.length){
      const oq=oePool[Math.floor(Math.random()*oePool.length)];
      SIM.questions.push({...oq,_type:'open',domeinId:d.id,domeinNaam:d.naam,domeinKleur:vak.kleur});
    }
  });
  SIM.questions.sort(()=>Math.random()-.5);

  const total=SIM.questions.length;
  const mcN=SIM.questions.filter(q=>q._type==='mc').length;
  const oeN=SIM.questions.filter(q=>q._type==='open').length;
  const mins=mcN*2+oeN*5;
  SIM.duration=mins*60;

  // Update setup screen
  document.getElementById('sim-nav-title').textContent=vak.naam+' — Simulatie';
  document.getElementById('sim-setup-title').textContent='Simulatietoets '+vak.naam;
  document.getElementById('sim-setup-desc').textContent=ceDomeinen.length+' CE-domeinen, '+total+' vragen ('+mcN+' MC + '+oeN+' open).';
  const grid=document.getElementById('sim-info-grid');
  grid.innerHTML=`
    <div class="sim-info-card"><div class="sim-info-num">${mcN}</div><div class="sim-info-lbl">MC-vragen</div></div>
    <div class="sim-info-card"><div class="sim-info-num">${oeN}</div><div class="sim-info-lbl">Open vragen</div></div>
    <div class="sim-info-card"><div class="sim-info-num">${mins} min</div><div class="sim-info-lbl">Tijdlimiet</div></div>
    <div class="sim-info-card"><div class="sim-info-num">${ceDomeinen.length}</div><div class="sim-info-lbl">CE-domeinen</div></div>`;"""

new_pool = """  // Build question pool: ALL oe (open) questions from CE domains only — no MC
  const ceDomeinen=vak.domeinen.filter(d=>!d.ceStatus||d.ceStatus!=='SE');
  ceDomeinen.forEach(d=>{
    (d.oe||[]).filter(q=>q.v&&q.u).forEach(q=>{
      SIM.questions.push({...q,_type:'open',domeinId:d.id,domeinNaam:d.naam,domeinKleur:vak.kleur});
    });
  });
  SIM.questions.sort(()=>Math.random()-.5);

  const total=SIM.questions.length;
  const mins=total*5;
  SIM.duration=mins*60;

  // Update setup screen
  document.getElementById('sim-nav-title').textContent=vak.naam+' — Simulatie';
  document.getElementById('sim-setup-title').textContent='Simulatietoets '+vak.naam;
  document.getElementById('sim-setup-desc').textContent=ceDomeinen.length+' CE-domeinen · '+total+' open examenvragen.';
  const grid=document.getElementById('sim-info-grid');
  grid.innerHTML=`
    <div class="sim-info-card"><div class="sim-info-num">${total}</div><div class="sim-info-lbl">Open vragen</div></div>
    <div class="sim-info-card"><div class="sim-info-num">${mins} min</div><div class="sim-info-lbl">Tijdlimiet</div></div>
    <div class="sim-info-card"><div class="sim-info-num">${ceDomeinen.length}</div><div class="sim-info-lbl">CE-domeinen</div></div>`;"""

c = c.replace(old_pool, new_pool, 1)

# ── FIX 3: simShowQ — hide/show open area via explicit inline styles ──
# Reset block: ensure open area and model blok start hidden/visible correctly
old_reset = """    openArea.style.display='block';
    document.getElementById('sim-open-ta').value='';
    document.getElementById('sim-open-ta').disabled=false;
    document.getElementById('sim-nakijk-btn').style.display='';
    document.getElementById('sim-model-blok').style.display='none';"""

new_reset = """    openArea.style.display='block';
    document.getElementById('sim-open-ta').value='';
    document.getElementById('sim-open-ta').disabled=false;
    document.getElementById('sim-nakijk-btn').style.display='block';
    document.getElementById('sim-model-blok').style.display='none';"""

c = c.replace(old_reset, new_reset, 1)

# ── FIX 4: simShowQ — since all questions are now open, simplify isMC branch ──
# Keep isMC branch for safety but ensure open area is always shown for open q's
# (already handled by fix 3)

# ── FIX 5: simNakijken — already has display='block', verify ──
assert "sim-model-blok').style.display='block'" in c, "simNakijken fix missing!"

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

# ── Verify ──
with open(path, 'r', encoding='utf-8') as f:
    v = f.read()

checks = [
    ("CSS sim-open-area no display:none", ".sim-open-area{}" in v),
    ("CSS sim-model-blok no display:none", ".sim-model-blok{margin-bottom:18px}" in v),
    ("pool uses only oe", "ALL oe (open) questions from CE domains" in v),
    ("no sv pool", "svPool" not in v),
    ("nakijk-btn show=block", "sim-nakijk-btn').style.display='block'" in v),
    ("model-blok show=block in nakijken", "sim-model-blok').style.display='block'" in v),
]
for name, ok in checks:
    print(f"{'OK' if ok else 'FAIL'}: {name}")
