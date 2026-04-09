"use client";

import { useSeriesProgressTracker } from "@/hooks/useSeriesProgress";

interface SeriesProgressTrackerProps {
  seriesName: string;
  chapterSlug: string;
  chapterTitle: string;
  isIndex: boolean;
}

/**
 * Invisible client component that tracks reading progress for series chapters.
 * Mount this in the series page to automatically save scroll position.
 */
export function SeriesProgressTracker({
  seriesName,
  chapterSlug,
  chapterTitle,
  isIndex,
}: SeriesProgressTrackerProps) {
  useSeriesProgressTracker(seriesName, chapterSlug, chapterTitle, isIndex);
  return null;
}
