"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavDropdownItem {
  label: string;
  href: string;
  icon?: string;
}

interface NavDropdownProps {
  label: string;
  items: NavDropdownItem[];
  isActive: boolean;
  className?: string;
}

export function NavDropdown({ label, items, isActive, className }: NavDropdownProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open]);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <div
      ref={menuRef}
      className={cn("relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "relative flex items-center gap-0.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
          isActive
            ? "text-primary font-semibold"
            : "text-muted-foreground hover:text-primary"
        )}
      >
        {label}
        <span
          className={cn(
            "material-symbols-outlined text-[14px] transition-transform duration-200",
            open && "rotate-180"
          )}
        >
          expand_more
        </span>
        {isActive && (
          <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50">
          <div className="w-48 rounded-xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-xl p-1.5">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname.startsWith(item.href)
                    ? "text-primary bg-primary/5 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {item.icon && (
                  <span className="material-symbols-outlined text-[16px]">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
