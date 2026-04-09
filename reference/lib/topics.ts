// ─── Topic Taxonomy ───
// Maps English folder/metadata keys to Korean UI labels.
// This is the single source of truth for topic ↔ label mapping (L1, L2, L3).
// L3 (leafTopics) uses matchTags to filter content by tags.

export interface SubTopicMeta {
  key: string;
  label: string;
}

export interface LeafTopicMeta {
  label: string;
  matchTags: string[];
}

export interface TopicMeta {
  label: string;
  labelEn: string;
  description: string;
  icon: string; // Lucide icon name
  subTopics: Record<string, string>; // key → Korean label
  leafTopics?: Record<string, Record<string, LeafTopicMeta>>;
  // ^ subTopicKey → { leafKey → { label, matchTags } }
}

export const TOPIC_TAXONOMY: Record<string, TopicMeta> = {
  accounting: {
    label: "회계실무",
    labelEn: "Accounting Practice",
    description: "K-IFRS/K-GAAP 기반 회계 실무 지식과 가이드",
    icon: "Landmark",
    subTopics: {
      financial: "재무회계",
      audit: "감사",
      icfr: "내부회계",
      tax: "세무회계",
      management: "관리회계",
      valuation: "가치평가",
    },
    leafTopics: {
      financial: {
        ifrs: { label: "IFRS", matchTags: ["IFRS", "K-IFRS"] },
        kgaap: { label: "KGAAP", matchTags: ["K-GAAP", "KGAAP"] },
        consolidated: { label: "연결회계", matchTags: ["연결회계"] },
      },
      audit: {
        isa: { label: "ISA", matchTags: ["ISA"] },
        "audit-procedure": { label: "감사절차", matchTags: ["감사절차"] },
        "it-audit": { label: "IT Audit", matchTags: ["IT Audit", "IT감사"] },
      },
      icfr: {
        "icfr-operation": {
          label: "내부회계 운영",
          matchTags: ["내부회계", "ICFR"],
        },
        "icfr-evaluation": {
          label: "설계 및 평가",
          matchTags: ["내부통제", "설계"],
        },
      },
    },
  },
  tech: {
    label: "AI/IT",
    labelEn: "AI & Technology",
    description: "생산성을 높이는 AI 및 IT 기술 활용법",
    icon: "Bot",
    subTopics: {
      chatgpt: "AI/ChatGPT",
      python: "Python/데이터",
      automation: "자동화",
      excel: "Excel/VBA",
      productivity: "생산성",
    },
    leafTopics: {
      productivity: {
        obsidian: { label: "Obsidian", matchTags: ["Obsidian"] },
        notion: { label: "Notion", matchTags: ["Notion"] },
      },
    },
  },
  insight: {
    label: "내 생각",
    labelEn: "My Insights",
    description: "회계사로서의 생각, 관점, 커리어 이야기",
    icon: "Lightbulb",
    subTopics: {
      career: "커리어",
      trends: "업계동향",
      review: "서평",
    },
  },
};

// ─── Utility Functions ───

export function getTopicLabel(topicKey: string): string {
  return TOPIC_TAXONOMY[topicKey]?.label ?? topicKey;
}

export function getTopicLabelEn(topicKey: string): string {
  return TOPIC_TAXONOMY[topicKey]?.labelEn ?? topicKey;
}

export function getSubTopicLabel(topicKey: string, subTopicKey: string): string {
  return TOPIC_TAXONOMY[topicKey]?.subTopics[subTopicKey] ?? subTopicKey;
}

export function getTopicDescription(topicKey: string): string {
  return TOPIC_TAXONOMY[topicKey]?.description ?? "";
}

export function getTopicIcon(topicKey: string): string {
  return TOPIC_TAXONOMY[topicKey]?.icon ?? "FileText";
}

export function getAllTopicKeys(): string[] {
  return Object.keys(TOPIC_TAXONOMY);
}

export function getSubTopicKeys(topicKey: string): string[] {
  return Object.keys(TOPIC_TAXONOMY[topicKey]?.subTopics ?? {});
}

export function isValidTopic(topicKey: string): boolean {
  return topicKey in TOPIC_TAXONOMY;
}

export function isValidSubTopic(topicKey: string, subTopicKey: string): boolean {
  return subTopicKey in (TOPIC_TAXONOMY[topicKey]?.subTopics ?? {});
}

// ─── L3 (Leaf Topic) Functions ───

export function getLeafTopics(
  topicKey: string,
  subTopicKey: string
): { key: string; label: string; matchTags: string[] }[] {
  const leaves = TOPIC_TAXONOMY[topicKey]?.leafTopics?.[subTopicKey];
  if (!leaves) return [];
  return Object.entries(leaves).map(([key, meta]) => ({
    key,
    label: meta.label,
    matchTags: meta.matchTags,
  }));
}

export function getLeafMatchTags(
  topicKey: string,
  subTopicKey: string,
  leafKey: string
): string[] {
  return (
    TOPIC_TAXONOMY[topicKey]?.leafTopics?.[subTopicKey]?.[leafKey]?.matchTags ??
    []
  );
}
