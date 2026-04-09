import { Suspense } from "react";
import { getAllUnifiedContent } from "@/lib/explore";
import { ExploreView } from "@/components/explore/ExploreView";

export const metadata = {
  title: "탐색 | Explore",
  description: "모든 콘텐츠를 메타데이터 기반으로 탐색합니다.",
};

export default function ExplorePage() {
  const items = getAllUnifiedContent();

  return (
    <Suspense>
      <ExploreView items={items} />
    </Suspense>
  );
}
