import Link from 'next/link'
import type { Metadata } from 'next'
import { series, chapters } from '#site/content'

export const metadata: Metadata = {
  title: '시리즈',
  description: '하나의 주제를 여러 글로 엮은 전자책 형태의 콘텐츠.',
}

export default function SeriesIndexPage() {
  const list = series
    .filter((s) => !s.draft)
    .sort((a, b) => a.order - b.order || +new Date(b.date) - +new Date(a.date))

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">시리즈</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          하나의 주제를 여러 글로 엮은 전자책 형태의 콘텐츠입니다.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {list.map((s) => {
          const count = chapters.filter((c) => c.series === s.slugAsParams && !c.draft).length
          return (
            <Link
              key={s.slug}
              href={`/series/${s.slugAsParams}`}
              className="group rounded-xl border border-border/60 p-6 transition-colors hover:border-foreground/40"
            >
              <div className="mb-3 font-mono text-xs text-muted-foreground">{count}개 챕터</div>
              <h2 className="text-lg font-medium group-hover:text-primary">{s.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
