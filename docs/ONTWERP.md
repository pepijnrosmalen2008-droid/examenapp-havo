# Slagio · ontwerprichtlijnen

**Eigenaar: Pepijn.** Dit document is van jou. Wat hier staat, geldt voor het hele
platform: de app, de vakpagina's, de leerpagina's, social en de briefing van Jarvis.
Claude (de bouwer) houdt zich eraan bij elke wijziging, Jarvis controleert elke week of
de schermen eraan voldoen. Wil je iets anders, pas het hier aan of zeg het tegen Claude;
dan wordt het eerst hier vastgelegd en daarna gebouwd.

Volgorde bij twijfel: jouw woorden in een gesprek → dit document → `CLAUDE.md` → wat er al staat.

## 1. Gevoel

- **Rustig en vriendelijk, nooit druk.** Hooguit één ongevraagde melding per bezoek, hooguit
  twee grote momenten na een quiz. Liever één duidelijke knop dan drie.
- **Speels waar het beloont, strak waar je leert.** Beloningen (XP, munten, kisten, Vonk)
  mogen vrolijk en bewegend zijn. Vragen, uitleg en samenvattingen zijn rustig en leesbaar.
- **Telefoon eerst.** Elk scherm werkt op 390 px breed met één duim. Desktop is een
  verbrede telefoon met een zijbalk, geen ander product.

## 2. Kleur

| Rol | Waarde | Gebruik |
|---|---|---|
| Havo | `#1d4ed8` (donker `#4c8dff`) | niveaukleur: knoppen, accenten, aftelklok |
| Vwo | `#6d28d9` (donker `#a78bfa`) | idem |
| Vmbo | `#0d9488` (donker `#2dd4bf`) | idem |
| Beloning | goud `#f59e0b` → oranje `#f97316` | XP, munten, streak, kisten, level-ups |
| Goed / fout | `#22c55e` / `#ef4444` | alleen voor juist/onjuist en status |
| Kop van menu, Vonk-chat, aftelklok | nachtblauw `#0f1118`–`#181c28` | donkere "premium" vlakken |

- De niveaukleur is het merk van dat niveau; noem in tekst nooit een kleur ("klik op de blauwe knop").
- Elke kleur bestaat in licht én donker. Donkere modus is geen omgekeerde lichte modus.

## 3. Letters

- Koppen: **Bricolage Grotesque**, vet. Lopende tekst en knoppen: **Inter**.
- Slagio Clash heeft een eigen wereld (Cinzel, Alegreya); die blijft binnen Clash.
- Minimaal 13 px voor tekst die je moet lezen, 15–16 px voor uitleg en vragen.

## 4. Vormen en knoppen

- **Dikke tegels**: afgeronde hoeken (14–20 px), 2 px rand en een dikkere onderrand (4 px)
  die indrukt bij een tik. Zo voelt een knop als een knop.
- Tikvlak minstens 44 × 44 px (kleine knoppen krijgen een onzichtbaar groter vlak).
- Eén hoofdknop per scherm in de niveaukleur; de rest licht of omlijnd.
- Terug- en themaknop: rond glas, de chevron komt uit de stijl, geen "←" in de tekst.

## 5. Tekeningen en Vonk

- **Vonk-stijl**: vlakke vectorkunst, twee tinten per vorm, geen verlopen of gloed, geen
  zwarte omtreklijnen (behalve in Clash).
- Vonk is het maatje en de stem van Slagio. **Eén Vonk tegelijk in beeld.**
- Geen stockfoto's en geen door AI gemaakte afbeeldingen van mensen.

## 6. Beweging

- Kort en met een reden: 150–350 ms voor knoppen en panelen, veer voor beloningen.
- Respecteer "minder beweging" van het apparaat: dan alleen fades.

## 7. Taal

- Nederlands, je/jij, korte zinnen, één gedachte per zin. Praat als een slimme ouderejaars.
- Geen gedachtestreepjes, geen AI-woorden ("ontdek", "duik in", "ontgrendel", "boost").
- Knoppen zeggen wat er gebeurt ("Oefen dit", "Maak een proefexamen"), niet "Klik hier".
- Foutmeldingen zeggen wat er misging en wat je kunt doen, zonder sorry.
- SE-stof heet nooit examenstof. Slagio-vragen zijn nooit "officiële examenvragen".

## 8. Wat bewust zo blijft

Herhalen, Foutenboek, Studieplan, Spelen, Topscores, Groep, de oefenmodus-kiezer, inloggen
en het voortgangsrapport hebben een eigen karakter. Niet gelijktrekken zonder overleg.

## 9. Hoe dit wordt bewaakt

- **Claude** stuurt bij een zichtbare wijziging eerst screenshots (licht, donker, telefoon,
  desktop) en zet pas live na jouw akkoord, tenzij je "zet live" zegt.
- **Jarvis** draait elke week `scripts/social/schermen.mjs`, bekijkt de screenshots tegen
  dit document en zet afwijkingen als opdracht in de backlog.

*Laatst bijgewerkt: 22 okt 2026 (eerste versie, samengesteld uit de huidige app).*
