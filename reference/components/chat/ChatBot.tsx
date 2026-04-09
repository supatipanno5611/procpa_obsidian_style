"use client";

import { useState, useEffect } from "react";
import { ChatPanel } from "./ChatPanel";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 환경변수 미설정 시 렌더링하지 않음
  if (!process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL) return null;
  if (!isMounted) return null;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-105 transition-all duration-200"
          aria-label="AI 챗봇 열기"
        >
          <span className="material-symbols-outlined text-[26px]">forum</span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <>
          {/* Mobile: full screen */}
          <div className="fixed inset-0 z-50 sm:hidden">
            <ChatPanel onClose={() => setIsOpen(false)} />
          </div>

          {/* Desktop: floating panel */}
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block w-[400px] h-[550px]">
            <ChatPanel onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
