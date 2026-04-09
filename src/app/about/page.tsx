import type { Metadata } from 'next'
import {
  career,
  certificates,
  education,
  expertise,
  publications,
  sideProjects,
  stats,
} from '@/lib/about-data'

export const metadata: Metadata = {
  title: '소개',
  description: '한국공인회계사 이재현 — 회계·재무 전문성과 AI의 생산성을 모두 갖춘 새로운 시대의 전문가.',
}

function Section({
  label,
  title,
  children,
}: {
  label: string
  title?: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto grid max-w-5xl grid-cols-12 gap-6 px-6 py-20">
        <div className="col-span-12 lg:col-span-3">
          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
          {title && (
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          )}
        </div>
        <div className="col-span-12 lg:col-span-9">{children}</div>
      </div>
    </section>
  )
}

function Timeline({ items }: { items: { period: string; title: string }[] }) {
  return (
    <ul className="divide-y divide-border/60">
      {items.map((item) => (
        <li key={item.period + item.title} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground sm:w-32">
            {item.period}
          </span>
          <span className="text-base">{item.title}</span>
        </li>
      ))}
    </ul>
  )
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            About Me
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
            한국공인회계사 <span className="text-primary">이재현</span>입니다.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
            <span className="text-foreground">회계·재무 전문성</span>과{' '}
            <span className="text-foreground">AI의 생산성</span>을 모두 갖춘 새로운 시대의
            전문가를 지향합니다.
          </p>

          <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-border/60 pt-10 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="mt-2 font-mono text-3xl tracking-tight">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section label="Career" title="경력">
        <Timeline items={career} />
      </Section>

      <Section label="Education" title="학력">
        <Timeline items={education} />
      </Section>

      <Section label="Expertise" title="주요 전문 분야">
        <div className="grid gap-10 sm:grid-cols-2">
          {expertise.map((e) => (
            <div key={e.title}>
              <h3 className="text-base font-medium">{e.title}</h3>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
                {e.items.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-primary">·</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Certificates" title="자격증">
        <div className="grid gap-8 sm:grid-cols-3">
          {certificates.map((c) => (
            <div key={c.group}>
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {c.group}
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {c.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Publications" title="저서">
        <div className="grid gap-5 sm:grid-cols-2">
          {publications.map((p) => (
            <a
              key={p.title}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-xl border border-border/60 p-6 transition-colors hover:border-foreground/40"
            >
              <h3 className="text-base font-medium group-hover:text-primary">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.description}</p>
              <div className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Read on WikiDocs →
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section label="Projects" title="사이드 프로젝트">
        <div className="grid gap-5 sm:grid-cols-3">
          {sideProjects.map((p) => (
            <a
              key={p.title}
              href={p.href}
              target={p.href.startsWith('http') ? '_blank' : undefined}
              rel={p.href.startsWith('http') ? 'noreferrer' : undefined}
              className="group rounded-xl border border-border/60 p-6 transition-colors hover:border-foreground/40"
            >
              <h3 className="text-base font-medium group-hover:text-primary">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section label="Contact" title="연락하기">
        <p className="text-base leading-7 text-muted-foreground">
          제안, 질문, 협업 문의는{' '}
          <a
            href="mailto:wogus3575@naver.com"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            wogus3575@naver.com
          </a>
          으로 보내주세요.
        </p>
      </Section>
    </>
  )
}
