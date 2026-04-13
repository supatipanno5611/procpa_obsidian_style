'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    function handleScroll() {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const el = document.documentElement
        const scrollHeight = el.scrollHeight - el.clientHeight
        if (scrollHeight > 0) {
          setProgress(Math.min(100, (el.scrollTop / scrollHeight) * 100))
        }
        raf = 0
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[2px]">
      <div
        className="h-full bg-primary transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
