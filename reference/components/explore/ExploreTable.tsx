"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getTopicLabel } from "@/lib/taxonomy";
import { getTopicBadgeClasses, getDomainForTopic, DOMAINS } from "@/lib/domains";
import { highlightText } from "@/lib/search-utils";
import type { UnifiedContentItem, ContentCollectionType } from "@/lib/explore";
import type { SortField } from "@/hooks/useExploreFilter";
import type { GroupByField } from "@/hooks/useExplorePrefs";

const TYPE_CONFIG: Record<ContentCollectionType, { icon: string; color: string }> = {
  post: { icon: "article", color: "text-blue-500" },
  series: { icon: "library_books", color: "text-emerald-500" },
  reference: { icon: "book", color: "text-purple-500" },
  resource: { icon: "folder_zip", color: "text-amber-500" },
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  post: "포스트",
  series: "시리즈",
  reference: "레퍼런스",
  resource: "자료실",
};

interface Column {
  key: SortField | "tags";
  label: string;
  className: string;
  sortable: boolean;
}

const COLUMNS: Column[] = [
  { key: "contentType", label: "유형", className: "w-10", sortable: true },
  { key: "title", label: "제목", className: "flex-1 min-w-0", sortable: true },
  { key: "topic", label: "주제", className: "w-24 hidden lg:block", sortable: true },
  { key: "date", label: "수정일", className: "w-24 hidden sm:block", sortable: true },
  { key: "tags", label: "태그", className: "w-36 hidden xl:block", sortable: false },
];

interface GroupedItems {
  key: string;
  label: string;
  items: UnifiedContentItem[];
}

