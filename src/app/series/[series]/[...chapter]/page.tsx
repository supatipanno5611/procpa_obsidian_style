import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { series, chapters } from '#site/content'
import { MDXContent } from '@/components/mdx-content'
import { BacklinksPanel } from '@/components/backlinks-panel'
import { LocalGraph } from '@/components/graph/local-graph'
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from '@/components/json-ld'

const SITE = 'https://procpa.co.kr'

interface PageProps {
  params: Promise<{ series: string; chapter: string[] }>
}

function resolve(seriesSlug: string, chapterSegments: string[]) {
  const s = series.find((x) => x.slugAsParams === seriesSlug)
  if (!s) return null
  const chapterParam = chapterSegments.join('/')
  const all = chapters
    .filter((c) => c.series === seriesSlug && !c.draft)
    .sort((a, b) => a.order - b.order)
  const chapter = all.find((c) => c.slugAsParams.split('/').slice(1).join('/') === chapterParam)
  if (!chapter) return null
  const idx = all.findIndex((c) => c === chapter)
  return { series: s, chapter, all, prev: all[idx - 1], next: all[idx + 1] }
}

export async function generateStaticParams() {
  return chapters.map((c) => {
    const [seriesSlug, ...rest] = c.slugAsParams.split('/')
    return { series: seriesSlug, chapter: rest }
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { series: s, chapter } = await params
  const r = resolve(s, chapter)
  if (!r) return {}
  const title = `${r.chapter.title} · ${r.series.title}`
  const description = r.chapter.description ?? r.series.description
  const ogUrl = `/api/og?kicker=${encodeURIComponent('PROCPA · SERIES')}&title=${encodeURIComponent(
    r.chapter.title,
  )}&subtitle=${encodeURIComponent(description)}&meta=${encodeURIComponent(r.series.title)}`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogUrl] },
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const { series: s, chapter } = await params
  const r = resolve(s, chapter)
  if (!r) notFound()

  const chapterPath = r.chapter.slugAsParams.split('/').slice(1).join('/')
  const url = `${SITE}/series/${s}/${chapterPath}`

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[220px_minmax(0,1fr)]">
      <JsonLd
        data={articleJsonLd({
          title: `${r.chapter.title} · ${r.series.title}`,
          description: r.chapter.description ?? r.series.description,
          url,
          datePublished: r.series.date,
          image: `${SITE}/api/og?kicker=${encodeURIComponent('PROCPA · SERIES')}&title=${encodeURIComponent(r.chapter.title)}&subtitle=${encodeURIComponent(r.chapter.description ?? r.series.description)}&meta=${encodeURIComponent(r.series.title)}`,
          tags: r.series.tags,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: '홈', url: SITE },
          { name: '시리즈', url: `${SITE}/series` },
          { name: r.series.title, url: `${SITE}/series/${s}` },
          { name: r.chapter.title, url },
        ])}
      />
      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <Link
            href={`/series/${s}`}
            className="block font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            ← {r.series.title}
          </Link>
          <ol className="mt-6 space-y-1 border-l border-border/60">
            {r.all.map((c, i) => {
              const active = c === r.chapter
              return (
                <li key={c.slug}>
                  <Link
                    href={`/series/${s}/${c.slugAsParams.split('/').slice(1).join('/')}`}
                    className={`block border-l-2 px-4 py-1.5 text-sm transition-colors ${
                      active
                        ? '-ml-[2px] border-primary text-foreground'
                        : '-ml-[2px] border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="mr-2 font-mono text-[10px] text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {c.title}
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      </aside>

      <article className="min-w-0">
        <header className="mb-10 border-b border-border/60 pb-6">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {r.series.title}
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {r.chapter.title}
          </h1>
        </header>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <MDXContent code={r.chapter.body} />
        </div>

        <BacklinksPanel slug={r.chapter.slugAsParams} />
        <LocalGraph currentSlug={r.chapter.slugAsParams} />

        <nav className="mt-16 flex items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm">
          {r.prev ? (
            <Link
              href={`/series/${s}/${r.prev.slugAsParams.split('/').slice(1).join('/')}`}
              className="group min-w-0 flex-1"
            >
              <div className="text-xs text-muted-foreground">이전</div>
              <div className="truncate group-hover:text-primary">← {r.prev.title}</div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {r.next ? (
            <Link
              href={`/series/${s}/${r.next.slugAsParams.split('/').slice(1).join('/')}`}
              className="group min-w-0 flex-1 text-right"
            >
              <div className="text-xs text-muted-foreground">다음</div>
              <div className="truncate group-hover:text-primary">{r.next.title} →</div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </article>
    </div>
  )
}
