'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import graphData from '../../../.velite/graph.json'

type GraphNode = {
  id: string
  type: 'post' | 'chapter'
  title: string
  category: string
  url: string
  tags: string[]
  degree: number
}
type GraphEdge = { source: string; target: string }
type GraphJson = { nodes: GraphNode[]; edges: GraphEdge[] }

const GRAPH = graphData as GraphJson

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })

const COLORS: Record<string, string> = {
  '인사이트': '#a78bfa',   // violet-400
  '회계실무': '#60a5fa',   // blue-400
  'ai-생산성': '#d4d4d8',  // zinc-300
  '개발': '#34d399',       // emerald-400
}
const EDGE_COLOR = 'rgba(148,163,184,0.4)'

type Filter = string

export function GlobalGraph() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 600 })
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (rect) setSize({ w: Math.floor(rect.width), h: Math.floor(rect.height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const data = useMemo(() => {
    const nodes = GRAPH.nodes
      .filter((n) => (filter === 'all' ? true : n.category === filter))
      .map((n) => ({ ...n }))
    const ids = new Set(nodes.map((n) => n.id))
    const links = GRAPH.edges
      .filter((e) => ids.has(e.source) && ids.has(e.target))
      .map((e) => ({ source: e.source, target: e.target }))
    return { nodes, links }
  }, [filter])

  const q = query.normalize('NFC').toLowerCase().trim()

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <span>Global Graph</span>
        <span>·</span>
        <span>{data.nodes.length} nodes</span>
        <span>·</span>
        <span>{data.links.length} edges</span>
        <div className="ml-auto flex items-center gap-2">
          {['all', ...Object.keys(COLORS)].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={
                'rounded border border-border/60 px-2 py-1 ' +
                (filter === f ? 'bg-foreground text-background' : 'hover:bg-muted')
              }
            >
              {f}
            </button>
          ))}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search"
            className="rounded border border-border/60 bg-background px-2 py-1 text-xs"
          />
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative w-full flex-1 overflow-hidden rounded border border-border/60 bg-background"
      >
        {size.w > 0 && (
          <ForceGraph2D
            graphData={data}
            width={size.w}
            height={size.h}
            nodeRelSize={2}
            nodeLabel={(n: any) => n.title}
            nodeVal={(n: any) => 0.6 + Math.min(n.degree ?? 0, 10) * 0.3}
            nodeColor={(n: any) => {
              if (q && !n.title.normalize('NFC').toLowerCase().includes(q))
                return 'rgba(120,120,120,0.2)'
              return COLORS[n.category] ?? '#888'
            }}
            linkColor={() => EDGE_COLOR}
            linkWidth={1}
            cooldownTicks={100}
            onNodeClick={(n: any) => n.url && router.push(n.url)}
          />
        )}
      </div>
    </div>
  )
}
