import { posts, series, chapters } from '#site/content'

export type SearchDoc = {
  id: string
  type: 'post' | 'series' | 'chapter'
  title: string
  description: string
  url: string
  tags: string[]
  date?: string
  series?: string
  body: string
}

export function getSearchDocs(): SearchDoc[] {
  const out: SearchDoc[] = []

  for (const p of posts) {
    if (p.draft) continue
    out.push({
      id: p.slug,
      type: 'post',
      title: p.title,
      description: p.description,
      url: `/${p.slug}`,
      tags: p.tags,
      date: p.date,
      body: stripMdx(p.body),
    })
  }

  for (const s of series) {
    if (s.draft) continue
    out.push({
      id: s.slug,
      type: 'series',
      title: s.title,
      description: s.description,
      url: `/series/${s.slugAsParams}`,
      tags: s.tags,
      date: s.date,
      body: '',
    })
  }

  for (const c of chapters) {
    if (c.draft) continue
    const seriesSlug = c.slugAsParams.split('/')[0]
    const rest = c.slugAsParams.split('/').slice(1).join('/')
    out.push({
      id: c.slug,
      type: 'chapter',
      title: c.title,
      description: c.description ?? '',
      url: `/series/${seriesSlug}/${rest}`,
      tags: [],
      series: seriesSlug,
      body: stripMdx(c.body),
    })
  }

  return out
}

// Very rough extraction of readable text from compiled MDX code string.
function stripMdx(code: string): string {
  // compiled MDX is a JS module; pull out string literals as a proxy for prose.
  const matches = code.match(/"[^"\\]{4,}"/g) ?? []
  return matches
    .map((s) => s.slice(1, -1))
    .join(' ')
    .replace(/\s+/g, ' ')
    .slice(0, 2000)
}
