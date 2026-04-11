import Link from 'next/link'

export interface ResultItem {
  id: string
  type: 'post' | 'series' | 'chapter'
  title: string
  description: string
  url: string
  tags: string[]
  category?: string
  date?: string
  series?: string
}

const TYPE_LABEL: Record<ResultItem['type'], string> = {
  post: 'Post',
  series: 'Series',
  chapter: 'Chapter',
}

export function ResultList({ items }: { items: ResultItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border/60 py-16 text-center text-sm text-muted-foreground">
        조건에 맞는 결과가 없습니다.
      </div>
    )
  }
  return (
    <ul className="divide-y divide-border/60">
      {items.map((item) => (
        <li key={item.id} className="py-5">
          <Link href={item.url} className="group block">
            <div className="flex items-baseline justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {TYPE_LABEL[item.type]}
                </span>
                {item.category && (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    · {item.category}
                  </span>
                )}
              </div>
              {item.date && (
                <time className="shrink-0 font-mono text-xs text-muted-foreground">
                  {item.date.slice(0, 10)}
                </time>
              )}
            </div>
            <h2 className="mt-2 text-base font-medium group-hover:text-primary">{item.title}</h2>
            {item.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
            )}
            {item.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span key={t} className="font-mono text-[10px] text-muted-foreground">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
