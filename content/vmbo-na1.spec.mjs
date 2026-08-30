// VMBO GL/TL - Natuur- en scheikunde 1 (nask1). Gouden-stijl contentspec.
const V = (domein, naam, intro, secties, concepten) => ({ niveau: 'vmbo', vak: 'na1', domein, naam, intro, secties, concepten });

export default [
  V('A', 'Stoffen en materialen',
    `De <strong>dichtheid</strong> is de massa per volume van een stof. Bij een <strong>faseovergang</strong> gaat een stof van vast naar vloeibaar of van vloeibaar naar gas. Een <strong>temperatuur-tijdgrafiek</strong> laat zien hoe de temperatuur tijdens verwarmen verandert.`,
    [
      { h: '1. Dichtheid', p: [
        `De <strong>dichtheid</strong> vertelt hoe zwaar een stof is voor zijn grootte: de <strong>massa</strong> per <strong>volume</strong>. IJzer heeft een grote dichtheid, piepschuim een kleine. Je berekent de dichtheid door de massa te delen door het volume.`],
        formula: { label: 'Dichtheid', eq: 'ρ = m / V', note: 'ρ de dichtheid (g/cm³ of kg/m³), m de massa, V het volume.' },
        worked: { q: 'Een blok heeft een massa van 200 g en een volume van 100 cm³. Bereken de dichtheid.', steps: ['Gebruik ρ = m / V.', 'ρ = 200 / 100.'], ans: 'De dichtheid is 2 g/cm³.' } },
      { h: '2. Faseovergangen', p: [
        `Een stof kan <strong>vast</strong>, <strong>vloeibaar</strong> of <strong>gas</strong> zijn. De overgangen hebben eigen namen: <strong>smelten</strong> (vast → vloeibaar) en <strong>stollen</strong> (vloeibaar → vast), en <strong>verdampen</strong> (vloeibaar → gas) en <strong>condenseren</strong> (gas → vloeibaar). Het <strong>smeltpunt</strong> en het <strong>kookpunt</strong> zijn de temperaturen waarbij dat gebeurt.`] },
      { h: '3. Temperatuur-tijdgrafiek', p: [
        `In een <strong>temperatuur-tijdgrafiek</strong> zet je de temperatuur uit tegen de tijd bij verwarmen. Tijdens een faseovergang blijft de temperatuur even gelijk (een vlak stuk in de grafiek), omdat alle warmte in de overgang gaat zitten.`] },
    ],
    [
      { t: 'Dichtheid', d: 'de massa per volume van een stof', k: 'massa per volume', fout: ['Massa', 'Volume'] },
      { t: 'Massa', d: 'de hoeveelheid stof, in kilogram of gram', k: 'hoeveelheid stof', fout: ['Volume', 'Dichtheid'] },
      { t: 'Volume', d: 'de ruimte die een stof inneemt', k: 'ingenomen ruimte', fout: ['Massa', 'Dichtheid'] },
      { t: 'Faseovergang', d: 'de overgang van de ene fase naar de andere', k: 'wisseling van fase', fout: ['Smelten', 'Verdampen'] },
      { t: 'Smelten', d: 'de overgang van vast naar vloeibaar', k: 'vast wordt vloeibaar', fout: ['Stollen'] },
      { t: 'Stollen', d: 'de overgang van vloeibaar naar vast', k: 'vloeibaar wordt vast', fout: ['Smelten'] },
      { t: 'Verdampen', d: 'de overgang van vloeibaar naar gas', k: 'vloeibaar wordt gas', fout: ['Condenseren'] },
      { t: 'Condenseren', d: 'de overgang van gas naar vloeibaar', k: 'gas wordt vloeibaar', fout: ['Verdampen'] },
      { t: 'Smeltpunt', d: 'de temperatuur waarbij een stof smelt', k: 'smelttemperatuur', fout: ['Kookpunt'] },
      { t: 'Kookpunt', d: 'de temperatuur waarbij een stof kookt', k: 'kooktemperatuur', fout: ['Smeltpunt'] },
      { t: 'Vaste stof', d: 'een stof met een vaste vorm en een vast volume', k: 'vaste vorm', fout: ['Vloeistof', 'Gas'] },
      { t: 'Vloeistof', d: 'een stof die vloeit en de vorm van de bak aanneemt', k: 'neemt vorm van de bak aan', fout: ['Vaste stof', 'Gas'] },
      { t: 'Gas', d: 'een stof die de hele beschikbare ruimte vult', k: 'vult de ruimte', fout: ['Vloeistof', 'Vaste stof'] },
      { t: 'Temperatuur-tijdgrafiek', d: 'een grafiek van de temperatuur tegen de tijd bij verwarmen', k: 'temperatuur tegen tijd', fout: ['Faseovergang'] },
    ]),

  V('B', 'Elektrische energie',
    `In een stroomkring horen <strong>spanning</strong>, <strong>stroomsterkte</strong> en <strong>weerstand</strong> bij elkaar, verbonden door de <strong>wet van Ohm</strong>. In een <strong>serieschakeling</strong> heeft de stroom één weg, in een <strong>parallelschakeling</strong> meerdere.`,
    [
      { h: '1. Stroom, spanning en weerstand', p: [
        `De <strong>stroomsterkte</strong> (in ampère) is de hoeveelheid lading die per seconde stroomt. De <strong>spanning</strong> (in volt) is de duw die de stroom veroorzaakt. De <strong>weerstand</strong> (in ohm) werkt de stroom tegen. Een <strong>geleider</strong> laat stroom goed door, een <strong>isolator</strong> niet.`] },
      { h: '2. De wet van Ohm', p: [
        `Spanning, stroom en weerstand hangen samen: hoe hoger de weerstand bij dezelfde spanning, hoe kleiner de stroom.`],
        formula: { label: 'Wet van Ohm', eq: 'U = I × R', note: 'U de spanning (V), I de stroomsterkte (A), R de weerstand (Ω).' },
        worked: { q: 'Door een lampje loopt 0,5 A bij een spanning van 6 V. Bereken de weerstand.', steps: ['Herschrijf U = I × R naar R = U / I.', 'R = 6 / 0,5.'], ans: 'De weerstand is 12 Ω.' } },
      { h: '3. Serie en parallel', p: [
        `In een <strong>serieschakeling</strong> heeft de stroom maar één weg: gaat één lampje stuk, dan doet de rest het ook niet. In een <strong>parallelschakeling</strong> zijn er takken naast elkaar. Een <strong>kortsluiting</strong> is een verbinding met bijna geen weerstand; een <strong>zekering</strong> onderbreekt dan de stroom.`] },
      { h: '4. Vermogen en energie', p: [
        `Het <strong>vermogen</strong> (in watt) is de energie die per seconde wordt omgezet. De <strong>elektrische energie</strong> die een apparaat gebruikt, hangt af van het vermogen én de tijd dat het aanstaat.`],
        formula: { label: 'Vermogen en energie', eq: 'P = U × I   en   E = P × t', note: 'P het vermogen (W), E de energie (J of Wh), t de tijd.' },
        worked: { q: 'Een apparaat van 100 W staat 2 uur aan. Bereken de gebruikte energie.', steps: ['Gebruik E = P × t.', 'E = 100 W × 2 h.'], ans: 'De energie is 200 Wh (0,2 kWh).' } },
    ],
    [
      { t: 'Stroomsterkte', d: 'de hoeveelheid lading die per seconde stroomt, in ampère', k: 'lading per seconde', fout: ['Spanning', 'Weerstand'] },
      { t: 'Spanning', d: 'de duw die de stroom veroorzaakt, in volt', k: 'de elektrische duw', fout: ['Stroomsterkte', 'Weerstand'] },
      { t: 'Weerstand', d: 'de mate waarin een component de stroom tegenwerkt, in ohm', k: 'werkt de stroom tegen', fout: ['Stroomsterkte', 'Spanning'] },
      { t: 'Wet van Ohm', d: 'het verband tussen spanning, stroom en weerstand (U = I × R)', k: 'U is I maal R', fout: ['Vermogen'] },
      { t: 'Serieschakeling', d: 'een schakeling waarin de stroom maar één weg heeft', k: 'één stroomweg', fout: ['Parallelschakeling'] },
      { t: 'Parallelschakeling', d: 'een schakeling met meerdere takken naast elkaar', k: 'takken naast elkaar', fout: ['Serieschakeling'] },
      { t: 'Vermogen', d: 'de energie die per seconde wordt omgezet, in watt', k: 'energie per seconde', fout: ['Elektrische energie'] },
      { t: 'Elektrische energie', d: 'de energie die een apparaat gebruikt in een bepaalde tijd', k: 'gebruikte energie', fout: ['Vermogen'] },
      { t: 'Geleider', d: 'een materiaal dat de stroom goed doorlaat', k: 'laat stroom door', fout: ['Isolator'] },
      { t: 'Isolator', d: 'een materiaal dat de stroom niet doorlaat', k: 'laat geen stroom door', fout: ['Geleider'] },
      { t: 'Kortsluiting', d: 'een verbinding met heel weinig weerstand', k: 'te weinig weerstand', fout: ['Zekering'] },
      { t: 'Zekering', d: 'een beveiliging die de stroom onderbreekt bij te veel stroom', k: 'beveiliging tegen te veel stroom', fout: ['Kortsluiting'] },
    ]),

  V('C', 'Verbranden en verwarmen',
    `Warmte gaat over door <strong>geleiding</strong>, <strong>stroming</strong> of <strong>straling</strong>. Met <strong>isolatie</strong> houd je warmte tegen. Bij <strong>verbranding</strong> reageert een <strong>brandstof</strong> met <strong>zuurstof</strong> en komt er warmte vrij.`,
    [
      { h: '1. Warmtetransport', p: [
        `Warmte kan op drie manieren van warm naar koud gaan. Bij <strong>warmtegeleiding</strong> geeft een stof de warmte door zonder zelf te bewegen (metaal). Bij <strong>warmtestroming</strong> beweegt een vloeistof of gas mee (verwarming in huis). Bij <strong>warmtestraling</strong> gaat de warmte door straling, zonder tussenstof (de zon). Met <strong>isolatie</strong> hou je warmtetransport tegen.`] },
      { h: '2. Verbranding', p: [
        `Bij een <strong>verbranding</strong> reageert een <strong>brandstof</strong> met <strong>zuurstof</strong> en komt warmte vrij. Het <strong>rendement</strong> zegt welk deel van de energie nuttig wordt gebruikt; de rest gaat als warmte verloren.`] },
      { h: '3. Soortelijke warmte', p: [
        `Hoeveel warmte een stof nodig heeft om op te warmen, hangt af van de <strong>soortelijke warmte</strong> (c), de massa en de temperatuurstijging.`],
        formula: { label: 'Warmte', eq: 'Q = c × m × ΔT', note: 'Q de warmte (J), c de soortelijke warmte, m de massa (kg), ΔT de temperatuurstijging (°C).' },
        worked: { q: 'Je verwarmt 2 kg water (c = 4180) van 20 °C naar 30 °C. Bereken de warmte.', steps: ['Bepaal ΔT = 30 − 20 = 10 °C.', 'Q = c × m × ΔT = 4180 × 2 × 10.'], ans: 'Er is 83.600 J warmte nodig.' } },
    ],
    [
      { t: 'Warmtegeleiding', d: 'warmtetransport door een stof zonder dat de stof zelf beweegt', k: 'warmte door een stof', fout: ['Warmtestroming', 'Warmtestraling'] },
      { t: 'Warmtestroming', d: 'warmtetransport doordat een vloeistof of gas beweegt', k: 'warmte met bewegende stof', fout: ['Warmtegeleiding', 'Warmtestraling'] },
      { t: 'Warmtestraling', d: 'warmtetransport via straling, zonder tussenstof', k: 'warmte via straling', fout: ['Warmtegeleiding', 'Warmtestroming'] },
      { t: 'Isolatie', d: 'het tegenhouden van warmtetransport', k: 'warmte tegenhouden', fout: ['Warmtegeleiding'] },
      { t: 'Verbranding', d: 'een reactie met zuurstof waarbij warmte vrijkomt', k: 'reactie met zuurstof', fout: ['Isolatie'] },
      { t: 'Brandstof', d: 'een stof die je verbrandt om energie te krijgen', k: 'stof die je verbrandt', fout: ['Zuurstof'] },
      { t: 'Zuurstof', d: 'het gas dat nodig is voor verbranding', k: 'nodig voor verbranden', fout: ['Brandstof'] },
      { t: 'Soortelijke warmte', d: 'de warmte om één kilogram van een stof één graad op te warmen', k: 'warmte per kg per graad', fout: ['Rendement'] },
      { t: 'Warmtegeleider', d: 'een materiaal dat warmte goed doorlaat', k: 'laat warmte door', fout: ['Warmte-isolator'] },
      { t: 'Warmte-isolator', d: 'een materiaal dat warmte slecht doorlaat', k: 'houdt warmte tegen', fout: ['Warmtegeleider'] },
      { t: 'Rendement', d: 'het deel van de energie dat nuttig wordt gebruikt', k: 'nuttig deel van de energie', fout: ['Soortelijke warmte'] },
      { t: 'Convectie', d: 'een andere naam voor warmtestroming in vloeistof of gas', k: 'stroming van warmte', fout: ['Warmtestroming'] },
    ]),

  V('D', 'Licht en beeld',
    `Licht gaat rechtdoor tot het wordt <strong>teruggekaatst</strong> of <strong>gebroken</strong>. Een <strong>bolle lens</strong> bundelt licht in het <strong>brandpunt</strong>, een <strong>holle lens</strong> spreidt het.`,
    [
      { h: '1. Terugkaatsing en breking', p: [
        `Een <strong>lichtstraal</strong> gaat rechtdoor tot hij een oppervlak raakt. Bij <strong>spiegeling</strong> kaatst het licht terug; de <strong>invalshoek</strong> is dan gelijk aan de terugkaatshoek. Gaat licht van de ene stof naar de andere (lucht naar water), dan verandert het van richting: <strong>lichtbreking</strong>.`] },
      { h: '2. Lenzen en beeld', p: [
        `Een <strong>bolle lens</strong> brengt lichtstralen bij elkaar in het <strong>brandpunt</strong>; een <strong>holle lens</strong> laat ze juist uit elkaar gaan. Zo ontstaat een <strong>beeld</strong>. Een <strong>reëel beeld</strong> kun je op een scherm opvangen; een <strong>virtueel beeld</strong> niet, zoals je spiegelbeeld.`] },
    ],
    [
      { t: 'Lichtstraal', d: 'een rechte lijn die de richting van het licht aangeeft', k: 'richting van licht', fout: ['Lichtbreking'] },
      { t: 'Spiegeling', d: 'het terugkaatsen van licht door een spiegel', k: 'licht kaatst terug', fout: ['Lichtbreking'] },
      { t: 'Lichtbreking', d: 'het veranderen van richting van licht bij overgang naar een andere stof', k: 'licht verandert richting', fout: ['Spiegeling'] },
      { t: 'Lens', d: 'een doorzichtig voorwerp dat licht bundelt of spreidt', k: 'bundelt of spreidt licht', fout: ['Bolle lens', 'Holle lens'] },
      { t: 'Bolle lens', d: 'een lens die lichtstralen bij elkaar brengt', k: 'brengt licht samen', fout: ['Holle lens'] },
      { t: 'Holle lens', d: 'een lens die lichtstralen uit elkaar laat gaan', k: 'spreidt licht', fout: ['Bolle lens'] },
      { t: 'Brandpunt', d: 'het punt waar een bolle lens evenwijdige stralen samenbrengt', k: 'punt waar licht samenkomt', fout: ['Bolle lens'] },
      { t: 'Beeld', d: 'de afbeelding die door een lens of spiegel ontstaat', k: 'afbeelding via lens/spiegel', fout: ['Reëel beeld', 'Virtueel beeld'] },
      { t: 'Reëel beeld', d: 'een beeld dat je op een scherm kunt opvangen', k: 'op te vangen op scherm', fout: ['Virtueel beeld'] },
      { t: 'Virtueel beeld', d: 'een beeld dat je niet kunt opvangen, zoals in een spiegel', k: 'niet op te vangen', fout: ['Reëel beeld'] },
      { t: 'Invalshoek', d: 'de hoek waaronder licht op een oppervlak valt', k: 'hoek van inval', fout: ['Terugkaatsing'] },
      { t: 'Terugkaatsing', d: 'het weerkaatsen van licht tegen een oppervlak', k: 'licht weerkaatst', fout: ['Spiegeling'] },
    ]),

  V('E', 'Geluid',
    `<strong>Geluid</strong> bestaat uit <strong>trillingen</strong> die zich door een stof voortplanten. De <strong>frequentie</strong> bepaalt de <strong>toonhoogte</strong>, de <strong>amplitude</strong> de <strong>geluidssterkte</strong>.`,
    [
      { h: '1. Trillingen en geluid', p: [
        `Een <strong>geluidsbron</strong> maakt <strong>trillingen</strong>: heen-en-weergaande bewegingen. Die trillingen planten zich als <strong>geluid</strong> voort door een stof, bijvoorbeeld lucht. In het luchtledige is er geen geluid, want er is niets om te trillen.`] },
      { h: '2. Frequentie en amplitude', p: [
        `De <strong>frequentie</strong> is het aantal trillingen per seconde (in hertz); de <strong>trillingstijd</strong> is de duur van één trilling. Een hoge frequentie geeft een hoge <strong>toonhoogte</strong>. De <strong>amplitude</strong> is de grootte van de uitwijking en bepaalt de <strong>geluidssterkte</strong>: hoe harder het klinkt.`],
        formula: { label: 'Frequentie', eq: 'f = 1 / T', note: 'f de frequentie (Hz), T de trillingstijd (s).' },
        worked: { q: 'Eén trilling duurt 0,01 s. Bereken de frequentie.', steps: ['Gebruik f = 1 / T.', 'f = 1 / 0,01.'], ans: 'De frequentie is 100 Hz.' } },
      { h: '3. Echo en geluidssnelheid', p: [
        `Geluid heeft een <strong>geluidssnelheid</strong> (in lucht ongeveer 340 m/s). Kaatst geluid terug, dan hoor je een <strong>echo</strong>. Met <strong>echopeiling</strong> meet je een afstand door de tijd van de echo te gebruiken.`] },
    ],
    [
      { t: 'Geluid', d: 'trillingen die zich door een stof voortplanten', k: 'voortplantende trillingen', fout: ['Trilling'] },
      { t: 'Trilling', d: 'een heen-en-weergaande beweging', k: 'heen en weer bewegen', fout: ['Frequentie'] },
      { t: 'Frequentie', d: 'het aantal trillingen per seconde, in hertz', k: 'trillingen per seconde', fout: ['Trillingstijd'] },
      { t: 'Trillingstijd', d: 'de tijd van één volledige trilling', k: 'tijd van één trilling', fout: ['Frequentie'] },
      { t: 'Amplitude', d: 'de grootte van de uitwijking van een trilling', k: 'grootte van de uitwijking', fout: ['Frequentie'] },
      { t: 'Toonhoogte', d: 'hoe hoog of laag een toon klinkt; hangt af van de frequentie', k: 'hoog of laag, via frequentie', fout: ['Geluidssterkte'] },
      { t: 'Geluidssterkte', d: 'hoe hard een geluid klinkt; hangt af van de amplitude', k: 'hard of zacht, via amplitude', fout: ['Toonhoogte'] },
      { t: 'Geluidssnelheid', d: 'de snelheid waarmee geluid zich voortplant', k: 'snelheid van geluid', fout: ['Echo'] },
      { t: 'Echo', d: 'geluid dat terugkaatst en je opnieuw hoort', k: 'teruggekaatst geluid', fout: ['Echopeiling'] },
      { t: 'Echopeiling', d: 'het meten van een afstand met teruggekaatst geluid', k: 'afstand meten met echo', fout: ['Echo'] },
      { t: 'Geluidsbron', d: 'het voorwerp dat het geluid maakt', k: 'maakt het geluid', fout: ['Geluid'] },
      { t: 'Decibel', d: 'de eenheid van geluidssterkte', k: 'eenheid van sterkte', fout: ['Geluidssterkte'] },
    ]),

  V('F', 'Kracht en veiligheid',
    `Een <strong>kracht</strong> is een duw of trek, gemeten in <strong>newton</strong>. Een <strong>hefboom</strong> vergroot kracht rond een <strong>draaipunt</strong>. Je <strong>stopafstand</strong> is de reactieafstand plus de <strong>remweg</strong>.`,
    [
      { h: '1. Krachten', p: [
        `Een <strong>kracht</strong> is een duw of trek die een voorwerp kan vervormen of versnellen; de eenheid is de <strong>newton</strong>. De <strong>zwaartekracht</strong> trekt alles naar de aarde. Werken meerdere krachten, dan tel je ze samen tot de <strong>resultante</strong>. Heffen ze elkaar op, dan is er <strong>evenwicht</strong>. De <strong>wrijvingskracht</strong> werkt beweging tegen.`] },
      { h: '2. Hefbomen', p: [
        `Een <strong>hefboom</strong> draait om een <strong>draaipunt</strong> en maakt het mogelijk met weinig kracht een zware last te tillen. Het draai-effect heet het <strong>moment</strong>: kracht maal arm.`],
        formula: { label: 'Moment', eq: 'M = F × r', note: 'M het moment, F de kracht (N), r de arm (afstand tot het draaipunt).' } },
      { h: '3. Snelheid en veiligheid', p: [
        `Voordat je remt, verstrijkt eerst je <strong>reactietijd</strong>: de tijd tussen zien en reageren. De afstand tijdens het remmen is de <strong>remweg</strong>. Samen vormen de reactieafstand en de remweg de <strong>stopafstand</strong>. Bij een hogere snelheid worden beide groter.`] },
    ],
    [
      { t: 'Kracht', d: 'een duw of trek die een voorwerp kan vervormen of versnellen', k: 'duw of trek', fout: ['Moment', 'Zwaartekracht'] },
      { t: 'Zwaartekracht', d: 'de kracht waarmee de aarde aan massa trekt', k: 'aantrekking van de aarde', fout: ['Kracht'] },
      { t: 'Newton', d: 'de eenheid van kracht', k: 'eenheid van kracht', fout: ['Moment'] },
      { t: 'Resultante', d: 'de som van alle krachten op een voorwerp', k: 'som van de krachten', fout: ['Evenwicht'] },
      { t: 'Evenwicht', d: 'de toestand waarin de krachten elkaar opheffen', k: 'krachten heffen elkaar op', fout: ['Resultante'] },
      { t: 'Hefboom', d: 'een staaf die om een draaipunt draait om kracht te vergroten', k: 'staaf om een draaipunt', fout: ['Draaipunt', 'Moment'] },
      { t: 'Draaipunt', d: 'het vaste punt waar een hefboom omheen draait', k: 'punt van draaien', fout: ['Hefboom'] },
      { t: 'Moment', d: 'het draai-effect van een kracht: kracht maal arm', k: 'draai-effect van kracht', fout: ['Kracht'] },
      { t: 'Remweg', d: 'de afstand die je aflegt tijdens het remmen', k: 'afstand tijdens remmen', fout: ['Stopafstand', 'Reactietijd'] },
      { t: 'Reactietijd', d: 'de tijd tussen iets zien en erop reageren', k: 'tijd van zien tot reageren', fout: ['Remweg'] },
      { t: 'Stopafstand', d: 'de reactieafstand plus de remweg', k: 'reactieafstand plus remweg', fout: ['Remweg'] },
      { t: 'Wrijvingskracht', d: 'een kracht die beweging tegenwerkt', k: 'werkt beweging tegen', fout: ['Zwaartekracht'] },
    ]),

  V('G', 'Bouw van de materie',
    `Alle stoffen bestaan uit <strong>atomen</strong>. Zitten atomen aan elkaar, dan vormen ze een <strong>molecuul</strong>. Een <strong>zuivere stof</strong> heeft één soort deeltjes; een <strong>mengsel</strong> meerdere.`,
    [
      { h: '1. Atomen en moleculen', p: [
        `Het kleinste deeltje van een stof is het <strong>atoom</strong>. Zitten atomen aan elkaar vast, dan vormen ze een <strong>molecuul</strong>. Een <strong>element</strong> bestaat uit één soort atomen (bijvoorbeeld zuurstof); een <strong>verbinding</strong> uit meerdere soorten (bijvoorbeeld water).`] },
      { h: '2. Zuivere stof en mengsel', p: [
        `Een <strong>zuivere stof</strong> bestaat uit één soort deeltjes. Een <strong>mengsel</strong> bevat meerdere soorten deeltjes door elkaar. Door <strong>scheiden</strong> (zoals filtreren of indampen) haal je een mengsel weer uit elkaar.`] },
      { h: '3. In het atoom', p: [
        `Een atoom heeft een <strong>atoomkern</strong> met <strong>protonen</strong> (positief) en <strong>neutronen</strong> (ongeladen). Daaromheen bewegen <strong>elektronen</strong> (negatief). Krijgt een atoom lading, bijvoorbeeld door elektronen op te nemen of af te staan, dan is het een <strong>ion</strong>.`] },
    ],
    [
      { t: 'Atoom', d: 'het kleinste deeltje van een element', k: 'kleinste deeltje', fout: ['Molecuul'] },
      { t: 'Molecuul', d: 'een groepje atomen dat aan elkaar zit', k: 'groepje atomen', fout: ['Atoom'] },
      { t: 'Element', d: 'een stof die uit één soort atomen bestaat', k: 'één soort atomen', fout: ['Verbinding'] },
      { t: 'Verbinding', d: 'een stof die uit meerdere soorten atomen bestaat', k: 'meerdere soorten atomen', fout: ['Element'] },
      { t: 'Zuivere stof', d: 'een stof die uit één soort deeltjes bestaat', k: 'één soort deeltjes', fout: ['Mengsel'] },
      { t: 'Mengsel', d: 'een stof die uit meerdere soorten deeltjes door elkaar bestaat', k: 'deeltjes door elkaar', fout: ['Zuivere stof'] },
      { t: 'Atoomkern', d: 'het midden van een atoom met protonen en neutronen', k: 'midden van het atoom', fout: ['Elektron'] },
      { t: 'Elektron', d: 'een negatief geladen deeltje om de kern', k: 'negatief deeltje', fout: ['Proton', 'Neutron'] },
      { t: 'Proton', d: 'een positief geladen deeltje in de kern', k: 'positief deeltje in de kern', fout: ['Neutron', 'Elektron'] },
      { t: 'Neutron', d: 'een ongeladen deeltje in de kern', k: 'ongeladen deeltje', fout: ['Proton', 'Elektron'] },
      { t: 'Ion', d: 'een atoom met een elektrische lading', k: 'geladen atoom', fout: ['Atoom'] },
      { t: 'Scheiden', d: 'een mengsel uit elkaar halen in zuivere stoffen', k: 'mengsel uit elkaar halen', fout: ['Mengsel'] },
    ]),

  V('H', 'Straling en stralingsbescherming',
    `<strong>Radioactiviteit</strong> is het uitzenden van <strong>straling</strong> door onstabiele kernen. Er zijn drie soorten: <strong>alfa</strong>, <strong>bèta</strong> en <strong>gamma</strong>. Met <strong>afscherming</strong> en afstand bescherm je jezelf.`,
    [
      { h: '1. Soorten straling', p: [
        `<strong>Radioactiviteit</strong> ontstaat als onstabiele atoomkernen <strong>straling</strong> uitzenden. Er zijn drie soorten: <strong>alfastraling</strong> (zware, geladen deeltjes, weinig doordringend), <strong>betastraling</strong> (snelle elektronen) en <strong>gammastraling</strong> (zeer doordringend, zonder lading). Omdat deze straling deeltjes geladen kan maken, heet ze <strong>ioniserende straling</strong>.`] },
      { h: '2. Halveringstijd en bescherming', p: [
        `De <strong>halveringstijd</strong> is de tijd waarin de helft van de radioactieve kernen vervalt: daarna is de straling gehalveerd. Straling van buitenaf heet <strong>bestraling</strong>; zit het radioactieve materiaal op of in je lichaam, dan is er <strong>besmetting</strong>. Je beschermt je met <strong>afscherming</strong>, afstand en korte blootstelling. De ontvangen hoeveelheid heet de <strong>dosis</strong>, die je meet met een <strong>geigerteller</strong>.`] },
    ],
    [
      { t: 'Straling', d: 'energie die zich door de ruimte verplaatst als golven of deeltjes', k: 'energie door de ruimte', fout: ['Radioactiviteit'] },
      { t: 'Radioactiviteit', d: 'het uitzenden van straling door onstabiele kernen', k: 'kernen zenden straling uit', fout: ['Straling'] },
      { t: 'Alfastraling', d: 'straling van zware, positief geladen deeltjes', k: 'zware geladen deeltjes', fout: ['Betastraling', 'Gammastraling'] },
      { t: 'Betastraling', d: 'straling van snelle elektronen', k: 'snelle elektronen', fout: ['Alfastraling', 'Gammastraling'] },
      { t: 'Gammastraling', d: 'zeer doordringende straling zonder lading', k: 'doordringend, geen lading', fout: ['Alfastraling', 'Betastraling'] },
      { t: 'Ioniserende straling', d: 'straling die deeltjes geladen kan maken', k: 'maakt deeltjes geladen', fout: ['Straling'] },
      { t: 'Halveringstijd', d: 'de tijd waarin de helft van de kernen vervalt', k: 'tijd tot de helft vervalt', fout: ['Dosis'] },
      { t: 'Besmetting', d: 'radioactief materiaal op of in het lichaam', k: 'radioactief materiaal aan je', fout: ['Bestraling'] },
      { t: 'Bestraling', d: 'blootstelling aan straling van buitenaf', k: 'straling van buitenaf', fout: ['Besmetting'] },
      { t: 'Afscherming', d: 'het tegenhouden van straling met een laag materiaal', k: 'straling tegenhouden', fout: ['Halveringstijd'] },
      { t: 'Dosis', d: 'de hoeveelheid ontvangen straling', k: 'hoeveelheid straling', fout: ['Halveringstijd'] },
      { t: 'Geigerteller', d: 'een apparaat dat straling meet', k: 'meet straling', fout: ['Dosis'] },
    ]),
];
