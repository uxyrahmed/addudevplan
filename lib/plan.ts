/**
 * Addu Development Plan 2026–2031 — content model.
 *
 * Every string and figure below is transcribed from the council's draft slide
 * deck, now the 16 August draft.
 *
 * That draft changes less than its predecessors. All twelve goals keep their
 * titles, all fifty-five targets are unchanged word for word, and every
 * strategy and action is identical in wording and order. Two goal descriptions
 * were rewritten — goal 3's opens on the import bill now, goal 7's is trimmed
 * of four clauses — and goal 3's figure rail was rebuilt around the national
 * total. Both are noted at the goals themselves. The population ledger, the
 * turning-point passage, the settlement timeline, the pillars paragraph and
 * all ten flagship initiatives carry over untouched.
 *
 * Goal colours are the fill values of the badge plates on that draft's
 * twelve-goals slide, converted out of the Apple RGB profile the deck tags them
 * with into sRGB — read raw they come out muddier than the slide looks, because
 * the deck is colour-managed and a web page is not. The conversion was checked
 * against a control: a colour the deck tags sRGB round-trips through the same
 * pipeline unchanged. Note the palette is four colours cycled down the rows of
 * that slide, so goals three apart share one; it is a layout rhythm, not a
 * statement about which goals belong together.
 *
 * Since the 12 August draft each goal also carries three further slides —
 * Financing, Data and Monitoring and Evaluation. None are carried here: every
 * Financing table is still printed with its cost columns empty, the Monitoring
 * frames have no content at all, and the Data slides list the council's
 * internal GIS layers rather than anything a resident is being consulted on.
 * The Financing tables are useful for one thing only, and only in review: they
 * relist every action of a goal in order, so they are the cross-check that the
 * strategy slides above have been read correctly.
 *
 * Where the source deck is visibly unfinished (placeholder counts, a target
 * numbered twice), the item is omitted here and the goal carries an `openNote`
 * instead — the site would rather say "still open" than publish a wrong figure.
 */

export type Pillar = {
  id: string
  name: string
  /**
   * The deck's own phrase for this pillar, lifted from the sentence in
   * `PILLARS_INTRO.body` that names all five. The one-word `name` is a handle;
   * this is what the deck actually calls it, and it is what the tiles carry —
   * a tile reading "People" tells a reader nothing the heading above it has
   * not already said.
   */
  phrase: string
  /** Plate colour, exactly as printed. */
  color: string
  /**
   * Same hue, darkened until it clears 4.5:1 on the palest ground it is set
   * on. The printed colours are chosen for large filled shapes; three of the
   * four printed ones fail as body text, so anything type-sized uses this
   * instead and the plate keeps the original.
   *
   * "Palest ground" is the point. An earlier pass derived these against white
   * and stopped at the first value that cleared, which left teal at 4.57, sea
   * at 4.55 and olive at 4.52 — no headroom at all. Almost nothing on this
   * site is actually set on white: the goal grid and the footer sit on
   * `--color-shell`, the feedback section on `--color-sand`. On those the same
   * three measured 4.22–4.26 and 3.94–3.98, so the accessible variant was
   * failing everywhere it was used. They are derived against `--color-sand`
   * now, the darkest of the three, and clear it with room to spare.
   */
  textColor: string
}

export type Stat = {
  value: string
  label: string
}

export type Action = {
  /** Stable id — the feedback layer keys on this, so never renumber in place. */
  id: string
  text: string
}

export type Strategy = {
  id: string
  /** Two-digit label as printed in the deck ("01", "02", …). */
  number: string
  title: string
  actions: Action[]
}

export type Target = {
  id: string
  label: string
  text: string
}

export type Goal = {
  number: number
  slug: string
  title: string
  /** Exact fill colour used for this goal's badge in the deck. */
  color: string
  /** Accessible variant of `color` for text and small filled controls. */
  textColor: string
  /** Short line for cards and nav. */
  tagline: string
  summary: string
  stats: Stat[]
  targets: Target[]
  strategies: Strategy[]
  openNote?: string
}

export type Initiative = {
  number: string
  title: string
  text: string
}

/* ------------------------------------------------------------------ brand */

export const PLAN = {
  title: 'Addu Development Plan',
  period: '2026–2031',
  author: 'Addu City Council',
  /** Cover slide date. */
  date: '30 July 2026',
  /** The cover slide's own invitation — the reason this site exists. */
  callout: 'For comments and feedback',
} as const

export const VISION = {
  // The deck sets this lowercase and unpunctuated, running straight into the
  // figure beside it. On the page the two are separate blocks, so the fragment
  // read as a sentence that had lost its opening. Capitalised, and the comma
  // marks the join the deck's layout used to make on its own.
  headline: 'Our aim is a multi-cultural hub for young professionals, with',
  figure: '35,000 residents by 2030',
  /** The 12 August draft renamed the vision; it was "Sustainable Addu". */
  name: 'Resilient, Inclusive, Sustainable Addu',
  kicker: 'Addu City Vision',
} as const

/**
 * Rewritten wholesale for the 12 August draft. The earlier text opened on the
 * city's "development trajectory"; this one opens on the day the RAF left, and
 * tells the out-migration story the population ledger further down measures.
 */
export const TURNING_POINT = {
  title: 'Addu is at a turning point',
  /**
   * The deck sets this as one block. On a slide that is a paragraph; on a page
   * it was 300 words without a single break, and it is the passage that has to
   * explain why the plan exists at all.
   *
   * Broken at the four turns the sentences already make — what happened, what
   * eased it, where the city stands today, and why that is a foundation. Not a
   * word is changed, added or dropped: the breaks fall between the source's own
   * sentences.
   */
  paragraphs: [
    `Nearly fifty years after the final RAF flight departed Gan on 29 March 1976, Addu has come full circle — from a community profoundly affected by the British military withdrawal and decades of outward migration to a growing city poised to become the gateway to the Southern Maldives.`,
    `In the years that followed, many residents left Addu for employment in the rapidly expanding Maldives' tourism industry, pursue secondary and higher education, and establish careers in Malé. This sustained outward migration began to ease with the establishment of quality secondary education in Addu and continued investment in healthcare, infrastructure, and economic development, enabling more people to live, study, work, and build their futures closer to home.`,
    `Today, with a land area of more than 1,250 hectares, a population exceeding 25,000, and expanding opportunities in tourism, trade, fisheries, agriculture, and emerging industries, Addu is increasingly becoming a destination in its own right. More than 1,700 Maldivians from other islands and over 4,700 foreign nationals now reside in the city — together representing around a quarter of its population.`,
    `Its interconnected geography, diverse population, and established urban footprint offer a strong foundation for integrated planning, efficient service delivery, and sustainable growth. Building on these strengths, Addu is well positioned to become a resilient, inclusive, and sustainable city.`,
  ],
} as const

/**
 * Two of these labels used to leave the reader guessing. "Connected
 * communities" counted a different noun to the list of islands directly below
 * it, and next to "50 islands in the atoll" the reader had no way to see that
 * 4 and 50 count the same kind of thing. "Registered people" never said which
 * register.
 */
export const HEADLINE_FACTS: Stat[] = [
  { value: '50', label: 'islands in the atoll' },
  { value: '4', label: 'islands in the city' },
  { value: '1,268', label: 'hectares of land' },
  // 35,558 in the 11 August draft; the 12 August population table revises the
  // 2025 register down to this.
  { value: '35,334', label: 'people on the city register' },
]

/**
 * Land area, per the 29 July draft.
 *
 * That draft replaced the earlier per-island reclamation table with this
 * summary and a map. The two disagree — the 21 July table's reclamation column
 * sums to 271 ha against the 253 ha stated here — so the table is not carried
 * over rather than publish a figure the council has since revised. The atoll
 * map on the home page shows geography for the same reason: the shape of the
 * city is settled, the per-island hectares are not.
 *
 * Stored as numbers so the reclaimed share is derived rather than hand-typed.
 */
export const LAND = {
  totalHa: 1268,
  reclaimedHa: 253,
  unit: 'hectares',
  /**
   * The islands of the city, north to south down the western chain.
   *
   * Four, and only these four — Gan is not part of Addu City, and neither are
   * the other islands on the atoll rim, which the map still draws as reef and
   * uninhabited land. The council corrected this in review; earlier decks
   * listed a wider set.
   *
   * The order is the geography, and it is load-bearing: the map numbers its
   * markers 1–4 from the north and reads the names out of this array by index,
   * so reordering it renames the map.
   */
  islands: ['Hithadhoo', 'Maradhoo', 'Maradhoo-Feydhoo', 'Feydhoo'],
} as const

/**
 * Reclamation is deliberately not charted on the home page.
 *
 * It is not a plan action — across all twelve goals the word appears once, and
 * there it means reclaimed *wastewater*. The figure is also the least settled
 * one in this block: the 21 July per-island table sums to 271 ha against the
 * 253 ha above. A fact that nothing is being consulted on, and that the source
 * has not finished revising, should not be the loudest thing in the geography
 * section.
 *
 * `LAND.reclaimedHa` is kept as recorded source data — this file's job is to
 * say what the draft says — but nothing on the site reads it.
 */

/**
 * Settlement history, from the timeline on slide 3 of the 29 July draft.
 * Explains why the city is shaped the way it is — and why so many people left.
 */
