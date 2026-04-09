import { slugify } from "./utils";
import { contents, type Content } from "../../.velite";

export type { Content };

// Backward-compatible type aliases
export type Post = Content;
export type Series = Content;
export type Reference = Content;
export type Resource = Content;

// ─── Core Content Access ───

/** Get all non-draft content */
export function getAllContent(): Content[] {
  return contents.filter((c) => !c.draft);
}

/** Get content by exact slug */
export function getContentBySlug(slug: string): Content | undefined {
  return contents.find((c) => c.slug === slug && !c.draft);
}

// ─── Post Helpers ───

export function getPublishedPosts(): Content[] {
  return contents
    .filter((c) => !c.draft && !c.isSeries)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slugParts: string[]): Content | undefined {
  const slug = slugParts.join("/");
  return contents.find((c) => c.slug === slug && !c.draft);
}

export function getPostsByTag(tag: string): Content[] {
  return getPublishedPosts().filter((c) => c.tags.includes(tag));
}

export function getAllTags(): Map<string, number> {
  const tagMap = new Map<string, number>();
  getPublishedPosts().forEach((c) =>
    c.tags.forEach((t) => tagMap.set(t, (tagMap.get(t) || 0) + 1))
  );
  return tagMap;
}

export function getPaginatedPosts(page: number, perPage = 6) {
  const all = getPublishedPosts();
  return {
    posts: all.slice((page - 1) * perPage, page * perPage),
    totalPages: Math.ceil(all.length / perPage),
    currentPage: page,
  };
}

export function getRecentPosts(count = 5): Content[] {
  return getPublishedPosts().slice(0, count);
}

// ─── Post Author Type Helpers ───

export function getOriginalPosts(): Content[] {
  return getPublishedPosts().filter((c) => c.authorType === "original");
}

export function getReferencePosts(): Content[] {
  return getPublishedPosts().filter((c) => c.authorType === "reference");
}

// ─── Topic Helpers ───

export interface TopicStat {
  topic: string;
  count: number;
  subTopics: { name: string; count: number }[];
}

export function getTopics(): TopicStat[] {
  const allPosts = getPublishedPosts();
  const topicMap = new Map<string, { count: number; subStats: Map<string, number> }>();

  allPosts.forEach((c) => {
    const topic = c.taxonomy_lv2 || "uncategorized";
    const sub = c.taxonomy_lv3;

    if (!topicMap.has(topic)) {
      topicMap.set(topic, { count: 0, subStats: new Map() });
    }

    const entry = topicMap.get(topic)!;
    entry.count += 1;

    if (sub) {
      entry.subStats.set(sub, (entry.subStats.get(sub) || 0) + 1);
    }
  });

  return Array.from(topicMap.entries()).map(([name, data]) => ({
    topic: name,
    count: data.count,
    subTopics: Array.from(data.subStats.entries()).map(([subName, subCount]) => ({
      name: subName,
      count: subCount,
    })),
  }));
}

export function getPostsByTopic(topic: string, subTopic?: string): Content[] {
  return getPublishedPosts().filter((c) => {
    const topicMatch = slugify(c.taxonomy_lv2 || "") === slugify(topic);
    if (subTopic) {
      return topicMatch && slugify(c.taxonomy_lv3 || "") === slugify(subTopic);
    }
    return topicMatch;
  });
}

export function getAllContentByTopic(topic: string): {
  posts: Content[];
  seriesList: Content[];
  referencesList: Content[];
  resourcesList: Content[];
} {
  const all = getAllContent();
  const topicContent = all.filter(
    (c) => slugify(c.taxonomy_lv2 || "") === slugify(topic)
  );
  return {
    posts: topicContent.filter((c) => !c.isSeries),
    seriesList: topicContent.filter((c) => c.isSeries && c.index),
    referencesList: topicContent.filter((c) => c.authorType === "reference"),
    resourcesList: topicContent.filter((c) => c.fileType !== undefined),
  };
}

// ─── Domain & Taxonomy Content Helpers ───

