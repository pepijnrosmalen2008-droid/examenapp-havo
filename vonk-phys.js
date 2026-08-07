// vonk-phys.js — VONK PHYSICS ENGINE
// ─────────────────────────────────────────────────────────────────────────────
// Maakt van Vonk een fysiek wezen i.p.v. een SVG met keyframes. Eén veer-model
// (spring physics) levert de 12 klassieke animatieprincipes vanzelf op:
//   • squash & stretch  → uit verticale snelheid (momentum → vorm)
//   • anticipation       → korte tegenbeweging vóór een sprong
//   • overshoot / easing → veren overschieten en dempen natuurlijk uit
//   • follow-through/drag→ kop, oren, staart hebben eigen (tragere) veren
//   • secondary motion   → schaduw, oren en staart bewegen ná het lijf
//   • gewicht / momentum → massa/snelheid in de integratie
// Alle "kracht" (spronghoogte, staarttempo, snap) komt uit de EMOTION ENGINE:
//   mood → parameters (niet mood → losse animatie-varianten).

function _vkClamp(v, a, b) { return v < a ? a : v > b ? b : v; }
// Een kritisch-gedempte-achtige veer: x volgt target t met snelheid v.
function _vkSpring(x, k, d) { return { x: x, v: 0, t: x, k: k, d: d, rest: x }; }
function _vkStep(s, dt) {
  var f = s.k * (s.t - s.x) - s.d * s.v;
  s.v += f * dt;
  s.x += s.v * dt;
  return s.x;
}

