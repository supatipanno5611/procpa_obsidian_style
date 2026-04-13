import { topicLabel, topicOrder } from '@/lib/topics'

/**
 * 3-level vault tree builder.
 *
 * Layout: content/<topic>/<subcategory>/<file>.md           → Post
 *         content/<topic>/<subcategory>/<series>/index.md   → Series
 *         content/<topic>/<subcategory>/<series>/<ch>.md    → Chapter (not in tree)
 *
 * Tree shape:  category(folder) > subcategory(folder) > [post(file) | series(file)]
 * Series are rendered as leaf nodes (no expand) — chapters only appear on the series page.
 */

export type TreeNode =
  | {
      kind: 'folder'
      nodeType: 'category' | 'subcategory'
      key: string
      name: string
      label: string
      href?: string
      count: number
      children: TreeNode[]
    }
  | {
      kind: 'file'
      nodeType: 'post' | 'series'
      key: string
      name: string
      label: string
      href: string
    }

interface PostLike {
  slug: string
  slugAsParams: string
  title: string
  draft: boolean
  category?: string
  subcategory?: string | null
}
interface SeriesLike {
  slug: string
  slugAsParams: string
  title: string
  draft: boolean
  category?: string
  subcategory?: string | null
}

type CategoryEntry = {
  node: Extract<TreeNode, { kind: 'folder' }>
  subcategories: Map<string, Extract<TreeNode, { kind: 'folder' }>>
}

interface ChapterLike {
  series: string
  draft: boolean
}

export function buildVaultTree(
  posts: PostLike[],
  seriesList: SeriesLike[],
  chapterList: ChapterLike[] = [],
): TreeNode[] {
  // Pre-compute chapter counts per series slugAsParams
  const chapterCounts = new Map<string, number>()
  for (const ch of chapterList) {
    if (ch.draft) continue
    chapterCounts.set(ch.series, (chapterCounts.get(ch.series) ?? 0) + 1)
  }

  const categories = new Map<string, CategoryEntry>()

  function ensureCategory(topic: string): CategoryEntry {
    let entry = categories.get(topic)
    if (!entry) {
      const node: Extract<TreeNode, { kind: 'folder' }> = {
        kind: 'folder',
        nodeType: 'category',
        key: topic,
        name: topic,
        label: topicLabel(topic),
        href: `/${topic}`,
        count: 0,
        children: [],
      }
      entry = { node, subcategories: new Map() }
      categories.set(topic, entry)
    }
    return entry
  }

  function ensureSubcategory(
    catEntry: CategoryEntry,
    topic: string,
    subName: string,
  ): Extract<TreeNode, { kind: 'folder' }> {
    let sub = catEntry.subcategories.get(subName)
    if (!sub) {
      sub = {
        kind: 'folder',
        nodeType: 'subcategory',
        key: `${topic}/${subName}`,
        name: subName,
        label: subName,
        href: `/${topic}/${subName}`,
        count: 0,
        children: [],
      }
      catEntry.subcategories.set(subName, sub)
      catEntry.node.children.push(sub)
    }
    return sub
  }

  // Posts → count only (no file nodes in tree, navigate via category/subcategory pages)
  for (const p of posts) {
    if (p.draft) continue
    const topic = p.category ?? p.slug.split('/')[0]
    const catEntry = ensureCategory(topic)
    if (p.subcategory) {
      const sub = ensureSubcategory(catEntry, topic, p.subcategory)
      sub.count += 1
    }
    catEntry.node.count += 1
  }

  // Series → count by chapter count (or 1 if no chapters)
  for (const s of seriesList) {
    if (s.draft) continue
    const topic = s.category ?? s.slug.split('/')[0]
    const subName = s.subcategory ?? s.slug.split('/')[1] ?? '일반'
    const catEntry = ensureCategory(topic)
    const sub = ensureSubcategory(catEntry, topic, subName)
    const cc = chapterCounts.get(s.slugAsParams) ?? 1
    sub.count += cc
    catEntry.node.count += cc
  }

  // Sort: folders first, then series before posts, natural alpha within each group
  const naturalCompare = (a: string, b: string) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })

  function sortChildren(children: TreeNode[]) {
    children.sort((a, b) => {
      // folders before files
      if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1
      // within files: series before posts
      if (a.kind === 'file' && b.kind === 'file' && a.nodeType !== b.nodeType) {
        return a.nodeType === 'series' ? -1 : 1
      }
      return naturalCompare(a.name, b.name)
    })
    for (const child of children) {
      if (child.kind === 'folder') sortChildren(child.children)
    }
  }

  const roots = [...categories.values()].map((e) => e.node)
  for (const r of roots) sortChildren(r.children)
  roots.sort((a, b) => {
    const oa = topicOrder(a.name)
    const ob = topicOrder(b.name)
    if (oa !== ob) return oa - ob
    return naturalCompare(a.name, b.name)
  })

  return roots
}
