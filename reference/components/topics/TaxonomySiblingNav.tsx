import Link from "next/link";
import { getAccentStyles } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

interface SiblingNavItem {
  key: string;
  label: string;
  icon?: string;
  href: string;
  count?: number;
}

interface TaxonomySiblingNavProps {
  items: SiblingNavItem[];
  activeKey: string;
  accentColor: string;
}

export function TaxonomySiblingNav({
  items,
  activeKey,
  accentColor,
}: TaxonomySiblingNavProps) {
  const accent = getAccentStyles(accentColor);

  if (items.length <= 1) return null;

  return (
    <nav className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3 sm:flex-wrap">
      {items.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? accent.badge
                : "border-border/50 bg-muted/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {item.icon && (
              <span className="material-symbols-outlined text-[16px]">
                {item.icon}
              </span>
            )}
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  "text-[11px]",
                  isActive ? "opacity-70" : "opacity-50"
                )}
              >
                ({item.count})
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
