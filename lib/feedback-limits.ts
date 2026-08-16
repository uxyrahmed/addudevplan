/**
 * The one shape limit the comment box and the server both have to agree on.
 *
 * Its own module because the comment box is a client component and
 * `lib/feedback-payload.ts` — where this used to live, and still re-exports
 * from — imports `lib/plan.ts` to check action ids. Importing the constant from
 * there would pull the whole plan, the largest module in the project, into the
 * browser bundle for the sake of one number.
 */

/** Matches the length check on public.responses.comment. */
export const MAX_COMMENT_LENGTH = 4000
