import { getRecentPosts } from "@/lib/content";
import { getSeriesWithChapterCount } from "@/lib/series";
import { TopicsBento } from "@/components/home/TopicsBento";
import { ContentTypes } from "@/components/home/ContentTypes";
import { RecommendSection } from "@/components/home/RecommendSection";
import { Hero } from "@/components/home/Hero";
import { SiteIntro } from "@/components/home/SiteIntro";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Hero />
      <SiteIntro />
      <TopicsBento />
      <ContentTypes />
      <RecommendSection />
      <NewsletterCTA />
    </div>
  );
}
