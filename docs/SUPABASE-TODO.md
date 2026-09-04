# Supabase — wat jij nog moet doen (stap voor stap)

Dit is de complete lijst van alles wat aan Supabase-kant moet gebeuren zodat de
gebouwde features écht live gaan. De app werkt zonder deze stappen (alles valt
netjes terug op lokale/offline gedrag), maar met deze stappen worden de klas- en
AI-features "echt". Doe ze rustig als je weer thuis bij Supabase kunt.

Project: `wcfenegohryxhatzxvtw` (Dashboard → https://supabase.com/dashboard).

---

## 1. Klassysteem + weekuitdaging activeren  ⏱️ ~2 min

**Wat**: maakt/actualiseert alle klas-tabellen en RPC's — inclusief de **nieuwe
weekuitdaging-beloning** (`klas_challenge_claims` + `klas_challenge_claim`), zodat
een leerling de klasdoel-munten exact één keer per week krijgt, ook op een ander
apparaat.

**Hoe**:
1. Supabase Dashboard → **SQL Editor** → **New query**.
2. Open `sql/klas-setup.sql` uit de repo, kopieer **de hele inhoud**, plak, **Run**.

⚠️ **Let op — dit wist bestaande klasdata.** Bovenaan het script staat een
"VERSE START"-blok dat de klas-tabellen (klassen, leden, scores, huiswerk) eerst
weggooit en opnieuw opbouwt. Heb je al échte klassen met scores die je wilt
behouden? Verwijder dan eerst de vier `drop table ...`-regels (staan duidelijk
gemarkeerd rond regel 27-30) vóór je Run drukt. De `klas_challenge_claims`-tabel
wordt met `if not exists` gemaakt en blijft dus sowieso behouden.

**Test**: draai onderaan `select public.klas_dashboard('JOUWCODE');` met een echte
klascode, of open `/docent.html?code=JOUWCODE`. De weekuitdaging in de app werkt
daarna cross-device; zonder deze SQL blijft de beloning gewoon lokaal (per
apparaat) werken.

---

## 2. Slagio AI aanzetten (uitleg-laag)  ⏱️ ~10 min

**Wat**: de "Laat Vonk het écht uitleggen"-knop in de fout-coach. Nu valt die
terug op de voorgeschreven `uo`/`uh`-uitleg; met deze stap geeft Claude echte,
vraag-specifieke uitleg (3 gratis per dag per leerling).

**Hoe** (volledige details in `supabase/functions/slagio-ai/README.md`):
1. Anthropic API-key ophalen: https://console.anthropic.com → API Keys.
2. Met de Supabase CLI, ingelogd op het project:
   ```bash
   supabase functions deploy slagio-ai --no-verify-jwt
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
   ```
3. In `cloud.js` de endpoint aanzetten:
   ```js
   const SLAGIO_AI_ENDPOINT=''  // →
   const SLAGIO_AI_ENDPOINT='https://wcfenegohryxhatzxvtw.supabase.co/functions/v1/slagio-ai';
   ```
4. Bump `sw.js` regel 1 (cache-versie) en push.

**Model**: standaard `claude-opus-5` in de functie. Wil je goedkoper voor deze
korte hints? Zet `supabase secrets set SLAGIO_AI_MODEL=claude-haiku-4-5`.

---

## 3. (Optioneel, later) Harde AI-daglimiet server-side  ⏱️ later

De 3/dag-limiet zit nu client-side (localStorage) — genoeg voor de pilot. Wil je
'm hard maken: tel in de edge-functie de `ai_uitleg`-events van vandaag voor deze
gebruiker (de `events`-tabel bestaat al) en weiger boven de limiet, of houd een
klein `ai_usage`-tabelletje bij. Geen blocker.

---

## Wat al werkt zónder Supabase-actie

Zodat je weet wat je *niet* hoeft te doen — dit draait al, ook nu:

- **Docentendashboard** (`/docent.html`) leest de bestaande `events`-tabel met de
  anon-key (net als `admin.html`). De demo-klas met bot-leerlingen werkt sowieso.
- **Huiswerk klaarzetten & de leerling-melding + beloning** werken lokaal via de
  gedeelde `slagio_hw_demo`-bridge (zelfde apparaat). De klas-RPC's uit stap 1
  maken dit ook tussen apparaten echt.
- **Weekuitdaging-beloning** werkt nu al per apparaat (localStorage). Stap 1 tilt
  het naar cross-device (één keer per leerling per week).

---

## Snelle checklist

- [ ] `sql/klas-setup.sql` gedraaid in de SQL Editor (klas + weekuitdaging)
- [ ] Edge function `slagio-ai` gedeployd + `ANTHROPIC_API_KEY` gezet
- [ ] `SLAGIO_AI_ENDPOINT` aangezet in `cloud.js` + SW-cache gebumpt + gepusht
- [ ] (optioneel) `SLAGIO_AI_MODEL` gezet
- [ ] (later) server-side AI-daglimiet
