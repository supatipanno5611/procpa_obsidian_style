"use client";

import { useState, useEffect } from "react";
import { SearchButton } from "@/components/search/SearchButton";
import { useSearch } from "@/components/search/SearchContext";

const WORDS = ["AI의 생산성", "IT·데이터 기술을","Vibe Working을"];

export function Hero() {
  const { setOpen } = useSearch();
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < word.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), 80);
    } else if (!deleting && charIndex === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), 40);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % WORDS.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex]);

  const displayText = WORDS[wordIndex].slice(0, charIndex);

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-background">
      {/* Perspective Grid Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="perspective-grid" />
      </div>

      {/* Mesh Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="mesh-glow mesh-glow-center" />
        <div className="mesh-glow mesh-glow-accent" />
      </div>

      <div className="absolute inset-0 dot-grid opacity-[0.18] dark:opacity-[0.10] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28 text-center flex flex-col items-center">
        <p className="hero-badge inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase">
          Home
        </p>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          회계·재무 전문성에{" "}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-500">
            {displayText}
            <span className="typewriter-cursor">|</span>
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-500">
            더하다
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-sm sm:text-lg text-muted-foreground leading-relaxed">
          실무에 즉시 활용 가능한 회계·재무 지식과 AI 생산성 노하우를 공유합니다
        </p>

        {/* Content Counters */}
        <div className="mt-8 flex items-center gap-8 sm:gap-12">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-foreground">2+</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">시리즈</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-foreground">13+</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">포스트</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-foreground">10+</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">레퍼런스</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-foreground">10+</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">자료실</p>
          </div>
        </div>

        <div className="mt-8 mx-auto flex justify-center">
          <SearchButton onClick={() => setOpen(true)} variant="full" />
        </div>
      </div>
    </section>
  );
}
