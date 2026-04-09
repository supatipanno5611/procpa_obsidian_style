import Link from "next/link";
import { FileSpreadsheet, FileText, Code, Archive, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Resource } from "@/lib/content";
import { getTopicLabel } from "@/lib/taxonomy";

interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

const fileTypeIcons: Record<string, React.ElementType> = {
  excel: FileSpreadsheet,
  pdf: FileText,
  code: Code,
  zip: Archive,
  other: File,
};

const fileTypeColors: Record<string, string> = {
  excel: "text-emerald-500",
  pdf: "text-red-500",
  code: "text-blue-500",
  zip: "text-amber-500",
  other: "text-muted-foreground",
};

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const ft = resource.fileType ?? "other";
  const Icon = fileTypeIcons[ft] || File;
  const iconColor = fileTypeColors[ft] || "text-muted-foreground";
  const topicLabel = getTopicLabel(resource.taxonomy_lv2 || "");

  return (
    <Link
      href={`/${resource.slug}`}
      className={cn(
        "group flex items-start gap-4 rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg",
        className
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/50 group-hover:bg-primary/10 transition-colors">
        <Icon className={cn("h-6 w-6", iconColor)} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
          {resource.title}
        </h3>
        {resource.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {resource.description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-2">
          {topicLabel && (
            <Badge variant="outline" className="text-[10px]">
              {topicLabel}
            </Badge>
          )}
          {resource.fileSize && (
            <span className="text-[10px] text-muted-foreground">{resource.fileSize}</span>
          )}
          <span className="text-[10px] text-muted-foreground uppercase">
            {resource.fileType}
          </span>
        </div>
      </div>
    </Link>
  );
}
