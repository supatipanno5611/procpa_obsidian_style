import Link from 'next/link'
import { posts } from '#site/content'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MobileCollapsible } from '@/components/mobile-collapsible'

interface FolderPostsSidebarProps {
  currentSlug: string
  category: string
  subcategory: string | null
}

export function FolderPostsSidebar({
  currentSlug,
  category,
  subcategory,
}: FolderPostsSidebarProps) {
  const folderPosts = posts
    .filter(
      (p) =>
        !p.draft &&
        p.category === category &&
        p.subcategory === subcategory,
    )
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))

  if (folderPosts.length <= 1) return null

  const listContent = (
    <ol className="space-y-0.5 border-l border-border/60">
      {folderPosts.map((p) => {
        const active = p.slugAsParams === currentSlug
        return (
          <li key={p.slug}>
            <Link
              href={`/${p.slugAsParams}`}
              className={`block border-l-2 px-4 py-1.5 text-[13px] leading-snug transition-colors ${
                active
                  ? '-ml-[2px] border-primary text-foreground'
                  : '-ml-[2px] border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.title}
            </Link>
          </li>
        )
      })}
    </ol>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)]">
          <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {subcategory}
          </h3>
          <ScrollArea className="max-h-[calc(100vh-10rem)]">
            {listContent}
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile */}
      <MobileCollapsible title={`${subcategory} · ${folderPosts.length}개 글`}>
        {listContent}
      </MobileCollapsible>
    </>
  )
}
