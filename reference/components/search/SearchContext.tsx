"use client";

import * as React from "react";

type SearchContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.key === "k" || e.key === "K" || e.code === "KeyK") &&
        (e.metaKey || e.ctrlKey)
      ) {
        e.preventDefault();
        if (!e.repeat) {
          setOpen((open) => !open);
        }
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const toggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <SearchContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
