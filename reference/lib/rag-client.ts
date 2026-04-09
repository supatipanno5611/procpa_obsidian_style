/**
 * 클라이언트 RAG 로직
 * Supabase Edge Function과 통신하여 RAG 챗봇 기능을 제공합니다.
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Source {
  title: string;
  slug: string;
  contentType: string;
}

export interface StreamCallbacks {
  onContent: (content: string) => void;
  onSources: (sources: Source[]) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

const SUPABASE_FUNCTION_URL =
  process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL || "";

export async function sendChatMessage(
  messages: ChatMessage[],
  callbacks: StreamCallbacks,
  options?: { topic?: string }
): Promise<void> {
  if (!SUPABASE_FUNCTION_URL) {
    callbacks.onError("챗봇 서비스가 구성되지 않았습니다.");
    return;
  }

  try {
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        topic: options?.topic || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      callbacks.onError(
        errorData.error || `서버 오류 (${response.status})`
      );
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      callbacks.onError("스트리밍을 시작할 수 없습니다.");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);

        if (data === "[DONE]") {
          callbacks.onDone();
          return;
        }

        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "sources") {
            callbacks.onSources(parsed.sources);
          } else if (parsed.type === "content") {
            callbacks.onContent(parsed.content);
          }
        } catch {
          // JSON 파싱 실패 무시
        }
      }
    }

    callbacks.onDone();
  } catch (err) {
    callbacks.onError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
  }
}
