import { PageHero } from "@/components/layout/PageHero";
import { TopicTree } from "@/components/topics/TopicTree";
import { getAllDomains } from "@/lib/taxonomy";

export const metadata = {
  title: "주제별 분류 체계 | PROCPA",
  description: "PROCPA 블로그의 전체 주제를 계층 구조로 탐색합니다.",
};

export default function TopicsPage() {
  const domains = getAllDomains();

  return (
    <main className="pb-20">
      <PageHero
        badge="Index"
        title="주제별"
        highlight="분류 체계"
        description="PROCPA 블로그의 전체 주제를 계층 구조로 탐색합니다."
      />

      <div className="gradient-line" />

      <div className="mx-auto max-w-5xl px-6 py-16">
        <TopicTree domains={domains} />
      </div>
    </main>
  );
}
