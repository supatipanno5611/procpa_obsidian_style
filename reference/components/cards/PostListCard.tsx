import Link from "next/link";
import { cn } from "@/lib/utils";
import { getTopicLabel } from "@/lib/taxonomy";
import { getTopicBadgeClasses } from "@/lib/domains";
import { highlightText } from "@/lib/search-utils";

interface PostItem {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  topic: string;
  date: string;
  readingTime?: number;
}

interface PostListCardProps {
  post: PostItem;
  searchQuery?: string;
  className?: string;
}

export function PostListCard({ post, searchQuery, className }: PostListCardProps) {
  const topicLabel = getTopicLabel(post.topic);
  const q = searchQuery || "";

  return (
    <Link
      href={`/${post.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-brand-post/40 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex flex-1 flex-col p-5">
        {/* Topic badge + date */}
        <div className="flex items-center justify-between mb-3">
          <span className={cn("inline-flex items-center rounded text-[10px] px-2 py-0.5 font-bold uppercase tracking-wide", getTopicBadgeClasses(post.topic))}>
            {topicLabel}
          </span>
          <time className="text-[11px] text-muted-foreground tabular-nums">
            {new Date(post.date).toLocaleDateString("ko-KR")}
          </time>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-foreground group-hover:text-brand-post transition-colors line-clamp-2 mb-2">
          {highlightText(post.title, q)}
        </h3>

        {/* Description */}
        {(post.description || post.excerpt) && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {highlightText(post.description || post.excerpt || "", q)}
          </p>
        )}

        {/* Footer: reading time */}
        <div className="mt-auto pt-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span className="material-symbols-outlined text-[14px]">
            schedule
          </span>
          <span>{post.readingTime ?? 1}분 읽기</span>
        </div>
      </div>

      {/* Decorative icon */}
      <span
        className="material-symbols-outlined absolute bottom-3 right-3 text-[48px] text-brand-post/[0.07] select-none pointer-events-none"
        style={{ fontVariationSettings: "'opsz' 48" }}
      >
        article
      </span>
    </Link>
  );
}
