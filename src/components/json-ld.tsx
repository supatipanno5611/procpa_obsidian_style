export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

const SITE = 'https://procpa.co.kr'
const AUTHOR = { '@type': 'Person', name: 'PROCPA', url: SITE }

export function articleJsonLd(opts: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  image?: string
  tags?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: AUTHOR,
    publisher: {
      '@type': 'Organization',
      name: 'PROCPA',
      url: SITE,
    },
    image: opts.image ?? `${SITE}/opengraph-image`,
    keywords: opts.tags?.join(', '),
    inLanguage: 'ko-KR',
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
