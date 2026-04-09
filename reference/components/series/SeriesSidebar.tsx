"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { SeriesProgress } from "./SeriesProgress";
import type { Series } from "@/lib/content";

interface SeriesSidebarProps {
  chapters: Series[];
  currentIndex: number | null; // null if on index page
  seriesName: string;
  seriesTitle: string;
  progress?: { current: number; total: number; percentage: number };
}

export function SeriesSidebar({
  chapters,
  currentIndex,
  seriesName,
  seriesTitle,
  progress,
}: SeriesSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside className="h-full w-full lg:w-72 flex-shrink-0">
      <div className="sticky top-24 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md shadow-sm overflow-hidden">
        {/* Series Header */}
        <div className="p-5 border-b border-border/50">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
            Series
          </p>
          <Link
            href={`/series/${seriesName}`}
            className="text-foreground text-base font-bold leading-tight hover:text-primary transition-colors line-clamp-2"
          >
            {seriesTitle}
          </Link>

          {/* Progress Bar */}
          {progress && progress.total > 0 && (
            <SeriesProgress
              current={progress.current}
              total={progress.total}
              percentage={progress.percentage}
              className="mt-3"
            />
          )}
        </div>

        {/* Chapter Navigation */}
        <div className="p-3 max-h-[60vh] overflow-y-auto">
          {/* Collapsible Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-90"
              )}
            />
            Chapters ({chapters.length})
          </button>

          {isExpanded && (
            <nav className="mt-1 space-y-0.5 border-l border-border/50 ml-4">
              {/* Series Index Link */}
              <Link href={`/series/${seriesName}`}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-r-lg px-3 py-2 text-sm transition-colors",
                    currentIndex === null
                      ? "text-primary bg-primary/10 font-medium border-l-2 border-primary -ml-[1px]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  <span className="text-xs font-mono opacity-50">00</span>
                  <span className="line-clamp-1">소개</span>
                </div>
              </Link>

              {chapters.map((chapter) => (
                <Link key={chapter.slug} href={`/${chapter.slug}`}>
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-r-lg px-3 py-2 text-sm transition-colors",
                      currentIndex === chapter.order
                        ? "text-primary bg-primary/10 font-medium border-l-2 border-primary -ml-[1px]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                  >
                    <span className="text-xs font-mono opacity-50">
                      {String(chapter.order).padStart(2, "0")}
                    </span>
                    <span className="line-clamp-1">{chapter.title}</span>
                  </div>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </aside>
  );
}
