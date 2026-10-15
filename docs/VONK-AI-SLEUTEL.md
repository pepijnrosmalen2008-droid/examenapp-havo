# Vonk en de AI-functies weer aanzetten (nieuwe API-sleutel)

Alle AI-functies van Slagio (Vonk-chat, AI-uitleg, AI-nakijken, AI-antwoord in Vraag het
Slagio, foto van je schrift, Vonk-vragen uit Mijn stof) lopen via één Supabase Edge Function:
`slagio-ai`. Die gebruikt één geheime sleutel: `ANTHROPIC_API_KEY`. De sleutel staat nooit in de
app zelf, alleen in Supabase.

## 1. Nieuwe sleutel maken bij Anthropic
1. Ga naar https://console.anthropic.com en log in.
2. Kijk eerst bij **Billing** of er tegoed is. Zonder tegoed werkt ook een nieuwe sleutel niet.
   Zet eventueel automatisch bijladen aan, met een maximumbedrag per maand (**Limits**).
3. Ga naar **API Keys** → **Create Key**. Naam bijvoorbeeld `slagio-ai`. Vraagt het scherm om een vervaldatum, kies dan de langste periode of geen vervaldatum.
4. Kopieer de sleutel (begint met `sk-ant-`). Je ziet hem maar één keer.
5. Oude sleutel: laat hem staan of verwijder hem met **Delete**; hij wordt nergens meer gebruikt.

## 2. Sleutel in Supabase zetten
1. Ga naar https://supabase.com/dashboard → project `wcfenegohryxhatzxvtw`.
2. Links **Edge Functions** → bovenaan **Secrets** (of: Project Settings → Edge Functions).
3. Staat `ANTHROPIC_API_KEY` er al: klik erop, plak de nieuwe sleutel als waarde, **Save**.
   Staat hij er niet: **Add new secret**, naam `ANTHROPIC_API_KEY`, waarde = de sleutel, **Save**.
   Let op: geen spatie of regeleinde voor of na de sleutel.

## 3. De nieuwste functie-code erin zetten
1. **Edge Functions** → `slagio-ai` → tabblad **Code**.
2. Vervang alle code door de inhoud van `supabase/functions/slagio-ai/index.ts` (op GitHub: open
   het bestand, knop **Copy raw file**).
3. **Deploy**.
4. Bij de instellingen van de functie: **Verify JWT** moet **uit** staan (de functie controleert zelf
   wie er is ingelogd).

Bestaat de functie nog niet: **Deploy a new function** → naam precies `slagio-ai` → code plakken →
Deploy, en daarna stap 4.

## 4. Testen
1. Open https://slagio.nl, log in met een account.
2. Menu → **Vraag Vonk** → stel een vraag. Binnen een paar seconden komt er antwoord.
3. Komt er "Ik kon je nu even niet antwoorden": Edge Functions → `slagio-ai` → **Logs**. Een fout
   `401` of `authentication_error` = sleutel verkeerd geplakt; `credit balance` = geen tegoed.

## Goed om te weten
- Een sleutel zonder vervaldatum blijft werken tot je hem verwijdert of het tegoed op is. Zet een herinnering in je agenda voor de vervaldatum als je er wel een koos.
- Kosten blijven begrensd door de limiet in de Anthropic-console.
- Het model staat in `index.ts` (`MODEL`). Wijzigen kan alleen in de code, daarna opnieuw Deploy.
