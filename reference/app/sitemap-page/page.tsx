import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "사이트맵 | PROCPA",
  description: "PROCPA 웹사이트의 전체 페이지 구조를 한눈에 확인합니다.",
};

// ─── Types ───
type SitemapItem = {
  label: string;
  href: string;
  description: string;
};

type SitemapSection = {
  title: string;
  icon: string;
  items: SitemapItem[];
};

const SITEMAP_SECTIONS: SitemapSection[] = [
  {
    title: "메인 페이지",
    icon: "🏠",
    items: [
      { label: "홈", href: "/", description: "PROCPA 메인 화면" },
      { label: "소개", href: "/about", description: "운영자 소개 및 사이트 목적" },
      { label: "가이드", href: "/guide", description: "사이트 구조와 철학 안내" },
      { label: "Contact", href: "/contact", description: "문의 및 연락처 안내" },
    ],
  },
  {
    title: "유형별 콘텐츠",
    icon: "📂",
    items: [
      { label: "포스트", href: "/post", description: "단일 주제의 독립형 글 모음" },
      { label: "시리즈", href: "/series", description: "여러 챕터로 구성된 연재 콘텐츠" },
      { label: "레퍼런스", href: "/reference", description: "외부 출처 기반의 참고 자료 정리" },
      { label: "자료실", href: "/resource", description: "다운로드 가능한 실무 템플릿 및 도구" },
    ],
  },
  {
    title: "주제별 콘텐츠",
    icon: "🏷️",
    items: [
      { label: "회계실무", href: "/accounting", description: "재무·관리·세무 회계 관련 콘텐츠" },
      { label: "AI/생산성", href: "/tech", description: "AI 도구 활용 및 업무 자동화 콘텐츠" },
    ],
  },
  {
    title: "INFORMATION",
    icon: "📋",
    items: [
      { label: "이용약관", href: "/terms", description: "사이트 이용에 관한 약관" },
      { label: "면책조항", href: "/disclaimer", description: "콘텐츠 관련 법적 면책 사항" },
      { label: "사이트맵", href: "/sitemap-page", description: "전체 페이지 구조 안내 (현재 페이지)" },
    ],
  },
];

function SitemapCard({ section }: { section: SitemapSection }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-none">
      {/* Card header */}
      <div className="border-b border-border/60 px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span>{section.icon}</span>
          {section.title}
        </h2>
      </div>

      {/* Card body */}
      <ul className="divide-y divide-border/40">
        {section.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors group"
            >
              <span className="text-muted-foreground/40 mt-0.5 text-xs select-none">→</span>
              <div className="min-w-0">
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.label}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SitemapPage() {
  return (
    <main className="pb-20">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          사이트맵
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          PROCPA 웹사이트의 전체 페이지 구조
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SITEMAP_SECTIONS.map((section) => (
            <SitemapCard key={section.title} section={section} />
          ))}
        </div>
      </div>
    </main>
  );
}
