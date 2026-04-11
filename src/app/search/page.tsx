import Link from 'next/link'
import type { Metadata } from 'next'
import { getSearchDocs } from '@/lib/search'

export const metadata: Metadata = {
  title: '검색',
  description: '키워드, 태그, 기간으로 모든 글을 검색합니다.',
  alternates: { canonical: '/search' },
}

interface PageProps {
  searchParams: Promise<{
    q?: string
    type?: 'post' | 'series' | 'chapter'
    tag?: string
    from?: string
    to?: string
  }>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const q = (sp.q ?? '').trim().toLowerCase()
  const type = sp.type
  const tag = sp.tag
  const from = sp.from
  const to = sp.to

  const all = getSearchDocs()
  const results = all.filter((d) => {
    if (type && d.type !== type) return false
    if (tag && !d.tags.includes(tag)) return false
    if (from && d.date && d.date < from) return false
    if (to && d.date && d.date > to) return false
    if (q) {
      const hay = `${d.title} ${d.description} ${d.tags.join(' ')} ${d.body}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  const allTags = [...new Set(all.flatMap((d) => d.tags))].sort()

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Search
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">검색</h1>
      </header>

      <form className="mb-10 space-y-4" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="검색어…"
          className="w-full rounded-md border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-foreground/60"
        />
        <div className="grid gap-3 sm:grid-cols-4">
          <select
            name="type"
            defaultValue={type ?? ''}
            className="rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
          >
            <option value="">모든 타입</option>
            <option value="post">포스트</option>
            <option value="series">시리즈</option>
            <option value="chapter">챕터</option>
          </select>
          <select
            name="tag"
            defaultValue={tag ?? ''}
            className="rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
          >
            <option value="">모든 태그</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                #{t}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="from"
            defaultValue={from}
            className="rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
          />
          <input
            type="date"
            name="to"
            defaultValue={to}
            className="rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          검색
        </button>
      </form>

      <p className="mb-4 text-sm text-muted-foreground">{results.length}개의 결과</p>
      <ul className="divide-y divide-border/60">
        {results.map((r) => (
          <li key={r.id} className="py-4">
            <Link href={r.url} className="group block">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-medium group-hover:text-primary">{r.title}</h2>
                <span className="font-mono text-[10px] uppercase text-muted-foreground">{r.type}</span>
              </div>
              {r.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
