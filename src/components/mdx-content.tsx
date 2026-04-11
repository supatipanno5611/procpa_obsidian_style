import * as runtime from 'react/jsx-runtime'
import { MdxAnchor } from './wiki-link'
import { Callout } from './mdx/callout'
import { FileDownload } from './mdx/file-download'

const sharedComponents: Record<string, React.ComponentType<any>> = {
  a: MdxAnchor,
  Callout,
  FileDownload,
}

function useMDXComponent(code: string) {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

interface MDXProps {
  code: string
  components?: Record<string, React.ComponentType>
}

export function MDXContent({ code, components }: MDXProps) {
  if (!code) return <p className="text-sm text-muted-foreground">아직 내용이 작성되지 않았습니다.</p>
  const Component = useMDXComponent(code)
  return <Component components={{ ...sharedComponents, ...components }} />
}
