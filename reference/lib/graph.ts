import { contents, type Content } from "../../.velite";

export type ContentType = "Post" | "Series" | "Reference" | "Resource";

export interface GraphNode {
  id: string; // slug
  title: string;
  type: ContentType;
  group: number; // 1=Original Post, 2=Series, 3=Reference, 4=Reference Post
  val: number; // Number of connections (for sizing)
  authorType?: string;
  neighbors?: GraphNode[];
  links?: GraphLink[];
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

function getContentType(c: Content): ContentType {
  if (c.isSeries) return "Series";
  if (c.fileType) return "Resource";
  if (c.authorType === "reference") return "Reference";
  return "Post";
}

function getGroup(c: Content): number {
  if (c.isSeries) return 2;
  if (c.fileType) return 5;
  if (c.authorType === "reference") return 4;
  return 1;
}

// Combine all content into one list
const allContent = contents
  .filter((c) => !c.draft)
  .map((c) => ({
    ...c,
    type: getContentType(c),
    group: getGroup(c),
  }));

// Helper to normalize slug for comparison
const normalizeSlug = (slug: string) => slug.replace(/^\/+|\/+$/g, "");

export function getAllContent() {
  return allContent;
}

export function getGraphData(): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // 1. Create Nodes
  allContent.forEach((item) => {
    if (!nodes.find((n) => n.id === item.slug)) {
      nodes.push({
        id: item.slug,
        title: item.title,
        type: item.type,
        group: item.group,
        authorType: item.authorType,
        val: 1,
      });
    }
  });

  // 2. Create Links
  allContent.forEach((sourceItem) => {
    if (sourceItem.links && Array.isArray(sourceItem.links)) {
      sourceItem.links.forEach((linkStr) => {
        const targetSlug = normalizeSlug(linkStr);

        let targetNode = nodes.find((n) => n.id === targetSlug);

        // Partial match fallback
        if (!targetNode && !targetSlug.includes("/")) {
          targetNode = nodes.find((n) => n.id.endsWith(`/${targetSlug}`));
        }

        if (targetNode) {
          links.push({
            source: sourceItem.slug,
            target: targetNode.id,
          });

          const sourceNode = nodes.find((n) => n.id === sourceItem.slug);
          if (sourceNode) sourceNode.val += 1;
          targetNode.val += 1;
        }
      });
    }
  });

  return { nodes, links };
}

// Get local graph data centered on a specific slug (N-hop neighborhood)
export function getLocalGraphData(slug: string, depth: number = 1): GraphData {
  const fullGraph = getGraphData();
  const normalizedSlug = normalizeSlug(slug);

  // Find the center node
  const centerNode = fullGraph.nodes.find((n) => n.id === normalizedSlug);
  if (!centerNode) {
    return { nodes: [], links: [] };
  }

  // BFS to find nodes within depth hops
  const visited = new Set<string>();
  const queue: { id: string; level: number }[] = [{ id: normalizedSlug, level: 0 }];
  visited.add(normalizedSlug);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.level >= depth) continue;

    // Find all connected nodes
    fullGraph.links.forEach((link) => {
      const sourceId = typeof link.source === "string" ? link.source : (link.source as any).id;
      const targetId = typeof link.target === "string" ? link.target : (link.target as any).id;

      let neighborId: string | null = null;
      if (sourceId === current.id) neighborId = targetId;
      if (targetId === current.id) neighborId = sourceId;

      if (neighborId && !visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push({ id: neighborId, level: current.level + 1 });
      }
    });
  }

  // Filter nodes and links
  const localNodes = fullGraph.nodes.filter((n) => visited.has(n.id));
  const localLinks = fullGraph.links.filter((link) => {
    const sourceId = typeof link.source === "string" ? link.source : (link.source as any).id;
    const targetId = typeof link.target === "string" ? link.target : (link.target as any).id;
    return visited.has(sourceId) && visited.has(targetId);
  });

  return { nodes: localNodes, links: localLinks };
}

// Get outgoing links for a specific slug (resolved to content items)
export function getOutlinks(slug: string): { slug: string; title: string; type: ContentType }[] {
  const normalizedSlug = normalizeSlug(slug);
  const item = allContent.find((c) => c.slug === normalizedSlug);
  if (!item || !item.links) return [];

  const results: { slug: string; title: string; type: ContentType }[] = [];

  item.links.forEach((linkStr) => {
    const targetSlug = normalizeSlug(linkStr);

    let target = allContent.find((c) => c.slug === targetSlug);
    if (!target && !targetSlug.includes("/")) {
      target = allContent.find((c) => c.slug.endsWith(`/${targetSlug}`));
    }

    if (target) {
      results.push({
        slug: target.slug,
        title: target.title,
        type: target.type,
      });
    }
  });

  return results;
}

// Get backlinks for a specific slug
export function getBacklinks(slug: string) {
  const normalizedSlug = normalizeSlug(slug);

  return allContent.filter((item) => {
    if (!item.links || !Array.isArray(item.links)) return false;

    return item.links.some((linkStr) => {
      const targetSlug = normalizeSlug(linkStr);
      if (targetSlug === normalizedSlug) return true;
      if (!targetSlug.includes("/") && normalizedSlug.endsWith(`/${targetSlug}`)) return true;
      return false;
    });
  });
}
