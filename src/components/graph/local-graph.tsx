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
  degree: number
}
type GraphEdge = { source: string; target: string }
type GraphJson = { nodes: GraphNode[]; edges: GraphEdge[] }

const GRAPH = graphData as GraphJson

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })

// 라이트/다크 양쪽에서 대비가 충분히 잡히는 값
const COLORS: Record<string, string> = {
  '인사이트': '#a78bfa',   // violet-400
  '회계실무': '#60a5fa',   // blue-400
  'ai-생산성': '#d4d4d8',  // zinc-300
  '개발': '#34d399',       // emerald-400
}
const ACTIVE_COLOR = '#fbbf24' // amber-400
const EDGE_COLOR = 'rgba(148,163,184,0.4)' // slate-400/40 — 양쪽 테마에서 자연스러움

function buildSubgraph(currentId: string, depth: number) {
  const adj = new Map<string, Set<string>>()
  for (const e of GRAPH.edges) {
    if (!adj.has(e.source)) adj.set(e.source, new Set())
    if (!adj.has(e.target)) adj.set(e.target, new Set())
    adj.get(e.source)!.add(e.target)
    adj.get(e.target)!.add(e.source)
  }
  const visited = new Set<string>([currentId])
  let frontier: string[] = [currentId]
  for (let d = 0; d < depth; d++) {
    const next: string[] = []
    for (const id of frontier) {
      for (const n of adj.get(id) ?? []) {
        if (!visited.has(n)) {
          visited.add(n)
          next.push(n)
        }
      }
    }
    frontier = next
  }
  const nodes = GRAPH.nodes.filter((n) => visited.has(n.id))
  const edges = GRAPH.edges.filter((e) => visited.has(e.source) && visited.has(e.target))
  return {
    nodes: nodes.map((n) => ({ ...n })),
    links: edges.map((e) => ({ source: e.source, target: e.target })),
  }
}

export function LocalGraph({
  currentSlug,
  depth = 1,
}: {
  currentSlug: string
  depth?: number
}) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const data = useMemo(() => buildSubgraph(currentSlug, depth), [currentSlug, depth])

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

  // 노드가 1개(=현재 글만, 이웃 없음)면 그래프 숨김
  if (data.nodes.length <= 1) return null

  return (
    <aside className="mt-12 border-t border-border/60 pt-6">
      <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <span>Local Graph</span>
        <span>
          {data.nodes.length} nodes · {data.links.length} edges
        </span>
      </div>
      <div
        ref={containerRef}
        className="relative h-48 w-full overflow-hidden rounded border border-border/60 bg-background sm:h-56 md:h-64"
      >
        {size.w > 0 && size.h > 0 && (
        <ForceGraph2D
          graphData={data}
          width={size.w}
          height={size.h}
          nodeRelSize={1.5}
          nodeLabel={(n: any) => n.title}
          nodeVal={(n: any) => 0.6 + Math.min(n.degree ?? 0, 6) * 0.3}
          nodeColor={(n: any) =>
            n.id === currentSlug ? ACTIVE_COLOR : COLORS[n.category] ?? '#888'
          }
          linkColor={() => EDGE_COLOR}
          linkWidth={1}
          cooldownTicks={80}
          enableZoomInteraction={false}
          onNodeClick={(n: any) => {
            if (n.id !== currentSlug && n.url) router.push(n.url)
          }}
        />
        )}
      </div>
    </aside>
  )
}

/** 사이드바용 미니 로컬 그래프 */
export function LocalGraphMini({
  currentSlug,
  depth = 1,
}: {
  currentSlug: string
  depth?: number
}) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const data = useMemo(() => buildSubgraph(currentSlug, depth), [currentSlug, depth])

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

  if (data.nodes.length <= 1) return null

  return (
    <div>
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Graph · {data.nodes.length}
      </h3>
      <div
        ref={containerRef}
        className="relative h-44 w-full overflow-hidden rounded border border-border/60 bg-background"
      >
        {size.w > 0 && size.h > 0 && (
          <ForceGraph2D
            graphData={data}
            width={size.w}
            height={size.h}
            nodeRelSize={1.5}
            nodeLabel={(n: any) => n.title}
            nodeVal={(n: any) => 0.5 + Math.min(n.degree ?? 0, 4) * 0.25}
            nodeColor={(n: any) =>
              n.id === currentSlug ? ACTIVE_COLOR : COLORS[n.category] ?? '#888'
            }
            linkColor={() => EDGE_COLOR}
            linkWidth={0.8}
            cooldownTicks={60}
            enableZoomInteraction={false}
            onNodeClick={(n: any) => {
              if (n.id !== currentSlug && n.url) router.push(n.url)
            }}
          />
        )}
      </div>
    </div>
  )
}
