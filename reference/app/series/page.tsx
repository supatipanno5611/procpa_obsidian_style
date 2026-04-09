import { Suspense } from "react";
import { getAllUnifiedContent } from "@/lib/explore";
import { ExploreView } from "@/components/explore/ExploreView";

export const metadata = {
  title: "시리즈 | PROCPA",
  description: "하나의 주제를 체계적으로 파고드는 전자책 형식의 글입니다.",
};

export default function SeriesPage() {
  const items = getAllUnifiedContent();

  return (
    <Suspense>
      <ExploreView
        items={items}
        presetContentTypes={["series"]}
        heroOverride={{
          badge: "Series",
          title: "시리즈",
          description: "하나의 주제를 체계적으로 파고드는 전자책 형식의 글입니다.",
        }}
      />
    </Suspense>
  );
}
