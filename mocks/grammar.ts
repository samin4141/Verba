export interface GrammarRule {
  id: string;
  title: string;
  explanation: string;
  examples: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
}

export const grammarRules: GrammarRule[] = [
  {
    id: 'present-simple',
    title: 'Present Simple Tense',
    explanation: 'The present simple tense is used to describe habits, unchanging situations, general truths, and fixed arrangements. It is formed using the base form of the verb (or the 3rd person singular form with -s/-es ending).',
    examples: [
      'I work in London.',
      'She works in London.',
      'The Earth revolves around the Sun.',
      'We usually have dinner at 7 PM.'
    ],
    level: 'beginner'
  },
  {
    id: 'present-continuous',
    title: 'Present Continuous Tense',
    explanation: 'The present continuous tense is used to describe actions happening now or around now, and developing or temporary situations. It is formed using the present tense of the verb "to be" + the present participle (verb + -ing).',
    examples: [
      'I am working on a project right now.',
      'She is studying for her exams this week.',
      'They are traveling around Europe this summer.',
      'Is he waiting for us?'
    ],
    level: 'beginner'
  },
  {
    id: 'past-simple',
    title: 'Past Simple Tense',
    explanation: 'The past simple tense is used to describe completed actions in the past. Regular verbs add -ed to the base form, while irregular verbs have special past forms.',
    examples: [
      'I visited Paris last summer.',
      'She bought a new car yesterday.',
      "They didn't attend the meeting.",
      'Did you see that movie?'
    ],
    level: 'beginner'
  },
  {
    id: 'future-simple',
    title: 'Future Simple Tense (will)',
    explanation: 'The future simple tense is used to express actions that will occur in the future. It is formed using "will" + the base form of the verb.',
    examples: [
      'I will call you tomorrow.',
      'She will graduate next year.',
      "They won't be available next week.",
      'Will you attend the conference?'
    ],
    level: 'beginner'
  },
  {
    id: 'present-perfect',
    title: 'Present Perfect Tense',
    explanation: 'The present perfect tense is used to describe past actions that have a connection to the present. It is formed using "have/has" + past participle.',
    examples: [
      'I have lived in London for five years.',
      'She has visited Paris three times.',
      "They haven't finished their homework yet.",
      'Have you ever been to Japan?'
    ],
    level: 'intermediate'
  },
  {
    id: 'past-continuous',
    title: 'Past Continuous Tense',
    explanation: 'The past continuous tense is used to describe actions that were in progress at a specific time in the past. It is formed using "was/were" + present participle (verb + -ing).',
    examples: [
      'I was working at 8 PM last night.',
      'She was studying when I called her.',
      'They were not listening to the teacher.',
      'Were you sleeping when the phone rang?'
    ],
    level: 'intermediate'
  },
  {
    id: 'conditionals',
    title: 'Conditional Sentences',
    explanation: 'Conditional sentences express hypothetical situations and their consequences. There are four main types of conditionals in English, each with its own structure and meaning.',
    examples: [
      'If it rains, I will stay at home. (First conditional)',
      'If I had more money, I would travel more. (Second conditional)',
      'If she had studied harder, she would have passed the exam. (Third conditional)',
      'If I were you, I would accept the offer. (Mixed conditional)'
    ],
    level: 'intermediate'
  },
  {
    id: 'passive-voice',
    title: 'Passive Voice',
    explanation: 'The passive voice is used when the focus is on the action rather than who or what is performing the action. It is formed using a form of "to be" + past participle.',
    examples: [
      'The house was built in 1980.',
      'The report is being prepared by the team.',
      'The thief has been caught by the police.',
      'The project will be completed by next month.'
    ],
    level: 'intermediate'
  },
  {
    id: 'reported-speech',
    title: 'Reported Speech',
    explanation: 'Reported speech (also called indirect speech) is used to report what someone else said without using their exact words. When using reported speech, the tense usually shifts back one tense.',
    examples: [
      'Direct: "I am tired." → Reported: She said (that) she was tired.',
      'Direct: "I will call you." → Reported: He said (that) he would call me.',
      'Direct: "Have you finished?" → Reported: She asked if I had finished.',
      'Direct: "Don\'t touch that!" → Reported: He told me not to touch that.'
    ],
    level: 'advanced'
  },
  {
    id: 'future-perfect',
    title: 'Future Perfect Tense',
    explanation: 'The future perfect tense is used to describe actions that will be completed before a specific time in the future. It is formed using "will have" + past participle.',
    examples: [
      'By next year, I will have graduated from university.',
      'She will have finished the project by the deadline.',
      'They will not have arrived by the time we leave.',
      'Will you have completed the report by tomorrow?'
    ],
    level: 'advanced'
  },
  {
    id: 'subjunctive',
    title: 'Subjunctive Mood',
    explanation: 'The subjunctive mood is used to express wishes, hypothetical situations, demands, or suggestions. In English, it often appears in formal contexts and certain fixed expressions.',
    examples: [
      'I suggest that he be more careful.',
      'It is essential that everyone attend the meeting.',
      'If I were rich, I would buy a yacht.',
      'Long live the king!'
    ],
    level: 'advanced'
  },
  {
    id: 'inversion',
    title: 'Inversion',
    explanation: 'Inversion is a literary technique where the normal word order is reversed for emphasis or stylistic effect. In English, it often occurs in questions, after negative adverbials, or in conditional sentences without "if".',
    examples: [
      'Never have I seen such a beautiful sunset.',
      'Not only did she win the race, but she also broke the record.',
      'Had I known about the problem, I would have fixed it.',
      'Should you need any assistance, please let me know.'
    ],
    level: 'advanced'
  }
];