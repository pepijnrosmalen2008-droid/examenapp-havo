# Slagio-model - plan voor een eigen, geoptimaliseerd taalmodel

**Status:** ontwerp - **Bouwt op:** `CONTENT-FACTORY-ORCHESTRATOR.md`, de bevroren curriculum-architectuur, `scripts/check-leerdoel.mjs` (eval-harnas), `scripts/export-exemplars.mjs` (dataset).
**Doel:** een lokaal, gratis draaiend model dat Slagio-examencontent maakt, geoptimaliseerd voor Slagio's eigen format en curriculum.

---

## 0. De eerlijke uitgangssituatie (geen sprookjes)

Gemeten op 2026 met `scripts/export-exemplars.mjs`:

| | Aantal | Wat |
|---|---|---|
| Basisvragen (alle niveaus) | **9.692** | `v/o/c/d` - curriculumcorrect, maar zonder rijke uitleg |
| Rijk-adaptieve (gouden) vragen | **253** | `v/o/c/d/u/uo[4]/uh` - de volledige Slagio-standaard |
| Gouden vragen buiten havo/bi | **0** | alles zit in de biologie M- en O-leerdoelen |
| R-verdeling gouden set | R1=106 · R2=106 · **R3=41** | transfer/toepassen is dun |

**Conclusie:** 253 voorbeelden zijn **te weinig om een sterk model te fine-tunen** tot betrouwbare examenkwaliteit. Fine-tunen leert stijl en verdeling uit duizenden voorbeelden; met een paar honderd krijg je een format-papegaai van één vak, geen examenbrein. Dit is geen ontwerpfout, het is een datavolume-feit.

**Het gunstige inzicht:** de weg naar het eigen model lóópt via het produceren van meer gouden content. Elk afgemaakt leerdoel = ~25 gouden trainingsvoorbeelden. **Content maken en dataset bouwen zijn één route, geen fork.**

---

## 1. Twee fasen (data-gated)

### Fase A - NU: few-shot + gates (nul training, nul marginale kosten)

Werkt vandaag, zonder enige training:

```
lokaal model (Ollama, gratis)
  + few-shot: N gouden exemplars uit dataset/exemplars.jsonl (zelfde vak/leerdoel-stijl)
  + system-contract (het Slagio-schema, in export-exemplars.mjs)
  -> kandidaat-vraag (JSON)
  -> check-leerdoel.mjs / validate-goldstandard.mjs  (de gate-muur, bestaat al)
  -> PASS: publiceren  |  FAIL: repareren of naar review
```

- **Kosten:** €0 marginaal. Draait 24/7 op je eigen pc.
- **Kwaliteitsgarantie:** niet het model, maar de **gates**. Alles wat zakt, publiceert niet. Dat is precies waarom de strenge poort er al is.
- **Zwakte:** een gratis lokaal model haalt de inhoudelijke gates (feitelijkheid, uitleg-diepte) minder vaak in één keer -> meer afkeur -> meer reviewwerk. Meetbaar via het eval-harnas.

### Fase B - LATER: fine-tune wanneer de gouden set groot genoeg is

Drempel (indicatief): **~2.000 gouden vragen**, gespreid over meerdere vakken/domeinen. `export-exemplars.mjs` toont de teller elke run (`253/2000`).

Wanneer bereikt:
- **Basismodel:** een sterk open model rond 7-8B (bv. Qwen2.5-7B of Llama-3.1-8B) - klein genoeg voor lokaal draaien, sterk genoeg voor NL.
- **Methode:** QLoRA (adapter-fine-tune) - past op één consumenten-GPU (16 GB) of een gratis Colab-sessie; eenmalig, geen abonnement.
- **Trainingsset:** `dataset/train.jsonl` (system/user/assistant-paren), plus de 9.692 basisvragen als *domein-grounding* (leert curriculumfeiten en vraagstijl, ook al missen ze de rijke uitleg).
- **Evaluatie:** hetzelfde gate-harnas als in productie - een fine-tune is pas beter als hij méér vragen in één keer door de gates krijgt dan het few-shot-basismodel. Geen aparte, zachtere maatstaf.

---

## 2. Wat vandaag al af is (hergebruik, niet herbouwen)

| Nodig voor het model | Bestaat als |
|---|---|
| Eval-harnas (scoort elke gegenereerde vraag) | `scripts/check-leerdoel.mjs` + `scripts/validate-goldstandard.mjs` |
| Trainings-/few-shot-dataset | `scripts/export-exemplars.mjs` -> `dataset/{exemplars,train}.jsonl` |
| System-contract (dwingt het schema af) | `SYSTEM`-constante in `export-exemplars.mjs` |
| Kwaliteitsmuur bij publiceren | de gouden-standaard-poort (`smoke.mjs` blokkeert in CI) |
| Autonome publish-keten | de deterministische factory (`CONTENT-FACTORY-ORCHESTRATOR.md` sectie 4) |

Het enige echt nieuwe voor Fase A is een dunne **Ollama-worker**: een lokaal scriptje dat het model aanroept met system + few-shot + leerdoel-brief en de JSON teruggeeft aan de gates. Dat is tientallen regels, geen engine.

## 3. Het eerlijke plafond

Ook een goed getraind Slagio-model:

- **wordt uitstekend** in format, stijl, begrippen en het dekken van het *gesloten* curriculum (HAVO/VWO/VMBO verandert nauwelijks - een groot voordeel);
- **verslaat Opus niet** op het bedenken van compleet nieuwe, moeilijke transfer-/redeneervragen die het nooit heeft gezien;
- **blijft daarom achter de gates staan**, met optioneel een handjevol echt-moeilijke vragen via je abonnement (niet per token) voor de bovenste ~5%.

Dat is geen zwakte van het plan - het is de reden dat de gates de kwaliteitsdrager zijn en het model de volumedrager.

## 4. Concrete volgorde

1. **[klaar]** `export-exemplars.mjs` + dataset + dit plan.
2. **[lokaal, jij, gratis]** Ollama installeren + de dunne worker (system + few-shot + brief -> JSON -> `check-leerdoel.mjs`). Meet de eerste-keer-slaagkans van een gratis model op de bestaande gouden set.
3. **[doorlopend]** Gouden set groeien richting ~2.000 - dit is gewoon het content-werk (leerdoelen afmaken), dat nu dubbel telt als training.
4. **[bij ~2.000]** QLoRA-fine-tune op `dataset/train.jsonl`, evalueren tegen de gates, en de worker naar het eigen model omzetten.
5. **[integratie]** De worker inpluggen als creatieve stap in de orchestrator; de rest van de keten is al deterministisch en gratis.

**De onveranderlijke regel blijft:** curriculumwaarheid > kwaliteit > variatie > volledigheid > quota > snelheid. Het model mag nooit een gate versoepelen; de gate keurt het model, niet andersom.
