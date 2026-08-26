# Translating the site

The whole site, in English, in 19 files you can paste into a translation tool one
at a time — and a way to put the Dhivehi back exactly as it comes.

```
translation/
  english/     19 numbered files. Generated. Paste these out.
  dhivehi/     Empty. Put what comes back in here.
  manifest.json   Which segment belongs where. Generated. Do not edit.
```

## What is in the transcript

683 segments, 5,933 words. Every word a resident can see, from both places the
site keeps English:

| Files | What |
| --- | --- |
| `01`–`05` | The site's own chrome — buttons, headings, status messages, screen-reader descriptions, share text. 157 segments from `lib/i18n/en.ts` |
| `06`–`07` | The plan's cover, vision, the turning-point passage, the settlement timeline, the five pillars, the ten flagship initiatives |
| `08`–`19` | One file per goal. All twelve, with their 55 targets, 58 strategies and 230 actions |

The largest file is 4.6 KB. Every file carries its own instruction header, so
whatever you paste it into is told the rules along with the text.

**One string is not in there.** `common.listSeparator` is the comma between the
island names. Dhivehi sets a list with the Arabic comma `،`, which is a fact
about the script rather than a translation decision, so `i18n-apply.mts` sets it
directly.

## Doing it

**1. Regenerate, if the English has changed since.**

```bash
npm run i18n:extract
```

**2. Paste each file out and translate it.** Paste the *whole* file, header and
all — the header is what tells the tool to keep the `[nnnn]` markers, keep the
`{slots}` in Latin, keep the digits, and which register to write in. The
register line is different in each file, and it is the thing that was missing
last time: file `01` asks for the plain Dhivehi a person actually speaks,
because it is nothing but buttons; file `08` asks for the council's own plan
voice.

**3. Save what comes back into `translation/dhivehi/`.** Any filename, any
order. Keeping the same name as the English file is easiest, but nothing reads
it — only the `[nnnn]` numbers matter.

**4. Check what landed.**

```bash
npm run i18n:apply
```

This writes nothing. It reports, file by file, how many segments came back, and
lists every one that needs looking at.

**5. Write it in.**

```bash
npm run i18n:apply -- --write
```

This regenerates `lib/i18n/dv.ts` and `lib/plan-translations/dv.ts`. Both are
generated files from then on — editing them by hand loses the edit the next time
this runs. Fix the file in `dhivehi/` and re-run instead.

## Units keep their symbols

A translation tool will render `kWh` as `ކިލޯވޮޓް-އަވަރ` and `MVR` as
`ދިވެހި ރުފިޔާ`. As prose that is right; in a figure rail it is not, because the
English beside it reads `16.2 kWh` and a unit is a symbol rather than a word.

```bash
npm run i18n:units            # report
npm run i18n:units -- --write # edit the transcripts, then re-run i18n:apply
```

The rule is narrow and checkable: **where the English writes a symbol, the
Dhivehi writes the same symbol** — and only there. `1,268 hectares of land`
spells its unit out in English, so the Dhivehi does too; `million` stays
`މިލިއަން`, being a word and not a unit.

It edits `translation/dhivehi/`, never the generated files, so the change
survives the next `i18n:apply`. Dhivehi inflects the noun being replaced, and
two of the three endings cannot simply be left in place — `ކިއުބިކް މީޓަރަށް`
becomes `cbm އަށް` and `ކިއުބިކް މީޓަރެއް` becomes `cbm އެއް`, with alifu
carrying the vowel that was written onto the noun. Only the genitive `ގެ` is
already a whole word.

## What it refuses to accept

A returned file can come back reordered, short, doubled, or with the tool's own
chatter at the top of it. Only lines matching a known `[nnnn]` are read, and a
segment is dropped rather than patched up if:

- **a `{slot}` changed.** `{count}` and the rest are holes the page fills at
  render time. Losing one prints a sentence with a gap; inventing one prints a
  literal `{count}` to a resident. The set has to match the English — where it
  sits in the sentence is the translator's business.
- **there is no Thaana in it.** The English came back unchanged, so it is
  treated as never having been translated.

Changed figures only warn, and the segment is kept. Every number on this site is
something the council measured, and the translation is meant to name the unit
and never the quantity — but a Dhivehi ordinal can legitimately add a digit the
English did not have, so this one is a list to read rather than a rule.

## The two files behave differently, on purpose

**`lib/plan-translations/dv.ts` can be partial.** Anything missing falls through
to the English in `lib/plan.ts`, so the plan can land a goal at a time. Goal 1
in Dhivehi and goals 2–12 still in English is a working site.

**`lib/i18n/dv.ts` cannot.** It is typed as `Dictionary`, so a missing key does
not compile — and a key filled in with English would print an English word
inside a Dhivehi sentence, which is worse than either language alone. So the
chrome is all 158 keys or nothing: until every one is back, `--write` leaves
that file exactly as it was and says so.

## Before it goes in front of anyone

The Dhivehi edition is unlisted. `proxy.ts` does not negotiate on
`Accept-Language` and there is no switcher in the chrome, so `/dv` is reachable
by typing or sharing the URL and by nothing else. Turning it on is one call —
`matchLocale` in `lib/i18n/config.ts`, which is kept for exactly that.

Leave it unlisted until a Dhivehi speaker has read the site as a site, not as a
list of segments. The checks here are mechanical: they can tell you a `{slot}`
survived and that the text is in Thaana. They cannot tell you it reads well.
