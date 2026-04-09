import type { MetadataRoute } from "next";
import { getPublishedPosts, getAllReferences, getAllResources } from "@/lib/content";
import { getAllSeries, getSeriesChapters } from "@/lib/series";
import { getAllTopicKeys, getSubTopicKeys } from "@/lib/taxonomy";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, changeFrequency: "daily" as const, priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/post`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/series`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/taxonomy`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/reference`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/resource`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/graph`, changeFrequency: "weekly" as const, priority: 0.6 },
  ];

  // Posts
  const postDocs = getPublishedPosts().map((post) => ({
    url: `${BASE_URL}/${post.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Series
  const seriesDocs: MetadataRoute.Sitemap = [];
  for (const s of getAllSeries()) {
    seriesDocs.push({
      url: `${BASE_URL}/${s.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    });
    for (const c of getSeriesChapters(s.seriesName!)) {
      seriesDocs.push({
        url: `${BASE_URL}/${c.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    }
  }

  // Topics
  const topicDocs: MetadataRoute.Sitemap = [];
  for (const topicKey of getAllTopicKeys()) {
    topicDocs.push({
      url: `${BASE_URL}/${topicKey}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    });
    for (const subKey of getSubTopicKeys(topicKey)) {
      topicDocs.push({
        url: `${BASE_URL}/${topicKey}/${subKey}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
  }

  // References
  const referenceDocs = getAllReferences().map((r) => ({
    url: `${BASE_URL}/${r.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Resources
  const resourceDocs = getAllResources().map((r) => ({
    url: `${BASE_URL}/${r.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...postDocs, ...seriesDocs, ...topicDocs, ...referenceDocs, ...resourceDocs];
}
