"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchButton } from "@/components/search/SearchButton";
import { useSearch } from "@/components/search/SearchContext";
import { NavDropdown } from "./NavDropdown";
import { TAXONOMY } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

const businessDomain = TAXONOMY[0];
const techDomain = TAXONOMY[1];

const businessItems = businessDomain.topics.map((t) => ({
  label: t.label,
  href: `/business/${t.key}`,
  icon: t.icon,
}));

const techItems = techDomain.topics.map((t) => ({
  label: t.label,
  href: `/tech/${t.key}`,
  icon: t.icon,
}));

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setOpen } = useSearch();

  const isBusiness = pathname.startsWith("/business");
  const isTech = pathname.startsWith("/tech");
  const isExplore =
    pathname.startsWith("/explore") ||
    pathname === "/post" ||
    pathname === "/series" ||
    pathname === "/reference" ||
    pathname === "/resource";

  return (
    <>
      {/* 개발 중 알림 배너 */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-2.5 text-center text-xs sm:text-sm font-medium text-primary flex items-center justify-center gap-2 lg:px-8">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        <span className="leading-tight">현재 사이트는 <strong>개발 및 리뉴얼</strong>이 진행 중입니다. 일부 기능 이용이 원활하지 않을 수 있으며, 모든 콘텐츠는 예시입니다.</span>
      </div>

      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl transition-colors">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            PROCPA
            <span className="rounded bg-primary/10 border border-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary leading-none tracking-wider mt-0.5">
              BETA
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center md:flex">
            {/* 홈 */}
            <Link
              href="/"
              className={cn(
                "relative rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                pathname === "/"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              홈
              {pathname === "/" && (
                <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              )}
            </Link>

            <div className="mx-1.5 h-4 w-px bg-border" />

            {/* 회계실무 */}
            <NavDropdown
              label="회계실무"
              items={businessItems}
              isActive={isBusiness}
            />

            <div className="mx-1.5 h-4 w-px bg-border" />

            {/* AI/생산성 */}
            <NavDropdown
              label="AI/생산성"
              items={techItems}
              isActive={isTech}
            />

            <div className="mx-1.5 h-4 w-px bg-border" />

            {/* 탐색 */}
            <Link
              href="/explore"
              className={cn(
                "relative rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                isExplore
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              탐색
              {isExplore && (
                <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              )}
            </Link>

            {/* Right side: Search, Theme */}
            <div className="ml-3 flex items-center gap-2">
              <SearchButton onClick={() => setOpen(true)} />
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <SearchButton onClick={() => setOpen(true)} />
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
              aria-label="메뉴 토글"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="border-t border-border/50 bg-background/90 backdrop-blur-2xl px-6 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {/* 홈 */}
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === "/"
                    ? "bg-accent/50 text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                홈
              </Link>

              {/* 회계실무 */}
              <div className="mt-2">
                <Link
                  href="/business"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isBusiness
                      ? "bg-accent/50 text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <span className="material-symbols-outlined text-[16px]">account_balance</span>
                  회계실무
                </Link>
                <div className="ml-4 mt-0.5 flex flex-col">
                  {businessItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                        pathname.startsWith(item.href)
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      {item.icon && (
                        <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                      )}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* AI/생산성 */}
              <div className="mt-2">
                <Link
                  href="/tech"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isTech
                      ? "bg-accent/50 text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                  AI/생산성
                </Link>
                <div className="ml-4 mt-0.5 flex flex-col">
                  {techItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                        pathname.startsWith(item.href)
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      {item.icon && (
                        <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                      )}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* 탐색 */}
              <div className="mt-2">
                <Link
                  href="/explore"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isExplore
                      ? "bg-accent/50 text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <span className="material-symbols-outlined text-[16px]">explore</span>
                  탐색
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
