import { cn } from "@/lib/utils";
import type { DomainConfig } from "@/lib/domains";

interface DomainSectionProps {
  domain: DomainConfig;
  count: number;
  gridCols?: string;
  children: React.ReactNode;
}

const accentStyles: Record<string, { bar: string; icon: string; badge: string }> = {
  blue: {
    bar: "bg-blue-500",
    icon: "text-blue-500",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  indigo: {
    bar: "bg-indigo-500",
    icon: "text-indigo-500",
    badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
};

export function DomainSection({
  domain,
  count,
  gridCols = "sm:grid-cols-2 lg:grid-cols-3",
  children,
}: DomainSectionProps) {
  const style = accentStyles[domain.accentColor] ?? accentStyles.blue;

  return (
    <section className="mb-12 last:mb-0">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={cn("w-1 h-8 rounded-full", style.bar)} />
        <span
          className={cn(
            "material-symbols-outlined text-[20px]",
            style.icon
          )}
        >
          {domain.icon}
        </span>
        <h2 className="text-lg font-bold text-foreground">{domain.label}</h2>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
            style.badge
          )}
        >
          {count}
        </span>
      </div>

      {/* Card grid */}
      <div className={cn("grid gap-4", gridCols)}>{children}</div>
    </section>
  );
}
