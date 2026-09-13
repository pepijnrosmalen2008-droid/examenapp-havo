// ═══════════════════════════════════════════════════════════════════════
// proefexamen-vwo-fr.js  ORIGINEEL Slagio-proefexamen (vwo Frans).
// Eigen Franse teksten, vragen en figuren. Geen reproductie van een CvTE-examen.
// CE-stijl leesvaardigheid: meerdere teksten, overwegend meerkeuze (in het
// Frans) met enkele open vragen (in het Nederlands), zoals op het echte
// centraal examen. Alle teksten zijn door Slagio geschreven.
// ═══════════════════════════════════════════════════════════════════════
var SLAGIO_EXAMENS = (typeof SLAGIO_EXAMENS !== 'undefined' && SLAGIO_EXAMENS) || {};
SLAGIO_EXAMENS.vwo = SLAGIO_EXAMENS.vwo || {};

function _frHdr(title, src){
  return '<svg viewBox="0 0 360 92" role="img" aria-label="en-tete d article">'+
    '<rect x="10" y="8" width="340" height="76" rx="6" fill="#ffffff" stroke="#d7dde6" stroke-width="1.4"/>'+
    '<rect x="10" y="8" width="6" height="76" rx="3" fill="#1b4fb0"/>'+
    '<text x="28" y="40" font-family="Georgia,serif" font-size="15" font-weight="800" fill="#1b2230">'+title+'</text>'+
    '<text x="28" y="62" font-family="sans-serif" font-size="9.5" font-style="italic" fill="#8a94a3">'+src+'</text>'+
    '<text x="28" y="77" font-family="sans-serif" font-size="8" fill="#b3bcc9">Lis le texte, puis reponds aux questions.</text></svg>';
}

var _VFRTXT = {
  portable:
`(1) Dans de nombreuses écoles, le téléphone portable est désormais interdit en classe. Selon le ministre, cette mesure permet aux élèves de mieux se concentrer et de moins se laisser distraire pendant les cours.

(2) Les partisans de l'interdiction s'appuient sur des études. Celles-ci montrent que, sans leur téléphone, les élèves obtiennent souvent de meilleurs résultats et se parlent davantage pendant la récréation, au lieu de regarder chacun leur écran.

(3) Pourtant, tout le monde n'est pas d'accord. Certains enseignants estiment que le portable peut aussi être un outil utile, par exemple pour chercher une information ou traduire un mot. Le véritable enjeu, disent-ils, n'est pas l'appareil, mais la manière dont on l'utilise.

(4) Les adversaires d'une interdiction totale ajoutent un autre argument. Si l'on cache complètement le téléphone aux élèves, comment apprendront-ils un jour à s'en servir de façon raisonnable? Interdire, selon eux, ne suffit pas: il faut aussi éduquer.

(5) Peut-être la meilleure solution se trouve-t-elle entre les deux: un portable rangé pendant les cours, mais des leçons où l'on apprend à vivre avec les écrans plutôt qu'à les fuir.`,
  velo:
`(1) Pendant des décennies, la voiture a régné sur nos villes. Aujourd'hui, dans beaucoup de centres-villes, c'est un autre véhicule qui reprend peu à peu sa place: le vélo.

(2) Les raisons de ce retour sont nombreuses. Le vélo ne pollue pas, ne fait pas de bruit et ne reste jamais coincé dans les embouteillages. Sur de courtes distances, il est souvent plus rapide que la voiture, et il coûte bien moins cher.

(3) Pour encourager les cyclistes, les villes construisent de nouvelles pistes cyclables, séparées de la circulation. Là où ces pistes existent, le nombre de cyclistes augmente rapidement, et les rues deviennent plus sûres pour tout le monde.

(4) Tout n'est pas simple pour autant. Par mauvais temps, le vélo attire moins, et certains automobilistes supportent mal de perdre de l'espace au profit des cyclistes. Le partage de la rue provoque parfois des tensions.

(5) Malgré cela, la tendance semble claire. Pour beaucoup d'habitants, une ville où l'on circule à vélo n'est pas seulement plus propre: elle est aussi plus agréable à vivre.`,
  reves:
`(1) Chaque nuit, nous passons plusieurs heures à rêver, souvent sans nous en souvenir au réveil. Mais à quoi servent les rêves? La question fascine les scientifiques depuis longtemps, et ils n'ont pas de réponse unique.

(2) Selon une première théorie, le rêve aide à trier les souvenirs. Pendant le sommeil, le cerveau reprendrait les événements de la journée, garderait ce qui est important et effacerait le reste.

(3) Une autre idée est que les rêves nous permettent de nous entraîner. En affrontant en rêve des situations difficiles ou effrayantes, nous serions mieux préparés à y faire face dans la vie réelle, comme lors d'une répétition.

(4) Certains chercheurs pensent au contraire que les rêves n'ont aucun but précis. Ils ne seraient qu'un effet secondaire de l'activité du cerveau pendant la nuit, un peu comme le bruit d'un moteur qui tourne.

(5) Pour l'instant, aucune de ces théories n'a définitivement gagné. Le rêve reste l'un des grands mystères de notre esprit, un spectacle que nous nous offrons chaque nuit sans vraiment le comprendre.`,
  viande:
`(1) De plus en plus de gens décident de manger moins de viande, sans pour autant devenir complètement végétariens. On appelle parfois ces personnes des "flexitariens". Pourquoi ce changement?

(2) La première raison est l'environnement. Produire de la viande, surtout du bœuf, demande énormément d'eau et de terres et provoque une grande partie des gaz à effet de serre. Manger moins de viande est donc un moyen simple de réduire son empreinte.

(3) La santé joue aussi un rôle. Les médecins conseillent depuis longtemps de manger davantage de légumes et de céréales et un peu moins de viande rouge, pour le cœur comme pour le reste du corps.

(4) Réduire la viande ne signifie pas manger moins bien, au contraire. De nouveaux plats et de nouveaux produits apparaissent, et beaucoup de gens redécouvrent des cuisines où les légumes tiennent la première place.

(5) Le message des spécialistes n'est donc pas "ne mangez plus jamais de viande", mais plutôt "mangez-en moins souvent, et de meilleure qualité". Un petit changement, répété chaque semaine, peut avoir un grand effet.`,
  sourire:
`(1) Un sourire ne coûte rien et ne dure qu'un instant, mais ses effets peuvent être étonnamment grands. Les chercheurs qui étudient les émotions le répètent: sourire n'est pas seulement le signe qu'on est heureux.

(2) [trou] En effet, le simple fait de sourire, même sans raison, envoie un signal au cerveau et peut réellement améliorer notre humeur. Le corps, en quelque sorte, influence l'esprit autant que l'esprit influence le corps.

(3) Le sourire est de plus contagieux. Quand quelqu'un nous sourit, il est très difficile de ne pas lui rendre son sourire. Sans un mot, un sourire peut ainsi transformer l'atmosphère de toute une pièce.

(4) Ce pouvoir a aussi ses limites. Un sourire forcé, que l'on devine faux, produit souvent l'effet inverse et met les autres mal à l'aise. C'est la sincérité, et non les dents, qui fait la force d'un sourire.

(5) La prochaine fois que vous croiserez un inconnu, essayez donc de lui sourire. Ce petit geste, presque gratuit, pourrait bien être le plus utile de votre journée.`,
};

