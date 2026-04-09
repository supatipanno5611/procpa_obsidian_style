import { contents, type Content } from "../../.velite";

// Re-export Content as Series for backward compatibility
export type Series = Content;

// Get the Series Overview (Index) by series name/slug
export function getSeriesIndex(seriesName: string): Content | undefined {
  return contents.find((c) => c.seriesName === seriesName && c.index && !c.draft);
}

// Get all chapters for a specific series, sorted by order
export function getSeriesChapters(seriesName: string): Content[] {
  return contents
    .filter((c) => c.seriesName === seriesName && !c.index && !c.draft)
    .sort((a, b) => a.order - b.order);
}

// Get next/prev chapter
export function getSeriesNavigation(seriesName: string, currentOrder: number) {
  const chapters = getSeriesChapters(seriesName);
  const currentIndex = chapters.findIndex((c) => c.order === currentOrder);

  return {
    prev: currentIndex > 0 ? chapters[currentIndex - 1] : null,
    next: currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null,
  };
}

// Get full TOC including Index and Chapters
export function getSeriesTOC(seriesName: string): Content[] {
  const index = getSeriesIndex(seriesName);
  const chapters = getSeriesChapters(seriesName);
  return index ? [index, ...chapters] : chapters;
}

// ─── Series List Helpers ───

export function getAllSeries(): Content[] {
  return contents
    .filter((c) => c.index && c.isSeries && !c.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getSeriesByName(name: string): Content | undefined {
  return contents.find((c) => c.seriesName === name && c.index && !c.draft);
}

// ─── Series Progress ───

export function getSeriesProgress(
  seriesName: string,
  currentOrder: number
): { current: number; total: number; percentage: number } {
  const chapters = getSeriesChapters(seriesName);
  const total = chapters.length;
  return {
    current: currentOrder,
    total,
    percentage: total > 0 ? Math.round((currentOrder / total) * 100) : 0,
  };
}

export function getSeriesWithChapterCount(): { series: Content; chapterCount: number }[] {
  return getAllSeries().map((s) => ({
    series: s,
    chapterCount: getSeriesChapters(s.seriesName!).length,
  }));
}
