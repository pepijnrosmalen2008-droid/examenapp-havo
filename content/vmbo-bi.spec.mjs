// VMBO GL/TL - Biologie. Gouden-stijl contentspec → scripts/expand-leerdoelen.mjs.
// Per domein: intro + secties (prosa, formuleboxen, voorbeeldopgaven) voor de
// samenvatting, plus concepten (t/d/k/fout) die de vraagbank én flashcards voeden.
const V = (domein, naam, intro, secties, concepten, vragen) => ({ niveau: 'vmbo', vak: 'bi', domein, naam, intro, secties, concepten, vragen });

export default [
  V('A', 'Cellen aan de basis',
    `Alle levende wezens bestaan uit <strong>cellen</strong>. In dit domein leer je hoe cellen zijn opgebouwd, waarin een plantencel verschilt van een dierlijke cel, en hoe eigenschappen via <strong>DNA</strong> worden doorgegeven bij een <strong>monohybride kruising</strong>.`,
    [
      { h: '1. Van cel tot organisme', p: [
        `De <strong>cel</strong> is de kleinste bouwsteen van een organisme. Cellen met dezelfde vorm en functie vormen samen een <strong>weefsel</strong> (bijvoorbeeld spierweefsel). Meerdere weefsels die samen een taak uitvoeren vormen een <strong>orgaan</strong>, zoals het hart. Organen die samenwerken aan één functie vormen een <strong>orgaanstelsel</strong>, zoals het bloedvatenstelsel.`,
        `Deze volgorde van klein naar groot (cel → weefsel → orgaan → orgaanstelsel → organisme) heet de organisatie van het lichaam. Elke laag is opgebouwd uit de laag eronder.`] },
      { h: '2. De bouw van een cel', p: [
        `Elke cel wordt omsloten door een <strong>celmembraan</strong> dat bepaalt welke stoffen erin en eruit gaan. In de <strong>celkern</strong> ligt het <strong>DNA</strong>. De rest van de cel is gevuld met <strong>cytoplasma</strong>, de vloeistof waarin de celonderdelen liggen.`,
        `Een plantencel heeft drie extra onderdelen die een dierlijke cel niet heeft: een stevige <strong>celwand</strong>, <strong>bladgroenkorrels</strong> voor de fotosynthese en een grote <strong>vacuole</strong> met vocht.`] },
      { h: '3. DNA, genen en chromosomen', p: [
        `Het <strong>DNA</strong> bevat alle erfelijke informatie. Een klein stukje DNA met de code voor één eigenschap heet een <strong>gen</strong>. Als DNA sterk wordt opgerold, vormt het een <strong>chromosoom</strong>; die zijn zichtbaar bij een celdeling.`,
        `Het <strong>genotype</strong> is de erfelijke aanleg (alle genen), het <strong>fenotype</strong> is wat je daarvan ziet: de waarneembare eigenschappen. Het fenotype ontstaat uit het genotype én invloeden van de omgeving.`] },
      { h: '4. Kruisingen en overerving', p: [
        `Van elk gen heb je twee versies (allelen), één van elke ouder. Een <strong>dominant allel</strong> bepaalt de eigenschap al als het één keer aanwezig is; een <strong>recessief allel</strong> komt alleen tot uiting als beide allelen recessief zijn. Bij een <strong>monohybride kruising</strong> volg je één eigenschap.`],
        worked: { q: 'Kruis twee planten met genotype Aa. A (rood) is dominant over a (wit). Welke kleurverhouding krijg je?', steps: ['Zet de allelen in een kruisingsschema: Aa × Aa.', 'De mogelijke combinaties zijn AA, Aa, Aa en aa.', 'AA en Aa geven rood, aa geeft wit.'], ans: 'De verhouding is 3 rood : 1 wit.' } },
      { h: '5. Natuurlijke selectie', p: [
        `Individuen binnen een soort verschillen van elkaar. Bij <strong>natuurlijke selectie</strong> overleven en planten de individuen zich voort die het best zijn aangepast aan hun omgeving. Zo geven zij hun gunstige eigenschappen door en verandert een soort langzaam.`] },
    ],
    [
      { t: 'Cel', d: 'de kleinste bouwsteen van een organisme', k: 'kleinste bouwsteen', fout: ['Weefsel', 'Orgaan'] },
      { t: 'Weefsel', d: 'een groep cellen met dezelfde vorm en functie', k: 'groep gelijke cellen', fout: ['Cel', 'Orgaan'] },
      { t: 'Orgaan', d: 'een structuur van meerdere weefsels met een eigen taak', k: 'meerdere weefsels met een taak', fout: ['Weefsel', 'Orgaanstelsel'] },
      { t: 'Orgaanstelsel', d: 'organen die samen één functie uitvoeren', k: 'samenwerkende organen', fout: ['Orgaan', 'Weefsel'] },
      { t: 'Celmembraan', d: 'het dunne laagje dat de cel omsluit en stoffen doorlaat', k: 'omhulsel van de cel', fout: ['Celwand', 'Celkern'] },
      { t: 'Celkern', d: 'het celonderdeel waarin het DNA ligt', k: 'bevat het DNA', fout: ['Cytoplasma', 'Celmembraan'] },
      { t: 'Cytoplasma', d: 'de vloeistof in de cel waarin de onderdelen liggen', k: 'vloeistof in de cel', fout: ['Celkern', 'Vacuole'] },
      { t: 'Celwand', d: 'de stevige buitenlaag om een plantencel', k: 'stevige laag bij planten', fout: ['Celmembraan'] },
      { t: 'Bladgroenkorrel', d: 'plantencelonderdeel dat de fotosynthese uitvoert', k: 'doet fotosynthese', fout: ['Vacuole', 'Celwand'] },
      { t: 'Vacuole', d: 'een grote blaas met vocht in een plantencel', k: 'vochtblaas in plantencel', fout: ['Bladgroenkorrel', 'Cytoplasma'] },
      { t: 'Chromosoom', d: 'een streng van sterk opgerold DNA in de celkern', k: 'opgerold DNA', fout: ['Gen', 'DNA'] },
      { t: 'DNA', d: 'de stof met de erfelijke informatie', k: 'erfelijke informatie', fout: ['Gen', 'Chromosoom'] },
      { t: 'Gen', d: 'een stukje DNA met de code voor één eigenschap', k: 'code voor een eigenschap', fout: ['DNA', 'Chromosoom'] },
      { t: 'Genotype', d: 'de erfelijke aanleg (de genen) van een organisme', k: 'de genen', fout: ['Fenotype', 'DNA'] },
      { t: 'Fenotype', d: 'de waarneembare eigenschappen van een organisme', k: 'zichtbare eigenschappen', fout: ['Genotype'] },
      { t: 'Dominant allel', d: 'een allel dat het fenotype al bepaalt als het aanwezig is', k: 'overheerst altijd', fout: ['Recessief allel'] },
      { t: 'Recessief allel', d: 'een allel dat alleen tot uiting komt bij twee exemplaren', k: 'alleen dubbel zichtbaar', fout: ['Dominant allel'] },
      { t: 'Natuurlijke selectie', d: 'het beter overleven en voortplanten van best aangepaste individuen', k: 'best aangepasten overleven', fout: ['Fenotype'] },
    ],
    [
      { v: 'Cellen met dezelfde vorm en functie vormen samen...', o: ['een orgaan', 'een weefsel', 'een orgaanstelsel', 'een organisme'], c: 1, d: 2, u: 'Cellen met dezelfde vorm en functie vormen een weefsel.', uo: ['Een orgaan bestaat uit meerdere weefsels.', 'Klopt: gelijke cellen vormen een weefsel.', 'Een orgaanstelsel is een groep samenwerkende organen.', 'Een organisme is het hele levende wezen.'], uh: 'Cel → weefsel → orgaan → orgaanstelsel.' },
      { v: 'Het hart bestaat uit spierweefsel, zenuwweefsel en bloedvaten. Het hart is dus...', o: ['een cel', 'een weefsel', 'een orgaan', 'een orgaanstelsel'], c: 2, d: 2, u: 'Een orgaan bestaat uit meerdere weefsels die samen een taak hebben.', uo: ['Een cel is de kleinste bouwsteen.', 'Een weefsel is één soort cellen.', 'Klopt: meerdere weefsels vormen een orgaan.', 'Een orgaanstelsel is een groep organen.'], uh: 'Orgaan = meerdere weefsels met een taak.' },
      { v: 'Je ziet onder de microscoop een cel met een celwand en bladgroenkorrels. Wat voor cel is dit?', o: ['Een dierlijke cel', 'Een zenuwcel', 'Een rode bloedcel', 'Een plantencel'], c: 3, d: 3, u: 'Alleen plantencellen hebben een celwand en bladgroenkorrels.', uo: ['Een dierlijke cel heeft geen celwand.', 'Een zenuwcel is een dierlijke cel.', 'Een rode bloedcel is een dierlijke cel.', 'Klopt: celwand en bladgroen horen bij planten.'], uh: 'Celwand + bladgroen = plantencel.' },
      { v: 'Welk onderdeel heeft een plantencel wél en een dierlijke cel niet?', o: ['Een celwand', 'Een celkern', 'Een celmembraan', 'Cytoplasma'], c: 0, d: 2, u: 'De celwand komt alleen bij plantencellen voor.', uo: ['Klopt: de celwand is er bij planten.', 'Een celkern zit in beide.', 'Een celmembraan zit in beide.', 'Cytoplasma zit in beide.'], uh: 'Celwand: alleen bij planten.' },
      { v: 'Waar in de cel ligt het DNA?', o: ['In het cytoplasma', 'In de celkern', 'In het celmembraan', 'In de vacuole'], c: 1, d: 1, u: 'Het DNA ligt in de celkern.', uo: ['Het cytoplasma is de vloeistof eromheen.', 'Klopt: het DNA ligt in de celkern.', 'Het celmembraan is de buitenkant.', 'De vacuole is een vochtblaas in planten.'], uh: 'DNA zit in de celkern.' },
      { v: 'Hoe heet het dunne laagje dat de hele cel omsluit?', o: ['De celkern', 'De celwand', 'Het celmembraan', 'Het cytoplasma'], c: 2, d: 1, u: 'Het celmembraan omsluit de cel en regelt wat er in en uit gaat.', uo: ['De celkern bevat het DNA.', 'De celwand zit alleen bij planten.', 'Klopt: het celmembraan omsluit de cel.', 'Cytoplasma is de vloeistof in de cel.'], uh: 'Celmembraan = omhulsel van de cel.' },
      { v: 'Wat is de functie van de bladgroenkorrels in een plantencel?', o: ['Het DNA bewaren', 'De cel stevig maken', 'Vocht opslaan', 'Fotosynthese uitvoeren'], c: 3, d: 2, u: 'In de bladgroenkorrels vindt de fotosynthese plaats.', uo: ['Het DNA zit in de celkern.', 'De celwand maakt de cel stevig.', 'De vacuole slaat vocht op.', 'Klopt: bladgroen doet de fotosynthese.'], uh: 'Bladgroenkorrel = fotosynthese.' },
      { v: 'Hoe heet een stukje DNA met de code voor één eigenschap?', o: ['Een gen', 'Een chromosoom', 'Een cel', 'Een weefsel'], c: 0, d: 1, u: 'Een gen is een stukje DNA met de code voor één eigenschap.', uo: ['Klopt: een gen codeert voor één eigenschap.', 'Een chromosoom is opgerold DNA.', 'Een cel is de bouwsteen van het lichaam.', 'Een weefsel is een groep cellen.'], uh: 'Gen = code voor één eigenschap.' },
      { v: 'Wat is een chromosoom?', o: ['De vloeistof in de cel', 'Sterk opgerold DNA', 'Het omhulsel van de cel', 'Een soort weefsel'], c: 1, d: 2, u: 'Een chromosoom is sterk opgerold DNA in de celkern.', uo: ['De vloeistof in de cel is cytoplasma.', 'Klopt: een chromosoom is opgerold DNA.', 'Het omhulsel is het celmembraan.', 'Een weefsel is een groep cellen.'], uh: 'Chromosoom = opgerold DNA.' },
      { v: 'Iemand heeft blauwe ogen. Die blauwe ogen zijn een voorbeeld van het...', o: ['genotype', 'gen', 'fenotype', 'chromosoom'], c: 2, d: 2, u: 'Het fenotype is wat je aan de buitenkant ziet, zoals oogkleur.', uo: ['Het genotype is de erfelijke aanleg die je niet ziet.', 'Een gen is een stukje DNA.', 'Klopt: wat je ziet is het fenotype.', 'Een chromosoom is opgerold DNA.'], uh: 'Fenotype = wat je ziet.' },
      { v: 'Wat wordt bedoeld met het genotype van een organisme?', o: ['De zichtbare eigenschappen', 'Het aantal cellen', 'De grootte', 'De erfelijke aanleg (de genen)'], c: 3, d: 2, u: 'Het genotype is de erfelijke aanleg: alle genen samen.', uo: ['De zichtbare eigenschappen zijn het fenotype.', 'Het aantal cellen zegt niets over het genotype.', 'De grootte hoort bij het fenotype.', 'Klopt: het genotype is de erfelijke aanleg.'], uh: 'Genotype = de genen.' },
      { v: 'Je kruist twee planten met genotype Aa. A (rood) is dominant over a (wit). Welk deel is naar verwachting wit?', o: ['1 op de 4', '2 op de 4', '3 op de 4', '4 op de 4'], c: 0, d: 3, u: 'Aa × Aa geeft AA, Aa, Aa en aa: 1 op de 4 is aa (wit).', uo: ['Klopt: alleen aa is wit, dus 1 op de 4.', '2 op de 4 klopt niet, alleen aa is wit.', '3 op de 4 is juist rood.', 'Niet alle nakomelingen zijn wit.'], uh: 'Aa × Aa → 3 : 1.' },
      { v: 'Een plant heeft genotype Bb. B (paars) is dominant over b (wit). Welke kleur heeft de plant?', o: ['Wit', 'Paars', 'Half paars, half wit', 'Geen kleur'], c: 1, d: 3, u: 'Het dominante allel B bepaalt de kleur, dus de plant is paars.', uo: ['Wit zou alleen bij genotype bb.', 'Klopt: het dominante B maakt de plant paars.', 'Kleuren mengen niet bij dominantie.', 'Elke plant heeft een kleur.'], uh: 'Het dominante allel bepaalt het fenotype.' },
      { v: 'Een eigenschap komt alleen tot uiting als beide allelen ervoor aanwezig zijn. Zo\'n allel noem je...', o: ['dominant', 'een chromosoom', 'recessief', 'een fenotype'], c: 2, d: 2, u: 'Een recessief allel komt alleen tot uiting bij twee exemplaren.', uo: ['Een dominant allel is al bij één exemplaar zichtbaar.', 'Een chromosoom is opgerold DNA.', 'Klopt: recessief heeft er twee nodig.', 'Een fenotype is een zichtbare eigenschap.'], uh: 'Recessief = alleen dubbel zichtbaar.' },
      { v: 'Konijnen met een dikke vacht overleven de kou beter en krijgen meer jongen. Dit heet...', o: ['fotosynthese', 'een kruising', 'celdeling', 'natuurlijke selectie'], c: 3, d: 3, u: 'Bij natuurlijke selectie overleven de best aangepaste individuen en geven hun eigenschappen door.', uo: ['Fotosynthese is het maken van voedsel door planten.', 'Een kruising combineert twee ouders.', 'Celdeling is het delen van een cel.', 'Klopt: de best aangepaste konijnen overleven.'], uh: 'Best aangepast overleeft: natuurlijke selectie.' },
      { v: 'Waarom lijken kinderen vaak op hun ouders?', o: ['Doordat ze DNA van hun ouders erven', 'Doordat ze hetzelfde eten', 'Doordat ze in hetzelfde huis wonen', 'Doordat ze evenveel cellen hebben'], c: 0, d: 2, u: 'Kinderen erven DNA (genen) van hun ouders, met daarin de erfelijke eigenschappen.', uo: ['Klopt: ze erven het DNA van hun ouders.', 'Wat je eet verandert je DNA niet.', 'Waar je woont bepaalt je genen niet.', 'Iedereen heeft heel veel cellen.'], uh: 'Eigenschappen erf je via DNA.' },
      { v: 'Wat is de kleinste bouwsteen van een organisme?', o: ['Een orgaan', 'Een cel', 'Een weefsel', 'Een chromosoom'], c: 1, d: 1, u: 'De cel is de kleinste bouwsteen van een organisme.', uo: ['Een orgaan is uit veel cellen opgebouwd.', 'Klopt: de cel is de kleinste bouwsteen.', 'Een weefsel is een groep cellen.', 'Een chromosoom zit ín een cel.'], uh: 'Cel = kleinste bouwsteen.' },
      { v: 'Het hart en de bloedvaten werken samen om bloed rond te pompen. Samen vormen ze...', o: ['een weefsel', 'een orgaan', 'een orgaanstelsel', 'een cel'], c: 2, d: 2, u: 'Organen die samen één functie uitvoeren vormen een orgaanstelsel.', uo: ['Een weefsel is één soort cellen.', 'Een orgaan is één structuur, zoals het hart.', 'Klopt: samenwerkende organen vormen een orgaanstelsel.', 'Een cel is de kleinste bouwsteen.'], uh: 'Orgaanstelsel = samenwerkende organen.' },
      { v: 'Hoe heet de vloeistof in de cel waarin de onderdelen liggen?', o: ['De celkern', 'De celwand', 'De vacuole', 'Het cytoplasma'], c: 3, d: 2, u: 'Het cytoplasma is de vloeistof in de cel waarin de onderdelen zweven.', uo: ['De celkern bevat het DNA.', 'De celwand zit alleen bij planten.', 'De vacuole is een vochtblaas.', 'Klopt: het cytoplasma is de celvloeistof.'], uh: 'Cytoplasma = vloeistof in de cel.' },
      { v: 'Een grote vacuole vol vocht houdt een plant stevig. Bij welke cel hoort een grote vacuole?', o: ['Een plantencel', 'Een dierlijke cel', 'Een bacterie', 'Een rode bloedcel'], c: 0, d: 3, u: 'Een grote vacuole komt voor in plantencellen.', uo: ['Klopt: de vacuole hoort bij de plantencel.', 'Dierlijke cellen hebben geen grote vacuole.', 'Een bacterie is heel anders gebouwd.', 'Een rode bloedcel is een dierlijke cel.'], uh: 'Vacuole = plantencel.' },
      { v: 'Wat is de functie van het DNA in een cel?', o: ['De cel stevig maken', 'De erfelijke informatie bevatten', 'Vocht opslaan', 'Zuurstof vervoeren'], c: 1, d: 2, u: 'Het DNA bevat de erfelijke informatie van het organisme.', uo: ['Stevigheid komt van de celwand.', 'Klopt: DNA bevat de erfelijke informatie.', 'Vocht slaat de vacuole op.', 'Zuurstof vervoeren doen rode bloedcellen.'], uh: 'DNA = erfelijke informatie.' },
      { v: 'Bij een kruising is 3 op de 4 nakomelingen rood en 1 op de 4 wit. Wat weet je over de kleur rood?', o: ['Rood is recessief', 'Rood en wit zijn even sterk', 'Rood is dominant', 'Kleur is niet erfelijk'], c: 2, d: 3, u: 'De verhouding 3 op 1 hoort bij een dominante eigenschap (rood).', uo: ['Als rood recessief was, zou juist wit vaker voorkomen.', 'Dan zou je geen 3 op 1 zien.', 'Klopt: de verhouding 3 op 1 wijst op dominant rood.', 'Kleur wordt juist wél geërfd.'], uh: '3 op 1: de meerderheid is dominant.' },
      { v: 'Welke van deze is een voorbeeld van een weefsel?', o: ['Het hart', 'Het bloedvatenstelsel', 'Een levercel', 'Spierweefsel'], c: 3, d: 2, u: 'Spierweefsel bestaat uit cellen met dezelfde vorm en functie: een weefsel.', uo: ['Het hart is een orgaan.', 'Het bloedvatenstelsel is een orgaanstelsel.', 'Een levercel is één cel.', 'Klopt: spierweefsel is een weefsel.'], uh: 'Weefsel = groep gelijke cellen.' },
      { v: 'Twee planten met hetzelfde genotype: de ene staat in de zon en groeit groter. Wat bepaalt dit verschil?', o: ['De omgeving', 'Alleen het genotype', 'Het aantal chromosomen', 'Het celmembraan'], c: 0, d: 3, u: 'Het fenotype ontstaat uit het genotype én invloeden van de omgeving.', uo: ['Klopt: de omgeving (zon) maakt het verschil.', 'Het genotype is juist gelijk.', 'Het aantal chromosomen is gelijk.', 'Het celmembraan speelt hier geen rol.'], uh: 'Fenotype = genotype + omgeving.' },
    ]),

  V('B', 'In stand houden van het organisme',
    `Het lichaam heeft <strong>stevigheid</strong> en <strong>bescherming</strong> nodig. De <strong>huid</strong> houdt ziekteverwekkers en uitdroging tegen, en het <strong>skelet</strong> geeft steun en vorm.`,
    [
      { h: '1. De huid beschermt', p: [
        `De <strong>huid</strong> is het grootste orgaan en beschermt tegen uitdroging, kou en ziekteverwekkers. Bovenop ligt de <strong>opperhuid</strong>, met daaronder de <strong>lederhuid</strong> vol zenuwen en bloedvaten, en daaronder het <strong>onderhuids bindweefsel</strong> met vet dat warmte vasthoudt.`,
        `In de huid zitten klieren: een <strong>talgklier</strong> geeft huidvet af dat de huid soepel houdt, en een <strong>zweetklier</strong> geeft zweet af waarmee het lichaam afkoelt.`] },
      { h: '2. Steun en stevigheid', p: [
        `Het <strong>skelet</strong> geeft het lichaam vorm en steun en beschermt kwetsbare organen: de <strong>steunfunctie</strong> en de <strong>beschermende functie</strong>. Botten zijn hard, terwijl <strong>kraakbeen</strong> stevig maar buigzaam is, zoals in het oor en de neus.`] },
    ],
    [
      { t: 'Huid', d: 'het orgaan dat het lichaam bedekt en beschermt', k: 'beschermende bedekking', fout: ['Opperhuid', 'Lederhuid'] },
      { t: 'Opperhuid', d: 'de buitenste laag van de huid', k: 'buitenste huidlaag', fout: ['Lederhuid', 'Huid'] },
      { t: 'Lederhuid', d: 'de laag onder de opperhuid met zenuwen en bloedvaten', k: 'laag onder de opperhuid', fout: ['Opperhuid', 'Onderhuids bindweefsel'] },
      { t: 'Onderhuids bindweefsel', d: 'de vetlaag onder de lederhuid die warmte vasthoudt', k: 'vetlaag, houdt warmte vast', fout: ['Lederhuid'] },
      { t: 'Skelet', d: 'alle botten samen die het lichaam steun en vorm geven', k: 'alle botten samen', fout: ['Bot', 'Gewricht'] },
      { t: 'Bot', d: 'een hard orgaan dat steun geeft en bloedcellen kan maken', k: 'hard steunorgaan', fout: ['Kraakbeen', 'Skelet'] },
      { t: 'Kraakbeen', d: 'stevig maar buigzaam steunweefsel, bijvoorbeeld in het oor', k: 'buigzaam steunweefsel', fout: ['Bot'] },
      { t: 'Beschermende functie', d: 'het afschermen van organen tegen schade van buiten', k: 'organen afschermen', fout: ['Steunfunctie'] },
      { t: 'Steunfunctie', d: 'het geven van stevigheid en vorm aan het lichaam', k: 'stevigheid en vorm', fout: ['Beschermende functie'] },
      { t: 'Talgklier', d: 'huidklier die vet afgeeft en de huid soepel houdt', k: 'geeft huidvet af', fout: ['Zweetklier'] },
      { t: 'Zweetklier', d: 'huidklier die zweet afgeeft en zo het lichaam koelt', k: 'geeft zweet af, koelt', fout: ['Talgklier'] },
      { t: 'Ziekteverwekker', d: 'een micro-organisme dat een ziekte kan veroorzaken', k: 'veroorzaakt ziekte', fout: ['Bacterie', 'Virus'] },
    ]),

  V('C', 'Planten, dieren en hun samenhang',
    `In een ecosysteem hangen organismen met elkaar samen. <strong>Producenten</strong> maken met <strong>fotosynthese</strong> zelf voedsel, <strong>consumenten</strong> eten anderen en <strong>reducenten</strong> breken dood materiaal af. Zo blijven stoffen in een <strong>kringloop</strong> rondgaan.`,
    [
      { h: '1. Voedselketens en voedselwebben', p: [
        `Een <strong>voedselketen</strong> laat zien wie wie eet, in een rechte lijn: van <strong>producent</strong> naar <strong>consument</strong>. In werkelijkheid eten veel dieren van meerdere soorten; als je die ketens met elkaar verbindt, krijg je een <strong>voedselweb</strong>.`,
        `Je onderscheidt eters naar hun voedsel: een <strong>herbivoor</strong> eet planten, een <strong>carnivoor</strong> eet dieren en een <strong>omnivoor</strong> eet beide.`] },
      { h: '2. Producenten, consumenten en reducenten', p: [
        `<strong>Producenten</strong> (groene planten) maken hun eigen voedsel met <strong>fotosynthese</strong>. <strong>Consumenten</strong> kunnen dat niet en eten daarom andere organismen. <strong>Reducenten</strong>, zoals schimmels en bacteriën, breken dode resten af tot stoffen die planten weer kunnen gebruiken.`] },
      { h: '3. Kringlopen', p: [
        `Doordat producenten, consumenten en reducenten samenwerken, blijven stoffen rondgaan. In de <strong>koolstofkringloop</strong> gaat koolstof via fotosynthese en verbranding tussen lucht en organismen rond. In de <strong>stikstofkringloop</strong> zorgen bacteriën dat stikstof beschikbaar blijft voor planten.`] },
    ],
    [
      { t: 'Voedselketen', d: 'een reeks organismen die elkaar opeten, van producent naar consument', k: 'wie eet wie, in een lijn', fout: ['Voedselweb'] },
      { t: 'Voedselweb', d: 'meerdere voedselketens die met elkaar verbonden zijn', k: 'verbonden voedselketens', fout: ['Voedselketen'] },
      { t: 'Producent', d: 'een organisme dat zelf voedsel maakt, meestal een plant', k: 'maakt zelf voedsel', fout: ['Consument', 'Reducent'] },
      { t: 'Consument', d: 'een organisme dat andere organismen eet', k: 'eet andere organismen', fout: ['Producent', 'Reducent'] },
      { t: 'Reducent', d: 'een organisme dat dood materiaal afbreekt, zoals een schimmel', k: 'breekt dood materiaal af', fout: ['Producent', 'Consument'] },
      { t: 'Fotosynthese', d: 'het maken van glucose uit koolstofdioxide en water met licht', k: 'suiker maken met licht', fout: ['Verbranding'] },
      { t: 'Verbranding', d: 'het vrijmaken van energie uit voedingsstoffen met zuurstof', k: 'energie vrijmaken met zuurstof', fout: ['Fotosynthese'] },
      { t: 'Koolstofkringloop', d: 'de kringloop waarin koolstof tussen organismen en lucht rondgaat', k: 'koolstof gaat rond', fout: ['Stikstofkringloop'] },
      { t: 'Stikstofkringloop', d: 'de kringloop waarin stikstof via bacteriën en planten rondgaat', k: 'stikstof gaat rond', fout: ['Koolstofkringloop'] },
      { t: 'Herbivoor', d: 'een dier dat alleen planten eet', k: 'planteneter', fout: ['Carnivoor', 'Omnivoor'] },
      { t: 'Carnivoor', d: 'een dier dat andere dieren eet', k: 'vleeseter', fout: ['Herbivoor', 'Omnivoor'] },
      { t: 'Omnivoor', d: 'een dier dat zowel planten als dieren eet', k: 'alleseter', fout: ['Herbivoor', 'Carnivoor'] },
      { t: 'Ecosysteem', d: 'een leefgebied met alle organismen en hun omgeving samen', k: 'organismen plus omgeving', fout: ['Voedselweb'] },
    ]),

  V('D', 'Mensen beïnvloeden hun omgeving',
    `De mens gebruikt grondstoffen en veroorzaakt <strong>milieuvervuiling</strong>. Met <strong>duurzaamheid</strong> en <strong>kringloopdenken</strong> proberen we die invloed te verkleinen.`,
    [
      { h: '1. Vervuiling en klimaat', p: [
        `Bij <strong>milieuvervuiling</strong> komen schadelijke stoffen in lucht, water of bodem. Door het verbranden van <strong>fossiele brandstoffen</strong> komen <strong>broeikasgassen</strong> vrij die warmte vasthouden: het <strong>broeikaseffect</strong>, waardoor de aarde opwarmt.`] },
      { h: '2. Duurzaam met grondstoffen', p: [
        `<strong>Duurzaamheid</strong> betekent zo leven dat er ook voor de toekomst genoeg overblijft. Bij <strong>kringloopdenken</strong> gebruik je grondstoffen steeds opnieuw in plaats van ze weg te gooien; <strong>recycling</strong> en <strong>duurzame energie</strong> horen daarbij. Zo blijft de <strong>biodiversiteit</strong> beter behouden.`] },
    ],
    [
      { t: 'Milieuvervuiling', d: 'het toevoegen van schadelijke stoffen aan lucht, water of bodem', k: 'schadelijke stoffen lozen', fout: ['Broeikaseffect'] },
      { t: 'Broeikaseffect', d: 'het opwarmen van de aarde door broeikasgassen in de lucht', k: 'aarde warmt op', fout: ['Milieuvervuiling', 'Ozonlaag'] },
      { t: 'Broeikasgas', d: 'een gas zoals koolstofdioxide dat warmte vasthoudt', k: 'gas dat warmte vasthoudt', fout: ['Fijnstof'] },
      { t: 'Duurzaamheid', d: 'zo leven dat er ook voor de toekomst genoeg overblijft', k: 'toekomstbestendig leven', fout: ['Kringloopdenken'] },
      { t: 'Kringloopdenken', d: 'grondstoffen steeds opnieuw gebruiken in plaats van weggooien', k: 'grondstoffen hergebruiken', fout: ['Duurzaamheid', 'Recycling'] },
      { t: 'Recycling', d: 'afval verwerken tot nieuwe grondstoffen of producten', k: 'afval hergebruiken', fout: ['Kringloopdenken'] },
      { t: 'Duurzame energie', d: 'energie uit bronnen die niet opraken, zoals zon en wind', k: 'energie die niet opraakt', fout: ['Fossiele brandstof'] },
      { t: 'Fossiele brandstof', d: 'brandstof uit resten van organismen, zoals olie en gas', k: 'olie, gas en kolen', fout: ['Duurzame energie'] },
      { t: 'Biodiversiteit', d: 'de verscheidenheid aan soorten in een gebied', k: 'soortenrijkdom', fout: ['Ecosysteem'] },
      { t: 'Afbreekbaar', d: 'materiaal dat door reducenten wordt afgebroken', k: 'wordt afgebroken', fout: ['Recycling'] },
      { t: 'Fijnstof', d: 'kleine zwevende deeltjes in de lucht die schadelijk zijn', k: 'schadelijke luchtdeeltjes', fout: ['Broeikasgas'] },
      { t: 'Grondstof', d: 'een natuurlijke stof waarvan je iets maakt', k: 'basismateriaal', fout: ['Fossiele brandstof'] },
    ]),

  V('E', 'Houding en beweging',
    `Het <strong>skelet</strong> en de <strong>spieren</strong> zorgen samen voor beweging. Botten zijn met elkaar verbonden in <strong>gewrichten</strong>, en spieren werken in paren omdat ze alleen kunnen trekken.`,
    [
      { h: '1. Gewrichten en verbindingen', p: [
        `Waar twee botten beweegbaar samenkomen, zit een <strong>gewricht</strong>. <strong>Gewrichtsbanden</strong> houden de botten bij elkaar, <strong>kraakbeen</strong> bedekt de uiteinden en <strong>gewrichtssmeer</strong> vermindert de wrijving. Een <strong>scharniergewricht</strong> (knie) buigt in één richting, een <strong>kogelgewricht</strong> (schouder) draait alle kanten op.`] },
      { h: '2. Spieren werken in paren', p: [
        `Een <strong>spier</strong> kan alleen trekken, niet duwen. Daarom werken spieren in paren: een <strong>buigspier</strong> buigt een gewricht en de <strong>strekspier</strong> strekt het weer. Zo\'n tegenwerkend paar heet een <strong>antagonist</strong>. Een <strong>pees</strong> verbindt de spier met het bot.`] },
    ],
    [
      { t: 'Gewricht', d: 'een beweegbare verbinding tussen twee botten', k: 'beweegbare botverbinding', fout: ['Gewrichtsband', 'Pees'] },
      { t: 'Gewrichtsband', d: 'stevig weefsel dat botten in een gewricht bij elkaar houdt', k: 'houdt botten bijeen', fout: ['Pees', 'Gewricht'] },
      { t: 'Pees', d: 'stevig weefsel dat een spier aan een bot vastmaakt', k: 'verbindt spier met bot', fout: ['Gewrichtsband'] },
      { t: 'Spier', d: 'een orgaan dat kan samentrekken en zo beweging maakt', k: 'trekt samen, beweegt', fout: ['Pees', 'Bot'] },
      { t: 'Buigspier', d: 'een spier die een gewricht buigt', k: 'buigt een gewricht', fout: ['Strekspier'] },
      { t: 'Strekspier', d: 'een spier die een gewricht strekt', k: 'strekt een gewricht', fout: ['Buigspier'] },
      { t: 'Antagonist', d: 'een spier die de tegengestelde beweging maakt', k: 'tegenwerkende spier', fout: ['Buigspier', 'Strekspier'] },
      { t: 'Gewrichtskapsel', d: 'het omhulsel om een gewricht met smeervloeistof', k: 'omhulsel met smeer', fout: ['Gewrichtsband'] },
      { t: 'Gewrichtssmeer', d: 'vloeistof die de wrijving in een gewricht verkleint', k: 'vermindert wrijving', fout: ['Kraakbeen'] },
      { t: 'Kraakbeen', d: 'buigzaam steunweefsel dat de botuiteinden bedekt', k: 'bedekt botuiteinden', fout: ['Bot', 'Gewrichtssmeer'] },
      { t: 'Scharniergewricht', d: 'een gewricht dat maar in één richting buigt, zoals de knie', k: 'buigt één richting', fout: ['Kogelgewricht'] },
      { t: 'Kogelgewricht', d: 'een gewricht dat in alle richtingen kan draaien, zoals de schouder', k: 'draait alle richtingen', fout: ['Scharniergewricht'] },
    ]),

  V('F', 'Het lichaam in werking',
    `Organen werken samen om je lichaam draaiende te houden: de <strong>vertering</strong> maakt voedsel klein, het <strong>bloed</strong> vervoert stoffen, de <strong>longen</strong> zorgen voor <strong>gaswisseling</strong> en het <strong>zenuwstelsel</strong> stuurt alles aan.`,
    [
      { h: '1. Vertering en opname', p: [
        `Bij de <strong>vertering</strong> wordt voedsel klein gemaakt zodat het in het bloed kan worden opgenomen. <strong>Enzymen</strong> versnellen dat proces. In de dunne darm nemen <strong>darmvlokken</strong> de voedingsstoffen op in het bloed.`] },
      { h: '2. Bloedsomloop', p: [
        `Het <strong>hart</strong> pompt het bloed rond. <strong>Slagaders</strong> voeren bloed van het hart af, <strong>aders</strong> voeren het naar het hart toe, en in de dunne <strong>haarvaten</strong> vindt de uitwisseling van stoffen met de cellen plaats.`] },
      { h: '3. Gaswisseling en regeling', p: [
        `In de <strong>longblaasjes</strong> vindt <strong>gaswisseling</strong> plaats: zuurstof gaat het bloed in, koolstofdioxide gaat eruit. De <strong>nieren</strong> filteren afvalstoffen uit het bloed. Het <strong>zenuwstelsel</strong> stuurt snel met prikkels, terwijl <strong>hormonen</strong> langzamer sturen via het bloed.`] },
    ],
    [
      { t: 'Vertering', d: 'het klein maken van voedsel zodat het opgenomen kan worden', k: 'voedsel klein maken', fout: ['Opname', 'Verbranding'] },
      { t: 'Enzym', d: 'een stof die een reactie zoals vertering versnelt', k: 'versnelt een reactie', fout: ['Hormoon'] },
      { t: 'Darmvlok', d: 'uitstulping in de dunne darm die voedingsstoffen opneemt', k: 'neemt voeding op', fout: ['Vertering'] },
      { t: 'Slagader', d: 'een bloedvat dat bloed van het hart af vervoert', k: 'bloed van het hart af', fout: ['Ader', 'Haarvat'] },
      { t: 'Ader', d: 'een bloedvat dat bloed naar het hart toe vervoert', k: 'bloed naar het hart toe', fout: ['Slagader', 'Haarvat'] },
      { t: 'Haarvat', d: 'een heel dun bloedvat waar uitwisseling van stoffen plaatsvindt', k: 'uitwisseling van stoffen', fout: ['Slagader', 'Ader'] },
      { t: 'Hart', d: 'de spier die het bloed rondpompt', k: 'pompt het bloed rond', fout: ['Long'] },
      { t: 'Gaswisseling', d: 'de opname van zuurstof en afgifte van koolstofdioxide', k: 'zuurstof in, CO2 uit', fout: ['Vertering'] },
      { t: 'Longblaasje', d: 'klein blaasje in de long waar gaswisseling plaatsvindt', k: 'plek van gaswisseling', fout: ['Haarvat'] },
      { t: 'Nier', d: 'een orgaan dat afvalstoffen uit het bloed filtert', k: 'filtert het bloed', fout: ['Blaas', 'Lever'] },
      { t: 'Zenuwstelsel', d: 'het stelsel dat prikkels doorgeeft en het lichaam stuurt', k: 'stuurt met prikkels', fout: ['Hormoonstelsel'] },
      { t: 'Hormoon', d: 'een stof die via het bloed processen in het lichaam regelt', k: 'regelt via het bloed', fout: ['Enzym', 'Zenuwstelsel'] },
      { t: 'Zintuig', d: 'een orgaan dat prikkels uit de omgeving opvangt', k: 'vangt prikkels op', fout: ['Zenuwstelsel'] },
    ]),

  V('G', 'Bio-wetenschappen en maatschappij',
    `Mensen zetten organismen aan het werk in de <strong>biotechnologie</strong>: <strong>gist</strong> en <strong>melkzuurbacteriën</strong> in voeding, <strong>schimmels</strong> voor <strong>antibiotica</strong> en <strong>genetische modificatie</strong> om stoffen zoals <strong>insuline</strong> te maken.`,
    [
      { h: '1. Micro-organismen in voeding', p: [
        `<strong>Biotechnologie</strong> is het gebruik van organismen om producten te maken. <strong>Gist</strong> is een schimmel die suiker omzet en deeg laat rijzen; <strong>melkzuurbacteriën</strong> maken van melk yoghurt en kaas. Dit omzetten zonder zuurstof heet <strong>gisting</strong>.`] },
      { h: '2. Medicijnen en modificatie', p: [
        `Sommige <strong>schimmels</strong> maken <strong>antibiotica</strong>, stoffen die bacteriën doden of hun groei remmen. Bij <strong>genetische modificatie</strong> verander je gericht het DNA van een organisme, bijvoorbeeld om bacteriën <strong>insuline</strong> te laten maken voor mensen met diabetes.`,
        `Genetische modificatie heeft voor- en nadelen. <strong>Gm-gewassen</strong> kunnen bijvoorbeeld beter tegen droogte, maar er zijn ook zorgen over gevolgen voor natuur en gezondheid. Overmatig antibioticagebruik leidt tot <strong>resistentie</strong>.`] },
    ],
    [
      { t: 'Biotechnologie', d: 'het gebruik van organismen om producten te maken', k: 'organismen als fabriekje', fout: ['Genetische modificatie'] },
      { t: 'Gist', d: 'een schimmel die suiker omzet en deeg laat rijzen', k: 'laat deeg rijzen', fout: ['Melkzuurbacterie', 'Schimmel'] },
      { t: 'Melkzuurbacterie', d: 'een bacterie die melk in yoghurt of kaas omzet', k: 'maakt yoghurt en kaas', fout: ['Gist'] },
      { t: 'Gisting', d: 'het omzetten van suiker door micro-organismen zonder zuurstof', k: 'suiker omzetten zonder zuurstof', fout: ['Verbranding'] },
      { t: 'Antibioticum', d: 'een stof die bacteriën doodt of hun groei remt', k: 'werkt tegen bacteriën', fout: ['Vaccin'] },
      { t: 'Schimmel', d: 'een organisme dat stoffen zoals antibiotica kan maken', k: 'maakt o.a. antibiotica', fout: ['Bacterie', 'Gist'] },
      { t: 'Genetische modificatie', d: 'het gericht veranderen van het DNA van een organisme', k: 'DNA gericht veranderen', fout: ['Biotechnologie', 'Natuurlijke selectie'] },
      { t: 'Insuline', d: 'een hormoon dat met gm-bacteriën gemaakt kan worden', k: 'hormoon uit gm-bacteriën', fout: ['Antibioticum'] },
      { t: 'Gm-gewas', d: 'een gewas met gericht veranderd DNA', k: 'gewas met veranderd DNA', fout: ['Genetische modificatie'] },
      { t: 'Resistentie', d: 'ongevoeligheid van bacteriën voor een antibioticum', k: 'ongevoelig voor antibiotica', fout: ['Antibioticum'] },
      { t: 'Vaccin', d: 'een middel dat je afweer traint tegen een ziekteverwekker', k: 'traint de afweer', fout: ['Antibioticum'] },
      { t: 'Bacterie', d: 'een eencellig organisme zonder celkern', k: 'eencellig, geen kern', fout: ['Schimmel', 'Gist'] },
    ]),
];
