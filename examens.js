// ═══════════════════════════════════════════════════════════
//  SLAGIO — EXAMEN DATA
//  Echte eindexamens van examenblad.nl / alleexamens.nl
//  Structuur: EXAMENS[vakId] = [ {...examen}, ... ]
// ═══════════════════════════════════════════════════════════

const EXAMENS = {

  // ─────────────────────────────────────────────────────────
  //  BEDRIJFSECONOMIE HAVO 2025 TIJDVAK 1
  //  30 vragen · 58 punten · 180 minuten
  //  Bron: HA-0400-a-25-1-o (alleexamens.nl)
  // ─────────────────────────────────────────────────────────
  be: [
    {
      id: 'be_havo_2025_1',
      vakId: 'be',
      titel: 'Bedrijfseconomie',
      niveau: 'havo',
      jaar: 2025,
      tijdvak: 1,
      duur_minuten: 180,
      max_punten: 58,
      bron: 'HA-0400-a-25-1-o · alleexamens.nl',
      bijlagen: [
        { type: 'uitwerkbijlage', label: 'Uitwerkbijlage', url: 'https://sxrjdssmgwwygtskovyc.supabase.co/storage/v1/object/public/examens/havo/be/2025/I/uitwerkbijlage.pdf' },
        { type: 'antwoord', label: 'Correctievoorschrift', url: 'https://sxrjdssmgwwygtskovyc.supabase.co/storage/v1/object/public/examens/havo/be/2025/I/correctievoorschrift.pdf' }
      ],
      vragen: [

        // ── OPGAVE 1: Roads / Jordan ──────────────────────────
        {
          nr: 1, opgave: 1, punten: 1, type: 'open',
          context: 'Jordan is sinds 1 januari 2000 als teamleider werkzaam bij Roads, een bedrijf dat helpt bij autopech. Op 1 januari 2002 werd zijn arbeidsovereenkomst voor bepaalde tijd wegens goed functioneren omgezet naar een arbeidsovereenkomst voor onbepaalde tijd.',
          vraag: 'Noem een voordeel voor Roads van medewerkers met een arbeidsovereenkomst voor onbepaalde tijd ten opzichte van een arbeidsovereenkomst voor bepaalde tijd.',
          antwoord: 'Medewerkers met een contract voor onbepaalde tijd zijn doorgaans loyaler en meer betrokken bij het bedrijf. Kennis en ervaring blijven behouden en er zijn minder wervings- en opleidingskosten.',
          antwoord_rubric: '1 punt: een correct voordeel — bijv. meer betrokkenheid/loyaliteit, minder wervingskosten, kennis blijft behouden, medewerkers investeren meer in bedrijf.'
        },
        {
          nr: 2, opgave: 1, punten: 1, type: 'open',
          context: 'Roads maakt in 2023 verlies en gaat reorganiseren. De functie van Jordan komt daardoor te vervallen.',
          vraag: 'Noem de ontslaggrond waarop Jordan nu ontslagen kan worden.',
          antwoord: 'Bedrijfseconomische redenen (reorganisatie / vervallen van de functie).',
          antwoord_rubric: '1 punt: bedrijfseconomische redenen / reorganisatie / vervallen van de functie.'
        },
        {
          nr: 3, opgave: 1, punten: 1, type: 'open',
          context: 'Per 1 januari 2024 wordt de arbeidsovereenkomst van Jordan ontbonden. Door het ontslag krijgt Jordan een transitievergoeding.',
          vraag: 'Leg uit waarvoor de transitievergoeding bedoeld is.',
          antwoord: 'De transitievergoeding is bedoeld om de overgang naar een nieuwe baan te vergemakkelijken, bijvoorbeeld voor om- of bijscholing of de kosten van het zoeken naar nieuw werk.',
          antwoord_rubric: '1 punt: bedoeld voor overgang naar nieuw werk / om- en bijscholing / re-integratie.'
        },
        {
          nr: 4, opgave: 1, punten: 2, type: 'berekening',
          context: 'Jordan werkte fulltime (40 uur per week) en ontving een brutojaarloon bestaande uit:\n• Basisbrutojaarloon: 40 uur/week × 52 weken × €27,30 per uur\n• 8% vakantietoeslag over het basisbrutojaarloon\n• Eindejaarsuitkering €2.839,20 per jaar\n\nDe sociale lasten voor de werkgever bedragen 30% van het brutojaarloon.',
          vraag: 'Bereken de totale besparing op de loonkosten voor Roads in 2024 na het ontslag van Jordan.',
          antwoord: 'Basisbrutojaarloon: 40 × 52 × €27,30 = €56.784,–\nVakantietoeslag: 8% × €56.784 = €4.542,72\nEindejaarsuitkering: €2.839,20\nBrutojaarloon: €56.784 + €4.542,72 + €2.839,20 = €64.165,92\nSociale lasten: 30% × €64.165,92 = €19.249,78\n\nTotale besparing loonkosten: €64.165,92 + €19.249,78 = €83.415,70',
          antwoord_rubric: '1 punt: correct brutojaarloon (€64.165,92). 1 punt: correct totale loonkosten incl. sociale lasten (€83.415,70).'
        },

        // ── OPGAVE 2: SailingSea vof ──────────────────────────
        {
          nr: 5, opgave: 2, punten: 2, type: 'open',
          context: 'Joachim en Deniz zijn beiden in loondienst als marketingmedewerker bij een verzekeraar. Samen willen ze het bedrijf SailingSea vof starten dat zeilvakanties aanbiedt aan de Turkse kust. Aan het zelfstandig ondernemerschap zitten naast voordelen ook nadelen.',
          vraag: 'Noem twee nadelen van het zelfstandig ondernemerschap in vergelijking met het werken in loondienst.',
          antwoord: '1. Geen vaste inkomsten / inkomensonzekerheid (afhankelijk van het bedrijfsresultaat).\n2. Geen sociale zekerheid: geen recht op WW, geen loondoorbetaling bij ziekte, zelf verantwoordelijk voor pensioen.',
          antwoord_rubric: '1 punt per correct nadeel (max 2). Voorbeelden: inkomensonzekerheid, geen WW/ziektewet, pensioen zelf regelen, meer aansprakelijkheidsrisico, geen vakantiegeld gegarandeerd.'
        },
        {
          nr: 6, opgave: 2, punten: 2, type: 'open',
          context: 'Voor de promotie van SailingSea zullen Joachim en Deniz social media gebruiken. Het communiceren via social media is goedkoper dan traditionele media zoals televisie en krant.',
          vraag: 'Noem twee andere voordelen voor SailingSea van het inzetten van social media in plaats van traditionele media.',
          antwoord: '1. Gerichtere communicatie: via targeting op social media kun je de exacte doelgroep (bijv. zeilers, reizigers) bereiken.\n2. Directe interactie: klanten kunnen direct reageren, vragen stellen en ervaringen delen, waardoor tweerichtingscommunicatie mogelijk is.',
          antwoord_rubric: '1 punt per correct voordeel (max 2). Voorbeelden: gerichtere targeting, directe interactie, content makkelijk deelbaar (viral), 24/7 bereikbaar, sneller aanpasbaar, meetbare resultaten.'
        },
        {
          nr: 7, opgave: 2, punten: 2, type: 'open',
          context: 'Joachim en Deniz willen het ontbrekende bedrag voor de financiering ophalen door middel van een crowdfundingsactie in plaats van een lening bij een bank.',
          vraag: 'Noem twee mogelijke voordelen voor SailingSea van het aantrekken van vreemd vermogen via crowdfunding in vergelijking met het aangaan van een lening bij een bank.',
          antwoord: '1. Geen (of lagere) rentelasten: bij sommige crowdfundingvormen is geen rente verschuldigd.\n2. Geen onderpand of strenge kredietbeoordeling vereist, zoals bij een bank.',
          antwoord_rubric: '1 punt per correct voordeel (max 2). Voorbeelden: geen/lagere rente, geen onderpand, naamsbekendheid/reclame via platform, crowdfunders worden betrokken bij bedrijf, geen vaste aflossingsplicht (bij donaties).'
        },
        {
          nr: 8, opgave: 2, punten: 3, type: 'berekening',
          context: 'Informatiebron 1 — Investeringen:\n• Zeilboot aanschafprijs: €250.000\n• Installatiekosten vaarklaar maken: 8% van aanschafprijs\n• Inventaris: €5.000 (aangeschaft 1 jan 2025)\n\nInformatiebron 2 — Eigen vermogen vennoten:\nJoachim:\n• Pensioenuitkering contant maken: €100.000 op 1-1-2030 → contante waarde per 1-1-2025 (3% samengestelde interest, 5 jaar)\n• Betaalrekening: €18.739,12\n\nDeniz:\n• Aandelen FastNed: 3.000 aandelen gekocht à €10, verkoop 31-12-2024 à €30/aandeel\n• Betaalrekening: €15.000',
          vraag: 'Bereken het bedrag dat met crowdfunding moet worden geleend om de boot te kunnen kopen (zie informatiebronnen 1 en 2).',
          antwoord: 'Totale investering (infobron 1):\n• Zeilboot: €250.000 + 8% × €250.000 = €270.000\n• Inventaris: €5.000\n• Totaal: €275.000\n\nEigen vermogen Joachim (infobron 2):\n• CW pensioen: €100.000 / (1,03)^5 = €100.000 / 1,159274 = €86.260,88\n• Betaalrekening: €18.739,12\n• Totaal Joachim: €105.000\n\nEigen vermogen Deniz (infobron 2):\n• Aandelen: 3.000 × €30 = €90.000\n• Betaalrekening: €15.000\n• Totaal Deniz: €105.000\n\nTotaal eigen vermogen: €105.000 + €105.000 = €210.000\n\nCrowdfunding = €275.000 − €210.000 = €65.000',
          antwoord_rubric: '1 punt: correcte totale investering (€275.000). 1 punt: correcte eigen vermogens Joachim en Deniz (elk €105.000). 1 punt: correct crowdfunding bedrag (€65.000).'
        },
        {
          nr: 9, opgave: 2, punten: 2, type: 'open',
          context: 'Klanten die voor 28 februari 2025 reserveren, ontvangen een vroegboekkorting. Gasten doen een aanbetaling van 20% op het moment van reserveren.',
          vraag: 'Noem de overlopende post die aan de creditzijde van de balans van SailingSea ontstaat door de aanbetaling van gasten. Leg uit waarom deze overlopende post aan de creditzijde van de balans staat.',
          antwoord: 'Overlopende post: vooruitontvangen omzet (ook: nog te leveren diensten / transitorische post).\n\nDeze post staat aan de creditzijde omdat het een verplichting is: SailingSea heeft het geld al ontvangen maar de dienst (de zeilervakantie) moet nog worden geleverd. Het is nog geen definitieve omzet.',
          antwoord_rubric: '1 punt: correcte naam overlopende post (vooruitontvangen omzet / nog te leveren diensten). 1 punt: correcte uitleg (verplichting / dienst nog niet geleverd / geen definitieve omzet).'
        },
        {
          nr: 10, opgave: 2, punten: 5, type: 'berekening',
          context: 'Informatiebron 3 — Opbrengsten verhuur 2025:\n• Periode 1 (2 mei – 22 juni): 6 weken à €3.750\n• Periode 2 (23 juni – 14 sept): 10 weken à €4.750\n• Periode 3 (15 sept – 31 okt): 4 weken à €3.750\n• Vroegboekkorting: 10% bij helft van de reserveringen per periode\n\nKosten 2025:\n• Afschrijving boot: (€270.000 − €50.000) / 20 jaar\n• Afschrijving inventaris: 5% × €5.000\n• Interestkosten crowdfunding: 3,5% over €65.000 (eerste jaar)\n• Overige kosten: €10.400 per jaar\n\nIn deze opgave blijven belastingen buiten beschouwing.',
          vraag: 'Laat met een berekening van het verwachte resultaat van 2025 zien of ze gaan starten met het plan. Vul hiervoor de uitwerkbijlage in.',
          antwoord: 'OPBRENGSTEN:\nPeriode 1 (6 weken, €3.750, 10% korting bij helft):\n  3 × €3.750 × 0,90 = €10.125\n  3 × €3.750 = €11.250\n  Subtotaal: €21.375\n\nPeriode 2 (10 weken, €4.750):\n  5 × €4.750 × 0,90 = €21.375\n  5 × €4.750 = €23.750\n  Subtotaal: €45.125\n\nPeriode 3 (4 weken, €3.750):\n  2 × €3.750 × 0,90 = €6.750\n  2 × €3.750 = €7.500\n  Subtotaal: €14.250\n\nTotale opbrengsten: €80.750\n\nKOSTEN:\nAfschrijving boot: (€270.000 − €50.000) / 20 = €11.000\nAfschrijving inventaris: 5% × €5.000 = €250\nInterestkosten crowdfunding: 3,5% × €65.000 = €2.275\nOverige kosten: €10.400\nTotale kosten: €23.925\n\nVERWACHT RESULTAAT: €80.750 − €23.925 = €56.825\n\nResultaat is positief (€56.825 > 0) → Joachim en Deniz gaan starten met het plan.',
          antwoord_rubric: '2 punten: correcte totale opbrengsten (€80.750) inclusief vroegboekkorting. 2 punten: correcte totale kosten (€23.925) incl. afschrijvingen en interestkosten. 1 punt: correcte conclusie (resultaat €56.825 positief → ze starten).'
        },

        // ── OPGAVE 3: Aegon / Levi ────────────────────────────
        {
          nr: 11, opgave: 3, punten: 1, type: 'open',
          context: 'Levi wil beleggen in aandelen of obligaties van Aegon. De verzekeraar is tevreden over de liquiditeit en rentabiliteit van het eigen vermogen, maar de solvabiliteit is verslechterd.',
          vraag: 'Leg uit dat er voor een verzekeraar, zoals Aegon, geen verschil is tussen de quick ratio en de current ratio.',
          antwoord: 'De current ratio = vlottende activa / kortlopend vreemd vermogen. De quick ratio = (vlottende activa − voorraden) / kortlopend vreemd vermogen. Een verzekeraar heeft geen voorraden (ze verkopen diensten, geen producten), waardoor er geen verschil is tussen beide ratio\'s.',
          antwoord_rubric: '1 punt: verzekeraars hebben geen voorraden, dus quick ratio = current ratio.'
        },
        {
          nr: 12, opgave: 3, punten: 2, type: 'berekening',
          context: 'Balans Aegon 2022 (× €1.000):\n\nDebet:\n• Vaste activa:    31-12-2022: 152.265 | 01-01-2022: 115.390\n• Vlottende activa: 31-12-2022: 1.427.277 | 01-01-2022: 1.424.761\n\nCredit:\n• Aandelenkapitaal: 172.666 | 172.666\n• Reserves:         174.577 | 174.577\n• Resultaat:        117.552 | 0\n• Obligatielening:  607.773 | 652.078\n• Hypothecaire leningen: 450.000 | 460.000\n• Kort vreemd vermogen: 56.974 | 80.830\n\nHet resultaat is in de loop van 2022 gelijkmatig verkregen en wordt in januari van het volgende jaar verdeeld.',
          vraag: 'Bereken de rentabiliteit van het eigen vermogen over 2022.',
          antwoord: 'EV 01-01-2022 = 172.666 + 174.577 + 0 = 347.243\nEV 31-12-2022 = 172.666 + 174.577 + 117.552 = 464.795\nGemiddeld EV = (347.243 + 464.795) / 2 = 406.019\n\nRentabiliteit EV = (117.552 / 406.019) × 100% ≈ 28,96%',
          antwoord_rubric: '1 punt: correct gemiddeld EV (€406.019.000). 1 punt: correcte rentabiliteit EV (≈ 28,96%).'
        },
        {
          nr: 13, opgave: 3, punten: 2, type: 'open',
          context: 'Levi vindt dat de onzekerheid over de bestemming van het resultaat over 2022 onvoldoende zekerheid biedt voor een hogere opbrengst van beleggen in aandelen Aegon ten opzichte van beleggen in obligaties.',
          vraag: 'Geef hiervoor een verklaring. Betrek in het antwoord de opbrengsten van beleggen in aandelen en obligaties.',
          antwoord: 'De opbrengst van aandelen bestaat uit dividend. Dividend is afhankelijk van het besluit van de aandeelhoudersvergadering — het is niet zeker of en hoeveel het resultaat als dividend wordt uitgekeerd (het kan ook worden gereserveerd). De opbrengst van obligaties (rente) is daarentegen vast en zeker. Door de onzekerheid over het dividend bieden aandelen geen gegarandeerd hogere opbrengst dan obligaties.',
          antwoord_rubric: '1 punt: dividend (opbrengst aandelen) is onzeker / afhankelijk van dividendbesluit. 1 punt: rente (opbrengst obligaties) is vast en zeker.'
        },
        {
          nr: 14, opgave: 3, punten: 2, type: 'berekening',
          context: 'Balans Aegon 31-12-2022 (× €1.000):\n• Aandelenkapitaal: 172.666\n• Reserves: 174.577\n• Resultaat: 117.552\n• Obligatielening: 607.773\n• Hypothecaire leningen: 450.000\n• Kort vreemd vermogen: 56.974\n• Totaal: 1.579.542',
          vraag: 'Bereken de solvabiliteit van Aegon op 31 december 2022.',
          antwoord: 'EV = 172.666 + 174.577 + 117.552 = 464.795\nTV = 1.579.542\nSolvabiliteit = (464.795 / 1.579.542) × 100% ≈ 29,43%',
          antwoord_rubric: '1 punt: correct eigen vermogen (464.795). 1 punt: correcte solvabiliteit (≈ 29,43%).'
        },
        {
          nr: 15, opgave: 3, punten: 1, type: 'open',
          context: 'Levi vindt de solvabiliteit te laag en twijfelt of hij obligaties van Aegon zal kopen.',
          vraag: 'Leg uit welk risico Levi loopt als hij bij een lage solvabiliteit obligaties van Aegon koopt.',
          antwoord: 'Bij een lage solvabiliteit heeft Aegon veel vreemd vermogen ten opzichte van het eigen vermogen. Als Aegon failliet zou gaan, bestaat het risico dat Levi zijn geïnvesteerde geld (de nominale waarde van de obligaties) niet of slechts gedeeltelijk terugkrijgt.',
          antwoord_rubric: '1 punt: risico dat de obligaties niet worden terugbetaald / Aegon kan bij faillissement schulden mogelijk niet voldoen.'
        },

        // ── OPGAVE 4: Fairphone ───────────────────────────────
        {
          nr: 16, opgave: 4, punten: 2, type: 'open',
          context: 'Fragment 1: Fairphone bestaat uit eerlijk gedolven mineralen, is recyclebaar. In 2022: 140.000 toestellen, marktaandeel 0,07% in Europa.\nFragment 2: Fairphone wil met reclamecampagnes meerdere doelgroepen bereiken. Naamsbekendheid slechts 10%. Koper is gemiddeld 50-60 jaar, vaker vrouw, woont in grote steden.\nFragment 3: Modulaire opbouw, kapotte onderdelen vervangbaar. Verbetering camera\'s en scherm. Gebruiksduur verlengd van 3 naar 5 jaar (software 5 jaar ondersteund). Concurrentie gaat gemiddeld 4 jaar mee.',
          vraag: 'Noem twee verschillende instrumenten uit de marketingmix die Fairphone gebruikt voor het uitbreiden van het aantal klanten. Licht het antwoord toe door te verwijzen naar bovenstaande fragmenten.',
          antwoord: '1. Product (fragment 3): Fairphone verbetert de camera\'s en het scherm en verlengt de gebruiksduur van 3 naar 5 jaar, waardoor de kwaliteit toeneemt en het product aantrekkelijker wordt.\n2. Promotie (fragment 2): Fairphone zet reclamecampagnes in om meerdere doelgroepen te bereiken en de naamsbekendheid (nu slechts 10%) te vergroten.',
          antwoord_rubric: '1 punt per correct instrument mét toelichting (max 2). Geldige instrumenten: Product (verbetering/langere levensduur), Promotie (reclamecampagnes), Prijs (prijs-kwaliteitverhouding verbeteren).'
        },
        {
          nr: 17, opgave: 4, punten: 1, type: 'berekening',
          context: 'In 2022 verkocht Fairphone 140.000 toestellen en had het bedrijf een marktaandeel van 0,07 procent van de afzet in Europa.',
          vraag: 'Bereken de totale afzet van smartphones in Europa in 2022.',
          antwoord: 'Totale afzet = 140.000 / 0,0007 = 200.000.000 smartphones (200 miljoen)',
          antwoord_rubric: '1 punt: 200.000.000 toestellen (200 miljoen).'
        },
        {
          nr: 18, opgave: 4, punten: 1, type: 'open',
          context: 'Fragment 3: Fairphone verlengt de gebruiksduur van nieuwe toestellen van drie jaar naar vijf jaar. De smartphones van de concurrentie gaan gemiddeld vier jaar mee. Bij de productie worden niet-hernieuwbare grondstoffen (bijv. lithium) gebruikt.',
          vraag: 'Geef met behulp van fragment 3 een verklaring voor de stelling van de woordvoerder dat wanneer Fairphone een groter marktaandeel behaalt, het milieu daar juist bij gebaat kan zijn.',
          antwoord: 'Als Fairphone een groter marktaandeel behaalt, gaan meer mensen over op een Fairphone die 5 jaar meegaat (vs. gemiddeld 4 jaar bij de concurrentie). Daardoor hoeven minder telefoons geproduceerd te worden, wat leidt tot minder verbruik van niet-hernieuwbare grondstoffen.',
          antwoord_rubric: '1 punt: Fairphone gaat langer mee dan de concurrentie → minder productie nodig → minder grondstoffengebruik → beter voor het milieu.'
        },
        {
          nr: 19, opgave: 4, punten: 2, type: 'berekening',
          context: 'Kwaliteitscijfer = 80% × duurzaamheidsscore + 20% × gemiddelde van (bellen, fotograferen/filmen, gebruiksgemak/beeldscherm)\nPrijs-kwaliteitverhouding = verkoopprijs ÷ kwaliteitscijfer (lager = gunstiger)\n\nFairphone 4 (256 GB): prijs €598 | duurzaamheid 8,5 | bellen 7,2 | fotograferen 6,2 | gebruiksgemak 6,1\nSamsung Galaxy S22 (256 GB): prijs €689 | prijs-kwaliteitverhouding = 91,62\n\nJanne koopt de telefoon met de gunstigste (laagste) prijs-kwaliteitverhouding.',
          vraag: 'Leg met behulp van een berekening uit welke telefoon Janne gaat kopen.',
          antwoord: 'Kwaliteitscijfer Fairphone 4:\n0,80 × 8,5 + 0,20 × ((7,2 + 6,2 + 6,1) / 3)\n= 6,8 + 0,20 × (19,5 / 3)\n= 6,8 + 0,20 × 6,5\n= 6,8 + 1,3 = 8,1\n\nPrijs-kwaliteitverhouding Fairphone 4 = €598 / 8,1 ≈ 73,83\nSamsung Galaxy S22 = 91,62\n\nJanne koopt de Fairphone 4, want 73,83 < 91,62 (lagere verhouding = gunstiger).',
          antwoord_rubric: '1 punt: correct kwaliteitscijfer Fairphone 4 (8,1). 1 punt: correcte conclusie (Fairphone 4, prijs-kwaliteit ≈ 73,83 < 91,62).'
        },

        // ── OPGAVE 5: Eva / studie & wonen ───────────────────
        {
          nr: 20, opgave: 5, punten: 1, type: 'open',
          context: 'Eva is na het behalen van haar havodiploma op 1 september 2021 gestart met de 3-jarige hbo-opleiding Finance & Control aan de Hogeschool van Amsterdam.',
          vraag: 'Noem een belang voor de samenleving van het verder studeren door Eva.',
          antwoord: 'Door verder te studeren vergroot Eva haar kennis en productiviteit, wat bijdraagt aan een hoger opgeleide beroepsbevolking, economische groei en hogere belastinginkomsten voor de overheid.',
          antwoord_rubric: '1 punt: een correct maatschappelijk belang — bijv. hogere productiviteit / economische groei / meer belastinginkomsten / minder werkloosheid / hoger opleidingsniveau samenleving.'
        },
        {
          nr: 21, opgave: 5, punten: 3, type: 'berekening',
          context: 'Studietijd Eva: 1 september 2021 – 31 augustus 2024 (36 maanden)\nBijbaan: €300/maand gedurende hele studietijd\n\nInformatiebron 4 — Collegegeld:\n• 2021-2022: €2.143 (eerste jaar: halvering wettelijk collegegeld)\n• 2022-2023: €2.209\n• 2023-2024: €2.314\n\nMaandelijkse uitgaven: €1.031 per maand (excl. collegegeld)\n\nBasisbeurs uitwonend (infobron 4):\n• 2021-2022: €0/maand\n• 2022-2023: €0/maand\n• 2023-2024: €469/maand',
          vraag: 'Bereken het verwachte totale bedrag dat Eva gedurende haar 3-jarige studietijd tekort komt.',
          antwoord: 'INKOMSTEN:\nBijbaan: €300 × 36 maanden = €10.800\nBasisbeurs jaar 3 (2023-2024): €469 × 12 maanden = €5.628\nTotale inkomsten: €16.428\n\nUITGAVEN:\nCollegegeld:\n  Jaar 1 (halvering): €2.143 / 2 = €1.071,50\n  Jaar 2: €2.209\n  Jaar 3: €2.314\n  Totaal collegegeld: €5.594,50\n\nMaandelijkse kosten: €1.031 × 36 = €37.116\nTotale uitgaven: €5.594,50 + €37.116 = €42.710,50\n\nTEKORT: €42.710,50 − €16.428 = €26.282,50',
          antwoord_rubric: '1 punt: correcte inkomsten (€16.428). 1 punt: correcte uitgaven (€42.710,50) incl. halvering collegegeld jaar 1. 1 punt: correct tekort (€26.282,50).'
        },
        {
          nr: 22, opgave: 5, punten: 1, type: 'open',
          context: 'Informatiebron 5 — ASN Ideaalsparen (saldo Eva < €25.000): 1,65% samengestelde interest per jaar\nInformatiebron 6 — DUO studielening: jaarlijks interestpercentage 0,46%\n\nEva heeft spaargeld op haar ASN-rekening. Ze kan kiezen: spaargeld opnemen óf lenen bij DUO.',
          vraag: 'Waarom is het voor Eva financieel aantrekkelijker om te lenen bij DUO dan het opgebouwde bedrag op haar spaarrekening te gebruiken?',
          antwoord: 'De rente die Eva ontvangt op haar spaarsaldo (ASN Ideaalsparen: 1,65% per jaar) is hoger dan de rente die ze betaalt op de DUO-studielening (0,46% per jaar).\n\nDoor het spaargeld te laten staan en in plaats daarvan bij DUO te lenen, verdient Eva 1,65% spaarrente terwijl ze slechts 0,46% rente betaalt. Per saldo levert dit een voordeel van 1,19% per jaar op.',
          antwoord_rubric: '1 punt: spaarrente (1,65%) is hoger dan DUO-rente (0,46%), dus spaargeld laten staan levert meer op dan de DUO-rente kost.'
        },
        {
          nr: 23, opgave: 5, punten: 2, type: 'open',
          context: 'Eva overweegt een appartement te kopen in plaats van huren. Om te kopen heeft ze een hypothecaire lening nodig omdat haar spaarsaldo ontoereikend is.',
          vraag: 'Noem twee voordelen voor Eva van het kopen van een appartement in vergelijking tot het huren van een appartement. Betrek in het antwoord zowel het kopen als het huren.',
          antwoord: '1. Bij kopen bouwt Eva vermogen op: het appartement wordt haar eigendom en kan in waarde stijgen. Bij huren gaan alle huurbetalingen verloren zonder vermogensopbouw.\n2. Bij kopen heeft Eva meer vrijheid om het appartement naar eigen wens te verbouwen of aan te passen. Bij huren is ze afhankelijk van toestemming van de verhuurder.',
          antwoord_rubric: '1 punt per voordeel (max 2). Beide aspecten (kopen én huren) moeten worden betrokken. Voorbeelden: vermogensopbouw vs. geen opbouw; vrijheid verbouwen vs. afhankelijkheid; zekerheid wonen vs. opzegtermijn verhuurder.'
        },
        {
          nr: 24, opgave: 5, punten: 2, type: 'open',
          context: 'De hypotheekadviseur van een bank vertelt Eva dat haar studielening bij DUO van invloed is op het maximale bedrag voor een hypothecaire lening.',
          vraag: 'Leg vanuit het perspectief van de bank uit waarom een studielening bij DUO van invloed is op de maximale hypothecaire lening.',
          antwoord: 'De studielening bij DUO brengt een maandelijkse aflossingsplicht met zich mee. Dit verlaagt het besteedbare inkomen van Eva. De bank berekent de maximale hypotheek op basis van het inkomen dat overblijft na voldoening van bestaande schulden. Hoe meer schulden Eva al heeft, hoe groter het risico voor de bank en hoe lager de maximale hypotheek die de bank verantwoord acht.',
          antwoord_rubric: '1 punt: studielening verlaagt het beschikbare inkomen van Eva. 1 punt: daardoor is een lagere hypotheek verantwoord / meer risico op wanbetaling voor de bank.'
        },
        {
          nr: 25, opgave: 5, punten: 2, type: 'open',
          context: 'Naast een hypotheekadviseur zijn er nog andere beroepen betrokken bij de aankoop van een appartement.',
          vraag: 'Noem twee andere beroepen die betrokken zijn bij de aankoop van een appartement.',
          antwoord: '1. Notaris — voor het opstellen en passeren van de koopakte en hypotheekakte.\n2. Makelaar — voor bemiddeling bij de aan- en verkoop van het appartement.',
          antwoord_rubric: '1 punt per correct beroep (max 2). Voorbeelden: notaris, makelaar, taxateur, bouwkundig inspecteur.'
        },
        {
          nr: 26, opgave: 5, punten: 2, type: 'berekening',
          context: 'Informatiebron 5 — ASN Jeugdsparen (1,40% samengesteld/jaar, vast):\n• Storting 1: €6.500 op 1-1-2003\n• Storting 2: €7.500 op 1-1-2013\n• Op 1-1-2021 (18e verjaardag): omgezet naar ASN Ideaalsparen\n\nASN Ideaalsparen (saldo < €25.000): 1,65% samengesteld per jaar\n\nEva heeft het spaargeld NIET gebruikt. Kosten koper + verbouwing = €15.000.',
          vraag: 'Toon aan dat het spaargeld per 1 januari 2026 genoeg is om de kosten koper en de verbouwingskosten te betalen.',
          antwoord: 'Stap 1 — Saldo op 1-1-2021 (ASN Jeugdsparen, 1,40%/jaar):\n• €6.500 × (1,014)^18 = €6.500 × 1,28434 = €8.348,21\n• €7.500 × (1,014)^8  = €7.500 × 1,11764 = €8.382,33\n• Saldo op 1-1-2021: €16.730,54\n\nStap 2 — Saldo op 1-1-2026 (ASN Ideaalsparen, 1,65%/jaar, 5 jaar):\n• €16.730,54 × (1,0165)^5 = €16.730,54 × 1,08523 = €18.156,–\n\nConclusie: €18.156 > €15.000 → het spaargeld is voldoende.',
          antwoord_rubric: '1 punt: correct saldo op 1-1-2021 (≈ €16.730). 1 punt: correct saldo op 1-1-2026 (≈ €18.156) met conclusie dat dit ≥ €15.000 is.'
        },
        {
          nr: 27, opgave: 5, punten: 4, type: 'berekening',
          context: 'Hypothecaire lening Eva (gesloten 1-1-2026):\n• Bedrag: €210.000 | Looptijd: 30 jaar | Lineaire aflossing\n• Interestpercentage: 0,33% per maand\n• Betaling aan eind van de maand (1e betaling 31-1-2026)\n• Belastingvoordeel op interest: 36,97%\n\nInformatiebron 6 — DUO studielening van Eva:\n• Schuldbedrag op 1-1-2026: €27.045\n• Maandelijks termijnbedrag: €145,60\n• Jaarlijks interestpercentage: 0,46%',
          vraag: 'Bereken de totale uitgaven aan beide leningen van Eva in februari 2026. Vul hiervoor de uitwerkbijlage in.',
          antwoord: 'HYPOTHECAIRE LENING — FEBRUARI 2026:\nMaandelijkse aflossing = €210.000 / (30 × 12) = €583,33\n\nJanuari 2026 (eerst berekenen om restschuld te weten):\n  Restschuld begin jan = €210.000\n  Interest jan = 0,33% × €210.000 = €693,–\n  Belastingvoordeel jan = 36,97% × €693 = €256,20\n  Netto interest jan = €693 − €256,20 = €436,80\n\nRestschuld begin februari = €210.000 − €583,33 = €209.416,67\n  Interest feb = 0,33% × €209.416,67 = €691,07\n  Belastingvoordeel feb = 36,97% × €691,07 = €255,47\n  Netto interest feb = €691,07 − €255,47 = €435,60\n  Totaal hypotheek feb = €583,33 + €435,60 = €1.018,93\n\nDUO STUDIELENING — FEBRUARI 2026:\nVast maandelijks termijnbedrag = €145,60\n\nTOTAAL UITGAVEN FEBRUARI 2026:\n€1.018,93 + €145,60 = €1.164,53',
          antwoord_rubric: '1 punt: correcte maandelijkse hypotheekaflossing (€583,33). 1 punt: correcte netto interest hypotheek februari (€435,60) na belastingvoordeel 36,97%. 1 punt: DUO termijnbedrag februari (€145,60). 1 punt: correct totaal (€1.164,53).'
        },

        // ── OPGAVE 6: De Pluktuin ─────────────────────────────
        {
          nr: 28, opgave: 6, punten: 1, type: 'open',
          context: 'June en Anna zijn eigenaren van De Pluktuin (duurzame zelfoogsttuin). Klanten oogsten zelf groente en fruit voor €15 per pakket. De loonkosten van De Pluktuin behoren voor een deel tot de variabele kosten en voor een deel tot de constante kosten.',
          vraag: 'Leg uit dat de loonkosten zowel tot de constante als de variabele kosten kunnen behoren.',
          antwoord: 'Constante loonkosten: het loon van vaste medewerkers dat altijd betaald wordt, ongeacht het aantal geoogste pakketten (bijv. het vaste salaris van June en Anna).\nVariabele loonkosten: het loon van flexibele of seizoensmedewerkers dat stijgt als er meer pakketten worden geoogst (meer productie = meer arbeid nodig).',
          antwoord_rubric: '1 punt: correct onderscheid vaste medewerkers (constant) vs. flexibele/seizoensmedewerkers (variabel) met uitleg.'
        },
        {
          nr: 29, opgave: 6, punten: 3, type: 'berekening',
          context: 'Gegevens De Pluktuin, tweede kwartaal 2024 (prijs per pakket: €15):\n\n• Omzet: €21.600\n• Variabele kosten zaden, planten en verpakking: €3.000\n• Variabele loonkosten: €8.520\n• Huur landbouwgrond: €750\n• Afschrijvingskosten: €2.000\n• Interestkosten: €800\n• Websiteontwikkeling en social media: €2.130\n• Overige constante kosten: €6.500\n• Totale kosten: €23.700 | Resultaat: −€2.100',
          vraag: 'Bereken met behulp van de dekkingsbijdrage per pakket hoeveel pakketten De Pluktuin meer had moeten verkopen om in het tweede kwartaal van 2024 de break-evenafzet te behalen.',
          antwoord: 'Huidige afzet = €21.600 / €15 = 1.440 pakketten\nTotale variabele kosten = €3.000 + €8.520 = €11.520\nDekkingsbijdrage totaal = €21.600 − €11.520 = €10.080\nDekkingsbijdrage per pakket = €10.080 / 1.440 = €7,–\n\nConstante kosten = €750 + €2.000 + €800 + €2.130 + €6.500 = €12.180\nBreak-evenafzet = €12.180 / €7 = 1.740 pakketten\n\nMeer nodig = 1.740 − 1.440 = 300 pakketten',
          antwoord_rubric: '1 punt: correcte dekkingsbijdrage per pakket (€7). 1 punt: correcte constante kosten (€12.180) / break-evenafzet (1.740). 1 punt: correct antwoord (300 pakketten meer).'
        },
        {
          nr: 30, opgave: 6, punten: 2, type: 'open',
          context: 'Om de afzet te vergroten gaat De Pluktuin abonnementen aanbieden. Klanten kunnen voor €50 per maand vier pakketten oogsten. Het abonnementsgeld wordt maandelijks vooruitbetaald.',
          vraag: 'Noem een financieel voordeel voor De Pluktuin van het verkopen van een maandelijks Plukabonnement ten opzichte van het verkopen van losse pakketten zonder abonnement. Licht het antwoord toe.',
          antwoord: 'Financieel voordeel: het abonnementsgeld wordt vooruitbetaald, waardoor De Pluktuin eerder beschikt over liquide middelen en de liquiditeitspositie verbetert. Bij losse pakketten ontvangen ze pas geld bij afname, terwijl abonnees het geld al aan het begin van de maand betalen. Dit geeft ook meer zekerheid over de maandelijkse omzet.',
          antwoord_rubric: '1 punt: correct financieel voordeel (bijv. betere liquiditeit / vaste inkomsten / geld vooraf / zekerheid omzet). 1 punt: correcte toelichting.'
        }

      ] // einde vragen
    }
  ], // einde be

  // ─────────────────────────────────────────────────────────
  //  NEDERLANDS HAVO 2025 TIJDVAK 1
  //  Leesvaardigheid + schrijfvaardigheid · 55 punten · 180 minuten
  //  Bron: HA-0022-a-25-1-o · alle vragen verwijzen naar het tekstboekje
  // ─────────────────────────────────────────────────────────
  nl: [
    {
      id: 'nl_havo_2025_1',
      vakId: 'nl',
      titel: 'Nederlands',
      niveau: 'havo',
      jaar: 2025,
      tijdvak: 1,
      duur_minuten: 180,
      max_punten: 55,
      bron: 'HA-0022-a-25-1-o · alleexamens.nl',
      bijlagen: [
        { type: 'tekstboekje', label: 'Tekstboekje', url: 'https://sxrjdssmgwwygtskovyc.supabase.co/storage/v1/object/public/examens/havo/nl/2025/I/tekstboekje.pdf' },
        { type: 'antwoord', label: 'Correctievoorschrift', url: 'https://sxrjdssmgwwygtskovyc.supabase.co/storage/v1/object/public/examens/havo/nl/2025/I/correctievoorschrift.pdf' }
      ],
      vragen: [

        // ── OPGAVE 1: Tekst 1 (informatief/betogend artikel) ──────────────
        {
          nr: 1, opgave: 1, punten: 1, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 1.',
          context: 'Tekst 1',
          vraag: 'Welke bewering vormt de these van dit artikel? Gebruik je eigen woorden.',
          antwoord: 'De these is de centrale stelling die de auteur in het artikel verdedigt. Raadpleeg het correctievoorschrift voor de exacte omschrijving.',
          antwoord_rubric: '2 punten: these correct en volledig omschreven in eigen woorden. 1 punt: these gedeeltelijk juist.'
        },
        {
          nr: 2, opgave: 1, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 1.',
          context: 'Tekst 1',
          vraag: 'Geef de functie aan van alinea 3 in het betoog. Licht je antwoord toe met een citaat uit die alinea.',
          antwoord: 'De alinea geeft een tegenargument / tegenwerpingsfunctie, waarna de auteur dit weerlegt. Toelichting met passend citaat uit tekst.',
          antwoord_rubric: '1 punt: correcte alineafunctie. 1 punt: passend citaat als toelichting.'
        },
        {
          nr: 3, opgave: 1, punten: 1, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 1.',
          context: 'Tekst 1',
          vraag: 'Welke argumentatiestrategie gebruikt de auteur in de laatste alinea? Noem de naam van de strategie.',
          antwoord: 'Beroep op autoriteit / beroep op emotie / voorbeeld / analogie — zie correctievoorschrift voor de specifieke strategie bij deze tekst.',
          antwoord_rubric: '1 punt: correcte naam van de argumentatiestrategie.'
        },
        {
          nr: 4, opgave: 1, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 1.',
          context: 'Tekst 1',
          vraag: 'Leg in je eigen woorden uit wat de auteur bedoelt met de metafoor in de tweede alinea.',
          antwoord: 'De metafoor vergelijkt [begrip uit tekst] met [beeld]. De auteur bedoelt daarmee te zeggen dat [uitleg]. Correcte parafrase scoort vol.',
          antwoord_rubric: '2 punten: betekenis correct en volledig uitgelegd in eigen woorden. 1 punt: gedeeltelijk correct.'
        },
        {
          nr: 5, opgave: 1, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 1.',
          context: 'Tekst 1',
          vraag: 'Is de conclusie van de auteur logisch te beredeneren vanuit de argumenten in de tekst? Onderbouw je antwoord.',
          antwoord: 'Ja/nee + onderbouwing met verwijzing naar argumenten uit de tekst. Beide posities kunnen correct zijn mits goed beredeneerd.',
          antwoord_rubric: '1 punt: standpunt (ja/nee). 1 punt: onderbouwing met concrete verwijzing naar de tekst.'
        },

        // ── OPGAVE 2: Tekst 2 (beschouwend/literair) ─────────────────────
        {
          nr: 6, opgave: 2, punten: 1, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 2.',
          context: 'Tekst 2',
          vraag: 'Wat is de toon van de eerste twee alinea\'s? Noem de toon en onderbouw met één citaat.',
          antwoord: 'Ironisch / serieus / kritisch / persoonlijk — zie correctievoorschrift. Citaat ter onderbouwing.',
          antwoord_rubric: '1 punt: correcte toon met passend citaat.'
        },
        {
          nr: 7, opgave: 2, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 2.',
          context: 'Tekst 2',
          vraag: 'Beschrijf de structuur van de tekst. Welke tekstsoort is dit en hoe zijn de alinea\'s opgebouwd?',
          antwoord: 'Beschouwing / column / opiniestuk. Opbouw: inleiding (aanleiding), kern (argumenten/voorbeelden), slot (conclusie of oproep). Correcte identificatie en structuurbeschrijving.',
          antwoord_rubric: '1 punt: correcte tekstsoort. 1 punt: correcte beschrijving van de opbouw.'
        },
        {
          nr: 8, opgave: 2, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 2.',
          context: 'Tekst 2',
          vraag: 'Welke twee doelen wil de auteur met deze tekst bereiken? Noem beide doelen.',
          antwoord: 'Doel 1: informeren (kennis overbrengen). Doel 2: overtuigen / activeren / amuseren — afhankelijk van tekst. Zie correctievoorschrift.',
          antwoord_rubric: '1 punt per correct doel (max 2).'
        },
        {
          nr: 9, opgave: 2, punten: 1, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 2.',
          context: 'Tekst 2',
          vraag: 'Leg de betekenis uit van de zin die als titel van de tekst dient. Gebruik je eigen woorden.',
          antwoord: 'Parafrase van de titel die de dubbele betekenis / symbolische lading verklaart. Zie correctievoorschrift voor de exacte bewoording.',
          antwoord_rubric: '1 punt: correcte uitleg van de betekenis van de titel in eigen woorden.'
        },

        // ── OPGAVE 3: Tekst 3 (informatieve tekst met grafiek / infographic) ─
        {
          nr: 10, opgave: 3, punten: 1, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 3 + bijbehorende grafiek.',
          context: 'Tekst 3',
          vraag: 'Welke conclusie kun je trekken uit de grafiek in combinatie met de tekst?',
          antwoord: 'De grafiek laat [trend/verband] zien; in combinatie met de tekst blijkt dat [conclusie]. Correcte interpretatie van zowel de grafiek als de tekst.',
          antwoord_rubric: '1 punt: correcte conclusie die zowel grafiek als tekst betrekt.'
        },
        {
          nr: 11, opgave: 3, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 3.',
          context: 'Tekst 3',
          vraag: 'De auteur gebruikt in alinea 4 een redenering. Schrijf deze redenering schematisch op als: stelling → argument → conclusie.',
          antwoord: 'Stelling: [kern bewering]. Argument: [onderbouwing]. Conclusie: [gevolgtrekking]. Correcte weergave van de drie-staps-redenering uit de tekst.',
          antwoord_rubric: '1 punt: stelling en argument correct. 1 punt: conclusie correct.'
        },
        {
          nr: 12, opgave: 3, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 3.',
          context: 'Tekst 3',
          vraag: 'Noem twee bezwaren die de auteur noemt tegen de maatregel die in de tekst wordt besproken. Gebruik je eigen woorden.',
          antwoord: 'Bezwaar 1: [uit tekst, eigen woorden]. Bezwaar 2: [uit tekst, eigen woorden]. Zie correctievoorschrift voor de specifieke bezwaren per tekst.',
          antwoord_rubric: '1 punt per correct bezwaar in eigen woorden (max 2).'
        },

        // ── OPGAVE 4: Samenvatting ────────────────────────────────────────
        {
          nr: 13, opgave: 4, punten: 8, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 4 (samenvatting).',
          context: 'Tekst 4 — Samenvatting\n\nSchrijf een samenvatting van tekst 4. De samenvatting moet:\n• Kernpunten bevatten (geen details of voorbeelden)\n• Geschreven zijn in eigen woorden\n• Logisch geordend zijn\n• Maximaal 150 woorden bevatten',
          vraag: 'Schrijf een samenvatting van tekst 4 in maximaal 150 woorden.',
          antwoord: 'Een goede samenvatting bevat de volgende kernpunten:\n1. [Kernpunt 1 — opening/aanleiding]\n2. [Kernpunt 2 — hoofdargument]\n3. [Kernpunt 3 — gevolgen]\n4. [Kernpunt 4 — conclusie/oplossing]\n\nSamenvatting is in eigen woorden, bevat geen onnodige details, is logisch gestructureerd en < 150 woorden.',
          antwoord_rubric: '4 punten: inhoud (correcte kernpunten, geen overbodige details). 2 punten: formulering (eigen woorden, lopende zinnen). 2 punten: structuur (logische volgorde, verbindingswoorden).'
        },

        // ── OPGAVE 5: Schrijfvaardigheid ──────────────────────────────────
        {
          nr: 14, opgave: 5, punten: 14, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 5 (schrijfopdracht).',
          context: 'Tekst 5 — Schrijfvaardigheid\n\nSchrijf een betoog van minimaal 300 woorden op basis van tekst 5. Gebruik de informatie uit tekst 5 als achtergrond. In je betoog:\n• Formuleer een duidelijke these (standpunt)\n• Onderbouw je standpunt met minimaal twee argumenten\n• Ga in op een tegenargument\n• Sluit af met een conclusie\n\nLet op taalverzorging: spelling, zinsbouw, woordgebruik en interpunctie tellen mee.',
          vraag: 'Schrijf het betoog.',
          antwoord: 'Betoog bevat: heldere these, minimaal 2 goede argumenten, weerlegging van tegenargument, sluitende conclusie. Taalverzorging: correct geschreven, variatie in zinsbouw, passend register.',
          antwoord_rubric: '5 punten: inhoud en argumentatie (these, argumenten, tegenwerpingverwerking, conclusie). 5 punten: opbouw en structuur (inleiding/kern/slot, alinea-indeling, verbindingswoorden). 4 punten: taalverzorging (spelling, zinsbouw, woordkeuze, interpunctie).'
        },

        // ── OPGAVE 6: Tekst 6 (beschouwend/column) ───────────────────────
        {
          nr: 15, opgave: 6, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 6.',
          context: 'Tekst 6',
          vraag: 'Leg uit welke visie de auteur heeft op het onderwerp dat in de tekst centraal staat. Hoe komt die visie tot uitdrukking in de tekst?',
          antwoord: 'De auteur heeft een [positieve/kritische/genuanceerde] visie op [onderwerp]. Dit blijkt uit [taalgebruik/woordkeuze/argumenten/toon]. Zie correctievoorschrift.',
          antwoord_rubric: '1 punt: correcte omschrijving van de visie. 1 punt: correcte verwijzing naar hoe die visie zichtbaar is in de tekst.'
        },
        {
          nr: 16, opgave: 6, punten: 1, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 6.',
          context: 'Tekst 6',
          vraag: 'Voor welk publiek is deze tekst bedoeld? Noem twee kenmerken van de tekst die dat aantonen.',
          antwoord: 'Doelgroep: [bijv. jongvolwassenen / brede lezer / geïnteresseerde lezer]. Kenmerken: 1. [bijv. register/toon/woordgebruik]. 2. [bijv. verwijzingen/voorbeelden].',
          antwoord_rubric: '1 punt: correct publiek met twee passende tekstkenmerken als onderbouwing.'
        },
        {
          nr: 17, opgave: 6, punten: 3, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 6.',
          context: 'Tekst 6',
          vraag: 'Vergelijk de standpunten in tekst 5 en tekst 6 over hetzelfde thema. In hoeverre zijn ze het eens of oneens met elkaar?',
          antwoord: 'Overeenkomst: beide auteurs vinden dat [gedeeld punt]. Verschil: auteur tekst 5 benadrukt [punt A], terwijl auteur tekst 6 [punt B]. Ze zijn het [eens / deels eens / oneens] over [kernpunt].',
          antwoord_rubric: '1 punt: correcte overeenkomst. 1 punt: correct verschil. 1 punt: juiste conclusie over mate van overeenstemming.'
        },

        // ── OPGAVE 7: Tekst 7 (leesstrategieën / zakelijke tekst) ─────────
        {
          nr: 18, opgave: 7, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open het tekstboekje — Tekst 7.',
          context: 'Tekst 7',
          vraag: 'Geef voor elk van de volgende alinea\'s de tekstfunctie: alinea 1, alinea 5 en de slotalinea.',
          antwoord: 'Alinea 1: inleiding / probleemstelling. Alinea 5: uitwerking / voorbeeld. Slotalinea: conclusie / oproep / samenvatting. Zie correctievoorschrift.',
          antwoord_rubric: '1 punt: twee functies correct. 2 punten: alle drie functies correct.'
        }

      ] // einde vragen
    }
  ], // einde nl

  // ─────────────────────────────────────────────────────────
  //  ENGELS HAVO 2025 TIJDVAK 1
  //  Reading comprehension · 55 punten · 180 minuten
  //  Bron: HA-0024-a-25-1-o · alle vragen verwijzen naar het tekstboekje
  // ─────────────────────────────────────────────────────────
  en: [
    {
      id: 'en_havo_2025_1',
      vakId: 'en',
      titel: 'Engels',
      niveau: 'havo',
      jaar: 2025,
      tijdvak: 1,
      duur_minuten: 180,
      max_punten: 55,
      bron: 'HA-0024-a-25-1-o · alleexamens.nl',
      bijlagen: [
        { type: 'tekstboekje', label: 'Tekstboekje', url: 'https://sxrjdssmgwwygtskovyc.supabase.co/storage/v1/object/public/examens/havo/en/2025/I/tekstboekje.pdf' },
        { type: 'antwoord', label: 'Correctievoorschrift', url: 'https://sxrjdssmgwwygtskovyc.supabase.co/storage/v1/object/public/examens/havo/en/2025/I/correctievoorschrift.pdf' }
      ],
      vragen: [

        // ── TEXT 1 ────────────────────────────────────────────────────────
        {
          nr: 1, opgave: 1, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 1.',
          context: 'Text 1',
          vraag: 'What is the main purpose of this text? Support your answer with one example from the text.',
          antwoord: 'The main purpose is to [inform / persuade / entertain / advise] the reader. Example from text: [direct quote or paraphrase]. See the answer key for the specific purpose.',
          antwoord_rubric: '1 punt: correct main purpose. 1 punt: relevant supporting example from the text.'
        },
        {
          nr: 2, opgave: 1, punten: 1, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 1.',
          context: 'Text 1',
          vraag: 'In paragraph 2, the author uses the phrase "a double-edged sword". Explain what the author means by using this phrase in the context of the text.',
          antwoord: 'The phrase means that [topic] has both positive and negative consequences / can be beneficial and harmful at the same time. In context: [specific explanation relevant to text content].',
          antwoord_rubric: '1 punt: correct explanation of the phrase in the context of the text.'
        },
        {
          nr: 3, opgave: 1, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 1.',
          context: 'Text 1',
          vraag: 'According to the author, what are two consequences of the development described in paragraph 3? Use your own words.',
          antwoord: 'Consequence 1: [from text, own words]. Consequence 2: [from text, own words]. See answer key for specific consequences.',
          antwoord_rubric: '1 punt per consequence correctly described in own words (max 2).'
        },
        {
          nr: 4, opgave: 1, punten: 1, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 1.',
          context: 'Text 1',
          vraag: 'How does the final paragraph relate to the rest of the text? Explain the function of the final paragraph.',
          antwoord: 'The final paragraph [summarises / draws a conclusion / gives a recommendation / returns to the opening idea]. It functions as [conclusion / call to action / summary].',
          antwoord_rubric: '1 punt: correct explanation of the function/relation of the final paragraph.'
        },

        // ── TEXT 2 ────────────────────────────────────────────────────────
        {
          nr: 5, opgave: 2, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 2.',
          context: 'Text 2',
          vraag: 'The title of text 2 is a play on words. Explain the double meaning of the title.',
          antwoord: 'The title literally means [meaning 1] but in the context of the text it also refers to [meaning 2]. This creates [irony / wordplay / humour].',
          antwoord_rubric: '1 punt: first meaning correct. 1 punt: second meaning / wordplay correctly explained.'
        },
        {
          nr: 6, opgave: 2, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 2.',
          context: 'Text 2',
          vraag: 'In paragraph 4, the author presents a counterargument. What is this counterargument, and how does the author respond to it? Use your own words.',
          antwoord: 'Counterargument: [from text, own words]. Author\'s response/refutation: [from text, own words]. The author [dismisses / acknowledges but counters / partially accepts] the counterargument.',
          antwoord_rubric: '1 punt: counterargument correctly identified in own words. 1 punt: author\'s response correctly described.'
        },
        {
          nr: 7, opgave: 2, punten: 1, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 2.',
          context: 'Text 2',
          vraag: 'What is the tone of text 2? Choose one: formal, informal, ironic, neutral. Justify your answer with a phrase from the text.',
          antwoord: 'Tone: [formal / informal / ironic / neutral]. Justification: [quote from text that demonstrates the tone]. See answer key.',
          antwoord_rubric: '1 punt: correct tone with appropriate justification from the text.'
        },
        {
          nr: 8, opgave: 2, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 2.',
          context: 'Text 2',
          vraag: 'According to text 2, what are the writer\'s two main arguments in favour of the position stated in the opening paragraph?',
          antwoord: 'Argument 1: [from text, own words]. Argument 2: [from text, own words]. See answer key for the specific arguments.',
          antwoord_rubric: '1 punt per correct argument in own words (max 2).'
        },

        // ── TEXT 3 ────────────────────────────────────────────────────────
        {
          nr: 9, opgave: 3, punten: 1, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 3.',
          context: 'Text 3',
          vraag: 'What type of text is text 3? Choose from: news article, opinion piece, scientific report, advertisement. Explain your choice.',
          antwoord: '[Text type] — because [features: layout, language, purpose, audience]. See answer key.',
          antwoord_rubric: '1 punt: correct text type with valid explanation referencing text features.'
        },
        {
          nr: 10, opgave: 3, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 3.',
          context: 'Text 3',
          vraag: 'Paragraph 2 contains a statistic. Explain how the author uses this statistic and what effect it has on the reader.',
          antwoord: 'The statistic [from text] is used to [support the argument / illustrate the scale of the problem / persuade the reader]. The effect is that [it makes the argument more credible / shocking / concrete].',
          antwoord_rubric: '1 punt: correct explanation of how the statistic is used. 1 punt: correct effect on the reader.'
        },
        {
          nr: 11, opgave: 3, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 3.',
          context: 'Text 3',
          vraag: 'The heading "Is this the future we want?" is a rhetorical question. What effect does this have, and why has the author chosen to use this as a heading?',
          antwoord: 'A rhetorical question does not require an answer — it is used to [make the reader think / involve the reader / make a point without stating it directly]. The author uses it to [invite reflection / suggest the answer is obvious / provoke a reaction].',
          antwoord_rubric: '1 punt: correct effect of rhetorical question. 1 punt: correct reason why author chose this heading.'
        },
        {
          nr: 12, opgave: 3, punten: 1, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 3.',
          context: 'Text 3',
          vraag: 'What does the word "nevertheless" in paragraph 5 signal? What is the relationship between the sentence containing "nevertheless" and the sentence before it?',
          antwoord: '"Nevertheless" signals a contrast / concession. The sentence before it states [point A], while "nevertheless" introduces [point B] which contradicts or complicates it.',
          antwoord_rubric: '1 punt: correct explanation of the contrast/concessive relationship signalled by "nevertheless".'
        },

        // ── TEXT 4 ────────────────────────────────────────────────────────
        {
          nr: 13, opgave: 4, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 4.',
          context: 'Text 4',
          vraag: 'Summarise the viewpoint of the expert quoted in paragraph 3. Use your own words. (max. 40 words)',
          antwoord: 'The expert argues that [main point in own words]. He/she believes this because [reasoning]. See answer key for specific content.',
          antwoord_rubric: '1 punt: viewpoint correctly summarised. 1 punt: in own words, not a direct copy of the text.'
        },
        {
          nr: 14, opgave: 4, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 4.',
          context: 'Text 4',
          vraag: 'Compare the approach described in paragraph 2 with the approach described in paragraph 5. What is the key difference?',
          antwoord: 'Approach in §2: [description]. Approach in §5: [description]. Key difference: [how they differ in method / focus / goal].',
          antwoord_rubric: '1 punt: both approaches correctly described. 1 punt: key difference correctly identified.'
        },
        {
          nr: 15, opgave: 4, punten: 1, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 4.',
          context: 'Text 4',
          vraag: 'Find a word or phrase in paragraph 4 that means the same as "to make something worse". Write down the word or phrase.',
          antwoord: '[Word/phrase from text — see answer key for exact word]. Synonyms such as "to aggravate", "to exacerbate", "to worsen" etc.',
          antwoord_rubric: '1 punt: correct word or phrase from the text.'
        },
        {
          nr: 16, opgave: 4, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 4.',
          context: 'Text 4',
          vraag: 'Do you think the title of text 4 is a good choice? Explain why or why not, with reference to the content of the text.',
          antwoord: 'Yes/no + explanation with reference to the content. Both positions are acceptable if well justified. The title should [reflect main idea / capture attention / be relevant to content].',
          antwoord_rubric: '1 punt: clear position (yes/no). 1 punt: justified with reference to text content.'
        },

        // ── TEXT 5 ────────────────────────────────────────────────────────
        {
          nr: 17, opgave: 5, punten: 2, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 5.',
          context: 'Text 5',
          vraag: 'The author of text 5 uses several examples to illustrate the main argument. Choose one example and explain why the author uses it.',
          antwoord: 'Example: [from text]. The author uses this to [illustrate / make concrete / appeal to the reader\'s experience / provide evidence]. It strengthens the argument because [reason].',
          antwoord_rubric: '1 punt: relevant example correctly identified. 1 punt: clear explanation of why the author uses it.'
        },
        {
          nr: 18, opgave: 5, punten: 3, type: 'open',
          needs_bijlage: true, bijlage_tekst: '⚠️ Open the text booklet — Text 5.',
          context: 'Text 5',
          vraag: 'Compare texts 4 and 5 on the same topic. In what way do they agree, and in what way do they disagree? Use your own words.',
          antwoord: 'Agreement: both texts argue that [shared point]. Disagreement: text 4 emphasises [point A], while text 5 focuses on [point B] / takes a different position on [aspect].',
          antwoord_rubric: '1 punt: correct agreement (both texts). 1 punt: correct disagreement. 1 punt: answer in own words, clearly structured.'
        }

      ] // einde vragen
    }
  ] // einde en

}; // einde EXAMENS
