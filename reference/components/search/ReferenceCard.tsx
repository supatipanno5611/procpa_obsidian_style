import Link from "next/link";
import { Post } from "@/lib/content";
import { Hash, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getTopicLabel } from "@/lib/taxonomy";

interface ReferenceCardProps {
  post: Post;
}

export function ReferenceCard({ post }: ReferenceCardProps) {
  return (
    <Link
      href={`/${post.slug}`}
      className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="flex items-center gap-1 rounded-full bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            <Hash className="h-3 w-3" />
            {getTopicLabel(post.topic) || "Reference"}
          </span>
          <time className="text-xs text-muted-foreground" dateTime={post.date}>
            {formatDate(post.date)}
          </time>
        </div>
        <h3 className="mb-2 text-lg font-bold group-hover:text-primary transition-colors flex items-center gap-2">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {post.description}
        </p>
      </div>

      <div className="mt-4 flex items-center text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
        Read Reference <ExternalLink className="ml-1 h-3 w-3" />
      </div>
    </Link>
  );
}
