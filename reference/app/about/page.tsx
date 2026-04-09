import type { Metadata } from "next";
import {
  GraduationCap,
  Briefcase,
  Rocket,
  ExternalLink,
  Mail,
  ClipboardList,
  BadgeCheck,
  ArrowRight,
  BookOpen,
  Award,
  Code2,
  Database,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | PROCPA",
  description: "공인회계사 이재현 - 소개 및 이력",
};

/* ───────────────── 데이터 ───────────────── */

const stats = [
  { value: "7+", label: "Years Exp." },
  { value: "10+", label: "Certificates" },
  { value: "2+", label: "Publication" },
  { value: "3+", label: "Side Projects" },
];

const education = [
  {
    period: "2025 – 현재",
    name: "경북대학교 데이터사이언스 대학원 (석사)",
  },
  {
    period: "2023 – 2025",
    name: "한국방송통신대학교 AI학과",
  },
  {
    period: "2014 – 2019",
    name: "경북대학교 글로벌인재학부",
  },
];

const career = [
  {
    period: "2025 – 현재",
    name: "방위사업청 원가관리 자문위원",
  },
  {
    period: "2023 – 현재",
    name: "육군 재정장교",
  },
  {
    period: "2021 – 2023",
    name: "안진회계법인 (Deloitte)",
  },
  {
    period: "2019 – 2021",
    name: "안경회계법인",
  },
];

const workExperience = [
  {
    title: "회계감사(Audit & Assurance)",
    items: [
      "상장사 및 비상장사 회계감사 In-charge 역할 수행",
      "반도체, 자동차, 화학, 2차전지 등 다양한 산업 경험",
    ],
  },
  {
    title: "내부회계(ICFR)",
    items: [
      "내부회계관리제도 구축 및 설계/운영평가 용역 In-charge 역할 수행",
      "연결내부회계관리제도 구축 업무 경험",
    ],
  },
  {
    title: "평가 및 회계자문(Valuation & PA)",
    items: [
      "재무보고목적 공정가치평가 및 손상검사 업무 수행",
      "IFRS Conversion, 연결 PA 등 회계자문 업무 수행",
    ],
  },
  {
    title: "원가분석 및 정책(Cost Analysis & Policy)",
    items: [
      "방산물자 원가계산 업무 수행",
      "데이터 기반의 정책연구 보고서 작성 및 비용 추계 분석",
    ],
  },
];

const certificates = [
  {
    category: "Finance",
    icon: Award,
    items: ["한국공인회계사 (KICPA)", "원가분석사", "국방원가관리사"],
  },
  {
    category: "IT",
    icon: Code2,
    items: ["국제정보시스템감사사(CISA)", "정보처리기사"],
  },
  {
    category: "Data",
    icon: Database,
    items: ["빅데이터분석기사", "재무빅데이터분석사 1, 2급", "데이터분석준전문가(ADsP)", "SQL개발자(SQLD)"],
  }
];

const publications = [
  {
    name: "비개발자를 위한 Antigravity",
    description: "Antigravity의 실무 활용법을 비개발자 관점에서 정리한 가이드북.",
    href: "https://wikidocs.net/book/18574",
  },
  {
    name: "클로드 엑셀(Claude for Excel) 가이드",
    description: "Claude for Excel의 사용법 및 실무 적용 사례를 다루는 실전 가이드.",
    href: "https://wikidocs.net/book/19374",
  },
];

const sideProjects = [
  {
    name: "PROCPA",
    description:
      "회계 실무 지식과 AI 활용 가이드를 제공하는 실무 중심 지식체계 사이트",
    techs: ["Next.js", "TypeScript", "Velite", "Tailwind"],
    href: "/",
  },
  {
    name: "Marklog",
    description:
      "네이버 블로그를 위한 마크다운 커스터마이징 & 변환 도구",
    techs: ["React", "TypeScript"],
    href: "https://marklog.procpa.co.kr/",
  },
  {
    name: "ClickThumb",
    description:
      "디자인 툴 없이도 10초만에 끝내는 맞춤형 썸네일 제작 도구",
    techs: ["HTML"],
    href: "https://clickthumb.procpa.co.kr/",
  },
];

/* ───────────────── 공통 컴포넌트 ───────────────── */

function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <>
      <h2 className="text-2xl font-black mb-4 flex items-center gap-2 text-foreground">
        <Icon className="w-7 h-7 text-primary" />
        {children}
      </h2>
      <div className="border-t border-border mb-8" />
    </>
  );
}

