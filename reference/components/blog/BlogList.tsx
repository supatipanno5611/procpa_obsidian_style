"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostCard } from "@/components/blog/PostCard";
import { ContentTypeFilter, type ContentTypeFilterValue } from "@/components/shared/ContentTypeFilter";
import { TOPIC_TAXONOMY } from "@/lib/topics";

import { Post } from "@/lib/content";

// Build topic tabs dynamically from taxonomy
const TOPIC_TABS = [
  { id: "all", label: "전체" },
  ...Object.entries(TOPIC_TAXONOMY).map(([key, meta]) => ({
    id: key,
    label: meta.label,
  })),
];

interface BlogListProps {
  posts: Post[];
  tags: [string, number][]; // [tagName, count]
}

export function BlogList({ posts, tags }: BlogListProps) {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [contentType, setContentType] = useState<ContentTypeFilterValue>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Logic
  const filteredPosts = posts.filter((post) => {
    // 1. Topic Filter
    if (selectedTopic !== "all") {
      if (post.topic.toLowerCase() !== selectedTopic) return false;
    }

    // 2. Content Type Filter
    if (contentType !== "all") {
      if (post.authorType !== contentType) return false;
    }

    // 3. Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(query);
      const matchDesc = (post.description || "").toLowerCase().includes(query);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div>
      {/* Topic Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {TOPIC_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTopic(tab.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              selectedTopic === tab.id
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Type Filter */}
      <div className="flex justify-center mb-10">
        <ContentTypeFilter value={contentType} onChange={setContentType} />
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-16">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="관심 있는 주제를 검색해보세요..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/50 bg-background/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p>해당 조건에 맞는 게시글이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
