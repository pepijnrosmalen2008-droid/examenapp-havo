# Slagio AI — Edge Function (deploy)

De AI-uitleg-laag (slice 5). De client (`cloud.js` → `callSlagioAI`) is al gebouwd
en valt terug op de voorgegenereerde `uo`/`uh`-uitleg zolang deze functie niet
aanstaat. Zo zet je de échte AI aan:

## 1. Anthropic API-sleutel
Haal een key op via de [Anthropic Console](https://console.anthropic.com) →
API Keys. (Kosten beperken: er staat een dag-limiet in de client, en het model
draait op `effort: low`.)

## 2. Deploy de functie
Met de [Supabase CLI](https://supabase.com/docs/guides/cli), ingelogd op dit
project (`wcfenegohryxhatzxvtw`):

```bash
supabase functions deploy slagio-ai --no-verify-jwt
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
# optioneel, goedkoper voor deze korte hints:
# supabase secrets set SLAGIO_AI_MODEL=claude-haiku-4-5
```

`--no-verify-jwt` mag omdat de client de publieke anon-key meestuurt en de functie
zelf geen gevoelige data teruggeeft. Wil je strenger: laat verify-jwt aan en stuur
de ingelogde sessie-token mee.

## 3. Zet de client aan
In `cloud.js`, verander:

```js
const SLAGIO_AI_ENDPOINT='';
```

naar:

```js
const SLAGIO_AI_ENDPOINT='https://wcfenegohryxhatzxvtw.supabase.co/functions/v1/slagio-ai';
```

Bump daarna de SW-cache (`sw.js`, regel 1) en push. De AI-knop ("Laat Vonk het
écht uitleggen") verschijnt dan in de fout-coach, met 3 gratis uitleggen per dag.

## 4. (Optioneel, later) server-side limiet
De 3/dag-limiet is nu client-side (localStorage). Voor een harde limiet: tel in de
functie de `ai_uitleg`-events van vandaag voor deze gebruiker (de `events`-tabel
bestaat al) en weiger boven de limiet — of houd een klein `ai_usage`-tabelletje bij.
Geen blocker voor de pilot.

## Contract
Request (POST, JSON): `{ niveau, vak, domein, vraag, gekozen, juist, waarom, onthoud }`
Response: `{ text }` bij succes, anders `{ error }`.
