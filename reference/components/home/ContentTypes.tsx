"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const CONTENT_TYPES = [
  {
    title: "시리즈",
    description: "하나의 주제를 체계적으로 파고드는 전자책 형식의 글입니다.",
    icon: "library_books",
    colorClass: "text-brand-series",
    bgClass: "bg-brand-series/10",
    borderHover: "hover:border-brand-series/50",
    hoverTextClass: "group-hover:text-brand-series",
    href: "/series",
  },
  {
    title: "포스트",
    description: "다양한 주제의 단편적인 글들을 기록합니다.",
    icon: "article",
    colorClass: "text-brand-post",
    bgClass: "bg-brand-post/10",
    borderHover: "hover:border-brand-post/50",
    hoverTextClass: "group-hover:text-brand-post",
    href: "/post",
  },
  {
    title: "레퍼런스",
    description: "주제와 관련한 외부 자료와 참고 문헌들을 큐레이션합니다.",
    icon: "find_in_page",
    colorClass: "text-brand-reference",
    bgClass: "bg-brand-reference/10",
    borderHover: "hover:border-brand-reference/50",
    hoverTextClass: "group-hover:text-brand-reference",
    href: "/reference",
  },
  {
    title: "자료실",
    description: "엑셀 템플릿, 업무 자동화 스크립트 등 다운로드 가능한 파일을 제공합니다.",
    icon: "folder_zip",
    colorClass: "text-brand-warning",
    bgClass: "bg-brand-warning/10",
    borderHover: "hover:border-brand-warning/50",
    hoverTextClass: "group-hover:text-brand-warning",
    href: "/files",
  },
];

export function ContentTypes() {
  return (
    <section className="bg-background py-16 sm:py-24 border-t border-border/50">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Types
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            콘텐츠 유형
          </h2>
          <p className="mt-2 text-muted-foreground">
            필요한 지식을 <strong>유형별로</strong> 탐색해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTENT_TYPES.map((type, i) => (
            <Link
              key={i}
              href={type.href}
              className={cn(
                "group relative flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:shadow-md",
                type.borderHover
              )}
            >
              <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-lg mb-4 transition-colors", type.bgClass, type.colorClass)}>
                <span className="material-symbols-outlined text-[20px]">{type.icon}</span>
              </div>
              <h3 className={cn("text-lg font-bold text-foreground mb-2 transition-colors", type.hoverTextClass)}>
                {type.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {type.description}
              </p>
              
              <div className={cn("mt-4 flex items-center text-sm font-medium text-muted-foreground transition-colors", type.hoverTextClass)}>
                Explore 
                <span className="material-symbols-outlined text-[16px] ml-1 transform group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
