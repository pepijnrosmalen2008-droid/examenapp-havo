// VMBO GL/TL - Nederlands. Gouden-stijl contentspec.
const V = (domein, naam, intro, secties, concepten, vragen) => ({ niveau: 'vmbo', vak: 'nl', domein, naam, intro, secties, concepten, vragen });

export default [
  V('A', 'Luister- en kijkvaardigheid',
    `Bij <strong>luisteren en kijken</strong> pak je de <strong>hoofdgedachte</strong> en scheid je <strong>feiten</strong> van <strong>meningen</strong>. Je let ook op het <strong>doel</strong> van de spreker: informeren, overtuigen of amuseren.`,
    [
      { h: '1. Feit en mening', p: [
        `Een <strong>feit</strong> is te controleren en waar voor iedereen ("Amsterdam is de hoofdstad"). Een <strong>mening</strong> is een persoonlijk oordeel ("Dit is de mooiste stad"). Wie wil overtuigen, mengt vaak feiten en meningen; leer ze uit elkaar te halen.`] },
      { h: '2. Hoofdzaken en het doel van de spreker', p: [
        `De <strong>hoofdzaak</strong> is de belangrijkste informatie; een <strong>bijzaak</strong> is een minder belangrijk detail. Let ook op het <strong>spreekdoel</strong>: wil iemand <em>informeren</em> (uitleggen), <em>overtuigen</em> (jouw mening veranderen) of <em>amuseren</em> (vermaken)? Een <strong>argument</strong> is een reden die een mening ondersteunt.`] },
    ],
    [
      { t: 'Feit', d: 'iets wat te controleren en waar is', k: 'controleerbaar en waar', fout: ['Mening'] },
      { t: 'Mening', d: 'een persoonlijk oordeel', k: 'persoonlijk oordeel', fout: ['Feit'] },
      { t: 'Hoofdzaak', d: 'de belangrijkste informatie', k: 'het belangrijkste', fout: ['Bijzaak'] },
      { t: 'Bijzaak', d: 'een minder belangrijk detail', k: 'minder belangrijk detail', fout: ['Hoofdzaak'] },
      { t: 'Argument', d: 'een reden die een mening ondersteunt', k: 'reden voor een mening', fout: ['Feit', 'Standpunt'] },
      { t: 'Standpunt', d: 'de mening die iemand verdedigt', k: 'de verdedigde mening', fout: ['Argument'] },
      { t: 'Spreekdoel', d: 'wat de spreker wil bereiken', k: 'doel van de spreker', fout: ['Standpunt'] },
      { t: 'Informeren', d: 'iets uitleggen of vertellen', k: 'uitleggen', fout: ['Overtuigen', 'Amuseren'] },
      { t: 'Overtuigen', d: 'iemands mening willen veranderen', k: 'mening veranderen', fout: ['Informeren'] },
      { t: 'Amuseren', d: 'het publiek vermaken', k: 'vermaken', fout: ['Informeren'] },
    ],
    [
      { v: 'Wat is een feit?', o: ['iets wat te controleren is', 'iemands persoonlijke oordeel', 'een vraag', 'een grap'], c: 0, d: 1, uo: ['Klopt: een feit is controleerbaar en waar voor iedereen.', 'Dat is juist een mening.', 'Een vraag is geen feit.', 'Een grap is geen feit.'], uh: 'Feit = controleerbaar en waar. Mening = persoonlijk oordeel.' },
      { v: "'Deze film is de beste van het jaar' is een...", o: ['feit', 'mening', 'vraag', 'opsomming'], c: 1, d: 2, uo: ['Een feit is controleerbaar; "de beste" is een oordeel.', 'Klopt: "de beste" is een persoonlijk oordeel, dus een mening.', 'Het is geen vraag.', 'Het is geen opsomming.'] },
      { v: "'Amsterdam is de hoofdstad van Nederland' is een...", o: ['mening', 'feit', 'argument', 'grap'], c: 1, d: 1, uo: ['Het is geen oordeel, dus geen mening.', 'Klopt: dit is te controleren en waar, dus een feit.', 'Een argument onderbouwt een mening; dit doet dat niet.', 'Het is geen grap.'] },
      { v: 'Wat is de hoofdzaak in een verhaal?', o: ['een klein detail', 'de belangrijkste informatie', 'een voorbeeld', 'de titel'], c: 1, d: 2, uo: ['Een klein detail is juist een bijzaak.', 'Klopt: de hoofdzaak is de belangrijkste informatie.', 'Een voorbeeld is meestal een bijzaak.', 'De titel is niet de hoofdzaak van de inhoud.'] },
      { v: 'Waar let je bij luisteren als eerste op?', o: ['elk woord', 'de hoofdgedachte', 'de spelling', 'de opmaak'], c: 1, d: 2, uo: ['Elk woord verstaan hoeft niet.', 'Klopt: pak eerst de hoofdgedachte.', 'Spelling speelt bij luisteren geen rol.', 'Opmaak hoor je niet.'] },
      { v: 'Een spreker wil jouw mening veranderen. Zijn doel is...', o: ['informeren', 'overtuigen', 'amuseren', 'instrueren'], c: 1, d: 2, uo: ['Informeren is alleen uitleggen, niet je mening veranderen.', 'Klopt: je mening willen veranderen is overtuigen.', 'Amuseren is vermaken.', 'Instrueren is stap-voor-stap uitleggen hoe iets moet.'] },
      { v: 'Wat is een argument?', o: ['een reden die een mening ondersteunt', 'een controleerbaar feit', 'een vraag', 'een titel'], c: 0, d: 2, uo: ['Klopt: een argument onderbouwt een mening met een reden.', 'Een feit staat los; een argument steunt een mening.', 'Een vraag onderbouwt niets.', 'Een titel is geen argument.'] },
      { v: 'Wat is een bijzaak?', o: ['de kern', 'een minder belangrijk detail', 'de conclusie', 'het onderwerp'], c: 1, d: 1, uo: ['De kern is juist de hoofdzaak.', 'Klopt: een bijzaak is een minder belangrijk detail.', 'De conclusie is geen bijzaak.', 'Het onderwerp is de kern.'] },
      { v: 'Een cabaretier wil je laten lachen. Zijn doel is...', o: ['informeren', 'overtuigen', 'amuseren', 'instrueren'], c: 2, d: 2, uo: ['Informeren is uitleggen.', 'Overtuigen is je mening veranderen.', 'Klopt: laten lachen is amuseren (vermaken).', 'Instrueren is uitleggen hoe iets moet.'] },
    ]),

  V('B', 'Spreek- en gespreksvaardigheid',
    `In een gesprek kies je het juiste <strong>register</strong>: <strong>formeel</strong> (net, zakelijk) of <strong>informeel</strong> (gewoon, tegen vrienden). Je onderbouwt je <strong>standpunt</strong> met <strong>argumenten</strong> en luistert naar de ander.`,
    [
      { h: '1. Register: formeel of informeel', p: [
        `<strong>Formeel taalgebruik</strong> is net en zakelijk; dat gebruik je in een sollicitatiegesprek of tegen onbekenden ("Zou u mij kunnen helpen?"). <strong>Informeel taalgebruik</strong> is gewoon en losser, tegen vrienden ("Hoi, alles goed?"). Kies je register bij je publiek.`] },
      { h: '2. Argumenteren in een gesprek', p: [
        `Een <strong>standpunt</strong> is de mening die je verdedigt. Je onderbouwt die met <strong>argumenten</strong> (redenen). Een <strong>tegenargument</strong> is een reden tegen een mening. In een goed gesprek laat je de ander uitspreken en luister je actief.`] },
    ],
    [
      { t: 'Formeel', d: 'net, zakelijk taalgebruik voor onbekenden', k: 'net en zakelijk', fout: ['Informeel'] },
      { t: 'Informeel', d: 'gewoon, los taalgebruik tegen vrienden', k: 'los, tegen vrienden', fout: ['Formeel'] },
      { t: 'Register', d: 'de stijl van taal die bij de situatie past', k: 'passende taalstijl', fout: ['Formeel'] },
      { t: 'Standpunt', d: 'de mening die je verdedigt', k: 'verdedigde mening', fout: ['Argument'] },
      { t: 'Argument', d: 'een reden die je standpunt ondersteunt', k: 'reden voor je mening', fout: ['Tegenargument', 'Standpunt'] },
      { t: 'Tegenargument', d: 'een reden tegen een standpunt', k: 'reden tegen', fout: ['Argument'] },
      { t: 'Overtuigen', d: 'de ander van je mening zien te winnen', k: 'de ander winnen', fout: ['Informeren'] },
      { t: 'Actief luisteren', d: 'echt luisteren en op de ander ingaan', k: 'op de ander ingaan', fout: ['Register'] },
    ],
    [
      { v: 'Wat is formeel taalgebruik?', o: ['nette, zakelijke taal', 'straattaal', 'dialect', 'afkortingen'], c: 0, d: 2, uo: ['Klopt: formeel is net en zakelijk.', 'Straattaal is juist informeel.', 'Dialect is geen formeel taalgebruik.', 'Afkortingen horen bij informele taal.'], uh: 'Formeel = net/zakelijk (onbekenden). Informeel = los (vrienden).' },
      { v: 'Hoe spreek je meestal tegen je docent?', o: ['informeel', 'formeel', 'in straattaal', 'met emoji'], c: 1, d: 2, uo: ['Informeel is voor vrienden.', 'Klopt: tegen een docent gebruik je nette, formele taal.', 'Straattaal past niet op school.', 'Emoji horen niet in gesproken taal.'] },
      { v: 'Wat is een standpunt?', o: ['een mening die je verdedigt', 'een controleerbaar feit', 'een vraag', 'een voorbeeld'], c: 0, d: 2, uo: ['Klopt: een standpunt is de mening die je verdedigt.', 'Een feit staat los van een mening.', 'Een vraag is geen standpunt.', 'Een voorbeeld onderbouwt, maar is geen standpunt.'] },
      { v: 'Wat is een tegenargument?', o: ['een reden voor jouw mening', 'een reden tegen een mening', 'een feit', 'een conclusie'], c: 1, d: 2, uo: ['Een reden vóór je mening is juist een gewoon argument.', 'Klopt: een tegenargument is een reden tegen een standpunt.', 'Een feit is geen tegenargument.', 'Een conclusie sluit af, maar is geen tegenargument.'] },
      { v: 'Wat hoort bij een goed gesprek?', o: ['door elkaar praten', 'naar de ander luisteren', 'de ander onderbreken', 'alleen zelf praten'], c: 1, d: 1, uo: ['Door elkaar praten werkt juist niet.', 'Klopt: goed luisteren hoort bij een goed gesprek.', 'Onderbreken stoort het gesprek.', 'Alleen zelf praten is geen gesprek.'] },
      { v: "'Hoi, alles goed?' is...", o: ['formeel', 'informeel', 'een standpunt', 'een feit'], c: 1, d: 1, uo: ['Formeel zou "Goedendag, hoe gaat het met u?" zijn.', 'Klopt: dit is losse, informele taal.', 'Het verdedigt geen mening.', 'Het is geen controleerbaar feit.'] },
      { v: 'Waarmee onderbouw je een mening?', o: ['met argumenten', 'met een grap', 'met stilte', 'met een vraag'], c: 0, d: 2, uo: ['Klopt: met argumenten (redenen) onderbouw je een mening.', 'Een grap onderbouwt niets.', 'Stilte overtuigt niet.', 'Een vraag onderbouwt geen mening.'] },
      { v: 'Welke taal gebruik je in een sollicitatiegesprek?', o: ['straattaal', 'formele taal', 'dialect', 'alleen emoji'], c: 1, d: 2, uo: ['Straattaal is te los voor een sollicitatie.', 'Klopt: je gebruikt nette, formele taal.', 'Dialect past niet in een sollicitatie.', 'Emoji horen niet in gesproken taal.'] },
    ]),

  V('C', 'Leesvaardigheid',
    `Bij <strong>leesvaardigheid</strong> herken je het <strong>tekstdoel</strong> (informeren, overtuigen, instrueren, amuseren) en gebruik je <strong>signaalwoorden</strong> en <strong>verwijswoorden</strong> om de samenhang te snappen.`,
    [
      { h: '1. Tekstdoel en tekstsoort', p: [
        `Elke tekst heeft een <strong>doel</strong>: <em>informeren</em> (uitleggen, met feiten), <em>overtuigen</em> (een betoog), <em>instrueren</em> (uitleggen hoe iets moet) of <em>amuseren</em> (vermaken). Een reclame wil vooral <em>activeren</em>: je iets laten doen of kopen.`] },
      { h: '2. Signaal- en verwijswoorden', p: [
        `<strong>Signaalwoorden</strong> tonen het verband: tegenstelling (<em>maar</em>, <em>toch</em>), reden (<em>omdat</em>), gevolg (<em>daarom</em>, <em>dus</em>), voorbeeld (<em>bijvoorbeeld</em>). <strong>Verwijswoorden</strong> (zoals <em>dit</em>, <em>dat</em>, <em>hij</em>) verwijzen naar iets dat eerder is genoemd. Een <strong>alinea</strong> is een tekststuk met één deelonderwerp; de <strong>kernzin</strong> geeft de hoofdgedachte.`] },
    ],
    [
      { t: 'Tekstdoel', d: 'wat de schrijver met de tekst wil bereiken', k: 'doel van de tekst', fout: ['Tekstsoort'] },
      { t: 'Informerend', d: 'een tekst die uitlegt met feiten', k: 'uitleggen met feiten', fout: ['Overtuigend'] },
      { t: 'Overtuigend', d: 'een tekst die je mening wil veranderen (betoog)', k: 'mening veranderen', fout: ['Informerend'] },
      { t: 'Instruerend', d: 'een tekst die uitlegt hoe iets moet', k: 'stap voor stap', fout: ['Informerend'] },
      { t: 'Activerend', d: 'een tekst die je iets wil laten doen (reclame)', k: 'aanzetten tot doen', fout: ['Overtuigend'] },
      { t: 'Signaalwoord', d: 'een woord dat het verband tussen zinnen toont', k: 'toont het verband', fout: ['Verwijswoord'] },
      { t: 'Verwijswoord', d: 'een woord dat terugwijst naar iets eerder genoemd', k: 'wijst terug', fout: ['Signaalwoord'] },
      { t: 'Alinea', d: 'een tekststuk met één deelonderwerp', k: 'stuk met één onderwerp', fout: ['Kernzin'] },
      { t: 'Kernzin', d: 'de zin met de hoofdgedachte van een alinea', k: 'hoofdgedachte alinea', fout: ['Alinea'] },
      { t: 'Hoofdgedachte', d: 'de belangrijkste boodschap van de tekst', k: 'belangrijkste boodschap', fout: ['Kernzin'] },
    ],
    [
      { v: 'Wat is het doel van een reclametekst?', o: ['informeren', 'aanzetten tot kopen', 'instrueren', 'amuseren'], c: 1, d: 2, uo: ['Reclame geeft geen neutrale informatie.', 'Klopt: reclame wil je activeren, iets laten kopen of doen.', 'Instrueren is uitleggen hoe iets moet.', 'Amuseren (vermaken) is niet het hoofddoel van reclame.'], uh: 'Doelen: informeren, overtuigen, instrueren, amuseren, activeren (reclame).' },
      { v: 'Wat is het doel van een gebruiksaanwijzing?', o: ['overtuigen', 'instrueren', 'amuseren', 'activeren'], c: 1, d: 2, uo: ['Een gebruiksaanwijzing verdedigt geen mening.', 'Klopt: ze legt stap voor stap uit hoe iets moet (instrueren).', 'Ze is niet bedoeld om te vermaken.', 'Ze zet niet aan tot kopen.'] },
      { v: 'Welk signaalwoord geeft een tegenstelling aan?', o: ['omdat', 'maar', 'bovendien', 'dus'], c: 1, d: 2, uo: ['"omdat" geeft een reden.', 'Klopt: "maar" geeft een tegenstelling.', '"bovendien" is een opsomming.', '"dus" geeft een gevolg.'] },
      { v: "Wat geeft het woord 'daarom' aan?", o: ['een reden', 'een gevolg', 'een voorbeeld', 'een tegenstelling'], c: 1, d: 2, uo: ['Een reden is "omdat".', 'Klopt: "daarom" geeft een gevolg aan.', 'Een voorbeeld is "bijvoorbeeld".', 'Een tegenstelling is "maar".'] },
      { v: "Waar verwijst een verwijswoord als 'dat' meestal naar?", o: ['iets wat eerder genoemd is', 'de titel', 'de schrijver', 'de lezer'], c: 0, d: 2, uo: ['Klopt: een verwijswoord wijst terug naar iets eerder genoemd.', 'Het verwijst niet standaard naar de titel.', 'Niet naar de schrijver.', 'Niet naar de lezer.'] },
      { v: 'Wat is de hoofdgedachte van een tekst?', o: ['de belangrijkste boodschap', 'een klein detail', 'altijd de eerste zin', 'een voorbeeld'], c: 0, d: 2, uo: ['Klopt: de hoofdgedachte is de belangrijkste boodschap.', 'Een detail is geen hoofdgedachte.', 'De hoofdgedachte staat niet altijd vooraan.', 'Een voorbeeld is een detail.'] },
      { v: 'Wat is een alinea?', o: ['een tekststuk met één deelonderwerp', 'een losse zin', 'de titel', 'een voetnoot'], c: 0, d: 2, uo: ['Klopt: een alinea behandelt één deelonderwerp.', 'Een alinea is meer dan één losse zin.', 'De titel is geen alinea.', 'Een voetnoot staat los onderaan.'] },
      { v: 'Een betogende tekst wil vooral...', o: ['informeren', 'overtuigen', 'instrueren', 'amuseren'], c: 1, d: 2, uo: ['Informeren geeft alleen feiten.', 'Klopt: een betoog wil je overtuigen van een mening.', 'Instrueren legt uit hoe iets moet.', 'Amuseren is vermaken.'] },
      { v: "Wat leidt het woord 'bijvoorbeeld' in?", o: ['een tegenstelling', 'een voorbeeld', 'een reden', 'een gevolg'], c: 1, d: 1, uo: ['Een tegenstelling is "maar".', 'Klopt: "bijvoorbeeld" leidt een voorbeeld in.', 'Een reden is "omdat".', 'Een gevolg is "dus".'] },
    ]),

  V('D', 'Schrijfvaardigheid en spelling',
    `Bij <strong>schrijven</strong> let je op de <strong>werkwoordspelling</strong> (stam, stam+t, 't kofschip) en op de <strong>opbouw</strong>: inleiding, kern en slot.`,
    [
      { h: '1. Werkwoordspelling', p: [
        `De <strong>stam</strong> is het hele werkwoord min <em>-en</em> (werken → werk). De <strong>ik-vorm</strong> is de kale stam (ik werk). Bij <em>hij/zij/het</em> komt er een <strong>-t</strong> bij (hij werkt). Voor het <strong>voltooid deelwoord</strong> helpt <strong>'t kofschip</strong>: eindigt de stam op een letter uit 't kofschip (t, k, f, s, ch, p), dan schrijf je <em>-t</em> (gewerkt), anders <em>-d</em> (gevoetbald).`] },
      { h: '2. Opbouw van een tekst', p: [
        `Een goede tekst heeft een <strong>inleiding</strong> (je opent en noemt het onderwerp), een <strong>kern</strong> (de uitwerking) en een <strong>slot</strong> (je vat samen en sluit af). Elke <strong>alinea</strong> behandelt één deelonderwerp.`] },
    ],
    [
      { t: 'Stam', d: 'het hele werkwoord min -en (werken → werk)', k: 'werkwoord min -en', fout: ['Persoonsvorm'] },
      { t: 'Ik-vorm', d: 'de kale stam (ik werk)', k: 'kale stam', fout: ['Stam'] },
      { t: 'Stam plus t', d: 'de vorm bij hij/zij/het (hij werkt)', k: 'hij/zij + t', fout: ['Ik-vorm'] },
      { t: "'t Kofschip", d: 'ezelsbruggetje voor -t of -d in het voltooid deelwoord', k: 't of d kiezen', fout: ['Stam'] },
      { t: 'Voltooid deelwoord', d: 'de ge-vorm van het werkwoord (gewerkt, gevoetbald)', k: 'de ge-vorm', fout: ["'t Kofschip"] },
      { t: 'Inleiding', d: 'het begin van een tekst, waar je het onderwerp opent', k: 'het begin', fout: ['Slot'] },
      { t: 'Kern', d: 'het middendeel waarin je het onderwerp uitwerkt', k: 'de uitwerking', fout: ['Inleiding'] },
      { t: 'Slot', d: 'het einde, waarin je samenvat en afsluit', k: 'samenvatten en afsluiten', fout: ['Inleiding'] },
    ],
    [
      { v: "Kies de juiste vorm: 'Hij ___ de bal.' (vangen)", o: ['vangt', 'vangd', 'vang', 'vankt'], c: 0, d: 2, uo: ['Klopt: hij/zij krijgt stam + t: hij vangt.', '"vangd" is fout; bij hij komt -t, niet -d.', '"vang" mist de -t bij hij.', '"vankt" is een verkeerde stam.'], uh: 'Hij/zij/het = stam + t (hij werkt, hij vangt).' },
      { v: "Kies de juiste vorm: 'Ik ___ elke dag.' (werken)", o: ['werkt', 'werk', 'werkd', 'werck'], c: 1, d: 2, uo: ['"werkt" hoort bij hij/zij, niet bij ik.', 'Klopt: de ik-vorm is de kale stam: ik werk.', '"werkd" bestaat niet.', '"werck" is een verkeerde spelling.'], uh: 'Ik-vorm = kale stam, zonder -t of -d.' },
      { v: "Wat is het voltooid deelwoord van 'werken'?", o: ['gewerkt', 'gewerkd', 'gewerk', 'werkt'], c: 0, d: 2, uo: ['Klopt: de stam eindigt op k (\'t kofschip), dus -t: gewerkt.', '"gewerkd" is fout; k vraagt om -t.', '"gewerk" mist de uitgang.', '"werkt" mist het voorvoegsel ge-.'], uh: "'t kofschip (t,k,f,s,ch,p) → -t, anders -d." },
      { v: "Wat is het voltooid deelwoord van 'voetballen'?", o: ['gevoetbalt', 'gevoetbald', 'gevoetbal', 'voetbald'], c: 1, d: 3, uo: ['"gevoetbalt" is fout; l zit niet in \'t kofschip.', 'Klopt: de stam eindigt op l (niet in \'t kofschip), dus -d.', '"gevoetbal" mist de uitgang.', '"voetbald" mist het voorvoegsel ge-.'] },
      { v: "Kies: 'Hij ___ boos.' (worden)", o: ['word', 'wordt', 'wort', 'worden'], c: 1, d: 3, uo: ['"word" is de ik-vorm, niet de hij-vorm.', 'Klopt: bij hij komt stam + t: hij wordt.', '"wort" is een verkeerde spelling.', '"worden" is het hele werkwoord.'], uh: 'ik word, hij wordt (stam word + t).' },
      { v: "Wat is de stam van een werkwoord?", o: ['het hele werkwoord', 'het hele werkwoord min -en', 'de verleden tijd', 'het meervoud'], c: 1, d: 2, uo: ['Het hele werkwoord is de infinitief, niet de stam.', 'Klopt: de stam is het hele werkwoord min -en.', 'De verleden tijd is iets anders.', 'Het meervoud is geen stam.'] },
      { v: 'Waarmee begint een goede tekst?', o: ['de kern', 'de inleiding', 'het slot', 'de conclusie'], c: 1, d: 1, uo: ['De kern komt na de inleiding.', 'Klopt: een tekst opent met de inleiding.', 'Het slot komt aan het eind.', 'De conclusie hoort bij het slot.'] },
      { v: 'In welk deel vat je samen en sluit je af?', o: ['de inleiding', 'de kern', 'het slot', 'de titel'], c: 2, d: 2, uo: ['De inleiding opent juist.', 'In de kern werk je uit, je vat nog niet samen.', 'Klopt: in het slot vat je samen en sluit je af.', 'De titel vat niet samen.'] },
    ]),

  V('E', 'Fictie',
    `Bij <strong>fictie</strong> herken je het <strong>perspectief</strong> (wie vertelt), de <strong>personages</strong>, het <strong>thema</strong> en wat voor <strong>spanning</strong> zorgt.`,
    [
      { h: '1. Vertelperspectief en personages', p: [
        `Bij het <strong>ik-perspectief</strong> vertelt "ik" het verhaal; bij het <strong>hij/zij-perspectief</strong> vertelt een buitenstaander over de personages. Een <strong>personage</strong> is een figuur in het verhaal; de <strong>hoofdpersoon</strong> is de belangrijkste.`] },
      { h: '2. Thema, spanning en genre', p: [
        `Het <strong>thema</strong> is het hoofdonderwerp of de boodschap (bijvoorbeeld vriendschap). <strong>Spanning</strong> ontstaat als je wil weten hoe het afloopt; een <strong>cliffhanger</strong> is een spannend open einde. Het <strong>genre</strong> is de soort verhaal, zoals thriller of sciencefiction. Een <strong>motief</strong> is een terugkerend element of idee.`] },
    ],
    [
      { t: 'Ik-perspectief', d: 'de verteller is "ik", een personage in het verhaal', k: '"ik" vertelt', fout: ['Hij-perspectief'] },
      { t: 'Hij-perspectief', d: 'een buitenstaander vertelt over de personages', k: 'buitenstaander vertelt', fout: ['Ik-perspectief'] },
      { t: 'Personage', d: 'een figuur in het verhaal', k: 'figuur in het verhaal', fout: ['Hoofdpersoon'] },
      { t: 'Hoofdpersoon', d: 'het belangrijkste personage', k: 'belangrijkste figuur', fout: ['Personage'] },
      { t: 'Thema', d: 'het hoofdonderwerp of de boodschap van het verhaal', k: 'hoofdonderwerp/boodschap', fout: ['Motief'] },
      { t: 'Spanning', d: 'de nieuwsgierigheid naar hoe het afloopt', k: 'hoe loopt het af', fout: ['Cliffhanger'] },
      { t: 'Cliffhanger', d: 'een spannend open einde van een hoofdstuk', k: 'spannend open einde', fout: ['Spanning'] },
      { t: 'Genre', d: 'de soort verhaal, zoals thriller of sciencefiction', k: 'soort verhaal', fout: ['Thema'] },
      { t: 'Motief', d: 'een terugkerend element of idee in het verhaal', k: 'terugkerend element', fout: ['Thema'] },
    ],
    [
      { v: 'Wat is het thema van een verhaal?', o: ['de plek waar het speelt', 'het hoofdonderwerp of de boodschap', 'de schrijver', 'de titel'], c: 1, d: 2, uo: ['De plek is het decor, niet het thema.', 'Klopt: het thema is het hoofdonderwerp of de boodschap.', 'De schrijver staat los van het thema.', 'De titel is niet per se het thema.'], uh: 'Thema = het onderwerp/de boodschap. Motief = terugkerend element.' },
      { v: 'Wat geldt bij het ik-perspectief?', o: ['"ik" vertelt het verhaal', 'een buitenstaander vertelt', 'er is geen verteller', 'de lezer vertelt'], c: 0, d: 2, uo: ['Klopt: bij het ik-perspectief vertelt "ik" het verhaal.', 'Dat is juist het hij/zij-perspectief.', 'Er is altijd een verteller.', 'De lezer is geen verteller.'] },
      { v: 'Wie is de hoofdpersoon?', o: ['een bijfiguur', 'het belangrijkste personage', 'de schrijver', 'de lezer'], c: 1, d: 1, uo: ['Een bijfiguur is juist minder belangrijk.', 'Klopt: de hoofdpersoon is het belangrijkste personage.', 'De schrijver staat buiten het verhaal.', 'De lezer is geen personage.'] },
      { v: 'Wat zorgt voor spanning?', o: ['je wilt weten hoe het afloopt', 'saaie beschrijvingen', 'de inhoudsopgave', 'de titel'], c: 0, d: 2, uo: ['Klopt: spanning is de nieuwsgierigheid naar de afloop.', 'Saaie stukken doen spanning juist afnemen.', 'De inhoudsopgave geeft geen spanning.', 'De titel alleen maakt geen spanning.'] },
      { v: 'Wat is een cliffhanger?', o: ['een spannend open einde', 'de samenvatting', 'de inleiding', 'de titel'], c: 0, d: 2, uo: ['Klopt: een cliffhanger is een spannend open einde van een hoofdstuk.', 'Een samenvatting sluit juist netjes af.', 'De inleiding staat aan het begin.', 'De titel is geen cliffhanger.'] },
      { v: 'Wat is een genre?', o: ['een soort verhaal, zoals thriller', 'de schrijver', 'de uitgever', 'het aantal bladzijden'], c: 0, d: 1, uo: ['Klopt: een genre is de soort verhaal (thriller, sciencefiction).', 'De schrijver is geen genre.', 'De uitgever brengt het boek uit, dat is geen genre.', 'Het aantal bladzijden zegt niets over het genre.'] },
      { v: 'Wat geldt bij het hij/zij-perspectief?', o: ['"ik" vertelt', 'een buitenstaander vertelt over de personages', 'er is geen verhaal', 'de lezer bepaalt de afloop'], c: 1, d: 2, uo: ['"ik" hoort bij het ik-perspectief.', 'Klopt: een buitenstaander vertelt over de personages.', 'Er is wel degelijk een verhaal.', 'De lezer bepaalt de afloop niet.'] },
      { v: 'Wat is een motief in een verhaal?', o: ['een terugkerend element of idee', 'de kaft', 'de prijs', 'de bladzijde'], c: 0, d: 3, uo: ['Klopt: een motief is een terugkerend element of idee.', 'De kaft is de buitenkant van het boek.', 'De prijs staat los van het verhaal.', 'Een bladzijde is geen motief.'] },
    ]),
];
