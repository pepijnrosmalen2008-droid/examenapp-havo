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
  //  Bron: HA-0022-a-25-1-o
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
        { type: 'antwoord', label: 'Correctievoorschrift', url: 'https://sxrjdssmgwwygtskovyc.supabase.co/storage/v1/object/public/examens/havo/nl/2025/I/correctievoorschrift.pdf' }
      ],
      teksten: [
        {
          id: 't1', deel: 1, nr: 1,
          titel: 'Mijn ideale vriendin: de vlogger',
          bron: 'Doortje Smithuijsen, Trouw, 29 januari 2022',
          inhoud: `<p class="ex-al"><b class="ex-aln">1</b> Ik weet niet meer precies wanneer Emma Chamberlain in mijn leven kwam, maar het moet ergens in de eerste coronalockdown zijn geweest. Ik verveelde me tijdens het lunchen. Normaal gesproken zat ik tussen de middag in mijn studio, omringd door collega-zelfstandigen, nu zat ik alleen.</p>
<p class="ex-al"><b class="ex-aln">2</b> De eerste Emma-video die ik bekeek, had de aantrekkelijke titel <em>What I do in a day *at home*</em>. Vermoedelijk gaf een gevoel van herkenning de doorslag om het filmpje aan te klikken. Ik was ook de hele dag *at home*; benieuwd hoe iemand anders zich erdoorheen sloeg.</p>
<p class="ex-al"><b class="ex-aln">3</b> Het is lastig te omschrijven wat ik aantrof in haar filmpjes, nog lastiger uit te leggen waarom ik steeds meer wilde zien. Hoofdactiviteit in de meeste vlogs van Emma is koffiezetten en filosoferen over de vraag hoeveel hazelnootmelk ze erbij zal doen. Verder speelt ze Fortnite in bed en denkt ze hardop na over de vraag hoe het kan dat ze acht uur per dag op TikTok zit.</p>
<p class="ex-al"><b class="ex-aln">4</b> Ik heb ooit gelezen dat alleenstaande Koreanen tijdens het eten video's opzetten van andere mensen die eten, zodat ze zich niet eenzaam voelen. Destijds vond ik dat een treurig idee, maar na een dag of tien lunchen met Emma kon ik het goed begrijpen. Ik kreeg een enorm veilig gevoel van het idee dat er tijdens de lunch altijd iemand tegen me zou praten, terwijl ik niets terug hoefde te zeggen en ik mijn eenzijdige gesprekspartner uit kon zetten wanneer het mij uitkwam.</p>
<p class="ex-al"><b class="ex-aln">5</b> Ik had ook wel eens gelezen – en zelfs geschreven – over parasociale relaties. En nu was ik er ongemerkt zelf één aangegaan. De term ontstond toen sociologen in de jaren vijftig onderzoek deden naar de relatie tussen tv-persoonlijkheden en hun publiek. Door dagelijks of wekelijks naar dezelfde persoonlijkheden te kijken, ontwikkelden mensen de illusie dat ze hun tv-helden kenden. En daardoor wilden ze elke keer weer hetzelfde programma zien.</p>
<p class="ex-al"><b class="ex-aln">6</b> Vandaag zijn we omringd door potentiële parasociale relaties: op zo'n beetje elk medium vechten vloggers, influencers en youtubers om onze eenzijdige affectie. Er wordt dan ook veel onderzoek gedaan naar de parasociale relaties die mensen aangaan met hun online idolen. Eén recente bevinding is dat mensen sneller geneigd zijn te gaan sporten als ze een parasociale relatie aangaan met een sport-influencer: een uurtje zweten met een digitale metgezel is leuker dan in je eentje, ook als diegene jou helemaal niet kent.</p>
<p class="ex-al"><b class="ex-aln">7</b> Ook werd duidelijk dat angstig aangelegde mensen sneller parasociale relaties aangaan, wat de kans op bijvoorbeeld een YouTube-verslaving flink vergroot. En tijdens de coronalockdowns bloeiden er significant meer parasociale relaties op, ook dat blijkt uit onderzoek.</p>
<p class="ex-al"><b class="ex-aln">8</b> "Ze voelen als mijn vriendinnen." Ik zat in een café met een programmamaker, ter voorbereiding op een avond over sociale media en de invloed daarvan. De programmamaker had het over moedervloggers. Sinds ze kinderen had, zei ze, was ze in beslag genomen door deze jonge vrouwen. Het begon onschuldig: af en toe even kijken hoe een andere moeder het ontbijt voor de kinderen maakte, de kinderkamer inrichtte, met haar vriend kibbelde over wie er moest oppassen. Maar op zeker moment moest de programmamaker altijd meteen naar de nieuwe video's van haar favoriete vloggers kijken. Ook als haar kinderen huilden, haar man om aandacht vroeg, het eten nog gekookt moest worden of de fles nog opgewarmd. "Het voelde als een soort ontsnapping. Alsof ik mijn hectische leven achter me kon laten, even kon verdwijnen in hun wereld", zo legde ze me uit.</p>
<p class="ex-al"><b class="ex-aln">9</b> Toen de pandemie ging liggen en werken op mijn studio weer mogelijk werd, merkte ik dat ik het lunchen met Emma enorm miste. Ineens moest ik me weer verhouden tot andere mensen aan een eettafel, weer meedoen met gezamenlijke boodschappen, weekendbeschouwingen aanhoren, geduldig wachten tot iedereen klaar was. Tijdens de lockdown was mijn leven ultiem productief. Het was werken, lunchen met Emma en weer doorwerken, zonder het oponthoud van sociaal wenselijk gedrag. Nu keek ik, terwijl ik mijn eten allang ophad, onrustig toe hoe studiogenoten nóg een boterham smeerden, nóg een verhaal begonnen over een mislukte date.</p>
<p class="ex-al"><b class="ex-aln">10</b> Misschien had YouTube voor mij niet zozeer een probleem opgelost, maar eerder een probleem gecreëerd. Ik was het te prettig gaan vinden om te lunchen met Emma en ervoer veel meer moeite om sociaal wenselijk gedrag te vertonen dan normaal.</p>
<p class="ex-al"><b class="ex-aln">11</b> In haar <em>Zelfverwoestingsboek</em> beschrijft Marian Donner de relatie tussen Theodore Twombly en zijn AI-systeem Samantha uit de film <em>Her</em> als dystopisch toekomstscenario, waarin er "van de mens nog maar weinig over is". De wereld om hem heen verveelt Twombly totaal, schrijft Donner, omdat niets hem nog uitdaagt. "De apparaten weten wat hij wil. Het leven is frictieloos geworden. Zelfs de liefde is frictieloos geworden." Samantha is er altijd voor hem, ze is nooit chagrijnig, "er zijn geen hobbels of problemen, er is alleen maar positiviteit."</p>
<p class="ex-al"><b class="ex-aln">12</b> In zekere zin was Emma voor mij een frictieloze vorm van contact geworden. Ik wist precies hoelang haar filmpjes duurden en ik kon ze uitzetten zodra ik het wilde. Ik hoefde nooit te wachten tot ze haar boterham op had, of tot ze was uitgepraat. Net zoals YouTube voor de programmamaker een frictieloze vervanging werd van afspraken met echte vrienden: ze hoefde er geen oppas voor te regelen, en als haar kind riep, kon ze haar 'vriendin' gewoon uitzetten.</p>
<p class="ex-al"><b class="ex-aln">13</b> Kan het zijn dat vloggers de rol van onze vrienden aan het overnemen zijn? Terwijl om ons heen een samenleving wordt opgetrokken waarin we steeds meer elkaars concurrent moeten zijn, waarin we allemaal constant moeten presteren en meer van onszelf eisen, is er simpelweg minder tijd om bij elkaar thuis op de bank te ploffen en eens even te bespreken hoe het nou echt met ons gaat. En zijn er wel steeds meer vloggers en influencers bij wie je in een kort, overzichtelijk moment dat gevoel van genegenheid kan scoren in digitale, on-demand-variant.</p>
<p class="ex-al"><b class="ex-aln">14</b> Een paar weken geleden ging Emma Chamberlain uit de lucht. Ik had al een paar keer geïrriteerd haar YouTube-pagina ververst, toen Emma een podcast uploadde waarin ze vertelde dat ze een mentale instorting had gehad.</p>
<p class="ex-al"><b class="ex-aln">15</b> In een interview vertelde Emma eens dat ze vaak doet alsof haar 11 miljoen volgers met haar samenwonen, "en dan is het net alsof ik wel heel veel vrienden heb."</p>
<p class="ex-al"><b class="ex-aln">16</b> Volgers en gevolgden: ze zitten allemaal vast in een parasociale relatie. De één kan alleen maar kijken en luisteren, de ander alleen maar praten, filmen en delen. Ze ontmoeten elkaar nergens.</p>
<p class="ex-al"><b class="ex-aln">17</b> Aan het einde van <em>Her</em> wordt Theodore verlaten door zijn AI-geliefde. "Theodore is te saai voor Samantha", schrijft Donner. "Hij daagt haar niet meer uit." Ze vertrekt samen met andere besturingssystemen naar een volledig digitale wereld. Volgens Donner laat Theodore zien "wat er met een mens gebeurt als alles om hem heen gericht is op positiviteit en gemak." Met zo'n houding kun je nooit duurzame relaties aangaan, denkt Donner. Immers, "wat is liefde anders dan frictie? Anders dan misverstanden en onbegrip?"</p>
<p class="ex-al"><b class="ex-aln">18</b> Tja, wat is liefde? Je hebt van die suffe tekeningetjes die daar antwoord op geven. "Liefde is... samen groeien", en dan twee poppetjes erbij die gezapig een plant water geven. In tijden van digitalisering kun je ook zeggen: "Liefde is... je favoriete vlog voor iemand op pauze zetten." Of: "Liefde is... samen lunchen, zonder scherm." Maar misschien is liefde ook: accepteren dat je vriend of vriendin af en toe liever met een vlogger afspreekt dan met jou. Dat je partner soms even aan jullie huishouden wil ontsnappen via een YouTube-filmpje. Zolang de wereld om ons heen het moeilijker maakt om echte, duurzame relaties aan te gaan, mogen we ons af en toe best troosten met een vlog.</p>
<p class="ex-al"><b class="ex-aln">19</b> Emma maakte gelukkig onlangs haar rentree op YouTube. Ze zette weer koffie, deed er hazelnootmelk bij, ging naar de supermarkt, at sushi – alles zwijgend dit keer, zonder haar bekende sarcastische gemompel. Hoewel ik blij was dat ze een nieuwe video online had gezet, voelde het toch raar om voor mijn plezier en ontspanning te kijken naar iemand die overduidelijk mentaal niet in orde was. Moest ik me zorgen maken om Emma? Moest ik me schuldig voelen? YouTube afzetten?</p>
<p class="ex-al"><b class="ex-aln">20</b> De titel van Emma's video vatte perfect samen wat we op dat moment – dwars door onze digitale parasociale relatie heen – misschien wel tegelijk voelden. "It will be ok."</p>
<div class="ex-tekst-bron-voet">Doortje Smithuijsen, Trouw, 29 januari 2022 · <em>Filosoof en journalist</em></div>
<div class="ex-tekst-notities"><b>Noten</b><br>1 coronalockdown: periode waarin het bezoeken van mensen en voorzieningen ernstig was beperkt ter bestrijding van de coronapandemie<br>2 What I do in a day at home: Wat ik doe tijdens een dag thuis<br>3 AI-systeem: systeem gebaseerd op kunstmatige intelligentie<br>4 on demand: op bestelling<br>5 It will be ok: Het komt goed</div>`
        },
        {
          id: 't1f', deel: 1, nr: '1 (fragment)',
          titel: 'Tekstfragment 1 — VRIEND',
          bron: 'Toon Hermans, Groot versjesboek, 2005',
          inhoud: `<div class="ex-gedicht">
<p class="ex-al-gedicht">Je hebt iemand nodig,</p>
<p class="ex-al-gedicht">stil en oprecht,</p>
<p class="ex-al-gedicht">die als het erop aan komt</p>
<p class="ex-al-gedicht">voor je bidt of voor je vecht.</p>
<br>
<p class="ex-al-gedicht">Pas als je iemand hebt,</p>
<p class="ex-al-gedicht">die met je lacht en met je grient,</p>
<p class="ex-al-gedicht">dan pas kun je zeggen:</p>
<p class="ex-al-gedicht">'k heb een vriend.</p>
</div>
<div class="ex-tekst-notities"><em>Afbeelding 1 (cartoon van Dirk van de Wiel) is niet opgenomen in de digitale versie. Raadpleeg het correctievoorschrift voor de relevante vragen.</em></div>`
        },
        {
          id: 't2', deel: 2, nr: 2,
          titel: 'De gedachteloosheid van de Gorillas-fiets',
          bron: 'Floor Rusman, NRC Handelsblad, 23 oktober 2021',
          inhoud: `<p class="ex-al"><b class="ex-aln">1</b> Ineens zijn ze overal in de grote steden, de bezorgers van Gorillas, Getir, Flink en Zapp. Ze razen op elektrische fietsen door de straten, elke fietstocht een olympische sprint op weg naar iemand die nu-nu-nu komijnzaad moet hebben, wat flessen wijn, of alleen een pakje sigaretten.</p>
<p class="ex-al"><b class="ex-aln">2</b> Die vergelijking met olympische sport verzin ik niet zelf. "Net als een olympisch atleet gaan we tot het uiterste", zei Gorillas-manager Batuhan Aydin afgelopen week in NRC. In de magazijnen wordt hiphop en techno gedraaid om de werknemers energiek te houden. Aydin: "We doen bij dit bedrijf alles in een gestoord, ongelofelijk tempo." Wonderbaarlijk genoeg leek hij dit als iets positiefs te beschouwen.</p>
<p class="ex-al"><b class="ex-aln">3</b> "Maar… maar… staat die flitsbezorging niet haaks op trends als mindfulness en vertraging?", vraag ik na lezing van het stuk. Mijn gesprekspartners kijken me meewarig aan. De wereld is groter dan jouw brave bubbeltje, zeggen ze; snellere service wint altijd.</p>
<p class="ex-al"><b class="ex-aln">4</b> Waarom wind ik me zo op? Is het nostalgie naar de tijd dat verlangen kon bestaan zonder onmiddellijk bevredigd te worden? Een beetje. Is het ergernis over de bezorgers, die verwikkeld lijken in ritten op leven en dood? Ja, ook. Maar het is meer dan dat, concludeer ik uiteindelijk. Hoeveel ik er zelf ook van houd, ik voel een instinctieve weerstand tegen nóg meer gemak. De vraag is namelijk: waar houdt het op?</p>
<p class="ex-al"><b class="ex-aln">5</b> Zoals water naar het laagste punt vloeit, zo beweegt de mens naar de makkelijkste optie, oftewel: de optie met de minste frictie. 'Frictie' betekent zoiets als weerstand of wrijving. Filosoof Miriam Rasch geeft in haar essayboek <em>Frictie</em> allerlei voorbeelden van 'frictieloos design': apps als Uber, die je een interactie met de chauffeur besparen, en de automatische antwoordsuggesties van Gmail. Door dit soort technologie verspillen we steeds minder tijd, en dat is natuurlijk prettig. Maar is frictieloosheid altijd winst?</p>
<p class="ex-al"><b class="ex-aln">6</b> Dat frictie ook waardevol kan zijn, erkennen we grappig genoeg wel als het gaat om kunst. Goede kunst moet 'schuren', onvoorspelbaar zijn, ons uit ons dagelijks stramien halen. We wantrouwen kunst die te soepel naar binnen glijdt. Ik word wel eens gepest omdat ik van Dire Straits houd – te makkelijk, aldus de fijnproevers.</p>
<p class="ex-al"><b class="ex-aln">7</b> Frictie verstoort de automatische piloot; daarom is ze belangrijk voor kunst en verstorend voor commercie. Een consument moet gedachteloos kunnen scrollen, klikken en betalen. Die gedachteloosheid, het gemak waarmee we door allerlei dagelijkse handelingen bewegen, heeft iets verslavends. En precies dat is waarover ik me zorgen maak. Hoe minder frictie er is, vermoed ik, hoe lager onze tolerantie ervoor wordt. We zouden nu een woedeaanval krijgen van de tijd die het vroeger kostte om de weg te vinden in een vreemde stad. Misschien vinden we het over tien jaar wel een olympische prestatie om zelf naar de bakker te lopen.</p>
<p class="ex-al"><b class="ex-aln">8</b> Het ene gemak lokt het andere uit. Wat nou als we door onze lage frictietolerantie dingen opgeven die we eigenlijk, als we erover nadenken, belangrijker vinden dan wat extra gemak? Neem gezichtsherkennings­technologie: veel mensen vinden dat nu nog te ver gaan. Ondertussen wordt het in Rusland al gebruikt als betaalmiddel in de metro. "Waarom niet, het lijkt me wel handig", aldus een laconieke Rus gisteren in NRC. In Schotland gebruiken negen schoolkantines gezichtsherkenning aan de kassa: alles voor de efficiëntie.</p>
<p class="ex-al"><b class="ex-aln">9</b> In de EU zal dit niet gebeuren, zeggen deskundigen. Dat mag niet van de Europese privacywetgeving. Maar gezichtsherkenning wordt wel steeds meer ingezet als toegangscontrole bij kantoren en festivals. Zal het water niet ook hier naar het laagste punt vloeien? Hoe verleidelijk is het om nog meer dingen gedachteloos te doen!</p>
<p class="ex-al"><b class="ex-aln">10</b> Principes leggen het af tegen gemakzucht, dat zal iedereen herkennen die wel eens routineus op 'alle cookies accepteren' heeft geklikt. Juist omdat het zo werkt, bezie ik mijn gemakzucht met argwaan. Die moet getemd worden, niet aangemoedigd – zoals de flitsbezorgers doen.</p>
<div class="ex-tekst-bron-voet">Floor Rusman, NRC Handelsblad, 23 oktober 2021 · <em>Redacteur bij NRC Handelsblad</em></div>
<div class="ex-tekst-notities"><b>Noot</b><br>1 Dire Straits: Britse rockband actief van 1977–1995</div>`
        },
        {
          id: 't3', deel: 3, nr: 3,
          titel: 'Regels in de ruimte',
          bron: 'Vier bronnen · NRC Handelsblad / intermediair.nl, 2021',
          inhoud: `<div class="ex-bron-hdr">Bron 1 — De ruimte is van cruciaal belang voor de aarde, en daarom zijn er regels nodig</div>
<p class="ex-al"><b class="ex-aln">1</b> Met een testvlucht van zijn Virgin Galactic-ruimtevliegtuig schoot multimiljardair Richard Branson in juli 2021 door de stratosfeer. Zijn jongensdroom kwam uit: vier minuten zweefde hij met zijn vijfkoppige crew gewichtloos boven de aarde. De bijzondere trip had hij speciaal vervroegd om Amazon-tycoon Jeff Bezos voor te zijn. Bezos stapte anderhalve week later in zijn Blue Origin-raket.</p>
<p class="ex-al"><b class="ex-aln">2</b> De nieuwe space race ging niet tussen rivaliserende staten, maar tussen ijdele miljardairs. Na de aankondiging van Bransons lancering liet Bezos in een wrevelige reactie weten zijn rivaal een goede reis te wensen, ook al zou die officieel de ruimte niet ingaan. De tachtigkilometergrens die 'SpaceShipTwo Unity 22' aantikte, werd in de jaren vijftig door de NASA bestempeld tot begin van de ruimte, maar internationaal wordt de grens van honderd kilometer boven de aarde aangehouden.</p>
<p class="ex-al"><b class="ex-aln">3</b> De boodschap was duidelijk: Branson mocht eerder zijn, Bezos ging hoger. Baas boven baas. En dan is er nóg een baas: Elon Musk, die met zijn bedrijf SpaceX eerder al de eerste commerciële partij was die een bemenste ruimtevlucht in een baan rond de aarde kreeg.</p>
<p class="ex-al"><b class="ex-aln">4</b> De <em>space barons</em> worden ze wel genoemd. Kort gezegd willen Musk en Branson vooral Mars 'koloniseren', Jeff Bezos de ruimte rondom de aarde. Het zijn mannen die meer gemeen hebben dan hun kleur, levensfase en torenhoge ambitie. Als jongetjes lazen ze grotendeels dezelfde sciencefictionboeken. Als jongemannen waren ze stuk voor stuk buitenbeentjes; ze zijn geobsedeerd door raketten en willen, boven alles, winnen.</p>
<p class="ex-al"><b class="ex-aln">5</b> Hun taalgebruik verraadt een wereldbeeld. De ruimte noemen ze een 'frontier', een plek om te 'koloniseren', zoals ooit het Wilde Westen. Steeds als ik dat lees, struikel ik erover. Koloniseren. Alsof dat woord niet zucht onder de last van het verleden. Als onze taal bepaalt hoe we naar de wereld kijken, moeten we zorgvuldig zijn met onze woorden. Waarom niet 'bezoeken' in plaats van 'koloniseren'?</p>
<p class="ex-al"><b class="ex-aln">6</b> Je kunt je afvragen of wij, aardgebonden stakkers, ons hier nu druk om moeten maken. Waarom laten we een klein clubje interplanetaire adel zich niet vermaken in het heelal? Omdat de ruimte inmiddels van cruciaal belang is voor de aarde, daarom. We kunnen allang niet meer zonder al die satellieten daarboven, en er valt wat te halen. De eerste buitenaardse mijnbouwbedrijven zijn al opgericht. Lyndon B. Johnson voorzag het in 1958 al: "De ruimte controleren is de wereld controleren."</p>
<p class="ex-al"><b class="ex-aln">7</b> Volgens het Ruimteverdrag moeten we de ruimte beschouwen als een "provincie voor de hele mensheid" en dat is precies wat het zou moeten zijn en blijven.</p>
<p class="ex-al"><b class="ex-aln">8</b> Onze sterrenhemel is de bron van onze wetenschappelijke kennis, en van de oudste verhalen van de mensheid. Cultureel en wetenschappelijk is het heelal voor ieder van ons van grote betekenis.</p>
<p class="ex-al"><b class="ex-aln">9</b> Het probleem is alleen dat dit idee van een gedeelde menselijke provincie zich maar moeilijk vertaalt in harde wetten. Het Ruimteverdrag stamt uit de jaren zestig, het is niet bedacht op de commerciële exploitatie van private partijen. Maar als we de space cowboys ongemoeid hun gang laten gaan, kan de ruimte een exclusief wingewest worden voor de superrijken.</p>
<p class="ex-al"><b class="ex-aln">10</b> Zelf koppelen ze hun interplanetaire ambities niet in de eerste plaats aan financiële winst. Branson noemde het 'overzichtseffect' als motivatie.</p>
<p class="ex-al"><b class="ex-aln">11</b> Dit effect treedt op bij astronauten die vanuit de ruimte naar de aarde kijken en doordrongen raken van de kwetsbaarheid en verbluffende schoonheid van onze planeet. Door de grote afstand zien ze plotseling hoe alles hier beneden een geheel vormt. Dit diepe besef maakt dat veel ruimtevaarders zich bij terugkomst van hun missie gaan inzetten voor behoud van ons ecosysteem.</p>
<p class="ex-al"><b class="ex-aln">12</b> Branson zegt met zijn plannen voor ruimtetoerisme zo veel mogelijk mensen deze ervaring te willen bieden. Maar het is de vraag of vier minuten zweven op tachtig kilometer hoogte een overzichtseffect oplevert. Onderzoek wijst uit dat een enkele keer kijken niet genoeg is voor een langdurige impact.</p>
<p class="ex-al"><b class="ex-aln">13</b> Ook Bezos en Musk framen hun plannen graag als filantropische ondernemingen. Raketbrandstof is een mengeling van kerosine en mythevorming, schreef de Deense godsdienstwetenschapper Thore Bjørnvig.</p>
<p class="ex-al"><b class="ex-aln">14</b> Er is betere regelgeving nodig. Hiervoor zou de internationale gemeenschap een voorbeeld kunnen nemen aan Antarctica. Overheden moeten overeenkomen dat het gebied buiten de dampkring niet voor commerciële doeleinden mag worden geëxploiteerd.</p>
<p class="ex-al"><b class="ex-aln">15</b> Het heelal heeft ons nog van alles te leren, over onze oorsprong en onze toekomst. De sterrenhemel kan ons helpen verwondering en relativering te vinden. Maar daarvoor moet de ruimte wel de ruimte blijven. En niet het speelveld van groot geld en dito ego's.</p>
<div class="ex-tekst-bron-voet">Marjolijn van Heemstra, NRC Handelsblad, 16 juli 2021</div>
<div class="ex-bron-hdr">Bron 2 — Afbeelding (cartoon)</div>
<p class="ex-al-grijs">De cartoon is niet opgenomen in de digitale versie. Raadpleeg het tekstboekje.</p>
<div class="ex-bron-hdr">Bron 3</div>
<p class="ex-al"><b class="ex-aln">1</b> Het ideaalbeeld van Musk is om Mars te koloniseren. Bezos en Branson gaan niet eens naar een andere planeet, maar schieten ieder in hun eigen raket zo'n 100 kilometer omhoog, koekeloeren daar een paar minuten in de rondte, en zijn binnen een kwartier weer terug op aard. Het is je reinste decadentie.</p>
<p class="ex-al"><b class="ex-aln">2</b> Maar helemaal nutteloos zijn de inspanningen van deze drie ruimtemusketiers niet. Dankzij hun ondernemersneus is het ontwikkelen van ruimteschepen stukken goedkoper geworden. Ook hebben ze in belangrijke mate bijgedragen aan het verduurzamen van de ruimtevaart, door te zorgen voor recyclebare materialen in deze industrie.</p>
<p class="ex-al"><b class="ex-aln">3</b> Ruimtereizen voelen voor velen van ons zinloos, omdat we er het belang niet van inzien. Maar dat zagen we 100 jaar geleden ook niet van het vliegtuig, en 600 jaar geleden ook niet toen Columbus in een boot de oceaan overstak. Alleen door te ontdekken gaan we nieuwe mogelijkheden zien.</p>
<p class="ex-al"><b class="ex-aln">4</b> In het dagelijks leven is het soms lastig ons te realiseren hoe wonderlijk het eigenlijk is dat we hier rond mogen lopen. Maar astronauten hebben van een afstandje onze planeet bekeken en zagen in één klap hoe fragiel en kwetsbaar onze aarde is, en dat er goed voor haar gezorgd moet worden.</p>
<p class="ex-al"><b class="ex-aln">5</b> Met een beetje mazzel kickt dat besef ook in bij deze machtige miljardairs.</p>
<div class="ex-tekst-bron-voet">Barbara Noordermeer, intermediair.nl</div>
<div class="ex-bron-hdr">Bron 4</div>
<p class="ex-al"><b class="ex-aln">1</b> De ruimtemijnbouw, het winnen van grondstoffen in de ruimte, kan de mensheid vele voordelen brengen. Permanente bewoning in de ruimte komt dan opeens heel dichtbij.</p>
<p class="ex-al"><b class="ex-aln">2</b> Aan de andere kant zijn er ook grote risico's: een asteroïde zou ter aarde kunnen storten of het getij zou kunnen veranderen. En is de ruimtemijnbouw wel zo rechtvaardig? Elk land opereert nu voor zich, waardoor het recht van de sterkste zal regeren. Terwijl volgens het Ruimteverdrag hemellichamen dienen te worden gebruikt in het belang van alle staten.</p>
<p class="ex-al"><b class="ex-aln">3</b> Het is de hoogste tijd voor een intergouvernementele toezichthouder. Een voorbeeld: de Internationale Zeebodemautoriteit van de VN. Een vergelijkbare internationale ruimte-autoriteit zou toezien op mijnbouwvergunning, nadere regelgeving kunnen invoeren en voor de (milieu)belangen van het gebied kunnen opkomen.</p>
<div class="ex-tekst-bron-voet">Florentine Vos, NRC Handelsblad, 2 maart 2021 · <em>Advocaat internationaal publiekrecht in Londen</em></div>
<div class="ex-tekst-notities"><b>Noten</b><br>1 space race: ruimtewedloop · 2 barons: baronnen · 3 frontier: grens (koloniaal beladen term) · 4 the unknown: het onbekende</div>`
        }
      ],
      vragen: [

        // ── OPGAVE 1: Tekst 1 — Mijn ideale vriendin: de vlogger ──────────
        {
          nr: 1, opgave: 1, punten: 1, type: 'open',
          tekst_id: 't1', context: 'Tekst 1',
          vraag: 'Welke bewering vormt de these van dit artikel? Gebruik je eigen woorden.',
          antwoord: 'De these is de centrale stelling die de auteur in het artikel verdedigt. Raadpleeg het correctievoorschrift voor de exacte omschrijving.',
          antwoord_rubric: '2 punten: these correct en volledig omschreven in eigen woorden. 1 punt: these gedeeltelijk juist.'
        },
        {
          nr: 2, opgave: 1, punten: 2, type: 'open',
          tekst_id: 't1', context: 'Tekst 1',
          vraag: 'Geef de functie aan van alinea 3 in het betoog. Licht je antwoord toe met een citaat uit die alinea.',
          antwoord: 'De alinea geeft een tegenargument / tegenwerpingsfunctie, waarna de auteur dit weerlegt. Toelichting met passend citaat uit tekst.',
          antwoord_rubric: '1 punt: correcte alineafunctie. 1 punt: passend citaat als toelichting.'
        },
        {
          nr: 3, opgave: 1, punten: 1, type: 'open',
          tekst_id: 't1', context: 'Tekst 1',
          vraag: 'Welke argumentatiestrategie gebruikt de auteur in de laatste alinea? Noem de naam van de strategie.',
          antwoord: 'Beroep op autoriteit / beroep op emotie / voorbeeld / analogie — zie correctievoorschrift voor de specifieke strategie bij deze tekst.',
          antwoord_rubric: '1 punt: correcte naam van de argumentatiestrategie.'
        },
        {
          nr: 4, opgave: 1, punten: 2, type: 'open',
          tekst_id: 't1', context: 'Tekst 1',
          vraag: 'Leg in je eigen woorden uit wat de auteur bedoelt met de metafoor in de tweede alinea.',
          antwoord: 'De metafoor vergelijkt [begrip uit tekst] met [beeld]. De auteur bedoelt daarmee te zeggen dat [uitleg]. Correcte parafrase scoort vol.',
          antwoord_rubric: '2 punten: betekenis correct en volledig uitgelegd in eigen woorden. 1 punt: gedeeltelijk correct.'
        },
        {
          nr: 5, opgave: 1, punten: 2, type: 'open',
          tekst_id: 't1', context: 'Tekst 1',
          vraag: 'Is de conclusie van de auteur logisch te beredeneren vanuit de argumenten in de tekst? Onderbouw je antwoord.',
          antwoord: 'Ja/nee + onderbouwing met verwijzing naar argumenten uit de tekst. Beide posities kunnen correct zijn mits goed beredeneerd.',
          antwoord_rubric: '1 punt: standpunt (ja/nee). 1 punt: onderbouwing met concrete verwijzing naar de tekst.'
        },

        // ── OPGAVE 2: Tekst 2 — De gedachteloosheid van de Gorillas-fiets ─
        {
          nr: 6, opgave: 2, punten: 1, type: 'open',
          tekst_id: 't2', context: 'Tekst 2',
          vraag: 'Wat is de toon van de eerste twee alinea\'s? Noem de toon en onderbouw met één citaat.',
          antwoord: 'Ironisch / serieus / kritisch / persoonlijk — zie correctievoorschrift. Citaat ter onderbouwing.',
          antwoord_rubric: '1 punt: correcte toon met passend citaat.'
        },
        {
          nr: 7, opgave: 2, punten: 2, type: 'open',
          tekst_id: 't2', context: 'Tekst 2',
          vraag: 'Beschrijf de structuur van de tekst. Welke tekstsoort is dit en hoe zijn de alinea\'s opgebouwd?',
          antwoord: 'Beschouwing / column / opiniestuk. Opbouw: inleiding (aanleiding), kern (argumenten/voorbeelden), slot (conclusie of oproep).',
          antwoord_rubric: '1 punt: correcte tekstsoort. 1 punt: correcte beschrijving van de opbouw.'
        },
        {
          nr: 8, opgave: 2, punten: 2, type: 'open',
          tekst_id: 't2', context: 'Tekst 2',
          vraag: 'Welke twee doelen wil de auteur met deze tekst bereiken? Noem beide doelen.',
          antwoord: 'Doel 1: informeren (kennis overbrengen). Doel 2: overtuigen / activeren / amuseren — afhankelijk van tekst.',
          antwoord_rubric: '1 punt per correct doel (max 2).'
        },
        {
          nr: 9, opgave: 2, punten: 1, type: 'open',
          tekst_id: 't2', context: 'Tekst 2',
          vraag: 'Leg de betekenis uit van de zin die als titel van de tekst dient. Gebruik je eigen woorden.',
          antwoord: 'Parafrase van de titel die de dubbele betekenis / symbolische lading verklaart. Zie correctievoorschrift voor de exacte bewoording.',
          antwoord_rubric: '1 punt: correcte uitleg van de betekenis van de titel in eigen woorden.'
        },

        // ── OPGAVE 3: Tekst 3 — Regels in de ruimte (4 bronnen) ───────────
        {
          nr: 10, opgave: 3, punten: 1, type: 'open',
          tekst_id: 't3', context: 'Tekst 3 (Bronnen 1–4)',
          vraag: 'Welke conclusie kun je trekken uit de bronnen in combinatie met de tekst?',
          antwoord: 'De bronnen laten zien dat [conclusie]. Correcte interpretatie van de bronnen in samenhang.',
          antwoord_rubric: '1 punt: correcte conclusie die meerdere bronnen betrekt.'
        },
        {
          nr: 11, opgave: 3, punten: 2, type: 'open',
          tekst_id: 't3', context: 'Tekst 3 (Bron 1)',
          vraag: 'De auteur van Bron 1 gebruikt in alinea 9 een redenering. Schrijf deze redenering schematisch op als: stelling → argument → conclusie.',
          antwoord: 'Stelling: het Ruimteverdrag is verouderd. Argument: stamt uit de jaren zestig, niet bedacht op commerciële exploitatie. Conclusie: betere regelgeving is nodig.',
          antwoord_rubric: '1 punt: stelling en argument correct. 1 punt: conclusie correct.'
        },
        {
          nr: 12, opgave: 3, punten: 2, type: 'open',
          tekst_id: 't3', context: 'Tekst 3 (Bronnen 1 & 4)',
          vraag: 'Noem twee bezwaren die de auteurs noemen tegen de huidige situatie in de ruimtevaart. Gebruik je eigen woorden.',
          antwoord: 'Bezwaar 1: commerciële partijen exploiteren de ruimte zonder adequate regelgeving. Bezwaar 2: landen die niet meedoen aan ruimtemijnbouw lopen rijkdommen mis, wat onrechtvaardig is.',
          antwoord_rubric: '1 punt per correct bezwaar in eigen woorden (max 2).'
        },

        // ── OPGAVE 3 (vervolg): Bron 1 — structuur & argumentatie ──────────
        {
          nr: 13, opgave: 3, punten: 2, type: 'open',
          tekst_id: 't3', context: 'Bron 1 (Regels in de ruimte)',
          vraag: 'Bron 1 is na de inleiding in vier delen te verdelen met de volgende kopjes:\n– deel 1: Het wereldbeeld van de space barons\n– deel 2: De meerwaarde van de ruimte voor de mensheid\n– deel 3: De ruimte als domein voor ondernemers om van te profiteren\n– deel 4: Wat er moet gebeuren tegen de ruimtecowboys\nBij welke alinea begint deel 3? En bij welke alinea begint deel 4?',
          antwoord: 'Deel 3 begint bij alinea 6. Deel 4 begint bij alinea 14.',
          antwoord_rubric: '1 punt per correct alineanummer (max 2).'
        },
        {
          nr: 14, opgave: 3, punten: 1, type: 'mc',
          tekst_id: 't3', context: 'Bron 1 — alinea 6',
          vraag: 'In alinea 6 van bron 1 worden de groepen "wij, aardgebonden stakkers" en "een klein clubje interplanetaire adel" tegenover elkaar gezet. Wat wordt aangetoond door deze groepen tegenover elkaar te zetten?',
          opties: [
            'De gewone mens kan alleen afwachtend toekijken, terwijl de miljardairs ongecontroleerd hun gang kunnen gaan in de ruimte.',
            'De gewone mens moet zich niet bemoeien met wat er in de ruimte gebeurt, terwijl de rijken hierin juist het voortouw moeten nemen.',
            'De miljardairs weten precies wat er zich afspeelt in de ruimte, terwijl de gewone mens geen idee heeft van wat daar allemaal gebeurt.',
            'De rijken amuseren zich in de ruimte, terwijl de gewone mens aan het werk is op de aarde.'
          ],
          correct: 0,
          antwoord: 'A — De gewone mens kan alleen afwachtend toekijken, terwijl de miljardairs ongecontroleerd hun gang kunnen gaan in de ruimte.',
          antwoord_rubric: '1 punt: A correct.'
        },
        {
          nr: 15, opgave: 3, punten: 1, type: 'open',
          tekst_id: 't3', context: 'Bron 1 — alinea 10 t/m 13',
          vraag: 'In alinea 10 tot en met 13 van bron 1 lees je een verwijt richting de ruimtevaartondernemers Bezos, Branson en Musk. Vat dit verwijt samen in maximaal 15 woorden.',
          antwoord: 'Ze framen hun plannen als filantropisch/goed voor de mensheid, terwijl het om ego en geld gaat.',
          antwoord_rubric: '1 punt: kern van verwijt correct (schijnfilantropie / mythevorming / eigenbelang) in max 15 woorden.'
        },
        {
          nr: 16, opgave: 3, punten: 2, type: 'open',
          tekst_id: 't3', context: 'Bron 1 — alinea 10 t/m 12',
          vraag: '"Het ligt dus wat genuanceerder dan Branson het doet voorkomen."\nGeef aan welke uitspraak van Branson hier wordt bekritiseerd en welke twee nuanceringen er worden aangebracht. Baseer je antwoord op alinea 10 tot en met 12 van bron 1.',
          antwoord: 'Uitspraak: Branson beweert dat ruimtetoerisme het "overzichtseffect" bij zo veel mogelijk mensen kan opwekken. Nuancering 1: de vraag is of vier minuten zweven op tachtig kilometer hoogte een overzichtseffect oplevert. Nuancering 2: onderzoek wijst uit dat een enkele keer kijken niet genoeg is voor een langdurige impact.',
          antwoord_rubric: '1 punt: uitspraak van Branson correct (overzichtseffect / ruimtetoerisme voor breed publiek). 1 punt: beide nuanceringen correct (hoogte onvoldoende / eenmalig kijken onvoldoende).'
        },
        {
          nr: 17, opgave: 3, punten: 3, type: 'open',
          tekst_id: 't3', context: 'Bronnen 3 en 4',
          vraag: 'Ook in bron 3 en 4 staan argumenten voor en tegen commerciële activiteiten in de ruimte. Noteer per bron één argument tégen en één argument vóór. (Het argument tégen in bron 3 is al gegeven: "Commerciële ruimtevaart is een vorm van decadentie.")',
          antwoord: 'Bron 3 — Vóór: door ruimtevaartondernemers zijn raketten goedkoper en duurzamer geworden (recyclebare materialen) / ontdekken leidt tot nieuwe mogelijkheden. Bron 4 — Tégen: risico\'s (asteroïde kan neerstorten / getijverandering) of onrechtvaardigheid (recht van de sterkste). Bron 4 — Vóór: kansen voor winnen van grondstoffen / permanente bewoning in ruimte komt dichterbij.',
          antwoord_rubric: '1 punt per correct argument (max 3; zie correctievoorschrift voor puntenverdeling per bron).'
        },
        {
          nr: 18, opgave: 3, punten: 1, type: 'open',
          tekst_id: 't3', context: 'Bron 4',
          vraag: 'Beargumenteer of de auteur van bron 4 de vraagstelling "Zijn er regels nodig voor commerciële activiteiten in de ruimte?" met "ja" of "nee" zal beantwoorden. Vul in:\n"De auteur van bron 4 zal de centrale vraag waarschijnlijk met (1) beantwoorden, want (2)."',
          antwoord: 'De auteur van bron 4 zal de centrale vraag waarschijnlijk met JA beantwoorden, want zij pleit in alinea 3 voor een intergouvernementele toezichthouder (vergelijkbaar met de Internationale Zeebodemautoriteit van de VN).',
          antwoord_rubric: '1 punt: ja + correcte redenering verwijzend naar alinea 3 van bron 4 (pleidooi voor toezichthouder / regelgeving).'
        }

      ] // einde vragen
    }
  ], // einde nl

  // ─────────────────────────────────────────────────────────
  //  ENGELS HAVO 2025 TIJDVAK 1
  //  Reading comprehension · 55 punten · 180 minuten
  //  Bron: HA-0024-a-25-1-o
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
        { type: 'antwoord', label: 'Correctievoorschrift', url: 'https://sxrjdssmgwwygtskovyc.supabase.co/storage/v1/object/public/examens/havo/en/2025/I/correctievoorschrift.pdf' }
      ],
      teksten: [
        {
          id: 't1', deel: null, nr: 1,
          titel: 'London\'s first plastic-free takeaway business',
          bron: 'standard.co.uk, 2021',
          inhoud: `<p class="ex-al"><b class="ex-aln">1</b> Like so many of us, Anshu Ahuja used to get home from work on a Friday night, collapse in front of the television and order a takeaway. Every time, though, it would come with a hefty helping of guilt. 'It would arrive on a noisy scooter in a puff of smoke, packaged in a pile of plastic,' she says. 'The damage to the planet was so obvious.'</p>
<p class="ex-al"><b class="ex-aln">2</b> During her childhood in Mumbai, the dabbawalas system delivered food by bicycle in reusable tiffin tins known as dabbas. 'I thought, there must be a way of taking this centuries-old system and using technology to modernise it for London,' she says. The result is DabbaDrop, London's first plastic-free and emissions-free takeaway service, which delivers South Asian food including dals and vibrant curries to Londoners in dabba tins, with sides such as ginger jam and roti packaged in compostable pots and paper bags.</p>
<p class="ex-al"><b class="ex-aln">3</b> DabbaDrop works on a subscription basis, allowing customers the option to book one regularly changing menu each week. 'All our meals are cooked according to how many people we'll be feeding that week, which means nothing goes to waste,' says Anshu. 'We also try to use as much of the ingredients as possible, so if we're doing a pumpkin curry we'll include the skin, for example. Any waste we do have we compost.'</p>
<p class="ex-al"><b class="ex-aln">4</b> The company uses its own fleet of cyclists, as well as low-impact delivery companies such as Ecofleet and Pedal Me. The DabbaDrop team has calculated that on average each of their mains has a 75 per cent lower carbon footprint than a standard Indian takeaway. The business has expanded rapidly from its east London origins, spreading to parts of north London and recently starting to deliver in south-east London, too. 'There's definitely a growing audience of people who want a delicious takeaway without feeling guilty,' says Anshu.</p>
<div class="ex-tekst-bron-voet">adapted from standard.co.uk, 2021</div>`
        },
        {
          id: 't2', deel: null, nr: 2,
          titel: 'Tunnel vision: \'Mole Man\' home bags elite award',
          bron: 'Hackney Citizen, 2021',
          inhoud: `<p class="ex-al">A house that once had local planners tearing out their hair because of the owner's penchant for digging illegal underground tunnels has won Best Dwelling at this year's New London Architecture Awards.</p>
<p class="ex-al">The late William Lyttle, nicknamed the Hackney Mole Man, spent 40 years hollowing out a network of tunnels that reached a depth of 26 feet and stretched out 65 feet in all directions.</p>
<p class="ex-al">Lyttle was evicted in 2006, and the property has now been turned into a three-storey home and art studio. Judges praised architects Adjaye Associates for paying homage to the home's history with underground living areas.</p>
<div class="ex-tekst-bron-voet">Hackney Citizen, 2021</div>`
        },
        {
          id: 't3', deel: null, nr: 3,
          titel: 'Charitable billionaires (letter to the editor)',
          bron: 'i newspaper, 2019',
          inhoud: `<p class="ex-al">Pascale Hughes's report on altruism (<em>i weekend</em>, 1 June) was excellent and balanced. It exposes the hypocrisy of the '1 per cent'. I remember writing a letter to another national newspaper in 2010 in response to the Giving Pledge announced by Bill Gates and Warren Buffet and a number of multibillionaires, asking them two simple questions: what is the hourly rate of workers in your company; and how much tax do you pay in the country where you make your profit?</p>
<p class="ex-al">I am pleased to see that the article states the shameful fact that inequality widens in tandem with corporate profits. Simple changes to our tax system, such as financial transaction tax and enforcing regulations for tax collection more rigorously, would have an immediate impact.</p>
<p class="ex-al"><em>Christina Kadir, Brighton, East Sussex</em></p>
<div class="ex-tekst-bron-voet">i newspaper, 2019</div>
<div class="ex-tekst-notities"><b>Note</b><br>the Giving Pledge = a campaign to encourage extremely wealthy people to give a major part of their wealth to charitable causes</div>`
        },
        {
          id: 't4', deel: null, nr: 4,
          titel: 'The rise of y\'all',
          bron: 'Thomas Moore Devlin, babbel.com, 2019',
          inhoud: `<p class="ex-al"><b class="ex-aln">1</b> Have y'all heard? "Y'all" is in the mainstream now. While historically associated with the southern United States, "y'all" is becoming a popular choice for people who want to address multiple people. The rise of "y'all" fills a lexical hole in English that's been around for a long time: the lack of a second-person plural pronoun.</p>
<p class="ex-al"><b class="ex-aln">2</b> Whether you've embraced "y'all" or prefer a different way of referring to a group of people, it's worth knowing about the history of the second-person plural in English. It combines Old English, regional dialects, African American Vernacular English (AAVE) and gendered language all into a single story. So yes, "y'all" really has it all.</p>
<p class="ex-al"><b class="ex-aln">3</b> Pronouns are a closed class of words. That means it is very, very rare for new pronouns to arise (compare that to open class words like verbs and nouns – new ones are added to our lexicon all the time). Creating a new second-person plural pronoun that everyone would use, then, is difficult. What's happened instead is that many different pronouns have appeared in various parts of the world.</p>
<p class="ex-al"><b class="ex-aln">4</b> The two most popular second-person plural pronouns (at least in the United States) are "y'all" and "you guys". As of right now, "you guys" is a far more popular choice than "y'all," but it's facing a reckoning at the moment. There's disagreement as to whether "you guys" is a gendered term or not. On the one hand, at this point people refer to other people as "guys" no matter the gender. On the other, "guys" explicitly originated as a term referring to men, and so it joins a pattern of terms originally meaning "men" that are now used to refer to all people.</p>
<p class="ex-al"><b class="ex-aln">5</b> The argument against "you guys" is still mainly made by the minority, and as far as language usage goes it can seem like a minor point. But as people make the argument for a more inclusive term, they turn to one other option: "y'all".</p>
<p class="ex-al"><b class="ex-aln">6</b> There are quite a few reasons for the rise of "y'all" over the past decade. As we mentioned earlier, it's a gender-neutral option, and thus some linguists are advocating for its adoption by more people. Plus, the mainstream use of AAVE has become more and more common. Social media is also a major contributor here, breaking down geographic boundaries. This has allowed the word to flourish.</p>
<p class="ex-al"><b class="ex-aln">7</b> "Y'all" has a long way to go before becoming part of Standard English, or even Standard American English, but it's not entirely far-fetched that it might. It's an incredibly versatile term – it can also be used to address a single person, or you can use "all y'all" to widen the scope of who you're talking to – and it's more concise than most of the other second-person plural pronouns mentioned before.</p>
<p class="ex-al"><b class="ex-aln">8</b> If you've never used "y'all" before, give it a try. It might sound like you're doing an imitation of a southerner at first, but after a while it becomes natural. We won't tell you what to do with your life, but if y'all want to adopt a new way of addressing groups, don't overlook "y'all."</p>
<div class="ex-tekst-bron-voet">babbel.com, 2019</div>
<div class="ex-tekst-notities"><b>Note</b><br>AAVE = variety of English spoken by many African Americans in urban communities in the United States and Canada</div>`
        },
        {
          id: 't5', deel: null, nr: 5,
          titel: 'This Charming Man (roman fragment)',
          bron: 'Marian Keyes',
          inhoud: `<p class="ex-al"><em>Het volgende fragment komt uit een roman van Marian Keyes. In dit fragment gaan Grace en haar vriend Damien Stapleton op kraambezoek bij zijn zus Christine.</em></p>
<p class="ex-al">Christine, tall and elegant and astonishingly svelte for a woman who had given birth only five weeks ago, came to welcome us. 'Come in, come in. Sorry, I'm just in myself, it's all a bit …' Richard should be home soon. Richard was Christine's husband. He had one of those mysterious jobs where he spent fourteen hours a day on the phone, making money. Damien and I joked privately that every day he was locked into his office and wasn't allowed to leave until he'd made another hundred million euro.</p>
<p class="ex-al">We followed Christine into the enormous Colefax and Fowler kitchen, where a nervous-looking Polish girl was doing something at the microwave.</p>
<p class="ex-al">'This is Marta,' Christine said. 'Our new nanny.'</p>
<p class="ex-al">Marta nodded hello and promptly scarpered.</p>
<p class="ex-al">'And this …' Christine gazed fondly into a bassinet, in which a tiny pink-skinned baby was asleep. '… is Maximillian.'</p>
<p class="ex-al">(Yes, Christine and Richard had named their four children after emperors. I know it makes them sound like grandiose nutters, but they're not.)</p>
<p class="ex-al">Damien and I stared politely at the sleeping child.</p>
<p class="ex-al">'Okay, you can stop admiring him now.' Christine reached for a corkscrew. 'Wine?'</p>
<p class="ex-al">'Yes. Can I do anything to help?'</p>
<p class="ex-al">It was a fake question. No one could ever help Christine. She did everything so much better and faster than everyone else that there was no point. Anyway, I didn't want to help. I was at someone's else's house for my dinner, why would I want to do stuff I'd have to do at home?</p>
<p class="ex-al">'All done,' Christine said. 'Did most of it last night. Just a few last-minute fiddly bits.'</p>
<p class="ex-al">'What's with your trouser suit?' I asked her. 'How come you're looking so clean? You're not back at work already?'</p>
<p class="ex-al">'Certainly not, I'm just popping in for a couple hours a day, to keep an eye on things.'</p>
<p class="ex-al">Christine was so clever and accomplished that she no longer did much actual scrubbed-up, green-gowned, hands-on surgery stuff. Instead she was Head of Surgery at Dublin's most expensive hospital, the first woman to have ever held that post.</p>
<p class="ex-al">'So where's Augustina?' I looked around.</p>
<p class="ex-al">'At her Sanskrit lesson?' Damien asked.</p>
<p class="ex-al">'Haha. Mandarin, actually.'</p>
<p class="ex-al">It took me a moment to realize that Christine was serious.</p>
<p class="ex-al">'We don't make her go,' Christine said, as I tried to hide my astonishment – well, actually distress, if I'm to be honest. 'She asked to go to lessons.'</p>
<p class="ex-al">Too weird. What nine-year-old would ask to learn Mandarin?</p>
<p class="ex-al">'And we keep an eye on her,' Christine said.</p>
<p class="ex-al">'On her work-life balance?' Damien suggested.</p>
<p class="ex-al">'If your tongue could get any further into your cheek…' Christine said. 'Anyway, cheers.' She held up her glass. 'It's lovely to see you both.'</p>
<div class="ex-tekst-bron-voet">Marian Keyes, <em>This Charming Man</em></div>`
        },
        {
          id: 't6', deel: null, nr: 6,
          titel: 'The Matrix: is this really happening?',
          bron: 'Brian Raftery, theguardian.com, 2021',
          inhoud: `<p class="ex-al"><b class="ex-aln">1</b> It was early 1999, and people were freaking out about the future. A new millennium was on the way, carrying with it the promise – or threat – of massive change. Would the next century guide us toward a tech-enabled utopia? Or, as some feared, would it plunge the world into a full-on apocalypse? These were strange days, marked by equal parts anxiety and anticipation. Which made it the perfect moment for a sleek, cerebral movie called <em>The Matrix</em>.</p>
<p class="ex-al"><b class="ex-aln">2</b> Created by a pair of mostly unknown filmmakers (Lana and Lilly Wachowski), and headlined by a commercially iffy star (Keanu Reeves), the $60m cyber-thriller became an instant hit. Some viewers were sucked in by the film's mind-melting storyline – about a hacker named Neo who discovers that mankind is enslaved in a computer-made simulation. Others were simply turned on by the film's whoa-inducing fight scenes. By the end of 1999, it was clear that <em>The Matrix</em> was The One: the first true digital-era blockbuster.</p>
<p class="ex-al"><b class="ex-aln">3</b> The pop-cultural impact of the film was clear within months of its release. The Wachowskis had incorporated new digital effects that let characters freeze in mid-air, or dodge hails of gunfire, while cameras circled the action in a near-360-degree swirl. Not since 1977, when <em>Star Wars</em> was released, had a movie so quickly rebooted the look and feel of mainstream moviemaking.</p>
<p class="ex-al"><b class="ex-aln">4</b> But these were all surface-level aftershocks. The deeper legacy of <em>The Matrix</em> wouldn't be revealed for years. A DVD release broke sales records at the time, allowing for multiple repeat viewings. But it was the internet that really let Matrix fans go down the rabbit hole.</p>
<p class="ex-al"><b class="ex-aln">5</b> It was a tense, transformative period – one that was encapsulated by <em>The Matrix</em>. If you were suspicious of all this new technology, the film served as a cautionary tale about our devices overpowering our lives. But if you were already very online, <em>The Matrix</em> was proof that the internet was full of possibility.</p>
<p class="ex-al"><b class="ex-aln">6</b> These were big ideas and they led to big conversations, many of which percolated online. Some of the questions moviegoers were asking at the time: "Are we being controlled by our computers?" "If The Matrix is real, what can you do about it?" The Wachowskis had made a film that seemed to speak directly to the internet, and the internet couldn't stop speaking back.</p>
<p class="ex-al"><b class="ex-aln">7</b> Neo and his partner, Trinity, treat each other with a level of mutual respect that's rarely seen in male-female big-screen relationships, even to this day. And they work alongside a multi-gender, multi-racial team of rebels. Despite its grim shoot-'em-up scenes and killer machines, <em>The Matrix</em> is a deeply hopeful film: one that pushes the value of caring for one another.</p>
<p class="ex-al"><b class="ex-aln">8</b> Still, the ultimate sign of <em>The Matrix</em>'s ongoing importance is the fact that, more than two decades after its release, it's becoming harder to tell if we're living with <em>The Matrix</em>, or within it. The internet has become so overloaded, it's now possible for everyone to generate their own immersive reality.</p>
<p class="ex-al"><b class="ex-aln">9</b> It's a grim situation, one that undercuts the message of hope that was hardwired into <em>The Matrix</em>. But no matter where Neo and Trinity go next, the message of the original landmark film will continue to ring truer than ever: we're all increasingly stuck in our own versions of The Matrix – but we still have the power to rage against the machines and free ourselves.</p>
<div class="ex-tekst-bron-voet">theguardian.com, 2021</div>`
        },
        {
          id: 't7', deel: null, nr: 7,
          titel: 'Hydroelectric dams and big cats',
          bron: 'Tara Pirie, theconversation.com, 2021',
          inhoud: `<p class="ex-al"><b class="ex-aln">1</b> Big cats are among the most widespread top predators on Earth. As with many large carnivores, big cats are under threat from habitat loss, which leaves them with less to eat. Their spread-out populations and slow reproductive rates make them particularly vulnerable. Forest loss also contributes to climate change, and hydroelectricity, which is being developed worldwide as an alternative energy source to fossil fuels, is a big cause of deforestation.</p>
<p class="ex-al"><b class="ex-aln">2</b> Building hydroelectric dams has caused extinctions and spread diseases in rivers globally, but the threat to ecosystems on land has largely been overlooked. In a recent study, researchers found 164 dams that already intersect the jaguar range and 421 dams that do the same for tigers.</p>
<p class="ex-al"><b class="ex-aln">3</b> Large expanses of land are flooded to create reservoirs when building hydroelectric plants in low-lying, relatively flat areas. Although tigers and jaguars can and do swim, they mainly hunt species such as deer that live on land. Sites chosen for dams typically incorporate floodplains and areas along rivers that are important for both species, since they tend to contain lots of prey. The flooded area will force both predators and prey into surrounding areas. If it cannot adapt, the predators may be forced further afield in search of food.</p>
<p class="ex-al"><b class="ex-aln">4</b> In addition, additional hydroelectric dams can increase the presence of people in remote areas. Roads built to access new dam sites consequently open up areas that were previously impenetrable. Roads can be a barrier to some species and kill those that try to cross. So any new dams, especially in conservation areas or areas where top predators prowl, should be avoided.</p>
<p class="ex-al"><b class="ex-aln">5</b> One way to mitigate the damage from building new hydroelectric plants may be to do it on slopes outside of areas that are crucial for conserving tigers and jaguars. Alternative sources of energy are important for a sustainable future, but their benefits should not come at a substantial cost to species already under threat.</p>
<div class="ex-tekst-bron-voet">theconversation.com, 2021</div>`
        },
        {
          id: 't8', deel: null, nr: 8,
          titel: 'Therapist to the super-rich',
          bron: 'Clay Cockrell, theguardian.com, 2021',
          inhoud: `<p class="ex-al"><b class="ex-aln">1</b> If I had a dollar for every time I've heard the term "first world problems", my bank account would look similar to those of my clients. I work as a psychotherapist and my specialism is ultra-high net worth individuals. Over the years, I have developed a great deal of empathy for those who have far too much.</p>
<p class="ex-al"><b class="ex-aln">2</b> What could possibly be challenging about being a billionaire, you might ask. Well, what would it be like if you couldn't trust those close to you? Or if you looked at any new person in your life with deep suspicion? I hear this from my clients all the time: "What do they want from me?"; or "How are they going to manipulate me?"; or "They are probably only friends with me because of my money."</p>
<p class="ex-al"><b class="ex-aln">3</b> Then there are the struggles with purpose – the depression that sets in when you feel like you have no reason to get out of bed. Why bother going to work when the business you have built or inherited runs itself without you now? If all your necessities and much more were covered for the rest of your life – you might struggle with a lack of meaning and ambition too.</p>
<p class="ex-al"><b class="ex-aln">4</b> Most of the people I see are much more willing to talk about their sex lives or substance-misuse problems than their bank accounts. Money is seen as dirty and secret. Money is wrapped up in guilt, shame, and fear. There is a perception that money can immunise you against mental-health problems when actually, I believe that wealth can make you much more susceptible to them.</p>
<p class="ex-al"><b class="ex-aln">5</b> I see family situations like those in <em>Succession</em> all the time. Too many of my clients want to indulge their children so "they never have to suffer what I had to suffer" while growing up. But the result is that they prevent their children from experiencing the very things that made them successful: sacrifice, hard work, overcoming failure and developing resilience.</p>
<p class="ex-al"><b class="ex-aln">6</b> <em>Succession</em> is built on the idea of a group of wealthy children vying for who will take the mantle from their father – none of them are able to convince him that they can do it. The wealthy parents I see, often because of their own guilt and shame, are not preparing their children for the challenges of managing their wealth.</p>
<p class="ex-al"><b class="ex-aln">7</b> I was raised in a small town in rural Kentucky, solidly in the middle class. And it can be very difficult to watch these individuals struggle with the toxicity of excess, isolation and deep mistrust.</p>
<div class="ex-tekst-bron-voet">adapted from theguardian.com, 2021</div>
<div class="ex-tekst-notities"><b>Note</b><br>Succession = an American drama series revolving around the fictional Roy family, owners of a global media company</div>`
        },
        {
          id: 't9', deel: null, nr: 9,
          titel: 'Granta scoops Buckingham\'s new book',
          bron: 'Heloise Wood, thebookseller.com, 2019',
          inhoud: `<p class="ex-al"><b class="ex-aln">1</b> Granta Books will publish "a powerful antidote to our atomised world" from author and academic Will Buckingham: <em>Hello, Stranger</em>.</p>
<p class="ex-al"><b class="ex-aln">2</b> Anne Meadows, senior commissioning editor at Granta, acquired world English language rights from Emma Finn at C&W Agency. <em>Hello, Stranger</em> is billed as "an exploration of how welcoming strangers into our homes and our cities might improve our lives and change the world."</p>
<p class="ex-al"><b class="ex-aln">3</b> <em>Hello, Stranger</em> explores how different cultures – from governors in Ancient Rome to festival goers in the outer islands of Indonesia – welcome strangers as guests, enemies and migrants. The book explores "how opening our doors could cure the loneliness epidemic, alleviate the migrant crisis and enrich us all."</p>
<p class="ex-al"><b class="ex-aln">4</b> Buckingham is the author of several books and has a PhD in philosophy and an MA in social anthropology, and lectures at The Parami Institute in Myanmar.</p>
<p class="ex-al"><b class="ex-aln">5</b> "Hello, Stranger not only made me feel wiser, and fascinated me with its brilliant stories, it made me want to be a better, warmer, kinder, more welcoming person," Meadows said.</p>
<div class="ex-tekst-bron-voet">thebookseller.com, 2019</div>`
        },
        {
          id: 't10', deel: null, nr: 10,
          titel: 'Rewatching classic films',
          bron: 'Andrew Miller, The Economist, July 2023',
          inhoud: `<p class="ex-al"><b class="ex-aln">1</b> Risky business, re-watching old movies. You may decide that a film you loved in your youth is dross – and that your youthful self was a dolt. Worse, it might seem offensive, which all those years ago you failed to notice.</p>
<p class="ex-al"><b class="ex-aln">2</b> Happily, that wasn't my experience with "Raiders of the Lost Ark". "Indiana Jones and the Dial of Destiny", the finale of the franchise, is released this week, and "Raiders" remains a great, great movie: a stunt and gag a minute, a hero brilliantly conceived from whip to theme-tune, and a star, Harrison Ford, in his rugged pomp.</p>
<p class="ex-al"><b class="ex-aln">3</b> Besides regret and affection, reconsidering classics can surprise you. The optimism of the original "Top Gun" contrasts tellingly with the nostalgia of its sequel. Today the avoidable calamity in "Titanic" feels to me like a parable of climate change. Dive into early James Bond and you realise how much he has evolved; radically recasting 007 might only be in character. Beneath its screwball antics, "Some Like it Hot", my favourite film, now seems way ahead of its time.</p>
<div class="ex-tekst-bron-voet">The Economist, July 2023</div>`
        },
        {
          id: 't11', deel: null, nr: 11,
          titel: 'Trick or Eat',
          bron: 'Jamie Ducharme, Time, 2017',
          inhoud: `<p class="ex-al"><b class="ex-aln">1</b> For people who typically hoard Halloween candy past Thanksgiving, here's some surprising advice: some dentists actually condone eating the candy all at once, rather than rationing it out over weeks.</p>
<p class="ex-al"><b class="ex-aln">2</b> After you eat sweets, bacteria feed on the sugars and starches left on your teeth and form plaque. Eventually, the acid in plaque begins to wear away at the enamel coating your teeth, forming tiny holes, also known as cavities, that grow larger and larger over time.</p>
<p class="ex-al"><b class="ex-aln">3</b> Anna Berik, a dentist in Newton, Massachusetts, says it doesn't really matter, at least from a cavity-forming perspective, how much you eat at a time. "At some point, there's a threshold where the bacteria can't really work any harder. They can only make the acid so fast," she says. For that reason, feasting on sweets, then brushing your teeth right after, is actually less cavity-causing than spreading that candy out over the next three months.</p>
<p class="ex-al"><b class="ex-aln">4</b> Chris Kammer, a dentist in Madison, Wisconsin, also favors the one-and-done approach, so much so, in fact, that he started a Halloween candy buyback program, with the goal of preventing kids from dipping into their trick-or-treating bag over and over again. Kammer encourages kids to select a few favorite pieces of candy, then bring the rest of their haul to one of his 2,400 buyback sites around the country.</p>
<div class="ex-tekst-bron-voet">adapted from Time, 2017</div>`
        },
        {
          id: 't12', deel: null, nr: 12,
          titel: 'Football match? We can predict the outcome!',
          bron: 'Taha Yasseri, theconversation.com, 2021',
          inhoud: `<p class="ex-al">The legendary German goalkeeper Manuel Neuer once said: "You can plan, but what happens on a football field cannot be predicted." This sentiment goes a long way to explaining why football is the most popular sport worldwide. Anything can happen on the field, and the more surprising the outcome of a match, the more memorable it will be. But our new study suggests the results of football matches are becoming more predictable.</p>
<div class="ex-tekst-notities"><b>Data comparison</b></div>
<p class="ex-al">We developed a computer model to predict the results of football matches based on data from almost 88,000 matches played over 26 years (1993–2019) across 11 major European leagues. Our model tried to predict whether the home or away team would win by looking at their performance in a certain number of previous matches. Even so, our model predicted the results correctly roughly 75% of the time.</p>
<div class="ex-tekst-notities"><b>Increasingly correct</b></div>
<p class="ex-al">We found it has become progressively easier to predict the results of football matches over the years. For instance, our model could correctly predict the winner of a Bundesliga match in 60% of matches in 1993, whereas its performance was as high as 80% in 2019. Finding that football results have become more predictable initially surprised us.</p>
<div class="ex-tekst-notities"><b>A widening divide</b></div>
<p class="ex-al">When we looked at teams in the same league in a given season, we observed that in more recent years, the points have been distributed among teams much less evenly: overall the stronger teams have become more successful, while the weaker teams have become less successful. This echoes the notion that "the rich get richer and the poor get poorer".</p>
<div class="ex-tekst-notities"><b>Home-field advantage</b></div>
<p class="ex-al">One other trend: we observed an initial home-field advantage of 30% in the early 1990s – which means on average a team playing at home was 30% more likely to win. The home-field advantage has gradually shrunk to only 15% during the most recent seasons.</p>
<div class="ex-tekst-notities"><b>The strong are getting stronger</b></div>
<p class="ex-al">So there's less and less chance for the weaker teams to benefit from playing at home. Transportation and training have significantly improved over the past few years, minimising the logistical challenges of playing away. Our findings highlight the need for stronger regulations around club incomes, expenditures and player salaries. A game that's easy to predict is not one that will necessarily keep bringing crowds to the stadiums.</p>
<div class="ex-tekst-bron-voet">adapted from theconversation.com, 2021</div>`
        }
      ],
      vragen: [

        // ── TEXT 1 — DabbaDrop ───────────────────────────────────────────
        {
          nr: 1, opgave: 1, punten: 2, type: 'open',
          tekst_id: 't1', context: 'Text 1',
          vraag: 'What is the main purpose of this text? Support your answer with one example from the text.',
          antwoord: 'The main purpose is to inform / inspire the reader about DabbaDrop, a plastic-free and emissions-free takeaway service. Example: the statistic about 75% lower carbon footprint.',
          antwoord_rubric: '1 punt: correct main purpose. 1 punt: relevant supporting example from the text.'
        },
        {
          nr: 2, opgave: 1, punten: 1, type: 'open',
          tekst_id: 't1', context: 'Text 1',
          vraag: 'Explain in your own words how DabbaDrop minimises food waste. Use details from the text.',
          antwoord: 'DabbaDrop cooks meals according to how many people will be fed that week, so nothing is wasted. They also use all parts of ingredients (e.g. pumpkin skin) and compost any remaining waste.',
          antwoord_rubric: '1 punt: correct explanation including at least two specific details from the text.'
        },
        {
          nr: 3, opgave: 1, punten: 2, type: 'open',
          tekst_id: 't1', context: 'Text 1',
          vraag: 'According to the text, what inspired Anshu Ahuja to start DabbaDrop? Use your own words.',
          antwoord: 'Anshu was inspired by the dabbawalas system she knew from her childhood in Mumbai, which delivered food by bicycle in reusable tins. She wanted to modernise this centuries-old system for London.',
          antwoord_rubric: '1 punt per correct element (inspiration + modernisation) in own words (max 2).'
        },
        {
          nr: 4, opgave: 1, punten: 1, type: 'open',
          tekst_id: 't1', context: 'Text 1',
          vraag: 'How does the final paragraph relate to the rest of the text? Explain the function of the final paragraph.',
          antwoord: 'The final paragraph shows the business is growing and concludes by noting there is a growing audience for sustainable takeaways. It functions as a conclusion / confirmation of success.',
          antwoord_rubric: '1 punt: correct explanation of the function/relation of the final paragraph.'
        },

        // ── TEXT 2 — Mole Man ────────────────────────────────────────────
        {
          nr: 5, opgave: 2, punten: 2, type: 'open',
          tekst_id: 't2', context: 'Text 2',
          vraag: 'The title of text 2 is a play on words. Explain the double meaning of the title.',
          antwoord: '"Tunnel vision" literally refers to the tunnels dug by William Lyttle. It also means a narrow or obsessive focus — which describes Lyttle\'s 40-year obsession with digging.',
          antwoord_rubric: '1 punt: first meaning (literal tunnels) correct. 1 punt: second meaning (obsessive focus) correctly explained.'
        },
        {
          nr: 6, opgave: 2, punten: 2, type: 'open',
          tekst_id: 't2', context: 'Text 2',
          vraag: 'What does this text say about how the architects dealt with the history of the building? Use your own words.',
          antwoord: 'Architects Adjaye Associates paid tribute to the building\'s unusual history by incorporating underground living areas into the new design, rather than ignoring or erasing the past.',
          antwoord_rubric: '1 punt: mention of underground living areas. 1 punt: correct description of paying homage to history.'
        },
        {
          nr: 7, opgave: 2, punten: 1, type: 'open',
          tekst_id: 't2', context: 'Text 2',
          vraag: 'What is the tone of text 2? Choose one: formal, informal, ironic, neutral. Justify your answer with a phrase from the text.',
          antwoord: 'Tone: neutral / informative. Justification: the text uses factual language, e.g. measurements ("26 feet", "65 feet"), without editorial comment.',
          antwoord_rubric: '1 punt: correct tone with appropriate justification from the text.'
        },
        {
          nr: 8, opgave: 2, punten: 2, type: 'open',
          tekst_id: 't2', context: 'Text 2',
          vraag: 'Why does the text describe the tunnelling as "illegal" and what happened as a result? Use your own words.',
          antwoord: 'The tunnels were dug without permission (illegally), which caused problems for local planners. As a result, Lyttle was evicted from the property in 2006.',
          antwoord_rubric: '1 punt: correct reason (no permission/illegal). 1 punt: correct consequence (eviction in 2006).'
        },

        // ── TEXT 3 — Charitable billionaires ────────────────────────────
        {
          nr: 9, opgave: 3, punten: 1, type: 'open',
          tekst_id: 't3', context: 'Text 3',
          vraag: 'What type of text is text 3? Choose from: news article, opinion piece (letter), scientific report, advertisement. Explain your choice.',
          antwoord: 'Text 3 is a letter to the editor / opinion piece. It is written in first person by a named individual, expresses a personal opinion, and is a response to an article.',
          antwoord_rubric: '1 punt: correct text type (letter / opinion piece) with valid explanation referencing text features.'
        },
        {
          nr: 10, opgave: 3, punten: 2, type: 'open',
          tekst_id: 't3', context: 'Text 3',
          vraag: 'What does the writer mean by "the hypocrisy of the 1 per cent"? Explain in your own words.',
          antwoord: 'The writer means that very wealthy people claim to be generous through pledges like the Giving Pledge, but at the same time they pay low wages and avoid paying taxes in countries where they make their profits.',
          antwoord_rubric: '1 punt: reference to low wages or tax avoidance. 1 punt: connection to hypocrisy of claiming generosity while doing so.'
        },
        {
          nr: 11, opgave: 3, punten: 2, type: 'open',
          tekst_id: 't3', context: 'Text 3',
          vraag: 'What solutions does the writer suggest to reduce inequality? Use your own words.',
          antwoord: 'The writer suggests introducing a financial transaction tax and enforcing tax collection regulations more strictly / rigorously.',
          antwoord_rubric: '1 punt per correct solution in own words (max 2).'
        },
        {
          nr: 12, opgave: 3, punten: 1, type: 'open',
          tekst_id: 't3', context: 'Text 3',
          vraag: 'What does the word "rigorously" (final paragraph) mean in this context?',
          antwoord: '"Rigorously" means strictly / thoroughly / in a careful and thorough way.',
          antwoord_rubric: '1 punt: correct meaning of "rigorously" in context.'
        },

        // ── TEXT 4 — Y\'all ──────────────────────────────────────────────
        {
          nr: 13, opgave: 4, punten: 2, type: 'open',
          tekst_id: 't4', context: 'Text 4',
          vraag: 'What lexical gap does "y\'all" fill in English, according to the author? Use your own words.',
          antwoord: 'English lacks a second-person plural pronoun — a word used to address more than one person at the same time (like "vous" in French or "ihr" in German). "Y\'all" fills this gap.',
          antwoord_rubric: '1 punt: correct identification of the gap (no second-person plural). 1 punt: explanation in own words.'
        },
        {
          nr: 14, opgave: 4, punten: 2, type: 'open',
          tekst_id: 't4', context: 'Text 4',
          vraag: 'What is the problem with "you guys" according to some people? Use your own words.',
          antwoord: 'Some people argue that "you guys" is a gendered term because "guys" originally referred to men. Using it for all people perpetuates a pattern where terms for "men" become generic.',
          antwoord_rubric: '1 punt: mention of gendered origin. 1 punt: explanation of the inclusivity problem.'
        },
        {
          nr: 15, opgave: 4, punten: 1, type: 'open',
          tekst_id: 't4', context: 'Text 4',
          vraag: 'Find a word in paragraph 3 that means "vocabulary / the words available to a language user".',
          antwoord: '"lexicon"',
          antwoord_rubric: '1 punt: "lexicon" (exact word from paragraph 3).'
        },
        {
          nr: 16, opgave: 4, punten: 2, type: 'open',
          tekst_id: 't4', context: 'Text 4',
          vraag: 'According to the author, why is social media important for the spread of "y\'all"? Use your own words.',
          antwoord: 'Social media breaks down geographic boundaries, allowing words used in one region to spread to other parts of the world. This has helped "y\'all", traditionally associated with the American South, become more widely used.',
          antwoord_rubric: '1 punt: breaking down geographic boundaries. 1 punt: consequence for spread of "y\'all".'
        },

        // ── TEXT 5 — This Charming Man ───────────────────────────────────
        {
          nr: 17, opgave: 5, punten: 2, type: 'open',
          tekst_id: 't5', context: 'Text 5',
          vraag: 'What impression does the narrator have of Christine? Support your answer with details from the text.',
          antwoord: 'The narrator sees Christine as extremely capable and accomplished. She has returned to work already, does everything "better and faster than everyone else", and is Head of Surgery at Dublin\'s most expensive hospital.',
          antwoord_rubric: '1 punt: correct impression (capable/accomplished). 1 punt: two supporting details from text.'
        },
        {
          nr: 18, opgave: 5, punten: 3, type: 'open',
          tekst_id: 't5', context: 'Text 5',
          vraag: 'What does the fragment reveal about the relationship between Grace (the narrator) and Damien? Use details from the text.',
          antwoord: 'Grace and Damien appear to be close and comfortable together — they make private jokes about Richard, they attend family visits together, and Damien\'s sarcastic remark about Augustina\'s "work-life balance" suggests they share a sense of humour.',
          antwoord_rubric: '1 punt: correct characterisation of relationship. 1 punt: relevant detail from text. 1 punt: clear explanation.'
        }

      ] // einde vragen
    }
  ] // einde en

}; // einde EXAMENS
