/**
 * Addu Development Plan 2026–2031 — content model.
 *
 * Every string, figure and colour below is transcribed from the council's draft
 * slide deck. Goals, targets and strategies come from the 21 July draft; the
 * front-of-deck figures, the settlement timeline and the cover date are updated
 * to the 29 July draft, which revised them. Goal colours were read out of the
 * deck's own PDF colour operators, so they match the presentation exactly.
 *
 * Where the source deck is visibly unfinished (placeholder counts, targets that
 * read only "D"), the item is omitted here and the goal carries an `openNote`
 * instead — the site would rather say "still open" than publish a wrong figure.
 */

export type Pillar = {
  id: string
  name: string
  /** Plate colour, exactly as printed. */
  color: string
  /**
   * Same hue, darkened until it clears 4.5:1 on white. The printed colours are
   * chosen for large filled shapes; three of the four fail as body text, so
   * anything type-sized uses this instead and the plate keeps the original.
   */
  textColor: string
  blurb: string
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
  headline: 'our aim is a multi-cultural hub for young professionals with',
  figure: '35,000 residents by 2030',
  name: 'Sustainable Addu',
  kicker: 'Addu City Vision',
} as const

export const TURNING_POINT = {
  title: 'Addu is at a turning point',
  body: `Addu City stands at a pivotal moment in its development trajectory, emerging as a strategic urban centre with the scale, connectivity, and ambition to drive the next phase of decentralised growth in the Maldives. With a vision to become a vibrant, multicultural hub for young professionals and a target population of 35,000 by 2030, Addu offers a unique advantage among island systems — its contiguous geography and established urban footprint enable integrated planning, efficient infrastructure delivery, and the development of a dynamic economic base. Combined with its expanding land area and rich settlement history, Addu is well positioned to evolve into a leading regional growth pole.`,
} as const

export const HEADLINE_FACTS: Stat[] = [
  { value: '50', label: 'islands in the atoll' },
  { value: '4', label: 'connected communities' },
  { value: '1,268', label: 'hectares of land' },
  { value: '35,558', label: 'registered people' },
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
  islands: [
    'Hithadhoo',
    'Maamendhoo',
    'Hankede',
    'Maradhoo',
    'Feydhoo',
    'Gan',
    'Villingili',
    'Hulhudhoo',
    'Meedhoo',
  ],
  /** Joined by the Link Road — the four the plan counts as one city. */
  linked: ['Hithadhoo', 'Maradhoo', 'Feydhoo', 'Gan'],
} as const

/** Share of the city that is made land, to one decimal. */
export const RECLAIMED_PCT = (LAND.reclaimedHa / LAND.totalHa) * 100

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
  {
    year: '1957',
    text: 'British begin construction of military base in Gan. Relocation of residents of Gan to Feydhoo, and of Feydhoo to Maradhoo.',
  },
  { year: '1960', text: 'British granted 30 year lease for Gan and Maamendhoo.' },
  { year: '1976', text: 'British troops leave Gan.' },
]

export type PopulationYear = { year: number; registered: number; resident: number }

/**
 * Registered against resident population. Structured rather than pre-formatted
 * strings so the gap is always derived, never hand-typed — a transcription slip
 * in the most important number on the page would be invisible otherwise.
 */
export const POPULATION: PopulationYear[] = [
  { year: 1977, registered: 14799, resident: 14094 },
  { year: 2006, registered: 29020, resident: 18026 },
  { year: 2014, registered: 32057, resident: 19319 },
  { year: 2022, registered: 35005, resident: 20343 },
  { year: 2025, registered: 35558, resident: 25026 },
]

export const LATEST_POPULATION = POPULATION[POPULATION.length - 1]

/** Everything in the ledger is drawn against one honest scale, starting at 0. */
export const POPULATION_SCALE_MAX = 37000

/** The plan's own target, from the vision slide. */
export const TARGET_RESIDENTS = 35000

export const gapOf = (row: PopulationYear) => row.registered - row.resident
export const fmt = (n: number) => n.toLocaleString('en-US')

/**
 * Where today sits on a 0 → 35,000 scale, for the vision measure. Derived, so a
 * revised count or target moves the graphic rather than silently lying. Nothing
 * before this point is filled: it marks a distance still to cover, not progress.
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

export const PILLARS_INTRO = {
  title: 'Four interconnected pillars',
  body: `What distinguishes the Addu Development Plan is its integrated, systems-based approach. Rather than a collection of standalone projects, it presents a coherent model for transformation built on four interconnected pillars: modern smart infrastructure, empowered people, a diversified economy, and a rich natural environment. Together, these elements define a clear vision for Addu as a sustainable, resilient, and inclusive city.`,
} as const

/**
 * The four pillars, named in the plan's own prose. Colours are the four badge
 * fills used across the goal grid.
 *
 * NOTE: the draft deck does not state which goals sit under which pillar, so
 * this site deliberately does not assert a mapping. Add a `goals: number[]`
 * field here once the council confirms it.
 */
export const PILLARS: Pillar[] = [
  {
    id: 'infrastructure',
    name: 'Modern smart infrastructure',
    color: '#652C67',
    textColor: '#652C67',
    blurb: 'Energy, water, mobility and connectivity built to carry a city of 35,000.',
  },
  {
    id: 'people',
    name: 'Empowered people',
    color: '#48A0A4',
    textColor: '#357578',
    blurb: 'Health, learning and community life that let people build a future here.',
  },
  {
    id: 'economy',
    name: 'A diversified economy',
    color: '#569A92',
    textColor: '#40736D',
    blurb: 'Enterprise, digital trade and tourism that reach beyond a single sector.',
  },
  {
    id: 'environment',
    name: 'A rich natural environment',
    color: '#90A84F',
    textColor: '#617135',
    blurb: 'Reefs, wetlands, wildlife and culture protected as living assets.',
  },
]

