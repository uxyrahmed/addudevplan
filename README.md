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
| `lib/plan-translations/` | Translations of the plan itself, keyed by the ids in `lib/plan.ts`. Partial by design — a goal at a time. Generated; see `scripts/` |
| `scripts/` | The translation round trip: `i18n-extract.mts` writes the English out, `i18n-apply.mts` puts what comes back in, `i18n-units.mts` restores the unit symbols |
| `translation/` | The English transcript that goes out, the Dhivehi that comes back, and the manifest tying the two together |
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
default edition rather than negotiated on `Accept-Language` — see the note on the Dhivehi
edition being unlisted below; `/admin` is outside all of this and stays English at one
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

### Where the Dhivehi stands

**The chrome is complete** — every string, so no English word appears inside a Dhivehi
sentence anywhere in the interface. Sixteen of those strings are now translations of
English the council has since revised, and `lib/i18n/dv.ts` cannot be regenerated until
they come back: it is typed `Dictionary`, so it is all the keys or none. `npm run
i18n:apply` names the sixteen.

**The plan is all twelve goals**, with their targets, strategies and actions, along with
the cover, the vision, the turning-point passage, the settlement timeline, the five
pillars and the flagship initiatives. Four pieces are open, all from the 3 September
review: the initiatives heading and its sentence, which counted ten and now count eleven;
the new Modern Smart Link Road's paragraph; and the two goal titles that lost a word,
`water-security` and `connect-community-and-culture`. Each falls through to the English
underneath — which is the overlay working as intended, not a gap to be papered over.

An earlier machine translation covered all twelve goals and was withdrawn: it read as a
government gazette throughout, because every string — button, error, screen-reader
description and plan prose alike — had been translated in one undifferentiated run. None
of it survives. `lib/i18n/dv.ts` and `lib/plan-translations/dv.ts` are regenerated
wholesale from the current transcripts, never merged into.

### How it is made

Both files are **generated**. Editing them by hand loses the edit on the next run.

```bash
npm run i18n:extract          # writes the English out to translation/english/
npm run i18n:apply            # reports what came back; writes nothing
npm run i18n:apply -- --write # regenerates both dv.ts files
npm run i18n:units -- --write # puts unit symbols back where the English has one
```

[`scripts/i18n-extract.mts`](scripts/i18n-extract.mts) walks both English sources and
emits one numbered transcript in 19 files, each small enough to paste into a translation
tool in one go. The files are split **by register rather than by page** — a file of
nothing but buttons, headed by an instruction saying so, is the direct fix for what went
wrong the first time.

[`scripts/i18n-apply.mts`](scripts/i18n-apply.mts) reads whatever comes back into
`translation/dhivehi/` and trusts nothing about it except the `[nnnn]` markers. A segment
is dropped rather than repaired if a `{slot}` changed — losing one prints a sentence with
a hole in it, inventing one prints a literal `{count}` to a resident — or if it holds no
Thaana, which means the English came back unchanged. Changed figures warn without
blocking, because a Dhivehi ordinal can legitimately swallow a digit the English had.

The chrome is all-or-nothing for the reason above: `dv.ts` is typed as `Dictionary`, so a
missing key does not compile, and a key filled with English would be worse than either
language alone. Until every one is present, `--write` leaves that file untouched and says
so. The plan overlay has no such gate — it is partial by design.

[`translation/README.md`](translation/README.md) is the working guide.

**It has not been read by a native speaker.** The checks above are mechanical: they prove
a `{slot}` survived and the text is Thaana, never that it reads well. That is the one
thing still owed before this goes in front of residents, and it is why `proxy.ts` does not
negotiate on `Accept-Language` and the chrome carries no language switcher — `/dv` is
reachable by typing or sharing the URL and by nothing else. Turning it on is one call:
`matchLocale` in [`lib/i18n/config.ts`](lib/i18n/config.ts), kept and tested for exactly
that.

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

Every action carries two reactions — a thumb up (`support`) and a thumb down
(`concern`), icon only — plus an optional comment. A third, `unsure`, was offered
until 10 September 2026; it stays in the database enum, the validator and the results
screens because it was answered before it went, but no button offers it now. A
reaction is one click and needs no confirming; a comment is posted
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
