# Slagio Plus — productspec

> **Status:** ontwerp vastgelegd, Fase 1 in aanbouw.
> **Eenregelpositionering:** *Gratis Slagio helpt je oefenen. Slagio Plus helpt je
> gericht beter worden en met vertrouwen je examen in.*
> Zie ook [`SLAGIO-PRODUCT-VISION.md`](SLAGIO-PRODUCT-VISION.md) (de drie lagen).

Slagio Plus is **geen setje premiumfeatures**, maar een tweede product bovenop de
gratis kern: een persoonlijke examentrainer. Merkbelofte naar de leerling:
**"Weet waar je staat. Weet wat je moet doen."**

---

## 1. De ijzeren regel: nooit pay-to-pass

Alles wat een leerling **inhoudelijk nodig heeft om te slagen** blijft gratis, voor
altijd. Verboden (zou de kernbelofte vernietigen):

- ❌ "Je gratis vragen zijn op" / dagelijkse vraaglimiet
- ❌ "Dit examen/vak is alleen voor Plus"
- ❌ "Het modelantwoord is alleen voor Plus"

De schaarste zit **niet** in de hoeveelheid oefenstof, maar in **feedback,
personalisatie en zekerheid**. De publieke copy verschuift van "100% gratis" naar
**"de kern gratis, Plus optioneel erbovenop"** — gratis moet er nog steeds absurd
goed uitzien; dat is het marketingwapen.

## 2. De knip

| | Gratis (voor altijd) | Plus |
|---|---|---|
| Alle vakken, alle vragen, snelle quiz, oud-examens | ✓ | ✓ |
| Alle proefexamens, alle versies (kort/middel/volledig) | ✓ | ✓ |
| Modelantwoorden + zelf-nakijken per scoringspunt | ✓ | ✓ |
| Cijferberekening, foutenboek, flashcards | ✓ | ✓ |
| XP, streaks, badges, divisies, ranglijsten, Vonk | ✓ | ✓ |
| **AI-nakijken** van open vragen | 3×/week gratis | ★ ruim (fair use) |
| Zwakke-puntenanalyse (domein + vraagtype + puntenlekkage) | basis | ★ uitgebreid |
| Adaptief studieplan + dagprioriteit + tijdsbudget | — | ★ |
| Examenvoorspeller + cijferontwikkeling + "nog nodig voor doel" | — | ★ |
| Examen-readiness (meerdere factoren) | — | ★ |
| Slimme herhaling / spaced repetition foutentraining | — | ★ |
| Examenmodus (afleidingsvrij) + examenrapport | — | ★ |
| Examenoverzicht alle vakken + kalender + weekcheck | — | ★ |
| Persoonlijke Vonk-coaching (milestones, patronen) | — | ★ |

## 3. Drie premiumcategorieën

- **A. Feedback — "Wat doe ik fout?"** AI-nakijken, feedback per scoringspunt,
  verbetertips, foutpatronen.
- **B. Personalisatie — "Wat moet ík doen?"** zwakke punten, adaptieve training,
  studieplan, slimme herhaling, persoonlijke doelen.
- **C. Zekerheid — "Ben ik klaar?"** voorspeld cijfer, readiness, examenanalyse,
  tijdanalyse, ontwikkeling richting examendatum.

## 4. Architectuurprincipe: AI alleen waar nodig

**Dit bepaalt of Plus schaalbaar/rendabel is.**

- **AI (Anthropic, via edge-function):** open antwoorden beoordelen, feedback en
  uitleg genereren. Hoge waarde, echt generatief.
- **Eigen Slagio-engine (rule-based / statistisch, geen AI-kosten):** domeinscores,
  vraagtype-analyse, foutfrequentie, puntenlekkage, spaced repetition, planning,
  readiness, cijfervoorspelling, prioriteitsmotor, statistieken.

Zo blijft Plus bij duizenden gebruikers goedkoop. De echte moat op termijn is niet
de AI (iedereen kan een API bellen), maar de eigen keten
*vraag → domein → vraagtype → scoringspunt → antwoord → foutpatroon → ontwikkeling → examenresultaat*
over duizenden oefeningen.

## 5. Fase 1 — AI-nakijken (killer feature)

Leerling maakt een open vraag. Gratis blijft: modelantwoord + zelf afvinken.
Plus/knopt: **★ Laat Slagio nakijken**.

Slagio stuurt naar de edge-function: `vraag`, `modelantwoord`, `rubric`
(scoringsvoorschrift, in deelpunten), `leerlingantwoord`, optioneel context.
De function bouwt de prompt, roept het model, en geeft **gestructureerde JSON**
terug (geen vrije tekst):

