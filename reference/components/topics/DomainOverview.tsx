import Link from "next/link";
import {
  getDomain,
  getAccentStyles,
} from "@/lib/taxonomy";
import {
  getContentByDomain,
  getContentByTopic,
} from "@/lib/content";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { buildBreadcrumbItems } from "./buildPathSegments";
import { FilterableContentSection, type ContentListItem } from "./FilterableContentSection";
import { cn } from "@/lib/utils";

interface DomainOverviewProps {
  domainKey: string;
}

export function DomainOverview({ domainKey }: DomainOverviewProps) {
  const domain = getDomain(domainKey)!;
  const domainContent = getContentByDomain(domainKey);
  const accent = getAccentStyles(domainKey);

  const breadcrumbItems = buildBreadcrumbItems({ domainKey });

  // Build content list items for FilterableContentSection
  const listItems: ContentListItem[] = domainContent.map((c) => ({
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
      {/* Full-width main content (no sidebar at Lv1) */}
      <main className="pb-20">
        <div className="pt-2 pb-12 px-6 md:px-8 max-w-5xl mx-auto">
          {/* Breadcrumbs with dropdown navigation */}
          <Breadcrumbs items={breadcrumbItems} sticky />

          {/* Hero */}
          <div className="flex items-center gap-4 mb-12 mt-6">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl",
                accent.badge
              )}
            >
              <span className="material-symbols-outlined text-[32px]">
                {domain.icon}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                {domain.label}
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                {domain.labelEn}
              </p>
            </div>
          </div>

          {/* Intro Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mb-12">
            {domain.description}
          </p>

          <div className="space-y-16">
            {/* Topics Grid */}
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px]">
                  grid_view
                </span>
                주제
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {domain.topics.map((topic) => {
                  const topicContent = getContentByTopic(topic.key);
                  return (
                    <Link
                      key={topic.key}
                      href={`/${domainKey}/${topic.key}`}
                      className="group flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {topic.icon && (
                          <span className="material-symbols-outlined text-[20px] text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                            {topic.icon}
                          </span>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                            {topic.label}
                          </h3>
                          {topic.labelEn && (
                            <p className="text-muted-foreground text-xs mt-0.5">
                              {topic.labelEn}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-xs text-muted-foreground">
                          {topicContent.length}건
                        </span>
                        <span className="material-symbols-outlined text-[16px] text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                          chevron_right
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Filterable Content */}
            <FilterableContentSection
              items={listItems}
              maxItems={4}
              seeAllHref={`/explore?domain=${domainKey}`}
              accentColor={domain.accentColor}
              sectionTitle="콘텐츠"
              sectionIcon="article"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
