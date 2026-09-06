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

## ✅ Status: opgehaald en in de repo (sep 2026)
De syllabi zijn opgehaald met open egress en staan als **tekst-extractie** in
`syllabi/2027/<niveau>-<vakId>.txt` — 28 vakken (havo 12 + vwo 16, m.u.v. vwo
informatica dat géén CE-syllabus heeft). Engels/Duits/Frans delen terecht de
gezamenlijke *moderne vreemde talen*-syllabus.

De **PDF-bronnen** worden bewust *niet* meegecommit (25 MB; `.gitignore`) maar zijn
reproduceerbaar:
```bash
bash scripts/fetch-syllabi.sh        # download de PDF's naar syllabi/2027/*.pdf
python3 scripts/extract-syllabi.py   # extraheert naar syllabi/2027/*.txt (pure-python pdfminer)
```
`scripts/fetch-syllabi.sh` crawlt per vak de examenblad-landingspagina →
`/2027/<niveau>/documenten/syllabus-<vak>-<niveau>` (die serveert de PDF direct).

## Hoe de generatie dit gebruikt
Élke content-sessie leest de lokale `syllabi/2027/<niveau>-<vakId>.txt` en grondt
de leerdoelen/specs op de officiële domein-/subdomein-/eindterm-afbakening —
bronwaar, gratis, zonder docenten. Dit is de `2027-syllabi`-bron uit de canon.

> **Herzien?** De CvTE publiceert soms een nieuwere `versie-x`. Draai dan de twee
> scripts opnieuw en commit de bijgewerkte `.txt`.
