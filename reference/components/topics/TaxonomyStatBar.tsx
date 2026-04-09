import { getAccentStyles } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  icon: string;
  count: number;
}

interface TaxonomyStatBarProps {
  stats: StatItem[];
  accentColor: string;
}

export function TaxonomyStatBar({
  stats,
  accentColor,
}: TaxonomyStatBarProps) {
  const accent = getAccentStyles(accentColor);

  const visibleStats = stats.filter((s) => s.count > 0);
  if (visibleStats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {visibleStats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-xl border px-4 py-3.5 text-center",
            accent.statBg
          )}
        >
          <span className="material-symbols-outlined text-[20px] opacity-60">
            {stat.icon}
          </span>
          <span className="text-xs text-muted-foreground">{stat.label}</span>
          <span className="text-lg font-bold tabular-nums">{stat.count}</span>
        </div>
      ))}
    </div>
  );
}
