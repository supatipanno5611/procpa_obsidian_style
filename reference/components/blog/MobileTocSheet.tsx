"use client";

import { useState, useEffect, useCallback } from "react";
import { List, X } from "lucide-react";
import { TableOfContents } from "./TableOfContents";

interface TocItem {
  url: string;
  title: string;
  depth: number;
}

interface MobileTocSheetProps {
  items: TocItem[];
}

export function MobileTocSheet({ items }: MobileTocSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors lg:hidden"
        aria-label="목차 열기"
      >
        <List className="h-5 w-5" />
      </button>

      {/* Sheet overlay + panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Sheet */}
          <div
            className="absolute inset-x-0 bottom-0 max-h-[70vh] overflow-hidden rounded-t-2xl border-t border-border/50 bg-card shadow-2xl"
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  On this page
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent/50 transition-colors"
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* TOC content */}
            <div className="overflow-y-auto p-4" onClick={handleLinkClick}>
              <TableOfContents items={items} hideHeader className="border-0 bg-transparent p-0 shadow-none backdrop-blur-none" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
