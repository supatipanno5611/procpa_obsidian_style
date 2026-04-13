/**
 * Single source of truth mapping topic codes (folder names under `content/`)
 * to display labels. Add a new entry here when introducing a new topic — the
 * sidebar tree, category routes, breadcrumbs, etc. will all pick it up.
 */
export const TOPICS = {
  '인사이트': { label: '00. 인사이트', order: 0 },
  '회계실무': { label: '01. 회계실무', order: 1 },
  'ai-생산성': { label: '02. AI&생산성', order: 2 },
  '개발': { label: '03. 개발', order: 3 },
} as const

export type TopicKey = keyof typeof TOPICS

export const TOPIC_KEYS = Object.keys(TOPICS) as TopicKey[]

export function topicLabel(key: string): string {
  return (TOPICS as Record<string, { label: string }>)[key]?.label ?? key
}

export function topicOrder(key: string): number {
  return (TOPICS as Record<string, { order: number }>)[key]?.order ?? 999
}

export function isKnownTopic(key: string): key is TopicKey {
  return key in TOPICS
}
