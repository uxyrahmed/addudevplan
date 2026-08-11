import { checkCouncilViewer } from '@/lib/admin/session'
import { createClient } from '@/lib/supabase/server'
import { describeAction } from '@/lib/admin/results'
import { PLAN } from '@/lib/plan'

/** Supabase caps a single select at 1000 rows, so an export walks the table. */
const PAGE = 1000

type Row = {
  submission_id: string
  action_id: string
  reaction: string | null
  comment: string | null
  created_at: string
}

/**
 * Spreadsheets treat a leading =, +, - or @ as the start of a formula, so a
 * comment beginning with one would be executed rather than read. Prefixing a
 * single quote is the standard defence and is invisible in the cell.
 */
function deformula(value: string) {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
}

function csvCell(value: string | number | null) {
  if (value === null) return ''
  const text = deformula(String(value))
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

export async function GET(request: Request) {
  // A route handler is as public as any other endpoint, so it re-checks rather
  // than trusting proxy.ts. Answers with a status rather than a redirect: this
  // is fetched, not navigated to.
  const check = await checkCouncilViewer()
  if (check.status === 'anonymous') {
    return Response.json({ error: 'Sign in first.' }, { status: 401 })
  }
  if (check.status === 'not-allowed') {
    return Response.json({ error: 'This account cannot read the results.' }, { status: 403 })
  }

  const format = new URL(request.url).searchParams.get('format') === 'json' ? 'json' : 'csv'

  const supabase = await createClient()
  const rows: Row[] = []

  for (let page = 0; ; page += 1) {
    const { data, error } = await supabase
      .from('responses')
      .select('submission_id, action_id, reaction, comment, created_at')
      .order('created_at', { ascending: true })
      .range(page * PAGE, page * PAGE + PAGE - 1)

    if (error) {
      return Response.json({ error: `Could not read responses: ${error.message}` }, { status: 502 })
    }
    if (!data?.length) break
    rows.push(...(data as Row[]))
    if (data.length < PAGE) break
  }

  const enriched = rows.map((row) => {
    const place = describeAction(row.action_id)
    return {
      submission: row.submission_id,
      submittedAt: row.created_at,
      goalNumber: place?.goal.number ?? null,
      goal: place?.goal.title ?? null,
      strategy: place ? `${place.strategy.number} ${place.strategy.title}` : null,
      action: place?.text ?? null,
      actionId: row.action_id,
      reaction: row.reaction,
      comment: row.comment,
    }
  })

  const stamp = new Date().toISOString().slice(0, 10)

  if (format === 'json') {
    return Response.json(
      {
        plan: `${PLAN.title} ${PLAN.period}`,
        exportedAt: new Date().toISOString(),
        responses: enriched,
      },
      {
        headers: {
          'Content-Disposition': `attachment; filename="addu-plan-responses-${stamp}.json"`,
          'Cache-Control': 'no-store',
        },
      },
    )
  }

  const header = [
    'submission',
    'submitted_at',
    'goal_number',
    'goal',
    'strategy',
    'action',
    'action_id',
    'reaction',
    'comment',
  ]

  const body = enriched.map((r) =>
    [
      r.submission,
      r.submittedAt,
      r.goalNumber,
      r.goal,
      r.strategy,
      r.action,
      r.actionId,
      r.reaction,
      r.comment,
    ]
      .map(csvCell)
      .join(','),
  )

  // A BOM so Excel opens it as UTF-8 rather than mangling the typographic
  // quotes and any Dhivehi a resident typed.
  const csv = `﻿${[header.join(','), ...body].join('\r\n')}\r\n`

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="addu-plan-responses-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
