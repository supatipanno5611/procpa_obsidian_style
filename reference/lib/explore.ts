// ─── Unified Content Model for Explore Page ───
// Normalizes all 4 collections (Post, Series, Reference, Resource)
// into a single filterable/sortable dataset.

import {
  getPublishedPosts,
  getAllSeries,
  getAllReferences,
  getAllResources,
  type Post,
  type Series,
  type Reference,
  type Resource,
} from "./content";
import { getSeriesChapters } from "./series";
import { stripHtml } from "./search-utils";
import { ALL_DOMAIN_TOPICS } from "./domains";

export type ContentCollectionType = "post" | "series" | "reference" | "resource";

export interface UnifiedContentItem {
  // 공통 필드
  slug: string;
  title: string;
  date: string;
  updated?: string;
  description: string;
  topic: string;
  tags: string[];
  contentType: ContentCollectionType;
  readingTime: number;
  searchText: string;

  // Post + Reference 전용
  subTopic?: string | null;
  authorType?: "original" | "reference";
  sourceName?: string;
  sourceUrl?: string;
  sourceAuthor?: string;

  // Series 전용
  chapterCount?: number;

  // Resource 전용
  fileType?: string;
  fileSize?: string;
}

function normalizePost(p: Post): UnifiedContentItem {
  return {
    slug: p.slug,
    title: p.title,
    date: p.date,
    updated: p.updated,
    description: p.description || p.excerpt || "",
    topic: p.topic,
    tags: p.tags,
    contentType: "post",
    readingTime: p.readingTime,
    searchText: stripHtml(p.content),
    subTopic: p.subTopic,
    authorType: p.authorType,
    sourceName: p.source?.name,
    sourceUrl: p.source?.url,
    sourceAuthor: p.source?.author,
  };
}

function normalizeSeries(s: Series, chapterCount: number): UnifiedContentItem {
  return {
    slug: s.slug,
    title: s.title,
    date: s.date,
    updated: s.updated,
    description: s.description || s.excerpt || "",
    topic: s.topic,
    tags: s.tags,
    contentType: "series",
    readingTime: s.readingTime,
    searchText: stripHtml(s.content),
    chapterCount,
  };
}

function normalizeReference(r: Reference): UnifiedContentItem {
  return {
    slug: r.slug,
    title: r.title,
    date: r.date,
    updated: r.updated,
    description: r.description || r.excerpt || "",
    topic: r.topic,
    tags: r.tags,
    contentType: "reference",
    readingTime: r.readingTime,
    searchText: stripHtml(r.content),
    subTopic: r.subTopic,
    authorType: r.authorType,
    sourceName: r.source?.name,
    sourceUrl: r.source?.url,
    sourceAuthor: r.source?.author,
  };
}

function normalizeResource(r: Resource): UnifiedContentItem {
  return {
    slug: r.slug,
    title: r.title,
    date: r.date,
    updated: r.updated,
    description: r.description || r.excerpt || "",
    topic: r.topic,
    tags: r.tags,
    contentType: "resource",
    readingTime: r.readingTime,
    searchText: stripHtml(r.content),
    fileType: r.fileType,
    fileSize: r.fileSize,
  };
}

/** 모든 컬렉션을 통합하여 UnifiedContentItem 배열로 반환 (insight 제외) */
export function getAllUnifiedContent(): UnifiedContentItem[] {
  const posts = getPublishedPosts()
    .filter((p) => ALL_DOMAIN_TOPICS.includes(p.topic))
    .map(normalizePost);

  const seriesList = getAllSeries()
    .filter((s) => ALL_DOMAIN_TOPICS.includes(s.topic))
    .map((s) => {
      const chapterCount = getSeriesChapters(s.seriesName!).length;
      return normalizeSeries(s, chapterCount);
    });

  const refs = getAllReferences()
    .filter((r) => ALL_DOMAIN_TOPICS.includes(r.topic))
    .map(normalizeReference);

  const resources = getAllResources()
    .filter((r) => ALL_DOMAIN_TOPICS.includes(r.topic))
    .map(normalizeResource);

  const all = [...posts, ...seriesList, ...refs, ...resources];
  all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return all;
}

/** 전체 콘텐츠에서 모든 태그와 사용 횟수를 집계 */
export function getUnifiedTagCounts(items: UnifiedContentItem[]): Map<string, number> {
  const tagMap = new Map<string, number>();
  for (const item of items) {
    for (const tag of item.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  return tagMap;
}
