'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import MiniSearch from 'minisearch'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import type { SearchDoc } from '@/lib/search'

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [docs, setDocs] = React.useState<SearchDoc[]>([])
  const router = useRouter()

  const mini = React.useMemo(() => {
    const ms = new MiniSearch<SearchDoc>({
      fields: ['title', 'description', 'body', 'tags'],
      storeFields: ['title', 'description', 'url', 'type', 'tags'],
      idField: 'id',
      searchOptions: { boost: { title: 3, tags: 2 }, fuzzy: 0.2, prefix: true },
    })
    ms.addAll(docs)
    return ms
  }, [docs])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  React.useEffect(() => {
    if (!open || docs.length > 0) return
    fetch('/search-index.json')
      .then((r) => r.json())
      .then((d) => setDocs(d.docs ?? []))
      .catch(() => {})
  }, [open, docs.length])

  const results = query.trim()
    ? (mini.search(query, { fuzzy: 0.2, prefix: true }) as unknown as (SearchDoc & { score: number })[])
    : []

  const go = (url: string) => {
    setOpen(false)
    setQuery('')
    router.push(url)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="검색 열기"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="제목, 내용, 태그로 검색…" value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty>결과가 없습니다.</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="결과">
              {results.slice(0, 20).map((r) => (
                <CommandItem
                  key={r.id}
                  value={`${r.id} ${r.title} ${r.description} ${r.tags.join(' ')}`}
                  onSelect={() => go(r.url)}
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{r.title}</span>
                    {r.description && (
                      <span className="truncate text-xs text-muted-foreground">{r.description}</span>
                    )}
                  </div>
                  <span className="ml-2 font-mono text-[10px] uppercase text-muted-foreground">
                    {r.type}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
