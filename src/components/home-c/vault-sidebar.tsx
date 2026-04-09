import Link from 'next/link'

export interface VaultData {
  counts: {
    accountingPosts: number
    aiPosts: number
    accountingSeries: number
    aiSeries: number
    posts: number
    series: number
    tags: number
  }
  tags: [string, number][]
}

function FolderNode({
  label,
  count,
  children,
}: {
  label: string
  count: number
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 py-1 text-sm">
        <span className="font-mono text-[10px] text-muted-foreground">▾</span>
        <span className="flex-1">{label}</span>
        <span className="font-mono text-[10px] text-muted-foreground">{count}</span>
      </div>
      <div className="ml-4 border-l border-border/60">{children}</div>
    </div>
  )
}

function NavLeaf({ href, label, count }: { href: string; label: string; count: number }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-1.5 py-1 pl-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="font-mono text-[10px]">▸</span>
      <span className="flex-1">{label}</span>
      <span className="font-mono text-[10px] opacity-60">{count}</span>
    </Link>
  )
}

export function VaultSidebar({ data }: { data: VaultData }) {
  const { counts, tags } = data

  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Vault
      </div>

      <div className="mt-5 space-y-1">
        <FolderNode
          label="회계실무"
          count={counts.accountingPosts + counts.accountingSeries}
        >
          <NavLeaf href="/series" label="시리즈" count={counts.accountingSeries} />
          <NavLeaf href="/posts" label="포스트" count={counts.accountingPosts} />
        </FolderNode>
        <FolderNode label="AI · 생산성" count={counts.aiPosts + counts.aiSeries}>
          <NavLeaf href="/series" label="시리즈" count={counts.aiSeries} />
          <NavLeaf href="/posts" label="포스트" count={counts.aiPosts} />
        </FolderNode>
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
