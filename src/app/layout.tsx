import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { themeScript } from '@/lib/theme-script'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://procpa.co.kr'),
  title: {
    default: 'PROCPA',
    template: '%s · PROCPA',
  },
  description: '회계사의 기록 — 회계·재무 전문성에 AI의 생산성을 더하다.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://procpa.co.kr',
    siteName: 'PROCPA',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground [word-break:keep-all]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
