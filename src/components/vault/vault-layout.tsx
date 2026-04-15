import { posts, series, chapters } from '#site/content'
import { VaultSidebar, type VaultData } from '@/components/vault/vault-sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { buildVaultTree } from '@/lib/vault-tree'

export function getVaultData(): VaultData {
  const visiblePosts = posts.filter((p) => !p.draft)
  const visibleSeries = series.filter((s) => !s.draft)
  const tagCounts = new Map<string, number>()
  for (const p of visiblePosts) for (const t of p.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
  const tagList: [string, number][] = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  return {
    tree: buildVaultTree(visiblePosts, visibleSeries, chapters),
    counts: { posts: visiblePosts.length, series: visibleSeries.length, tags: tagCounts.size },
    tags: tagList,
  }
}

export function VaultLayout({ children }: { children: React.ReactNode }) {
  const vaultData = getVaultData()
  return (
    <div className="border-t border-border/60">
      <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-5xl grid-cols-12 gap-0 px-6 lg:px-0">
        <aside className="hidden border-border/60 lg:col-span-3 lg:block lg:border-r">
          <div className="group/sidebar sticky top-14 h-[calc(100vh-3.5rem)]">
            <ScrollArea className="h-full [&_[data-slot=scroll-area-scrollbar]]:opacity-0 [&_[data-slot=scroll-area-scrollbar]]:transition-opacity group-hover/sidebar:[&_[data-slot=scroll-area-scrollbar]]:opacity-100">
              <div className="px-6 pt-14 pb-8">
                <VaultSidebar data={vaultData} />
              </div>
            </ScrollArea>
          </div>
        </aside>
        <section className="col-span-12 min-w-0 lg:col-span-9">
          <div className="pt-14 pb-8 sm:pb-10 lg:px-12">
            {children}
          </div>
        </section>
      </div>
    </div>
  )
}
