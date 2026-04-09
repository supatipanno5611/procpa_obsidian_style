import {
  getDomain,
  getTopic,
  getSubtopic,
  getAccentStyles,
  CATEGORY_META,
  CATEGORY_ORDER,
} from "@/lib/taxonomy";
import {
  getContentByCategory,
  getUniqueCategoriesForSubtopic,
} from "@/lib/content";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { buildBreadcrumbItems, type CategoryItem } from "./buildPathSegments";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CategoryHubProps {
  domainKey: string;
  topicKey: string;
  subtopicKey: string;
  categoryKey: string;
}

export function CategoryHub({
  domainKey,
  topicKey,
  subtopicKey,
  categoryKey,
}: CategoryHubProps) {
  const domain = getDomain(domainKey)!;
  const topic = getTopic(topicKey)!;
  const subtopic = getSubtopic(topicKey, subtopicKey)!;
  const accent = getAccentStyles(domainKey);
  const meta = CATEGORY_META[categoryKey] || { label: categoryKey, icon: "article" };

  // Get content for this category
  const content = getContentByCategory(topicKey, subtopicKey, categoryKey);

  // Build category items for breadcrumb dropdown
  const allCategories = getUniqueCategoriesForSubtopic(topicKey, subtopicKey);
  const categoryItems: CategoryItem[] = allCategories
    .map((cat) => {
      const catContent = getContentByCategory(topicKey, subtopicKey, cat);
      const catMeta = CATEGORY_META[cat];
      return {
        key: cat,
        label: catMeta?.label || cat,
        icon: catMeta?.icon,
        count: catContent.length,
      };
    })
    .sort((a, b) => {
      if (a.key === "etc") return 1;
      if (b.key === "etc") return -1;
      const ai = CATEGORY_ORDER.indexOf(a.key);
      const bi = CATEGORY_ORDER.indexOf(b.key);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

  const breadcrumbItems = buildBreadcrumbItems({
    domainKey,
    topicKey,
    subtopicKey,
    activeCategory: categoryKey,
    categoryItems,
  });

  return (
    <div>
      <main className="pb-20">
        <div className="pt-2 pb-12 px-6 md:px-8 max-w-5xl mx-auto">
          {/* Breadcrumbs with dropdown navigation */}
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
                {meta.icon}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                {meta.label}
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                {subtopic.label} &middot; {content.length}건
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-8">
            {/* Content list */}
            {content
              .sort((a, b) => {
                // Series index first, then by date desc
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

            {/* Empty State */}
            {content.length === 0 && (
              <div className="text-center py-20 text-muted-foreground border rounded-2xl bg-muted/10">
                <span className="material-symbols-outlined text-5xl opacity-30">inbox</span>
                <p className="mt-4 font-medium">아직 이 카테고리에 대한 자료가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