export const TIMELINE: { year: string; text: string }[] = [
  { year: '1620–1648', text: 'King Imaadudeen I establishes the present Hithadhoo settlement.' },
  { year: '1799', text: 'Hankede abandoned and people settle in Maradhoo.' },
  {
    year: '1941',
    text: "150 British Marines arrive in Villingili. The residents of Villingili transferred to Magu'dhoo, Huvadhoo Atoll.",
  },
  {
    year: '1942',
    text: 'Royal Marine Engineers arrive in Gan. Residents of Gan and Feydhoo moved to Maamendhoo. Three runways constructed in Gan.',
  },
  { year: '1945', text: 'British forces leave Addu.' },
  { year: '1948', text: 'Residents of Gan and Feydhoo return back home.' },
  // The 12 August draft's box for this year ends "…Feydhoo to Maradhoo", losing
  // the "-Feydhoo" earlier drafts carried. Read as a text-box truncation rather
  // than a correction: Maradhoo-Feydhoo is the island this move created, and it
  // is one of the four the city is built from.
  {
    year: '1957',
    text: 'British begin construction of military base in Gan. Relocation of residents of Gan to Feydhoo, and of Feydhoo to Maradhoo-Feydhoo.',
  },
  { year: '1960', text: 'British granted 30 year lease for Gan and Maamendhoo.' },
  { year: '1976', text: 'British troops leave Gan.' },
]

export type PopulationYear = {
  year: number
  registered: number
  /**
   * Everyone living in Addu, Maldivian and foreign. Absent for 2025, where the
   * draft prints a register count and no resident count.
   */
  resident?: number
  /** Resident Maldivians, where the draft splits the resident total. */
  maldivians?: number
  /** Resident foreign nationals, same. */
  foreigners?: number
}

/** A year the draft measured on both sides, so a gap can be taken from it. */
export type MeasuredYear = PopulationYear & { resident: number }

/**
 * Registered against resident population. Structured rather than pre-formatted
 * strings so the gap is always derived, never hand-typed — a transcription slip
 * in the most important number on the page would be invisible otherwise.
 *
 * Rebuilt from the 12 August draft, which replaced the five-row table with ten
 * rows and split the resident count into Maldivians and foreign nationals. That
 * split resolves a long-standing ambiguity rather than merely adding detail:
 * what earlier drafts labelled "resident" turns out to have been resident
 * Maldivians only, so every row from 2006 on now carries a larger resident
 * total than this file used to publish. 2014 moves 19,319 → 21,275 and 2022
 * 20,343 → 25,062, and both of those figures reappear here in the `maldivians`
 * column, which is what makes the reading safe rather than a guess. The 2022 and
 * 2025 register counts were revised down at the same time.
 */
export const POPULATION: PopulationYear[] = [
  { year: 1977, registered: 14799, resident: 14094 },
  { year: 1985, registered: 18143, resident: 14957 },
  { year: 1990, registered: 20818, resident: 15177 },
  { year: 1995, registered: 23835, resident: 18004 },
  { year: 2000, registered: 25184, resident: 18515 },
  { year: 2006, registered: 29020, resident: 18026, maldivians: 17862 },
  { year: 2014, registered: 32057, resident: 21275, maldivians: 19319, foreigners: 1956 },
  { year: 2022, registered: 34772, resident: 25062, maldivians: 20343, foreigners: 4719 },
  // The register is current to 2025; no resident count is published against it.
  { year: 2025, registered: 35334 },
]

/**
 * The last row of the draft's table: 2030, stated as a composition rather than
 * a single figure. It is the vision target, not a measurement, so it is kept
 * out of `POPULATION` — the ledger charts what happened.
 */
export const POPULATION_2030 = {
  year: 2030,
  resident: 35000,
  maldivians: 25000,
  foreigners: 10000,
} as const

export const isMeasured = (row: PopulationYear): row is MeasuredYear => row.resident != null

/** The years that can carry a gap — everything except the register-only 2025. */
export const MEASURED_POPULATION = POPULATION.filter(isMeasured)

/** The most recent year measured on both sides. */
export const LATEST_POPULATION = MEASURED_POPULATION[MEASURED_POPULATION.length - 1]

/** The most recent register count, whether or not a resident count matches it. */
export const LATEST_REGISTER = POPULATION[POPULATION.length - 1]

/** Everything in the ledger is drawn against one honest scale, starting at 0. */
export const POPULATION_SCALE_MAX = 37000

/** The plan's own target, from the vision slide. */
export const TARGET_RESIDENTS = 35000

export const gapOf = (row: MeasuredYear) => row.registered - row.resident
export const fmt = (n: number) => n.toLocaleString('en-US')

/**
 * Where the last measured year sits on a 0 → 35,000 scale. Derived, so a
 * revised count or target moves the figure rather than silently lying.
 */
export const VISION_TODAY_PCT = `${((LATEST_POPULATION.resident / TARGET_RESIDENTS) * 100).toFixed(1)}%`

/** Share of the national population, 1958–2022. The out-migration story. */
export const MIGRATION_SERIES = {
  title: 'High out-migration since 1976',
  subtitle: 'Resident population as a share of the Maldives population',
  years: [1958, 1963, 1966, 1974, 1977, 1985, 1990, 1995, 2000, 2006, 2014, 2022],
  series: [
    { name: 'Addu', color: '#004D80', values: [9, 9.4, 10.5, 9.9, 8.2, 7.4, 7.1, 7.4, 6.9, 6, 5.6, 5.1] },
    { name: "Male'", color: '#4E5461', values: [11, 11, 11, 13, 21, 26, 26, 26, 27, 35, 38, 40] },
  ],
} as const

/**
 * The prose has caught up. Earlier drafts headed this slide "Five
 * interconnected pillars" over a paragraph that still listed the original four,
 * and this file supplied the missing governance clause itself. The 12 August
 * draft writes it out — "and good governance grounded in trust, respect, and
 * strong leadership" — so every word below is now the deck's own.
 */
export const PILLARS_INTRO = {
  title: 'Five interconnected pillars',
  body: `What distinguishes the Addu Development Plan is its integrated, systems-based approach. Rather than presenting a collection of standalone projects, it sets out a coherent model for transformation built on five interconnected pillars: modern smart infrastructure, empowered people, a diversified thriving economy, a rich natural environment, and good governance grounded in trust, respect, and strong leadership. Together, these pillars provide a clear and credible foundation for Addu's future as a resilient, inclusive and sustainable city.`,
} as const

/**
 * The five pillars, named and coloured as the 5 August deck draws them.
 *
 * The deck has caught up: it now sets all five as a honeycomb of filled
 * hexagons, Governance included, so the placeholder label and colour this site
 * used to carry for it are gone. Colours are sampled from those hexagons —
 * they are gradient plates, so each is the dominant tone rather than a stated
 * value.
 *
 * `textColor` is the same hue darkened until it clears 4.5:1 on white. Four of
 * the five are already dark enough to double as type; only Infrastructure's
 * orange needed taking down.
 *
 * Ordered as `PILLARS_INTRO.body` names them: infrastructure, people, economy,
 * environment, governance. The paragraph and the tiles sit one directly above
 * the other on the page and used to disagree — the tiles ran governance third
 * against a sentence that ran it last.
 *
 * NOTE: the draft still does not state which goals sit under which pillar, so
 * this site deliberately does not assert a mapping — and the goal colours are
 * no longer evidence for one. The 12 August draft gives the goals their own
 * four-colour palette, unrelated to these five hues, and cycles it down the
 * rows of the contents slide, so goals 1, 5 and 9 share a colour by virtue of
 * sitting in the same row. Add a `goals: number[]` field here once the council
 * confirms the real grouping.
 */
export const PILLARS: Pillar[] = [
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    phrase: 'Modern smart infrastructure',
    color: '#DC5818',
    textColor: '#C04E14',
  },
  {
    id: 'people',
    name: 'People',
    phrase: 'Empowered people',
    color: '#350F4D',
    textColor: '#350F4D',
  },
  {
    id: 'economy',
    name: 'Economy',
    phrase: 'A diversified economy',
    color: '#082767',
    textColor: '#082767',
  },
  {
    id: 'environment',
    name: 'Environment',
    phrase: 'A rich natural environment',
    color: '#0A5857',
    textColor: '#0A5857',
  },
  {
    id: 'governance',
    name: 'Governance',
    phrase: 'Good governance',
    color: '#3C6C0F',
    textColor: '#3C6C0F',
  },
]

/* ------------------------------------------------------------------ goals */

