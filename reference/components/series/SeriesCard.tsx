import Link from "next/link";
import { Series } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import { getTopicLabel } from "@/lib/taxonomy";

interface SeriesCardProps {
  series: Series;
}

export function SeriesCard({ series }: SeriesCardProps) {
  return (
    <div className="glass-card hover:border-primary/50 group flex flex-col justify-between overflow-hidden rounded-xl border p-6 transition-all duration-300">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {getTopicLabel(series.topic) || series.topic}
          </span>
          <time className="text-xs text-muted-foreground" dateTime={series.date}>
            {formatDate(series.date)}
          </time>
        </div>
        <Link href={`/${series.slug}`} className="group-hover:text-primary transition-colors">
          <h3 className="mb-2 text-xl font-bold">{series.title}</h3>
        </Link>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {series.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <span className="text-xs font-medium text-muted-foreground">
          SERIES
        </span>
        <Link
          href={`/${series.slug}`}
          className="flex items-center text-sm font-medium text-primary transition-transform group-hover:translate-x-1"
        >
          Read Series <MoveRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
