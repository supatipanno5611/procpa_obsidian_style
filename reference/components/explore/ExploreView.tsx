"use client";

import { useRef } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { ExploreToolbar } from "./ExploreToolbar";
import { ExploreFilterPanel } from "./ExploreFilterPanel";
import { ExploreActiveFilters } from "./ExploreActiveFilters";
import { ExploreResultInfo } from "./ExploreResultInfo";
import { ExploreTable } from "./ExploreTable";
import { ExploreCardGrid } from "./ExploreCardGrid";
import { ExploreStats } from "./ExploreStats";
import { useExploreFilter } from "@/hooks/useExploreFilter";
import { useExplorePrefs } from "@/hooks/useExplorePrefs";
import type { ContentCollectionType, UnifiedContentItem } from "@/lib/explore";

interface ExploreViewProps {
  items: UnifiedContentItem[];
  presetContentTypes?: ContentCollectionType[];
  heroOverride?: { badge: string; title: string; description: string };
}

export function ExploreView({ items, presetContentTypes, heroOverride }: ExploreViewProps) {
  const { viewMode, setViewMode, groupBy, setGroupBy, groupByDomain } = useExplorePrefs();
  const filter = useExploreFilter(items, { presetContentTypes });
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <PageHero
        badge={heroOverride?.badge ?? "Explore"}
        title={heroOverride?.title ?? "탐색"}
        description={heroOverride?.description ?? "모든 콘텐츠를 메타데이터 기반으로 필터링하고 탐색합니다"}
      />

      <div className="gradient-line" />

      <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
        <ExploreStats items={items} />

        <div className="mt-6">
          <ExploreToolbar
            filter={filter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            groupBy={groupBy}
            onGroupByChange={setGroupBy}
            searchInputRef={searchInputRef}
          />
        </div>

        <ExploreFilterPanel filter={filter} allItems={items} />

        {filter.hasActiveFilters && (
          <ExploreActiveFilters
            chips={filter.activeFilterChips}
            onRemove={filter.removeFilter}
            onClearAll={filter.clearAllFilters}
          />
        )}

        <ExploreResultInfo filter={filter} />

        {filter.sortedItems.length === 0 ? (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-muted-foreground/30">search_off</span>
            <p className="mt-4 text-sm text-muted-foreground">
              해당 조건에 맞는 콘텐츠가 없습니다.
            </p>
            {filter.hasActiveFilters && (
              <button
                onClick={filter.clearAllFilters}
                className="mt-3 text-sm text-primary hover:underline"
              >
                필터 초기화
              </button>
            )}
          </div>
        ) : viewMode === "table" ? (
          <ExploreTable
            items={filter.sortedItems}
            sortField={filter.filterState.sortField}
            sortDirection={filter.filterState.sortDirection}
            onSort={filter.setSortField}
            searchQuery={filter.filterState.searchQuery}
            groupBy={groupBy}
            searchInputRef={searchInputRef}
          />
        ) : (
          <ExploreCardGrid
            items={filter.sortedItems}
            searchQuery={filter.filterState.searchQuery}
            groupByDomain={groupByDomain}
          />
        )}
      </div>
    </>
  );
}
