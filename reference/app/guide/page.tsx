import type { Metadata } from "next";
import Link from "next/link";
import {
  Tag,
  Link2,
  FolderTree,
  Network,
  Sparkles,
  Landmark,
  Bot,
  BookOpen,
  FileText,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  FileCode2,
  Globe,
  Search,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GraphIllustration } from "@/components/ui/GraphIllustration";

export const metadata: Metadata = {
  title: "사이트 소개",
  description:
    "이 사이트의 철학과 지식 구조, 연결 방식, 기술 스택을 소개합니다.",
};

/* ───────────────── 헬퍼 컴포넌트 ───────────────── */

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="flex h-2 w-2 rounded-full bg-primary" />
      <span className="text-sm font-semibold uppercase tracking-wider text-primary">
        {label}
      </span>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card border border-border rounded-xl p-6 shadow-sm ${className ?? ""}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-bold text-lg text-foreground mb-2">{title}</h3>
      <div className="text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function ComparisonCard({
  icon: Icon,
  title,
  items,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-6 ${
        accent
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            accent ? "bg-primary/15" : "bg-muted"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${accent ? "text-primary" : "text-muted-foreground"}`}
          />
        </div>
        <h4 className="font-bold text-foreground">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <span
              className={`mt-[0.45rem] w-1.5 h-1.5 rounded-full shrink-0 ${
                accent ? "bg-primary" : "bg-muted-foreground/40"
              }`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContentTypeCard({
  icon,
  title,
  description,
  colorClass,
  bgClass,
}: {
  icon: string;
  title: string;
  description: string;
  colorClass: string;
  bgClass: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div
        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg mb-3 ${bgClass} ${colorClass}`}
      >
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <h4 className={`font-bold text-base mb-1.5 ${colorClass}`}>{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function TechBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-card border border-border text-foreground">
      {label}
    </span>
  );
}

function KeywordTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
      {label}
    </span>
  );
}

/* ───────────────── 페이지 ───────────────── */

