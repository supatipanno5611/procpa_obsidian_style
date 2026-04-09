"use client";

import { cn } from "@/lib/utils";
import type { useExploreFilter } from "@/hooks/useExploreFilter";
import type { GroupByField } from "@/hooks/useExplorePrefs";

type ViewMode = "table" | "card";

const GROUP_OPTIONS: { key: GroupByField; label: string; icon: string }[] = [
  { key: "none", label: "없음", icon: "clear_all" },
  { key: "domain", label: "도메인", icon: "category" },
  { key: "topic", label: "주제", icon: "topic" },
  { key: "contentType", label: "유형", icon: "view_list" },
];

interface ExploreToolbarProps {
  filter: ReturnType<typeof useExploreFilter>;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  groupBy: GroupByField;
  onGroupByChange: (field: GroupByField) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export function ExploreToolbar({ filter, viewMode, onViewModeChange, groupBy, onGroupByChange, searchInputRef }: ExploreToolbarProps) {
  const { filterState, setSearchQuery } = filter;

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Left side: View mode + Grouping */}
      <div className="flex items-center gap-2">
        {/* View mode toggle */}
        <div className="flex items-center rounded-lg border border-border/60 p-0.5">
          <button
            onClick={() => onViewModeChange("table")}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
              viewMode === "table"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="테이블 뷰"
          >
            <span className="material-symbols-outlined text-[18px]">table_rows</span>
          </button>
          <button
            onClick={() => onViewModeChange("card")}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
              viewMode === "card"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="카드 뷰"
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
          </button>
        </div>

        {/* Grouping toggle */}
        <div className="flex items-center rounded-lg border border-border/60 p-0.5">
          {GROUP_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onGroupByChange(opt.key)}
              className={cn(
                "flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors",
                groupBy === opt.key
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={`${opt.label}별 그룹`}
            >
              <span className="material-symbols-outlined text-[16px]">{opt.icon}</span>
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right side: Search input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-muted-foreground">
          search
        </span>
        <input
          ref={searchInputRef}
          type="text"
          value={filterState.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="검색..."
          className="h-8 w-40 rounded-lg border border-border/60 bg-background pl-8 pr-8 text-xs placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 sm:w-52"
        />
        {filterState.searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
