// ─── Shared Route Resolution ───
// Extracted from the old /[...slug] catch-all so that
// /business/[...slug] and /tech/[...slug] can reuse the same logic.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  isValidDomain,
  isValidSubtopic,
  getDomain,
  getTopic,
  getSubtopic,
  TAXONOMY,
  CATEGORY_META,
} from "@/lib/taxonomy";
import {
  getContentBySlug,
  getUniqueCategoriesForSubtopic,
  getUniqueStandardIdxCodes,
  getAllContent,
} from "@/lib/content";
import { DomainOverview } from "@/components/topics/DomainOverview";
import { TopicOverview } from "@/components/topics/TopicOverview";
import { SubtopicOverview } from "@/components/topics/SubtopicOverview";
import { CategoryHub } from "@/components/topics/CategoryHub";
import { CodeView } from "@/components/topics/CodeView";
import { ContentDetail } from "@/components/topics/ContentDetail";
import { SeriesDetail } from "@/components/topics/SeriesDetail";

// ─── Types ───

export type PageType =
  | { kind: "domain"; domainKey: string }
  | { kind: "topic"; domainKey: string; topicKey: string }
  | { kind: "subtopic"; domainKey: string; topicKey: string; subtopicKey: string }
  | { kind: "category"; domainKey: string; topicKey: string; subtopicKey: string; categoryKey: string }
  | { kind: "code-view"; domainKey: string; topicKey: string; subtopicKey: string; code: string }
  | { kind: "content"; slug: string }
  | null;

// ─── Route Resolution ───

export function resolveRoute(slugParts: string[]): PageType {
  const [domainKey, topicKey, thirdPart, ...rest] = slugParts;

  if (!domainKey || !isValidDomain(domainKey)) return null;

  if (!topicKey) return { kind: "domain", domainKey };

  const domain = getDomain(domainKey);
  if (!domain || !domain.topics.some((t) => t.key === topicKey)) return null;

  if (!thirdPart) return { kind: "topic", domainKey, topicKey };

  const topic = getTopic(topicKey);
  if (!topic) return null;

  const hasSubtopic = isValidSubtopic(topicKey, thirdPart);

  if (hasSubtopic) {
    const subtopicKey = thirdPart;
    const fourthPart = rest[0];

    if (!fourthPart) {
      return { kind: "subtopic", domainKey, topicKey, subtopicKey };
    }

    // Check content first (deep slug match)
    const fullSlug = slugParts.join("/");
    const content = getContentBySlug(fullSlug);
    if (content) return { kind: "content", slug: fullSlug };

    // Lv4: Category page (e.g., /business/accounting/ifrs/standard)
    const categories = getUniqueCategoriesForSubtopic(topicKey, subtopicKey);
    if (categories.includes(fourthPart) && rest.length === 1) {
      return { kind: "category", domainKey, topicKey, subtopicKey, categoryKey: fourthPart };
    }

    // Code view route (e.g., /business/accounting/ifrs/by-code/1115)
    if (fourthPart === "by-code" && rest.length === 2) {
      const code = rest[1];
      const codes = getUniqueStandardIdxCodes(topicKey, subtopicKey);
      if (codes.includes(code)) {
        return { kind: "code-view", domainKey, topicKey, subtopicKey, code };
      }
    }

    // Deeper content slug
    const contentSlug = slugParts.join("/");
    const deepContent = getContentBySlug(contentSlug);
    if (deepContent) return { kind: "content", slug: contentSlug };

    return null;
  }

  const fullSlug = slugParts.join("/");
  const content = getContentBySlug(fullSlug);
  if (content) return { kind: "content", slug: fullSlug };

  return null;
}

// ─── Static Params ───

