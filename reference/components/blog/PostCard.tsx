import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Post } from "@/lib/content";
import { getTopicLabel } from "@/lib/taxonomy";
import { AuthorTypeBadge } from "@/components/shared/AuthorTypeBadge";

interface PostCardProps {
  post: Post;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  return (
    <Link
      href={`/${post.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-primary/50",
        className
      )}
    >
      <div className="aspect-video w-full overflow-hidden bg-muted relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gradient-start)]/5 to-[var(--gradient-end)]/5 group-hover:scale-105 transition-transform duration-500" />
        {post.cover?.src && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${post.cover.src})` }}
          />
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge
            variant="default"
            className="bg-background/80 text-foreground backdrop-blur-md hover:bg-background/90"
          >
            {getTopicLabel(post.topic) || "Blog"}
          </Badge>
        </div>
        {post.authorType === "reference" && (
          <div className="absolute top-4 right-4">
            <AuthorTypeBadge authorType="reference" className="bg-background/80 backdrop-blur-md" />
          </div>
        )}
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
              <span>{post.readingTime}분</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