function groupItems(items: UnifiedContentItem[], groupBy: GroupByField): GroupedItems[] {
  if (groupBy === "none") return [{ key: "__all__", label: "", items }];

  const groups = new Map<string, UnifiedContentItem[]>();

  for (const item of items) {
    let key: string;
    switch (groupBy) {
      case "domain": {
        const domain = getDomainForTopic(item.topic);
        key = domain?.key ?? "other";
        break;
      }
      case "topic":
        key = item.topic;
        break;
      case "contentType":
        key = item.contentType;
        break;
      default:
        key = "__all__";
    }
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  return Array.from(groups.entries()).map(([key, groupedItems]) => ({
    key,
    label: getGroupLabel(key, groupBy),
    items: groupedItems,
  }));
}

function getGroupLabel(key: string, groupBy: GroupByField): string {
  switch (groupBy) {
    case "domain": {
      const domain = DOMAINS.find((d) => d.key === key);
      return domain?.label ?? key;
    }
    case "topic":
      return getTopicLabel(key);
    case "contentType":
      return CONTENT_TYPE_LABELS[key] ?? key;
    default:
      return "";
  }
}

interface ExploreTableProps {
  items: UnifiedContentItem[];
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
  searchQuery: string;
  groupBy?: GroupByField;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export function ExploreTable({
  items,
  sortField,
  sortDirection,
  onSort,
  searchQuery,
  groupBy = "none",
  searchInputRef,
}: ExploreTableProps) {
  const router = useRouter();
  const groups = useMemo(() => groupItems(items, groupBy), [items, groupBy]);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const rowRefs = useRef<Map<number, HTMLElement>>(new Map());

  // Build flat list of visible items for keyboard navigation
  const visibleItems = useMemo(() => {
    const result: UnifiedContentItem[] = [];
    for (const group of groups) {
      if (groupBy !== "none" && collapsedGroups.has(group.key)) continue;
      result.push(...group.items);
    }
    return result;
  }, [groups, groupBy, collapsedGroups]);

  // Reset collapsed groups when groupBy changes
  useEffect(() => {
    setCollapsedGroups(new Set());
  }, [groupBy]);

  // Reset activeIndex when items or groupBy changes
  useEffect(() => {
    setActiveIndex(null);
  }, [items, groupBy]);

  const toggleGroup = useCallback((key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Skip if user is typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setActiveIndex((prev) => {
            if (prev === null) return 0;
            return Math.min(prev + 1, visibleItems.length - 1);
          });
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setActiveIndex((prev) => {
            if (prev === null) return 0;
            return Math.max(prev - 1, 0);
          });
          break;
        }
        case "Enter": {
          if (activeIndex !== null && visibleItems[activeIndex]) {
            e.preventDefault();
            router.push(`/${visibleItems[activeIndex].slug}`);
          }
          break;
        }
        case "/": {
          e.preventDefault();
          searchInputRef?.current?.focus();
          break;
        }
        case "Escape": {
          setActiveIndex(null);
          break;
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, visibleItems, router, searchInputRef]);

  // Scroll active row into view
  useEffect(() => {
    if (activeIndex !== null) {
      const el = rowRefs.current.get(activeIndex);
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeIndex]);

  // Track global flat index for keyboard nav
  let flatIndex = -1;

  return (
    <>
      {/* Desktop table */}
      <div className="mt-2 hidden sm:block">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border/60 px-3 py-2">
          {COLUMNS.map((col) => (
            <div key={col.key} className={cn(col.className)}>
              {col.sortable ? (
                <button
                  onClick={() => onSort(col.key as SortField)}
                  className={cn(
                    "inline-flex items-center gap-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors",
                    sortField === col.key
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {col.label}
                  {sortField === col.key && (
                    <span className="material-symbols-outlined text-[14px]">
                      {sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                    </span>
                  )}
                </button>
              ) : (
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {col.label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Grouped rows */}
        {groups.map((group) => (
          <div key={group.key}>
            {groupBy !== "none" && (
              <button
                onClick={() => toggleGroup(group.key)}
                className="flex w-full items-center gap-2 bg-muted/50 px-3 py-2 text-xs font-semibold text-foreground border-b border-border/30 hover:bg-muted/70 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-muted-foreground">
                  {collapsedGroups.has(group.key) ? "chevron_right" : "expand_more"}
                </span>
                {group.label}
                <span className="text-muted-foreground font-normal">({group.items.length})</span>
              </button>
            )}
            {!collapsedGroups.has(group.key) && (
              <div className="divide-y divide-border/30">
                {group.items.map((item, i) => {
                  flatIndex++;
                  const currentFlatIndex = flatIndex;
                  return (
                    <TableRow
                      key={item.slug}
                      item={item}
                      searchQuery={searchQuery}
                      index={i}
                      isActive={activeIndex === currentFlatIndex}
                      ref={(el) => {
                        if (el) rowRefs.current.set(currentFlatIndex, el);
                        else rowRefs.current.delete(currentFlatIndex);
                      }}
                      onMouseEnter={() => setActiveIndex(currentFlatIndex)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile compact list */}
      <div className="mt-2 divide-y divide-border/30 sm:hidden">
        {groups.map((group) => (
          <div key={group.key}>
            {groupBy !== "none" && (
              <button
                onClick={() => toggleGroup(group.key)}
                className="flex w-full items-center gap-2 bg-muted/50 px-2 py-2 text-xs font-semibold text-foreground border-b border-border/30"
              >
                <span className="material-symbols-outlined text-[16px] text-muted-foreground">
                  {collapsedGroups.has(group.key) ? "chevron_right" : "expand_more"}
                </span>
                {group.label}
                <span className="text-muted-foreground font-normal">({group.items.length})</span>
              </button>
            )}
            {!collapsedGroups.has(group.key) &&
              group.items.map((item) => (
                <MobileRow key={item.slug} item={item} searchQuery={searchQuery} />
              ))}
          </div>
        ))}
      </div>
    </>
  );
}

import { forwardRef } from "react";

const TableRow = forwardRef<
  HTMLAnchorElement,
  {
    item: UnifiedContentItem;
    searchQuery: string;
    index: number;
    isActive: boolean;
    onMouseEnter: () => void;
  }
>(function TableRow({ item, searchQuery, index, isActive, onMouseEnter }, ref) {
  const cfg = TYPE_CONFIG[item.contentType];
  const topicLabel = getTopicLabel(item.topic);
  const badgeClasses = getTopicBadgeClasses(item.topic);
  const displayDate = item.updated ?? item.date;
  const dateStr = new Date(displayDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link
      ref={ref}
      href={`/${item.slug}`}
      onMouseEnter={onMouseEnter}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 transition-colors",
        isActive
          ? "bg-primary/5 ring-1 ring-inset ring-primary/30"
          : index % 2 === 1
            ? "bg-muted/30 hover:bg-muted/40"
            : "hover:bg-muted/40"
      )}
    >
      {/* Type icon */}
      <div className="w-10 flex justify-center">
        <span className={cn("material-symbols-outlined text-[20px]", cfg.color)}>
          {cfg.icon}
        </span>
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground line-clamp-1">
          {highlightText(item.title, searchQuery)}
        </span>
      </div>

      {/* Topic */}
      <div className="w-24 hidden lg:block">
        <span className={cn("inline-block rounded-md px-1.5 py-0.5 text-[10px] font-medium", badgeClasses)}>
          {topicLabel}
        </span>
      </div>

      {/* Date (updated or publish) */}
      <div className="w-24 hidden sm:block">
        <span className="text-xs text-muted-foreground tabular-nums">{dateStr}</span>
      </div>

      {/* Tags */}
      <div className="w-36 hidden xl:flex items-center gap-1 overflow-hidden">
        {item.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="inline-block truncate rounded border border-border/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {item.tags.length > 2 && (
          <span className="text-[10px] text-muted-foreground/60">
            +{item.tags.length - 2}
          </span>
        )}
      </div>
    </Link>
  );
});

function MobileRow({
  item,
  searchQuery,
}: {
  item: UnifiedContentItem;
  searchQuery: string;
}) {
  const cfg = TYPE_CONFIG[item.contentType];
  const displayDate = item.updated ?? item.date;
  const dateStr = new Date(displayDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/${item.slug}`}
      className="flex items-center gap-3 px-2 py-3 transition-colors hover:bg-muted/40"
    >
      <span className={cn("material-symbols-outlined text-[20px] shrink-0", cfg.color)}>
        {cfg.icon}
      </span>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground line-clamp-1">
          {highlightText(item.title, searchQuery)}
        </span>
        <span className="text-[11px] text-muted-foreground">{dateStr}</span>
      </div>
    </Link>
  );
}
