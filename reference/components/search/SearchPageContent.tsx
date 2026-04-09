"use client";

import { useEffect, useRef } from "react";

export function SearchPageContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Pagefind UI integration
    async function loadPagefind() {
      try {
        // @ts-ignore
        const pagefind = await import(/* webpackIgnore: true */ "/pagefind/pagefind-ui.js");
        // @ts-ignore
        new pagefind.PagefindUI({
          element: containerRef.current,
          showSubResults: true,
          showImages: false,
        });
      } catch {
        // Pagefind not available (dev mode)
      }
    }
    loadPagefind();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Search</h1>
      <div ref={containerRef} />
    </div>
  );
}
