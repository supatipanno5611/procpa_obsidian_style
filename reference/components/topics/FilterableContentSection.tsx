"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ContentListItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  contentCategory?: string;
  authorType?: string;
  isSeries?: boolean;
}

interface FilterableContentSectionProps {
  items: ContentListItem[];
  maxItems?: number;
  seeAllHref?: string;
  accentColor: string;
  sectionTitle?: string;
  sectionIcon?: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function FilterableContentSection({
  items,
  maxItems = 4,
  seeAllHref,
  accentColor,
  sectionTitle = "최근 콘텐츠",
  sectionIcon = "schedule",
}: FilterableContentSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = useMemo(() => {
    const tagMap = new Map<string, number>();
    for (const item of items) {
      for (const tag of item.tags) {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
    }
    return Array.from(tagMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  }, [items]);

  const hasActiveFilter = searchQuery.trim().length > 0 || selectedTags.length > 0;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedTags.length > 0) {
        if (!item.tags.some((t) => selectedTags.includes(t))) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }
      return true;
    });
  }, [items, searchQuery, selectedTags]);

  const displayItems = hasActiveFilter ? filteredItems : items.slice(0, maxItems);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const clearAll = useCallback(() => {
    setSearchQuery("");
    setSelectedTags([]);
  }, []);

  const showSearch = items.length > 4;
  const showTagFilter = availableTags.length >= 2 && items.length > 3;

  return (
    <section>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px] text-muted-foreground">
          {sectionIcon}
        </span>
        {sectionTitle}
      </h2>

      {/* Search + Tag Filter */}
      {(showSearch || showTagFilter) && (
        <div className="mb-4 space-y-3">
          {/* Search bar */}
          {showSearch && (
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-muted-foreground">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="문서 검색..."
                  className="w-full h-9 pl-9 pr-8 rounded-lg border border-border/60 bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-muted-foreground hover:text-foreground">
                      close
                    </span>
                  </button>
                )}
              </div>
              {hasActiveFilter && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {filteredItems.length}건 / {items.length}건
                </span>
              )}
              {hasActiveFilter && (
                <button
                  onClick={clearAll}
                  className="text-xs text-primary hover:underline whitespace-nowrap"
                >
                  초기화
                </button>
              )}
            </div>
          )}

          {/* Tag chips */}
          {showTagFilter && (
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map(([tag, count]) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
                    selectedTags.includes(tag)
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  #{tag}
                  <span className="opacity-50 text-[10px]">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content list */}
      {displayItems.length > 0 ? (
        <div className="rounded-xl border border-border/60 bg-card divide-y divide-border/40">
          {displayItems.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group"
            >
              <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap shrink-0">
                {formatDate(item.date)}
              </span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate min-w-0 flex-1">
                {item.title}
              </span>
              {item.isSeries && (
                <span className="hidden sm:inline-flex shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium bg-amber-500/10 text-amber-600 border-amber-500/20">
                  시리즈
                </span>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border border-border/60 rounded-xl bg-muted/10">
          <span className="material-symbols-outlined text-3xl opacity-30">
            search_off
          </span>
          <p className="mt-2 text-sm">검색 결과가 없습니다.</p>
          <button
            onClick={clearAll}
            className="mt-2 text-xs text-primary hover:underline"
          >
            필터 초기화
          </button>
        </div>
      )}

      {/* See all link (only when filter is not active) */}
      {!hasActiveFilter && seeAllHref && items.length > maxItems && (
        <div className="mt-3 text-right">
          <Link
            href={seeAllHref}
            className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            전체 보기
            <span className="material-symbols-outlined text-[14px]">
              arrow_forward
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
