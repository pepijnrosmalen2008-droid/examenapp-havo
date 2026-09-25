# Social & SEO op de automatische piloot

Zo draait Slagio's promotie grotendeels vanzelf. Jij doet één ding per week:
de content-PR bekijken en mergen.

## Hoe het werkt

| Wanneer | Wie | Wat |
|---|---|---|
| Dagelijks 06:30 | GitHub Action **Social · cijfers vastleggen** | Gebruik, Instagram-inzichten en contentstatus in `social/stats/` |
| Elke push naar `main` | GitHub Action **SEO** | Sitemap opnieuw afleiden uit de pagina's, gewijzigde pagina's via IndexNow melden bij Bing/ChatGPT-search |
| Donderdag 08:00 | GitHub Action **Social · content maken** | Posts van volgende week maken en als PR klaarzetten |
| Donderdag 10:00 | **Jarvis** (Claude-routine) | PR nalezen en verbeteren, cijfers verifiëren, [weekbriefing](https://claude.ai/artifact/Q5Xv1UPkC7EJLATN4R3vab) bijwerken |
| Jij, wanneer het uitkomt | Jij | Weekrapport lezen, PR mergen (= goedkeuren) |
| Ma 07:45 · ma 17:30 · wo 17:30 · vr 17:00 · zo 19:30 | GitHub Action **Social · publiceren** | Goedgekeurde posts plaatsen op Instagram |
| 1e van de maand | GitHub Action **Social · token verversen** | Instagram-token vernieuwen voordat het verloopt |

Elke week: aftellen (post + story), een examenvraag-carrousel, een
begrippen-carrousel en een faceless reel. De reel is een opname van de echte
app. Alles komt uit de app-data; er wordt niets verzonnen. Zie
[`social/STIJLGIDS.md`](../social/STIJLGIDS.md).

Hoe Jarvis werkt staat in [`social/JARVIS.md`](../social/JARVIS.md).

## Eenmalig instellen (± 20 minuten)

### 1. Instagram professioneel maken
In de Instagram-app: **Instellingen → Accounttype en tools → Overschakelen naar
professioneel account** → kies *Creator* of *Zakelijk*.

### 2. Meta-app en token
1. Ga naar [developers.facebook.com/apps](https://developers.facebook.com/apps) → **App maken**.
2. Kies als use case **Instagram-API beheren** (Instagram API with Instagram Login).
3. Onder **API-configuratie met Instagram-aanmelding** → *Toegangstokens genereren*
   → **Account toevoegen** → log in met het Slagio-Instagramaccount.
4. Geef de rechten `instagram_business_basic`,
   `instagram_business_content_publish` en `instagram_business_manage_insights`.
5. Je krijgt een **token** (begint met `IG…`) en je **Instagram-gebruikers-ID**
   (een lang getal). Een app-review is niet nodig: je plaatst op je eigen account.

### 3. GitHub instellen
In de repo: **Settings → Secrets and variables → Actions**
- *Secrets*: `IG_ACCESS_TOKEN` (het token) en `IG_USER_ID` (het getal).
- *Secret, optioneel*: `SECRETS_PAT`, een [fine-grained token](https://github.com/settings/personal-access-tokens)
  met alleen deze repo en **Secrets: Read and write**. Daarmee vernieuwt het
  Instagram-token zichzelf. Zonder deze secret krijg je elke maand een mail en doe je het zelf.
- *Variables*: `SOCIAL_AAN` = `true`. Dit is de hoofdschakelaar. Zet hem op
  `false` om alles direct te pauzeren.

**Settings → Actions → General → Workflow permissions**: kies *Read and write
permissions* en vink *Allow GitHub Actions to create and approve pull requests* aan.

### 4. Testen
**Actions → Social · publiceren → Run workflow** met *dry_run* aan. De log laat
precies zien wat er geplaatst zou worden, zonder iets te plaatsen.

### 5. SEO (eenmalig)
- [Google Search Console](https://search.google.com/search-console): voeg
  `slagio.nl` toe en dien `https://slagio.nl/sitemap.xml` in.
- [Bing Webmaster Tools](https://www.bing.com/webmasters): importeer vanuit
  Search Console. IndexNow is al actief.

## TikTok
TikTok laat automatisch plaatsen pas toe na een app-keuring. Tot die rond is:
de reel staat na goedkeuring op `slagio.nl/social/weken/<week>/zo-reel.mp4`
en het weekrapport linkt ernaar. Upload hem in TikTok met een trending geluid.
Dat kost één minuut.

## Handmatig draaien
```bash
cd scripts/social && npm install && npx playwright install chromium
node generate.mjs --week 2026-W41     # een week maken
node publish.mjs --controleer         # plannen valideren
node publish.mjs --dry-run            # zien wat er geplaatst zou worden
```

## Een post aanpassen of schrappen
Open de content-PR en bewerk `social/weken/<week>/plan.json`: pas `caption`
aan, verschuif `publiceren`, of zet `"overslaan": true`. Merge daarna.
