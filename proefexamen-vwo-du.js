// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-du.js  ORIGINEEL Slagio-proefexamen (vwo Duits).
// Eigen Duitse teksten, vragen en figuren. Geen reproductie van een CvTE-examen.
// CE-stijl leesvaardigheid: meerdere teksten, overwegend meerkeuze (in het
// Duits) met enkele open vragen (in het Nederlands), zoals op het echte
// centraal examen. Alle teksten zijn door Slagio geschreven.
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

function _duHdr(title, src){
  return '<svg viewBox="0 0 360 92" role="img" aria-label="artikelkopf">'+
    '<rect x="10" y="8" width="340" height="76" rx="6" fill="#ffffff" stroke="#d7dde6" stroke-width="1.4"/>'+
    '<rect x="10" y="8" width="6" height="76" rx="3" fill="#c0392b"/>'+
    '<text x="28" y="40" font-family="Georgia,serif" font-size="16" font-weight="800" fill="#1b2230">'+title+'</text>'+
    '<text x="28" y="62" font-family="sans-serif" font-size="9.5" font-style="italic" fill="#8a94a3">'+src+'</text>'+
    '<text x="28" y="77" font-family="sans-serif" font-size="8" fill="#b3bcc9">Lies den Text und beantworte die Fragen.</text></svg>';
}

var _VDUTXT = {
  wolf:
`(1) Mehr als hundert Jahre lang galt der Wolf in Deutschland als ausgestorben. Seit einigen Jahren aber kehrt er zurück: Heute leben wieder mehr als tausend Wölfe in den Wäldern des Landes.

(2) Naturschützer freuen sich darüber. Für sie ist die Rückkehr des Wolfs ein Zeichen dafür, dass die Natur sich erholt. Als Jäger an der Spitze der Nahrungskette halte der Wolf zudem den Bestand von Rehen und Wildschweinen gesund.

(3) Viele Bauern jedoch sind besorgt. Immer wieder reißen Wölfe ihre Schafe, und für die Tierhalter bedeutet das Verlust, Angst und viel Arbeit mit Zäunen und Schutzhunden. Manche fordern deshalb, dass "Problemwölfe" geschossen werden dürfen.

(4) Die Politik sitzt zwischen den Fronten. Sie zahlt den Bauern eine Entschädigung für gerissene Tiere und bezuschusst Schutzmaßnahmen, will aber zugleich die streng geschützte Art nicht gefährden.

(5) Am Ende, sagen Fachleute, gehe es nicht um die Frage "Wolf oder Bauer". Es gehe darum, ob Mensch und Wolf lernen können, sich denselben Raum zu teilen.`,
  stadt:
`(1) Stellen Sie sich eine Innenstadt vor, in der keine Autos fahren: keine Abgase, kein Lärm, nur Menschen, Fahrräder und Straßenbahnen. In immer mehr europäischen Städten ist das keine Fantasie mehr, sondern Wirklichkeit.

(2) Die Vorteile liegen auf der Hand. Die Luft wird sauberer, die Straßen werden sicherer, und Plätze, auf denen früher Autos parkten, werden zu Cafés, Spielplätzen und Grünflächen. Viele Bewohner sagen, ihre Stadt sei lebendiger geworden.

(3) Doch nicht alle sind begeistert. Ladenbesitzer fürchten, dass Kunden ausbleiben, wenn man nicht mehr mit dem Auto vorfahren kann. Und ältere oder kranke Menschen fragen sich, wie sie ohne Auto ihre Einkäufe nach Hause bringen sollen.

(4) Die Städte versuchen, Antworten zu finden. Sie bauen den öffentlichen Nahverkehr aus, richten Lieferzonen ein und sorgen dafür, dass am Rand der Innenstadt genug Parkplätze bleiben.

(5) Ob die autofreie Stadt sich durchsetzt, hängt also weniger von der Technik ab als von der Frage, ob die Menschen bereit sind, ihre Gewohnheiten zu ändern.`,
  gaehnen:
`(1) Jeder tut es, mehrmals am Tag, und niemand kann es wirklich unterdrücken: das Gähnen. Doch warum wir gähnen, ist eine Frage, über die Wissenschaftler bis heute streiten.

(2) Lange glaubte man, das Gähnen versorge das Gehirn mit Sauerstoff. Diese Erklärung gilt heute als überholt, denn Versuche zeigten, dass Menschen mit mehr Sauerstoff nicht weniger gähnen.

(3) Eine neuere Theorie lautet: Gähnen kühlt das Gehirn. Beim tiefen Einatmen strömt kühlere Luft in den Körper, und das könnte das überhitzte Gehirn ein wenig herunterkühlen, ähnlich wie ein Ventilator.

(4) Besonders rätselhaft ist, dass Gähnen ansteckend ist. Sieht man einen anderen gähnen, muss man oft selbst gähnen. Forscher vermuten, dass dies mit Mitgefühl zu tun hat: Wer leichter mitgähnt, kann sich vielleicht besser in andere hineinversetzen.

(5) So ist das Gähnen ein gutes Beispiel dafür, wie viel wir über unseren eigenen Körper noch nicht wissen, selbst bei etwas, das wir jeden Tag tun.`,
  bargeld:
`(1) In manchen Ländern zahlt fast niemand mehr mit Münzen und Scheinen; in Deutschland dagegen halten viele Menschen am Bargeld fest. Warum eigentlich?

(2) Für das Bezahlen mit Karte oder Handy spricht viel: Es geht schnell, man muss kein Wechselgeld zählen, und im Geschäft bilden sich kürzere Schlangen. Auch Diebe haben es schwerer, wenn man wenig Bargeld bei sich trägt.

(3) Trotzdem hat das Bargeld seine Anhänger. Mit Scheinen und Münzen behalte man den Überblick über seine Ausgaben, argumentieren sie, und man hinterlasse keine Spur: Niemand kann sehen, was man wo gekauft hat.

(4) Gerade dieser letzte Punkt, der Schutz der Privatsphäre, wird vielen immer wichtiger. Wer bargeldlos zahlt, gibt Banken und Firmen Einblick in sein Leben, und diese Daten sind wertvoll.

(5) Vielleicht liegt die Zukunft deshalb nicht im vollständigen Verschwinden des Bargelds, sondern in der freien Wahl: Jeder soll selbst entscheiden dürfen, wie er bezahlt.`,
  nachtzug:
`(1) Lange Zeit schien der Nachtzug ein Verkehrsmittel von gestern zu sein. Billigflüge waren schneller und oft günstiger, und eine Strecke nach der anderen wurde eingestellt. Doch nun kehren die Nachtzüge zurück.

(2) [Lücke] Immer mehr Reisende möchten das Klima schonen, und ein Flug belastet die Umwelt weit stärker als eine Zugfahrt. Abends einsteigen, schlafen und morgens erholt am Ziel ankommen: Für viele klingt das plötzlich wieder verlockend.

(3) Auch die Bahnunternehmen haben umgedacht. Sie kaufen neue Wagen mit bequemen Betten und kleinen Abteilen und verbinden wieder Städte, zwischen denen jahrelang kein Nachtzug mehr fuhr.

(4) Ganz ohne Probleme ist die Rückkehr allerdings nicht. Nachtzüge sind teuer im Betrieb, und wer schon einmal in einem vollen Abteil schlecht geschlafen hat, weiß, dass die Romantik ihre Grenzen hat.

(5) Trotzdem steht fest: Der Nachtzug ist zurück auf den Schienen, und für eine Generation, die ans Klima denkt, ist er mehr als nur Nostalgie.`,
};

