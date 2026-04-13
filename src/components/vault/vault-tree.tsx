'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Folder, FolderOpen, BookOpen, StickyNote } from 'lucide-react'
import type { TreeNode } from '@/lib/vault-tree'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'vault-expanded'

function collectAncestors(nodes: TreeNode[], pathname: string, acc: Set<string>): boolean {
  let hit = false
  for (const node of nodes) {
    if (node.kind === 'folder') {
      const childHit = collectAncestors(node.children, pathname, acc)
      const selfHit = node.href === pathname
      if (childHit || selfHit) {
        acc.add(node.key)
        hit = true
      }
    } else if (node.href === pathname) {
      hit = true
    }
  }
  return hit
}

export function VaultTree({ nodes, onNavigate }: { nodes: TreeNode[]; onNavigate?: () => void }) {
  const pathname = usePathname()
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set())
  const [hydrated, setHydrated] = React.useState(false)

  // 초기 마운트 시 localStorage에서 복원
  React.useEffect(() => {
    let restored: Set<string>
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      restored = raw ? new Set(JSON.parse(raw) as string[]) : new Set()
    } catch {
      restored = new Set()
    }
    collectAncestors(nodes, pathname, restored)
    setExpanded(restored)
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes])

  // pathname 변경 시 ancestors만 추가 (기존 expanded 유지)
  React.useEffect(() => {
    if (!hydrated) return
    setExpanded((prev) => {
      const next = new Set(prev)
      collectAncestors(nodes, pathname, next)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch {}
      return next
    })
  }, [pathname, nodes, hydrated])

  const toggle = React.useCallback((key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch {}
      return next
    })
  }, [])

  return (
    <ul className="space-y-0.5">
      {nodes.map((n) => (
        <TreeItem
          key={n.key}
          node={n}
          depth={0}
          expanded={expanded}
          hydrated={hydrated}
          pathname={pathname}
          onToggle={toggle}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  )
}

function FileIcon({ nodeType }: { nodeType: 'post' | 'series' }) {
  if (nodeType === 'series') {
    return <BookOpen className="h-3.5 w-3.5 shrink-0 opacity-70" />
  }
  return <StickyNote className="h-3.5 w-3.5 shrink-0 opacity-60" />
}

function TreeItem({
  node,
  depth,
  expanded,
  hydrated,
  pathname,
  onToggle,
  onNavigate,
}: {
  node: TreeNode
  depth: number
  expanded: Set<string>
  hydrated: boolean
  pathname: string
  onToggle: (key: string) => void
  onNavigate?: () => void
}) {
  if (node.kind === 'file') {
    const effectiveDepth = Math.max(depth, 2)
    const fileIndent = { paddingLeft: `${effectiveDepth * 12 - 4}px` }
    const active = node.href === pathname
    return (
      <li>
        <Link
          href={node.href}
          onClick={onNavigate}
          style={fileIndent}
          className={cn(
            'group flex items-center gap-1.5 rounded-sm py-1 pr-2 text-[13px] transition-colors',
            active
              ? 'bg-accent text-foreground'
              : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
          )}
        >
          <FileIcon nodeType={node.nodeType} />
          <span>{node.label}</span>
        </Link>
      </li>
    )
  }

  // folder (category or subcategory)
  const folderIndent = { paddingLeft: `${depth * 12 + 4}px` }
  const isOpen = hydrated ? expanded.has(node.key) : false
  const active = node.href === pathname

  return (
    <li>
      <div
        style={folderIndent}
        className={cn(
          'group flex items-center gap-1 rounded-sm py-1 pr-2 text-[13px] transition-colors',
          active ? 'text-foreground' : 'text-foreground/85 hover:text-foreground',
        )}
      >
        <button
          type="button"
          onClick={() => onToggle(node.key)}
          aria-label={isOpen ? '폴더 접기' : '폴더 펼치기'}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded hover:bg-accent"
        >
          <ChevronRight
            className={cn('h-3 w-3 transition-transform', isOpen && 'rotate-90')}
          />
        </button>
        {isOpen ? (
          <FolderOpen className="h-3.5 w-3.5 shrink-0 opacity-70" />
        ) : (
          <Folder className="h-3.5 w-3.5 shrink-0 opacity-70" />
        )}
        {node.href ? (
          <Link href={node.href} onClick={onNavigate} className="flex-1 hover:underline">
            {node.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onToggle(node.key)}
            className="flex-1 text-left"
          >
            {node.label}
          </button>
        )}
        {node.count > 0 && (
          <span className="font-mono text-[10px] text-muted-foreground">{node.count}</span>
        )}
      </div>
      {isOpen && node.children.length > 0 && (
        <ul
          className="space-y-0.5 border-l border-border/40"
          style={{ marginLeft: `${depth * 12 + 4 + 9}px` }}
        >
          {node.children.map((child) => (
            <TreeItem
              key={child.key}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              hydrated={hydrated}
              pathname={pathname}
              onToggle={onToggle}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
