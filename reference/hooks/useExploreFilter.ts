"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { ContentCollectionType, UnifiedContentItem } from "@/lib/explore";
import {
  DOMAINS,
  getDomainForTopic,
  getSubTopicsForDomain,
  getLeafTopicsForDomainSubTopic,
} from "@/lib/domains";
import { getLeafMatchTags } from "@/lib/taxonomy";

// ─── Types ───

export type SortField = "date" | "title" | "topic" | "contentType";

export interface ExploreFilterState {
  contentTypes: ContentCollectionType[];
  selectedDomain: string | null;
  selectedSubTopics: string[];
  selectedLeafTopics: string[];
  authorType: "all" | "original" | "reference";
  selectedFileTypes: string[];
  selectedTags: string[];
  datePreset: "all" | "1m" | "3m" | "6m" | "1y";
  searchQuery: string;
  sortField: SortField;
  sortDirection: "asc" | "desc";
}

export interface ActiveExploreChip {
  type: "contentType" | "domain" | "subTopic" | "leafTopic" | "authorType" | "fileType" | "tag" | "date" | "search";
  label: string;
  value: string;
}

export interface FacetCounts {
  contentTypes: Record<ContentCollectionType, number>;
  domains: Record<string, number>;
  authorTypes: Record<string, number>;
  fileTypes: Record<string, number>;
}

// ─── Constants ───

const CONTENT_TYPE_LABELS: Record<ContentCollectionType, string> = {
  post: "포스트",
  series: "시리즈",
  reference: "레퍼런스",
  resource: "자료실",
};

const DATE_PRESET_LABELS: Record<string, string> = {
  all: "전체",
  "1m": "1개월",
  "3m": "3개월",
  "6m": "6개월",
  "1y": "1년",
};

const FILE_TYPE_LABELS: Record<string, string> = {
  excel: "Excel",
  pdf: "PDF",
  code: "코드",
  zip: "압축파일",
  other: "기타",
};

// ─── URL Serialization Helpers ───

function parseUrlState(searchParams: URLSearchParams): Partial<ExploreFilterState> {
  const state: Partial<ExploreFilterState> = {};

  const types = searchParams.get("type");
  if (types) state.contentTypes = types.split(",") as ContentCollectionType[];

  const domain = searchParams.get("domain");
  if (domain) state.selectedDomain = domain;

  const sub = searchParams.get("sub");
  if (sub) state.selectedSubTopics = sub.split(",");

  const leaf = searchParams.get("leaf");
  if (leaf) state.selectedLeafTopics = leaf.split(",");

  const author = searchParams.get("author");
  if (author === "original" || author === "reference") state.authorType = author;

  const fileType = searchParams.get("fileType");
  if (fileType) state.selectedFileTypes = fileType.split(",");

  const tags = searchParams.get("tags");
  if (tags) state.selectedTags = tags.split(",");

  const date = searchParams.get("date");
  if (date) state.datePreset = date as ExploreFilterState["datePreset"];

  const q = searchParams.get("q");
  if (q) state.searchQuery = q;

  const sort = searchParams.get("sort");
  if (sort) state.sortField = sort as SortField;

  const dir = searchParams.get("dir");
  if (dir === "asc" || dir === "desc") state.sortDirection = dir;

  return state;
}

function serializeToUrl(state: ExploreFilterState): string {
  const params = new URLSearchParams();

  if (state.contentTypes.length > 0) params.set("type", state.contentTypes.join(","));
  if (state.selectedDomain) params.set("domain", state.selectedDomain);
  if (state.selectedSubTopics.length > 0) params.set("sub", state.selectedSubTopics.join(","));
  if (state.selectedLeafTopics.length > 0) params.set("leaf", state.selectedLeafTopics.join(","));
  if (state.authorType !== "all") params.set("author", state.authorType);
  if (state.selectedFileTypes.length > 0) params.set("fileType", state.selectedFileTypes.join(","));
  if (state.selectedTags.length > 0) params.set("tags", state.selectedTags.join(","));
  if (state.datePreset !== "all") params.set("date", state.datePreset);
  if (state.searchQuery.trim()) params.set("q", state.searchQuery.trim());
  if (state.sortField !== "date") params.set("sort", state.sortField);
  if (state.sortDirection !== "desc") params.set("dir", state.sortDirection);

  const str = params.toString();
  return str ? `?${str}` : "";
}

