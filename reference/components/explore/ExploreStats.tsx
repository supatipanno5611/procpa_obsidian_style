"use client";

import { useMemo } from "react";
import type { UnifiedContentItem } from "@/lib/explore";

interface ExploreStatsProps {
  items: UnifiedContentItem[];
}

export function ExploreStats({ items }: ExploreStatsProps) {
  const stats = useMemo(() => {
    const typeCounts = { post: 0, series: 0, reference: 0, resource: 0 };
    let latestDate = 0;

    for (const item of items) {
      typeCounts[item.contentType] = (typeCounts[item.contentType] || 0) + 1;

      const itemDate = new Date(item.updated ?? item.date).getTime();
      if (itemDate > latestDate) latestDate = itemDate;
    }

    // Relative time for latest update
    const now = Date.now();
    const diffMs = now - latestDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    let relativeTime: string;
    if (diffDays === 0) relativeTime = "오늘";
    else if (diffDays === 1) relativeTime = "어제";
    else if (diffDays < 7) relativeTime = `${diffDays}일 전`;
    else if (diffDays < 30) relativeTime = `${Math.floor(diffDays / 7)}주 전`;
    else relativeTime = `${Math.floor(diffDays / 30)}개월 전`;

    return { typeCounts, relativeTime };
  }, [items]);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-border/40 bg-card/50 px-4 py-3">
      {/* Type counts */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <StatChip icon="article" color="text-blue-500" count={stats.typeCounts.post} label="포스트" />
        <StatChip icon="library_books" color="text-emerald-500" count={stats.typeCounts.series} label="시리즈" />
        <StatChip icon="book" color="text-purple-500" count={stats.typeCounts.reference} label="레퍼런스" />
        <StatChip icon="folder_zip" color="text-amber-500" count={stats.typeCounts.resource} label="자료" />
      </div>

      {/* Latest update */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
        <span className="material-symbols-outlined text-[14px]">update</span>
        <span>최근 업데이트: {stats.relativeTime}</span>
      </div>
    </div>
  );
}

function StatChip({ icon, color, count, label }: { icon: string; color: string; count: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`material-symbols-outlined text-[14px] ${color}`}>{icon}</span>
      <span className="font-medium text-foreground tabular-nums">{count}</span>
      <span>{label}</span>
    </span>
  );
}
