import Link from 'next/link'
import type { TreeNode } from '@/lib/vault-tree'
import { VaultTree } from './vault-tree'

export interface VaultData {
  tree: TreeNode[]
  counts: {
    posts: number
    series: number
    tags: number
  }
  tags: [string, number][]
}

export function VaultSidebar({ data, onNavigate }: { data: VaultData; onNavigate?: () => void }) {
  const { tree, counts, tags } = data

  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Vault
      </div>

      <div className="mt-5">
        <VaultTree nodes={tree} onNavigate={onNavigate} />
      </div>

      <div className="mt-10 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Tags
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tags.length === 0 ? (
          <span className="text-xs text-muted-foreground">—</span>
        ) : (
          tags.map(([t, c]) => (
            <Link
              key={t}
              href={`/tags/${t}`}
              onClick={onNavigate}
              className="inline-flex items-center gap-1 rounded border border-border/60 px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              #{t}
              <span className="font-mono text-[10px] opacity-60">{c}</span>
            </Link>
          ))
        )}
      </div>

      <div className="mt-10 border-t border-border/60 pt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Stats
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 font-mono text-[11px]">
        <div>
          <dt className="text-muted-foreground">posts</dt>
          <dd className="text-foreground">{counts.posts}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">series</dt>
          <dd className="text-foreground">{counts.series}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">tags</dt>
          <dd className="text-foreground">{counts.tags}</dd>
        </div>
      </dl>
    </div>
  )
}
