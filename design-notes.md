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

## Pass 2 — Per-vak werelden (data-vak-mechanisme)

**Geprobeerd**: één `data-vak` op <html> (gezet via gewrapte show()/openVak),
per vak een tokenset: `--vak-or` (accent) + `--vw-motif` (achtergrondmotief).
17 vakken: blauwdruk (wa/wb), moleculair (sk), golven (na), cellen (bi),
hoogtelijnen (ak), curves (ec), grootboek (be), archief (gs), netwerk (mw),
circuit (in), meander (gr), inscriptie (la), typografisch per taal (nl=ij,
en=Th, du=ß, fr=é).

**Gezien (vision-check, screenshots)**:
1. Eerste versie gebruikte `position:fixed` full-viewport ::before met
   mask — rasterizer liep vast (en reëel perf-risico: dure composite-laag).
2. data-vak werd niet gezet: ST.vak wordt nét ná show() gezet → MutationObserver-
   race. Manueel werkte wel.
3. bi/gs/wa/sk geverifieerd: elk onmiskenbaar eigen wereld, light+dark,
   desktop+mobiel. Accenten (knoppen, FAB, badges, bottom-nav) kleuren
   cohesief mee via één --or-override.

**Veranderd n.a.v. kritiek**:
1. Fixed ::before + mask geschrapt. Motief nu als scrollende `background`
   op #sc-detail, kleur in de SVG gebakken (geen mask). Goedkoop te
   compositen; screenshots werken weer (home/bi/gs/wa/sk allemaal OK).
2. show()/openVak() deterministisch gewrapt in v4.js → data-vak exact op tijd,
   valt schoon weg bij home (terug naar level-accent, geverifieerd).

**Status**: per-vak werelden af voor alle 17 vakken, geverifieerd op 4
representatieve vakken in alle modi. Eén mechanisme; nieuw vak = nieuwe
tokenset. AA-contrast blijft (tekst op solide kaarten; motief is lage-alpha
achtergrond). SW v156.

## Pass 3 — Per-vak werelden op de SEO-vakpagina's (170 pagina's)

**Geprobeerd**: gedeelde `vakken/vak-theme.css` met dezelfde 17 werelden als
de app (palet --accent + motief --vw-motif). Python-script injecteert
`data-vak="xx"` op <html> + de stylesheet-link in alle havo-/vwo-pagina's
(hoofdpagina's én domein-subpagina's). Vak-id afgeleid uit bestandsnaam.

**Dieper dan accent**: animerende accent-topbalk, hero-titel met accent-gloed,
CTA accent-gradient + gloed, kaart-accentranden + hover-lift, accent
domein-links, motief-achtergrond per vak.

**Gezien (vision-check, screenshots)**:
- scheikunde (desktop): moleculair amber — gloeiende titel/CTA, atoomrooster ✓
- nederlands (desktop): reuze-"ij" typografisch oranje ✓
- aardrijkskunde (mobiel): hoogtelijnen smaragd, responsive topbalk ✓
- Injectie correct: ec/bi/la/calculators (overgeslagen) geverifieerd.

**Budget**: één klein cachebaar CSS-bestand (~7KB) + data-vak. Geen JS,
geen extra requests per vak. Motieven zijn CSS-achtergronden op korte
statische pagina's → SEO-snelheid intact. SW cachet vak-theme.css
automatisch (fetch-handler) → offline werkt na eerste bezoek.

**Status**: alle 170 vakpagina's (havo+vwo, hoofd+domein) gethematiseerd
via één mechanisme. Calculator-/examenrooster-pagina's bewust neutraal.

## Pass 4 — Scherm-werelden in de app (bestemmingsschermen)

**Geprobeerd**: elk bestemmingsscherm een eigen sfeer die bij zijn functie
past, scoped per scherm-ID (geen markup-wijziging, alleen accent + atmosfeer):
- leaderboard: kampioens-goud + conic spotlight-rays
- profiel: violette identiteits-aura (avatar = held)
- studieplan: indigo blauwdruk-raster (planning/structuur)
- calc: rustig groen (voldoende/precisie)
- schedule: agenda-blauw met tijdmarkering
- groep: verbonden teal · sociaal: warme rose-hub
- flash: fuchsia geheugenfocus · review: gedempt amber

**Gezien (vision-check)**:
- leaderboard (light): gouden spotlight bovenin, amber filters/score ✓
- studieplan (dark): indigo raster + indigo "Genereer"-knop, planning-gevoel ✓
- profiel (dark): violette aura, avatar-reis violet, knoppen violet ✓
Elk één georkestreerd moment (geen versnippering), botten gelijk.

**Aanpak**: accent-override (--or) + atmosfeer-achtergrond per #sc-X.
Bottom-nav blijft level-accent (constante chrome); schermen zijn de werelden.
SW v157.

## Pass 5 — Alle vakken écht uniek (gedeelde motieven gedifferentieerd)

Brief-regel: "als de keuze net zo goed bij een ander vak zou passen, is hij
nog niet specifiek genoeg." Twee paren deelden nog een motief-familie:
- wa & wb deelden blauwdruk-raster → **wb** krijgt nu functiecurves/parabolen
  (functies/meetkunde), **wa** houdt het raster (statistiek/data).
- gs & la deelden horizontale regels → **la** krijgt nu verticale zuilgroeven
  (Romeinse pilaren), **gs** houdt archiefregels.
