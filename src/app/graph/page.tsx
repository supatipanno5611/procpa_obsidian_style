import type { Metadata } from 'next'
import { GlobalGraph } from '@/components/graph/global-graph'

export const metadata: Metadata = {
  title: 'Graph',
  description: '전체 vault 노트 네트워크 조감도',
}

export default function GraphPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-6">
        <h1 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          / graph
        </h1>
        <p className="mt-2 text-2xl font-semibold tracking-tight">노트 네트워크</p>
      </header>
      <GlobalGraph />
    </main>
  )
}
