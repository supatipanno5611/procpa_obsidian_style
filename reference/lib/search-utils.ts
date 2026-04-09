import { createElement, Fragment, type ReactNode } from "react";

/** HTML 태그를 제거하고 순수 텍스트 반환 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/** 검색어 부분을 <mark>로 감싸 ReactNode를 반환 */
export function highlightText(text: string, query: string): ReactNode {
  if (!query.trim()) return text;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  if (parts.length === 1) return text;

  return createElement(
    Fragment,
    null,
    ...parts.map((part, i) =>
      regex.test(part)
        ? createElement(
            "mark",
            {
              key: i,
              className:
                "bg-yellow-200/60 dark:bg-yellow-500/30 rounded-sm px-0.5",
            },
            part
          )
        : part
    )
  );
}
