"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getSeriesLastPosition } from "@/hooks/useSeriesProgress";

interface ContinueReadingBannerProps {
  seriesName: string;
}

/**
 * Shows a "Continue Reading" banner on the series index page
 * when the user has previously read a chapter.
 */
export function ContinueReadingBanner({ seriesName }: ContinueReadingBannerProps) {
  const [position, setPosition] = useState<{
    lastChapterSlug: string;
    lastChapterTitle: string;
    scrollPercent: number;
    updatedAt: string;
  } | null>(null);

  useEffect(() => {
    const saved = getSeriesLastPosition(seriesName);
    if (saved) setPosition(saved);
  }, [seriesName]);

  if (!position) return null;

  const chapterSlugPart = position.lastChapterSlug.split("/").pop();
  const href = `/series/${seriesName}/${chapterSlugPart}`;

  return (
    <Link
      href={href}
      className="group mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 transition-all hover:border-primary/40 hover:bg-primary/10"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <BookOpen className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-primary">이어 읽기</p>
        <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {position.lastChapterTitle}
        </p>
      </div>
      <div className="hidden sm:flex shrink-0 items-center gap-2">
        <div className="h-1.5 w-16 rounded-full bg-primary/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${position.scrollPercent}%` }}
          />
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {position.scrollPercent}%
        </span>
      </div>
      <span className="material-symbols-outlined text-[18px] text-muted-foreground/50 group-hover:text-primary transition-colors">
        arrow_forward
      </span>
    </Link>
  );
}
