import Link from 'next/link'
import slugMap from '../../.velite/slug-map.json'

type SlugEntry = {
  id: string
  type: 'post' | 'chapter'
  title: string
  description?: string
  url: string
  category: 'accounting' | 'ai'
}

const SLUG_MAP = slugMap as Record<string, SlugEntry>

function resolveWikiTarget(target: string): SlugEntry | undefined {
  return SLUG_MAP[target.normalize('NFC').toLowerCase().trim()]
}

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  'data-wiki-link'?: string
  'data-wiki-target'?: string
  'data-wiki-heading'?: string
  'data-wiki-alias'?: string
}

/**
 * MDX의 `a` 요소를 가로채 wiki-link(`href="wiki:..."`)를 Next Link로 렌더한다.
 * 슬러그 resolve 실패 시 broken 스타일로 표시.
 */
export function MdxAnchor({
  href,
  children,
  ...rest
}: AnchorProps) {
  const isWiki =
    rest['data-wiki-link'] === 'true' || (typeof href === 'string' && href.startsWith('wiki:'))

  if (!isWiki || !href) {
    // 일반 링크는 기본 anchor 렌더 (외부 링크는 새 탭)
    const isExternal = typeof href === 'string' && /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...rest}
      >
        {children}
      </a>
    )
  }

  const target = rest['data-wiki-target'] ?? href.replace(/^wiki:/, '').split('#')[0]
  const heading = rest['data-wiki-heading']
  const resolved = resolveWikiTarget(target)

  if (!resolved) {
    return (
      <span
        data-broken-wiki-link
        className="text-destructive decoration-destructive/60 underline decoration-dotted underline-offset-4"
        title={`대상 없음: ${target}`}
      >
        {children}
      </span>
    )
  }

  const finalHref = heading ? `${resolved.url}#${heading}` : resolved.url

  return (
    <span className="group/wikilink relative inline-block">
      <Link
        href={finalHref}
        data-wiki-link="true"
        data-wiki-category={resolved.category}
        className="text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
      >
        {children}
      </Link>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute left-1/2 top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded border border-border/60 bg-background p-3 text-left opacity-0 shadow-md transition-opacity duration-150 group-hover/wikilink:visible group-hover/wikilink:opacity-100"
      >
        <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {resolved.type} · {resolved.category}
        </span>
        <span className="mt-1 block text-sm font-medium leading-snug">{resolved.title}</span>
        {resolved.description && (
          <span className="mt-1 block text-xs text-muted-foreground">{resolved.description}</span>
        )}
      </span>
    </span>
  )
}
