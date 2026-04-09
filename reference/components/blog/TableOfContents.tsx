"use client";

import { useEffect, useState, useCallback } from "react";
import { List, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TocItem {
  url: string;
  title: string;
  depth: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
  hideHeader?: boolean;
}

export function TableOfContents({ items, className, hideHeader }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const headingIds = items.map((item) => item.url.replace("#", ""));
    const headingElements = headingIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        } else {
          const scrollY = window.scrollY;
          let closestAbove: HTMLElement | null = null;
          for (const el of headingElements) {
            const top = el.getBoundingClientRect().top + scrollY;
            if (top <= scrollY + 100) {
              closestAbove = el;
            }
          }
          if (closestAbove) {
            setActiveId(closestAbove.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headingElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    const id = url.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (items.length === 0) return null;

  return (
    <div className={cn("rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-md shadow-sm", className)}>
      {!hideHeader && (
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border/50">
          <List className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            On this page
          </h3>
        </div>
      )}

      <nav className="flex flex-col gap-1 text-sm max-h-[60vh] overflow-y-auto pr-2">
        {items.map((item) => {
          const id = item.url.replace("#", "");
          const isActive = activeId === id;

          return (
            <a
              key={item.url}
              href={item.url}
              onClick={(e) => handleClick(e, item.url)}
              className={cn(
                "block rounded-md px-2 py-1.5 transition-all duration-200",
                item.depth > 2 && "pl-5 text-xs",
                item.depth === 2 && "font-medium",
                item.depth === 3 && "text-xs",
                isActive
                  ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {item.title}
            </a>
          );
        })}
      </nav>

      <button
        onClick={scrollToTop}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/50 py-2 text-xs font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
      >
        <ArrowUp className="h-3 w-3" />
        맨 위로
      </button>
    </div>
  );
}
