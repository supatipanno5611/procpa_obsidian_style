import {
  getDomain,
  getTopic,
  getSubtopic,
  getAccentStyles,
  CATEGORY_META,
  CATEGORY_ORDER,
} from "@/lib/taxonomy";
import { getContentByStandardIdx } from "@/lib/content";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { buildBreadcrumbItems } from "./buildPathSegments";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CodeViewProps {
  domainKey: string;
  topicKey: string;
  subtopicKey: string;
  code: string;
}

/**
 * 방안 B: Code view page for standard_idx-based browsing.
 * URL: /business/accounting/ifrs/by-code/1115
 * Shows all content matching a specific standard_idx code,
 * grouped by contentCategory.
 */
export function CodeView({
  domainKey,
  topicKey,
  subtopicKey,
  code,
}: CodeViewProps) {
  const domain = getDomain(domainKey)!;
  const topic = getTopic(topicKey)!;
  const subtopic = getSubtopic(topicKey, subtopicKey)!;
  const accent = getAccentStyles(domainKey);
  const { series, posts } = getContentByStandardIdx(code);

  // Find series index for label
  const seriesIndex = series.find((s) => s.index);
  const label = seriesIndex?.title || `K-IFRS ${code}`;

  // Breadcrumbs: domain > topic > subtopic (no Lv4 dropdown for code view)
  const breadcrumbItems = buildBreadcrumbItems({
    domainKey,
    topicKey,
    subtopicKey,
  });

  // Merge series + posts
  const allContent = [...series, ...posts];

  // Group by contentCategory
  const grouped = new Map<string, typeof allContent>();
  for (const item of allContent) {
    const cat = item.contentCategory || "etc";
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(item);
  }

  // Sort categories
  const sortedCategories = [...grouped.keys()].sort((a, b) => {
    if (a === "etc") return 1;
    if (b === "etc") return -1;
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div>
      <main className="pb-20">
        <div className="pt-2 pb-12 px-6 md:px-8 max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} sticky />

          {/* Hero */}
          <div className="flex items-center gap-4 mb-8 mt-6">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl",
                accent.badge
              )}
            >
              <span className="material-symbols-outlined text-[32px]">
                menu_book
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                {label}
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                {code} &middot; {allContent.length}건
              </p>
            </div>
          </div>

          {/* Back link */}
          <Link
            href={`/${domainKey}/${topicKey}/${subtopicKey}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>
            {subtopic.label}(으)로 돌아가기
          </Link>

          <div className="space-y-8">
            {/* Category sections */}
            {sortedCategories.map((cat) => {
              const catItems = grouped.get(cat)!;
              const meta = CATEGORY_META[cat] || { label: cat, icon: "article" };
              return (
                <section key={cat}>
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-muted-foreground">
                      {meta.icon}
                    </span>
                    {meta.label}
                    <span className="text-xs text-muted-foreground font-normal bg-muted/50 px-2 py-0.5 rounded-full">
                      {catItems.length}건
                    </span>
                  </h2>
                  <div className="space-y-2">
                    {catItems
                      .sort((a, b) => {
                        if (a.isSeries && a.index) return -1;
                        if (b.isSeries && b.index) return 1;
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                      })
                      .map((c) => (
                        <Link
                          key={c.slug}
                          href={`/${c.slug}`}
                          className="group flex items-start gap-3 rounded-lg border border-border/60 bg-card px-4 py-3 hover:border-primary/40 hover:shadow-sm transition-all"
                        >
                          <span className="material-symbols-outlined text-[18px] text-muted-foreground mt-0.5 shrink-0">
                            {c.isSeries ? "collections_bookmark" : "article"}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {c.title}
                            </h3>
                            {(c.description || c.excerpt) && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {c.description || c.excerpt}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                            {new Date(c.date).toLocaleDateString("ko-KR")}
                          </span>
                        </Link>
                      ))}
                  </div>
                </section>
              );
            })}

            {/* Empty State */}
            {allContent.length === 0 && (
              <div className="text-center py-20 text-muted-foreground border rounded-2xl bg-muted/10">
                <span className="material-symbols-outlined text-5xl opacity-30">inbox</span>
                <p className="mt-4 font-medium">아직 이 기준서에 대한 자료가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
