import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { Content } from "@/lib/content";
import { getSeriesChapters, getSeriesIndex, getSeriesProgress } from "@/lib/series";
import { getTopicLabel, getDomainForTopic, getDomainLabel } from "@/lib/taxonomy";
import { SeriesSidebar } from "@/components/series/SeriesSidebar";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { getLocalGraphData } from "@/lib/graph";
import { LocalGraphView } from "@/components/graph/LocalGraphView";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";

import { SeriesProgressTracker } from "@/components/series/SeriesProgressTracker";
import { ContinueReadingBanner } from "@/components/series/ContinueReadingBanner";

interface SeriesDetailProps {
  content: Content;
}

export function SeriesDetail({ content }: SeriesDetailProps) {
  if (!content.seriesName) return null;

  const seriesName = content.seriesName;
  const seriesIndex = getSeriesIndex(seriesName);
  if (!seriesIndex) return null;

  const chapters = getSeriesChapters(seriesName);
  const isIndex = content.index;

  let currentIndex: number | null = null;
  let nextChapter = chapters.length > 0 ? chapters[0] : null;
  let prevChapter: Content | null = null;

  if (!isIndex) {
    currentIndex = content.order;
    const idx = chapters.findIndex((c) => c.slug === content.slug);
    prevChapter = idx > 0 ? chapters[idx - 1] : seriesIndex;
    nextChapter = idx < chapters.length - 1 ? chapters[idx + 1] : null;
  }

  const progress = currentIndex !== null
    ? getSeriesProgress(seriesName, currentIndex)
    : undefined;

  const topicLabel = getTopicLabel(content.taxonomy_lv2);
  const domainMeta = getDomainForTopic(content.taxonomy_lv2);
  const localGraphData = getLocalGraphData(content.slug, 1);

  const breadcrumbItems = [
    ...(domainMeta ? [{ label: getDomainLabel(domainMeta.key), href: `/${domainMeta.key}` }] : []),
    { label: topicLabel, href: `/${domainMeta?.key}/${content.taxonomy_lv2}` },
    { label: seriesIndex.title, href: `/${seriesIndex.slug}` },
    ...(isIndex ? [] : [{ label: content.title }]),
  ];

  const chapterSlug = isIndex ? "" : content.slug.split("/").pop() || "";

  return (
    <div className="container relative mx-auto max-w-7xl px-4 py-8 lg:py-12">
      <ReadingProgressBar />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        {/* Sidebar (Desktop) */}
        <div className="hidden lg:block">
          <SeriesSidebar
            chapters={chapters}
            currentIndex={currentIndex}
            seriesName={seriesName}
            seriesTitle={seriesIndex.title}
            progress={progress}
          />
        </div>

        {/* Content Area */}
        <main className="min-w-0">
          {isIndex && <ContinueReadingBanner seriesName={seriesName} />}

          <ScrollAnimation>
            <header className="mb-8 border-b border-border pb-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {topicLabel && (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                    {topicLabel}
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="bg-secondary/50 text-secondary-foreground"
                >
                  {isIndex ? "Series Overview" : `Part ${content.order}`}
                </Badge>
              </div>

              <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                {content.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={content.date}>
                    {format(new Date(content.date), "yyyy년 M월 d일", { locale: ko })}
                  </time>
                </div>
                {content.readingTime && (
                  <>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{content.readingTime}분 소요</span>
                    </div>
                  </>
                )}
              </div>
            </header>

            <article
              data-pagefind-body
              className="prose prose-lg dark:prose-invert max-w-none break-keep
                prose-headings:font-bold prose-headings:tracking-tight
                prose-p:leading-relaxed prose-p:text-muted-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:border prose-img:border-border/50 prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />

            <LocalGraphView data={localGraphData} />
          </ScrollAnimation>

          {/* Navigation Footer */}
          <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
            {prevChapter ? (
              <Link
                href={`/${prevChapter.slug}`}
                className="group flex flex-col items-start gap-1 max-w-[45%]"
              >
                <span className="flex items-center text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  <ChevronLeft className="mr-1 h-3 w-3" /> 이전
                </span>
                <span className="font-semibold transition-colors group-hover:text-primary line-clamp-1">
                  {prevChapter.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextChapter ? (
              <Link
                href={`/${nextChapter.slug}`}
                className="group flex flex-col items-end gap-1 text-right max-w-[45%]"
              >
                <span className="flex items-center text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  다음 <ChevronRight className="ml-1 h-3 w-3" />
                </span>
                <span className="font-semibold transition-colors group-hover:text-primary line-clamp-1">
                  {nextChapter.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </main>
      </div>

      <SeriesProgressTracker
        seriesName={seriesName}
        chapterSlug={chapterSlug}
        chapterTitle={content.title}
        isIndex={isIndex}
      />
    </div>
  );
}