// ─── Date Helpers ───

function getDateThreshold(preset: string): Date | null {
  if (preset === "all") return null;
  const now = new Date();
  switch (preset) {
    case "1m": return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    case "3m": return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    case "6m": return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    case "1y": return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    default: return null;
  }
}

// ─── L3 Leaf Topic Helper ───

function passesLeafTopicFilter(
  item: UnifiedContentItem,
  selectedLeafTopics: string[],
  selectedSubTopics: string[],
): boolean {
  if (selectedLeafTopics.length === 0 || selectedSubTopics.length === 0) return true;
  // Items without subTopic (series/resources) pass through
  if (!item.subTopic) return true;
  const allMatchTags = selectedLeafTopics.flatMap((leafKey) =>
    selectedSubTopics.flatMap((subKey) =>
      getLeafMatchTags(item.topic, subKey, leafKey)
    )
  );
  if (allMatchTags.length === 0) return true;
  return item.tags.some((tag) =>
    allMatchTags.some((mt) => tag.toLowerCase().includes(mt.toLowerCase()))
  );
}

// ─── Hook ───

const DEFAULT_STATE: ExploreFilterState = {
  contentTypes: [],
  selectedDomain: null,
  selectedSubTopics: [],
  selectedLeafTopics: [],
  authorType: "all",
  selectedFileTypes: [],
  selectedTags: [],
  datePreset: "all",
  searchQuery: "",
  sortField: "date",
  sortDirection: "desc",
};

interface UseExploreFilterOptions {
  presetContentTypes?: ContentCollectionType[];
}

