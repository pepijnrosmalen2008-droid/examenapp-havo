// VMBO GL/TL - Wiskunde. Gouden-stijl contentspec met formuleboxen,
// uitgewerkte voorbeelden en reken-/inzichtvragen met per-optie-uitleg.
const V = (domein, naam, intro, secties, concepten, vragen) => ({ niveau: 'vmbo', vak: 'wi', domein, naam, intro, secties, concepten, vragen });

export default [
  V('A', 'Algebraïsche verbanden',
    `Je lost <strong>vergelijkingen</strong> op door aan beide kanten hetzelfde te doen, en je werkt met de <strong>lineaire formule</strong> <em>y = ax + b</em>, waarin <em>a</em> de helling is en <em>b</em> het snijpunt met de y-as.`,
    [
      { h: '1. Vergelijkingen oplossen', p: [
        `Een <strong>vergelijking</strong> los je op door links en rechts dezelfde bewerking te doen, tot <em>x</em> alleen staat. Staat er <em>3x = 12</em>, dan deel je beide kanten door 3: <em>x = 4</em>. Staat er <em>x + 5 = 12</em>, dan haal je 5 aan beide kanten weg: <em>x = 7</em>.`],
        formula: { label: 'Vergelijking oplossen', eq: 'Doe links en rechts hetzelfde tot x alleen staat', note: 'Bijvoorbeeld: 2x + 4 = 10 → 2x = 6 → x = 3.' },
        worked: { q: 'Los op: 2x + 4 = 10', steps: ['Haal 4 aan beide kanten weg: 2x = 6', 'Deel beide kanten door 2: x = 3'], ans: 'x = 3' } },
      { h: '2. De lineaire formule y = ax + b', p: [
        `In <em>y = ax + b</em> is <em>a</em> de <strong>richtingscoëfficiënt</strong> (de helling: hoeveel y stijgt per stap x) en <em>b</em> het <strong>startgetal</strong> (het snijpunt met de y-as). Vul je een x-waarde in, dan reken je y uit. Bij <em>y = 2x + 1</em> en <em>x = 3</em> geldt <em>y = 2·3 + 1 = 7</em>.`],
        formula: { label: 'Lineair verband', eq: 'y = a·x + b', note: 'a = helling (richtingscoëfficiënt), b = snijpunt met de y-as.' } },
    ],
    [
      { t: 'Vergelijking', d: 'een gelijkheid met een onbekende die je oplost', k: 'oplossen naar x', fout: ['Formule'] },
      { t: 'Richtingscoëfficiënt', d: 'de helling a in y = ax + b', k: 'de helling a', fout: ['Startgetal'] },
      { t: 'Startgetal', d: 'het getal b in y = ax + b: het snijpunt met de y-as', k: 'snijpunt y-as (b)', fout: ['Richtingscoëfficiënt'] },
      { t: 'Lineair verband', d: 'een verband met een rechte lijn: y = ax + b', k: 'rechte lijn', fout: ['Vergelijking'] },
      { t: 'Variabele', d: 'een letter die voor een getal staat, zoals x', k: 'letter voor een getal', fout: ['Vergelijking'] },
      { t: 'Substitueren', d: 'een getal invullen op de plaats van een letter', k: 'getal invullen', fout: ['Variabele'] },
      { t: 'Coëfficiënt', d: 'het getal voor een letter, zoals de 3 in 3x', k: 'getal voor de letter', fout: ['Richtingscoëfficiënt'] },
      { t: 'Oplossing', d: 'de waarde van x die de vergelijking klopt maakt', k: 'de waarde van x', fout: ['Vergelijking'] },
    ],
    [
      { v: 'Los op: 3x = 12', o: ['x = 3', 'x = 4', 'x = 9', 'x = 36'], c: 1, d: 1, uo: ['Bij x = 3 is 3·3 = 9, niet 12.', 'Klopt: deel beide kanten door 3: x = 4.', 'x = 9 zou 3·9 = 27 geven.', 'x = 36 is 12·3, de verkeerde bewerking.'], uh: 'Bij ax = b deel je beide kanten door a.' },
      { v: 'Los op: x + 5 = 12', o: ['x = 5', 'x = 7', 'x = 17', 'x = 60'], c: 1, d: 1, uo: ['x = 5 geeft 5 + 5 = 10.', 'Klopt: haal 5 weg aan beide kanten: x = 7.', 'x = 17 is 12 + 5, de verkeerde kant op.', 'x = 60 is 12·5, dat hoort hier niet.'] },
      { v: 'Bereken 2x + 3 als x = 4.', o: ['9', '11', '14', '24'], c: 1, d: 2, uo: ['9 zou 2·3 zijn, verkeerde x.', 'Klopt: 2·4 + 3 = 8 + 3 = 11.', '14 telt er te veel bij op.', '24 is 2·(4+3)·..., de verkeerde volgorde.'], uh: 'Vul x in en reken uit: eerst maal, dan plus.' },
      { v: 'In y = 2x + 1, wat is y als x = 3?', o: ['5', '6', '7', '9'], c: 2, d: 2, uo: ['5 zou 2·2 + 1 zijn.', '6 vergeet de + 1 of rekent 2·3.', 'Klopt: 2·3 + 1 = 7.', '9 telt te veel op.'] },
      { v: 'Los op: 5x = 20', o: ['x = 4', 'x = 5', 'x = 15', 'x = 100'], c: 0, d: 1, uo: ['Klopt: deel beide kanten door 5: x = 4.', 'x = 5 geeft 5·5 = 25.', 'x = 15 is 20 - 5, verkeerde bewerking.', 'x = 100 is 20·5, ook fout.'] },
      { v: 'Wat is de richtingscoëfficiënt in y = 3x + 2?', o: ['2', '3', '5', '1'], c: 1, d: 2, uo: ['2 is het startgetal b, niet de helling.', 'Klopt: a = 3 is de richtingscoëfficiënt (helling).', '5 is 3 + 2, geen van beide.', '1 komt niet in de formule voor.'], uh: 'In y = ax + b is a de helling en b het startgetal.' },
      { v: 'Los op: x - 4 = 10', o: ['x = 6', 'x = 14', 'x = 40', 'x = -6'], c: 1, d: 2, uo: ['x = 6 geeft 6 - 4 = 2.', 'Klopt: tel 4 op aan beide kanten: x = 14.', 'x = 40 is 10·4, verkeerd.', 'x = -6 is de verkeerde kant op.'] },
      { v: 'Los op: 2x + 4 = 10', o: ['x = 2', 'x = 3', 'x = 5', 'x = 7'], c: 1, d: 2, uo: ['x = 2 geeft 2·2 + 4 = 8.', 'Klopt: 2x = 6, dus x = 3.', 'x = 5 geeft 14.', 'x = 7 is veel te groot.'] },
      { v: 'Wat betekent b in y = ax + b?', o: ['de helling', 'het snijpunt met de y-as', 'de x-waarde', 'de oppervlakte'], c: 1, d: 2, uo: ['De helling is a, niet b.', 'Klopt: b is het startgetal, het snijpunt met de y-as.', 'b is geen x-waarde.', 'Oppervlakte hoort hier niet bij.'] },
    ]),

  V('B', 'Rekenen, meten en schatten',
    `Je rekent met <strong>procenten</strong>, <strong>verhoudingen</strong> en <strong>eenheden</strong>. Een procent is een deel per honderd: <em>10% van 200 = 20</em>.`,
    [
      { h: '1. Procenten', p: [
        `Een <strong>procent</strong> is een deel per honderd. Je rekent een percentage van een getal uit door te delen door 100 en te vermenigvuldigen. <em>25% van 80 = 80 : 100 · 25 = 20</em>.`],
        formula: { label: 'Percentage van een getal', eq: 'deel = getal : 100 · percentage', note: '25% van 80 = 80 : 100 · 25 = 20.' },
        worked: { q: 'Hoeveel is 20% van 50?', steps: ['Deel door 100: 50 : 100 = 0,5', 'Maal het percentage: 0,5 · 20 = 10'], ans: '10' } },
      { h: '2. Eenheden en verhoudingen', p: [
        `Bij <strong>eenheden</strong> onthoud je: 1 meter = 100 cm, 1 kg = 1000 gram, 1 uur = 60 minuten. Een <strong>verhouding</strong> als 1 : 2 betekent: op elke 1 hoort 2. Bij een <strong>machtsverheffing</strong> is <em>3² = 3 · 3 = 9</em>.`],
        formula: { label: 'Kwadraat', eq: 'a² = a · a', note: 'Bijvoorbeeld 3² = 3 · 3 = 9.' } },
    ],
    [
      { t: 'Procent', d: 'een deel per honderd', k: 'deel per honderd', fout: ['Verhouding'] },
      { t: 'Verhouding', d: 'de relatie tussen twee aantallen, zoals 1 : 2', k: 'relatie tussen aantallen', fout: ['Procent'] },
      { t: 'Kwadraat', d: 'een getal maal zichzelf: a² = a · a', k: 'getal maal zichzelf', fout: ['Verhouding'] },
      { t: 'Afronden', d: 'een getal vervangen door een handig, dichtbij getal', k: 'op een net getal', fout: ['Schatten'] },
      { t: 'Schatten', d: 'een antwoord bij benadering bepalen', k: 'bij benadering', fout: ['Afronden'] },
      { t: 'Meter', d: 'eenheid van lengte; 1 meter is 100 cm', k: '1 m = 100 cm', fout: ['Kilogram'] },
      { t: 'Kilogram', d: 'eenheid van massa; 1 kg is 1000 gram', k: '1 kg = 1000 g', fout: ['Meter'] },
      { t: 'Percentage', d: 'een deel uitgedrukt in honderdsten', k: 'deel in honderdsten', fout: ['Procent'] },
    ],
    [
      { v: 'Hoeveel is 10% van 200?', o: ['10', '20', '2', '100'], c: 1, d: 1, uo: ['10 is 5% van 200.', 'Klopt: 200 : 100 · 10 = 20.', '2 is 1% van 200.', '100 is de helft (50%).'], uh: 'Percentage van een getal: getal : 100 · percentage.' },
      { v: 'Hoeveel is 25% van 80?', o: ['16', '20', '25', '40'], c: 1, d: 2, uo: ['16 is 20% van 80.', 'Klopt: 80 : 100 · 25 = 20 (een kwart).', '25 is het percentage, niet het antwoord.', '40 is de helft (50%).'] },
      { v: 'Hoeveel cm is 1 meter?', o: ['10', '100', '1000', '1'], c: 1, d: 1, uo: ['10 cm is een decimeter.', 'Klopt: 1 meter is 100 cm.', '1000 cm is 10 meter.', '1 cm is veel te weinig.'], uh: '1 m = 100 cm, 1 kg = 1000 g, 1 uur = 60 min.' },
      { v: 'Hoeveel is 50% van 60?', o: ['6', '30', '50', '120'], c: 1, d: 1, uo: ['6 is 10% van 60.', 'Klopt: 50% is de helft: 30.', '50 is het percentage, niet het antwoord.', '120 is het dubbele.'] },
      { v: 'Hoeveel gram is 1 kilogram?', o: ['100', '1000', '10', '10000'], c: 1, d: 1, uo: ['100 gram is een ons.', 'Klopt: 1 kg is 1000 gram.', '10 gram is heel weinig.', '10000 gram is 10 kg.'] },
      { v: 'Hoeveel is 3² (3 kwadraat)?', o: ['6', '9', '5', '8'], c: 1, d: 2, uo: ['6 is 3 · 2, geen kwadraat.', 'Klopt: 3² = 3 · 3 = 9.', '5 is 3 + 2.', '8 is 2³, niet 3².'], uh: 'a² betekent a maal zichzelf.' },
      { v: 'Rond 3,7 af op een heel getal.', o: ['3', '4', '3,5', '40'], c: 1, d: 1, uo: ['3 rondt naar beneden af; 3,7 ligt dichter bij 4.', 'Klopt: 3,7 rondt af naar 4.', '3,5 is geen heel getal.', '40 is 3,7 maal 10-ish, fout.'] },
      { v: 'Hoeveel minuten zitten er in 2 uur?', o: ['60', '120', '20', '200'], c: 1, d: 1, uo: ['60 minuten is 1 uur.', 'Klopt: 2 · 60 = 120 minuten.', '20 is veel te weinig.', '200 klopt niet met 60 per uur.'] },
    ]),

  V('C', 'Meetkunde',
    `In de <strong>meetkunde</strong> reken je met <strong>oppervlakte</strong>, <strong>omtrek</strong>, <strong>hoeken</strong> en de <strong>stelling van Pythagoras</strong>.`,
    [
      { h: '1. Oppervlakte en omtrek', p: [
        `De <strong>oppervlakte</strong> van een rechthoek is <em>lengte · breedte</em>; de <strong>omtrek</strong> is de lengte van de rand: <em>2 · (lengte + breedte)</em>. De oppervlakte van een <strong>driehoek</strong> is <em>½ · basis · hoogte</em>.`],
        formula: { label: 'Rechthoek en driehoek', eq: 'A(rechthoek) = l · b   ·   A(driehoek) = ½ · b · h', note: 'Omtrek rechthoek = 2 · (l + b).' },
        worked: { q: 'Oppervlakte van een driehoek met basis 6 en hoogte 4', steps: ['Gebruik ½ · basis · hoogte', '½ · 6 · 4 = 12'], ans: '12' } },
      { h: '2. Hoeken en Pythagoras', p: [
        `Een <strong>rechte hoek</strong> is 90°, een <strong>gestrekte hoek</strong> 180°. De hoeken van een driehoek zijn samen 180°. In een <strong>rechthoekige driehoek</strong> geldt de <strong>stelling van Pythagoras</strong>: <em>a² + b² = c²</em>, met c de langste zijde (schuine zijde).`],
        formula: { label: 'Stelling van Pythagoras', eq: 'a² + b² = c²', note: 'c is de schuine zijde. Bij a = 3 en b = 4: c = √(9 + 16) = 5.' } },
    ],
    [
      { t: 'Oppervlakte', d: 'de grootte van een vlak: lengte maal breedte', k: 'l · b', fout: ['Omtrek'] },
      { t: 'Omtrek', d: 'de lengte van de rand rondom een figuur', k: 'lengte van de rand', fout: ['Oppervlakte'] },
      { t: 'Rechte hoek', d: 'een hoek van 90 graden', k: '90 graden', fout: ['Gestrekte hoek'] },
      { t: 'Gestrekte hoek', d: 'een hoek van 180 graden', k: '180 graden', fout: ['Rechte hoek'] },
      { t: 'Stelling van Pythagoras', d: 'a² + b² = c² in een rechthoekige driehoek', k: 'a² + b² = c²', fout: ['Oppervlakte'] },
      { t: 'Schuine zijde', d: 'de langste zijde (c) tegenover de rechte hoek', k: 'langste zijde c', fout: ['Rechte hoek'] },
      { t: 'Volume', d: 'de inhoud van een lichaam: lengte · breedte · hoogte', k: 'l · b · h', fout: ['Oppervlakte'] },
      { t: 'Hoek', d: 'de opening tussen twee lijnen, gemeten in graden', k: 'opening in graden', fout: ['Rechte hoek'] },
    ],
    [
      { v: 'Oppervlakte van een rechthoek van 4 bij 5?', o: ['9', '20', '18', '40'], c: 1, d: 1, uo: ['9 is 4 + 5, dat is geen oppervlakte.', 'Klopt: lengte · breedte = 4 · 5 = 20.', '18 is de omtrek, niet de oppervlakte.', '40 is het dubbele, fout.'], uh: 'Oppervlakte rechthoek = lengte · breedte.' },
      { v: 'Omtrek van een vierkant met zijde 3?', o: ['9', '12', '6', '3'], c: 1, d: 1, uo: ['9 is 3² (de oppervlakte).', 'Klopt: 4 zijden van 3: 4 · 3 = 12.', '6 is maar twee zijden.', '3 is één zijde.'], uh: 'Omtrek = som van alle zijden.' },
      { v: 'Hoeveel graden is een rechte hoek?', o: ['45', '90', '180', '360'], c: 1, d: 1, uo: ['45° is een halve rechte hoek.', 'Klopt: een rechte hoek is 90°.', '180° is een gestrekte hoek.', '360° is een volledige draai.'], uh: 'Recht 90°, gestrekt 180°, volle draai 360°.' },
      { v: 'Oppervlakte van een vierkant met zijde 6?', o: ['12', '36', '24', '6'], c: 1, d: 2, uo: ['12 is 6 + 6.', 'Klopt: zijde · zijde = 6 · 6 = 36.', '24 is de omtrek.', '6 is één zijde.'] },
      { v: 'De hoeken van een driehoek zijn samen...', o: ['90°', '180°', '270°', '360°'], c: 1, d: 2, uo: ['90° is één rechte hoek.', 'Klopt: de hoeken van een driehoek zijn samen 180°.', '270° klopt niet.', '360° geldt voor een vierhoek.'] },
      { v: 'Oppervlakte van een driehoek met basis 6 en hoogte 4?', o: ['24', '12', '10', '48'], c: 1, d: 2, uo: ['24 vergeet de factor ½ (dat is 6·4).', 'Klopt: ½ · 6 · 4 = 12.', '10 is 6 + 4.', '48 is veel te groot.'], uh: 'Oppervlakte driehoek = ½ · basis · hoogte.' },
      { v: 'Volume van een balk 2 bij 3 bij 4?', o: ['9', '24', '14', '12'], c: 1, d: 2, uo: ['9 is 2 + 3 + 4.', 'Klopt: 2 · 3 · 4 = 24.', '14 klopt niet.', '12 is maar 3 · 4.'], uh: 'Volume balk = lengte · breedte · hoogte.' },
      { v: 'Rechthoekige driehoek met a = 3 en b = 4. Wat is c?', o: ['5', '6', '7', '12'], c: 0, d: 3, uo: ['Klopt: c = √(3² + 4²) = √25 = 5.', '6 klopt niet met Pythagoras.', '7 is 3 + 4, maar zo werkt het niet.', '12 is 3 · 4.'], uh: 'Pythagoras: a² + b² = c², c is de schuine zijde.' },
    ]),

  V('D', 'Informatieverwerking en statistiek',
    `Je bepaalt het <strong>gemiddelde</strong>, de <strong>modus</strong> en de <strong>mediaan</strong> van getallen, en je rekent met eenvoudige <strong>kansen</strong>.`,
    [
      { h: '1. Gemiddelde, modus en mediaan', p: [
        `Het <strong>gemiddelde</strong> is de som van de getallen gedeeld door hoeveel het er zijn. De <strong>modus</strong> is het getal dat het vaakst voorkomt. De <strong>mediaan</strong> is het middelste getal als je ze op volgorde zet.`],
        formula: { label: 'Gemiddelde', eq: 'gemiddelde = som van de getallen : aantal getallen', note: 'Bijvoorbeeld (2 + 4 + 6) : 3 = 4.' },
        worked: { q: 'Bereken het gemiddelde van 2, 4 en 6', steps: ['Tel op: 2 + 4 + 6 = 12', 'Deel door het aantal (3): 12 : 3 = 4'], ans: '4' } },
      { h: '2. Kans', p: [
        `De <strong>kans</strong> op een uitkomst is het aantal gunstige uitkomsten gedeeld door het totale aantal uitkomsten. Bij een eerlijke munt is de kans op kop <em>1 op 2</em>; bij een dobbelsteen is de kans op een 6 gelijk aan <em>1 op 6</em>.`],
        formula: { label: 'Kans', eq: 'kans = gunstige uitkomsten : totaal aantal uitkomsten', note: 'Kans op een 6 met één dobbelsteen = 1 : 6.' } },
    ],
    [
      { t: 'Gemiddelde', d: 'de som van de getallen gedeeld door het aantal', k: 'som : aantal', fout: ['Mediaan', 'Modus'] },
      { t: 'Modus', d: 'het getal dat het vaakst voorkomt', k: 'meest voorkomend', fout: ['Mediaan', 'Gemiddelde'] },
      { t: 'Mediaan', d: 'het middelste getal als je ze op volgorde zet', k: 'het middelste getal', fout: ['Modus', 'Gemiddelde'] },
      { t: 'Kans', d: 'gunstige uitkomsten gedeeld door totaal aantal uitkomsten', k: 'gunstig : totaal', fout: ['Gemiddelde'] },
      { t: 'Cirkeldiagram', d: 'een diagram waarin de hele cirkel 100% is', k: 'hele cirkel = 100%', fout: ['Staafdiagram'] },
      { t: 'Staafdiagram', d: 'een diagram met staven die aantallen tonen', k: 'staven tonen aantallen', fout: ['Cirkeldiagram'] },
      { t: 'Frequentie', d: 'hoe vaak een waarde voorkomt', k: 'aantal keren', fout: ['Modus'] },
      { t: 'Uitkomst', d: 'een mogelijk resultaat van een kansexperiment', k: 'mogelijk resultaat', fout: ['Kans'] },
    ],
    [
      { v: 'Wat is het gemiddelde van 2, 4 en 6?', o: ['3', '4', '6', '12'], c: 1, d: 1, uo: ['3 is te laag; tel eerst op.', 'Klopt: (2 + 4 + 6) : 3 = 12 : 3 = 4.', '6 is het grootste getal, niet het gemiddelde.', '12 is de som, nog niet gedeeld.'], uh: 'Gemiddelde = som : aantal.' },
      { v: 'Wat is de modus van 2, 3, 3, 5?', o: ['2', '3', '5', '13'], c: 1, d: 2, uo: ['2 komt maar één keer voor.', 'Klopt: 3 komt het vaakst voor, dus dat is de modus.', '5 komt één keer voor.', '13 is de som, geen modus.'], uh: 'Modus = het getal dat het vaakst voorkomt.' },
      { v: 'Wat is de kans op kop bij een eerlijke munt?', o: ['1 op 6', '1 op 2', '1 op 4', 'zeker'], c: 1, d: 1, uo: ['1 op 6 hoort bij een dobbelsteen.', 'Klopt: kop of munt, dus 1 op 2.', '1 op 4 klopt niet bij een munt.', 'Kop is niet zeker; munt kan ook.'], uh: 'Kans = gunstige : totaal aantal uitkomsten.' },
      { v: 'Wat is het gemiddelde van 10 en 20?', o: ['10', '15', '20', '30'], c: 1, d: 1, uo: ['10 is het kleinste getal.', 'Klopt: (10 + 20) : 2 = 15.', '20 is het grootste getal.', '30 is de som, nog niet gedeeld.'] },
      { v: 'Wat is de mediaan van 1, 3 en 5?', o: ['1', '3', '5', '9'], c: 1, d: 2, uo: ['1 is het kleinste getal.', 'Klopt: op volgorde is 3 het middelste getal.', '5 is het grootste getal.', '9 is de som.'], uh: 'Mediaan = het middelste getal op volgorde.' },
      { v: 'Wat is de kans op een 6 met één dobbelsteen?', o: ['1 op 2', '1 op 6', '1 op 3', 'zeker'], c: 1, d: 2, uo: ['1 op 2 hoort bij een munt.', 'Klopt: er zijn 6 zijden, dus 1 op 6.', '1 op 3 klopt niet.', 'Een 6 is niet zeker.'] },
      { v: 'Wat is de modus?', o: ['het gemiddelde', 'het meest voorkomende getal', 'het middelste getal', 'het grootste getal'], c: 1, d: 2, uo: ['Het gemiddelde is som : aantal.', 'Klopt: de modus is het meest voorkomende getal.', 'Het middelste getal is de mediaan.', 'Het grootste getal is het maximum.'] },
      { v: 'Een heel cirkeldiagram staat samen voor...', o: ['50%', '100%', '10%', '25%'], c: 1, d: 2, uo: ['50% is een halve cirkel.', 'Klopt: de hele cirkel is samen 100%.', '10% is een klein stukje.', '25% is een kwart.'] },
    ]),
];
