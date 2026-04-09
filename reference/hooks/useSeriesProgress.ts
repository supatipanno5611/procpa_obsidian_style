"use client";

import { useEffect, useCallback } from "react";

const STORAGE_KEY = "series-progress";

interface SeriesProgressMap {
  [seriesName: string]: {
    lastChapterSlug: string;
    lastChapterTitle: string;
    scrollPercent: number;
    updatedAt: string;
  };
}

function loadProgress(): SeriesProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: SeriesProgressMap) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // silent fail
  }
}

/** Get stored progress for a specific series */
export function getSeriesLastPosition(seriesName: string) {
  const progress = loadProgress();
  return progress[seriesName] || null;
}

/** Hook: track reading position for a series chapter page */
export function useSeriesProgressTracker(
  seriesName: string,
  chapterSlug: string,
  chapterTitle: string,
  isIndex: boolean,
) {
  const updateProgress = useCallback(() => {
    if (isIndex) return; // Don't track index page

    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    const progress = loadProgress();
    progress[seriesName] = {
      lastChapterSlug: chapterSlug,
      lastChapterTitle: chapterTitle,
      scrollPercent: Math.min(scrollPercent, 100),
      updatedAt: new Date().toISOString(),
    };
    saveProgress(progress);
  }, [seriesName, chapterSlug, chapterTitle, isIndex]);

  useEffect(() => {
    if (isIndex) return;

    // Save initial position
    updateProgress();

    // Save on scroll (debounced)
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateProgress, 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Save before unload
    const handleBeforeUnload = () => updateProgress();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isIndex, updateProgress]);
}
