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

## Pass 9 — Content stap B: Biologie HAVO nagelopen

**Audit als leerling, alle 4 domeinen (A/M/O/P) + oud-examen + samenvattingen.**
Bevinding: inhoudelijk uitstekend en in betere staat dan Nederlands — geen
feitelijke fouten. Fotosynthese/celademhaling, DNA-basenparing, Mendel +
X-gebonden (hemofilie-kruising klopt), hormonen, afweer, 10%-regel,
eutrofiëring, Hardy-Weinberg (q²=0,16→48% heterozygoot) allemaal correct.

4 verbeteringen toegepast (exact-replace + assertie):
1. Typo "evolutioncept" → "evolutionair concept".
2. Grammatica "Welk abiotisch factor" → "Welke abiotische factor".
3. Giveaway-tell: enige optie met uitleg-haakje "Circa 10% (90% gaat
   verloren…)" → "Circa 10%" (nu vergelijkbaar met afleiders 50/90/1%).
4. Anglicisme "inactivated vaccin" → "geïnactiveerd vaccin".

Compare-vragen (mitose/meiose, dominant/recessief) bewust gelaten: het
juiste antwoord moet beide kanten noemen — geen giveaway puur door lengte.
Structuur geverifieerd. SW v162.

## Pass 10 — Content stap C: Geschiedenis HAVO nagelopen (vak compleet)

