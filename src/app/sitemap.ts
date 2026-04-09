import type { MetadataRoute } from 'next'
import { posts, series, chapters } from '#site/content'

const SITE = 'https://procpa.co.kr'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls: MetadataRoute.Sitemap = [
    '',
    '/posts',
    '/series',
    '/tags',
    '/search',
    '/about',
  ].map((p) => ({ url: `${SITE}${p}`, lastModified: new Date() }))

  const postUrls: MetadataRoute.Sitemap = posts
    .filter((p) => !p.draft)
    .map((p) => ({
      url: `${SITE}/${p.slug}`,
      lastModified: new Date(p.updated ?? p.date),
    }))

  const seriesUrls: MetadataRoute.Sitemap = series
    .filter((s) => !s.draft)
    .map((s) => ({
      url: `${SITE}/series/${s.slugAsParams}`,
      lastModified: new Date(s.date),
    }))

  const chapterUrls: MetadataRoute.Sitemap = chapters
    .filter((c) => !c.draft)
    .map((c) => {
      const [seriesSlug, ...rest] = c.slugAsParams.split('/')
      return {
        url: `${SITE}/series/${seriesSlug}/${rest.join('/')}`,
        lastModified: new Date(),
      }
    })

  return [...staticUrls, ...postUrls, ...seriesUrls, ...chapterUrls]
}
