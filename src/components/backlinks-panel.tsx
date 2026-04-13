import Link from 'next/link'
import backlinksData from '../../.velite/backlinks.json'

type BacklinkEdge = {
  sourceId: string
  sourceTitle: string
  sourceUrl: string
  sourceType: 'post' | 'chapter'
  category: string
  context: string
  alias?: string
  heading?: string
}

const BACKLINKS = backlinksData as Record<string, BacklinkEdge[]>

export function BacklinksPanel({ slug }: { slug: string }) {
  const items = BACKLINKS[slug]
  if (!items || items.length === 0) return null

  return (
    <section className="mt-16 border-t border-border/60 pt-8">
      <h2 className="mb-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Backlinks · {items.length}
      </h2>
      <ul className="space-y-1">
        {items.map((b) => (
          <li key={b.sourceId} className="group">
            <Link
              href={b.sourceUrl}
              className="-mx-3 block rounded-md border border-transparent px-3 py-2.5 transition-colors hover:border-border/60 hover:bg-muted/40"
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {b.sourceType}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  · {b.category}
                </span>
                <span className="font-medium text-foreground/90 group-hover:text-foreground">
                  {b.sourceTitle}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{b.context}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 사이드바용 컴팩트 백링크 */
export function BacklinksCompact({ slug }: { slug: string }) {
  const items = BACKLINKS[slug]
  if (!items || items.length === 0) return null

  return (
    <div>
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Backlinks · {items.length}
      </h3>
      <ul className="space-y-1">
        {items.map((b) => (
          <li key={b.sourceId}>
            <Link
              href={b.sourceUrl}
              className="block rounded py-1.5 text-[13px] leading-snug text-muted-foreground transition-colors hover:text-foreground"
            >
              {b.sourceTitle}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
