import Link from "next/link";
import {
  getDomain,
  getTopic,
  getSubtopic,
  getAccentStyles,
  CATEGORY_META,
  CATEGORY_ORDER,
} from "@/lib/taxonomy";
import {
  getContentBySubtopic,
  getUniqueCategoriesForSubtopic,
  getContentByCategory,
  getStandardIdxCodesWithLabels,
} from "@/lib/content";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { buildBreadcrumbItems, type CategoryItem } from "./buildPathSegments";
import { FilterableContentSection, type ContentListItem } from "./FilterableContentSection";
import { cn } from "@/lib/utils";

interface SubtopicOverviewProps {
  domainKey: string;
  topicKey: string;
  subtopicKey: string;
}

export function SubtopicOverview({
  domainKey,
  topicKey,
  subtopicKey,
}: SubtopicOverviewProps) {
  const domain = getDomain(domainKey)!;
  const topic = getTopic(topicKey)!;
  const subtopic = getSubtopic(topicKey, subtopicKey)!;
  const accent = getAccentStyles(domainKey);
  const content = getContentBySubtopic(topicKey, subtopicKey);

  // Category items for Lv4 card grid
  const categories = getUniqueCategoriesForSubtopic(topicKey, subtopicKey);
  const categoryItems: CategoryItem[] = categories
    .map((cat) => {
      const catContent = getContentByCategory(topicKey, subtopicKey, cat);
      const meta = CATEGORY_META[cat];
      return {
        key: cat,
        label: meta?.label || cat,
        icon: meta?.icon,
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

  // standard_idx code items for Code View grid
  const codeItems = getStandardIdxCodesWithLabels(topicKey, subtopicKey);

  const breadcrumbItems = buildBreadcrumbItems({
    domainKey,
    topicKey,
    subtopicKey,
  });

  // Build content list items for FilterableContentSection
  const listItems: ContentListItem[] = content.map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description || c.excerpt || "",
    date: c.date,
    tags: c.tags,
    contentCategory: c.contentCategory,
    authorType: c.authorType,
    isSeries: c.isSeries,
  }));

  return (
    <div>
      {/* Full-width main content (no sidebar at Lv3) */}
      <main className="pb-20">
        <div className="pt-2 pb-12 px-6 md:px-8 max-w-5xl mx-auto">
          {/* Breadcrumbs with dropdown navigation */}
          <Breadcrumbs items={breadcrumbItems} sticky />

          {/* Hero */}
          <div className="flex items-center gap-4 mb-4 mt-6">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl",
                accent.badge
              )}
            >
              <span className="material-symbols-outlined text-[32px]">
                subdirectory_arrow_right
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                {subtopic.label}
              </h1>
              {subtopic.labelEn && (
                <p className="text-lg text-muted-foreground mt-1">
                  {subtopic.labelEn}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-16 mt-12">
            {/* Lv4 Category Grid */}
            {categoryItems.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">
                    category
                  </span>
                  카테고리별 분류
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryItems.map((item) => (
                    <Link
                      key={item.key}
                      href={`/${domainKey}/${topicKey}/${subtopicKey}/${item.key}`}
                      className="group flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.icon && (
                          <span className="material-symbols-outlined text-[20px] text-muted-foreground group-hover:text-primary transition-colors">
                            {item.icon}
                          </span>
                        )}
                        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-xs text-muted-foreground">
                          {item.count}건
                        </span>
                        <span className="material-symbols-outlined text-[16px] text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                          chevron_right
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 기준서별 분류 — Code View 페이지 링크 */}
            {codeItems.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">
                    menu_book
                  </span>
                  기준서별 분류
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {codeItems.map((item) => (
                    <Link
                      key={item.code}
                      href={`/${domainKey}/${topicKey}/${subtopicKey}/by-code/${item.code}`}
                      className="group flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-xs text-muted-foreground">
                          {item.count}건
                        </span>
                        <span className="material-symbols-outlined text-[16px] text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                          chevron_right
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Filterable Content */}
            <FilterableContentSection
              items={listItems}
              maxItems={10}
              seeAllHref={`/explore?topic=${topicKey}&subtopic=${subtopicKey}`}
              accentColor={domain.accentColor}
              sectionTitle="콘텐츠"
              sectionIcon="article"
            />

            {/* Empty State */}
            {content.length === 0 && (
              <div className="text-center py-20 text-muted-foreground border border-border/60 rounded-2xl bg-muted/10">
                <span className="material-symbols-outlined text-5xl opacity-30">
                  inbox
                </span>
                <p className="mt-4 font-medium">아직 이 주제에 대한 콘텐츠가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
