import Link from "next/link";
import { Github, Mail, MessageCircle, Youtube } from "lucide-react";
import { TAXONOMY } from "@/lib/taxonomy";

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

const socials = [
  { href: "mailto:wogus3575@naver.com", label: "Email", icon: Mail },
  { href: "https://open.kakao.com/o/sQCXbyXg", label: "카카오톡", icon: MessageCircle },
  { href: "https://blog.naver.com/procpalee", label: "네이버 블로그", icon: NaverIcon },
  { href: "https://www.youtube.com/@Jaehyun-f9c", label: "YouTube", icon: Youtube },
  { href: "https://github.com/procpalee", label: "GitHub", icon: Github },
];

const businessDomain = TAXONOMY[0];
const techDomain = TAXONOMY[1];

const businessLinks = businessDomain.topics.map((t) => ({
  href: `/business/${t.key}`,
  label: t.label,
}));

const techLinks = techDomain.topics.map((t) => ({
  href: `/tech/${t.key}`,
  label: t.label,
}));

const infoLinks = [
  { href: "/terms", label: "이용약관" },
  { href: "/disclaimer", label: "면책조항" },
  { href: "/sitemap-page", label: "사이트맵" },
  { href: "/contact", label: "Contact" },
];

const mobileInfoLinks = [
  { href: "/terms", label: "이용약관" },
  { href: "/disclaimer", label: "면책조항" },
  { href: "/sitemap-page", label: "사이트맵" },
];

export function Footer() {
  return (
    <footer className="border-t border-footer-border bg-footer-bg text-footer-fg pt-12 pb-4">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">

        {/* 4-column: 브랜드(2fr) | Topics(1fr) | Types(1fr) | Information(1fr) */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-6 mb-8">

          {/* Col 1: 브랜드 + CPA 소개 + About CTA */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="inline-block mb-3">
              <span className="text-xl font-bold tracking-tighter text-white">PROCPA</span>
            </Link>
            <p className="text-sm text-footer-fg/70 leading-relaxed">
              현직 한국공인회계사가 직접 기획·개발한{" "}
              <br className="hidden md:block" />
              회계실무 · AI활용 지식 플랫폼입니다.
            </p>
            <Link
              href="/about"
              className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary/90 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-primary transition-all hover:gap-2"
            >
              About Me
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Col 2: 회계실무 — 모바일 숨김 */}
          <div className="hidden md:flex flex-col items-start text-left">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              회계실무
            </h4>
            <nav className="flex flex-col gap-2.5 text-sm text-footer-fg/80">
              {businessLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: AI/생산성 — 모바일 숨김 */}
          <div className="hidden md:flex flex-col items-start text-left">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              AI/생산성
            </h4>
            <nav className="flex flex-col gap-2.5 text-sm text-footer-fg/80">
              {techLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4: Information — 모바일 숨김 */}
          <div className="hidden md:flex flex-col items-start text-left">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Information
            </h4>
            <nav className="flex flex-col gap-2.5 text-sm text-footer-fg/80">
              {infoLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* 모바일: 서브메뉴 (3개만) */}
        <div className="flex justify-center gap-4 text-xs text-footer-fg/50 mb-3 md:hidden">
          {mobileInfoLinks.map((link, i) => (
            <span key={link.href} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden="true">·</span>}
              <Link href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            </span>
          ))}
        </div>

        {/* 모바일: 소셜 아이콘 */}
        <div className="flex justify-center gap-2 md:hidden">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-footer-fg/50 hover:text-white transition-colors"
              aria-label={social.label}
            >
              <social.icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        {/* 데스크톱: Copyright + 소셜 아이콘 */}
        <div className="hidden md:flex border-t border-footer-border pt-4 items-center justify-between">
          <p className="text-xs text-footer-fg/50">
            &copy; {new Date().getFullYear()} PROCPA. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-footer-fg/50 hover:text-white transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
