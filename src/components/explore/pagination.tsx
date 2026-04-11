import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  /** Current search params to preserve when changing page */
  searchParams: Record<string, string | string[] | undefined>
}

export function Pagination({ currentPage, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null

  function buildHref(page: number) {
    const params = new URLSearchParams()
    for (const [key, val] of Object.entries(searchParams)) {
      if (key === 'page' || val === undefined) continue
      if (Array.isArray(val)) {
        for (const v of val) params.append(key, v)
      } else {
        params.set(key, val)
      }
    }
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return `/explore${qs ? `?${qs}` : ''}`
  }

  // Build page numbers to display: show at most 5 around current
  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="페이지 탐색">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          aria-label="이전 페이지"
        >
          &lt;
        </Link>
      )}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-1.5 py-1 font-mono text-[11px] text-muted-foreground">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`min-w-[28px] rounded px-2 py-1 text-center font-mono text-[11px] transition-colors ${
              p === currentPage
                ? 'bg-foreground/10 font-semibold text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </Link>
        ),
      )}
      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          aria-label="다음 페이지"
        >
          &gt;
        </Link>
      )}
    </nav>
  )
}
