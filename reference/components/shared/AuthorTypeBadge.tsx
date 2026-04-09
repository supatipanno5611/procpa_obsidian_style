import { cn } from "@/lib/utils";
import { Pen, BookMarked } from "lucide-react";

interface AuthorTypeBadgeProps {
  authorType: "original" | "reference";
  className?: string;
}

export function AuthorTypeBadge({ authorType, className }: AuthorTypeBadgeProps) {
  const isOriginal = authorType === "original";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        isOriginal
          ? "bg-brand-post/10 text-brand-post border border-brand-post/20"
          : "bg-brand-warning/10 text-brand-warning border border-brand-warning/20",
        className
      )}
    >
      {isOriginal ? (
        <Pen className="h-3 w-3" />
      ) : (
        <BookMarked className="h-3 w-3" />
      )}
      {isOriginal ? "직접 작성" : "참고자료"}
    </span>
  );
}
