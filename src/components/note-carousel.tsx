'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function NoteCarousel({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 280
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 py-2 scrollbar-none"
      >
        {children}
      </div>
      <button
        onClick={() => scroll('left')}
        aria-label="이전"
        className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border/60 bg-background p-1.5 text-muted-foreground shadow-sm transition-colors hover:text-foreground lg:block"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => scroll('right')}
        aria-label="다음"
        className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border/60 bg-background p-1.5 text-muted-foreground shadow-sm transition-colors hover:text-foreground lg:block"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
