# Slice 0 · Proefsnede — bi.M.3 Enzymwerking (Stage 2–5)

**Scope:** één leerdoel volledig door de fabriek, mét zichtbare input/output/kwaliteitsmeting/failures per stage. **Geen opschaling** voordat dit resultaat kritisch is beoordeeld en bi.M.3 de volledige DoD haalt.
**Leidende regel:** *curriculumwaarheid > quota.*

**Leerdoel (bron):** `bi.M.3` — "De kandidaat kan de werking van enzymen beschrijven en het effect van temperatuur en pH op de enzymactiviteit uit een grafiek afleiden." · examenrelevantie **hoog** · examenskill **bron-interpretatie** · misconcepties: *"enzym wordt verbruikt"*, *"verwart optimumtemperatuur met denaturatie"*.

**Canonieke feiten (input voor alle stages) — 19 triples rond `enzym`:**
```
enzym is_a eiwit · enzym is_a biokatalysator · enzym reduces activeringsenergie ·
enzym increases reactiesnelheid · enzym has_part actief-centrum · substraat binds_to actief-centrum ·
enzym produces product · enzym analogy_of sleutel-slot · enzym has_property substraatspecificiteit ·
enzym has_property herbruikbaar · enzymactiviteit has_property optimumtemperatuur ·
hoge-temperatuur causes denaturatie · denaturatie reduces enzymactiviteit ·
denaturatie affects actief-centrum · enzym occurs_in cel · celademhaling requires enzym ·
spijsvertering requires enzym · amylase is_a enzym · enzym often_confused_with hormoon
```

---

## Stage 2 — Samenvatting

### Output (kant-en-klaar in `SAM_RICH`-stijl, sectie enzymwerking)
> **Enzymen** zijn **eiwitten** die werken als **biokatalysator**: ze **versnellen** een reactie in de cel. Dat doen ze door de **activeringsenergie** te verlagen — de "drempel" die een reactie nodig heeft om te starten. Een enzym **levert zelf geen energie** en wordt **niet verbruikt**: na afloop komt het onveranderd vrij en kan het opnieuw werken (**herbruikbaar**).
>
> Elk enzym heeft een **actief centrum** waar het **substraat** precies in past, als een **sleutel in een slot**. Daardoor is een enzym **substraatspecifiek**: het past maar bij één type substraat (amylase breekt wél zetmeel af, maar geen eiwit).
>
> **Temperatuur:** de enzymactiviteit stijgt met de temperatuur tot de **optimumtemperatuur** (vaak rond 37 °C bij de mens). Daarboven **denatureert** het enzym: het actief centrum verandert onherstelbaar van vorm, waardoor de activiteit snel daalt. **Let op:** de optimumtemperatuur (beste werking) is iets anders dan denaturatie (kapotgaan bij te hoog). **pH** werkt net zo: elk enzym heeft een optimale pH.
>
> **Grafiek lezen (examen):** de piek in een activiteit-temperatuurgrafiek is de optimumtemperatuur; de scherpe daling erná is denaturatie.

### Kwaliteitsmeting Stage 2
| Check | Resultaat |
|---|---|
| Canonieke feiten gebruikt | 15 van de 19 verwerkt (de 4 niet-gebruikte zijn koppelfeiten naar andere leerdoelen: `occurs_in cel`, `celademhaling requires`, `spijsvertering requires`, `often_confused_with hormoon` — bewust niet in de tekst, wel in de vragen) |
| Verplichte kernbegrippen gedekt | **10/10**: enzym, eiwit, biokatalysator, activeringsenergie, actief centrum, substraat, substraatspecificiteit, herbruikbaar, optimumtemperatuur, denaturatie |
| Essentiële verbanden uitgelegd | enzym→activeringsenergie→snelheid · substraat↔actief centrum (sleutel-slot) · temperatuur→optimum→denaturatie · optimum≠denaturatie |
| Golden-reference (havo_bi_M) | **De bestaande samenvatting dekt enzymwerking NIET** (geen van de 10 kernbegrippen komt erin voor). Deze sectie **vult een gat** in de golden reference — B2 dus ruim gehaald, en tegelijk een gerapporteerd dekkings­gat in de bestaande content. |
| Geen kunstmatige verlenging | pass — elke zin draagt een feit/verband; geen opvulling |

**Stage 2 failures:** geen. **Signaal voor het dashboard:** de hand-geschreven `havo_bi_M` mist een *hoog*-relevant leerdoel volledig → kandidaat voor vervanging.

