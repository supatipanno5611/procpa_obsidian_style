import { getPublishedPosts, getAllSeries, getAllReferences, getAllResources } from "@/lib/content";
import { getAllTags } from "@/lib/content";

const STAT_ITEMS = [
  { key: "posts", icon: "article", label: "포스트", color: "text-brand-post" },
  { key: "series", icon: "library_books", label: "시리즈", color: "text-brand-series" },
  { key: "references", icon: "book", label: "레퍼런스", color: "text-brand-reference" },
  { key: "resources", icon: "folder_zip", label: "자료", color: "text-amber-500" },
  { key: "tags", icon: "tag", label: "태그", color: "text-muted-foreground" },
] as const;

export function ContentStats() {
  const stats: Record<string, number> = {
    posts: getPublishedPosts().length,
    series: getAllSeries().length,
    references: getAllReferences().length,
    resources: getAllResources().length,
    tags: getAllTags().size,
  };

  return (
    <section className="border-t border-border/50 bg-muted/30">
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-12">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="material-symbols-outlined text-[20px] text-primary">analytics</span>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            Content Overview
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STAT_ITEMS.map(({ key, icon, label, color }) => (
            <div
              key={key}
              className="flex flex-col items-center rounded-xl border border-border/60 bg-card p-4 transition-all hover:shadow-sm"
            >
              <span className={`material-symbols-outlined text-[24px] ${color} mb-2`}>
                {icon}
              </span>
              <span className="text-2xl font-extrabold tabular-nums text-foreground">
                {stats[key]}
              </span>
              <span className="text-xs text-muted-foreground mt-1">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
