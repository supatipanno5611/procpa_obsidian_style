'use client'

import * as React from 'react'
import { Palette, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const lightPalettes = [
  { id: 'a', label: 'Warm Paper', swatch: 'oklch(0.985 0.006 85)' },
  { id: 'b', label: 'Cool Mist', swatch: 'oklch(0.975 0.003 250)' },
  { id: 'c', label: 'Notion Stone', swatch: 'oklch(0.972 0.004 75)' },
  { id: 'd', label: 'Soft Slate', swatch: 'oklch(0.955 0.005 250)' },
] as const

const darkPalettes = [
  { id: 'd3', label: 'Slate', swatch: 'oklch(0.19 0.012 255)' },
  { id: 'd1', label: 'Pure Black', swatch: 'oklch(0 0 0)' },
  { id: 'd2', label: 'Charcoal', swatch: 'oklch(0.16 0.004 250)' },
  { id: 'd4', label: 'Warm Ink', swatch: 'oklch(0.17 0.005 70)' },
] as const

type LightId = (typeof lightPalettes)[number]['id']
type DarkId = (typeof darkPalettes)[number]['id']

export function PalettePicker() {
  const [open, setOpen] = React.useState(false)
  const [light, setLight] = React.useState<LightId>('b')
  const [dark, setDark] = React.useState<DarkId>('d3')
  const [isDark, setIsDark] = React.useState<boolean | null>(null)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const r = document.documentElement
    setLight((r.getAttribute('data-light') as LightId) || 'b')
    setDark((r.getAttribute('data-dark') as DarkId) || 'd2')
    setIsDark(r.classList.contains('dark'))
    const obs = new MutationObserver(() => setIsDark(r.classList.contains('dark')))
    obs.observe(r, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pickLight = (id: LightId) => {
    document.documentElement.setAttribute('data-light', id)
    try { localStorage.setItem('palette-light', id) } catch {}
    setLight(id)
  }
  const pickDark = (id: DarkId) => {
    document.documentElement.setAttribute('data-dark', id)
    try { localStorage.setItem('palette-dark', id) } catch {}
    setDark(id)
  }

  return (
    <div ref={ref} className="relative">
      <Button variant="ghost" size="icon" aria-label="팔레트" onClick={() => setOpen((o) => !o)}>
        <Palette className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-md border border-border bg-popover p-3 text-popover-foreground shadow-md">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {isDark ? 'Dark' : 'Light'}
          </p>
          <ul className="space-y-1">
            {(isDark ? darkPalettes : lightPalettes).map((p) => {
              const active = isDark ? dark === p.id : light === p.id
              return (
                <li key={p.id}>
                  <button
                    onClick={() =>
                      isDark ? pickDark(p.id as DarkId) : pickLight(p.id as LightId)
                    }
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-accent"
                  >
                    <span
                      className="h-4 w-4 rounded-sm border border-border"
                      style={{ background: p.swatch }}
                    />
                    <span className="flex-1">{p.label}</span>
                    {active && <Check className="h-3.5 w-3.5" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
