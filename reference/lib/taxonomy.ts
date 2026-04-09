// ─── 4-Level Taxonomy: Domain → Topic → Subtopic ───
// Single source of truth for the blog's classification hierarchy.
// contentCategory is derived from folder structure, not defined here.
// Index (lv4) is derived dynamically from content's standard_idx field.

// ─── Types ───

export interface SubtopicMeta {
  key: string;
  label: string;
  labelEn?: string;
}

export interface TopicMeta {
  key: string;
  label: string;
  labelEn?: string;
  icon?: string; // Material Symbols icon name
  subtopics: SubtopicMeta[];
  /** contentCategory names that are treated as series (folder with index.md + chapters) */
  seriesCategories: string[];
}

export interface DomainMeta {
  key: string;
  label: string;
  labelEn: string;
  description: string;
  icon: string; // Material Symbols icon name
  accentColor: string; // Tailwind color token (blue, indigo, etc.)
  topics: TopicMeta[];
}

// ─── Taxonomy Data ───

export const TAXONOMY: DomainMeta[] = [
  {
    key: "business",
    label: "회계실무",
    labelEn: "Accounting Practice",
    description: "회계, 감사, 내부회계, 가치평가 등 실무 핵심 지식",
    icon: "account_balance",
    accentColor: "blue",
    topics: [
      {
        key: "accounting",
        label: "회계",
        labelEn: "Accounting",
        icon: "receipt_long",
        subtopics: [
          { key: "ifrs", label: "IFRS", labelEn: "K-IFRS" },
          { key: "kgaap", label: "KGAAP", labelEn: "K-GAAP" },
          { key: "consolidated", label: "연결회계", labelEn: "Consolidated" },
        ],
        seriesCategories: ["standard"],
      },
      {
        key: "audit",
        label: "감사",
        labelEn: "Audit",
        icon: "troubleshoot",
        subtopics: [
          { key: "isa", label: "ISA", labelEn: "ISA" },
          { key: "audit-procedure", label: "감사절차", labelEn: "Audit Procedure" },
          { key: "it-audit", label: "IT Audit", labelEn: "IT Audit" },
        ],
        seriesCategories: ["standard"],
      },
      {
        key: "icfr",
        label: "내부회계",
        labelEn: "ICFR",
        icon: "account_tree",
        subtopics: [
          { key: "icfr-operation", label: "내부회계 운영", labelEn: "ICFR Operation" },
          { key: "icfr-evaluation", label: "설계 및 평가", labelEn: "Design & Evaluation" },
        ],
        seriesCategories: ["standard"],
      },
      {
        key: "valuation",
        label: "가치평가",
        labelEn: "Valuation",
        icon: "calculate",
        subtopics: [],
        seriesCategories: ["guide"],
      },
    ],
  },
  {
    key: "tech",
    label: "AI·생산성",
    labelEn: "AI & Productivity",
    description: "AI·자동화·개발로 완성하는 Vibe Working",
    icon: "smart_toy",
    accentColor: "indigo",
    topics: [
      {
        key: "ai",
        label: "AI/LLM",
        labelEn: "AI/LLM",
        icon: "magic_button",
        subtopics: [],
        seriesCategories: [],
      },
      {
        key: "automation",
        label: "자동화",
        labelEn: "Automation",
        icon: "trending_up",
        subtopics: [],
        seriesCategories: ["tutorial"],
      },
      {
        key: "dev",
        label: "개발",
        labelEn: "Development",
        icon: "terminal",
        subtopics: [],
        seriesCategories: [],
      },
      {
        key: "productivity",
        label: "생산성",
        labelEn: "Productivity",
        icon: "bolt",
        subtopics: [
          { key: "obsidian", label: "Obsidian" },
          { key: "notion", label: "Notion" },
        ],
        seriesCategories: [],
      },
    ],
  },
];

// ─── Lookup Utilities ───

/** Get all domains */
export function getAllDomains(): DomainMeta[] {
  return TAXONOMY;
}

/** Get a domain by key */
export function getDomain(domainKey: string): DomainMeta | undefined {
  return TAXONOMY.find((d) => d.key === domainKey);
}

/** Get a topic by key (searches across all domains) */
export function getTopic(topicKey: string): TopicMeta | undefined {
  for (const domain of TAXONOMY) {
    const topic = domain.topics.find((t) => t.key === topicKey);
    if (topic) return topic;
  }
  return undefined;
}

/** Get a subtopic by key within a specific topic */
export function getSubtopic(topicKey: string, subtopicKey: string): SubtopicMeta | undefined {
  const topic = getTopic(topicKey);
  return topic?.subtopics.find((s) => s.key === subtopicKey);
}