```json
{
  "score": 3,
  "max_score": 5,
  "points": [
    { "id": 1, "earned": true,  "feedback": "..." },
    { "id": 2, "earned": false, "feedback": "..." }
  ],
  "summary": "Je noemt het juiste gevolg, maar niet waarom het ontstond.",
  "improvement_tip": "Verbind bij oorzaak-gevolg de oorzaak expliciet met het gevolg."
}
```

De UI hergebruikt de deelpunten uit het zelf-nakijken: de AI vinkt aan welke
scoringspunten behaald zijn, plus feedback per punt + samenvatting + verbetertip.

**Belofte-formulering:** niet "AI kijkt na zoals je docent" (verwachtingen te hoog),
maar **"Slagio beoordeelt je antwoord aan de hand van het scoringsvoorschrift."**

### Kwaliteit = grootste risico
Als de AI 5/5 geeft waar een docent 2/5 geeft, is de killer feature kapot. Vóór
lancering een testset met echte leerlingantwoorden (goed / deels / fout / bijna
goed / te uitgebreig / irrelevant / synoniemen / andere formulering) vergelijken
met menselijke beoordeling.

## 6. Bouwvolgorde

1. **AI open-vraag nakijken** (deze fase) — edge-function + client-UX.
2. Data: domein- en vraagtype-analyse (eigen engine).
3. Zwakke-puntenanalyse + puntenlekkage.
4. Slim foutenboek + spaced repetition.
5. Examenvoorspeller + readiness.
6. Adaptief studieplan (examendatum, doelcijfer, tijdsbudget).
7. Examenmodus + examenrapport.
8. Plus-dashboard (alles komt samen: doel, vandaag, zwak punt, ontwikkeling, dagen).

## 7. Technische architectuur

- **Bron van waarheid = backend.** De frontend mag Plus alleen *weergeven*, nooit
  zelf toekennen.
- Profielmodel (Supabase), groeibaar:
  ```
  user
   ├── plus_status        (none | trial | active)
   ├── plus_plan          (najaar | examen | jaar | flex)
   ├── plus_until         (datum)
   └── ai_usage { period, count }
  ```
  Later uitbreiden: transacties, coupons, schoolcodes, cadeaucodes.
- **slagio-ai edge-function** (Supabase): `authenticate → check usage → rubric +
  modelantwoord ophalen/ontvangen → prompt bouwen → AI → response valideren →
  resultaat terug → usage loggen`. API-key **alleen server-side**, nooit in de
  frontend. Geeft rate limiting, fair use, logging en kostencontrole.
- Client: `plusActive()` + gratis-proefteller (3/week) gaten de AI-knop; bij een
  lege endpoint degradeert de UI netjes.

## 8. Prijs (seizoensmodel)

| Product | Prijs | Periode | Rol |
|---|---|---|---|
| 🟢 Plus Najaar | € 7,99 | sep → 31 jan | vroege gebruikers |
| 🟣 Plus Heel examenjaar ⭐ | € 24,99 eenmalig | sep → einde examens | **beste deal, prominent** |
| 🟠 Plus Examenperiode | € 14,99 eenmalig | feb → einde examens | late-conversie piek |
| 🔵 Flex | € 4,99 / mnd | maandelijks opzegbaar | wie geen bedrag ineens wil |

- Alle vakken inbegrepen (nooit per-vak prijzen): *"€X voor mijn hele examenperiode"*.
- Gratis proef: **3 AI-beoordelingen per week**, geen creditcard, geen auto-verlenging.
- Prijsanker: presenteer het jaarpakket als "Aanbevolen"; de €4,99/mnd ernaast laat
  €24,99 als goede deal voelen. Geen automatische verlenging.
- Betaalprovider: **Mollie + iDEAL** (Nederlands, ouders/leerlingen), webhook zet
  `plus_until`.

## 9. Verkoop-UX

- Paywall verkoopt nooit met "je kunt niets meer", maar "je kunt gewoon verder
  oefenen en zelf nakijken — dat blijft gratis; Plus maakt het makkelijker".
- CTA niet "Upgrade naar Premium" maar **"🎯 Zie hoe ik ervoor sta" / "🚀 Maak mijn
  examenplan"**.
- Verkooppagina opent met de vraag, niet met de techniek: *"Weet jij of je klaar
  bent voor je examen?"* Killer-belofte: **"Van 'ik moet meer leren' naar 'ik weet
  precies wat ik moet doen.'"**

## 10. Niet bouwen

AI-chatbot als hoofdfeature; AI die alles genereert; premium skins als
hoofdverkoopargument; betaalde vragen; advertenties in gratis; bergen generieke
dashboards. Een dashboard beantwoordt "wat moet ik doen?", niet "hier zijn 37
grafieken".
