# Addu Development Plan 2026–2031 — consultation site

A public consultation site for the Addu Development Plan 2026–2031, published by the
Addu City Council. It presents the plan's vision, four pillars and fifteen goals, and
lets residents respond to every strategy and action in it.

## Getting started

```bash
npm install
```

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build
```

```bash
npm run lint
```

## Stack

- **Next.js 16** (App Router) with **React 19**
- **Tailwind CSS 4**
- **GSAP**, **Motion** and **Lenis** for the scroll and reveal layer
- **Hugeicons** for iconography

This repo tracks a Next.js version with breaking changes from older releases — read the
relevant guide in `node_modules/next/dist/docs/` before writing new code. See
[AGENTS.md](AGENTS.md).

## Layout

| Path | What lives there |
| --- | --- |
| `app/` | Routes — the home page, `app/goals/[slug]` for each goal, root layout and global CSS |
| `lib/plan.ts` | The whole content model: plan metadata, vision, pillars, goals, strategies, actions |
| `components/home/` | Home-page sections — hero, vision, population gap, migration chart, timeline |
| `components/plan/` | Goal grid, goal cards, badges and strategy lists |
| `components/feedback/` | The response controls, the running basket and the review panel |
| `components/motion/` | Scroll progress, smooth scroll, reveals and view transitions |
| `components/site/` | Header, footer and goal navigation |
| `public/plan/` | Brand assets, including the official City of Addu logo |

## Content

All plan copy lives in [`lib/plan.ts`](lib/plan.ts), transcribed from the council's draft
slide deck. Goals, targets and strategies come from the 21 July draft; front-of-deck
figures, the settlement timeline and the cover date follow the 29 July revision. Goal
colours are read from the deck's own colour values, so they match the presentation.

Two conventions matter when editing it:

- **Action `id`s are stable keys.** Feedback is keyed on them, so never renumber an id
  in place.
- **Nothing unfinished is published.** Where the source deck has placeholder counts or
  incomplete targets, the item is left out and the goal carries an `openNote` instead.

## Feedback

Every action carries three reactions — Support, Not sure, Concern — plus an optional
comment. Responses accumulate into a basket that opens a review panel, grouped by goal,
where a visitor can edit or remove any response, download a copy, or send the set to the
council.

The response shape is `{ [actionId]: { reaction, comment } }`, produced in
[`components/feedback/feedback-store.tsx`](components/feedback/feedback-store.tsx);
`markSubmitted` is the submission entry point.
