import { TAXONOMY, getDomain, getTopic, CATEGORY_META } from "@/lib/taxonomy";
import type { BreadcrumbItem } from "@/components/shared/Breadcrumbs";

export interface CategoryItem {
  key: string;
  label: string;
  icon?: string;
  count: number;
}

/**
 * Build breadcrumb items with sibling dropdowns for taxonomy pages.
 * Each breadcrumb segment includes its siblings for lateral navigation.
 */
export function buildBreadcrumbItems(params: {
  domainKey: string;
  topicKey?: string;
  subtopicKey?: string;
  activeCategory?: string;
  categoryItems?: CategoryItem[];
}): BreadcrumbItem[] {
  const { domainKey, topicKey, subtopicKey, activeCategory, categoryItems } =
    params;
  const domain = getDomain(domainKey);
  if (!domain) return [];

  const items: BreadcrumbItem[] = [];

  // Lv1: Domain
  items.push({
    label: domain.label,
    href: `/${domainKey}`,
    siblings: TAXONOMY.map((d) => ({
      label: d.label,
      href: `/${d.key}`,
      icon: d.icon,
    })),
  });

  if (!topicKey) return items;

  // Lv2: Topic
  const topic = getTopic(topicKey);
  if (!topic) return items;

  items.push({
    label: topic.label,
    href: `/${domainKey}/${topicKey}`,
    siblings: domain.topics.map((t) => ({
      label: t.label,
      href: `/${domainKey}/${t.key}`,
      icon: t.icon,
    })),
  });

  if (!subtopicKey) return items;

  // Lv3: Subtopic
  items.push({
    label:
      topic.subtopics.find((s) => s.key === subtopicKey)?.label || subtopicKey,
    href: `/${domainKey}/${topicKey}/${subtopicKey}`,
    siblings: topic.subtopics.map((s) => ({
      label: s.label,
      href: `/${domainKey}/${topicKey}/${s.key}`,
    })),
  });

  if (!activeCategory || !categoryItems) return items;

  // Lv4: Category
  const meta = CATEGORY_META[activeCategory];
  items.push({
    label: meta?.label || activeCategory,
    siblings: categoryItems.map((c) => ({
      label: CATEGORY_META[c.key]?.label || c.key,
      href: `/${domainKey}/${topicKey}/${subtopicKey}/${c.key}`,
      icon: CATEGORY_META[c.key]?.icon,
    })),
  });

  return items;
}
