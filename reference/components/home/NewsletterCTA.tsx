"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type SubmitState = "idle" | "loading" | "success" | "error";

const SUBSCRIBE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_SUBSCRIBE_URL ||
  (process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL || "").replace(
    /\/chat$/,
    "/subscribe"
  );

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || state === "loading") return;

    setState("loading");
    setMessage("");

    try {
      const res = await fetch(SUBSCRIBE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setState("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setState("error");
        setMessage(data.error || "구독 처리 중 오류가 발생했습니다.");
      }
    } catch {
      setState("error");
      setMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }

  return (
    <section className="border-t border-border/50 bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-8 sm:p-12 text-center">
          {/* 배경 장식 */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Newsletter
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl break-keep">
              실무자를 위한 맞춤형 AI·IT 뉴스레터
            </h2>
            <div className="mx-auto mt-4 max-w-2xl space-y-2 text-muted-foreground leading-relaxed break-keep">
              <p>
               최신 AI, IT 트렌드. 비개발자와 회계·재무 실무자에게 꼭 필요한 소식만 선별해서 전해드립니다.
              </p>
              <p>
                유용한 AI 활용 가이드, 업무 자동화 방법 등의 콘텐츠를 가장 먼저 받아보세요.
              </p>
            </div>

            {state === "success" ? (
              <div className="mt-8 flex items-center justify-center gap-2 font-semibold text-brand-series">
                <span className="material-symbols-outlined text-[22px]">
                  check_circle
                </span>
                <span>{message}</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-8 flex max-w-md flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("idle");
                  }}
                  placeholder="hello@example.com"
                  required
                  disabled={state === "loading"}
                  className={cn(
                    "w-full flex-1 rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm backdrop-blur-sm transition-all",
                    "placeholder:text-muted-foreground/50",
                    "focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                />
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className={cn(
                    "btn-gradient inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold shadow-md transition-all sm:w-auto",
                    "disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
                  )}
                >
                  {state === "loading" ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">
                        progress_activity
                      </span>
                      처리 중...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">
                        mail
                      </span>
                      구독하기
                    </>
                  )}
                </button>
              </form>
            )}

            {state === "error" && message && (
              <p className="mt-3 text-sm text-red-500">{message}</p>
            )}

            <p className="mt-4 text-xs text-muted-foreground/70">
              스팸 없이 콘텐츠 알림만 보내드립니다. 언제든 구독을 해지할 수
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