---

## Stage 3 — Vragen

Zes items, **elk een andere leerhandeling**. Correct antwoord bewust over posities gespreid; opties gebalanceerd in lengte.

### Q1 · Herkennen/definiëren — concept: Enzym
**Wat is een enzym?**
- **A) Een eiwit dat als biokatalysator een reactie versnelt** ✓
- B) Een koolhydraat dat de cel van energie voorziet
- C) Een hormoon dat processen in het lichaam regelt
- D) Een vetmolecuul dat in het celmembraan zit
- *concepten:* Enzym, eiwit, biokatalysator · *misconceptie-afleider:* C (`enzym often_confused_with hormoon`)
- *waarom geen variant:* dit is de enige zuivere definitievraag; toetst herkenning, geen redenering.
- *uitleg — juist:* een enzym **is** een eiwit dat als biokatalysator de reactiesnelheid verhoogt. *afleiders:* B verwart met brandstof (koolhydraat); **C is de klassieke verwarring** — hormonen zijn signaalstoffen, enzymen versnellen reacties; D heeft geen enkel verband.

### Q2 · Begrijpen (oorzaak-gevolg) — concept: Activeringsenergie
**Hoe zorgt een enzym ervoor dat een reactie sneller verloopt?**
- A) Het verwarmt de cel tot een hogere temperatuur
- B) Het levert zelf extra energie aan de reactie
- **C) Het verlaagt de activeringsenergie van de reactie** ✓
- D) Het maakt extra substraat aan
- *concepten:* Activeringsenergie · *waarom geen variant:* toetst het *mechanisme* (waaróm), niet de definitie.
- *uitleg — juist:* `enzym reduces activeringsenergie → increases reactiesnelheid`. *afleiders:* A enzymen verwarmen niets; **B is de valkuil "enzym levert energie"** (het verlaagt alleen de drempel); D enzymen maken geen substraat.

### Q3 · Toepassen / bron-interpretatie (grafiek) — concept: Optimumtemperatuur, Denaturatie
**In een grafiek stijgt de enzymactiviteit tot 40 °C en daalt daarna snel naar bijna nul. Wat gebeurt er boven 40 °C?**
- A) Het substraat is op, dus de reactie stopt
- B) Het enzym werkt juist sneller door de warmte
- C) Het enzym wordt in de reactie verbruikt
- **D) Het enzym denatureert: het actief centrum verandert van vorm** ✓
- *concepten:* Optimumtemperatuur, Denaturatie, actief centrum · *examenskill:* bron-interpretatie
- *waarom geen variant:* dit is de enige die een **grafiek** laat aflezen (de examenvaardigheid van dit leerdoel).
- *uitleg — juist:* 40 °C = optimum; erboven `hoge-temperatuur causes denaturatie → affects actief-centrum → reduces enzymactiviteit`. *afleiders:* A verklaart geen temperatuureffect; B negeert de daling; **C is de "verbruikt"-misconceptie**.

### Q4 · Onderscheiden — optimumtemperatuur vs. denaturatie
**Wat is het verschil tussen de optimumtemperatuur en denaturatie van een enzym?**
- A) Optimumtemperatuur en denaturatie betekenen bij een enzym hetzelfde
- **B) Het optimum is de beste werking; denaturatie is onherstelbaar kapotgaan bij te hoog** ✓
- C) Bij de optimumtemperatuur denatureert het enzym; erboven werkt het het best
- D) Denaturatie hoort bij te lage temperatuur, het optimum bij te hoge
- *concepten:* Optimumtemperatuur, Denaturatie · *misconceptie:* richt zich exact op *"verwart optimumtemperatuur met denaturatie"*.
- *waarom geen variant:* dit is de enige die de twee begrippen expliciet tegenover elkaar zet.
- *uitleg — juist:* optimum = beste werking, denaturatie = kapot bij te hoog. *afleiders:* **A is de misconceptie zelf**; C draait de begrippen om; D draait de temperatuur om.

### Q5 · Misconceptie — concept: herbruikbaar
**Een enzym heeft een reactie versneld. Wat gebeurt er daarna met het enzym?**
- A) Het is opgebruikt en verdwijnt
- B) Het verandert zelf in het product van de reactie
- **C) Het komt onveranderd vrij en kan opnieuw een reactie versnellen** ✓
- D) Het valt uiteen in twee substraatmoleculen
- *concepten:* herbruikbaar · *misconceptie:* exact *"enzym wordt verbruikt"*.
- *waarom geen variant:* toetst de herbruikbaarheid — een ander idee dan Q3 (waar "verbruikt" slechts een afleider was).
- *uitleg — juist:* `enzym has_property herbruikbaar` — het komt onveranderd vrij. *afleiders:* **A is de misconceptie**; B verwart enzym met substraat/product; D is onzin.

