"use client";

import { cn } from "@/lib/utils";

export type ContentTypeFilterValue = "all" | "original" | "reference";

interface ContentTypeFilterProps {
  value: ContentTypeFilterValue;
  onChange: (value: ContentTypeFilterValue) => void;
  className?: string;
}

const filters: { value: ContentTypeFilterValue; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "original", label: "직접 작성" },
  { value: "reference", label: "참고자료" },
];

export function ContentTypeFilter({ value, onChange, className }: ContentTypeFilterProps) {
  return (
    <div className={cn("flex items-center gap-1 rounded-lg bg-muted/50 p-1", className)}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            value === filter.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
