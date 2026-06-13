# Design-werknotities (per pass)

## Pass 0 — Stap 0: verkenning & baseline (2026-06-13)

**Stack**: vanilla JS PWA, geen build-step, GitHub Pages. index.html (~2.4k regels)
+ 15 JS-bestanden, styles.css (~4.7k regels, ±400KB raw / ~50KB gzip — groot maar
niet blokkerend kritiek; opschonen kandidaat voor latere pass). SW cachet alles
(cache-first), versie-bump per deploy. Routing: `show('sc-X')` + hash.

**Mascotte**: `ANIMAL_EVOLUTIONS` in profile.js — inline SVG-strings, 5+ stadia
per dier, centrale renderfunctie `getAnimalDisplay()`. V4-laag (eerder gebouwd)
gaf idle-leven: ademen, knipperen, hop, squish.

**Design-tokens**: CSS-vars in `:root` + `html.level-havo/vwo` theming (oranje/paars).

**Baseline-meting**: Lighthouse CLI niet beschikbaar op deze machine (geen node).
Proxy-baseline: preview-rendering 60fps-soepel, geen console-errors, first paint
direct (statische HTML+CSS). CLS-risico's: geen — alle animatie transform/opacity.
Meet Lighthouse via PageSpeed Insights op slagio.nl na deploy (actie eigenaar of
latere pass met tooling).

**Gekozen aanpak**: lichtst mogelijke — CSS-variabelen + SVG/CSS-animatie +
één kleine JS-laag (v4.js). Geen frameworks, geen WebGL nodig: de mascottes zijn
SVG en animeren GPU-vriendelijk met transform/opacity. Geen nieuwe fonts (mono via
ui-monospace-stack = 0KB).

## Pass 1 — Avatar-state-engine + quiz-companion + hero-tokens

**Geprobeerd**: state-machine in v4.js (`v4AvatarReact`), companion in sc-quiz,
event-wiring in quiz.js/features.js, ruitjespapier-textuur in hero, tabulaire
mono voor countdown/timer, demo-route `?avatardemo=1`.

**Gezien (vision-check, screenshots desktop 1280 + mobiel 375)**:
1. Companion stond eerst fixed linksonder -> overlapte de "Volgende"-knop
   precies op het reactiemoment. Slordig.
2. Login-CTA op <=430px: tekst liep uit de knop (regel ~4003 zet
   width:34px!important op alle .hnav-icon-btn op mobiel).
3. Hero-ruitjes + aurora + dot-canvas tegelijk was te druk.
4. State-keten end-to-end bevestigd: antwoord-klik -> _kiesReveal ->
   v4AvatarReact('correct') -> class v4cs-correct + bubble op companion.

**Veranderd n.a.v. kritiek**:
1. Companion verplaatst naar de quiz-topbalk naast het logo (36px,
   pointer-events:none, bubble klapt naar beneden). Altijd zichtbaar,
   nooit overlap.
2. Login-CTA: white-space:nowrap + width:auto!important + decoratieve
   niveau-chip verborgen op smal. Knop nu 90px, past.
3. Dot-canvas (flicker-canvas) uitgezet in hero; ruitjespapier is de
   enige textuur (een orkestreerd moment per scherm).
4. Geen wijziging nodig; werkt.

**Status**: hero + mascotte-engine af, geverifieerd, gecommit. Wacht op
akkoord eigenaar voor uitrol (per-vak werelden, overige schermen).