export const GOALS: Goal[] = [
  {
    number: 1,
    slug: 'energy-security',
    title: 'Ensure energy security',
    color: '#2FB2B5',
    textColor: '#1F7879',
    tagline: 'Every home a renewable energy producer',
    summary: `Addu generates 68,431,692 kWh of electricity annually to serve 7,389 connections, comprising 5,693 domestic, 1,455 business, and 241 institutional customers. The city's heavy reliance on imported diesel to meet this demand leaves households, businesses, and public services vulnerable to rising fuel costs, global market volatility, and supply disruptions. Frequent power outages caused by generation and network capacity constraints further underline the urgent need for a more reliable, resilient, and diversified energy system. With its abundant solar resources, Addu has exceptional potential to become a renewable-energy prosumer city, where households, businesses, and institutions generate, store, consume, and share clean electricity. The widespread adoption of solar PV and battery storage offers a practical and scalable pathway towards achieving this transition.`,
    stats: [
      { value: '16.2 kWh', label: 'per day average household consumption' },
      { value: '18.7 million', label: 'litres of diesel per year' },
      { value: '130 million', label: 'MVR to buy diesel per year' },
      { value: '71.4 million', label: 'MVR subsidy per year' },
      { value: '35,351 MVR', label: 'per year for each household' },
    ],
    targets: [
      { id: 'g1-t1', label: '1.1', text: 'Transform 85% of homes to renewable energy producers by 2028.' },
      { id: 'g1-t2', label: '1.2', text: 'Enable 75% of businesses to install rooftop solar PV and participate in virtual power plants by 2028.' },
      { id: 'g1-t3', label: '1.3', text: "Equip 100% of government buildings with rooftop solar PV and battery storage, integrating them into Addu's virtual power plant network by 2028." },
    ],
    strategies: [
      {
        id: 'g1-s1',
        number: '01',
        title: 'Every home is a prosumer',
        actions: [
          { id: 'g1-s1-a1', text: 'Provide 10 kWp solar PV and 15 kWh battery to homes' },
          { id: 'g1-s1-a2', text: 'Provide smart meters to homes' },
          { id: 'g1-s1-a3', text: 'Organise financing for prosumer model' },
        ],
      },
      {
        id: 'g1-s2',
        number: '02',
        title: 'All entities as producers',
        actions: [
          { id: 'g1-s2-a1', text: 'Establish solar PV and battery storage in public buildings' },
          { id: 'g1-s2-a2', text: 'Enable solar PV and battery storage in businesses' },
          { id: 'g1-s2-a3', text: 'Launch Virtual Power Plants' },
        ],
      },
      {
        id: 'g1-s3',
        number: '03',
        title: 'Backup diesel hybrid system',
        actions: [
          { id: 'g1-s3-a1', text: 'Procure 30 MW capacity diesel generators' },
          { id: 'g1-s3-a2', text: 'Upgrade existing grid to a smart grid' },
          { id: 'g1-s3-a3', text: 'Establish utility scale renewable energy systems' },
          { id: 'g1-s3-a4', text: 'Invest in battery storage to stabilise grid' },
        ],
      },
    ],
  },
  {
    number: 2,
    // Slug stays `water-security`, and deliberately: it is in published URLs,
    // the home page's `#goal-` anchors and the badge's view-transition name.
    // The deck renaming a heading is not a reason to break a link.
    slug: 'water-security',
    // The 12 August draft was mid-rename here: this goal's own slide read
    // "Safe diverse water sources" while the twelve-goals contents slide still
    // read "Ensure water security". This site followed the goal's own slide,
    // and the 16 August draft has settled it that way — both slides now read
    // "Safe diverse water sources".
    title: 'Safe diverse water sources',
    color: '#82357E',
    textColor: '#82357E',
    tagline: 'Renewables-powered desalination and rainwater for all',
    summary: `Addu will secure its long-term water supply through five diversified sources — desalination, household and community-scale rainwater harvesting, responsibly managed groundwater, reclaimed wastewater, and mineralised bottled water. Solar PV and battery storage will support reliable desalination. Expanded rainwater systems will capture and store rainfall for domestic and public use, while carefully managed groundwater will provide a dedicated supply for gardening and landscaping. Expanded sewerage networks and advanced wastewater treatment will enable reclaimed water to be used safely for agriculture, irrigation, landscaping, and other non-potable purposes. Addu will also support the local production of mineralised drinking water in reusable glass bottles and large-volume containers for homes, restaurants, hotels, offices, and other businesses.`,
    stats: [
      { value: '35,000', label: 'residents' },
      { value: '85 litres', label: 'of water per person per day' },
      { value: '3,000 cbm', label: 'of potable water per day' },
      { value: '4 kWh', label: 'to produce a cbm of desalinated water' },
      { value: '12,000 kWh', label: 'needed per day to produce water' },
    ],
    targets: [
      { id: 'g2-t1', label: '2.1', text: 'Produce 3,000 cbm of desalinated water per day using renewable energy by 2028.' },
      { id: 'g2-t2', label: '2.2', text: 'Equip all homes with safe rainwater collection and storage tanks.' },
      { id: 'g2-t3', label: '2.3', text: 'Enable whole-house water filtration in homes by 2028.' },
      { id: 'g2-t4', label: '2.4', text: "Maintain or improve groundwater quality in at least 90% of Addu City's monitoring stations, with no significant increase in salinity, nitrate, or faecal contamination from the 2026 baseline." },
      { id: 'g2-t5', label: '2.5', text: 'Achieve universal sewerage coverage for all households by 2028.' },
      // The 11 August draft broke off before naming a year here, so this site
      // withheld the target and said so. The 12 August draft finishes it.
      { id: 'g2-t6', label: '2.6', text: 'Increase proportion of households who reuse wastewater to 25% by 2030.' },
    ],
    strategies: [
      {
        id: 'g2-s1',
        number: '01',
        title: 'Renewables powered desalination',
        actions: [
          { id: 'g2-s1-a1', text: 'Increase desalination capacity to 3,000 cbm/day' },
          { id: 'g2-s1-a2', text: 'Install 3 MWp solar PV for water production' },
          { id: 'g2-s1-a3', text: 'Install 8 MWh battery storage for water production' },
          { id: 'g2-s1-a4', text: 'Establish 6,000 cbm water storage capacity' },
        ],
      },
      {
        id: 'g2-s2',
        number: '02',
        title: 'Rainwater and groundwater harvesting',
        actions: [
          { id: 'g2-s2-a1', text: 'Provide safe rainwater collection tanks to all homes' },
          { id: 'g2-s2-a2', text: 'Enable whole house water filtration for homes' },
          { id: 'g2-s2-a3', text: 'Build community rainwater storage tanks' },
          { id: 'g2-s2-a4', text: 'Develop guidelines for groundwater use and protection' },
        ],
      },
      {
        id: 'g2-s3',
        number: '03',
        title: 'Effective sewage treatment',
        actions: [
          { id: 'g2-s3-a1', text: 'Extend sewerage connection to all homes' },
          { id: 'g2-s3-a2', text: 'Upgrade sewage and wastewater treatment system' },
          { id: 'g2-s3-a3', text: 'Integrate solar PV to sewage treatment' },
          { id: 'g2-s3-a4', text: "Invest in treated water reuse and 'sludge to compost'" },
        ],
      },
    ],
  },
  {
    number: 3,
    slug: 'food-security',
    title: 'Ensure food security',
    color: '#51ACA3',
    textColor: '#387770',
    tagline: 'Grow more at home, land more from the sea',
    // Rewritten and shortened for the 16 August draft. The earlier text opened
    // on food security as a priority and closed on a sentence naming the
    // enabling investments — climate-smart agriculture, testing laboratories,
    // cold storage, a strategic food security fund. This one opens on the
    // import bill and drops that closing sentence entirely.
    //
    // The source reads "positioned for sustainable food production and
    // contribute meaningfully"; the second "to" is restored so the sentence
    // parses.
    summary: `The Maldives imported approximately USD 790.5 million worth of food in 2025, underscoring the country's heavy dependence on external markets while revealing a significant economic opportunity to expand domestic production. Against a backdrop of rising global food prices, supply-chain disruptions, and climate-related shocks, strengthening food security has become a strategic priority for Addu City. With the largest land area among the Maldives' atolls, substantial agricultural potential, productive fisheries, and a growing population, Addu is uniquely positioned for sustainable food production and to contribute meaningfully to national food security.`,
    // Reworked again in the 16 August draft. The 12 August rail was six import
    // categories; this one restores the national total to the head of the
    // column, splits eggs back out of the dairy line, and drops both the dairy
    // and the beverages-and-confectionary categories.
    //
    // Printed order is kept, and it is already sound: the total leads and the
    // five categories descend beneath it. The first row is a total the others
    // are parts of, which is only safe because its label says so — "national
    // food imports" against five category names. Do not retitle it to match
    // their shape.
    stats: [
      { value: 'USD 790.5 million', label: 'national food imports in 2025' },
      { value: 'USD 156.7 million', label: 'meat, seafood and fish' },
      { value: 'USD 106.9 million', label: 'vegetables and root crops' },
      { value: 'USD 106.5 million', label: 'fruits, nuts and seeds' },
      // "staple" in the deck, pluralised to sit with the other category labels.
      { value: 'USD 33.5 million', label: 'staples' },
      { value: 'USD 24.3 million', label: 'eggs' },
    ],
    targets: [
      { id: 'g3-t1', label: '3.1', text: 'Ensure 75% of homes grow 05 types of tropical fruits and 05 vegetables at home by 2028.' },
      { id: 'g3-t2', label: '3.2', text: 'Enable commercial production of 03 fruits and 03 vegetables to supply 30% of the need of the Maldives tourism market by 2030.' },
      { id: 'g3-t3', label: '3.3', text: 'Ensure ice and fuel are available to fishers in Hithadhoo and Maradhoo harbours by 2028.' },
      { id: 'g3-t4', label: '3.4', text: 'Supply at least 50% of Valhomas (smoked fish) and Rihaakuru (fish paste) sold in the Maldives by 2030.' },
      { id: 'g3-t5', label: '3.5', text: 'Produce at least 30,000 eggs per day to meet a minimum of 80% of local household, hospitality, business, and institutional demand.' },
      { id: 'g3-t6', label: '3.6', text: 'Ensure that 100% of food producers, processors, distributors and food-service establishments in Addu City are registered and undergo risk-based inspection.' },
    ],
    strategies: [
      {
        id: 'g3-s1',
        number: '01',
        title: 'Every home a proud grower',
        actions: [
          { id: 'g3-s1-a1', text: 'Establish a nursery and seed bank' },
          { id: 'g3-s1-a2', text: 'Distribute starter kits for households' },
          { id: 'g3-s1-a3', text: 'Launch home gardening app' },
          { id: 'g3-s1-a4', text: "Establish home grower's market" },
        ],
      },
      {
        id: 'g3-s2',
        number: '02',
        title: 'Organic agriculture revival',
        actions: [
          { id: 'g3-s2-a1', text: 'Launch coconut & kurumba cultivation and replanting' },
          { id: 'g3-s2-a2', text: 'Allocate land for banana, breadfruit and yam plantation' },
          { id: 'g3-s2-a3', text: 'Establish orchards for papaya, mango, guava and passionfruit' },
          { id: 'g3-s2-a4', text: 'Establish crop and soil safety monitoring' },
        ],
      },
      {
        id: 'g3-s3',
        number: '03',
        title: 'Technology driven fresh food',
        actions: [
          { id: 'g3-s3-a1', text: 'Develop solar-powered climate-controlled greenhouses' },
          { id: 'g3-s3-a2', text: 'Establish vertical farms with hydroponic and aeroponic tech' },
          { id: 'g3-s3-a3', text: 'Introduce smart precision fertiliser use and irrigation' },
          { id: 'g3-s3-a4', text: 'Introduce drones + AI to track stress, pests and diseases' },
        ],
      },
      {
        id: 'g3-s4',
        number: '04',
        title: 'High quality resilient fisheries',
        actions: [
          { id: 'g3-s4-a1', text: 'Invest in renewables powered ice production' },
          { id: 'g3-s4-a2', text: 'Expand fisheries fuel storage capacity for 03 months' },
          { id: 'g3-s4-a3', text: "Establish quality assurance for 'valhomas' and 'rihaakuru'" },
          { id: 'g3-s4-a4', text: "Brand and promote 'valhomas', 'rihaakuru' and fish products" },
        ],
      },
      {
        id: 'g3-s5',
        number: '05',
        title: 'Fresh eggs every day',
        actions: [
          { id: 'g3-s5-a1', text: 'Build demonstration poultry farms' },
          { id: 'g3-s5-a2', text: 'Establish a PPP for quality feed development' },
          { id: 'g3-s5-a3', text: 'Conduct training on egg handling, storage and quality' },
          { id: 'g3-s5-a4', text: 'Establish a biosecurity and disease management system' },
        ],
      },
      {
        id: 'g3-s6',
        number: '06',
        title: 'Trusted quality local food',
        actions: [
          { id: 'g3-s6-a1', text: 'Establish a food quality laboratory' },
          { id: 'g3-s6-a2', text: 'Establish a food fund to support growers and producers' },
          { id: 'g3-s6-a3', text: 'Register bakers and snack producers' },
          { id: 'g3-s6-a4', text: 'Establish training and certification for food producers' },
        ],
      },
    ],
  },
  {
    number: 4,
    slug: 'future-ready-transport',
    title: 'Future ready transport',
    color: '#9CB854',
    textColor: '#627430',
    tagline: 'Free electric buses every 10 minutes',
    summary: `As incomes continue to rise, vehicle ownership is expected to increase, leading to greater traffic congestion, parking shortages, road safety concerns, and dependence on imported fossil fuels. To avoid becoming a car-dependent city, Addu will adopt a free electric bus service operating every 10 minutes during peak hours, supported by walking and cycling infrastructure and a planned transition to electric vehicles. Complemented by an expanding EV charging network, this strategy will lower transport emissions, reduce fuel imports, improve air quality, and establish Addu as a city for clean, affordable, inclusive and sustainable mobility.`,
    stats: [
      { value: '4,651', label: 'motorcycles — 81% of households own one' },
      { value: '3,099', label: 'cars — 54% of households own one' },
      { value: '13 buses', label: '05 for 50 passengers and 08 for 30 passengers' },
      { value: '2,500', label: 'passengers use buses daily' },
    ],
    targets: [
      { id: 'g4-t1', label: '4.1', text: 'Operate free electric buses every 10 minutes during peak hours by 2028.' },
      { id: 'g4-t2', label: '4.2', text: 'Ensure 50% of motorcycles and cars used in Addu are electric vehicles by 2030.' },
      { id: 'g4-t3', label: '4.3', text: 'Ensure that 100% of homes with vehicle access provide at least one off-street car parking space within the property boundary.' },
      { id: 'g4-t4', label: '4.4', text: 'Develop 36 km of quality roads that meet international standard by 2028.' },
    ],
    strategies: [
      {
        id: 'g4-s1',
        number: '01',
        title: 'Free electric bus service',
        actions: [
          { id: 'g4-s1-a1', text: 'Procure electric buses' },
          { id: 'g4-s1-a2', text: 'Establish solar bus charging stations' },
          { id: 'g4-s1-a3', text: 'Launch an app for bus routes and schedules' },
          { id: 'g4-s1-a4', text: 'Build climate smart next generation bus shelters' },
        ],
      },
      {
        id: 'g4-s2',
        number: '02',
        title: 'Catalyse EV transition',
        actions: [
          { id: 'g4-s2-a1', text: 'Establish solar super charging stations for electric vehicles' },
          { id: 'g4-s2-a2', text: 'Procure electric vehicles for council use' },
          { id: 'g4-s2-a3', text: 'Procure super hybrid pickup trucks for council works' },
          { id: 'g4-s2-a4', text: 'Establish smart battery swapping service for motorcycles' },
        ],
      },
      {
        id: 'g4-s3',
        number: '03',
        title: 'Smart parking',
        actions: [
          { id: 'g4-s3-a1', text: 'Incentivise home garage development' },
          { id: 'g4-s3-a2', text: 'Launch automatic license plate recognition' },
          { id: 'g4-s3-a3', text: 'Establish IoT sensor detection parking slots' },
          { id: 'g4-s3-a4', text: 'Launch a cashless paid parking application' },
        ],
      },
      {
        id: 'g4-s4',
        number: '04',
        title: 'Modern Smart Link Road',
        actions: [
          { id: 'g4-s4-a1', text: 'Upgrade Link Road to modern smart standard' },
          { id: 'g4-s4-a2', text: 'Install international standard road marking' },
          { id: 'g4-s4-a3', text: 'Install digital signage and intelligent vehicle detection' },
          { id: 'g4-s4-a4', text: 'Enable AI assisted traffic management and road safety' },
        ],
      },
    ],
  },
  {
    number: 5,
    slug: 'connect-the-south',
    title: 'Connect the South',
    color: '#2FB2B5',
    textColor: '#1F7879',
    tagline: 'One southern region, connected daily',
    summary: `Reliable connectivity between Addu, Fuvahmulah, and Huvadhoo is fundamental to creating an integrated southern economic region. Daily passenger services will improve access to healthcare, education, and employment for residents, while enabling visitors to travel between the Southern Atolls as a single tourism destination. Daily freight services will ensure the timely movement of medical supplies, laboratory samples, fresh food, fisheries products, e-commerce parcels, and essential goods, while supporting emergency response during disruptions. This target will be delivered through complementary investments to enhance Gan International Airport with new international routes and sustained regional air services, establish drone cargo corridors for time-critical deliveries, and develop a strategic gateway port.`,
    stats: [
      { value: '56,187', label: 'residents' },
      { value: '06 airports', label: '04 in Huvadhoo, 01 in Fuvahmulah' },
      { value: '22', label: 'inhabited islands in four atolls' },
      { value: '11 resorts + 02 hotels', label: 'with 2,865 beds' },
      { value: '72 guesthouses', label: 'with 978 beds' },
    ],
    targets: [
      { id: 'g5-t1', label: '5.1', text: 'Establish direct air connectivity to four international destinations from Addu by 2028.' },
      { id: 'g5-t2', label: '5.2', text: 'Establish daily passenger connectivity between Southern Atolls by 2028.' },
      { id: 'g5-t3', label: '5.3', text: 'Establish daily cargo connectivity between Southern Atolls by 2028.' },
    ],
    strategies: [
      {
        id: 'g5-s1',
        number: '01',
        title: 'Air connectivity',
        actions: [
          { id: 'g5-s1-a1', text: 'Upgrade Gan Airport terminal facilities' },
          { id: 'g5-s1-a2', text: 'Route development for Middle East and East Asia' },
          { id: 'g5-s1-a3', text: 'Sustain daily connectivity to Huvadhoo and Fuvahmulah' },
          { id: 'g5-s1-a4', text: 'Launch seaplane services' },
        ],
      },
      {
        id: 'g5-s2',
        number: '02',
        title: 'Air cargo hub',
        actions: [
          { id: 'g5-s2-a1', text: 'Develop drone corridor and logistics' },
          { id: 'g5-s2-a2', text: 'Establish drone vertiport and vertistops' },
          { id: 'g5-s2-a3', text: 'Facilitate traffic management services for UAS' },
          { id: 'g5-s2-a4', text: 'Expand air cargo cold chain logistics' },
        ],
      },
      {
        id: 'g5-s3',
        number: '03',
        title: 'Strategic gateway port',
        actions: [
          { id: 'g5-s3-a1', text: 'Develop new berth for RoRo and heavy machinery' },
          { id: 'g5-s3-a2', text: 'Establish a container terminal' },
          { id: 'g5-s3-a3', text: 'Establish paved RoRo vehicle yard' },
          { id: 'g5-s3-a4', text: 'Establish machinery and equipment hub' },
        ],
      },
    ],
  },
  {
    number: 6,
    slug: 'diverse-quality-housing',
    title: 'Diverse quality housing',
    color: '#82357E',
    textColor: '#82357E',
    tagline: '350 new homes and 1,000 rental units',
    summary: `Addu City is planning to attract professionals, skilled workers, and returning families. Accelerating housing delivery is essential to attract residents, and we will deliver new sustainable homes for families. To support Addu's transformation into a destination for wellness, education, aviation, and business, we will deliver spacious apartments across low-rise (3-4 storey) apartment buildings, providing high-quality accommodation for professionals and their families. These apartments will feature generous living spaces, lift access, secure parking, and energy-efficient design, offering an attractive lifestyle for professionals, entrepreneurs, and skilled workers. Together with complementary initiatives for affordable rental accommodation and mixed-use neighbourhoods, this goal will create attractive liveable communities.`,
    stats: [
      { value: '5,307', label: 'existing houses' },
      { value: '289', label: 'flats and row houses' },
      { value: '1,051', label: 'land plots released for housing' },
      { value: '275', label: 'housing units under construction' },
      { value: '200', label: 'planned housing units' },
    ],
    targets: [
      { id: 'g6-t1', label: '6.1', text: 'Develop 05 new starter home neighbourhoods by 2030.' },
      { id: 'g6-t2', label: '6.2', text: 'Provide 350 new sustainable homes for families by 2028.' },
      { id: 'g6-t3', label: '6.3', text: 'Develop accommodation for 150 families of professionals by 2028.' },
      { id: 'g6-t4', label: '6.4', text: 'Develop 1,000 high quality rental units by 2030.' },
    ],
    strategies: [
      {
        id: 'g6-s1',
        number: '01',
        title: 'Starter home neighbourhoods',
        actions: [
          { id: 'g6-s1-a1', text: 'Develop starter home neighbourhoods' },
          { id: 'g6-s1-a2', text: 'Build starter homes for young families' },
          { id: 'g6-s1-a3', text: 'Provide First Home Ownership Support' },
          { id: 'g6-s1-a4', text: 'Build display homes' },
        ],
      },
      {
        id: 'g6-s2',
        number: '02',
        title: 'Residences for professionals',
        actions: [
          { id: 'g6-s2-a1', text: 'Develop low rise (3-4 floor) apartment buildings' },
          { id: 'g6-s2-a2', text: 'Build spacious modern apartments' },
          { id: 'g6-s2-a3', text: 'Provide land for 2nd homes' },
          { id: 'g6-s2-a4', text: 'Provide land for private housing investment' },
        ],
      },
      {
        id: 'g6-s3',
        number: '03',
        title: 'Diverse rental accommodation',
        actions: [
          { id: 'g6-s3-a1', text: 'Develop purpose built student residences' },
          { id: 'g6-s3-a2', text: 'Develop serviced apartments for medical visitors' },
          { id: 'g6-s3-a3', text: 'Provide low-rise rental apartments for employees' },
          { id: 'g6-s3-a4', text: 'Integrate cafés, retail and childcare to mixed use precincts' },
        ],
      },
    ],
  },
  {
    number: 7,
    slug: 'connect-community-and-culture',
    title: 'Connect community and culture',
    color: '#51ACA3',
    textColor: '#387770',
    tagline: 'A community centre within a 10-minute walk',
    // Trimmed in the 16 August draft — four cuts, no additions. "safe, shaded
    // walkable streets" loses "safe"; the first paragraph no longer closes on
    // "making Addu City liveable and people-centred"; safeguarding heritage no
    // longer carries "while promoting awareness and participation across
    // generations"; and what is showcased is now "local traditions and
    // stories" rather than "local traditions, stories, and heritage sites".
    summary: `Addu City will foster vibrant, inclusive, and connected communities by creating high-quality public spaces that encourage recreation, social interaction, culture, and healthy living. Through integrated community centres, active waterfronts, attractive parks, and shaded walkable streets, every resident will have easy access to places where people can gather, exercise, learn, celebrate, and build stronger community connections. We will safeguard historical sites, traditions, language, and cultural practices. We will ensure that heritage is respected and sustained as a living part of everyday life and offer authentic, meaningful, and immersive encounters. We will showcase local traditions and stories to create memorable experiences and enable longer stays, repeat visits, and positive word-of-mouth, contributing to sustainable tourism and local economic growth.`,
    stats: [
      { value: '45', label: 'mosques' },
      { value: '14', label: 'gyms (08) and indoor sports halls (06)' },
      { value: '1', label: 'library and art gallery' },
      { value: '356', label: 'retail and wholesale shops' },
      { value: '87', label: "cafés and restaurants" },
    ],
    targets: [
      { id: 'g7-t1', label: '7.1', text: 'Ensure every resident lives within a 10-minute walk of a community centre by 2028.' },
      { id: 'g7-t2', label: '7.2', text: 'Develop a continuous 17 km waterfront promenade from Hithadhoo to Gan by 2030.' },
      { id: 'g7-t3', label: '7.3', text: 'Establish four themed parks by 2028.' },
      { id: 'g7-t4', label: '7.4', text: 'Complete streetscaping of all main roads by 2030.' },
      { id: 'g7-t5', label: '7.5', text: "Increase annual visits to Addu's museums and heritage attractions to 50,000 visitors by 2030." },
      { id: 'g7-t6', label: '7.6', text: 'Host at least 06 major cultural events (traditional arts, crafts, music, and cuisine) annually by 2030.' },
    ],
    strategies: [
      {
        id: 'g7-s1',
        number: '01',
        title: 'Integrated creative community centres',
        actions: [
          { id: 'g7-s1-a1', text: 'Develop childcare services' },
          { id: 'g7-s1-a2', text: 'Build library and games rooms' },
          { id: 'g7-s1-a3', text: 'Develop prayer rooms and counselling rooms' },
          { id: 'g7-s1-a4', text: 'Build community function rooms and quality restrooms' },
        ],
      },
      {
        id: 'g7-s2',
        number: '02',
        title: 'Beach and waterfront lifestyle',
        actions: [
          { id: 'g7-s2-a1', text: 'Develop Feydhoo-Hithadhoo waterfront promenade' },
          { id: 'g7-s2-a2', text: 'Create zones for beach volleyball, football, cricket and tennis' },
          { id: 'g7-s2-a3', text: 'Establish kiosks for kayaks, paddle boards, and sports gear' },
          { id: 'g7-s2-a4', text: 'Develop beach showers, change rooms and fitness decks' },
        ],
      },
      {
        id: 'g7-s3',
        number: '03',
        title: 'Themed parks and green spaces',
        actions: [
          { id: 'g7-s3-a1', text: 'Establish Addu Rose Garden and Botanical Garden' },
          { id: 'g7-s3-a2', text: 'Develop a Kurumba and Coco park' },
          { id: 'g7-s3-a3', text: 'Establish Addu Dheeni and Kokaa park' },
          { id: 'g7-s3-a4', text: 'Develop green parks and outdoor spaces' },
        ],
      },
      {
        id: 'g7-s4',
        number: '04',
        title: 'Shaded walkable streets',
        actions: [
          { id: 'g7-s4-a1', text: 'Plant local shade trees along all major roads' },
          { id: 'g7-s4-a2', text: 'Place flower pots and decorative lighting on lamp posts' },
          { id: 'g7-s4-a3', text: 'Establish smart lighting, wi-fi and security cameras' },
          { id: 'g7-s4-a4', text: 'Develop running, walking and bicycle tracks' },
        ],
      },
      {
        id: 'g7-s5',
        number: '05',
        title: 'Showcase Addu Heritage',
        actions: [
          { id: 'g7-s5-a1', text: 'Establish Addu Museum and World War Memorial' },
          { id: 'g7-s5-a2', text: 'Develop HMS Maarangaa — 21st century Indian Ocean Museum' },
          { id: 'g7-s5-a3', text: 'Develop Astra light and sound museum' },
          { id: 'g7-s5-a4', text: 'Develop Gan Memory Garden' },
        ],
      },
      {
        id: 'g7-s6',
        number: '06',
        title: 'Celebrate living culture',
        actions: [
          { id: 'g7-s6-a1', text: 'Build Fehele Kilhi Cultural Village' },
          { id: 'g7-s6-a2', text: 'Establish Addu dialect standards' },
          { id: 'g7-s6-a3', text: 'Launch Annual Addu Awards' },
          { id: 'g7-s6-a4', text: 'Organise Addu Cultural Festival' },
        ],
      },
    ],
  },
  {
    number: 8,
    slug: 'health-and-well-being',
    title: 'Health and well-being',
    color: '#9CB854',
    textColor: '#627430',
    tagline: 'Comprehensive care within 10 minutes of home',
    summary: `Addu City faces growing health challenges, including rising non-communicable diseases, mental health needs, and the high cost of care and medicines. Strengthening prevention — through cancer screening, nutrition, and active lifestyles — alongside improved mental health support is essential for long-term well-being. Upgrading island health centres into effective primary healthcare providers and positioning Addu Equatorial Hospital as the southern medical hub will improve access and quality of care. Investing in a skilled health workforce and affordable services will ensure a resilient, inclusive, and people-centred health system. There are 561 people in the health workforce in Addu. There are 19 registered pharmacies.`,
    stats: [
      { value: '11', label: 'operational health facilities' },
      { value: '37', label: 'specialist doctors' },
      { value: '25', label: 'medical officers' },
      { value: '147', label: 'nurses' },
      { value: '19', label: 'registered pharmacies' },
    ],
    targets: [
      { id: 'g8-t1', label: '8.1', text: 'Screen 90% of adults for diabetes, hypertension, and priority cancers every two years.' },
      { id: 'g8-t2', label: '8.2', text: 'Establish 50 bed hospitals in Feydhoo and Maradhoo by 2028.' },
      { id: 'g8-t3', label: '8.3', text: 'Ensure 100% of residents have access to comprehensive healthcare within 10 minutes of their home.' },
      { id: 'g8-t4', label: '8.4', text: 'Develop a virtual network of hospitals, clinics, pharmacies and wellness service providers by 2028.' },
    ],
    strategies: [
      {
        id: 'g8-s1',
        number: '01',
        title: 'Active healthy community',
        actions: [
          { id: 'g8-s1-a1', text: 'Develop gyms and fitness centres' },
          { id: 'g8-s1-a2', text: 'Organise group fitness activities and sports events' },
          { id: 'g8-s1-a3', text: 'Conduct nutrition education led by Chefs' },
          { id: 'g8-s1-a4', text: 'Prioritise mosquito and vector control' },
        ],
      },
      {
        id: 'g8-s2',
        number: '02',
        title: 'Cancer prevention and early detection',
        actions: [
          { id: 'g8-s2-a1', text: 'Conduct systemic free screening' },
          { id: 'g8-s2-a2', text: 'Establish a registry to track diagnosis and outcomes' },
          { id: 'g8-s2-a3', text: 'Implement tobacco control and insulin resistance awareness' },
          { id: 'g8-s2-a4', text: 'Conduct food, water and air quality audit and monitoring' },
        ],
      },
      {
        id: 'g8-s3',
        number: '03',
        title: '24/7 mental health support',
        actions: [
          { id: 'g8-s3-a1', text: 'Establish a trained team of counsellors' },
          { id: 'g8-s3-a2', text: 'Create spaces for walk-in counselling services' },
          { id: 'g8-s3-a3', text: 'Conduct training for counsellors and crisis responders' },
          { id: 'g8-s3-a4', text: 'Establish peer and youth ambassador groups' },
        ],
      },
      {
        id: 'g8-s4',
        number: '04',
        title: 'Comprehensive modern care',
        actions: [
          { id: 'g8-s4-a1', text: 'Establish hospitals in Feydhoo and Maradhoo' },
          { id: 'g8-s4-a2', text: 'Expand maternal, child health, and fertility treatment services' },
          { id: 'g8-s4-a3', text: 'Establish a hyperbaric chamber' },
          { id: 'g8-s4-a4', text: 'Establish veterinary care clinic' },
        ],
      },
      {
        id: 'g8-s5',
        number: '05',
        title: 'Smart health services',
        actions: [
          { id: 'g8-s5-a1', text: 'Establish digital appointment management system' },
          { id: 'g8-s5-a2', text: 'Establish digital surveillance for lifestyle diseases' },
          { id: 'g8-s5-a3', text: 'Launch electronic health record system' },
          { id: 'g8-s5-a4', text: 'Promote wearable health devices and digital monitoring' },
        ],
      },
      {
        id: 'g8-s6',
        number: '06',
        title: 'Access to quality pharmaceuticals',
        actions: [
          { id: 'g8-s6-a1', text: 'Develop an Addu Essential Medicine List' },
          { id: 'g8-s6-a2', text: 'Network the public and private pharmacies in region' },
          { id: 'g8-s6-a3', text: 'Enable digital stock monitoring' },
          { id: 'g8-s6-a4', text: 'Integrate tele-pharmacy, e-prescription and home delivery' },
        ],
      },
    ],
  },
  {
    number: 9,
    slug: 'education-excellence',
    title: 'Education excellence',
    color: '#2FB2B5',
    textColor: '#1F7879',
    tagline: '2,000 tertiary students a year by 2030',
    summary: `Education is central to Addu City's future competitiveness, workforce development, and social progress. Strengthening foundational learning through quality early childhood education, upgrading school infrastructure and science labs, and expanding vocational training pathways will align skills with emerging economic opportunities. Building digital capabilities and promoting lifelong learning will ensure adaptability in a rapidly changing world. Together, these investments will create a skilled, innovative, and resilient community.`,
    stats: [
      { value: '12', label: 'schools' },
      { value: '5,284', label: 'school students' },
      { value: '676', label: 'teachers' },
      { value: '05', label: 'universities and colleges' },
    ],
    openNote:
      'Two items on this goal are still unfinished in the 16 August draft: the count of tertiary students is printed as "000", and two different targets are both numbered 9.3. Both are left as the council wrote them rather than guessed at.',
    targets: [
      { id: 'g9-t1', label: '9.1', text: 'Attract over 2,000 tertiary students annually by 2030.' },
      { id: 'g9-t2', label: '9.2', text: 'Introduce a new early childhood curriculum across Addu schools by 2028.' },
      { id: 'g9-t3', label: '9.3', text: "Upgrade 100% of Addu City's schools to provide safe, inclusive, digitally connected and inquiry based learning environments." },
      { id: 'g9-t4', label: '9.3', text: 'Provide lifelong learning opportunities so that at least 25% of adults participate in professional development or skills training.' },
    ],
    strategies: [
      {
        id: 'g9-s1',
        number: '01',
        title: 'Tertiary education excellence',
        actions: [
          { id: 'g9-s1-a1', text: 'Establish Nursing School' },
          { id: 'g9-s1-a2', text: 'Establish a Medical School and internship opportunities' },
          { id: 'g9-s1-a3', text: 'Establish Hotel School and Language School' },
          { id: 'g9-s1-a4', text: 'Expand training for pilots, air traffic control, and cabin crew' },
        ],
      },
      {
        id: 'g9-s2',
        number: '02',
        title: 'Quality early childhood education',
        actions: [
          { id: 'g9-s2-a1', text: 'Develop 06 pre-schools with modern facilities' },
          { id: 'g9-s2-a2', text: 'Build health and nutrition integrated facilities' },
          { id: 'g9-s2-a3', text: 'Develop a value based, inquiry driven new curriculum' },
          { id: 'g9-s2-a4', text: 'Develop outdoor and indoor spaces for play' },
        ],
      },
      {
        id: 'g9-s3',
        number: '03',
        title: 'Modern school infrastructure',
        actions: [
          { id: 'g9-s3-a1', text: 'Equip science labs in schools' },
          { id: 'g9-s3-a2', text: 'Upgrade ICT infrastructure in all schools' },
          { id: 'g9-s3-a3', text: 'Establish swimming pool and water sports facilities' },
          { id: 'g9-s3-a4', text: 'Develop facilities for music, arts and extra curricular activities' },
        ],
      },
      {
        id: 'g9-s4',
        number: '04',
        title: 'Technical and vocational education',
        actions: [
          { id: 'g9-s4-a1', text: 'Develop tourism, food and hospitality training workshop' },
          { id: 'g9-s4-a2', text: 'Establish diving, surfing and water sports school' },
          { id: 'g9-s4-a3', text: 'Establish marine and boating service workshop' },
          { id: 'g9-s4-a4', text: 'Develop health and wellness practical skills lab' },
        ],
      },
      {
        id: 'g9-s5',
        number: '05',
        title: 'Lifelong learning ecosystem',
        actions: [
          { id: 'g9-s5-a1', text: 'Establish centre for Islam, Quran and Hadith learning' },
          { id: 'g9-s5-a2', text: 'Establish centre for digital literacy and AI learning' },
          { id: 'g9-s5-a3', text: 'Develop a school for business and finance' },
          { id: 'g9-s5-a4', text: 'Establish a centre for arts and crafts' },
        ],
      },
      {
        id: 'g9-s6',
        number: '06',
        title: 'Education promotion',
        actions: [
          { id: 'g9-s6-a1', text: 'Establish a centre for education quality assurance' },
          { id: 'g9-s6-a2', text: 'Develop a strategy for education branding and promotion' },
          { id: 'g9-s6-a3', text: 'Establish a dedicated education promotion agency' },
          { id: 'g9-s6-a4', text: 'Publish annual performance reports' },
        ],
      },
    ],
  },
  {
    number: 10,
    slug: 'inclusive-prosperity',
    title: 'Inclusive prosperity',
    color: '#82357E',
    textColor: '#82357E',
    tagline: 'Near-zero poverty and 500 businesses backed',
    summary: `Addu City is committed to achieving zero poverty by building a dynamic, innovative, and digitally enabled economy that creates opportunities for everyone. Through investment in entrepreneurship, future-ready skills, digital infrastructure, SMEs, and improved access to finance and markets, the city will generate quality jobs, empower local businesses, and strengthen economic resilience. Targeted support for women, youth, people with disabilities, and other vulnerable groups will ensure that every resident has the opportunity to participate in and benefit from sustainable economic growth, leading to greater inclusion, shared prosperity, and an improved quality of life.`,
    stats: [
      { value: '326', label: 'persons living below poverty' },
      { value: '668', label: 'persons with special needs' },
      { value: '318', label: 'registered companies' },
      { value: '580', label: 'registered sole proprietorships' },
      { value: '15', label: 'partnerships' },
    ],
    targets: [
      { id: 'g10-t1', label: '10.1', text: 'Reduce poverty to near zero by 2029.' },
      { id: 'g10-t2', label: '10.2', text: 'Support 500 businesses and start-ups by 2030.' },
      { id: 'g10-t3', label: '10.3', text: 'Deliver 100% of Addu City Council services online through a single digital platform, with 90% of transactions completed digitally by 2030.' },
      { id: 'g10-t4', label: '10.4', text: 'Provide free high-speed public Wi-Fi in major tourism, business, education, healthcare, and public spaces by 2028.' },
      { id: 'g10-t5', label: '10.5', text: 'Establish a citywide digital marketplace with 500 local businesses and entrepreneurs actively selling products and services online by 2029.' },
      { id: 'g10-t6', label: '10.6', text: 'Enable 100% of registered businesses to accept secure digital payments and ensure 90% of retail transactions can be completed cashlessly by 2030.' },
    ],
    strategies: [
      {
        id: 'g10-s1',
        number: '01',
        title: 'Economic inclusion for zero poverty',
        actions: [
          { id: 'g10-s1-a1', text: 'Implement skills development program' },
          { id: 'g10-s1-a2', text: 'Establish apprenticeship scheme and job matching service' },
          { id: 'g10-s1-a3', text: 'Improve access to micro-finance and banking' },
          { id: 'g10-s1-a4', text: 'Provide targeted social support and case management' },
        ],
      },
      {
        id: 'g10-s2',
        number: '02',
        title: 'SME and local enterprise development',
        actions: [
          { id: 'g10-s2-a1', text: 'Establish an affordable SME finance scheme' },
          { id: 'g10-s2-a2', text: 'Organise annual Addu business fair' },
          { id: 'g10-s2-a3', text: 'Establish co-working space and incubation programme' },
          { id: 'g10-s2-a4', text: 'Launch freelance and remote work programme' },
        ],
      },
      {
        id: 'g10-s3',
        number: '03',
        title: 'Strengthen local supply chain',
        actions: [
          { id: 'g10-s3-a1', text: 'Establish a cold chain facility' },
          { id: 'g10-s3-a2', text: 'Develop island level mini cold storage units' },
          { id: 'g10-s3-a3', text: 'Introduce refrigerated transport vehicles and vessels' },
          { id: 'g10-s3-a4', text: 'Conduct training for cold chain handling and logistics' },
        ],
      },
      {
        id: 'g10-s4',
        number: '04',
        title: 'Digital Innovation Hub',
        actions: [
          { id: 'g10-s4-a1', text: 'Establish Addu Digital Skills and Innovation Centre' },
          { id: 'g10-s4-a2', text: 'Develop Digital City Platform for all services' },
          { id: 'g10-s4-a3', text: 'Provide public wi-fi in key medical, tourism and business areas' },
          { id: 'g10-s4-a4', text: 'Launch SMEs Go Digital and innovation startup grants' },
        ],
      },
      {
        id: 'g10-s5',
        number: '05',
        title: 'Addu Digital Marketplace',
        actions: [
          { id: 'g10-s5-a1', text: 'Establish Addu Marketplace' },
          { id: 'g10-s5-a2', text: 'Launch digital finance and payment literacy initiative' },
          { id: 'g10-s5-a3', text: 'Establish trusted delivery and digital cargo booking' },
          { id: 'g10-s5-a4', text: "Establish a container ferry service between Addu and Malé" },
        ],
      },
      {
        id: 'g10-s6',
        number: '06',
        title: 'Digital marketing and branding',
        actions: [
          { id: 'g10-s6-a1', text: 'Train businesses in social media and AI-assisted marketing' },
          { id: 'g10-s6-a2', text: 'Launch a digital empowerment programme for women' },
          { id: 'g10-s6-a3', text: 'Conduct an "Earn Online" public awareness campaign' },
          { id: 'g10-s6-a4', text: 'Develop "Made in Addu" branding' },
        ],
      },
    ],
  },
  {
    number: 11,
    slug: 'wildlife-and-wellness-tourism',
    title: 'Wildlife and wellness tourism',
    color: '#51ACA3',
    textColor: '#387770',
    tagline: 'Beyond the Beach — where nature meets wellbeing',
    summary: `Addu will become the destination "Beyond the Beach" — where nature meets wellbeing. By combining world-class wildlife experiences with health, wellness, and active lifestyles, Addu will create a distinctive year-round visitor economy. Visitors will encounter manta rays, whale sharks, dolphins, turtles, White Terns, and spectacular coral reefs through world-class diving and immersive nature experiences, while wellness retreats, healthy local cuisine, outdoor recreation, and specialist healthcare at Addu Equatorial Hospital make Addu a destination for restoration, recovery, and rejuvenation. Supported by boutique eco-lodges and sustainable accommodation, Addu will offer an authentic Maldivian experience.`,
    stats: [
      { value: '824', label: 'beds in 03 registered resorts in Addu' },
      { value: '472', label: 'beds in 20 guesthouses and 01 hotel' },
      { value: '20,031', label: 'tourist arrivals to Addu in 2025' },
      { value: '62,291', label: 'tourists to Huvadhoo and Fuvahmulah in 2025' },
      { value: '7,600', label: 'arrivals from Gan International Airport' },
    ],
    targets: [
      { id: 'g11-t1', label: '11.1', text: 'Increase tourist bed capacity in Addu City to 4,000 beds by 2030.' },
      { id: 'g11-t2', label: '11.2', text: 'Achieve 700,000 international bednights by 2029.' },
      { id: 'g11-t3', label: '11.3', text: 'Attract 20,000 medical and wellness visitors by 2029.' },
    ],
    strategies: [
      {
        id: 'g11-s1',
        number: '01',
        title: 'Southern gateway marina',
        actions: [
          { id: 'g11-s1-a1', text: 'Construct cafés, restaurants, shops and seafood market' },
          { id: 'g11-s1-a2', text: 'Develop waterfront spa, gym, and wellness studio' },
          { id: 'g11-s1-a3', text: 'Provide fuel, water, power and waste reception facilities' },
          { id: 'g11-s1-a4', text: 'Establish maintenance, repair and engineering services' },
        ],
      },
      {
        id: 'g11-s2',
        number: '02',
        title: 'Wellness resorts and boutique lodges',
        actions: [
          { id: 'g11-s2-a1', text: 'Hankede integrated development' },
          { id: 'g11-s2-a2', text: 'Wellness resorts in Dhon Hera and Savaahili' },
          { id: 'g11-s2-a3', text: 'Boutique hotels in Dhoogas and Gan airport' },
          { id: 'g11-s2-a4', text: 'Feydhoo, Maradhoo and Hithadhoo tourism zone lodges' },
        ],
      },
      {
        id: 'g11-s3',
        number: '03',
        title: 'World Class Wildlife Experiences',
        actions: [
          { id: 'g11-s3-a1', text: 'Promote Addu as a diving destination' },
          { id: 'g11-s3-a2', text: 'Organise annual dive events and forum' },
          { id: 'g11-s3-a3', text: 'Promote shipwrecks and heritage dives' },
          { id: 'g11-s3-a4', text: 'Train certified wildlife guides and dive instructors' },
        ],
      },
      {
        id: 'g11-s4',
        number: '04',
        title: 'Equatorial southern health hub',
        actions: [
          { id: 'g11-s4-a1', text: 'Accredit AEH to international standard' },
          { id: 'g11-s4-a2', text: 'Enhance orthopaedic, ophthalmology, ENT, and dental care' },
          { id: 'g11-s4-a3', text: 'Establish fertility treatment, aesthetic, and anti-ageing care' },
          { id: 'g11-s4-a4', text: 'Advance diagnostics, telemedicine and surgery service' },
        ],
      },
      {
        id: 'g11-s5',
        number: '05',
        title: 'Sports, events and lifestyle tourism',
        actions: [
          { id: 'g11-s5-a1', text: 'Build climate controlled tournament grade indoor stadium' },
          { id: 'g11-s5-a2', text: 'Establish FIFA standard full sized outdoor training pitch' },
          { id: 'g11-s5-a3', text: 'Develop fitness, sauna, plunge pool, and healing space' },
          { id: 'g11-s5-a4', text: 'Develop convention centre, water theme park, and aquatic centre' },
        ],
      },
      {
        id: 'g11-s6',
        number: '06',
        title: 'Healthy food destination',
        actions: [
          { id: 'g11-s6-a1', text: 'Develop Feydhoo and Maradhoo waterfront' },
          { id: 'g11-s6-a2', text: 'Develop Maradhoo-Feydhoo Sunset Markets and food stalls' },
          { id: 'g11-s6-a3', text: 'Branding and marketing of Addu Delights' },
          { id: 'g11-s6-a4', text: 'Promotion and branding of Addu Kukulhu Reha & Folhi' },
        ],
      },
    ],
  },
  {
    number: 12,
    slug: 'environment-protection',
    title: 'Environment protection',
    color: '#9CB854',
    textColor: '#627430',
    tagline: 'Protected reefs and wetlands, and a circular economy',
    summary: `Addu City will protect and restore its unique natural environment while building a climate-resilient circular economy that supports sustainable growth and community wellbeing. The city will conserve coral reefs, wetlands, mangroves, beaches, and other ecologically significant ecosystems by designating and effectively managing protected areas and nature parks, restoring degraded habitats, and promoting responsible public access and eco-tourism. Through resource efficiency, waste reduction, recycling, nature-based solutions, and climate-resilient infrastructure, Addu will enhance biodiversity, strengthen resilience to climate change, and create a cleaner, healthier, and more sustainable city for present and future generations.`,
    stats: [
      { value: '07', label: 'protected areas' },
      { value: '01', label: 'UNESCO biosphere reserve' },
      { value: '2,118.9', label: 'hectares of protected areas' },
      { value: '1,184.8', label: 'hectares of beach area' },
      { value: '04', label: 'wetlands, covering 81.7 hectares' },
    ],
    targets: [
      { id: 'g12-t1', label: '12.1', text: "Restore thriving populations of Addu's flagship species including White Terns, marine megafauna, sea turtles, beach crabs, corals, mangroves, and native flora by 2030." },
      { id: 'g12-t2', label: '12.2', text: 'Zero net loss of critical habitats and protected areas by 2030.' },
      { id: 'g12-t3', label: '12.3', text: 'Attract at least 50,000 visitors annually to nature and wildlife attractions by 2028.' },
      { id: 'g12-t4', label: '12.4', text: 'Restore and protect 100% of priority public beaches through nature based solutions, restore beach vegetation, and beach nourishment by 2030.' },
      { id: 'g12-t5', label: '12.5', text: 'Phase out single use plastic bottles by 2028.' },
      { id: 'g12-t6', label: '12.6', text: 'Ensure waste is segregated to 4 types of recyclables (plastics, metals, compost, and paper/cardboard) by 2029.' },
    ],
    strategies: [
      {
        id: 'g12-s1',
        number: '01',
        title: 'Protect ecologically significant areas',
        actions: [
          { id: 'g12-s1-a1', text: 'Improve visitor experience at Addu Nature Park' },
          { id: 'g12-s1-a2', text: 'Develop management plan for Manta Cleaning Station' },
          { id: 'g12-s1-a3', text: 'Preserve sites for shark and whale watching' },
          { id: 'g12-s1-a4', text: 'Develop mangrove park and experience center' },
        ],
      },
      {
        id: 'g12-s2',
        number: '02',
        title: 'Protect and restore threatened species',
        actions: [
          { id: 'g12-s2-a1', text: 'Develop Dhon Dheeni protection plan' },
          { id: 'g12-s2-a2', text: 'Establish a botanical garden of rare and threatened species' },
          { id: 'g12-s2-a3', text: 'Establish zoned beach and reefs for birds, crabs and turtles' },
          { id: 'g12-s2-a4', text: 'Establish an interactive Coral Discovery Center' },
        ],
      },
      {
        id: 'g12-s3',
        number: '03',
        title: 'Responsible wildlife interactions',
        actions: [
          { id: 'g12-s3-a1', text: 'Develop management plans for rays, sharks, turtles and dolphins' },
          { id: 'g12-s3-a2', text: 'Establish viewing towers for White Terns, migratory birds and fauna' },
          { id: 'g12-s3-a3', text: 'Introduce electric wildlife boats and glass-bottom kayaks' },
          { id: 'g12-s3-a4', text: 'Organise annual wildlife festivals and "only in Addu" experiences' },
        ],
      },
      {
        id: 'g12-s4',
        number: '04',
        title: 'Build climate resilience',
        actions: [
          { id: 'g12-s4-a1', text: 'Develop roadside drainage system' },
          { id: 'g12-s4-a2', text: 'Construct flood control near wetlands' },
          { id: 'g12-s4-a3', text: 'Establish sea level and climate observation infrastructure' },
          { id: 'g12-s4-a4', text: 'Establish air and water quality monitoring systems' },
        ],
      },
      {
        id: 'g12-s5',
        number: '05',
        title: 'Eliminate single use plastics',
        actions: [
          { id: 'g12-s5-a1', text: 'Eliminate plastic water bottles' },
          { id: 'g12-s5-a2', text: 'Establish a water testing laboratory' },
          { id: 'g12-s5-a3', text: 'Enable glass bottling of water and soft drinks' },
          { id: 'g12-s5-a4', text: 'Launch an initiative for alternative bags' },
        ],
      },
      {
        id: 'g12-s6',
        number: '06',
        title: 'A circular economy Addu',
        actions: [
          { id: 'g12-s6-a1', text: 'Establish a 3 bin waste segregation at source system' },
          { id: 'g12-s6-a2', text: 'Build a modern recycling centre' },
          { id: 'g12-s6-a3', text: 'Develop infrastructure to convert organic waste to compost' },
          { id: 'g12-s6-a4', text: 'Establish Repair and Reuse Hub for furniture and appliances' },
        ],
      },
    ],
  },
]

