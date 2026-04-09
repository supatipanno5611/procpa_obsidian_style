import type { Metadata } from 'next'

export const metadata: Metadata = { title: '면책조항' }

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Disclaimer
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">면책조항</h1>
      <p className="mt-8 text-sm text-muted-foreground">준비 중입니다.</p>
    </div>
  )
}