export function generateDomainStaticParams(domainKey: string): { slug: string[] }[] {
  const params: { slug: string[] }[] = [];
  const domain = getDomain(domainKey);
  if (!domain) return params;

  for (const topic of domain.topics) {
    params.push({ slug: [topic.key] });

    for (const subtopic of topic.subtopics) {
      params.push({ slug: [topic.key, subtopic.key] });

      // Category pages (Lv4)
      const categories = getUniqueCategoriesForSubtopic(topic.key, subtopic.key);
      for (const cat of categories) {
        params.push({ slug: [topic.key, subtopic.key, cat] });
      }

      // Code view pages (by standard_idx)
      const codes = getUniqueStandardIdxCodes(topic.key, subtopic.key);
      for (const code of codes) {
        params.push({ slug: [topic.key, subtopic.key, "by-code", code] });
      }
    }
  }

  // Content pages for this domain
  const allContent = getAllContent();
  for (const c of allContent) {
    if (c.taxonomy_lv1 === domainKey) {
      // Content slug starts with "domain/...", strip the domain prefix
      const parts = c.slug.split("/");
      const withoutDomain = parts.slice(1);
      if (withoutDomain.length > 0) {
        params.push({ slug: withoutDomain });
      }
    }
  }

  return params;
}

// ─── Metadata ───

export function generateRouteMetadata(slugParts: string[]): Metadata {
  const route = resolveRoute(slugParts);
  if (!route) return {};

  switch (route.kind) {
    case "domain": {
      const domain = getDomain(route.domainKey);
      return {
        title: `${domain?.label} | PROCPA`,
        description: domain?.description,
      };
    }
    case "topic": {
      const topic = getTopic(route.topicKey);
      return {
        title: `${topic?.label} | PROCPA`,
        description: `${topic?.label} 관련 콘텐츠`,
      };
    }
    case "subtopic": {
      const subtopic = getSubtopic(route.topicKey, route.subtopicKey);
      return {
        title: `${subtopic?.label} | PROCPA`,
        description: `${subtopic?.label} 관련 콘텐츠`,
      };
    }
    case "category": {
      const meta = CATEGORY_META[route.categoryKey];
      const subtopic = getSubtopic(route.topicKey, route.subtopicKey);
      return {
        title: `${meta?.label || route.categoryKey} — ${subtopic?.label} | PROCPA`,
        description: `${subtopic?.label} ${meta?.label || route.categoryKey} 관련 자료 모음`,
      };
    }
    case "code-view":
      return {
        title: `기준서 ${route.code} | PROCPA`,
        description: `K-IFRS ${route.code} 관련 자료 모음`,
      };
    case "content": {
      const content = getContentBySlug(route.slug);
      if (!content) return {};
      return {
        title: `${content.title} | PROCPA`,
        description: content.description,
        openGraph: {
          title: content.title,
          description: content.description,
          type: "article",
          publishedTime: content.date,
          tags: content.tags,
        },
      };
    }
  }
}

// ─── Render ───

export function renderRoute(slugParts: string[]): React.ReactNode {
  const route = resolveRoute(slugParts);

  if (!route) notFound();

  switch (route.kind) {
    case "domain":
      return <DomainOverview domainKey={route.domainKey} />;
    case "topic":
      return <TopicOverview domainKey={route.domainKey} topicKey={route.topicKey} />;
    case "subtopic":
      return (
        <SubtopicOverview
          domainKey={route.domainKey}
          topicKey={route.topicKey}
          subtopicKey={route.subtopicKey}
        />
      );
    case "category":
      return (
        <CategoryHub
          domainKey={route.domainKey}
          topicKey={route.topicKey}
          subtopicKey={route.subtopicKey}
          categoryKey={route.categoryKey}
        />
      );
    case "code-view":
      return (
        <CodeView
          domainKey={route.domainKey}
          topicKey={route.topicKey}
          subtopicKey={route.subtopicKey}
          code={route.code}
        />
      );
    case "content": {
      const content = getContentBySlug(route.slug);
      if (!content) notFound();

      if (content.isSeries) {
        return <SeriesDetail content={content} />;
      }
      return <ContentDetail content={content} />;
    }
  }
}
