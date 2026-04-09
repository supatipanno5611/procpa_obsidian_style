"use client";

import { cn } from "@/lib/utils";
import type { useExploreFilter } from "@/hooks/useExploreFilter";
import type { SortField } from "@/hooks/useExploreFilter";

const SORT_OPTIONS: { key: SortField; label: string }[] = [
  { key: "date", label: "최신순" },
  { key: "title", label: "제목순" },
  { key: "topic", label: "주제순" },
];

interface ExploreResultInfoProps {
  filter: ReturnType<typeof useExploreFilter>;
}

export function ExploreResultInfo({ filter }: ExploreResultInfoProps) {
  const { filteredCount, totalCount, filterState, setSortField, setSortDirection } = filter;

  return (
    <div className="mt-4 flex items-center justify-between border-b border-border/40 pb-3">
      <p className="text-xs text-muted-foreground tabular-nums">
        <span className="font-semibold text-foreground">{filteredCount}</span>
        {" / "}
        {totalCount}건
      </p>

      <div className="flex items-center gap-1">
        {SORT_OPTIONS.map((opt) => {
          const isActive = filterState.sortField === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => {
                if (isActive) {
                  setSortDirection(filterState.sortDirection === "asc" ? "desc" : "asc");
                } else {
                  setSortField(opt.key);
                }
              }}
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
              {isActive && (
                <span className="material-symbols-outlined text-[14px]">
                  {filterState.sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
