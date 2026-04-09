// ─── URL Helpers ───
// Single source of truth for building taxonomy/content URLs.
// Content slugs already start with domain key (e.g., "business/accounting/ifrs/..."),
// so getContentUrl simply prepends "/".

export function getContentUrl(slug: string): string {
  return `/${slug}`;
}

export function getDomainUrl(domainKey: string): string {
  return `/${domainKey}`;
}

export function getTopicUrl(domainKey: string, topicKey: string): string {
  return `/${domainKey}/${topicKey}`;
}

export function getSubtopicUrl(
  domainKey: string,
  topicKey: string,
  subtopicKey: string,
): string {
  return `/${domainKey}/${topicKey}/${subtopicKey}`;
}

export function getIndexHubUrl(
  domainKey: string,
  topicKey: string,
  subtopicKey: string,
  code: string,
): string {
  return `/${domainKey}/${topicKey}/${subtopicKey}/${code}`;
}
