# Slagio · Instagram motion

Animaties voor Instagram, gebouwd als HTML en frame voor frame gerenderd naar MP4.
Niet onderdeel van de app (staat niet in de service worker).

## Posts

| Post | Formaat | Duur | Wat |
|---|---|---|---|
| `posts/aftellen.html` | Reel 1080×1920 | 9 s | Aantal dagen tot het eerste centrale examen (rekent zelf vanaf vandaag), wat je op Slagio doet, Vonk + merk. `?doel=2027-05-14` of `?dagen=100` om te overschrijven. |
| `posts/quiz.html` | Feed 1080×1350 | 11 s | Echte oefenvraag met 5 s bedenktijd, onthulling, uitleg, reactievraag en CTA. Kies de vraag met `?vraag=econ-maxprijs` (zie `VRAGEN` in het bestand). |

## Bekijken

Start een server in de repo-root (`python3 -m http.server`) en open bijvoorbeeld
`/social/posts/aftellen.html`. Spatie = pauze, pijltjes = frame voor frame, schuifbalk onderin.

## Renderen

```bash
FFMPEG=/pad/naar/ffmpeg node social/render.mjs aftellen
node social/render.mjs quiz "vraag=wis-macht0"
```

Uitvoer in `social/out/` (niet in git): `<naam>.mp4` (H.264, 30 fps) en `<naam>-cover.png`.
Voeg muziek toe in de Instagram-app zelf (de video's zijn stil).

## Een nieuwe post maken

Maak `posts/<naam>.html`, laad `../basis.css` en `../engine.js`, zet je elementen absoluut
op een `.mo-canvas` met vaste pixelmaat en schrijf één `render(t)` die alles op tijdstip `t`
tekent (gebruik `Motion.p(t, van, tot, easing)` voor voortgang). Start met
`Motion.maak({ duur, render })`. Geen CSS-animaties: dan blijft elk frame reproduceerbaar.

Huisstijl: Bricolage (koppen) + Inter (tekst) uit `fonts/` (SIL OFL), inkt `#0d0d1a`,
oranje `#ff6a13 → #ff4500`, room `#fff6ec`, mascotte via `mascotSVG(stemming, grootte)` uit `mascotte.js`.
Reels: houd tekst tussen y≈250 en y≈1500 (boven- en onderkant bedekt Instagram).