Doorgevoerd in beide bronnen (styles.css + vakken/vak-theme.css).

**Gezien (vision-check)**: wb parabolen ✓, la zuilgroeven ✓ (onderscheidt
van gs), ec diagonale marktcurves ✓. Alle 17 vakken nu uniek motief.
Dekking bevestigd: alle vak-ids in data.js hebben een wereld. SW v158.

## Pass 6 — Vak-emblemen + per-domein iconen op de vakpagina's

**Geprobeerd**: thema duidelijker maken met voorwerpen die bij het vak horen.
- Per vak een lijntekening-embleem in de hero (rechtsboven), accent-kleur,
  via vakken/vak-theme.css (.header::after, keyed op data-vak):
  nl=boek, en=spraakwolk, du=dialoog, fr=Eiffeltoren, wa=staafdiagram,
  wb=parabool, sk=erlenmeyer, na=atoom, bi=blad, ak=globe, ec=vraag/aanbod,
  be=weegschaal, gs=tempelkolommen, mw=mensen-netwerk, la=Romeinse zuil,
  gr=amfoor, in=chip.
- Per-domein passend emoji-icoon in de domeinlijst, via Python-script met
  trefwoord→emoji-map (⚖️ schaarste, 📈 markt, 🔬 cel, 🫀 orgaan, 🌿 ecosysteem,
  📖 lezen, ✍️ schrijven, 🧲 kracht, ⚡ energie, …). 12 overzichtspagina's,
  53 domeinen.

**Gezien (vision-check)**:
- scheikunde (desktop): erlenmeyer-embleem rechtsboven, 🔍/🧪 domein-iconen ✓
- geschiedenis (mobiel): tempelkolommen geschaald naar 64px, geen overlap met
  logo, 🔍/📜 domein-iconen ✓
Emblemen recognisable + responsive; domein-iconen kloppen inhoudelijk.

**Budget**: emblemen + iconen zijn SVG-data-uri/emoji in één gedeelde CSS +
inline emoji → geen extra requests, SEO-snelheid intact. SW v159 (forceert
verse vak-theme.css voor terugkerende bezoekers).

## Pass 7 — Content-audit (stap 1): antwoordopties snelle quiz

**Bevinding (audit als leerling)**: in de snelle quiz stonden in veel opties
verklarende haakjes ("Betoog (overtuigen van één standpunt)") — dat maakt
opties ongelijk lang, geeft het antwoord weg en is langer dan nodig.

**Veilig & geautomatiseerd**: verklarende haakjes uit opties strippen (uitleg
staat al in u:). 274 vragen / 719 opties in de 13 non-bèta-vakken.
- Conservatieve regel: alleen (...) met spatie, zónder cijfers/symbolen.
- Per-vraag vangnet: skip als resultaat leeg/dubbel zou worden (0 gevallen).
- **Bèta uitgesloten** (Wiskunde A/B, Natuurkunde, Scheikunde, Informatica):
  daar zijn haakjes vaak notatie — strippen zou "a^(m+n)", "log(n·a)",
  "a=(y₂−y₁)/(x₂−x₁)" slópen. Dry-run bevestigde 2 destructieve gevallen →
  alle 5 bèta-vakken handmatig later.
- Geverifieerd: schijf gestript + geldig, structuur intact (o:[/{v: tellingen
  gelijk, ()-paren in matched pairs verwijderd), server serveert gestript,
  bèta-notatie aantoonbaar ongewijzigd. Volledig diff-log: CONTENT-FIXES-haakjes.txt.

**Nog te doen (grotere, handmatige stappen)**: lange-zin-antwoorden inkorten
(de "juist=langste" tell, ~61 vragen in nl alleen al — vereist per-vraag
herschrijven met behoud van juistheid); bèta-opties handmatig; validiteit
samenvattingen/oud-examen/flashcards per vak. SW v160.

## Pass 8 — Content stap A: Nederlands HAVO volledig nagelopen (sjabloon)

**Audit als leerling, alle 6 domeinen (sv + oud-examen + samenvattingen)**.
Inhoud bleek feitelijk correct (argumentatieleer, drogredenen, tekstsoorten,
literaire stromingen, vertelstandpunt). Twee soorten echte problemen gefixt:

1. **Kapotte oud-examenvraag (domein C)**: één entry gelabeld "Brief" bevatte
   een exacte kopie van de betoog-vraag ervoor. Vervangen door een distincte,
   geldige formele-brieftaak (vrijwilliger-aanmelding).
2. **"Te lang/tell"-antwoorden** die de haakjes-strip oversloeg (door +-tekens):
   7 juiste antwoorden ingekort zodat ze vergelijkbaar zijn met de afleiders,
   betekenis behouden (uitleg staat in u:). + 1 typo ("waarden .").

Veilig toegepast via exact-replace met telling-assertie per wijziging; c:-index
en volgorde ongewijzigd → juiste antwoord blijft juist. Structuur geverifieerd
(o:[/{v: tellingen gelijk, braces balanced). SW v161.

**Sjabloon voor overige vakken**: (1) domein-voor-domein lezen, (2) feitcheck,
(3) lange juiste antwoorden inkorten tot afleider-niveau, (4) dubbele/kapotte
oud-examenvragen herstellen. Bèta daarbij: opties handmatig (geen auto-strip).
