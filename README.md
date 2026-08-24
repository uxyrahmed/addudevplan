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
| `app/[lang]/layout.tsx` | The document shell for the consultation — `lang`, `dir`, fonts, metadata, global CSS. A root layout under a dynamic segment, which is what puts the reader's language on `<html>` |
| `app/[lang]/(site)/` | The public consultation: the home page, `goals/[slug]`, and the chrome around them. A route group, so the URLs are `/en`, `/dv/goals/…` |
| `app/admin/` | The council's results panel, behind a sign-in. Its own root layout, English only, and outside `[lang]` |
| `app/api/feedback/` | Where a basket is posted, and withdrawn |
| `app/api/admin/export/` | CSV and JSON export of every response |
| `proxy.ts` | The `/admin` gate and session refresh, plus the locale redirect for any public path arriving without one. Next 16's rename of `middleware` |
| `lib/plan.ts` | The whole content model: plan metadata, vision, pillars, goals, strategies, actions. English, and the source every translation overlays |
| `lib/plan-translations/` | Translations of the plan itself, keyed by the ids in `lib/plan.ts`. Partial by design — a goal at a time |
| `lib/plan-i18n.ts` | Merges the two and caches the result per language |
| `lib/i18n/` | The locale list, the UI dictionaries, and the `{name}` placeholder helpers |
| `lib/feedback-scope.ts` | The reserved key for the one response that is about the plan rather than an action |
| `lib/supabase/` | One client per context: browser, server (session-carrying), and anonymous |
| `lib/admin/` | The session check and the queries behind the results screens |
| `components/home/` | Home-page sections — hero, vision, population gap, migration chart, timeline |
| `components/plan/` | Goal grid, goal cards, badges and strategy lists |
| `components/feedback/` | The response controls, the running basket and the review panel |
| `components/admin/` | The results shell, sign-in form and reaction bar |
| `components/motion/` | Scroll progress, smooth scroll, reveals and view transitions |
| `components/site/` | Header, footer, goal navigation and the language switcher |
| `components/i18n/` | Carries the language and its dictionary to the parts of the site that run in the browser |
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

## Languages

The consultation is published in English and Dhivehi. The language is a path segment —
`/en/goals/energy-security`, `/dv/goals/energy-security` — so a Dhivehi link opens in
Dhivehi for whoever it is sent to. A request arriving without one is redirected to the
language the browser asks for; `/admin` is outside all of this and stays English at one
address.

There are two things to translate, and they are separate on purpose:

- **The site's chrome** — labels, controls, headings the deck did not supply — lives in
  [`lib/i18n/en.ts`](lib/i18n/en.ts) and [`lib/i18n/dv.ts`](lib/i18n/dv.ts). `en` defines
  the shape and `dv` is typed against it, so a string added to one is a compile error in
  the other until it is translated. Interpolation is a `{name}` placeholder rather than a
  concatenation, so a sentence can put its figures where the language wants them.
- **The plan itself** lives in [`lib/plan.ts`](lib/plan.ts) in English, and each
  translation is a partial overlay in [`lib/plan-translations/`](lib/plan-translations/)
  keyed by the ids already in it. Anything the overlay does not carry falls through to the
  English underneath, so the plan can be translated a goal at a time — and an overlay
  cannot add a target, drop an action or renumber anything, because it holds no ids,
  figures or ordering of its own.

**Dhivehi is complete** — all twelve goals with their 55 targets, 58 strategies and 230
actions, plus the turning-point passage, the five pillars, the ten flagship initiatives
and the settlement timeline.

Every word of it was checked against **Radheef**, the Dhivehi dictionary, under the rule
that a word with no entry there is not used. Two sources are treated as attestation: the
36,271 headwords that carry at least one meaning, and — more usefully — the word forms
appearing inside Radheef's own definitions, which are naturally inflected and so resolve
the ordinary prose a lemma list cannot. Of 5,266 word tokens, about 89% resolve. What does
not is deliberate and of three kinds:

- **Technical terms Dhivehi has no native word for**, carried as the standard
  transliteration the way Dhivehi technical writing carries them — `ސޯލާ ޕީވީ`,
  `ބެޓެރި ސްޓޯރޭޖް`, `ވަރޓިޕޯޓް`. A Dhivehi word was searched for first in every case, and
  found more often than not: "AI" became `މަސްނޫއީ ބުއްދި`, "meditation" `ފިކުރުކުރުން`,
  "library" `ކުތުބުޚާނާ`, "eco-tourism" `ތިމާވެށީގެ ފަތުރުވެރިކަން`.
