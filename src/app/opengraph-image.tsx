import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'PROCPA — 회계사의 기록'

export default function Image() {
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
        <div style={{ fontSize: 28, color: '#888', letterSpacing: 4 }}>PROCPA</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>회계사의 기록</div>
        <div style={{ fontSize: 24, color: '#888' }}>procpa.co.kr</div>
      </div>
    ),
    { ...size },
  )
}
