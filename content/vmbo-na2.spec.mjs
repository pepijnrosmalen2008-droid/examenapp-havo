// VMBO GL/TL - Natuur- en scheikunde 2 (scheikunde). Gouden-stijl contentspec.
const V = (domein, naam, intro, secties, concepten, vragen) => ({ niveau: 'vmbo', vak: 'na2', domein, naam, intro, secties, concepten, vragen });

export default [
  V('A', 'Stoffen en materialen in de omgeving',
    `Een <strong>zuivere stof</strong> bestaat uit één soort deeltjes; een <strong>mengsel</strong> uit meerdere. Je herkent stoffen aan <strong>eigenschappen</strong> als smeltpunt en dichtheid, en je scheidt mengsels met <strong>filtreren</strong>, <strong>indampen</strong> of <strong>destilleren</strong>.`,
    [
      { h: '1. Zuivere stof en mengsel', p: [
        `Een <strong>zuivere stof</strong> bestaat uit één soort moleculen (bijvoorbeeld puur water). Een <strong>mengsel</strong> bestaat uit meerdere stoffen door elkaar (bijvoorbeeld zeewater). Elke stof heeft eigen <strong>stofeigenschappen</strong> zoals <strong>smeltpunt</strong>, <strong>kookpunt</strong> en <strong>dichtheid</strong>, waaraan je hem herkent.`] },
      { h: '2. Mengsels scheiden', p: [
        `Je scheidt een mengsel op basis van verschillen. Met <strong>filtreren</strong> haal je vaste stukjes uit een vloeistof. Met <strong>indampen</strong> laat je de vloeistof verdampen en houd je de opgeloste stof over. Met <strong>destilleren</strong> scheid je stoffen op kookpunt.`] },
    ],
    [
      { t: 'Zuivere stof', d: 'een stof die uit één soort moleculen bestaat', k: 'één soort deeltjes', fout: ['Mengsel'] },
      { t: 'Mengsel', d: 'twee of meer stoffen door elkaar', k: 'meerdere stoffen', fout: ['Zuivere stof'] },
      { t: 'Stofeigenschap', d: 'een kenmerk waaraan je een stof herkent', k: 'kenmerk van een stof', fout: ['Dichtheid'] },
      { t: 'Smeltpunt', d: 'de temperatuur waarbij een stof van vast naar vloeibaar gaat', k: 'vast wordt vloeibaar', fout: ['Kookpunt'] },
      { t: 'Kookpunt', d: 'de temperatuur waarbij een stof van vloeibaar naar gas gaat', k: 'vloeibaar wordt gas', fout: ['Smeltpunt'] },
      { t: 'Dichtheid', d: 'de massa per volume van een stof', k: 'massa per volume', fout: ['Stofeigenschap'] },
      { t: 'Filtreren', d: 'vaste stukjes uit een vloeistof halen met een filter', k: 'vaste stof eruit filteren', fout: ['Indampen', 'Destilleren'] },
      { t: 'Indampen', d: 'de vloeistof laten verdampen om de opgeloste stof over te houden', k: 'vloeistof weg, stof blijft', fout: ['Filtreren'] },
      { t: 'Destilleren', d: 'stoffen scheiden op verschil in kookpunt', k: 'scheiden op kookpunt', fout: ['Filtreren'] },
    ],
    [
      { v: 'Wat is een zuivere stof?', o: ['een stof uit één soort moleculen', 'meerdere stoffen door elkaar', 'altijd een vloeistof', 'altijd water'], c: 0, d: 1, uo: ['Klopt: een zuivere stof bestaat uit één soort moleculen.', 'Dat is juist een mengsel.', 'Een zuivere stof kan ook vast of gas zijn.', 'Niet alleen water is zuiver.'], uh: 'Zuiver = één soort deeltjes, mengsel = meerdere stoffen.' },
      { v: 'Wat is zeewater?', o: ['een zuivere stof', 'een mengsel', 'een element', 'een molecuul'], c: 1, d: 2, uo: ['Zeewater bevat meer dan één stof.', 'Klopt: water met zout erin is een mengsel.', 'Een element is een grondstof, niet zeewater.', 'Een molecuul is een deeltje, geen mengsel.'] },
      { v: 'Waarmee haal je vaste stukjes uit een vloeistof?', o: ['filtreren', 'indampen', 'destilleren', 'smelten'], c: 0, d: 2, uo: ['Klopt: bij filtreren blijft het vaste op het filter achter.', 'Indampen verdampt juist de vloeistof.', 'Destilleren scheidt op kookpunt.', 'Smelten is een faseovergang, geen scheiding.'], uh: 'Filtreren: vast eruit. Indampen: vloeistof weg. Destilleren: op kookpunt.' },
      { v: 'Wat is het smeltpunt?', o: ['de temperatuur van vast naar vloeibaar', 'de temperatuur van vloeibaar naar gas', 'de massa per volume', 'het gewicht'], c: 0, d: 2, uo: ['Klopt: bij het smeltpunt wordt vast vloeibaar.', 'Dat is het kookpunt.', 'Dat is de dichtheid.', 'Gewicht is geen smeltpunt.'] },
      { v: 'Hoe scheid je zout uit zout water?', o: ['filtreren', 'indampen', 'een magneet', 'zeven'], c: 1, d: 2, uo: ['Zout zit opgelost, dus een filter houdt het niet tegen.', 'Klopt: door indampen verdampt het water en blijft het zout over.', 'Een magneet werkt niet op zout.', 'Zeven werkt niet op opgeloste stoffen.'] },
      { v: 'Wat is dichtheid?', o: ['de massa per volume', 'het kookpunt', 'het smeltpunt', 'de kleur'], c: 0, d: 2, uo: ['Klopt: dichtheid is de massa per volume.', 'Het kookpunt is een temperatuur.', 'Het smeltpunt is een temperatuur.', 'Kleur is een andere eigenschap.'] },
      { v: 'Waarop scheidt destilleren stoffen?', o: ['op kleur', 'op verschil in kookpunt', 'op magnetisme', 'op grootte'], c: 1, d: 3, uo: ['Kleur speelt bij destilleren geen rol.', 'Klopt: destilleren scheidt op verschil in kookpunt.', 'Magnetisme is een andere methode.', 'Grootte hoort bij filtreren of zeven.'] },
      { v: 'Wat is een stofeigenschap?', o: ['een kenmerk waaraan je een stof herkent', 'een mengsel', 'een reactie', 'een filter'], c: 0, d: 1, uo: ['Klopt: aan een stofeigenschap herken je een stof.', 'Een mengsel is geen eigenschap.', 'Een reactie is een verandering, geen eigenschap.', 'Een filter is gereedschap.'] },
    ]),

  V('B', 'Bouw van de stoffen',
    `Stoffen bestaan uit <strong>moleculen</strong>, die weer uit <strong>atomen</strong> zijn opgebouwd. Bij de fasen <strong>vast</strong>, <strong>vloeibaar</strong> en <strong>gas</strong> liggen de moleculen steeds losser.`,
    [
      { h: '1. Moleculen en atomen', p: [
        `Een <strong>molecuul</strong> is het kleinste deeltje van een stof; het is opgebouwd uit <strong>atomen</strong>. Een <strong>element</strong> is een stof uit één soort atomen. Een <strong>molecuulformule</strong> (zoals H₂O) geeft aan welke en hoeveel atomen in een molecuul zitten.`] },
      { h: '2. De drie fasen', p: [
        `In de <strong>vaste fase</strong> zitten de moleculen dicht op elkaar en trillen ze op hun plaats. In de <strong>vloeibare fase</strong> bewegen ze langs elkaar. In de <strong>gasfase</strong> vliegen ze los en ver uit elkaar. Bij verwarmen ga je van vast naar vloeibaar (<strong>smelten</strong>) naar gas (<strong>verdampen</strong>).`] },
    ],
    [
      { t: 'Molecuul', d: 'het kleinste deeltje van een stof', k: 'kleinste deeltje van een stof', fout: ['Atoom'] },
      { t: 'Atoom', d: 'het bouwsteentje waaruit moleculen bestaan', k: 'bouwsteen van moleculen', fout: ['Molecuul'] },
      { t: 'Element', d: 'een stof die uit één soort atomen bestaat', k: 'één soort atomen', fout: ['Molecuul'] },
      { t: 'Molecuulformule', d: 'een formule die de atomen in een molecuul weergeeft', k: 'atomen in een molecuul', fout: ['Element'] },
      { t: 'Vaste fase', d: 'moleculen dicht opeen, trillen op hun plaats', k: 'dicht opeen, vast', fout: ['Vloeibare fase', 'Gasfase'] },
      { t: 'Vloeibare fase', d: 'moleculen bewegen langs elkaar', k: 'bewegen langs elkaar', fout: ['Vaste fase', 'Gasfase'] },
      { t: 'Gasfase', d: 'moleculen vliegen los en ver uit elkaar', k: 'los en ver uit elkaar', fout: ['Vaste fase', 'Vloeibare fase'] },
      { t: 'Smelten', d: 'overgang van vast naar vloeibaar', k: 'vast naar vloeibaar', fout: ['Verdampen'] },
      { t: 'Verdampen', d: 'overgang van vloeibaar naar gas', k: 'vloeibaar naar gas', fout: ['Smelten'] },
    ],
    [
      { v: 'Wat is een molecuul?', o: ['het kleinste deeltje van een stof', 'een groot voorwerp', 'een mengsel', 'een temperatuur'], c: 0, d: 1, uo: ['Klopt: een molecuul is het kleinste deeltje van een stof.', 'Een molecuul is juist heel klein.', 'Een mengsel is iets anders.', 'Een temperatuur is geen deeltje.'], uh: 'Moleculen bestaan uit atomen; atomen zijn de bouwstenen.' },
      { v: 'Waaruit zijn moleculen opgebouwd?', o: ['uit atomen', 'uit mengsels', 'uit vloeistoffen', 'uit gassen'], c: 0, d: 1, uo: ['Klopt: moleculen bestaan uit atomen.', 'Een mengsel is geen bouwsteen van een molecuul.', 'Een vloeistof is een fase, geen bouwsteen.', 'Een gas is een fase, geen bouwsteen.'] },
      { v: 'In welke fase liggen de moleculen het dichtst op elkaar?', o: ['vast', 'vloeibaar', 'gas', 'ze liggen altijd gelijk'], c: 0, d: 2, uo: ['Klopt: in de vaste fase zitten moleculen het dichtst opeen.', 'In een vloeistof bewegen ze langs elkaar.', 'In een gas liggen ze juist ver uit elkaar.', 'De afstand verschilt wel degelijk per fase.'], uh: 'Vast (dicht) → vloeibaar (langs elkaar) → gas (ver uiteen).' },
      { v: 'Wat gebeurt er bij smelten?', o: ['vast wordt vloeibaar', 'vloeibaar wordt gas', 'gas wordt vast', 'niets'], c: 0, d: 2, uo: ['Klopt: bij smelten gaat vast over in vloeibaar.', 'Vloeibaar naar gas is verdampen.', 'Gas naar vast is rijpen (afzetten).', 'Er verandert wel degelijk een fase.'] },
      { v: 'Wat is een element?', o: ['een stof uit één soort atomen', 'een mengsel', 'een molecuulformule', 'een reactie'], c: 0, d: 2, uo: ['Klopt: een element bestaat uit één soort atomen.', 'Een mengsel bevat meerdere stoffen.', 'Een molecuulformule is een notatie, geen stof.', 'Een reactie is een verandering.'] },
      { v: 'Wat geeft de molecuulformule H₂O aan?', o: ['dat een watermolecuul 2 waterstof- en 1 zuurstofatoom heeft', 'dat water een mengsel is', 'het kookpunt van water', 'de kleur van water'], c: 0, d: 3, uo: ['Klopt: H₂O = 2 waterstofatomen en 1 zuurstofatoom.', 'H₂O beschrijft juist een zuivere stof.', 'De formule geeft geen temperatuur.', 'De formule zegt niets over kleur.'] },
      { v: 'In welke fase vliegen de moleculen los en ver uit elkaar?', o: ['vast', 'vloeibaar', 'gas', 'geen enkele'], c: 2, d: 2, uo: ['In de vaste fase zitten ze juist vast.', 'In een vloeistof bewegen ze langs elkaar.', 'Klopt: in de gasfase vliegen moleculen los en ver uiteen.', 'Dit geldt wel degelijk voor gas.'] },
      { v: 'Wat is verdampen?', o: ['vast naar vloeibaar', 'vloeibaar naar gas', 'gas naar vloeibaar', 'vloeibaar naar vast'], c: 1, d: 2, uo: ['Vast naar vloeibaar is smelten.', 'Klopt: verdampen is vloeibaar naar gas.', 'Gas naar vloeibaar is condenseren.', 'Vloeibaar naar vast is stollen.'] },
    ]),

  V('C', 'Chemische reacties',
    `Bij een <strong>chemische reactie</strong> verdwijnen <strong>beginstoffen</strong> en ontstaan er nieuwe stoffen, de <strong>reactieproducten</strong>. Je noteert dit in een <strong>reactieschema</strong>.`,
    [
      { h: '1. Kenmerken van een reactie', p: [
        `Bij een <strong>chemische reactie</strong> ontstaan er <strong>nieuwe stoffen</strong> met andere eigenschappen. Kenmerken zijn: er verdwijnen stoffen en er ontstaan andere, en er komt vaak <strong>energie</strong> vrij (warmte, licht) of er is energie nodig. De stoffen vooraf heten <strong>beginstoffen</strong>, de nieuwe stoffen <strong>reactieproducten</strong>.`] },
      { h: '2. Reactieschema, vormen en ontleden', p: [
        `Een <strong>reactieschema</strong> schrijf je als <em>beginstoffen → reactieproducten</em>. Bij een <strong>vormingsreactie</strong> maak je uit meerdere stoffen één nieuwe stof; bij <strong>ontleden</strong> valt één stof uiteen in meerdere. De pijl betekent "reageert tot".`] },
    ],
    [
      { t: 'Chemische reactie', d: 'een verandering waarbij nieuwe stoffen ontstaan', k: 'nieuwe stoffen ontstaan', fout: ['Faseovergang'] },
      { t: 'Beginstof', d: 'een stof die je vóór de reactie hebt', k: 'stof vooraf', fout: ['Reactieproduct'] },
      { t: 'Reactieproduct', d: 'een nieuwe stof die bij de reactie ontstaat', k: 'nieuwe stof na de reactie', fout: ['Beginstof'] },
      { t: 'Reactieschema', d: 'de notatie beginstoffen → reactieproducten', k: 'beginstoffen → producten', fout: ['Molecuulformule'] },
      { t: 'Vormingsreactie', d: 'uit meerdere stoffen ontstaat één nieuwe stof', k: 'samen tot één stof', fout: ['Ontleden'] },
      { t: 'Ontleden', d: 'één stof valt uiteen in meerdere stoffen', k: 'uiteen in meerdere', fout: ['Vormingsreactie'] },
      { t: 'Faseovergang', d: 'een verandering van fase zonder nieuwe stof', k: 'geen nieuwe stof', fout: ['Chemische reactie'] },
      { t: 'Reactie-energie', d: 'de energie die vrijkomt of nodig is bij een reactie', k: 'energie bij een reactie', fout: ['Chemische reactie'] },
    ],
    [
      { v: 'Wat ontstaat er bij een chemische reactie?', o: ['nieuwe stoffen', 'alleen warmte', 'niets nieuws', 'alleen een andere fase'], c: 0, d: 1, uo: ['Klopt: bij een chemische reactie ontstaan nieuwe stoffen.', 'Warmte komt vaak vrij, maar dat is niet het kenmerk.', 'Er verandert juist iets: nieuwe stoffen.', 'Een andere fase zonder nieuwe stof is geen chemische reactie.'], uh: 'Chemische reactie = nieuwe stoffen. Faseovergang = zelfde stof.' },
      { v: 'Hoe noem je de stoffen vóór een reactie?', o: ['beginstoffen', 'reactieproducten', 'mengsels', 'elementen'], c: 0, d: 1, uo: ['Klopt: de stoffen vooraf heten beginstoffen.', 'Reactieproducten ontstaan juist na de reactie.', 'Een mengsel is iets anders.', 'Een element is een soort stof, geen rol in de reactie.'] },
      { v: 'Wat is een reactieproduct?', o: ['een stof vooraf', 'een nieuwe stof na de reactie', 'een filter', 'een fase'], c: 1, d: 2, uo: ['Een stof vooraf is een beginstof.', 'Klopt: een reactieproduct ontstaat tijdens de reactie.', 'Een filter is gereedschap.', 'Een fase is vast, vloeibaar of gas.'] },
      { v: 'Wat betekent de pijl in een reactieschema?', o: ['reageert tot', 'is gelijk aan', 'plus', 'gedeeld door'], c: 0, d: 2, uo: ['Klopt: de pijl betekent "reageert tot".', 'Gelijk aan zou een isgelijkteken zijn.', 'Plus staat tussen stoffen aan dezelfde kant.', 'Delen hoort hier niet.'], uh: 'Reactieschema: beginstoffen → reactieproducten.' },
      { v: 'Wat gebeurt er bij ontleden?', o: ['meerdere stoffen worden één', 'één stof valt uiteen in meerdere', 'er verandert niets', 'alleen de fase verandert'], c: 1, d: 2, uo: ['Meerdere stoffen samen is juist een vormingsreactie.', 'Klopt: bij ontleden valt één stof uiteen in meerdere.', 'Er verandert wel degelijk iets.', 'Een faseovergang is geen ontleding.'] },
      { v: 'Smelten van ijs is...', o: ['een chemische reactie', 'een faseovergang, geen nieuwe stof', 'een ontleding', 'een verbranding'], c: 1, d: 3, uo: ['Er ontstaat geen nieuwe stof, dus geen chemische reactie.', 'Klopt: het blijft water; alleen de fase verandert.', 'Ontleden geeft nieuwe stoffen; hier niet.', 'Verbranden is iets heel anders.'] },
      { v: 'Wat is een vormingsreactie?', o: ['uit meerdere stoffen ontstaat één nieuwe stof', 'één stof valt uiteen', 'een faseovergang', 'een mengsel maken'], c: 0, d: 2, uo: ['Klopt: bij een vormingsreactie ontstaat uit meerdere stoffen één nieuwe.', 'Uiteenvallen is ontleden.', 'Een faseovergang geeft geen nieuwe stof.', 'Een mengsel maken is geen chemische reactie.'] },
      { v: 'Wat is vaak een teken van een chemische reactie?', o: ['er komt energie vrij', 'de fles wordt zwaarder', 'de kleur blijft altijd gelijk', 'er gebeurt niets'], c: 0, d: 2, uo: ['Klopt: er komt vaak warmte of licht (energie) vrij.', 'De totale massa verandert niet zomaar.', 'Vaak verandert juist de kleur.', 'Er gebeurt wel degelijk iets.'] },
    ]),

  V('D', 'Verbranden en milieu',
    `<strong>Verbranden</strong> is een reactie van een <strong>brandstof</strong> met <strong>zuurstof</strong>, waarbij energie vrijkomt. Vaak ontstaan <strong>koolstofdioxide</strong> en water. Te veel CO₂ versterkt het <strong>broeikaseffect</strong>.`,
    [
      { h: '1. De verbrandingsreactie', p: [
        `<strong>Verbranden</strong> is een reactie van een <strong>brandstof</strong> met <strong>zuurstof</strong> uit de lucht, waarbij <strong>warmte</strong> vrijkomt. Voor vuur zijn drie dingen nodig (de <strong>branddriehoek</strong>): brandstof, zuurstof en een hoge genoeg temperatuur. Bij verbranding van veel brandstoffen ontstaan <strong>koolstofdioxide</strong> (CO₂) en <strong>water</strong>.`] },
      { h: '2. Milieu', p: [
        `Bij verbranding van <strong>fossiele brandstoffen</strong> komt veel <strong>CO₂</strong> vrij. Dat versterkt het <strong>broeikaseffect</strong>, waardoor de aarde opwarmt. Ook ontstaat <strong>luchtvervuiling</strong>, bijvoorbeeld door fijnstof. Bij onvolledige verbranding ontstaat het giftige <strong>koolstofmonoxide</strong> (CO).`] },
    ],
    [
      { t: 'Verbranden', d: 'een reactie van een brandstof met zuurstof, met energie', k: 'brandstof + zuurstof', fout: ['Smelten'] },
      { t: 'Brandstof', d: 'een stof die je verbrandt om energie te krijgen', k: 'stof die je verbrandt', fout: ['Zuurstof'] },
      { t: 'Zuurstof', d: 'het gas uit de lucht dat nodig is voor verbranding', k: 'nodig voor vuur', fout: ['Koolstofdioxide'] },
      { t: 'Branddriehoek', d: 'brandstof, zuurstof en warmte samen nodig voor vuur', k: 'brandstof, zuurstof, warmte', fout: ['Verbranden'] },
      { t: 'Koolstofdioxide', d: 'het gas CO₂ dat bij verbranding ontstaat', k: 'CO₂ bij verbranding', fout: ['Koolstofmonoxide', 'Zuurstof'] },
      { t: 'Broeikaseffect', d: 'de opwarming van de aarde door broeikasgassen zoals CO₂', k: 'aarde warmt op', fout: ['Luchtvervuiling'] },
      { t: 'Fossiele brandstof', d: 'brandstof uit de aarde, zoals aardolie, gas en steenkool', k: 'olie, gas, steenkool', fout: ['Brandstof'] },
      { t: 'Koolstofmonoxide', d: 'het giftige gas CO bij onvolledige verbranding', k: 'giftig CO', fout: ['Koolstofdioxide'] },
      { t: 'Luchtvervuiling', d: 'schadelijke stoffen in de lucht, zoals fijnstof', k: 'schadelijke stoffen in de lucht', fout: ['Broeikaseffect'] },
    ],
    [
      { v: 'Wat is verbranden?', o: ['een reactie van brandstof met zuurstof', 'het smelten van een stof', 'het oplossen van een stof', 'het filtreren van lucht'], c: 0, d: 1, uo: ['Klopt: verbranden is een reactie van brandstof met zuurstof.', 'Smelten is een faseovergang.', 'Oplossen is iets anders.', 'Filtreren is een scheidingsmethode.'], uh: 'Verbranden = brandstof + zuurstof → energie + CO₂ en water.' },
      { v: 'Welk gas is nodig om iets te laten branden?', o: ['zuurstof', 'koolstofdioxide', 'stikstof', 'waterstof'], c: 0, d: 1, uo: ['Klopt: zuurstof is nodig voor verbranding.', 'CO₂ ontstaat juist bij verbranding en dooft vuur.', 'Stikstof doet niet mee aan gewone verbranding.', 'Waterstof is zelf een brandstof, niet wat je nodig hebt.'] },
      { v: 'Welke drie dingen staan in de branddriehoek?', o: ['brandstof, zuurstof en warmte', 'water, lucht en licht', 'olie, gas en kolen', 'CO₂, water en warmte'], c: 0, d: 2, uo: ['Klopt: vuur heeft brandstof, zuurstof en warmte nodig.', 'Water dooft juist vuur.', 'Dat zijn soorten brandstof, niet de driehoek.', 'Dat zijn producten van verbranding.'], uh: 'Branddriehoek: brandstof + zuurstof + warmte.' },
      { v: 'Welk gas ontstaat bij verbranding en versterkt het broeikaseffect?', o: ['zuurstof', 'koolstofdioxide', 'stikstof', 'helium'], c: 1, d: 2, uo: ['Zuurstof wordt juist verbruikt.', 'Klopt: koolstofdioxide (CO₂) versterkt het broeikaseffect.', 'Stikstof speelt hierin geen hoofdrol.', 'Helium ontstaat niet bij verbranding.'] },
      { v: 'Wat is een gevolg van te veel CO₂ in de lucht?', o: ['de aarde warmt op', 'de aarde koelt af', 'er komt meer zuurstof', 'er verandert niets'], c: 0, d: 2, uo: ['Klopt: meer CO₂ versterkt het broeikaseffect en de aarde warmt op.', 'Het tegenovergestelde gebeurt.', 'CO₂ maakt geen zuurstof.', 'Er verandert wel degelijk iets aan het klimaat.'] },
      { v: 'Wat zijn fossiele brandstoffen?', o: ['aardolie, aardgas en steenkool', 'water en lucht', 'zonne- en windenergie', 'zuurstof en stikstof'], c: 0, d: 2, uo: ['Klopt: aardolie, aardgas en steenkool zijn fossiele brandstoffen.', 'Water en lucht zijn geen brandstoffen.', 'Zon en wind zijn juist duurzame bronnen.', 'Dat zijn gassen in de lucht.'] },
      { v: 'Welk giftig gas ontstaat bij onvolledige verbranding?', o: ['koolstofdioxide', 'koolstofmonoxide', 'zuurstof', 'waterdamp'], c: 1, d: 3, uo: ['CO₂ is niet het giftige gas dat hier bedoeld wordt.', 'Klopt: bij onvolledige verbranding ontstaat het giftige CO.', 'Zuurstof wordt verbruikt.', 'Waterdamp is niet giftig.'] },
      { v: 'Wat is luchtvervuiling?', o: ['schadelijke stoffen in de lucht', 'schone berglucht', 'zuurstof in water', 'een faseovergang'], c: 0, d: 1, uo: ['Klopt: luchtvervuiling zijn schadelijke stoffen in de lucht, zoals fijnstof.', 'Schone lucht is juist het tegenovergestelde.', 'Zuurstof in water is iets anders.', 'Een faseovergang heeft er niets mee te maken.'] },
    ]),

  V('E', 'Productieprocessen en toepassingen',
    `In een <strong>productieproces</strong> maak je van <strong>grondstoffen</strong> via <strong>halffabricaten</strong> een <strong>eindproduct</strong>. Veel producten zijn van <strong>kunststof</strong>, die je soms kunt <strong>recyclen</strong>.`,
    [
      { h: '1. Van grondstof tot eindproduct', p: [
        `Een <strong>productieproces</strong> begint met een <strong>grondstof</strong> (bijvoorbeeld aardolie of ijzererts). Onderweg ontstaan <strong>halffabricaten</strong> (nog niet klaar, zoals plaatstaal), en aan het eind het <strong>eindproduct</strong> (zoals een auto).`] },
      { h: '2. Kunststoffen en recyclen', p: [
        `<strong>Kunststof</strong> (plastic) wordt gemaakt uit aardolie en heeft handige eigenschappen: licht, sterk en goedkoop, maar vaak slecht afbreekbaar. Door te <strong>recyclen</strong> gebruik je materiaal opnieuw, wat grondstoffen en energie bespaart.`] },
    ],
    [
      { t: 'Grondstof', d: 'de ruwe stof waarmee je begint', k: 'ruwe beginstof', fout: ['Eindproduct', 'Halffabricaat'] },
      { t: 'Halffabricaat', d: 'een tussenproduct dat nog niet klaar is', k: 'tussenproduct', fout: ['Eindproduct', 'Grondstof'] },
      { t: 'Eindproduct', d: 'het afgewerkte product voor de gebruiker', k: 'afgewerkt product', fout: ['Grondstof'] },
      { t: 'Productieproces', d: 'de stappen van grondstof naar eindproduct', k: 'grondstof naar product', fout: ['Halffabricaat'] },
      { t: 'Kunststof', d: 'plastic, gemaakt uit aardolie', k: 'plastic uit olie', fout: ['Grondstof'] },
      { t: 'Recyclen', d: 'materiaal opnieuw gebruiken', k: 'opnieuw gebruiken', fout: ['Duurzaam'] },
      { t: 'Duurzaam', d: 'zuinig met grondstoffen en milieu', k: 'zuinig en milieuvriendelijk', fout: ['Recyclen'] },
      { t: 'Eigenschap', d: 'een kenmerk waarop je een materiaal kiest, zoals sterkte', k: 'kenmerk om te kiezen', fout: ['Kunststof'] },
    ],
    [
      { v: 'Waarmee begint een productieproces?', o: ['met een grondstof', 'met het eindproduct', 'met de verkoop', 'met afval'], c: 0, d: 1, uo: ['Klopt: je begint met een grondstof.', 'Het eindproduct is juist het resultaat.', 'Verkoop komt na de productie.', 'Afval is geen startpunt.'], uh: 'Grondstof → halffabricaat → eindproduct.' },
      { v: 'Wat is een halffabricaat?', o: ['een ruwe grondstof', 'een tussenproduct dat nog niet klaar is', 'het afgewerkte product', 'een soort afval'], c: 1, d: 2, uo: ['Een ruwe grondstof is het beginpunt.', 'Klopt: een halffabricaat is een tussenproduct.', 'Het afgewerkte product is het eindproduct.', 'Afval is iets anders.'] },
      { v: 'Waaruit wordt kunststof (plastic) meestal gemaakt?', o: ['aardolie', 'water', 'zand', 'lucht'], c: 0, d: 2, uo: ['Klopt: kunststof wordt uit aardolie gemaakt.', 'Water is geen grondstof voor plastic.', 'Zand is grondstof voor glas, niet plastic.', 'Lucht is geen grondstof voor plastic.'] },
      { v: 'Wat is het voordeel van recyclen?', o: ['het bespaart grondstoffen en energie', 'het kost meer grondstoffen', 'het maakt meer afval', 'het gebruikt meer olie'], c: 0, d: 2, uo: ['Klopt: recyclen bespaart grondstoffen en energie.', 'Recyclen bespaart juist grondstoffen.', 'Recyclen vermindert afval.', 'Recyclen gebruikt juist minder olie.'], uh: 'Recyclen = materiaal opnieuw gebruiken, dus duurzamer.' },
      { v: 'Wat is het eindproduct in een fabriek?', o: ['de ruwe grondstof', 'het afgewerkte product', 'een tussenproduct', 'het afval'], c: 1, d: 1, uo: ['De ruwe grondstof is het beginpunt.', 'Klopt: het eindproduct is het afgewerkte product.', 'Een tussenproduct is een halffabricaat.', 'Afval is geen eindproduct.'] },
      { v: 'Wat betekent duurzaam?', o: ['zuinig met grondstoffen en milieu', 'zo veel mogelijk verbruiken', 'zo goedkoop mogelijk', 'zo snel mogelijk'], c: 0, d: 2, uo: ['Klopt: duurzaam is zuinig met grondstoffen en milieu.', 'Veel verbruiken is juist niet duurzaam.', 'Goedkoop is niet hetzelfde als duurzaam.', 'Snelheid zegt niets over duurzaamheid.'] },
      { v: 'Waarom kies je een materiaal op zijn eigenschappen?', o: ['om het geschikt te laten zijn voor het doel', 'om het duurder te maken', 'om het zwaarder te maken', 'dat maakt niet uit'], c: 0, d: 2, uo: ['Klopt: je kiest een materiaal dat past bij het doel (sterk, licht).', 'Duurder maken is geen doel.', 'Zwaarder is meestal niet gewenst.', 'De keuze maakt wel degelijk uit.'] },
    ]),

  V('F', 'Productonderzoek',
    `Bij <strong>productonderzoek</strong> test je de <strong>eigenschappen</strong> van een materiaal met een <strong>proef</strong>. Je stelt een <strong>hypothese</strong> op, <strong>meet</strong> netjes en let op <strong>veiligheid</strong> via <strong>gevaarsymbolen</strong>.`,
    [
      { h: '1. Onderzoek doen', p: [
        `Je onderzoekt een product door zijn <strong>eigenschappen</strong> te testen (sterkte, hardheid, of iets water doorlaat). Je begint met een <strong>hypothese</strong> (een verwachting), doet een <strong>proef</strong> en <strong>meet</strong> zorgvuldig. Uit de metingen trek je een <strong>conclusie</strong>.`] },
      { h: '2. Veilig werken', p: [
        `In het lab werk je veilig. <strong>Gevaarsymbolen</strong> op verpakkingen waarschuwen voor bijvoorbeeld <strong>giftige</strong>, <strong>brandbare</strong> of <strong>bijtende</strong> stoffen. Draag zo nodig een veiligheidsbril en lees de waarschuwingen.`] },
    ],
    [
      { t: 'Hypothese', d: 'een verwachting die je vooraf opstelt', k: 'verwachting vooraf', fout: ['Conclusie'] },
      { t: 'Proef', d: 'een test om iets te onderzoeken', k: 'test/experiment', fout: ['Hypothese'] },
      { t: 'Meten', d: 'een grootte nauwkeurig bepalen met een meetinstrument', k: 'nauwkeurig bepalen', fout: ['Schatten'] },
      { t: 'Conclusie', d: 'wat je uit de metingen besluit', k: 'besluit uit de proef', fout: ['Hypothese'] },
      { t: 'Eigenschap', d: 'een kenmerk van een materiaal, zoals sterkte', k: 'kenmerk van materiaal', fout: ['Hypothese'] },
      { t: 'Gevaarsymbool', d: 'een teken dat waarschuwt voor gevaar van een stof', k: 'waarschuwt voor gevaar', fout: ['Eigenschap'] },
      { t: 'Giftig', d: 'schadelijk voor je gezondheid bij binnenkrijgen', k: 'schadelijk/giftig', fout: ['Brandbaar'] },
      { t: 'Brandbaar', d: 'kan makkelijk vlam vatten', k: 'vat makkelijk vlam', fout: ['Giftig'] },
    ],
    [
      { v: 'Wat is een hypothese?', o: ['een verwachting die je vooraf opstelt', 'het resultaat achteraf', 'een meetinstrument', 'een gevaarsymbool'], c: 0, d: 1, uo: ['Klopt: een hypothese is je verwachting vooraf.', 'Het resultaat achteraf is de conclusie.', 'Een meetinstrument is gereedschap.', 'Een gevaarsymbool is een waarschuwing.'], uh: 'Hypothese (vooraf) → proef → meten → conclusie (achteraf).' },
      { v: 'Wat doe je na een proef met je metingen?', o: ['een conclusie trekken', 'een hypothese verzinnen', 'de proef vergeten', 'niets'], c: 0, d: 2, uo: ['Klopt: uit de metingen trek je een conclusie.', 'De hypothese stel je juist vooraf op.', 'Je gebruikt de proef juist.', 'De metingen zijn er om iets te besluiten.'] },
      { v: 'Waarvoor waarschuwt een gevaarsymbool?', o: ['voor gevaar van een stof', 'voor de prijs', 'voor de kleur', 'voor het gewicht'], c: 0, d: 1, uo: ['Klopt: een gevaarsymbool waarschuwt voor gevaar, zoals giftig of brandbaar.', 'De prijs staat er los van.', 'Kleur is geen gevaar.', 'Gewicht is geen gevaarsymbool.'] },
      { v: 'Wat betekent het gevaarsymbool voor "brandbaar"?', o: ['de stof kan makkelijk vlam vatten', 'de stof is giftig', 'de stof is duur', 'de stof is zwaar'], c: 0, d: 2, uo: ['Klopt: brandbaar betekent dat de stof makkelijk vlam vat.', 'Giftig is een ander symbool.', 'Prijs is geen gevaar.', 'Gewicht is geen gevaar.'] },
      { v: 'Waarom meet je in plaats van schatten?', o: ['om een nauwkeurig resultaat te krijgen', 'omdat het sneller is', 'omdat het altijd moet', 'om tijd te rekken'], c: 0, d: 2, uo: ['Klopt: meten geeft een nauwkeurig, betrouwbaar resultaat.', 'Schatten is juist sneller, maar minder precies.', 'Het gaat om nauwkeurigheid, niet om een regel.', 'Meten is geen tijdrekken.'] },
      { v: 'Wat test je bij productonderzoek?', o: ['de eigenschappen van een materiaal', 'de prijs in de winkel', 'de reclame', 'de naam'], c: 0, d: 1, uo: ['Klopt: je test eigenschappen zoals sterkte of hardheid.', 'De prijs test je niet in het lab.', 'Reclame is geen eigenschap.', 'De naam zegt niets over de kwaliteit.'] },
      { v: 'Wat is een giftige stof?', o: ['schadelijk voor je gezondheid', 'altijd brandbaar', 'altijd zwaar', 'altijd duur'], c: 0, d: 2, uo: ['Klopt: een giftige stof is schadelijk voor je gezondheid.', 'Giftig is niet hetzelfde als brandbaar.', 'Gewicht heeft er niets mee te maken.', 'Prijs heeft er niets mee te maken.'] },
    ]),

  V('G', 'Grondstoffen en synthese',
    `<strong>Grondstoffen</strong> haal je uit de natuur; sommige zijn <strong>fossiel</strong> en raken op. Bij <strong>synthese</strong> maak je nieuwe stoffen, zoals <strong>kunststoffen</strong> uit kleine bouwstenen.`,
    [
      { h: '1. Grondstoffen', p: [
        `<strong>Grondstoffen</strong> komen uit de natuur: mineralen, hout, aardolie. <strong>Fossiele grondstoffen</strong> (olie, gas, steenkool) zijn <strong>eindig</strong>: ze raken op. <strong>Duurzame</strong> of hernieuwbare bronnen (zon, wind, biomassa) raken niet op.`] },
      { h: '2. Synthese van nieuwe stoffen', p: [
        `Bij <strong>synthese</strong> maak je een nieuwe stof uit andere stoffen. Zo maak je <strong>kunststoffen</strong> door veel kleine moleculen aan elkaar te koppelen tot een lange keten: een <strong>polymeer</strong>. Zo ontstaan materialen met precies de gewenste eigenschappen.`] },
    ],
    [
      { t: 'Grondstof', d: 'een stof die je uit de natuur haalt', k: 'uit de natuur', fout: ['Synthese'] },
      { t: 'Fossiele grondstof', d: 'grondstof uit de aarde zoals olie, gas en steenkool', k: 'olie, gas, steenkool', fout: ['Hernieuwbaar'] },
      { t: 'Eindig', d: 'raakt op; is niet onuitputtelijk', k: 'raakt op', fout: ['Hernieuwbaar'] },
      { t: 'Hernieuwbaar', d: 'raakt niet op, zoals zon en wind', k: 'raakt niet op', fout: ['Eindig', 'Fossiele grondstof'] },
      { t: 'Synthese', d: 'het maken van een nieuwe stof uit andere stoffen', k: 'nieuwe stof maken', fout: ['Grondstof'] },
      { t: 'Kunststof', d: 'een door de mens gemaakte stof (plastic)', k: 'gemaakt plastic', fout: ['Polymeer'] },
      { t: 'Polymeer', d: 'een lange keten van veel gekoppelde moleculen', k: 'lange molecuulketen', fout: ['Kunststof'] },
      { t: 'Duurzaam', d: 'zuinig met grondstoffen, met oog op de toekomst', k: 'zuinig voor de toekomst', fout: ['Hernieuwbaar'] },
    ],
    [
      { v: 'Wat is een grondstof?', o: ['een stof die je uit de natuur haalt', 'een afgewerkt product', 'een gevaarsymbool', 'een meetinstrument'], c: 0, d: 1, uo: ['Klopt: een grondstof komt uit de natuur.', 'Een afgewerkt product is het eindproduct.', 'Een gevaarsymbool is een waarschuwing.', 'Een meetinstrument is gereedschap.'], uh: 'Fossiel (olie, gas, kolen) = eindig. Zon en wind = hernieuwbaar.' },
      { v: 'Welke grondstoffen raken op (zijn eindig)?', o: ['fossiele grondstoffen', 'zonlicht', 'wind', 'water uit de regen'], c: 0, d: 2, uo: ['Klopt: fossiele grondstoffen zoals olie en gas raken op.', 'Zonlicht raakt niet op.', 'Wind is hernieuwbaar.', 'Regen komt telkens terug.'] },
      { v: 'Wat betekent hernieuwbaar?', o: ['het raakt niet op', 'het raakt snel op', 'het is giftig', 'het is duur'], c: 0, d: 2, uo: ['Klopt: hernieuwbare bronnen raken niet op.', 'Dat is juist eindig.', 'Hernieuwbaar zegt niets over giftig.', 'Prijs is een ander punt.'] },
      { v: 'Wat is synthese?', o: ['een nieuwe stof maken uit andere stoffen', 'een stof scheiden', 'een stof smelten', 'een stof wegen'], c: 0, d: 2, uo: ['Klopt: bij synthese maak je een nieuwe stof.', 'Scheiden is het tegenovergestelde.', 'Smelten is een faseovergang.', 'Wegen is meten, geen synthese.'], uh: 'Synthese = nieuwe stof maken (bv. kunststof uit kleine moleculen).' },
      { v: 'Wat is een polymeer?', o: ['een lange keten van veel gekoppelde moleculen', 'één enkel atoom', 'een mengsel', 'een gevaarsymbool'], c: 0, d: 3, uo: ['Klopt: een polymeer is een lange keten van veel moleculen.', 'Eén atoom is juist heel klein.', 'Een polymeer is een zuivere stof, geen mengsel.', 'Een gevaarsymbool is een waarschuwing.'] },
      { v: 'Welke bron is duurzaam (hernieuwbaar)?', o: ['aardolie', 'zonne-energie', 'steenkool', 'aardgas'], c: 1, d: 2, uo: ['Aardolie is juist fossiel en eindig.', 'Klopt: zonne-energie is een hernieuwbare bron.', 'Steenkool is fossiel en raakt op.', 'Aardgas is fossiel en eindig.'] },
      { v: 'Waarom maak je kunststoffen via synthese?', o: ['om materiaal met de gewenste eigenschappen te krijgen', 'om afval te maken', 'om grondstoffen te verspillen', 'om niets te bereiken'], c: 0, d: 2, uo: ['Klopt: door synthese maak je materiaal met precies de gewenste eigenschappen.', 'Afval maken is geen doel.', 'Verspillen is geen doel.', 'Er wordt juist iets bruikbaars gemaakt.'] },
    ]),
];
