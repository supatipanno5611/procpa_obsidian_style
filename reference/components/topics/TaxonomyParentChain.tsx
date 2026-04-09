import Link from "next/link";
import { getAccentStyles } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

interface ParentChainItem {
  label: string;
  icon?: string;
  href: string;
}

interface TaxonomyParentChainProps {
  items: ParentChainItem[];
  accentColor: string;
}

export function TaxonomyParentChain({
  items,
  accentColor,
}: TaxonomyParentChainProps) {
  const accent = getAccentStyles(accentColor);

  if (items.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 mb-3">
      {items.map((item, idx) => (
        <div key={item.href} className="flex items-center gap-1.5">
          <Link
            href={item.href}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors hover:opacity-80",
              accent.badge
            )}
          >
            {item.icon && (
              <span className="material-symbols-outlined text-[14px]">
                {item.icon}
              </span>
            )}
            {item.label}
          </Link>
          {idx < items.length - 1 && (
            <span className="material-symbols-outlined text-[14px] text-muted-foreground/50">
              chevron_right
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
