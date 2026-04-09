import { ExternalLink, User, Building2, Calendar } from "lucide-react";

interface SourceMetadata {
  name?: string;
  url?: string;
  author?: string;
  publishedDate?: string;
}

interface SourceMetadataSidebarProps {
  source: SourceMetadata;
}

export function SourceMetadataSidebar({ source }: SourceMetadataSidebarProps) {
  return (
    <div className="rounded-2xl border border-brand-warning/20 bg-brand-warning/5 p-6 space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-brand-warning/20">
        <div className="h-2 w-2 rounded-full bg-brand-warning" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-warning">
          Source Metadata
        </h3>
      </div>

      <div className="space-y-4">
        {source.name && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Building2 className="h-3 w-3" />
              출처
            </div>
            <p className="text-sm font-medium text-foreground">{source.name}</p>
          </div>
        )}

        {source.author && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <User className="h-3 w-3" />
              원저자
            </div>
            <p className="text-sm font-medium text-foreground">{source.author}</p>
          </div>
        )}

        {source.publishedDate && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Calendar className="h-3 w-3" />
              게시일
            </div>
            <p className="text-sm text-foreground">
              {new Date(source.publishedDate).toLocaleDateString("ko-KR")}
            </p>
          </div>
        )}
      </div>

      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-warning/10 border border-brand-warning/20 px-4 py-2.5 text-sm font-semibold text-brand-warning hover:bg-brand-warning/20 transition-colors"
        >
          원문 보기
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}
