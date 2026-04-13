import { useMemo } from 'react'
import * as runtime from 'react/jsx-runtime'
import { MdxAnchor } from './wiki-link'
import { Callout } from './mdx/callout'
import { FileDownload } from './mdx/file-download'

const sharedComponents: Record<string, React.ComponentType<any>> = {
  a: MdxAnchor,
  Callout,
  FileDownload,
}

/** Module-level cache so identical code strings across renders reuse the same component. */
const mdxCache = new Map<string, React.ComponentType<any>>()

function compileMDX(code: string): React.ComponentType<any> {
  const cached = mdxCache.get(code)
  if (cached) return cached
  const fn = new Function(code)
  const component = fn({ ...runtime }).default as React.ComponentType<any>
  mdxCache.set(code, component)
  return component
}

interface MDXProps {
  code: string
  components?: Record<string, React.ComponentType>
}

export function MDXContent({ code, components }: MDXProps) {
  if (!code) return <p className="text-sm text-muted-foreground">아직 내용이 작성되지 않았습니다.</p>
  const Component = useMemo(() => compileMDX(code), [code])
  return <Component components={{ ...sharedComponents, ...components }} />
}