**Audit als leerling, alle 5 domeinen (A historisch besef, B oriëntatiekennis/
tijdvakken, C thema's, D rechtsstaat & democratie, E studie/beroep) + oud-examen
+ samenvattingen.** Feitelijk uitstekend — geen enkele fout in datums,
gebeurtenissen of begrippen. Alle 10 tijdvakken kloppen (1492, 1517, 1789,
1917, 1989, 1991), evenals trias politica, Artikel 1 GW, motie van wantrouwen.

3 giveaway-tells ingekort (enige optie met lange uitleg naast kale afleiders;
auto-strip sloeg ze over vanwege datums/leestekens):
1. "Absolutisme (bijv. Lodewijk XIV — L'état c'est moi)" → "Absolutisme"
   (afleiders: Feodalisme/Constitutionalisme/Republikanisme).
2. "De Franse Revolutie (1789: vrijheid…)" → "De Franse Revolutie (1789)".
3. "De Holocaust (1941–1945): industriële massamoord…" → "De Holocaust
   (1941–1945)" (parallel met "De Armeense genocide (1915)").
Volledige uitleg blijft in u:. SW v163.

## Pass 11 — Jaartallen uit antwoordopties (verklappers weg)

Gebruiker: jaartal tussen haakjes in een antwoord verraadt soms de hele vraag.
Strip pure jaartal-haakjes uit ALLEEN de antwoordopties (o:[]); v:/u:/sam/ctx
onaangeroerd → jaartallen blijven in vraag, uitleg en samenvatting.

Regel: verwijder (jaar) / (jaar–jaar) / (opgericht jaar) / (jaar–heden) /
(… v.C.). Vangnet: skip als optie leeg/dubbel wordt (jaartal = onderscheid).
Eerst dry-run → ontdekte scope-creep: globale " ,"/" :"-opschoning raakte ook
een Wiskunde B-coördinaat en 2 NL-opties → die opschoning verwijderd, alleen
dubbele-spatie/randen. Tweede dry-run schoon.

Toegepast: 8 vragen, 26 jaartallen (Geschiedenis HAVO 6, VWO Geschiedenis 1,
VWO Duits 1). Bv. "De Berlijnse Muur (1961–1989)" → "De Berlijnse Muur";
"Oktoberrevolutie (1917): Bolsjewieken…" → "Oktoberrevolutie: Bolsjewieken…".
Geverifieerd: ()-paren −26/−26, uitleg behoudt jaartallen, wiskundenotatie
onaangeroerd, geen dubbele opties. SW v164.

## Pass 12 — Content stap D: Natuurkunde HAVO nagelopen (eerste bèta-vak)

**Audit als leerling, alle 5 domeinen (A vaardigheden, B golven, C beweging,
D lading/veld, E straling) + oud-examen + samenvattingen.** Feitelijk
uitstekend — geen enkele fout in formules/eenheden/waarden. Geverifieerd o.a.:
Ohm R=6,0/0,024=250 Ω, θc=arcsin(1/1,5)≈41,8°, v-t-grafiek totaal 290 m,
alfa(A−4,Z−2)/bèta-min(Z+1)/gamma, N=N₀(½)^(t/T½), E=h·f, ²³⁸U→²³⁴Th+⁴He,
3 halveringstijden→1/8, E=mc², Lorentz F=qvB·sinθ — alles klopt.

4 asymmetrische giveaways in opties gefixt (7 opties; auto-strip sloeg bèta
over):
1. "v = f maal lambda: golfsnelheid = …" → "v = f maal lambda" (afleiders
   kale formules).
2. "Frequentie (f blijft gelijk)" e.a. → kale grootheden — haakjes
   verklapten letterlijk welke onveranderd blijft bij refractie.
3. "…door zijn beweging: Ek = ½mv²" → "…door zijn beweging".
4. "U = I maal R: de spanning is…" → "U = I maal R".
Formules/uitleg blijven in u:. Structuur geverifieerd. SW v165.

## Pass 13 — Formules in BINAS-notatie (leesbaarheid)

Gebruiker: toon formules zoals in BINAS (gebruiksvriendelijker). Woord-math
("half maal m maal v kwadraat", "E = h maal f", "6,022 maal 10 tot de 23ste")
omgezet naar notatie (½·m·v², E = h·f, 6,022·10²³).

Veilig gescoped (woordgrenzen + dry-run review):
- " maal " → "·" (97× heel woord = altijd ×; geverifieerd geen tel-/proza-maal).
  Negatieve lookahead vóór de/het/een/afg/van/met → "maal de afgeleide" blijft.
- "half maal" → "½·" · "X kwadraat" → "X²" (excl. "kwadraat aanvullen/van").
- "10 tot de (macht) N" → "10ⁿ" (wetenschappelijke notatie).
- Griekse letters λ/σ/θ/μ (heel woord, alleen wiskunde-contexten).
- delta → Δ ALLEEN vóór losse variabele (Δv/Δt/Δx).

**Dry-run ving 2 prozavallen**: (1) delta → Δ sloopte aardrijkskunde-rivierdelta's
("delta-systemen", "Bangladesh ligt in een delta") → delta-regel beperkt tot
variabele-context; (2) "maal de/afg" → lelijke "·de" → lookahead toegevoegd.

Toegepast op 78 strings (Wiskunde A/B, Natuurkunde, Scheikunde, Economie,
Bedrijfseconomie, Biologie). Veiligheid: string-literals 13624→13624 (geen
quote gebroken; binas raakt nooit '/\), structuur intact, rivierdelta's
behouden. SW v166.

## Pass 14 — BINAS/ScienceData tabelverwijzingen (onderzoek + eerlijke grens)

Gebruiker: zet overal bij in welke BINAS/ScienceData-tabel de formules staan;
haal info van internet. Webonderzoek gedaan (fysikarel, noordhoff, malmberg,
natuurkundeuitgelegd):
- BINAS 7e: natuurkundeformules = **Tabel 35** (onderverdeeld); EM-spectrum 19;
  brekingsindices 18; geluidssnelheid 15; constanten (h,c,g) 7; isotopen 25;
  periodiek systeem **Tabel 99**. Betrouwbaar vast te stellen.
- ScienceData: **andere, hiërarchische nummering** (bv. 1.6.12), NIET per
  formule betrouwbaar online te vinden. Officiële examens geven beide nummers,
  maar de ScienceData-index staat niet op het web → niet te fabriceren zonder
  fouten te riskeren.

Veilige stap gedaan: domein Golven (Natuurkunde B) miste binas-veld volledig →
toegevoegd met onderzoek-bevestigde BINAS-tabellen (35/19/18/15) + ceStatus CE.
Bestaande binas-arrays (per domein, al getoond onder de samenvatting) NIET
blind herschreven — mogelijk correct; risico op introduceren van fouten te
groot zonder het fysieke boek. ScienceData-nummers bewust niet verzonnen.
SW v167. Open: ScienceData-index van eigenaar nodig voor exacte SD-nummers.

## Pass 15 — Content stap E: Scheikunde HAVO nagelopen (compleet)

**Audit als leerling, alle 5 domeinen (A vaardigheden, B stoffen, C processen,
D koolstofchemie, E chemie/samenleving) + oud-examen + samenvattingen.**
Feitelijk uitstekend — geen fouten in reactievergelijkingen/formules/waarden.
Geverifieerd: CO₂ apolair (lineair), H₂O 104,5° (VSEPR), N≡N 945 kJ/mol,
pH=−log[H⁺] (0,01→2), titratie 0,113 mol/L, Fe₂O₃-rendement 50%, verbranding
CH₄+2O₂→CO₂+2H₂O, CFK-ozonafbraak Cl•+O₃→ClO+O₂, Ostwald (platina), PET-ester.
Distractors netjes parallel (parens in álle opties) → geen sterke giveaways;
antwoorden staan bovendien niet allemaal op positie 0.

2 kleine fixes:
1. Typo "SO₂ (verbrandig fossiele brandstoffen)" → "verbranding" (E-sam).
2. Onnauwkeurige hint bij atoomstraal (B): "(meer schermen)" als reden klopt
   niet (binnen periode gelijk aantal schillen; reden = minder kernlading) →
   verwijderd; juiste richting + "(extra schillen)" behouden.
Structuur geverifieerd. SW v168.

## Pass 16 — Content stap F: Wiskunde A HAVO nagelopen (compleet)

**Audit als leerling, alle 5 domeinen (A vaardigheden, B algebra/log, C
verbanden, D verandering/differentiëren, E statistiek) + oud-examen + sam.**
Feitelijk uitstekend — geen fouten. Geverifieerd: G=−10T+230 (T=23°C),
zonnepanelen 400·1,5^t, abc-formule (3x²−12x+9=0 → x=3/1), decibel (60 dB),
logregels, differentiëren ((6x³)'=18x²), optimalisatie doos (4×4×2), raaklijn
y=8x−17, z=(202−181)/7=3,0, wachttijden (gem 9,0 / mediaan 8,5). Distractors
overwegend parallel.

**Notatie-bevinding**: inconsistent "plus"/"min" als woord vs +/−. KRITISCH:
"min" is ambigu (minus / minimum / minuten / "bèta-min") → automatisch
converteren zou fouten maken ("30 min"→"30 −"). Bewust NIET gedaan. Eén veilige
winst: "plus of min" = altijd ± → 3× omgezet (μ ± 2σ = 181 ± 14). "30 min" en
"bèta-min" aantoonbaar onaangeroerd. SW v169.

## Pass 17 — Content stap G: Wiskunde B HAVO nagelopen (compleet)

**Audit als leerling, alle 5 domeinen (A vaardigheden, B functies/grafieken,
C meetkundige berekeningen, D toegepaste analyse, E meetkunde) + oud-examen.**
Grotendeels uitstekend. Geverifieerd: sporthal (b=5,6/a=8,4), batterij
(L=100·0,82^t, L(10)≈13,7%), transformaties (g=3^(2x)+4 asymptoot y=4, h(0)=⅓),
ongelijkheid (−2≤x≤4), vector ∠BAC≈71,6°, cosinusregel (QR=2√13≈7,21, opp 12√3),
kwadraat aanvullen, differentiëren ((eˣ)'=eˣ, kettingregel).

**1 echte fout gevonden + gefixt**: uitleg bij "ligt P op cirkel" was
tegenstrijdig — zei eerst "P ligt buiten de cirkel", daarna "8 < 9 dus binnen".
Correct = binnen (8 < r²=9). Uitleg herschreven met heldere regel (kleiner =
binnen, gelijk = op, groter = buiten).

Notatie: "(x min a)"/"3x² min 12x" blijven (min-ambiguïteit, zie Pass 16) —
bewust niet geautomatiseerd. SW v170.

## Pass 18 — Content stap H: Engels HAVO nagelopen (compleet)

**Audit als leerling, alle 6 domeinen (A woordenschat/grammatica, B
leesvaardigheid-CE, C kijk/luister, D gesprek, E schrijven, F literatuur) +
oud-examen + samenvattingen.** Engels is native-kwaliteit, geen feitelijke
fouten. Geverifieerd: conditionals (type 1/2/3 + mixed), present perfect vs
simple past, passief, reported-speech backshift, Dear Sir/Madam→Yours
faithfully vs Dear Mr Smith→Yours sincerely, PIE-alinea, metaphor vs simile,
dynamic/static character, Lord of the Flies/Gatsby-symboliek. Antwoorden mooi
verdeeld over c:0 en c:1.

**1 echte fout gefixt**: vraag over formele aanhef (naam onbekend) had TWEE
juiste antwoorden — "Dear Sir/Madam," én afleider "To Whom It May Concern /
Dear Sir/Madam (British)". Afleider vervangen door "Dear Mr Smith," (zuiver
fout bij onbekende naam; toetst de bekend/onbekend-regel uit de uitleg).
SW v171.

## Pass 19 — Content stap I: Economie HAVO nagelopen (compleet)

**Audit als leerling, alle 4 CE-domeinen (B Schaarste, C Markt, D Overheid,
E Goede/slechte tijden) + oud-examen + samenvattingen.** Concepten, formules en
definities kloppen: opportuniteitskosten, 4 productiefactoren→beloningen,
BBP/BNP/BBP per hoofd + 3 berekenmethoden, lek/injectie, elasticiteiten (prijs,
kruis, inkomen, aanbod), marktvormen, externe effecten, collectieve goederen/
freerider, Musgrave-functies, directe/indirecte + progressief/proportioneel/
degressief, automatische stabilisatoren, conjunctuur, inflatietypes, reëel vs
nominaal, CPI, werkloosheidstypes, betalingsbalans.

**7 fixes (kwaliteit + 2 echte fouten):**
- **Echte fout**: BBP-bestedingsmethode-optie was afgekapt op een losse "+"
  ("...Overheidsbestedingen +") → aangevuld tot "+ (Export - Import)".
- **Spelfout** "belastingfinancied" (2×) → "belastinggefinancierd".
- **Actualisering**: ECB-doel "dicht bij maar onder de 2%" (pre-2021) →
  "op middellange termijn rond de 2%" (symmetrisch doel sinds 2021).
- **Typografie**: 4× spatie vóór punt in correcte opties weggehaald (verschijnt
  alleen in juiste antwoord = subtiele tell).
- **Giveaway**: 2 vragen hadden parens-voorbeelden alléén op het juiste antwoord
  (Oligopolie, Extern effect) → gelijkgetrokken met de bare afleiders, conform
  het sterkere patroon elders in dit vak (parens op afleiders, correct = kaal).
SW v172.

## Pass 20 — Content stap J: Aardrijkskunde HAVO nagelopen (compleet)

**Audit als leerling, alle 5 domeinen (A Vaardigheden, B Wereld, C Aarde,
D Ontwikkelingsland, E Leefomgeving) + oud-examen (incl. meerdelige a/b/c CE-
vragen) + samenvattingen.** Sterk geschreven vak: opties symmetrisch (géén
giveaway-tells), berekeningen kloppen (580.000/2900 = 200 inw/km²), endogeen/
exogeen, subductie/hotspot/moesson, push-pull, centrum-periferie, demografische
transitie, HDI/Gini, dijkringen/Ruimte voor de Rivier/NOVI — alles correct.

**2 fixes:**
- **Interne inconsistentie (echte fout)**: "verstedelijking" werd in domein D
  (1886) strikt onderscheiden van urbanisatie (verstedelijking = ruimtelijke
  groei, urbanisatie = bevolkingsaandeel), maar in domein E (1911) juist als
  bevolkingsaandeel-groei gedefinieerd — twee quizantwoorden die elkaar
  tegenspreken. E-uitleg overbrugd: synoniemgebruik + strikte ruimtelijke
  betekenis genoemd, met verwijzing naar domein D. Urbanisatie zelf is overal
  consistent (B1841, D1886).
- **Typo**: "Legendas" → "Legenda's" (examenval domein A).
SW v173.

## Pass 21 — Content stap K: Bedrijfseconomie HAVO nagelopen (compleet)

**Audit als leerling, alle 5 domeinen (B Persoon→rechtspersoon, C Interne
organisatie, D Marketing, E Financieel beleid, F Verslaggeving) + oud-examen
(meerdelige reken-CE-vragen) + samenvattingen.** Meest rekengevoelige vak —
élke berekening nagerekend en kloppend: samengestelde interest (5000·1,03¹⁸ ≈
8512; regel-van-72-controle 23,4 jr), RTV 9% / REV 19% met positieve hefboom,
NCW = 20.000·3,993 − 80.000 = −140, lineaire afschrijving 6.000/jr, solvabiliteit
44,4% & current ratio 1,0, RTV 20%. Rechtsvormen, organisatiestructuren, 4 P's,
Ansoff/PLC/SWOT, kengetallen — allemaal correct.

**3 fixes:**
- **Rekenkundige afronding (echte fout)**: break-even 4400/33 = 133,3 stond als
  "= 133 reparaties"; bij 133 is er nog verlies → gecorrigeerd naar "133,3, dus
  afgerond 134".
- **Formulefout**: quick-ratio-optie miste haakjes om de aftrekking
  ("vlottende activa − voorraden / kortlopende schulden" leest als − (voorraden/
  schulden)) → "(vlottende activa − voorraden) / kortlopende schulden", nu gelijk
  aan de samenvatting.
- **Typo**: "MassaMarketing" → "Massamarketing".
SW v174.

## Pass 22 — Content stap L: Maatschappijwetenschappen HAVO nagelopen (compleet)

**Audit als leerling, alle 4 CE-domeinen (A Vaardigheden/onderzoek, B Twee
benaderingen, C Politieke besluitvorming, D Maatschappelijke vraagstukken) +
oud-examen + samenvattingen.** Sociologie/politicologie is vakinhoudelijk juist:
Weber (macht/gezag, 3 gezagstypen), Hirschi (binding), Becker (labeling),
Merton (strain), Bourdieu (3 kapitaalvormen), Durkheim (anomie), trias politica,
klassieke vs sociale grondrechten, 76-zetelsdrempel, formateur/informateur,
EU-soevereiniteit. Onderzoeksmethoden (betrouwbaarheid/validiteit, confounder,
aselect, triangulatie, longitudinaal) correct.

**Fixes:**
- **Intra-domein duplicaten (domein D)**: twee spiegel-vraagparen testten in
  dezelfde quiz hetzelfde begrip. (1) "intergenerationele mobiliteit" stond al in
  2168 → spiegelvraag 2183 vervangen door een nieuwe vraag over **maatschappelijke
  polarisatie** (onderwerp 'maatschappelijke tegenstellingen'). (2)
  "participatiesamenleving" stond al in 2170 → spiegelvraag 2178 vervangen door
  **individualisering** (onderwerp 'cultuur, socialisatie en identiteit'). Beide
  nieuwe begrippen kwamen nergens anders in MW voor → geen nieuwe duplicaten.
- **Typografie**: 3× spatie vóór punt weggehaald in correcte opties (2112, 2126).
SW v175.

**Status content-audit**: alle HAVO CE-vakken nagelopen (NL, BI, GS, NA, SK,
WisA, WisB, EN, EC, AK, BECO, MW). Vakken fundamenteel correct; fixes vooral
kwaliteit (giveaways, typo's, notatie) met enkele echte fouten per vak.

## Pass 23 — Samenvattingen: Natuurkunde HAVO (bron-materiaal verwerkt)

Gebruiker levert per-vak samenvattingen aan (eigen/methode-materiaal). Aanpak:
gebruik als bron, **herschrijf volledig in eigen woorden** (auteursrecht — niet
licht parafraseren maar substantieel anders + korter), verdeel over de
CE-domeinen, in de bestaande sam-section/HTML-opmaak. Formules in BiNaS-notatie
(superscripts, ·, √, Δ) zoals de rest van Natuurkunde.

Bron-docx (natuurkunde.docx, 628 alinea's) bevat Word-vergelijkingen (OMML) die
platte-tekst-extractie mist → eigen OMML→tekst converter geschreven (_omml.py)
om formules inline te krijgen. Mapping doc-hoofdstukken → domeinen: H1→A;
H2.1-2.3→B (golven); H2.4-2.8→E (straling); H3+H5→C (beweging/kracht/energie/
gravitatie); H6→D (elektriciteit). Bronfout gevonden (constante van Planck als
J/s i.p.v. J·s) — in herschrijving gecorrigeerd.

**Domein A vervangen** (calibratie): nieuwe sam met SI-basiseenheden,
wetenschappelijke notatie, significantieregels, soorten verbanden,
coördinatentransformatie en onderzoek-/ontwerpcyclus. Gerenderd geverifieerd
(7 secties, 20 li, superscripts/√/Δ/µ intact). SW v177. B–E volgen na akkoord.

## Pass 24 — Natuurkunde samenvattingen volledig (SAM_RICH na_A..na_E)

Gebruiker wil "een stuk uitgebreider". App heeft daarvoor al `SAM_RICH`
(data.js) dat `d.sam` overschrijft en in de collapsible Theorie-pane rendert met
leesvoortgang — rijke opmaak-klassen: sam-formula-box (label/eq/note), sam-table,
sam-compare, sam-tip/warn, sam-steps. Alle natuurkunde-domeinen als uitgebreide
SAM_RICH-entries (eigen woorden, formules in eigen box met variabeldefinities):
- **na_A** Vaardigheden, **na_B** Golven (trillingen/golven/staande golven),
  **na_C** Beweging+kracht+energie+warmte+gravitatie (11 secties, 20 formuleboxen),
  **na_D** Lading en veld (elektriciteit, serie/parallel-compare),
  **na_E** Straling en materie (EM-spectrum, fotonen, verval, dosis).
Bronfouten gecorrigeerd: Planck h in J·s (doc: J/s), tan = overstaand/aanliggend
(doc omgekeerd), Ek-rekenvoorbeeld 27,8 i.p.v. 278 (niet overgenomen).
Alle 5 gerenderd geverifieerd (sub-tags gebalanceerd, formuleboxen/tabellen/
compare intact, sleutelformules aanwezig). SW v179.

## Pass 25 — Flashcards uit rijke samenvattingen (schedule.js)

Flashcards werden auto-gegenereerd door `_parseSamCards` uit `d.sam` (alleen
`<li><strong>term</strong>: def`). Twee aanpassingen zodat de rijke samenvattingen
óók flashcards voeden:
1. `startFlash` leest nu `SAM_RICH[vak_dom] || d.sam` als bron.
2. `_parseSamCards` haalt nu ook kaarten uit **formuleboxen** (voorkant = label,
   achterkant = vergelijking + uitleg, eq als innerHTML zodat sub/sup rendert) en
   uit **tabelrijen** (eerste cel = voorkant, rest = achterkant).
Resultaat Natuurkunde: ~120 kaarten (A26/B11/C41/D17/E25). Bonus: verrijkt ook
flashcards van vakken met formuleboxen/tabellen (wa_B, ec_B, gs_A, nl_A, nl_E,
bi_A). Logica geverifieerd via standalone parse op SAM_RICH. SW v180.

## Pass 26 — Samenvatting + flashcards Geschiedenis (domein B, tijdvakken)

Bron: geschiedenis.docx (757 alinea's, alle 10 tijdvakken + 3 historische
contexten). CE-stof zit in domein B (Oriëntatiekennis = de 10 tijdvakken);
domein A had al gs_A (tijdvakkentabel + denkvaardigheden). Nieuw: SAM_RICH['gs_B']
= 10 tijdvakken, elk een inklapbare sectie met kernbegrippen (<li><strong>) en
3 tabellen (bestuursvormen, politieke stromingen, totalitaire ideologieën). In
eigen woorden, gecondenseerd (auteursrecht). Levert ~120 flashcards (108
begrippen + 12 tabelrijen via de nieuwe parser).

LES: een meerregelige Python-string ('''...''') direct in een JS single-quoted
string zetten gaf letterlijke newlines = JS-syntaxfout (data.js brak). Opgelost
door de waarde tot één regel te collapsen (re.sub whitespace). Niet gecommit in
gebroken staat. Voortaan SAM_RICH-HTML als één regel opbouwen (geen rauwe \n).
Gerenderd geverifieerd: data.js parse-OK, gs_B 10 secties/3 tabellen/108
begrippen, 108 flashcards live. SW v181. De 3 contexten (Brits Rijk, Duitsland,
Nederland) nog niet verwerkt — optioneel vervolg.

## Pass 27 — Historische contexten toegevoegd aan gs_B (SW v182)

De 3 HAVO-contexten uit geschiedenis.docx (ch12–14) toegevoegd als extra secties
in gs_B (CE-domein B): Het Britse Rijk (1585–1900), Duitsland 1918–1991,
Nederland 1948–2008. Elk een inklapbare sectie met kernbegrippen. Eén regel
opgebouwd (les van pass 26: geen rauwe newlines in de JS-string). gs_B nu 13
secties; flashcards ~166. Gerenderd geverifieerd: data.js parse-OK (new Function),
geen newline, 13 sam-heads. Geschiedenis CE-stof nu compleet (tijdvakken +
contexten).

## Pass 23 — Samenvattingen: systematische scan + parity-fix

**Scan over alle 112 sam-velden (HAVO + VWO)** via Python: HTML-tagbalans,
structuurmarkers, woordtelling en tekstdefecten (spatie-voor-punt,
woordherhaling, komma-zonder-spatie).
- **HTML-integriteit**: 0 balansfouten over alle 112 samenvattingen.
- **Structuur**: 93× sam-head(+ul), 10× sam-head+sam-onthoud (onthoud-box),
  9× sam-section/qa (Economie-stijl met interactieve vragen). Alle drie valide;
  geen harmonisatie nodig (puur stilistisch).
- **Tekstdefecten**: na filtering van tag-strip-artefacten (dubbele spatie) en
  legitieme patronen (math `(x,y)`, `v.Chr`/`n.Chr`, "afstaan aan", "de Broglie")
  bleven 0 echte typo's over. Samenvattingen zijn schoon.
- **Dunne samenvattingen**: thinste zijn VWO talen-SE-domeinen (literatuur,
  gespreksvaardigheid) + 2 HAVO GS SE-only domeinen — terecht beknopt.

**1 echte gap gefixt**: VWO Engels Literatuur (30w) miste — anders dan de
zustertalen Duits (51w) en Frans (53w) — de items **Auteurs** en **Stromingen**.
Aangevuld op parity: Shakespeare/Austen/Dickens/Orwell/Woolf + Renaissance→
Postmodernism, met behoud van het unieke Poëzie-analyse-item. SW v176.

## Pass 28 — Oefenvolume opkrikken: Natuurkunde (SW v184)

Kritische review: mediaan ~13 quizvragen per domein = te dun. Gebruiker koos
"oefenvolume opkrikken". Ik genereer de vragen zelf, gegrond in de rijke
samenvattingen, en audit op formaat/correctheid/duplicaten/giveaway-tells. Engine
husselt opties (shuffleMaps in quiz.js) → c:0 veilig (geen positie-giveaway),
lengte-symmetrie blijft nodig. Natuurkunde verdubbeld: A 10→25, B/C/D/E elk
14→29 (66→141). Nieuwe vragen dekken onderbelichte stof per domein. Gerenderd
geverifieerd (new Function): valide, 0 formaatproblemen, 0 duplicaten.
