"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { GraphIllustration } from "@/components/ui/GraphIllustration";

/* ── SiteIntro Section ── */
export function SiteIntro() {
  return (
    <section className="bg-background py-16 sm:py-24 border-t border-border/50">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left — Text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            {/* Section label */}
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Philosophy
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4">
              지식은{" "}
              <span className="text-primary">연결</span>로 완성된다
            </h2>

            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                꼭 필요할 때 찾으면 없고, 검색해도 찾기 어려우신가요?<br/>
                핵심은 <strong className="text-foreground font-semibold">메타데이터(Metadata)와 연결(Link)</strong>입니다.
              </p>
              <p>
                이 사이트는 단순 폴더 구조를 넘어, AI가 문맥을 이해할 수 있는<br/>
                <strong className="text-foreground font-semibold">
                  Graph
                </strong>
                기반 지식 데이터베이스로의 확장을 지향합니다.
              </p>
            </div>

            {/* Keyword tags */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-6">
              {["GraphRAG", "Ontology", "Linked Knowledge"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA to Guide page */}
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all hover:-translate-y-0.5"
            >
              사이트 소개
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right — Graph Illustration */}
          <div className="hidden md:block">
            <GraphIllustration />
          </div>

        </div>
      </div>
    </section>
  );
}
