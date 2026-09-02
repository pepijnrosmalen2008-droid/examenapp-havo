// HAVO Aardrijkskunde - gouden-stijl contentspec. Vervangt crude generatorvragen
// door authored inzichtvragen met per-optie-uitleg + situatiebegrippen.
const V = (domein, naam, intro, secties, concepten, vragen) => ({ niveau: 'havo', vak: 'ak', domein, naam, intro, secties, concepten, vragen });

export default [
  V('A', 'Vaardigheden',
    `Geografen stellen een <strong>geografische vraag</strong> over <strong>ruimtelijke patronen</strong>, kiezen een <strong>schaalniveau</strong> en werken met <strong>kaarten</strong> (thematisch, met een <strong>legenda</strong>). Ze onderscheiden <strong>absolute</strong> van <strong>relatieve afstand</strong> en combineren bronnen voor een betrouwbaar beeld.`,
    [
      { h: '1. Vragen en schaal', p: [
        `Een <strong>geografische vraag</strong> gaat over ruimtelijke patronen en verschijnselen: waar, en waarom daar? Het <strong>schaalniveau</strong> is het ruimtelijke niveau van analyse (van lokaal tot mondiaal). <strong>Inzoomen</strong> geeft een groter schaalniveau met meer detail; <strong>uitzoomen</strong> een kleiner schaalniveau met een groter gebied.`] },
      { h: '2. Kaarten en afstand', p: [
        `Een <strong>thematische kaart</strong> visualiseert één thema; de <strong>legenda</strong> verklaart de symbolen en kleuren. Een <strong>ruimtelijk patroon</strong> is de verspreiding van verschijnselen over een gebied. <strong>Absolute afstand</strong> is de werkelijke afstand in kilometers, <strong>relatieve afstand</strong> die in tijd, kosten of moeite. <strong>Broncombinatie</strong> geeft een completer en betrouwbaarder beeld.`] },
    ],
    [
      { t: 'Geografische vraag', d: 'een vraag over ruimtelijke patronen en verschijnselen', k: 'over ruimtelijke patronen', fout: ['Ruimtelijk patroon'] },
      { t: 'Schaalniveau', d: 'het ruimtelijke niveau van analyse, van lokaal tot mondiaal', k: 'ruimtelijk niveau van analyse', fout: ['Absolute afstand'] },
      { t: 'Absolute afstand', d: 'de werkelijke afstand tussen twee plaatsen in kilometers', k: 'werkelijke afstand in km', fout: ['Relatieve afstand'] },
      { t: 'Relatieve afstand', d: 'de afstand uitgedrukt in tijd, kosten of moeite', k: 'afstand in tijd of kosten', fout: ['Absolute afstand'] },
      { t: 'Ruimtelijk patroon', d: 'de verspreiding van verschijnselen over een gebied', k: 'verspreiding over een gebied', fout: ['Geografische vraag'] },
      { t: 'Thematische kaart', d: 'een kaart die één thema visualiseert', k: 'één thema', fout: ['Topografische kaart'] },
      { t: 'Legenda', d: 'de verklaring van de symbolen en kleuren op een kaart', k: 'verklaring van symbolen', fout: ['Thematische kaart'] },
      { t: 'Broncombinatie', d: 'meerdere bronnen combineren voor een completer en betrouwbaarder beeld', k: 'bronnen combineren', fout: ['Schaalniveau'] },
      { t: 'Inzoomen', d: 'naar een groter schaalniveau gaan, met meer detail', k: 'groter schaalniveau, meer detail', fout: ['Uitzoomen'] },
      { t: 'Topografische kaart', d: 'een kaart die het landschap toont: hoogte, wegen en plaatsen', k: 'het landschap', fout: ['Thematische kaart'] },
    ],
    [
      { v: 'Wat is een geografische vraag?', o: ['een vraag over ruimtelijke patronen en verschijnselen', 'een vraag over jaartallen', 'een rekenopgave', 'een taalvraag'], c: 0, d: 2, uo: ['Klopt: geografie draait om ruimtelijke patronen.', 'Nee, dat is geschiedenis.', 'Nee, dat is wiskunde.', 'Nee, dat is taal.'], uh: 'Geografische vraag: over ruimtelijke patronen.' },
      { v: 'Wat is een schaalniveau?', o: ['het ruimtelijke niveau van analyse, van lokaal tot mondiaal', 'de kleur van een kaart', 'de titel van een kaart', 'de legenda'], c: 0, d: 2, uo: ['Klopt: je bekijkt iets op een bepaald niveau.', 'Nee, kleur is iets anders.', 'Nee, dat is de kop.', 'Nee, dat is de verklaring.'], uh: 'Schaalniveau: ruimtelijk niveau van analyse.' },
      { v: 'Wat is absolute afstand?', o: ['de werkelijke afstand in kilometers', 'de afstand in reistijd', 'de afstand in kosten', 'de afstand in moeite'], c: 0, d: 2, uo: ['Klopt: absoluut is in kilometers.', 'Nee, dat is relatief.', 'Nee, dat is relatief.', 'Nee, dat is relatief.'], uh: 'Absolute afstand: werkelijke afstand in km.' },
      { v: 'Waarom is broncombinatie belangrijk?', o: ['het geeft een completer en betrouwbaarder beeld', 'het kost minder tijd', 'het maakt de kaart mooier', 'het is verplicht'], c: 0, d: 3, uo: ['Klopt: meer bronnen vullen elkaar aan en controleren elkaar.', 'Nee, het kost juist meer tijd.', 'Nee, dat is niet de reden.', 'Nee, er is een inhoudelijke reden.'], uh: 'Broncombinatie: completer en betrouwbaarder beeld.' },
      { v: 'Wat is een ruimtelijk patroon?', o: ['de verspreiding van verschijnselen over een gebied', 'de titel van een kaart', 'de reistijd tussen steden', 'een enkel jaartal'], c: 0, d: 2, uo: ['Klopt: het patroon is de verspreiding.', 'Nee, dat is de kop.', 'Nee, dat is relatieve afstand.', 'Nee, dat is geschiedenis.'], uh: 'Ruimtelijk patroon: verspreiding over een gebied.' },
      { v: 'Wat is een thematische kaart?', o: ['een kaart die één thema visualiseert', 'een kaart die het hele landschap toont', 'een kaart zonder legenda', 'een luchtfoto'], c: 0, d: 2, uo: ['Klopt: een thematische kaart toont één thema.', 'Nee, dat is topografisch.', 'Nee, een legenda hoort erbij.', 'Nee, dat is een foto.'], uh: 'Thematische kaart: één thema.' },
      { v: 'Wat betekent inzoomen op een kaart?', o: ['een groter schaalniveau, meer detail zichtbaar', 'een kleiner schaalniveau, groter gebied', 'de kaart draaien', 'de legenda weglaten'], c: 0, d: 3, uo: ['Klopt: inzoomen toont een kleiner gebied met meer detail.', 'Nee, dat is uitzoomen.', 'Nee, dat is iets anders.', 'Nee, dat heeft er niets mee te maken.'], uh: 'Inzoomen: groter schaalniveau, meer detail.' },
      { v: 'Wat betekent uitzoomen op een kaart?', o: ['een kleiner schaalniveau, groter gebied zichtbaar', 'een groter schaalniveau, meer detail', 'de kaart inkleuren', 'de titel wijzigen'], c: 0, d: 3, uo: ['Klopt: uitzoomen toont een groter gebied met minder detail.', 'Nee, dat is inzoomen.', 'Nee, dat is iets anders.', 'Nee, dat heeft er niets mee te maken.'], uh: 'Uitzoomen: kleiner schaalniveau, groter gebied.' },
      { v: 'Wat is een legenda op een kaart?', o: ['de verklaring van de symbolen en kleuren', 'de schaal van de kaart', 'de titel van de kaart', 'de reistijd'], c: 0, d: 2, uo: ['Klopt: de legenda legt de tekens uit.', 'Nee, dat is de schaal.', 'Nee, dat is de kop.', 'Nee, dat is afstand.'], uh: 'Legenda: verklaring van symbolen en kleuren.' },
      { v: 'Wat is relatieve afstand?', o: ['de afstand in tijd, kosten of moeite', 'de werkelijke afstand in kilometers', 'de hoogte boven zeeniveau', 'de schaal van de kaart'], c: 0, d: 3, uo: ['Klopt: relatief is in tijd, kosten of moeite.', 'Nee, dat is absoluut.', 'Nee, dat is hoogte.', 'Nee, dat is schaal.'], uh: 'Relatieve afstand: in tijd, kosten of moeite.' },
      { v: 'Wat toont een topografische kaart vooral?', o: ['het landschap: hoogte, wegen en plaatsen', 'de verspreiding van één thema', 'alleen de legenda', 'alleen de reistijd'], c: 0, d: 2, uo: ['Klopt: topografie toont het landschap.', 'Nee, dat is thematisch.', 'Nee, dat is een onderdeel.', 'Nee, dat is relatieve afstand.'], uh: 'Topografische kaart: het landschap.' },
    ]),

  V('B', 'Wereld',
    `Op wereldschaal bestudeer je <strong>globalisering</strong>, <strong>migratie</strong> (push- en pullfactoren) en de tegenstelling tussen <strong>centrum</strong> en <strong>periferie</strong>. Je onderscheidt <strong>welvaart</strong> van <strong>welzijn</strong> en volgt <strong>urbanisatie</strong>, <strong>multinationals</strong> en de <strong>handelsbalans</strong>.`,
    [
      { h: '1. Globalisering en welvaart', p: [
        `<strong>Globalisering</strong> is de mondiale verwevenheid van economie en cultuur, versterkt door handel, transport en communicatie. <strong>Welvaart</strong> is materieel (inkomen en bezit), <strong>welzijn</strong> gaat over de levenskwaliteit. Het <strong>centrum-periferiemodel</strong> zet een rijke kern tegenover een arme periferie.`] },
      { h: '2. Migratie en economie', p: [
        `<strong>Pushfactoren</strong> jagen mensen weg, <strong>pullfactoren</strong> trekken hen aan. <strong>Urbanisatie</strong> is het toenemende aandeel van de bevolking in steden. Een <strong>multinational</strong> is actief in meerdere landen. <strong>Demografische druk</strong> is een grote bevolkingsgroei door geboorte en migratie. De <strong>handelsbalans</strong> is het verschil tussen de waarde van export en import.`] },
    ],
    [
      { t: 'Globalisering', d: 'de mondiale verwevenheid van economie en cultuur', k: 'mondiale verwevenheid', fout: ['Centrum-periferiemodel'] },
      { t: 'Welvaart', d: 'de materiële welstand: inkomen en bezit', k: 'materiële welstand', fout: ['Welzijn'] },
      { t: 'Welzijn', d: 'de levenskwaliteit, breder dan geld alleen', k: 'levenskwaliteit', fout: ['Welvaart'] },
      { t: 'Pushfactor', d: 'een factor die mensen wegjaagt uit een gebied', k: 'jaagt weg', fout: ['Pullfactor'] },
      { t: 'Pullfactor', d: 'een factor die mensen naar een gebied toe trekt', k: 'trekt aan', fout: ['Pushfactor'] },
      { t: 'Centrum-periferiemodel', d: 'model met een rijke kern tegenover een arme periferie', k: 'rijke kern, arme periferie', fout: ['Globalisering'] },
      { t: 'Urbanisatie', d: 'het toenemende aandeel van de bevolking in steden', k: 'meer mensen in steden', fout: ['Multinational'] },
      { t: 'Multinational', d: 'een bedrijf dat in meerdere landen actief is', k: 'in meerdere landen actief', fout: ['Globalisering'] },
      { t: 'Demografische druk', d: 'een grote bevolkingsgroei door geboorte en migratie', k: 'grote bevolkingsgroei', fout: ['Urbanisatie'] },
      { t: 'Handelsbalans', d: 'het verschil tussen de waarde van export en import', k: 'export min import', fout: ['Welvaart'] },
    ],
    [
      { v: 'Wat is globalisering?', o: ['de mondiale verwevenheid van economie en cultuur', 'de trek van mensen naar de stad', 'de groei van de bevolking', 'de opwarming van de aarde'], c: 0, d: 2, uo: ['Klopt: globalisering verweeft de wereld.', 'Nee, dat is urbanisatie.', 'Nee, dat is bevolkingsgroei.', 'Nee, dat is klimaat.'], uh: 'Globalisering: mondiale verwevenheid.' },
      { v: 'Wat is het verschil tussen welvaart en welzijn?', o: ['welvaart is materieel, welzijn is de levenskwaliteit', 'ze zijn hetzelfde', 'welvaart is levenskwaliteit', 'welzijn is inkomen'], c: 0, d: 3, uo: ['Klopt: geld tegenover levenskwaliteit.', 'Nee, ze verschillen.', 'Nee, dat is omgedraaid.', 'Nee, dat is omgedraaid.'], uh: 'Welvaart: materieel; welzijn: levenskwaliteit.' },
      { v: 'Wat zijn pushfactoren bij migratie?', o: ['factoren die mensen wegjagen', 'factoren die mensen aantrekken', 'de reisafstand', 'de kosten van de reis'], c: 0, d: 2, uo: ['Klopt: pushfactoren duwen mensen weg.', 'Nee, dat zijn pullfactoren.', 'Nee, dat is afstand.', 'Nee, dat is een kostenpost.'], uh: 'Pushfactoren: jagen weg.' },
      { v: 'Wat zijn pullfactoren bij migratie?', o: ['factoren die mensen naar zich toe trekken', 'factoren die mensen wegjagen', 'de reistijd', 'de bevolkingsgroei'], c: 0, d: 2, uo: ['Klopt: pullfactoren trekken aan.', 'Nee, dat zijn pushfactoren.', 'Nee, dat is afstand.', 'Nee, dat is demografie.'], uh: 'Pullfactoren: trekken aan.' },
      { v: 'Wat is het centrum-periferiemodel?', o: ['een rijke kern tegenover een arme periferie', 'de trek naar de stad', 'het verschil tussen export en import', 'de opwarming van de aarde'], c: 0, d: 3, uo: ['Klopt: het model zet kern en rand tegenover elkaar.', 'Nee, dat is urbanisatie.', 'Nee, dat is de handelsbalans.', 'Nee, dat is klimaat.'], uh: 'Centrum-periferie: rijke kern, arme periferie.' },
      { v: 'Wat is urbanisatie?', o: ['het toenemende aandeel van de bevolking in steden', 'de groei van het platteland', 'de daling van de bevolking', 'de trek naar de buitenwijken'], c: 0, d: 2, uo: ['Klopt: steeds meer mensen wonen in steden.', 'Nee, juist het omgekeerde.', 'Nee, dat is krimp.', 'Nee, dat is suburbanisatie.'], uh: 'Urbanisatie: meer bevolking in steden.' },
      { v: 'Wat is een multinational?', o: ['een bedrijf dat in meerdere landen actief is', 'een overheidsdienst', 'een lokale winkel', 'een migrant'], c: 0, d: 2, uo: ['Klopt: een multinational opereert wereldwijd.', 'Nee, dat is geen bedrijf.', 'Nee, dat is juist lokaal.', 'Nee, dat is een persoon.'], uh: 'Multinational: actief in meerdere landen.' },
      { v: 'Wat is demografische druk?', o: ['een grote bevolkingsgroei door geboorte en migratie', 'een dalende bevolking', 'de opwarming van de aarde', 'het verschil tussen export en import'], c: 0, d: 3, uo: ['Klopt: veel groei zet gebieden onder druk.', 'Nee, dat is krimp.', 'Nee, dat is klimaat.', 'Nee, dat is de handelsbalans.'], uh: 'Demografische druk: grote bevolkingsgroei.' },
      { v: 'Wat is een handelsbalans?', o: ['het verschil tussen de waarde van export en import', 'de bevolkingsgroei', 'de trek naar de stad', 'de reistijd tussen landen'], c: 0, d: 3, uo: ['Klopt: export min import is de handelsbalans.', 'Nee, dat is demografie.', 'Nee, dat is urbanisatie.', 'Nee, dat is afstand.'], uh: 'Handelsbalans: export min import.' },
      { v: 'Wat is welvaart?', o: ['de materiële welstand, zoals inkomen en bezit', 'de levenskwaliteit', 'het aantal inwoners', 'de reistijd'], c: 0, d: 2, uo: ['Klopt: welvaart is de materiële kant.', 'Nee, dat is welzijn.', 'Nee, dat is demografie.', 'Nee, dat is afstand.'], uh: 'Welvaart: materiële welstand.' },
    ]),

  V('C', 'Aarde',
    `Het aardoppervlak vormt zich door <strong>endogene</strong> processen (van binnenuit, zoals <strong>subductie</strong> en vulkanisme) en <strong>exogene</strong> processen (van buitenaf, zoals <strong>verwering</strong>, <strong>erosie</strong> en <strong>sedimentatie</strong>). <strong>Klimaatverandering</strong> verschuift de langjarige gemiddelden.`,
    [
      { h: '1. Endogene processen', p: [
        `<strong>Endogene processen</strong> komen van binnenin de aarde. Bij een <strong>subductiezone</strong> duikt een plaat omlaag onder een andere. Een <strong>hotspot</strong> is een vast hittepunt diep in de aardmantel waardoor vulkanisme ontstaat.`] },
      { h: '2. Exogene processen', p: [
        `<strong>Exogene processen</strong> komen van buitenaf. <strong>Verwering</strong> breekt gesteente ter plekke af; <strong>erosie</strong> voert het materiaal af door water of wind; <strong>sedimentatie</strong> zet het weer af, bijvoorbeeld in een <strong>delta</strong>. Het <strong>rivierregime</strong> is het jaarlijkse patroon van de waterafvoer. <strong>Klimaatverandering</strong> is een langdurige verschuiving van de klimaatgemiddelden.`] },
    ],
    [
      { t: 'Endogene processen', d: 'processen die van binnenin de aarde komen, zoals vulkanisme', k: 'van binnenuit', fout: ['Exogene processen'] },
      { t: 'Exogene processen', d: 'processen die van buitenaf werken, zoals verwering en erosie', k: 'van buitenaf', fout: ['Endogene processen'] },
      { t: 'Subductiezone', d: 'de plek waar een plaat onder een andere omlaagduikt', k: 'plaat duikt omlaag', fout: ['Hotspot'] },
      { t: 'Erosie', d: 'het afvoeren van materiaal door water of wind', k: 'afvoer van materiaal', fout: ['Sedimentatie'] },
      { t: 'Sedimentatie', d: 'de afzetting van meegevoerd materiaal op de bodem', k: 'afzetting van materiaal', fout: ['Erosie'] },
      { t: 'Verwering', d: 'het ter plekke afbreken van gesteente', k: 'ter plekke afbreken', fout: ['Erosie'] },
      { t: 'Rivierregime', d: 'het jaarlijkse patroon van de waterafvoer van een rivier', k: 'jaarpatroon van waterafvoer', fout: ['Delta'] },
      { t: 'Delta', d: 'een laaggelegen riviermondingsgebied vol sediment', k: 'riviermonding vol sediment', fout: ['Rivierregime'] },
      { t: 'Klimaatverandering', d: 'een langdurige verschuiving van de klimaatgemiddelden', k: 'verschuiving van klimaatgemiddelden', fout: ['Exogene processen'] },
      { t: 'Hotspot', d: 'een vast hittepunt diep in de aardmantel', k: 'vast hittepunt in de mantel', fout: ['Subductiezone'] },
    ],
    [
      { v: 'Wat is het verschil tussen endogene en exogene processen?', o: ['endogeen komt van binnenin de aarde, exogeen van buitenaf', 'ze zijn hetzelfde', 'endogeen komt van buitenaf', 'exogeen komt van binnenuit'], c: 0, d: 3, uo: ['Klopt: van binnen tegenover van buiten.', 'Nee, ze verschillen.', 'Nee, dat is omgedraaid.', 'Nee, dat is omgedraaid.'], uh: 'Endogeen: van binnen; exogeen: van buiten.' },
      { v: 'Wat is een subductiezone?', o: ['de plek waar een plaat onder een andere omlaagduikt', 'de plek waar gesteente wordt afgebroken', 'een riviermonding', 'een hittepunt in de mantel'], c: 0, d: 3, uo: ['Klopt: bij subductie duikt een plaat weg.', 'Nee, dat is verwering.', 'Nee, dat is een delta.', 'Nee, dat is een hotspot.'], uh: 'Subductiezone: plaat duikt omlaag.' },
      { v: 'Wat is erosie?', o: ['het afvoeren van materiaal door water of wind', 'het afzetten van materiaal', 'het ter plekke afbreken van gesteente', 'het omhoogkomen van magma'], c: 0, d: 2, uo: ['Klopt: erosie voert materiaal af.', 'Nee, dat is sedimentatie.', 'Nee, dat is verwering.', 'Nee, dat is vulkanisme.'], uh: 'Erosie: afvoer van materiaal door water of wind.' },
      { v: 'Wat is sedimentatie?', o: ['de afzetting van meegevoerd materiaal op de bodem', 'het afvoeren van materiaal', 'het afbreken van gesteente', 'het wegduiken van een plaat'], c: 0, d: 2, uo: ['Klopt: sedimentatie zet materiaal af.', 'Nee, dat is erosie.', 'Nee, dat is verwering.', 'Nee, dat is subductie.'], uh: 'Sedimentatie: afzetting van materiaal.' },
      { v: 'Wat is een rivierregime?', o: ['het jaarlijkse patroon van de waterafvoer', 'de monding van een rivier', 'de diepte van een rivier', 'de breedte van een rivier'], c: 0, d: 3, uo: ['Klopt: het regime is het jaarpatroon van de afvoer.', 'Nee, dat is de delta.', 'Nee, dat is een maat.', 'Nee, dat is een maat.'], uh: 'Rivierregime: jaarpatroon van de waterafvoer.' },
      { v: 'Wat is klimaatverandering?', o: ['een langdurige verschuiving van de klimaatgemiddelden', 'het weer van vandaag', 'een korte hittegolf', 'de afvoer van een rivier'], c: 0, d: 2, uo: ['Klopt: het gaat om langjarige gemiddelden.', 'Nee, dat is het weer.', 'Nee, dat is kortstondig.', 'Nee, dat is een rivierregime.'], uh: 'Klimaatverandering: verschuiving van klimaatgemiddelden.' },
      { v: 'Wat is een delta?', o: ['een laaggelegen riviermondingsgebied vol sediment', 'een hittepunt in de aardmantel', 'een plek waar een plaat omlaagduikt', 'een bergtop'], c: 0, d: 2, uo: ['Klopt: een delta ontstaat door sedimentatie in de monding.', 'Nee, dat is een hotspot.', 'Nee, dat is een subductiezone.', 'Nee, dat is het tegenovergestelde van laag.'], uh: 'Delta: riviermonding vol sediment.' },
      { v: 'Wat is verwering?', o: ['het ter plekke afbreken van gesteente', 'het afvoeren van materiaal', 'het afzetten van sediment', 'het wegduiken van een plaat'], c: 0, d: 2, uo: ['Klopt: verwering breekt gesteente af zonder het te verplaatsen.', 'Nee, dat is erosie.', 'Nee, dat is sedimentatie.', 'Nee, dat is subductie.'], uh: 'Verwering: gesteente ter plekke afbreken.' },
      { v: 'Wat is een hotspot in de vulkanologie?', o: ['een vast hittepunt diep in de aardmantel', 'een plek waar twee platen botsen', 'een riviermonding', 'een gebied met veel erosie'], c: 0, d: 3, uo: ['Klopt: boven een hotspot ontstaat vulkanisme.', 'Nee, dat is een plaatgrens.', 'Nee, dat is een delta.', 'Nee, dat is exogeen.'], uh: 'Hotspot: vast hittepunt in de mantel.' },
      { v: 'Wat is het verschil tussen erosie en verwering?', o: ['erosie voert materiaal af, verwering breekt gesteente ter plekke af', 'ze zijn hetzelfde', 'erosie breekt ter plekke af', 'verwering voert materiaal af'], c: 0, d: 3, uo: ['Klopt: afvoeren tegenover ter plekke afbreken.', 'Nee, ze verschillen.', 'Nee, dat is verwering.', 'Nee, dat is erosie.'], uh: 'Erosie: afvoer; verwering: ter plekke afbreken.' },
    ]),

  V('D', 'Ontwikkelingsland',
    `In een ontwikkelingsland speelt de <strong>demografische transitie</strong>, een grote <strong>informele sector</strong> en <strong>economische dualiteit</strong>. Er is vaak <strong>regionale ongelijkheid</strong> tussen kern en <strong>periferie</strong>, en <strong>braindrain</strong> van talent. Het <strong>ontwikkelingsniveau</strong> meet je met indicatoren.`,
    [
      { h: '1. Bevolking en economie', p: [
        `De <strong>demografische transitie</strong> is het model van dalende geboorte- en sterftecijfers. De <strong>informele sector</strong> is economische activiteit buiten de officiële registratie; naast de formele economie ontstaat zo <strong>economische dualiteit</strong>. <strong>Verstedelijking</strong> is de ruimtelijke groei van steden, <strong>urbanisatie</strong> de groei van het bevolkingsaandeel in steden.`] },
      { h: '2. Ongelijkheid en ontwikkeling', p: [
        `<strong>Regionale ongelijkheid</strong> zijn de welvaartsverschillen tussen gebieden binnen één land; een <strong>periferiegebied</strong> is economisch marginaal en slecht bereikbaar. <strong>Braindrain</strong> is het vertrek van hoogopgeleiden naar rijke landen. Een <strong>ontwikkelingsindicator</strong> is een maatstaf voor het ontwikkelingsniveau van een land.`] },
    ],
    [
      { t: 'Verstedelijking', d: 'de ruimtelijke groei van steden', k: 'ruimtelijke groei van steden', fout: ['Urbanisatie'] },
      { t: 'Urbanisatie', d: 'de groei van het bevolkingsaandeel in steden', k: 'aandeel bevolking in steden', fout: ['Verstedelijking'] },
      { t: 'Informele sector', d: 'economische activiteit buiten de officiële registratie', k: 'buiten officiële registratie', fout: ['Economische dualiteit'] },
      { t: 'Demografische transitie', d: 'het model van dalende geboorte- en sterftecijfers', k: 'dalende geboorte en sterfte', fout: ['Bevolkingsgroei'] },
      { t: 'Regionale ongelijkheid', d: 'welvaartsverschillen tussen gebieden binnen één land', k: 'verschillen binnen één land', fout: ['Periferiegebied'] },
      { t: 'Periferiegebied', d: 'een economisch marginaal en slecht bereikbaar gebied', k: 'marginaal en slecht bereikbaar', fout: ['Regionale ongelijkheid'] },
      { t: 'Economische dualiteit', d: 'een formele en een informele economie naast elkaar', k: 'formeel en informeel naast elkaar', fout: ['Informele sector'] },
      { t: 'Braindrain', d: 'het vertrek van hoogopgeleiden naar rijke landen', k: 'talent vertrekt', fout: ['Bevolkingsgroei'] },
      { t: 'Ontwikkelingsindicator', d: 'een maatstaf voor het ontwikkelingsniveau van een land', k: 'maatstaf voor ontwikkeling', fout: ['Demografische transitie'] },
      { t: 'Bevolkingsgroei', d: 'de toename van het inwoneraantal', k: 'toename inwoneraantal', fout: ['Braindrain'] },
    ],
    [
      { v: 'Wat is het verschil tussen verstedelijking en urbanisatie?', o: ['verstedelijking is ruimtelijke groei, urbanisatie is het bevolkingsaandeel', 'ze zijn hetzelfde', 'verstedelijking is het bevolkingsaandeel', 'urbanisatie is ruimtelijke groei'], c: 0, d: 3, uo: ['Klopt: ruimtelijke groei tegenover het bevolkingsaandeel.', 'Nee, ze verschillen.', 'Nee, dat is omgedraaid.', 'Nee, dat is omgedraaid.'], uh: 'Verstedelijking: ruimtelijk; urbanisatie: bevolkingsaandeel.' },
      { v: 'Wat is de informele sector?', o: ['economische activiteit buiten de officiële registratie', 'de geregistreerde, belaste economie', 'de overheid', 'de landbouw'], c: 0, d: 3, uo: ['Klopt: informeel is niet geregistreerd of belast.', 'Nee, dat is de formele sector.', 'Nee, dat is de overheid.', 'Nee, dat is een sector, geen registratie.'], uh: 'Informele sector: buiten officiële registratie.' },
      { v: 'Wat is de demografische transitie?', o: ['het model van dalende geboorte- en sterftecijfers', 'de trek naar de stad', 'het vertrek van talent', 'de opwarming van de aarde'], c: 0, d: 3, uo: ['Klopt: het model beschrijft de daling van geboorte en sterfte.', 'Nee, dat is urbanisatie.', 'Nee, dat is braindrain.', 'Nee, dat is klimaat.'], uh: 'Demografische transitie: dalende geboorte en sterfte.' },
      { v: 'Wat is regionale ongelijkheid?', o: ['welvaartsverschillen tussen gebieden binnen één land', 'verschillen tussen landen', 'de trek naar de stad', 'de bevolkingsgroei'], c: 0, d: 3, uo: ['Klopt: het gaat om verschillen binnen één land.', 'Nee, dat is tussen landen.', 'Nee, dat is urbanisatie.', 'Nee, dat is demografie.'], uh: 'Regionale ongelijkheid: verschillen binnen één land.' },
      { v: 'Wat is een periferiegebied?', o: ['een economisch marginaal en slecht bereikbaar gebied', 'de rijke, centrale stad', 'een riviermonding', 'een industriegebied'], c: 0, d: 2, uo: ['Klopt: de periferie ligt aan de rand en is achtergesteld.', 'Nee, dat is het centrum.', 'Nee, dat is een delta.', 'Nee, dat is juist bedrijvig.'], uh: 'Periferiegebied: marginaal en slecht bereikbaar.' },
      { v: 'Wat is economische dualiteit?', o: ['een formele en een informele economie naast elkaar', 'twee landen die samenwerken', 'de trek naar de stad', 'twee talen in één land'], c: 0, d: 3, uo: ['Klopt: de formele en informele economie bestaan naast elkaar.', 'Nee, dat is samenwerking.', 'Nee, dat is urbanisatie.', 'Nee, dat is taal.'], uh: 'Economische dualiteit: formeel en informeel naast elkaar.' },
      { v: 'Wat is braindrain?', o: ['het vertrek van hoogopgeleiden naar rijke landen', 'de groei van de bevolking', 'de trek naar de buitenwijken', 'de opwarming van de aarde'], c: 0, d: 2, uo: ['Klopt: het land verliest zijn talent.', 'Nee, dat is bevolkingsgroei.', 'Nee, dat is suburbanisatie.', 'Nee, dat is klimaat.'], uh: 'Braindrain: talent vertrekt naar rijke landen.' },
      { v: 'Wat is bevolkingsgroei?', o: ['de toename van het inwoneraantal', 'de daling van de welvaart', 'de trek naar de stad', 'het vertrek van talent'], c: 0, d: 1, uo: ['Klopt: het aantal inwoners neemt toe.', 'Nee, dat is iets anders.', 'Nee, dat is urbanisatie.', 'Nee, dat is braindrain.'], uh: 'Bevolkingsgroei: toename van het inwoneraantal.' },
      { v: 'Wat is een ontwikkelingsindicator?', o: ['een maatstaf voor het ontwikkelingsniveau van een land', 'een migrant', 'een riviermonding', 'een thematische kaart'], c: 0, d: 2, uo: ['Klopt: een indicator meet de ontwikkeling.', 'Nee, dat is een persoon.', 'Nee, dat is een delta.', 'Nee, dat is een kaart.'], uh: 'Ontwikkelingsindicator: maatstaf voor ontwikkeling.' },
      { v: 'Wat kenmerkt de formele sector tegenover de informele?', o: ['de formele sector is geregistreerd en betaalt belasting', 'de formele sector is niet geregistreerd', 'de formele sector bestaat niet', 'ze zijn hetzelfde'], c: 0, d: 3, uo: ['Klopt: formeel is officieel en belast.', 'Nee, dat is informeel.', 'Nee, hij bestaat wel.', 'Nee, ze verschillen.'], uh: 'Formele sector: geregistreerd en belast.' },
    ]),

  V('E', 'Leefomgeving',
    `In Nederland spelen <strong>verstedelijking</strong>, <strong>suburbanisatie</strong> en <strong>mobiliteit</strong>. Als deltaland draait veel om <strong>waterveiligheid</strong>: <strong>polders</strong>, <strong>dijkringen</strong> en <strong>rivierverruiming</strong>. Via <strong>ruimtelijke ordening</strong> en <strong>klimaatadaptatie</strong> houden we de leefomgeving leefbaar.`,
    [
      { h: '1. Steden en ruimte', p: [
        `<strong>Verstedelijking</strong> is de groei van het stedelijke aandeel van de bevolking; <strong>suburbanisatie</strong> is de trek van de stad naar de omliggende buitenwijken. <strong>Mobiliteit</strong> is de verplaatsing van mensen en goederen. Via <strong>ruimtelijke ordening</strong> stuurt de overheid het gebruik van de schaarse ruimte.`] },
      { h: '2. Water en klimaat', p: [
        `<strong>Waterveiligheid</strong> is de bescherming van de bevolking tegen wateroverlast. Een <strong>polder</strong> is een drooggemaakt stuk land onder zeeniveau; een <strong>dijkring</strong> is een gesloten systeem van aaneengesloten dijken. Bij <strong>rivierverruiming</strong> geef je rivieren meer ruimte voor de waterafvoer. <strong>Klimaatadaptatie</strong> is het aanpassen aan de gevolgen van klimaatverandering.`] },
    ],
    [
      { t: 'Verstedelijking', d: 'de groei van het stedelijke aandeel van de bevolking', k: 'groei van het stedelijk aandeel', fout: ['Suburbanisatie'] },
      { t: 'Suburbanisatie', d: 'de trek van de stad naar de omliggende buitenwijken', k: 'stad naar buitenwijken', fout: ['Verstedelijking'] },
      { t: 'Waterveiligheid', d: 'de bescherming van de bevolking tegen wateroverlast', k: 'bescherming tegen water', fout: ['Ruimtelijke ordening'] },
      { t: 'Polder', d: 'een drooggemaakt stuk land onder zeeniveau', k: 'drooggemaakt land onder NAP', fout: ['Dijkring'] },
      { t: 'Rivierverruiming', d: 'rivieren meer ruimte geven voor de waterafvoer', k: 'meer ruimte voor de rivier', fout: ['Waterveiligheid'] },
      { t: 'Ruimtelijke ordening', d: 'het beleid over het gebruik van de ruimte', k: 'beleid over de ruimte', fout: ['Mobiliteit'] },
      { t: 'Mobiliteit', d: 'de verplaatsing van mensen en goederen', k: 'verplaatsing van mensen en goederen', fout: ['Ruimtelijke ordening'] },
      { t: 'Dijkring', d: 'een gesloten systeem van aaneengesloten dijken', k: 'gesloten systeem van dijken', fout: ['Polder'] },
      { t: 'Klimaatadaptatie', d: 'het aanpassen aan de gevolgen van klimaatverandering', k: 'aanpassen aan het klimaat', fout: ['Waterveiligheid'] },
      { t: 'Overstromingsrisico', d: 'de kans op een overstroming maal de gevolgen ervan', k: 'kans maal gevolg', fout: ['Waterveiligheid'] },
    ],
    [
      { v: 'Wat is verstedelijking?', o: ['de groei van het stedelijke aandeel van de bevolking', 'de trek naar de buitenwijken', 'de bescherming tegen water', 'de verplaatsing van goederen'], c: 0, d: 2, uo: ['Klopt: steeds meer mensen wonen in steden.', 'Nee, dat is suburbanisatie.', 'Nee, dat is waterveiligheid.', 'Nee, dat is mobiliteit.'], uh: 'Verstedelijking: groei van het stedelijk aandeel.' },
      { v: 'Wat is suburbanisatie?', o: ['de trek van de stad naar de omliggende buitenwijken', 'de trek naar het stadscentrum', 'de groei van de bevolking', 'de bescherming tegen water'], c: 0, d: 3, uo: ['Klopt: mensen verhuizen van de stad naar de rand.', 'Nee, juist het omgekeerde.', 'Nee, dat is demografie.', 'Nee, dat is waterveiligheid.'], uh: 'Suburbanisatie: stad naar buitenwijken.' },
      { v: 'Wat is waterveiligheid?', o: ['de bescherming van de bevolking tegen wateroverlast', 'het schoonmaken van drinkwater', 'de trek naar de stad', 'de verplaatsing van goederen'], c: 0, d: 2, uo: ['Klopt: waterveiligheid beschermt tegen overstromingen.', 'Nee, dat is iets anders.', 'Nee, dat is urbanisatie.', 'Nee, dat is mobiliteit.'], uh: 'Waterveiligheid: bescherming tegen wateroverlast.' },
      { v: 'Wat is een polder?', o: ['een drooggemaakt stuk land onder zeeniveau', 'een systeem van dijken', 'een riviermonding', 'een stadswijk'], c: 0, d: 2, uo: ['Klopt: een polder is drooggemaakt laag land.', 'Nee, dat is een dijkring.', 'Nee, dat is een delta.', 'Nee, dat is stedelijk.'], uh: 'Polder: drooggemaakt land onder zeeniveau.' },
      { v: 'Wat is rivierverruiming?', o: ['rivieren meer ruimte geven voor de waterafvoer', 'rivieren smaller maken', 'de trek naar de stad', 'de opwarming van de aarde'], c: 0, d: 3, uo: ['Klopt: meer ruimte verlaagt het overstromingsrisico.', 'Nee, juist het omgekeerde.', 'Nee, dat is urbanisatie.', 'Nee, dat is klimaat.'], uh: 'Rivierverruiming: meer ruimte voor de rivier.' },
      { v: 'Wat is ruimtelijke ordening?', o: ['het beleid over het gebruik van de ruimte', 'de bescherming tegen water', 'de verplaatsing van mensen', 'de groei van steden'], c: 0, d: 2, uo: ['Klopt: de overheid deelt de ruimte in.', 'Nee, dat is waterveiligheid.', 'Nee, dat is mobiliteit.', 'Nee, dat is verstedelijking.'], uh: 'Ruimtelijke ordening: beleid over de ruimte.' },
      { v: 'Wat is mobiliteit?', o: ['de verplaatsing van mensen en goederen', 'de bescherming tegen water', 'de groei van steden', 'het beleid over de ruimte'], c: 0, d: 2, uo: ['Klopt: mobiliteit gaat over verplaatsen.', 'Nee, dat is waterveiligheid.', 'Nee, dat is verstedelijking.', 'Nee, dat is ruimtelijke ordening.'], uh: 'Mobiliteit: verplaatsing van mensen en goederen.' },
      { v: 'Wat is een dijkring?', o: ['een gesloten systeem van aaneengesloten dijken', 'een drooggemaakt stuk land', 'een riviermonding', 'een stadswijk'], c: 0, d: 3, uo: ['Klopt: een dijkring omsluit een gebied volledig.', 'Nee, dat is een polder.', 'Nee, dat is een delta.', 'Nee, dat is stedelijk.'], uh: 'Dijkring: gesloten systeem van dijken.' },
      { v: 'Wat is klimaatadaptatie?', o: ['het aanpassen aan de gevolgen van klimaatverandering', 'het verminderen van de uitstoot', 'de trek naar de stad', 'het schoonmaken van water'], c: 0, d: 2, uo: ['Klopt: adaptatie past de omgeving aan de gevolgen aan.', 'Nee, dat is mitigatie.', 'Nee, dat is urbanisatie.', 'Nee, dat is iets anders.'], uh: 'Klimaatadaptatie: aanpassen aan de gevolgen.' },
      { v: 'Hoe bereken je het overstromingsrisico?', o: ['kans maal gevolg', 'kans plus gevolg', 'alleen de kans', 'alleen het gevolg'], c: 0, d: 3, uo: ['Klopt: risico is kans maal gevolg.', 'Nee, het is een product.', 'Nee, ook de gevolgen tellen mee.', 'Nee, ook de kans telt mee.'], uh: 'Overstromingsrisico: kans × gevolg.' },
    ]),
];
