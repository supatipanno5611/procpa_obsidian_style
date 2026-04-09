"use client";

import type { Source } from "@/lib/rag-client";
import { SourceCard } from "./SourceCard";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isStreaming?: boolean;
}

export function ChatMessage({
  role,
  content,
  sources,
  isStreaming,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px] ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">
          {isUser ? "person" : "smart_toy"}
        </span>
      </div>

      {/* Message */}
      <div
        className={`flex max-w-[85%] flex-col gap-1.5 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          }`}
        >
          <div className="whitespace-pre-wrap break-words">{content}</div>
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 bg-current opacity-70 animate-pulse ml-0.5 align-middle" />
          )}
        </div>

        {/* Sources */}
        {sources && sources.length > 0 && (
          <div className="flex flex-col gap-1 w-full mt-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-1">
              참고 출처
            </span>
            {sources.map((source) => (
              <SourceCard key={source.slug} source={source} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
