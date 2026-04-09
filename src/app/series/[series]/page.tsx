import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { series, chapters } from '#site/content'

interface PageProps {
  params: Promise<{ series: string }>
}

function getSeries(slug: string) {
  return series.find((s) => s.slugAsParams === slug)
}

export async function generateStaticParams() {
  return series.map((s) => ({ series: s.slugAsParams }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { series: slug } = await params
  const s = getSeries(slug)
  if (!s) return {}
  return { title: s.title, description: s.description }
}

export default async function SeriesLandingPage({ params }: PageProps) {
  const { series: slug } = await params
  const s = getSeries(slug)
  if (!s || s.draft) notFound()

  const seriesChapters = chapters
    .filter((c) => c.series === slug && !c.draft)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12 border-b border-border/60 pb-8">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          시리즈
        </div>
        <h1 className="text-balance text-4xl font-semibold tracking-tight">{s.title}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">{s.description}</p>
      </header>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          목차
        </h2>
        <ol className="divide-y divide-border/60">
          {seriesChapters.map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/series/${slug}/${c.slugAsParams.split('/').slice(1).join('/')}`}
                className="group flex items-baseline gap-4 py-4"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium group-hover:text-primary">{c.title}</h3>
                  {c.description && (
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {c.description}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
