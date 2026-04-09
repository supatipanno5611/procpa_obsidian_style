import type { Metadata } from "next";
import { Mail, MessageCircle, Github, Send, Youtube, MessageSquare } from "lucide-react";

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
  );
}
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Contact Me",
  description: "프로젝트 협업, 기술 문의, 커피챗 등 언제든 환영합니다.",
};

const contacts = [
  {
    icon: Mail,
    label: "Email",
    href: "mailto:wogus3575@naver.com",
    description: "업무 문의나 협업 제안은 이메일로 편하게 주세요.",
  },
  {
    icon: MessageCircle,
    label: "KakaoTalk",
    href: "https://open.kakao.com/o/sQCXbyXg",
    description: "실시간 소통이 필요하다면 오픈채팅으로 연락주세요.",
  },
  {
    icon: NaverIcon,
    label: "Naver Blog",
    href: "https://blog.naver.com/procpalee",
    description: "다양한 인사이트를 네이버 블로그에 기록합니다.",
  },
  {
    icon: Youtube,
    label: "YouTube",
    href: "https://www.youtube.com/@Jaehyun-f9c",
    description: "영상 콘텐츠는 유튜브 채널에서 만나보실 수 있습니다.",
  },
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/procpalee",
    description: "사이드 프로젝트 소스 코드를 공유합니다.",
  },
];

export default function ContactPage() {
  return (
    <main className="pb-20">
      <PageHero
        badge="Contact"
        title="무엇이든 편하게"
        highlight="문의"
        suffix="주세요"
        description={`가벼운 커피챗도 언제든지 환영입니다.`}
      />

      <div className="gradient-line" />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div>
            <SectionHeading title="Get in Touch" icon={MessageSquare} />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {contacts.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="glass-card group flex items-start gap-4 rounded-xl p-6 transition-all hover:scale-[1.02]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--gradient-start)]/10 to-[var(--gradient-end)]/10 group-hover:from-[var(--gradient-start)]/20 group-hover:to-[var(--gradient-end)]/20 transition-colors">
                    <contact.icon className="h-6 w-6 text-[var(--gradient-mid)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {contact.label}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground/80">
                      {contact.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:pl-8">
            <SectionHeading title="Inquiry Form" icon={Send} />
            <div className="glass-card rounded-2xl p-8 sticky top-24">
              
              <form className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground/80">
                      이름 (Name)
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="block w-full rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm backdrop-blur-sm transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground/80">
                      이메일 (Email)
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="block w-full rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm backdrop-blur-sm transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                      placeholder="hello@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-foreground/80">
                    제목 (Subject)
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="block w-full rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm backdrop-blur-sm transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                    placeholder="프로젝트 협업 제안합니다"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground/80">
                    메시지 (Message)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={8}
                    className="block w-full rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm backdrop-blur-sm resize-none transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                    placeholder="자유롭게 문의 내용을 작성해주세요..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gradient group w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  메시지 보내기
                </button>
                
                <p className="text-center text-xs text-muted-foreground mt-4">
                  보내주신 메시지는 확인 후 최대한 빠르게 답변드리겠습니다.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
