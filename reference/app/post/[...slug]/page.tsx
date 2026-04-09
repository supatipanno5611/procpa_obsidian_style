import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { getPostBySlug, getPublishedPosts, getPostsByTopic } from "@/lib/content";
import { getTopicLabel, getSubTopicLabel } from "@/lib/taxonomy";
import { Badge } from "@/components/ui/Badge";
import { PostCard } from "@/components/blog/PostCard";
import { Clock, Tag } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import type { Metadata } from "next";
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
import type { GraphData, ContentType } from "@/lib/graph";

interface PostPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

interface LayoutProps {
  post: any;
  breadcrumbItems: BreadcrumbItem[];
  topicLabel: string;
  outlinks: { slug: string; title: string; type: ContentType }[];
  backlinks: { slug: string; title: string; description?: string }[];
  localGraphData: GraphData;
}

export async function generateStaticParams() {
  const posts = getPublishedPosts();
  const paramsList = new Set<string>();

  posts.forEach((post) => {
    const parts = post.slug.split("/").slice(1); // remove "blog/" prefix

    // Add post path
    paramsList.add(parts.join("/"));

    // Add topic/subTopic paths
    for (let i = 1; i < parts.length; i++) {
      paramsList.add(parts.slice(0, i).join("/"));
    }
  });

  return Array.from(paramsList).map((slugStr) => ({
    slug: slugStr.split("/"),
  }));
}

