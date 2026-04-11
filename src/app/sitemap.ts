import type { MetadataRoute } from 'next'
import { posts, series, chapters } from '#site/content'

const SITE = 'https://procpa.co.kr'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls: MetadataRoute.Sitemap = [
    '',
    '/explore',
    '/graph',
    '/search',
    '/about',
    '/terms',
    '/disclaimer',
  ].map((p) => ({ url: `${SITE}${p}`, lastModified: new Date() }))

  const postUrls: MetadataRoute.Sitemap = posts
    .filter((p) => !p.draft)
    .map((p) => ({
      url: `${SITE}/${p.slugAsParams}`,
      lastModified: new Date(p.updated ?? p.date),
    }))

  const seriesUrls: MetadataRoute.Sitemap = series
    .filter((s) => !s.draft)
    .map((s) => ({
      url: `${SITE}/${s.slugAsParams}`,
      lastModified: s.date ? new Date(s.date) : new Date(),
    }))

  const chapterUrls: MetadataRoute.Sitemap = chapters
    .filter((c) => !c.draft)
    .map((c) => ({
      url: `${SITE}/${c.slugAsParams}`,
      lastModified: new Date(),
    }))

  return [...staticUrls, ...postUrls, ...seriesUrls, ...chapterUrls]
}
