import { Suspense } from "react";
import { getAllUnifiedContent } from "@/lib/explore";
import { ExploreView } from "@/components/explore/ExploreView";

export const metadata = {
  title: "자료실 | PROCPA",
  description:
    "엑셀 템플릿, 업무 자동화 스크립트 등 다운로드 가능한 파일을 제공합니다.",
};

export default function ResourcePage() {
  const items = getAllUnifiedContent();

  return (
    <Suspense>
      <ExploreView
        items={items}
        presetContentTypes={["resource"]}
        heroOverride={{
          badge: "Resources",
          title: "자료실",
          description:
            "엑셀 템플릿, 업무 자동화 스크립트 등 다운로드 가능한 파일을 제공합니다.",
        }}
      />
    </Suspense>
  );
}
