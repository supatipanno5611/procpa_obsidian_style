"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbSibling {
  label: string;
  href: string;
  icon?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  /** Sibling items for dropdown navigation. If provided and length > 1, shows a dropdown arrow. */
  siblings?: BreadcrumbSibling[];
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Make the breadcrumb bar sticky below the header */
  sticky?: boolean;
}

function BreadcrumbDropdown({
  item,
  isLast,
  position,
}: {
  item: BreadcrumbItem;
  isLast: boolean;
  position: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const hasSiblings = item.siblings && item.siblings.length > 1;

  return (
    <div ref={ref} className="relative inline-flex items-center">
      {/* Label: link or plain text */}
      {item.href && !isLast ? (
        <Link
          href={item.href}
          className="hover:text-primary transition-colors"
          itemProp="item"
        >
          <span itemProp="name">{item.label}</span>
        </Link>
      ) : (
        <span
          className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none"
          itemProp="name"
        >
          {item.label}
        </span>
      )}

      {/* Dropdown toggle */}
      {hasSiblings && (
        <button
          onClick={() => setOpen(!open)}
          className="ml-0.5 p-0.5 rounded hover:bg-muted/60 transition-colors"
          aria-label="형제 항목 보기"
        >
          <span
            className={cn(
              "material-symbols-outlined text-[14px] text-muted-foreground/60 transition-transform duration-200",
              open && "rotate-180"
            )}
          >
            expand_more
          </span>
        </button>
      )}

      {/* Dropdown menu */}
      {open && hasSiblings && (
        <div className="absolute left-0 top-full mt-1 z-50">
          <div className="w-48 rounded-xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-xl p-1.5">
            {item.siblings!.map((sib) => (
              <Link
                key={sib.href}
                href={sib.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  sib.href === item.href
                    ? "text-primary bg-primary/5 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {sib.icon && (
                  <span className="material-symbols-outlined text-[16px]">
                    {sib.icon}
                  </span>
                )}
                {sib.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <meta itemProp="position" content={String(position)} />
    </div>
  );
}

export function Breadcrumbs({ items, sticky = false }: BreadcrumbsProps) {
  // Build full list with Home prepended
  const allItems: BreadcrumbItem[] = [{ label: "Home", href: "/" }, ...items];

  return (
    <nav
      className={cn(
        "flex items-center gap-1.5 text-sm text-muted-foreground",
        sticky
          ? "sticky top-16 z-40 border-b border-border/50 bg-background/90 backdrop-blur-md py-2.5"
          : "mb-8"
      )}
      aria-label="Breadcrumb"
    >
      <ol
        className={cn(
          "flex items-center gap-1.5 list-none p-0 m-0",
          sticky && "w-full"
        )}
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {allItems.map((item, i) => {
          const isLast = i === allItems.length - 1;
          return (
            <li
              key={i}
              className="flex items-center gap-1.5"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {i > 0 && (
                <ChevronRight
                  className="h-3 w-3 shrink-0 text-muted-foreground/50"
                  aria-hidden
                />
              )}
              <BreadcrumbDropdown
                item={item}
                isLast={isLast}
                position={i + 1}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
