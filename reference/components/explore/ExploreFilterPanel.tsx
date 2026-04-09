"use client";

import { Fragment, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DOMAINS } from "@/lib/domains";
import { getUnifiedTagCounts, type UnifiedContentItem, type ContentCollectionType } from "@/lib/explore";
import type { useExploreFilter } from "@/hooks/useExploreFilter";

const CONTENT_TYPE_OPTIONS: { key: ContentCollectionType; label: string; icon: string }[] = [
  { key: "post", label: "포스트", icon: "article" },
  { key: "series", label: "시리즈", icon: "library_books" },
  { key: "reference", label: "레퍼런스", icon: "book" },
  { key: "resource", label: "자료실", icon: "folder_zip" },
];

const DATE_PRESETS = [
  { key: "all" as const, label: "전체" },
  { key: "1m" as const, label: "1개월" },
  { key: "3m" as const, label: "3개월" },
  { key: "6m" as const, label: "6개월" },
  { key: "1y" as const, label: "1년" },
];

const AUTHOR_OPTIONS = [
  { key: "all" as const, label: "전체" },
  { key: "original" as const, label: "직접 작성" },
  { key: "reference" as const, label: "참고자료" },
];

const FILE_TYPE_OPTIONS = [
  { key: "excel", label: "Excel", icon: "table_chart" },
  { key: "pdf", label: "PDF", icon: "picture_as_pdf" },
  { key: "code", label: "코드", icon: "code" },
  { key: "zip", label: "압축파일", icon: "folder_zip" },
  { key: "other", label: "기타", icon: "draft" },
];

interface ExploreFilterPanelProps {
  filter: ReturnType<typeof useExploreFilter>;
  allItems: UnifiedContentItem[];
}

