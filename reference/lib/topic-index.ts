import { taxonomy } from "../../.velite";

// ─── Types ───

export interface TopicNode {
  code?: string;
  label: string;
  labelKo?: string;
  route?: string;
  children?: TopicNode[];
}

export interface TopicIndexData {
  title: string;
  description: string;
  tree: TopicNode[];
}

// ─── Data Access ───

export function getTopicIndex(): TopicIndexData {
  const data = taxonomy[0]; // single-entry collection
  return {
    title: data.title,
    description: data.description ?? "",
    tree: (data.tree ?? []) as TopicNode[],
  };
}
