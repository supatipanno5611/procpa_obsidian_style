"use client";

import { useRef } from "react";
import { getPublishedPosts, getAllSeries, type Post, type Series } from "@/lib/content";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getTopicLabel } from "@/lib/taxonomy";
import { TOPIC_TAXONOMY } from "@/lib/topics";

/* ── 캐러셀 컨트롤 훅 ── */
function useCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    const amount = ref.current.offsetWidth * 0.75;
    ref.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };
  return { ref, scroll };
}

/* ── 캐러셀 화살표 버튼 ── */
function CarouselButtons({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onPrev}
        className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
        aria-label="이전"
      >
        <span className="material-symbols-outlined text-[16px]">chevron_left</span>
      </button>
      <button
        onClick={onNext}
        className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
        aria-label="다음"
      >
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
      </button>
    </div>
  );
}

const CARD_CLASS =
  "flex-none w-[80%] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)] snap-start";

export function RecommendSection() {
  const allPosts = getPublishedPosts();
  const allSeries = getAllSeries();

  const recentPosts = allPosts.slice(0, 6);

  const sortedSeries = [...allSeries]
    .filter((s: Series) => {
      const seriesId = s.slug.split("/")[1];
      return allPosts.filter((p: Post) => p.seriesName === seriesId).length > 0;
    })
    .sort((a: Series, b: Series) => {
      const aCount = allPosts.filter((p: Post) => p.seriesName === a.slug.split("/")[1]).length;
      const bCount = allPosts.filter((p: Post) => p.seriesName === b.slug.split("/")[1]).length;
      return bCount - aCount;
    })
    .slice(0, 6);

  const seriesCarousel = useCarousel();
  const postCarousel = useCarousel();

  return (
    <section className="bg-background py-16 sm:py-24 border-t border-border/50">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">

        {/* 섹션 헤더 */}
        <div className="mb-12 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Recommended
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            추천 콘텐츠
          </h2>
          <p className="mt-2 text-muted-foreground">
            인기 있는 시리즈와 최신 포스트를 소개합니다
          </p>
        </div>

        {/* ─── 인기 시리즈 캐러셀 ─── */}
        <div className="mb-12">
          <div className="flex items-center justify-between pb-2 mb-5 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-brand-series">library_books</span>
              <h3 className="font-semibold text-foreground">인기 시리즈</h3>
            </div>
            <CarouselButtons
              onPrev={() => seriesCarousel.scroll("left")}
              onNext={() => seriesCarousel.scroll("right")}
            />
          </div>

          <div
            ref={seriesCarousel.ref}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pt-1 pb-2"
          >
            {sortedSeries.map((s: Series) => {
              const seriesId = s.slug.split("/")[1];
              const chapterCount = allPosts.filter((p: Post) => p.seriesName === seriesId).length;
              const meta = TOPIC_TAXONOMY[s.topic as keyof typeof TOPIC_TAXONOMY];
              const topicLabel = meta ? meta.label : getTopicLabel(s.topic);

              return (
                /* 시리즈 카드: 왼쪽 두꺼운 액센트 바 + 책 느낌 */
                <Link
                  key={s.slug}
                  href={`/${s.slug}`}
                  className={cn(
                    "group relative flex overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-brand-series/40 shadow-sm hover:shadow-md hover:-translate-y-0.5",
                    CARD_CLASS
                  )}
                >
                  {/* 왼쪽 액센트 바 */}
                  <div className="w-1.5 shrink-0 bg-brand-series/50 group-hover:bg-brand-series transition-colors" />

                  <div className="flex flex-1 flex-col p-5">
                    {/* 토픽 배지 */}
                    <span className="inline-flex self-start items-center rounded bg-brand-series/15 text-brand-series text-[10px] px-2 py-0.5 font-bold uppercase tracking-wide mb-3">
                      {topicLabel}
                    </span>

                    {/* 제목 */}
                    <h4 className="text-base font-bold text-foreground group-hover:text-brand-series transition-colors line-clamp-2 mb-2">
                      {s.title}
                    </h4>

                    {/* 설명 */}
                    {(s.description || s.excerpt) && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {s.description || s.excerpt}
                      </p>
                    )}

                    {/* 하단: 챕터 수 */}
                    <div className="mt-auto pt-4 flex items-center gap-1.5 text-xs font-semibold text-brand-series/80">
                      <span className="material-symbols-outlined text-[15px]">auto_stories</span>
                      <span>{chapterCount} Chapters</span>
                    </div>
                  </div>

                  {/* 배경 장식 아이콘 */}
                  <span className="material-symbols-outlined absolute bottom-3 right-3 text-[48px] text-brand-series/8 select-none pointer-events-none">
                    library_books
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ─── 최신 포스트 캐러셀 ─── */}
        <div>
          <div className="flex items-center justify-between pb-2 mb-5 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-brand-post">article</span>
              <h3 className="font-semibold text-foreground">최신 포스트</h3>
            </div>
            <CarouselButtons
              onPrev={() => postCarousel.scroll("left")}
              onNext={() => postCarousel.scroll("right")}
            />
          </div>

          <div
            ref={postCarousel.ref}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pt-1 pb-2"
          >
            {recentPosts.map((post: Post) => (
              /* 포스트 카드: 상단 그라디언트 배너 + 아티클 느낌 */
              <Link
                key={post.slug}
                href={`/${post.slug}`}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-brand-post/40 shadow-sm hover:shadow-md hover:-translate-y-0.5",
                  CARD_CLASS
                )}
              >
                {/* 상단 그라디언트 배너 */}
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-post/80 via-brand-post/40 to-transparent group-hover:from-brand-post group-hover:via-brand-post/60 transition-all" />

                <div className="flex flex-1 flex-col p-5">
                  {/* 토픽 배지 + 날짜 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center rounded bg-primary/10 text-primary text-[10px] px-2 py-0.5 font-bold uppercase tracking-wide">
                      {getTopicLabel(post.topic)}
                    </span>
                    <time className="text-[11px] text-muted-foreground tabular-nums">
                      {new Date(post.date).toLocaleDateString("ko-KR")}
                    </time>
                  </div>

                  {/* 제목 */}
                  <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h4>

                  {/* 설명 */}
                  {(post.description || post.excerpt) && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {post.description || post.excerpt}
                    </p>
                  )}

                  {/* 하단: 읽기 시간 */}
                  <div className="mt-auto pt-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>schedule</span>
                    <span>{post.readingTime}분 읽기</span>
                  </div>
                </div>

                {/* 배경 장식 아이콘 */}
                <span className="material-symbols-outlined absolute bottom-3 right-3 text-[48px] text-brand-post/10 select-none pointer-events-none">
                  article
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
