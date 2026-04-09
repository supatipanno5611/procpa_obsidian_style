import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { posts } from '#site/content'
import { MDXContent } from '@/components/mdx-content'
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from '@/components/json-ld'
import { BacklinksPanel } from '@/components/backlinks-panel'
import { LocalGraph } from '@/components/graph/local-graph'

const SITE = 'https://procpa.co.kr'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

function getPost(slugSegments: string[]) {
  const slug = slugSegments.join('/')
  return posts.find((p) => p.slugAsParams === slug)
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slugAsParams.split('/') }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  const ogUrl = `/api/og?kicker=${encodeURIComponent('PROCPA · POST')}&title=${encodeURIComponent(
    post.title,
  )}&subtitle=${encodeURIComponent(post.description)}&meta=${encodeURIComponent(post.date.slice(0, 10))}`
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogUrl],
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post || post.draft) notFound()

  const url = `${SITE}/${post.slug}`

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
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
          { name: '포스트', url: `${SITE}/posts` },
          { name: post.title, url },
        ])}
      />
      <header className="mb-12 border-b border-border/60 pb-8">
        <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
          <time className="font-mono">{post.date.slice(0, 10)}</time>
          <span>·</span>
          <span>{post.metadata.readingTime}분 읽기</span>
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`} className="hover:text-foreground">
              #{tag}
            </Link>
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

      <BacklinksPanel slug={post.slugAsParams} />
      <LocalGraph currentSlug={post.slugAsParams} />
    </article>
  )
}
