"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

// 메인 도메인 데이터
const TOPIC_DOMAINS = [
  {
    title: "회계 & 재무",
    description: "회계기준부터 감사, 내부통제, 가치평가까지 실무 핵심 지식",
    icon: "account_balance",
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10",
    ringClass: "ring-blue-500/20",
    hoverClass: "group-hover:ring-blue-500/50 group-hover:bg-blue-500/5",
    items: [
      { label: "Accounting", icon: "receipt_long", href: "/business/accounting", desc: "K-IFRS 및 일반기업회계기준 등 회계기준 해설" },
      { label: "ICFR", icon: "account_tree", href: "/business/icfr", desc: "내부회계관리제도 운영 및 평가 실무 가이드" },
      { label: "Audit", icon: "troubleshoot", href: "/business/audit", desc: "회계감사 실무 가이드" },
      { label: "Valuation", icon: "calculate", href: "/business/valuation", desc: "DCF, 복합금융상품 등 공정가치 평가 실무" },
    ],
  },
  {
    title: "AI & 생산성",
    description: "AI·자동화·개발로 완성하는 Vibe Working",
    icon: "smart_toy",
    colorClass: "text-indigo-500",
    bgClass: "bg-indigo-500/10",
    ringClass: "ring-indigo-500/20",
    hoverClass: "group-hover:ring-indigo-500/50 group-hover:bg-indigo-500/5",
    items: [
      { label: "LLM", icon: "magic_button", href: "/tech/ai", desc: "생성형 AI의 실무 활용" },
      { label: "Productivity", icon: "bolt", href: "/tech/productivity", desc: "업무 효율을 극대화하는 생산성 도구 활용" },
      { label: "Automation", icon: "trending_up", href: "/tech/automation", desc: "반복적인 업무를 줄이는 자동화 팁" },
      { label: "Develop", icon: "terminal", href: "/tech/develop", desc: "비개발자를 위한 프로그래밍 기본기 및 웹 개발" },
    ],
  },
];

export function TopicsBento() {
  return (
    <section className="bg-background py-16 sm:py-24 border-t border-border/50">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-end mb-10">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Topics
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              주요 토픽
            </h2>
            <p className="mt-2 text-muted-foreground">
              필요한 지식을 <strong>주제별로</strong> 탐색해보세요
            </p>
          </div>
          <Link
            href="/taxonomy"
            className="hidden sm:flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            전체 보기 <span className="ml-1 text-[20px] material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {TOPIC_DOMAINS.map((domain, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              {/* 왼쪽 모서리 컬러 라인 */}
              <div className={cn("absolute left-0 top-0 bottom-0 w-1", domain.bgClass.replace('/10', '/60'))} />

              {/* 도메인 헤더 */}
              <div className="flex items-center gap-4 mb-8">
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", domain.bgClass, domain.colorClass)}>
                  <span className="material-symbols-outlined text-[24px]">{domain.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{domain.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{domain.description}</p>
                </div>
              </div>

              {/* 서브 토픽 리스트 (2x2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {domain.items.map((item, j) => (
                  <Link
                    key={j}
                    href={item.href}
                    className={cn(
                      "group flex flex-col items-start gap-2 rounded-xl p-4 border border-border/50 transition-all",
                      domain.ringClass,
                      domain.hoverClass
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("material-symbols-outlined text-[18px]", domain.colorClass, "opacity-70 group-hover:opacity-100 transition-opacity")}>
                        {item.icon}
                      </span>
                      <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