/** Find which domain a topic belongs to */
export function getDomainForTopic(topicKey: string): DomainMeta | undefined {
  return TAXONOMY.find((d) => d.topics.some((t) => t.key === topicKey));
}

/** Get all topic keys across all domains */
export function getAllTopicKeys(): string[] {
  return TAXONOMY.flatMap((d) => d.topics.map((t) => t.key));
}

/** Get all domain keys */
export function getAllDomainKeys(): string[] {
  return TAXONOMY.map((d) => d.key);
}

/** Get subtopic keys for a given topic */
export function getSubtopicKeys(topicKey: string): string[] {
  const topic = getTopic(topicKey);
  return topic?.subtopics.map((s) => s.key) ?? [];
}

/** Check if a domain key is valid */
export function isValidDomain(domainKey: string): boolean {
  return TAXONOMY.some((d) => d.key === domainKey);
}

/** Check if a topic key is valid */
export function isValidTopic(topicKey: string): boolean {
  return getTopic(topicKey) !== undefined;
}

/** Check if a subtopic key is valid within a topic */
export function isValidSubtopic(topicKey: string, subtopicKey: string): boolean {
  return getSubtopic(topicKey, subtopicKey) !== undefined;
}

/** Check if a contentCategory is a series category for a given topic */
export function isSeriesCategory(topicKey: string, category: string): boolean {
  const topic = getTopic(topicKey);
  return topic?.seriesCategories.includes(category) ?? false;
}

/** Get series categories for a given topic */
export function getSeriesCategoriesForTopic(topicKey: string): string[] {
  const topic = getTopic(topicKey);
  return topic?.seriesCategories ?? [];
}

// ─── Label Utilities ───

export function getDomainLabel(domainKey: string): string {
  return getDomain(domainKey)?.label ?? domainKey;
}

export function getTopicLabel(topicKey: string): string {
  return getTopic(topicKey)?.label ?? topicKey;
}

export function getTopicLabelEn(topicKey: string): string {
  return getTopic(topicKey)?.labelEn ?? topicKey;
}

export function getSubtopicLabel(topicKey: string, subtopicKey: string): string {
  return getSubtopic(topicKey, subtopicKey)?.label ?? subtopicKey;
}

export function getTopicDescription(topicKey: string): string {
  const domain = getDomainForTopic(topicKey);
  return domain?.description ?? "";
}

// ─── All valid topic keys (for content filtering) ───

export const ALL_DOMAIN_TOPICS = getAllTopicKeys();

// ─── Accent Style Helpers ───

const ACCENT_STYLES: Record<string, {
  badge: string;
  statBg: string;
  border: string;
}> = {
  blue: {
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    statBg: "bg-blue-500/5 border-blue-500/15",
    border: "border-l-blue-500",
  },
  indigo: {
    badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    statBg: "bg-indigo-500/5 border-indigo-500/15",
    border: "border-l-indigo-500",
  },
  amber: {
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    statBg: "bg-amber-500/5 border-amber-500/15",
    border: "border-l-amber-500",
  },
};

export function getAccentStyles(domainKey: string) {
  const domain = getDomain(domainKey);
  const color = domain?.accentColor ?? "blue";
  return ACCENT_STYLES[color] ?? ACCENT_STYLES.blue;
}

export function getTopicBadgeClasses(topicKey: string): string {
  const domain = getDomainForTopic(topicKey);
  if (!domain) return "bg-secondary text-secondary-foreground";
  const styles = ACCENT_STYLES[domain.accentColor];
  return styles?.badge ?? "bg-secondary text-secondary-foreground";
}

// ─── Backward-Compatible Aliases ───
// Some files use PascalCase "SubTopic" naming convention from the old topics.ts

export const getSubTopicKeys = getSubtopicKeys;
export const getSubTopicLabel = getSubtopicLabel;

// Re-export getLeafMatchTags from topics.ts for consumers that import from taxonomy
export { getLeafMatchTags } from "./topics";

// ─── Content Category Metadata ───
// Shared mapping used by CategoryHub, SubtopicOverview, buildPathSegments, route-resolver

export const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  standard:    { label: "기준서",   icon: "menu_book" },
  qa:          { label: "질의회신", icon: "question_answer" },
  explanation: { label: "실무해설", icon: "description" },
  guide:       { label: "가이드",   icon: "book" },
  tutorial:    { label: "튜토리얼", icon: "school" },
  etc:         { label: "기타",     icon: "article" },
};

export const CATEGORY_ORDER = ["standard", "qa", "explanation", "guide", "tutorial"];
