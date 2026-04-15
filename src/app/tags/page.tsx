import Link from 'next/link'
import type { Metadata } from 'next'
import { posts, series } from '#site/content'
import { VaultLayout } from '@/components/vault/vault-layout'

export const metadata: Metadata = {
  title: 'Tags',
  description: '모든 태그 목록',
  alternates: { canonical: '/tags' },
}

export default function TagsIndexPage() {
  const tagCounts = new Map<string, number>()
  for (const p of posts) {
    if (p.draft) continue
    for (const t of p.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
  }
  for (const s of series) {
    if (s.draft) continue
    for (const t of s.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
  }

  const sorted = [...tagCounts.entries()].sort((a, b) => b[1] - a[1])

  return (
    <VaultLayout>
      <header className="mb-10">
        <nav className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          {' ⟩ '}
          <span>Tags</span>
        </nav>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Tags</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {sorted.length}개의 태그
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {sorted.map(([tag, count]) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            #{tag}
            <span className="font-mono text-[10px] opacity-60">{count}</span>
          </Link>
        ))}
      </div>
    </VaultLayout>
  )
}