SLAGIO_EXAMENS.vwo.fr = {
  origineel: true,
  titel: 'Frans',
  niveau: 'vwo',
  jaar: new Date().getFullYear(),
  duur_minuten: 90,
  max_punten: 26,
  bron: 'Slagio origineel · examenstijl (eigen Franse teksten)',
  bijlagen: [],
  opgaven: [
    { nr:1, titel:'Texte 1: Faut-il interdire le portable?',
      context:_VFRTXT.portable, afb:_frHdr('Faut-il interdire le portable?','les ecrans a l ecole') },
    { nr:2, titel:'Texte 2: Le retour du velo en ville',
      context:_VFRTXT.velo, afb:_frHdr('Le retour du velo','la ville a deux roues') },
    { nr:3, titel:'Texte 3: Pourquoi revons-nous?',
      context:_VFRTXT.reves, afb:_frHdr('Pourquoi revons-nous?','le mystere des reves') },
    { nr:4, titel:'Texte 4: Manger moins de viande',
      context:_VFRTXT.viande, afb:_frHdr('Manger moins de viande','la montee des flexitariens') },
    { nr:5, titel:'Texte 5: Le pouvoir d un sourire',
      context:_VFRTXT.sourire, afb:_frHdr('Le pouvoir d un sourire','un petit geste, grand effet') },
  ],
  vragen: [
    // ── Texte 1 ───────────────────────────────────────────────────────
    { nr:1, opgave:1, punten:1, type:'mc', domein:'Idee principale',
      vraag:'Quel est le sujet central de ce texte?',
      opties:[
        'la fabrication des téléphones portables',
        'le débat sur l\'interdiction du portable à l\'école',
        'les meilleures applications pour les élèves',
        'l\'histoire du téléphone'],
      correct:1,
      uitleg:'De hele tekst gaat over het debat of de mobiele telefoon op school verboden moet worden (voor- en tegenstanders).' },
    { nr:2, opgave:1, punten:1, type:'mc', domein:'Detail',
      vraag:'Que montrent les études citées au paragraphe 2?',
      opties:[
        'que les élèves s\'ennuient sans téléphone',
        'que, sans téléphone, les élèves obtiennent souvent de meilleurs résultats',
        'que les téléphones améliorent les notes',
        'que les élèves ne se parlent plus'],
      correct:1,
      uitleg:'Paragraphe 2: zonder telefoon halen leerlingen vaak betere resultaten en praten ze meer met elkaar.' },
    { nr:3, opgave:1, punten:1, type:'mc', domein:'Argument',
      vraag:'Selon les adversaires d\'une interdiction totale (paragraphe 4), pourquoi interdire ne suffit-il pas?',
      opties:[
        'parce que les téléphones sont trop chers',
        'parce que les élèves doivent aussi apprendre à s\'en servir raisonnablement',
        'parce que les professeurs aiment les téléphones',
        'parce que l\'interdiction est illégale'],
      correct:1,
      uitleg:'Paragraphe 4: als je de telefoon helemaal verbergt, leren leerlingen nooit er verstandig mee om te gaan; verbieden alleen is niet genoeg, je moet ook opvoeden.' },
    { nr:4, opgave:1, punten:1, type:'mc', domein:'Conclusion',
      vraag:'Quelle solution le texte propose-t-il au paragraphe 5?',
      opties:[
        'interdire tous les écrans partout',
        'un portable rangé en cours, mais apprendre à vivre avec les écrans',
        'donner un téléphone à chaque élève',
        'supprimer les cours d\'informatique'],
      correct:1,
      uitleg:'Paragraphe 5: de beste oplossing ligt ertussenin: telefoon opgeborgen tijdens de les, maar lessen waarin je leert leven met schermen.' },
    { nr:5, opgave:1, punten:2, type:'open', domein:'Vocabulaire',
      vraag:'In alinea 3 staat: "Le véritable enjeu, disent-ils, n\'est pas l\'appareil, mais la manière dont on l\'utilise." Leg in het Nederlands uit wat de docenten hiermee bedoelen.',
      antwoord:'De docenten bedoelen dat het echte punt (de kern van de zaak, "l\'enjeu") niet het apparaat zelf is: de telefoon is op zichzelf niet goed of slecht. Het gaat erom hóe je hem gebruikt. Verstandig gebruikt kan de telefoon een nuttig hulpmiddel zijn (informatie opzoeken, een woord vertalen), en juist daarom moet je leerlingen leren er goed mee om te gaan in plaats van hem simpelweg te verbieden.',
      antwoord_rubric:'1 punt: het gaat niet om het apparaat zelf (dat is op zich niet goed/slecht). 1 punt: het gaat om de manier waarop je hem gebruikt (verstandig gebruik / leren omgaan).' },
    // ── Texte 2 ───────────────────────────────────────────────────────
    { nr:6, opgave:2, punten:1, type:'mc', domein:'Detail',
      vraag:'Quels avantages du vélo le paragraphe 2 mentionne-t-il?',
      opties:[
        'il est cher mais rapide',
        'il ne pollue pas, ne fait pas de bruit et évite les embouteillages',
        'il est plus confortable qu\'une voiture',
        'il ne tombe jamais en panne'],
      correct:1,
      uitleg:'Paragraphe 2: de fiets vervuilt niet, maakt geen lawaai, staat niet in de file, is over korte afstand vaak sneller en veel goedkoper.' },
    { nr:7, opgave:2, punten:1, type:'mc', domein:'Cause',
      vraag:'D\'après le paragraphe 3, quel est l\'effet des pistes cyclables séparées?',
      opties:[
        'le nombre de cyclistes augmente et les rues deviennent plus sûres',
        'les voitures roulent plus vite',
        'les cyclistes disparaissent',
        'les rues deviennent plus dangereuses'],
      correct:0,
      uitleg:'Paragraphe 3: waar afgescheiden fietspaden zijn, groeit het aantal fietsers snel en worden de straten veiliger voor iedereen.' },
    { nr:8, opgave:2, punten:1, type:'mc', domein:'Contraste',
      vraag:'Quel problème le paragraphe 4 signale-t-il?',
      opties:[
        'les vélos sont trop chers',
        'par mauvais temps le vélo attire moins et le partage de la rue crée des tensions',
        'il n\'y a pas assez de vélos',
        'les cyclistes roulent trop lentement'],
      correct:1,
      uitleg:'Paragraphe 4: bij slecht weer trekt de fiets minder, en sommige automobilisten hebben moeite met het afstaan van ruimte; het delen van de straat geeft soms spanningen.' },
    { nr:9, opgave:2, punten:2, type:'open', domein:'Conclusion',
      vraag:'Waarom is een fietsstad volgens de slotalinea niet alleen "plus propre" maar ook "plus agréable à vivre"? Antwoord in het Nederlands.',
      antwoord:'Volgens de slotalinea is een fietsstad niet alleen schoner (minder vervuiling en lawaai door minder auto\'s), maar voor veel bewoners ook prettiger om in te wonen. De stad wordt aangenamer en leefbaarder: veiliger straten, meer ruimte en rust, minder file en herrie. Fietsen levert dus niet alleen milieuwinst op, maar verhoogt ook de kwaliteit van het dagelijks leven in de stad.',
      antwoord_rubric:'1 punt: "plus propre" = schoner (minder vervuiling/lawaai door minder auto\'s). 1 punt: "plus agréable à vivre" = prettiger/leefbaarder om te wonen (veiliger, meer ruimte en rust).' },
    // ── Texte 3 ───────────────────────────────────────────────────────
    { nr:10, opgave:3, punten:1, type:'mc', domein:'Detail',
      vraag:'Selon la première théorie (paragraphe 2), à quoi sert le rêve?',
      opties:[
        'à trier les souvenirs et garder ce qui est important',
        'à reposer les muscles',
        'à prévoir l\'avenir',
        'à effacer tous les souvenirs'],
      correct:0,
      uitleg:'Paragraphe 2: de droom helpt herinneringen te sorteren: het brein bewaart wat belangrijk is en wist de rest.' },
    { nr:11, opgave:3, punten:1, type:'mc', domein:'Detail',
      vraag:'Comment le paragraphe 3 compare-t-il le rêve?',
      opties:[
        'à un moteur qui tourne',
        'à une répétition qui nous entraîne pour la vie réelle',
        'à un long sommeil sans images',
        'à un souvenir d\'enfance'],
      correct:1,
      uitleg:'Paragraphe 3: door in de droom moeilijke of enge situaties aan te gaan, oefenen we ervoor, als bij een repetitie.' },
    { nr:12, opgave:3, punten:1, type:'mc', domein:'Contraste',
      vraag:'Que pensent au contraire certains chercheurs au paragraphe 4?',
      opties:[
        'que les rêves sont des messages secrets',
        'que les rêves n\'ont aucun but précis et ne sont qu\'un effet secondaire',
        'que les rêves prédisent la météo',
        'que seuls les enfants rêvent'],
      correct:1,
      uitleg:'Paragraphe 4: sommige onderzoekers denken juist dat dromen geen doel hebben en slechts een bijverschijnsel van de hersenactiviteit zijn.' },
    { nr:13, opgave:3, punten:2, type:'open', domein:'Idee principale',
      vraag:'De tekst noemt drie verschillende opvattingen over dromen. Leg in het Nederlands uit wat de schrijver in de slotalinea concludeert.',
      antwoord:'De schrijver concludeert dat geen van de drie theorieën (herinneringen sorteren, oefenen, of slechts een bijverschijnsel) definitief heeft gewonnen: de wetenschap is er nog niet uit. De droom blijft daarom een van de grote raadsels van onze geest, iets wat we elke nacht meemaken zonder het echt te begrijpen.',
      antwoord_rubric:'1 punt: geen van de theorieën heeft (definitief) gewonnen / de wetenschap is er niet uit. 1 punt: de droom blijft een raadsel dat we elke nacht beleven zonder het te begrijpen.' },
    // ── Texte 4 ───────────────────────────────────────────────────────
    { nr:14, opgave:4, punten:1, type:'mc', domein:'Detail',
      vraag:'Qu\'est-ce qu\'un "flexitarien" selon le paragraphe 1?',
      opties:[
        'quelqu\'un qui ne mange que de la viande',
        'quelqu\'un qui mange moins de viande sans être complètement végétarien',
        'un cuisinier professionnel',
        'quelqu\'un qui ne mange jamais de légumes'],
      correct:1,
      uitleg:'Paragraphe 1: een flexitariër eet minder vlees zonder helemaal vegetariër te worden.' },
    { nr:15, opgave:4, punten:1, type:'mc', domein:'Argument',
      vraag:'Quelle est, selon le paragraphe 2, la première raison de manger moins de viande?',
      opties:[
        'le goût',
        'l\'environnement',
        'le prix',
        'la mode'],
      correct:1,
      uitleg:'Paragraphe 2: de eerste reden is het milieu; vleesproductie (vooral rundvlees) kost veel water en land en veroorzaakt veel broeikasgassen.' },
    { nr:16, opgave:4, punten:1, type:'mc', domein:'Conclusion',
      vraag:'Quel est le message des spécialistes au paragraphe 5?',
      opties:[
        'ne mangez plus jamais de viande',
        'mangez-en moins souvent, et de meilleure qualité',
        'mangez autant de viande qu\'avant',
        'ne mangez que des légumes'],
      correct:1,
      uitleg:'Paragraphe 5: de boodschap is niet "nooit meer vlees", maar "eet het minder vaak en van betere kwaliteit".' },
    { nr:17, opgave:4, punten:2, type:'open', domein:'Argument',
      vraag:'Noem de twee redenen die de tekst geeft om minder vlees te eten (alinea 2 en 3). Antwoord in het Nederlands.',
      antwoord:'(1) Het milieu (alinea 2): vlees produceren, vooral rundvlees, kost enorm veel water en land en veroorzaakt een groot deel van de broeikasgassen; minder vlees eten verkleint dus je ecologische voetafdruk. (2) De gezondheid (alinea 3): artsen adviseren al lang om meer groenten en granen te eten en wat minder rood vlees, wat goed is voor het hart en de rest van het lichaam.',
      antwoord_rubric:'1 punt: milieu (vlees kost veel water/land, veel broeikasgassen -> kleinere voetafdruk). 1 punt: gezondheid (meer groenten/granen en minder rood vlees, goed voor hart/lichaam).' },
    // ── Texte 5 ───────────────────────────────────────────────────────
    { nr:18, opgave:5, punten:1, type:'mc', domein:'Lacune',
      vraag:'Quelle phrase convient le mieux dans le trou [trou] au début du paragraphe 2?',
      opties:[
        'Sourire ne change absolument rien.',
        'Sourire peut aussi nous rendre plus heureux.',
        'Personne ne sourit jamais.',
        'Le sourire est réservé aux enfants.'],
      correct:1,
      uitleg:'De rest van alinea 2 legt uit dat glimlachen, zelfs zonder reden, je humeur kan verbeteren; de openingszin moet dat aankondigen.' },
    { nr:19, opgave:5, punten:1, type:'mc', domein:'Detail',
      vraag:'Pourquoi le sourire est-il "contagieux" selon le paragraphe 3?',
      opties:[
        'parce qu\'il transmet une maladie',
        'parce qu\'il est très difficile de ne pas rendre un sourire',
        'parce qu\'il fait peur',
        'parce qu\'il coûte cher'],
      correct:1,
      uitleg:'Paragraphe 3: als iemand naar je glimlacht, is het heel moeilijk om níét terug te lachen; zo kan een glimlach de sfeer in een hele ruimte veranderen.' },
    { nr:20, opgave:5, punten:1, type:'mc', domein:'Nuance',
      vraag:'Quelle est la limite du sourire selon le paragraphe 4?',
      opties:[
        'un sourire dure trop longtemps',
        'un sourire forcé et faux produit souvent l\'effet inverse',
        'un sourire est toujours sincère',
        'un sourire abîme les dents'],
      correct:1,
      uitleg:'Paragraphe 4: een geforceerde, valse glimlach werkt vaak averechts; het is de oprechtheid, niet de tanden, die de kracht van een glimlach bepaalt.' },
    { nr:21, opgave:5, punten:2, type:'open', domein:'Idee principale',
      vraag:'Wat is volgens de tekst de kern van waarom een glimlach zo krachtig is? Betrek alinea 2 en 4 in je antwoord (in het Nederlands).',
      antwoord:'Een glimlach is krachtig omdat hij twee kanten op werkt: het lichaam beïnvloedt de geest net zoveel als de geest het lichaam (alinea 2). Alleen al gaan glimlachen, zelfs zonder reden, stuurt een signaal naar de hersenen en kan je humeur echt verbeteren, en een glimlach is bovendien aanstekelijk. Maar er is een voorwaarde (alinea 4): de glimlach moet oprecht zijn. Een gemaakte, valse glimlach werkt juist averechts. Het is dus de oprechtheid die een glimlach zijn kracht geeft.',
      antwoord_rubric:'1 punt: glimlachen werkt (ook) van lichaam op geest en is aanstekelijk / verbetert de stemming (alinea 2). 1 punt: voorwaarde is oprechtheid; een valse/geforceerde glimlach werkt averechts (alinea 4).' },
  ],
};
