import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, Clock, ChevronLeft } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/Badge";
import { getPostsByTag, getAllTags } from "@/lib/content";
import { getTopicLabel } from "@/lib/taxonomy";
import type { Metadata } from "next";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return Array.from(tags.keys()).map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

export async function generateMetadata(props: TagPageProps): Promise<Metadata> {
  const params = await props.params;
  const decodedTag = decodeURIComponent(params.tag);
  return {
    title: `#${decodedTag} | PROCPA Blog`,
    description: `Articles tagged with #${decodedTag}`,
  };
}

export default async function TagPage(props: TagPageProps) {
  const params = await props.params;
  const decodedTag = decodeURIComponent(params.tag);
  const posts = getPostsByTag(decodedTag);

  if (posts.length === 0) {
    return notFound();
  }

  return (
    <main className="pb-20">
      <PageHero
        badge="Tag Filter"
        title="#"
        highlight={decodedTag}
        suffix=""
        description={`Found ${posts.length} articles tagged with #${decodedTag}`}
      />

      <div className="gradient-line" />

      <div className="mx-auto max-w-5xl px-6 py-16">
        <Link
            href="/post"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
            <ChevronLeft className="h-4 w-4" />
            Back to All Posts
        </Link>

        {/* Blog Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-primary/50"
            >
              {/* Image Placeholder or Gradient if no image */}
              <div className="aspect-video w-full overflow-hidden bg-muted relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-[var(--gradient-start)]/5 to-[var(--gradient-end)]/5 group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute top-4 left-4">
                    <Badge variant="default" className="bg-background/80 text-foreground backdrop-blur-md hover:bg-background/90">
                      {getTopicLabel(post.topic) || "Blog"}
                    </Badge>
                 </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                 <h2 className="line-clamp-2 text-xl font-bold group-hover:text-primary transition-colors">
                    {post.title}
                 </h2>
                 <p className="mt-3 line-clamp-2 text-sm text-muted-foreground flex-1">
                    {post.description}
                 </p>

                 <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <time dateTime={post.date}>
                        {format(new Date(post.date), "yyyy. MM. dd", { locale: ko })}
                      </time>
                    </div>
                    {post.readingTime && (
                       <div className="flex items-center gap-1">
                         <Clock className="h-3.5 w-3.5" />
                         <span>{post.readingTime} min read</span>
                       </div>
                    )}
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
