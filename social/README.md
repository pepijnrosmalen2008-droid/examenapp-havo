# Slagio · Instagram motion

Animaties voor Instagram, gebouwd als HTML en frame voor frame gerenderd naar MP4.
Niet onderdeel van de app (staat niet in de service worker).

## Posts

| Post | Formaat | Duur | Wat |
|---|---|---|---|
| `posts/aftellen.html` | Reel 1080×1920 | 9 s | Aantal dagen tot het eerste centrale examen (rekent zelf vanaf vandaag), wat je op Slagio doet, Vonk + merk. `?doel=2027-05-14` of `?dagen=100` om te overschrijven. |
| `posts/competitie.html` | Reel 1080×1920 | 15 s | Gamificatie en competitie: XP en combo op echte vragen, level omhoog, streak, kist openen (tik 3×), weekwedstrijd waarin jij van plek 9 naar 1 klimt en promoveert naar Zilver. Namen en XP-standen volgen de app (30 spelers, top 7 promoveert). |
| `posts/terug.html` | Reel 1080×1920 | 15 s | Aankondiging nieuw seizoen: Vonk slaapt, wordt wakker, "Slagio is terug.", wat klaarstaat (20.000+ oefenvragen, 40 vakken, examens 2019–2025), nieuw: Arcade (Clash, Kingdom), slot met CTA. |
| `posts/tutorial.html` | Reel 1080×1920 | 18 s | Zo werkt Slagio in vier stappen, op een echte opname van de app (`opnames/tutorial.mjs`). |
| `posts/arcade.html` | Reel 1080×1920 | 22 s | Slagio Arcade: hub, Examenboss, Kingdom en Clash, vier echte opnames na elkaar (`opnames/arcade-*.mjs`). |
| `posts/examentrainer.html` | Reel 1080×1920 | 13 s | De Examentrainer (Slagio Plus) op een opname met voorbeelddata (`opnames/trainer.mjs`). Staat in beeld gelabeld als voorbeeld; geen "gratis" in tekst of onderschrift. |
| `posts/fout.html` | Reel 1080×1920 | 16 s | Leren van een fout: echte enzymvraag (bi M3), fout antwoord, Vonk typt de uitleg uit de app, het mechanisme als animatie (enzym zet drie keer substraat om en blijft heel), vervolgvraag over hetzelfde onderwerp goed. |
| `posts/vraag.html` | Reel 1080×1920 | 15,5 s | Vraag het Slagio: "wat is osmose?" typen, antwoordkaart met het begrip uit de app, osmose als bewegende figuur (water door het membraan naar de kant met meer opgeloste stof), daarna Oefen dit met een echte vraag. |
| `posts/mijnstof.html` | Reel 1080×1920 | 15,5 s | Mijn stof: eigen notities kopiëren en plakken, Slagio vindt 4 kaartjes, kaartjes omdraaien, quiz uit je eigen stof. Laat bewust geen foto zien: die functie vraagt een account. |
| `posts/moment-level.html` | 1080×1080 of Reel | 5 s | Moment: level omhoog. Ring loopt vol, cijfer wisselt, Vonk juicht. `?level=5&naam=Prime&niveau=havo`. Met `?f=reel` staand, met haak bovenin en merk onderin. De animatie zelf staat in `/momenten.js`; dezelfde code draait in de app. |
| `posts/moment-promotie.html` | 1080×1080 of Reel | 5,4 s | Moment: promotie in de weekwedstrijd. Schild springt, draait en landt in de nieuwe divisie. `?van=Brons&naar=Zilver` (alle zes divisies uit `league.js`). |
| `posts/moment-streak.html` | 1080×1080 of Reel | 5 s | Moment: streak. Vandaag wordt afgevinkt, een vonkje vliegt naar de vlam, de vlam laait op en de teller springt. `?dagen=7`. |
| `posts/correlatie.html` | Reel 1080×1920 | 18,6 s | Uitleg: correlatie is geen oorzaak. IJsverkoop en verdrinkingen stijgen samen, het warme weer is de derde factor (bi A4). |
| `posts/successie.html` | Reel 1080×1920 | 16 s | Uitleg als timelapse: kale grond wordt in 150 jaar een beukenbos, met jaarteller, stadium, licht op de bodem en humuslaag (bi P5). |
| `posts/quiz.html` | Feed 1080×1350 | 11 s | Echte oefenvraag met 5 s bedenktijd, onthulling, uitleg, reactievraag en CTA. Kies de vraag met `?vraag=econ-maxprijs` (zie `VRAGEN` in het bestand). |

