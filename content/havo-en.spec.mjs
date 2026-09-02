// HAVO Engels - gouden-stijl contentspec. Vervangt crude generatorvragen
// door authored inzicht-/grammaticavragen in het Engels met per-optie-uitleg + situaties.
const V = (domein, naam, intro, secties, concepten, vragen) => ({ niveau: 'havo', vak: 'en', domein, naam, intro, secties, concepten, vragen });

export default [
  V('A', 'Woordenschat & grammatica',
    `You build words with <strong>prefixes</strong> and <strong>suffixes</strong>, choose the right <strong>tense</strong> (present perfect, past simple), and use <strong>conditionals</strong>, the <strong>passive voice</strong>, <strong>modal verbs</strong> and the correct <strong>prepositions</strong>.`,
    [
      { h: '1. Word building and tenses', p: [
        `A <strong>prefix</strong> comes before a word and changes its meaning ("un-" = not); a <strong>suffix</strong> comes after. The <strong>present perfect</strong> links past and present ("She has just finished"); the <strong>past simple</strong> describes a finished action. A <strong>conditional</strong> like "If I had money, I would buy…" pairs a past tense with "would".`] },
      { h: '2. Passive, modals and prepositions', p: [
        `The <strong>passive voice</strong> puts the object first: "A new planet was discovered by the scientists." <strong>Modal verbs</strong> add meaning: "should" gives advice, "can" shows ability. Verbs and adjectives often take a fixed <strong>preposition</strong>: "interested in".`] },
    ],
    [
      { t: 'Prefix', d: 'letters added before a word that change its meaning, such as "un-"', k: 'before a word', fout: ['Suffix'] },
      { t: 'Present perfect', d: 'the tense that links a past action to the present, "have/has + past participle"', k: 'links past and present', fout: ['Past simple'] },
      { t: 'Conditional', d: 'an "if"-sentence that pairs a past tense with "would"', k: 'if + past, would', fout: ['Passive voice'] },
      { t: 'Passive voice', d: 'a construction that puts the object first: "was discovered"', k: 'object first', fout: ['Modal verb'] },
      { t: 'Modal verb', d: 'a helping verb like should or can that adds meaning', k: 'should, can', fout: ['Preposition'] },
      { t: 'Preposition', d: 'a linking word like in, on or at that often follows a fixed verb', k: 'in, on, at', fout: ['Modal verb'] },
      { t: 'Suffix', d: 'letters added after a word that change its meaning or word class', k: 'after a word', fout: ['Prefix'] },
      { t: 'Past simple', d: 'the tense for a finished action in the past', k: 'finished past action', fout: ['Present perfect'] },
      { t: 'Comparative', d: 'the form that compares two things, such as "bigger"', k: 'compares two things', fout: ['Article'] },
      { t: 'Article', d: 'a word like a, an or the that comes before a noun', k: 'a, an, the', fout: ['Preposition'] },
    ],
    [
      { v: 'What does the prefix "un-" mean in words like "unhappy" or "unusual"?', o: ['not or the opposite of', 'very much', 'again', 'before'], c: 0, d: 2, uo: ['Correct: "un-" makes a word negative.', 'No, that would be "very".', 'No, that is "re-".', 'No, that is "pre-".'], uh: 'The prefix "un-" means not or the opposite of.' },
      { v: 'Which sentence uses the present perfect correctly?', o: ['She has just finished her homework.', 'She have finish her homework.', 'She just finished her homework yesterday.', 'She is finish her homework.'], c: 0, d: 3, uo: ['Correct: has + past participle.', 'No, "have" is wrong for "she".', 'No, that is past simple with a time marker.', 'No, that is not a correct form.'], uh: 'Present perfect: has/have + past participle.' },
      { v: 'Choose the correct conditional: "If I __ enough money, I __ a new phone."', o: ['had / would buy', 'have / will buy', 'had / will buy', 'have / would buy'], c: 0, d: 3, uo: ['Correct: past tense in the if-clause, "would" in the main clause.', 'No, that mixes the forms.', 'No, "will" does not fit "had".', 'No, "would" does not fit "have".'], uh: 'Conditional: if + past tense, then "would".' },
      { v: 'What is the passive form of "The scientists discovered a new planet"?', o: ['A new planet was discovered by the scientists.', 'A new planet discovered the scientists.', 'The scientists were discovered a new planet.', 'A new planet is discovering by the scientists.'], c: 0, d: 3, uo: ['Correct: the object comes first with "was + past participle".', 'No, that changes the meaning.', 'No, that is not passive.', 'No, that tense is wrong.'], uh: 'Passive: object + was/were + past participle.' },
      { v: 'Which modal verb expresses advice?', o: ['should', 'can', 'must', 'will'], c: 0, d: 2, uo: ['Correct: "should" gives advice.', 'No, "can" shows ability.', 'No, "must" is obligation.', 'No, "will" is future.'], uh: 'Modal "should": advice.' },
      { v: '"She is very interested __ learning English." Which preposition is correct?', o: ['in', 'on', 'at', 'for'], c: 0, d: 2, uo: ['Correct: "interested in" is fixed.', 'No, that does not fit.', 'No, that does not fit.', 'No, that does not fit.'], uh: '"Interested in": fixed preposition.' },
      { v: 'What is a prefix?', o: ['letters added before a word that change its meaning', 'letters added after a word', 'the ending of a sentence', 'a punctuation mark'], c: 0, d: 2, uo: ['Correct: a prefix comes before the word.', 'No, that is a suffix.', 'No, that is not a prefix.', 'No, that is punctuation.'], uh: 'Prefix: added before a word.' },
      { v: 'What is a suffix?', o: ['letters added after a word', 'letters added before a word', 'the first word of a sentence', 'a linking word'], c: 0, d: 2, uo: ['Correct: a suffix comes after the word.', 'No, that is a prefix.', 'No, that is position, not a suffix.', 'No, that is a conjunction.'], uh: 'Suffix: added after a word.' },
      { v: 'When do you use the past simple?', o: ['for a finished action in the past', 'for an action that still continues', 'for the future', 'for advice'], c: 0, d: 2, uo: ['Correct: the past simple describes a completed action.', 'No, that is the present perfect or continuous.', 'No, that uses "will".', 'No, that uses "should".'], uh: 'Past simple: finished action in the past.' },
      { v: 'Which modal verb expresses ability?', o: ['can', 'should', 'must', 'may'], c: 0, d: 2, uo: ['Correct: "can" shows ability.', 'No, "should" is advice.', 'No, "must" is obligation.', 'No, "may" is permission or possibility.'], uh: 'Modal "can": ability.' },
      { v: 'What is the comparative of "big"?', o: ['bigger', 'biggest', 'more big', 'the big'], c: 0, d: 2, uo: ['Correct: short adjectives add "-er".', 'No, that is the superlative.', 'No, short adjectives do not use "more".', 'No, that is not a comparison.'], uh: 'Comparative of short adjectives: add "-er".' },
    ]),

  V('B', 'Leesvaardigheid',
    `Reading strategies help you handle texts: <strong>skimming</strong> for the gist, <strong>scanning</strong> for detail, and using <strong>context clues</strong> for unknown words. You recognise <strong>text structures</strong> (such as problem-solution), the <strong>topic sentence</strong> and the difference between <strong>explicit</strong> and <strong>implicit</strong> information.`,
    [
      { h: '1. Strategies', p: [
        `<strong>Skimming</strong> gives you the general idea, <strong>scanning</strong> finds a specific detail. For an unknown word, use the <strong>context clues</strong>. An <strong>inference</strong> is a conclusion you draw from clues rather than a stated fact.`] },
      { h: '2. Structure and meaning', p: [
        `A <strong>topic sentence</strong> states the main point of a paragraph, usually at the start. A <strong>problem-solution structure</strong> introduces a difficulty and then a resolution. <strong>Explicit</strong> information is clearly stated; <strong>implicit</strong> information is implied and must be inferred. "However" signals a <strong>contrast</strong>.`] },
    ],
    [
      { t: 'Skimming', d: 'reading quickly to get the general idea', k: 'general idea', fout: ['Scanning'] },
      { t: 'Scanning', d: 'reading quickly to find a specific detail', k: 'specific detail', fout: ['Skimming'] },
      { t: 'Topic sentence', d: 'the sentence that states the main point of a paragraph', k: 'main point of a paragraph', fout: ['Context clues'] },
      { t: 'Context clues', d: 'hints in the surrounding text that reveal an unknown word', k: 'hints around a word', fout: ['Topic sentence'] },
      { t: 'Explicit information', d: 'information that is clearly stated in the text', k: 'clearly stated', fout: ['Implicit information'] },
      { t: 'Implicit information', d: 'information that is implied and must be inferred', k: 'implied, inferred', fout: ['Explicit information'] },
      { t: 'Problem-solution structure', d: 'a structure that introduces a difficulty and then a resolution', k: 'difficulty then resolution', fout: ['Contrast signal'] },
      { t: 'Contrast signal', d: 'a word like "however" that marks a contrast', k: 'marks a contrast', fout: ['Problem-solution structure'] },
      { t: 'Inference', d: 'a conclusion drawn from clues rather than a stated fact', k: 'conclusion from clues', fout: ['Main idea'] },
      { t: 'Main idea', d: 'the central message of a text', k: 'central message', fout: ['Inference'] },
    ],
    [
      { v: 'Which word signals a contrast in English?', o: ['however', 'therefore', 'moreover', 'for example'], c: 0, d: 2, uo: ['Correct: "however" marks a contrast.', 'No, that signals a consequence.', 'No, that adds a point.', 'No, that introduces an example.'], uh: '"However": contrast.' },
      { v: 'What should you do when you encounter an unknown word?', o: ['use the surrounding context to determine its meaning', 'skip the whole text', 'stop reading', 'translate every letter'], c: 0, d: 2, uo: ['Correct: context clues reveal the meaning.', 'No, that loses the message.', 'No, one word is rarely decisive.', 'No, that does not help.'], uh: 'Unknown word: use context clues.' },
      { v: 'Which text structure introduces a difficulty and then proposes a resolution?', o: ['problem-solution structure', 'chronological structure', 'compare-contrast structure', 'cause-effect structure'], c: 0, d: 3, uo: ['Correct: a problem followed by a solution.', 'No, that follows time order.', 'No, that weighs similarities and differences.', 'No, that links causes to effects.'], uh: 'Problem-solution: difficulty then resolution.' },
      { v: 'What is the function of a topic sentence in a paragraph?', o: ['it states the main point, usually at the beginning', 'it gives the final example', 'it lists the sources', 'it repeats the title'], c: 0, d: 2, uo: ['Correct: the topic sentence carries the main point.', 'No, that is a supporting detail.', 'No, that is a reference.', 'No, that is the heading.'], uh: 'Topic sentence: main point of a paragraph.' },
      { v: 'What is the difference between explicit and implicit information?', o: ['explicit is clearly stated, implicit is implied and must be inferred', 'they are the same', 'explicit is implied', 'implicit is clearly stated'], c: 0, d: 3, uo: ['Correct: stated versus implied.', 'No, they differ.', 'No, that is reversed.', 'No, that is reversed.'], uh: 'Explicit: stated; implicit: implied.' },
      { v: 'What does "however" at the beginning of a sentence indicate?', o: ['a contrast or limitation to what was just said', 'an added example', 'a conclusion', 'a cause'], c: 0, d: 2, uo: ['Correct: it limits or contrasts the previous idea.', 'No, that is "for example".', 'No, that is "in conclusion".', 'No, that is "because".'], uh: '"However": contrast or limitation.' },
      { v: 'What is the purpose of skimming?', o: ['to get the general idea quickly', 'to find one specific fact', 'to memorise the text', 'to check the spelling'], c: 0, d: 2, uo: ['Correct: skimming gives you the gist.', 'No, that is scanning.', 'No, skimming is not close reading.', 'No, that is proofreading.'], uh: 'Skimming: quick general idea.' },
      { v: 'What is the purpose of scanning?', o: ['to find a specific detail quickly', 'to get the general idea', 'to enjoy the story', 'to learn every word'], c: 0, d: 2, uo: ['Correct: scanning finds a detail fast.', 'No, that is skimming.', 'No, that is reading for pleasure.', 'No, scanning skips most of the text.'], uh: 'Scanning: quickly find a detail.' },
      { v: 'What is an inference?', o: ['a conclusion drawn from clues, not stated directly', 'a word\'s dictionary meaning', 'the title of a text', 'a spelling rule'], c: 0, d: 3, uo: ['Correct: you infer what the text implies.', 'No, that is a definition.', 'No, that is the heading.', 'No, that is grammar.'], uh: 'Inference: reading between the lines.' },
      { v: 'What is the main idea of a text?', o: ['the central message', 'the first word', 'a small detail', 'the page number'], c: 0, d: 1, uo: ['Correct: the main idea sums up the core.', 'No, that says little.', 'No, a detail is minor.', 'No, that is layout.'], uh: 'Main idea: the central message.' },
    ]),

  V('C', 'Kijk- en luistervaardigheid',
    `When listening, the <strong>first listening</strong> is for the general topic and main point, later ones for detail. You recognise <strong>signposting</strong> phrases, the speaker's <strong>tone</strong> (including <strong>sarcasm</strong>) and <strong>uncertainty markers</strong> like "may". You tell a <strong>documentary</strong> from a <strong>news report</strong>.`,
    [
      { h: '1. Listening strategy', p: [
        `During the <strong>first listening</strong>, focus on the general topic, structure and the speaker's main point. <strong>Signposting</strong> phrases guide you: "To sum up / In conclusion…" signals a summary. You can <strong>predict</strong> content from the title and images.`] },
      { h: '2. Tone and text type', p: [
        `The <strong>tone</strong> is the speaker's attitude; <strong>sarcasm</strong> says the opposite of what is meant for effect ("just brilliant – if you enjoy waiting five years"). <strong>Uncertainty markers</strong> like "may" show something is not certain. A <strong>documentary</strong> explores a topic in depth; a <strong>news report</strong> summarises recent events concisely.`] },
    ],
    [
      { t: 'Gist', d: 'the overall topic and main point of what is said', k: 'overall topic', fout: ['Detail'] },
      { t: 'Detail', d: 'a specific piece of information in a fragment', k: 'specific information', fout: ['Gist'] },
      { t: 'Tone', d: 'the attitude of the speaker towards the subject', k: 'speaker\'s attitude', fout: ['Sarcasm'] },
      { t: 'Sarcasm', d: 'saying the opposite of what is meant, for critical effect', k: 'opposite for effect', fout: ['Tone'] },
      { t: 'Signposting', d: 'phrases that guide the listener through the structure', k: 'guides the listener', fout: ['Uncertainty markers'] },
      { t: 'Uncertainty markers', d: 'words like "may" or "might" that show something is not certain', k: 'may, might', fout: ['Signposting'] },
      { t: 'Documentary', d: 'a spoken text that explores a topic in depth', k: 'in-depth topic', fout: ['News report'] },
      { t: 'News report', d: 'a spoken text that summarises recent events concisely', k: 'recent events, concise', fout: ['Documentary'] },
      { t: 'Listening for gist', d: 'listening to grasp the overall topic', k: 'grasp the main idea', fout: ['Detail'] },
      { t: 'Prediction', d: 'guessing the content beforehand from title and images', k: 'guessing beforehand', fout: ['Signposting'] },
    ],
    [
      { v: 'What should you focus on during the FIRST listening of a spoken text?', o: ['the general topic, structure and speaker\'s main point', 'every exact number', 'the spelling of names', 'the background music'], c: 0, d: 2, uo: ['Correct: first the big picture.', 'No, details come later.', 'No, that is not the goal.', 'No, that is not language.'], uh: 'First listening: general topic and main point.' },
      { v: 'Which phrase signals that a speaker is about to summarise?', o: ['To sum up / In conclusion…', 'For example…', 'On the contrary…', 'Once upon a time…'], c: 0, d: 2, uo: ['Correct: these phrases introduce a summary.', 'No, that introduces an example.', 'No, that signals a contrast.', 'No, that opens a story.'], uh: '"To sum up / In conclusion": a summary.' },
      { v: '"The government\'s plan is just brilliant – if you enjoy waiting five years." What is the tone?', o: ['sarcastic and critical', 'genuinely positive', 'neutral and factual', 'confused'], c: 0, d: 3, uo: ['Correct: the speaker means the opposite, which is sarcasm.', 'No, it only seems positive.', 'No, it carries an opinion.', 'No, the meaning is clear.'], uh: 'Saying the opposite for effect: sarcasm.' },
      { v: 'What type of spoken text presents two sides of an issue and tries to persuade?', o: ['a debate or opinion speech', 'a weather forecast', 'a recipe', 'a train announcement'], c: 0, d: 2, uo: ['Correct: it argues a case.', 'No, that just gives information.', 'No, that gives instructions.', 'No, that is a notice.'], uh: 'Debate or opinion speech: two sides, persuade.' },
      { v: '"Studies suggest that screen time may affect sleep quality." Which word shows uncertainty?', o: ['may', 'studies', 'affect', 'quality'], c: 0, d: 3, uo: ['Correct: "may" shows it is not certain.', 'No, that is a noun.', 'No, that is the verb.', 'No, that is a noun.'], uh: '"May": an uncertainty marker.' },
      { v: 'What is a key difference between a documentary and a news report?', o: ['a documentary explores a topic in depth, a news report is concise about recent events', 'they are the same', 'a documentary is always live', 'a news report is fictional'], c: 0, d: 3, uo: ['Correct: depth versus concise recent events.', 'No, they differ.', 'No, documentaries are usually recorded.', 'No, news is factual.'], uh: 'Documentary: in depth; news report: concise.' },
      { v: 'What does listening for gist mean?', o: ['listening to grasp the overall topic', 'catching every exact number', 'copying every word', 'checking pronunciation'], c: 0, d: 2, uo: ['Correct: gist is the general meaning.', 'No, that is listening for detail.', 'No, that is impossible in real time.', 'No, that is a speaking focus.'], uh: 'Listening for gist: the general meaning.' },
      { v: 'What is the tone of a spoken text?', o: ['the attitude of the speaker towards the subject', 'the number of words', 'the volume only', 'the length of the text'], c: 0, d: 2, uo: ['Correct: tone reflects the speaker\'s attitude.', 'No, that is length.', 'No, volume is separate.', 'No, that is duration.'], uh: 'Tone: the speaker\'s attitude.' },
      { v: 'What do signposting phrases do?', o: ['they guide the listener through the structure of the talk', 'they translate the text', 'they add background music', 'they correct grammar'], c: 0, d: 3, uo: ['Correct: they mark the parts of the talk.', 'No, they do not translate.', 'No, that is unrelated.', 'No, that is not their function.'], uh: 'Signposting: guides the listener through the structure.' },
      { v: 'What helps you predict content before listening?', o: ['the title and images', 'the last word only', 'the file size', 'the speaker\'s name'], c: 0, d: 2, uo: ['Correct: title and images set expectations.', 'No, you have not heard it yet.', 'No, that is irrelevant.', 'No, a name reveals little.'], uh: 'Predict from title and images.' },
    ]),

  V('D', 'Gespreksvaardigheid',
    `A good spoken presentation has a clear <strong>structure</strong> (introduction, main points, conclusion) and a <strong>formal opening</strong>. You use <strong>contrast phrases</strong>, <strong>persuasive techniques</strong> and <strong>counter-arguments</strong>, and you invite others to speak (<strong>turn-taking</strong>).`,
    [
      { h: '1. Presenting', p: [
        `Structure a talk as introduction → 2–3 main points with examples → conclusion. A <strong>formal opening</strong> is polite: "Good morning. Today I would like to present…". A <strong>persuasive technique</strong> such as a <strong>rhetorical question</strong>, a statistic or a personal anecdote grabs attention.`] },
      { h: '2. Interacting', p: [
        `Use a <strong>contrast phrase</strong> ("However, / On the other hand,") to introduce another view, and a <strong>counter-argument</strong> opener ("While I understand your point, I would argue that…"). Invite others with <strong>turn-taking</strong> phrases ("What do you think?"). Match your <strong>register</strong> to the situation.`] },
    ],
    [
      { t: 'Presentation structure', d: 'introduction, 2-3 main points with examples, and a conclusion', k: 'intro, points, conclusion', fout: ['Formal opening'] },
      { t: 'Formal opening', d: 'a polite opening such as "Good morning. Today I would like to present…"', k: 'polite opening', fout: ['Presentation structure'] },
      { t: 'Contrast phrase', d: 'a phrase like "However / On the other hand" that introduces another view', k: 'introduces another view', fout: ['Counter-argument'] },
      { t: 'Persuasive technique', d: 'a rhetorical question, statistic or anecdote that grabs attention', k: 'grabs attention', fout: ['Rhetorical question'] },
      { t: 'Turn-taking', d: 'inviting others to speak, for example "What do you think?"', k: 'inviting others to speak', fout: ['Clarification'] },
      { t: 'Counter-argument', d: 'a response that opposes a point, "While I understand your point, I would argue…"', k: 'opposes a point', fout: ['Contrast phrase'] },
      { t: 'Rhetorical question', d: 'a question asked for effect, not for a real answer', k: 'asked for effect', fout: ['Persuasive technique'] },
      { t: 'Register', d: 'the level of formality of your speech', k: 'level of formality', fout: ['Fluency'] },
      { t: 'Fluency', d: 'the smoothness and ease with which you speak', k: 'smooth speaking', fout: ['Register'] },
      { t: 'Clarification', d: 'asking someone to explain what they mean', k: 'ask to explain', fout: ['Turn-taking'] },
    ],
    [
      { v: 'How should you structure a short English presentation?', o: ['introduction → 2-3 main points with examples → conclusion', 'conclusion → introduction → questions', 'just one long paragraph', 'random points in any order'], c: 0, d: 2, uo: ['Correct: a clear beginning, middle and end.', 'No, that is out of order.', 'No, a talk needs structure.', 'No, order matters.'], uh: 'Presentation: intro, main points, conclusion.' },
      { v: 'In a formal presentation, which opening is most appropriate?', o: ['"Good morning. Today I would like to present my findings on climate change."', '"Hey guys, so like, climate stuff."', '"I dunno where to start."', '"Boring topic, sorry."'], c: 0, d: 2, uo: ['Correct: polite and clear.', 'No, that is too informal.', 'No, that is unprepared.', 'No, that undermines your talk.'], uh: 'Formal opening: polite and clear.' },
      { v: 'Which phrase correctly introduces a contrast or counter-argument in spoken English?', o: ['"However, / On the other hand,"', '"For example,"', '"To sum up,"', '"First of all,"'], c: 0, d: 2, uo: ['Correct: these signal a contrast.', 'No, that introduces an example.', 'No, that signals a summary.', 'No, that opens a list.'], uh: 'Contrast: "However / On the other hand".' },
      { v: 'Which technique makes a presentation more persuasive and engaging?', o: ['open with a rhetorical question, statistic or personal anecdote', 'read the slides word for word', 'speak in a monotone', 'avoid eye contact'], c: 0, d: 3, uo: ['Correct: a strong hook draws the audience in.', 'No, that is dull.', 'No, monotone loses listeners.', 'No, eye contact helps.'], uh: 'Persuasive opening: question, statistic or anecdote.' },
      { v: 'Which phrase is best to give another person the chance to speak?', o: ['"What do you think about that?"', '"Let me continue for an hour."', '"That is not important."', 'saying nothing'], c: 0, d: 2, uo: ['Correct: this invites the other to respond.', 'No, that blocks turn-taking.', 'No, that is dismissive.', 'No, silence does not invite anyone.'], uh: 'Invite others: "What do you think?"' },
      { v: 'What is the correct way to begin a counter-argument in English?', o: ['"While I understand your point, I would argue that…"', '"You are completely stupid."', '"Whatever."', 'by interrupting loudly'], c: 0, d: 3, uo: ['Correct: acknowledge, then differ politely.', 'No, that is an insult.', 'No, that is dismissive.', 'No, interrupting is rude.'], uh: 'Counter-argument: acknowledge, then differ.' },
      { v: 'What is a rhetorical question?', o: ['a question asked for effect, not for a real answer', 'a question the audience must answer', 'a request for the time', 'a spelling question'], c: 0, d: 2, uo: ['Correct: it engages without needing an answer.', 'No, no real answer is expected.', 'No, that is a genuine question.', 'No, that is unrelated.'], uh: 'Rhetorical question: asked for effect.' },
      { v: 'What does a formal register involve?', o: ['polite language with full sentences and no contractions', 'slang and abbreviations', 'text-message style', 'shouting'], c: 0, d: 2, uo: ['Correct: formal is polite and full-form.', 'No, that is informal.', 'No, that is very informal.', 'No, volume is not register.'], uh: 'Formal register: polite, full sentences.' },
      { v: 'What is fluency?', o: ['the smoothness and ease with which you speak', 'the number of words you know', 'your accent', 'your reading speed'], c: 0, d: 2, uo: ['Correct: fluency is smooth, easy speaking.', 'No, that is vocabulary.', 'No, that is pronunciation-related.', 'No, that is reading.'], uh: 'Fluency: smooth, easy speaking.' },
      { v: 'How do you ask for clarification?', o: ['"Could you explain what you mean?"', '"I already know that."', '"Let\'s move on."', 'by saying nothing'], c: 0, d: 2, uo: ['Correct: this asks the speaker to explain.', 'No, that closes the topic.', 'No, that skips it.', 'No, silence does not clarify.'], uh: 'Clarification: "Could you explain what you mean?"' },
    ]),

  V('E', 'Schrijfvaardigheid',
    `Good writing uses <strong>linking words</strong> for contrast, addition and consequence, a clear <strong>topic sentence</strong> and a <strong>PIE paragraph</strong> (Point, Illustration, Explanation). You choose the right <strong>salutation</strong> and <strong>closing</strong> for a formal letter and keep the text <strong>cohesive</strong>.`,
    [
      { h: '1. Paragraphs and linking words', p: [
        `A <strong>topic sentence</strong> introduces the main idea of a paragraph. A <strong>PIE paragraph</strong> follows Point, Illustration, Explanation. <strong>Linking words</strong> mark relations: "however" (contrast), "moreover" (addition), "therefore" (consequence). <strong>Cohesion</strong> is the linguistic links that hold sentences together.`] },
      { h: '2. Formal letters', p: [
        `In a formal letter you open with <strong>"Dear Sir/Madam,"</strong> if you do not know the name and <strong>"Dear Mr/Ms …,"</strong> if you do. You close with <strong>"Yours faithfully,"</strong> (unknown name) or <strong>"Yours sincerely,"</strong> (known name). Constructions like "Although the weather was bad, we still went outside" join a concession to a main clause.`] },
    ],
    [
      { t: 'Salutation', d: 'the opening greeting of a letter, such as "Dear Sir/Madam,"', k: 'letter greeting', fout: ['Closing phrase'] },
      { t: 'Linking word', d: 'a word that connects ideas and shows their relation', k: 'connects ideas', fout: ['Topic sentence'] },
      { t: 'Topic sentence', d: 'the sentence that introduces the main idea of a paragraph', k: 'main idea of a paragraph', fout: ['Paragraph'] },
      { t: 'PIE paragraph', d: 'a paragraph built as Point, Illustration, Explanation', k: 'Point, Illustration, Explanation', fout: ['Topic sentence'] },
      { t: 'Formal register', d: 'polite language without contractions or slang', k: 'polite, no contractions', fout: ['Cohesion'] },
      { t: 'Cohesion', d: 'the linguistic links that hold sentences together', k: 'linguistic links', fout: ['Coherence'] },
      { t: 'Coherence', d: 'the logical flow of ideas in a text', k: 'logical flow', fout: ['Cohesion'] },
      { t: 'Closing phrase', d: 'the sign-off of a letter, such as "Yours sincerely,"', k: 'letter sign-off', fout: ['Salutation'] },
      { t: 'Paragraph', d: 'a block of text about one idea', k: 'one idea', fout: ['Topic sentence'] },
      { t: 'Contrast', d: 'a relation signalled by words like "however" or "although"', k: 'however, although', fout: ['Linking word'] },
    ],
    [
      { v: 'Which salutation is used in a formal letter when you do NOT know the recipient\'s name?', o: ['Dear Sir/Madam,', 'Hi there,', 'Dear John,', 'Hey!'], c: 0, d: 3, uo: ['Correct: an unknown name gets "Dear Sir/Madam,".', 'No, that is informal.', 'No, that uses a name you do not have.', 'No, far too informal.'], uh: 'Unknown name: "Dear Sir/Madam,".' },
      { v: 'Which linking word introduces a CONTRAST?', o: ['however', 'moreover', 'therefore', 'for example'], c: 0, d: 2, uo: ['Correct: "however" signals a contrast.', 'No, that adds a point.', 'No, that signals a consequence.', 'No, that introduces an example.'], uh: '"However": contrast.' },
      { v: 'What is the function of a topic sentence?', o: ['to introduce the main idea of a paragraph', 'to give the last example', 'to list the sources', 'to close the letter'], c: 0, d: 2, uo: ['Correct: it carries the paragraph\'s main idea.', 'No, that is a detail.', 'No, that is a reference.', 'No, that is a closing.'], uh: 'Topic sentence: main idea of a paragraph.' },
      { v: 'What is a PIE paragraph?', o: ['Point, Illustration, Explanation', 'Problem, Idea, Ending', 'Present, Inform, Explain', 'Plan, Improve, Edit'], c: 0, d: 3, uo: ['Correct: PIE stands for Point, Illustration, Explanation.', 'No, that is not PIE.', 'No, that is not the model.', 'No, that is a writing process.'], uh: 'PIE: Point, Illustration, Explanation.' },
      { v: 'Which sentence uses a correct "although" construction?', o: ['Although the weather was bad, we still went outside.', 'Although the weather was bad, but we went outside.', 'The weather was bad, although we went outside so.', 'Although, the weather bad was.'], c: 0, d: 3, uo: ['Correct: "although" + clause, then a main clause.', 'No, you cannot use "although" and "but" together.', 'No, that word order is wrong.', 'No, that is ungrammatical.'], uh: '"Although" + clause, then a main clause (no "but").' },
      { v: 'Which closing is correct for a formal letter where you know the name?', o: ['Yours sincerely, [name]', 'Yours faithfully, [name]', 'Cheers,', 'Bye!'], c: 0, d: 3, uo: ['Correct: a known name goes with "Yours sincerely,".', 'No, that is for an unknown name.', 'No, too informal.', 'No, too informal.'], uh: 'Known name: "Yours sincerely,".' },
      { v: 'Which closing is correct for a formal letter where you do NOT know the name?', o: ['Yours faithfully,', 'Yours sincerely,', 'Love,', 'See you,'], c: 0, d: 3, uo: ['Correct: an unknown name goes with "Yours faithfully,".', 'No, that is for a known name.', 'No, too informal.', 'No, too informal.'], uh: 'Unknown name: "Yours faithfully,".' },
      { v: 'Which linking word signals ADDITION?', o: ['moreover / furthermore', 'however', 'therefore', 'in conclusion'], c: 0, d: 2, uo: ['Correct: these add to a point.', 'No, that is a contrast.', 'No, that is a consequence.', 'No, that is a summary.'], uh: '"Moreover/furthermore": addition.' },
      { v: 'What is cohesion in writing?', o: ['the linguistic links that hold sentences together', 'the logical flow of ideas', 'the number of paragraphs', 'the length of the text'], c: 0, d: 3, uo: ['Correct: cohesion is the connecting devices.', 'No, that is coherence.', 'No, that is structure.', 'No, that is length.'], uh: 'Cohesion: the linguistic links between sentences.' },
      { v: 'What is a paragraph?', o: ['a block of text about one idea', 'a single sentence', 'the title', 'a list of words'], c: 0, d: 1, uo: ['Correct: a paragraph covers one idea.', 'No, a paragraph has several sentences.', 'No, that is the heading.', 'No, that is a list.'], uh: 'Paragraph: a block of text about one idea.' },
    ]),

  V('F', 'Literatuur',
    `Literary analysis uses terms for character and structure: a <strong>dynamic character</strong> changes, a <strong>static</strong> one does not. You recognise devices such as <strong>foreshadowing</strong>, the <strong>metaphor</strong> and the <strong>simile</strong>, and structural concepts like the <strong>climax</strong> and the <strong>theme</strong>.`,
    [
      { h: '1. Character and structure', p: [
        `The <strong>theme</strong> is the central idea a work explores; the <strong>plot</strong> is the sequence of events. A <strong>dynamic character</strong> changes significantly during the story; a <strong>static character</strong> stays the same. <strong>Foreshadowing</strong> gives hints about what will happen; the <strong>climax</strong> is the turning point of highest tension.`] },
      { h: '2. Style', p: [
        `A <strong>metaphor</strong> states that one thing is another ("The classroom was a zoo"); a <strong>simile</strong> compares with "like" or "as". <strong>Symbolism</strong> uses an object to represent an idea. The <strong>narrator</strong> is the voice telling the story. To find the theme, ask: "What central idea about human life does this work explore?".`] },
    ],
    [
      { t: 'Theme', d: 'the central idea or message explored in a work', k: 'central idea', fout: ['Plot'] },
      { t: 'Dynamic character', d: 'a character who changes significantly during the story', k: 'changes during the story', fout: ['Static character'] },
      { t: 'Static character', d: 'a character who stays the same throughout the story', k: 'stays the same', fout: ['Dynamic character'] },
      { t: 'Foreshadowing', d: 'hints or clues about what will happen later in the story', k: 'hints about what comes', fout: ['Metaphor'] },
      { t: 'Metaphor', d: 'a device that states one thing is another, without "like" or "as"', k: 'one thing is another', fout: ['Simile'] },
      { t: 'Simile', d: 'a comparison using "like" or "as"', k: 'with "like" or "as"', fout: ['Metaphor'] },
      { t: 'Climax', d: 'the turning point of highest tension in a story', k: 'turning point, highest tension', fout: ['Plot'] },
      { t: 'Plot', d: 'the sequence of events in a story', k: 'sequence of events', fout: ['Theme'] },
      { t: 'Narrator', d: 'the voice that tells the story', k: 'the storytelling voice', fout: ['Theme'] },
      { t: 'Symbolism', d: 'using an object to represent a larger idea', k: 'object stands for an idea', fout: ['Metaphor'] },
    ],
    [
      { v: 'What is the "theme" of a literary work?', o: ['the central idea or message explored in the work', 'the main character', 'the final chapter', 'the rhyme scheme'], c: 0, d: 2, uo: ['Correct: the theme is the underlying idea.', 'No, that is a character.', 'No, that is structure.', 'No, that is form.'], uh: 'Theme: the central idea of a work.' },
      { v: 'A character who changes significantly during the story is called:', o: ['a dynamic character', 'a static character', 'a narrator', 'an author'], c: 0, d: 3, uo: ['Correct: a dynamic character develops.', 'No, that one stays the same.', 'No, that is the storytelling voice.', 'No, that is the writer.'], uh: 'Dynamic character: changes during the story.' },
      { v: 'In literature, what is "foreshadowing"?', o: ['hints or clues about what will happen later', 'a flashback to the past', 'the main idea', 'a rhyme'], c: 0, d: 2, uo: ['Correct: foreshadowing hints at future events.', 'No, that is a flashback.', 'No, that is the theme.', 'No, that is form.'], uh: 'Foreshadowing: hints about what will happen.' },
      { v: 'Which literary device is used in "The classroom was a zoo"?', o: ['a metaphor', 'a simile', 'foreshadowing', 'a flashback'], c: 0, d: 2, uo: ['Correct: it states one thing is another, without "like".', 'No, a simile would use "like" or "as".', 'No, that hints at the future.', 'No, that is a look back.'], uh: 'Metaphor: one thing stated as another.' },
      { v: 'In a story, what is the "climax"?', o: ['the turning point of highest tension', 'the opening scene', 'a recurring symbol', 'the list of characters'], c: 0, d: 2, uo: ['Correct: the climax is the decisive high-tension moment.', 'No, that is the exposition.', 'No, that is a motif.', 'No, that is a cast list.'], uh: 'Climax: the turning point of highest tension.' },
      { v: 'What question helps you identify the THEME of a literary work?', o: ['"What central idea about human life does this work explore?"', '"How many pages does it have?"', '"When was it published?"', '"Who is the narrator?"'], c: 0, d: 3, uo: ['Correct: the theme is the central idea about life.', 'No, that is about length.', 'No, that is about date.', 'No, that is about the voice.'], uh: 'Theme question: which central idea about life?' },
      { v: 'What is a static character?', o: ['a character who stays the same throughout the story', 'a character who changes a lot', 'the narrator', 'the author'], c: 0, d: 3, uo: ['Correct: a static character does not develop.', 'No, that is a dynamic character.', 'No, that is the storytelling voice.', 'No, that is the writer.'], uh: 'Static character: stays the same.' },
      { v: 'What is a simile?', o: ['a comparison using "like" or "as"', 'a comparison stating one thing is another', 'a recurring symbol', 'a turning point'], c: 0, d: 2, uo: ['Correct: a simile uses "like" or "as".', 'No, that is a metaphor.', 'No, that is a motif.', 'No, that is the climax.'], uh: 'Simile: comparison with "like" or "as".' },
      { v: 'What is the narrator of a story?', o: ['the voice that tells the story', 'the author\'s real name', 'the main conflict', 'the setting'], c: 0, d: 2, uo: ['Correct: the narrator is the storytelling voice.', 'No, the narrator can differ from the author.', 'No, that is the conflict.', 'No, that is place and time.'], uh: 'Narrator: the voice telling the story.' },
      { v: 'What is symbolism?', o: ['using an object to represent a larger idea', 'the sequence of events', 'the rhyme of a poem', 'the main character'], c: 0, d: 2, uo: ['Correct: a symbol stands for an idea.', 'No, that is plot.', 'No, that is form.', 'No, that is the protagonist.'], uh: 'Symbolism: an object represents an idea.' },
    ]),
];
