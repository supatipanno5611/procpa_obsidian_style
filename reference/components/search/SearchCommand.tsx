"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Command } from "cmdk";
import { useSearch } from "./SearchContext";

interface SearchItem {
  slug: string;
  title: string;
  type: string;
  description?: string;
}

function highlightText(text: string, query: string) {
  if (!text || !query) return text;
  // Pagefind에서 내려주는 기존 <mark> 태그 제거
  const plainText = text.replace(/<\/?mark>/gi, "");
  
  // 검색어 띄어쓰기 기준으로 분리 (여러 단어 검색 지원)
  const terms = query.trim().split(/\s+/).filter((t) => t.length > 0);
  if (terms.length === 0) return plainText;

  // 정규식용 특수문자 이스케이프 후 정규식 생성
  const escapedTerms = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');

  // 정확히 일치하는 부분만 노란색 커스텀 디자인의 mark 태그로 감싸기
  return plainText.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-900/50 text-foreground px-0.5 rounded-sm font-semibold bg-transparent">$1</mark>'
  );
}

export function SearchCommand() {
  const router = useRouter();
  const { open, setOpen } = useSearch();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setItems([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setItems([]);
      return;
    }

    // Use pagefind for search if available
    async function search() {
      try {
        // @ts-ignore
        const pagefind = await import(/* webpackIgnore: true */ "/pagefind/pagefind.js");
        const searchResult = await pagefind.search(query);
        const results: SearchItem[] = [];

        for (const result of searchResult.results.slice(0, 8)) {
          const data = await result.data();
          results.push({
            slug: data.url || "",
            title: data.meta?.title || "Untitled",
            type: data.meta?.type || "post", // 기본적으로 post로 분류
            description: data.excerpt || "",
          });
        }
        setItems(results);
      } catch {
        setItems([]);
      }
    }
    search();
  }, [query]);

  const handleSelect = (slug: string) => {
    setOpen(false);
    router.push(slug.startsWith("/") ? slug : `/${slug}`);
  };

  if (!open) return null;

  // 결과 분류
  const seriesItems = items.filter(item => item.type === "series" || item.slug.startsWith("/series"));
  const resourceItems = items.filter(item => item.type === "resource" || item.slug.startsWith("/resource"));
  const referenceItems = items.filter(item => item.type === "reference" || item.slug.startsWith("/reference"));
  const postItems = items.filter(item => 
    !seriesItems.includes(item) && 
    !resourceItems.includes(item) && 
    !referenceItems.includes(item)
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity"
        onClick={() => setOpen(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-card rounded-xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-border/50 max-h-[80vh]">
        <Command shouldFilter={false} className="flex flex-col h-full w-full bg-transparent">
          {/* Search Header */}
          <div className="relative flex items-center border-b border-border/50 px-4 py-4 shrink-0">
            <span className="material-symbols-outlined text-primary text-[28px] mr-3">search</span>
            <Command.Input
              value={query}
              onValueChange={setQuery}
              autoFocus
              placeholder="검색어를 입력하세요"
              className="w-full border-none bg-transparent p-0 text-lg text-foreground placeholder-muted-foreground focus:ring-0 focus:outline-none h-10"
            />
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => setOpen(false)}
                className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border/50 bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground hover:bg-accent transition-colors"
              >
                <span className="text-xs">ESC</span>
              </button>
            </div>
          </div>

          <Command.List className="flex-1 overflow-y-auto scrollbar-hide overscroll-contain">
            {query.length < 2 && (
              <div className="py-3 px-2">
                <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  빠른 이동
                </div>
                <Command.Item
                  value="go-explore"
                  onSelect={() => { setOpen(false); router.push("/explore"); }}
                  className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted aria-[selected=true]:bg-muted transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-muted-foreground">explore</span>
                  <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary group-aria-[selected=true]:text-primary transition-colors">탐색</span>
                </Command.Item>
                <Command.Item
                  value="go-topics"
                  onSelect={() => { setOpen(false); router.push("/taxonomy"); }}
                  className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted aria-[selected=true]:bg-muted transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-muted-foreground">category</span>
                  <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary group-aria-[selected=true]:text-primary transition-colors">주제별</span>
                </Command.Item>
                <Command.Item
                  value="toggle-theme"
                  onSelect={() => { setTheme(theme === "dark" ? "light" : "dark"); }}
                  className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted aria-[selected=true]:bg-muted transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-muted-foreground">
                    {theme === "dark" ? "light_mode" : "dark_mode"}
                  </span>
                  <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary group-aria-[selected=true]:text-primary transition-colors">
                    {theme === "dark" ? "라이트 모드" : "다크 모드"}로 전환
                  </span>
                </Command.Item>
              </div>
            )}
            
            {query.length >= 2 && items.length === 0 && (
              <Command.Empty className="px-4 py-8 text-center text-sm text-muted-foreground">
                <span className="material-symbols-outlined text-4xl mb-3 opacity-20 block">search_off</span>
                검색 결과가 없습니다.
              </Command.Empty>
            )}

            {query.length >= 2 && items.length > 0 && (
              <div className="py-4 px-2">
                <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-primary">Suggestions</h3>

                {/* Series Group */}
                {seriesItems.length > 0 && (
                  <div className="mb-2">
                    <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground uppercase mt-2">Series</div>
                    {seriesItems.map(item => (
                      <Command.Item
                        key={item.slug}
                        value={item.title}
                        onSelect={() => handleSelect(item.slug)}
                        className="group flex w-full cursor-pointer items-center gap-3 rounded-lg bg-primary/5 px-3 py-3 text-left ring-1 ring-inset ring-primary/20 mb-1 aria-[selected=true]:bg-primary/10 transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-background text-brand-series shadow-sm">
                          <span className="material-symbols-outlined text-[20px]">library_books</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground truncate" dangerouslySetInnerHTML={{ __html: highlightText(item.title, query) }} />
                          <div className="text-xs text-muted-foreground truncate mt-0.5" dangerouslySetInnerHTML={{ __html: highlightText(item.description || "", query) }} />
                        </div>
                        <span className="material-symbols-outlined text-primary text-[20px] opacity-0 group-hover:opacity-100 group-aria-[selected=true]:opacity-100 transition-opacity">keyboard_return</span>
                      </Command.Item>
                    ))}
                  </div>
                )}

                {/* Posts Group */}
                {postItems.length > 0 && (
                  <div className="mb-2">
                    <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground uppercase mt-2">Posts</div>
                    {postItems.map(item => (
                      <Command.Item
                        key={item.slug}
                        value={item.title}
                        onSelect={() => handleSelect(item.slug)}
                        className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-muted aria-[selected=true]:bg-muted transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground group-hover:bg-background group-hover:text-brand-post group-aria-[selected=true]:bg-background group-aria-[selected=true]:text-brand-post group-hover:shadow-sm transition-all">
                          <span className="material-symbols-outlined text-[20px]">article</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground group-hover:text-primary group-aria-[selected=true]:text-primary transition-colors truncate" dangerouslySetInnerHTML={{ __html: highlightText(item.title, query) }} />
                          <div className="text-xs text-muted-foreground truncate mt-0.5" dangerouslySetInnerHTML={{ __html: highlightText(item.description || "", query) }} />
                        </div>
                      </Command.Item>
                    ))}
                  </div>
                )}

                {/* Resources Group */}
                {resourceItems.length > 0 && (
                  <div className="mb-2">
                    <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground uppercase mt-2">Resources</div>
                    {resourceItems.map(item => (
                      <Command.Item
                        key={item.slug}
                        value={item.title}
                        onSelect={() => handleSelect(item.slug)}
                        className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-muted aria-[selected=true]:bg-muted transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground group-hover:bg-background group-hover:text-brand-reference group-aria-[selected=true]:bg-background group-aria-[selected=true]:text-brand-reference group-hover:shadow-sm transition-all">
                          <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground group-hover:text-primary group-aria-[selected=true]:text-primary transition-colors truncate" dangerouslySetInnerHTML={{ __html: highlightText(item.title, query) }} />
                          <div className="text-xs text-muted-foreground truncate mt-0.5" dangerouslySetInnerHTML={{ __html: highlightText(item.description || "", query) }} />
                        </div>
                        <span className="material-symbols-outlined text-muted-foreground text-[20px] opacity-0 group-hover:opacity-100 group-aria-[selected=true]:opacity-100 transition-opacity">download</span>
                      </Command.Item>
                    ))}
                  </div>
                )}

                {/* References Group */}
                {referenceItems.length > 0 && (
                  <div className="mb-2">
                    <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground uppercase mt-2">References</div>
                    {referenceItems.map(item => (
                      <Command.Item
                        key={item.slug}
                        value={item.title}
                        onSelect={() => handleSelect(item.slug)}
                        className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-muted aria-[selected=true]:bg-muted transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground group-hover:bg-background group-hover:text-brand-post group-aria-[selected=true]:bg-background group-aria-[selected=true]:text-brand-post group-hover:shadow-sm transition-all">
                          <span className="material-symbols-outlined text-[20px]">book</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground group-hover:text-primary group-aria-[selected=true]:text-primary transition-colors truncate" dangerouslySetInnerHTML={{ __html: highlightText(item.title, query) }} />
                          <div className="text-xs text-muted-foreground truncate mt-0.5" dangerouslySetInnerHTML={{ __html: highlightText(item.description || "", query) }} />
                        </div>
                        <span className="material-symbols-outlined text-muted-foreground text-[20px] opacity-0 group-hover:opacity-100 group-aria-[selected=true]:opacity-100 transition-opacity">open_in_new</span>
                      </Command.Item>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Explore shortcut */}
            {query.length >= 2 && (
              <div className="border-t border-border/30 px-2 py-2">
                <Command.Item
                  value={`explore-${query}`}
                  onSelect={() => {
                    setOpen(false);
                    router.push(`/explore?q=${encodeURIComponent(query)}`);
                  }}
                  className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-muted aria-[selected=true]:bg-muted transition-colors"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground group-hover:bg-background group-hover:text-primary group-aria-[selected=true]:bg-background group-aria-[selected=true]:text-primary group-hover:shadow-sm transition-all">
                    <span className="material-symbols-outlined text-[20px]">explore</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground group-hover:text-primary group-aria-[selected=true]:text-primary transition-colors truncate">
                      메타데이터 탐색에서 &quot;{query}&quot; 검색
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      유형·주제·태그 등 필터와 함께 탐색
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[20px] opacity-0 group-hover:opacity-100 group-aria-[selected=true]:opacity-100 transition-opacity">arrow_forward</span>
                </Command.Item>
              </div>
            )}
          </Command.List>

          {/* Footer / Keyboard Hints */}
          <div className="bg-muted px-4 py-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground shrink-0">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="font-sans font-semibold text-foreground">↵</kbd>
                선택
              </span>
              <span className="flex items-center gap-1">
                <kbd className="font-sans font-semibold text-foreground">↑↓</kbd>
                이동
              </span>
              <span className="flex items-center gap-1">
                <kbd className="font-sans font-semibold text-foreground">esc</kbd>
                닫기
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-60 font-semibold">
              <span>PROCPA Search</span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  );
}
