import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { Content } from "@/lib/content";
import { getTopicLabel, getSubtopicLabel, getDomainForTopic, getDomainLabel } from "@/lib/taxonomy";
import { Badge } from "@/components/ui/Badge";
import { Clock, Tag } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { getBacklinks, getOutlinks, getLocalGraphData } from "@/lib/graph";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import type { BreadcrumbItem } from "@/components/shared/Breadcrumbs";
import { AuthorTypeBadge } from "@/components/shared/AuthorTypeBadge";
import { FreshnessBadge } from "@/components/shared/FreshnessBadge";
import { KnowledgeConnections } from "@/components/blog/KnowledgeConnections";
import { SourceMetadataSidebar } from "@/components/blog/SourceMetadataSidebar";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { MobileTocSheet } from "@/components/blog/MobileTocSheet";

import { LocalGraphView } from "@/components/graph/LocalGraphView";

// ─── TocEntry → flat TocItem converter ───
interface TocEntry {
  title: string;
  url: string;
  items: TocEntry[];
}

interface TocItem {
  title: string;
  url: string;
  depth: number;
}

function flattenToc(entries: TocEntry[], depth = 2): TocItem[] {
  const result: TocItem[] = [];
  for (const entry of entries) {
    result.push({ title: entry.title, url: entry.url, depth });
    if (entry.items?.length) {
      result.push(...flattenToc(entry.items, depth + 1));
    }
  }
  return result;
}

interface ContentDetailProps {
  content: Content;
}

export function ContentDetail({ content }: ContentDetailProps) {
  const backlinks = getBacklinks(content.slug);
  const outlinks = getOutlinks(content.slug);
  const localGraphData = getLocalGraphData(content.slug, 1);
  const tocItems = content.toc ? flattenToc(content.toc as unknown as TocEntry[]) : [];

  const topicLabel = getTopicLabel(content.taxonomy_lv2);
  const domainMeta = getDomainForTopic(content.taxonomy_lv2);
  const domainLabel = domainMeta ? getDomainLabel(domainMeta.key) : "";
  const subtopicLabel = content.taxonomy_lv3
    ? getSubtopicLabel(content.taxonomy_lv2, content.taxonomy_lv3)
    : null;

  const isReference = content.authorType === "reference";

  // Build breadcrumbs
  const breadcrumbItems: BreadcrumbItem[] = [];
  if (domainMeta) {
    breadcrumbItems.push({
      label: domainLabel,
      href: `/${domainMeta.key}`,
    });
  }
  breadcrumbItems.push({
    label: topicLabel,
    href: `/${domainMeta?.key}/${content.taxonomy_lv2}`,
  });
  if (subtopicLabel && content.taxonomy_lv3) {
    breadcrumbItems.push({
      label: subtopicLabel,
      href: `/${domainMeta?.key}/${content.taxonomy_lv2}/${content.taxonomy_lv3}`,
    });
  }
  breadcrumbItems.push({ label: content.title });

  const backlinkItems = backlinks.map((item) => ({
    slug: item.slug,
    title: item.title,
    description: (item as any).description,
  }));

  if (isReference) {
    return (
      <main className="relative mx-auto max-w-5xl px-6 py-12 lg:py-20">
        <ReadingProgressBar />
        <Breadcrumbs items={breadcrumbItems} />

        <ScrollAnimation>
          <header className="mb-10">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                {topicLabel}
              </Badge>
              {subtopicLabel && (
                <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                  {subtopicLabel}
                </Badge>
              )}
              <AuthorTypeBadge authorType="reference" />
            </div>

            <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-foreground">
              {content.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              {content.tags.map((tag: string) => (
                <Link key={tag} href={`/tag/${tag}`}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all"
                  >
                    #{tag.replace(/\s+/g, "-")}
                  </Badge>
                </Link>
              ))}
              <FreshnessBadge updated={content.updated} />
            </div>
          </header>

          {content.excerpt && (
            <div className="mb-10 rounded-xl border border-border/50 bg-muted/30 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Executive Summary
              </h3>
              <p className="text-muted-foreground leading-relaxed">{content.excerpt}</p>
            </div>
          )}

          <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
            <article
              data-pagefind-body
              className="prose prose-lg dark:prose-invert max-w-none break-keep
                prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                prose-p:leading-relaxed prose-p:text-muted-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-normal prose-code:text-primary
                prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50
                prose-img:rounded-xl prose-img:border prose-img:border-border/50 prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />

            <aside className="hidden lg:block h-full">
              <div className="sticky top-24 space-y-6">
                {content.source && <SourceMetadataSidebar source={content.source} />}
                {tocItems.length > 0 && (
                  <TableOfContents items={tocItems} />
                )}
              </div>
            </aside>
          </div>

          <KnowledgeConnections outlinks={outlinks} backlinks={backlinkItems} />
          <LocalGraphView data={localGraphData} />
        </ScrollAnimation>

        {tocItems.length > 0 && (
          <MobileTocSheet items={tocItems} />
        )}

      </main>
    );
  }

  // Original post layout
  return (
    <main className="relative mx-auto max-w-5xl px-6 py-12 lg:py-20">
      <ReadingProgressBar />
      <Breadcrumbs items={breadcrumbItems} />

      <ScrollAnimation>
        <header className="mb-10">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              {topicLabel}
            </Badge>
            {subtopicLabel && (
              <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                {subtopicLabel}
              </Badge>
            )}
            <AuthorTypeBadge authorType="original" />
          </div>

          <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            {content.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                L
              </div>
              <span className="font-medium text-foreground">Lee Jae Hyun</span>
            </div>
            <span className="hidden sm:inline">·</span>
            <time dateTime={content.date}>
              {format(new Date(content.date), "yyyy년 M월 d일", { locale: ko })}
            </time>
            <span className="hidden sm:inline">·</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{content.readingTime}분 소요</span>
            </div>
            <FreshnessBadge updated={content.updated} />
          </div>
        </header>

        {content.cover && content.cover.src && (
          <div className="mb-12 rounded-2xl overflow-hidden border border-border/50 shadow-sm aspect-video relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${content.cover.src})` }}
            />
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-[1fr_260px]">
          <article
            data-pagefind-body
            className="prose prose-lg dark:prose-invert max-w-none break-keep
              prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:leading-relaxed prose-p:text-muted-foreground
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-normal prose-code:text-primary
              prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50
              prose-img:rounded-xl prose-img:border prose-img:border-border/50 prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />

          <aside className="hidden lg:block h-full">
            <div className="sticky top-24 space-y-8">
              {tocItems.length > 0 && (
                <TableOfContents items={tocItems} />
              )}
              {content.tags.length > 0 && (
                <div className="space-y-4">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground pl-1">
                    <Tag className="h-3.5 w-3.5" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {content.tags.map((tag: string) => (
                      <Link key={tag} href={`/tag/${tag}`}>
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all"
                        >
                          #{tag.replace(/\s+/g, "-")}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        <KnowledgeConnections outlinks={outlinks} backlinks={backlinkItems} />
        <LocalGraphView data={localGraphData} />
      </ScrollAnimation>

      {tocItems.length > 0 && (
        <MobileTocSheet items={tocItems} />
      )}

    </main>
  );
}