- **Place names**, which a dictionary does not list: `ހިތަދޫ`, `މަރަދޫ`, `ފޭދޫ`.
- **Inflected forms whose root is attested** but whose ending defeats a stemmer —
  `ތިމާވެއްޓާ` against the headword `ތިމާވެށި`. Real Dhivehi; imperfect checking.

One word is none of those: `އިއާދަކުރަނިވި` ("renewable") has no Radheef entry in any
spelling. It is the Maldivian government's own term and the dictionary predates it.

Spellings were settled against hit counts rather than taste — `ޝާމިލުވާ` over `ޝާމިލް`
(9 hits to 0), `ތަސައްވުރު` over `ތަޞައްވުރު` (8 to 0), `އިޤުތިޞާދު` because it is an
exact headword where `އިޤްތިޞާދު` and `އިގްތިސާދު` are not.

**It has not been read by a native speaker.** That is the one thing still owed before this
goes in front of residents.

Dhivehi is written in Thaana and reads right to left. `dir="rtl"` on `<html>` does most of
the work, because the layout is built on flexbox, grid and logical properties; what CSS
cannot mirror by itself — a transform's origin, an animation's direction, an arrow's
meaning — is handled in the block at the end of
[`app/globals.css`](app/globals.css).

None of the three Latin faces draws a Thaana letter, so the Dhivehi edition brings three
of its own — one per role, so the same three voices survive translation. They live in
[`app/fonts/`](app/fonts/) and are loaded with `next/font/local`:

| Role | Dhivehi | Latin |
| --- | --- | --- |
| Display | MV Aammu FK | Merriweather |
| Heading | MV Typewriter — strategies, labels, buttons, figures | Google Sans |
| Body | MV Faseyha | Google Sans |

Questrial is not used in the Dhivehi edition: it ships one weight, and the Latin beside a
Thaana label has to be able to go bold to sit level with it. Two further Thaana faces sit
in `app/fonts/` unreferenced, kept as candidates rather than deleted — AK Rasmee
(ރަސްމީ, "official") and Sangu Suruhee (ސުރުހީ, "headline"). Nothing loads them, so they
cost no `@font-face` and no request.

The Latin faces sit **behind** the Thaana ones rather than being replaced, and each
Thaana face carries a `unicode-range` that stops at its own script. So every run of text
is drawn by the face built for it: Thaana by the Thaana fonts, and the figures, the
"kWh" and "MVR", and the goal titles still awaiting translation by the same faces the
English edition sets them in. It also means an English page never downloads a Thaana
font at all — a browser only fetches a file if the page sets a character inside its
range.

Of the three in use only MV Aammu FK ships a single weight, and `font-synthesis-weight`
is off — so a `font-bold` on Dhivehi display type is ignored rather than faked. That is
the right place for the gap: the display role is one line set once, and both roles that
take emphasis inside them have a drawn bold. On licensing, only AK Rasmee arrived with
one (OFL, kept beside it); the fonts actually in use should be confirmed as clear for web
embedding before this is published.

Type sizes are shared with the English edition — a `--dv-text-scale` multiplier was tried
and reverted. What the Dhivehi edition does change is the leading and the word spacing — Thaana hangs
its vowels above and below the consonant, so lines set for Latin collide. Both are set by
redefining the `--text-*--line-height` tokens under `:lang(dv)` rather than on `body`,
because almost every string on the site sits inside a `text-body` / `text-lead` /
`text-small` utility, and those set their own line height from the tokens. Tracking is
deliberately *not* used: Thaana joins, so letter-spacing prises words apart —
`word-spacing` is the tool that opens the gap without breaking the word.

One more thing the script needs: a figure and its unit have to be held together. Left to
the bidirectional algorithm, `75%` renders as `%75` and `16.2 kWh` as `kWh 16.2` — the
unit jumps the number. [`lib/i18n/bidi.ts`](lib/i18n/bidi.ts) wraps every
number-and-Latin-unit in a Unicode left-to-right isolate, applied once as the localized
plan and the dictionary are built. A number followed by a *Thaana* word is deliberately
left alone: that pair already reads correctly, and isolating it would reverse it.

