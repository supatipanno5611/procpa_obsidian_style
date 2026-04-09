import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { CommandPalette } from '@/components/command-palette'

const nav = [
  { href: '/', label: '홈' },
  { href: '/about', label: '소개' },
  { href: '/series', label: '시리즈' },
  { href: '/posts', label: '포스트' },
  { href: '/tags', label: '태그' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          PROCPA
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-0.5">
            <CommandPalette />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
