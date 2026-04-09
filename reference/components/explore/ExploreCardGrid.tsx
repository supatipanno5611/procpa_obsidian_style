"use client";

import type { UnifiedContentItem } from "@/lib/explore";
import { DOMAINS } from "@/lib/domains";
import { PostListCard } from "@/components/cards/PostListCard";
import { SeriesListCard } from "@/components/cards/SeriesListCard";
import { ReferenceListCard } from "@/components/cards/ReferenceListCard";
import { ResourceListCard } from "@/components/cards/ResourceListCard";
import { DomainSection } from "./DomainSection";

interface ExploreCardGridProps {
  items: UnifiedContentItem[];
  searchQuery: string;
  groupByDomain?: boolean;
}

function renderCard(item: UnifiedContentItem, searchQuery: string) {
  switch (item.contentType) {
    case "post":
      return (
        <PostListCard
          key={item.slug}
          post={{
            slug: item.slug,
            title: item.title,
            description: item.description,
            topic: item.topic,
            date: item.date,
            readingTime: item.readingTime,
          }}
          searchQuery={searchQuery}
        />
      );
    case "series":
      return (
        <SeriesListCard
          key={item.slug}
          series={{
            slug: item.slug,
            title: item.title,
            description: item.description,
            topic: item.topic,
            date: item.date,
            chapterCount: item.chapterCount,
          }}
          searchQuery={searchQuery}
        />
      );
    case "reference":
      return (
        <ReferenceListCard
          key={item.slug}
          reference={{
            slug: item.slug,
            title: item.title,
            description: item.description,
            topic: item.topic,
            date: item.date,
            source: item.sourceName
              ? { name: item.sourceName, url: item.sourceUrl, author: item.sourceAuthor }
              : undefined,
          }}
          searchQuery={searchQuery}
        />
      );
    case "resource":
      return (
        <ResourceListCard
          key={item.slug}
          resource={{
            slug: item.slug,
            title: item.title,
            description: item.description,
            topic: item.topic,
            date: item.date,
            fileType: item.fileType || "other",
            fileSize: item.fileSize,
          }}
          searchQuery={searchQuery}
        />
      );
    default:
      return null;
  }
}

export function ExploreCardGrid({ items, searchQuery, groupByDomain = false }: ExploreCardGridProps) {
  if (groupByDomain) {
    return (
      <div className="mt-4">
        {DOMAINS.map((domain) => {
          const domainItems = items.filter((item) => domain.topics.includes(item.topic));
          if (domainItems.length === 0) return null;
          return (
            <DomainSection key={domain.key} domain={domain} count={domainItems.length}>
              {domainItems.map((item) => renderCard(item, searchQuery))}
            </DomainSection>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => renderCard(item, searchQuery))}
    </div>
  );
}
