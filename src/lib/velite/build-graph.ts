/**
 * build-graph
 *
 * Velite의 `prepare` 훅에서 호출되어 wiki-link 그래프/백링크 인덱스를 생성한다.
 * posts, chapters의 원본 마크다운을 다시 스캔해 `[[...]]`를 추출하고,
 * slugMap으로 resolve한 뒤 nodes/edges/backlinks JSON을 `.velite/`에 기록한다.
 *
 * 런타임(WikiLink 컴포넌트, LocalGraph 등)은 이 JSON을 `#site/content`에서 import한다.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'

const WIKI_RE = /\[\[([^\][\n|#]+)(?:#([^\][\n|]+))?(?:\|([^\][\n]+))?\]\]/g
// 코드 펜스/인라인 코드 제거용 (간이)
const CODE_FENCE_RE = /```[\s\S]*?```/g
const INLINE_CODE_RE = /`[^`\n]*`/g

export type GraphNode = {
  id: string // slugAsParams key (normalized)
  type: 'post' | 'chapter'
  title: string
  category: 'accounting' | 'ai'
  url: string
  tags: string[]
  series?: string
  degree: number
}

export type GraphEdge = {
  source: string
  target: string
}

export type BacklinkEdge = {
  sourceId: string
  sourceTitle: string
  sourceUrl: string
  sourceType: 'post' | 'chapter'
  category: 'accounting' | 'ai'
  context: string
  alias?: string
  heading?: string
}

export type BrokenLink = {
  sourceId: string
  target: string
  heading?: string
}

export type GraphData = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export type SlugMapEntry = {
  id: string
  type: 'post' | 'chapter'
  title: string
  description?: string
  url: string
  category: 'accounting' | 'ai'
}

type Entry = {
  slug: string
  slugAsParams: string
  title: string
  description?: string
  category?: 'accounting' | 'ai'
  tags?: string[]
  series?: string
  [k: string]: unknown
}

const norm = (s: string) => s.normalize('NFC').toLowerCase().trim()

function stripCode(md: string): string {
  return md.replace(CODE_FENCE_RE, '').replace(INLINE_CODE_RE, '')
}

function extractContext(md: string, matchIndex: number, rawLen: number): string {
  const WINDOW = 120
  const start = Math.max(0, matchIndex - WINDOW)
  const end = Math.min(md.length, matchIndex + rawLen + WINDOW)
  let ctx = md.slice(start, end).replace(/\s+/g, ' ').trim()
  if (start > 0) ctx = '…' + ctx
  if (end < md.length) ctx = ctx + '…'
  return ctx
}

function urlOf(entry: Entry, type: 'post' | 'chapter'): string {
  if (type === 'post') return `/posts/${entry.slugAsParams}`
  return `/series/${entry.slugAsParams}`
}

export async function buildGraph(opts: {
  posts: Entry[]
  chapters: Entry[]
  contentRoot: string
  outDir: string
}) {
  const { posts, chapters, contentRoot, outDir } = opts

  // ---- 1) slugMap 구성 ----
  const slugMap: Record<string, SlugMapEntry> = {}
  const register = (entry: Entry, type: 'post' | 'chapter') => {
    const node: SlugMapEntry = {
      id: entry.slugAsParams,
      type,
      title: entry.title,
      description: entry.description,
      url: urlOf(entry, type),
      category: entry.category ?? 'accounting',
    }
    // 다양한 키로 등록: slugAsParams, 파일명, 제목
    const keys = new Set<string>()
    keys.add(norm(entry.slugAsParams))
    keys.add(norm(entry.slugAsParams.split('/').pop() ?? ''))
    keys.add(norm(entry.title))
    for (const k of keys) if (k) slugMap[k] ??= node
  }
  for (const p of posts) register(p, 'post')
  for (const c of chapters) register(c, 'chapter')

  // ---- 2) 노드 초기화 ----
  const nodes: Record<string, GraphNode> = {}
  const addNode = (entry: Entry, type: 'post' | 'chapter') => {
    nodes[entry.slugAsParams] = {
      id: entry.slugAsParams,
      type,
      title: entry.title,
      category: entry.category ?? 'accounting',
      url: urlOf(entry, type),
      tags: entry.tags ?? [],
      series: entry.series,
      degree: 0,
    }
  }
  for (const p of posts) addNode(p, 'post')
  for (const c of chapters) addNode(c, 'chapter')

  // ---- 3) 원본 파일 재스캔 & 엣지/백링크 생성 ----
  const edges: GraphEdge[] = []
  const seenEdges = new Set<string>()
  const backlinks: Record<string, BacklinkEdge[]> = {}
  const seenBacklinks = new Set<string>() // source→target 단위 1회만
  const broken: BrokenLink[] = []

  const scan = async (entry: Entry, type: 'post' | 'chapter') => {
    // velite의 slug는 확장자 없는 상대경로. 실제 md 경로는 slug + '.md'
    const abs = path.join(contentRoot, `${entry.slug}.md`)
    let raw: string
    try {
      raw = await fs.readFile(abs, 'utf8')
    } catch {
      return
    }
    // frontmatter 제거
    const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, '')
    const cleaned = stripCode(body)

    WIKI_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = WIKI_RE.exec(cleaned)) !== null) {
      const [raw2, rawTarget, rawHeading, rawAlias] = m
      const target = rawTarget.trim()
      const heading = rawHeading?.trim()
      const alias = rawAlias?.trim()

      const resolved = slugMap[norm(target)]
      if (!resolved) {
        broken.push({ sourceId: entry.slugAsParams, target, heading })
        continue
      }
      if (resolved.id === entry.slugAsParams) continue // self-link 제외

      // 같은 (source→target) 쌍은 한 번만 엣지로 등록 (degree 중복 방지)
      const edgeKey = `${entry.slugAsParams}→${resolved.id}`
      if (!seenEdges.has(edgeKey)) {
        seenEdges.add(edgeKey)
        edges.push({ source: entry.slugAsParams, target: resolved.id })
        nodes[entry.slugAsParams].degree += 1
        nodes[resolved.id].degree += 1
      }

      const backlinkKey = `${entry.slugAsParams}→${resolved.id}`
      if (seenBacklinks.has(backlinkKey)) continue
      seenBacklinks.add(backlinkKey)
      const sourceNode = nodes[entry.slugAsParams]
      ;(backlinks[resolved.id] ??= []).push({
        sourceId: entry.slugAsParams,
        sourceTitle: sourceNode.title,
        sourceUrl: sourceNode.url,
        sourceType: type,
        category: sourceNode.category,
        context: extractContext(cleaned, m.index, raw2.length),
        alias,
        heading,
      })
    }
  }

  await Promise.all([
    ...posts.map((p) => scan(p, 'post')),
    ...chapters.map((c) => scan(c, 'chapter')),
  ])

  // ---- 4) 파일 기록 ----
  const graph: GraphData = { nodes: Object.values(nodes), edges }
  await fs.mkdir(outDir, { recursive: true })
  await Promise.all([
    fs.writeFile(path.join(outDir, 'graph.json'), JSON.stringify(graph, null, 2)),
    fs.writeFile(path.join(outDir, 'backlinks.json'), JSON.stringify(backlinks, null, 2)),
    fs.writeFile(path.join(outDir, 'slug-map.json'), JSON.stringify(slugMap, null, 2)),
    fs.writeFile(path.join(outDir, 'broken-links.json'), JSON.stringify(broken, null, 2)),
  ])

  return { graph, backlinks, slugMap, broken }
}