## Feedback

Every action carries three reactions — Support, Not sure, Concern — plus an optional
comment. A reaction is one click and needs no confirming; a comment is posted
deliberately, with a button or ⌘/Ctrl + Enter, so half a sentence never reaches the
council.

One response is not about an action. The plan as a whole takes a comment of its own,
in the `#feedback` section of the home page and read back in the review panel, for
what does not belong under any single action. It is words only — no reactions, since
three buttons on the whole document would produce a for-or-against number on the plan
that this consultation was not designed to collect, and the server strips a reaction
off that key whatever arrives on the wire. It travels in the same basket as everything
else and is keyed on the reserved id in
[`lib/feedback-scope.ts`](lib/feedback-scope.ts), which is namespaced away from the
plan's `g{goal}-s{strategy}-a{action}` ids and, like them, must never be renamed.

**Answers send themselves.** There is no final step to miss: each edit starts a short
quiet window, and when the answering stops the whole basket goes. A burst of clicks down
one strategy is one request, not one per click. Every send carries the entire basket and
the endpoint replaces the last one, so a send is idempotent — a coalesced burst, a
retry, and a resend after a dropped connection all leave the same rows. A page being
hidden flushes through `sendBeacon`; a failure retries on a backoff and the basket stays
in `localStorage` meanwhile, so nothing typed is lost.

The basket also lives in `localStorage`, so a visitor can respond over several sittings
without an account, and anything the council has not acknowledged is sent again on the
next visit. The review panel is now a record rather than a gate: it groups every goal,
shows what has been sent, and lets a visitor edit or remove a response or download a
copy.

[`components/feedback/feedback-store.tsx`](components/feedback/feedback-store.tsx) posts
to `/api/feedback`, which validates every action id against `lib/plan.ts` and calls a
single database function.

**The device and the council always agree.** Deleting your feedback is a real
withdrawal, behind a confirmation: `DELETE /api/feedback` calls `withdraw_feedback`,
which removes the submission for the caller's own cookie hash and takes the responses
with it. The council's copy goes first and the device only clears if that succeeded, so
a failure leaves both sides as they were rather than stranding a basket nobody can reach.
Emptying the basket one response at a time withdraws it the same way — an endpoint with
nothing to file would otherwise have quietly left the last set standing.

### Anonymity, and what stops a repeat submission

Nothing identifying is asked for or stored — no name, no email, no raw IP address. Two
things keep one resident from counting twice, neither of which needs an identity:

- **A per-browser token** in an `httpOnly` cookie. Sending again *replaces* that
  browser's earlier basket rather than adding a second one, which is what makes sending
  on every edit safe as well as what lets a resident revise their mind. Only an HMAC of
  the token is stored.
- **Coarse flood control** on an HMAC of the address, capped at 25 *other* submitters an
  hour: the check excludes a submitter's own revisions, so answering 230 actions costs a
  resident nothing against it. Sized to stop a script, not to ration a household —
  mobile carriers in Addu put many genuine residents behind one address.

Both hashes use `FEEDBACK_HASH_SECRET` as a pepper, so neither can be reversed or
replayed against a guessed list of addresses. Be honest about the ceiling: someone who
clears their cookies and changes network can submit again. No anonymous scheme can
prevent that — preventing it is exactly what asking for identity buys, and this
consultation chose not to ask.

## The results panel

`/admin` shows the council what came in: totals, the reaction split per goal, every
comment in context, and a CSV or JSON export. It is invite-only and `noindex`.

Comments on the plan as a whole belong to no goal, so they get their own card on the
overview and their own filter — `/admin/comments?goal=plan` — rather than being mixed
into the twelve. They count towards the headline response and comment totals, because
they are responses, and towards no goal's row.

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
every submission goes through one `security definer` function — `submit_feedback` — that
checks the secret, validates the payload and rate-limits before inserting. Its counterpart
`withdraw_feedback` takes the same secret and can only ever reach the caller's own row,
because the submitter hash it deletes by is derived from an `httpOnly` cookie the page
cannot read. Nothing else in the app can write to these tables. A leak of that secret
would let someone file junk feedback — not read a single response, which is what leaking
a service-role key would cost.
