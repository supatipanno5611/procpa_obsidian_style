import Link from 'next/link'
import type { Metadata } from 'next'
import { posts } from '#site/content'

export const metadata: Metadata = {
  title: '포스트',
  description: '모든 블로그 포스트 목록.',
}

export default function PostsPage() {
  const list = posts
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">포스트</h1>
        <p className="mt-2 text-sm text-muted-foreground">{list.length}개의 글</p>
      </header>

      <ul className="divide-y divide-border/60">
        {list.map((post) => (
          <li key={post.slug} className="py-6">
            <Link href={`/${post.slug}`} className="group block">
              <div className="flex items-baseline justify-between gap-6">
                <h2 className="text-lg font-medium group-hover:text-primary">{post.title}</h2>
                <time className="shrink-0 font-mono text-xs text-muted-foreground">
                  {post.date.slice(0, 10)}
                </time>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.description}</p>
              {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
