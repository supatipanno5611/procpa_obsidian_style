import { notFound } from "next/navigation";
import { getAllResources, getResourceBySlug } from "@/lib/content";
import { getTopicLabel } from "@/lib/taxonomy";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { DownloadButton } from "@/components/resource/DownloadButton";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import type { Metadata } from "next";

interface ReferencePageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const resources = getAllResources();
  return resources.map((r) => {
    const parts = r.slug.split("/").slice(1); // remove "resource/" prefix
    return { slug: parts };
  });
}

export async function generateMetadata(props: ReferencePageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const resource = getResourceBySlug(slug);
  if (!resource) return {};

  return {
    title: `${resource.title} | 자료실`,
    description: resource.description,
  };
}

export default async function ReferenceDetailPage(props: ReferencePageProps) {
  const { slug } = await props.params;
  const resource = getResourceBySlug(slug);

  if (!resource) notFound();

  const topicLabel = getTopicLabel(resource.topic);

  const breadcrumbItems = [
    { label: "자료실", href: "/resource" },
    { label: resource.title },
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
            <Badge variant="secondary" className="uppercase">
              {resource.fileType}
            </Badge>
          </div>

          <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            {resource.title}
          </h1>

          {resource.description && (
            <p className="text-lg text-muted-foreground mb-6">{resource.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={resource.date}>
                {format(new Date(resource.date), "yyyy년 M월 d일", { locale: ko })}
              </time>
            </div>
            {resource.fileSize && <span>· {resource.fileSize}</span>}
          </div>
        </header>

        {/* Download */}
        {resource.file && (
          <div className="mb-12 rounded-xl border border-border/50 bg-muted/30 p-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">파일 다운로드</p>
              <p className="text-sm text-muted-foreground mt-1">
                {resource.fileType?.toUpperCase()} 파일
                {resource.fileSize && ` · ${resource.fileSize}`}
              </p>
            </div>
            <DownloadButton fileUrl={resource.file} />
          </div>
        )}

        {/* Content */}
        <article
          className="prose prose-lg dark:prose-invert max-w-none break-keep
            prose-headings:font-bold prose-headings:tracking-tight
            prose-p:leading-relaxed prose-p:text-muted-foreground
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: resource.content }}
        />
      </ScrollAnimation>
    </main>
  );
}
