# Geschiedenis — ChatGPT-prompts voor examen­bronnen (posters/foto's)

Doel: échte, beeldvullende bronnen (propagandaposters, mobilisatie-affiches,
crisisfoto's) genereren voor de geschiedenis-proefexamens, in plaats van de
schematische SVG-"bron". Je genereert ze in ChatGPT (of een andere
beeldgenerator) en stuurt ze naar Claude; Claude zet ze dan in het examen
(als `<img>` in het `afb`-veld) en bumpt de servicewor­ker-cache.

---

## ⚠️ STRENGE REGELS (altijd meesturen, in élke prompt)

Plak dit blok **onderaan elke prompt** — dit houdt de bronnen juridisch veilig
én examen­geschikt:

> **Strict requirements — follow ALL of them:**
> 1. Everything must be **fully original and fictional**. Do NOT depict any real
>    country, real flag, real coat of arms, real political party, real logo,
>    real brand, or any existing organisation. Invent a neutral fictional nation
>    if a symbol is needed (e.g. a plain star, a generic eagle, an abstract
>    emblem).
> 2. Do NOT depict any **real, identifiable person** (no real leaders,
>    politicians or celebrities), living or dead. Use anonymous, generic figures.
> 3. **Period-accurate art style only.** No modern objects (no smartphones, cars
>    after the era, modern logos, QR codes, watermarks or signatures).
> 4. **Text:** keep any slogan to at most 3–5 short words in correct
>    [TAAL: Nederlands/Engels], spelled correctly, OR leave clear empty banner
>    space for text. Never fill the poster with garbled/nonsense letters.
> 5. Content must be **appropriate for a 16-year-old school exam**: no gore, no
>    explicit violence, no hateful or discriminatory imagery, nothing that
>    targets a real ethnic, religious or national group.
> 6. Composition: single clear focal point, strong readable silhouette, works at
>    small size (it is shown ~360 px wide in an app).
> 7. **Format:** portrait poster, aspect ratio 3:4, high resolution, flat print
>    look (not a photo of a poster on a wall — the poster itself, edge to edge).

> Waarom fictief? Een echte historische poster is vaak auteursrechtelijk of
> gevoelig, en een bron hóéft niet echt te zijn om de vaardigheid (bronnen­
> kritiek, standplaatsgebondenheid) te toetsen — sterker nog, een fictieve bron
> voorkomt dat leerlingen het antwoord kunnen googelen.

---

## 1. Koude Oorlog — propaganda­poster westers blok  (bij opgave "Kun je deze bron vertrouwen?")

> Create a 1950s-style Cold War propaganda poster from the point of view of a
> fictional Western, capitalist-democratic country. Style: bold mid-century
> lithographic poster art, limited palette of blue, white and red, strong
> diagonal composition, heroic low-angle. Show an anonymous, optimistic worker
> and family looking toward a bright rising sun over a modern city, symbolising
> freedom and prosperity. Leave a clear empty banner at the top for a short
> slogan. Mood: hopeful, idealised, persuasive.
>
> [+ STRENGE REGELS, TAAL = Engels of Nederlands]

## 2. Koude Oorlog — propaganda­poster oostblok  (alternatief / vergelijking)

> Create a 1950s-style socialist-realist propaganda poster from the point of
> view of a fictional Eastern, communist country. Style: socialist realism,
> bold red and ochre palette, monumental low-angle heroic figures, factory and
> wheat-field background, rays of light. Show anonymous idealised industrial and
> agricultural workers marching forward together. Leave an empty red banner for
> a short slogan. Mood: collective, triumphant, idealised.
>
> [+ STRENGE REGELS]

> Tip: genereer poster 1 én 2 als **paar**. Dan kun je in het examen laten
> vergelijken hoe beide kanten zichzelf mooier voorstellen (standplaats­
> gebondenheid van twee kanten).

## 3. Eerste Wereldoorlog — mobilisatie-/rekruteringsaffiche  (bij "Waardoor brak WO I uit?")

> Create a First-World-War era (1914–1918) military recruitment poster for a
> fictional European nation. Style: early-20th-century lithograph, muted patriotic
> palette, an anonymous uniformed soldier of the 1910s pointing toward the viewer,
> a fictional flag reduced to a plain colour band. Leave banner space for a short
> call-to-arms slogan. Mood: urgent, appealing to national pride and duty.
>
> [+ STRENGE REGELS]

## 4. Crisisjaren '30 — beeld van massawerkloosheid  (bij "De crisis van de jaren dertig")

> Create a 1930s black-and-white documentary-style photograph of the Great
> Depression in a fictional Western city. A long queue of anonymous, weary
> working-class people (coats and flat caps of the 1930s) waiting outside a
> soup kitchen / labour exchange. Overcast light, grainy film look, no signage
> with real names. Mood: sombre, dignified, historical. No modern elements.
>
> [+ STRENGE REGELS — let op: hier "photograph", geen posterbanner nodig]

## 5. Dekolonisatie — onafhankelijkheids­poster  (bij "Indonesië wordt onafhankelijk")

> Create a late-1940s independence-movement poster for a fictional Southeast-Asian
> colony breaking free from a fictional European coloniser. Style: bold woodcut /
> screen-print look, warm tropical palette, an anonymous crowd raising a plain
> fictional flag toward the sunrise, broken chains as a symbol. Leave banner space
> for a short slogan. Mood: hopeful, defiant, unifying.
>
> [+ STRENGE REGELS]

---

## Nadat je de afbeelding hebt

1. Sla 'm op als **WebP of PNG**, portrait, en houd 'm klein (< ~250 KB;
   ~800 px hoog is ruim genoeg voor een 360 px-brede weergave).
2. Stuur 'm naar Claude met de opgave erbij ("dit is de poster voor gs opgave
   5"). Claude:
   - zet het bestand in bv. `img/gs-koudeoorlog-west.webp`,
   - vervangt in `proefexamen-gs.js` het `afb`-veld van die opgave door
     `afb:'<img src="/img/gs-koudeoorlog-west.webp" alt="propagandaposter" style="width:100%;border-radius:10px">'`,
   - voegt het bestand toe aan `ASSETS[]` in `sw.js` en bumpt de cache,
   - controleert het resultaat headless en pusht.
3. De bijbehorende vraag (bronnenkritiek/standplaatsgebondenheid) blijft
   werken: die gaat over het *soort* bron (propaganda van een regering), niet
   over een specifiek land.

> Geen echte afbeelding nodig? De huidige SVG-bron blijft gewoon staan en werkt
> prima; de poster is puur een upgrade van de beeldkwaliteit.
