// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-en.js  ORIGINEEL Slagio-proefexamen (vwo Engels).
// Eigen Engelse teksten, vragen en figuren. Geen reproductie van een CvTE-examen.
// CE-stijl leesvaardigheid: meerdere teksten, overwegend meerkeuze (in het
// Engels) met enkele open vragen (in het Nederlands), zoals op het echte
// centraal examen. Alle teksten zijn door Slagio geschreven.
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

// Compacte artikel-header (titel + bron) als "tijdschriftkop" boven elke tekst.
function _enHdr(title, src){
  return '<svg viewBox="0 0 360 92" role="img" aria-label="article header">'+
    '<rect x="10" y="8" width="340" height="76" rx="6" fill="#ffffff" stroke="#d7dde6" stroke-width="1.4"/>'+
    '<rect x="10" y="8" width="6" height="76" rx="3" fill="#2563eb"/>'+
    '<text x="28" y="40" font-family="Georgia,serif" font-size="16" font-weight="800" fill="#1b2230">'+title+'</text>'+
    '<text x="28" y="62" font-family="sans-serif" font-size="9.5" font-style="italic" fill="#8a94a3">'+src+'</text>'+
    '<text x="28" y="77" font-family="sans-serif" font-size="8" fill="#b3bcc9">Read the text, then answer the questions.</text></svg>';
}

var _VENTXT = {
  mammoth:
`(1) For the first time in history, scientists claim they could revive a species that vanished thousands of years ago. By editing elephant DNA, a company hopes to create a creature much like the woolly mammoth and one day release it onto the frozen tundra of Siberia.

(2) Supporters call it a triumph of science. Bringing back the mammoth, they argue, could even help fight climate change: by trampling snow and knocking down trees, herds of these giant grazers would keep the Arctic soil frozen and lock away carbon that would otherwise escape.

(3) Critics, however, are far less enthusiastic. They point out that the animal would not be a true mammoth at all, but a hairy, cold-resistant elephant. It would be raised without a herd to teach it how to behave, and no one can predict how a single, lonely hybrid would cope in the wild.

(4) There is also the question of money. The sums involved are enormous, and many conservationists insist that the same funds would save far more life if they were spent protecting the thousands of species that are sliding towards extinction right now.

(5) Perhaps the deepest worry is what the project says about us. If we believe we can simply undo extinction, will we try any less hard to prevent it? The debate, it seems, is only beginning.`,
  work:
`(1) What if you could do your whole job in four days instead of five, and still be paid the same? Across the world, a growing number of companies have been testing exactly that, and the early results have surprised almost everyone.

(2) In the largest trial so far, dozens of firms gave their staff a three-day weekend for six months. When it ended, the great majority chose to keep the shorter week. Output had not fallen; in several companies it had actually gone up.

(3) The explanation, researchers suggest, is not magic but focus. Given less time, employees cut out pointless meetings and endless emails and concentrated on work that mattered. Rested and less stressed, they simply worked better while they were at their desks.

(4) Not every sector fits the model, of course. A hospital or a fire station cannot send a third of its staff home each week. And some managers fear that, once the novelty fades, the old habits and the old exhaustion will quietly return.

(5) Still, for the first time in a century the five-day week no longer looks like a law of nature. It looks like a choice, and one that more and more workers are asking their bosses to reconsider.`,
  brain:
`(1) You have a deadline tomorrow, yet somehow you are cleaning your desk, watching videos, or making a fourth cup of coffee. Almost everyone procrastinates, and almost everyone feels guilty about it. But scientists say the habit has less to do with laziness than we think.

(2) Procrastination, they argue, is really about emotion. When a task feels boring, difficult or frightening, the brain reaches for something that feels better right now. Putting the task off brings instant relief, and that relief teaches the brain to do the same thing again next time.

(3) The trouble is that the relief never lasts. The deadline still arrives, the stress returns twice as strong, and the guilt only makes the next task feel even more unpleasant. In this way procrastination feeds on itself.

(4) So what actually helps? Not willpower, experts say, but kindness. People who forgive themselves for putting something off are, surprisingly, less likely to do it again. Breaking a scary task into one tiny first step also robs it of its power to frighten.

(5) The next time you catch yourself avoiding something, then, the answer is not to shout at yourself. It is to notice the feeling, take a breath, and begin with the smallest possible step.`,
  fashion:
`(1) A T-shirt for the price of a coffee, a dress worn once and thrown away: this is the world of "fast fashion", and it has never been cheaper to look good. But the low price on the label hides a far higher cost that someone, somewhere, is paying.

(2) That cost is partly human. Much of our clothing is made in distant factories where wages are low and working days are long. When a shirt sells for a few euros, there is very little left over to pay the person who sewed it.

(3) The cost is also environmental. The fashion industry uses vast amounts of water and energy and produces a remarkable share of the world's carbon emissions. Worse still, most discarded clothes are neither reused nor recycled; they are burned or buried, mountains of them, every year.

(4) Some brands now promise to do better, with "green" collections and recycling bins in their shops. Critics warn, however, that such gestures can be a form of "greenwashing": a way of looking responsible while selling just as much as before.

(5) The real solution, many argue, is uncomfortably simple. It is not to buy slightly greener clothes, but to buy far fewer of them, and to wear the ones we own for much longer.`,
  kindness:
`(1) On a freezing evening in a busy city, a young man collapsed on a crowded pavement. What happened next has been described, rather sadly, as remarkable: for several minutes, dozens of people simply stepped around him and walked on.

(2) Psychologists have a name for this: the "bystander effect". The more people who are present, the less likely any single person is to help. Each onlooker assumes that someone else will act, or that, since no one else is reacting, nothing must really be wrong.

(3) [gap] A woman finally knelt beside the man, and the moment she did, three or four others immediately stopped to help as well. The spell of the crowd, it seems, can be broken by a single person who refuses to look away.

(4) This is oddly hopeful. It means that helping is not only about how kind you are, but about who moves first. One person's small act of courage gives everyone else permission to be brave too.

(5) So the lesson of that cold evening is not that people are heartless. It is that, in a crowd, someone has to be the first to step forward, and that that someone could always be you.`,
};