export default function GuidePage() {
  return (
    <main className="pb-24">
      <PageHero
        badge="Introduce"
        title="사이트 소개"
        description="이 사이트의 철학과 구조, 그리고 연결 기반 지식 체계를 소개합니다."
      />

      <div className="gradient-line" />

      <div className="mx-auto max-w-5xl px-6 lg:px-8 py-16 sm:py-20 space-y-24">
        {/* ═══════════════════════════════════════════
            Section 1: 핵심 개념 (Core Concepts)
           ═══════════════════════════════════════════ */}
        <section>
          <SectionLabel label="Core Concepts" />
          <SectionHeading
            title="핵심 개념"
            description="이 사이트를 관통하는 지식 관리의 철학"
            icon={Sparkles}
          />

          {/* 1.1 메타데이터와 연결이 만드는 지식의 힘 */}
          <h3 className="text-xl font-bold text-foreground mb-4">
            1. 메타데이터와 연결이 만드는 지식의 힘
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <FeatureCard icon={Tag} title="메타데이터 (Metadata)">
              <p>
                메타데이터는 콘텐츠에 부여되는 <strong className="text-foreground">구조화된 속성</strong>입니다.
                주제(topic), 하위 주제(subTopic), 태그(tag), 콘텐츠 유형 등의 정보가
                각 문서에 자동으로 부여되어, 검색·분류·필터링의 기반이 됩니다.
              </p>
            </FeatureCard>
            <FeatureCard icon={Link2} title="연결 (Link)">
              <p>
                문서 간의 <strong className="text-foreground">내부 링크</strong>를 통해
                관련 지식을 연결합니다. 위키 링크(<code className="text-xs bg-muted px-1.5 py-0.5 rounded">[[문서명]]</code>)
                방식으로 작성하며, 양방향 참조(백링크)가 자동으로 생성됩니다.
              </p>
            </FeatureCard>
          </div>

          {/* 1.2 전통적 폴더 구조 vs 그래프 연결 구조 */}
          <h3 className="text-xl font-bold text-foreground mb-4">
            2. 전통적 폴더 구조 vs 그래프 연결 구조
          </h3>
          <div className="overflow-hidden border border-border rounded-xl shadow-sm mb-12 bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px] table-fixed">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-6 py-4 text-sm font-bold text-muted-foreground uppercase tracking-wider w-1/3">구분</th>
                    <th className="px-6 py-4 text-sm font-bold text-foreground w-1/3">전통적 폴더 구조</th>
                    <th className="px-6 py-4 text-sm font-bold text-primary w-1/3">그래프 연결 구조</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    {
                      category: "경로(path)",
                      traditional: "단일 경로 (한 문서는 한 폴더에만)",
                      graph: "다중 경로 (여러 주제에 동시 소속)",
                    },
                    {
                      category: "탐색(explore)",
                      traditional: "폴더구조로만 탐색",
                      graph: "메타데이터 기반 다차원 탐색",
                    },
                    {
                      category: "관계(relation)",
                      traditional: "파일 단위로 파편화된 정보",
                      graph: "백링크를 통한 유기적 연결망 형성",
                    },
                    {
                      category: "확장성(scale)",
                      traditional: "자료가 쌓일수록 구조가 복잡해짐",
                      graph: "지식이 축적될수록 연결이 풍부해짐",
                    },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-muted-foreground bg-muted/20">{row.category}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground leading-relaxed">{row.traditional}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium leading-relaxed">
                        <div className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {row.graph}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 1.3 AI 시대, 연결된 지식의 의미 */}
          <h3 className="text-xl font-bold text-foreground mb-4">
            3. AI 시대, 연결된 지식의 의미
          </h3>
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 shrink-0">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                  <p>
                    AI가 방대한 데이터를 처리하는 시대에도,{" "}
                    <strong className="text-foreground">맥락을 갖춘 연결된 지식</strong>의 가치는
                    더욱 커집니다. 단순 키워드 검색을 넘어, 구조화된 메타데이터와 문서 간 연결은
                    AI 검색(RAG)의 정확도를 높이고, 관련 지식을 빠르게 탐색할 수 있게 합니다.
                  </p>
                  <p>
                    이 사이트는 그래프 연결 기반의 업무지식 데이터베이스를 지향합니다.
                    개인의 실무 경험과 참고 자료가 체계적으로 연결되어,
                    필요한 순간에 정확한 지식을 찾아낼 수 있는 구조를 만들어갑니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            Section 2: 지식 구조 (Knowledge Structure)
           ═══════════════════════════════════════════ */}
        <section>
          <SectionLabel label="Knowledge Structure" />
          <SectionHeading
            title="지식 구조"
            description="주제별, 유형별로 구성된 콘텐츠 체계"
            icon={Network}
          />

          {/* 2.1 주제별 구조 */}
          <h3 className="text-xl font-bold text-foreground mb-4">
            1. 주제별 구조
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            모든 콘텐츠는{" "}
            <Link href="/taxonomy" className="text-primary font-medium hover:underline">
              주제별 인덱스(Topics)
            </Link>
            에 따라 분류됩니다. 하나의 콘텐츠가 여러 주제에 동시에 연결될 수 있습니다.
            예를 들어, 손상검사 관련 글은 <strong className="text-foreground">가치평가</strong> 주제이면서
            동시에 <strong className="text-foreground">재무회계</strong> 주제이기도 합니다.
            각 주제 페이지에서는 해당 주제의 시리즈, 포스트, 레퍼런스, 자료실 콘텐츠를 모아볼 수 있습니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {/* 회계실무 도메인 */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15">
                  <Landmark className="h-5 w-5 text-blue-500" />
                </div>
                <h4 className="font-bold text-foreground">회계실무</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["재무회계", "관리회계", "세무회계", "내부회계", "감사"].map(
                  (sub) => (
                    <span
                      key={sub}
                      className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full font-medium"
                    >
                      {sub}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* AI·생산성 도메인 */}
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15">
                  <Bot className="h-5 w-5 text-indigo-500" />
                </div>
                <h4 className="font-bold text-foreground">AI · 생산성</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Python", "Excel/VBA", "ChatGPT", "자동화"].map((sub) => (
                  <span
                    key={sub}
                    className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full font-medium"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 2.2 유형별 구조 */}
          <h3 className="text-xl font-bold text-foreground mb-4">
            2. 유형별 구조
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            콘텐츠는 성격에 따라 4가지 유형으로 나뉩니다.
            각 유형별 페이지에서 주제를 필터링하며 탐색할 수 있습니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ContentTypeCard
              icon="library_books"
              title="시리즈"
              description="하나의 주제를 체계적으로 다루는 전자책(Docs) 형식의 연재물입니다. 인덱스와 여러 챕터로 구성됩니다."
              colorClass="text-brand-series"
              bgClass="bg-brand-series/10"
            />
            <ContentTypeCard
              icon="article"
              title="포스트"
              description="다양한 주제의 독립적인 글입니다. 일반적인 블로그 형태로 작성되며, 자유롭게 탐색할 수 있습니다."
              colorClass="text-brand-post"
              bgClass="bg-brand-post/10"
            />
            <ContentTypeCard
              icon="find_in_page"
              title="레퍼런스"
              description="참고할 만한 외부 자료를 큐레이션합니다. 원본 출처 URL과 작성자 정보가 함께 기록됩니다."
              colorClass="text-brand-reference"
              bgClass="bg-brand-reference/10"
            />
            <ContentTypeCard
              icon="folder_zip"
              title="자료실"
              description="엑셀 템플릿, 업무 자동화 스크립트 등 실무에 바로 활용할 수 있는 파일을 다운로드할 수 있습니다."
              colorClass="text-brand-warning"
              bgClass="bg-brand-warning/10"
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            Section 3: 연결의 원리 (How Connections Work)
           ═══════════════════════════════════════════ */}
        <section>
          <SectionLabel label="How It Works" />
          <SectionHeading
            title="연결의 원리"
            description="문서 간의 연결을 확인하는 방법"
            icon={Link2}
          />

          {/* 3.1 개별 문서의 연결 */}
          <h3 className="text-xl font-bold text-foreground mb-4">
            1. 개별 문서의 연결
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            모든 콘텐츠 페이지 하단에는 <strong className="text-foreground">Knowledge Connections</strong> 영역이 표시됩니다.
            이 문서가 참조하는 다른 문서(Outgoing Links)와, 이 문서를 참조하는 문서(Backlinks)를
            한눈에 확인할 수 있습니다.
          </p>

          {/* KnowledgeConnections 목업 */}
          <div className="rounded-xl border border-border bg-card/50 p-6 mb-10">
            <h4 className="text-base font-bold mb-5 text-foreground">
              Knowledge Connections
            </h4>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Outgoing Links 목업 */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <ArrowUpRight className="h-4 w-4" />
                  Outgoing Links (3)
                </p>
                <div className="space-y-2">
                  {[
                    { title: "가치평가의 기본 개념", type: "Post", color: "text-brand-post" },
                    { title: "IFRS 재무보고 시리즈", type: "Series", color: "text-brand-series" },
                    { title: "DCF 모델 템플릿", type: "Resource", color: "text-brand-warning" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3"
                    >
                      <FileText className={`h-4 w-4 shrink-0 ${item.color}`} />
                      <span className="text-sm font-medium text-foreground truncate">
                        {item.title}
                      </span>
                      <span className="ml-auto text-[10px] text-muted-foreground uppercase">
                        {item.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backlinks 목업 */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <ArrowDownLeft className="h-4 w-4" />
                  Backlinks (2)
                </p>
                <div className="space-y-2">
                  {[
                    { title: "손상검사 실무 가이드", desc: "자산 손상검사의 주요 절차와 체크리스트" },
                    { title: "할인율 산정 방법론", desc: "WACC, CAPM 등 할인율 산정 접근법 비교" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex flex-col gap-1 rounded-lg border border-border/50 bg-card/50 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground/60 text-center mt-4 italic">
              * 실제 페이지 하단에 표시되는 연결 정보의 예시입니다
            </p>
          </div>

          {/* 3.2 그래프 뷰 */}
          <h3 className="text-xl font-bold text-foreground mb-4">
            2. 그래프 뷰
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            전체 콘텐츠의 연결 관계를 시각적으로 탐색할 수 있는 그래프 뷰를 제공합니다.
            노드의 크기는 연결 수에 비례하며, 색상은 콘텐츠 유형을 나타냅니다.
          </p>

          <div className="rounded-xl border border-border bg-card/50 p-6 sm:p-8">
            <div className="max-w-xs mx-auto mb-6">
              <GraphIllustration />
            </div>
            {/* 범례 */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {[
                { label: "시리즈", color: "bg-emerald-500" },
                { label: "포스트", color: "bg-blue-500" },
                { label: "레퍼런스", color: "bg-purple-500" },
                { label: "자료실", color: "bg-amber-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            Section 4: 기술 스택 (Tech Stack)
           ═══════════════════════════════════════════ */}
        <section>
          <SectionLabel label="Tech Stack" />
          <SectionHeading
            title="기술 스택"
            description="이 사이트를 구현한 기술들"
            icon={Terminal}
          />

          <div className="space-y-8">
            {/* 4.1 Markdown + Velite */}
            <FeatureCard icon={FileCode2} title="Markdown + Velite">
              <p className="mb-3">
                모든 콘텐츠는{" "}
                <strong className="text-foreground">옵시디언(Obsidian) 기반의 마크다운</strong>{" "}
                파일로 작성됩니다. YAML Frontmatter로 메타데이터를 관리하고,
                위키 링크(<code className="text-xs bg-muted px-1.5 py-0.5 rounded">[[문서명]]</code>)로
                문서 간 연결을 만듭니다.{" "}
                <strong className="text-foreground">Velite</strong>가 빌드 시점에 마크다운을
                파싱하여 타입 안전한 콘텐츠 데이터로 변환합니다.
              </p>
              {/* Frontmatter 예시 */}
              <div className="rounded-lg bg-muted/50 border border-border p-4 font-mono text-xs leading-relaxed">
                <p className="text-muted-foreground/60">---</p>
                <p>
                  <span className="text-primary">title</span>:{" "}
                  <span className="text-foreground">&quot;손상검사 실무 가이드&quot;</span>
                </p>
                <p>
                  <span className="text-primary">topic</span>:{" "}
                  <span className="text-foreground">accounting</span>
                </p>
                <p>
                  <span className="text-primary">subTopic</span>:{" "}
                  <span className="text-foreground">financial</span>
                </p>
                <p>
                  <span className="text-primary">tags</span>:{" "}
                  <span className="text-foreground">[손상검사, 가치평가, IFRS]</span>
                </p>
                <p className="text-muted-foreground/60">---</p>
              </div>
            </FeatureCard>

            {/* 4.2 Next.js + Vercel */}
            <FeatureCard icon={Globe} title="Next.js + Vercel">
              <p>
                <strong className="text-foreground">Next.js</strong> 프레임워크를 사용해
                정적 사이트로 빌드(Static Export)하고,{" "}
                <strong className="text-foreground">Vercel</strong>을 통해 배포합니다.
                빌드 파이프라인은{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  Markdown → Velite → Next.js → Vercel
                </code>{" "}
                순서로 진행됩니다.
              </p>
            </FeatureCard>
          </div>
        </section>
      </div>
    </main>
  );
}
