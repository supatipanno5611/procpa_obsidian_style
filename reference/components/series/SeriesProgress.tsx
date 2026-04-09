import { cn } from "@/lib/utils";

interface SeriesProgressProps {
  current: number;
  total: number;
  percentage: number;
  className?: string;
}

export function SeriesProgress({ current, total, percentage, className }: SeriesProgressProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>진행률</span>
        <span className="font-medium text-foreground">{current} / {total}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-right text-[10px] text-muted-foreground">{percentage}% 완료</p>
    </div>
  );
}
