// ─── Domain Configuration ───
// Maps TOPIC_TAXONOMY topics into two display domains for listing pages.
// "insight" topic is excluded from listing pages.

import { TOPIC_TAXONOMY, getLeafTopics } from "./topics";

export interface DomainConfig {
  key: string;
  label: string;
  labelEn: string;
  description: string;
  icon: string; // Material Symbols icon name
  accentColor: string; // Tailwind color token
  topics: string[]; // Keys from TOPIC_TAXONOMY
}

export const DOMAINS: DomainConfig[] = [
  {
    key: "accounting",
    label: "회계실무",
    labelEn: "Accounting & Finance",
    description: "회계기준부터 감사, 내부통제까지 실무 핵심 지식",
    icon: "account_balance",
    accentColor: "blue",
    topics: ["accounting"],
  },
  {
    key: "tech",
    label: "AI·생산성",
    labelEn: "AI & Productivity",
    description: "AI·자동화·개발로 완성하는 Vibe Working",
    icon: "smart_toy",
    accentColor: "indigo",
    topics: ["tech"],
  },
];

// Badge classes based on domain brand color
export function getTopicBadgeClasses(topicKey: string): string {
  const domain = getDomainForTopic(topicKey);
  if (!domain) return "bg-secondary text-secondary-foreground";
  switch (domain.accentColor) {
    case "blue":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "indigo":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

// All valid topic keys across all domains
export const ALL_DOMAIN_TOPICS = DOMAINS.flatMap((d) => d.topics);

// Given a topic key, find which domain it belongs to
export function getDomainForTopic(topicKey: string): DomainConfig | undefined {
  return DOMAINS.find((d) => d.topics.includes(topicKey));
}

// Get all subtopics for a specific domain
export function getSubTopicsForDomain(
  domainKey: string
): { key: string; label: string; topicKey: string }[] {
  const domain = DOMAINS.find((d) => d.key === domainKey);
  if (!domain) return [];

  const result: { key: string; label: string; topicKey: string }[] = [];
  for (const topicKey of domain.topics) {
    const meta = TOPIC_TAXONOMY[topicKey];
    if (meta) {
      for (const [subKey, subLabel] of Object.entries(meta.subTopics)) {
        result.push({ key: subKey, label: subLabel, topicKey });
      }
    }
  }
  return result;
}

// Get leaf topics (L3) for a specific subtopic within a domain
export function getLeafTopicsForDomainSubTopic(
  domainKey: string,
  subTopicKey: string
): { key: string; label: string; matchTags: string[] }[] {
  const domain = DOMAINS.find((d) => d.key === domainKey);
  if (!domain) return [];
  for (const topicKey of domain.topics) {
    const leaves = getLeafTopics(topicKey, subTopicKey);
    if (leaves.length > 0) return leaves;
  }
  return [];
}

// Get all subtopics across all domains
export function getAllSubTopics(): {
  key: string;
  label: string;
  topicKey: string;
  domainKey: string;
}[] {
  const result: {
    key: string;
    label: string;
    topicKey: string;
    domainKey: string;
  }[] = [];
  for (const domain of DOMAINS) {
    for (const topicKey of domain.topics) {
      const meta = TOPIC_TAXONOMY[topicKey];
      if (meta) {
        for (const [subKey, subLabel] of Object.entries(meta.subTopics)) {
          result.push({
            key: subKey,
            label: subLabel,
            topicKey,
            domainKey: domain.key,
          });
        }
      }
    }
  }
  return result;
}
