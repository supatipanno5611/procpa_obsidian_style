import { Suspense } from "react";
import { getAllUnifiedContent } from "@/lib/explore";
import { ExploreView } from "@/components/explore/ExploreView";

export const metadata = {
  title: "레퍼런스 | PROCPA",
  description: "주제와 관련한 외부 자료와 참고 문헌들을 큐레이션합니다.",
};

export default function ReferencePage() {
  const items = getAllUnifiedContent();

  return (
    <Suspense>
      <ExploreView
        items={items}
        presetContentTypes={["reference"]}
        heroOverride={{
          badge: "References",
          title: "레퍼런스",
          description: "주제와 관련한 외부 자료와 참고 문헌들을 큐레이션합니다.",
        }}
      />
    </Suspense>
  );
}
