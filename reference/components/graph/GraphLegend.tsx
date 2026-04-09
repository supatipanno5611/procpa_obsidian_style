import { cn } from "@/lib/utils";

const legendItems = [
  { label: "직접 작성", color: "bg-blue-500", group: 1 },
  { label: "시리즈", color: "bg-emerald-500", group: 2 },
  { label: "자료", color: "bg-purple-500", group: 3 },
  { label: "참고자료", color: "bg-amber-500", group: 4 },
];

interface GraphLegendProps {
  className?: string;
}

export function GraphLegend({ className }: GraphLegendProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4 text-xs text-muted-foreground", className)}>
      {legendItems.map((item) => (
        <div key={item.group} className="flex items-center gap-1.5">
          <span className={cn("h-2.5 w-2.5 rounded-full", item.color)} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
