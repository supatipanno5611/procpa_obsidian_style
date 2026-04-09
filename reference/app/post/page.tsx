import { Suspense } from "react";
import { getAllUnifiedContent } from "@/lib/explore";
import { ExploreView } from "@/components/explore/ExploreView";

export const metadata = {
  title: "포스트 | PROCPA",
  description: "다양한 주제의 단편적인 글들을 기록합니다.",
};

export default function PostPage() {
  const items = getAllUnifiedContent();

  return (
    <Suspense>
      <ExploreView
        items={items}
        presetContentTypes={["post"]}
        heroOverride={{
          badge: "Posts",
          title: "포스트",
          description: "다양한 주제의 단편적인 글들을 기록합니다.",
        }}
      />
    </Suspense>
  );
}
