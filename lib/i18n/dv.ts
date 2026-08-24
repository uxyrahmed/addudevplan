import type { Dictionary } from './en'

/**
 * The site's chrome in Dhivehi.
 *
 * Typed as `Dictionary`, so this file cannot fall behind `en.ts`: a string
 * added there is a compile error here until it is translated, and a key that
 * does not exist there is a compile error too. Nothing falls back silently.
 *
 * Written in Thaana, which is read right to left. The `{name}` placeholders
 * sit where Dhivehi wants the figure rather than where English put it — the
 * counts in `strategies.responded`, `panel.summary` and `basket.launcherAria`
 * all come out in a different order from their English counterparts, which is
 * the reason those sentences are single strings rather than concatenated
 * fragments.
 *
 * Latin digits throughout: Dhivehi is written with the same 0–9 the English
 * copy uses, so figures need no transliteration and `fmt()` in `lib/plan.ts`
 * groups them identically in both languages.
 */
export const dv: Dictionary = {
  common: {
    skipToContent: 'މައިގަނޑު ބަޔަށް ދާން',
    languageLabel: 'ބަސް',
    listSeparator: '، ',
  },

  header: {
    navLabel: 'މައި މެނޫ',
    homeAria: '{title} ގެ މައި ޞަފްޙާ',
    thePlan: 'ޕްލޭން',
    twelveGoals: 'ބާރަ ލަނޑުދަނޑި',
    initiatives: 'އިސްނެގުންތައް',
    haveYourSay: 'ޚިޔާލު ފާޅުކުރައްވާ',
  },

  hero: {
    imageAlt: 'އައްޑޫގެ މަތިން ދަތުރުކުރާ ދޮންދޫންޏެއް — ހަމައެކަނި މިތަނުން ފެންނަ ދޫންޏެއް.',
    exploreGoals: 'ބާރަ ލަނޑުދަނޑި ބައްލަވާ',
    startReading: 'ކިޔަން ފައްޓަވާ',
  },

  home: {
    geographyTitle: 'އެއް އަތޮޅު، ހަތަރު ރަށް، އެއް ސިޓީ',
    geographyBody:
      'ލިންކް ރޯޑު ހުޅަނގު ފަރާތުގެ ރަށްތަކުގެ ދިގަށް ދަތުރުކޮށް، ހަތަރު ރަށް ކޮޅުން ކޮޅަށް ގުޅުވާލަދެއެވެ. އައްޑޫ ހަތަރު ރަށަކަށް ވުމުގެ ބަދަލުގައި އެއް ސިޓީއަކަށް ވަނީ އެހެންވެގެންނެވެ.',
    islandsLabel: 'ސިޓީގެ ރަށްތައް',

    gapSentence: 'މީހުން އައްޑޫގައި ރަޖިސްޓަރީވެފައިވީ ނަމަވެސް ދިރިއުޅެނީ އެހެން ތަނެއްގައެވެ.',
    gapTarget:
      '1977 ވަނަ އަހަރު މި ފަރަގަކީ 705 މީހުންނެވެ. 2030 ވަނަ އަހަރު އަންނަން ވާއިރަށް އައްޑޫގައި 35,000 މީހުން ދިރިއުޅުމަކީ މި ޕްލޭނުގެ އަމާޒެވެ.',
    sourcesLine: '{year} ގައި: ރަޖިސްޓަރީގައި {registered}',
    sourcesResident: 'މިތާ ދިރިއުޅެނީ {resident}',
    backgroundLink: 'އާބާދުވުމުގެ ތާރީޚާއި އަހަރުން އަހަރަށް ގުނުންތައް',

    visionResidents: 'ރައްޔިތުން، 2030 ވަނަ އަހަރަށް',

    goalsTitle: 'ބާރަ ލަނޑުދަނޑި',
    goalsBody:
      'ކުރިމަތިލުމުގެ ބާރު ލިބިފައިވާ، އެންމެން ޝާމިލުވާ، ދެމެހެއްޓެނިވި އައްޑޫއެއްގެ ތަސައްވުރު އުފުލަނީ ބާރަ ލަނޑުދަނޑިއެވެ. ކޮންމެ ލަނޑުދަނޑިއެއް ހުޅުއްވައި، އޭގެ އަމާޒުތައް ކިޔުއްވައި، ކޮންމެ ޢަމަލަކަށް ކޮމެންޓް ދެއްވާ.',

    feedbackTitle: 'ބަދަލުކުރަންވީ ކޮން ކަމެއްކަން ބުނެދެއްވާ.',
    feedbackBody:
      'މި ޕްލޭނުގައިވާ {count} ޢަމަލުގެ ތެރެއިން ކޮންމެ ޢަމަލަކަށް ޖަވާބެއް ދެއްވެއެވެ — ތާއީދުކުރައްވާ، ޔަޤީން ނުވާކަމަށް ބުނުއްވާ، ނުވަތަ ކަންބޮޑުވުމެއް ފާޅުކުރައްވާ. އަދި ސަބަބު ބަޔާންކުރައްވަން ބޭނުންފުޅުނަމަ ކޮމެންޓެއް ލިޔުއްވާ. ދެއްވާ ޖަވާބުތައް އަމިއްލައަށް ފޮނުވެމުންދާނެއެވެ.',
    startWithGoalOne: 'ފައްޓަވާނީ ލަނޑުދަނޑި 1 ން',
  },

  goal: {
    metaTitle: 'ލަނޑުދަނޑި {number}: {title}',
    backToGoals: 'ލަނޑުދަނޑިތަކަށް އެނބުރި',
    counter: '{total} ލަނޑުދަނޑީގެ ތެރެއިން {number} ވަނަ',
    whyThisMatters: 'މިކަން މުހިންމުވަނީ ކީއްވެ',
    whereWeAreToday: 'މިއަދު ތިބި ހިސާބު',
    targets: 'އަމާޒުތައް',
    targetLabel: 'އަމާޒު {label}',
    strategiesAndActions: 'ސްޓްރެޓަޖީތަކާއި ޢަމަލުތައް',
    strategiesBody:
      'ތިރީގައިވާ ކޮންމެ ޢަމަލަކާ މެދު ދެކެވަޑައިގަންނަވާ ގޮތް ބުނެދެއްވާ. ރިއެކްޓްކުރައްވަން އެއް ފިތުމެއް، އަދި ސަބަބު ބަޔާންކުރައްވަން ބޭނުންފުޅުނަމަ ކޮމެންޓް ފޮށްޓެއް.',
    stillOpen: 'އަދިވެސް ނުނިމޭ: ',
    otherGoalsLabel: 'އެހެން ލަނޑުދަނޑިތައް',
    nextGoal: 'ދެން އޮތް ލަނޑުދަނޑި',
    previousGoal: 'ކުރީގެ ލަނޑުދަނޑި',
  },

  goalCard: {
    goalNumber: 'ލަނޑުދަނޑި {number}',
    counts: '{strategies} ސްޓްރެޓަޖީ · {actions} ޢަމަލު',
    noStrategies: 'އަދި ސްޓްރެޓަޖީއެއް ޝާއިޢުކޮށްފައެއް ނުވޭ',
  },

  strategies: {
    notPublished:
      'މި ލަނޑުދަނޑީގެ ސްޓްރެޓަޖީތައް އަދި ޝާއިޢުކޮށްފައެއް ނުވެއެވެ. ޝާއިޢުކުރެވުމާއެކު، ކޮންމެ ޢަމަލަކަށް ޖަވާބު ދެއްވޭ ގޮތަށް، މިތަނުގައި ފެންނާނެއެވެ.',
    responded: 'ޖަވާބު ދެއްވާފައިވަނީ {total} ޢަމަލުގެ ތެރެއިން {answered} ޢަމަލަށް',
    progressAria: 'ލަނޑުދަނޑި {number} ގައި ޖަވާބު ދެއްވާފައިވާ ޢަމަލުތައް',
    strategyPrefix: 'ސްޓްރެޓަޖީ {number}: ',
  },

  reactions: {
    supportLabel: 'މިކަމަށް ތާއީދުކުރަން',
    supportShort: 'ތާއީދު',
    unsureLabel: 'ޔަޤީނެއް ނޫން',
    unsureShort: 'ޔަޤީނެއް ނޫން',
    concernLabel: 'ކަންބޮޑުވުމެއް އެބައޮތް',
    concernShort: 'ކަންބޮޑުވުން',
  },

  control: {
    reactionAria: '{label}: {subject}',
    comment: 'ކޮމެންޓް',
    commentAdded: 'ކޮމެންޓް އިތުރުކުރެވިއްޖެ',
    addCommentAria: 'މިއަށް ކޮމެންޓެއް އިތުރުކުރައްވާ: {subject}',
    editCommentAria: 'މިއަށް ދެއްވި ކޮމެންޓް އުނިއިތުރު ގެންނަވާ: {subject}',
    notPostedSuffix: ' — އަދި ފޮނުވާފައެއް ނުވޭ',
    yourCommentOn: 'މިއަށް ތިޔަ ދެއްވާ ކޮމެންޓް: {subject}',
    placeholder: 'ބަދަލުކުރައްވާނީ، އިތުރުކުރައްވާނީ، ނުވަތަ ކަންބޮޑުވެވަޑައިގަންނަވަނީ ކޮން ކަމަކާ؟',
    clearedHereOnly: 'ސާފުކުރެވުނީ ހަމައެކަނި މިތަނުން — ޚިޔާލުތަކުން ނަގާލަން ބޭނުންކުރައްވާނީ "ނަގާލާ"',
    postedWithFeedback: 'ތިޔަ ޚިޔާލާއެކު ފޮނުވިއްޖެ',
    remove: 'ނަގާލާ',
    removeCommentAria: 'މިއަށް ދެއްވި ކޮމެންޓް ނަގާލައްވާ: {subject}',
    post: 'ފޮނުވާ',
    update: 'އަޕްޑޭޓް',
    postCommentAria: 'މިއަށް ކޮމެންޓް ފޮނުއްވާ: {subject}',
    updateCommentAria: 'މިއަށް ދެއްވި ކޮމެންޓް އަޕްޑޭޓްކުރައްވާ: {subject}',
  },

  planComment: {
    title: 'ޕްލޭނާ މެދު ޖުމްލަކޮށް',
    placeholder: 'ޕްލޭނާ މެދު ޖުމްލަކޮށް ކައުންސިލަށް އެނގެންވީ ކޮން ކަމެއް؟',
  },

  basket: {
    review: 'ބައްލަވާ',
    sending: 'ފޮނުވަނީ',
    sent: 'ފޮނުވިއްޖެ',
    notSent: 'ނުފޮނުވޭ',
    launcherAria:
      'ތިޔަ ޚިޔާލު: {goals} ލަނޑުދަނޑީގެ ތެރެއިން {started} ލަނޑުދަނޑިއެއްގައި، {total} ޢަމަލުގެ ތެރެއިން {count} ޢަމަލަށް ޖަވާބު ދެއްވިއްޖެ{overall} — {state}. ބައްލަވަން ހުޅުއްވާ.',
    overallClause: '، އަދި ޕްލޭނާ މެދު ޖުމްލަކޮށް ކޮމެންޓެއް',
    stateSent: 'ކައުންސިލަށް ފޮނުވިއްޖެ',
    stateNotSent: 'އަދި ނުފޮނުވޭ',
    stateSending: 'ފޮނުވަނީ',
    overallTitle: 'ޕްލޭނާ މެދު ޖުމްލަކޮށް ތިޔަ ދެއްވި ކޮމެންޓް',
    goalTitle: 'ލަނޑުދަނޑި {number}: {title}',
  },

  panel: {
    dialogLabel: 'ޕްލޭނާ މެދު ތިޔަ ދެއްވި ޚިޔާލު',
    title: 'ތިޔަ ޚިޔާލު',
    summary: '{total} ޢަމަލުގެ ތެރެއިން {count} · {goals} ލަނޑުދަނޑީގެ ތެރެއިން {started} ފެށިއްޖެ',
    close: 'ބަންދުކުރައްވާ',
    planAsWhole: 'ޕްލޭން ޖުމްލަކޮށް',
    removeOverallAria: 'ޕްލޭނާ މެދު ޖުމްލަކޮށް ދެއްވި ކޮމެންޓް ނަގާލައްވާ',
    changeWhatYouSaid: 'ވިދާޅުވި އެއްޗެއް ބަދަލުކުރައްވާ',
    sayAboutPlan: 'ޕްލޭނާ މެދު އެއްޗެއް ވިދާޅުވޭ',
    showAnswersAria: 'ލަނޑުދަނޑި {number} ގައި ދެއްވި {count} {noun} ދައްކަވާ',
    hideAnswersAria: 'ލަނޑުދަނޑި {number} ގައި ދެއްވި {count} {noun} ފޮރުއްވާ',
    answerOne: 'ޖަވާބު',
    answerOther: 'ޖަވާބު',
    startGoalAria: 'ލަނޑުދަނޑި {number} ފައްޓަވާ: {title}',
    removeFeedbackAria: 'މިއަށް ދެއްވި ޚިޔާލު ނަގާލައްވާ: {label}',
    answerRemaining: 'ބާކީ {count} ޢަމަލަށް ޖަވާބު ދެއްވާ',
    openThisGoal: 'މި ލަނޑުދަނޑި ހުޅުއްވާ',

    statusSending: 'ފޮނުވަނީ…',
    statusSendingShortly: 'އިރުކޮޅެއްގެ ތެރޭގައި ފޮނުވޭނެ',
    statusNotSent: 'އަދި ނުފޮނުވޭ. ތިޔަ ޖަވާބުތައް ވަނީ މި ޑިވައިސްގައި ރައްކާކުރެވިފައެވެ.',
    statusSentAt: 'ފޮނުވުނީ {time} ގައި',
    statusUpdatedAt: 'އަޕްޑޭޓްކުރެވުނީ {time} ގައި',
    statusSent: 'ފޮނުވިއްޖެ',
    statusUpdated: 'އަޕްޑޭޓްކުރެވިއްޖެ',
    statusIdle: 'ތިޔަ ޖަވާބުތައް އަމިއްލައަށް ފޮނުވެމުންދާނެ',
    tryAgainNow: 'މިހާރު އަލުން މަސައްކަތްކުރައްވާ',
    sendNow: 'މިހާރު ފޮނުއްވާ',

    sentAnonymously: 'ނަން ނުޖަހާ ފޮނުވޭ',
    downloadCopy: 'ކޮޕީއެއް ޑައުންލޯޑްކުރައްވާ',
    deleteMyFeedback: 'އަހަރެންގެ ޚިޔާލު ފޮހެލާ',

    confirmTitle: 'ތިޔަ ޚިޔާލު ފޮހެލަންތޯ؟',
    confirmBody:
      'މިއީ ކޮންސަލްޓޭޝަނުން {count} {noun} އަނބުރާ ނަގައި، މި ޑިވައިސްއިން ފޮހެލުމެވެ. ކައުންސިލުގެ އަތުގައި ދެން އެ ޖަވާބުތައް ނުހުންނާނެއެވެ. އަދި މިކަން އަނބުރާ ނުގެނެވޭނެއެވެ.',
    responseOne: 'ޖަވާބު',
    responseOther: 'ޖަވާބު',
    keepMyFeedback: 'އަހަރެންގެ ޚިޔާލު ބަހައްޓާ',
    deleting: 'ފޮހެލަނީ…',
    deleteEverything: 'ހުރިހާ އެއްޗެއް ފޮހެލާ',
  },

  errors: {
    sendOffline:
      'ތިޔަ ޚިޔާލު އަދި އަޅުގަނޑުމެންނާ ހަމައަށް ނުފޯރައެވެ — ކަނެކްޝަން ކެނޑިއްޖެއެވެ. ތިޔަ ޖަވާބުތައް މި ޑިވައިސްގައި ރައްކާކުރެވިފައިވާއިރު، އަޅުގަނޑުމެން މަސައްކަތްކުރަމުން ދާނަމެވެ.',
    sendFailed:
      'ތިޔަ ޚިޔާލު ފޮނުވޭ ގޮތެއް ނުވިއެވެ. ތިޔަ ޖަވާބުތައް އަދިވެސް މި ޑިވައިސްގައި އެބަހުއްޓެވެ — އަލުން މަސައްކަތްކުރައްވާ.',
    withdrawFailed:
      'ތިޔަ ޚިޔާލު އަނބުރާ ނެގޭ ގޮތެއް ނުވިއެވެ. އެއްވެސް އެއްޗެއް ބަދަލެއް ނުވެއެވެ — އަލުން މަސައްކަތްކުރައްވާ.',
    withdrawOffline:
      'ތިޔަ ޚިޔާލު އަނބުރާ ނެގޭ ގޮތެއް ނުވިއެވެ — ކަނެކްޝަން ކެނޑިއްޖެއެވެ. އެއްވެސް އެއްޗެއް ބަދަލު ނުވާތީ، އަލުން މަސައްކަތްކުރެއްވިދާނެއެވެ.',
  },

  background: {
    metaTitle: 'އާބާދުވުމާއި އާބާދީ',
    metaDescription:
      'ޕްލޭނުގެ ފަހަތުގައިވާ ރެކޯޑު: 1620 ން ފެށިގެން އައްޑޫގެ މީހުން އާބާދުވެފައިވާ ތަންތަނާއި، 1977 ން 2025 އަށް ރަޖިސްޓަރީވެފައިވާ އަދި ދިރިއުޅޭ އާބާދީގެ ގުނުންތައް.',
    backToPlan: 'ޕްލޭނަށް އެނބުރި',
    title: 'އާބާދުވުމާއި އާބާދީ',
    lede: 'ޕްލޭން ބިނާވެފައިވާ ރެކޯޑު: 1620 ން ފެށިގެން އައްޑޫގެ މީހުން އާބާދުވެފައިވަނީ ކޮންތާކުކަން، އަދި 1977 ން ފެށިގެން މިތާ ރަޖިސްޓަރީވެފައިވާ ޢަދަދާއި މިތާ ދިރިއުޅޭ ޢަދަދު އަޅާކިޔޭ ގޮތެވެ.',

    settlementTitle: 'ބަދަލުކުރެވި، ހުސްކުރެވި، އަލުން ބިނާކުރެވުނު ސިޓީއެއް',
    settlementBody: 'އައްޑޫގެ މީހުން ގާތްގަނޑަކަށް ސަތޭކަ އަހަރު ވަންދެން ރަށުން ރަށަށް ބަދަލުކުރެވެމުން ދިޔައެވެ.',
    settlementRailLabel: 'އާބާދުވުމުގެ ތާރީޚް، 1620 ން 1976 އަށް',

    ledgerTitle: 'ރަޖިސްޓަރީވެފައި މިތާ، ދިރިއުޅެނީ އެހެން ތަނެއްގައި',
    ledgerBody: 'ގުނާފައިވާ ކޮންމެ އަހަރެއް، ސުމަކުން ފެށޭ އެއް މިންގަނޑަކަށް.',
    ledgerYear: 'އަހަރު',
    ledgerLivingElsewhere: 'އެހެން ތަނެއްގައި',
    ledgerOf: 'ރަޖިސްޓަރީވި {registered} ން {resident}',
    ledgerRegistered: 'ރަޖިސްޓަރީވި {registered}',
    ledgerNotCounted: 'އަދި ނުގުނާ',
    ledgerLivingElsewhereSr: ' އެހެން ތަނެއްގައި ދިރިއުޅޭ',
    legendLivingHere: 'މިތާ ދިރިއުޅޭ',
    legendOnRegister: 'ރަޖިސްޓަރީގައި',

    closing:
      'މިކަމާ މެދު ކުރަން ގަސްދުކުރާ ކަންކަން ޕްލޭނުގައި ބަޔާންކޮށްފައިވެއެވެ — އަދި އޭގައިވާ ކޮންމެ ޢަމަލަކަށް ތިޔަ ޖަވާބު ބޭނުންވެއެވެ.',
  },

  timeline: {
    scrollBack: 'ތާރީޚީ ރޮނގު ފަހަތަށް',
    scrollForward: 'ތާރީޚީ ރޮނގު ކުރިއަށް',
  },

  chart: {
    nationalShare: 'ޤައުމީ އާބާދީގެ ހިއްސާ',
    nationalShareYears: '1958–2022',
    chartAria:
      '{subtitle}. އައްޑޫ 1958 ގައި 9% ން 2022 ގައި 5.1% އަށް ދަށްވެފައިވާއިރު، މާލެ 11% ން 40% އަށް މައްޗަށް ގޮސްފައިވެއެވެ.',
    reading:
      'ދިވެހިރާއްޖޭގެ އާބާދީގެ ތެރެއިން އައްޑޫގެ ހިއްސާ 9% ން 5.1% އަށް ދަށްވިއެވެ. މާލޭގެ ހިއްސާ 11% ން 40% އަށް މައްޗަށް ދިޔައެވެ.',
  },

  map: {
    linkRoad: 'ލިންކް ރޯޑު',
    islandOfCity: 'ސިޓީގެ ރަށެއް',
    aria: 'އައްޑޫ އަތޮޅުގެ ޗާޓު. ސިޓީގެ ހަތަރު ރަށް — {islands} — އޮންނަނީ އަތޮޅުގެ ހުޅަނގު ފަރާތުގައި އުތުރުން ދެކުނަށް، ލިންކް ރޯޑުން ކޮޅުން ކޮޅަށް ގުޅިފައެވެ. މި މަގު ކޯޒްވޭތަކުގެ މަތިން ހުޅުވިފައިވާ ކަނޑު ހުރަސްކުރެއެވެ. މަގު ފޭދޫ ފަހަނައަޅައި ދެކުނު-އިރަށް، ސިޓީން ބޭރަށް ދެއެވެ. އަތޮޅުގެ ބާކީ ބަޔަކީ ފަރާއި ފަޅެވެ.',
  },

  footer: {
    allGoalsLabel: 'ހުރިހާ ލަނޑުދަނޑިތައް',
    twelveGoals: 'ބާރަ ލަނޑުދަނޑި',
    behindThePlan: 'ޕްލޭނުގެ ފަހަތުގައި',
    settlementAndPopulation: 'އާބާދުވުމާއި އާބާދީ',
    imprint: '{date} ގައި {author} ޝާއިޢުކޮށްފައި. ކޮންމެ ޢަމަލަކަށް ޖަވާބު ދިނުމަށް ވަކި ތަނެއް ވެއެވެ.',
    openForConsultation: 'ޚިޔާލު ހޯދުމަށް ހުޅުވާލެވިފައި — ތިޔަ ޚިޔާލާއެކު ޢަދަދުތަކާއި އަމާޒުތައް ބަދަލުވެދާނެއެވެ.',
  },

  metadata: {
    description:
      '2030 ވަނަ އަހަރު އަންނަން ވާއިރަށް އައްޑޫ 35,000 މީހުންގެ ދެމެހެއްޓެނިވި، ކުރިމަތިލުމުގެ ބާރު ލިބިފައިވާ، އެންމެން ޝާމިލުވާ ސިޓީއަކަށް ހެދުމަށް ބާރަ ލަނޑުދަނޑި. ޕްލޭން ކިޔުއްވައި، ކޮންމެ ޢަމަލަކާ މެދު ދެކެވަޑައިގަންނަވާ ގޮތް ބުނެދެއްވާ.',
    ogDescription:
      'ދެމެހެއްޓެނިވި އައްޑޫއަކަށް ބާރަ ލަނޑުދަނޑި. ޕްލޭން ކިޔުއްވައި، ކޮންމެ ސްޓްރެޓަޖީއަކަށް ތިޔަ ޚިޔާލު ހިއްސާކުރައްވާ.',
    ogImageAlt:
      'ޕްލޭނުގެ ބޭރުގަނޑު: އައްޑޫ ސިޓީގެ ނިޝާނާއި، އޭގެ ދަށުގައި ޕްލޭނުގެ ނަމާއި އަހަރުތައް، އަދި ފަހަތުގައި ފަނޑުކޮށް އަތޮޅުގެ ސޫރަ.',
  },
}
