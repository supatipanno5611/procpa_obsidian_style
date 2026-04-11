import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { posts, series, chapters } from '#site/content'
import { isKnownTopic, topicLabel, type TopicKey } from '@/lib/topics'
import { MDXContent } from '@/components/mdx-content'
import { ContentAside } from '@/components/content-aside'
import { FolderPostsSidebar } from '@/components/folder-posts-sidebar'
import { ReadingProgress } from '@/components/reading-progress'
import { ShareButtons } from '@/components/share-buttons'
import { MobileCollapsible } from '@/components/mobile-collapsible'
import { BacklinksPanel } from '@/components/backlinks-panel'
import { LocalGraph } from '@/components/graph/local-graph'
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from '@/components/json-ld'
import { VaultSidebar, type VaultData } from '@/components/vault/vault-sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { buildVaultTree } from '@/lib/vault-tree'

const SITE = 'https://procpa.co.kr'

function getVaultData(): VaultData {
  const visiblePosts = posts.filter((p) => !p.draft)
  const visibleSeries = series.filter((s) => !s.draft)
  const tagCounts = new Map<string, number>()
  for (const p of visiblePosts) for (const t of p.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
  const tagList: [string, number][] = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  return {
    tree: buildVaultTree(visiblePosts, visibleSeries),
    counts: { posts: visiblePosts.length, series: visibleSeries.length, tags: tagCounts.size },
    tags: tagList,
  }
}

function VaultLayout({ children }: { children: React.ReactNode }) {
  const vaultData = getVaultData()
  return (
    <div className="border-t border-border/60">
      <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-5xl grid-cols-12 gap-0 px-6 lg:px-0">
        <aside className="hidden border-border/60 lg:col-span-3 lg:block lg:border-r">
          <div className="group/sidebar sticky top-14 h-[calc(100vh-3.5rem)]">
            <ScrollArea className="h-full [&_[data-slot=scroll-area-scrollbar]]:opacity-0 [&_[data-slot=scroll-area-scrollbar]]:transition-opacity group-hover/sidebar:[&_[data-slot=scroll-area-scrollbar]]:opacity-100">
              <div className="px-6 py-8">
                <VaultSidebar data={vaultData} />
              </div>
            </ScrollArea>
          </div>
        </aside>
        <section className="col-span-12 min-w-0 lg:col-span-9">
          <div className="py-8 sm:py-10 lg:px-12 lg:py-8">
            {children}
          </div>
        </section>
      </div>
    </div>
  )
}

interface PageProps {
  params: Promise<{ slug: string[] }>
}

// ── Resolve content by full path ──

type CategoryDoc = {
  type: 'post' | 'series'
  title: string
  description: string
  url: string
  date: string
  tags: string[]
}

type Resolved =
  | {
      type: 'post'
      post: (typeof posts)[number]
      prev?: (typeof posts)[number]
      next?: (typeof posts)[number]
    }
  | { type: 'series'; series: (typeof series)[number]; tree: ChapterNode[]; totalCount: number }
  | {
      type: 'chapter'
      series: (typeof series)[number]
      chapter: (typeof chapters)[number]
      tree: ChapterNode[]
      flat: (typeof chapters)[number][]
      prev?: (typeof chapters)[number]
      next?: (typeof chapters)[number]
    }
  | {
      type: 'category'
      category: TopicKey
      label: string
      subcategories: string[]
      docs: CategoryDoc[]
    }
  | {
      type: 'subcategory'
      category: TopicKey
      categoryLabel: string
      subcategory: string
      docs: CategoryDoc[]
    }

function resolveContent(path: string): Resolved | null {
  const segments = path.split('/')

  // 0. Category page: e.g. "accounting"
  if (segments.length === 1 && isKnownTopic(segments[0])) {
    const cat = segments[0] as TopicKey
    const catPosts = posts.filter((p) => !p.draft && p.category === cat)
    const catSeries = series.filter((s) => !s.draft && s.category === cat)
    const subcategories = [...new Set([
      ...catPosts.map((p) => p.subcategory),
      ...catSeries.map((s) => s.subcategory),
    ])].filter(Boolean).sort() as string[]
    const docs: CategoryDoc[] = [
      ...catSeries.map((s) => ({
        type: 'series' as const,
        title: s.title,
        description: s.description,
        url: `/${s.slugAsParams}`,
        date: s.date ?? '',
        tags: s.tags,
      })),
      ...catPosts.map((p) => ({
        type: 'post' as const,
        title: p.title,
        description: p.description,
        url: `/${p.slugAsParams}`,
        date: p.date,
        tags: p.tags,
      })),
    ]
    return { type: 'category', category: cat, label: topicLabel(cat), subcategories, docs }
  }

  // 0b. Subcategory page: e.g. "accounting/일반"
  if (segments.length === 2 && isKnownTopic(segments[0])) {
    const cat = segments[0] as TopicKey
    const sub = segments[1]
    const subPosts = posts.filter((p) => !p.draft && p.category === cat && p.subcategory === sub)
    const subSeries = series.filter((s) => !s.draft && s.category === cat && s.subcategory === sub)
    if (subPosts.length > 0 || subSeries.length > 0) {
      const docs: CategoryDoc[] = [
        ...subSeries.map((s) => ({
          type: 'series' as const,
          title: s.title,
          description: s.description,
          url: `/${s.slugAsParams}`,
          date: s.date ?? '',
          tags: s.tags,
        })),
        ...subPosts.map((p) => ({
          type: 'post' as const,
          title: p.title,
          description: p.description,
          url: `/${p.slugAsParams}`,
          date: p.date,
          tags: p.tags,
        })),
      ]
      return { type: 'subcategory', category: cat, categoryLabel: topicLabel(cat), subcategory: sub, docs }
    }
  }
  // 1. Post
  const post = posts.find((p) => p.slugAsParams === path)
  if (post && !post.draft) {
    // 같은 폴더(category+subcategory) 내 포스트 날짜순 정렬 → 이전/다음
    const siblings = posts
      .filter(
        (p) =>
          !p.draft &&
          p.category === post.category &&
          p.subcategory === post.subcategory,
      )
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    const idx = siblings.findIndex((p) => p.slugAsParams === path)
    return {
      type: 'post',
      post,
      prev: siblings[idx + 1], // 더 오래된 글 = 이전
      next: siblings[idx - 1], // 더 최근 글 = 다음
    }
  }

  // 2. Series landing
  const s = series.find((s) => s.slugAsParams === path)
  if (s && !s.draft) {
    const tree = buildChapterTree(s.slugAsParams)
    const totalCount = chapters.filter((c) => c.series === s.slugAsParams && !c.draft).length
    return { type: 'series', series: s, tree, totalCount }
  }

  // 3. Chapter
  const chapter = chapters.find((c) => c.slugAsParams === path)
  if (chapter && !chapter.draft) {
    const sr = series.find((s) => s.slugAsParams === chapter.series)
    if (sr) {
      const tree = buildChapterTree(sr.slugAsParams)
      const flat = flattenTree(tree)
      const idx = flat.indexOf(chapter)
      return {
        type: 'chapter',
        series: sr,
        chapter,
        tree,
        flat,
        prev: flat[idx - 1],
        next: flat[idx + 1],
      }
    }
  }

  return null
}

// ── Chapter tree ──

type ChapterNode = {
  chapter: (typeof chapters)[number]
  children: ChapterNode[]
}

function buildChapterTree(seriesSlugAsParams: string): ChapterNode[] {
  const all = chapters
    .filter((c) => c.series === seriesSlugAsParams && !c.draft)
    .sort((a, b) => a.order - b.order)

  const roots: ChapterNode[] = []
  const byPath = new Map<string, ChapterNode>()

  // withinSeries: strip the series prefix (topic/sub/series) to get chapter-relative path
  const seriesPrefix = seriesSlugAsParams + '/'

  for (const c of all) {
    const withinSeries = c.slugAsParams.startsWith(seriesPrefix)
      ? c.slugAsParams.slice(seriesPrefix.length)
      : c.slugAsParams
    const node: ChapterNode = { chapter: c, children: [] }
    byPath.set(withinSeries, node)

    if (!c.parentPath) {
      roots.push(node)
    } else {
      const parent = byPath.get(c.parentPath)
      if (parent) parent.children.push(node)
      else roots.push(node)
    }
  }
  return roots
}

function flattenTree(nodes: ChapterNode[]): (typeof chapters)[number][] {
  const result: (typeof chapters)[number][] = []
  for (const node of nodes) {
    result.push(node.chapter)
    if (node.children.length > 0) result.push(...flattenTree(node.children))
  }
  return result
}

// ── Static params ──

export async function generateStaticParams() {
  const all: { slug: string[] }[] = []

  // Category pages (e.g. /accounting)
  const categories = new Set<string>()
  const subcategories = new Set<string>()
  for (const p of posts) {
    if (p.draft) continue
    if (p.category) categories.add(p.category)
    if (p.category && p.subcategory) subcategories.add(`${p.category}/${p.subcategory}`)
  }
  for (const s of series) {
    if (s.draft) continue
    if (s.category) categories.add(s.category)
    if (s.category && s.subcategory) subcategories.add(`${s.category}/${s.subcategory}`)
  }
  for (const cat of categories) all.push({ slug: [cat] })
  for (const sub of subcategories) all.push({ slug: sub.split('/') })

  // Content pages
  for (const p of posts) all.push({ slug: p.slugAsParams.split('/') })
  for (const s of series) all.push({ slug: s.slugAsParams.split('/') })
  for (const c of chapters) all.push({ slug: c.slugAsParams.split('/') })
  return all
}

// ── Metadata ──

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params
  const path = rawSlug.map((s) => decodeURIComponent(s)).join('/')
  const r = resolveContent(path)
  if (!r) return {}

  if (r.type === 'category') {
    return { title: r.label, description: `${r.label} 카테고리의 모든 글`, alternates: { canonical: `/${path}` } }
  }
  if (r.type === 'subcategory') {
    return { title: `${r.subcategory} · ${r.categoryLabel}`, description: `${r.categoryLabel} > ${r.subcategory}의 모든 글`, alternates: { canonical: `/${path}` } }
  }

  if (r.type === 'post') {
    const { post } = r
    const ogUrl = `/api/og?kicker=${encodeURIComponent('PROCPA · POST')}&title=${encodeURIComponent(
      post.title,
    )}&subtitle=${encodeURIComponent(post.description)}&meta=${encodeURIComponent(post.date.slice(0, 10))}`
    return {
      title: post.title,
      description: post.description,
      alternates: { canonical: `/${post.slugAsParams}` },
      openGraph: { title: post.title, description: post.description, type: 'article', publishedTime: post.date, images: [{ url: ogUrl, width: 1200, height: 630 }] },
      twitter: { card: 'summary_large_image', title: post.title, description: post.description, images: [ogUrl] },
    }
  }

  if (r.type === 'series') {
    const { series: s } = r
    const ogUrl = `/api/og?kicker=${encodeURIComponent('PROCPA · SERIES')}&title=${encodeURIComponent(
      s.title,
    )}&subtitle=${encodeURIComponent(s.description)}&meta=${encodeURIComponent(`${r.totalCount}개 챕터`)}`
    return {
      title: s.title,
      description: s.description,
      alternates: { canonical: `/${s.slugAsParams}` },
      openGraph: { title: s.title, description: s.description, type: 'article', images: [{ url: ogUrl, width: 1200, height: 630 }] },
      twitter: { card: 'summary_large_image', title: s.title, description: s.description, images: [ogUrl] },
    }
  }

  // chapter
  const title = `${r.chapter.title} · ${r.series.title}`
  const description = r.chapter.description ?? r.series.description
  const ogUrl = `/api/og?kicker=${encodeURIComponent('PROCPA · SERIES')}&title=${encodeURIComponent(
    r.chapter.title,
  )}&subtitle=${encodeURIComponent(description)}&meta=${encodeURIComponent(r.series.title)}`
  return {
    title,
    description,
    alternates: { canonical: `/${r.chapter.slugAsParams}` },
    openGraph: { title, description, type: 'article', images: [{ url: ogUrl, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogUrl] },
  }
}

// ── Chapter list (series landing) ──

function ChapterList({
  nodes,
  depth = 0,
  counter,
}: {
  nodes: ChapterNode[]
  depth?: number
  counter: { value: number }
}) {
  return (
    <ol className={depth > 0 ? 'ml-6 border-l border-border/60' : 'divide-y divide-border/60'}>
      {nodes.map((node) => {
        const i = ++counter.value
        return (
          <li key={node.chapter.slug}>
            <Link
              href={`/${node.chapter.slugAsParams}`}
              className="group flex items-baseline gap-4 py-4"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {String(i).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <h3 className="font-medium group-hover:text-primary">{node.chapter.title}</h3>
                {node.chapter.description && (
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {node.chapter.description}
                  </p>
                )}
              </div>
            </Link>
            {node.children.length > 0 && (
              <ChapterList nodes={node.children} depth={depth + 1} counter={counter} />
            )}
          </li>
        )
      })}
    </ol>
  )
}

// ── Sidebar (chapter page) ──

function SidebarList({
  nodes,
  activeSlug,
  depth = 0,
}: {
  nodes: ChapterNode[]
  activeSlug: string
  depth?: number
}) {
  return (
    <ol className={depth > 0 ? 'ml-3 space-y-0.5' : 'space-y-1 border-l border-border/60'}>
      {nodes.map((node) => {
        const active = node.chapter.slug === activeSlug
        return (
          <li key={node.chapter.slug}>
            <Link
              href={`/${node.chapter.slugAsParams}`}
              className={`block border-l-2 px-4 py-1.5 text-sm transition-colors ${
                active
                  ? '-ml-[2px] border-primary text-foreground'
                  : '-ml-[2px] border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {node.chapter.title}
            </Link>
            {node.children.length > 0 && (
              <SidebarList nodes={node.children} activeSlug={activeSlug} depth={depth + 1} />
            )}
          </li>
        )
      })}
    </ol>
  )
}

// ── Page ──

export default async function ContentPage({ params }: PageProps) {
  const { slug: rawSlug } = await params
  const path = rawSlug.map((s) => decodeURIComponent(s)).join('/')
  const r = resolveContent(path)
  if (!r) notFound()

  if (r.type === 'category') return <CategoryView r={r} />
  if (r.type === 'subcategory') return <SubcategoryView r={r} />
  if (r.type === 'post') return <PostView post={r.post} prev={r.prev} next={r.next} />
  if (r.type === 'series') return <SeriesView r={r} />
  return <ChapterView r={r} />
}

// ── Post view ──

function PostView({
  post,
  prev,
  next,
}: {
  post: (typeof posts)[number]
  prev?: (typeof posts)[number]
  next?: (typeof posts)[number]
}) {
  const url = `${SITE}/${post.slugAsParams}`
  return (
    <>
    <ReadingProgress />
    <div className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.description,
          url,
          datePublished: post.date,
          dateModified: post.updated,
          image: `${SITE}/api/og?kicker=${encodeURIComponent('PROCPA · POST')}&title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.description)}&meta=${encodeURIComponent(post.date.slice(0, 10))}`,
          tags: post.tags,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: '홈', url: SITE },
          { name: post.title, url },
        ])}
      />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)_220px]">
        {/* ── Left sidebar: folder posts ── */}
        <FolderPostsSidebar
          currentSlug={post.slugAsParams}
          category={post.category}
          subcategory={post.subcategory}
        />

        {/* ── Main content ── */}
        <article className="min-w-0">
          <header className="mb-10 border-b border-border/60 pb-6">
            <nav className="mb-4 font-mono text-[11px] text-muted-foreground">
              <Link href={`/${post.category}`} className="hover:text-foreground">{topicLabel(post.category)}</Link>
              {' / '}
              <Link href={`/${post.category}/${post.subcategory}`} className="hover:text-foreground">{post.subcategory}</Link>
            </nav>
            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <time className="font-mono">{post.date.slice(0, 10)}</time>
              {post.updated && post.updated !== post.date && (
                <>
                  <span>·</span>
                  <span className="font-mono">수정 {post.updated.slice(0, 10)}</span>
                </>
              )}
              <span>·</span>
              <span>{post.metadata.readingTime}분 읽기</span>
              <span className="ml-auto"><ShareButtons url={url} title={post.title} /></span>
            </div>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded border border-border/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
            )}
          </header>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <MDXContent code={post.body} />
          </div>

          {/* 이전/다음 네비게이션 */}
          {(prev || next) && (
            <nav className="mt-16 flex items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm">
              {prev ? (
                <Link href={`/${prev.slugAsParams}`} className="group min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground">이전</div>
                  <div className="truncate group-hover:text-primary">← {prev.title}</div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {next ? (
                <Link href={`/${next.slugAsParams}`} className="group min-w-0 flex-1 text-right">
                  <div className="text-xs text-muted-foreground">다음</div>
                  <div className="truncate group-hover:text-primary">{next.title} →</div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </nav>
          )}

          {/* 모바일: 백링크/그래프를 본문 아래에 표시 */}
          <div className="lg:hidden">
            <BacklinksPanel slug={post.slugAsParams} />
            <LocalGraph currentSlug={post.slugAsParams} />
          </div>
        </article>

        {/* ── Right aside (desktop only) ── */}
        <ContentAside toc={post.toc} slug={post.slugAsParams} />
      </div>
    </div>
    </>
  )
}

// ── Series landing view ──

function SeriesView({ r }: { r: Extract<Resolved, { type: 'series' }> }) {
  const s = r.series
  return (
    <VaultLayout>
      <header className="mb-10 border-b border-border/60 pb-6">
        <nav className="mb-3 font-mono text-[11px] text-muted-foreground">
          <Link href={`/${s.category}`} className="hover:text-foreground">{topicLabel(s.category)}</Link>
          {' / '}
          <Link href={`/${s.category}/${s.subcategory}`} className="hover:text-foreground">{s.subcategory}</Link>
          {' / '}
          <span className="uppercase tracking-wider">Series</span>
        </nav>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">{s.description}</p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">{r.totalCount}개 챕터</p>
      </header>
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          목차
        </h2>
        <ChapterList nodes={r.tree} counter={{ value: 0 }} />
      </section>
    </VaultLayout>
  )
}

// ── Chapter view ──

function ChapterView({ r }: { r: Extract<Resolved, { type: 'chapter' }> }) {
  const url = `${SITE}/${r.chapter.slugAsParams}`
  return (
    <>
    <ReadingProgress />
    <div className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        data={articleJsonLd({
          title: `${r.chapter.title} · ${r.series.title}`,
          description: r.chapter.description ?? r.series.description,
          url,
          datePublished: r.series.date ?? '',
          image: `${SITE}/api/og?kicker=${encodeURIComponent('PROCPA · SERIES')}&title=${encodeURIComponent(r.chapter.title)}&subtitle=${encodeURIComponent(r.chapter.description ?? r.series.description)}&meta=${encodeURIComponent(r.series.title)}`,
          tags: r.series.tags,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: '홈', url: SITE },
          { name: r.series.title, url: `${SITE}/${r.series.slugAsParams}` },
          { name: r.chapter.title, url },
        ])}
      />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)_220px]">
        {/* ── Left sidebar: chapter navigation ── */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <Link
              href={`/${r.series.slugAsParams}`}
              className="block font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              ← {r.series.title}
            </Link>
            <div className="mt-6">
              <SidebarList nodes={r.tree} activeSlug={r.chapter.slug} />
            </div>
          </div>
        </aside>

        {/* ── Mobile: chapter navigation ── */}
        <MobileCollapsible title={`${r.series.title} · 목차`}>
          <SidebarList nodes={r.tree} activeSlug={r.chapter.slug} />
        </MobileCollapsible>

        {/* ── Main content ── */}
        <article className="min-w-0">
          <header className="mb-10 border-b border-border/60 pb-6">
            <div className="mb-2 flex items-center justify-between">
              <nav className="font-mono text-[11px] text-muted-foreground">
                <Link href={`/${r.series.category}`} className="hover:text-foreground">{topicLabel(r.series.category)}</Link>
                {' / '}
                <Link href={`/${r.series.category}/${r.series.subcategory}`} className="hover:text-foreground">{r.series.subcategory}</Link>
                {' / '}
                <Link href={`/${r.series.slugAsParams}`} className="hover:text-foreground">{r.series.title}</Link>
              </nav>
              <ShareButtons url={url} title={r.chapter.title} />
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {r.chapter.title}
            </h1>
          </header>

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <MDXContent code={r.chapter.body} />
          </div>

          <nav className="mt-16 flex items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm">
            {r.prev ? (
              <Link href={`/${r.prev.slugAsParams}`} className="group min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">이전</div>
                <div className="truncate group-hover:text-primary">← {r.prev.title}</div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {r.next ? (
              <Link href={`/${r.next.slugAsParams}`} className="group min-w-0 flex-1 text-right">
                <div className="text-xs text-muted-foreground">다음</div>
                <div className="truncate group-hover:text-primary">{r.next.title} →</div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </nav>

          {/* 모바일: 백링크/그래프를 본문 아래에 표시 */}
          <div className="lg:hidden">
            <BacklinksPanel slug={r.chapter.slugAsParams} />
            <LocalGraph currentSlug={r.chapter.slugAsParams} />
          </div>
        </article>

        {/* ── Right aside (desktop only) ── */}
        <ContentAside toc={r.chapter.toc} slug={r.chapter.slugAsParams} />
      </div>
    </div>
    </>
  )
}

// ── Category view ──

function DocList({ docs, emptyMsg }: { docs: CategoryDoc[]; emptyMsg?: string }) {
  if (docs.length === 0) return <p className="text-sm text-muted-foreground">{emptyMsg ?? '글이 없습니다.'}</p>
  const seriesDocs = docs.filter((d) => d.type === 'series')
  const postDocs = docs.filter((d) => d.type === 'post').sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-10">
      {seriesDocs.length > 0 && (
        <div>
          <h3 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            시리즈 · {seriesDocs.length}
          </h3>
          <div className="grid gap-3">
            {seriesDocs.map((d) => (
              <Link
                key={d.url}
                href={d.url}
                className="group flex items-baseline gap-4 rounded-md border border-border/60 px-4 py-3.5 transition-colors hover:border-foreground/40"
              >
                <span className="font-mono text-[11px] text-muted-foreground">▸</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-medium group-hover:text-primary">{d.title}</div>
                  {d.description && (
                    <div className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-muted-foreground">
                      {d.description}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {postDocs.length > 0 && (
        <div>
          <h3 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            포스트 · {postDocs.length}
          </h3>
          <ul className="divide-y divide-border/60">
            {postDocs.map((d) => (
              <li key={d.url}>
                <Link
                  href={d.url}
                  className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-4"
                >
                  <div className="flex min-w-0 flex-1 items-baseline gap-3">
                    <span className="font-mono text-[11px] text-muted-foreground group-hover:text-foreground">▸</span>
                    <span className="flex-1 text-[15px] leading-snug group-hover:text-primary">{d.title}</span>
                  </div>
                  {d.date && (
                    <span className="pl-6 font-mono text-[10px] text-muted-foreground sm:pl-0">
                      {d.date.slice(0, 10).replace(/-/g, '.')}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function CategoryView({ r }: { r: Extract<Resolved, { type: 'category' }> }) {
  return (
    <VaultLayout>
      <header className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Category
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{r.label}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {r.docs.length}개의 글 · {r.subcategories.length}개의 서브카테고리
        </p>
      </header>

      {r.subcategories.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            서브카테고리
          </h2>
          <div className="flex flex-wrap gap-2">
            {r.subcategories.map((sub) => (
              <Link
                key={sub}
                href={`/${r.category}/${sub}`}
                className="rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                {sub}
              </Link>
            ))}
          </div>
        </div>
      )}

      <DocList docs={r.docs} />
    </VaultLayout>
  )
}

// ── Subcategory view ──

function SubcategoryView({ r }: { r: Extract<Resolved, { type: 'subcategory' }> }) {
  return (
    <VaultLayout>
      <header className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <Link href={`/${r.category}`} className="hover:text-foreground">{r.categoryLabel}</Link>
          {' / '}
          {r.subcategory}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{r.subcategory}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {r.docs.length}개의 글
        </p>
      </header>

      <DocList docs={r.docs} />
    </VaultLayout>
  )
}