function VonkBody(svg) {
  this.svg = svg;
  this.p = {
    fig: svg.querySelector('.m-fig'),
    head: svg.querySelector('.m-head'),
    earL: svg.querySelector('.m-ear-l'),
    earR: svg.querySelector('.m-ear-r'),
    tail: svg.querySelector('.m-tail'),
    shadow: svg.querySelector('.m-shadow'),
    eyes: svg.querySelector('.m-eyes')
  };
  // Veren (SVG-eenheden / graden). Lijf stevig, aanhangsels slapper = drag.
  this.y = _vkSpring(0, 260, 15);     // lijf verticaal (0 = rust; negatief = omhoog)
  this.hr = _vkSpring(0, 150, 12);    // kop-rotatie (volgt lijf met vertraging)
  this.eL = _vkSpring(0, 95, 6.5);    // oor links (floppy → laag gedempt)
  this.eR = _vkSpring(0, 95, 6.5);    // oor rechts
  this.tl = _vkSpring(-13, 70, 6);    // staart (wiebelt + volgt)
  this.tailPhase = 0; this.breathPhase = Math.random() * 6.28;
  this.blinkT = 0; this.nextBlink = 1.2 + Math.random() * 3;
  this.blinkV = 1;                    // 1 = open, ~0.1 = dicht
  this.glanceT = 2 + Math.random() * 4; this.gaze = 0; this.gazeTarget = 0;
  this.energy = 0.6; this.tailSpeed = 1; this.posture = 0; // posture>0 = trots (borst vooruit)
  this.alive = true;
}
VonkBody.prototype.setMood = function (m) {
  if (!m) return;
  this.energy = _vkClamp(m.enthusiasm / 100, 0.25, 1.25);
  this.tailSpeed = 0.7 + (m.enthusiasm / 100) * 1.6 + ((m.pride || 0) / 100) * 0.8;
  this.posture = _vkClamp(((m.pride || 0) - 40) / 60, -0.3, 1);          // trots → borst vooruit
  // energieker = snappere veren; laag = trager/zwaarder
  var snap = 0.75 + this.energy * 0.6;
  this.y.k = 260 * snap; this.y.d = 15 / (0.9 + this.energy * 0.3);
  this.hr.k = 150 * snap;
  this._focus = _vkClamp((m.focus || 40) / 100, 0, 1);                    // focus → minder idle
  this._curiosity = _vkClamp((m.curiosity || 40) / 100, 0, 1);           // nieuwsgierig → meer kantelen/kijken
};
// Impuls = een reactie. Kracht schaalt mee met de mood (energy).
VonkBody.prototype.impulse = function (kind) {
  var en = this.energy, self = this;
  switch (kind) {
    case 'happy':
    case 'correct':
      this._antic(-(150 + en * 150)); break;                 // kleine sprong met anticipatie
    case 'jump':
    case 'stronger':
      this._antic(-(230 + en * 230)); break;                 // grote sprong
    case 'celebrate':
    case 'proud':
      this._antic(-(260 + en * 230));
      this.tl.v = 120; this._celeT = 2;                       // dubbele stuiter + staart los
      break;
    case 'evolve':
      this._antic(-(200 + en * 160)); this.hr.v = 60; this._spin = 1; break;
    case 'sad':
    case 'wrong':
      this.y.t = 6; this.hr.t = -7; this.eL.t = 20; this.eR.t = -20; // inzakken + oren omlaag
      this.y.k = 120; this.hr.k = 90;                          // traag/zwaar
      setTimeout(function () { self.y.t = 0; self.hr.t = 0; self.eL.t = 0; self.eR.t = 0; self.setMood(typeof VonkMood !== 'undefined' ? VonkMood : null); }, 1400);
      break;
    case 'nod':
      this.hr.v = 46; break;
    case 'glance':
      this.gazeTarget = Math.random() < 0.5 ? -2.5 : 2.5; setTimeout(function () { self.gazeTarget = 0; }, 1400); break;
    case 'eartwitch':
      this.eL.v = -70; this.eR.v = 55; break;
    case 'tailflick':
      this.tl.v = 150; break;
    case 'wave':
      this.hr.v = 34; this.gazeTo(0, -1.4); break;
    case 'think':
      this.hr.t = 6; this._curiosity = 1; var s3 = this; setTimeout(function () { s3.hr.t = 0; }, 1200); break;
  }
};
VonkBody.prototype._antic = function (launch) {
  // Anticipation: eerst even inzakken (tegenbeweging), dan lanceren.
  var self = this;
  this.y.v = 70;                       // korte squat omlaag
  setTimeout(function () { self.y.v = launch; }, 85);
};
VonkBody.prototype.gazeTo = function (dx, dy) { this.gazeTarget = _vkClamp(dx, -2.7, 2.7); this._gazeY = _vkClamp(dy || 0, -2.3, 2.3); clearTimeout(this._gzT); var s = this; this._gzT = setTimeout(function () { s.gazeTarget = 0; s._gazeY = 0; }, 2400); };
VonkBody.prototype.step = function (dt) {
  // Ademen (idle): subtiele sinus, rustiger bij focus.
  this.breathPhase += dt * (1.05 - this._focus * 0.35);
  var breath = Math.sin(this.breathPhase) * 0.014;
  // Lijf-veer + squash&stretch uit verticale snelheid (momentum → vorm).
  var y = _vkStep(this.y, dt);
  var stretch = _vkClamp(-this.y.v * 0.0016, -0.13, 0.17);
  var post = this.posture * 0.03;
  var sy = 1 + stretch + breath + post;
  var sx = 1 - stretch * 0.85 - breath + post * 0.4;
  // Kop volgt lijf met vertraging (secondary), plus nieuwsgierig kantelen.
  this.hr.t = _vkClamp(-this.y.v * 0.018, -9, 9) + Math.sin(this.breathPhase * 0.5) * this._curiosity * 2.2;
  var hr = _vkStep(this.hr, dt);
  if (this._spin) { hr += this._spin * 360; this._spin = Math.max(0, this._spin - dt * 0.7); }
  // Oren volgen kop + lijf-snelheid, met overshoot (drag/follow-through).
  this.eL.t = hr * 1.5 - this.y.v * 0.045;
  this.eR.t = -hr * 1.5 + this.y.v * 0.045;
  var eL = _vkStep(this.eL, dt), eR = _vkStep(this.eR, dt);
  // Staart: wiebel-oscillator + volgt lijf; sneller bij enthousiasme/trots.
  this.tailPhase += dt * this.tailSpeed * 5.5;
  this.tl.t = -13 + Math.sin(this.tailPhase) * (5 + this.energy * 9) + this.y.v * 0.03 - this.posture * 8;
  var tl = _vkStep(this.tl, dt);
  // Schaduw: krimpt als Vonk 'los' van de grond komt (gewicht voelbaar).
  var sh = _vkClamp(1 + y * 0.006, 0.68, 1.06);
  // Dubbele stuiter na een feest.
  if (this._celeT) { this._celeT -= dt; if (this._celeT <= 0 && Math.abs(this.y.x) < 2) { this.y.v = -(170 + this.energy * 120); this._celeT = 0; } }
  // Blik (pupillen) volgt gaze-target soepel.
  this.gaze += (this.gazeTarget - this.gaze) * Math.min(1, dt * 9);
  var gy = ((this._gazeY || 0));
  // Knipperen op een wisselende timer.
  this.blinkT += dt;
  if (this.blinkT >= this.nextBlink) { this._blinking = 0.16; this.blinkT = 0; this.nextBlink = (1.4 + Math.random() * 3.2) * (1 + this._focus * 0.6); }
  if (this._blinking > 0) { this._blinking -= dt; var p = this._blinking / 0.16; this.blinkV = 1 - Math.sin(p * Math.PI) * 0.92; } else this.blinkV = 1;
  // Idle micro-gedrag via de engine (glance/oor-twitch), minder bij focus.
  this.glanceT -= dt;
  if (this.glanceT <= 0 && Math.abs(this.y.x) < 1.5) {
    this.glanceT = (3 + Math.random() * 5) * (1 + this._focus);
    var r = Math.random();
    if (r < 0.4 + this._curiosity * 0.2) this.impulse('glance');
    else if (r < 0.6) this.impulse('eartwitch');
  }
  // ── Toepassen ──
  var P = this.p;
  if (P.fig) P.fig.style.transform = 'translateY(' + y.toFixed(2) + 'px) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
  if (P.head) P.head.style.transform = 'rotate(' + hr.toFixed(2) + 'deg)';
  if (P.earL) P.earL.style.transform = 'rotate(' + eL.toFixed(2) + 'deg)';
  if (P.earR) P.earR.style.transform = 'rotate(' + eR.toFixed(2) + 'deg)';
  if (P.tail) P.tail.style.transform = 'rotate(' + tl.toFixed(2) + 'deg)';
  if (P.shadow) P.shadow.style.transform = 'scaleX(' + sh.toFixed(3) + ')';
  if (P.eyes) P.eyes.style.transform = 'translate(' + this.gaze.toFixed(2) + 'px,' + gy.toFixed(2) + 'px) scaleY(' + this.blinkV.toFixed(3) + ')';
};