export function ExploreFilterPanel({ filter, allItems }: ExploreFilterPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [showAllTags, setShowAllTags] = useState(false);

  const {
    filterState,
    facetCounts,
    availableSubTopics,
    availableLeafTopics,
    toggleContentType,
    setDomain,
    toggleSubTopic,
    toggleLeafTopic,
    setAuthorType,
    toggleFileType,
    setDatePreset,
    toggleTag,
  } = filter;

  // Compute all tag counts from all items
  const tagCounts = useMemo(() => getUnifiedTagCounts(allItems), [allItems]);
  const sortedTags = useMemo(() => {
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1]);
  }, [tagCounts]);

  const visibleTags = showAllTags ? sortedTags : sortedTags.slice(0, 15);

  // ─── Content-type-adaptive filter visibility ───
  const activeTypes = filterState.contentTypes.length === 0
    ? ["post", "series", "reference", "resource"]
    : filterState.contentTypes;

  // SubTopic/LeafTopic: only when post or reference is in scope
  const showTopicDrilldown = activeTypes.some((t) => t === "post" || t === "reference");
  // AuthorType: only when post or reference is in scope
  const showAuthorFilter = activeTypes.some((t) => t === "post" || t === "reference");
  // FileType: only when resource is in scope
  const showFileTypeFilter = activeTypes.includes("resource");

  // Group leaf topics by subtopic for display
  const groupedLeafTopics = useMemo(() => {
    const groups = new Map<string, typeof availableLeafTopics>();
    for (const lt of availableLeafTopics) {
      const subKey = lt.subTopicKey;
      if (!groups.has(subKey)) groups.set(subKey, []);
      groups.get(subKey)!.push(lt);
    }
    return Array.from(groups.entries());
  }, [availableLeafTopics]);

  return (
    <div className="mt-4 rounded-xl border border-border/60 bg-card/50">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground"
      >
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-muted-foreground">tune</span>
          필터
        </span>
        <span className={cn(
          "material-symbols-outlined text-[18px] text-muted-foreground transition-transform",
          expanded && "rotate-180"
        )}>
          expand_more
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-border/40 px-4 py-3">
              {/* Row 0: Content type */}
              <FilterRow label="유형">
                <div className="flex flex-wrap gap-1.5">
                  {CONTENT_TYPE_OPTIONS.map(({ key, label, icon }) => (
                    <ChipButton
                      key={key}
                      active={filterState.contentTypes.includes(key)}
                      onClick={() => toggleContentType(key)}
                      size="sm"
                    >
                      <span className="material-symbols-outlined text-[14px] mr-0.5">{icon}</span>
                      {label}
                      <span className="ml-0.5 text-[10px] opacity-50">
                        {facetCounts.contentTypes[key] || 0}
                      </span>
                    </ChipButton>
                  ))}
                </div>
              </FilterRow>

              {/* Row 1: Domain tabs */}
              <FilterRow label="주제">
                <div className="flex flex-wrap gap-1.5">
                  <ChipButton
                    active={filterState.selectedDomain === null}
                    onClick={() => setDomain(null)}
                  >
                    전체
                  </ChipButton>
                  {DOMAINS.map((d) => (
                    <ChipButton
                      key={d.key}
                      active={filterState.selectedDomain === d.key}
                      onClick={() => setDomain(d.key)}
                    >
                      {d.label}
                    </ChipButton>
                  ))}
                </div>
              </FilterRow>

              {/* Row 2: SubTopic chips — only when post/reference in scope */}
              <AnimatePresence>
                {showTopicDrilldown && availableSubTopics.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FilterRow label="세부주제">
                      <div className="flex flex-wrap gap-1.5">
                        {availableSubTopics.map((sub) => (
                          <ChipButton
                            key={sub.key}
                            active={filterState.selectedSubTopics.includes(sub.key)}
                            onClick={() => toggleSubTopic(sub.key)}
                            size="sm"
                          >
                            {sub.label}
                          </ChipButton>
                        ))}
                      </div>
                    </FilterRow>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Row 2.5: Leaf topic chips (L3) — grouped by subtopic */}
              <AnimatePresence>
                {showTopicDrilldown && availableLeafTopics.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FilterRow label="세부">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {groupedLeafTopics.map(([subKey, leaves], idx) => (
                          <Fragment key={subKey}>
                            {filterState.selectedSubTopics.length > 1 && idx > 0 && (
                              <span className="text-border/60 mx-0.5 text-[11px]">|</span>
                            )}
                            {leaves.map((lt) => (
                              <ChipButton
                                key={lt.key}
                                active={filterState.selectedLeafTopics.includes(lt.key)}
                                onClick={() => toggleLeafTopic(lt.key)}
                                size="sm"
                              >
                                {lt.label}
                              </ChipButton>
                            ))}
                          </Fragment>
                        ))}
                      </div>
                    </FilterRow>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Row 3: Author type — only when post/reference in scope */}
              <AnimatePresence>
                {showAuthorFilter && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FilterRow label="작성자">
                      <div className="flex flex-wrap gap-1.5">
                        {AUTHOR_OPTIONS.map((opt) => (
                          <ChipButton
                            key={opt.key}
                            active={filterState.authorType === opt.key}
                            onClick={() => setAuthorType(opt.key)}
                            size="sm"
                          >
                            {opt.label}
                          </ChipButton>
                        ))}
                      </div>
                    </FilterRow>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Row 3.5: FileType — only when resource in scope */}
              <AnimatePresence>
                {showFileTypeFilter && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FilterRow label="파일유형">
                      <div className="flex flex-wrap gap-1.5">
                        {FILE_TYPE_OPTIONS.map((opt) => (
                          <ChipButton
                            key={opt.key}
                            active={filterState.selectedFileTypes.includes(opt.key)}
                            onClick={() => toggleFileType(opt.key)}
                            size="sm"
                          >
                            <span className="material-symbols-outlined text-[14px] mr-0.5">{opt.icon}</span>
                            {opt.label}
                          </ChipButton>
                        ))}
                      </div>
                    </FilterRow>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Row 4: Date preset */}
              <FilterRow label="기간">
                <div className="flex flex-wrap gap-1.5">
                  {DATE_PRESETS.map((p) => (
                    <ChipButton
                      key={p.key}
                      active={filterState.datePreset === p.key}
                      onClick={() => setDatePreset(p.key)}
                      size="sm"
                    >
                      {p.label}
                    </ChipButton>
                  ))}
                </div>
              </FilterRow>

              {/* Row 5: Tags */}
              {sortedTags.length > 0 && (
                <FilterRow label="태그">
                  <div className="flex flex-wrap gap-1.5">
                    {visibleTags.map(([tag, count]) => (
                      <ChipButton
                        key={tag}
                        active={filterState.selectedTags.includes(tag)}
                        onClick={() => toggleTag(tag)}
                        size="sm"
                      >
                        {tag}
                        <span className="ml-0.5 text-[10px] opacity-50">{count}</span>
                      </ChipButton>
                    ))}
                    {sortedTags.length > 15 && (
                      <button
                        onClick={() => setShowAllTags(!showAllTags)}
                        className="text-xs text-primary hover:underline"
                      >
                        {showAllTags ? "접기" : `+${sortedTags.length - 15}개 더보기`}
                      </button>
                    )}
                  </div>
                </FilterRow>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ───

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 w-16 shrink-0 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function ChipButton({
  active,
  onClick,
  size = "default",
  children,
}: {
  active: boolean;
  onClick: () => void;
  size?: "default" | "sm";
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-md border font-medium transition-all",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
