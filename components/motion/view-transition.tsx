import * as React from 'react'

/** A class name, or a map of transition type -> class name. */
type Anim = string | Record<string, string>

export type ViewTransitionProps = {
  children: React.ReactNode
  /** Shared identity across routes — matching names morph into each other. */
  name?: string
  default?: Anim
  enter?: Anim
  exit?: Anim
  share?: Anim
  update?: Anim
}

/**
 * React's `<ViewTransition>` is still experimental: Next.js aliases `react` to
 * a build that includes it (with `experimental.viewTransition`), but the public
 * `@types/react` does not declare it yet. This wrapper reads it off the runtime
 * and renders children untouched when it is absent, so a stable React or a
 * missing flag degrades to a plain navigation instead of a crash.
 */
const Runtime = (React as unknown as { ViewTransition?: React.ComponentType<ViewTransitionProps> })
  .ViewTransition

export function ViewTransition({ children, ...props }: ViewTransitionProps) {
  if (!Runtime) return <>{children}</>
  return <Runtime {...props}>{children}</Runtime>
}

export const hasViewTransitions = Boolean(Runtime)

const addTransitionType = (
  React as unknown as { addTransitionType?: (type: string) => void }
).addTransitionType

/**
 * Runs a navigation under a named view-transition type.
 *
 * `<Link transitionTypes>` covers ordinary links, but `router.back()` takes no
 * options — so a history pop would otherwise animate with no type at all, and
 * the `page-back` CSS would never match. Tagging the transition by hand gives
 * the back button the same slide as the link that brought you here.
 */
export function withTransitionType(type: string, run: () => void) {
  if (!addTransitionType) return run()
  React.startTransition(() => {
    addTransitionType(type)
    run()
  })
}