// ── Globale rAF-loop over alle actieve lichamen ──
var _vonkBodies = [], _vonkLoopOn = false, _vonkLastTs = 0;
function _vonkPhysLoop(ts) {
  var dt = _vonkLastTs ? Math.min(0.033, (ts - _vonkLastTs) / 1000) : 0.016;
  _vonkLastTs = ts;
  for (var i = _vonkBodies.length - 1; i >= 0; i--) {
    var b = _vonkBodies[i];
    if (!b.svg || !document.body.contains(b.svg)) { _vonkBodies.splice(i, 1); continue; }
    if (b.svg.offsetParent === null) continue;   // verborgen Vonk → geen CPU verspillen
    try { b.step(dt); } catch (e) {}
  }
  if (_vonkBodies.length) requestAnimationFrame(_vonkPhysLoop);
  else { _vonkLoopOn = false; _vonkLastTs = 0; }
}
// Maak (of pak) het physics-lichaam van een Vonk-instance.
function vonkPhysics(target) {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
    var svg = (typeof _vonkSvgOf === 'function') ? _vonkSvgOf(target) : null;
    if (!svg) return null;
    if (svg._body) return svg._body;
    svg.classList.add('m-phys');       // CSS-keyframes op de onderdelen uit
    var body = new VonkBody(svg);
    if (typeof VonkMood !== 'undefined') body.setMood(VonkMood);
    svg._body = body;
    _vonkBodies.push(body);
    if (!_vonkLoopOn) { _vonkLoopOn = true; _vonkLastTs = 0; requestAnimationFrame(_vonkPhysLoop); }
    return body;
  } catch (e) { return null; }
}
