"use client";

import type { ActiveExploreChip } from "@/hooks/useExploreFilter";

interface ExploreActiveFiltersProps {
  chips: ActiveExploreChip[];
  onRemove: (chip: ActiveExploreChip) => void;
  onClearAll: () => void;
}

export function ExploreActiveFilters({ chips, onRemove, onClearAll }: ExploreActiveFiltersProps) {
  if (chips.length === 0) return null;

  return (
    <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
      <span className="shrink-0 text-xs text-muted-foreground">활성 필터:</span>
      <div className="flex items-center gap-1.5">
        {chips.map((chip, i) => (
          <span
            key={`${chip.type}-${chip.value}-${i}`}
            className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary"
          >
            {chip.label}
            <button
              onClick={() => onRemove(chip)}
              className="ml-0.5 hover:text-primary/70"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </span>
        ))}
      </div>
      <button
        onClick={onClearAll}
        className="shrink-0 text-[11px] text-muted-foreground hover:text-foreground"
      >
        모든 필터 초기화
      </button>
    </div>
  );
}