export function useExploreFilter(
  items: UnifiedContentItem[],
  options?: UseExploreFilterOptions,
) {
  const searchParams = useSearchParams();

  // Initialize state from URL params, with optional preset fallback
  const [state, setState] = useState<ExploreFilterState>(() => {
    const urlState = parseUrlState(searchParams);
    const initial = { ...DEFAULT_STATE, ...urlState };
    // Apply preset only when URL doesn't already specify content types
    if (options?.presetContentTypes && !searchParams.get("type")) {
      initial.contentTypes = options.presetContentTypes;
    }
    return initial;
  });

  // Sync state to URL (replaceState to avoid history pollution)
  useEffect(() => {
    const url = serializeToUrl(state);
    const currentUrl = window.location.search || "";
    if (url !== currentUrl) {
      window.history.replaceState(null, "", window.location.pathname + url);
    }
  }, [state]);

  // ─── Derived Data ───

  // Available subtopics based on domain selection
  const availableSubTopics = useMemo(() => {
    if (!state.selectedDomain) return [];
    return getSubTopicsForDomain(state.selectedDomain);
  }, [state.selectedDomain]);

  // Available leaf topics (L3) — aggregated from ALL selected subtopics
  const availableLeafTopics = useMemo(() => {
    if (!state.selectedDomain || state.selectedSubTopics.length === 0) return [];
    const allLeaves: { key: string; label: string; matchTags: string[]; subTopicKey: string }[] = [];
    for (const subKey of state.selectedSubTopics) {
      const leaves = getLeafTopicsForDomainSubTopic(state.selectedDomain, subKey);
      allLeaves.push(...leaves.map((l) => ({ ...l, subTopicKey: subKey })));
    }
    return allLeaves;
  }, [state.selectedDomain, state.selectedSubTopics]);

  // Filter logic: AND between groups, OR within groups
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Content type filter (OR)
      if (state.contentTypes.length > 0) {
        if (!state.contentTypes.includes(item.contentType)) return false;
      }

      // 2. Domain filter
      if (state.selectedDomain) {
        const domain = getDomainForTopic(item.topic);
        if (!domain || domain.key !== state.selectedDomain) return false;
      }

      // 3. SubTopic filter (OR) — items without subTopic pass through
      if (state.selectedSubTopics.length > 0) {
        if (item.subTopic && !state.selectedSubTopics.includes(item.subTopic)) return false;
      }

      // 3.5 Leaf topic filter (L3)
      if (!passesLeafTopicFilter(item, state.selectedLeafTopics, state.selectedSubTopics)) {
        return false;
      }

      // 4. Author type filter — items without authorType pass through
      if (state.authorType !== "all") {
        if (item.authorType && item.authorType !== state.authorType) return false;
      }

      // 4.5. FileType filter (OR) — items without fileType pass through
      if (state.selectedFileTypes.length > 0) {
        if (item.fileType && !state.selectedFileTypes.includes(item.fileType)) return false;
      }

      // 5. Tags filter (OR)
      if (state.selectedTags.length > 0) {
        const hasMatchingTag = item.tags.some((t) => state.selectedTags.includes(t));
        if (!hasMatchingTag) return false;
      }

      // 6. Date range filter
      const threshold = getDateThreshold(state.datePreset);
      if (threshold) {
        if (new Date(item.updated ?? item.date) < threshold) return false;
      }

      // 7. Search query
      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchContent = item.searchText.toLowerCase().includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchContent && !matchTags) return false;
      }

      return true;
    });
  }, [items, state]);

  // Sort filtered items
  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems];
    const dir = state.sortDirection === "asc" ? 1 : -1;

    sorted.sort((a, b) => {
      switch (state.sortField) {
        case "date": {
          const aDate = new Date(a.updated ?? a.date).getTime();
          const bDate = new Date(b.updated ?? b.date).getTime();
          return dir * (aDate - bDate);
        }
        case "title":
          return dir * a.title.localeCompare(b.title, "ko");
        case "topic":
          return dir * a.topic.localeCompare(b.topic);
        case "contentType":
          return dir * a.contentType.localeCompare(b.contentType);
        default:
          return 0;
      }
    });

    return sorted;
  }, [filteredItems, state.sortField, state.sortDirection]);

  // Facet counts (based on items that pass all OTHER filters)
  const facetCounts = useMemo<FacetCounts>(() => {
    const ct: Record<string, number> = { post: 0, series: 0, reference: 0, resource: 0 };
    const dm: Record<string, number> = {};
    const at: Record<string, number> = { original: 0, reference: 0 };
    const ft: Record<string, number> = {};

    for (const item of items) {
      const passesOther = passesFiltersExcept(item, "contentType");
      if (passesOther) {
        ct[item.contentType] = (ct[item.contentType] || 0) + 1;
      }

      const passesDomain = passesFiltersExcept(item, "domain");
      if (passesDomain) {
        const domain = getDomainForTopic(item.topic);
        if (domain) {
          dm[domain.key] = (dm[domain.key] || 0) + 1;
        }
      }

      const passesAuthor = passesFiltersExcept(item, "authorType");
      if (passesAuthor && item.authorType) {
        at[item.authorType] = (at[item.authorType] || 0) + 1;
      }

      const passesFileType = passesFiltersExcept(item, "fileType");
      if (passesFileType && item.fileType) {
        ft[item.fileType] = (ft[item.fileType] || 0) + 1;
      }
    }

    return {
      contentTypes: ct as Record<ContentCollectionType, number>,
      domains: dm,
      authorTypes: at,
      fileTypes: ft,
    };
  }, [items, state]);

  // Helper: check if item passes all filters EXCEPT the specified one
  function passesFiltersExcept(item: UnifiedContentItem, except: string): boolean {
    if (except !== "contentType" && state.contentTypes.length > 0) {
      if (!state.contentTypes.includes(item.contentType)) return false;
    }
    if (except !== "domain" && state.selectedDomain) {
      const domain = getDomainForTopic(item.topic);
      if (!domain || domain.key !== state.selectedDomain) return false;
    }
    if (except !== "subTopic" && state.selectedSubTopics.length > 0) {
      if (item.subTopic && !state.selectedSubTopics.includes(item.subTopic)) return false;
    }
    if (except !== "leafTopic") {
      if (!passesLeafTopicFilter(item, state.selectedLeafTopics, state.selectedSubTopics)) {
        return false;
      }
    }
    if (except !== "authorType" && state.authorType !== "all") {
      if (item.authorType && item.authorType !== state.authorType) return false;
    }
    if (except !== "fileType" && state.selectedFileTypes.length > 0) {
      if (item.fileType && !state.selectedFileTypes.includes(item.fileType)) return false;
    }
    if (except !== "tags" && state.selectedTags.length > 0) {
      const hasMatchingTag = item.tags.some((t) => state.selectedTags.includes(t));
      if (!hasMatchingTag) return false;
    }
    if (except !== "date") {
      const threshold = getDateThreshold(state.datePreset);
      if (threshold && new Date(item.updated ?? item.date) < threshold) return false;
    }
    if (except !== "search" && state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchContent = item.searchText.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchContent && !matchTags) return false;
    }
    return true;
  }

  // Active filter chips
  const activeFilterChips = useMemo<ActiveExploreChip[]>(() => {
    const chips: ActiveExploreChip[] = [];

    for (const ct of state.contentTypes) {
      chips.push({ type: "contentType", label: CONTENT_TYPE_LABELS[ct], value: ct });
    }

    if (state.selectedDomain) {
      const domain = DOMAINS.find((d) => d.key === state.selectedDomain);
      if (domain) chips.push({ type: "domain", label: domain.label, value: domain.key });
    }

    for (const sub of state.selectedSubTopics) {
      const found = availableSubTopics.find((s) => s.key === sub);
      if (found) chips.push({ type: "subTopic", label: found.label, value: sub });
    }

    for (const lt of state.selectedLeafTopics) {
      const found = availableLeafTopics.find((l) => l.key === lt);
      if (found) chips.push({ type: "leafTopic", label: found.label, value: lt });
    }

    if (state.authorType !== "all") {
      const label = state.authorType === "original" ? "직접 작성" : "참고자료";
      chips.push({ type: "authorType", label, value: state.authorType });
    }

    for (const ft of state.selectedFileTypes) {
      chips.push({ type: "fileType", label: FILE_TYPE_LABELS[ft] || ft, value: ft });
    }

    for (const tag of state.selectedTags) {
      chips.push({ type: "tag", label: tag, value: tag });
    }

    if (state.datePreset !== "all") {
      chips.push({ type: "date", label: DATE_PRESET_LABELS[state.datePreset], value: state.datePreset });
    }

    if (state.searchQuery.trim()) {
      chips.push({ type: "search", label: `"${state.searchQuery.trim()}"`, value: state.searchQuery });
    }

    return chips;
  }, [state, availableSubTopics, availableLeafTopics]);

  const hasActiveFilters = activeFilterChips.length > 0;

  // ─── Actions ───

  const toggleContentType = useCallback((ct: ContentCollectionType) => {
    setState((prev) => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(ct)
        ? prev.contentTypes.filter((t) => t !== ct)
        : [...prev.contentTypes, ct],
    }));
  }, []);

  const setDomain = useCallback((domain: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedDomain: domain,
      selectedSubTopics: [],
      selectedLeafTopics: [],
    }));
  }, []);

  const toggleSubTopic = useCallback((subTopic: string) => {
    setState((prev) => {
      const isRemoving = prev.selectedSubTopics.includes(subTopic);
      const newSubTopics = isRemoving
        ? prev.selectedSubTopics.filter((s) => s !== subTopic)
        : [...prev.selectedSubTopics, subTopic];
      // When removing a subtopic, only clear leaf topics belonging to that subtopic
      let newLeafTopics = prev.selectedLeafTopics;
      if (isRemoving && prev.selectedDomain) {
        const leavesOfRemoved = getLeafTopicsForDomainSubTopic(prev.selectedDomain, subTopic);
        const leafKeysToRemove = new Set(leavesOfRemoved.map((l) => l.key));
        newLeafTopics = prev.selectedLeafTopics.filter((lk) => !leafKeysToRemove.has(lk));
      }
      return { ...prev, selectedSubTopics: newSubTopics, selectedLeafTopics: newLeafTopics };
    });
  }, []);

  const toggleLeafTopic = useCallback((leafTopic: string) => {
    setState((prev) => ({
      ...prev,
      selectedLeafTopics: prev.selectedLeafTopics.includes(leafTopic)
        ? prev.selectedLeafTopics.filter((l) => l !== leafTopic)
        : [...prev.selectedLeafTopics, leafTopic],
    }));
  }, []);

  const setAuthorType = useCallback((at: "all" | "original" | "reference") => {
    setState((prev) => ({ ...prev, authorType: at }));
  }, []);

  const toggleFileType = useCallback((ft: string) => {
    setState((prev) => ({
      ...prev,
      selectedFileTypes: prev.selectedFileTypes.includes(ft)
        ? prev.selectedFileTypes.filter((t) => t !== ft)
        : [...prev.selectedFileTypes, ft],
    }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setState((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  }, []);

  const setDatePreset = useCallback((preset: ExploreFilterState["datePreset"]) => {
    setState((prev) => ({ ...prev, datePreset: preset }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setSortField = useCallback((field: SortField) => {
    setState((prev) => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field
        ? (prev.sortDirection === "asc" ? "desc" : "asc")
        : "desc",
    }));
  }, []);

  const setSortDirection = useCallback((dir: "asc" | "desc") => {
    setState((prev) => ({ ...prev, sortDirection: dir }));
  }, []);

  const removeFilter = useCallback((chip: ActiveExploreChip) => {
    setState((prev) => {
      switch (chip.type) {
        case "contentType":
          return { ...prev, contentTypes: prev.contentTypes.filter((t) => t !== chip.value) };
        case "domain":
          return { ...prev, selectedDomain: null, selectedSubTopics: [], selectedLeafTopics: [] };
        case "subTopic": {
          const newSubs = prev.selectedSubTopics.filter((s) => s !== chip.value);
          // Clear leaf topics belonging to the removed subtopic
          let newLeafs = prev.selectedLeafTopics;
          if (prev.selectedDomain) {
            const leavesOfRemoved = getLeafTopicsForDomainSubTopic(prev.selectedDomain, chip.value);
            const leafKeysToRemove = new Set(leavesOfRemoved.map((l) => l.key));
            newLeafs = prev.selectedLeafTopics.filter((lk) => !leafKeysToRemove.has(lk));
          }
          return { ...prev, selectedSubTopics: newSubs, selectedLeafTopics: newLeafs };
        }
        case "leafTopic":
          return { ...prev, selectedLeafTopics: prev.selectedLeafTopics.filter((l) => l !== chip.value) };
        case "authorType":
          return { ...prev, authorType: "all" };
        case "fileType":
          return { ...prev, selectedFileTypes: prev.selectedFileTypes.filter((t) => t !== chip.value) };
        case "tag":
          return { ...prev, selectedTags: prev.selectedTags.filter((t) => t !== chip.value) };
        case "date":
          return { ...prev, datePreset: "all" };
        case "search":
          return { ...prev, searchQuery: "" };
        default:
          return prev;
      }
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const applyPreset = useCallback((preset: Partial<ExploreFilterState>) => {
    setState({ ...DEFAULT_STATE, ...preset });
  }, []);

  return {
    filterState: state,
    sortedItems,
    filteredCount: filteredItems.length,
    totalCount: items.length,
    facetCounts,
    availableSubTopics,
    availableLeafTopics,
    activeFilterChips,
    hasActiveFilters,
    // Actions
    toggleContentType,
    setDomain,
    toggleSubTopic,
    toggleLeafTopic,
    setAuthorType,
    toggleFileType,
    toggleTag,
    setDatePreset,
    setSearchQuery,
    setSortField,
    setSortDirection,
    removeFilter,
    clearAllFilters,
    applyPreset,
  };
}
