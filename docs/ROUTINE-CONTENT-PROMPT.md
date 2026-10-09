# Opdracht van de dagelijkse content-routine

Dit is de tekst die de routine "Slagio content" elke ochtend krijgt (trigger in Claude Code
Remote, vaste sessie). Pas je hem aan, werk dan ook de trigger bij.

---

NIEUWE DAGELIJKSE RUN. Eerdere berichten in deze sessie zijn alleen context: begin vandaag opnieuw bij STAP -1.

STAP -1 - Werkmap gelijkzetten (deze vaste sessie heeft de repo met schrijfrechten):
- Ga naar de repo-map van pepijnrosmalen2008-droid/examenapp-havo (zoek hem met `ls /home/user` of `git rev-parse --show-toplevel`).
- Zet hem gelijk met de nieuwste main: `git fetch origin main && git checkout -B main origin/main && git clean -fd`. Werk nooit verder op een stand van een vorige dag.
- Controleer meteen of pushen kan: `git push --dry-run origin HEAD:main`. Lukt dat niet, meld dat direct met de foutmelding en stop.

Je bent Claude Code en werkt aan Slagio, een examentrainer voor havo/vwo/vmbo. Dit is een automatische dagelijkse taak: maak ELKE RUN MINIMAAL 5 LEERDOELEN af volgens de gouden standaard v2, en liefst een heel domein (alle leerdoelen ervan). Dit is echte examenstof voor leerlingen; een fout antwoord of een foute figuur is schadelijk. Elk leerdoel moet net zo goed zijn als de referentie: neem per leerdoel de volle tijd voor STAP 2 t/m 4, ook bij het vijfde. Minder leerdoelen afmaken is beter dan een leerdoel onder de lat.

STAP 0 - Lees eerst (schrijf nog niets):
- `CLAUDE.md` (vooral "Adding content" en "Mini-clips").
- `docs/GOUDEN-STANDAARD-V2.md`: dit is de lat, bindend. Lees §0 (strengere lat sinds 9 okt) als eerste: moeilijker en rijkere figuren.
- De referentiemodule: `content-pending/havo-bi-M3.json` en `content-pending/havo-bi-M3.html`. Render hem één keer (`node scripts/render-leerdoel.mjs havo bi M3`) en bekijk de png's met de Read-tool, zodat je ziet hoe goed eruitziet. bi.M3 is het voorbeeld voor uitleg per fout antwoord en voor figuren; voor moeilijkheid geldt §0 van de lat (strenger dan bi.M3).
- De Nederlands-leerdoelen A t/m D (havo-nl-*) zijn GEEN voorbeeld meer: ze zijn te makkelijk en hun figuren zijn lijstjes. Doe het beter.
- `docs/CONTENT-EXPANSION-QUEUE.md`.

STAP 1 - Kies het leerdoel:
- Neem het bovenste open domein (`- [ ]`). Staan er nog geen leerdoel-regels onder, zet ze er dan eerst onder: 4-8 leerdoelen uit `knowledge/<niveau>/<vak>.json` of, als die er niet zijn, uit `syllabi/2027/<niveau>-<vak>.txt`, in de vorm `  - [ ] A1 · nl.A.1 Naam`.
- Werk de open leerdoelen van dat domein van boven naar beneden af. Is het domein af en heb je er nog geen 5 gedaan, ga dan door met het volgende open domein, tot je er minimaal 5 hebt. Een domein dat je begonnen bent maak je het liefst helemaal af (max. 8 leerdoelen per run).
- Doorloop STAP 2 t/m 5 voor elk leerdoel apart: maken, keuren, integreren, poorten, committen en pushen. Zo staat elk goedgekeurd leerdoel meteen veilig op main, ook als de run later stopt.
- Staat er "(opwaarderen)" bij: de module bestaat al als v1. Gebruik de bestaande vragen en samenvatting als grondstof en breng hem naar v2.

STAP 2 - Maak de module (bestanden `content-pending/<niveau>-<vak>-<id>.json` en `.html`):
- Bronnen: de syllabus-tekst, het leerdoel in knowledge (met misconcepties), de bestaande domeinsamenvatting en domeinvragen als grondstof. Neem geen sjabloonvragen over ("Wat houdt «X» in?").
- Volg `docs/GOUDEN-STANDAARD-V2.md` precies: `gs:2`, `lo`, 4-7 `onderwerpen`, 25-30 vragen met `s` per vraag (elk onderwerp min. 2), **R1 max. 7, R2 min. 8, R3 min. 8 op examenniveau (situatie + twee stappen redeneren, 80% met een casus van ≥120 tekens)**, **min. 8 vragen met ctx (gemiddeld ≥150 tekens)**, max. 3 kale definitievragen, **taalvak met CE: min. 2 eigen leesteksten van 500-1400 tekens met elk min. 3 vragen**, uitleg per fout antwoord die de denkfout benoemt (70-360 tekens) en uitleg bij het juiste antwoord die zegt waarom (vanaf "Klopt:"), min. 10 begrippen, 5 examenvragen met modelantwoord en `bron: "Examenstijl"`.
- `naam` en `beschrijving` zijn voor de leerling: geen jargon zoals "gouden standaard", "module" of leerdoel-codes.
- Samenvatting: intro, begrippenlijst, min. 3 hoofdstukken, elk met een figuur of clip die echt over de stof gaat, een examentip. **Min. 4 figuren/clips, waarvan min. 2 rijk (≥6 lijnen/paden/vormen en ≥5 labels) en hooguit 1 lijstfiguur.** Teken het verband, niet de lijst: grafiek met assen en ticks, doorsnede met aanwijslijnen, proces met pijlen, bij taalvakken een geannoteerd tekstfragment (de alinea zelf met haken, onderstrepingen en pijlen naar labels) of een argumentatieboom met verbindingslijnen. Zie de tabel per vak in §3 van de lat.
  Noem nooit een kleur in de tekst (de themakleur verschilt per niveau). Labels minimaal font-size 11 bij een viewBox van 320 breed.
