import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Consultation results', template: '%s — Consultation results' },
  // Residents' responses are not public. Even behind a login, keep the whole
  // section out of search indexes.
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
