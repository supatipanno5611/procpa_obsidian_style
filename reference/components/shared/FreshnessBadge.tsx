import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { RefreshCw } from "lucide-react";

interface FreshnessBadgeProps {
  updated?: string;
}

export function FreshnessBadge({ updated }: FreshnessBadgeProps) {
  if (!updated) return null;

  const formattedDate = format(new Date(updated), "yyyy.MM.dd", { locale: ko });

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <RefreshCw className="h-3 w-3" />
      <span>최근 검토: {formattedDate}</span>
    </span>
  );
}