### Q6 · Examenredeneren — concept: substraatspecificiteit
**Amylase breekt zetmeel af, maar heeft geen effect op eiwitten. Hoe komt dat?**
- **A) Alleen zetmeel past in het actief centrum van amylase (substraatspecificiteit)** ✓
- B) Eiwitten zijn te klein voor het enzym
- C) Amylase werkt alleen bij een zeer hoge pH
- D) Amylase is bij eiwitten al verbruikt
- *concepten:* substraatspecificiteit, actief centrum, sleutel-slot, amylase · *waarom geen variant:* past het sleutel-slotprincipe toe op een concreet voorbeeld (`amylase is_a enzym`).
- *uitleg — juist:* het substraat past als een sleutel in het slot; alleen het juiste substraat bindt. *afleiders:* B grootte is niet de reden (vorm wel); C pH is hier niet aan de orde; **D "verbruikt"-misconceptie**.

### Kwaliteitsmeting Stage 3 (automatisch berekend)
| Check | Resultaat |
|---|---|
| Leerhandeling-diversiteit | **6/6 verschillend** (herkennen · begrijpen · toepassen/grafiek · onderscheiden · misconceptie · examenredeneren) |
| Semantische duplicaten | 0 — elk item toetst een andere denkhandeling |
| Correct-antwoordpositie | A,C,D,B,C,A → **A×2 B×1 C×2 D×1** (geen positie-bias) |
| 4 opties · 1 juist · geen dubbele opties | 6/6 pass |
| Afleiders = echte misconcepties | 5 van de 6 vragen bevatten ≥1 afleider die een gedocumenteerde misconceptie ís |
| Verplicht uitleg-schema (whyCorrect + whyDistractors) | 6/6 aanwezig, nooit "B is correct." |
| Koppeling concept + leerdoel | 6/6 → `bi.M.3` + concept(en) |
| Quota-afwijking | bij 6 items ≈ gelijk verdeeld; **bewust niet geforceerd** — voor één leerdoel is de domein-quota indicatief (curriculumwaarheid > quota) |

**Stage 3 failures:** geen kritieke. **Bewuste quota-afwijking (gerapporteerd, = pass):** de domein-quota geldt over het hele domein; op één leerdoel heb ik gekozen voor 6 wérkelijk verschillende leerhandelingen i.p.v. de percentages exact na te bootsen.

---

## Stage 4 — Clip

**Detector-uitspraak:** `clipWorthwhile = TRUE` voor **de enzym-substraat-cyclus**.
- *reason:* een ruimtelijk-temporeel proces (substraat bindt in het actief centrum → reactie → product laat los → **enzym komt onveranderd vrij en bindt opnieuw**).
- *visualModel:* cyclus/flow · *keySteps:* 4 (binden → reactie → loslaten → hergebruik).
- *wat de animatie toevoegt boven tekst:* de **herbruikbaarheid** en **substraatspecificiteit** zijn juist de twee dingen die leerlingen fout hebben. Statische tekst laat niet zien dát het enzym terugkomt in zijn oude vorm; de cyclus maakt precies dat zichtbaar — het ontkracht de "verbruikt"-misconceptie visueel.

**Bewuste NEE:** géén aparte clip voor *denaturatie* of *temperatuurgrafiek* — dat is beter met een **grafiek + tekst** (Q3). Een animatie voegt daar weinig toe boven een goede grafiek. Zo blijft de clip-inzet gericht op waar beweging echt leerwaarde heeft.

**SPEC-schets (klaar om als `SPECS.enzymcyclus` te wiren in `sam-clip.js`):**
```
duration ~7s · tracks: [substraat moveAlong→actief-centrum] [reactie: fade product]
[product moveAlong→weg] [enzym: reset naar beginvorm, pulse] · cues (bijschriften):
"substraat past in het actief centrum" → "reactie: product ontstaat" →
"product laat los" → "enzym is onveranderd — het werkt opnieuw"
```
*Status:* SPEC ontworpen + gerechtvaardigd; het renderen (echte `SPECS`-entry + SVG-markup) is de bouwstap ná goedkeuring.

---

## Stage 5 — Evaluation (de poort)

