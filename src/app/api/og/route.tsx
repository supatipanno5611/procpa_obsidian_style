import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') ?? 'PROCPA').slice(0, 120)
  const subtitle = (searchParams.get('subtitle') ?? '').slice(0, 200)
  const kicker = (searchParams.get('kicker') ?? 'PROCPA').slice(0, 40)
  const meta = (searchParams.get('meta') ?? '').slice(0, 40)

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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 22,
            color: '#888',
            letterSpacing: 3,
          }}
        >
          <span>{kicker}</span>
          {meta && <span>{meta}</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.15, color: '#fff' }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 26, color: '#aaa', lineHeight: 1.4 }}>{subtitle}</div>
          )}
        </div>
        <div style={{ fontSize: 22, color: '#4f7cff' }}>procpa.co.kr</div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
