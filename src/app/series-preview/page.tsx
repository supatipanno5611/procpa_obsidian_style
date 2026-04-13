import Link from 'next/link'
import { series, chapters } from '#site/content'
import { topicLabel } from '@/lib/topics'

export const metadata = { title: 'Series Preview — 디자인 비교', robots: 'noindex' }

type SeriesWithMeta = (typeof series)[number] & {
  chapterCount: number
  lastUpdated?: string
}

function getSeriesWithMeta(): SeriesWithMeta[] {
  const meta = new Map<string, { count: number; lastUpdated?: string }>()
  for (const ch of chapters) {
    if (ch.draft) continue
    const prev = meta.get(ch.series)
    meta.set(ch.series, {
      count: (prev?.count ?? 0) + 1,
      lastUpdated:
        ch.last_synced && (!prev?.lastUpdated || ch.last_synced > prev.lastUpdated)
          ? ch.last_synced
          : prev?.lastUpdated,
    })
  }
  return series
    .filter((s) => !s.draft)
    .map((s) => ({
      ...s,
      chapterCount: meta.get(s.slugAsParams)?.count ?? 0,
      lastUpdated: meta.get(s.slugAsParams)?.lastUpdated,
    }))
}

// ─── Variant A: 대형 카드 + 메타 ───

function VariantA({ items }: { items: SeriesWithMeta[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((s) => (
        <Link
          key={s.slug}
          href={`/${s.slugAsParams}`}
          className="group rounded-xl border border-border/60 p-5 transition-colors hover:border-foreground/40"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-md border border-border/40 bg-muted/40">
              <span className="font-mono text-lg text-muted-foreground">B</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {topicLabel(s.category).replace(/^\d+\.\s*/, '')}
              </div>
              <div className="mt-1 text-[15px] font-medium leading-snug group-hover:text-primary">
                {s.title}
              </div>
              {s.description && (
                <div className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted-foreground">
                  {s.description}
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] text-muted-foreground">
            {s.chapterCount > 0 && <span>{s.chapterCount}개 챕터</span>}
            {s.lastUpdated && (
              <>
                <span>·</span>
                <span>업데이트 {s.lastUpdated.slice(0, 10).replace(/-/g, '.')}</span>
              </>
            )}
          </div>
          {s.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {s.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}

// ─── Variant B: 매거진 레이아웃 ───

function VariantB({ items }: { items: SeriesWithMeta[] }) {
  const [hero, ...rest] = items
  if (!hero) return null

  return (
    <div className="space-y-4">
      {/* Hero card */}
      <Link
        href={`/${hero.slugAsParams}`}
        className="group block rounded-xl border border-border/60 p-6 transition-colors hover:border-foreground/40 sm:p-8"
      >
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {topicLabel(hero.category).replace(/^\d+\.\s*/, '')} · {hero.chapterCount}개 챕터
        </div>
        <h3 className="mt-2 text-xl font-semibold tracking-tight group-hover:text-primary sm:text-2xl">
          {hero.title}
        </h3>
        {hero.description && (
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
            {hero.description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {hero.tags.slice(0, 5).map((t) => (
            <span
              key={t}
              className="rounded-full border border-border/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
          {hero.lastUpdated && (
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              업데이트 {hero.lastUpdated.slice(0, 10).replace(/-/g, '.')}
            </span>
          )}
        </div>
      </Link>

      {/* Rest */}
      {rest.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slugAsParams}`}
              className="group rounded-xl border border-border/60 p-5 transition-colors hover:border-foreground/40"
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {topicLabel(s.category).replace(/^\d+\.\s*/, '')}
              </div>
              <div className="mt-2 text-[15px] font-medium leading-snug group-hover:text-primary">
                {s.title}
              </div>
              {s.description && (
                <div className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted-foreground">
                  {s.description}
                </div>
              )}
              <div className="mt-3 font-mono text-[10px] text-muted-foreground">
                {s.chapterCount}개 챕터
                {s.lastUpdated && ` · 업데이트 ${s.lastUpdated.slice(0, 10).replace(/-/g, '.')}`}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Variant C: 번호 기반 미니멀 ───

function VariantC({ items }: { items: SeriesWithMeta[] }) {
  return (
    <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
      {items.map((s, i) => (
        <Link
          key={s.slug}
          href={`/${s.slugAsParams}`}
          className="group border-t border-border/60 pt-5"
        >
          <div className="font-mono text-3xl tracking-tighter text-muted-foreground/40">
            {String(i + 1).padStart(2, '0')}
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {topicLabel(s.category).replace(/^\d+\.\s*/, '')}
          </div>
          <h3 className="mt-1.5 text-[15px] font-medium leading-snug group-hover:text-primary">
            {s.title}
          </h3>
          <div className="mt-2 font-mono text-[10px] text-muted-foreground">
            {s.chapterCount}개 챕터
            {s.lastUpdated && ` · 업데이트 ${s.lastUpdated.slice(0, 10).replace(/-/g, '.')}`}
          </div>
        </Link>
      ))}
    </div>
  )
}

// ─── Page ───

export default function SeriesPreviewPage() {
  const items = getSeriesWithMeta()

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        Series Design Preview
      </p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        Featured Series 디자인 비교
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        3가지 디자인 안을 실제 데이터로 비교합니다. 하나를 선택하면 홈페이지에 적용됩니다.
      </p>

      {/* Variant A */}
      <section className="mt-14 border-t border-border/60 pt-10">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          A — 대형 카드 + 메타
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          북커버 썸네일 + 카테고리 라벨 + 설명 + 챕터 수 + 태그
        </p>
        <div className="mt-6">
          <VariantA items={items} />
        </div>
      </section>

      {/* Variant B */}
      <section className="mt-14 border-t border-border/60 pt-10">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          B — 매거진 레이아웃
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          첫 시리즈 대형 히어로 + 나머지 소형 카드
        </p>
        <div className="mt-6">
          <VariantB items={items} />
        </div>
      </section>

      {/* Variant C */}
      <section className="mt-14 border-t border-border/60 pt-10">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          C — 번호 기반 미니멀
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          큰 순번 + 카테고리 + 제목 + 메타. Vercel 스타일 절제된 느낌
        </p>
        <div className="mt-6">
          <VariantC items={items} />
        </div>
      </section>
    </div>
  )
}