/** Get all content belonging to a domain (by taxonomy_lv1) */
export function getContentByDomain(domainKey: string): Content[] {
  return getAllContent()
    .filter((c) => c.taxonomy_lv1 === domainKey)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Get all content for a topic (by taxonomy_lv2) */
export function getContentByTopic(topicKey: string): Content[] {
  return getAllContent()
    .filter((c) => c.taxonomy_lv2 === topicKey)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Get all content for a subtopic (by taxonomy_lv2 + taxonomy_lv3) */
export function getContentBySubtopic(topicKey: string, subtopicKey: string): Content[] {
  return getAllContent()
    .filter((c) => c.taxonomy_lv2 === topicKey && c.taxonomy_lv3 === subtopicKey)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Get unique standard_idx codes within a subtopic */
export function getUniqueStandardIdxCodes(topicKey: string, subtopicKey: string): string[] {
  const content = getAllContent().filter(
    (c) => c.taxonomy_lv2 === topicKey && c.taxonomy_lv3 === subtopicKey
  );
  const codes = new Set<string>();
  for (const c of content) {
    if (c.standard_idx) {
      const idx = c.standard_idx;
      if (Array.isArray(idx)) {
        idx.forEach((code) => codes.add(code));
      } else {
        codes.add(idx);
      }
    }
  }
  return Array.from(codes).sort();
}

/** Get standard_idx codes with labels and counts for a subtopic */
export interface CodeItem {
  code: string;
  label: string;
  count: number;
}

export function getStandardIdxCodesWithLabels(
  topicKey: string,
  subtopicKey: string
): CodeItem[] {
  const codes = getUniqueStandardIdxCodes(topicKey, subtopicKey);
  return codes.map((code) => {
    const { series, posts } = getContentByStandardIdx(code);
    const seriesIndex = series.find((s) => s.index);
    return {
      code,
      label: seriesIndex?.title || `K-IFRS ${code}`,
      count: series.length + posts.length,
    };
  });
}

/** Get all content matching a specific standard_idx code */
export function getContentByStandardIdx(code: string): {
  series: Content[];
  posts: Content[];
} {
  const matching = getAllContent().filter((c) => {
    if (!c.standard_idx) return false;
    if (Array.isArray(c.standard_idx)) return c.standard_idx.includes(code);
    return c.standard_idx === code;
  });

  return {
    series: matching.filter((c) => c.isSeries),
    posts: matching.filter((c) => !c.isSeries),
  };
}

// ─── Category Helpers ───

/** Get unique contentCategory values within a subtopic */
export function getUniqueCategoriesForSubtopic(
  topicKey: string,
  subtopicKey: string
): string[] {
  const content = getAllContent().filter(
    (c) => c.taxonomy_lv2 === topicKey && c.taxonomy_lv3 === subtopicKey
  );
  const cats = new Set<string>();
  for (const c of content) {
    cats.add(c.contentCategory || "etc");
  }
  return Array.from(cats);
}

/** Get all content for a specific category within a subtopic */
export function getContentByCategory(
  topicKey: string,
  subtopicKey: string,
  category: string
): Content[] {
  return getAllContent()
    .filter(
      (c) =>
        c.taxonomy_lv2 === topicKey &&
        c.taxonomy_lv3 === subtopicKey &&
        (c.contentCategory || "etc") === category
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ─── Series Helpers ───

export function getAllSeries(): Content[] {
  return contents
    .filter((c) => c.isSeries && c.index && !c.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ─── Reference Helpers ───

export function getAllReferences(): Content[] {
  return contents
    .filter((c) => c.authorType === "reference" && !c.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getReferenceBySlug(slugParts: string[]): Content | undefined {
  const slug = slugParts.join("/");
  return contents.find((c) => c.slug === slug && c.authorType === "reference" && !c.draft);
}

export function getReferencesByTopic(topic: string): Content[] {
  return getAllReferences().filter((c) => slugify(c.taxonomy_lv2 || "") === slugify(topic));
}

// ─── Resource Helpers ───

export function getAllResources(): Content[] {
  return contents
    .filter((c) => c.fileType !== undefined && !c.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getResourceBySlug(slugParts: string[]): Content | undefined {
  const slug = slugParts.join("/");
  return contents.find((c) => c.slug === slug && c.fileType !== undefined && !c.draft);
}

export function getResourcesByTopic(topic: string): Content[] {
  return getAllResources().filter((c) => slugify(c.taxonomy_lv2 || "") === slugify(topic));
}
