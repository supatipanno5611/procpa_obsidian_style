import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { posts } from '#site/content'

interface PageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const set = new Set<string>()
  for (const p of posts) for (const t of p.tags) set.add(t)
  return [...set].map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params
  return { title: `#${decodeURIComponent(tag)}` }
}

export default async function TagPage({ params }: PageProps) {
  const { tag: raw } = await params
  const tag = decodeURIComponent(raw)
  const list = posts
    .filter((p) => !p.draft && p.tags.includes(tag))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))

  if (list.length === 0) notFound()

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">태그</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">#{tag}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{list.length}개의 글</p>
      </header>
      <ul className="divide-y divide-border/60">
        {list.map((post) => (
          <li key={post.slug} className="py-5">
            <Link href={`/${post.slug}`} className="group block">
              <div className="flex items-baseline justify-between gap-6">
                <h2 className="text-base font-medium group-hover:text-primary">{post.title}</h2>
                <time className="shrink-0 font-mono text-xs text-muted-foreground">
                  {post.date.slice(0, 10)}
                </time>
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
