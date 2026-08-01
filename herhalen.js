// ═══════════════════════════════════════════════════════════════════════
// herhalen.js - HERHAALPLANNING (spaced repetition voor ÁLLE geoefende domeinen)
// Bouwt op de bestaande decay-tijdstempels (getDecay in lb.js). Een domein dat
// je lang niet oefende en/of matig beheerst, zakt weg en komt hier terug om op
// te frissen. Vonk presenteert het. Geen LLM, puur op bestaande data.
// ═══════════════════════════════════════════════════════════════════════

// Herhaal-interval (dagen) op basis van beheersing: beter beheerst = langer vast.
function _herInterval(pct) { return pct >= 0.85 ? 21 : pct >= 0.7 ? 12 : pct >= 0.5 ? 7 : 4; }

// Alle geoefende domeinen die "due" zijn om te herhalen, gesorteerd op urgentie.
function herhaalDueList() {
  const out = []; const now = Date.now();
  let decay = {}; try { if (typeof getDecay === 'function') decay = getDecay() || {}; } catch (e) {}
  const vakken = (typeof getVK === 'function') ? getVK() : [];
  vakken.forEach(function (vak) {
    (vak.domeinen || []).forEach(function (dom) {
      const ts = decay[vak.id + '_' + dom.id]; if (!ts) return;           // nooit geoefend
      const r = (typeof getDomeinBestPct === 'function') ? getDomeinBestPct(vak.id, dom.id) : { hasData: false, pct: 0 };
      if (!r.hasData) return;
      const days = (now - ts) / 864e5;
      const interval = _herInterval(r.pct);
      if (days >= interval) out.push({ vakId: vak.id, vakNaam: vak.naam, domId: dom.id, domNaam: dom.naam, pct: r.pct, days: Math.floor(days), urg: days / interval });
    });
  });
  out.sort(function (a, b) { return b.urg - a.urg; });
  return out;
}
function herhaalDueCount() { return herhaalDueList().length; }

function renderHerhalen() {
  const el = document.getElementById('herhaal-list'); if (!el) return;
  const due = herhaalDueList();
  const vonkBox = document.getElementById('herhaal-vonk');
  if (vonkBox) {
    const mood = due.length ? 'kijk' : 'blij';
    const say = due.length
      ? ('Deze ' + due.length + ' ' + (due.length === 1 ? 'onderdeel zakt' : 'onderdelen zakken') + ' weg uit je geheugen. Zullen we ze opfrissen?')
      : 'Alles staat nog vers in je hoofd. Niks te herhalen, goed bezig!';
    vonkBox.innerHTML = '<div class="her-vonk">' + ((typeof mascotSVG === 'function') ? mascotSVG(mood, 88) : '') + '</div>' +
      '<div class="her-vonk-say"><div class="her-vonk-name">' + (typeof MASCOT_NAME !== 'undefined' ? MASCOT_NAME : 'Vonk') + '</div><div>' + say + '</div></div>';
  }
  if (!due.length) { el.innerHTML = '<div class="her-empty">🟢 Alles vers! Kom terug zodra er iets dreigt weg te zakken.</div>'; return; }
  el.innerHTML = '<button class="her-all" onclick="herhaalOefen()">🔁 Fris het zwakste onderdeel op</button>' +
    due.map(function (d) {
      const col = d.pct < 0.5 ? '#ef4444' : d.pct < 0.7 ? '#f97316' : '#22c55e';
      return '<div class="her-item"><div class="her-item-body"><div class="her-item-dom">' + d.domNaam + '</div>' +
        '<div class="her-item-sub">' + d.vakNaam + ' · ' + d.days + ' dagen geleden · <span style="color:' + col + '">' + Math.round(d.pct * 100) + '%</span></div></div>' +
        '<button class="her-oefen" onclick="goToDomein(\'' + d.vakId + '\',\'' + d.domId + '\',\'snel\')">Oefen →</button></div>';
    }).join('');
}
function herhaalOefen() { const due = herhaalDueList(); if (due.length && typeof goToDomein === 'function') goToDomein(due[0].vakId, due[0].domId, 'snel'); }
function openHerhalen() { show('sc-herhalen'); renderHerhalen(); try { trackEvent('herhalen_open', { due: herhaalDueCount() }); } catch (e) {} }

// Home-kaart: alleen zichtbaar als er iets weg dreigt te zakken.
function renderHerhaalHomeCard() {
  const box = document.getElementById('herhaal-home'); if (!box) return;
  const n = herhaalDueCount();
  if (!n) { box.innerHTML = ''; return; }
  box.innerHTML = '<button class="her-card" onclick="openHerhalen()"><span class="her-card-ic">🔁</span>' +
    '<div class="her-card-body"><div class="her-card-t">' + n + ' ' + (n === 1 ? 'onderdeel zakt' : 'onderdelen zakken') + ' weg</div>' +
    '<div class="her-card-s">Fris ze op voordat je ze vergeet</div></div><span class="her-card-go">→</span></button>';
}
