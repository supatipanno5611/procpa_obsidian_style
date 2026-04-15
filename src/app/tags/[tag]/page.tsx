import Link from 'next/link'
import type { Metadata } from 'next'
import { posts, series, chapters } from '#site/content'
import { VaultLayout } from '@/components/vault/vault-layout'
import { DocList, type CategoryDoc } from '@/components/doc-list'

interface PageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const allTags = new Set<string>()
  for (const p of posts) if (!p.draft) for (const t of p.tags) allTags.add(t)
  for (const s of series) if (!s.draft) for (const t of s.tags) allTags.add(t)
  return [...allTags].map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const visiblePosts = posts.filter((p) => !p.draft && p.tags.includes(decodedTag))
  const visibleSeries = series.filter((s) => !s.draft && s.tags.includes(decodedTag))
  const count = visiblePosts.length + visibleSeries.length
  const desc = `#${decodedTag} 태그의 글 ${count}개`
  return {
    title: `#${decodedTag}`,
    description: desc,
    alternates: { canonical: `/tags/${decodedTag}` },
    openGraph: { title: `#${decodedTag}`, description: desc, images: [{ url: '/og-default.png', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: `#${decodedTag}`, description: desc, images: ['/og-default.png'] },
  }
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)

  const tagPosts = posts.filter((p) => !p.draft && p.tags.includes(decodedTag))
  const tagSeries = series.filter((s) => !s.draft && s.tags.includes(decodedTag))

  const docs: CategoryDoc[] = [
    ...tagSeries.map((s) => {
      const cc = chapters.filter((c) => !c.draft && c.series === s.slugAsParams)
      const lastSynced = cc.map((c) => c.last_synced).filter(Boolean).sort().pop()
      return {
        type: 'series' as const,
        title: s.title,
        description: s.description,
        url: `/${s.slugAsParams}`,
        date: s.date ?? '',
        tags: s.tags,
        cover: s.cover,
        chapterCount: cc.length,
        lastUpdated: lastSynced ?? undefined,
      }
    }),
    ...tagPosts.map((p) => ({
      type: 'post' as const,
      title: p.title,
      description: p.description,
      url: `/${p.slugAsParams}`,
      date: p.date,
      tags: p.tags,
    })),
  ]

  const seriesCount = tagSeries.length
  const postCount = tagPosts.length
  const statParts = [
    seriesCount > 0 && `시리즈 ${seriesCount}`,
    postCount > 0 && `포스트 ${postCount}`,
  ].filter(Boolean)

  return (
    <VaultLayout>
      <header className="mb-10">
        <nav className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          {' ⟩ '}
          <Link href="/tags" className="hover:text-foreground">Tags</Link>
          {' ⟩ '}
          <span>#{decodedTag}</span>
        </nav>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">#{decodedTag}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {statParts.join(' · ')}
        </p>
      </header>

      <DocList docs={docs} emptyMsg="이 태그에 해당하는 글이 없습니다." />
    </VaultLayout>
  )
}
