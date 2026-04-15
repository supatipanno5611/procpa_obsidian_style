import Link from 'next/link'
import type { Metadata } from 'next'
import { posts, series, chapters } from '#site/content'
import { VaultSidebar, type VaultData } from '@/components/vault/vault-sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { buildVaultTree } from '@/lib/vault-tree'
import { NoteCarousel } from '@/components/note-carousel'
import { JsonLd, websiteJsonLd } from '@/components/json-ld'
import { SeriesCard, PostCard } from '@/components/content-card'
import { KakaoBanner } from '@/components/kakao-banner'

export const metadata: Metadata = {
  title: 'PROCPA',
  description: '한국공인회계사 이재현의 개인 지식 데이터베이스 — 회계·재무 전문성에 AI의 생산성을 더하다.',
}

export default function HomePage() {
  const visiblePosts = posts.filter((p) => !p.draft)
  const visibleSeries = series.filter((s) => !s.draft)

  const recentPosts = [...visiblePosts]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 5)

  const accountingSeries = visibleSeries.filter((s) => s.category === '회계실무')
  const aiSeries = visibleSeries.filter((s) => s.category !== '회계실무')

  const tagCounts = new Map<string, number>()
  for (const p of visiblePosts) for (const t of p.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
  const tagList: [string, number][] = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  const vaultTree = buildVaultTree(visiblePosts, visibleSeries, chapters)

  const vaultData: VaultData = {
    tree: vaultTree,
    counts: {
      posts: visiblePosts.length,
      series: visibleSeries.length,
      tags: tagCounts.size,
    },
    tags: tagList,
  }

  return (
    <>
    <JsonLd data={websiteJsonLd()} />
    <div className="border-t border-border/60">
      <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-5xl grid-cols-12 gap-0 px-6 lg:px-0">
        {/* ───────── Left · Vault sidebar (desktop only) ───────── */}
        <aside className="hidden border-border/60 lg:col-span-3 lg:block lg:border-r">
          <div className="group/sidebar sticky top-14 h-[calc(100vh-3.5rem)]">
            <ScrollArea className="h-full [&_[data-slot=scroll-area-scrollbar]]:opacity-0 [&_[data-slot=scroll-area-scrollbar]]:transition-opacity group-hover/sidebar:[&_[data-slot=scroll-area-scrollbar]]:opacity-100">
              <div className="px-6 pt-14 pb-8">
                <VaultSidebar data={vaultData} />
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* ───────── Center · Note view ───────── */}
        <section className="col-span-12 min-w-0 lg:col-span-9">
          <div className="pt-14 pb-8 sm:pb-10 lg:px-12">
            {/* Breadcrumb */}
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              HOME
            </div>

            {/* ── Hero ── */}
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              회계·재무 전문성에
              <br />
              <span className="text-primary">AI의 생산성</span>을 더하다.
            </h1>

            <p className="mt-6 max-w-2xl text-[15px] leading-[1.85] text-muted-foreground sm:text-base">
              <span className="text-foreground">한국공인회계사</span>의 개인 지식
              데이터베이스.
              <br />
              실무에 즉시 활용 가능한 <span className="text-foreground">회계·재무 지식</span>과 <span className="text-foreground">AI 생산성 인사이트</span>를 공유합니다.
            </p>
            <div className="mt-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-4 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                About Me →
              </Link>
            </div>

            {/* ── Site Guide ── */}
            <div className="mt-14 border-t border-border/60 pt-14 lg:mt-16 lg:pt-16">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Site Guide
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                이 사이트는 옵시디언 스타일의 지식 관리 시스템으로 구성되어 있습니다.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/explore"
                  className="group rounded-md border border-border/60 px-4 py-4 transition-all hover:translate-y-[-2px] hover:border-foreground/40 hover:shadow-sm"
                >
                  <div className="text-[13px] font-medium group-hover:text-primary">
                    메타데이터 탐색
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                    카테고리, 태그, 연도 등 메타데이터를 이용해서 노트를 탐색할 수 있습니다.
                  </p>
                </Link>
                <Link
                  href="/graph"
                  className="group rounded-md border border-border/60 px-4 py-4 transition-all hover:translate-y-[-2px] hover:border-foreground/40 hover:shadow-sm"
                >
                  <div className="text-[13px] font-medium group-hover:text-primary">
                    지식 그래프
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                    노트 간 연결 관계를 시각적으로 탐색할 수 있습니다.
                  </p>
                </Link>
              </div>
            </div>

            {/* ── Featured Series ── */}
            <div className="mt-14 border-t border-border/60 pt-14 lg:mt-16 lg:pt-16">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Featured Series
              </h2>

              {accountingSeries.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 font-mono text-[10px] text-muted-foreground">
                    회계실무
                  </h3>
                  <NoteCarousel>
                    {accountingSeries.map((s) => {
                      const cc = chapters.filter((c) => !c.draft && c.series === s.slugAsParams)
                      const lastSynced = cc.map((c) => c.last_synced).filter(Boolean).sort().pop()
                      return (
                        <SeriesCard
                          key={s.slug}
                          title={s.title}
                          description={s.description}
                          url={`/${s.slugAsParams}`}
                          cover={s.cover}
                          chapterCount={cc.length || undefined}
                          lastUpdated={lastSynced ?? undefined}
                          variant="featured"
                        />
                      )
                    })}
                  </NoteCarousel>
                </div>
              )}

              {aiSeries.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-3 font-mono text-[10px] text-muted-foreground">
                    AI / 생산성
                  </h3>
                  <NoteCarousel>
                    {aiSeries.map((s) => {
                      const cc = chapters.filter((c) => !c.draft && c.series === s.slugAsParams)
                      const lastSynced = cc.map((c) => c.last_synced).filter(Boolean).sort().pop()
                      return (
                        <SeriesCard
                          key={s.slug}
                          title={s.title}
                          description={s.description}
                          url={`/${s.slugAsParams}`}
                          cover={s.cover}
                          chapterCount={cc.length || undefined}
                          lastUpdated={lastSynced ?? undefined}
                          variant="featured"
                        />
                      )
                    })}
                  </NoteCarousel>
                </div>
              )}
            </div>

            {/* ── Recent Notes (carousel) ── */}
            <div className="mt-14 border-t border-border/60 pt-14 lg:mt-16 lg:pt-16">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Recent Notes
              </h2>
              <NoteCarousel>
                {recentPosts.map((p) => (
                  <PostCard
                    key={p.slug}
                    title={p.title}
                    description={p.description}
                    url={`/${p.slugAsParams}`}
                    date={p.date}
                    category={p.category === '회계실무' ? '회계' : 'AI'}
                    variant="card"
                  />
                ))}
              </NoteCarousel>
            </div>

            {/* ── Community ── */}
            <div className="mt-14 border-t border-border/60 pt-14 lg:mt-16 lg:pt-16">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Community
              </h2>
              <KakaoBanner />
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  )
}