/* ------------------------------------------------------------------ goals */

export const GOALS: Goal[] = [
  {
    number: 1,
    slug: 'energy-security',
    title: 'Ensure energy security',
    color: '#652C67',
    textColor: '#652C67',
    tagline: 'Every home a renewable energy producer',
    summary: `Addu's reliance on imported diesel exposes the city to rising fuel prices, global market volatility, and supply disruptions. Frequent power outages resulting from capacity constraints further demonstrate the need for a more resilient and diversified electricity network. Addu possesses exceptional potential to become a prosumer renewable energy city, and solar PV and battery storage are practical solutions. Currently, government spends about MVR 2.8 billion annually for electricity and fuel subsidies equivalent to around MVR 34,000 per household, highlighting the significant opportunity to transform to a sustainable renewable energy system.`,
    stats: [
      { value: '16.2 kWh', label: 'per day average household consumption' },
      { value: '18.7 million', label: 'litres of diesel per year' },
      { value: '130 million', label: 'MVR to buy diesel per year' },
      { value: '71.4 million', label: 'MVR subsidy per year' },
      { value: '35,351 MVR', label: 'per year for each household' },
    ],
    targets: [
      { id: 'g1-t1', label: '1.1', text: 'Transform 80% of homes to renewable energy producers by 2028.' },
      { id: 'g1-t2', label: '1.2', text: 'Enable 60% of businesses to install rooftop solar PV and participate in virtual power plants by 2028.' },
      { id: 'g1-t3', label: '1.3', text: "Equip 100% of government buildings with rooftop solar PV and battery storage, integrating them into Addu's virtual power plant network by 2028." },
    ],
    strategies: [
      {
        id: 'g1-s1',
        number: '01',
        title: 'Every home is a prosumer',
        actions: [
          { id: 'g1-s1-a1', text: 'Provide 5 kW solar PV to 6,000 homes' },
          { id: 'g1-s1-a2', text: 'Enable 14 kWh battery storage to homes' },
          { id: 'g1-s1-a3', text: 'Provide smart meters to 6,000 homes' },
        ],
      },
      {
        id: 'g1-s2',
        number: '02',
        title: 'All entities as producers',
        actions: [
          { id: 'g1-s2-a1', text: 'Establish solar PV and energy storage in public buildings' },
          { id: 'g1-s2-a2', text: 'Enable solar PV and energy storage in private buildings' },
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
    slug: 'water-security',
    title: 'Ensure water security',
    color: '#48A0A4',
    textColor: '#357578',
    tagline: 'Renewables-powered desalination and rainwater for all',
    summary: `Addu will achieve long-term water security by integrating renewable energy with modern desalination and diversified water sources. Solar PV and battery storage will power desalination during the day while providing stored energy for reliable round-the-clock operation, reducing dependence on imported diesel, lowering operating costs, and cutting emissions. This integrated water–energy system will be complemented by expanded household and community rainwater harvesting, creating a resilient, climate-ready water supply that safeguards communities against droughts, supply disruptions, and future growth.`,
    stats: [
      { value: '35,000', label: 'residents' },
      { value: '85 litres', label: 'of water per person per day' },
      { value: '3,000 m³', label: 'of potable water per day' },
      { value: '4 kWh', label: 'to produce a cubic metre of desalinated water' },
      { value: '12,000 kWh', label: 'needed per day to produce water' },
    ],
    targets: [
      { id: 'g2-t1', label: '2.1', text: 'Produce 3,000 m³ of desalinated water per day using renewable energy by 2028.' },
      { id: 'g2-t2', label: '2.2', text: 'Equip all homes with safe rainwater collection tanks and whole-house water filtration systems by 2029.' },
      { id: 'g2-t3', label: '2.3', text: 'Achieve universal sewerage coverage and wastewater reuse by 2028.' },
    ],
    strategies: [
      {
        id: 'g2-s1',
        number: '01',
        title: 'Renewables powered desalination',
        actions: [
          { id: 'g2-s1-a1', text: 'Increase desalination capacity to 3,000 m³/day' },
          { id: 'g2-s1-a2', text: 'Install 3 MWp solar PV for water production' },
          { id: 'g2-s1-a3', text: 'Install 8 MWh battery storage for water production' },
          { id: 'g2-s1-a4', text: 'Establish 6,000 m³ water storage capacity' },
        ],
      },
      {
        id: 'g2-s2',
        number: '02',
        title: 'Safe rainwater collection & storage',
        actions: [
          { id: 'g2-s2-a1', text: 'Provide safe rainwater collection tanks to all homes' },
          { id: 'g2-s2-a2', text: 'Enable whole house water filtration for 6,000 homes' },
          { id: 'g2-s2-a3', text: 'Build community rainwater storage tanks' },
          { id: 'g2-s2-a4', text: 'Develop regulations for groundwater use and protection' },
        ],
      },
      {
        id: 'g2-s3',
        number: '03',
        title: 'Effective sewage treatment',
        actions: [
          { id: 'g2-s3-a1', text: 'Expand sewerage connection to all homes' },
          { id: 'g2-s3-a2', text: 'Upgrade sewage and wastewater treatment system' },
          { id: 'g2-s3-a3', text: 'Integrate solar PV to sewage treatment' },
          { id: 'g2-s3-a4', text: "Invest in 'sludge to compost' and treated water reuse" },
        ],
      },
    ],
  },
  {
    number: 3,
    slug: 'food-security',
    title: 'Ensure food security',
    color: '#48A0A4',
    textColor: '#357578',
    tagline: 'Grow more at home, land more from the sea',
    summary: `Food security is a strategic priority for Addu City amid rising global food prices, supply chain disruptions, and increasing climate risks. Heavy reliance on imports exposes the city to external shocks, threatening affordability and access to nutritious food. In 2025, the food import bill of Maldives reached USD 790.5 million and food security presents economic opportunities. Advancing sustainable fisheries, smart organic agriculture, and local food production will build resilience and self-sufficiency. Supporting systems such as a food quality lab and food fund will ensure safety, stability, and long-term food security for all residents.`,
    stats: [
      { value: '33.5 million', label: 'USD staples' },
      { value: '106.9 million', label: 'USD vegetables and root crops' },
      { value: '106.5 million', label: 'USD fruits, nuts and seeds' },
      { value: '156.7 million', label: 'USD meat, seafood and fish' },
      { value: '109.1 million', label: 'USD dairy and eggs' },
      { value: '163.5 million', label: 'USD beverages and confectionary' },
    ],
    targets: [
      { id: 'g3-t1', label: '3.1', text: 'Ensure 75% of homes grow 03 types of fruits and 05 vegetables at home.' },
      { id: 'g3-t2', label: '3.2', text: 'Ensure ice and fuel are available to fishers in their island harbours.' },
    ],
    strategies: [
      {
        id: 'g3-s1',
        number: '01',
        title: 'Every home a proud grower',
        actions: [
          { id: 'g3-s1-a1', text: 'Distribute starter kits for households' },
          { id: 'g3-s1-a2', text: 'Establish a nursery and seed bank' },
          { id: 'g3-s1-a3', text: 'Launch home gardening app and social media kits' },
          { id: 'g3-s1-a4', text: "Organise home grower's market" },
        ],
      },
      {
        id: 'g3-s2',
        number: '02',
        title: 'Organic agriculture revival',
        actions: [
          { id: 'g3-s2-a1', text: 'Launch coconut & Kurumba cultivation and replanting' },
          { id: 'g3-s2-a2', text: 'Allocate land for breadfruit, banana and yam plantation' },
          { id: 'g3-s2-a3', text: 'Establish orchards for pomegranates, papaya and passionfruit' },
          { id: 'g3-s2-a4', text: 'Establish food and soil safety monitoring and traceability' },
        ],
      },
      {
        id: 'g3-s3',
        number: '03',
        title: 'Technology driven fresh food',
        actions: [
          { id: 'g3-s3-a1', text: 'Develop solar-powered climate-controlled greenhouses' },
          { id: 'g3-s3-a2', text: 'Establish vertical farms with hydroponic and aeroponic tech' },
          { id: 'g3-s3-a3', text: 'Introduce smart precision irrigation and water management' },
          { id: 'g3-s3-a4', text: 'Introduce drones + AI to track stress, disease and fertiliser' },
        ],
      },
      {
        id: 'g3-s4',
        number: '04',
        title: 'High quality resilient fisheries',
        actions: [
          { id: 'g3-s4-a1', text: 'Invest in renewables powered ice production' },
          { id: 'g3-s4-a2', text: 'Expand fisheries fuel storage capacity for 03 months' },
          { id: 'g3-s4-a3', text: 'Establish quality assurance for valhomas and rihaakuru' },
          { id: 'g3-s4-a4', text: 'Brand and promote valhomas, rihaakuru and fish products' },
        ],
      },
      {
        id: 'g3-s5',
        number: '05',
        title: 'Fresh eggs every day',
        actions: [
          { id: 'g3-s5-a1', text: 'Build four demonstration poultry farms' },
          { id: 'g3-s5-a2', text: 'Establish a PPP for quality feed development' },
          { id: 'g3-s5-a3', text: 'Establish a biosecurity and disease management unit' },
          { id: 'g3-s5-a4', text: 'Conduct training on egg handling, storage and quality' },
        ],
      },
      {
        id: 'g3-s6',
        number: '06',
        title: 'Trusted quality local food',
        actions: [
          { id: 'g3-s6-a1', text: 'Establish a food quality laboratory' },
          { id: 'g3-s6-a2', text: 'Establish a food fund to support growers and producers' },
          { id: 'g3-s6-a3', text: 'Provide support to bakers and snack producers' },
          { id: 'g3-s6-a4', text: 'Establish certification and training for food producers' },
        ],
      },
    ],
  },
  {
    number: 4,
    slug: 'future-ready-transport',
    title: 'Future ready transport',
    color: '#569A92',
    textColor: '#40736D',
    tagline: 'Free electric buses every 10 minutes',
    summary: `As incomes continue to rise, vehicle ownership is expected to increase, leading to greater traffic congestion, parking shortages, road safety concerns, and dependence on imported fossil fuels. To avoid becoming a car-dependent city, Addu will adopt a free electric bus service operating every 10 minutes during peak hours, supported by walking and cycling infrastructure and a planned transition to electric vehicles. Complemented by an expanding EV charging network, this strategy will lower transport emissions, reduce fuel imports, improve air quality, and establish Addu as a city for clean, affordable, and sustainable mobility.`,
    stats: [
      { value: '13 buses', label: '05 for 50 pax and 08 for 30 pax' },
      { value: '2,500', label: 'passengers use buses daily' },
      { value: '4,651', label: 'motorcycles — 81% of households own one' },
      { value: '3,099', label: 'cars — 54% of households own one' },
    ],
    targets: [
      { id: 'g4-t1', label: '4.1', text: 'Operate free electric buses every 10 minutes during peak hours by 2028.' },
      { id: 'g4-t2', label: '4.2', text: 'Develop 16 km of international standard roads by 2029.' },
    ],
    strategies: [
      {
        id: 'g4-s1',
        number: '01',
        title: 'Free electric bus service',
        actions: [
          { id: 'g4-s1-a1', text: 'Procure 08 electric buses' },
          { id: 'g4-s1-a2', text: 'Establish 03 solar bus charging stations' },
          { id: 'g4-s1-a3', text: 'Launch an app for bus routes and schedules' },
          { id: 'g4-s1-a4', text: 'Build climate smart next generation bus shelters' },
        ],
      },
      {
        id: 'g4-s2',
        number: '02',
        title: 'Catalyse EV transition',
        actions: [
          { id: 'g4-s2-a1', text: 'Establish 06 solar super charging stations for electric cars' },
          { id: 'g4-s2-a2', text: 'Establish smart battery swapping service for motorcycles' },
          { id: 'g4-s2-a3', text: 'Procure electric cars for council use' },
          { id: 'g4-s2-a4', text: 'Procure super hybrid pickup trucks for council works' },
        ],
      },
      {
        id: 'g4-s3',
        number: '03',
        title: 'Smart parking',
        actions: [
          { id: 'g4-s3-a1', text: 'Launch automatic license plate recognition' },
          { id: 'g4-s3-a2', text: 'Incentivise home garage development' },
          { id: 'g4-s3-a3', text: 'Establish IoT sensor detection parking slots' },
          { id: 'g4-s3-a4', text: 'Launch a cashless paid parking application' },
        ],
      },
      {
        id: 'g4-s4',
        number: '04',
        title: 'Modern resurfaced Link Road',
        actions: [
          { id: 'g4-s4-a1', text: 'Upgrade 12.3 km of road to modern smart standard' },
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
    color: '#90A84F',
    textColor: '#617135',
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
      { id: 'g5-t1', label: '5.1', text: 'Establish daily passenger and cargo connectivity between Southern Atolls by 2028.' },
    ],
    strategies: [
      {
        id: 'g5-s1',
        number: '01',
        title: 'Smart air connectivity',
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
          { id: 'g5-s2-a3', text: 'Facilitate UTM services' },
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
    color: '#652C67',
    textColor: '#652C67',
    tagline: '250 starter homes and 120 apartments',
    summary: `Addu City is planning to attract professionals, skilled workers, and returning families. Accelerating housing delivery is essential to this vision and we will deliver 250 new sustainable homes for families, providing high-quality, climate-resilient housing integrated with solar PV, battery storage, rainwater harvesting, and energy-efficient design. To support Addu's transformation into a destination for wellness, education, aviation, and business, we will deliver 120 spacious apartments across 10 low-rise (3–4 storey) apartment buildings, providing high-quality accommodation for professionals and their families. Designed to international standards, the apartments will feature generous living spaces, lift access, secure parking, and energy-efficient design, offering an attractive lifestyle for professionals, entrepreneurs, and skilled workers. Together with complementary initiatives for affordable rental accommodation and mixed-use neighbourhoods, this goal will create attractive liveable communities.`,
    stats: [
      { value: '5,307', label: 'existing houses' },
      { value: '289', label: 'flats and row houses' },
      { value: '1,051', label: 'land plots released for housing' },
      { value: '275', label: 'housing units under construction' },
      { value: '200', label: 'planned housing units' },
    ],
    targets: [
      { id: 'g6-t1', label: '6.1', text: 'Provide 250 new sustainable homes for families by 2028.' },
      { id: 'g6-t2', label: '6.2', text: 'Develop accommodation for 120 families of professionals.' },
    ],
    strategies: [
      {
        id: 'g6-s1',
        number: '01',
        title: 'Starter home neighbourhoods',
        actions: [
          { id: 'g6-s1-a1', text: 'Develop 5 starter home neighbourhoods' },
          { id: 'g6-s1-a2', text: 'Build 250 starter homes' },
          { id: 'g6-s1-a3', text: 'Provide First Home Ownership Support' },
          { id: 'g6-s1-a4', text: 'Build 12 display homes' },
        ],
      },
      {
        id: 'g6-s2',
        number: '02',
        title: 'Residences for professionals',
        actions: [
          { id: 'g6-s2-a1', text: 'Develop 10 low rise (3–4 floor) apartment buildings' },
          { id: 'g6-s2-a2', text: 'Build 120 spacious apartments' },
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
          { id: 'g6-s3-a4', text: "Integrate cafe', retail and childcare to mixed use precincts" },
        ],
      },
    ],
  },
  {
    number: 7,
    slug: 'revitalise-community-life',
    title: 'Revitalise community life',
    color: '#569A92',
    textColor: '#40736D',
    tagline: 'A community centre within a 10-minute walk',
    summary: `Addu City will foster vibrant, inclusive, and connected communities by creating high-quality public spaces that encourage recreation, social interaction, culture, and healthy living. Through integrated community centres, active waterfronts, attractive parks, and safe, shaded walkable streets, every resident will have easy access to places where people can gather, exercise, learn, celebrate, and build stronger community connections, making Addu City liveable and people-centred.`,
    stats: [
      { value: '45', label: 'mosques' },
      { value: '14', label: 'gyms (08) and indoor sports halls (06)' },
      { value: '1', label: 'library and art gallery' },
      { value: '356', label: 'retail and wholesale shops' },
      { value: '87', label: "cafe's and restaurants" },
    ],
    targets: [
      { id: 'g7-t1', label: '7.1', text: 'Ensure every resident lives within a 10-minute walk of a community centre.' },
      { id: 'g7-t2', label: '7.2', text: 'Develop a continuous waterfront from Feydhoo to Hithadhoo.' },
    ],
    strategies: [
      {
        id: 'g7-s1',
        number: '01',
        title: 'Creative community centres',
        actions: [
          { id: 'g7-s1-a1', text: 'Develop 06 integrated community centres' },
          { id: 'g7-s1-a2', text: 'Build library, games room, and childcare in community centres' },
          { id: 'g7-s1-a3', text: 'Develop prayer rooms and counselling rooms' },
          { id: 'g7-s1-a4', text: 'Build community function rooms and quality restrooms' },
        ],
      },
      {
        id: 'g7-s2',
        number: '02',
        title: 'Beach and waterfront lifestyle',
        actions: [
          { id: 'g7-s2-a1', text: 'Develop Feydhoo–Hithadhoo waterfront promenade' },
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
          { id: 'g7-s3-a1', text: 'Establish Addu Rose Garden' },
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
          { id: 'g7-s4-a3', text: 'Establish smart lighting, wi-fi and water fountains' },
          { id: 'g7-s4-a4', text: 'Develop running and walking tracks and bicycle paths' },
        ],
      },
    ],
  },
  {
    number: 8,
    slug: 'health-and-well-being',
    title: 'Health and Well-being',
    color: '#569A92',
    textColor: '#40736D',
    tagline: 'The southern medical hub, 10 minutes from home',
    summary: `Addu City faces growing health challenges, including rising non-communicable diseases, mental health needs, and the high cost of care and medicines. Strengthening prevention — through cancer screening, nutrition, and active lifestyles — alongside improved mental health support is essential for long-term well-being. Upgrading island health centres into effective primary healthcare providers and positioning Addu Equatorial Hospital as the southern medical hub will improve access and quality of care. Investing in a skilled health workforce and affordable services will ensure a resilient, inclusive, and people-centred health system. There are 561 people in the health workforce in Addu.`,
    stats: [
      { value: '11', label: 'operational health facilities' },
      { value: '37', label: 'specialist doctors' },
      { value: '25', label: 'medical officers' },
      { value: '147', label: 'nurses' },
      { value: '19', label: 'registered pharmacies' },
    ],
    targets: [
      { id: 'g8-t1', label: '8.1', text: 'Screen 90% of adults for diabetes, hypertension, and priority cancers every two years.' },
      { id: 'g8-t3', label: '8.3', text: 'Ensure 100% of residents have access to comprehensive healthcare within 10 minutes of their home.' },
    ],
    openNote: 'Targets 8.2 and 8.4 are still to be set.',
    strategies: [
      {
        id: 'g8-s1',
        number: '01',
        title: 'Active healthy community',
        actions: [
          { id: 'g8-s1-a1', text: 'Develop gyms and fitness centres' },
          { id: 'g8-s1-a2', text: 'Organise group fitness activities and sports events' },
          { id: 'g8-s1-a3', text: 'Conduct nutrition education led by chefs' },
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
          { id: 'g8-s4-a2', text: 'Expand maternal and child health services' },
          { id: 'g8-s4-a3', text: 'Provide latest fertility treatment and reproductive education' },
          { id: 'g8-s4-a4', text: 'Establish a hyperbaric chamber' },
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
    color: '#90A84F',
    textColor: '#617135',
    tagline: '2,000 tertiary students a year by 2030',
    summary: `Education is central to Addu City's future competitiveness, workforce development, and social progress. Strengthening foundational learning through quality early childhood education, upgrading school infrastructure and science labs, and expanding vocational training pathways will align skills with emerging economic opportunities. Building digital capabilities and promoting lifelong learning will ensure adaptability in a rapidly changing world. Together, these investments will create a skilled, innovative, and resilient community.`,
    stats: [
      { value: '12', label: 'schools' },
      { value: '5,284', label: 'school students' },
      { value: '676', label: 'teachers' },
      { value: '05', label: 'universities and colleges' },
    ],
    targets: [
      { id: 'g9-t1', label: '9.1', text: 'Attract over 2,000 tertiary students annually by 2030.' },
      { id: 'g9-t3', label: '9.3', text: 'Provide lifelong learning opportunities so that at least 25% of adults participate in professional development or skills training.' },
    ],
    openNote: 'Targets 9.2 and 9.4, the tertiary student count, and the actions under strategy 06 are still to be set.',
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
          { id: 'g9-s4-a1', text: 'Tourism, food and hospitality training workshop' },
          { id: 'g9-s4-a2', text: 'Marine and boating service workshop' },
          { id: 'g9-s4-a3', text: 'Diving, surfing and water sports school' },
          { id: 'g9-s4-a4', text: 'Health and aged care practical skills lab' },
        ],
      },
      {
        id: 'g9-s5',
        number: '05',
        title: 'Lifelong learning ecosystem',
        actions: [
          { id: 'g9-s5-a1', text: 'Islam, quran and hadith learning' },
          { id: 'g9-s5-a2', text: 'Digital literacy and AI' },
          { id: 'g9-s5-a3', text: 'Business and finance' },
          { id: 'g9-s5-a4', text: 'Health, nutrition and fitness' },
        ],
      },
      {
        id: 'g9-s6',
        number: '06',
        title: 'Skills development',
        actions: [{ id: 'g9-s6-a1', text: 'Cooking and crafts' }],
      },
    ],
  },
  {
    number: 10,
    slug: 'inclusive-prosperity',
    title: 'Inclusive prosperity',
    color: '#652C67',
    textColor: '#652C67',
    tagline: 'Near-zero poverty and 500 businesses backed',
    summary: `Achieving zero poverty requires a coordinated approach that expands skills development, supports entrepreneurship, and creates sustainable employment pathways. Strengthening SME development and enabling access to finance and markets will empower local businesses and drive income generation. Targeted support programs with continuous follow-up will ensure vulnerable groups are not left behind and can transition into stable livelihoods. Together, these efforts will foster inclusive growth, economic resilience, and shared prosperity across Addu City.`,
    stats: [
      { value: '326', label: 'persons living below the poverty line' },
      { value: '668', label: 'persons with special needs' },
      { value: '318', label: 'registered companies' },
      { value: '580', label: 'registered sole proprietorships' },
      { value: '15', label: 'partnerships' },
    ],
    targets: [
      { id: 'g10-t1', label: '10.1', text: 'Reduce poverty to near zero by 2029.' },
      { id: 'g10-t2', label: '10.2', text: 'Support 500 businesses and start-ups by 2030.' },
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
    ],
  },
  {
    number: 11,
    slug: 'digital-thriving-economy',
    title: 'Digital thriving economy',
    color: '#48A0A4',
    textColor: '#357578',
    tagline: 'Every council service online by 2030',
    summary: `Addu City will become a digital innovation and entrepreneurship hub, creating a connected, inclusive, and competitive digital economy powered by technology, innovation, and skilled people. By investing in digital infrastructure, future-ready skills, e-commerce, cashless payments, and digital entrepreneurship, Addu will enable businesses to compete in global markets, create high-value jobs for young people and women, modernise public services, and promote digital innovation, remote work, and smart business growth.`,
    stats: [],
    openNote: 'Connectivity figures for this goal are still being compiled.',
    targets: [
      { id: 'g11-t1', label: '11.1', text: 'Deliver 100% of Addu City Council services online through a single digital platform, with 90% of transactions completed digitally by 2030.' },
      { id: 'g11-t2', label: '11.2', text: 'Provide free high-speed public Wi-Fi in major tourism, business, education, healthcare, and public spaces by 2028.' },
      { id: 'g11-t3', label: '11.3', text: 'Establish a citywide digital marketplace with 500 local businesses and entrepreneurs actively selling products and services online.' },
      { id: 'g11-t4', label: '11.4', text: 'Enable 100% of registered businesses to accept secure digital payments and ensure 90% of retail transactions can be completed cashlessly.' },
    ],
    strategies: [
      {
        id: 'g11-s1',
        number: '01',
        title: 'Digital Innovation Hub',
        actions: [
          { id: 'g11-s1-a1', text: 'Establish Addu Digital Skills and Innovation Centre' },
          { id: 'g11-s1-a2', text: 'Develop Digital City Platform for all services' },
          { id: 'g11-s1-a3', text: 'Provide public wi-fi in key medical, tourism and business areas' },
          { id: 'g11-s1-a4', text: 'Launch SMEs Go Digital and innovation startup grants' },
        ],
      },
      {
        id: 'g11-s2',
        number: '02',
        title: 'Addu Digital Marketplace',
        actions: [
          { id: 'g11-s2-a1', text: 'Establish Addu Marketplace' },
          { id: 'g11-s2-a2', text: 'Launch digital finance and payment literacy initiative' },
          { id: 'g11-s2-a3', text: 'Establish trusted delivery and digital cargo booking' },
          { id: 'g11-s2-a4', text: "Establish a container ferry service between Addu and Male'" },
        ],
      },
      {
        id: 'g11-s3',
        number: '03',
        title: 'Digital marketing and branding',
        actions: [
          { id: 'g11-s3-a1', text: 'Train businesses in social media and AI-assisted marketing' },
          { id: 'g11-s3-a2', text: 'Launch a digital empowerment programme for women' },
          { id: 'g11-s3-a3', text: 'Conduct an "Earn Online" public awareness campaign' },
          { id: 'g11-s3-a4', text: 'Develop "Made in Addu" branding' },
        ],
      },
    ],
  },
  {
    number: 12,
    slug: 'wildlife-and-wellness-tourism',
    title: 'Wildlife and wellness tourism',
    color: '#569A92',
    textColor: '#40736D',
    tagline: 'Beyond the Beach — where nature meets wellbeing',
    summary: `Addu will become the destination "Beyond the Beach" — where nature meets wellbeing. By combining world-class wildlife experiences with health, wellness, and active lifestyles, Addu will create a distinctive year-round visitor economy. Visitors will encounter manta rays, whale sharks, dolphins, turtles, White Terns, and spectacular coral reefs through world-class diving and immersive nature experiences, while wellness retreats, healthy local cuisine, outdoor recreation, and specialist healthcare at Addu Equatorial Hospital make Addu a destination for restoration, recovery, and rejuvenation. Supported by boutique eco-lodges and sustainable accommodation, Addu will offer an authentic Maldivian experience.`,
    stats: [
      { value: '824', label: 'beds in 03 registered resorts in Addu' },
      { value: '472', label: 'beds in 20 guesthouses and 01 hotel' },
      { value: '20,031', label: 'tourist arrivals to Addu in 2025' },
      { value: '62,291', label: 'tourists to Huvadhoo and Fuvahmulah in 2025' },
      { value: '7,600', label: 'arrivals from Gan International Airport' },
    ],
    targets: [],
    openNote: 'Numbered targets for this goal are still to be set.',
    strategies: [
      {
        id: 'g12-s1',
        number: '01',
        title: 'Southern gateway marina',
        actions: [
          { id: 'g12-s1-a1', text: "Construct cafe', restaurants, shops and seafood market" },
          { id: 'g12-s1-a2', text: 'Develop waterfront spa, gym, and wellness studio' },
          { id: 'g12-s1-a3', text: 'Provide fuel, water, power and waste reception facilities' },
          { id: 'g12-s1-a4', text: 'Establish maintenance, repair and engineering services' },
        ],
      },
      {
        id: 'g12-s2',
        number: '02',
        title: 'Wellness resorts and boutique lodges',
        actions: [
          { id: 'g12-s2-a1', text: 'Hankede integrated development' },
          { id: 'g12-s2-a2', text: 'Wellness resorts in Dhon Hera and Savaahili' },
          { id: 'g12-s2-a3', text: 'Boutique hotels in Dhoogas and Gan airport' },
          { id: 'g12-s2-a4', text: 'Feydhoo, Maradhoo and Hithadhoo tourism zone lodges' },
        ],
      },
      {
        id: 'g12-s3',
        number: '03',
        title: 'World class wildlife experiences',
        actions: [
          { id: 'g12-s3-a1', text: 'Promote Addu as a diving destination' },
          { id: 'g12-s3-a2', text: 'Organise annual dive events and forum' },
          { id: 'g12-s3-a3', text: 'Promote shipwrecks and heritage dives' },
          { id: 'g12-s3-a4', text: 'Train certified wildlife guides and dive instructors' },
        ],
      },
      {
        id: 'g12-s4',
        number: '04',
        title: 'Equatorial southern health hub',
        actions: [
          { id: 'g12-s4-a1', text: 'Accredit AEH to international standard' },
          { id: 'g12-s4-a2', text: 'Enhance orthopaedic, ophthalmology, ENT, and dental care' },
          { id: 'g12-s4-a3', text: 'Establish fertility treatment, aesthetic, and anti-ageing care' },
          { id: 'g12-s4-a4', text: 'Advance diagnostics, telemedicine and surgery service' },
        ],
      },
      {
        id: 'g12-s5',
        number: '05',
        title: 'Sports and active lifestyle tourism',
        actions: [
          { id: 'g12-s5-a1', text: 'Build climate controlled tournament grade indoor stadium' },
          { id: 'g12-s5-a2', text: 'Establish FIFA standard full sized outdoor training pitch' },
          { id: 'g12-s5-a3', text: 'Develop fitness, sauna, plunge pool, and healing space' },
          { id: 'g12-s5-a4', text: 'Develop water theme park, aquatic centre, and beach zone' },
        ],
      },
      {
        id: 'g12-s6',
        number: '06',
        title: 'Healthy food destination',
        actions: [
          { id: 'g12-s6-a1', text: 'Develop Feydhoo and Maradhoo waterfront' },
          { id: 'g12-s6-a2', text: 'Develop Maradhoo–Feydhoo Sunset Markets and food stalls' },
          { id: 'g12-s6-a3', text: 'Branding and marketing of Addu Delights' },
          { id: 'g12-s6-a4', text: 'Promotion and branding of Addu Kukulhu Reha & Folhi' },
        ],
      },
    ],
  },
  {
    number: 13,
    slug: 'biodiversity-conservation',
    title: 'Biodiversity conservation',
    color: '#90A84F',
    textColor: '#617135',
    tagline: 'Protecting the White Tern, reefs and wetlands',
    summary: `Protect and enhance Addu City's biodiversity by designating and managing key sites of ecological significance, including coral reefs, lagoons, wetlands, and coastal habitats. Establish a network of protected areas and nature parks that conserve critical ecosystems while enabling controlled public access and eco-tourism. Implement conservation measures such as habitat restoration, marine protection zones, and sustainable use regulations to safeguard biodiversity. Strengthen community stewardship, research, and monitoring, while integrating education and low-impact visitor experiences to promote awareness and long-term conservation.`,
    stats: [
      { value: '07', label: 'protected areas' },
      { value: '01', label: 'UNESCO biosphere reserve' },
      { value: '2,118.9', label: 'hectares of protected areas' },
      { value: '01', label: 'Addu Nature Park' },
      { value: 'White Tern', label: 'exclusively found in Addu' },
    ],
    targets: [],
    openNote: 'Numbered targets for this goal are still to be set.',
    strategies: [
      {
        id: 'g13-s1',
        number: '01',
        title: 'Protect ecologically significant areas',
        actions: [
          { id: 'g13-s1-a1', text: 'Improve visitor experience at Addu Nature Park' },
          { id: 'g13-s1-a2', text: 'Develop management plan for Manta Cleaning Station' },
          { id: 'g13-s1-a3', text: 'Preserve sites for shark and whale watching' },
          { id: 'g13-s1-a4', text: 'Develop mangrove park and experience center' },
        ],
      },
      {
        id: 'g13-s2',
        number: '02',
        title: 'Protect and restore threatened species',
        actions: [
          { id: 'g13-s2-a1', text: 'Develop Dhon Dheeni protection plan' },
          { id: 'g13-s2-a2', text: 'Establish a botanical garden of rare and threatened species' },
          { id: 'g13-s2-a3', text: 'Establish zoned beach and reefs for birds, crabs and turtles' },
          { id: 'g13-s2-a4', text: 'Establish an interactive Coral Discovery Center' },
        ],
      },
      {
        id: 'g13-s3',
        number: '03',
        title: 'Responsible wildlife interactions',
        actions: [
          { id: 'g13-s3-a1', text: 'Develop management plans for rays, sharks, turtles and dolphins' },
          { id: 'g13-s3-a2', text: 'Establish viewing towers for White Terns, migratory birds and fauna' },
          { id: 'g13-s3-a3', text: 'Introduce electric wildlife boats and glass-bottom kayaks' },
          { id: 'g13-s3-a4', text: 'Organise annual wildlife festivals and "only in Addu" experiences' },
        ],
      },
    ],
  },
  {
    number: 14,
    slug: 'climate-resilient-circular-economy',
    title: 'Climate resilient circular economy',
    color: '#652C67',
    textColor: '#652C67',
    tagline: 'Single-use plastics phased out by 2030',
    summary: `Addu City will build a climate-resilient circular economy, where resources are used efficiently, waste is minimised, nature is restored, and communities are prepared for climate impacts. By embracing sustainable consumption, recycling and resource recovery, climate-resilient infrastructure, and nature-based solutions, Addu will create a cleaner, more competitive, and resilient city that thrives within environmental limits while improving the quality of life for all residents.`,
    stats: [
      { value: '1,184.8', label: 'hectares of beach area' },
      { value: '04', label: 'wetlands' },
      { value: '81.7', label: 'hectares of wetland' },
      { value: '5,596', label: 'residences' },
      { value: '443', label: "shops and cafe's" },
    ],
    targets: [
      { id: 'g14-t1', label: '14.1', text: 'Phase out single-use plastics across households, businesses, and government by 2030.' },
      { id: 'g14-t2', label: '14.2', text: "Protect 100% of Addu's significant wildlife habitats and ecological sites by 2030." },
    ],
    openNote: 'These two targets are printed as "9.1" and "9.2" in the source deck; they are renumbered here to match the goal.',
    strategies: [
      {
        id: 'g14-s1',
        number: '01',
        title: 'Build climate resilience',
        actions: [
          { id: 'g14-s1-a1', text: 'Develop roadside drainage system' },
          { id: 'g14-s1-a2', text: 'Construct flood control near wetlands' },
          { id: 'g14-s1-a3', text: 'Establish sea level and climate observation infrastructure' },
          { id: 'g14-s1-a4', text: 'Establish air and water quality monitoring systems' },
        ],
      },
      {
        id: 'g14-s2',
        number: '02',
        title: 'Eliminate single use plastics',
        actions: [
          { id: 'g14-s2-a1', text: 'Eliminate plastic water bottles' },
          { id: 'g14-s2-a2', text: 'Establish a water testing laboratory' },
          { id: 'g14-s2-a3', text: 'Enable in-Addu glass bottling of water and soft drinks' },
          { id: 'g14-s2-a4', text: 'Launch an initiative for alternative bags' },
        ],
      },
      {
        id: 'g14-s3',
        number: '03',
        title: 'A circular economy Addu',
        actions: [
          { id: 'g14-s3-a1', text: 'Establish a 3 bin waste segregation at source system' },
          { id: 'g14-s3-a2', text: 'Build a modern recycling centre' },
          { id: 'g14-s3-a3', text: 'Develop infrastructure to convert organic waste to compost' },
          { id: 'g14-s3-a4', text: 'Establish Repair and Reuse Hub for furniture and appliances' },
        ],
      },
    ],
  },
  {
    number: 15,
    slug: 'celebrate-culture',
    title: 'Celebrate culture',
    color: '#48A0A4',
    textColor: '#357578',
    tagline: 'Heritage as a living part of everyday life',
    summary: `This goal focuses on safeguarding historical sites, traditions, language, and cultural practices while promoting awareness and participation across generations. It aims to strengthen community pride, support cultural expression, and ensure that heritage is respected and sustained as a living part of everyday life and future development. Enhancing cultural heritage also enriches the visitor experience by offering authentic, meaningful, and immersive encounters. By showcasing local traditions, stories, and heritage sites, visitors gain a deeper understanding of the community's identity and values. This not only creates memorable experiences but also encourages longer stays, repeat visits, and positive word-of-mouth, contributing to sustainable tourism and local economic growth.`,
    stats: [],
    targets: [],
    strategies: [],
    openNote: 'Baseline figures, targets and strategies for this goal are still to be set. Your comments here will help shape them.',
  },
]

/* ------------------------------------------------------------ initiatives */

export const INITIATIVES_INTRO = {
  title: 'Ten flagship initiatives',
  body: 'Ten closely related initiatives will be pursued to achieve the vision of Sustainable Addu City.',
} as const

export const INITIATIVES: Initiative[] = [
  {
    number: '01',
    title: 'Home solar and battery storage',
    text: 'We are taking a major step toward a cleaner, more affordable energy future for our community. We are launching a new initiative to install a 4 kWp solar PV system on every household in Addu along with 10 kWh battery storage.',
  },
  {
    number: '02',
    title: 'Free electric bus service',
    text: 'We will launch a free electric bus service across the City connecting all important places, designed to make daily travel easier, more affordable, and environmentally friendly for all residents and visitors.',
  },
  {
    number: '03',
    title: 'Starter homes for young families',
    text: 'We will provide young families 250 starter homes. These homes will be powered by renewable energy, provide safe water, and include gardens and open spaces where children can play, learn, and grow.',
  },
  {
    number: '04',
    title: 'Every home is a food grower',
    text: 'We will support households to grow essentials such as lime, chilli, ginger, cucumber, tomato, gourds, mangoes, passion fruit and guava by providing seed packs, compost, training, guidance, and ongoing support.',
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
