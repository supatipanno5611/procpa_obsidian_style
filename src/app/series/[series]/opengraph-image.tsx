import { ImageResponse } from 'next/og'
import { series, chapters } from '#site/content'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'PROCPA 시리즈'

interface Props {
  params: Promise<{ series: string }>
}

export default async function Image({ params }: Props) {
  const { series: slug } = await params
  const s = series.find((x) => x.slugAsParams === slug)
  const count = chapters.filter((c) => c.series === slug && !c.draft).length

  const title = s?.title ?? 'PROCPA'
  const description = s?.description ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#888', letterSpacing: 3 }}>
          <span>PROCPA · SERIES</span>
          <span>{count}개 챕터</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1, color: '#fff' }}>{title}</div>
          <div style={{ fontSize: 28, color: '#aaa', lineHeight: 1.4 }}>{description}</div>
        </div>
        <div style={{ fontSize: 22, color: '#4f7cff' }}>procpa.co.kr</div>
      </div>
    ),
    { ...size },
  )
}
