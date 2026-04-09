import Link from "next/link";
import { Post } from "@/lib/content";
import { ExternalLink, FileText } from "lucide-react";
import { getTopicLabel } from "@/lib/taxonomy";

interface ReferenceCardProps {
  post: Post;
}

export function ReferenceCard({ post }: ReferenceCardProps) {
  return (
    <div className="glass-card hover:border-primary/50 group flex flex-col justify-between overflow-hidden rounded-xl border p-5 transition-all duration-300">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            <FileText className="h-3 w-3" />
            {post.authorType === "reference" ? "참고자료" : "원본"}
          </span>
          <span className="text-xs text-muted-foreground">{getTopicLabel(post.topic)}</span>
        </div>

        <h3 className="mb-2 text-lg font-bold group-hover:text-primary transition-colors">
          {post.source?.url ? (
            <a href={post.source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              {post.title}
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
          ) : (
              <Link href={`/${post.slug}`}>{post.title}</Link>
          )}
        </h3>

        {post.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.description}
          </p>
        )}
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
