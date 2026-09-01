// VWO Engels - gouden-stijl contentspec. Vervangt crude generatorvragen
// door authored strategie-/inzichtvragen met per-optie-uitleg + situaties.
const V = (domein, naam, intro, secties, concepten, vragen) => ({ niveau: 'vwo', vak: 'en', domein, naam, intro, secties, concepten, vragen });

export default [
  V('A', 'Leesvaardigheid',
    `Reading strategies help you handle exam texts: <strong>scanning</strong> to find specific information, <strong>skimming</strong> to get the gist, and <strong>inferring</strong> meaning from context. You recognise the <strong>text type</strong> (informative, persuasive, entertaining) and devices such as the <strong>rhetorical question</strong>, and you tell <strong>denotation</strong> from <strong>connotation</strong>.`,
    [
      { h: '1. Reading strategies', p: [
        `<strong>Scanning</strong> means quickly locating a specific detail such as a name or date; <strong>skimming</strong> means reading fast for the general idea. An <strong>inference</strong> is a conclusion you draw from clues, not stated directly. <strong>Context</strong> helps you guess an unknown word.`] },
      { h: '2. Text types and meaning', p: [
        `A <strong>persuasive</strong> text convinces the reader of an opinion, an <strong>informative</strong> text gives facts, an <strong>entertaining</strong> text amuses. A <strong>rhetorical question</strong> engages the reader and implies an obvious answer. <strong>Denotation</strong> is the literal meaning, <strong>connotation</strong> the emotional association. The <strong>tone</strong> is the writer's attitude.`] },
    ],
    [
      { t: 'Scanning', d: 'reading quickly to locate a specific detail such as a name or date', k: 'quickly find a detail', fout: ['Skimming'] },
      { t: 'Skimming', d: 'reading quickly to get the general idea of a text', k: 'quick general idea', fout: ['Scanning'] },
      { t: 'Rhetorical question', d: 'a question asked for effect, implying an obvious answer', k: 'question for effect', fout: ['Inference'] },
      { t: 'Denotation', d: 'the literal, dictionary meaning of a word', k: 'literal meaning', fout: ['Connotation'] },
      { t: 'Connotation', d: 'the emotional or cultural association of a word', k: 'emotional association', fout: ['Denotation'] },
      { t: 'Persuasive text', d: 'a text that aims to convince the reader of an opinion', k: 'wants to convince', fout: ['Informative text'] },
      { t: 'Informative text', d: 'a text that gives facts and explains', k: 'gives facts', fout: ['Persuasive text'] },
      { t: 'Inference', d: 'a conclusion drawn from clues rather than stated directly', k: 'conclusion from clues', fout: ['Main idea'] },
      { t: 'Main idea', d: 'the central message of a text', k: 'central message', fout: ['Tone'] },
      { t: 'Tone', d: 'the writer\'s attitude towards the subject', k: 'writer\'s attitude', fout: ['Main idea'] },
    ],
    [
      { v: 'Which text type aims primarily to entertain the reader?', o: ['an entertaining text', 'a persuasive text', 'an informative text', 'an instructive text'], c: 0, d: 2, uo: ['Correct: an entertaining text amuses the reader.', 'No, that one wants to convince.', 'No, that one gives facts.', 'No, that one explains how to do something.'], uh: 'Entertaining text: to amuse the reader.' },
      { v: 'What is the purpose of scanning a text?', o: ['to quickly locate specific information such as a name or date', 'to get the general idea', 'to enjoy the story', 'to learn every word'], c: 0, d: 2, uo: ['Correct: scanning finds a specific detail fast.', 'No, that is skimming.', 'No, that is reading for pleasure.', 'No, scanning skips most of the text.'], uh: 'Scanning: quickly find a specific detail.' },
      { v: 'What is the purpose of a rhetorical question in a persuasive text?', o: ['to engage the reader and imply an obvious answer', 'to request real information', 'to summarise the text', 'to change the subject'], c: 0, d: 3, uo: ['Correct: it draws the reader in without needing an answer.', 'No, it does not expect a real answer.', 'No, that is a conclusion.', 'No, it stays on topic.'], uh: 'Rhetorical question: engages the reader, implies the answer.' },
      { v: 'What is the difference between denotation and connotation?', o: ['denotation is the literal meaning, connotation the emotional association', 'they are the same', 'denotation is the emotional association', 'connotation is the dictionary meaning'], c: 0, d: 3, uo: ['Correct: denotation is literal, connotation carries feeling.', 'No, they differ.', 'No, that is reversed.', 'No, that is reversed.'], uh: 'Denotation: literal; connotation: emotional.' },
      { v: 'What is the purpose of skimming a text?', o: ['to get the general idea quickly', 'to find one specific fact', 'to memorise the text', 'to check the spelling'], c: 0, d: 2, uo: ['Correct: skimming gives you the gist fast.', 'No, that is scanning.', 'No, skimming is not close reading.', 'No, that is proofreading.'], uh: 'Skimming: quick general idea.' },
      { v: 'What is an inference?', o: ['a conclusion drawn from clues, not stated directly', 'a word\'s dictionary meaning', 'the title of a text', 'a spelling rule'], c: 0, d: 3, uo: ['Correct: you infer what the text implies.', 'No, that is denotation.', 'No, that is the heading.', 'No, that is grammar.'], uh: 'Inference: reading between the lines.' },
      { v: 'A persuasive text aims to...', o: ['convince the reader of an opinion', 'give neutral facts', 'amuse the reader', 'explain a procedure'], c: 0, d: 2, uo: ['Correct: it wants to convince.', 'No, that is informative.', 'No, that is entertaining.', 'No, that is instructive.'], uh: 'Persuasive text: convince the reader.' },
      { v: 'What is the main idea of a text?', o: ['the central message', 'the first word', 'a small detail', 'the page number'], c: 0, d: 1, uo: ['Correct: the main idea sums up the core.', 'No, that says little.', 'No, a detail is minor.', 'No, that is layout.'], uh: 'Main idea: the central message.' },
      { v: 'What is meant by the "tone" of a text?', o: ['the writer\'s attitude towards the subject', 'the number of paragraphs', 'the font used', 'the title'], c: 0, d: 2, uo: ['Correct: tone reflects the writer\'s attitude.', 'No, that is structure.', 'No, that is layout.', 'No, that is the heading.'], uh: 'Tone: the writer\'s attitude.' },
      { v: 'An informative text aims to...', o: ['give facts and explain', 'convince the reader', 'amuse the reader', 'give an opinion'], c: 0, d: 2, uo: ['Correct: it informs and explains.', 'No, that is persuasive.', 'No, that is entertaining.', 'No, facts are neutral.'], uh: 'Informative text: gives facts.' },
      { v: 'How does context help you when reading?', o: ['it lets you guess the meaning of an unknown word', 'it gives the exact spelling', 'it changes the tone', 'it counts the words'], c: 0, d: 2, uo: ['Correct: surrounding words hint at the meaning.', 'No, context is not a dictionary.', 'No, tone is separate.', 'No, that is not its function.'], uh: 'Context: guess unknown words from the surroundings.' },
    ]),

  V('B', 'Kijk-/Luistervaardigheid',
    `When listening, you choose between <strong>listening for gist</strong> (the overall topic) and <strong>listening for detail</strong> (specific facts). You <strong>predict</strong> content from the title and images, catch <strong>keywords</strong>, and use <strong>context clues</strong> to fill gaps.`,
    [
      { h: '1. Gist and detail', p: [
        `<strong>Listening for gist</strong> means grasping the overall topic and main idea; <strong>listening for detail</strong> means picking out specific information. Reading the questions first tells you which one you need.`] },
      { h: '2. Strategies', p: [
        `You can <strong>predict</strong> what a fragment is about from the title, images and situation. <strong>Keywords</strong> carry the main meaning, so noting them helps. If you miss a word, use <strong>context clues</strong> and keep listening for the overall message. <strong>Intonation</strong> (the rise and fall of the voice) signals emotion and emphasis.`] },
    ],
    [
      { t: 'Gist', d: 'the overall topic and main idea of what is said', k: 'overall topic', fout: ['Detail'] },
      { t: 'Detail', d: 'a specific piece of information or fact', k: 'specific fact', fout: ['Gist'] },
      { t: 'Listening for gist', d: 'listening to grasp the overall topic', k: 'grasp the main idea', fout: ['Listening for detail'] },
      { t: 'Listening for detail', d: 'listening to find specific information', k: 'find specific facts', fout: ['Listening for gist'] },
      { t: 'Prediction', d: 'guessing the content beforehand from title, images and situation', k: 'guessing beforehand', fout: ['Keywords'] },
      { t: 'Keywords', d: 'the most important words that carry the meaning', k: 'the important words', fout: ['Context clues'] },
      { t: 'Context clues', d: 'hints from the situation that help you understand unknown words', k: 'hints from the situation', fout: ['Keywords'] },
      { t: 'Intonation', d: 'the rise and fall of the voice while speaking', k: 'rise and fall of the voice', fout: ['Register'] },
      { t: 'Register', d: 'the level of formality of the speech', k: 'level of formality', fout: ['Intonation'] },
      { t: 'Main idea', d: 'what a fragment is mainly about', k: 'what it is mainly about', fout: ['Detail'] },
    ],
    [
      { v: 'What is the difference between listening for gist and listening for detail?', o: ['gist is the overall topic, detail is specific information', 'they are the same', 'gist is specific information', 'detail is the overall topic'], c: 0, d: 3, uo: ['Correct: gist is the big picture, detail is the specifics.', 'No, they differ.', 'No, that is reversed.', 'No, that is reversed.'], uh: 'Gist: overall topic; detail: specific facts.' },
      { v: 'Listening for gist means...', o: ['understanding the overall topic', 'catching every exact number', 'copying every word', 'checking pronunciation'], c: 0, d: 2, uo: ['Correct: gist is the general meaning.', 'No, that is listening for detail.', 'No, that is impossible in real time.', 'No, that is a speaking focus.'], uh: 'Listening for gist: the general meaning.' },
      { v: 'Listening for detail means...', o: ['finding specific information or facts', 'getting only the general idea', 'ignoring the content', 'guessing randomly'], c: 0, d: 2, uo: ['Correct: detail is the specifics.', 'No, that is gist.', 'No, you still need to listen.', 'No, that is not a strategy.'], uh: 'Listening for detail: specific facts.' },
      { v: 'What helps you predict content before listening?', o: ['the title and images', 'the last word only', 'the speaker\'s name', 'the file size'], c: 0, d: 2, uo: ['Correct: title and images set expectations.', 'No, you have not heard it yet.', 'No, a name reveals little.', 'No, that is irrelevant.'], uh: 'Predict from title, images and situation.' },
      { v: 'What are keywords in a listening fragment?', o: ['the most important words that carry the meaning', 'every word spoken', 'only the first word', 'the background music'], c: 0, d: 2, uo: ['Correct: keywords hold the main meaning.', 'No, not all words are key.', 'No, that is too little.', 'No, that is not language.'], uh: 'Keywords: the meaning-carrying words.' },
      { v: 'Why note keywords while listening?', o: ['to catch the main points', 'to write a full transcript', 'to correct the speaker', 'to slow down the audio'], c: 0, d: 2, uo: ['Correct: keywords capture the essentials.', 'No, that is not feasible.', 'No, that is not the goal.', 'No, you cannot control the audio.'], uh: 'Note keywords to catch the main points.' },
      { v: 'How do context clues help a listener?', o: ['they help you understand unknown words from the situation', 'they give the exact spelling', 'they translate everything', 'they add subtitles'], c: 0, d: 3, uo: ['Correct: the situation hints at meaning.', 'No, listening is not about spelling.', 'No, they only hint.', 'No, that is a different aid.'], uh: 'Context clues: guess meaning from the situation.' },
      { v: 'What is intonation?', o: ['the rise and fall of the voice', 'the speed of speaking', 'the choice of words', 'the volume only'], c: 0, d: 2, uo: ['Correct: intonation is the melody of the voice.', 'No, that is pace.', 'No, that is vocabulary.', 'No, volume is separate.'], uh: 'Intonation: rise and fall of the voice.' },
      { v: 'What should you do before a listening task?', o: ['read the questions first', 'close your eyes', 'write your answers already', 'ignore the title'], c: 0, d: 2, uo: ['Correct: the questions tell you what to listen for.', 'No, you may need the images.', 'No, you have not heard it yet.', 'No, the title helps you predict.'], uh: 'Read the questions first to focus your listening.' },
      { v: 'If you miss a word while listening, you should...', o: ['keep listening for the overall meaning', 'stop and give up', 'panic about that one word', 'rewind, which is not allowed in the exam'], c: 0, d: 3, uo: ['Correct: hold on to the overall message.', 'No, one word is rarely decisive.', 'No, that costs you the rest.', 'No, you cannot rewind in the exam.'], uh: 'Miss a word: keep going for the gist.' },
    ]),

  V('C', 'Gespreksvaardigheid',
    `In a conversation you speak with <strong>fluency</strong>, adapt your <strong>register</strong>, and manage <strong>turn-taking</strong>. You <strong>introduce a perspective</strong>, <strong>agree</strong> or <strong>disagree</strong> politely, <strong>paraphrase</strong> when needed and ask for <strong>clarification</strong>.`,
    [
      { h: '1. Speaking well', p: [
        `<strong>Fluency</strong> is speaking smoothly without stopping at every mistake; clear <strong>pronunciation</strong> makes you understood. <strong>Filler words</strong> ("um", "well") buy thinking time. You match your <strong>register</strong> to the situation.`] },
      { h: '2. Interacting', p: [
        `To keep a discussion going you use <strong>turn-taking</strong> and phrases to <strong>introduce a perspective</strong> ("It could also be argued that…"). You <strong>agree</strong> ("I completely agree that…") or <strong>disagree</strong> politely ("I see your point, but…"), <strong>paraphrase</strong> to reword, and ask for <strong>clarification</strong> when unsure.`] },
    ],
    [
      { t: 'Fluency', d: 'the smoothness and ease with which you speak', k: 'smooth speaking', fout: ['Pronunciation'] },
      { t: 'Register', d: 'the level of formality you use when speaking', k: 'level of formality', fout: ['Fluency'] },
      { t: 'Turn-taking', d: 'letting speakers take turns in a conversation', k: 'taking turns', fout: ['Clarification'] },
      { t: 'Paraphrasing', d: 'saying the same thing in different words', k: 'reword in other words', fout: ['Clarification'] },
      { t: 'Introducing a perspective', d: 'bringing in a new point of view in a discussion', k: 'add a new viewpoint', fout: ['Agreeing'] },
      { t: 'Agreeing', d: 'expressing that you share someone\'s view', k: 'share a view', fout: ['Disagreeing'] },
      { t: 'Disagreeing', d: 'politely expressing a different view', k: 'differ politely', fout: ['Agreeing'] },
      { t: 'Filler words', d: 'small words like "um" or "well" that fill a pause', k: 'fill a pause', fout: ['Fluency'] },
      { t: 'Pronunciation', d: 'the way you produce the sounds of words', k: 'producing sounds', fout: ['Fluency'] },
      { t: 'Clarification', d: 'asking someone to explain what they mean', k: 'ask to explain', fout: ['Paraphrasing'] },
    ],
    [
      { v: 'What is an effective way to introduce a new perspective in a discussion?', o: ['"It could also be argued that…"', '"You are completely wrong."', '"Let\'s stop talking."', '"I did not hear you."'], c: 0, d: 3, uo: ['Correct: this opens a new viewpoint politely.', 'No, that attacks rather than adds.', 'No, that ends the discussion.', 'No, that avoids the topic.'], uh: 'Introduce a perspective: "It could also be argued that…"' },
      { v: 'What is fluency?', o: ['the smoothness and ease with which you speak', 'the number of words you know', 'your accent', 'your reading speed'], c: 0, d: 2, uo: ['Correct: fluency is smooth, easy speaking.', 'No, that is vocabulary.', 'No, that is pronunciation-related.', 'No, that is reading.'], uh: 'Fluency: smooth, easy speaking.' },
      { v: 'What is paraphrasing?', o: ['saying the same thing in different words', 'repeating word for word', 'staying silent', 'changing the topic'], c: 0, d: 3, uo: ['Correct: you reword the same idea.', 'No, that is quoting.', 'No, that is not speaking.', 'No, that avoids the point.'], uh: 'Paraphrasing: reword the same idea.' },
      { v: 'How do you politely disagree in a discussion?', o: ['"I see your point, but…"', '"That is nonsense."', 'by interrupting loudly', 'by ignoring the speaker'], c: 0, d: 3, uo: ['Correct: acknowledge, then differ.', 'No, that is rude.', 'No, interrupting is impolite.', 'No, ignoring shows no respect.'], uh: 'Disagree politely: "I see your point, but…"' },
      { v: 'What is turn-taking?', o: ['letting speakers take turns in a conversation', 'talking over others', 'speaking only once', 'reading aloud'], c: 0, d: 2, uo: ['Correct: turn-taking keeps a conversation orderly.', 'No, that is interrupting.', 'No, a conversation has many turns.', 'No, that is not conversation.'], uh: 'Turn-taking: speakers take turns.' },
      { v: 'What are filler words?', o: ['small words like "um" that fill a pause', 'formal linking words', 'swear words', 'foreign words'], c: 0, d: 2, uo: ['Correct: fillers buy thinking time.', 'No, those are cohesive devices.', 'No, that is different.', 'No, that is unrelated.'], uh: 'Filler words: "um", "well" to fill pauses.' },
      { v: 'What is register in speaking?', o: ['the level of formality', 'the volume of the voice', 'the speed of talking', 'the accent'], c: 0, d: 2, uo: ['Correct: register is how formal you are.', 'No, that is volume.', 'No, that is pace.', 'No, that is pronunciation.'], uh: 'Register: level of formality.' },
      { v: 'How do you ask for clarification?', o: ['"Could you explain what you mean?"', '"I already know that."', '"Let\'s move on."', 'by saying nothing'], c: 0, d: 2, uo: ['Correct: this asks the speaker to explain.', 'No, that closes the topic.', 'No, that skips it.', 'No, silence does not clarify.'], uh: 'Clarification: "Could you explain what you mean?"' },
      { v: 'Why is pronunciation important?', o: ['to be understood clearly', 'to speak faster', 'to use longer words', 'to write neatly'], c: 0, d: 1, uo: ['Correct: clear sounds make you understood.', 'No, speed is separate.', 'No, that is vocabulary.', 'No, that is writing.'], uh: 'Pronunciation: to be understood.' },
      { v: 'How do you show agreement?', o: ['"I completely agree that…"', '"That is wrong."', 'by staying silent', 'by changing the subject'], c: 0, d: 2, uo: ['Correct: this clearly signals agreement.', 'No, that is disagreement.', 'No, silence is unclear.', 'No, that avoids the point.'], uh: 'Agree: "I completely agree that…"' },
    ]),

  V('D', 'Schrijfvaardigheid',
    `Good writing uses <strong>linking words</strong> to show relations: <strong>however</strong> (contrast), <strong>therefore</strong> (consequence), <strong>moreover</strong> (addition), <strong>nevertheless</strong> (concession). You choose the right <strong>register</strong> and letter <strong>closing</strong>, and keep the text <strong>coherent</strong> and <strong>cohesive</strong>.`,
    [
      { h: '1. Linking words', p: [
        `<strong>However</strong> signals contrast, <strong>therefore</strong> a consequence, <strong>moreover</strong> an addition, and <strong>nevertheless</strong> a concession ("in spite of that"). A <strong>topic sentence</strong> states the main idea of a paragraph.`] },
      { h: '2. Register and letters', p: [
        `<strong>Formal register</strong> is polite and avoids contractions. In a formal letter you close with <strong>"Yours sincerely,"</strong> when you know the recipient's name and <strong>"Yours faithfully,"</strong> when you do not. <strong>Coherence</strong> is the logical flow of ideas; <strong>cohesion</strong> is the linguistic links that hold sentences together.`] },
    ],
    [
      { t: 'However', d: 'a linking word that signals contrast', k: 'signals contrast', fout: ['Therefore'] },
      { t: 'Therefore', d: 'a linking word that signals a consequence or conclusion', k: 'signals consequence', fout: ['However'] },
      { t: 'Moreover', d: 'a linking word that adds to a previous point', k: 'adds a point', fout: ['However'] },
      { t: 'Nevertheless', d: 'a linking word that signals a concession, "in spite of that"', k: 'in spite of that', fout: ['Therefore'] },
      { t: 'Formal register', d: 'polite language without contractions', k: 'polite, no contractions', fout: ['Informal register'] },
      { t: 'Coherence', d: 'the logical flow of ideas in a text', k: 'logical flow of ideas', fout: ['Cohesion'] },
      { t: 'Cohesion', d: 'the linguistic links that hold sentences together', k: 'linguistic links', fout: ['Coherence'] },
      { t: 'Topic sentence', d: 'the sentence that states the main idea of a paragraph', k: 'main idea of a paragraph', fout: ['Paragraph'] },
      { t: 'Paragraph', d: 'a block of text about one sub-topic', k: 'one sub-topic', fout: ['Topic sentence'] },
      { t: 'Linking word', d: 'a word that connects ideas and shows their relation', k: 'connects ideas', fout: ['Topic sentence'] },
    ],
    [
      { v: 'What is the difference between "however" and "therefore"?', o: ['"however" signals contrast, "therefore" signals consequence', 'they mean the same', '"however" signals consequence', '"therefore" signals contrast'], c: 0, d: 2, uo: ['Correct: contrast versus consequence.', 'No, they differ.', 'No, that is reversed.', 'No, that is reversed.'], uh: '"However": contrast; "therefore": consequence.' },
      { v: 'In a formal letter, what is the correct closing when you know the recipient\'s name?', o: ['Yours sincerely,', 'Yours faithfully,', 'Cheers,', 'Bye,'], c: 0, d: 3, uo: ['Correct: known name goes with "Yours sincerely,".', 'No, that is for an unknown name.', 'No, too informal.', 'No, too informal.'], uh: 'Known name: "Yours sincerely,".' },
      { v: 'What is the difference between "moreover" and "however"?', o: ['"moreover" adds a point, "however" signals contrast', 'they are identical', '"moreover" signals contrast', '"however" adds a point'], c: 0, d: 2, uo: ['Correct: addition versus contrast.', 'No, they differ.', 'No, that is reversed.', 'No, that is reversed.'], uh: '"Moreover": adds; "however": contrasts.' },
      { v: 'Complete: "The results were promising. ___, further testing is required."', o: ['Nevertheless', 'Therefore', 'Moreover', 'For example'], c: 0, d: 3, uo: ['Correct: "nevertheless" signals the concession.', 'No, that would mean it follows logically.', 'No, that just adds.', 'No, that introduces an example.'], uh: '"Nevertheless": in spite of that.' },
      { v: 'What is the difference between coherence and cohesion?', o: ['coherence is the logical flow, cohesion the linguistic links', 'they are the same', 'coherence is the linguistic links', 'cohesion is the logical flow'], c: 0, d: 3, uo: ['Correct: coherence is meaning, cohesion is form.', 'No, they differ.', 'No, that is reversed.', 'No, that is reversed.'], uh: 'Coherence: logical flow; cohesion: linguistic links.' },
      { v: 'What does "therefore" signal?', o: ['a consequence or conclusion', 'a contrast', 'an example', 'an addition'], c: 0, d: 2, uo: ['Correct: "therefore" introduces a result.', 'No, that is "however".', 'No, that is "for example".', 'No, that is "moreover".'], uh: '"Therefore": consequence.' },
      { v: 'What is a topic sentence?', o: ['the sentence stating the main idea of a paragraph', 'the longest sentence', 'the final sentence of the text', 'the title'], c: 0, d: 2, uo: ['Correct: it carries the paragraph\'s main idea.', 'No, length is irrelevant.', 'No, it usually opens the paragraph.', 'No, that is the heading.'], uh: 'Topic sentence: main idea of a paragraph.' },
      { v: 'What does formal register mean?', o: ['polite language without contractions', 'slang and abbreviations', 'text-message style', 'dialect'], c: 0, d: 2, uo: ['Correct: formal is polite and full-form.', 'No, that is informal.', 'No, that is very informal.', 'No, dialect is spoken and regional.'], uh: 'Formal register: polite, no contractions.' },
      { v: 'What does "moreover" signal?', o: ['adding to a previous point', 'a contrast', 'a consequence', 'an example'], c: 0, d: 2, uo: ['Correct: "moreover" adds information.', 'No, that is "however".', 'No, that is "therefore".', 'No, that is "for example".'], uh: '"Moreover": adds a point.' },
      { v: 'In a formal letter, what is the correct closing when you do NOT know the name?', o: ['Yours faithfully,', 'Yours sincerely,', 'Love,', 'See you,'], c: 0, d: 3, uo: ['Correct: unknown name goes with "Yours faithfully,".', 'No, that is for a known name.', 'No, too informal.', 'No, too informal.'], uh: 'Unknown name: "Yours faithfully,".' },
      { v: 'What is a linking word?', o: ['a word that connects ideas and shows their relation', 'a spelling mistake', 'the first word of a text', 'a proper noun'], c: 0, d: 1, uo: ['Correct: linking words connect ideas.', 'No, that is an error.', 'No, that is position, not function.', 'No, that is a name.'], uh: 'Linking word: connects ideas.' },
    ]),

  V('E', 'Literatuur',
    `Literary analysis uses terms for structure and style: a <strong>motif</strong> is a recurring symbolic element, the <strong>theme</strong> is the underlying idea and the <strong>plot</strong> is what happens. You recognise devices such as <strong>foreshadowing</strong>, <strong>dramatic irony</strong>, <strong>metaphor</strong> and <strong>enjambment</strong>, and forms such as the <strong>sonnet</strong>.`,
    [
      { h: '1. Structure', p: [
        `The <strong>plot</strong> is the sequence of events; the <strong>theme</strong> is the abstract idea the work explores. A <strong>motif</strong> is a recurring element with symbolic meaning. <strong>Foreshadowing</strong> hints at future events; the <strong>narrator</strong> is the voice telling the story.`] },
      { h: '2. Style and form', p: [
        `<strong>Dramatic irony</strong> occurs when the audience knows something a character does not. A <strong>metaphor</strong> compares directly without "like" or "as". <strong>Enjambment</strong> runs a phrase over to the next line without a pause. A <strong>sonnet</strong> is a 14-line poem with a fixed rhyme scheme. <strong>Symbolism</strong> uses an object to represent an idea.`] },
    ],
    [
      { t: 'Motif', d: 'a recurring element with symbolic significance in a work', k: 'recurring symbolic element', fout: ['Theme'] },
      { t: 'Dramatic irony', d: 'when the audience knows something a character does not', k: 'audience knows, character does not', fout: ['Foreshadowing'] },
      { t: 'Enjambment', d: 'when a phrase runs over to the next line without a pause', k: 'line runs over', fout: ['Metaphor'] },
      { t: 'Theme', d: 'the underlying abstract idea a work explores', k: 'underlying idea', fout: ['Plot'] },
      { t: 'Plot', d: 'the sequence of events in a story', k: 'what happens', fout: ['Theme'] },
      { t: 'Foreshadowing', d: 'a hint that anticipates future events', k: 'hint at what comes', fout: ['Dramatic irony'] },
      { t: 'Sonnet', d: 'a 14-line poem with a fixed rhyme scheme', k: '14-line poem', fout: ['Motif'] },
      { t: 'Metaphor', d: 'a direct comparison without "like" or "as"', k: 'direct comparison', fout: ['Symbolism'] },
      { t: 'Narrator', d: 'the voice that tells the story', k: 'the storytelling voice', fout: ['Protagonist'] },
      { t: 'Symbolism', d: 'using an object to represent a larger idea', k: 'object stands for an idea', fout: ['Motif'] },
    ],
    [
      { v: 'What is a motif in a literary work?', o: ['a recurring element with symbolic significance', 'the main character', 'the final chapter', 'the rhyme scheme'], c: 0, d: 3, uo: ['Correct: a motif recurs and carries symbolic meaning.', 'No, that is the protagonist.', 'No, that is structure.', 'No, that is form.'], uh: 'Motif: recurring symbolic element.' },
      { v: 'What is dramatic irony?', o: ['when the audience knows something a character does not', 'when a poem does not rhyme', 'when the plot is chronological', 'when a metaphor is used'], c: 0, d: 3, uo: ['Correct: the audience is ahead of the character.', 'No, that is free verse.', 'No, that is structure.', 'No, that is a device, not irony.'], uh: 'Dramatic irony: audience knows, character does not.' },
      { v: 'What is enjambment in poetry?', o: ['when a phrase runs over to the next line without a pause', 'when every line rhymes', 'when a poem has 14 lines', 'when the poet uses a metaphor'], c: 0, d: 3, uo: ['Correct: the sense flows across the line break.', 'No, that is rhyme.', 'No, that is a sonnet.', 'No, that is a metaphor.'], uh: 'Enjambment: a line runs over without a pause.' },
      { v: 'What is the difference between theme and plot?', o: ['plot is what happens, theme is the underlying idea', 'they are the same', 'plot is the underlying idea', 'theme is the sequence of events'], c: 0, d: 3, uo: ['Correct: plot is events, theme is meaning.', 'No, they differ.', 'No, that is reversed.', 'No, that is reversed.'], uh: 'Plot: events; theme: underlying idea.' },
      { v: 'What does foreshadowing mean?', o: ['a hint that anticipates future events', 'a flashback to the past', 'the main idea', 'a 14-line poem'], c: 0, d: 2, uo: ['Correct: foreshadowing hints at what is to come.', 'No, that is a flashback.', 'No, that is the theme.', 'No, that is a sonnet.'], uh: 'Foreshadowing: a hint of future events.' },
      { v: 'What is a 14-line poem with a fixed rhyme scheme called?', o: ['a sonnet', 'an ode', 'a haiku', 'a ballad'], c: 0, d: 2, uo: ['Correct: a sonnet has 14 lines and a set rhyme scheme.', 'No, an ode has no fixed length.', 'No, a haiku has three lines.', 'No, a ballad tells a story in stanzas.'], uh: 'Sonnet: 14 lines, fixed rhyme.' },
      { v: 'What is a metaphor?', o: ['a direct comparison without "like" or "as"', 'a comparison using "like" or "as"', 'a recurring symbol', 'a 14-line poem'], c: 0, d: 2, uo: ['Correct: a metaphor compares directly.', 'No, that is a simile.', 'No, that is a motif.', 'No, that is a sonnet.'], uh: 'Metaphor: direct comparison, no "like/as".' },
      { v: 'What is the narrator?', o: ['the voice that tells the story', 'the author\'s real name', 'the main conflict', 'the setting'], c: 0, d: 2, uo: ['Correct: the narrator is the storytelling voice.', 'No, the narrator can differ from the author.', 'No, that is the conflict.', 'No, that is the place and time.'], uh: 'Narrator: the voice telling the story.' },
      { v: 'What is symbolism?', o: ['using an object to represent a larger idea', 'the sequence of events', 'the rhyme of a poem', 'the main character'], c: 0, d: 2, uo: ['Correct: a symbol stands for an idea.', 'No, that is plot.', 'No, that is form.', 'No, that is the protagonist.'], uh: 'Symbolism: an object represents an idea.' },
      { v: 'Who is the protagonist of a story?', o: ['the main character', 'the narrator only', 'the villain always', 'the author'], c: 0, d: 1, uo: ['Correct: the protagonist is the central character.', 'No, the narrator may differ.', 'No, the antagonist is the opponent.', 'No, the author writes it.'], uh: 'Protagonist: the main character.' },
    ]),
];
