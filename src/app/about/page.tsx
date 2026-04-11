import type { Metadata } from 'next'
import { Mail, MessageCircle } from 'lucide-react'
import {
  career,
  certificates,
  education,
  expertise,
  publications,
  sideProjects,
  stats,
  contacts,
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
          <div className="font-mono text-[11px] text-muted-foreground">
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

function NaverIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M8 16V8l8 8V8" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  )
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-12">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            About
          </p>
          <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            한국공인회계사
            <br />
            <span className="text-primary">
              이재현
            </span>
            입니다.
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-[1.85] text-muted-foreground sm:text-base">
            <span className="text-foreground">회계·재무 전문성</span>과{' '}
            <span className="text-foreground">AI의 생산성</span>을 모두 갖춘 새로운 시대의
            전문가를 지향합니다.
          </p>

          <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-border/60 pt-10 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-mono text-[10px] text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="mt-2 font-mono text-3xl tracking-tight">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto grid max-w-5xl grid-cols-12 gap-y-12 lg:gap-6 px-6 py-20">
          <div className="col-span-12 lg:col-span-6">
            <div className="font-mono text-[11px] text-muted-foreground">
              Career
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">경력</h2>
            <div className="mt-8">
              <Timeline items={career} />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="font-mono text-[11px] text-muted-foreground">
              Education
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">학력</h2>
            <div className="mt-8">
              <Timeline items={education} />
            </div>
          </div>
        </div>
      </section>

      <Section label="Expertise" title="전문 분야">
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
        <p className="mb-8 text-base leading-relaxed text-muted-foreground">
          다양한 채널을 통해 소통의 문을 열어두고 있습니다. 업무 제안이나
          질문, 가벼운 커피챗까지 어떤 내용이든 편하게 연락해 주세요.
        </p>
        <div className="flex flex-wrap gap-3">
          {contacts.map((c) => {
            const Icon = {
              Email: Mail,
              KakaoTalk: MessageCircle,
              'Naver Blog': NaverIcon,
              YouTube: YoutubeIcon,
              GitHub: GithubIcon,
            }[c.label] || Mail

            return (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                className="group flex items-center gap-2.5 rounded-full border border-border/60 bg-muted/5 px-5 py-2.5 transition-all hover:border-foreground/40 hover:bg-muted/30"
              >
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium">{c.label}</span>
              </a>
            )
          })}
        </div>
      </Section>
    </>
  )
}
