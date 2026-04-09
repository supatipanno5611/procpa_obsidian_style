"use client";

import { Search } from "lucide-react";

interface SearchButtonProps {
  onClick: () => void;
  variant?: "icon" | "full";
}

export function SearchButton({ onClick, variant = "icon" }: SearchButtonProps) {
  if (variant === "full") {
    return (
      <button
        onClick={onClick}
        className="relative flex h-12 w-fit mx-auto items-center justify-center gap-3 rounded-xl border border-border/50 bg-muted/30 px-6 text-sm text-muted-foreground shadow-sm hover:bg-accent hover:text-foreground transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="검색"
      >
        <Search className="h-5 w-5 shrink-0" />
        <span className="inline-flex items-center gap-1.5 overflow-hidden">
          <div className="hidden h-6 select-none items-center gap-1 sm:flex font-mono text-[10px] sm:text-xs">
            <kbd className="flex h-5 items-center justify-center rounded-[4px] border border-border/60 bg-background/50 px-1.5 shadow-[0_1px_1px_rgba(0,0,0,0.05)] text-muted-foreground/80 font-semibold uppercase tracking-wider">
              Ctrl
            </kbd>
            <span className="text-muted-foreground/40 font-normal">+</span>
            <kbd className="flex h-5 items-center justify-center rounded-[4px] border border-border/60 bg-background/50 px-1.5 shadow-[0_1px_1px_rgba(0,0,0,0.05)] text-muted-foreground/80 font-semibold uppercase">
              K
            </kbd>
          </div>
          <span className="hidden sm:inline-flex whitespace-nowrap ml-0.5">를 눌러서 무엇이든 검색해보세요</span>
          <span className="inline-flex sm:hidden">무엇이든 검색해보세요</span>
        </span>
      </button>
    );
  }

  // 기본 "icon" 형태
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border/50 hover:bg-accent transition-colors"
      aria-label="검색"
    >
      <Search className="h-4 w-4" />
    </button>
  );
}
