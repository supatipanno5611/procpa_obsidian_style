import Link from "next/link";
import {
  getTopic,
  getDomain,
  getAccentStyles,
} from "@/lib/taxonomy";
import {
  getAllContentByTopic,
  getContentByTopic,
  getPostsByTopic,
} from "@/lib/content";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { buildBreadcrumbItems } from "./buildPathSegments";
import { FilterableContentSection, type ContentListItem } from "./FilterableContentSection";
import { cn } from "@/lib/utils";

interface TopicOverviewProps {
  domainKey: string;
  topicKey: string;
}

export function TopicOverview({ domainKey, topicKey }: TopicOverviewProps) {
  const domain = getDomain(domainKey)!;
  const topic = getTopic(topicKey)!;
  const accent = getAccentStyles(domainKey);

  const { posts, seriesList, referencesList, resourcesList } =
    getAllContentByTopic(topicKey);
  const topicContent = getContentByTopic(topicKey);

  const totalContent =
    posts.length +
    seriesList.length +
    referencesList.length +
    resourcesList.length;

  // Subtopic child counts
  const subTopicCounts = topic.subtopics.map((sub) => ({
    key: sub.key,
    label: sub.label,
    labelEn: sub.labelEn,
    count: getPostsByTopic(topicKey, sub.key).length,
  }));

  const breadcrumbItems = buildBreadcrumbItems({ domainKey, topicKey });

  // Build content list items for FilterableContentSection
  const listItems: ContentListItem[] = topicContent.map((c) => ({
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
      {/* Full-width main content (no sidebar at Lv2) */}
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
                {topic.icon || domain.icon}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                {topic.label}
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                {topic.labelEn}
              </p>
            </div>
          </div>

          <div className="space-y-16 mt-8">
            {/* Subtopics Grid */}
            {subTopicCounts.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">
                    grid_view
                  </span>
                  세부분류
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {subTopicCounts.map((sub) => (
                    <Link
                      key={sub.key}
                      href={`/${domainKey}/${topicKey}/${sub.key}`}
                      className="group flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {sub.label}
                        </h3>
                        {sub.labelEn && (
                          <p className="text-muted-foreground text-xs mt-0.5">
                            {sub.labelEn}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-xs text-muted-foreground">
                          {sub.count}건
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
              maxItems={4}
              seeAllHref={`/explore?topic=${topicKey}`}
              accentColor={domain.accentColor}
              sectionTitle="콘텐츠"
              sectionIcon="article"
            />

            {/* Empty State */}
            {totalContent === 0 && (
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
