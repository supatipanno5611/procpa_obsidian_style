"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";
import { sendChatMessage, type ChatMessage as Message, type Source } from "@/lib/rag-client";

interface DisplayMessage {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

const WELCOME_MESSAGE: DisplayMessage = {
  role: "assistant",
  content:
    "안녕하세요! PROCPA 블로그의 AI 어시스턴트입니다.\n회계·재무, AI 활용, Python 자동화 등 블로그 콘텐츠에 대해 질문해주세요.",
};

const SUGGESTED_QUESTIONS = [
  "K-IFRS 1116호란?",
  "회계사 커리어 로드맵",
  "Python 엑셀 자동화",
];

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<DisplayMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [streamingSources, setStreamingSources] = useState<Source[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    async (text?: string) => {
      const userText = (text || input).trim();
      if (!userText || isLoading) return;

      setInput("");
      setIsLoading(true);
      setStreamingContent("");
      setStreamingSources([]);

      const userMessage: DisplayMessage = { role: "user", content: userText };
      setMessages((prev) => [...prev, userMessage]);

      // 대화 기록 구성 (표시 메시지 → API 메시지)
      const apiMessages: Message[] = [
        ...messages
          .filter((m) => m !== WELCOME_MESSAGE)
          .map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: userText },
      ];

      let fullContent = "";

      await sendChatMessage(apiMessages, {
        onContent: (content) => {
          fullContent += content;
          setStreamingContent(fullContent);
        },
        onSources: (sources) => {
          setStreamingSources(sources);
        },
        onDone: () => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: fullContent,
              sources: streamingSources.length > 0 ? streamingSources : undefined,
            },
          ]);
          setStreamingContent("");
          setStreamingSources([]);
          setIsLoading(false);
        },
        onError: (error) => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `오류: ${error}` },
          ]);
          setStreamingContent("");
          setIsLoading(false);
        },
      });
    },
    [input, isLoading, messages, streamingSources]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  const showSuggestions =
    messages.length === 1 && !isLoading && !streamingContent;

  return (
    <div className="flex h-full flex-col bg-background rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            smart_toy
          </span>
          <span className="text-sm font-semibold text-foreground">
            PROCPA AI
          </span>
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} sources={msg.sources} />
        ))}

        {/* Streaming message */}
        {streamingContent && (
          <ChatMessage
            role="assistant"
            content={streamingContent}
            sources={streamingSources.length > 0 ? streamingSources : undefined}
            isStreaming
          />
        )}

        {/* Suggested questions */}
        {showSuggestions && (
          <div className="flex flex-col gap-1.5 mt-2">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-1">
              이런 질문을 해보세요
            </span>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSubmit(q)}
                className="text-left text-xs rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-foreground hover:bg-muted transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/50 px-3 py-3 shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="질문을 입력하세요..."
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-xl border border-border/50 bg-muted/30 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 max-h-24 scrollbar-hide"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isLoading ? "hourglass_empty" : "arrow_upward"}
            </span>
          </button>
        </div>
        <div className="mt-1.5 text-center text-[10px] text-muted-foreground/60">
          Enter 전송 · Shift+Enter 줄바꿈 · Esc 닫기
        </div>
      </div>
    </div>
  );
}