/**
 * The draft's sentence still names the vision "Sustainable Addu City", which
 * the 12 August draft renamed — so the page called one thing two names within
 * a scroll. Named as `VISION.name` names it, and stated actively: the passive
 * "will be pursued" leaves a resident with no idea who is doing the pursuing.
 */
export const INITIATIVES_INTRO = {
  title: 'Ten flagship initiatives',
  body: 'Ten closely related initiatives carry the vision of a resilient, inclusive, sustainable Addu.',
} as const

export const INITIATIVES: Initiative[] = [
  {
    number: '01',
    title: 'Home solar and battery storage',
    // 10 kWp in the 12 August draft, where earlier ones read 10 kW. Peak watts,
    // matching the "10 kWp solar PV" action under goal 1.
    text: 'We are taking a major step toward a cleaner, more affordable energy future for our community. We are launching a new initiative to install 10 kWp solar PV system on every household in Addu along with 15 kWh battery storage.',
  },
  {
    number: '02',
    title: 'Free electric bus service',
    text: 'We will launch a free electric bus service across the City connecting all important places, designed to make daily travel easier, more affordable, and environmentally friendly for all residents and visitors.',
  },
  // 03 and 04 trade places in the 12 August draft: food growing now comes
  // before starter homes.
  {
    number: '03',
    title: 'Every home is a food grower',
    text: 'We will support households to grow essentials such as lime, chilli, ginger, cucumber, tomato, gourds, mangoes, passion fruit and guava by providing seed packs, compost, training, guidance, and ongoing support.',
  },
  {
    number: '04',
    title: 'Starter homes for young families',
    text: 'We will provide young families 250 starter homes. These homes will be powered by renewable energy, provide safe water, and include gardens and open spaces where children can play, learn, and grow.',
  },
  {
    number: '05',
    title: 'Active healthy community',
    text: 'We will develop gyms, group fitness activities, and sports events that encourage participation across all age groups complemented by nutrition education led by chefs, fostering healthy eating and sustainable lifestyles.',
  },
  {
    number: '06',
    title: 'Higher and tertiary education excellence',
    text: 'We will increase access to quality tertiary education in nursing, medical training, hospitality, pilot training, cabin crew, and technical roles in aviation aligning education with industry needs.',
  },
  {
    number: '07',
    title: 'Zero poverty',
    text: 'We want a future where no one is left behind. We will support vulnerable members of our community through focused efforts in skills development, employment creation, mentoring, entrepreneurship and SME development.',
  },
  {
    number: '08',
    title: 'Live aboard hub and marina',
    text: 'We will develop a marina to provide safe and modern berthing, fuel, water, power, waste management and maintenance. The hub will create a vibrant waterfront with dining, boutique shopping, and wellness facilities.',
  },
  {
    number: '09',
    title: 'Biodiversity conservation',
    text: 'We will launch an integrated biodiversity conservation initiative focused on protecting the White Tern, manta rays, whale sharks, turtles, and dolphins and strengthen the management of Eidhigali Nature Park.',
  },
  {
    number: '10',
    title: 'Creative community centres',
    text: 'We will build integrated community centres with open green spaces to create inclusive welcoming spaces for children, young people, and elderly. These spaces will feature library, multi-purpose rooms, meditation, and recreation.',
  },
]

/* --------------------------------------------------------------- helpers */

export function getGoal(slug: string): Goal | undefined {
  return GOALS.find((g) => g.slug === slug)
}

export function goalNeighbours(slug: string): { prev: Goal; next: Goal } | null {
  const i = GOALS.findIndex((g) => g.slug === slug)
  if (i === -1) return null
  return {
    prev: GOALS[(i - 1 + GOALS.length) % GOALS.length],
    next: GOALS[(i + 1) % GOALS.length],
  }
}

/** Every action id in the plan — the feedback layer's universe. */
export function allActions(): { goal: Goal; strategy: Strategy; action: Action }[] {
  return GOALS.flatMap((goal) =>
    goal.strategies.flatMap((strategy) => strategy.actions.map((action) => ({ goal, strategy, action }))),
  )
}

export const TOTAL_ACTIONS = GOALS.reduce(
  (n, g) => n + g.strategies.reduce((m, s) => m + s.actions.length, 0),
  0,
)
