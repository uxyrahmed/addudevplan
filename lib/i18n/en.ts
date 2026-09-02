/**
 * Every word of the site's own chrome, in the language it was written in.
 *
 * The plan's *content* is not here — that is `lib/plan.ts` and its translations
 * in `lib/plan-translations/`. This file holds only what the site says about
 * the plan: labels, controls, headings the deck did not supply, and the copy
 * that explains how to respond.
 *
 * `en` is the shape as well as the source. `Dictionary` is derived from it, so
 * a translation cannot go missing a key or invent one — it stops compiling.
 * That is deliberate: a half-translated dictionary is the failure that shows up
 * as an English word in the middle of a Dhivehi sentence, which is worse than
 * either language on its own.
 *
 * Placeholders are `{name}`, filled by `lib/i18n/format.tsx`. Do not split a
 * sentence across two keys to get a figure into the middle of it — that fixes
 * the word order in English and leaves every other language to follow it.
 */
export const en = {
  common: {
    skipToContent: 'Skip to content',
    /** Names the switcher itself, not either of the languages in it. */
    languageLabel: 'Language',
    /**
     * Between items in a list built in code — the island names read into the
     * map's description. Dhivehi uses the Arabic comma, which leans the other
     * way; a Latin comma inside a run of Thaana is the wrong mark, not just an
     * unusual one.
     */
    listSeparator: ', ',
  },

  header: {
    navLabel: 'Main',
    homeAria: '{title} home',
    thePlan: 'The plan',
    twelveGoals: 'Twelve goals',
    initiatives: 'Initiatives',
    haveYourSay: 'Have your say',
  },

  hero: {
    imageAlt: 'A White Tern in flight over Addu — a bird found only here.',
    exploreGoals: 'Explore the twelve goals',
    startReading: 'Start reading',
  },

  home: {
    geographyTitle: 'A connected atoll',
    geographyBody:
      'The Link Road runs the length of the western chain, joining four islands end to end. There are two inhabited islands and three resorts on the eastern chain. Gan in the southern tip serves as the international airport.',
    islandsLabel: 'Islands of the city',

    registerSentence: 'people are registered in Addu.',
    registerTarget:
      'The population of Addu has increased from 14,094 to 25,062 by 2022. This plan sets a target of 35,000 residents in Addu by 2030.',
    sourcesLine: 'In {year}: {registered} on the register',
    sourcesResident: '{resident} living here',
    backgroundLink: 'Settlement history and the counts year by year',

    visionResidents: 'residents by 2030',

    goalsTitle: 'Twelve goals',
    goalsBody:
      'Twelve goals carry the vision of a resilient, inclusive, sustainable Addu. Open any goal to read its targets and comment on each action.',

    feedbackTitle: 'Tell us what to change.',
    feedbackBody:
      'Every one of the {count} actions in this plan takes a response — support it, say you are unsure, or raise a concern, and add a comment if you want to explain. Your answers send themselves as you make them.',
    startWithGoalOne: 'Start with goal 1',
  },

  goal: {
    metaTitle: 'Goal {number}: {title}',
    backToGoals: 'Back to the goals',
    counter: 'Goal {number} of {total}',
    whyThisMatters: 'Why this matters',
    whereWeAreToday: 'Where we are today',
    targets: 'Targets',
    targetLabel: 'Target {label}',
    strategiesAndActions: 'Strategies and actions',
    strategiesBody:
      'Tell us what you think of each action below. One tap to react, and a comment box if you want to explain why.',
    stillOpen: 'Still open: ',
    otherGoalsLabel: 'Other goals',
    nextGoal: 'Next goal',
    previousGoal: 'Previous goal',
  },

  goalCard: {
    goalNumber: 'Goal {number}',
    counts: '{strategies} strategies · {actions} actions',
    noStrategies: 'No strategies published yet',
  },

  strategies: {
    notPublished:
      'Strategies for this goal are not published yet. They will appear here, each action open for your response, as soon as they are.',
    responded: 'You have responded to {answered} of {total} actions',
    progressAria: 'Actions you have responded to in goal {number}',
    strategyPrefix: 'Strategy {number}: ',
  },

  /**
   * The three reactions, named for a resident. `lib/reactions.ts` keeps the
   * English alongside the colours because the council's results screens read
   * from it; these are what the public controls actually print.
   */
  reactions: {
    supportLabel: 'I support this',
    supportShort: 'Support',
    unsureLabel: "I'm not sure",
    unsureShort: 'Not sure',
    concernLabel: 'I have a concern',
    concernShort: 'Concern',
  },

  control: {
    reactionAria: '{label}: {subject}',
    comment: 'Comment',
    commentAdded: 'Comment added',
    addCommentAria: 'Add a comment on: {subject}',
    editCommentAria: 'Edit your comment on: {subject}',
    notPostedSuffix: ' — not posted yet',
    yourCommentOn: 'Your comment on: {subject}',
    placeholder: 'What would you change, add, or worry about?',
    clearedHereOnly: 'Cleared here only — Remove takes it out of your feedback',
    postedWithFeedback: 'Posted with your feedback',
    remove: 'Remove',
    removeCommentAria: 'Remove your comment on: {subject}',
    post: 'Post',
    update: 'Update',
    postCommentAria: 'Post your comment on: {subject}',
    updateCommentAria: 'Update your comment on: {subject}',
  },

  planComment: {
    title: 'On the plan as a whole',
    placeholder: 'What should the council know about the plan as a whole?',
  },

  basket: {
    review: 'Review',
    sending: 'Sending',
    sent: 'Sent',
    notSent: 'Not sent',
    launcherAria:
      'Your feedback: {count} of {total} actions answered across {started} of {goals} goals{overall} — {state}. Open to review it.',
    overallClause: ', and a comment on the plan as a whole',
    stateSent: 'sent to the council',
    stateNotSent: 'not sent yet',
    stateSending: 'sending',
    overallTitle: 'Your comment on the plan as a whole',
    goalTitle: 'Goal {number}: {title}',
  },

  panel: {
    dialogLabel: 'Your feedback on the plan',
    title: 'Your feedback',
    summary: '{count} of {total} actions · {started} of {goals} goals started',
    close: 'Close',
    planAsWhole: 'The plan as a whole',
    removeOverallAria: 'Remove your comment on the plan as a whole',
    changeWhatYouSaid: 'Change what you said',
    sayAboutPlan: 'Say something about the plan itself',
    showAnswersAria: 'Show your {count} {noun} on goal {number}',
    hideAnswersAria: 'Hide your {count} {noun} on goal {number}',
    answerOne: 'answer',
    answerOther: 'answers',
    startGoalAria: 'Start goal {number}: {title}',
    removeFeedbackAria: 'Remove your feedback on: {label}',
    answerRemaining: 'Answer the remaining {count}',
    openThisGoal: 'Open this goal',

    statusSending: 'Sending…',
    statusSendingShortly: 'Sending shortly',
    statusNotSent: 'Not sent yet. Your answers are saved on this device.',
    statusSentAt: 'Sent at {time}',
    statusUpdatedAt: 'Updated at {time}',
    statusSent: 'Sent',
    statusUpdated: 'Updated',
    statusIdle: 'Your answers send themselves',
    tryAgainNow: 'Try again now',
    sendNow: 'Send now',

    sentAnonymously: 'Sent anonymously',
    downloadCopy: 'Download a copy',
    deleteMyFeedback: 'Delete my feedback',

    confirmTitle: 'Delete your feedback?',
    confirmBody:
      'This withdraws all {count} {noun} from the consultation and clears them from this device. The council will no longer have them, and this cannot be undone.',
    responseOne: 'response',
    responseOther: 'responses',
    keepMyFeedback: 'Keep my feedback',
    deleting: 'Deleting…',
    deleteEverything: 'Delete everything',
  },

  /**
   * What the basket says when a send does not land. Read by a resident who is
   * trying to work out whether the council has their answers, so each one says
   * where the answers are now and what happens next.
   */
  errors: {
    sendOffline:
      'Your feedback has not reached us yet — the connection dropped. Your answers are saved on this device and we will keep trying.',
    sendFailed:
      'Your feedback could not be sent. Your answers are still on this device — please try again.',
    withdrawFailed:
      'Your feedback could not be withdrawn. Nothing has been changed — please try again.',
    withdrawOffline:
      'Your feedback could not be withdrawn — the connection dropped. Nothing has been changed, so you can try again.',
  },

  background: {
    metaTitle: 'Settlement history',
    metaDescription:
      'The record behind the plan: where Addu’s people have been settled since 1620, and the registered and resident population counts from 1977 to 2025.',
    backToPlan: 'Back to the plan',
    title: 'Settlement history',
    lede: 'The following is a brief timeline of settlement history in Addu from 1620 to 2025.',

    settlementTitle: 'Communities relocated and new administrations formed',
    settlementBody:
      'Since the establishment of Hithadhoo in 1620, several community relocations have occurred in Addu, mainly due to the establishment of Gan Airport by the British RAF during WWII, and the reestablishment of British military base in Gan.',
    settlementRailLabel: 'Settlement history, 1620 to 2026',

    ledgerTitle: '25,000 residents',
    ledgerBody:
      'Since the British departed Gan in 1976, decades of outward migration occurred.',
    ledgerYear: 'Year',
    ledgerLivingElsewhere: 'Living elsewhere',
    ledgerOf: '{resident} of {registered} registered',
    ledgerRegistered: '{registered} registered',
    ledgerNotCounted: 'Not yet counted',
    ledgerLivingElsewhereSr: ' living elsewhere',
    legendLivingHere: 'Living here',
    legendOnRegister: 'On the register',

    closing:
      'This plan is an integrated blueprint for transforming Addu into a resilient, inclusive and sustainable city.',
  },

  timeline: {
    scrollBack: 'Scroll timeline back',
    scrollForward: 'Scroll timeline forward',
  },

  chart: {
    nationalShare: 'Share of the national population',
    nationalShareYears: '1958–2022',
    chartAria:
      "{subtitle}. Addu falls from 9% in 1958 to 5.1% in 2022, while Male' rises from 11% to 40%.",
    reading:
      'Addu’s share of the Maldivian population fell from 9% to 5.1%. Male’s rose from 11% to 40%.',
  },

  map: {
    linkRoad: 'Link Road',
    islandOfCity: 'Island of the city',
    aria: 'Map of Addu Atoll. The four islands of the city — {islands} — lie along the western side of the atoll from north to south, joined end to end by the Link Road, which crosses open water on causeways. The road runs on past Feydhoo to the south-east to Gan, which is outside the city and carries the international airport and its runway. The rest of the atoll is reef and lagoon.',
  },

  footer: {
    allGoalsLabel: 'All goals',
    twelveGoals: 'Twelve goals',
    behindThePlan: 'Behind the plan',
    settlementAndPopulation: 'Settlement history',
    imprint: 'Published on {date} by {author}. Every action has its own place to respond.',
    openForConsultation:
      'Open for consultation — figures and targets can change with your feedback.',
  },

  metadata: {
    description:
      'Twelve goals to make Addu a sustainable, resilient and inclusive city of 35,000 people by 2030. Read the plan and tell us what you think of every action.',
    ogDescription:
      'Twelve goals for a sustainable Addu. Read the plan and share your feedback on every strategy.',
    /**
     * The share card's alt text.
     *
     * Lives here rather than in an `opengraph-image.alt.txt` beside the image,
     * which is where Next's file convention would put it. The image itself had
     * to move out of `app/[lang]` — a metadata image under a dynamic segment
     * fails the production build — and from the app root the convention no
     * longer attaches it to these pages, so the card is declared by hand in
     * `generateMetadata`. Its alt has to come with it, and being here means it
     * is translated like everything else.
     */
    ogImageAlt:
      'The plan’s cover: the City of Addu emblem above the title Addu Development Plan 2026–2031, set over a pale outline of the atoll.',
  },
}

/**
 * The shape every locale must fill. Derived from `en` rather than declared, so
 * adding a string here is what obliges every translation to carry it.
 */
export type Dictionary = typeof en
