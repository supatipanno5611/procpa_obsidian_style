import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { getSeriesChapters, getSeriesIndex, getAllSeries, getSeriesProgress } from "@/lib/series";
import { getTopicLabel } from "@/lib/taxonomy";
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

interface SeriesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const allSeriesIndex = getAllSeries();

  const allParams = [];

  for (const s of allSeriesIndex) {
    if (!s.seriesName) continue;
    allParams.push({ slug: [s.seriesName] }); // Index
    const chapters = getSeriesChapters(s.seriesName);
    for (const c of chapters) {
      const chapterSlugPart = c.slug.split("/").pop();
      if (chapterSlugPart) {
        allParams.push({ slug: [s.seriesName, chapterSlugPart] });
      }
    }
  }

  return allParams;
}

export async function generateMetadata(props: SeriesPageProps) {
  const params = await props.params;
  const seriesName = params.slug[0];
  const chapterSlug = params.slug[1];

  const seriesIndex = getSeriesIndex(seriesName);
  if (!seriesIndex) return {};

  if (!chapterSlug) {
    return {
      title: `${seriesIndex.title} | Series`,
      description: seriesIndex.description,
    };
  }

  const chapters = getSeriesChapters(seriesName);
  const chapter = chapters.find((c) => c.slug.endsWith(`/${chapterSlug}`));

  if (!chapter) return {};

  return {
    title: `${chapter.title} - ${seriesIndex.title} | Series`,
    description: chapter.description,
  };
}

export default async function SeriesContentPage(props: SeriesPageProps) {
  const params = await props.params;
  const seriesName = params.slug[0];
  const chapterSlug = params.slug[1];

  const seriesIndex = getSeriesIndex(seriesName);
  if (!seriesIndex) notFound();

  const chapters = getSeriesChapters(seriesName);

  let content = seriesIndex;
  let isIndex = true;
  let currentIndex: number | null = null;
  let nextChapter = chapters.length > 0 ? chapters[0] : null;
  let prevChapter: any = null;

  if (chapterSlug) {
    const found = chapters.find((c) => c.slug.endsWith(`/${chapterSlug}`));
    if (!found) notFound();
    content = found;
    isIndex = false;
    currentIndex = content.order;

    const idx = chapters.findIndex((c) => c.slug === found.slug);
    prevChapter = idx > 0 ? chapters[idx - 1] : seriesIndex;
    nextChapter = idx < chapters.length - 1 ? chapters[idx + 1] : null;
  }

  const progress = currentIndex !== null
    ? getSeriesProgress(seriesName, currentIndex)
    : undefined;

  const topicLabel = getTopicLabel(seriesIndex.topic);
  const localGraphData = getLocalGraphData(content.slug, 1);

  const breadcrumbItems = [
    { label: "시리즈", href: "/series" },
    { label: seriesIndex.title, href: `/series/${seriesName}` },
    ...(isIndex ? [] : [{ label: content.title }]),
  ];

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
          {/* Continue Reading Banner (index page only) */}
          {isIndex && <ContinueReadingBanner seriesName={seriesName} />}

          <ScrollAnimation>
            {/* Header */}
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
                {(content as any).readingTime && (
                  <>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{(content as any).readingTime}분 소요</span>
                    </div>
                  </>
                )}
              </div>
            </header>

            {/* Article Content */}
            <article
              data-pagefind-body
              data-pagefind-meta="type:series"
              className="prose prose-lg dark:prose-invert max-w-none break-keep
                prose-headings:font-bold prose-headings:tracking-tight
                prose-p:leading-relaxed prose-p:text-muted-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:border prose-img:border-border/50 prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />

            {/* Local Graph */}
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

      {/* Track reading progress for series chapters */}
      <SeriesProgressTracker
        seriesName={seriesName}
        chapterSlug={chapterSlug || ""}
        chapterTitle={content.title}
        isIndex={isIndex}
      />
    </div>
  );
}
