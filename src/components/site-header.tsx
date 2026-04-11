'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { PalettePicker } from '@/components/palette-picker'
import { CommandPalette } from '@/components/command-palette'

const nav = [
  { href: '/', label: '홈' },
  { href: '/about', label: '소개' },
  { href: '/explore', label: '탐색' },
  { href: '/graph', label: '그래프' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" aria-label="PROCPA" className="flex shrink-0 items-center">
          <Image
            src="/procpa_light2.png"
            alt="PROCPA"
            width={1134}
            height={317}
            priority
            className="block h-6 w-auto object-contain dark:hidden sm:h-7"
          />
          <Image
            src="/procpa_dark2.png"
            alt="PROCPA"
            width={1134}
            height={317}
            priority
            className="hidden h-6 w-auto object-contain dark:block sm:h-7"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-0.5">
            <CommandPalette />
            <PalettePicker />
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile tools + hamburger */}
        <div className="flex items-center gap-0.5 md:hidden">
          <CommandPalette />
          <PalettePicker />
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="메뉴 열기"
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="border-t border-border/60 md:hidden">
          <div className="mx-auto max-w-5xl space-y-1 px-6 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
