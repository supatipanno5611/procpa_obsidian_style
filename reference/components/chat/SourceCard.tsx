"use client";

import type { Source } from "@/lib/rag-client";

const typeIcons: Record<string, { icon: string; color: string }> = {
  post: { icon: "article", color: "text-brand-post" },
  series: { icon: "library_books", color: "text-brand-series" },
  reference: { icon: "book", color: "text-brand-reference" },
  resource: { icon: "picture_as_pdf", color: "text-brand-reference" },
};

export function SourceCard({ source }: { source: Source }) {
  const { icon, color } = typeIcons[source.contentType] || typeIcons.post;

  return (
    <a
      href={source.slug}
      className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/50 px-3 py-2 text-xs hover:bg-muted transition-colors"
    >
      <span className={`material-symbols-outlined text-[16px] ${color}`}>
        {icon}
      </span>
      <span className="truncate text-foreground">{source.title}</span>
      <span className="material-symbols-outlined text-[14px] text-muted-foreground ml-auto shrink-0">
        open_in_new
      </span>
    </a>
  );
}
