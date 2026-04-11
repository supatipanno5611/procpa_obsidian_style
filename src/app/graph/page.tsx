import type { Metadata } from 'next'
import { GlobalGraph } from '@/components/graph/global-graph'

export const metadata: Metadata = {
  title: 'Graph',
  description: '전체 vault 노트 네트워크 조감도',
  alternates: { canonical: '/graph' },
  openGraph: {
    images: [{
      url: '/api/og?kicker=PROCPA&title=%EC%A7%80%EC%8B%9D%20%EA%B7%B8%EB%9E%98%ED%94%84',
      width: 1200,
      height: 630,
    }],
  },
}

export default function GraphPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Graph
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">노트 네트워크</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          모든 노트의 연결 관계를 시각화합니다.
        </p>
      </header>
      <GlobalGraph />
    </main>
  )
}
