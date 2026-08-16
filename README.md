# Addu Development Plan 2026–2031 — consultation site

A public consultation site for the Addu Development Plan 2026–2031, published by the
Addu City Council. It presents the plan's vision, five pillars and twelve goals, and
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
- **Supabase** (Postgres + Auth) for stored responses and the council's admin panel

This repo tracks a Next.js version with breaking changes from older releases — read the
relevant guide in `node_modules/next/dist/docs/` before writing new code. See
[AGENTS.md](AGENTS.md).

## Layout

| Path | What lives there |
| --- | --- |
| `app/layout.tsx` | The document shell only — fonts, metadata, global CSS |
| `app/(site)/` | The public consultation: the home page, `goals/[slug]`, and the chrome around them. A route group, so the URLs are `/` and `/goals/…` |
| `app/admin/` | The council's results panel, behind a sign-in |
| `app/api/feedback/` | Where a submitted basket is posted |
| `app/api/admin/export/` | CSV and JSON export of every response |
| `proxy.ts` | Session refresh and the `/admin` gate. Next 16's rename of `middleware` |
| `lib/plan.ts` | The whole content model: plan metadata, vision, pillars, goals, strategies, actions |
| `lib/supabase/` | One client per context: browser, server (session-carrying), and anonymous |
| `lib/admin/` | The session check and the queries behind the results screens |
| `components/home/` | Home-page sections — hero, vision, population gap, migration chart, timeline |
| `components/plan/` | Goal grid, goal cards, badges and strategy lists |
| `components/feedback/` | The response controls, the running basket and the review panel |
| `components/admin/` | The results shell, sign-in form and reaction bar |
| `components/motion/` | Scroll progress, smooth scroll, reveals and view transitions |
| `components/site/` | Header, footer and goal navigation |
| `public/plan/` | Brand assets, including the official City of Addu logo |

## Content

All plan copy lives in [`lib/plan.ts`](lib/plan.ts), transcribed from the council's draft
slide deck — currently the 16 August draft. Where a figure has not been restated since an
earlier revision, the comment at that figure names the draft it came from. Goal colours
are read from the deck's own colour values, so they match the presentation.

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

Until it is sent, a basket lives only in `localStorage`, so a visitor can respond over
several sittings without an account. `submit` in
[`components/feedback/feedback-store.tsx`](components/feedback/feedback-store.tsx) posts
it to `/api/feedback`, which validates every action id against `lib/plan.ts` and calls a
single database function.

### Anonymity, and what stops a repeat submission

Nothing identifying is asked for or stored — no name, no email, no raw IP address. Two
things keep one resident from counting twice, neither of which needs an identity:

- **A per-browser token** in an `httpOnly` cookie. Sending again *replaces* that
  browser's earlier basket rather than adding a second one, which is also what lets a
  resident revise their mind. Only an HMAC of the token is stored.
- **Coarse flood control** on an HMAC of the address, capped at 25 submissions an hour.
  Sized to stop a script, not to ration a household — mobile carriers in Addu put many
  genuine residents behind one address.

Both hashes use `FEEDBACK_HASH_SECRET` as a pepper, so neither can be reversed or
replayed against a guessed list of addresses. Be honest about the ceiling: someone who
clears their cookies and changes network can submit again. No anonymous scheme can
prevent that — preventing it is exactly what asking for identity buys, and this
consultation chose not to ask.

## The results panel

`/admin` shows the council what came in: totals, the reaction split per goal, every
comment in context, and a CSV or JSON export. It is invite-only and `noindex`.

Access is two independent things. Signing in proves who you are; a row in
`admin_viewers` decides whether you may read anything. Row-level security enforces the
second in the database, so an account that is not on the list reads back nothing even if
it reaches the API directly.

### Giving someone access

1. In the Supabase dashboard, **Authentication → Users → Invite user**, and enter their
   council address. No one but they ever sets the password.
2. In the SQL editor, put them on the allowlist:

   ```sql
   select public.grant_admin_viewer('name@adducity.gov.mv', 'Their Name');
   ```

Revoking is `delete from public.admin_viewers where email = '…'` — access is the row,
not the password.

## Configuration

Copy [`.env.example`](.env.example) to `.env.local` and fill in the four values it
documents. The two `NEXT_PUBLIC_` ones are safe in the browser; the other two are
server-only secrets.

`FEEDBACK_WRITE_SECRET` must match the row in `private.app_secrets`. It exists because
the publishable key is public by design, so it alone cannot be what authorises a write:
every submission goes through one `security definer` function that checks the secret,
validates the payload and rate-limits before inserting. Nothing else in the app can write
to these tables. A leak of that secret would let someone file junk feedback — not read a
single response, which is what leaking a service-role key would cost.