SLAGIO_EXAMENS.vwo.en = {
  origineel: true,
  titel: 'Engels',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 90,
  max_punten: 26,
  bron: 'Slagio origineel · examenstijl (eigen Engelse teksten)',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Text 1: Should we bring back the mammoth?',
      context:_VENTXT.mammoth, afb:_enHdr('Bringing back the mammoth','a debate about de-extinction') },
    { nr:2, titel:'Text 2: The four-day week',
      context:_VENTXT.work, afb:_enHdr('The four-day week','less work, more done?') },
    { nr:3, titel:'Text 3: Why your brain loves to procrastinate',
      context:_VENTXT.brain, afb:_enHdr('The science of putting things off','why we procrastinate') },
    { nr:4, titel:'Text 4: The true cost of fast fashion',
      context:_VENTXT.fashion, afb:_enHdr('The true cost of fast fashion','the price behind the price') },
    { nr:5, titel:'Text 5: The kindness of strangers',
      context:_VENTXT.kindness, afb:_enHdr('The kindness of strangers','why crowds walk on by') },
  ],
  vragen: [
    // ── Text 1 ────────────────────────────────────────────────────────
    { nr:1, opgave:1, punten:1, type:'mc', domein:'Main idea',
      vraag:'What is the main point the writer makes in this text?',
      opties:[
        'Reviving the mammoth is certain to help fight climate change.',
        'The plan to revive the mammoth raises serious doubts as well as hopes.',
        'Scientists have already succeeded in bringing the mammoth back.',
        'Elephants and mammoths are essentially the same animal.'],
      correct:1,
      uitleg:'De tekst zet de hoop van voorstanders (alinea 2) systematisch tegenover de bezwaren van critici (alinea 3-5); het draait om twijfel én hoop, niet om zekerheid.' },
    { nr:2, opgave:1, punten:1, type:'mc', domein:'Detail',
      vraag:'According to paragraph 2, how could the mammoth help the climate?',
      opties:[
        'By eating carbon directly from the air.',
        'By replacing cars and factories in the Arctic.',
        'By keeping the frozen soil cold so that carbon stays locked away.',
        'By reducing the number of trees that people cut down.'],
      correct:2,
      uitleg:'Paragraph 2: door sneeuw te vertrappen en bomen om te duwen houden de kuddes de bodem bevroren, waardoor koolstof opgeslagen blijft.' },
    { nr:3, opgave:1, punten:1, type:'mc', domein:'Reference',
      vraag:'What does "It" refer to in "It would be raised without a herd" (paragraph 3)?',
      opties:['a true mammoth','the elephant DNA','the hairy, cold-resistant elephant','the tundra'],
      correct:2,
      uitleg:'"It" verwijst naar het dier dat critici beschrijven: geen echte mammoet maar een harige, koudebestendige olifant.' },
    { nr:4, opgave:1, punten:1, type:'mc', domein:'Attitude',
      vraag:'Which word best describes the writer\'s own attitude in the final paragraph?',
      opties:['enthusiastic','thoughtful','angry','indifferent'],
      correct:1,
      uitleg:'De slotalinea stelt een bedachtzame vraag ("what the project says about us") en concludeert dat het debat pas begint: een afwegende, thoughtful houding.' },
    { nr:5, opgave:1, punten:2, type:'open', domein:'Argument',
      vraag:'Noem in het Nederlands twee verschillende bezwaren die critici volgens alinea 3 en 4 tegen het project hebben.',
      antwoord:'Twee bezwaren (elk uit de tekst): (1) het dier zou geen echte mammoet zijn maar een harige olifant, opgegroeid zonder kudde, en niemand kan voorspellen hoe zo\'n eenzame hybride zich in het wild redt (alinea 3); (2) het kost enorm veel geld, dat volgens natuurbeschermers veel meer soorten zou redden als het besteed werd aan het beschermen van nog levende, bedreigde soorten (alinea 4).',
      antwoord_rubric:'1 punt: het bezwaar uit alinea 3 (geen echte mammoet / eenzame hybride / onvoorspelbaar gedrag). 1 punt: het bezwaar uit alinea 4 (kosten; geld beter besteed aan bestaande bedreigde soorten).' },
    // ── Text 2 ────────────────────────────────────────────────────────
    { nr:6, opgave:2, punten:1, type:'mc', domein:'Detail',
      vraag:'What happened in most companies after the six-month trial (paragraph 2)?',
      opties:[
        'They went back to the five-day week.',
        'They kept the shorter week, and output had not fallen.',
        'They cut their employees\' pay.',
        'They closed down because output collapsed.'],
      correct:1,
      uitleg:'Paragraph 2: de meeste bedrijven hielden de kortere week; de productie was niet gedaald en soms zelfs gestegen.' },
    { nr:7, opgave:2, punten:1, type:'mc', domein:'Cause',
      vraag:'According to paragraph 3, why did employees work better?',
      opties:[
        'They were paid more for each hour.',
        'They cut out pointless meetings and emails and were less stressed.',
        'They hired extra staff to help them.',
        'They worked secretly during the weekend.'],
      correct:1,
      uitleg:'Paragraph 3: met minder tijd schrapten ze zinloze vergaderingen en e-mails en werkten ze, uitgeruster en minder gestrest, gerichter.' },
    { nr:8, opgave:2, punten:1, type:'mc', domein:'Function',
      vraag:'What is the function of paragraph 4 in the text?',
      opties:[
        'It gives extra proof that the four-day week always works.',
        'It repeats the main idea of paragraph 1.',
        'It presents limits and doubts about the four-day week.',
        'It describes how to apply for a shorter week.'],
      correct:2,
      uitleg:'Paragraph 4 noemt sectoren die niet passen (ziekenhuis, brandweer) en de vrees van managers: het brengt beperkingen en twijfels in.' },
    { nr:9, opgave:2, punten:2, type:'open', domein:'Conclusion',
      vraag:'Leg in het Nederlands uit wat de schrijver bedoelt met de slotzin dat de vijfdaagse werkweek "no longer looks like a law of nature ... It looks like a choice".',
      antwoord:'De schrijver bedoelt dat de vijfdaagse werkweek lange tijd werd gezien als iets vanzelfsprekends en onveranderlijks, alsof het een natuurwet was. De proeven laten echter zien dat het ook anders kan (een vierdaagse week met behoud van productie en loon). Daardoor blijkt de vijfdaagse week geen onwrikbaar gegeven te zijn, maar een keuze die je kunt heroverwegen, en steeds meer werknemers vragen daar ook om.',
      antwoord_rubric:'1 punt: "law of nature" = het werd als vanzelfsprekend/onveranderlijk gezien. 1 punt: "a choice" = het kan ook anders, dus je kunt het heroverwegen (mede door de geslaagde proeven).' },
    // ── Text 3 ────────────────────────────────────────────────────────
    { nr:10, opgave:3, punten:1, type:'mc', domein:'Main idea',
      vraag:'What is the writer\'s main claim about procrastination?',
      opties:[
        'It is mainly caused by laziness.',
        'It is really about avoiding an unpleasant feeling.',
        'It is impossible to overcome.',
        'It only happens to a few unusual people.'],
      correct:1,
      uitleg:'Paragraph 2: uitstel gaat over emotie; de hersenen ontwijken een taak die vervelend, moeilijk of eng voelt.' },
    { nr:11, opgave:3, punten:1, type:'mc', domein:'Detail',
      vraag:'Why does the writer say procrastination "feeds on itself" (paragraph 3)?',
      opties:[
        'Because the relief lasts longer each time.',
        'Because the task becomes easier the longer you wait.',
        'Because the returning stress and guilt make the next task feel even worse.',
        'Because other people start to help you.'],
      correct:2,
      uitleg:'Paragraph 3: de opluchting is kort, de stress komt sterker terug en de schuld maakt de volgende taak nog onaangenamer, waardoor het patroon zichzelf versterkt.' },
    { nr:12, opgave:3, punten:1, type:'mc', domein:'Detail',
      vraag:'According to paragraph 4, what actually helps against procrastination?',
      opties:[
        'Strong willpower and self-criticism.',
        'Forgiving yourself and taking one tiny first step.',
        'Waiting until you feel motivated.',
        'Avoiding difficult tasks completely.'],
      correct:1,
      uitleg:'Paragraph 4: niet wilskracht maar mildheid; wie zichzelf vergeeft stelt minder snel opnieuw uit, en een piepkleine eerste stap neemt de angst weg.' },
    { nr:13, opgave:3, punten:2, type:'open', domein:'Vocabulary',
      vraag:'In alinea 4 staat: "Breaking a scary task into one tiny first step also robs it of its power to frighten." Leg in het Nederlands uit wat hiermee wordt bedoeld.',
      antwoord:'Het betekent dat een enge, grote taak minder beangstigend wordt als je hem opdeelt in een heel klein eerste stapje. Door alleen dat minuscule begin te hoeven doen (in plaats van de hele taak in een keer), verliest de taak zijn vermogen om je bang te maken: het voelt behapbaar, waardoor je makkelijker begint.',
      antwoord_rubric:'1 punt: opdelen in een piepklein eerste stapje. 1 punt: daardoor wordt de taak minder eng/behapbaar, zodat je makkelijker begint.' },
    // ── Text 4 ────────────────────────────────────────────────────────
    { nr:14, opgave:4, punten:1, type:'mc', domein:'Main idea',
      vraag:'What is the central message of this text?',
      opties:[
        'Fast fashion is cheap because it is made efficiently.',
        'The low price of fast fashion hides high human and environmental costs.',
        'Recycling bins in shops have solved the problem of waste.',
        'People should buy slightly greener clothes as often as possible.'],
      correct:1,
      uitleg:'De rode draad (alinea 1-3) is dat de lage prijs een veel hogere prijs verbergt: menselijke (lage lonen) en ecologische (water, CO2, afval) kosten.' },
    { nr:15, opgave:4, punten:1, type:'mc', domein:'Detail',
      vraag:'What does the writer mean by "greenwashing" (paragraph 4)?',
      opties:[
        'Washing clothes in an environmentally friendly way.',
        'Looking responsible while in fact selling just as much as before.',
        'A new law that forces brands to recycle.',
        'A method of dyeing clothes green.'],
      correct:1,
      uitleg:'Paragraph 4: greenwashing is de schijn van verantwoordelijkheid wekken (groene collecties, recyclebakken) terwijl je evenveel blijft verkopen.' },
    { nr:16, opgave:4, punten:1, type:'mc', domein:'Reference',
      vraag:'What solution does the writer support in the final paragraph?',
      opties:[
        'Buying more "green" collections.',
        'Buying far fewer clothes and wearing them much longer.',
        'Putting more recycling bins in shops.',
        'Making clothes even cheaper.'],
      correct:1,
      uitleg:'De slotalinea noemt de echte oplossing: niet iets groenere kleren kopen, maar veel minder kopen en langer dragen.' },
    { nr:17, opgave:4, punten:2, type:'open', domein:'Argument',
      vraag:'De schrijver noemt twee soorten "cost" van fast fashion. Beschrijf ze allebei in het Nederlands (alinea 2 en 3).',
      antwoord:'(1) De menselijke kosten (alinea 2): veel kleding wordt gemaakt in verre fabrieken met lage lonen en lange werkdagen; van een shirt van een paar euro blijft nauwelijks iets over voor de maker. (2) De ecologische kosten (alinea 3): de mode-industrie gebruikt enorm veel water en energie en veroorzaakt een groot deel van de wereldwijde CO2-uitstoot, en de meeste afgedankte kleding wordt niet hergebruikt maar verbrand of gestort.',
      antwoord_rubric:'1 punt: menselijke kosten (lage lonen/lange werkdagen; weinig voor de maker). 1 punt: ecologische kosten (water/energie/CO2 en afval dat wordt verbrand of gestort).' },
    // ── Text 5 ────────────────────────────────────────────────────────
    { nr:18, opgave:5, punten:1, type:'mc', domein:'Detail',
      vraag:'What is the "bystander effect" as explained in paragraph 2?',
      opties:[
        'People help faster when a crowd is watching.',
        'The more people are present, the less likely any single one is to help.',
        'People only help those they already know.',
        'Crowds always panic in an emergency.'],
      correct:1,
      uitleg:'Paragraph 2: hoe meer mensen aanwezig zijn, hoe kleiner de kans dat één iemand helpt; ieder denkt dat een ander wel ingrijpt.' },
    { nr:19, opgave:5, punten:1, type:'mc', domein:'Gap',
      vraag:'Which sentence best fits the gap [gap] at the start of paragraph 3?',
      opties:[
        'The crowd grew larger and larger.',
        'And yet, that evening, the effect was suddenly broken.',
        'No one ever helps a stranger in a big city.',
        'The man had, in fact, only tripped.'],
      correct:1,
      uitleg:'De rest van alinea 3 beschrijft juist hoe het effect werd doorbroken (een vrouw knielde neer, anderen volgden); de openingszin moet die ommekeer aankondigen.' },
    { nr:20, opgave:5, punten:1, type:'mc', domein:'Tone',
      vraag:'The writer calls the situation "oddly hopeful" (paragraph 4) because',
      opties:[
        'the man was not really hurt.',
        'helping depends on who moves first, so anyone can start it.',
        'crowds are always kind in the end.',
        'the police arrived quickly.'],
      correct:1,
      uitleg:'Paragraph 4: hoopvol omdat helpen afhangt van wie als eerste beweegt; één moedige stap geeft de rest toestemming om ook te helpen.' },
    { nr:21, opgave:5, punten:2, type:'open', domein:'Conclusion',
      vraag:'Wat is volgens de slotalinea "the lesson of that cold evening"? Leg het in het Nederlands uit.',
      antwoord:'De les is niet dat mensen harteloos zijn, maar dat er in een menigte iemand als eerste naar voren moet stappen om te helpen, omdat anderen dan volgen. En die eerste persoon zou altijd jij kunnen zijn: het hangt er dus van af wie het initiatief neemt, niet alleen van hoe aardig mensen zijn.',
      antwoord_rubric:'1 punt: niet dat mensen harteloos zijn, maar dat iemand als eerste moet ingrijpen (waarna anderen volgen). 1 punt: dat die eerste persoon jij kunt zijn / het hangt af van wie het initiatief neemt.' },
  ],
};
