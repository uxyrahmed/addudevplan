import { createHmac, randomUUID } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { createAnonClient } from '@/lib/supabase/anon'
import { validateSubmission } from '@/lib/feedback-payload'

/**
 * Opaque per-browser token. Its only job is to let a resident change their mind:
 * a second send carrying the same token replaces the first basket instead of
 * filing a second one.
 *
 * httpOnly so page scripts cannot read or forge it, and a year long because a
 * consultation runs for months and a resident may come back to revise.
 */
const SUBMITTER_COOKIE = 'addu-submitter'
const SUBMITTER_MAX_AGE = 60 * 60 * 24 * 365

/**
 * Neither the token nor the address is stored as given — both are HMAC'd with a
 * server-side pepper first, so the database holds no reversible trace of who
 * responded. Without the pepper the hashes cannot be replayed against a guessed
 * IP list either, which a plain SHA-256 of an address would allow.
 */
function peppered(value: string, pepper: string) {
  return createHmac('sha256', pepper).update(value).digest('hex')
}

/**
 * The client address, as reported by whatever sits in front of the app.
 *
 * Spoofable by design — these are request headers — which is exactly why it is
 * used for nothing but coarse flood control, never for identity or for blocking
 * an individual.
 */
function clientAddress(h: Headers) {
  const forwarded = h.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return h.get('x-real-ip')?.trim() || null
}

export async function POST(request: Request) {
  const writeSecret = process.env.FEEDBACK_WRITE_SECRET
  const pepper = process.env.FEEDBACK_HASH_SECRET
  if (!writeSecret || !pepper) {
    console.error('Feedback submission is not configured: set FEEDBACK_WRITE_SECRET and FEEDBACK_HASH_SECRET.')
    return Response.json({ error: 'We cannot receive responses right now. Your answers are saved on this device — please try again later.' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Expected JSON.' }, { status: 400 })
  }

  const validated = validateSubmission(body)
  if (!validated.ok) {
    return Response.json({ error: validated.error }, { status: 400 })
  }
  if (validated.unknownIds.length) {
    // Worth knowing about: it usually means a deployed basket outlived an edit
    // to lib/plan.ts, which the README warns against.
    console.warn(`Dropped ${validated.unknownIds.length} response(s) for unknown action ids.`)
  }

  const cookieStore = await cookies()
  const existing = cookieStore.get(SUBMITTER_COOKIE)?.value
  const token = existing ?? randomUUID()

  const address = clientAddress(await headers())

  const supabase = createAnonClient()
  const { data, error } = await supabase.rpc('submit_feedback', {
    p_secret: writeSecret,
    p_submitter_hash: peppered(token, pepper),
    p_ip_hash: address ? peppered(address, pepper) : null,
    p_responses: validated.responses,
  })

  if (error) {
    // The function raises these; anything else is genuinely unexpected.
    if (error.message.includes('rate_limited')) {
      return Response.json(
        { error: 'This connection has sent feedback several times in the last hour. Your answers are saved on this device — please try again later.' },
        { status: 429 },
      )
    }
    if (error.message.includes('unauthorized')) {
      console.error('submit_feedback rejected the write secret — FEEDBACK_WRITE_SECRET is out of step with private.app_secrets.')
      return Response.json({ error: 'We cannot receive responses right now. Your answers are saved on this device — please try again later.' }, { status: 503 })
    }
    console.error('submit_feedback failed:', error.message)
    return Response.json(
      {
        error:
          'Your feedback could not be saved. Your answers are still on this device — please try sending again.',
      },
      { status: 502 },
    )
  }

  const result = data as { submissionId: string; revision: number; responses: number }

  // Set only after the write succeeded: a browser that got an error should be
  // able to retry as a first submission rather than as a revision of nothing.
  if (!existing) {
    cookieStore.set(SUBMITTER_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: SUBMITTER_MAX_AGE,
      path: '/',
    })
  }

  return Response.json({
    ok: true,
    responses: result.responses,
    // True when this replaced an earlier basket, so the panel can say so.
    revised: result.revision > 1,
  })
}