SLAGIO_EXAMENS.vwo.du = {
  origineel: true,
  titel: 'Duits',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 90,
  max_punten: 26,
  bron: 'Slagio origineel · examenstijl (eigen Duitse teksten)',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Text 1: Der Wolf ist zurück',
      context:_VDUTXT.wolf, afb:_duHdr('Der Wolf ist zurück','Segen oder Gefahr?') },
    { nr:2, titel:'Text 2: Eine Stadt ohne Autos',
      context:_VDUTXT.stadt, afb:_duHdr('Die Stadt ohne Autos','mehr Raum für Menschen') },
    { nr:3, titel:'Text 3: Warum wir gähnen',
      context:_VDUTXT.gaehnen, afb:_duHdr('Warum wir gähnen','ein alltägliches Rätsel') },
    { nr:4, titel:'Text 4: Bargeld oder Karte?',
      context:_VDUTXT.bargeld, afb:_duHdr('Bargeld oder Karte?','wie wir morgen bezahlen') },
    { nr:5, titel:'Text 5: Die Rückkehr der Nachtzüge',
      context:_VDUTXT.nachtzug, afb:_duHdr('Die Rückkehr der Nachtzüge','Schlafen statt Fliegen') },
  ],
  vragen: [
    // ── Text 1 ────────────────────────────────────────────────────────
    { nr:1, opgave:1, punten:1, type:'mc', domein:'Hauptgedanke',
      vraag:'Was ist der Hauptgedanke des Textes?',
      opties:[
        'Der Wolf sollte in Deutschland wieder ausgerottet werden.',
        'Die Rückkehr des Wolfs freut die einen und beunruhigt die anderen.',
        'Bauern und Naturschützer sind sich völlig einig.',
        'In Deutschland gibt es kaum noch Wölfe.'],
      correct:1,
      uitleg:'De tekst zet de blijdschap van natuurbeschermers (alinea 2) tegenover de zorgen van boeren (alinea 3); de terugkeer verdeelt de meningen.' },
    { nr:2, opgave:1, punten:1, type:'mc', domein:'Detail',
      vraag:'Warum ist der Wolf laut Absatz 2 für die Natur nützlich?',
      opties:[
        'Weil er Schafe frisst.',
        'Weil er als Jäger den Bestand von Rehen und Wildschweinen gesund hält.',
        'Weil er Touristen anzieht.',
        'Weil er die Wälder sauber hält.'],
      correct:1,
      uitleg:'Absatz 2: als jager bovenaan de voedselketen houdt de wolf de stand van reeën en wilde zwijnen gezond.' },
    { nr:3, opgave:1, punten:1, type:'mc', domein:'Funktion',
      vraag:'Welche Rolle spielt die Politik laut Absatz 4?',
      opties:[
        'Sie verbietet die Schafhaltung.',
        'Sie steht zwischen beiden Seiten und versucht, beide zu berücksichtigen.',
        'Sie ist nur auf der Seite der Bauern.',
        'Sie will alle Wölfe schießen lassen.'],
      correct:1,
      uitleg:'Absatz 4: "zwischen den Fronten" - de politiek betaalt schadevergoeding en subsidieert bescherming, maar wil de beschermde soort niet in gevaar brengen.' },
    { nr:4, opgave:1, punten:1, type:'mc', domein:'Schlussfolgerung',
      vraag:'Was ist laut dem letzten Absatz die eigentliche Frage?',
      opties:[
        'ob man den Wolf oder den Bauern wählen soll',
        'ob Mensch und Wolf sich denselben Raum teilen können',
        'ob es genug Zäune gibt',
        'ob der Wolf schneller ist als der Mensch'],
      correct:1,
      uitleg:'Slotalinea: het gaat niet om "wolf of boer", maar of mens en wolf kunnen leren dezelfde ruimte te delen.' },
    { nr:5, opgave:1, punten:2, type:'open', domein:'Argument',
      vraag:'Waarom zijn veel boeren volgens alinea 3 bezorgd over de wolf? Antwoord in het Nederlands en noem twee dingen.',
      antwoord:'Volgens alinea 3 zijn boeren bezorgd omdat (1) wolven telkens hun schapen doodbijten ("reißen"), wat verlies en angst betekent, en (2) het hun veel werk oplevert met hekken en waakhonden om hun dieren te beschermen. Daarom eisen sommigen dat "probleemwolven" mogen worden afgeschoten.',
      antwoord_rubric:'1 punt: wolven doden hun schapen (verlies/angst). 1 punt: veel extra werk/kosten met hekken en (waak)honden om de dieren te beschermen.' },
    // ── Text 2 ────────────────────────────────────────────────────────
    { nr:6, opgave:2, punten:1, type:'mc', domein:'Detail',
      vraag:'Welche Vorteile einer autofreien Innenstadt nennt Absatz 2?',
      opties:[
        'mehr Parkplätze und schnellere Autos',
        'sauberere Luft, sicherere Straßen und mehr Platz für Menschen',
        'niedrigere Preise in den Geschäften',
        'weniger Fahrräder auf den Straßen'],
      correct:1,
      uitleg:'Absatz 2: schonere lucht, veiligere straten en pleinen die parkeerplaats waren worden cafés, speelplekken en groen.' },
    { nr:7, opgave:2, punten:1, type:'mc', domein:'Kontrast',
      vraag:'Welche Sorge haben die Ladenbesitzer laut Absatz 3?',
      opties:[
        'dass die Mieten steigen',
        'dass Kunden ausbleiben, weil man nicht mehr mit dem Auto vorfahren kann',
        'dass es zu viele Cafés gibt',
        'dass die Straßenbahnen zu langsam sind'],
      correct:1,
      uitleg:'Absatz 3: winkeliers vrezen dat klanten wegblijven als je niet meer met de auto kunt voorrijden.' },
    { nr:8, opgave:2, punten:1, type:'mc', domein:'Schlussfolgerung',
      vraag:'Wovon hängt der Erfolg der autofreien Stadt laut Absatz 5 vor allem ab?',
      opties:[
        'von besserer Technik',
        'davon, ob die Menschen bereit sind, ihre Gewohnheiten zu ändern',
        'vom Wetter',
        'von den Preisen der Autos'],
      correct:1,
      uitleg:'Absatz 5: het hangt minder van techniek af dan van de vraag of mensen bereid zijn hun gewoonten te veranderen.' },
    { nr:9, opgave:2, punten:2, type:'open', domein:'Kontext',
      vraag:'Hoe proberen de steden volgens alinea 4 de nadelen van een autovrije binnenstad op te vangen? Noem in het Nederlands twee maatregelen.',
      antwoord:'Volgens alinea 4 nemen de steden onder meer deze maatregelen: (1) ze breiden het openbaar vervoer (Nahverkehr) uit, (2) ze richten laad- en loszones (Lieferzonen) in voor bevoorrading, en (3) ze zorgen dat er aan de rand van de binnenstad genoeg parkeerplaatsen blijven. (Twee daarvan volstaan.)',
      antwoord_rubric:'1 punt: een correcte maatregel (bv. openbaar vervoer uitbreiden). 1 punt: een tweede correcte maatregel (leverzones inrichten of parkeerplaatsen aan de rand houden).' },
    // ── Text 3 ────────────────────────────────────────────────────────
    { nr:10, opgave:3, punten:1, type:'mc', domein:'Detail',
      vraag:'Warum gilt die Sauerstoff-Erklärung des Gähnens laut Absatz 2 heute als überholt?',
      opties:[
        'weil niemand mehr gähnt',
        'weil Menschen mit mehr Sauerstoff nicht weniger gähnen',
        'weil Sauerstoff schädlich ist',
        'weil das Gehirn keinen Sauerstoff braucht'],
      correct:1,
      uitleg:'Absatz 2: proeven toonden dat mensen met meer zuurstof niet minder gaan gähnen, dus die verklaring klopt niet.' },
    { nr:11, opgave:3, punten:1, type:'mc', domein:'Detail',
      vraag:'Wie erklärt die neuere Theorie in Absatz 3 das Gähnen?',
      opties:[
        'Gähnen wärmt das Gehirn auf.',
        'Gähnen kühlt das überhitzte Gehirn ab.',
        'Gähnen macht müde.',
        'Gähnen reinigt die Lunge.'],
      correct:1,
      uitleg:'Absatz 3: bij diep inademen stroomt koelere lucht binnen, wat het oververhitte brein een beetje afkoelt, als een ventilator.' },
    { nr:12, opgave:3, punten:1, type:'mc', domein:'Detail',
      vraag:'Womit könnte das ansteckende Gähnen laut Absatz 4 zusammenhängen?',
      opties:['mit Hunger','mit Mitgefühl','mit Angst','mit Langeweile'],
      correct:1,
      uitleg:'Absatz 4: onderzoekers vermoeden dat meegähnen met inlevingsvermogen/Mitgefühl te maken heeft.' },
    { nr:13, opgave:3, punten:2, type:'open', domein:'Schlussfolgerung',
      vraag:'Wat wil de schrijver met de slotzin ("wie viel wir über unseren eigenen Körper noch nicht wissen") duidelijk maken? Antwoord in het Nederlands.',
      antwoord:'De schrijver wil duidelijk maken dat we zelfs iets heel alledaags en gewoons als gähnen - iets wat we elke dag doen - nog steeds niet volledig begrijpen. Het gähnen is dus een voorbeeld van hoeveel er over ons eigen lichaam nog onbekend is; de wetenschap heeft nog geen zeker antwoord.',
      antwoord_rubric:'1 punt: zelfs iets alledaags/dagelijks (gähnen) begrijpen we nog niet volledig. 1 punt: het staat symbool voor hoeveel er over ons eigen lichaam nog onbekend is / de wetenschap is er niet uit.' },
    // ── Text 4 ────────────────────────────────────────────────────────
    { nr:14, opgave:4, punten:1, type:'mc', domein:'Detail',
      vraag:'Welche Vorteile des bargeldlosen Bezahlens nennt Absatz 2?',
      opties:[
        'Es ist schneller und Diebe haben es schwerer.',
        'Man bekommt mehr Wechselgeld.',
        'Die Preise sinken.',
        'Man bleibt völlig anonym.'],
      correct:0,
      uitleg:'Absatz 2: betalen met kaart/telefoon gaat snel, geen wisselgeld tellen, kortere rijen, en dieven hebben het moeilijker.' },
    { nr:15, opgave:4, punten:1, type:'mc', domein:'Argument',
      vraag:'Welches Argument nennen die Anhänger des Bargelds in Absatz 3?',
      opties:[
        'Bargeld ist moderner.',
        'Mit Bargeld behält man den Überblick und hinterlässt keine Spur.',
        'Bargeld ist immer sicherer als eine Karte.',
        'Bargeld ist bei jungen Leuten beliebter.'],
      correct:1,
      uitleg:'Absatz 3: met contant geld houd je overzicht over je uitgaven en laat je geen spoor na van wat je waar koopt.' },
    { nr:16, opgave:4, punten:1, type:'mc', domein:'Schlussfolgerung',
      vraag:'Worin sieht der Text in Absatz 5 die wahrscheinliche Zukunft?',
      opties:[
        'im völligen Verschwinden des Bargelds',
        'in der freien Wahl, wie man bezahlen möchte',
        'in einer Rückkehr zu nur Münzen',
        'im Verbot von Karten'],
      correct:1,
      uitleg:'Absatz 5: de toekomst ligt niet in het volledig verdwijnen van contant geld, maar in de vrije keuze hoe je betaalt.' },
    { nr:17, opgave:4, punten:2, type:'open', domein:'Argument',
      vraag:'Waarom wordt volgens alinea 4 de bescherming van de privacy voor veel mensen steeds belangrijker bij het betalen? Leg uit in het Nederlands.',
      antwoord:'Volgens alinea 4 geef je, als je zonder contant geld (bargeldlos) betaalt, banken en bedrijven inzicht in je leven: zij kunnen zien wat je waar en wanneer koopt. Die gegevens zijn waardevol. Daarom wordt de bescherming van de privacy voor veel mensen belangrijker: met contant geld laat je juist geen spoor na en houd je die informatie voor jezelf.',
      antwoord_rubric:'1 punt: bij bargeldlos betalen krijgen banken/bedrijven inzicht in je aankopen/leven. 1 punt: die data zijn waardevol / je levert privacy in, terwijl contant geld geen spoor nalaat.' },
    // ── Text 5 ────────────────────────────────────────────────────────
    { nr:18, opgave:5, punten:1, type:'mc', domein:'Detail',
      vraag:'Warum schien der Nachtzug laut Absatz 1 lange ein Verkehrsmittel "von gestern" zu sein?',
      opties:[
        'weil er zu teuer für die Bahn war',
        'weil Billigflüge schneller und oft günstiger waren',
        'weil niemand mehr nachts reisen wollte',
        'weil die Betten unbequem waren'],
      correct:1,
      uitleg:'Absatz 1: goedkope vluchten waren sneller en vaak goedkoper, waardoor de ene na de andere nachttreinlijn werd opgeheven.' },
    { nr:19, opgave:5, punten:1, type:'mc', domein:'Lücke',
      vraag:'Welcher Satz passt am besten in die Lücke [Lücke] am Anfang von Absatz 2?',
      opties:[
        'Fliegen bleibt für immer die beste Wahl.',
        'Der Grund dafür ist vor allem das Klima.',
        'Nachtzüge fahren nur noch selten.',
        'Die Bahn hat kein Geld mehr.'],
      correct:1,
      uitleg:'De rest van alinea 2 gaat over het klimaat (vliegen belast het milieu sterker dan de trein); de openingszin moet die reden aankondigen.' },
    { nr:20, opgave:5, punten:1, type:'mc', domein:'Kontrast',
      vraag:'Welches Problem der Nachtzüge nennt Absatz 4?',
      opties:[
        'Sie sind zu schnell.',
        'Sie sind teuer im Betrieb, und man schläft nicht immer gut.',
        'Es gibt zu viele davon.',
        'Sie fahren nur am Tag.'],
      correct:1,
      uitleg:'Absatz 4: nachttreinen zijn duur in het gebruik, en in een vol compartiment slaap je niet altijd goed - de romantiek heeft grenzen.' },
    { nr:21, opgave:5, punten:2, type:'open', domein:'Hauptgedanke',
      vraag:'Waarom keren de nachttreinen volgens de tekst juist nu terug? Noem in het Nederlands de belangrijkste reden en een maatregel van de spoorbedrijven.',
      antwoord:'De belangrijkste reden is het klimaat: steeds meer reizigers willen milieuvriendelijker reizen, en een vliegreis belast het milieu veel sterker dan een treinreis (alinea 2). Daarnaast hebben de spoorbedrijven zich aangepast: zij kopen nieuwe wagons met comfortabele bedden en kleine compartimenten en verbinden weer steden waar jarenlang geen nachttrein meer reed (alinea 3).',
      antwoord_rubric:'1 punt: hoofdreden = klimaat (vliegen belast milieu veel sterker dan de trein). 1 punt: een maatregel van de spoorbedrijven (nieuwe wagons met bedden/compartimenten of steden weer verbinden).' },
  ],
};
