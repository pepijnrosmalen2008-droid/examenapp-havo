# 2027-syllabi als bron voor alle content

> **Doel:** elke gouden leerdoel-spec grondt op het officiële CvTE-examenprogramma
> **2027** (examenblad.nl). Zo is de examenstof-afbakening (welke onderwerpen, CE vs
> SE) niet verzonnen maar bronwaar.

## De vindplaats
- Officieel: **examenblad.nl** → per jaar/niveau/vak. Voorbeeld-landingspagina:
  `https://www.examenblad.nl/2027/havo/vakken/exacte-vakken/biologie-havo`
- De syllabus zelf is een PDF met patroon:
  `https://www.examenblad.nl/system/files/exam-document/2025-07/syllabus-<vak>-<niveau>-2027-versie-2.pdf`
  (soms `_versie-2`; naam varieert: `nederlands-3f`, `moderne-vreemde-talen`, …).

Bevestigde directe PDF-URL's (peildatum sep 2026 — check op nieuwere versie):
- Biologie vwo: `…/2025-07/syllabus-biologie-vwo-2027_versie-2.pdf`
- Natuurkunde havo: `…/2025-07/syllabus-natuurkunde-havo-2027-versie-2.pdf`
- Maatschappijwetenschappen vwo: `…/2025-07/syllabus-maatschappijwetenschappen-vwo-2027_versie-2.pdf`
- Nederlands (3F) havo: `…/2025-07/syllabus-nederlands-3f-havo-2027-versie-2.pdf`
- Moderne vreemde talen havo: `…/2025-07/syllabus-moderne-vreemde-talen-havo-2027-versie-2.pdf`

## ⚠️ Waarom dit een eenmalige stap van JOU vraagt
De cloud-omgeving waarin de generatie draait, mag **niet** naar examenblad.nl
(egress-proxy). Alleen jouw eigen machine kan de PDF's ophalen. Daarom:

## Het recept (eenmalig, ~15 min, gratis)
1. Op jouw machine, in de repo-map, maak `syllabi/2027/`.
2. Download per vak de **"Syllabus centraal examen 2027"**-PDF van de landingspagina
   en sla 'm op als `syllabi/2027/<niveau>-<vakId>.pdf`
   (vakId = zoals in de app: `bi`, `na`, `ec`, `gs`, …; niveau = `havo`/`vwo`/`vmbo`).
   - PowerShell-voorbeeld voor één vak:
     ```powershell
     iwr "https://www.examenblad.nl/system/files/exam-document/2025-07/syllabus-natuurkunde-havo-2027-versie-2.pdf" -OutFile "syllabi\2027\havo-na.pdf"
     ```
3. Converteer naar tekst (optioneel maar aanbevolen; scheelt de cloud een PDF-parser):
   sla platte tekst op als `syllabi/2027/<niveau>-<vakId>.txt`.
4. `git add syllabi/2027 && git commit -m "Syllabi 2027 als bron" && git push origin main`.

Daarna leest élke automatische sessie de lokale `syllabi/2027/<niveau>-<vakId>.(txt|pdf)`
en grondt de leerdoelen/specs erop — volledig geautomatiseerd, gratis, zonder docenten.

## Als je géén handmatige stap wilt (terugval)
Dan gronden de sessies op: de al in de app gecodeerde domeinstructuur + `ceStatus`,
een gerichte web-zoekopdracht per vak, en vakkennis. 2027-bewust en gratis, maar
minder gezaghebbend dan de volledige syllabus-PDF.
