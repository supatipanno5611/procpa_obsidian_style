import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, FileText, BookOpen, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentType } from "@/lib/graph";

interface ConnectionItem {
  slug: string;
  title: string;
  type: ContentType;
}

interface BacklinkItem {
  slug: string;
  title: string;
  description?: string;
}

interface KnowledgeConnectionsProps {
  outlinks: ConnectionItem[];
  backlinks: BacklinkItem[];
}

function getTypeIcon(type: ContentType) {
  switch (type) {
    case "Post": return FileText;
    case "Series": return BookOpen;
    case "Reference": return BookOpen;
    case "Resource": return Download;
    default: return FileText;
  }
}

function getTypeColor(type: ContentType) {
  switch (type) {
    case "Post": return "text-brand-post";
    case "Series": return "text-brand-series";
    case "Reference": return "text-brand-reference";
    case "Resource": return "text-brand-warning";
    default: return "text-muted-foreground";
  }
}

export function KnowledgeConnections({ outlinks, backlinks }: KnowledgeConnectionsProps) {
  if (outlinks.length === 0 && backlinks.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border/50 pt-10">
      <h2 className="text-xl font-bold mb-6">Knowledge Connections</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Outlinks */}
        {outlinks.length > 0 && (
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              <ArrowUpRight className="h-4 w-4" />
              Outgoing Links ({outlinks.length})
            </h3>
            <div className="space-y-2">
              {outlinks.map((item) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <Link
                    key={item.slug}
                    href={`/${item.slug}`}
                    className="group flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3 hover:border-primary/50 hover:bg-card transition-all"
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", getTypeColor(item.type))} />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="ml-auto text-[10px] text-muted-foreground uppercase">
                      {item.type}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Backlinks */}
        {backlinks.length > 0 && (
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              <ArrowDownLeft className="h-4 w-4" />
              Backlinks ({backlinks.length})
            </h3>
            <div className="space-y-2">
              {backlinks.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="group flex flex-col gap-1 rounded-lg border border-border/50 bg-card/50 px-4 py-3 hover:border-primary/50 hover:bg-card transition-all"
                >
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    {item.title}
                  </span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {item.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
