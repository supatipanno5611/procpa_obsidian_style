'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const root = document.documentElement
    const next = !root.classList.contains('dark')
    root.classList.toggle('dark', next)
    root.style.colorScheme = next ? 'dark' : 'light'
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
    setIsDark(next)
  }

  return (
    <Button variant="ghost" size="icon" aria-label="테마 전환" onClick={toggle}>
      {isDark === null ? null : isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
