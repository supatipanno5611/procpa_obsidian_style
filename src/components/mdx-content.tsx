import * as runtime from 'react/jsx-runtime'
import { MdxAnchor } from './wiki-link'

const sharedComponents: Record<string, React.ComponentType<any>> = {
  a: MdxAnchor,
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
  const Component = useMDXComponent(code)
  return <Component components={{ ...sharedComponents, ...components }} />
}
