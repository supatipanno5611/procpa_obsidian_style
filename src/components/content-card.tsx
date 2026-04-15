import Link from 'next/link'

/* ── Series Card ── */

interface SeriesCardProps {
  title: string
  description: string
  url: string
  cover?: string
  chapterCount?: number
  lastUpdated?: string
  variant?: 'default' | 'featured'
}

export function SeriesCard({ title, description, url, cover, chapterCount, lastUpdated, variant = 'default' }: SeriesCardProps) {
  if (variant === 'featured') {
    return (
      <Link
        href={url}
        className="group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-border/60 transition-all hover:translate-y-[-2px] hover:border-foreground/40 hover:shadow-sm"
      >
        {/* Large cover area */}
        {cover ? (
          <div className="aspect-[16/9] w-full overflow-hidden bg-muted/20">
            <img src={cover} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]" />
          </div>
        ) : (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-muted/20">
            <span className="font-mono text-2xl text-muted-foreground/40">SERIES</span>
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <div className="text-[14px] font-medium leading-snug group-hover:text-primary">
              {title}
            </div>
            {description && (
              <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {(chapterCount != null || lastUpdated) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] text-muted-foreground">
              {chapterCount != null && <span>{chapterCount}개 챕터</span>}
              {lastUpdated && (
                <>
                  <span>·</span>
                  <span>{lastUpdated.slice(0, 10).replace(/-/g, '.')}</span>
                </>
              )}
            </div>
          )}
        </div>
      </Link>
    )
  }

  // variant === 'default' (used in DocList)
  return (
    <Link
      href={url}
      className="group rounded-xl border border-border/60 p-5 transition-all hover:translate-y-[-2px] hover:border-foreground/40 hover:shadow-sm"
    >
      <div className="flex items-start gap-4">
        {cover ? (
          <img src={cover} alt="" className="h-16 w-12 shrink-0 rounded-md border border-border/40 object-cover" />
        ) : (
          <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-md border border-border/40 bg-muted/40">
            <span className="font-mono text-lg text-muted-foreground">B</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-medium leading-snug group-hover:text-primary">{title}</div>
          {description && (
            <div className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted-foreground">
              {description}
            </div>
          )}
        </div>
      </div>
      {(chapterCount != null || lastUpdated) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] text-muted-foreground">
          {chapterCount != null && <span>{chapterCount}개 챕터</span>}
          {lastUpdated && (
            <>
              <span>·</span>
              <span>업데이트 {lastUpdated.slice(0, 10).replace(/-/g, '.')}</span>
            </>
          )}
        </div>
      )}
    </Link>
  )
}

/* ── Post Card ── */

interface PostCardProps {
  title: string
  description?: string
  url: string
  date: string
  category?: string
  tags?: string[]
  variant?: 'card' | 'list'
}

export function PostCard({ title, description, url, date, category, tags, variant = 'list' }: PostCardProps) {
  if (variant === 'card') {
    return (
      <Link
        href={url}
        className="group flex w-[260px] shrink-0 snap-start flex-col justify-between rounded-md border border-border/60 px-4 py-4 transition-all hover:translate-y-[-2px] hover:border-foreground/40 hover:shadow-sm"
      >
        <div>
          {category && (
            <span className="rounded border border-border/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              {category}
            </span>
          )}
          <div className={`${category ? 'mt-2.5' : ''} text-[14px] font-medium leading-snug group-hover:text-primary`}>
            {title}
          </div>
          {description && (
            <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <div className="mt-3 font-mono text-[10px] text-muted-foreground">
          {date.slice(0, 10).replace(/-/g, '.')}
        </div>
      </Link>
    )
  }

  // variant === 'list'
  return (
    <Link
      href={url}
      className="group flex flex-col gap-2 py-4"
    >
      <div className="flex items-baseline gap-4">
        <span className="flex-1 text-[15px] leading-snug group-hover:text-primary">{title}</span>
        {date && (
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
            {date.slice(0, 10).replace(/-/g, '.')}
          </span>
        )}
      </div>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="rounded-full border border-border/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
