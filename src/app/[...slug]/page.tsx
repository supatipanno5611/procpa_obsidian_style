import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { posts, series, chapters } from '#site/content'
import { isKnownTopic, topicLabel, type TopicKey } from '@/lib/topics'
import { MDXContent } from '@/components/mdx-content'
import { TableOfContents } from '@/components/table-of-contents'
import { FolderPostsSidebar } from '@/components/folder-posts-sidebar'
import { ReadingProgress } from '@/components/reading-progress'
import { ShareButtons } from '@/components/share-buttons'
import { MobileCollapsible } from '@/components/mobile-collapsible'
import { BacklinksPanel } from '@/components/backlinks-panel'
import { LazyLocalGraph } from '@/components/graph/lazy-local-graph'
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from '@/components/json-ld'
import { VaultLayout } from '@/components/vault/vault-layout'
import { DocList, type CategoryDoc } from '@/components/doc-list'
import { ScrollArea } from '@/components/ui/scroll-area'

const SITE = 'https://procpa.co.kr'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

// ── Resolve content by full path ──

type SubcategoryInfo = {
  name: string
  postCount: number
  seriesCount: number
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
      subcategories: SubcategoryInfo[]
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
    const subNames = [...new Set([
      ...catPosts.map((p) => p.subcategory),
      ...catSeries.map((s) => s.subcategory),
    ])].filter(Boolean).sort() as string[]
    const subcategories: SubcategoryInfo[] = subNames.map((name) => ({
      name,
      postCount: catPosts.filter((p) => p.subcategory === name).length,
      seriesCount: catSeries.filter((s) => s.subcategory === name).length,
    }))
    const docs: CategoryDoc[] = [
      ...catSeries.map((s) => {
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
        ...subSeries.map((s) => {
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

function findNodeChildren(nodes: ChapterNode[], slug: string): ChapterNode[] {
  for (const node of nodes) {
    if (node.chapter.slug === slug) return node.children
    if (node.children.length > 0) {
      const found = findNodeChildren(node.children, slug)
      if (found.length > 0) return found
    }
  }
  return []
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

  const defaultOg = '/og-default.png'

  if (r.type === 'category') {
    const desc = `${r.label} 카테고리의 모든 글`
    return {
      title: r.label,
      description: desc,
      alternates: { canonical: `/${path}` },
      openGraph: { title: r.label, description: desc, images: [{ url: defaultOg, width: 1200, height: 630 }] },
      twitter: { card: 'summary_large_image', title: r.label, description: desc, images: [defaultOg] },
    }
  }
  if (r.type === 'subcategory') {
    const title = `${r.subcategory} · ${r.categoryLabel}`
    const desc = `${r.categoryLabel} > ${r.subcategory}의 모든 글`
    return {
      title,
      description: desc,
      alternates: { canonical: `/${path}` },
      openGraph: { title, description: desc, images: [{ url: defaultOg, width: 1200, height: 630 }] },
      twitter: { card: 'summary_large_image', title, description: desc, images: [defaultOg] },
    }
  }

  if (r.type === 'post') {
    const { post } = r
    const ogImage = post.cover || defaultOg
    return {
      title: post.title,
      description: post.description,
      alternates: { canonical: `/${post.slugAsParams}` },
      openGraph: { title: post.title, description: post.description, type: 'article', publishedTime: post.date, images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: 'summary_large_image', title: post.title, description: post.description, images: [ogImage] },
    }
  }

  if (r.type === 'series') {
    const { series: s } = r
    const ogImage = s.cover || defaultOg
    return {
      title: s.title,
      description: s.description,
      alternates: { canonical: `/${s.slugAsParams}` },
      openGraph: { title: s.title, description: s.description, type: 'article', images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: 'summary_large_image', title: s.title, description: s.description, images: [ogImage] },
    }
  }

  // chapter
  const title = `${r.chapter.title} · ${r.series.title}`
  const description = r.chapter.description ?? r.series.description
  const ogImage = r.series.cover || defaultOg
  return {
    title,
    description,
    alternates: { canonical: `/${r.chapter.slugAsParams}` },
    openGraph: { title, description, type: 'article', images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
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
  seriesHref,
  depth = 0,
}: {
  nodes: ChapterNode[]
  activeSlug: string
  seriesHref?: string
  depth?: number
}) {
  return (
    <ol className={depth > 0 ? 'ml-3 space-y-0.5' : 'space-y-1 border-l border-border/60'}>
      {depth === 0 && seriesHref && (
        <li>
          <Link
            href={seriesHref}
            className={`block border-l-2 px-4 py-1.5 text-sm font-medium transition-colors ${
              activeSlug === '__series__'
                ? '-ml-[2px] border-primary text-foreground'
                : '-ml-[2px] border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            책 소개
          </Link>
        </li>
      )}
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
          { name: topicLabel(post.category), url: `${SITE}/${post.category}` },
          ...(post.subcategory ? [{ name: post.subcategory, url: `${SITE}/${post.category}/${post.subcategory}` }] : []),
          { name: post.title, url },
        ])}
      />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* ── Left sidebar: folder posts ── */}
        <FolderPostsSidebar
          currentSlug={post.slugAsParams}
          category={post.category}
          subcategory={post.subcategory}
        />

        {/* ── Main content ── */}
        <article className="min-w-0">
          <header className="mb-10 border-b border-border/60 pb-6">
            <nav className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              {' ⟩ '}
              <Link href={`/${post.category}`} className="hover:text-foreground">{topicLabel(post.category)}</Link>
              {post.subcategory && (
                <>
                  {' ⟩ '}
                  <Link href={`/${post.category}/${post.subcategory}`} className="hover:text-foreground">{post.subcategory}</Link>
                </>
              )}
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

          {/* TOC collapsible */}
          {post.toc.length > 0 && (
            <MobileCollapsible title="On this page" alwaysVisible>
              <TableOfContents items={post.toc} hideTitle />
            </MobileCollapsible>
          )}

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

          {/* 백링크/그래프 */}
          <BacklinksPanel slug={post.slugAsParams} />
          <div className="hidden lg:block">
            <LazyLocalGraph currentSlug={post.slugAsParams} />
          </div>
        </article>
      </div>
    </div>
    </>
  )
}

// ── Series landing view ──

function SeriesView({ r }: { r: Extract<Resolved, { type: 'series' }> }) {
  const s = r.series
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* ── Left sidebar: chapter TOC (desktop) ── */}
        <aside className="hidden lg:block">
          <div className="group/sidebar sticky top-14 h-[calc(100vh-3.5rem)]">
            <ScrollArea className="h-full [&_[data-slot=scroll-area-scrollbar]]:opacity-0 [&_[data-slot=scroll-area-scrollbar]]:transition-opacity group-hover/sidebar:[&_[data-slot=scroll-area-scrollbar]]:opacity-100">
              <div className="pt-14 pb-8">
                <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Table of contents
                </div>
                <SidebarList nodes={r.tree} activeSlug="__series__" seriesHref={`/${s.slugAsParams}`} />
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* ── Mobile: chapter TOC ── */}
        <MobileCollapsible title={`${s.title} · 목차`}>
          <SidebarList nodes={r.tree} activeSlug="__series__" seriesHref={`/${s.slugAsParams}`} />
        </MobileCollapsible>

        {/* ── Main content ── */}
        <article className="min-w-0 pt-14 pb-12">
          <header className="mb-10 border-b border-border/60 pb-6">
            <nav className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              {' ⟩ '}
              <Link href={`/${s.category}`} className="hover:text-foreground">{topicLabel(s.category)}</Link>
              {' ⟩ '}
              <Link href={`/${s.category}/${s.subcategory}`} className="hover:text-foreground">{s.subcategory}</Link>
              {' ⟩ '}
              <span>{s.title}</span>
            </nav>

            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{s.title}</h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{s.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
              <span>{r.totalCount}개 챕터</span>
              {s.date && (
                <>
                  <span>·</span>
                  <time>{s.date.slice(0, 10)}</time>
                </>
              )}
            </div>
            {s.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.tags.map((tag) => (
                  <span key={tag} className="rounded border border-border/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Cover image */}
          {s.cover && (
            <div className="mb-10 max-w-[200px] overflow-hidden rounded-lg border border-border/60">
              <img
                src={s.cover}
                alt={s.title}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          {/* Book intro body (MDX) */}
          {s.body && (
            <section className="prose prose-neutral mb-12 max-w-none dark:prose-invert">
              <MDXContent code={s.body} />
            </section>
          )}

        </article>
      </div>
    </div>
  )
}

// ── Chapter view ──

function ChapterView({ r }: { r: Extract<Resolved, { type: 'chapter' }> }) {
  const url = `${SITE}/${r.chapter.slugAsParams}`
  const childNodes = findNodeChildren(r.tree, r.chapter.slug)
  return (
    <>
    <ReadingProgress />
    <div className="mx-auto max-w-5xl px-6">
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
          { name: topicLabel(r.series.category), url: `${SITE}/${r.series.category}` },
          { name: r.series.subcategory, url: `${SITE}/${r.series.category}/${r.series.subcategory}` },
          { name: r.series.title, url: `${SITE}/${r.series.slugAsParams}` },
          { name: r.chapter.title, url },
        ])}
      />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* ── Left sidebar: chapter navigation ── */}
        <aside className="hidden lg:block">
          <div className="group/sidebar sticky top-14 h-[calc(100vh-3.5rem)]">
            <ScrollArea className="h-full [&_[data-slot=scroll-area-scrollbar]]:opacity-0 [&_[data-slot=scroll-area-scrollbar]]:transition-opacity group-hover/sidebar:[&_[data-slot=scroll-area-scrollbar]]:opacity-100">
              <div className="pt-14 pb-8">
                <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Table of contents
                </div>
                <SidebarList nodes={r.tree} activeSlug={r.chapter.slug} seriesHref={`/${r.series.slugAsParams}`} />
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* ── Mobile: chapter navigation ── */}
        <MobileCollapsible title={`${r.series.title} · 목차`}>
          <SidebarList nodes={r.tree} activeSlug={r.chapter.slug} seriesHref={`/${r.series.slugAsParams}`} />
        </MobileCollapsible>

        {/* ── Main content ── */}
        <article className="min-w-0 pt-14 pb-12">
          <header className="mb-10 border-b border-border/60 pb-6">
            <div className="mb-2 flex items-center justify-between">
              <nav className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                <Link href="/" className="hover:text-foreground">Home</Link>
                {' ⟩ '}
                <Link href={`/${r.series.category}`} className="hover:text-foreground">{topicLabel(r.series.category)}</Link>
                {' ⟩ '}
                <Link href={`/${r.series.category}/${r.series.subcategory}`} className="hover:text-foreground">{r.series.subcategory}</Link>
                {' ⟩ '}
                <Link href={`/${r.series.slugAsParams}`} className="hover:text-foreground">{r.series.title}</Link>
              </nav>
              <ShareButtons url={url} title={r.chapter.title} />
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {r.chapter.title}
            </h1>
          </header>

          {/* TOC collapsible */}
          {r.chapter.toc.length > 0 && (
            <MobileCollapsible title="On this page" alwaysVisible>
              <TableOfContents items={r.chapter.toc} hideTitle />
            </MobileCollapsible>
          )}

          {childNodes.length > 0 ? (
            <section>
              <h2 className="mb-4 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                하위 챕터
              </h2>
              <ChapterList nodes={childNodes} counter={{ value: 0 }} />
            </section>
          ) : (
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              <MDXContent code={r.chapter.body} />
            </div>
          )}

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

          {/* 백링크/그래프 */}
          <BacklinksPanel slug={r.chapter.slugAsParams} />
          <div className="hidden lg:block">
            <LazyLocalGraph currentSlug={r.chapter.slugAsParams} />
          </div>
        </article>
      </div>
    </div>
    </>
  )
}

// ── Category view ──

function CategoryView({ r }: { r: Extract<Resolved, { type: 'category' }> }) {
  const postCount = r.docs.filter((d) => d.type === 'post').length
  const seriesCount = r.docs.filter((d) => d.type === 'series').length
  const statParts = [
    seriesCount > 0 && `시리즈 ${seriesCount}`,
    postCount > 0 && `포스트 ${postCount}`,
    r.subcategories.length > 0 && `서브카테고리 ${r.subcategories.length}`,
  ].filter(Boolean)

  return (
    <VaultLayout>
      <header className="mb-10">
        <nav className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          {' ⟩ '}
          <span>{r.label}</span>
        </nav>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{r.label}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {statParts.join(' · ')}
        </p>
      </header>

      {r.subcategories.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            서브카테고리
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {r.subcategories.map((sub) => (
              <Link
                key={sub.name}
                href={`/${r.category}/${sub.name}`}
                className="group flex items-center justify-between rounded-xl border border-border/60 px-5 py-4 transition-colors hover:border-foreground/40"
              >
                <div>
                  <div className="text-sm font-medium group-hover:text-primary">{sub.name}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    {[
                      sub.seriesCount > 0 && `시리즈 ${sub.seriesCount}`,
                      sub.postCount > 0 && `포스트 ${sub.postCount}`,
                    ].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <span className="text-muted-foreground transition-transform group-hover:translate-x-0.5">⟩</span>
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
  const postCount = r.docs.filter((d) => d.type === 'post').length
  const seriesCount = r.docs.filter((d) => d.type === 'series').length
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
          <Link href={`/${r.category}`} className="hover:text-foreground">{r.categoryLabel}</Link>
          {' ⟩ '}
          <span>{r.subcategory}</span>
        </nav>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{r.subcategory}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {statParts.join(' · ')}
        </p>
      </header>

      <DocList docs={r.docs} />
    </VaultLayout>
  )
}
