import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') ?? 'PROCPA').slice(0, 120)
  const subtitle = (searchParams.get('subtitle') ?? '').slice(0, 200)
  const kicker = (searchParams.get('kicker') ?? 'PROCPA').slice(0, 40)
  const meta = (searchParams.get('meta') ?? '').slice(0, 40)
  const variant = searchParams.get('variant') ?? 'a'

  if (variant === 'b') return variantB({ title, subtitle, kicker, meta })
  if (variant === 'c') return variantC({ title, subtitle, kicker, meta })
  return variantA({ title, subtitle, kicker, meta })
}

type OgProps = { title: string; subtitle: string; kicker: string; meta: string }

/* ── Variant A: Accent Line ── */
function variantA({ title, subtitle, kicker, meta }: OgProps) {
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
          position: 'relative',
        }}
      >
        {/* Top accent line */}
        <div style={{ height: 4, background: '#7ba3ff', width: '100%' }} />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 80px 50px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 18,
              color: '#888',
              letterSpacing: 4,
              fontFamily: 'monospace',
              textTransform: 'uppercase' as const,
            }}
          >
            <span>{kicker}</span>
            {meta && <span>{meta}</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15, color: '#fff' }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ fontSize: 24, color: '#aaa', lineHeight: 1.4 }}>{subtitle}</div>
            )}
          </div>
          <div style={{ fontSize: 20, color: '#7ba3ff', letterSpacing: 1 }}>procpa.co.kr</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}

/* ── Variant B: Left Stripe ── */
function variantB({ title, subtitle, kicker, meta }: OgProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000',
          color: '#fff',
          display: 'flex',
          position: 'relative',
        }}
      >
        {/* Left stripe */}
        <div style={{ width: 6, background: '#7ba3ff', height: '100%', flexShrink: 0 }} />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 80px 50px 74px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 18,
              color: '#888',
              letterSpacing: 4,
              fontFamily: 'monospace',
              textTransform: 'uppercase' as const,
            }}
          >
            <span>{kicker}</span>
            {meta && <span>{meta}</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15, color: '#fff' }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ fontSize: 24, color: '#aaa', lineHeight: 1.4 }}>{subtitle}</div>
            )}
          </div>
          <div style={{ fontSize: 20, color: '#7ba3ff', letterSpacing: 1 }}>procpa.co.kr</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}

/* ── Variant C: Border Frame ── */
function variantC({ title, subtitle, kicker, meta }: OgProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000',
          color: '#fff',
          display: 'flex',
          padding: 24,
        }}
      >
        <div
          style={{
            flex: 1,
            border: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '50px 64px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 18,
              color: '#888',
              letterSpacing: 4,
              fontFamily: 'monospace',
              textTransform: 'uppercase' as const,
            }}
          >
            <span>{kicker}</span>
            {meta && <span>{meta}</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.15, color: '#fff' }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ fontSize: 22, color: '#aaa', lineHeight: 1.4 }}>{subtitle}</div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 20, color: '#7ba3ff', letterSpacing: 1 }}>
            procpa.co.kr
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