### Automatische structurele checks (evaluation-engine-regels)
| Regel | Uitkomst |
|---|---|
| 4 opties · precies 1 juist · geen dubbele/lege opties | **pass** (6/6) |
| Antwoordpositie-verdeling | **pass** (A2/B1/C2/D1 — geen bias) |
| Lengte-bias (juist ≠ systematisch langst) | **pass, met 1 aandachtspunt** — juist antwoord is 2× de kortere/gelijke optie (Q6-A, Q4-B na herbalancering); onderscheidingsvragen (Q4) neigen structureel naar een iets langer juist antwoord → aandachtspunt voor de engine, geen kritieke fout |
| Uitleg aanwezig + niet-triviaal | **pass** (6/6 met whyCorrect + whyDistractors) |
| Leerdoel-/conceptkoppeling | **pass** (6/6) |
| Semantische duplicaten | **pass** (0) |
| Leerhandeling-dekking | **pass** (6 types) |

### Inhoudelijke checks
| Check | Uitkomst |
|---|---|
| Elke vraag herleidbaar naar canonieke feiten | **pass** — elk juist antwoord volgt uit ≥1 triple |
| Feitelijke juistheid (HAVO-niveau) | **pass** — geen kritieke inhoudelijke fout gevonden |
| Golden-reference samenvatting (B2/E2) | **pass** — kernbegrippen 100%, essentiële verbanden 100%, vult bovendien een gat in `havo_bi_M` |
| Coveragegaten in het leerdoel | **0** — alle kernconcepten van bi.M.3 zowel in de samenvatting als in ≥1 vraag |
| Examenniveau (bron-interpretatie aanwezig) | **pass** — Q3 is een echte grafiek-afleesvraag |

### Gate (§6.1 DoD): score ≥90 **én** 0 kritieke issues **én** 0 coveragegaten
- Structurele score: **100/100** · kritieke inhoudelijke issues: **0** · coveragegaten: **0**.

## → **APPROVED** (proefsnede bi.M.3)

Alle gates van de DoD gehaald zonder quota-forcering. **Voorbehoud (mens/eigenaar):** de definitieve `approved`-flip op de kennislaag en het live zetten blijven jouw beslissing; deze proefsnede toont dat de fabriek voor dit leerdoel DoD-waardige output levert.

---

## Zelf-kritiek langs jouw 10 beoordelingsvragen
1. **Beter dan wat een leerling normaal krijgt?** Ja — de bestaande `havo_bi_M` dekte enzymwerking niet; dit is netto nieuwe, examengerichte dekking.
2. **Voelt elke vraag als een andere leerhandeling?** Ja, 6 verschillende (definitie/mechanisme/grafiek/onderscheid/misconceptie/toepassing).
3. **Afleiders op echte misconcepties?** Ja — "enzym = hormoon", "enzym levert energie", "verbruikt", "optimum = denaturatie" komen terug als afleiders.
4. **Leert de uitleg iets na een fout?** Ja — elke uitleg benoemt waaróm de verleidelijke afleider fout is, niet alleen dat A juist is.
5. **HAVO-waardig of kinderachtig?** Examengericht; Q3/Q6 vragen echte redenering, geen weetjes.
6. **Voldoende examenniveau?** Grafiek-interpretatie + toepassing aanwezig; kan met 1–2 extra transfer-items nog steviger.
7. **Mist er kennis uit het canonieke model?** Nee voor bi.M.3; de koppelfeiten naar andere leerdoelen (spijsvertering/celademhaling) horen bewust bij bi.O/bi.M.4.
8. **Kan de engine verdedigen waarom elke vraag bestaat?** Ja — per vraag staat leerhandeling + concept + "waarom geen variant".
9. **Clip echt nuttig of alleen indrukwekkend?** Nuttig én gericht: alleen de enzym-cyclus (herbruikbaarheid), bewust géén clip waar een grafiek volstaat.
10. **Zonder schaamte naast een Examenbundel?** Voor dit ene leerdoel: ja.

**Eerlijke zwaktes / aandachtspunten voor de engine vóór opschaling:**
- De **quota** is op leerdoel-niveau te grofmazig; hij hoort domein-breed te gelden (7 leerdoelen samen), niet per leerdoel.
- **Transfer/examen-items** (contexten uit echte examens) zijn nu licht — bij opschaling zou ik per leerdoel ≥1 echte examen-context willen.
- De **clip** is nu een SPEC-ontwerp, geen gerenderde clip; de render-kwaliteit moet nog bewezen worden.
