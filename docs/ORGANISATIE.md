# Slagio · hoe het bedrijf werkt

Slagio wordt gemaakt door drie partijen. Elk heeft één taak en een vaste plek waar zijn
werk terechtkomt, zodat niets tussen wal en schip valt.

```
                ┌────────────────────────── richting, ontwerp, akkoord ──┐
                │                                                         ▼
   Pepijn (eigenaar) ◄── wekelijkse briefing ── Jarvis (analist) ── backlog ──► Claude (bouwer)
        ▲                                          ▲                                 │
        └────────── screenshots, vragen ───────────┼──────────── live op slagio.nl ◄─┘
                                                   └── meet de app, de content en de leerlingen
```

## De rollen

| | Pepijn · eigenaar | Jarvis · analist en redacteur | Claude · bouwer |
|---|---|---|---|
| **Doet** | Kiest richting en prioriteiten, legt ontwerp en stijl vast, keurt goed | Meet, verzamelt feedback, keurt content en schermen, schrijft de briefing en de opdrachten | Bouwt en verbetert de app, schrijft content, lost bugs op, zet live |
| **Wanneer** | Wanneer hij wil | Elke donderdagochtend (geplande taak) | In gesprekken met Pepijn, plus de dagelijkse content-routine (elke ochtend) |
| **Werk komt in** | `docs/ONTWERP.md`, gesprekken | De briefing (vaste link) en de backlog | `main` → slagio.nl |
| **Mag niet** | | Pushen naar main of de app aanpassen | Ontwerpkeuzes maken die botsen met ONTWERP.md zonder overleg |

## De overdrachten

1. **Pepijn → iedereen: richtlijnen.** Ontwerp en stijl staan in `docs/ONTWERP.md`; de
   productrichting in `docs/SLAGIO-PRODUCT-VISION.md`; de lat voor content in
   `docs/GOUDEN-STANDAARD-V2.md`. Wat daar staat, is leidend voor Claude én Jarvis.
2. **Jarvis → Claude: de backlog.** Elke week zet Jarvis concrete opdrachten in de backlog
   (in zijn geheugen op branch `jarvis-geheugen`): titel, waarom, bewijs, voorstel,
   prioriteit (P1 nu, P2 deze maand, P3 ooit), soort (bug, content, ux, groei, seo, data)
   en grootte. Zie ze in de briefing onder *Opdrachten voor de bouwer*, of laat Claude ze tonen.
3. **Claude → Jarvis: afgerond.** Een commit met `[B-12]` in het bericht sluit opdracht B-12.
   Jarvis ziet dat de week erna en rekent het af in de briefing.
4. **Jarvis → Pepijn: de briefing.** Wat er gebeurde, waarom, wat het kost of oplevert, één
   experiment voor de komende week en welke opdrachten openstaan.
5. **Claude → Pepijn: screenshots.** Zichtbare wijzigingen eerst als screenshots, live na akkoord.

## Wat je tegen Claude kunt zeggen

| Zeg | Claude doet |
|---|---|
| "pak de backlog" | Leest de open opdrachten (`node scripts/social/backlog.mjs`), voert ze uit op prioriteit, commit met `[B-n]`, laat zien wat er veranderde |
| "pak B-12" | Alleen die opdracht |
| "nieuwe richtlijn: …" | Zet hem in `docs/ONTWERP.md` en past de app daarop aan |
| "zet live" | Pusht naar main en controleert dat de nieuwe versie live staat |
| "wat zegt Jarvis?" | Vat de laatste briefing samen |

## Ritme

| Wanneer | Wat |
|---|---|
| Elke ochtend | Content-routine: minimaal 5 leerdoelen naar de gouden standaard |
| Elke dag | GitHub Action: cijfers en Instagram-inzichten naar `social/stats/` |
| Donderdagochtend | Jarvis: briefing, schermcontrole, contentsteekproef, nieuwe opdrachten |
| Na de briefing | Pepijn leest, kiest, en zegt eventueel "pak de backlog" tegen Claude |
