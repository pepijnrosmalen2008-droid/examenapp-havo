// foutenboek-uitleg-havo.js — per-optie-uitleg (schema: {opts:[{w,juist}],verleidelijk,herken}).
// Gegenereerd uit de inline uo/uh op de vragen (bi.M.3). Zie scripts/build-foutenboek-uitleg.js voor LLM-generatie.
var FB_UITLEG = {
 "bi": {
  "M3|Wat is een enzym?": {
   "opts": [
    {
     "w": "Klopt: een enzym is een eiwit dat als biokatalysator reacties versnelt.",
     "juist": true
    },
    {
     "w": "Een hormoon is een signaalstof die een boodschap doorgeeft; een enzym versnelt juist een reactie. Ze worden verward omdat beide 'iets regelen'.",
     "juist": false
    },
    {
     "w": "Een koolhydraat is brandstof; een enzym levert géén energie, het verlaagt alleen de reactiedrempel. Daarom is het juiste antwoord het eiwit dat reacties versnelt.",
     "juist": false
    },
    {
     "w": "Enzymen zijn eiwitten, geen vetten uit het celmembraan. Het juiste antwoord noemt het eiwit dat reacties versnelt.",
     "juist": false
    }
   ],
   "verleidelijk": 1,
   "herken": "Enzym = eiwit dat reacties versnelt. Verwar het niet met een hormoon (signaalstof) of een brandstof."
  },
  "M3|Hoe versnelt een enzym een reactie?": {
   "opts": [
    {
     "w": "Een enzym verandert de celtemperatuur niet; het werkt bij de bestaande temperatuur. De snelheidswinst komt doordat het de activeringsenergie verlaagt.",
     "juist": false
    },
    {
     "w": "Een enzym levert zélf geen energie — de bekende valkuil. Het verlaagt alleen de startdrempel, dát is het juiste antwoord.",
     "juist": false
    },
    {
     "w": "Een enzym maakt geen extra substraat aan om zichzelf te versnellen; het verlaagt de activeringsenergie van de bestaande reactie.",
     "juist": false
    },
    {
     "w": "Klopt: het enzym verlaagt de activeringsenergie (de startdrempel), waardoor de reactie sneller gaat zonder extra energie.",
     "juist": true
    }
   ],
   "verleidelijk": 0,
   "herken": "Een enzym verlaagt de drempel; het levert geen energie."
  },
  "M3|De enzymactiviteit daalt snel boven 40 °C. Wat gebeurt er?": {
   "opts": [
    {
     "w": "Als het substraat op was, zou de daling niet netjes bij de temperatuur horen; de grafiek koppelt de daling aan de warmte, dus het gaat om denaturatie.",
     "juist": false
    },
    {
     "w": "Meer warmte is niet altijd sneller: voorbij het optimum keert het effect om doordat het enzym denatureert.",
     "juist": false
    },
    {
     "w": "Klopt: boven de optimumtemperatuur denatureert het enzym — het actief centrum verliest zijn vorm en de activiteit daalt.",
     "juist": true
    },
    {
     "w": "Een enzym wordt niet verbruikt (het is herbruikbaar); de daling komt door denaturatie, niet door 'opraken'.",
     "juist": false
    }
   ],
   "verleidelijk": 0,
   "herken": "Scherpe daling ná de top in een temperatuurgrafiek = denaturatie, niet 'opraken'."
  },
  "M3|Wat is het verschil tussen optimum en denaturatie?": {
   "opts": [
    {
     "w": "Ze betekenen niet hetzelfde — het zijn juist tegengestelde dingen: goed werken versus kapotgaan.",
     "juist": false
    },
    {
     "w": "Klopt: het optimum is de temperatuur met de beste werking; denaturatie is de onomkeerbare vormverandering waardoor de functie wegvalt.",
     "juist": true
    },
    {
     "w": "Dit wisselt de begrippen om: bij het optimum werkt het enzym het best, erboven denatureert het (niet andersom).",
     "juist": false
    },
    {
     "w": "Denaturatie hoort bij een te hóóg extreem, niet bij te laag; het optimum ligt ertussenin.",
     "juist": false
    }
   ],
   "verleidelijk": 0,
   "herken": "Optimum = beste werking; denaturatie = kapotte vorm. Tegengesteld."
  },
  "M3|Wat gebeurt er met het enzym ná de reactie?": {
   "opts": [
    {
     "w": "De bekende misvatting: een enzym raakt niet op. Het doet mee maar verandert zelf niet, dus het komt onveranderd vrij.",
     "juist": false
    },
    {
     "w": "Het enzym máákt het product, maar wórdt het niet; het komt onveranderd vrij en werkt opnieuw.",
     "juist": false
    },
    {
     "w": "Klopt: het enzym komt onveranderd vrij en werkt opnieuw — daarom kan één molecuul veel reacties versnellen.",
     "juist": true
    },
    {
     "w": "Het enzym valt niet uiteen; het substraat wordt omgezet en het enzym blijft heel en herbruikbaar.",
     "juist": false
    }
   ],
   "verleidelijk": 0,
   "herken": "Een enzym wordt niet verbruikt; het komt onveranderd vrij."
  },
  "M3|Waarom breekt amylase wel zetmeel af, maar geen eiwit?": {
   "opts": [
    {
     "w": "Het gaat niet om grootte maar om vórm: een eiwit past simpelweg niet in het actief centrum van amylase.",
     "juist": false
    },
    {
     "w": "Klopt: de vorm van zetmeel past in het actief centrum van amylase; een eiwit past er niet in (substraatspecificiteit).",
     "juist": true
    },
    {
     "w": "pH speelt wel een rol bij enzymen, maar verklaart niet waarom amylase wél zetmeel en géén eiwit afbreekt — dat is de vorm.",
     "juist": false
    },
    {
     "w": "Amylase raakt niet 'op' bij eiwit; het past er gewoon niet op door de vorm van het actief centrum.",
     "juist": false
    }
   ],
   "verleidelijk": 0,
   "herken": "Substraatspecificiteit gaat over vórm, niet over grootte."
  },
  "M3|Na verhitting tot 60 °C werkt een enzym niet meer, ook niet na afkoelen. Waarom?": {
   "opts": [
    {
     "w": "Het enzym wérkte al goed bij 37 °C, dus het optimum wás bereikt; er is iets blijvends veranderd — denaturatie.",
     "juist": false
    },
    {
     "w": "Een opgeraakt substraat verklaart niet waarom terugkoelen niet helpt; de kern is de onomkeerbare denaturatie van het enzym.",
     "juist": false
    },
    {
     "w": "Denaturatie door hitte is geen tijdelijke rem: de vorm van het actief centrum is kapot en komt niet vanzelf terug.",
     "juist": false
    },
    {
     "w": "Klopt: bij 60 °C is het enzym gedenatureerd; die vormverandering is onomkeerbaar, dus afkoelen herstelt de werking niet.",
     "juist": true
    }
   ],
   "verleidelijk": 0,
   "herken": "Denaturatie door hitte is onomkeerbaar; afkoelen herstelt niet."
  },
  "M3|Pepsine werkt bij pH 2, maar niet bij pH 7. Waarom?": {
   "opts": [
    {
     "w": "Klopt: elk enzym heeft een eigen optimum-pH; pH 7 ligt te ver van het zure optimum van pepsine, dus het werkt daar bijna niet.",
     "juist": true
    },
    {
     "w": "Pepsine raakt niet op bij pH 7 (de verbruikt-misvatting); het wérkt daar alleen niet omdat de pH te ver van het optimum ligt.",
     "juist": false
    },
    {
     "w": "De vraag varieert de pH, niet de temperatuur; de verklaring moet dus over de pH gaan.",
     "juist": false
    },
    {
     "w": "pH heeft juist wél invloed: net als temperatuur heeft elk enzym een optimum-pH waarbuiten de activiteit daalt.",
     "juist": false
    }
   ],
   "verleidelijk": 1,
   "herken": "pH heeft een optimum, net als temperatuur; ver ervan af daalt de activiteit."
  },
  "M3|Wat betekent het dat een enzym een biokatalysator is?": {
   "opts": [
    {
     "w": "Klopt: een biokatalysator versnelt en komt onveranderd vrij.",
     "juist": true
    },
    {
     "w": "Een enzym levert geen energie; het verlaagt de drempel.",
     "juist": false
    },
    {
     "w": "'Bio' betekent van eiwit / in een organisme, niet van metaal.",
     "juist": false
    },
    {
     "w": "Een katalysator versnelt juist; vertragen is het tegenovergestelde.",
     "juist": false
    }
   ],
   "verleidelijk": 1,
   "herken": "Biokatalysator = versnelt een reactie, raakt zelf niet op."
  },
  "M3|Tot welke groep stoffen behoren vrijwel alle enzymen?": {
   "opts": [
    {
     "w": "Enzymen zijn geen vetten (die zitten o.a. in het celmembraan).",
     "juist": false
    },
    {
     "w": "Koolhydraten zijn brandstof/bouwstof, geen enzymen.",
     "juist": false
    },
    {
     "w": "Zouten werken niet als enzym.",
     "juist": false
    },
    {
     "w": "Klopt: enzymen zijn opgebouwd uit aminozuren, dus eiwitten.",
     "juist": true
    }
   ],
   "verleidelijk": 0,
   "herken": "Enzym = eiwit."
  },
  "M3|Hoe heet de plek op het enzym waar het substraat bindt?": {
   "opts": [
    {
     "w": "Het celmembraan is de celgrens, niet de bindplaats op het enzym.",
     "juist": false
    },
    {
     "w": "Een ribosoom maakt eiwitten; niet de bindplaats voor het substraat.",
     "juist": false
    },
    {
     "w": "Klopt: het substraat bindt in het actief centrum.",
     "juist": true
    },
    {
     "w": "De celkern bevat DNA, niet de bindplaats van het enzym.",
     "juist": false
    }
   ],
   "verleidelijk": 0,
   "herken": "Substraat bindt in het actief centrum."
  },
  "M3|Waarom kan een kleine hoeveelheid enzym veel substraat omzetten?": {
   "opts": [
    {
     "w": "Het enzym wordt niet groter; het blijft gelijk.",
     "juist": false
    },
    {
     "w": "Klopt: het enzym komt onveranderd vrij en werkt opnieuw.",
     "juist": true
    },
    {
     "w": "Het enzym maakt het product, maar wordt het niet.",
     "juist": false
    },
    {
     "w": "Een enzym levert geen energie; het is herbruikbaar.",
     "juist": false
    }
   ],
   "verleidelijk": 0,
   "herken": "Enzym is herbruikbaar, raakt niet op."
  },
  "M3|Bij vaste enzymhoeveelheid en steeds meer substraat vlakt de reactiesnelheid af.": {
   "opts": [
    {
     "w": "Klopt: als alle actieve centra bezet zijn, verhoogt meer substraat de snelheid niet.",
     "juist": true
    },
    {
     "w": "Er is juist steeds meer substraat, dat is niet op.",
     "juist": false
    },
    {
     "w": "Temperatuur/pH veranderen niet, dus denaturatie is hier niet de oorzaak.",
     "juist": false
    },
    {
     "w": "De temperatuur speelt hier geen rol.",
     "juist": false
    }
   ],
   "verleidelijk": 1,
   "herken": "Snelheid vlakt af = alle enzymen bezet (verzadiging)."
  },
  "M3|Wat is de activeringsenergie van een reactie?": {
   "opts": [
    {
     "w": "Dat is de uitkomst van de reactie, niet de startdrempel.",
     "juist": false
    },
    {
     "w": "Klopt: de activeringsenergie is de drempel om de reactie te starten.",
     "juist": true
    },
    {
     "w": "De celtemperatuur is niet de activeringsenergie.",
     "juist": false
    },
    {
     "w": "De energie in het product is een uitkomst, geen startdrempel.",
     "juist": false
    }
   ],
   "verleidelijk": 0,
   "herken": "Activeringsenergie = startdrempel van de reactie."
  },
  "M3|In een energiediagram is de 'berg' met enzym lager dan zonder. Wat betekent dat?": {
   "opts": [
    {
     "w": "Klopt: een lagere berg = lagere startdrempel = snellere reactie.",
     "juist": true
    },
    {
     "w": "De berg is de drempel, geen energie die het enzym toevoegt.",
     "juist": false
    },
    {
     "w": "De hoeveelheid product verandert niet door een lagere drempel.",
     "juist": false
    },
    {
     "w": "De berg gaat over energie, niet over temperatuur.",
     "juist": false
    }
   ],
   "verleidelijk": 1,
   "herken": "Lagere berg in een energiediagram = lagere activeringsenergie."
  },
  "M3|Wat gebeurt er met de enzymactiviteit bij de mens als de temperatuur van 20 naar": {
   "opts": [
    {
     "w": "Onder het optimum daalt de activiteit niet; ze stijgt.",
     "juist": false
    },
    {
     "w": "De activiteit is temperatuurafhankelijk en verandert wel.",
     "juist": false
    },
    {
     "w": "Klopt: tot de optimumtemperatuur (~37 °C) neemt de activiteit toe.",
     "juist": true
    },
    {
     "w": "Denaturatie treedt pas boven het optimum op, niet bij 37 °C.",
     "juist": false
    }
   ],
   "verleidelijk": 0,
   "herken": "Tot het optimum: hogere temperatuur = hogere activiteit."
  },
  "M3|Wat betekent 'denatureren' bij een enzym?": {
   "opts": [
    {
     "w": "Denaturatie maakt het enzym niet sneller; het werkt juist niet meer.",
     "juist": false
    },
    {
     "w": "Een gedenatureerd enzym maakt juist geen product meer.",
     "juist": false
    },
    {
     "w": "Bij denaturatie kan het substraat juist niet meer binden.",
     "juist": false
    },
    {
     "w": "Klopt: de ruimtelijke structuur verandert, het actief centrum verliest zijn vorm.",
     "juist": true
    }
   ],
   "verleidelijk": 0,
   "herken": "Denatureren = structuur verandert, functie verdwijnt."
  },
  "M3|Bij hoge koorts (42 °C) werken veel enzymen slechter. Wat is de reden?": {
   "opts": [
    {
     "w": "Klopt: 42 °C ligt boven het optimum, waardoor enzymen denatureren.",
     "juist": true
    },
    {
     "w": "De hoeveelheid substraat verandert niet door koorts.",
     "juist": false
    },
    {
     "w": "Enzymen worden niet opgebruikt; de oorzaak is denaturatie.",
     "juist": false
    },
    {
     "w": "Koorts verandert de temperatuur, niet direct de pH.",
     "juist": false
    }
   ],
   "verleidelijk": 1,
   "herken": "Boven ~37 °C beginnen enzymen te denatureren."
  },
  "M3|Een wasmiddel met enzymen reinigt goed op 40 °C, maar slecht op 90 °C. Hoe komt ": {
   "opts": [
    {
     "w": "Vuil verdwijnt niet vanzelf bij 90 °C.",
     "juist": false
    },
    {
     "w": "Bij 40 °C werken de enzymen juist goed (rond hun optimum).",
     "juist": false
    },
    {
     "w": "Oplossen is niet het punt; ze denatureren door de hitte.",
     "juist": false
    },
    {
     "w": "Klopt: bij 90 °C zijn de enzymen gedenatureerd en reinigen ze niet meer.",
     "juist": true
    }
   ],
   "verleidelijk": 0,
   "herken": "Te heet wassen = was-enzymen denatureren."
  },
  "M3|Wat geldt WEL na denaturatie door hitte, maar NIET bij een tijdelijk te lage tem": {
   "opts": [
    {
     "w": "Na hitte-denaturatie werkt het enzym niet meer, ook niet bij het optimum.",
     "juist": false
    },
    {
     "w": "Het substraat verandert in beide gevallen niet.",
     "juist": false
    },
    {
     "w": "De pH verandert hier niet; het gaat om onomkeerbaarheid.",
     "juist": false
    },
    {
     "w": "Klopt: hitte-denaturatie is onomkeerbaar; te koud remt slechts tijdelijk.",
     "juist": true
    }
   ],
   "verleidelijk": 0,
   "herken": "Hitte-denaturatie is onomkeerbaar; kou remt tijdelijk."
  },
  "M3|Enzym X heeft een optimum-pH van 9. In welk milieu werkt het het best?": {
   "opts": [
    {
     "w": "pH 9 is niet zuur; zuur is onder pH 7.",
     "juist": false
    },
    {
     "w": "pH 9 is niet neutraal; neutraal is pH 7.",
     "juist": false
    },
    {
     "w": "Klopt: pH 9 ligt boven 7, dat is basisch.",
     "juist": true
    },
    {
     "w": "Enzymactiviteit hangt sterk van de pH af; niet overal gelijk.",
     "juist": false
    }
   ],
   "verleidelijk": 0,
   "herken": "pH < 7 zuur, 7 neutraal, > 7 basisch."
  },
  "M3|Leg je leverstukjes in waterstofperoxide, dan borrelt het hevig (enzym katalase)": {
   "opts": [
    {
     "w": "De lever maakt het H2O2 niet aan; het enzym breekt het af.",
     "juist": false
    },
    {
     "w": "Het enzym raakt niet op; het blijft borrelen zolang er substraat is.",
     "juist": false
    },
    {
     "w": "Er ontstaat hooguit wat warmte; het borrelen komt door de versnelde reactie.",
     "juist": false
    },
    {
     "w": "Klopt: het vrijkomende gas (zuurstof) toont dat katalase de afbraak versnelt.",
     "juist": true
    }
   ],
   "verleidelijk": 0,
   "herken": "Borrelen = enzym versnelt de afbraak (zuurstof komt vrij)."
  },
  "M3|Welke uitspraak over enzymen is juist?": {
   "opts": [
    {
     "w": "Een enzym levert geen energie; het verlaagt de drempel.",
     "juist": false
    },
    {
     "w": "Klopt: het enzym verlaagt de activeringsenergie.",
     "juist": true
    },
    {
     "w": "Het verhoogt de drempel niet; het verlaagt hem juist.",
     "juist": false
    },
    {
     "w": "Een enzym versnelt reacties, het stopt ze niet.",
     "juist": false
    }
   ],
   "verleidelijk": 0,
   "herken": "Enzym verlaagt de activeringsenergie."
  },
  "M3|Lactase splitst lactose, maar niet sacharose. Wat is de beste verklaring?": {
   "opts": [
    {
     "w": "Grootte is niet de reden, en 'elk enzym' klopt niet; het gaat om de vorm.",
     "juist": false
    },
    {
     "w": "Klopt: door de vorm van het actief centrum past lactose wel en sacharose niet.",
     "juist": true
    },
    {
     "w": "Temperatuur is niet de reden dat sacharose niet gesplitst wordt.",
     "juist": false
    },
    {
     "w": "Of sacharose energie bevat, verandert niets aan het passen.",
     "juist": false
    }
   ],
   "verleidelijk": 0,
   "herken": "Specificiteit = de vorm van het actief centrum bepaalt het substraat."
  },
  "M3|In een activiteit–temperatuurgrafiek ligt de piek bij 50 °C. Wat is die 50 °C?": {
   "opts": [
    {
     "w": "Denaturatie hoort bij de daling ná de piek, niet bij de piek zelf.",
     "juist": false
    },
    {
     "w": "Bij de piek werkt het enzym juist het best, het stopt daar niet.",
     "juist": false
    },
    {
     "w": "Klopt: de piek is de temperatuur met de hoogste activiteit, de optimumtemperatuur.",
     "juist": true
    },
    {
     "w": "50 °C is een temperatuur, geen pH.",
     "juist": false
    }
   ],
   "verleidelijk": 0,
   "herken": "Piek in een temperatuurgrafiek = optimumtemperatuur."
  }
 }
};
if (typeof module !== "undefined" && module.exports) module.exports = { FB_UITLEG };
