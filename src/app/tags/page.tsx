import Link from 'next/link'
import type { Metadata } from 'next'
import { posts } from '#site/content'

export const metadata: Metadata = { title: '태그' }

export default function TagsPage() {
  const counts = new Map<string, number>()
  for (const p of posts) {
    if (p.draft) continue
    for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  }
  const tags = [...counts.entries()].sort((a, b) => b[1] - a[1])

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-10 text-3xl font-semibold tracking-tight">태그</h1>
      <div className="flex flex-wrap gap-3">
        {tags.map(([tag, count]) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="rounded-full border border-border/60 px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            #{tag} <span className="ml-1 font-mono text-xs">{count}</span>
          </Link>
        ))}
        {tags.length === 0 && <p className="text-sm text-muted-foreground">태그가 없습니다.</p>}
      </div>
    </div>
  )
}
