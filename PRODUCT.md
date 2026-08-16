# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Residents of Addu City** are the primary audience — people reading a plan that
proposes what their city becomes between 2026 and 2031, and responding to the parts
of it that touch their own street, school, clinic or livelihood. They arrive without
an account, on their own time, often on a phone, and may respond across several
sittings rather than one.

**Council and ministry stakeholders** are a second, named audience. This site is the
public face of the plan, not only a comment box: council members, ministries and
other institutional readers use it to see the plan as published and to read what came
back. The `/admin` results panel serves the council side of that directly.

## Product Purpose

Publish the Addu Development Plan 2026–2031 as the Addu City Council drafted it, and
let residents respond to every strategy and action in it.

Success is a genuine two-way consultation: the council reaches its target audience
and receives feedback worth acting on, and the site is what makes that easy from both
directions — easy for a resident to read the plan and say something useful about a
specific action, and easy for the council to receive, read and act on what came back.
Neither raw response volume nor a defensible paper record is the goal on its own;
engagement that produces valuable feedback is.

## Positioning

A government plan published as something a resident can actually answer, action by
action. The plan is not summarised into a feedback form — the full draft is the
site, and every individual action carries its own response control. Anonymity is
structural, not a policy line: nothing identifying is ever asked for or stored, so
responding costs a resident nothing.

## Operating Context

- The source of truth is the Addu City Council's draft slide deck, currently the
  **16 August draft**. The site's content model transcribes it.
- A resident's responses accumulate in a browser-local basket across sittings, then
  are reviewed and sent as one set. Until sent, the basket lives only in
  `localStorage`.
- The council reads results through an invite-only `/admin` panel: totals, reaction
  split per goal, comments in context, CSV and JSON export.
- Access to results is two independent things — signing in proves identity, a row in
  `admin_viewers` grants read, and row-level security enforces the second.

## Capabilities and Constraints

- The plan is **five pillars** and **twelve goals**, each with targets, numbered
  strategies and actions. The deck disagreed with itself on the pillar count until the
  16 August draft, which settles it at five in both places. It still does not say which
  goals sit under which pillar, so the site asserts no mapping.
- Every action carries three reactions — Support, Not sure, Concern — plus an optional
  comment.
- **Action `id`s are stable keys.** Feedback is keyed on them; never renumber in place.
- **Nothing unfinished is published.** Where the source deck has placeholder counts or
  incomplete targets, the item is omitted and the goal carries an `openNote`.
- **The source deck is considered content-complete.** Content shape may be relied on
  and hardcoded into layout; the site no longer has to absorb arbitrary future
  restructuring cheaply.
- **English-only today; Dhivehi is expected eventually.** `lang="en"` is current state,
  not a settled decision. Future work must not make choices that would block a Dhivehi
  version — no baked-in LTR assumptions, no text welded into images, no layout that
  only works at English string lengths.
- Stack: Next.js 16 (App Router), React 19, Tailwind CSS 4, GSAP + Motion + Lenis for
  the scroll and reveal layer, Hugeicons, Supabase (Postgres + Auth). This Next version
  carries breaking changes — see `AGENTS.md`.

## Brand Commitments

- **The official City of Addu identity is binding.** The council logo
  (`public/plan/brand/`) and the deck's own goal colours are official marks. Goal
  colours are read from the deck's badge plates and converted out of the Apple RGB
  profile into sRGB, with an accessible darkened variant for type. Future work honours
  these rather than substituting a nicer palette.
- **Voice: the council's, not a machine's.** The plan's wording is the council's own
  and must not read as AI-written. Summarising and rewording *are* permitted where a
  better design or layout calls for it — this is not a transcription lock — but the
  result must sound like the council wrote it, and must never invent a figure, target
  or claim the deck does not make.

## Evidence on Hand

- `lib/plan.ts` — the whole content model, transcribed from the council's draft with
  provenance notes on every revised figure.
- Real historical data: settlement timeline 1620–1976, and a registered-vs-resident
  population ledger 1977–2025 with the Maldivian/foreign split from 2006 on.
- `public/plan/brand/` — official City of Addu logo, three variants.
- `public/plan/hero/white-tern.jpg` — the one photographic asset.
- **No** testimonials, case studies, press, endorsements or partner logos exist.
  Future work must not fabricate them. Costings, monitoring frames and the council's
  internal GIS layers exist in the source deck but are deliberately not published —
  the Financing tables are printed with empty cost columns.

## Product Principles

1. **The deck is the truth.** Publish what the council drafted. Reword for clarity or
   layout; never invent, never inflate, never let a figure drift from its source.
2. **Say "still open" rather than publish a wrong number.** An unfinished source
   becomes an `openNote`, not a guess.
3. **Responding must cost nothing.** No account, no name, no email — and a basket that
   survives a closed tab, so a resident can answer twelve goals across twelve sittings.
4. **Both directions must be easy.** The consultation succeeds only if it is as light
   for the council to read the response as it is for a resident to give one.
5. **This is an official publication.** It carries the city's identity and the
   council's voice, and its credibility is part of the product.

## Accessibility & Inclusion

- Goal colours ship in two forms — the printed plate colour for large filled shapes,
  and a darkened variant that clears 4.5:1 on white for anything type-sized. Three of
  the four printed colours fail as body text, so this pairing is load-bearing.
- `prefers-reduced-motion` is honoured across the scroll and reveal layer.
- Phone-first reading is the common case, not the edge case.
- Dhivehi (Thaana, RTL) is an anticipated future requirement — see Capabilities.
