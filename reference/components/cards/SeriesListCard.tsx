import Link from "next/link";
import { cn } from "@/lib/utils";
import { getTopicLabel } from "@/lib/taxonomy";
import { getTopicBadgeClasses } from "@/lib/domains";
import { highlightText } from "@/lib/search-utils";

interface SeriesWithCount {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  topic: string;
  date: string;
  chapterCount?: number;
}

interface SeriesListCardProps {
  series: SeriesWithCount;
  searchQuery?: string;
  className?: string;
}

export function SeriesListCard({ series, searchQuery, className }: SeriesListCardProps) {
  const topicLabel = getTopicLabel(series.topic);
  const q = searchQuery || "";

  return (
    <Link
      href={`/${series.slug}`}
      className={cn(
        "group relative flex overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-brand-series/40 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex flex-1 flex-col p-5">
        {/* Topic badge + date */}
        <div className="flex items-center justify-between mb-3">
          <span className={cn("inline-flex items-center rounded text-[10px] px-2 py-0.5 font-bold uppercase tracking-wide", getTopicBadgeClasses(series.topic))}>
            {topicLabel}
          </span>
          <time className="text-[11px] text-muted-foreground tabular-nums">
            {new Date(series.date).toLocaleDateString("ko-KR")}
          </time>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-foreground group-hover:text-brand-series transition-colors line-clamp-2 mb-2">
          {highlightText(series.title, q)}
        </h3>

        {/* Description */}
        {(series.description || series.excerpt) && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {highlightText(series.description || series.excerpt || "", q)}
          </p>
        )}

        {/* Footer: chapter count */}
        <div className="mt-auto pt-4 flex items-center text-xs">
          {series.chapterCount != null && (
            <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
              <span className="material-symbols-outlined text-[14px]">
                auto_stories
              </span>
              <span>{series.chapterCount} Chapters</span>
            </div>
          )}
        </div>
      </div>

      {/* Decorative icon */}
      <span
        className="material-symbols-outlined absolute bottom-3 right-3 text-[48px] text-brand-series/[0.07] select-none pointer-events-none"
        style={{ fontVariationSettings: "'opsz' 48" }}
      >
        library_books
      </span>
    </Link>
  );
}
