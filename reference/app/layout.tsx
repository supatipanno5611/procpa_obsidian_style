import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchProvider } from "@/components/search/SearchContext";
import { SearchCommand } from "@/components/search/SearchCommand";

import { ChatBot } from "@/components/chat/ChatBot";
import "./globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "회계·재무 실무자를 위한 데이터베이스",
    template: "%s | 회계·재무 실무자를 위한 데이터베이스",
  },
  description: "회계·재무 실무자를 위한 데이터베이스 — 실무에 즉시 활용 가능한 회계·재무 지식과 AI 생산성 노하우를 공유합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${pretendard.variable} ${pretendard.className} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SearchProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <SearchCommand />
            <ChatBot />
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
