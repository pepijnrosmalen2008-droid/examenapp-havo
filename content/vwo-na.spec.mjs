// VWO Natuurkunde - gouden-stijl contentspec. Vervangt de crude generatorvragen
// door authored bereken-/inzichtvragen met per-optie-uitleg + situaties.
const V = (domein, naam, intro, secties, concepten, vragen) => ({ niveau: 'vwo', vak: 'na', domein, naam, intro, secties, concepten, vragen });

export default [
  V('A', 'Vaardigheden',
    `Bij de <strong>natuurkundige vaardigheden</strong> werk je met <strong>significante cijfers</strong>, reken je tussen <strong>eenheden</strong> en lees je <strong>grafieken</strong>: de helling van een <em>(x,t)</em>-grafiek geeft de snelheid, de oppervlakte onder een <em>(v,t)</em>-grafiek de afgelegde afstand.`,
    [
      { h: '1. Rekenen en eenheden', p: [
        `Werk met <strong>significante cijfers</strong>: voorloopnullen tellen niet mee, nullen achter een cijfer wel. Reken tussen eenheden: van <strong>km/h naar m/s</strong> deel je door 3,6, andersom maal 3,6. Kracht meet je in <strong>newton</strong> (N), energie in <strong>joule</strong> (J = N·m) en vermogen in <strong>watt</strong> (W = J/s).`],
        formula: { label: 'Snelheid omrekenen', eq: 'v(m/s) = v(km/h) / 3,6', note: 'Bijvoorbeeld 72 km/h = 72 / 3,6 = 20 m/s.' } },
      { h: '2. Grafieken en verbanden', p: [
        `In een <strong>(x,t)-diagram</strong> is de <strong>helling</strong> de snelheid. In een <strong>(v,t)-diagram</strong> is de helling de versnelling en de <strong>oppervlakte</strong> eronder de afgelegde afstand. Een <strong>recht evenredig</strong> verband geeft een rechte lijn door de oorsprong, een <strong>omgekeerd evenredig</strong> verband een hyperbool.`] },
      { h: '3. Meten en modelleren', p: [
        `De <strong>meetonzekerheid</strong> verklein je door vaker te meten en te middelen. Bij een <strong>numeriek model</strong> bereken je de beweging stap voor stap in kleine tijdstapjes.`] },
    ],
    [
      { t: 'Significante cijfers', d: 'de betekenisvolle cijfers in een meetwaarde', k: 'betekenisvolle cijfers', fout: ['Meetonzekerheid'] },
      { t: 'Snelheid', d: 'de afgelegde afstand per tijd; de helling van een (x,t)-grafiek', k: 'helling van (x,t)', fout: ['Versnelling'] },
      { t: 'Versnelling', d: 'de verandering van snelheid per tijd; de helling van een (v,t)-grafiek', k: 'helling van (v,t)', fout: ['Snelheid'] },
      { t: '(x,t)-diagram', d: 'grafiek van de plaats tegen de tijd; de helling is de snelheid', k: 'helling is de snelheid', fout: ['(v,t)-diagram'] },
      { t: '(v,t)-diagram', d: 'grafiek van de snelheid tegen de tijd; de oppervlakte is de afstand', k: 'oppervlakte is de afstand', fout: ['(x,t)-diagram'] },
      { t: 'Recht evenredig verband', d: 'een verband met een rechte lijn door de oorsprong', k: 'rechte lijn door de oorsprong', fout: ['Omgekeerd evenredig verband'] },
      { t: 'Omgekeerd evenredig verband', d: 'een verband met een hyperbool: y wordt kleiner als x groter wordt', k: 'hyperbool, y = a/x', fout: ['Recht evenredig verband'] },
      { t: 'Meetonzekerheid', d: 'de marge waarbinnen de echte waarde ligt, kleiner door vaker te meten', k: 'marge rond de meetwaarde', fout: ['Significante cijfers'] },
      { t: 'Newton', d: 'de SI-eenheid van kracht (N)', k: 'eenheid van kracht', fout: ['Watt'] },
      { t: 'Watt', d: 'de SI-eenheid van vermogen (W = J/s)', k: 'eenheid van vermogen', fout: ['Newton'] },
      { t: 'Numeriek model', d: 'een berekening van de beweging in kleine tijdstapjes', k: 'rekenen in kleine tijdstapjes', fout: ['(v,t)-diagram'] },
    ],
    [
      { v: 'Hoeveel significante cijfers heeft 0,04070?', o: ['3', '4', '5', '6'], c: 1, d: 3, uo: ['Nee, de nul aan het eind telt ook mee.', 'Klopt: 4, 0, 7 en de nul erachter zijn significant, dus 4.', 'Nee, de voorloopnullen tellen niet mee.', 'Nee, dat is te veel.'], uh: 'Voorloopnullen tellen niet, nullen achter een cijfer wel.' },
      { v: 'Wat geeft de helling van een (x,t)-grafiek?', o: ['de versnelling', 'de snelheid', 'de afstand', 'de kracht'], c: 1, d: 2, uo: ['Nee, de versnelling lees je uit een (v,t)-grafiek.', 'Klopt: de helling van een (x,t)-grafiek is de snelheid.', 'Nee, de afstand lees je op de as af.', 'Nee, de kracht staat er niet in.'], uh: '(x,t): helling = snelheid.' },
      { v: 'Wat geeft de oppervlakte onder een (v,t)-grafiek?', o: ['de versnelling', 'de afgelegde afstand', 'de snelheid', 'de tijd'], c: 1, d: 2, uo: ['Nee, de versnelling is de helling van (v,t).', 'Klopt: de oppervlakte onder (v,t) is de afgelegde afstand.', 'Nee, de snelheid lees je op de as af.', 'Nee, de tijd staat op de as.'], uh: '(v,t): oppervlak = afstand, helling = versnelling.' },
      { v: 'Reken om: 72 km/h naar m/s.', o: ['20 m/s', '72 m/s', '7,2 m/s', '200 m/s'], c: 0, d: 2, uo: ['Klopt: deel door 3,6: 72 / 3,6 = 20 m/s.', 'Nee, dat is nog km/h.', 'Nee, je deelt door 3,6, niet door 10.', 'Nee, veel te groot.'], uh: 'km/h → m/s: deel door 3,6.' },
      { v: 'Een grootheid met eenheid N·m is...', o: ['snelheid', 'arbeid of energie', 'vermogen', 'kracht'], c: 1, d: 2, uo: ['Nee, snelheid is m/s.', 'Klopt: N·m = joule = arbeid/energie.', 'Nee, vermogen is watt (J/s).', 'Nee, kracht is de newton zelf.'], uh: 'N·m = J (arbeid/energie).' },
      { v: 'Bij een recht evenredig verband is de grafiek...', o: ['een rechte lijn door de oorsprong', 'een parabool', 'een hyperbool', 'horizontaal'], c: 0, d: 2, uo: ['Klopt: recht evenredig geeft een rechte lijn door de oorsprong.', 'Nee, een parabool hoort bij een kwadratisch verband.', 'Nee, een hyperbool hoort bij omgekeerd evenredig.', 'Nee, horizontaal betekent constant.'], uh: 'Recht evenredig: rechte lijn door (0,0).' },
      { v: 'Hoe verklein je de meetonzekerheid?', o: ['één keer meten', 'vaker meten en middelen', 'sneller werken', 'afronden'], c: 1, d: 2, uo: ['Nee, één meting geeft juist meer onzekerheid.', 'Klopt: vaker meten en middelen verkleint de onzekerheid.', 'Nee, sneller werken helpt niet.', 'Nee, afronden verandert de onzekerheid niet.'], uh: 'Vaker meten en middelen.' },
      { v: 'Wat is de SI-eenheid van kracht?', o: ['de joule', 'de newton', 'de watt', 'de pascal'], c: 1, d: 1, uo: ['Nee, de joule is energie.', 'Klopt: kracht meet je in newton (N).', 'Nee, de watt is vermogen.', 'Nee, de pascal is druk.'], uh: 'Kracht → newton (N).' },
      { v: 'Hoe reken je bij een numeriek model de beweging uit?', o: ['in één stap', 'in kleine tijdstapjes', 'in omgekeerde volgorde', 'via de oppervlakte'], c: 1, d: 3, uo: ['Nee, juist niet in één keer.', 'Klopt: je berekent de beweging stap voor stap in kleine tijdstapjes.', 'Nee, niet omgekeerd.', 'Nee, dat is een andere methode.'], uh: 'Numeriek model: kleine tijdstapjes.' },
      { v: 'Rond 0,03456 af op 2 significante cijfers.', o: ['0,035', '0,03', '0,0346', '0,35'], c: 0, d: 3, uo: ['Klopt: twee significante cijfers geeft 0,035.', 'Nee, 0,03 heeft maar één significant cijfer.', 'Nee, dat zijn er drie.', 'Nee, de komma staat verkeerd.'], uh: '0,03456 → 0,035 (2 significante cijfers).' },
      { v: 'Wat is de eenheid van vermogen?', o: ['de newton', 'de joule', 'de watt', 'de pascal'], c: 2, d: 1, uo: ['Nee, de newton is kracht.', 'Nee, de joule is energie.', 'Klopt: vermogen meet je in watt (J/s).', 'Nee, de pascal is druk.'], uh: 'Vermogen → watt (W = J/s).' },
      { v: 'Bij een omgekeerd evenredig verband is de grafiek...', o: ['een rechte lijn door de oorsprong', 'een parabool', 'een hyperbool', 'horizontaal'], c: 2, d: 3, uo: ['Nee, dat is recht evenredig.', 'Nee, een parabool hoort bij een kwadratisch verband.', 'Klopt: omgekeerd evenredig geeft een hyperbool.', 'Nee, horizontaal betekent constant.'], uh: 'Omgekeerd evenredig: hyperbool (y = a/x).' },
      { v: 'Reken om: 5 m/s naar km/h.', o: ['18 km/h', '5 km/h', '1,4 km/h', '50 km/h'], c: 0, d: 2, uo: ['Klopt: maal 3,6: 5 · 3,6 = 18 km/h.', 'Nee, dat is nog m/s.', 'Nee, je vermenigvuldigt met 3,6, niet delen.', 'Nee, te groot.'], uh: 'm/s → km/h: maal 3,6.' },
    ]),
];
