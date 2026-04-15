import { SeriesCard, PostCard } from '@/components/content-card'

export type CategoryDoc = {
  type: 'post' | 'series'
  title: string
  description: string
  url: string
  date: string
  tags: string[]
  cover?: string
  chapterCount?: number
  lastUpdated?: string
}

export function DocList({ docs, emptyMsg }: { docs: CategoryDoc[]; emptyMsg?: string }) {
  if (docs.length === 0) return <p className="text-sm text-muted-foreground">{emptyMsg ?? '글이 없습니다.'}</p>
  const seriesDocs = docs.filter((d) => d.type === 'series')
  const postDocs = docs.filter((d) => d.type === 'post').sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-12">
      {seriesDocs.length > 0 && (
        <div>
          <h3 className="mb-5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            시리즈 · {seriesDocs.length}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {seriesDocs.map((d) => (
              <SeriesCard
                key={d.url}
                title={d.title}
                description={d.description}
                url={d.url}
                cover={d.cover}
                chapterCount={d.chapterCount}
                lastUpdated={d.lastUpdated}
              />
            ))}
          </div>
        </div>
      )}
      {postDocs.length > 0 && (
        <div>
          <h3 className="mb-5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            포스트 · {postDocs.length}
          </h3>
          <ul className="divide-y divide-border/60">
            {postDocs.map((d) => (
              <li key={d.url}>
                <PostCard
                  title={d.title}
                  url={d.url}
                  date={d.date}
                  tags={d.tags}
                  variant="list"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
