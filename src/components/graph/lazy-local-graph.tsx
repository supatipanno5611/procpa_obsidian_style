'use client'

import dynamic from 'next/dynamic'

const LocalGraph = dynamic(
  () => import('./local-graph').then((m) => m.LocalGraph),
  { ssr: false },
)

export function LazyLocalGraph({ currentSlug }: { currentSlug: string }) {
  return <LocalGraph currentSlug={currentSlug} />
}
