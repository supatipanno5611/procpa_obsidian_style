import { posts, series } from '#site/content'
import { buildVaultTree } from '@/lib/vault-tree'
import { VaultSidebar, type VaultData } from './vault-sidebar'

export function MobileVaultSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const visiblePosts = posts.filter((p) => !p.draft)
  const visibleSeries = series.filter((s) => !s.draft)

  const tagCounts = new Map<string, number>()
  for (const p of visiblePosts) for (const t of p.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
  const tagList: [string, number][] = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  const vaultData: VaultData = {
    tree: buildVaultTree(visiblePosts, visibleSeries),
    counts: {
      posts: visiblePosts.length,
      series: visibleSeries.length,
      tags: tagCounts.size,
    },
    tags: tagList,
  }

  return <VaultSidebar data={vaultData} onNavigate={onNavigate} />
}
