/**
 * remark-wiki-link-procpa
 *
 * Obsidian 스타일 wiki-link 문법을 mdast `link` 노드로 치환한다.
 *
 *   [[target]]              → <a href="wiki:target">target</a>
 *   [[target|별칭]]          → <a href="wiki:target">별칭</a>
 *   [[target#heading]]      → <a href="wiki:target#heading">target#heading</a>
 *   [[target#heading|별칭]] → <a href="wiki:target#heading">별칭</a>
 *
 * URL에 `wiki:` 프리픽스를 붙여두면 런타임 MDX 컴포넌트 매핑(`components.a`)에서
 * 일반 링크와 구분해 <WikiLink/>로 위임할 수 있다.
 *
 * target/heading의 실제 슬러그 resolve와 broken 처리는 런타임(WikiLink)이 담당.
 * 이 플러그인은 순수 치환만 수행하며 외부 의존성이 없다.
 */

type MdRoot = { type: 'root'; children: MdNode[] }
type MdText = { type: 'text'; value: string }
type MdLink = {
  type: 'link'
  url: string
  title: string | null
  children: MdNode[]
  data?: { hProperties?: Record<string, string> }
}
type MdNode =
  | MdText
  | MdLink
  | { type: string; children?: MdNode[]; value?: string; [k: string]: unknown }

const WIKI_RE = /\[\[([^\][\n|#]+)(?:#([^\][\n|]+))?(?:\|([^\][\n]+))?\]\]/g

function splitTextNode(node: MdText): MdNode[] | null {
  const value = node.value
  if (!value.includes('[[')) return null

  const out: MdNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  WIKI_RE.lastIndex = 0
  while ((match = WIKI_RE.exec(value)) !== null) {
    const [raw, rawTarget, rawHeading, rawAlias] = match
    const target = rawTarget.trim()
    const heading = rawHeading?.trim()
    const alias = rawAlias?.trim()

    if (match.index > lastIndex) {
      out.push({ type: 'text', value: value.slice(lastIndex, match.index) })
    }

    const url = heading ? `wiki:${target}#${heading}` : `wiki:${target}`
    const label = alias ?? (heading ? `${target}#${heading}` : target)

    out.push({
      type: 'link',
      url,
      title: null,
      children: [{ type: 'text', value: label }],
      data: {
        hProperties: {
          'data-wiki-link': 'true',
          'data-wiki-target': target,
          ...(heading ? { 'data-wiki-heading': heading } : {}),
          ...(alias ? { 'data-wiki-alias': alias } : {}),
        },
      },
    })

    lastIndex = match.index + raw.length
  }

  if (lastIndex === 0) return null
  if (lastIndex < value.length) {
    out.push({ type: 'text', value: value.slice(lastIndex) })
  }
  return out
}

function walk(node: MdNode): void {
  const children = (node as { children?: MdNode[] }).children
  if (!Array.isArray(children)) return

  const next: MdNode[] = []
  for (const child of children) {
    // code / inlineCode / math 등은 건드리지 않는다
    if (
      child.type === 'code' ||
      child.type === 'inlineCode' ||
      child.type === 'math' ||
      child.type === 'inlineMath' ||
      child.type === 'html'
    ) {
      next.push(child)
      continue
    }

    if (child.type === 'text') {
      const replaced = splitTextNode(child as MdText)
      if (replaced) {
        next.push(...replaced)
        continue
      }
    }

    walk(child)
    next.push(child)
  }
  ;(node as { children?: MdNode[] }).children = next
}

export default function remarkWikiLink() {
  return (tree: MdRoot) => {
    walk(tree)
  }
}
