'use client'

import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export function VaultDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center gap-2 rounded-md border border-border/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground lg:hidden">
        <Menu className="h-3.5 w-3.5" />
        Vault
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] overflow-y-auto p-6">
        <SheetTitle className="sr-only">Vault</SheetTitle>
        {children}
      </SheetContent>
    </Sheet>
  )
}