- Examenvragen: min. 4 van de 5 met een casus/bron van ≥150 tekens; open vragen met puntenverdeling ("(1p)").
- Clips: hergebruik een bestaande clip als hij inhoudelijk past (pas labels en bijschriften aan). Een nieuwe clip mag alleen via de spec-engine (`SPECS` in sam-clip.js) en alleen als je de frames hebt bekeken en ze kloppen. Twijfel: maak een statische stappenfiguur.
- Verzin nooit feiten, examenvragen of bronnen. Vaardigheidsvakken: vragen op zelfgeschreven fragmenten en leesteksten in `ctx` (bij een CE-domein min. 2 teksten van 500-1400 tekens, zie §5 van de lat); neem nooit een echte examentekst over.

STAP 3 - Keur je eigen werk (herhaal tot alles klopt):
- `node scripts/check-leerdoel.mjs content-pending/<x>.json content-pending/<x>.html` moet "KLAAR" geven.
- `node scripts/render-leerdoel.mjs --html content-pending/<x>.html --uit /tmp/r-<x>` mag geen harde fouten geven. Bekijk daarna ELKE png met de Read-tool (pagina licht en donker, elke figuur, clipframes). Vraag je per figuur af: klopt dit inhoudelijk, is het leesbaar op een telefoon, leert een leerling er iets van? Zo niet: verbeteren en opnieuw renderen.
- Lees daarna alle vragen na als een strenge docent: is er precies één juist antwoord, klopt het juiste antwoord met de syllabus, benoemt elke uitleg de echte denkfout, verraadt de vraag het antwoord niet? Verbeter wat niet klopt.
- Toets de moeilijkheid: zou een gemiddelde examenkandidaat elke R3-vraag in één keer goed hebben zonder de bron te lezen? Dan is hij te makkelijk. Zijn afleiders weg te strepen zonder de stof te kennen? Vervangen.
- Toets elke figuur: kan dit ook als een rijtje tekst? Dan is het geen figuur; teken het verband.

STAP 4 - Integreren en poorten:
- `node scripts/integreer-leerdoel.mjs <niveau> <vak> <domein> content-pending/<x>.json content-pending/<x>.html`
- `node scripts/split-data.js`
- Is het vak bi, na of sk (havo): `node scripts/tag-leerdoelen.js havo <vak>`.
- Poorten, allemaal groen: `node scripts/build-questions.js --check`, `node scripts/validate-content.mjs`, `node scripts/validate-goldstandard.mjs`, `node scripts/smoke.mjs`.
- Rode poort die je niet betrouwbaar kunt repareren: `git checkout . && git clean -fd`, push niets, meld wat er misging. Nooit rode content live.

STAP 5 - Afronden (alleen als alles groen is):
- Per leerdoel één commit en push (niet alles aan het eind).
- Haal vlak voor het committen nogmaals main op (`git fetch origin main`); is main intussen veranderd, rebase dan je werk erop (`git stash && git reset --hard origin/main && git stash pop`, conflicten zorgvuldig oplossen) en draai de poorten opnieuw.
- Bump de SW-cache in `sw.js` regel 1 (`const CACHE = 'slagio-vXX'`) met 1 ten opzichte van main.
- Vink in `docs/CONTENT-EXPANSION-QUEUE.md` het leerdoel af met een korte notitie (aantal vragen, begrippen, figuren, clip hergebruikt/nieuw). Zijn alle leerdoelen van het domein af, vink het domein af. Verhoog de teller "N leerdoelen op v2".
- Commit alles samen, bijvoorbeeld "Content v2: havo nl A1 Tekstsoort en schrijfdoel bepalen". Eindig met:
  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
- Push direct naar `main` (`git push origin HEAD:main`); bij netwerkfout tot 4x met backoff (2s, 4s, 8s, 16s).
- Lukt pushen naar main echt niet, push dan naar de branch `content/<JJJJ-MM-DD>` en meld dat duidelijk met de foutmelding.

Rapporteer aan het eind per leerdoel: welk leerdoel, wat je maakte (vragen per R-niveau, begrippen, figuren, clip), wat je bij het zelf keuren hebt verbeterd, de uitslag van de poorten, en of er gepusht is (met de commit-hash). Sluit af met het totaal van deze run en de nieuwe stand van de teller.
