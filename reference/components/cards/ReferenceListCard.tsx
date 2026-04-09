import Link from "next/link";
import { cn } from "@/lib/utils";
import { getTopicLabel } from "@/lib/taxonomy";
import { getTopicBadgeClasses } from "@/lib/domains";
import { highlightText } from "@/lib/search-utils";

interface ReferenceItem {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  topic: string;
  date: string;
  source?: {
    name?: string;
    url?: string;
    author?: string;
  };
}

interface ReferenceListCardProps {
  reference: ReferenceItem;
  searchQuery?: string;
  className?: string;
}

export function ReferenceListCard({
  reference,
  searchQuery,
  className,
}: ReferenceListCardProps) {
  const topicLabel = getTopicLabel(reference.topic);
  const q = searchQuery || "";

  return (
    <Link
      href={`/${reference.slug}`}
      className={cn(
        "group relative flex overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-brand-reference/40 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex flex-1 flex-col p-5">
        {/* Topic badge + date */}
        <div className="flex items-center justify-between mb-3">
          <span className={cn("inline-flex items-center rounded text-[10px] px-2 py-0.5 font-bold uppercase tracking-wide", getTopicBadgeClasses(reference.topic))}>
            {topicLabel}
          </span>
          <time className="text-[11px] text-muted-foreground tabular-nums">
            {new Date(reference.date).toLocaleDateString("ko-KR")}
          </time>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-foreground group-hover:text-brand-reference transition-colors line-clamp-2 mb-2">
          {highlightText(reference.title, q)}
        </h3>

        {/* Description */}
        {(reference.description || reference.excerpt) && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {highlightText(reference.description || reference.excerpt || "", q)}
          </p>
        )}

        {/* Footer: source info */}
        <div className="mt-auto pt-4 flex items-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 truncate max-w-[200px]">
            <span className="material-symbols-outlined text-[14px]">
              link
            </span>
            {reference.source?.name || "외부 자료"}
          </span>
        </div>
      </div>

      {/* Decorative icon */}
      <span
        className="material-symbols-outlined absolute bottom-3 right-3 text-[48px] text-brand-reference/[0.07] select-none pointer-events-none"
        style={{ fontVariationSettings: "'opsz' 48" }}
      >
        find_in_page
      </span>
    </Link>
  );
}