export async function generateMetadata(props: PostPageProps): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} | PROCPA`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: ["Lee Jae Hyun"],
      tags: post.tags,
    },
  };
}

export default async function PostPage(props: PostPageProps) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    // Check if slug matches a topic or subTopic
    const topicName = params.slug[0];
    const subTopicName = params.slug[1];
    const topicPosts = getPostsByTopic(topicName, subTopicName);

    if (topicPosts.length > 0) {
      const topicLabel = getTopicLabel(topicName) || topicName;
      const subTopicLabel = subTopicName
        ? getSubTopicLabel(topicName, subTopicName) || subTopicName
        : null;

      return (
        <main className="pb-20">
          <div className="relative border-b border-border/50 bg-muted/30 py-20 text-center">
            <h1 className="mb-4 text-3xl font-extrabold md:text-5xl">
              {subTopicLabel || topicLabel}
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {subTopicLabel
                ? `${topicLabel} > ${subTopicLabel}`
                : `${topicLabel} 관련 글`}
            </p>
          </div>
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topicPosts.map((p) => (
                <div key={p.slug}>
                  <PostCard post={p} />
                </div>
              ))}
            </div>
          </div>
        </main>
      );
    }

    notFound();
  }

  // Shared data
  const backlinks = getBacklinks(post.slug);
  const outlinks = getOutlinks(post.slug);
  const localGraphData = getLocalGraphData(post.slug, 1);
  const topicLabel = getTopicLabel(post.topic);
  const isReference = post.authorType === "reference";

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "포스트", href: "/post" },
    ...(topicLabel ? [{ label: topicLabel, href: `/${post.topic}` }] : []),
    { label: post.title },
  ];

  const backlinkItems = backlinks.map((item) => ({
    slug: item.slug,
    title: item.title,
    description: (item as any).description,
  }));

  if (isReference) {
    return (
      <ReferenceLayout
        post={post}
        breadcrumbItems={breadcrumbItems}
        topicLabel={topicLabel}
        outlinks={outlinks}
        backlinks={backlinkItems}
        localGraphData={localGraphData}
      />
    );
  }

  return (
    <OriginalLayout
      post={post}
      breadcrumbItems={breadcrumbItems}
      topicLabel={topicLabel}
      outlinks={outlinks}
      backlinks={backlinkItems}
      localGraphData={localGraphData}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Original Post Layout
// ─────────────────────────────────────────────────────────────────────────────
function OriginalLayout({
  post,
  breadcrumbItems,
  topicLabel,
  outlinks,
  backlinks,
  localGraphData,
}: LayoutProps) {
  return (
    <main className="relative mx-auto max-w-5xl px-6 py-12 lg:py-20">
      <ReadingProgressBar />
      <Breadcrumbs items={breadcrumbItems} />

      <ScrollAnimation>
        {/* Header */}
        <header className="mb-10">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              {topicLabel}
            </Badge>
            {post.subTopic && (
              <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                {getSubTopicLabel(post.topic, post.subTopic) || post.subTopic}
              </Badge>
            )}
            <AuthorTypeBadge authorType="original" />
          </div>

          <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                L
              </div>
              <span className="font-medium text-foreground">Lee Jae Hyun</span>
            </div>
            <span className="hidden sm:inline">·</span>
            <time dateTime={post.date}>
              {format(new Date(post.date), "yyyy년 M월 d일", { locale: ko })}
            </time>
            <span className="hidden sm:inline">·</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{post.readingTime}분 소요</span>
            </div>
            <FreshnessBadge updated={post.updated} />
          </div>
        </header>

        {/* Featured Image */}
        {post.cover && post.cover.src && (
          <div className="mb-12 rounded-2xl overflow-hidden border border-border/50 shadow-sm aspect-video relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.cover.src})` }}
            />
          </div>
        )}

        {/* Content + TOC Sidebar */}
        <div className="grid gap-12 lg:grid-cols-[1fr_260px]">
          {/* Article Content */}
          <article
            data-pagefind-body
            data-pagefind-meta="type:post"
            className="prose prose-lg dark:prose-invert max-w-none break-keep
              prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:leading-relaxed prose-p:text-muted-foreground
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-normal prose-code:text-primary
              prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50
              prose-img:rounded-xl prose-img:border prose-img:border-border/50 prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Sidebar: TOC + Tags */}
          <aside className="hidden lg:block h-full">
            <div className="sticky top-24 space-y-8">
              {post.toc && post.toc.length > 0 && (
                <TableOfContents items={post.toc} />
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="space-y-4">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground pl-1">
                    <Tag className="h-3.5 w-3.5" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Link key={tag} href={`/post/tag/${tag}`}>
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

        {/* Knowledge Connections */}
        <KnowledgeConnections outlinks={outlinks} backlinks={backlinks} />

        {/* Local Knowledge Map */}
        <LocalGraphView data={localGraphData} />
      </ScrollAnimation>

      {/* Mobile TOC */}
      {post.toc && post.toc.length > 0 && (
        <MobileTocSheet items={post.toc} />
      )}

    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reference Post Layout
// ─────────────────────────────────────────────────────────────────────────────
function ReferenceLayout({
  post,
  breadcrumbItems,
  topicLabel,
  outlinks,
  backlinks,
  localGraphData,
}: LayoutProps) {
  return (
    <main className="relative mx-auto max-w-5xl px-6 py-12 lg:py-20">
      <ReadingProgressBar />
      <Breadcrumbs items={breadcrumbItems} />

      <ScrollAnimation>
        {/* Header */}
        <header className="mb-10">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              {topicLabel}
            </Badge>
            {post.subTopic && (
              <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                {getSubTopicLabel(post.topic, post.subTopic) || post.subTopic}
              </Badge>
            )}
            <AuthorTypeBadge authorType="reference" />
          </div>

          <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            {post.title}
          </h1>

          {/* Tags + Freshness */}
          <div className="flex flex-wrap items-center gap-2">
            {post.tags.map((tag: string) => (
              <Link key={tag} href={`/post/tag/${tag}`}>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all"
                >
                  #{tag.replace(/\s+/g, "-")}
                </Badge>
              </Link>
            ))}
            <FreshnessBadge updated={post.updated} />
          </div>
        </header>

        {/* Executive Summary */}
        {post.excerpt && (
          <div className="mb-10 rounded-xl border border-border/50 bg-muted/30 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Executive Summary
            </h3>
            <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
          </div>
        )}

        {/* 2-column: Content + Source Metadata Sidebar */}
        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          {/* Article Content */}
          <article
            data-pagefind-body
            data-pagefind-meta="type:post"
            className="prose prose-lg dark:prose-invert max-w-none break-keep
              prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:leading-relaxed prose-p:text-muted-foreground
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-normal prose-code:text-primary
              prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50
              prose-img:rounded-xl prose-img:border prose-img:border-border/50 prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Source Metadata Sidebar */}
          <aside className="hidden lg:block h-full">
            <div className="sticky top-24 space-y-6">
              {post.source && <SourceMetadataSidebar source={post.source} />}

              {post.toc && post.toc.length > 0 && (
                <TableOfContents items={post.toc} />
              )}
            </div>
          </aside>
        </div>

        {/* Knowledge Connections */}
        <KnowledgeConnections outlinks={outlinks} backlinks={backlinks} />

        {/* Local Knowledge Map */}
        <LocalGraphView data={localGraphData} />
      </ScrollAnimation>

      {/* Mobile TOC */}
      {post.toc && post.toc.length > 0 && (
        <MobileTocSheet items={post.toc} />
      )}

    </main>
  );
}
