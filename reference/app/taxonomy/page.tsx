import { TopicTree } from "@/components/topics/TopicTree";
import { getAllDomains } from "@/lib/taxonomy";

export const metadata = {
  title: "분류 체계 | PROCPA",
  description: "사이트의 모든 콘텐츠를 한눈에 파악할 수 있는 전체 주제 트리",
};

export default function TaxonomyPage() {
  const domains = getAllDomains();

  return (
    <main className="pb-20">
      <div className="mx-auto max-w-5xl px-6 pt-12">
        <h1 className="text-2xl font-bold">분류 체계</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          사이트의 모든 콘텐츠를 한눈에 파악할 수 있는 전체 주제 트리
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <TopicTree domains={domains} />
      </div>
    </main>
  );
}
