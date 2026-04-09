import { notFound } from "next/navigation";
import { getAllReferences, getReferenceBySlug } from "@/lib/content";
import { getTopicLabel } from "@/lib/taxonomy";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, ExternalLink, Link as LinkIcon } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import type { Metadata } from "next";

interface ReferencePageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const references = getAllReferences();
  return references.map((r) => {
    const parts = r.slug.split("/").slice(1);
    return { slug: parts };
  });
}

export async function generateMetadata(props: ReferencePageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const reference = getReferenceBySlug(slug);
  if (!reference) return {};

  return {
    title: `${reference.title} | 외부 문헌`,
    description: reference.description,
  };
}

export default async function ReferenceDetailPage(props: ReferencePageProps) {
  const { slug } = await props.params;
  const reference = getReferenceBySlug(slug);

  if (!reference) notFound();

  const topicLabel = getTopicLabel(reference.topic);

  const breadcrumbItems = [
    { label: "외부 문헌", href: "/reference" },
    { label: reference.title },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 lg:py-20">
      <Breadcrumbs items={breadcrumbItems} />

      <ScrollAnimation>
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2">
            {topicLabel && (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                {topicLabel}
              </Badge>
            )}
            {reference.source?.name && (
              <Badge variant="secondary" className="uppercase">
                {reference.source.name}
              </Badge>
            )}
          </div>

          <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            {reference.title}
          </h1>

          {reference.description && (
            <p className="text-lg text-muted-foreground mb-6">{reference.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={reference.date}>
                {format(new Date(reference.date), "yyyy년 M월 d일", { locale: ko })}
              </time>
            </div>
            {reference.source?.author && <span>· 작성자: {reference.source.author}</span>}
          </div>
        </header>

        {/* Source Link */}
        {reference.source?.url && (
          <div className="mb-12 rounded-xl border border-border/50 bg-muted/30 p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <p className="font-semibold text-foreground flex items-center gap-2">
                <LinkIcon className="h-4 w-4" /> 원본 링크
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                이 글은 외부 문헌 데이터를 바탕으로 정리되었습니다. 전체 내용을 보려면 원문 링크를 방문하세요.
              </p>
            </div>
            <a
              href={reference.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              원본 보기 <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        )}

        {/* Content */}
        <article
          className="prose prose-lg dark:prose-invert max-w-none break-keep
            prose-headings:font-bold prose-headings:tracking-tight
            prose-p:leading-relaxed prose-p:text-muted-foreground
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: reference.content }}
        />
      </ScrollAnimation>
    </main>
  );
}