function TimelineItem({
  period,
  name,
  role,
  description,
}: {
  period: string;
  name: string;
  role?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8 group">
      {/* 연도 */}
      <div className="w-24 text-xs font-mono font-semibold text-muted-foreground pt-1 shrink-0 group-hover:text-primary transition-colors">
        {period}
      </div>
      {/* 내용 */}
      <div className="flex-1 pb-7 border-b border-border/40 last:border-0 last:pb-0 relative">
        {/* 타임라인 점 */}
        <div className="absolute left-[-2.25rem] top-[0.35rem] w-2 h-2 rounded-full bg-border group-hover:bg-primary transition-colors hidden sm:block" />
        <p className="font-bold text-base text-foreground mb-0.5">{name}</p>
        {role && <p className="text-sm font-semibold text-primary mb-1.5">{role}</p>}
        {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
      </div>
    </div>
  );
}

/* ───────────────── 페이지 ───────────────── */

export default function AboutPage() {
  return (
    <main className="pb-24">

      {/* ── Hero Section ── */}
      <header className="relative overflow-hidden pt-20 pb-20 lg:pt-28 lg:pb-28">
        {/* 배경 그라디언트 장식 */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-[22rem] h-[22rem] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
          {/* 상단 레이블 */}
          <p className="hero-badge inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase mb-6">
            About Me
          </p>

          {/* 메인 타이틀 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1] mb-5">
            한국공인회계사
            <br />
            <span className="text-primary">이재현</span>
            입니다
          </h1>

          {/* 서브타이틀 */}
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-10">
            <strong>회계·재무 전문성</strong>과 <strong>AI의 생산성</strong>을 모두 갖춘 새로운 시대의 전문가를 지향합니다.
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-wrap gap-3 mb-14">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/25 text-sm"
            >
              <Mail className="w-4 h-4" />
              Contact Me
            </Link>
          </div>

          {/* Stats 스트립 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-card px-6 py-5 text-center hover:bg-primary/5 transition-colors"
              >
                <p className="text-2xl font-black text-primary mb-0.5">{s.value}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="mx-auto max-w-5xl px-6 lg:px-8 py-20 space-y-20">

        {/* Education + Career — 2열 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">

          {/* Education */}
          <section>
            <SectionHeading icon={GraduationCap}>Education</SectionHeading>
            <div className="sm:pl-8 space-y-6">
              {education.map((item) => (
                <TimelineItem key={item.name} {...item} />
              ))}
            </div>
          </section>

          {/* Career */}
          <section>
            <SectionHeading icon={Briefcase}>Career</SectionHeading>
            <div className="sm:pl-8 space-y-6">
              {career.map((item) => (
                <TimelineItem key={item.name} {...item} />
              ))}
            </div>
          </section>
        </div>

        {/* Work Experience */}
        <section id="work-experience">
          <SectionHeading icon={ClipboardList}>Key Expertise</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workExperience.map((exp) => (
              <div
                key={exp.title}
                className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                <h3 className="font-bold text-lg text-foreground mb-3">{exp.title}</h3>
                <ul className="space-y-2 pl-1">
                  {exp.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-muted-foreground text-sm leading-relaxed"
                    >
                      <span className="mt-[0.45rem] w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Certificates — 뱃지 클러스터 */}
        <section>
          <SectionHeading icon={BadgeCheck}>Certificates</SectionHeading>
          <div className="space-y-6">
            {certificates.map((cert) => (
              <div key={cert.category} className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* 카테고리 레이블 */}
                <div className="sm:w-36 shrink-0">
                  <span className="inline-flex items-center gap-2 text-base font-bold uppercase tracking-wider text-muted-foreground">
                    <cert.icon className="w-5 h-5 text-primary/80" />
                    {cert.category}
                  </span>
                </div>
                {/* 뱃지 그룹 */}
                <div className="flex flex-wrap gap-2">
                  {cert.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-card border border-border text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Publications */}
        <section>
          <SectionHeading icon={BookOpen}>Publications</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publications.map((pub) => (
              <a
                key={pub.name}
                href={pub.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                {/* 아이콘 */}
                <div className="shrink-0 w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                {/* 텍스트 */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {pub.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {pub.description}
                  </p>
                </div>
                {/* 화살표 */}
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </a>
            ))}
          </div>
        </section>

        {/* Side Projects */}
        <section>
          <SectionHeading icon={Rocket}>Side Projects</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sideProjects.map((proj) => (
              <Link
                key={proj.name}
                href={proj.href}
                className="block p-6 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {proj.name}
                  </span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {proj.techs.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-medium text-muted-foreground bg-muted/50 border border-border px-2 py-1 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* Contact 앵커 */}
      <div id="contact" className="py-1" />
    </main>
  );
}