## Momenten (ook voor in de app)

De drie momenten zijn zo gemaakt dat ze ook in de app passen: vierkant, donkere achtergrond in de stijl van het menu, vijf seconden, geluid uit dezelfde klanken als `playSound()`.

```bash
node social/render.mjs moment-level "level=5" moment-level          # vierkant
node social/render.mjs moment-level "f=reel&level=5" reel-level     # staand voor TikTok en Instagram
node social/render.mjs moment-promotie "van=Zilver&naar=Goud" promotie-goud
```

Een kleinere versie voor in de app (720×720, ongeveer 300 kB) maak je met
`ffmpeg -i social/out/moment-level.mp4 -vf scale=720:720 -crf 26 -preset slow -c:a aac -b:a 96k -movflags +faststart uit.mp4`.

## Bekijken

Start een server in de repo-root (`python3 -m http.server`) en open bijvoorbeeld
`/social/posts/aftellen.html`. Spatie = pauze, pijltjes = frame voor frame, schuifbalk onderin.

## Renderen

```bash
FFMPEG=/pad/naar/ffmpeg node social/render.mjs aftellen
node social/render.mjs quiz "vraag=wis-macht0"
```

Uitvoer in `social/out/` (niet in git): `<naam>.mp4` (H.264, 30 fps, AAC-geluid genormaliseerd op -15 LUFS) en `<naam>-cover.png`.

## Opnames van de echte app

```bash
node social/opname.mjs tutorial     # → social/out/opname/tutorial/f0001.jpg … + meta.json
```

Een scenario in `opnames/<naam>.mjs` exporteert `{ duur, opslag, voorbereiding, stappen: [[tijd, async (page, h) => …]] }`.
`opname.mjs` draait de app in Chromium op een nep-klok (390×844 @2x, 30 fps): JS-timers, requestAnimationFrame
en CSS-animaties lopen per frame mee, dus de opname is vloeiend, hoe traag de machine ook is (3D-scènes duren
wel een paar seconden per frame). Helpers: `h.tik('css@n')` (met vinger-cirkel, positie in meta.json),
`h.scroll(sel, dy, ms)`, `h.wacht(ms)`, `h.tot(voorwaarde)`. Gedeelde instellingen in `opnames/_basis.mjs`.
Een post toont de beelden in een telefoon met `Motion.laadFilm(img, naam)` (zie `tutorial.html`).
Onderschriften per post staan in `captions/`.

## Geluid

`geluid.js` bevat dezelfde synthese als `playSound()` in de app (pop, correct, combo, xp, coin, levelup, fanfare, …)
plus het fout-geluid (`fout`), montagegeluiden (whoosh, impact, boem, riser, teller, wekker, schud, kist, ontbrand, nacht, snurk, `typ` voor toetsaanslagen, `scan`).
Een post geeft zijn cues mee: `Motion.maak({ ..., geluid: [[tijd, 'naam', volume, extra], ...] })`.
`render.mjs` rendert het geluid exact in de browser (OfflineAudioContext) en mixt het in de MP4.
In de preview speelt het geluid mee na één klik in de pagina. Muziek kun je in Instagram nog over het geluid heen leggen.

## Een nieuwe post maken

Maak `posts/<naam>.html`, laad `../basis.css` en `../engine.js`, zet je elementen absoluut
op een `.mo-canvas` met vaste pixelmaat en schrijf één `render(t)` die alles op tijdstip `t`
tekent (gebruik `Motion.p(t, van, tot, easing)` voor voortgang). Start met
`Motion.maak({ duur, render })`. Geen CSS-animaties: dan blijft elk frame reproduceerbaar.

Huisstijl: Bricolage (koppen) + Inter (tekst) uit `fonts/` (SIL OFL), inkt `#0d0d1a`,
oranje `#ff6a13 → #ff4500`, room `#fff6ec`, mascotte via `mascotSVG(stemming, grootte)` uit `mascotte.js`.
Reels: houd tekst tussen y≈250 en y≈1500 (boven- en onderkant bedekt Instagram).
