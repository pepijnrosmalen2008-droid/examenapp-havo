# Slagio Sprintbord

> **De regel:** iedere sprint eindigt met één zichtbare verbetering voor de leerling.
> Niet: nog een engine, nog een analyse. Wel: bouw → zet live → meet gebruik → verbeter → herhaal.
>
> Elke sprint hieronder eindigt met **"Wat ziet de leerling nieuw?"**. Als dat vakje leeg is, is de sprint niet af.

---

## Sprint 1 ✅ — Foutenboek 2.0 *(live)*

Elke fout wordt automatisch bewaard mét juist antwoord, hoe vaak, wanneer, en — waar bekend — leerdoel + misconceptie. Spaced repetition (Leitner) plant de herhaling; een herhaalquiz oefent precies jouw open fouten.

**Wat ziet de leerling nieuw?** Een Foutenboek met due-badge op de home; "Waarom ging dit fout?" per fout; één knop "Oefen N fouten nu"; fouten die 🟢 beheerst worden en verdwijnen.

**Meet:** `foutenboek_open`, `foutenboek_oefen` (aantal, vak). → hoeveel leerlingen openen het, hoeveel herhaalsessies, hoeveel fouten bereiken "beheerst".

---

## Sprint 2 🔨 — "Waarom fout?" in de quiz zelf

De misconceptie achter een fout verschijnt nú al in het Foutenboek. In Sprint 2 brengen we hem naar het moment dat het telt: **direct na een fout antwoord in de quiz** — het punt dat een leerling tientallen keren per dag raakt.

- **2a (nu, zonder LLM):** toon de veelgemaakte fout voor dit onderwerp inline onder "Fout", uit de bestaande kennislaag (bi/sk/na).
- **2b (generatief, vereist een keuze):** per-afleider redenering — *"Waarom is A fout? Waarom is C verleidelijk? Hoe herken je dit volgende keer?"* Dit vereist een LLM. Twee eerlijke paden, geen speculatieve infra:
  - **Vooraf genereren** bij build-time → statisch meegeleverd (geen runtime-key, geen backend). Past bij het bestaande "prozastap = pluggable LLM"-patroon.
  - **Supabase Edge Function** als dunne proxy die de key serverside houdt → live/dynamisch, minimale backend.

**Wat ziet de leerling nieuw?** (2a) Bij een fout meteen: *"💡 Veelgemaakte fout: verwart onafhankelijke en afhankelijke variabele."*

---

## Sprint 3 — Persoonlijk studieplan

Niet "oefen biologie", maar een concrete daglijst opgebouwd uit echte signalen (Foutenboek-due, zwakke leerdoelen, examendatum).

> Vandaag: 6 fouten uit Foutenboek · 8 min Osmose · 4 vragen Enzymen

**Wat ziet de leerling nieuw?** Een dagplan met afvinkbare, korte blokken i.p.v. een vage vak-aansporing.

---

## Sprint 4 — Slimme herhaalplanning

Foutenboek-spaced-repetition uitbreiden naar álle geoefende leerdoelen (niet alleen fouten): kennis die dreigt weg te zakken komt vanzelf terug bovendrijven.

**Wat ziet de leerling nieuw?** "Deze 5 dingen zakken weg — fris ze op" met een geplande, niet-overweldigende cadans.

---

## Sprint 5 — Dagelijkse missie

Eén duidelijke opdracht per dag, gekoppeld aan de zwakste plek + streak. Klein, haalbaar, elke dag anders.

**Wat ziet de leerling nieuw?** Een dagmissie op de home die zich aanpast aan wat jij vandaag het hardst nodig hebt.

---

## Sprint 6 — Examencoach

Na elke sessie een eerlijke inschatting op basis van je data.

> Als het CE morgen was, verwacht ik een 6,7.
> Grootste risico: Ecologie. Grootste winst: Osmose.

**Wat ziet de leerling nieuw?** Een cijferverwachting + het grootste risico en de grootste winst — het inzicht waar leerlingen voor terugkomen.

---

## Ritme

Eén zichtbare verbetering per week. De kennisgraaf is de fundering, niet het product — vanaf hier bijna vergeten dat hij er is, en gewoon features bouwen die hem verzilveren.
