import Link from "next/link";
import { cn } from "@/lib/utils";
import { getTopicLabel } from "@/lib/taxonomy";
import { getTopicBadgeClasses } from "@/lib/domains";
import { highlightText } from "@/lib/search-utils";

interface ResourceItem {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  topic: string;
  date: string;
  fileType: string;
  fileSize?: string;
}

interface ResourceListCardProps {
  resource: ResourceItem;
  searchQuery?: string;
  className?: string;
}

const fileTypeConfig: Record<
  string,
  { icon: string; color: string; bgColor: string; label: string }
> = {
  excel: {
    icon: "table_chart",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    label: "Excel",
  },
  pdf: {
    icon: "picture_as_pdf",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "PDF",
  },
  code: {
    icon: "code",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    label: "Code",
  },
  zip: {
    icon: "folder_zip",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    label: "ZIP",
  },
  other: {
    icon: "description",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    label: "File",
  },
};

export function ResourceListCard({
  resource,
  searchQuery,
  className,
}: ResourceListCardProps) {
  const topicLabel = getTopicLabel(resource.topic);
  const ft = fileTypeConfig[resource.fileType] ?? fileTypeConfig.other;
  const q = searchQuery || "";

  return (
    <Link
      href={`/${resource.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-brand-warning/40 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex flex-1 gap-4 p-5">
        {/* File type icon */}
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
            ft.bgColor
          )}
        >
          <span className={cn("material-symbols-outlined text-[24px]", ft.color)}>
            {ft.icon}
          </span>
        </div>

        <div className="flex flex-1 flex-col min-w-0">
          {/* Topic badge + file type + date */}
          <div className="flex items-center gap-2 mb-2">
            <span className={cn("inline-flex items-center rounded text-[10px] px-2 py-0.5 font-bold uppercase tracking-wide", getTopicBadgeClasses(resource.topic))}>
              {topicLabel}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase">
              {ft.label}
            </span>
            <time className="ml-auto text-[11px] text-muted-foreground tabular-nums">
              {new Date(resource.date).toLocaleDateString("ko-KR")}
            </time>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-foreground group-hover:text-brand-warning transition-colors line-clamp-1 mb-1">
            {highlightText(resource.title, q)}
          </h3>

          {/* Description */}
          {(resource.description || resource.excerpt) && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {highlightText(resource.description || resource.excerpt || "", q)}
            </p>
          )}

          {/* Footer: download indicator + file size */}
          <div className="mt-auto pt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium group-hover:text-brand-warning transition-colors">
              <span className="material-symbols-outlined text-[14px]">
                download
              </span>
              다운로드
            </span>
            {resource.fileSize && (
              <span className="text-muted-foreground/70">{resource.fileSize}</span>
            )}
          </div>
        </div>
      </div>

      {/* Decorative icon */}
      <span
        className="material-symbols-outlined absolute bottom-3 right-3 text-[48px] text-brand-warning/[0.07] select-none pointer-events-none"
        style={{ fontVariationSettings: "'opsz' 48" }}
      >
        folder_zip
      </span>
    </Link>
  );
}
