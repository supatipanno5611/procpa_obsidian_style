import type { Metadata } from 'next'
import { posts, series, chapters } from '#site/content'
import { FacetPanel, type FacetCounts } from '@/components/explore/facet-panel'
import { ResultList, type ResultItem } from '@/components/explore/result-list'
import { Pagination } from '@/components/explore/pagination'
import { topicLabel } from '@/lib/topics'

const PER_PAGE = 10

export const metadata: Metadata = {
  title: 'Explore',
  description: '카테고리·태그·연도 등 메타데이터로 모든 글을 교차 탐색합니다.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/explore' },
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

type Doc = ResultItem & { tagSet: Set<string>; year: string }

function buildDocs(): Doc[] {
  const docs: Doc[] = []

  for (const p of posts) {
    if (p.draft) continue
    docs.push({
      id: p.slug,
      type: 'post',
      title: p.title,
      description: p.description,
      url: `/${p.slugAsParams}`,
      tags: p.tags,
      tagSet: new Set(p.tags),
      category: p.category,
      date: p.date,
      year: p.date.slice(0, 4),
    })
  }

  for (const s of series) {
    if (s.draft) continue
    docs.push({
      id: s.slug,
      type: 'series',
      title: s.title,
      description: s.description,
      url: `/${s.slugAsParams}`,
      tags: s.tags,
      tagSet: new Set(s.tags),
      category: s.category,
      date: s.date ?? '',
      year: s.date?.slice(0, 4) ?? '',
    })
  }

  for (const c of chapters) {
    if (c.draft) continue
    docs.push({
      id: c.slug,
      type: 'chapter',
      title: c.title,
      description: c.description ?? '',
      url: `/${c.slugAsParams}`,
      tags: [],
      tagSet: new Set<string>(),
      category: c.category,
      series: c.series,
      year: '',
    })
  }

  return docs
}

function asArray(v: string | string[] | undefined): string[] {
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

function asString(v: string | string[] | undefined): string {
  if (!v) return ''
  return Array.isArray(v) ? v[0] ?? '' : v
}

export default async function ExplorePage({ searchParams }: PageProps) {
  const sp = await searchParams
  const selectedCategory = asString(sp.category)
  const selectedType = asString(sp.type) as '' | 'post' | 'series' | 'chapter'
  const selectedYear = asString(sp.year)
  const selectedTags = asArray(sp.tag)
  const currentPage = Math.max(1, parseInt(asString(sp.page) || '1', 10))

  const allDocs = buildDocs()

  // Compute facet counts on the unfiltered set so users can always see options.
  const catMap = new Map<string, number>()
  const tagMap = new Map<string, number>()
  const typeMap = new Map<'post' | 'series' | 'chapter', number>()
  const yearMap = new Map<string, number>()
  for (const d of allDocs) {
    if (d.category) catMap.set(d.category, (catMap.get(d.category) ?? 0) + 1)
    for (const t of d.tags) tagMap.set(t, (tagMap.get(t) ?? 0) + 1)
    typeMap.set(d.type, (typeMap.get(d.type) ?? 0) + 1)
    if (d.year) yearMap.set(d.year, (yearMap.get(d.year) ?? 0) + 1)
  }
  const facets: FacetCounts = {
    categories: [...catMap.entries()].sort().map(([value, count]) => ({ value, count })),
    tags: [...tagMap.entries()].sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, count })),
    types: [...typeMap.entries()]
      .sort()
      .map(([value, count]) => ({ value: value as 'post' | 'series' | 'chapter', count })),
    years: [...yearMap.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([value, count]) => ({ value, count })),
  }

  // Apply filters (AND across facets, AND across multi-tags)
  const results = allDocs.filter((d) => {
    if (selectedType && d.type !== selectedType) return false
    if (selectedCategory && d.category !== selectedCategory) return false
    if (selectedYear && d.year !== selectedYear) return false
    if (selectedTags.length > 0 && !selectedTags.every((t) => d.tagSet.has(t))) return false
    return true
  })

  // Sort: posts/series by date desc, chapters by id
  results.sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date)
    if (a.date) return -1
    if (b.date) return 1
    return a.id.localeCompare(b.id)
  })

  const activeBadges: string[] = []
  if (selectedType) activeBadges.push(`type: ${selectedType}`)
  if (selectedCategory) activeBadges.push(`category: ${topicLabel(selectedCategory)}`)
  if (selectedYear) activeBadges.push(`year: ${selectedYear}`)
  for (const t of selectedTags) activeBadges.push(`#${t}`)

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const pagedResults = results.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Explore
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">메타데이터 탐색</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          카테고리·태그·연도·종류를 조합해서 모든 노트를 교차 탐색합니다.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 md:col-span-3">
          <FacetPanel facets={facets} />
        </div>
        <div className="col-span-12 md:col-span-9">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] text-muted-foreground">
              {results.length}개 결과{totalPages > 1 && ` · ${safePage}/${totalPages} 페이지`}
            </p>
            {activeBadges.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {activeBadges.map((b) => (
                  <span
                    key={b}
                    className="rounded border border-border/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>
          <ResultList items={pagedResults} />
          <Pagination currentPage={safePage} totalPages={totalPages} searchParams={sp} />
        </div>
      </div>
    </div>
  )
}
