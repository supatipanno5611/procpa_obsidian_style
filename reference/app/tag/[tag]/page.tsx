import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/content";
import { PostCard } from "@/components/blog/PostCard";
import { PageHero } from "@/components/layout/PageHero";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  const tags = getAllTags();
  return Array.from(tags.keys()).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded} 태그 | PROCPA`,
    description: `'${decoded}' 태그가 포함된 글 모음`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);

  return (
    <main className="pb-20">
      <PageHero
        badge="Tag"
        title={`#${decoded}`}
        description={`'${decoded}' 태그가 포함된 글 ${posts.length}개`}
      />

      <div className="gradient-line" />

      <div className="mx-auto max-w-5xl px-6 py-16">
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            해당 태그의 글이 없습니다.
          </p>
        )}
      </div>
    </main>
  );
}
