"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "explore-prefs";

export type ViewMode = "table" | "card";
export type GroupByField = "none" | "domain" | "topic" | "contentType";

interface ExplorePrefs {
  viewMode: ViewMode;
  groupBy: GroupByField;
}

const DEFAULT_PREFS: ExplorePrefs = {
  viewMode: "table",
  groupBy: "none",
};

const VALID_GROUP_BY: GroupByField[] = ["none", "domain", "topic", "contentType"];

function loadPrefs(): ExplorePrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    return {
      viewMode: parsed.viewMode === "card" ? "card" : "table",
      groupBy: VALID_GROUP_BY.includes(parsed.groupBy) ? parsed.groupBy : "none",
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(prefs: ExplorePrefs) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // silent fail
  }
}

export function useExplorePrefs() {
  const [prefs, setPrefs] = useState<ExplorePrefs>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setPrefs(loadPrefs());
    setHydrated(true);
  }, []);

  // Save to localStorage on change (skip initial mount)
  useEffect(() => {
    if (hydrated) {
      savePrefs(prefs);
    }
  }, [prefs, hydrated]);

  const setViewMode = useCallback((mode: ViewMode) => {
    setPrefs((prev) => ({ ...prev, viewMode: mode }));
  }, []);

  const setGroupBy = useCallback((field: GroupByField) => {
    setPrefs((prev) => ({ ...prev, groupBy: field }));
  }, []);

  return {
    viewMode: prefs.viewMode,
    groupBy: prefs.groupBy,
    groupByDomain: prefs.groupBy === "domain",
    setViewMode,
    setGroupBy,
    hydrated,
  };
}
