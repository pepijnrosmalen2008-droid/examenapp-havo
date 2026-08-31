// VWO Scheikunde - gouden-stijl contentspec. Vervangt de crude generatorvragen
// door authored bereken-/inzichtvragen met per-optie-uitleg + situaties.
const V = (domein, naam, intro, secties, concepten, vragen) => ({ niveau: 'vwo', vak: 'sk', domein, naam, intro, secties, concepten, vragen });

export default [
  V('A', 'Vaardigheden',
    `Bij de <strong>rekenvaardigheden</strong> werk je met de <strong>mol</strong> als eenheid van hoeveelheid stof. Met de <strong>molaire massa</strong> reken je tussen gram en mol, met de <strong>concentratie</strong> tussen mol en volume, en de <strong>coëfficiënten</strong> van een reactievergelijking geven de <strong>molverhouding</strong>.`,
    [
      { h: '1. Rekenen met mol', p: [
        `De <strong>mol</strong> is de eenheid voor hoeveelheid stof: één mol bevat <strong>6,022·10²³</strong> deeltjes (de <strong>constante van Avogadro</strong>). Met de <strong>molaire massa</strong> M (in g/mol) reken je tussen massa en aantal mol.`],
        formula: { label: 'Massa en mol', eq: 'm = n · M   ⟺   n = m / M', note: 'n = aantal mol, m = massa (g), M = molaire massa (g/mol).' },
        worked: { q: 'Hoeveel mol is 36 g water? (M = 18 g/mol)', steps: ['Gebruik n = m / M', 'n = 36 / 18 = 2 mol'], ans: '2 mol' } },
      { h: '2. Concentratie', p: [
        `De <strong>concentratie</strong> geeft het aantal mol opgeloste stof per liter oplossing, in mol/L.`],
        formula: { label: 'Concentratie', eq: 'c = n / V', note: 'c in mol/L, n in mol, V in liter.' },
        worked: { q: 'Wat is de concentratie van 0,2 mol in 0,5 L?', steps: ['Gebruik c = n / V', 'c = 0,2 / 0,5 = 0,4 mol/L'], ans: '0,4 mol/L' } },
      { h: '3. Molverhouding en behoud van massa', p: [
        `De <strong>coëfficiënten</strong> in een kloppende reactievergelijking geven de <strong>molverhouding</strong>. In 2 H₂ + O₂ → 2 H₂O reageert waterstof en zuurstof in de verhouding 2 : 1. Volgens de <strong>wet van behoud van massa</strong> (Lavoisier) blijft de totale massa in een afgesloten systeem gelijk: atomen worden alleen herschikt.`] },
      { h: '4. Veilig werken', p: [
        `<strong>GHS-pictogrammen</strong> waarschuwen voor gevaar: een vlam betekent brandbaar, een doodshoofd giftig. Een sterk zuur verdun je door het <strong>zuur voorzichtig bij het water</strong> te gieten (nooit andersom), zodat de vrijkomende warmte zich veilig verdeelt.`] },
    ],
    [
      { t: 'Mol', d: 'de eenheid voor hoeveelheid stof; één mol bevat 6,022·10²³ deeltjes', k: 'eenheid voor hoeveelheid stof', fout: ['Molaire massa', 'Concentratie'] },
      { t: 'Constante van Avogadro', d: 'het aantal deeltjes in één mol: 6,022·10²³ per mol', k: '6,022·10²³ deeltjes per mol', fout: ['Mol'] },
      { t: 'Molaire massa', d: 'de massa van één mol van een stof, in gram per mol', k: 'massa van één mol in g/mol', fout: ['Mol', 'Molverhouding'] },
      { t: 'Concentratie', d: 'de hoeveelheid opgeloste stof per liter oplossing, in mol/L', k: 'mol opgeloste stof per liter', fout: ['Molaire massa'] },
      { t: 'Molverhouding', d: 'de verhouding tussen de aantallen mol, af te lezen uit de coëfficiënten', k: 'verhouding uit de coëfficiënten', fout: ['Molaire massa'] },
      { t: 'Significante cijfers', d: 'de betekenisvolle cijfers in een meetwaarde', k: 'betekenisvolle cijfers', fout: ['Molaire massa'] },
      { t: 'Wet van behoud van massa', d: 'in een afgesloten reactie blijft de totale massa gelijk', k: 'massa blijft behouden', fout: ['Molverhouding'] },
      { t: 'GHS-pictogram', d: 'een symbool dat waarschuwt voor het gevaar van een stof', k: 'waarschuwt voor gevaar', fout: ['Significante cijfers'] },
    ],
    [
      { v: 'Hoeveel deeltjes zitten er in 1 mol?', o: ['6,022·10²³', '3,00·10⁸', '9,81', '1,60·10⁻¹⁹'], c: 0, d: 1, uo: ['Klopt: de constante van Avogadro, 6,022·10²³ deeltjes per mol.', 'Nee, 3,00·10⁸ m/s is de lichtsnelheid.', 'Nee, 9,81 m/s² is de valversnelling g.', 'Nee, 1,60·10⁻¹⁹ C is de elementaire lading.'], uh: '1 mol = 6,022·10²³ deeltjes (constante van Avogadro).' },
      { v: 'Hoe bereken je de massa m uit het aantal mol n en de molaire massa M?', o: ['m = n / M', 'm = n · M', 'm = M / n', 'm = n + M'], c: 1, d: 2, uo: ['Nee, delen door M klopt niet met de eenheden.', 'Klopt: m = n · M (mol × g/mol = gram).', 'Nee, dat is omgekeerd.', 'Nee, optellen kan niet, de eenheden verschillen.'], uh: 'm = n · M, en dus n = m / M.' },
      { v: 'In 2 H₂ + O₂ → 2 H₂O is de molverhouding H₂ : O₂ gelijk aan', o: ['1 : 1', '2 : 1', '1 : 2', '2 : 2'], c: 1, d: 2, uo: ['Nee, de coëfficiënten zijn niet gelijk.', 'Klopt: de coëfficiënten 2 en 1 geven 2 : 1.', 'Nee, dat is de omgekeerde verhouding.', 'Nee, 2 : 2 vereenvoudig je tot 1 : 1.'], uh: 'De coëfficiënten geven de molverhouding.' },
      { v: 'Wat is de molaire massa van water H₂O? (H = 1, O = 16)', o: ['16 g/mol', '18 g/mol', '17 g/mol', '20 g/mol'], c: 1, d: 2, uo: ['Nee, dat is alleen de zuurstof; de twee H tellen ook mee.', 'Klopt: 2·1 + 16 = 18 g/mol.', 'Nee, je telde maar één H mee.', 'Nee, 2·1 + 16 = 18, niet 20.'], uh: 'Molaire massa = som van de atoommassa\'s.' },
      { v: 'Hoeveel mol is 36 g water? (M = 18 g/mol)', o: ['1 mol', '2 mol', '0,5 mol', '18 mol'], c: 1, d: 2, uo: ['Nee, 1 mol zou 18 g zijn.', 'Klopt: n = m/M = 36/18 = 2 mol.', 'Nee, 0,5 mol is 9 g.', 'Nee, 18 is de molaire massa, niet het aantal mol.'], uh: 'n = m / M.' },
      { v: 'Welk gevaar hoort bij het GHS-pictogram met een vlam?', o: ['giftig', 'bijtend', 'brandbaar', 'oxiderend'], c: 2, d: 1, uo: ['Nee, giftig heeft een doodshoofd.', 'Nee, bijtend toont aantasting van hand en materiaal.', 'Klopt: de vlam staat voor brandbaar/ontvlambaar.', 'Nee, oxiderend toont een vlam boven een cirkel.'], uh: 'Vlam-pictogram betekent brandbaar.' },
      { v: 'Waarom draag je een veiligheidsbril tijdens practicum?', o: ['om beter te zien', 'om je ogen te beschermen tegen spatten', 'tegen het geluid', 'voor de sfeer'], c: 1, d: 1, uo: ['Nee, het is geen leesbril.', 'Klopt: hij beschermt je ogen tegen wegspattende stoffen.', 'Nee, geluid speelt geen rol.', 'Nee, veiligheid is de reden.'], uh: 'Bescherming tegen spatten.' },
      { v: 'Hoe verdun je een sterk zuur veilig?', o: ['giet water bij het zuur', 'giet het zuur voorzichtig bij het water', 'het maakt niet uit', 'verwarm het eerst'], c: 1, d: 2, uo: ['Nee, water bij zuur kan gevaarlijk opspatten door de warmte.', 'Klopt: zuur voorzichtig bij het water, zo verdeelt de warmte zich veilig.', 'Nee, de volgorde is wel degelijk belangrijk.', 'Nee, verwarmen maakt het juist gevaarlijker.'], uh: 'Zuur bij water, nooit water bij zuur.' },
      { v: 'Hoe bereken je de concentratie in mol/L?', o: ['mol × liter', 'mol / liter', 'liter / mol', 'gram / liter'], c: 1, d: 1, uo: ['Nee, vermenigvuldigen geeft niet de eenheid mol/L.', 'Klopt: c = n / V, mol per liter.', 'Nee, dat is omgekeerd.', 'Nee, gram/liter is een massaconcentratie, niet in mol.'], uh: 'c = n / V, in mol/L.' },
      { v: 'Welke wet zegt dat de totale massa in een afgesloten reactie gelijk blijft?', o: ['de wet van Avogadro', 'de wet van behoud van massa', 'de wet van Boyle', 'de wet van Ohm'], c: 1, d: 2, uo: ['Nee, Avogadro gaat over gelijke gasvolumes met gelijke aantallen deeltjes.', 'Klopt: de wet van behoud van massa (Lavoisier).', 'Nee, Boyle gaat over druk en volume van een gas.', 'Nee, Ohm hoort bij elektriciteit.'], uh: 'Massa vooraf = massa achteraf.' },
      { v: 'Hoeveel gram is 0,5 mol NaCl? (M = 58,5 g/mol)', o: ['29,25 g', '117 g', '58,5 g', '11,7 g'], c: 0, d: 2, uo: ['Klopt: m = n·M = 0,5·58,5 = 29,25 g.', 'Nee, 117 g is 2 mol.', 'Nee, 58,5 g is 1 mol.', 'Nee, reken 0,5·58,5.'], uh: 'm = n · M.' },
      { v: 'Hoeveel deeltjes zitten er in 2 mol?', o: ['1,2·10²⁴', '6,0·10²³', '3,0·10²³', '2·10²³'], c: 0, d: 2, uo: ['Klopt: 2·6,022·10²³ ≈ 1,2·10²⁴.', 'Nee, dat is 1 mol.', 'Nee, dat is 0,5 mol.', 'Nee, veel te weinig.'], uh: 'aantal deeltjes = n · 6,022·10²³.' },
      { v: 'Wat is de concentratie als je 0,2 mol oplost in 0,5 L?', o: ['0,1 mol/L', '0,4 mol/L', '2,5 mol/L', '1,0 mol/L'], c: 1, d: 2, uo: ['Nee, dat is n maal V.', 'Klopt: c = n/V = 0,2/0,5 = 0,4 mol/L.', 'Nee, dat is V/n.', 'Nee, reken 0,2/0,5.'], uh: 'c = n / V.' },
      { v: 'Hoeveel significante cijfers heeft 0,0450?', o: ['2', '3', '4', '5'], c: 1, d: 3, uo: ['Nee, de nul achteraan telt ook mee.', 'Klopt: 4, 5 en de nul erachter zijn significant; de voorloopnullen niet, dus 3.', 'Nee, voorloopnullen tellen niet mee.', 'Nee, er zijn er drie significant.'], uh: 'Voorloopnullen tellen niet, nullen achter een cijfer wel.' },
      { v: 'In N₂ + 3 H₂ → 2 NH₃ reageert met 1 mol N₂ hoeveel mol H₂?', o: ['1 mol', '2 mol', '3 mol', '6 mol'], c: 2, d: 2, uo: ['Nee, kijk naar de coëfficiënt van H₂.', 'Nee, 2 is de coëfficiënt van NH₃.', 'Klopt: de coëfficiënt van H₂ is 3, dus 3 mol.', 'Nee, dat is dubbel geteld.'], uh: 'De molverhouding volgt uit de coëfficiënten.' },
    ]),
];
