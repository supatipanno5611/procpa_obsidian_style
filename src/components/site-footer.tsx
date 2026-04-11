import Link from 'next/link'
import { Mail, MessageCircle } from 'lucide-react'

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17.92-.26 1.9-.39 2.87-.39.97 0 1.95.13 2.87.39 2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56 4.57-1.52 7.86-5.83 7.86-10.91C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  )
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  )
}

function NaverIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z" />
    </svg>
  )
}

const socials = [
  { label: 'Email', href: 'mailto:wogus3575@naver.com', icon: Mail },
  { label: 'KakaoTalk', href: 'https://open.kakao.com/o/sQCXbyXg', icon: MessageCircle },
  { label: 'Naver Blog', href: 'https://blog.naver.com/procpalee', icon: NaverIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/@Jaehyun-f9c', icon: YoutubeIcon },
  { label: 'GitHub', href: 'https://github.com/procpalee', icon: GithubIcon },
]

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-3 px-6 py-5 text-center text-xs text-muted-foreground md:h-14 md:grid-cols-3 md:py-0 md:text-left">
        <p className="font-mono md:justify-self-start">© {new Date().getFullYear()} PROCPA</p>
        <nav className="flex items-center justify-center gap-5 md:justify-self-center">
          <Link href="/terms" className="hover:text-foreground">이용약관</Link>
          <Link href="/disclaimer" className="hover:text-foreground">면책조항</Link>
          <Link href="/sitemap.xml" className="hover:text-foreground">사이트맵</Link>
        </nav>
        <div className="flex items-center justify-center gap-4 md:justify-self-end">
          {socials.map((s) => {
            const Icon = s.icon
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="transition-colors hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
